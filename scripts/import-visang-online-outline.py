"""Normalize public ebook menus while retaining non-period reading resources separately."""
import hashlib,json,re,subprocess
from pathlib import Path
from urllib.parse import urlparse,parse_qs
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';OUT=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
catalog=read(OUT/'catalog-2022.json')['editions'];plans=[];reviews=[]
for source in sorted((REF/'visang-browser-outlines').glob('*.json')):
    s=read(source);edition=next(e for e in catalog if e['publisher']=='비상교육' and e['subject']==s['subject'] and e['leadAuthor']==s['author'] and s['grade'] in e['grades'])
    pid='visang-online-'+source.stem;lessons=[];resources=[];unit_counts=[]
    for gi,g in enumerate(s['groups']):
        numbers=[]
        for ri,row in enumerate(g['lessons']):
            pointer=f'/groups/{gi}/lessons/{ri}';m=re.fullmatch(r'(\d+)(?:~(\d+))?\s*차시',row['period'])
            if not m:
                assert row['period']=='세상 속 과학 이야기',row
                resources.append(dict(sourcePointer=pointer,sourceCells=row,unit=g['unit'],reason='reading-without-assigned-period'));continue
            ns=list(range(int(m[1]),int(m[2] or m[1])+1));numbers.extend(ns)
            page=int(parse_qs(urlparse(row['bookUrl']).query)['page'][0])
            lessons.append(dict(id=f'{pid}-g{gi+1}-r{ri+1}',sequence=len(lessons)+1,sourceRow=ri+1,
                sourcePointer=pointer,sourceCells=row,semester=s['semester'],unit=g['unit'],subunit=row['subunit'],topic=row['topic'],
                periodText=row['period'],periodNumbers=ns,periodBasis='unit',suggestedPeriods=len(ns),
                pages=str(page),pageMapping='ebook-start-page-only',supplementaryPages=None,standardCodes=[],materials=None,activities=None))
        assert numbers==list(range(1,max(numbers)+1)),(source,g['unit'],numbers)
        unit_counts.append(dict(unit=g['unit'],periods=len(numbers)))
    plans.append(dict(id=pid,editionId=edition['id'],curriculum='2022',publisher='비상교육',subject=s['subject'],grade=s['grade'],semester=s['semester'],
        sourceId=source.stem,sourceUrl=s['url'],sourceFile=source.relative_to(REF).as_posix(),sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
        exhibitionUrl='https://text.vivasam.com/detail/'+('85' if s['subject']=='사회' else '87'),format='official-ebook-outline',
        curriculumVerification='official-2022-exhibition-link',coverageScope='all-numbered-ebook-lessons',scheduleCompleteness='original-plan-comparison-pending',
        additionalResources=resources,lessons=lessons))
    reviews.append(dict(id=pid,rows=len(lessons),periods=sum(l['suggestedPeriods'] for l in lessons),unitPeriods=unit_counts,
        nonPeriodReadings=len(resources),pageMapping='start-pages-observed-no-end-page-inference',status='menu-numbering-contiguous-original-plan-comparison-pending'))
write(OUT/'pacing-visang-online-2022.json',dict(schemaVersion=1,plans=plans))
write(REF/'visang-online-normalization-review.json',dict(schemaVersion=1,reviews=reviews))
subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
print(json.dumps(reviews,ensure_ascii=False))
