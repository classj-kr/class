"""Normalize publisher list labels only; no assessment originals or rubrics."""
import json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
editions=json.loads((ROOT/'game-hub-server/data/textbooks/catalog-2022.json').read_text(encoding='utf-8'))['editions']
rows={}; pages=[]
for p in sorted((REF/'miraen-browser-assessments').glob('*.json')):
    d=json.loads(p.read_text(encoding='utf-8'))
    assert d['curriculum']=='year-2022' and d['loadConfirmed'],p
    label=d['bookLabel']; grade=int(d['grade'][0]); sem=int(d['semester'][0])
    if '수업보조자료' in label: continue
    subject=next((s for s in ['국어','수학','사회','과학','도덕','영어','음악','미술','체육','실과'] if label.startswith(s)),'통합교과')
    national=subject in ['국어','도덕','통합교과'] or grade<=2
    author=re.search(r'\(([^)]+)\)',label)
    matches=[e for e in editions if grade in e['grades'] and e['subject']==subject and (e['approvalType']=='국정' if national else e['publisher']=='미래엔' and author and e['leadAuthor']==author[1])]
    assert len(matches)==1,(label,matches)
    e=matches[0]
    semester=sem if re.search(r'\d-[12]',d['book']) else None
    pages.append({'sourceFile':p.name,'book':label,'listedRows':len(d['rows']),'grade':grade,'semester':semester})
    for a in d['rows']:
        title=re.sub(r'\b(?:HWPX?|PDF)\b','',a['title'],flags=re.I)
        title=re.sub(r'\s+',' ',title).strip()
        key=(e['id'],grade,semester,a['unit'],title,a['context'])
        if key in rows: continue
        ident='miraen-list-'+hashlib.sha256(json.dumps(key,ensure_ascii=False).encode()).hexdigest()[:20]
        rows[key]={'id':ident,'editionId':e['id'],'grade':grade,'semester':semester,'subject':subject,'publisher':e['publisher'],'provider':'미래엔 엠티처','title':title,'unit':a['unit'],'lessonLabel':a['context'],'documentKind':'performance-assessment','sourceUrl':d['url'],'sourceManifest':'miraen-browser-assessments/'+p.name,'resourceId':a['resourceId'],'contentStatus':'list-metadata-only'}
(REF/'assessment-index-miraen-2022.json').write_text(json.dumps({'schemaVersion':1,'scope':'list-metadata-only','assessments':list(rows.values()),'pages':pages},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'pages':len(pages),'assessments':len(rows),'gradeEditions':len({(r['editionId'],r['grade']) for r in rows.values()})}))
