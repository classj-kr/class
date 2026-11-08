// 국어 3-2 낱말 도식(5단원 사전으로 여는 세상·6단원 감상과 표현): 국어사전 차례, 분류·기준, 형태·기본형, 사흘,
// 글 「아직도 미지의 세계는 남아 있다」의 행성·해류·분포, 나열·요약·맞춤법을 낱말 조각과 단순한 도형으로 움직여 보인다.
// 예는 교과서 그대로: 국어사전 차례 '학교·교실·가방·하루'(239쪽), 분류 보기 아홉 낱말과 두 분류 기준(236~237쪽),
// 형태 '높다·높고·높으면'(226쪽), 맞춤법 '갈게·일어날걸'(284쪽), 요약 글 「건강하고 행복한 급식 시간」(270쪽).
// 지도는 그리지 않는다: 해류는 바다 네모 위의 띠, 분포는 네모 칸 위의 점, 행성은 원 궤도.
// 도구(tile·tag·row·curve·base·move 따위)는 figures/4-2/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(도형의 x·y·width·r 를 CSS 로 바꾸지 않는다).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 괄호 .36em, 쉼표·마침표 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!\[\]]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
  const tw = (s, size) => [...s].reduce((a, c) => a + cw(c), 0) * size;
  const wOf = (label, size = 28) => Math.round(tw(label, size) + size * 1.3);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·slide) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;

  // 낱말 조각: 배경 rect.bg, 글자 text.tx — 색 바꾸기는 CSS 로 .bg 의 fill/stroke 를 바꾼다
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '' } = o;
    const w = o.w || wOf(label.replace(/<[^>]+>/g, ''), size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx' })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: Math.round(size * 1.7), rx: Math.round(size * 0.85), fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange] };
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
  // 여러 칸에 걸쳐 옮긴다: steps = [[칸, transform, 걸리는 시간, 늦춤], ...] (칸 차례로)
  const steps = (id, cls, from, list) => `.sc-${id} .${cls} { transform: ${from}; transition: transform 1s ease-in-out; }`
    + list.map(([n, to, dur = 1, delay = 0]) => `.on${n} .sc-${id} .${cls} { transform: ${to}; transition: transform ${dur}s ease-in-out ${delay}s; }`).join('');
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;

  const K = '3-2/국어/';
  const TAN = '#fdf3d3';
  const bar = (x, y, w, color = '#b5c4be', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;

  // ── 5단원: 국어사전(학교·교실·가방·하루가 첫 자음자 → 모음자 → 받침 차례로 줄 선다) ──────────────────────────────
  (function () {
    const id = 't32-k3-sajeon';
    let css = base(id);
    const X = [205, 329, 453, 577], STEP = 124;
    const Y = { card: 118, c: 204, v: 256, f: 308 };
    let body = '';
    body += at(1, 'fin', text(22, Y.c + 7, '첫 자음자', { size: 19, anchor: 'start', color: C.muted }));
    body += at(2, 'fin', text(22, Y.v + 7, '모음자', { size: 19, anchor: 'start', color: C.muted }));
    body += at(3, 'fin', text(22, Y.f + 7, '받침', { size: 19, anchor: 'start', color: C.muted }));
    // 낱말: [첫 글자, 둘째 글자, 첫 자음자, 모음자, 받침]
    const words = [['학', '교', 'ㅎ', 'ㅏ', 'ㄱ'], ['교', '실', 'ㄱ', 'ㅛ', ''], ['가', '방', 'ㄱ', 'ㅏ', ''], ['하', '루', 'ㅎ', 'ㅏ', '']];
    const consCol = { 'ㄱ': ROLE.s, 'ㅎ': ROLE.o }, vowCol = { 'ㅏ': ROLE.p, 'ㅛ': ROLE.x };
    const chip = (x, y, ch, [fill, stroke]) => tile(x, y, ch, { size: 32, h: 44, w: 52, fill, stroke, sw: 2.5, rx: 10 });
    const empty = (x, y) => `<rect x="${x - 25}" y="${y - 21}" width="50" height="42" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
    words.forEach(([a, b, c, v, fin], i) => {
      const x = X[i];
      let col = at(1, 'rise', tile(x, Y.card, `<tspan fill="${C.orange}">${a}</tspan>${b}`, { size: 28, h: 58, w: 100 }), i * 0.12);
      col += at(1, 'pop', chip(x, Y.c, c, consCol[c]), 0.5 + i * 0.1);
      col += at(2, 'pop', chip(x, Y.v, v, vowCol[v]), 0.2 + i * 0.1);
      col += at(3, 'pop', fin ? chip(x, Y.f, fin, ['#fdf3d3', C.orange]) : empty(x, Y.f), 0.2 + i * 0.1);
      // 견주는 칸에 둥근 물결: 칸 2는 가방·교실의 모음자, 칸 3은 하루·학교의 받침
      if (i === 1 || i === 2) col += `<g class="b2"><circle class="ring ring2" cx="${x}" cy="${Y.v}" r="26" fill="none" stroke="${C.purple}" stroke-width="3"/></g>`;
      if (i === 0 || i === 3) col += `<g class="b3"><circle class="ring ring3" cx="${x}" cy="${Y.f}" r="26" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`;
      body += `<g class="cl cl${i}"><g class="hp hp${i}">${col}</g></g>`;
    });
    // 자리 옮기기: 칸 1(첫 자음자) 교실·가방·학교·하루 → 칸 2(모음자) 가방·교실·학교·하루 → 칸 3(받침) 가방·교실·하루·학교
    const s = (k) => `translateX(${k * STEP}px)`;
    css += steps(id, 'cl0', 'none', [[1, s(2), 1, 1], [2, s(2), 1, 1], [3, s(3), 1, 1]]);
    css += steps(id, 'cl1', 'none', [[1, s(-1), 1, 1], [2, 'none', 1, 1], [3, 'none', 1, 1]]);
    css += steps(id, 'cl2', 'none', [[1, s(-1), 1, 1], [2, s(-2), 1, 1], [3, s(-2), 1, 1]]);
    css += steps(id, 'cl3', 'none', [[1, 'none', 1, 1], [2, 'none', 1, 1], [3, s(-1), 1, 1]]);
    // 오른쪽으로 가는 낱말은 위로 넘어간다(겹쳐 지나가지 않게)
    css += `@keyframes ${id}-hop1 { 0%, 100% { transform: none; } 50% { transform: translateY(-40px); } }
      @keyframes ${id}-hop2 { 0%, 100% { transform: none; } 50% { transform: translateY(-40px); } }
      @keyframes ${id}-hop3 { 0%, 100% { transform: none; } 50% { transform: translateY(-40px); } }
      .on1 .sc-${id} .hp0 { animation: ${id}-hop1 1s ease-in-out 1s both; }
      .on2 .sc-${id} .hp1 { animation: ${id}-hop2 1s ease-in-out 1s both; }
      .on3 .sc-${id} .hp0 { animation: ${id}-hop3 1s ease-in-out 1s both; }`;
    // 칸 4: 차례 번호, 국어사전 꼬리표
    body += X.map((x, i) => at(4, 'pop', `<circle cx="${x}" cy="54" r="17" fill="${C.green}"/>` + text(x, 61, i + 1, { size: 20, color: 'white' }), 0.2 + i * 0.25)).join('');
    body += glowRect(150, 84, 482, 68, 4, C.green, 1.2);
    body += at(4, 'pop', tag(84, Y.card, '국어사전', ROLE.p, 20), 1.4);
    put(K + '5/국어사전', svg(id, body, css));
  })();

  // 분류·기준에 같이 쓰는 낱말 카드(교과서 236쪽 보기)
  const CARDS = [['웃다', 'm'], ['침대', 'n'], ['슬프다', 'a'], ['칠판', 'n'], ['울다', 'm'], ['흐르다', 'm'], ['괴롭다', 'a'], ['초콜릿', 'n'], ['즐겁다', 'a']];
  const KIND = { n: [C.sky, C.blue], m: [C.peach, C.orange], a: [C.mint, C.green] };
  const card = (x, y, label, o = {}) => tile(x, y, label, { size: 21, h: 40, w: 104, ...o });
  const box = (cx, y, w, h, label, [fill, stroke], ly) =>
    `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" fill-opacity=".45" stroke="${stroke}" stroke-width="3"/>` + text(cx, ly, label, { size: 19, color: stroke });

  // ── 5단원: 분류(뒤섞인 낱말 카드가 같은 특징끼리 세 상자로 갈라진다) ──────────────────────────────
  (function () {
    const id = 't32-k3-bunryu';
    let css = base(id);
    const scatter = [[80, 52], [200, 52], [320, 52], [440, 52], [560, 52], [140, 112], [260, 112], [380, 112], [500, 112]];
    const tilt = [-6, 5, -4, 7, -5, 4, -7, 6, -3];
    const COLS = { n: 112, m: 320, a: 528 }, ROWS = [222, 268, 314];
    const seen = { n: 0, m: 0, a: 0 };
    let body = '';
    // 상자(칸 2)
    body += at(2, 'rise', box(COLS.n, 150, 196, 190, '이름', KIND.n, 182), 0.1);
    body += at(2, 'rise', box(COLS.m, 150, 196, 190, '움직임', KIND.m, 182), 0.5);
    body += at(2, 'rise', box(COLS.a, 150, 196, 190, '성질이나 상태', KIND.a, 182), 0.9);
    CARDS.forEach(([label, k], i) => {
      const [sx, sy] = scatter[i];
      const tx = COLS[k], ty = ROWS[seen[k]++];
      const d = 0.2 + i * 0.12;
      body += `<g class="mv mv${i}"><g class="rt rt${i}">${at(1, 'pop', `<g class="cd${i}">${card(sx, sy, label)}</g>`, i * 0.1)}</g></g>`;
      css += `.sc-${id} .rt${i} { transform-box: fill-box; transform-origin: center; transform: rotate(${tilt[i]}deg); transition: transform .8s ease-in-out ${d}s; }
        .on3 .sc-${id} .rt${i} { transform: none; }
        .sc-${id} .mv${i} { transition: transform .8s ease-in-out ${d}s; }
        .on3 .sc-${id} .mv${i} { transform: translate(${tx - sx}px, ${ty - sy}px); }`;
      css += paint(id, `.cd${i}`, KIND[k], 3, d + 0.7);
    });
    // 칸 2: 카드가 한 번씩 들썩인다(어디로 갈지 살핀다)
    css += `.on2 .sc-${id} .tl { animation: ${id}-pulse .6s ease-in-out 1.3s 1; transform-box: fill-box; transform-origin: center; }`;
    body += [COLS.n, COLS.m, COLS.a].map((x, i) => glowRect(x - 102, 146, 204, 198, 4, [C.blue, C.orange, C.green][i], 0.2 + i * 0.2)).join('');
    body += at(4, 'pop', tag(320, 84, '분류', ROLE.p, 24), 0.9);
    put(K + '5/분류', svg(id, body, css));
  })();

  // ── 5단원: 기준(같은 카드가 잣대를 바꾸면 다른 무리로 나뉜다) ──────────────────────────────
  (function () {
    const id = 't32-k3-gijun';
    let css = base(id);
    const COLS = { n: 112, m: 320, a: 528 }, ROWS = [150, 206, 262];
    const seen = { n: 0, m: 0, a: 0 };
    // 새 자리: 형태가 바뀌는 낱말(움직임·성질이나 상태) 여섯은 왼쪽 상자, 바뀌지 않는 낱말(이름) 셋은 오른쪽 상자
    const NEW = { m: [122], a: [302], n: [522] };
    let body = '';
    body += at(1, 'pop', tag(56, 32, '기준', ROLE.p, 21));
    body += `<g class="h2">${at(1, 'pop', tile(210, 32, '낱말의 종류', { size: 21, h: 40, fill: 'white', stroke: C.green }), 0.3)}</g>`;
    body += at(2, 'drop', `<g class="rl">${tile(214, 32, '형태가 바뀌는가', { size: 21, h: 40, fill: C.lilac, stroke: C.purple })}</g>`, 0.2);
    body += `<g class="h2">` + at(1, 'rise', box(COLS.n, 66, 196, 236, '이름', KIND.n, 100), 0.1)
      + at(1, 'rise', box(COLS.m, 66, 196, 236, '움직임', KIND.m, 100), 0.3)
      + at(1, 'rise', box(COLS.a, 66, 196, 236, '성질이나 상태', KIND.a, 100), 0.5) + '</g>';
    body += at(3, 'rise', box(212, 66, 384, 236, '바뀌는 낱말', [C.lilac, C.purple], 100), 0.1);
    body += at(3, 'rise', box(522, 66, 196, 236, '안 바뀌는 낱말', ['#fdf3d3', C.orange], 100), 0.3);
    CARDS.forEach(([label, k], i) => {
      const r = seen[k]++;
      const x = COLS[k], y = ROWS[r];
      const nx = NEW[k][0], ny = ROWS[r];
      const px = 320 + ((i % 3) - 1) * 16, py = 196 + (Math.floor(i / 3) - 1) * 14;
      body += `<g class="mv mv${i}">${at(1, 'pop', `<g class="cd${i}">${card(x, y, label, { fill: KIND[k][0], stroke: KIND[k][1] })}</g>`, 0.6 + i * 0.08)}</g>`;
      css += steps(id, `mv${i}`, 'none', [[2, `translate(${px - x}px, ${py - y}px)`, 0.8, 0.6 + i * 0.05], [3, `translate(${nx - x}px, ${ny - y}px)`, 0.8, 0.5 + i * 0.1]]);
      css += paint(id, `.cd${i}`, ['white', C.muted], 2, 0.6);
      css += paint(id, `.cd${i}`, k === 'n' ? ['#fdf3d3', C.orange] : [C.lilac, C.purple], 3, 1.2 + i * 0.1);
    });
    // 기준 꼬리표는 칸 2·4에 들썩인다
    css += pulseCss(id, '.rl .tl', 2, 0.7) + pulseCss(id, '.rl .tl', 4, 0.3);
    body += glowRect(16, 62, 392, 244, 4, C.purple, 0.6) + glowRect(420, 62, 204, 244, 4, C.orange, 0.8);
    body += at(4, 'pop', `<g class="kk">${tag(56, 32, '기준', ROLE.p, 21)}</g>`, 0.2);
    css += pulseCss(id, '.kk .tl', 4, 0.6);
    put(K + '5/기준', svg(id, body, css));
  })();

  // ── 5단원: 형태(하늘이 높다·높고·높으면 — '높'은 그대로, 뒷부분 모양이 바뀐다) ──────────────────────────────
  (function () {
    const id = 't32-k3-hyeongtae';
    let css = base(id);
    const ys = [96, 186, 276];
    const ends = [['다', 366, 64], ['고', 366, 64], ['으면', 380, 92]];
    const row = (k) => tile(180, ys[k], '하늘이', { size: 26, h: 56, w: 124 })
      + `<g class="st">${tile(300, ys[k], '높', { size: 28, h: 56, w: 64 })}</g>`
      + `<g class="en en${k}">${tile(ends[k][1], ys[k], ends[k][0], { size: 28, h: 56, w: ends[k][2] })}</g>`;
    let body = at(1, 'rise', row(0), 0.2);
    body += `<g class="b2"><g class="rw rw1">${row(1)}</g></g><g class="b2"><g class="rw rw2">${row(2)}</g></g>`;
    css += move(id, 'rw1', 'translateY(-90px)', 2, { dur: 0.8, delay: 0.3 }) + move(id, 'rw2', 'translateY(-180px)', 2, { dur: 1, delay: 0.9 });
    // 칸 2: 새로 생긴 뒷부분이 반짝
    body += `<g class="b2"><circle class="ring ring2" cx="366" cy="${ys[1]}" r="30" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:1.1s"/><circle class="ring ring2" cx="380" cy="${ys[2]}" r="36" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:1.9s"/></g>`;
    // 칸 3: 그대로인 부분과 바뀌는 부분
    css += paint(id, '.st', [C.mint, C.green], 3, 0.2) + paint(id, '.en', [C.peach, C.orange], 3, 0.6);
    css += `.on3 .sc-${id} .en .tl { animation: ${id}-shake .5s ease-in-out 1s 2; }`;
    body += at(3, 'fin', text(300, 48, '그대로', { size: 19, color: C.green }), 0.2) + at(3, 'fin', text(384, 48, '바뀜', { size: 19, color: C.orange }), 0.6);
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M333 62 V310" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="1" style="transition-delay:.3s"/></g>`;
    // 칸 4: 세 낱말의 모양을 묶는다
    body += glowRect(260, 62, 176, 248, 4, C.orange, 0.2);
    body += at(4, 'fin', braceR(456, 66, 306, C.orange), 0.4) + at(4, 'pop', tag(530, 186, '형태', ROLE.o, 24), 0.8);
    put(K + '5/형태', svg(id, body, css));
  })();

  // ── 5단원: 기본형(먹었다·먹고·먹으니 → 바뀌지 않는 '먹'에 '-다'를 붙여 '먹다') ──────────────────────────────
  (function () {
    const id = 't32-k3-gibonhyeong';
    let css = base(id);
    const ys = [96, 186, 276];
    const ends = [['었다', 230, 92], ['고', 216, 64], ['으니', 230, 92]];
    let body = '';
    ys.forEach((y, k) => {
      body += `<g class="dim dim3">${at(1, 'rise', `<g class="st">${tile(150, y, '먹', { size: 28, h: 56, w: 64 })}</g>`, k * 0.3)}</g>`;
      body += `<g class="b3"><g class="sm sm${k}">${tile(150, y, '먹', { size: 28, h: 56, w: 64, fill: C.mint, stroke: C.green })}</g></g>`;
      body += `<g class="en en${k}">${at(1, 'rise', tile(ends[k][1], y, ends[k][0], { size: 28, h: 56, w: ends[k][2] }), k * 0.3)}</g>`;
      // 칸 3: 세 '먹'이 한 자리로 모인다
      css += steps(id, `sm${k}`, 'none', [[3, `translate(${420 - 150}px, ${186 - y}px)`, 0.9, 0.7 + k * 0.12]]);
    });
    // 칸 2: 뒷부분이 살짝 떨어지고 색이 갈린다 / 칸 3: 뒷부분은 떨어져 사라진다
    css += `.sc-${id} .en { transition: transform .7s ease-in-out .3s, opacity .5s ease; }
      .on2 .sc-${id} .en { transform: translateX(16px); }
      .on3 .sc-${id} .en { transform: translate(16px, 40px); opacity: 0; transition: transform .6s ease-in .2s, opacity .5s ease .3s; }`;
    css += paint(id, '.st', [C.mint, C.green], 2, 0.9) + paint(id, '.en', [C.peach, C.orange], 2, 0.9);
    body += `<g class="h3">` + at(2, 'fin', text(150, 46, '그대로', { size: 19, color: C.green }), 1.1) + at(2, 'fin', text(246, 46, '바뀜', { size: 19, color: C.orange }), 1.3) + '</g>';
    body += drawArrow(300, 186, 368, 186, C.green, 3, { delay: 0.4 });
    body += at(3, 'drop', `<g class="da">${tile(486, 186, '다', { size: 28, h: 56, w: 64, fill: C.lilac, stroke: C.purple })}</g>`, 1.6);
    body += `<g class="b3"><circle class="ring ring3" cx="486" cy="186" r="34" fill="none" stroke="${C.purple}" stroke-width="3" style="animation-delay:1.8s"/></g>`;
    // 칸 4: 국어사전에 실리는 꼴
    body += glowRect(380, 152, 146, 68, 4, C.green, 0.2);
    body += at(4, 'drop', tag(453, 112, '기본형', ROLE.p, 24), 0.5);
    const book = `<rect x="402" y="246" width="56" height="70" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="402" y="246" width="12" height="70" rx="4" fill="${C.blue}"/>`
      + `<rect x="422" y="262" width="28" height="30" rx="3" fill="white" stroke="${C.blue}" stroke-width="2"/>`;
    body += at(4, 'pop', book + text(472, 288, '국어사전', { size: 19, anchor: 'start', color: C.blue }), 0.9);
    body += `<g class="b4"><path class="draw draw4" pathLength="1" d="M453 224 V238" stroke="${C.blue}" stroke-width="3" style="transition-delay:.8s"/></g>`;
    put(K + '5/기본형', svg(id, body, css));
  })();

  // ── 5단원: 사흘(해가 세 번 뜨는 동안 — 하루·이틀·사흘, 하루 더 가면 나흘) ──────────────────────────────
  (function () {
    const id = 't32-k3-saheul';
    let css = base(id);
    const cx = (i) => 80 + 80 * i;
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    let body = at(1, 'fin', `<rect x="40" y="40" width="560" height="160" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<rect x="41.5" y="41.5" width="557" height="36" rx="10" fill="${C.mint}"/><path d="M40 78 H600" stroke="${C.ink}" stroke-width="2"/>`
      + [1, 2, 3, 4, 5, 6].map((i) => `<path d="M${40 + 80 * i} 78 V200" stroke="${C.line}" stroke-width="2"/>`).join('')
      + days.map((d, i) => text(cx(i), 67, d, { size: 19, color: i === 6 ? C.red : C.ink })).join(''));
    // 칠해지는 칸(아래에서 차오른다)
    const fill = (i, cls) => `<rect class="fl ${cls}" x="${cx(i) - 38}" y="80" width="76" height="118" fill="${C.peach}"/>`;
    body += `<g>${fill(0, 'f0')}${fill(1, 'f1')}${fill(2, 'f2')}</g>`;
    css += `.sc-${id} .fl { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform .6s ease-out; }
      .on1 .sc-${id} .f0 { transform: none; transition-delay: .5s; }
      .on2 .sc-${id} .f1 { transform: none; transition-delay: .2s; }
      .on2 .sc-${id} .f2 { transform: none; transition-delay: 1s; }`;
    body += at(1, 'fin', [0, 1, 2, 3, 4, 5, 6].map((i) => text(cx(i) - 30, 102, 10 + i, { size: 18, anchor: 'start', color: C.muted })).join(''), 0.2);
    const sun = (x, y, r = 15, col = C.orange) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${C.yellow}" stroke="${col}" stroke-width="2.5"/>`
      + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(c * (r + 5))} ${f(s * (r + 5))} L${f(c * (r + 11))} ${f(s * (r + 11))}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`; }).join('') + '</g>';
    const label = (i, word, col) => tag(cx(i), 232, word, col, 20);
    body += at(1, 'rise', sun(cx(0), 156), 0.8) + at(1, 'pop', label(0, '하루', ROLE.o), 1.2);
    body += at(2, 'rise', sun(cx(1), 156), 0.5) + at(2, 'pop', label(1, '이틀', ROLE.o), 0.8);
    body += at(2, 'rise', sun(cx(2), 156), 1.3) + at(2, 'pop', label(2, '사흘', ROLE.o), 1.6);
    // 칸 3: 사흘은 3일, 하루 더 가면 나흘(4일)
    body += `<g class="dim dim4">` + at(3, 'fin', `<rect x="${cx(3) - 34}" y="84" width="68" height="110" rx="6" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>` + sun(cx(3), 156, 15, C.muted), 1.1)
      + at(3, 'pop', label(3, '나흘', ['white', C.muted]), 1.3)
      + at(3, 'fin', `<path d="M44 300 V312 H356 V300" stroke="${C.muted}" stroke-width="3" fill="none" stroke-dasharray="7 6"/><path d="M200 312 V320" stroke="${C.muted}" stroke-width="3"/>` + text(200, 342, '4일', { size: 20, color: C.muted }), 1.5) + '</g>';
    body += at(3, 'fin', `<path d="M44 256 V266 H276 V256 M160 266 V274" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` + text(160, 296, '3일', { size: 22, color: C.orange }), 0.3);
    // 칸 4: 세 날이 함께 반짝
    body += glowRect(40, 78, 240, 122, 4, C.orange, 0.2, 6);
    css += `.on4 .sc-${id} .fl { animation: ${id}-flash 1.4s ease-in-out .3s both; }`;
    body += at(4, 'pop', tag(510, 282, '사흘', ROLE.o, 26), 0.6);
    put(K + '5/사흘', svg(id, body, css));
  })();

  // ── 5단원: 행성(태양 둘레를 도는 지구·화성) ──────────────────────────────
  (function () {
    const id = 't32-k3-haengseong';
    let css = base(id);
    const S = [300, 190];
    const ringPath = (r) => `M${S[0] + r} ${S[1]} A${r} ${r} 0 1 0 ${S[0] - r} ${S[1]} A${r} ${r} 0 1 0 ${S[0] + r} ${S[1]}`;
    let body = '';
    // 태양
    const rays = Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return `<path d="M${f(S[0] + Math.cos(a) * 42)} ${f(S[1] + Math.sin(a) * 42)} L${f(S[0] + Math.cos(a) * 54)} ${f(S[1] + Math.sin(a) * 54)}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }).join('');
    body += at(1, 'pop', `<g class="ry">${rays}</g><circle cx="${S[0]}" cy="${S[1]}" r="34" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + text(S[0], S[1] + 7, '태양', { size: 20 }));
    css += `@keyframes ${id}-spin { to { transform: rotate(360deg); } }
      .sc-${id} .ry { transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .ry { animation: ${id}-spin 24s linear infinite; }`;
    // 궤도와 도는 행성: 바깥 g 는 태양을 가운데 둔 보이지 않는 원으로 크기를 잡아 태양 둘레로 돌고, 안쪽 g 는 거꾸로 돌아 이름이 서 있게 한다
    const planet = (cls, r, start, body2, label, n, period) => {
      const [px, py] = [S[0] + r * Math.cos(start), S[1] + r * Math.sin(start)];
      css += `@keyframes ${id}-orb { to { transform: rotate(-360deg); } }
        @keyframes ${id}-ctr { to { transform: rotate(360deg); } }
        .sc-${id} .o${cls}, .sc-${id} .c${cls} { transform-box: fill-box; transform-origin: center; }
        .on${n} .sc-${id} .o${cls} { animation: ${id}-orb ${period}s linear 1s infinite; }
        .on${n} .sc-${id} .c${cls} { animation: ${id}-ctr ${period}s linear 1s infinite; }`;
      return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="${ringPath(r)}" stroke="${C.line}" stroke-width="3" fill="none"/></g>`
        + `<g class="o${cls}"><circle cx="${S[0]}" cy="${S[1]}" r="${r + 70}" fill="none" stroke="none"/>`
        + `<g transform="translate(${f(px)} ${f(py)})"><g class="c${cls}"><rect x="-56" y="-56" width="112" height="112" fill="none" stroke="none"/>`
        + at(n, 'pop', body2 + text(0, -24, label, { size: 20 }), 0.5)
        + `<g class="b4"><circle class="ring ring4" r="20" fill="none" stroke="${C.green}" stroke-width="3"/></g>`
        + '</g></g></g>';
    };
    const earth = `<circle r="14" fill="${C.blue}"/><path d="M-6 -8 q6 -3 9 3 q-2 5 -7 4 Z M2 4 q6 -1 7 4 q-5 4 -9 0 Z" fill="${C.mint}"/>`;
    const mars = `<circle r="11" fill="${C.red}"/><circle cx="-3" cy="-3" r="3" fill="${C.peach}"/>`;
    body += planet('E', 100, 0, earth, '지구', 2, 9);
    body += planet('M', 150, Math.PI, mars, '화성', 3, 15);
    // 도는 쪽을 알리는 화살촉(시계 반대 방향)
    body += at(2, 'fin', head(S[0] - 6, S[1] - 100, Math.PI, C.muted, 3.5), 1.1);
    body += at(3, 'fin', head(S[0] + 6, S[1] + 150, 0, C.muted, 3.5), 1.1);
    body += at(4, 'pop', tag(552, 64, '행성', ROLE.s, 26), 0.6);
    put(K + '5/행성', svg(id, body, css));
  })();

  // ── 5단원: 해류(바다 한가운데 늘 한쪽으로 흐르는 바닷물 띠) ──────────────────────────────
  (function () {
    const id = 't32-k3-haeryu';
    let css = base(id);
    const P = [[20, 272], [210, 322], [330, 110], [620, 98]];
    const B = (t) => {
      const u = 1 - t;
      return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]);
    };
    const D = (t) => {
      const u = 1 - t;
      return [0, 1].map((k) => 3 * u * u * (P[1][k] - P[0][k]) + 6 * u * t * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k]));
    };
    const d = `M${P[0].join(' ')} C${P[1].join(' ')} ${P[2].join(' ')} ${P[3].join(' ')}`;
    let body = `<clipPath id="${id}-sea"><rect x="20" y="20" width="600" height="320" rx="16"/></clipPath>`;
    body += at(1, 'fin', `<rect x="20" y="20" width="600" height="320" rx="16" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`);
    body += at(1, 'fin', text(604, 328, '바다', { size: 19, color: C.blue, anchor: 'end' }), 0.3);
    // 잔물결(띠 밖): 제자리에서 일렁인다
    const ripples = [[90, 76], [250, 66], [430, 52], [470, 262], [330, 300], [118, 178], [560, 196], [540, 300]];
    body += ripples.map(([x, y], i) => `<g transform="translate(${x} ${y})">` + at(1, 'fin', `<g class="rp rp${i % 3}"><path d="M-21 0 q7 -7 14 0 q7 7 14 0 q7 -7 14 0" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/></g>`, 0.3 + i * 0.08) + '</g>').join('');
    css += `@keyframes ${id}-bob { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(5px, -4px); } }
      .on1 .sc-${id} .rp0 { animation: ${id}-bob 2.2s ease-in-out infinite; }
      .on1 .sc-${id} .rp1 { animation: ${id}-bob 2.6s ease-in-out .5s infinite reverse; }
      .on1 .sc-${id} .rp2 { animation: ${id}-bob 1.9s ease-in-out .9s infinite; }`;
    // 칸 2: 띠가 그어지고, 흰 줄무늬가 한쪽으로 흐른다
    body += `<g clip-path="url(#${id}-sea)"><g class="b2"><path class="draw draw2" pathLength="1" d="${d}" stroke="${C.blue}" stroke-opacity=".38" stroke-width="54" fill="none"/></g>`
      + at(2, 'fin', `<path class="fw" d="${d}" stroke="white" stroke-width="5" fill="none" stroke-dasharray="18 26" stroke-linecap="round"/>`, 1) + '</g>';
    css += `@keyframes ${id}-flow { to { stroke-dashoffset: -88; } }
      .on2 .sc-${id} .fw { animation: ${id}-flow 1.2s linear infinite; }`;
    [0.2, 0.42, 0.64, 0.86].forEach((t, i) => {
      const [x, y] = B(t), [dx, dy] = D(t), a = Math.atan2(dy, dx) * 180 / Math.PI;
      body += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">` + at(2, 'fin', `<path class="cv" d="M-8 -13 L7 0 L-8 13" stroke="${C.blue}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.2 + i * 0.15) + '</g>';
    });
    // 칸 3: 띠 위의 병은 흐름을 따라 가고, 띠 밖의 병은 제자리에서 흔들린다
    const bottle = `<rect x="-20" y="-9" width="40" height="18" rx="9" fill="white" stroke="${C.orange}" stroke-width="3"/><rect x="20" y="-5" width="8" height="10" rx="2" fill="${C.orange}"/>`;
    const t0 = 0.06, [bx, by] = B(t0);
    const frames = [];
    for (let k = 0; k <= 10; k++) {
      const t = t0 + (0.94 - t0) * k / 10, [x, y] = B(t), [dx, dy] = D(t);
      const op = k === 0 || k === 10 ? 0 : 1;
      frames.push(`${k * 10}% { transform: translate(${f(x - bx)}px, ${f(y - by)}px) rotate(${f(Math.atan2(dy, dx) * 180 / Math.PI)}deg); opacity: ${op}; }`);
    }
    css += `@keyframes ${id}-ride { ${frames.join(' ')} }
      .sc-${id} .bt { opacity: 0; }
      .on3 .sc-${id} .bt { animation: ${id}-ride 3.6s linear .2s infinite; }
      @keyframes ${id}-rock { 0%, 100% { transform: rotate(-10deg) translateY(0); } 50% { transform: rotate(10deg) translateY(-5px); } }
      .sc-${id} .bk { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .bk { animation: ${id}-rock 1.6s ease-in-out infinite; }`;
    body += `<g class="b3"><g transform="translate(${f(bx)} ${f(by)})"><g class="bt">${bottle}</g></g></g>`;
    body += `<g transform="translate(250 146)">` + at(3, 'pop', `<g class="bk">${bottle}</g>`, 0.3) + '</g>';
    // 칸 4
    css += `.on4 .sc-${id} .cv { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    body += at(4, 'pop', tag(360, 248, '해류', ROLE.s, 26), 0.5);
    put(K + '5/해류', svg(id, body, css));
  })();

  // ── 5단원: 분포(꽃이 핀 자리를 점으로 — 어디에 많고 적게 퍼져 있나) ──────────────────────────────
  (function () {
    const id = 't32-k3-bunpo';
    let css = base(id);
    const X0 = 140, Y0 = 64, CW = 90, CH = 76;
    const counts = [[1, 3, 6, 9], [0, 2, 5, 7], [0, 1, 2, 3]];
    let body = at(1, 'fin', `<rect x="${X0}" y="${Y0}" width="${CW * 4}" height="${CH * 3}" rx="8" fill="white" stroke="${C.green}" stroke-width="3"/>`
      + [1, 2, 3].map((i) => `<path d="M${X0 + CW * i} ${Y0} V${Y0 + CH * 3}" stroke="${C.line}" stroke-width="2"/>`).join('')
      + [1, 2].map((j) => `<path d="M${X0} ${Y0 + CH * j} H${X0 + CW * 4}" stroke="${C.line}" stroke-width="2"/>`).join(''));
    body += at(1, 'fin', text(X0, Y0 - 14, '공원', { size: 19, anchor: 'start', color: C.green }), 0.2);
    // 칸 3에 칠해지는 칸 색(점이 많을수록 짙게)
    counts.forEach((rowC, j) => rowC.forEach((n, i) => {
      if (!n) return;
      body += `<rect class="sh sh${j}${i}" x="${X0 + CW * i + 2}" y="${Y0 + CH * j + 2}" width="${CW - 4}" height="${CH - 4}" rx="6" fill="${C.orange}"/>`;
      css += `.sc-${id} .sh${j}${i} { opacity: 0; transition: opacity .6s ease ${f(0.2 + (i + j) * 0.15)}s; }
        .on3 .sc-${id} .sh${j}${i} { opacity: ${f(0.1 + n / 9 * 0.62)}; }`;
    }));
    // 점: 칸을 3×3 자리로 나누어 섞인 차례로 n 개를 고른다(정해진 씨앗)
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    let dots = '', k = 0;
    counts.forEach((rowC, j) => rowC.forEach((n, i) => {
      const spots = Array.from({ length: 9 }, (_, s) => s).sort(() => rnd() - 0.5).slice(0, n);
      spots.forEach((s) => {
        const x = X0 + CW * i + 18 + (s % 3) * 27 + (rnd() - 0.5) * 10;
        const y = Y0 + CH * j + 15 + Math.floor(s / 3) * 23 + (rnd() - 0.5) * 8;
        dots += g('pop pop1', `<circle cx="${f(x)}" cy="${f(y)}" r="6.5" fill="${C.purple}" stroke="white" stroke-width="1.5"/>`, f(0.4 + k * 0.035));
        k++;
      });
    }));
    body += `<g class="b1">${dots}</g>`;
    // 칸 2: 많은 곳·적은 곳
    body += `<g class="b2"><rect class="flash flash2" x="${X0 + CW * 2 - 4}" y="${Y0 - 4}" width="${CW * 2 + 8}" height="${CH * 2 + 8}" rx="10" fill="none" stroke="${C.orange}" stroke-width="4" stroke-dasharray="10 7" style="animation-delay:.2s"/>`
      + `<rect class="flash flash2" x="${X0 - 4}" y="${Y0 + CH - 4}" width="${CW * 2 + 8}" height="${CH * 2 + 8}" rx="10" fill="none" stroke="${C.blue}" stroke-width="4" stroke-dasharray="10 7" style="animation-delay:1s"/></g>`;
    body += at(2, 'pop', tag(568, 140, '많다', ROLE.o, 22), 0.5) + at(2, 'pop', tag(74, 216, '적다', ROLE.s, 22), 1.3);
    // 칸 4
    body += glowRect(X0 - 6, Y0 - 6, CW * 4 + 12, CH * 3 + 12, 4, C.green, 0.2, 12);
    body += at(4, 'pop', tag(320, 328, '분포', ROLE.p, 24), 0.6);
    put(K + '5/분포', svg(id, body, css));
  })();

  // ── 6단원: 나열(흩어진 색연필이 한 줄로 늘어선다) ──────────────────────────────
  (function () {
    const id = 't32-k3-nayeol';
    let css = base(id);
    const cols = [C.red, C.orange, C.yellow, C.green, C.blue];
    const names = ['빨강', '주황', '노랑', '초록', '파랑'];
    const RX = [160, 240, 320, 400, 480], RY = 150;
    const scatter = [[520, 250, 72], [146, 250, -58], [540, 124, 24], [262, 176, -104], [350, 270, 118]];
    const pencil = (col) => `<rect x="-16" y="-50" width="32" height="100" rx="3" fill="${col}"/><rect x="-16" y="-50" width="10" height="100" fill="white" opacity=".25"/>`
      + `<path d="M-16 -50 L16 -50 L0 -80 Z" fill="${TAN}" stroke="#d9b98a" stroke-width="2" stroke-linejoin="round"/><path d="M-5 -70 L5 -70 L0 -80 Z" fill="${col}"/>`
      + `<rect x="-16" y="50" width="32" height="12" rx="3" fill="${C.line}"/>`;
    let body = at(1, 'fin', `<rect x="20" y="20" width="600" height="320" rx="16" fill="${TAN}" fill-opacity=".55"/>`);
    cols.forEach((col, i) => {
      const [sx, sy, rot] = scatter[i];
      body += `<g class="pc pc${i}"><g transform="translate(${RX[i]} ${RY})">${at(1, 'pop', pencil(col), 0.2 + i * 0.15)}</g></g>`;
      css += `.sc-${id} .pc${i} { transform-box: fill-box; transform-origin: center; transform: translate(${sx - RX[i]}px, ${sy - RY}px) rotate(${rot}deg); transition: transform 1s ease-in-out ${f(0.2 + i * 0.2)}s; }
        .on2 .sc-${id} .pc${i} { transform: none; }`;
    });
    // 칸 3: 하나씩 번호와 이름이 붙는다
    RX.forEach((x, i) => {
      body += at(3, 'pop', `<circle cx="${x}" cy="40" r="16" fill="${C.ink}"/>` + text(x, 47, i + 1, { size: 19, color: 'white' }), 0.2 + i * 0.25);
      body += at(3, 'rise', tile(x, 258, names[i], { size: 20, h: 38, w: 66, fill: 'white', stroke: cols[i] }), 0.35 + i * 0.25);
    });
    // 칸 4: 죽 이어지는 화살표
    body += drawArrow(130, 312, 520, 312, C.green, 4, { delay: 0.2 });
    body += glowRect(120, 18, 400, 262, 4, C.green, 0.4);
    body += at(4, 'pop', tag(578, 150, '나열', ROLE.p, 24), 1);
    put(K + '6/나열', svg(id, body, css));
  })();

  // ── 6단원: 요약(「건강하고 행복한 급식 시간」에서 의견과 이유만 남는다) ──────────────────────────────
  (function () {
    const id = 't32-k3-yoyak';
    let css = base(id);
    const page = `<rect x="24" y="20" width="316" height="322" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + text(182, 48, '건강하고 행복한 급식 시간', { size: 18 }) + `<path d="M44 62 H320" stroke="${C.line}" stroke-width="2"/>`;
    const paras = [[82, 4], [162, 4], [242, 4], [314, 2]];
    // 칠할 줄: [문단, 줄, 색]
    const hot = { '0-3': ROLE.o, '1-0': ROLE.s, '2-0': ROLE.s };
    let lines = '', hl = '';
    const spots = [];
    paras.forEach(([y0, n], p) => {
      for (let j = 0; j < n; j++) {
        const y = y0 + j * 17, x = j === 0 ? 58 : 44, w = j === n - 1 ? 170 : (j === 0 ? 262 : 276);
        const h = hot[`${p}-${j}`];
        if (h) { hl += `<rect class="hl" x="${x - 6}" y="${y - 10}" width="${w + 12}" height="20" rx="5" fill="${h[0]}" stroke="${h[1]}" stroke-width="2" style="transition-delay:${f(0.2 + spots.length * 0.45)}s"/>`; spots.push([x + w / 2, y]); }
        lines += bar(x, y, w, h ? '#8fa39b' : '#c4d3cc', 9);
      }
    });
    let body = `<g class="dim dim3">` + at(1, 'fin', page) + `<g class="b2">${hl}</g>` + at(1, 'fin', lines, 0.4) + '</g>';
    css += `.sc-${id} .hl { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out; }
      .on2 .sc-${id} .hl { transform: none; }`;
    body += at(3, 'fin', `<rect x="370" y="70" width="248" height="232" rx="14" fill="${C.mint}" fill-opacity=".6"/>`);
    const keep = [['골고루 먹자', 120, ROLE.o], ['영양소를 얻는다', 186, ROLE.s], ['여러 음식을 즐긴다', 252, ROLE.s]];
    keep.forEach(([label, y, col], i) => {
      body += `<g class="b3"><g class="fy fy${i}">${tile(494, y, label, { size: 20, h: 46, w: 224, fill: col[0], stroke: col[1] })}</g></g>`;
      css += `.sc-${id} .fy${i} { transform: translate(${f(spots[i][0] - 494)}px, ${f(spots[i][1] - y)}px) scale(.5); opacity: 0; transition: transform 1s ease-in-out ${0.3 + i * 0.45}s, opacity .4s ease ${0.3 + i * 0.45}s; }
        .on3 .sc-${id} .fy${i} { transform: none; opacity: 1; }`;
    });
    body += glowRect(366, 66, 256, 240, 4, C.green, 0.2) + at(4, 'drop', tag(494, 36, '요약', ROLE.p, 24), 0.5);
    put(K + '6/요약', svg(id, body, css));
  })();

  // ── 6단원: 맞춤법(소리 [갈께] → 글자 '갈게', [이러날껄] → '일어날걸') ──────────────────────────────
  (function () {
    const id = 't32-k3-matchum';
    let css = base(id);
    const bubble = (cx, cy, w, label, size) => `<rect x="${cx - w / 2}" y="${cy - 30}" width="${w}" height="60" rx="28" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M${cx - w / 2 + 26} ${cy + 26} L${cx - w / 2 + 14} ${cy + 46} L${cx - w / 2 + 44} ${cy + 28}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`
      + text(cx, cy + size * 0.36, label, { size, color: C.blue });
    let body = at(1, 'fin', text(120, 52, '소리', { size: 19, color: C.muted }) + text(360, 52, '글자', { size: 19, color: C.muted }));
    // 1줄: [갈께] → 갈께 → 갈게
    const y1 = 128;
    body += at(1, 'pop', `<g class="bb1">${bubble(120, y1, 160, '[갈께]', 28)}</g>`, 0.2);
    body += drawArrow(210, y1, 256, y1, C.muted, 1, { width: 4, delay: 0.6 });
    body += at(1, 'rise', tile(305, y1, '갈', { size: 28, h: 56, w: 64 }), 1.3);
    body += `<g class="b1"><g class="wr1">` + g('rise rise1', `<g class="k1">${tile(371, y1, '께', { size: 28, h: 56, w: 64 })}</g>` + `<g class="b2">${g('pop pop2', cross(371, y1 - 50, 10), 0.6)}</g>`, 1.4) + '</g></g>';
    css += paint(id, '.k1', [C.peach, C.red], 2, 0.2) + `.on2 .sc-${id} .k1 { animation: ${id}-shake .5s ease-in-out .3s 1; }`;
    css += `.sc-${id} .wr1 { transition: transform .5s ease-in .9s, opacity .4s ease 1s; } .on2 .sc-${id} .wr1 { transform: translateY(56px); opacity: 0; }`;
    body += at(2, 'drop', tile(371, y1, '게', { size: 28, h: 56, w: 64, fill: C.mint, stroke: C.green }), 1.3);
    body += at(2, 'pop', check(436, y1, 12), 1.8);
    // 2줄: [이러날껄] → 일어날껄 → 일어날걸
    const y2 = 252;
    body += at(3, 'pop', bubble(120, y2, 196, '[이러날껄]', 26), 0.1);
    body += drawArrow(226, y2, 258, y2, C.muted, 3, { width: 4, delay: 0.2 });
    body += at(3, 'rise', tile(325, y2, '일어날', { size: 28, h: 56, w: 110 }), 0.5);
    body += `<g class="b3"><g class="wr2">` + g('rise rise3', `<g class="k2">${tile(414, y2, '껄', { size: 28, h: 56, w: 64 })}</g>` + g('pop pop3', cross(414, y2 - 50, 10), 0.9), 0.6) + '</g></g>';
    css += paint(id, '.k2', [C.peach, C.red], 3, 0.8) + `.on3 .sc-${id} .k2 { animation: ${id}-shake .4s ease-in-out .9s 1; }`;
    css += `.sc-${id} .wr2 { transition: transform .45s ease-in 1.25s, opacity .35s ease 1.3s; } .on3 .sc-${id} .wr2 { transform: translateY(56px); opacity: 0; }`;
    body += at(3, 'drop', tile(414, y2, '걸', { size: 28, h: 56, w: 64, fill: C.mint, stroke: C.green }), 1.5);
    body += at(3, 'pop', check(480, y2, 12), 1.9);
    // 칸 4
    body += glowRect(267, y1 - 34, 142, 68, 4, C.green, 0.2) + glowRect(264, y2 - 34, 186, 68, 4, C.green, 0.5);
    body += at(4, 'pop', tag(568, 190, '맞춤법', ROLE.p, 24), 0.9);
    put(K + '6/맞춤법', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
