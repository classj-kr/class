import json,importlib.util,concurrent.futures,hashlib,zlib,re
from pathlib import Path
from zipfile import ZipFile
ROOT=Path.cwd()
s=importlib.util.spec_from_file_location('ar','scripts/collect-secondary-archives.py'); m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
manifest=ROOT/'references/textbooks/secondary-miraen-high-textbooks-all.json'
a=json.loads(manifest.read_text(encoding='utf8'))
chapters=json.loads((ROOT/'references/textbooks/secondary-miraen-high-textbooks-chapters.json').read_text(encoding='utf8'))
jobs=[]
for p in (ROOT/'references/textbooks/수집기록/기존작업').glob('miraen-body-archive-*.json'):
 d=json.loads(p.read_text(encoding='utf8')); b=d['book']; category=b['title']+'_2015/교과서'
 selected=[r for r in d['members'] if re.search(r'/(?:01\s*)?교과서/',r['name']) and r['name'].lower().endswith('.pdf')]
 selected=list({(Path(r['name']).name,r['crc32']):r for r in selected}.values())
 if not selected: raise ValueError('No textbook PDF '+b['title'])
 a=[r for r in a if r['category']!=category]
 for r in selected:
  source={'publisher':'미래엔','level':'고등','subject':b['subject'],'category':category,'title':Path(r['name']).stem,'url':b['dvd']+'#'+r['name'],'archiveUrl':b['dvd'],'member':r['name'],'expectedBytes':r['bytes'],'crc32':r['crc32']}
  jobs.append(source);a.append(source)
a=[r for r in a if r['category']!='기본 수학 (황선욱)_2015/교과서']+chapters
manifest.write_text(json.dumps(a,ensure_ascii=False,indent=2),encoding='utf8')
(ROOT/'references/textbooks/secondary-miraen-high-textbooks-archive-members.json').write_text(json.dumps(jobs,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'archiveMembers':len(jobs),'totalExpected':len(a)},ensure_ascii=False),flush=True)
def collect(src):
 folder=m.BASE/src['publisher']/src['level']/src['subject']/src['category'];folder.mkdir(parents=True,exist_ok=True)
 stem=m.clean(src['title']); target=folder/(stem+'.pdf');receipt=folder/(stem+'.수집기록.json')
 row={**src,'status':'downloading'}
 try:
  if target.is_file() and target.stat().st_size==src['expectedBytes'] and zlib.crc32(target.read_bytes())&0xffffffff==src['crc32']: pass
  else:
   with ZipFile(m.RemoteZip(src['archiveUrl'])) as z:
    i=next(i for i in z.infolist() if m.real_name(i)==src['member'])
    data=z.read(i)
    if not data.startswith(b'%PDF'):raise ValueError('Not PDF')
    target.write_bytes(data)
  with target.open('rb') as f: sha=hashlib.file_digest(f,'sha256').hexdigest()
  row.update(status='downloaded',path=str(target),bytes=target.stat().st_size,sha256=sha)
 except Exception as e: row.update(status='failed',error=str(e))
 receipt.write_text(json.dumps(row,ensure_ascii=False,indent=2),encoding='utf8')
 print(json.dumps({'title':src['title'],'status':row['status'],'error':row.get('error')},ensure_ascii=False),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:list(pool.map(collect,jobs))
