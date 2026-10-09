"""Download math files from official URLs observed in the authenticated UI.

This collects local reference files only; it does not parse or publish questions.
"""
import concurrent.futures, hashlib, json, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
DEST = ROOT / 'tmp/textbook-research/math-downloads'
QUEUE = REF / 'math-download-queue.json'
RECEIPTS = REF / 'math-direct-download-receipts.json'
DEST.mkdir(parents=True, exist_ok=True)

def read(path, default):
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else default

receipts = read(RECEIPTS, [])
done = {r['url'] for r in receipts if r['status'] == 'downloaded' and Path(r['path']).is_file()}
for bundle in read(REF / 'math-download-receipts.json', []):
    if Path(bundle['path']).is_file():
        done.update(f['url'] for f in bundle.get('sourceFiles', []))
for source in read(REF / 'visang-public-bank-acquired.json', {}).get('sources', []):
    if source.get('downloadUrl') and (REF / 'raw' / source.get('sourceFile', '')).is_file():
        done.add(urllib.parse.quote(source['downloadUrl'], safe=':/?=&%'))

def save_receipts():
    temporary = RECEIPTS.with_suffix('.json.part')
    text = json.dumps(receipts, ensure_ascii=False, indent=2) + '\n'
    for attempt in range(20):
        try:
            temporary.write_text(text, encoding='utf-8')
            temporary.replace(RECEIPTS)
            return
        except OSError:
            if attempt == 19:
                raise
            time.sleep(0.1)

def download(item):
    url = item['url']
    parsed = urllib.parse.urlparse(url)
    assert parsed.scheme == 'https' and parsed.hostname in {'download.i-scream.co.kr', 'ibook.vivasam.com', 'ymhcopau2891.edge.naverncp.com', 'cdata2.tsherpa.co.kr'}
    suffix = Path(urllib.parse.unquote(parsed.path)).suffix.lower()
    assert suffix in {'.hwp', '.hwpx', '.pdf', '.zip'}
    target = DEST / (hashlib.sha256(url.encode()).hexdigest()[:24] + suffix)
    for attempt in range(3):
        try:
            if target.is_file():
                data = target.read_bytes()
            else:
                with urllib.request.urlopen(url, timeout=45) as response:
                    data = response.read()
            valid = (data.startswith(b'\xd0\xcf\x11\xe0') if suffix == '.hwp'
                     else data.startswith(b'%PDF') if suffix == '.pdf'
                     else data.startswith(b'PK'))
            if not valid:
                raise ValueError('Response is not the expected document format')
            temp = target.with_suffix(suffix + '.part')
            temp.write_bytes(data)
            temp.replace(target)
            return {**item, 'path': str(target), 'bytes': len(data),
                    'sha256': hashlib.sha256(data).hexdigest(), 'status': 'downloaded',
                    'downloadedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                    'purpose': 'local-reference-collection'}
        except Exception as error:
            if attempt == 2:
                return {**item, 'status': 'failed', 'error': type(error).__name__ + ': ' + str(error)[:160]}
            time.sleep(attempt + 1)

jobs = [q for q in read(QUEUE, []) if q['url'] not in done]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    pending = [pool.submit(download, item) for item in jobs]
    for index, future in enumerate(concurrent.futures.as_completed(pending), 1):
        result = future.result()
        receipts = [r for r in receipts if r['url'] != result['url']]
        receipts.append(result)
        if index % 25 == 0 or index == len(jobs):
            save_receipts()
            print(json.dumps({'processed': index, 'queued': len(jobs),
                              'downloaded': sum(r['status'] == 'downloaded' for r in receipts),
                              'failed': sum(r['status'] == 'failed' for r in receipts)}), flush=True)
