"""Normalize observed YBM assessment labels; originals and criteria are excluded."""
import json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; REF=ROOT/'references/textbooks'
editions=json.loads((ROOT/'game-hub-server/data/textbooks/catalog-2022.json').read_text(encoding='utf-8'))['editions']
rows={};pages=[]
for p in sorted((REF/'ybm-browser-assessments').glob('*.json')):
    d=json.loads(p.read_text(encoding='utf-8'))
    m=re.fullmatch(r'(\S+)\s+(\d)(?:-([12]))?\(([^)]+)\)',d['book']); assert m,d['book']
    subject,grade,semester,author=m.groups();grade=int(grade);semester=int(semester) if semester else None
    matches=[e for e in editions if e['publisher']=='와이비엠' and e['subject']==subject and grade in e['grades'] and e['leadAuthor']==author]
    assert len(matches)==1,(d['book'],matches)
    e=matches[0]; pages.append({'manifest':p.name,'editionId':e['id'],'grade':grade,'semester':semester,'listedRows':len(d['rows'])})
    for a in d['rows']:
        title=a['title']
        if not re.search(r'수행.?평가|평가지',title) or re.search(r'정답|해설|음원|평가\s*운영\s*계획|\.(?:zip|mp3|wav|mp4)',title,re.I):continue
        title=re.sub(r'\.(?:pdf|hwpx?|docx?)$','',title,flags=re.I)
        title=re.sub(r'[_\s]*(?:교사용|학생용|교사|학생)(?:\))?$','',title)
        title=re.sub(r'[_\s]*[34]단계$','',title).strip()
        key=(e['id'],grade,semester,a['unit'],title)
        if key in rows:continue
        ident='ybm-list-'+hashlib.sha256(json.dumps(key,ensure_ascii=False).encode()).hexdigest()[:20]
        rows[key]={'id':ident,'editionId':e['id'],'grade':grade,'semester':semester,'subject':subject,'publisher':'YBM','provider':'YBM Y클라우드','unit':a['unit'],'title':title,'documentKind':'performance-assessment','sourceManifest':'ybm-browser-assessments/'+p.name,'sourceUrl':d['url'],'resourceId':a.get('resourceId'),'contentStatus':'list-metadata-only'}
(REF/'assessment-index-ybm-2022.json').write_text(json.dumps({'schemaVersion':1,'scope':'list-metadata-only','assessments':list(rows.values()),'pages':pages},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'pages':len(pages),'assessments':len(rows),'gradeEditions':len({(r['editionId'],r['grade']) for r in rows.values()})}))
