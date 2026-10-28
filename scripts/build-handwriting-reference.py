"""Build font metrics and compact ink masks for the handwriting reference.

The supplied educational font is copied unchanged. Its true outlines, not
synthetically composed characters, determine the reference and shape score.
Requires fonttools, brotli, Pillow and numpy.
"""
from __future__ import annotations

import argparse
from functools import lru_cache
import hashlib
import json
from pathlib import Path
import shutil

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
import base64

ROOT = Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--font', type=Path, required=True)
    args = parser.parse_args()
    dest = ROOT / 'assets/fonts/keris-badasseugi'
    dest.mkdir(parents=True, exist_ok=True)
    target = dest / 'HakgyoansimBadasseugi-Light.woff'
    shutil.copyfile(args.font, target)
    font = TTFont(args.font)
    cmap = font.getBestCmap()
    cps = list(range(0xac00, 0xd7a4)) + list(range(0x3131, 0x3164))
    assert all(cp in cmap for cp in cps)
    em = font['head'].unitsPerEm
    temp = ROOT / 'tmp/handwriting-font/reference-build.ttf'
    font.flavor = None
    font.save(temp)
    records = []
    native_face = ImageFont.truetype(str(temp), 256, layout_engine=ImageFont.Layout.BASIC)
    print('Font loaded; building reference masks', flush=True)
    for i, cp in enumerate(cps):
        native = Image.new('L', (384,384))
        ImageDraw.Draw(native).text((64,320),chr(cp),font=native_face,fill=255,anchor='ls')
        left,top,right,bottom = native.getbbox()
        fit = 80 / max(right-left,bottom-top)
        size = 256*fit
        x = 50 - (left+right-128)/2*fit
        y = 50 - (top+bottom-640)/2*fit
        crop = native.crop((left,top,right,bottom))
        scale = 204.8/max(crop.size)
        width,height = max(1,round(crop.width*scale)),max(1,round(crop.height*scale))
        fitted = crop.resize((width,height),Image.Resampling.LANCZOS)
        high = Image.new('L',(256,256))
        high.paste(fitted,((256-width)//2,(256-height)//2))
        low = np.asarray(high.resize((32,32),Image.Resampling.BOX)) >= 20
        assert low.any(), hex(cp)
        packed = np.packbits(low.reshape(-1)).tobytes()
        records.append([round(size,3),round(x,3),round(y,3),base64.b64encode(packed).decode('ascii')])
        if i and i%2500==0:
            print(f'{i} glyph references built',flush=True)
    data = ROOT / 'learning/literacy-numeracy/handwriting/reference-data.js'
    payload = json.dumps(records,separators=(',',':'),ensure_ascii=True)
    data.write_text("/* KERIS school-safe Badasseugi ink masks. Font-derived data: SIL OFL 1.1; see assets/fonts/keris-badasseugi/OFL.txt. */\n(function(root){const data="+payload+";if(typeof module==='object'&&module.exports)module.exports=data;else root.HandwritingReferenceData=data;})(typeof window==='object'?window:globalThis);\n",encoding='utf-8')
    manifest = {'family':'Hakgyoansim Badasseugi Light','copyright':'Copyright KERIS',
                'source':'https://copyright.keris.or.kr/wft/fntDwnldView?fntGrpId=GFT202408200000000000004',
                'license':'SIL Open Font License 1.1','sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
                'hangulSyllables':11172,'jamo':51,'grid':32,'glyphs':len(records),'dataBytes':data.stat().st_size}
    (dest/'reference-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(manifest,ensure_ascii=True),flush=True)


if __name__ == '__main__':
    main()
