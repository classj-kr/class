"""Encode ETOPO1's regional sea floor as lossless RGB elevation data."""
import argparse, json, hashlib
from pathlib import Path
import numpy as np
import tifffile
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--etopo', type=Path, required=True)
args = p.parse_args()
grid = tifffile.memmap(args.etopo)
assert grid.shape == (10801, 21601)
# One pixel per original one-minute grid point; north-to-south rows.
west, south, east, north = 105, 20, 150, 50
values = np.minimum(grid[(90-north)*60:(90-south)*60+1,
                         (west+180)*60:(east+180)*60+1], 0).astype(np.int32)
encoded = values + 32768
rgb = np.zeros((*values.shape, 3), dtype=np.uint8)
rgb[:, :, 0] = encoded // 256
rgb[:, :, 1] = encoded % 256
target = ROOT/'data/seafloor-elevation.webp'
Image.fromarray(rgb).save(target, 'WEBP', lossless=True, method=6)
decoded = np.asarray(Image.open(target)).astype(np.int32)
assert np.array_equal(decoded[:, :, 0]*256+decoded[:, :, 1]-32768, values)
meta = {'source': 'NOAA ETOPO1 Ice Surface, grid registered, 1 arc-minute',
        'sourceSha256': hashlib.sha256(args.etopo.read_bytes()).hexdigest(),
        'bounds': [west, south, east, north], 'shape': list(values.shape),
        'encoding': 'R*256+G-32768 metres; B=0; land clamped to sea level',
        'bytes': target.stat().st_size, 'allPixelsVerified': True}
(ROOT/'data/seafloor-elevation.json').write_text(json.dumps(meta, indent=2)+'\n', encoding='utf8')
print(json.dumps(meta))
