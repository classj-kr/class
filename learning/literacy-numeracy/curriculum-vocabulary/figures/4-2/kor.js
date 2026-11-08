// 국어 4-2 낱말 도식(앞 반: 독서 단원 주제·중심 내용·간추리다, 2단원 문자·뜻글자·본뜨다·확장·줄임말·순우리말·보고서).
// 도구(tile·tag·row·curve·base·move 따위)는 figures/6-2/kor.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
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
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange] };
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
  const line = (x1, y1, x2, y2, color, n, { width = 4, delay = 0 } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
  const arrowR = (x1, x2, y, color = C.muted) => `<path d="M${x1} ${y} H${x2}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>${head(x2, y, 0, color, 5)}`;
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  // 왼쪽을 감싸는 묶음 괄호(세로)
  const brace = (x, y1, y2, color = C.green, w = 3.5) => {
    const m = (y1 + y2) / 2;
    return `<path d="M${x + 12} ${y1} Q${x} ${y1} ${x} ${y1 + 14} V${m - 12} Q${x} ${m} ${x - 12} ${m} Q${x} ${m} ${x} ${m + 12} V${y2 - 14} Q${x} ${y2} ${x + 12} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
  // 위를 덮는 묶음 괄호(가로)
  const braceTop = (x1, x2, y, color = C.green, w = 3.5) => {
    const m = (x1 + x2) / 2;
    return `<path d="M${x1} ${y + 12} Q${x1} ${y} ${x1 + 14} ${y} H${m - 12} Q${m} ${y} ${m} ${y - 12} Q${m} ${y} ${m + 12} ${y} H${x2 - 14} Q${x2} ${y} ${x2} ${y + 12}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
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
  // 칸 n 에서 속성 없는 <g class="cls"> 를 dx, dy 만큼 옮긴다(처음 자리는 CSS transform 으로 둔다)
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

  // ── 6-2 에서 옮겨 온 도구 ──────────────────────────────
  const K = '4-2/국어/';
  const TAN = '#fdf3d3';
  // 글자를 한 자씩 따로 놓은 조각(글자마다 색을 바꿀 때). 글자 폭은 1em 으로 본다.
  const charTile = (cx, cy, chars, o = {}) => {
    const { size = 30, h = 58, fill = 'white', stroke = C.line, cls = '', sw = 3 } = o;
    const w = o.w || Math.round(chars.length * size + size * 1.3);
    const x0 = cx - (chars.length * size) / 2 + size / 2;
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
      + chars.map((c, i) => text(f(x0 + i * size), f(cy + size * 0.36), c, { size, cls: `ch ch${i}` })).join('') + '</g>';
  };
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;
  // 소리 물결 세 겹(오른쪽으로 퍼짐)
  const waves = (x, y, color, cls = 'snd', k = 1) => [0, 1, 2].map((i) =>
    `<path class="${cls}" style="animation-delay:${i * 0.2}s" d="M${f(x + i * 11 * k)} ${f(y - (10 + i * 6) * k)} q${f((8 + i * 3) * k)} ${f((10 + i * 6) * k)} 0 ${f((20 + i * 12) * k)}" stroke="${color}" stroke-width="${3.5 * Math.min(k, 1.4)}" fill="none" stroke-linecap="round"/>`).join('');
  const eye = (x, y, color = C.blue) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`;
  const ear = (x, y, color = C.orange) => `<path d="M${x - 12} ${y + 4} C${x - 16} ${y - 26} ${x + 20} ${y - 30} ${x + 18} ${y - 2} C${x + 16} ${y + 12} ${x + 4} ${y + 12} ${x + 4} ${y + 22} C${x + 4} ${y + 30} ${x - 8} ${y + 30} ${x - 10} ${y + 22}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/><path d="M${x - 2} ${y + 2} C${x - 4} ${y - 12} ${x + 10} ${y - 14} ${x + 9} ${y - 2}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  const lens = (x, y, color = C.green) => `<circle cx="${x - 4}" cy="${y - 4}" r="15" fill="white" stroke="${color}" stroke-width="4"/><path d="M${x + 7} ${y + 7} L${x + 20} ${y + 20}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
  const bar = (x, y, w, color = '#a9bab3', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  const barCss = (id) => `.sc-${id} .gr { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .5s ease-out; }
    .on1 .sc-${id} .gr { transform: none; }`;
  const glowCss = (id, sel, n, delay = 0.2) => `.on${n} .sc-${id} ${sel} { animation: ${id}-flash 1.4s ease-in-out ${delay}s both; }`;
  const rowW = (r) => r[r.length - 1].r - r[0].l;


  // ── 독서 단원: 「작은 아이디어의 큰 힘」 네 문단 ──────────────────────────────
  // 문단 상자 네 개. 줄(막대)마다 문장 하나, 문단마다 중심 내용인 줄 하나(key).
  const PARA = { x: (i) => 26 + i * 152, w: 132, top: 46, ys: [72, 98, 124, 150, 176], key: [4, 3, 0, 0], labels: ['작은 아이디어', '피아노 계단', '쓰레기통', '좋은 세상'] };
  const pcx = (i) => PARA.x(i) + PARA.w / 2;
  const paraBoxes = (n = 1) => [0, 1, 2, 3].map((i) => {
    const x = PARA.x(i);
    const lines = PARA.ys.map((y, k) => {
      const w = k === 4 && PARA.key[i] !== 4 ? 70 : 104;
      return `<rect class="pl ${k === PARA.key[i] ? 'kb' : 'nb'}" x="${x + 14}" y="${y - 5}" width="${w}" height="10" rx="5" fill="#b5c4be"/>`;
    }).join('');
    return `<g class="pb${i}">` + at(n, 'rise', text(pcx(i), 34, `${i + 1}문단`, { size: 18, color: C.muted })
      + `<rect x="${x}" y="${PARA.top}" width="${PARA.w}" height="150" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + lines, i * 0.3) + '</g>';
  }).join('');

  (function () {
    const id = 't42-k1-jungsim';
    let css = base(id);
    let body = paraBoxes(1);
    // 칸 2: 문단마다 중심 내용인 줄이 주황으로
    css += `.sc-${id} .kb { transition: fill .5s ease; } .on2 .sc-${id} .kb { fill: ${C.orange}; }
      .sc-${id} .nb { transition: opacity .6s ease; } .on3 .sc-${id} .nb { opacity: .35; }`;
    css += [0, 1, 2, 3].map((i) => `.on2 .sc-${id} .pb${i} .kb { transition-delay: ${0.3 + i * 0.3}s; }`).join('\n');
    body += [0, 1, 2, 3].map((i) => `<g class="b2"><rect class="flash flash2" style="animation-delay:${0.3 + i * 0.3}s" x="${PARA.x(i) + 8}" y="${PARA.ys[PARA.key[i]] - 11}" width="116" height="22" rx="11" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`).join('');
    // 칸 3: 그 줄이 아래로 내려와 짧은 조각이 된다
    body += [0, 1, 2, 3].map((i) => {
      const ky = PARA.ys[PARA.key[i]];
      css += `.sc-${id} .fly${i} { transition: transform .8s ease-in-out ${0.2 + i * 0.25}s, opacity .3s ease ${0.95 + i * 0.25}s; }
        .on3 .sc-${id} .fly${i} { transform: translateY(${254 - ky}px); opacity: 0; }`;
      return `<g class="b3"><g class="fly${i}"><rect x="${PARA.x(i) + 14}" y="${ky - 5}" width="104" height="10" rx="5" fill="${C.orange}"/></g></g>`
        + at(3, 'pop', tile(pcx(i), 254, PARA.labels[i], { size: 18, h: 44, fill: TAN, stroke: C.orange }), 0.95 + i * 0.25);
    }).join('');
    body += [0, 1, 2, 3].map((i) => glowRect(pcx(i) - wOf(PARA.labels[i], 18) / 2 - 7, 225, wOf(PARA.labels[i], 18) + 14, 58, 4, C.orange, 0.1 + i * 0.15, 16)).join('');
    body += at(4, 'pop', tag(320, 324, '중심 내용', ROLE.y, 22), 0.6);
    put(K + 'reading/중심 내용', svg(id, body, css));
  })();

  (function () {
    const id = 't42-k1-juje';
    let css = base(id);
    let body = '';
    const Y = 76, TY = 254;
    const theme = '작은 아이디어가 세상을 바꾼다';
    // 칸 1: 문단마다 뽑은 중심 내용 조각 네 개
    body += [0, 1, 2, 3].map((i) => at(1, 'pop', text(pcx(i), 36, `${i + 1}문단`, { size: 18, color: C.muted })
      + `<g class="dim dim3">${tile(pcx(i), Y, PARA.labels[i], { size: 18, h: 44, fill: TAN, stroke: C.orange })}</g>`, i * 0.3)).join('');
    // 칸 2: 자주 나오는 낱말
    const words = ['아이디어', '선택', '행동', '바꾸다'], wx = [130, 260, 380, 506];
    body += words.map((w, i) => at(2, 'pop', `<g class="dim dim3">${g('pulse pulse2', tag(wx[i], 158, w, ROLE.s, 20), 0.8)}</g>`, i * 0.25)).join('');
    body += at(2, 'fin', `<g class="dim dim3">${text(320, 198, '자주 나오는 낱말', { size: 18, color: C.blue })}</g>`, 1.2);
    // 칸 3: 조각과 낱말이 가운데로 모여 하나가 된다
    const fly = (cls, x, y, inner, d) => {
      css += `.sc-${id} .${cls} { transition: transform .9s ease-in-out ${d}s, opacity .35s ease ${d + 0.75}s; }
        .on3 .sc-${id} .${cls} { transform: translate(${320 - x}px, ${TY - y}px); opacity: 0; }`;
      return `<g class="b3"><g class="${cls}">${inner}</g></g>`;
    };
    body += [0, 1, 2, 3].map((i) => fly(`fa${i}`, pcx(i), Y, tile(pcx(i), Y, PARA.labels[i], { size: 18, h: 44, fill: TAN, stroke: C.orange }), 0.2 + i * 0.1)).join('');
    body += words.map((w, i) => fly(`fw${i}`, wx[i], 158, tag(wx[i], 158, w, ROLE.s, 20), 0.35 + i * 0.1)).join('');
    css += `.on3 .sc-${id} .dim3 { transition-delay: .2s; }`;
    body += at(3, 'pop', tile(320, TY, theme, { size: 24, h: 62, fill: C.mint, stroke: C.green, sw: 4 }), 1.25);
    // 칸 4: 책 전체의 중심 생각
    body += glowRect(320 - wOf(theme, 24) / 2 - 8, TY - 39, wOf(theme, 24) + 16, 78, 4, C.green, 0.1, 18);
    body += at(4, 'pop', tag(320, 326, '주제', ROLE.p, 22), 0.5);
    put(K + 'reading/주제', svg(id, body, css));
  })();

  (function () {
    const id = 't42-k1-ganchu';
    let css = base(id);
    const PX = 40, PW = 210, keys = [1, 5, 8, 10];
    const lineY = (k) => 46 + k * 24;
    const lx = (k) => PX + (k % 4 === 0 ? 34 : 18);
    const lw = (k) => (k % 4 === 3 ? 110 : PX + PW - 18 - lx(k));
    let body = at(1, 'fin', `<rect x="${PX}" y="18" width="${PW}" height="320" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    let lines = '';
    for (let k = 0; k < 12; k++) {
      lines += `<rect class="ln ln${k} ${keys.includes(k) ? 'kb' : 'nb'}" x="${lx(k)}" y="${lineY(k) - 5}" width="${lw(k)}" height="10" rx="5" fill="#b5c4be"/>`;
      css += `.sc-${id} .ln${k} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .35s ease-out ${(0.2 + k * 0.1).toFixed(2)}s, fill .5s ease, opacity .6s ease; }
        .on1 .sc-${id} .ln${k} { transform: none; }`;
    }
    body += `<g class="b1">${lines}</g>`;
    // 칸 2: 중요한 줄에 주황
    css += `.on2 .sc-${id} .kb { fill: ${C.orange}; }` + keys.map((k, i) => `.on2 .sc-${id} .ln${k} { transition-delay: 0s, ${0.3 + i * 0.3}s, 0s; }`).join('\n');
    // 칸 3: 나머지는 흐려지고 중요한 줄만 오른쪽 쪽지로 옮겨 간다
    css += `.on3 .sc-${id} .nb { opacity: .25; transition-delay: 0s; }`;
    const CX = 392, CW = 214, CY = 112;
    body += at(3, 'fin', `<rect x="${CX}" y="${CY}" width="${CW}" height="134" rx="12" fill="white" stroke="${C.orange}" stroke-width="3"/>`, 0.2);
    body += `<g class="b3">${g('fin fin3', arrowR(268, 370, 180, C.muted), 0.2)}</g>`;
    body += keys.map((k, i) => {
      const ny = CY + 28 + i * 26, nx = CX + 20;
      css += `.sc-${id} .mv${i} { transform: translate(${lx(k) - nx}px, ${lineY(k) - ny}px); transition: transform 1s ease-in-out ${0.4 + i * 0.2}s; }
        .on3 .sc-${id} .mv${i} { transform: none; }`;
      return `<g class="b3"><g class="mv${i}"><rect x="${nx}" y="${ny - 5}" width="${i === 3 ? 120 : 174}" height="10" rx="5" fill="${C.orange}"/></g></g>`;
    }).join('');
    // 칸 4: 짧아진 글
    body += glowRect(CX - 6, CY - 6, CW + 12, 146, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(CX + CW / 2, 292, '간추리다', ROLE.y, 22), 0.5);
    put(K + 'reading/간추리다', svg(id, body, css));
  })();

  // ── 2단원: 문자 ──────────────────────────────
  (function () {
    const id = 't42-k2-munja';
    let css = base(id);
    let body = at(1, 'fin', person(70, 150, C.blue, 18));
    // 칸 1: 말소리 풍선이 떴다가 사라진다
    body += `<g class="b1"><g class="say">`
      + `<path d="M120 52 H262 Q274 52 274 64 V104 Q274 116 262 116 H136 L112 132 L120 112 Q120 112 120 104 V64 Q120 52 132 52 Z" fill="white" stroke="${C.blue}" stroke-width="3"/>`
      + text(197, 96, '나무', { size: 30, color: C.blue }) + waves(96, 114, C.blue, 'wv', 0.8) + '</g></g>';
    body += `<g class="b1"><g class="ghost"><path d="M120 52 H262 Q274 52 274 64 V104 Q274 116 262 116 H136 L112 132 L120 112 V64 Q120 52 132 52 Z" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/></g></g>`;
    css += `@keyframes ${id}-vanish { 0% { opacity: 0; } 10% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
      .sc-${id} .say { opacity: 0; } .on1 .sc-${id} .say { animation: ${id}-vanish 3.2s ease-in-out .2s both; }
      .sc-${id} .ghost { opacity: 0; transition: opacity .6s ease 2.8s; } .on1 .sc-${id} .ghost { opacity: 1; }`;
    // 칸 2: 종이에 적은 글자는 남는다
    body += curve(110, 150, 330, 110, 176, C.muted, 2, { width: 3.5 });
    body += at(2, 'pop', `<rect x="340" y="44" width="170" height="104" rx="10" fill="white" stroke="${C.green}" stroke-width="3.5"/>` + text(425, 110, '나무', { size: 40, color: C.green }), 0.8);
    body += at(2, 'pop', eye(568, 96, C.green), 1.4);
    // 칸 3: 같은 말을 적는 여러 나라 문자
    const cards = [[150, '나무', '한글'], [320, 'tree', '알파벳'], [490, '木', '한자']];
    body += cards.map(([x, w, l], i) => at(3, 'rise', `<rect x="${x - 66}" y="202" width="132" height="78" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(x, 254, w, { size: 34 }) + tag(x, 312, l, ROLE.s, 19), 0.2 + i * 0.35)).join('');
    // 칸 4
    body += glowRect(76, 192, 488, 148, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(590, 164, '문자', ROLE.p, 22), 0.5);
    put(K + '2/문자', svg(id, body, css));
  })();

  // ── 2단원: 뜻글자 ──────────────────────────────
  (function () {
    const id = 't42-k2-tteut';
    let css = base(id);
    const ys = [66, 156, 246];
    const mountain = (y) => `<path d="M188 ${y + 28} L216 ${y - 22} L236 ${y + 2} L250 ${y - 12} L278 ${y + 28} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/>`;
    const tree = (y) => `<rect x="225" y="${y}" width="12" height="30" rx="3" fill="${C.orange}"/>` + [[217, y - 2, 14], [245, y - 2, 14], [231, y - 18, 16]].map(([x, yy, r]) => `<circle cx="${x}" cy="${yy}" r="${r}" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5"/>`).join('') + `<path d="M210 ${y + 2} Q231 ${y + 10} 252 ${y + 2}" fill="${C.mint}"/>`;
    const man = (y) => person(231, y + 8, C.blue, 13);
    const rows = [['山', mountain], ['木', tree], ['人', man]];
    let body = `<path d="M330 22 V300" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`;
    body += rows.map(([ch, ic], i) => {
      const n = i === 0 ? 1 : 2, y = ys[i], d = i === 2 ? 0.6 : 0;
      return at(n, 'pop', tile(80, y, ch, { size: 42, w: 72, h: 72, fill: TAN, stroke: C.orange }), d)
        + `<g class="b${n}">${g(`fin fin${n}`, arrowR(126, 172, y, C.muted), d + 0.4)}</g>`
        + at(n, 'pop', ic(y), d + 0.7);
    }).join('');
    // 칸 3: 한글 '산'은 소리 조각으로 나뉜다
    body += at(3, 'pop', tile(480, 66, '산', { size: 42, w: 80, h: 72, fill: C.sky, stroke: C.blue }), 0);
    const jx = [404, 480, 556];
    body += ['ㅅ', 'ㅏ', 'ㄴ'].map((j, i) => line(480, 104, jx[i], 140, C.muted, 3, { width: 3, delay: 0.4 })
      + at(3, 'pop', tile(jx[i], 166, j, { size: 34, w: 60, h: 56, fill: 'white', stroke: C.blue }), 0.9 + i * 0.2)
      + at(3, 'fin', waves(jx[i] - 10, 232, C.blue, 'wv', 0.75), 1.3 + i * 0.2)).join('');
    body += at(3, 'pop', tag(480, 320, '소리글자', ROLE.s, 20), 1.6);
    // 칸 4: 글자 하나가 뜻 하나
    body += glowRect(22, 16, 292, 286, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(170, 320, '뜻글자', ROLE.y, 22), 0.5);
    put(K + '2/뜻글자', svg(id, body, css));
  })();

  // ── 2단원: 본뜨다(자음자 기본 글자 다섯) ──────────────────────────────
  // 발음 기관 옆모습(얼굴은 왼쪽을 본다). 작은 칸(120×170) 안 좌표.
  const ORG = {
    face: 'M50 4 Q32 8 30 28 L28 42 Q22 52 13 66 L10 72 Q12 78 22 78 Q15 82 17 89 L22 92 L17 95 Q15 102 20 106 Q22 110 26 111 Q18 122 26 132 Q40 140 60 138 L70 170',
    eye: 'M34 44 Q40 40 46 44',
    upTooth: 'M26 81 H33 V88 Q29.5 91 26 88 Z', loTooth: 'M26 104 H33 V98 Q29.5 95 26 98 Z',
    roof: 'M30 84 Q36 74 50 73 L74 73 Q96 74 98 96 L98 170',
    floor: 'M31 104 Q50 116 70 118 Q80 120 82 132 L82 170',
    tongueRest: 'M32 100 Q44 90 62 90 Q84 90 90 106 L88 150 L82 150 L82 132 Q80 120 70 118 Q50 116 32 104 Z',
    tongueG: 'M32 100 Q46 98 58 88 L70 80 L90 77 Q95 84 91 104 L88 150 L82 150 L82 132 Q80 120 70 118 Q50 116 32 104 Z',
    tongueN: 'M32 102 Q29 90 32 83 Q36 77 40 82 Q43 92 45 100 Q49 104 60 104 Q82 104 90 112 L88 150 L82 150 L82 132 Q80 120 70 118 Q50 116 32 104 Z',
    traceG: 'M64 89 H85 V140', traceN: 'M37 87 V110 H80'
  };
  const sideView = (tongue) => `<path d="${ORG.face}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${ORG.eye}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + `<path d="${ORG.roof}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linejoin="round"/><path d="${ORG.floor}" stroke="${C.ink}" stroke-width="3" fill="none"/>`
    + `<path d="${ORG.upTooth}" fill="white" stroke="${C.ink}" stroke-width="2"/><path d="${ORG.loTooth}" fill="white" stroke="${C.ink}" stroke-width="2"/>` + tongue;
  const tongue = (d, cls = '') => `<path class="${cls}" d="${d}" fill="${C.peach}" stroke="${C.red}" stroke-width="2.5" stroke-linejoin="round"/>`;

  (function () {
    const id = 't42-k2-bontteu';
    let css = base(id);
    const xs = [72, 196, 320, 444, 568], S = 0.95, oy = 12;
    const P = (i, inner) => `<g transform="translate(${xs[i] - 60 * S} ${oy}) scale(${S})">${inner}</g>`;
    const trace = (d, n, delay) => `<g class="b${n}"><g class="tw"><path class="draw draw${n}" pathLength="1" d="${d}" stroke="${C.orange}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transition-delay:${delay}s"/></g></g>`;
    // 빈 칸 다섯
    let body = xs.map((x, i) => at(1, 'fin', P(i, `<rect x="0" y="0" width="120" height="170" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`), i * 0.08)).join('');
    // 칸 1: ㄱ(혀뿌리가 목구멍을 막음), ㄴ(혀가 윗잇몸에 닿음) — 혀가 움직인 뒤 그 모양을 따라 그린다
    const moving = (i, shape, tr, k) => {
      css += `.sc-${id} .rest${k} { transition: opacity .45s ease .5s; } .on1 .sc-${id} .rest${k} { opacity: 0; }
        .sc-${id} .tg${k} { opacity: 0; transition: opacity .45s ease .5s; } .on1 .sc-${id} .tg${k} { opacity: 1; }`;
      return at(1, 'fin', P(i, sideView(tongue(ORG.tongueRest, `rest${k}`) + tongue(shape, `tg${k}`))), 0.1) + P(i, trace(tr, 1, 0.9));
    };
    body += moving(0, ORG.tongueG, ORG.traceG, 0) + moving(1, ORG.tongueN, ORG.traceN, 1);
    // 칸 2: ㅁ(입), ㅅ(이), ㅇ(목구멍)
    const mouth = `<path d="M24 88 Q24 56 60 58 Q96 56 96 88 Q96 120 60 118 Q24 120 24 88 Z" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/><path d="M38 88 Q38 72 60 72 Q82 72 82 88 Q82 104 60 104 Q38 104 38 88 Z" fill="white" stroke="${C.red}" stroke-width="2"/>`;
    const tooth = `<rect x="14" y="128" width="92" height="22" rx="8" fill="${C.peach}" stroke="${C.red}" stroke-width="2.5"/><path d="M34 130 Q36 84 60 52 Q84 84 86 130 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    body += at(2, 'fin', P(2, mouth), 0) + P(2, trace('M40 72 H80 V104 H40 Z', 2, 0.5));
    body += at(2, 'fin', P(3, tooth), 0.15) + P(3, trace('M60 60 L40 124 M60 60 L80 124', 2, 0.65));
    body += at(2, 'fin', P(4, sideView(tongue(ORG.tongueRest))), 0.3) + P(4, trace('M93 128 a12 12 0 1 0 0.1 0', 2, 0.8));
    // 글자와 이름표
    const letters = [['ㄱ', '혀뿌리'], ['ㄴ', '혀끝'], ['ㅁ', '입'], ['ㅅ', '이'], ['ㅇ', '목구멍']];
    body += letters.map(([ch, nm], i) => {
      const n = i < 2 ? 1 : 2, d = n === 1 ? 1.2 : 1.0 + (i - 2) * 0.15;
      return at(n, 'drop', `<g class="lt">${text(xs[i], 236, ch, { size: 56, color: C.ink, weight: 800 })}</g>`, d)
        + at(n, 'pop', tag(xs[i], 286, nm, ['white', C.line], 19), d + 0.2);
    }).join('');
    // 칸 3: 다섯 글자 모두 생김새를 따라 그렸다
    css += glowCss(id, '.tw', 3, 0.2) + `.sc-${id} .lt { transform-box: fill-box; transform-origin: center; } .on3 .sc-${id} .lt { animation: ${id}-pulse .7s ease-in-out .5s 2; }`;
    body += at(3, 'pop', tag(320, 336, '본뜨다', ROLE.y, 22), 0.7);
    put(K + '2/본뜨다', svg(id, body, css));
  })();

  // ── 2단원: 확장(자음자는 기본 글자에 획을 더하고, 모음자는 기본 글자를 합침) ──────────────────────────────
  // 60×60 칸 안의 획. [기본(이미 있던) 획, 더한·합친 획]. 모음자의 '·'는 오늘날 짧은 획으로 쓴다.
  const JAMO = {
    'ㄱ': [['M10 12 H48 V52'], []],
    'ㅋ': [['M10 12 H48 V52'], ['M12 32 H48']],
    'ㄴ': [['M12 8 V50 H52'], []],
    'ㄷ': [['M12 12 V50 H52'], ['M12 12 H50']],
    'ㅌ': [['M12 10 V50 H52'], ['M12 10 H50', 'M12 30 H48']],
    'ㅁ': [['M12 12 H48 V50 H12 Z'], []],
    'ㅂ': [['M12 26 H48 V52 H12 Z'], ['M12 26 V6', 'M48 26 V6']],
    'ㅍ': [['M20 12 H40 V48 H20 Z'], ['M6 12 H20 M40 12 H54', 'M6 48 H20 M40 48 H54']],
    'ㅅ': [['M30 10 L8 52 M30 10 L52 52'], []],
    'ㅈ': [['M30 18 L9 54 M30 18 L51 54'], ['M9 18 H51']],
    'ㅊ': [['M30 26 L11 56 M30 26 L49 56'], ['M11 26 H49', 'M30 4 V16']],
    'ㅇ': [['M10 32 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0'], []],
    'ㅎ': [['M16 43 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0'], ['M12 24 H48', 'M30 4 V14']],
    'ㅡ': [['M6 30 H54'], []],
    'ㅣ': [['M30 6 V54'], []],
    'ㅗ': [['M6 46 H54'], ['M30 22 V46']],
    'ㅏ': [['M24 6 V54'], ['M24 30 H48']],
    'ㅜ': [['M6 16 H54'], ['M30 16 V40']],
    'ㅓ': [['M36 6 V54'], ['M12 30 H36']],
    'ㅛ': [['M6 46 H54', 'M21 24 V46'], ['M39 24 V46']],
    'ㅑ': [['M22 6 V54', 'M22 22 H46'], ['M22 38 H46']],
    'ㅠ': [['M6 16 H54', 'M21 16 V38'], ['M39 16 V38']],
    'ㅕ': [['M38 6 V54', 'M14 22 H38'], ['M14 38 H38']]
  };
  (function () {
    const id = 't42-k2-hwakjang';
    let css = base(id);
    const SC = 0.7, SV = 0.84, SW = 8.5;
    const st = (color) => `stroke="${color}" stroke-width="${SW}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
    // 글자 하나: 기본 획(검정)이 나타나고, 더한 획(주황)이 그어진다
    const glyph = (ch, x, y, n, d0, S = SC) => {
      const [b, a] = JAMO[ch];
      return `<g transform="translate(${f(x - 30 * S)} ${f(y - 30 * S)}) scale(${S})">`
        + at(n, 'fin', b.map((p) => `<path d="${p}" ${st(C.ink)}/>`).join(''), d0)
        + a.map((p, i) => `<g class="b${n}"><g class="add"><path class="draw draw${n}" pathLength="1" d="${p}" ${st(C.orange)} style="transition-delay:${f(d0 + 0.35 + i * 0.25)}s;transition-duration:.5s"/></g></g>`).join('')
        + '</g>';
    };
    const dot = (x, y, n, d0) => at(n, 'fin', `<circle cx="${x}" cy="${y}" r="${f(7.5 * SV + 2)}" fill="${C.ink}"/>`, d0);
    const arr = (x1, y1, x2, y2, n, d) => {
      const ang = Math.atan2(y2 - y1, x2 - x1);
      return `<g class="b${n}">${g(`fin fin${n}`, `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.muted}" stroke-width="3.5" stroke-linecap="round"/>` + head(x2, y2, ang, C.muted, 3.5), d)}</g>`;
    };

    // 왼쪽: 자음자. 기본 글자 다섯이 세로로, 획을 더한 글자가 오른쪽으로.
    const rowY = [72, 126, 180, 234, 288], colX = [56, 152, 248];
    const fam = [['ㄱ', 'ㅋ'], ['ㄴ', 'ㄷ', 'ㅌ'], ['ㅁ', 'ㅂ', 'ㅍ'], ['ㅅ', 'ㅈ', 'ㅊ'], ['ㅇ', 'ㅎ']];
    const frC = stretchBox(id, 'fc', { x: 22, y: 46, w: 68, h: 268, rx: 14, fill: C.mint, stroke: C.green, sw: 3 }, { axis: 'x', b: 192, n: 4, delay: 0.2 });
    // 오른쪽: 모음자. 기본 글자 셋이 한 줄로, 합친 글자 두 줄이 아래로.
    const vX = [363, 435, 507, 579], baseX = [399, 471, 543], vA = 182, vB = 276;
    const frV = stretchBox(id, 'fv', { x: 326, y: 46, w: 290, h: 72, rx: 14, fill: C.mint, stroke: C.green, sw: 3 }, { axis: 'y', b: 196, n: 4, delay: 0.2 });
    css += frC.css + frV.css;
    let body = `<g class="b1">${frC.body}${frV.body}</g>`;
    body += at(1, 'pop', tag(56, 24, '자음자', ['white', C.line], 19), 0.1) + at(1, 'pop', tag(471, 24, '모음자', ['white', C.line], 19), 0.1)
      + at(1, 'pop', tag(208, 24, '기본 글자', ROLE.p, 19), 0.6);

    // 칸 1: 자음자 기본 글자 다섯, 모음자 기본 글자 셋(·, ㅡ, ㅣ)
    fam.forEach((fm, r) => { body += glyph(fm[0], colX[0], rowY[r], 1, 0.15 + r * 0.12); });
    body += dot(baseX[0], 82, 1, 0.8) + glyph('ㅡ', baseX[1], 82, 1, 0.92, SV) + glyph('ㅣ', baseX[2], 82, 1, 1.04, SV);
    // 칸 2: 자음자 — 획을 한 번 더한 글자, 또 더한 글자
    fam.forEach((fm, r) => {
      fm.slice(1).forEach((ch, k) => {
        const c = k + 1, d = c === 1 ? r * 0.12 : 0.8 + r * 0.1;
        body += arr(colX[c - 1] + (c === 1 ? 42 : 26), rowY[r], colX[c] - 26, rowY[r], 2, d) + glyph(ch, colX[c], rowY[r], 2, d);
      });
    });
    // 칸 3: 모음자 — 기본 글자를 합친 ㅗ·ㅏ·ㅜ·ㅓ, '·'를 한 번 더 합친 ㅛ·ㅑ·ㅠ·ㅕ
    ['ㅗ', 'ㅏ', 'ㅜ', 'ㅓ'].forEach((ch, i) => { const d = i * 0.15; body += arr(vX[i], 124, vX[i], 152, 3, d) + glyph(ch, vX[i], vA, 3, d, SV); });
    ['ㅛ', 'ㅑ', 'ㅠ', 'ㅕ'].forEach((ch, i) => { const d = 0.9 + i * 0.15; body += arr(vX[i], 214, vX[i], 244, 3, d) + glyph(ch, vX[i], vB, 3, d, SV); });
    // 칸 4: 기본 글자만 감싸던 두 틀이 넓어지고, 더한·합친 획이 반짝인다
    // 틀이 다 넓어진 뒤에 반짝인다(기다리는 동안 획이 사라지지 않게 both 를 쓰지 않는다)
    css += `.on4 .sc-${id} .add { animation: ${id}-flash 1.4s ease-in-out 1.2s; }`;
    body += at(4, 'pop', tag(320, 338, '확장', ROLE.y, 22), 1.3);
    put(K + '2/확장', svg(id, body, css));
  })();

  // ── 2단원: 줄임말(생파·엄빠·깜놀) ──────────────────────────────
  (function () {
    const id = 't42-k2-julim';
    let css = base(id);
    const SZ = 32, ys = [70, 166, 262];
    const list = [[['생', '일', ' ', '파', '티'], [0, 3]], [['엄', '마', ' ', '아', '빠'], [0, 4]], [['깜', '짝', ' ', '놀', '라', '다'], [0, 3]]];
    const adv = (c) => (c === ' ' ? SZ * 0.45 : SZ * 1.04);
    let body = '';
    list.forEach(([chs, keep], r) => {
      const y = ys[r], x0 = 40, pad = SZ * 0.6;
      let x = x0 + pad;
      const pos = chs.map((c) => { const cx = x + adv(c) / 2; x += adv(c); return cx; });
      const w = x - x0 + pad;
      // 긴 말 조각
      let inner = `<rect x="${x0}" y="${y - 30}" width="${f(w)}" height="60" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`;
      inner += chs.map((c, i) => (c === ' ' ? '' : text(f(pos[i]), f(y + SZ * 0.36), c, { size: SZ, cls: keep.includes(i) ? `kc kc${r}` : `dc dc${r}` }))).join('');
      body += at(1, 'slide', inner, r * 0.3);
      // 짧은 말: 남긴 글자가 오른쪽으로 옮겨 가 붙는다
      const sx = 486, s0 = sx - SZ * 0.52, s1 = sx + SZ * 0.52;
      body += `<g class="b2">${g('fin fin2', arrowR(f(x0 + w + 16), 404, y, C.muted), 0.2 + r * 0.3)}</g>`;
      body += at(2, 'pop', `<rect x="${sx - 52}" y="${y - 30}" width="104" height="60" rx="12" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>`, 1.2 + r * 0.3);
      keep.forEach((i, k) => {
        const to = k === 0 ? s0 : s1;
        css += `.sc-${id} .mv${r}${k} { transform: translateX(${f(pos[i] - to)}px); transition: transform 1s ease-in-out ${(0.3 + r * 0.3).toFixed(1)}s; }
          .on2 .sc-${id} .mv${r}${k} { transform: none; }`;
        body += `<g class="b2"><g class="mv${r}${k}">${text(f(to), f(y + SZ * 0.36), chs[i], { size: SZ, color: C.orange })}</g></g>`;
      });
    });
    css += `.sc-${id} .kc { transition: fill .5s ease 1.1s; } .on1 .sc-${id} .kc { fill: ${C.orange}; }
      .sc-${id} .dc, .sc-${id} .kc { transition: fill .5s ease 1.1s, opacity .5s ease; } .on2 .sc-${id} .dc { opacity: .2; } .on2 .sc-${id} .kc { opacity: .35; }`;
    // 칸 3
    body += ys.map((y, r) => glowRect(428, y - 36, 116, 72, 3, C.orange, 0.1 + r * 0.15, 16)).join('');
    body += at(3, 'pop', tag(486, 330, '줄임말', ROLE.y, 22), 0.6);
    put(K + '2/줄임말', svg(id, body, css));
  })();

  // ── 2단원: 순우리말(팁 → 도움말) ──────────────────────────────
  (function () {
    const id = 't42-k2-sunuri';
    let css = base(id);
    const Y = 156, SZ = 22;
    const r = row(['줄넘기를', '잘하기 위한', '도움말', '을', '말해 줄게.'], { y: Y, gap: 8, size: SZ });
    const slot = r[2];
    r[3].cx -= 12; r[4].cx -= 22;
    r.forEach((p) => { p.cx += 11; p.l += 11; p.r += 11; });
    let body = '';
    body += r.map((p, i) => {
      if (i === 2) return '';
      const o = i === 3 ? { fill: C.paper, stroke: C.paper } : {};
      return at(1, 'slide', T(p, o), i * 0.15);
    }).join('');
    // 팁 조각(밑줄)
    body += `<g class="b1"><g class="tip">${tile(slot.cx, Y, '팁', { size: SZ, w: slot.w, fill: TAN, stroke: C.orange })}<path d="M${f(slot.l + 10)} ${Y + 38} H${f(slot.r - 10)}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/></g></g>`;
    css += `.sc-${id} .tip { transition: transform .8s ease-in-out .2s, opacity .5s ease .5s; } .on3 .sc-${id} .tip { transform: translateY(-80px); opacity: 0; }
      .sc-${id} .tip .tl { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .tip .tl { animation: ${id}-shake .6s ease-in-out 1s 2; }`;
    // 칸 2: 팁은 영어에서 들어온 말
    body += `<g class="b2 h3">` + g('pop pop2', tag(slot.cx - 150, 52, '영어 tip', ROLE.s, 20), 0) + '</g>';
    body += `<g class="h3">${curve(slot.cx - 90, 60, slot.cx - 6, Y - 36, 50, C.blue, 2, { width: 3.5, delay: 0.3 })}</g>`;
    css += `.sc-${id} .h3 { transition: opacity .4s ease; }`;
    // 칸 3: 그 자리에 순우리말 '도움말'
    css += move(id, 'dw', 'translateY(-60px)', 3, { dur: 0.7, delay: 0.7 });
    body += `<g class="b3"><g class="dw">${T(slot, { fill: C.mint, stroke: C.green })}</g></g>`;
    // 칸 4: 처음부터 써 온 우리말
    const more = row(['무지개', '아침', '도시락'], { y: 262, gap: 20, size: 22 });
    body += more.map((p, i) => at(4, 'rise', T(p, { fill: C.mint, stroke: C.green }), 0.3 + i * 0.25)).join('');
    body += glowRect(slot.l, Y - 28, slot.w, 56, 4, C.green, 0.1, 12);
    body += at(4, 'pop', tag(320, 330, '순우리말', ROLE.p, 22), 1.1);
    put(K + '2/순우리말', svg(id, body, css));
  })();

  // ── 2단원: 보고서(지후의 「우리 반 친구들의 줄임말 사용」) ──────────────────────────────
  (function () {
    const id = 't42-k2-bogo';
    let css = base(id);
    const clip = (x, y) => `<rect x="${x - 24}" y="${y - 30}" width="48" height="60" rx="5" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${x - 11}" y="${y - 36}" width="22" height="11" rx="3" fill="${C.green}"/>`
      + [-12, 3, 18].map((d, i) => `<rect x="${x - 15}" y="${y + d - 5}" width="10" height="10" rx="2" fill="white" stroke="${C.ink}" stroke-width="2"/><path d="M${x} ${y + d} H${x + 15}" stroke="#8fa39b" stroke-width="4" stroke-linecap="round"/>`
        + (i < 2 ? `<path d="M${x - 13} ${y + d} L${x - 10} ${y + d + 3} L${x - 5} ${y + d - 4}" stroke="${C.orange}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` : '')).join('');
    const talk = (x, y) => person(x - 20, y + 14, C.blue, 11) + person(x + 20, y + 14, C.orange, 11);
    const screen = (x, y) => `<rect x="${x - 30}" y="${y - 26}" width="60" height="42" rx="5" fill="${C.sky}" stroke="${C.ink}" stroke-width="3"/><path d="M${x} ${y + 16} V${y + 26} M${x - 14} ${y + 28} H${x + 14}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`;
    const meth = [[clip, '설문 조사'], [talk, '면담 조사'], [screen, '인터넷 조사']], my = [92, 190, 288];
    let body = meth.map(([ic, l], i) => at(1, 'pop', ic(98, my[i]) + text(98, my[i] + 52, l, { size: 18 }), i * 0.4)).join('');
    // 보고서 쪽
    const X = 214, W = 412;
    body += at(1, 'fin', `<rect x="${X}" y="10" width="${W}" height="342" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`, 1.2);
    body += `<g class="b2">` + my.map((y, i) => g('fin fin2', `<path d="M162 ${y - 10} Q190 ${y - 10} 206 ${150 + i * 20}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-dasharray="6 6"/>`, i * 0.1)).join('') + '</g>';
    const L = X + 16;
    const tg = (x, y, label, col) => { const w = wOf(label, 18) + 4; return { s: tag(x + w / 2, y, label, col, 18), r: x + w }; };
    const lineAfter = (x, y, w, two = false) => (two ? bar(x, y - 7, w, '#b5c4be', 8) + bar(x, y + 7, w * 0.7, '#b5c4be', 8) : bar(x, y, w, '#b5c4be', 8));
    const rowAt = (n, d, y, label, col, two) => { const t = tg(L, y, label, col); return at(n, 'slide', t.s + lineAfter(t.r + 12, y, X + W - 16 - t.r - 12, two), d); };
    // 칸 2: 제목, 조사 대상·기간, 조사 동기, 조사 방법
    body += at(2, 'rise', text(X + W / 2, 42, '우리 반 친구들의 줄임말 사용', { size: 22 }) + `<path d="M${X + 20} 56 H${X + W - 20}" stroke="${C.line}" stroke-width="2"/>`, 0.3);
    const a = tg(L, 88, '조사 대상', ROLE.s), b = tg(X + 206, 88, '조사 기간', ROLE.s);
    body += at(2, 'slide', a.s + bar(a.r + 12, 88, X + 196 - a.r - 12, '#b5c4be', 8) + b.s + bar(b.r + 12, 88, X + W - 16 - b.r - 12, '#b5c4be', 8), 0.7);
    body += rowAt(2, 1.0, 130, '조사 동기', ROLE.s, true);
    body += rowAt(2, 1.3, 172, '조사 방법', ROLE.s, false);
    // 칸 3: 조사한 내용(그래프), 조사 소감, 참고 자료와 그 출처
    const c = tg(L, 222, '조사한 내용', ROLE.p);
    const gx = c.r + 18, base0 = 248, hs = [46, 30, 18, 12];
    body += at(3, 'slide', c.s + `<path d="M${gx - 6} ${base0} H${gx + 112}" stroke="${C.ink}" stroke-width="2"/>`, 0.2);
    body += `<g class="b3">` + hs.map((h, i) => `<rect class="gb" style="transition-delay:${(0.6 + i * 0.15).toFixed(2)}s" x="${gx + i * 28}" y="${base0 - h}" width="18" height="${h}" fill="${C.blue}"/>`).join('') + '</g>';
    body += at(3, 'slide', lineAfter(gx + 130, 222, X + W - 16 - gx - 130, true), 0.9);
    css += `.sc-${id} .gb { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform .5s ease-out; } .on3 .sc-${id} .gb { transform: none; }`;
    body += rowAt(3, 1.2, 278, '조사 소감', ROLE.p, false);
    body += rowAt(3, 1.5, 320, '참고 자료와 그 출처', ROLE.p, false);
    // 칸 4
    body += glowRect(X - 5, 5, W + 10, 352, 4, C.green, 0.1, 14);
    body += at(4, 'pop', tag(98, 26, '보고서', ROLE.y, 22), 0.5);
    put(K + '2/보고서', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
