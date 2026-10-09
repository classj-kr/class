"""Read actual HWP cell spans for Jihak science performance levels and feedback."""
import hashlib,io,json,re,sys,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REF=ROOT/'references/textbooks'
sys.path.insert(0,str(ROOT/'tmp/textbook-research/python-packages'))
from hwp5.xmlmodel import Hwp5File
CACHE=ROOT/'tmp/textbook-research/jihak-assessment-tables';CACHE.mkdir(parents=True,exist_ok=True)
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def clean(t):return re.sub(r'\s+',' ',t).strip()
def cell_text(cell):return clean(' '.join(''.join(t.text or '' for t in p.findall('./LineSeg/Text')) for p in cell.findall('./Paragraph')))
def run():
    records=[];issues=[]
    for item in read(REF/'assessment-index-jihak-2022.json')['assessments']:
        if item['subject']!='과학' or not re.match('수행 평가_',item['title']) or not item['sourceFile'].endswith('.hwp'):continue
        path=REF/'raw'/item['sourceFile'];assert hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256']
        cache=CACHE/(item['id']+'.json')
        if cache.exists() and read(cache)['sha256']==item['sha256']:tables=read(cache)['tables']
        else:
            hwp=Hwp5File(str(path));stream=io.BytesIO()
            try:hwp.xmlevents().dump(stream)
            finally:hwp.close()
            root=ET.fromstring(stream.getvalue());tables=[]
            for table in root.findall('.//TableControl'):
                body=table.find('./TableBody')
                if body is None:continue
                cells=[dict(row=int(c.get('row')),col=int(c.get('col')),rowspan=int(c.get('rowspan')),colspan=int(c.get('colspan')),text=cell_text(c)) for c in body.findall('./TableRow/TableCell')]
                tables.append(dict(tableId=table.get('table-id'),rows=int(body.get('rows')),cols=int(body.get('cols')),cells=cells))
            write(cache,dict(sha256=item['sha256'],tables=tables))
        rubric_tables=[t for t in tables if t['cols']==4 and {'구분','수행 수준','평가 후 피드백'}<={c['text'] for c in t['cells'] if c['row']==0}]
        if not rubric_tables:issues.append(dict(id=item['id'],reason='no-recognized-four-column-feedback-table'));continue
        stages=[]
        for table in rubric_tables:
            grid={}
            for cell in table['cells']:
                for row in range(cell['row'],cell['row']+cell['rowspan']):
                    for col in range(cell['col'],cell['col']+cell['colspan']):
                        assert (row,col) not in grid,(item['id'],table['tableId'],row,col)
                        grid[row,col]=cell
            for row in range(1,table['rows']):
                if not all((row,c) in grid for c in range(4)):raise ValueError((item['id'],'incomplete-grid',row))
                stage,level,criterion,feedback=[grid[row,c]['text'] for c in range(4)]
                assert stage and level in ['도달','미도달','상','중','하'] and criterion and feedback,(item['id'],row,stage,level)
                key=(table['tableId'],grid[row,0]['row'])
                if not stages or stages[-1]['sourceStageKey']!=list(key):
                    stages.append(dict(sourceStageKey=list(key),stageLabel=stage,levels=[]))
                stages[-1]['levels'].append(dict(level=level,criterion=criterion,feedback=feedback,
                    sourceCells={name:dict(tableId=table['tableId'],row=grid[row,col]['row'],col=grid[row,col]['col'],rowspan=grid[row,col]['rowspan'],colspan=grid[row,col]['colspan'])
                                 for col,name in enumerate(['stage','level','criterion','feedback'])}))
        text_path=ROOT/'tmp/textbook-research/jihak-assessment-text'/(item['id']+'.json')
        lines=read(text_path).get('paragraphs',[]) if text_path.exists() else []
        standard_entries=[dict(text=lines[i+1],sourceParagraph=i+2) for i,t in enumerate(lines[:-1]) if t=='성취기준']
        codes=sorted(set(re.findall(r'\[([46]과\d{2}-\d{2})\]',' '.join(v['text'] for v in standard_entries))))
        record={**item,'contentStatus':'structured-fields-extracted','stages':stages,'standardCodes':codes,'standardScope':'assessment-document',
                'standards':standard_entries,'extraction':dict(method='hwp-table-cell-grid-with-rowspan',cellCoordinates='zero-based-source-cell-origin',
                    reviewStatus='cell-structure-validated-visual-review-pending',limitations='Source stage symbols preserved verbatim. Repeated 미도달 rows are distinct original levels; worksheet drawings and equations are excluded.')}
        records.append(record)
    write(REF/'assessment-content-jihak-science-2022.json',dict(schemaVersion=1,assessments=records))
    counts=dict(structuredDocuments=len(records),stages=sum(len(r['stages']) for r in records),levels=sum(len(s['levels']) for r in records for s in r['stages']))
    write(REF/'assessment-jihak-science-structure-review.json',dict(schemaVersion=1,**counts,issues=issues))
    print(json.dumps(dict(**counts,reviewItems=len(issues))))
if __name__=='__main__':run()
