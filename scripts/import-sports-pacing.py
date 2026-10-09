"""Import publisher-linked public Drive files; preserve missing source allocations."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
OUT = ROOT / 'game-hub-server/data/textbooks'

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def clean(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def numbers(value):
    match = re.fullmatch(r'(\d+)(?:\s*[~-]\s*(\d+))?', clean(value))
    if not match:
        return None
    first, last = int(match[1]), int(match[2] or match[1])
    assert 0 < first <= last < 200
    return list(range(first, last + 1))

def run():
    manifest = read(REF / 'sports-acquired-sources.json')
    inventory = {f['id']: f for f in read(REF / 'sports-public-inventory.json')['items']}
    catalog = read(OUT / 'catalog-2022.json')
    plans, assessments, issues = [], [], []
    for source in manifest['sources']:
        file = REF / 'raw' / source['fileName']
        content = file.read_bytes()
        assert len(content) == source['bytes'], file.name
        assert content[:2] == b'PK' if file.suffix in ('.xlsx', '.hwpx') else content[:8] == bytes.fromhex('d0cf11e0a1b11ae1'), file.name
        source['sha256'] = hashlib.sha256(content).hexdigest()
        if file.suffix != '.xlsx':
            source['kind'] = 'assessment' if re.match(r'수행\s*평가지', source['title']) else 'standards-or-evaluation-plan'
            continue
        source['kind'] = 'pacing'
        source['plans'] = []
        grade = int(re.search(r'체육([3-6])_', source['title'])[1])
        edition = next(e for e in catalog['editions'] if e['publisher'] == '체육과건강'
                       and e['subject'] == '체육' and grade in e['grades'] and e['leadAuthor'] == '김택천')
        sheet = openpyxl.load_workbook(file, data_only=True).active
        assert not sheet.merged_cells.ranges
        groups = {1: [], 2: []}
        for rn, cells in enumerate(list(sheet.values)[1:], 2):
            if not clean(cells[5]):
                continue
            assert cells[1] == grade and cells[2] in (1, 2) and cells[3] == '체육'
            semester = cells[2]
            ns = numbers(cells[8])
            unit = clean(cells[4])
            item = {'id': f"sports-{source['id']}-r{rn}", 'sourceRow': rn, 'sourceCells': list(cells),
                    'sequence': len(groups[semester]) + 1, 'semester': semester, 'unit': unit,
                    'domain': unit.split('_')[0], 'topic': clean(cells[5]),
                    'periodText': clean(cells[8]), 'periodNumbers': ns,
                    'suggestedPeriods': len(ns) if ns else None, 'periodBasis': 'domain',
                    'unitPeriodsText': clean(cells[9]), 'pages': clean(cells[6]) or None,
                    'supplementaryPages': clean(cells[7]) or None,
                    'materials': clean(cells[10]) or None, 'standardCodes': [], 'activities': None}
            if ns is None:
                item['reviewStatus'] = 'source-period-missing'
                issues.append({'sourceId': source['id'], 'sourceRow': rn, 'issue': 'source-period-missing',
                               'action': 'kept-null-not-inferred'})
            groups[semester].append(item)
        for semester, lessons in groups.items():
            pid = f"sports-{source['id']}-{grade}-{semester}"
            plans.append({'id': pid, 'editionId': edition['id'], 'publisher': '체육과건강',
                          'subject': '체육', 'curriculum': '2022', 'grade': grade, 'semester': semester,
                          'sourceId': source['id'], 'sourceUrl': source['sourceUrl'],
                          'sourceFile': source['fileName'], 'sha256': source['sha256'],
                          'sourceLabel': '공식 자료실 나이스 등록용 진도 계획표',
                          'curriculumVerification': 'publisher-linked-2022-drive-folder',
                          'sheet': sheet.title, 'format': 'neis', 'lessons': lessons})
            source['plans'].append(pid)
        total = sum(l['suggestedPeriods'] or 0 for ls in groups.values() for l in ls)
        assert total == (101 if grade == 4 else 102), (grade, total)

    for source in manifest['sources']:
        if source['kind'] != 'assessment':
            continue
        meta = inventory[source['id']]
        grade = int(re.search(r'([3-6])학년', meta['parentTitle'])[1])
        domain = meta['parentTitle'].split('_')[0].replace('.', '')
        match = re.match(r'수행\s*평가지_(.+?)차시_(.+)\.hwpx?$', source['title'])
        assert match, source['title']
        ns = numbers(match[1])
        candidates = [l for p in plans if p['grade'] == grade for l in p['lessons']
                      if l['domain'] == domain and l['periodNumbers']
                      and set(l['periodNumbers']) & set(ns)]
        exact = [l for l in candidates if l['topic'] == match[2]]
        edition = next(p['editionId'] for p in plans if p['grade'] == grade)
        assessments.append({'id': 'sports-assessment-' + source['id'], 'publisher': '체육과건강',
                            'curriculum': '2022', 'subject': '체육', 'grade': grade, 'editionId': edition,
                            'domain': domain, 'title': match[2], 'periodText': match[1], 'periodNumbers': ns,
                            'sourceId': source['id'], 'sourceUrl': source['sourceUrl'],
                            'sourceFile': source['fileName'], 'sha256': source['sha256'],
                            'lessonIds': [l['id'] for l in exact],
                            'candidateLessonIds': [l['id'] for l in candidates],
                            'matchStatus': 'exact-title-domain-period' if exact else 'needs-content-review',
                            'contentStatus': 'original-acquired-not-yet-extracted'})
    manifest['issues'] = issues
    write(REF / 'sports-acquired-sources.json', manifest)
    write(OUT / 'pacing-sports-2022.json', {'schemaVersion': 1, 'publisher': '체육과건강', 'plans': plans})
    write(REF / 'assessment-index-sports-2022.json', {'schemaVersion': 1, 'assessments': assessments,
          'note': 'Original files are archived locally. Lesson matches require exact title, grade, domain and intersecting source periods; rubric extraction remains pending.'})
    subprocess.run(['node', str(ROOT / 'scripts/build-textbook-coverage.cjs')], check=True)
    print(json.dumps({'sources': len(manifest['sources']), 'plans': len(plans),
                      'lessonRows': sum(len(p['lessons']) for p in plans), 'assessments': len(assessments),
                      'exactMatches': sum(a['matchStatus'].startswith('exact') for a in assessments), 'issues': issues}))

if __name__ == '__main__':
    run()
