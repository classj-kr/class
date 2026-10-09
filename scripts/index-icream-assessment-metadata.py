"""Index only extracted assessment names and unit metadata, with edition checks."""
import json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';DATA=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def norm(s):return re.sub(r'[^가-힣a-z0-9]','',re.sub(r'^\d+[.\s]*','',s).lower())
editions=read(DATA/'catalog-2022.json')['editions'];plans=read(DATA/'pacing-iscream-2022.json')['plans']
rows={};checks=[]
for path in sorted((REF/'icream-document-metadata').glob('*.json')):
 d=read(path);g=d['contexts'][0]['grade'];subject=d['subject'];subject='통합교과' if subject.startswith('통합') else subject
 national=g<=2 or subject in ('국어','도덕');publisher='' if national else '아이스크림미디어'
 candidates=[e for e in editions if (e['publisher'] or '')==publisher and e['subject']==subject and g in e['grades']]
 if len(candidates)!=1:checks.append({'source':path.name,'status':'edition-unresolved','subject':subject});continue
 e=candidates[0];term=d['contexts'][0]['semester'] if len(d['contexts'])==1 else None
 ep=[p for p in plans if p['editionId']==e['id'] and p['grade']==g and (term is None or p['semester']==term)]
 units=list(dict.fromkeys(l['unit'] for p in ep for l in p['lessons']))
 count=0
 for document in d['documents']:
  if '보완' in Path(document['member']).name:continue
  items=document.get('assessments',[])
  # English plan uses goal prose, not names: retain actual performance-file labels.
  if subject=='영어' and '[수행평가]' in document['member']:
   m=re.search(r'_L(\d+)',document['member']);n=int(m[1]) if m else None
   matches=[u for u in units if re.match(r'^'+str(n)+r'\.',u)]
   if len(matches)==1:items=[{'unit':matches[0],'title':Path(document['member']).stem}]
  for a in items:
   unit=a['unit'];title=a['title']
   matches=[u for u in units if norm(u)==norm(unit)]
   # The provider's own book and contemporary list are known; match exact unit
   # text when possible, retaining the source label and uncertain mappings separately.
   # Source unit names include subunits and publisher typos. These are factual
   # labels from the provider, not silently rewritten to the pacing title.
   reviewed=(g==3 and subject in ('사회','체육')) or (g==5 and subject=='사회' and unit=='3. 법과 인권의 보장') or (g==4 and subject=='사회' and unit=='3. 다양한 환경과 살의 모습')
   status='national-curriculum' if national else 'exact-unit' if matches else 'reviewed-subunit-or-source-typo' if reviewed else 'publisher-grade-subject-unit-review'
   key=(e['id'],g,term,unit,title)
   ident='icream-'+hashlib.sha256(json.dumps(key,ensure_ascii=False).encode()).hexdigest()[:20]
   rows[key]={'id':ident,'editionId':e['id'],'grade':g,'semester':term,'subject':subject,'publisher':e['publisher'],'provider':'아이스크림','unit':unit,'title':title,'documentKind':'performance-assessment','sourceManifest':'icream-document-metadata/'+path.name,'sourceUrl':d['url'],'sourceMemberLabel':document['member'],'contentStatus':'name-unit-only','editionMatchStatus':status}
   count+=1
 checks.append({'source':path.name,'status':d['status'],'rows':count,'editionId':e['id'],'grade':g})
out={'schemaVersion':1,'scope':'name-unit-only','assessments':list(rows.values()),'sources':checks}
(REF/'assessment-index-icream-2022.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'rows':len(rows),'gradeEditions':len({(a['editionId'],a['grade']) for a in rows.values()}),'unitReview':sum(a['editionMatchStatus'].endswith('review') for a in rows.values())}))
