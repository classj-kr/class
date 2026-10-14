"""Consolidate local textbook collections under references/textbooks.

Dry run by default. Stop collectors before running with --apply.
Original documents are renamed on the same volume; only recorded path strings
in UTF-8 metadata and source files are updated. Changed text is backed up.
"""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[3]
MAPPINGS = {
    'tmp/초등교과서_수집': 'references/textbooks/초등',
    'tmp/중고등자료_수집': 'references/textbooks/중고등',
    'tmp/수학자료_정리본': 'references/textbooks/수학',
    'tmp/textbook-research': 'references/textbooks/수집작업',
    'tmp/miraen-issued': 'references/textbooks/수집기록/miraen-issued',
    'tmp/elementary-issued': 'references/textbooks/수집기록/elementary-issued',
    'tmp/assessment-export': 'references/textbooks/수집작업/assessment-export',
}
OTHER_SOURCES = {
    'tmp/curriculum': 'references/moe/local-source',
    'tmp/curriculum-original-backup-20260911': 'references/moe/local-backups/20260911',
    'tmp/korean-dict-nikl-sparse': 'references/dictionaries/korean-dict-nikl-sparse',
    'tmp/kengdic': 'references/dictionaries/kengdic',
    'tmp/kanjivg': 'references/dictionaries/kanjivg',
    'tmp/makemeahanzi': 'references/dictionaries/makemeahanzi',
    'tmp/hanja-grade-dataset': 'references/dictionaries/hanja-grade-dataset',
    'tmp/worddb.json': 'references/dictionaries/worddb.json',
    'tmp/pdfs': 'references/source-documents',
    'tmp/koppen-original': 'references/geography/koppen-original',
}
TEXT_EXTENSIONS = {'.py', '.js', '.cjs', '.mjs', '.ts', '.json', '.jsonl',
                   '.csv', '.html', '.md', '.txt', '.log', '.yaml', '.yml'}
SKIP = {'.git', 'node_modules', '__pycache__', 'python-packages', '.venv'}


def safe_path(relative):
    target = ROOT / relative
    if not target.resolve().is_relative_to(ROOT) or target.resolve() == ROOT:
        raise ValueError(f'Unsafe path: {relative}')
    return target


def walk(directory):
    for current, directories, filenames in os.walk(directory):
        for name in directories + filenames:
            child = Path(current) / name
            if child.is_symlink() or child.is_junction():
                raise ValueError(f'Linked path requires manual review: {child}')
        for name in filenames:
            yield Path(current) / name


def inventory(directory):
    count = size = 0
    for file in walk(directory):
        count += 1
        size += file.stat().st_size
    return {'files': count, 'bytes': size}


