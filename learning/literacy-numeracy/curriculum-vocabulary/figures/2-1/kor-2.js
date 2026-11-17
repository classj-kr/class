// 국어 2-1 낱말 도식(둘째 묶음: 5단원 인물·띄어 읽기·의미, 6단원 까닭, 8단원 나흘).
// 도구(tile·tag·row·base·move 따위)는 figures/3-1/kor.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 2학년 눈높이: 글씨를 크게(조각 24~34), 한 장면에 한 생각.
// 움직임은 transform·opacity·stroke-dashoffset(과 색 바꾸기)만 쓴다. 아이패드 사파리는 CSS 로 x·y·width·height·r·d 를 바꾸지 못한다.
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
    tile(cx, cy, label, { size, h: Math.round(size * 1.7), rx: Math.round(size * 0.85), fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
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
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ringAt = (cx, cy, r, n, color, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;

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
  // 칸 n 에서 (dx, dy) 만큼 떨어진 곳에서 날아와 제자리에 앉는다(처음에는 보이지 않음)
  const flyIn = (id, cls, dx, dy, n, { delay = 0, dur = 0.9 } = {}) => `
    .sc-${id} .${cls} { transform: translate(${f(dx)}px, ${f(dy)}px); opacity: 0; transition: transform ${dur}s ease-in-out ${delay}s, opacity .25s ease ${delay}s; }
    .on${n} .sc-${id} .${cls} { transform: none; opacity: 1; }`;
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  const fadeCss = (id, sel, n, { to = 0.25, delay = 0 } = {}) => `.sc-${id} ${sel} { transition: opacity .6s ease ${delay}s; } .on${n} .sc-${id} ${sel} { opacity: ${to}; }`;

  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${f(y - r - 14 * r / 18)}" r="${r}" fill="${color}"/><path d="M${f(x - r * 1.6)} ${f(y + r * 1.5)} Q${f(x - r * 1.6)} ${y} ${x} ${y} Q${f(x + r * 1.6)} ${y} ${f(x + r * 1.6)} ${f(y + r * 1.5)} Z" fill="${color}"/>`;
  // 말풍선: 네모(x, y, w, h)와 꼬리 끝(tx, ty)
  const bubble = (x, y, w, h, tx, ty, stroke = C.muted, fill = 'white') => {
    const bx = Math.min(Math.max(tx, x + 24), x + w - 24);
    return `<path d="M${f(bx - 12)} ${f(y + h - 2)} L${f(tx)} ${f(ty)} L${f(bx + 12)} ${f(y + h - 2)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
      + `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
      + `<path d="M${f(bx - 10.5)} ${f(y + h - 1.5)} H${f(bx + 10.5)}" stroke="${fill}" stroke-width="4"/>`;
  };
  const bar = (x, y, w, color = '#b5c4be', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  const badge = (x, y, n, color = C.green, r = 16) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="white" stroke-width="2.5"/>` + text(x, y + 7, n, { size: 20, color: 'white' });
  const vMark = (x, y, color, w = 4) => `<path d="M${x - 9} ${y - 17} L${x} ${y + 3} L${x + 9} ${y - 17}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const sun = (x, y, r = 15, col = C.orange) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${C.yellow}" stroke="${col}" stroke-width="2.5"/>`
    + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(c * (r + 5))} ${f(s * (r + 5))} L${f(c * (r + 11))} ${f(s * (r + 11))}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`; }).join('') + '</g>';
  const moon = (x, y, r = 22) => `<path d="M${x + 6} ${y - r} A${r} ${r} 0 0 0 ${x + 6} ${y + r} A${f(r * 1.25)} ${f(r * 1.25)} 0 0 1 ${x + 6} ${y - r} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const sparkle = (x, y, s = 1, col = C.yellow) => `<path d="M${x} ${f(y - 12 * s)} L${f(x + 3.5 * s)} ${f(y - 3.5 * s)} L${f(x + 12 * s)} ${y} L${f(x + 3.5 * s)} ${f(y + 3.5 * s)} L${x} ${f(y + 12 * s)} L${f(x - 3.5 * s)} ${f(y + 3.5 * s)} L${f(x - 12 * s)} ${y} L${f(x - 3.5 * s)} ${f(y - 3.5 * s)} Z" fill="${col}" stroke="${C.orange}" stroke-width="1.5" stroke-linejoin="round"/>`;

  const K = '2-1/국어/';
  // 너구리 얼굴: (x, y) 가운데, r 반지름
  const raccoon = (x, y, r = 22) =>
    `<circle cx="${f(x - r * 0.72)}" cy="${f(y - r * 0.78)}" r="${f(r * 0.34)}" fill="${C.muted}"/><circle cx="${f(x + r * 0.72)}" cy="${f(y - r * 0.78)}" r="${f(r * 0.34)}" fill="${C.muted}"/>`
    + `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<ellipse cx="${f(x - r * 0.38)}" cy="${f(y - r * 0.08)}" rx="${f(r * 0.32)}" ry="${f(r * 0.24)}" fill="${C.ink}" opacity=".8"/><ellipse cx="${f(x + r * 0.38)}" cy="${f(y - r * 0.08)}" rx="${f(r * 0.32)}" ry="${f(r * 0.24)}" fill="${C.ink}" opacity=".8"/>`
    + `<circle cx="${f(x - r * 0.36)}" cy="${f(y - r * 0.1)}" r="${f(r * 0.09)}" fill="white"/><circle cx="${f(x + r * 0.36)}" cy="${f(y - r * 0.1)}" r="${f(r * 0.09)}" fill="white"/>`
    + `<ellipse cx="${x}" cy="${f(y + r * 0.42)}" rx="${f(r * 0.3)}" ry="${f(r * 0.22)}" fill="white"/><circle cx="${x}" cy="${f(y + r * 0.34)}" r="${f(r * 0.11)}" fill="${C.ink}"/>`;
  // 너구리 몸통(머리 아래)
  const rbody = (x, y, r, apron = false) => `<ellipse cx="${x}" cy="${f(y + r * 1.7)}" rx="${f(r * 0.9)}" ry="${f(r * 0.85)}" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`
    + (apron ? `<path d="M${f(x - r * 0.55)} ${f(y + r * 1.2)} H${f(x + r * 0.55)} L${f(x + r * 0.62)} ${f(y + r * 2.35)} H${f(x - r * 0.62)} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>` : '');
  const chestnut = (x, y, s = 1) => `<path d="M${x} ${f(y - 11 * s)} Q${f(x + 13 * s)} ${f(y - 5 * s)} ${f(x + 11 * s)} ${f(y + 6 * s)} Q${x} ${f(y + 12 * s)} ${f(x - 11 * s)} ${f(y + 6 * s)} Q${f(x - 13 * s)} ${f(y - 5 * s)} ${x} ${f(y - 11 * s)} Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="1.5"/>`
    + `<path d="M${f(x - 10 * s)} ${f(y + 4 * s)} Q${x} ${f(y + 9 * s)} ${f(x + 10 * s)} ${f(y + 4 * s)}" stroke="${C.peach}" stroke-width="${f(3 * s)}" fill="none" stroke-linecap="round"/>`;
  const house = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-28" y="-6" width="56" height="44" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M-38 -4 L0 -38 L38 -4 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><rect x="-10" y="12" width="20" height="26" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/></g>`;
  const ring = (x, y, rx, ry, col, n, d) => at(n, 'pop', `<ellipse class="rg" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="10 7"/>`, d);

  // ── 5단원: 인물(「밤 다섯 개」 — 또야, 친구 다섯, 또야네 엄마가 일을 겪는다. 밤과 골목길은 인물이 아니다) ──────────────────────────────
  (function () {
    const id = 't21-k5-inmul';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M40 56 Q180 40 316 56 V300 Q180 286 40 300 Z" fill="white" stroke="${C.line}" stroke-width="3"/><path d="M324 56 Q460 40 600 56 V300 Q460 286 324 300 Z" fill="white" stroke="${C.line}" stroke-width="3"/><path d="M320 52 V302" stroke="${C.muted}" stroke-width="3"/>`);
    // 칸 1: 골목길과 또야, 밤 다섯 개
    body += `<g class="dim dim3">` + at(1, 'fin', house(84, 170, 0.9) + house(272, 170, 0.9) + `<path d="M48 250 H308" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`, 0.2) + '</g>';
    body += at(1, 'pop', rbody(178, 160, 30) + raccoon(178, 160, 30), 0.5);
    body += `<g class="dim dim3">` + at(1, 'pop', [130, 154, 178, 202, 226].map((x) => chestnut(x, 268, 1.1)).join(''), 0.9) + '</g>';
    // 칸 2: 친구 다섯이 모여든다
    const FX = [372, 424, 476, 528, 580];
    FX.forEach((x, i) => { body += at(2, 'pop', raccoon(x, 134, 20), 0.1 + i * 0.12); });
    body += ring(178, 182, 62, 82, C.green, 2, 0.9) + ring(476, 136, 136, 40, C.green, 2, 1.1);
    body += at(2, 'pop', tag(178, 326, '아기 너구리', ROLE.p, 20), 1.3) + at(2, 'pop', tag(476, 78, '친구 다섯', ROLE.p, 22), 1.4);
    // 칸 3: 또야네 엄마가 나와 밤을 하나 준다
    body += at(3, 'pop', rbody(476, 214, 26, true) + raccoon(476, 214, 26), 0.2);
    body += at(3, 'pop', chestnut(522, 262, 1.2), 0.8);
    body += ring(476, 248, 58, 62, C.green, 3, 1.0) + at(3, 'pop', tag(476, 326, '엄마', ROLE.p, 22), 1.2);
    // 칸 4
    css += `.on4 .sc-${id} .rg { stroke-dasharray: none; stroke-width: 5; }` + pulseCss(id, '.rg', 4, 0.2);
    body += at(4, 'pop', tag(320, 24, '인물', ROLE.p, 22), 0.9);
    put(K + '5/인물', svg(id, body, css));
  })();

  // ── 5단원: 띄어 읽기(「밤 다섯 개」 '애들은∨삶은 밤을∨까먹기 시작했어요.' — 읽는 줄이 ∨ 에서 끊긴다) ──────────────────────────────
  (function () {
    const id = 't21-k5-ttieo';
    let css = base(id);
    const S = 30, BY = 174, GAP = 46, SP = 11;
    const parts = ['애들은', '삶은', '밤을', '까먹기', '시작했어요.'];
    const gaps = [GAP, SP, GAP, SP];
    const ws = parts.map((p) => tw(p, S));
    const total = ws.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0);
    const xs = []; let x = (640 - total) / 2;
    parts.forEach((p, i) => { xs.push(x); x += ws[i] + (gaps[i] || 0); });
    let body = at(1, 'fin', `<rect x="20" y="120" width="600" height="96" rx="16" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + parts.map((p, i) => text(f(xs[i]), BY, p, { size: S, anchor: 'start' })).join(''), 0.1);
    body += at(1, 'pop', tag(320, 76, '밤 다섯 개', ROLE.g, 20), 0.4);
    const v1 = xs[0] + ws[0] + GAP / 2, v2 = xs[2] + ws[2] + GAP / 2, LY = 200;
    // 읽는 줄: 쉬는 곳에서 끊긴다
    body += drawLine(`M${f(xs[0])} ${LY} H${f(xs[0] + ws[0])}`, C.blue, 2, { width: 6, delay: 0.1 });
    body += at(2, 'pop', vMark(f(v1), BY - 6, C.green, 4.5), 1.0) + ringAt(f(v1), BY - 14, 18, 2, C.green, 1.1);
    body += drawLine(`M${f(xs[1])} ${LY} H${f(xs[2] + ws[2])}`, C.blue, 3, { width: 6, delay: 0 });
    body += at(3, 'pop', vMark(f(v2), BY - 6, C.green, 4.5), 0.85) + ringAt(f(v2), BY - 14, 18, 3, C.green, 0.9);
    body += drawLine(`M${f(xs[3])} ${LY} H${f(xs[4] + ws[4])}`, C.blue, 3, { width: 6, delay: 1.0 });
    css += `.sc-${id} .draw3 { transition-duration: .8s; } .sc-${id} .draw2 { transition-duration: .8s; }`;
    // 칸 4: 이름과 표시의 뜻
    body += at(4, 'pop', tag(320, 270, '띄어 읽기', ROLE.p, 26), 0.6);
    body += at(4, 'fin', vMark(268, 332, C.green, 4.5) + text(290, 332, '조금 쉬기', { size: 24, anchor: 'start' }), 1.0);
    put(K + '5/띄어 읽기', svg(id, body, css));
  })();

  // ── 5단원: 의미('아기가방에 들어갔다.' — 어디서 쉬느냐에 따라 아기가 방에 들어간 뜻도, 가방에 들어간 뜻도 된다) ──────────────────────────────
  (function () {
    const id = 't21-k5-uimi';
    let css = base(id);
    const S = 32, BY = 78, GAP = 28;
    const wA = tw('아기', S), wB = tw('가', S), wC = tw('방에 들어갔다.', S);
    const x0 = 320 - (wA + wB + wC + GAP) / 2, xB = x0 + wA, xC = xB + wB;
    let body = at(1, 'fin', `<rect x="70" y="30" width="500" height="72" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + text(f(x0), BY, '아기', { size: S, anchor: 'start' }) + `<g class="pB">${text(f(xB), BY, '가', { size: S, anchor: 'start' })}</g><g class="pC">${text(f(xC), BY, '방에 들어갔다.', { size: S, anchor: 'start' })}</g>`, 0.1);
    css += `.sc-${id} .pB, .sc-${id} .pC { transition: transform .7s ease-in-out .2s; }
      .on2 .sc-${id} .pC { transform: translateX(${GAP}px); }
      .on3 .sc-${id} .pB { transform: translateX(${GAP}px); }`;
    body += `<g class="b2 h3">${g('pop pop2', vMark(f(xC + GAP / 2), BY - 6, C.green), 0.8)}</g>`;
    body += `<g class="b3">${g('pop pop3', vMark(f(xB + GAP / 2), BY - 6, C.purple), 0.8)}</g>`;
    const baby = (x, y) => `<rect x="${x - 15}" y="${y + 14}" width="30" height="34" rx="12" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
      + `<circle cx="${x}" cy="${y}" r="17" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 4} ${y - 17} Q${x + 2} ${y - 27} ${x + 7} ${y - 19}" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + `<circle cx="${x - 6}" cy="${y - 2}" r="2.5" fill="${C.ink}"/><circle cx="${x + 6}" cy="${y - 2}" r="2.5" fill="${C.ink}"/><path d="M${x - 5} ${y + 7} Q${x} ${y + 11} ${x + 5} ${y + 7}" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    // 칸 2: 아기가 ∨ 방에 — 아기가 방으로 들어간다
    body += at(2, 'rise', `<rect x="24" y="128" width="258" height="218" rx="16" fill="${C.mint}" fill-opacity=".5" stroke="${C.green}" stroke-width="3"/>`
      + tile(100, 160, '아기가', { size: 22, h: 42, fill: 'white', stroke: C.green }) + tile(210, 160, '방에', { size: 22, h: 42, fill: 'white', stroke: C.green })
      + `<rect x="150" y="206" width="112" height="118" rx="6" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="176" y="250" width="44" height="74" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="210" cy="290" r="3.5" fill="${C.orange}"/>`, 0.9);
    body += `<g class="b2"><g class="bw">${baby(82, 270)}</g></g>`;
    css += steps(id, 'bw', 'none', [[2, 'translate(98px, 0px)', 1.3]], { dur: 0.8, box: false });
    // 칸 3: 아기 ∨ 가방에 — 아기가 가방 속에
    body += at(3, 'rise', `<rect x="358" y="128" width="258" height="218" rx="16" fill="${C.lilac}" fill-opacity=".6" stroke="${C.purple}" stroke-width="3"/>`
      + tile(434, 160, '아기', { size: 22, h: 42, fill: 'white', stroke: C.purple }) + tile(540, 160, '가방에', { size: 22, h: 42, fill: 'white', stroke: C.purple })
      + `<path d="M450 266 Q487 206 524 266" stroke="${C.purple}" stroke-width="6" fill="none" stroke-linecap="round"/>` + baby(487, 238)
      + `<rect x="430" y="262" width="114" height="72" rx="14" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><rect x="474" y="282" width="26" height="12" rx="4" fill="${C.purple}"/>`, 0.9);
    // 칸 4
    body += glowRect(18, 122, 270, 230, 4, C.green, 0.1, 20) + glowRect(352, 122, 270, 230, 4, C.purple, 0.3, 20);
    body += at(4, 'pop', tag(320, 236, '의미', ROLE.y, 20), 0.8);
    put(K + '5/의미', svg(id, body, css));
  })();

  // ── 6단원: 까닭(우산을 챙겼다 ← 왜? ← 하늘이 흐리니까) ──────────────────────────────
  (function () {
    const id = 't21-k6-kkadak';
    let css = base(id);
    let body = at(1, 'rise', person(100, 284, C.blue, 26), 0.1);
    // 접은 우산
    body += at(1, 'fin', `<path d="M150 196 L162 286 L138 286 Z" fill="${C.purple}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/><path d="M150 286 V318 Q150 330 140 330 Q131 330 131 322" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M150 196 V186" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`, 0.4);
    body += at(1, 'pop', tile(318, 292, '우산을 챙겼어', { size: 26, h: 56, fill: 'white', stroke: C.blue }), 0.7);
    // 칸 2: 왜?
    body += at(2, 'pop', bubble(272, 172, 92, 58, 318, 258, C.orange) + text(318, 212, '왜?', { size: 28, color: C.orange }), 0.2);
    // 칸 3: 흐린 하늘과 까닭
    const cloud = (x, y, k = 1) => `<path d="M${f(x - 50 * k)} ${f(y + 18 * k)} Q${f(x - 66 * k)} ${f(y + 18 * k)} ${f(x - 64 * k)} ${y} Q${f(x - 62 * k)} ${f(y - 18 * k)} ${f(x - 40 * k)} ${f(y - 14 * k)} Q${f(x - 32 * k)} ${f(y - 40 * k)} ${f(x - 4 * k)} ${f(y - 34 * k)} Q${f(x + 22 * k)} ${f(y - 46 * k)} ${f(x + 34 * k)} ${f(y - 20 * k)} Q${f(x + 62 * k)} ${f(y - 22 * k)} ${f(x + 62 * k)} ${f(y + 2 * k)} Q${f(x + 66 * k)} ${f(y + 18 * k)} ${f(x + 48 * k)} ${f(y + 18 * k)} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<g class="b3"><g class="cl">${cloud(470, 80, 1.1)}${cloud(560, 64, 0.8)}</g></g>`;
    css += flyIn(id, 'cl', 60, 0, 3, { delay: 0.1, dur: 0.9 });
    body += at(3, 'pop', `<g class="rs">${tile(500, 170, '하늘이 흐리니까', { size: 24, h: 52, fill: C.peach, stroke: C.orange })}</g>`, 0.8);
    body += drawArrow(452, 198, 392, 258, C.orange, 3, { width: 5, delay: 1.1 });
    // 칸 4
    body += glowRect(406, 140, 188, 60, 4, C.orange, 0.1, 14);
    css += pulseCss(id, '.rs', 4, 0.5);
    body += at(4, 'pop', tag(548, 244, '까닭', ROLE.o, 26), 0.8);
    put(K + '6/까닭', svg(id, body, css));
  })();

  // ── 8단원: 나흘(「편지」 — 해가 네 번 뜨고 지는 동안 달팽이가 편지를 나른다: 하루·이틀·사흘·나흘) ──────────────────────────────
  (function () {
    const id = 't21-k8-naheul';
    let css = base(id);
    const CX = [127, 252, 377, 502], HY = 176, NAME = ['하루', '이틀', '사흘', '나흘'];
    let body = '';
    CX.forEach((x, i) => {
      body += at(1, 'fin', `<g class="cell c${i}"><rect class="bg" x="${x - 57}" y="70" width="114" height="124" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/></g>`
        + text(x, 98, `${i + 1}일`, { size: 22, color: C.muted })
        + `<path d="M${x - 50} ${HY} H${x + 50}" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>`, 0.1 + i * 0.08);
    });
    // 해가 왼쪽에서 떠서 오른쪽으로 진다(칸 가운데 지평선 둘레로 돈다)
    const plan = [[0, 1, 0.3], [1, 2, 0.05], [2, 2, 0.9], [3, 3, 0.1]];
    plan.forEach(([i, n, d]) => {
      const x = CX[i];
      body += `<g class="b${n}"><path class="arc a${i}" pathLength="1" d="M${x - 40} ${HY} A40 40 0 0 1 ${x + 40} ${HY}" stroke="${C.yellow}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
      css += `.sc-${id} .a${i} { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .66s ease-in-out ${f(d + 0.1)}s; } .on${n} .sc-${id} .a${i} { stroke-dashoffset: 0; }`;
      body += `<g class="b${n}"><g transform="translate(${x} ${HY})"><g class="s${i}"><g transform="translate(-40 0)">${sun(0, 0, 11)}</g></g></g></g>`;
      css += `.sc-${id} .s${i} { transform-box: view-box; transform-origin: 0 0; opacity: 0; }
        @keyframes ${id}-s${i} { 0% { transform: rotate(0deg); opacity: 0; } 12% { opacity: 1; } 82% { transform: rotate(180deg); opacity: 1; } 100% { transform: rotate(180deg); opacity: 0; } }
        .on${n} .sc-${id} .s${i} { animation: ${id}-s${i} .9s ease-in-out ${d}s both; }`;
      css += paint(id, `.c${i}`, [C.sky, C.blue], n, f(d + 0.8));
      body += at(n, 'pop', tag(x, 226, NAME[i], i === 3 ? ROLE.o : ROLE.s, 22), f(d + 0.75));
    });
    // 개구리, 달팽이, 두꺼비
    const frog = (x, y, col, stroke) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="19" fill="${col}" stroke="${stroke}" stroke-width="2.5"/><circle cx="${x - 11}" cy="${y - 18}" r="8" fill="white" stroke="${stroke}" stroke-width="2.5"/><circle cx="${x + 11}" cy="${y - 18}" r="8" fill="white" stroke="${stroke}" stroke-width="2.5"/><circle cx="${x - 11}" cy="${y - 18}" r="3" fill="${C.ink}"/><circle cx="${x + 11}" cy="${y - 18}" r="3" fill="${C.ink}"/><path d="M${x - 9} ${y + 2} Q${x} ${y + 8} ${x + 9} ${y + 2}" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    body += at(1, 'fin', `<path d="M60 304 H580" stroke="${C.line}" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10"/>`, 0.1);
    body += at(1, 'pop', frog(34, 292, C.mint, C.green) + text(34, 340, '개구리', { size: 18, color: C.green }), 0.2);
    body += at(1, 'pop', frog(606, 292, C.peach, C.orange) + text(606, 340, '두꺼비', { size: 18, color: C.orange }), 0.3);
    const snail = `<path d="M-30 14 Q-34 4 -24 2 H18 Q30 2 32 -8 Q34 -16 28 -18" stroke="${C.orange}" stroke-width="3" fill="${C.yellow}" stroke-linejoin="round"/><path d="M28 -18 L26 -30 M30 -18 L36 -28" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>`
      + `<circle cx="-4" cy="-10" r="17" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M-4 -10 m-8 0 a8 8 0 1 1 8 8 a5 5 0 1 1 -5 -5" stroke="${C.orange}" stroke-width="2.5" fill="none"/>`
      + `<g class="lt"><rect x="-16" y="-42" width="26" height="18" rx="2" fill="white" stroke="${C.blue}" stroke-width="2.5"/><path d="M-16 -42 L-3 -32 L10 -42" stroke="${C.blue}" stroke-width="2" fill="none"/></g>`;
    body += `<g class="b1"><g class="sn"><g transform="translate(80 300)">${snail}</g></g></g>`;
    css += steps(id, 'sn', 'none', [[1, 'translate(90px, 0px)', 0.3], [2, 'translate(330px, 0px)', 0.05], [3, 'translate(440px, 0px)', 0.1]], { dur: 1.4, box: false })
      + `.on2 .sc-${id} .sn { transition-duration: 1.8s; } .on3 .sc-${id} .sn { transition-duration: 1.1s; }`;
    body += at(3, 'pop', sparkle(606, 252, 1.1) + sparkle(632, 270, 0.7), 1.3);
    // 칸 4: 네 날을 묶는다
    body += drawLine(`M70 60 Q70 48 82 48 H306 Q314 48 314 36 Q314 48 322 48 H547 Q559 48 559 60`, C.orange, 4, { width: 4, delay: 0.1 });
    body += at(4, 'pop', tag(314, 22, '나흘', ROLE.o, 22), 0.9);
    css += pulseCss(id, '.c3', 4, 1.0);
    put(K + '8/나흘', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
