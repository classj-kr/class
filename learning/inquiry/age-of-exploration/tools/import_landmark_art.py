"""art-source/landmark-art 의 명소 사진을 게임용 3:2 WebP로 바꿔 public/assets/landmarks 에 넣는다.

파일 이름은 city-landmarks.json 의 id 와 같아야 한다(보기: lm-belem-tower.jpg).
사진은 마음대로 써도 되는 것만 쓴다. 출처와 이용 조건은 credits.json 에 적어 둔다.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter

APP = Path(__file__).resolve().parent.parent
SOURCE = APP / 'art-source' / 'landmark-art'
TARGET = APP / 'public' / 'assets' / 'landmarks'
SIZE = (1200, 800)

landmarks = json.loads((APP / 'data' / 'catalog' / 'city-landmarks.json').read_text(encoding='utf-8'))
discoveries = json.loads((APP / 'data' / 'catalog' / 'discoveries.json').read_text(encoding='utf-8'))
sea_animals = json.loads((APP / 'data' / 'catalog' / 'sea-animals.json').read_text(encoding='utf-8'))
names = {item['id']: item['name'] for item in landmarks}
names.update({item['id']: item['animal'] for item in sea_animals})
# 지도 위 발견 지점도 같은 폴더에 사진을 둘 수 있다. 다만 없다고 빠진 것으로 세지는 않는다.
optional = {item['id']: item['name'] for item in discoveries}
names_all = {**optional, **names}

TARGET.mkdir(parents=True, exist_ok=True)
if not SOURCE.exists():
    print(f'사진 폴더가 없습니다: {SOURCE}')
    sys.exit(1)

unknown, done = [], []
for src in sorted(SOURCE.iterdir()):
    if src.suffix.lower() not in ('.png', '.webp', '.jpg', '.jpeg'):
        continue
    key = src.stem.lower()
    if key not in names_all:
        unknown.append(src.name)
        continue
    out = TARGET / f'{key}.webp'
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        continue
    im = Image.open(src).convert('RGB')
    w, h = im.size
    if w / h < 1.2:
        # 탑이나 첨탑처럼 세로로 긴 사진은 잘라 내면 꼭대기나 밑동이 날아간다.
        # 사진을 통째로 담고, 남는 자리는 같은 사진을 흐리게 깔아 메운다.
        back = im.resize(SIZE, Image.LANCZOS).filter(ImageFilter.GaussianBlur(28))
        back = Image.blend(back, Image.new('RGB', SIZE, (10, 20, 26)), 0.35)
        scale = min(SIZE[0] / w, SIZE[1] / h)
        front = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
        back.paste(front, ((SIZE[0] - front.width) // 2, (SIZE[1] - front.height) // 2))
        canvas = back
    else:
        if w * SIZE[1] > h * SIZE[0]:
            nw = h * SIZE[0] // SIZE[1]
            im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else:
            nh = w * SIZE[1] // SIZE[0]
            top = (h - nh) // 3
            im = im.crop((0, top, w, top + nh))
        canvas = im.resize(SIZE, Image.LANCZOS)
    canvas.save(out, 'WEBP', quality=82, method=6)
    done.append(f'{names_all[key]} ({out.stat().st_size // 1024}KB)')

have = {p.stem for p in TARGET.glob('*.webp')}
missing = [names[k] for k in names if k not in have]
print(f'새로 넣음: {", ".join(done) or "없음"}')
print(f'게임에 들어간 사진: {len(have)}/{len(names)}')
if missing:
    print(f'아직 없는 곳 {len(missing)}: {", ".join(missing[:8])}{" …" if len(missing) > 8 else ""}')
if unknown:
    print(f'이름이 명소 목록과 맞지 않는 파일: {", ".join(unknown)}')
    sys.exit(1)
