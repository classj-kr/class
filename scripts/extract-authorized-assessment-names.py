"""Extract title/unit only from documents opened with the user's approval."""
import hashlib,json,re,runpy,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks'
parser=runpy.run_path(str(ROOT/'scripts/extract-icream-assessment-metadata.py'))
receipt=REF/'authorized-document-openings.json'
docs=json.loads(receipt.read_text(encoding='utf-8'))
outdir=REF/'authorized-assessment-name-metadata';outdir.mkdir(exist_ok=True)
for d in docs:
 p=Path(d['path']);out=outdir/(d['publisher']+'-'+str(d['grade'])+'-'+str(d['semester'])+'.json')
 if d.get('sourceKind')=='lesson-plan':out=out.with_stem(out.stem+'-'+hashlib.sha256(p.name.encode()).hexdigest()[:10])
 if not p.exists():continue
 payload=p.read_bytes()
 if d['publisher']=='디딤돌교육':
  rows=[]
  for table in parser['tables'](payload):
   cells={(r,c):v for r,c,rs,cs,v in table}
   if cells.get((0,0))=='단원' and cells.get((0,2))=='차시 및 주제':
    rows.append({'unit':cells[0,1],'title':cells[0,3]})
 elif d.get('sourceKind')=='lesson-plan':
  rows=[];unit=''
  for table in parser['tables'](payload):
   cells={(r,c):v for r,c,rs,cs,v in table}
   for r,c,rs,cs,v in table:
    if v in ('단원','단원명'):unit=cells.get((r,c+1),unit)
   if cells.get((0,0))=='평가 요소' and unit:
    rows.extend({'unit':unit,'title':v} for r,c,rs,cs,v in table if c==0 and r>0 and v)
 elif d['publisher']=='동아출판':
  rows=[]
  for member,blob in parser['members'](payload,p.name):
   unit=''
   for table in parser['tables'](blob):
    cells={(r,c):v for r,c,rs,cs,v in table}
    if cells.get((0,0))=='단원명':unit=cells.get((0,1),'')
    if cells.get((0,0))=='평가 요소' and unit and cells.get((0,1)):
     rows.append({'unit':unit,'title':cells[0,1],'sourceMemberLabel':member})
 else:rows=parser['extract'](payload)
 if not rows:print(json.dumps({'file':p.name,'status':'needs-format-review'},ensure_ascii=False));continue
 record={k:v for k,v in d.items() if k!='path'}
 record.update(scope='name-unit-only',sourceFileName=p.name,sha256=hashlib.sha256(payload).hexdigest(),assessments=rows)
 out.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'file':p.name,'rows':len(rows)},ensure_ascii=False))
 if '--cleanup' in sys.argv:
  # Only exact files returned by this task's authorized browser openings.
  assert p.resolve().parent==Path('D:/Downloads').resolve(),str(p)
  assert hashlib.sha256(p.read_bytes()).hexdigest()==record['sha256']
  p.unlink()
