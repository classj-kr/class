"""Rebuild local, lossless browse images and calibration from public SDO records.
Run explicitly when updating the archived observation set. No live dependency.
"""
import hashlib, io, json, pathlib, urllib.request, xml.etree.ElementTree as ET
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEST = ROOT / 'learning/inquiry/science-lab/sunspot-observation/data'
DEST.mkdir(parents=True, exist_ok=True)
frames = []
for day in ('05', '07', '09'):
    date = f'2024-05-{day}T00:00:00Z'
    url = f'https://sdo.gsfc.nasa.gov/assets/img/browse/2024/05/{day}/202405{day}_000000_1024_HMIIF.jpg'
    raw = urllib.request.urlopen(url, timeout=40).read()
    im = Image.open(io.BytesIO(raw)).convert('RGB')
    file = f'2024-05-{day}.webp'
    im.save(DEST / file, 'WEBP', lossless=True)
    assert np.array_equal(np.asarray(im), np.asarray(Image.open(DEST / file)))
    # Fit the sharp outer limb, excluding caption rows. Use both left and right edges.
    a = np.asarray(im)
    edges = []
    for y in range(100, 925, 4):
        xs = np.flatnonzero(a[y, :, 0] > 140)
        if len(xs) > 100:
            edges.extend([(float(xs[0])-.5, y), (float(xs[-1])+.5, y)])
    xy = np.array(edges)
    fit, *_ = np.linalg.lstsq(np.column_stack((2*xy, np.ones(len(xy)))), (xy*xy).sum(axis=1), rcond=None)
    cx, cy = fit[:2]
    radius = np.sqrt(fit[2] + cx*cx + cy*cy)
    residual = np.std(np.linalg.norm(xy-fit[:2], axis=1)-radius)
    query = f'https://api.helioviewer.org/v2/getClosestImage/?date={date}&sourceId=18'
    meta = json.load(urllib.request.urlopen(query, timeout=40))
    header_url = f'https://api.helioviewer.org/v2/getJP2Header/?id={meta["id"]}'
    header_raw = urllib.request.urlopen(header_url, timeout=40).read()
    header = ET.fromstring(header_raw)
    b0 = float(header.findtext('.//CRLT_OBS'))
    # The header is within 11 seconds of the browse timestamp. At this precision
    # its observer latitude/distance applies; do not borrow its differently scaled CRPIX.
    distance = float(header.findtext('.//DSUN_OBS'))/float(header.findtext('.//RSUN_REF'))
    frames.append(dict(date=date, file=file, source=url, sourceSha256=hashlib.sha256(raw).hexdigest(), sha256=hashlib.sha256((DEST/file).read_bytes()).hexdigest(), size=list(im.size), cx=round(cx,4), cy=round(cy,4), radius=round(radius,4), limbFitResidualPixels=round(residual,4), b0=b0, distanceSolarRadii=distance, ephemerisSource=header_url, ephemerisDate=header.findtext('.//DATE_OBS'), ephemerisSha256=hashlib.sha256(header_raw).hexdigest()))
    print(date, 'limb', cx, cy, radius, 'residual', residual, 'B0', b0)
data = dict(credit='NASA/SDO and the HMI science team', kind='HMI continuum intensity, colorized and limb-darkening corrected', orientationSource='https://jsoc1.stanford.edu/hmi_latest.html', calibration='Solar north up; each browse disk fitted independently. Perspective projection uses observer latitude and distance from a same-instrument record within 11 seconds. Coordinates are classroom estimates from browse images, not precision FITS measurements.', frames=frames)
(DEST/'provenance.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(DEST.parent.parent/'sunspot-data.js').write_text('(function(r){const data='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';if(typeof module!=="undefined")module.exports=data;else r.SunspotData=data;})(typeof window==="undefined"?globalThis:window);\n',encoding='utf8')
