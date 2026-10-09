"""Read downloaded HWP tables using pyhwp, preserving their explicit cell spans.

Optional extraction dependencies: pip install --target tmp/textbook-research/python-packages pyhwp
Only document data is read; embedded scripts are never executed.
"""
import hashlib
import io
import json
import re
import shutil
import subprocess
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'tmp/textbook-research/python-packages'))
from hwp5.xmlmodel import Hwp5File
OUT = ROOT/'game-hub-server/data/textbooks'
RAW = ROOT/'references/textbooks/raw'
CATALOG = json.loads((OUT/'catalog-2022.json').read_text(encoding='utf-8'))

def run(directory):
    directory = Path(directory)
    specs = [('실과',5,None,'120313'), ('실과',6,None,'120476'), ('사회',3,2,'104694'), ('사회',4,2,'103091')]
    plans, sources = [], []
    for subject, grade, semester, cid in specs:
        files = list(directory.glob(f'*동아*실과*_{grade}학년.hwp')) if subject=='실과' else list(directory.glob(f'*동아*사회과 {grade}학년 2학기*.zip'))
        assert len(files)==1, specs
        file=files[0]
        digest=hashlib.sha256(file.read_bytes()).hexdigest()
        source_key=f'donga-{cid}-{digest[:10]}'
        shutil.copy2(file,RAW/(source_key+file.suffix))
        source={'id':source_key,'sourceId':cid,'sourceUrl':'https://ele.douclass.com/curriculum','publisher':'동아출판',
                'filename':file.name,'sha256':digest,'retrievedOn':'2026-10-09','curriculumVerification':'publisher-2022-filter'}
        hwp=file
        if file.suffix=='.zip':
            with zipfile.ZipFile(file) as archive:
                member=next(n for n in archive.namelist() if n.endswith('.hwp'))
                hwp=RAW/(source_key+'.hwp');hwp.write_bytes(archive.read(member))
                source['archiveMember']=member
        xml=io.BytesIO()
        document=Hwp5File(str(hwp))
        try: document.xmlevents().dump(xml)
        finally: document.close()
        root=ET.fromstring(xml.getvalue())
        tables=[(i,t) for i,t in enumerate(root.findall('.//TableBody'),1) if int(t.get('cols'))==(7 if subject=='실과' else 6)]
        assert len(tables)==1
        table_index,table=tables[0]; grid={};anchors={}
        for cell in table.findall('./TableRow/TableCell'):
            row,col,rs,cs=[int(cell.get(k)) for k in ('row','col','rowspan','colspan')]
            text=re.sub(r'\s+',' ',' '.join(''.join(p.itertext()) for p in cell.findall('./Paragraph'))).strip()
            for r in range(row,row+rs):
                for c in range(col,col+cs):grid[r,c]=text;anchors[r,c]=(row,col,rs,cs)
        practical=subject=='실과'
        author='서우석' if practical else '박영석'
        edition=next(e for e in CATALOG['editions'] if e['publisher']=='동아출판' and e['subject']==subject and grade in e['grades'] and e['leadAuthor']==author)
        plan={'id':source_key,'editionId':edition['id'],'publisher':'동아출판','curriculum':'2022','grade':grade,'semester':semester,
              'subject':subject,'sourceId':cid,'sourceUrl':source['sourceUrl'],'sourceFile':file.name,'sha256':digest,
              'curriculumVerification':'publisher-2022-filter','format':'hwp-table','lessons':[]}
        for r in range(1,int(table.get('rows'))):
            values=[grid.get((r,c),'') for c in range(int(table.get('cols')))]
            unit,subunit,topic,period,pages=(values[0],values[1],values[2],values[5],values[3]) if practical else (values[1],values[2],values[4],values[3],values[5])
            if not topic:continue
            numbers=None; allocation=None
            if practical:
                period_anchor=anchors[r,5][0]
                if period_anchor==r:allocation=int(period)
            else:
                ns=re.fullmatch(r'(\d+)(?:\s*[-~]\s*(\d+))?',period)
                assert ns,period
                first,last=int(ns[1]),int(ns[2] or ns[1]);numbers=list(range(first,last+1));allocation=len(numbers)
            lesson={'id':f'{source_key}-r{r+1}','sourceRow':r+1,'sourceTable':table_index,'sourceCells':values,
                    'sourceCellSpans':{str(c):list(anchors[r,c]) for c in range(len(values))},
                    'sequence':len(plan['lessons'])+1,'semester':semester,'unit':unit,'subunit':subunit,'topic':topic,
                    'periodText':f'{period}차시 배정' if practical else period,'periodNumbers':numbers,'suggestedPeriods':allocation,
                    'periodBasis':'allocation' if practical else 'unit','pages':pages or None,
                    'supplementaryPages':values[4] if practical else None,'standardCodes':[],'activities':None,'materials':None}
            if practical and period_anchor!=r:
                lesson['sharedPeriodWith']=f'{source_key}-r{period_anchor+1}'
                lesson['periodText']=f'{period}차시 공동 배정'
            plan['lessons'].append(lesson)
        assert all(l['unit'] and l['topic'] for l in plan['lessons'])
        source['plans']=[plan['id']];sources.append(source);plans.append(plan)
    (OUT/'pacing-donga-hwp-2022.json').write_text(json.dumps({'schemaVersion':1,'publisher':'동아출판','plans':plans},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (ROOT/'references/textbooks/donga-hwp-sources.json').write_text(json.dumps({'sources':sources},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    subprocess.run(['node',str(ROOT/'scripts/build-textbook-coverage.cjs')],check=True)
    print(json.dumps([{'subject':p['subject'],'grade':p['grade'],'rows':len(p['lessons']),'periods':sum(l['suggestedPeriods'] or 0 for l in p['lessons'])} for p in plans],ensure_ascii=False))

if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    run(sys.argv[1])
