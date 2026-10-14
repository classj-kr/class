"""Rebuild climate display tiles from the checked-in categorical grid.

This keeps the source classes and metadata intact when only the palette changes.
"""
import json
import re
from pathlib import Path

import numpy as np
from PIL import Image

from build_climate_tiles import MAX_ZOOM, PALETTE


def main():
    destination = Path(__file__).resolve().parents[1] / 'data'
    metadata = json.loads((destination / 'atlas-climate.json').read_text(encoding='utf-8'))
    width, height = metadata['width'], metadata['height']
    runs = metadata['runs']
    cells = np.empty(width * height, dtype=np.uint8)
    offset = 0
    matched = 0
    for match in re.finditer(r'([A-E_])([0-9a-z]+)', runs):
        key, length = match.groups()
        count = int(length, 36)
        cells[offset:offset + count] = ord(key)
        offset += count
        matched += len(match.group())
    if matched != len(runs) or offset != cells.size:
        raise ValueError('Climate grid run lengths do not match its dimensions')
    cells = cells.reshape(height, width)

    colors = np.zeros((256, 4), dtype=np.uint8)
    for key, value in PALETTE.items():
        colors[ord(key)] = [int(value[i:i + 2], 16) for i in (1, 3, 5)] + [255]
    size = 256 * 2 ** MAX_ZOOM
    latitudes = np.degrees(np.arctan(np.sinh(np.pi * (1 - 2 * (np.arange(size) + .5) / size))))
    rows = np.clip(np.floor((90 - latitudes) / metadata['step']).astype(int), 0, height - 1)
    cols = np.floor((np.arange(size) + .5) * width / size).astype(int)
    image = Image.fromarray(colors[cells[rows[:, None], cols[None, :]]])
    count = 0
    for zoom in range(MAX_ZOOM, -1, -1):
        for x in range(2 ** zoom):
            directory = destination / 'climate-tiles' / str(zoom) / str(x)
            directory.mkdir(parents=True, exist_ok=True)
            for y in range(2 ** zoom):
                image.crop((x * 256, y * 256, (x + 1) * 256, (y + 1) * 256)).save(directory / f'{y}.webp', lossless=True, exact=True)
                count += 1
        if zoom:
            image = image.resize((image.width // 2, image.height // 2), Image.Resampling.LANCZOS)
    print(f'Rebuilt {count} climate tiles from {width}x{height} source classes')


if __name__ == '__main__':
    main()
