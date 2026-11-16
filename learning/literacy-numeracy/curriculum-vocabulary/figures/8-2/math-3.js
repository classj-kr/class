// 수학 8-2 8단원 경우의 수와 확률: 낱말 도식(공용 도구는 math-1.js 의 root.CVMath8)
(function (root) {
  'use strict';
  const { C, svg, put, f, g, motion, lab, mt, fr, pill, card, line, pathD, dot, ring, arrow } = root.CVMath8;
  const KEY = '8-2/수학/8/';
  // 주사위 눈: 가운데 cx, cy, 한 변 s
  const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  const face = (cx, cy, s, n, { fill = 'white', stroke = C.ink, pip = C.ink } = {}) => `<rect x="${f(cx - s / 2)}" y="${f(cy - s / 2)}" width="${s}" height="${s}" rx="${f(s * .18)}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
    + PIPS[n].map(([i, j]) => `<circle cx="${f(cx + i * s * .27)}" cy="${f(cy + j * s * .27)}" r="${f(s * .085)}" fill="${n === 1 ? C.red : pip}"/>`).join('');
  const box = (cx, cy, s, color, cls, d) => g(cls, `<rect x="${f(cx - s / 2 - 7)}" y="${f(cy - s / 2 - 7)}" width="${s + 14}" height="${s + 14}" rx="14" fill="none" stroke="${color}" stroke-width="4"/>`, d);

  // 사건: 주사위를 던짐(실험) → 나올 수 있는 결과 1~6 → '짝수의 눈이 나온다'(2, 4, 6) 도 사건
  {
    const id = 't82-m8-sageon';
    const X = [120, 200, 280, 360, 440, 520], Y = 250;
    const body = `<g class="roll">${face(320, 104, 84, 4)}</g>`
      + g('s1', lab(320, 186, '4', { c: C.orange, size: 26 }), 1.3) + g('s1', lab(150, 112, '던지기', { c: C.muted, size: 22 }), .1)
      + X.map((x, k) => g('p2', face(x, Y, 58, k + 1), .1 + k * .18)).join('')
      + [1, 3, 5].map((k, i) => box(X[k], Y, 58, C.orange, 'p3', .1 + i * .25)).join('')
      + g('s3', lab(X[3], 318, '짝수의 눈', { c: C.orange, size: 24 }), .8)
      + pill(560, 104, '사건', C.green, { size: 30, cls: 'p3', d: 1.2, fill: C.mint });
    put(KEY + '사건', svg(id, body, motion(id) + `
      .sc-${id} .roll { transform-box: fill-box; transform-origin: center; opacity: 0; }
      .on1 .sc-${id} .roll { animation: ${id}-roll 1.2s cubic-bezier(.3,.7,.4,1) .1s both; }
      @keyframes ${id}-roll { 0% { opacity: 1; transform: translate(-230px, -30px) rotate(-540deg); } 60% { transform: translate(-40px, 6px) rotate(-60deg); } 100% { opacity: 1; transform: none; } }`));
  }

  // 경우의 수: 동전 두 개 → 첫째 동전 앞·뒤 가지 → 둘째 동전 앞·뒤 가지 → 끝 4가지(경우의 수 4) → 앞면이 1개인 경우 2가지
  {
    const id = 't82-m8-gyeongu';
    const R = [52, 180], N1 = [[190, 100], [190, 262]], N2 = [[340, 64], [340, 146], [340, 224], [340, 306]];
    const node = (p, s) => `<circle cx="${p[0]}" cy="${p[1]}" r="25" fill="${s === '앞' ? C.peach : C.sky}" stroke="${s === '앞' ? C.orange : C.blue}" stroke-width="3"/>` + lab(p[0], p[1] + 8, s, { size: 22 });
    const res = ['앞앞', '앞뒤', '뒤앞', '뒤뒤'];
    const body = dot(R, { r: 9 })
      + g('s1', lab(190, 30, '동전 1', { c: C.muted, size: 20 }), .1) + g('s2', lab(340, 26, '동전 2', { c: C.muted, size: 20 }), .1)
      + N1.map((p, k) => line(R, [p[0] - 25, p[1]], { c: C.muted, w: 3, cls: 'd1', d: .2 + k * .3 }) + g('p1', node(p, k ? '뒤' : '앞'), .6 + k * .3)).join('')
      + N2.map((p, k) => line([N1[k >> 1][0] + 25, N1[k >> 1][1]], [p[0] - 25, p[1]], { c: C.muted, w: 3, cls: 'd2', d: .1 + k * .2 }) + g('p2', node(p, k % 2 ? '뒤' : '앞'), .5 + k * .2)).join('')
      + N2.map((p, k) => g('s3', lab(420, p[1] + 8, res[k], { size: 24 }) + `<circle cx="474" cy="${p[1]}" r="15" fill="${C.green}"/>` + lab(474, p[1] + 7, k + 1, { c: 'white', size: 19 }), .1 + k * .25)).join('')
      + pill(570, 150, '경우의 수', C.green, { size: 22, cls: 'p3', d: 1.2, fill: C.mint }) + g('s3', lab(570, 208, '4', { c: C.green, size: 36 }), 1.3)
      + [1, 2].map((k) => g('p4', `<rect x="${388}" y="${N2[k][1] - 24}" width="110" height="48" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/>`, .1 + (k - 1) * .3)).join('')
      + g('s4', lab(570, 266, '앞면 1개', { c: C.orange, size: 22 }) + lab(570, 304, '2', { c: C.orange, size: 34 }), .7);
    put(KEY + '경우의 수', svg(id, body, motion(id)));
  }

  // 확률: 모든 경우 6가지(눈 1~6) → 3의 배수 3, 6 은 2가지 → 확률 = 2/6 = 1/3 → 많이 던질수록 상대도수가 1/3 에 가까워짐
  {
    const id = 't82-m8-hwangnyul';
    const X = [90, 162, 234, 306, 378, 450], Y = 70;
    const ax = 372, ay = 316, vy = (v) => ay - v * 270;
    const pts = [[402, .5], [438, .2], [474, .4], [510, .28], [546, .36], [582, .32], [610, .335]];
    const body = X.map((x, k) => g('p1', face(x, Y, 54, k + 1), .1 + k * .15)).join('')
      + g('s1', lab(560, 80, '모두 6가지', { size: 22 }), 1.1)
      + [2, 5].map((k, i) => box(X[k], Y, 54, C.orange, 'p2', .1 + i * .3)).join('')
      + g('s2', lab(342, 134, '3의 배수 2가지', { c: C.orange, size: 22 }), .7)
      + g('s3', lab(70, 232, '확률', { size: 28 }) + mt(124, 240, '=', { size: 32 }) + fr(176, 230, '{#orange|2}', '6', { size: 40 }) + mt(228, 240, '=', { size: 32 }) + fr(276, 230, '1', '3', { size: 40, color: C.green }), .1)
      + g('s3', lab(176, 176, '3의 배수', { c: C.orange, size: 18 }) + lab(176, 312, '모든 경우', { c: C.muted, size: 18 }), .6)
      + g('b4', `<path d="M${ax} ${ay} H620 M${ax} ${ay} V172" stroke="${C.ink}" stroke-width="3" fill="none"/>`
        + `<path d="M${ax} ${f(vy(1 / 3))} H620" stroke="${C.green}" stroke-width="3" stroke-dasharray="8 6"/>` + fr(352, f(vy(1 / 3)), '1', '3', { size: 20, color: C.green })
        + lab(ax + 10, 170, '상대도수', { size: 18, c: C.muted, anchor: 'start' }) + lab(618, 344, '던진 횟수', { size: 18, c: C.muted, anchor: 'end' }))
      + pathD(`M${pts.map(([x, v]) => `${x} ${f(vy(v))}`).join(' L')}`, { c: C.purple, w: 3, cls: 'd4', d: .3 })
      + pts.map(([x, v], k) => dot([x, vy(v)], { r: 6, c: C.purple, cls: 'p4', d: .3 + k * .12 })).join('')
      + ring([610, vy(.335)], 12, C.green, 'r4', .3);
    put(KEY + '확률', svg(id, body, motion(id).replace(new RegExp(`\\.sc-${id} \\.draw \\{[^}]*\\}`), `.sc-${id} .draw { stroke-dasharray: 1 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.1s ease-in-out; }`)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
