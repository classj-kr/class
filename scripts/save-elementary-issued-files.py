"""Save fresh download links returned by the publisher's normal download buttons."""
import concurrent.futures, hashlib, json, re, time, urllib.request
from pathlib import Path
from urllib.parse import urlsplit, unquote
ROOT=Path(__file__).resolve().parents[1]
INBOX=ROOT/'references/textbooks/수집기록/elementary-issued'
OUT=ROOT/'references/textbooks/초등'
INBOX.mkdir(parents=True,exist_ok=True)

def save(job):
    item=json.loads(job.read_text(encoding='utf8'))
    parts=urlsplit(item['url'])
    if parts.scheme!='https' or parts.hostname!='pridl-cms.mirae-n.com':
        raise ValueError('Only official issued document URLs allowed')
    canonical=parts._replace(query='',fragment='').geturl()
    row={k:v for k,v in item.items() if k!='url'}
    row['downloadUrl']=canonical
    clean=lambda s:re.sub(r'[<>:"/\\|?*\x00-\x1f]','_',str(s)).strip(' .')[:140]
    folder=OUT/clean(item['publisher'])/clean(item['subject'])/clean(item['book'])
    folder.mkdir(parents=True,exist_ok=True)
    filename=clean(unquote(parts.path.rsplit('/',1)[-1]))
    target=folder/filename
    receipt=folder/(filename+'.수집기록.json')
    try:
        with urllib.request.urlopen(item['url'],timeout=90) as response:
            data=response.read()
        if not data.startswith(b'%PDF'):
            raise ValueError('Response is not a PDF document')
        partial=target.with_suffix('.pdf.part');partial.write_bytes(data);partial.replace(target)
        row.update(status='verified',path=str(target),bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
    except Exception as exc:
        row.update(status='failed',errorType=type(exc).__name__)
    receipt.write_text(json.dumps(row,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps({'book':item['book'],'file':filename,'status':row['status'],'bytes':row.get('bytes',0)},ensure_ascii=False),flush=True)

seen=set(); pending=[]
deadline=time.monotonic()+7200
print('Waiting for observed official download links',flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    while time.monotonic()<deadline and not (INBOX/'STOP').exists():
        for job in INBOX.glob('*.json'):
            if job.name in seen:continue
            try:json.loads(job.read_text(encoding='utf8'))
            except (OSError,ValueError):continue
            seen.add(job.name);pending.append(pool.submit(save,job))
        time.sleep(.1)
    for future in pending:
        try:future.result()
        except Exception as exc:print(type(exc).__name__,flush=True)
