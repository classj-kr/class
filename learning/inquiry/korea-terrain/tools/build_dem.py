"""한반도 지형도용 높이 조각(tiles/{z}/{x}/{y}.webp)을 만든다.

    pip install tifffile imagecodecs scipy
    python tools/build_dem.py

- 8~11단(자세한 범위): 코페르니쿠스 30m 높이 자료(Copernicus DEM GLO-30, 로그인 없이 공개)를
  2초(약 60m) 격자로 모아 메르카토르 조각으로 자른다. 11단 한 칸이 약 60m.
- 3~6단(둘레): AWS 공개 높이 조각(terrarium 6단)을 다시 싼다. 화면을 눕히면 먼 곳까지 보이므로
  비어 보이지 않게 동경 90~180도, 북위 0~66.5도를 채운다. 공개 조각의 튀는 점은 걸러 낸다.
- 7단은 만들지 않고, 10~11단은 남북한 땅에 닿는 칸만 만든다. 지도 프로그램은 없는 조각 자리에
  있는 단의 조각을 늘려 쓴다(빈틈이 생기지 않는 것을 확인했다).

조각은 terrarium 방식(높이 = R×256 + G + B/256 − 32768)을 따르되 1m 단위로 반올림해 B는 늘 0이다.
바다는 −1m(코페르니쿠스 자료는 바다가 정확히 0), 땅은 적어도 1m.
"""

import math
import pathlib
import tempfile
import urllib.error
import urllib.request

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "tiles"
CACHE = pathlib.Path(tempfile.gettempdir()) / "korea-dem"
TILE = 256
SEA = -1

# 모자이크 범위(코페르니쿠스 1도 칸). 조각 경계에 맞춰 안쪽으로 자르면
# 마라도(북위 33.1)·독도(동경 131.9)·온성(북위 43.0)까지 들어가도록 넉넉히 잡았다.
LON0, LON1 = 123, 134
LAT0, LAT1 = 31, 45
PER_DEG = 1800  # 2초 격자
DETAIL_MIN, DETAIL_MAX = 8, 11

# 10~11단은 한반도(남북한 땅)에 닿는 칸과 그 둘레 한 칸만 둔다. 중국·일본·러시아 땅은 9단(약 240m)으로 충분하다.
KOREA_ONLY_FROM = 10
# 국경 자료에 빠진 작은 섬
EXTRA_ISLANDS = [(126.267, 33.117)]  # 마라도

# 둘레: 3단 조각 (6,2)~(7,3) = 동경 90~180도, 북위 0~66.5도
WIDE_Z3 = (6, 7, 2, 3)
WIDE_Z = 6


def tile_x(lon, z):
    return (lon + 180) / 360 * 2 ** z


