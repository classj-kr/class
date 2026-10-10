import pymupdf, re, json, glob, os, sys
from source_paths import PAPERS_DIR
sys.stdout.reconfigure(encoding="utf-8")
CIRC="①②③④⑤"
idx=json.load(open("four-point-index.json",encoding="utf-8"))
out={}; bad=[]
for path in sorted(PAPERS_DIR.glob("*-answers.pdf")):
    key=os.path.basename(path).replace("-answers.pdf","")
    doc=pymupdf.open(path)
    t=re.sub(r"\s+"," ", doc[0].get_text())
    t=t[t.find("배점")+2:] if "배점" in t else t
    toks=re.findall(r"[①-⑤]|\d+", t)
    got={}
    for i in range(0, len(toks)-2, 3):
        num,ans,sc = toks[i], toks[i+1], toks[i+2]
        if not num.isdigit() or not sc.isdigit(): continue
        n=int(num)
        if 1<=n<=22 and n not in got and sc in "234":
            got[n]={"answer": ans if ans in CIRC else int(ans) if ans.isdigit() else ans,
                    "score": int(sc)}
    # 문제지에서 읽은 배점과 대조
    paper=idx[key]["scores"]
    for n,v in got.items():
        if str(n) in paper and paper[str(n)]!=v["score"]:
            bad.append((key,n,paper[str(n)],v["score"]))
    out[key]=got
    miss=[n for n in range(1,23) if n not in got]
    print(f"{key:14} {len(got):2}문항" + (f"  ※빠짐{miss}" if miss else "  ✓"))
json.dump(out, open("answers.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("\n배점 어긋난 곳:", bad if bad else "없음")
