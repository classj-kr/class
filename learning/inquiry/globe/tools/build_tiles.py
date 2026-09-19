"""Natural Earth III 바탕 그림을 지구본용 지도 조각으로 자른다.

원본은 위도·경도를 그대로 편 그림(가로 16,200 × 세로 8,100)이고,
지구본 프로그램은 메르카토르 조각을 받는다. 가로는 경도가 그대로 이어지므로
늘이기만 하면 되고, 세로만 위도에 맞춰 원본 줄을 골라 섞는다.

    python tools/build_tiles.py

가장 큰 단(5단)은 32×32장, 512픽셀 조각이라 가로가 16,384픽셀로 원본과 거의 같다.
그 아래 단은 위 단을 반씩 줄여 만든다.
"""

import math
import pathlib

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "age-of-exploration/public/assets/maps/natural-earth-v58/source/3_no_ice_clouds_16k.jpg"
OUT = ROOT / "tiles"
TILE = 512
MAX_Z = 5
QUALITY = 82


def save_tile(image, z, x, y):
    folder = OUT / str(z) / str(x)
    folder.mkdir(parents=True, exist_ok=True)
    image.save(folder / f"{y}.webp", "WEBP", quality=QUALITY, method=6)


def cut_band(band, z, row):
    for x in range(band.width // TILE):
        save_tile(band.crop((x * TILE, 0, (x + 1) * TILE, TILE)), z, x, row)


def main():
    source = Image.open(SOURCE).convert("RGB")
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
