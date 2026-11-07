"""Compare a Pen M proof with the previous revision and local M specimens."""
from __future__ import annotations
import argparse
import importlib.util
import json
from pathlib import Path
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'outputs/handwriting/pen-m/revision-1300'
spec = importlib.util.spec_from_file_location('refine', ROOT / 'scripts/refine-pen-m.py')
refine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refine)


def save(im, file):
    im.save(file, lossless=True)
    with Image.open(file) as decoded:
        assert decoded.size == im.size and decoded.convert(im.mode).tobytes() == im.tobytes()


def review(font, before, output, old_label='1.2', new_label='1.3'):
    refs = refine.references()
    output.mkdir(parents=True, exist_ok=True)
    rows = []
    for char, ref in refs.items():
        target = refine.mask(ref, char, 200)
        iou = lambda file: float(np.count_nonzero(refine.mask(file, char, 200) & target) /
                                np.count_nonzero(refine.mask(file, char, 200) | target))
        rows.append({'char': char, 'before': iou(before), 'after': iou(font)})
    summary = {'referenceCount': len(rows),
               'beforeInkIoU': float(np.mean([r['before'] for r in rows])),
               'afterInkIoU': float(np.mean([r['after'] for r in rows])),
               'improved': sum(r['after'] > r['before'] for r in rows)}
    (output / 'metrics.json').write_text(json.dumps({'summary': summary, 'glyphs': rows}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(summary, ensure_ascii=False))
    print('Lowest:', ''.join(r['char'] for r in sorted(rows, key=lambda r: r['after'])[:20]))
    print('Regressed:', ''.join(r['char'] for r in sorted(rows, key=lambda r: r['after']-r['before'])[:16]))
    ui = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 19)
    lines = ['가나다라마바사아자차카타파하', '아야어여오요우유으이', '까따빠싸짜애얘에예',
             '와왜외워웨위의', '나무바다하늘꽃구름', '학교친구연필책가방', '나는나를믿어요',
             '현협형푸쵸죠쿠여마쌍', '각간갈감강같갚갖갗갛', '권괄괜괌괭괵균귤퀄쾅',
             '확활훤휜뺨뼈뻐쌍땅짝찜찹핥팥', '값넋앉닭삶읽밟읊']
    for batch in range(3):
        section = lines[batch*4:batch*4+4]
        im = Image.new('RGB', (1600, len(section)*375+55), '#fffefa')
        draw = ImageDraw.Draw(im)
        draw.text((22,12), f'동일 112px / 원본 M · 이전 시안 {old_label} · 세부 보정 {new_label}', font=ui, fill='#566461')
        for li, line in enumerate(section):
            for fi, label in enumerate(['원본 M', f'이전 {old_label}', f'보정 {new_label}']):
                y = 50+li*375+fi*120
                draw.text((12,y+40), label, font=ui, fill='#566461')
                x=110
                for char in line:
                    file=refs[char] if fi==0 else before if fi==1 else font
                    f=ImageFont.truetype(str(file),112)
                    draw.text((x,y+100), char, font=f, fill='#253b35', anchor='ls')
                    x+=f.getlength(char)
                draw.line((110,y+100,1570,y+100), fill='#e4e8e4')
        save(im, output/f'comparison-{batch+1}.webp')
    worst = ''.join(r['char'] for r in sorted(rows,key=lambda r:r['after'])[:12])
    im = Image.new('RGB',(1600,1030),'#fffefa')
    draw=ImageDraw.Draw(im)
    draw.text((22,10),'확대 점검: 원본 M (회색) / 보정 시안 (초록)',font=ui,fill='#566461')
    for i,c in enumerate(worst):
        col,row=i%4,i//4
        x,y=col*400+10,row*330+40
        draw.text((x+10,y+10),c,font=ui,fill='#566461')
        for j,file in enumerate([refs[c],font]):
            draw.text((x+j*195,y+210),c,font=ImageFont.truetype(str(file),200),anchor='ls',fill='#747a77' if j==0 else '#253b35')
        metric=next(r for r in rows if r['char']==c)
        draw.text((x+15,y+270),f"{metric['before']:.3f} → {metric['after']:.3f}",font=ui,fill='#566461')
    save(im,output/'worst.webp')
    # A readable, compact deliverable uses the same color for both fonts.
    proof=Image.new('RGB',(1500,990),'#fffefa')
    d=ImageDraw.Draw(proof)
    title=ImageFont.truetype('C:/Windows/Fonts/malgun.ttf',30)
    d.text((42,24),'경필명조 M · 정밀 보정 시안',font=title,fill='#253b35')
    d.text((44,74),f'같은 글자 크기와 기준선으로 비교 · 자체 서체 {new_label}',font=ui,fill='#69766e')
    for li,line in enumerate(['나무바다하늘꽃구름','현협형여푸쵸죠쿠','나는나를믿어요']):
        for fi,label in enumerate(['원본 M',f'보정 {new_label}']):
            y=145+li*275+fi*115
            d.text((42,y+35),label,font=ui,fill='#69766e')
            x=160
            for c in line:
                f=ImageFont.truetype(str(refs[c] if fi==0 else font),112)
                d.text((x,y+100),c,font=f,fill='#253b35',anchor='ls')
                x+=f.getlength(c)
            d.line((160,y+100,1440,y+100),fill='#e3e9e2')
    d.text((44,947),'원본과 구분되는 자체 제작 시안이며, 원본 M 폰트 파일을 포함하지 않습니다.',font=ui,fill='#69766e')
    save(proof,output/'proof.webp')
    focus=Image.new('RGB',(1200,1055),'#fffefa')
    d=ImageDraw.Draw(focus)
    d.text((32,20),'를 · 어 · 푸 — 확대 비교',font=title,fill='#253b35')
    d.text((32,67),'같은 260px · 같은 기준선 · 같은 색상',font=ui,fill='#69766e')
    for row,label in enumerate(['원본 M',f'이전 {old_label}',f'보정 {new_label}']):
        baseline=330+row*300
        d.text((16,baseline-100),label,font=ui,fill='#69766e')
        for col,c in enumerate('를어푸'):
            file=refs[c] if row==0 else before if row==1 else font
            d.text((160+col*340,baseline),c,font=ImageFont.truetype(str(file),260),fill='#253b35',anchor='ls')
        d.line((150,baseline,1160,baseline),fill='#e3e9e2')
    d.text((32,1015),'원본을 비교 기준으로 삼아 다듬은 별도 서체 시안입니다.',font=ui,fill='#69766e')
    save(focus,output/'focus.webp')
    detail=[]
    for char in '를어푸':
        target=refine.mask(refs[char],char,800)
        old,new=refine.mask(before,char,800),refine.mask(font,char,800)
        iou=lambda ink:float(np.count_nonzero(ink&target)/np.count_nonzero(ink|target))
        detail.append({'char':char,'beforeInkIoU':iou(old),'afterInkIoU':iou(new)})
    (output/'detail-metrics.json').write_text(json.dumps({
        'renderSizePx':800,'scope':'These three reference glyphs were used during refinement; ink overlap is not general font accuracy.',
        'glyphs':detail},ensure_ascii=False,indent=2),encoding='utf-8')


if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--font',type=Path,default=ROOT/'assets/fonts/classj-pen-m/ClassJPenM-Regular.ttf')
    parser.add_argument('--before',type=Path,default=OUT/'before.ttf')
    parser.add_argument('--output',type=Path,default=OUT)
    parser.add_argument('--old-label',default='1.2')
    parser.add_argument('--new-label',default='1.3')
    args=parser.parse_args()
    review(args.font,args.before,args.output,args.old_label,args.new_label)
