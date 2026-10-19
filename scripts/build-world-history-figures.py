"""Build lossless study map images from the supplied atlas PDFs.
Only map crops are published. Original PDF files are never modified.
Text is removed for independently authored, accessible study/quiz annotations.
Native PDF shading and the atlas projection are preserved by PDF rendering.
"""
import hashlib,json,sys,re,subprocess,xml.etree.ElementTree as ET
from pathlib import Path
import pymupdf
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
CONFIG=ROOT/'scripts/world-history-figures.json'
OUT=ROOT/'learning/inquiry/globe/history/figures'
SVG='{http://www.w3.org/2000/svg}'
HREF='{http://www.w3.org/1999/xlink}href'
ET.register_namespace('','http://www.w3.org/2000/svg')
ET.register_namespace('xlink','http://www.w3.org/1999/xlink')

def path_bounds(element):
 tokens=re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?',element.get('d',''))
 points=[];i=0;x=y=0;cmd='M'
 while i<len(tokens):
  if tokens[i].isalpha():cmd=tokens[i];i+=1
  if cmd.upper()=='Z':cmd='M';continue
  count={'M':2,'L':2,'C':6,'Q':4,'H':1,'V':1}.get(cmd.upper())
  if not count or i+count>len(tokens):return None
  try:vals=list(map(float,tokens[i:i+count]))
  except ValueError:return None
  i+=count
  if cmd=='H':x=vals[0];points.append((x,y))
  elif cmd=='V':y=vals[0];points.append((x,y))
  else:
   points.extend(zip(vals[::2],vals[1::2]));x,y=vals[-2:]
 if not points:return None
 t=list(map(float,re.findall(r'[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?',element.get('transform','matrix(1,0,0,1,0,0)'))))
 if len(t)!=6:return None
 a,b,c,d,e,f=t;points=[(a*x+c*y+e,b*x+d*y+f) for x,y in points]
 return pymupdf.Rect(min(p[0] for p in points),min(p[1] for p in points),max(p[0] for p in points),max(p[1] for p in points))

def city_circle(element):
 # PDF exporters may write several cubic curves under a single C command. Limit
 # this to tiny, closed round paths, not arrows, battle stars or coastlines.
 if element.tag!=SVG+'path':return None
 r=path_bounds(element)
 # Some PDF city symbols are zero-length strokes with round line caps,
 # including concentric dark/white/dark rings for capitals.
 if r is not None and r.width<.001 and r.height<.001 and element.get('stroke-linecap')=='round' and element.get('fill')=='none':
  color=element.get('stroke','');width=float(element.get('stroke-width','0'))
  if .7<width<6 and re.fullmatch('#[0-9a-fA-F]{6}',color):
   rgb=[int(color[i:i+2],16) for i in [1,3,5]]
   if color=='#ffffff' or max(rgb)<100 and max(rgb)-min(rgb)<25:return r,color=='#ffffff'
 if r is None or not (.7<r.width<6 and .7<r.height<6 and .85<r.width/r.height<1.18):return None
 data=element.get('d','');ops=re.sub('[^A-Za-z]','',data)
 values=re.findall(r'[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?',data)
 if not re.fullmatch('MC{1,16}Z?',ops) or len(values) not in [2+6*n for n in range(4,17)]:return None
 coords=list(map(float,values))
 if abs(coords[0]-coords[-2])>.03 or abs(coords[1]-coords[-1])>.03:return None
 # Check the curve itself, so a small closed coast/island or an arrowhead
 # cannot qualify solely because its bounding box happens to be square.
 xs=coords[::2];ys=coords[1::2];cx=(min(xs)+max(xs))/2;cy=(min(ys)+max(ys))/2
 rx=(max(xs)-min(xs))/2;ry=(max(ys)-min(ys))/2
 if not rx or not ry:return None
 start=coords[:2]
 for i in range(2,len(coords),6):
  c=coords[i:i+6]
  for t in [0,.25,.5,.75,1]:
   x=(1-t)**3*start[0]+3*(1-t)**2*t*c[0]+3*(1-t)*t*t*c[2]+t**3*c[4]
   y=(1-t)**3*start[1]+3*(1-t)**2*t*c[1]+3*(1-t)*t*t*c[3]+t**3*c[5]
   radius=((x-cx)**2/rx**2+(y-cy)**2/ry**2)**.5
   if not .90<radius<1.10:return None
  start=c[-2:]
 fill=element.get('fill','#000000');stroke=element.get('stroke','')
 def dark(color):
  if not re.fullmatch('#[0-9a-fA-F]{6}',color):return False
  rgb=[int(color[i:i+2],16) for i in [1,3,5]]
  return max(rgb)<100 and max(rgb)-min(rgb)<25
 if not (dark(fill) or fill=='#ffffff' or fill=='none' and dark(stroke)):return None
 return r,fill=='#ffffff'

