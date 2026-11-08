// 수학 6-1 6단원 직육면체의 겉넓이와 부피: 낱말 도식
// 입체는 비스듬히 본 겨냥도로 그린다. 점 (x 가로, y 높이, z 세로=안쪽) → 화면 (ox + s·x + KX·s·z, oy − s·y − KY·s·z).
// 보이지 않는 모서리는 점선. 마주 보는 면끼리 같은 색(앞·뒤 하늘, 위·아래 살구, 왼쪽·오른쪽 민트).
// 겉넓이의 펼치기: 전개도 자리의 직사각형마다 상자 면(평행사변형)으로 보내는 matrix 를 주고, 열쇠틀로 matrix 를 조금씩 풀어 전개도로 편다.
// 브라우저가 matrix 사이를 분해해 이으면 뒤집힌 면이 엉뚱하게 돌므로 열쇠 사이는 잇지 않는다(step-end, 6-2 math-6 과 같은 방법).
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(2);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임(N 은 칸 번호). sN 나타나기, pN 튀어나오기, kN 깜빡이기(보이던 것), qN 잠깐 나타났다 사라지기,
  // fN 날아오기(--dx,--dy 에서 제자리로), dN 선 그리기(class="dr dN" pathLength="100"), gN 사라지기. 한 요소에 움직임 하나만.
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.f1,.f2,.f3,.f4,.q1,.q2,.q3,.q4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100;stroke-dashoffset:100}
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
    .on${n} .sc-${id} .f${n}{animation:${id}-fly .45s cubic-bezier(.5,0,.8,.6) both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0;transition:stroke-dashoffset .8s ease-in-out}
    .on${n} .sc-${id} .g${n}{opacity:0}`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const poly = (pts, attr) => `<polygon points="${pts.map(P).join(' ')}" ${attr}/>`;
  const KX = 0.45, KY = 0.32;
  const proj = (ox, oy, s) => (x, y, z) => [ox + s * x + KX * s * z, oy - s * y - KY * s * z];
  const INK = `stroke="${C.ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none"`;
  const DASH = `stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"`;
  const PAIR = { fb: [C.sky, C.blue], tb: [C.peach, C.orange], lr: [C.mint, C.green] };
  // 상자: 면 꼭짓점과 모서리
  function box(S, a, b, c) {
    const v = (x, y, z) => S(x, y, z);
    const faces = {
      front: [v(0, 0, 0), v(a, 0, 0), v(a, c, 0), v(0, c, 0)],
      top: [v(0, c, 0), v(a, c, 0), v(a, c, b), v(0, c, b)],
      right: [v(a, 0, 0), v(a, 0, b), v(a, c, b), v(a, c, 0)],
      back: [v(0, 0, b), v(a, 0, b), v(a, c, b), v(0, c, b)],
      bottom: [v(0, 0, 0), v(a, 0, 0), v(a, 0, b), v(0, 0, b)],
      left: [v(0, 0, 0), v(0, 0, b), v(0, c, b), v(0, c, 0)]
    };
    const vis = `M${P(v(0, 0, 0))} L${P(v(a, 0, 0))} L${P(v(a, c, 0))} L${P(v(0, c, 0))} Z M${P(v(0, c, 0))} L${P(v(0, c, b))} L${P(v(a, c, b))} L${P(v(a, c, 0))} M${P(v(a, 0, 0))} L${P(v(a, 0, b))} L${P(v(a, c, b))}`;
    const hid = `M${P(v(0, 0, b))} L${P(v(a, 0, b))} M${P(v(0, 0, b))} L${P(v(0, c, b))} M${P(v(0, 0, b))} L${P(v(0, 0, 0))}`;
    return { faces, vis, hid, v };
  }
  const mid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

  // 직육면체: 상자 겨냥도 → 여섯 면이 하나씩 빛나며 오른쪽에 같은 색 직사각형 1~6 → 직사각형 6개가 깜빡이고 '직육면체'
  {
    const id = 't61-m6-jikyuk';
    const S = proj(40, 282, 36);
    const B = box(S, 5, 3, 4);
    const order = [['front', 'fb'], ['top', 'tb'], ['right', 'lr'], ['back', 'fb'], ['bottom', 'tb'], ['left', 'lr']];
    const flat = { front: [350, 24, 110, 88], back: [490, 24, 110, 88], top: [350, 126, 110, 66], bottom: [490, 126, 110, 66], right: [372, 206, 66, 88], left: [512, 206, 66, 88] };
    const hiddenFlash = order.map(([k, pr], i) => i < 3 ? '' : `<g class="q2" ${dl(.3 + .36 * i)}>${poly(B.faces[k], `fill="${PAIR[pr][0]}" fill-opacity=".85" stroke="${PAIR[pr][1]}" stroke-width="4" stroke-dasharray="7 5"`)}</g>`).join('');
    const visFlash = order.map(([k, pr], i) => i >= 3 ? '' : `<g class="q2" ${dl(.3 + .36 * i)}>${poly(B.faces[k], `fill="none" stroke="${PAIR[pr][1]}" stroke-width="6"`)}</g>`).join('');
    const rects = order.map(([k, pr], i) => {
      const [x, y, w, h] = flat[k];
      return `<g class="p2" ${dl(.4 + .36 * i)}><g class="k3" ${dl(.2 + .12 * i)}><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAIR[pr][0]}" stroke="${PAIR[pr][1]}" stroke-width="3"/>${T(x + w / 2, y + h / 2 + 8, i + 1, { size: 22, color: PAIR[pr][1] })}</g></g>`;
    }).join('');
    const body = poly(B.faces.front, `fill="${C.sky}"`) + poly(B.faces.top, `fill="${C.peach}"`) + poly(B.faces.right, `fill="${C.mint}"`)
      + `<path class="dr d1" pathLength="100" d="${B.vis}" ${INK}/>`
      + `<g class="s1" ${dl(.9)}><path d="${B.hid}" ${DASH}/></g>`
      + hiddenFlash + visFlash
      + order.slice(0, 3).map(([k, pr], i) => { const m = mid(B.faces[k]); return `<g class="p2" ${dl(.3 + .36 * i)}>${T(m[0], m[1] + 8, i + 1, { size: 22, color: PAIR[pr][1] })}</g>`; }).join('')
      + rects
      + `<g class="p3" ${dl(1)}>${T(475, 334, '직사각형 6개', { size: 24, color: C.ink })}</g>`
      + `<g class="p3" ${dl(1.5)}>${T(155, 330, '직육면체', { size: 28, color: C.green })}</g>`;
    put('6-1/수학/6/직육면체', svg(id, body, motion(id)));
  }

  // 정육면체: 정육면체 겨냥도 → 열두 모서리에 같은 길이 표시 → 전개도 자리에 정사각형 6개 → 깜빡이고 '정육면체'
  {
    const id = 't61-m6-jeongyuk';
    const S = proj(50, 288, 52);
    const n = 3;
    const B = box(S, n, n, n);
    const v = B.v;
    const edges = [
      [[0, 0, 0], [n, 0, 0]], [[n, 0, 0], [n, n, 0]], [[n, n, 0], [0, n, 0]], [[0, n, 0], [0, 0, 0]],
      [[0, n, 0], [0, n, n]], [[n, n, 0], [n, n, n]], [[n, 0, 0], [n, 0, n]], [[0, n, n], [n, n, n]], [[n, 0, n], [n, n, n]],
      [[0, 0, n], [n, 0, n]], [[0, 0, n], [0, n, n]], [[0, 0, n], [0, 0, 0]]
    ];
    const ticks = edges.map(([p, q], i) => {
      const A = v(...p), Bq = v(...q), m = [(A[0] + Bq[0]) / 2, (A[1] + Bq[1]) / 2];
      const dx = Bq[0] - A[0], dy = Bq[1] - A[1], L = Math.hypot(dx, dy), nx = -dy / L * 9, ny = dx / L * 9;
      return `<g class="p2" ${dl(.2 + .12 * i)}><path d="M${f(m[0] - nx)} ${f(m[1] - ny)} L${f(m[0] + nx)} ${f(m[1] + ny)}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round" ${i >= 9 ? 'opacity=".6"' : ''}/></g>`;
    }).join('');
    const u = 60, x0 = 360, y0 = 54;
    const cells = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]];
    const cols = [C.peach, C.mint, C.sky, C.mint, C.sky, C.peach], strokes = [C.orange, C.green, C.blue, C.green, C.blue, C.orange];
    const net = cells.map(([c, r], i) => `<g class="p3" ${dl(.2 + .22 * i)}><g class="k4" ${dl(.2)}><rect x="${x0 + u * c}" y="${y0 + u * r}" width="${u}" height="${u}" fill="${cols[i]}" stroke="${strokes[i]}" stroke-width="3"/>${T(x0 + u * c + u / 2, y0 + u * r + u / 2 + 8, i + 1, { size: 22, color: strokes[i] })}</g></g>`).join('');
    const body = poly(B.faces.front, `fill="${C.sky}"`) + poly(B.faces.top, `fill="${C.peach}"`) + poly(B.faces.right, `fill="${C.mint}"`)
      + `<path class="dr d1" pathLength="100" d="${B.vis}" ${INK}/>`
      + `<g class="s1" ${dl(.9)}><path d="${B.hid}" ${DASH}/></g>`
      + ticks + net
      + `<g class="p4" ${dl(.6)}>${T(480, 290, '정사각형 6개', { size: 24 })}</g>`
      + `<g class="p4" ${dl(1.1)}>${T(168, 346, '정육면체', { size: 28, color: C.green })}</g>`;
    put('6-1/수학/6/정육면체', svg(id, body, motion(id)));
  }

  // 겉넓이: 가로 5 cm, 세로 4 cm, 높이 6 cm 상자 → 펼쳐 전개도 → 면마다 넓이 20·24·30 cm² → (20 + 24 + 30) × 2 = 148, '겉넓이'
  {
    const id = 't61-m6-geot';
    const s = 20, a = 5, b = 4, c = 6;
    const S = proj(70, 262, s);
    const W = a * s, Dd = b * s, H = c * s; // 85, 68, 102
    const NX = 350, NY = 120;
    // 전개도 자리 [x, y, w, h] 와 상자에서의 왼쪽 위 꼭짓점·가로 벡터·세로 벡터
    const v = (x, y, z) => S(x, y, z);
    const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
    const faces = [
      ['back', 'fb', [NX + W + Dd, NY, W, H], v(a, c, b), sub(v(0, c, b), v(a, c, b)), sub(v(a, 0, b), v(a, c, b))],
      ['left', 'lr', [NX - Dd, NY, Dd, H], v(0, c, b), sub(v(0, c, 0), v(0, c, b)), sub(v(0, 0, b), v(0, c, b))],
      ['bottom', 'tb', [NX, NY + H, W, Dd], v(0, 0, 0), sub(v(a, 0, 0), v(0, 0, 0)), sub(v(0, 0, b), v(0, 0, 0))],
      ['top', 'tb', [NX, NY - Dd, W, Dd], v(0, c, b), sub(v(a, c, b), v(0, c, b)), sub(v(0, c, 0), v(0, c, b))],
      ['right', 'lr', [NX + W, NY, Dd, H], v(a, c, 0), sub(v(a, c, b), v(a, c, 0)), sub(v(a, 0, 0), v(a, c, 0))],
      ['front', 'fb', [NX, NY, W, H], v(0, c, 0), sub(v(a, c, 0), v(0, c, 0)), sub(v(0, 0, 0), v(0, c, 0))]
    ];
    const N = 24, DUR = 1.6, D0 = .3;
    let css = '', rects = '';
    faces.forEach(([k, pr, [x0, y0, w, h], O, U, V]) => {
      const m = [U[0] / w, U[1] / w, V[0] / h, V[1] / h];
      const e = O[0] - m[0] * x0 - m[2] * y0, g = O[1] - m[1] * x0 - m[3] * y0;
      const M = (t) => { const ease = t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t); const L = (p, q) => f(p + (q - p) * ease); return `matrix(${L(m[0], 1)},${L(m[1], 0)},${L(m[2], 0)},${L(m[3], 1)},${L(e, 0)},${L(g, 0)})`; };
      let kf = '';
      for (let i = 0; i <= N; i++) kf += `${f(100 * i / N)}%{transform:${M(i / N)}}`;
      css += `.sc-${id} .fc-${k}{transform-box:view-box;transform-origin:0 0;transform:${M(0)}}`
        + `.on2 .sc-${id} .fc-${k}{animation:${id}-${k} ${DUR}s step-end ${D0}s both}@keyframes ${id}-${k}{${kf}}`;
      rects += `<g class="fc-${k}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${PAIR[pr][0]}" stroke="${PAIR[pr][1]}" stroke-width="3" vector-effect="non-scaling-stroke"/></g>`;
    });
    const area = { front: 30, back: 30, left: 24, right: 24, top: 20, bottom: 20 };
    const labels = faces.map(([k, pr, [x0, y0, w, h]], i) => `<g class="p3" ${dl(.2 + .2 * i)}>${T(x0 + w / 2, y0 + h / 2 + 7, `${area[k]} cm²`, { size: 20, color: PAIR[pr][1] })}</g>`).join('');
    const B = box(S, a, b, c);
    const dims = `${T(70 + W / 2, 290, '5 cm', { size: 20 })}${T(60, 262 - H / 2 + 7, '6 cm', { size: 20, anchor: 'end' })}`
      + T(v(a, 0, b / 2)[0] + 10, v(a, 0, b / 2)[1] + 18, '4 cm', { size: 20, anchor: 'start' });
    const body = rects
      + `<g class="g2"><path d="${B.vis}" ${INK}/><g class="s1" ${dl(.3)}><path d="${B.hid}" ${DASH}/></g><g class="s1" ${dl(.6)}>${dims}</g></g>`
      + labels
      + `<g class="s4" ${dl(.1)}><g class="k4" ${dl(.2)}>${faces.map(([, pr, [x0, y0, w, h]]) => `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="${C.green}" stroke-width="4"/>`).join('')}</g></g>`
      + `<g class="s4" ${dl(.4)}>${T(138, 150, '(20 + 24 + 30) × 2', { size: 24 })}</g>`
      + `<g class="s4" ${dl(1)}>${T(138, 196, '= 148 (cm²)', { size: 26, color: C.green })}</g>`
      + `<g class="p4" ${dl(1.4)}>${T(138, 262, '겉넓이', { size: 30, color: C.green })}</g>`;
    put('6-1/수학/6/겉넓이', svg(id, body, motion(id) + css));
  }

  // 쌓기나무 한 층(두께 1): 윗면 격자, 앞면·오른쪽 면 칸
  function slab(S, a, b, k, [top, side, edge]) {
    const v = (x, y, z) => S(x, y, z);
    let s = poly([v(0, k, 0), v(a, k, 0), v(a, k + 1, 0), v(0, k + 1, 0)], `fill="${side}" stroke="${edge}" stroke-width="2"`)
      + poly([v(a, k, 0), v(a, k, b), v(a, k + 1, b), v(a, k + 1, 0)], `fill="${top}" stroke="${edge}" stroke-width="2"`)
      + poly([v(0, k + 1, 0), v(a, k + 1, 0), v(a, k + 1, b), v(0, k + 1, b)], `fill="white" stroke="${edge}" stroke-width="2"`);
    let g = '';
    for (let x = 1; x < a; x++) g += `M${P(v(x, k, 0))} L${P(v(x, k + 1, 0))} L${P(v(x, k + 1, b))} `;
    for (let z = 1; z < b; z++) g += `M${P(v(a, k, z))} L${P(v(a, k + 1, z))} L${P(v(0, k + 1, z))} `;
    return s + `<path d="${g}" stroke="${edge}" stroke-width="1.5" fill="none"/>`;
  }

  // 부피: 모양이 다른 두 상자 가, 나 → 같은 쌓기나무를 한 층씩 채움 → 60개 < 64개 → 두 상자가 차례로 깜빡이고 '부피'
  {
    const id = 't61-m6-bupi';
    const s = 30;
    const SA = proj(56, 280, s), SB = proj(386, 280, s);
    const A = box(SA, 5, 4, 3), Bx = box(SB, 4, 4, 4);
    const colA = [C.sky, C.sky, C.blue], colB = [C.mint, C.mint, C.green];
    let layers = '';
    for (let k = 0; k < 3; k++) layers += `<g class="f2" ${dl(.2 + .45 * k, '--dx:0px;--dy:-46px')}>${slab(SA, 5, 4, k, colA)}</g>`;
    for (let k = 0; k < 4; k++) layers += `<g class="f2" ${dl(.2 + .38 * k, '--dx:0px;--dy:-46px')}>${slab(SB, 4, 4, k, colB)}</g>`;
    const topA = SA(0, 3, 4), topB = SB(0, 4, 4);
    const body = `<g class="g2"><path d="${A.vis}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-dasharray="9 6"/><path d="${A.hid}" stroke="${C.line}" stroke-width="2.5" fill="none" stroke-dasharray="6 6"/>`
      + `<path d="${Bx.vis}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-dasharray="9 6"/><path d="${Bx.hid}" stroke="${C.line}" stroke-width="2.5" fill="none" stroke-dasharray="6 6"/></g>`
      + layers
      + `<g class="s2" ${dl(1.8)}><path d="${A.vis}" ${INK}/><path d="${Bx.vis}" ${INK}/></g>`
      + T(topA[0] + 30, topA[1] - 16, '가', { size: 26 }) + T(topB[0] + 30, topB[1] - 16, '나', { size: 26 })
      + `<g class="p3" ${dl(.2)}>${T(150, 322, '60개', { size: 26, color: C.blue })}</g>`
      + `<g class="p3" ${dl(.6)}>${T(462, 322, '64개', { size: 26, color: C.green })}</g>`
      + `<g class="p3" ${dl(1)}>${T(306, 324, '&lt;', { size: 34, color: C.ink })}</g>`
      + `<g class="s4" ${dl(.1)}><g class="k4" ${dl(.2)}><path d="M${P(SA(0, 0, 0))} L${P(SA(5, 0, 0))} L${P(SA(5, 0, 4))} L${P(SA(5, 3, 4))} L${P(SA(0, 3, 4))} L${P(SA(0, 3, 0))} Z" fill="${C.blue}" fill-opacity=".25" stroke="${C.blue}" stroke-width="5" stroke-linejoin="round"/></g></g>`
      + `<g class="s4" ${dl(.6)}><g class="k4" ${dl(.7)}><path d="M${P(SB(0, 0, 0))} L${P(SB(4, 0, 0))} L${P(SB(4, 0, 4))} L${P(SB(4, 4, 4))} L${P(SB(0, 4, 4))} L${P(SB(0, 4, 0))} Z" fill="${C.green}" fill-opacity=".25" stroke="${C.green}" stroke-width="5" stroke-linejoin="round"/></g></g>`
      + `<g class="p4" ${dl(1.3)}>${T(306, 64, '부피', { size: 30, color: C.green })}</g>`;
    put('6-1/수학/6/부피', svg(id, body, motion(id)));
  }

  // 쌓기나무 하나(1 × 1 × 1)
  const cube = (S, x, y, z, [front, top, right], edge = C.ink, w = 2) =>
    poly([S(x, y, z), S(x + 1, y, z), S(x + 1, y + 1, z), S(x, y + 1, z)], `fill="${front}" stroke="${edge}" stroke-width="${w}" stroke-linejoin="round"`)
    + poly([S(x, y + 1, z), S(x + 1, y + 1, z), S(x + 1, y + 1, z + 1), S(x, y + 1, z + 1)], `fill="${top}" stroke="${edge}" stroke-width="${w}" stroke-linejoin="round"`)
    + poly([S(x + 1, y, z), S(x + 1, y, z + 1), S(x + 1, y + 1, z + 1), S(x + 1, y + 1, z)], `fill="${right}" stroke="${edge}" stroke-width="${w}" stroke-linejoin="round"`);
  const WOOD = ['#f6dcc0', '#fbeedd', '#e9c39c'];

  // 세제곱센티미터: 한 모서리 1 cm 정육면체 → 1 cm³, 1 세제곱센티미터 → 1 cm³ 쌓기나무 12개를 쌓아 12 cm³
  {
    const id = 't61-m6-cm3';
    const S = proj(92, 280, 120);
    const big = cube(S, 0, 0, 0, WOOD, C.ink, 3);
    const e1 = S(0.5, 0, 0), e2 = S(0, 0.5, 0), e3 = S(1, 0, 0.5);
    const SS = proj(400, 290, 40);
    let stack = '', k = 0;
    for (let y = 0; y < 2; y++) for (let z = 1; z >= 0; z--) for (let x = 0; x < 3; x++, k++) {
      stack += `<g class="f3" ${dl(.2 + .1 * k, '--dx:0px;--dy:-40px')}>${cube(SS, x, y, z, WOOD)}</g>`;
    }
    const body = big
      + `<g class="s1" ${dl(.4)}>${T(e1[0], e1[1] + 28, '1 cm', { size: 22 })}${T(e2[0] - 10, e2[1] + 8, '1 cm', { size: 22, anchor: 'end' })}${T(e3[0] + 12, e3[1] + 16, '1 cm', { size: 22, anchor: 'start' })}</g>`
      + `<g class="p2" ${dl(.2)}>${T(178, 76, '1 cm³', { size: 38, color: C.orange })}</g>`
      + `<g class="s2" ${dl(.8)}>${T(178, 108, '1 세제곱센티미터', { size: 20, color: C.muted })}</g>`
      + stack
      + `<g class="s3" ${dl(.1)}><path d="M318 170 Q360 150 392 196" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 6" fill="none"/><path d="M380 190 L393 198 L394 183" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`
      + `<g class="s3" ${dl(1.5)}>${T(490, 110, '3 × 2 × 2 = 12', { size: 24 })}</g>`
      + `<g class="p3" ${dl(1.7)}>${T(490, 336, '12 cm³', { size: 32, color: C.orange })}</g>`;
    put('6-1/수학/6/세제곱센티미터', svg(id, body, motion(id)));
  }

  // 세제곱미터: 한 모서리 1 m 정육면체 → 1 m³, 1 세제곱미터 → 모서리 1 m = 100 cm, 1 cm 눈금 100개 → 100 × 100 × 100 → 1 m³ = 1000000 cm³
  {
    const id = 't61-m6-m3';
    const s = 150;
    const S = proj(108, 300, s);
    const big = cube(S, 0, 0, 0, ['#e3eef9', '#eef5fc', '#cfe0f2'], C.ink, 3);
    // 모서리를 따라 1 cm(= 1.7) 마다 눈금 100개
    const fine = (p, q, nrm) => {
      let d = '';
      for (let i = 0; i <= 100; i++) {
        const t = i / 100, x = p[0] + (q[0] - p[0]) * t, y = p[1] + (q[1] - p[1]) * t, L = i % 10 ? 7 : 13;
        d += `M${f(x)} ${f(y)} l${f(nrm[0] * L)} ${f(nrm[1] * L)} `;
      }
      return `<path d="${d}" stroke="${C.orange}" stroke-width=".8"/>`;
    };
    const o = S(0, 0, 0), xa = S(1, 0, 0), ya = S(0, 1, 0), yz = S(0, 1, 1);
    const ruler = fine(o, xa, [0, 1]) + fine(o, ya, [-1, 0]) + fine(ya, yz, [-0.58, -0.81]);
    const m1 = S(0.5, 0, 0), m2 = S(0, 0.5, 0), m3 = S(0, 1, 0.5);
    const lab = (t) => `${T(m1[0], m1[1] + 36, t, { size: 22 })}${T(m2[0] - 20, m2[1] + 8, t, { size: 22, anchor: 'end' })}${T(m3[0] - 16, m3[1] - 12, t, { size: 22, anchor: 'end' })}`;
    const body = big
      + `<g class="g2"><g class="s1" ${dl(.3)}>${lab('1 m')}</g></g>`
      + `<g class="s2" ${dl(.2)}>${ruler}</g>`
      + `<g class="s2" ${dl(.8)}>${lab('100 cm')}</g>`
      + `<g class="p1" ${dl(.8)}>${T(490, 96, '1 m³', { size: 40, color: C.blue })}</g>`
      + `<g class="s1" ${dl(1.3)}>${T(490, 130, '1 세제곱미터', { size: 20, color: C.muted })}</g>`
      + `<g class="s2" ${dl(1.2)}>${T(490, 186, '1 m = 100 cm', { size: 24 })}</g>`
      + `<g class="s3" ${dl(.2)}>${T(490, 232, '100 × 100 × 100', { size: 24 })}</g>`
      + `<g class="s3" ${dl(.9)}>${T(490, 268, '= 1000000 (개)', { size: 24, color: C.orange })}</g>`
      + `<g class="p4" ${dl(.3)}><rect x="352" y="300" width="276" height="48" rx="10" fill="white" stroke="${C.green}" stroke-width="3"/>${T(490, 333, '1 m³ = 1000000 cm³', { size: 24, color: C.green })}</g>`;
    put('6-1/수학/6/세제곱미터', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
