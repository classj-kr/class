"""Normalize Music & Life NEIS data and preserve cross-source corrections."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
import openpyxl

ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'references/textbooks'
OUT=ROOT/'game-hub-server/data/textbooks'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def clean(v):return re.sub(r'\s+',' ',str(v if v is not None else '')).strip()

def run():
    manifest=read(REF/'musiclife-acquired-sources.json')
    catalog=read(OUT/'catalog-2022.json')
    plans=[]
    annual=next(s for s in manifest['sources'] if s['fileName'].endswith('.pdf'))
    for s in manifest['sources']:
        content=(REF/'raw'/s['fileName']).read_bytes()
        assert len(content)==int(s['size'])
        assert content.startswith((b'PK',b'%PDF',bytes.fromhex('d0cf11e0a1b11ae1')))
        s['sha256']=hashlib.sha256(content).hexdigest()
        if not s['fileName'].endswith('.xlsx'):continue
        sh=openpyxl.load_workbook(REF/'raw'/s['fileName'],data_only=True).active
        groups={1:[],2:[]}
        grade=None
        for rn,row in enumerate(list(sh.values)[1:],2):
            if not clean(row[5]):continue
            grade=int(row[1]);semester=int(row[2]);topic=clean(row[5]);period=clean(row[8]);corrections=[]
            if grade==5 and topic=='음이름과 게이름':
                topic='음이름과 계이름'
                corrections.append(dict(field='topic',original=row[5],value=topic,sourceId=annual['id'],sourcePage=1))
            if grade==6 and topic=='다 함께 연주해요 ②':
                assert period=='1~3'
                period='1~2'
                corrections.append(dict(field='periodText',original=row[8],value=period,sourceId=annual['id'],sourcePage=6,basis='visually-reviewed-official-annual-plan'))
            m=re.fullmatch(r'(\d+)~(\d+)',period);assert m
            ns=list(range(int(m[1]),int(m[2])+1))
            item=dict(id=f"musiclife-{s['id']}-r{rn}",sourceRow=rn,sourceCells=list(row),
                sequence=len(groups[semester])+1,semester=semester,unit=clean(row[4]),domain=None,topic=topic,
                periodText=period,periodNumbers=ns,suggestedPeriods=len(ns),periodBasis='topic',
                unitPeriodsText=clean(row[9]),pages=clean(row[6]) or None,supplementaryPages=clean(row[7]) or None,
                materials=clean(row[10]) or None,activities=None,standardCodes=[])
            if corrections:item['sourceCorrections']=corrections
            groups[semester].append(item)
        edition=next(e for e in catalog['editions'] if e['publisher']=='음악과생활' and e['subject']=='음악' and grade in e['grades'])
        assert sum(l['suggestedPeriods'] for ls in groups.values() for l in ls)==68
        for semester,lessons in groups.items():
            plans.append(dict(id=f'musiclife-{grade}-{semester}',editionId=edition['id'],publisher='음악과생활',
                curriculum='2022',grade=grade,semester=semester,subject='음악',sourceId=s['id'],
                sourceUrl=s['url'],sourceFile=s['fileName'],sha256=s['sha256'],sheet=sh.title,format='neis',
                curriculumVerification='official-publisher-linked-2022-drive',lessons=lessons))
    assessments=[]
    for s in manifest['sources']:
        if '평가지' not in s['title']:continue
        match=re.match(r'([56])-(\d+)-\d+ (.+)_평가지\.hwpx?$',s['title']);assert match,s['title']
        grade,unit,title=int(match[1]),int(match[2]),match[3]
        candidates=[l for p in plans if p['grade']==grade for l in p['lessons'] if l['unit'].startswith(str(unit)+'.') and l['topic']==title]
        assessments.append(dict(id='musiclife-assessment-'+s['id'],publisher='음악과생활',curriculum='2022',
            editionId=next(p['editionId'] for p in plans if p['grade']==grade),grade=grade,subject='음악',
            unit=s['parentTitle'].split('_')[0],title=title,sourceUrl=s['url'],sourceFile=s['fileName'],
            sha256=s['sha256'],lessonIds=[l['id'] for l in candidates],
            matchStatus='exact-grade-unit-title' if candidates else 'needs-content-review',
            contentStatus='original-acquired-not-yet-extracted'))
    write(REF/'musiclife-acquired-sources.json',manifest)
    write(OUT/'pacing-musiclife-2022.json',dict(schemaVersion=1,publisher='음악과생활',plans=plans))
    write(REF/'assessment-index-musiclife-2022.json',dict(schemaVersion=1,assessments=assessments))
    subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
    print(json.dumps(dict(plans=len(plans),lessonRows=sum(len(p['lessons']) for p in plans),assessments=len(assessments),matched=sum(bool(a['lessonIds']) for a in assessments))))

if __name__=='__main__':run()
