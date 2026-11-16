// 수학 8-1 5단원 일차함수와 그래프: 낱말 도식(공용 도구는 math-1.js 의 root.CVMath8)
// 좌표평면의 눈금 수가 점·직선과 겹치는 자리는 plane 의 skipX·skipY 로 비우고, 필요한 값은 따로 색 글씨로 쓴다.
(function (root) {
  'use strict';
  const { C, svg, put, f, g, motion, lab, mt, fr, row, pill, card, line, pathD, dot, ring, arrow, plane } = root.CVMath8;
  const KEY = '8-1/수학/5/';

  // 짝짓기 상자: 넣는 수가 상자로 들어가고 나오는 수가 오른쪽 자리로 간다
  const tileR = (x, y, s, stroke, fill) => `<rect x="${f(x - 30)}" y="${f(y - 24)}" width="60" height="48" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + mt(x, y + 11, s, { size: 30 });
  const machine = (cx, cy, w, h, label, cls = '') => `<g class="${cls}"><path d="M${cx - w / 2 - 18} ${cy - 22} L${cx - w / 2} ${cy - 12} V${cy + 12} L${cx - w / 2 - 18} ${cy + 22} Z M${cx + w / 2 + 18} ${cy - 22} L${cx + w / 2} ${cy - 12} V${cy + 12} L${cx + w / 2 + 18} ${cy + 22} Z" fill="${C.line}"/>`
    + `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="14" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/></g>` + (label ? mt(cx, cy + 13, label, { size: 36 }) : '');
  const goCss = (id) => `
    @keyframes ${id}-in { 0% { opacity: 1; transform: none; } 75% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--tx), var(--ty)); } }
    @keyframes ${id}-out { 0% { opacity: 0; transform: translate(var(--tx), var(--ty)); } 25% { opacity: 1; } 100% { opacity: 1; transform: none; } }
    .sc-${id} [class*="go"] { opacity: 0; }
    .sc-${id} [class*="gi"] { opacity: 0; }` + [1, 2, 3, 4].map((n) => `
    .on${n} .sc-${id} .gi${n} { animation: ${id}-in .6s ease-in both; }
    .on${n} .sc-${id} .go${n} { animation: ${id}-out .6s ease-out both; }`).join('');
  // 넣는 수 a(위치 A) → 상자 M → 나오는 수 b(위치 B). 칸 n, 시작 d
  const travel = (n, d, A, M, B, sa, sb, ca, cb) =>
    `<g class="gi${n}" style="animation-delay:${d}s;--tx:${f(M[0] - 50 - A[0])}px;--ty:${f(M[1] - A[1])}px">${tileR(A[0], A[1], sa, ca[0], ca[1])}</g>`
    + `<g class="go${n}" style="animation-delay:${f(d + .5)}s;--tx:${f(M[0] + 50 - B[0])}px;--ty:${f(M[1] - B[1])}px">${tileR(B[0], B[1], sb, cb[0], cb[1])}</g>`;

  // 함수: × 2 상자에 1 → 2, 2 → 4, 3 → 6 이 하나씩 나옴 → 약수 상자는 4 → 1, 2, 4 여러 개(함수 아님) → x 하나에 y 하나
  {
    const id = 't81-m5-hamsu';
    const M = [320, 130], ys = [70, 130, 190], blue = [C.blue, C.sky], orange = [C.orange, C.peach];
    const body = machine(320, 130, 140, 96, '× 2')
      + lab(80, 34, 'x', { size: 26, c: C.blue }) + g('s1', lab(560, 34, 'y', { size: 26, c: C.orange }), .1)
      + ys.map((y, k) => tileR(80, y, String(k + 1), C.blue, C.sky)).join('')
      + travel(1, .2, [80, ys[0]], M, [560, ys[0]], '1', '2', blue, orange)
      + travel(2, .1, [80, ys[1]], M, [560, ys[1]], '2', '4', blue, orange)
      + travel(2, .8, [80, ys[2]], M, [560, ys[2]], '3', '6', blue, orange)
      + g('s3', `<path d="M40 238 H600" stroke="${C.line}" stroke-width="3"/>` + tileR(80, 296, '4', C.blue, C.sky) + arrow(118, 296, 168, 296, C.muted) + card(240, 296, 120, 60, C.muted, 'white') + lab(240, 304, '약수', { size: 24 })
        + arrow(306, 296, 356, 296, C.muted) + mt(440, 306, '1, 2, 4', { size: 32, color: C.red }), .1)
      + g('p3', pill(570, 296, '함수 아님', C.red, { size: 20, fill: C.peach }), .9)
      + ring([560, 70], 30, C.orange, 'r4', .1) + ring([560, 130], 30, C.orange, 'r4', .1) + ring([560, 190], 30, C.orange, 'r4', .1)
      + pill(320, 214, '함수 y = 2x', C.green, { size: 24, cls: 'p4', d: .7, fill: C.mint });
    put(KEY + '함수', svg(id, body, motion(id) + goCss(id) + `.on4 .sc-${id} .s3, .on4 .sc-${id} .p3 { opacity: .3; animation: none; transition: opacity .5s; }`));
  }

  // 함숫값: f(x) = 2x + 1 상자 → 3 을 넣으면 2 × 3 + 1 → 7 이 나옴 → f(3) = 7, 7 이 x = 3 의 함숫값
  {
    const id = 't81-m5-hamsugap';
    const M = [320, 150];
    const body = mt(320, 58, 'f(x) = 2x + 1', { size: 40 })
      + machine(320, 150, 190, 96, '')
      + g('h2', mt(320, 163, '2x + 1', { size: 36 }))
      + g('b2', mt(320, 163, '2 × {#blue|3} + 1', { size: 34 }), .6)
      + travel(2, .1, [90, 150], M, [550, 150], '3', '7', [C.blue, C.sky], [C.orange, C.peach])
      + lab(90, 106, 'x', { size: 24, c: C.blue }) + g('s2', tileR(90, 150, '3', C.blue, C.sky), 0) + g('s2', mt(550, 106, 'f(x)', { size: 26, color: C.orange }), .9)
      + g('s3', mt(250, 290, 'f({#blue|3}) = {#orange|7}', { size: 46 }), .1)
      + ring([302, 274], 30, C.orange, 'r3', .4)
      + pill(470, 278, '함숫값', C.green, { size: 28, cls: 'p3', d: .9, fill: C.mint })
      + g('s3', arrow(420, 278, 342, 278, C.green, '', 3), .9);
    put(KEY + '함숫값', svg(id, body, motion(id) + goCss(id)));
  }

  // 일차함수: y = ax + b(a ≠ 0) 꼴의 y = 2x + 1 → 표의 순서쌍을 점으로 → 점들이 한 직선 위에
  {
    const id = 't81-m5-ilcha';
    const G = plane({ ox: 440, oy: 248, u: 30, x0: -2, x1: 4, y0: -2, y1: 6, size: 18, skipX: [-1], skipY: [-1, 1] });
    const pts = [[-1, -1], [0, 1], [1, 3], [2, 5]];
    const T = [100, 160, 220, 280];
    const body = mt(160, 60, 'y = {#orange|a}x + {#blue|b}', { size: 36 }) + lab(160, 96, '(a ≠ 0)', { size: 20, c: C.muted })
      + g('s1', mt(160, 150, 'y = {#orange|2}x + {#blue|1}', { size: 36 }), .4)
      + g('s1', lab(122, 186, 'a = 2', { size: 20, c: C.orange }) + lab(206, 186, 'b = 1', { size: 20, c: C.blue }), .9)
      + g('s2', G.all, 0)
      + g('s2', `<rect x="34" y="214" width="300" height="96" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/><path d="M74 214 V310 M34 262 H334" stroke="${C.line}" stroke-width="2.5"/>`
        + mt(54, 248, 'x', { size: 24 }) + mt(54, 296, 'y', { size: 24 }) + pts.map(([x], k) => mt(T[k], 248, x < 0 ? `-${-x}` : x, { size: 24 })).join(''), .1)
      + pts.map(([x, y], k) => g('s2', mt(T[k], 296, y < 0 ? `-${-y}` : y, { size: 24, color: C.purple }), .3 + k * .3) + dot(G.at(x, y), { r: 8, c: C.purple, cls: 'p2', d: .4 + k * .3 })).join('')
      + line(G.at(-1.5, -2), G.at(2.5, 6), { c: C.green, w: 4, cls: 'd3', d: .1 })
      + g('s3', lab(G.X(2) + 14, G.Y(4) + 8, 'y = 2x + 1', { c: C.green, size: 22, anchor: 'start' }), .8)
      + pill(184, 338, '일차함수', C.green, { size: 22, cls: 'p3', d: 1.1, fill: C.mint });
    put(KEY + '일차함수', svg(id, body, motion(id)));
  }

  // 평행이동: y = ½x 의 점들이 모두 위로 3 만큼 → 직선이 통째로 올라가 y = ½x + 3 → 모든 점을 같은 쪽으로 같은 거리만큼
  {
    const id = 't81-m5-pyeonghaeng';
    const G = plane({ ox: 200, oy: 214, u: 28, x0: -5, x1: 5, y0: -3, y1: 6, size: 18, skipX: [-4, -2, -1], skipY: [3] });
    const xs = [-4, -2, 0, 2, 4], up = 3 * 28;
    const L = (c, w, dash = '') => line(G.at(-5, -2.5), G.at(5, 2.5), { c, w, dash });
    const shape = L(C.blue, 4) + xs.map((x) => dot(G.at(x, x / 2), { r: 7, c: C.blue })).join('');
    const half = (pre, post, c, y, cls, d) => g(cls, row(490, y, [pre, { fr: ['1', '2'] }, post], { size: 32, gap: 6, color: c }).body, d);
    const body = G.all
      + `<g opacity=".4">${L(C.blue, 3, '8 6')}</g>`
      + xs.map((x, k) => g('s2', arrow(G.X(x) + 9, G.Y(x / 2) - 4, G.X(x) + 9, G.Y(x / 2) - up + 4, C.orange, '', 3), .1 + k * .1)).join('')
      + g('s2', lab(G.X(4) + 30, G.Y(3.5) + 8, '3', { c: C.orange, size: 24 }), .6)
      + `<g class="mv mv2" style="--y2:-${up}px;transition-delay:.3s">${shape}</g>`
      + g('s3', L(C.purple, 4).replace('<path', `<path transform="translate(0 -${up})"`) + xs.map((x) => dot(G.at(x, x / 2 + 3), { r: 7, c: C.purple })).join(''), .1)
      + half('y =', 'x', C.blue, 92, 's1', .3)
      + g('s2', arrow(490, 116, 490, 156, C.orange) + lab(508, 144, '+3', { c: C.orange, size: 22, anchor: 'start' }), .6)
      + half('y =', 'x + 3', C.purple, 206, 's3', .3)
      + pill(490, 290, '평행이동', C.green, { size: 28, cls: 'p3', d: 1, fill: C.mint });
    put(KEY + '평행이동', svg(id, body, motion(id)));
  }

  // x절편·y절편: 직선 y = −2x + 4 → x축(y축)과 만나는 점 → 그 점의 x좌표 2(y좌표 4)
  for (const [word, idw] of [['x절편', 'xjeol'], ['y절편', 'yjeol']]) {
    const id = `t81-m5-${idw}`;
    const isX = word === 'x절편';
    const G = plane({ ox: 140, oy: 264, u: 38, x0: -2, x1: 4, y0: -1, y1: 5, size: 18, skipX: [-1, 2], skipY: isX ? [-1, 5] : [-1, 4, 5] });
    const P = isX ? G.at(2, 0) : G.at(0, 4), c = isX ? C.orange : C.blue;
    const tickAt = isX ? [G.X(2) - 12, G.Y(0) + 26, 'middle'] : [G.X(0) - 13, G.Y(4) + 2, 'end'];
    const body = G.all + g('h3', lab(tickAt[0], tickAt[1], isX ? '2' : '4', { size: 18, anchor: tickAt[2] }))
      + line(G.at(-0.5, 5), G.at(2.5, -1), { c: C.green, w: 4, cls: 'd1', d: .1 })
      + g('s1', mt(470, 56, '{#green|y = -2x + 4}', { size: 32 }), .6)
      + dot(P, { r: 9, c, cls: 'p2', d: .2 }) + ring(P, 12, c, 'r2', .3)
      + g('s2', isX ? lab(G.X(2) + 16, G.Y(0) - 14, '(2, 0)', { c, size: 22, anchor: 'start' }) : lab(G.X(0) + 16, G.Y(4) - 12, '(0, 4)', { c, size: 22, anchor: 'start' }), .6)
      + g('p3', lab(tickAt[0], tickAt[1] + 1, isX ? '2' : '4', { c, size: 24, anchor: tickAt[2] }), .2)
      + g('s3', isX ? mt(470, 126, '{#orange|y = 0} 이면', { size: 26 }) + mt(470, 174, '0 = -2x + 4', { size: 28 }) + mt(470, 222, 'x = {#orange|2}', { size: 32 })
        : mt(470, 126, '{#blue|x = 0} 이면', { size: 26 }) + mt(470, 174, 'y = -2 × 0 + 4', { size: 28 }) + mt(470, 222, 'y = {#blue|4}', { size: 32 }), .4)
      + pill(470, 296, isX ? 'x절편 2' : 'y절편 4', c, { size: 28, cls: 'p3', d: 1.2, fill: isX ? C.peach : C.sky });
    put(KEY + word, svg(id, body, motion(id)));
  }

  // 기울기: y = 2/3 x + 1 → (0, 1) 에서 오른쪽 3, 위로 2 → 또 오른쪽 3, 위로 2 → 기울기 = 오른 만큼 / 간 만큼 = 2/3
  {
    const id = 't81-m5-giulgi';
    const G = plane({ ox: 310, oy: 290, u: 38, x0: -1, x1: 7, y0: -1, y1: 6, size: 18, skipY: [1] });
    const step = (x, y, cls) => line(G.at(x, y), G.at(x + 3, y), { c: C.blue, w: 6, cls, d: .1 }) + line(G.at(x + 3, y), G.at(x + 3, y + 2), { c: C.orange, w: 6, cls, d: .7 })
      + g(cls.replace('d', 's'), lab(G.X(x + 1.5), G.Y(y) + 28, '3', { c: C.blue, size: 24 }), .6) + g(cls.replace('d', 's'), lab(G.X(x + 3) + 18, G.Y(y + 1) + 8, '2', { c: C.orange, size: 24 }), 1.2);
    const F = row(140, 66, ['y =', { fr: ['2', '3'] }, 'x + 1'], { size: 34, gap: 8 });
    const body = G.all + F.body
      + line(G.at(-1.5, 0), G.at(7, 5.67), { c: C.green, w: 4, cls: 'd1', d: .1 })
      + dot(G.at(0, 1), { r: 7, c: C.green, cls: 's1', d: .1 }) + dot(G.at(3, 3), { r: 7, c: C.green, cls: 's1', d: .3 }) + dot(G.at(6, 5), { r: 7, c: C.green, cls: 's1', d: .5 })
      + step(0, 1, 'd2') + step(3, 3, 'd3')
      + g('s4', fr(130, 210, '{#orange|오른 만큼}', '{#blue|간 만큼}', { size: 26 }) + mt(214, 220, '=', { size: 32 }) + fr(250, 210, '{#orange|2}', '{#blue|3}', { size: 32 }), .1)
      + g('s4', lab(130, 150, '기울기', { c: C.green, size: 26 }), .1)
      + ring([F.xs[1], 56], 30, C.green, 'r4', .3);
    put(KEY + '기울기', svg(id, body, motion(id)));
  }

  // 직선의 방정식: x − 2y + 4 = 0 → 해 (−4, 0), (−2, 1), (0, 2), (2, 3), (4, 4) 를 점으로 → x 가 수 전체이면 점이 이어져 직선
  {
    const id = 't81-m5-jikseon';
    const G = plane({ ox: 320, oy: 290, u: 34, x0: -5, x1: 5, y0: -1, y1: 4, size: 18, skipX: [-4, -1], skipY: [-1, 2] });
    const odd = [-3, -1, 1, 3], even = [-4, -2, 0, 2, 4];
    const body = mt(200, 62, 'x - 2y + 4 = 0', { size: 40 }) + g('s2', G.all, 0)
      + g('s1', lab(200, 102, '(−4, 0)  (0, 2)  (4, 4) …', { size: 22, c: C.purple }), .3)
      + even.map((x, k) => dot(G.at(x, x / 2 + 2), { r: 8, c: C.purple, cls: 'p2', d: .3 + k * .2 })).join('')
      + odd.map((x, k) => dot(G.at(x, x / 2 + 2), { r: 6, c: C.purple, cls: 'p3', d: .1 + k * .12 })).join('')
      + line(G.at(-4.8, -0.1), G.at(5, 4.5), { c: C.green, w: 4, cls: 'd3', d: .7 })
      + pill(520, 62, '직선의 방정식', C.green, { size: 24, cls: 'p3', d: 1.3, fill: C.mint });
    put(KEY + '직선의 방정식', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
