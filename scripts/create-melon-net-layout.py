"""Author an irregular closed-cell rind guide in angular coordinates."""
import json
from pathlib import Path
import numpy as np
from scipy.spatial import Voronoi

rng=np.random.default_rng(3841)
seeds=[]
for row in range(11):
 for col in range(15):
  seeds.append([-2.65+col*.38+rng.uniform(-.13,.13),-1.8+row*.36+rng.uniform(-.12,.12)])
diagram=Voronoi(seeds)
edges=[]
for indices in diagram.ridge_vertices:
 if -1 in indices: continue
 a,b=diagram.vertices[indices];delta=b-a;lo,hi=0.,1.
 for axis,limit in [(0,2.15),(1,1.28)]:
  if abs(delta[axis])<1e-9:
   if abs(a[axis])>limit:hi=-1;break
  else:
   u,v=sorted(((-limit-a[axis])/delta[axis],(limit-a[axis])/delta[axis]))
   lo=max(lo,u);hi=min(hi,v)
 if hi<=lo:continue
 edges.append([[round(float(x),6) for x in a+delta*lo],[round(float(x),6) for x in a+delta*hi]])
target=Path(__file__).resolve().parents[1]/'apps/avatar-lab/melon-net-layout.json'
target.write_text(json.dumps(edges,separators=(',',':'))+'\n',encoding='utf-8')
print(len(edges),'connected irregular rind edges')
