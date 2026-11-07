"""Fit position/size calibration of the ClassJ pen font against a locally installed reference font.

The reference font is only rasterised here to measure distances. Nothing from it is
read into the font generator; the result is a small numeric table written into
font-source.js between the CAL-BEGIN / CAL-END markers.

Usage: python scripts/fit-handwriting-calibration.py --reference <ttf> [--rounds 3] [--dry]
"""
from __future__ import annotations

import argparse
import collections
import json
from pathlib import Path
import re
import subprocess

import numpy as np
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'learning/literacy-numeracy/handwriting/font-source.js'
SZ = 100
STROKE = 5.8
CAP = 12.0
BOUNDS = {'d': 6.0, 's': (0.85, 1.15)}
MIN_GAP = 6.8

DUMP = """
const F=require(process.argv[1]);
const chars=JSON.parse(require('fs').readFileSync(0,'utf8'));
const out={};
for(const ch of chars){const p=F.components(ch);if(p)out[ch]=p.map(x=>({kind:x.kind,char:x.char,paths:x.paths}));}
process.stdout.write(JSON.stringify(out));
"""

CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
JONG = [''] + list('ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ')
COMPOUND = set('ㅘㅙㅚㅝㅞㅟㅢ')
HORIZONTAL = set('ㅗㅛㅜㅠㅡ')


