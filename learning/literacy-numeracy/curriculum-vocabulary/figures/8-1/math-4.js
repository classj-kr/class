// 수학 8-1 4단원 연립일차방정식: 낱말 도식(공용 도구는 math-1.js 의 root.CVMath8)
(function (root) {
  'use strict';
  const { C, svg, put, f, g, motion, lab, mt, wid, row, pill, card, brace, line, pathD, dot, ring, arrow, plane } = root.CVMath8;
  const KEY = '8-1/수학/4/';
  // 왼쪽 묶음 괄호 {
  const curly = (x, y0, y1, color = C.ink) => {
    const m = (y0 + y1) / 2;
    return `<path d="M${x + 12} ${y0} Q${x} ${y0} ${x} ${y0 + 14} V${m - 10} Q${x} ${m} ${x - 10} ${m} Q${x} ${m} ${x} ${m + 10} V${y1 - 14} Q${x} ${y1} ${x + 12} ${y1}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const strike = (x, y, w, cls, d) => g(cls, `<path d="M${f(x - w / 2 - 4)} ${f(y - 4)} L${f(x + w / 2 + 4)} ${f(y - 22)}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`, d);
  // 가로셈 줄: 칸 x 자리에 하나씩
  const cols = (xs, y, items, size = 36) => items.map((s, k) => (s ? mt(xs[k], y, s, { size }) : '')).join('');

  // 미지수가 2개인 일차방정식: 2x + y = 9 (x, y 둘, 차수 1) → x = 1, 2, 3, 4 일 때 y = 7, 5, 3, 1 → 해 (1, 7) …
  {
    const id = 't81-m4-mijisu';
    const E = row(320, 70, ['2{#blue|x}', '+', '{#orange|y}', '=', '9'], { size: 46, gap: 14 });
    const xs = [250, 330, 410, 490], ys = [7, 5, 3, 1];
    const tbl = `<rect x="130" y="130" width="400" height="104" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/>`
      + `<path d="M210 130 V234 M130 182 H530" stroke="${C.line}" stroke-width="2.5"/>`
      + mt(170, 168, 'x', { size: 30, color: C.blue }) + mt(170, 220, 'y', { size: 30, color: C.orange })
      + xs.map((x, k) => mt(x, 168, String(k + 1), { size: 30 })).join('');
    const body = E.body
      + ring([E.xs[0] + 12, 56], 26, C.blue, 'r1', .2) + ring([E.xs[2], 56], 26, C.orange, 'r1', .4)
      + g('s1', lab(E.xs[0] + 12, 112, '차수 1', { c: C.blue, size: 20 }) + lab(E.xs[2], 112, '차수 1', { c: C.orange, size: 20 }), .6)
      + g('b2', tbl) + xs.map((x, k) => g('p2', mt(x, 220, String(ys[k]), { size: 30, color: C.orange }), .3 + k * .3)).join('')
      + xs.map((x, k) => g('p3', pill(140 + k * 120, 286, `(${k + 1}, ${ys[k]})`, C.green, { size: 22, fill: C.mint }), .1 + k * .25)).join('')
      + pill(320, 336, '미지수가 2개인 일차방정식', C.green, { size: 20, cls: 'p3', d: 1.3, fill: 'white' });
    put(KEY + '미지수가 2개인 일차방정식', svg(id, body, motion(id)));
  }

  // 연립방정식: { x + y = 5, x − y = 1 } → 두 식의 자연수 해를 점으로 → 두 직선이 (3, 2) 에서 만남
  {
    const id = 't81-m4-yeonrip';
    const G = plane({ ox: 362, oy: 300, u: 38, x0: 0, x1: 6, y0: 0, y1: 6, size: 18 });
    const A = [[1, 4], [2, 3], [3, 2], [4, 1]], B = [[2, 1], [3, 2], [4, 3], [5, 4]];
    const pairs = (L, y, c, s = 0) => L.map(([x, yy], k) => lab(52 + (k + s) * 64, y, `(${x}, ${yy})`, { c, size: 20 })).join('');
    const body = curly(60, 44, 136) + mt(170, 78, '{#blue|x + y = 5}', { size: 34 }) + mt(170, 128, '{#orange|x - y = 1}', { size: 34 })
      + g('s2', G.all, 0)
      + g('s2', pairs(A, 186, C.blue), .1) + g('s2', pairs(B, 226, C.orange, 1), .5)
      + A.map(([x, y], k) => dot(G.at(x, y), { r: 8, c: C.blue, cls: 'p2', d: .2 + k * .15 })).join('')
      + B.filter(([x]) => x !== 3).map(([x, y], k) => dot(G.at(x, y), { r: 8, c: C.orange, cls: 'p2', d: .7 + k * .15 })).join('')
      + g('s2', `<rect x="${52 + 2 * 64 - 32}" y="166" width="64" height="70" rx="10" fill="none" stroke="${C.green}" stroke-width="3"/>`, 1.3)
      + line(G.at(0, 5), G.at(5.4, -0.4), { c: C.blue, w: 4, cls: 'd3', d: .1 }) + line(G.at(1, 0), G.at(6, 5), { c: C.orange, w: 4, cls: 'd3', d: .4 })
      + dot(G.at(3, 2), { r: 10, c: C.green, cls: 'p3', d: 1 })
      + g('s3', lab(G.X(3) + 24, G.Y(2) + 8, '(3, 2)', { c: C.green, size: 22, anchor: 'start' }), 1.1)
      + pill(170, 296, '연립방정식', C.green, { size: 26, cls: 'p3', d: 1.3, fill: C.mint });
    put(KEY + '연립방정식', svg(id, body, motion(id)));
  }

  // 대입법: y = x + 1 을 2x + y = 7 의 y 자리에 넣음 → 2x + (x + 1) = 7 → 3x + 1 = 7, x = 2, y = 3
  {
    const id = 't81-m4-daeip';
    const R1 = row(110, 66, ['y', '=', '{#orange|x + 1}'], { size: 36, anchor: 'start', gap: 18 });
    const R2 = row(110, 126, ['2x', '+', '{#blue|y}', '=', '7'], { size: 36, anchor: 'start', gap: 18 });
    const R3 = row(110, 200, ['2x', '+', '{#orange|(x + 1)}', '=', '7'], { size: 36, anchor: 'start', gap: 12 });
    const box = (R, i, y, color, cls, d) => g(cls, `<rect x="${f(R.xs[i] - R.ws[i] / 2 - 5)}" y="${y - 34}" width="${f(R.ws[i] + 10)}" height="46" rx="10" fill="none" stroke="${color}" stroke-width="3"/>`, d);
    const body = curly(84, 34, 140) + R1.body + R2.body
      + box(R1, 2, 66, C.orange, 's1', .3) + box(R2, 2, 126, C.blue, 's1', .7)
      + g('s2', [0, 1, 3, 4].map((i) => mt(R3.xs[i], 200, ['2x', '+', '', '=', '7'][i], { size: 36 })).join(''), .1)
      + g('f2', mt(R3.xs[2], 200, '{#orange|(x + 1)}', { size: 36 }), .3, `--dx:${f(R1.xs[2] - R3.xs[2])}px;--dy:-134px`)
      + strike(R2.xs[2], 126, 20, 's2', 1.1)
      + g('s3', mt(110, 262, '3x + 1 = 7', { size: 34, anchor: 'start' }), .1)
      + g('s3', mt(110, 322, '{#green|x = 2}', { size: 34, anchor: 'start' }), .5)
      + g('s3', mt(290, 322, '{#green|y = 2 + 1 = 3}', { size: 34, anchor: 'start' }), .9)
      + pill(520, 92, '대입법', C.green, { size: 28, cls: 'p3', d: 1.3, fill: C.mint });
    put(KEY + '대입법', svg(id, body, motion(id)));
  }

  // 가감법: x + y = 5 와 x − y = 1 을 세로로 더하면 y 가 없어져 2x = 6 → x = 3, y = 2
  {
    const id = 't81-m4-gagam';
    const X = [200, 250, 300, 355, 405];
    const body = cols(X, 80, ['x', '+', '{#orange|y}', '=', '5']) + cols(X, 140, ['x', '-', '{#orange|y}', '=', '1'])
      + ring([X[2], 66], 30, C.orange, 'r1', .3)
      + g('s2', mt(146, 140, '+', { size: 40, color: C.blue }), .1)
      + line([130, 164], [440, 164], { w: 4, cls: 'd2', d: .2 })
      + strike(X[2], 80, 20, 's2', .7) + strike(X[2], 140, 20, 's2', .9)
      + g('s2', cols([200, 250, 300, 355, 405], 214, ['2x', '', '', '=', '6']), 1.2)
      + g('s2', lab(X[2], 210, '0', { c: C.red, size: 26 }), 1.1)
      + g('s3', mt(250, 272, '{#green|x = 3}', { size: 34 }), .1)
      + g('s3', mt(250, 326, '3 + y = 5,  {#green|y = 2}', { size: 32 }), .6)
      + pill(530, 140, '가감법', C.green, { size: 28, cls: 'p3', d: 1.2, fill: C.mint });
    put(KEY + '가감법', svg(id, body, motion(id)));
  }

  // 소거: 3x + 2y = 12, x + 2y = 8 의 2y 가 같음 → 빼면 2y 가 지워져 2x = 4(y 가 사라짐) → x = 2
  {
    const id = 't81-m4-sogeo';
    const X = [190, 240, 296, 360, 420];
    const yb = (y, cls, d) => g(cls, `<rect x="${X[2] - 30}" y="${y - 34}" width="60" height="46" rx="10" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`, d);
    const body = yb(80, 's1', .3) + yb(140, 's1', .6)
      + g('x2', mt(X[2], 80, '2y', { size: 36 }) + mt(X[2], 140, '2y', { size: 36 }), .8)
      + cols(X, 80, ['3x', '+', '', '=', '12']) + cols(X, 140, ['x', '+', '', '=', '8'])
      + g('s2', mt(136, 140, '-', { size: 44, color: C.blue }), .1)
      + line([120, 164], [460, 164], { w: 4, cls: 'd2', d: .2 })
      + strike(X[2], 80, 46, 's2', .6) + strike(X[2], 140, 46, 's2', .8)
      + g('s2', cols(X, 214, ['2x', '', '', '=', '4']), 1.2)
      + g('p2', pill(X[2], 258, 'y 소거', C.red, { size: 22, fill: C.peach }), 1.3)
      + g('s3', mt(240, 322, '{#green|x = 2}', { size: 36 }), .2)
      + pill(540, 140, '소거', C.green, { size: 30, cls: 'p3', d: .8, fill: C.mint });
    put(KEY + '소거', svg(id, body, motion(id)));
  }

  // 상수: y = 3x + 2 에서 x 가 1, 2, 3 이면 y 는 5, 8, 11 → 3 과 2 는 어느 줄에서나 그대로 → y = ax + b 의 a, b 도 정해진 값
  {
    const id = 't81-m4-sangsu';
    const E = row(160, 86, ['{#blue|y}', '=', '3', '{#blue|x}', '+', '2'], { size: 44, gap: 7 });
    const lines = [[1, 5], [2, 8], [3, 11]].map(([x, y], k) => {
      const yy = 172 + k * 56;
      const R = row(70, yy, ['3', '*', `{#blue|${x}}`, '+', '2', '=', `{#blue|${y}}`], { size: 34, gap: 10, anchor: 'start' });
      return { yy, R, body: g('s1', R.body, .2 + k * .45) };
    });
    const body = E.body + g('s1', lab(E.xs[0], 126, '바뀜', { c: C.blue, size: 20 }) + lab(E.xs[3] + 6, 126, '바뀜', { c: C.blue, size: 20 }), .1)
      + lines.map((L) => L.body).join('')
      + g('s2', `<rect x="${f(E.xs[2] - 20)}" y="46" width="40" height="52" rx="8" fill="none" stroke="${C.orange}" stroke-width="3.5"/><rect x="${f(E.xs[5] - 20)}" y="46" width="40" height="52" rx="8" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`, .1)
      + lines.map((L, k) => g('s2', mt(L.R.xs[0], L.yy, '3', { size: 34, color: C.orange }) + mt(L.R.xs[4], L.yy, '2', { size: 34, color: C.orange }), .4 + k * .3)).join('')
      + g('s2', lab(E.xs[2], 34, '그대로', { c: C.orange, size: 20 }) + lab(E.xs[5], 34, '그대로', { c: C.orange, size: 20 }), 1.3)
      + g('s3', `<path d="M402 60 V300" stroke="${C.line}" stroke-width="3"/>` + mt(516, 130, '{#blue|y} = {#orange|a}{#blue|x} + {#orange|b}', { size: 38 }), .1)
      + g('s3', lab(516, 178, 'a, b는 정해진 값', { c: C.orange, size: 20 }), .5)
      + pill(516, 250, '상수', C.green, { size: 30, cls: 'p3', d: 1, fill: C.mint });
    put(KEY + '상수', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
