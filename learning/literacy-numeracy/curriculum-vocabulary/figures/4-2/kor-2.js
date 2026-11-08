// 국어 4-2 낱말 도식(뒤 반: 매체 단원·4·5·6단원): 글의 짜임·편지·이야기 사건 낱말을 낱말 조각과 글 모양으로 움직여 보인다.
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

  const K = '4-2/국어/';
  const TAN = '#fdf3d3';
  const bar = (x, y, w, color = '#b5c4be', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;
  const eye = (x, y, color = C.blue) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`;

  // ── 매체 단원: 개요(한라산 발표 개요 — 처음·가운데·끝 칸이 채워진다) ──────────────────────────────
  (function () {
    const id = 't42-k2-gaeyo';
    let css = base(id);
    const rows = [['처음', 84, 144], ['가운데', 144, 256], ['끝', 256, 316]];
    let body = at(1, 'fin', tag(80, 30, '주제', ROLE.p, 19) + text(122, 37, '우리나라의 화산, 한라산', { size: 20, anchor: 'start' }));
    body += at(1, 'fin', `<rect x="40" y="52" width="560" height="264" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M150 52 V316 M420 52 V316 M40 84 H600 M40 144 H600 M40 256 H600" stroke="${C.line}" stroke-width="2.5"/>`
      + `<rect x="42" y="54" width="556" height="29" rx="10" fill="${C.paper}"/>` + `<path d="M150 54 V83 M420 54 V83" stroke="${C.line}" stroke-width="2.5"/>`, 0.3);
    body += at(1, 'fin', text(95, 75, '구분', { size: 18, color: C.muted }), 0.5);
    body += at(2, 'fin', text(285, 75, '발표 내용', { size: 18, color: C.muted }));
    body += at(3, 'fin', text(510, 75, '활용할 자료', { size: 18, color: C.muted }));
    body += rows.map(([label, y1, y2], k) => at(1, 'pop', tag(95, (y1 + y2) / 2, label, ROLE.s, 19), 0.7 + k * 0.3)).join('');
    const say = [['산 이름 묻기', 114], ['백록담 설명', 176], ['높이 비교', 224], ['가 보고 싶다', 286]];
    const use = [['사진', 114], ['동영상', 176], ['그래프', 224], ['사진', 286]];
    // 빈 칸 자리(칸 2에 사라짐)
    body += `<g class="b1 h2">` + say.map(([, y], i) => g('fin fin1', `<rect x="200" y="${y - 18}" width="170" height="36" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 7"/>`, 1.2 + i * 0.1)).join('') + '</g>';
    body += `<g class="b1 h3">` + use.map(([, y], i) => g('fin fin1', `<rect x="455" y="${y - 18}" width="110" height="36" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 7"/>`, 1.2 + i * 0.1)).join('') + '</g>';
    body += say.map(([label, y], i) => at(2, 'pop', tile(285, y, label, { size: 20, h: 40, fill: TAN, stroke: C.orange }), 0.3 + i * 0.45)).join('');
    body += use.map(([label, y], i) => at(3, 'pop', tag(510, y, label, ROLE.s, 19), 0.3 + i * 0.4)).join('');
    body += glowRect(36, 48, 568, 272, 4, C.green, 0.2) + at(4, 'pop', tag(560, 30, '개요', ROLE.p, 22), 0.5);
    put(K + 'media/개요', svg(id, body, css));
  })();

  // ── 매체 단원: 출처(자료에서 처음 나온 곳으로 거슬러 가는 화살표) ──────────────────────────────
  (function () {
    const id = 't42-k2-chulcheo';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="24" y="22" width="292" height="314" rx="14" fill="white" stroke="${C.ink}" stroke-width="3"/>`);
    // 훈민정음 쪽 사진: 세로 글줄
    const page = `<rect x="44" y="40" width="252" height="100" rx="8" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/>`
      + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<path d="M${76 + i * 20} 54 V126" stroke="#b39a62" stroke-width="5" stroke-dasharray="9 5"/>`).join('')
      + `<rect x="58" y="52" width="10" height="76" fill="${C.orange}" opacity=".5"/>`;
    // 인구 변화 그래프
    const graph = `<rect x="44" y="182" width="252" height="100" rx="8" fill="white" stroke="${C.line}" stroke-width="2.5"/>`
      + `<path d="M64 194 V266 H280" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`
      + `<path d="M70 206 L120 216 L170 232 L220 244 L272 252" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="M70 256 L120 252 L170 246 L220 240 L272 230" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    body += at(1, 'pop', g('srcA', page), 0.3) + at(1, 'pop', g('srcB', graph), 0.8);
    // 처음 나온 곳: 책과 누리집
    const book = `<rect x="462" y="34" width="76" height="98" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="462" y="34" width="13" height="98" rx="4" fill="${C.blue}"/>`
      + `<rect x="488" y="54" width="38" height="44" rx="3" fill="white" stroke="${C.blue}" stroke-width="2"/>` + [64, 76, 88].map((y) => `<path d="M495 ${y} H519" stroke="${C.blue}" stroke-width="2.5"/>`).join('');
    const site = `<rect x="420" y="190" width="160" height="84" rx="8" fill="white" stroke="${C.blue}" stroke-width="3"/><rect x="421.5" y="191.5" width="157" height="18" rx="6" fill="${C.sky}"/>`
      + [434, 446, 458].map((x) => `<circle cx="${x}" cy="200.5" r="4" fill="${C.blue}"/>`).join('')
      + `<rect x="436" y="242" width="16" height="22" fill="${C.green}"/><rect x="458" y="230" width="16" height="34" fill="${C.green}"/><rect x="480" y="236" width="16" height="28" fill="${C.green}"/>`
      + bar(508, 228, 58, '#b5c4be', 8) + bar(508, 244, 46, '#b5c4be', 8) + bar(508, 260, 52, '#b5c4be', 8);
    body += curve(300, 90, 452, 84, 56, C.orange, 2, { width: 4.5 }) + curve(300, 232, 410, 232, 204, C.blue, 2, { width: 4.5, delay: 0.4 });
    body += at(2, 'pop', `<g class="og">${book}</g>` + text(500, 160, '『훈민정음해례본』', { size: 18 }), 1.1);
    body += at(2, 'pop', `<g class="og">${site}</g>` + text(500, 300, '국가데이터처 누리집', { size: 18 }), 1.4);
    // 자료 아래에 출처 이름
    body += at(3, 'slide', text(48, 164, '출처: 『훈민정음해례본』', { size: 18, color: C.green, anchor: 'start' }), 0.2);
    body += at(3, 'slide', text(48, 306, '출처: 국가데이터처 누리집', { size: 18, color: C.green, anchor: 'start' }), 0.7);
    body += `<g class="b3"><rect class="flash flash3" x="38" y="146" width="264" height="26" rx="8" fill="none" stroke="${C.green}" stroke-width="3" style="animation-delay:.3s"/><rect class="flash flash3" x="38" y="288" width="264" height="26" rx="8" fill="none" stroke="${C.green}" stroke-width="3" style="animation-delay:.8s"/></g>`;
    body += glowRect(408, 22, 184, 290, 4, C.green, 0.2) + at(4, 'pop', tag(500, 336, '출처', ROLE.p, 22), 0.5);
    put(K + 'media/출처', svg(id, body, css));
  })();

  // ── 매체 단원: 간결하다(군더더기 조각이 빠지고 줄이 짧아진다) ──────────────────────────────
  (function () {
    const id = 't42-k2-gangyeol';
    const labels = ['한라산은', '음,', '제주도의', '그런', '화산이에요'];
    const keep = [0, 2, 4], drop = [1, 3];
    const r = row(labels, { y: 110, size: 24, gap: 12 });
    const r2 = row(keep.map((i) => labels[i]), { y: 110, size: 24, gap: 12 });
    const W = r[r.length - 1].r - r[0].l, W2 = r2[r2.length - 1].r - r2[0].l;
    let css = base(id);
    let body = at(1, 'fin', text(320, 46, '발표 카드', { size: 18, color: C.muted }));
    body += r.map((p, i) => `<g class="mv m${i}">` + at(1, 'rise', `<g class="k${i}">${T(p, { h: 54 })}</g>`, i * 0.15) + '</g>').join('');
    // 줄 길이 막대: 처음 길이는 점선으로 남고, 막대는 줄어든다
    body += at(3, 'fin', `<rect x="${f(r[0].l)}" y="210" width="${f(W)}" height="16" rx="8" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 6"/>`, 0.3);
    body += at(1, 'fin', `<g class="rl"><rect x="${f(r[0].l)}" y="210" width="${f(W)}" height="16" rx="8" fill="${C.muted}"/></g>`, 0.9);
    body += at(1, 'fin', text(320, 256, '길이', { size: 18, color: C.muted }), 1.1);
    css += drop.map((i) => paint(id, `.k${i}`, [C.peach, C.red], 2, 0.2)).join('');
    css += `.on2 .sc-${id} .k1, .on2 .sc-${id} .k3 { animation: ${id}-shake .5s ease-in-out .5s 2; }`;
    css += `.sc-${id} .mv { transition: transform 1s ease-in-out, opacity .6s ease; }
      .on2 .sc-${id} .m1, .on2 .sc-${id} .m3 { transform: translateY(60px); opacity: 0; transition-delay: 1.7s; }`;
    keep.forEach((i, j) => { css += `.on3 .sc-${id} .m${i} { transform: translateX(${f(r2[j].cx - r[i].cx)}px); transition-delay: .2s; }`; });
    css += `.sc-${id} .rl { transform-box: fill-box; transform-origin: center; transition: transform 1s ease-in-out .3s; }
      .on3 .sc-${id} .rl { transform: scaleX(${f(W2 / W)}); }`;
    body += at(3, 'pop', check(f(r2[2].r + 34), 110, 12), 1.4);
    body += glowRect(r2[0].l - 10, 74, W2 + 20, 72, 4, C.green, 0.1) + at(4, 'pop', tag(320, 310, '간결하다', ROLE.p, 22), 0.5);
    put(K + 'media/간결하다', svg(id, body, css));
  })();

  // ── 4단원: 요약(긴 글에서 중심 문장만 남아 모인다) ──────────────────────────────
  (function () {
    const id = 't42-k2-yoyak';
    let css = base(id);
    let page = `<rect x="24" y="20" width="316" height="320" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(182, 50, '약, 잘 쓰고 잘 버리는 방법', { size: 18 }) + `<path d="M44 64 H320" stroke="${C.line}" stroke-width="2"/>`;
    const paras = [84, 148, 212, 276];
    const hot = [0, 1, -1, 0];
    let lines = '';
    let hl = '';
    paras.forEach((y0, k) => {
      [0, 1, 2].forEach((j) => {
        const y = y0 + j * 18, x = j === 0 ? 58 : 44, w = j === 2 ? 190 : (j === 0 ? 262 : 276);
        if (hot[k] === j) hl += `<rect class="hl" x="${x - 6}" y="${y - 10}" width="${w + 12}" height="20" rx="5" fill="${C.yellow}" opacity=".6" style="transition-delay:${0.2 + k * 0.4}s"/>`;
        lines += bar(x, y, w, hot[k] === j ? '#8fa39b' : '#c4d3cc', 9);
      });
    });
    let body = at(1, 'fin', page) + `<g class="dim dim4"><g class="b2">${hl}</g>` + at(1, 'fin', lines, 0.4) + '</g>';
    css += `.sc-${id} .hl { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out; }
      .on2 .sc-${id} .hl { transform: none; }`;
    // 오른쪽: 남은 세 줄
    body += at(3, 'fin', `<rect x="370" y="64" width="248" height="246" rx="14" fill="${C.mint}" opacity=".6"/>`);
    const keep = [['수거함에 넣기', 112, 84], ['제대로 보관하기', 187, 166], ['버리면 환경 오염', 262, 276]];
    keep.forEach(([label, y, fromY], i) => {
      body += `<g class="b3"><g class="fy fy${i}">${tile(494, y, label, { size: 20, h: 46, w: 216, fill: 'white', stroke: C.green })}</g></g>`;
      css += `.sc-${id} .fy${i} { transform: translate(${182 - 494}px, ${fromY - y}px) scale(.6); opacity: 0; transition: transform 1s ease-in-out ${0.3 + i * 0.5}s, opacity .4s ease ${0.3 + i * 0.5}s; }
        .on3 .sc-${id} .fy${i} { transform: none; opacity: 1; }`;
    });
    body += glowRect(366, 60, 256, 254, 4, C.green, 0.2) + at(4, 'drop', tag(494, 34, '요약', ROLE.p, 22), 0.5);
    put(K + '4/요약', svg(id, body, css));
  })();

  // ── 4단원: 빗대다(기뻐를 고무줄에 견주어 — 둘 다 쭈욱 늘어난다) ──────────────────────────────
  (function () {
    const id = 't42-k2-bitdae';
    let css = base(id);
    let body = '';
    // 위 '기뻐' 조각과 아래 고무줄: 칸 2에서 양 끝이 110씩 벌어진다(늘어나는 둥근 상자)
    const stTop = stretchBox(id, 'sa', { x: 260, y: 72, w: 120, h: 66, rx: 16, fill: 'white', stroke: C.ink, sw: 3 }, { a: -110, b: 110, n: 2, delay: 0.3 });
    const stLow = stretchBox(id, 'sb', { x: 260, y: 236, w: 120, h: 30, rx: 15, stroke: C.orange, sw: 7 }, { a: -110, b: 110, n: 2, delay: 0.3 });
    css += stTop.css + stLow.css;
    body += at(1, 'pop', `<g class="top">${stTop.body}`
      + `<g class="c1">${text(300, 118, '기', { size: 38 })}</g><g class="c2">${text(340, 118, '뻐', { size: 38 })}</g></g>`);
    const ix = [214, 256, 298, 340, 382, 424];
    body += `<g class="b2">` + ix.map((x, i) => g('fin fin2', text(x, 116, '이', { size: 30, color: C.muted }), 0.7 + i * 0.1)).join('') + '</g>';
    // 고무줄
    body += at(1, 'pop', `<g class="low">${stLow.body}`
      + `<g class="c1"><circle cx="260" cy="251" r="11" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g><g class="c2"><circle cx="380" cy="251" r="11" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g></g>`, 0.5);
    body += at(1, 'pop', tag(320, 306, '고무줄', ROLE.o, 20), 0.8);
    css += `.sc-${id} .c1, .sc-${id} .c2 { transition: transform 1.2s ease-in-out .3s; }
      .on2 .sc-${id} .c1 { transform: translateX(-128px); }
      .on2 .sc-${id} .c2 { transform: translateX(128px); }`;
    // 견주는 화살표: 고무줄 → 기뻐
    body += `<g class="b3"><path class="draw draw3 arw" pathLength="1" d="M500 251 Q562 251 562 178 Q562 104 504 104" stroke="${C.purple}" stroke-width="4.5" fill="none" stroke-linecap="round"/>${g('fin fin3', head(504, 104, Math.PI, C.purple, 4.5), 0.9)}</g>`;
    body += at(3, 'pop', `<g class="lk3">${tag(562, 178, '고무줄처럼', ROLE.x, 20)}</g>`, 1);
    body += at(4, 'pop', tag(84, 178, '빗대다', ROLE.x, 22), 0.5);
    css += `.on4 .sc-${id} .arw { animation: ${id}-flash 1.4s ease-in-out .2s both; }` + pulseCss(id, '.lk3 .tl', 4, 0.6);
    put(K + '4/빗대다', svg(id, body, css));
  })();

  // ── 4단원: 내성(항생제를 자꾸 받은 균이 몸을 바꾸어 버틴다) ──────────────────────────────
  (function () {
    const id = 't42-k2-naeseong';
    let css = base(id);
    const P = [[300, 96], [444, 84], [566, 150], [326, 236], [486, 250]];
    const live = [1, 3], dead = [0, 2, 4];
    const germ = (x, y, changed) => `<g transform="translate(${x} ${y})">`
      + `<path class="gf" d="M-26 0 q-7 -8 -14 0 q-7 8 -14 0" stroke="${changed ? C.purple : C.green}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + `<rect class="sh" x="-34" y="-23" width="68" height="46" rx="23" fill="none" stroke="${C.purple}" stroke-width="3.5" stroke-dasharray="7 5"${changed ? '' : ' opacity="0"'}/>`
      + `<rect class="gb" x="-26" y="-15" width="52" height="30" rx="15" fill="${changed ? C.lilac : C.mint}" stroke="${changed ? C.purple : C.green}" stroke-width="3"/>`
      + `<circle class="gd" cx="-8" cy="-3" r="3.5" fill="${changed ? C.purple : C.green}"/><circle class="gd" cx="8" cy="4" r="3.5" fill="${changed ? C.purple : C.green}"/></g>`;
    let body = '';
    body += P.map(([x, y], i) => `<g class="gm gm${i}">` + at(1, 'pop', germ(x, y, false), i * 0.12) + '</g>').join('');
    // 항생제 알약
    const pill = `<g transform="translate(110 186)"><rect x="-36" y="-15" width="72" height="30" rx="15" fill="white" stroke="${C.orange}" stroke-width="3"/><path d="M0 -15 H-21 A15 15 0 0 0 -21 15 H0 Z" fill="${C.orange}"/></g>`;
    body += at(1, 'slide', `<g class="pl">${pill}</g>`, 0.2) + at(1, 'pop', tag(110, 136, '항생제', ROLE.o, 20), 0.4);
    // 칸 1: 몇몇 균이 죽는다
    body += `<g class="b1 h2">` + dead.map((i) => g('pop pop1', cross(P[i][0], P[i][1], 10), 1.2 + i * 0.1)).join('') + '</g>';
    css += `.sc-${id} .gm { transform-box: fill-box; transform-origin: center; transition: opacity .6s ease, transform .6s ease; }
      ${dead.map((i) => `.on1 .sc-${id} .gm${i} { opacity: 0; transform: scale(.4); transition-delay: 2s; }`).join('\n')}`;
    // 칸 2: 남은 균이 몸을 바꾼다
    css += `.sc-${id} .gb, .sc-${id} .gd, .sc-${id} .gf, .sc-${id} .sh { transition: fill .6s ease, stroke .6s ease, opacity .6s ease; }
      ${live.map((i) => `.on2 .sc-${id} .gm${i} .gb { fill: ${C.lilac}; stroke: ${C.purple}; transition-delay: 1.8s; }
      .on2 .sc-${id} .gm${i} .gd { fill: ${C.purple}; transition-delay: 1.8s; }
      .on2 .sc-${id} .gm${i} .gf { stroke: ${C.purple}; transition-delay: 1.8s; }
      .on2 .sc-${id} .gm${i} .sh { opacity: 1; transition-delay: 2.1s; }`).join('\n')}`;
    // 알약이 균 쪽으로 밀고 나간다(칸 1은 한 번, 칸 2는 세 번, 칸 3은 두 번)
    css += `@keyframes ${id}-jab { 0%, 100% { transform: none; } 50% { transform: translateX(90px); } }
      .on1 .sc-${id} .pl { animation: ${id}-jab .8s ease-in-out .6s 1; }
      .on2 .sc-${id} .pl { animation: ${id}-jab .6s ease-in-out .1s 3; }
      .on3 .sc-${id} .pl { animation: ${id}-jab .7s ease-in-out .9s 2; }`;
    body += `<g class="b2">` + live.map((i) => `<circle class="ring ring2" cx="${P[i][0]}" cy="${P[i][1]}" r="30" fill="none" stroke="${C.orange}" stroke-width="3"/>`).join('') + '</g>';
    // 칸 3: 바뀐 균이 늘어나고, 알약이 와도 버틴다
    body += dead.map((i) => at(3, 'pop', germ(P[i][0], P[i][1], true), 0.2 + i * 0.12)).join('');
    css += live.map((i) => `.on3 .sc-${id} .gm${i} { animation: ${id}-pulse .6s ease-in-out 1.2s 2; }`).join('');
    body += at(3, 'pop', tag(444, 326, '내성균', ROLE.x, 20), 1.6);
    body += glowRect(250, 46, 370, 248, 4, C.purple, 0.2);
    body += at(4, 'pop', tag(110, 262, '내성', ROLE.x, 22), 0.4) + at(4, 'pop', tag(110, 306, '견디는 힘', ROLE.x, 19), 0.8);
    put(K + '4/내성', svg(id, body, css));
  })();

  // ── 5단원: 편지(석원이가 할머니께 쓴 편지) ──────────────────────────────
  // 추신: 편지 끝(쓴 사람) 아래에 덧붙는 자리
  (function () {
    const id = 't42-k2-chusin';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="140" y="14" width="360" height="332" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(1, 'fin', text(162, 50, '사랑하는 할머니께', { size: 19, anchor: 'start' }), 0.2);
    body += at(1, 'fin', [78, 98, 118, 138, 158, 178, 198].map((y, i) => bar(i === 0 || i === 4 ? 176 : 162, y, i === 3 ? 200 : (i === 6 ? 150 : (i === 0 || i === 4 ? 302 : 316)))).join(''), 0.5);
    body += at(1, 'fin', text(480, 234, '20○○년 ○○월 ○○일', { size: 18, anchor: 'end', color: C.muted }), 0.8);
    body += at(1, 'fin', text(480, 266, '손자 지석원 올림', { size: 19, anchor: 'end' }), 1);
    body += `<g class="h3">${glowRect(316, 244, 172, 32, 1, C.green, 1.4, 8)}</g>`;
    // 추신 띠
    body += `<g class="b2"><g class="ps"><rect x="152" y="288" width="336" height="46" rx="10" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/>`
      + text(166, 318, '추신:', { size: 20, anchor: 'start', color: C.orange }) + bar(226, 311, 244, '#d9b98a', 9) + '</g></g>';
    css += `.sc-${id} .ps { transform: translateY(40px); opacity: 0; transition: transform .8s ease-out .3s, opacity .6s ease .3s; }
      .on2 .sc-${id} .ps { transform: none; opacity: 1; }`;
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M496 262 Q536 262 536 286 Q536 311 500 311" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round" style="transition-delay:1s"/>${g('fin fin2', head(500, 311, Math.PI, C.orange, 4), 1.9)}</g>`;
    body += at(2, 'pop', tag(572, 228, '덧붙임', ROLE.o, 19), 1.9);
    body += glowRect(148, 284, 344, 54, 3, C.orange, 0.2, 12) + at(3, 'pop', tag(78, 311, '추신', ROLE.y, 22), 0.5);
    put(K + '5/추신', svg(id, body, css));
  })();

  // 짜임: 받는 사람·첫인사·전하고 싶은 말·끝인사·쓴 날짜·쓴 사람이 차례로 놓인다
  (function () {
    const id = 't42-k2-jjaim';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="24" y="24" width="330" height="322" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    const parts = [
      ['받는 사람', 60, 30, ROLE.s], ['첫인사', 98, 30, ROLE.o], ['전하고 싶은 말', 168, 108, ROLE.p],
      ['끝인사', 242, 30, ROLE.x], ['쓴 날짜', 278, 30, ROLE.y], ['쓴 사람', 314, 30, ROLE.s]
    ];
    const cols = [C.sky, C.peach, C.mint, C.lilac, TAN, C.sky];
    // 색 띠(칸 2·3에 나타남)
    parts.forEach(([, y, h], k) => {
      body += `<g class="b${k < 3 ? 2 : 3}"><rect class="bd bd${k}" x="32" y="${y - h / 2}" width="314" height="${h}" rx="8" fill="${cols[k]}" style="transition-delay:${(k % 3) * 0.6}s"/></g>`;
    });
    css += `.sc-${id} .bd { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out; }
      .on2 .sc-${id} .bd0, .on2 .sc-${id} .bd1, .on2 .sc-${id} .bd2, .on3 .sc-${id} .bd3, .on3 .sc-${id} .bd4, .on3 .sc-${id} .bd5 { transform: none; }`;
    body += at(1, 'fin', text(44, 67, '사랑하는 할머니께', { size: 19, anchor: 'start' }), 0.2);
    body += at(1, 'fin', text(44, 105, '할머니, 안녕하세요?', { size: 19, anchor: 'start' }), 0.4);
    body += at(1, 'fin', [126, 147, 168, 189, 210].map((y, i) => bar(i === 0 ? 60 : 44, y, i === 4 ? 170 : (i === 0 ? 270 : 286))).join(''), 0.6);
    body += at(1, 'fin', text(44, 249, '안녕히 계세요.', { size: 19, anchor: 'start' }), 0.8);
    body += at(1, 'fin', text(336, 285, '20○○년 ○○월 ○○일', { size: 18, anchor: 'end', color: C.muted }), 1);
    body += at(1, 'fin', text(336, 321, '손자 지석원 올림', { size: 19, anchor: 'end' }), 1.2);
    // 이름표
    parts.forEach(([label, y, , col], k) => {
      const n = k < 3 ? 2 : 3, d = 0.3 + (k % 3) * 0.6;
      const w = wOf(label, 18) + 4;
      body += at(n, 'slide', `<path d="M358 ${y} H${458 - w / 2 - 4}" stroke="${col[1]}" stroke-width="2.5" stroke-dasharray="5 5"/>` + `<g class="pt pt${k}">${tag(458, y, label, col, 18)}</g>`, d);
    });
    body += at(4, 'fin', braceR(546, 44, 330, C.green), 0.2) + at(4, 'pop', tag(594, 187, '짜임', ROLE.p, 22), 0.6);
    css += parts.map((_, k) => pulseCss(id, `.pt${k} .tl`, 4, 0.3 + k * 0.2)).join('');
    put(K + '5/짜임', svg(id, body, css));
  })();

  // ── 5단원: 높임 표현(밥→진지, 있다→계시다, 가다→가시다) ──────────────────────────────
  (function () {
    const id = 't42-k2-nopim';
    let css = base(id);
    let body = at(1, 'pop', person(84, 196, C.purple, 20)) + at(1, 'pop', tag(84, 262, '할머니께', ROLE.x, 19), 0.3);
    const ys = [90, 180, 270];
    const plain = ['밥', '있다', '가다'];
    body += plain.map((w, i) => at(1, 'rise', tile(244, ys[i], w, { size: 28, w: 120 }), 0.4 + i * 0.25)).join('');
    // 칸 2: 낱말이 바뀐다
    body += drawArrow(312, ys[0], 372, ys[0], C.green, 2, { delay: 0.2 }) + at(2, 'pop', tile(460, ys[0], '진지', { size: 28, w: 150, fill: C.mint, stroke: C.green }), 1);
    body += drawArrow(312, ys[1], 372, ys[1], C.green, 2, { delay: 0.8 }) + at(2, 'pop', tile(460, ys[1], '계시다', { size: 28, w: 150, fill: C.mint, stroke: C.green }), 1.6);
    // 칸 3: 가다 사이에 '시'가 들어간다
    body += drawArrow(312, ys[2], 372, ys[2], C.green, 3, { delay: 0.1 });
    body += at(3, 'pop', `<rect x="385" y="${ys[2] - 28}" width="150" height="56" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
      + `<g class="ga">${text(430, ys[2] + 10, '가', { size: 28 })}</g><g class="da">${text(490, ys[2] + 10, '다', { size: 28 })}</g>`, 0.7);
    body += at(3, 'drop', text(460, ys[2] + 10, '시', { size: 30, color: C.orange }), 1.5);
    body += `<g class="b3"><circle class="ring ring3" cx="460" cy="${ys[2]}" r="20" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:1.8s"/></g>`;
    css += move(id, 'ga', 'translateX(16px)', 3, { delay: 1.0, dur: 0.5 }) + move(id, 'da', 'translateX(-16px)', 3, { delay: 1.0, dur: 0.5 });
    body += glowRect(378, 54, 164, 252, 4, C.green, 0.2) + at(4, 'pop', tag(460, 28, '높임 표현', ROLE.p, 22), 0.5);
    put(K + '5/높임 표현', svg(id, body, css));
  })();

  // ── 5단원: 편지봉투(우편 번호·귀하) ──────────────────────────────
  const envelope = ({ name, digits = true, digitStep = 0 }) => {
    let s = `<rect x="24" y="30" width="400" height="300" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    s += `<rect x="344" y="46" width="62" height="72" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="390" cy="62" r="7" fill="${C.orange}" opacity=".7"/><path d="M350 110 L366 82 L377 96 L389 76 L402 110 Z" fill="${C.orange}" opacity=".55"/>`;
    s += text(46, 64, '보내는 사람', { size: 18, color: C.muted, anchor: 'start' }) + bar(46, 90, 190, '#a9bab3', 9) + text(46, 126, '장영실 올림', { size: 20, anchor: 'start' });
    s += text(206, 204, '받는 사람', { size: 18, color: C.muted, anchor: 'start' }) + bar(206, 228, 196, '#a9bab3', 9) + text(206, 264, name, { size: 20, anchor: 'start' });
    return s;
  };
  const codeBoxes = (x0, y, code, { n = 0, delay = 0, cls = '' } = {}) => {
    let s = '';
    [...code].forEach((d, i) => {
      const x = x0 + i * 36;
      s += `<rect x="${x}" y="${y}" width="30" height="34" rx="4" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`;
    });
    const digitsSvg = [...code].map((d, i) => {
      const t = text(x0 + i * 36 + 15, y + 25, d, { size: 21, color: C.ink });
      return n ? at(n, 'pop', t, delay + i * 0.25) : t;
    }).join('');
    return `<g class="${cls}">${s}${digitsSvg}</g>`;
  };

  (function () {
    const id = 't42-k2-upyeon';
    let css = base(id);
    let body = at(1, 'fin', envelope({ name: '세종 대왕 님께' }));
    body += at(1, 'fin', codeBoxes(46, 144, '31529') + codeBoxes(206, 282, '02456'), 0.6);
    // 칸 2: 다섯 자리 숫자를 채운다
    body += [...'31529'].map((d, i) => at(2, 'pop', text(46 + i * 36 + 15, 169, d, { size: 21 }), 0.2 + i * 0.2)).join('');
    body += [...'02456'].map((d, i) => at(2, 'pop', text(206 + i * 36 + 15, 307, d, { size: 21, color: C.orange }), 1.3 + i * 0.25)).join('');
    body += glowRect(200, 276, 186, 46, 2, C.orange, 2.6, 8);
    // 칸 3: 번호 칸으로 나누어 담는다
    const bins = [['02', 84], ['31', 178], ['47', 272]];
    body += bins.map(([label, y], i) => at(3, 'fin', `<rect x="458" y="${y - 30}" width="158" height="60" rx="10" fill="${C.sky}" opacity=".7" stroke="${C.blue}" stroke-width="2.5"/>` + text(492, y + 8, label, { size: 24, color: C.blue }), i * 0.15)).join('');
    const mail = (code) => `<rect x="-38" y="-18" width="76" height="36" rx="5" fill="white" stroke="${C.orange}" stroke-width="2.5"/>` + text(0, 7, code, { size: 18, color: C.orange });
    body += `<g class="b3"><g class="ml ml0"><g transform="translate(562 84)">${mail('02456')}</g></g><g class="ml ml1"><g transform="translate(562 178)">${mail('31007')}</g></g><g class="ml ml2"><g transform="translate(562 272)">${mail('47012')}</g></g></g>`;
    css += `.sc-${id} .ml { opacity: 0; transition: transform .9s ease-in-out, opacity .3s ease; }
      .sc-${id} .ml0 { transform: translate(-264px, 217px); }
      .sc-${id} .ml1 { transform: translate(0, -150px); }
      .sc-${id} .ml2 { transform: translate(0, -150px); }
      .on3 .sc-${id} .ml { opacity: 1; transform: none; }
      .on3 .sc-${id} .ml0 { transition-delay: .4s; } .on3 .sc-${id} .ml1 { transition-delay: .9s; } .on3 .sc-${id} .ml2 { transition-delay: 1.2s; }`;
    body += glowRect(200, 276, 186, 46, 4, C.orange, 0.1, 8) + at(4, 'pop', tag(536, 334, '우편 번호', ROLE.y, 22), 0.5);
    put(K + '5/우편 번호', svg(id, body, css));
  })();

  (function () {
    const id = 't42-k2-gwiha';
    let css = base(id);
    let body = at(1, 'fin', envelope({ name: '세종 대왕' }) + codeBoxes(46, 144, '31529') + codeBoxes(206, 282, '02456'));
    body += `<g class="b1 h2"><rect class="flash flash1" style="animation-delay:.6s" x="302" y="242" width="74" height="36" rx="8" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="7 6"/></g>`;
    body += at(2, 'drop', `<g class="gw">${tile(339, 258, '귀하', { size: 22, h: 38, w: 74, fill: C.mint, stroke: C.green })}</g>`, 0.3);
    body += `<g class="b2"><circle class="ring ring2" cx="339" cy="258" r="34" fill="none" stroke="${C.green}" stroke-width="3" style="animation-delay:.9s"/></g>`;
    // 칸 3: 친구와 높여야 할 분
    body += at(3, 'pop', tag(526, 72, '친구', ROLE.s, 20), 0.2) + at(3, 'pop', tile(486, 120, '앞', { size: 20, h: 40 }), 0.5) + at(3, 'pop', tile(556, 120, '에게', { size: 20, h: 40 }), 0.7);
    body += at(3, 'pop', tag(526, 196, '웃어른', ROLE.p, 20), 1.2) + at(3, 'pop', `<g class="gw2">${tile(486, 244, '귀하', { size: 20, h: 40, fill: C.mint, stroke: C.green })}</g>`, 1.5) + at(3, 'pop', tile(556, 244, '님께', { size: 20, h: 40 }), 1.7);
    body += `<g class="b3"><path d="M446 158 H606" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/></g>`;
    css += pulseCss(id, '.gw2 .tl', 3, 2);
    body += glowRect(296, 233, 86, 50, 4, C.green, 0.1, 10);
    css += pulseCss(id, '.gw .tl', 4, 0.3);
    body += at(4, 'pop', tag(526, 316, '귀하', ROLE.p, 22), 0.5);
    put(K + '5/귀하', svg(id, body, css));
  })();

  // ── 5단원: 표어(긴 예절 목록이 짧은 글귀로) ──────────────────────────────
  (function () {
    const id = 't42-k2-pyoeo';
    let css = base(id);
    let memo = `<rect x="24" y="40" width="262" height="280" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(155, 74, '온라인 대화 예절', { size: 19 }) + `<path d="M44 88 H266" stroke="${C.line}" stroke-width="2"/>`;
    const ly = [112, 138, 164, 190, 216, 242, 268, 294];
    const lines = ly.map((y, i) => `<g class="mb" style="transition-delay:${0.1 + i * 0.08}s"><circle cx="50" cy="${y}" r="4" fill="${C.muted}"/>${bar(62, y, i % 3 === 2 ? 150 : 200 - (i % 2) * 24)}</g>`).join('');
    let body = `<g class="dim dim4">` + at(1, 'fin', memo) + at(1, 'fin', lines, 0.3) + '</g>';
    css += `.sc-${id} .mb { transform-box: fill-box; transform-origin: left center; transition: transform .7s ease-in, opacity .7s ease; }
      .on2 .sc-${id} .mb { transform: scaleX(.25); opacity: .35; }`;
    body += drawArrow(294, 170, 340, 170, C.orange, 2, { delay: 0.6 });
    body += at(2, 'pop', `<rect x="350" y="70" width="266" height="200" rx="14" fill="${TAN}" stroke="${C.orange}" stroke-width="4"/>`
      + `<text x="483" y="150" text-anchor="middle" font-size="38" font-weight="800" fill="${C.ink}"><tspan class="pa">고운</tspan> 말,</text>`
      + `<text x="483" y="214" text-anchor="middle" font-size="38" font-weight="800" fill="${C.ink}"><tspan class="pa">고운</tspan> 대화방</text>`, 1.2);
    css += `.sc-${id} .pa { transition: fill .5s ease .3s; } .on3 .sc-${id} .pa { fill: ${C.orange}; }`;
    // 칸 3: 지나가며 한눈에 본다
    const ex = [404, 483, 562];
    body += ex.map((x, i) => at(3, 'pop', eye(x, 316, C.blue), 0.6 + i * 0.2)).join('');
    body += `<g class="b3">` + ex.map((x, i) => `<path class="draw draw3" pathLength="1" d="M${x} 294 L${x + (483 - x) * 0.3} 276" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round" style="transition-delay:${1 + i * 0.2}s"/>`).join('') + '</g>';
    body += `<g class="b3"><rect class="flash flash3" x="406" y="114" width="90" height="46" rx="8" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:.3s"/><rect class="flash flash3" x="375" y="178" width="90" height="46" rx="8" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:.3s"/></g>`;
    body += glowRect(344, 64, 278, 212, 4, C.orange, 0.2) + at(4, 'pop', tag(155, 340, '표어', ROLE.y, 22), 0.5);
    put(K + '5/표어', svg(id, body, css));
  })();

  // ── 6단원: 원인과 결과(세린이 — 추운 날 얇은 옷 → 감기) ──────────────────────────────
  const causeScene = (focus) => {
    const id = focus === 'w' ? 't42-k2-wonin' : 't42-k2-gyeolgwa';
    let css = base(id);
    const card = (x) => `<rect x="${x}" y="64" width="250" height="210" rx="16" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    // 원인 카드: 눈송이와 얇은 옷
    const flake = (x, y, r) => `<g stroke="${C.blue}" stroke-width="3.5" stroke-linecap="round">` + [0, 60, 120].map((a) => { const c = Math.cos(a * Math.PI / 180) * r, s = Math.sin(a * Math.PI / 180) * r; return `<path d="M${f(x - c)} ${f(y - s)} L${f(x + c)} ${f(y + s)}"/>`; }).join('') + '</g>';
    const shirt = `<path d="M128 118 L108 128 L92 152 L110 162 L120 148 L120 210 L190 210 L190 148 L200 162 L218 152 L202 128 L182 118 Q155 134 128 118 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`;
    let body = `<g class="wc">` + at(1, 'fin', card(30) + shirt);
    body += `<g class="b1">` + [[60, 92, 12, 0.3], [246, 104, 10, 0.6], [236, 196, 9, 0.9]].map(([x, y, r, d]) => g('drop drop1', flake(x, y, r), d)).join('') + '</g>';
    body += at(1, 'pop', tile(155, 244, '추운 날 얇은 옷', { size: 20, h: 40, fill: C.sky, stroke: C.blue }), 1.1) + '</g>';
    // 결과 카드: 열이 오르는 온도계와 아픈 얼굴
    const R = `${card(360)}<rect x="404" y="98" width="22" height="100" rx="11" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="415" cy="204" r="16" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>`
      + `<g class="mc"><rect x="409" y="112" width="10" height="84" rx="5" fill="${C.red}"/></g>`
      + `<circle cx="520" cy="150" r="46" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="M496 140 q8 -7 16 0 M528 140 q8 -7 16 0" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
      + `<circle cx="496" cy="160" r="7" fill="${C.red}" opacity=".35"/><circle cx="544" cy="160" r="7" fill="${C.red}" opacity=".35"/>`
      + `<path d="M508 176 q6 -6 12 0 q6 6 12 0" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + `<path d="M568 116 q6 10 0 16 q-6 -6 0 -16 Z" fill="${C.blue}" opacity=".7"/>`;
    body += drawArrow(288, 170, 350, 170, C.muted, 2, { delay: 0.1 });
    body += `<g class="gc">` + at(2, 'fin', R, 0.9) + at(2, 'pop', tile(485, 244, '감기', { size: 22, h: 40, fill: C.peach, stroke: C.orange }), 1.8) + '</g>';
    css += `.sc-${id} .mc { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(.2); transition: transform 1.2s ease-out 1.2s; }
      .on2 .sc-${id} .mc { transform: none; }`;
    // 칸 3: 거슬러 묻기(원인) / 따라가기(결과)
    if (focus === 'w') body += curve(485, 58, 155, 58, 24, C.orange, 3, { width: 4.5 }) + at(3, 'pop', tag(320, 28, '왜?', ROLE.y, 20), 0.9);
    else body += curve(155, 58, 485, 58, 24, C.orange, 3, { width: 4.5 }) + at(3, 'pop', tag(320, 28, '그래서', ROLE.y, 20), 0.9);
    const on = focus === 'w' ? 0 : 1;
    const tags = [['원인', 155], ['결과', 485]];
    body += tags.map(([label, x], k) => `<g class="${k === on ? '' : 'dim dim4'}">` + at(3, 'pop', `<g class="ct ct${k}">${tag(x, 318, label, ['white', C.line], 22)}</g>`, 1.4) + '</g>').join('');
    css += paint(id, `.ct${on}`, ROLE.y, 3, 1.6) + pulseCss(id, `.ct${on} .tl`, 4, 0.4);
    css += `.sc-${id} .wc, .sc-${id} .gc { transition: opacity .6s ease; } .on4 .sc-${id} ${on ? '.wc' : '.gc'} { opacity: .3; }`;
    body += glowRect(on ? 356 : 26, 60, 258, 218, 4, C.orange, 0.2, 18);
    put(K + '6/' + (focus === 'w' ? '원인' : '결과'), svg(id, body, css));
  };
  causeScene('w');
  causeScene('g');

  // ── 6단원: 흐름(실베스터 이야기 — 사건 구슬이 실에 꿰어 이어진다) ──────────────────────────────
  (function () {
    const id = 't42-k2-heureum';
    let css = base(id);
    const B = [[80, 166, '조약돌 찾기', C.red], [210, 248, '비가 멈춤', C.blue], [340, 166, '사자 만남', C.orange], [470, 248, '바위가 됨', C.muted], [576, 166, '뒷이야기', C.purple]];
    const seg = (a, b) => `M${a[0]} ${a[1]} C${a[0] + 62} ${a[1]} ${b[0] - 62} ${b[1]} ${b[0]} ${b[1]}`;
    const segG = (d, n, delay, dash = '') => `<g class="b${n}"><path class="draw draw${n} th" pathLength="1" d="${d}" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round" style="transition-delay:${delay}s"/></g>`;
    const bead = (k, n, delay) => {
      const [x, y, label, col] = B[k];
      const ty = y < 200 ? y - 50 : y + 50;
      return at(n, 'pop', `<g class="bd bd${k}"><circle cx="${x}" cy="${y}" r="16" fill="${col}" stroke="white" stroke-width="3"/></g>`, delay) + at(n, 'pop', tag(x, ty, label, ['white', col], 18), delay + 0.2);
    };
    // 실을 먼저 깔고 구슬을 위에 꿴다
    let body = segG(`M20 ${B[0][1]} H${B[0][0]}`, 1, 0.1) + segG(seg(B[0], B[1]), 2, 0.1) + segG(seg(B[1], B[2]), 2, 1.1) + segG(seg(B[2], B[3]), 3, 0.1);
    body += `<g class="b3">${g('fin fin3', `<path d="${seg(B[3], B[4])}" stroke="${C.purple}" stroke-width="4" fill="none" stroke-dasharray="8 8"/>`, 1.1)}</g>`;
    body += bead(0, 1, 0.8) + bead(1, 2, 0.9) + bead(2, 2, 1.9) + bead(3, 3, 0.9);
    // 이어질 일: 물음표 구슬
    body += at(3, 'pop', `<g class="q"><circle cx="${B[4][0]}" cy="${B[4][1]}" r="22" fill="white" stroke="${C.purple}" stroke-width="3" stroke-dasharray="6 5"/>${text(B[4][0], B[4][1] + 9, '?', { size: 26, color: C.purple })}</g>`, 1.4) + at(3, 'pop', tag(B[4][0], B[4][1] - 54, '뒷이야기', ROLE.x, 18), 1.6);
    css += `.on3 .sc-${id} .q { animation: ${id}-pulse .8s ease-in-out 1.9s 3; transform-box: fill-box; transform-origin: center; }`;
    css += `.sc-${id} .th { transition-property: stroke-dashoffset, stroke; } .on4 .sc-${id} .th { stroke: ${C.green}; }`;
    css += [0, 1, 2, 3].map((k) => pulseCss(id, `.bd${k}`, 4, 0.2 + k * 0.3)).join('');
    body += at(4, 'pop', tag(340, 334, '흐름', ROLE.p, 22), 1.3);
    put(K + '6/흐름', svg(id, body, css));
  })();

  // ── 6단원: 중심 사건(얼룩말이 주택가에 나타났다 — 앞뒤 일이 모두 이 일에 이어진다) ──────────────────────────────
  (function () {
    const id = 't42-k2-jungsim';
    let css = base(id);
    const house = (x, w, h, fill, stroke) => `<path d="M${x - w / 2} 236 V${236 - h} L${x} ${236 - h - w * 0.45} L${x + w / 2} ${236 - h} V236 Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/><rect x="${x - 9}" y="${236 - 28}" width="18" height="28" fill="${stroke}" opacity=".5"/>`;
    const zebra = `<defs><clipPath id="${id}-z"><rect x="-46" y="-22" width="86" height="44" rx="22"/></clipPath></defs>`
      + `<path d="M-46 -8 q-14 6 -10 26" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + [-32, -18, 16, 28].map((x) => `<path d="M${x} 14 V52" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`).join('')
      + `<rect x="-46" y="-22" width="86" height="44" rx="22" fill="white"/>`
      + `<g clip-path="url(#${id}-z)">` + [-36, -22, -8, 6, 20, 34].map((x) => `<path d="M${x} -24 q6 12 0 24 q-6 12 0 24" stroke="${C.ink}" stroke-width="6" fill="none"/>`).join('') + '</g>'
      + `<rect x="-46" y="-22" width="86" height="44" rx="22" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M24 -14 L42 -48 L60 -42 L40 -2 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M30 -24 L48 -32 M34 -12 L52 -20" stroke="${C.ink}" stroke-width="4"/>`
      + `<path d="M26 -18 L42 -52" stroke="${C.ink}" stroke-width="6" stroke-dasharray="4 3"/>`
      + `<ellipse cx="62" cy="-44" rx="22" ry="12" transform="rotate(24 62 -44)" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<circle cx="78" cy="-36" r="7" fill="${C.ink}"/><circle cx="56" cy="-50" r="3" fill="${C.ink}"/>`
      + `<path d="M48 -56 L44 -72 L54 -58" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    // 가운데: 주택가와 얼룩말
    const ctr = `<rect x="190" y="50" width="260" height="226" rx="16" fill="${C.sky}" opacity=".55"/><rect x="190" y="50" width="260" height="226" rx="16" fill="none" stroke="${C.blue}" stroke-width="3"/>`
      + house(236, 62, 62, C.peach, C.orange) + house(404, 58, 74, 'white', C.muted) + `<path d="M196 236 H444" stroke="${C.green}" stroke-width="4"/>`;
    let body = `<g class="ctr">` + at(1, 'fin', ctr) + `<g class="b1"><g class="zb"><g transform="translate(318 186)">${zebra}</g></g></g>` + '</g>';
    css += move(id, 'zb', 'translateX(-90px)', 1, { dur: 1.4, delay: 0.5 }) + `.sc-${id} .zb { opacity: 0; } .on1 .sc-${id} .zb { opacity: 1; }`;
    body += `<g class="ctr">` + at(1, 'pop', tile(320, 312, '주택가에 나타난 얼룩말', { size: 20, h: 42, fill: 'white', stroke: C.blue }), 1.8) + '</g>';
    // 칸 2: 앞의 일, 뒤의 일
    const side = (x, label, d) => at(2, 'pop', `<rect x="${x - 52}" y="112" width="104" height="140" rx="12" fill="white" stroke="${C.muted}" stroke-width="3" stroke-dasharray="8 6"/>` + text(x, 198, '?', { size: 46, color: C.muted }) + text(x, 98, label, { size: 18, color: C.muted }), d);
    body += side(74, '앞의 일', 0.2) + side(566, '뒤의 일', 0.8);
    body += `<g class="lk">` + drawArrow(132, 184, 182, 184, C.orange, 2, { delay: 0.5 }) + drawArrow(458, 184, 508, 184, C.orange, 2, { delay: 1.1 }) + '</g>';
    body += at(2, 'fin', text(156, 162, '원인', { size: 18, color: C.orange }), 0.6) + at(2, 'fin', text(484, 162, '결과', { size: 18, color: C.orange }), 1.2);
    // 칸 3: 가운데 일을 빼 보면 이어지지 않는다(칸 4에 돌아온다)
    body += `<g class="b3 h4">${g('pop pop3', cross(156, 214, 9), 1)}${g('pop pop3', cross(484, 214, 9), 1.2)}</g>`;
    css += `.sc-${id} .ctr { transition: opacity .7s ease .2s, transform .7s ease .2s; }
      .on3 .sc-${id} .ctr { opacity: .18; transform: translateY(-14px); }
      .on4 .sc-${id} .ctr { opacity: 1; transform: none; }
      .on3 .sc-${id} .lk { animation: ${id}-shake .5s ease-in-out .9s 2; }`;
    body += glowRect(184, 44, 272, 238, 4, C.blue, 0.6, 18) + at(4, 'drop', tag(320, 24, '중심 사건', ROLE.s, 22), 0.9);
    put(K + '6/중심 사건', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
