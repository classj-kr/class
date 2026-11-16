// 수학 8-1 2단원 식의 계산: 낱말 도식(공용 도구는 math-1.js 의 root.CVMath8)
(function (root) {
  'use strict';
  const { C, svg, put, f, g, motion, lab, mt, row, pill, brace, line, pathD, ring, SERIF } = root.CVMath8;
  const KEY = '8-1/수학/2/';

  // 문자 타일: 가운데 x, y 와 한 변
  const tile = (x, y, s, stroke, fill, letter = 'a') => `<rect x="${f(x - s / 2)}" y="${f(y - s / 2)}" width="${s}" height="${s}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
    + `<text x="${f(x)}" y="${f(y + s * .2)}" text-anchor="middle" font-size="${f(s * .62)}" font-weight="700" font-family="${SERIF}" font-style="italic" fill="${C.ink}">${letter}</text>`;
  const cross = (x, y, s, cls, d) => g(cls, `<path d="M${f(x - s / 2 - 3)} ${f(y + s / 2 + 3)} L${f(x + s / 2 + 3)} ${f(y - s / 2 - 3)}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`, d);

  // 지수법칙: a²×a³ 는 a 가 2개와 3개 → 붙이면 5개, a⁵(2 + 3) → (a²)³ 은 2개씩 3묶음 a⁶(2 × 3) → a⁵ ÷ a² 은 2개를 지워 a³(5 − 2)
  {
    const id = 't81-m2-jisu';
    const S = 40, ty = 96;
    const bx = [236, 280], ox = [380, 424, 468];
    const top = g('', bx.map((x, k) => g('p1', tile(x, ty, S, C.blue, C.sky), .2 + k * .2)).join(''))
      + g('o2', mt(330, ty + 12, '*', { size: 34, color: C.muted }))
      + `<g class="mv mv2" style="--x2:-56px;transition-delay:.2s">${ox.map((x, k) => g('p1', tile(x, ty, S, C.orange, C.peach), .7 + k * .2)).join('')}</g>`
      + g('s2', brace(212, 436, 126, C.green) + mt(324, 172, '2 + 3 = 5', { size: 24, color: C.green }), 1)
      + g('s2', mt(528, ty + 14, '= a^{#green|5}', { size: 40 }), 1.2);
    // (a²)³: 2개씩 세 묶음
    const px = [[40, 76], [124, 160], [208, 244]], py = 252, s2 = 32;
    const pow = g('b3', mt(144, 214, '(a^{#blue|2})^{#purple|3}', { size: 32 }))
      + px.map((pr, k) => g('p3', `<rect x="${pr[0] - 22}" y="${py - 22}" width="80" height="44" rx="10" fill="none" stroke="${C.purple}" stroke-width="2.5" stroke-dasharray="6 5"/>` + pr.map((x) => tile(x, py, s2, C.blue, C.sky)).join(''), .1 + k * .3)).join('')
      + g('s3', brace(22, 262, 280, C.green) + mt(142, 324, '2 * 3 = 6', { size: 22, color: C.green }), 1)
      + g('s3', mt(304, py + 12, '= a^{#green|6}', { size: 30 }), 1.2);
    // a⁵ ÷ a²: 분수 꼴로 놓고 두 쌍을 지운다
    const nx = [388, 424, 460, 496, 532], dx = [442, 478], ny = 250, dy = 304;
    const div = g('b4', mt(460, 214, 'a^5 ÷ a^2', { size: 32 }) + nx.map((x) => tile(x, ny, s2, C.orange, C.peach)).join('')
      + line([366, 277], [554, 277], { w: 3 }) + dx.map((x) => tile(x, dy, s2, C.orange, C.peach)).join(''))
      + [0, 1].map((k) => cross(nx[k], ny, s2, 's4', .3 + k * .3) + cross(dx[k], dy, s2, 's4', .3 + k * .3)).join('')
      + g('s4', mt(596, 288, '= a^{#green|3}', { size: 30 }), 1)
      + g('s4', mt(460, 348, '5 - 2 = 3', { size: 22, color: C.green }), 1.1)
      + pill(560, 34, '지수법칙', C.green, { size: 24, cls: 'p4', d: 1.4, fill: C.mint });
    const body = mt(108, ty + 14, 'a^{#blue|2} × a^{#orange|3}', { size: 40 }) + top + pow + div;
    put(KEY + '지수법칙', svg(id, body, motion(id)));
  }

  // 이차식: 넓이 타일 2x² + 3x + 1 → x² 는 x × x, 차수 2 가 가장 큼 → x² − 4, −3x² + x 도 이차식
  {
    const id = 't81-m2-ichasik';
    const L = 84, w = 26;
    const sq = (x, y, k) => g('p1', `<rect x="${x}" y="${y}" width="${L}" height="${L}" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + mt(x + L / 2, y + L / 2 + 11, 'x^2', { size: 30 }), .1 + k * .25);
    const rc = (x, y, k) => g('p1', `<rect x="${x}" y="${y}" width="${w}" height="${L}" rx="4" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + mt(x + w / 2, y + L / 2 + 8, 'x', { size: 24 }), .6 + k * .2);
    const one = g('p1', `<rect x="368" y="${52 + L - w}" width="${w}" height="${w}" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + mt(381, 52 + L - 6, '1', { size: 20 }), 1.3);
    const E = row(212, 230, ['{#blue|2x^2}', '+', '{#green|3x}', '+', '{#orange|1}'], { size: 40, gap: 14 });
    const body = sq(40, 52, 0) + sq(140, 52, 1) + rc(250, 52, 0) + rc(288, 52, 1) + rc(326, 52, 2) + one
      + g('s1', E.body, 1.5)
      // 차수
      + g('s2', mt(40 + L / 2, 44, 'x', { size: 24, color: C.red }) + mt(24, 52 + L / 2 + 8, 'x', { size: 24, color: C.red }), .1)
      + g('s2', `<rect x="40" y="52" width="${L}" height="${L}" rx="4" fill="none" stroke="${C.red}" stroke-width="4"/>`, .1)
      + g('s2', lab(E.xs[0], 274, '차수 2', { c: C.red, size: 22 }), .5) + g('s2', lab(E.xs[2], 274, '차수 1', { c: C.muted, size: 20 }), .8)
      + ring([E.xs[0], 216], 30, C.red, 'r2', .3)
      + g('s3', mt(520, 104, 'x^2 - 4', { size: 36 }), .1) + g('s3', mt(520, 176, '-3x^2 + x', { size: 36 }), .4)
      + g('s3', `<path d="M432 64 V196" stroke="${C.line}" stroke-width="3"/>`, .1)
      + pill(520, 264, '이차식', C.green, { size: 28, cls: 'p3', d: .9, fill: C.mint });
    put(KEY + '이차식', svg(id, body, motion(id)));
  }

  // 전개: 세로 a, 가로 b + c 인 직사각형 → 둘로 나누면 ab, ac → a(b + c) = ab + ac (중2는 단항식과 다항식의 곱)
  {
    const id = 't81-m2-jeongae';
    const x0 = 70, y0 = 84, b = 170, c = 110, h = 170;
    const cell = (x, w, fill, label, k) => g('p2', `<rect x="${x}" y="${y0}" width="${w}" height="${h}" fill="${fill}"/>` + mt(x + w / 2, y0 + h / 2 + 11, label, { size: 34 }), .6 + k * .3);
    const F = row(475, 140, ['{#orange|a}', '(', '{#blue|b}', '+', '{#green|c}', ')'], { size: 38, gap: 8 });
    const arc = (j, hh, color, k) => pathD(`M${F.xs[0]} 104 Q${f((F.xs[0] + F.xs[j]) / 2)} ${104 - hh} ${F.xs[j]} 104`, { c: color, w: 3, cls: 'd3', d: .1 + k * .3 });
    const R = row(475, 222, ['=', 'ab', '+', 'ac'], { size: 36, gap: 12 });
    const body = `<rect x="${x0}" y="${y0}" width="${b + c}" height="${h}" fill="${C.paper}" stroke="none"/>`
      + g('h2', `<rect x="${x0}" y="${y0}" width="${b + c}" height="${h}" fill="${C.lilac}" fill-opacity=".55"/>` + mt(x0 + (b + c) / 2, y0 + h / 2 + 12, 'a(b + c)', { size: 32 }))
      + cell(x0, b, C.peach, 'ab', 0) + cell(x0 + b, c, C.mint, 'ac', 1)
      + line([x0 + b, y0], [x0 + b, y0 + h], { w: 3, cls: 'd2', d: .1 })
      + `<rect x="${x0}" y="${y0}" width="${b + c}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="4"/>`
      + mt(x0 - 24, y0 + h / 2 + 10, 'a', { size: 30, color: C.orange })
      + g('h2', mt(x0 + (b + c) / 2, y0 - 16, 'b + c', { size: 28 }))
      + g('s2', mt(x0 + b / 2, y0 - 16, 'b', { size: 30, color: C.blue }) + mt(x0 + b + c / 2, y0 - 16, 'c', { size: 30, color: C.green }), .2)
      + g('b3', F.body)
      + arc(2, 34, C.orange, 0) + arc(4, 56, C.orange, 1)
      + g('s3', R.body, .8)
      + pill(475, 304, '전개', C.green, { size: 28, cls: 'p3', d: 1.2, fill: C.mint });
    put(KEY + '전개', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
