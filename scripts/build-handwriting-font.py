"""Build the original ClassJ pen font from its shared stroke source.

Requires fonttools and brotli. No external font is read, traced or modified.
Usage: python scripts/build-handwriting-font.py [--preview outputs/handwriting/font-proof.webp]
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'learning/literacy-numeracy/handwriting/font-source.js'
FAMILY = 'ClassJ Gyeongpil Myeongjo'
SAMPLES = ['가나다라마바사아자차카타파하', '아야어여오요우유으이',
           '학교 친구 연필 책가방', '나무 바다 하늘 꽃 구름',
           '나는 나를 믿어요', '값 넋 앉 닭 삶 읽 밟 읊 괜 쐐',
           'ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ']
COMPARISON = '디자인 열정을 디지털 폰트로 꽃 피우다 한글 정각 간 갈 감 강 꽃 닭 읽 읊'


def records(specimen=False):
    program = """
const F=require(process.argv[1]);
const cps=process.argv[2]==='all'?new Set([...Array.from({length:11172},(_,i)=>0xac00+i),...Array.from({length:51},(_,i)=>0x3131+i)]):new Set(Array.from(JSON.parse(process.argv[2]),c=>c.codePointAt(0)));
for(const cp of cps){const p=F.model(String.fromCodePoint(cp));if(p)process.stdout.write(JSON.stringify([cp,p.flatMap(F.outlines)])+'\\n');}
"""
    scope = json.dumps(''.join(SAMPLES)+COMPARISON, ensure_ascii=True) if specimen else 'all'
    proc = subprocess.Popen(['node', '-e', program, str(SOURCE), scope], stdout=subprocess.PIPE, text=True, encoding='utf-8')
    assert proc.stdout is not None
    for line in proc.stdout:
        yield json.loads(line)
    if proc.wait() != 0:
        raise RuntimeError('Stroke source did not compile.')


def glyph(contours):
    pen = TTGlyphPen(None)
    for contour in contours:
        points = [(round(x * 10), round(800 - y * 10)) for x, y in contour]
        # Rounding is at 1/1000 em. Consecutive identical points add no geometry.
        points = [p for i, p in enumerate(points) if not i or p != points[i - 1]]
        if len(set(points)) < 3:
            continue
        pen.moveTo(points[0])
        for point in points[1:]:
            pen.lineTo(point)
        pen.closePath()
    return pen.glyph()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT / 'assets/fonts/classj-gyeongpil')
    parser.add_argument('--preview', type=Path)
    parser.add_argument('--specimen-only', action='store_true')
    args = parser.parse_args()
    source_hash = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    args.output.mkdir(parents=True, exist_ok=True)
    empty = glyph([])
    glyphs = {'.notdef': empty, 'space': empty}
    cmap = {32: 'space', 0x3000: 'space'}
    metrics = {'.notdef': (920, 0), 'space': (460, 0)}
    for cp, contours in records(args.specimen_only):
        name = f'uni{cp:04X}'
        glyphs[name] = glyph(contours)
        cmap[cp] = name
        metrics[name] = (920, 0)
    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder(list(glyphs))
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    for name, g in glyphs.items():
        if g.numberOfContours:
            metrics[name] = (920, g.xMin)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=800, descent=-200, lineGap=0)
    fb.setupNameTable({
        'familyName': {'en': FAMILY, 'ko': '클래스제이 경필명조'},
        'styleName': 'Regular',
        'uniqueFontIdentifier': 'ClassJ-GyeongpilMyeongjo-0.8',
        'fullName': FAMILY + ' Regular',
        'psName': 'ClassJGyeongpilMyeongjo-Regular',
        'version': 'Version 0.800',
        'copyright': 'Original ClassJ lettering, 2026.',
        'designer': 'ClassJ',
        'description': 'Original pen lettering for Hangul practice. Glyphs and stroke-order models share the same source. No third-party font outlines.',
    })
    fb.setupOS2(sTypoAscender=800, sTypoDescender=-200, sTypoLineGap=0,
                usWinAscent=800, usWinDescent=200, usWeightClass=400,
                fsType=0, fsSelection=64, sCapHeight=750)
    fb.setupPost()
    fb.setupMaxp()
    fb.font.recalcTimestamp = False
    timestamp = int(datetime(2026, 10, 28, tzinfo=timezone.utc).timestamp()) + 2082844800
    fb.font['head'].created = fb.font['head'].modified = timestamp
    ttf = args.output / 'ClassJGyeongpilMyeongjo-Regular.ttf'
    woff = args.output / 'ClassJGyeongpilMyeongjo-Regular.woff2'
    fb.save(ttf)
    print('TTF built', flush=True)
    font = TTFont(ttf, recalcTimestamp=False)
    font.flavor = 'woff2'
    font.save(woff)
    print('WOFF2 built', flush=True)
    # Reopen both deliverables: cmap, metrics, curves and bounds must survive encoding.
    for file in [ttf, woff]:
        f = TTFont(file)
        mapping = f.getBestCmap()
        if not args.specimen_only:
            assert all(cp in mapping for cp in range(0xac00, 0xd7a4))
            assert all(cp in mapping for cp in range(0x3131, 0x3164))
        assert f['head'].unitsPerEm == 1000 and f['OS/2'].fsType == 0
        # The TTF validates every glyph. WOFF2 also checks representative glyphs
        # after its full round trip; cmap coverage is checked exhaustively above.
        check_points = [cp for cp in mapping if cp not in [32,0x3000]] if args.specimen_only or file == ttf else [0xac00, 0xb098, 0xb2e4, 0xd55c, 0xae00, 0xd7a3]
        for cp in check_points:
            g = f['glyf'][mapping[cp]]
            assert g.numberOfContours > 0
            assert 0 <= g.xMin < g.xMax <= 1000 and -180 <= g.yMin < g.yMax <= 800, (hex(cp),g.xMin,g.yMin,g.xMax,g.yMax)
        f.close()
    print('Font tables verified', flush=True)
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == source_hash, 'Font source changed during the build; rebuild before publishing.'
    manifest = {'family': FAMILY, 'version': '0.800', 'hangulSyllables': sum(0xac00<=cp<=0xd7a3 for cp in cmap),
                'compatibilityJamo': sum(0x3131<=cp<=0x3163 for cp in cmap), 'sourceSha256': source_hash,
                'ttfBytes': ttf.stat().st_size, 'woff2Bytes': woff.stat().st_size}
    (args.output / 'font-manifest.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
    if args.preview:
        from PIL import Image, ImageDraw, ImageFont
        lines = SAMPLES
        image = Image.new('RGB', (1500, 960), '#fffefa')
        d = ImageDraw.Draw(image)
        face = ImageFont.truetype(str(ttf), 96, layout_engine=ImageFont.Layout.BASIC)
        for i, line in enumerate(lines):
            y = 30 + i*130
            line_face = face
            width = d.textlength(line, font=line_face)
            if width > image.width - 76:
                line_face = ImageFont.truetype(str(ttf), int(96*(image.width-76)/width), layout_engine=ImageFont.Layout.BASIC)
            d.text((38,y), line, font=line_face, fill='#27362f')
            d.line((38,y+109,1460,y+109), fill='#e9eae2')
        args.preview.parent.mkdir(parents=True, exist_ok=True)
        image.save(args.preview, lossless=True)
        decoded = Image.open(args.preview).convert('RGB')
        assert image.size == decoded.size and image.tobytes() == decoded.tobytes()
    print(json.dumps(manifest))


if __name__ == '__main__':
    main()
