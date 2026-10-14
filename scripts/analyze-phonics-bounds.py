"""Analyze source pixels to propose per-picture bounds; does not edit artwork."""
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects, uniform_filter1d

root = Path('learning/literacy-numeracy/phonics')
bank = json.loads(Path('outputs/phonics-full-audit/word-bank.json').read_text(encoding='utf-8'))
atlases = {}
for item in bank.values():
    pic = item['picture']
    atlases[pic['file']] = (pic['columns'], pic['rows'])

def divisions(projection, count):
    length = len(projection)
    smoothed = uniform_filter1d(projection.astype(float), size=7)
    result = [0]
    for n in range(1, count):
        expected = n * length / count
        lo = int(expected - length / count * .32)
        hi = int(expected + length / count * .32)
        cost = smoothed[lo:hi]
        # Favor the center of wide empty gutters, not their object-touching edge.
        candidates = np.flatnonzero(cost <= cost.min() + max(.5, cost.max() * .005))
        best = candidates[np.argmin(abs(candidates + lo - expected))]
        result.append(int(lo + best))
    return result + [length]

result = {}
for file, (cols, rows) in atlases.items():
    pixels = np.array(Image.open(root / file).convert('RGB')).astype(int)
    height, width = pixels.shape[:2]
    mask = (pixels.min(axis=2) < 205) | ((pixels.max(axis=2) - pixels.min(axis=2)) > 42)
    ys = divisions(mask.sum(axis=1), rows)
    boxes = []
    for row in range(rows):
        y0, y1 = ys[row:row + 2]
        xs = divisions(mask[y0:y1].sum(axis=0), cols)
        for col in range(cols):
            x0, x1 = xs[col:col + 2]
            region = mask[y0:y1, x0:x1]
            components, count = label(region)
            areas = np.bincount(components.ravel())
            areas[0] = 0
            keep = areas >= max(10, region.size * .0005)
            clean = keep[components]
            yy, xx = np.where(clean)
            if len(xx):
                margin = max(7, round(min(width/cols, height/rows) * .035))
                box = [max(x0, x0 + int(xx.min()) - margin), max(y0, y0 + int(yy.min()) - margin),
                       min(x1, x0 + int(xx.max()) + margin + 1), min(y1, y0 + int(yy.max()) + margin + 1)]
            else:
                box = [x0, y0, x1, y1]
            boxes.append(box)
    result[Path(file).name] = {'size': [width, height], 'boxes': boxes}
Path('outputs/phonics-full-audit/proposed-bounds.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(f'Analyzed {len(result)} atlases. Bounds require visual review.')
