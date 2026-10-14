"""Select companion textbook PDFs from observed official archive inventories."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'references/textbooks'
jobs=[]
for p in (ROOT/'초등').glob('*/*/*/수집기록.json'):
    r=json.loads(p.read_text(encoding='utf-8'));s=r.get('source',{})
    inv=p.parent/'원본묶음목록.json'
    if not inv.exists() or not s.get('url'):continue
    existing={f.get('member') for f in r.get('files',[])}
    selected=[f['name'] for f in json.loads(inv.read_text(encoding='utf-8')) if f['name'].lower().endswith('.pdf') and re.search(r'국어\s*활동|수학\s*익힘|실험\s*관찰|사회과\s*부도',Path(f['name']).name) and not re.search(r'평가|지도서|지도안|계획',Path(f['name']).name)]
    missing=set(selected)-existing
    if missing:
        jobs.append({**s,'members':sorted(existing|set(selected))})
dest=ROOT/'elementary-companion-supplement.json'
dest.write_text(json.dumps(jobs,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'books':len(jobs),'selectedFiles':sum(len(s['members']) for s in jobs)},ensure_ascii=False))
