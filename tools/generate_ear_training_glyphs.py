"""Embed the required Noto Music outlines; runtime rendering needs no fonts.

Usage: python tools/generate_ear_training_glyphs.py path/to/NotoMusic-Regular.ttf
Source: https://github.com/google/fonts/tree/main/ofl/notomusic
License: learning/arts/music-theory/ear-training/assets/notation/OFL.txt
"""
import hashlib
import json
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

source = Path(sys.argv[1])
font = TTFont(source)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
outlines = {}
for codepoint in [0x1D11E, 0x1D122, 0x266F, 0x266D, 0x266E, 0x1D12A,
                  0x1D13B, 0x1D13C, 0x1D13D, 0x1D13E, 0x1D13F]:
    glyph = glyphs[cmap[codepoint]]
    bounds = BoundsPen(glyphs)
    glyph.draw(bounds)
    left, bottom, right, top = bounds.bounds
    pen = SVGPathPen(glyphs)
    glyph.draw(TransformPen(pen, (1, 0, 0, -1, -left, top)))
    outlines[chr(codepoint)] = {"width": right - left, "height": top - bottom, "path": pen.getCommands()}

target = Path(__file__).resolve().parents[1] / "learning/arts/music-theory/ear-training/notation.js"
start = "    // BEGIN BUNDLED MUSIC OUTLINES"
end = "    // END BUNDLED MUSIC OUTLINES"
content = target.read_text(encoding="utf-8")
block = (start + "\n    // Noto Music, SIL OFL 1.1; see assets/notation/OFL.txt.\n"
         + "    // Source SHA256: " + hashlib.sha256(source.read_bytes()).hexdigest() + "\n"
         + "    const MUSIC_OUTLINES = {\n"
         + ",\n".join("        " + json.dumps(char, ensure_ascii=True) + ": "
                      + json.dumps(shape, separators=(",", ":")) for char, shape in outlines.items())
         + "\n    };\n" + end)
first, last = content.index(start), content.index(end) + len(end)
target.write_text(content[:first] + block + content[last:], encoding="utf-8")
