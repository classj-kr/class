// 국어 2-1 낱말 도식(첫째 묶음: 1단원 말차례, 2단원 말놀이·낱말·첫소리·반복·덧붙이다, 3단원 꾸며 주는 말, 4단원 받침·쌍받침·겹받침·토박이말).
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
  const GRAY = '#b5c4be';
  const apple = (x, y, r, cls = '') => `<path class="${cls}" d="M${x} ${f(y - r * 0.7)} C${f(x - r * 0.4)} ${f(y - r * 1.05)} ${f(x - r * 1.1)} ${f(y - r * 0.75)} ${f(x - r)} ${y} C${f(x - r * 0.95)} ${f(y + r * 0.8)} ${f(x - r * 0.35)} ${f(y + r * 1.05)} ${x} ${f(y + r * 0.85)} C${f(x + r * 0.35)} ${f(y + r * 1.05)} ${f(x + r * 0.95)} ${f(y + r * 0.8)} ${f(x + r)} ${y} C${f(x + r * 1.1)} ${f(y - r * 0.75)} ${f(x + r * 0.4)} ${f(y - r * 1.05)} ${x} ${f(y - r * 0.7)} Z" stroke-width="3.5" stroke-linejoin="round"/>`
    + `<path d="M${x} ${f(y - r * 0.68)} Q${f(x + r * 0.05)} ${f(y - r * 0.95)} ${f(x + r * 0.18)} ${f(y - r * 1.15)}" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`
    + `<path d="M${f(x + r * 0.12)} ${f(y - r * 0.95)} Q${f(x + r * 0.55)} ${f(y - r * 1.25)} ${f(x + r * 0.75)} ${f(y - r * 0.9)} Q${f(x + r * 0.4)} ${f(y - r * 0.75)} ${f(x + r * 0.12)} ${f(y - r * 0.95)} Z" fill="${C.green}"/>`;

  // ── 1단원: 말차례(친구 넷이 한 사람씩 돌아가며 말한다 — 말풍선이 차례로 옮겨 간다) ──────────────────────────────
  (function () {
    const id = 't21-k1-malcharye';
    let css = base(id);
    const X = [110, 250, 390, 530], COL = [C.blue, C.orange, C.green, C.purple], SY = 284, R = 24;
    let body = '';
    X.forEach((x, i) => { body += at(1, 'rise', person(x, SY, COL[i], R), i * 0.12); });
    const talk = (x, col) => bubble(x - 62, 96, 124, 78, x, 204, col) + bar(x - 40, 118, 80, GRAY, 10) + bar(x - 40, 135, 64, GRAY, 10) + bar(x - 40, 152, 72, GRAY, 10);
    // 칸 1: 첫째가 말한다
    body += `<g class="h2">${at(1, 'pop', talk(X[0], COL[0]), 0.6)}</g>`;
    // 칸 2: 첫째 말이 끝나고 둘째가 손을 든 뒤 말한다
    const hx = X[1] + 30;
    body += `<g class="h3">${at(2, 'pop', `<path d="M${hx} 300 L${hx + 16} 236" stroke="${COL[1]}" stroke-width="11" stroke-linecap="round"/><circle cx="${hx + 17}" cy="228" r="10" fill="${COL[1]}"/>`, 0.1)}</g>`;
    body += `<g class="h3">${at(2, 'pop', talk(X[1], COL[1]), 0.9)}</g>`;
    // 칸 3: 셋째가 말하고, 이어서 넷째가 말한다
    body += `<g class="b3"><g class="t3">${talk(X[2], COL[2])}</g></g>`;
    body += at(3, 'pop', talk(X[3], COL[3]), 1.15);
    css += `.sc-${id} .t3 { opacity: 0; }
      @keyframes ${id}-t3 { 0% { opacity: 0; } 12% { opacity: 1; } 62% { opacity: 1; } 76% { opacity: 0; } 100% { opacity: 0; } }
      .on3 .sc-${id} .t3 { animation: ${id}-t3 1.5s linear both; }`;
    // 칸 4: 차례 번호와 돌아가는 화살표
    X.forEach((x, i) => { body += at(4, 'pop', badge(x, SY + 18, i + 1, C.green), 0.15 + i * 0.25); });
    body += drawArrow(X[0], 342, X[3] + 30, 342, C.green, 4, { width: 4, delay: 0.9 });
    body += at(4, 'pop', tag(320, 46, '말차례', ROLE.p, 24), 1.4);
    put(K + '1/말차례', svg(id, body, css));
  })();

  // ── 2단원: 말놀이(끝말 이어 가기 — 기차 → 차표 → 표범, 끝 글자를 다음 친구가 이어 받는다) ──────────────────────────────
  (function () {
    const id = 't21-k2-malnori';
    let css = base(id);
    const X = [120, 320, 520], COL = [C.blue, C.orange, C.green], SY = 298, R = 22, WY = 170;
    const W = [['기', '차'], ['차', '표'], ['표', '범']];
    const sq = (cx, ch, o = {}) => tile(cx, WY, ch, { size: 34, w: 62, h: 62, ...o });
    let body = '';
    X.forEach((x, i) => { body += at(1, 'rise', person(x, SY, COL[i], R), i * 0.12); });
    const bub = (x, col) => bubble(x - 82, 128, 164, 84, x, 230, col);
    // 칸 1: 첫째 친구 '기차'
    body += at(1, 'pop', bub(X[0], COL[0]) + sq(X[0] - 33, W[0][0]) + sq(X[0] + 33, W[0][1], { cls: 'e1' }), 0.5);
    // 칸 2·3: 끝 글자가 다음 친구에게 날아가 첫 글자가 되고, 뒤 글자가 붙는다
    [1, 2].forEach((k) => {
      const n = k + 1, x = X[k];
      body += at(n, 'fin', bub(x, COL[k]), 0.1);
      body += `<g class="b${n}"><g class="c${k}">${sq(x - 33, W[k][0], { fill: C.peach, stroke: C.orange })}</g></g>`;
      css += flyIn(id, `c${k}`, (X[k - 1] + 33) - (x - 33), 0, n, { delay: 0.4, dur: 0.9 });
      body += at(n, 'pop', sq(x + 33, W[k][1], { cls: k === 1 ? 'e2' : '' }), 1.35);
      body += curve(X[k - 1] + 33, 122, x - 33, 122, 92, C.orange, n, { width: 4, delay: 0.3 });
      css += paint(id, `.e${k}`, ROLE.o, n);
    });
    // 칸 4
    css += pulseCss(id, '.e1', 4, 0.2) + pulseCss(id, '.c1', 4, 0.2) + pulseCss(id, '.e2', 4, 0.7) + pulseCss(id, '.c2', 4, 0.7);
    body += at(4, 'pop', tag(320, 48, '말놀이', ROLE.p, 24), 1.0);
    put(K + '2/말놀이', svg(id, body, css));
  })();

  // ── 2단원: 낱말('나는 사과를 좋아해.'에서 '사과'를 떼어 내도 뜻이 있고, 다른 문장에도 넣어 쓴다) ──────────────────────────────
  (function () {
    const id = 't21-k2-natmal';
    let css = base(id);
    const S = 34, X0 = 168, MX = 280;
    let body = at(1, 'fin', `<rect x="130" y="50" width="380" height="72" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + text(X0, 98, '나는', { size: S, anchor: 'start' }) + text(314, 98, '를 좋아해.', { size: S, anchor: 'start' }), 0.1);
    // 떼어 낼 '사과'(처음에는 문장 속 글자, 떼어 내면 조각이 된다)
    body += at(2, 'fin', `<rect x="${MX - 48}" y="62" width="96" height="48" rx="10" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.8);
    // 칸 3: 다른 문장의 빈자리에 '사과'가 들어간다
    body += at(3, 'fin', `<rect x="130" y="264" width="380" height="72" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + text(X0, 312, '빨간', { size: S, anchor: 'start' }) + text(314, 312, '가 있어요.', { size: S, anchor: 'start' })
      + `<rect x="${MX - 48}" y="276" width="96" height="48" rx="10" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.1);
    body += `<g class="b1"><g class="lift"><g class="li"><g class="lbg"><rect x="${MX - 55}" y="54" width="110" height="64" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>${text(MX, 98, '사과', { size: S })}</g></g></g>`;
    css += steps(id, 'lift', 'none', [[2, 'translate(-80px, 120px)', 0.2], [3, 'translate(0px, 214px)', 0.7]], { dur: 0.9, box: false })
      + `.sc-${id} .lbg { opacity: 0; transition: opacity .4s ease .9s; } .on2 .sc-${id} .lbg { opacity: 1; }`;
    body += at(2, 'pop', apple(300, 210, 32, 'ap'), 1.1);
    css += `.sc-${id} .ap { fill: ${C.red}; stroke: ${C.red}; }`;
    // 칸 4: 다른 낱말들
    const r = row(['바다', '기차', '하늘'], { y: 226, cx: 480, size: 24, gap: 10 });
    r.forEach((p, i) => { body += at(4, 'pop', T(p, { h: 48, fill: C.mint, stroke: C.green }), 0.7 + i * 0.2); });
    body += at(4, 'pop', tag(480, 166, '낱말', ROLE.p, 24), 0.3);
    css += pulseCss(id, '.li', 4, 0.1);
    put(K + '2/낱말', svg(id, body, css));
  })();

  // ── 2단원: 첫소리(바다·바지·바람은 'ㅂ', 고래·구름·기차는 'ㄱ' — 맨 앞 글자에서 소리가 빠져나와 상자에 모인다) ──────────────────────────────
  (function () {
    const id = 't21-k2-cheot';
    let css = base(id);
    const Y = [80, 160, 240];
    // nw 칸에 낱말, nm 칸에 동그라미·상자·자음자
    const group = (nw, nm, x, words, jamo, bx, col) => {
      let s = '';
      words.forEach((w, i) => { s += at(nw, 'pop', tile(x, Y[i], w, { size: 34, h: 64 }), 0.1 + i * 0.15); });
      const fx = x - 17, d0 = nw === nm ? 0.5 : 0;
      words.forEach((w, i) => { s += at(nm, 'pop', `<circle cx="${fx + 1}" cy="${Y[i]}" r="23" fill="none" stroke="${col[1]}" stroke-width="4"/>`, f(d0 + 0.1 + i * 0.12)); });
      s += at(nm, 'pop', `<rect x="${bx - 50}" y="110" width="100" height="100" rx="18" fill="${col[0]}" stroke="${col[1]}" stroke-width="3.5"/>`, f(d0 + 0.2));
      words.forEach((w, i) => {
        const cls = `j${nm}${i}`, dx = bx - fx, dy = 160 - Y[i], d = f(d0 + 0.5 + i * 0.22);
        s += `<g class="b${nm}"><g class="${cls}">${text(fx, Y[i] + 21, jamo, { size: 60, color: col[1], weight: 800 })}</g></g>`;
        css += `@keyframes ${id}-${cls} { 0% { opacity: 0; transform: none; } 25% { opacity: 1; transform: none; } 100% { opacity: 1; transform: translate(${dx}px, ${dy}px); } }
          .sc-${id} .${cls} { opacity: 0; }
          .on${nm} .sc-${id} .${cls} { animation: ${id}-${cls} .9s ease-in-out ${d}s both; }`;
      });
      return s;
    };
    let body = group(1, 2, 150, ['바다', '바지', '바람'], 'ㅂ', 285, ROLE.o);
    body += group(3, 3, 440, ['고래', '구름', '기차'], 'ㄱ', 572, ROLE.s);
    body += glowRect(229, 104, 112, 112, 4, C.orange, 0.1, 20) + glowRect(516, 104, 112, 112, 4, C.blue, 0.3, 20);
    body += at(4, 'pop', tag(320, 322, '첫소리', ROLE.p, 24), 0.8);
    put(K + '2/첫소리', svg(id, body, css));
  })();

  // ── 2단원: 반복·덧붙이다(말 덧붙이기 놀이 — 앞 친구 말을 그대로 되풀이(파랑)하고 새 말을 더 붙인다(주황)) ──────────────────────────────
  const addGame = (id, focus) => {
    let css = base(id);
    const X = [112, 320, 528], Y = [50, 104, 158, 212], S = 22, H = 44, COL = [C.blue, C.orange, C.green];
    const L = ['과일 가게에 가면', '사과도 있고', '바나나도 있고', '딸기도 있고'];
    const tl = (c, r, o = {}) => tile(X[c], Y[r], L[r], { size: S, h: H, ...o });
    const plus = (c, r) => { const x = X[c] - wOf(L[r], S) / 2 - 17; return `<circle cx="${f(x)}" cy="${Y[r]}" r="13" fill="white" stroke="${C.orange}" stroke-width="3"/>` + text(f(x), Y[r] + 8, '+', { size: 22, color: C.orange }); };
    let body = '';
    X.forEach((x, c) => { body += at(c + 1, 'rise', person(x, 326, COL[c], 17), c ? 0 : 0.1); });
    // 칸 1: 첫째 친구
    body += at(1, 'pop', tl(0, 0), 0.3);
    body += at(1, 'slide', `<g class="ad">${tl(0, 1, { fill: C.peach, stroke: C.orange })}</g>`, 0.9);
    // 칸 2·3: 앞 친구 말이 날아와 되풀이되고(파랑), 새 말이 붙는다(주황)
    [1, 2].forEach((c) => {
      const n = c + 1;
      for (let r = 0; r <= c; r++) {
        body += `<g class="b${n}"><g class="k${c}${r}">${tl(c, r, { cls: 'rp' })}</g></g>`;
        css += flyIn(id, `k${c}${r}`, X[c - 1] - X[c], 0, n, { delay: f(0.1 + r * 0.15), dur: 0.8 });
        css += paint(id, `.k${c}${r}`, ROLE.s, n, 1.0);
      }
      body += at(n, 'slide', `<g class="ad">${plus(c, c + 1)}${tl(c, c + 1, { fill: C.peach, stroke: C.orange })}</g>`, 1.3);
    });
    // 칸 4: 고른 쪽이 반짝인다
    if (focus === 'rep') {
      body += glowRect(X[1] - 102, Y[0] - 28, 204, Y[1] - Y[0] + 56, 4, C.blue, 0.1, 12);
      body += glowRect(X[2] - 102, Y[0] - 28, 204, Y[2] - Y[0] + 56, 4, C.blue, 0.3, 12);
      css += pulseCss(id, '.rp', 4, 0.6);
      body += at(4, 'pop', tag(320, 252, '반복', ROLE.s, 24), 1.0);
    } else {
      body += glowRect(X[0] - 79, Y[1] - 27, 158, 54, 4, C.orange, 0.1, 12);
      body += glowRect(X[1] - 90, Y[2] - 27, 180, 54, 4, C.orange, 0.25, 12);
      body += glowRect(X[2] - 79, Y[3] - 27, 158, 54, 4, C.orange, 0.4, 12);
      css += pulseCss(id, '.ad', 4, 0.6);
      body += at(4, 'pop', tag(320, 252, '덧붙이다', ROLE.o, 24), 1.0);
    }
    return svg(id, body, css);
  };
  put(K + '2/반복', addGame('t21-k2-banbok', 'rep'));
  put(K + '2/덧붙이다', addGame('t21-k2-deotbut', 'add'));

  // ── 3단원: 꾸며 주는 말('빨간'이 사과를 칠하고, '활짝'이 꽃을 활짝 피운다) ──────────────────────────────
  (function () {
    const id = 't21-k3-kkumim';
    let css = base(id);
    const r1 = row(['빨간', '사과'], { y: 100, cx: 165, size: 30, gap: 14 });
    let body = `<g class="b1"><g class="sg">${T(r1[1], { h: 58 })}</g></g>`;
    css += move(id, 'sg', `translateX(${f(165 - r1[1].cx)}px)`, 2, { dur: 0.6, delay: 0.1 });
    body += at(1, 'fin', apple(165, 240, 52, 'ap'), 0.3);
    css += `.sc-${id} .ap { fill: white; stroke: ${C.muted}; transition: fill .7s ease 1.1s, stroke .7s ease 1.1s; }
      .on2 .sc-${id} .ap { fill: ${C.red}; stroke: ${C.red}; }`;
    // 칸 2: '빨간'이 앞에 붙는다
    body += at(2, 'drop', `<g class="m1">${T(r1[0], { h: 58, fill: ROLE.y[0], stroke: C.orange })}</g>`, 0.5);
    body += curve(r1[0].cx, 68, r1[1].cx - 14, 68, 40, C.orange, 2, { width: 4, delay: 0.7 });
    // 칸 3: '꽃이 피었다' 사이에 '활짝'
    const r2 = row(['꽃이', '활짝', '피었다'], { y: 100, cx: 480, size: 24, gap: 12 });
    const sh = (r2[1].w + 12) / 2;
    body += `<g class="b3"><g class="a1">${T(r2[0], { h: 50 })}</g></g><g class="b3"><g class="a3">${T(r2[2], { h: 50 })}</g></g>`;
    css += move(id, 'a1', `translateX(${f(sh)}px)`, 3, { dur: 0.5, delay: 0.4 }) + move(id, 'a3', `translateX(${f(-sh)}px)`, 3, { dur: 0.5, delay: 0.4 });
    body += at(3, 'drop', `<g class="m2">${T(r2[1], { h: 50, fill: ROLE.y[0], stroke: C.orange })}</g>`, 0.8);
    body += curve(r2[1].cx, 72, r2[2].cx - 12, 72, 44, C.orange, 3, { width: 4, delay: 0.8 });
    const FX = 470, FY = 232;
    const petals = [0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="${FX}" cy="${FY - 26}" rx="15" ry="25" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" transform="rotate(${a} ${FX} ${FY})"/>`).join('');
    body += at(3, 'fin', `<path d="M${FX} ${FY + 10} V322" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/><path d="M${FX} 292 Q${FX + 30} 270 ${FX + 46} 284 Q${FX + 26} 298 ${FX} 292 Z" fill="${C.green}"/>`
      + `<g class="pt">${petals}</g><circle cx="${FX}" cy="${FY}" r="13" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`, 0.1);
    css += `.sc-${id} .pt { transform-box: fill-box; transform-origin: center; transform: scale(.4); transition: transform .7s ease-out 1.3s; }
      .on3 .sc-${id} .pt { transform: none; }`;
    // 칸 4
    css += pulseCss(id, '.m1', 4, 0.2) + pulseCss(id, '.m2', 4, 0.5);
    body += at(4, 'pop', tag(320, 335, '꾸며 주는 말', ROLE.y, 22), 0.9);
    put(K + '3/꾸며 주는 말', svg(id, body, css));
  })();

  // ── 4단원: 받침('가'의 빈 아래 자리에 'ㅁ'을 받치면 '감' — 받침이 있는 낱말과 없는 낱말) ──────────────────────────────
  (function () {
    const id = 't21-k4-batchim';
    let css = base(id);
    const BX = 40, BY = 50, S = 56;
    let body = at(1, 'fin', `<rect x="${BX}" y="${BY}" width="200" height="220" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M${BX} ${BY + 110} H${BX + 200} M${BX + 100} ${BY} V${BY + 110}" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 6"/>`
      + text(BX + 50, BY + 75, 'ㄱ', { size: S }) + text(BX + 150, BY + 75, 'ㅏ', { size: S })
      + `<g class="slot"><rect class="bg" x="${BX + 12}" y="${BY + 120}" width="176" height="90" rx="10" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="8 6"/></g>`, 0.1);
    css += paint(id, '.slot', ROLE.o, 2, 0.6);
    // 결과 글자
    body += at(1, 'fin', `<rect x="290" y="100" width="120" height="120" rx="16" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + `<path d="M250 160 H278" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>` + head(280, 160, 0, C.muted, 4), 0.4);
    body += `<g class="h2">${at(1, 'fin', text(350, 185, '가', { size: 70 }), 0.5)}</g>`;
    // 칸 2: 'ㅁ'이 아래 자리로 들어가고 '감'이 된다
    body += `<g class="b2"><g class="mm">${text(BX + 100, BY + 185, 'ㅁ', { size: S, color: C.orange })}</g></g>`;
    css += flyIn(id, 'mm', 0, -150, 2, { delay: 0.1, dur: 0.8 });
    body += at(2, 'pop', text(350, 185, '감', { size: 70, color: C.green }), 1.1);
    // 칸 3: 받침이 없는 낱말과 있는 낱말
    body += at(3, 'fin', `<rect x="432" y="36" width="188" height="130" rx="14" fill="white" stroke="${C.muted}" stroke-width="3"/>` + text(526, 66, '받침 없음', { size: 20, color: C.muted }), 0.1);
    body += at(3, 'fin', `<rect x="432" y="186" width="188" height="140" rx="14" fill="${C.peach}" fill-opacity=".45" stroke="${C.orange}" stroke-width="3"/>` + text(526, 216, '받침 있음', { size: 20, color: C.orange }), 0.1);
    [['가위', 480, 120, 'white', C.muted], ['오리', 572, 120, 'white', C.muted], ['곰', 478, 275, 'white', C.orange], ['강물', 566, 275, 'white', C.orange]].forEach(([w, x, y, fill, stroke], i) => {
      body += at(3, 'pop', tile(x, y, w, { size: 26, h: 52, fill, stroke }), 0.5 + i * 0.3);
    });
    // 칸 4
    body += glowRect(BX + 6, BY + 114, 188, 102, 4, C.orange, 0.1, 12);
    css += pulseCss(id, '.mm', 4, 0.3);
    body += at(4, 'pop', tag(BX + 100, 316, '받침', ROLE.o, 26), 0.7);
    put(K + '4/받침', svg(id, body, css));
  })();

  // ── 4단원: 쌍받침·겹받침('밖'의 받침 ㄱ·ㄱ은 똑같고, '닭'의 받침 ㄹ·ㄱ은 서로 다르다) ──────────────────────────────
  const pairBox = (id, focus) => {
    let css = base(id);
    const S = 50, Y0 = 60, HT = 95;
    const box = (x, [c, v, b1, b2], k) => `<rect x="${x}" y="${Y0}" width="180" height="${HT * 2}" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<g class="${k}a"><rect class="bg" x="${x + 6}" y="${Y0 + HT + 6}" width="81" height="${HT - 12}" rx="8" fill="white" stroke="none"/></g>`
      + `<g class="${k}b"><rect class="bg" x="${x + 93}" y="${Y0 + HT + 6}" width="81" height="${HT - 12}" rx="8" fill="white" stroke="none"/></g>`
      + `<path d="M${x} ${Y0 + HT} H${x + 180} M${x + 90} ${Y0} V${Y0 + HT * 2}" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 6"/>`
      + text(x + 45, Y0 + HT / 2 + 18, c, { size: S }) + text(x + 135, Y0 + HT / 2 + 18, v, { size: S })
      + `<g class="${k}j">` + text(x + 45, Y0 + HT * 1.5 + 18, b1, { size: S }) + text(x + 135, Y0 + HT * 1.5 + 18, b2, { size: S }) + '</g>';
    const LX = 60, RX = 400;
    let body = at(1, 'fin', box(LX, ['ㅂ', 'ㅏ', 'ㄱ', 'ㄱ'], 'L') + text(LX + 90, 300, '밖', { size: 46 }), 0.1);
    body += at(1, 'fin', box(RX, ['ㄷ', 'ㅏ', 'ㄹ', 'ㄱ'], 'R') + text(RX + 90, 300, '닭', { size: 46 }), 0.4);
    const sy = Y0 + HT * 1.5;
    const eq = (x) => `<circle cx="${x}" cy="${sy}" r="17" fill="white" stroke="${C.blue}" stroke-width="3"/><path d="M${x - 8} ${sy - 5} H${x + 8} M${x - 8} ${sy + 5} H${x + 8}" stroke="${C.blue}" stroke-width="3.5" stroke-linecap="round"/>`;
    const ne = (x) => `<circle cx="${x}" cy="${sy}" r="17" fill="white" stroke="${C.red}" stroke-width="3"/><path d="M${x - 8} ${sy - 5} H${x + 8} M${x - 8} ${sy + 5} H${x + 8} M${x + 5} ${sy - 11} L${x - 5} ${sy + 11}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/>`;
    const nL = focus === 'ssang' ? 2 : 3, nR = focus === 'ssang' ? 3 : 2;
    css += paint(id, '.La', ROLE.s, nL, 0.2) + paint(id, '.Lb', ROLE.s, nL, 0.4) + paint(id, '.Ra', ROLE.o, nR, 0.2) + paint(id, '.Rb', ROLE.x, nR, 0.4);
    body += at(nL, 'pop', eq(LX + 90), 0.9) + at(nR, 'pop', ne(RX + 90), 0.9);
    css += pulseCss(id, '.Lj', nL, 1.2) + pulseCss(id, '.Rj', nR, 1.2);
    // 칸 4: 고른 글자가 반짝이고, 이름과 다른 예
    const fx = focus === 'ssang' ? LX : RX, col = focus === 'ssang' ? ROLE.s : ROLE.o;
    body += glowRect(fx - 8, Y0 - 8, 196, HT * 2 + 16, 4, col[1], 0.1, 14);
    body += at(4, 'pop', tag(fx + 90, 30, focus === 'ssang' ? '쌍받침' : '겹받침', col, 24), 0.5);
    const ex = focus === 'ssang' ? ['ㄲ', 'ㅆ'] : ['ㄳ', 'ㄵ', 'ㄶ', 'ㄺ', 'ㄼ'];
    row(ex, { y: 334, cx: focus === 'ssang' ? fx + 90 : 320, size: 34, gap: 10 }).forEach((p, i) => { body += at(4, 'pop', T(p, { h: 48, w: 66, fill: col[0], stroke: col[1] }), 0.9 + i * 0.12); });
    return svg(id, body, css);
  };
  put(K + '4/쌍받침', pairBox('t21-k4-ssang', 'ssang'));
  put(K + '4/겹받침', pairBox('t21-k4-gyeop', 'gyeop'));

  // ── 4단원: 토박이말(하늘·구름·무지개는 우리말에 원래 있던 말, 버스·피자는 다른 나라에서 들어온 말) ──────────────────────────────
  (function () {
    const id = 't21-k4-tobagi';
    let css = base(id);
    const r = row(['하늘', '버스', '구름', '피자', '무지개'], { y: 70, size: 26, gap: 16 });
    let body = at(1, 'fin', `<rect x="24" y="140" width="282" height="204" rx="16" fill="${C.mint}" fill-opacity=".45" stroke="${C.green}" stroke-width="3"/>` + text(165, 172, '원래 있던 말', { size: 21, color: C.green }), 0.3);
    body += at(1, 'fin', `<rect x="334" y="140" width="282" height="204" rx="16" fill="${C.sky}" fill-opacity=".5" stroke="${C.blue}" stroke-width="3"/>` + text(475, 172, '다른 나라에서 온 말', { size: 21, color: C.blue }), 0.4);
    const dest = { '하늘': [92, 204, 3], '구름': [226, 204, 3], '무지개': [158, 264, 3], '버스': [420, 240, 2], '피자': [530, 240, 2] };
    r.forEach((p, i) => {
      const [x, y, n] = dest[p.label], k = `w${i}`, col = n === 3 ? ROLE.p : ROLE.s;
      body += at(1, 'pop', `<g class="${k}">${T(p, { h: 52 })}</g>`, 0.1 + i * 0.1);
      const order = n === 2 ? ['버스', '피자'].indexOf(p.label) : ['하늘', '구름', '무지개'].indexOf(p.label);
      css += steps(id, k, 'none', [[n, `translate(${f(x - p.cx)}px, ${f(y - p.y)}px)`, f(0.2 + order * 0.3)]], { dur: 0.9, box: false });
      css += paint(id, `.${k}`, col, n, f(0.9 + order * 0.3));
    });
    // 칸 4
    body += glowRect(18, 134, 294, 216, 4, C.green, 0.1, 18);
    body += at(4, 'pop', tag(165, 322, '토박이말', ROLE.p, 22), 0.6);
    css += pulseCss(id, '.w0 .tl', 4, 1.0) + pulseCss(id, '.w2 .tl', 4, 1.1) + pulseCss(id, '.w4 .tl', 4, 1.2);
    put(K + '4/토박이말', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
