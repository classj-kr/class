"""Natural Earth III 바탕 그림을 지구본용 지도 조각으로 자른다.

원본은 위도·경도를 그대로 편 그림(가로 16,200 × 세로 8,100)이고,
지구본 프로그램은 메르카토르 조각을 받는다. 가로는 경도가 그대로 이어지므로
늘이기만 하면 되고, 세로만 위도에 맞춰 원본 줄을 골라 섞는다.

    python tools/build_tiles.py

가장 큰 단(5단)은 32×32장, 512픽셀 조각이라 가로가 16,384픽셀로 원본과 거의 같다.
그 아래 단은 위 단을 반씩 줄여 만든다.
"""

import json
import math
import pathlib
import tempfile
import urllib.request

import numpy as np
from PIL import Image, ImageDraw

Image.MAX_IMAGE_PIXELS = None

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "age-of-exploration/public/assets/maps/natural-earth-v58/source/3_no_ice_clouds_16k.jpg"
OUT = ROOT / "tiles"
TILE = 512
MAX_Z = 5
QUALITY = 82
OCEAN = (0, 95, 153)  # 원본 그림의 깊은 바다색
NE_BASE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"
# 지구본 조각은 메르카토르라 위도 85.05도에서 끝나고, 그 너머 극 둘레는 마지막 한 줄을 늘려 붙인다.
POLE_LAT = 85.05
POLE_BLEND_FROM = 82.5


def ne_features(name):
    cache = pathlib.Path(tempfile.gettempdir()) / "globe-natural-earth" / f"{name}.geojson"
    if not cache.exists():
        cache.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(f"{NE_BASE}{name}.geojson", cache)
    return json.loads(cache.read_text(encoding="utf-8"))["features"]


def land_mask(width, height):
    """Natural Earth 육지·남극 빙붕 다각형을 원본 그림 크기로 칠한 판(육지 True)."""
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    to_px = lambda lng, lat: ((lng + 180) / 360 * width, (90 - lat) / 180 * height)
    for name in ["ne_10m_land", "ne_10m_antarctic_ice_shelves_polys"]:
        for feature in ne_features(name):
            geometry = feature["geometry"]
            polygons = [geometry["coordinates"]] if geometry["type"] == "Polygon" else geometry["coordinates"]
            for polygon in polygons:
                draw.polygon([to_px(*point) for point in polygon[0]], fill=255)
                for hole in polygon[1:]:
                    draw.polygon([to_px(*point) for point in hole], fill=0)
    return np.asarray(mask) > 0


def flatten_shallow_water(image):
    """얕은 바다·해안 번짐을 깊은 바다색 하나로 칠한다.

    원본은 얕은 바다(바하마 둑, 대륙붕, 산호초)를 연한 옥색과 바닥 무늬로 그려
    거친 해상도에서 흐릿한 육지처럼 보인다. 푸른 기가 강한 점 가운데 육지 다각형 밖의 것만 바꾼다.
    육지 안(남극 얼음 그늘 등)은 건드리지 않는다.
    """
    pixels = np.asarray(image).copy()
    r, g, b = (pixels[..., i].astype(np.int16) for i in range(3))
    watery = (b > r + 40) & (b > g + 8) & (r < 130)
    water = watery & ~land_mask(image.width, image.height)
    pixels[water] = OCEAN
    return Image.fromarray(pixels)


def even_out_south_pole(image):
    """남위 82.5~85.05도를 그 띠의 평균색(남극 고원 얼음)으로 서서히 바꾼다.

    마지막 줄이 한 가지 색이어야 극 둘레에 부채꼴 줄무늬가 생기지 않는다.
    북극 쪽 마지막 줄은 북극해라 이미 바다색 하나다(북쪽 끝 땅은 83.7도).
    """
    pixels = np.asarray(image).astype(np.float32)
    height = pixels.shape[0]
    south = -(90 - (np.arange(height) + 0.5) / height * 180)
    target = pixels[(south >= POLE_BLEND_FROM) & (south <= POLE_LAT)].reshape(-1, 3).mean(axis=0)
    # 조각의 마지막 줄이 원본 두 줄 사이를 섞어 만들어지므로 조금 앞에서 이미 한 색이 되게 한다.
    t = np.clip((south - POLE_BLEND_FROM) / (POLE_LAT - 0.35 - POLE_BLEND_FROM), 0, 1)
    t = (t * t * (3 - 2 * t))[:, None, None]
    pixels = pixels * (1 - t) + target * t
    return Image.fromarray(np.clip(pixels + 0.5, 0, 255).astype(np.uint8))


def save_tile(image, z, x, y):
    folder = OUT / str(z) / str(x)
    folder.mkdir(parents=True, exist_ok=True)
    image.save(folder / f"{y}.webp", "WEBP", quality=QUALITY, method=6)


def cut_band(band, z, row):
    for x in range(band.width // TILE):
        save_tile(band.crop((x * TILE, 0, (x + 1) * TILE, TILE)), z, x, row)


def main():
    source = even_out_south_pole(flatten_shallow_water(Image.open(SOURCE).convert("RGB")))
    size = TILE * 2 ** MAX_Z
    # 가로: 경도 0~360을 그대로 size 픽셀로 늘인다.
    wide = np.asarray(source.resize((size, source.height), Image.LANCZOS), dtype=np.float32)
    rows = wide.shape[0]

    lower = np.zeros((size // 2, size // 2, 3), dtype=np.float32)
    for band_row in range(2 ** MAX_Z):
        py = np.arange(band_row * TILE, (band_row + 1) * TILE) + 0.5
        lat = np.degrees(np.arctan(np.sinh(math.pi * (1 - 2 * py / size))))
        sy = np.clip((90 - lat) / 180 * rows - 0.5, 0, rows - 1)
        top = np.floor(sy).astype(int)
        bottom = np.minimum(top + 1, rows - 1)
        weight = (sy - top)[:, None, None]
        band = wide[top] * (1 - weight) + wide[bottom] * weight
        cut_band(Image.fromarray(np.clip(band + 0.5, 0, 255).astype(np.uint8)), MAX_Z, band_row)
        half = band.reshape(TILE // 2, 2, size // 2, 2, 3).mean(axis=(1, 3))
        lower[band_row * TILE // 2:(band_row + 1) * TILE // 2] = half
        print(f"{MAX_Z}단 {band_row + 1}/{2 ** MAX_Z}", flush=True)

    mosaic = Image.fromarray(np.clip(lower + 0.5, 0, 255).astype(np.uint8))
    for z in range(MAX_Z - 1, -1, -1):
        for row in range(2 ** z):
            cut_band(mosaic.crop((0, row * TILE, mosaic.width, (row + 1) * TILE)), z, row)
        print(f"{z}단 완료", flush=True)
        if z:
            mosaic = mosaic.resize((mosaic.width // 2, mosaic.height // 2), Image.LANCZOS)


if __name__ == "__main__":
    main()
