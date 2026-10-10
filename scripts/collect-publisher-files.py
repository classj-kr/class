"""Download exact official file URLs recorded from visible publisher pages."""
import concurrent.futures, hashlib, json, re, sys, urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'tmp/중고등자료_수집'
def collect(s):
    folder=BASE/s['publisher']/s['level']/s['subject']/s['category']
    folder.mkdir(parents=True,exist_ok=True)
    stem=re.sub(r'[<>:"/\\|?*\x00-\x1f]','_',s['title']).strip()
    receipt=folder/(stem+'.수집기록.json')
    if receipt.exists():
        try:
            prior=json.loads(receipt.read_text(encoding='utf8'))
            existing=Path(prior.get('path',''))
            if prior.get('url')==s['url'] and prior.get('status')=='downloaded' and existing.is_file() and existing.stat().st_size==prior.get('bytes') and hashlib.sha256(existing.read_bytes()).hexdigest()==prior.get('sha256'):
                return {'title':s['title'],'status':'verified_existing'}
        except (ValueError,OSError): pass
    row={**s,'status':'downloading'}
    try:
        with urllib.request.urlopen(s['url'],timeout=60) as r:
            data=r.read()
        ext=('.pdf' if data.startswith(b'%PDF') else '.jpg' if data.startswith(b'\xff\xd8\xff') else '.png' if data.startswith(b'\x89PNG') else '.zip' if data.startswith(b'PK') else '.hwp' if data.startswith(b'\xd0\xcf\x11\xe0') else None)
        if not ext: raise ValueError('Response is not a supported document/image')
        target=folder/(stem+ext)
        target.write_bytes(data)
        row.update(status='downloaded',path=str(target),bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
    except Exception as e: row.update(status='failed',error=str(e)[:200])
    receipt.write_text(json.dumps(row,ensure_ascii=False,indent=2),encoding='utf8')
    return {k:v for k,v in row.items() if k!='url'}
if __name__=='__main__':
    sources=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for row in pool.map(collect,sources):print(json.dumps(row,ensure_ascii=False),flush=True)
