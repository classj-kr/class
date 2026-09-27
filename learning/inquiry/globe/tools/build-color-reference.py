from pathlib import Path
import zipfile
import numpy as np
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import math

import argparse
parser=argparse.ArgumentParser(description='Reproject Natural Earth HYP_LR_SR_W_DR into reference color tiles.')
parser.add_argument('--archive',type=Path,required=True)
parser.add_argument('--output',type=Path,required=True)
args=parser.parse_args()
ROOT=args.archive.resolve().parent
Image.MAX_IMAGE_PIXELS=None
archive=args.archive.resolve()
with zipfile.ZipFile(archive) as z:
    print(z.namelist(),flush=True)
    name=next(n for n in z.namelist() if n.lower().endswith('.tif'))
    target=ROOT/Path(name).name
    if not target.exists():
        with z.open(name) as source,target.open('wb') as dest:
            import shutil
            shutil.copyfileobj(source,dest)
source=Image.open(target).convert('RGB')
print('Source',source.size,flush=True)
size=16384; tile=512
wide=np.asarray(source.resize((size,source.height),Image.Resampling.LANCZOS))
del source
rows=wide.shape[0]
small=Image.new('RGB',(size//2,size//2))
out=args.output.resolve()
def save(args):
    img,z,x,y=args
    folder=out/str(z)/str(x); folder.mkdir(parents=True,exist_ok=True)
    img.save(folder/f'{y}.webp','WEBP',quality=82,method=4)
with ThreadPoolExecutor(max_workers=8) as pool:
    for y in range(32):
        py=np.arange(y*tile,(y+1)*tile)+.5
        lat=np.degrees(np.arctan(np.sinh(math.pi*(1-2*py/size))))
        sy=np.clip((90-lat)/180*rows-.5,0,rows-1)
        top=np.floor(sy).astype(int); bottom=np.minimum(top+1,rows-1)
        w=(sy-top).astype(np.float32)[:,None,None]
        band=Image.fromarray(np.clip(wide[top]*(1-w)+wide[bottom]*w+.5,0,255).astype(np.uint8))
        list(pool.map(save,[(band.crop((x*tile,0,(x+1)*tile,tile)),5,x,y) for x in range(32)]))
        small.paste(band.resize((size//2,tile//2),Image.Resampling.LANCZOS),(0,y*tile//2))
        print(f'zoom 5: {y+1}/32',flush=True)
    for z in range(4,-1,-1):
        n=2**z
        list(pool.map(save,[(small.crop((x*tile,y*tile,(x+1)*tile,(y+1)*tile)),z,x,y) for y in range(n) for x in range(n)]))
        print('zoom',z,'done',flush=True)
        if z: small=small.resize((small.width//2,small.height//2),Image.Resampling.LANCZOS)
