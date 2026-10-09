"""Report evidence of assessment acquisition per grade/edition, not completeness."""
import json
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def run():
    catalog=read(ROOT/'game-hub-server/data/textbooks/catalog-2022.json')['editions']
    by_key=defaultdict(list);indexes=[]
    for path in sorted(REF.glob('assessment-index-*-2022.json')):
        if path.name=='assessment-index-visang-2022.json':continue
        items=read(path)['assessments'];indexes.append(dict(file=path.name,records=len(items)))
        for item in items:by_key[(item['editionId'],item['grade'])].append((path.name,item))
    path=REF/'assessment-documents-visang-2022.json'
    if path.exists():
        items=read(path)['documents'];indexes.append(dict(file=path.name,records=len(items)))
        for item in items:by_key[(item['editionId'],item['grade'])].append((path.name,item))
    coverage=[]
    valid={(e['id'],g) for e in catalog for g in e['grades']};assert set(by_key)<=valid,set(by_key)-valid
    for e in catalog:
        for grade in e['grades']:
            items=by_key[(e['id'],grade)]
            coverage.append(dict(editionId=e['id'],publisher=e['publisher'],subject=e['subject'],leadAuthor=e['leadAuthor'],grade=grade,
                status='at-least-one-original-acquired' if items else 'no-indexed-original',indexedRecords=len(items),
                identifiedSemesters=sorted({r['semester'] for _,r in items if r.get('semester') in [1,2]}),
                annualOrUnspecifiedRecords=sum(r.get('semester') is None for _,r in items),
                sourceIndexes=sorted({name for name,_ in items}),completeness='not-established'))
    result=dict(schemaVersion=1,meaning='Files may include worksheets, plans, answer keys, rubrics, and format variants. Acquisition presence does not prove all units or both semesters are complete.',
                withAtLeastOneOriginal=sum(c['indexedRecords']>0 for c in coverage),gradeEditionTotal=len(coverage),sourceIndexes=indexes,coverage=coverage)
    (REF/'assessment-coverage-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:result[k] for k in ['withAtLeastOneOriginal','gradeEditionTotal']}))
if __name__=='__main__':run()
