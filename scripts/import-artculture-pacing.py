"""Import reviewed annual allocation tables; do not turn allocated hours into period numbers."""
import csv
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
OUT = ROOT / 'game-hub-server/data/textbooks'

def read(p):
    return json.loads(p.read_text(encoding='utf-8'))

def write(p, data):
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def run():
    source = REF / 'artculture-annual-reviewed-transcription.tsv'
    rows = list(csv.DictReader(source.read_text(encoding='utf-8').splitlines(), delimiter='\t'))
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    catalog = read(OUT / 'catalog-2022.json')
    plans = []
    for grade in range(3, 7):
        edition = next(e for e in catalog['editions'] if e['publisher'] == '아트앤컬처' and e['subject'] == '미술' and grade in e['grades'])
        page = 50 if grade % 2 else 51
        url = 'https://artandculture.kr/study/ebook' + ('3' if grade < 5 else '6') + '-2/'
        lessons = []
        for line, row in enumerate(rows, 2):
            if int(row['grade']) != grade:
                continue
            unit_number = int(row['unitNumber'])
            lessons.append(dict(
                id=f'artculture-{grade}-r{line}', sourceRow=line,
                sourcePage=page, sourceTableRow=len(lessons)+1,
                sourceCells=list(row.values()), sequence=len(lessons)+1,
                semester=None, unit=row['unit'], unitNumber=unit_number,
                unitKind='orientation' if unit_number == 0 else 'project' if unit_number == 13 else 'unit',
                domain=None, topic=row['topic'], periodText=row['hours'],
                periodNumbers=None, suggestedPeriods=int(row['hours']), periodBasis='allocation',
                pages=row['pages'], teacherGuidePages=row['guidePages'], supplementaryPages=None,
                materials=None, activities=None, standardCodes=[]))
        assert len(lessons) == (26 if grade == 6 else 27)
        assert sum(l['suggestedPeriods'] for l in lessons) == 68
        assert {l['unitNumber'] for l in lessons} == set(range(14))
        plans.append(dict(id=f'artculture-{grade}-annual', editionId=edition['id'], publisher='아트앤컬처',
            curriculum='2022', subject='미술', grade=grade, semester=None,
            sourceId=f'artculture-guide-{grade}-annual', sourceUrl=url,
            sourceFile=source.name, sha256=digest, sourcePage=page,
            format='reviewed-official-annual-table',
            curriculumVerification='official-2022-textbook-guide',
            coverageScope='annual-including-orientation-and-project',
            extractionMethod='visible-ebook-text-transcription-checked-against-rendered-table',
            scheduleCompleteness='annual-table-complete-semester-boundaries-unspecified', lessons=lessons))
    write(OUT / 'pacing-artculture-2022.json', dict(schemaVersion=1, plans=plans))
    index_path = REF / 'assessment-index-artculture-2022.json'
    index = read(index_path)
    for a in index['assessments']:
        plan = next(p for p in plans if p['grade'] == a['grade'] and p['editionId'] == a['editionId'])
        a['lessonIds'] = [l['id'] for l in plan['lessons'] if l['unitNumber'] == a['unitNumber']]
        assert a['lessonIds']
        a['matchStatus'] = 'exact-grade-unit-number'
        a['matchScope'] = 'unit-not-individual-activity'
    write(index_path, index)
    write(REF / 'artculture-normalization-review.json', dict(
        schemaVersion=1, reviewedOn='2026-10-09', sourceFile=source.name, sha256=digest,
        evidence=[dict(grade=p['grade'], sourceUrl=p['sourceUrl'], sourcePage=p['sourcePage'],
                       rows=len(p['lessons']), allocatedPeriods=68) for p in plans],
        rules=[
            'Use the guide annual table allocations, not overlapping individual teaching-plan period labels.',
            'No semester boundaries or cumulative period numbers are printed; both remain unassigned.',
            'Include the opening two-period planning activity and the four-period project.',
            'The project is assigned unitNumber 13 for linking to the publisher resource tab; the table labels it 프로젝트.',
            'Private-use font glyphs were normalized against rendered table: 여행, 끌리는, 드로잉, 편집, comma and parentheses.',
            'Downloaded page1x background JPG files omit overlaid text and are not complete source-table images.'
        ], teachingPlanConflicts=[
            dict(grade=3, units=[4,5,7,9,13], issue='overlap or inconsistent period labels in individual teaching plans'),
            dict(grade=5, units=[6], issue='individual plan totals disagree: 4 versus 6; annual table allocates 4+2'),
            dict(grade=6, units=[10,11,12], issue='individual plan overlaps or inconsistent totals; annual table allocates 6 per unit')
        ], assessmentMatchCount=len(index['assessments']), assessmentMatchScope='unit-level; rubric extraction pending'))
    subprocess.run(['node', str(ROOT / 'scripts/build-textbook-coverage.cjs')], check=True)
    print(json.dumps(dict(plans=len(plans), rows=len(rows), assessmentUnitMatches=len(index['assessments']))))

if __name__ == '__main__':
    run()
