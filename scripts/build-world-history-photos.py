"""Extract verified textbook photo objects without copying surrounding page text."""
import hashlib
import io
import json
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPECS = ROOT / 'scripts/world-history-photos.json'
OUT = ROOT / 'learning/inquiry/globe/history/photos'


def build():
    specs = json.loads(SPECS.read_text(encoding='utf-8'))
    audit = json.loads((ROOT / 'docs/world-history-content-audit.json').read_text(encoding='utf-8'))
    source = next(s for s in audit['sources'] if s['id'] == 'source-00')
    source_path = ROOT / source['path']
    source_hash = hashlib.sha256(source_path.read_bytes()).hexdigest()
    assert source_hash == source['sha256'], 'Source textbook changed; review photo objects again'
    doc = pymupdf.open(source_path)
    OUT.mkdir(parents=True, exist_ok=True)
    report, published = [], []
    for spec in specs:
        page = doc[spec['page'] - 1]
        info = next(i for i in page.get_image_info(xrefs=True) if i['xref'] == spec['xref'])
        extracted = doc.extract_image(spec['xref'])
        pix = pymupdf.Pixmap(doc, spec['xref'])
        if pix.colorspace.n != 3:
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        if extracted.get('smask', 0):
            pix = pymupdf.Pixmap(pix, pymupdf.Pixmap(doc, extracted['smask']))
        image = Image.frombytes('RGBA' if pix.alpha else 'RGB', (pix.width, pix.height), pix.samples)
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        target = OUT / f"{spec['id']}.webp"
        image.save(target, 'WEBP', lossless=True, exact=True, method=6)
        decoded = Image.open(io.BytesIO(target.read_bytes())).convert(image.mode)
        assert decoded.size == image.size and decoded.tobytes() == image.tobytes()
        entry = {k: v for k, v in spec.items() if k not in ['page', 'xref']}
        entry.update(src=f"photos/{spec['id']}.webp", width=image.width, height=image.height,
                     credit=f"미래엔 세계사(남궁원), {spec['page']}쪽")
        published.append(entry)
        report.append(dict(id=spec['id'], source=source['path'], pdfPage=spec['page'], xref=spec['xref'],
                           sourceBBox=list(info['bbox']), sourceSha256=source_hash,
                           sourcePixels=[info['width'], info['height']], pixels=list(image.size),
                           alpha=bool(pix.alpha), imageSha256=hashlib.sha256(target.read_bytes()).hexdigest(),
                           losslessDecodedEqual=True))
        print(spec['id'], image.size, flush=True)
    doc.close()
    (OUT.parent / 'photos.mjs').write_text(
        '// Generated from reviewed textbook photo objects by scripts/build-world-history-photos.py.\n'
        'export const PHOTOS = ' + json.dumps(published, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    (ROOT / 'docs/world-history-photo-sources.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    build()
