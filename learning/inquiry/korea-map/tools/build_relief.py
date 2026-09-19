"""국내 지도 바탕(지형도) 그림 조각 relief/{z}/{x}/{y}.webp 를 굽는다.

    python tools/build_dem.py      # 먼저: 높이 조각(%TEMP%/korea-dem/dem-tiles)
    python tools/build_relief.py            # 조각을 새로 굽고 칸 목록(data/relief-tiles.js)도 만든다
    python tools/build_relief.py --index    # 칸 목록만 다시 만든다

높이 조각에서 교과서 지도처럼 높이별 색을 칠하고 북서쪽 빛으로 그늘을 넣는다.
- 3~6단: 둘레(동경 90~180, 북위 0~66.5)
- 7단: 한반도 둘레(8단 높이 조각을 반으로 줄이고, 없는 곳은 6단을 늘린다)
- 8~9단: 한반도 둘레 전체
- 10~11단: 남북한 땅에 닿는 칸만(높이 조각이 있는 곳)
지도 프로그램(Leaflet)은 이 조각을 세 겹으로 깐다: 3~6단 / 7~9단 / 10~11단. 윗겹에 없는 칸은 아랫겹이 보인다.
같은 높이 조각으로 단면도도 그리므로 profile용 조각(dem/)도 여기서 골라 넣는다.
"""

import json
import math
import pathlib
import shutil
import sys
import tempfile

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEM = pathlib.Path(tempfile.gettempdir()) / "korea-dem" / "dem-tiles"
OUT = ROOT / "relief"
PROFILE_DEM = ROOT / "dem"
PROFILE_ZOOMS = (6, 8, 9, 10)  # 단면도는 10단(약 120m)이면 시험 단면으로 충분하다
INDEX = ROOT / "data" / "relief-tiles.js"
SPARSE_ZOOMS = (10, 11)  # 땅에 닿는 칸만 있는 단. 없는 칸을 부르지 않도록 목록을 남긴다.
TILE = 256
QUALITY = 80
SEA = np.array([156, 201, 234], np.float32)  # #9cc9ea
# 높이(m) → 색. 지형도 범례와 같다.
STOPS = np.array([1, 200, 500, 1000, 1500, 2000, 2800], np.float32)
COLORS = np.array([[111, 180, 106], [185, 217, 142], [239, 230, 162], [223, 174, 112],
                   [183, 122, 71], [138, 90, 63], [110, 74, 58]], np.float32)
LIGHT = None


def light_vector():
    azimuth, altitude = math.radians(315), math.radians(45)
    return np.array([math.sin(azimuth) * math.cos(altitude), math.cos(azimuth) * math.cos(altitude), math.sin(altitude)])


def load(z, x, y):
    file = DEM / str(z) / str(x) / f"{y}.webp"
    if not file.exists():
        return None
    rgb = np.asarray(Image.open(file).convert("RGB")).astype(np.float32)
    return rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768


_cache = {}


