"""Normalize teacher-authorized NEIS originals; keep source allocation semantics."""
import hashlib
import io
import json
import re
import subprocess
import zipfile
from collections import defaultdict
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'references/textbooks'
OUT = ROOT / 'game-hub-server/data/textbooks'

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

def write(path, value):
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def clean(value):
    return re.sub(r'\s+',' ',str(value if value is not None else '')).strip()

def run():
    manifest = read(REF / 'achim-acquired-sources.json')
    catalog = read(OUT / 'catalog-2022.json')
    plans, seen, assessments = [], {}, []
    for source in manifest['sources']:
        content = (REF / 'raw' / source['fileName']).read_bytes()
        assert hashlib.sha256(content).hexdigest() == source['sha256']
        if '진도' not in source['title']:
            if '수행평가' in source['title']:
                files = source.get('members',[{'name':source['fileName'],'bytes':source['bytes']}])
                for i, member in enumerate(files,1):
                    if not member['name'].lower().endswith(('.pdf','.hwp','.hwpx')):
                        continue
                    edition = next(e for e in catalog['editions'] if e['publisher']=='아침나라'
                        and e['subject']==source['subject'] and source['grade'] in e['grades'])
                    assessments.append(dict(id=f"achim-assessment-{source['id']}-{i}",
                        editionId=edition['id'],grade=source['grade'],subject=source['subject'],
                        title=source['title'],unit=source['unit'],sourceId=source['id'],
                        sourceUrl=source['sourceUrl'],sourceFile=source['fileName'],
                        archiveMember=member['name'] if 'members' in source else None,
                        sha256=source['sha256'],contentStatus='original-acquired-not-yet-extracted'))
            continue
        member = None
        if source['fileName'].endswith('.zip'):
            with zipfile.ZipFile(io.BytesIO(content)) as archive:
                members = [n for n in archive.namelist() if n.endswith('.xlsx')]
                assert len(members)==1
                member = members[0]
                content = archive.read(member)
        workbook = openpyxl.load_workbook(io.BytesIO(content),data_only=True)
        for sheet in workbook:
            rows = list(sheet.values)
            assert rows[0][0]=='출력순' and rows[0][5]=='학습 내용'
            groups = defaultdict(list)
            for rn, row in enumerate(rows[1:],2):
                if not clean(row[5]):
                    continue
                grade, semester, subject = int(row[1]),int(row[2]),clean(row[3])
                assert semester in (1,2) and subject==source['subject']
                groups[grade,semester,subject].append((rn,row))
            for (grade,semester,subject), source_rows in groups.items():
                key = (grade,semester,subject)
                row_values = [list(r) for _,r in source_rows]
                if key in seen:
                    assert seen[key]==row_values, ('Conflicting duplicate source',key)
                    next(p for p in plans if (p['grade'],p['semester'],p['subject'])==key)['alternateSourceIds'].append(source['id'])
                    continue
                seen[key] = row_values
                edition = next(e for e in catalog['editions'] if e['publisher']=='아침나라'
                    and e['subject']==subject and grade in e['grades'])
                pid = f'achim-{subject}-{grade}-{semester}'
                plan = dict(id=pid,editionId=edition['id'],publisher='아침나라',curriculum='2022',
                    grade=grade,semester=semester,subject=subject,sourceId=source['id'],
                    sourceUrl=source['sourceUrl'],sourceFile=source['fileName'],archiveMember=member,
                    sha256=source['sha256'],sheet=sheet.title,alternateSourceIds=[],format='neis',
                    curriculumVerification='teacher-authenticated-publisher-2022-page',lessons=[])
                for rn,row in source_rows:
                    text = clean(row[8])
                    if subject=='음악':
                        assert text.isdigit()
                        numbers, hours, basis = None,int(text),'allocation'
                    else:
                        m = re.fullmatch(r'(\d+)(?:[~–-](\d+))?',text)
                        assert m,text
                        numbers = list(range(int(m[1]),int(m[2] or m[1])+1))
                        hours,basis = len(numbers),'unit'
                    plan['lessons'].append(dict(id=f'{pid}-r{rn}',sourceRow=rn,sourceCells=list(row),
                        sequence=len(plan['lessons'])+1,semester=semester,unit=clean(row[4]),domain=None,
                        topic=clean(row[5]),periodText=text,periodNumbers=numbers,suggestedPeriods=hours,
                        periodBasis=basis,unitPeriodsText=clean(row[9]),pages=clean(row[6]) or None,
                        supplementaryPages=clean(row[7]) or None,materials=clean(row[10]) or None,
                        standardCodes=[],activities=None))
                plans.append(plan)
    for subject, grades in [('음악',[3,4,5,6]),('미술',[5,6])]:
        for grade in grades:
            matched = [p for p in plans if p['subject']==subject and p['grade']==grade]
            assert len(matched)==2
            total = sum(l['suggestedPeriods'] for p in matched for l in p['lessons'])
            assert total==68,(subject,grade,total)
    write(OUT / 'pacing-achim-2022.json',dict(schemaVersion=1,publisher='아침나라',plans=plans))
    write(REF / 'assessment-index-achim-2022.json',dict(schemaVersion=1,assessments=assessments,
        note='Entries count original files including PDF/HWP alternatives; they are not a count of distinct assessment tasks.'))
    subprocess.run(['node',str(ROOT / 'scripts/build-textbook-coverage.cjs')],check=True)
    print(json.dumps(dict(plans=len(plans),lessonRows=sum(len(p['lessons']) for p in plans),assessmentFiles=len(assessments))))

if __name__=='__main__':
    run()
