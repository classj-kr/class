// 수학 3-1 2단원 평면도형: 낱말 도식
// 선분·반직선·직선은 같은 두 점(ㄱ 230, ㄴ 410)에서 차례로 늘어난다. 늘이기는 점에서 시작하는 scaleX, 끝없이는 화면 끝 화살 머리가 계속 흘러 나감.
// 직각은 교과서 활동(동그란 종이를 반듯하게 두 번 접어 본뜨기). 사각형 무리는 꼭짓점을 옮기는 모양 바꾸기(4-2 math-4.js 와 같은 방법).
//   변 하나는 (0,0)–(1,0) 짧은 선을 matrix 로 늘이고 돌린 것, 안쪽 색은 꼭짓점 0 에서 부채꼴로 나눈 삼각형. 모양 바꾸기 조각에는 다른 animation 을 주지 않는다.
// 움직임은 transform·opacity·stroke-dashoffset 만(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(2);
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const unit = (a) => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const center = (pts) => mul(pts.reduce((s, p) => add(s, p), [0, 0]), 1 / pts.length);
  const rad = (d) => d * Math.PI / 180;
  const pt = (O, a, r) => [O[0] + r * Math.cos(rad(a)), O[1] - r * Math.sin(rad(a))];
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .7s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .9s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4,.x1,.x2,.x3,.x4){transition:opacity .4s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.18)}100%{opacity:1;transform:none}}
    @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
    @keyframes ${id}-blink{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .4s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .5s ease-out both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0}
    .on${n} .sc-${id} .r${n}{animation:${id}-ring 1.1s ease-out 2 both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.4s ease-in-out both}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}
    .on${n} .sc-${id} .x${n}{opacity:.2}`;
    return css;
  };
  const ring = (c, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${dl(d)} cx="${f(c[0])}" cy="${f(c[1])}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${dl(d)}>${T(x, y, s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 26) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 22)}" width="${w}" height="44" rx="22" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${T(cx, cy + size * .36, s, { size, color })}`;
  const seg = (p, q, { color = C.ink, w = 5, cls = '', extra = '' } = {}) =>
    `<path class="${cls}" d="M${P(p)} L${P(q)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none" ${extra}/>`;
  const drawSeg = (p, q, d, o = {}) => seg(p, q, { ...o, cls: `dr ${o.cls || ''}`, extra: `pathLength="100" ${dl(d)} ${o.extra || ''}` });
  const dot = (p, { r = 7, color = C.ink } = {}) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${color}"/>`;
  const poly = (pts, { fill = 'white', stroke = C.ink, w = 4, op = 1 } = {}) =>
    `<polygon points="${pts.map(P).join(' ')}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
  // 직각 표시: 꼭짓점 O 에서 a 쪽, b 쪽으로 s 만큼
  const rmark = (O, a, b, { s = 20, color = C.red } = {}) => {
    const u = unit(sub(a, O)), v = unit(sub(b, O));
    const p1 = add(O, mul(u, s)), p2 = add(p1, mul(v, s)), p3 = add(O, mul(v, s));
    return `<path d="M${P(p1)} L${P(p2)} L${P(p3)}" stroke="${color}" stroke-width="3" fill="none"/>`;
  };
  const markAt = (pts, i, o) => rmark(pts[i], pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length], o);
  // 각 표시(호): 꼭짓점 V 에서 A 쪽과 B 쪽 사이
  const arcAt = (V, A, B, r, color) => {
    const u = unit(sub(A, V)), v = unit(sub(B, V)), p = add(V, mul(u, r)), q = add(V, mul(v, r));
    const cr = u[0] * v[1] - u[1] * v[0];
    return `<path d="M${P(p)} A${r} ${r} 0 0 ${cr > 0 ? 1 : 0} ${P(q)}" stroke="${color}" stroke-width="3.5" fill="none"/>`;
  };
  // 같은 길이 표시
  const tick = (p, q, color = C.green) => {
    const m = mid(p, q), u = unit(sub(q, p)), v = [-u[1], u[0]];
    return seg(add(m, mul(v, -10)), add(m, mul(v, 10)), { color, w: 3 });
  };
  // 변 번호: 변 가운데에서 도형 바깥쪽으로
  const sideNums = (pts, cls, d0, { gap = 24, size = 22, color = C.purple } = {}) => {
    const c = center(pts);
    return pts.map((p, i) => {
      const q = pts[(i + 1) % pts.length], m = mid(p, q), u = unit(sub(q, p));
      let nrm = [u[1], -u[0]];
      if ((m[0] - c[0]) * nrm[0] + (m[1] - c[1]) * nrm[1] < 0) nrm = mul(nrm, -1);
      const at = add(m, mul(nrm, gap));
      return tag(at[0], at[1] + size * .36, i + 1, color, cls, d0 + i * .25, size);
    }).join('');
  };
  // 화살 머리(끝없이 뻗어 나감): tip 에서 dir 쪽
  const chev = (tip, dir, color = C.ink) => {
    const u = unit(dir), v = [-u[1], u[0]];
    const a = add(add(tip, mul(u, -13)), mul(v, 12)), b = add(add(tip, mul(u, -13)), mul(v, -12));
    return `<g class="cv" style="--tx:${f(u[0] * 16)}px;--ty:${f(u[1] * 16)}px"><path d="M${P(a)} L${P(tip)} L${P(b)}" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  };
  const chevCss = (id) => `.sc-${id} .cv{animation:${id}-cv 1.5s ease-in infinite}@keyframes ${id}-cv{0%{transform:translate(0,0);opacity:0}30%{opacity:1}100%{transform:translate(var(--tx),var(--ty));opacity:0}}`;
  // 점에서 늘어나는 곧은 선: from 에서 x 끝까지
  const grow = (cls, from, toX, color = C.ink) => `<path class="${cls}" d="M${P(from)} H${toX}" stroke="${color}" stroke-width="5" fill="none"/>`;
  const growCss = (id, n, cls, from, d = .2, dur = 1.3) => `.sc-${id} .${cls}{transform-box:view-box;transform-origin:${from[0]}px ${from[1]}px;transform:scaleX(0)}
    .on${n} .sc-${id} .${cls}{transform:none;transition:transform ${dur}s ease-in-out ${d}s}`;
  // 도형판 못 7×5(간격 60): 못 하나하나를 작은 동그라미로 한 path 에
  const PEG = (i, j) => [70 + 60 * i, 60 + 60 * j];
  const geoboard = () => {
    let d = '';
    for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) { const [x, y] = PEG(i, j); d += `M${x - 5} ${y}a5 5 0 1 0 10 0a5 5 0 1 0 -10 0`; }
    return `<rect x="40" y="30" width="420" height="300" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/><path d="${d}" fill="${C.muted}"/>`;
  };

  // 모양 바꾸기: states[i] → states[i+1] 이 beats[i] 칸에 일어난다.
  const STEPS = 16;
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (A, B, t) => A.map((p, i) => [p[0] + (B[i][0] - p[0]) * t, p[1] + (B[i][1] - p[1]) * t]);
  const segM = (p, q) => { const d = sub(q, p); return `matrix(${f(d[0])},${f(d[1])},${f(-d[1])},${f(d[0])},${f(p[0])},${f(p[1])})`; };
  const triM = (a, b, c) => `matrix(${f(b[0] - a[0])},${f(b[1] - a[1])},${f(c[0] - a[0])},${f(c[1] - a[1])},${f(a[0])},${f(a[1])})`;
  // closed=false 면 열린 선(줄): 변만, 마지막 점에서 처음으로 돌아가지 않는다.
  function morph(id, name, states, beats, { fill = C.mint, stroke = C.ink, width = 4, dur = 1.2, delay = .3, closed = true, steps = STEPS } = {}) {
    const n = states[0].length, parts = [];
    for (let j = 0; j < (closed ? n : n - 1); j++) parts.push({ cls: `${name}s${j}`, m: (q) => segM(q[j], q[(j + 1) % n]), j });
    if (fill && closed) for (let k = 1; k < n - 1; k++) parts.push({ cls: `${name}t${k}`, m: (q) => triM(q[0], q[k], q[k + 1]) });
    let fills = '', sides = '', css = '';
    for (const part of parts) {
      const base = part.m(states[0]);
      if (part.j !== undefined) sides += `<path class="${part.cls}" d="M0 0H1" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" vector-effect="non-scaling-stroke" fill="none" style="transform:${base}"/>`;
      else fills += `<path class="${part.cls}" d="M0 0L1 0L0 1Z" fill="${fill}" stroke="${fill}" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="transform:${base}"/>`;
      beats.forEach((b, i) => {
        const kf = Array.from({ length: steps + 1 }, (_, s) => `${f(100 * s / steps)}%{transform:${part.m(lerp(states[i], states[i + 1], ease(s / steps)))}}`).join('');
        css += `@keyframes ${id}-${part.cls}-${i}{${kf}}.on${b} .sc-${id} .${part.cls}{animation:${id}-${part.cls}-${i} ${dur}s linear ${delay}s both}`;
      });
    }
    return { body: `${fills}${sides}`, css };
  }

  // 곧은 선: 바닥에 구불구불 놓인 줄넘기 줄 → 양 끝을 당기니 반듯하게 펴짐 → 자를 대어 보니 꼭 맞음, '곧은 선'
  (function () {
    const id = 't31-m2-godeun', N = 24, L = 15, A = 1.25, y = 176;
    const wave = [[0, 0]];
    for (let k = 0; k < N; k++) { const a = A * Math.sin(2 * Math.PI * (k + .5) / 12); wave.push(add(wave[k], [L * Math.cos(a), L * Math.sin(a)])); }
    const w = wave[N][0], my = wave.reduce((t, p) => t + p[1], 0) / wave.length, W = wave.map((p) => [p[0] + 320 - w / 2, p[1] - my + y]);
    const ys = f(W[0][1]), S = Array.from({ length: N + 1 }, (_, k) => [320 - N * L / 2 + k * L, ys]);
    const m = morph(id, 'r', [W, S], [2], { fill: null, stroke: C.orange, width: 7, closed: false, dur: 1.3, delay: .3, steps: 10 });
    const hand = (p, q) => `<g class="hd" style="--mx:${f(q[0] - p[0])}px;--my:0px">${dot(p, { r: 13, color: C.purple })}</g>`;
    let marks = '';
    for (let x = 0; x <= 400; x += 20) marks += `M${120 + x} ${ys + 12}V${ys + (x % 100 ? 24 : 32)}`;
    const ruler = `<g class="rl"><rect x="110" y="${ys + 10}" width="420" height="52" rx="5" fill="${C.yellow}" fill-opacity=".45" stroke="${C.orange}" stroke-width="3"/><path d="${marks}" stroke="${C.orange}" stroke-width="2"/></g>`;
    const body = `<g class="b3">${ruler}</g>`
      + `<g class="b1"><g class="k3" ${dl(1.2)}>${m.body}</g>${hand(W[0], S[0])}${hand(W[N], S[N])}</g>`
      + `<g class="p3" ${dl(1.4)}>${pill(320, 300, 130, '곧은 선', C.green, C.mint, 28)}</g>`;
    put('3-1/수학/2/곧은 선', svg(id, body, motion(id) + m.css + `
      .sc-${id} .hd{transition:transform 1.3s cubic-bezier(.65,0,.35,1) .3s}
      .on2 .sc-${id} .hd{transform:translate(var(--mx),var(--my))}
      .sc-${id} .rl{transform:translateY(150px)}
      .on3 .sc-${id} .rl{transform:none;transition:transform .8s ease-out .2s}`));
  })();

  // 굽은 선: 선 여섯 가~바 → 곧은 선 상자와 굽은 선 상자로 나뉘어 들어감 → 굽은 선 쪽이 반짝이며 이름표
  (function () {
    const id = 't31-m2-gubeun';
    const lines = [
      ['가', 'M-40 22L40 -22', false], ['나', 'M-42 0q10.5 -26 21 0t21 0t21 0t21 0', true], ['다', 'M-42 0H42', false],
      ['라', 'M-38 20Q0 -52 38 20', true], ['마', 'M-38 -22C40 -34 -40 34 38 22', true], ['바', 'M0 -30V30', false]
    ];
    const slot = { false: [72, 166, 260], true: [380, 474, 568] }, used = { false: 0, true: 0 };
    let items = '';
    lines.forEach(([name, d, curved], i) => {
      const cx = 70 + i * 100, cy = 84, tx = slot[curved][used[curved]++], ty = 262;
      items += `<g class="m2" ${dl(.2 + i * .12, `--mx:${tx - cx}px;--my:${ty - cy}px`)}><g class="${curved ? 'k3' : ''}" ${dl(.6)}><g class="p1" ${dl(.1 + i * .15)}>`
        + `<path d="${d}" transform="translate(${cx} ${cy})" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" fill="none"/>${T(cx, cy + 62, name, { size: 22, color: C.muted })}</g></g></g>`;
    });
    const box = (x, s, color, fill) => `<rect x="${x}" y="182" width="284" height="164" rx="14" fill="${fill}" stroke="${color}" stroke-width="3"/>${T(x + 142, 212, s, { size: 22, color })}`;
    const body = `<g class="s2" ${dl(0)}>${box(24, '곧은 선', C.muted, 'white')}${box(332, '굽은 선', C.orange, C.peach)}</g>`
      + items
      + `<g class="p3" ${dl(.3)}>${pill(474, 206, 124, '굽은 선', C.orange, 'white', 26)}</g>`;
    put('3-1/수학/2/굽은 선', svg(id, body, motion(id) + `.sc-${id} .m2{transition-duration:1s}`));
  })();

  // 선분: 점 ㄱ, ㄴ → 자를 대고 곧게 이으면 두 점에서 멈춤 → 양 끝이 있어 5 cm 를 잼, '선분 ㄱㄴ'
  const GA = [230, 190], GB = [410, 190];
  (function () {
    const id = 't31-m2-seonbun', A = GA, B = GB, cm = 36;
    let marks = '', nums = '';
    for (let k = 0; k <= 6; k++) { marks += `M${A[0] + k * cm} 200V216`; nums += T(A[0] + k * cm, 240, k, { size: 18, color: C.orange, weight: 600 }); }
    for (let k = 0; k < 6; k++) marks += `M${A[0] + k * cm + cm / 2} 200V209`;
    const ruler = `<g class="rl"><rect x="${A[0] - 22}" y="198" width="${6 * cm + 44}" height="52" rx="5" fill="${C.yellow}" fill-opacity=".45" stroke="${C.orange}" stroke-width="3"/><path d="${marks}" stroke="${C.orange}" stroke-width="2"/>${nums}</g>`;
    const body = `<g class="b2">${ruler}</g>`
      + `<g class="k3" ${dl(.4)}>${drawSeg(A, B, .9, { cls: 'd2' })}</g>`
      + `<g class="p1" ${dl(.2)}>${dot(A, { r: 8 })}</g><g class="p1" ${dl(.6)}>${dot(B, { r: 8 })}</g>`
      + tag(A[0], 166, 'ㄱ', C.ink, 's1', .2, 28) + tag(B[0], 166, 'ㄴ', C.ink, 's1', .6, 28)
      + ring(A, 14, C.orange, 'r3', .2) + ring(B, 14, C.orange, 'r3', .2)
      + tag(320, 296, '5 cm', C.orange, 'p3', .8, 28)
      + `<g class="p3" ${dl(1.2)}>${pill(320, 92, 150, '선분 ㄱㄴ', C.green, C.mint, 28)}</g>`;
    put('3-1/수학/2/선분', svg(id, body, motion(id) + `
      .sc-${id} .rl{transform:translateY(140px);opacity:0}
      .on2 .sc-${id} .rl{transform:none;opacity:1;transition:transform .7s ease-out .1s,opacity .3s ease .1s}`));
  })();

  // 반직선: 선분 ㄱㄴ → 점 ㄴ 쪽으로만 끝없이(반직선 ㄱㄴ, 시작점 ㄱ) → 아래 줄은 점 ㄴ 에서 시작해 ㄱ 쪽으로(반직선 ㄴㄱ)
  (function () {
    const id = 't31-m2-banjikseon', y1 = 130, y2 = 268;
    const A1 = [GA[0], y1], B1 = [GB[0], y1], A2 = [GA[0], y2], B2 = [GB[0], y2];
    const row = (A, B, cls, d) => `<g class="${cls}" ${dl(d)}>${dot(A, { r: 8 })}${dot(B, { r: 8 })}${T(A[0], A[1] + 40, 'ㄱ', { size: 28 })}${T(B[0], B[1] + 40, 'ㄴ', { size: 28 })}</g>`;
    const body = drawSeg(A1, B1, .5, { cls: 'd1' })
      + `<g class="b2">${grow('g1x', B1, 628)}${chev([626, y1], [1, 0])}</g>`
      + row(A1, B1, 's1', .1)
      + `<g class="h2">${tag(320, 84, '선분 ㄱㄴ', C.muted, 's1', 1, 24)}</g>`
      + ring(A1, 16, C.orange, 'r2', 1.6) + `<g class="s2" ${dl(1.4)}>${T(320, 84, '반직선 ㄱㄴ', { size: 28, color: C.green })}</g>`
      + `<g class="s3" ${dl(.1)}>${seg(A2, B2)}</g>`
      + `<g class="b3">${grow('g2x', A2, 12)}${chev([14, y2], [-1, 0])}</g>`
      + row(A2, B2, 's3', .1)
      + ring(B2, 16, C.orange, 'r3', 1.6) + `<g class="s3" ${dl(1.4)}>${T(320, 222, '반직선 ㄴㄱ', { size: 28, color: C.blue })}</g>`;
    put('3-1/수학/2/반직선', svg(id, body, motion(id) + growCss(id, 2, 'g1x', B1, .3) + growCss(id, 3, 'g2x', A2, .5) + chevCss(id)));
  })();

  // 직선: 선분 ㄱㄴ → ㄴ 쪽으로만 늘이면 반직선 ㄱㄴ → ㄱ 쪽으로도 끝없이 늘이면 직선 ㄱㄴ
  (function () {
    const id = 't31-m2-jikseon', A = GA, B = GB, y = A[1];
    const body = `<g class="k3" ${dl(1.6)}>${drawSeg(A, B, .5, { cls: 'd1' })}<g class="b2">${grow('gr', B, 628)}</g><g class="b3">${grow('gl', A, 12)}</g></g>`
      + `<g class="b2">${chev([626, y], [1, 0])}</g><g class="b3">${chev([14, y], [-1, 0])}</g>`
      + `<g class="s1" ${dl(.1)}>${dot(A, { r: 8 })}${dot(B, { r: 8 })}${T(A[0], y + 42, 'ㄱ', { size: 28 })}${T(B[0], y + 42, 'ㄴ', { size: 28 })}</g>`
      + `<g class="h2">${tag(320, 120, '선분 ㄱㄴ', C.muted, 's1', 1, 24)}</g>`
      + `<g class="h3">${tag(320, 120, '반직선 ㄱㄴ', C.muted, 's2', 1.4, 24)}</g>`
      + `<g class="p3" ${dl(1.6)}>${pill(320, 112, 160, '직선 ㄱㄴ', C.green, C.mint, 28)}</g>`;
    put('3-1/수학/2/직선', svg(id, body, motion(id) + growCss(id, 2, 'gr', B, .3) + growCss(id, 3, 'gl', A, .3) + chevCss(id)));
  })();

  // 각: 핀으로 이은 종이 막대 두 개 → 위 막대를 돌려 벌림 → 막대를 따라 점 ㄴ 에서 두 반직선, '각 ㄱㄴㄷ'
  (function () {
    const id = 't31-m2-gak', O = [150, 272], ang = 42, L = 350;
    const strip = (fill, stroke) => `<rect x="${O[0] - 24}" y="${O[1] - 17}" width="${L + 24}" height="34" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="3" fill-opacity=".85"/>`;
    const E1 = pt(O, 0, 370), E2 = pt(O, ang, 340), Cc = pt(O, 0, 250), A = pt(O, ang, 250);
    const body = `<g class="paper">${strip(C.peach, C.orange)}<g class="arm">${strip(C.sky, C.blue)}</g></g>`
      + `<circle cx="${O[0]}" cy="${O[1]}" r="9" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + drawSeg(O, E1, .6, { cls: 'd3' }) + drawSeg(O, E2, .9, { cls: 'd3' })
      + `<g class="s3" ${dl(1.4)}>${arcAt(O, E1, E2, 48, C.orange)}${dot(O, { r: 8 })}${dot(Cc)}${dot(A)}${T(O[0] - 6, O[1] + 44, 'ㄴ', { size: 28 })}${T(Cc[0], Cc[1] + 44, 'ㄷ', { size: 28 })}${T(A[0] - 30, A[1] - 8, 'ㄱ', { size: 28 })}</g>`
      + ring(O, 16, C.orange, 'r1', .6)
      + `<g class="p3" ${dl(1.8)}>${pill(520, 150, 150, '각 ㄱㄴㄷ', C.blue, C.sky, 28)}</g>`;
    put('3-1/수학/2/각', svg(id, body, motion(id) + `
      .sc-${id} .arm{transform-box:view-box;transform-origin:${O[0]}px ${O[1]}px}
      .on2 .sc-${id} .arm{transform:rotate(-${ang}deg);transition:transform 1.4s ease-in-out .3s}
      .sc-${id} .paper{transition:opacity .5s ease .1s}
      .on3 .sc-${id} .paper{opacity:.28}`));
  })();

  // 꼭짓점: 각 ㄱㄴㄷ → 두 변을 따라 점이 미끄러져 점 ㄴ 에서 만남, '꼭짓점' → 사각형의 네 꼭짓점에도 점이 차례로
  (function () {
    const id = 't31-m2-kkokjitjeom', O = [74, 290], b = 58;
    const E1 = [334, 290], E2 = pt(O, b, 240), A = pt(O, b, 190), Cc = [270, 290];
    const S1 = pt(O, 0, 240), S2 = pt(O, b, 220);
    const slide = (S, d) => `<g class="glide" ${dl(d, `--gx:${f(S[0] - O[0])}px;--gy:${f(S[1] - O[1])}px`)}>${dot(O, { r: 11, color: C.blue })}</g>`;
    const Qd = [[392, 288], [598, 302], [566, 118], [430, 86]];
    const body = drawSeg(O, E1, .2, { cls: 'd1' }) + drawSeg(O, E2, .4, { cls: 'd1' })
      + `<g class="s1" ${dl(.8)}>${dot(O)}${dot(A)}${dot(Cc)}${T(O[0] - 10, O[1] + 40, 'ㄴ', { size: 28 })}${T(Cc[0], Cc[1] + 40, 'ㄷ', { size: 28 })}${T(A[0] - 26, A[1] + 2, 'ㄱ', { size: 28 })}</g>`
      + `<g class="b2 h3">${slide(S1, .2)}${slide(S2, .2)}</g>`
      + ring(O, 20, C.orange, 'r2', 1.5)
      + `<g class="p2" ${dl(1.5)}>${dot(O, { r: 11, color: C.orange })}</g>`
      + `<g class="s2" ${dl(1.7)}>${arrow(150, 252, 96, 280, C.orange)}${T(196, 252, '꼭짓점', { size: 28, color: C.orange })}</g>`
      + `<g class="s3" ${dl(.1)}>${poly(Qd, { fill: C.mint })}</g>`
      + Qd.map((p, i) => `<g class="p3" ${dl(.6 + i * .3)}>${dot(p, { r: 11, color: C.orange })}</g>` + ring(p, 16, C.orange, 'r3', .6 + i * .3)).join('');
    put('3-1/수학/2/꼭짓점', svg(id, body, motion(id) + `
      .sc-${id} .glide{transform:translate(var(--gx),var(--gy))}
      .on2 .sc-${id} .glide{animation:${id}-glide 1.3s ease-in-out .2s both}
      @keyframes ${id}-glide{from{transform:translate(var(--gx),var(--gy))}to{transform:none}}`));
  })();

  // 변: 각 ㄱㄴㄷ → 반직선 ㄴㄱ 이 변 ㄴㄱ, 반직선 ㄴㄷ 이 변 ㄴㄷ → 세모난 화단의 둘레 곧은 선 3개(4 m, 3 m, 5 m)도 변
  (function () {
    const id = 't31-m2-byeon', O = [60, 290], b = 60;
    const E1 = [340, 290], E2 = pt(O, b, 240), A = pt(O, b, 180), Cc = [270, 290];
    const R0 = [420, 290], R1 = [580, 290], R2 = [420, 170];
    const sideLab = (p, q, s, color, gap) => {
      const m = mid(p, q), u = unit(sub(q, p)); let n = [u[1], -u[0]];
      const c = center([R0, R1, R2]); if ((m[0] - c[0]) * n[0] + (m[1] - c[1]) * n[1] < 0) n = mul(n, -1);
      const at = add(m, mul(n, gap)); return T(at[0], at[1] + 8, s, { size: 24, color });
    };
    const body = seg(O, E1) + seg(O, E2)
      + `<g class="s1" ${dl(.2)}>${dot(O)}${dot(A)}${dot(Cc)}${T(O[0] - 10, O[1] + 40, 'ㄴ', { size: 28 })}${T(Cc[0], Cc[1] + 40, 'ㄷ', { size: 28 })}${T(A[0] - 26, A[1] + 2, 'ㄱ', { size: 28 })}</g>`
      + ring(O, 16, C.muted, 'r1', .5)
      + drawSeg(O, E2, .2, { cls: 'd2', color: C.orange, w: 11, extra: 'stroke-opacity=".7"' })
      + drawSeg(O, E1, 1, { cls: 'd2', color: C.blue, w: 11, extra: 'stroke-opacity=".7"' })
      + `<g class="p2" ${dl(.8)}>${pill(206, 168, 112, '변 ㄴㄱ', C.orange, C.peach, 24)}</g>`
      + `<g class="p2" ${dl(1.6)}>${pill(236, 250, 112, '변 ㄴㄷ', C.blue, C.sky, 24)}</g>`
      + `<g class="s3" ${dl(.1)}>${poly([R0, R1, R2], { fill: C.mint, stroke: C.line, w: 3 })}</g>`
      + drawSeg(R0, R1, .4, { cls: 'd3', color: C.green, w: 6 }) + drawSeg(R0, R2, 1, { cls: 'd3', color: C.green, w: 6 }) + drawSeg(R2, R1, 1.6, { cls: 'd3', color: C.green, w: 6 })
      + `<g class="s3" ${dl(.9)}>${sideLab(R0, R1, '4 m', C.green, 28)}</g><g class="s3" ${dl(1.5)}>${sideLab(R0, R2, '3 m', C.green, 36)}</g><g class="s3" ${dl(2.1)}>${sideLab(R2, R1, '5 m', C.green, 28)}</g>`;
    put('3-1/수학/2/변', svg(id, body, motion(id)));
  })();

  // 직각: 동그란 종이를 반으로 접음 → 접은 선끼리 맞닿게 한 번 더 → 종이를 비키면 본뜬 각에 ⌞, '직각' → 접은 종이가 삼각자 귀퉁이에 꼭 맞음
  (function () {
    const id = 't31-m2-jikgak', O = [150, 196], R = 110;
    const wedge = (a0) => { const p = pt(O, a0, R), q = pt(O, a0 + 90, R); return `<path d="M${P(O)} L${P(p)} A${R} ${R} 0 0 0 ${P(q)} Z" fill="${C.peach}" fill-opacity=".85" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`; };
    const paper = wedge(0) + `<g class="fb">${wedge(270)}</g><g class="fl">${wedge(90)}<g class="fb">${wedge(180)}</g></g>`;
    const Qc = [420, 326], tri = [Qc, [610, 326], [420, 172]];
    const body = `<g class="s4" ${dl(.1)}>${poly(tri, { fill: C.sky, stroke: C.blue, w: 3, op: .7 })}</g>`
      + drawSeg(O, [306, 196], 1.2, { cls: 'd3', w: 4 }) + drawSeg(O, [150, 46], 1.2, { cls: 'd3', w: 4 })
      + `<g class="m3" ${dl(.2, '--mx:200px;--my:0px')}><g class="m4" ${dl(.2, '--mx:70px;--my:130px')}>${paper}</g></g>`
      + `<g class="s3" ${dl(1.7)}>${rmark(O, [300, 196], [150, 50], { s: 24 })}</g>` + ring(O, 18, C.red, 'r3', 1.8)
      + `<g class="p3" ${dl(2)}>${pill(236, 132, 96, '직각', C.red, C.peach, 28)}</g>`
      + `<g class="s4" ${dl(1.3)}>${rmark(Qc, [610, 326], [420, 172], { s: 24 })}</g>` + ring(Qc, 18, C.red, 'r4', 1.4);
    put('3-1/수학/2/직각', svg(id, body, motion(id) + `
      .sc-${id} .fb{transform-box:view-box;transform-origin:0 ${O[1]}px;transition:transform 1s ease-in-out .2s}
      .sc-${id} .fl{transform-box:view-box;transform-origin:${O[0]}px 0;transition:transform 1s ease-in-out .2s}
      .on1 .sc-${id} .fb{transform:scaleY(-1)}
      .on2 .sc-${id} .fl{transform:scaleX(-1)}
      .sc-${id} .m4{transition-duration:1.1s}`));
  })();

  // 삼각형: 도형판 못 세 개에 고무줄 → 곧은 선 1, 2, 3 → 못 하나를 옮겨도 곧은 선 3개 → '삼각형'
  (function () {
    const id = 't31-m2-samgak';
    const T0 = [PEG(1, 4), PEG(5, 4), PEG(2, 1)], T1 = [PEG(1, 4), PEG(5, 4), PEG(6, 2)];
    const m = morph(id, 'b', [T0, T1], [2], { fill: C.peach, stroke: C.orange, width: 5 });
    const body = geoboard()
      + `<g class="b1"><g class="k3" ${dl(.3)}>${m.body}</g></g>`
      + T0.map((p, i) => ring(p, 12, C.orange, 'r1', .1 + i * .2)).join('') + ring(T1[2], 12, C.orange, 'r2', 1.5)
      + `<g class="h2">${sideNums(T0, 'p1', .7)}</g>` + sideNums(T1, 'p3', .2)
      + `<g class="p3" ${dl(1.2)}>${pill(550, 180, 120, '삼각형', C.orange, C.peach, 28)}</g>`;
    put('3-1/수학/2/삼각형', svg(id, body, motion(id) + m.css));
  })();

  // 직각삼각형: 네 각이 직각인 네모 종이 → 마주 보는 귀퉁이까지 곧게 잘라 두 조각으로 → 조각마다 직각이 하나, '직각삼각형'
  (function () {
    const id = 't31-m2-jikgaksamgak';
    const A = [100, 270], B = [340, 270], Cc = [340, 110], D = [100, 110];
    const sq = [A, B, Cc, D], o = { s: 22 };
    const piece = (pts, ri, mx, my, arcs) => `<g class="m2" ${dl(1, `--mx:${mx}px;--my:${my}px`)}>${poly(pts, { fill: C.mint, stroke: C.mint, w: 1.5 })}<g class="s2" ${dl(.9)}>${poly(pts, { fill: 'none' })}</g>`
      + `<g class="k3" ${dl(.2)}>${markAt(pts, ri, o)}</g><g class="s3" ${dl(.6)}>${arcs}</g></g>`;
    const body = piece([A, B, Cc], 1, 50, 30, arcAt(A, B, Cc, 34, C.blue) + arcAt(Cc, A, B, 34, C.blue))
      + piece([Cc, D, A], 1, -50, -30, arcAt(Cc, D, A, 34, C.blue) + arcAt(A, Cc, D, 34, C.blue))
      + `<g class="g2" ${dl(.9)}>${poly(sq, { fill: 'none' })}</g>`
      + `<g class="h2">${markAt(sq, 0, o)}${markAt(sq, 2, o)}</g>`
      + `<g class="g2" ${dl(1.2)}>${drawSeg(A, Cc, .2, { cls: 'd2', color: C.red, w: 3.5 })}</g>`
      + `<g class="p3" ${dl(1)}>${pill(522, 190, 170, '직각삼각형', C.green, C.mint, 26)}</g>`;
    put('3-1/수학/2/직각삼각형', svg(id, body, motion(id)));
  })();

  // 사각형: 흩어진 빨대 4개 → 끝을 이어 붙여 뾰족한 곳이 네 군데 → 곧은 선 4개로 둘러싸임(1~4), '사각형'
  (function () {
    const id = 't31-m2-sagak';
    const Q = [[140, 290], [410, 302], [460, 120], [200, 80]], colors = [C.orange, C.blue, C.green, C.purple];
    let straws = '', css = '';
    Q.forEach((p, j) => {
      const q = Q[(j + 1) % 4], c = mid(p, q), a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
      const s = [300, 70 + j * 56];
      straws += `<path class="st st${j}" d="M${P(p)} L${P(q)}" stroke="${colors[j]}" stroke-width="12" stroke-linecap="round" fill="none"/>`;
      css += `.sc-${id} .st${j}{transform:translate(${f(s[0] - c[0])}px,${f(s[1] - c[1])}px) rotate(${f(-a)}deg)}.on2 .sc-${id} .st${j}{transition-delay:${.2 + j * .25}s}`;
    });
    const body = `<g class="s3" ${dl(.1)}>${poly(Q, { fill: C.mint, stroke: 'none' })}</g>`
      + `<g class="b1">${straws}</g>`
      + Q.map((p, i) => ring(p, 16, C.red, 'r2', 1.8 + i * .15)).join('')
      + sideNums(Q, 'p3', .4, { gap: 30 })
      + `<g class="p3" ${dl(1.6)}>${pill(562, 210, 116, '사각형', C.green, C.mint, 28)}</g>`;
    put('3-1/수학/2/사각형', svg(id, body, motion(id) + `
      .sc-${id} .st{transform-box:fill-box;transform-origin:center}
      .on2 .sc-${id} .st{transform:none;transition:transform 1s ease-in-out}` + css));
  })();

  // 직사각형: 도형판 사각형(직각 두 개) → 꼭짓점 하나를 옆 못으로 옮겨 네 각 모두 직각 → '직사각형'
  (function () {
    const id = 't31-m2-jiksagak';
    const S0 = [PEG(1, 4), PEG(5, 4), PEG(4, 1), PEG(1, 1)], S1 = [PEG(1, 4), PEG(5, 4), PEG(5, 1), PEG(1, 1)];
    const m = morph(id, 'q', [S0, S1], [2], { fill: C.sky, stroke: C.blue, width: 5 });
    const o = { s: 22 };
    const body = geoboard()
      + `<g class="b1"><g>${m.body}</g></g>`
      + `<g class="b1"><g class="k3" ${dl(.2)}>${markAt(S0, 0, o)}${markAt(S0, 3, o)}</g></g>`
      + `<g class="b1 h2">${arcAt(S0[1], S0[0], S0[2], 30, C.purple)}${arcAt(S0[2], S0[1], S0[3], 30, C.purple)}</g>`
      + ring(S0[2], 12, C.orange, 'r2', .1) + ring(S1[2], 12, C.orange, 'r2', 1.5)
      + `<g class="s2" ${dl(1.6)}><g class="k3" ${dl(.2)}>${markAt(S1, 1, o)}${markAt(S1, 2, o)}</g></g>`
      + `<g class="p3" ${dl(1)}>${pill(554, 180, 136, '직사각형', C.blue, C.sky, 28)}</g>`;
    put('3-1/수학/2/직사각형', svg(id, body, motion(id) + m.css));
  })();

  // 정사각형: 20 cm × 15 cm 직사각형 종이 → 비스듬히 접어 보고 남는 띠를 잘라 냄 → 네 변 모두 15 cm, 네 각 직각
  // → 사각형 ⊃ 직사각형 ⊃ 정사각형 상자
  (function () {
    const id = 't31-m2-jeongsagak', x0 = 80, y0 = 130;
    const sqP = [[x0, y0 + 150], [x0 + 150, y0 + 150], [x0 + 150, y0], [x0, y0]];
    const rcP = [[x0, y0 + 150], [x0 + 200, y0 + 150], [x0 + 200, y0], [x0, y0]];
    const o = { s: 18 };
    const strip = `<g class="g4" ${dl(0)}><g class="m2" ${dl(1.3, '--mx:30px;--my:40px')}><g class="x2" ${dl(1.9)}>`
      + `<rect x="${x0 + 150}" y="${y0}" width="50" height="150" fill="${C.mint}"/><g class="s2" ${dl(1.2)}><rect x="${x0 + 150}" y="${y0}" width="50" height="150" fill="none" stroke="${C.green}" stroke-width="3"/></g>${markAt(rcP, 1, o)}${markAt(rcP, 2, o)}</g></g></g>`;
    const nest = (x, y, w, h, s, color) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="white" fill-opacity=".5" stroke="${color}" stroke-width="3"/>${T(x + 12, y + 28, s, { size: 20, color, anchor: 'start' })}`;
    const body = strip
      + `<g class="k4" ${dl(.4)}><rect x="${x0}" y="${y0}" width="150" height="150" fill="${C.mint}"/><g class="s2" ${dl(1.2)}><rect x="${x0}" y="${y0}" width="150" height="150" fill="none" stroke="${C.green}" stroke-width="3"/></g></g>`
      + `<g class="g2" ${dl(1.2)}><rect x="${x0}" y="${y0}" width="200" height="150" fill="none" stroke="${C.green}" stroke-width="3"/></g>`
      + markAt(rcP, 0, o) + markAt(rcP, 3, o)
      + `<g class="h2">${T(x0 + 100, y0 - 14, '20 cm', { size: 22 })}</g>` + T(x0 - 20, y0 + 82, '15 cm', { size: 20, anchor: 'end' })
      + `<g class="h3">${drawSeg([x0, y0], [x0 + 150, y0 + 150], .2, { cls: 'd2', color: C.muted, w: 3 })}</g>`
      + `<g class="h3">${drawSeg([x0 + 150, y0 - 16], [x0 + 150, y0 + 166], .8, { cls: 'd2', color: C.red, w: 3.5 })}</g>`
      + `<g class="s3" ${dl(.2)}>${markAt(sqP, 1, o)}${markAt(sqP, 2, o)}</g>`
      + sqP.map((p, i) => `<g class="p3" ${dl(.6 + i * .2)}>${tick(p, sqP[(i + 1) % 4])}</g>`).join('')
      + tag(x0 + 75, y0 - 14, '15 cm', C.green, 's3', 1.4, 22)
      + tag(x0 + 75, y0 + 196, '정사각형', C.green, 'p4', 1.6, 28)
      + `<g class="s4" ${dl(.2)}>${nest(288, 18, 342, 324, '사각형', C.purple)}${poly([[560, 228], [614, 236], [620, 168], [574, 158]], { fill: C.lilac, stroke: C.purple, w: 3 })}</g>`
      + `<g class="s4" ${dl(.7)}>${nest(302, 58, 244, 270, '직사각형', C.blue)}<rect x="470" y="182" width="66" height="46" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`
      + `<g class="s4" ${dl(1.2)}>${nest(316, 98, 146, 216, '정사각형', C.green)}<rect x="354" y="172" width="70" height="70" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>`;
    put('3-1/수학/2/정사각형', svg(id, body, motion(id) + `.sc-${id} .m2{transition-duration:.8s}`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
