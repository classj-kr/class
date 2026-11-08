"""교과 단어 그림 가져오기.

사용자가 만든 그림(png/jpg/webp)을 저장소 밖 E:/webprojects/curriculum-images/<학기>/ 에 넣으면
이름(맨 앞 'kor-4-01' 같은 토막)을 읽어 1280px 폭 WebP로 바꿔
learning/literacy-numeracy/curriculum-vocabulary/images/<학기>/ 에 둔다.
그 뒤 build.mjs 를 다시 돌리면 화면에 붙는다.

python tools/curriculum-vocabulary/import-images.py 5-2
"""
import re
import sys
from pathlib import Path
from PIL import Image

term = sys.argv[1] if len(sys.argv) > 1 else '5-2'
root = Path(__file__).resolve().parents[2]
src = Path('E:/webprojects/curriculum-images') / term
dst = root / 'learning/literacy-numeracy/curriculum-vocabulary/images' / term
dst.mkdir(parents=True, exist_ok=True)
pattern = re.compile(r'^((?:kor|math|soc|sci)-[0-9a-z-]+?-\d{2})(?:\D|$)')
done = 0
for file in sorted(src.glob('*')):
    if file.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
        continue
    match = pattern.match(file.stem)
    if not match:
        print('이름을 못 읽음:', file.name)
        continue
    image = Image.open(file).convert('RGB')
    if image.width > 1280:
        image = image.resize((1280, round(image.height * 1280 / image.width)), Image.LANCZOS)
    out = dst / (match.group(1) + '.webp')
    image.save(out, 'WEBP', quality=82, method=6)
    check = Image.open(out)
    check.load()
    done += 1
    print(f'{file.name} -> {out.name} {check.width}x{check.height} {out.stat().st_size // 1024} KB')
print(f'{done}장')
