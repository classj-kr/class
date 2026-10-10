import ast
import csv
import io
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_DIR = ROOT / 'scripts'
GRADE_CSV = ROOT / 'references/dictionaries/hanja-grade-dataset' / 'hanja.csv'
KRDICT_DIR = ROOT / 'references/dictionaries/korean-dict-nikl-sparse' / 'krdict'
CANDIDATE_OUT = SCRIPT_DIR / 'hanja-grade5-expansion-candidates.json'
LESSON_OUT = SCRIPT_DIR / 'hanja-v2-lessons-06.json'
STANDARD_OUT = SCRIPT_DIR / 'hanja-curriculum-expanded.json'

LEVELS = {'8급', '7급Ⅱ', '7급', '6급Ⅱ', '6급', '5급Ⅱ', '5급'}
EXCLUDED = set()
HANGUL = re.compile(r'^[가-힣]{2,6}$')
CJK = re.compile(r'^[\u3400-\u9fff\uf900-\ufaff]+$')
INVALID_XML = re.compile(rb'[\x00-\x08\x0b\x0c\x0e-\x1f]')


def norm(value):
    return unicodedata.normalize('NFKC', value or '').replace(' ', '').replace('^', '')


def feat_value(element, att):
    for feat in element.findall('feat'):
        if feat.get('att') == att:
            return feat.get('val', '')
    return ''


def nested_feat_value(element, path, att):
    child = element.find(path)
    return feat_value(child, att) if child is not None else ''


def clean_hun(value):
    return re.sub(r'\[.*?\]|\(.*?\)', '', value).strip()


def initial_variants(sound):
    variants = {sound}
    swaps = {
        '녀':'여','뇨':'요','뉴':'유','니':'이',
        '라':'나','래':'내','로':'노','뢰':'뇌','루':'누',
        '락':'낙','란':'난','람':'남','랑':'낭','략':'약','량':'양','려':'여','력':'역','련':'연','렬':'열','령':'영','례':'예','료':'요','류':'유','륙':'육','률':'율','리':'이',
    }
    if sound in swaps:
        variants.add(swaps[sound])
    return variants


def sentence_score(sentence):
    score = abs(len(sentence) - 48)
    if not re.search(r'[다요]\.$', sentence): score += 100
    if re.search(r'[?？!！]', sentence): score += 100
    if re.search(r'[“”\"\']', sentence): score += 35
    if re.search(r'민준|지수|승규|유민|김 과장|김 기자|김 대리|그녀는|나는 |우리 가족|남편|아내|어머니께서|아버지께서', sentence): score += 60
    if len(sentence) < 24: score += 80
    if len(sentence) > 95: score += 45
    return score


def best_sentence(sentences):
    clean = sorted({re.sub(r'\s{2,}', ' ', value).strip() for value in sentences})
    usable = [value for value in clean if 24 <= len(value) <= 110 and re.search(r'[다요]\.$', value) and not re.search(r'[?？]', value)]
    return min(usable, key=lambda value: (sentence_score(value), value), default='')


def load_metadata():
    current = set()
    for number in range(1, 6):
        lessons = json.loads((SCRIPT_DIR / f'hanja-v2-lessons-{number:02d}.json').read_text(encoding='utf-8'))
        current.update(norm(character['character']) for lesson in lessons for character in lesson['characters'])

    metadata = {}
    standard = []
    with GRADE_CSV.open(encoding='utf-8-sig', newline='') as stream:
        for row in csv.DictReader(stream):
            if row['level'] not in LEVELS:
                continue
            character = norm(row['hanja'])
            standard.append(character)
            parsed = ast.literal_eval(row['meaning'])
            forms = []
            for group in parsed:
                if not group or len(group) < 2:
                    continue
                meanings, sounds = group[0], group[1]
                for meaning in meanings:
                    hun = clean_hun(meaning)
                    for sound in sounds:
                        if hun and sound and {'hun': hun, 'eum': sound} not in forms:
                            forms.append({'hun': hun, 'eum': sound})
            if character not in metadata:
                metadata[character] = {
                    'character': character,
                    'level': row['level'],
                    'mainSound': row['main_sound'],
                    'forms': forms or [{'hun': '뜻', 'eum': row['main_sound']}],
                    'strokes': int(row['total_strokes']),
                }

    missing = [character for character in standard if character not in current and character not in EXCLUDED]
    missing = list(dict.fromkeys(missing))
    if len(current) != 310 or len(missing) != 195:
        raise RuntimeError(f'Expected 310 current and 195 standard additions, got {len(current)} and {len(missing)}')
    return current, metadata, missing, list(dict.fromkeys(standard))


