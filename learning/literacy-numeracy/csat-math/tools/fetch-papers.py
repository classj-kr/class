import re, json, os, urllib.request, ssl
from source_paths import PAPERS_DIR
PAPERS_DIR.mkdir(parents=True, exist_ok=True)
ctx=ssl.create_default_context(); ctx.check_hostname=False; ctx.verify_mode=ssl.CERT_NONE
rows=json.load(open("board-rows.json",encoding="utf-8"))
want=[]
for r in rows:
    tds=r["tds"]
    if not any("수학"==t for t in tds): continue
    year=next((t for t in tds if re.fullmatch(r"20\d\d", t)), None)
    if not year or not (2022 <= int(year) <= 2027): continue
    if any("예시" in t for t in tds): continue
    round_ = "수능" if r["kind"]=="수능" else next((t for t in tds if t in ("6월","9월")), None)
    if round_ is None: continue
    tag = {"수능":"suneung","6월":"06","9월":"09"}[round_]
    for f in r["files"]:
        n=f["name"]
        if "짝수형" in n: continue
        kind = "answers" if "정답" in n else "paper"
        want.append((f"{year}-{tag}-{kind}.pdf", f["seq"]))
print("받을 파일", len(want))
for name,seq in want:
    p=PAPERS_DIR / name
    if os.path.exists(p) and os.path.getsize(p)>50000: print("있음", name); continue
    req=urllib.request.Request("https://www.suneung.re.kr/boardCnts/fileDown.do?fileSeq="+seq, headers={"User-Agent":"Mozilla/5.0"})
    d=urllib.request.urlopen(req,context=ctx,timeout=60).read()
    open(p,"wb").write(d)
    print(f"{name:28} {len(d)//1024:>6} KB")
