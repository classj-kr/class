"""Extract single-stage science rubrics with explicit original paragraph evidence."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';CACHE=ROOT/'tmp/textbook-research/tselpa-assessment-text'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def run():
    records=[];issues=[]
    for item in read(REF/'assessment-index-tselpa-2022.json')['assessments']:
        if item['subject']!='과학':continue
        path=CACHE/(item['id']+'.json')
        if not path.exists():issues.append(dict(id=item['id'],reason='text-cache-pending'));continue
        cache=read(path);assert cache['sha256']==item['sha256']
        lines=cache.get('paragraphs',[])
        # Multi-question documents need separate rubric stages, never collapse them.
        required=['차시','쪽수','영역','성취 기준','평가 기준','평가 방법 및 유의점']
        if any(lines.count(k)!=1 for k in required):
            issues.append(dict(id=item['id'],reason='multiple-or-missing-section-labels',counts={k:lines.count(k) for k in required}));continue
        def field(start,end):
            a=lines.index(start)+1;b=lines.index(end);assert a<=b,(item['id'],start,end)
            return dict(text=' '.join(lines[a:b]),sourceParagraphs=list(range(a+1,b+1)))
        a=lines.index('평가 기준')+1;b=lines.index('평가 방법 및 유의점')
        levels=[(i,t) for i,t in enumerate(lines[a:b],a) if t in ['상','중','하','A','B','C','D']]
        labels=[t for i,t in levels]
        if labels not in [['상','중','하'],['A','B','C','D']]:
            issues.append(dict(id=item['id'],reason='unrecognized-rubric-layout',labels=labels));continue
        rubric=[]
        for n,(i,label) in enumerate(levels):
            end=levels[n+1][0] if n+1<len(levels) else b
            text=' '.join(lines[i+1:end]);assert text and end>i+1,item['id']
            rubric.append(dict(level=label,text=text,sourceParagraphs=list(range(i+2,end+1))))
        start=lines.index('성취 기준')+1
        end=next((i for i in range(start,len(lines)) if lines[i] in ['예시 답안','평가 목표','평가 방법 유형','평가 대상','평가 기준'] or re.fullmatch(r'\d+',lines[i])),None)
        if end is None:issues.append(dict(id=item['id'],reason='standard-boundary-not-found'));continue
        standards=dict(text=' '.join(lines[start:end]),sourceParagraphs=list(range(start+1,end+1)))
        codes=sorted(set(re.findall(r'\[([46]과\d{2}-\d{2})\]',standards['text'])))
        if not codes:issues.append(dict(id=item['id'],reason='standard-code-not-parsed'));continue
        record={**item,'contentStatus':'structured-fields-extracted','period':field('차시','쪽수'),'textbookPages':field('쪽수','영역'),
                'domain':field('영역','성취 기준'),'standards':standards,'standardCodes':codes,'standardScope':'assessment-document',
                'rubric':rubric,'methodAndNotes':dict(text=' '.join(lines[b+1:]),sourceParagraphs=list(range(b+2,len(lines)+1))),
                'extraction':dict(method='verified-label-and-level-sequence',paragraphNumbering='one-based-nonempty-document-paragraphs',
                                  reviewStatus='structurally-validated-visual-review-pending',limitations='Worksheet images and equations are excluded; no automatic lesson-level standards assignment.')}
        records.append(record)
    write(REF/'assessment-content-tselpa-science-2022.json',dict(schemaVersion=1,assessments=records))
    write(REF/'assessment-tselpa-science-structure-review.json',dict(schemaVersion=1,structuredDocuments=len(records),rubricLevels=sum(len(r['rubric']) for r in records),issues=issues))
    print(json.dumps(dict(structuredDocuments=len(records),rubricLevels=sum(len(r['rubric']) for r in records),reviewItems=len(issues))))
if __name__=='__main__':run()
