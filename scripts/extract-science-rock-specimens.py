"""Keep original PDF photo geometry, colour and alpha; isolate only named photos."""
import hashlib, io, json
from pathlib import Path
import pypdfium2 as pdfium
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, NameObject
from PIL import Image

root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'tmp/science-audit-2026-10-11/manifest-all.json').read_text(encoding='utf-8'))
out=root/'learning/inquiry/science-lab/assets/rock-specimens'
out.mkdir(parents=True,exist_ok=True)
sources={'tcell':'bff24e51554bee1f','mirae':'4f9126e5e524fa88'}
specs=[('sand-a','tcell',12,'/Im2'),('sand-detail','tcell',12,'/Im3'),('mud-a','tcell',12,'/Im0'),('mud-detail','tcell',12,'/Im1'),('conglomerate-a','tcell',12,'/Im5'),('conglomerate-detail','tcell',12,'/Im6'),('mud-b','mirae',11,'/Im5'),('sand-b','mirae',11,'/Im7'),('conglomerate-b','mirae',11,'/Im6'),('fish','mirae',15,'/Im0'),('footprint','mirae',15,'/Im1'),('leaf','mirae',15,'/Im5'),('fossil-mould','tcell',17,'/Im0'),('fossil-shell','tcell',17,'/Im1'),('clay-mould','tcell',17,'/Im2'),('alginate-cast','tcell',17,'/Im3')]
records=[]
for id,key,pn,name in specs:
    source=next(r for r in manifest if r['sha256'].startswith(sources[key]))
    path=root/source['path']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==source['sha256']
    page=PdfReader(path).pages[pn-1]
    writer=PdfWriter();writer.add_page(page)
    content=ContentStream(None,writer)
    ops=[]
    for args,op in page.get_contents().operations:
        if op==b'Do' and str(args[0])!=name:continue
        if op in {b'Tj',b'TJ',b"'",b'"',b'sh',b'INLINE IMAGE'}:continue
        ops.append(([],b'n') if op in {b'S',b's',b'f',b'F',b'f*',b'B',b'B*',b'b',b'b*'} else (args,op))
    content.operations=ops;writer.pages[0][NameObject('/Contents')]=writer._add_object(content)
    data=io.BytesIO();writer.write(data)
    pdf=pdfium.PdfDocument(data.getvalue())
    im=pdf[0].render(scale=4,fill_color=(0,0,0,0)).to_pil().convert('RGBA')
    bounds=im.getchannel('A').getbbox();assert bounds
    im=im.crop(bounds);file=out/(id+'.webp');im.save(file,lossless=True,exact=True)
    decoded=Image.open(file).convert('RGBA');assert decoded.size==im.size and decoded.tobytes()==im.tobytes()
    records.append(dict(id=id,file=file.relative_to(root).as_posix(),sourceId=sources[key],sourcePath=source['path'],sourceSha256=source['sha256'],pdfPage=pn,printedPage=pn+(9 if key=='tcell' else 7),imageObject=name,renderScale=4,alphaBounds=list(bounds),width=im.width,height=im.height,lossless=True,decodedPixelsIdentical=True,sha256=hashlib.sha256(file.read_bytes()).hexdigest()))
(root/'docs/science-lab-audit-2026-10-12/course-practices/rock-image-provenance.json').write_text(json.dumps(dict(method='Named PDF photo painted with original graphics state, clip and alpha. No invented grain or fossil detail. Sediment photos are not represented as magnified rock photos.',specimens=records),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(images=len(records),losslessRoundTripVerified=True)))
