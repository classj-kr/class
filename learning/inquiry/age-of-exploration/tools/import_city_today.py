"""도시 오늘날 사진 폴더(public/assets/city-today) 하나만 쓴다.

사진을 이 폴더에 바로 넣으면(jpg·png·webp) 그 자리에서 게임 규격(3:2, 1200x800 WebP)으로 맞추고 원래 파일은 지운다.
파일 이름은 original-cities.json 의 artKey 와 같아야 한다(보기: mexico-city.jpg).
사진은 마음대로 써도 되는 것만 쓴다. 출처와 이용 조건은 data/catalog 의 credits 파일(city-photo-credits.json, photo-credits.json)에 적는다.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter

APP = Path(__file__).resolve().parent.parent
TARGET = APP / 'public' / 'assets' / 'city-today'
SOURCE = TARGET
SIZE = (1200, 800)

cities = json.loads((APP / 'data' / 'catalog' / 'original-cities.json').read_text(encoding='utf-8'))
names = {c['artKey']: c['name'] for c in cities if c.get('artKey') and not c.get('retired')}
names_all = dict(names)

TARGET.mkdir(parents=True, exist_ok=True)
unknown, done = [], []
for src in sorted(SOURCE.iterdir(), key=lambda p: (p.suffix.lower() == '.webp', p.name)):
    if src.suffix.lower() not in ('.png', '.webp', '.jpg', '.jpeg'):
        continue
    key = src.stem.lower()
    if key not in names_all:
        unknown.append(src.name)
        continue
    out = TARGET / f'{key}.webp'
    with Image.open(src) as opened:
        if src == out and opened.size == SIZE:
            continue
        im = opened.convert('RGB')
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
    if src != out:
        src.unlink()
    done.append(f'{names_all[key]} ({out.stat().st_size // 1024}KB)')

have = {p.stem for p in TARGET.glob('*.webp')}
missing = [names[k] for k in names if k not in have]
print(f'규격으로 맞춤: {", ".join(done) or "없음"}')
print(f'게임에 들어간 사진: {len(have)}/{len(names)}')
if missing:
    print(f'아직 없는 곳 {len(missing)}: {", ".join(missing[:8])}{" …" if len(missing) > 8 else ""}')
if unknown:
    print(f'이름이 명소 목록과 맞지 않는 파일: {", ".join(unknown)}')
    sys.exit(1)