def split(ch):
    n = ord(ch) - 0xAC00
    return CHO[n // 588], JUNG[(n // 28) % 21], JONG[n % 28]


def vowel_type(b):
    return 'c' if b in COMPOUND else 'h' if b in HORIZONTAL else 'v'


def key_of(part, a, b, c):
    """Keys for one part, most specific first. Table lookup uses the first key present."""
    t = vowel_type(b)
    f = 1 if c else 0
    if part['kind'] == 'initial':
        return ([f"i|{a}|{b}|{f}"] if t != 'v' else []) + [f"i|{a}|{t}|{f}"]
    if part['kind'] == 'vowel':
        return ([f"v|{part['char']}|{t}|{c}"] if c else []) + [f"v|{part['char']}|{t}|{f}"]
    if part['kind'] == 'final':
        return ([f"f|{c}|{b}"] if t != 'v' else []) + [f"f|{c}|{t}"]
    return []


def lookup(table, keys):
    for k in keys:
        if k in table:
            return table[k]
    return None


def load_parts(chars):
    """Dump layout parts from a copy of the source whose calibration table is empty."""
    import tempfile
    src = SOURCE.read_text(encoding='utf-8')
    raw = re.sub(r'(// CAL-BEGIN\n).*?(\n\s*// CAL-END)', lambda m: m.group(1) + '  const CALIBRATION = {};' + m.group(2), src, flags=re.S)
    with tempfile.TemporaryDirectory() as d:
        copy = Path(d) / 'font-source.js'
        copy.write_text(raw, encoding='utf-8')
        proc = subprocess.run(['node', '-e', DUMP, str(copy)], input=json.dumps(chars, ensure_ascii=True),
                              capture_output=True, text=True, encoding='utf-8', check=True)
    return json.loads(proc.stdout)


def ref_mask(font, ch):
    im = Image.new('L', (SZ * 2, SZ * 2), 0)
    ImageDraw.Draw(im).text((SZ // 2, int(SZ * 1.4)), ch, font=font, fill=255, anchor='ls')
    return np.asarray(im) > 127


def to_px(p):
    return SZ / 2 + p[0] * SZ / 100, SZ * 1.4 + (p[1] * 10 - 800) * SZ / 1000


def transformed(part, p):
    """Same transform and boundary clamp that calibrate() applies in font-source.js."""
    pts = np.array([q for path in part['paths'] for q in path], float)
    c = (pts.min(0) + pts.max(0)) / 2
    arrays = [c + (np.array(path, float) - c) * np.array([p[2], p[3]]) + np.array([p[0], p[1]]) for path in part['paths']]
    allp = np.concatenate(arrays)
    l, t = allp.min(0)
    r, d = allp.max(0)
    k = 87 / (d - t) if d - t > 87 else 1.0
    mid = (t + d) / 2
    top, bottom = (t - mid) * k + mid, (d - mid) * k + mid
    dx = 3 - l if l < 3 else 97 - r if r > 97 else 0.0
    dy = 7.3 - top if top < 7.3 else 94.3 - bottom if bottom > 94.3 else 0.0
    if dx or dy or k != 1.0:
        arrays = [np.stack([a[:, 0] + dx, (a[:, 1] - mid) * k + mid + dy], axis=1) for a in arrays]
    return arrays


def render(parts_paths):
    im = Image.new('L', (SZ * 2, SZ * 2), 0)
    d = ImageDraw.Draw(im)
    r = STROKE * SZ / 100 / 2
    for path in parts_paths:
        pts = [to_px(q) for q in path]
        if len(pts) > 1:
            d.line(pts, fill=255, width=max(1, round(2 * r)), joint='curve')
        for x, y in (pts[0], pts[-1]):
            d.ellipse((x - r, y - r, x + r, y + r), fill=255)
    return np.asarray(im) > 127


class Entry:
    def __init__(self, ch, parts, mask):
        self.ch, self.parts, self.mask = ch, parts, mask
        self.a, self.b, self.c = split(ch)
        self.keys = [key_of(p, self.a, self.b, self.c) for p in parts]
        self.ref_dt = ndi.distance_transform_edt(~mask)
        self.ref_n = mask.sum()

    def cost(self, table):
        paths = []
        by_part = []
        for part, keys in zip(self.parts, self.keys):
            p = lookup(table, keys)
            got = transformed(part, p) if p else [np.array(x, float) for x in part['paths']]
            by_part.append(got)
            paths.extend(got)
        penalty = self.penalty(by_part)
        ours = render(paths)
        if not ours.any():
            return 2 * CAP
        to_ref = np.minimum(self.ref_dt[ours], CAP).mean()
        dt = ndi.distance_transform_edt(~ours)
        to_ours = np.minimum(dt[self.mask], CAP).mean()
        return to_ref + to_ours + penalty

    def penalty(self, by_part):
        # Invariants the layout tests enforce on centerlines (model units).
        kinds = [p['kind'] for p in self.parts]
        def pts(i):
            return np.array([q for path in by_part[i] for q in path], float)
        def gap(i, j):
            a, b = pts(i), pts(j)
            return np.sqrt(((a[:, None, :] - b[None, :, :]) ** 2).sum(-1)).min()
        total_penalty = 0.0
        if 'initial' in kinds and 'final' in kinds:
            i, f = kinds.index('initial'), kinds.index('final')
            total_penalty += 40 * max(0.0, MIN_GAP - gap(i, f))
            for v, part in enumerate(self.parts):
                if part['kind'] == 'vowel' and part['char'] in 'ㅜㅠ' and self.c in 'ㄱㄷㄹㅌ' and len(by_part[v]) > 1:
                    bottom = max(q[1] for q in by_part[f][0])
                    for path in by_part[v][1:]:
                        total_penalty += 40 * max(0.0, path[-1][1] - (bottom + 0.6))
        if self.a in 'ㄱㅋ' and self.b == 'ㅛ' and 'initial' in kinds:
            i = kinds.index('initial')
            v = [k for k, part in enumerate(self.parts) if part['kind'] == 'vowel'][0]
            a, b = pts(i), np.array([q for path in by_part[v][:2] for q in path], float)
            g = np.sqrt(((a[:, None, :] - b[None, :, :]) ** 2).sum(-1)).min()
            total_penalty += 40 * max(0.0, 9.6 - g)
        return total_penalty


def total(entries, table):
    return sum(e.cost(table) for e in entries)


def fit_group(key, entries, table):
    best = list(table.get(key, [0.0, 0.0, 1.0, 1.0]))
    probe = lambda p: total(entries, {**table, key: p})
    score = probe(best)
    steps = [(4.0, 4.0, 0.12, 0.12), (2.0, 2.0, 0.06, 0.06), (1.0, 1.0, 0.03, 0.03), (0.5, 0.5, 0.015, 0.015), (0.25, 0.25, 0.008, 0.008)]
    for step in steps:
        improved = True
        while improved:
            improved = False
            for i in range(4):
                for sign in (-1, 1):
                    cand = list(best)
                    cand[i] += sign * step[i]
                    lo, hi = (-BOUNDS['d'], BOUNDS['d']) if i < 2 else BOUNDS['s']
                    if not lo <= cand[i] <= hi:
                        continue
                    s = probe(cand)
                    if s < score - 1e-6:
                        best, score, improved = cand, s, True
    return best, score


def main():
    global STROKE, MIN_GAP
    ap = argparse.ArgumentParser()
    ap.add_argument('--reference', type=Path, required=True)
    ap.add_argument('--rounds', type=int, default=2)
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--step', type=int, default=1, help='use every n-th syllable')
    ap.add_argument('--max-shift', type=float, default=BOUNDS['d'])
    ap.add_argument('--scale-range', type=float, nargs=2, default=BOUNDS['s'])
    ap.add_argument('--min-gap', type=float, default=MIN_GAP, help='initial/final centerline gap; must exceed the runtime guard')
    ap.add_argument('--stroke', type=float, default=STROKE, help='stroke width of the reference in model units')
    ap.add_argument('--style', help='write a separate style table (e.g. badasseugi) instead of editing font-source.js')
    ap.add_argument('--output-js', type=Path, help='file for --style')
    ap.add_argument('--min-chars', type=int, default=4)
    ap.add_argument('--min-fine', type=int, default=5)
    args = ap.parse_args()
    STROKE = args.stroke
    BOUNDS['d'], BOUNDS['s'] = args.max_shift, tuple(args.scale_range)
    MIN_GAP = args.min_gap
    ref = TTFont(args.reference)
    cmap = ref.getBestCmap()
    font = ImageFont.truetype(str(args.reference), SZ, layout_engine=ImageFont.Layout.BASIC)
    chars = []
    masks = {}
    for cp in range(0xAC00, 0xD7A4):
        # every syllable without a final is the only one of its initial+vowel pair, so keep them all
        if cp in cmap and ((cp - 0xAC00) % args.step == 0 or (cp - 0xAC00) % 28 == 0):
            m = ref_mask(font, chr(cp))
            if m.sum() >= 40:
                chars.append(chr(cp))
                masks[chr(cp)] = m
    print('reference syllables with outlines:', len(chars), flush=True)
    parts = load_parts(chars)
    entries = {ch: Entry(ch, parts[ch], masks[ch]) for ch in chars if ch in parts}
    groups = collections.defaultdict(list)
    for e in entries.values():
        for keys in e.keys:
            for k in keys:
                groups[k].append(e)
    coarse_keys = {ks[-1] for e in entries.values() for ks in e.keys if ks}
    coarse = {k: v for k, v in groups.items() if len(v) >= args.min_chars and k in coarse_keys}
    fine = {k: v for k, v in groups.items() if len(v) >= args.min_fine and k not in coarse_keys}
    print('coarse groups:', len(coarse), 'fine groups:', len(fine), flush=True)
    table: dict[str, list[float]] = {}
    base = total(list(entries.values()), table) / len(entries)
    print('start mean cost %.3f' % base, flush=True)
    order = sorted(coarse, key=lambda k: -len(coarse[k]))
    for r in range(args.rounds):
        for k in order:
            table[k], _ = fit_group(k, coarse[k], table)
        mean = total(list(entries.values()), table) / len(entries)
        print(f'round {r + 1}: mean cost {mean:.3f} ({len(table)} groups)', flush=True)
    parent = {k: ks[-1] for e in entries.values() for ks in e.keys for k in ks[:-1]}
    for r in range(args.rounds):
        for k in sorted(fine, key=lambda k: -len(fine[k])):
            if k not in table:
                table[k] = list(table.get(parent[k], [0.0, 0.0, 1.0, 1.0]))
            table[k], _ = fit_group(k, fine[k], table)
        mean = total(list(entries.values()), table) / len(entries)
        print(f'fine round {r + 1}: mean cost {mean:.3f} ({len(table)} groups)', flush=True)
    if args.dry:
        return
    rounded = {k: [round(v[0], 2), round(v[1], 2), round(v[2], 3), round(v[3], 3)] for k, v in sorted(table.items())}
    if args.style:
        assert args.output_js, '--style needs --output-js'
        table_json = json.dumps(rounded, ensure_ascii=False, separators=(',', ':'))
        args.output_js.write_text(
            '// 자동 생성: scripts/fit-handwriting-calibration.py --style ' + args.style + ' (직접 고치지 마세요)\n'
            '(function (root) {\n'
            '  (root.HandwritingCalibrations = root.HandwritingCalibrations || {})[' + json.dumps(args.style) + '] = ' + table_json + ';\n'
            "})(typeof window === 'object' ? window : globalThis);\n",
            encoding='utf-8')
        print('wrote', len(rounded), 'groups to', args.output_js)
        return
    body = 'const CALIBRATION = ' + json.dumps(rounded, ensure_ascii=False, separators=(',', ':')) + ';'
    src = SOURCE.read_text(encoding='utf-8')
    new = re.sub(r'(// CAL-BEGIN\n).*?(\n\s*// CAL-END)', lambda m: m.group(1) + '  ' + body + m.group(2), src, flags=re.S)
    assert new != src or rounded == {}
    SOURCE.write_text(new, encoding='utf-8')
    print('wrote', len(rounded), 'groups')


if __name__ == '__main__':
    main()
