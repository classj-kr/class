"""Source-registered late-Ming outline; never substitute today's China polygon."""
import json
from pathlib import Path

import numpy as np
from pyproj import Transformer
from shapely import make_valid
from shapely.geometry import Polygon, Point


REFERENCE = Path(__file__).with_name('ming-1580-reference.json')


def registered_frontier():
    reference = json.loads(REFERENCE.read_text(encoding='utf-8'))
    forward = Transformer.from_crs('EPSG:4326', reference['projection'], always_xy=True)
    inverse = Transformer.from_crs(reference['projection'], 'EPSG:4326', always_xy=True)
    controls = reference['controls']
    pixels = np.array([[1, *c[:2]] for c in controls])
    projected = np.array([forward.transform(*c[2:4]) for c in controls])
    fit = np.linalg.lstsq(pixels, projected, rcond=None)[0]
    residuals = np.linalg.norm(pixels @ fit - projected, axis=1)
    points = np.array([[1, *p] for p in reference['frontierPixels']]) @ fit
    ring = [inverse.transform(x, y) for x, y in points]
    audit = dict(source=reference['source'], title=reference['title'],
                 registrationMaxKm=round(float(max(residuals))/1000, 2),
                 registrationRmsKm=round(float(np.sqrt(np.mean(residuals**2)))/1000, 2),
                 referenceFile='tools/ming-1580-reference.json')
    return make_valid(Polygon(ring)), audit


def late_ming(china_land):
    frontier, audit = registered_frontier()
    geometry = china_land.intersection(frontier)
    # The source has Hainan, but not Taiwan, Sakhalin or distant island groups.
    pieces = list(geometry.geoms) if hasattr(geometry, 'geoms') else [geometry]
    mainland = max(pieces, key=lambda p: p.area)
    hainan = [p for p in pieces if p.covers(Point(109.7, 19.2))]
    geometry = mainland.union(hainan[0]) if hainan else mainland
    return geometry, audit
