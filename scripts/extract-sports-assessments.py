"""Extract teacher rubric fields; retain exact paragraph references and failures."""
import importlib.util,json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';RAW=REF/'raw'
spec=importlib.util.spec_from_file_location('assessment_text',ROOT/'scripts/extract-assessment-text.py')
parser=importlib.util.module_from_spec(spec);spec.loader.exec_module(parser)
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def clean(s):return re.sub(r'\s+',' ',s).strip()
def key(s):return re.sub(r'\s+','',s)
def run():
    index=json.loads((REF/'assessment-index-sports-2022.json').read_text(encoding='utf-8'));out=[];issues=[]
    reviews={r['id']:r for r in json.loads((REF/'sports-assessment-match-review.json').read_text(encoding='utf-8'))['reviews']}
    cache=ROOT/'tmp/textbook-research/assessment-text';cache.mkdir(parents=True,exist_ok=True)
    labels=['평가 과제','관련 성취 기준','평가 유형','평가 대상','준비물','평가 관점','성취 수준','잘함','보통','노력 요함','평가상의 유의점','예시 답안']
    for item in index['assessments']:
        if item['id'] in reviews:
            review=reviews[item['id']]
            item['matchStatus']=review['status'];item['lessonIds']=review['lessonIds'];item['matchEvidence']=review['evidence']
        p=RAW/item['sourceFile'];assert hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256']
        lines=[clean(s) for s in parser.paragraphs(p) if clean(s)];write(cache/(item['id']+'.json'),lines)
        normalized=[key(s) for s in lines];pos={label:normalized.index(key(label)) for label in labels if key(label) in normalized}
        missing=[l for l in labels if l not in pos]
        if missing or list(pos.values())!=sorted(pos.values()):
            issues.append(dict(id=item['id'],missingLabels=missing,positions=pos,status='layout-review-required'))
            continue
        def field(a,b):
            i,j=pos[a]+1,pos[b]
            return dict(text=' '.join(lines[i:j]),sourceParagraphs=list(range(i+1,j+1)))
        standards=field('관련 성취 기준','평가 유형');codes=sorted(set(re.findall(r'\[([46]체\d{2}-\d{2})\]',standards['text'])))
        if not codes:
            issues.append(dict(id=item['id'],status='standard-code-review-required'));continue
        rs=[dict(level=a,**field(a,b)) for a,b in [('잘함','보통'),('보통','노력 요함'),('노력 요함','평가상의 유의점')]]
        if not all(r['text'] for r in rs):
            issues.append(dict(id=item['id'],status='empty-rubric-review-required'));continue
        rec={**item,'contentStatus':'structured-fields-extracted','standardCodes':codes,'standards':standards,
            'objective':field('평가 과제','관련 성취 기준'),'method':field('평가 유형','평가 대상'),
            'target':field('평가 대상','준비물'),'materials':field('준비물','평가 관점'),
            'elements':field('평가 관점','성취 수준'),'rubric':rs,'notes':field('평가상의 유의점','예시 답안'),
            'extraction':dict(method='hwp-hwpx-paragraph-labels',paragraphNumbering='one-based-nonempty-document-paragraphs',reviewStatus='structurally-validated-visual-review-pending')}
        if any(not c.startswith('4' if item['grade']<5 else '6') for c in codes):
            rec['extraction']['reviewStatus']='source-grade-code-conflict'
            issues.append(dict(id=item['id'],status='source-grade-code-conflict',codes=codes))
        out.append(rec);item['contentStatus']=rec['contentStatus'];item['contentFile']='assessment-content-sports-2022.json'
    write(REF/'assessment-content-sports-2022.json',dict(schemaVersion=1,assessments=out))
    write(REF/'assessment-sports-extraction-review.json',dict(schemaVersion=1,structured=len(out),issues=issues))
    write(REF/'assessment-index-sports-2022.json',index)
    print(json.dumps(dict(structured=len(out),issues=issues),ensure_ascii=False))
if __name__=='__main__':run()
