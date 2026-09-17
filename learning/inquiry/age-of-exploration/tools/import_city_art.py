"""references/city-art 의 도시 그림을 게임용 3:2 WebP로 바꿔 public/assets/cities/1520 에 넣는다."""
import json
import sys
from pathlib import Path

from PIL import Image

APP = Path(__file__).resolve().parent.parent
SOURCE = APP.parents[2] / 'references' / 'city-art'
TARGET = APP / 'public' / 'assets' / 'cities' / '1520'
SIZE = (1200, 800)

cities = json.loads((APP / 'data' / 'catalog' / 'original-cities.json').read_text(encoding='utf-8'))
names = {c['artKey']: c['name'] for c in cities if c.get('artKey') and not c.get('retired')}

TARGET.mkdir(parents=True, exist_ok=True)
unknown, done = [], []
for src in sorted(SOURCE.iterdir()):
    if src.suffix.lower() not in ('.png', '.webp', '.jpg', '.jpeg'):
        continue
    key = src.stem.lower()
    if key not in names:
        unknown.append(src.name)
        continue
    out = TARGET / f'{key}.webp'
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        continue
    im = Image.open(src).convert('RGB')
    w, h = im.size
    if w * SIZE[1] > h * SIZE[0]:
        nw = h * SIZE[0] // SIZE[1]
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = w * SIZE[1] // SIZE[0]
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im.resize(SIZE, Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
    done.append(f'{names[key]} ({out.stat().st_size // 1024}KB)')

have = {p.stem for p in TARGET.glob('*.webp')}
print(f'새로 넣음: {", ".join(done) or "없음"}')
print(f'게임에 들어간 그림: {len(have)}/{len(names)}')
if unknown:
    print(f'이름이 명세표와 맞지 않는 파일: {", ".join(unknown)}')
    sys.exit(1)
