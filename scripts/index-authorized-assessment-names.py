"""Index approved document-derived title/unit pairs only."""
import hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks'
editions=json.loads((ROOT/'game-hub-server/data/textbooks/catalog-2022.json').read_text(encoding='utf-8'))['editions']
rows={}
for p in sorted((REF/'authorized-assessment-name-metadata').glob('*.json')):
 d=json.loads(p.read_text(encoding='utf-8'))
 es=[e for e in editions if e['publisher']==d['publisher'] and e['subject']==d['subject'] and d['grade'] in e['grades']]
 assert len(es)==1,(p.name,es)
 e=es[0]
 for a in d['assessments']:
  title=re.sub(r'^\d+(?:[~～-]\d+)?차시\s*[:：]\s*','',a['title']).strip()
  key=(e['id'],d['grade'],d['semester'],a['unit'],title)
  ident='document-name-'+hashlib.sha256(json.dumps(key,ensure_ascii=False).encode()).hexdigest()[:20]
  rows[key]={'id':ident,'editionId':e['id'],'grade':d['grade'],'semester':d['semester'],'subject':d['subject'],'publisher':d['publisher'],'provider':d['publisher'],'unit':a['unit'],'title':title,'documentKind':'performance-assessment','sourceManifest':'authorized-assessment-name-metadata/'+p.name,'sourceUrl':d['url'],'contentStatus':'name-unit-only','titleBasis':'assessment-plan-lesson-topic' if d['publisher']=='디딤돌교육' else 'assessment-plan-topic'}
lesson_manifest=REF/'klassmon-practical6-lesson-assessments.json'
if lesson_manifest.exists():
 d=json.loads(lesson_manifest.read_text(encoding='utf-8'))
 e=next(e for e in editions if e['subject']=='실과' and e['leadAuthor']=='최지연' and 6 in e['grades'])
 for a in d['rows']:
  key=(e['id'],6,None,a['unit'],a['title'])
  ident='klassmon-lesson-'+hashlib.sha256(a['resourceId'].encode()).hexdigest()[:20]
  rows[key]={'id':ident,'editionId':e['id'],'grade':6,'semester':None,'subject':'실과','publisher':e['publisher'],'provider':'클래스몬','unit':a['unit'],'title':a['title'],'documentKind':'performance-assessment','sourceManifest':lesson_manifest.name,'sourceUrl':d['url'],'contentStatus':'name-unit-only'}
(REF/'assessment-index-authorized-names-2022.json').write_text(json.dumps({'schemaVersion':1,'scope':'name-unit-only','assessments':list(rows.values())},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'rows':len(rows),'gradeEditions':len({(a['editionId'],a['grade']) for a in rows.values()})}))
