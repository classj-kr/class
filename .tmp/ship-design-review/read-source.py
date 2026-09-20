import sys,json,re
sys.path.insert(0,'E:/webprojects/class/.tmp/ship-design-review/pydeps')
import xlrd
book=xlrd.open_workbook('C:/Users/A/Desktop/CDS95/해설지.xls',on_demand=True)
print(json.dumps([(s.name,s.nrows,s.ncols) for s in book.sheets()],ensure_ascii=False))
for s in book.sheets():
    hits=[]
    for r in range(s.nrows):
        vals=[str(v) for v in s.row_values(r)]
        if any(re.search('갤리|갈레|다우|카라벨|카락|카누|정크|범선|선박|조선소|뗏목',v) for v in vals):
            hits.append({'row':r+1,'cells':[(xlrd.formula.colname(c)+str(r+1),v[:500]) for c,v in enumerate(vals) if v]})
    if hits:print(json.dumps({'sheet':s.name,'hits':hits[:70],'totalHits':len(hits)},ensure_ascii=False))
