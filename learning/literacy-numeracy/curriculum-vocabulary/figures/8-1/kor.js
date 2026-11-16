// 국어 8-1(중학교 2학년 1학기) 낱말 도식 첫째 묶음:
// 1단원 화자·서술자·시점과 네 시점(서술자가 이야기 안/밖 × 속마음까지/겉모습만 판), 2단원 설명 방법(같은 자전거 하나로 정의·비교·대조·분류·구분·분석·인과),
// 3단원 논증·전제·귀납·연역·반박. 4~6단원은 kor-2.js.
// 도구(tile·tag·row·base·move 따위)는 figures/7-1/kor.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 움직임은 transform·opacity·stroke-dashoffset(과 색 바꾸기)만 쓴다. 칸마다 움직임은 2.2초 안에 끝낸다.
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
  const heart = (x, y, s = 0.22, col = C.red) => `<path d="${heartD(x, y, s)}" fill="${col}"/>`;
  const qBadge = (x, y, r = 12, col = C.purple) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${col}" stroke-width="2.5"/>` + text(x, f(y + 6.5), '?', { size: 18, color: col });
  // 점선 눈길 화살표(바라봄)
  const look = (x1, y1, x2, y2, col = C.purple, w = 2.5) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${col}" stroke-width="${w}" stroke-dasharray="5 4" fill="none" stroke-linecap="round"/>` + head(x2, y2, Math.atan2(y2 - y1, x2 - x1), col, w);
  const neq = (x, y, col = C.red) => `<path d="M${x - 14} ${y - 6} H${x + 14} M${x - 14} ${y + 6} H${x + 14} M${x + 7} ${y - 15} L${x - 7} ${y + 15}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
  const eqSign = (x, y, col = C.green) => `<path d="M${x - 14} ${y - 6} H${x + 14} M${x - 14} ${y + 6} H${x + 14}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
  const pen = (x, y, d = 1) => `<path d="M${x} ${y} L${x + 26 * d} ${y - 26}" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/><path d="M${x} ${y} L${x + 5 * d} ${y - 5}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`;

  // ═════ 1단원: 시점 판(서술자가 이야기 안/밖 × 속마음까지/겉모습만) ═════
  // 작은 장면: 점선 틀이 이야기, 노란 받침 위가 주인공, 보라가 서술자. (0,0) 기준, 칸에 넣을 때 translate.
  const AX = -10, BX = 70, NX = -95, SY = 9, PR = 14;
  const spot = (x) => `<ellipse cx="${x}" cy="34" rx="27" ry="6" fill="${C.yellow}" opacity=".85"/>`;
  const me = (x) => person(x, SY, C.purple, PR) + text(x, SY + 17, '나', { size: 18, color: 'white' });
  const FRAME = `<rect x="-64" y="-56" width="176" height="96" rx="14" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="8 6"/>`;
  const POV = {
    ju: { col: 0, row: 0, name: '1인칭 주인공 시점' }, gw1: { col: 1, row: 0, name: '1인칭 관찰자 시점' },
    jeon: { col: 0, row: 1, name: '전지적 작가 시점' }, gw3: { col: 1, row: 1, name: '3인칭 관찰자 시점' }
  };
  const PCX = [250, 508], PCY = [124, 276];
  // 칸 안에서 장면을 놓는 x 어긋남(이야기 안 줄은 서술자가 틀 밖에 없어서 틀을 가운데로)
  const pdx = (kind) => (POV[kind].row === 0 ? -24 : 0);
  // 장면 조각: fr(틀), cast(인물), nr(서술자 — 들어오는 움직임용), ind(속마음·눈길)
  const miniParts = (kind) => {
    if (kind === 'ju') return { cast: person(BX, SY, C.orange, PR), nr: spot(AX) + me(AX), ind: heart(AX, -40) };
    if (kind === 'gw1') return { cast: spot(BX) + person(BX, SY, C.blue, PR), nr: me(AX), ind: look(AX + 19, -14, BX - 21, -14) + qBadge(BX, -42) };
    const cast = spot(AX) + person(AX, SY, C.blue, PR) + person(BX, SY, C.orange, PR), nr = person(NX, SY, C.purple, PR);
    if (kind === 'jeon') return { cast, nr, ind: heart(AX, -40) + heart(BX, -40) + look(NX + 16, -22, AX - 18, -38) };
    return { cast, nr, ind: qBadge(AX, -42) + qBadge(BX, -42) + look(NX + 18, -14, AX - 20, -14) };
  };
  const ROWL = ['이야기 안', '이야기 밖'], ROWS = ['‘나’', '‘그’'], COLL = ['속마음까지', '겉모습만'];
  const boardFrame = () => {
    let s = '';
    [0, 1].forEach((r) => [0, 1].forEach((c) => { s += `<rect x="${PCX[c] - 124}" y="${PCY[r] - 70}" width="248" height="140" rx="14" fill="${C.paper}" stroke="${C.line}" stroke-width="2.5"/>`; }));
    return s;
  };
  const colHead = (c) => `<g class="ch${c}">${tile(PCX[c], 30, COLL[c], { size: 19, h: 38, w: 150 })}</g>`;
  const rowHead = (r) => `<g class="rh${r}">${tile(63, PCY[r] - 12, ROWL[r], { size: 18, h: 38, w: 108 })}</g>` + text(63, PCY[r] + 32, ROWS[r], { size: 20, color: C.purple });

  // 낱말 하나: 큰 장면(칸 1·2) → 판의 제 칸으로 줄어들며 들어감(칸 3) → 이름(칸 4)
  const povWord = (key, kind, nrFrom, tags) => {
    const id = 't81-k1-' + kind;
    let css = base(id);
    const P = POV[kind], cx = PCX[P.col], cy = PCY[P.row], dx = pdx(kind), k = 1.7, B = [320, 172];
    const big = (x, y) => [f(B[0] + k * (x + dx)), f(B[1] + k * y)];
    const m = miniParts(kind);
    let body = `<g class="b3">${g('fin fin3', boardFrame() + colHead(0) + colHead(1) + rowHead(0) + rowHead(1))}</g>`;
    body += `<g class="b1"><g class="mv"><g transform="translate(${cx + dx} ${cy})">${FRAME}${m.cast}<g class="nr">${m.nr}</g><g class="b2">${g('pop pop2', m.ind, 0.2)}</g></g></g></g>`;
    css += `.sc-${id} .mv { transform: translate(${f(B[0] - k * (cx + dx) + k * dx)}px, ${f(B[1] - k * cy)}px) scale(${k}); transition: transform 1s ease-in-out .2s; }
      .on3 .sc-${id} .mv { transform: none; }`;
    css += steps(id, 'nr', nrFrom, [[1, 'none', 0.5]], { box: false });
    // 큰 장면 아래 이름표(칸 3에서 장면이 줄어들면 사라진다)
    tags.forEach(([x, label, col], i) => { const [X] = big(x, 0); body += `<g class="h3">${at(1, 'rise', tag(X, 276, label, col, 19), 1.0 + i * 0.25)}</g>`; });
    // 칸 3: 제 줄·제 열 머리가 칠해진다
    css += paint(id, `.rh${P.row}`, PUR, 3, 0.9) + paint(id, `.ch${P.col}`, PUR, 3, 1.1);
    // 칸 4: 칸이 반짝이고 이름
    body += glowRect(cx - 124, cy - 70, 248, 140, 4, C.purple, 0.1, 14);
    body += at(4, 'pop', text(cx, cy + 62, P.name, { size: 19, color: C.purple }), 0.5);
    put(K + '1/' + key, svg(id, body, css));
  };
  povWord('1인칭 주인공 시점', 'ju', 'translate(0px, -80px)', [[AX, '서술자 · 주인공', PUR]]);
  povWord('1인칭 관찰자 시점', 'gw1', 'translate(-90px, 0px)', [[AX, '서술자', PUR], [BX, '주인공', ROLE.s]]);
  povWord('3인칭 관찰자 시점', 'gw3', 'translate(-60px, 0px)', [[NX, '서술자', PUR], [AX, '주인공', ROLE.s]]);
  povWord('전지적 작가 시점', 'jeon', 'translate(-60px, 0px)', [[NX, '서술자', PUR], [AX, '주인공', ROLE.s]]);

  // ── 1단원: 시점(판 전체 — 안/밖, 속마음/겉모습, 네 자리의 이름) ──────────────────────────────
  (function () {
    const id = 't81-k1-sijeom';
    let css = base(id);
    let body = boardFrame().replace(/<rect /g, '<rect class="cell" ');
    body = at(1, 'fin', body);
    [0, 1].forEach((r) => { body += at(1, 'slide', rowHead(r), 0.2 + r * 0.3); });
    Object.keys(POV).forEach((kind, i) => {
      const P = POV[kind], m = miniParts(kind);
      body += `<g transform="translate(${PCX[P.col] + pdx(kind)} ${PCY[P.row]})">${at(1, 'fin', FRAME + m.cast + m.nr, 0.4 + P.row * 0.3)}${at(2, 'pop', m.ind, 0.5 + P.col * 0.4)}</g>`;
      body += at(3, 'pop', text(PCX[P.col], PCY[P.row] + 62, P.name, { size: 19, color: C.purple }), 0.2 + i * 0.3);
    });
    [0, 1].forEach((c) => { body += at(2, 'drop', colHead(c), 0.1 + c * 0.4); });
    body += glowRect(126, 54, 506, 292, 4, C.purple, 0.1, 16);
    body += at(4, 'pop', tag(63, 30, '시점', ROLE.y, 22), 0.6);
    put(K + '1/시점', svg(id, body, css));
  })();

  // ── 1단원: 서술자(이야기 속 사건을 독자에게 들려주는 목소리 — 작가와 다를 수 있다) ──────────────────────────────
  (function () {
    const id = 't81-k1-seosul';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="232" y="34" width="236" height="178" rx="16" fill="white" stroke="${C.muted}" stroke-width="3" stroke-dasharray="9 7"/>`);
    body += at(1, 'pop', person(300, 160, C.blue, 20), 0.3) + at(1, 'pop', person(400, 160, C.orange, 20), 0.5);
    body += at(1, 'pop', sparkle(350, 84, 1.6), 0.9);
    // 칸 2: 서술자와 독자, 이야기가 건너간다
    body += at(2, 'slide', person(160, 160, C.purple, 20));
    body += at(2, 'fin', [0, 1, 2].map((i) => `<path d="M${188 + i * 10} ${100 - i * 4} q8 14 0 28" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join(''), 0.5);
    body += at(2, 'slideL', `${person(572, 160, C.green, 20)}<rect x="550" y="166" width="44" height="30" rx="4" fill="white" stroke="${C.green}" stroke-width="3"/><path d="M572 166 V196" stroke="${C.green}" stroke-width="2.5"/>`, 0.2);
    body += at(2, 'fin', text(572, 232, '독자', { size: 19, color: C.green }), 0.6);
    body += drawArrow(190, 262, 540, 262, C.purple, 2, { width: 4, delay: 0.5 });
    body += `<g class="b2"><g class="sc">${tile(230, 262, '이야기', { size: 19, h: 36, fill: C.lilac, stroke: C.purple })}</g></g>`;
    css += steps(id, 'sc', 'none', [[2, 'translateX(250px)', 0.6]], { box: false, dur: 1.2 });
    // 칸 3: 작가는 따로
    body += at(3, 'pop', person(62, 160, C.muted, 20) + pen(44, 176, -1), 0.1);
    body += at(3, 'fin', text(62, 232, '작가', { size: 19, color: C.muted }), 0.4);
    body += at(3, 'pop', neq(111, 140), 0.8);
    // 칸 4
    body += glowRect(124, 86, 74, 116, 4, C.purple, 0.1, 14);
    body += at(4, 'pop', tag(160, 232, '서술자', ROLE.y, 22), 0.6);
    put(K + '1/서술자', svg(id, body, css));
  })();

  // ── 1단원: 화자(시인이 쓴 시 속에서 강아지가 '나는 기다려요' 하고 말한다) ──────────────────────────────
  const dog = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `<path d="M${P(-30, -26)} Q${P(-52, -20)} ${P(-48, 14)} Q${P(-36, 22)} ${P(-30, -2)} Z" fill="${C.orange}"/>`
      + `<path d="M${P(30, -26)} Q${P(52, -20)} ${P(48, 14)} Q${P(36, 22)} ${P(30, -2)} Z" fill="${C.orange}"/>`
      + `<circle cx="${x}" cy="${y}" r="${f(36 * s)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<circle cx="${P(-13, -6).split(' ')[0]}" cy="${P(-13, -6).split(' ')[1]}" r="${f(4.5 * s)}" fill="${C.ink}"/><circle cx="${P(13, -6).split(' ')[0]}" cy="${P(13, -6).split(' ')[1]}" r="${f(4.5 * s)}" fill="${C.ink}"/>`
      + `<ellipse cx="${x}" cy="${f(y + 9 * s)}" rx="${f(7 * s)}" ry="${f(5 * s)}" fill="${C.ink}"/>`
      + `<path d="M${P(-9, 17)} Q${P(0, 25)} ${P(9, 17)}" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  };
  (function () {
    const id = 't81-k1-hwaja';
    let css = base(id);
    let body = at(1, 'pop', person(80, 176, C.muted, 22) + pen(100, 194));
    body += at(1, 'fin', text(80, 246, '시인', { size: 19, color: C.muted }), 0.3);
    body += at(1, 'fin', `<rect x="196" y="30" width="300" height="290" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + bar(236, 66, 120, C.ink, 10) + bar(236, 90, 210) + bar(236, 110, 180), 0.4);
    // 칸 2: 시 속의 강아지가 말한다
    body += at(2, 'pop', `<g class="dg">${dog(346, 226, 1.1)}</g>`, 0.1);
    body += at(2, 'rise', tile(346, 152, '나는 기다려요', { size: 22, h: 44, fill: C.lilac, stroke: C.purple }), 0.6);
    body += at(2, 'fin', `<path d="M346 174 L346 182" stroke="${C.purple}" stroke-width="3"/>`, 0.9);
    body += at(2, 'fin', [0, 1, 2].map((i) => `<path d="M${400 + i * 10} ${208 - i * 4} q8 14 0 28" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join(''), 1.0);
    // 칸 3: 시인과 다르다
    body += at(3, 'pop', neq(152, 150), 0.2);
    css += pulseCss(id, '.dg', 3, 0.5);
    // 칸 4
    body += glowRect(282, 180, 128, 94, 4, C.purple, 0.1, 16);
    body += at(4, 'pop', tag(346, 300, '화자', ROLE.y, 22), 0.6);
    put(K + '1/화자', svg(id, body, css));
  })();

  // ═════ 2단원: 설명 방법(같은 자전거 하나를 두고 방법마다 다른 화살표·묶음) ═════
  // 자전거: (x, y) 는 가운데, 바퀴 반지름 26s. 부분마다 class 를 달아 분석에서 떼어 낸다.
  const bike = (x, y, s = 1, parts = false) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    const w = (cx) => `<circle cx="${f(x + cx * s)}" cy="${f(y + 18 * s)}" r="${f(26 * s)}" fill="none" stroke="${C.ink}" stroke-width="${f(4 * s)}"/><circle cx="${f(x + cx * s)}" cy="${f(y + 18 * s)}" r="${f(4 * s)}" fill="${C.ink}"/>`;
    const sw = f(4.5 * s);
    const seg = {
      wb: w(-42), wf: w(42),
      fr: `<path d="M${P(-42, 18)} L${P(-4, 18)} L${P(28, -14)} L${P(-14, -14)} L${P(-4, 18)} M${P(-42, 18)} L${P(-14, -14)} M${P(28, -14)} L${P(42, 18)}" stroke="${C.blue}" stroke-width="${sw}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`,
      sd: `<path d="M${P(-14, -14)} L${P(-18, -26)} M${P(-30, -28)} L${P(-6, -28)}" stroke="${C.ink}" stroke-width="${sw}" stroke-linecap="round"/>`,
      hd: `<path d="M${P(28, -14)} L${P(24, -32)} L${P(38, -36)}" stroke="${C.ink}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
      pd: `<circle cx="${f(x - 4 * s)}" cy="${f(y + 18 * s)}" r="${f(8 * s)}" fill="white" stroke="${C.orange}" stroke-width="${f(3.5 * s)}"/><path d="M${P(-4, 18)} L${P(4, 30)} M${P(-2, 30)} L${P(12, 30)}" stroke="${C.orange}" stroke-width="${f(4 * s)}" stroke-linecap="round"/>`
    };
    if (parts) return seg;
    return seg.wb + seg.wf + seg.fr + seg.sd + seg.hd + seg.pd;
  };
  const kick = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `<path d="M${P(-46, 30)} H${P(30, 30).split(' ')[0]}" stroke="${C.purple}" stroke-width="${f(7 * s)}" stroke-linecap="round"/>`
      + `<path d="M${P(30, 30)} L${P(42, -34)} M${P(32, -36)} L${P(54, -32)}" stroke="${C.ink}" stroke-width="${f(4.5 * s)}" stroke-linecap="round" fill="none"/>`
      + [-42, 40].map((a) => `<circle cx="${f(x + a * s)}" cy="${f(y + 40 * s)}" r="${f(10 * s)}" fill="white" stroke="${C.ink}" stroke-width="${f(4 * s)}"/>`).join('');
  };
  const car = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `<path d="M${P(-62, 26)} L${P(-62, 4)} Q${P(-60, -4)} ${P(-44, -6)} L${P(-30, -30)} L${P(26, -30)} L${P(44, -6)} Q${P(62, -4)} ${P(62, 8)} L${P(62, 26)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="${f(3.5 * s)}" stroke-linejoin="round"/>`
      + `<path d="M${P(-24, -24)} L${P(-4, -24)} L${P(-4, -8)} L${P(-34, -8)} Z M${P(4, -24)} L${P(22, -24)} L${P(34, -8)} L${P(4, -8)} Z" fill="white" stroke="${C.blue}" stroke-width="${f(2.5 * s)}" stroke-linejoin="round"/>`
      + [-36, 36].map((a) => `<circle cx="${f(x + a * s)}" cy="${f(y + 28 * s)}" r="${f(14 * s)}" fill="${C.ink}"/><circle cx="${f(x + a * s)}" cy="${f(y + 28 * s)}" r="${f(5 * s)}" fill="white"/>`).join('');
  };

  // ── 2단원: 정의(자전거는 탈것 가운데 하나, 페달로 두 바퀴를 굴린다 → '자전거는 ~ 탈것이다') ──────────────────────────────
  (function () {
    const id = 't81-k2-jeongui';
    let css = base(id);
    let body = at(2, 'fin', `<rect x="300" y="28" width="320" height="200" rx="18" fill="${C.sky}" fill-opacity=".4" stroke="${C.blue}" stroke-width="3"/>` + tag(390, 28, '탈것', ROLE.s, 22), 0.1);
    body += `<g class="b1"><g class="bk">${g('pop pop1', bike(140, 120, 1.25))}</g></g>`;
    body += `<g class="h2">${at(1, 'pop', qBadge(220, 54, 18, C.blue).replace('font-size="18"', 'font-size="24"'), 0.6)}</g>`;
    // 칸 2: 탈것 상자로 들어간다
    body += at(2, 'pop', tile(578, 72, '버스', { size: 20, h: 38 }) + tile(578, 128, '배', { size: 20, h: 38 }) + tile(572, 186, '비행기', { size: 20, h: 38 }), 0.3);
    css += steps(id, 'bk', 'none', [[2, 'translate(300px, 30px)', 0.4]], { box: false });
    // 칸 3: 다른 탈것과 다른 점 — 페달, 두 바퀴
    body += `<g class="b3">` + [387.5, 492.5].map((x, i) => `<circle class="flash flash3" style="animation-delay:${0.2 + i * 0.2}s" cx="${x}" cy="172.5" r="38" fill="none" stroke="${C.orange}" stroke-width="4"/>`).join('') + '</g>';
    body += drawLine('M435 192 L428 254', C.orange, 3, { width: 3, delay: 0.3 }) + drawLine('M512 202 L548 254', C.orange, 3, { width: 3, delay: 0.5 });
    body += at(3, 'pop', tag(424, 272, '페달', ROLE.o, 20) + tag(562, 272, '두 바퀴', ROLE.o, 20), 0.8);
    // 칸 4: 문장으로
    const R = row(['자전거는', '페달로 두 바퀴를 굴리는', '탈것이다'], { y: 320, cx: 320, size: 22, gap: 10 });
    body += R.map((p, i) => at(4, 'rise', T(p, { h: 44, ...(i === 1 ? { fill: C.peach, stroke: C.orange } : i === 2 ? { fill: C.sky, stroke: C.blue } : {}) }), 0.1 + i * 0.2)).join('');
    body += at(4, 'pop', tag(140, 170, '정의', ROLE.y, 24), 1.1);
    put(K + '2/정의', svg(id, body, css));
  })();

  // ── 2단원: 비교(자전거와 킥보드 — 같은 점을 = 로 잇는다) ──────────────────────────────
  (function () {
    const id = 't81-k2-bigyo';
    let css = base(id);
    let body = at(1, 'pop', bike(130, 110, 1.3)) + at(1, 'pop', kick(510, 104, 1.3), 0.3);
    body += at(1, 'fin', text(130, 210, '자전거', { size: 20 }) + text(510, 210, '킥보드', { size: 20 }), 0.6);
    // 칸 2: 같은 점 둘 — 꼬리표에서 두 대상의 같은 부분으로 선이 이어진다
    body += drawLine('M246 60 L206 112 M394 60 L452 142', C.green, 2, { width: 3, delay: 0.1 });
    body += at(2, 'pop', tag(320, 60, '바퀴로 굴러감', ROLE.p, 20), 0.2);
    body += `<g class="b2">` + [[75.4, 133.4, 38], [184.6, 133.4, 38], [455.4, 156, 18], [562, 156, 18]].map(([x, y, r], i) => `<circle class="flash flash2" style="animation-delay:${0.3 + i * 0.1}s" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.green}" stroke-width="4"/>`).join('') + '</g>';
    body += drawLine('M234 262 L132 150 M406 262 L486 152', C.green, 2, { width: 3, delay: 0.6 });
    body += at(2, 'pop', tag(320, 262, '사람의 힘으로 감', ROLE.p, 20), 0.8);
    body += `<g class="b2">` + [[124.8, 133.4, 16], [500, 143, 26]].map(([x, y, r], i) => `<circle class="flash flash2" style="animation-delay:${0.7 + i * 0.05}s" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.green}" stroke-width="4"/>`).join('') + '</g>';
    // 칸 3
    body += glowRect(226, 40, 188, 40, 3, C.green, 0.1, 18) + glowRect(222, 242, 196, 40, 3, C.green, 0.2, 18);
    body += at(3, 'fin', text(320, 168, '같은 점', { size: 22, color: C.green }), 0.3);
    body += at(3, 'pop', tag(320, 328, '비교', ROLE.y, 24), 0.6);
    put(K + '2/비교', svg(id, body, css));
  })();

  // ── 2단원: 대조(자전거와 자동차 — 다른 점을 ≠ 로 맞세운다) ──────────────────────────────
  (function () {
    const id = 't81-k2-daejo';
    let css = base(id);
    let body = at(1, 'pop', bike(130, 96, 1.3)) + at(1, 'pop', car(510, 96, 1.3), 0.3);
    body += at(1, 'fin', text(130, 196, '자전거', { size: 20 }) + text(510, 196, '자동차', { size: 20 }), 0.6);
    const pair = (n, y, a, b) => at(n, 'slide', tag(130, y, a, ROLE.s, 20), 0.1) + at(n, 'slideL', tag(510, y, b, ROLE.o, 20), 0.4) + at(n, 'pop', neq(320, y), 0.9);
    body += pair(2, 244, '바퀴 2개', '바퀴 4개');
    body += pair(3, 296, '페달', '엔진');
    body += glowRect(250, 220, 140, 100, 4, C.red, 0.1, 16);
    body += at(4, 'fin', text(320, 210, '다른 점', { size: 20, color: C.red }), 0.3);
    body += at(4, 'pop', tag(320, 120, '대조', ROLE.y, 24), 0.7);
    put(K + '2/대조', svg(id, body, css));
  })();

  // 분류·구분이 같이 쓰는 탈것 여섯과 세 갈래
  const RIDES = [['자전거', 0], ['배', 1], ['비행기', 2], ['버스', 0], ['요트', 1], ['헬리콥터', 2]];
  const GX = [120, 320, 520], GN = ['땅', '물', '하늘'], GC = [ROLE.o, ROLE.s, ROLE.x];

  // ── 2단원: 분류(흩어진 탈것을 같은 종류끼리 모으고 위로 묶어 이름을 붙인다) ──────────────────────────────
  (function () {
    const id = 't81-k2-bunryu';
    let css = base(id);
    const START = [[90, 250], [250, 250], [420, 250], [560, 250], [170, 320], [470, 320]];
    let body = '';
    const cnt = [0, 0, 0];
    RIDES.forEach(([l, gi], i) => {
      const [sx, sy] = START[i], ty = 210 + cnt[gi]++ * 56;
      body += `<g class="b1"><g class="r${i}">${g('pop pop1', tile(sx, sy, l, { size: 21, h: 44 }), 0.1 + i * 0.1)}</g></g>`;
      css += steps(id, `r${i}`, 'none', [[2, `translate(${GX[gi] - sx}px, ${ty - sy - 40}px)`, 0.1 + i * 0.1]], { box: false });
      css += paint(id, `.r${i}`, GC[gi], 2, 1.1);
    });
    // 칸 3: 위로 묶어 이름
    GX.forEach((x, k) => {
      body += at(3, 'fin', `<rect x="${x - 82}" y="138" width="164" height="128" rx="16" fill="none" stroke="${GC[k][1]}" stroke-width="3"/>`, 0.1 + k * 0.2);
      body += drawArrow(x, 132, x, 84, GC[k][1], 3, { width: 4, delay: 0.2 + k * 0.2 });
      body += at(3, 'pop', tag(x, 56, GN[k] + ' 탈것', GC[k], 22), 0.9 + k * 0.2);
    });
    css += `.sc-${id} .fin3 { }`;
    body += glowRect(30, 30, 580, 250, 4, C.green, 0.1, 18);
    body += at(4, 'pop', tag(320, 320, '분류', ROLE.y, 24), 0.6);
    put(K + '2/분류', svg(id, body, css));
  })();

  // ── 2단원: 구분(큰 무리 '탈것'을 기준 '다니는 곳'에 따라 아래로 세 갈래로 나눈다) ──────────────────────────────
  (function () {
    const id = 't81-k2-gubun';
    let css = base(id);
    let body = at(1, 'pop', tile(320, 52, '탈것', { size: 28, h: 58, w: 180, fill: C.mint, stroke: C.green }));
    body += at(2, 'pop', tag(320, 118, '기준: 다니는 곳', ROLE.y, 20), 0.2);
    css += pulseCss(id, '.b2 .tag', 2, 0.6);
    GX.forEach((x, k) => {
      body += drawArrow(320, 138, x, 196, GC[k][1], 3, { width: 4, delay: 0.1 + k * 0.15 });
      body += at(3, 'pop', tile(x, 226, GN[k], { size: 24, h: 50, w: 120, fill: GC[k][0], stroke: GC[k][1] }), 1.0 + k * 0.15);
      body += at(3, 'rise', tag(x, 284, RIDES[k][0], ['white', C.muted], 19) + tag(x, 324, RIDES[k + 3][0], ['white', C.muted], 19), 1.3 + k * 0.1);
    });
    body += glowRect(40, 196, 560, 60, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(530, 52, '구분', ROLE.y, 24), 0.6);
    put(K + '2/구분', svg(id, body, css));
  })();

  // ── 2단원: 분석(자전거 한 대를 바퀴·페달·핸들·안장으로 떼어 낸다) ──────────────────────────────
  (function () {
    const id = 't81-k2-bunseok';
    let css = base(id);
    const S = bike(320, 150, 2.2, true);
    let body = at(1, 'pop', ['wb', 'wf', 'fr', 'sd', 'hd', 'pd'].map((k) => `<g class="p-${k}">${S[k]}</g>`).join(''));
    const MOVE = { wb: [-70, 40], wf: [70, 40], sd: [-40, -34], hd: [50, -34], pd: [0, 70], fr: [0, 0] };
    Object.entries(MOVE).forEach(([k, [x, y]], i) => { css += steps(id, `p-${k}`, 'none', [[2, `translate(${x}px, ${y}px)`, 0.1 + i * 0.08]], { box: false }); });
    // 칸 3: 이름
    const L = [['바퀴', 108, 330, 152, 270], ['페달', 400, 336, 330, 290], ['핸들', 520, 56, 436, 76], ['안장', 160, 56, 236, 70]];
    L.forEach(([l, x, y, x2, y2], i) => {
      body += drawLine(`M${x + (x < x2 ? 30 : -30)} ${y - 6} L${x2} ${y2}`, C.orange, 3, { width: 3, delay: 0.1 + i * 0.15 });
      body += at(3, 'pop', tag(x, y, l, ROLE.o, 21), 0.5 + i * 0.15);
    });
    body += at(4, 'pop', tag(560, 330, '분석', ROLE.y, 24), 0.5);
    body += glowRect(70, 20, 500, 290, 4, C.orange, 0.1, 18);
    put(K + '2/분석', svg(id, body, css));
  })();

  // ── 2단원: 인과(못을 밟아서 → 바퀴 바람이 빠졌다, 원인과 결과를 화살표로) ──────────────────────────────
  (function () {
    const id = 't81-k2-ingwa';
    let css = base(id);
    const S = bike(0, 0, 1.3, true);
    let body = at(1, 'fin', `<path d="M20 196 H620" stroke="${C.muted}" stroke-width="3"/>`);
    body += at(1, 'pop', `<path d="M392 196 L400 178 L408 196 Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="2"/>`, 0.2);
    body += `<g class="b1"><g class="ride"><g transform="translate(150 139)">${S.wb}<g class="tire">${S.wf}</g>${S.fr}${S.sd}${S.hd}${S.pd}</g></g></g>`;
    css += steps(id, 'ride', 'none', [[1, 'translate(196px, 0px)', 0.4]], { box: false, dur: 1.4 });
    // 칸 2: 앞바퀴가 납작해진다
    css += `.sc-${id} .tire { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .8s ease-in .2s; }
      .on2 .sc-${id} .tire { transform: scale(1.12, .72); }`;
    body += at(2, 'fin', [0, 1, 2].map((i) => `<path d="M${430 + i * 14} ${146 - i * 6} q10 -8 20 0" stroke="${C.red}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join(''), 0.8);
    // 칸 3: 원인 → 결과
    body += at(3, 'rise', tag(170, 262, '원인', ROLE.s, 20) + tile(170, 310, '못을 밟음', { size: 22, h: 46, fill: C.sky, stroke: C.blue }), 0.1);
    body += drawArrow(258, 310, 368, 310, C.ink, 3, { width: 5, delay: 0.5 });
    body += at(3, 'rise', tag(470, 262, '결과', ROLE.o, 20) + tile(470, 310, '바람 빠짐', { size: 22, h: 46, fill: C.peach, stroke: C.orange }), 1.2);
    body += glowRect(90, 240, 470, 100, 4, C.green, 0.1, 18);
    body += at(4, 'pop', tag(320, 40, '인과', ROLE.y, 24), 0.6);
    put(K + '2/인과', svg(id, body, css));
  })();

  // ═════ 3단원: 논증 방법 ═════
  // ── 3단원: 논증(주장만 하면 흔들리고, 이유와 근거를 받치면 선다) ──────────────────────────────
  const receipt = (x, y) => `<path d="M${x - 34} ${y - 44} H${x + 34} V${y + 40} l-8.5 6 l-8.5 -6 l-8.5 6 l-8.5 -6 l-8.5 6 l-8.5 -6 l-8.5 6 l-8.5 -6 Z" fill="white" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`
    + bar(x - 20, y - 26, 40, C.line, 7) + bar(x - 20, y - 10, 40, C.line, 7) + bar(x - 20, y + 6, 28, C.line, 7) + `<path d="M${x - 22} ${y + 24} H${x + 22}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`;
  (function () {
    const id = 't81-k3-nonjeung';
    let css = base(id);
    let body = `<g class="b1"><g class="cl">${g('drop drop1', tile(320, 90, '용돈을 올려 주세요', { size: 24, h: 52, w: 330, fill: C.peach, stroke: C.orange }))}</g></g>`;
    body += at(1, 'fin', `<path d="M300 300 L320 270 L340 300 Z" fill="${C.line}"/><path d="M60 300 H580" stroke="${C.muted}" stroke-width="3"/>`, 0.1);
    body += at(1, 'fin', `<path d="M320 118 V270" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 6"/>`, 0.3);
    css += `@keyframes ${id}-tip { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-6deg); } 75% { transform: rotate(6deg); } }
      .sc-${id} .cl { transform-box: fill-box; transform-origin: 50% 100%; }
      .on1 .sc-${id} .cl { animation: ${id}-tip .8s ease-in-out .4s 2; }`;
    // 칸 2: 이유 기둥
    body += at(2, 'rise', `<rect x="168" y="118" width="124" height="182" rx="10" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + tag(230, 150, '이유', ROLE.p, 20) + text(230, 206, '학용품', { size: 21 }) + text(230, 236, '값이', { size: 21 }) + text(230, 266, '올랐다', { size: 21 }), 0.1);
    // 칸 3: 근거 기둥(영수증)
    body += at(3, 'rise', `<rect x="348" y="118" width="124" height="182" rx="10" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + tag(410, 150, '근거', ROLE.p, 20) + receipt(410, 232), 0.1);
    body += at(3, 'pop', check(520, 90), 1.0);
    // 칸 4
    body += glowRect(150, 56, 340, 252, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(320, 336, '논증', ROLE.y, 24), 0.6);
    put(K + '3/논증', svg(id, body, css));
  })();

  // ── 3단원: 전제(바탕 판단 두 개 위에 결론이 얹힌다) ──────────────────────────────
  (function () {
    const id = 't81-k3-jeonje';
    let css = base(id);
    const block = (x, y, w, label, col) => tile(x, y, label, { size: 22, h: 60, w, fill: col[0], stroke: col[1], rx: 8 });
    let body = at(1, 'slide', block(166, 286, 292, '비가 오면 소풍을 미룬다', ROLE.s) + badge(40, 236, 1, C.blue), 0.1);
    body += at(2, 'slideL', block(472, 286, 292, '내일 비가 온다', ROLE.s) + badge(600, 236, 2, C.blue), 0.1);
    body += drawArrow(166, 250, 280, 176, C.blue, 3, { width: 4, delay: 0.1 }) + drawArrow(472, 250, 360, 176, C.blue, 3, { width: 4, delay: 0.1 });
    body += at(3, 'drop', block(320, 140, 240, '소풍을 미룬다', ROLE.o), 1.0);
    body += at(3, 'pop', tag(320, 82, '결론', ROLE.o, 20), 1.4);
    body += glowRect(12, 248, 616, 76, 4, C.blue, 0.1, 12);
    body += at(4, 'pop', tag(320, 222, '전제', ROLE.y, 24), 0.6);
    put(K + '3/전제', svg(id, body, css));
  })();

  // ── 3단원: 귀납(귤 다섯 개가 모두 시다 → 이 상자 귤은 다 시다) ──────────────────────────────
  const tangerine = (x, y, r = 24) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.orange}" stroke="#b55f1f" stroke-width="2.5"/><path d="M${x} ${y - r} q4 -9 12 -9 q-2 9 -12 9 Z" fill="${C.green}"/>`;
  const sour = (x, y) => tile(x, y, '시다', { size: 19, h: 32, rx: 16, fill: C.mint, stroke: C.green, w: 62 });
  (function () {
    const id = 't81-k3-gwinap';
    let css = base(id);
    const XS = [80, 200, 320, 440, 560];
    let body = XS.map((x, i) => at(1, 'pop', tangerine(x, 60), 0.1 + i * 0.18)).join('');
    body += XS.map((x, i) => at(2, 'pop', sour(x, 116), 0.1 + i * 0.2)).join('');
    body += XS.map((x, i) => drawArrow(x, 140, 320 + (x - 320) * 0.25, 222, C.green, 3, { width: 3.5, delay: 0.1 + i * 0.08 })).join('');
    body += at(3, 'pop', tile(320, 262, '이 상자 귤은 다 시다', { size: 24, h: 56, fill: C.peach, stroke: C.orange }), 1.1);
    body += at(3, 'fin', text(100, 268, '결론', { size: 20, color: C.orange }), 1.4);
    body += glowRect(176, 230, 288, 64, 4, C.orange, 0.1, 14);
    body += at(4, 'pop', tag(320, 330, '귀납', ROLE.y, 24), 0.6);
    put(K + '3/귀납', svg(id, body, css));
  })();

  // ── 3단원: 연역(2학년 모두라는 큰 원 안에 '나'가 들어가 → 나도 간다) ──────────────────────────────
  (function () {
    const id = 't81-k3-yeonyeok';
    let css = base(id);
    let body = at(1, 'pop', `<ellipse cx="250" cy="120" rx="190" ry="96" fill="${C.sky}" fill-opacity=".5" stroke="${C.blue}" stroke-width="3.5"/>`);
    body += at(1, 'fin', text(250, 62, '우리 학교 2학년 모두', { size: 22, color: C.blue }), 0.4);
    body += at(1, 'pop', tag(250, 98, '체험 학습을 간다', ROLE.s, 20), 0.8);
    // 칸 2: '나'가 원 안으로
    body += `<g class="b2"><g class="me">${person(540, 150, C.purple, 18)}${text(540, 166, '나', { size: 18, color: 'white' })}${tag(612, 150, '2학년', PUR, 19)}</g></g>`;
    css += steps(id, 'me', 'none', [[2, 'translate(-290px, 25px)', 0.6]], { box: false, dur: 1.2 });
    // 칸 3: 결론으로 내려간다
    body += drawArrow(250, 222, 250, 270, C.purple, 3, { width: 5, delay: 0.1 });
    body += at(3, 'pop', tile(250, 306, '나도 체험 학습을 간다', { size: 23, h: 52, fill: C.lilac, stroke: C.purple }), 1.0);
    body += at(3, 'fin', text(80, 312, '결론', { size: 20, color: C.purple }), 1.3);
    body += glowRect(60, 22, 380, 196, 4, C.blue, 0.1, 18);
    body += at(4, 'pop', tag(540, 306, '연역', ROLE.y, 24), 0.6);
    put(K + '3/연역', svg(id, body, css));
  })();

  // ── 3단원: 반박(맞서는 말이 다가오고, 까닭을 들어 되밀어 낸다) ──────────────────────────────
  (function () {
    const id = 't81-k3-banbak';
    let css = base(id);
    let body = at(1, 'pop', person(70, 200, C.blue, 24)) + at(1, 'pop', person(570, 200, C.orange, 24), 0.2);
    body += at(1, 'fin', text(70, 266, '나', { size: 20, color: C.blue }), 0.3);
    body += `<g class="b1"><g class="op">${tile(380, 100, '게임은 시간 낭비', { size: 23, h: 52, fill: C.peach, stroke: C.orange })}</g></g>`;
    css += steps(id, 'op', 'translate(120px, 0px)', [[1, 'translate(-40px, 0px)', 0.5], [3, 'translate(110px, 0px)', 0.8]], { box: false, dur: 0.9 });
    // 칸 2: 까닭
    body += at(2, 'rise', tag(230, 196, '까닭', ROLE.s, 20) + tile(230, 246, '협동을 배우는 게임', { size: 22, h: 50, fill: C.sky, stroke: C.blue }), 0.2);
    // 칸 3: 되밀어 냄
    body += drawArrow(300, 218, 400, 140, C.blue, 3, { width: 5, delay: 0 });
    body += at(3, 'pop', cross(604, 66), 1.6);
    body += glowRect(110, 214, 240, 66, 4, C.blue, 0.1, 14);
    body += at(4, 'pop', tag(320, 326, '반박', ROLE.y, 24), 0.6);
    put(K + '3/반박', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
