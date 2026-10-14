"""Index observed official archives and save selected textbook PDFs, never executables."""
import argparse, concurrent.futures, hashlib, importlib.util, json, re, urllib.request
from pathlib import Path
from urllib.parse import quote, urlsplit
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'references/textbooks/초등'
spec = importlib.util.spec_from_file_location('archive_reader', ROOT/'scripts/collect-secondary-archives.py')
ar = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ar)
HOSTS = {'usb.mirae-n.com', 'download.mirae-n.com', 'update.mirae-n.com', 'dn.vivasam.com', 'cdata2.tsherpa.co.kr', 'cdata.tsherpa.co.kr', 'cdata.chunjae.co.kr'}

def request(url, start=None, end=None, method=None):
    if urlsplit(url).hostname not in HOSTS:
        raise ValueError('Source host not in observed publisher allowlist')
    headers = {'Range': f'bytes={start}-{end}'} if start is not None else {}
    return urllib.request.urlopen(urllib.request.Request(quote(url, safe=':/?=&%()+,'), headers=headers, method=method), timeout=60)

ar.request = request

def collect(source, index_only):
    folder = OUT/source['publisher']/source['subject']/ar.clean(source['title'])
    folder.mkdir(parents=True, exist_ok=True)
    result = {'source': source, 'status': 'indexing', 'files': []}
    receipt = folder/'수집기록.json'
    try:
        with ZipFile(ar.RemoteZip(source['url'])) as archive:
            entries = archive.infolist()
            inventory = [{'name': ar.real_name(i), 'bytes': i.file_size, 'crc32': i.CRC} for i in entries if not i.is_dir()]
            (folder/'원본묶음목록.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf8')
            # Exact members are chosen after viewing the archive inventory.
            selected = [i for i in entries if ar.real_name(i) in source.get('members', [])]
            result.update(status='indexed', memberCount=len(inventory), selected=len(selected))
            if not index_only:
                if len(selected) != len(source.get('members', [])):
                    raise ValueError('Requested member missing from official archive')
                for info in selected:
                    name = ar.real_name(info)
                    if not name.lower().endswith('.pdf'):
                        raise ValueError('Only PDF textbook members are selected')
                    key = hashlib.sha256(name.encode()).hexdigest()[:8]
                    target = folder/(ar.clean(Path(name).stem)+'__'+key+'.pdf')
                    row = {'member': name, 'path': str(target), 'expectedBytes': info.file_size, 'crc32': info.CRC}
                    try:
                        import zlib
                        if not (target.is_file() and target.stat().st_size == info.file_size and zlib.crc32(target.read_bytes()) & 0xffffffff == info.CRC):
                            data = archive.read(info)
                            if not data.startswith(b'%PDF'):
                                raise ValueError('Selected document is not PDF')
                            partial = target.with_suffix('.pdf.part')
                            partial.write_bytes(data)
                            partial.replace(target)
                        with target.open('rb') as f:
                            digest = hashlib.file_digest(f, 'sha256').hexdigest()
                        row.update(status='verified', bytes=target.stat().st_size, sha256=digest)
                    except Exception as exc:
                        row.update(status='failed', error=str(exc)[:250])
                    result['files'].append(row)
                    receipt.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
                    print(json.dumps({'title':source['title'], 'file':name, 'status':row['status']},ensure_ascii=False),flush=True)
                result['status'] = 'complete' if selected and all(r['status']=='verified' for r in result['files']) else 'needs-review'
    except Exception as exc:
        result.update(status='failed', error=str(exc)[:250])
    receipt.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    return {k:v for k,v in result.items() if k not in {'files','source'}} | {'title': source['title']}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('manifest')
    parser.add_argument('--index-only', action='store_true')
    parser.add_argument('--workers', type=int, default=3)
    args = parser.parse_args()
    sources = json.loads(Path(args.manifest).read_text(encoding='utf8'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for result in pool.map(lambda s: collect(s,args.index_only),sources):
            print(json.dumps(result,ensure_ascii=False),flush=True)
