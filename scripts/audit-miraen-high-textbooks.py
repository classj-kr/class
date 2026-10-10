"""Audit textbook downloads against the officially observed course pages."""
import argparse, hashlib, json
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'tmp/중고등자료_수집/미래엔/고등'
p=argparse.ArgumentParser()
p.add_argument('--hash',action='store_true')
args=p.parse_args()
sources=json.loads((ROOT/'references/textbooks/secondary-miraen-high-textbooks-all.json').read_text(encoding='utf8'))
receipts={}
for path in BASE.rglob('*.수집기록.json'):
    try:
        row=json.loads(path.read_text(encoding='utf8'))
        if row.get('url'):
            receipts.setdefault(row['url'],[]).append(row)
    except (ValueError,OSError):
        pass
rows=[]
for source in sources:
    row={**source,'status':'pending'}
    for receipt in receipts.get(source['url'],[]):
        path=Path(receipt.get('path',''))
        if receipt.get('status')!='downloaded' or not path.is_file():
            continue
        try:
            with path.open('rb') as f:
                signature=f.read(8)
            if path.stat().st_size!=receipt.get('bytes'):
                continue
            if not (signature.startswith(b'%PDF') or signature.startswith(b'\xd0\xcf\x11\xe0') or signature.startswith(b'PK')):
                continue
            if args.hash:
                with path.open('rb') as f:
                    digest=hashlib.file_digest(f,'sha256').hexdigest()
                if digest!=receipt.get('sha256'):
                    continue
            row.update(status='verified',path=str(path),bytes=receipt['bytes'],sha256=receipt['sha256'],format='pdf' if signature.startswith(b'%PDF') else 'hwp' if signature.startswith(b'\xd0\xcf') else 'zip')
            break
        except OSError:
            pass
    if row['status']=='pending':
        failures=[r for r in receipts.get(source['url'],[]) if r.get('status')=='failed']
        if failures:
            row.update(status='failed',error=failures[-1].get('error'))
    rows.append(row)
groups={}
for row in rows:
    group=groups.setdefault(row['category'],{'subject':row['subject'],'expected':0,'verified':0})
    group['expected']+=1
    group['verified']+=row['status']=='verified'
summary={'courses':len(groups),'coursesComplete':sum(g['expected']==g['verified'] for g in groups.values()),'expectedFiles':len(rows),'statuses':dict(Counter(r['status'] for r in rows)),'bytes':sum(r.get('bytes',0) for r in rows),'hashChecked':args.hash,'coursesBySubject':dict(Counter(g['subject'] for g in groups.values())),'groups':groups,'files':rows}
(ROOT/'tmp/미래엔_고등_교과서_검증.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in summary.items() if k not in {'groups','files'}},ensure_ascii=False))
