"""Preserve official monthly OISST subset values and masks; no synthetic SST."""
import hashlib
import io
import json
import re
import sys
import zipfile
from datetime import datetime, timedelta
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tmp/science-ocean-deps'))
import shapefile
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union

OUT = ROOT / 'learning/inquiry/science-lab/satellite-sea-temperature'
PROOF = ROOT / 'docs/science-lab-audit-2026-10-12/course-practices/satellite-sea-temperature/source-data'
OUT.mkdir(parents=True, exist_ok=True)
PROOF.mkdir(parents=True, exist_ok=True)
BASE = 'https://psl.noaa.gov/thredds/dodsC/Datasets/noaa.oisst.v2.highres/sst.mon.mean.nc.ascii?sst'
sources = []

def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def read_subset(name, query):
    p = PROOF / name
    if not p.exists():
        p.write_bytes((ROOT / 'tmp/sst-source' / name).read_bytes())
    raw = p.read_text(encoding='utf-8')
    dimensions = tuple(map(int, re.search(r'sst.sst\[(\d+)\]\[(\d+)\]\[(\d+)\]', raw).groups()))
    rows = re.findall(r'^\[(\d+)\]\[(\d+)\], (.+)$', raw, re.M)
    assert len(rows) == dimensions[0] * dimensions[1]
    data = np.full(dimensions, np.nan, dtype=np.float32)
    for t, y, line in rows:
        values = np.array([float(n) for n in line.split(', ')], dtype=np.float32)
        assert len(values) == dimensions[2]
        data[int(t), int(y)] = values
    axes = {axis: np.array([float(n) for n in re.search(r'sst.' + axis + r'\[\d+\]\s*\n([^\n]+)', raw).group(1).split(', ')]) for axis in ['time', 'lat', 'lon']}
    dates = [(datetime(1800, 1, 1) + timedelta(days=n)).strftime('%Y-%m') for n in axes['time']]
    sources.append({'path': p.relative_to(ROOT).as_posix(), 'sha256': digest(p), 'url': BASE + query, 'shape': dimensions, 'dates': dates})
    return data, axes, dates

full, axes, dates = read_subset('sst-2023-west-pacific.ascii', '[496:1:507][200:1:559][460:1:659]')
old, old_axes, old_dates = read_subset('sst-korea-2019-2023-january-july.ascii', '[448:6:502][472:1:535][480:1:547]')
assert dates == [f'2023-{m:02}' for m in range(1, 13)]
land_source = ROOT / 'docs/science-lab-audit-2026-10-12/course-practices/argo-observation/source-data/ne_10m_land.zip'
with zipfile.ZipFile(land_source) as z:
    reader = shapefile.Reader(shp=io.BytesIO(z.read('ne_10m_land.shp')), shx=io.BytesIO(z.read('ne_10m_land.shx')), dbf=io.BytesIO(z.read('ne_10m_land.dbf')))
    land_geometries = [shape(s.__geo_interface__) for s in reader.iterShapes()]

regions = []
for rid, name, bounds, probe in [
    ('korea', '우리나라 주변', [120, 137, 28, 44], [126.375, 32.875]),
    ('solomon', '솔로몬 제도 주변', [150, 165, -15, 0], [160.375, -8.125]),
    ('sydney', '시드니 앞바다', [145, 158, -40, -25], [152.375, -33.875]),
]:
    west, east, south, north = bounds
    xi = np.where((axes['lon'] > west) & (axes['lon'] < east))[0]
    yi = np.where((axes['lat'] > south) & (axes['lat'] < north))[0]
    region_frames = {date: full[i][np.ix_(yi, xi)] for i, date in enumerate(dates)}
    if rid == 'korea':
        assert np.array_equal(old_axes['lat'], axes['lat'][yi]) and np.array_equal(old_axes['lon'], axes['lon'][xi])
        for i, date in enumerate(old_dates):
            if date in region_frames:
                assert np.array_equal(old[i], region_frames[date])
            region_frames[date] = old[i]
    frames = [{'date': date, 'values': [float(v) if np.isfinite(v) and -3 <= v <= 45 else None for v in frame.flat]} for date, frame in sorted(region_frames.items())]
    clip = box(west, south, east, north)
    coast = unary_union([g.intersection(clip) for g in land_geometries if g.intersects(clip)]).simplify(.003, preserve_topology=True)
    geo = mapping(coast)
    land = [geo['coordinates']] if geo['type'] == 'Polygon' else geo['coordinates']
    regions.append({'id': rid, 'name': name, 'bounds': bounds, 'probe': probe, 'lat': axes['lat'][yi].tolist(), 'lon': axes['lon'][xi].tolist(), 'frames': frames, 'land': land})

dest = OUT / 'data.json'
dest.write_text(json.dumps({'step': .25, 'regions': regions}, ensure_ascii=False, separators=(',', ':'), allow_nan=False) + '\n', encoding='utf-8')
proof = {'sources': sources, 'outputSha256': digest(dest), 'mapSource': {'path': land_source.relative_to(ROOT).as_posix(), 'sha256': digest(land_source), 'url': 'https://naturalearth.s3.amazonaws.com/10m_physical/ne_10m_land.zip'}, 'methodSources': ['https://www.ncei.noaa.gov/products/optimum-interpolation-sst', 'https://psl.noaa.gov/data/gridded/data.noaa.oisst.v2.highres.html'], 'method': 'NOAA monthly 0.25-degree OISST analysis: satellite and in-situ inputs blended and gaps filled by the original analysis. Preserve returned Float32 values, grid-cell centers, UTC months and original land/missing mask. No app interpolation or spatial averaging. Display values only are rounded. Natural Earth coast clipped and topology-preserving simplification 0.003 degree. Map latitude scale corrected by cosine of the region midpoint.', 'scope': '2023 monthly maps for Korea, Solomon Islands and Sydney; Korea also January/July 2019–2022 (2023 duplicates independently matched). A minus/B minus calculations use the same cell. Annual series is 2023 only. Not raw GK2A imagery, ten-day composites, current-year or live satellite retrieval.', 'downloadIssue': 'NCSS endpoint returned HTTP 500 No space left on device. OPeNDAP ASCII official subsets succeeded; no entire 2.2 GB dataset download.'}
(PROOF / 'provenance.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'bytes': dest.stat().st_size, 'regions': [{'id': r['id'], 'frames': len(r['frames']), 'cells': len(r['lat']) * len(r['lon'])} for r in regions]}))
