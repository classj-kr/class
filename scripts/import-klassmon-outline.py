"""Normalize the official online outline, without guessing semester boundaries."""
import hashlib
import json
import re
import subprocess
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse, parse_qs

ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
OUT=ROOT/'game-hub-server/data/textbooks'

def read(path):return json.loads(path.read_text(encoding='utf-8'))
def write(path,data):path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def run():
    source_path=REF/'klassmon-outline-sources.json'
    document=read(source_path)
    sha=hashlib.sha256(source_path.read_bytes()).hexdigest()
    catalog=read(OUT/'catalog-2022.json')
    archived={s['sourceId']:s for s in read(REF/'klassmon-acquired-sources.json')['sources']}
    plans=[]
    reviews=[]
    for source_index,s in enumerate(document['sources']):
        args=parse_qs(urlparse(s['url']).query)
        grade=int(args['grade'][0]);subject={'SC004':'미술','SC005':'체육','SC009':'실과'}[args['subject'][0]]
        publisher='교학도서' if subject=='미술' else '교학사'
        edition=next(e for e in catalog['editions'] if e['publisher']==publisher and e['subject']==subject and grade in e['grades'] and e['leadAuthor']==s['author'])
        sid=args['textbookSeq'][0];lessons=[];numbering=defaultdict(list)
        for gi,g in enumerate(s['groups']):
            for li,(rawperiod,rawtopic) in enumerate(g['lessons']):
                period,topic=rawperiod,rawtopic
                if rawperiod=='차시':
                    match=re.fullmatch(r'(\d+(?:[~-]\d+)?차시)\s*/\s*(.+)',topic)
                    assert match,(sid,rawtopic)
                    period,topic=match.groups()
                m=re.fullmatch(r'(\d+)(?:[~-](\d+))?차시',period);assert m,(sid,period)
                first,last=int(m[1]),int(m[2] or m[1]);ns=list(range(first,last+1));assert ns
                unit,subunit=g['unit'];basis='domain' if subject=='체육' else 'unit'
                scope=subunit if subject=='미술' else unit
                numbering[scope].extend(ns)
                lessons.append(dict(id=f'klassmon-{sid}-g{gi+1}-r{li+1}',sourceRow=len(lessons)+1,
                    sourcePointer=f'/sources/{source_index}/groups/{gi}/lessons/{li}',sourceCells=[unit,subunit,rawperiod,rawtopic],
                    sequence=len(lessons)+1,semester=None,unit=subunit if subject=='미술' else unit,
                    subunit=None if subject=='미술' else subunit,domain=unit if subject=='미술' or subject=='체육' else None,
                    topic=topic,periodText=period,periodNumbers=ns,suggestedPeriods=len(ns),periodBasis=basis,
                    pages=None,supplementaryPages=None,materials=None,activities=None,standardCodes=[]))
        for unit,ns in numbering.items():
            assert len(ns)==len(set(ns)),(sid,unit,'overlapping periods')
            assert sorted(ns)==list(range(1,max(ns)+1)),(sid,unit,'period gap')
        hours=sum(l['suggestedPeriods'] for l in lessons)
        if subject=='체육':assert hours==102
        review=dict(sourceId=sid,grade=grade,subject=subject,rows=len(lessons),observedPeriods=hours,
                    sourceUrl=s['url'],semesterStatus='unassigned-online-outline-spans-whole-book',
                    annualPlanComparison='pending-download',issues=[])
        if subject=='미술' and grade==4:
            review['issues']=['원문 9단원 첫 주제 “화의 다양한 모습 알아보기”, 13단원 첫 주제 “종이로 만든 작품 감상하기” 확인 필요. 원문 유지.']
        if subject=='미술' and grade==5:
            review['issues']=['원문 13단원 첫 주제 “감사는 방법” 오자 가능성. 원문 유지.']
        reviews.append(review)
        plans.append(dict(id=f'klassmon-{sid}',editionId=edition['id'],publisher=publisher,curriculum='2022',
            grade=grade,semester=None,subject=subject,sourceId=sid,sourceUrl=s['url'],
            sourceFile=source_path.name,sha256=sha,format='official-online-outline',
            originalSourceFile=archived[sid]['sourceFile'],originalSha256=archived[sid]['sha256'],
            curriculumVerification='official-page-2022-badge',coverageScope='all-listed-online-lessons',
            scheduleCompleteness='annual-file-comparison-pending',lessons=lessons))
    write(OUT/'pacing-klassmon-2022.json',dict(schemaVersion=1,plans=plans))
    write(REF/'klassmon-normalization-review.json',dict(schemaVersion=1,reviews=reviews))
    subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
    print(json.dumps(dict(plans=len(plans),rows=sum(len(p['lessons']) for p in plans))))

if __name__=='__main__':run()
