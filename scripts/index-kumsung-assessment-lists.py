"""Map Kumsung's observed performance-assessment list labels to editions."""
import json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; REF=ROOT/'references/textbooks'
editions=json.loads((ROOT/'game-hub-server/data/textbooks/catalog-2022.json').read_text(encoding='utf-8'))['editions']
rows={};pages=[]
for p in sorted((REF/'kumsung-browser-assessments').glob('*.json')):
    d=json.loads(p.read_text(encoding='utf-8'))
    m=re.fullmatch(r'(\S+)\s+(\d)\(([^)]+)\)22개정',d['title']);assert m,d['title']
    subject,grade,author=m.groups();grade=int(grade)
    matches=[e for e in editions if e['publisher']=='금성출판사' and e['subject']==subject and grade in e['grades'] and e['leadAuthor']==author]
    assert len(matches)==1,(d['title'],matches)
    e=matches[0]; count=0
    for a in d['rows']:
        if not re.search(r'수행\s*평가',a['title']) or re.search(r'정답|해설',a['title']):continue
        if not a['unit'] and subject=='미술':
            match=re.fullmatch(r'\[수행평가\]\s*'+str(grade)+r'-(\d+\.\s*.+)',a['title'])
            if match:a={**a,'unit':match[1]}
        key=(e['id'],grade,a['unit'],a['title'])
        if key in rows:continue
        ident='kumsung-list-'+hashlib.sha256(json.dumps(key,ensure_ascii=False).encode()).hexdigest()[:20]
        rows[key]={'id':ident,'editionId':e['id'],'grade':grade,'semester':None,'subject':subject,'publisher':e['publisher'],'provider':'금성출판사 티칭허브','unit':a['unit'],'title':a['title'],'documentKind':'performance-assessment','sourceManifest':'kumsung-browser-assessments/'+p.name,'sourceUrl':d['url'],'resourceId':a['resourceId'],'contentStatus':'list-metadata-only'};count+=1
    pages.append({'manifest':p.name,'editionId':e['id'],'grade':grade,'listedRows':len(d['rows']),'performanceRows':count,'status':'listed' if count else 'performance-list-not-present-in-evaluation-menu'})
(REF/'assessment-index-kumsung-2022.json').write_text(json.dumps({'schemaVersion':1,'scope':'list-metadata-only','assessments':list(rows.values()),'pages':pages},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'pages':len(pages),'assessments':len(rows),'gradeEditions':len({(r['editionId'],r['grade']) for r in rows.values()})}))
