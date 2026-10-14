"""Map official Douclass list names to the matching textbook edition."""
import json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';DATA=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
editions=read(DATA/'catalog-2022.json')['editions'];plans=[]
for p in DATA.glob('pacing-donga*.json'):plans+=read(p).get('plans',[])
rows={};pages=[]
for path in sorted((REF/'donga-browser-assessments').glob('*.json')):
 d=read(path);m=re.search(r'\|\s*(\S+)\s+(\d)(?:-([12]))?\s+(\S+)\s+\(2022\)',d['heading'])
 if not m:raise ValueError(d['heading'])
 subject,grade,term,author=m.groups();grade=int(grade);term=int(term) if term else None
 es=[e for e in editions if e['publisher']=='동아출판' and e['subject']==subject and grade in e['grades'] and e['leadAuthor']==author]
 assert len(es)==1,(d['heading'],es)
 e=es[0];units=list(dict.fromkeys(l['unit'] for p in plans if p['editionId']==e['id'] and p['grade']==grade and (term is None or p['semester']==term) for l in p['lessons']))
 count=0
 for a in d['rows']:
  title=re.sub(r'\((?:선생님|학생)용\)','',a['title']).strip()
  if re.search(r'음원|정답|해설|채점|평어',title):continue
  unit=a.get('unit') or ''
  if not unit and subject=='체육' and re.match(r'^\d+\.',title):unit=title.split('_')[0].strip()
  if not unit:
   n=re.search(r'(\d+)\s*단원',title) or re.search(r'(?:Lesson|L|Unit)\s*(\d+)',title,re.I)
   if n:
    number=int(n[1]);matches=[u for u in units if re.match(r'^\s*0*'+str(number)+r'(?:[.\s]|단원)',u)]
    unit=matches[0] if len(matches)==1 else f'{number}단원'
  key=(e['id'],grade,term,unit,title)
  if key in rows:continue
  ident='donga-list-'+hashlib.sha256(json.dumps(key,ensure_ascii=False).encode()).hexdigest()[:20]
  rows[key]={'id':ident,'editionId':e['id'],'grade':grade,'semester':term,'subject':subject,'publisher':'동아출판','provider':'동아출판 두클래스','unit':unit,'title':title,'documentKind':'performance-assessment','sourceManifest':'donga-browser-assessments/'+path.name,'sourceUrl':d['url'],'contentStatus':'list-metadata-only'};count+=1
 pages.append({'manifest':path.name,'editionId':e['id'],'grade':grade,'semester':term,'listedRows':len(d['rows']),'indexedRows':count})
(REF/'assessment-index-donga-2022.json').write_text(json.dumps({'schemaVersion':1,'scope':'list-metadata-only','assessments':list(rows.values()),'pages':pages},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'rows':len(rows),'gradeEditions':len({(a['editionId'],a['grade']) for a in rows.values()}),'emptyUnits':sum(not a['unit'] for a in rows.values())}))
