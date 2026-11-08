// 국어 6-2 낱말 도식: 그림으로는 보일 수 없는 문법·글의 짜임 낱말을 낱말 조각(타일)과 글 모양으로 움직여 보인다.
// 도구(tile·tag·row·curve·base·move 따위)는 figures/5-2/kor.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
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

  // ── 6-2 에서 더 쓰는 도구 ──────────────────────────────
  const K = '6-2/국어/';
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

  // ── 독서 단원: 십진분류법 ──────────────────────────────
  (function () {
    const id = 't62-kr-sipjin';
    const names = ['총류', '철학', '종교', '사회과학', '자연과학', '기술과학', '예술', '언어', '문학', '역사'];
    const bx = (i) => 80 + (i % 5) * 120, by = (i) => (i < 5 ? 82 : 196);
    let css = base(id);
    let body = '';
    names.forEach((nm, i) => {
      const x = bx(i), y = by(i);
      body += `<g class="bx${i}">` + at(1, 'pop', `<g class="tl"><rect class="bg" x="${x - 54}" y="${y - 50}" width="108" height="100" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/></g>` + text(x, y - 2, i, { size: 36, color: C.green }), i * 0.12)
        + at(2, 'fin', text(x, y + 34, nm, { size: 19, color: C.ink }), i * 0.12) + '</g>';
    });
    // 책: 813 (맨 앞 8 에 동그라미)
    const book = `<rect x="-50" y="-30" width="100" height="60" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="-50" y="-30" width="12" height="60" rx="3" fill="${C.blue}"/>`
      + `<text x="-14" y="10" text-anchor="middle" font-size="28" font-weight="800" fill="${C.orange}">8</text>` + text(20, 10, '13', { size: 28 })
      + `<g class="b3"><circle class="flash flash3" style="animation-delay:.6s" cx="-14" cy="0" r="17" fill="none" stroke="${C.orange}" stroke-width="3.5"/></g>`;
    body += at(3, 'slide', `<g class="bk"><g transform="translate(210 306)">${book}</g></g>`);
    body += `<g class="b3">${g('fin fin3', `<path d="M440 270 V254" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>` + head(440, 250, -Math.PI / 2, C.orange, 4), 2.1)}</g>`;
    body += glowRect(20, 26, 600, 226, 4, C.green, 0.2) + at(4, 'pop', tag(140, 306, '십진분류법', ROLE.p, 22), 0.5);
    css += move(id, 'bk', 'none', 3, { to: 'translateX(230px)', dur: 1, delay: 1 });
    css += paint(id, '.bx8', [C.mint, C.green], 3, 2.1) + `.on3 .sc-${id} .bx8 .tl { animation: ${id}-pulse .7s ease-in-out 2.2s 2; transform-box: fill-box; transform-origin: center; }`;
    put(K + 'reading/십진분류법', svg(id, body, css));
  })();

  // ── 1단원: 시조(단심가) ──────────────────────────────
  (function () {
    const id = 't62-k1-sijo';
    const lines = [['이 몸이', '죽고 죽어', '일백 번', '고쳐 죽어'], ['백골이', '진토 되어', '넋이라도', '있고 없고'], ['임 향한', '일편단심이야', '가실 줄이', '있으랴']];
    const counts = [[3, 4, 3, 4], [3, 4, 4, 4], [3, 6, 4, 3]];
    const ys = [82, 176, 270], names = ['첫 줄', '둘째 줄', '셋째 줄'];
    let css = base(id);
    let body = '';
    lines.forEach((ln, k) => {
      const r = row(ln, { y: ys[k], x0: 124, gap: 12, size: 21 });
      body += r.map((p, i) => at(1, 'slide', `<g class="ck c${k}${i}">${tile(p.cx, p.y, p.label, { size: 21, h: 46, w: p.w, fill: C.paper, stroke: C.paper })}</g>`, k * 0.5 + i * 0.08)).join('');
      body += r.map((p, i) => at(2, 'pop', text(p.cx, p.y + 47, counts[k][i], { size: 19, color: k === 2 && i === 0 ? C.orange : C.muted }), 0.3 + k * 0.4 + i * 0.12)).join('');
      body += at(3, 'pop', tag(64, ys[k], names[k], ROLE.p, 19), k * 0.35);
      if (k === 2) body += `<g class="b3"><circle class="ring ring3" style="animation-delay:1.2s" cx="${r[0].cx}" cy="${ys[k] + 41}" r="15" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`;
    });
    css += paint(id, '.ck', ['white', C.line], 2) + paint(id, '.c20', [C.peach, C.orange], 3, 1.2);
    body += glowRect(14, 50, 612, 290, 4, C.green, 0.2) + at(4, 'drop', tag(320, 28, '시조', ROLE.p, 22), 0.5);
    put(K + '1/시조', svg(id, body, css));
  })();

  // ── 1단원: 이야기 구조와 네 단계(원숭이 꽃신) ──────────────────────────────
  const PLOT = {
    p: [[40, 292, 100, 292, 140, 284, 180, 266], [180, 266, 240, 236, 320, 160, 380, 104], [380, 104, 410, 76, 450, 70, 480, 96], [480, 96, 520, 140, 560, 250, 610, 276]],
    X: [40, 180, 380, 480, 622], mid: [110, 280, 430, 545], names: ['발단', '전개', '절정', '결말'],
    col: [ROLE.s, ROLE.o, [C.peach, C.red], ROLE.p]
  };
  const segD = (p) => `M${p[0]} ${p[1]} C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}`;
  const bz = (p, t) => { const u = 1 - t; return [u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6], u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7]]; };
  const segPath = (k, color, n, width, delay = 0, dur = 0.8) => `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="${segD(PLOT.p[k])}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" style="transition-delay:${delay}s;transition-duration:${dur}s"/></g>`;
  // 단계마다 놓이는 사건 조각
  const plotChips = (k, n, delay = 0) => {
    const chip = (x, y, label, s) => at(n, k === 1 ? 'rise' : 'pop', g(k === 2 ? 'shake shake' + n : '', tag(f(x), f(y), label, [TAN, C.orange], 18), 0.5), delay + s);
    if (k === 0) return chip(110, 245, '꽃신 선물', 0);
    if (k === 1) return [[0.3, '잣 5'], [0.62, '잣 10'], [0.92, '잣 20']].map(([t, l], i) => { const [x, y] = bz(PLOT.p[1], t); return chip(x - 26, y - 40, l, i * 0.3); }).join('');
    if (k === 2) return chip(432, 40, '잣 100', 0) + `<g class="b${n}"><circle class="ring ring${n}" style="animation-delay:${delay + 0.4}s" cx="430" cy="80" r="12" fill="${C.red}" opacity=".6"/></g>`;
    return chip(566, 96, '내 손으로', 0);
  };
  const plotFrame = (n) => {
    let s = at(n, 'fin', `<path d="M30 306 H620" stroke="${C.line}" stroke-width="3"/><path d="M24 306 V68" stroke="${C.muted}" stroke-width="3"/>` + head(24, 62, -Math.PI / 2, C.muted, 3) + text(38, 96, '긴장', { size: 18, color: C.muted, anchor: 'start' }));
    return s;
  };
  const dividers = (n, delay = 0) => `<g class="b${n}">` + [1, 2, 3].map((k) => g(`fin fin${n}`, `<path d="M${PLOT.X[k]} 56 V306" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 7"/>`, delay + k * 0.15)).join('') + '</g>';
  const stageTag = (k, n, delay) => at(n, 'pop', `<g class="pt${k}">${tag(PLOT.mid[k], 334, PLOT.names[k], ['white', C.line], 20)}</g>`, delay);

  (function () {
    const id = 't62-k1-gujo';
    let css = base(id);
    let body = plotFrame(1);
    body += PLOT.p.map((_, k) => segPath(k, C.ink, 1, 5, 0.15 + k * 0.45, 0.5)).join('');
    body += dividers(2);
    body += PLOT.p.map((_, k) => segPath(k, PLOT.col[k][1], 2, 7, 0.3 + k * 0.5, 0.6)).join('');
    body += PLOT.names.map((_, k) => stageTag(k, 2, 0.3 + k * 0.5)).join('');
    css += PLOT.names.map((_, k) => paint(id, `.pt${k}`, PLOT.col[k], 2, 0.6 + k * 0.5)).join('');
    body += [0, 1, 2, 3].map((k) => plotChips(k, 3, [0, 0.3, 1.2, 1.5][k])).join('');
    body += glowRect(12, 62, 616, 292, 4, C.green, 0.2) + at(4, 'drop', tag(250, 30, '이야기 구조', ROLE.p, 22), 0.5);
    put(K + '1/이야기 구조', svg(id, body, css));
  })();

  PLOT.names.forEach((name, focus) => {
    const id = 't62-k1-st' + focus;
    const [tint, edge] = PLOT.col[focus];
    let css = base(id);
    let body = at(2, 'fin', `<rect x="${PLOT.X[focus] + 3}" y="62" width="${PLOT.X[focus + 1] - PLOT.X[focus] - 6}" height="242" rx="10" fill="${tint}" opacity=".7"/>`, 0.1);
    body += `<g class="dim dim4">` + plotFrame(1) + PLOT.p.map((_, k) => segPath(k, C.line, 1, 5, k * 0.4, 0.5)).join('') + dividers(1, 1) + '</g>';
    body += segPath(focus, edge, 2, 8, 0.5, 1.1);
    body += PLOT.names.map((_, k) => `<g class="${k === focus ? '' : 'dim dim4'}">${stageTag(k, 1, 1.2 + k * 0.15)}</g>`).join('');
    css += paint(id, `.pt${focus}`, PLOT.col[focus], 2, 0.4) + `.on2 .sc-${id} .pt${focus} .tl, .on4 .sc-${id} .pt${focus} .tl { animation: ${id}-pulse .7s ease-in-out .5s 2; transform-box: fill-box; transform-origin: center; }`;
    body += plotChips(focus, 3, 0.3);
    body += glowRect(PLOT.X[focus] - 2, 58, PLOT.X[focus + 1] - PLOT.X[focus] + 4, 251, 4, edge, 0.2, 12);
    put(K + '1/' + name, svg(id, body, css));
  });

  // ── 4단원: 국어사전 세 낱말(고유어·한자어·외래어) ──────────────────────────────
  const dictCard = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/><rect x="${x}" y="${y}" width="16" height="${h}" rx="6" fill="${C.sky}"/>`;

  // 고유어: 하늘 뒤에는 아무것도 붙어 있지 않다
  (function () {
    const id = 't62-k4-goyu';
    const ys = [96, 180, 264], heads = ['하늘', '미술', '벤치'];
    let css = base(id);
    let body = at(1, 'fin', dictCard(70, 40, 420, 280) + text(96, 30, '국어사전', { size: 18, color: C.muted, anchor: 'start' }));
    body += heads.map((w, i) => `<g class="${i ? 'dim dim4' : ''}">` + at(1, 'pop', tile(190, ys[i], w, { size: 30, w: 120 }), 0.3 + i * 0.3) + '</g>').join('');
    body += `<g class="dim dim4">` + at(2, 'slide', tile(350, ys[1], '美術', { size: 28, w: 120, fill: C.sky, stroke: C.blue }), 0.2)
      + at(2, 'slide', tile(350, ys[2], 'bench', { size: 26, w: 120, fill: C.peach, stroke: C.orange }), 0.8) + '</g>';
    body += `<g class="b3">${g('flash flash3', `<rect x="290" y="${ys[0] - 28}" width="120" height="56" rx="12" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="9 7"/>`, 0.2)}</g>`;
    body += at(3, 'pop', check(440, ys[0], 12), 1.2);
    body += glowRect(118, ys[0] - 38, 362, 76, 4, C.green, 0.1) + at(4, 'pop', tag(560, ys[0], '고유어', ROLE.p, 22), 0.5);
    put(K + '4/고유어', svg(id, body, css));
  })();

  // 한자어: 미술 = 美術, 글자마다 한자가 있다(위아래로 놓고 글자끼리 잇는다)
  (function () {
    const id = 't62-k4-hanja';
    let css = base(id);
    let body = at(1, 'fin', dictCard(170, 40, 300, 280) + text(196, 30, '국어사전', { size: 18, color: C.muted, anchor: 'start' }));
    body += at(1, 'pop', charTile(330, 104, ['미', '술'], { size: 40, h: 70, w: 150, cls: 'hg' }), 0.3);
    body += at(2, 'rise', charTile(330, 256, ['美', '術'], { size: 40, h: 70, w: 150, fill: C.sky, stroke: C.blue, cls: 'hj' }), 0.2);
    const link = (x, color, delay) => `<g class="b3"><path class="draw draw3" pathLength="1" d="M${x} 218 V144" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round" style="transition-delay:${delay}s"/>${g('fin fin3', head(x, 144, -Math.PI / 2, color, 5), delay + 0.8)}</g>`;
    body += link(310, C.blue, 0.3) + link(350, C.orange, 1);
    css += `.sc-${id} .ch { transition: fill .5s ease; }
      .on3 .sc-${id} .hj .ch0, .on3 .sc-${id} .hg .ch0 { fill: ${C.blue}; transition-delay: .9s; }
      .on3 .sc-${id} .hj .ch1, .on3 .sc-${id} .hg .ch1 { fill: ${C.orange}; transition-delay: 1.6s; }`;
    body += glowRect(240, 58, 180, 244, 4, C.blue, 0.1) + at(4, 'pop', tag(548, 180, '한자어', ROLE.s, 22), 0.5);
    put(K + '4/한자어', svg(id, body, css));
  })();

  // 외래어: 벤치(bench) — 외국에서 들어와 우리말 속에서 쓰인다
  (function () {
    const id = 't62-k4-oerae';
    let css = base(id);
    let body = at(1, 'fin', dictCard(110, 30, 420, 110) + text(136, 22, '국어사전', { size: 18, color: C.muted, anchor: 'start' }));
    body += at(1, 'pop', tile(250, 85, '벤치', { size: 30, w: 120 }), 0.3);
    body += at(2, 'slide', tile(410, 85, 'bench', { size: 28, w: 130, fill: C.peach, stroke: C.orange }), 0.2);
    // 아래: 외국 → 우리말
    body += `<g class="dim dim4">` + at(3, 'fin', `<ellipse cx="110" cy="252" rx="80" ry="62" fill="${C.peach}" opacity=".7"/>` + tag(110, 182, '외국', ROLE.o, 20)) + '</g>';
    body += at(3, 'fin', `<rect x="290" y="186" width="330" height="122" rx="16" fill="${C.mint}" opacity=".7"/>` + tag(455, 186, '우리말', ROLE.p, 20), 0.2);
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M190 252 H262" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round" style="transition-delay:.6s"/>${g('fin fin3', head(268, 252, 0, C.orange, 5), 1.5)}</g>`;
    body += at(3, 'pop', tile(370, 228, '버스', { size: 24, h: 46 }), 0.4) + at(3, 'pop', tile(540, 228, '피자', { size: 24, h: 46 }), 0.6);
    body += `<g class="b3"><g class="fly">${tile(455, 276, '벤치', { size: 24, h: 46, fill: C.peach, stroke: C.orange })}</g></g>`;
    css += `.sc-${id} .fly { transform: translate(-345px, -24px); opacity: 0; transition: transform 1.2s ease-in-out .8s, opacity .4s ease .8s; }
      .on3 .sc-${id} .fly { transform: none; opacity: 1; }`;
    body += glowRect(296, 200, 318, 102, 4, C.green, 0.1) + at(4, 'pop', tag(455, 334, '외래어', ROLE.p, 22), 0.5);
    put(K + '4/외래어', svg(id, body, css));
  })();

  // ── 4단원: 관용 표현(날개 돋치다) ──────────────────────────────
  (function () {
    const id = 't62-k4-gwanyong';
    let css = base(id);
    // 깃털 끝이 물결진 새 날개(뿌리 x, y 에서 오른쪽 위로 뻗음)
    const wing = (x, y, s = 1) => {
      const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
      const sw = 3 * Math.max(s, 0.8);
      return `<path d="M${P(0, 0)} C${P(8, -34)} ${P(50, -60)} ${P(98, -56)} Q${P(94, -34)} ${P(72, -32)} Q${P(76, -14)} ${P(52, -16)} Q${P(54, 2)} ${P(30, -2)} Q${P(22, 12)} ${P(0, 0)} Z" fill="white" stroke="${C.blue}" stroke-width="${sw}" stroke-linejoin="round"/>`
        + (s > 0.6 ? `<path d="M${P(18, -12)} Q${P(46, -30)} ${P(84, -46)} M${P(14, -4)} Q${P(32, -14)} ${P(58, -24)}" stroke="${C.blue}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>` : '');
    };
    let body = `<g class="wl">${at(1, 'rise', tile(250, 70, '날개', { size: 30, w: 120 }))}</g><g class="wr">${at(1, 'rise', tile(400, 70, '돋치다', { size: 30, w: 140 }), 0.3)}</g>`;
    body += `<g class="b3">${g('fin fin3', `<rect x="${330 - 150}" y="38" width="300" height="64" rx="16" fill="none" stroke="${C.purple}" stroke-width="4"/>`, 1)}</g>`;
    // 낱말 뜻 그대로: 날개가 돋음
    body += `<g class="dim dim3">` + at(2, 'fin', `<rect x="40" y="140" width="250" height="190" rx="16" fill="${C.sky}" opacity=".6"/>`) + at(2, 'pop', `<g class="flap">${wing(104, 262, 1.1)}</g>`, 0.4)
      + at(2, 'pop', tag(165, 300, '낱말 뜻 그대로', ROLE.s, 19), 0.9) + '</g>';
    // 새 뜻: 물건이 날개 돋친 듯 팔려 나감
    body += at(3, 'fin', `<rect x="350" y="140" width="260" height="190" rx="16" fill="${C.lilac}" opacity=".7"/><path d="M372 262 H590" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/>`, 0.2);
    const box = (x) => `<g class="sold" style="animation-delay:${((x - 390) / 40) * 0.35}s"><rect x="${x - 14}" y="234" width="28" height="26" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>${wing(x - 4, 236, 0.35)}</g>`;
    body += `<g class="b3">${[390, 430, 470, 510].map(box).join('')}</g>`;
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M330 104 Q330 140 420 170" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-dasharray="1" style="transition-delay:.4s"/></g>`;
    body += at(3, 'pop', tag(480, 300, '빨리 팔림', ROLE.x, 20), 1.4);
    body += at(4, 'drop', tag(330, 20, '관용 표현', ROLE.x, 22), 0.4);
    css += move(id, 'wl', 'none', 3, { to: 'translateX(9px)', delay: 0.2 }) + move(id, 'wr', 'none', 3, { to: 'translateX(-9px)', delay: 0.2 });
    css += `.sc-${id} .flap { transform-box: fill-box; transform-origin: left bottom; animation: ${id}-flap 1s ease-in-out infinite alternate; }
      @keyframes ${id}-flap { from { transform: rotate(6deg); } to { transform: rotate(-8deg); } }
      .sc-${id} .sold { opacity: 0; }
      .on3 .sc-${id} .sold { animation: ${id}-sold 1.6s ease-in infinite; }
      @keyframes ${id}-sold { 0% { opacity: 1; transform: none; } 15% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translate(70px, -70px); } }
      .on4 .sc-${id} .wl .tl, .on4 .sc-${id} .wr .tl { animation: ${id}-pulse .7s ease-in-out .6s 2; transform-box: fill-box; transform-origin: center; }`;
    put(K + '4/관용 표현', svg(id, body, css));
  })();

  // ── 4단원: 줄임말(점심 메뉴 추천 → 점메추) ──────────────────────────────
  (function () {
    const id = 't62-k4-julim';
    const words = [['점', '심'], ['메', '뉴'], ['추', '천']], xs = [170, 320, 470];
    let css = base(id);
    let body = words.map((w, i) => at(1, 'rise', charTile(xs[i], 100, w, { size: 32, h: 62, w: 120, cls: 'wd' }), i * 0.3)).join('');
    body += `<g class="b2">` + xs.map((x, i) => `<rect class="flash flash2" style="animation-delay:${0.3 + i * 0.3}s" x="${x - 37}" y="76" width="42" height="48" rx="8" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`).join('') + '</g>';
    // 아래 줄: 점·메·추가 날아와 붙는다
    const fx = [288, 320, 352];
    body += at(3, 'fin', `<rect x="250" y="236" width="140" height="68" rx="14" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>`, 1.3);
    body += words.map((w, i) => `<g class="b3"><g class="fl fl${i}">${text(fx[i], 282, w[0], { size: 32, color: C.orange })}</g></g>`).join('');
    words.forEach((w, i) => { css += `.sc-${id} .fl${i} { transform: translate(${xs[i] - 16 - fx[i]}px, -170px); transition: transform 1s ease-in-out ${0.2 + i * 0.25}s; } .on3 .sc-${id} .fl${i} { transform: none; }`; });
    css += `.sc-${id} .ch { transition: fill .5s ease, opacity .5s ease; }
      .on2 .sc-${id} .wd .ch0 { fill: ${C.orange}; }
      .on2 .sc-${id} .wd .ch1 { opacity: .3; transition-delay: 1.2s; }`;
    body += `<g class="b3">` + xs.map((x, i) => g('fin fin3', `<path d="M${x - 16} 140 L${fx[i]} 226" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="6 6" opacity=".6"/>`, 0.2 + i * 0.25)).join('') + '</g>';
    body += glowRect(242, 228, 156, 84, 4, C.orange, 0.1) + at(4, 'pop', tag(490, 270, '줄임말', ROLE.y, 22), 0.5);
    put(K + '4/줄임말', svg(id, body, css));
  })();

  // ── 4단원: 철자법(더프면·덥흐면·덥프면 → 덮으면) ──────────────────────────────
  (function () {
    const id = 't62-k4-cheolja';
    const wrong = [['더프면', 140, 92, -7], ['덥흐면', 320, 72, 4], ['덥프면', 500, 98, -4]];
    let css = base(id);
    let body = wrong.map(([w, x, y, r], i) => `<g class="wg wg${i}"><g transform="rotate(${r} ${x} ${y})">${at(1, 'pop', tile(x, y, w, { size: 28, w: 130 }), i * 0.35)}</g></g>`).join('');
    body += `<g class="b1 h2">` + wrong.map(([, x, y], i) => g('pop pop1', text(x + 74, y - 26, '?', { size: 30, color: C.orange }), 1.2 + i * 0.2)).join('') + '</g>';
    // 규칙 책
    const rule = `<rect x="-58" y="-36" width="116" height="72" rx="8" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M0 -36 V36" stroke="${C.green}" stroke-width="3"/>`
      + [-20, -6, 8].map((dy) => `<path d="M-44 ${dy} H-12 M12 ${dy} H44" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>`).join('');
    body += at(2, 'drop', `<g transform="translate(320 180)">${rule}</g>` + tag(320, 250, '규칙', ROLE.p, 19), 0.3);
    body += `<g class="b3">` + wrong.map(([, x, y], i) => g('pop pop3', cross(x + 70, y - 30, 10), 0.3 + i * 0.2)).join('') + '</g>';
    body += at(3, 'pop', tile(320, 306, '덮으면', { size: 30, w: 140, fill: C.mint, stroke: C.green }), 1.2) + at(3, 'pop', check(420, 306, 12), 1.6);
    body += glowRect(250, 134, 140, 136, 4, C.green, 0.1) + at(4, 'pop', tag(470, 196, '철자법', ROLE.p, 22), 0.5);
    css += wrong.map((_, i) => `.sc-${id} .wg${i} { transition: opacity .8s ease ${0.8 + i * 0.2}s; } .on3 .sc-${id} .wg${i} { opacity: .3; }`).join('');
    put(K + '4/철자법', svg(id, body, css));
  })();

  // ── 5단원: 문자 언어 ──────────────────────────────
  (function () {
    const id = 't62-k5-munja';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="50" y="50" width="300" height="250" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(200, 98, '길 안내', { size: 26 }) + `<path d="M76 116 H324" stroke="${C.line}" stroke-width="2"/>`);
    body += at(1, 'fin', text(74, 170, '골목에서 오른쪽', { size: 24, anchor: 'start' }), 0.5);
    body += `<g class="b3"><rect class="hl" x="70" y="208" width="58" height="36" rx="6" fill="${C.yellow}" opacity=".55"/></g>`;
    body += at(1, 'fin', `<text x="74" y="234" font-size="24" font-weight="700" fill="${C.ink}"><tspan class="em">약국</tspan>에서 길 건너기</text>`, 1);
    // 눈과 시계: 시간이 지나도 다시 읽는다
    body += at(2, 'pop', eye(470, 110), 0.2);
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M440 116 Q400 140 360 160" stroke="${C.blue}" stroke-width="3" stroke-dasharray="1" fill="none" style="transition-delay:.6s"/>${g('fin fin2', head(358, 161, Math.atan2(20, -40), C.blue, 3), 1.4)}</g>`;
    body += at(2, 'pop', `<circle cx="470" cy="240" r="40" fill="white" stroke="${C.ink}" stroke-width="3.5"/><path d="M470 240 V212" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><g class="hand"><path d="M470 240 H496" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/></g>`, 0.4);
    body += glowRect(44, 44, 312, 262, 4, C.blue, 0.1) + at(4, 'pop', tag(200, 330, '문자 언어', ROLE.s, 22), 0.5);
    css += `.sc-${id} .hand { transform-origin: 470px 240px; }
      .on2 .sc-${id} .hand { animation: ${id}-tick 2s linear .6s infinite; }
      @keyframes ${id}-tick { to { transform: rotate(360deg); } }
      .sc-${id} .em { transition: fill .5s ease .3s; } .on3 .sc-${id} .em { fill: ${C.orange}; font-weight: 900; }
      .sc-${id} .hl { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out .2s; } .on3 .sc-${id} .hl { transform: none; }
      .on3 .sc-${id} .em { text-decoration: underline; }`;
    put(K + '5/문자 언어', svg(id, body, css));
  })();

  // ── 5단원: 음성 언어 ──────────────────────────────
  (function () {
    const id = 't62-k5-eumseong';
    let css = base(id);
    let body = at(1, 'pop', person(90, 170, C.blue, 24)) + at(1, 'fin', waves(134, 128, C.blue));
    const r = row(['약국이 나오면', '길 건너기'], { y: 128, x0: 200, gap: 14, size: 24 });
    body += r.map((p, i) => `<g class="b1"><g class="sp sp${i}">${T(p, { h: 50 })}</g></g>`).join('');
    body += `<g class="b2">` + r.map((p) => g('fin fin2', `<rect x="${p.l}" y="103" width="${p.w}" height="50" rx="12" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 7"/>`, 1.6)).join('') + '</g>';
    // 힘주어 말하기
    body += at(3, 'fin', waves(134, 128, C.orange, 'snd big', 1.5), 0.2);
    body += at(3, 'pop', g('pulse pulse3', tile(300, 262, '약국', { size: 40, h: 72, w: 150, fill: TAN, stroke: C.orange }), 0.6), 0.4);
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M150 176 Q190 250 218 258" stroke="${C.orange}" stroke-width="3.5" fill="none" style="transition-delay:.2s"/></g>`;
    body += glowRect(22, 74, 172, 168, 4, C.blue, 0.1) + at(4, 'pop', tag(510, 262, '음성 언어', ROLE.s, 22), 0.5);
    css += r.map((_, i) => `.sc-${id} .sp${i} { opacity: 0; transition: opacity .5s ease ${0.3 + i * 0.6}s, transform 1.2s ease-in ${0.3 + i * 0.4}s; }
      .on1 .sc-${id} .sp${i} { opacity: 1; }
      .on2 .sc-${id} .sp${i} { opacity: 0; transform: translate(40px, -24px); }`).join('');
    css += `.sc-${id} .snd { animation: ${id}-snd 1.2s ease-in-out infinite; }
      @keyframes ${id}-snd { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }`;
    put(K + '5/음성 언어', svg(id, body, css));
  })();

  // ── 5단원: 억양(밥 먹었어? / 밥 먹었어.) ──────────────────────────────
  (function () {
    const id = 't62-k5-eogyang';
    const sy = ['밥', '먹', '었', '어'], xs = [150, 228, 306, 384];
    let css = base(id);
    let body = '';
    const rowOf = (k, y, n, m, shift, end, label, col, d0) => {
      let s = sy.map((c, i) => at(n, 'rise', `<g class="s${k}${i}">${tile(xs[i], y, c, { size: 30, w: 64, h: 58 })}</g>`, i * 0.15)).join('');
      const pts = xs.map((x, i) => [x, y - 50 + (i === 3 ? shift : i === 2 ? shift * 0.15 : 0)]);
      const d = `M${pts[0][0] - 20} ${pts[0][1]} L${pts[2][0]} ${pts[2][1]} Q${pts[3][0] - 20} ${pts[2][1]} ${pts[3][0] + 22} ${pts[3][1]}`;
      s += `<g class="b${m}"><path class="draw draw${m} pl${k}" pathLength="1" d="${d}" stroke="${col[1]}" stroke-width="5" fill="none" stroke-linecap="round" style="transition-delay:${d0}s"/>${g(`fin fin${m}`, head(pts[3][0] + 22, pts[3][1], Math.atan2(pts[3][1] - pts[2][1], 42), col[1], 5), d0 + 0.9)}</g>`;
      s += at(m, 'pop', text(434, y + shift + 12, end, { size: 40, color: col[1] }), d0 + 1) + at(m, 'pop', tag(536, y + shift / 2, label, col, 20), d0 + 1.3);
      css += move(id, `s${k}3`, 'none', m, { to: `translateY(${shift}px)`, delay: d0 });
      return s;
    };
    body += rowOf(0, 140, 1, 2, -34, '?', '묻는 말', ROLE.s, 0.2);
    body += rowOf(1, 268, 3, 3, 26, '.', '알려 주는 말', ROLE.o, 0.5);
    body += at(4, 'pop', tag(56, 204, '억양', ROLE.p, 22), 0.5);
    css += glowCss(id, '.pl0', 4, 0.3) + glowCss(id, '.pl1', 4, 0.6);
    put(K + '5/억양', svg(id, body, css));
  })();

  // ── 5단원: 신문 기사 한 편(표제·부제·전문·본문) ──────────────────────────────
  const NEWS = { x: 160, w: 330, band: { pyoje: [62, 42], buje: [106, 28], jeonmun: [138, 62], bonmun: [206, 132] } };
  const newsPage = (id, keep) => {
    const x = NEWS.x, w = NEWS.w, L = x + 22, R = x + w - 22;
    const band = (k, fill) => { const [y, h] = NEWS.band[k]; return `<rect class="band bd-${k}" x="${x + 8}" y="${y}" width="${w - 16}" height="${h}" rx="8" fill="${fill}"/>`; };
    const part = (k, inner) => `<g class="pa ${k === keep ? '' : 'dim dimL'}">${inner}</g>`;
    let s = `<rect x="${x}" y="12" width="${w}" height="334" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    s += band(keep, { pyoje: TAN, buje: C.lilac, jeonmun: C.sky, bonmun: C.mint }[keep]);
    s += `<g class="ln">` + part('', text(L, 40, '희망일보', { size: 18, color: C.muted, anchor: 'start' }) + `<path d="M${L} 50 H${R}" stroke="${C.line}" stroke-width="2"/>`) + '</g>';
    s += `<g class="ln">` + part('pyoje', `<g class="ttl">${text(x + w / 2, 93, '예술 진로 캠프 개최', { size: 28 })}</g>`) + '</g>';
    s += `<g class="ln">` + part('buje', text(x + w / 2, 127, '― 예술 직업을 탐구해요 ―', { size: 19, color: C.ink, weight: 600 })) + '</g>';
    s += `<g class="ln">` + part('jeonmun', [152, 169, 186].map((y, i) => bar(L, y, i === 2 ? 180 : R - L, '#8fa39b', 9, 'gr')).join('')) + '</g>';
    const by = [216, 231, 249, 264, 282, 297, 315, 330];
    s += `<g class="ln">` + part('bonmun', by.map((y, i) => bar(L + (i % 2 ? 0 : 14), y, (R - L) - (i % 2 ? 60 : 14), '#b5c4be', 8, 'gr')).join('')) + '</g>';
    return { body: s, by };
  };
  const newsCss = (id, n) => barCss(id) + `
    .sc-${id} .band { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .9s ease-out .2s; }
    .on2 .sc-${id} .band { transform: none; }
    .sc-${id} .ln { opacity: 0; }
    ${[1, 2, 3, 4, 5].map((i) => `.on1 .sc-${id} .ln:nth-of-type(${i}) { animation: ${id}-fin .45s ease-out ${(i * 0.3).toFixed(1)}s both; }`).join('\n')}
    .sc-${id} .dimL { transition: opacity .6s ease; } .on${n} .sc-${id} .dimL { opacity: .3; }`;
  const newsTag = (k, label, col, n) => { const [y, h] = NEWS.band[k]; return at(n, 'pop', tag(80, y + h / 2, label, col, 22), 0.4); };
  const newsGlow = (k, col, n) => { const [y, h] = NEWS.band[k]; return glowRect(NEWS.x + 4, y - 4, NEWS.w - 8, h + 8, n, col, 0.1, 10); };

  (function () {
    const id = 't62-k5-pyoje';
    const P = newsPage(id, 'pyoje');
    let css = base(id) + newsCss(id, 3);
    let body = P.body + newsGlow('pyoje', C.orange, 3) + newsTag('pyoje', '표제', ROLE.y, 3);
    css += `.sc-${id} .ttl { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .ttl { animation: ${id}-pulse .8s ease-in-out .8s 2; }`;
    body += at(2, 'pop', tag(560, 83, '큰 제목', ROLE.y, 19), 1);
    put(K + '5/표제', svg(id, body, css));
  })();

  (function () {
    const id = 't62-k5-buje';
    const P = newsPage(id, 'buje');
    let css = base(id) + newsCss(id, 4);
    let body = P.body;
    body += at(2, 'pop', tag(560, 120, '작은 제목', ROLE.x, 19), 1);
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M478 120 Q520 104 470 84" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linecap="round"/>${g('fin fin3', head(470, 84, Math.atan2(-20, -50), C.purple, 4), 0.9)}</g>`;
    body += `<g class="b3">${g('pop pop3', `<circle cx="535" cy="70" r="17" fill="white" stroke="${C.purple}" stroke-width="3"/><path d="M526 70 H544 M535 61 V79" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/>`, 1.1)}</g>`;
    body += newsGlow('buje', C.purple, 4) + newsTag('buje', '부제', ROLE.x, 4);
    put(K + '5/부제', svg(id, body, css));
  })();

  (function () {
    const id = 't62-k5-jeonmun';
    const P = newsPage(id, 'jeonmun');
    let css = base(id) + newsCss(id, 4);
    let body = P.body;
    // 본문 줄이 위로 눌려 올라가 전문이 된다
    body += `<g class="b3"><g class="sq">${P.by.map((y) => bar(NEWS.x + 22, y, NEWS.w - 44, C.blue, 8)).join('')}</g></g>`;
    body += `<g class="b3">${g('fin fin3', `<path d="M512 300 V170" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>` + head(512, 166, -Math.PI / 2, C.blue, 4), 0.2)}</g>`;
    body += at(3, 'pop', tag(570, 270, '본문', ROLE.p, 19), 0.3) + at(3, 'pop', tag(570, 169, '간추림', ROLE.s, 19), 1.4);
    css += `.sc-${id} .sq { transform-box: fill-box; transform-origin: center top; opacity: .55; transition: transform 1.3s ease-in-out .5s, opacity 1.3s ease .5s; }
      .on3 .sc-${id} .sq { transform: translateY(-74px) scaleY(.42); opacity: 0; }`;
    css += glowCss(id, '.bd-jeonmun', 3, 1.6);
    body += newsGlow('jeonmun', C.blue, 4) + newsTag('jeonmun', '전문', ROLE.s, 4);
    put(K + '5/전문', svg(id, body, css));
  })();

  (function () {
    const id = 't62-k5-bonmun';
    const P = newsPage(id, 'bonmun');
    let css = base(id) + newsCss(id, 4);
    let body = P.body;
    const labels = ['1~2학년', '3~4학년', '5~6학년', '소감'];
    body += labels.map((l, i) => at(3, 'slide', `<circle cx="508" cy="${(P.by[i * 2] + P.by[i * 2 + 1]) / 2}" r="5" fill="${C.green}"/>` + text(520, (P.by[i * 2] + P.by[i * 2 + 1]) / 2 + 7, l, { size: 18, anchor: 'start', color: C.green }), i * 0.4)).join('');
    body += newsGlow('bonmun', C.green, 4) + newsTag('bonmun', '본문', ROLE.p, 4);
    put(K + '5/본문', svg(id, body, css));
  })();

  // ── 5단원: 육하원칙 ──────────────────────────────
  (function () {
    const id = 't62-k5-yukha';
    const qs = [['누가', '1~6학년 학생'], ['언제', '11월 8~9일'], ['어디에서', '희망초등학교'], ['무엇을', '진로 캠프 참여'], ['어떻게', '직업 체험'], ['왜', '적성 찾기']];
    const ys = [104, 184, 264];
    let css = base(id);
    let body = '';
    qs.forEach(([q, a], i) => {
      const col = i < 3 ? 0 : 1, y = ys[i % 3], qx = col ? 392 : 70, ax = col ? 532 : 210;
      body += at(1, 'pop', tag(qx, y, q, ROLE.s, 20), i * 0.25);
      body += at(i < 3 ? 2 : 3, 'slide', tile(ax, y, a, { size: 20, h: 42, fill: TAN, stroke: C.orange }), (i % 3) * 0.6 + 0.2);
    });
    body += glowRect(22, 72, 596, 224, 4, C.blue, 0.2) + at(4, 'drop', tag(320, 36, '육하원칙', ROLE.s, 22), 0.5);
    put(K + '5/육하원칙', svg(id, body, css));
  })();

  // ── 5단원: 기사문 ──────────────────────────────
  (function () {
    const id = 't62-k5-gisa';
    let css = base(id) + barCss(id);
    const icons = [[eye(80, 92), '보기'], [ear(76, 180), '듣기'], [lens(82, 268), '묻기']];
    let body = icons.map(([ic, l], i) => at(1, 'pop', ic + text(140, [92, 180, 268][i] + 7, l, { size: 19, anchor: 'start' }), i * 0.4)).join('');
    body += `<g class="b2">` + [92, 180, 268].map((y, i) => g('fin fin2', `<path d="M196 ${y} Q240 ${y} 270 ${180 + (i - 1) * 30}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-dasharray="6 6"/>`, i * 0.15)).join('') + '</g>';
    const X = 290, W = 250;
    body += at(2, 'fin', `<rect x="${X}" y="40" width="${W}" height="290" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`, 0.3);
    body += at(2, 'rise', text(X + W / 2, 90, '운동회 소식', { size: 26 }), 0.6);
    body += at(2, 'rise', `<g>${[124, 140, 156].map((y, i) => bar(X + 20, y, i === 2 ? 140 : W - 40, '#8fa39b', 8)).join('')}</g>`, 1.1);
    body += at(2, 'rise', `<g>${[192, 208, 224, 248, 264, 280, 304].map((y, i) => bar(X + 20, y, i === 6 ? 120 : W - 40, '#b5c4be', 8)).join('')}</g>`, 1.6);
    body += at(2, 'pop', tag(592, 84, '제목', ROLE.y, 19), 0.9) + at(2, 'pop', tag(592, 140, '전문', ROLE.s, 19), 1.4) + at(2, 'pop', tag(592, 248, '본문', ROLE.p, 19), 1.9);
    body += at(3, 'pop', `<g transform="rotate(-10 ${X + 190} 296)"><rect x="${X + 150}" y="276" width="80" height="40" rx="8" fill="white" stroke="${C.red}" stroke-width="3.5"/>${text(X + 190, 304, '사실', { size: 22, color: C.red })}</g>`, 0.4);
    body += glowRect(X - 6, 34, W + 12, 302, 4, C.green, 0.1) + at(4, 'drop', tag(X + W / 2, 24 + 4, '기사문', ROLE.p, 22), 0.4);
    put(K + '5/기사문', svg(id, body, css));
  })();

  // ── 5단원: 간결 ──────────────────────────────
  (function () {
    const id = 't62-k5-gangyeol';
    const long1 = row(['우리 학교', '운동회에서', '청군이'], { y: 84, cx: 320, gap: 12, size: 26 });
    const long2 = row(['정말', '엄청', '신나게', '이겼다'], { y: 160, cx: 320, gap: 12, size: 26 });
    const fin = row(['우리 학교', '운동회에서', '청군이', '이겼다'], { y: 276, cx: 320, gap: 12, size: 26 });
    let css = base(id);
    const keep = [[long1[0], fin[0]], [long1[1], fin[1]], [long1[2], fin[2]], [long2[3], fin[3]]];
    let body = keep.map(([a, b], i) => `<g class="b1"><g class="kp kp${i}">${T(b)}</g></g>`).join('');
    keep.forEach(([a, b], i) => { css += move(id, `kp${i}`, `translate(${f(a.cx - b.cx)}px, ${f(a.y - b.y)}px)`, 3, { dur: 1.1, delay: 0.9 + i * 0.1 }); });
    body += [0, 1, 2].map((i) => `<g class="b1"><g class="gone gn${i}">${g('shake shake2', T(long2[i]), 0.2 + i * 0.2)}</g></g>`).join('');
    css += paint(id, '.gone', [C.peach, C.red], 2, 0.2) + [0, 1, 2].map((i) => `.sc-${id} .gn${i} { transition: transform .8s ease-in ${0.1 + i * 0.15}s, opacity .8s ease ${0.1 + i * 0.15}s; } .on3 .sc-${id} .gn${i} { transform: translateY(60px); opacity: 0; }`).join('');
    css += `.sc-${id} .kp0, .sc-${id} .kp1, .sc-${id} .kp2, .sc-${id} .kp3 { opacity: 0; } .on1 .sc-${id} .kp0, .on1 .sc-${id} .kp1, .on1 .sc-${id} .kp2, .on1 .sc-${id} .kp3 { opacity: 1; }`;
    body += `<g class="b2 h3">${[0, 1, 2].map((i) => g('pop pop2', cross(long2[i].r - 6, 128, 9), 0.9 + i * 0.2)).join('')}</g>`;
    body += glowRect(fin[0].l - 10, 238, rowW(fin) + 20, 76, 4, C.green, 0.1) + at(4, 'pop', tag(320, 336, '간결', ROLE.p, 22), 0.4);
    put(K + '5/간결', svg(id, body, css));
  })();

  // ── 6단원: 비유(소나기 ↔ 수다스러운 친구) ──────────────────────────────
  (function () {
    const id = 't62-k6-biyu';
    let css = base(id);
    const cloud = (x, y) => `<path d="M${x - 56} ${y + 20} a24 24 0 0 1 10 -44 a32 32 0 0 1 60 -8 a26 26 0 0 1 44 22 a20 20 0 0 1 -4 30 Z" fill="white" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/>`;
    const drops = (x, y) => [-36, -16, 4, 24, 44].map((d, i) => `<path class="rn" style="animation-delay:${i * 0.18}s" d="M${x + d} ${y + 30} l-5 16" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`).join('');
    let body = at(1, 'drop', cloud(150, 92) + drops(150, 92)) + at(1, 'pop', tile(150, 214, '소나기', { size: 28, fill: C.sky, stroke: C.blue }), 0.5);
    body += at(2, 'pop', person(470, 120, C.orange, 22) + waves(510, 78, C.orange), 0.2) + at(2, 'pop', tile(470, 214, '수다스러운 친구', { size: 24, h: 52, fill: C.peach, stroke: C.orange }), 0.6);
    body += curve(176, 186, 410, 186, 132, C.purple, 3, { width: 4 });
    body += at(3, 'pop', tag(150, 272, '대상', ROLE.s, 19), 0.8) + at(3, 'pop', tag(470, 272, '빗대어 쓴 말', ROLE.o, 19), 1.1);
    body += glowRect(60, 186, 520, 56, 4, C.purple, 0.1) + at(4, 'pop', tag(290, 326, '비유', ROLE.x, 22), 0.4);
    css += `.sc-${id} .rn { animation: ${id}-rain 1s linear infinite; }
      @keyframes ${id}-rain { 0% { opacity: 0; transform: translateY(-6px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(26px); } }
      .sc-${id} .snd { animation: ${id}-snd 1s ease-in-out infinite; }
      @keyframes ${id}-snd { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }`;
    put(K + '6/비유', svg(id, body, css));
  })();

  // ── 6단원: 직유법(첫눈은 길고양이처럼) ──────────────────────────────
  (function () {
    const id = 't62-k6-jikyu';
    const r = row(['첫눈은', '길고양이', '처럼'], { y: 214, cx: 320, gap: 12, size: 28 });
    let css = base(id);
    const flake = (x, y) => [0, 60, 120].map((a) => `<path d="M${x} ${y - 28} V${y + 28} M${x - 8} ${y - 20} L${x} ${y - 12} L${x + 8} ${y - 20} M${x - 8} ${y + 20} L${x} ${y + 12} L${x + 8} ${y + 20}" transform="rotate(${a} ${x} ${y})" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('');
    const cat = (x, y) => `<path d="M${x - 30} ${y - 6} L${x - 26} ${y - 38} L${x - 8} ${y - 22} H${x + 8} L${x + 26} ${y - 38} L${x + 30} ${y - 6} Q${x + 30} ${y + 26} ${x} ${y + 26} Q${x - 30} ${y + 26} ${x - 30} ${y - 6} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><circle cx="${x - 11}" cy="${y}" r="3.5" fill="${C.ink}"/><circle cx="${x + 11}" cy="${y}" r="3.5" fill="${C.ink}"/>`;
    const FX = 120, CX = 470;
    let body = at(1, 'pop', `<g class="pk pk0">${flake(FX, 104)}</g>`) + at(1, 'pop', `<g class="pk pk1">${cat(CX, 108)}</g>`, 0.4);
    body += at(1, 'rise', T(r[0]), 0.2) + at(1, 'rise', T(r[1]), 0.6);
    body += at(2, 'pop', tag(295, 64, '올 듯 말 듯', ROLE.x, 20), 0.3);
    body += `<g class="b2">${g('fin fin2', `<path d="M232 72 L${FX + 36} 98 M358 72 L${CX - 40} 98" stroke="${C.purple}" stroke-width="3" stroke-dasharray="6 6"/>`, 0.6)}</g>`;
    body += at(3, 'drop', `<g class="jc">${T(r[2], { fill: TAN, stroke: C.orange })}</g>`, 0.2);
    body += at(3, 'fin', tag(r[2].cx - 46, 278, '같이', ['white', C.line], 19) + tag(r[2].cx + 46, 278, '듯이', ['white', C.line], 19), 1.1);
    body += glowRect(r[2].l - 6, 180, r[2].w + 12, 68, 3, C.orange, 0.8);
    body += at(4, 'pop', tag(320, 326, '직유법', ROLE.y, 22), 0.4) + `<g class="b4">${g('fin fin4', braceTop(r[0].l, r[2].r, 174, C.orange), 0.1)}</g>`;
    css += `.on2 .sc-${id} .pk0 { animation: ${id}-peek 1.4s ease-in-out .3s infinite; } .on2 .sc-${id} .pk1 { animation: ${id}-peek 1.4s ease-in-out .9s infinite; }
      @keyframes ${id}-peek { 0%, 100% { opacity: 1; transform: none; } 50% { opacity: .25; transform: translateY(8px); } }
      .on4 .sc-${id} .pk0, .on4 .sc-${id} .pk1 { animation: none; }`;
    put(K + '6/직유법', svg(id, body, css));
  })();

  // ── 6단원: 은유법(선생님은 우리 반의 해님이다) ──────────────────────────────
  (function () {
    const id = 't62-k6-eunyu';
    const r = row(['선생님은', '우리 반의', '해님이다'], { y: 214, cx: 320, gap: 14, size: 28 });
    let css = base(id);
    const sun = (x, y) => `<g class="rays">${[...Array(8)].map((_, i) => `<path d="M${x} ${y - 34} V${y - 48}" transform="rotate(${i * 45} ${x} ${y})" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="24" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
    let body = at(1, 'pop', person(r[0].cx, 124, C.blue, 20)) + at(1, 'pop', sun(r[2].cx, 96), 0.4);
    body += `<g class="b2">${[0, 1].map((k) => `<circle class="ring ring2" style="animation-delay:${0.3 + k * 0.5}s" cx="${r[0].cx}" cy="100" r="44" fill="none" stroke="${C.yellow}" stroke-width="5"/>`).join('')}</g>`;
    body += `<g class="b2">${g('fin fin2', `<path d="M${r[2].cx - 56} 96 H${r[0].cx + 56}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 7"/>`, 0.2)}</g>`;
    body += at(2, 'pop', tag(320, 60, '환하고 따뜻함', ROLE.y, 19), 0.6);
    body += at(1, 'rise', T(r[0]), 0.2) + at(1, 'rise', T(r[2]), 0.6) + at(3, 'rise', T(r[1]), 0.2);
    // '처럼' 이 오다가 빠진다
    body += `<g class="b3 h4"><g class="nx">${tile(320, 290, '처럼', { size: 24, h: 46, fill: 'white', stroke: C.red, dash: '8 6' })}</g>${g('pop pop3', cross(372, 278, 10), 0.9)}</g>`;
    body += at(4, 'pop', tag(320, 290, '○○은 □□이다', ['white', C.green], 20), 0.2) + at(4, 'pop', tag(510, 290, '은유법', ROLE.p, 22), 0.6);
    body += glowRect(r[0].l - 8, 180, rowW(r) + 16, 68, 4, C.green, 0.1);
    css += `.sc-${id} .rays { transform-box: fill-box; transform-origin: center; animation: ${id}-spin 8s linear infinite; }
      @keyframes ${id}-spin { to { transform: rotate(360deg); } }`;
    put(K + '6/은유법', svg(id, body, css));
  })();

  // ── 6단원: 시 한 쪽(세 연, 첫째 연 네 행) — 연·행 ──────────────────────────────
  const POEM = { st: [4, 3, 3], widths: [230, 180, 250, 200, 210, 160, 240, 190, 220, 170], y0: 46, lh: 24, gap: 28 };
  const poemY = (k, j) => POEM.y0 + (POEM.st.slice(0, k).reduce((a, b) => a + b, 0) + j) * POEM.lh + k * POEM.gap;
  const poemLines = (cls = '') => {
    let s = '', i = 0;
    POEM.st.forEach((n, k) => {
      let grp = '';
      for (let j = 0; j < n; j++, i++) grp += `<g class="b1"><rect class="gr ln${i}" style="transition-delay:${i * 0.1}s" x="232" y="${poemY(k, j) - 5}" width="${POEM.widths[i]}" height="10" rx="5" fill="${C.muted}"/></g>`;
      s += `<g class="st st${k} ${cls}">${grp}</g>`;
    });
    return s;
  };
  const poemPaper = `<rect x="196" y="16" width="320" height="330" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`;
  const STC = [[C.sky, C.blue], [C.peach, C.orange], [C.lilac, C.purple]];

  (function () {
    const id = 't62-k6-yeon';
    let css = base(id) + barCss(id);
    let body = poemPaper;
    POEM.st.forEach((n, k) => {
      const top = poemY(k, 0) - 15, h = (n - 1) * POEM.lh + 30;
      body += `<g class="sb${k}">` + at(3, 'fin', `<rect x="220" y="${top}" width="282" height="${h}" rx="10" fill="${STC[k][0]}"/>`, k * 0.35) + '</g>';
      body += at(3, 'pop', `<path d="M212 ${top + 2} H204 V${top + h - 2} H212" stroke="${STC[k][1]}" stroke-width="4" fill="none" stroke-linecap="round"/>` + tag(150, top + h / 2, `${k + 1}연`, STC[k], 20), k * 0.35);
      if (k) body += `<g class="b2">${g('fin fin2', `<path d="M232 ${poemY(k, 0) - POEM.lh / 2 - POEM.gap / 2 - 2} H480" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 7"/>`, 1.1)}</g>`;
    });
    body += poemLines();
    // 처음엔 빈 줄 없이 붙어 있다가 벌어진다
    POEM.st.forEach((_, k) => { css += move(id, `st${k}`, `translateY(${(1 - k) * POEM.gap}px)`, 2, { delay: 0.2 }); });
    const t1 = poemY(1, 0) - 15, h1 = 2 * POEM.lh + 30;
    body += glowRect(214, t1 - 6, 294, h1 + 12, 4, C.orange, 0.1) + at(4, 'pop', tag(580, t1 + h1 / 2, '연', ROLE.o, 24), 0.4);
    css += `.sc-${id} .sb0, .sc-${id} .sb2, .sc-${id} .st0, .sc-${id} .st2 { transition: transform 1s ease-in-out .2s, opacity .6s ease; }
      .on4 .sc-${id} .sb0, .on4 .sc-${id} .sb2, .on4 .sc-${id} .st0, .on4 .sc-${id} .st2 { opacity: .3; }`;
    put(K + '6/연', svg(id, body, css));
  })();

  (function () {
    const id = 't62-k6-haeng';
    let css = base(id) + barCss(id);
    let body = poemPaper;
    // 첫째 연의 줄마다 노란 띠가 차례로 지나가고 번호가 붙는다(4칸에는 모두 흐려진다)
    body += `<g class="dim dim4">`;
    for (let j = 0; j < 4; j++) {
      const y = poemY(0, j);
      body += `<g class="b2"><rect class="sw" style="transition-delay:${0.2 + j * 0.4}s" x="222" y="${y - 11}" width="${POEM.widths[j] + 20}" height="22" rx="8" fill="${C.yellow}" opacity=".5"/></g>`;
      body += at(2, 'pop', `<circle cx="${262 + POEM.widths[j] + 12}" cy="${y}" r="12" fill="white" stroke="${C.orange}" stroke-width="2.5"/>` + text(262 + POEM.widths[j] + 12, y + 6, j + 1, { size: 18, color: C.orange }), 0.4 + j * 0.4);
    }
    const top = poemY(0, 0) - 14, h = 3 * POEM.lh + 28;
    body += at(3, 'pop', `<path d="M212 ${top + 2} H204 V${top + h - 2} H212" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/>` + tag(140, top + h / 2, '1연: 4행', ROLE.y, 20), 0.2);
    body += poemLines() + '</g>';
    // 한 행만 남긴다
    const yk = poemY(1, 1);
    body += `<g class="b4"><rect x="226" y="${yk - 14}" width="${POEM.widths[5] + 16}" height="28" rx="8" fill="${C.mint}"/>${bar(232, yk, POEM.widths[5], C.green, 10)}</g>`;
    body += glowRect(222, yk - 18, POEM.widths[5] + 24, 36, 4, C.green, 0.1, 10) + at(4, 'pop', tag(560, yk, '행', ROLE.p, 24), 0.4);
    css += `.sc-${id} .sw { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .45s ease-out; } .on2 .sc-${id} .sw { transform: none; }
`;
    put(K + '6/행', svg(id, body, css));
  })();

  // ── 6단원: 압축(일기 → 네 줄의 시) ──────────────────────────────
  (function () {
    const id = 't62-k6-apchuk';
    let css = base(id) + barCss(id);
    const dy = [92, 120, 148, 176, 204, 232, 260, 288];
    let body = `<g class="dg">` + at(1, 'fin', `<rect x="24" y="50" width="300" height="270" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + tag(174, 50, '일기', ['white', C.muted], 19))
      + `<g class="dim dim3">${dy.map((y, i) => `<g class="b1">${bar(46, y, i === 7 ? 150 : 256, '#b5c4be', 10, 'gr')}</g>`).join('')}</g></g>`;
    body += glowRect(398, 84, 224, 202, 4, C.green, 0.1);
    body += at(3, 'fin', `<rect x="404" y="90" width="212" height="190" rx="10" fill="white" stroke="${C.green}" stroke-width="3"/>` + tag(510, 90, '시', ROLE.p, 19), 0.2);
    const picks = [[1, 60, 150], [3, 140, 110], [5, 70, 170], [6, 120, 130]], py = [136, 166, 196, 226];
    const cols = [C.orange, C.blue, C.purple, C.green];
    picks.forEach(([li, x, w], i) => {
      body += `<g class="b2"><g class="pk${i}">${g('pop pop2', bar(426, py[i], w, cols[i], 12), 0.3 + i * 0.3)}</g></g>`;
      css += move(id, `pk${i}`, `translate(${46 + x - 426}px, ${dy[li] - py[i]}px)`, 3, { dur: 1.1, delay: 0.6 + i * 0.2 });
    });
    body += `<g class="b3">${g('fin fin3', `<path d="M334 185 H388" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/>` + head(394, 185, 0, C.green, 5), 0.3)}</g>`;
    body += at(4, 'pop', tag(510, 320, '압축', ROLE.p, 22), 0.4);
    css += `.sc-${id} .dg { transform-box: fill-box; transform-origin: center; transition: transform 1s ease-in-out .3s; } .on3 .sc-${id} .dg { transform: scale(.94); }`;
    put(K + '6/압축', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
