"""Extract acquired HWP/HWPX document text without running document macros."""
import io
import json
import logging
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'references/textbooks/수집작업/python-packages'))
logging.getLogger('hwp5').setLevel(logging.ERROR)

def paragraphs(path):
    if path.suffix == '.hwpx':
        with zipfile.ZipFile(path) as z:
            roots = [ET.fromstring(z.read(n)) for n in sorted(z.namelist()) if re.fullmatch(r'Contents/section\d+\.xml', n)]
        return [''.join(t.text or '' for t in p.iter() if t.tag.rsplit('}', 1)[-1] == 't')
                for root in roots for p in root.iter() if p.tag.rsplit('}', 1)[-1] == 'p' and
                not any(c.tag.rsplit('}', 1)[-1] == 'tbl' for c in p.iter())]
    from hwp5.xmlmodel import Hwp5File
    output = io.BytesIO()
    document = Hwp5File(str(path))
    try:
        document.xmlevents().dump(output)
    finally:
        document.close()
    root = ET.fromstring(output.getvalue())
    return [''.join(t.text or '' for t in p.findall('./LineSeg/Text'))
            for p in root.findall('.//Paragraph')]

def run():
    output = ROOT/'references/textbooks/수집작업/assessment-text'
    output.mkdir(parents=True, exist_ok=True)
    items = json.loads((ROOT/'references/textbooks/assessment-index-musiclife-2022.json').read_text(encoding='utf-8'))['assessments']
    extracted = []
    for item in items:
        lines = [re.sub(r'\s+', ' ', p).strip() for p in paragraphs(ROOT/'references/textbooks/raw'/item['sourceFile'])]
        lines = [p for p in lines if p]
        (outputs/(item['id']+'.json')).write_text(json.dumps(lines, ensure_ascii=False, indent=2), encoding='utf-8')
        labels = ['성취기준','평가 영역','평가 유형','평가 목표','준비물','평가 기준','매우 잘함','잘함','보통']
        assert all(lines.count(label) == 1 for label in labels), item['id']
        positions = [lines.index(label) for label in labels]
        assert positions == sorted(positions)
        def field(start, end):
            i, j = lines.index(start)+1, lines.index(end)
            assert j >= i, (item['id'],start,end)
            return {'text':' '.join(lines[i:j]), 'sourceParagraphs':list(range(i+1,j+1))}
        final = next(i for i in range(lines.index('보통')+1,len(lines)) if lines[i].startswith('평가상의'))
        i = lines.index('보통')+1
        standards = field('성취기준','평가 영역')
        codes = sorted(set(re.findall(r'\[([46]음\d{2}-\d{2})\]',standards['text'])))
        assert codes, item['id']
        record = {**item, 'contentStatus':'structured-fields-extracted', 'standardCodes':codes,
                  'standards':standards, 'domain':field('평가 영역','평가 유형'),
                  'method':field('평가 유형','평가 목표'), 'objective':field('평가 목표','준비물'),
                  'materials':field('준비물','평가 기준'),
                  'rubric':[{'level':'매우 잘함',**field('매우 잘함','잘함')},
                            {'level':'잘함',**field('잘함','보통')},
                            {'level':'보통','text':' '.join(lines[i:final]),'sourceParagraphs':list(range(i+1,final+1))}],
                  'extraction':{'method':'hwp-hwpx-paragraph-labels','paragraphNumbering':'one-based-nonempty-document-paragraphs','reviewStatus':'structurally-validated'}}
        assert all(r['text'] for r in record['rubric']),item['id']
        extracted.append(record)
    target = ROOT/'references/textbooks/assessment-content-musiclife-2022.json'
    target.write_text(json.dumps({'schemaVersion':1,'assessments':extracted},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    for item in items:
        item.update(contentStatus='structured-fields-extracted',contentFile='assessment-content-musiclife-2022.json')
    (ROOT/'references/textbooks/assessment-index-musiclife-2022.json').write_text(
        json.dumps({'schemaVersion':1,'assessments':items},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'extracted':len(items),'structuredRubrics':len(extracted)}))

if __name__ == '__main__':
    run()
