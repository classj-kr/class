"""Save document members from officially observed publisher archive URLs."""
import argparse, concurrent.futures, hashlib, io, json, re, time, urllib.request, zlib
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'tmp/중고등자료_수집'
BASE.mkdir(parents=True, exist_ok=True)

def request(url, start=None, end=None, method=None):
    from urllib.parse import urlsplit, quote
    if urlsplit(url).hostname not in {'cdata.chunjae.co.kr', 'usb.mirae-n.com', 'api-cms.mirae-n.com', 'update.mirae-n.com'}:
        raise ValueError('Unapproved source host')
    headers = {'Range': f'bytes={start}-{end}'} if start is not None else {}
    url = quote(url, safe=':/?=&%()+,')
    return urllib.request.urlopen(urllib.request.Request(url, headers=headers, method=method), timeout=45)

class RemoteZip(io.RawIOBase):
    def __init__(self, url):
        self.url, self.pos = url, 0
        with request(url, method='HEAD') as r:
            self.size = int(r.headers['Content-Length'])
    def seekable(self): return True
    def seek(self, offset, whence=0):
        self.pos = offset if whence == 0 else self.pos + offset if whence == 1 else self.size + offset
        return self.pos
    def tell(self): return self.pos
    def read(self, size=-1):
        size = self.size-self.pos if size < 0 else min(size, self.size-self.pos)
        if size <= 0: return b''
        with request(self.url, self.pos, self.pos+size-1) as r:
            if r.status != 206: raise ValueError('Range not supported')
            data = r.read()
        self.pos += len(data)
        return data

def clean(s): return re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', s).strip().rstrip('.')[:150]
def real_name(info):
    try: return info.filename if info.flag_bits & 0x800 else info.filename.encode('cp437').decode('cp949')
    except UnicodeError: return info.filename

def collect(source, index_only):
    folder = BASE / source['publisher'] / source['level'] / source['subject'] / clean(source['title'])
    folder.mkdir(parents=True, exist_ok=True)
    receipts = folder / '수집기록.json'
    result = {'source': source, 'files': [], 'status': 'indexing'}
    try:
        remote = RemoteZip(source['url'])
        with ZipFile(remote) as archive:
            entries = archive.infolist()
            inventory = [{'name': real_name(i), 'bytes': i.file_size, 'crc32': i.CRC} for i in entries]
            (folder / '원본묶음목록.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf8')
            selected = [i for i in entries if not i.is_dir() and (
                Path(real_name(i)).suffix.lower() in {'.pdf','.hwp','.hwpx','.doc','.docx'} or
                (Path(real_name(i)).suffix.lower()=='.zip' and re.search('평가|문제|문항|백지도|부도|연표',real_name(i))))]
            result.update(archiveBytes=remote.size, selected=len(selected), status='indexed' if index_only else 'downloading')
            receipts.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
            if not index_only:
                for i in selected:
                    name=real_name(i)
                    key=hashlib.sha256(name.encode()).hexdigest()[:10]
                    target=folder / (clean(Path(name).stem)+'__'+key+Path(name).suffix.lower())
                    row={'member':name,'path':str(target),'bytes':i.file_size,'crc32':i.CRC}
                    try:
                        if target.exists() and target.stat().st_size==i.file_size and zlib.crc32(target.read_bytes()) & 0xffffffff==i.CRC:
                            row['status']='existing'
                        else:
                            with archive.open(i) as src, target.with_suffix(target.suffix+'.part').open('wb') as dst:
                                while block:=src.read(1024*1024): dst.write(block)
                            part=target.with_suffix(target.suffix+'.part')
                            if part.stat().st_size != i.file_size: raise ValueError('Size mismatch')
                            part.replace(target)
                            row['status']='downloaded'
                        row['sha256']=hashlib.sha256(target.read_bytes()).hexdigest()
                    except Exception as e:
                        row.update(status='failed',error=str(e)[:200])
                    result['files'].append(row)
                    receipts.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
                    print(json.dumps({'title':source['title'],'file':name,'status':row['status']},ensure_ascii=False),flush=True)
                result['status']='complete' if all(r['status']!='failed' for r in result['files']) else 'partial'
    except Exception as e: result.update(status='failed',error=str(e)[:200])
    receipts.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    return {k:v for k,v in result.items() if k!='files'}

if __name__=='__main__':
    p=argparse.ArgumentParser(); p.add_argument('manifest'); p.add_argument('--index-only',action='store_true'); p.add_argument('--workers',type=int,default=2)
    args=p.parse_args()
    sources=json.loads(Path(args.manifest).read_text(encoding='utf-8-sig'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for result in pool.map(lambda s:collect(s,args.index_only),sources):
            print(json.dumps(result,ensure_ascii=False),flush=True)
