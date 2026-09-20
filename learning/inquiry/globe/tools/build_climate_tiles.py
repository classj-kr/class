"""Build local raster tiles from Peel's native 0.1 degree categorical grid.

No interpolation of climate class numbers. Colours are assigned first; pyramid
resampling only antialiases the visible edges. Missing cells remain transparent.
"""
import hashlib
import json
from datetime import date
from pathlib import Path

import numpy as np
from PIL import Image

PALETTE = {'A': '#39b982', 'B': '#e8bb65', 'C': '#eaa5a4', 'D': '#739bd0', 'E': '#d5d0e5'}
MAX_ZOOM = 5


def base36(number):
    digits = ''
    while number:
        digits = '0123456789abcdefghijklmnopqrstuvwxyz'[number % 36] + digits
        number //= 36
    return digits or '0'


def build_climate(original, archive, destination):
    assert original.shape == (1800, 3600)
    destination = Path(destination)
    cells = np.full(original.shape, ord('_'), dtype=np.uint8)
    for low, high, key in [(1, 3, 'A'), (4, 7, 'B'), (8, 16, 'C'), (17, 28, 'D'), (29, 30, 'E')]:
        cells[(original >= low) & (original <= high)] = ord(key)
    flat = cells.ravel()
    edges = np.r_[0, np.flatnonzero(flat[1:] != flat[:-1]) + 1, flat.size]
    runs = ''.join(chr(int(flat[a])) + base36(int(b - a)) for a, b in zip(edges[:-1], edges[1:]))
    metadata = {'step': .1, 'width': 3600, 'height': 1800, 'runs': runs,
                'source': 'Peel et al. (2007), original 0.1 degree raster',
                'method': 'Native 0.1 degree cells retained; 30 classes grouped into A/B/C/D/E; no-data preserved',
                'downloaded': date.today().isoformat(), 'sourceSha256': hashlib.sha256(archive).hexdigest(),
                'tiles': {'path': 'climate-tiles/{z}/{x}/{y}.png', 'tileSize': 256, 'maxzoom': MAX_ZOOM}}
    (destination / 'atlas-climate.json').write_text(json.dumps(metadata, separators=(',', ':')), encoding='utf-8')
    colors = np.zeros((256, 4), dtype=np.uint8)
    for key, value in PALETTE.items():
        colors[ord(key)] = [int(value[i:i+2], 16) for i in (1, 3, 5)] + [255]
    size = 256 * 2 ** MAX_ZOOM
    latitudes = np.degrees(np.arctan(np.sinh(np.pi * (1 - 2 * (np.arange(size) + .5) / size))))
    rows = np.clip(np.floor((90 - latitudes) / .1).astype(int), 0, 1799)
    cols = np.floor((np.arange(size) + .5) * 3600 / size).astype(int)
    # The top zoom oversamples source cells without inventing finer class data.
    image = Image.fromarray(colors[cells[rows[:, None], cols[None, :]]])
    count = 0
    for zoom in range(MAX_ZOOM, -1, -1):
        for x in range(2 ** zoom):
            directory = destination / 'climate-tiles' / str(zoom) / str(x)
            directory.mkdir(parents=True, exist_ok=True)
            for y in range(2 ** zoom):
                image.crop((x * 256, y * 256, (x+1) * 256, (y+1) * 256)).save(directory / f'{y}.png', optimize=True)
                count += 1
        if zoom:
            image = image.resize((image.width // 2, image.height // 2), Image.Resampling.LANCZOS)
    return {'tiles': count, 'native_cells': int(cells.size)}