def variants(old, new):
    pairs = {old: new}
    if quote(old) != old:
        pairs[quote(old)] = quote(new)
    for separator in ('\\', '\\\\'):
        pairs[old.replace('/', separator)] = new.replace('/', separator)
    for left, right in list(pairs.items()):
        pairs.setdefault(json.dumps(left)[1:-1], json.dumps(right)[1:-1])
    return list(pairs.items())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--other-sources', action='store_true',
                        help='Consolidate dictionary, curriculum and document sources')
    args = parser.parse_args()
    mappings = dict(OTHER_SOURCES if args.other_sources else MAPPINGS)
    # Keep collector logs and download manifests next to the collection.
    for file in (() if args.other_sources or not (ROOT / 'tmp').exists() else (ROOT / 'tmp').iterdir()):
        if file.is_file() and file.suffix.lower() in {'.json', '.log', '.txt', '.jpg'}:
            if any(word in file.name.lower() for word in
                   ('douclass', 'miraen', 'textbook', 'secondary-catalog', '교과서')):
                mappings[file.relative_to(ROOT).as_posix()] = (
                    'references/textbooks/수집기록/기존작업/' + file.name)
    report_dir = ROOT / 'references/textbooks/수집기록/경로정리-20261010'
    if args.other_sources:
        report_dir = ROOT / 'references/textbooks/수집기록/경로정리-기타원본-20261010'
    if args.apply and report_dir.exists():
        raise ValueError('Migration report already exists; refusing to overwrite backups')
    plans = []
    for old, new in mappings.items():
        source, destination = safe_path(old), safe_path(new)
        if not source.exists():
            continue
        if destination.exists():
            raise ValueError(f'Destination already exists: {new}')
        stats = inventory(source) if source.is_dir() else {
            'files': 1, 'bytes': source.stat().st_size}
        plans.append({'old': old, 'new': new, **stats})
    print(json.dumps({'moveTargets': len(plans),
                      'files': sum(p['files'] for p in plans),
                      'bytes': sum(p['bytes'] for p in plans),
                      'apply': args.apply}, ensure_ascii=False))
    if not args.apply:
        return
    report_dir.mkdir(parents=True)
    report = {'moves': [], 'updatedText': []}

    def save_report():
        (report_dir / 'manifest.json').write_text(
            json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')

    save_report()
    for item in plans:
        source, destination = safe_path(item['old']), safe_path(item['new'])
        destination.parent.mkdir(parents=True, exist_ok=True)
        os.rename(source, destination)
        report['moves'].append(item)
        save_report()
        actual = inventory(destination) if destination.is_dir() else {
            'files': 1, 'bytes': destination.stat().st_size}
        if actual != {key: item[key] for key in ('files', 'bytes')}:
            raise ValueError(f'Move verification failed: {item["new"]}')
    candidates = set()
    tracked = subprocess.check_output(
        ['git', 'ls-files', '-co', '--exclude-standard', '-z'], cwd=ROOT)
    for relative in tracked.decode('utf-8').split('\0'):
        if relative:
            candidates.add(ROOT / relative)
    for directory in (ROOT / 'references', ROOT / 'tmp'):
        for current, directories, filenames in os.walk(directory):
            directories[:] = [d for d in directories if d not in SKIP
                               and not d.startswith('경로정리-')
                               and not (Path(current) / d).is_junction()]
            # tmp retains unrelated development artifacts; inspect only top level.
            if Path(current) == ROOT / 'tmp':
                directories.clear()
            for name in filenames:
                candidates.add(Path(current) / name)
    replacements = dict(pair for old, new in mappings.items()
                        for pair in variants(old, new))
    replacements = sorted(replacements.items(), key=lambda pair: -len(pair[0]))
    for file in sorted(candidates):
        if (not file.is_file() or file.suffix.lower() not in TEXT_EXTENSIONS
                or file == Path(__file__).resolve() or file.is_relative_to(report_dir)
                or any(part.startswith('경로정리-') for part in file.relative_to(ROOT).parts)
                or any(part in SKIP for part in file.relative_to(ROOT).parts)):
            continue
        original = file.read_bytes()
        if b'tmp' not in original:
            continue
        try:
            text = original.decode('utf-8')
        except UnicodeDecodeError:
            continue
        changed = text
        for old, new in replacements:
            changed = changed.replace(old, new)
        if file.suffix.lower() == '.py':
            for old, new in mappings.items():
                parts = old.split('/')
                if len(parts) == 2:
                    pattern = r'''['"]tmp['"]\s*/\s*['"]''' + re.escape(parts[1]) + r'''['"]'''
                    changed = re.sub(pattern, lambda match: repr(new), changed)
        if changed == text:
            continue
        if file.suffix.lower() == '.json':
            json.loads(changed.lstrip('\ufeff'))
        relative = file.relative_to(ROOT)
        backup = report_dir / 'before-path-update' / relative
        backup.parent.mkdir(parents=True, exist_ok=True)
        backup.write_bytes(original)
        temporary = file.with_name(file.name + '.storage-migration-tmp')
        temporary.write_bytes(changed.encode('utf-8'))
        os.replace(temporary, file)
        report['updatedText'].append(relative.as_posix())
    save_report()
    print(json.dumps({'verifiedMoves': len(report['moves']),
                      'updatedTextFiles': len(report['updatedText']),
                      'report': report_dir.relative_to(ROOT).as_posix()}, ensure_ascii=False))


if __name__ == '__main__':
    main()
