"""Compare original font revisions against manually selected published specimens.

The reference raster is used only in this review sheet, never as font input.
Each whole character is scaled uniformly to one ink height. Jamo proportions
inside the character are retained. Output is lossless WebP.
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

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--reference', type=Path, required=True)
    p.add_argument('--before', type=Path, required=True)
    p.add_argument('--after', type=Path)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--chars', default='다지인열정을폰꽃')
    a = p.parse_args()
    labels = ['DX경필명조 견본', '수정 전'] + (['수정 후'] if a.after else [])
    cell, row, margin, top = 344, 196, 94, 106
    im = Image.new('RGB', (margin + len(labels)*cell+20, top + len(a.chars)*row+48), '#ffffff')
    draw = ImageDraw.Draw(im)
    ui = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 24)
    small = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 17)
    draw.text((24, 20), '글자 전체 높이만 맞춘 비교 · 자모별 변형 없음', font=small, fill='#586168')
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
