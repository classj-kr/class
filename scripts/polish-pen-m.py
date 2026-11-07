"""Refine our shared jamo curves through smooth image registration of M proofs.

Only raster review images are read from reference fonts; no outline data is
transferred. A small smooth deformation is shared by each structural context.
"""
from __future__ import annotations
import argparse
from collections import defaultdict
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter, map_coordinates
from skimage.registration import optical_flow_tvl1

sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'outputs/handwriting/pen-m/revision-1200'
SOURCE=ROOT/'assets/fonts/classj-pen-m/source.js'
spec=importlib.util.spec_from_file_location('refine',ROOT/'scripts/refine-pen-m.py')
refine=importlib.util.module_from_spec(spec)
spec.loader.exec_module(refine)


def image(file,char,size=240):
    im=Image.new('L',(size+48,size+48))
    ImageDraw.Draw(im).text((24,24+size*.8),char,font=ImageFont.truetype(str(file),size),fill=255,anchor='ls')
    return np.asarray(im,dtype=np.float32)/255


def basis(points,bounds):
    left,top,right,bottom=bounds
    x=np.clip((points[:,0]-left)/max(1,right-left),0,1)
    y=np.clip((points[:,1]-top)/max(1,bottom-top),0,1)
    bx=np.c_[(1-x)**2,2*x*(1-x),x*x]
    by=np.c_[(1-y)**2,2*y*(1-y),y*y]
    return np.einsum('ni,nj->nij',by,bx).reshape(-1,9)


def run(font,amount,limit):
    refs=refine.references()
    js="const F=require(process.argv[1]);console.log(JSON.stringify(Array.from(process.argv[2],c=>({char:c,base:F.draftComponents(c),current:F.components(c),keys:F.draftComponents(c).map(p=>F.polishGroup(c,p))}))));"
    records=json.loads(subprocess.check_output(['node','-e',js,str(SOURCE),''.join(refs)],encoding='utf-8'))
    groups=defaultdict(list)
    stats=[]
    for index,record in enumerate(records):
        c=record['char']
        # Flow maps the current proof pixel positions to the reference proof.
        current=image(font,c)
        target=image(refs[c],c)
        flow=optical_flow_tvl1(gaussian_filter(current,.8),gaussian_filter(target,.8),
                             attachment=18,tightness=.3,num_warp=6,num_iter=12,prefilter=True)
        for key,base,part in zip(record['keys'],record['base'],record['current']):
            points=np.concatenate([np.asarray(p) for p in base['paths']])
            actual=np.concatenate([np.asarray(p) for p in part['paths']])
            if len(points)!=len(actual):
                raise ValueError('Deformation must retain the original stroke samples')
            bounds=[points[:,0].min(),points[:,1].min(),points[:,0].max(),points[:,1].max()]
            positions=np.stack([actual[:,1]*2.4+24,actual[:,0]*2.4+24])
            dx=map_coordinates(flow[1],positions,order=1,mode='nearest')/2.4
            dy=map_coordinates(flow[0],positions,order=1,mode='nearest')/2.4
            shift=np.clip(np.c_[dx,dy],-limit,limit)*amount
            weights=np.sqrt(np.clip(map_coordinates(gaussian_filter(current,1),positions,order=1),.2,1))
            b=basis(points,bounds)
            groups[key].append((b*weights[:,None],(actual-points+shift)*weights[:,None]))
        stats.append({'char':c,'flowMean':float(np.mean(np.hypot(flow[0],flow[1]))/2.4)})
        if (index+1)%40==0:
            print(f'Compared {index+1}/{len(records)} glyphs',flush=True)
    controls={}
    curvature=[]
    for row in range(3):
        v=np.zeros(9);v[row*3:row*3+3]=[1,-2,1];curvature.append(v)
    for col in range(3):
        v=np.zeros(9);v[col::3]=[1,-2,1];curvature.append(v)
    for key,data in groups.items():
        matrix=np.concatenate([b for b,_ in data]+[np.eye(9)*.7,np.array(curvature)*2])
        rhs=np.concatenate([d for _,d in data]+[np.zeros((9,2)),np.zeros((6,2))])
        result=np.linalg.lstsq(matrix,rhs,rcond=None)[0]
        controls[key]=np.round(np.clip(result,-limit,limit),4).tolist()
    text=SOURCE.read_text(encoding='utf-8')
    text=re.sub(r'const M_POLISH = .*?;\n','const M_POLISH = '+json.dumps(controls,ensure_ascii=False,separators=(',',':'))+';\n',text,count=1)
    SOURCE.write_text(text,encoding='utf-8')
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/'polish-report.json').write_text(json.dumps({'font':str(font),'groups':len(controls),'glyphs':stats},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Updated {len(controls)} shared smooth corrections.',flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--font',type=Path,default=ROOT/'assets/fonts/classj-pen-m/ClassJPenM-Regular.ttf')
    parser.add_argument('--amount',type=float,default=.8)
    parser.add_argument('--limit',type=float,default=6)
    args=parser.parse_args()
    run(args.font,args.amount,args.limit)
