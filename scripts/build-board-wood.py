"""판 게임 나무판 그림을 만든다(learning/games/assets/wood/*.webp).

- goban: 바둑·오목·육목·장기. 비자나무처럼 옅은 노란빛에 곧은결(세로). 판 선이 묻히지 않게 무늬는 옅게.
  장기판을 짙게 했다가 "밝아야 보기 좋다"고 해서 같은 그림으로 맞췄다(2026-11-21).
다이아몬드 게임은 원래 플라스틱 판이라 나무로 하지 않는다. 판 하나를 그림 한 장으로 덮는다(background-size: cover). 체스판은 대회용 비닐 판처럼 초록이라 나무로 하지 않는다.

    python scripts/build-board-wood.py
"""
import os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "learning", "games", "assets", "wood")
SIZE = 1280


def smooth_noise(rng, w, h, cell_x, cell_y):
    small = rng.random((max(2, h // cell_y), max(2, w // cell_x)))
    return np.asarray(Image.fromarray((small * 255).astype("uint8")).resize((w, h), Image.BICUBIC)).astype(np.float32) / 255


def straight_grain(seed, dark, light, bands, strength):
    """세로 곧은결: 가는 결이 위아래로 길게 흐르고, 넓은 띠가 살짝 굽이친다."""
    rng = np.random.default_rng(seed)
    warp = smooth_noise(rng, SIZE, SIZE, 30, 260)       # 결이 굽이치는 큰 흐름(세로로 길게)
    fiber = smooth_noise(rng, SIZE, SIZE, 3, 90)        # 가늘고 긴 섬유
    pores = smooth_noise(rng, SIZE, SIZE, 2, 7)         # 잔 구멍
    tone = smooth_noise(rng, SIZE, SIZE, 420, 420)      # 판 전체의 옅은 얼룩
    x = np.arange(SIZE, dtype=np.float32)[None, :] / SIZE
    rings = np.sin(2 * np.pi * bands * x + warp * 5.0)
    v = 0.5 + strength * (0.55 * rings + 0.9 * (fiber - 0.5) + 0.3 * (pores - 0.5)) + 0.18 * (tone - 0.5)
    v = np.clip(v, 0, 1)[..., None]
    dark, light = np.array(dark, np.float32), np.array(light, np.float32)
    return Image.fromarray((dark + (light - dark) * v).astype("uint8"))


os.makedirs(OUT, exist_ok=True)
boards = {
    # 결이 판 선과 같은 세로라 진하거나 가늘면 선 사이사이가 또 다른 선처럼 보여 "정신 사납다"(2026-11-21).
    # 색 폭을 좁히고 띠를 넓게, 결의 세기를 절반 아래로 낮춰 판 선만 또렷하게 한다.
    "goban": straight_grain(3, (206, 157, 84), (228, 182, 108), 12, 0.2),
}
for name, image in boards.items():
    path = os.path.join(OUT, name + ".webp")
    image.save(path, format="WEBP", quality=82, method=6)
    a = np.asarray(Image.open(path).convert("L"), np.float32)
    print(f"{name}: {os.path.getsize(path) // 1024} KB, 밝기 {a.mean():.0f}, 무늬 {a.std():.1f}")
