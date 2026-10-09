"""Convert reviewed image transcriptions, retaining image hashes and unit-level standards."""
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
OUT=ROOT/'game-hub-server/data/textbooks'

def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def run():
    path=REF/'didim-reviewed-transcription.json'
    document=read(path)
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    sources=read(REF/'didim-public-sources.json')['sources']
    catalog=read(OUT/'catalog-2022.json')
    plans=[];reviews=[]
    for book in sorted({u['book'] for u in document['units']}):
        grade,semester=map(int,book[1:])
        edition=next(e for e in catalog['editions'] if e['publisher']=='디딤돌교육' and e['subject']=='수학' and grade in e['grades'])
        lessons=[];withheld=[]
        for ui,u in enumerate(document['units']):
            if u['book']!=book:continue
            if u.get('status')=='withheld-source-conflict':
                withheld.append(dict(unit=u['unit'],sourcePage=u['page'],reason=u['issue'],periods=u['total']))
                continue
            numbering=[]
            for li,(period,topic) in enumerate(u['lessons']):
                match=re.fullmatch(r'(\d+)(?:~(\d+))?',period);assert match
                ns=list(range(int(match[1]),int(match[2] or match[1])+1));numbering.extend(ns)
                continuation=u.get('continuation',{})
                continued=li>=continuation.get('fromLessonIndex',10000)
                page=continuation['page'] if continued else u['page']
                table=continuation['table'] if continued else u['table']
                row=li-continuation['fromLessonIndex']+1 if continued else li+1
                source=next(s for s in sources if s['book']==book and s['sourcePage']==page)
                assert hashlib.sha256((REF/'raw'/source['fileName']).read_bytes()).hexdigest()==source['sha256']
                corrections=[]
                for correction in u.get('corrections',[]):
                    if correction['lessonIndex']!=li:continue
                    evidence=next(s for s in sources if s['book']==book and s['sourcePage']==correction['sourcePage'])
                    assert hashlib.sha256((REF/'raw'/evidence['fileName']).read_bytes()).hexdigest()==evidence['sha256']
                    corrections.append(dict(field='topic',original=topic,value=correction['topic'],
                        sourceFile=evidence['fileName'],sha256=evidence['sha256'],sourceUrl=evidence['sourceUrl'],
                        sourcePage=correction['sourcePage'],sourceTable=correction['sourceTable'],sourceRow=correction['sourceRow'],
                        basis='visually-reviewed-official-unit-guide'))
                    topic=correction['topic']
                lessons.append(dict(id=f'didim-{book}-p{page}-t{table}-r{row}',sourceRow=row,
                    sourcePage=page,sourceTable=table,sourcePointer=f'/units/{ui}/lessons/{li}',
                    sourceCells=[u['unit'],period+'/'+str(u['total']),u['lessons'][li][1]],sourceCorrections=corrections,
                    originalSourceFile=source['fileName'],originalSha256=source['sha256'],
                    sequence=len(lessons)+1,semester=semester,unit=u['unit'],domain=None,
                    topic=topic,periodText=period+'/'+str(u['total']),periodNumbers=ns,
                    suggestedPeriods=len(ns),periodBasis='unit',unitPeriodsText=str(u['total']),
                    pages=None,supplementaryPages=None,materials=None,activities=None,
                    standardCodes=[],unitStandardCodes=u['standardCodes'],standardMappingScope='unit'))
            assert numbering==list(range(1,u['total']+1)),(book,u['unit'])
        total=sum(l['suggestedPeriods'] for l in lessons)
        assert total+sum(w['periods'] for w in withheld)==64
        plans.append(dict(id=f'didim-{book}',editionId=edition['id'],publisher=edition['publisher'],curriculum='2022',
            subject='수학',grade=grade,semester=semester,sourceId=f'didim-{book}-guide-annual',
            sourceUrl=next(s['sourceUrl'] for s in sources if s['book']==book),
            sourceFile=path.name,sha256=digest,format='reviewed-guide-images',
            curriculumVerification='official-2022-textbook-exhibition-guide',
            coverageScope='partial-source-conflict' if withheld else 'semester-including-project',
            withheldUnits=withheld,lessons=lessons))
        reviews.append(dict(book=book,rows=len(lessons),periods=total,withheldUnits=withheld,
                            correctedTopics=sum(len(l['sourceCorrections']) for l in lessons)))
    write(OUT/'pacing-didim-2022.json',dict(schemaVersion=1,plans=plans))
    write(REF/'didim-normalization-review.json',dict(schemaVersion=1,reviews=reviews,
        rules=['Preserve unit period numbering; do not assign cumulative periods.',
               'Unit standards are stored separately; no lesson-level alignment is inferred.',
               'Source pages locate guide images, not student textbook pages.',
               '3-1 unit 1 corrections use guide page 133; 5-1 unit 5 corrections use guide page 290. Original annual-table text is preserved.']))
    subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
    print(json.dumps(dict(plans=len(plans),rows=sum(len(p['lessons']) for p in plans))))

if __name__=='__main__':run()
