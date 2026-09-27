"""한자성어 앱에 쓰이는 한자만 Klee One에서 떼어 woff2로 만든다.

원본 KleeOne-SemiBold.ttf 는 8.9MB라 학교 무선망에서 한참 걸리고, 그동안 한자가
바탕체로 보인다. 앱 자료에 나오는 한자만 담으면 수백 KB로 줄어든다.

styles.css 의 작은 글꼴 줄(unicode-range)도 함께 고친다. 자료에 새 한자가 들어왔는데
이 스크립트를 다시 돌리지 않았으면, 그 글자만 원본 TTF 줄에서 받아 쓰므로 깨지지는 않는다.

    python scripts/build_idioms_hanja_font.py
"""
import re
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "learning/literacy-numeracy/classical-chinese-idioms"
SOURCE_FONT = ROOT / "assets/fonts/klee-one/KleeOne-SemiBold.ttf"
OUTPUT_FONT = APP / "assets/fonts/klee-hanja-idioms.woff2"
STYLES = APP / "styles.css"
TEXT_SOURCES = [APP / "idioms-data.js", APP / "idioms-lessons-data.js", APP / "index.html", APP / "app.js"]


def is_ideograph(ch):
    code = ord(ch)
    return 0x3400 <= code <= 0x4DBF or 0x4E00 <= code <= 0x9FFF or 0xF900 <= code <= 0xFAFF


def unicode_range(codes):
    parts, start = [], None
    for index, code in enumerate(codes):
        if start is None:
            start = code
        if index + 1 == len(codes) or codes[index + 1] != code + 1:
            parts.append(f"U+{start:X}" if start == code else f"U+{start:X}-{code:X}")
            start = None
    return ", ".join(parts)


def main():
    text = "".join(path.read_text(encoding="utf-8") for path in TEXT_SOURCES)
    wanted = sorted({ord(ch) for ch in text if is_ideograph(ch)})
    cmap = TTFont(SOURCE_FONT).getBestCmap()
    missing = [chr(code) for code in wanted if code not in cmap]
    if missing:
        raise SystemExit(f"Klee One에 없는 한자: {''.join(missing)}")

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    font = subset.load_font(str(SOURCE_FONT), options)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=wanted)
    subsetter.subset(font)
    OUTPUT_FONT.parent.mkdir(parents=True, exist_ok=True)
    subset.save_font(font, str(OUTPUT_FONT), options)

    css = STYLES.read_text(encoding="utf-8")
    pattern = re.compile(r'(src: url\("assets/fonts/klee-hanja-idioms\.woff2[^"]*"\) format\("woff2"\);\s*unicode-range: )[^;]+;')
    if not pattern.search(css):
        raise SystemExit("styles.css 에서 klee-hanja-idioms.woff2 글꼴 줄을 찾지 못했습니다.")
    STYLES.write_text(pattern.sub(lambda m: m.group(1) + unicode_range(wanted) + ";", css), encoding="utf-8")

    print(f"{len(wanted)}자, {OUTPUT_FONT.stat().st_size / 1024:.0f}KB -> {OUTPUT_FONT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
