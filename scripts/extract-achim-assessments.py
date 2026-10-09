"""Extract local Achimnara originals; retain source variants and review boundaries."""
import hashlib,importlib.util,json,re,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';TMP=ROOT/'tmp/textbook-research/achim-assessments'
TMP.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('hwp_text',ROOT/'scripts/extract-assessment-text.py')
helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def clean(s):return re.sub(r'\s+',' ',s.replace('\x00',' ')).strip()
def decode(name):
    try:return name.encode('cp437').decode('cp949')
    except UnicodeError:return name
def source_bytes(item):
    path=REF/'raw'/item['sourceFile']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256']
    if not item['archiveMember']:return path.read_bytes()
    with zipfile.ZipFile(path) as z:
        names={decode(n):n for n in z.namelist()}
        return z.read(names[item['archiveMember']])
def cache():
    entries=[]
    for item in read(REF/'assessment-index-achim-2022.json')['assessments']:
        if not (item['archiveMember'] or item['sourceFile']).lower().endswith('.hwp'):continue
        dest=TMP/(item['id']+'.hwp');data=source_bytes(item);dest.write_bytes(data)
        target=dest.with_suffix('.json')
        if target.exists():lines=read(target)
        else:
            lines=[clean(p) for p in helper.paragraphs(dest) if clean(p)];write(target,lines)
        entries.append({**item,'memberSha256':hashlib.sha256(data).hexdigest(),'paragraphs':lines})
    write(TMP/'extracted.json',entries)
    return entries
def variant_key(item):
    name=item['archiveMember'] or item['sourceFile']
    name=re.sub(r'\.(hwp|pdf)$','',name,flags=re.I)
    name=re.sub(r'[_ .]*(한글|pdf)$','',name,flags=re.I)
    return item['sourceId'],re.sub(r'\s+','',name)
