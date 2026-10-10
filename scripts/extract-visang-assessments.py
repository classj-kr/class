"""Index acquired public assessment assets and extract explicitly labelled criteria."""
import hashlib,importlib.util,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';TMP=ROOT/'references/textbooks/수집작업/visang-assessments';TMP.mkdir(exist_ok=True)
spec=importlib.util.spec_from_file_location('hwp_text',ROOT/'scripts/extract-assessment-text.py');helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def clean(s):return re.sub(r'\s+',' ',s).strip()
def sources():
    return read(REF/'visang-public-bank-acquired.json')['sources']+read(REF/'visang-public-archive-acquired.json')['sources']
def cache():
    entries=[]
    for source in sources():
        if source['title']!='수행 평가' and not source['title'].startswith('과정 중심 평가'):continue
        path=REF/'raw'/source['sourceFile'];assert hashlib.sha256(path.read_bytes()).hexdigest()==source['sha256']
        out=TMP/(source['id']+'.json')
        if not out.exists():write(out,[clean(p) for p in helper.paragraphs(path) if clean(p)])
        entries.append({**source,'paragraphs':read(out)})
    return entries
def run():
    entries=cache();write(TMP/'extracted.json',entries);records=[]
    catalog=read(ROOT/'game-hub-server/data/textbooks/catalog-2022.json')['editions']
    plans=[p for f in (ROOT/'game-hub-server/data/textbooks').glob('pacing-*-2022.json') for p in read(f)['plans']]
    unit_key=lambda t:re.sub(r'\s+','',re.sub(r'^(?:\d+(?:\.\s*|\s+)|[❶❷❸❹❺❻➊➋➌➍]\s*)','',t))
    for item in entries:
        p=item['paragraphs'];m=re.search(r'(수학|사회|과학)\s*([3-6])-([12])',item['course']);assert m,item['course']
        subject=m[1];grade=int(m[2]);semester=int(m[3])
        if subject=='수학':continue # HWP equation/shape objects are absent from paragraph text; retain originals for rendering.
        edition=next(e for e in catalog if e['publisher']=='비상교육' and e['subject']==subject and grade in e['grades'] and e['leadAuthor']==('강석진' if subject=='과학' else '설규주'))
        if 'unit' not in item:
            units={unit_key(l['unit']) for plan in plans if plan['editionId']==edition['id'] and plan['grade']==grade for l in plan['lessons'] if l['semester']==semester}
            item['unit']=next(t for t in p[:20] if unit_key(t) in units)
        def field(i,j):return dict(text=' '.join(p[i:j]),sourceParagraphs=list(range(i+1,j+1)))
        def between(a,b,start=0):
            i=p.index(a,start)+1;j=p.index(b,i);return field(i,j)
        standards=[i for i,t in enumerate(p) if re.search(r'\[[46][과사]\d{2}-\d{2}\]',re.sub(r'\s+','',t))]
        stages=[]
        if subject=='과학':
            element=p.index('평가 요소');stage=dict(objective=field(element-1,element),methodAndCriteria=between('| 평가 방법 및 기준 |','구분'),rubric=[])
            standards=sorted(set(standards+list(range(p.index('성취 기준')+1,element-1))))
            for label in ['상','중','하']:
                i=p.index(label);assert (p.index({'상':'중','중':'하'}[label],i) if label!='하' else len(p))==i+3
                stage['rubric'].append(dict(level=label,**field(i+1,i+2),feedback=field(i+2,i+3)))
            stages.append(stage)
        else:
            for start,t in enumerate(p):
                if t!='평가 목표':continue
                stage=dict(objective=between('평가 목표','평가 영역',start),domain=between('평가 영역','평가 시기',start),
                    timing=between('평가 시기','수업 방법',start),teachingMethod=between('수업 방법','평가 방법',start),
                    method=between('평가 방법','평가 대상',start),target=field(p.index('평가 대상',start)+1,p.index('평가 대상',start)+2),rubric=[])
                target_pos=p.index('평가 대상',start)
                if p[target_pos+2]!='준비물':stage['sourceIssues']=[dict(reason='label-after-target-differs-from-materials',sourceParagraph=target_pos+3,originalLabel=p[target_pos+2])]
                feedback_start=None
                for label in ['상','중','하']:
                    i=p.index(label,start);assert (p.index({'상':'중','중':'하'}[label],i) if label!='하' else i+2)==i+2
                    stage['rubric'].append(dict(level=label,**field(i+1,i+2)))
                    if label=='하':assert p[i+2].startswith('성취');feedback_start=i+2
                for r in stage['rubric']:
                    i=p.index(r['level'],feedback_start);r['feedback']=field(i+1,i+2)
                stages.append(stage)
        record={k:v for k,v in item.items() if k!='paragraphs'}
        codes=sorted(set(re.findall(r'\[([46][과사]\d{2}-\d{2})\]',re.sub(r'\s+','',' '.join(p[i] for i in standards)))))
        assert codes and all(r['text'] for s in stages for r in s['rubric']),item['id']
        matched=[l['id'] for plan in plans if plan['editionId']==edition['id'] and plan['grade']==grade for l in plan['lessons'] if l['semester']==semester and unit_key(l['unit'])==unit_key(item['unit'])]
        record.update(editionId=edition['id'],publisher='비상교육',curriculum='2022',subject=subject,grade=grade,semester=semester,
            documentStandardCodes=codes,standards=dict(text=' '.join(p[i] for i in standards),sourceParagraphs=[i+1 for i in standards]),
            standardMapping='document-level-not-assigned-to-individual-stages',stages=stages,lessonIds=matched,lessonMatch='unit-only-individual-activity-review-pending',
            contentStatus='structured-fields-extracted',extraction=dict(method='hwp-labelled-criteria',reviewStatus='structurally-validated-visual-review-pending',paragraphNumbering='one-based-nonempty-document-paragraphs'))
        records.append(record)
    assets=[];by_id={r['id']:r for r in records}
    for s in sources():
        if s['category']!='평가 자료':continue
        assets.append({**s,'contentStatus':'structured-fields-extracted' if s['id'] in by_id else 'original-acquired-not-yet-extracted',
            'contentFile':'assessment-content-visang-2022.json' if s['id'] in by_id else None})
        if '수학' in s['course']:assets[-1].update(contentStatus='original-acquired-equation-and-shape-extraction-pending',extractionWarning='paragraph-only extraction omits HWP equations and shapes; not suitable for task display')
    write(REF/'assessment-index-visang-2022.json',dict(schemaVersion=1,assessments=assets))
    write(REF/'assessment-content-visang-2022.json',dict(schemaVersion=1,assessments=records))
    review=dict(schemaVersion=1,indexedAssessmentAssets=len(assets),structuredDocuments=len(records),structuredStages=sum(len(r['stages']) for r in records),
        reviewStatus='structurally-validated-visual-review-pending',assetCountMeaning='some acquired assets are ZIP bundles; asset count is not unique task count',
        emptyUnitMatches=[r['id'] for r in records if not r['lessonIds']],standardMapping='document-level-only')
    write(REF/'assessment-visang-extraction-review.json',review);print(json.dumps(review,ensure_ascii=False))
if __name__=='__main__':run()
