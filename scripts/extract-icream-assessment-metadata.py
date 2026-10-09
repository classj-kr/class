"""Read authorized official bundles in memory; persist only unit/title metadata.

No original document, full text, questions, criteria, or media is written.
Only cells under explicitly identified unit and assessment-title headers survive.
"""
import concurrent.futures,hashlib,io,json,logging,re,sys,urllib.request,xml.etree.ElementTree as ET,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tmp/textbook-research/python-packages'))
from hwp5.xmlmodel import Hwp5File
from hwp5.storage.ole import OleStorage
logging.disable(logging.CRITICAL)
REF=ROOT/'references/textbooks'
def clean(s):return re.sub(r'\s+',' ',s).strip()
def tables(data):
 if data.startswith(b'\xd0\xcf'):
  doc=Hwp5File(OleStorage(io.BytesIO(data))); out=io.BytesIO()
  try:doc.xmlevents().dump(out)
  finally:doc.close()
  root=ET.fromstring(out.getvalue())
  for t in root.findall('.//TableBody'):
   cells=[]
   for c in t.findall('./TableRow/TableCell'):
    cells.append((int(c.get('row')),int(c.get('col')),int(c.get('rowspan')),int(c.get('colspan')),clean(' '.join(''.join(p.itertext()) for p in c.findall('./Paragraph')))))
   yield cells
 elif data.startswith(b'PK'):
  with zipfile.ZipFile(io.BytesIO(data)) as z:
   for n in z.namelist():
    if re.fullmatch(r'Contents/section\d+\.xml',n):
     root=ET.fromstring(z.read(n))
     for t in root.iter():
      if t.tag.rsplit('}',1)[-1]!='tbl':continue
      cells=[]
      for row in t:
       if row.tag.rsplit('}',1)[-1]!='tr':continue
       for c in row:
        if c.tag.rsplit('}',1)[-1]!='tc':continue
        a=next((x for x in c if x.tag.endswith('}cellAddr')),None);s=next((x for x in c if x.tag.endswith('}cellSpan')),None)
        if a is None or s is None:continue
        cells.append((int(a.get('rowAddr')),int(a.get('colAddr')),int(s.get('rowSpan')),int(s.get('colSpan')),clean(' '.join(x.text or '' for x in c.iter() if x.tag.endswith('}t')))))
      yield cells
def extract(data):
 result=[]
 for ti,cells in enumerate(tables(data)):
  header={}
  for r,c,rs,cs,v in cells:
   h=re.sub(r'\s+','',v)
   if h in ('단원','단원명','단원(주제)','관련단원'):header['unit']=(r,c)
   if h in ('평가요소','평가내용','평가주제','평가명','교육내용'):header['title']=(r,c)
  if not {'unit','title'}<=header.keys():continue
  ur,uc=header['unit'];tr,tc=header['title']
  if ur!=tr:continue
  grid={}
  for r,c,rs,cs,v in cells:
   if c not in (uc,tc):continue
   for rr in range(r,r+rs):grid[rr,c]=v
  for r,c,rs,cs,v in cells:
   if c!=tc or r<=tr:continue
   unit=grid.get((r,uc),'')
   if unit and v and len(v)<400 and len(unit)<250:result.append({'unit':unit,'title':v,'table':ti,'sourceRow':r+1})
 return list({(x['unit'],x['title']):x for x in result}.values())
def members(payload,name):
 if name.lower().endswith('.zip'):
  with zipfile.ZipFile(io.BytesIO(payload)) as z:
   for n in z.namelist():
    if n.lower().endswith(('.hwp','.hwpx')) and not n.startswith('__MACOSX'):
     try:label=n.encode('cp437').decode('euc-kr')
     except (UnicodeError,LookupError):label=n
     yield label,z.read(n)
 else:yield name,payload
def work(item):
 url,meta=item;rec={'url':url,**meta,'documents':[]}
 try:
  payload=urllib.request.urlopen(url,timeout=60).read()
  for name,data in members(payload,meta['fileName']):
   try:rec['documents'].append({'member':name,'assessments':extract(data)})
   except Exception as e:rec['documents'].append({'member':name,'error':type(e).__name__})
  rec['status']='extracted' if any(d.get('assessments') for d in rec['documents']) else 'no-matching-header'
 except Exception as e:rec['status']='error';rec['error']=type(e).__name__+': '+str(e)[:200]
 dest=REF/'icream-document-metadata';dest.mkdir(exist_ok=True)
 (dest/(hashlib.sha256(url.encode()).hexdigest()[:16]+'.json')).write_text(json.dumps(rec,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 return {'file':meta['fileName'],'status':rec['status'],'rows':sum(len(d.get('assessments',[])) for d in rec['documents'])}
if __name__=='__main__':
 jobs={}
 for p in sorted((REF/'icream-browser-assessments').glob('*.json')):
  doc=json.loads(p.read_text(encoding='utf-8'));grade,term=map(int,re.findall(r'\d+',doc['heading']))
  for row in doc['rows']:
   for f in row['files']:
    url=f['url'];j=jobs.setdefault(url,{'subject':row['subject'],'fileName':f['fileName'],'contexts':[]})
    j['contexts'].append({'grade':grade,'semester':term,'listedUnit':row['unit'],'sourceManifest':p.name})
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  selected=[(u,j) for u,j in jobs.items() if len(sys.argv)==1 or j['subject']==sys.argv[1]]
  for result in pool.map(work,selected):print(json.dumps(result,ensure_ascii=False),flush=True)
