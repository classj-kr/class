// 국어 4-1 낱말 도식(2단원 서로 다른 의견·3단원 자세하게 살펴요): 토의 절차·사실과 의견·관찰 보고 낱말을 낱말 조각과 그림으로 움직여 보인다.
// 도구(tile·tag·row·curve·base·move 따위)는 figures/4-2/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
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

  const K = '4-1/국어/';
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
  const cloud = (x, y, color = C.purple, fill = 'white') => `<path d="M${x - 20} ${y + 10} Q${x - 31} ${y + 10} ${x - 28} ${y - 1} Q${x - 30} ${y - 13} ${x - 16} ${y - 12} Q${x - 12} ${y - 24} ${x} ${y - 20} Q${x + 12} ${y - 26} ${x + 16} ${y - 12} Q${x + 30} ${y - 12} ${x + 28} ${y} Q${x + 30} ${y + 10} ${x + 20} ${y + 10} Z" fill="${fill}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;

  // ── 2단원: 절차(교과서 토의 절차 네 칸 — 토의 주제 정하기·의견 마련하기·의견 모으기·의견 결정하기 — 를 계단처럼 하나씩 밟는다) ──────────────────────────────
  (function () {
    const id = 't41-k2-jeolcha';
    let css = base(id);
    const labels = ['토의 주제 정하기', '의견 마련하기', '의견 모으기', '의견 결정하기'];
    const X = (i) => 14 + i * 154, TOP = (i) => 300 - i * 60;
    // 칸 4: 번호를 잇는 줄(번호 동그라미 밑에 깔린다)
    let body = drawLine(`M${X(0) + 22} ${TOP(0) - 20} L${X(1) + 22} ${TOP(1) - 20} L${X(2) + 22} ${TOP(2) - 20} L${X(3) + 22} ${TOP(3) - 20}`, C.green, 4, { width: 4, delay: 0.2 });
    body += at(1, 'fin', tag(56, 40, '주제', ROLE.p, 19) + text(98, 47, '함께 쓰는 색칠 도구', { size: 20, anchor: 'start' }));
    labels.forEach((l, i) => {
      const x = X(i), t = TOP(i);
      body += at(1, 'rise', `<g class="tl st${i}"><rect class="bg" x="${x}" y="${t}" width="150" height="${356 - t}" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>${text(x + 75, t + 33, l, { size: 18, cls: 'tx' })}</g>`, 0.2 + i * 0.25);
      body += at(1, 'pop', `<g class="nm nm${i}"><circle cx="${x + 22}" cy="${t - 20}" r="14" fill="white" stroke="${C.muted}" stroke-width="2.5"/>${text(x + 22, t - 13.5, i + 1, { size: 18, color: C.muted })}</g>`, 0.5 + i * 0.25);
    });
    // 밟는 사람: 칸 2에 첫 칸에 서서 둘째 칸으로, 칸 3에 셋째·넷째 칸으로 뛰어오른다
    body += `<g class="b2"><g class="mk">${g('pop pop2', person(X(0) + 98, TOP(0) - 16.5, C.orange, 11), 0)}</g></g>`;
    css += `@keyframes ${id}-hopA { 0%, 30% { transform: none; } 62% { transform: translate(77px, -95px); } 100% { transform: translate(154px, -60px); } }
      @keyframes ${id}-hopB { 0% { transform: translate(154px, -60px); } 20% { transform: translate(231px, -155px); } 40%, 55% { transform: translate(308px, -120px); } 75% { transform: translate(385px, -215px); } 100% { transform: translate(462px, -180px); } }
      .on2 .sc-${id} .mk { animation: ${id}-hopA 1.4s ease-in-out .3s both; }
      .on3 .sc-${id} .mk { animation: ${id}-hopB 1.5s ease-in-out .2s both; }`;
    css += paint(id, '.st0', ROLE.p, 2, 0.3) + paint(id, '.st1', ROLE.p, 2, 1.6) + paint(id, '.st2', ROLE.p, 3, 0.8) + paint(id, '.st3', ROLE.p, 3, 1.6);
    body += at(3, 'pop', check(X(3) + 128, TOP(3) - 28, 11), 1.7);
    css += `.sc-${id} .nm { transform-box: fill-box; transform-origin: center; }`
      + [0, 1, 2, 3].map((i) => `.on4 .sc-${id} .nm${i} { animation: ${id}-pulse .6s ease-in-out ${(0.3 + i * 0.35).toFixed(2)}s 1; }`).join('');
    body += at(4, 'pop', tag(150, 132, '절차', ROLE.p, 24), 0.6);
    put(K + '2/절차', svg(id, body, css));
  })();

  // ── 2단원: 의견·사실(「하나면 충분합니다」의 조각 셋이 생각 상자와 확인 상자로 갈린다 — 같은 틀, 먼저 옮기는 쪽만 다르다) ──────────────────────────────
  const opinionFact = (id, focus) => {
    let css = base(id);
    const chips = [
      { k: 'f1', label: '2주 넘게 써야 효과', kind: 'f', s: [330, 150, -3], e: [152, 270] },
      { k: 'f2', label: '다회용 제품을 쓰기도 함', kind: 'f', s: [176, 92, 4], e: [152, 318] },
      { k: 'o1', label: '오래 쓰는 습관이 필요함', kind: 'o', s: [458, 104, -4], e: [474, 270] }
    ];
    const nF = focus === 'f' ? 2 : 3, nO = focus === 'f' ? 3 : 2;
    let body = at(1, 'fin', text(320, 38, '「하나면 충분합니다」', { size: 20, color: C.muted }));
    const boxF = `<rect x="16" y="196" width="300" height="152" rx="16" fill="${C.sky}" fill-opacity=".5" stroke="${C.blue}" stroke-width="3"/>` + tag(152, 224, '사실', ROLE.s, 20) + `<g class="mg">${magnifier(266, 220)}</g>`;
    const boxO = `<rect x="324" y="196" width="300" height="152" rx="16" fill="${C.lilac}" fill-opacity=".6" stroke="${C.purple}" stroke-width="3"/>` + tag(474, 224, '의견', ROLE.x, 20) + `<g class="cl">${cloud(586, 224)}</g>`;
    body += `<g class="${focus === 'o' ? 'dim dim4' : ''}">` + at(1, 'fin', boxF, 0.9) + '</g>';
    body += `<g class="${focus === 'f' ? 'dim dim4' : ''}">` + at(1, 'fin', boxO, 1.1) + '</g>';
    chips.forEach((c, i) => {
      body += at(1, 'pop', `<g class="c-${c.k}">${tile(c.e[0], c.e[1], c.label, { size: 19, h: 40, fill: 'white', stroke: C.line })}</g>`, i * 0.25);
      const n = c.kind === 'f' ? nF : nO;
      const d = c.kind === 'f' ? (c.k === 'f1' ? 0.2 : 0.6) : 0.3;
      css += fly(id, `.c-${c.k}`, [c.s[0] - c.e[0], c.s[1] - c.e[1], c.s[2]], n, { delay: d });
      css += paint(id, `.c-${c.k}`, c.kind === 'f' ? ROLE.s : ROLE.x, n, d + 0.9);
    });
    // 사실 쪽: 돋보기가 두 조각을 훑고 맞음 표시
    body += [270, 318].map((y, i) => at(nF, 'pop', check(292, y, 9), 1.9 + i * 0.2)).join('');
    css += `@keyframes ${id}-scan { 0%, 100% { transform: none; } 30% { transform: translate(-220px, 46px); } 65% { transform: translate(-220px, 94px); } }
      .on${nF} .sc-${id} .mg { animation: ${id}-scan 1.2s ease-in-out .8s 1; }
      .sc-${id} .cl { transform-box: fill-box; transform-origin: center; }
      .on${nO} .sc-${id} .cl { animation: ${id}-pulse .6s ease-in-out 1.3s 2; }`;
    // 칸 4: 고른 상자가 반짝이고 이름이 크게 뜬다
    if (focus === 'f') {
      body += glowRect(12, 192, 308, 160, 4, C.blue, 0.2, 18) + at(4, 'pop', tag(320, 120, '사실', ROLE.s, 26), 0.6);
      css += pulseCss(id, '.c-f1 .tl', 4, 0.9) + pulseCss(id, '.c-f2 .tl', 4, 1.1);
    } else {
      body += glowRect(320, 192, 308, 160, 4, C.purple, 0.2, 18) + at(4, 'pop', tag(320, 120, '의견', ROLE.x, 26), 0.6);
      css += pulseCss(id, '.c-o1 .tl', 4, 0.9);
    }
    return svg(id, body, css);
  };
  put(K + '2/의견', opinionFact('t41-k2-uigyeon', 'o'));
  put(K + '2/사실', opinionFact('t41-k2-sasil', 'f'));

  // ── 2단원: 뒷받침(통컵 의견 판을 근거 기둥 둘이 밑에서 받친다) ──────────────────────────────
  (function () {
    const id = 't41-k2-dwit';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M56 316 H584" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`);
    const pillar = (x) => `<rect x="${x}" y="176" width="196" height="140" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    body += `<g class="b2"><g class="p1">${pillar(96)}${tile(194, 250, '2주 넘게 써야 효과', { size: 18, h: 44, w: 180, fill: 'white', stroke: C.blue })}</g></g>`;
    const graph = `<rect x="392" y="190" width="108" height="56" rx="6" fill="white" stroke="${C.blue}" stroke-width="2.5"/><path d="M402 236 H490" stroke="${C.ink}" stroke-width="2.5"/>`
      + [[408, 36], [430, 24], [452, 14], [474, 8]].map(([x, h]) => `<rect x="${x}" y="${236 - h}" width="14" height="${h}" fill="${C.orange}"/>`).join('');
    body += `<g class="b3"><g class="p2">${pillar(348)}${graph}${tile(446, 284, '연구소 그래프', { size: 18, h: 40, fill: 'white', stroke: C.blue })}</g></g>`;
    css += growCss(id, '.p1', 2, { axis: 'Y', origin: 'center bottom', delay: 0.2, dur: 0.7 }) + growCss(id, '.p2', 3, { axis: 'Y', origin: 'center bottom', delay: 0.2, dur: 0.8 });
    // 의견 판
    body += `<g class="bd">` + at(1, 'drop', `<rect x="70" y="132" width="500" height="44" rx="10" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(320, 162, '통컵 하나를 오래 쓰자', { size: 22, color: C.green }), 0.2) + '</g>';
    body += at(1, 'pop', tag(108, 106, '의견', ROLE.p, 19), 0.6);
    css += `@keyframes ${id}-sway { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
      .sc-${id} .bd { transform-box: view-box; transform-origin: 320px 154px; transition: transform .7s ease-in-out; }
      .on1 .sc-${id} .bd { animation: ${id}-sway 1.1s ease-in-out .7s 2; }
      .on2 .sc-${id} .bd { animation: none; transform-origin: 292px 176px; transform: rotate(5deg); transition-delay: .9s; }
      .on3 .sc-${id} .bd { transform: none; transition-delay: .3s; }`;
    body += at(3, 'pop', check(600, 154, 12), 1.2);
    body += glowRect(88, 170, 464, 150, 4, C.blue, 0.2, 12) + at(4, 'pop', tag(320, 342, '뒷받침', ROLE.s, 22), 0.6);
    put(K + '2/뒷받침', svg(id, body, css));
  })();

  // ── 2단원: 가상 현실·증강 현실에 함께 쓰는 방 ──────────────────────────────
  const floor = `<rect x="0" y="282" width="640" height="78" fill="${TAN}"/><path d="M0 282 H640" stroke="${C.line}" stroke-width="3"/>`;
  const windowAt = (x, y, w = 140, h = 110) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.sky}" stroke="${C.ink}" stroke-width="3"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="${C.ink}" stroke-width="3"/>`;
  const desk = (x, w) => `<rect x="${x}" y="226" width="${w}" height="12" rx="3" fill="${C.orange}"/><path d="M${x + 14} 238 V282 M${x + w - 14} 238 V282" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`
    + `<rect x="${x + 30}" y="204" width="40" height="22" rx="3" fill="${C.blue}"/><rect x="${x + 76}" y="196" width="28" height="30" rx="3" fill="${C.green}"/>`;
  const picture = (x, y) => `<rect x="${x}" y="${y}" width="70" height="56" rx="3" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M${x + 8} ${y + 48} L${x + 28} ${y + 22} L${x + 42} ${y + 38} L${x + 52} ${y + 28} L${x + 63} ${y + 48} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`;

  // ── 2단원: 가상 현실(안경을 쓰면 눈앞이 온통 컴퓨터가 만든 새 화면 — 동물 없는 동물원) ──────────────────────────────
  (function () {
    const id = 't41-k2-gasang';
    let css = base(id);
    let body = at(1, 'fin', floor + windowAt(380, 56) + picture(270, 80) + desk(400, 200));
    body += at(1, 'pop', person(130, 262, C.green, 28), 0.3) + at(1, 'pop', tag(130, 340, '진짜 방', ROLE.y, 19), 0.6);
    // 칸 2: 안경이 내려와 눈을 덮는다
    body += at(2, 'drop', `<path d="M104 212 Q130 182 156 212" stroke="${C.purple}" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="96" y="206" width="68" height="26" rx="10" fill="${C.purple}"/><rect x="104" y="212" width="22" height="13" rx="5" fill="${C.lilac}"/><rect x="134" y="212" width="22" height="13" rx="5" fill="${C.lilac}"/>`, 0.1);
    body += `<g class="b2">` + g('fin fin2', `<path d="M166 214 L216 60 M166 224 L216 300" stroke="${C.purple}" stroke-width="3" stroke-dasharray="8 7" fill="none"/>`, 0.9) + '</g>';
    // 안경 속 화면: 초원·나무·기린·코끼리
    const clip = `<clipPath id="${id}-lv"><rect x="232" y="38" width="376" height="258" rx="30"/></clipPath>`;
    const giraffe = `<g class="gr"><path d="M372 232 V272 M384 234 V272 M402 234 V272 M414 232 V272" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`
      + `<path d="M404 214 L418 214 L444 146 L430 140 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `<ellipse cx="393" cy="222" rx="34" ry="18" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`
      + `<ellipse cx="444" cy="138" rx="16" ry="10" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><circle cx="448" cy="135" r="2.5" fill="${C.ink}"/>`
      + [[380, 216], [398, 228], [408, 214], [428, 172]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${C.orange}"/>`).join('') + '</g>';
    const elephant = `<g class="el"><rect x="490" y="250" width="14" height="28" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><rect x="532" y="250" width="14" height="28" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<ellipse cx="520" cy="238" rx="46" ry="28" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`
      + `<g class="tr"><path d="M578 232 Q594 250 588 274" stroke="${C.muted}" stroke-width="9" fill="none" stroke-linecap="round"/></g>`
      + `<circle cx="566" cy="222" r="22" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><ellipse cx="554" cy="226" rx="12" ry="17" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><circle cx="574" cy="216" r="2.5" fill="${C.ink}"/></g>`;
    const scene = `<rect x="232" y="38" width="376" height="258" fill="${C.sky}"/><rect x="232" y="200" width="376" height="96" fill="${C.mint}"/>`
      + `<circle cx="566" cy="82" r="22" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`
      + `<rect x="292" y="168" width="12" height="44" fill="${C.orange}"/><ellipse cx="298" cy="156" rx="40" ry="26" fill="${C.green}"/>` + giraffe + elephant;
    body += `<g class="b2"><g class="lens">${clip}<path fill-rule="evenodd" d="${rr(216, 22, 408, 290, 40)} ${rr(232, 38, 376, 258, 30)}" fill="${C.purple}"/><g clip-path="url(#${id}-lv)">${scene}</g>` + '</g></g>';
    css += `.sc-${id} .lens { transform-box: view-box; transform-origin: 130px 218px; transform: scale(.05); opacity: 0; transition: transform 1s ease-out .9s, opacity .3s ease .9s; }
      .on2 .sc-${id} .lens { transform: none; opacity: 1; }
      @keyframes ${id}-walk { 0%, 100% { transform: none; } 50% { transform: translateX(-26px); } }
      @keyframes ${id}-swing { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(18deg); } }
      .on3 .sc-${id} .gr { animation: ${id}-walk 1.6s ease-in-out .2s 2; }
      .sc-${id} .tr { transform-box: view-box; transform-origin: 578px 232px; }
      .on3 .sc-${id} .tr { animation: ${id}-swing .8s ease-in-out .3s 3; }`;
    body += at(3, 'pop', tag(420, 70, '꾸민 세상', ROLE.x, 20), 0.4);
    body += glowRect(210, 16, 420, 302, 4, C.purple, 0.2, 44) + at(4, 'pop', tag(110, 60, '가상 현실', ROLE.x, 22), 0.6);
    put(K + '2/가상 현실', svg(id, body, css));
  })();

  // ── 2단원: 증강 현실(휴대 전화로 비춘 진짜 방 위에 고래 그림이 덧입혀진다 — 화면 밖 진짜 방에는 고래가 없다) ──────────────────────────────
  (function () {
    const id = 't41-k2-jeunggang';
    let css = base(id);
    const room = floor + windowAt(350, 70, 120, 100) + picture(110, 80) + desk(390, 220);
    let body = at(1, 'fin', room) + at(1, 'pop', tag(150, 40, '진짜 방', ROLE.y, 19), 0.4);
    // 휴대 전화: 화면 속에는 같은 방이 그대로 비친다
    const clip = `<clipPath id="${id}-sc"><rect x="312" y="40" width="196" height="284" rx="14"/></clipPath>`;
    body += `<g class="b2"><g class="scr">${clip}<g clip-path="url(#${id}-sc)"><rect x="300" y="20" width="220" height="324" fill="${C.paper}"/>${room}<rect x="300" y="20" width="220" height="324" fill="${C.sky}" opacity=".22"/>`
      + `<g class="b3"><g class="wh"><g class="whp">`
      + `<path d="M372 212 Q366 232 352 238 Q370 236 386 216 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M318 198 Q326 178 384 174 Q440 172 474 192 L498 178 Q496 194 488 197 Q496 202 500 214 L474 202 Q444 218 384 218 Q332 218 318 198 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M320 202 Q336 208 356 206" stroke="${C.muted}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="340" cy="194" r="3.5" fill="${C.ink}"/><path d="M356 174 V150 M356 172 Q348 156 338 152 M356 172 Q364 156 374 152" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
      + [[376, 184], [400, 190], [424, 182], [448, 192]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="white" stroke="${C.muted}" stroke-width="2"/>`).join('')
      + `</g></g></g></g></g>`
      + `<g class="ph"><path fill-rule="evenodd" d="${rr(300, 20, 220, 324, 22)} ${rr(312, 40, 196, 284, 14)}" fill="${C.ink}"/><rect x="390" y="28" width="40" height="5" rx="2.5" fill="${C.muted}"/></g></g>`;
    css += `.sc-${id} .scr { opacity: 0; transition: opacity .6s ease .7s; } .on2 .sc-${id} .scr { opacity: 1; }
      .sc-${id} .ph { transform: translateY(60px); opacity: 0; transition: transform .8s ease-out .1s, opacity .5s ease .1s; } .on2 .sc-${id} .ph { transform: none; opacity: 1; }
      .sc-${id} .whp { transform-box: fill-box; transform-origin: center; transform: scale(.2); opacity: 0; transition: transform .6s cubic-bezier(.4,1.6,.6,1) .3s, opacity .3s ease .3s; }
      .on3 .sc-${id} .whp { transform: none; opacity: 1; }
      @keyframes ${id}-bob { 0%, 100% { transform: none; } 50% { transform: translateY(-12px); } }
      .on3 .sc-${id} .wh { animation: ${id}-bob 1.2s ease-in-out 1s 3; }`;
    body += at(3, 'pop', tag(410, 296, '덧입힌 그림', ROLE.x, 19), 0.8);
    body += glowRect(294, 14, 232, 336, 4, C.purple, 0.2, 26) + at(4, 'pop', tag(150, 326, '증강 현실', ROLE.x, 22), 0.6);
    put(K + '2/증강 현실', svg(id, body, css));
  })();

  // ── 2단원: 입체적(종이 위 납작한 네모·동그라미에 옆면·윗면·그늘이 생겨 상자와 공이 된다) ──────────────────────────────
  (function () {
    const id = 't41-k2-ipche';
    let css = base(id);
    let body = `<defs><radialGradient id="${id}-rg" cx=".36" cy=".34" r=".72"><stop offset="0" stop-color="white" stop-opacity=".95"/><stop offset=".45" stop-color="${C.peach}" stop-opacity=".2"/><stop offset="1" stop-color="${C.orange}" stop-opacity=".75"/></radialGradient></defs>`;
    body += at(1, 'fin', `<rect x="56" y="70" width="528" height="246" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    // 그림자(칸 2에 생기고 칸 3에 넓어진다)
    body += `<g class="b2"><g class="sd1">${g('fin fin2', `<ellipse cx="214" cy="286" rx="86" ry="9" fill="${C.line}"/>`, 0.8)}</g><g class="sd2">${g('fin fin2', `<ellipse cx="450" cy="290" rx="54" ry="9" fill="${C.line}"/>`, 0.8)}</g></g>`;
    let cube = `<g class="b2"><g class="tp"><path d="M130 150 L250 150 L290 110 L170 110 Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/></g>`
      + `<g class="sdf"><path d="M250 150 L290 110 L290 230 L250 270 Z" fill="${C.blue}" fill-opacity=".35" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/></g></g>`;
    cube += at(1, 'pop', `<rect x="130" y="150" width="120" height="120" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`, 0.3);
    let ball = at(1, 'pop', `<circle cx="450" cy="210" r="62" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`, 0.5)
      + `<g class="b2">${g('fin fin2', `<circle cx="450" cy="210" r="60.5" fill="url(#${id}-rg)"/>`, 0.6)}</g>`;
    const depth = `<g class="b3">${g('fin fin3', `<path d="M262 282 L302 242" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>` + head(302, 242, -Math.PI / 4, C.green, 4) + head(262, 282, Math.PI * 3 / 4, C.green, 4), 0.9)}</g>` + at(3, 'pop', tag(344, 270, '깊이', ROLE.p, 20), 1.1);
    body += `<g class="lf1">${cube}${depth}</g><g class="lf2">${ball}</g>`;
    css += growCss(id, '.tp', 2, { axis: 'Y', origin: 'center bottom', delay: 0.2 }) + growCss(id, '.sdf', 2, { axis: 'X', origin: 'left center', delay: 0.2 });
    css += `.sc-${id} .lf1, .sc-${id} .lf2 { transition: transform .8s ease-out .3s; }
      .on3 .sc-${id} .lf1, .on3 .sc-${id} .lf2 { transform: translateY(-16px); }
      .sc-${id} .sd1, .sc-${id} .sd2 { transform-box: fill-box; transform-origin: center; transition: transform .8s ease-out .3s; }
      .on3 .sc-${id} .sd1, .on3 .sc-${id} .sd2 { transform: scale(.82); }`;
    body += `<g class="h2">` + at(1, 'pop', tag(320, 40, '납작함', ROLE.y, 20), 0.8) + '</g>';
    body += glowRect(110, 86, 420, 224, 4, C.green, 0.2, 14) + at(4, 'pop', tag(320, 40, '입체적', ROLE.p, 24), 0.6);
    put(K + '2/입체적', svg(id, body, css));
  })();

  // ── 2단원: 온실가스(컵을 만들고 버리는 공장에서 나온 기체가 지구를 이불처럼 덮어 열이 빠져나가지 못한다) ──────────────────────────────
  (function () {
    const id = 't41-k2-onsil';
    let css = base(id);
    const cx = 440, cy = 196;
    const P = (r, deg) => [f(cx + r * Math.cos(deg * Math.PI / 180)), f(cy + r * Math.sin(deg * Math.PI / 180))];
    let body = `<defs><clipPath id="${id}-ec"><circle cx="${cx}" cy="${cy}" r="80"/></clipPath></defs>`;
    // 지구(대륙 없이 원과 가로줄)
    body += at(1, 'pop', `<circle cx="${cx}" cy="${cy}" r="80" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><g clip-path="url(#${id}-ec)"><path d="M350 156 H530 M350 196 H530 M350 236 H530" stroke="${C.blue}" stroke-width="2" opacity=".5"/>`
      + `<g class="hot"><circle cx="${cx}" cy="${cy}" r="80" fill="${C.peach}"/></g></g><circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="${C.blue}" stroke-width="3"/>`, 0.1);
    // 해
    body += at(1, 'pop', `<g class="sun"><circle cx="64" cy="60" r="26" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`
      + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(64 + 33 * c)} ${f(60 + 33 * s)} L${f(64 + 42 * c)} ${f(60 + 42 * s)}" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`; }).join('') + '</g>', 0.3);
    // 컵 공장
    const cup = (x, y) => `<path d="M${x - 11} ${y - 14} H${x + 11} L${x + 8} ${y + 14} H${x - 8} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/>`;
    body += at(1, 'rise', `<rect x="140" y="214" width="22" height="58" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M30 344 V266 L70 244 V266 L110 244 V266 L150 244 V272 H182 V344 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`
      + cup(66, 306) + cup(102, 306) + cup(138, 306), 0.4);
    body += `<g class="b1">` + [0, 1, 2, 3].map((i) => `<g class="pf pf${i}"><circle cx="151" cy="200" r="${12 + (i % 2) * 4}" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/></g>`).join('') + '</g>';
    css += `@keyframes ${id}-puff { 0% { transform: translate(0, 0) scale(.5); opacity: 0; } 15% { opacity: .95; } 100% { transform: translate(150px, -36px) scale(1.5); opacity: 0; } }
      .sc-${id} .pf { transform-box: fill-box; transform-origin: center; opacity: 0; }
      ${[0, 1, 2, 3].map((i) => `.on1 .sc-${id} .pf${i} { animation: ${id}-puff 2s linear ${(0.6 + i * 0.5).toFixed(1)}s infinite; }`).join('\n')}`;
    // 칸 2: 이불처럼 덮는 띠가 둘러진다
    body += `<g class="b2"><path class="draw draw2 band" pathLength="1" d="M${cx} ${cy - 128} A128 128 0 1 1 ${cx} ${cy + 128} A128 128 0 1 1 ${cx} ${cy - 128}" stroke="${C.muted}" stroke-opacity=".45" stroke-width="18" fill="none"/></g>`;
    css += `.sc-${id} .band { transition-duration: 1.4s; transition-delay: .2s; }`;
    // 칸 3: 햇볕이 들어오고, 나가려던 열이 띠에 막혀 되돌아온다. 온도계가 오른다
    body += drawArrow(98, 86, 362, 166, C.orange, 3, { width: 5, delay: 0.1 });
    [-40, -100, 32].forEach((a, i) => {
      const p0 = P(84, a), p1 = P(118, a + 9), p2 = P(86, a + 20);
      const ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
      body += drawLine(`M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]}`, C.red, 3, { width: 4.5, delay: 0.7 + i * 0.25 })
        + `<g class="b3">${g('fin fin3', head(p2[0], p2[1], ang, C.red, 4.5), 1.6 + i * 0.25)}</g>`;
    });
    css += `.sc-${id} .hot { opacity: 0; transition: opacity 1s ease 1.4s; } .on3 .sc-${id} .hot { opacity: .6; }`;
    body += at(1, 'fin', `<defs><clipPath id="${id}-tc"><rect x="597" y="110" width="10" height="170"/></clipPath></defs><rect x="592" y="104" width="20" height="170" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<g clip-path="url(#${id}-tc)"><rect class="tm" x="597" y="110" width="10" height="170" fill="${C.red}"/></g><circle cx="602" cy="286" r="15" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/><rect x="597" y="262" width="10" height="16" fill="${C.red}"/>`, 0.5);
    css += `.sc-${id} .tm { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(.3); transition: transform 1.2s ease-in-out 1.2s; }
      .on3 .sc-${id} .tm { transform: scaleY(.92); }`;
    // 칸 4
    css += `.on4 .sc-${id} .band { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    body += at(4, 'pop', tag(250, 318, '온실가스', ROLE.x, 22), 0.5) + `<g class="b4">${g('fin fin4', `<path d="M310 314 L346 290" stroke="${C.purple}" stroke-width="3" stroke-linecap="round"/>`, 0.8)}</g>`;
    put(K + '2/온실가스', svg(id, body, css));
  })();

  // ── 3단원: 포함(큰 묶음 '한식' 상자 안에 비빔밥·불고기·김치가 들어간다 — 피자는 못 들어간다) ──────────────────────────────
  (function () {
    const id = 't41-k2-poham';
    let css = base(id);
    let body = '';
    body += `<g class="b2"><g class="bx">${`<rect x="96" y="116" width="448" height="206" rx="26" fill="${C.mint}" fill-opacity=".55" stroke="${C.green}" stroke-width="4"/>`}${tag(320, 148, '한식', ROLE.p, 24)}</g></g>`;
    css += `.sc-${id} .bx { transform-box: fill-box; transform-origin: center; transform: scale(.4); opacity: 0; transition: transform .6s cubic-bezier(.4,1.5,.6,1) .1s, opacity .3s ease .1s; }
      .on2 .sc-${id} .bx { transform: none; opacity: 1; }`;
    const items = [['비빔밥', 150, 62, -6, 194, 216], ['불고기', 320, 54, 4, 320, 216], ['김치', 494, 66, -4, 446, 216]];
    items.forEach(([l, sx, sy, r, ex, ey], i) => {
      body += at(1, 'pop', `<g class="it it${i}">${tile(ex, ey, l, { size: 24, h: 52, fill: 'white', stroke: C.line })}</g>`, i * 0.25);
      css += fly(id, `.it${i}`, [sx - ex, sy - ey, r], 2, { delay: 0.6 + i * 0.25, dur: 0.9 }) + paint(id, `.it${i}`, ROLE.p, 2, 1.5 + i * 0.25);
    });
    // 칸 3: 떡국은 들어가고, 피자는 상자 벽에 막혀 튕겨 난다
    body += `<g class="b3"><g class="tk">${tile(320, 278, '떡국', { size: 24, h: 52, fill: C.mint, stroke: C.green })}</g></g>`;
    css += `.sc-${id} .tk { transform: translateX(-400px); transition: transform 1s ease-out .2s; } .on3 .sc-${id} .tk { transform: none; }`;
    body += `<g class="b3"><g class="pz">${tile(592, 278, '피자', { size: 24, h: 52, fill: C.peach, stroke: C.orange })}</g></g>`;
    css += `@keyframes ${id}-bump { 0% { transform: translateX(120px); } 45% { transform: translateX(-22px); } 65% { transform: translateX(10px); } 82% { transform: translateX(-5px); } 100% { transform: none; } }
      .sc-${id} .pz { transform: translateX(120px); } .on3 .sc-${id} .pz { animation: ${id}-bump 1s ease-out 1.1s both; }`;
    body += at(3, 'pop', cross(592, 236, 10), 2.0);
    css += [0, 1, 2].map((i) => pulseCss(id, `.it${i} .tl`, 4, 0.8 + i * 0.2)).join('');
    body += glowRect(90, 110, 460, 218, 4, C.green, 0.2, 30) + at(4, 'pop', tag(320, 60, '포함', ROLE.p, 26), 0.5);
    put(K + '3/포함', svg(id, body, css));
  })();

  // ── 3단원: 원리(지우개로 문지르면 연필 글씨만 지워진다 — 연필 가루는 종이 겉에, 볼펜 잉크는 종이 속에) ──────────────────────────────
  (function () {
    const id = 't41-k2-wonri';
    let css = base(id);
    const wave = (x0) => `M${x0} 72 q25 -22 50 0 t50 0 t50 0 t50 0`;
    let body = at(1, 'fin', `<rect x="24" y="24" width="596" height="98" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(1, 'fin', `<g class="pc"><path d="${wave(80)}" stroke="${C.ink}" stroke-opacity=".75" stroke-width="7" fill="none" stroke-linecap="round"/></g>`
      + `<g class="pn"><path d="${wave(360)}" stroke="${C.blue}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`
      + text(180, 112, '연필', { size: 18, color: C.muted }) + text(460, 112, '볼펜', { size: 18, color: C.muted }), 0.2);
    const eraser = (x, y) => `<rect x="${x}" y="${y}" width="56" height="32" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><rect x="${x}" y="${y}" width="18" height="32" rx="4" fill="${C.blue}"/>`;
    body += at(1, 'fin', `<g class="er">${eraser(28, 56)}</g>`, 0.3);
    css += `@keyframes ${id}-rub { 0% { transform: none; } 100% { transform: translateX(530px); } }
      .on1 .sc-${id} .er { animation: ${id}-rub 1.8s ease-in-out .5s both; }
      .sc-${id} .pc { transition: opacity .8s ease .9s; } .on1 .sc-${id} .pc { opacity: .08; }
      .on1 .sc-${id} .pn { animation: ${id}-pulse .5s ease-in-out 2.1s 1; transform-box: fill-box; transform-origin: center; }`;
    // 종이를 잘라 옆에서 본 모습(아래 두 칸)
    const section = (x) => `<rect x="${x}" y="214" width="260" height="90" rx="4" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + [234, 254, 274, 292].map((y, k) => `<path d="M${x + 6} ${y} q${32} ${k % 2 ? -7 : 7} 64 0 t64 0 t64 0 t60 0" stroke="${C.line}" stroke-width="3" fill="none"/>`).join('');
    body += `<g class="b2">${g('fin fin2', `<path d="M150 124 L46 212 M210 124 L294 212" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`)}</g>`;
    body += at(2, 'rise', section(40), 0.2) + at(2, 'pop', tag(170, 168, '겉', ROLE.y, 20), 1.6);
    const dots = [60, 82, 104, 126, 148, 170, 192, 214, 236, 258, 280];
    body += `<g class="b2">` + dots.map((x, i) => `<g class="gd gd${i}">${g('pop pop2', `<circle cx="${x}" cy="${i % 2 ? 208 : 207}" r="${i % 3 ? 6 : 7}" fill="${C.ink}"/>`, 0.7 + i * 0.07)}</g>`).join('') + '</g>';
    body += `<g class="b3">${g('fin fin3', `<path d="M430 124 L346 212 M490 124 L594 212" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`)}</g>`;
    body += at(3, 'rise', section(340), 0.2) + at(3, 'pop', tag(470, 168, '속', ROLE.s, 20), 1.8);
    const ink = [];
    [[222, [380, 425, 470, 515, 560]], [242, [402, 448, 494, 540]], [261, [424, 470, 516]], [280, [446, 494]], [297, [470]]].forEach(([y, xs], k) => xs.forEach((x) => ink.push([x, y, k])));
    body += `<g class="b3">` + ink.map(([x, y, k], i) => g('pop pop3', `<ellipse cx="${x}" cy="${y}" rx="${16 - k}" ry="${7 - k * 0.6}" fill="${C.blue}" opacity=".7"/>`, 0.6 + k * 0.25 + (i % 2) * 0.05)).join('') + '</g>';
    // 칸 4: 작은 지우개가 두 단면을 문지른다 — 겉의 가루만 떨어져 나간다
    body += `<g class="b4"><g class="e1">${eraser(70, 178)}</g><g class="e2">${eraser(380, 178)}</g></g>`;
    css += `@keyframes ${id}-scrub { 0%, 100% { transform: none; } 25% { transform: translateX(70px); } 50% { transform: translateX(150px); } 75% { transform: translateX(70px); } }
      .on4 .sc-${id} .e1 { animation: ${id}-scrub 1.2s ease-in-out .2s 1; }
      .on4 .sc-${id} .e2 { animation: ${id}-scrub 1.2s ease-in-out .2s 1; }
      .sc-${id} .gd { transition: transform .6s ease-out, opacity .6s ease; }
      ${dots.map((x, i) => `.on4 .sc-${id} .gd${i} { transform: translate(${(i % 3) * 6 - 6}px, -40px); opacity: 0; transition-delay: ${(0.4 + i * 0.07).toFixed(2)}s; }`).join('\n')}`;
    body += at(4, 'pop', check(560, 196, 10), 1.6);
    body += at(4, 'pop', tag(320, 338, '원리', ROLE.p, 22), 0.8);
    put(K + '3/원리', svg(id, body, css));
  })();

  // ── 3단원: 액체(둥근 병의 물을 네모 통에 옮기면 네모, 바닥에 쏟으면 넓게 퍼진다) ──────────────────────────────
  (function () {
    const id = 't41-k2-aekche';
    let css = base(id);
    let body = `<defs><clipPath id="${id}-fk"><circle cx="110" cy="228" r="57"/></clipPath></defs>`;
    // 둥근 병
    body += at(1, 'fin', `<g clip-path="url(#${id}-fk)"><g class="w1"><rect x="50" y="182" width="120" height="110" fill="${C.sky}"/><path d="M50 182 H170" stroke="${C.blue}" stroke-width="3"/></g></g>`
      + `<path d="M96 124 V169.7 A60 60 0 1 0 124 169.7 V124" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>` + text(110, 322, '둥근 병', { size: 18, color: C.muted }), 0.1);
    // 네모 통
    body += at(1, 'fin', `<g class="w2"><rect x="264" y="232" width="116" height="66" fill="${C.sky}"/><path d="M264 232 H380" stroke="${C.blue}" stroke-width="3"/></g>`
      + `<path d="M262 176 V300 H382 V176" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>` + text(322, 330, '네모 통', { size: 18, color: C.muted }), 0.3);
    // 바닥
    body += at(1, 'fin', `<path d="M438 318 H630" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>` + text(535, 350, '바닥', { size: 18, color: C.muted }), 0.5);
    body += `<g class="b3"><g class="w3"><ellipse cx="535" cy="312" rx="88" ry="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g></g>`;
    css += `.sc-${id} .w1, .sc-${id} .w2 { transform-box: fill-box; transform-origin: center bottom; transition: transform 1s ease-in-out .9s; }
      .sc-${id} .w2 { transform: scaleY(0); }
      .on2 .sc-${id} .w1 { transform: scaleY(0); }
      .on2 .sc-${id} .w2 { transform: none; }
      .on3 .sc-${id} .w2 { transform: scaleY(0); }
      .sc-${id} .w3 { transform-box: fill-box; transform-origin: center; transform: scaleX(0); transition: transform 1.1s ease-out 1s; }
      .on3 .sc-${id} .w3 { transform: none; }`;
    // 모양 테두리(칸마다 지금 물의 모양이 반짝인다)
    body += `<g class="h2">` + at(1, 'fin', `<circle class="flash flash1" cx="110" cy="236" r="62" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6" style="animation-delay:.8s"/>`, 0.6) + '</g>';
    body += curve(124, 118, 296, 170, 64, C.blue, 2, { width: 4.5, delay: 0.2 });
    body += `<g class="b2 h3"><rect class="flash flash2" x="256" y="224" width="132" height="82" rx="6" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6" style="animation-delay:1.7s"/></g>`;
    body += curve(386, 172, 520, 296, 128, C.blue, 3, { width: 4.5, delay: 0.2 });
    body += `<g class="b3"><ellipse class="flash flash3 pd" cx="535" cy="312" rx="98" ry="14" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6" style="animation-delay:1.9s"/></g>`;
    // 칸 4: 퍼진 물이 출렁이고 이름이 뜬다
    css += `@keyframes ${id}-wob { 0%, 100% { transform: none; } 50% { transform: scaleX(1.08) scaleY(.8); } }
      .on4 .sc-${id} .w3 { animation: ${id}-wob .8s ease-in-out .2s 2; }
      .on4 .sc-${id} .pd { animation: ${id}-flash 1.4s ease-in-out .3s both; }`;
    body += at(4, 'pop', tag(320, 60, '액체', ROLE.s, 26), 0.5);
    put(K + '3/액체', svg(id, body, css));
  })();

  // ── 3단원: 스며들다(볼펜 잉크가 종이 섬유 틈으로 조금씩 퍼져 속까지 들어간다) ──────────────────────────────
  (function () {
    const id = 't41-k2-seumyeo';
    let css = base(id);
    const mx = 470, my = 200, R = 136;
    let body = `<defs><clipPath id="${id}-mc"><circle cx="${mx}" cy="${my}" r="${R - 3}"/></clipPath></defs>`;
    body += at(1, 'fin', `<rect x="30" y="130" width="240" height="170" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    // 종이 위 잉크 자국(칸 1에 생기고 칸 3에 넓어진다)
    body += `<g class="b1"><g class="sp">${g('pop pop1', `<circle cx="150" cy="200" r="13" fill="${C.blue}" opacity=".85"/>`, 0.9)}</g></g>`;
    css += `.sc-${id} .sp { transform-box: fill-box; transform-origin: center; transition: transform 1.4s ease-out .8s; } .on3 .sc-${id} .sp { transform: scale(1.7); }`;
    // 볼펜
    body += at(1, 'fin', `<g class="pen"><g transform="translate(150 196) rotate(30)"><path d="M0 0 L-8 -24 H8 Z" fill="${C.blue}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<rect x="-10" y="-112" width="20" height="88" rx="4" fill="${C.sky}" stroke="${C.ink}" stroke-width="2.5"/><rect x="-10" y="-112" width="20" height="22" rx="4" fill="${C.blue}"/></g></g>`, 0.1);
    css += `.sc-${id} .pen { transform: translate(14px, -40px); transition: transform .7s ease-in .3s; } .on1 .sc-${id} .pen { transform: none; }
      .on2 .sc-${id} .pen { transform: translate(14px, -40px); transition-delay: .1s; }`;
    // 돋보기 둘레와 이음줄
    body += `<g class="b2">${g('fin fin2', `<circle cx="150" cy="200" r="24" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M162 179 L${mx - 30} ${my - R + 4} M162 221 L${mx - 30} ${my + R - 4}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.1)}</g>`;
    // 크게 본 종이: 위쪽은 공기, 아래쪽은 얽힌 섬유
    let inside = `<rect x="${mx - R}" y="${my - R}" width="${2 * R}" height="${2 * R}" fill="${C.paper}"/><rect x="${mx - R}" y="104" width="${2 * R}" height="${my + R - 104}" fill="white"/>`;
    for (let k = 0; k < 9; k++) {
      const y = 118 + k * 24, ph = k % 2 ? -1 : 1;
      inside += `<path d="M${mx - R} ${y} q34 ${8 * ph} 68 0 t68 0 t68 0 t68 0" stroke="${C.line}" stroke-width="5" fill="none"/>`;
    }
    inside += `<path d="M${mx - R} 104 H${mx + R}" stroke="${C.muted}" stroke-width="3"/>`;
    // 잉크 방울: 층(k)이 깊을수록 늦게, 넓게
    const blobs = [];
    for (let k = 0; k < 8; k++) {
      const y = 108 + k * 24 + 10, n = k + 2;
      for (let j = 0; j < n; j++) {
        const x = mx + (j - (n - 1) / 2) * 30 + (k % 2 ? 8 : -6) + (((k * 7 + j * 11) % 13) - 6);
        if (Math.hypot(x - mx, y - my) < R - 18) blobs.push([f(x), y + (((k * 5 + j * 3) % 5) - 2), k]);
      }
    }
    inside += blobs.map(([x, y, k], i) => `<g class="b${k < 3 ? 2 : 3}">${g(`pop pop${k < 3 ? 2 : 3}`, `<ellipse cx="${x}" cy="${y}" rx="13" ry="7" fill="${C.blue}" opacity=".72"/>`, (k < 3 ? 0.9 + k * 0.4 : 0.2 + (k - 3) * 0.3) + (i % 3) * 0.06)}</g>`).join('');
    inside += `<g class="b2"><g class="dr"><path d="M${mx} 66 Q${mx + 12} 86 ${mx} 94 Q${mx - 12} 86 ${mx} 66 Z" fill="${C.blue}"/></g></g>`;
    css += `.sc-${id} .dr { transition: transform .7s ease-in .4s, opacity .4s ease .9s; } .on2 .sc-${id} .dr { transform: translateY(26px); opacity: 0; }`;
    body += `<g class="b2">${g('fin fin2', `<g clip-path="url(#${id}-mc)">${inside}</g><circle cx="${mx}" cy="${my}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="4"/>`, 0.3)}</g>`;
    body += at(2, 'pop', tag(596, 340, '섬유', ROLE.y, 19), 1.8);
    body += glowRect(mx - R - 6, my - R - 6, 2 * R + 12, 2 * R + 12, 4, C.blue, 0.2, R + 6) + at(4, 'pop', tag(150, 330, '스며들다', ROLE.s, 22), 0.6);
    put(K + '3/스며들다', svg(id, body, css));
  })();


  // ── 3단원: 보고하는 글(하은이의 「색깔이 변하는 사과」 — 제목, 처음·가운데·끝에 들어가는 내용) ──────────────────────────────
  (function () {
    const id = 't41-k2-bogo';
    let css = base(id);
    // 왼쪽: 한 시간마다 변하는 사과 조각
    const slice = (y, lvl) => `<path d="M64 ${y} A46 46 0 0 0 156 ${y} Z" fill="${TAN}" stroke="${C.red}" stroke-width="4" stroke-linejoin="round"/>`
      + (lvl === 1 ? [[88, y + 12], [128, y + 18]].map(([x, yy]) => `<circle cx="${x}" cy="${yy}" r="7" fill="${C.orange}" opacity=".55"/>`).join('') : '')
      + (lvl === 2 ? `<path d="M68 ${y + 2} A44 44 0 0 0 128 ${y + 40} L118 ${y + 2} Z" fill="${C.orange}" opacity=".5"/><circle cx="140" cy="${y + 12}" r="7" fill="${C.orange}" opacity=".5"/>` : '')
      + (lvl === 3 ? `<path d="M67 ${y + 2} A43 43 0 0 0 153 ${y + 2} Z" fill="${C.orange}" opacity=".72"/>` : '');
    let body = '';
    [[66, '1시간 뒤', 1], [168, '2시간 뒤', 2], [270, '3시간 뒤', 3]].forEach(([y, l, lvl], i) => {
      body += at(1, 'pop', `<g class="ap">${slice(y, lvl)}</g>` + text(110, y + 70, l, { size: 18, color: C.muted }), 0.2 + i * 0.5);
    });
    // 글 쪽
    const X = 200, W = 428, L = 300;
    body += at(2, 'fin', `<rect x="${X}" y="10" width="${W}" height="342" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(2, 'rise', tag(X + 40, 36, '제목', ROLE.y, 18) + text(X + 86, 44, '색깔이 변하는 사과', { size: 22, anchor: 'start' }) + `<path d="M${X + 16} 60 H${X + W - 16}" stroke="${C.line}" stroke-width="2"/>`, 0.2);
    const rowAt = (n, d, y, label, col) => { const w = wOf(label, 18) + 4; return at(n, 'slide', tag(L + w / 2, y, label, col, 18) + bar(L + w + 12, y, X + W - 16 - (L + w + 12), '#b5c4be', 8), d); };
    body += at(2, 'pop', `<g class="sx sx0">${tag(250, 124, '처음', ROLE.s, 18)}</g>`, 0.5);
    body += rowAt(2, 0.7, 86, '관찰 동기', ROLE.s) + rowAt(2, 1.0, 124, '관찰 대상과 기간', ROLE.s) + rowAt(2, 1.3, 162, '관찰 방법', ROLE.s);
    body += at(3, 'fin', `<path d="M${X + 14} 184 H${X + W - 14} M${X + 14} 272 H${X + W - 14}" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`);
    body += at(3, 'pop', `<g class="sx sx1">${tag(250, 226, '가운데', ROLE.p, 18)}</g>`, 0.2);
    body += rowAt(3, 0.4, 207, '관찰 내용과 결과', ROLE.p) + rowAt(3, 0.7, 245, '수집한 자료', ROLE.p);
    body += at(3, 'pop', `<g class="sx sx2">${tag(250, 306, '끝', ROLE.x, 18)}</g>`, 1.1) + rowAt(3, 1.3, 306, '느낀 점', ROLE.x);
    // 칸 3: 관찰한 사과 조각이 '관찰 내용과 결과' 와 함께 두근거린다
    css += `.sc-${id} .sx, .sc-${id} .ap { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .ap { animation: ${id}-pulse .6s ease-in-out .5s 2; }`
      + [0, 1, 2].map((i) => `.on4 .sc-${id} .sx${i} { animation: ${id}-pulse .6s ease-in-out ${(0.6 + i * 0.35).toFixed(2)}s 1; }`).join('');
    body += glowRect(X - 5, 5, W + 10, 352, 4, C.green, 0.1, 14) + at(4, 'pop', tag(104, 30, '보고하는 글', ROLE.p, 21), 0.4);
    put(K + '3/보고하는 글', svg(id, body, css));
  })();

  // ── 3단원: 체계적(뒤죽박죽 조각이 처음·가운데·끝 칸으로 들어가 차례대로 선다) ──────────────────────────────
  (function () {
    const id = 't41-k2-chegye';
    let css = base(id);
    const cols = [[20, '처음', ROLE.s], [226, '가운데', ROLE.p], [432, '끝', ROLE.x]];
    let body = '';
    cols.forEach(([x, l, col], i) => {
      body += at(2, 'rise', `<rect x="${x}" y="120" width="188" height="214" rx="14" fill="white" stroke="${col[1]}" stroke-width="3"/>` + tag(x + 94, 148, l, col, 20), i * 0.15);
    });
    const chips = [
      ['관찰 동기', 0, 0, [430, 280, 12]], ['대상과 기간', 0, 1, [180, 116, -10]], ['관찰 방법', 0, 2, [520, 150, 8]],
      ['관찰 결과', 1, 0, [300, 300, -6]], ['수집한 자료', 1, 1, [110, 250, 14]], ['느낀 점', 2, 0, [360, 190, -14]]
    ];
    chips.forEach(([l, c, r, [sx, sy, rot]], i) => {
      const ex = cols[c][0] + 108, ey = 196 + r * 50;
      body += at(1, 'pop', `<g class="ch ch${i}"><g class="jg">${tile(ex, ey, l, { size: 19, h: 40, fill: 'white', stroke: C.line })}</g></g>`, i * 0.12);
      css += fly(id, `.ch${i}`, [sx - ex, sy - ey, rot], 2, { delay: 0.5 + i * 0.15 }) + paint(id, `.ch${i}`, cols[c][2], 2, 1.4 + i * 0.15);
      body += at(3, 'pop', `<circle cx="${cols[c][0] + 20}" cy="${ey}" r="12" fill="${cols[c][2][1]}"/>` + text(cols[c][0] + 20, ey + 6.5, i + 1, { size: 18, color: 'white' }), 0.2 + i * 0.25);
    });
    css += `@keyframes ${id}-jig { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
      .sc-${id} .jg { transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .jg { animation: ${id}-jig .5s ease-in-out .9s 2; }
      .on2 .sc-${id} .jg { animation: none; }`;
    body += drawArrow(152, 148, 272, 148, C.muted, 3, { width: 4, delay: 1.2 }) + drawArrow(368, 148, 498, 148, C.muted, 3, { width: 4, delay: 1.5 });
    body += glowRect(14, 114, 612, 226, 4, C.green, 0.2, 18) + at(4, 'pop', tag(320, 70, '체계적', ROLE.p, 24), 0.5);
    put(K + '3/체계적', svg(id, body, css));
  })();

  // ── 3단원: 주관적·객관적·과장·축소에 함께 쓰는 봉숭아 싹(교과서 「봉숭아 기르기」) ──────────────────────────────
  const pot = `<path d="M76 280 H164 L154 338 H86 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><rect x="70" y="268" width="100" height="14" rx="4" fill="${C.orange}"/>`;
  const sprout = (x, b, { cls = '', ghost = false } = {}) => {
    const leaves = (a) => `<ellipse cx="${x - 16}" cy="${b - 64}" rx="18" ry="9" transform="rotate(25 ${x - 16} ${b - 64})"${a}/><ellipse cx="${x + 16}" cy="${b - 64}" rx="18" ry="9" transform="rotate(-25 ${x + 16} ${b - 64})"${a}/>`;
    if (ghost) return `<g class="${cls}" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="6 5"><path d="M${x} ${b} V${b - 60}"/>${leaves('')}</g>`;
    const ns = ' vector-effect="non-scaling-stroke"';
    return `<g class="${cls}"><path d="M${x} ${b} V${b - 60}" stroke="${C.green}" stroke-width="6" stroke-linecap="round"${ns}/>${leaves(` fill="${C.mint}" stroke="${C.green}" stroke-width="3"${ns}`)}</g>`;
  };
  const ruler = `<rect x="186" y="186" width="24" height="84" rx="3" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/>` + [268, 248, 228, 208, 188].map((y) => `<path d="M186 ${y} H198" stroke="${C.orange}" stroke-width="2.5"/>`).join('')
    + [258, 238, 218, 198].map((y) => `<path d="M186 ${y} H192" stroke="${C.orange}" stroke-width="2"/>`).join('');
  const bubble = (px, y, label, [fill, stroke]) => tile(px, y, label, { size: 19, h: 46, fill, stroke, rx: 16 })
    + `<path d="M${px - 9} ${y + 21} L${px} ${y + 42} L${px + 9} ${y + 21}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  const PX = [330, 460, 585], PC = [C.blue, C.green, C.purple];

  // ── 3단원: 주관적(같은 싹을 보고도 사람마다 느낌 말이 다르다) ──────────────────────────────
  (function () {
    const id = 't41-k2-jugwan';
    let css = base(id);
    let body = at(1, 'fin', pot + sprout(120, 268));
    body += PX.map((x, i) => at(1, 'pop', person(x, 322, PC[i], 18), 0.3 + i * 0.12)).join('');
    const words = [['정말 작다', ROLE.s], ['보통이다', ROLE.p], ['꽤 크다', ROLE.x]];
    body += words.map(([l, col], i) => `<g class="bb bb${i}">` + at(i ? 2 : 1, 'pop', bubble(PX[i], 208, l, col), i ? 0.3 + (i - 1) * 0.5 : 1.0) + '</g>').join('');
    css += `.sc-${id} .bb { transform-box: fill-box; transform-origin: center bottom; }
      .on2 .sc-${id} .bb { animation: ${id}-shake .45s ease-in-out 1.4s 2; }
      ${[0, 1, 2].map((i) => `.on3 .sc-${id} .bb${i} { animation: ${id}-pulse .55s ease-in-out ${(0.6 + i * 0.3).toFixed(1)}s 1; }`).join('\n')}`;
    body += at(3, 'pop', tag(460, 140, '사람마다 다름', ROLE.r, 20), 0.2);
    body += at(3, 'pop', `<g class="qm">${text(120, 160, '?', { size: 34, color: C.red })}</g>`, 1.4);
    body += glowRect(256, 178, 380, 66, 4, C.purple, 0.2, 18) + at(4, 'pop', tag(460, 80, '주관적', ROLE.x, 24), 0.6);
    put(K + '3/주관적', svg(id, body, css));
  })();

  // ── 3단원: 객관적(자로 재고 세어 보니 3 cm·잎 2개 — 누가 재도 똑같다) ──────────────────────────────
  (function () {
    const id = 't41-k2-gaekgwan';
    let css = base(id);
    const QX = [362, 482, 596];
    let body = at(1, 'fin', pot + sprout(120, 268));
    body += `<g class="b1"><g class="rl">${ruler}</g></g>` + at(1, 'fin', `<path d="M150 208 H184" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="5 5"/>`, 0.9);
    css += growCss(id, '.rl', 1, { axis: 'Y', origin: 'center bottom', delay: 0.3, dur: 0.7 });
    body += at(1, 'pop', `<g class="cm">${tag(252, 208, '3 cm', ROLE.p, 20)}</g>`, 1.1);
    // 칸 2: 잎을 센다
    body += at(2, 'pop', `<circle cx="76" cy="176" r="13" fill="${C.orange}"/>` + text(76, 182.5, 1, { size: 18, color: 'white' }), 0.3)
      + at(2, 'pop', `<circle cx="164" cy="176" r="13" fill="${C.orange}"/>` + text(164, 182.5, 2, { size: 18, color: 'white' }), 0.8)
      + at(2, 'pop', tag(254, 150, '잎 2개', ROLE.o, 20), 1.3);
    // 칸 3: 누가 재고 세어도 같다
    body += QX.map((x, i) => at(3, 'pop', person(x, 322, PC[i], 18), 0.1 + i * 0.15)).join('');
    body += QX.map((x, i) => `<g class="bb bb${i}">` + at(3, 'pop', bubble(x, 208, '3 cm', ROLE.p), 0.6 + i * 0.3) + '</g>').join('');
    body += at(3, 'fin', text(422, 217, '=', { size: 28, color: C.green }) + text(539, 217, '=', { size: 28, color: C.green }), 1.7);
    css += `.sc-${id} .bb, .sc-${id} .cm { transform-box: fill-box; transform-origin: center; }
      .on4 .sc-${id} .bb { animation: ${id}-pulse .6s ease-in-out .5s 1; }
      .on4 .sc-${id} .cm { animation: ${id}-pulse .6s ease-in-out .9s 1; }`;
    body += glowRect(316, 178, 318, 66, 4, C.green, 0.2, 18) + at(4, 'pop', tag(480, 80, '객관적', ROLE.p, 24), 0.6);
    put(K + '3/객관적', svg(id, body, css));
  })();

  // ── 3단원: 과장·축소(실제 3 cm 싹이 관찰 기록 속에서 부풀거나 줄어든다 — 같은 틀) ──────────────────────────────
  const sizeFrame = (id, mode) => {
    let css = base(id);
    const big = mode === 'big', sc = big ? 3 : 1 / 3;
    let body = at(1, 'fin', pot + sprout(120, 268) + ruler + `<path d="M150 208 H184" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="5 5"/>`);
    body += at(1, 'pop', `<g class="cm">${tag(252, 208, '3 cm', ROLE.p, 20)}</g>`, 0.5) + at(1, 'pop', tag(120, 40, '실제', ROLE.p, 20), 0.3);
    body += at(1, 'fin', `<rect x="320" y="24" width="300" height="320" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/><path d="M392 300 H548" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`, 0.6);
    body += `<g class="h4">` + at(1, 'pop', tag(470, 50, '관찰 기록', ROLE.y, 19), 0.8) + '</g>';
    body += `<g class="b3">${g('fin fin3', sprout(470, 300, { ghost: true }), 0.2)}</g>`;
    body += at(1, 'pop', sprout(470, 300, { cls: 'ps' }), 0.9);
    css += `.sc-${id} .ps { transform-box: fill-box; transform-origin: center bottom; transition: transform 1.2s cubic-bezier(.5,1.3,.6,1) .5s; }
      .on2 .sc-${id} .ps { transform: scale(${f(sc * 1000) / 1000}); }`;
    body += `<g class="h2">` + at(1, 'pop', tag(568, 322, '3 cm', ROLE.p, 19), 1.1) + '</g>';
    body += at(2, 'pop', `<g class="nc">${tag(568, 322, big ? '9 cm' : '1 cm', ROLE.r, 19)}</g>`, 1.4);
    // 칸 3: 실제 크기(점선)와 견준 화살표
    body += big
      ? drawArrow(600, 226, 600, 70, C.red, 3, { width: 4, delay: 0.6 })
      : drawArrow(600, 220, 600, 278, C.red, 3, { width: 4, delay: 0.6 });
    css += `.sc-${id} .cm, .sc-${id} .nc { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .cm { animation: ${id}-pulse .6s ease-in-out 1.4s 1; }
      .on3 .sc-${id} .nc { animation: ${id}-shake .45s ease-in-out 1.8s 2; }`;
    body += glowRect(326, 30, 288, 308, 4, C.red, 0.2, 10) + at(4, 'pop', tag(470, 50, big ? '과장' : '축소', ROLE.r, 24), 0.6);
    return svg(id, body, css);
  };
  put(K + '3/과장', sizeFrame('t41-k2-gwajang', 'big'));
  put(K + '3/축소', sizeFrame('t41-k2-chukso', 'small'));

  // ── 3단원: 분류(친구들의 보고하는 글을 관찰 주제가 비슷한 것끼리 상자에 나눈다) ──────────────────────────────
  (function () {
    const id = 't41-k2-bunryu';
    let css = base(id);
    const icon = (x, y, kind) => {
      if (kind === 0) return [0, 72, 144, 216, 288].map((a) => `<circle cx="${f(x + 7 * Math.cos(a * Math.PI / 180))}" cy="${f(y + 7 * Math.sin(a * Math.PI / 180))}" r="5.5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`).join('') + `<circle cx="${x}" cy="${y}" r="4.5" fill="${C.yellow}"/>`;
      if (kind === 1) return `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/><path d="M${x - 5} ${y - 4} L${x - 1} ${y - 7}" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`;
      return `<rect x="${x - 3.5}" y="${y - 14}" width="7" height="20" rx="3.5" fill="white" stroke="${C.ink}" stroke-width="2"/><circle cx="${x}" cy="${y + 8}" r="6" fill="${C.red}" stroke="${C.ink}" stroke-width="2"/><rect x="${x - 1.5}" y="${y - 6}" width="3" height="12" fill="${C.red}"/>`;
    };
    const card = (x, y, kind) => `<rect x="${x - 23}" y="${y - 28}" width="46" height="56" rx="5" fill="white" stroke="${C.ink}" stroke-width="2.5"/>` + icon(x, y - 8, kind)
      + bar(x - 14, y + 13, 28, '#b5c4be', 5) + bar(x - 14, y + 21, 20, '#b5c4be', 5);
    const boxes = [[40, '꽃', ROLE.o], [230, '얼음', ROLE.s], [420, '온도', ROLE.r]];
    let body = '';
    boxes.forEach(([x, l, col], i) => {
      body += at(2, 'rise', `<path d="M${x} 214 V338 H${x + 180} V214" fill="${col[0]}" fill-opacity=".45" stroke="${col[1]}" stroke-width="3.5" stroke-linejoin="round"/>` + tag(x + 90, 318, l, col, 20), 0.3 + i * 0.15);
    });
    body += at(2, 'fin', tag(48, 30, '기준', ROLE.p, 19) + text(92, 37, '관찰 주제', { size: 20, anchor: 'start' }), 0.1);
    // [모양, 처음 x, y, 기울기, 들어갈 x]
    const cards = [[0, 90, 96, -10, 70], [1, 190, 150, 8, 290], [0, 290, 92, 6, 130], [2, 380, 156, -8, 480], [1, 460, 90, -12, 350], [0, 540, 150, 10, 190], [2, 600, 90, 6, 540]];
    cards.forEach(([k, sx, sy, rot, ex], i) => {
      const ey = 256;
      body += at(1, 'pop', `<g class="cd cd${i}"><g class="jg"><g transform="translate(${ex} ${ey}) scale(1.22) translate(${-ex} ${-ey})">${card(ex, ey, k)}</g></g></g>`, i * 0.12);
      const box = k === 0 ? 0 : k === 1 ? 1 : 2;
      css += fly(id, `.cd${i}`, [sx - ex, sy - ey, rot], 3, { delay: 0.2 + box * 0.5 + (i % 2) * 0.12, dur: 0.9 });
    });
    css += `@keyframes ${id}-jig { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-6deg); } 75% { transform: rotate(6deg); } }
      .sc-${id} .jg { transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .jg { animation: ${id}-jig .5s ease-in-out 1s 2; }
      .on3 .sc-${id} .jg { animation: none; }`;
    body += boxes.map(([x, , col], i) => glowRect(x - 4, 208, 188, 136, 4, col[1], 0.2 + i * 0.2, 10)).join('');
    body += at(4, 'pop', tag(320, 120, '분류', ROLE.p, 26), 0.8);
    put(K + '3/분류', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
