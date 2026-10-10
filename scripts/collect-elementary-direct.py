"""Download exact official PDF links observed in publisher ebook UI."""
import concurrent.futures, hashlib, json, re, urllib.request
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, quote, unquote
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'references/textbooks/초등'
def clean(s):return re.sub(r'[<>:"/\\|?*]','_',s)
def save(source):
    parts=urlsplit(source['url'])
    if parts.scheme!='https' or parts.hostname!='cdata2.tsherpa.co.kr':raise ValueError('Unexpected source')
    url=urlunsplit(parts._replace(path=quote(unquote(parts.path),safe='/()_-.')))
    folder=OUT/source['publisher']/source['subject']/clean(source['title'])
    folder.mkdir(parents=True,exist_ok=True)
    target=folder/(clean(source['title'])+'.pdf')
    receipt={'source':source,'files':[]}
    try:
        with urllib.request.urlopen(url,timeout=90) as r:data=r.read()
        if not data.startswith(b'%PDF-'):raise ValueError('Not PDF')
        temp=target.with_suffix('.part');temp.write_bytes(data);temp.replace(target)
        receipt['files']=[dict(path=str(target),member=unquote(parts.path.rsplit('/',1)[-1]),bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),status='verified')]
        receipt['status']='complete'
    except Exception as exc:receipt.update(status='failed',error=str(exc))
    (folder/'수집기록.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps({'title':source['title'],'status':receipt['status'],'bytes':target.stat().st_size if target.exists() else 0},ensure_ascii=False),flush=True)
if __name__=='__main__':
    sources=json.loads((ROOT/'references/textbooks/elementary-tsherpa-direct.json').read_text(encoding='utf-8-sig'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(save,sources))
