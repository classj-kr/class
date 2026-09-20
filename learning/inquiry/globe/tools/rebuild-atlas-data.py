"""Refresh verified thematic data. Build-time dependencies: numpy, rasterio, Pillow.

Run from any directory. Country geometry and Korean labels remain the checked-in
atlas-countries.json; only the World Bank statistical field is refreshed.
The climate source license is recorded in data/ATLAS-SOURCES.md.
"""
import hashlib, io, json, pathlib, tempfile, urllib.request, zipfile
from datetime import date
import numpy as np
import rasterio
from build_climate_tiles import build_climate

DEST = pathlib.Path(__file__).resolve().parent.parent / 'data'
WB = 'https://api.worldbank.org/v2/country/all/indicator/EN.POP.DNST?date=2023&format=json&per_page=400'
USGS = 'https://earthquake.usgs.gov/arcgis/rest/services/eq/map_plateboundaries/MapServer/1/query?where=1%3D1&outFields=NAME,LABEL&f=geojson&outSR=4326&resultRecordCount=1000&orderByFields=OBJECTID&resultOffset='
KOPPEN = 'https://hess.copernicus.org/articles/11/1633/2007/hess-11-1633-2007-supplement.zip'

def fetch(url):
    with urllib.request.urlopen(url, timeout=90) as response:
        return response.read()

def write(name, value):
    # Replace only after parsing and validating the complete data.
    target = DEST / name
    pending = target.with_suffix('.pending.json')
    pending.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    pending.replace(target)

def density():
    metadata, rows = json.loads(fetch(WB))
    assert metadata['pages'] == 1
    values = {r['country']['id']: r['value'] for r in rows}
    geo = json.loads((DEST / 'atlas-countries.json').read_text(encoding='utf-8'))
    for feature in geo['features']:
        p = feature['properties']
        p['density'], p['year'] = values.get(p['iso']), 2023
    write('atlas-countries.json', geo)

def plates():
    features = []
    for offset in range(0, 20000, 1000):
        page = json.loads(fetch(USGS + str(offset)))
        if 'error' in page:
            raise ValueError(page['error'])
        features.extend(page['features'])
        if len(page['features']) < 1000:
            break
    else:
        raise ValueError('USGS response exceeded the pagination bound')
    if not features:
        raise ValueError('Empty plate dataset')
    write('atlas-plates.json', {'type': 'FeatureCollection', 'features': features})

def base36(number):
    result = ''
    while number:
        result = '0123456789abcdefghijklmnopqrstuvwxyz'[number % 36] + result
        number //= 36
    return result or '0'

def climate():
    archive = fetch(KOPPEN)
    with tempfile.TemporaryDirectory(prefix='atlas-climate-') as directory:
        with zipfile.ZipFile(io.BytesIO(archive)) as source:
            for member in source.infolist():
                target = (pathlib.Path(directory) / member.filename).resolve()
                if not target.is_relative_to(pathlib.Path(directory).resolve()):
                    raise ValueError('Unexpected archive path')
            source.extractall(directory)
        with rasterio.open(pathlib.Path(directory) / 'Raster files/world_koppen') as source:
            original = source.read(1)
            assert original.shape == (1800, 3600)
        build_climate(original, archive, DEST)


if __name__ == '__main__':
    density()
    plates()
    climate()
    print('Updated density, plate boundaries and climate classification.')
