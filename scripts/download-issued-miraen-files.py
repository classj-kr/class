"""Save short-lived URLs issued by the official authenticated download UI.

The temporary inbox is ignored. Permanent receipts omit signed query strings.
"""
import hashlib
import json
import time
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit, unquote

root = Path(__file__).resolve().parents[1]
inbox = root / 'references/textbooks/수집기록/miraen-issued'
dest = root / 'references/textbooks/수집작업/math-downloads'
receipts = root / 'references/textbooks/math-miraen-download-receipts.json'
inbox.mkdir(parents=True, exist_ok=True)
dest.mkdir(parents=True, exist_ok=True)
rows = json.loads(receipts.read_text(encoding='utf-8')) if receipts.exists() else []
seen = set()
deadline = time.monotonic() + 7200
print('Waiting for official download URLs', flush=True)
while time.monotonic() < deadline:
    for job in inbox.glob('*.json'):
        if job.name in seen:
            continue
        try:
            item = json.loads(job.read_text(encoding='utf-8'))
        except (ValueError, OSError):
            continue
        seen.add(job.name)
        parts = urlsplit(item['url'])
        if parts.scheme != 'https' or parts.hostname != 'pridl-cms.mirae-n.com':
            print('Rejected unexpected download host', flush=True)
            continue
        canonical = parts._replace(query='', fragment='').geturl()
        name = unquote(parts.path.rsplit('/', 1)[-1])
        target = dest / (hashlib.sha256(canonical.encode()).hexdigest()[:24] + Path(name).suffix)
        try:
            previous = next((r for r in rows if r.get('downloadUrl') == canonical), {})
            if previous and target.is_file():
                data = target.read_bytes()
            else:
                req = urllib.request.Request(item['url'], headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=45) as response:
                    data = response.read()
            if not (data.startswith(b'\xd0\xcf\x11\xe0') or data.startswith(b'%PDF') or data.startswith(b'PK')):
                raise ValueError('Response is not a document')
            target.write_bytes(data)
            row = {k: v for k, v in item.items() if k != 'url'}
            resource_ids = set(previous.get('resourceIds', []))
            resource_ids.update(v for v in (previous.get('resourceId'), item.get('resourceId')) if v)
            row['resourceIds'] = sorted(resource_ids)
            row['labels'] = sorted(set(previous.get('labels', []) + [previous.get('label', ''), item.get('label', '')]) - {''})
            row.update(publisher='미래엔', fileName=name, downloadUrl=canonical,
                       path=str(target), bytes=len(data), sha256=hashlib.sha256(data).hexdigest())
            rows = [r for r in rows if r.get('downloadUrl') != canonical] + [row]
            pending = receipts.with_suffix('.pending.json')
            pending.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
            pending.replace(receipts)
            print(json.dumps({'saved': name, 'bytes': len(data), 'total': len(rows)}, ensure_ascii=False), flush=True)
        except Exception as error:
            print(json.dumps({'failed': name, 'errorType': type(error).__name__}, ensure_ascii=False), flush=True)
    time.sleep(.15)
