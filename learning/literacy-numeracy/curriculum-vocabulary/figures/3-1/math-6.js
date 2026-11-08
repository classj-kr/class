// 수학 3-1 6단원 분수와 소수: 낱말 도식
// 색 약속: 분모는 파랑, 분자는 주황, 0.1 은 초록, 소수점은 빨간 동그라미.
// 교과서 예: 피자 반(2분의 1), 색칠한 3칸 중 2칸(3분의 2), 리본을 2명·3명·4명이 나누기(단위분수), 1 cm = 10 mm 에서 0.1, 7과 0.6만큼 7.6.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(pathLength="1"), rN 퍼지는 고리, kN 깜빡이며 남기,
  // fN 날아오기(--dx,--dy 만큼 떨어진 곳에서 제자리로), wN 왼쪽부터 늘어나며 채워지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} :is(.w1,.w2,.w3,.w4) { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .45s ease-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .8s ease-in-out both; }
    .on${n} .sc-${id} .w${n} { transform: none; }`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const ring = (x, y, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const label = (x, y, s, color, cls, d = 0, size = 28) => `<g class="${cls}" ${delay(d)}>${T(x, y, s, { size, color })}</g>`;

  // 세로 분수: 가운데 가로줄 높이 cy. n 이나 d 를 '' 로 주면 그 자리를 비운다.
  function frac(x, cy, n, d, { size = 32, color = C.ink, nc = color, dc = color } = {}) {
    const w = Math.max(String(n).length, String(d).length, 1) * size * 0.6 + 12;
    return (n === '' ? '' : T(x, cy - size * 0.24, n, { size, color: nc }))
      + `<path d="M${f(x - w / 2)} ${cy} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + (d === '' ? '' : T(x, cy + size * 0.98, d, { size, color: dc }));
  }
  const numMid = (cy, size) => cy - size * 0.6;
  const denMid = (cy, size) => cy + size * 0.62;

  // 원 조각(12시부터 시계 방향)
  const pt = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
  function sector(cx, cy, r, n, k) {
    const a0 = -90 + 360 * k / n, a1 = a0 + 360 / n;
    const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
    return `M${cx} ${cy} L${f(x0)} ${f(y0)} A${r} ${r} 0 ${360 / n > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)} Z`;
  }
  const mid = (cx, cy, r, n, k) => pt(cx, cy, r * 0.64, -90 + 360 * (k + 0.5) / n);
  const cutLines = (cx, cy, r, n, cls, step = .12, d0 = .1) => Array.from({ length: n }, (_, k) => {
    const [x, y] = pt(cx, cy, r, -90 + 360 * k / n);
    return `<path class="${cls}" pathLength="1" ${delay(d0 + k * step)} d="M${cx} ${cy} L${f(x)} ${f(y)}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
  }).join('');
  const crust = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.orange}" stroke-width="7"/>`;

  // 분수: 피자를 똑같이 둘로 → 한 쪽이 2분의 1 → 종이를 똑같이 셋으로 나눠 2칸 → 3분의 2 → 이런 수가 분수
  (function () {
    const id = 't31-m6-bunsu', A = [150, 138], r = 100, P = { x: 362, y: 70, w: 240, h: 150 };
    const cw = P.w / 3;
    const pizza = `<circle cx="${A[0]}" cy="${A[1]}" r="${r}" fill="white"/>`
      + `<path class="s2" ${delay(.2)} d="${sector(...A, r, 2, 0)}" fill="${C.peach}"/>`
      + `<path class="draw d1" pathLength="1" ${delay(.3)} d="M${A[0]} ${A[1] - r} V${A[1] + r}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`
      + crust(...A, r);
    const paper = `<g class="s3" ${delay(.1)}><rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" fill="white"/></g>`
      + [0, 1].map((k) => `<rect class="w3" ${delay(.7 + k * .35)} x="${P.x + k * cw}" y="${P.y}" width="${cw}" height="${P.h}" fill="${C.sky}"/>`).join('')
      + [1, 2].map((k) => `<path class="draw d3" pathLength="1" ${delay(.3 + k * .15)} d="M${P.x + k * cw} ${P.y} V${P.y + P.h}" stroke="${C.ink}" stroke-width="3"/>`).join('')
      + `<g class="s3" ${delay(.1)}><rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" fill="none" stroke="${C.blue}" stroke-width="4"/></g>`;
    const body = pizza + paper
      + `<g class="s2" ${delay(.7)}>${frac(A[0], 290, 1, 2, { size: 36, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s2" ${delay(1.1)}>${T(196, 302, '2분의 1', { size: 22, anchor: 'start' })}</g>`
      + `<g class="s3" ${delay(1.5)}>${frac(P.x + P.w / 2 - 30, 290, 2, 3, { size: 36, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s3" ${delay(1.8)}>${T(P.x + P.w / 2 + 16, 302, '3분의 2', { size: 22, anchor: 'start' })}</g>`
      + label(305, 46, '분수', C.green, 'p4', .3, 32)
      + `<g class="k4" ${delay(.6)}><rect x="${A[0] - 40}" y="246" width="184" height="100" rx="12" fill="none" stroke="${C.green}" stroke-width="3"/></g>`
      + `<g class="k4" ${delay(.9)}><rect x="${P.x + P.w / 2 - 70}" y="246" width="176" height="100" rx="12" fill="none" stroke="${C.green}" stroke-width="3"/></g>`;
    put('3-1/수학/6/분수', svg(id, body, motion(id)));
  })();

  // 분모: 피자를 똑같이 6조각 → 2조각을 먹어 6분의 2 → 가로선 아래 6 이 나눈 수, 분모
  (function () {
    const id = 't31-m6-bunmo', A = [190, 178], r = 124, FX = 470, FY = 150, S = 64;
    const eaten = [0, 1].map((k) => `<path class="s2" ${delay(.2 + k * .35)} d="${sector(...A, r, 6, k)}" fill="${C.peach}"/>`).join('');
    const nums = Array.from({ length: 6 }, (_, k) => { const [x, y] = mid(...A, r, 6, k); return `<g class="p1" ${delay(.9 + k * .15)}>${T(x, y + 9, k + 1, { size: 26, color: C.blue })}</g>`; }).join('');
    const body = `<circle cx="${A[0]}" cy="${A[1]}" r="${r}" fill="white"/>` + eaten
      + cutLines(...A, r, 6, 'draw d1', .12) + crust(...A, r) + nums
      + `<g class="s2" ${delay(1)}>${frac(FX, FY, '', 6, { size: S, dc: C.blue })}</g>`
      + `<g class="p2" ${delay(1.3)}>${T(FX, FY - S * 0.24, 2, { size: S, color: C.orange })}</g>`
      + `<g class="h3"><g class="s2" ${delay(1.6)}>${T(FX, 272, '6분의 2', { size: 26 })}</g></g>`
      + ring(FX, denMid(FY, S), 32, C.blue, 'r3', .2)
      + `<g class="s3" ${delay(.6)}>${arrow(FX, 282, FX, denMid(FY, S) + 36, C.blue)}${T(FX, 318, '분모', { size: 32, color: C.blue })}</g>`
      + `<g class="k3" ${delay(.8)}><circle cx="${A[0]}" cy="${A[1]}" r="${r + 8}" fill="none" stroke="${C.blue}" stroke-width="4" stroke-dasharray="10 8"/></g>`;
    put('3-1/수학/6/분모', svg(id, body, motion(id)));
  })();

  // 분자: 막대 과자를 똑같이 5칸 → 초콜릿이 3칸에 묻음 → 가로선 위 3 이 묻은 칸 수, 분자
  (function () {
    const id = 't31-m6-bunja', x0 = 40, cw = 76, y = 150, h = 50, FX = 512, FY = 172, S = 64;
    const bar = `<rect x="${x0}" y="${y}" width="${5 * cw}" height="${h}" rx="14" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    const choco = [0, 1, 2].map((k) => `<rect class="w2" ${delay(.2 + k * .4)} x="${x0 + k * cw + 2}" y="${y + 2}" width="${cw - (k ? 2 : 0)}" height="${h - 4}" rx="${k ? 0 : 12}" fill="${C.ink}"/>`).join('');
    const cuts = [1, 2, 3, 4].map((k) => `<path class="draw d1" pathLength="1" ${delay(.2 + k * .15)} d="M${x0 + k * cw} ${y - 8} V${y + h + 8}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="1"/>`).join('');
    const tops = Array.from({ length: 5 }, (_, k) => `<g class="p1" ${delay(.9 + k * .12)}>${T(x0 + (k + .5) * cw, y - 18, k + 1, { size: 20, color: C.muted })}</g>`).join('');
    const inner = [0, 1, 2].map((k) => `<g class="p2" ${delay(.5 + k * .4)}>${T(x0 + (k + .5) * cw, y + h / 2 + 9, k + 1, { size: 26, color: 'white' })}</g>`).join('');
    const body = bar + choco + cuts + tops + inner
      + `<g class="s1" ${delay(1.4)}>${frac(FX, FY, '', 5, { size: S })}</g>`
      + `<g class="p2" ${delay(1.7)}>${T(FX, FY - S * 0.24, 3, { size: S, color: C.orange })}</g>`
      + `<g class="s2" ${delay(1.9)}>${T(FX, 300, '5분의 3', { size: 26 })}</g>`
      + ring(FX, numMid(FY, S), 32, C.orange, 'r3', .2)
      + `<g class="s3" ${delay(.6)}>${arrow(622, numMid(FY, S), FX + 42, numMid(FY, S), C.orange)}${T(592, numMid(FY, S) - 34, '분자', { size: 30, color: C.orange })}</g>`
      + `<g class="k3" ${delay(.8)}><rect x="${x0 - 6}" y="${y - 6}" width="${3 * cw + 12}" height="${h + 12}" rx="16" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    put('3-1/수학/6/분자', svg(id, body, motion(id)));
  })();

  // 단위분수: 빨간·파란·노란 리본을 2명·3명·4명이 똑같이 나눔 → 한 사람 몫 2분의 1, 3분의 1, 4분의 1 → 분자가 모두 1
  (function () {
    const id = 't31-m6-danwi', x0 = 110, W = 420, h = 36;
    const rows = [[2, 64, C.red, C.peach], [3, 154, C.blue, C.sky], [4, 244, C.orange, C.yellow]];
    let body = '';
    rows.forEach(([n, y, line, fill], i) => {
      const cw = W / n;
      body += T(62, y + 26, `${n}명`, { size: 22, color: line })
        + `<rect x="${x0}" y="${y}" width="${W}" height="${h}" rx="6" fill="white"/>`
        + `<rect class="w2" ${delay(.2 + i * .35)} x="${x0}" y="${y}" width="${cw}" height="${h}" rx="6" fill="${fill}"/>`
        + Array.from({ length: n - 1 }, (_, k) => `<path class="draw d1" pathLength="1" ${delay(.2 + i * .35 + k * .12)} d="M${f(x0 + (k + 1) * cw)} ${y - 6} V${y + h + 6}" stroke="${C.ink}" stroke-width="3"/>`).join('')
        + `<rect x="${x0}" y="${y}" width="${W}" height="${h}" rx="6" fill="none" stroke="${line}" stroke-width="3.5"/>`
        + `<g class="s2" ${delay(.5 + i * .35)}>${frac(586, y + h / 2, 1, n, { size: 28, nc: C.orange, dc: C.blue })}</g>`
        + ring(586, numMid(y + h / 2, 28), 18, C.orange, 'r3', .2 + i * .25);
    });
    body += `<g class="s3" ${delay(.9)}><rect x="550" y="40" width="72" height="262" rx="12" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="9 7"/></g>`
      + label(320, 336, '단위분수', C.green, 'p3', 1.2, 32);
    put('3-1/수학/6/단위분수', svg(id, body, motion(id)));
  })();

  // 소수: 1을 똑같이 10칸 → 한 칸이 10분의 1 = 0.1 → 0.1, 0.2, …, 0.9 → 이런 수가 소수
  (function () {
    const id = 't31-m6-sosu', x0 = 70, c = 50, y = 64, h = 60;
    const cuts = Array.from({ length: 9 }, (_, k) => `<path class="draw d1" pathLength="1" ${delay(.2 + k * .1)} d="M${x0 + (k + 1) * c} ${y} V${y + h}" stroke="${C.ink}" stroke-width="2.5"/>`).join('');
    const cells = `<rect class="w2" ${delay(.2)} x="${x0}" y="${y}" width="${c}" height="${h}" fill="${C.mint}"/>`
      + Array.from({ length: 8 }, (_, k) => `<rect class="w3" ${delay(.2 + k * .2)} x="${x0 + (k + 1) * c}" y="${y}" width="${c}" height="${h}" fill="${C.mint}"/>`).join('');
    const tlabels = Array.from({ length: 9 }, (_, k) => `<g class="${k ? 's3' : 's2'}" ${delay(k ? .4 + (k - 1) * .2 : .8)}>${T(x0 + (k + 1) * c, y + h + 32, `0.${k + 1}`, { size: 18, color: C.green })}</g>`).join('');
    const body = `<rect x="${x0}" y="${y}" width="${10 * c}" height="${h}" fill="white"/>` + cells + cuts
      + `<rect x="${x0}" y="${y}" width="${10 * c}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="3.5"/>`
      + T(x0, y + h + 34, 0, { size: 22 }) + T(x0 + 10 * c, y + h + 34, 1, { size: 22 })
      + `<g class="s1" ${delay(.1)}>${T(x0 + 5 * c, y - 14, '1', { size: 26 })}</g>`
      + tlabels
      + ring(x0 + c / 2, y + h / 2, 22, C.green, 'r2', .5)
      + `<g class="s2" ${delay(1)}>${frac(210, 262, 1, 10, { size: 40 })}${T(286, 276, '=', { size: 44 })}</g>`
      + `<g class="p2" ${delay(1.4)}>${T(366, 280, '0.1', { size: 54, color: C.green })}</g>`
      + `<g class="s2" ${delay(1.8)}>${T(500, 276, '영 점 일', { size: 24, color: C.muted })}</g>`
      + `<g class="k4" ${delay(.2)}><rect x="${x0 + c - 26}" y="${y + h + 10}" width="${8 * c + 52}" height="32" rx="10" fill="none" stroke="${C.green}" stroke-width="3"/></g>`
      + label(320, 340, '소수', C.green, 'p4', .8, 32);
    put('3-1/수학/6/소수', svg(id, body, motion(id)));
  })();

  // 소수점: 1 이 7개와 0.1 이 6개 → 7 과 0.6 → 7 과 6 사이에 점, 7.6 → 칠 점 육
  (function () {
    const id = 't31-m6-sosujeom', x0 = 50, u = 64, y = 50, h = 50, tx = x0 + 7 * u, tw = u * .6;
    const blocks = Array.from({ length: 7 }, (_, k) => `<g class="f1" ${delay(.2 + k * .15, '--dx:0px;--dy:-40px')}><rect x="${x0 + k * u}" y="${y}" width="${u}" height="${h}" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>${T(x0 + (k + .5) * u, y + 33, 1, { size: 20, color: C.blue })}</g>`).join('');
    const tenths = `<rect class="w2" ${delay(.2)} x="${tx}" y="${y}" width="${tw}" height="${h}" fill="${C.mint}"/>`
      + `<g class="s2" ${delay(.6)}><path d="${Array.from({ length: 5 }, (_, k) => `M${f(tx + (k + 1) * u / 10)} ${y}v${h}`).join('')}" stroke="${C.green}" stroke-width="1.5"/>`
      + `<rect x="${tx}" y="${y}" width="${tw}" height="${h}" fill="none" stroke="${C.green}" stroke-width="2.5"/></g>`;
    const br = (x1, x2, color) => {
      const m = (x1 + x2) / 2, by = y + h + 8;
      return `<path d="M${f(x1)} ${by} Q${f(x1)} ${by + 10} ${f(Math.min(x1 + 10, m))} ${by + 10} H${f(m - 6)} L${f(m)} ${by + 18} L${f(m + 6)} ${by + 10} H${f(Math.max(x2 - 10, m))} Q${f(x2)} ${by + 10} ${f(x2)} ${by}" fill="none" stroke="${color}" stroke-width="3"/>`;
    };
    const L7 = [x0 + 3.5 * u, 160], L6 = [tx + tw / 2, 160];
    const D = { y: 282, s: 100, x7: 262, xp: 322, x6: 382 };
    const body = blocks + tenths
      + `<g class="s1" ${delay(1.4)}>${br(x0, tx, C.blue)}${T(...L7, '7', { size: 30, color: C.blue })}</g>`
      + `<g class="s2" ${delay(.7)}>${br(tx, tx + tw, C.green)}${T(...L6, '0.6', { size: 26, color: C.green })}</g>`
      + `<g class="f3" ${delay(.1, `--dx:${L7[0] - D.x7}px;--dy:${L7[1] - D.y}px`)}>${T(D.x7, D.y, '7', { size: D.s, color: C.blue })}</g>`
      + `<g class="f3" ${delay(.3, `--dx:${f(L6[0] - D.x6)}px;--dy:${L6[1] - D.y}px`)}>${T(D.x6, D.y, '6', { size: D.s, color: C.green })}</g>`
      + `<g class="p3" ${delay(1)}><circle cx="${D.xp}" cy="${D.y - 8}" r="11" fill="${C.red}"/></g>`
      + ring(D.xp, D.y - 8, 14, C.red, 'r3', 1.3)
      + `<g class="s3" ${delay(1.5)}>${arrow(486, D.y - 12, D.xp + 22, D.y - 10, C.red)}${T(548, D.y - 2, '소수점', { size: 28, color: C.red })}</g>`
      + `<g class="s4" ${delay(.2)}>${T(D.x7, 342, '칠', { size: 26 })}</g>`
      + `<g class="s4" ${delay(.6)}>${T(D.xp, 342, '점', { size: 26, color: C.red })}</g>`
      + `<g class="s4" ${delay(1)}>${T(D.x6, 342, '육', { size: 26 })}</g>`
      + ring(D.xp, 334, 20, C.red, 'r4', .7);
    put('3-1/수학/6/소수점', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
