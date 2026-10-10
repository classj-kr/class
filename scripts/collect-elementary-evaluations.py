"""Collect assessment documents from already observed official textbook archives."""
import concurrent.futures, hashlib, importlib.util, io, json, re, threading, time, zlib
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
OUT = REF / '초등평가'
spec = importlib.util.spec_from_file_location('elementary_archive', ROOT / 'scripts/collect-elementary-textbooks.py')
archive_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(archive_module)
ar = archive_module.ar
DOCUMENTS = {'.pdf', '.hwp', '.hwpx', '.doc', '.docx', '.xlsx', '.pptx', '.zip'}

def selected(name):
    return bool(re.search(r'평가|문제\s*은행|문항|진단|쪽지시험|중간|기말', name)) and Path(name).suffix.lower() in DOCUMENTS

def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)

def save_content(folder, name, data, parent=None):
    key = hashlib.sha256(name.encode('utf-8')).hexdigest()[:12]
    dest = folder / (ar.clean(Path(name.replace('\\', '/')).stem)[:110] + '__' + key + Path(name).suffix.lower())
    if not dest.exists() or dest.read_bytes() != data:
        dest.write_bytes(data)
    row = {'member': name, 'path': str(dest), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'status': 'verified'}
    if parent:
        row['archiveMember'] = parent
    return row

def collect(source):
    folder = OUT / source['provider'] / source['subject'] / ar.clean(source['book'])
    folder.mkdir(parents=True, exist_ok=True)
    receipt = folder / '수집기록.json'
    old = json.loads(receipt.read_text(encoding='utf-8')) if receipt.exists() else {}
    saved = {r['member']: r for r in old.get('files', [])}
    result = {**source, 'status': 'downloading', 'files': list(saved.values()), 'failures': []}
    try:
        with ZipFile(ar.RemoteZip(source['url'])) as archive:
            entries = [i for i in archive.infolist() if not i.is_dir() and selected(ar.real_name(i))]
            result['expectedMaterials'] = len(entries)
            for i, info in enumerate(entries, 1):
                name = ar.real_name(info)
                try:
                    prior = saved.get(name)
                    path = Path(prior['path']) if prior else None
                    if path and path.is_file() and path.stat().st_size == info.file_size and zlib.crc32(path.read_bytes()) & 0xffffffff == info.CRC:
                        data = path.read_bytes() if path.suffix.lower() == '.zip' else None
                    else:
                        data = archive.read(info)
                        saved[name] = save_content(folder, name, data)
                        saved[name]['crc32'] = info.CRC
                    if name.lower().endswith('.zip'):
                        with ZipFile(io.BytesIO(data)) as nested:
                            for member in nested.infolist():
                                inner = ar.real_name(member)
                                if member.is_dir() or Path(inner).suffix.lower() not in DOCUMENTS - {'.zip'}:
                                    continue
                                fullname = name + '::' + inner
                                if fullname not in saved:
                                    saved[fullname] = save_content(folder, fullname, nested.read(member), name)
                    if i % 10 == 0:
                        result['files'] = list(saved.values())
                        write_json(receipt, result)
                except Exception as exc:
                    result['failures'].append({'member': name, 'error': str(exc)[:240]})
            result['status'] = 'complete' if entries and not result['failures'] else 'needs-review'
    except Exception as exc:
        result['status'] = 'failed'
        result['error'] = str(exc)[:240]
    result['files'] = list(saved.values())
    write_json(receipt, result)
    summary = {k: result[k] for k in ['provider', 'subject', 'book', 'status']}
    summary.update(files=len(saved), failures=len(result['failures']), bytes=sum(r['bytes'] for r in saved.values()))
    print(json.dumps(summary, ensure_ascii=False), flush=True)
    return summary

if __name__ == '__main__':
    sources = []
    for pub, provider in [('미래엔', '엠티처'), ('천재', '티셀파')]:
        for inventory in (REF / '초등' / pub).glob('*/*/원본묶음목록.json'):
            subject = inventory.parent.parent.name
            if subject not in ['국어', '수학', '사회', '과학']:
                continue
            members = json.loads(inventory.read_text(encoding='utf-8-sig'))
            if not any(selected(m['name']) for m in members):
                continue
            record = json.loads((inventory.parent / '수집기록.json').read_text(encoding='utf-8-sig'))
            sources.append({'provider': provider, 'subject': subject, 'book': inventory.parent.name, 'url': record['source']['url'], 'sourcePage': record['source'].get('sourceUrl'), 'inventory': str(inventory)})
    sources.sort(key=lambda s: (['과학', '사회', '국어', '수학'].index(s['subject']), s['provider'], s['book']))
    write_json(REF / 'elementary-evaluation-archive-sources.json', sources)
    print('Observed archives:', len(sources), flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        summaries = list(pool.map(collect, sources))
    write_json(OUT / '공식묶음_수집결과.json', summaries)
