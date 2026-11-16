// 수학 8-1 3단원 일차부등식: 낱말 도식(공용 도구는 math-1.js 의 root.CVMath8)
(function (root) {
  'use strict';
  const { C, svg, put, f, g, motion, lab, mt, row, pill, card, brace, line, pathD, dot, ring, arrow, numLine } = root.CVMath8;
  const KEY = '8-1/수학/3/';

  // 부등호: 3 과 5(블록 3개·5개), 3 < 5 → 두 수가 자리를 바꾸고 기호가 뒤집혀 5 > 3 → <, >, ≤, ≥
  {
    const id = 't81-m3-budeungho';
    const stack = (x, n, fill, stroke) => Array.from({ length: n }, (_, k) => `<rect x="${x - 14}" y="${150 - (k + 1) * 25}" width="28" height="22" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`).join('');
    const num = (x, n, fill, stroke) => stack(x, n, fill, stroke) + mt(x, 216, String(n), { size: 72 });
    const syms = [['<', '작다'], ['>', '크다'], ['≤', '작거나 같다'], ['≥', '크거나 같다']];
    const body = `<g class="n3">${num(200, 3, C.sky, C.blue)}</g><g class="n5">${num(440, 5, C.peach, C.orange)}</g>`
      + `<g class="sg">${mt(320, 212, '<', { size: 76, color: C.green })}</g>`
      + ring([320, 188], 34, C.green, 'r1', .3)
      + syms.map(([s, w], k) => g('p3', `<rect x="${f(92 + k * 152 - 52)}" y="236" width="104" height="70" rx="12" fill="white" stroke="${C.green}" stroke-width="3"/>`
        + mt(92 + k * 152, 288, s, { size: 50, color: C.green }) + lab(92 + k * 152, 334, w, { size: 19, c: C.ink }), .1 + k * .3)).join('')
      + pill(560, 40, '부등호', C.green, { size: 26, cls: 'p3', d: 1.3, fill: C.mint });
    put(KEY + '부등호', svg(id, body, motion(id) + `
      .sc-${id} :is(.n5, .sg) { transition: transform 1.1s ease-in-out .3s; }
      .sc-${id} .sg { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .n3 { animation: ${id}-dip 1.5s ease-in-out .1s both; }
      .on2 .sc-${id} .n5 { transform: translateX(-240px); }
      .on2 .sc-${id} .sg { transform: scaleX(-1); }
      @keyframes ${id}-dip { 0% { transform: none; } 25% { transform: translate(0, 140px); } 75% { transform: translate(240px, 140px); } 100% { transform: translate(240px, 0); } }`));
  }

  // 부등식: 저울이 평평 2x + 1 = 7 → 왼쪽이 무거워 기울고 = 가 > 로, 2x + 1 > 7 → x − 3 ≤ 5, 4 < 9 도 부등식
  {
    const id = 't81-m3-budeungsik';
    const cx = 245, by = 132, half = 150, drop = 21;
    const pan = (x, label, fill, stroke) => `<path d="M${x} ${by} L${x - 58} ${by + 70} M${x} ${by} L${x + 58} ${by + 70}" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<path d="M${x - 72} ${by + 70} H${x + 72} Q${x + 66} ${by + 92} ${x} ${by + 92} Q${x - 66} ${by + 92} ${x - 72} ${by + 70} Z" fill="${C.line}" stroke="${C.ink}" stroke-width="3"/>`
      + `<rect x="${x - 62}" y="${by + 24}" width="124" height="44" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + mt(x, by + 57, label, { size: 30 });
    const E = row(cx, 316, ['2x + 1', '=', '7'], { size: 40, gap: 16 });
    const body = `<path d="M${cx} ${by} L${cx - 46} 252 H${cx + 46} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`
      + `<g class="beam"><path d="M${cx - half} ${by} H${cx + half}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></g>`
      + `<circle cx="${cx}" cy="${by}" r="8" fill="${C.ink}"/>`
      + `<g class="pl">${pan(cx - half, '2x + 1', C.sky, C.blue)}</g><g class="pr">${pan(cx + half, '7', C.peach, C.orange)}</g>`
      + mt(E.xs[0], 316, '2x + 1', { size: 40 }) + mt(E.xs[2], 316, '7', { size: 40 })
      + g('h2', mt(E.xs[1], 316, '=', { size: 40 })) + g('p2', mt(E.xs[1], 316, '>', { size: 42, color: C.red }), .9)
      + g('h2', g('s1', lab(cx, 52, '평평', { c: C.muted, size: 22 }), .3))
      + g('s3', `<path d="M488 60 V300" stroke="${C.line}" stroke-width="3"/>` + mt(560, 120, 'x - 3 ≤ 5', { size: 28 }), .1)
      + g('s3', mt(560, 190, '4 < 9', { size: 28 }), .4)
      + pill(560, 270, '부등식', C.green, { size: 28, cls: 'p3', d: .8, fill: C.mint })
      + ring([E.xs[1], 302], 26, C.red, 'r3', .3);
    put(KEY + '부등식', svg(id, body, motion(id) + `
      .sc-${id} :is(.beam, .pl, .pr) { transition: transform 1.1s ease-in-out .2s; }
      .sc-${id} .beam { transform-box: view-box; transform-origin: ${cx}px ${by}px; }
      .on2 .sc-${id} .beam { transform: rotate(-8deg); }
      .on2 .sc-${id} .pl { transform: translateY(${drop}px); }
      .on2 .sc-${id} .pr { transform: translateY(-${drop}px); }`));
  }

  // 부등식의 성질: 수직선의 2 < 4 → 둘 다 +3 하면 5 < 7(방향 그대로) → ×(−1) 하면 −5 > −7(자리가 뒤바뀜) → 정리
  {
    const id = 't81-m3-seongjil';
    const N = numLine(-8, 8, { y: 178, x0: 60, x1: 580, size: 18 });
    const u = N.at(1) - N.at(0);
    const pt = (v, c, x2, x3) => `<g class="mv mv2 mv3" style="--x2:${f(x2 * u)}px;--x3:${f(x3 * u)}px">${dot([N.at(v), 178], { r: 11, c })}</g>`;
    const hop = (a, b, c, up, cls, d) => {
      const xa = N.at(a), xb = N.at(b), h = up ? -1 : 1, yy = 178 + h * 18, cy = 178 + h * (30 + Math.abs(b - a) * 5);
      const ang = Math.atan2(yy - cy, xb - (xa + xb) / 2), p = (t) => `${f(xb - 12 * Math.cos(ang + t))} ${f(yy - 12 * Math.sin(ang + t))}`;
      return pathD(`M${f(xa)} ${yy} Q${f((xa + xb) / 2)} ${f(cy)} ${f(xb)} ${yy} M${p(-.5)} L${f(xb)} ${yy} L${p(.5)}`, { c, w: 3, cls, d });
    };
    const body = N.body
      + g('h2', mt(320, 72, '{#blue|2} < {#orange|4}', { size: 40 }))
      + g('b2 h3', mt(320, 72, '{#blue|2 + 3} {#green|<} {#orange|4 + 3}', { size: 38 }))
      + g('b3', mt(320, 72, '{#blue|5 × (-1)} {#red|>} {#orange|7 × (-1)}', { size: 36 }))
      + g('x3', hop(2, 5, C.blue, true, 'd2', .1) + hop(4, 7, C.orange, true, 'd2', .1)
        + g('s2', lab(N.at(3.5), 128, '+3', { c: C.blue, size: 20 }) + lab(N.at(5.5), 124, '+3', { c: C.orange, size: 20 }), .4))
      + hop(5, -5, C.blue, true, 'd3', .1) + hop(7, -7, C.orange, true, 'd3', .1)
      + pt(2, C.blue, 3, -7) + pt(4, C.orange, 3, -11)
      + g('s4', card(176, 312, 300, 60, C.green, C.mint) + mt(176, 324, '+  -  ×양수  ÷양수', { size: 24 }), .1)
      + g('s4', card(486, 312, 260, 60, C.red, C.peach) + mt(486, 324, '×음수  ÷음수', { size: 24 }), .5)
      + g('s4', lab(176, 268, '방향 그대로', { c: C.green, size: 20 }) + lab(486, 268, '방향 바뀜', { c: C.red, size: 20 }), .9);
    put(KEY + '부등식의 성질', svg(id, body, motion(id)));
  }

  // 일차부등식: 2x − 1 > 5 → 5 를 옮겨 2x − 6 > 0, (일차식) > 0 꼴 → 2x > 6, x > 3 → 수직선 ○ 와 오른쪽 → x ≥ 3 이면 ●
  {
    const id = 't81-m3-ilcha';
    const lx = 150;
    const A = row(lx, 66, ['2x', '-', '1', '>', '{#orange|5}'], { size: 36, gap: 10 });
    const B = row(lx, 136, ['2x', '-', '1', '{#orange|- 5}', '>', '0'], { size: 36, gap: 10 });
    const B2 = row(lx, 136, ['2x - 6', '>', '0'], { size: 36, gap: 12 });
    const N1 = numLine(0, 6, { y: 126, x0: 350, x1: 590, size: 19 }), N2 = numLine(0, 6, { y: 276, x0: 350, x1: 590, size: 19 });
    const ray = (N, y, cls, d) => `<path class="draw ${cls}" pathLength="1" ${`style="transition-delay:${d}s"`} d="M${N.at(3)} ${y} H${N.at(6) + 30}" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/>`
      + g(cls.replace('d', 's'), arrow(N.at(6) + 10, y, N.at(6) + 32, y, C.orange, '', 6), d + .6);
    const body = A.body
      + g('h2', g('f1', mt(B.xs[3], 136, '{#orange|- 5}', { size: 36 }), .3, `--dx:${f(A.xs[4] - B.xs[3])}px;--dy:-70px`))
      + g('h2', g('s1', mt(B.xs[0], 136, '2x', { size: 36 }) + mt(B.xs[1], 136, '-', { size: 36 }) + mt(B.xs[2], 136, '1', { size: 36 }) + mt(B.xs[4], 136, '>', { size: 36 }) + mt(B.xs[5], 136, '0', { size: 36 }), .3))
      + g('b2', B2.body)
      + g('s2', brace(B2.xs[0] - B2.ws[0] / 2, B2.xs[0] + B2.ws[0] / 2, 150, C.green) + lab(B2.xs[0], 190, '일차식', { c: C.green, size: 20 }), .3)
      + g('s2', mt(lx, 226, '2x > 6', { size: 34 }), .7) + g('s2', mt(lx, 274, 'x > {#orange|3}', { size: 36 }), 1.1)
      + g('s3', N1.body, 0) + g('s3', mt(N1.at(4.5), 76, 'x > 3', { size: 30, color: C.orange }), .9)
      + ray(N1, 126, 'd3', .3)
      + g('p3', `<circle cx="${N1.at(3)}" cy="126" r="11" fill="white" stroke="${C.orange}" stroke-width="4"/>`, .2)
      + g('s4', N2.body, 0) + g('s4', mt(N2.at(4.5), 226, 'x ≥ 3', { size: 30, color: C.orange }), .9)
      + ray(N2, 276, 'd4', .3)
      + g('p4', `<circle cx="${N2.at(3)}" cy="276" r="11" fill="${C.orange}" stroke="${C.orange}" stroke-width="4"/>`, .2)
      + pill(150, 326, '일차부등식', C.green, { size: 22, cls: 'p4', d: 1.2, fill: C.mint });
    put(KEY + '일차부등식', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