def cleaned_svg(page,clip,spec):
 root=ET.fromstring(page.get_svg_image());bad=set()
 circles={el:city_circle(el) for el in root.iter(SVG+'path')}
 centers=[((r.x0+r.x1)/2,(r.y0+r.y1)/2) for value in circles.values() if value for r,white in [value] if not white]
 removed_city_paths=0
 # Keep the original colored shading/masks and large relief image. Remove
 # photographs and their shadow groups, which are outside the map content.
 callouts=set()
 for el in root.iter(SVG+'path'):
  r=path_bounds(el);ops=re.sub('[^A-Za-z]','',el.get('d',''))
  if r and el.get('fill')=='#ffffff' and 50<r.get_area()<25000 and r.width<220 and r.height<160 and len(ops)<16 and ops.count('C')<3:callouts.add((el.get('d'),el.get('transform')))
 for parent in list(root.iter()):
  for el in list(parent):
   if el.tag==SVG+'g' and 'mask' in el.attrib:
    paths=list(el.iter(SVG+'path'));images=list(el.iter(SVG+'image'))
    if paths and not images and all(p.get('fill','#000000') in ['#000000','#ffffff'] and 'fill-opacity' in p.attrib for p in paths):parent.remove(el);continue
   if el.tag==SVG+'image' and el.get('id'):
    matches=[x for x in page.get_images() if x[2]==int(el.get('width')) and x[3]==int(el.get('height'))]
    keep=any((r&clip).get_area()>clip.get_area()*.7 for x in matches for r in page.get_image_rects(x[0]))
    if [int(el.get('width')),int(el.get('height'))] in spec.get('omitImageSizes',[]):keep=False
    if not keep:bad.add(el.get('id'));parent.remove(el)
 for parent in list(root.iter()):
  if parent.tag in [SVG+'clipPath',SVG+'mask']:continue
  for el in list(parent):
   if el.tag==SVG+'use' and el.get(HREF,'')[1:] in bad:parent.remove(el);continue
   if el.tag!=SVG+'path':continue
   r=path_bounds(el)
   if r is None or not pymupdf.Rect(r.x0-.01,r.y0-.01,r.x1+.01,r.y1+.01).intersects(clip):continue
   circle=circles.get(el)
   if circle:
    box,white=circle;cx=(box.x0+box.x1)/2;cy=(box.y0+box.y1)/2
    if not white or any(abs(cx-x)<.05 and abs(cy-y)<.05 for x,y in centers):
     parent.remove(el);removed_city_paths+=1;continue
   ops=re.sub('[^A-Za-z]','',el.get('d',''));area=r.get_area();fill=el.get('fill','#000000');stroke=el.get('stroke','')
   rectangle=bool(re.fullmatch(r'M[HV]{3,4}Z?',ops)) and 4<area<11000 and r.width<185 and r.height<100
   rounded=ops.count('C')==4 and len(ops)<12 and r.width<150 and r.height<35 and r.width>r.height*1.5
   leader=fill=='none' and stroke in ['#727171','#898989','#595757','#231815','#9fa0a0','#000000','#2c292a'] and re.fullmatch(r'M[LHV]{1,2}',ops) and not el.get('stroke-dasharray') and r.width<100 and r.height<100 and len(el.get('d',''))<100
   balloon=fill=='none' and stroke in ['#000000','#231815','#595757'] and 'Z' in ops and 5<len(ops)<14 and 'C' not in ops and 20<r.width<130 and r.height<100 and len(el.get('d',''))<180
   heading=float(el.get('stroke-width','0'))>=2.4 and stroke=='#4478bd'
   manual=any(pymupdf.Rect(v).contains(r) for v in spec.get('removeGraphics',[]))
   # Exact decorative-path matches avoid deleting nearby coastline geometry.
   manual=manual or any(all(abs(a-b)<.05 for a,b in zip(r,v)) for v in spec.get('removeGraphicBounds',[]))
   manual=manual or fill in spec.get('removeColors',[]) or stroke in spec.get('removeColors',[])
   manual=manual or (spec.get('removeWhiteLetterPaths') and fill=='#ffffff' and r.width<50 and r.height<20)
   callout=(el.get('d'),el.get('transform')) in callouts
   if rectangle or rounded or leader or balloon or heading or manual or callout:parent.remove(el)
 scale=min(6,2400/clip.width)
 root.set('viewBox',f'{clip.x0} {clip.y0} {clip.width} {clip.height}');root.set('width',str(round(clip.width*scale)));root.set('height',str(round(clip.height*scale)))
 return ET.tostring(root),removed_city_paths
