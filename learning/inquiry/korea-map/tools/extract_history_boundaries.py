"""Digitize reference-map region outlines; do not synthesize historical borders.

python tools/extract_history_boundaries.py --pdf reference.pdf --output boundaries.json --review review-directory
The original textbook image is not shipped by this app. Its named source and
registration controls are retained separately for review and reproducibility.
"""
import argparse
from collections import deque
import json
import math
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from pypdf import PdfReader


def fill_holes(mask):
    h, w = mask.shape
    outside = np.zeros_like(mask)
    todo = deque([(0, 0)])
    outside[0, 0] = True
    while todo:
        x, y = todo.popleft()
        for xx, yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if 0 <= xx < w and 0 <= yy < h and not mask[yy,xx] and not outside[yy,xx]:
                outside[yy,xx] = True
                todo.append((xx, yy))
    return ~outside


def largest(mask):
    visited = np.zeros_like(mask)
    winner = []
    h, w = mask.shape
    for y, x in zip(*np.where(mask)):
        if visited[y,x]:
            continue
        todo, points = deque([(x,y)]), []
        visited[y,x] = True
        while todo:
            xx, yy = todo.popleft()
            points.append((xx,yy))
            for nx,ny in ((xx-1,yy),(xx+1,yy),(xx,yy-1),(xx,yy+1)):
                if 0<=nx<w and 0<=ny<h and mask[ny,nx] and not visited[ny,nx]:
                    visited[ny,nx] = True
                    todo.append((nx,ny))
        if len(points) > len(winner):
            winner = points
    result = np.zeros_like(mask)
    for x,y in winner:
        result[y,x] = True
    return result


