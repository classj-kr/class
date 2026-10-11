"""Convert repository site rasters and review captures to verified lossless WebP.

Only files inventoried by rg in learning/ and docs/ are included. Downloaded
reference collections, dependencies, extension icons, and vector assets are
outside this migration. Originals are removed only after decoding and comparing
the replacement pixels, updating references, and checking the source hash.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from hashlib import sha256
from pathlib import Path
from urllib.parse import unquote, quote
import argparse
import json
import re
import subprocess

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RASTER = {'.png', '.jpg', '.jpeg'}
TEXT = {'.md', '.html', '.css', '.js', '.mjs', '.cjs', '.json', '.py', '.txt'}


def inventory():
    return [ROOT / p for p in subprocess.check_output(
        ['rg', '--files', '--hidden', '-g', '!.git', '-g', '!node_modules'],
        cwd=ROOT, encoding='utf-8').splitlines()]


def rgba(path):
    with Image.open(path) as image:
        if getattr(image, 'n_frames', 1) != 1:
            raise ValueError(f'Animated image requires a separate conversion: {path}')
        return image.convert('RGBA')


def same_pixels(a, b):
    return a.size == b.size and a.tobytes() == b.tobytes()


def convert(source):
    before = sha256(source.read_bytes()).hexdigest()
    original = rgba(source)
    target = source.with_suffix('.webp')
    if target.exists() and not same_pixels(original, rgba(target)):
        target = source.with_name(source.stem + '-' + source.suffix[1:] + '.webp')
    reused = target.exists()
    if reused:
        if not same_pixels(original, rgba(target)):
            raise ValueError(f'Different existing image at {target}')
    else:
        original.save(target, 'WEBP', lossless=True, exact=True, method=3,
                      icc_profile=original.info.get('icc_profile', b''),
                      exif=original.info.get('exif', b''))
    if not same_pixels(original, rgba(target)):
        raise ValueError(f'Pixel comparison failed: {source}')
    return {'old': source.relative_to(ROOT).as_posix(),
            'new': target.relative_to(ROOT).as_posix(), 'sha256': before,
            'before_bytes': source.stat().st_size, 'after_bytes': target.stat().st_size,
            'width': original.width, 'height': original.height, 'reused': reused}


def update_references(files, records):
    mapping = {str((ROOT / r['old']).resolve()).casefold(): ROOT / r['new'] for r in records}
    # Reports also contain paths relative to their screenshot folder.
    suffixes = {}
    for row in records:
        parts = row['old'].split('/')
        for i in range(len(parts)):
            suffixes.setdefault('/'.join(parts[i:]), []).append(row)
    token = re.compile(r'[^\s<>"\'`()\[\]{},;=]+\.(?:png|jpe?g)\b', re.I)
    changed = []
    for path in files:
        if path.suffix.lower() not in TEXT or 'vendor' in path.parts or path.relative_to(ROOT).parts[0] in {'scripts', 'tests'}:
            continue
        raw = path.read_bytes()
        try:
            text = raw.decode('utf-8')
        except UnicodeDecodeError:
            continue
        def replace(match):
            old = match.group(0)
            normalized = unquote(old).replace('\\', '/')
            if normalized.startswith(('https:', 'http:', '//', 'data:')):
                return old
            for candidate in (path.parent / normalized, ROOT / normalized.lstrip('/')):
                target = mapping.get(str(candidate.resolve()).casefold())
                if target:
                    if target.stem == candidate.stem:
                        return old[:old.rfind('.')] + target.suffix
                    name = quote(target.name) if '%' in old else target.name
                    cut = max(old.rfind('/'), old.rfind('\\'))
                    return old[:cut+1] + name
            rows = suffixes.get(normalized)
            if len(rows or []) == 1 and path.parts[len(ROOT.parts)] == 'docs':
                row = rows[0]
                name = Path(row['new']).name
                return old[:old.rfind('/')+1] + (quote(name) if '%' in old else name)
            return old
        new = token.sub(replace, text)
        if new != text:
            path.write_bytes(new.encode('utf-8'))
            changed.append(path.relative_to(ROOT).as_posix())
    return changed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    files = inventory()
    sources = [p for p in files if p.suffix.lower() in RASTER and p.relative_to(ROOT).parts[0] in {'docs', 'learning'}]
    print(json.dumps({'count': len(sources), 'bytes': sum(p.stat().st_size for p in sources)}), flush=True)
    if not args.apply or not sources:
        return
    records = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        for future in as_completed([pool.submit(convert, path) for path in sources]):
            records.append(future.result())
            if len(records) % 200 == 0:
                print(f'Verified {len(records)}/{len(sources)}', flush=True)
    changed = update_references(files, records)
    audit = ROOT / 'tmp/webp-migration'
    audit.mkdir(parents=True, exist_ok=True)
    (audit / 'manifest.json').write_text(json.dumps({'images': records, 'references': changed}, ensure_ascii=False, indent=2), encoding='utf-8')
    # Verify every deletion target and source before removing any original.
    for row in records:
        source = (ROOT / row['old']).resolve()
        if not source.is_relative_to(ROOT) or source.is_symlink():
            raise ValueError(f'Unsafe source path: {source}')
        if sha256(source.read_bytes()).hexdigest() != row['sha256']:
            raise ValueError(f'Source changed during conversion: {source}')
    for row in records:
        (ROOT / row['old']).unlink()
    result = {'converted': len(records), 'reused_identical': sum(r['reused'] for r in records),
              'before_bytes': sum(r['before_bytes'] for r in records),
              'after_bytes': sum(r['after_bytes'] for r in records), 'reference_files': len(changed)}
    (audit / 'summary.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps(result), flush=True)


if __name__ == '__main__':
    main()
