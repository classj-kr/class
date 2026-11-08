// 수학 4-2 6단원 다각형: 낱말 도식
// 오각형·육각형은 한 변의 가운데에 꼭짓점을 하나 더 두고 끌어내어 변을 늘린다(모양 바꾸기, math-4.js 와 같은 방법).
//   새 꼭짓점은 처음부터 변 위에 있으면 matrix 가 납작해져 섞이지 않으므로 1만큼 바깥으로 비켜 둔다.
// 팔각형은 정사각형 네 귀퉁이를 잘라 낸다: 테두리는 모양 바꾸기, 안쪽 색은 팔각형 + 떨어져 나가는 귀퉁이 삼각형 넷.
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
  const seg = (p, q, { color = C.ink, w = 4, cls = '', extra = '' } = {}) =>
    `<path class="${cls}" d="M${P(p)} L${P(q)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none" ${extra}/>`;
  const drawSeg = (p, q, o = {}) => seg(p, q, { ...o, extra: `pathLength="100" ${o.extra || ''}` });
  const dot = (p, { r = 7, color = C.ink, cls = '' } = {}) => `<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${color}"/>`;
  const poly = (pts, { fill = 'white', stroke = C.ink, w = 4, cls = '' } = {}) =>
    `<polygon class="${cls}" points="${pts.map(P).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const regular = (cx, cy, r, n, start = -90) => Array.from({ length: n }, (_, k) => {
    const a = (start + 360 * k / n) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const tick = (p, q, { n = 1, color = C.green } = {}) => {
    const m = mid(p, q), u = unit(sub(q, p)), v = [-u[1], u[0]];
    let s = '';
    for (let i = 0; i < n; i++) {
      const c = add(m, mul(u, (i - (n - 1) / 2) * 7));
      s += seg(add(c, mul(v, -9)), add(c, mul(v, 9)), { color, w: 3 });
    }
    return s;
  };
  const ticksOf = (pts, o) => pts.map((p, i) => tick(p, pts[(i + 1) % pts.length], o)).join('');
  // 각 표시(호): 꼭짓점 V 에서 A 쪽과 B 쪽 사이, 작은 쪽으로
  const arcAt = (V, A, B, r, color) => {
    const u = unit(sub(A, V)), v = unit(sub(B, V)), p = add(V, mul(u, r)), q = add(V, mul(v, r));
    const cross = u[0] * v[1] - u[1] * v[0];
    return `<path d="M${P(p)} A${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${P(q)}" stroke="${color}" stroke-width="3.5" fill="none"/>`;
  };
  const arcsOf = (pts, r, color) => pts.map((p, i) => arcAt(p, pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length], r, typeof color === 'function' ? color(i) : color)).join('');
  const rmark = (O, a, b, { s = 16, color = C.green } = {}) => {
    const u = unit(sub(a, O)), v = unit(sub(b, O));
    const p1 = add(O, mul(u, s)), p2 = add(p1, mul(v, s)), p3 = add(O, mul(v, s));
    return `<path d="M${P(p1)} L${P(p2)} L${P(p3)}" stroke="${color}" stroke-width="3" fill="none"/>`;
  };
  const marksOf = (pts, o) => pts.map((p, i) => rmark(p, pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length], o)).join('');
  const cross = (c, s = 20) => `<path d="M${c[0] - s} ${c[1] - s} L${c[0] + s} ${c[1] + s} M${c[0] + s} ${c[1] - s} L${c[0] - s} ${c[1] + s}" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`;
  // 변 번호: 변 가운데에서 도형 바깥쪽으로 gap 만큼
  const sideNums = (pts, { gap = 24, cls = 'nm', size = 22, color = C.purple, c = center(pts) } = {}) => pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length], m = mid(p, q), u = unit(sub(q, p));
    let nrm = [u[1], -u[0]];
    if ((m[0] - c[0]) * nrm[0] + (m[1] - c[1]) * nrm[1] < 0) nrm = mul(nrm, -1);
    const at = add(m, mul(nrm, gap));
    return `<g class="${cls} ${cls}${i}">${text(f(at[0]), f(at[1] + size * .36), i + 1, { size, color })}</g>`;
  }).join('');

  const drawCss = (id, n, cls, delay = 0, dur = .8) =>
    `.sc-${id} .${cls}{stroke-dasharray:100;stroke-dashoffset:100}.on${n} .sc-${id} .${cls}{stroke-dashoffset:0;transition:stroke-dashoffset ${dur}s ease ${delay}s}`;
  const popCss = (id, n, cls, delay = 0) =>
    `.sc-${id} .${cls}{transform-box:fill-box;transform-origin:center;transform:scale(0)}.on${n} .sc-${id} .${cls}{transform:none;transition:transform .45s cubic-bezier(.3,1.6,.6,1) ${delay}s}`;
  const fadeCss = (id, n, cls, delay = 0, dur = .4) =>
    `.sc-${id} .${cls}{opacity:0}.on${n} .sc-${id} .${cls}{opacity:1;transition:opacity ${dur}s ease ${delay}s}`;
  const flashCss = (id, n, sel, delay = 0) =>
    `.on${n} .sc-${id} ${sel}{animation:${id}-fl 1.4s ease-in-out ${delay}s both}@keyframes ${id}-fl{0%,50%,100%{opacity:1}25%,75%{opacity:.25}}`;
  const numsCss = (id, n, cls, count, delay, step = .12) => Array.from({ length: count }, (_, i) => popCss(id, n, `${cls}${i}`, delay + step * i)).join('');

  // 모양 바꾸기(닫힌 다각형): 변은 짧은 선을 matrix 로, 안쪽 색은 꼭짓점 0 에서 부채꼴 삼각형
  const STEPS = 18;
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (A, B, t) => A.map((p, i) => [p[0] + (B[i][0] - p[0]) * t, p[1] + (B[i][1] - p[1]) * t]);
  const segM = (p, q) => { const d = sub(q, p); return `matrix(${f(d[0])},${f(d[1])},${f(-d[1])},${f(d[0])},${f(p[0])},${f(p[1])})`; };
  const triM = (a, b, c) => `matrix(${f(b[0] - a[0])},${f(b[1] - a[1])},${f(c[0] - a[0])},${f(c[1] - a[1])},${f(a[0])},${f(a[1])})`;
  function morph(id, name, states, beats, { fill = C.mint, stroke = C.ink, width = 4, dur = 1.2, delay = .3 } = {}) {
    const n = states[0].length, parts = [];
    for (let j = 0; j < n; j++) parts.push({ cls: `${name}s${j}`, m: (q) => segM(q[j], q[(j + 1) % n]), j });
    if (fill) for (let k = 1; k < n - 1; k++) parts.push({ cls: `${name}t${k}`, m: (q) => triM(q[0], q[k], q[k + 1]) });
    let fills = '', sides = '', css = '';
    for (const part of parts) {
      const base = part.m(states[0]);
      if (part.j !== undefined) sides += `<path class="${part.cls}" d="M0 0H1" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" vector-effect="non-scaling-stroke" fill="none" style="transform:${base}"/>`;
      else fills += `<path class="${part.cls}" d="M0 0L1 0L0 1Z" fill="${fill}" stroke="${fill}" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="transform:${base}"/>`;
      beats.forEach((b, i) => {
        const kf = Array.from({ length: STEPS + 1 }, (_, s) => `${f(100 * s / STEPS)}%{transform:${part.m(lerp(states[i], states[i + 1], ease(s / STEPS)))}}`).join('');
        css += `@keyframes ${id}-${part.cls}-${i}{${kf}}.on${b} .sc-${id} .${part.cls}{animation:${id}-${part.cls}-${i} ${dur}s linear ${delay}s both}`;
      });
    }
    return { body: `${fills}${sides}`, css };
  }
  const MOVE = 'cubic-bezier(.65,0,.35,1)';

  // 선분: 점 ㄱ, ㄴ → 자가 올라와 대고 두 점을 곧게 이음 → 자가 비키고 선분이 반짝임, '선분 ㄱㄴ'
  {
    const id = 't42-m6-seonbun';
    const A = [170, 220], B = [470, 140], c = mid(A, B);
    const ang = Math.atan2(B[1] - A[1], B[0] - A[0]) * 180 / Math.PI;
    let marks = '';
    for (let x = -200; x <= 200; x += 20) marks += `M${f(c[0] + x)} ${f(c[1] + 4)} V${f(c[1] + (x % 100 === 0 ? 24 : 15))} `;
    const ruler = `<g transform="rotate(${f(ang)} ${P(c)})"><g class="rl"><rect x="${f(c[0] - 210)}" y="${f(c[1] + 4)}" width="420" height="52" rx="4" fill="${C.yellow}" fill-opacity=".55" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="${marks}" stroke="${C.orange}" stroke-width="2"/></g></g>`;
    const body = `<g class="b2 h3">${ruler}</g>`
      + `<g class="b2">${drawSeg(A, B, { w: 5, cls: 'sg' })}</g>`
      + `<g class="b1"><g class="p1">${dot(A, { r: 8 })}</g><g class="p2">${dot(B, { r: 8 })}</g>${text(A[0] - 18, A[1] - 16, 'ㄱ', { size: 30 })}${text(B[0] + 20, B[1] - 16, 'ㄴ', { size: 30 })}</g>`
      + `<g class="b3"><g class="lab">${text(c[0], 300, '선분 ㄱㄴ', { size: 30, color: C.green })}</g></g>`;
    put('4-2/수학/6/선분', svg(id, body, `
      ${popCss(id, 1, 'p1', .2)}${popCss(id, 1, 'p2', .5)}
      .sc-${id} .rl{transform:translateY(90px)}
      .on2 .sc-${id} .rl{transform:none;transition:transform .7s ease-out .1s}
      ${drawCss(id, 2, 'sg', .9, .9)}
      .on3 .sc-${id} .sg{stroke:${C.green};transition:stroke .4s ease .3s}
      ${flashCss(id, 3, '.sg', .5)}
      ${popCss(id, 3, 'lab', .6)}
    `));
  }

  // 곡선: 점 ㄱ, ㄴ을 굽은 선으로 이음 → 원과 물결 모양도 그려짐 → 곧은 선분(점선)과 견주고 곡선들이 반짝임, '곡선'
  {
    const id = 't42-m6-gokseon';
    const A = [80, 220], B = [330, 220];
    const curve = `M${P(A)} C120 80 290 80 ${P(B)}`;
    const body = `<g class="b3"><g class="st">${seg(A, B, { w: 4, color: C.muted, extra: 'stroke-dasharray="9 8"' })}${text(205, 252, '선분', { size: 22, color: C.muted })}</g></g>`
      + `<g class="b1"><g class="cv"><path class="c1" d="${curve}" pathLength="100" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`
      + `${dot(A, { r: 8 })}${dot(B, { r: 8 })}${text(A[0], 260, 'ㄱ', { size: 30 })}${text(B[0], 260, 'ㄴ', { size: 30 })}</g>`
      + `<g class="b2"><g class="cv"><circle class="c2" cx="495" cy="130" r="62" pathLength="100" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round" transform="rotate(-90 495 130)"/>`
      + `<path class="c3" d="M380 300 q30 -44 60 0 t60 0 t60 0 t60 0" pathLength="100" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`
      + `<g class="b3"><g class="lab">${text(205, 98, '곡선', { size: 28, color: C.orange })}</g></g>`;
    put('4-2/수학/6/곡선', svg(id, body, `
      ${drawCss(id, 1, 'c1', .2, 1.1)}
      ${drawCss(id, 2, 'c2', .2, 1)}${drawCss(id, 2, 'c3', 1, 1)}
      ${fadeCss(id, 3, 'st', .2)}
      ${flashCss(id, 3, '.cv', .8)}
      ${popCss(id, 3, 'lab', .6)}
    `));
  }

  // 다각형: 도형 여섯 → 곡선이 섞인 두 도형의 곡선이 빨개지고 흐려지며 ✕ → 끊어진 도형의 틈에 빨간 원, 흐려지며 ✕ → 남은 셋이 색칠되며 출렁
  {
    const id = 't42-m6-dagak';
    const tri = [[55, 155], [165, 155], [95, 60]];
    const pent = [[480, 150], [580, 158], [602, 90], [540, 55], [470, 85]];
    const arrowShape = [[460, 245], [530, 245], [530, 212], [602, 260], [530, 308], [530, 275], [460, 275]];
    const S = `stroke="${C.ink}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
    const body = `<g class="b1">`
      + `<g class="ok s1">${poly(tri, { cls: 'pf' })}</g>`
      + `<g class="cvs s2"><circle cx="320" cy="108" r="50" fill="white" ${S} class="red"/></g>`
      + `<g class="ok s3">${poly(pent, { cls: 'pf' })}</g>`
      + `<g class="opn s4"><path d="M85 215 H160 V300 H60" fill="none" ${S}/></g>`
      + `<g class="cvs s5"><path d="M335 215 H265 V305 H335" fill="white" ${S}/><path class="red" d="M335 305 A45 45 0 0 0 335 215" fill="none" ${S}/></g>`
      + `<g class="ok s6">${poly(arrowShape, { cls: 'pf' })}</g></g>`
      + `<g class="b2"><g class="x1">${cross([320, 108])}</g><g class="x2">${cross([318, 260])}</g></g>`
      + `<g class="b3"><g class="gap"><circle cx="72" cy="258" r="24" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="7 5"/></g><g class="x3">${cross([110, 260])}</g></g>`;
    put('4-2/수학/6/다각형', svg(id, body, `
      ${[1, 2, 3, 4, 5, 6].map((i) => popCss(id, 1, `s${i}`, .1 + .12 * i)).join('')}
      .on2 .sc-${id} .red{stroke:${C.red};transition:stroke .4s ease .2s}
      .on2 .sc-${id} .cvs{opacity:.3;transition:opacity .5s ease 1.1s}
      ${popCss(id, 2, 'x1', 1.3)}${popCss(id, 2, 'x2', 1.45)}
      ${popCss(id, 3, 'gap', .2)}
      .on3 .sc-${id} .opn{opacity:.3;transition:opacity .5s ease 1s}
      .on3 .sc-${id} .gap{opacity:.4;transition:transform .45s cubic-bezier(.3,1.6,.6,1) .2s,opacity .5s ease 1s}
      ${popCss(id, 3, 'x3', 1.2)}
      .on4 .sc-${id} .pf{fill:${C.mint};transition:fill .5s ease .2s}
      .on4 .sc-${id} .ok{animation:${id}-bob .8s ease-in-out .6s 2}
      @keyframes ${id}-bob{50%{transform:scale(1.08)}}
    `));
  }

  // 변: 다각형 → 선분 다섯이 바깥으로 떨어져 나오며 1~5 → 다시 붙고 주황으로 반짝임, '변'
  {
    const id = 't42-m6-byeon';
    const V = [[230, 290], [420, 290], [470, 170], [330, 80], [190, 160]], c = center(V);
    const sides = V.map((p, i) => {
      const q = V[(i + 1) % V.length], m = mid(p, q), u = unit(sub(q, p));
      let nrm = [u[1], -u[0]];
      if ((m[0] - c[0]) * nrm[0] + (m[1] - c[1]) * nrm[1] < 0) nrm = mul(nrm, -1);
      const at = add(m, mul(nrm, 26));
      return `<g class="sd" style="--dx:${f(nrm[0] * 26)}px;--dy:${f(nrm[1] * 26)}px;--d:${f(.15 * i)}s">${seg(p, q, { w: 5, cls: 'ln' })}`
        + `<g class="nm">${text(f(at[0]), f(at[1] + 8), i + 1, { size: 22, color: C.purple })}</g></g>`;
    }).join('');
    const bot = mid(V[0], V[1]);
    const body = `<g class="b1"><g class="fl">${poly(V, { fill: C.mint, stroke: 'none' })}</g>${sides}</g>`
      + `<g class="b3"><g class="lab">${text(bot[0], 352, '변', { size: 30, color: C.orange })}<path d="M${bot[0]} 322 V${bot[1] + 10}" stroke="${C.orange}" stroke-width="3"/></g></g>`;
    put('4-2/수학/6/변', svg(id, body, `
      .on2 .sc-${id} .sd{transform:translate(var(--dx),var(--dy));transition:transform .6s ${MOVE} var(--d)}
      .on2 .sc-${id} .fl{opacity:.35;transition:opacity .4s}
      .sc-${id} .nm{opacity:0}
      .on2 .sc-${id} .nm{opacity:1;transition:opacity .3s ease calc(var(--d) + .5s)}
      .on3 .sc-${id} .sd{transform:none;transition:transform .6s ${MOVE} .1s}
      .on3 .sc-${id} .fl{opacity:1}
      .on3 .sc-${id} .nm{opacity:0;transition:opacity .2s}
      .on3 .sc-${id} .ln{stroke:${C.orange};transition:stroke .4s ease .7s}
      ${flashCss(id, 3, '.sd', .9)}
      ${popCss(id, 3, 'lab', .9)}
    `));
  }

  // 꼭짓점: 다각형 → 맨 위 꼭짓점에서 만나는 두 변이 주황, 고리가 퍼지며 빨간 점, '꼭짓점' → 나머지 꼭짓점에도 점이 차례로
  {
    const id = 't42-m6-kkokjitjeom';
    const V = [[200, 280], [450, 300], [500, 150], [350, 70], [170, 140]];
    const sides = V.map((p, i) => seg(p, V[(i + 1) % V.length], { w: 5, cls: i === 2 || i === 3 ? 'hs' : '' })).join('');
    const others = [0, 1, 2, 4].map((i, k) => `<g class="vd vd${k}">${dot(V[i], { r: 10, color: C.red })}</g>`).join('');
    const body = `<g class="b1">${poly(V, { fill: C.mint, stroke: 'none' })}${sides}</g>`
      + `<g class="b2"><g class="ring"><circle cx="${V[3][0]}" cy="${V[3][1]}" r="14" fill="none" stroke="${C.red}" stroke-width="3"/></g><g class="top">${dot(V[3], { r: 10, color: C.red })}</g>`
      + `<g class="lab">${text(V[3][0] + 28, V[3][1] - 6, '꼭짓점', { size: 26, color: C.red, anchor: 'start' })}</g></g>`
      + `<g class="b3">${others}</g>`;
    put('4-2/수학/6/꼭짓점', svg(id, body, `
      .on2 .sc-${id} .hs{stroke:${C.orange};stroke-width:7;transition:stroke .4s ease .1s,stroke-width .4s ease .1s}
      .sc-${id} .ring{transform-box:fill-box;transform-origin:center;opacity:0}
      .on2 .sc-${id} .ring{animation:${id}-ring 1s ease-out .6s 2 both}
      @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(3)}}
      ${popCss(id, 2, 'top', .6)}${popCss(id, 2, 'lab', 1.1)}
      ${numsCss(id, 3, 'vd', 4, .2, .25)}
      ${flashCss(id, 3, '.vd', 1.4)}
    `));
  }

  // 오각형·육각형: 한 변의 가운데를 끌어내 변이 하나 늘어남, 번호가 다시 세어짐 → 다른 모양의 같은 이름 도형 둘
  const growScene = ({ id, key, S0, S1, moving, examples }) => {
    const m = morph(id, 'q', [S0, S1], [2]);
    const c = center(S1);
    const before = S0.filter((_, i) => i !== moving);
    const body = `<g class="b1"><g class="main">${m.body}</g></g>`
      + `<g class="b1 h2">${sideNums(before, { cls: 'na', c, gap: 36 })}</g>`
      + `<g class="b1 h3"><g class="mv">${dot(S0[moving], { r: 9, color: C.red })}</g></g>`
      + `<g class="b2">${sideNums(S1, { cls: 'nb', c })}</g>`
      + `<g class="b3">${examples.map((e, i) => `<g class="ex ex${i}">${poly(e, { fill: C.mint })}</g>`).join('')}</g>`;
    const d = sub(S1[moving], S0[moving]);
    put(key, svg(id, body, `
      ${m.css}
      ${numsCss(id, 1, 'na', before.length, .2)}
      .on2 .sc-${id} .mv{transform:translate(${f(d[0])}px,${f(d[1])}px);transition:transform 1.2s ${MOVE} .3s}
      ${numsCss(id, 2, 'nb', S1.length, 1.5, .1)}
      ${examples.map((_, i) => popCss(id, 3, `ex${i}`, .2 + .3 * i)).join('')}
      ${flashCss(id, 3, '.main', .9)}
    `));
  };
  growScene({
    id: 't42-m6-ogak', key: '4-2/수학/6/오각형', moving: 3,
    S0: [[70, 300], [330, 300], [330, 160], [200, 159], [70, 160]],
    S1: [[70, 300], [330, 300], [330, 160], [200, 60], [70, 160]],
    examples: [regular(510, 112, 64, 5), [[440, 318], [580, 318], [580, 222], [510, 262], [440, 222]]]
  });
  growScene({
    id: 't42-m6-yukgak', key: '4-2/수학/6/육각형', moving: 2,
    S0: [[70, 300], [330, 300], [331, 230], [330, 160], [200, 70], [70, 160]],
    S1: [[70, 300], [330, 300], [400, 230], [330, 160], [200, 70], [70, 160]],
    examples: [regular(530, 105, 62, 6, 0), [[462, 330], [602, 330], [602, 290], [502, 290], [502, 192], [462, 192]]]
  });

  // 팔각형: 정사각형(변 넷) → 네 귀퉁이에 자를 금, 귀퉁이가 잘려 떨어지며 변이 여덟 → 다른 모양의 팔각형 둘
  {
    const id = 't42-m6-palgak';
    const a = 70, b = 310, k = 240 / (2 + Math.SQRT2);
    const O1 = [[a + k, a], [b - k, a], [b, a + k], [b, b - k], [b - k, b], [a + k, b], [a, b - k], [a, a + k]];
    const O0 = [[a + 1, a], [b - 1, a], [b, a + 1], [b, b - 1], [b - 1, b], [a + 1, b], [a, b - 1], [a, a + 1]];
    const m = morph(id, 'q', [O0, O1], [2], { fill: null, delay: .8 });
    const sq = [[a, a], [b, a], [b, b], [a, b]];
    const corners = [[[a, a], O1[0], O1[7]], [[b, a], O1[2], O1[1]], [[b, b], O1[4], O1[3]], [[a, b], O1[6], O1[5]]];
    const cuts = corners.map(([, p, q]) => seg(p, q, { w: 3, color: C.red, extra: 'stroke-dasharray="7 6"' })).join('');
    const fall = corners.map((t, i) => `<g class="cn" style="--r:${i % 2 ? 25 : -25}deg">${poly(t, { fill: C.mint, stroke: 'none' })}</g>`).join('');
    const T = [[410, 48], [604, 48], [604, 96], [532, 96], [532, 190], [482, 190], [482, 96], [410, 96]];
    const oct = [[448, 244], [482, 218], [542, 222], [584, 248], [578, 292], [540, 318], [480, 312], [444, 286]];
    const body = `<g class="b1"><g class="main">${poly(O1, { fill: C.mint, stroke: 'none' })}${fall}${m.body}</g></g>`
      + `<g class="b1 h2">${sideNums(sq, { cls: 'na' })}</g>`
      + `<g class="b2 h3"><g class="cut">${cuts}</g></g>`
      + `<g class="b2">${sideNums(O1, { cls: 'nb', gap: 22 })}</g>`
      + `<g class="b3"><g class="ex ex0">${poly(T, { fill: C.mint })}</g><g class="ex ex1">${poly(oct, { fill: C.mint })}</g></g>`;
    put('4-2/수학/6/팔각형', svg(id, body, `
      ${m.css}
      ${numsCss(id, 1, 'na', 4, .2)}
      ${fadeCss(id, 2, 'cut', .1)}
      .on2 .sc-${id} .cn{transform:translateY(70px) rotate(var(--r));opacity:0;transform-box:fill-box;transform-origin:center;transition:transform 1.1s ease-in .8s,opacity .6s ease 1.3s}
      ${numsCss(id, 2, 'nb', 8, 1.6, .07)}
      ${popCss(id, 3, 'ex0', .2)}${popCss(id, 3, 'ex1', .5)}
      ${flashCss(id, 3, '.main', .9)}
    `));
  }

  // 정다각형: 마름모(변 같음, 각 다름) → 직사각형(각 같음, 변 다름) → 정육각형(둘 다 같음) → 정삼각형·정사각형으로 바뀌며 셋이 출렁
  {
    const id = 't42-m6-jeongdagak';
    // ○ 는 획이 가늘어 짙은 C.green 이면 거의 검게 보인다 — 밝은 초록에 테두리 획을 더해 굵게
    const O = '<tspan fill="#2e9b57" stroke="#2e9b57" stroke-width="1.2">○</tspan>', X = '<tspan fill="' + C.red + '">✕</tspan>';
    const verdict = (x, s, a, cls) => `<g class="${cls}">${text(x, 330, `변 ${s ? O : X}  각 ${a ? O : X}`, { size: 22 })}</g>`;
    const rh = [[23.4, 170], [110, 120], [196.6, 170], [110, 220]];
    const rc = [[235, 130], [405, 130], [405, 210], [235, 210]];
    const hx = regular(530, 170, 80, 6, 0);
    const t3 = regular(110, 182, 72, 3);
    const s4 = [[260, 110], [380, 110], [380, 230], [260, 230]];
    const body = `<g class="b1 h4"><g class="sh">${poly(rh, { fill: C.mint })}${ticksOf(rh)}${arcsOf(rh, 24, (i) => (i % 2 ? C.blue : C.orange))}</g>${text(110, 292, '마름모', { size: 22 })}${verdict(110, true, false, 'vd')}</g>`
      + `<g class="b2 h4"><g class="sh">${poly(rc, { fill: C.mint })}${tick(rc[0], rc[1])}${tick(rc[2], rc[3])}${tick(rc[1], rc[2], { n: 2 })}${tick(rc[3], rc[0], { n: 2 })}${marksOf(rc)}</g>${text(320, 292, '직사각형', { size: 22 })}${verdict(320, false, true, 'vd')}</g>`
      + `<g class="b3"><g class="sh hx">${poly(hx, { fill: C.mint })}${ticksOf(hx)}${arcsOf(hx, 20, C.green)}</g>${text(530, 292, '정육각형', { size: 22 })}${verdict(530, true, true, 'vd')}</g>`
      + `<g class="b4"><g class="sh nw nw0">${poly(t3, { fill: C.mint })}${ticksOf(t3)}${arcsOf(t3, 22, C.green)}</g>${text(110, 292, '정삼각형', { size: 22 })}${verdict(110, true, true, '')}</g>`
      + `<g class="b4"><g class="sh nw nw1">${poly(s4, { fill: C.mint })}${ticksOf(s4)}${marksOf(s4)}</g>${text(320, 292, '정사각형', { size: 22 })}${verdict(320, true, true, '')}</g>`;
    put('4-2/수학/6/정다각형', svg(id, body, `
      ${popCss(id, 1, 'sh', .1)}
      .sc-${id} .b2 .sh,.sc-${id} .b3 .sh{transform-box:fill-box;transform-origin:center;transform:scale(0)}
      .on2 .sc-${id} .b2 .sh,.on3 .sc-${id} .b3 .sh{transform:none;transition:transform .45s cubic-bezier(.3,1.6,.6,1) .1s}
      ${fadeCss(id, 1, 'vd', .8)}
      .on4 .sc-${id} .nw{transform:none}
      .on4 .sc-${id} .nw0{animation:${id}-in .5s ease-out .2s both}.on4 .sc-${id} .nw1{animation:${id}-in .5s ease-out .4s both}
      @keyframes ${id}-in{from{transform:scale(0)}to{transform:scale(1)}}
      .on4 .sc-${id} .hx{animation:${id}-bob .8s ease-in-out 1s 2}
      @keyframes ${id}-bob{50%{transform:scale(1.08)}}
    `));
  }

  // 대각선: 사각형 ㄱㄴㄷㄹ, ㄱ의 이웃 ㄴ·ㄹ(변으로 이어짐) → ㄱㄷ, ㄴㄹ을 이음, 2개 → 삼각형은 모두 이웃, 0개 → 오각형 대각선 다섯, 5개
  {
    const id = 't42-m6-daegakseon';
    const Q = [[70, 100], [50, 270], [240, 280], [220, 110]];
    const names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], namePos = [[52, 90], [32, 298], [260, 306], [240, 100]];
    const qsides = Q.map((p, i) => seg(p, Q[(i + 1) % 4], { w: 5, cls: i === 0 || i === 3 ? 'nb' : '' })).join('');
    const tri = [[275, 262], [395, 262], [335, 142]];
    const pen = regular(525, 192, 80, 5);
    const diag = (p, q, cls) => drawSeg(p, q, { w: 4, color: C.blue, cls });
    const body = `<g class="b1">${poly(Q, { fill: C.mint, stroke: 'none' })}${qsides}`
      + `${Q.map((p, i) => `<g class="v${i}">${dot(p, { r: 8 })}</g>`).join('')}${names.map((n, i) => text(namePos[i][0], namePos[i][1], n, { size: 30 })).join('')}`
      + `<g class="ring"><circle cx="${Q[0][0]}" cy="${Q[0][1]}" r="16" fill="none" stroke="${C.orange}" stroke-width="4"/></g></g>`
      + `<g class="b2">${diag(Q[0], Q[2], 'd1')}${diag(Q[1], Q[3], 'd2')}<g class="c1">${text(145, 340, '2개', { size: 24, color: C.blue })}</g></g>`
      + `<g class="b3"><g class="tri">${poly(tri, { fill: C.mint })}${tri.map((p, i) => `<g class="ts ts${i}">${seg(p, tri[(i + 1) % 3], { w: 6, color: C.orange })}</g>`).join('')}${tri.map((p) => dot(p)).join('')}</g>`
      + `<g class="c2">${text(335, 340, '0개', { size: 24, color: C.blue })}</g></g>`
      + `<g class="b4">${poly(pen, { fill: C.mint })}${[0, 1, 2, 3, 4].map((i) => diag(pen[i], pen[(i + 2) % 5], `p${i}`)).join('')}${pen.map((p) => dot(p)).join('')}`
      + `<g class="c3">${text(525, 340, '5개', { size: 24, color: C.blue })}</g></g>`;
    put('4-2/수학/6/대각선', svg(id, body, `
      .on1 .sc-${id} .ring{animation:${id}-ring 1s ease-out .2s 2 both}
      @keyframes ${id}-ring{0%{opacity:1}50%{opacity:.2}100%{opacity:1}}
      .on1 .sc-${id} .nb{stroke:${C.orange};stroke-width:7;transition:stroke .4s ease .6s,stroke-width .4s ease .6s}
      .on1 .sc-${id} .v1 circle,.on1 .sc-${id} .v3 circle{fill:${C.orange};transition:fill .4s ease .9s}
      .on2 .sc-${id} .nb{stroke:${C.ink};stroke-width:5}
      .on2 .sc-${id} .v1 circle,.on2 .sc-${id} .v3 circle{fill:${C.ink}}
      .on2 .sc-${id} .ring{animation:none;opacity:0;transition:opacity .3s}
      ${drawCss(id, 2, 'd1', .2, .6)}${drawCss(id, 2, 'd2', .9, .6)}${popCss(id, 2, 'c1', 1.6)}
      ${popCss(id, 3, 'tri', .1)}
      .sc-${id} .ts{opacity:0}
      .on3 .sc-${id} .ts{animation:${id}-ts .5s ease-in-out both}
      .on3 .sc-${id} .ts0{animation-delay:.6s}.on3 .sc-${id} .ts1{animation-delay:.9s}.on3 .sc-${id} .ts2{animation-delay:1.2s}
      @keyframes ${id}-ts{0%{opacity:0}50%{opacity:1}100%{opacity:0}}
      ${popCss(id, 3, 'c2', 1.7)}
      ${[0, 1, 2, 3, 4].map((i) => drawCss(id, 4, `p${i}`, .2 + .25 * i, .4)).join('')}
      ${popCss(id, 4, 'c3', 1.5)}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
