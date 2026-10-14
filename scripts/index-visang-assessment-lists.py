"""Index observed Vivasam performance-assessment labels, without originals."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
editions = json.loads((ROOT / 'game-hub-server/data/textbooks/catalog-2022.json').read_text(encoding='utf-8'))['editions']
rows, pages = {}, []
for path in sorted((REF / 'visang-browser-assessments').glob('*.json')):
    page = json.loads(path.read_text(encoding='utf-8'))
    match = re.match(r'(\S+)\s+(\d)(?:-([12]))?(?:\(([^)]+)\))?', page['book'])
    assert match, page['book']
    subject, grade, semester, author = match.groups()
    grade = int(grade)
    semester = int(semester) if semester else None
    national = subject in ('국어', '도덕', '통합교과') or grade <= 2
    found = [e for e in editions if grade in e['grades'] and e['subject'] == subject and
             (e['approvalType'] == '국정' if national else e['publisher'] == '비상교육' and e['leadAuthor'] == author)]
    assert len(found) == 1, (page['book'], found)
    edition = found[0]
    count = 0
    for unit in page['units']:
        if not unit.get('unit'):
            assert not unit['rows'], (path, unit)
            continue
        # Annual download bundles repeat the individual unit entries.
        if unit['unit'].startswith('학기 자료 /'):
            continue
        for item in unit['rows']:
            assert item['assessmentType'] == '수행 평가', (path, item)
            title = item['title'].strip()
            if re.search(r'음원|듣기\s*자료|정답|해설|평가\s*계획', title):
                continue
            key = (edition['id'], grade, semester, unit['unit'], title)
            if key in rows:
                continue
            ident = 'visang-list-' + hashlib.sha256(json.dumps(key, ensure_ascii=False).encode()).hexdigest()[:20]
            rows[key] = dict(id=ident, editionId=edition['id'], grade=grade, semester=semester,
                             subject=subject, publisher=edition['publisher'], provider='비상교육 비바샘',
                             title=title, unit=unit['unit'], documentKind='performance-assessment',
                             sourceManifest='visang-browser-assessments/' + path.name,
                             sourceUrl=page['url'], resourceId=item['resourceId'],
                             listGranularity='unit-bundle' if item.get('fileName', '').lower().endswith('.zip') else 'individual-file',
                             contentStatus='list-metadata-only')
            count += 1
    pages.append(dict(manifest=path.name, book=page['book'], editionId=edition['id'], grade=grade,
                      semester=semester, listedRows=count, checkedUnits=len(page['units']) - 1))
out = dict(schemaVersion=1, scope='list-metadata-only', assessments=list(rows.values()), pages=pages)
(REF / 'assessment-index-visang-lists-2022.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(dict(pages=len(pages), assessments=len(rows), gradeEditions=len({(r['editionId'], r['grade']) for r in rows.values()}))))
