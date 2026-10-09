"""Stage downloaded publisher PDF tables with page numbers; not approved lesson data."""
import hashlib
import json
from pathlib import Path
import pdfplumber

ROOT=Path(__file__).resolve().parents[1]
manifest_path=ROOT/'references/textbooks/ybm-public-sources.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
output=ROOT/'references/textbooks/extracted/ybm'
output.mkdir(parents=True,exist_ok=True)
for source in manifest['sources']:
    file=ROOT/'references/textbooks/raw'/('ybm-'+source['contentId']+'.pdf')
    if file.read_bytes()[:5]!=b'%PDF-':
        raise ValueError(f'Not a PDF: {file}')
    with pdfplumber.open(file) as pdf:
        pages=[{'page':i+1,'text':page.extract_text() or '', 'tables':page.extract_tables()} for i,page in enumerate(pdf.pages)]
    source.update({'sourceUrl':'https://www.ybmcloud.com/prcenter/ybmtextbook/textbookId?grade='+source['page'],
        'downloadUrl':'https://www.ybmcloud.com/prcenter_contents/'+source['contentId']+'/download',
        'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'bytes':file.stat().st_size,'pageCount':len(pages),
        'status':'tables-extracted-needs-review'})
    (output/(source['contentId']+'.json')).write_text(json.dumps({'source':source,'pages':pages},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
manifest['status']='tables-extracted-needs-review'
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'files':len(manifest['sources']),'pages':sum(s['pageCount'] for s in manifest['sources'])}))
