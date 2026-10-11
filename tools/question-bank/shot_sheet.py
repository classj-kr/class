# 긴 캡처를 가로로 나란히 이어 붙여 한 장으로 본다.  python tools/question-bank/shot_sheet.py <그림> <시작 y> <끝 y> <나눌 수> <나올 이름>
import sys
from PIL import Image
src, y0, y1, n, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
im = Image.open(src).convert('RGB')
y1 = min(y1, im.height)
h = (y1 - y0 + n - 1) // n
sheet = Image.new('RGB', (im.width * n + 8 * (n - 1), h), 'white')
for i in range(n):
    part = im.crop((0, y0 + i * h, im.width, min(y1, y0 + (i + 1) * h)))
    sheet.paste(part, (i * (im.width + 8), 0))
sheet.save(out, 'WEBP', lossless=True)
print(sheet.size)