def run():
    entries=cache();index=read(REF/'assessment-index-achim-2022.json');all_items=index['assessments'];records=[];documents=[];issues=[]
    visual={r['id']:r for r in read(REF/'assessment-achim-visual-review.json')['samples']}
    plans=read(ROOT/'game-hub-server/data/textbooks/pacing-achim-2022.json')['plans']
    for item in entries:
        lines=item['paragraphs'];kind='assessment-plan' if '계획' in (item['archiveMember'] or '') else 'worksheet' if item['title']=='수행평가 활동지' else 'assessment-rubric'
        variants=[e['id'] for e in all_items if variant_key(e)==variant_key(item)]
        documents.append(dict(id=item['id'],kind=kind,sourceVariants=variants,memberSha256=item['memberSha256'],paragraphCount=len(lines)))
        if kind!='assessment-rubric':continue
        norm=lambda t:re.sub(r'\s+','',t)
        def pos(label,start=0):return next(i for i in range(start,len(lines)) if norm(lines[i])==norm(label))
        def between(start,end,offset=0):
            i=pos(start,offset)+1;j=pos(end,i)
            return dict(text=' '.join(lines[i:j]),sourceParagraphs=list(range(i+1,j+1)))
        def single_after(label):
            i=pos(label)+1;return dict(text=lines[i],sourceParagraphs=[i+1])
        start=pos('성취 기준')
        rubric=[]
        for label,end in [('상','중'),('중','하'),('하','예시 답안' if item['subject']=='음악' else '준비물')]:
            rubric.append(dict(level=label,**between(label,end,start)))
        record={k:v for k,v in item.items() if k!='paragraphs'}
        record.update(contentStatus='structured-fields-extracted',sourceVariants=variants,rubric=rubric,
            extraction=dict(method='hwp-paragraph-labels',paragraphNumbering='one-based-nonempty-document-paragraphs',reviewStatus='structurally-validated-visual-review-pending'))
        if item['subject']=='음악':
            has_notes=any(norm(p)=='평가상의유의점' for p in lines)
            unit_idx=next(i for i,t in enumerate(lines) if re.match(r'^[1-4]\.\s*(즐거운 봄|활기찬 여름|아름다운 가을|함께하는 겨울)',t))
            record.update(title=single_after('제재명')['text'],unit=lines[unit_idx],unitSourceParagraph=unit_idx+1,
                standards=between('성취 기준','영역'),domain=between('영역','역량'),competencies=between('역량','평가 유형'),
                method=between('평가 유형','준비물'),materials=between('준비물','평가상의유의점' if has_notes else '평가 기준'),
                notes=between('평가상의유의점','평가 기준') if has_notes else None,objective=between('평가 목표','지도서'),
                textbookPages=single_after('교과서'),guidePages=single_after('지도서'))
            candidates=[l for p in plans if p['grade']==item['grade'] and p['editionId']==item['editionId'] for l in p['lessons'] if norm(l['topic'])==norm(record['title']) and norm(l['unit'])==norm(record['unit'])]
            record.update(lessonIds=[l['id'] for l in candidates],lessonMatch='exact-title-and-unit' if candidates else 'needs-review')
            if not candidates:
                title_key=lambda t:re.sub(r"[\s‘’'“”\"]",'',t)
                def page_set(t):
                    m=re.fullmatch(r'(\d+)(?:~(\d+))?(?:쪽)?',t or '')
                    return set(range(int(m[1]),int(m[2] or m[1])+1)) if m else set()
                candidates=[l for p in plans if p['grade']==item['grade'] and p['editionId']==item['editionId'] for l in p['lessons']
                    if title_key(l['topic'])==title_key(record['title']) and page_set(record['textbookPages']['text'])<=page_set(l['pages'])
                    and l['unit'].split('.')[0]==record['unit'].split('.')[0]]
                if len(candidates)==1:
                    record.update(lessonIds=[candidates[0]['id']],lessonMatch='title-unit-number-and-contained-pages',
                        lessonMatchEvidence=dict(assessmentTitle=record['title'],pacingTitle=candidates[0]['topic'],assessmentUnit=record['unit'],pacingUnit=candidates[0]['unit'],assessmentPages=record['textbookPages']['text'],pacingPages=candidates[0]['pages']))
                    if norm(candidates[0]['unit'])!=norm(record['unit']):issues.append(dict(id=item['id'],reason='source-unit-title-differs-from-pacing',evidence=record['lessonMatchEvidence']))
        else:
            record.update(standards=between('성취 기준','평가 내용'),domain=between('평가 영역','차시'),
                period=between('차시','평가 방법'),method=between('평가 방법','교수 · 학습 방법'),teachingMethod=between('교수 · 학습 방법','성취 기준'),
                objective=between('평가 내용','평가 유의점'),notes=between('평가 유의점','평가 기준'))
            record['linkedWorksheetIds']=[e['id'] for e in entries if e['subject']=='미술' and e['grade']==item['grade'] and e['unit']==item['unit'] and e['title']=='수행평가 활동지']
            candidates=[l for p in plans if p['grade']==item['grade'] and p['editionId']==item['editionId'] for l in p['lessons'] if norm(l['unit'])==norm(item['unit'])]
            record.update(lessonIds=[l['id'] for l in candidates],lessonMatch='unit-only-individual-activity-review-pending')
        codes=sorted(set(re.findall(r'\[([46](?:음|미)\d{2}-\d{2})\]',re.sub(r'\s+','',record['standards']['text']))))
        record['standardCodes']=codes
        if item['id'] in visual:
            record['extraction'].update(reviewStatus='pdf-variant-sample-visually-reviewed',visualReview=visual[item['id']])
        if not codes or any(not r['text'] for r in rubric):issues.append(dict(id=item['id'],reason='missing-standard-or-rubric'))
        assert all(c.startswith('4' if item['grade']<5 else '6') for c in codes),item['id']
        records.append(record)
    by_id={r['id']:r for r in records};doc_by_variant={vid:d for d in documents for vid in d['sourceVariants']}
    for item in all_items:
        doc=doc_by_variant[item['id']];item['canonicalDocumentId']=doc['id'];item['documentKind']=doc['kind']
        if doc['id'] in by_id:
            item.update(contentStatus='structured-fields-extracted',contentFile='assessment-content-achim-2022.json')
        else:item['contentStatus']='text-extracted-field-review-pending'
    write(REF/'assessment-content-achim-2022.json',dict(schemaVersion=1,assessments=records))
    review=dict(schemaVersion=1,originalFileEntries=len(all_items),canonicalDocuments=len(documents),structuredRubrics=len(records),
        documentKinds={k:sum(d['kind']==k for d in documents) for k in sorted(set(d['kind'] for d in documents))},
        sourceVariantMeaning='same publisher filename stem; PDF/HWP contents are not assumed identical',
        lessonMatches={k:sum(r['lessonMatch']==k for r in records) for k in sorted(set(r['lessonMatch'] for r in records))},documents=documents,issues=issues)
    write(REF/'assessment-achim-extraction-review.json',review);write(REF/'assessment-index-achim-2022.json',index)
    print(json.dumps({k:v for k,v in review.items() if k!='documents'},ensure_ascii=False))
if __name__=='__main__':run()
