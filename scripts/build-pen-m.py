"""Build the isolated, original ClassJ Pen M experiment (no reference font input)."""
from __future__ import annotations
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
from fontTools.fontBuilder import FontBuilder
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('base_builder', ROOT / 'scripts/build-handwriting-font.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--specimen-only', action='store_true')
    p.add_argument('--chars', default='')
    p.add_argument('--ttf-only', action='store_true', help='Fast local proof build; omit WOFF2')
    p.add_argument('--brotli-quality', type=int, choices=range(12), default=9,
                   help='Lossless WOFF2 compression effort; does not change glyphs')
    p.add_argument('--output', type=Path, default=ROOT / 'assets/fonts/classj-pen-m')
    args = p.parse_args()
    base.SOURCE = ROOT / 'assets/fonts/classj-pen-m/source.js'
    source_hash = hashlib.sha256(base.SOURCE.read_bytes()).hexdigest()
    args.output.mkdir(parents=True, exist_ok=True)
    glyphs = {'.notdef': base.glyph([]), 'space': base.glyph([])}
    cmap = {32: 'space', 0x3000: 'space'}
    metrics = {'.notdef': (920, 0), 'space': (460, 0)}
    for cp, contours in base.records(args.specimen_only, args.chars):
        name = f'uni{cp:04X}'
        glyphs[name] = base.glyph(contours)
        cmap[cp] = name
    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder(list(glyphs))
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    for name, g in glyphs.items():
        if name not in metrics:
            metrics[name] = (920, g.xMin if g.numberOfContours else 0)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=800, descent=-200, lineGap=0)
    fb.setupNameTable({
        'familyName': {'en': 'ClassJ Pen M', 'ko': '클래스제이 펜 M'},
        'styleName': 'Regular',
        'uniqueFontIdentifier': 'ClassJ-Pen-M-2.000',
        'fullName': 'ClassJ Pen M', 'psName': 'ClassJPenM-Regular',
        'version': 'Version 2.000',
        'copyright': 'Original ClassJ lettering, 2026.',
        'designer': 'ClassJ',
        'description': 'Original medium pen lettering. Not the DXKOREA font. Shared Hangul stroke model; no third-party font outlines included.',
    })
    fb.setupOS2(sTypoAscender=800, sTypoDescender=-200, sTypoLineGap=0,
                usWinAscent=850, usWinDescent=250, usWeightClass=500,
                fsType=0, fsSelection=64, sCapHeight=750)
    fb.setupPost()
    fb.setupMaxp()
    fb.font.recalcTimestamp = False
    fb.font['head'].created = fb.font['head'].modified = 3876854400
    ttf = args.output / 'ClassJPenM-Regular.ttf'
    woff = args.output / 'ClassJPenM-Regular.woff2'
    fb.save(ttf)
    print('TTF built', flush=True)
    if not args.ttf_only:
        from fontTools.ttLib import woff2
        compress = woff2.brotli.compress
        try:
            woff2.brotli.compress = lambda data, **kwargs: compress(data, quality=args.brotli_quality, **kwargs)
            with TTFont(ttf, recalcTimestamp=False) as font:
                font.flavor = 'woff2'
                font.save(woff)
        finally:
            woff2.brotli.compress = compress
        print('WOFF2 built; validating both formats', flush=True)
    for file in [ttf] + ([] if args.ttf_only else [woff]):
        with TTFont(file) as font:
            mapping = font.getBestCmap()
            if not args.specimen_only:
                assert all(cp in mapping for cp in range(0xac00, 0xd7a4))
                assert all(cp in mapping for cp in range(0x3131, 0x3164))
            for cp, name in mapping.items():
                if cp in [32, 0x3000]:
                    continue
                g = font['glyf'][name]
                assert g.numberOfContours > 0
                assert -100 <= g.xMin < g.xMax <= 1050 and -250 <= g.yMin < g.yMax <= 850, (hex(cp), g.xMin, g.yMin, g.xMax, g.yMax)
    assert hashlib.sha256(base.SOURCE.read_bytes()).hexdigest() == source_hash
    manifest = {'family': 'ClassJ Pen M', 'version': '2.000', 'weight': 500,
                'hangulSyllables': sum(0xac00 <= cp <= 0xd7a3 for cp in cmap),
                'compatibilityJamo': sum(0x3131 <= cp <= 0x3163 for cp in cmap),
                'sourceSha256': source_hash, 'ttfBytes': ttf.stat().st_size,
                'woff2Bytes': None if args.ttf_only else woff.stat().st_size}
    (args.output / 'font-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(manifest), flush=True)


if __name__ == '__main__':
    main()
