import ast
import csv
import io
import json
import math
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools/.cache/pydeps'))
from wordfreq import get_frequency_dict

LEVELS = {'8급','7급Ⅱ','7급','6급Ⅱ','6급','5급Ⅱ','5급','4급Ⅱ','4급','3급Ⅱ','3급'}
HANGUL = re.compile(r'^[가-힣]{2,6}$')
CJK = re.compile(r'^[\u3400-\u9fff\uf900-\ufaff]{2,8}$')

def norm(value):
    return unicodedata.normalize('NFKC', value or '').replace(' ', '').replace('^', '')

current = set()
for number in range(1, 6):
    lessons = json.loads((ROOT / 'scripts' / f'hanja-v2-lessons-{number:02d}.json').read_text(encoding='utf-8'))
    current.update(norm(character['character']) for lesson in lessons for character in lesson['characters'])

metadata = {}
with (ROOT / 'references/dictionaries/hanja-grade-dataset' / 'hanja.csv').open(encoding='utf-8-sig', newline='') as stream:
    for row in csv.DictReader(stream):
        if row['level'] not in LEVELS:
            continue
        character = norm(row['hanja'])
        if character in current or character in metadata:
            continue
        parsed = ast.literal_eval(row['meaning'])
        forms = []
        for group in parsed:
            if not group or len(group) < 2:
                continue
            for meaning in group[0]:
                hun = re.sub(r'\[.*?\]|\(.*?\)', '', meaning).strip()
                for sound in group[1]:
                    form = {'hun': hun, 'eum': sound}
                    if hun and sound and form not in forms:
                        forms.append(form)
        metadata[character] = {'character':character,'level':row['level'],'mainSound':row['main_sound'],'forms':forms,'strokes':int(row['total_strokes'])}

def feat_value(element, att):
    for feat in element.findall('feat'):
        if feat.get('att') == att:
            return feat.get('val', '')
    return ''

prominence = defaultdict(int)
term_prominence = defaultdict(int)
invalid_xml = re.compile(rb'[\x00-\x08\x0b\x0c\x0e-\x1f]')
for xml_path in sorted((ROOT / 'references/dictionaries/korean-dict-nikl-sparse' / 'krdict').glob('*.xml')):
    clean_xml = invalid_xml.sub(b'', xml_path.read_bytes())
    for _event, entry in ET.iterparse(io.BytesIO(clean_xml), events=('end',)):
        if entry.tag != 'LexicalEntry':
            continue
        lemma_element = entry.find('Lemma')
        term = feat_value(lemma_element, 'writtenForm').strip() if lemma_element is not None else ''
        hanja = norm(feat_value(entry, 'origin'))
        if HANGUL.fullmatch(term) and CJK.fullmatch(hanja):
            weight = 1 + len(entry.findall('Sense')) * 2 + len(entry.findall('.//SenseExample'))
            prominence[(term, hanja)] += weight
            term_prominence[term] += weight
        entry.clear()

frequency = get_frequency_dict('ko')
words = defaultdict(dict)
with (ROOT / 'references/dictionaries/kengdic' / 'kengdic.tsv').open(encoding='utf-8', newline='') as stream:
    for row in csv.DictReader(stream, delimiter='\t'):
        term = (row.get('surface') or '').strip().replace(' ', '')
        hanja = norm((row.get('hanja') or '').strip())
        if not HANGUL.fullmatch(term) or not CJK.fullmatch(hanja):
            continue
        dictionary_weight = prominence.get((term, hanja), 0)
        if dictionary_weight <= 0:
            continue
        raw_frequency = frequency.get(term, 0)
        freq = raw_frequency * dictionary_weight / term_prominence[term]
        if freq <= 0:
            continue
        for character in set(hanja) & metadata.keys():
            previous = words[character].get((term, hanja))
            if previous is None or freq > previous:
                words[character][(term, hanja)] = freq
ranking = []
for character, meta in metadata.items():
    terms = sorted(({'term':term,'hanja':hanja,'frequency':freq,'zipf':round(math.log10(freq)+9,3)} for (term,hanja),freq in words[character].items()), key=lambda item:(-item['frequency'],len(item['term']),item['term']))
    top = terms[:12]
    third = top[2]['frequency'] if len(top) >= 3 else 0
    fifth = top[4]['frequency'] if len(top) >= 5 else 0
    productive = sum(item['frequency'] for item in top[:8])
    ranking.append({**meta,'termCount':len(terms),'thirdFrequency':third,'fifthFrequency':fifth,'productiveFrequency':productive,'topTerms':top})
ranking.sort(key=lambda item:(-item['thirdFrequency'],-item['productiveFrequency'],item['mainSound'],item['character']))
selected = [item for item in ranking if item['thirdFrequency'] >= 0.000001 and item['productiveFrequency'] >= 0.00001]
(ROOT / 'scripts' / 'hanja-csat-expansion-ranking.json').write_text(json.dumps({'criteria':{'thirdFrequency':0.000001,'productiveFrequency':0.00001},'selectedCount':len(selected),'selected':selected,'all':ranking},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'current':len(current),'candidateCharacters':len(ranking),'selected':len(selected),'top':[{'character':x['character'],'level':x['level'],'terms':[t['term'] for t in x['topTerms'][:5]],'third':x['thirdFrequency'],'productive':x['productiveFrequency']} for x in selected[:40]],'cutoff':[{'character':x['character'],'terms':[t['term'] for t in x['topTerms'][:5]],'third':x['thirdFrequency'],'productive':x['productiveFrequency']} for x in ranking[max(0,len(selected)-5):len(selected)+10]]},ensure_ascii=True,indent=2))