"""Build science-map facts from archived primary data, retaining observation IDs."""
from pathlib import Path
import csv
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'learning/inquiry/science-lab/plate-tectonics'
AUDIT = ROOT / 'docs/science-lab-audit-2026-10-12/course-practices/tectonic-data/source-data'
SOURCES = {
    'earthquakes': ('references/geography/tectonics/usgs-m6-1970-2025.csv', 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=csv&starttime=1970-01-01&endtime=2025-12-31&minmagnitude=6&orderby=time-asc'),
    'volcanoes': ('references/geography/tectonics/noaa-volcanolocs.json', 'https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanolocs'),
    'boundaries': ('learning/inquiry/globe/data/atlas-plates.json', 'https://earthquake.usgs.gov/arcgis/rest/services/eq/map_plateboundaries/MapServer/1'),
    'land': ('learning/inquiry/globe/data/atlas-countries.json', 'https://www.naturalearthdata.com/'),
}


def load(key):
    return json.loads((ROOT / SOURCES[key][0]).read_text(encoding='utf8'))


rows = list(csv.DictReader((ROOT / SOURCES['earthquakes'][0]).open(encoding='utf8', newline='')))
excluded = [dict(id=r['id'], type=r['type'], time=r['time']) for r in rows if r['type'] != 'earthquake']
quakes = [dict(id=r['id'], time=r['time'], year=int(r['time'][:4]), lon=float(r['longitude']), lat=float(r['latitude']), mag=float(r['mag']), magType=r['magType'], depth=float(r['depth']), place=r['place']) for r in rows if r['type'] == 'earthquake' and '1980-01-01' <= r['time'] < '2026-01-01' and float(r['mag']) >= 6]
volcanoes = [dict(id=str(v['id']), name=v['name'], country=v.get('country', ''), lon=v['longitude'], lat=v['latitude'], status=v.get('status'), timeErupt=v.get('timeErupt')) for v in load('volcanoes') if isinstance(v.get('longitude'), (float, int)) and isinstance(v.get('latitude'), (float, int))]
boundaries = load('boundaries')['features']
land = [f['geometry'] for f in load('land')['features']]
assert len({r['id'] for r in quakes}) == len(quakes)
assert len({r['id'] for r in volcanoes}) == len(volcanoes)
assert all(-180 <= r['lon'] <= 180 and -90 <= r['lat'] <= 90 for r in quakes + volcanoes)
assert all(f['geometry']['type'] in ['LineString', 'MultiLineString'] for f in boundaries)
data = dict(period=[1980, 2025], minMagnitude=6, earthquakes=quakes, volcanoes=volcanoes, boundaries=boundaries, land=land)
OUT.mkdir(parents=True, exist_ok=True)
AUDIT.mkdir(parents=True, exist_ok=True)
body = (json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n').encode('utf8')
(OUT / 'data.json').write_bytes(body)
audit = dict(sources=[dict(kind=k, path=p, url=u, sha256=hashlib.sha256((ROOT / p).read_bytes()).hexdigest()) for k, (p, u) in SOURCES.items()], outputSha256=hashlib.sha256(body).hexdigest(), counts=dict(rawEvents=len(rows), earthquakes=len(quakes), volcanoes=len(volcanoes), boundaries=len(boundaries), landGeometries=len(land)), excludedNonEarthquakes=excluded, transformations=['Only type=earthquake; exclude explosions and nuclear explosions.', 'Preserve original coordinates, magnitude, magnitude type, depth, timestamp and event ID. Select 1980–2025 and magnitude >=6.', 'Volcano locations include Holocene and Pleistocene entries. Never filter these points by earthquake year or present them as dated eruptions.', 'Land is contextual geometry only. No population values or country labels are used.'], boundary='Historical catalog snapshot, not real-time monitoring, completeness certification, a forecast, or a hazard/risk map.', methodSources=['https://earthquake.usgs.gov/fdsnws/event/1/', 'https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ngdc.mgg.hazards%3AG02135%3Bview%3Diso'])
(AUDIT / 'provenance.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
print(json.dumps(audit['counts']))
