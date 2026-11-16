// 수학 7-1 4단원 좌표평면과 그래프: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const SERIF = "'Times New Roman',Times,serif";

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(class="draw dN" pathLength="1"), rN 퍼지는 고리,
  // kN 깜빡이며 남기, fN 날아오기(--dx, --dy 에서 제자리로), mvN 옮겨 가기(--xN, --yN 으로; 칸이 쌓이면 뒤 칸이 이김)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .6s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .mv { transition: transform .9s ease-in-out; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .9s ease-in-out both; }
    .on${n} .sc-${id} .mv${n} { transform: translate(var(--x${n}, 0px), var(--y${n}, 0px)); }`;
    return css;
  };

  // ── 수식 글자 ──
  // 영문자는 기울인 바탕체, 수·기호는 굵은 고딕. '-' 는 빼기표(−), '*' 는 곱셈표(×).
  // a^2, a^{12}: 위첨자. {#orange|글자}: 그 부분만 색. 위첨자 안에서도 ^{#blue|4} 처럼 쓴다.
  const esc = (s) => s.replace(/-/g, '−').replace(/\*/g, '×');
  function tsp(src, size) {
    const st = { back: 0 }, up = f(size * 0.42), small = f(size * 0.62);
    const dy = () => { const d = st.back; st.back = 0; return d ? ` dy="${d}"` : ''; };
    const walk = (s) => {
      let out = '', i = 0;
      while (i < s.length) {
        if (s.startsWith('{#', i)) {
          const bar = s.indexOf('|', i), end = s.indexOf('}', bar);
          out += `<tspan fill="${C[s.slice(i + 2, bar)] || s.slice(i + 2, bar)}">${walk(s.slice(bar + 1, end))}</tspan>`;
          i = end + 1; continue;
        }
        if (s[i] === '^') {
          let g;
          if (s[i + 1] === '{') { let j = i + 2, depth = 1; while (depth) { if (s[j] === '{') depth++; if (s[j] === '}') depth--; j++; } g = s.slice(i + 2, j - 1); i = j; } else { g = s[i + 1]; i += 2; }
          let color = '';
          if (g.startsWith('#')) { const bar = g.indexOf('|'); color = ` fill="${C[g.slice(1, bar)] || g.slice(1, bar)}"`; g = g.slice(bar + 1); }
          out += `<tspan dy="${f(-up + st.back)}" dx="2" font-size="${small}"${color}>${esc(g)}</tspan>`;
          st.back = up; continue;
        }
        const isL = /[a-zA-Z]/.test(s[i]);
        let j = i;
        while (j < s.length && s[j] !== '^' && !s.startsWith('{#', j) && /[a-zA-Z]/.test(s[j]) === isL) j++;
        const piece = s.slice(i, j); i = j;
        out += isL ? `<tspan${dy()} font-family="${SERIF}" font-style="italic">${piece}</tspan>` : `<tspan${dy()}>${esc(piece)}</tspan>`;
      }
      return out;
    };
    return walk(src);
  }
  const mt = (x, y, s, { size = 30, color = C.ink, anchor = 'middle', cls = '', st = '' } = {}) =>
    `<text class="${cls}" ${st} x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-size="${size}" font-weight="700" fill="${color}">${tsp(String(s), size)}</text>`;
  // 글자 폭 어림(고리·상자 자리 잡기용)
  const cw = (ch) => (/[0-9]/.test(ch) ? .58 : /[a-zA-Z]/.test(ch) ? .52 : ch === ' ' ? .3 : /[()|,.]/.test(ch) ? .34 : .66);
  function wid(src, size) {
    const s = String(src).replace(/\{#\w+\|([^{}]*)\}/g, '$1');
    let w = 0, i = 0;
    while (i < s.length) {
      if (s[i] === '^') {
        let g; if (s[i + 1] === '{') { const j = s.indexOf('}', i); g = s.slice(i + 2, j); i = j + 1; } else { g = s[i + 1]; i += 2; }
        w += [...g].reduce((a, c) => a + cw(c), 0) * size * .62 + 2; continue;
      }
      w += cw(s[i]) * size; i++;
    }
    return w;
  }
  // 세로 분수: 가운데 가로줄 높이가 cy
  function fr(x, cy, n, d, { size = 30, color = C.ink, nc = color, dc = color } = {}) {
    const w = Math.max(wid(n, size), wid(d, size)) + 12;
    return mt(x, cy - size * 0.24, n, { size, color: nc })
      + `<path d="M${f(x - w / 2)} ${f(cy)} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + mt(x, cy + size * 0.98, d, { size, color: dc });
  }
  // 한 줄 수식: 조각마다 가운데 x(xs)와 폭(ws)을 돌려준다. 조각: '글자' | {s, c, cls, st, size} | {fr:[분자, 분모], c, cls, st}
  function row(cx, y, items, { size = 32, gap = size * .3, color = C.ink, anchor = 'middle' } = {}) {
    const it = items.map((o) => (typeof o === 'string' ? { s: o } : o));
    const ws = it.map((o) => o.w ?? (o.fr ? Math.max(wid(o.fr[0], size * .8), wid(o.fr[1], size * .8)) + 12 : wid(o.s, o.size || size)));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (it.length - 1);
    let x = anchor === 'middle' ? cx - total / 2 : anchor === 'end' ? cx - total : cx;
    const xs = [];
    let body = '';
    it.forEach((o, k) => {
      const c = x + ws[k] / 2; xs.push(f(c));
      let m = o.fr ? fr(c, y - size * .34, o.fr[0], o.fr[1], { size: size * .8, color: o.c || color })
        : o.s === '' ? '' : mt(c, y, o.s, { size: o.size || size, color: o.c || color });
      if (o.cls) m = `<g class="${o.cls}" ${o.st || ''}>${m}</g>`;
      body += m; x += ws[k] + gap;
    });
    return { body, xs, ws, total, left: anchor === 'middle' ? cx - total / 2 : cx };
  }
  const ring = (x, y, r, color, cls, d = 0, w = 4) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
  const pill = (x, y, label, color, { size = 24, cls = '', d = 0, fill = 'white' } = {}) => {
    const w = [...label].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : .6), 0) * size + 26, h = size + 18;
    return `<g class="${cls}" ${cls ? delay(d) : ''}><rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${color}" stroke-width="3"/>${text(x, f(y + size * .36), label, { size, color })}</g>`;
  };

  const dot = (x, y, color, cls = '', d = 0, r = 9) => `<circle class="${cls}" ${cls ? delay(d) : ''} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${color}" stroke="white" stroke-width="2.5"/>`;
  const sgn = (n) => (n > 0 ? String(n) : n < 0 ? `-${-n}` : '0');
  // 좌표평면: 조각을 따로 돌려준다(grid 모눈, xa·ya 축, xn·yn 눈금 수, O, lx·ly 축 이름). X(x)·Y(y) 는 화면 자리.
  function plane({ ox = 320, oy = 180, u = 26, x0 = -5, x1 = 5, y0 = -5, y1 = 5, every = 1, xc = C.ink, yc = C.ink, xcls = '', ycls = '', size = 18 } = {}) {
    const X = (x) => ox + x * u, Y = (y) => oy - y * u;
    let grid = '', xn = '', yn = '';
    for (let x = x0; x <= x1; x++) if (x) grid += `<path d="M${f(X(x))} ${f(Y(y1))} V${f(Y(y0))}" stroke="${C.line}" stroke-width="1.3"/>`;
    for (let y = y0; y <= y1; y++) if (y) grid += `<path d="M${f(X(x0))} ${f(Y(y))} H${f(X(x1))}" stroke="${C.line}" stroke-width="1.3"/>`;
    for (let x = x0; x <= x1; x++) if (x && x % every === 0) xn += mt(X(x), Y(0) + 24, sgn(x), { size });
    for (let y = y0; y <= y1; y++) if (y && y % every === 0) yn += mt(X(0) - 8, Y(y) + 6, sgn(y), { size, anchor: 'end' });
    const ah = (x, y, dx, dy, c) => `<path d="M${f(x - 10 * dx - 7 * dy)} ${f(y - 10 * dy - 7 * dx)} L${f(x)} ${f(y)} L${f(x - 10 * dx + 7 * dy)} ${f(y - 10 * dy + 7 * dx)}" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const hw = (c, h) => (c ? `<g class="${c.replace('draw d', 's')}" style="animation-delay:.5s">${h}</g>` : h);
    const xa = `<path class="${xcls}" ${xcls ? 'pathLength="1"' : ''} d="M${f(X(x0) - 14)} ${f(Y(0))} H${f(X(x1) + 20)}" stroke="${xc}" stroke-width="3"/>` + hw(xcls, ah(X(x1) + 20, Y(0), 1, 0, xc));
    const ya = `<path class="${ycls}" ${ycls ? 'pathLength="1"' : ''} d="M${f(X(0))} ${f(Y(y0) + 14)} V${f(Y(y1) - 20)}" stroke="${yc}" stroke-width="3"/>` + hw(ycls, ah(X(0), Y(y1) - 20, 0, -1, yc));
    const lx = mt(X(x1) + 22, Y(0) + 26, 'x', { size: 24, color: xc }), ly = mt(X(0) + 18, Y(y1) - 14, 'y', { size: 24, color: yc });
    const O = mt(X(0) - 13, Y(0) + 24, 'O', { size: 20 });
    return { grid, xa, ya, xn, yn, lx, ly, O, X, Y, all: grid + xa + ya + xn + yn + lx + ly + O };
  }
  const guide = (x1, y1, x2, y2, color, cls, d) => `<path class="draw ${cls}" pathLength="1" ${delay(d)} d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="3" stroke-dasharray="1" />`;
  const dashed = (x1, y1, x2, y2, color, cls = '', d = 0) => `<path class="${cls}" ${cls ? delay(d) : ''} d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="3" stroke-dasharray="7 6"/>`;

  // 순서쌍: 2 와 5 를 순서를 정해 (2, 5) → 순서를 바꾸면 (5, 2) → 모눈에서 다른 곳
  (function () {
    const id = 't71-m4-sunseo';
    const A = row(160, 110, ['(', '{#orange|2}', ',', '{#blue|5}', ')'], { size: 54, gap: 10 });
    const B = row(160, 250, ['(', '5', ',', '2', ')'], { size: 54, gap: 10 });
    const G = plane({ ox: 350, oy: 314, u: 40, x0: 0, x1: 6, y0: 0, y1: 6, size: 18 });
    const body = `<g class="s1">${A.body}</g>`
      + `<g class="s1" ${delay(.5)}>${text(A.xs[1], 158, '앞', { size: 22, color: C.orange })}${text(A.xs[3], 158, '뒤', { size: 22, color: C.blue })}</g>`
      + `<g class="s2">${mt(B.xs[0], 250, '(', { size: 54 })}${mt(B.xs[2], 250, ',', { size: 54 })}${mt(B.xs[4], 250, ')', { size: 54 })}</g>`
      + `<g class="f2" ${delay(.2, `--dx:${f(A.xs[3] - B.xs[1])}px;--dy:-140px`)}>${mt(B.xs[1], 250, '5', { size: 54, color: C.blue })}</g>`
      + `<g class="f2" ${delay(.2, `--dx:${f(A.xs[1] - B.xs[3])}px;--dy:-140px`)}>${mt(B.xs[3], 250, '2', { size: 54, color: C.orange })}</g>`
      + `<g class="s2" ${delay(1)}>${text(160, 196, '≠', { size: 40, color: C.red })}</g>`
      + `<g class="s3">${G.grid}${G.xa}${G.ya}${G.xn}${G.yn}${G.O}</g>`
      + dot(G.X(2), G.Y(5), C.orange, 'p3', .5, 10) + dot(G.X(5), G.Y(2), C.blue, 'p3', .8, 10)
      + `<g class="s3" ${delay(.6)}>${row(G.X(2) + 8, G.Y(5) - 16, ['(2, 5)'], { size: 22, color: C.orange, anchor: 'start' }).body}</g>`
      + `<g class="s3" ${delay(.9)}>${row(G.X(5) + 8, G.Y(2) - 16, ['(5, 2)'], { size: 22, color: C.blue, anchor: 'start' }).body}</g>`
      + pill(160, 324, '순서쌍', C.green, { size: 26, cls: 'p3', d: 1.2, fill: C.mint });
    put('7-1/수학/4/순서쌍', svg(id, body, motion(id)));
  })();

  // 좌표: 수직선 위의 점 A(3) → 평면 위의 점 P 는 원점에서 오른쪽 3, 위로 2 → P(3, 2)
  (function () {
    const id = 't71-m4-jwapyo';
    const G = plane({ ox: 160, oy: 250, u: 44, x0: -2, x1: 6, y0: -2, y1: 4, size: 19 });
    const body = `<g class="s2" ${delay(.1)}>${G.grid}${G.ya}${G.yn}${G.ly}</g>` + G.xa + G.xn + G.O
      + `<g class="h2">${dot(G.X(3), G.Y(0), C.purple, 'p1', .3, 10)}<g class="s1" ${delay(.6)}>${row(G.X(3), G.Y(0) - 20, ['A(3)'], { size: 26, color: C.purple }).body}</g></g>`
      + `<path class="draw d2" pathLength="1" ${delay(.5)} d="M${G.X(0)} ${G.Y(0) - 5} H${G.X(3)}" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`
      + `<path class="draw d2" pathLength="1" ${delay(1.1)} d="M${G.X(3)} ${G.Y(0) - 5} V${G.Y(2)}" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/>`
      + `<g class="s2" ${delay(.9)}>${text(G.X(1.5), G.Y(0) - 16, 3, { size: 24, color: C.orange })}</g><g class="s2" ${delay(1.5)}>${text(G.X(3) + 20, G.Y(1) + 8, 2, { size: 24, color: C.blue })}</g>`
      + dot(G.X(3), G.Y(2), C.purple, 'p2', 1.6, 10)
      + `<g class="p3" ${delay(.2)}>${row(G.X(3) + 12, G.Y(2) - 18, ['P({#orange|3}, {#blue|2})'], { size: 30, anchor: 'start' }).body}</g>`
      + ring(G.X(3), G.Y(2), 18, C.purple, 'r3', .4)
      + pill(560, 300, '좌표', C.purple, { size: 28, cls: 'p3', d: .8, fill: C.lilac });
    put('7-1/수학/4/좌표', svg(id, body, motion(id)));
  })();

  // x좌표 / y좌표: 점 P(5, −2) 에서 x축(y축)으로 점선 → 닿는 눈금 5(−2) → 순서쌍의 앞(뒤) 수
  for (const [word, id, isX, color, fill] of [
    ['x좌표', 't71-m4-xjwa', true, C.orange, C.peach],
    ['y좌표', 't71-m4-yjwa', false, C.blue, C.sky]
  ]) {
    const G = plane({ ox: 130, oy: 140, u: 40, x0: -2, x1: 6, y0: -4, y1: 2, size: 19 });
    const px = G.X(5), py = G.Y(-2);
    const lab = isX ? 'P({#orange|5}, -2)' : 'P(5, {#blue|-2})';
    const R = row(520, 130, [lab], { size: 38 });
    const hx = isX ? R.left + wid('P(', 38) + wid('5', 38) / 2 : R.left + wid('P(5, ', 38) + wid('-2', 38) / 2;
    const body = G.all
      + dot(px, py, C.purple, 'p1', .2, 10) + `<g class="s1" ${delay(.5)}>${row(px + 14, py + 30, ['P'], { size: 26, color: C.purple, anchor: 'start' }).body}</g>`
      + (isX ? guide(px, py, px, G.Y(0), color, 'd2', .1) : guide(px, py, G.X(0), py, color, 'd2', .1))
      + ring(isX ? px : G.X(0), isX ? G.Y(0) : py, 18, color, 'r2', .7)
      + `<g class="p2" ${delay(.7)}>${isX ? mt(px, G.Y(0) - 14, '5', { size: 30, color }) : mt(G.X(0) + 12, py - 10, '-2', { size: 30, color, anchor: 'start' })}</g>`
      + `<g class="s3" ${delay(.1)}>${R.body}</g>` + ring(hx, 116, 24, color, 'r3', .5)
      + `<g class="s3" ${delay(.6)}>${arrow(hx, 210, hx, 160, color)}</g>`
      + pill(hx, 238, word, color, { size: 26, cls: 'p3', d: .8, fill });
    put(`7-1/수학/4/${word}`, svg(id, body, motion(id)));
  }

  // x축 / y축: 가로(세로) 수직선이 그려짐 → 축 이름 → 점 (4, 0) / (0, −2) 은 그 축 위
  for (const [word, id, isX, color, fill, pt] of [
    ['x축', 't71-m4-xchuk', true, C.orange, C.peach, [4, 0]],
    ['y축', 't71-m4-ychuk', false, C.blue, C.sky, [0, -2]]
  ]) {
    const G = plane({ ox: 300, oy: 186, u: 40, x0: -5, x1: 5, y0: -3, y1: 3, size: 19, xc: isX ? color : C.muted, yc: isX ? C.muted : color, xcls: isX ? 'draw d1' : '', ycls: isX ? '' : 'draw d1' });
    const lab = isX ? row(G.X(4), G.Y(0) - 18, ['(4, 0)'], { size: 26, color: C.purple }) : row(G.X(0) + 14, G.Y(-2) + 8, ['(0, -2)'], { size: 26, color: C.purple, anchor: 'start' });
    const body = G.grid + G.O
      + (isX ? G.ya + G.yn + G.ly + `<g class="s1" ${delay(.5)}>${G.xn}</g>` + G.xa : G.xa + G.xn + G.lx + `<g class="s1" ${delay(.5)}>${G.yn}</g>` + G.ya)
      + `<g class="k2" ${delay(.2)}>${isX ? G.lx : G.ly}</g>`
      + (isX ? `<g class="s2" ${delay(.5)}><rect x="${G.X(-5) - 14}" y="${G.Y(0) - 7}" width="${G.X(5) - G.X(-5) + 34}" height="14" rx="7" fill="${color}" fill-opacity=".25"/></g>`
        : `<g class="s2" ${delay(.5)}><rect x="${G.X(0) - 7}" y="${G.Y(3) - 20}" width="14" height="${G.Y(-3) - G.Y(3) + 34}" rx="7" fill="${color}" fill-opacity=".25"/></g>`)
      + pill(isX ? 570 : 400, isX ? 150 : 60, word, color, { size: 26, cls: 'p2', d: .8, fill })
      + dot(G.X(pt[0]), G.Y(pt[1]), C.purple, 'p3', .2, 10) + ring(G.X(pt[0]), G.Y(pt[1]), 18, C.purple, 'r3', .5)
      + `<g class="s3" ${delay(.5)}>${lab.body}</g>`;
    put(`7-1/수학/4/${word}`, svg(id, body, motion(id)));
  }

  // 좌표축: x축 → y축 → 원점에서 직각으로 만나는 두 축을 함께
  (function () {
    const id = 't71-m4-chuk';
    const G = plane({ ox: 300, oy: 186, u: 40, x0: -5, x1: 5, y0: -3, y1: 3, size: 19, xc: C.orange, yc: C.blue, xcls: 'draw d1', ycls: 'draw d2' });
    const O0 = G.X(0), O1 = G.Y(0);
    const body = G.grid
      + G.xa + `<g class="s1" ${delay(.5)}>${G.xn}${G.lx}</g>`
      + G.ya
      + `<g class="s2" ${delay(.5)}>${G.yn}${G.ly}</g>`
      + `<g class="s3" ${delay(.2)}><path d="M${O0 + 18} ${O1} V${O1 - 18} H${O0}" stroke="${C.red}" stroke-width="3" fill="none"/></g>`
      + `<g class="k3" ${delay(.4)}><path d="M${G.X(-5) - 14} ${O1} H${G.X(5) + 20} M${O0} ${G.Y(-3) + 14} V${G.Y(3) - 20}" stroke="${C.green}" stroke-width="7" stroke-opacity=".45" stroke-linecap="round"/></g>`
      + G.O + ring(O0, O1, 16, C.green, 'r3', .3)
      + pill(560, 60, '좌표축', C.green, { size: 26, cls: 'p3', d: .9, fill: C.mint });
    put('7-1/수학/4/좌표축', svg(id, body, motion(id)));
  })();

  // 좌표평면: 두 축 → 모눈으로 평면 전체 → 점 (2, 3) 을 순서쌍으로
  (function () {
    const id = 't71-m4-pyeongmyeon';
    const G = plane({ ox: 300, oy: 186, u: 38, x0: -5, x1: 5, y0: -4, y1: 4, size: 18 });
    const px = G.X(2), py = G.Y(3);
    const body = `<g class="s2" ${delay(.1)}><rect x="${G.X(-5)}" y="${G.Y(4)}" width="${G.X(5) - G.X(-5)}" height="${G.Y(-4) - G.Y(4)}" fill="${C.mint}" fill-opacity=".45"/>${G.grid}</g>`
      + G.xa + G.ya + G.xn + G.yn + G.lx + G.ly + G.O
      + `<g class="k1" ${delay(.2)}><path d="M${G.X(-5) - 14} ${G.Y(0)} H${G.X(5) + 20} M${G.X(0)} ${G.Y(-4) + 14} V${G.Y(4) - 20}" stroke="${C.green}" stroke-width="7" stroke-opacity=".4" stroke-linecap="round"/></g>`
      + dashed(px, py, px, G.Y(0), C.orange, 's3', .3) + dashed(px, py, G.X(0), py, C.blue, 's3', .3)
      + dot(px, py, C.purple, 'p3', .5, 10) + `<g class="s3" ${delay(.7)}>${row(px + 14, py - 12, ['({#orange|2}, {#blue|3})'], { size: 26, anchor: 'start' }).body}</g>`
      + pill(560, 300, '좌표평면', C.green, { size: 24, cls: 'p3', d: 1, fill: C.mint });
    put('7-1/수학/4/좌표평면', svg(id, body, motion(id)));
  })();

  // 사분면: 두 축이 평면을 넷으로 → 제1~제4사분면(시곗바늘 반대 방향) → 점 (−2, 3) 은 제2사분면
  (function () {
    const id = 't71-m4-sabun';
    const G = plane({ ox: 300, oy: 180, u: 26, x0: -6, x1: 6, y0: -6, y1: 6, every: 2, size: 18 });
    const Q = [[1, 1, C.peach, C.orange], [-1, 1, C.sky, C.blue], [-1, -1, C.mint, C.green], [1, -1, C.lilac, C.purple]];
    const body = Q.map(([sx, sy, fill], i) => `<rect class="p2" ${delay(.1 + i * .3)} x="${sx > 0 ? G.X(0) : G.X(-6)}" y="${sy > 0 ? G.Y(6) : G.Y(0)}" width="${6 * 26}" height="${6 * 26}" fill="${fill}" fill-opacity=".7"/>`).join('')
      + G.grid + `<g class="k1" ${delay(.2)}>${G.xa}${G.ya}</g>` + G.xn + G.yn + G.lx + G.ly + G.O
      + Q.map(([sx, sy, , ink], i) => `<g class="p2" ${delay(.3 + i * .3)}><rect x="${f(G.X(sx * 3.5) - 56)}" y="${f(G.Y(sy * 4.6) - 22)}" width="112" height="34" rx="8" fill="white" fill-opacity=".9"/>${text(f(G.X(sx * 3.5)), f(G.Y(sy * 4.6) + 4), `제${i + 1}사분면`, { size: 20, color: ink })}</g>`).join('')
      + `<rect class="k3" ${delay(.3)} x="${G.X(-6)}" y="${G.Y(6)}" width="156" height="156" fill="none" stroke="${C.blue}" stroke-width="5"/>`
      + dot(G.X(-2), G.Y(3), C.red, 'p3', .3, 9) + `<g class="s3" ${delay(.5)}>${row(G.X(-2) - 14, G.Y(3) + 8, ['(-2, 3)'], { size: 22, color: C.red, anchor: 'end' }).body}</g>`
      + pill(560, 300, '사분면', C.green, { size: 26, cls: 'p3', d: 1, fill: C.mint });
    put('7-1/수학/4/사분면', svg(id, body, motion(id)));
  })();

  // 그래프: 시각과 기온의 순서쌍 → 좌표평면의 점 → 이어 보면 변화가 한눈에
  (function () {
    const id = 't71-m4-graph';
    const X = (t) => 92 + (t - 8) * 48, Y = (T) => 312 - T * 9;
    const data = [[9, 14], [11, 19], [13, 23], [15, 21], [17, 16]];
    let ax = `<path d="M${X(8)} ${Y(0)} H${X(18) + 10}" stroke="${C.ink}" stroke-width="3"/><path d="M${X(8)} ${Y(0)} V${Y(25) - 14}" stroke="${C.ink}" stroke-width="3"/>`;
    for (const t of [9, 11, 13, 15, 17]) ax += `<path d="M${X(t)} ${Y(0)} V${Y(25)}" stroke="${C.line}" stroke-width="1.3"/>` + text(X(t), Y(0) + 26, t, { size: 19, weight: 600 });
    for (const T of [5, 10, 15, 20, 25]) ax += `<path d="M${X(8)} ${Y(T)} H${X(18)}" stroke="${C.line}" stroke-width="1.3"/>` + text(X(8) - 10, Y(T) + 6, T, { size: 19, weight: 600, anchor: 'end' });
    ax += text(X(18) + 6, Y(0) - 10, '시각(시)', { size: 19, color: C.muted, anchor: 'end' }) + text(X(8) + 8, Y(25) - 14, '기온(℃)', { size: 19, color: C.muted, anchor: 'start' });
    const chipX = (i) => 172 + i * 102;
    const body = ax
      + data.map(([t, T], i) => `<g class="p1" ${delay(.1 + i * .2)}><rect x="${chipX(i) - 48}" y="12" width="96" height="36" rx="18" fill="white" stroke="${C.purple}" stroke-width="2.5"/>${row(chipX(i), 38, [`(${t}, ${T})`], { size: 21, color: C.purple }).body}</g>`).join('')
      + `<path class="draw d3" pathLength="1" ${delay(.1)} d="M${data.map(([t, T]) => `${X(t)} ${f(Y(T))}`).join(' L')}" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linejoin="round"/>`
      + data.map(([t, T], i) => `<g class="f2" ${delay(.1 + i * .15, `--dx:${f(chipX(i) - X(t))}px;--dy:${f(30 - Y(T))}px`)}>${dot(X(t), Y(T), C.purple, '', 0, 9)}</g>`).join('')
      + pill(190, 108, '그래프', C.orange, { size: 26, cls: 'p3', d: .8, fill: C.peach });
    put('7-1/수학/4/그래프', svg(id, body, motion(id)));
  })();

  // 변수: 걸은 시간 x 가 1, 2, 3 으로 → 걸은 거리 y 가 70, 140, 210 으로 → 바뀌는 값을 나타내는 문자
  (function () {
    const id = 't71-m4-byeonsu';
    const RX = (k) => 110 + k * 140, RY = 176;
    let road = `<path d="M90 ${RY} H${RX(3) + 30}" stroke="${C.muted}" stroke-width="6" stroke-linecap="round"/>`;
    for (let k = 0; k <= 3; k++) road += `<path d="M${RX(k)} ${RY - 10} V${RY + 10}" stroke="${C.ink}" stroke-width="3"/>` + text(RX(k), RY + 36, `${k}분`, { size: 20, color: C.blue }) + text(RX(k), RY + 62, `${70 * k} m`, { size: 20, color: C.orange });
    const cyc = (vals, x, y, color, cls) => vals.map((v, i) => `<g class="${cls} c${i + 1}">${mt(x, y, v, { size: 36, color })}</g>`).join('');
    const body = road
      + `<g class="walk"><circle cx="${RX(0)}" cy="${RY - 22}" r="14" fill="${C.purple}"/><path d="M${RX(0)} ${RY - 8} V${RY - 2}" stroke="${C.purple}" stroke-width="4"/></g>`
      + `<rect x="62" y="42" width="170" height="58" rx="12" fill="white" stroke="${C.blue}" stroke-width="3"/>` + cyc(['x = 1', 'x = 2', 'x = 3'], 147, 84, C.blue, 'cx')
      + text(250, 80, '걸은 시간', { size: 22, color: C.blue, anchor: 'start' })
      + `<g class="s2"><rect x="62" y="270" width="170" height="58" rx="12" fill="white" stroke="${C.orange}" stroke-width="3"/>${text(250, 308, '걸은 거리', { size: 22, color: C.orange, anchor: 'start' })}${cyc(['y = 70', 'y = 140', 'y = 210'], 147, 312, C.orange, 'cy')}</g>`
      + `<rect class="k3" ${delay(.2)} x="56" y="36" width="182" height="70" rx="15" fill="none" stroke="${C.green}" stroke-width="4"/>`
      + `<rect class="k3" ${delay(.2)} x="56" y="264" width="182" height="70" rx="15" fill="none" stroke="${C.green}" stroke-width="4"/>`
      + pill(500, 72, '변수', C.green, { size: 26, cls: 'p3', d: .6, fill: C.mint }) + pill(500, 300, '변수', C.green, { size: 26, cls: 'p3', d: .8, fill: C.mint });
    // 한 바퀴 4.5초: 0~10% 걸어 1분 자리, 33~43% 2분 자리, 66~76% 3분 자리
    const T = 4.5;
    put('7-1/수학/4/변수', svg(id, body, motion(id) + `
      .sc-${id} :is(.cx, .cy) { opacity: 0; }
      .on1 .sc-${id} .walk { animation: ${id}-walk ${T}s ease-in-out infinite; }
      .on1 .sc-${id} .c1 { animation: ${id}-v1 ${T}s step-end infinite; }
      .on1 .sc-${id} .c2 { animation: ${id}-v2 ${T}s step-end infinite; }
      .on1 .sc-${id} .c3 { animation: ${id}-v3 ${T}s step-end infinite; }
      @keyframes ${id}-walk { 0% { transform: none; } 10%, 33% { transform: translateX(140px); } 43%, 66% { transform: translateX(280px); } 76%, 100% { transform: translateX(420px); } }
      @keyframes ${id}-v1 { 0% { opacity: 1; } 41% { opacity: 0; } }
      @keyframes ${id}-v2 { 0% { opacity: 0; } 41% { opacity: 1; } 74% { opacity: 0; } }
      @keyframes ${id}-v3 { 0% { opacity: 0; } 74% { opacity: 1; } 100% { opacity: 1; } }`));
  })();

  // 정비례 / 반비례 공통: 표(x, y)와 배 화살, 오른쪽 좌표평면
  const table = (xs, ys, x0, y0) => {
    const cx = (i) => x0 + 50 + i * 52;
    let s = `<rect x="${x0 - 30}" y="${y0 - 30}" width="${52 * xs.length + 60}" height="100" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/><path d="M${x0 + 22} ${y0 - 30} V${y0 + 70} M${x0 - 30} ${y0 + 20} H${x0 + 30 + 52 * xs.length}" stroke="${C.line}" stroke-width="2.5"/>`
      + mt(x0, y0 + 9, 'x', { size: 26, color: C.blue }) + mt(x0, y0 + 59, 'y', { size: 26, color: C.orange });
    xs.forEach((v, i) => { s += text(cx(i), y0 + 9, v, { size: 26 }) + text(cx(i), y0 + 59, ys[i], { size: 26 }); });
    return { body: s, cx };
  };
  const times = (T, i, j, y, up, label, color, cls, d) => {
    const a = T.cx(i), b = T.cx(j), h = up ? -1 : 1;
    const cx = (a + b) / 2, cy = y + h * (22 + (j - i) * 10), ex = b - 4, ang = Math.atan2(y - cy, ex - cx);
    const p = (t) => `${f(ex - 11 * Math.cos(ang + t))} ${f(y - 11 * Math.sin(ang + t))}`;
    return `<g class="${cls}" ${delay(d)}><path d="M${a} ${y} Q${cx} ${cy} ${ex} ${y} M${p(-0.5)} L${ex} ${y} L${p(0.5)}" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${label}</g>`;
  };

  // 정비례: y = 2x 에서 x 가 2배, 3배 → y 도 2배, 3배 → 점이 원점을 지나는 직선 위에
  (function () {
    const id = 't71-m4-jeongbi';
    const T = table([1, 2, 3, 4], [2, 4, 6, 8], 54, 150);
    const G = plane({ ox: 410, oy: 266, u: 22, x0: -3, x1: 8, y0: -3, y1: 9, every: 2, size: 18 });
    const pts = [[1, 2], [2, 4], [3, 6], [4, 8]];
    const lab = (x, y, s, color) => mt(x, y, s, { size: 20, color });
    const body = `<g>${row(150, 50, ['y = 2x'], { size: 40 }).body}</g>` + T.body
      + times(T, 0, 1, 118, true, lab((T.cx(0) + T.cx(1)) / 2, 88, '*2', C.blue), C.blue, 's1', .4)
      + times(T, 0, 2, 118, true, lab(T.cx(2) + 18, 92, '*3', C.blue), C.blue, 's1', .8)
      + times(T, 0, 1, 222, false, lab((T.cx(0) + T.cx(1)) / 2, 264, '*2', C.orange), C.orange, 's1', 1)
      + times(T, 0, 2, 222, false, lab(T.cx(2) + 18, 264, '*3', C.orange), C.orange, 's1', 1.3)
      + `<g class="s2">${G.all}</g>`
      + pts.map(([x, y], i) => dot(G.X(x), G.Y(y), C.purple, 'p2', .4 + i * .25, 8)).join('')
      + `<path class="draw d3" pathLength="1" ${delay(.2)} d="M${G.X(-1.5)} ${G.Y(-3)} L${G.X(4.5)} ${G.Y(9)}" stroke="${C.green}" stroke-width="4"/>`
      + ring(G.X(0), G.Y(0), 14, C.green, 'r3', .9)
      + `<g class="s3" ${delay(.9)}>${row(G.X(4.6) + 8, G.Y(8.4), ['y = 2x'], { size: 24, color: C.green, anchor: 'start' }).body}</g>`
      + pill(150, 322, '정비례', C.green, { size: 26, cls: 'p3', d: 1.1, fill: C.mint });
    put('7-1/수학/4/정비례', svg(id, body, motion(id)));
  })();

  // 반비례: y = 6/x 에서 x 가 2배, 3배 → y 는 1/2배, 1/3배 → 좌표축에 가까워지는 한 쌍의 곡선
  (function () {
    const id = 't71-m4-banbi';
    const T = table([1, 2, 3, 6], [6, 3, 2, 1], 54, 150);
    const G = plane({ ox: 450, oy: 186, u: 20, x0: -7, x1: 7, y0: -7, y1: 7, every: 2, size: 18 });
    const pts = [[1, 6], [2, 3], [3, 2], [6, 1]];
    const curve = (s) => { const P = []; for (let k = 0; k <= 48; k++) { const x = s * (6 / 7.2) * Math.pow(7.2 * 7.2 / 6, k / 48); P.push(`${f(G.X(x))} ${f(G.Y(6 / x))}`); } return `M${P.join(' L')}`; };
    const half = (x, y, d, color) => row(x, y, ['*', { fr: ['1', String(d)] }], { size: 24, gap: 3, color }).body;
    const body = `<g>${row(90, 56, ['y', '='], { size: 38, anchor: 'start', gap: 10 }).body}${fr(176, 43, '6', 'x', { size: 32 })}</g>` + T.body
      + times(T, 0, 1, 118, true, mt((T.cx(0) + T.cx(1)) / 2, 88, '*2', { size: 20, color: C.blue }), C.blue, 's1', .4)
      + times(T, 0, 2, 118, true, mt(T.cx(2) + 18, 92, '*3', { size: 20, color: C.blue }), C.blue, 's1', .8)
      + times(T, 0, 1, 222, false, half((T.cx(0) + T.cx(1)) / 2, 272, 2, C.orange), C.orange, 's1', 1)
      + times(T, 0, 2, 222, false, half(T.cx(2) + 22, 272, 3, C.orange), C.orange, 's1', 1.3)
      + `<g class="s2">${G.all}</g>`
      + pts.map(([x, y], i) => dot(G.X(x), G.Y(y), C.purple, 'p2', .4 + i * .25, 8)).join('')
      + `<path class="draw d3" pathLength="1" ${delay(.2)} d="${curve(1)}" stroke="${C.green}" stroke-width="4" fill="none"/>`
      + `<path class="draw d3" pathLength="1" ${delay(.7)} d="${curve(-1)}" stroke="${C.green}" stroke-width="4" fill="none"/>`
      + pill(150, 322, '반비례', C.green, { size: 26, cls: 'p3', d: 1.1, fill: C.mint });
    put('7-1/수학/4/반비례', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
