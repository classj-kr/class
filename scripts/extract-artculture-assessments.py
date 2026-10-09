"""Extract only visible-page assessment cells, excluding off-page PDF content."""
import hashlib,json,re
from pathlib import Path
import pdfplumber
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';RAW=REF/'raw'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def clean(s):return re.sub(r'\s+',' ',(s or '').replace('\x07','')).strip()
def field(page,box):
    assert box
    return dict(text=clean(page.crop(box).extract_text(x_tolerance=2)),sourcePage=1,sourceRect=list(box))
def run():
    index=read(REF/'assessment-index-artculture-2022.json');records=[];review=[]
    for item in index['assessments']:
        path=RAW/item['sourceFile'];assert hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256']
        with pdfplumber.open(path) as pdf:
            assert len(pdf.pages)==1,item['id']
            # Grade 3 originals contain invisible neighbouring spreads outside MediaBox.
            page=pdf.pages[0].within_bbox(pdf.pages[0].bbox)
            tables=page.find_tables()
            top=[t for t in tables if 30<t.bbox[1]<120 and t.bbox[2]-t.bbox[0]>180]
            assert len(top)==1,item['id']
            table=top[0];rows=table.extract();stages=[]
            if item['grade']<5:
                assert rows[0][0]=='구분' and len(rows)==7,item['id']
                cols=[c for c,v in enumerate(rows[1]) if clean(v)]
                assert len(cols)==4,(item['id'],cols)
                for c in cols:
                    name=next(clean(rows[0][j]) for j in range(c,-1,-1) if clean(rows[0][j]))
                    stages.append(dict(stage=name,sourceColumn=c+1,
                        objective=field(page,table.rows[1].cells[c]),elements=field(page,table.rows[2].cells[c]),
                        method=field(page,table.rows[6].cells[c]),
                        rubric=[dict(level=level,**field(page,table.rows[r].cells[c])) for r,level in [(3,'상'),(4,'중'),(5,'하')]]))
                # Standards printed in the lower evaluation record, independent of activity columns.
                text=page.extract_text(x_tolerance=2)
                standards=None
            else:
                assert rows[0][-1]=='평가 목표',item['id']
                rubrics=[t for t in tables if clean(t.extract()[0][0])=='성취 수준(평가 기준)']
                assert len(rubrics)==1,item['id']
                rubric=rubrics[0];rubric_box=rubric.rows[1].cells[0]
                rubric_raw=page.crop(rubric_box).extract_text(x_tolerance=2).replace('\x07','')
                levels=list(re.finditer(r'(?m)^([상중하])\s+',rubric_raw));assert [m[1] for m in levels]==['상','중','하'],item['id']
                rs=[dict(level=m[1],text=clean(rubric_raw[m.end():levels[i+1].start() if i+1<len(levels) else len(rubric_raw)]),sourcePage=1,sourceRect=list(rubric_box)) for i,m in enumerate(levels)]
                col=2
                column_box=(table.rows[0].cells[col][0],table.bbox[1],table.bbox[2],table.bbox[3])
                column_text=field(page,column_box)
                labels=['평가 목표','평가 영역','평가 요소']
                assert all(column_text['text'].count(label)==1 for label in labels),item['id']
                def after(label):
                    s=column_text['text'];i=labels.index(label);start=s.index(label)+len(label)
                    end=s.index(labels[i+1]) if i+1<len(labels) else len(s)
                    return {**column_text,'text':s[start:end].strip(),'sourceLabel':label}
                method_box=(table.bbox[2]+3,table.rows[0].bbox[3],rubric.bbox[0]-3,table.bbox[3])
                standards_box=(table.bbox[0],table.rows[0].bbox[3],table.rows[1].cells[col][0]-3,table.bbox[3])
                standards=field(page,standards_box)
                method=field(page,method_box)
                assert '평가 방법' in method['text'],item['id']
                stages=[dict(stage='단원',objective=after('평가 목표'),domain=after('평가 영역'),elements=after('평가 요소'),method=method,rubric=rs)]
                text=standards['text']
            codes=sorted(set(re.findall(r'\[\s*([46])\s*미\s*(\d{2})\s*-\s*(\d{2})\s*\]',text)))
            codes=[f'{a}미{b}-{c}' for a,b,c in codes];assert codes,item['id']
            assert all(c.startswith('4' if item['grade']<5 else '6') for c in codes),item['id']
            assert all(s['objective']['text'] and s['elements']['text'] and s['method']['text'] and all(r['text'] for r in s['rubric']) for s in stages),item['id']
            records.append({**item,'contentStatus':'structured-fields-extracted','standardCodes':codes,'standards':standards,'stages':stages,
                'extraction':dict(method='pdf-visible-page-cell-bounds',reviewStatus='structurally-validated-with-layout-samples',
                    sampleVisuallyReviewed=item['unitNumber']==1,
                    limitations='PDF source spacing is retained; links identify the unit, not a verified individual assessment-to-lesson match.')})
            review.append(dict(id=item['id'],stages=len(stages),rubricLevels=sum(len(s['rubric']) for s in stages),codes=codes))
            item['contentStatus']='structured-fields-extracted';item['contentFile']='assessment-content-artculture-2022.json'
    write(REF/'assessment-content-artculture-2022.json',dict(schemaVersion=1,assessments=records))
    write(REF/'assessment-artculture-extraction-review.json',dict(schemaVersion=1,reviews=review))
    write(REF/'assessment-index-artculture-2022.json',index)
    print(json.dumps(dict(documents=len(records),stages=sum(r['stages'] for r in review),rubricLevels=sum(r['rubricLevels'] for r in review))))
if __name__=='__main__':run()
