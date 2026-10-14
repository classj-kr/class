"""Collect omitted math problem documents from previously inventoried official ZIPs."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import zipfile
import zlib
import importlib.util

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
DEST = ROOT / 'references/textbooks/수집작업/math-downloads'
spec = importlib.util.spec_from_file_location('visang_archives', ROOT / 'scripts/collect-visang-public-archives.py')
archive_tools = importlib.util.module_from_spec(spec)
spec.loader.exec_module(archive_tools)

def collect(source):
    remote = archive_tools.RemoteZip(source['url'])
    rows = []
    with zipfile.ZipFile(remote) as archive:
        for item in archive.infolist():
            name = archive_tools.decode(item.filename)
            if Path(name).suffix.lower() not in {'.hwp', '.hwpx', '.pdf'}:
                continue
            category = name.split('/')[-2]
            if category not in {'차시별 기초 개념 문제', '차시별 심화 문제', '수학익힘'}:
                continue
            identity = hashlib.sha256((source['url'] + '\n' + name).encode()).hexdigest()[:24]
            target = DEST / (identity + Path(name).suffix.lower())
            try:
                data = target.read_bytes() if target.is_file() else archive.read(item)
                assert len(data) == item.file_size and zlib.crc32(data) & 0xffffffff == item.CRC
                assert data.startswith((b'\xd0\xcf\x11\xe0', b'%PDF', b'PK'))
                target.write_bytes(data)
                rows.append({'id': identity, 'publisher': '비상교육', 'book': source['course'],
                             'category': category, 'sourceUrl': source['exhibitionUrl'],
                             'archiveUrl': source['url'], 'archiveMember': name,
                             'path': str(target), 'bytes': len(data),
                             'sha256': hashlib.sha256(data).hexdigest(), 'crc32': item.CRC,
                             'status': 'downloaded'})
            except Exception as error:
                rows.append({'id': identity, 'book': source['course'], 'archiveMember': name,
                             'status': 'failed', 'error': str(error)[:180]})
            if len(rows) % 25 == 0:
                print(json.dumps({'book': source['course'], 'processed': len(rows)}, ensure_ascii=False), flush=True)
    archive_tools.write(REF / ('math-visang-' + source['id'] + '-supplement-receipts.json'), rows)
    return rows

if __name__ == '__main__':
    sources = [s for s in archive_tools.read(REF / 'visang-public-archives.json')['sources'] if s['id'].startswith('math')]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(collect, sources))
    rows = [r for result in results for r in result]
    archive_tools.write(REF / 'math-visang-archive-supplement-receipts.json', rows)
    print(json.dumps({'downloaded': sum(r['status'] == 'downloaded' for r in rows),
                      'failed': sum(r['status'] == 'failed' for r in rows)}), flush=True)
