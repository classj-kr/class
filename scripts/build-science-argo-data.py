"""Build the fixed textbook float snapshot; never invent, smooth or fill measurements."""
import hashlib
import json
import sys
import io
import zipfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
from scipy.io import netcdf_file

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tmp/science-ocean-deps'))
import gsw
import shapefile
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union

OUT = ROOT / 'learning/inquiry/science-lab/argo-observation'
PROOF = ROOT / 'docs/science-lab-audit-2026-10-12/course-practices/argo-observation/source-data'
OUT.mkdir(parents=True, exist_ok=True)
PROOF.mkdir(parents=True, exist_ok=True)
SOURCE = PROOF / '2901806_prof.nc'
if not SOURCE.exists():
    SOURCE.write_bytes((ROOT / 'tmp/argo-source/2901806_prof.nc').read_bytes())

def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

profiles, quality = [], []
with netcdf_file(SOURCE, 'r', mmap=False) as f:
    v = f.variables
    for i, juld in enumerate(v['JULD'][:]):
        dt = datetime(1950, 1, 1, tzinfo=timezone.utc) + timedelta(days=float(juld))
        if dt.year != 2023:
            continue
        assert v['DATA_MODE'][i] == b'D'
        assert v['JULD_QC'][i] == b'1' and v['POSITION_QC'][i] == b'1'
        lat, lon = float(v['LATITUDE'][i]), float(v['LONGITUDE'][i])
        points = []
        rejected = []
        for k in range(v['PRES_ADJUSTED'].shape[1]):
            vals, flags = {}, {}
            for param, field in [('PRES', 'p'), ('TEMP', 't'), ('PSAL', 's')]:
                n = float(v[param + '_ADJUSTED'][i, k])
                flag = v[param + '_ADJUSTED_QC'][i, k].decode('ascii', errors='replace')
                flags[field] = flag
                vals[field] = n if flag == '1' and np.isfinite(n) and abs(n) < 90000 else None
            # Exclude array padding, but retain a gap for rejected actual samples.
            rawp = float(v['PRES'][i, k])
            if rawp > 90000 and all(x is None for x in vals.values()):
                continue
            if any(x is None for x in vals.values()):
                rejected.append({'sourceIndex': k, 'flags': flags})
            if vals['p'] is None:
                points.append(None)
                continue
            vals['sourceIndex'] = k
            vals['depth'] = float(-gsw.z_from_p(vals['p'], lat))
            vals['rho'] = None
            if vals['t'] is not None and vals['s'] is not None:
                sa = gsw.SA_from_SP(vals['s'], vals['p'], lon, lat)
                vals['rho'] = float(gsw.rho_t_exact(sa, vals['t'], vals['p']))
            points.append(vals)
        cycle = int(v['CYCLE_NUMBER'][i])
        profiles.append({'id': str(cycle), 'date': dt.strftime('%Y-%m-%d'), 'time': dt.isoformat(), 'lat': lat, 'lon': lon, 'points': points})
        quality.append({'id': str(cycle), 'sourceProfileIndex': i, 'excludedOrPartial': rejected})

assert len(profiles) == 52
assert next(p for p in profiles if p['id'] == '69')['date'] == '2023-02-06'
assert next(p for p in profiles if p['id'] == '95')['date'] == '2023-08-07'
land_source = PROOF / 'ne_10m_land.zip'
region = box(123.9, 32.9, 137.1, 43.1)
parts = []
with zipfile.ZipFile(land_source) as z:
    reader = shapefile.Reader(shp=io.BytesIO(z.read('ne_10m_land.shp')), shx=io.BytesIO(z.read('ne_10m_land.shx')), dbf=io.BytesIO(z.read('ne_10m_land.dbf')))
    for s in reader.iterShapes(bbox=region.bounds):
        geom = shape(s.__geo_interface__)
        if geom.intersects(region):
            parts.append(geom.intersection(region))
# Merge tile seams and simplify by at most 0.001 degree while retaining topology.
coast = unary_union(parts).simplify(.001, preserve_topology=True)
geo = mapping(coast)
land = [geo['coordinates']] if geo['type'] == 'Polygon' else geo['coordinates']
payload = {'float': '2901806', 'profiles': profiles, 'land': land}
dest = OUT / 'data.json'
dest.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':'), allow_nan=False) + '\n', encoding='utf-8')
proof = {'source': {'path': str(SOURCE.relative_to(ROOT)).replace('\\', '/'), 'sha256': digest(SOURCE), 'url': 'https://data-argo.ifremer.fr/dac/kma/2901806/2901806_prof.nc'}, 'mapSource': {'path': str(land_source.relative_to(ROOT)).replace('\\', '/'), 'sha256': digest(land_source), 'url': 'https://naturalearth.s3.amazonaws.com/10m_physical/ne_10m_land.zip', 'description': 'Natural Earth 10m land 5.1.1, clipped to 123.9–137.1 E and 32.9–43.1 N, tile seams merged, topology-preserving 0.001-degree simplification. Context map only.'}, 'outputSha256': digest(dest), 'gswVersion': gsw.__version__, 'selection': 'All 52 profiles dated 2023 UTC. Core DATA_MODE D; adjusted fields only. Time and position QC 1; each plotted pressure, temperature and practical salinity must independently have adjusted QC 1. Missing values remain gaps; no interpolation, rounding or smoothing of observations.', 'derived': 'Depth = -gsw.z_from_p(PRES_ADJUSTED, latitude). In-situ density = gsw.rho_t_exact(gsw.SA_from_SP(PSAL_ADJUSTED, pressure, longitude, latitude), TEMP_ADJUSTED, pressure). Density is calculated, not a measured sensor variable; it is not potential density or a T-S isopycnal.', 'qualitySources': ['https://argo.ucsd.edu/data/how-to-use-argo-files/', 'https://www.teos-10.org/pubs/gsw/html/gsw_SA_from_SP.html', 'https://www.teos-10.org/pubs/gsw/html/gsw_rho_t_exact.html', 'https://www.teos-10.org/pubs/gsw/html/gsw_z_from_p.html'], 'profiles': quality, 'limitations': ['One drifting float in the East Sea; its changing location prevents a pure seasonal causal comparison.', 'No oxygen sensor, satellite surface temperature map, Yellow Sea float or real-time retrieval is represented.', 'The archive is a later delayed-mode revision; the textbook screenshot may reflect earlier values.']}
(PROOF / 'provenance.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'profiles': len(profiles), 'points': sum(len(p['points']) for p in profiles), 'bytes': dest.stat().st_size}))
