"""Download only math documents from officially linked ebook ZIPs using HTTP ranges."""
import concurrent.futures
import hashlib
import io
import json
import re
import struct
import threading
import time
import urllib.request
import zlib
from pathlib import Path
from urllib.parse import urlsplit
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'references/textbooks'
DEST = ROOT / 'tmp/textbook-research/math-downloads'
RECEIPTS = BASE / 'math-tselpa-archive-download-receipts.json'
DEST.mkdir(parents=True, exist_ok=True)
sources = json.loads((BASE / 'tselpa-ebook-math-zip-sources.json').read_text(encoding='utf8'))
rows = json.loads(RECEIPTS.read_text(encoding='utf8')) if RECEIPTS.exists() else []
lock = threading.Lock()

def request(url, start=None, end=None, method=None):
    assert urlsplit(url).hostname == 'cdata.chunjae.co.kr'
    headers = {'Range': f'bytes={start}-{end}'} if start is not None else {}
    for attempt in range(3):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=headers, method=method), timeout=60)
        except Exception:
            if attempt == 2:
                raise
            time.sleep(attempt + 1)

class RemoteZip(io.RawIOBase):
    def __init__(self, url):
        self.url = url
        with request(url, method='HEAD') as response:
            self.size = int(response.headers['Content-Length'])
        self.pos = 0
    def seekable(self):
        return True
    def seek(self, offset, whence=0):
        self.pos = offset if whence == 0 else self.pos + offset if whence == 1 else self.size + offset
        return self.pos
    def tell(self):
        return self.pos
    def read(self, size=-1):
        size = self.size - self.pos if size < 0 else min(size, self.size - self.pos)
        if size <= 0:
            return b''
        with request(self.url, self.pos, self.pos + size - 1) as response:
            if response.status != 206:
                raise ValueError('Server did not honor range; refusing full media archive')
            data = response.read()
        self.pos += len(data)
        return data

def real_name(info):
    if info.flag_bits & 0x800:
        return info.filename
    try:
        return info.filename.encode('cp437').decode('cp949')
    except (UnicodeError, LookupError):
        return info.filename

def save_rows():
    pending = RECEIPTS.with_suffix('.pending.json')
    for attempt in range(30):
        try:
            pending.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf8')
            pending.replace(RECEIPTS)
            return
        except PermissionError:
            if attempt == 29:
                raise
            time.sleep(.1)

def member_data(url, remote, info, target):
    if target.is_file():
        data = target.read_bytes()
        if len(data) == info.file_size and zlib.crc32(data) & 0xffffffff == info.CRC:
            return data
    end = min(remote.size - 1, info.header_offset + info.compress_size + 65536)
    with request(url, info.header_offset, end) as response:
        if response.status != 206:
            raise ValueError('Range not honored')
        block = response.read()
    fields = struct.unpack('<4s5H3I2H', block[:30])
    assert fields[0] == b'PK\x03\x04'
    offset = 30 + fields[-2] + fields[-1]
    packed = block[offset:offset + info.compress_size]
    if info.compress_type == 8:
        return zlib.decompress(packed, -15)
    if info.compress_type == 0:
        return packed
    raise ValueError('Unsupported ZIP compression')

def collect(source):
    url = source['zipUrl']
    remote = RemoteZip(url)
    with ZipFile(remote) as archive:
        infos = archive.infolist()
    selected = [(info, real_name(info)) for info in infos
                if Path(real_name(info)).suffix.lower() in {'.hwp', '.hwpx', '.pdf'}
                and re.search('평가|문제|익힘|학습지|활동지|연산', real_name(info))]
    manifest = {**source, 'archiveBytes': remote.size,
                'selected': [{'member': name, 'bytes': info.file_size, 'crc32': info.CRC} for info, name in selected]}
    key = re.search(r'TB[^/]+', url).group()
    (BASE / 'tselpa-ebook-math-download-lists' / (key + '-archive.json')).write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf8')
    completed = 0
    for info, name in selected:
        identity = hashlib.sha256((url + '\n' + name).encode()).hexdigest()[:24]
        target = DEST / (identity + Path(name).suffix.lower())
        with lock:
            previous = next((row for row in rows if row['id'] == identity), None)
        if previous and target.is_file():
            completed += 1
            continue
        try:
            data = member_data(url, remote, info, target)
            assert len(data) == info.file_size and zlib.crc32(data) & 0xffffffff == info.CRC
            assert data.startswith((b'\xd0\xcf\x11\xe0', b'%PDF', b'PK'))
            target.write_bytes(data)
            row = {'id': identity, 'publisher': 'T셀파', 'sourceUrl': source['sourceUrl'],
                   'ebookUrl': source['url'], 'archiveUrl': url, 'archiveMember': name,
                   'grade': source['grade'], 'author': source['author'], 'path': str(target),
                   'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'status': 'downloaded'}
            completed += 1
        except Exception as error:
            row = {'id': identity, 'publisher': 'T셀파', 'archiveUrl': url, 'archiveMember': name,
                   'status': 'failed', 'error': type(error).__name__ + ': ' + str(error)[:160]}
        with lock:
            rows[:] = [old for old in rows if old['id'] != identity] + [row]
            if completed % 20 == 0 or completed == len(selected):
                save_rows()
        if completed % 50 == 0:
            print(json.dumps({'book': key, 'saved': completed, 'selected': len(selected)}, ensure_ascii=False), flush=True)
    with lock:
        save_rows()
    return {'book': key, 'selected': len(selected), 'saved': completed}

def collect_safe(source):
    try:
        return collect(source)
    except Exception as error:
        return {**source, 'status': 'source-unavailable',
                'error': type(error).__name__ + ': ' + str(error)[:160]}

source_failures = []
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for result in pool.map(collect_safe, sources):
        if result.get('status') == 'source-unavailable':
            source_failures.append(result)
        print(json.dumps(result, ensure_ascii=False), flush=True)
(BASE / 'tselpa-ebook-math-archive-source-errors.json').write_text(
    json.dumps(source_failures, ensure_ascii=False, indent=2), encoding='utf8')
print(json.dumps({'saved': sum(row['status'] == 'downloaded' for row in rows),
                  'failed': sum(row['status'] == 'failed' for row in rows)}, ensure_ascii=False))
