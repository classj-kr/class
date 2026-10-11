"""지구본 바탕 그림에 산 빛깔과 그늘을 덧입힌다.

    python tools/build_relief_tiles.py --base <지금 조각 폴더> --etopo <ETOPO1_Ice_g_geotiff.tif> --koppen <world_koppen 폴더>

바탕 그림(숲·초원·툰드라·사막·얼음의 색, 강줄기, 잔주름)은 지우지 않는다. 그 위에 산만 얹는다.

- 둘레 낮은 땅보다 솟을수록 갈색 쪽으로 물들이고(아주 높으면 잿빛), 북서쪽 빛으로 그늘을 넣는다.
  물들일 때는 둘레 평균색의 비율만 곱하므로 픽셀 하나하나의 밝고 어두움은 그대로 남는다.
- 사막은 바탕 그림 그대로다. Peel(2007) 쾨펜 구분의 사막 기후(BWh·BWk) 칸에서는 평평한 고원을 물들이지 않아
  모래색이 남고, 그 안의 바위산만 갈색이 된다. (모래 점무늬를 얹어 봤으나 지저분해서 뺐다, 2026-10-11)

바다는 세 단계: 깊은 바다는 바탕 바다색 그대로, 얕은 대륙붕은 살짝 옅게, 해구는 짙게.

높이와 바다 깊이는 ETOPO1 얼음 표면(1분 격자). 호수·강·얼음·만년설은 바탕 그림 그대로 둔다.
"""

import argparse
import io
import json
import pathlib
import struct

import cv2
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = pathlib.Path(__file__).resolve().parents[1]
TILE = 512
MAX_Z = 5
SIZE = TILE * 2 ** MAX_Z
HALO = 160  # 둘레 낮은 땅을 찾는 창(REGION)과 그 뒤 흐림이 조각 줄 경계에서 끊기지 않을 만큼
EARTH = 40075016.686
VERSION = "20261012-sea4"

# 산 빛깔: 높이(m) → 물들일 색. 낮은 산은 밝은 갈색, 높을수록 짙어지다 잿빛·흰빛으로.
MOUNTAIN = [
    (0, (150, 124, 90)),
    (1000, (146, 116, 84)),
    (2000, (136, 104, 78)),
    (3000, (126, 98, 82)),
    (4000, (140, 128, 122)),
    (5000, (178, 174, 176)),
    (6000, (232, 232, 238)),
]
# 산은 "둘레 낮은 땅보다 얼마나 솟았나"로 물들인다. 그래야 낮은 산도 평야와 갈리고, 넓고 평평한 고원은 땅 덮개 색이 남는다.
REGION = 61  # 둘레 낮은 땅을 찾는 창(픽셀, 중위도에서 120km쯤)
TINT_BY_RISE = [(80, 0), (250, .3), (500, .5), (900, .66), (1600, .78)]
# 솟지 않았어도 높은 땅(고원)은 조금 물든다. 사막 고원은 모래색 그대로 둔다.
TINT_BY_HEIGHT = [(400, 0), (1000, .14), (2000, .28), (3500, .45), (5000, .6)]
TUNDRA_TINT = .5  # 툰드라에서는 덜 물들여 잿빛을 남긴다
# 바다는 세 단계뿐이다: 대륙붕 / 깊은 바다 / 해구. 깊은 바다가 바탕 그림의 바다색 그대로이고,
# 얕은 대륙붕은 그보다 살짝 옅게, 해구만 짙게 한다. 더 잘게 나누면 바다 한가운데가 얼룩져 공부에 방해만 된다.
OCEAN = (0, 95, 154)  # 바탕 그림의 바다색
SHELF_DEPTH, SHELF_LIGHTEN = 200, .15  # 이 깊이(m)까지는 흰색 쪽으로 이만큼 옅게
TRENCH_DEPTH, TRENCH_DARKEN = 6500, .75  # 이 깊이(m)를 넘으면 바탕 바다색의 이만큼 밝기
SEA_EDGE = 60  # 단계 경계를 이만큼(m) 풀어 테두리가 톱니처럼 보이지 않게
# 북극 둘레: 조각이 끝나는 마지막 줄은 한 가지 색이어야 극 둘레에 부채꼴 줄무늬가 생기지 않는다. 이 위도 사이에서 바탕 바다색으로 돌아간다.
POLE_SEA = (83.5, 85)
DESERT_CLASSES = (4, 5)  # Peel(2007) 번호: 4 BWh, 5 BWk
TUNDRA_CLASSES = (29,)  # ET
ICE_CAP_CLASSES = (30,)  # EF