def build():
 config=json.loads(CONFIG.read_text(encoding='utf-8'));OUT.mkdir(parents=True,exist_ok=True)
 report=[];metadata=[]
 selected=set(sys.argv[1:])
 old_report={r['id']:r for r in json.loads((ROOT/'docs/world-history-map-sources.json').read_text(encoding='utf-8'))} if (ROOT/'docs/world-history-map-sources.json').exists() else {}
 old_meta={r['id']:r for r in json.loads((ROOT/'.tmp/world-history/figure-labels.json').read_text(encoding='utf-8'))} if (ROOT/'.tmp/world-history/figure-labels.json').exists() else {}
 for spec in config:
  if selected and spec['id'] not in selected and spec['id'] in old_report and spec['id'] in old_meta:
   report.append(old_report[spec['id']]);metadata.append(old_meta[spec['id']]);continue
  path=ROOT/spec['source'];source=pymupdf.open(path);original=source[spec['page']-1];clip=pymupdf.Rect(spec['crop'])
  labels=[]
  for block in original.get_text('dict')['blocks']:
   if block.get('type')!=0:continue
   for line in block['lines']:
    box=pymupdf.Rect(line['bbox'])
    if clip.contains(box):labels.append({'text':''.join(s['text'] for s in line['spans']),'rect':list(box)})
  dots=[]
  for d in original.get_drawings():
   r=d['rect'];f=d.get('fill');c=d.get('color')
   if (f and max(f)<.3 or c and max(c)<.3) and 1<r.width<6 and 1<r.height<6 and clip.contains(r):dots.append([(r.x0+r.x1)/2,(r.y0+r.y1)/2])
  doc=pymupdf.open();doc.insert_pdf(source,from_page=spec['page']-1,to_page=spec['page']-1);page=doc[0]
  for block in page.get_text('dict')['blocks']:
   if block.get('type')!=0:continue
   for line in block['lines']:
    for span in line['spans']:page.add_redact_annot(span['bbox'],fill=None,cross_out=False)
  page.apply_redactions(images=0,graphics=0,text=0)
  svg,removed_city_paths=cleaned_svg(page,clip,spec);temp=ROOT/'.tmp/world-history'/f'{spec["id"]}-clean.svg';temp.parent.mkdir(parents=True,exist_ok=True);temp.write_bytes(svg)
  dest=OUT/f'{spec["id"]}.webp'
  result=subprocess.run(['node',str(ROOT/'scripts/render-world-history-svg.cjs'),str(temp),str(dest)],capture_output=True,text=True)
  if result.returncode:raise RuntimeError(f"{spec['id']}: {result.stderr or result.stdout}")
  size=json.loads(result.stdout)
  with Image.open(dest) as image:pixels=list(image.size)
  assert pixels==[size['width'],size['height']]
  metadata.append({'id':spec['id'],'crop':spec['crop'],'size':pixels,'labels':labels,'dots':dots})
  report.append({'id':spec['id'],'source':spec['source'],'page':spec['page'],'crop':spec['crop'],'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'imageSha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'pixels':pixels,'losslessDecodedEqual':True,'removedCitySymbolPaths':removed_city_paths})
  source.close();doc.close()
  print(spec['id'],pixels,flush=True)
 (ROOT/'.tmp/world-history/figure-labels.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf-8')
 (ROOT/'docs/world-history-map-sources.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print(f'{len(report)} lossless map crops; originals preserved; pixel round trips verified')
if __name__=='__main__':build()
