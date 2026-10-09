"""Index factual assessment list labels from the publisher's performance tab."""
import json,hashlib,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; REF=ROOT/'references/textbooks'
editions=json.loads((ROOT/'game-hub-server/data/textbooks/catalog-2022.json').read_text(encoding='utf-8'))['editions']
rows={};pages=[]
for p in sorted((REF/'klassmon-browser-assessments').glob('*.json')):
    d=json.loads(p.read_text(encoding='utf-8'));book=d['book'].splitlines();assert book[0]=='2022 개정'
    subject=re.sub(r'[\d\s]','',book[1]);grade=d['grade'];author=book[2]
    matches=[e for e in editions if e['publisher'] in ['교학사','교학도서'] and e['subject']==subject and e['leadAuthor']==author and grade in e['grades']]
    assert len(matches)==1,(book,grade)
    e=matches[0];pages.append({'editionId':e['id'],'grade':grade,'semesterFilter':d['semester'],'sourceFile':p.name,'count':len(d['rows']),'status':'listed' if d['rows'] else 'publisher-list-empty'})
    for a in d['rows']:
        if not re.search(r'평가',a['title']) or re.search(r'계획|정답|해설|성취기준',a['title']):continue
        key=(e['id'],grade,a['resourceId'])
        rows[key]={'id':'klassmon-list-'+a['resourceId'],'editionId':e['id'],'grade':grade,'semester':None,'subject':subject,'publisher':e['publisher'],'provider':'클래스몬','title':a['title'],'unit':a['unit'],'documentKind':'performance-assessment','sourceUrl':d['url'],'sourceManifest':'klassmon-browser-assessments/'+p.name,'contentStatus':'list-metadata-only'}
(REF/'assessment-index-klassmon-2022.json').write_text(json.dumps({'schemaVersion':1,'scope':'list-metadata-only','assessments':list(rows.values()),'pages':pages},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'pages':len(pages),'assessments':len(rows),'gradeEditions':len({(r['editionId'],r['grade']) for r in rows.values()})}))
