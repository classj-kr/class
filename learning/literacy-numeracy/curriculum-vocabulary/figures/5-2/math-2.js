// 수학 5-2 2단원 분수의 곱셈: 낱말 도식(분수의 종류와 약분)
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +n.toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;${more}"`;

  const motion = (id) => `
    .sc-${id} .pop { transform-box: fill-box; transform-origin: center; }
    .on1 .sc-${id} .s1, .on2 .sc-${id} .s2, .on3 .sc-${id} .s3 { animation: ${id}-fin .4s ease-out both; }
    .on1 .sc-${id} .pop1, .on2 .sc-${id} .pop2, .on3 .sc-${id} .pop3 { animation: ${id}-pop .5s ease-out both; }
    .on2 .sc-${id} .in2, .on3 .sc-${id} .in3 { animation: ${id}-in .6s ease-out both; }
    .on1 .sc-${id} .fly { animation: ${id}-fly .6s ease-in-out both; }
    .sc-${id} .h2, .sc-${id} .h3 { transition: opacity .45s ease; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .8s ease-in-out; }
    .on2 .sc-${id} .draw2, .on3 .sc-${id} .draw3 { stroke-dashoffset: 0; }
    .sc-${id} .dg { transition: fill .4s ease; }
    .on3 .sc-${id} .dg3 { fill: ${C.orange}; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
    @keyframes ${id}-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }
  `;

  // 세로 분수: 가운데 가로줄의 높이가 cy
  function frac(x, cy, n, d, { size = 32, color = C.ink, nc = color, dc = color, ncls = '', dcls = '' } = {}) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.58 + 12;
    return `<text class="${ncls}" x="${f(x)}" y="${f(cy - size * 0.24)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${nc}">${n}</text>`
      + `<path d="M${f(x - w / 2)} ${cy} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + `<text class="${dcls}" x="${f(x)}" y="${f(cy + size * 0.98)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${dc}">${d}</text>`;
  }
  // 원을 n 조각으로 나눈 k 번째 조각(12시부터 시계 방향)
  const pt = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
  function sector(cx, cy, r, n, k) {
    if (n === 1) return `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} Z`;
    const a0 = -90 + 360 * k / n, a1 = a0 + 360 / n;
    const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
    return `M${cx} ${cy} L${f(x0)} ${f(y0)} A${r} ${r} 0 ${360 / n > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)} Z`;
  }
  const sectorCentroid = (cx, cy, r, n, k) => pt(cx, cy, r * 0.55, -90 + 360 * (k + 0.5) / n);
  // 원 테두리와 나눔선(칠한 조각 위에 덮어 그린다)
  function pieLines(cx, cy, r, n) {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    for (let k = 0; k < n; k++) {
      const [x, y] = pt(cx, cy, r, -90 + 360 * k / n);
      s += `<path d="M${cx} ${cy} L${f(x)} ${f(y)}" stroke="${C.ink}" stroke-width="2.5"/>`;
    }
    return s;
  }
  const pieBase = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>`;
  const piece = (cx, cy, r, n, k, { fill = C.orange, cls = '', d = 0, style = '' } = {}) =>
    `<path class="${cls}" ${cls ? delay(d, style) : ''} d="${sector(cx, cy, r, n, k)}" fill="${fill}" stroke="${fill}" stroke-width="1" stroke-linejoin="round"/>`;
  // 막대를 n 칸으로 나눈 그림
  function bar(x, y, w, h, n, colored, { fill = C.orange, seq = '', from = 0, d0 = .2, step = .35, sw = 2.5 } = {}) {
    const cw = w / n;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white"/>`;
    for (let k = 0; k < colored; k++) {
      const animated = seq && k >= from;
      s += `<rect class="${animated ? seq : ''}" ${animated ? delay(d0 + (k - from) * step) : ''} x="${f(x + k * cw)}" y="${y}" width="${f(cw)}" height="${h}" fill="${fill}"/>`;
    }
    for (let k = 1; k < n; k++) s += `<path d="M${f(x + k * cw)} ${y} V${y + h}" stroke="${C.ink}" stroke-width="${sw}"/>`;
    return s + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  }

  // 진분수: 4분의 3
  (function () {
    const id = 'm2-jin', r = 88, A = [150, 165], B = [360, 165];
    const body = `<g class="b1">${pieBase(...A, r)}${[0, 1, 2].map((k) => piece(...A, r, 4, k, { cls: 's1', d: .2 + k * .4 })).join('')}${pieLines(...A, r, 4)}</g>`
      + `<g class="b2"><path class="pulse" d="${sector(...A, r - 6, 4, 3)}" fill="none" stroke="${C.blue}" stroke-width="4" stroke-dasharray="8 6"/>`
      + `<g class="in2">${pieBase(...B, r)}${[0, 1, 2, 3].map((k) => piece(...B, r, 4, k, { fill: C.blue })).join('')}${pieLines(...B, r, 4)}${text(B[0], 300, '1', { size: 30 })}</g></g>`
      + `<g class="b3">${frac(535, 140, 3, 4, { size: 44, nc: C.orange, dc: C.blue })}`
      + `<text x="535" y="270" text-anchor="middle" font-size="34" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">3</tspan> &lt; <tspan fill="${C.blue}">4</tspan></text></g>`;
    put('5-2/수학/2/진분수', svg(id, body, motion(id) + `
      .on2 .sc-${id} .pulse { animation: ${id}-pulse 1s ease-in-out .5s 2 both; }
      @keyframes ${id}-pulse { 50% { stroke-width: 8; } }`));
  })();

  // 가분수: 4분의 1 조각 5개
  (function () {
    const id = 'm2-ga', r = 75, A = [130, 135], B = [330, 135], start = [560, 140];
    const slots = [[A, 0], [A, 1], [A, 2], [A, 3], [B, 0]];
    const flying = slots.map(([c, k], i) => {
      const [gx, gy] = sectorCentroid(...c, r, 4, k);
      return piece(...c, r, 4, k, { cls: 'fly', d: .2 + i * .3, style: `--dx:${f(start[0] - gx)}px;--dy:${f(start[1] - gy)}px` });
    }).join('');
    const body = `${pieBase(...A, r)}${pieBase(...B, r)}<g class="b1">${flying}</g>${pieLines(...A, r, 4)}${pieLines(...B, r, 4)}`
      + `<g class="b2">${frac(540, 100, 5, 4, { size: 44, nc: C.orange, dc: C.blue })}`
      + `<text x="540" y="200" text-anchor="middle" font-size="32" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">5</tspan> &gt; <tspan fill="${C.blue}">4</tspan></text></g>`
      + `<g class="b3"><g class="in3">${pieBase(360, 292, 34)}${[0, 1, 2, 3].map((k) => piece(360, 292, 34, 4, k)).join('')}${pieLines(360, 292, 34, 4)}`
      + `${frac(435, 286, 4, 4, { size: 30, nc: C.orange, dc: C.blue })}`
      + `<text x="540" y="300" text-anchor="middle" font-size="32" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">4</tspan> = <tspan fill="${C.blue}">4</tspan></text></g></g>`;
    put('5-2/수학/2/가분수', svg(id, body, motion(id)));
  })();

  // 대분수: 1과 3분의 2
  (function () {
    const id = 'm2-dae', r = 66, A = [200, 104], B = [440, 104];
    const slice = (cx, ay, rr) => {
      const [x0, y0] = pt(cx, ay, rr, -150), [x1, y1] = pt(cx, ay, rr, -30);
      return `M${cx} ${ay} L${f(x0)} ${f(y0)} A${rr} ${rr} 0 0 1 ${f(x1)} ${f(y1)} Z`;
    };
    const slices = [144, 232, 320, 408, 496].map((cx, i) =>
      `<g class="s3" ${delay(.2 + i * .3)}><path d="${slice(cx, 330, 46)}" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>${text(cx, 310, i + 1, { size: 17, color: 'white' })}</g>`).join('');
    const body = `${pieBase(...A, r)}${pieBase(...B, r)}`
      + `<g class="b1">${[0, 1, 2].map((k) => piece(...A, r, 3, k)).join('')}${[0, 1].map((k) => piece(...B, r, 3, k)).join('')}</g>`
      + `${pieLines(...A, r, 3)}${pieLines(...B, r, 3)}`
      + `<g class="b2"><g class="mv mvl">${text(200, 246, '1', { size: 46 })}</g><g class="mv mvr">${frac(440, 214, 2, 3, { size: 34 })}</g></g>`
      + `<g class="b3">${text(378, 228, '=', { size: 34 })}${frac(418, 214, 5, 3, { size: 34, nc: C.orange })}${slices}</g>`;
    put('5-2/수학/2/대분수', svg(id, body, motion(id) + `
      .sc-${id} .mv { transition: transform .9s ease-in-out .7s; }
      .on2 .sc-${id} .mvl { transform: translateX(${296 - 200}px); }
      .on2 .sc-${id} .mvr { transform: translateX(${332 - 440}px); }`));
  })();

  // 단위분수: 8분의 1
  (function () {
    const id = 'm2-danwi', x = 80, y = 105, w = 480, h = 50, cw = w / 8;
    const small = [[2, 48], [3, 246], [5, 444]].map(([n, gx]) =>
      `${frac(gx + 14, 282, 1, n, { size: 22, ncls: 'dg dg3' })}${bar(gx + 36, 268, 130, 30, n, 1, { sw: 2 })}`).join('');
    const body = bar(x, y, w, h, 8, 0)
      + `<g class="b1">${bar(x, y, w, h, 8, 1, { seq: 's1', d0: .2 })}${frac(x + cw / 2, 72, 1, 8, { size: 30, ncls: 'dg dg3' })}</g>`
      + `<g class="b2">${bar(x, y, w, h, 8, 3, { seq: 's2', from: 1, d0: .2, step: .45 })}`
      + `<path class="draw draw2" pathLength="1" d="M${x} ${y + h + 12} v10 H${x + 3 * cw} v-10 M${x + 1.5 * cw} ${y + h + 22} v8" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linejoin="round"/>`
      + `<g class="s2" ${delay(1.1)}>${frac(x + 1.5 * cw, 222, 3, 8, { size: 30 })}</g></g>`
      + `<g class="b3"><g class="in3">${small}</g></g>`;
    put('5-2/수학/2/단위분수', svg(id, body, motion(id)));
  })();

  // 약분: 6분의 4 = 3분의 2
  (function () {
    const id = 'm2-yakbun', x = 110, y = 100, w = 420, h = 50;
    const groups = [0, 1, 2].map((g) => `<rect class="draw draw2" pathLength="1" x="${x + g * 140}" y="${y}" width="140" height="${h}" fill="none" stroke="${C.blue}" stroke-width="6"/>`).join('');
    const body = `<g class="b1">${bar(x, y, w, h, 6, 4, { seq: 's1', d0: .2, step: .3 })}</g>`
      + `<g class="b1 h2">${frac(320, 56, 4, 6, { size: 32 })}</g>`
      + `<g class="b2">${groups}${frac(320, 56, 2, 3, { size: 32, color: C.blue })}</g>`
      + `<g class="b3"><g class="in3">${frac(170, 252, 4, 6, { size: 32 })}${text(222, 264, '=', { size: 32 })}`
      + `${frac(308, 252, `4<tspan fill="${C.orange}">÷2</tspan>`, `6<tspan fill="${C.orange}">÷2</tspan>`, { size: 32 }).replace(/M(\S+) 252 H(\S+)"/, 'M262 252 H354"')}`
      + `${text(396, 264, '=', { size: 32 })}${frac(448, 252, 2, 3, { size: 32, color: C.blue })}</g></g>`;
    put('5-2/수학/2/약분', svg(id, body, motion(id)));
  })();

  // 기약분수: 6분의 4, 9분의 6, 3분의 2
  (function () {
    const id = 'm2-giyak', x = 130, w = 390, h = 40, end = x + w * 2 / 3;
    const rows = [[6, 4, 48], [9, 6, 142], [3, 2, 236]];
    const body = rows.map(([n, k, y], i) => `<g class="b1"><g class="s1" ${delay(i * .35)}>${bar(x, y, w, h, n, k)}${frac(70, y + 16, k, n, { size: 26 })}</g></g>`).join('')
      + `<g class="b1"><path class="s1" ${delay(1.1)} d="M${f(end)} 30 V294" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"/></g>`
      + `<g class="b2"><rect x="${x - 3}" y="${236 - 3}" width="${w + 6}" height="${h + 6}" fill="none" stroke="${C.green}" stroke-width="6"/>`
      + `<g class="try"><rect x="${f(x + w / 3)}" y="${236 - 10}" width="${f(w * 2 / 3)}" height="${h + 20}" rx="8" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="10 7"/></g></g>`
      + `<g class="b3">${text(570, 246, '공약수', { size: 18, color: C.muted })}${text(570, 290, '1', { size: 36, color: C.orange })}</g>`;
    put('5-2/수학/2/기약분수', svg(id, body, motion(id) + `
      .on2 .sc-${id} .try { animation: ${id}-shake 1.6s ease-in-out .4s both; }
      @keyframes ${id}-shake { 0% { opacity: 0; transform: none; } 12% { opacity: 1; } 25% { transform: translateX(-12px); } 40% { transform: translateX(12px); } 55% { transform: translateX(-12px); } 70% { opacity: 1; transform: translateX(10px); } 100% { opacity: 0; transform: none; } }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
