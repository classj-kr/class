"""Consolidate generated artifacts and archive historical workspace tools.

Dry run by default. Originals and before-edit text are preserved. No patch
script is executed. Stop ongoing visual audits before applying this migration.
"""
import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[3]
spec = importlib.util.spec_from_file_location(
    'collection_storage', ROOT / 'scripts/archive/maintenance/consolidate-textbook-storage.py')
storage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(storage)
TEXT = {'.js', '.cjs', '.mjs', '.py', '.html', '.json', '.md', '.txt', '.csv', '.log', '.yml', '.yaml'}
OLD_PATCH = re.compile(
    r'^(repair-|fix-|finish-|finalize-|refine-|complete-|compact-planet-'
    r'|connect-(?:final-|more-|required-|science-exam)'
    r'|science-(?:scope-batch\d+|core-|scope-final-polish|supplement-extension-patch'
    r'|life-observation-update|verification-polish|capacitor-scope|audit-parser-patch))')
SOURCES = {
    'terrain-source-preview': 'references/geography/terrain-source-preview',
    'hwpx-schemas': 'references/formats/hwpx-schemas',
    'hwpx-schemas-2011': 'references/formats/hwpx-schemas-2011',
    'ChosunGs.zip': 'references/fonts/originals/ChosunGs.zip',
    'ChosunKm.zip': 'references/fonts/originals/ChosunKm.zip',
    'ChosunSm.zip': 'references/fonts/originals/ChosunSm.zip',
    'NotoMusic-Regular.ttf': 'references/fonts/NotoMusic-Regular.ttf',
    'koppen-source.zip': 'references/geography/koppen-source.zip',
}
CACHES = {'pitchdeps', 'pydeps', 'atlas-verification-libs'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--archive-root', type=Path, required=True)
    args = parser.parse_args()
    archive = args.archive_root.resolve()
    if archive.is_relative_to(ROOT):
        raise ValueError('Archive must be outside the project')
    report_dir = ROOT / 'outputs/maintenance/workspace-cleanup-20261010'
    if args.apply and (report_dir.exists() or archive.exists()):
        raise ValueError('Report or archive exists; refusing to overwrite')
    mappings, archived = {}, {}
    for item in ((ROOT / 'output').iterdir() if (ROOT / 'output').exists() else ()):
        mappings[item.relative_to(ROOT).as_posix()] = 'outputs/' + item.name
    for item in ((ROOT / 'tmp').iterdir() if (ROOT / 'tmp').exists() else ()):
        old = item.relative_to(ROOT).as_posix()
        if item.name in SOURCES:
            mappings[old] = SOURCES[item.name]
        elif item.name in CACHES:
            mappings[old] = 'tools/.cache/' + item.name
        elif item.name.startswith(('chrome-', 'edge-')) or item.name == '__pycache__':
            archived[old] = archive / 'temporary-profiles' / item.name
        elif item.is_file() and item.suffix in {'.py', '.cjs', '.mjs', '.js', '.ps1', '.patch'}:
            archived[old] = archive / 'historical-local-scripts' / item.name
        elif item.is_dir() and item.name.startswith(('rotation-export-', 'stamp-')):
            mappings[old] = 'outputs/exports/' + item.name
        elif item.is_dir():
            mappings[old] = 'outputs/qa/' + item.name
        else:
            mappings[old] = 'outputs/work/' + item.name
    for script in (ROOT / 'scripts').glob('*.cjs'):
        if OLD_PATCH.match(script.name):
            text = script.read_text(encoding='utf-8')
            if '__dirname' in text or '__filename' in text:
                raise ValueError(f'Needs manual source-root review: {script.name}')
            mappings[script.relative_to(ROOT).as_posix()] = 'scripts/archive/science/' + script.name
    moves = []
    for old, destination in list(mappings.items()) + list(archived.items()):
        source = storage.safe_path(old)
        target = storage.safe_path(destination) if isinstance(destination, str) else destination
        if target.exists():
            raise ValueError(f'Destination exists: {target}')
        stats = storage.inventory(source) if source.is_dir() else {
            'files': 1, 'bytes': source.stat().st_size}
        moves.append({'old': old, 'new': str(target), 'archived': old in archived, **stats})
    print(json.dumps({'targets': len(moves), 'files': sum(x['files'] for x in moves),
                      'MiB': round(sum(x['bytes'] for x in moves) / 1024**2, 1),
                      'sciencePatchScripts': sum(x.startswith('scripts/') for x in mappings),
                      'apply': args.apply}), flush=True)
    if not args.apply:
        return
    report_dir.mkdir(parents=True)
    report = {'moves': [], 'updatedText': []}

    def save_report():
        (report_dir / 'manifest.json').write_text(
            json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')

    save_report()
    # Capture tracked source locations before files are moved.
    tracked = subprocess.check_output(
        ['git', 'ls-files', '-co', '--exclude-standard', '-z'], cwd=ROOT).decode('utf-8').split('\0')
    for move in moves:
        source, target = storage.safe_path(move['old']), Path(move['new'])
        target.parent.mkdir(parents=True, exist_ok=True)
        if move['archived']:
            shutil.move(str(source), str(target))
        else:
            os.rename(source, target)
        report['moves'].append(move)
        save_report()
        actual = storage.inventory(target) if target.is_dir() else {
            'files': 1, 'bytes': target.stat().st_size}
        if actual != {key: move[key] for key in ('files', 'bytes')}:
            raise ValueError(f'Move verification failed: {move["old"]}')
    for name in ('output', 'tmp'):
        (ROOT / name).rmdir()

    def relocated(relative):
        for old, new in sorted(mappings.items(), key=lambda pair: -len(pair[0])):
            if relative == old or relative.startswith(old + '/'):
                return new + relative[len(old):]
        return relative

    candidates = {relocated(rel): rel for rel in tracked if rel and rel not in archived}
    for directory in ('outputs',):
        for current, dirs, names in os.walk(ROOT / directory):
            dirs[:] = [d for d in dirs if d not in {'node_modules', '__pycache__', '.git', 'maintenance'}]
            for name in names:
                path = Path(current) / name
                relative = path.relative_to(ROOT).as_posix()
                if relative not in candidates:
                    original = relative
                    for old, new in mappings.items():
                        if relative == new or relative.startswith(new + '/'):
                            original = old + relative[len(new):]
                            break
                    candidates[relative] = original
    replacements = dict(pair for old, new in mappings.items() for pair in storage.variants(old, new))
    replacements.update(dict(storage.variants('output/', 'outputs/')))
    replacements = sorted(replacements.items(), key=lambda pair: -len(pair[0]))
    fixture_files = {'scripts/build-render-assets.test.mjs', 'game-hub-server/render-prune.mjs',
                     'game-hub-server/render-prune.test.mjs'}
    for relative, original_relative in sorted(candidates.items()):
        file = ROOT / relative
        if (not file.is_file() or file.suffix not in TEXT or file == Path(__file__).resolve()
                or any(part in {'node_modules', '__pycache__', '.git', 'maintenance', 'before-path-update'}
                       or part.startswith('경로정리-') for part in file.parts)):
            continue
        if file.is_relative_to(ROOT / 'tools/.cache'):
            continue
        original = file.read_bytes()
        try:
            text = original.decode('utf-8')
        except UnicodeDecodeError:
            continue
        changed = text
        if relative not in fixture_files:
            for old, new in replacements:
                changed = changed.replace(old, new)
            # Handle path.join(root, 'output', ...) without replacing DOM <output>.
            changed = re.sub(r'''(\bpath\.(?:join|resolve)\(\s*(?:root|ROOT|repoRoot|__dirname)\s*,\s*)(['"])output\2''',
                             lambda m: m[1] + m[2] + 'outputs' + m[2], changed)
            for old, new in mappings.items():
                if old.startswith('tmp/'):
                    name = old.split('/', 1)[1]
                    if file.suffix == '.py':
                        changed = re.sub(r'''['"]tmp['"]\s*/\s*['"]''' + re.escape(name) + r'''['"]''',
                                         lambda m: repr(new), changed)
                    if file.suffix in {'.js', '.cjs', '.mjs'}:
                        changed = re.sub(r'''['"]tmp['"]\s*,\s*['"]''' + re.escape(name) + r'''['"]''',
                                         lambda m: json.dumps(new, ensure_ascii=False), changed)
        if file.suffix in {'.js', '.cjs', '.mjs'}:
            old_parent, new_parent = (ROOT / original_relative).parent, file.parent

            def require_path(match):
                value = match[2]
                target = Path(os.path.abspath(old_parent / value))
                try:
                    target_relative = target.relative_to(ROOT).as_posix()
                except ValueError:
                    return match[0]
                new_target = ROOT / relocated(target_relative)
                if old_parent == new_parent and target == new_target:
                    return match[0]
                updated = os.path.relpath(new_target, new_parent).replace(os.sep, '/')
                if not updated.startswith('.'):
                    updated = './' + updated
                return 'require(' + match[1] + updated + match[1] + ')'

            changed = re.sub(r'''require\((['"])(\.[^'"]+)\1\)''', require_path, changed)
        if changed == text:
            continue
        if file.suffix == '.json':
            json.loads(changed.lstrip('\ufeff'))
        backup = report_dir / 'before-path-update' / relative
        backup.parent.mkdir(parents=True, exist_ok=True)
        backup.write_bytes(original)
        temporary = file.with_name(file.name + '.cleanup-tmp')
        temporary.write_bytes(changed.encode('utf-8'))
        os.replace(temporary, file)
        report['updatedText'].append(relative)
    save_report()
    print(json.dumps({'verifiedMoves': len(report['moves']),
                      'updatedTextFiles': len(report['updatedText'])}), flush=True)


if __name__ == '__main__':
    main()
