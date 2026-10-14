"""Normalize observed public M-Teacher outlines; restricted downloads are not used."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import urlparse,parse_qs

ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
OUT=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def run():
    catalog=read(OUT/'catalog-2022.json')
    files=[REF/'miraen-outline-sources.json',*sorted(REF.glob('miraen-*-outline.json')),*sorted((REF/'miraen-browser-outlines').glob('*.json'))]
    browser_ids={f.stem for f in (REF/'miraen-browser-outlines').glob('*.json')}
    plans=[];reviews=[]
    for source in files:
        doc=read(source);sources=doc.get('sources',[doc]);sha=hashlib.sha256(source.read_bytes()).hexdigest()
        for si,s in enumerate(sources):
            sid=parse_qs(urlparse(s['url']).query)['masterSeq'][0]
            if source.parent==REF and sid in browser_ids:continue
            grade=s['grade'];subject=s['subject'];semester=s['semester']
            edition=next(e for e in catalog['editions'] if e['publisher']=='미래엔' and e['subject']==subject and grade in e['grades'] and e['leadAuthor']==s['author'])
            lessons=[];supplementary=[];empty=[];numbering_issues=[]
            for gi,g in enumerate(s['groups']):
                if g['unit'].startswith('[보완]') or g['unit']=='부록':
                    supplementary.append(dict(unit=g['unit'],rows=len(g['lessons']),sourceGroup=gi));continue
                if not g['lessons']:
                    empty.append(g['unit']);continue
                ns=[];subunits=[name for name,n in g.get('subunitRowCounts',[]) for _ in range(n)]
                assert not subunits or len(subunits)==len(g['lessons'])
                group_lessons=[]
                for li,raw in enumerate(g['lessons']):
                    cells=raw.split('|');m=re.fullmatch(r'\[(\d+)(?:[~～-](\d+))?차시\]\s*(.+)',cells[0])
                    if m:
                        start,end=int(m[1]),int(m[2] or m[1]);numbers=list(range(start,end+1));assert numbers
                    else:
                        assert subject=='영어' and cells[0].startswith('Activity'),(sid,raw)
                        numbers=[]
                    ns.extend(numbers)
                    group_lessons.append(dict(id=f'miraen-{sid}-g{gi+1}-r{li+1}',sourceRow=sum(len(x['lessons']) for x in s['groups'][:gi])+li+1,
                        sourcePointer=f'/sources/{si}/groups/{gi}/lessons/{li}' if 'sources' in doc else f'/groups/{gi}/lessons/{li}',
                        sourceCells=[g.get('number'),g['unit'],*cells],sequence=len(lessons)+len(group_lessons)+1,semester=semester,
                        unit=(g.get('number','')+' '+g['unit']).strip(),subunit=subunits[li] if subunits else None,domain=g.get('domain'),
                        topic=m[3] if m else cells[0],periodText=cells[0].split(']')[0]+']' if m else None,periodNumbers=numbers or None,suggestedPeriods=len(numbers) or None,periodBasis='unit' if m else 'unspecified',
                        pages=cells[1] if len(cells)>1 else None,supplementaryPages=cells[2:] or None,
                        materials=None,activities=None,standardCodes=[]))
                scopes={None:ns}
                if len(ns)!=len(set(ns)) and subunits:
                    scopes={}
                    for l in group_lessons:
                        l['periodBasis']='subunit';scopes.setdefault(l['subunit'],[]).extend(l['periodNumbers'])
                for scope,numbers in scopes.items():
                    if not numbers:continue
                    if len(numbers)!=len(set(numbers)) or sorted(numbers)!=list(range(1,max(numbers)+1)):
                        numbering_issues.append(dict(unit=g['unit'],subunit=scope,periodNumbers=numbers))
                lessons.extend(group_lessons)
            plans.append(dict(id=f'miraen-{sid}',editionId=edition['id'],publisher='미래엔',curriculum='2022',
                grade=grade,semester=semester,subject=subject,sourceId=sid,sourceUrl=s['url'],sourceFile=source.relative_to(REF).as_posix(),
                sha256=sha,format='official-online-outline',curriculumVerification='official-page-2022-badge',
                coverageScope='listed-core-online-lessons-excludes-explicit-supplements',scheduleCompleteness='annual-file-comparison-pending',lessons=lessons))
            reviews.append(dict(sourceId=sid,rows=len(lessons),periods=sum(l['suggestedPeriods'] or 0 for l in lessons),
                originalDownload='teacher-certification-required',supplementaryGroups=supplementary,emptyGroups=empty,
                numberingIssues=numbering_issues,issues=['5-2 수학 2단원 원문 “곱셉” 유지; 지도서 대조 필요'] if sid=='1626' else []))
            if subject=='영어':reviews[-1]['issues'].append('온라인 목록의 차시만 보존. Activity 시수 미표기(null), 연간 지도 계획과 시수 대조 필요')
            if sid=='1615':reviews[-1]['issues'].append('미술 5학년 공개 목록은 66시수. 누락 여부는 연간 지도 계획 대조 전 미확정')
            if sid=='1419':reviews[-1]['issues'].append('사회 4-1 공개 목록은 49시수. 원본 지도 계획 대조 필요')
    assert len({p['id'] for p in plans})==len(plans)
    write(OUT/'pacing-miraen-2022.json',dict(schemaVersion=1,plans=plans))
    write(REF/'miraen-normalization-review.json',dict(schemaVersion=1,reviews=reviews))
    subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
    print(json.dumps(dict(plans=len(plans),rows=sum(len(p['lessons']) for p in plans),numberingIssues=sum(len(r['numberingIssues']) for r in reviews))))
if __name__=='__main__':run()
