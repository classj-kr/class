"""Normalize visually reviewed guide tables exported by the official viewer."""
import hashlib,json,re,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';OUT=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
catalog=read(OUT/'catalog-2022.json')['editions'];plans=[];reviews=[]
for source in sorted(REF.glob('visang-*-guide-transcription.json')):
    raw=read(source);edition=next(e for e in catalog if e['publisher']=='비상교육' and e['subject']==raw['subject'] and e['leadAuthor']==raw['author'] and raw['grade'] in e['grades'])
    pid=source.stem.replace('-transcription','');lessons=[];files={}
    for gi,g in enumerate(raw['groups']):
        f=g['sourceFile'];files[f]=sha(REF/'raw'/f);spans=[]
        for ri,row in enumerate(g['rows']):
            period,topic,pages,workbook,materials=row;m=re.fullmatch(r'(\d+)(?:~(\d+))?',period);assert m
            ns=list(range(int(m[1]),int(m[2] or m[1])+1));spans.extend(ns)
            lessons.append(dict(id=f'{pid}-g{gi+1}-r{ri+1}',sourceRow=ri+1,sourcePage=g['page'],sourcePdfPage=g['pdfPage'],
                sourcePointer=f'/groups/{gi}/rows/{ri}',sourceCells=row,originalSourceFile=f,originalSha256=files[f],
                sequence=len(lessons)+1,semester=raw['semester'],unit=g['unit'],sourceUnit=g.get('sourceUnit',g['unit']),
                topic=topic,subunit=None,periodText=period,periodNumbers=ns,periodBasis='unit',suggestedPeriods=len(ns),
                pages=pages,supplementaryPages=workbook,materials=materials,activities=None,standardCodes=[],unitStandardCodes=g['unitStandardCodes']))
        assert spans==list(range(1,max(spans)+1)),g['unit']
    periods=sum(l['suggestedPeriods'] for l in lessons);assert periods==raw['expectedPeriods'],(source,periods)
    plans.append(dict(id=pid,editionId=edition['id'],curriculum='2022',publisher='비상교육',subject=raw['subject'],grade=raw['grade'],semester=raw['semester'],
        sourceId=pid,sourceUrl=raw['sourceUrl'],sourceFile=source.name,sha256=sha(source),exhibitionUrl=raw['exhibitionUrl'],
        format='official-guide-semester-table',curriculumVerification='official-2022-exhibition-and-guide-title',lessons=lessons))
    reviews.append(dict(id=pid,rows=len(lessons),periods=periods,originals=files,reviewStatus='all-plan-pages-visually-transcribed',
        standardMapping='unit-level-only',sourcePages=sorted(set(g['page'] for g in raw['groups']))))
write(OUT/'pacing-visang-guide-2022.json',dict(schemaVersion=1,plans=plans));write(REF/'visang-guide-normalization-review.json',dict(schemaVersion=1,reviews=reviews))
subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
print(json.dumps(reviews))
