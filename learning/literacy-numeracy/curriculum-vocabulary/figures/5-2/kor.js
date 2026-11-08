// 국어 5-2 낱말 도식: 그림으로는 보일 수 없는 문법·글 갈래 낱말을 낱말 조각(타일)으로 움직여 보인다.
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

  // ── 독서 단원: 상위어 ──────────────────────────────
  (function () {
    const id = 'kr-sangwi';
    const xs = [190, 320, 450], low = ['사과', '배', '귤'];
    let body = `<g class="b2"><g class="fin fin2"${dl(1)}><rect x="110" y="250" width="420" height="80" rx="20" fill="${C.mint}" opacity=".6"/></g></g>`;
    body += xs.map((x) => line(320, 199, x, 260, C.green, 2)).join('');
    body += line(320, 85, 320, 141, C.green, 3, { delay: 0.5 });
    body += xs.map((x, i) => at(1, 'pop', tile(x, 290, low[i], { size: 30, w: 110 }), i * 0.35)).join('');
    body += at(2, 'drop', g('pulse pulse4', tile(320, 170, '과일', { size: 30, w: 130, fill: C.mint, stroke: C.green })), 0.8);
    body += at(3, 'drop', tile(320, 56, '먹을거리', { size: 28, w: 170, fill: C.mint, stroke: C.green }));
    body += at(4, 'pop', tag(458, 170, '상위어', ROLE.p), 0.3) + at(4, 'pop', tag(576, 290, '하위어', ROLE.s), 0.8);
    put('5-2/국어/reading/상위어', svg(id, body, base(id)));
  })();

  // ── 1단원: 연 ──────────────────────────────
  (function () {
    const id = 'k1-yeon';
    const widths = [220, 170, 240, 190, 210, 150, 230, 180];
    const tint = [C.sky, C.peach, C.mint, C.lilac], edge = [C.blue, C.orange, C.green, C.purple];
    const y0 = (k, j) => 52 + k * 78 + j * 26;
    let body = `<rect x="200" y="20" width="320" height="322" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    let css = base(id);
    for (let k = 0; k < 4; k++) {
      let grp = `<g class="b3"><g class="fin fin3"${dl(k * 0.35)}><rect x="232" y="${y0(k, 0) - 15}" width="262" height="56" rx="10" fill="${tint[k]}"/></g></g>`;
      for (let j = 0; j < 2; j++) {
        const i = k * 2 + j;
        grp += `<g class="b1"><rect class="ln" style="transition-delay:${i * 0.12}s" x="244" y="${y0(k, j) - 5}" width="${widths[i]}" height="10" rx="5" fill="${C.muted}"/></g>`;
      }
      body += `<g class="st st${k}">${grp}</g>`;
      css += move(id, `st${k}`, `translateY(${39 - 26 * k}px)`, 2, { dur: 1, delay: 0.2 });
      // 묶음 괄호와 이름표
      body += at(3, 'pop', `<path d="M222 ${y0(k, 0) - 12} H214 V${y0(k, 1) + 12} H222" stroke="${edge[k]}" stroke-width="4" fill="none" stroke-linecap="round"/>` + tag(160, y0(k, 0) + 13, `${k + 1}연`, [tint[k], edge[k]]), k * 0.35);
      if (k < 3) body += `<g class="b2"><g class="fin fin2"${dl(1.1)}><path d="M244 ${y0(k, 1) + 26} H470" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 7"/></g></g>`;
    }
    body += glowRect(226, y0(1, 0) - 21, 274, 68, 4) + at(4, 'pop', tag(578, y0(1, 0) + 13, '연', ROLE.o, 24), 0.4);
    css += `
      .sc-${id} .ln { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .5s ease-out; }
      .on1 .sc-${id} .ln { transform: none; }
      .sc-${id} .st0, .sc-${id} .st2, .sc-${id} .st3 { transition: transform 1s ease-in-out .2s, opacity .6s ease; }
      .on4 .sc-${id} .st0, .on4 .sc-${id} .st2, .on4 .sc-${id} .st3 { opacity: .35; }`;
    put('5-2/국어/1/연', svg(id, body, css));
  })();

  // ── 2단원: 문장 성분 ──────────────────────────────
  (function () {
    const id = 'k2-seongbun';
    const xs = [150, 320, 490], words = ['동생이', '우유를', '마신다'], roles = ['s', 'o', 'p'];
    const names = ['주어', '목적어', '서술어'], asks = ['누가', '무엇을', '어찌하다'];
    let css = base(id);
    let body = `<g class="b3"><g class="fin fin3"${dl(0.6)}><rect x="420" y="137" width="140" height="56" rx="12" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="9 7"/></g></g>`;
    body += `<g class="b3 h4">${g('pop pop3', cross(490, 165, 14), 1.2)}</g>`;
    body += xs.map((x, i) => `<g class="t${i}">` + g('pulse pulse4', tile(x, 165, words[i], { size: 30, w: 140 }), 0.3 * i)
      + at(2, 'drop', tag(x, 239, names[i], ROLE[roles[i]]), 0.6 + i * 0.3)
      + at(2, 'fin', text(x, 287, asks[i], { size: 18, color: C.muted }), 0.8 + i * 0.3) + '</g>').join('');
    body += `<g class="b4">${g('fin fin4', braceTop(84, 556, 121) + tag(320, 87, '문장 성분', ROLE.p, 22), 0.3)}</g>`;
    css += `.sc-${id} .t0, .sc-${id} .t1, .sc-${id} .t2 { opacity: 0; }
      .on1 .sc-${id} .t0, .on1 .sc-${id} .t1, .on1 .sc-${id} .t2 { opacity: 1; }`;
    css += move(id, 't0', 'translateX(30px)', 2, { delay: 0.1 }) + move(id, 't2', 'translateX(-30px)', 2, { delay: 0.1 });
    css += `.on3 .sc-${id} .t2 { transform: translateY(-70px); opacity: 0; }
      .on4 .sc-${id} .t2 { transform: none; opacity: 1; }`;
    css += roles.map((r, i) => paint(id, `.t${i}`, ROLE[r], 2, 0.4)).join('');
    put('5-2/국어/2/문장 성분', svg(id, body, css));
  })();

  // ── 2단원: 주어 ──────────────────────────────
  (function () {
    const id = 'k2-jueo';
    const r1 = row(['강아지가', '꼬리를', '흔든다'], { y: 120, x0: 140, gap: 20, size: 30 });
    const r2 = row(['꽃이', '핀다'], { y: 258, x0: 140, gap: 20, size: 30 });
    let css = base(id);
    let body = r1.map((p, i) => at(1, 'rise', `<g class="w1${i}">${g('pulse pulse5', T(p))}</g>`, i * 0.3)).join('');
    body += `<g class="h3">${curve(r1[2].cx, 90, r1[0].cx + 10, 88, 40, C.blue, 2)}</g>`;
    body += `<g class="b2 h3">${g('fin fin2', tag((r1[0].cx + r1[2].cx) / 2, 39, '누가?', ROLE.s), 0.8)}</g>`;
    body += at(3, 'drop', tag(r1[0].cx, 176, '누가', ROLE.s), 0.5);
    body += r2.map((p, i) => at(4, 'rise', `<g class="w2${i}">${g('pulse pulse5', T(p))}</g>`, i * 0.3)).join('');
    body += at(4, 'drop', tag(r2[0].cx, 314, '무엇이', ROLE.s), 1.1);
    body += `<g class="b5">${g('fin fin5', brace(118, 92, 286, C.blue) + tag(66, 189, '주어', ROLE.s, 22))}</g>`;
    css += paint(id, '.w10', ROLE.s, 3, 0.2) + paint(id, '.w20', ROLE.s, 4, 0.8);
    put('5-2/국어/2/주어', svg(id, body, css));
  })();

  // ── 2단원: 서술어 ──────────────────────────────
  (function () {
    const id = 'k2-seosul';
    const rows = [['도윤이가', '달린다', '어찌하다'], ['하늘이', '파랗다', '어떠하다'], ['나는', '학생이다', '무엇이다']];
    const END = 425, ys = [85, 180, 275];
    let css = base(id);
    let body = `<g class="b4">${g('fin fin4', `<rect x="263" y="47" width="174" height="266" rx="14" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="10 7"/>` + tag(350, 24, '서술어', ROLE.p, 22))}</g>`;
    rows.forEach(([a, b, q], i) => {
      const wb = wOf(b), wa = wOf(a), y = ys[i];
      const pb = { label: b, cx: END - wb / 2, w: wb, y, size: 28 }, pa = { label: a, cx: END - wb - 16 - wa / 2, w: wa, y, size: 28 };
      body += at(i + 1, 'slide', T(pa) + `<g class="pr${i}">${g('pulse pulse4', T(pb), 0.3 * i)}</g>`);
      body += at(i + 1, 'pop', tag(507, y, q, ROLE.p), 1.2);
      css += paint(id, `.pr${i}`, ROLE.p, i + 1, 0.7);
    });
    put('5-2/국어/2/서술어', svg(id, body, css));
  })();

  // ── 2단원: 목적어 ──────────────────────────────
  (function () {
    const id = 'k2-mokjeok';
    const r = row(['나는', '그림을', '그린다'], { y: 185, x0: 120, gap: 20, size: 30 });
    let css = base(id);
    let body = r.map((p, i) => at(1, 'rise', `<g class="w${i}">${g('pulse pulse4', T(p))}</g>`, i * 0.3)).join('');
    body += `<g class="h3">${curve(r[2].cx, 155, r[1].cx + 8, 154, 110, C.orange, 2)}</g>`;
    body += `<g class="b2 h3">${g('fin fin2', tag((r[1].cx + r[2].cx) / 2, 106, '무엇을?', ROLE.o), 0.7)}</g>`;
    body += `<g class="b2">${[0, 0.5].map((s) => `<rect class="ring ring2"${dl(1.1 + s)} x="${r[1].l}" y="157" width="${r[1].w}" height="56" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/>`).join('')}</g>`;
    body += at(3, 'drop', tag(r[0].cx, 247, '그리는 쪽', ROLE.s, 19), 0.5) + at(3, 'drop', tag(r[1].cx, 247, '그려지는 쪽', ROLE.o, 19), 1);
    body += at(4, 'drop', tag(r[1].cx, 115, '목적어', ROLE.o, 22), 0.3);
    css += paint(id, '.w1', ROLE.o, 2, 1.1) + paint(id, '.w0', ROLE.s, 3, 0.3)
      + `.on2 .sc-${id} .ring2 { animation-name: ${id}-ring2; } @keyframes ${id}-ring2 { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.18); } }`;
    put('5-2/국어/2/목적어', svg(id, body, css));
  })();

  // ── 2단원: 호응 ──────────────────────────────
  (function () {
    const id = 'k2-hoeung';
    const r1 = row(['나는', '결코', '숙제를', '잊지', '않았다'], { y: 120, x0: 34, gap: 14 });
    const r2 = row(['나는', '결코', '숙제를', '했다'], { y: 270, x0: 34, gap: 14 });
    let css = base(id);
    let body = r1.map((p, i) => at(1, 'rise', `<g class="a${i}">${g(i === 1 || i === 4 ? 'pulse pulse4' : '', T(p))}</g>`, i * 0.15)).join('');
    const mid1 = (r1[1].cx + r1[4].cx) / 2;
    body += curve(r1[1].cx, 92, r1[4].cx, 92, 50, C.green, 2, { width: 5, arrowHead: false });
    body += `<g class="b2 h4">${g('pop pop2', check(mid1, 50, 12), 1.1)}</g>`;
    body += `<g class="b4">${g('flash flash4', `<path d="M${r1[1].cx} 92 Q${mid1} 8 ${r1[4].cx} 92" stroke="${C.green}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".45"/>`)}</g>`;
    body += at(4, 'pop', tag(mid1, 50, '호응', ROLE.p, 22), 0.3);
    body += `<g class="dim dim4">` + r2.map((p, i) => at(3, 'rise', `<g class="c${i}">${g(i === 3 ? 'shake shake3' : '', T(p), 1.3)}</g>`, i * 0.12)).join('');
    const mid2 = (r2[1].cx + r2[3].cx) / 2;
    body += curve(r2[1].cx, 242, r2[3].cx, 242, 206, C.red, 3, { width: 5, arrowHead: false, delay: 0.5 });
    body += `<g class="b3">${g('pop pop3', cross(mid2, 206, 12), 1.4)}</g></g>`;
    css += paint(id, '.a1', ROLE.x, 1, 0.6) + paint(id, '.a4', ROLE.p, 2, 0.9) + paint(id, '.c1', ROLE.x, 3, 0.3) + paint(id, '.c3', [C.peach, C.red], 3, 1.4);
    put('5-2/국어/2/호응', svg(id, body, css));
  })();

  // ── 2단원: 개요 ──────────────────────────────
  (function () {
    const id = 'k2-gaeyo';
    const cols = [115, 320, 525], heads = ['처음', '가운데', '끝'];
    const cards = [['키운 까닭', 0, 190, 185, 85, -10], ['산책하기', 1, 180, 150, 95, 8], ['밥 주기', 1, 245, -170, 35, -6], ['느낀 점', 2, 190, -200, 10, 12]];
    let css = base(id);
    let body = tile(320, 36, '우리 집 강아지', { size: 22, h: 44, fill: '#fdf3d3', stroke: C.orange });
    body += cols.map((x, i) => at(2, 'fin', `<rect x="${x - 90}" y="74" width="180" height="262" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>` + tag(x, 104, heads[i], ROLE.p, 22), i * 0.2)).join('');
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M40 306 H590" stroke="${C.orange}" stroke-width="5" fill="none" style="transition-duration:1.8s"/>${g('fin fin3', head(600, 306, 0, C.orange, 5), 1.7)}</g>`;
    cards.forEach(([label, c, y, dx, dy, rot], i) => {
      body += `<g class="cd${i}">${at(1, 'pop', g('pulse pulse3', tile(cols[c], y, label, { size: 22, h: 46, fill: C.sky, stroke: C.blue })), i * 0.2)}</g>`;
      css += move(id, `cd${i}`, `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, 2, { dur: 1.2, delay: 0.3 + i * 0.1 });
      css += `.sc-${id} .cd${i} { transform-box: fill-box; transform-origin: center; } .on3 .sc-${id} .cd${i} .pulse3 { animation-delay: ${[0.1, 0.6, 0.6, 1.2][i]}s; }`;
    });
    body += glowRect(20, 69, 600, 272, 4, C.green, 0.2) + at(4, 'pop', tag(110, 36, '개요', ROLE.p, 22), 0.5);
    put('5-2/국어/2/개요', svg(id, body, css));
  })();

  // ── 3단원 지도(남한, 울릉도·독도) ──────────────────────────────
  // 남한 바깥선과 제주: 국내 지도 앱의 시·도 경계(learning/inquiry/korea-map/data/provinces-topo.json)를 아래 mp() 로 옮겨 줄인 것.
  const KOREA_D = 'M360.8 231.4L361.9 234.2L360.7 237.3L359 233.5L361 232.5L360 232.1L358.7 232.1L358.9 230L357.6 230.5L358.6 230.9L357.7 233.1L356.7 230.8L354.3 231L354.2 228L353 229.7L352.1 227.9L350.1 228.6L349.3 225L351.3 223.8L348.1 225.9L349.7 228.4L348.5 228.9L349.8 228.9L349.1 229.6L351.1 231.7L349.9 232.3L351.4 232.6L348.5 233.5L349.6 232.5L347.9 232.6L349 231.3L347.2 231.2L346.8 229.6L345.9 230.9L343 230.4L343.1 231.4L343.1 231.4L343.1 231.4L343.9 232.2L338.5 233.8L339.3 234.3L338.7 235.7L339.7 235.6L339.4 234.6L342 234L343.5 232.2L344.1 233.6L343 233.9L345.1 235.7L343.4 237.3L340.6 236.9L342.3 237.9L341.2 243.9L342.4 243.1L342.1 241.6L343.8 243L342.4 244.4L342.7 245.5L340 246.5L338.7 245.3L341 244.3L339.6 244.3L339.1 242.9L339 244.2L337.8 243.1L337.7 244L336.7 243.8L335.3 242.4L338 241.9L337 239.1L336.2 238.9L335.4 241.7L334.1 242.4L333.9 240.1L331.7 239.7L330.4 240.3L330.7 242.8L328.4 241.9L327.3 243.1L325.9 242.4L326.8 241.1L323.7 240.8L322.4 239L323.5 238L322.8 233.5L323.9 232L322.7 232.1L322 234.8L322 234.8L321.5 233.7L319.9 234.7L320.9 234.4L321.9 236L321.4 237.6L320.9 236.8L320.2 238L319.3 236.9L317.9 237.7L317.3 235.8L316.1 239.1L313.7 239.7L313.3 238.8L311.7 241L309.5 238.5L309.9 240.4L308.7 240.4L309.1 238.8L308.1 239.2L306.4 241.3L305.2 240.6L305.2 242.2L303.7 243.3L303 242.3L304.5 241.9L300.8 241.3L302.4 242.6L301.3 243.9L303.6 245.5L303.5 246.6L306.4 244.4L310.3 245L308.8 249.5L309.2 251.8L306.5 252.8L304.8 250.7L303.9 253.6L302.4 253.6L303.7 255L302.6 254.9L303.9 258.2L301.3 256.8L300.8 258L299.5 256.2L299.5 254.4L300.9 254.2L299.3 253.2L301.5 251.2L299.8 247.8L298.1 247.6L299.1 245.7L298.2 245.6L297.8 243.7L296.5 243.9L296.3 245.8L294.1 245.5L292.4 246.7L290 245.9L291.8 247.4L293.5 247.3L291.9 248.5L292.2 250.5L290.9 251.6L293.6 255.5L296.5 256.9L295 257.2L296.8 257.9L297.4 260.2L296.4 261.3L295.2 260.3L294.4 261.1L292 260.6L292 262.1L294 262.7L293.7 264.8L291.1 265.3L291.6 266.6L289.4 266.2L288.2 267.7L289.2 268.8L285.8 266.6L286.6 265.8L285.3 264.4L283.6 263.6L283.2 264.6L282.3 263.7L280 264.4L278.4 262.8L280.2 259.8L281.2 260.2L282.4 256.8L283.9 256.6L285.1 253.3L286.4 252.9L286.3 255.5L288.1 256.1L289.5 253.5L288.7 251L285.7 252.2L284.6 250.5L281.9 254.3L279.2 253.8L275.2 257.8L270.9 258L273.4 259.2L272 261.2L273.3 261.6L271.3 265.7L272 267.3L270.2 266.6L270 268.7L267.7 268.1L267.7 268.1L266.8 268.2L267.4 270.1L263.8 268.3L263.8 267.4L262.9 267.9L263.1 262.9L263.1 262.9L262.4 259L261.8 265.7L260.5 266.3L261.1 267.4L257.5 270.5L256.5 270.2L256.5 270.2L254.6 271.3L254.1 276.3L251.8 275.9L250 277.6L250 273.7L247.6 274.4L247.3 273.6L248.4 273.4L247.6 272.4L248.9 272.2L248.4 271L249.8 270.6L249.3 269L248.1 269.9L246.9 268.6L247.9 268.5L246.9 266.9L247.6 265.1L246.2 264.3L247.1 263.7L244.9 262.2L243.6 263.7L243.4 262L240.1 261.7L240 260.5L237.4 259.1L239.1 258.1L237.3 256.2L238.7 250.7L241.1 251.8L242.2 254.4L243.7 252.3L242.3 251.6L243.2 250.1L246.6 249.1L246.2 248.2L243.3 249.4L241.8 248.4L244.8 245.7L243.5 243.4L244.4 241.6L242.9 236.6L242.6 241.2L239.7 240.8L240.4 239.8L239.2 238.6L239.8 237.4L240.7 238.5L242.1 237.6L241 236.9L243.7 235.2L243.3 233.7L241.9 234.4L240.5 231.4L239.6 234L238.7 233L237.5 233.5L238.2 234.6L237 235.9L235.9 235.4L236.2 233.5L232.8 232.7L232.5 231.4L234.1 230.1L237.5 231.2L236.7 230.1L237.4 228.3L240.4 229.2L241.6 227.3L240.9 231.2L242 230.9L241.5 232.1L242.7 232.1L242.6 233L243.8 231.6L243.5 232.8L244.6 233L243.7 234.1L245.5 235L245.3 233.8L247 232.3L245.9 231.6L247.3 230.7L245.2 230.4L242.2 226.8L243.1 224.3L241.2 225.4L241.4 224.2L240.4 224.8L239.2 223.7L239.9 221.9L240.8 222.4L240.8 220.3L242.8 220.1L244.1 215.2L246.5 216.4L244.3 213.1L244.7 211.5L246.6 211.8L245.6 211.4L248.3 206.3L248.8 207L249.6 205.8L252.9 205L253.6 205.9L255 203.3L257.5 204.8L256.6 202.6L249.4 203L247.4 201.9L247 199.6L251.7 196.1L248 189.4L252.3 196.8L255.2 193.2L255.3 190.2L258.9 190.4L257.4 185L254.4 185.2L254.6 181.9L253.5 181.6L253.2 184.2L253.2 183.2L252.1 184L252.1 182.3L250.7 182.4L248.9 188.2L246.3 189.5L246.2 188.5L247.9 188.9L249.2 186.5L250.6 182.2L249.6 180.1L260.2 179.5L261.3 178L260.6 177.9L257.1 178.4L257.1 176.8L254.7 174.1L256 173.3L254.4 173L252.7 170.6L251.7 171.2L249.7 169.8L248.7 170.9L248.7 169.4L250.3 168.8L251.3 163.4L249.2 159.5L251.9 158.1L248 156.3L248.8 153.9L250.5 153L248.8 153.4L246.9 144.1L242.6 142.2L239 144.7L238.6 142.5L239.5 142L237.5 138.4L238.3 136.1L236.3 136.9L236.5 137.9L234.4 139.5L232.5 139.3L232 137.8L233 137L235.7 137L234.7 136.8L235.2 135.6L232.6 134.8L232.6 134.9L232.6 134.9L232.6 134.8L230.8 137.6L231.5 135.6L230.4 134L232 132.7L232.2 129.5L233.5 131.6L234.5 129.3L233.5 127.3L234.7 126.1L239 126.3L238.7 122.4L239.6 121.8L239.4 125.3L240.9 126.9L239.2 129.1L240.2 130L238.6 130.7L238.8 132.2L241.2 131.3L240.7 128.7L241.7 128.7L242.5 130.5L242.5 127.8L245.7 126.5L244.4 125.3L245.1 124.2L243.7 124.8L241 122.9L241.1 122.1L243.7 122.3L240.7 120.6L245 119.6L246.8 120.7L248.9 116.8L255.2 120.4L258.4 120.6L258.4 120.6L262.6 122L264.7 127.1L266.4 127.6L268.7 126.3L264.5 121.1L262.9 120.9L263.2 119.1L260.6 118.4L260.6 118.4L260.6 118.4L261.3 117.3L257.6 113.7L258.4 111.8L256.2 111.6L257.2 109.6L256.2 109.9L256.4 104.9L255.4 104L256.7 103.6L255.2 104.1L256.8 103.6L257.6 105.7L261.3 105.8L262.6 107.3L263.6 103.6L265.2 104.6L264.2 103.3L260.5 103.3L257.2 101.5L254.5 102.4L252.7 103.6L255 105.3L255.8 104.7L256.3 109.1L254.8 106.9L253.2 107.1L254.5 108.5L252.6 107.8L252 109.4L251 107.3L252.3 106.9L250.6 103.8L252.1 104.5L252.4 103.3L258.2 101.1L260.7 97.5L263 97.7L261 97.4L261.2 96.4L259.6 98.4L257.8 98.2L256.9 100.3L252.9 101L253 100L256.4 100L253.9 96.4L255.5 95.7L254.3 95.7L254.5 94.3L253.5 95.2L253.6 93.7L255.1 93.8L253.8 92.7L255.7 92.5L255.7 91.4L254 91.8L254.1 88.4L252.6 86.5L253.4 86.2L251.7 85.5L250.5 82.6L250.1 74.8L253.5 76.5L256.8 75.3L256.6 71.9L258.2 70.2L257.2 69.7L257.2 65.2L262.6 63.7L266.1 60.7L266.3 56.4L268.4 54.6L271.4 54.6L270.6 53.2L272.1 49.4L273.2 49.8L277.6 46.3L279.3 44.4L280.5 45L284.5 43.3L287.4 44.4L291.3 43L297.1 45.2L300.7 43.1L305.9 43.8L310.6 42.4L312.4 45L317.2 44.6L321.1 46.6L321.9 44.4L324.3 44.6L328.6 42.7L334.6 37.3L336.1 32.3L335.8 28.2L338.1 27L340.7 30.3L343.4 36.5L342.9 37.5L349.9 50.1L348.9 51.4L349.8 50.9L350.5 54.4L355.8 61.2L363.1 71.8L371.7 81.4L371.1 83.6L374.6 87.2L374.5 89.5L376 91.6L375.1 92.3L375.9 91.8L378.7 96.8L381.4 98.6L381.9 101.9L386.1 106.9L385.5 110.5L386.4 112.1L387.2 114.9L389.6 117.2L388.7 118.8L389.1 126.8L389.1 126.8L392 134.1L391.8 138.1L388.8 142.4L390.7 149.2L387 161.8L387.6 166L386.8 166.9L388.1 170.8L390.1 172.2L388.8 174.4L388.8 174.4L386.9 175.7L387.5 176.9L388.3 176.3L388.3 176.3L388.3 176.3L389.7 177L388 177.6L389.3 177.3L388.9 178.4L390.7 179.1L395.3 173.7L397 175.8L397.1 177.6L393.9 182.7L394.6 184.3L393.9 185.9L394.7 186.1L392.6 190.9L391.9 196.4L391.9 196.4L391.9 196.4L390.6 198.8L391.3 202.6L389.7 207.3L390.4 208.1L388.5 209.2L387.1 205.4L387.6 207.5L386.4 207.4L387.8 208.4L386.7 210.3L384.9 208.4L386.1 211.2L386.9 210.7L385.5 214.7L386.4 215.8L383.6 217.5L381.6 218.3L379.8 225.8L377.7 227.6L374.5 227.9L375.2 229.7L374.3 231.3L371.5 229.3L369.8 233.5L368.7 231.7L369.3 233.8L367.7 233.3L367.3 234.7L366.9 230.4L365.8 232.3L365.8 230.2L364 232L364.1 229.6L363.4 232L360.4 231L360.8 231.4ZM268.3 322.7L268.3 322.7L268.3 324.7L269.3 326.2L269.9 324.8L270.4 325.9L269.2 326.9L270 327.7L268.9 327.5L268.5 329.9L266.8 331L265.1 334.7L262.3 334.8L260.7 336.5L256.6 336.7L253.8 339L250 338.6L247.7 339.7L246.7 338.6L240.7 338.6L239.2 341.1L238 341.3L232.7 335.7L233 332.7L237.4 328.9L237.6 327.3L240 325.4L248.7 322.4L260 320.1L260 320.1L264.1 320L268.3 322.7Z';
  const mp = ([lon, lat]) => [f(225 + (lon - 126) * 48), f(22 + (38.7 - lat) * 58)];
  const PLACE = { 서울: mp([126.98, 37.57]), 강릉: mp([128.9, 37.75]), 대구: mp([128.6, 35.87]), 광주: mp([126.85, 35.16]), 제주: mp([126.55, 33.38]) };
  const koreaMap = () => {
    const [ux, uy] = mp([130.87, 37.5]), [dx, dy] = mp([131.87, 37.24]);
    return `<path d="${KOREA_D}" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<circle cx="${ux}" cy="${uy}" r="4.5" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/><circle cx="${dx}" cy="${dy}" r="3" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/>`;
  };
  const dot = (name, color = C.ink) => { const [x, y] = PLACE[name]; return `<circle cx="${x}" cy="${y}" r="7" fill="${color}" stroke="white" stroke-width="2"/>`; };
  // 말풍선: 지명 점에서 낱말 조각까지 줄을 긋는다
  const callout = (name, cx, cy, label, colors, n, s = 0, cls = '') => {
    const [x, y] = PLACE[name], w = wOf(label, 26), ex = cx > x ? cx - w / 2 : cx + w / 2;
    return at(n, 'pop', `<g class="${cls}"><path d="M${x} ${y} L${f(ex)} ${cy}" stroke="${colors[1]}" stroke-width="3"/>${dot(name)}<circle class="ring ring${n}" cx="${x}" cy="${y}" r="11" fill="none" stroke="${colors[1]}" stroke-width="3"/>${tile(cx, cy, label, { size: 26, h: 50, fill: colors[0], stroke: colors[1] })}</g>`, s);
  };

  // ── 3단원: 표준어 ──────────────────────────────
  // 예는 교과서 3단원 첫머리(지역마다 다른 인사말 지도)에서 가져왔다: 경상 '어서 오이소', 제주 '혼저 옵서예'.
  const HELLO = '어서 오세요';
  (function () {
    const id = 'k3-pyojun';
    let css = base(id);
    let body = koreaMap();
    body += `<g class="dim dim3">${callout('대구', 525, 205, '어서 오이소', ROLE.o, 1) + callout('제주', 112, 318, '혼저 옵서예', ROLE.o, 1, 0.5)}</g>`;
    body += at(2, 'drop', g('pulse pulse4', tile(112, 70, HELLO, { size: 28, h: 58, fill: C.mint, stroke: C.green })));
    const small = [['서울', 0], ['대구', 0.3], ['광주', 0.6], ['제주', 0.9]];
    body += small.map(([n, s]) => { const [x, y] = PLACE[n]; return at(3, 'pop', dot(n) + tile(x, y - 26, HELLO, { size: 16, h: 30, rx: 15, fill: 'white', stroke: C.green, sw: 2.5 }), s); }).join('');
    body += at(4, 'pop', tag(112, 128, '표준어', ROLE.p, 22), 0.4);
    put('5-2/국어/3/표준어', svg(id, body, css));
  })();

  // ── 3단원: 방언 ──────────────────────────────
  (function () {
    const id = 'k3-bangeon';
    let css = base(id);
    const gs = '어서 오이소', jj = '혼저 옵서예';
    let body = koreaMap();
    body += `<g class="dim dim4">${callout('서울', 112, 90, HELLO, ROLE.p, 1, 0.3)}</g>`;
    body += callout('대구', 525, 205, gs, ROLE.o, 2) + callout('제주', 112, 318, jj, ROLE.o, 3);
    body += glowRect(525 - wOf(gs, 26) / 2 - 6, 174, wOf(gs, 26) + 12, 62, 4, C.orange, 0.1) + glowRect(112 - wOf(jj, 26) / 2 - 6, 287, wOf(jj, 26) + 12, 62, 4, C.orange, 0.1);
    body += at(4, 'pop', tag(525, 258, '방언', ROLE.o, 22), 0.3) + at(4, 'pop', tag(112, 266, '방언', ROLE.o, 22), 0.6);
    put('5-2/국어/3/방언', svg(id, body, css));
  })();

  // ── 4단원: 순화어 ──────────────────────────────
  (function () {
    const id = 'k4-sunhwa';
    const pairs = [['헬멧', '안전모'], ['레시피', '조리법'], ['스크린 도어', '안전문']], ys = [100, 195, 290];
    let css = base(id);
    let body = `<g class="b1 h2">${['?', '?'].map((q, i) => g('pop pop1', text(i ? 240 : 100, i ? 70 : 78, q, { size: 34, color: C.orange }), 0.5 + i * 0.3)).join('')}</g>`;
    pairs.forEach(([a, b], i) => {
      const n = i === 0 ? 1 : 3, s = i === 0 ? 0 : (i - 1) * 0.8;
      body += at(n, 'pop', tile(170, ys[i], a, { size: 28 }), s);
      body += at(i === 0 ? 2 : 3, 'slide', arrowR(290, 368, ys[i]), i === 0 ? 0.2 : s + 0.3);
      body += at(i === 0 ? 2 : 3, 'slide', `<g class="p${i}">${tile(450, ys[i], b, { size: 28, w: 124 })}</g>`, i === 0 ? 0.6 : s + 0.6);
      css += paint(id, `.p${i}`, ROLE.p, i === 0 ? 2 : 3, i === 0 ? 1 : s + 1);
    });
    body += at(2, 'pop', check(548, 100, 11), 1.2);
    body += glowRect(378, 63, 144, 264, 4, C.green, 0.1) + at(4, 'drop', tag(450, 34, '순화어', ROLE.p, 22), 0.4);
    put('5-2/국어/4/순화어', svg(id, body, css));
  })();

  // ── 5단원: 생략 ──────────────────────────────
  (function () {
    const id = 'k5-saengryak';
    const r1 = row(['하린이가', '빵을', '샀다'], { y: 105, x0: 170, gap: 14 });
    const r2 = row(['하린이가', '빵을', '먹었다'], { y: 245, x0: 170, gap: 14 });
    let css = base(id);
    let body = r1.map((p, i) => at(1, 'rise', `<g class="u${i}">${T(p)}</g>`, i * 0.2)).join('');
    body += `<g class="b2">${g('fin fin2', `<rect class="slot" x="${r2[0].l}" y="217" width="${r2[0].w}" height="56" rx="12" fill="white" stroke="${C.purple}" stroke-width="3" stroke-dasharray="9 7"/>`, 0.7)}</g>`;
    body += `<g class="b4">${g('flash flash4', `<rect x="${r2[0].l - 6}" y="211" width="${r2[0].w + 12}" height="68" rx="16" fill="none" stroke="${C.purple}" stroke-width="4"/>`, 0.2)}</g>`;
    body += r2.map((p, i) => at(1, 'rise', `<g class="v${i}">${T(p)}</g>`, 0.6 + i * 0.2)).join('');
    body += `<g class="b3 h4"><path class="draw draw3" pathLength="1" d="M${r1[0].l - 10} 112 Q${r1[0].l - 80} 176 ${r2[0].l - 10} 240" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round"/>${g('fin fin3', head(r2[0].l - 10, 240, Math.atan2(64, 70), C.purple, 3.5), 0.9)}<g class="fly">${tile(r1[0].cx, r1[0].y, r1[0].label, { size: 28, w: r1[0].w, fill: C.lilac, stroke: C.purple, dash: '9 7' })}</g></g>`;
    body += at(4, 'drop', tag(r2[0].cx, 307, '생략', ROLE.x, 22), 0.6);
    css += paint(id, '.u0', ROLE.x, 1, 1.1) + paint(id, '.v0', ROLE.x, 1, 1.1);
    css += `.sc-${id} .v0 { transition: transform .9s ease-in-out .2s, opacity .9s ease .2s; }
      .on2 .sc-${id} .v0 { transform: translateY(-34px); opacity: 0; }
      .sc-${id} .fly { opacity: .85; transition: transform 1.2s ease-in-out .3s; }
      .on3 .sc-${id} .fly { transform: translateY(140px); }`;
    put('5-2/국어/5/생략', svg(id, body, css));
  })();

  // ── 5단원: 함축 ──────────────────────────────
  (function () {
    const id = 'k5-hamchuk';
    const r = row(['내 마음에', '비가', '내린다'], { y: 160, x0: 122, gap: 14 });
    const cx = r[1].cx;
    let css = base(id);
    let body = r.map((p, i) => at(1, 'rise', g('pulse pulse4', T(p), 0.2 * i), i * 0.25)).join('');
    const cloud = `<path d="M${cx - 52} 70 a22 22 0 0 1 12 -40 a30 30 0 0 1 54 -6 a24 24 0 0 1 40 22 a18 18 0 0 1 -6 24 Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`;
    const drops = [-30, -10, 10, 30].map((d, i) => `<path class="drop-l" style="animation-delay:${i * 0.22}s" d="M${cx + d} 80 l-4 14" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`).join('');
    body += at(2, 'drop', `<g class="dim dim4">${cloud}${drops}</g>`) + at(2, 'pop', tag(cx + 128, 52, '겉뜻', ROLE.s), 0.7);
    body += `<g class="b3">${g('fin fin3', `<path d="M${cx} 192 V240" stroke="${C.purple}" stroke-width="3" stroke-dasharray="6 6"/>`, 0.2)}</g>`;
    body += `<g class="b3"><g class="emerge">${g('pulse pulse4', tile(cx, 272, '슬프다', { size: 28, fill: C.lilac, stroke: C.purple, w: 124 }), 0.5)}</g></g>`;
    body += at(3, 'pop', tag(cx + 128, 272, '속뜻', ROLE.x), 1.1);
    body += `<g class="b4">${g('fin fin4', brace(104, 30, 302, C.purple) + tag(50, 166, '함축', ROLE.x, 22))}</g>`;
    css += `
      .sc-${id} .drop-l { animation: ${id}-rain 1s linear infinite; }
      @keyframes ${id}-rain { 0% { opacity: 0; transform: translateY(-6px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(26px); } }
      .sc-${id} .emerge { transform: translateY(-100px); opacity: 0; transition: transform 1.1s ease-out .2s, opacity .6s ease .2s; }
      .on3 .sc-${id} .emerge { transform: none; opacity: 1; }`;
    put('5-2/국어/5/함축', svg(id, body, css));
  })();

  // ── 5단원: 사전적 ──────────────────────────────
  (function () {
    const id = 'k5-sajeon';
    const L = 170, R = 470;
    let css = base(id);
    const book = `<rect x="${L - 66}" y="104" width="132" height="62" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="${L - 66}" y="104" width="16" height="62" rx="4" fill="${C.blue}"/>` + text(L + 8, 145, '사전', { size: 26 });
    const page = `<path d="M${R - 62} 104 H${R + 44} L${R + 62} 122 V166 H${R - 62} Z" fill="white" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/><path d="M${R + 44} 104 V122 H${R + 62}" fill="none" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>` + text(R, 145, '시', { size: 26 });
    let body = at(1, 'drop', tile(320, 44, '바다', { size: 30, w: 118, fill: '#fdf3d3', stroke: C.orange }));
    body += curve(292, 72, L + 20, 97, 78, C.muted, 1, { delay: 0.4 }) + curve(348, 72, R - 20, 97, 78, C.muted, 1, { delay: 0.4 });
    body += `<g class="lc">` + at(1, 'pop', book, 0.9) + line(L, 168, L, 206, C.blue, 2);
    body += at(2, 'pop', tile(L, 234, '넓은 짠물', { size: 26, h: 52, fill: C.sky, stroke: C.blue }), 0.7);
    body += at(2, 'fin', [0, 1].map((k) => `<path class="wave" d="M${L - 66} ${280 + k * 14} q16.5 -10 33 0 t33 0 t33 0 t33 0" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join(''), 1);
    body += at(4, 'pop', tag(L, 334, '사전적 뜻', ROLE.s, 22), 0.4) + `</g>`;
    body += `<g class="dim dim4">` + at(1, 'pop', page, 1.1) + line(R, 168, R, 206, C.purple, 3);
    body += at(3, 'pop', tile(R, 234, '엄마의 품', { size: 26, h: 52, fill: C.lilac, stroke: C.purple }), 0.7);
    body += at(3, 'pop', g('beat', `<path d="M${R} 312 C${R - 30} 292 ${R - 22} 270 ${R} 282 C${R + 22} 270 ${R + 30} 292 ${R} 312 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`), 1);
    body += at(3, 'pop', tag(R + 100, 290, '글 속 뜻', ROLE.x), 1.4) + `</g>`;
    body += glowRect(L - 90, 96, 180, 216, 4, C.blue, 0.1);
    css += `
      .sc-${id} .wave { animation: ${id}-wave 1.6s ease-in-out infinite alternate; }
      @keyframes ${id}-wave { from { transform: translateX(-6px); } to { transform: translateX(6px); } }
      .sc-${id} .beat { transform-box: fill-box; transform-origin: center; animation: ${id}-pulse 1s ease-in-out infinite; }`;
    put('5-2/국어/5/사전적', svg(id, body, css));
  })();

  // ── 6단원: 요소 ──────────────────────────────
  (function () {
    const id = 'k6-yoso';
    const xs = [180, 320, 460], names = ['인물', '사건', '배경'];
    const icon = [
      (x) => `<circle cx="${x}" cy="152" r="11" fill="${C.blue}"/><path d="M${x - 17} 184 Q${x - 17} 166 ${x} 166 Q${x + 17} 166 ${x + 17} 184 Z" fill="${C.blue}"/>`,
      (x) => `<path d="M${x + 4} 140 L${x - 12} 166 H${x} L${x - 6} 188 L${x + 14} 158 H${x + 2} L${x + 10} 140 Z" fill="${C.orange}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`,
      (x) => `<path d="M${x - 8} 186 V174 M${x - 8} 140 L${x - 24} 174 H${x + 8} Z" stroke="${C.green}" stroke-width="4" fill="${C.green}" stroke-linejoin="round"/><circle cx="${x + 16}" cy="150" r="9" fill="${C.yellow}"/>`
    ];
    const piece = (i) => `<rect class="bg" x="${xs[i] - 62}" y="128" width="124" height="112" rx="14" fill="white" stroke="${C.ink}" stroke-width="3"/>` + icon[i](xs[i]) + text(xs[i], 225, names[i], { size: 26 });
    let css = base(id);
    let body = at(2, 'fin', `<rect x="102" y="112" width="436" height="144" rx="18" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + tile(320, 66, '이야기', { size: 28, fill: C.mint, stroke: C.green }));
    body += `<g class="b3 h4">${g('fin fin3', `<rect x="258" y="128" width="124" height="112" rx="14" fill="white" stroke="${C.red}" stroke-width="3" stroke-dasharray="9 7"/>`, 0.6)}${g('pop pop3', cross(398, 66, 13), 1.1)}</g>`;
    body += xs.map((x, i) => `<g class="pc${i}">${at(1, 'pop', g('pulse pulse4', piece(i), i * 0.3), i * 0.3)}</g>`).join('');
    body += xs.map((x, i) => at(4, 'drop', tag(x, 290, '요소', ROLE.p, 22), 0.4 + i * 0.3)).join('');
    body += glowRect(96, 106, 448, 156, 4, C.green, 1.2, 20);
    [['-60px, 60px', -10], ['0px, 85px', 8], ['60px, 60px', -6]].forEach(([tr, rot], i) => {
      css += `.sc-${id} .pc${i} { transform-box: fill-box; transform-origin: center; }`;
      css += move(id, `pc${i}`, `translate(${tr}) rotate(${rot}deg)`, 2, { dur: 1.1, delay: 0.2 });
    });
    css += `.on3 .sc-${id} .pc1 { transform: translate(30px, 130px) rotate(25deg); opacity: 0; transition-duration: 1s; }
      .on4 .sc-${id} .pc1 { transform: none; opacity: 1; }`;
    put('5-2/국어/6/요소', svg(id, body, css));
  })();

  // ── 6단원: 극본 한 쪽(해님 달님) ──────────────────────────────
  // 해설 석 줄, 그리고 인물 이름 칸 + 내용 칸(지문 줄, 대사 줄). 칠하는 띠는 줄 폭 전체라 글꼴이 달라도 맞는다.
  const SCRIPT = {
    haeseol: ['때: 옛날 어느 밤', '곳: 산속 초가집', '나오는 사람: 오누이, 호랑이'],
    talk: [['호랑이', '(문을 두드리며)', '얘들아, 엄마 왔다.'], ['오빠', '(작은 목소리로)', '손 좀 보여 주세요.']]
  };
  // big: 해설·대사·지문 장면(넓은 쪽), 아니면 극본 장면의 왼쪽 좁은 쪽
  function scriptPage({ x, y, w, size, nameW, lh, gapAfterH = 26 }) {
    const pad = 22, out = { band: {} };
    const hY = SCRIPT.haeseol.map((_, i) => y + 34 + i * lh);
    const lastY = hY[2] + gapAfterH * 0.6 + 4 * lh + 18;
    let body = `<rect class="page" x="${x}" y="${y}" width="${w}" height="${f(lastY + size * 0.75 + 8 - y)}" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    const bandH = size * 1.55, bandTop = (by) => by - size * 1.08;
    out.band.h = { x: x + 10, y: bandTop(hY[0]), w: w - 20, h: hY[2] - hY[0] + bandH };
    let lines = SCRIPT.haeseol.map((t, i) => ({ y: hY[i], x: x + pad, t, kind: 'h' }));
    const divY = hY[2] + gapAfterH * 0.6;
    body += `<path d="M${x + 16} ${divY} H${x + w - 16}" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`;
    let ry = divY + lh + 4;
    SCRIPT.talk.forEach(([name, jimun, daesa], k) => {
      lines.push({ y: ry, x: x + pad, t: name, kind: 'n', k });
      lines.push({ y: ry, x: x + pad + nameW, t: jimun, kind: 'j', k });
      lines.push({ y: ry + lh, x: x + pad + nameW, t: daesa, kind: 'd', k });
      out.band['j' + k] = { x: x + pad + nameW - 10, y: bandTop(ry), w: w - pad - nameW - 4, h: bandH };
      out.band['d' + k] = { x: x + pad + nameW - 10, y: bandTop(ry + lh), w: w - pad - nameW - 4, h: bandH };
      out['row' + k] = ry;
      ry += lh * 2 + 14;
    });
    out.lines = lines;
    out.text = (kind, k, cls = '') => lines.filter((l) => l.kind === kind && (k == null || l.k === k)).map((l, i) =>
      `<g class="ln ${cls}">${text(l.x, l.y, l.t, { size, anchor: 'start', weight: kind === 'n' ? 800 : 700, color: kind === 'n' ? C.green : C.ink })}</g>`).join('');
    out.body = body;
    return out;
  }
  const bandRect = (b, fill, cls) => `<rect class="band ${cls}" x="${f(b.x)}" y="${f(b.y)}" width="${f(b.w)}" height="${f(b.h)}" rx="8" fill="${fill}"/>`;
  const YEL = '#fbeab0', BLU = C.sky, LIL = C.lilac;
  const pageCss = (id) => `
    .sc-${id} .band { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .9s ease-out .2s; }
    .sc-${id} .lines .ln { opacity: 0; }
    ${[...Array(9)].map((_, i) => `.on1 .sc-${id} .lines .ln:nth-child(${i + 1}) { animation: ${id}-fin .4s ease-out ${(i * 0.18).toFixed(2)}s both; }`).join('\n')}`;
  // 넓은 쪽 공통: 왼쪽 여백에 이름표, 오른쪽 끝에 작은 그림
  const BIG = { x: 110, y: 14, w: 480, size: 22, nameW: 92, lh: 38 };

  // ── 6단원: 극본 ──────────────────────────────
  (function () {
    const id = 'k6-geukbon';
    const P = scriptPage({ x: 18, y: 50, w: 312, size: 20, nameW: 74, lh: 32, gapAfterH: 24 });
    let css = base(id) + pageCss(id);
    let body = P.body + bandRect(P.band.h, YEL, 'bh') + bandRect(P.band.d0, BLU, 'bd') + bandRect(P.band.j0, LIL, 'bj');
    body += `<g class="lines">${P.text('h')}${P.text('n')}${P.text('j')}${P.text('d')}</g>`;
    // 무대
    const S = { x: 350, y: 40, w: 272, h: 296 };
    body += `<rect x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="8" fill="${C.sky}" stroke="${C.ink}" stroke-width="3"/>`;
    body += `<rect x="${S.x}" y="${S.y + S.h - 34}" width="${S.w}" height="34" fill="${C.peach}" stroke="${C.ink}" stroke-width="3"/>`;
    const moon = `<circle cx="396" cy="84" r="20" fill="${C.yellow}"/><circle cx="406" cy="78" r="17" fill="${C.sky}"/>`;
    const house = `<rect x="430" y="214" width="104" height="66" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="M418 218 Q482 160 546 218 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `<rect x="494" y="236" width="28" height="44" fill="${C.muted}"/>`;
    body += at(2, 'fin', moon, 1) + at(2, 'rise', house, 1.2);
    const tiger = `<g class="tiger"><path d="M566 300 Q566 246 590 246 Q614 246 614 300 Z" fill="${C.orange}"/><circle cx="590" cy="232" r="17" fill="${C.orange}"/>`
      + `<path d="M577 220 l-4 -12 l12 6 Z M603 220 l4 -12 l-12 6 Z" fill="${C.orange}"/><path d="M578 270 h10 M592 262 h10 M580 284 h12" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`
      + `<circle cx="583" cy="230" r="2.6" fill="${C.ink}"/><circle cx="597" cy="230" r="2.6" fill="${C.ink}"/></g>`;
    body += at(3, 'slide', `<g class="knock"><g transform="translate(-24 0)">${tiger}</g></g>`, 0.6);
    body += at(3, 'pop', `<path d="M398 118 H592 Q600 118 600 126 V162 Q600 170 592 170 H578 L568 198 L556 170 H406 Q398 170 398 162 V126 Q398 118 406 118 Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>` + text(499, 152, '얘들아, 엄마 왔다.', { size: 20 }), 1.1);
    body += `<g class="b4">${[0, 1].map((k) => g('fin fin4', `<path d="M${526 + k * 8} ${242 - k * 6} q7 9 0 18" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`, 0.6 + k * 0.2)).join('')}</g>`;
    // 막
    body += `<g class="cur cl"><rect x="${S.x + 3}" y="${S.y + 3}" width="${S.w / 2 - 3}" height="${S.h - 6}" fill="${C.red}" opacity=".85"/></g>`;
    body += `<g class="cur cr"><rect x="${S.x + S.w / 2}" y="${S.y + 3}" width="${S.w / 2 - 3}" height="${S.h - 6}" fill="${C.red}" opacity=".85"/></g>`;
    const pageH = P.band.d1.y + P.band.d1.h + 10 - 50;
    body += glowRect(12, 44, 324, pageH + 12, 5, C.green, 0.1) + at(5, 'drop', tag(174, 24, '극본', ROLE.p, 22), 0.4);
    css += `
      .on2 .sc-${id} .bh, .on3 .sc-${id} .bd, .on4 .sc-${id} .bj { transform: none; }
      .sc-${id} .cur { transform-box: fill-box; transition: transform 1.2s ease-in-out .3s; }
      .sc-${id} .cl { transform-origin: left center; } .sc-${id} .cr { transform-origin: right center; }
      .on2 .sc-${id} .cur { transform: scaleX(.12); }
      .on4 .sc-${id} .knock { animation: ${id}-knock .5s ease-in-out .4s 3; }
      @keyframes ${id}-knock { 0%, 100% { transform: none; } 50% { transform: translateX(-14px); } }`;
    put('5-2/국어/6/극본', svg(id, body, css));
  })();

  // ── 6단원: 해설 ──────────────────────────────
  (function () {
    const id = 'k6-haeseol';
    const P = scriptPage(BIG);
    let css = base(id) + pageCss(id);
    let body = P.body + bandRect(P.band.h, YEL, 'bh');
    body += `<g class="dim dim4"><g class="lines">${P.text('h')}${P.text('n')}${P.text('j')}${P.text('d')}</g></g>`;
    // 해설 줄 위에 다시 한 벌(4칸에 흐려지지 않게)
    body += `<g class="b4">${P.text('h')}</g>`;
    const hy = P.lines.filter((l) => l.kind === 'h').map((l) => l.y - 7);
    const icons = [
      `<circle cx="540" cy="${hy[0]}" r="13" fill="${C.yellow}"/><circle cx="547" cy="${hy[0] - 4}" r="11" fill="${YEL}"/>`,
      `<rect x="527" y="${hy[1] - 4}" width="26" height="16" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M521 ${hy[1] - 3} Q540 ${hy[1] - 22} 559 ${hy[1] - 3} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`,
      [524, 540, 556].map((x, i) => `<circle cx="${x}" cy="${hy[2] - 6}" r="5.5" fill="${i === 2 ? C.orange : C.blue}"/><path d="M${x - 7} ${hy[2] + 12} Q${x - 7} ${hy[2]} ${x} ${hy[2]} Q${x + 7} ${hy[2]} ${x + 7} ${hy[2] + 12} Z" fill="${i === 2 ? C.orange : C.blue}"/>`).join('')
    ];
    body += icons.map((ic, i) => at(3, 'pop', ic, i * 0.4)).join('');
    const b = P.band.h;
    body += glowRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8, 4, C.orange, 0.1, 10) + at(4, 'pop', tag(60, b.y + b.h / 2, '해설', ROLE.y, 22), 0.4);
    css += `.on2 .sc-${id} .bh { transform: none; }`;
    put('5-2/국어/6/해설', svg(id, body, css));
  })();

  // ── 6단원: 대사 ──────────────────────────────
  (function () {
    const id = 'k6-daesa';
    const P = scriptPage(BIG);
    let css = base(id) + pageCss(id);
    let body = P.body + bandRect(P.band.d0, BLU, 'bd0') + bandRect(P.band.d1, BLU, 'bd1');
    body += `<g class="lines"><g class="dim dim4">${P.text('h')}${P.text('j')}</g>${P.text('n')}${P.text('d')}</g>`;
    const sound = (y) => [0, 1, 2].map((k) => `<path class="snd" style="animation-delay:${k * 0.2}s" d="M${548 + k * 9} ${y - 18 + k * -3} q${9 + k * 3} ${16 + k * 3} 0 ${32 + k * 6}" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('');
    [0, 1].forEach((k) => {
      const b = P.band['d' + k], cy = b.y + b.h / 2;
      body += at(k + 2, 'fin', sound(cy), 0.9);
      const nx = P.lines.find((l) => l.kind === 'n' && l.k === k).x + wOf(SCRIPT.talk[k][0], 22) / 2 - 14, ry = P['row' + k];
      body += `<g class="b${k + 2}"><path class="draw draw${k + 2}" pathLength="1" d="M${f(nx)} ${f(ry + 9)} V${f(cy)} H${f(b.x - 6)}" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linejoin="round" style="transition-duration:.7s"/>${g(`fin fin${k + 2}`, head(b.x - 6, cy, 0, C.blue, 3.5), 0.6)}</g>`;
      body += at(4, 'pop', tag(60, cy, '대사', ROLE.s, 22), 0.3 + k * 0.4);
    });
    css += `.on2 .sc-${id} .bd0, .on3 .sc-${id} .bd1 { transform: none; }
      .sc-${id} .snd { animation: ${id}-snd 1.2s ease-in-out infinite; }
      @keyframes ${id}-snd { 0%, 100% { opacity: .25; } 50% { opacity: 1; } }
      .on4 .sc-${id} .bd0, .on4 .sc-${id} .bd1 { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    put('5-2/국어/6/대사', svg(id, body, css));
  })();

  // ── 6단원: 지문 ──────────────────────────────
  (function () {
    const id = 'k6-jimun';
    const P = scriptPage(BIG);
    let css = base(id) + pageCss(id);
    let body = P.body + bandRect(P.band.j0, LIL, 'bj0') + bandRect(P.band.j1, LIL, 'bj1');
    body += `<g class="lines"><g class="dim dim4">${P.text('h')}${P.text('d')}</g>${P.text('n')}${P.text('j')}</g>`;
    const c0 = P.band.j0.y + P.band.j0.h / 2, c1 = P.band.j1.y + P.band.j1.h / 2;
    const door = `<g class="shake shake2"><rect x="540" y="${c0 - 20}" width="26" height="40" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="560" cy="${c0 + 2}" r="2.6" fill="${C.ink}"/></g>`
      + [0, 1].map((k) => `<path d="M${528 - k * 8} ${c0 - 10 - k * 4} q-8 ${10 + k * 4} 0 ${20 + k * 8}" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
    const voice = `<path d="M536 ${c1 - 7} h8 l10 -9 v32 l-10 -9 h-8 Z" fill="${C.purple}" stroke="${C.purple}" stroke-width="2" stroke-linejoin="round"/><path class="snd" d="M560 ${c1 - 6} q5 6 0 12" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    body += at(2, 'pop', door, 0.9) + at(3, 'pop', voice, 0.9);
    body += at(4, 'pop', tag(60, c0, '지문', ROLE.x, 22), 0.3) + at(4, 'pop', tag(60, c1, '지문', ROLE.x, 22), 0.7);
    css += `.on2 .sc-${id} .bj0, .on3 .sc-${id} .bj1 { transform: none; }
      .sc-${id} .snd { animation: ${id}-fin .8s ease-in-out infinite alternate; }
      .on4 .sc-${id} .bj0, .on4 .sc-${id} .bj1 { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    put('5-2/국어/6/지문', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
