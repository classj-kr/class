"""Fit bounded cubic corrections to the existing pen paths from raster proofs.

The four shared controls per stroke preserve smoothness and stroke identity.
Reference font outlines are not read. Output remains a review candidate.
"""
from __future__ import annotations
import argparse
from collections import defaultdict
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import numpy as np
from scipy.spatial import cKDTree
from skimage.morphology import skeletonize

ROOT=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('refine',ROOT/'scripts/refine-pen-m.py')
refine=importlib.util.module_from_spec(spec);spec.loader.exec_module(refine)
sys.stdout.reconfigure(encoding='utf-8')


def run(source, output):
    refs=refine.references()
    js="const F=require(process.argv[1]);console.log(JSON.stringify(Array.from(process.argv[2],c=>({char:c,parts:F.components(c).map(p=>({...p,key:F.auditGroup(c,p),paths:p.paths.map(s=>F.sample(s,64))}))}))));"
    records=json.loads(subprocess.check_output(['node','-e',js,str(source),''.join(refs)],encoding='utf-8'))
    groups=defaultdict(list);members=defaultdict(set)
    t=np.linspace(0,1,64);basis=np.c_[(1-t)**3,3*t*(1-t)**2,3*t*t*(1-t),t**3]
    for record in records:
        char=record['char']
        if char in '를어푸늘름거':continue
        paths=[];ids=[]
        for part in record['parts']:
            for index,path in enumerate(part['paths']):
                paths.append(np.array(path));ids.append((part['key'],index,len(part['paths']),part['char'],part['kind']))
        yy,xx=np.where(skeletonize(refine.mask(refs[char],char,400)))
        target=np.c_[(xx-24)/4,(yy-24)/4]
        dist,near=cKDTree(np.concatenate(paths)).query(target)
        for pi,(path,identity) in enumerate(zip(paths,ids)):
            key,index,count,letter,kind=identity
            if not (kind=='initial' and letter in 'ㅂㅃㄸㄹㅊㅆㅍ' or kind=='final' and letter in ['ㅂ','ㄼ','ㄹ','ㅀ','ㅅ']):continue
            if np.linalg.norm(path[0]-path[-1])<.01:continue
            assigned=target[(near//64==pi)&(dist<4)]
            direction=path[4]-path[0]
            if direction[1]>2*abs(direction[0]):assigned=assigned[((assigned-path[0])@direction)>=-.1]
            if len(assigned)<8:continue
            identity=(key,index,count)
            groups[identity].append((path,assigned));members[key].add(char)
    controls={}
    for (key,index,count),examples in groups.items():
        delta=np.zeros((4,2))
        for _ in range(9):
            matrices=[np.eye(4)*2,np.diff(np.eye(4),n=2,axis=0)*2.5]
            rhs=[np.zeros((4,2)),np.zeros((2,2))]
            for original,target in examples:
                current=original+basis@delta
                distances,near=cKDTree(target).query(current)
                weights=np.sqrt(np.minimum(1,1.5/np.maximum(.1,distances)))
                matrices.append(basis*weights[:,None]);rhs.append((target[near]-original)*weights[:,None])
                distances,near=cKDTree(current).query(target)
                weights=np.sqrt(.5*np.minimum(1,2/np.maximum(.1,distances)))
                matrices.append(basis[near]*weights[:,None]);rhs.append((target-original[near])*weights[:,None])
            result=np.linalg.lstsq(np.concatenate(matrices),np.concatenate(rhs),rcond=None)[0]
            delta=.3*delta+.7*np.clip(result,-2.5,2.5)
        if key not in controls:controls[key]=[np.zeros((4,2)).tolist() for _ in range(count)]
        controls[key][index]=np.round(delta,4).tolist()
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps({'controls':controls,'members':{k:sorted(v) for k,v in members.items()},
        'referenceCount':len(refs)},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Fitted {len(controls)} jamo groups and {len(groups)} strokes.',flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--source',type=Path,default=ROOT/'assets/fonts/classj-pen-m/source.js')
    parser.add_argument('--output',type=Path,default=ROOT/'outputs/handwriting/pen-m/revision-1500/stroke-fields.json')
    args=parser.parse_args();run(args.source,args.output)
