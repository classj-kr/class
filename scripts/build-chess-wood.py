"""체스판 칸의 나뭇결 그림 두 장을 만든다(learning/games/chess/assets/images/wood-*.webp).

밝은 칸은 단풍나무(결이 가로), 짙은 칸은 호두나무(결이 세로) — 실제 체스판처럼 칸마다 결이 엇갈린다.
칸은 그림의 4분의 1만 보여 주고(board.css 의 background-size 400%), 칸마다 보여 주는 자리를 달리한다.

    python scripts/build-chess-wood.py
"""
import os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "learning", "games", "chess", "assets", "images")
SIZE = 768


def smooth_noise(rng, w, h, cell_x, cell_y):
    small = rng.random((max(2, h // cell_y), max(2, w // cell_x)))
    return np.asarray(Image.fromarray((small * 255).astype("uint8")).resize((w, h), Image.BICUBIC)).astype(np.float32) / 255


def grain(seed, dark, light, bands):
    rng = np.random.default_rng(seed)
    warp = smooth_noise(rng, SIZE, SIZE, 190, 28)       # 결이 굽이치는 큰 흐름
    fiber = smooth_noise(rng, SIZE, SIZE, 60, 3)        # 가늘고 긴 섬유
    pores = smooth_noise(rng, SIZE, SIZE, 6, 2)         # 잔 구멍
    y = np.arange(SIZE, dtype=np.float32)[:, None] / SIZE
    rings = np.sin(2 * np.pi * bands * y + warp * 7.0)
    v = 0.5 + 0.26 * rings + 0.42 * (fiber - 0.5) + 0.12 * (pores - 0.5)
    v = np.clip(v, 0, 1)[..., None]
    dark, light = np.array(dark, np.float32), np.array(light, np.float32)
    return Image.fromarray((dark + (light - dark) * v).astype("uint8"))


os.makedirs(OUT, exist_ok=True)
maple = grain(7, (201, 154, 98), (241, 216, 172), 9)
walnut = grain(11, (92, 58, 31), (156, 107, 64), 8).transpose(Image.Transpose.ROTATE_90)
for name, image in (("wood-maple", maple), ("wood-walnut", walnut)):
    path = os.path.join(OUT, name + ".webp")
    image.save(path, format="WEBP", quality=84, method=6)
    a = np.asarray(Image.open(path).convert("L"), np.float32)
    print(f"{name}: {os.path.getsize(path) // 1024} KB, 밝기 {a.mean():.0f}, 무늬 {a.std():.1f}")
