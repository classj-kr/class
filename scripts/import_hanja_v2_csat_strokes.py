import json
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_DIR = ROOT / 'scripts'
KVG_DIR = ROOT / 'references/dictionaries/kanjivg' / 'kanji'
MMH_GRAPHICS = ROOT / 'references/dictionaries/makemeahanzi' / 'graphics.txt'
STROKE_PATH = SCRIPT_DIR / 'hanja-strokes.json'
LESSON_PATH = SCRIPT_DIR / 'hanja-v2-lessons-06.json'
CANDIDATE_PATH = SCRIPT_DIR / 'hanja-csat-expansion-candidates.json'

lessons = json.loads(LESSON_PATH.read_text(encoding='utf-8'))
candidates = json.loads(CANDIDATE_PATH.read_text(encoding='utf-8'))['characters']
expected = {item['character']: item['strokes'] for item in candidates}
characters = [item['character'] for lesson in lessons for item in lesson['characters']]
strokes = json.loads(STROKE_PATH.read_text(encoding='utf-8'))
imported, missing, count_differences = {}, [], []

for character in characters:
    code = f'{ord(character):05x}'
    svg_path = KVG_DIR / f'{code}.svg'
    if not svg_path.exists():
        missing.append(character)
        continue
    root = ET.parse(svg_path).getroot()
    group = next((element for element in root.iter() if element.tag.endswith('g') and element.get('id') == f'kvg:StrokePaths_{code}'), None)
    paths = [element.get('d') for element in group.iter() if element.tag.endswith('path') and element.get('d')] if group is not None else []
    if not paths:
        missing.append(character)
        continue
    if len(paths) != expected[character]:
        count_differences.append({'character': character, 'koreanCount': expected[character], 'kanjiVGPaths': len(paths)})
    imported[character] = paths

fallback = {}
if missing:
    wanted = set(missing)
    with MMH_GRAPHICS.open(encoding='utf-8') as stream:
        for line in stream:
            row = json.loads(line)
            character = row.get('character')
            if character not in wanted:
                continue
            paths = []
            for median in row.get('medians', []):
                if len(median) < 2:
                    continue
                points = [(round(x * 0.1, 2), round((1024 - y) * 0.1, 2)) for x, y in median]
                paths.append('M' + 'L'.join(f'{x},{y}' for x, y in points))
            if paths:
                fallback[character] = paths
    still_missing = [character for character in missing if character not in fallback]
    if still_missing:
        print(json.dumps({'stillMissing': still_missing}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    imported.update(fallback)

if len(imported) != len(characters):
    raise RuntimeError(f'Expected {len(characters)} imported characters, got {len(imported)}')
strokes.update(imported)
STROKE_PATH.write_text(json.dumps(strokes, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({
    'characters': len(characters),
    'kanjiVG': len(characters) - len(fallback),
    'makeMeAHanziFallback': sorted(fallback),
    'strokeCountConventionDifferences': count_differences,
    'totalStrokeCharacters': len(strokes),
}, ensure_ascii=False, indent=2))