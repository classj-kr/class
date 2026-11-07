"""Audit local M specimens and fit small, shared corrections to our own paths.

Only raster specimens are read. The result is a regularized 3x3 displacement
field per jamo context, never reference glyph outlines or a per-glyph tracing.
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
from scipy.ndimage import gaussian_filter, map_coordinates
from skimage.registration import optical_flow_tvl1

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'outputs/handwriting/pen-m/revision-1400'
spec = importlib.util.spec_from_file_location('polish', ROOT / 'scripts/polish-pen-m.py')
polish = importlib.util.module_from_spec(spec)
spec.loader.exec_module(polish)


def fit(source, font, output, amount=.85, limit=4):
    refs = polish.refine.references()
    js = "const F=require(process.argv[1]);console.log(JSON.stringify(Array.from(process.argv[2],c=>({char:c,parts:F.components(c),keys:F.components(c).map(p=>F.auditGroup(c,p))}))));"
    records = json.loads(subprocess.check_output(['node', '-e', js, str(source), ''.join(refs)], encoding='utf-8'))
    groups, members = defaultdict(list), defaultdict(set)
    for index, record in enumerate(records):
        char = record['char']
        if char in '를어푸늘름거':
            continue
        current, target = polish.image(font, char, 240), polish.image(refs[char], char, 240)
        flow = optical_flow_tvl1(gaussian_filter(current, .8), gaussian_filter(target, .8),
            attachment=20, tightness=.3, num_warp=6, num_iter=12, prefilter=True)
        for key, part in zip(record['keys'], record['parts']):
            points = np.concatenate([np.asarray(path) for path in part['paths']])
            bounds = [*points.min(axis=0), *points.max(axis=0)]
            positions = np.stack([points[:, 1]*2.4+24, points[:, 0]*2.4+24])
            delta = np.c_[map_coordinates(flow[1], positions, order=1, mode='nearest'),
                          map_coordinates(flow[0], positions, order=1, mode='nearest')]/2.4
            delta = np.clip(delta*amount, -limit, limit)
            # Equal total influence per jamo instance; dense curves must not
            # drown out a short bar merely because they have more samples.
            weight = 1 / np.sqrt(len(points)/60)
            groups[key].append((polish.basis(points, bounds)*weight, delta*weight))
            members[key].add(char)
        if (index+1) % 20 == 0:
            print(f'Audited {index+1}/{len(records)} specimens', flush=True)
    curvature = []
    for row in range(3):
        v=np.zeros(9); v[row*3:row*3+3]=[1,-2,1]; curvature.append(v)
    for col in range(3):
        v=np.zeros(9); v[col::3]=[1,-2,1]; curvature.append(v)
    controls = {}
    for key, examples in groups.items():
        matrix = np.concatenate([b for b, _ in examples]+[np.eye(9)*1.2, np.array(curvature)*2.5])
        rhs = np.concatenate([d for _, d in examples]+[np.zeros((9,2)), np.zeros((6,2))])
        controls[key] = np.round(np.clip(np.linalg.lstsq(matrix, rhs, rcond=None)[0], -limit, limit), 4).tolist()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps({'controls':controls, 'members':{k:sorted(v) for k,v in members.items()},
        'referenceCount':len(refs),'amount':amount,'maxShift':limit}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Fitted {len(controls)} shared jamo fields.', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path, default=ROOT/'assets/fonts/classj-pen-m/source.js')
    parser.add_argument('--font', type=Path, default=OUT/'before.ttf')
    parser.add_argument('--output', type=Path, default=OUT/'audit-fields.json')
    parser.add_argument('--amount', type=float, default=.85)
    parser.add_argument('--limit', type=float, default=4)
    args = parser.parse_args()
    fit(args.source, args.font, args.output, args.amount, args.limit)