# ── 자료 읽기 ───────────────────────────────────────────────────────────────

def _fax_block(body, width, height):
    """두 값뿐인 칸 묶음은 팩스 방식(CCITT RLE) 한 비트 그림이다. 가짜 TIFF로 싸서 푼다."""
    tags = [(256, 4, width), (257, 4, height), (258, 3, 1), (259, 3, 2), (262, 3, 1), (266, 3, 1),
            (273, 4, 8 + 2 + 12 * 10 + 4), (277, 3, 1), (278, 4, height), (279, 4, len(body))]
    entries = b"".join(
        struct.pack("<HHI", tag, kind, 1) + (struct.pack("<I", value) if kind == 4 else struct.pack("<HH", value, 0))
        for tag, kind, value in tags)
    tiff = b"II" + struct.pack("<HI", 42, 8) + struct.pack("<H", len(tags)) + entries + struct.pack("<I", 0) + bytes(body)
    return (np.asarray(Image.open(io.BytesIO(tiff)).convert("L")) > 0).astype(np.int64).ravel()


def read_arc_grid(folder):
    """ArcInfo 정수 격자(world_koppen)를 읽는다. 값 없는 칸은 255."""
    folder = pathlib.Path(folder)
    header = (folder / "hdr.adf").read_bytes()
    per_row, per_column, block_w, _, block_h = struct.unpack(">iiiii", header[288:308])
    west, south, east, north = struct.unpack(">dddd", (folder / "dblbnd.adf").read_bytes()[:32])
    cell_w, cell_h = struct.unpack(">dd", header[256:272])
    width, height = round((east - west) / cell_w), round((north - south) / cell_h)
    index = (folder / "w001001x.adf").read_bytes()[100:]
    data = (folder / "w001001.adf").read_bytes()
    grid = np.full((per_column * block_h, per_row * block_w), 255, dtype=np.int32)
    total = block_w * block_h
    for number in range(len(index) // 8):
        offset, size = struct.unpack(">ii", index[number * 8:number * 8 + 8])
        if size <= 0:
            continue
        start = offset * 2
        length = struct.unpack(">H", data[start:start + 2])[0] * 2
        block = data[start + 2:start + 2 + length]
        kind, min_size = block[0], block[1]
        low = int.from_bytes(block[2:2 + min_size], "big", signed=True) if min_size else 0
        body = block[2 + min_size:]
        values = np.full(total, -9999, dtype=np.int64)
        if kind == 0x00:
            values[:] = low
        elif kind == 0x08:
            values[:] = np.frombuffer(body[:total], dtype=np.uint8).astype(np.int64) + low
        elif kind == 0x10:
            values[:] = np.frombuffer(body[:total * 2], dtype=">u2").astype(np.int64) + low
        elif kind == 0xFF:
            values[:] = _fax_block(body, block_w, block_h) + low
        else:
            at = filled = 0
            while filled < total and at < len(body):
                count = body[at]
                at += 1
                if kind in (0xFC, 0xF8):
                    values[filled:filled + count] = body[at] + low
                    at += 1
                    filled += count
                elif kind == 0xF0:
                    values[filled:filled + count] = int.from_bytes(body[at:at + 2], "big") + low
                    at += 2
                    filled += count
                elif kind == 0xE0:
                    values[filled:filled + count] = int.from_bytes(body[at:at + 4], "big") + low
                    at += 4
                    filled += count
                elif kind == 0xD7 and count < 128:
                    values[filled:filled + count] = np.frombuffer(body[at:at + count], dtype=np.uint8).astype(np.int64) + low
                    at += count
                    filled += count
                elif kind == 0xDF and count < 128:
                    values[filled:filled + count] = low
                    filled += count
                elif count > 127:
                    filled += 256 - count
                else:
                    raise ValueError(f"읽을 줄 모르는 칸 묶음 {kind:#x}")
        row, column = divmod(number, per_row)
        grid[row * block_h:(row + 1) * block_h, column * block_w:(column + 1) * block_w] = \
            np.where(values == -9999, 255, values).reshape(block_h, block_w)
    grid = grid[:height, :width]
    return np.where((grid < 0) | (grid > 255), 255, grid).astype(np.uint8)


def read_etopo(path):
    """ETOPO1 격자 등록본: 21,601 × 10,801, 칸 가운데가 경도 -180 + i/60, 위도 90 - j/60."""
    import tifffile
    heights = tifffile.imread(path)
    assert heights.shape == (10801, 21601), heights.shape
    return np.ascontiguousarray(heights.astype(np.int16))


def base_band(source, row):
    """바탕 조각의 한 줄(위아래 HALO, 좌우 HALO를 이어 붙임)."""
    top, bottom = row * TILE - HALO, (row + 1) * TILE + HALO
    rows = range(max(0, row - 1), min(2 ** MAX_Z - 1, row + 1) + 1)
    strips = []
    for tile_row in rows:
        strip = np.concatenate(
            [np.asarray(Image.open(source / str(MAX_Z) / str(x) / f"{tile_row}.webp").convert("RGB"))
             for x in range(2 ** MAX_Z)], axis=1)
        strips.append(strip)
    block = np.concatenate(strips, axis=0)
    first = rows[0] * TILE
    lo, hi = max(top, 0), min(bottom, SIZE)
    block = block[lo - first:hi - first]
    # 지도 위아래 끝에서는 바깥이 없으니 끝줄을 되풀이한다
    block = np.pad(block, ((lo - top, bottom - hi), (0, 0), (0, 0)), mode="edge")
    return np.concatenate([block[:, -HALO:], block, block[:, :HALO]], axis=1)


# ── 덧입히기 ─────────────────────────────────────────────────────────────────

def ramp(heights, stops):
    levels = [stop[0] for stop in stops]
    return np.stack([np.interp(heights, levels, [stop[1][c] for stop in stops]) for c in range(3)], axis=-1).astype(np.float32)


def smoothstep(low, high, value):
    t = np.clip((value - low) / (high - low), 0, 1)
    return t * t * (3 - 2 * t)


def blur(image, sigma):
    return cv2.GaussianBlur(image, (0, 0), sigma)


def render_band(row, base_root, etopo, koppen):
    """5단 한 줄(512 × 16,384)."""
    ys = np.arange(row * TILE - HALO, (row + 1) * TILE + HALO) + .5
    xs = np.arange(-HALO, SIZE + HALO) + .5
    lat = np.degrees(np.arctan(np.sinh(np.pi * (1 - 2 * np.clip(ys, .5, SIZE - .5) / SIZE))))
    lon = (xs / SIZE * 360 - 180 + 180) % 360 - 180

    # 높이
    map_x = np.broadcast_to(((lon + 180) * 60).astype(np.float32), (ys.size, xs.size)).copy()
    map_y = np.broadcast_to(((90 - lat) * 60).astype(np.float32)[:, None], (ys.size, xs.size)).copy()
    level = cv2.remap(etopo, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).astype(np.float32)
    height = np.maximum(level, 0)
    smooth = blur(height, 1.2)
    # 한 픽셀의 실제 길이는 위도에 따라 줄어든다
    metres = (EARTH / SIZE * np.cos(np.radians(lat))).astype(np.float32)[:, None]

    # 둘레 낮은 땅(창 안에서 가장 낮은 높이를 고르게 편 것)보다 솟은 높이
    ground = blur(cv2.erode(height, np.ones((REGION, REGION), np.uint8)), REGION * .4)
    rise = np.maximum(smooth - ground, 0)

    # 그늘: 북서쪽 위에서 비추는 빛
    relief = blur(height, .7)
    east = cv2.Sobel(relief, cv2.CV_32F, 1, 0, ksize=3) / 8 / metres
    south = cv2.Sobel(relief, cv2.CV_32F, 0, 1, ksize=3) / 8 / metres
    exaggeration = 5.0
    p, q = east * exaggeration, -south * exaggeration  # 동쪽·북쪽 기울기
    altitude = np.radians(45)
    light = (-np.cos(altitude) / np.sqrt(2), np.cos(altitude) / np.sqrt(2), np.sin(altitude))
    shade = np.clip((-p * light[0] - q * light[1] + light[2]) / np.sqrt(1 + p * p + q * q) / light[2], .5, 1.4)
    # 평지(기울기 0)는 1. 그늘은 짙게, 볕 든 쪽은 조금만 밝게
    shade = np.where(shade < 1, 1 - (1 - shade) * .75, 1 + (shade - 1) * .35)

    # 기후 칸: 0.1도 칸의 네모 가장자리를 풀어 준다
    column = np.clip(np.floor((lon + 180) * 10).astype(int), 0, 3599)
    line = np.clip(np.floor((90 - lat) * 10).astype(int), 0, 1799)
    climate = koppen[line[:, None], column[None, :]]
    zone = lambda classes: smoothstep(.3, .7, blur(np.isin(climate, classes).astype(np.float32), 5))
    desert = zone(DESERT_CLASSES)
    tundra = zone(TUNDRA_CLASSES)
    ice_cap = np.maximum(zone(ICE_CAP_CLASSES), smoothstep(-60, -62, lat)[:, None].astype(np.float32))

    # 손대지 않을 곳: 물, 얼음, 만년설
    base = base_band(base_root, row).astype(np.float32)
    r, g, b = base[..., 0], base[..., 1], base[..., 2]
    blue = b - r
    water = smoothstep(8, 28, blue) * smoothstep(0, 10, b - g)
    # 바탕 그림은 툰드라를 푸른 잿빛으로 칠해 물과 색이 겹친다. 툰드라 기후 칸에서는 짙은 물빛과 가는 물줄기만 물로 본다.
    deep = smoothstep(45, 80, blue) * smoothstep(115, 85, r)
    thread = smoothstep(14, 36, blue - blur(blue, 7)) * smoothstep(0, 10, b - g)
    water = water * (1 - tundra) + np.maximum(deep, thread) * tundra
    # 만년설: 밝고 누런 기가 적은 픽셀. 가는 눈 줄기도 지켜야 하므로 흐리지 않고 픽셀마다 본다.
    # 사막의 밝은 모래와 색이 겹치므로 사막 기후 칸에서는 아주 높은 곳만 눈으로 본다.
    bright = smoothstep(142, 176, base.min(axis=-1)) * smoothstep(34, 20, -blue)
    snow = bright * np.maximum(1 - desert, smoothstep(2500, 3500, smooth))
    keep = np.maximum(np.maximum(water, ice_cap), snow)

    # 산 빛깔: 솟은 만큼 + 높은 만큼(사막 고원은 빼고). 툰드라에서는 덜
    curve = lambda value, stops: np.interp(value, [s[0] for s in stops], [s[1] for s in stops]).astype(np.float32)
    by_rise = curve(rise, TINT_BY_RISE)
    by_height = curve(smooth, TINT_BY_HEIGHT) * (1 - desert)
    tint = (1 - (1 - by_rise) * (1 - by_height)) * (1 - (1 - TUNDRA_TINT) * tundra) * (1 - keep)
    # 둘레 평균색을 목표색 쪽으로 옮기는 비율만 곱한다 → 픽셀마다의 밝고 어두움(잔주름)은 그대로
    around_color = blur(base, 7)
    target = around_color * (1 - tint[..., None]) + ramp(smooth, MOUNTAIN) * tint[..., None]
    gain = np.clip((target + 4) / (around_color + 4), .5, 1.9)  # 물들지 않는 곳은 정확히 1
    shade = 1 + (shade - 1) * (1 - keep)

    # 바다 깊이 단계: 바탕 바다색인 픽셀만(호수·강·해안선 번짐은 그대로)
    depth = blur(np.maximum(-level, 0), 3)
    sea = 1 - smoothstep(4, 14, np.abs(base - np.array(OCEAN, dtype=np.float32)).max(axis=-1))
    # 해안선에서 땅색과 섞인 픽셀도 바다가 섞인 만큼 함께 옮긴다. 안 그러면 옅어진 대륙붕과 땅 사이에 원래 바다색 테가 남는다.
    sea = np.maximum(sea, cv2.dilate(sea, np.ones((5, 5), np.uint8)) * smoothstep(20, 130, blue))
    sea *= 1 - smoothstep(*POLE_SEA, lat)[:, None].astype(np.float32)
    shelf = sea * (1 - smoothstep(SHELF_DEPTH - SEA_EDGE, SHELF_DEPTH + SEA_EDGE, depth)) * SHELF_LIGHTEN
    trench = 1 - sea * smoothstep(TRENCH_DEPTH - SEA_EDGE, TRENCH_DEPTH + SEA_EDGE, depth) * (1 - TRENCH_DARKEN)
    out = base * gain * shade[..., None]
    out = (out + (255 - out) * shelf[..., None]) * trench[..., None]

    return np.clip(out[HALO:-HALO, HALO:-HALO] + .5, 0, 255).astype(np.uint8)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base", type=pathlib.Path, required=True, help="덧입힐 바탕 조각 폴더(0~5단)")
    parser.add_argument("--etopo", type=pathlib.Path, required=True)
    parser.add_argument("--koppen", type=pathlib.Path, required=True)
    parser.add_argument("--output", type=pathlib.Path, default=ROOT / "tiles-colored")
    parser.add_argument("--quality", type=int, default=92)
    args = parser.parse_args()
    assert args.base.resolve() != args.output.resolve(), "바탕 폴더에 그대로 덮어쓰면 다음에 다시 만들 수 없다"

    etopo = read_etopo(args.etopo)
    koppen = read_arc_grid(args.koppen)
    image = np.empty((SIZE, SIZE, 3), dtype=np.uint8)
    for row in range(2 ** MAX_Z):
        band = slice(row * TILE, (row + 1) * TILE)
        image[band] = render_band(row, args.base, etopo, koppen)
        print(f"5단 {row + 1}/{2 ** MAX_Z}줄", flush=True)
    del etopo

    count = 0
    for zoom in range(MAX_Z, -1, -1):
        for x in range(2 ** zoom):
            folder = args.output / str(zoom) / str(x)
            folder.mkdir(parents=True, exist_ok=True)
            for y in range(2 ** zoom):
                tile = image[y * TILE:(y + 1) * TILE, x * TILE:(x + 1) * TILE]
                Image.fromarray(tile).save(folder / f"{y}.webp", "WEBP", quality=args.quality, method=4)
                count += 1
        print(f"{zoom}단 조각 {4 ** zoom}장", flush=True)
        if zoom:
            image = cv2.resize(image, (image.shape[1] // 2, image.shape[0] // 2), interpolation=cv2.INTER_AREA)
    manifest = {
        "version": VERSION, "count": count, "tileSize": TILE, "minZoom": 0, "maxZoom": MAX_Z,
        "format": "WebP", "quality": args.quality,
        "baseSource": "2026-09-27 tiles-colored (Natural Earth III texture with the 85% colour correction)",
        "heightSource": "NOAA ETOPO1 Ice Surface, grid-registered, 1 arc-minute (public domain)",
        "heightUrl": "https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO1/data/ice_surface/grid_registered/georeferenced_tiff/ETOPO1_Ice_g_geotiff.zip",
        "climateSource": "Peel, Finlayson & McMahon (2007) Koppen-Geiger 0.1 degree raster: desert, tundra and ice-cap cells (CC BY-NC-SA 2.5)",
        "method": "Base picture kept. Mountains tinted brown by their rise above the surrounding lowland with north-west hillshade; "
                  "flat desert plateaus keep their sand colour. Ocean: shelf slightly lighter, trenches darker, the rest as in the base; lakes, rivers, ice and snow untouched.",
    }
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print("끝.", count, "장")


if __name__ == "__main__":
    main()
