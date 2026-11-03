"""Collect exact, publicly advertised social studies textbook PDF URLs."""
import concurrent.futures
import hashlib
import json
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'references/textbooks'
ALLOWED = {'download.i-scream.co.kr', 'download.visang.com', 'dn.vivasam.com',
           'www.ybmcloud.com', 'wbook.jihak.co.kr', 'dcziozxkawa71.cloudfront.net'}


def collect(source):
    target = (BASE / source['relativePath']).resolve()
    target.relative_to(BASE.resolve())
    if urlparse(source['url']).hostname not in ALLOWED:
        raise ValueError('Unreviewed publisher host')
    target.parent.mkdir(parents=True, exist_ok=True)
    receipt_path = target.with_suffix('.수집기록.json')
    row = dict(source)
    partial = target.with_suffix('.pdf.part')
    try:
        if not target.exists():
            request = urllib.request.Request(source['url'], headers={
                'User-Agent': 'Mozilla/5.0', 'Referer': source['sourceUrl']})
            with urllib.request.urlopen(request, timeout=120) as response, partial.open('wb') as out:
                if urlparse(response.url).hostname not in ALLOWED:
                    raise ValueError('Unreviewed redirect host')
                expected_bytes = response.headers.get('Content-Length')
                while chunk := response.read(1024 * 1024):
                    out.write(chunk)
            if expected_bytes and partial.stat().st_size != int(expected_bytes):
                raise ValueError('Incomplete download')
            with partial.open('rb') as stream:
                if stream.read(5) != b'%PDF-':
                    raise ValueError('Response is not PDF')
            with pymupdf.open(partial) as document:
                if len(document) < source.get('minPages', 2):
                    raise ValueError('Preview shorter than expected textbook')
            partial.replace(target)
        with pymupdf.open(target) as document:
            pages = len(document)
            if pages < source.get('minPages', 2):
                raise ValueError('Too few pages')
        with target.open('rb') as stream:
            sha = hashlib.file_digest(stream, 'sha256').hexdigest()
        row.update(status='verified', bytes=target.stat().st_size, pages=pages,
                   sha256=sha, path=str(target))
    except Exception as error:
        row.update(status='failed', error=str(error))
        partial.unlink(missing_ok=True)
    receipt_path.write_text(json.dumps(row, ensure_ascii=False, indent=2), encoding='utf-8')
    return {key: value for key, value in row.items() if key not in ('url', 'sourceUrl')}


if __name__ == '__main__':
    manifest = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for result in pool.map(collect, manifest):
            print(json.dumps(result, ensure_ascii=False), flush=True)
