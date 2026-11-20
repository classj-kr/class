"""학급 대시보드 글씨 상자용 요일 그림(<요일>-box.webp)을 만든다.

요일 그림은 왼쪽 위가 밝고 오른쪽 아래로 갈수록 거의 검게 어두워진다. 글씨 상자는 바탕 그림을
제자리에 비춰 보여 주는데(background-attachment: fixed), 오른쪽 아래에 놓인 상자(달력·급식)는
나무결이 묻혀 안 보였다. 상자용 그림은 둘레 밝기(크게 흐린 그림)로 나눠 어둑한 가장자리를 걷어 내고,
나무결을 어디서나 같은 진하기로 남긴다. 바탕은 원래 그림 그대로 쓴다.

    python scripts/build-dashboard-box-panels.py
"""
import os
import numpy as np
from PIL import Image, ImageFilter

FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "apps", "classtools", "assets", "dashboard-panels")
TARGET = 46.0  # 상자 밝기(0~255): 예보 줄 둘레 밝기와 비슷하게. 그 위에 CSS가 30% 어둡게 덮는다.
GAIN_LIMIT = 6.0  # 아주 검은 곳의 잡티가 튀지 않게 키우는 배수를 막는다.

for day in ["monday", "tuesday", "wednesday", "thursday", "friday"]:
    src = Image.open(os.path.join(FOLDER, day + ".webp")).convert("RGB")
    rgb = np.asarray(src).astype(np.float32)
    lum = np.asarray(src.convert("L").filter(ImageFilter.GaussianBlur(radius=src.width / 14))).astype(np.float32)
    gain = np.clip(TARGET / np.maximum(lum, 1.0), 0.0, GAIN_LIMIT)
    out = np.clip(rgb * gain[..., None], 0, 255).astype(np.uint8)
    path = os.path.join(FOLDER, day + "-box.webp")
    Image.fromarray(out).save(path, format="WEBP", quality=82, method=6)
    check = np.asarray(Image.open(path).convert("L")).astype(np.float32)
    h, w = check.shape
    cells = [check[y * h // 3:(y + 1) * h // 3, x * w // 4:(x + 1) * w // 4] for y in range(3) for x in range(4)]
    print(f"{day:10s} {os.path.getsize(path) / 1024:6.0f} KB  밝기 {min(c.mean() for c in cells):5.1f}~{max(c.mean() for c in cells):5.1f}"
          f"  무늬 {min(c.std() for c in cells):4.1f}~{max(c.std() for c in cells):4.1f}")
