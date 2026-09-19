"""나라 이름표 앞에 붙일 국기를 그림 한 장(data/flags.png)과 자리표(data/flags.json)로 묶는다.

    node tools/build_labels.mjs   # 먼저: 어느 나라에 국기를 달지 정한다
    python tools/build_flags.py

국기 그림은 만들 때만 flagcdn.com(Flagpedia, 공개 자료)에서 받고, 사이트는 묶은 그림만 쓴다.
화면 높이 14픽셀에 맞춰 두 배(28픽셀)로 그리고, 흰 국기도 보이도록 모양을 따라 어두운 테두리를 두른다.
"""

import json
import pathlib
import re
import tempfile
import urllib.request

from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[1]
CACHE = pathlib.Path(tempfile.gettempdir()) / "globe-flags"
HEIGHT = 28  # 화면 14픽셀의 두 배
BORDER = 2   # 화면 1픽셀
SHEET_WIDTH = 1024
GAP = 2


def flag_codes():
    source = (ROOT / "data/globe-data.js").read_text(encoding="utf-8")
    return sorted(set(re.findall(r'"flag":"([a-z]{2})"', source)))


def download(code):
    CACHE.mkdir(parents=True, exist_ok=True)
    file = CACHE / f"{code}.png"
    if not file.exists():
        request = urllib.request.Request(f"https://flagcdn.com/h80/{code}.png", headers={"User-Agent": "Mozilla/5.0"})
        file.write_bytes(urllib.request.urlopen(request).read())
    return Image.open(file).convert("RGBA")


def framed(flag):
    width = round(flag.width * HEIGHT / flag.height)
    flag = flag.resize((width, HEIGHT), Image.LANCZOS)
    canvas = Image.new("RGBA", (width + BORDER * 2, HEIGHT + BORDER * 2), (0, 0, 0, 0))
    canvas.paste(flag, (BORDER, BORDER), flag)
    # 네팔처럼 네모가 아닌 국기도 모양을 따라 테두리가 생기도록 투명도를 넓혀 테를 만든다.
    outline = canvas.getchannel("A").filter(ImageFilter.MaxFilter(BORDER * 2 + 1))
    frame = Image.new("RGBA", canvas.size, (15, 20, 28, 220))
    frame.putalpha(outline.point(lambda a: 220 if a > 0 else 0))
    frame.alpha_composite(canvas)
    return frame


def main():
    codes = flag_codes()
    images = {code: framed(download(code)) for code in codes}
    placements = {}
    x = y = 0
    row_height = HEIGHT + BORDER * 2
    for code in codes:
        image = images[code]
        if x + image.width > SHEET_WIDTH:
            x = 0
            y += row_height + GAP
        placements[code] = {"x": x, "y": y, "width": image.width, "height": image.height, "pixelRatio": 2}
        x += image.width + GAP
    sheet = Image.new("RGBA", (SHEET_WIDTH, y + row_height), (0, 0, 0, 0))
    for code, place in placements.items():
        sheet.paste(images[code], (place["x"], place["y"]))
    sheet.save(ROOT / "data/flags.png", optimize=True)
    (ROOT / "data/flags.json").write_text(json.dumps(placements, separators=(",", ":")), encoding="utf-8")
    size = (ROOT / "data/flags.png").stat().st_size
    print(f"국기 {len(codes)}개, 그림 {sheet.width}×{sheet.height}, {size / 1024:.0f}KB")


if __name__ == "__main__":
    main()
