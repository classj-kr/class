// 국어 6-1 낱말 도식(첫째 묶음: 독서 단원 독서 주제망·한국십진분류법·총류·청구 기호·구절, 1단원 전기문·독서 감상문,
// 2단원 고쳐쓰기·중심 문장·뒷받침 문장·명료하다·간결하다·문장 성분·주어·목적어·서술어·호응·교정 부호).
// 도구(tile·tag·row·curve·base·move 따위)는 figures/4-2/kor.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 움직임은 transform·opacity·stroke-dashoffset(과 색 바꾸기)만 쓴다. 아이패드 사파리는 CSS 로 x·y·width·height·r·d 를 바꾸지 못한다.
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
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '', color = C.ink } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx', color })}</g>`;
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
  const line = (x1, y1, x2, y2, color, n, { width = 4, delay = 0, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
  // 점선(그어지지 않고 나타나기만 함)
  const dashed = (x1, y1, x2, y2, color = C.muted, w = 3) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${w}" stroke-dasharray="7 6" fill="none" stroke-linecap="round"/>`;
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
  // 그어지는 동그라미(칸 n) — circle 대신 path 로 그려 pathLength 를 확실히 받게 한다
  const ringDraw = (cx, cy, r, color, n, { width = 4, delay = 0 } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(cx - r)} ${f(cy)} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0" stroke="${color}" stroke-width="${width}" fill="none"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;

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
  const pulseCss = (id, sel, n, delay = 0.2) => `.sc-${id} ${sel} { transform-box: fill-box; transform-origin: center; }
    .on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; }`;
  // 왼쪽에서부터 자라는 막대(칸 n)
  const growCss = (id, sel, n, delay = 0) => `.sc-${id} ${sel} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .55s ease-out ${delay}s; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;

  const K = '6-1/국어/';
  const TAN = '#fdf3d3', GRAY = '#b5c4be';

  // ── 독서 단원: 독서 주제망(가운데 '인권' → 이야기책 둘, 정보책 둘) ──────────────────────────────
  (function () {
    const id = 't61-k1-jujemang';
    let css = base(id);
    const CX = 320, CY = 183;
    // [종류, 이름, x, y, 칸]
    const cards = [['이야기책', '노력한 사람들', 150, 92, 2], ['이야기책', '인권의 중요성', 150, 278, 2], ['정보책', '인권의 뜻', 490, 92, 3], ['정보책', '세계 어린이 인권', 490, 278, 3]];
    const book = (x, y, fill, stroke) => `<rect x="${x - 15}" y="${y - 20}" width="30" height="40" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><path d="M${x - 8} ${y - 20} V${y + 20}" stroke="${stroke}" stroke-width="2.5"/>`;
    let body = '';
    cards.forEach(([, , x, y, n], i) => {
      const col = n === 2 ? C.orange : C.blue;
      body += line(CX, CY, x, y, col, n, { width: 5, delay: (i % 2) * 0.35, cls: 'ln' });
    });
    body += at(1, 'pop', `<g class="ring ring1"><circle cx="${CX}" cy="${CY}" r="62" fill="none" stroke="${C.green}" stroke-width="4"/></g>`, 0.4);
    body += at(1, 'pop', `<g class="nd nd0">${tile(CX, CY, '인권', { size: 32, h: 66, w: 130, fill: C.mint, stroke: C.green, sw: 4 })}</g>`);
    cards.forEach(([kind, name, x, y, n], i) => {
      const [fill, stroke] = n === 2 ? ROLE.o : ROLE.s;
      const card = `<rect x="${x - 118}" y="${y - 40}" width="236" height="80" rx="14" fill="white" stroke="${stroke}" stroke-width="3"/>` + book(x - 88, y, fill, stroke)
        + text(x + 22, y - 8, kind, { size: 18, color: stroke }) + text(x + 22, y + 24, name, { size: 20 });
      body += at(n, 'pop', `<g class="nd nd${i + 1}">${card}</g>`, 0.7 + (i % 2) * 0.35);
    });
    // 칸 4: 그물 전체가 숨 쉬듯 부풀고 줄이 초록으로
    css += `.sc-${id} .ln { transition-property: stroke-dashoffset, stroke; } .on4 .sc-${id} .ln { stroke: ${C.green}; transition: stroke .5s ease .2s; }`;
    css += [0, 1, 2, 3, 4].map((k) => pulseCss(id, `.nd${k}`, 4, k ? 0.5 : 0.2)).join('');
    body += at(4, 'pop', tag(320, 28, '독서 주제망', ROLE.y, 22), 0.9);
    put(K + 'reading/독서 주제망', svg(id, body, css));
  })();

  // ── 독서 단원: 한국십진분류법(서가 열 칸 000~900, 책이 번호 따라 제 칸으로) ──────────────────────────────
  const KDC = ['총류', '철학', '종교', '사회 과학', '자연 과학', '기술 과학', '예술', '언어', '문학', '역사'];
  (function () {
    const id = 't61-k1-sipjin';
    let css = base(id);
    const cell = (i) => { const r = i < 5 ? 0 : 1, c = i % 5; return { x: 18 + c * 122, y: r ? 142 : 18, cx: 76 + c * 122 }; };
    let body = `<rect x="10" y="130" width="620" height="7" rx="3" fill="${C.muted}"/><rect x="10" y="254" width="620" height="7" rx="3" fill="${C.muted}"/>`;
    for (let i = 0; i < 10; i++) {
      const { x, y, cx } = cell(i);
      body += at(1, 'pop', `<rect x="${x}" y="${y}" width="116" height="110" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(cx, y + 40, String(i * 100).padStart(3, '0'), { size: 28, color: C.green, weight: 800 }), i * 0.1);
      body += at(2, 'fin', text(cx, y + 70, KDC[i], { size: 18 }), 0.2 + i * 0.1);
    }
    // 칸 3: 아래에 놓인 책 세 권이 번호를 따라 제 칸으로 날아간다
    const books = [['홍길동전', 8, 130], ['단소 연주법', 6, 320], ['인간과 종교', 2, 510]];
    books.forEach(([label, i, sx], k) => {
      const { cx, y } = cell(i), dy = y + 94;
      body += `<g class="b3"><g class="bk${k}">${tile(cx, dy, label, { size: 18, h: 30, rx: 6, fill: TAN, stroke: C.orange, sw: 2.5 })}</g></g>`;
      css += move(id, `bk${k}`, `translate(${f(sx - cx)}px, ${f(318 - dy)}px)`, 3, { dur: 0.9, delay: 0.5 + k * 0.3 });
      body += glowRect(cell(i).x - 4, y - 4, 124, 118, 3, C.orange, 1.4 + k * 0.3);
    });
    // 칸 4: 열 칸이 차례로 반짝이고 이름표
    for (let i = 0; i < 10; i++) { const { x, y } = cell(i); body += glowRect(x - 3, y - 3, 122, 116, 4, C.green, i * 0.08, 14); }
    body += at(4, 'pop', tag(320, 314, '한국십진분류법', ROLE.p, 24), 0.9);
    put(K + 'reading/한국십진분류법', svg(id, body, css));
  })();

  // ── 독서 단원: 총류(000 칸 — 여러 분야가 섞인 백과사전·신문·잡지) ──────────────────────────────
  (function () {
    const id = 't61-k1-chongryu';
    let css = base(id);
    let body = '';
    for (let i = 0; i < 10; i++) {
      body += at(1, 'pop', tile(50 + i * 60, 46, String(i * 100).padStart(3, '0'), { size: 18, w: 56, h: 48, rx: 8, cls: `c${i}` }), i * 0.08);
    }
    css += paint(id, '.c0', ROLE.y, 1, 1.0) + pulseCss(id, '.c0', 1, 1.0);
    // 000 칸에서 내려온 큰 상자
    body += at(1, 'fin', dashed(50, 72, 80, 110, C.orange) + `<rect x="30" y="110" width="270" height="226" rx="16" fill="white" stroke="${C.orange}" stroke-width="3"/>` + tag(165, 138, '000 총류', ROLE.y, 22), 1.3);
    // 칸 2: 백과사전 — 과학·역사·예술이 다 들어 있다
    const ex = 470, ey = 222, spokes = [['과학', 372, 128], ['역사', 568, 128], ['예술', 372, 312], ['언어', 568, 312]];
    body += `<g class="h3">` + spokes.map(([, x, y], i) => line(ex, ey, x, y, C.muted, 2, { width: 3, delay: 0.5 + i * 0.15 })).join('')
      + spokes.map(([l, x, y], i) => at(2, 'pop', tag(x, y, l, ['white', C.muted], 18), 1.0 + i * 0.15)).join('') + '</g>';
    body += `<g class="b2"><g class="ency">${g('pulse pulse2', tile(165, 196, '백과사전', { size: 22, h: 46, w: 160, fill: C.sky, stroke: C.blue }), 1.6)}</g></g>`;
    css += move(id, 'ency', `translate(${ex - 165}px, ${ey - 196}px)`, 3, { dur: 1, delay: 0.3 });
    // 칸 3: 백과사전이 상자로, 신문·어린이 잡지도 뒤따라
    [['신문', 248], ['어린이 3월 호', 300]].forEach(([l, y], k) => {
      body += `<g class="b3"><g class="nw${k}">${tile(165, y, l, { size: 20, h: 44, w: 170, fill: C.sky, stroke: C.blue })}</g></g>`;
      css += move(id, `nw${k}`, 'translate(330px, 0px)', 3, { dur: 0.9, delay: 1.0 + k * 0.35 });
    });
    // 칸 4
    body += glowRect(26, 106, 278, 234, 4, C.orange, 0.1, 18);
    body += at(4, 'pop', tile(470, 220, '총류', { size: 34, h: 70, w: 140, fill: TAN, stroke: C.orange, sw: 4 }), 0.5);
    body += curve(394, 220, 312, 220, 200, C.orange, 4, { width: 4, delay: 0.8 });
    css += pulseCss(id, '.c0', 4, 0.3);
    put(K + 'reading/총류', svg(id, body, css));
  })();

  // ── 독서 단원: 청구 기호(『강아지똥』 813.8 권68ㄱ) ──────────────────────────────
  (function () {
    const id = 't61-k1-cheonggu';
    let css = base(id);
    // 책등
    let body = at(1, 'rise', `<rect x="50" y="24" width="80" height="312" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + ['강', '아', '지', '똥'].map((c, i) => text(90, 80 + i * 34, c, { size: 26 })).join('')
      + `<rect x="56" y="232" width="68" height="84" rx="6" fill="white" stroke="${C.muted}" stroke-width="2"/>`
      + text(90, 266, '813.8', { size: 18 }) + text(90, 300, '권68ㄱ', { size: 18 }));
    body += glowRect(52, 228, 76, 92, 1, C.orange, 0.5, 8);
    // 확대한 이름표
    body += at(1, 'fin', dashed(124, 232, 190, 58) + dashed(124, 316, 190, 228), 0.9);
    body += at(1, 'pop', `<rect x="190" y="58" width="210" height="170" rx="14" fill="white" stroke="${C.ink}" stroke-width="3"/>`, 1.0);
    body += `<g class="b2"><g class="hl1"><rect x="202" y="70" width="186" height="66" rx="10" fill="${C.sky}"/></g></g>`;
    body += `<g class="b3"><g class="hl2"><rect x="202" y="146" width="186" height="66" rx="10" fill="${C.peach}"/></g></g>`;
    body += at(1, 'pop', text(260, 122, '8', { size: 44, anchor: 'end', weight: 800 }) + text(262, 122, '13.8', { size: 44, anchor: 'start', weight: 800 })
      + text(265, 196, '권', { size: 44, anchor: 'end', weight: 800 }) + text(267, 196, '68ㄱ', { size: 44, anchor: 'start', weight: 800 }), 1.1);
    css += `.sc-${id} .hl1, .sc-${id} .hl2 { opacity: 0; transition: opacity .6s ease .2s; } .on2 .sc-${id} .hl1, .on3 .sc-${id} .hl2 { opacity: 1; }`;
    // 칸 2: 분류 번호, 맨 앞 8 → 800 문학
    body += line(402, 105, 462, 105, C.blue, 2, { width: 4, delay: 0.4 }) + at(2, 'pop', tag(530, 105, '분류 번호', ROLE.s, 20), 0.9);
    body += ringDraw(247, 106, 22, C.orange, 2, { delay: 1.0 }) + line(247, 84, 247, 50, C.orange, 2, { delay: 1.6 });
    body += at(2, 'pop', tag(247, 30, '800 문학', ROLE.y, 18), 1.9);
    // 칸 3: 저자 기호, 권 → 권정생
    body += line(402, 179, 462, 179, C.orange, 3, { width: 4, delay: 0.4 }) + at(3, 'pop', tag(530, 179, '저자 기호', ROLE.o, 20), 0.9);
    body += ringDraw(243, 180, 25, C.red, 3, { delay: 1.0 }) + line(243, 205, 243, 240, C.red, 3, { delay: 1.6 });
    body += at(3, 'pop', tag(243, 260, '작가 권정생', ROLE.o, 18), 1.9);
    // 칸 4: 서가의 빈자리에 책이 꽂힌다
    const hs = [62, 56, 66, 58, 64, 60, 66, 57, 63, 59, 65], cols = [C.sky, C.mint, C.lilac, TAN];
    let shelf = `<rect x="330" y="330" width="296" height="8" rx="3" fill="${C.muted}"/>`;
    hs.forEach((h, i) => {
      if (i === 6) return;
      const x = 338 + i * 26;
      shelf += `<rect x="${x}" y="${330 - h}" width="23" height="${h}" rx="3" fill="${cols[i % 4]}" stroke="${C.line}" stroke-width="2"/><rect x="${x + 4}" y="${318 - 6}" width="15" height="10" rx="2" fill="white"/>`;
    });
    body += at(4, 'fin', shelf);
    body += `<g class="b4"><g class="sp"><rect x="${338 + 6 * 26}" y="264" width="23" height="66" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><rect x="${342 + 6 * 26}" y="312" width="15" height="10" rx="2" fill="white"/></g></g>`;
    css += move(id, 'sp', 'translateY(-110px)', 4, { dur: 0.9, delay: 0.6 }) + `.sc-${id} .sp { opacity: 0; } .on4 .sc-${id} .sp { opacity: 1; }`;
    body += at(4, 'pop', tag(530, 230, '청구 기호', ROLE.p, 22), 1.4);
    put(K + 'reading/청구 기호', svg(id, body, css));
  })();

  // ── 독서 단원: 구절(글 한 쪽에서 떼어 낸 한 토막) ──────────────────────────────
  (function () {
    const id = 't61-k1-gujeol';
    let css = base(id) + growCss(id, '.gr', 1);
    let body = at(1, 'fin', `<rect x="40" y="30" width="262" height="300" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    const ws = [214, 200, 216, 0, 206, 192, 212, 120];
    ws.forEach((w, k) => {
      const y = 66 + k * 34;
      if (k === 3) {
        body += `<g class="b1"><rect class="gr" style="transition-delay:${k * 0.1}s" x="64" y="${y - 6}" width="46" height="12" rx="6" fill="${GRAY}"/></g>`;
        body += `<g class="b1"><rect class="gr sg" style="transition-delay:${k * 0.1 + 0.05}s" x="118" y="${y - 6}" width="148" height="12" rx="6" fill="${GRAY}"/></g>`;
      } else body += `<g class="b1"><rect class="gr" style="transition-delay:${k * 0.1}s" x="64" y="${y - 6}" width="${w}" height="12" rx="6" fill="${GRAY}"/></g>`;
    });
    // 칸 2: 밑줄
    css += `.sc-${id} .sg { transition-property: transform, fill; } .on2 .sc-${id} .sg { fill: ${C.orange}; transition: transform .55s ease-out, fill .5s ease .9s; }`;
    body += line(118, 184, 266, 184, C.orange, 2, { width: 4, delay: 0.2 });
    body += glowRect(110, 154, 164, 40, 2, C.orange, 1.0, 10);
    // 칸 3: 그 토막이 떨어져 나와 오른쪽에서 말이 된다
    body += `<g class="b3"><g class="fly"><rect x="118" y="162" width="148" height="12" rx="6" fill="${C.orange}"/></g></g>`;
    css += `.sc-${id} .fly { transition: transform .9s ease-in-out .2s, opacity .3s ease .95s; } .on3 .sc-${id} .fly { transform: translateX(278px); opacity: 0; }`;
    body += at(3, 'pop', tile(470, 168, '인권은 우리의 권리야!', { size: 22, h: 58, fill: TAN, stroke: C.orange, sw: 3 }), 1.0);
    body += at(3, 'fin', dashed(274, 168, 342, 168, C.orange), 1.1);
    // 칸 4
    body += glowRect(470 - wOf('인권은 우리의 권리야!', 22) / 2 - 8, 131, wOf('인권은 우리의 권리야!', 22) + 16, 74, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(470, 248, '구절', ROLE.y, 24), 0.6);
    put(K + 'reading/구절', svg(id, body, css));
  })();

  // ── 1단원: 전기문(윤희순의 삶 — 시대 상황과 한 일) ──────────────────────────────
  (function () {
    const id = 't61-k1-jeongi';
    let css = base(id);
    const Y = 183, P = [270, 480];
    let body = '';
    // 칸 4 테두리를 맨 아래에
    body += `<g class="b4"><path class="draw draw4" pathLength="1" d="M26 52 H614 Q626 52 626 64 V322 Q626 334 614 334 H26 Q14 334 14 322 V64 Q14 52 26 52 Z" stroke="${C.green}" stroke-width="4" fill="none" style="transition-duration:1.6s"/></g>`;
    body += at(1, 'pop', `<g class="who">${tile(80, Y, '윤희순', { size: 24, h: 48, fill: C.lilac, stroke: C.purple })}</g>`);
    body += `<g class="b1"><path class="draw draw1" pathLength="1" d="M134 ${Y} H600" stroke="${C.ink}" stroke-width="4" fill="none" style="transition-delay:.4s; transition-duration:1.2s"/>${g('fin fin1', head(612, Y, 0, C.ink, 4), 1.5)}</g>`;
    body += P.map((x, i) => at(1, 'pop', `<circle cx="${x}" cy="${Y}" r="9" fill="white" stroke="${C.ink}" stroke-width="3"/>`, 0.8 + i * 0.4)).join('');
    // 칸 2: 시대 상황
    body += at(2, 'drop', tag(80, 96, '시대 상황', ROLE.s, 20));
    [['을미사변·단발령', P[0]], ['주권 빼앗김', P[1]]].forEach(([l, x], i) => {
      body += line(x, 114, x, 172, C.blue, 2, { width: 3, delay: 0.7 + i * 0.4 }) + at(2, 'drop', tag(x, 96, l, ROLE.s, 20), 0.4 + i * 0.4);
    });
    // 칸 3: 한 일
    body += at(3, 'rise', tag(80, 274, '한 일', ROLE.o, 20));
    [['의병 활동', P[0], 252], ['의병가 짓기', P[0], 300], ['중국으로 떠남', P[1], 252], ['독립운동', P[1], 300]].forEach(([l, x, y], i) => {
      body += at(3, 'rise', tag(x, y, l, ROLE.o, 20), 0.4 + i * 0.3);
    });
    body += P.map((x, i) => line(x, 194, x, 234, C.orange, 3, { width: 3, delay: 0.3 + i * 0.6 })).join('');
    // 칸 4
    body += at(4, 'pop', tag(320, 28, '전기문', ROLE.p, 24), 1.2);
    css += pulseCss(id, '.who', 4, 0.4);
    put(K + '1/전기문', svg(id, body, css));
  })();

  // ── 1단원: 독서 감상문(『권기옥』 → 책 제목·인물이 한 일·생각과 느낌·내 삶과 잇기) ──────────────────────────────
  (function () {
    const id = 't61-k1-gamsang';
    let css = base(id);
    const BX = 116, BY = 190;
    let body = at(1, 'pop', `<g class="bk">` + `<rect x="36" y="100" width="160" height="180" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<rect x="36" y="100" width="20" height="180" rx="6" fill="${C.blue}" opacity=".45"/>` + text(126, 170, '권기옥', { size: 28 })
      + `<path d="M98 238 L154 214 L132 248 Z M132 248 L128 232 L154 214" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/></g>`);
    css += pulseCss(id, '.bk', 1, 0.5);
    body += at(1, 'fin', `<rect x="236" y="22" width="386" height="316" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + [70, 148, 226].map((y) => `<path d="M256 ${y + 30} H602" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`).join(''), 0.6);
    const rowsY = [70, 148, 226, 302];
    const labels = [['책 제목', ROLE.s, 2], ['인물이 한 일', ROLE.s, 2], ['생각·느낌', ROLE.o, 3], ['내 삶과 잇기', ROLE.o, 3]];
    labels.forEach(([l, r, n], i) => { body += at(n, 'pop', tag(324, rowsY[i], l, r, 18), (i % 2) * 0.5); });
    // 칸 2: 책에서 날아온 제목과 한 일
    [['『권기옥』', 0], ['끝까지 노력함', 1]].forEach(([l, i], k) => {
      body += `<g class="b2"><g class="fc${k}">${tile(516, rowsY[i], l, { size: 20, h: 46, fill: 'white', stroke: C.blue })}</g></g>`;
      css += move(id, `fc${k}`, `translate(${BX - 516}px, ${BY - rowsY[i]}px) scale(.5)`, 2, { dur: 1, delay: 0.3 + k * 0.5 });
    });
    // 칸 3: 내 생각과 다짐
    body += at(3, 'pop', tile(516, rowsY[2], '용기 있는 사람', { size: 20, h: 46, fill: C.peach, stroke: C.orange }), 0.4);
    body += [0, 1].map((k) => `<g class="b3"><rect class="gr" style="transition-delay:${1.0 + k * 0.3}s" x="440" y="${rowsY[3] - 14 + k * 20}" width="${k ? 110 : 150}" height="10" rx="5" fill="${C.orange}" opacity=".7"/></g>`).join('');
    css += growCss(id, '.gr', 3);
    // 칸 4
    body += glowRect(232, 18, 394, 324, 4, C.green, 0.1, 18) + at(4, 'pop', tag(116, 62, '독서 감상문', ROLE.y, 22), 0.6);
    put(K + '1/독서 감상문', svg(id, body, css));
  })();

  // ── 2단원: 고쳐쓰기(글 → 문단 → 문장 차례로 다듬기) ──────────────────────────────
  (function () {
    const id = 't61-k1-gochyeo';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="30" y="24" width="300" height="312" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    const strip = [C.blue, C.orange, C.green, C.purple];
    const bw = [[240, 220, 150], [230, 240, 130], [245, 210, 170], [220, 235, 140]];
    for (let k = 0; k < 4; k++) {
      const y0 = 46 + k * 72;
      let blk = `<rect x="44" y="${y0}" width="8" height="58" rx="4" fill="${strip[k]}"/>`;
      bw[k].forEach((w, j) => {
        const r = `<rect x="64" y="${y0 + 4 + j * 20}" width="${w}" height="10" rx="5" fill="${GRAY}"/>`;
        if (k === 3 && j === 1) blk += `<g class="rb"><rect class="rbar" x="64" y="${y0 + 4 + j * 20}" width="${w}" height="10" rx="5" fill="${GRAY}"/></g>`;
        else if (k === 3 && j === 2) blk += `<g class="up">${r}</g>`;
        else blk += r;
      });
      body += `<g class="bk${k}">${at(1, 'rise', blk, k * 0.12)}</g>`;
    }
    // 칸 1: 차례가 어색한 두 문단의 자리를 바꾼다
    css += move(id, 'bk1', 'none', 1, { dur: 1, delay: 1.0, to: 'translateY(72px)' }) + move(id, 'bk2', 'none', 1, { dur: 1, delay: 1.0, to: 'translateY(-72px)' });
    // 단계 이름표
    const lv = [['글', 398], ['문단', 486], ['문장', 584]];
    lv.forEach(([l, x], i) => { body += at(1, 'fin', tile(x, 46, l, { size: 20, h: 38, rx: 19, w: l.length === 1 ? 54 : 74, fill: 'white', stroke: C.line, sw: 2.5, cls: `lv${i}` }), 0.3); });
    body += at(1, 'fin', `<path d="M430 46 H444 M528 46 H542" stroke="${C.muted}" stroke-width="3"/>` + head(446, 46, 0, C.muted, 3) + head(544, 46, 0, C.muted, 3), 0.3);
    lv.forEach((_, i) => { css += paint(id, `.lv${i}`, ROLE.y, i + 1, 0.4) + pulseCss(id, `.lv${i}`, i + 1, 0.4); });
    body += glowRect(36, 112, 288, 148, 1, C.orange, 0.6, 12);
    // 칸 2: 어울리지 않는 문장을 지운다
    css += `.sc-${id} .rbar { transition: fill .5s ease .3s; } .on2 .sc-${id} .rbar { fill: ${C.red}; }`;
    css += `.sc-${id} .rb { transition: transform .8s ease-in-out 1.3s, opacity .5s ease 1.6s; } .on2 .sc-${id} .rb { transform: translateX(60px); opacity: 0; }`;
    css += `.sc-${id} .up { transition: transform .6s ease-in-out 1.9s; } .on2 .sc-${id} .up { transform: translateY(-20px); }`;
    body += glowRect(36, 256, 288, 70, 2, C.red, 0.2, 12);
    // 칸 3: 문장 하나를 크게 보고 고친다
    body += at(3, 'fin', dashed(304, 54, 346, 150, C.blue) + `<rect x="346" y="100" width="282" height="196" rx="14" fill="white" stroke="${C.blue}" stroke-width="3"/>`);
    body += at(3, 'rise', tile(424, 160, '패트리샤는', { size: 20, h: 46 }), 0.3);
    body += `<g class="b3"><g class="old">${tile(560, 160, '설계됐다', { size: 20, h: 46, cls: 'od' })}</g></g>`;
    css += paint(id, '.od', [C.peach, C.red], 3, 0.4) + `.on3 .sc-${id} .od { animation: ${id}-shake .5s ease-in-out .5s 2; }`
      + `.sc-${id} .old { transition: opacity .4s ease; } .on3 .sc-${id} .old { opacity: 0; transition-delay: 1.4s; }`;
    body += `<g class="b3"><g class="old">${g('pop pop3', cross(560, 222, 11), 0.6)}</g></g>`;
    body += at(3, 'drop', tile(560, 160, '설계했다', { size: 20, h: 46, fill: C.mint, stroke: C.green }), 1.6);
    body += at(3, 'pop', check(560, 240, 11), 1.9);
    // 칸 4
    body += glowRect(26, 20, 308, 320, 4, C.green, 0.1, 18) + at(4, 'pop', tag(487, 326, '고쳐쓰기', ROLE.y, 22), 0.6);
    put(K + '2/고쳐쓰기', svg(id, body, css));
  })();

  // ── 2단원: 중심 문장(「불안」 둘째 문단 — 첫 문장이 위로, 나머지가 아래에서 풀어 줌) ──────────────────────────────
  (function () {
    const id = 't61-k1-jungsim';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="30" y="52" width="270" height="270" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(1, 'pop', tag(165, 28, '한 문단', ['white', C.muted], 18));
    const ys = [100, 160, 220, 280], ws = [196, 176, 196, 160];
    ys.forEach((y, k) => {
      body += `<g class="${k ? 'dim dim4' : ''}">` + at(1, 'pop', `<circle cx="58" cy="${y}" r="15" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + text(58, y + 7, String(k + 1), { size: 18, color: C.muted }), 0.2 + k * 0.25)
        + `<g class="b1">${g('slide slide1', `<rect class="sb sb${k}" x="84" y="${y - 8}" width="${ws[k]}" height="16" rx="8" fill="${GRAY}"/>`, 0.3 + k * 0.25)}</g></g>`;
    });
    css += `.sc-${id} .sb { transition: fill .5s ease .2s; } .on2 .sc-${id} .sb0 { fill: ${C.orange}; } .on3 .sc-${id} .sb1, .on3 .sc-${id} .sb2, .on3 .sc-${id} .sb3 { fill: ${C.green}; }`;
    // 날아가는 막대
    const fly = (k, n, tx, ty, d) => {
      css += `.sc-${id} .fl${k} { transition: transform .9s ease-in-out ${d}s, opacity .3s ease ${d + 0.75}s; } .on${n} .sc-${id} .fl${k} { transform: translate(${f(tx)}px, ${f(ty)}px); opacity: 0; }`;
      return `<g class="b${n}"><g class="fl${k}"><rect x="84" y="${ys[k] - 8}" width="${ws[k]}" height="16" rx="8" fill="${k ? C.green : C.orange}"/></g></g>`;
    };
    // 칸 2: 첫 문장이 위 오른쪽 조각이 된다
    body += fly(0, 2, 470 - (84 + ws[0] / 2), 82 - ys[0], 0.6);
    body += at(2, 'pop', `<g class="top">${tile(470, 82, '몸의 여러 반응', { size: 22, h: 56, fill: TAN, stroke: C.orange, sw: 3 })}</g>`, 1.3);
    // 칸 3: 나머지 세 문장이 그 아래를 풀어 준다
    const subs = ['집중 못 함', '숨 가쁨·배 아픔', '몸과 마음 연결'], sy = [176, 236, 296];
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M372 110 V${sy[2]}" stroke="${C.green}" stroke-width="4" fill="none" style="transition-delay:.3s"/></g>`;
    subs.forEach((l, i) => {
      const w = wOf(l, 18) + 6;
      body += fly(i + 1, 3, 392 + w / 2 - (84 + ws[i + 1] / 2), sy[i] - ys[i + 1], 0.3 + i * 0.25);
      body += line(372, sy[i], 392, sy[i], C.green, 3, { width: 4, delay: 0.9 + i * 0.25 });
      body += at(3, 'pop', tile(392 + w / 2, sy[i], l, { size: 18, h: 42, w, fill: C.mint, stroke: C.green }), 1.0 + i * 0.25);
    });
    // 칸 4
    body += glowRect(470 - wOf('몸의 여러 반응', 22) / 2 - 8, 46, wOf('몸의 여러 반응', 22) + 16, 72, 4, C.orange, 0.1, 16);
    css += pulseCss(id, '.top', 4, 0.3) + pulseCss(id, '.sb0', 4, 0.3);
    body += at(4, 'pop', tag(470, 24, '중심 문장', ROLE.y, 22), 0.6);
    put(K + '2/중심 문장', svg(id, body, css));
  })();

  // ── 2단원: 뒷받침 문장(「의자병을 극복하자」 — 기둥 셋이 지붕을 받치고 명상 기둥은 빠진다) ──────────────────────────────
  (function () {
    const id = 't61-k1-dwit';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M40 314 H600" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`);
    body += at(1, 'drop', `<g class="roof">${tile(320, 74, '오래 앉으면 건강에 나쁨', { size: 22, h: 56, w: 470, fill: TAN, stroke: C.orange, sw: 3 })}</g>`, 0.2);
    body += at(1, 'pop', tag(320, 22, '중심 문장', ROLE.y, 18), 0.7);
    const xs = [110, 250, 390, 530], labels = ['혈액 순환', '목이 굽음', '허리 비뚤어짐', '눈 감고 명상'];
    xs.forEach((x, i) => {
      const inner = `<g class="b2"><rect class="col col${i}" style="transition-delay:${0.2 + i * 0.25}s" x="${x - 10}" y="102" width="20" height="148" rx="4" fill="#d6dfdb"/></g>`
        + at(2, 'rise', tile(x, 278, labels[i], { size: 18, h: 46, cls: `p${i}` }), 0.5 + i * 0.25);
      body += i === 3 ? `<g class="pf">${inner}</g>` : inner;
    });
    css += `.sc-${id} .col { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform .7s ease-out, fill .5s ease; }
      .on2 .sc-${id} .col { transform: none; }
      .on2 .sc-${id} .col0, .on2 .sc-${id} .col1, .on2 .sc-${id} .col2 { fill: ${C.green}; }`;
    css += [0, 1, 2].map((i) => paint(id, `.p${i}`, ROLE.p, 2, 1.6)).join('');
    css += `.on2 .sc-${id} .col0, .on2 .sc-${id} .col1, .on2 .sc-${id} .col2 { transition: transform .7s ease-out, fill .5s ease 1.6s; }`;
    // 칸 3: 명상 기둥은 받치지 못하고 넘어진다
    css += paint(id, '.p3', [C.peach, C.red], 3, 0.2) + `.on3 .sc-${id} .col3 { fill: ${C.red}; transition: transform .7s ease-out, fill .5s ease .2s; }`;
    css += `.sc-${id} .pf { transform-box: fill-box; transform-origin: center bottom; transition: transform 1s ease-in, opacity .6s ease; }
      .on3 .sc-${id} .pf { transform: translate(40px, 30px) rotate(28deg); opacity: 0; transition-delay: 1.2s; }
      .on3 .sc-${id} .p3 { animation: ${id}-shake .5s ease-in-out .3s 2; }`;
    body += `<g class="b3 h4">${g('pop pop3', cross(530, 186, 12), 1.0)}</g>`;
    // 칸 4
    body += xs.slice(0, 3).map((x, i) => glowRect(x - wOf(labels[i], 18) / 2 - 7, 248, wOf(labels[i], 18) + 14, 60, 4, C.green, 0.1 + i * 0.15, 14)).join('');
    css += pulseCss(id, '.roof', 4, 0.6);
    body += at(4, 'pop', tag(320, 340, '뒷받침 문장', ROLE.p, 20), 0.8);
    put(K + '2/뒷받침 문장', svg(id, body, css));
  })();

  // ── 2단원: 명료하다(흐릿한 말이 또렷해진다) ──────────────────────────────
  (function () {
    const id = 't61-k1-myeongryo';
    let css = base(id);
    let body = `<defs><filter id="t61k1-blur" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>`;
    body += at(1, 'fin', person(62, 214, C.blue) + person(584, 214, C.purple));
    body += at(1, 'pop', `<path d="M140 200 L96 222 L150 214 Z" fill="white" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/><rect x="116" y="84" width="408" height="150" rx="24" fill="white" stroke="${C.line}" stroke-width="3"/><path d="M128 199 L148 199 L146 214 Z" fill="white"/>`, 0.2);
    // 흐릿한 말
    const fz = row(['그게', '좀', '그런', '것 같아요'], { y: 159, size: 24, gap: 12 });
    body += `<g class="fz">${at(1, 'fin', `<g filter="url(#t61k1-blur)">${fz.map((p) => T(p, { color: C.muted, stroke: C.line })).join('')}</g>`, 0.5)}</g>`;
    css += `.sc-${id} .fz { transition: opacity .7s ease .9s; } .on2 .sc-${id} .fz { opacity: 0; }`;
    body += `<g class="h3">${at(1, 'pop', g('shake shake1', text(584, 150, '?', { size: 44, color: C.red, weight: 800 }), 0.6), 1.0)}</g>`;
    // 칸 2: 초점 맞추기 — 네 귀퉁이가 조여 들고 또렷한 말이 나타난다
    const corner = (x, y, sx, sy) => `<path d="M${x} ${y + sy * 26} V${y} H${x + sx * 26}" stroke="${C.blue}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    body += `<g class="b2"><g class="fc">${corner(104, 72, 1, 1) + corner(536, 72, -1, 1) + corner(104, 246, 1, -1) + corner(536, 246, -1, -1)}</g></g>`;
    css += `.sc-${id} .fc { transform-box: view-box; transform-origin: 320px 159px; transform: scale(1.25); transition: transform .9s ease-in-out .1s; } .on2 .sc-${id} .fc { transform: none; }`;
    const sh = row(['저는', '반대합니다'], { y: 130, size: 26, gap: 14 });
    body += sh.map((p, i) => at(2, 'pop', T(p, { fill: C.sky, stroke: C.blue }), 1.1 + i * 0.2)).join('');
    // 칸 3: 까닭까지 덧붙이니 듣는 사람이 알아듣는다
    body += at(3, 'slide', tile(320, 194, '까닭은 두 가지', { size: 24, h: 50, fill: C.sky, stroke: C.blue }), 0.3);
    body += at(3, 'pop', check(584, 146, 14), 1.0);
    // 칸 4
    body += glowRect(sh[0].l - 12, 96, sh[1].r - sh[0].l + 24, 128, 4, C.blue, 0.1, 18);
    body += at(4, 'pop', tag(320, 296, '명료하다', ROLE.s, 24), 0.6);
    put(K + '2/명료하다', svg(id, body, css));
  })();

  // ── 2단원: 간결하다(지후의 첫 문장 — 겹친 '불안한 감정' 셋이 빠지고 줄이 짧아진다) ──────────────────────────────
  (function () {
    const id = 't61-k1-gangyeol';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="36" y="62" width="568" height="202" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    const TW = 112, GAP = 10, X0 = 56;
    // [b 막대폭 | t 조각(rep 이면 겹친 말)]
    const rows = [[['b', 70], ['t', 0], ['b', 110], ['t', 1], ['b', 50]], [['b', 140], ['t', 1], ['b', 90], ['b', 100]], [['b', 80], ['t', 1], ['b', 150], ['b', 60]]];
    const ys = [104, 164, 224];
    let total0 = 0, total1 = 0, nRep = 0;
    rows.forEach((items, r) => {
      let x = X0, removed = 0;
      items.forEach(([k, v], j) => {
        const w = k === 't' ? TW : v, cx = x + w / 2, y = ys[r];
        const cls = `it it${r}${j}`;
        let inner;
        if (k === 't') inner = tile(cx, y, '불안한 감정', { size: 20, h: 40, w: TW, fill: v ? 'white' : C.sky, stroke: v ? C.line : C.blue, cls: v ? `rep rp${nRep}` : '' });
        else inner = `<rect x="${f(x)}" y="${y - 6}" width="${w}" height="12" rx="6" fill="${GRAY}"/>`;
        if (k === 't' && v) {
          body += `<g class="${cls} gone">${at(1, 'fin', inner, 0.2 + r * 0.2)}</g>`;
          css += `.on2 .sc-${id} .rp${nRep} { animation: ${id}-shake .5s ease-in-out ${0.4 + nRep * 0.2}s 2; }`;
          removed += TW + GAP; nRep++;
        } else {
          body += `<g class="${cls}">${at(1, 'fin', inner, 0.2 + r * 0.2)}</g>`;
          if (removed) css += `.sc-${id} .it${r}${j} { transition: transform .8s ease-in-out 1.0s; } .on3 .sc-${id} .it${r}${j} { transform: translateX(-${removed}px); }`;
        }
        total0 += w + GAP; if (!(k === 't' && v)) total1 += w + GAP;
        x += w + GAP;
      });
    });
    css += paint(id, '.rep', [C.peach, C.red], 2, 0.2);
    css += `.sc-${id} .gone { transition: transform .7s ease-in, opacity .5s ease; } .on3 .sc-${id} .gone { transform: translateY(40px); opacity: 0; transition-delay: .2s; }`;
    // 길이 막대
    body += at(1, 'fin', text(66, 313, '길이', { size: 18, color: C.muted, anchor: 'start' }), 0.8);
    body += at(1, 'fin', `<rect x="116" y="299" width="480" height="18" rx="9" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 6"/><g class="ml"><rect x="116" y="299" width="480" height="18" rx="9" fill="${C.muted}"/></g>`, 0.8);
    css += `.sc-${id} .ml { transform-box: fill-box; transform-origin: left center; transition: transform 1s ease-in-out 1.2s, fill .5s; } .on3 .sc-${id} .ml { transform: scaleX(${f(total1 / total0)}); }`;
    body += at(3, 'pop', check(116 + 480 * total1 / total0 + 30, 308, 10), 2.0);
    // 칸 4
    body += glowRect(32, 58, 576, 210, 4, C.green, 0.1, 18) + at(4, 'pop', tag(320, 30, '간결하다', ROLE.p, 22), 0.5);
    put(K + '2/간결하다', svg(id, body, css));
  })();

  // ── 2단원: 문장 성분(선은 / 선물을 / 준비했다) ──────────────────────────────
  (function () {
    const id = 't61-k1-seongbun';
    let css = base(id);
    const words = ['선은', '선물을', '준비했다'], roles = ['s', 'o', 'p'];
    const names = ['주어', '목적어', '서술어'], asks = ['누가', '무엇을', '어찌하다'];
    const R = row(words, { y: 165, size: 30, gap: 44 }), J = row(words, { y: 165, size: 30, gap: 0 });
    let body = '';
    R.forEach((p, i) => {
      body += `<g class="pc${i}">${at(1, 'rise', T(p, { cls: `w${i}` }), 0.1)}</g>`;
      css += move(id, `pc${i}`, `translateX(${f(J[i].cx - p.cx)}px)`, 2, { dur: 0.9, delay: 0.3 });
    });
    // 칸 2: 갈라지는 금
    body += [0, 1].map((i) => `<g class="b2 h3">${g('fin fin2', `<path d="M${f((J[i].r + J[i + 1].l) / 2)} 128 l-7 12 l9 10 l-8 14 l8 12 l-6 12" stroke="${C.red}" stroke-width="3" fill="none" stroke-linejoin="round"/>`)}</g>`).join('');
    // 칸 3: 색과 이름
    R.forEach((p, i) => {
      css += paint(id, `.w${i}`, ROLE[roles[i]], 3, 0.2 + i * 0.3);
      body += at(3, 'drop', tag(p.cx, 239, names[i], ROLE[roles[i]]), 0.5 + i * 0.3) + at(3, 'fin', text(p.cx, 288, asks[i], { size: 18, color: C.muted }), 0.7 + i * 0.3);
    });
    // 칸 4
    body += `<g class="b4">${g('fin fin4', braceTop(R[0].l - 8, R[2].r + 8, 121) + tag(320, 87, '문장 성분', ROLE.p, 22), 0.3)}</g>`;
    css += R.map((_, i) => pulseCss(id, `.w${i}`, 4, 0.5 + i * 0.15)).join('');
    put(K + '2/문장 성분', svg(id, body, css));
  })();

  // ── 2단원: 주어(빈자리에 '선은' — 누가?) ──────────────────────────────
  (function () {
    const id = 't61-k1-jueo';
    let css = base(id);
    const r1 = row(['선은', '지아와', '단짝이', '되었다'], { y: 120, x0: 140, gap: 16, size: 26 });
    let body = at(1, 'fin', `<g class="h2">${tile(r1[0].cx, 120, '?', { size: 26, w: r1[0].w, h: 56, dash: '8 6', stroke: C.blue, color: C.blue })}</g>`);
    body += r1.slice(1).map((p, i) => at(1, 'rise', T(p), 0.2 + i * 0.2)).join('');
    body += `<g class="h3">${curve(r1[3].cx, 90, r1[0].cx + 8, 89, 42, C.blue, 1, { delay: 0.9 })}</g>`;
    body += `<g class="b1 h3">${g('fin fin1', tag((r1[0].cx + r1[3].cx) / 2, 42, '누가?', ROLE.s), 1.6)}</g>`;
    // 칸 2: '선은' 이 빈자리에
    body += at(2, 'drop', `<g class="sj">${T(r1[0], { fill: C.sky, stroke: C.blue })}</g>`, 0.3);
    body += `<g class="b2">${[0, 0.5].map((s) => `<rect class="ring ring2"${dl(0.8 + s)} x="${f(r1[0].l)}" y="92" width="${r1[0].w}" height="56" rx="12" fill="none" stroke="${C.blue}" stroke-width="4"/>`).join('')}</g>`;
    body += at(2, 'drop', tag(r1[0].cx, 176, '누가', ROLE.s), 0.9);
    css += `.on2 .sc-${id} .ring2 { animation-name: ${id}-ring2; } @keyframes ${id}-ring2 { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.2); } }`;
    // 칸 3: 잎싹이 용감하다
    const r2 = row(['잎싹이', '용감하다'], { y: 258, x0: 140, gap: 16, size: 26 });
    body += r2.map((p, i) => at(3, 'rise', T(p, { cls: `r2${i}` }), i * 0.25)).join('');
    css += paint(id, '.r20', ROLE.s, 3, 0.8);
    body += at(3, 'drop', tag(r2[0].cx, 314, '누가', ROLE.s), 1.1);
    // 칸 4
    body += `<g class="b4">${g('fin fin4', brace(118, 92, 286, C.blue) + tag(66, 189, '주어', ROLE.s, 22))}</g>`;
    css += pulseCss(id, '.sj', 4, 0.4) + pulseCss(id, '.r20', 4, 0.6);
    put(K + '2/주어', svg(id, body, css));
  })();

  // ── 2단원: 목적어(빈자리에 '선을' — 누구를?) ──────────────────────────────
  (function () {
    const id = 't61-k1-mokjeok';
    let css = base(id);
    const r = row(['나는', '영화를 보는 내내', '선을', '응원했다'], { y: 185, x0: 50, gap: 16, size: 24 });
    let body = r.map((p, i) => (i === 2 ? '' : at(1, 'rise', `<g class="w${i}">${T(p)}</g>`, i * 0.2))).join('');
    body += at(1, 'fin', `<g class="h2">${tile(r[2].cx, 185, '?', { size: 24, w: r[2].w, h: 56, dash: '8 6', stroke: C.orange, color: C.orange })}</g>`, 0.6);
    body += `<g class="h3">${curve(r[3].cx, 155, r[2].cx + 6, 154, 110, C.orange, 1, { delay: 0.9 })}</g>`;
    body += `<g class="b1 h3">${g('fin fin1', tag((r[2].cx + r[3].cx) / 2, 106, '누구를?', ROLE.o), 1.6)}</g>`;
    // 칸 2: '선을'
    body += at(2, 'drop', `<g class="w2">${T(r[2], { fill: C.peach, stroke: C.orange })}</g>`, 0.3);
    body += `<g class="b2">${[0, 0.5].map((s) => `<rect class="ring ring2"${dl(0.8 + s)} x="${f(r[2].l)}" y="157" width="${r[2].w}" height="56" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/>`).join('')}</g>`;
    css += `.on2 .sc-${id} .ring2 { animation-name: ${id}-ring2; } @keyframes ${id}-ring2 { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.2); } }`;
    // 칸 3: 응원하는 쪽, 응원받는 쪽
    css += paint(id, '.w0', ROLE.s, 3, 0.3);
    body += curve(r[0].cx, 216, r[2].cx, 217, 252, C.muted, 3, { width: 3, delay: 0.4 });
    body += at(3, 'drop', tag(r[0].cx + 22, 292, '응원하는 쪽', ROLE.s, 19), 0.9) + at(3, 'drop', tag(r[2].cx, 292, '응원받는 쪽', ROLE.o, 19), 1.3);
    // 칸 4
    body += at(4, 'drop', tag(r[2].cx, 115, '목적어', ROLE.o, 22), 0.3);
    css += pulseCss(id, '.w2', 4, 0.6);
    put(K + '2/목적어', svg(id, body, css));
  })();

  // ── 2단원: 서술어(어찌하다·어떠하다·무엇이다) ──────────────────────────────
  (function () {
    const id = 't61-k1-seosul';
    let css = base(id);
    const rows = [[['선은'], '슬퍼한다', '어찌하다'], [['잎싹이'], '용감하다', '어떠하다'], [['선은', '멋진'], '친구이다', '무엇이다']];
    const END = 432, ys = [82, 178, 274];
    let body = `<g class="b4">${g('fin fin4', `<rect x="270" y="44" width="170" height="268" rx="14" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="10 7"/>` + tag(355, 24, '서술어', ROLE.p, 22))}</g>`;
    rows.forEach(([front, pred, q], i) => {
      const y = ys[i], wp = wOf(pred);
      const pp = { label: pred, cx: END - wp / 2, w: wp, y, size: 28 };
      let x = END - wp - 16, fr = '';
      for (let k = front.length - 1; k >= 0; k--) { const w = wOf(front[k]); fr = T({ label: front[k], cx: x - w / 2, w, y, size: 28 }, { cls: k === 0 ? `sb${i}` : '' }) + fr; x -= w + 16; }
      body += at(i + 1, 'slide', fr);
      body += at(i + 1, 'drop', `<g class="pr${i}">${T(pp)}</g>`, 0.6);
      body += at(i + 1, 'pop', tag(530, y, q, ROLE.p), 1.3);
      css += paint(id, `.pr${i}`, ROLE.p, i + 1, 0.9) + paint(id, `.sb${i}`, ROLE.s, i + 1, 0.3);
    });
    css += [0, 1, 2].map((i) => pulseCss(id, `.pr${i}`, 4, 0.4 + i * 0.2)).join('');
    put(K + '2/서술어', svg(id, body, css));
  })();

  // ── 2단원: 호응(어제 ↔ 시청했다, 패트리샤는 ↔ 설계했다) ──────────────────────────────
  (function () {
    const id = 't61-k1-hoeung';
    let css = base(id);
    const r1 = row(['나는', '어제', '다큐멘터리를', '시청할 것이다'], { y: 118, x0: 44, gap: 12, size: 24 });
    const fix1 = { label: '시청했다', w: wOf('시청했다', 24), y: 118, size: 24 }; fix1.cx = r1[3].l + fix1.w / 2;
    let body = r1.map((p, i) => (i === 3 ? '' : at(1, 'rise', T(p, { cls: `a${i}` }), i * 0.15))).join('');
    body += `<g class="b1"><g class="o1">${g('rise rise1', T(r1[3], { cls: 'a3' }), 0.45)}</g></g>`;
    css += paint(id, '.a1', ROLE.x, 1, 0.6) + paint(id, '.a3', [C.peach, C.red], 1, 0.9) + `.on1 .sc-${id} .a3 { animation: ${id}-shake .5s ease-in-out 1.4s 2; }`;
    body += `<g class="h2">${curve(r1[1].cx, 90, r1[3].cx, 90, 44, C.red, 1, { width: 5, arrowHead: false, delay: 0.6 })}`
      + `<g class="b1">${g('pop pop1', cross((r1[1].cx + r1[3].cx) / 2, 44, 12), 1.5)}</g></g>`;
    // 칸 2: 시청했다로 바꾸기
    css += `.sc-${id} .o1 { transition: transform .6s ease-in, opacity .4s ease; } .on2 .sc-${id} .o1 { transform: translateY(40px); opacity: 0; transition-delay: .2s; }`;
    body += at(2, 'drop', `<g class="f1">${T(fix1, { fill: C.mint, stroke: C.green })}</g>`, 0.8);
    const m1 = (r1[1].cx + fix1.cx) / 2;
    body += curve(r1[1].cx, 90, fix1.cx, 90, 44, C.green, 2, { width: 5, arrowHead: false, delay: 1.0 });
    body += `<g class="b2 h4">${g('pop pop2', check(m1, 44, 12), 1.8)}</g>`;
    // 칸 3: 패트리샤는 ↔ 설계했다
    const r2 = row(['패트리샤는', '손잡이를', '설계됐다'], { y: 270, x0: 44, gap: 12, size: 24 });
    const fix2 = { label: '설계했다', w: r2[2].w, y: 270, size: 24, cx: r2[2].cx };
    body += `<g class="dim dim4">` + r2.map((p, i) => (i === 2 ? '' : at(3, 'rise', T(p, { cls: `c${i}` }), i * 0.15))).join('');
    body += `<g class="b3"><g class="o2">${g('rise rise3', T(r2[2], { cls: 'c2' }), 0.3)}</g></g>`;
    css += paint(id, '.c0', ROLE.x, 3, 0.4) + paint(id, '.c2', [C.peach, C.red], 3, 0.5) + `.on3 .sc-${id} .c2 { animation: ${id}-shake .5s ease-in-out .6s 1; }`;
    css += `.sc-${id} .o2 { transition: transform .5s ease-in, opacity .4s ease; } .on3 .sc-${id} .o2 { transform: translateY(40px); opacity: 0; transition-delay: 1.2s; }`;
    body += at(3, 'drop', T(fix2, { fill: C.mint, stroke: C.green }), 1.5);
    body += curve(r2[0].cx, 242, fix2.cx, 242, 204, C.green, 3, { width: 5, arrowHead: false, delay: 1.5 }) + '</g>';
    // 칸 4
    body += `<g class="b4">${g('flash flash4', `<path d="M${r1[1].cx} 90 Q${m1} -2 ${fix1.cx} 90" stroke="${C.green}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".4"/>`)}</g>`;
    body += at(4, 'pop', tag(m1, 44, '호응', ROLE.p, 22), 0.3);
    css += pulseCss(id, '.a1', 4, 0.5) + pulseCss(id, '.f1', 4, 0.5);
    put(K + '2/호응', svg(id, body, css));
  })();

  // ── 2단원: 교정 부호(원고지 위의 띄어 쓰기 ∨, 붙여 쓰기 ⌒, 고치기) ──────────────────────────────
  (function () {
    const id = 't61-k1-gyojeong';
    let css = base(id);
    const X0 = 50, CW = 50, TOP = [52, 152, 252];
    const grid = (top) => {
      let s = `<rect x="${X0}" y="${top}" width="${CW * 7}" height="${CW}" fill="white" stroke="${C.green}" stroke-width="2.5"/>`;
      for (let i = 1; i < 7; i++) s += `<path d="M${X0 + i * CW} ${top} V${top + CW}" stroke="${C.green}" stroke-width="1.5"/>`;
      return s;
    };
    const ch = (i, top, c, color = C.ink) => text(X0 + i * CW + CW / 2, top + 35, c, { size: 28, color });
    const RED = C.red;
    let body = '';
    // 칸 1: 한두∨개가
    let t = TOP[0];
    body += at(1, 'fin', grid(t) + ch(0, t, '한') + ch(1, t, '두'));
    body += `<g class="b1"><g class="m1">${ch(2, t, '개') + ch(3, t, '가')}</g></g>`;
    body += `<g class="b1"><path class="draw draw1" pathLength="1" d="M${X0 + 2 * CW - 12} ${t - 26} L${X0 + 2 * CW} ${t - 3} L${X0 + 2 * CW + 12} ${t - 26}" stroke="${RED}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transition-delay:.3s"/></g>`;
    css += move(id, 'm1', 'none', 1, { dur: 0.8, delay: 1.3, to: `translateX(${CW}px)` });
    // 칸 2: 친구 들과 → 친구들과
    t = TOP[1];
    body += at(2, 'fin', grid(t) + ch(0, t, '친') + ch(1, t, '구'));
    body += `<g class="b2"><g class="m2">${ch(3, t, '들') + ch(4, t, '과')}</g></g>`;
    body += `<g class="b2"><g class="a2"><path class="draw draw2" pathLength="1" d="M${X0 + 1.5 * CW} ${t - 4} Q${X0 + 2.5 * CW} ${t - 40} ${X0 + 3.5 * CW} ${t - 4}" stroke="${RED}" stroke-width="4.5" fill="none" stroke-linecap="round" style="transition-delay:.3s"/></g></g>`;
    css += `.sc-${id} .a2 { transform-box: view-box; transform-origin: ${X0 + 1.5 * CW}px ${t - 4}px; transition: transform .8s ease-in-out 1.3s; } .on2 .sc-${id} .a2 { transform: scaleX(.5); }`;
    css += move(id, 'm2', 'none', 2, { dur: 0.8, delay: 1.3, to: `translateX(-${CW}px)` });
    // 칸 3: 됐 → 했
    t = TOP[2];
    body += at(3, 'fin', grid(t) + ch(0, t, '설') + ch(1, t, '계') + ch(3, t, '다'));
    body += `<g class="b3"><g class="old">${ch(2, t, '됐')}<path class="draw draw3" pathLength="1" d="M${X0 + 2 * CW + 6} ${t + 40} L${X0 + 3 * CW - 6} ${t + 10}" stroke="${RED}" stroke-width="4.5" fill="none" stroke-linecap="round" style="transition-delay:.3s"/></g></g>`;
    body += `<g class="b3"><g class="nw">${g('fin fin3', text(X0 + 2.5 * CW, t - 8, '했', { size: 26, color: RED }), 0.9)}</g></g>`;
    css += `.sc-${id} .old { transition: opacity .4s ease; } .on3 .sc-${id} .old { opacity: 0; transition-delay: 1.6s; }`;
    css += move(id, 'nw', 'none', 3, { dur: 0.6, delay: 1.6, to: 'translateY(43px)' });
    // 오른쪽: 부호와 이름
    const sym = [
      `<path d="M432 ${TOP[0] + 12} L444 ${TOP[0] + 36} L456 ${TOP[0] + 12}" stroke="${RED}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<path d="M424 ${TOP[1] + 34} Q444 ${TOP[1] + 6} 464 ${TOP[1] + 34}" stroke="${RED}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
      text(444, TOP[2] + 20, '했', { size: 20, color: RED }) + `<path d="M430 ${TOP[2] + 46} L458 ${TOP[2] + 26}" stroke="${RED}" stroke-width="4" stroke-linecap="round"/>` + text(444, TOP[2] + 44, '됐', { size: 18, color: C.muted })];
    const names = ['띄어 쓰기', '붙여 쓰기', '고치기'];
    sym.forEach((s, i) => {
      body += at(i + 1, 'pop', `<g class="sy sy${i}">` + `<rect x="410" y="${TOP[i] - 2}" width="68" height="54" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/>` + s + '</g>', 1.0);
      body += at(i + 1, 'pop', tag(556, TOP[i] + 25, names[i], ROLE.y, 20), 1.3);
    });
    // 칸 4
    body += [0, 1, 2].map((i) => glowRect(406, TOP[i] - 6, 64 + 152 + 6, 62, 4, C.orange, 0.1 + i * 0.2, 12)).join('');
    body += at(4, 'pop', tag(225, 338, '교정 부호', ROLE.p, 22), 0.9);
    put(K + '2/교정 부호', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
