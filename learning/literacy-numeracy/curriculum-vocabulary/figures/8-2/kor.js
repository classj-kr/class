// 국어 8-2(중학교 2학년 2학기) 낱말 도식 첫째 묶음: 3단원 음운과 자음 체계
// 음운·음절·발음 기관·자음, 소리 내는 방법(파열음·마찰음·파찰음·비음·유음), 소리의 세기(예사소리·된소리·거센소리),
// 소리 나는 자리(입술소리·잇몸소리·센입천장소리·여린입천장소리·목청소리).
// 입 옆 단면에서 막는 자리·숨길을 보이고, 칸 3에서 자음 체계표(교과서 배치: 파열·파찰·마찰·비음·유음 × 입술·잇몸·센입천장·여린입천장·목청,
// ㅎ 은 마찰음 예사소리 줄의 목청 칸)로 바뀌며 글자가 제 칸으로 날아간다. 4·5단원은 kor-2.js.
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
  const BAND = { way: [C.peach, C.orange], place: [C.sky, C.blue], power: [C.lilac, C.purple] };

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

  // ═════ 자음 체계표(자리 × 방법 × 세기) — 표준 발음법·교과서 배치 ═════
  const TX = [185.5, 284.5, 383.5, 482.5, 581.5], ROWY = (r) => 56 + 28 * r;
  const PLACE = ['입술', '잇몸', '센입천장', '여린입천장', '목청'];
  // [줄, 열, 글자]  줄: 0~2 파열(예사·된·거센) 3~5 파찰 6~7 마찰(예사·된) 8 비음 9 유음
  const CONS = [[0, 0, 'ㅂ'], [0, 1, 'ㄷ'], [0, 3, 'ㄱ'], [1, 0, 'ㅃ'], [1, 1, 'ㄸ'], [1, 3, 'ㄲ'], [2, 0, 'ㅍ'], [2, 1, 'ㅌ'], [2, 3, 'ㅋ'],
    [3, 2, 'ㅈ'], [4, 2, 'ㅉ'], [5, 2, 'ㅊ'], [6, 1, 'ㅅ'], [6, 4, 'ㅎ'], [7, 1, 'ㅆ'], [8, 0, 'ㅁ'], [8, 1, 'ㄴ'], [8, 3, 'ㅇ'], [9, 1, 'ㄹ']];
  const WAYS = [['파열음', 0, 2], ['파찰음', 3, 5], ['마찰음', 6, 7], ['비음', 8, 8], ['유음', 9, 9]];
  const POWER = ['예사', '된', '거센', '예사', '된', '거센', '예사', '된'];
  const cell = (ch) => { const c = CONS.find((q) => q[2] === ch); return [TX[c[1]], ROWY(c[0])]; };
  const letterTile = (x, y, ch, col = BAND.way) => tile(x, y, ch, { size: 22, h: 26, w: 36, rx: 8, fill: col[0], stroke: col[1], sw: 2.5 });
  // 표: n 칸에 나타남. o.rows / o.cols 는 칠할 줄·열, o.skip 은 날아올 글자(표에는 그리지 않음), o.pop 이면 글자가 차례로 튀어나옴
  const consTable = (id, n, o = {}) => {
    const { rows = [], cols = [], skip = [], pop = false, band = BAND.way, bandDelay = 1.1 } = o;
    let s = `<rect x="8" y="6" width="624" height="316" rx="8" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`;
    rows.forEach((r) => { s += `<rect class="bd" x="10" y="${ROWY(r) - 14}" width="620" height="28" fill="${band[0]}"/>`; });
    cols.forEach((c) => { s += `<rect class="bdc" x="${TX[c] - 49.5}" y="8" width="99" height="312" fill="${BAND.place[0]}"/>`; });
    let grid = 'M8 42 H632';
    for (let r = 1; r < 10; r++) { const y = 42 + 28 * r, major = [3, 6, 8, 9].includes(r); grid += major ? ` M8 ${y} H632` : ` M80 ${y} H632`; }
    grid += ' M80 6 V250 M136 6 V322';
    for (let c = 1; c < 5; c++) grid += ` M${136 + 99 * c} 6 V322`;
    s += `<path d="${grid}" stroke="${C.line}" stroke-width="2" fill="none"/>`;
    s += `<path d="M8 126 H632 M8 210 H632 M8 266 H632 M8 294 H632" stroke="${C.muted}" stroke-width="2" fill="none"/>`;
    PLACE.forEach((l, c) => { s += text(TX[c], 31, l, { size: 18, color: cols.includes(c) ? C.blue : C.ink }); });
    WAYS.forEach(([l, a, b]) => { const x = a >= 8 ? 72 : 44; s += text(x, (ROWY(a) + ROWY(b)) / 2 + 7, l, { size: 19 }); });
    POWER.forEach((l, r) => { s += text(108, ROWY(r) + 6.5, l, { size: 18, color: C.muted, weight: 600 }); });
    let letters = '';
    CONS.forEach(([r, c, ch], i) => {
      if (skip.includes(ch)) return;
      const t = text(TX[c], ROWY(r) + 8, ch, { size: 22 });
      letters += pop ? `<g class="pop pop${n}" style="animation-delay:${f(0.3 + c * 0.18 + r * 0.03)}s">${t}</g>` : t;
    });
    let css = `.sc-${id} .bd { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .7s ease-out ${bandDelay}s; }
      .on${n} .sc-${id} .bd { transform: none; }
      .sc-${id} .bdc { transform-box: fill-box; transform-origin: center top; transform: scaleY(0); transition: transform .7s ease-out ${bandDelay}s; }
      .on${n} .sc-${id} .bdc { transform: none; }`;
    return { body: `<g class="b${n}">${g(`fin fin${n}`, s)}${letters}</g>`, css };
  };
  // 오른쪽 판에 놓였던 글자 조각이 칸 n 에 표의 제 칸으로 날아간다: list = [[글자, 판 x, 판 y]]
  const flyLetters = (id, list, n, col, from = 2) => {
    let body = '', css = '';
    list.forEach(([ch, px, py], i) => {
      const [x, y] = cell(ch), cls = `fl${i}`;
      body += `<g class="b${from}"><g class="${cls}">${g(`pop pop${from}`, letterTile(x, y, ch, col), f(0.6 + i * 0.08))}</g></g>`;
      css += steps(id, cls, `translate(${f(px - x)}px, ${f(py - y)}px)`, [[n, 'none', f(0.2 + i * 0.05)]], { box: false, dur: 0.9 });
    });
    return { body, css };
  };

  // 자리·방법 낱말이 같이 쓰는 틀: 칸 1·2 는 입 단면(왼쪽)과 오른쪽 판, 칸 3 은 표로 바뀌고 글자가 날아감, 칸 4 는 반짝·이름
  // o: { id, key, mouth(입 위 덧그림 — 바탕 틀 좌표), side(오른쪽 판 — 화면 좌표), fly:[[글자,x,y]], rows, cols, glow:[x,y,w,h], band, pop }
  const consScene = (o) => {
    const band = o.band || BAND.way;
    let css = base(o.id) + (o.css || '');
    let body = `<g class="h3"><g class="b1"><g transform="translate(${OX} ${OY})">${g('fin fin1', mouthBase())}${o.mouth || ''}</g></g>${o.side || ''}</g>`;
    const tb = consTable(o.id, 3, { rows: o.rows, cols: o.cols, skip: (o.fly || []).map((q) => q[0]), band, pop: o.pop });
    body += tb.body; css += tb.css;
    if (o.fly) { const fl = flyLetters(o.id, o.fly, 3, o.cols ? BAND.place : band); body += fl.body; css += fl.css; }
    const [gx, gy, gw, gh] = o.glow;
    body += glowRect(gx, gy, gw, gh, 4, o.cols ? C.blue : band[1], 0.1, 6);
    body += at(4, 'pop', tag(320, 341, o.key, ROLE.y, 22), 0.6);
    put(K + '3/' + o.key, svg(o.id, body, css));
  };
  // 오른쪽 판 글자 자리
  const SX3 = [435, 497, 559];
  const fadeOut = (id, cls, n, delay = 0.2) => `.sc-${id} .${cls} { transform-box: fill-box; transform-origin: center; transition: opacity .3s ease ${delay}s, transform .4s ease ${delay}s; } .on${n} .sc-${id} .${cls} { opacity: 0; transform: scale(.3); }`;
  const waysGlow = (a, b) => [8, 42 + 28 * a, 624, 28 * (b - a + 1)];
  const placeGlow = (c) => [136 + 99 * c, 6, 99, 316];

  // ── 3단원: 자음(숨길이 입술·잇몸·여린입천장에서 막힘 → 표 열아홉 자) ──────────────────────────────
  (function () {
    const id = 't82-k3-jaeum';
    const mouth = air(AIR_MOUTH, 1, { delay: 0.4, col: C.blue })
      + at(2, 'pop', blob(PT.lips, 7, 11), 0.2) + at(2, 'pop', blob([92, 145], 9, 6, C.purple), 0.6) + at(2, 'pop', blob([206, 145], 10, 6, C.green), 1.0);
    const side = at(2, 'pop', tile(440, 110, 'ㅂ', { size: 26, h: 44, w: 52, fill: C.peach, stroke: C.red }), 0.3)
      + at(2, 'pop', tile(510, 110, 'ㄷ', { size: 26, h: 44, w: 52, fill: C.lilac, stroke: C.purple }), 0.7)
      + at(2, 'pop', tile(580, 110, 'ㄱ', { size: 26, h: 44, w: 52, fill: C.mint, stroke: C.green }), 1.1)
      + at(2, 'fin', text(440, 162, '입술', { size: 18, color: C.red }) + text(510, 162, '잇몸', { size: 18, color: C.purple }) + text(580, 162, '여린', { size: 18, color: C.green }) + text(580, 184, '입천장', { size: 18, color: C.green }), 1.3);
    consScene({ id, key: '자음', mouth, side, pop: true, glow: [8, 6, 624, 316] });
  })();

  // ── 3단원: 파열음(입술을 꽉 닫아 막았다가 '펑' 터뜨린다 → 표의 파열음 아홉 칸) ──────────────────────────────
  (function () {
    const id = 't82-k3-payeol';
    const css = fadeOut(id, 'bl', 2);
    const mouth = at(1, 'pop', `<g class="bl">${blob(PT.lips, 7, 11)}</g>`, 0.3) + air('M233 330 L233 240 Q234 170 210 150 Q180 142 130 142 Q92 143 60 152', 1, { delay: 0.6 })
      + at(2, 'pop', `<path d="M28 150 L12 140 M26 161 L6 161 M28 172 L12 182" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`, 0.4)
      + air('M60 152 L32 158', 2, { delay: 0.3 });
    const grid = [['ㅂ', 0, 0], ['ㄷ', 1, 0], ['ㄱ', 2, 0], ['ㅃ', 0, 1], ['ㄸ', 1, 1], ['ㄲ', 2, 1], ['ㅍ', 0, 2], ['ㅌ', 1, 2], ['ㅋ', 2, 2]];
    const fly = grid.map(([ch, c, r]) => [ch, SX3[c], 150 + r * 46]);
    const side = at(2, 'pop', tag(34, 250, '펑!', ROLE.r, 20), 0.5);
    consScene({ id, key: '파열음', css, mouth, side, fly, rows: [0, 1, 2], glow: waysGlow(0, 2) });
  })();

  // ── 3단원: 마찰음(혀끝과 윗잇몸 사이 좁은 틈으로 숨을 비벼 낸다 → ㅅ·ㅆ·ㅎ) ──────────────────────────────
  (function () {
    const id = 't82-k3-machal';
    const mouth = drawLine(TPART.tip, C.red, 1, { width: 6, delay: 0.2 })
      + at(1, 'pop', `<path d="M84 146 L100 141 M86 153 L102 149" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/>`, 0.8)
      + air(AIR_MOUTH, 2, { delay: 0.1 }) + at(2, 'fin', fizz(30, 160, 3), 1.0);
    const fly = [['ㅅ', 466, 160], ['ㅆ', 466, 206], ['ㅎ', 590, 160]];
    const side = at(1, 'pop', tag(497, 70, '좁은 틈', ROLE.r, 20), 1.0);
    consScene({ id, key: '마찰음', mouth, side, fly, rows: [6, 7], glow: waysGlow(6, 7) });
  })();

  // ── 3단원: 파찰음(혓바닥으로 센입천장을 막았다가 조금 열어 비빈다 → ㅈ·ㅉ·ㅊ) ──────────────────────────────
  (function () {
    const id = 't82-k3-pachal';
    const css = `.sc-${id} .bl { transform-box: fill-box; transform-origin: center; transition: transform .5s ease .3s; } .on2 .sc-${id} .bl { transform: scale(.8, .3); }`;
    const mouth = drawLine(TPART.blade, C.red, 1, { width: 6, delay: 0.1 }) + at(1, 'pop', `<g class="bl">${blob([146, 140], 16, 8)}</g>`, 0.6)
      + air('M233 330 L233 240 Q234 170 210 150 Q190 144 166 143', 1, { delay: 0.8 })
      + air('M166 143 L130 142 Q92 143 66 154 L10 161', 2, { delay: 0.5 }) + at(2, 'fin', fizz(124, 132, 2) + fizz(30, 160, 3), 1.2);
    const fly = [['ㅈ', 497, 150], ['ㅉ', 497, 196], ['ㅊ', 497, 242]];
    const side = `<g class="h2">${at(1, 'pop', tag(497, 70, '막음', ROLE.r, 20), 1.0)}</g>` + at(2, 'pop', tag(497, 70, '조금 열어 비빔', ROLE.r, 20), 0.6);
    consScene({ id, key: '파찰음', css, mouth, side, fly, rows: [3, 4, 5], glow: waysGlow(3, 5) });
  })();

  // ── 3단원: 비음(입술을 닫고 코로 가는 길을 열어 숨이 코로 나간다 → ㅁ·ㄴ·ㅇ) ──────────────────────────────
  (function () {
    const id = 't82-k3-bieum';
    const css = `.sc-${id} .vel { transform-box: fill-box; transform-origin: 0% 40%; transition: transform .7s ease-in-out .2s; } .on2 .sc-${id} .vel { transform: rotate(30deg); }`;
    const mouth = at(1, 'pop', blob(PT.lips, 7, 11), 0.3) + air('M233 330 L233 240 Q234 170 210 150 Q180 142 130 142 Q92 143 60 152', 1, { delay: 0.6 })
      + air(AIR_NOSE, 2, { delay: 0.6, col: C.blue }) + at(2, 'fin', `<path d="M4 104 q-6 6 0 12 q6 6 0 12" stroke="${C.blue}" stroke-width="3" fill="none"/>`, 1.5);
    const fly = [['ㅁ', 435, 180], ['ㄴ', 497, 180], ['ㅇ', 559, 180]];
    const side = at(2, 'pop', tag(497, 90, '코로', ROLE.s, 20), 1.2);
    consScene({ id, key: '비음', css, mouth, side, fly, rows: [8], glow: waysGlow(8, 8) });
  })();

  // ── 3단원: 유음(혀끝을 윗잇몸에 가볍게 대고 숨을 혀 옆으로 흘린다 → ㄹ) ──────────────────────────────
  (function () {
    const id = 't82-k3-yueum';
    const mouth = drawLine(TPART.tip, C.blue, 1, { width: 6, delay: 0.2 }) + at(1, 'pop', blob([92, 146], 8, 6, C.blue), 0.8)
      + `<g transform="translate(0 -5)">${air(AIR_MOUTH, 2, { delay: 0.1, w: 3 })}</g><g transform="translate(0 6)">${air(AIR_MOUTH, 2, { delay: 0.3, w: 3 })}</g>`;
    const fly = [['ㄹ', 497, 190]];
    const side = at(1, 'pop', tag(497, 70, '가볍게 댐', ROLE.s, 20), 1.0) + at(2, 'pop', tag(497, 120, '혀 옆으로', ROLE.o, 20), 1.0);
    consScene({ id, key: '유음', mouth, side, fly, rows: [9], glow: waysGlow(9, 9) });
  })();

  // ── 소리 나는 자리 다섯(입 단면의 고리 → 오른쪽에 그 자리 글자 → 표의 한 열) ──────────────────────────────
  const placeWord = (key, id, c, p, part, label, letters) => {
    const css = pulseCss(id, '.rg', 1, 0.5);
    let mouth = (part ? drawLine(TPART[part], C.red, 1, { width: 6, delay: 0.1 }) : '') + `<g class="b1"><g class="rg">${ring(p, 17)}</g></g>`;
    if (key === '입술소리') mouth += `<g class="b1"><g class="flash flash1" style="animation-delay:.6s">${blob(PT.lips, 7, 11)}</g></g>`;
    if (key === '목청소리') mouth += at(1, 'fin', fizz(240, 288, 1, C.red), 0.8);
    const fly = letters.map((ch, k) => [ch, 497, letters.length > 4 ? 104 + k * 33 : 130 + k * 44]);
    const side = at(1, 'pop', tag(497, 56, label, ROLE.s, 20), 0.8);
    consScene({ id, key, css, mouth, side, fly, cols: [c], glow: placeGlow(c) });
  };
  placeWord('입술소리', 't82-k3-ipsul', 0, PT.lips, null, '두 입술', ['ㅂ', 'ㅃ', 'ㅍ', 'ㅁ']);
  placeWord('잇몸소리', 't82-k3-itmom', 1, PT.ridge, 'tip', '혀끝과 윗잇몸', ['ㄷ', 'ㄸ', 'ㅌ', 'ㅅ', 'ㅆ', 'ㄴ', 'ㄹ']);
  placeWord('센입천장소리', 't82-k3-senip', 2, PT.hard, 'blade', '혓바닥과 센입천장', ['ㅈ', 'ㅉ', 'ㅊ']);
  placeWord('여린입천장소리', 't82-k3-yeorin', 3, PT.soft, 'back', '혀 뒤와 여린입천장', ['ㄱ', 'ㄲ', 'ㅋ', 'ㅇ']);
  placeWord('목청소리', 't82-k3-mokcheong', 4, PT.glot, null, '목청 사이', ['ㅎ']);

  // ── 소리의 세기 셋(달·딸·탈 — 목 힘과 숨의 세기, 촛불이 흔들리는 정도) ──────────────────────────────
  // 촛불: (x, y) 는 심지 끝
  const candle = (x, y) => `<rect x="${x - 13}" y="${y + 6}" width="26" height="62" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${y + 6} V${y - 2}" stroke="${C.ink}" stroke-width="2.5"/>`;
  const flame = (x, y) => `<path d="M${x} ${y - 40} Q${x + 16} ${y - 16} ${x + 10} ${y - 4} Q${x} ${y + 4} ${x - 10} ${y - 4} Q${x - 16} ${y - 16} ${x} ${y - 40} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
  // 목: 두 줄과, 힘을 주면 가운데로 조이는 화살표
  const neck = (x, y, tight) => `<path d="M${x - 20} ${y - 22} Q${x - (tight ? 10 : 18)} ${y} ${x - 20} ${y + 22} M${x + 20} ${y - 22} Q${x + (tight ? 10 : 18)} ${y} ${x + 20} ${y + 22}" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    + (tight ? `<path d="M${x - 44} ${y} H${x - 26} M${x + 44} ${y} H${x + 26}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/>` + head(x - 25, y, 0, C.red, 3.5) + head(x + 25, y, Math.PI, C.red, 3.5) : '');
  const SYL = [['달', 'ㄷ'], ['딸', 'ㄸ'], ['탈', 'ㅌ']];
  const powerWord = (key, id, k, rows) => {
    let css = base(id);
    const XS = [130, 320, 510];
    let scene = '';
    SYL.forEach(([syl], i) => {
      const x = XS[i], focus = i === k, big = i === 2;
      scene += `<g class="${focus ? 'fc' : 'dm'}">`;
      scene += at(1, 'rise', tile(x, 46, syl, { size: 30, h: 56, w: 76, ...(focus ? { fill: C.lilac, stroke: C.purple } : {}) }), 0.1 + i * 0.15);
      scene += at(1, 'fin', neck(x, 124, i > 0), 0.5 + i * 0.15);
      scene += at(1, 'fin', text(x, 176, i > 0 ? '목에 힘' : '힘 뺌', { size: 18, color: i > 0 ? C.red : C.muted }), 0.7 + i * 0.15);
      // 칸 2: 숨과 촛불
      scene += at(2, 'fin', candle(x + 30, 256), 0.1);
      scene += `<g class="b2"><g class="fl fl${i}">${flame(x + 30, 256)}</g></g>`;
      scene += air(big ? `M${x - 60} 228 H${x + 4}` : `M${x - 50} 228 H${x - 22}`, 2, { col: C.blue, delay: 0.3, w: big ? 6 : 3 });
      if (big) scene += air(`M${x - 56} 212 H${x - 4} M${x - 56} 244 H${x - 4}`, 2, { col: C.blue, delay: 0.45, w: 4 });
      scene += at(2, 'fin', text(x, 344, big ? '숨 많이' : i === 1 ? '숨 적게' : '숨 약하게', { size: 18, color: C.blue }), 1.0);
      scene += '</g>';
      css += `.sc-${id} .fl${i} { transform-box: fill-box; transform-origin: 50% 100%; }
        .on2 .sc-${id} .fl${i} { animation: ${id}-bend${i} 1.4s ease-in-out .5s both; }
        @keyframes ${id}-bend${i} { 0% { transform: none; } 40% { transform: rotate(${big ? 62 : 10}deg) scaleY(${big ? 0.75 : 1}); } 100% { transform: rotate(${big ? 48 : 6}deg) scaleY(${big ? 0.8 : 1}); } }`;
    });
    css += `.sc-${id} .dm { opacity: .38; }`;
    // 고른 글자의 첫소리 조각: 칸 2 에 음절 옆에 나타났다가 칸 3 에 표의 제 칸으로 날아간다
    const ch = SYL[k][1];
    const [cx, cy] = cell(ch);
    let body = `<g class="h3">${scene}</g>`;
    const tb = consTable(id, 3, { rows, band: BAND.power, skip: [ch] });
    body += tb.body; css += tb.css;
    body += `<g class="b2"><g class="fly">${g('pop pop2', letterTile(cx, cy, ch, BAND.power), 1.2)}</g></g>`;
    css += steps(id, 'fly', `translate(${f(XS[k] + 64 - cx)}px, ${f(46 - cy)}px)`, [[3, 'none', 0.3]], { box: false, dur: 0.9 });
    rows.forEach((r, i) => { body += glowRect(8, ROWY(r) - 14, 624, 28, 4, C.purple, 0.1 + i * 0.1, 4); });
    body += at(4, 'pop', tag(320, 341, key, ROLE.y, 22), 0.6);
    put(K + '3/' + key, svg(id, body, css));
  };
  powerWord('예사소리', 't82-k3-yesa', 0, [0, 3, 6]);
  powerWord('된소리', 't82-k3-doen', 1, [1, 4, 7]);
  powerWord('거센소리', 't82-k3-geosen', 2, [2, 5]);

  // ── 3단원: 발음 기관(입 단면에 입술·이·혀 → 입천장·목청·코 이름이 붙는다) ──────────────────────────────
  (function () {
    const id = 't82-k3-bareum';
    let css = base(id);
    const ox = 130, oy = 10, P = (p) => [ox + p[0], oy + p[1]];
    let body = `<g class="b1"><g transform="translate(${ox} ${oy})">${g('fin fin1', mouthBase())}</g></g>`;
    // [이름, 점, 이름표 x, y, 칸, 차례]
    const L = [['입술', PT.lips, 60, 214, 2, 0], ['이', PT.teeth, 60, 120, 2, 1], ['혀', [130, 176], 560, 236, 2, 2],
      ['센입천장', PT.hard, 560, 96, 3, 0], ['여린입천장', PT.soft, 560, 146, 3, 1], ['목청', PT.glot, 560, 302, 3, 2], ['코', PT.nose, 560, 46, 3, 3]];
    L.forEach(([l, p, x, y, n, k]) => {
      const [px, py] = P(p), left = x < 200;
      body += drawLine(`M${f(px)} ${f(py)} L${left ? x + 30 : x - 56} ${y}`, C.muted, n, { width: 2.5, delay: 0.1 + k * 0.2 });
      body += at(n, 'pop', `<circle cx="${f(px)}" cy="${f(py)}" r="5" fill="${C.red}"/>`, 0.1 + k * 0.2);
      body += at(n, 'pop', tag(x, y, l, n === 2 ? ROLE.o : ROLE.s, 20), 0.6 + k * 0.2);
    });
    body += at(2, 'fin', `<path d="${TONGUE}" transform="translate(${ox} ${oy})" fill="none" stroke="${C.red}" stroke-width="3.5"/>`, 0.6);
    body += glowRect(ox, oy, 300, 340, 4, C.green, 0.1, 10);
    body += at(4, 'pop', tag(560, 340, '발음 기관', ROLE.y, 22), 0.6);
    put(K + '3/발음 기관', svg(id, body, css));
  })();

  // ── 3단원: 음운(감 → ㄱ·ㅏ·ㅁ, ㄱ 을 ㅂ 으로 바꾸면 밤 — 뜻이 갈린다) ──────────────────────────────
  const persimmon = (x, y) => `<circle cx="${x}" cy="${y}" r="34" fill="${C.orange}" stroke="#b55f1f" stroke-width="3"/><path d="M${x} ${y - 30} l-18 -8 l10 12 l-14 4 l16 2 l6 0 l6 0 l16 -2 l-14 -4 l10 -12 Z" fill="${C.green}"/>`;
  const chestnut = (x, y) => `<path d="M${x - 32} ${y + 18} Q${x - 34} ${y - 14} ${x} ${y - 36} Q${x + 34} ${y - 14} ${x + 32} ${y + 18} Q${x} ${y + 34} ${x - 32} ${y + 18} Z" fill="#9a5b2a" stroke="${C.ink}" stroke-width="3"/><path d="M${x - 30} ${y + 16} Q${x} ${y + 30} ${x + 30} ${y + 16} Q${x} ${y + 6} ${x - 30} ${y + 16} Z" fill="${C.peach}"/>`;
  (function () {
    const id = 't82-k3-eumun';
    let css = base(id);
    let body = `<g class="h3">${at(1, 'pop', tile(220, 76, '감', { size: 44, h: 80, w: 100 }))}${at(1, 'pop', persimmon(420, 76), 0.4)}</g>`;
    // 칸 2: 낱소리로 쪼개진다
    const X = [190, 280, 370];
    body += [0, 1, 2].map((i) => drawLine(`M220 118 L${X[i]} 172`, C.muted, 2, { width: 2.5, delay: 0.1 + i * 0.1 })).join('');
    body += `<g class="h3">${at(2, 'pop', tile(X[0], 210, 'ㄱ', { size: 36, h: 66, w: 72 }), 0.5)}</g>`;
    body += at(2, 'pop', tile(X[1], 210, 'ㅏ', { size: 36, h: 66, w: 72 }), 0.65) + at(2, 'pop', tile(X[2], 210, 'ㅁ', { size: 36, h: 66, w: 72 }), 0.8);
    // 칸 3: ㄱ 이 빠지고 ㅂ 이 들어와 '밤'
    body += `<g class="b3 h4"><g class="out">${tile(X[0], 210, 'ㄱ', { size: 36, h: 66, w: 72 })}</g></g>`;
    css += `.on3 .sc-${id} .out { animation: ${id}-out .7s ease-in both; } @keyframes ${id}-out { to { transform: translate(-70px, 90px) rotate(-30deg); opacity: 0; } }`;
    body += `<g class="b3"><g class="in">${tile(X[0], 210, 'ㅂ', { size: 36, h: 66, w: 72, fill: C.peach, stroke: C.red })}</g></g>`;
    css += steps(id, 'in', 'translate(0px, -120px)', [[3, 'none', 0.5]], { box: false, dur: 0.8 });
    body += at(3, 'pop', tile(220, 76, '밤', { size: 44, h: 80, w: 100, fill: C.peach, stroke: C.red }), 1.2) + at(3, 'pop', chestnut(420, 76), 1.4);
    body += at(3, 'pop', tag(540, 76, '뜻이 달라짐', ROLE.r, 19), 1.6);
    // 칸 4
    body += glowRect(X[0] - 44, 170, 88, 80, 4, C.red, 0.1, 14);
    body += at(4, 'pop', tag(280, 300, '음운', ROLE.y, 24), 0.6);
    put(K + '3/음운', svg(id, body, css));
  })();

  // ── 3단원: 음절(아이스크림 — 손뼉 한 번에 한 덩어리, 다섯 번) ──────────────────────────────
  (function () {
    const id = 't82-k3-eumjeol';
    let css = base(id);
    const S = ['아', '이', '스', '크', '림'];
    let body = `<g class="h2">${at(1, 'pop', tile(320, 90, '아이스크림', { size: 40, h: 76, w: 270 }))}</g>`;
    S.forEach((ch, i) => {
      const x = 120 + i * 100;
      body += `<g class="b2"><g class="s${i}">${tile(x, 190, ch, { size: 40, h: 76, w: 80, fill: C.sky, stroke: C.blue })}</g></g>`;
      css += steps(id, `s${i}`, `translate(${f(320 - 108 + i * 54 - x)}px, -100px)`, [[2, 'none', 0.1]], { box: false, dur: 0.6 });
      body += at(2, 'pop', tag(x, 110, '짝', ROLE.o, 22), 0.7 + i * 0.2) + at(2, 'pop', badge(x, 268, i + 1, C.blue), 0.8 + i * 0.2);
    });
    body += glowRect(76, 146, 88, 88, 3, C.blue, 0.1, 14);
    body += at(3, 'fin', text(120, 330, '한 덩어리', { size: 20, color: C.blue }), 0.4);
    body += at(3, 'pop', tag(420, 330, '음절', ROLE.y, 24), 0.7);
    put(K + '3/음절', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
