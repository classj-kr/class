"""도시 그림 폴더(public/assets/cities/1520) 하나만 쓴다.

ChatGPT 그림을 이 폴더에 도시 이름(artKey)으로 바로 저장하면(보기: lisbon.webp, lisbon.png),
이 도구가 그 자리에서 게임 규격(3:2, 1200x800 WebP)으로 맞춘다. 이미 규격인 그림은 건드리지 않는다.
"""
import json
import sys
from pathlib import Path

from PIL import Image

APP = Path(__file__).resolve().parent.parent
FOLDER = APP / 'public' / 'assets' / 'cities' / '1520'
SIZE = (1200, 800)

cities = json.loads((APP / 'data' / 'catalog' / 'original-cities.json').read_text(encoding='utf-8'))
names = {c['artKey']: c['name'] for c in cities if c.get('artKey') and not c.get('retired')}

FOLDER.mkdir(parents=True, exist_ok=True)
unknown, done = [], []
for src in sorted(FOLDER.iterdir(), key=lambda p: (p.suffix.lower() == '.webp', p.name)):
    if src.suffix.lower() not in ('.png', '.webp', '.jpg', '.jpeg'):
        continue
    key = src.stem.lower()
    if key not in names:
        unknown.append(src.name)
        continue
    out = FOLDER / f'{key}.webp'
    with Image.open(src) as opened:
        if src == out and opened.size == SIZE:
            continue
        im = opened.convert('RGB')
    w, h = im.size
    if w * SIZE[1] > h * SIZE[0]:
        nw = h * SIZE[0] // SIZE[1]
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = w * SIZE[1] // SIZE[0]
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im.resize(SIZE, Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
    if src != out:
        src.unlink()
    done.append(f'{names[key]} ({out.stat().st_size // 1024}KB)')

have = {p.stem for p in FOLDER.glob('*.webp')}
print(f'규격으로 맞춤: {", ".join(done) or "없음"}')
print(f'게임에 들어간 그림: {len(have)}/{len(names)}')
missing = [names[k] for k in names if k not in have]
if missing:
    print(f'아직 없는 곳: {", ".join(missing)}')
if unknown:
    print(f'이름이 도시 목록과 맞지 않는 파일(지우거나 이름을 고칠 것): {", ".join(unknown)}')
    sys.exit(1)