def clean(mask, close=5):
    image = Image.fromarray((mask * 255).astype('uint8'))
    image = image.filter(ImageFilter.MaxFilter(close)).filter(ImageFilter.MinFilter(close))
    filled = fill_holes(np.array(image) > 0)
    # Remove thin arrows/river strokes attached to a country's boundary.
    opened = Image.fromarray((filled*255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    return fill_holes(largest(np.array(opened)>0))


def contour(mask):
    edges = {}
    h,w = mask.shape
    for y,x in zip(*np.where(mask)):
        x,y = int(x),int(y)
        if y==0 or not mask[y-1,x]: edges.setdefault((x,y),[]).append((x+1,y))
        if x==w-1 or not mask[y,x+1]: edges.setdefault((x+1,y),[]).append((x+1,y+1))
        if y==h-1 or not mask[y+1,x]: edges.setdefault((x+1,y+1),[]).append((x,y+1))
        if x==0 or not mask[y,x-1]: edges.setdefault((x,y+1),[]).append((x,y))
    loops = []
    while edges:
        start = next(iter(edges))
        point, ring = start, [start]
        while True:
            options = edges[point]
            next_point = options.pop()
            if not options: del edges[point]
            ring.append(next_point)
            point = next_point
            if point == start: break
        loops.append(ring)
    return max(loops,key=len)


def simplify(points, tolerance=.65):
    points = np.array(points,dtype=float)
    def rdp(p):
        if len(p)<3: return p
        a,b = p[0],p[-1]
        line = b-a
        if np.dot(line,line)==0: distances = np.linalg.norm(p-a,axis=1)
        else:
            t = np.clip(((p-a)@line)/np.dot(line,line),0,1)
            distances = np.linalg.norm(p-(a+t[:,None]*line),axis=1)
        index = int(np.argmax(distances))
        if distances[index]<=tolerance: return p[[0,-1]]
        return np.vstack((rdp(p[:index+1])[:-1],rdp(p[index:])))
    # A closed ring has coincident end points; split into two open halves first.
    mid = len(points)//2
    return np.vstack((rdp(points[:mid+1])[:-1],rdp(points[mid:])))


def registration(controls):
    pixels = np.array([c['pixel'] for c in controls],dtype=float)/100
    geography = np.array([[math.radians(c['xy'][0]),math.log(math.tan(math.pi/4+math.radians(c['xy'][1])/2))] for c in controls])
    def kernel(a,b):
        r2 = np.sum((a[:,None,:]-b[None,:,:])**2,axis=2)
        return r2*np.log(np.maximum(r2,1e-20))
    n = len(pixels)
    basis = np.column_stack((np.ones(n),pixels))
    matrix = np.block([[kernel(pixels,pixels)+np.eye(n)*.001,basis],[basis.T,np.zeros((3,3))]])
    weights = np.linalg.solve(matrix,np.vstack((geography,np.zeros((3,2)))))
    def transform(points):
        points = np.asarray(points,dtype=float)/100
        p = np.column_stack((kernel(points,pixels),np.ones(len(points)),points))@weights
        return [[round(math.degrees(x),6),round(math.degrees(2*math.atan(math.exp(y))-math.pi/2),6)] for x,y in p]
    return transform


def masks(image, scene):
    rgb = np.array(image).astype(int)
    r,g,b = rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
    green = (g>r+7)&(g>135)&(r>65)&(b<g-25)&(b<170)
    orange = (r>215)&(g>135)&(g<199)&(b<135)
    if scene=='baekje-fourth':
        orange[:295,:] = False  # Exclude matching-colour campaign arrows north of Gaya.
        return [('고구려',0,(r>210)&(g>130)&(g<209)&(b>160)&(b<230)&(r>g+22)),
                ('백제',1,(r<180)&(g>170)&(b>215)&(b>g+12)),
                ('신라',2,green),('가야',3,orange)]
    if scene=='goguryeo-fifth':
        orange[:400,:] = False  # Gaya's source colour also appears in northern route arrows.
        gold = (r>220)&(g>185)&(g<229)&(b>65)&(b<155)
        # A callout crosses the eastern shoreline. Bridge the land-side part;
        # the final overlay is clipped against independent geographic coastline.
        gold[151:205,255:365] = True
        gold[210:246,240:340] = True
        return [('고구려',0,gold),('백제',1,(r<180)&(g>160)&(b>205)&(b>g+10)),('신라',2,green),('가야',3,orange)]
    return [('백제',1,(r>220)&(g>175)&(g<225)&(b>55)&(b<140)),('신라',2,green)]


def main(args):
    config = json.loads((Path(__file__).parent/'history-reference-control.json').read_text(encoding='utf-8'))
    pdf = PdfReader(args.pdf)
    review = Path(args.review)
    review.mkdir(parents=True,exist_ok=True)
    results = {'source':config['source'],'title':config['title'],'method':config['method'],'crossCheck':config['crossCheck'],'scenes':{}}
    colors = ['#86b7cf','#e7b579','#a4c77c','#c2add3']
    for scene in config['maps']:
        image = pdf.pages[scene['page']].images[0].image.convert('RGB').crop(scene['crop'])
        geo = registration(scene['controls'])
        preview = image.copy()
        draw = ImageDraw.Draw(preview)
        regions = []
        for name,color,mask in masks(image,scene['id']):
            if scene['id']=='silla-sixth' and name=='신라':
                # Hatching is deliberately discontinuous: trace its source outer
                # line instead of treating white gaps as missing territory.
                north = Image.new('1', image.size)
                ImageDraw.Draw(north).polygon([tuple(p) for p in scene['temporaryRing']],fill=1)
                mask |= np.array(north,dtype=bool)
            mask = clean(mask, close=11 if scene['id']=='baekje-fourth' and name=='백제' else 7)
            pixel_ring = simplify(contour(mask))
            ring = geo(pixel_ring)
            regions.append({'name':name,'color':color,'ring':ring,'sourcePixelRing':pixel_ring.tolist()})
            draw.line([tuple(p) for p in pixel_ring],fill=colors[color],width=3)
            if scene['id']=='silla-sixth' and name=='신라':
                outline = np.array(scene['temporaryRing'])
                regions.append({'name':'진흥왕 때 진출했다가 이후 상실한 북방','color':2,'pattern':'hatch','ring':geo(outline),'sourcePixelRing':outline.tolist()})
        for c in scene['controls']:
            x,y = c['pixel']
            draw.ellipse((x-3,y-3,x+3,y+3),outline='#ff0000',width=1)
        preview.save(review/(scene['id']+'-trace.jpg'),quality=90)
        results['scenes'][scene['id']] = {'referencePage':scene['page']+1,'controls':scene['controls'],'areas':regions}
        print(scene['id'],[(r['name'],len(r['ring'])) for r in regions])
    Path(args.output).write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if args.app_output:
        for scene in results['scenes'].values():
            for area in scene['areas']:
                area.pop('sourcePixelRing',None)
        Path(args.app_output).write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pdf',required=True)
    parser.add_argument('--output',required=True)
    parser.add_argument('--review',required=True)
    parser.add_argument('--app-output',help='Optional app JSON without source-pixel QA coordinates')
    main(parser.parse_args())
