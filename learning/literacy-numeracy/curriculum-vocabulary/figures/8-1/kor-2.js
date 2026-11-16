// 국어 8-1(중학교 2학년 1학기) 낱말 도식 둘째 묶음:
// 4단원 능동 표현·피동 표현(경찰이 도둑을 잡았다 ↔ 도둑이 경찰에게 잡혔다)·인용 표현·직접 인용·간접 인용,
// 5단원 반어·역설, 6단원 숏·앵글·클로즈업(카메라 틀). 1~3단원은 kor.js.
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

  const K = '8-1/국어/';
  const PUR = [C.lilac, C.purple];
  const neq = (x, y, col = C.red) => `<path d="M${x - 14} ${y - 6} H${x + 14} M${x - 14} ${y + 6} H${x + 14} M${x + 7} ${y - 15} L${x - 7} ${y + 15}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
  // 얼굴 있는 사람(눈·입) — person 과 같은 자리, r 크기
  const face = (x, y, r) => {
    const hy = y - r - 14 * r / 18;
    return `<circle cx="${f(x - r * 0.35)}" cy="${f(hy - r * 0.1)}" r="${f(r * 0.12)}" fill="${C.ink}"/><circle cx="${f(x + r * 0.35)}" cy="${f(hy - r * 0.1)}" r="${f(r * 0.12)}" fill="${C.ink}"/><path d="M${f(x - r * 0.35)} ${f(hy + r * 0.32)} Q${x} ${f(hy + r * 0.6)} ${f(x + r * 0.35)} ${f(hy + r * 0.32)}" stroke="${C.ink}" stroke-width="${f(Math.max(2, r * 0.1))}" fill="none" stroke-linecap="round"/>`;
  };
  const headOf = (y, r) => y - r - 14 * r / 18;
  // 말풍선: 조각 아래(또는 위)로 꼬리
  const bubble = (cx, cy, label, { size = 22, h = 48, tail = [0, 1], col = [C.lilac, C.purple], w } = {}) => {
    const W = w || wOf(label, size), [tx, dir] = tail, ty = cy + dir * h / 2;
    return `<path d="M${f(cx + tx - 10)} ${f(ty - dir * 2)} L${f(cx + tx - 16)} ${f(ty + dir * 18)} L${f(cx + tx + 8)} ${f(ty - dir * 2)} Z" fill="${col[0]}" stroke="${col[1]}" stroke-width="3" stroke-linejoin="round"/>`
      + tile(cx, cy, label, { size, h, w: W, fill: col[0], stroke: col[1], rx: 20 }) + `<path d="M${f(cx + tx - 9)} ${f(ty - dir * 1.5)} H${f(cx + tx + 6)}" stroke="${col[0]}" stroke-width="4"/>`;
  };

  // ═════ 4단원: 피동 표현과 인용 표현 ═════
  // 경찰(모자)과 도둑(눈가리개)
  const cop = (x, y, r = 26) => person(x, y, C.blue, r) + `<path d="M${f(x - r * 1.05)} ${f(headOf(y, r) - r * 0.45)} Q${x} ${f(headOf(y, r) - r * 1.35)} ${f(x + r * 1.05)} ${f(headOf(y, r) - r * 0.45)} Z" fill="${C.ink}"/><path d="M${f(x - r * 1.2)} ${f(headOf(y, r) - r * 0.45)} H${f(x + r * 1.2)}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` + face(x, y, r);
  const thief = (x, y, r = 26) => person(x, y, C.orange, r) + face(x, y, r) + `<rect x="${f(x - r * 0.9)}" y="${f(headOf(y, r) - r * 0.32)}" width="${f(r * 1.8)}" height="${f(r * 0.42)}" rx="${f(r * 0.2)}" fill="${C.ink}" opacity=".85"/><circle cx="${f(x - r * 0.35)}" cy="${f(headOf(y, r) - r * 0.1)}" r="${f(r * 0.11)}" fill="white"/><circle cx="${f(x + r * 0.35)}" cy="${f(headOf(y, r) - r * 0.1)}" r="${f(r * 0.11)}" fill="white"/>`;
  const SUBJ = [C.sky, C.blue];

  // ── 4단원: 능동 표현(경찰이 도둑을 잡았다 — 주어가 제 힘으로 직접 한다) ──────────────────────────────
  (function () {
    const id = 't81-k4-neungdong';
    let css = base(id);
    let body = at(1, 'pop', `<g class="cp">${cop(170, 136)}</g>`) + at(1, 'pop', `<g class="th">${thief(470, 136)}</g>`, 0.2);
    const R = row(['경찰이', '도둑을', '잡았다'], { y: 250, cx: 320, size: 28, gap: 16 });
    body += R.map((p, i) => at(1, 'rise', `<g class="w${i}">${T(p, { h: 56 })}</g>`, 0.5 + i * 0.15)).join('');
    // 칸 2: 주어
    css += paint(id, '.w0', SUBJ, 2, 0.2) + pulseCss(id, '.w0', 2, 0.3);
    body += at(2, 'pop', tag(R[0].cx, 308, '주어', SUBJ, 20), 0.6);
    // 칸 3: 경찰이 직접 잡는다
    body += drawArrow(214, 104, 424, 104, C.blue, 3, { width: 5, delay: 0.1 });
    css += `.on3 .sc-${id} .th { animation: ${id}-shake .5s ease-in-out 1s 2; }`;
    body += at(3, 'pop', tag(170, 196, '하는 쪽', SUBJ, 20), 0.4);
    // 칸 4
    body += glowRect(R[0].l - 8, 214, R[0].w + 16, 72, 4, C.blue, 0.1, 14) + glowRect(116, 44, 108, 176, 4, C.blue, 0.3, 16);
    body += at(4, 'pop', tag(470, 196, '능동 표현', ROLE.y, 22), 0.7);
    put(K + '4/능동 표현', svg(id, body, css));
  })();

  // ── 4단원: 피동 표현(경찰이 도둑을 잡았다 → 도둑이 경찰에게 잡혔다 — 주어가 당하는 쪽) ──────────────────────────────
  (function () {
    const id = 't81-k4-pidong';
    let css = base(id);
    let body = at(1, 'pop', cop(170, 136)) + at(1, 'pop', `<g class="th">${thief(470, 136)}</g>`, 0.2);
    const A = row(['경찰이', '도둑을', '잡았다'], { y: 250, cx: 320, size: 28, gap: 16 });
    const V = row(['도둑이', '경찰에게', '잡혔다'], { y: 250, cx: 320, size: 28, gap: 16 });
    body += `<g class="h2">${A.map((p, i) => at(1, 'rise', T(p, { h: 56 }), 0.4 + i * 0.15)).join('')}</g>`;
    // 칸 2: 조각이 자리를 바꾸며 피동 문장이 된다(도둑이 ← 도둑을, 경찰에게 ← 경찰이, 잡혔다 ← 잡았다)
    const SRC = [1, 0, 2], ARC = [-70, 70, 0];
    V.forEach((p, i) => {
      const dx = f(A[SRC[i]].cx - p.cx);
      body += `<g class="b2"><g class="v${i}">${T(p, { h: 56, ...(i === 2 ? { fill: C.peach, stroke: C.orange } : {}) })}</g></g>`;
      css += `@keyframes ${id}-v${i} { 0% { transform: translate(${dx}px, 0px); } 50% { transform: translate(${f(dx / 2)}px, ${ARC[i]}px); } 100% { transform: none; } }
        .on2 .sc-${id} .v${i} { animation: ${id}-v${i} 1.1s ease-in-out .3s both; }`;
    });
    // 칸 3: 주어가 당하는 쪽
    css += paint(id, '.v0', SUBJ, 3, 0.1) + pulseCss(id, '.v0', 3, 0.2);
    body += at(3, 'pop', tag(V[0].cx, 308, '주어', SUBJ, 20), 0.4);
    body += drawArrow(214, 104, 424, 104, C.muted, 3, { width: 5, delay: 0.2 });
    css += `.on3 .sc-${id} .th { animation: ${id}-shake .5s ease-in-out 1.1s 2; }`;
    body += at(3, 'pop', tag(470, 196, '당하는 쪽', SUBJ, 20), 0.6);
    // 칸 4
    body += glowRect(V[0].l - 8, 214, V[0].w + 16, 72, 4, C.blue, 0.1, 14) + glowRect(416, 44, 108, 176, 4, C.blue, 0.3, 16);
    body += at(4, 'pop', tag(320, 160, '피동 표현', ROLE.y, 22), 0.7);
    put(K + '4/피동 표현', svg(id, body, css));
  })();

  // 인용: 말한 사람과 말풍선, 아래 내 문장
  // ── 4단원: 인용 표현(선생님 말씀을 끌어와 내 문장에 넣고 '라고'·'고'로 잇는다) ──────────────────────────────
  (function () {
    const id = 't81-k4-inyong';
    let css = base(id);
    let body = at(1, 'pop', person(80, 140, C.green, 26) + face(80, 140, 26));
    body += at(1, 'fin', text(80, 204, '선생님', { size: 19, color: C.green }), 0.3);
    body += `<g class="h2">${at(1, 'pop', bubble(300, 74, '체육복을 챙겨라.', { size: 24, tail: [-90, 1], col: [C.mint, C.green] }), 0.5)}</g>`;
    // 칸 2: 말이 내 문장 속으로
    const R = row(['선생님께서', '“체육복을 챙겨라.”', '라고', '하셨다'], { y: 250, cx: 320, size: 22, gap: 8 });
    body += at(2, 'rise', T(R[0], { h: 48 }) + T(R[3], { h: 48 }), 0.9);
    body += `<g class="b2"><g class="q">${T(R[1], { h: 48, fill: C.mint, stroke: C.green })}</g></g>`;
    css += steps(id, 'q', `translate(${f(300 - R[1].cx)}px, ${74 - 250}px)`, [[2, 'none', 0.2]], { box: false });
    body += at(2, 'pop', `<g class="ra">${T(R[2], { h: 48, fill: C.lilac, stroke: C.purple })}</g>`, 1.2);
    // 칸 3: '라고'·'고'
    css += pulseCss(id, '.ra', 3, 0.1);
    const R2 = row(['선생님께서', '체육복을 챙기라', '고', '하셨다'], { y: 316, cx: 320, size: 22, gap: 8 });
    body += R2.map((p, i) => at(3, 'rise', T(p, { h: 48, ...(i === 1 ? { fill: C.mint, stroke: C.green } : i === 2 ? { fill: C.lilac, stroke: C.purple } : {}) }), 0.5 + i * 0.12)).join('');
    // 칸 4
    body += glowRect(R[2].l - 6, 220, R[2].w + 12, 60, 4, C.purple, 0.1, 12) + glowRect(R2[2].l - 6, 286, R2[2].w + 12, 60, 4, C.purple, 0.3, 12);
    body += at(4, 'pop', tag(320, 120, '인용 표현', ROLE.y, 24), 0.7);
    put(K + '4/인용 표현', svg(id, body, css));
  })();

  // 직접·간접 인용이 같이 쓰는 장면: 동생과 '배고파!'
  const quoteScene = (id, direct) => {
    let css = base(id);
    let body = at(1, 'pop', person(90, 150, C.orange, 26) + face(90, 150, 26));
    body += at(1, 'fin', text(90, 214, '동생', { size: 19, color: C.orange }), 0.3);
    body += at(1, 'pop', `<g class="bb">${bubble(250, 86, direct ? '배고파!' : '배고파!', { size: 26, h: 54, tail: [-50, 1], col: [C.peach, C.orange], w: 130 })}</g>`, 0.5);
    const labels = direct ? ['동생이', '“배고파!”', '라고', '했다'] : ['동생이', '배고프다', '고', '했다'];
    const R = row(labels, { y: 272, cx: 320, size: 28, gap: 12 });
    body += at(2, 'rise', T(R[0], { h: 58 }), 0.1);
    // 칸 2: 말풍선 속 말이 아래 문장으로 내려온다
    if (direct) {
      body += `<g class="b2"><g class="q">${T(R[1], { h: 58, fill: C.peach, stroke: C.orange })}</g></g>`;
      css += steps(id, 'q', `translate(${f(250 - R[1].cx)}px, ${86 - 272}px)`, [[2, 'none', 0.3]], { box: false });
      css += `.sc-${id} .bb { transition: opacity .4s ease .3s; } .on2 .sc-${id} .bb { opacity: .35; }`;
      body += at(2, 'pop', tag(R[1].cx, 214, '그대로', ROLE.p, 20), 1.3);
      // 큰따옴표가 반짝인다
      css += `.on2 .sc-${id} .q .tx { animation: ${id}-flash 1s ease-in-out .9s both; }`;
    } else {
      body += `<g class="h3"><g class="b2"><g class="q">${tile(R[1].cx, 272, '배고파!', { size: 28, h: 58, w: R[1].w, fill: C.peach, stroke: C.orange })}</g></g></g>`;
      css += steps(id, 'q', `translate(${f(250 - R[1].cx)}px, ${86 - 272}px)`, [[2, 'none', 0.2]], { box: false, dur: 0.9 });
      css += `.sc-${id} .bb { transition: opacity .4s ease .3s; } .on2 .sc-${id} .bb { opacity: .35; }`;
      // 같은 자리에서 '배고프다'로 바뀐다
      body += `<g class="b2"><g class="nw">${T(R[1], { h: 58, fill: C.mint, stroke: C.green })}</g></g>`;
      css += `.sc-${id} .nw { opacity: 0; transition: opacity .4s ease 1.2s; } .on2 .sc-${id} .nw { opacity: 1; }
        .sc-${id} .b2 .q { transition: transform .9s ease-in-out .2s, opacity .3s ease 1.2s; } .on2 .sc-${id} .b2 .q { opacity: 0; }`;
      body += at(2, 'pop', tag(R[1].cx, 214, '내 말로', ROLE.p, 20), 1.4);
    }
    // 칸 3: '라고' / '고'
    body += `<g class="b3"><g class="jo">${T(R[2], { h: 58, fill: C.lilac, stroke: C.purple })}</g></g>` + at(3, 'rise', T(R[3], { h: 58 }), 0.9);
    css += steps(id, 'jo', 'translate(0px, 60px)', [[3, 'none', 0.2]], { box: false, dur: 0.7 });
    css += pulseCss(id, '.jo .tl', 3, 0.7);
    body += glowRect(R[1].l - 8, 234, R[2].r - R[1].l + 16, 76, 4, C.purple, 0.1, 14);
    body += at(4, 'pop', tag(500, 170, direct ? '직접 인용' : '간접 인용', ROLE.y, 24), 0.7);
    return svg(id, body, css);
  };
  put(K + '4/직접 인용', quoteScene('t81-k4-jikjeop', true));
  put(K + '4/간접 인용', quoteScene('t81-k4-ganjeop', false));

  // ═════ 5단원: 반어·역설 ═════
  const cloudP = (x, y, s = 1, fill = 'white', stroke = C.blue, dash = '') => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `<path d="M${P(-62, 28)} C${P(-90, 28)} ${P(-86, -14)} ${P(-56, -10)} C${P(-54, -44)} ${P(-10, -50)} ${P(2, -24)} C${P(16, -52)} ${P(66, -44)} ${P(58, -6)} C${P(88, -6)} ${P(90, 28)} ${P(62, 28)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  // ── 5단원: 반어(비에 흠뻑 젖고도 '날씨 정말 좋다!' — 속마음과 반대로 말한다) ──────────────────────────────
  (function () {
    const id = 't81-k5-baneo';
    let css = base(id);
    let body = at(1, 'pop', cloudP(130, 62, 0.95, '#e6ecef', C.muted));
    // 빗줄기 두 무리가 한 번씩 떨어진다
    const drops = (dx) => [-50, -22, 6, 34, 62].map((x, i) => `<path d="M${130 + x + dx} ${100 + (i % 2) * 14} l-5 16" stroke="${C.blue}" stroke-width="3.5" stroke-linecap="round"/>`).join('');
    body += `<g class="b1"><g class="rn rn1">${drops(-6)}</g><g class="rn rn2">${drops(8)}</g></g>`;
    css += `@keyframes ${id}-rain { 0% { transform: translateY(-16px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(44px); opacity: 1; } }
      .on1 .sc-${id} .rn1 { animation: ${id}-rain 1s ease-in .2s both; } .on1 .sc-${id} .rn2 { animation: ${id}-rain 1s ease-in .7s both; }`;
    body += at(1, 'pop', person(130, 254, C.blue, 28) + `<path d="M92 206 q-5 9 0 14 q5 -5 0 -14 Z M168 210 q-5 9 0 14 q5 -5 0 -14 Z" fill="${C.blue}"/>`, 0.3);
    // 얼굴: 축 처진 눈썹과 입
    const hy = headOf(254, 28);
    body += at(1, 'fin', `<path d="M117 ${f(hy - 4)} l9 -5 M143 ${f(hy - 4)} l-9 -5 M120 ${f(hy + 12)} q10 -7 20 0" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>`, 0.6);
    // 칸 2: 겉으로 한 말
    body += at(2, 'pop', `<g class="sp">${bubble(380, 92, '날씨 정말 좋다!', { size: 26, h: 56, tail: [-110, 1], col: [C.peach, C.orange] })}</g>`, 0.2);
    body += at(2, 'fin', text(380, 42, '겉으로 한 말', { size: 19, color: C.orange }), 0.6);
    // 칸 3: 속마음(점선 생각 구름)과 반대 화살표
    body += at(3, 'pop', cloudP(420, 270, 0.95, 'white', C.blue, '8 6') + text(420, 280, '날씨 싫다', { size: 24, color: C.blue }) + `<circle cx="300" cy="272" r="7" fill="white" stroke="${C.blue}" stroke-width="3" stroke-dasharray="4 3"/><circle cx="278" cy="268" r="4.5" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`, 0.1);
    body += at(3, 'fin', text(540, 216, '속마음', { size: 19, color: C.blue }), 0.5);
    body += drawLine('M420 132 V204', C.red, 3, { width: 4, delay: 0.7 }) + at(3, 'fin', head(420, 132, -Math.PI / 2, C.red, 4) + head(420, 204, Math.PI / 2, C.red, 4), 1.5);
    body += at(3, 'pop', tag(488, 168, '반대', ROLE.r, 20), 1.2);
    // 칸 4
    body += glowRect(258, 56, 244, 72, 4, C.orange, 0.1, 22);
    body += at(4, 'pop', tag(588, 92, '반어', ROLE.y, 24), 0.6);
    put(K + '5/반어', svg(id, body, css));
  })();

  // ── 5단원: 역설('바쁠수록 돌아가라' — 겉으로는 맞지 않는 두 말 사이에서 참뜻이 나온다) ──────────────────────────────
  (function () {
    const id = 't81-k5-yeokseol';
    let css = base(id);
    const R = row(['바쁠수록', '돌아가라'], { y: 80, cx: 320, size: 30, gap: 12 });
    let body = '';
    R.forEach((p, i) => { body += `<g class="b1"><g class="t${i}">${g('rise rise1', T(p, { h: 62 }), 0.1 + i * 0.25)}</g></g>`; });
    // 칸 2: 둘이 벌어지며 부딪친다 — '빨리'와 '천천히'
    css += steps(id, 't0', 'none', [[2, 'translate(-110px, 0px)', 0.1]], { box: false, dur: 0.7 }) + steps(id, 't1', 'none', [[2, 'translate(110px, 0px)', 0.1]], { box: false, dur: 0.7 });
    css += paint(id, '.t0', ROLE.o, 2, 0.4) + paint(id, '.t1', ROLE.s, 2, 0.4);
    body += at(2, 'pop', tag(R[0].cx - 110, 142, '빨리', ROLE.o, 20) + tag(R[1].cx + 110, 142, '천천히', ROLE.s, 20), 0.8);
    body += at(2, 'pop', `<g class="qq"><circle cx="320" cy="80" r="26" fill="white" stroke="${C.red}" stroke-width="3.5"/>${text(320, 91, '?', { size: 30, color: C.red })}</g>`, 1.1);
    css += `.on2 .sc-${id} .qq { animation: ${id}-shake .5s ease-in-out 1.6s 1; }`;
    // 칸 3: 가운데에서 참뜻이 솟아난다
    body += drawLine('M320 112 V214', C.green, 3, { width: 4, delay: 0.1 });
    body += at(3, 'pop', tile(320, 252, '서두를수록 차근차근', { size: 26, h: 60, fill: C.mint, stroke: C.green }), 0.8);
    body += at(3, 'fin', text(320, 316, '참뜻', { size: 20, color: C.green }), 1.2);
    body += at(3, 'pop', check(500, 252), 1.3);
    // 칸 4
    body += glowRect(R[0].l - 120, 40, R[1].r - R[0].l + 240, 126, 4, C.purple, 0.1, 18);
    body += at(4, 'pop', tag(110, 252, '역설', ROLE.y, 24), 0.6);
    put(K + '5/역설', svg(id, body, css));
  })();

  // ═════ 6단원: 카메라 틀 ═════
  // 카메라: (x, y) 가운데, 렌즈가 오른쪽
  const camera = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `<circle cx="${f(x - 18 * s)}" cy="${f(y - 34 * s)}" r="${f(14 * s)}" fill="white" stroke="${C.ink}" stroke-width="${f(3 * s)}"/><circle cx="${f(x + 14 * s)}" cy="${f(y - 34 * s)}" r="${f(14 * s)}" fill="white" stroke="${C.ink}" stroke-width="${f(3 * s)}"/>`
      + `<rect x="${f(x - 40 * s)}" y="${f(y - 20 * s)}" width="${f(66 * s)}" height="${f(42 * s)}" rx="${f(7 * s)}" fill="${C.ink}"/>`
      + `<path d="M${P(26, -6)} L${P(46, -18)} L${P(46, 20)} L${P(26, 8)} Z" fill="${C.ink}"/>`;
  };
  // ── 6단원: 숏(카메라가 돌기 시작해 멈출 때까지 한 토막, 토막이 모여 장면) ──────────────────────────────
  (function () {
    const id = 't81-k6-shot';
    let css = base(id);
    let body = at(1, 'pop', camera(90, 96, 1.3));
    body += `<g class="h2"><g class="b1"><circle class="flash flash1" cx="150" cy="44" r="10" fill="${C.red}"/></g>${at(1, 'fin', text(186, 51, 'REC', { size: 19, color: C.red }), 0.1)}</g>`;
    body += `<g class="b2"><g class="pop pop2"><rect x="141" y="35" width="18" height="18" rx="3" fill="${C.ink}"/></g></g>`;
    body += at(2, 'fin', text(188, 51, '멈춤', { size: 19, color: C.ink }), 0.1);
    // 필름 띠: 아래에 바탕 줄, 토막이 왼쪽부터 늘어난다
    const strip = (x, w, col, cls) => `<g class="${cls}"><rect x="${x}" y="190" width="${w}" height="56" rx="6" fill="${col[0]}" stroke="${col[1]}" stroke-width="3"/>`
      + Array.from({ length: Math.floor(w / 26) }, (_, i) => `<rect x="${x + 9 + i * 26}" y="197" width="12" height="8" rx="2" fill="white"/><rect x="${x + 9 + i * 26}" y="231" width="12" height="8" rx="2" fill="white"/>`).join('') + '</g>';
    body += at(1, 'fin', `<path d="M30 218 H610" stroke="${C.line}" stroke-width="4" stroke-dasharray="10 8"/>`);
    body += `<g class="b1">${strip(40, 208, ROLE.o, 's1')}</g>`;
    css += growCss(id, '.s1', 1, { delay: 0.3, dur: 1.6 });
    body += drawLine('M90 130 L60 184', C.muted, 1, { width: 2.5, delay: 0.1 });
    // 칸 2: 멈춤 — 한 토막
    body += at(2, 'fin', `<path d="M40 262 Q40 276 54 276 H130 Q144 276 144 290 Q144 276 158 276 H234 Q248 276 248 262" stroke="${C.orange}" stroke-width="3.5" fill="none"/>`, 0.3);
    body += `<g class="h4">${at(2, 'pop', tag(144, 312, '한 토막', ROLE.o, 20), 0.6)}</g>`;
    // 칸 3: 다른 토막들, 모여 장면
    body += `<g class="b3">${strip(258, 156, ROLE.s, 's2')}${strip(424, 182, ROLE.p, 's3')}</g>`;
    css += growCss(id, '.s2', 3, { delay: 0.1, dur: 0.6 }) + growCss(id, '.s3', 3, { delay: 0.7, dur: 0.6 });
    body += at(3, 'fin', `<path d="M40 176 Q40 160 56 160 H306 Q323 160 323 144 Q323 160 340 160 H590 Q606 160 606 176" stroke="${C.green}" stroke-width="3.5" fill="none"/>`, 1.3);
    body += at(3, 'pop', tag(323, 124, '장면', ROLE.p, 20), 1.5);
    // 칸 4: 토막마다 숏
    body += glowRect(34, 184, 220, 68, 4, C.orange, 0.1, 10);
    body += at(4, 'pop', tag(144, 312, '숏', ROLE.y, 24), 0.5);
    body += at(4, 'pop', tag(336, 312, '숏', ['white', C.muted], 20) + tag(515, 312, '숏', ['white', C.muted], 20), 0.9);
    put(K + '6/숏', svg(id, body, css));
  })();

  // ── 6단원: 앵글(눈높이 → 위에서 내려다보면 작게, 아래에서 올려다보면 크게) ──────────────────────────────
  (function () {
    const id = 't81-k6-angle';
    let css = base(id);
    const SX = 300, SYb = 288, R = 30, hy = headOf(SYb, R);
    let body = at(1, 'fin', `<path d="M20 ${SYb + 1.5 * R + 2} H420" stroke="${C.muted}" stroke-width="3"/>`);
    body += at(1, 'pop', person(SX, SYb, C.orange, R) + face(SX, SYb, R));
    // 카메라 세 자리: [x, y, 돌림]
    const POS = [[110, f(hy), 0], [130, 66, 34], [130, 300, -34]];
    body += `<g class="b1"><g class="cm">${camera(0, 0, 1)}</g></g>`;
    const tr = ([x, y, a]) => `translate(${x}px, ${y}px) rotate(${a}deg)`;
    css += `.sc-${id} .cm { transform: ${tr(POS[0])}; transition: transform 1s ease-in-out .2s; }
      .on2 .sc-${id} .cm { transform: ${tr(POS[1])}; } .on3 .sc-${id} .cm { transform: ${tr(POS[2])}; }`;
    // 눈길 점선
    const sight = (n, [x, y]) => `<path d="M${x + 50} ${y} L${SX - R - 8} ${f(hy)}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="7 6"/>`;
    body += `<g class="h2">${at(1, 'fin', sight(1, POS[0]), 0.6)}</g>`;
    body += `<g class="h3">${at(2, 'fin', `<path d="M168 92 L${SX - R - 6} ${f(hy - 10)}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="7 6"/>`, 1.1)}</g>`;
    body += at(3, 'fin', `<path d="M168 276 L${SX - R - 6} ${f(hy + 10)}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="7 6"/>`, 1.1);
    // 오른쪽 화면: 찍힌 모습
    body += at(1, 'fin', `<rect x="446" y="48" width="170" height="230" rx="10" fill="white" stroke="${C.ink}" stroke-width="3.5"/>`, 0.4);
    body += `<g class="b1"><g class="pv">${person(531, 210, C.orange, 26)}${face(531, 210, 26)}</g></g>`;
    css += `.sc-${id} .pv { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .8s ease-in-out .9s; }
      .on2 .sc-${id} .pv { transform: scale(.6); } .on3 .sc-${id} .pv { transform: scale(1.42); }`;
    const lab = (n, l, last) => `<g class="h${n + 1}">${at(n, 'pop', tag(531, 312, l, ROLE.s, 20), 1.2)}</g>`;
    body += lab(1, '눈높이') + lab(2, '내려다봄') + at(3, 'pop', tag(531, 312, '올려다봄', ROLE.s, 20), 1.2).replace('class="b3"', 'class="b3 h4"');
    // 칸 4: 세 자리의 카메라와 눈길을 한꺼번에
    [[0, 160, f(hy), 0], [1, 168, 92, -10], [2, 168, 276, 10]].forEach(([k, x, y, d]) => {
      body += at(4, 'fin', `<path d="M${x} ${y} L${SX - R - 6} ${f(hy + d)}" stroke="${C.purple}" stroke-width="3.5" stroke-dasharray="7 6"/>`, 0.1 + k * 0.2);
    });
    body += at(4, 'fin', [0, 1].map((k) => `<g transform="translate(${POS[k][0]} ${POS[k][1]}) rotate(${POS[k][2]})" opacity=".35">${camera(0, 0, 1)}</g>`).join(''), 0.3);
    body += at(4, 'pop', tag(531, 312, '앵글', ROLE.y, 24), 1.0);
    put(K + '6/앵글', svg(id, body, css));
  })();

  // ── 6단원: 클로즈업(카메라가 얼굴로 바짝 다가가 화면 가득 크게) ──────────────────────────────
  (function () {
    const id = 't81-k6-closeup';
    let css = base(id);
    const SX = 250, SYb = 236, R = 30, hy = headOf(SYb, R);
    let body = at(1, 'pop', person(SX, SYb, C.orange, R) + face(SX, SYb, R));
    body += `<g class="b1"><g class="cm">${camera(70, 160, 1)}</g></g>`;
    css += steps(id, 'cm', 'none', [[2, 'translate(60px, -24px)', 0.1]], { box: false });
    // 카메라가 보는 테두리: 사람 전체 → 얼굴
    body += `<g class="b1"><g class="vw"><rect x="${SX - 70}" y="${f(hy - 56)}" width="140" height="${f(SYb + 1.5 * R - hy + 70)}" rx="6" fill="none" stroke="${C.red}" stroke-width="3.5" stroke-dasharray="10 7"/></g></g>`;
    css += `.sc-${id} .vw { transform-origin: ${SX}px ${f(hy - 23.3)}px; transition: transform 1s ease-in-out .3s; }
      .on2 .sc-${id} .vw { transform: scale(.62, .45); }`;
    // 오른쪽 화면
    body += at(1, 'fin', `<clipPath id="cp-${id}"><rect x="420" y="40" width="200" height="250" rx="10"/></clipPath><rect x="420" y="40" width="200" height="250" rx="10" fill="white"/>`, 0.4);
    const PX = 520, PY = 236, PR = 24, phy = headOf(PY, PR);
    body += `<g class="b1" clip-path="url(#cp-${id})"><g class="pv">${person(PX, PY, C.orange, PR)}${face(PX, PY, PR)}</g></g>`;
    body += at(1, 'fin', `<rect x="420" y="40" width="200" height="250" rx="10" fill="none" stroke="${C.ink}" stroke-width="3.5"/>`, 0.4);
    css += `.sc-${id} .pv { transform-origin: ${PX}px ${f(phy)}px; transition: transform 1s ease-in-out .3s; }
      .on3 .sc-${id} .pv { transform: translate(0px, ${f(165 - phy)}px) scale(3.6); }`;
    body += at(3, 'pop', tag(520, 328, '화면 가득', ROLE.o, 20), 1.2);
    // 칸 4
    body += glowRect(414, 34, 212, 262, 4, C.orange, 0.1, 14);
    body += at(4, 'pop', tag(250, 318, '클로즈업', ROLE.y, 24), 0.6);
    put(K + '6/클로즈업', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
