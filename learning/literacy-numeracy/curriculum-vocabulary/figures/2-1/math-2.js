// 수학 2-1 2단원 여러 가지 도형: 낱말 도식
// 삼각형·사각형은 점을 찍고 곧은 선으로 잇는 차례(교과서 「점 3개를 골라 선으로 이었어」), 변·꼭짓점은 같은 두 도형에서 칸마다 강조.
// 칠교판은 정사각형 판(4×4 칸)을 큰 삼각형 2, 중간 삼각형 1, 작은 삼각형 2, 정사각형 1, 평행사변형 1 로 나눈 표준 모양.
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
  const P = (pts) => pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');
  const poly = (pts, fill, stroke, sw = 4) => `<path d="M${P(pts)} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  const dot = (x, y, color, r = 9) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${color}" stroke="white" stroke-width="2.5"/>`;
  const midOut = (a, b, c, k = 30) => { // 변 ab 의 가운데에서 도형 안쪽 점 c 의 반대쪽으로 k 만큼
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = mx - c[0], dy = my - c[1], L = Math.hypot(dx, dy);
    return [mx + dx / L * k, my + dy / L * k];
  };
  const center = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

  // 도형: 세모·네모·동그라미가 그려짐 → 이름 삼각형·사각형·원 → 모두 묶어 도형
  (function () {
    const id = 't21-m2-dohyeong';
    const tri = [[120, 70], [45, 220], [195, 220]];
    const body = draw(`M${P(tri)} Z`, C.orange, 5, 1, .1)
      + draw('M250 80 H390 V220 H250 Z', C.blue, 5, 1, .6)
      + `<circle class="dr d1" pathLength="100" ${dl(1.1)} cx="520" cy="150" r="72" transform="rotate(-90 520 150)" fill="none" stroke="${C.green}" stroke-width="5"/>`
      + G('s1', .8, poly(tri, C.peach, C.orange, 5)) + G('s1', 1.3, rect(250, 80, 140, 140, C.sky, C.blue, 5, 2)) + G('s1', 1.8, `<circle cx="520" cy="150" r="72" fill="${C.mint}" stroke="${C.green}" stroke-width="5"/>`)
      + tag(120, 268, '삼각형', C.orange, 'p2', .2, 30) + tag(320, 268, '사각형', C.blue, 'p2', .6, 30) + tag(520, 268, '원', C.green, 'p2', 1, 30)
      + G('k3', .2, `<rect x="22" y="44" width="596" height="244" rx="18" fill="none" stroke="${C.purple}" stroke-width="3.5" stroke-dasharray="10 8"/>`)
      + G('p3', .8, pill(320, 320, 120, '도형', C.purple, C.lilac, 32));
    reg('2-1/수학/2/도형', id, body);
  })();

  // 삼각형·사각형: 점 → 곧은 선으로 하나씩 이음(번호) → 둘러싸인 도형이 칠해지고 다른 모양의 같은 도형들
  const shapeByDots = (key, id, pts, name, color, fill, examples) => {
    const c = center(pts), n = pts.length;
    let lines = '', nums = '';
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % n], [lx, ly] = midOut(a, b, c, 30);
      lines += draw(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`, color, 5, 2, .2 + i * .45);
      nums += tag(lx, ly + 9, i + 1, color, 'p2', .5 + i * .45, 26);
    }
    const dots = pts.map(([x, y], i) => G('p1', .3 + i * .3, dot(x, y, C.ink, 10)) + ring(x, y, 12, C.ink, 'r1', .4 + i * .3)).join('');
    const ex = examples.map((e, i) => G('p3', .8 + i * .3, poly(e, fill, color, 4))).join('');
    const body = G('s3', .1, poly(pts, fill, 'none', 0)) + lines + dots + nums + ex
      + G('p3', .4, pill(530, 50, 150, name, color, fill, 30));
    reg(key, id, body);
  };
  shapeByDots('2-1/수학/2/삼각형', 't21-m2-samgak', [[220, 50], [70, 280], [390, 250]], '삼각형', C.orange, C.peach,
    [[[470, 110], [470, 200], [600, 200]], [[540, 225], [470, 320], [610, 320]]]);
  shapeByDots('2-1/수학/2/사각형', 't21-m2-sagak', [[100, 70], [350, 50], [400, 280], [70, 250]], '사각형', C.blue, C.sky,
    [[[460, 110], [610, 110], [610, 190], [460, 190]], [[490, 230], [580, 230], [615, 315], [455, 315]]]);

  // 원: 컵을 대고 연필이 둘레를 따라 돌며 원이 그려짐 → 사각형은 뾰족한 곳 4, 원은 0 → 크기가 다른 여러 원
  (function () {
    const id = 't21-m2-won', cx = 180, cy = 170, r = 100;
    const pencil = `<g class="pc"><path d="M${cx} ${cy - r} l10 -26 l90 -60 l14 20 l-90 60 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M${cx} ${cy - r} l10 -26 l14 20 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/><circle cx="${cx + 3}" cy="${cy - r - 7}" r="4" fill="${C.ink}"/></g>`;
    const cup = `<g class="g1" ${dl(1.9)}><circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="${C.line}"/><circle cx="${cx}" cy="${cy}" r="${r - 22}" fill="${C.paper}" opacity=".7"/></g>`;
    const sq = [[400, 90], [540, 90], [540, 230], [400, 230]];
    const body = cup
      + `<circle class="dr d1" pathLength="100" style="transition-duration:1.6s;transition-delay:.2s" cx="${cx}" cy="${cy}" r="${r}" transform="rotate(-90 ${cx} ${cy})" fill="none" stroke="${C.green}" stroke-width="6"/>`
      + `<g class="g1" ${dl(1.9)}>${pencil}</g>`
      + G('s2', .1, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.mint}" stroke="${C.green}" stroke-width="6"/>`)
      + `<g class="h3">${G('s2', .2, poly(sq, C.sky, C.blue, 5))}${sq.map(([x, y], i) => G('k2', .6 + i * .15, dot(x, y, C.red, 11))).join('')}`
      + G('s2', 1.2, T(470, 290, '뾰족한 곳 4', { size: 24, color: C.red })) + '</g>'
      + `<g class="tr"><g class="s2" ${dl(.6)}>${dot(cx, cy - r, C.orange, 11)}</g></g>`
      + G('s2', 1.2, T(cx, 314, '뾰족한 곳 0', { size: 24, color: C.green }))
      + [[420, 120, 46], [540, 110, 34], [450, 228, 48], [585, 220, 24]].map(([x, y, rr], i) => G('p3', .2 + i * .25, `<circle cx="${x}" cy="${y}" r="${rr}" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`)).join('')
      + G('p3', 1.3, pill(510, 320, 90, '원', C.green, C.mint, 32));
    reg('2-1/수학/2/원', id, body, `
      .sc-${id} .pc { transform-box: view-box; transform-origin: ${cx}px ${cy}px; }
      .on1 .sc-${id} .pc { animation: ${id}-turn 1.6s linear .2s both; }
      @keyframes ${id}-turn { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .sc-${id} .tr { transform-box: view-box; transform-origin: ${cx}px ${cy}px; }
      .on2 .sc-${id} .tr { animation: ${id}-turn 2s linear .6s infinite; }`);
  })();

  // 변·꼭짓점: 같은 삼각형과 사각형
  const tri = [[150, 70], [50, 270], [262, 270]], sq = [[360, 90], [550, 90], [550, 270], [360, 270]];
  const twoShapes = (stroke) => poly(tri, 'white', stroke, 4) + poly(sq, 'white', stroke, 4);

  // 변: 두 도형 → 삼각형의 곧은 선이 하나씩 빛나며 1, 2, 3 → 사각형 1~4, 변 3개·4개
  (function () {
    const id = 't21-m2-byeon';
    const sides = (pts, color, n, d0) => {
      const c = center(pts);
      return pts.map((a, i) => {
        const b = pts[(i + 1) % pts.length], [lx, ly] = midOut(a, b, c, 28);
        return draw(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, color, 9, n, d0 + i * .4) + tag(lx, ly + 9, i + 1, color, `p${n}`, d0 + .3 + i * .4, 26);
      }).join('');
    };
    const body = twoShapes(C.muted)
      + G('s1', .3, poly(tri, C.peach, 'none', 0) + poly(sq, C.sky, 'none', 0))
      + sides(tri, C.orange, 2, .2) + tag(156, 336, '변 3개', C.orange, 's2', 1.6, 28)
      + sides(sq, C.blue, 3, .2) + tag(455, 336, '변 4개', C.blue, 's3', 2, 28)
      + G('p2', 1.8, pill(320, 36, 90, '변', C.green, C.mint, 30));
    reg('2-1/수학/2/변', id, body);
  })();

  // 꼭짓점: 두 도형 → 삼각형 위쪽에서 두 변이 만나는 점 → 모든 꼭짓점 3개·4개
  (function () {
    const id = 't21-m2-kkokjitjeom';
    const [A, B, C2] = tri;
    const part = (p, q, k = .35) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
    const nb = part(A, B), nc = part(A, C2);
    const vdots = (pts, color, n, d0) => pts.map(([x, y], i) => G(`p${n}`, d0 + i * .3, dot(x, y, color, 11)) + ring(x, y, 13, color, `r${n}`, d0 + i * .3)).join('');
    const body = twoShapes(C.ink)
      + G('s1', .2, poly(tri, C.peach, 'none', 0) + poly(sq, C.sky, 'none', 0))
      + draw(`M${f(nb[0])} ${f(nb[1])} L${A[0]} ${A[1]} L${f(nc[0])} ${f(nc[1])}`, C.orange, 9, 2, .2)
      + G('p2', .9, dot(A[0], A[1], C.red, 12)) + ring(A[0], A[1], 14, C.red, 'r2', 1)
      + G('s2', 1.2, arrow(232, 58, 168, 66, C.red) + T(240, 66, '꼭짓점', { size: 26, color: C.red, anchor: 'start' }))
      + vdots(tri.slice(1), C.red, 3, .2) + tag(156, 336, '꼭짓점 3개', C.red, 's3', .9, 26)
      + vdots(sq, C.purple, 3, 1) + tag(455, 336, '꼭짓점 4개', C.purple, 's3', 2, 26);
    reg('2-1/수학/2/꼭짓점', id, body);
  })();

  // 칠교판: 네모난 판의 선이 그려짐 → 일곱 조각이 벌어지며 번호 1~7 → 삼각형 5(주황)·사각형 2(파랑)
  (function () {
    const id = 't21-m2-chilgyo', s = 60, x0 = 50, y0 = 70, cx = x0 + 2 * s, cy = y0 + 2 * s;
    const pieces = [
      [[0, 0], [4, 0], [2, 2]], [[0, 0], [2, 2], [0, 4]], [[4, 2], [4, 4], [2, 4]],
      [[4, 0], [4, 2], [3, 1]], [[2, 2], [3, 3], [1, 3]],
      [[2, 2], [3, 1], [4, 2], [3, 3]], [[1, 3], [3, 3], [2, 4], [0, 4]]
    ].map((p) => p.map(([u, v]) => [x0 + u * s, y0 + v * s]));
    const body = pieces.map((p, i) => {
      const [mx, my] = center(p), quad = p.length === 4;
      return `<g class="m2" ${dl(.2 + i * .08, `--mx:${f((mx - cx) * .5)}px;--my:${f((my - cy) * .5)}px`)}>`
        + poly(p, C.mint, C.green, 3)
        + G('s3', .2 + i * .1, poly(p, quad ? C.sky : C.peach, quad ? C.blue : C.orange, 3))
        + tag(mx, my + 9, i + 1, C.ink, 's2', .8 + i * .12, 24) + '</g>';
    }).join('')
      + `<g class="g2" ${dl(.1)}>${draw([[0, 0, 3, 3], [4, 0, 2, 2], [2, 2, 0, 4], [3, 1, 4, 2], [4, 2, 2, 4], [1, 3, 3, 3]].map(([a, b, c, e]) => `M${x0 + a * s} ${y0 + b * s} L${x0 + c * s} ${y0 + e * s}`).join(' '), C.green, 3, 1, .6)}</g>`
      + `<g class="g2" ${dl(.1)}>${draw(`M${x0} ${y0} H${x0 + 4 * s} V${y0 + 4 * s} H${x0} Z`, C.ink, 4, 1, .1)}</g>`
      + tag(500, 112, '조각 7개', C.ink, 'p2', 1.7, 36)
      + G('s3', .5, rect(410, 162, 36, 36, C.peach, C.orange, 3, 4) + T(462, 191, '삼각형 5개', { size: 28, color: C.orange, anchor: 'start' }))
      + G('s3', .9, rect(410, 222, 36, 36, C.sky, C.blue, 3, 4) + T(462, 251, '사각형 2개', { size: 28, color: C.blue, anchor: 'start' }))
      + G('p3', 1.5, pill(500, 318, 130, '칠교판', C.green, C.mint, 30));
    reg('2-1/수학/2/칠교판', id, body);
  })();

  // 쌓기나무: 상자 모양 나무토막 하나 → 같은 것 4개를 쌓아 ㄴ 모양 → 모두 같은 크기
  (function () {
    const id = 't21-m2-ssagi', S = 70, d = 28;
    const block = (x, y) => `<path d="M${x} ${y} l${d} ${-d} h${S} l${-d} ${d} Z" fill="white" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${x + S} ${y} l${d} ${-d} v${S} l${-d} ${d} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + rect(x, y, S, S, C.peach, C.orange, 3, 2);
    const bx = 330, by = 250, spots = [[0, 0], [0, 1], [0, 2], [1, 0]];
    const stack = spots.map(([c, r], i) => G('f2', .2 + i * .4, block(bx + c * S, by - r * S), '--dx:0px;--dy:-90px')).join('');
    const outline = (x, y, dd) => G('k3', dd, rect(x - 3, y - 3, S + 6, S + 6, 'none', C.purple, 4, 4));
    const body = G('p1', .3, block(90, 170)) + tag(125, 280, '1개', C.ink, 's1', .8, 26)
      + stack + tag(395, 352, '4개', C.ink, 's2', 1.9, 26)
      + outline(90, 170, .2) + spots.map(([c, r], i) => outline(bx + c * S, by - r * S, .4 + i * .2)).join('')
      + G('p3', 1.4, pill(540, 70, 150, '쌓기나무', C.orange, C.peach, 28));
    reg('2-1/수학/2/쌓기나무', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
