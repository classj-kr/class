// 국어 3-1 낱말 도식(2단원 분명하고 유창하게·3단원 짜임새 있는 글): 띄어 읽기·문장의 짜임(어찌하다·어떠하다·성질·상태)·문장 부호·꾸며 주는 말, 음력·단오·모내기·백야, 짜임새·문단·중심 문장·뒷받침 문장·덧붙이다, 처마·녹·일정하다·진열·수익금·오염.
// 도구(tile·tag·row·curve·base·move 따위)는 figures/4-1/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게 실측: 한글 1em, 괄호 .36em, 쉼표·마침표·쌍점 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
  const tw = (s, size) => [...s].reduce((a, c) => a + cw(c), 0) * size;
  const wOf = (label, size = 28) => Math.round(tw(label, size) + size * 1.3);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·slide) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;

  // 낱말 조각: 배경 rect.bg, 글자 text.tx — 색 바꾸기는 CSS 로 .bg 의 fill/stroke 를 바꾼다
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '' } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx' })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: 34, rx: 17, fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange], r: [C.peach, C.red] };
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
  // 그어지는 굽은 줄(칸 n). peak 는 줄 꼭대기 y. 끝에 화살촉.
  const curve = (x1, y1, x2, y2, peak, color, n, { width = 4, arrowHead = true, delay = 0 } = {}) => {
    const cx = (x1 + x2) / 2, cy = 2 * peak - (y1 + y2) / 2, ang = Math.atan2(y2 - cy, x2 - cx);
    return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
      + (arrowHead ? g(`fin fin${n}`, head(x2, y2, ang, color, width), delay + 0.9) : '') + '</g>';
  };
  // 그어지는 곧은 화살표(칸 n)
  const drawArrow = (x1, y1, x2, y2, color, n, { width = 5, delay = 0 } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + g(`fin fin${n}`, head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color, width), delay + 0.9) + '</g>';
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  // 오른쪽을 감싸는 묶음 괄호(세로, 끝이 오른쪽을 가리킴)
  const braceR = (x, y1, y2, color = C.green, w = 3.5) => {
    const m = (y1 + y2) / 2;
    return `<path d="M${x - 12} ${y1} Q${x} ${y1} ${x} ${y1 + 14} V${m - 12} Q${x} ${m} ${x + 12} ${m} Q${x} ${m} ${x} ${m + 12} V${y2 - 14} Q${x} ${y2} ${x - 12} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;

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
  // 늘어나는 둥근 상자. 아이패드 사파리는 CSS 로 rect 의 x·width·height 를 바꾸지 못하므로
  // 둥근 양 끝(마개)은 translate 로 옮기고, 가운데 곧은 몸통은 scale 로 늘인다(가로줄 굵기는 scaleX 에 변하지 않는다).
  // axis 'x': 칸 n 에서 왼쪽 끝을 a, 오른쪽 끝을 b 만큼 옮긴다. axis 'y': 위쪽 끝 a, 아래쪽 끝 b.
  // 돌려주는 { body, css }. 마개·몸통은 속성 없는 <g> 라 CSS transform 을 받아도 된다.
  const stretchBox = (id, cls, { x, y, w, h, rx, fill = 'none', stroke, sw }, { axis = 'x', a = 0, b = 0, n, dur = 1.2, delay = 0 }) => {
    const l = x, r = x + w, t = y, bt = y + h, st = `stroke="${stroke}" stroke-width="${sw}" fill="none"`;
    const cap = (d) => `<path d="${d}Z" fill="${fill}"/><path d="${d}" ${st}/>`;
    let capA, capB, mid, origin, len, T;
    if (axis === 'x') {
      capA = cap(`M${l + rx} ${t} A${rx} ${rx} 0 0 0 ${l} ${t + rx} V${bt - rx} A${rx} ${rx} 0 0 0 ${l + rx} ${bt}`);
      capB = cap(`M${r - rx} ${t} A${rx} ${rx} 0 0 1 ${r} ${t + rx} V${bt - rx} A${rx} ${rx} 0 0 1 ${r - rx} ${bt}`);
      mid = `<rect x="${l + rx}" y="${t}" width="${w - 2 * rx}" height="${h}" fill="${fill}"/><path d="M${l + rx - 1} ${t} H${r - rx + 1} M${l + rx - 1} ${bt} H${r - rx + 1}" ${st}/>`;
      origin = `${l + rx}px 0px`; len = w - 2 * rx; T = 'X';
    } else {
      capA = cap(`M${l} ${t + rx} A${rx} ${rx} 0 0 1 ${l + rx} ${t} H${r - rx} A${rx} ${rx} 0 0 1 ${r} ${t + rx}`);
      capB = cap(`M${l} ${bt - rx} A${rx} ${rx} 0 0 0 ${l + rx} ${bt} H${r - rx} A${rx} ${rx} 0 0 0 ${r} ${bt - rx}`);
      mid = `<rect x="${l}" y="${t + rx}" width="${w}" height="${h - 2 * rx}" fill="${fill}"/><path d="M${l} ${t + rx - 1} V${bt - rx + 1} M${r} ${t + rx - 1} V${bt - rx + 1}" ${st}/>`;
      origin = `0px ${t + rx}px`; len = h - 2 * rx; T = 'Y';
    }
    const s = f((len + b - a) / len * 1000) / 1000, tr = `transition: transform ${dur}s ease-in-out ${delay}s;`;
    const body = `<g class="${cls} ${cls}-m">${mid}</g><g class="${cls} ${cls}-a">${capA}</g><g class="${cls} ${cls}-b">${capB}</g>`;
    const css = `.sc-${id} .${cls} { ${tr} }
    .sc-${id} .${cls}-m { transform-box: view-box; transform-origin: ${origin}; }
    .on${n} .sc-${id} .${cls}-m { transform: translate${T}(${a}px) scale${T}(${s}); }
    .on${n} .sc-${id} .${cls}-a { transform: translate${T}(${a}px); }
    .on${n} .sc-${id} .${cls}-b { transform: translate${T}(${b}px); }`;
    return { body, css };
  };

  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;

  const K = '3-1/국어/';
  const TAN = '#fdf3d3';
  const bar = (x, y, w, color = '#b5c4be', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;
  const eye = (x, y, color = C.blue) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`;
  const drawLine = (d, color, n, { width = 4, delay = 0, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
  const growCss = (id, sel, n, { axis = 'X', origin = 'left center', delay = 0, dur = 0.7 } = {}) => `
    .sc-${id} ${sel} { transform-box: fill-box; transform-origin: ${origin}; transform: scale${axis}(0); transition: transform ${dur}s ease-out ${delay}s; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;
  // 칸 n 에서, 제자리에서 (dx, dy) 떨어져 rot 도 기울어 있던 것이 제자리로 날아와 똑바로 선다
  const fly = (id, sel, [dx, dy, rot = 0], n, { delay = 0, dur = 1 } = {}) => `
    .sc-${id} ${sel} { transform-box: fill-box; transform-origin: center; transform: translate(${f(dx)}px, ${f(dy)}px) rotate(${rot}deg); transition: transform ${dur}s ease-in-out ${delay}s; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;
  // 둥근 네모 길(구멍 뚫기용)
  const rr = (x, y, w, h, r) => `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  const magnifier = (x, y, color = C.blue) => `<circle cx="${x}" cy="${y}" r="11" fill="white" stroke="${color}" stroke-width="3.5"/><path d="M${x + 8} ${y + 8} L${x + 17} ${y + 17}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;

  // ── 3-1 국어 2·3단원에서 더 쓰는 그림 도구 ──────────────────────────────
  // 쐐기표(∨, 조금 쉬기)와 겹쐐기표(∨ 두 개를 위아래로 포갠 꼴, 조금 더 길게 쉬기 — 교과서 77·85쪽). (x, y) 는 아래 끝 근처.
  // 겹쐐기표는 두 ∨ 가 붙어 보이지 않게 조금 넓고 가는 선으로 그린다.
  const vMark = (x, y, color, w = 4) => `<path d="M${x - 8} ${y - 15} L${x} ${y + 3} L${x + 8} ${y - 15}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const wMark = (x, y, color, w = 3) => `<path d="M${x - 10} ${y - 24} L${x} ${y - 8} L${x + 10} ${y - 24} M${x - 10} ${y - 13} L${x} ${y + 3} L${x + 10} ${y - 13}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const dogFace = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-17 -15 Q-31 -10 -26 12 Q-17 8 -12 -6 Z M17 -15 Q31 -10 26 12 Q17 8 12 -6 Z" fill="${C.orange}"/><circle r="20" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><circle cx="-7" cy="-4" r="3" fill="${C.ink}"/><circle cx="7" cy="-4" r="3" fill="${C.ink}"/><ellipse cx="0" cy="6" rx="5" ry="3.5" fill="${C.ink}"/></g>`;
  const house = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-28" y="-6" width="56" height="44" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M-38 -4 L0 -38 L38 -4 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><rect x="-10" y="12" width="20" height="26" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/></g>`;
  const ringAt = (cx, cy, r, n, color, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;

  // ── 2단원: 띄어 읽기(정우의 사연 '강아지가방으로들어가버렸습니다.' — 쉬는 곳에 따라 '강아지 가방'도 되고 '강아지가 방'도 된다) ──────────────────────────────
  (function () {
    const id = 't31-k2-ttieo';
    let css = base(id);
    const S = 32, Y = 106, xA = 61, xB = xA + 3 * S, xC = xA + 4 * S, GAP = 26;
    const endC = xC + GAP + 11.36 * S;
    let body = at(1, 'fin', `<rect x="24" y="58" width="592" height="74" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(1, 'fin', text(xA, Y, '강아지', { size: S, anchor: 'start' }) + `<g class="pB">${text(xB, Y, '가', { size: S, anchor: 'start' })}</g><g class="pC">${text(xC, Y, '방으로들어가버렸습니다.', { size: S, anchor: 'start' })}</g>`, 0.2);
    css += `.sc-${id} .pB, .sc-${id} .pC { transition: transform .8s ease-in-out .2s; }
      .on2 .sc-${id} .pB, .on2 .sc-${id} .pC { transform: translateX(${GAP}px); }
      .on3 .sc-${id} .pB { transform: none; }`;
    // 칸 2: '강아지' 뒤에서 쉼(빨강) → 강아지 가방
    body += `<g class="b2 h3">${g('pop pop2', vMark(xB + GAP / 2, Y - 2, C.red), 0.9)}</g>`;
    const panel = (x, fill, stroke) => `<rect x="${x}" y="152" width="284" height="194" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
    const bag = `<path d="M140 256 Q166 214 192 256" stroke="${C.purple}" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="122" y="252" width="88" height="70" rx="14" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + dogFace(166, 290, 0.75);
    body += `<g class="dim dim4">` + at(2, 'rise', panel(24, C.peach, C.red) + tile(166, 194, '강아지 가방으로', { size: 22, h: 46, fill: 'white', stroke: C.red }) + bag, 1.0)
      + at(2, 'pop', cross(282, 322, 10), 1.5) + '</g>';
    // 칸 3: '강아지가' 뒤에서 쉼(초록) → 강아지가 방으로
    body += `<g class="b3">${g('pop pop3', `<g class="vg">${vMark(xC + GAP / 2, Y - 2, C.green)}</g>`, 0.9)}</g>`;
    body += at(3, 'rise', panel(332, C.mint, C.green) + tile(418, 194, '강아지가', { size: 22, h: 46, fill: 'white', stroke: C.green }) + tile(538, 194, '방으로', { size: 22, h: 46, fill: 'white', stroke: C.green })
      + dogFace(398, 284) + house(532, 280), 1.0);
    body += drawArrow(428, 284, 486, 284, C.green, 3, { width: 4, delay: 1.2 });
    body += at(3, 'pop', check(594, 322, 10), 1.6);
    // 칸 4: 문장 끝 겹쐐기표, 두 표시의 이름
    body += at(4, 'pop', wMark(endC + 18, Y - 2, C.orange, 3.5), 0.3);
    body += at(4, 'pop', tag(100, 30, '띄어 읽기', ROLE.p, 20), 1.0);
    body += at(4, 'fin', vMark(196, 36, C.green, 3.5) + text(212, 37, '조금 쉬기', { size: 18, anchor: 'start' }) + wMark(334, 38, C.orange, 3) + text(352, 37, '더 길게 쉬기', { size: 18, anchor: 'start' }), 0.6);
    css += pulseCss(id, '.vg', 4, 0.2);
    put(K + '2/띄어 읽기', svg(id, body, css));
  })();

  // ── 2단원: 어찌하다·어떠하다(교과서 73쪽 「지호와 나비」 문장 다섯을 움직임 상자와 성질·상태 상자로 가른다 — 같은 틀, 먼저 옮기는 쪽만 다르다) ──────────────────────────────
  const predSort = (id, focus) => {
    let css = base(id);
    const A = ROLE.o, E = ROLE.x;
    const chips = [
      { k: 'e1', s: '날씨가', p: '맑습니다', kind: 'e', st: [102, 56, -4], en: [479, 238] },
      { k: 'a1', s: '나비들이', p: '날아다닙니다', kind: 'a', st: [318, 52, 3], en: [161, 250] },
      { k: 'e2', s: '바람은', p: '시원합니다', kind: 'e', st: [534, 58, -3], en: [479, 282] },
      { k: 'a2', s: '지호가 고개를', p: '끄덕입니다', kind: 'a', st: [202, 120, 2], en: [161, 302] },
      { k: 'e3', s: '지호는', p: '행복합니다', kind: 'e', st: [458, 118, 4], en: [479, 326] }
    ];
    const nA = focus === 'a' ? 2 : 3, nE = focus === 'a' ? 3 : 2;
    const boxA = `<rect x="16" y="168" width="290" height="184" rx="16" fill="${C.peach}" fill-opacity=".5" stroke="${C.orange}" stroke-width="3"/>` + tag(161, 196, '어찌하다(움직임)', A, 19);
    const boxE = `<rect x="334" y="168" width="290" height="184" rx="16" fill="${C.lilac}" fill-opacity=".6" stroke="${C.purple}" stroke-width="3"/>` + tag(479, 196, '어떠하다(성질이나 상태)', E, 19);
    let body = `<g class="${focus === 'e' ? 'dim dim4' : ''}">` + at(1, 'fin', boxA, 0.8) + '</g>';
    body += `<g class="${focus === 'a' ? 'dim dim4' : ''}">` + at(1, 'fin', boxE, 1.0) + '</g>';
    chips.forEach((c, i) => {
      const plain = `${c.s} ${c.p}`, size = 19, w = wOf(plain, size);
      const mk = `<tspan fill="${C.muted}" font-weight="600">${c.s}</tspan> <tspan>${c.p}</tspan>`;
      const col = c.kind === 'a' ? A : E;
      // 서술 부분 밑줄(글자 폭 어림으로 자리를 잡는다)
      const x0 = c.en[0] - tw(plain, size) / 2 + tw(c.s + ' ', size), x1 = x0 + tw(c.p, size);
      const n = c.kind === 'a' ? nA : nE;
      const idx = chips.filter((d) => d.kind === c.kind).indexOf(c), d = 0.2 + idx * 0.35;
      const ul = `<path class="ul" pathLength="1" d="M${f(x0)} ${c.en[1] + 13} H${f(x1)}" stroke="${col[1]}" stroke-width="3.5" stroke-linecap="round" fill="none" style="transition-delay:${f(d + 1)}s"/>`;
      const other = (c.kind === 'a') !== (focus === 'a');
      body += `<g class="${other ? 'dim dim4' : ''}">` + at(1, 'pop', `<g class="c-${c.k}">${tile(c.en[0], c.en[1], mk, { size, h: 38, w, fill: 'white', stroke: C.line })}${ul}</g>`, i * 0.15) + '</g>';
      css += fly(id, `.c-${c.k}`, [c.st[0] - c.en[0], c.st[1] - c.en[1], c.st[2]], n, { delay: d, dur: 0.9 });
      css += paint(id, `.c-${c.k}`, col, n, d + 0.8);
      css += `.on${n} .sc-${id} .c-${c.k} .ul { stroke-dashoffset: 0; }`;
    });
    css += `.sc-${id} .ul { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .6s ease-out; }`;
    // 칸 4: 고른 상자가 반짝이고, 위에 문장의 짜임이 뜬다
    const word = focus === 'a' ? '어찌하다' : '어떠하다', col = focus === 'a' ? A : E;
    const r = row(['누가/무엇이', '+', word], { y: 92, size: 24, gap: 14 });
    body += at(4, 'pop', T(r[0], { fill: 'white', stroke: C.muted, h: 50 }), 0.5) + at(4, 'fin', text(r[1].cx, r[1].y + 10, '+', { size: 30, color: C.muted }), 0.7) + at(4, 'pop', T(r[2], { fill: col[0], stroke: col[1], h: 50 }), 0.9);
    body += focus === 'a' ? glowRect(12, 164, 298, 192, 4, C.orange, 0.2, 18) : glowRect(330, 164, 298, 192, 4, C.purple, 0.2, 18);
    css += chips.filter((c) => (c.kind === 'a') === (focus === 'a')).map((c, i) => pulseCss(id, `.c-${c.k} .tl`, 4, 1.2 + i * 0.2)).join('');
    return svg(id, body, css);
  };
  put(K + '2/어찌하다', predSort('t31-k2-eojji', 'a'));
  put(K + '2/어떠하다', predSort('t31-k2-eotteo', 'e'));

  // ── 2단원: 문장 부호(교과서 97쪽 — '왜 하필 원숭이냐고요?'는 물어보듯, '위스띠띠!'는 외치듯 읽는다) ──────────────────────────────
  (function () {
    const id = 't31-k2-buho';
    let css = base(id);
    const Q = 322, Y1 = 128, S1 = 30;
    let body = at(1, 'fin', text(Q - 1, Y1, '왜 하필 원숭이냐고요', { size: S1, anchor: 'end' }) + text(Q, Y1, '?', { size: S1, anchor: 'start', color: C.blue }), 0.1);
    body += ringAt(Q + 8, Y1 - 11, 17, 1, C.blue, 0.6) + ringAt(Q + 8, Y1 - 11, 17, 2, C.blue, 1.0);
    // 칸 2: 끝을 올려 읽는 목소리 줄(끝의 '요?' 위에서 올라간다)
    const x0 = 44, cx0 = Q - 52, ex = Q + 22, ey = 46;
    body += drawLine(`M${x0} 80 H${cx0} Q${cx0 + 44} 80 ${ex} ${ey}`, C.blue, 2, { width: 5, delay: 0.2 });
    body += g('b2', g('fin fin2', head(ex, ey, Math.atan2(ey - 80, ex - cx0 - 44), C.blue, 5), 1.1));
    // 문장 2: “위스띠띠!”
    const B = 236, Y2 = 262, S2 = 46;
    body += at(1, 'fin', `<g class="ws">${text(B - 1, Y2, '“위스띠띠', { size: S2, anchor: 'end' })}${text(B, Y2, '!', { size: S2, anchor: 'start', color: C.orange })}${text(B + 17, Y2, '”', { size: S2, anchor: 'start' })}</g>`, 0.4);
    body += ringAt(B + 8, Y2 - 16, 26, 1, C.orange, 0.9);
    css += `.sc-${id} .ws { transform-box: fill-box; transform-origin: left center; }
      @keyframes ${id}-shout { 0%, 100% { transform: scale(1); } 40% { transform: scale(1.16); } }
      .on3 .sc-${id} .ws { animation: ${id}-shout .55s ease-in-out .2s 3; }`;
    const ax = B + 72, ay = Y2 - 16;
    [18, 32, 46].forEach((rad, i) => {
      body += drawLine(`M${ax} ${ay - rad} A${rad} ${rad} 0 0 1 ${ax} ${ay + rad}`, C.orange, 3, { width: 5, delay: 0.3 + i * 0.25 });
    });
    // 칸 4: 문장 부호 넷의 이름
    const marks = [
      ['마침표', C.green, (x, y) => `<circle cx="${x}" cy="${y + 8}" r="5" fill="${C.green}"/>`],
      ['쉼표', C.purple, (x, y) => `<circle cx="${x}" cy="${y + 5}" r="5" fill="${C.purple}"/><path d="M${x + 4} ${y + 6} Q${x + 4} ${y + 14} ${x - 3} ${y + 18}" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linecap="round"/>`],
      ['물음표', C.blue, (x, y) => text(x, y + 11, '?', { size: 30, color: C.blue })],
      ['느낌표', C.orange, (x, y) => text(x, y + 11, '!', { size: 30, color: C.orange })]
    ];
    marks.forEach(([name, col, mk], i) => {
      const y = 62 + i * 68;
      body += at(4, 'pop', `<circle cx="462" cy="${y}" r="24" fill="white" stroke="${col}" stroke-width="3.5"/>` + mk(462, y) + text(498, y + 8, name, { size: 22, anchor: 'start' }), 0.2 + i * 0.25);
    });
    body += at(4, 'pop', tag(530, 336, '문장 부호', ROLE.p, 22), 1.3);
    put(K + '2/문장 부호', svg(id, body, css));
  })();

  // ── 2단원: 꾸며 주는 말(「지호와 나비」 '노란 나비가 파란 하늘로 날아오릅니다.' — 앞에 붙는 말이 나비와 하늘을 칠한다) ──────────────────────────────
  (function () {
    const id = 't31-k2-kkumim';
    let css = base(id);
    const r = row(['노란', '나비가', '파란', '하늘로', '날아오릅니다'], { y: 104, size: 24, gap: 10 });
    const SH = r[2].w + 10;
    let body = at(1, 'fin', `<rect class="sky" x="300" y="146" width="316" height="198" rx="16" fill="white" stroke="${C.line}" stroke-width="3" stroke-dasharray="10 7"/>`);
    const flower = (x, y) => `<path d="M${x} ${y} V${y - 38}" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>`
      + [0, 72, 144, 216, 288].map((a) => `<circle cx="${f(x + 11 * Math.cos(a * Math.PI / 180))}" cy="${f(y - 48 + 11 * Math.sin(a * Math.PI / 180))}" r="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`).join('')
      + `<circle cx="${x}" cy="${y - 48}" r="6" fill="${C.orange}"/>`;
    body += at(1, 'fin', `<path d="M24 332 H290" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>` + flower(96, 332), 0.1);
    const wingL = `<path class="wg" d="M0 -3 C-16 -30 -44 -28 -38 -6 C-34 6 -14 6 0 -1 Z"/><path class="wg" d="M0 1 C-14 4 -32 16 -24 30 C-14 36 -4 18 0 5 Z"/>`;
    const wingR = `<path class="wg" d="M0 -3 C16 -30 44 -28 38 -6 C34 6 14 6 0 -1 Z"/><path class="wg" d="M0 1 C14 4 32 16 24 30 C14 36 4 18 0 5 Z"/>`;
    body += at(1, 'pop', `<g class="bf"><g transform="translate(176 262)"><g class="fl">${wingL}</g><g class="fr">${wingR}</g><rect x="-3" y="-16" width="6" height="34" rx="3" fill="${C.ink}"/><path d="M-1 -15 Q-6 -26 -12 -28 M1 -15 Q6 -26 12 -28" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g></g>`, 0.3);
    css += `.sc-${id} .wg { fill: white; stroke: ${C.muted}; stroke-width: 3; stroke-linejoin: round; transition: fill .6s ease .7s, stroke .6s ease .7s; }
      .on2 .sc-${id} .wg { fill: ${C.yellow}; stroke: ${C.orange}; }
      @keyframes ${id}-flap { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(.4); } }
      .sc-${id} .fl, .sc-${id} .fr { transform-box: fill-box; animation: ${id}-flap .6s ease-in-out infinite; }
      .sc-${id} .fl { transform-origin: right center; } .sc-${id} .fr { transform-origin: left center; }
      .sc-${id} .bf { transition: transform 1s ease-in-out 1s; }
      .on3 .sc-${id} .bf { transform: translate(294px, -72px); }
      .sc-${id} .sky { transition: fill .6s ease .9s, stroke .6s ease .9s; }
      .on3 .sc-${id} .sky { fill: ${C.sky}; stroke: ${C.blue}; stroke-dasharray: none; }`;
    // 낱말 줄: 칸 1에는 '나비가 하늘로 날아오릅니다'만 가운데에 있다
    body += at(1, 'fin', T(r[1]), 0.2);
    body += `<g class="mv">` + at(1, 'fin', T(r[3]) + T(r[4]), 0.3) + '</g>';
    css += move(id, 'mv', `translateX(${-SH}px)`, 3, { dur: 0.7, delay: 0.1 });
    body += at(2, 'drop', `<g class="m1">${T(r[0], { fill: ROLE.y[0], stroke: C.orange })}</g>`, 0.2);
    body += curve(r[0].cx, 78, r[1].cx - 16, 78, 48, C.orange, 2, { width: 3.5, delay: 0.5 });
    body += at(3, 'drop', `<g class="m2">${T(r[2], { fill: C.sky, stroke: C.blue })}</g>`, 0.7);
    body += curve(r[2].cx, 78, r[3].cx - 16, 78, 48, C.blue, 3, { width: 3.5, delay: 0.9 });
    css += pulseCss(id, '.m1', 4, 0.3) + pulseCss(id, '.m2', 4, 0.7);
    body += at(4, 'pop', tag(150, 196, '꾸며 주는 말', ROLE.y, 22), 1.0);
    put(K + '2/꾸며 주는 말', svg(id, body, css));
  })();

  // ── 2단원: 음력(달이 지구 둘레를 한 바퀴 도는 동안 달력 한 장이 채워진다) ──────────────────────────────
  (function () {
    const id = 't31-k2-eumryeok';
    let css = base(id);
    const EX = 190, EY = 196, R = 116;
    let body = at(1, 'fin', `<circle cx="${EX}" cy="${EY}" r="${R}" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`);
    body += `<g class="b2"><path class="trail" pathLength="1" d="M${EX} ${EY - R} A${R} ${R} 0 0 0 ${EX} ${EY + R} A${R} ${R} 0 0 0 ${EX} ${EY - R}" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
    body += at(1, 'pop', `<circle cx="${EX}" cy="${EY}" r="36" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><path d="M${EX - 22} ${EY - 14} q10 -8 18 0 q6 8 -4 14 q-12 2 -14 -14 Z M${EX + 6} ${EY + 8} q12 -6 18 4 q-4 12 -16 8 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/>` + text(EX, EY + 62, '지구', { size: 19, color: C.blue }), 0.1);
    body += at(1, 'pop', `<g class="mo"><circle cx="${EX}" cy="${EY - R}" r="15" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/></g>`, 0.4);
    body += `<g class="b1 h2">${g('fin fin1', text(EX + 30, EY - R - 6, '달', { size: 19, anchor: 'start', color: C.orange }), 0.6)}</g>`;
    body += at(1, 'pop', tag(116, 70, '1일', ROLE.y, 18), 0.9);
    body += at(2, 'pop', tag(108, 326, '15일', ROLE.y, 18), 1.8);
    body += at(3, 'pop', tag(362, 196, '한 바퀴', ROLE.o, 18), 1.9);
    css += `.sc-${id} .trail { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s linear .3s; }
      .on2 .sc-${id} .trail { stroke-dashoffset: .5; }
      .on3 .sc-${id} .trail { stroke-dashoffset: 0; }
      .sc-${id} .mo { transform-box: view-box; transform-origin: ${EX}px ${EY}px; transition: transform 1.6s linear .3s; }
      .on2 .sc-${id} .mo { transform: rotate(-180deg); }
      .on3 .sc-${id} .mo { transform: rotate(-360deg); }`;
    // 달력 한 장: 30칸이 줄마다 채워진다
    const CX = 410, CY = 120, CW = 34, CH = 40;
    let cal = `<rect x="${CX}" y="80" width="${CW * 6}" height="40" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + text(CX + CW * 3, 107, '달력', { size: 20, color: C.orange })
      + `<rect x="${CX}" y="${CY}" width="${CW * 6}" height="${CH * 5}" fill="white"/>`;
    for (let i = 0; i < 5; i++) cal += `<rect class="rw rw${i}" x="${CX}" y="${CY + i * CH}" width="${CW * 6}" height="${CH}" fill="${C.yellow}" fill-opacity=".55"/>`;
    let grid = `M${CX} ${CY} H${CX + CW * 6} V${CY + CH * 5} H${CX} Z`;
    for (let i = 1; i < 5; i++) grid += ` M${CX} ${CY + i * CH} H${CX + CW * 6}`;
    for (let j = 1; j < 6; j++) grid += ` M${CX + j * CW} ${CY} V${CY + CH * 5}`;
    cal += `<path d="${grid}" stroke="${C.muted}" stroke-width="2" fill="none"/>`;
    cal += text(CX + CW / 2, CY + 27, '1', { size: 18 }) + text(CX + CW * 2.5, CY + CH * 2 + 27, '15', { size: 18 }) + text(CX + CW * 5.5, CY + CH * 4 + 27, '30', { size: 18 });
    body += at(1, 'fin', cal, 0.6);
    css += `.sc-${id} .rw { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .5s linear; }
      .on2 .sc-${id} .rw0 { transform: none; transition-delay: .3s; }
      .on2 .sc-${id} .rw1 { transform: none; transition-delay: .85s; }
      .on2 .sc-${id} .rw2 { transform: scaleX(.5); transition-delay: 1.4s; }
      .on3 .sc-${id} .rw2 { transform: none; transition-delay: .3s; }
      .on3 .sc-${id} .rw3 { transform: none; transition-delay: .85s; }
      .on3 .sc-${id} .rw4 { transform: none; transition-delay: 1.4s; }`;
    body += glowRect(CX - 5, 75, CW * 6 + 10, CH * 5 + 50, 4, C.orange, 0.2, 12);
    body += at(4, 'pop', tag(CX + CW * 3, 46, '음력', ROLE.o, 22), 0.8);
    put(K + '2/음력', svg(id, body, css));
  })();

  // ── 2단원: 단오(음력 열두 달 가운데 다섯째 달의 다섯째 날, 더위가 시작될 무렵) ──────────────────────────────
  (function () {
    const id = 't31-k2-dano';
    let css = base(id);
    let body = at(1, 'pop', tag(154, 60, '음력', ROLE.y, 20), 0);
    for (let m = 1; m <= 12; m++) {
      const c = (m - 1) % 4, rw = Math.floor((m - 1) / 4), x = 30 + c * 62, y = 92 + rw * 54;
      body += at(1, 'pop', `<g class="tl mm${m}"><rect class="bg" x="${x + 3}" y="${y + 3}" width="56" height="48" rx="8" fill="white" stroke="${C.line}" stroke-width="2.5"/>${text(x + 31, y + 34, m + '월', { size: 19, cls: 'tx' })}</g>`, 0.1 + m * 0.05);
    }
    // 칸 2: 1월부터 차례로 세어 5월
    css += [1, 2, 3, 4].map((m) => paint(id, `.mm${m}`, [ROLE.y[0], C.orange], 2, 0.2 + (m - 1) * 0.3)).join('') + paint(id, '.mm5', [C.yellow, C.orange], 2, 1.4);
    css += pulseCss(id, '.mm5', 2, 1.6);
    // 칸 3: 5월 달력에서 5일
    const PX = 320, DW = 42;
    let page = `<rect x="${PX}" y="92" width="${DW * 7}" height="96" rx="10" fill="white" stroke="${C.orange}" stroke-width="3"/><rect x="${PX}" y="92" width="${DW * 7}" height="40" rx="10" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + text(PX + DW * 3.5, 120, '5월', { size: 22 });
    let sep = '';
    for (let d = 1; d < 7; d++) sep += `M${PX + d * DW} 132 V188 `;
    page += `<path d="${sep}" stroke="${C.line}" stroke-width="2"/>`;
    for (let d = 1; d <= 7; d++) page += text(PX + DW * (d - 0.5), 168, d, { size: 20, color: d === 5 ? C.red : C.ink });
    body += at(3, 'rise', page, 0.1);
    body += `<g class="b3"><circle class="draw draw3" pathLength="1" cx="${PX + DW * 4.5}" cy="161" r="18" fill="none" stroke="${C.red}" stroke-width="4" style="transition-delay:.6s"/></g>`;
    // 온도계: 붉은 기둥이 올라간다
    body += at(3, 'fin', `<rect x="362" y="212" width="20" height="108" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/><rect class="mer" x="367" y="224" width="10" height="96" fill="${C.red}"/><circle cx="372" cy="322" r="14" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>`, 0.5);
    css += `.sc-${id} .mer { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(.25); transition: transform 1.1s ease-out 1s; }
      .on3 .sc-${id} .mer { transform: none; }`;
    // 부채: 흔들린다
    const fx = 540, fy = 330, fr = 74, pt = (deg) => [f(fx + fr * Math.cos(deg * Math.PI / 180)), f(fy + fr * Math.sin(deg * Math.PI / 180))];
    const [a0x, a0y] = pt(-150), [a1x, a1y] = pt(-30);
    const ribs = [-130, -110, -90, -70, -50].map((d) => { const [x, y] = pt(d); return `M${fx} ${fy} L${x} ${y}`; }).join(' ');
    body += at(3, 'pop', `<g class="fan"><path d="M${fx} ${fy} L${a0x} ${a0y} A${fr} ${fr} 0 0 1 ${a1x} ${a1y} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="${ribs}" stroke="${C.orange}" stroke-width="2"/><path d="M${fx} ${fy} V${fy + 22}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/></g>`, 1.2);
    css += `@keyframes ${id}-wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
      .sc-${id} .fan { transform-box: view-box; transform-origin: ${fx}px ${fy}px; }
      .on3 .sc-${id} .fan { animation: ${id}-wave .8s ease-in-out 1.5s 3; }`;
    body += glowRect(PX + DW * 4 - 3, 135, DW + 6, 52, 4, C.red, 0.2, 8);
    body += at(4, 'pop', tag(PX + DW * 4.5, 224, '단오', ROLE.r, 24), 0.7);
    put(K + '2/단오', svg(id, body, css));
  })();

  // ── 2단원: 모내기(못자리에서 기른 모를 다발로 묶어 물 댄 논으로 옮겨 줄 맞춰 심는다) ──────────────────────────────
  (function () {
    const id = 't31-k2-monae';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="30" y="222" width="200" height="66" rx="10" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + tag(130, 318, '못자리', ROLE.y, 19));
    let sp = '';
    for (let x = 44; x <= 216; x += 11) sp += `M${x} 224 q-2 -13 -7 -22 M${x} 224 q2 -15 6 -27 `;
    body += `<g class="b1"><g class="dim dim2"><path class="spr" d="${sp}" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`;
    css += growCss(id, '.spr', 1, { axis: 'Y', origin: 'center bottom', delay: 0.3, dur: 1 });
    body += at(1, 'pop', tag(130, 168, '모', ROLE.p, 20), 1.2);
    // 논(물을 채움)
    body += at(1, 'fin', `<rect x="288" y="182" width="328" height="140" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + tag(578, 156, '논', ROLE.s, 20), 0.5);
    // 칸 2: 모 다발이 논으로 옮겨진다
    const bundle = (x, y) => `<path d="M${x} ${y + 18} q-3 -20 -10 -34 M${x} ${y + 18} q-1 -22 -3 -38 M${x} ${y + 18} q1 -22 3 -38 M${x} ${y + 18} q3 -20 10 -34" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x - 4} ${y + 18} l-2 8 M${x} ${y + 18} v9 M${x + 4} ${y + 18} l2 8" stroke="${C.orange}" stroke-width="2" stroke-linecap="round"/><rect x="${x - 7}" y="${y + 3}" width="14" height="7" rx="2" fill="${C.yellow}" stroke="${C.orange}" stroke-width="1.5"/>`;
    const ends = [[330, 150], [372, 150], [414, 150]], starts = [[80, 196, -8], [130, 192, 6], [180, 196, -4]];
    ends.forEach(([x, y], i) => {
      body += `<g class="b2 h3"><g class="bd${i}">${bundle(x, y)}</g></g>`;
      css += fly(id, `.bd${i}`, [starts[i][0] - x, starts[i][1] - y, starts[i][2]], 2, { delay: 0.4 + i * 0.3, dur: 1 });
    });
    body += curve(200, 184, 300, 142, 104, C.muted, 2, { width: 4, delay: 0.2 });
    // 칸 3: 줄 맞춰 심은 모
    [228, 268, 308].forEach((y, i) => {
      let d = '';
      for (let j = 0; j < 6; j++) { const x = 330 + j * 50; d += `M${x} ${y} V${y - 9} q-3 -11 -14 -12 M${x} ${y - 9} q3 -11 14 -12 M${x} ${y - 9} q0 -11 1 -20 `; }
      let rip = '';
      for (let j = 0; j < 6; j++) rip += `M${322 + j * 50} ${y + 3} h16 `;
      body += `<g class="b3">${g('fin fin3', `<path d="${rip}" stroke="${C.blue}" stroke-width="2.5" stroke-linecap="round"/>`, 0.2 + i * 0.4)}<path class="row${i}" d="${d}" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
      css += growCss(id, `.row${i}`, 3, { axis: 'Y', origin: 'center bottom', delay: 0.2 + i * 0.4, dur: 0.6 });
    });
    body += glowRect(284, 178, 336, 148, 4, C.green, 0.2, 12);
    body += at(4, 'pop', tag(452, 140, '모내기', ROLE.p, 24), 0.7);
    put(K + '2/모내기', svg(id, body, css));
  })();

  // ── 2단원: 백야(우리나라는 해가 져서 밤이 어둡고, 여름의 핀란드는 밤 12시에도 해가 지지 않는다) ──────────────────────────────
  (function () {
    const id = 't31-k2-baekya';
    let css = base(id);
    const sky = (x) => `<rect x="${x}" y="66" width="290" height="186" fill="${C.sky}"/>`;
    const ground = (x) => `<rect x="${x}" y="250" width="290" height="56" fill="${C.mint}"/><path d="M${x} 250 H${x + 290}" stroke="${C.green}" stroke-width="3"/><rect x="${x}" y="66" width="290" height="240" fill="none" stroke="${C.line}" stroke-width="3"/>`;
    const sun = `<path d="M0 -27 V-23 M0 23 V27 M-27 0 H-23 M23 0 H27 M-19 -19 l3 3 M19 19 l-3 -3 M-19 19 l3 -3 M19 -19 l-3 3" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/><circle r="17" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
    // 왼쪽: 우리나라
    const quad = (t) => [50 + 230 * t, (1 - t) ** 2 * 262 + 2 * t * (1 - t) * -20 + t * t * 262];
    let kf = '';
    for (let i = 0; i <= 8; i++) { const [x, y] = quad(i / 8); kf += `${i * 10}% { transform: translate(${f(x)}px, ${f(y)}px); } `; }
    kf += '100% { transform: translate(282px, 282px); opacity: 0; }';
    let left = sky(20) + `<path d="M50 262 Q165 -20 280 262" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="6 7" fill="none"/>` + `<g class="sunL">${sun}</g>`
      + `<rect class="night" x="20" y="66" width="290" height="186" fill="${C.ink}"/>`;
    let body = at(1, 'fin', left);
    body += at(2, 'fin', `<path d="M226 98 a22 22 0 1 0 22 30 a17 17 0 1 1 -22 -30 Z" fill="${C.yellow}"/>` + [[60, 96], [110, 130], [150, 88], [84, 176], [190, 150], [272, 104], [262, 190]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="white"/>`).join(''), 0.8);
    body += at(1, 'fin', ground(20) + tag(165, 330, '우리나라', ['white', C.muted], 19));
    body += at(2, 'pop', tag(165, 38, '밤 12시', ROLE.x, 19), 1.0);
    css += `@keyframes ${id}-sunL { ${kf} }
      .sc-${id} .sunL { transform: translate(50px, 262px); }
      .on1 .sc-${id} .sunL { animation: ${id}-sunL 2s linear .2s both; }
      .sc-${id} .night { opacity: 0; transition: opacity .9s ease .2s; }
      .on2 .sc-${id} .night { opacity: .8; }`;
    // 오른쪽: 여름의 핀란드 — 해가 낮게 내려왔다가 다시 올라간다
    const ell = (deg) => [f(475 + 105 * Math.cos(deg * Math.PI / 180)), f(150 + 52 * Math.sin(deg * Math.PI / 180))];
    const kfR = (from, to) => { let s = ''; for (let i = 0; i <= 6; i++) { const [x, y] = ell(from + (to - from) * i / 6); s += `${f(i * 100 / 6)}% { transform: translate(${x}px, ${y}px); } `; } return s; };
    const right = sky(330) + `<ellipse class="draw draw3" pathLength="1" cx="475" cy="150" rx="105" ry="52" fill="none" stroke="${C.orange}" stroke-width="2.5"/>` + `<g class="sunR">${sun}</g>` + ground(330) + tag(475, 330, '핀란드 여름', ['white', C.muted], 19);
    body += at(3, 'rise', right, 0);
    body += at(3, 'pop', tag(565, 232, '밤 12시', ROLE.x, 19), 1.9);
    css += `@keyframes ${id}-sunA { ${kfR(-90, 90)} }
      @keyframes ${id}-sunB { ${kfR(90, 270)} }
      .sc-${id} .sunR { transform: translate(475px, 98px); }
      .on3 .sc-${id} .sunR { animation: ${id}-sunA 1.8s linear .4s both; }
      .on4 .sc-${id} .sunR { animation: ${id}-sunB 1.6s linear .3s both; }`;
    body += glowRect(326, 62, 298, 248, 4, C.orange, 0.2, 8);
    body += at(4, 'pop', tag(475, 38, '백야', ROLE.o, 24), 0.8);
    put(K + '2/백야', svg(id, body, css));
  })();

  // ── 3단원: 짜임새(「흥부전」을 읽고 쓴 글(108·109쪽) — 엉뚱한 제비 집 문장이 고리를 끊고, 빼고 다짐을 넣으니 이어진다. 띠 글은 교과서 문장을 줄인 것) ──────────────────────────────
  (function () {
    const id = 't31-k2-jjaim';
    let css = base(id);
    const X = 320, W = 420, o = { size: 20, h: 50, w: W, fill: 'white', stroke: C.green };
    const link = (y, cls) => `<rect class="lk ${cls}" x="${X - 9}" y="${y - 28}" width="18" height="56" rx="9" fill="white" stroke="${C.muted}" stroke-width="4"/>`;
    let body = at(1, 'fin', link(132, 'lk1') + link(212, 'lk2'), 0.7);
    body += at(1, 'slide', `<g class="s1">${tile(X, 92, '제비 다리를 치료해 준 부분에서 감동', o)}</g>`, 0);
    body += at(1, 'slide', `<g class="s2"><g class="sk">${tile(X, 172, '제비가 왜 처마 밑에 집을 짓는지 궁금', o)}</g></g>`, 0.2);
    body += at(1, 'slide', `<g class="s3">${tile(X, 252, '착한 마음이 느껴졌기 때문', o)}</g>`, 0.4);
    // 칸 2: 가운데 문장이 흔들리고 고리가 끊긴다
    css += paint(id, '.s2', [C.peach, C.red], 2, 0.2);
    css += `.sc-${id} .lk { transition: stroke .5s ease .5s; }
      .on2 .sc-${id} .lk { stroke: ${C.red}; stroke-dasharray: 7 6; }
      .on3 .sc-${id} .lk { stroke: ${C.green}; stroke-dasharray: none; transition-delay: 1.4s; }
      .sc-${id} .sk { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .sk { animation: ${id}-shake .6s ease-in-out .3s 2; }
      .on3 .sc-${id} .sk { animation: none; }`;
    body += `<g class="b2 h3">` + g('pop pop2', cross(X + 40, 132, 9), 0.9) + g('pop pop2', cross(X + 40, 212, 9), 1.1) + '</g>';
    // 칸 3: 그 문장을 빼고, 아래 문장을 올리고, 다짐을 끝에 넣는다
    css += `.sc-${id} .s2 { transition: transform .8s ease-in .2s, opacity .6s ease .4s; }
      .on3 .sc-${id} .s2 { transform: translateX(300px); opacity: 0; }`;
    css += move(id, 's3', 'none', 3, { dur: 0.7, delay: 0.7, to: 'translateY(-80px)' });
    body += at(3, 'slide', tile(X, 252, '나도 흥부처럼 모든 생명을 소중히', o), 1.2);
    css += pulseCss(id, '.lk1', 3, 1.8) + pulseCss(id, '.lk2', 3, 1.9);
    body += glowRect(X - W / 2 - 8, 60, W + 16, 224, 4, C.green, 0.2, 16);
    body += at(4, 'pop', tag(X, 326, '짜임새', ROLE.p, 24), 0.8);
    put(K + '3/짜임새', svg(id, body, css));
  })();

  // ── 3단원: 문단(「플라스틱의 두 얼굴」 글줄 — 한 칸 들여 쓰며 시작하는 덩어리 넷, 가는 좋은 점·나는 나쁜 점) ──────────────────────────────
  (function () {
    const id = 't31-k2-mundan';
    let css = base(id);
    const L = 84, RR = 436, IN = 30;
    const P = [[72, 96], [132, 156, 180], [216, 240, 264], [300, 324]];
    const lastW = [190, 230, 150, 250];
    let body = at(1, 'fin', `<rect x="60" y="44" width="400" height="302" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    P.forEach((lines, i) => {
      const inner = lines.map((y, j) => {
        const x = j ? L : L + IN, w = j === lines.length - 1 ? lastW[i] : RR - x;
        return `<rect class="ln" x="${x}" y="${y - 6}" width="${w}" height="12" rx="6"/>`;
      }).join('');
      body += at(1, 'fin', `<g class="pg pg${i}">${inner}</g>`, 0.1 + i * 0.2);
      body += at(1, 'pop', `<rect class="ind" x="${L + 1}" y="${lines[0] - 10}" width="${IN - 5}" height="20" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="4 3"/>`, 1.0 + i * 0.15);
    });
    css += `.sc-${id} .ln { fill: #b5c4be; transition: fill .5s ease .3s; }
      .on2 .sc-${id} .pg1 .ln { fill: ${C.green}; }
      .on3 .sc-${id} .pg2 .ln { fill: ${C.orange}; }
      .sc-${id} .ind { transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .ind { animation: ${id}-pulse .6s ease-in-out 1.7s 2; }`;
    const mark = (y, label, col) => `<circle cx="36" cy="${y}" r="16" fill="white" stroke="${col}" stroke-width="3"/>` + text(36, y + 7, label, { size: 19, color: col });
    body += at(2, 'pop', mark(156, '가', C.green), 0.2) + at(2, 'fin', braceR(474, 122, 190, C.green), 0.6) + at(2, 'pop', tag(548, 156, '좋은 점', ROLE.p, 20), 0.9);
    body += at(3, 'pop', mark(240, '나', C.orange), 0.2) + at(3, 'fin', braceR(474, 206, 274, C.orange), 0.6) + at(3, 'pop', tag(548, 240, '나쁜 점', ROLE.o, 20), 0.9);
    // 칸 4: 덩어리마다 테두리
    const box = [[58, 52], [118, 76], [202, 76], [286, 52]];
    box.forEach(([y, h], i) => {
      body += `<g class="b4"><rect class="draw draw4" pathLength="1" x="70" y="${y}" width="380" height="${h}" rx="8" fill="none" stroke="${C.blue}" stroke-width="3" style="transition-delay:${f(0.2 + i * 0.3)}s"/></g>`;
    });
    body += at(4, 'pop', tag(548, 72, '문단', ROLE.s, 24), 1.4);
    put(K + '3/문단', svg(id, body, css));
  })();

  // ── 3단원: 중심 문장·뒷받침 문장(「플라스틱의 두 얼굴」 문단 가 — 대표하는 문장(○)을 풀어 주는 두 문장(△)이 밑에서 받친다) ──────────────────────────────
  const mainSupport = (id, focus) => {
    let css = base(id);
    const P1 = [320, 110], P2 = [175, 270], P3 = [465, 270];
    let body = `<g class="b3"><g class="pl1"><rect x="160" y="138" width="30" height="104" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g><g class="pl2"><rect x="450" y="138" width="30" height="104" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g></g>`;
    css += growCss(id, '.pl1', 3, { axis: 'Y', origin: 'center bottom', delay: 1.1, dur: 0.6 }) + growCss(id, '.pl2', 3, { axis: 'Y', origin: 'center bottom', delay: 1.3, dur: 0.6 });
    body += at(1, 'pop', `<g class="c1"><g class="sw">${tile(P1[0], P1[1], '좋은 점이 많아 널리 쓰임', { size: 22, h: 56, w: 400, fill: 'white', stroke: C.line })}</g></g>`, 0);
    body += at(1, 'pop', `<g class="c2">${tile(P2[0], P2[1], '모양을 자유롭게 바꿈', { size: 19, h: 52, w: 270, fill: 'white', stroke: C.line })}</g>`, 0.2);
    body += at(1, 'pop', `<g class="c3">${tile(P3[0], P3[1], '단단하고 가볍고 녹슬지 않음', { size: 19, h: 52, w: 270, fill: 'white', stroke: C.line })}</g>`, 0.4);
    css += fly(id, '.c1', [70, 180, 3], 2, { delay: 0.2, dur: 0.9 }) + fly(id, '.c2', [5, -70, -4], 3, { delay: 0.2, dur: 0.9 }) + fly(id, '.c3', [5, -74, 4], 3, { delay: 0.5, dur: 0.9 });
    css += paint(id, '.c1', [C.peach, C.orange], 2, 1.0) + paint(id, '.c2', ROLE.s, 3, 1.0) + paint(id, '.c3', ROLE.s, 3, 1.3);
    // ○(중심 문장)·△(뒷받침 문장) 표시
    body += `<g class="b2"><circle class="draw draw2" pathLength="1" cx="88" cy="110" r="15" fill="none" stroke="${C.orange}" stroke-width="4" style="transition-delay:1.2s"/></g>`;
    const tri = (x, y) => `<path class="draw draw3" pathLength="1" d="M${x} ${y - 14} L${x + 14} ${y + 11} L${x - 14} ${y + 11} Z" fill="none" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round" style="transition-delay:1.7s"/>`;
    body += `<g class="b3">${tri(122, 196)}${tri(412, 196)}</g>`;
    if (focus === 's') {
      css += `@keyframes ${id}-sway { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
        .sc-${id} .sw { transform-box: fill-box; transform-origin: center; }
        .on2 .sc-${id} .sw { animation: ${id}-sway 1s ease-in-out 1.2s 3; }
        .on3 .sc-${id} .sw { animation: none; }`;
      body += glowRect(36, 240, 278, 60, 4, C.blue, 0.2, 14) + glowRect(326, 240, 278, 60, 4, C.blue, 0.4, 14);
      css += pulseCss(id, '.pl1', 4, 0.3) + pulseCss(id, '.pl2', 4, 0.5);
      body += at(4, 'pop', tag(320, 330, '뒷받침 문장', ROLE.s, 22), 0.8);
    } else {
      body += glowRect(114, 76, 412, 68, 4, C.orange, 0.2, 14);
      body += at(4, 'pop', tag(320, 42, '중심 문장', ROLE.o, 22), 0.8);
    }
    return svg(id, body, css);
  };
  put(K + '3/중심 문장', mainSupport('t31-k2-jungsim', 'c'));
  put(K + '3/뒷받침 문장', mainSupport('t31-k2-dwit', 's'));

  // ── 3단원: 처마(지붕 끝이 벽 바깥으로 나와 그 밑은 비를 맞지 않고, 제비가 둥지를 짓는다) ──────────────────────────────
  (function () {
    const id = 't31-k2-cheoma';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M24 320 H616" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`);
    body += at(1, 'rise', `<rect x="210" y="180" width="220" height="140" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="292" y="232" width="56" height="88" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`, 0.1);
    body += at(1, 'drop', `<path d="M120 182 L520 182 L420 100 L220 100 Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`, 0.5);
    // 칸 2: 벽 바깥으로 나온 지붕 끝, 비
    const eaveL = 'M120 182 L210 182 L210 108.2 Z', eaveR = 'M430 108.2 L520 182 L430 182 Z';
    body += at(2, 'fin', `<path d="${eaveL}" fill="${C.yellow}" fill-opacity=".85"/><path d="${eaveR}" fill="${C.yellow}" fill-opacity=".85"/>`, 0.2);
    body += `<g class="b2"><path class="flash flash2" d="${eaveL} ${eaveR}" fill="none" stroke="${C.red}" stroke-width="4" stroke-linejoin="round" style="animation-delay:.3s"/></g>`;
    body += `<g class="h3">` + at(2, 'fin', `<path d="M436 198 H514 M444 191 L436 198 L444 205 M506 191 L514 198 L506 205" stroke="${C.red}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 0.8) + '</g>';
    let rain = '';
    [40, 66, 92, 548, 574, 600].forEach((x) => [44, 104, 164, 224].forEach((y) => { rain += `M${x} ${y} l-3 16 `; }));
    body += at(2, 'fin', `<g class="rain"><path d="${rain}" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/></g><rect x="24" y="318" width="94" height="8" rx="4" fill="${C.blue}" fill-opacity=".5"/><rect x="522" y="318" width="94" height="8" rx="4" fill="${C.blue}" fill-opacity=".5"/>`, 0.6);
    css += `@keyframes ${id}-rain { from { transform: translateY(0); } to { transform: translateY(60px); } }
      .on2 .sc-${id} .rain { animation: ${id}-rain .7s linear infinite; }`;
    // 칸 3: 처마 밑 둥지와 제비
    body += at(3, 'pop', `<path d="M431 194 Q433 222 456 222 Q476 220 478 196 Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M438 204 Q456 210 474 202 M440 213 Q456 218 470 211" stroke="${C.ink}" stroke-width="1.5" fill="none"/>`, 0.2);
    const bird = `<g transform="translate(468 189)"><path d="M10 0 L28 -8 M10 0 L28 7" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="14" ry="7" fill="${C.ink}"/><circle cx="-12" cy="-3" r="6.5" fill="${C.ink}"/><path d="M-12 1 Q-4 7 6 3" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M-4 -3 Q8 -10 24 -5 Q10 0 -2 2 Z" fill="${C.muted}"/><path d="M-19 -3 L-25 -1 L-19 0" fill="${C.orange}"/></g>`;
    body += at(3, 'fin', `<g class="bird">${bird}</g>`, 0.3);
    css += move(id, 'bird', 'translate(150px, -100px)', 3, { dur: 1.2, delay: 0.5 });
    // 칸 4
    body += `<g class="b4"><path class="flash flash4" d="${eaveL} ${eaveR}" fill="none" stroke="${C.red}" stroke-width="5" stroke-linejoin="round" style="animation-delay:.2s"/></g>`;
    body += drawLine('M486 82 L472 150', C.red, 4, { width: 3, delay: 0.7 });
    body += at(4, 'pop', tag(490, 62, '처마', ROLE.r, 24), 0.5);
    put(K + '3/처마', svg(id, body, css));
  })();

  // ── 3단원: 녹(물기와 공기에 닿은 쇠못에는 붉은 녹이 번지고, 플라스틱은 녹슬지 않는다) ──────────────────────────────
  (function () {
    const id = 't31-k2-nok';
    let css = base(id);
    const nail = `<rect class="nb" x="140" y="110" width="80" height="16" rx="4" stroke="${C.muted}" stroke-width="3"/><path class="nb" d="M168 126 H192 V280 L180 308 L168 280 Z" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><path d="M175 134 V272" stroke="white" stroke-width="3" stroke-linecap="round"/>`;
    let body = at(1, 'rise', nail + tag(180, 334, '쇠못', ['white', C.muted], 19), 0.1);
    const block = `<rect x="396" y="200" width="30" height="16" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="445" y="200" width="30" height="16" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="494" y="200" width="30" height="16" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="380" y="214" width="160" height="78" rx="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    body += at(1, 'rise', block + tag(460, 334, '플라스틱', ROLE.s, 19), 0.4);
    css += `.sc-${id} .nb { fill: ${C.line}; transition: fill 1.2s ease .6s; }
      .on3 .sc-${id} .nb { fill: ${C.peach}; }`;
    // 칸 2: 물방울과 공기
    const drop = (x, y) => `<path d="M${x} ${y - 13} Q${x + 9} ${y} ${x} ${y + 6} Q${x - 9} ${y} ${x} ${y - 13} Z" fill="${C.blue}"/>`;
    [[204, 160], [158, 236], [196, 266], [420, 230], [500, 252]].forEach(([x, y], i) => { body += at(2, 'drop', drop(x, y), 0.2 + i * 0.15); });
    body += at(2, 'pop', tag(96, 200, '물', ROLE.s, 19), 0.9);
    const wave = (y) => `<path d="M70 ${y} q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    body += at(2, 'slide', wave(72) + wave(94), 0.5);
    body += at(2, 'pop', tag(320, 40, '공기', ['white', C.muted], 19), 1.0);
    // 칸 3: 쇠못에 녹이 번진다
    const spots = [[180, 146, 10, C.orange], [176, 172, 8, C.red], [185, 198, 10, C.orange], [175, 224, 9, C.red], [184, 250, 10, C.orange], [178, 278, 7, C.red], [156, 118, 7, C.red], [204, 118, 7, C.orange], [181, 118, 6, C.red]];
    body += `<g class="b3"><g class="rs">` + spots.map(([x, y, r, col], i) => g('fin fin3', `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" fill-opacity=".9"/>`, 0.6 + i * 0.12)).join('') + '</g></g>';
    body += at(3, 'pop', check(570, 196, 11), 1.8);
    // 칸 4
    css += pulseCss(id, '.rs', 4, 0.3);
    body += drawLine('M238 214 L198 214', C.red, 4, { width: 3, delay: 0.5 });
    body += at(4, 'pop', tag(262, 214, '녹', ROLE.r, 24), 0.8);
    put(K + '3/녹', svg(id, body, css));
  })();

  // ── 3단원: 일정하다(바깥 온도는 오르락내리락, 냉장고 안 온도는 아침·낮·밤 같은 높이) ──────────────────────────────
  (function () {
    const id = 't31-k2-iljeong';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M90 70 V300 H600" stroke="${C.ink}" stroke-width="3" fill="none"/>` + head(90, 66, -Math.PI / 2, C.ink, 3) + head(604, 300, 0, C.ink, 3) + text(90, 52, '온도', { size: 19 }));
    const ts = [[160, '아침'], [330, '낮'], [490, '밤']];
    body += at(1, 'fin', ts.map(([x, l]) => `<path d="M${x} 294 V306" stroke="${C.ink}" stroke-width="3"/>` + text(x, 332, l, { size: 19 })).join(''), 0.3);
    // 칸 2: 바깥 온도
    body += drawLine('M120 236 C190 228 260 112 330 112 S440 238 520 238', C.orange, 2, { width: 5, delay: 0.2 });
    body += at(2, 'fin', text(530, 244, '바깥', { size: 19, anchor: 'start', color: C.orange }), 1.1);
    // 칸 3: 냉장고 안 온도
    body += drawLine('M120 266 H520', C.blue, 3, { width: 5, delay: 0.2 });
    body += at(3, 'fin', text(530, 272, '냉장고 안', { size: 19, anchor: 'start', color: C.blue }), 1.1);
    body += ts.map(([x], i) => at(3, 'pop', `<circle cx="${x}" cy="266" r="8" fill="white" stroke="${C.blue}" stroke-width="4"/>`, 1.2 + i * 0.2)).join('');
    body += `<g class="b3">` + ts.map(([x], i) => g('fin fin3', `<path d="M${x} 274 V294" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="4 4"/>`, 1.3 + i * 0.2)).join('') + '</g>';
    // 칸 4
    body += `<g class="b4"><path class="flash flash4" d="M120 266 H520" stroke="${C.blue}" stroke-width="11" stroke-opacity=".35" stroke-linecap="round" fill="none" style="animation-delay:.2s"/></g>`;
    body += at(4, 'pop', tag(330, 48, '일정하다', ROLE.s, 24), 0.8);
    put(K + '3/일정하다', svg(id, body, css));
  })();

  // ── 3단원: 진열(상자 속 뒤죽박죽 물건을 돗자리 위에 줄 맞추어 죽 벌여 놓는다) ──────────────────────────────
  (function () {
    const id = 't31-k2-jinyeol';
    let css = base(id);
    const Y0 = 284;
    const items = [
      { k: 'i0', x: 300, draw: (x) => `<rect x="${x - 17}" y="${Y0 - 50}" width="34" height="50" rx="3" fill="${C.blue}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x - 10} ${Y0 - 50} V${Y0}" stroke="white" stroke-width="2.5"/>`, st: [72, 200, -24] },
      { k: 'i1', x: 360, draw: (x) => `<rect x="${x - 17}" y="${Y0 - 46}" width="34" height="46" rx="3" fill="${C.purple}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x - 10} ${Y0 - 46} V${Y0}" stroke="white" stroke-width="2.5"/>`, st: [118, 192, 18] },
      { k: 'i2', x: 428, draw: (x) => `<circle cx="${x}" cy="${Y0 - 21}" r="21" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x - 21} ${Y0 - 21} Q${x} ${Y0 - 6} ${x + 21} ${Y0 - 21} M${x} ${Y0 - 42} Q${x - 10} ${Y0 - 21} ${x} ${Y0}" stroke="white" stroke-width="2.5" fill="none"/>`, st: [170, 204, 0] },
      { k: 'i3', x: 504, draw: (x) => `<path d="M${x - 18} ${Y0 - 26} L${x - 10} ${Y0 - 40} H${x + 10} L${x + 18} ${Y0 - 26} Z" fill="${C.sky}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><rect x="${x - 30}" y="${Y0 - 28}" width="60" height="20" rx="5" fill="${C.red}" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${x - 16}" cy="${Y0 - 7}" r="7" fill="${C.ink}"/><circle cx="${x + 16}" cy="${Y0 - 7}" r="7" fill="${C.ink}"/>`, st: [116, 168, 24] },
      { k: 'i4', x: 576, draw: (x) => `<path d="M${x - 20} ${Y0 - 44} H${x + 20} L${x + 14} ${Y0} H${x - 14} Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${x + 19} ${Y0 - 36} q14 2 10 16 q-3 8 -12 8" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`, st: [160, 160, -16] }
    ];
    let body = '';
    items.forEach((it, i) => {
      body += at(1, 'fin', `<g class="${it.k}">${it.draw(it.x)}</g>`, 0.1 + i * 0.1);
      css += fly(id, `.${it.k}`, [it.st[0] - it.x, it.st[1] - (Y0 - 24), it.st[2]], 3, { delay: 0.2 + i * 0.25, dur: 0.9 });
    });
    // 상자 앞면(물건 일부를 가린다)
    body += at(1, 'fin', `<path d="M40 222 L22 196 M210 222 L228 196" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/><rect x="40" y="222" width="170" height="86" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`);
    // 칸 2: 돗자리
    let stripes = '';
    for (let x = 270; x < 616; x += 26) stripes += `M${x} ${Y0 - 6} V${Y0 + 22} `;
    body += `<g class="b2"><g class="mat"><rect x="250" y="${Y0 - 8}" width="366" height="32" rx="4" fill="${ROLE.y[0]}" stroke="${C.orange}" stroke-width="3"/><path d="${stripes}" stroke="${C.yellow}" stroke-width="5"/></g></g>`;
    css += growCss(id, '.mat', 2, { axis: 'X', origin: 'left center', delay: 0.2, dur: 1 });
    body += at(2, 'pop', tag(433, Y0 + 50, '돗자리', ROLE.y, 19), 1.1);
    // 칸 4: 보는 사람들
    body += at(4, 'pop', person(400, 150, C.blue, 15), 0.3) + at(4, 'pop', person(500, 150, C.green, 15), 0.5);
    body += at(4, 'pop', tag(250, 140, '진열', ROLE.o, 24), 1.0);
    put(K + '3/진열', svg(id, body, css));
  })();

  // ── 3단원: 수익금(나눔 장터 물건이 팔릴 때마다 돈 상자에 돈이 모이고, 모인 돈은 이웃을 돕는다) ──────────────────────────────
  (function () {
    const id = 't31-k2-suik';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="40" y="200" width="290" height="14" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M62 214 V316 M308 214 V316" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/><path d="M24 318 H616" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/>`);
    body += at(1, 'pop', tag(185, 70, '나눔 장터', ROLE.p, 21), 0.2);
    const goods = [
      { k: 'g0', x: 96, d: `<path d="M80 160 Q96 134 112 160" stroke="${C.purple}" stroke-width="5" fill="none"/><rect x="70" y="156" width="52" height="42" rx="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` },
      { k: 'g1', x: 186, d: `<path d="M160 188 C160 130 212 130 212 188" stroke="${C.blue}" stroke-width="4" fill="none"/><rect x="153" y="176" width="14" height="22" rx="5" fill="${C.red}"/><rect x="205" y="176" width="14" height="22" rx="5" fill="${C.red}"/>` },
      { k: 'g2', x: 272, d: `<circle cx="256" cy="184" r="13" fill="${C.sky}" stroke="${C.ink}" stroke-width="3"/><circle cx="290" cy="184" r="13" fill="${C.sky}" stroke="${C.ink}" stroke-width="3"/><path d="M269 182 Q273 177 277 182 M243 180 L236 172 M303 180 L310 172" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>` }
    ];
    goods.forEach((it, i) => { body += at(1, 'pop', `<g class="dim ${it.k}">${it.d}</g>`, 0.4 + i * 0.15); });
    // 돈 상자
    body += at(1, 'fin', `<rect x="380" y="190" width="110" height="112" rx="8" fill="white" stroke="${C.ink}" stroke-width="3"/><rect class="fillbox" x="384" y="198" width="102" height="100" rx="4" fill="${C.yellow}" fill-opacity=".8"/><path d="M415 190 H455" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`, 0.6);
    css += `.sc-${id} .fillbox { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform .8s ease-out; }
      .on2 .sc-${id} .fillbox { transform: scaleY(.45); transition-delay: 1.6s; }
      .on3 .sc-${id} .fillbox { transform: none; transition-delay: .3s; }`;
    // 칸 2: 팔릴 때마다 동전이 상자로
    const coin = `<circle cx="435" cy="178" r="13" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><path d="M430 172 V184 M440 172 V184" stroke="${C.orange}" stroke-width="2"/>`;
    goods.forEach((it, i) => {
      const dx = it.x - 435, dy = 170 - 178, s = 0.3 + i * 0.45;
      body += `<g class="b2"><g class="cn cn${i}">${coin}</g></g>`;
      css += `@keyframes ${id}-c${i} { 0% { opacity: 0; transform: translate(${dx}px, ${dy}px); } 15% { opacity: 1; transform: translate(${dx}px, ${dy - 20}px); } 75% { opacity: 1; transform: translate(0, -24px); } 100% { opacity: 0; transform: translate(0, 10px); } }
        .sc-${id} .cn${i} { opacity: 0; }
        .on2 .sc-${id} .cn${i} { animation: ${id}-c${i} 1s ease-in-out ${f(s)}s both; }
        .on2 .sc-${id} .${it.k} { opacity: .15; transition-delay: ${f(s)}s; }`;
    });
    // 칸 3: 가득 모인 돈
    body += at(3, 'pop', tag(435, 150, '수익금', ROLE.y, 22), 1.0);
    body += glowRect(374, 184, 122, 124, 3, C.orange, 0.8, 10);
    // 칸 4: 이웃을 돕는다
    body += at(4, 'rise', house(574, 270, 1) + `<path d="M574 214 C566 204 552 210 560 222 L574 234 L588 222 C596 210 582 204 574 214 Z" fill="${C.red}"/>`, 0.6);
    body += drawArrow(496, 252, 530, 252, C.red, 4, { width: 4, delay: 0.2 });
    put(K + '3/수익금', svg(id, body, css));
  })();

  // ── 3단원: 오염(땅에 묻힌 플라스틱은 300년~500년 썩지 않아 땅을, 바다로 간 쓰레기는 바닷물을 더럽힌다) ──────────────────────────────
  (function () {
    const id = 't31-k2-oyeom';
    let css = base(id);
    const fish = (x, y) => `<path d="M${x - 22} ${y} Q${x} ${y - 16} ${x + 18} ${y} Q${x} ${y + 16} ${x - 22} ${y} Z M${x + 16} ${y} L${x + 30} ${y - 10} V${y + 10} Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${x - 10}" cy="${y - 3}" r="2.5" fill="${C.ink}"/>`;
    let body = at(1, 'fin', `<rect x="330" y="206" width="290" height="122" fill="${C.sky}"/><path d="M356 206 q15 -8 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="${C.blue}" stroke-width="3" fill="none"/>`);
    body += at(1, 'fin', `<g class="fs">${fish(480, 270)}</g>`, 0.5);
    body += `<g class="b3"><rect class="mud" x="330" y="206" width="290" height="122" fill="${C.muted}"/></g>`;
    body += at(1, 'fin', `<path d="M20 180 H330 L364 214 V328 H20 Z" fill="${C.peach}"/><path d="M20 176 H330 L362 208" stroke="${C.green}" stroke-width="10" fill="none" stroke-linejoin="round"/><path d="M20 328 H620" stroke="${C.muted}" stroke-width="3"/>`);
    body += at(1, 'pop', `<path d="M88 172 V146" stroke="${C.orange}" stroke-width="9" stroke-linecap="round"/><circle cx="72" cy="132" r="20" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="104" cy="132" r="20" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="88" cy="112" r="22" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`, 0.3);
    css += `@keyframes ${id}-swim { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-40px); } }
      .on1 .sc-${id} .fs { animation: ${id}-swim 2.4s ease-in-out infinite; }
      .on3 .sc-${id} .fs { animation: ${id}-shake .5s ease-in-out 1.6s 3; }`;
    // 칸 2: 땅에 묻힌 플라스틱
    const bottle = (x, y) => `<path d="M${x - 6} ${y - 26} H${x + 6} V${y - 18} Q${x + 13} ${y - 12} ${x + 13} ${y - 4} V${y + 22} H${x - 13} V${y - 4} Q${x - 13} ${y - 12} ${x - 6} ${y - 18} Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`;
    const cup = (x, y) => `<path d="M${x - 16} ${y - 18} H${x + 16} L${x + 11} ${y + 18} H${x - 11} Z" fill="white" stroke="${C.red}" stroke-width="3" stroke-linejoin="round"/>`;
    body += at(2, 'fin', `<g class="tA">${bottle(176, 236)}</g><g class="tB">${cup(262, 252)}</g>`, 0.1);
    css += fly(id, '.tA', [0, -100, -20], 2, { delay: 0.2, dur: 1 }) + fly(id, '.tB', [0, -110, 15], 2, { delay: 0.4, dur: 1 });
    body += `<g class="b2">` + [[176, 240, 40], [262, 256, 34]].map(([x, y, r], i) => g('fin fin2', `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="${C.muted}" fill-opacity=".3"/>`, 1.2 + i * 0.2)).join('') + '</g>';
    body += at(2, 'pop', tag(178, 306, '300년~500년', ['white', C.muted], 18), 1.6);
    // 칸 3: 바다로 간 쓰레기
    css += `.sc-${id} .mud { opacity: 0; transition: opacity 1s ease 1s; } .on3 .sc-${id} .mud { opacity: .35; }`;
    body += at(3, 'fin', `<g class="tC">${bottle(420, 214)}</g><g class="tD">${cup(560, 222)}</g>`, 0.1);
    css += fly(id, '.tC', [-120, -50, -60], 3, { delay: 0.2, dur: 1 }) + fly(id, '.tD', [-260, -60, 40], 3, { delay: 0.4, dur: 1.1 });
    // 칸 4
    body += glowRect(130, 196, 180, 96, 4, C.muted, 0.2, 14) + glowRect(346, 200, 270, 124, 4, C.muted, 0.4, 10);
    body += at(4, 'pop', tag(320, 60, '오염', ['white', C.muted], 24), 0.8);
    put(K + '3/오염', svg(id, body, css));
  })();

  // ── 2단원: 성질·상태(짝 도식 — 같은 얼음 그림. 성질은 크기가 달라도 언제나 같고, 상태는 같은 물건이 때에 따라 바뀐다) ──────────────────────────────
  const iceCube = (x, y, k = 1) => {
    const w = 44 * k, h = 40 * k;
    return `<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" rx="${f(7 * k)}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><path d="M${f(x - w / 2 + 8 * k)} ${f(y - h + 9 * k)} H${f(x - w / 2 + 20 * k)}" stroke="white" stroke-width="${f(4 * k)}" stroke-linecap="round"/>`;
  };
  const flake = (x, y, col = C.blue) => `<path d="M${x} ${y - 10} V${y + 10} M${x - 9} ${y - 5} L${x + 9} ${y + 5} M${x - 9} ${y + 5} L${x + 9} ${y - 5}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
  (function () {
    const id = 't31-k2-seongjil';
    let css = base(id);
    const XS = [210, 310, 420], KS = [0.7, 1, 1.35];
    let body = at(1, 'pop', tag(80, 126, '얼음', ROLE.s, 21), 0) + at(1, 'pop', tag(80, 262, '설탕', ['white', C.muted], 21), 0.2);
    XS.forEach((x, i) => {
      body += at(1, 'pop', iceCube(x, 150, KS[i]), 0.3 + i * 0.15);
      const w = 30 * KS[i], h = 26 * KS[i];
      body += at(1, 'pop', `<path d="M${f(x - w)} 286 Q${f(x - w * 0.4)} ${f(286 - h)} ${x} ${f(286 - h)} Q${f(x + w * 0.4)} ${f(286 - h)} ${f(x + w)} 286 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
        + [[-0.4, 0.35], [0.1, 0.6], [0.45, 0.3], [-0.05, 0.25]].map(([dx, dy]) => `<circle cx="${f(x + dx * w)}" cy="${f(286 - dy * h)}" r="2" fill="${C.muted}"/>`).join(''), 0.5 + i * 0.15);
    });
    // 칸 2: 얼음은 크기가 달라도 모두 차갑다
    body += `<g class="b2"><g class="bandA"><rect x="160" y="60" width="320" height="12" rx="6" fill="${C.blue}" fill-opacity=".35"/></g></g>`;
    css += growCss(id, '.bandA', 2, { axis: 'X', origin: 'left center', delay: 1.0, dur: 0.6 });
    XS.forEach((x, i) => { body += at(2, 'pop', flake(x, 66), 0.2 + i * 0.25); });
    body += at(2, 'pop', tag(556, 126, '차갑다', ROLE.s, 22), 1.4);
    body += drawArrow(486, 126, 504, 126, C.blue, 2, { width: 4, delay: 1.2 });
    // 칸 3: 설탕은 크기가 달라도 모두 달다
    body += `<g class="b3"><g class="bandB"><rect x="160" y="212" width="320" height="12" rx="6" fill="${C.orange}" fill-opacity=".35"/></g></g>`;
    css += growCss(id, '.bandB', 3, { axis: 'X', origin: 'left center', delay: 1.0, dur: 0.6 });
    XS.forEach((x, i) => { body += at(3, 'pop', check(x, 218, 8, C.orange), 0.2 + i * 0.25); });
    body += at(3, 'pop', tag(556, 262, '달다', ROLE.o, 22), 1.4);
    body += drawArrow(486, 262, 518, 262, C.orange, 3, { width: 4, delay: 1.2 });
    // 칸 4
    body += glowRect(510, 104, 92, 44, 4, C.blue, 0.2, 22) + glowRect(522, 240, 68, 44, 4, C.orange, 0.4, 22);
    body += at(4, 'pop', tag(320, 34, '성질', ROLE.p, 24), 0.8);
    put(K + '2/성질', svg(id, body, css));
  })();
  (function () {
    const id = 't31-k2-sangtae';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M40 300 H600" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`);
    // 상태 꼬리표는 이 단원이 말하는 '어떠하다' 꼴로(72쪽 "'어떠하다'는 … 성질이나 상태를 나타내요")
    // 컵: 물이 없다 → 물이 많다
    const cup = 'M126 168 L214 168 L203 298 L137 298 Z';
    body += at(1, 'rise', `<g class="wat"><path d="M131 182 L209 182 L203 298 L137 298 Z" fill="${C.sky}"/></g><path d="${cup}" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>`, 0.1);
    css += `.sc-${id} .wat { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform 1.2s ease-out .9s; }
      .on2 .sc-${id} .wat { transform: none; }`;
    const jug = `<g transform="rotate(-40 214 70)"><path d="M196 48 H236 V96 Q236 104 228 104 H204 Q196 104 196 96 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M196 52 L184 46" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><path d="M236 58 Q252 62 248 78 Q246 88 236 88" stroke="${C.ink}" stroke-width="3" fill="none"/></g>`;
    body += `<g class="h3"><g class="st">` + at(2, 'drop', jug, 0) + drawLine('M178 76 Q172 120 170 190', C.blue, 2, { width: 7, delay: 0.4 }) + '</g></g>';
    css += `.sc-${id} .st { transition: opacity .5s ease 2.3s; } .on2 .sc-${id} .st { opacity: 0; }`;
    body += `<g class="b1 h2">${g('pop pop1', tag(170, 334, '물이 없다', ['white', C.muted], 20), 0.6)}</g>`;
    body += at(2, 'pop', tag(170, 334, '물이 많다', ROLE.s, 20), 1.9);
    // 얼음: 차갑다 → (햇볕에 녹아) 미지근하다
    body += `<g class="b3"><g class="pud"><ellipse cx="450" cy="292" rx="78" ry="11" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g></g>`;
    css += growCss(id, '.pud', 3, { axis: 'X', origin: 'center', delay: 0.6, dur: 1.4 });
    body += at(1, 'rise', `<g class="ic">${iceCube(450, 296, 2)}</g>`, 0.4);
    css += `.sc-${id} .ic { transform-box: fill-box; transform-origin: center bottom; transition: transform 1.6s ease-in .5s, opacity .5s ease 1.8s; }
      .on3 .sc-${id} .ic { transform: scale(.25, .15); opacity: 0; }`;
    body += `<g class="b1 h3">${g('pop pop1', tag(450, 334, '차갑다', ['white', C.muted], 20), 0.8)}</g>`;
    body += at(3, 'pop', tag(450, 334, '미지근하다', ROLE.s, 20), 1.9);
    const sun = `<g class="ray"><path d="M0 -36 V-28 M0 28 V36 M-36 0 H-28 M28 0 H36 M-25 -25 l6 6 M25 25 l-6 -6 M-25 25 l6 -6 M25 -25 l-6 6" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/></g><circle r="20" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
    body += at(3, 'pop', `<g transform="translate(570 92)">${sun}</g>`, 0.1);
    css += `@keyframes ${id}-spin { to { transform: rotate(45deg); } }
      .sc-${id} .ray { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .ray { animation: ${id}-spin 1.2s ease-in-out .4s 2 alternate; }`;
    // 칸 4
    body += glowRect(104, 314, 132, 42, 4, C.blue, 0.2, 21) + glowRect(376, 314, 148, 42, 4, C.blue, 0.4, 21);
    body += at(4, 'pop', tag(320, 40, '상태', ROLE.p, 24), 0.8);
    put(K + '2/상태', svg(id, body, css));
  })();

  // ── 3단원: 덧붙이다(교과서 116쪽 학교 소개 문단 — 첫 문장 뒤에 교실·도서관·강당 문장을 하나씩 더 붙인다) ──────────────────────────────
  (function () {
    const id = 't31-k2-deotbut';
    let css = base(id);
    let body = `<g class="b1"><g class="bar"><rect x="112" y="44" width="10" height="246" rx="5" fill="${C.green}"/></g></g>`;
    css += `.sc-${id} .bar { transform-box: fill-box; transform-origin: center top; transform: scaleY(.22); transition: transform .8s ease-in-out; }
      .on2 .sc-${id} .bar { transform: scaleY(.47); transition-delay: .3s; }
      .on3 .sc-${id} .bar { transform: none; transition-delay: .3s; }`;
    body += at(1, 'pop', tile(370, 70, '우리 학교에는 다양한 장소가 있다', { size: 21, h: 52, w: 440, fill: C.peach, stroke: C.orange }), 0.2);
    const add = (y, label, n, delay) => at(n, 'slide', `<g class="ad">${tile(392, y, label, { size: 20, h: 48, w: 396, fill: C.sky, stroke: C.blue })}<circle cx="168" cy="${y}" r="16" fill="white" stroke="${C.blue}" stroke-width="3"/>${text(168, y + 8, '+', { size: 24, color: C.blue })}</g>`, delay);
    body += add(142, '수업을 듣는 교실이 있다', 2, 0.2);
    body += add(206, '책을 읽는 도서관도 있다', 3, 0.2) + add(270, '행사가 열리는 강당이 있다', 3, 0.8);
    body += glowRect(146, 114, 450, 186, 4, C.blue, 0.2, 14);
    body += at(4, 'pop', tag(370, 330, '덧붙이다', ROLE.s, 24), 0.8);
    put(K + '3/덧붙이다', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
