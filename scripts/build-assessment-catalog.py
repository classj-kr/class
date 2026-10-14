"""Export only assessment-list metadata. Never export publisher rubrics or files."""
import hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
def read(p): return json.loads(p.read_text(encoding='utf-8'))
editions={e['id']:e for e in read(ROOT/'game-hub-server/data/textbooks/catalog-2022.json')['editions']}
codes={}
metadata={}
for p in REF.glob('assessment-content-*.json'):
    for a in read(p).get('assessments',[]):
        codes[a['id']]=a.get('standardCodes',a.get('documentStandardCodes',[]))
        metadata[a['id']]={k:a[k] for k in ('title','unit') if isinstance(a.get(k),str)}
rows={}
visang_list_path=REF/'assessment-index-visang-lists-2022.json'
visang_list_coverage={(a['editionId'],a['grade'],a.get('semester')) for a in read(visang_list_path)['assessments']} if visang_list_path.exists() else set()
for p in sorted(REF.glob('assessment-index-*-2022.json')):
    if p.name=='assessment-index-visang-2022.json':
        data=read(REF/'assessment-documents-visang-2022.json')['documents']
    else: data=read(p)['assessments']
    for a in data:
        # Current official lists replace older file-name-derived entries for the same book.
        if p.name=='assessment-index-visang-2022.json' and (a.get('editionId'),a.get('grade'),a.get('semester')) in visang_list_coverage: continue
        if a.get('canonicalDocumentId') and a['canonicalDocumentId']!=a['id']: continue
        if a.get('sourceRole')=='learning-supplement': continue
        title=a.get('title',''); kind=a.get('documentKind','')
        if re.search(r'음원|듣기\s*자료|정답|해설|(?:평가|지도|운영)\s*계획|평어|성취\s*수준|성취\s*기준|예시\s*답|채점',title): continue
        if kind and kind not in ('performance-assessment','assessment-rubric'): continue
        member=a.get('archiveMember') or a.get('sourceFile','')
        if str(member).lower().endswith(('.mp3','.wav','.mp4','.zip')): continue
        if p.name=='assessment-index-visang-2022.json' and not re.search(r'수행\s*평가|과정\s*중심',title): continue
        e=editions.get(a.get('editionId'))
        if not e or a.get('grade') not in e['grades']: continue
        # Only factual list labels are reused; publisher criteria stay out of the catalog.
        info=metadata.get(a['id'],{})
        if 'achim' in p.name: title=info.get('title') or Path(member).stem or title
        unit=a.get('unit') or info.get('unit') or (a.get('domain') if isinstance(a.get('domain'),str) else '') or ''
        key=(a['editionId'],a['grade'],a.get('semester'),a.get('provider',a.get('publisher')),unit,title)
        if key in rows: continue
        rows[key]={
            'id': 'assessment-'+hashlib.sha256(a['id'].encode()).hexdigest()[:20],
            'editionId':e['id'],'grade':a['grade'],'semester':a.get('semester'),
            'subject':e['subject'],'provider':a.get('provider') or a.get('publisher') or e.get('publisher') or '국정',
            'unit':unit,'title':title,'standardCodes':codes.get(a['id'],a.get('standardCodes',[])),
            'lessonIds':a.get('lessonIds',[]) if a.get('matchStatus','').startswith('exact-') else []
        }
out=ROOT/'game-hub-server/data/textbooks/assessment-catalog-2022.json'
out.write_text(json.dumps({'schemaVersion':1,'scope':'list-metadata-only','assessments':list(rows.values())},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'items':len(rows),'gradeEditions':len({(a['editionId'],a['grade']) for a in rows.values()})}))