def extract_entries(targets, metadata):
    readings_by_character = {}
    all_readings = set()
    for character in targets:
        readings = set()
        for form in metadata[character]['forms']:
            readings.update(initial_variants(form['eum']))
        readings_by_character[character] = readings
        all_readings.update(readings)

    entries = []
    for xml_path in sorted(KRDICT_DIR.glob('*.xml')):
        clean_xml = INVALID_XML.sub(b'', xml_path.read_bytes())
        for _event, entry in ET.iterparse(io.BytesIO(clean_xml), events=('end',)):
            if entry.tag != 'LexicalEntry':
                continue
            term = nested_feat_value(entry, 'Lemma', 'writtenForm').strip()
            if not HANGUL.fullmatch(term):
                entry.clear(); continue
            origin = norm(feat_value(entry, 'origin'))
            relevant_term = any(reading in term for reading in all_readings)
            relevant_origin = bool(origin and any(character in origin for character in targets))
            if not relevant_term and not relevant_origin:
                entry.clear(); continue
            if origin and not CJK.fullmatch(origin):
                origin = ''
            definitions, sentences = [], []
            for sense in entry.findall('Sense'):
                definition = feat_value(sense, 'definition')
                if definition:
                    definitions.append(definition)
                for example in sense.findall('SenseExample'):
                    for feat in example.findall('feat'):
                        if feat.get('att') == 'example':
                            sentence = feat.get('val', '').strip()
                            if term in sentence:
                                sentences.append(sentence)
            chosen = best_sentence(sentences)
            if chosen:
                entries.append({
                    'term': term,
                    'hanja': origin or '고유어·외래어',
                    'origin': origin,
                    'definition': definitions[0] if definitions else '',
                    'sentence': chosen,
                    'sentenceScore': sentence_score(chosen),
                })
            entry.clear()
    return entries, readings_by_character


def entry_rank(item, character, readings, target=True):
    term, origin = item['term'], item['origin']
    aligned = False
    if target and origin and len(term) == len(origin):
        aligned = any(origin[index] == character and term[index] in readings for index in range(len(origin)))
    return (
        0 if aligned else 1,
        0 if len(term) in (2, 3) else 1,
        item['sentenceScore'],
        len(term),
        term,
    )


def choose_candidates(targets, metadata, entries, readings_by_character):
    result = []
    for character in targets:
        readings = readings_by_character[character]
        target_pool = [item for item in entries if item['origin'] and character in item['origin'] and any(sound in item['term'] for sound in readings)]
        target_pool.sort(key=lambda item: entry_rank(item, character, readings, True))
        chosen_targets, seen = [], set()
        for item in target_pool:
            if item['term'] in seen:
                continue
            chosen_targets.append(item)
            seen.add(item['term'])
            if len(chosen_targets) == 4:
                break
        distractor_pool = [item for item in entries if character not in item['origin'] and any(sound in item['term'] for sound in readings) and item['term'] not in seen]
        distractor_pool.sort(key=lambda item: entry_rank(item, character, readings, False))
        chosen_distractors, distractor_seen = [], set()
        for item in distractor_pool:
            if item['term'] in distractor_seen:
                continue
            chosen_distractors.append(item)
            distractor_seen.add(item['term'])
            if len(chosen_distractors) == 8:
                break
        result.append({**metadata[character], 'readings': sorted(readings), 'targets': chosen_targets, 'distractors': chosen_distractors})
    return result


