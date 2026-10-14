"""Import observed social-studies ebook lesson menus, preserving popup labels."""
import hashlib,json,re,subprocess
from pathlib import Path
from collections import defaultdict
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks';OUT=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def run():
    catalog=read(OUT/'catalog-2022.json')['editions'];plans=[];reviews=[]
    for source in sorted((REF/'ybm-browser-outlines').glob('*.json')):
        s=read(source);sha=hashlib.sha256(source.read_bytes()).hexdigest()
        e=next(e for e in catalog if e['publisher']=='와이비엠' and e['subject']=='사회' and e['leadAuthor']==s['author'] and s['grade'] in e['grades'])
        lessons=[];numbering=defaultdict(list)
        for gi,g in enumerate(s['groups']):
            for li,(period,topic) in enumerate(g['lessons']):
                m=re.fullmatch(r'(\d+)(?:[~～-](\d+))?차시',period);assert m,(source,period)
                numbers=list(range(int(m[1]),int(m[2] or m[1])+1));numbering[g['number']].extend(numbers)
                lessons.append(dict(id=f'ybm-online-{source.stem}-g{gi+1}-r{li+1}',sourceRow=len(lessons)+1,
                    sourcePointer=f'/groups/{gi}/lessons/{li}',sourceCells=[g['unit'],g['subunit'],period,topic],
                    sequence=len(lessons)+1,semester=s['semester'],unit=g['unit'],subunit=g['subunit'],topic=topic,
                    periodText=period,periodNumbers=numbers,suggestedPeriods=len(numbers),periodBasis='unit',
                    pages=None,supplementaryPages=None,standardCodes=[],materials=None,activities=None))
        for unit,ns in numbering.items():assert sorted(ns)==list(range(1,max(ns)+1)),(source,unit,ns)
        plans.append(dict(id=f'ybm-online-{source.stem}',editionId=e['id'],curriculum='2022',publisher='와이비엠',
            grade=s['grade'],semester=s['semester'],subject='사회',sourceId=source.stem,sourceUrl=s['url'],sourceViewer=s['sourceViewer'],
            sourceFile=source.relative_to(REF).as_posix(),sha256=sha,format='official-ebook-outline',curriculumVerification='official-2022-exhibition-link',
            coverageScope='all-listed-ebook-lessons',scheduleCompleteness='annual-file-comparison-pending',lessons=lessons))
        reviews.append(dict(sourceId=source.stem,rows=len(lessons),periods=sum(l['suggestedPeriods'] for l in lessons),
            pageMapping='not-listed-in-lesson-popup',sourceStatus='complete-ebook-menu-original-plan-comparison-pending'))
    write(OUT/'pacing-ybm-online-2022.json',dict(schemaVersion=1,plans=plans))
    write(REF/'ybm-online-normalization-review.json',dict(schemaVersion=1,reviews=reviews))
    subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
    print(json.dumps(reviews))
if __name__=='__main__':run()
