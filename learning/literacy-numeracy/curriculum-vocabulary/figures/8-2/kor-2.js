// 국어 8-2(중학교 2학년 2학기) 낱말 도식 둘째 묶음:
// 4단원 모음 체계 — 모음(입 단면), 단모음·이중 모음·전설/후설·평순/원순·고/중/저 모음(모음 사각도와 단모음 체계표:
// 전설 평순 ㅣㅔㅐ, 전설 원순 ㅟㅚ, 후설 평순 ㅡㅓㅏ, 후설 원순 ㅜㅗ),
// 5단원 훈민정음 — 기본자·상형·가획·이체자·합성·초출자·재출자·모아쓰기·풀어쓰기(글자를 획으로 그려 더한 획이 그어진다).
// 도구는 figures/7-1/kor.js 와 같은 것을 옮겨 왔다. 움직임은 transform·opacity·stroke-dashoffset(과 색 바꾸기)만 쓴다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게 실측: 한글 1em, 괄호 .36em, 쉼표·마침표·쌍점 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ○]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!\[\]]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
  const tw = (s, size) => [...s].reduce((a, c) => a + cw(c), 0) * size;
  const wOf = (label, size = 28) => Math.round(tw(label, size) + size * 1.3);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·slide) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;

  // 낱말 조각: 배경 rect.bg, 글자 text.tx — 색 바꾸기는 CSS 로 .bg 의 fill/stroke 를 바꾼다
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '', color = C.ink } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx', color })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: 34, rx: 17, fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange], r: [C.peach, C.red], g: ['white', C.muted] };
  // 낱말 줄: 폭을 재어 왼쪽 x0 부터(또는 가운데 cx 에 맞춰) 늘어놓는다
  const row = (labels, { y, x0, cx = 320, gap = 16, size = 28 }) => {
    const ws = labels.map((l) => wOf(l, size));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (labels.length - 1);
    let x = x0 != null ? x0 : cx - total / 2;
    return labels.map((label, i) => { const c = x + ws[i] / 2; x += ws[i] + gap; return { label, cx: c, w: ws[i], y, size, l: c - ws[i] / 2, r: c + ws[i] / 2 }; });
  };
  const T = (p, o = {}) => tile(p.cx, p.y, p.label, { size: p.size, w: p.w, ...o });
  const paint = (id, sel, [fill, stroke], n, delay = 0) =>
    `.on${n} .sc-${id} ${sel} .bg { fill: ${fill}; stroke: ${stroke};${delay ? ` transition-delay: ${delay}s;` : ''} }`;

  const head = (x, y, ang, color, w = 4) => {
    const l = 13, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 그어지는 곧은 화살표(칸 n)
  const drawArrow = (x1, y1, x2, y2, color, n, { width = 5, delay = 0 } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + g(`fin fin${n}`, head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color, width), delay + 0.9) + '</g>';
  // 그어지는 굽은 화살표(칸 n). peak 는 줄 꼭대기(또는 바닥) y
  const curve = (x1, y1, x2, y2, peak, color, n, { width = 4, arrowHead = true, delay = 0 } = {}) => {
    const cx = (x1 + x2) / 2, cy = 2 * peak - (y1 + y2) / 2, ang = Math.atan2(y2 - cy, x2 - cx);
    return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
      + (arrowHead ? g(`fin fin${n}`, head(x2, y2, ang, color, width), delay + 0.9) : '') + '</g>';
  };
  // 그어지는 선(칸 n, 화살촉 없음)
  const drawLine = (d, color, n, { width = 4, delay = 0, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
  const dashed = (x1, y1, x2, y2, color = C.muted, w = 3) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${w}" stroke-dasharray="7 6" fill="none" stroke-linecap="round"/>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  // 아래로 여는 묶음 괄호(가로): x1~x2, 위 끝 y
  const braceBottom = (x1, x2, y, color = C.orange, w = 3.5) => {
    const m = (x1 + x2) / 2;
    return `<path d="M${x1} ${y} Q${x1} ${y + 12} ${x1 + 14} ${y + 12} H${m - 12} Q${m} ${y + 12} ${m} ${y + 24} Q${m} ${y + 12} ${m + 12} ${y + 12} H${x2 - 14} Q${x2} ${y + 12} ${x2} ${y}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };

  // 장면마다 같이 쓰는 움직임. 같은 요소에 여러 칸 움직임이 붙으면 뒤 칸 것이 이긴다(칸 차례로 적는다).
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .shake, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1s ease-in-out; }
    .sc-${id} .bg { transition: fill .5s ease, stroke .5s ease; }
    .sc-${id} .dim { transition: opacity .6s ease; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-slide { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-slideL { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5); } }
    `;
    for (let n = 1; n <= 6; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .45s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .slide${n} { animation: ${id}-slide .55s ease-out both; }
    .on${n} .sc-${id} .slideL${n} { animation: ${id}-slideL .55s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .2s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .shake${n} { animation: ${id}-shake .6s ease-in-out .2s 2; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .dim${n} { opacity: .3; }`;
    return s;
  };
  // 칸 n 에서 속성 없는 <g class="cls"> 를 옮긴다(처음 자리는 CSS transform 으로 둔다)
  const move = (id, cls, from, n, { dur = 1, delay = 0, to = 'none' } = {}) => `
    .sc-${id} .${cls} { transform: ${from}; transition: transform ${dur}s ease-in-out ${delay}s, opacity .6s ease ${delay}s; }
    .on${n} .sc-${id} .${cls} { transform: ${to}; }`;
  // 여러 칸에 걸쳐 옮기기: list = [[칸, transform, delay, 덧붙일 CSS]]
  const steps = (id, cls, first, list, { dur = 1, box = true } = {}) => {
    let s = `.sc-${id} .${cls} { transform: ${first}; transition: transform ${dur}s ease-in-out, opacity .6s ease;${box ? ' transform-box: fill-box; transform-origin: center;' : ''} }`;
    list.forEach(([n, t, d = 0, extra = '']) => { s += `\n    .on${n} .sc-${id} .${cls} { transform: ${t}; transition-delay: ${d}s;${extra ? ' ' + extra : ''} }`; });
    return s;
  };
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  // 칸 n 에서 늘어나며 나타나기(scaleX·scaleY), origin 은 fill-box 기준
  const growCss = (id, sel, n, { axis = 'X', origin = 'left center', delay = 0, dur = 0.7 } = {}) => `
    .sc-${id} ${sel} { transform-box: fill-box; transform-origin: ${origin}; transform: scale${axis}(0); transition: transform ${dur}s ease-out ${delay}s; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;
  // 칸 n 에서 흰 덮개가 왼쪽부터 걷히며 글자가 한 자씩 찍히듯 보인다(steps)
  const typeCover = (id, cls, x, y, w, h, n, { delay = 0.3, steps: st = 6, dur = 1.1, fill = 'white' } = {}) => ({
    body: `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/></g>`,
    css: `.sc-${id} .${cls} { transform-box: fill-box; transform-origin: right center; transition: transform ${dur}s steps(${st}) ${delay}s; }
      .on${n} .sc-${id} .${cls} { transform: scaleX(0); }`
  });
  const TAN = '#fdf3d3', GRAY = '#b5c4be';
  const bar = (x, y, w, color = GRAY, h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${f(y - r - 14 * r / 18)}" r="${r}" fill="${color}"/><path d="M${f(x - r * 1.6)} ${f(y + r * 1.5)} Q${f(x - r * 1.6)} ${y} ${x} ${y} Q${f(x + r * 1.6)} ${y} ${f(x + r * 1.6)} ${f(y + r * 1.5)} Z" fill="${color}"/>`;
  const eye = (x, y, color = C.blue) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`;
  // 번호 동그라미
  const badge = (x, y, n, color = C.green) => `<circle cx="${x}" cy="${y}" r="15" fill="${color}" stroke="white" stroke-width="2.5"/>` + text(x, y + 7, n, { size: 19, color: 'white' });
  const sparkle = (x, y, s = 1, col = C.yellow) => `<path d="M${x} ${f(y - 12 * s)} L${f(x + 3.5 * s)} ${f(y - 3.5 * s)} L${f(x + 12 * s)} ${y} L${f(x + 3.5 * s)} ${f(y + 3.5 * s)} L${x} ${f(y + 12 * s)} L${f(x - 3.5 * s)} ${f(y + 3.5 * s)} L${f(x - 12 * s)} ${y} L${f(x - 3.5 * s)} ${f(y - 3.5 * s)} Z" fill="${col}" stroke="${C.orange}" stroke-width="1.5" stroke-linejoin="round"/>`;
  // 하트: 가운데 (x, y), 배율 s(1 이면 폭 84, 높이 67)
  const heartD = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `M${P(0, 30)} C${P(-40, 2)} ${P(-42, -28)} ${P(-21, -37)} C${P(-9, -42)} ${P(0, -34)} ${P(0, -25)} C${P(0, -34)} ${P(9, -42)} ${P(21, -37)} C${P(42, -28)} ${P(40, 2)} ${P(0, 30)} Z`;
  };

  const K = '8-2/국어/';
  // 입 옆 단면은 kor.js 와 같은 것(모음·상형에서 씀)
  // ═════ 입 옆 단면(얼굴이 왼쪽). 바탕 틀 300×340 — 화면에는 (OX, OY) 만큼 옮겨 놓는다 ═════
  const PROFILE = 'M96 0 C90 30 74 54 52 82 Q30 104 44 112 L52 114 Q46 124 48 136 Q32 142 34 152 Q38 157 48 158 Q36 162 34 172 Q34 186 52 190 Q44 206 56 224 Q72 248 124 252 L162 258 Q170 292 172 340';
  // 숨이 지나는 빈 곳 하나(콧속·입안·목구멍이 이어짐). 입천장(센입천장)은 콧속 바닥과 입안 천장 사이의 틈으로 남는다.
  const AIRWAY = 'M50 113 Q64 92 104 88 L200 86 Q240 88 252 126 L256 210 L252 280 L250 340 L214 340 L214 292 Q204 262 196 238 Q166 208 120 206 Q84 204 66 186 L58 180 L50 165 L36 161 L50 155 L58 146 Q76 138 96 136 Q140 128 186 131 L190 125 Q150 121 104 123 Q72 123 58 118 Z';
  const VEL = 'M186 124 Q222 122 253 130 L253 141 Q222 145 186 137 Z';
  const TONGUE = 'M66 182 Q64 164 80 158 Q110 150 150 150 Q190 150 204 170 Q214 196 202 236 Q184 212 150 208 Q100 204 66 182 Z';
  // 소리 나는 자리(바탕 틀 좌표)
  const PT = { lips: [40, 160], teeth: [61, 152], ridge: [92, 139], hard: [146, 133], soft: [214, 141], glot: [233, 302], nose: [150, 104], tip: [82, 158], blade: [140, 151], back: [192, 154] };
  // 혀 부분 강조선
  const TPART = { tip: 'M68 178 Q64 164 80 158 Q92 154 106 152', blade: 'M112 151 Q140 149 170 150', back: 'M178 151 Q198 153 206 172' };
  // 숨길: 목청에서 입 밖으로 / 코 밖으로
  const AIR_MOUTH = 'M233 330 L233 240 Q234 170 210 150 Q180 142 130 142 Q92 143 66 154 L10 161';
  const AIR_NOSE = 'M233 330 L233 210 Q236 184 244 162 Q252 128 236 106 Q222 100 196 102 L100 104 Q66 106 50 112 L8 116';
  const mouthBase = () => `<path d="${PROFILE} L300 340 L300 0 Z" fill="#fdf3d3"/>`
    + `<path d="${AIRWAY}" fill="white" stroke="${C.muted}" stroke-width="2" stroke-linejoin="round"/>`
    + `<path d="${TONGUE}" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`
    + `<g class="vel"><path d="${VEL}" fill="#fdf3d3" stroke="${C.muted}" stroke-width="2" stroke-linejoin="round"/></g>`
    + `<path d="M56 144 L65 144 L65 156 L59 160 Z M57 179 L64 167 L66 181 L60 185 Z" fill="white" stroke="${C.muted}" stroke-width="2" stroke-linejoin="round"/>`
    + `<path d="M214 296 L229 302 L214 308 Z M252 296 L237 302 L252 308 Z" fill="${C.orange}"/>`
    + `<path d="${PROFILE}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  // 막힌 곳 표시(빨간 덩이), 고리
  const blob = (p, rx = 10, ry = 7, col = C.red) => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${rx}" ry="${ry}" fill="${col}"/>`;
  const ring = (p, r = 16, col = C.blue) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="none" stroke="${col}" stroke-width="4"/>`;
  // 비비는 소리 물결
  const fizz = (x, y, n = 3, col = C.red) => Array.from({ length: n }, (_, i) => `<path d="M${x - i * 13} ${y - 8} q-4 4 0 8 q4 4 0 8" stroke="${col}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join('');
  // 그어지는 숨길(바탕 틀 안 좌표, 칸 n)
  const air = (d, n, { col = C.orange, delay = 0, w = 4, dash = false } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
  const OX = 20, OY = 10;
  const G = (p) => [p[0] + OX, p[1] + OY];

  // ═════ 4단원: 모음 사각도(왼쪽이 혀 앞, 위가 혀 높음)와 단모음 체계표 ═════
  // 사각도 꼭짓점: 앞 위(60,62) 뒤 위(300,62) 뒤 아래(300,296) 앞 아래(160,296)
  const TZ = 'M60 62 H300 V296 H160 Z';
  const frontX = (y) => 60 + (y - 62) * 100 / 234;
  const VY = { hi: 92, mid: 180, lo: 268 };
  // [글자, x, y, 앞(f)/뒤(b), 높이, 평순(u)/원순(r)]
  const VOW = [['ㅣ', 92, 92, 'f', 'hi', 'u'], ['ㅟ', 138, 92, 'f', 'hi', 'r'], ['ㅡ', 238, 92, 'b', 'hi', 'u'], ['ㅜ', 282, 92, 'b', 'hi', 'r'],
    ['ㅔ', 130, 180, 'f', 'mid', 'u'], ['ㅚ', 174, 180, 'f', 'mid', 'r'], ['ㅓ', 238, 180, 'b', 'mid', 'u'], ['ㅗ', 282, 180, 'b', 'mid', 'r'],
    ['ㅐ', 168, 268, 'f', 'lo', 'u'], ['ㅏ', 250, 268, 'b', 'lo', 'u']];
  const vIdx = (ch) => VOW.findIndex((v) => v[0] === ch);
  // 사각도(가르는 점선, 축 이름, 흐린 글자 열 개). 글자는 v0~v9 클래스.
  const trapezoid = () => {
    let s = `<path d="${TZ}" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    s += `<path d="M${f(frontX(136))} 136 H300 M${f(frontX(224))} 224 H300 M206 62 V296" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
    s += text(96, 44, '앞', { size: 19, color: C.muted }) + text(282, 44, '뒤', { size: 19, color: C.muted });
    s += text(30, 99, '높음', { size: 18, color: C.muted }) + text(f(frontX(180) - 30), 187, '중간', { size: 18, color: C.muted }) + text(f(frontX(268) - 30), 275, '낮음', { size: 18, color: C.muted });
    VOW.forEach(([ch, x, y], i) => { s += text(x, y + 10, ch, { size: 28, color: C.muted, cls: `v v${i}` }); });
    return s;
  };
  // 글자 칠하기(칸 n): 글자 색을 바꾼다
  const paintV = (id, list, n, col, delay = 0.2, step = 0.15) => list.map((ch, k) => `.sc-${id} .v${vIdx(ch)} { transition: fill .4s ease; } .on${n} .sc-${id} .v${vIdx(ch)} { fill: ${col}; transition-delay: ${f(delay + k * step)}s; }`).join('\n');
  // 갈래 칸 바탕(사각도 안 구역)
  const ZONE = {
    f: `M60 62 H206 V296 H160 Z`, b: `M206 62 H300 V296 H206 Z`,
    hi: `M60 62 H300 V136 H${f(frontX(136))} Z`, mid: `M${f(frontX(136))} 136 H300 V224 H${f(frontX(224))} Z`, lo: `M${f(frontX(224))} 224 H300 V296 H160 Z`
  };
  // 단모음 체계표(오른쪽): 열 x, 줄 y
  const VT = { x0: 330, cols: [429, 487, 545, 603], rows: { hi: 140, mid: 198, lo: 256 } };
  const vowelTable = (id, n, o = {}) => {
    const { cols = [], rows = [], band = [C.peach, C.orange], all = false, top = 42 } = o;
    let s = `<rect x="330" y="40" width="302" height="246" rx="8" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`;
    cols.forEach((c) => { s += `<rect class="bdc" x="${VT.cols[c] - 29}" y="${top}" width="58" height="${284 - top}" fill="${band[0]}"/>`; });
    rows.forEach((r) => { s += `<rect class="bd" x="332" y="${VT.rows[r] - 29}" width="298" height="58" fill="${band[0]}"/>`; });
    s += `<path d="M400 76 H632 M330 110 H632 M330 169 H632 M330 227 H632 M400 40 V286 M516 40 V286 M458 76 V286 M574 76 V286" stroke="${C.line}" stroke-width="2" fill="none"/>`;
    s += text(458, 65, '전설', { size: 19 }) + text(574, 65, '후설', { size: 19 });
    ['평순', '원순', '평순', '원순'].forEach((l, i) => { s += text(VT.cols[i], 100, l, { size: 18, color: C.muted, weight: 600 }); });
    [['hi', '고모음'], ['mid', '중모음'], ['lo', '저모음']].forEach(([r, l]) => { s += text(365, VT.rows[r] + 7, l, { size: 18 }); });
    VOW.forEach(([ch, , , fb, h, ur]) => {
      const c = (fb === 'f' ? 0 : 2) + (ur === 'r' ? 1 : 0);
      s += text(VT.cols[c], VT.rows[h] + 10, ch, { size: 28, color: all || cols.includes(c) || rows.includes(h) ? C.ink : C.muted });
    });
    const css = `.sc-${id} .bd { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .7s ease-out 1s; } .on${n} .sc-${id} .bd { transform: none; }
      .sc-${id} .bdc { transform-box: fill-box; transform-origin: center top; transform: scaleY(0); transition: transform .7s ease-out 1s; } .on${n} .sc-${id} .bdc { transform: none; }`;
    return { body: at(n, 'fin', s, 0.4), css };
  };
  // 입술 앞모습: 평평(flat) / 둥긂(round)
  const lipsIcon = (x, y, round) => round
    ? `<ellipse cx="${x}" cy="${y}" rx="30" ry="26" fill="${C.red}" opacity=".85"/><ellipse cx="${x}" cy="${y}" rx="13" ry="11" fill="${C.ink}"/>`
    : `<path d="M${x - 58} ${y} Q${x} ${y - 26} ${x + 58} ${y} Q${x} ${y + 26} ${x - 58} ${y} Z" fill="${C.red}" opacity=".85"/><path d="M${x - 46} ${y} Q${x} ${y - 8} ${x + 46} ${y} Q${x} ${y + 8} ${x - 46} ${y} Z" fill="${C.ink}"/>`;
  // 입 벌린 크기(앞모습): k 0 작게 1 중간 2 크게
  const openIcon = (x, y, k) => { const ry = [8, 18, 30][k]; return `<ellipse cx="${x}" cy="${y}" rx="40" ry="${ry + 9}" fill="${C.red}" opacity=".85"/><ellipse cx="${x}" cy="${y}" rx="30" ry="${ry}" fill="${C.ink}"/>`; };

  // 사각도 낱말 틀: 칸 1·2 사각도(가운데) + 오른쪽 그림, 칸 3 사각도가 왼쪽으로 옮겨 가고 표가 나타남, 칸 4 반짝·이름
  // o: { id, key, zone, letters, ring:[x,y] (혀의 가장 높은 곳이 가는 자리), side1(오른쪽 그림), cols, rows, glow }
  const vowelScene = (o) => {
    const { id } = o;
    let css = base(id);
    let tz = at(1, 'fin', trapezoid());
    if (o.zone) tz = `<g class="b2"><path class="zn" d="${ZONE[o.zone]}" fill="${C.peach}" opacity=".55"/></g>` + tz;
    if (o.zones) tz = o.zones.map((z) => `<g class="b2"><path class="zn" d="${ZONE[z]}" fill="${C.peach}" opacity=".55"/></g>`).join('') + tz;
    css += `.sc-${id} .zn { opacity: 0; transition: opacity .6s ease .1s; } .on2 .sc-${id} .zn { opacity: .55; }`;
    if (o.ring) {
      tz += `<g class="b1"><g class="rg"><circle cx="206" cy="180" r="16" fill="none" stroke="${C.red}" stroke-width="4"/><circle cx="206" cy="180" r="4" fill="${C.red}"/></g></g>`;
      css += steps(id, 'rg', 'none', [[1, `translate(${o.ring[0] - 206}px, ${o.ring[1] - 180}px)`, 0.6]], { box: false, dur: 1 });
    }
    css += paintV(id, o.letters, 2, C.red);
    let body = `<g class="tz">${tz}</g>`;
    css += `.sc-${id} .tz { transform: translate(${o.shift || 120}px, 0px); transition: transform 1s ease-in-out .1s; } .on3 .sc-${id} .tz { transform: none; }`;
    body += `<g class="h3">${o.side || ''}</g>`;
    const tb = vowelTable(id, 3, { cols: o.cols, rows: o.rows, top: o.top });
    body += tb.body; css += tb.css;
    (o.glows || [o.glow]).forEach(([gx, gy, gw, gh]) => { body += glowRect(gx, gy, gw, gh, 4, C.orange, 0.1, 6); });
    body += at(4, 'pop', tag(480, 326, o.key, ROLE.y, 22), 0.6);
    put(K + '4/' + o.key, svg(id, body, css));
  };
  const colGlow = (a, b) => [VT.cols[a] - 29, 42, 58 * (b - a + 1), 242];
  const rowGlow = (r) => [332, VT.rows[r] - 29, 298, 58];
  const sideLab = (n, l, y = 300, delay = 0.9) => at(n, 'pop', tag(530, y, l, ROLE.r, 20), delay);
  // 혀 앞뒤
  vowelScene({ id: 't82-k4-jeonseol', key: '전설 모음', zone: 'f', ring: [112, 136], letters: ['ㅣ', 'ㅔ', 'ㅐ', 'ㅟ', 'ㅚ'], cols: [0, 1], glow: colGlow(0, 1),
    side: at(1, 'pop', tag(530, 120, '혀를 앞으로', ROLE.r, 20), 1.1) });
  vowelScene({ id: 't82-k4-huseol', key: '후설 모음', zone: 'b', ring: [262, 136], letters: ['ㅡ', 'ㅓ', 'ㅏ', 'ㅜ', 'ㅗ'], cols: [2, 3], glow: colGlow(2, 3),
    side: at(1, 'pop', tag(530, 120, '혀를 뒤로', ROLE.r, 20), 1.1) });
  // 입술 모양
  const lipScene = (key, id, round, letters, cols) => {
    const side = `<g class="b1"><g class="lp">${lipsIcon(530, 150, round)}</g></g>` + sideLab(1, round ? '둥글게 오므림' : '평평하게 폄', 230, 1.0);
    vowelScene({ id, key, letters, cols, top: 78, glows: cols.map((c) => [VT.cols[c] - 29, 78, 58, 206]), side, shift: 120, css: '' });
  };
  // 입술 그림이 칸 1에 모양을 갖추며 나타나도록(가로 늘이기)
  (function () {
    const mk = (key, id, round, letters, cols) => {
      lipScene(key, id, round, letters, cols);
    };
    mk('평순 모음', 't82-k4-pyeongsun', false, ['ㅣ', 'ㅔ', 'ㅐ', 'ㅡ', 'ㅓ', 'ㅏ'], [0, 2]);
    mk('원순 모음', 't82-k4-wonsun', true, ['ㅟ', 'ㅚ', 'ㅜ', 'ㅗ'], [1, 3]);
  })();
  // 혀 높낮이
  const hiScene = (key, id, h, k, letters, label) => vowelScene({ id, key, zone: h, ring: [h === 'hi' ? 188 : 206, VY[h]], letters, rows: [h], glow: rowGlow(h),
    side: `<g class="b1"><g class="op">${openIcon(530, 150, k)}</g></g>` + sideLab(1, label, 230, 1.0) });
  hiScene('고모음', 't82-k4-go', 'hi', 0, ['ㅣ', 'ㅟ', 'ㅡ', 'ㅜ'], '입을 조금 벌림');
  hiScene('중모음', 't82-k4-jung', 'mid', 1, ['ㅔ', 'ㅚ', 'ㅓ', 'ㅗ'], '입을 반쯤 벌림');
  hiScene('저모음', 't82-k4-jeo', 'lo', 2, ['ㅐ', 'ㅏ'], '입을 크게 벌림');

  // ── 4단원: 단모음('오―' 동안 혀 자리와 입술이 그대로 → 그런 모음 열 개) ──────────────────────────────
  (function () {
    const id = 't82-k4-danmoeum';
    let css = base(id);
    const [, ox, oy] = VOW[vIdx('ㅗ')];
    let tz = at(1, 'fin', trapezoid());
    tz += `<g class="b1"><g class="rg">${g('pop pop1', `<circle cx="${ox}" cy="${oy}" r="22" fill="none" stroke="${C.red}" stroke-width="4"/>`, 0.5)}</g></g>`;
    css += pulseCss(id, '.rg', 2, 0.2);
    css += paintV(id, ['ㅗ'], 1, C.red, 0.5) + paintV(id, VOW.map((v) => v[0]).filter((c) => c !== 'ㅗ'), 3, C.red, 1.2, 0.05);
    let body = `<g class="tz">${tz}</g>`;
    css += `.sc-${id} .tz { transform: translate(120px, 0px); transition: transform 1s ease-in-out .1s; } .on3 .sc-${id} .tz { transform: none; }`;
    // 오른쪽: 처음·가운데·끝의 입술이 모두 같다
    let side = at(1, 'pop', tile(530, 64, '오―', { size: 28, h: 52, w: 110, fill: C.peach, stroke: C.orange }), 0.2);
    [0, 1, 2].forEach((i) => { side += at(2, 'pop', `<g transform="translate(${470 + i * 60} 160) scale(.6)">${lipsIcon(0, 0, true)}</g>`, 0.2 + i * 0.3); });
    side += drawArrow(446, 206, 616, 206, C.muted, 2, { width: 3, delay: 0.2 }) + at(2, 'fin', text(452, 234, '처음', { size: 18, color: C.muted }) + text(606, 234, '끝', { size: 18, color: C.muted }), 0.5);
    side += at(2, 'pop', tag(530, 284, '그대로', ROLE.p, 20), 1.2);
    body += `<g class="h3">${side}</g>`;
    const tb = vowelTable(id, 3, { all: true });
    body += tb.body; css += tb.css;
    body += glowRect(332, 110, 298, 174, 4, C.orange, 0.1, 6);
    body += at(4, 'pop', tag(480, 326, '단모음', ROLE.y, 22), 0.6);
    put(K + '4/단모음', svg(id, body, css));
  })();

  // ── 4단원: 이중 모음(ㅖ: 혀가 ㅣ 자리에서 ㅔ 자리로, ㅑ: ㅣ 에서 ㅏ 로 미끄러진다) ──────────────────────────────
  (function () {
    const id = 't82-k4-ijung';
    let css = base(id);
    const P = (ch) => VOW[vIdx(ch)].slice(1, 3);
    const [ix, iy] = P('ㅣ'), [ex, ey] = P('ㅔ'), [ax, ay] = P('ㅏ');
    let body = `<g transform="translate(40 0)">` + at(1, 'fin', trapezoid());
    body += `<g class="b1"><g class="r1">${g('pop pop1', `<circle cx="${ix}" cy="${iy}" r="22" fill="none" stroke="${C.red}" stroke-width="4"/>`, 0.5)}</g></g>`;
    css += steps(id, 'r1', 'none', [[2, `translate(${ex - ix}px, ${ey - iy}px)`, 0.4]], { box: false, dur: 1 });
    body += drawArrow(ix + 8, iy + 20, ex - 8, ey - 22, C.red, 2, { width: 4, delay: 0.3 });
    body += `<g class="b3"><g class="r2">${`<circle cx="${ix}" cy="${iy}" r="22" fill="none" stroke="${C.blue}" stroke-width="4"/>`}</g></g>`;
    css += steps(id, 'r2', 'none', [[3, `translate(${ax - ix}px, ${ay - iy}px)`, 0.5]], { box: false, dur: 1.1 });
    body += drawArrow(ix + 16, iy + 18, ax - 14, ay - 22, C.blue, 3, { width: 4, delay: 0.4 });
    css += paintV(id, ['ㅣ'], 1, C.red, 0.5) + paintV(id, ['ㅔ'], 2, C.red, 1.3) + paintV(id, ['ㅏ'], 3, C.blue, 1.5);
    body += '</g>';
    // 오른쪽 식
    const eq = (y, a, b, res, col, n) => at(n, 'pop', tile(452, y, a, { size: 26, h: 48, w: 48 }) + text(492, y + 8, '→', { size: 24, color: col }) + tile(532, y, b, { size: 26, h: 48, w: 48 }) + text(570, y + 8, '=', { size: 24, color: col }) + tile(608, y, res, { size: 28, h: 52, w: 52, fill: col === C.red ? C.peach : C.sky, stroke: col }), 1.0);
    body += at(1, 'pop', tile(530, 70, 'ㅖ', { size: 34, h: 60, w: 70, fill: C.peach, stroke: C.red }), 0.2).replace('class="b1"', 'class="b1 h2"');
    body += eq(130, 'ㅣ', 'ㅔ', 'ㅖ', C.red, 2) + eq(220, 'ㅣ', 'ㅏ', 'ㅑ', C.blue, 3);
    body += glowRect(424, 100, 212, 150, 4, C.purple, 0.1, 12);
    body += at(4, 'pop', tag(530, 300, '이중 모음', ROLE.y, 22), 0.6);
    put(K + '4/이중 모음', svg(id, body, css));
  })();

  // ── 4단원: 모음(목청을 지난 공기가 입안에서 막힘 없이 흘러나와 '아―'가 길게 이어진다) ──────────────────────────────
  (function () {
    const id = 't82-k4-moeum';
    let css = base(id);
    let body = `<g class="b1"><g transform="translate(${OX} ${OY})">${g('fin fin1', mouthBase())}`;
    body += air('M233 330 L233 240 Q234 170 210 150', 1, { delay: 0.5, col: C.blue, w: 5 });
    body += air('M210 150 Q180 142 130 142 Q92 143 66 154 L10 161', 2, { delay: 0.2, col: C.blue, w: 5 });
    body += '</g></g>';
    body += at(2, 'pop', check(400, 90), 1.2) + at(2, 'fin', text(470, 98, '막힘 없음', { size: 20, color: C.green }), 1.3);
    // 칸 3: 소리 물결이 길게
    let wave = 'M330 230';
    for (let k = 0; k < 10; k++) wave += ` q14 ${k % 2 ? 20 : -20} 28 0`;
    body += drawLine(wave, C.orange, 3, { width: 4, delay: 0.5 });
    body += at(3, 'pop', tile(370, 170, '아―', { size: 30, h: 54, w: 100, fill: C.peach, stroke: C.orange }), 0.1);
    css += `.sc-${id} .b3 .draw3 { transition-duration: 1.5s; }`;
    body += glowRect(320, 140, 300, 120, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(470, 310, '모음', ROLE.y, 24), 0.6);
    put(K + '4/모음', svg(id, body, css));
  })();

  // ═════ 5단원: 훈민정음 — 글자는 획(선)으로 그려 더해지는 획이 그어지게 한다 ═════
  // 단위 칸(0~1)의 획: b(바탕), a(더한 획), d(아래아 점들)
  const GL = {
    'ㄱ': { b: 'M.15 .2 H.82 V.9' }, 'ㅋ': { b: 'M.15 .2 H.82 V.9', a: 'M.15 .53 H.82' },
    'ㄴ': { b: 'M.18 .14 V.84 H.88' }, 'ㄷ': { b: 'M.18 .14 V.84 H.88', a: 'M.18 .14 H.84' }, 'ㅌ': { b: 'M.18 .14 H.84 M.18 .14 V.84 H.88', a: 'M.18 .49 H.84' },
    'ㅁ': { b: 'M.2 .22 H.8 V.86 H.2 Z' }, 'ㅂ': { b: 'M.2 .22 H.8 V.86 H.2 Z', a: 'M.2 .22 V.04 M.8 .22 V.04' }, 'ㅍ': { b: 'M.3 .2 H.7 M.3 .2 V.84 M.7 .2 V.84 M.3 .84 H.7', a: 'M.06 .2 H.3 M.7 .2 H.94 M.06 .84 H.3 M.7 .84 H.94' },
    'ㅅ': { b: 'M.12 .9 L.5 .2 L.88 .9' }, 'ㅈ': { b: 'M.12 .9 L.5 .2 L.88 .9', a: 'M.2 .14 H.8' }, 'ㅊ': { b: 'M.12 .9 L.5 .2 L.88 .9 M.2 .14 H.8', a: 'M.5 .14 V0' },
    'ㅇ': { c: true }, 'ㆆ': { c: true, a: 'M.2 .14 H.8' }, 'ㅎ': { c: true, b: 'M.2 .14 H.8', a: 'M.5 .14 V0' },
    'ㆁ': { c: true, a: 'M.5 .22 V.02' }, 'ㄹ': { b: 'M.18 .5 V.86 H.88', a: 'M.14 .14 H.82 V.5 H.18' }, 'ㅿ': { b: 'M.12 .88 L.5 .18 L.88 .88', a: 'M.12 .88 H.88' },
    'ㆍ': { d: [[0.5, 0.5]] }, 'ㅡ': { b: 'M.08 .5 H.92' }, 'ㅣ': { b: 'M.5 .08 V.92' },
    'ㅗ': { b: 'M.08 .64 H.92', d: [[0.5, 0.34]] }, 'ㅜ': { b: 'M.08 .36 H.92', d: [[0.5, 0.66]] }, 'ㅏ': { b: 'M.36 .08 V.92', d: [[0.66, 0.5]] }, 'ㅓ': { b: 'M.64 .08 V.92', d: [[0.34, 0.5]] },
    'ㅛ': { b: 'M.08 .64 H.92', d: [[0.34, 0.34], [0.66, 0.34]] }, 'ㅠ': { b: 'M.08 .36 H.92', d: [[0.34, 0.66], [0.66, 0.66]] }, 'ㅑ': { b: 'M.36 .08 V.92', d: [[0.66, 0.34], [0.66, 0.66]] }, 'ㅕ': { b: 'M.64 .08 V.92', d: [[0.34, 0.34], [0.34, 0.66]] }
  };
  // 단위 칸 좌표의 길을 (x0,y0,w,h) 칸으로 옮긴다
  const mapD = (d, x0, y0, w, h) => d.replace(/([MLHVZ])\s*([^MLHVZ]*)/g, (m, cmd, args) => {
    const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (cmd === 'H') return 'H' + f(x0 + n[0] * w) + ' ';
    if (cmd === 'V') return 'V' + f(y0 + n[0] * h) + ' ';
    if (cmd === 'Z') return 'Z ';
    return cmd + f(x0 + n[0] * w) + ' ' + f(y0 + n[1] * h) + ' ';
  });
  // 글자 그리기: 가운데 (cx, cy), 크기 s. o.add: 더한 획 색(없으면 바탕색), o.draw: 더한 획이 그어질 칸, o.box: [x0,y0,w,h] 로 칸을 직접
  const glyph = (ch, cx, cy, s, o = {}) => {
    const q = GL[ch], col = o.col || C.ink, sw = f(o.sw || s * 0.11), [x0, y0, w, h] = o.box || [cx - s / 2, cy - s / 2, s, s];
    const st = (c) => `stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"`;
    let out = '';
    if (q.c) out += `<ellipse cx="${f(x0 + 0.5 * w)}" cy="${f(y0 + 0.56 * h)}" rx="${f(0.32 * w)}" ry="${f(0.32 * h)}" ${st(col)}/>`;
    if (q.b) out += `<path d="${mapD(q.b, x0, y0, w, h)}" ${st(col)}/>`;
    if (q.a) {
      const ac = o.add || col;
      out += o.draw ? `<g class="b${o.draw}"><path class="draw draw${o.draw}" pathLength="1" d="${mapD(q.a, x0, y0, w, h)}" ${st(ac)}${o.delay ? ` style="transition-delay:${o.delay}s"` : ''}/></g>` : `<path d="${mapD(q.a, x0, y0, w, h)}" ${st(ac)}/>`;
    }
    if (q.d && !o.noDots) q.d.forEach(([dx, dy]) => { out += `<path d="M${f(x0 + dx * w)} ${f(y0 + dy * h)} h.01" stroke="${o.dot || col}" stroke-width="${f(s * 0.2)}" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`; });
    return out;
  };
  // 점 하나(아래아) — 날아다니는 점
  const dot = (x, y, s, col = C.red) => `<path d="M${f(x)} ${f(y)} h.01" stroke="${col}" stroke-width="${f(s * 0.2)}" stroke-linecap="round"/>`;
  // 볼륨 막대(소리 세기)
  const vol = (x, y, n, col = C.orange) => [0, 1, 2].map((i) => `<rect x="${x + i * 12}" y="${y - 8 - i * 7}" width="8" height="${8 + i * 7}" rx="2" fill="${i < n ? col : C.line}"/>`).join('');

  // ── 5단원: 기본자(자음 ㄱㄴㅁㅅㅇ, 모음 ㆍㅡㅣ 를 먼저 만들고, 그것을 바탕으로 다른 글자를) ──────────────────────────────
  (function () {
    const id = 't82-k5-gibonja';
    let css = base(id);
    const CX = [110, 215, 320, 425, 530], CN = ['ㄱ', 'ㄴ', 'ㅁ', 'ㅅ', 'ㅇ'], CD = ['ㅋ', 'ㄷ', 'ㅂ', 'ㅈ', 'ㆆ'];
    let body = '';
    CN.forEach((ch, i) => { body += at(1, 'pop', glyph(ch, CX[i], 170, 64, { col: C.blue }), 0.2 + i * 0.2); });
    const VX = [140, 240, 340];
    ['ㆍ', 'ㅡ', 'ㅣ'].forEach((ch, i) => { body += at(2, 'pop', glyph(ch, VX[i], 290, 60, { col: C.red, dot: C.red }), 0.2 + i * 0.25); });
    // 칸 3: 바탕에서 새 글자로
    CD.forEach((ch, i) => {
      body += drawArrow(CX[i], 128, CX[i], 92, C.muted, 3, { width: 3, delay: 0.1 + i * 0.1 });
      body += at(3, 'pop', glyph(ch, CX[i], 54, 44, { col: C.muted, add: C.orange }), 0.9 + i * 0.1);
    });
    body += drawArrow(392, 290, 432, 290, C.muted, 3, { width: 3, delay: 0.3 });
    ['ㅗ', 'ㅏ', 'ㅜ', 'ㅓ'].forEach((ch, i) => { body += at(3, 'pop', glyph(ch, 452 + i * 52, 290, 40, { col: C.muted, dot: C.orange }), 1.0 + i * 0.1); });
    body += glowRect(66, 130, 508, 82, 4, C.blue, 0.1, 14) + glowRect(100, 254, 280, 72, 4, C.red, 0.3, 14);
    body += at(4, 'pop', tag(560, 340, '기본자', ROLE.y, 22), 0.7);
    put(K + '5/기본자', svg(id, body, css));
  })();

  // ── 5단원: 상형(혀뿌리·혀끝·입·이·목구멍 모양 → ㄱㄴㅁㅅㅇ, 하늘·땅·사람 → ㆍㅡㅣ) ──────────────────────────────
  (function () {
    const id = 't82-k5-sanghyeong';
    let css = base(id);
    let mouth = `<g transform="translate(${OX} ${OY})">${g('fin fin1', mouthBase())}`;
    const SH = { 'ㄱ': 'M150 150 H206 V200', 'ㄴ': 'M92 140 L86 160 L140 154', 'ㅁ': 'M28 146 H52 V174 H28 Z', 'ㅅ': 'M54 166 L61 146 L68 166', 'ㅇ': '' };
    mouth += drawLine(SH['ㄱ'], C.red, 1, { width: 6, delay: 0.2 }) + drawLine(SH['ㄴ'], C.red, 1, { width: 6, delay: 0.6 });
    mouth += drawLine(SH['ㅁ'], C.red, 2, { width: 5, delay: 0.1 }) + drawLine(SH['ㅅ'], C.red, 2, { width: 5, delay: 0.4 }) + at(2, 'pop', `<circle cx="233" cy="262" r="16" fill="none" stroke="${C.red}" stroke-width="5"/>`, 0.7);
    mouth += '</g>';
    let body = `<g class="b1 h3">${mouth}</g>`;
    // 오른쪽: 본뜬 글자
    const R = [['ㄱ', 380, 80, '혀뿌리', 1, 0.9], ['ㄴ', 480, 80, '혀끝', 1, 1.2], ['ㅁ', 380, 200, '입', 2, 0.8], ['ㅅ', 480, 200, '이', 2, 1.0], ['ㅇ', 580, 200, '목구멍', 2, 1.2]];
    R.forEach(([ch, x, y, l, n, d]) => { body += at(n, 'pop', glyph(ch, x, y, 58, { col: C.blue }) + text(x, y + 56, l, { size: 18, color: C.muted }), d); });
    // 칸 3: 하늘·땅·사람 → ㆍㅡㅣ
    const S = [['ㆍ', 70, '하늘'], ['ㅡ', 170, '땅'], ['ㅣ', 270, '사람']];
    body += at(3, 'pop', `<circle cx="70" cy="150" r="30" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`, 0.3)
      + at(3, 'pop', `<path d="M126 176 H214" stroke="${C.green}" stroke-width="10" stroke-linecap="round"/>`, 0.5)
      + at(3, 'pop', person(270, 160, C.purple, 18), 0.7);
    S.forEach(([ch, x, l], i) => { body += at(3, 'pop', glyph(ch, x, 262, 56, { col: C.red, dot: C.red }) + text(x, 322, l, { size: 18, color: C.muted }), 1.0 + i * 0.2); });
    body += glowRect(330, 26, 300, 270, 4, C.blue, 0.1, 14) + glowRect(20, 222, 290, 112, 4, C.red, 0.3, 14);
    body += at(4, 'pop', tag(480, 330, '상형', ROLE.y, 24), 0.7);
    put(K + '5/상형', svg(id, body, css));
  })();

  // ── 5단원: 가획(ㄱ→ㅋ, ㄴ→ㄷ→ㅌ, ㅁ→ㅂ→ㅍ, ㅅ→ㅈ→ㅊ, ㅇ→ㆆ→ㅎ — 소리가 세지는 만큼 획을 더한다) ──────────────────────────────
  (function () {
    const id = 't82-k5-gahoek';
    let css = base(id);
    const ROWS = [['ㄱ', 'ㅋ', null], ['ㄴ', 'ㄷ', 'ㅌ'], ['ㅁ', 'ㅂ', 'ㅍ'], ['ㅅ', 'ㅈ', 'ㅊ'], ['ㅇ', 'ㆆ', 'ㅎ']];
    const X = [180, 320, 460], Y = (i) => 78 + i * 58;
    let body = X.map((x, k) => at(k + 1, 'pop', vol(x - 18, 34, k + 1), 0.1)).join('');
    ROWS.forEach((r, i) => {
      r.forEach((ch, k) => {
        if (!ch) return;
        body += at(k + 1, 'fin', glyph(ch, X[k], Y(i), 44, { col: C.ink, add: C.orange, draw: k ? k + 1 : 0, delay: f(0.3 + i * 0.15) }), 0.1 + i * 0.12);
        if (k) body += drawArrow(X[k - 1] + 34, Y(i), X[k] - 34, Y(i), C.muted, k + 1, { width: 3, delay: 0.1 + i * 0.1 });
      });
    });
    body += glowRect(282, 50, 216, 284, 4, C.orange, 0.1, 14);
    body += at(4, 'pop', tag(570, 190, '가획', ROLE.y, 24), 0.6);
    put(K + '5/가획', svg(id, body, css));
  })();

  // ── 5단원: 이체자(ㄴ→ㄹ, ㅇ→ㆁ, ㅅ→ㅿ — 획을 더한 모양이지만 소리는 세지지 않는다) ──────────────────────────────
  (function () {
    const id = 't82-k5-icheja';
    let css = base(id);
    const ROWS = [['ㄴ', 'ㄹ', 2], ['ㅇ', 'ㆁ', 3], ['ㅅ', 'ㅿ', 3]];
    const Y = [90, 190, 290];
    let body = '';
    ROWS.forEach(([a, b, n], i) => {
      const y = Y[i];
      body += at(n === 2 ? 1 : 3, 'fin', glyph(a, 140, y, 58, { col: C.ink }), 0.1);
      body += drawArrow(186, y, 246, y, C.muted, n === 2 ? 1 : 3, { width: 3, delay: 0.3 });
      body += at(n === 2 ? 1 : 3, 'fin', glyph(b, 300, y, 58, { col: C.ink, add: C.orange, draw: n === 2 ? 1 : 3, delay: 0.6 }), 0.4);
      // 세기 비교: 막대가 같다
      body += at(n, 'pop', vol(122, y + 60, 1, C.blue) + vol(282, y + 60, 1, C.blue), n === 2 ? 0.3 : 1.0);
      body += at(n, 'pop', text(420, y + 8, '세기 같음', { size: 20, color: C.blue }), n === 2 ? 0.8 : 1.3);
    });
    body += glowRect(262, 52, 76, 280, 4, C.purple, 0.1, 14);
    body += at(4, 'pop', tag(560, 340, '이체자', ROLE.y, 24), 0.6);
    put(K + '5/이체자', svg(id, body, css));
  })();

  // ── 5단원: 합성(ㆍ를 ㅡ 위·아래에 붙여 ㅗ·ㅜ, ㅣ 오른쪽·왼쪽에 붙여 ㅏ·ㅓ) ──────────────────────────────
  (function () {
    const id = 't82-k5-hapseong';
    let css = base(id);
    const S = 66;
    let body = at(1, 'pop', glyph('ㆍ', 320, 70, S, { dot: C.red }), 0.1) + at(1, 'pop', glyph('ㅡ', 140, 70, S), 0.3) + at(1, 'pop', glyph('ㅣ', 500, 70, S), 0.5);
    // 칸 2·3: 바탕 획이 깔리고 점이 위에서 날아와 붙는다
    const parts = [['ㅗ', 90, 2], ['ㅜ', 210, 2], ['ㅏ', 430, 3], ['ㅓ', 550, 3]];
    parts.forEach(([ch, x, n], i) => {
      const y = 220;
      body += at(n, 'fin', glyph(ch, x, y, S, { noDots: true }), 0.1);
      const [dx, dy] = GL[ch].d[0], tx = x - S / 2 + dx * S, ty = y - S / 2 + dy * S;
      body += `<g class="b${n}"><g class="dt${i}">${dot(tx, ty, S)}</g></g>`;
      css += steps(id, `dt${i}`, `translate(${f(320 - tx)}px, ${f(70 - ty)}px)`, [[n, 'none', f(0.3 + (i % 2) * 0.4)]], { box: false, dur: 0.9 });
      body += at(n, 'pop', tag(x, 296, ch, ROLE.r, 22), f(1.3 + (i % 2) * 0.3));
    });
    body += drawArrow(140, 110, 140, 176, C.muted, 2, { width: 3, delay: 0.1 }) + drawArrow(500, 110, 500, 176, C.muted, 3, { width: 3, delay: 0.1 });
    body += glowRect(46, 176, 548, 90, 4, C.red, 0.1, 14);
    body += at(4, 'pop', tag(320, 160, '합성', ROLE.y, 24), 0.6);
    put(K + '5/합성', svg(id, body, css));
  })();

  // ── 5단원: 초출자·재출자(ㆍㅡㅣ → ㅗㅏㅜㅓ → ㅛㅑㅠㅕ) ──────────────────────────────
  const stageChart = (id, key, stage) => {
    let css = base(id);
    const S = 58, C1 = [['ㆍ', 80, 76], ['ㅡ', 80, 180], ['ㅣ', 80, 284]];
    const C2 = [['ㅗ', 250, 116], ['ㅏ', 350, 116], ['ㅜ', 250, 244], ['ㅓ', 350, 244]];
    const C3 = [['ㅛ', 480, 116], ['ㅑ', 580, 116], ['ㅠ', 480, 244], ['ㅕ', 580, 244]];
    let body = '';
    C1.forEach(([ch, x, y], i) => { body += at(1, 'pop', glyph(ch, x, y, S, { dot: C.red }), 0.1 + i * 0.15); });
    body += drawArrow(126, 180, 192, 180, C.muted, stage === 1 ? 2 : 1, { width: 3, delay: 0.1 });
    const n2 = stage === 1 ? 2 : 1, n3 = 2;
    C2.forEach(([ch, x, y], i) => {
      body += at(n2, 'fin', glyph(ch, x, y, S, { noDots: true }), 0.1);
      const [dx, dy] = GL[ch].d[0], tx = x - S / 2 + dx * S, ty = y - S / 2 + dy * S;
      if (stage === 1) {
        body += `<g class="b2"><g class="d${i}">${dot(tx, ty, S)}</g></g>`;
        css += steps(id, `d${i}`, `translate(${f(80 - tx)}px, ${f(76 - ty)}px)`, [[2, 'none', f(0.3 + i * 0.2)]], { box: false, dur: 0.9 });
      } else body += at(1, 'fin', dot(tx, ty, S), 0.1);
    });
    if (stage === 2) {
      body += drawArrow(394, 180, 444, 180, C.muted, 2, { width: 3, delay: 0.1 });
      C3.forEach(([ch, x, y], i) => {
        body += at(n3, 'fin', glyph(ch, x, y, S, { noDots: true }), 0.1);
        const D = GL[ch].d, src = C2[i], sD = GL[src[0]].d[0];
        // 처음 점(초출자에서 함께 옮겨 옴)과 새로 붙는 점
        D.forEach(([dx, dy], k) => {
          const tx = x - S / 2 + dx * S, ty = y - S / 2 + dy * S;
          if (k === 0) body += `<g class="b2"><g class="m${i}">${dot(tx, ty, S)}</g></g>`;
          else body += `<g class="b2"><g class="n${i}">${dot(tx, ty, S)}</g></g>`;
          const fx = src[1] - S / 2 + sD[0] * S, fy = src[2] - S / 2 + sD[1] * S;
          css += steps(id, k === 0 ? `m${i}` : `n${i}`, `translate(${f((k === 0 ? fx : 80) - tx)}px, ${f((k === 0 ? fy : 76) - ty)}px)`, [[2, 'none', f(0.3 + i * 0.2)]], { box: false, dur: 0.9 });
        });
      });
    }
    // 칸 3: 점 수
    const cx = stage === 1 ? 300 : 530;
    body += at(3, 'pop', tag(cx, 330, stage === 1 ? 'ㆍ 하나' : 'ㆍ 둘', ROLE.r, 22), 0.2);
    css += `.on3 .sc-${id} ${stage === 1 ? '[class^="d"]' : '[class^="n"]'} { animation: ${id}-flash 1.2s ease-in-out .5s both; }`;
    body += glowRect(cx - 100, 72, 200, 216, 4, C.red, 0.1, 14);
    body += at(4, 'pop', tag(stage === 1 ? 530 : 300, 330, key, ROLE.y, 24), 0.6);
    put(K + '5/' + key, svg(id, body, css));
  };
  stageChart('t82-k5-chochul', '초출자', 1);
  stageChart('t82-k5-jaechul', '재출자', 2);

  // ── 5단원: 모아쓰기·풀어쓰기(ㄴㅏㅁㅜ ↔ 나무) ──────────────────────────────
  // 모은 글자 칸(나: ㄴ 왼쪽·ㅏ 오른쪽, 무: ㅁ 위·ㅜ 아래)과 늘어놓은 칸
  const BLK = { 'ㄴ': [176, 196, 60, 108], 'ㅏ': [222, 190, 70, 120], 'ㅁ': [358, 194, 104, 54], 'ㅜ': [352, 244, 116, 68] };
  const ROWB = (i) => [133 + i * 96, 66, 66, 66];
  const ORDER = ['ㄴ', 'ㅏ', 'ㅁ', 'ㅜ'];
  // a 칸 → b 칸으로 옮기는 transform(원점 0 0, 늘이기)
  const boxT = ([ax, ay, aw, ah], [bx, by, bw, bh]) => { const sx = bw / aw, sy = bh / ah; return `translate(${f(bx - sx * ax)}px, ${f(by - sy * ay)}px) scale(${f(sx)}, ${f(sy)})`; };
  const jamo = (ch, box, col) => glyph(ch, 0, 0, 64, { box, col, dot: col, sw: 6 });
  (function () {
    const id = 't82-k5-moa';
    let css = base(id);
    let body = '';
    ORDER.forEach((ch, i) => {
      body += `<g class="b1"><g class="j${i}">${jamo(ch, BLK[ch], C.ink)}</g></g>`;
      css += `.sc-${id} .j${i} { transform: ${boxT(BLK[ch], ROWB(i))}; transition: transform 1s ease-in-out ${f(0.3 + (i % 2) * 0.1)}s; }
        .on${i < 2 ? 2 : 3} .sc-${id} .j${i} { transform: none; }`;
    });
    body += ORDER.map((ch, i) => at(1, 'fin', `<rect x="${ROWB(i)[0] - 8}" y="58" width="82" height="82" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 5"/>`, 0.1)).join('');
    body += at(2, 'fin', `<rect x="166" y="180" width="140" height="140" rx="14" fill="none" stroke="${C.blue}" stroke-width="3.5"/>`, 0.1);
    body += at(2, 'pop', tag(236, 340, '가로로 묶음', ROLE.s, 19), 1.3);
    body += at(3, 'fin', `<rect x="340" y="180" width="140" height="140" rx="14" fill="none" stroke="${C.green}" stroke-width="3.5"/>`, 0.1);
    body += at(3, 'pop', tag(410, 340, '세로로 묶음', ROLE.p, 19), 1.3);
    body += glowRect(160, 174, 326, 152, 4, C.purple, 0.1, 18);
    body += at(4, 'pop', tag(570, 250, '모아쓰기', ROLE.y, 22), 0.6);
    put(K + '5/모아쓰기', svg(id, body, css));
  })();
  (function () {
    const id = 't82-k5-pureo';
    let css = base(id);
    // 늘어놓은 줄(아래)
    const ROW2 = (i) => [133 + i * 96, 200, 66, 66];
    let body = at(1, 'fin', `<rect x="166" y="20" width="140" height="140" rx="14" fill="none" stroke="${C.line}" stroke-width="2.5"/><rect x="340" y="20" width="140" height="140" rx="14" fill="none" stroke="${C.line}" stroke-width="2.5"/>`, 0.1);
    ORDER.forEach((ch, i) => {
      const up = BLK[ch].slice(); up[1] -= 160;
      const mid = ROW2(i).slice(); mid[1] = 120; mid[0] = ROW2(i)[0] + (i < 2 ? -20 : 20) * (i % 2 ? -1 : 1);
      body += `<g class="b1"><g class="j${i}">${jamo(ch, ROW2(i), C.ink)}</g></g>`;
      css += `.sc-${id} .j${i} { transform: ${boxT(ROW2(i), up)}; transition: transform .9s ease-in-out .2s; }
        .on2 .sc-${id} .j${i} { transform: ${boxT(ROW2(i), [ROW2(i)[0], 112, 66, 66])}; transition-delay: ${f(0.2 + i * 0.12)}s; }
        .on3 .sc-${id} .j${i} { transform: none; transition-delay: .2s; }`;
    });
    body += at(3, 'fin', `<path d="M110 300 H560" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 6"/>`, 0.6);
    ['n', 'a', 'm', 'u'].forEach((l, i) => { body += at(3, 'pop', tag(166 + i * 96, 316, l, ['white', C.muted], 20), 1.0 + i * 0.12); });
    body += glowRect(118, 186, 400, 94, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(565, 120, '풀어쓰기', ROLE.y, 22), 0.6);
    put(K + '5/풀어쓰기', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
