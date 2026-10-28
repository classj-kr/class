"""Compare original font revisions against official reference fonts or specimens.

The reference raster is used only in this review sheet, never as font input.
Each whole character is scaled uniformly to one ink height. Jamo proportions
inside the character are retained. Actual font comparisons instead keep the same
em size and baseline for every character. Output is lossless WebP.
"""
from __future__ import annotations
import argparse
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

BOXES = {
    '다': (1185, 695, 1378, 904),
    '지': (748, 450, 935, 666),
    '인': (940, 212, 1105, 421),
    '열': (1190, 210, 1355, 421),
    '정': (1375, 210, 1535, 421),
    '을': (1545, 210, 1740, 421),
    '폰': (1180, 474, 1370, 658),
    '꽃': (552, 707, 753, 904),
}

def reference_ink(image, box):
    a = np.asarray(image.crop(box).convert('RGB'), dtype=np.float32)
    background = np.array([221, 171, 72], dtype=np.float32)
    difference = np.linalg.norm(a - background, axis=2)
    alpha = np.clip((difference - 48) / 125, 0, 1)
    mask = Image.fromarray(np.uint8(alpha * 255), 'L')
    return mask.crop(mask.getbbox())

def font_ink(file, char):
    face = ImageFont.truetype(str(file), 256, layout_engine=ImageFont.Layout.BASIC)
    image = Image.new('L', (384, 384))
    ImageDraw.Draw(image).text((40, 310), char, font=face, fill=255, anchor='ls')
    return image.crop(image.getbbox())


def compare_fonts(args):
    """Keep actual font size, baseline, advance and internal proportions intact."""
    from fontTools.ttLib import TTFont
    size, cell, margin, top, row = 128, 630, 32, 126, 178
    lines = [args.chars[i:i+4] for i in range(0, len(args.chars), 4)]
    files = [args.reference_font, args.before] + ([args.after] if args.after else [])
    for file in files:
        with TTFont(file) as font:
            missing = sorted({char for char in args.chars if not char.isspace() and ord(char) not in font.getBestCmap()})
            if missing:
                raise ValueError(f'{file.name}: missing comparison characters: {"".join(missing)}')
    faces = [ImageFont.truetype(str(file), size, layout_engine=ImageFont.Layout.BASIC) for file in files]
    labels = [args.reference_label or faces[0].getname()[0], args.before_label] + ([args.after_label] if args.after else [])
    im = Image.new('RGB', (margin*2+cell*len(files), top+len(lines)*row+68), '#ffffff')
    draw = ImageDraw.Draw(im)
    ui = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 25)
    small = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 17)
    draw.text((margin,20), '실제 글꼴 파일 비교 · 같은 128px · 같은 기준선 · 글자별 확대/축소 없음', font=small, fill='#586168')
    for i,(label,face) in enumerate(zip(labels,faces)):
        x = margin+i*cell
        draw.text((x+20,65),label,font=ui,fill='#27362f')
        for j,line in enumerate(lines):
            baseline = top+j*row+124
            draw.line((x+16,baseline,x+cell-20,baseline),fill='#e1e5e3')
            draw.text((x+24,baseline),line,font=face,fill='#26372f',anchor='ls')
    draw.text((margin,im.height-40),'기준: 산돌구름 DX경필명조 공식 미리보기 글꼴 · 비교용 부분집합',font=small,fill='#6b7478')
    args.output.parent.mkdir(parents=True,exist_ok=True)
    im.save(args.output,lossless=True)
    decoded=Image.open(args.output).convert('RGB')
    assert decoded.size==im.size and decoded.tobytes()==im.tobytes()
    print(str(args.output))

def main():
    p = argparse.ArgumentParser()
    source = p.add_mutually_exclusive_group(required=True)
    source.add_argument('--reference', type=Path)
    source.add_argument('--reference-font', type=Path)
    p.add_argument('--reference-label')
    p.add_argument('--before', type=Path, required=True)
    p.add_argument('--before-label', default='수정 전')
    p.add_argument('--after', type=Path)
    p.add_argument('--after-label', default='수정 후')
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--chars', default='다지인열정을폰꽃')
    a = p.parse_args()
    if a.reference_font:
        compare_fonts(a)
        return
    labels = ['DX경필명조 견본', '수정 전'] + (['수정 후'] if a.after else [])
    cell, row, margin, top = 344, 196, 94, 106
    im = Image.new('RGB', (margin + len(labels)*cell+20, top + len(a.chars)*row+48), '#ffffff')
    draw = ImageDraw.Draw(im)
    ui = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 24)
    small = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 17)
    draw.text((24, 20), '전체 글자 높이만 맞춤 · 자모 비례 유지 · 견본은 여러 굵기 포함', font=small, fill='#586168')
    for i,label in enumerate(labels): draw.text((margin+i*cell+44,56), label,font=ui,fill='#27362f')
    reference = Image.open(a.reference)
    for j,char in enumerate(a.chars):
        y = top+j*row
        draw.text((25,y+66), char, font=ui, fill='#5b6367')
        images = [reference_ink(reference,BOXES[char]),font_ink(a.before,char)]
        if a.after: images.append(font_ink(a.after,char))
        for i, mask in enumerate(images):
            scale=146/mask.height
            fitted=mask.resize((round(mask.width*scale),146),Image.Resampling.LANCZOS)
            x=margin+i*cell+(cell-fitted.width)//2
            im.paste('#26372f',(x,y+12),fitted)
            draw.line((margin+i*cell+15,y+170,margin+(i+1)*cell-15,y+170), fill='#e4e8e6')
    draw.text((24,im.height-36), '출처: 산돌구름 DX경필명조 공개 견본 · 비교용 자료',font=small,fill='#6b7478')
    a.output.parent.mkdir(parents=True,exist_ok=True)
    im.save(a.output,lossless=True)
    decoded=Image.open(a.output).convert('RGB')
    assert decoded.size==im.size and decoded.tobytes()==im.tobytes()
    print(str(a.output))

if __name__ == '__main__': main()
