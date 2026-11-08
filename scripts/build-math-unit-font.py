"""Build the upright, single-storey ASCII g used by elementary math units.

Uses STIX Two Math's existing U+0261 glyph without altering its outline.
The renamed, one-character derivative is distributed under STIX-OFL.txt.
Requires fontTools with WOFF2 support; no font processing runs in the browser.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset

fonts = Path(__file__).resolve().parents[1] / "learning/literacy-numeracy/math-tools/assets/fonts"
font = TTFont(fonts / "STIXTwoMath-Regular.woff2")
glyph = font.getBestCmap()[0x0261]
for table in font["cmap"].tables:
    if table.isUnicode():
        table.cmap[0x0067] = glyph
options = subset.Options()
options.name_IDs = ["*"]
options.name_legacy = True
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=[0x0067])
subsetter.subset(font)
for name in font["name"].names:
    if name.nameID in [1, 4, 6, 16]:
        value = "ClassJMathUnits" if name.nameID == 6 else "ClassJ Math Units"
        name.string = value.encode(name.getEncoding())
font.save(fonts / "ClassJMathUnits.woff2")
