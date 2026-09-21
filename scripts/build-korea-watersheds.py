"""Derive educational watershed overlays; requires pyshp and shapely.

Input: official hybas_as_lev06_v1c.zip (keep raw input outside the app).
No administrative clipping, hand-drawn basins, or arbitrary rain routing.
Usage: python scripts/build-korea-watersheds.py path/to/hybas_as_lev06_v1c.zip
"""
import hashlib
import json
from pathlib import Path
import sys
import zipfile
import shapefile
from shapely.geometry import Point, shape, mapping
from shapely.ops import unary_union
from shapely import make_valid

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
with zipfile.ZipFile(source) as archive:
    base = 'hybas_as_lev06_v1c'
    reader = shapefile.Reader(shp=archive.open(base+'.shp'), shx=archive.open(base+'.shx'), dbf=archive.open(base+'.dbf'))
    rows = [(item.record.as_dict(), shape(item.shape.__geo_interface__)) for item in reader.iterShapeRecords()]
rivers = json.loads((root/'learning/inquiry/korea-map/data/major-rivers.geojson').read_text(encoding='utf-8'))
features, aliases, report = [], {}, []
for river in rivers['features']:
    name = river['properties']['name']
    lines = river['geometry']['coordinates']
    if river['geometry']['type'] == 'LineString':
        lines = [lines]
    points = max(lines, key=len)
    probe = Point(points[len(points)//2])
    hits = [row for row, geom in rows if geom.covers(probe)]
    assert len(hits) == 1 and hits[0]['COAST'] == 0, (name, hits)
    basin_id = hits[0]['MAIN_BAS']
    aliases[name] = basin_id
    if any(f['properties']['mainBas'] == basin_id for f in features):
        continue
    members = [(row, geom) for row, geom in rows if row['MAIN_BAS'] == basin_id]
    geom = unary_union([make_valid(geom) for _, geom in members])
    assert geom.is_valid
    # ~100 m at this latitude: rendering simplification, not improved accuracy.
    simple = geom.simplify(.001, preserve_topology=True)
    assert simple.is_valid and simple.area/geom.area > .99
    # OSM and the elevation-derived basin need not share their coastal boundary.
    coverage = sum(simple.buffer(.015).covers(Point(p)) for p in points)/len(points)
    # Estuaries may be ocean in this global DEM product, particularly the Han.
    # Keep that limit visible; do not expand the basin to force the OSM line inside.
    assert simple.buffer(.001).covers(probe), name
    features.append({'type':'Feature', 'properties':{
        'name': name, 'mainBas': basin_id, 'memberIds':[int(row['HYBAS_ID']) for row,_ in members],
        'sourceAreaKm2':round(sum(row['SUB_AREA'] for row,_ in members),1)
    }, 'geometry':mapping(simple)})
    report.append({'name':name,'id':basin_id,'members':len(members),'riverCoverageWithinApprox1_5km':round(coverage,4)})

def rounded(value):
    if isinstance(value, (tuple,list)): return [rounded(v) for v in value]
    if isinstance(value, dict): return {k:rounded(v) for k,v in value.items()}
    return round(value,5) if isinstance(value,float) else value

result = rounded({'type':'FeatureCollection','source':'HydroBASINS Asia level 6 v1.c; Lehner & Grill (2013)',
    'sourceUrl':'https://www.hydrosheds.org/products/hydrobasins',
    'sourceArchiveSha256':hashlib.sha256(source.read_bytes()).hexdigest(),
    'license':'HydroSHEDS License Agreement; see watershed-license.pdf and watershed-notice.html. Not CC BY.',
    'modifications':'Invalid source rings repaired with GEOS make_valid; grouped by MAIN_BAS, simplified 0.001 degrees, rounded to 5 decimal places; river names assigned by OSM midstream spatial join.',
    'aliases':aliases, 'features':features})
target=root/'learning/inquiry/korea-map/data/watersheds.geojson'
target.write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
print(json.dumps({'bytes':target.stat().st_size,'basins':len(features),'validation':report},ensure_ascii=False,indent=2))
