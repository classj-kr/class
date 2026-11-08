// 수학 5-1 6단원 다각형의 둘레와 넓이: 낱말 도식
// 다각형·정다각형·평행·수직·대각선은 4-2 에서 배운 말이라, 이 단원에서 쓰이는 자리(둘레·넓이 구하기)와 이어 보인다.
// 넓이는 모눈 한 칸(1 cm²)을 세는 데서 시작해, 잘라 옮기기(평행사변형)·두 개 붙이기(사다리꼴)·둘레에 붙이기(마름모)로 공식을 보인다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리). 칸마다 움직임 class 는 6-1 math-6.js 와 같은 motion() 약속.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(2);
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const unit = (a) => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const center = (pts) => mul(pts.reduce((s, p) => add(s, p), [0, 0]), 1 / pts.length);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  // 모눈·선 위에 얹는 글자: 바탕색 테두리로 선을 가린다
  const TH = (x, y, s, { size = 20, color = C.ink, weight = 700, anchor = 'middle' } = {}) =>
    `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}" stroke="${C.paper}" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${s}</text>`;
  const poly = (pts, attr) => `<polygon points="${pts.map(P).join(' ')}" ${attr}/>`;
  const pathOf = (pts, close = false) => `M${pts.map(P).join(' L')}${close ? ' Z' : ''}`;
  const ln = (p, q, color = C.ink, w = 4, more = '') => `<path d="M${P(p)} L${P(q)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none" ${more}/>`;
  const dash = (p, q, color = C.blue, w = 3) => ln(p, q, color, w, 'stroke-dasharray="8 6" stroke-linecap="butt"');
  // 그어지는 선(class dN): pathLength 100
  const drawn = (pts, n, delay, color = C.ink, w = 4, close = false) =>
    `<path class="dr d${n}" pathLength="100" d="${pathOf(pts, close)}" ${dl(delay)} stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const rmark = (O, a, b, { s = 18, color = C.red } = {}) => {
    const u = unit(sub(a, O)), v = unit(sub(b, O));
    const p1 = add(O, mul(u, s)), p2 = add(p1, mul(v, s)), p3 = add(O, mul(v, s));
    return `<path d="M${P(p1)} L${P(p2)} L${P(p3)}" stroke="${color}" stroke-width="3" fill="none"/>`;
  };
  const tick = (p, q, color = C.green) => {
    const m = mid(p, q), u = unit(sub(q, p)), v = [-u[1], u[0]];
    return ln(add(m, mul(v, -10)), add(m, mul(v, 10)), color, 3);
  };
  const arcAt = (V, A, B, r, color) => {
    const u = unit(sub(A, V)), v = unit(sub(B, V)), p = add(V, mul(u, r)), q = add(V, mul(v, r));
    const cr = u[0] * v[1] - u[1] * v[0];
    return `<path d="M${P(p)} A${r} ${r} 0 0 ${cr > 0 ? 1 : 0} ${P(q)}" stroke="${color}" stroke-width="3.5" fill="none"/>`;
  };
  // 변 바깥쪽 이름표: 변 가운데에서 도형 중심 반대쪽으로 gap
  const sideAt = (p, q, c, gap) => {
    const m = mid(p, q), u = unit(sub(q, p));
    let nv = [u[1], -u[0]];
    if ((m[0] - c[0]) * nv[0] + (m[1] - c[1]) * nv[1] < 0) nv = mul(nv, -1);
    return add(m, mul(nv, gap));
  };
  const regular = (cx, cy, r, n, start = -90) => Array.from({ length: n }, (_, k) => {
    const a = (start + 360 * k / n) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  // 모눈: x0,y0 에서 cols × rows 칸, 칸 u
  const grid = (x0, y0, cols, rows, u, color = C.line, w = 1.5) => {
    let d = '';
    for (let i = 0; i <= cols; i++) d += `M${f(x0 + i * u)} ${y0} V${f(y0 + rows * u)} `;
    for (let j = 0; j <= rows; j++) d += `M${x0} ${f(y0 + j * u)} H${f(x0 + cols * u)} `;
    return `<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none"/>`;
  };
  // 아래로 벌어진 묶음 표시(길이 합): x1~x2, y 에서
  const brace = (x1, x2, y, color = C.green) => `<path d="M${x1} ${y - 10} V${y} H${x2} V${y - 10}" stroke="${color}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;

  // 같이 쓰는 움직임(N 은 칸 번호). sN 나타나기, pN 튀어나오기, kN 깜빡이기(보이던 것), qN 잠깐 나타났다 사라지기,
  // fN 날아오기(--dx,--dy 에서 제자리로), dN 선 그리기(class="dr dN" pathLength="100"), gN 사라지기. 한 요소에 움직임 하나만.
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.f1,.f2,.f3,.f4,.q1,.q2,.q3,.q4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101}
    .sc-${id} :is(.g2,.g3,.g4){transition:opacity .35s linear}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:none}}
    @keyframes ${id}-blink{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}
    @keyframes ${id}-peek{0%,100%{opacity:0}20%,75%{opacity:1}}
    @keyframes ${id}-fly{from{opacity:1;transform:translate(var(--dx),var(--dy))}to{opacity:1;transform:none}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .45s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .5s ease-out both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.4s ease-in-out both}
    .on${n} .sc-${id} .q${n}{animation:${id}-peek 1s ease-in-out both}
    .on${n} .sc-${id} .f${n}{animation:${id}-fly .6s cubic-bezier(.4,0,.3,1) both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0;transition:stroke-dashoffset .8s ease-in-out}
    .on${n} .sc-${id} .g${n}{opacity:0}`;
    return css;
  };
  const MOVE = 'cubic-bezier(.65,0,.35,1)';
  const FILL = (fill, stroke = 'none', w = 0) => `fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"`;

  // 다각형: 삼각형·사각형·오각형이 그어짐 → 변이 차례로 빛나며 변 3개·4개·5개 → 오각형 변 3~7 cm, 3 + 4 + 5 + 6 + 7 = 25 → '다각형'
  {
    const id = 't51-m6-dagak';
    const tri = [[30, 220], [170, 220], [92, 95]];
    const quad = [[210, 220], [350, 220], [330, 105], [230, 125]];
    // 오각형: 변 7, 6, 5, 4, 3 cm 를 22 px/cm 로. D 는 C 에서 5 cm, E 에서 4 cm 인 점(두 원의 바깥쪽 만남).
    const s = 22, ox = 430, oy = 225, rad = Math.PI / 180;
    const cA = [0, 0], cB = [7, 0], cC = [7, 6], cE = [3 * Math.cos(110 * rad), 3 * Math.sin(110 * rad)];
    const dx = cE[0] - cC[0], dy = cE[1] - cC[1], L = Math.hypot(dx, dy), a = (25 - 16 + L * L) / (2 * L), h = Math.sqrt(25 - a * a);
    const cD = [cC[0] + a * dx / L + h * dy / L, cC[1] + a * dy / L - h * dx / L];
    const pent = [cA, cB, cC, cD, cE].map(([x, y]) => [ox + s * x, oy - s * y]);
    const lens = [7, 6, 5, 4, 3];
    const shapes = [[tri, 0], [quad, 1], [pent, 2]];
    const names = ['삼각형', '사각형', '오각형'];
    const cx = [100, 280, center(pent)[0]];
    const shape = (pts, i) => poly(pts, FILL([C.sky, C.mint, C.peach][i])) + drawn(pts, 1, .2 + .45 * i, C.ink, 4, true);
    const peeks = `<g class="g3">${shapes.map(([pts]) => pts.map((p, j) => `<g class="s2" ${dl(.2 + .3 * j)}>${ln(p, pts[(j + 1) % pts.length], C.orange, 6)}</g>`).join('')).join('')}</g>`;
    const pc = center(pent);
    const sideLabels = pent.map((p, j) => { const at = sideAt(p, pent[(j + 1) % 5], pc, 26); return `<g class="p3" ${dl(.2 + .25 * (4 - j))}>${T(at[0], at[1] + 7, `${lens[j]} cm`, { size: 20, color: C.orange })}</g>`; }).join('');
    const body = `<g class="dimA">${shape(tri, 0)}${shape(quad, 1)}<g class="s1" ${dl(1.2)}>${T(cx[0], 262, names[0], { size: 22 })}${T(cx[1], 262, names[1], { size: 22 })}</g>`
      + `<g class="s2" ${dl(1.2)}>${T(cx[0], 294, '변 3개', { size: 20, color: C.muted })}${T(cx[1], 294, '변 4개', { size: 20, color: C.muted })}</g></g>`
      + `<g class="blk">${shape(pent, 2)}</g>`
      + `<g class="g3"><g class="s1" ${dl(1.2)}>${T(cx[2], 262, names[2], { size: 22 })}</g><g class="s2" ${dl(1.2)}>${T(cx[2], 294, '변 5개', { size: 20, color: C.muted })}</g></g>`
      + peeks + sideLabels
      + `<g class="s3" ${dl(1.5)}>${T(320, 336, '3 + 4 + 5 + 6 + 7 = 25 (cm)', { size: 24 })}</g>`
      + `<g class="p4" ${dl(.6)}>${T(320, 50, '다각형', { size: 30, color: C.green })}</g>`;
    put('5-1/수학/6/다각형', svg(id, body, motion(id) + `
      .sc-${id} .dimA{transition:opacity .4s ease .1s}
      .on3 .sc-${id} .dimA{opacity:.25}
      .on4 .sc-${id} .dimA{opacity:1;animation:${id}-blink 1.4s ease-in-out .2s both}
      .on4 .sc-${id} .blk{animation:${id}-blink 1.4s ease-in-out .2s both}
    `));
  }

  // 정다각형: 정삼각형·정사각형·정육각형에 같은 길이 표시 → 각마다 같은 호 → 정육각형 변 1~6, 한 변 3 cm, 3 × 6 = 18 → '정다각형'
  {
    const id = 't51-m6-jeong';
    const tri = regular(110, 178, 74, 3), sq = regular(285, 170, 74, 4, -135), hex = regular(490, 165, 88, 6, -90);
    const cols = [[C.sky, C.blue], [C.mint, C.green], [C.peach, C.orange]];
    const one = (pts, i) => poly(pts, FILL(cols[i][0], C.ink, 4));
    const ticks = (pts, delay) => pts.map((p, j) => `<g class="p1" ${dl(delay + .1 * j)}>${tick(p, pts[(j + 1) % pts.length], C.red)}</g>`).join('');
    const arcs = (pts, delay, color) => pts.map((p, j) => `<g class="p2" ${dl(delay + .1 * j)}>${arcAt(p, pts[(j + pts.length - 1) % pts.length], pts[(j + 1) % pts.length], 20, color)}</g>`).join('');
    const hc = center(hex);
    const nums = hex.map((p, j) => { const at = sideAt(p, hex[(j + 1) % 6], hc, 22); return `<g class="p3" ${dl(.2 + .2 * j)}>${T(at[0], at[1] + 7, j + 1, { size: 20, color: C.purple })}</g>`; }).join('');
    const hexSides = hex.map((p, j) => `<g class="s3" ${dl(.2 + .2 * j)}>${ln(p, hex[(j + 1) % 6], C.orange, 6)}</g>`).join('');
    const body = `<g class="g3">${one(tri, 0)}${one(sq, 1)}${ticks(tri, .3)}${ticks(sq, .7)}${arcs(tri, .2, C.blue)}${arcs(sq, .5, C.green)}`
      + `${T(110, 290, '정삼각형', { size: 22 })}${T(285, 290, '정사각형', { size: 22 })}</g>`
      + `<g class="blk">${one(hex, 2)}${hexSides}${ticks(hex, 1.1)}${arcs(hex, .8, C.orange)}</g>`
      + T(490, 300, '정육각형', { size: 22 }) + nums
      + `<g class="s3" ${dl(.4)}>${T(190, 140, '한 변 3 cm', { size: 24 })}</g>`
      + `<g class="s3" ${dl(1.5)}>${T(190, 190, '3 × 6 = 18 (cm)', { size: 28, color: C.orange })}</g>`
      + `<g class="p4" ${dl(.6)}>${T(190, 262, '정다각형', { size: 30, color: C.green })}</g>`;
    put('5-1/수학/6/정다각형', svg(id, body, motion(id) + `
      .on4 .sc-${id} .blk{animation:${id}-blink 1.4s ease-in-out .2s both}
    `));
  }

  // 둘레: 가로 7 cm, 세로 3 cm 직사각형 → 가장자리를 따라 선이 그어질 때마다 아래 띠가 7·3·7·3 cm 만큼 이어짐 → 덧셈식 → 띠 전체 '둘레 20 cm'
  {
    const id = 't51-m6-dulle';
    const u = 30, x0 = 70, y0 = 60, W = 7 * u, H = 3 * u;
    const TL = [x0, y0], TR = [x0 + W, y0], BR = [x0 + W, y0 + H], BL = [x0, y0 + H];
    const trace = [[TL, TR, C.orange], [TR, BR, C.blue], [BR, BL, C.orange], [BL, TL, C.blue]];
    const delays = [.1, .65, 1.2, 1.75];
    const by = 236, bars = [[20, 7, C.orange], [230, 3, C.blue], [320, 7, C.orange], [530, 3, C.blue]];
    const body = poly([TL, TR, BR, BL], FILL(C.mint, C.ink, 3))
      + T(x0 + W / 2, y0 - 12, '7 cm', { size: 22 }) + T(x0 - 10, y0 + H / 2 + 8, '3 cm', { size: 22, anchor: 'end' })
      + trace.map(([p, q, c], i) => `<path class="dr d2 tr" pathLength="100" d="M${P(p)} L${P(q)}" ${dl(delays[i])} stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/>`).join('')
      + `<g class="blk">${bars.map(([x, n, c], i) => `<path class="dr d2 tr" pathLength="100" d="M${x} ${by} H${x + n * u}" ${dl(delays[i])} stroke="${c}" stroke-width="12" stroke-linecap="butt" fill="none"/>`).join('')}</g>`
      + bars.map(([x, n, c], i) => `<g class="p2" ${dl(delays[i] + .45)}>${T(x + n * u / 2, by - 18, `${n} cm`, { size: 20, color: c })}</g>`).join('')
      + `<g class="s3" ${dl(.2)}>${T(468, 98, '7 + 3 + 7 + 3 = 20 (cm)', { size: 22 })}</g>`
      + `<g class="s3" ${dl(1)}>${T(468, 140, '(7 + 3) × 2 = 20 (cm)', { size: 22 })}</g>`
      + `<g class="s4" ${dl(.2)}>${brace(20, 620, 266)}</g>`
      + `<g class="p4" ${dl(.6)}>${T(320, 306, '둘레 20 cm', { size: 30, color: C.green })}</g>`;
    put('5-1/수학/6/둘레', svg(id, body, motion(id) + `
      .on2 .sc-${id} .tr{transition-duration:.5s;transition-timing-function:linear}
      .on4 .sc-${id} .blk{animation:${id}-blink 1.4s ease-in-out .2s both}
    `));
  }

  // 넓이: 모양이 다른 가(4 × 3)와 나(7 × 2) → 나를 가에 겹쳐 봄 → 1 cm² 칸을 깔아 셈 → 12 cm² < 14 cm² → '넓이'
  {
    const id = 't51-m6-neolbi';
    const u = 36, A = [50, 100], B = [300, 118];
    const cells = (o, cols, rows, fill, stroke, base) => {
      let s = '', k = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++, k++) s += `<g class="p2" ${dl(base + .06 * k)}><rect x="${o[0] + c * u + 2}" y="${o[1] + r * u + 2}" width="${u - 4}" height="${u - 4}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="2"/></g>`;
      return s;
    };
    const rect = (o, cols, rows, fill) => `<rect x="${o[0]}" y="${o[1]}" width="${cols * u}" height="${rows * u}" fill="${fill}" stroke="${C.ink}" stroke-width="3"/>`;
    const body = `<g class="ga">${rect(A, 4, 3, C.paper)}${cells(A, 4, 3, C.sky, C.blue, .2)}</g>`
      + `<g class="gb"><g class="slide">${rect(B, 7, 2, C.paper)}<g class="fillB">${rect(B, 7, 2, C.mint)}</g>${cells(B, 7, 2, C.mint, C.green, .2 + .06 * 12)}</g></g>`
      + T(A[0] + 2 * u, A[1] - 14, '가', { size: 24 }) + T(B[0] + 3.5 * u, B[1] - 14, '나', { size: 24 })
      + `<g class="p2" ${dl(.1)}><rect x="40" y="290" width="${u}" height="${u}" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/></g>`
      + `<g class="s2" ${dl(.3)}>${T(88, 316, '1 cm²', { size: 22, color: C.orange, anchor: 'start' })}</g>`
      + `<g class="p3" ${dl(.2)}>${T(A[0] + 2 * u, 250, '12 cm²', { size: 26, color: C.blue })}</g>`
      + `<g class="p3" ${dl(.6)}>${T(B[0] + 3.5 * u, 250, '14 cm²', { size: 26, color: C.green })}</g>`
      + `<g class="p3" ${dl(1)}>${T(250, 252, '&lt;', { size: 32 })}</g>`
      + `<g class="p4" ${dl(.6)}>${T(470, 316, '넓이', { size: 30, color: C.green })}</g>`;
    put('5-1/수학/6/넓이', svg(id, body, motion(id) + `
      .sc-${id} .fillB{opacity:0}
      .on1 .sc-${id} .fillB{animation:${id}-peek 2.2s ease-in-out .4s both}
      .on1 .sc-${id} .slide{animation:${id}-over 2.2s ${MOVE} .4s both}
      @keyframes ${id}-over{0%,100%{transform:none}35%,65%{transform:translate(${A[0] - B[0]}px,${A[1] - B[1]}px)}}
      .on4 .sc-${id} .ga,.on4 .sc-${id} .gb{animation:${id}-blink 1.4s ease-in-out .2s both}
    `));
  }

  // 제곱센티미터: 한 변 1 cm 정사각형(크게 키워 봄) → 1 cm², 1 제곱센티미터 → 가로 4 cm, 세로 3 cm 메모지에 1 cm² 가 1~12 날아와 깔림 → 12 cm²
  {
    const id = 't51-m6-cm2';
    const q0 = [80, 90], S = 120, u = 45, M = [380, 100];
    let fly = '', k = 0;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++, k++) {
      const x = M[0] + c * u, y = M[1] + r * u;
      fly += `<g class="f3" ${dl(.15 + .1 * k, `--dx:${f(q0[0] + S / 2 - x - u / 2)}px;--dy:${f(q0[1] + S / 2 - y - u / 2)}px`)}><rect x="${x + 2}" y="${y + 2}" width="${u - 4}" height="${u - 4}" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>${T(x + u / 2, y + u / 2 + 7, k + 1, { size: 20, color: C.orange })}</g>`;
    }
    const body = `<rect x="${q0[0]}" y="${q0[1]}" width="${S}" height="${S}" fill="${C.peach}" stroke="${C.orange}" stroke-width="4"/>`
      + `<g class="s1" ${dl(.3)}>${T(q0[0] + S / 2, q0[1] + S + 30, '1 cm', { size: 22 })}${T(q0[0] - 10, q0[1] + S / 2 + 8, '1 cm', { size: 22, anchor: 'end' })}</g>`
      + `<g class="p2" ${dl(.2)}>${T(q0[0] + S / 2, q0[1] + S / 2 + 10, '1 cm²', { size: 30, color: C.orange })}</g>`
      + `<g class="s2" ${dl(.8)}>${T(q0[0] + S / 2, 290, '1 제곱센티미터', { size: 22, color: C.muted })}</g>`
      + `<g class="s3" ${dl(0)}><g class="blk"><rect x="${M[0]}" y="${M[1]}" width="${4 * u}" height="${3 * u}" fill="white" stroke="${C.ink}" stroke-width="3"/>${fly}</g>`
      + `${T(M[0] + 2 * u, M[1] - 12, '4 cm', { size: 22 })}${T(M[0] + 4 * u + 12, M[1] + 1.5 * u + 8, '3 cm', { size: 22, anchor: 'start' })}</g>`
      + `<g class="p4" ${dl(.3)}>${T(M[0] + 2 * u, 284, '12 cm²', { size: 32, color: C.green })}</g>`
      + `<g class="s4" ${dl(.8)}>${T(M[0] + 2 * u, 324, '4 × 3 = 12', { size: 22, color: C.muted })}</g>`;
    put('5-1/수학/6/제곱센티미터', svg(id, body, motion(id) + `
      .on4 .sc-${id} .blk{animation:${id}-blink 1.4s ease-in-out .2s both}
    `));
  }

  // 큰 넓이 단위(제곱미터·제곱킬로미터)를 같은 틀로: 큰 정사각형 → 한 줄이 채워짐(100개/1000개) → 줄이 아래로 채워짐(100줄/1000줄) → 관계 상자
  function bigUnit({ id, side, sub: small, n, fill, mesh, rel }) {
    const x0 = 90, y0 = 70, S = 220, IX = 372, IY = 40, cu = 30;
    let meshPath = '';
    if (mesh) {
      let d = '';
      for (let i = 1; i < n; i++) { const t = f(i * S / n); d += `M${x0 + t} ${y0} V${y0 + S} M${x0} ${y0 + t} H${x0 + S} `; }
      meshPath = `<path d="${d}" stroke="${C.line}" stroke-width=".5" fill="none"/>`;
    }
    let inset = '', rest = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const cell = `<rect x="${IX + c * cu}" y="${IY + r * cu}" width="${cu}" height="${cu}" fill="${C.peach}" stroke="${C.orange}" stroke-width="1.5"/>`;
      if (r === 0) inset += `<g class="s2" ${dl(1 + .15 * c)}>${cell}</g>`;
      else rest += `<g class="s3" ${dl(.4 + .25 * r)}>${cell}</g>`;
    }
    const corner = S / n * 4;
    const body = `<rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="white"/><g class="g2"><rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="${fill}"/></g>`
      + `<g class="s2" ${dl(.1)}>${meshPath}</g>`
      + `<g class="fillAll"><rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="${C.orange}" fill-opacity=".22"/></g>`
      + `<g class="strip"><rect x="${x0}" y="${y0}" width="${S}" height="${f(S / 100)}" fill="${C.orange}" stroke="${C.orange}" stroke-width="2"/></g>`
      + `<rect x="${x0}" y="${y0}" width="${S}" height="${S}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + `<g class="g2">${T(x0 + S / 2, y0 + S + 32, `1 ${side}`, { size: 22 })}${T(x0 - 10, y0 + S / 2 + 8, `1 ${side}`, { size: 22, anchor: 'end' })}`
      + `${T(x0 + S / 2, y0 + S / 2 + 6, `1 ${side}²`, { size: 36, color: C.blue })}${T(x0 + S / 2, y0 + S / 2 + 44, rel.read, { size: 20, color: C.muted })}</g>`
      + `<g class="s2" ${dl(.3)}>${T(x0 + S / 2, y0 + S + 32, `${n} ${small}`, { size: 22 })}${T(x0 - 10, y0 + S / 2 + 8, `${n} ${small}`, { size: 22, anchor: 'end' })}</g>`
      + `<g class="s2" ${dl(1.4)}>${TH(x0 + S / 2, y0 + 34, `${n}개`, { size: 22, color: C.orange })}</g>`
      + `<g class="s3" ${dl(1.4)}>${TH(x0 + S / 2, y0 + S / 2 + 10, `${n}줄`, { size: 26, color: C.orange })}</g>`
      // 모서리 확대
      + `<g class="s2" ${dl(.8)}><rect x="${x0}" y="${y0}" width="${f(Math.max(corner, 6))}" height="${f(Math.max(corner, 6))}" fill="none" stroke="${C.red}" stroke-width="2"/>`
      + `${ln([x0 + 6, y0], [IX, IY], C.muted, 1.5, 'stroke-dasharray="5 5"')}`
      + `<rect x="${IX}" y="${IY}" width="${4 * cu}" height="${4 * cu}" fill="white"/>${grid(IX, IY, 4, 4, cu, C.line, 1.5)}</g>`
      + inset + rest
      + `<g class="s2" ${dl(.8)}><rect x="${IX}" y="${IY}" width="${4 * cu}" height="${4 * cu}" fill="none" stroke="${C.red}" stroke-width="2"/>${T(IX + 2 * cu, IY + 4 * cu + 30, `한 칸 1 ${small}²`, { size: 20, color: C.orange })}</g>`
      + `<g class="s2" ${dl(1.6)}>${T(500, 238, `1 ${side} = ${n} ${small}`, { size: 22 })}</g>`
      + `<g class="s3" ${dl(1.6)}>${T(500, 274, `${n} × ${n} = ${n * n}`, { size: 21 })}</g>`
      + `<g class="p4" ${dl(.3)}><rect x="${rel.box[0]}" y="296" width="${rel.box[1]}" height="48" rx="10" fill="white" stroke="${C.green}" stroke-width="3"/>${T(rel.box[0] + rel.box[1] / 2, 328, `1 ${side}² = ${n * n} ${small}²`, { size: 23, color: C.green })}</g>`;
    return svg(id, body, motion(id) + `
      .sc-${id} .strip{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)}
      .on2 .sc-${id} .strip{transform:none;transition:transform 1s ease-in-out .3s}
      .sc-${id} .fillAll{transform-box:fill-box;transform-origin:50% 0;transform:scaleY(0)}
      .on3 .sc-${id} .fillAll{transform:none;transition:transform 1.2s ease-in-out .2s}
      .on4 .sc-${id} .fillAll{animation:${id}-blink 1.4s ease-in-out .2s both}
    `);
  }
  put('5-1/수학/6/제곱미터', bigUnit({ id: 't51-m6-m2', side: 'm', sub: 'cm', n: 100, fill: C.sky, mesh: true, rel: { read: '1 제곱미터', box: [360, 270] } }));
  put('5-1/수학/6/제곱킬로미터', bigUnit({ id: 't51-m6-km2', side: 'km', sub: 'm', n: 1000, fill: C.mint, mesh: false, rel: { read: '1 제곱킬로미터', box: [350, 286] } }));

  // 화살 머리(끝없이 뻗어 나감)
  const chev = (tip, dir, color = C.ink) => {
    const u = unit(dir), v = [-u[1], u[0]];
    const a = add(add(tip, mul(u, -13)), mul(v, 12)), b = add(add(tip, mul(u, -13)), mul(v, -12));
    return `<g class="cv" style="--tx:${f(u[0] * 16)}px;--ty:${f(u[1] * 16)}px"><path d="M${P(a)} L${P(tip)} L${P(b)}" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  };
  const chevCss = (id) => `.sc-${id} .cv{animation:${id}-cv 1.5s ease-in infinite}@keyframes ${id}-cv{0%{transform:translate(0,0);opacity:0}30%{opacity:1}100%{transform:translate(var(--tx),var(--ty));opacity:0}}`;

  // 평행: 직선 가, 나가 양쪽으로 늘어나도 안 만남 → 두 곳에서 잰 거리 3 cm → 밑변 4 cm 삼각형 셋, 꼭짓점은 가 위·밑변은 나 위 → 넓이 모두 6 cm²
  {
    const id = 't51-m6-pyeonghaeng';
    const y1 = 110, y2 = 200;
    const tris = [[[50, y2], [170, y2], [50, y1]], [[250, y2], [370, y2], [310, y1]], [[430, y2], [550, y2], [600, y1]]];
    const cols = [[C.sky, C.blue], [C.mint, C.green], [C.peach, C.orange]];
    const gapAt = (x, d) => `<g class="p2" ${dl(d)}>${ln([x, y1 + 3], [x, y2 - 3], C.purple, 4)}${T(x + 7, (y1 + y2) / 2 + 8, '3 cm', { size: 20, color: C.purple, anchor: 'start' })}</g>`;
    const body = `<g class="grow">${ln([0, y1], [640, y1], C.ink, 5)}${ln([0, y2], [640, y2], C.ink, 5)}</g>`
      + `<g class="s1" ${dl(1.3)}>${chev([24, y1], [-1, 0])}${chev([616, y1], [1, 0])}${chev([24, y2], [-1, 0])}${chev([616, y2], [1, 0])}</g>`
      + T(22, y1 - 22, '가', { size: 22 }) + T(22, y2 - 22, '나', { size: 22 })
      + tris.map((t, i) => `<g class="p3" ${dl(.2 + .4 * i)}><g class="blk">${poly(t, FILL(cols[i][0], cols[i][1], 3.5))}</g>`
        + `${i ? dash(t[2], [t[2][0], y2], cols[i][1]) : ''}${rmark([t[2][0], y2], i === 2 ? [0, y2] : [640, y2], [t[2][0], 0], { s: 14, color: cols[i][1] })}`
        + `${T((t[0][0] + t[1][0]) / 2, y2 + 28, '4 cm', { size: 20, color: cols[i][1] })}</g>`).join('')
      + gapAt(210, .3) + gapAt(400, .7)
      + tris.map((t, i) => `<g class="p4" ${dl(.2 + .3 * i)}>${T((t[0][0] + t[1][0]) / 2, y2 + 64, '6 cm²', { size: 24, color: cols[i][1] })}</g>`).join('')
      + `<g class="s4" ${dl(1.2)}>${T(320, 326, '4 × 3 ÷ 2 = 6 (cm²)', { size: 24, color: C.green })}</g>`;
    put('5-1/수학/6/평행', svg(id, body, motion(id) + chevCss(id) + `
      .sc-${id} .grow{transform-box:view-box;transform-origin:320px 0;transform:scaleX(.35)}
      .on1 .sc-${id} .grow{transform:none;transition:transform 1.2s ease-in-out .2s}
      .on4 .sc-${id} .blk{animation:${id}-blink 1.4s ease-in-out .2s both}
    `));
  }

  // 수직: 삼각형의 아래 변을 밑변으로 → 삼각자가 밀려와 직각을 대고 꼭짓점에서 밑변까지 선분 → 직각 표시·90°, '서로 수직' → 그 선분이 '높이'
  {
    const id = 't51-m6-sujik';
    const Pp = [140, 280], Q = [460, 280], R = [250, 90], F = [250, 280];
    const ruler = `<path d="M250 280 L250 128 L372 280 Z" fill="${C.lilac}" fill-opacity=".9" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M264 266 L264 172 L340 266 Z" fill="${C.paper}" stroke="${C.purple}" stroke-width="2" stroke-linejoin="round"/>`;
    const body = poly([Pp, Q, R], FILL(C.mint, C.ink, 4))
      + drawn([Pp, Q], 1, .3, C.orange, 7)
      + `<g class="s1" ${dl(.9)}>${T(300, 314, '밑변', { size: 24, color: C.orange })}</g>`
      + `<g class="g3"><g class="s2"><g class="ruler">${ruler}</g></g></g>`
      + drawn([R, F], 2, 1.1, C.ink, 4)
      + `<g class="p2" ${dl(1.8)}><g class="k3" ${dl(.2)}>${rmark(F, [640, 280], [250, 0], { s: 20 })}</g></g>`
      + `<g class="p3" ${dl(.3)}>${T(280, 262, '90°', { size: 22, color: C.red, anchor: 'start' })}</g>`
      + `<g class="p3" ${dl(.9)}>${T(500, 150, '서로 수직', { size: 28, color: C.green })}</g>`
      + `<g class="s4" ${dl(.1)}><g class="k4" ${dl(.4)}>${ln(R, F, C.blue, 6)}</g></g>`
      + `<g class="p4" ${dl(.5)}>${T(240, 196, '높이', { size: 22, color: C.blue, anchor: 'end' })}</g>`;
    put('5-1/수학/6/수직', svg(id, body, motion(id) + `
      .sc-${id} .ruler{transform:translateX(260px)}
      .on2 .sc-${id} .ruler{transform:none;transition:transform .9s ease-out .1s}
    `));
  }

  // 평행사변형: 모눈 위 밑변 6 cm, 높이 4 cm → 높이를 따라 자른 왼쪽 삼각형 → 오른쪽으로 옮겨 붙여 직사각형 → 6 × 4 = 24
  {
    const id = 't51-m6-pyeongsa';
    const A = [60, 250], B = [240, 250], Cc = [300, 130], D = [120, 130], E = [120, 250];
    const body = grid(30, 100, 10, 6, 30)
      + `${poly([E, B, Cc, D], FILL(C.mint))}<path d="${pathOf([E, B, Cc, D])}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round" fill="none"/>`
      + `<g class="cut"><g class="wig">${poly([A, E, D], FILL(C.mint))}<path d="${pathOf([D, A, E])}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round" fill="none"/>`
      + `<g class="s2" ${dl(1)}>${ln(D, E, C.red, 4)}</g></g></g>`
      + `<g class="g2">${dash(D, E, C.blue, 3)}</g>`
      + drawn([D, E], 2, .2, C.red, 4)
      + `${TH(126, 196, '높이 4 cm', { size: 20, color: C.blue, anchor: 'start' })}${TH(180, 276, '밑변 6 cm', { size: 20, color: C.orange })}`
      + `<g class="g3"><g class="s1" ${dl(.4)}>${ln(A, B, C.orange, 5)}</g></g>`
      + `<g class="p3" ${dl(1.2)}>${T(490, 110, '직사각형', { size: 26, color: C.green })}</g>`
      + `<g class="s3" ${dl(1.5)}>${T(490, 152, '가로 = 밑변', { size: 22 })}${T(490, 188, '세로 = 높이', { size: 22 })}</g>`
      + `<g class="s4" ${dl(.2)}>${T(490, 244, '밑변 × 높이', { size: 22, color: C.muted })}</g>`
      + `<g class="p4" ${dl(.7)}>${T(490, 288, '6 × 4 = 24 (cm²)', { size: 26, color: C.green })}</g>`;
    put('5-1/수학/6/평행사변형', svg(id, body, motion(id) + `
      .on2 .sc-${id} .wig{transform:translateX(-16px);transition:transform .5s ease-out 1s}
      .on3 .sc-${id} .wig{transform:none;transition:transform .4s ease .1s}
      .on3 .sc-${id} .cut{transform:translateX(180px);transition:transform 1.2s ${MOVE} .1s}
      .on4 .sc-${id} .cut{animation:${id}-blink 1.4s ease-in-out .2s both}
    `));
  }

  // 사다리꼴: 윗변 4 cm, 아랫변 6 cm, 높이 5 cm → 똑같은 사다리꼴을 돌려 붙임 → 밑변 4 + 6 = 10 cm 평행사변형, 10 × 5 = 50 → 그 반 25
  {
    const id = 't51-m6-sadari';
    const u = 30, X = (x) => 40 + u * x, Y = (y) => 270 - u * y;
    const A = [X(0), Y(0)], B = [X(6), Y(0)], Cc = [X(5), Y(5)], D = [X(1), Y(5)];
    const M = mid(B, Cc);
    const trap = (fill) => poly([A, B, Cc, D], FILL(fill)) + ln(A, D, C.ink, 4) + ln(B, Cc, C.ink, 4) + ln(D, Cc, C.orange, 6) + ln(A, B, C.blue, 6);
    const body = `<g class="cp">${trap(C.sky)}</g>`
      + `<g class="orig">${trap(C.mint)}</g>`
      + `${dash([X(2), Y(5)], [X(2), Y(0)], C.purple)}${T(X(2) + 6, Y(2.5) + 8, '5 cm', { size: 20, color: C.purple, anchor: 'start' })}`
      + `${T(X(3), Y(5) - 12, '윗변 4 cm', { size: 20, color: C.orange })}${T(X(3), Y(0) + 28, '아랫변 6 cm', { size: 20, color: C.blue })}`
      + `<g class="s3" ${dl(.1)}>${T(X(8), Y(0) + 28, '4 cm', { size: 20, color: C.orange })}</g>`
      + `<g class="s3" ${dl(.5)}>${brace(X(0), X(10), Y(0) + 44)}${T(X(5), Y(0) + 70, '4 + 6 = 10 (cm)', { size: 20, color: C.green })}</g>`
      + `<g class="p3" ${dl(1)}>${T(515, 150, '10 × 5 = 50', { size: 24 })}</g>`
      + `<g class="s4" ${dl(.4)}>${T(515, 210, '(4 + 6) × 5 ÷ 2', { size: 24 })}</g>`
      + `<g class="p4" ${dl(1)}>${T(515, 254, '= 25 (cm²)', { size: 26, color: C.green })}</g>`;
    put('5-1/수학/6/사다리꼴', svg(id, body, motion(id) + `
      .sc-${id} .cp{opacity:0;transform-box:view-box;transform-origin:${f(M[0])}px ${f(M[1])}px}
      .on2 .sc-${id} .cp{animation:${id}-turn 1.8s ${MOVE} .2s both}
      @keyframes ${id}-turn{0%{opacity:0;transform:translate(0,-24px)}20%{opacity:1;transform:translate(0,-24px)}100%{opacity:1;transform:rotate(180deg)}}
      .on4 .sc-${id} .cp{animation:none;opacity:.3;transform:rotate(180deg);transition:opacity .4s}
      .on4 .sc-${id} .orig{animation:${id}-blink 1.4s ease-in-out .4s both}
    `));
  }

  // 마름모: 두 대각선 8 cm, 6 cm → 바깥에 삼각형 넷이 날아와 붙어 직사각형 → 가로·세로가 대각선, 8 × 6 = 48 → 삼각형이 빠지고 8 × 6 ÷ 2 = 24
  {
    const id = 't51-m6-mareummo';
    const O = [180, 190], L = [60, 190], R = [300, 190], Tp = [180, 100], Bt = [180, 280];
    const c = [[60, 100], [300, 100], [300, 280], [60, 280]];
    const corners = [[c[0], Tp, L, -50, -40], [c[1], R, Tp, 50, -40], [c[2], Bt, R, 50, 40], [c[3], L, Bt, -50, 40]];
    const body = `<g class="g4">${corners.map(([k, p, q, dx, dy], i) => `<g class="f2" ${dl(.2 + .3 * i, `--dx:${dx}px;--dy:${dy}px`)}>${poly([k, p, q], FILL(C.sky, C.blue, 2.5))}</g>`).join('')}</g>`
      + `<g class="blk">${poly([L, Tp, R, Bt], FILL(C.mint, C.ink, 4))}</g>`
      + `${ln(L, R, C.purple, 3.5)}${ln(Tp, Bt, C.purple, 3.5)}`
      + `${TH(232, 182, '8 cm', { size: 20, color: C.purple })}${TH(188, 150, '6 cm', { size: 20, color: C.purple, anchor: 'start' })}`
      + drawn([...c, c[0]], 3, .1, C.green, 4)
      + `<g class="s3" ${dl(.8)}>${T(180, 88, '8 cm', { size: 22, color: C.green })}${T(312, 198, '6 cm', { size: 22, color: C.green, anchor: 'start' })}</g>`
      + `<g class="p3" ${dl(1.2)}>${T(500, 150, '8 × 6 = 48', { size: 24 })}</g>`
      + `<g class="s4" ${dl(.5)}>${T(500, 214, '8 × 6 ÷ 2', { size: 24 })}</g>`
      + `<g class="p4" ${dl(1)}>${T(500, 258, '= 24 (cm²)', { size: 26, color: C.green })}</g>`;
    put('5-1/수학/6/마름모', svg(id, body, motion(id) + `
      .on4 .sc-${id} .blk{animation:${id}-blink 1.4s ease-in-out .5s both}
    `));
  }

  // 대각선: 사다리꼴 꼭짓점 넷 → 이웃하지 않는 두 꼭짓점을 잇는 선 → 삼각형 2개로 나뉘어 벌어짐 → 12 + 8 = 20 → 다시 붙고 '대각선'
  {
    const id = 't51-m6-daegak';
    const u = 36, A = [60, 280], B = [276, 280], Cc = [240, 136], D = [96, 136];
    const diag = drawn([D, B], 1, .9, C.red, 5);
    const body = `<g class="t1">${poly([A, B, D], FILL(C.sky))}<path d="${pathOf([D, A, B])}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round" fill="none"/><g class="blk">${diag}</g>`
      + `<g class="s3" ${dl(.2)}>${dash(D, [96, 280], C.blue)}${T(102, 222, '4 cm', { size: 20, color: C.blue, anchor: 'start' })}${T(168, 308, '6 cm', { size: 20, color: C.blue })}</g></g>`
      + `<g class="t2">${poly([D, B, Cc], FILL(C.peach))}<path d="${pathOf([B, Cc, D])}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round" fill="none"/><g class="blk">${diag}</g>`
      + `<g class="s3" ${dl(.6)}>${T(168, 124, '4 cm', { size: 20, color: C.orange })}</g></g>`
      + `<g class="g2">${[A, B, Cc, D].map((p, i) => `<g class="p1" ${dl(.1 + .15 * i)}><circle cx="${p[0]}" cy="${p[1]}" r="8" fill="${C.ink}"/></g>`).join('')}</g>`
      + `<g class="g2"><g class="s1" ${dl(1.5)}>${T(212, 194, '대각선', { size: 22, color: C.red })}</g></g>`
      + `<g class="s3" ${dl(.4)}>${T(470, 130, '6 × 4 ÷ 2 = 12', { size: 22, color: C.blue })}</g>`
      + `<g class="s3" ${dl(.9)}>${T(470, 172, '4 × 4 ÷ 2 = 8', { size: 22, color: C.orange })}</g>`
      + `<g class="s3" ${dl(1.5)}>${T(470, 226, '12 + 8 = 20 (cm²)', { size: 24, color: C.green })}</g>`
      + `<g class="p4" ${dl(1)}>${T(212, 194, '대각선', { size: 22, color: C.red })}</g>`;
    put('5-1/수학/6/대각선', svg(id, body, motion(id) + `
      .on2 .sc-${id} .t1{transform:translate(-16px,14px);transition:transform 1s ${MOVE} .2s}
      .on2 .sc-${id} .t2{transform:translate(16px,-14px);transition:transform 1s ${MOVE} .2s}
      .on4 .sc-${id} .t1,.on4 .sc-${id} .t2{transform:none;transition:transform .9s ${MOVE} .1s}
      .on4 .sc-${id} .blk{animation:${id}-blink 1.4s ease-in-out .8s both}
    `));
  }

  // 밑변: 평행사변형의 평행한 두 변이 밑변(주황), 그 사이 높이 → 삼각형은 아래 변을 밑변으로 정하고 높이 → 왼쪽 변을 밑변으로 정하면 높이도 바뀜
  {
    const id = 't51-m6-mitbyeon';
    const A = [30, 280], B = [230, 280], Cc = [290, 150], D = [90, 150];
    const Pp = [350, 290], Q = [610, 290], R = [500, 100];
    const d = sub(R, Pp), t = ((Q[0] - Pp[0]) * d[0] + (Q[1] - Pp[1]) * d[1]) / (d[0] * d[0] + d[1] * d[1]);
    const F = add(Pp, mul(d, t)), F0 = [R[0], Pp[1]];
    const tc = center([Pp, Q, R]);
    const prLab = sideAt(Pp, R, tc, 28), qfLab = add(mid(Q, F), mul(unit([-(F[1] - Q[1]), F[0] - Q[0]]), -26));
    const body = poly([A, B, Cc, D], FILL(C.mint, C.ink, 4))
      + `<g class="k4" ${dl(.2)}>${drawn([D, Cc], 1, .2, C.orange, 7)}${drawn([A, B], 1, .5, C.orange, 7)}</g>`
      + `<g class="s1" ${dl(1)}>${T(190, 138, '밑변', { size: 22, color: C.orange })}${T(130, 312, '밑변', { size: 22, color: C.orange })}`
      + `${dash([150, 150], [150, 280])}${rmark([150, 280], [640, 280], [150, 0], { s: 14, color: C.blue })}${T(158, 222, '높이', { size: 20, color: C.blue, anchor: 'start' })}</g>`
      + `<g class="s2" ${dl(0)}>${poly([Pp, Q, R], FILL(C.peach, C.ink, 4))}</g>`
      + `<g class="g3">${drawn([Pp, Q], 2, .4, C.orange, 7)}<g class="s2" ${dl(1)}>${T(480, 322, '밑변', { size: 22, color: C.orange })}`
      + `${dash(R, F0)}${rmark(F0, [640, 290], [500, 0], { s: 14, color: C.blue })}${T(508, 210, '높이', { size: 20, color: C.blue, anchor: 'start' })}</g></g>`
      + `<g class="k4" ${dl(.2)}>${drawn([Pp, R], 3, .3, C.orange, 7)}</g>`
      + `<g class="s3" ${dl(.9)}>${T(prLab[0], prLab[1] + 8, '밑변', { size: 22, color: C.orange })}`
      + `${dash(Q, F)}${rmark(F, Q, R, { s: 14, color: C.blue })}${T(qfLab[0], qfLab[1] + 7, '높이', { size: 20, color: C.blue })}</g>`;
    put('5-1/수학/6/밑변', svg(id, body, motion(id)));
  }

  // 높이: 평행사변형 두 밑변 사이에 수직인 선분 4 cm → 다른 두 곳에서 재도 4 cm, 비스듬한 변은 5 cm → 삼각형: 꼭짓점에서 밑변(늘인 선)에 수직, 밖에 있는 높이
  {
    const id = 't51-m6-nopi';
    const A = [100, 290], B = [340, 290], Cc = [460, 130], D = [220, 130];
    const h = (x) => `${dash([x, 130], [x, 290])}${rmark([x, 290], [0, 290], [x, 0], { s: 14, color: C.blue })}`;
    const Pp = [140, 290], Q = [340, 290], R = [480, 120], F = [480, 290];
    const body = `<g class="g3">${poly([A, B, Cc, D], FILL(C.mint, C.ink, 4))}${ln(D, Cc, C.orange, 6)}${ln(A, B, C.orange, 6)}`
      + `${T(340, 118, '밑변', { size: 20, color: C.orange })}${T(220, 320, '밑변', { size: 20, color: C.orange })}`
      + `<g class="s1" ${dl(.3)}>${h(220)}</g>`
      + `<g class="g2"><g class="s1" ${dl(.9)}>${T(226, 216, '높이 4 cm', { size: 20, color: C.blue, anchor: 'start' })}</g></g>`
      + `<g class="s2" ${dl(.1)}>${T(226, 216, '4 cm', { size: 20, color: C.blue, anchor: 'start' })}</g>`
      + `<g class="f2" ${dl(.3, '--dx:-60px;--dy:0px')}>${h(280)}${T(286, 216, '4 cm', { size: 20, color: C.blue, anchor: 'start' })}</g>`
      + `<g class="f2" ${dl(.7, '--dx:-120px;--dy:0px')}>${h(340)}${T(346, 216, '4 cm', { size: 20, color: C.blue, anchor: 'start' })}</g>`
      + `<g class="s2" ${dl(1.4)}><g class="k2" ${dl(1.5)}>${ln(A, D, C.red, 6)}</g>${T(146, 214, '5 cm', { size: 20, color: C.red, anchor: 'end' })}</g></g>`
      + `<g class="s3" ${dl(.4)}><g class="blk">${poly([Pp, Q, R], FILL(C.peach, C.ink, 4))}</g>${ln(Pp, Q, C.orange, 6)}${dash(Q, [520, 290], C.muted)}`
      + `${T(240, 320, '밑변', { size: 20, color: C.orange })}</g>`
      + `<g class="s3" ${dl(1)}><g class="k4" ${dl(.2)}>${ln(R, F, C.blue, 4, 'stroke-dasharray="8 6" stroke-linecap="butt"')}${rmark(F, [0, 290], [480, 0], { s: 14, color: C.blue })}</g></g>`
      + `<g class="p3" ${dl(1.5)}>${T(492, 214, '높이', { size: 22, color: C.blue, anchor: 'start' })}</g>`;
    put('5-1/수학/6/높이', svg(id, body, motion(id) + `
      .on4 .sc-${id} .blk{animation:${id}-blink 1.4s ease-in-out .2s both}
    `));
  }

  // 윗변: 사다리꼴의 평행한 두 변이 밑변 → 위쪽이 윗변 4 cm, 아래쪽이 아랫변 6 cm → 위가 넓은 사다리꼴도 위에 놓인 변이 윗변 → 넓이 공식 속 윗변
  {
    const id = 't51-m6-witbyeon';
    const A = [50, 260], B = [266, 260], Cc = [230, 120], D = [86, 120];
    const A2 = [416, 260], B2 = [560, 260], C2 = [596, 110], D2 = [380, 110];
    const body = poly([A, B, Cc, D], FILL(C.mint, C.ink, 4))
      + `<g class="g2"><g class="q1" ${dl(.4)}>${ln(D, Cc, C.purple, 7)}${ln(A, B, C.purple, 7)}</g><g class="s1" ${dl(1.2)}>${ln(D, Cc, C.purple, 4)}${ln(A, B, C.purple, 4)}${T(158, 106, '밑변', { size: 22, color: C.purple })}${T(158, 292, '밑변', { size: 22, color: C.purple })}</g></g>`
      + `<g class="k4" ${dl(.2)}>${drawn([D, Cc], 2, .3, C.orange, 7)}</g>${drawn([A, B], 2, .9, C.blue, 7)}`
      + `<g class="p2" ${dl(.6)}>${T(158, 106, '윗변 4 cm', { size: 22, color: C.orange })}</g>`
      + `<g class="p2" ${dl(1.2)}>${T(158, 292, '아랫변 6 cm', { size: 22, color: C.blue })}</g>`
      + `<g class="f3" ${dl(.2, '--dx:200px;--dy:0px')}>${poly([A2, B2, C2, D2], FILL(C.peach, C.ink, 4))}<g class="k4" ${dl(0)}>${ln(D2, C2, C.orange, 7)}</g>${ln(A2, B2, C.blue, 7)}</g>`
      + `<g class="p3" ${dl(.9)}>${T(488, 96, '윗변 12 cm', { size: 22, color: C.orange })}</g>`
      + `<g class="p3" ${dl(1.2)}>${T(488, 292, '아랫변 8 cm', { size: 22, color: C.blue })}</g>`
      + `<g class="s4" ${dl(.8)}>${T(320, 338, '(윗변 + 아랫변) × 높이 ÷ 2', { size: 22, color: C.green })}</g>`;
    put('5-1/수학/6/윗변', svg(id, body, motion(id)));
  }

  // 아랫변: 아래쪽 변이 아랫변 6 cm(위쪽 윗변 4 cm) → 두 변이 아래로 날아와 이어져 4 + 6 = 10 cm → 높이 5 cm, (4 + 6) × 5 ÷ 2 = 25 → 아랫변 반짝임
  {
    const id = 't51-m6-araetbyeon';
    const A = [60, 230], B = [240, 230], Cc = [210, 80], D = [90, 80];
    const by = 296;
    const body = poly([A, B, Cc, D], FILL(C.mint, C.ink, 4))
      + `${ln(D, Cc, C.orange, 6)}${T(150, 66, '윗변 4 cm', { size: 20, color: C.orange })}`
      + `<g class="k4" ${dl(.2)}>${drawn([A, B], 1, .3, C.blue, 7)}</g>`
      + `<g class="p1" ${dl(1)}>${T(150, 260, '아랫변 6 cm', { size: 22, color: C.blue })}</g>`
      + `<g class="f2" ${dl(.2, '--dx:30px;--dy:-216px')}>${ln([60, by], [180, by], C.orange, 10, 'stroke-linecap="butt"')}</g>`
      + `<g class="f2" ${dl(.7, '--dx:-120px;--dy:-66px')}><g class="k4" ${dl(.2)}>${ln([180, by], [360, by], C.blue, 10, 'stroke-linecap="butt"')}</g></g>`
      + `<g class="s2" ${dl(1.3)}>${brace(60, 360, by + 18)}${T(210, by + 46, '10 cm', { size: 20, color: C.green })}</g>`
      + `<g class="s2" ${dl(1.4)}>${T(515, 120, '4 + 6 = 10 (cm)', { size: 22 })}</g>`
      + `<g class="s3" ${dl(.2)}>${dash([120, 80], [120, 230], C.purple)}${T(126, 162, '5 cm', { size: 20, color: C.purple, anchor: 'start' })}</g>`
      + `<g class="s3" ${dl(.7)}>${T(515, 180, '(4 + 6) × 5 ÷ 2', { size: 24 })}</g>`
      + `<g class="p3" ${dl(1.3)}>${T(515, 224, '= 25 (cm²)', { size: 26, color: C.green })}</g>`;
    put('5-1/수학/6/아랫변', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
