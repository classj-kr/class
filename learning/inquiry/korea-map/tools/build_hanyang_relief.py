"""Build the local Hanyang relief from public Mapzen Terrarium elevation tiles.

Outputs are lossless WebP. Original PNG responses are decoded in memory only.
Python dependencies: numpy, Pillow. Run from any working directory.
"""
import io
import hashlib
import json
import math
from pathlib import Path
from urllib.request import urlopen
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'history' / 'hanyang'
ZOOM = 13
REGION = (126.86, 37.49, 127.13, 37.67)


def tile(lon, lat):
    rad = math.radians(lat)
    return ((lon + 180) / 360 * 2**ZOOM,
            (1 - math.asinh(math.tan(rad)) / math.pi) / 2 * 2**ZOOM)


def coordinate(x, y):
    return [x / 2**ZOOM * 360 - 180,
            math.degrees(math.atan(math.sinh(math.pi * (1 - 2*y/2**ZOOM))))]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    w, s, e, n = REGION
    x0, y0 = map(math.floor, tile(w, n))
    x1, y1 = map(math.ceil, tile(e, s))
    heights = np.empty(((y1-y0)*256, (x1-x0)*256), dtype=np.float32)
    sources = []
    for x in range(x0, x1):
        for y in range(y0, y1):
            url = f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{ZOOM}/{x}/{y}.png'
            with urlopen(url, timeout=30) as response:
                rgb = np.asarray(Image.open(io.BytesIO(response.read())).convert('RGB'), dtype=np.float32)
            heights[(y-y0)*256:(y-y0+1)*256, (x-x0)*256:(x-x0+1)*256] = rgb[:,:,0]*256 + rgb[:,:,1] + rgb[:,:,2]/256 - 32768
            sources.append(url)
    # Muted hypsometric color and relief; buildings and modern roads are omitted.
    stops = [0, 40, 100, 200, 350, 600]
    colors = np.array([[240,239,217],[232,235,209],[211,223,181],[182,205,158],[155,185,137],[144,171,132]])
    color = np.stack([np.interp(heights, stops, colors[:,i]) for i in range(3)], axis=-1)
    resolution = 156543.03392 * math.cos(math.radians((s+n)/2)) / 2**ZOOM
    dy, dx = np.gradient(heights, resolution)
    norm = np.sqrt(dx*dx + dy*dy + 1)
    shade = (-dx * -.5 + dy * .5 + .7071) / norm
    color *= np.clip(1 + (shade - .7071)*.46, .72, 1.16)[...,None]
    image = Image.fromarray(np.uint8(np.clip(color, 0, 255)))
    target = OUT / 'relief.webp'
    image.save(target, lossless=True, method=6)
    # Verify dimensions, opacity and lossless decode before using the asset.
    decoded = Image.open(target).convert('RGB')
    assert decoded.size == image.size and np.array_equal(np.asarray(decoded), np.asarray(image))
    nw, se = coordinate(x0,y0), coordinate(x1,y1)
    meta = {'bounds':[nw[0],se[1],se[0],nw[1]], 'size':image.size,
            'format':'lossless WebP', 'nativeZoom':ZOOM,
            'source':'Mapzen terrain tiles / AWS Open Data', 'urls':sources}
    (OUT/'relief.json').write_text(json.dumps(meta, indent=2)+'\n', encoding='utf-8')
    data_path = ROOT / 'data' / 'history-local-maps.js'
    if data_path.exists():
        prefix, payload = data_path.read_text(encoding='utf-8').split(' = ', 1)
        data = json.loads(payload.strip().rstrip(';'))
        version = hashlib.sha256(target.read_bytes()).hexdigest()[:12]
        data['hanyang-capital']['relief'] = {
            'src': f'history/hanyang/relief.webp?v={version}', 'bounds': meta['bounds']}
        data_path.write_text(prefix + ' = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    print(json.dumps({'size':image.size,'bounds':meta['bounds'],'bytes':target.stat().st_size}))


if __name__ == '__main__':
    main()
