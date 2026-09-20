"""Refresh verified thematic data. Build-time dependencies: numpy, rasterio.

Run from any directory. Country geometry and Korean labels remain the checked-in
atlas-countries.json; only the World Bank statistical field is refreshed.
The climate source license is recorded in data/ATLAS-SOURCES.md.
"""
import hashlib, io, json, pathlib, tempfile, urllib.request, zipfile
from datetime import date
import numpy as np
import rasterio

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
        rows = np.floor((np.arange(720) + .5) * 2.5).astype(int)
        cols = np.floor((np.arange(1440) + .5) * 2.5).astype(int)
        sample = original[rows[:, None], cols[None, :]]
        chars = np.full(sample.shape, '_', dtype='<U1')
        for low, high, key in [(1, 3, 'A'), (4, 7, 'B'), (8, 16, 'C'), (17, 28, 'D'), (29, 30, 'E')]:
            chars[(sample >= low) & (sample <= high)] = key
        flat = chars.flatten()
        runs, previous, count = [], flat[0], 0
        for char in flat:
            if char == previous:
                count += 1
            else:
                runs.append(previous + base36(count))
                previous, count = char, 1
        runs.append(previous + base36(count))
        write('atlas-climate.json', {'step': .25, 'width': 1440, 'height': 720, 'runs': ''.join(runs),
              'source': 'Peel et al. (2007), original 0.1 degree raster',
              'method': '0.25 degree cell-centre nearest sampling; 30 classes grouped into A/B/C/D/E; no-data preserved',
              'downloaded': date.today().isoformat(), 'sourceSha256': hashlib.sha256(archive).hexdigest()})

if __name__ == '__main__':
    density()
    plates()
    climate()
    print('Updated density, plate boundaries and climate classification.')
