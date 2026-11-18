"""받아쓰기 그림 가져오기.

ChatGPT가 그린 12칸 그림을 E:/webprojects/dictation-images/<학기>/ 에 넣고 돌리면
칸마다 잘라 learning/literacy-numeracy/dictation/pics/ 에 WebP로 두고 pics.js 를 다시 쓴다.

python tools/dictation/import-images.py 1-1
"""
import hashlib
import json
import re
import sys
import zlib
from pathlib import Path

from PIL import Image, ImageChops

COLS, ROWS, SIZE = 4, 3, (360, 270)
root = Path(__file__).resolve().parents[2]
app = root / 'learning/literacy-numeracy/dictation'
out = app / 'pics'
sheets = json.loads((root / 'tools/dictation/sheets.json').read_text(encoding='utf-8'))
name_of = lambda text: hashlib.sha1(text.encode('utf-8')).hexdigest()[:10]


def lines(dark, length, count):
    """칸을 나누는 검은 선 자리를 찾는다. 뚜렷한 선이 없으면 똑같이 나눈 자리를 쓴다."""
    cuts = [0]
    reach = int(length * 0.05)
    for k in range(1, count):
        want = round(k * length / count)
        low, high = max(0, want - reach), min(length, want + reach)
        best = max(range(low, high), key=lambda i: dark[i])
        cuts.append(best if dark[best] > 0.45 else want)
    return cuts + [length]


def split(image):
    gray = image.convert('L').point(lambda v: 255 if v < 110 else 0)
    w, h = gray.size
    columns = [v / 255 for v in gray.resize((w, 1), Image.BOX).tobytes()]
    rows = [v / 255 for v in gray.resize((1, h), Image.BOX).tobytes()]
    xs, ys = lines(columns, w, COLS), lines(rows, h, ROWS)
    for r in range(ROWS):
        for c in range(COLS):
            mx, my = int((xs[c + 1] - xs[c]) * 0.035), int((ys[r + 1] - ys[r]) * 0.035)
            yield image.crop((xs[c] + mx, ys[r] + my, xs[c + 1] - mx, ys[r + 1] - my))


def tidy(cell):
    """둘레 흰 곳을 걷어 내고 4:3 흰 바탕 가운데에 놓는다. 빈 칸이면 None."""
    white = Image.new('RGB', cell.size, 'white')
    box = ImageChops.difference(cell, white).convert('L').point(lambda v: 255 if v > 28 else 0).getbbox()
    if not box or (box[2] - box[0]) * (box[3] - box[1]) < cell.width * cell.height * 0.02:
        return None
    part = cell.crop(box)
    room = (SIZE[0] - 24, SIZE[1] - 20)
    scale = min(room[0] / part.width, room[1] / part.height)
    part = part.resize((max(1, round(part.width * scale)), max(1, round(part.height * scale))), Image.LANCZOS)
    canvas = Image.new('RGB', SIZE, 'white')
    canvas.paste(part, ((SIZE[0] - part.width) // 2, (SIZE[1] - part.height) // 2))
    return canvas


def write_index():
    table = {}
    for items in sheets.values():
        for text in items:
            file = out / f'{name_of(text)}.webp'
            if file.exists():
                table[text] = f'{file.name}?v={zlib.crc32(file.read_bytes()):08x}'
    body = ',\n'.join(f'  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v)}' for k, v in table.items())
    head = '// tools/dictation/import-images.py 가 만든다. 문항 → 그림 파일.\n'
    (app / 'pics.js').write_text(f'{head}window.DICTATION_PICS = {{\n{body}\n}};\n', encoding='utf-8')
    return len(table)


term = sys.argv[1] if len(sys.argv) > 1 else '1-1'
source = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('E:/webprojects/dictation-images') / term
out.mkdir(exist_ok=True)
pattern = re.compile(rf'^({re.escape(term)}-\d{{2,3}})(?:\D|$)')
saved = 0
for file in sorted(source.glob('*')):
    if file.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
        continue
    match = pattern.match(file.stem)
    items = sheets.get(match[1]) if match else None
    if not items:
        print('이름을 못 읽음:', file.name)
        continue
    cells = list(split(Image.open(file).convert('RGB')))
    for i, text in enumerate(items):
        picture = tidy(cells[i])
        if picture is None:
            print('빈 칸:', match[1], i + 1, text)
            continue
        picture.save(out / f'{name_of(text)}.webp', 'WEBP', quality=78, method=6)
        saved += 1
print('잘라 넣은 칸', saved, '| 화면에 붙은 그림', write_index())
