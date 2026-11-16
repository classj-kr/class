// 수학 2-1 6단원 곱셈: 낱말 도식
// 교과서 차례: 묶어 세기 → 몇의 몇 배(2씩 4묶음은 2의 4배) → 3의 6배를 3 × 6 으로 쓰고 3 곱하기 6 으로 읽기 → 4 × 5 = 20, 4와 5의 곱은 20.
// 움직임은 transform·opacity·stroke-dashoffset 만(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);

  // 칸 움직임(N = 1~4): sN 나타나기, pN 튀어나오기, dN 선 그리기(class="dr" pathLength="100"), rN 퍼지는 고리,
  // kN 깜빡이며 남기, fN 날아오기(--dx,--dy 에서 제자리로), mN 옮겨 가 머물기(--mx,--my), gN 사라지기, xN 흐려지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.f1,.f2,.f3,.f4,.k1,.k2,.k3,.k4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .6s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .8s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4,.x1,.x2,.x3,.x4){transition:opacity .4s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.18)}100%{opacity:1;transform:none}}
    @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
    @keyframes ${id}-blink{0%{opacity:0}20%{opacity:1}40%{opacity:.2}60%{opacity:1}80%{opacity:.2}100%{opacity:1}}
    @keyframes ${id}-fly{from{opacity:1;transform:translate(var(--dx),var(--dy))}to{opacity:1;transform:none}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .4s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .45s ease-out both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0}
    .on${n} .sc-${id} .r${n}{animation:${id}-ring 1s ease-out 2 both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.2s ease-in-out both}
    .on${n} .sc-${id} .f${n}{animation:${id}-fly .7s ease-in-out both}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}
    .on${n} .sc-${id} .x${n}{opacity:.22}`;
    return css;
  };
  const G = (cls, d, inner, more = '') => `<g class="${cls}" ${dl(d, more)}>${inner}</g>`;
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${dl(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 26, anchor = 'middle') => G(cls, d, T(x, y, s, { size, color, anchor }));
  const rect = (x, y, w, h, fill, stroke, sw = 3, rx = 6) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const pill = (cx, cy, w, s, color, fill, size = 28) => rect(cx - w / 2, cy - 24, w, 48, fill, color, 3, 24) + T(cx, cy + size * .36, s, { size, color });
  const line = (d, color = C.ink, w = 3, cls = '', more = '') => `<path class="${cls}" ${more} d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const draw = (d, color, w, n, delay = 0) => `<path class="dr d${n}" pathLength="100" ${dl(delay)} d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  // 묶음 괄호(x1~x2, 모서리 y, down 이면 아래로 벌어짐)
  const brace = (x1, x2, y, color, down = true) => {
    const m = (x1 + x2) / 2, s = down ? 1 : -1;
    return `<path d="M${f(x1)} ${y} Q${f(x1)} ${y + 12 * s} ${f(x1 + 12)} ${y + 12 * s} H${f(m - 12)} Q${f(m)} ${y + 12 * s} ${f(m)} ${y + 24 * s} Q${f(m)} ${y + 12 * s} ${f(m + 12)} ${y + 12 * s} H${f(x2 - 12)} Q${f(x2)} ${y + 12 * s} ${f(x2)} ${y}" fill="none" stroke="${color}" stroke-width="3"/>`;
  };
  const reg = (key, id, body, css = '') => put(key, svg(id, body, motion(id) + css));
  const eqRow = (y, parts, size, cls, d0, step = .2) => parts.map(([x, s, color = C.ink], i) => tag(x, y, s, color, cls, d0 + i * step, size)).join('');

  // 배: 딸기 8개 → 2개씩 묶음 고리 4개, 1묶음~4묶음 → 2 막대 하나와 같은 막대 4개, 2의 4배
  (function () {
    const id = 't21-m6-bae', gw = 130, x0 = 60;
    const berry = (x, y) => `<path d="M${x - 18} ${y - 10} Q${x} ${y - 20} ${x + 18} ${y - 10} Q${x + 16} ${y + 16} ${x} ${y + 24} Q${x - 16} ${y + 16} ${x - 18} ${y - 10} Z" fill="${C.red}" stroke="${C.red}" stroke-width="2" stroke-linejoin="round"/><path d="M${x - 10} ${y - 16} L${x} ${y - 8} L${x + 10} ${y - 16} L${x} ${y - 22} Z" fill="${C.green}"/>`;
    let b = '';
    for (let g = 0; g < 4; g++) for (let k = 0; k < 2; k++) b += G('p1', .1 + (g * 2 + k) * .12, berry(x0 + g * gw + 40 + k * 50, 86));
    const loops = Array.from({ length: 4 }, (_, g) => `<rect class="dr d2" pathLength="100" ${dl(.2 + g * .35)} x="${x0 + g * gw + 8}" y="50" width="${gw - 16}" height="78" rx="34" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + tag(x0 + g * gw + gw / 2, 160, `${g + 1}묶음`, C.orange, 's2', .4 + g * .35, 22)).join('');
    const bar = (x, y, cls, d) => G(cls, d, rect(x + 4, y, gw - 8, 34, C.peach, C.orange, 3, 6) + T(x + gw / 2, y + 26, '2', { size: 24, color: C.orange }));
    const body = b + loops
      + tag(560, 220, '2씩 4묶음', C.orange, 's2', 1.8, 26)
      + bar(x0, 196, 'p3', .1) + Array.from({ length: 4 }, (_, g) => bar(x0 + g * gw, 252, 'p3', .5 + g * .2)).join('')
      + G('s3', 1.3, brace(x0 + 4, x0 + 4 * gw - 4, 292, C.purple))
      + tag(x0 + 2 * gw, 346, '2의 4배', C.purple, 'p3', 1.6, 36);
    reg('2-1/수학/6/배', id, body);
  })();

  // 곱셈: 컵 3개씩 6줄 → 줄마다 3, 6, … 18 과 3 + 3 + 3 + 3 + 3 + 3 = 18 → 3 × 6 = 18, 곱셈
  (function () {
    const id = 't21-m6-gopsem';
    const cup = (x, y) => `<path d="M${x - 15} ${y - 16} H${x + 15} L${x + 11} ${y + 16} H${x - 11} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`;
    let cups = '', totals = '';
    for (let r = 0; r < 6; r++) {
      for (let k = 0; k < 3; k++) cups += G('p1', .1 + r * .25 + k * .06, cup(60 + k * 46, 46 + r * 52));
      totals += tag(222, 54 + r * 52, (r + 1) * 3, C.orange, 's2', .2 + r * .22, 24);
    }
    const body = cups + totals
      + tag(440, 66, '3씩 6줄', C.blue, 's1', 1.6, 32)
      + tag(440, 136, '3 + 3 + 3 + 3 + 3 + 3', C.orange, 's2', 1.4, 28) + tag(440, 180, '= 18', C.orange, 's2', 1.7, 30)
      + eqRow(270, [[340, '3'], [390, '×'], [440, '6'], [490, '='], [550, '18', C.green]], 50, 's3', .2)
      + ring(390, 253, 26, C.green, 'r3', 1.2)
      + G('p3', 1.5, pill(440, 326, 110, '곱셈', C.green, C.mint, 30));
    reg('2-1/수학/6/곱셈', id, body);
  })();

  // 곱셈식: 자전거 4대 바퀴에 1~8 → 덧셈식 2 + 2 + 2 + 2 = 8 → 곱셈식 2 × 4 = 8, × 와 = 에 고리
  (function () {
    const id = 't21-m6-gopsemsik';
    const bike = (x, y) => `<circle cx="${x - 32}" cy="${y}" r="22" fill="white" stroke="${C.ink}" stroke-width="4"/><circle cx="${x + 32}" cy="${y}" r="22" fill="white" stroke="${C.ink}" stroke-width="4"/>`
      + `<path d="M${x - 32} ${y} L${x - 8} ${y - 30} H${x + 18} L${x + 32} ${y} M${x - 32} ${y} L${x} ${y} L${x + 18} ${y - 30} M${x - 12} ${y - 38} h10 M${x + 18} ${y - 30} l-4 -12 h10" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const xs = [90, 240, 390, 540];
    let wheels = '';
    xs.forEach((x, i) => [-32, 32].forEach((dx, k) => { wheels += tag(x + dx, 158, i * 2 + k + 1, C.orange, 'p1', .5 + (i * 2 + k) * .15, 22); }));
    const body = xs.map((x, i) => G('p1', .1 + i * .1, bike(x, 104))).join('') + wheels
      + tag(34, 212, '덧셈식', C.muted, 's2', .1, 22, 'start')
      + eqRow(214, [[180, '2'], [226, '+'], [272, '2'], [318, '+'], [364, '2'], [410, '+'], [456, '2'], [502, '='], [548, '8', C.orange]], 40, 's2', .2, .12)
      + tag(34, 296, '곱셈식', C.green, 's3', .1, 22, 'start')
      + eqRow(298, [[180, '2'], [240, '×'], [300, '4'], [360, '='], [420, '8', C.green]], 50, 's3', .2)
      + ring(240, 281, 26, C.orange, 'r3', 1.2) + ring(360, 281, 26, C.orange, 'r3', 1.4)
      + G('p3', 1.6, pill(545, 282, 130, '곱셈식', C.green, C.mint, 30));
    reg('2-1/수학/6/곱셈식', id, body);
  })();

  // 곱하기: 3씩 6묶음 → 3 × 6 → × 에 고리, 아래 '곱하기', 3 곱하기 6 → = 18
  (function () {
    const id = 't21-m6-gopagi';
    let dots = '';
    for (let g = 0; g < 6; g++) {
      dots += `<rect class="dr d1" pathLength="100" ${dl(.2 + g * .15)} x="${46 + g * 94}" y="30" width="80" height="44" rx="22" fill="none" stroke="${C.orange}" stroke-width="3"/>`;
      for (let k = 0; k < 3; k++) dots += G('p1', .1 + g * .15, `<circle cx="${62 + g * 94 + k * 24}" cy="52" r="9" fill="${C.orange}"/>`);
    }
    const body = dots
      + eqRow(170, [[190, '3'], [260, '×'], [330, '6']], 72, 's1', 1.2, .15)
      + eqRow(170, [[400, '='], [480, '18', C.green]], 72, 's3', .3)
      + ring(260, 146, 34, C.red, 'r2', .2)
      + G('s2', .6, arrow(260, 196, 260, 226, C.red) + T(260, 262, '곱하기', { size: 32, color: C.red }))
      + tag(260, 330, '3 곱하기 6', C.ink, 's2', 1.3, 36)
      + ring(480, 146, 40, C.green, 'r3', .8);
    reg('2-1/수학/6/곱하기', id, body);
  })();

  // 곱: 4씩 5줄 점 → 줄마다 4, 8, 12, 16, 20, 4 × 5 = 20 → 20 아래 괄호와 '곱', 4와 5의 곱
  (function () {
    const id = 't21-m6-gop';
    let dots = '', totals = '';
    for (let r = 0; r < 5; r++) {
      for (let k = 0; k < 4; k++) dots += G('p1', .1 + r * .25 + k * .05, `<circle cx="${70 + k * 42}" cy="${60 + r * 52}" r="14" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`);
      totals += tag(242, 68 + r * 52, (r + 1) * 4, C.blue, 's2', .2 + r * .25, 24);
    }
    const body = dots + totals
      + tag(450, 80, '4씩 5줄', C.blue, 's1', 1.5, 30)
      + eqRow(180, [[340, '4'], [390, '×'], [440, '5']], 52, 's1', 1.6, .1)
      + eqRow(180, [[490, '='], [552, '20', C.green]], 52, 's2', 1.5)
      + G('s3', .2, brace(522, 582, 196, C.green) + T(552, 264, '곱', { size: 34, color: C.green }))
      + ring(552, 162, 34, C.green, 'r3', .4)
      + tag(450, 320, '4와 5의 곱', C.green, 'p3', 1, 32);
    reg('2-1/수학/6/곱', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
