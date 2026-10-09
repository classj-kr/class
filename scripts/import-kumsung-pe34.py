"""Import grade-labelled official guide annual tables (printed pages 60–63)."""
import hashlib,json,re,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';OUT=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
source=REF/'kumsung-pe34-reviewed-transcription.json';raw=read(source);catalog=read(OUT/'catalog-2022.json')['editions']
pages={p:dict(file=f'kumsung-pe34-guide-p{p}.png',sha256=digest(REF/'raw'/f'kumsung-pe34-guide-p{p}.png'),
    url=raw['sourceUrl'].replace('index.html',f'epub/OEBPS/content/images/page{p+2:05}/backgnd.png')) for p in range(60,64)}
plans=[]
for grade in (3,4):
    edition=next(e for e in catalog if e['publisher']=='금성출판사' and e['subject']=='체육' and e['leadAuthor']=='이제행' and grade in e['grades'])
    pid=f'kumsung-pe{grade}-guide-annual';lessons=[]
    for gi,g in enumerate(raw['groups']):
        if g['grade']!=grade:continue
        spans=[]
        for li,label in enumerate(g['lessons']):
            m=re.fullmatch(r'(.+)\((\d+)(?:~(\d+))?\)',label);assert m,label
            ns=list(range(int(m[2]),int(m[3] or m[2])+1));spans.extend(ns);page=pages[g['page']]
            lessons.append(dict(id=f'{pid}-g{gi+1}-r{li+1}',sequence=len(lessons)+1,sourceRow=li+1,
                sourcePage=g['page'],sourcePointer=f'/groups/{gi}/lessons/{li}',sourceCells=[label],originalSourceFile=page['file'],
                originalSha256=page['sha256'],originalSourceUrl=page['url'],unit=g['unit'],subunit=g['subunit'],topic=m[1],
                semester=None,month=g['month'],weeks=g['weeks'],periodText=label[label.rindex('(')+1:-1],periodNumbers=ns,
                periodBasis='subunit',suggestedPeriods=len(ns),pages=None,supplementaryPages=None,standardCodes=[],materials=None,activities=None))
        assert spans==list(range(1,max(spans)+1)),g
    assert sum(l['suggestedPeriods'] for l in lessons)==102
    plans.append(dict(id=pid,editionId=edition['id'],curriculum='2022',publisher='금성출판사',subject='체육',grade=grade,semester=None,
        sourceId='kumsung-pe34-guide-annual',sourceUrl=raw['sourceUrl'],sourceFile=source.name,sha256=digest(source),
        format='official-guide-annual-table',curriculumVerification='official-2022-guide-grade-labelled-table',
        scheduleNote=raw['scheduleNote'],lessons=lessons))
write(OUT/'pacing-kumsung-guide-2022.json',dict(schemaVersion=1,plans=plans))
write(REF/'kumsung-pe34-normalization-review.json',dict(schemaVersion=1,sources=pages,
    duplicateDownloadFinding='Grade 3 and 4 HWPX downloads are identical and correspond to grade 4 themes. Both runtime plans use explicitly grade-labelled guide pages instead; guide and HWPX wording differences are preserved in originals.',
    reviews=[dict(grade=p['grade'],rows=len(p['lessons']),periods=102,semesterMapping='annual-month-order-preserved-no-inferred-semester') for p in plans]))
subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
print([(p['grade'],len(p['lessons'])) for p in plans])
