"""Create a lossless, sea-only ETOPO1 overlay for the existing relief tiles.

python tools/build_bathymetry.py --etopo <ETOPO1_Ice_g_geotiff.tif>
Land remains transparent; the existing relief's coastline is retained. ETOPO1
is a 1 arc-minute regional relief model, not a navigation chart. The mask is
derived from the uniquely blue sea in build_relief.py (land is green/brown).
"""
import argparse, hashlib, json, math
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import numpy as np
import tifffile
from scipy.ndimage import map_coordinates
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
# Three display classes keep the broad shelf/deep-basin contrast legible.
# These are map display thresholds, not three named geomorphic landforms.
BREAKS = [200, 2000]
COLORS = np.array([[202,230,237], [85,154,196], [30,76,130]], dtype=np.uint8)
URL = 'https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO1/data/ice_surface/grid_registered/georeferenced_tiff/ETOPO1_Ice_g_geotiff.zip'

def sea_mask(rgb):
    # Existing WebP is lossy: allow the narrow colour spread around #9cc9ea.
    r,g,b = (rgb[:,:,i].astype(np.int16) for i in range(3))
    return (b-g > 15) & (g-r > 20) & (b > 185)

def sample(grid, lon, lat):
    return map_coordinates(grid, [(90-lat)*60, (lon+180)*60], order=1, prefilter=False, mode='nearest')

def build(path, grid):
    z,x,y = int(path.parts[-3]), int(path.parts[-2]), int(path.stem)
    rgb=np.asarray(Image.open(path).convert('RGB')); mask=sea_mask(rgb)
    rgba=np.zeros((256,256,4),dtype=np.uint8)
    if mask.any():
        xx,yy=np.meshgrid(np.arange(256)+.5,np.arange(256)+.5)
        lon=(x+xx/256)/2**z*360-180
        lat=np.degrees(np.arctan(np.sinh(np.pi*(1-2*(y+yy/256)/2**z))))
        depth=np.maximum(0,-sample(grid,lon,lat))
        rgba[:,:,:3]=COLORS[np.searchsorted(BREAKS,depth,side='right')]
        rgba[:,:,3]=mask.astype(np.uint8)*255
        rgba[~mask,:3]=0
    target=ROOT/'bathymetry'/str(z)/str(x)/f'{y}.webp'
    target.parent.mkdir(parents=True,exist_ok=True)
    Image.fromarray(rgba).save(target,'WEBP',lossless=True,method=4,exact=True)
    decoded=np.asarray(Image.open(target).convert('RGBA'))
    if not np.array_equal(decoded,rgba): raise RuntimeError(f'Pixel mismatch: {target}')
    return int(mask.sum()),target.stat().st_size

def main():
    p=argparse.ArgumentParser();p.add_argument('--etopo',type=Path,required=True);args=p.parse_args()
    grid=tifffile.imread(args.etopo).astype(np.float32)
    assert grid.shape==(10801,21601),grid.shape
    files=sorted((ROOT/'relief').glob('*/*/*.webp'))
    totals=[]
    with ThreadPoolExecutor(max_workers=4) as pool:
        for i,row in enumerate(pool.map(lambda f:build(f,grid),files),1):
            totals.append(row)
            if i%500==0:print(f'{i}/{len(files)}',flush=True)
    samples={name:round(float(sample(grid,np.array([lon]),np.array([lat]))[0])) for name,lon,lat in [
        ('황해 중앙',124.5,36),('대한 해협',129,34),('울릉 분지',131,37),('동해 북부 분지',135,41)]}
    meta={'source':'NOAA ETOPO1 Ice Surface, grid registered, 1 arc-minute','url':URL,
          'sourceSha256':hashlib.sha256(args.etopo.read_bytes()).hexdigest(),'depthBreaksMetres':BREAKS,
          'colors':['#'+''.join(f'{c:02x}' for c in rgb) for rgb in COLORS],
          'tiles':len(totals),'bytes':sum(v[1] for v in totals),'seaPixels':sum(v[0] for v in totals),
          'sampleElevationMetres':samples,'coastline':'Existing Copernicus/Mapzen relief coastline mask',
          'encoding':'lossless WebP, exact RGBA round trip verified for every tile'}
    (ROOT/'data/bathymetry.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps(meta,ensure_ascii=False),flush=True)
if __name__=='__main__':main()