def height_tile(z, x, y):
    """그 칸의 높이. 조각이 없으면 7단은 8단 네 칸을 줄이고, 그 밖은 윗단을 늘려 만든다."""
    key = (z, x, y)
    if key in _cache:
        return _cache[key]
    tile = load(z, x, y)
    if tile is None and z == 7:
        # 저장된 8단 조각만 읽는다(없는 8단을 7단에서 만들게 두면 서로 부르며 끝나지 않는다).
        quads = [load(8, 2 * x + dx, 2 * y + dy) for dy in (0, 1) for dx in (0, 1)]
        if any(q is not None for q in quads):
            parent = height_tile(6, x // 2, y // 2)
            filled = []
            for i, q in enumerate(quads):
                if q is None:
                    q = upsample_quadrant(parent, x, y, i) if parent is not None else np.full((TILE, TILE), -1, np.float32)
                filled.append(q)
            big = np.vstack([np.hstack(filled[0:2]), np.hstack(filled[2:4])])
            tile = shrink(big)
    if tile is None and z > 3:
        parent = height_tile(z - 1, x // 2, y // 2)
        if parent is not None:
            half = TILE // 2
            quad = parent[(y % 2) * half:(y % 2 + 1) * half, (x % 2) * half:(x % 2 + 1) * half]
            tile = np.kron(quad, np.ones((2, 2), np.float32))
    _cache[key] = tile
    return tile


def upsample_quadrant(parent, x7, y7, index):
    """6단 부모에서 7단 칸의 한 사분면(8단 크기)을 떼어 4배로 늘린다."""
    half, quarter = TILE // 2, TILE // 4
    px, py = (x7 % 2) * half, (y7 % 2) * half
    qx, qy = (index % 2) * quarter, (index // 2) * quarter
    part = parent[py + qy:py + qy + quarter, px + qx:px + qx + quarter]
    return np.kron(part, np.ones((4, 4), np.float32))


def shrink(big):
    land = (big > 0).astype(np.float32)
    h = big.reshape(TILE, 2, TILE, 2)
    l = land.reshape(TILE, 2, TILE, 2)
    weight = l.sum(axis=(1, 3))
    height = np.where(weight > 0, (np.maximum(h, 0) * l).sum(axis=(1, 3)) / np.maximum(weight, 1e-6), -1)
    return np.where(weight >= 2, np.maximum(height, 1), -1).astype(np.float32)


def neighborhood(z, x, y):
    """둘레 한 칸씩 붙인 높이(258×258). 이웃이 없으면 가장자리를 늘린다."""
    center = height_tile(z, x, y)
    pad = np.pad(center, 1, mode="edge")
    n = 2 ** z
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx == dy == 0:
                continue
            other = height_tile(z, (x + dx) % n, y + dy) if 0 <= y + dy < n else None
            if other is None:
                continue
            rows = slice(0, 1) if dy == -1 else slice(TILE + 1, TILE + 2) if dy == 1 else slice(1, TILE + 1)
            cols = slice(0, 1) if dx == -1 else slice(TILE + 1, TILE + 2) if dx == 1 else slice(1, TILE + 1)
            src_rows = slice(TILE - 1, TILE) if dy == -1 else slice(0, 1) if dy == 1 else slice(0, TILE)
            src_cols = slice(TILE - 1, TILE) if dx == -1 else slice(0, 1) if dx == 1 else slice(0, TILE)
            pad[rows, cols] = other[src_rows, src_cols]
    return pad


def render(z, x, y):
    pad = neighborhood(z, x, y)
    height = pad[1:-1, 1:-1]
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + 0.5) / 2 ** z))))
    cell = 40075016.686 * math.cos(math.radians(lat)) / (TILE * 2 ** z)
    # 낮은 단일수록 산이 작게 보이므로 높이를 더 키워 그늘을 준다.
    exaggeration = 1.2 * 1.35 ** (11 - z)
    ground = np.maximum(pad, 0)
    dzdx = (ground[1:-1, 2:] - ground[1:-1, :-2]) / (2 * cell) * exaggeration
    dzdn = -(ground[2:, 1:-1] - ground[:-2, 1:-1]) / (2 * cell) * exaggeration
    norm = np.sqrt(dzdx ** 2 + dzdn ** 2 + 1)
    shade = np.clip((-dzdx * LIGHT[0] - dzdn * LIGHT[1] + LIGHT[2]) / norm, 0, 1)
    factor = np.clip(0.42 + 0.82 * shade, 0.42, 1.22)[..., None]
    rgb = np.stack([np.interp(height, STOPS, COLORS[:, c]) for c in range(3)], axis=-1) * factor
    rgb[height <= 0] = SEA
    return Image.fromarray(np.clip(rgb + 0.5, 0, 255).astype(np.uint8))


def save(image, z, x, y):
    folder = OUT / str(z) / str(x)
    folder.mkdir(parents=True, exist_ok=True)
    image.save(folder / f"{y}.webp", "WEBP", quality=QUALITY, method=4)


def tiles_at(z):
    folder = DEM / str(z)
    return sorted((int(x.name), int(y.stem)) for x in folder.iterdir() for y in x.glob("*.webp")) if folder.exists() else []


def main():
    global LIGHT
    LIGHT = light_vector()
    if OUT.exists():
        shutil.rmtree(OUT)
    counts = {}
    for z in (3, 4, 5, 6, 8, 9, 10, 11):
        for x, y in tiles_at(z):
            save(render(z, x, y), z, x, y)
        counts[z] = len(tiles_at(z))
        print(f"{z}단 {counts[z]}장", flush=True)
    # 7단: 8단 칸이 있는 곳의 부모들
    z7 = sorted({(x // 2, y // 2) for x, y in tiles_at(8)})
    for x, y in z7:
        save(render(7, x, y), 7, x, y)
    print(f"7단 {len(z7)}장", flush=True)

    if PROFILE_DEM.exists():
        shutil.rmtree(PROFILE_DEM)
    for z in PROFILE_ZOOMS:
        shutil.copytree(DEM / str(z), PROFILE_DEM / str(z))
    print("단면도용 높이 조각:", ", ".join(f"{z}단" for z in PROFILE_ZOOMS))


def write_index():
    """10~11단에 있는 칸 목록: {단: {x: [[y 처음, y 끝], ...]}}"""
    index = {}
    for z in SPARSE_ZOOMS:
        columns = {}
        for x_dir in sorted((OUT / str(z)).iterdir(), key=lambda d: int(d.name)):
            ys = sorted(int(f.stem) for f in x_dir.glob("*.webp"))
            runs = []
            for y in ys:
                if runs and runs[-1][1] == y - 1:
                    runs[-1][1] = y
                else:
                    runs.append([y, y])
            columns[x_dir.name] = runs
        index[str(z)] = columns
    INDEX.write_text(
        "// tools/build_relief.py 로 만든 파일. 직접 고치지 말 것.\n"
        "// 지형 바탕 10~11단에 있는 칸: {단: {x: [[y 처음, y 끝], ...]}}\n"
        f"window.RELIEF_TILES = {json.dumps(index, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    print(INDEX, INDEX.stat().st_size, "bytes")


if __name__ == "__main__":
    if "--index" not in sys.argv:
        main()
    write_index()