def tile_y(lat, z):
    r = math.radians(lat)
    return (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * 2 ** z


def encode(height):
    value = np.round(height).astype(np.int32) + 32768
    rgb = np.zeros(height.shape + (3,), dtype=np.uint8)
    rgb[..., 0] = value // 256
    rgb[..., 1] = value % 256
    return Image.fromarray(rgb)


def save(height, z, x, y):
    folder = OUT / str(z) / str(x)
    folder.mkdir(parents=True, exist_ok=True)
    # method 6은 한 장에 0.8초, 4는 0.02초이고 크기는 3%만 늘어난다.
    encode(height).save(folder / f"{y}.webp", "WEBP", lossless=True, quality=100, method=4)


def finish(height, land):
    """땅 비율 0.5 이상이면 땅(적어도 1m), 아니면 바다."""
    return np.where(land >= 0.5, np.maximum(height, 1), SEA).astype(np.float32)


def halve(grid_h, grid_l):
    """반으로 줄인다. 땅의 높이는 땅끼리만 평균해야 해안 쪽 높이가 바다에 끌려 내려가지 않는다."""
    rows, cols = grid_h.shape
    h = grid_h.reshape(rows // 2, 2, cols // 2, 2)
    l = grid_l.reshape(rows // 2, 2, cols // 2, 2)
    weight = l.sum(axis=(1, 3))
    height = np.where(weight > 0, (h * l).sum(axis=(1, 3)) / np.maximum(weight, 1e-6), 0)
    return height.astype(np.float32), (weight / 4).astype(np.float32)


def save_grid(grid_h, grid_l, z, x0, y0, keep=None):
    final = finish(grid_h, grid_l)
    for ty in range(grid_h.shape[0] // TILE):
        for tx in range(grid_h.shape[1] // TILE):
            if keep is not None and not keep[ty, tx]:
                continue
            save(final[ty * TILE:(ty + 1) * TILE, tx * TILE:(tx + 1) * TILE], z, x0 + tx, y0 + ty)


def korea_tiles(z, x0, y0, cols, rows):
    """z단 조각 격자에서 남북한 땅에 닿는 칸(둘레 한 칸 포함)을 True로 둔다."""
    import json
    from PIL import ImageDraw
    sub = 16  # 한 칸을 16×16으로 나눠 칠한다
    mask = Image.new("L", (cols * sub, rows * sub), 0)
    draw = ImageDraw.Draw(mask)
    to_px = lambda lng, lat: ((tile_x(lng, z) - x0) * sub, (tile_y(lat, z) - y0) * sub)
    countries = json.loads((CACHE / "ne_10m_admin_0_countries.geojson").read_text(encoding="utf-8"))
    for feature in countries["features"]:
        if feature["properties"].get("ADM0_A3") not in ("KOR", "PRK"):
            continue
        geometry = feature["geometry"]
        polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
        for polygon in polygons:
            draw.polygon([to_px(*point) for point in polygon[0]], fill=255, outline=255)
    for lng, lat in EXTRA_ISLANDS:
        x, y = to_px(lng, lat)
        draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=255)
    touched = np.asarray(mask).reshape(rows, sub, cols, sub).max(axis=(1, 3)) > 0
    return ndimage.binary_dilation(touched, structure=np.ones((3, 3), bool))


def cop_tile(lat, lon):
    name = f"Copernicus_DSM_COG_10_N{lat:02d}_00_E{lon:03d}_00_DEM"
    file = CACHE / "cop30" / f"N{lat}_E{lon}.tif"
    missing = file.with_suffix(".none")
    if missing.exists():
        return None
    if not file.exists():
        file.parent.mkdir(parents=True, exist_ok=True)
        try:
            urllib.request.urlretrieve(f"https://copernicus-dem-30m.s3.amazonaws.com/{name}/{name}.tif", file)
        except urllib.error.HTTPError:
            missing.touch()  # 바다뿐인 칸은 자료가 없다
            return None
    import tifffile
    return tifffile.imread(file)


def mosaic():
    """2초 격자 모자이크: 높이(바다 0)와 땅 비율(0~1)."""
    height = np.zeros(((LAT1 - LAT0) * PER_DEG, (LON1 - LON0) * PER_DEG), dtype=np.float32)
    land = np.zeros_like(height)
    for lat in range(LAT0, LAT1):
        for lon in range(LON0, LON1):
            data = cop_tile(lat, lon)
            if data is None:
                continue
            ky, kx = data.shape[0] // PER_DEG, data.shape[1] // PER_DEG
            block = data[:PER_DEG * ky, :PER_DEG * kx].reshape(PER_DEG, ky, PER_DEG, kx)
            r0 = (LAT1 - 1 - lat) * PER_DEG
            c0 = (lon - LON0) * PER_DEG
            is_land = block != 0
            count = is_land.sum(axis=(1, 3))
            height[r0:r0 + PER_DEG, c0:c0 + PER_DEG] = np.where(
                count > 0, (np.clip(block, 0, None) * is_land).sum(axis=(1, 3)) / np.maximum(count, 1), 0)
            land[r0:r0 + PER_DEG, c0:c0 + PER_DEG] = count / (ky * kx)
        print(f"모자이크 N{lat}", flush=True)
    return height, land


def detail_tiles(height, land):
    height *= land  # 땅 비율을 곱해 두고 섞은 뒤 다시 나눈다(해안에서 땅 높이가 바다 0에 끌려 내려가지 않게)
    # 8단 조각 경계에 맞춰 모자이크 안쪽으로 자른다(그래야 반씩 줄일 때 딱 맞고, 자료 밖이 바다로 칠해지지 않는다).
    x0 = math.ceil(tile_x(LON0, DETAIL_MIN)) * 2 ** (DETAIL_MAX - DETAIL_MIN)
    x1 = math.floor(tile_x(LON1, DETAIL_MIN)) * 2 ** (DETAIL_MAX - DETAIL_MIN)
    y0 = math.ceil(tile_y(LAT1, DETAIL_MIN)) * 2 ** (DETAIL_MAX - DETAIL_MIN)
    y1 = math.floor(tile_y(LAT0, DETAIL_MIN)) * 2 ** (DETAIL_MAX - DETAIL_MIN)
    size = 2 ** DETAIL_MAX * TILE
    lon = (np.arange(x0 * TILE, x1 * TILE) + 0.5) / size * 360 - 180
    py = (np.arange(y0 * TILE, y1 * TILE) + 0.5) / size
    lat = np.degrees(np.arctan(np.sinh(math.pi * (1 - 2 * py))))
    col = (lon - LON0) * PER_DEG - 0.5
    row = (LAT1 - lat) * PER_DEG - 0.5
    c0 = np.clip(np.floor(col).astype(int), 0, height.shape[1] - 2)
    r0 = np.clip(np.floor(row).astype(int), 0, height.shape[0] - 2)
    fc = np.clip(col - c0, 0, 1).astype(np.float32)
    fr = np.clip(row - r0, 0, 1).astype(np.float32)
    grid_h = np.empty((len(py), len(lon)), dtype=np.float32)
    grid_l = np.empty_like(grid_h)
    for i in range(len(py)):
        a, t = r0[i], fr[i]
        for grid, src in ((grid_h, height), (grid_l, land)):
            line = src[a] * (1 - t) + src[a + 1] * t
            grid[i] = line[c0] * (1 - fc) + line[c0 + 1] * fc
    grid_h = np.where(grid_l > 0.01, grid_h / np.maximum(grid_l, 0.01), 0).astype(np.float32)
    grid_h = np.minimum(grid_h, 3000)
    print(f"{DETAIL_MAX}단 격자 {grid_h.shape[1] // TILE}×{grid_h.shape[0] // TILE}장", flush=True)
    for z in range(DETAIL_MAX, DETAIL_MIN - 1, -1):
        scale = 2 ** (DETAIL_MAX - z)
        keep = None
        if z >= KOREA_ONLY_FROM:
            keep = korea_tiles(z, x0 // scale, y0 // scale, grid_h.shape[1] // TILE, grid_h.shape[0] // TILE)
        save_grid(grid_h, grid_l, z, x0 // scale, y0 // scale, keep)
        print(f"{z}단 완료", flush=True)
        if z > DETAIL_MIN:
            grid_h, grid_l = halve(grid_h, grid_l)


def wide_tiles():
    zx0, zx1, zy0, zy1 = WIDE_Z3
    k = 2 ** (WIDE_Z - 3)
    folder = CACHE / "terrarium6"
    folder.mkdir(parents=True, exist_ok=True)
    rows = []
    for y in range(zy0 * k, (zy1 + 1) * k):
        row = []
        for x in range(zx0 * k, (zx1 + 1) * k):
            file = folder / f"{WIDE_Z}_{x}_{y}.png"
            if not file.exists():
                urllib.request.urlretrieve(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{WIDE_Z}/{x}/{y}.png", file)
            rgb = np.asarray(Image.open(file).convert("RGB")).astype(np.float32)
            row.append(rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768)
        rows.append(np.hstack(row))
    height = np.vstack(rows)
    median = ndimage.median_filter(height, size=3)
    height = np.where(np.abs(height - median) > 500, median, height)
    grid_l = (height > 0).astype(np.float32)
    grid_h = np.maximum(height, 0).astype(np.float32)
    for z in range(WIDE_Z, 2, -1):
        scale = 2 ** (WIDE_Z - z)
        save_grid(grid_h, grid_l, z, zx0 * k // scale, zy0 * k // scale)
        print(f"둘레 {z}단 완료", flush=True)
        if z > 3:
            grid_h, grid_l = halve(grid_h, grid_l)


def cached_mosaic():
    """모자이크는 만드는 데 10분쯤 걸려 임시 폴더에 저장해 두고 다시 쓴다(높이 1m 단위, 땅 비율 1/255 단위)."""
    height_file, land_file = CACHE / "mosaic-height.npy", CACHE / "mosaic-land.npy"
    if height_file.exists() and land_file.exists():
        return np.load(height_file).astype(np.float32), np.load(land_file).astype(np.float32) / 255
    height, land = mosaic()
    np.save(height_file, np.round(height).astype(np.int16))
    np.save(land_file, np.round(land * 255).astype(np.uint8))
    return height, land


def main():
    wide_tiles()
    detail_tiles(*cached_mosaic())


if __name__ == "__main__":
    main()
