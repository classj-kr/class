// 수학 3-2 5단원 분수: 낱말 도식
// 수직선은 0~2, 한 칸이 4분의 1. 1보다 작은 곳(진분수)과 1과 같거나 큰 곳(가분수)을 띠 색으로 가른다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(pathLength="1"), rN 퍼지는 고리, kN 깜빡이며 남기,
  // fN 날아오기(--dx,--dy 만큼 떨어진 곳에서 제자리로), mN 옮겨 가 머물기(--mx,--my), gN 그 칸에서 사라지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} :is(.m2,.m3,.m4) { transition: transform .8s ease-in-out; }
    .sc-${id} :is(.g2,.g3,.g4) { transition: opacity .3s linear; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-grow { from { transform: scaleX(0); } to { transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .8s ease-in-out both; }
    .on${n} .sc-${id} .m${n} { transform: translate(var(--mx, 0px), var(--my, 0px)); }
    .on${n} .sc-${id} .g${n} { opacity: 0; }`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const ring = (x, y, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const label = (x, y, s, color, cls, d = 0, size = 28) => `<g class="${cls}" ${delay(d)}>${T(x, y, s, { size, color })}</g>`;

  // 세로 분수: 가운데 가로줄 높이 cy. 돌려주는 값의 nY, dY 는 분자·분모 글자 가운데 높이
  function frac(x, cy, n, d, { size = 32, color = C.ink, nc = color, dc = color } = {}) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.6 + 12;
    return `<text x="${f(x)}" y="${f(cy - size * 0.24)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${nc}">${n}</text>`
      + `<path d="M${f(x - w / 2)} ${cy} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + `<text x="${f(x)}" y="${f(cy + size * 0.98)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${dc}">${d}</text>`;
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
  const mid = (cx, cy, r, n, k) => pt(cx, cy, r * 0.62, -90 + 360 * (k + 0.5) / n);
  const cutLines = (cx, cy, r, n, cls = '', step = 0) => Array.from({ length: n }, (_, k) => {
    const [x, y] = pt(cx, cy, r, -90 + 360 * k / n);
    return `<path class="${cls}" ${cls ? `pathLength="1" ${delay(.1 + k * step)}` : ''} d="M${cx} ${cy} L${f(x)} ${f(y)}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
  }).join('');

  // 수직선 0~2(4분의 1 눈금)
  const NL = { x0: 80, x1: 560, y: 236 };
  const at = (v) => NL.x0 + v * (NL.x1 - NL.x0) / 2;
  const numberLine = () => {
    let s = `<path d="M${NL.x0 - 22} ${NL.y} H${NL.x1 + 22}" stroke="${C.ink}" stroke-width="3"/>`;
    for (let k = 0; k <= 8; k++) s += `<path d="M${f(at(k / 4))} ${NL.y - (k % 4 ? 8 : 13)} V${NL.y + (k % 4 ? 8 : 13)}" stroke="${C.ink}" stroke-width="${k % 4 ? 2 : 3}"/>`;
    return s + [0, 1, 2].map((v) => T(at(v), NL.y + 42, v, { size: 26 })).join('');
  };
  const band = (v0, v1, color, cls, d = 0) => `<rect class="${cls}" ${delay(d)} x="${f(at(v0))}" y="${NL.y - 30}" width="${f(at(v1) - at(v0))}" height="60" rx="8" fill="${color}" opacity=".55"/>`;
  const npt = (v, color, cls, d) => `<circle class="${cls}" ${delay(d)} cx="${f(at(v))}" cy="${NL.y}" r="10" fill="${color}" stroke="white" stroke-width="2.5"/>`;

  // 분수: 네모난 케이크를 똑같이 8조각 → 3조각을 칠함 → 8분의 3
  (function () {
    const id = 't32-m5-bunsu', x0 = 70, y0 = 90, w = 320, h = 180, cw = w / 4, ch = h / 2;
    const cells = [0, 1, 2].map((k) => `<rect class="s2" ${delay(.2 + k * .35)} x="${x0 + k * cw}" y="${y0}" width="${cw}" height="${ch}" fill="${C.peach}"/>`).join('');
    const nums = [0, 1, 2].map((k) => `<g class="p2" ${delay(.35 + k * .35)}>${T(x0 + (k + .5) * cw, y0 + ch / 2 + 9, k + 1, { size: 26, color: C.orange })}</g>`).join('');
    const cuts = [1, 2, 3].map((k) => `<path class="draw d1" pathLength="1" ${delay(.2 + k * .25)} d="M${x0 + k * cw} ${y0} V${y0 + h}" stroke="${C.ink}" stroke-width="3"/>`).join('')
      + `<path class="draw d1" pathLength="1" ${delay(1.2)} d="M${x0} ${y0 + ch} H${x0 + w}" stroke="${C.ink}" stroke-width="3"/>`;
    const body = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="white"/>` + cells + cuts
      + `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="4"/>` + nums
      + `<g class="s1" ${delay(1.6)}>${T(x0 + w / 2, y0 + h + 44, '8조각', { size: 24, color: C.muted })}</g>`
      + `<g class="s3" ${delay(.2)}>${frac(510, 170, 3, 8, { size: 64, nc: C.orange, dc: C.ink })}</g>`
      + `<g class="s3" ${delay(.9)}>${T(510, 290, '8분의 3', { size: 28 })}</g>`
      + label(510, 70, '분수', C.green, 'p3', 1.3, 32);
    put('3-2/수학/5/분수', svg(id, body, motion(id)));
  })();

  // 분모: 분수 2분의 1 의 분모 2 → 귤 6개를 똑같이 2묶음 → 한 묶음이 3개
  (function () {
    const id = 't32-m5-bunmo', FX = 540, FY = 150, S = 60;
    const orange = (x, y) => `<circle cx="${x}" cy="${y}" r="20" fill="${C.orange}" stroke="#b5601f" stroke-width="2"/><path d="M${x} ${y - 20} q6 -9 15 -7 q-5 8 -15 7 Z" fill="${C.green}"/>`;
    const fx = (i) => 80 + i * 62;
    const fruits = Array.from({ length: 6 }, (_, i) => `<g class="m2" ${delay(.3, `--mx:${i < 3 ? -18 : 18}px;--my:0px`)}><g class="p1" ${delay(.2 + i * .12)}>${orange(fx(i), 180)}</g></g>`).join('');
    const lasso = (g) => `<rect class="draw d2" pathLength="1" ${delay(1 + g * .4)} x="${fx(g * 3) - 34 + (g ? 18 : -18)}" y="146" width="${2 * 62 + 68}" height="72" rx="30" fill="none" stroke="${C.green}" stroke-width="4"/>`;
    const body = `<g class="s3" ${delay(.2)}><rect x="${fx(0) - 52}" y="146" width="${2 * 62 + 68}" height="72" rx="30" fill="${C.peach}"/></g>`
      + fruits + lasso(0) + lasso(1)
      + `<g class="p2" ${delay(1.2)}>${T(fx(1) - 18, 120, '1묶음', { size: 22, color: C.green })}</g><g class="p2" ${delay(1.6)}>${T(fx(4) + 18, 120, '1묶음', { size: 22, color: C.green })}</g>`
      + `<g class="s3" ${delay(.6)}>${T(fx(1) - 18, 260, '3개', { size: 26, color: C.orange })}</g>`
      + `<g class="s1" ${delay(.8)}>${frac(FX, FY, 1, 2, { size: S, dc: C.blue })}</g>`
      + ring(FX, denMid(FY, S), 30, C.blue, 'r2', .2)
      + `<g class="s3" ${delay(1)}>${arrow(FX, 280, FX, denMid(FY, S) + 34, C.blue)}${T(FX, 314, '분모', { size: 30, color: C.blue })}</g>`;
    put('3-2/수학/5/분모', svg(id, body, motion(id)));
  })();

  // 분자: 피자 8조각 가운데 불고기 맛 5조각을 세어 → 가로선 위에 5
  (function () {
    const id = 't32-m5-bunja', A = [200, 182], r = 128, F = [470, 168], S = 64;
    const fills = [0, 1, 2, 3, 4].map((k) => `<path class="s2" ${delay(.2 + k * .3)} d="${sector(...A, r, 8, k)}" fill="${C.peach}"/>`).join('');
    const nums = [0, 1, 2, 3, 4].map((k) => { const [x, y] = mid(...A, r, 8, k); return `<g class="p2" ${delay(.35 + k * .3)}>${T(x, y + 9, k + 1, { size: 24, color: C.orange })}</g>`; }).join('');
    const body = `<circle cx="${A[0]}" cy="${A[1]}" r="${r}" fill="#fff4d6"/>` + fills
      + cutLines(...A, r, 8, 'draw d1', .14)
      + `<circle cx="${A[0]}" cy="${A[1]}" r="${r}" fill="none" stroke="${C.orange}" stroke-width="6"/>` + nums
      + `<g class="s1" ${delay(1.2)}>${frac(F[0], F[1], '', 8, { size: S })}</g>`
      + `<g class="p3" ${delay(.2)}>${T(F[0], F[1] - S * 0.24, 5, { size: S, color: C.orange })}</g>`
      + ring(F[0], numMid(F[1], S), 32, C.orange, 'r3', .6)
      + `<g class="s3" ${delay(.9)}>${arrow(F[0] + 112, numMid(F[1], S), F[0] + 44, numMid(F[1], S), C.orange)}${T(F[0] + 110, numMid(F[1], S) - 30, '분자', { size: 30, color: C.orange })}</g>`;
    put('3-2/수학/5/분자', svg(id, body, motion(id)));
  })();

  // 진분수: 4분의 1, 2, 3 이 수직선 위 0과 1 사이에 → 1보다 작은 곳 → 분자 < 분모
  (function () {
    const id = 't32-m5-jinbunsu';
    const fr = [1, 2, 3].map((n, i) => npt(n / 4, C.blue, 'p1', .3 + i * .4) + `<g class="s1" ${delay(.4 + i * .4)}>${frac(at(n / 4), 156, n, 4, { size: 30, nc: C.blue })}</g>`).join('');
    const body = band(0, 1, C.sky, 's2', .2) + numberLine() + fr
      + `<g class="s2" ${delay(.6)}>${T(at(.5), 304, '1보다 작다', { size: 24, color: C.blue })}</g>`
      + `<g class="s2" ${delay(.6)}>${npt(1, C.ink, '', 0)}</g>`
      + `<g class="s3" ${delay(.2)}>${T(430, 342, '분자 < 분모', { size: 28, color: C.blue })}</g>`
      + [1, 2, 3].map((n, i) => ring(at(n / 4), numMid(156, 30), 18, C.blue, 'r3', .5 + i * .2)).join('')
      + label(150, 342, '진분수', C.green, 'p3', 1.1, 30);
    put('3-2/수학/5/진분수', svg(id, body, motion(id)));
  })();

  // 가분수: 4분의 1 m 끈을 5개 이으면 1을 넘음 → 4분의 4(=1), 5, 6, 7 → 1과 같거나 큰 곳 → 분자 ≥ 분모
  (function () {
    const id = 't32-m5-gabunsu', q = (NL.x1 - NL.x0) / 8;
    const strings = Array.from({ length: 5 }, (_, k) => `<rect class="sg" ${delay(.2 + k * .35)} x="${f(at(k / 4) + 2)}" y="${NL.y - 64}" width="${f(q - 4)}" height="18" rx="9" fill="${k % 2 ? C.orange : C.peach}" stroke="${C.orange}" stroke-width="2"/>`).join('');
    const fr = [4, 5, 6, 7].map((n, i) => npt(n / 4, C.orange, 'p2', .4 + i * .3) + `<g class="s2" ${delay(.5 + i * .3)}>${frac(at(n / 4), 120, n, 4, { size: 28, nc: C.orange })}</g>`).join('');
    const body = band(1, 2, C.peach, 's2', .2) + numberLine()
      + `<g class="h2">${strings}<g class="s1" ${delay(2)}>${frac(at(5 / 8), 112, 5, 4, { size: 28, nc: C.orange })}${T(at(5 / 8) + 30, 122, 'm', { size: 22, anchor: 'start', color: C.orange })}</g></g>`
      + fr
      + `<g class="s2" ${delay(1.6)}>${T(at(.5), 196, '1보다 작다', { size: 20, color: C.muted })}</g>`
      + `<g class="s3" ${delay(.2)}>${T(at(1.5), 330, '분자 = 분모, 분자 > 분모', { size: 24, color: C.orange })}</g>`
      + ring(at(1), NL.y, 16, C.orange, 'r3', .6)
      + label(130, 330, '가분수', C.green, 'p3', 1.1, 30);
    put('3-2/수학/5/가분수', svg(id, body, motion(id) + `
      .sc-${id} .sg { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); }
      .on1 .sc-${id} .sg { animation: ${id}-grow .3s ease-out both; }
    `));
  })();

  // 자연수: 사과를 1, 2, 3 하나씩 셈 → 수직선 0에서 1, 2, 3 으로 한 칸씩 뜀 → 4분의 4 는 1 과 같은 자리
  (function () {
    const id = 't32-m5-jayeonsu', x0 = 110, x1 = 530, y = 236, u = (x1 - x0) / 3;
    const X = (v) => x0 + v * u;
    let nl = `<path d="M${x0 - 22} ${y} H${x1 + 22}" stroke="${C.ink}" stroke-width="3"/>`;
    for (let k = 0; k <= 12; k++) nl += `<path d="M${f(X(k / 4))} ${y - (k % 4 ? 7 : 13)} V${y + (k % 4 ? 7 : 13)}" stroke="${C.ink}" stroke-width="${k % 4 ? 2 : 3}"/>`;
    nl += T(X(0), y + 42, 0, { size: 26, color: C.muted });
    const nums = [1, 2, 3].map((v, i) => `<g class="nb nb${i}">${T(X(v), y + 42, v, { size: 30, color: C.blue })}</g>`).join('');
    const apple = (x, yy) => `<circle cx="${x - 10}" cy="${yy}" r="22" fill="${C.red}"/><circle cx="${x + 10}" cy="${yy}" r="22" fill="${C.red}"/><path d="M${x} ${yy - 20} q2 -12 8 -15" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const apples = [1, 2, 3].map((v, i) => `<g class="p1" ${delay(.2 + i * .45)}>${apple(X(v), 96)}</g><g class="p1" ${delay(.4 + i * .45)}>${T(X(v), 160, v, { size: 30, color: C.red })}</g>`).join('');
    const hops = [0, 1, 2].map((i) => `<path class="draw d2" pathLength="1" ${delay(.3 + i * .45)} d="M${X(i)} ${y - 6} Q${X(i + .5)} ${y - 70} ${X(i + 1)} ${y - 6}" stroke="${C.blue}" stroke-width="3.5" fill="none"/>`).join('');
    const body = apples + nl + hops + nums
      + `<g class="s2" ${delay(.1)}><circle cx="${X(0)}" cy="${y}" r="9" fill="${C.blue}"/></g>`
      + [1, 2, 3].map((v, i) => `<circle class="p2" ${delay(.65 + i * .45)} cx="${X(v)}" cy="${y}" r="9" fill="${C.blue}"/>`).join('')
      + `<g class="f3" ${delay(.3, `--dx:${f(560 - X(1))}px;--dy:-80px`)}>${frac(X(1), 312, 4, 4, { size: 24, color: C.orange })}</g>`
      + `<g class="s3" ${delay(1.1)}>${T(X(1) + 26, 322, '= 1', { size: 26, color: C.orange, anchor: 'start' })}</g>`
      + label(X(2.4), 318, '자연수', C.green, 'p3', 1.4, 30);
    put('3-2/수학/5/자연수', svg(id, body, motion(id) + `
      .sc-${id} .nb { opacity: .25; transition: opacity .3s; }
      .on2 .sc-${id} .nb0 { opacity: 1; transition-delay: .7s; }
      .on2 .sc-${id} .nb1 { opacity: 1; transition-delay: 1.15s; }
      .on2 .sc-${id} .nb2 { opacity: 1; transition-delay: 1.6s; }
    `));
  })();

  // 대분수: 4분의 1 조각 9개(4분의 9) → 4조각씩 모아 원 2개, 1조각 남음 → 2와 4분의 1
  (function () {
    const id = 't32-m5-daebunsu', R = 50, rowY = 120;
    const dir = [[1, -1], [1, 1], [-1, 1], [-1, -1]];                 // 조각 k 가 모서리에서 뻗는 쪽(12시부터 시계 방향)
    const wedge = (cx, cy, k) => `<path d="${sector(cx, cy, R, 4, k)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    const centers = [[150, 268], [290, 268], [430, 268]];
    let pieces = '';
    for (let i = 0; i < 9; i++) {
      const k = i % 4, sx = 64 + i * 64, [dx, dy] = dir[k];
      const corner = [sx - dx * R / 2, rowY - dy * R / 2];             // 조각의 네모 틀 가운데가 칸 가운데에 오게
      const c = centers[Math.floor(i / 4)];
      pieces += `<g class="m2" ${delay(.2 + i * .12, `--mx:${f(c[0] - corner[0])}px;--my:${f(c[1] - corner[1])}px`)}><g class="p1" ${delay(.2 + i * .1)}>${wedge(...corner, k)}</g></g>`;
    }
    const outlines = centers.slice(0, 2).map(([x, y], j) => `<circle class="s2" ${delay(1.4 + j * .3)} cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="4"/>`).join('');
    const body = pieces + outlines
      + `<g class="h2"><g class="s1" ${delay(1.2)}>${frac(590, 190, 9, 4, { size: 34, nc: C.orange })}</g></g>`
      + `<g class="p2" ${delay(1.6)}>${T(150, 346, 1, { size: 26 })}</g><g class="p2" ${delay(1.9)}>${T(290, 346, 1, { size: 26 })}</g>`
      + `<g class="s2" ${delay(1.9)}><circle cx="${centers[2][0]}" cy="${centers[2][1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="7 6"/>${frac(centers[2][0] + 84, 258, 1, 4, { size: 28, color: C.purple })}</g>`
      + `<g class="s3" ${delay(.2)}>${frac(170, 76, 9, 4, { size: 34, nc: C.orange })}${T(222, 87, '=', { size: 34 })}${T(272, 92, 2, { size: 52, color: C.blue })}${frac(314, 76, 1, 4, { size: 34, color: C.purple })}</g>`
      + `<g class="s3" ${delay(.9)}>${T(272, 150, '자연수', { size: 20, color: C.blue })}${T(330, 150, '진분수', { size: 20, color: C.purple, anchor: 'start' })}</g>`
      + label(500, 92, '대분수', C.green, 'p3', 1.4, 32);
    put('3-2/수학/5/대분수', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
