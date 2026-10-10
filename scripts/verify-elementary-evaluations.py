"""Verify downloaded original assessments and unpack official document bundles."""
import hashlib, json, re, sys, io
from pathlib import Path
from zipfile import ZipFile
from collections import Counter

ROOT = Path(__file__).resolve().parents[1] / 'references/textbooks'
OUT = ROOT / '초등평가'
DOCS = {'.pdf', '.hwp', '.hwpx', '.doc', '.docx', '.xlsx', '.pptx', '.zip'}
def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
def signature(path, data):
    ext = path.suffix.lower()
    if ext == '.pdf': return data[:1024].find(b'%PDF-') >= 0
    if ext == '.hwp' and data[:2] == b'PK':
        with ZipFile(io.BytesIO(data)) as z:
            return 'Contents/content.hpf' in z.namelist() and z.testzip() is None
    if ext in {'.hwp', '.doc'}: return data[:8] == bytes.fromhex('d0cf11e0a1b11ae1')
    if ext in {'.zip', '.hwpx', '.docx', '.xlsx', '.pptx'}: return data[:2] == b'PK'
    return True
def verify(row):
    p = Path(row['path']); data = p.read_bytes()
    assert len(data) == row['bytes'], 'size mismatch'
    assert hashlib.sha256(data).hexdigest() == row['sha256'], 'hash mismatch'
    assert signature(p, data), 'invalid document signature'
    if p.suffix.lower() in {'.zip', '.hwpx', '.docx', '.xlsx', '.pptx'}:
        with ZipFile(p) as z: assert z.testzip() is None, 'ZIP CRC mismatch'
    return data
rows = []
for p in OUT.glob('*/*/*/수집기록.json'):
    receipt = json.loads(p.read_text(encoding='utf-8'))
    rows.extend({**r, 'provider':receipt['provider'], 'subject':receipt['subject'], 'book':receipt['book'], 'sourcePage':receipt.get('sourcePage'), 'sourceArchive':receipt.get('url')} for r in receipt['files'])
for name in ['elementary-douclass-evaluation-downloads.json', 'elementary-didim-evaluation-downloads.json']:
    p = ROOT / name
    if p.exists():
        original = json.loads(p.read_text(encoding='utf-8'))
        for r in original:
            m = re.search(r'(\d)-(\d)', r['book'])
            if m: r.update(grade=int(m[1]), semester=int(m[2]))
        dump(p, original)
        rows.extend(original)
expanded = []
failures = []
for row in rows:
    try:
        verify(row)
        if Path(row['path']).suffix.lower() != '.zip' or row['provider'] not in {'디딤돌', '두클래스'}: continue
        parent = Path(row['path']); folder = parent.parent / (parent.stem + '_내용')
        with ZipFile(parent) as z:
            for info in z.infolist():
                if info.is_dir(): continue
                name = info.filename
                if not info.flag_bits & 0x800:
                    try: name = name.encode('cp437').decode('cp949')
                    except (UnicodeError, LookupError): pass
                if Path(name).suffix.lower() not in DOCS: continue
                clean = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', Path(name.replace('\\','/')).name)
                dest = folder / (Path(clean).stem[:110] + '__' + hashlib.sha256(name.encode()).hexdigest()[:10] + Path(clean).suffix)
                data = z.read(info)
                assert signature(dest, data), 'invalid member signature: '+name
                folder.mkdir(parents=True, exist_ok=True)
                if not dest.exists(): dest.write_bytes(data)
                expanded.append({**row,'path':str(dest),'member':name,'parentArchive':str(parent),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'crc32':info.CRC})
    except Exception as exc: failures.append({'path':row['path'],'error':str(exc)})
all_rows = list({r['path']:r for r in rows + expanded}.values())
summary = {'files':len(all_rows),'uniqueContents':len({r['sha256'] for r in all_rows}),'bytes':sum(r['bytes'] for r in all_rows),'providerSubject':dict(Counter(r['provider']+'/'+r['subject'] for r in all_rows)), 'failures':failures, 'note':'Counts are files, including original ZIP bundles and their extracted documents; not question counts or a claim of complete publisher question banks.'}
dump(OUT/'전체_파일목록.json', all_rows)
dump(OUT/'파일검증_결과.json', summary)
print(json.dumps(summary, ensure_ascii=False))
sys.exit(bool(failures))
