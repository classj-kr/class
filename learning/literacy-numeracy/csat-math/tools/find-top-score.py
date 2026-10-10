import pymupdf, re, json, glob, os, sys
from source_paths import PAPERS_DIR
sys.stdout.reconfigure(encoding="utf-8")
PUA=re.compile(r"[\ue000-\uf8ff]")
SEL=("확률과 통계","미적분","기하")
out={}
for path in sorted(PAPERS_DIR.glob("*-paper.pdf")):
    key=os.path.basename(path).replace("-paper.pdf","")
    doc=pymupdf.open(path)
    pages=[re.sub(r"\s+"," ", PUA.sub("#", p.get_text())) for p in doc]
    # 쪽 머리글(맨 앞 90자)에 선택 과목 이름이 있으면 그 쪽부터 선택 과목이다
    def is_sel(t): return any(s in t[:90] for s in SEL)
    end=next((i for i,t in enumerate(pages) if is_sel(t)), len(pages))
    common=" ".join(pages[:end])
    items=[]
    for m in re.finditer(r"(?:^|\s)(\d{1,2})\.\s", common):
        n=int(m.group(1))
        if 1<=n<=22: items.append((n, m.start(), m.end()))
    # 번호가 1부터 커지는 줄기만 남긴다(잘못 걸린 숫자 걸러내기)
    chain=[]
    for n,s,e in items:
        if not chain or n==chain[-1][0]+1: chain.append((n,s,e))
    chain.append((99,len(common),len(common)))
    scores={}
    for (n,_,s),(_,e,_) in zip(chain, chain[1:]):
        pt=re.search(r"\[(\d)점\]", common[s:e])
        if pt: scores[n]=int(pt.group(1))
    out[key]={"common_pages":end,"n_items":len(chain)-1,"scores":scores,
              "four":[n for n,v in sorted(scores.items()) if v==4]}
json.dump(out, open("four-point-index.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
for k,v in out.items():
    miss=[n for n in range(1,23) if n not in v["scores"]]
    print(f"{k:14} 공통{v['common_pages']}쪽 문항{v['n_items']:2} 높은배점{len(v['four']):2}개 {v['four']}" + (f"  ※배점못읽음{miss}" if miss else ""))