def make_groups(items):
    groups, pending = [], []
    runs, index = [], 0
    while index < len(items):
        sound = items[index]['mainSound']
        end = index + 1
        while end < len(items) and items[end]['mainSound'] == sound:
            end += 1
        runs.append(items[index:end])
        index = end
    for run in runs:
        while len(run) >= 2:
            take = 2 if len(run) == 4 else min(3, len(run))
            groups.append(run[:take]); del run[:take]
        pending.extend(run)
    while len(pending) >= 3:
        groups.append(pending[:3]); del pending[:3]
    if len(pending) == 2:
        groups.append(pending)
    elif len(pending) == 1:
        if len(groups[-1]) == 2:
            groups[-1].append(pending[0])
        else:
            moved = groups[-1].pop()
            groups.append([moved, pending[0]])
    if any(len(group) not in (2, 3) for group in groups):
        raise RuntimeError('Invalid group size')
    return groups


def build_lessons(candidates):
    groups = make_groups([dict(item) for item in candidates])
    lessons = []
    for group in groups:
        characters, questions = [], []
        for item in group:
            if len(item['targets']) < 3 or not item['distractors']:
                raise RuntimeError(f"{item['character']}: insufficient targets={len(item['targets'])}, distractors={len(item['distractors'])}")
            targets = item['targets'][:4]
            meanings = '·'.join(dict.fromkeys(form['hun'] for form in item['forms']))
            readings = '·'.join(dict.fromkeys(item['readings']))
            word_list = '·'.join(f"{target['term']}({target['hanja']})" for target in targets)
            character = {
                'character': item['character'],
                'reading': readings,
                'meaning': meanings,
                'hunEum': item['forms'],
                'explanation': f"핵심 뜻은 ‘{meanings}’입니다. {word_list}에서 이 글자가 맡는 뜻과 쓰임을 예문으로 익힙니다.",
                'examples': [[target['term'], target['hanja'], target['sentence']] for target in targets],
            }
            characters.append(character)
            distractor = item['distractors'][0]
            options = [[term, hanja, sentence.replace(term, f'{{{{{term}}}}}')] for term, hanja, sentence in character['examples'][:3]]
            options.append([distractor['term'], distractor['hanja'], distractor['sentence'].replace(distractor['term'], f"{{{{{distractor['term']}}}}}")])
            questions.append({
                'target': item['character'],
                'answer': 3,
                'note': f"{'·'.join(f'{term}({hanja})' for term, hanja, _ in character['examples'])}에는 {item['character']} 글자가 쓰입니다. {distractor['term']}({distractor['hanja']})에는 쓰이지 않습니다.",
                'options': options,
            })
        lessons.append({
            'term': ''.join(character['character'] for character in characters),
            'reading': ' · '.join(character['reading'] for character in characters),
            'theme': ' · '.join(character['meaning'] for character in characters),
            'characters': characters,
            'questions': questions,
        })
    return lessons


def main():
    current, metadata, targets, standard = load_metadata()
    entries, readings = extract_entries(targets, metadata)
    candidates = choose_candidates(targets, metadata, entries, readings)
    shortages = [{'character': item['character'], 'targets': len(item['targets']), 'distractors': len(item['distractors'])} for item in candidates if len(item['targets']) < 3 or not item['distractors']]
    CANDIDATE_OUT.write_text(json.dumps({'characters': candidates, 'shortages': shortages}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if shortages:
        print(json.dumps({'entries': len(entries), 'targets': len(targets), 'shortages': shortages}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
    lessons = build_lessons(candidates)
    LESSON_OUT.write_text(json.dumps(lessons, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    final_characters = list(current) + targets
    STANDARD_OUT.write_text(json.dumps({
        'source': '한국어문회 5급 누계에서 현재 과정에 없는 글자 추가',
        'sourceUrl': 'https://www.hanja.re.kr/kccpt/exam/levelConfirm.do',
        'excludedGrade5Characters': ''.join(EXCLUDED),
        'uniqueCharacterCount': len(set(final_characters)),
        'characters': ''.join(targets),
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'dictionaryEntries': len(entries), 'additions': len(targets), 'lessons': len(lessons), 'questions': sum(len(lesson['questions']) for lesson in lessons), 'finalUnique': len(set(final_characters))}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()