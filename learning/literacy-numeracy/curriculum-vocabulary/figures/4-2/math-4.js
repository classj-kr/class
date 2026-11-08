// 수학 4-2 4단원 사각형: 낱말 도식
// 직선은 화면 끝까지 늘어나고 끝에서 화살 머리가 바깥으로 계속 흘러 '끝없이'를 보인다.
// 사각형은 꼭짓점을 옮기는 모양 바꾸기(morph)로 조건이 하나씩 붙는 것을 보인다.
//   변 하나는 (0,0)–(1,0) 짧은 선을 matrix 로 늘이고 돌린 것, 안쪽 색은 꼭짓점 A 에서 부채꼴로 나눈 삼각형을 matrix 로 옮긴 것.
//   CSS 는 matrix 끼리 바로 섞지 않고 쪼개어 섞으므로, 18 걸음 열쇠틀에 걸음마다 정확한 matrix 를 적는다.
//   모양 바꾸기 조각에는 다른 animation 을 주지 않는다(주면 matrix 가 지워져 처음 모양으로 돌아간다). 반짝임은 감싼 <g> 에.
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
  const seg = (p, q, { color = C.ink, w = 4, cls = '', extra = '' } = {}) =>
    `<path class="${cls}" d="M${P(p)} L${P(q)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none" ${extra}/>`;
  const drawSeg = (p, q, o = {}) => seg(p, q, { ...o, extra: `pathLength="100" ${o.extra || ''}` });
  const dot = (p, { r = 7, color = C.ink, cls = '' } = {}) => `<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${color}"/>`;
  // 직각 표시: 꼭짓점 O 에서 a 쪽, b 쪽으로 s 만큼
  const rmark = (O, a, b, { s = 20, color = C.ink, cls = '' } = {}) => {
    const u = unit(sub(a, O)), v = unit(sub(b, O));
    const p1 = add(O, mul(u, s)), p2 = add(p1, mul(v, s)), p3 = add(O, mul(v, s));
    return `<path class="${cls}" d="M${P(p1)} L${P(p2)} L${P(p3)}" stroke="${color}" stroke-width="3" fill="none"/>`;
  };
  // 같은 길이 표시: 변 가운데에 짧은 금 n 개
  const tick = (p, q, { n = 1, color = C.green } = {}) => {
    const m = mid(p, q), u = unit(sub(q, p)), v = [-u[1], u[0]];
    let s = '';
    for (let i = 0; i < n; i++) {
      const c = add(m, mul(u, (i - (n - 1) / 2) * 8));
      s += seg(add(c, mul(v, -10)), add(c, mul(v, 10)), { color, w: 3 });
    }
    return s;
  };
  const ticksOf = (pts, o) => pts.map((p, i) => tick(p, pts[(i + 1) % pts.length], o)).join('');
  const marksOf = (pts, o) => pts.map((p, i) => rmark(p, pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length], o)).join('');
  // 화살 머리(끝없이 뻗어 나감): tip 에서 dir 쪽을 가리킴
  const chev = (tip, dir, color = C.ink) => {
    const u = unit(dir), v = [-u[1], u[0]];
    const a = add(add(tip, mul(u, -13)), mul(v, 12)), b = add(add(tip, mul(u, -13)), mul(v, -12));
    return `<g class="cv" style="--tx:${f(u[0] * 16)}px;--ty:${f(u[1] * 16)}px"><path d="M${P(a)} L${P(tip)} L${P(b)}" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  };

  // 칸마다 쓰는 CSS 조각
  const drawCss = (id, n, cls, delay = 0, dur = .8) =>
    `.sc-${id} .${cls}{stroke-dasharray:100;stroke-dashoffset:100}.on${n} .sc-${id} .${cls}{stroke-dashoffset:0;transition:stroke-dashoffset ${dur}s ease ${delay}s}`;
  const popCss = (id, n, cls, delay = 0) =>
    `.sc-${id} .${cls}{transform-box:fill-box;transform-origin:center;transform:scale(0)}.on${n} .sc-${id} .${cls}{transform:none;transition:transform .45s cubic-bezier(.3,1.6,.6,1) ${delay}s}`;
  const fadeCss = (id, n, cls, delay = 0, dur = .4) =>
    `.sc-${id} .${cls}{opacity:0}.on${n} .sc-${id} .${cls}{opacity:1;transition:opacity ${dur}s ease ${delay}s}`;
  const flashCss = (id, n, cls, delay = 0) =>
    `.on${n} .sc-${id} .${cls}{animation:${id}-fl 1.4s ease-in-out ${delay}s both}@keyframes ${id}-fl{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}`;
  const strokeCss = (id, n, cls, color, delay = 0) =>
    `.on${n} .sc-${id} .${cls}{stroke:${color};transition:stroke .4s ease ${delay}s}`;
  const chevCss = (id) =>
    `.sc-${id} .cv{animation:${id}-cv 1.5s ease-in infinite}@keyframes ${id}-cv{0%{transform:translate(0,0);opacity:0}30%{opacity:1}100%{transform:translate(var(--tx),var(--ty));opacity:0}}`;

  // 모양 바꾸기: states[i] → states[i+1] 이 beats[i] 칸에 일어난다.
  const STEPS = 18;
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (A, B, t) => A.map((p, i) => [p[0] + (B[i][0] - p[0]) * t, p[1] + (B[i][1] - p[1]) * t]);
  const segM = (p, q) => { const d = sub(q, p); return `matrix(${f(d[0])},${f(d[1])},${f(-d[1])},${f(d[0])},${f(p[0])},${f(p[1])})`; };
  const triM = (a, b, c) => `matrix(${f(b[0] - a[0])},${f(b[1] - a[1])},${f(c[0] - a[0])},${f(c[1] - a[1])},${f(a[0])},${f(a[1])})`;
  function morph(id, name, states, beats, { fill = C.mint, stroke = C.ink, width = 4, side = () => '', dur = 1.2, delay = .3 } = {}) {
    const n = states[0].length, parts = [];
    for (let j = 0; j < n; j++) parts.push({ cls: `${name}s${j}`, m: (q) => segM(q[j], q[(j + 1) % n]), j });
    if (fill) for (let k = 1; k < n - 1; k++) parts.push({ cls: `${name}t${k}`, m: (q) => triM(q[0], q[k], q[k + 1]) });
    let fills = '', sides = '', css = '';
    for (const part of parts) {
      const base = part.m(states[0]);
      if (part.j !== undefined) sides += `<path class="${part.cls} ${side(part.j)}" d="M0 0H1" stroke="${typeof stroke === 'function' ? stroke(part.j) : stroke}" stroke-width="${width}" stroke-linecap="round" vector-effect="non-scaling-stroke" fill="none" style="transform:${base}"/>`;
      else fills += `<path class="${part.cls} ${name}f" d="M0 0L1 0L0 1Z" fill="${fill}" stroke="${fill}" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="transform:${base}"/>`;
      beats.forEach((b, i) => {
        const kf = Array.from({ length: STEPS + 1 }, (_, s) => `${f(100 * s / STEPS)}%{transform:${part.m(lerp(states[i], states[i + 1], ease(s / STEPS)))}}`).join('');
        css += `@keyframes ${id}-${part.cls}-${i}{${kf}}.on${b} .sc-${id} .${part.cls}{animation:${id}-${part.cls}-${i} ${dur}s linear ${delay}s both}`;
      });
    }
    return { body: `${fills}${sides}`, css };
  }
  const MOVE = 'cubic-bezier(.65,0,.35,1)';

  // 직선: 선분 ㄱㄴ → 양쪽으로 화면 끝까지 늘어나고 끝에서 화살 머리가 계속 흘러 나감 → 직선 ㄱㄴ
  {
    const id = 't42-m4-jikseon';
    const y = 190, A = [230, y], B = [410, y];
    const body = `<g class="b2"><path class="grow" d="M0 ${y} H640" stroke="${C.ink}" stroke-width="5" fill="none"/>${chev([30, y], [-1, 0])}${chev([610, y], [1, 0])}</g>`
      + `<g class="b1">${drawSeg(A, B, { w: 5, cls: 'sg' })}${dot(A, { cls: 'pt' })}${dot(B, { cls: 'pt' })}`
      + text(A[0], y + 46, 'ㄱ', { size: 30 }) + text(B[0], y + 46, 'ㄴ', { size: 30 }) + '</g>'
      + `<g class="b1 h3">${text(320, 120, '선분 ㄱㄴ', { size: 26, color: C.muted })}</g>`
      + `<g class="b3"><g class="lab">${text(320, 120, '직선 ㄱㄴ', { size: 30, color: C.green })}</g></g>`;
    put('4-2/수학/4/직선', svg(id, body, `
      ${drawCss(id, 1, 'sg', .2, .9)}
      .sc-${id} .grow{transform-box:fill-box;transform-origin:center;transform:scaleX(.281)}
      .on2 .sc-${id} .grow{transform:none;transition:transform 1.4s ease-in-out .2s}
      ${chevCss(id)}
      ${strokeCss(id, 3, 'grow', C.green, .1)}${strokeCss(id, 3, 'sg', C.green, .1)}
      ${popCss(id, 3, 'lab', .3)}
    `));
  }

  // 수직: 기울어진 직선 나가 돌아가 직선 가와 직각으로 만남 → 직각 표시 → 네 각 모두 직각, 통째로 기울여도 그대로
  {
    const id = 't42-m4-sujik';
    const O = [320, 200];
    const r = 50, a55 = 55 * Math.PI / 180;
    const arcEnd = [O[0] + r * Math.cos(a55), O[1] - r * Math.sin(a55)];
    const up = [O[0], 0], down = [O[0], 360], right = [640, O[1]], left = [0, O[1]];
    const body = `<g class="all">`
      + seg([40, O[1]], [600, O[1]], { w: 5 }) + text(616, O[1] + 8, '가', { size: 24 })
      + `<g class="rot">${seg([O[0], 30], [O[0], 350], { w: 5, color: C.blue, cls: 'ln' })}${text(O[0] + 16, 50, '나', { size: 24, color: C.blue, anchor: 'start' })}</g>`
      + `<g class="h2"><path d="M${O[0] + r} ${O[1]} A${r} ${r} 0 0 0 ${P(arcEnd)}" stroke="${C.orange}" stroke-width="4" fill="none"/></g>`
      + `<g class="b2"><g class="m1">${rmark(O, right, up, { s: 26, color: C.red })}</g></g>`
      + `<g class="b3"><g class="m2">${rmark(O, up, left, { s: 26, color: C.red })}</g><g class="m3">${rmark(O, left, down, { s: 26, color: C.red })}</g><g class="m4">${rmark(O, down, right, { s: 26, color: C.red })}</g></g>`
      + dot(O, { r: 6 }) + '</g>'
      + `<g class="b2 h3"><g class="deg">${text(O[0] + 36, O[1] - 36, '90°', { size: 22, color: C.red, anchor: 'start' })}</g></g>`
      + `<g class="b3"><g class="lab">${text(530, 320, '서로 수직', { size: 28, color: C.green })}</g></g>`;
    put('4-2/수학/4/수직', svg(id, body, `
      .sc-${id} .rot{transform-box:view-box;transform-origin:${O[0]}px ${O[1]}px;transform:rotate(35deg)}
      .on2 .sc-${id} .rot{transform:none;transition:transform 1.2s ${MOVE} .2s}
      ${popCss(id, 2, 'm1', 1.4)}${fadeCss(id, 2, 'deg', 1.6)}
      ${popCss(id, 3, 'm2', .1)}${popCss(id, 3, 'm3', .25)}${popCss(id, 3, 'm4', .4)}
      .sc-${id} .all{transform-box:view-box;transform-origin:${O[0]}px ${O[1]}px}
      .on3 .sc-${id} .all{transform:rotate(-25deg);transition:transform 1.2s ${MOVE} .8s}
      ${popCss(id, 3, 'lab', 1.6)}
    `));
  }

  // 수선: 직선 가 → 삼각자가 밀려와 직각을 대고 직선 나를 그음, 직각 표시 → 나가 주황으로, '수선'
  {
    const id = 't42-m4-suseon';
    const y = 250, X = 300;
    const ruler = `<g class="ruler"><path d="M${X} ${y} L${X} 90 L190 ${y} Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${X - 18} ${y - 18} L${X - 18} 152 L232 ${y - 18} Z" fill="${C.paper}" stroke="${C.purple}" stroke-width="2" stroke-linejoin="round"/></g>`;
    const body = seg([30, y], [596, y], { w: 5 }) + text(614, y + 8, '가', { size: 24 })
      + `<g class="b2 h3">${ruler}</g>`
      + `<g class="b2">${drawSeg([X, 340], [X, 40], { w: 5, cls: 'nl' })}<g class="nlab">${text(X + 16, 58, '나', { size: 24, anchor: 'start' })}</g>`
      + `<g class="mk">${rmark([X, y], [640, y], [X, 0], { s: 24, color: C.red })}</g></g>`
      + `<g class="b3"><g class="lab">${text(X + 70, 150, '수선', { size: 30, color: C.orange, anchor: 'start' })}</g></g>`;
    put('4-2/수학/4/수선', svg(id, body, `
      .sc-${id} .ruler{transform:translateX(-260px)}
      .on2 .sc-${id} .ruler{transform:none;transition:transform .8s ease-out .1s}
      ${drawCss(id, 2, 'nl', .95, .7)}${fadeCss(id, 2, 'nlab', 1.5)}${popCss(id, 2, 'mk', 1.6)}
      ${strokeCss(id, 3, 'nl', C.orange, .2)}${popCss(id, 3, 'lab', .5)}${flashCss(id, 3, 'mk', .5)}
    `));
  }

  // 평행: 나란한 선분 가, 나 → 화면 끝까지 늘어나도 안 만남 → 기울어진 다는 늘이면 나와 만남 → 같은 폭 화살표 셋, '평행'
  {
    const id = 't42-m4-pyeonghaeng';
    const y1 = 130, y2 = 230;
    const slope = 80 / 360, ang = Math.atan(slope) * 180 / Math.PI, cy = 277.8, L = 640 / Math.cos(Math.atan(slope));
    const line = (y, cls) => `<path class="${cls}" d="M0 ${y} H640" stroke="${C.ink}" stroke-width="5" fill="none"/>`;
    const gap = (x, cls) => `<g class="${cls}">${arrow(x, y1 + 14, x, y2 - 14, C.green, '', 4)}${arrow(x, y2 - 14, x, y1 + 14, C.green, '', 4)}</g>`;
    const body = `<g class="b1">${line(y1, 'gr')}${line(y2, 'gr')}${text(206, y1 - 14, '가', { size: 24, anchor: 'end' })}${text(206, y2 - 14, '나', { size: 24, anchor: 'end' })}</g>`
      + `<g class="b2">${chev([24, y1], [-1, 0])}${chev([616, y1], [1, 0])}${chev([24, y2], [-1, 0])}${chev([616, y2], [1, 0])}</g>`
      + `<g class="b3 h4"><g transform="rotate(${f(-ang)} 320 ${cy})"><path class="gr3" d="M${f(320 - L / 2)} ${cy} H${f(320 + L / 2)}" stroke="${C.blue}" stroke-width="5" fill="none"/></g>`
      + text(236, 346, '다', { size: 24, color: C.blue, anchor: 'end' })
      + `<g class="meet"><circle cx="580" cy="${y2}" r="17" fill="none" stroke="${C.red}" stroke-width="4"/></g></g>`
      + `<g class="b4">${gap(140, 'g1')}${gap(320, 'g2')}${gap(500, 'g3')}<g class="lab">${text(568, 189, '평행', { size: 28, color: C.green })}</g></g>`;
    put('4-2/수학/4/평행', svg(id, body, `
      .sc-${id} .gr,.sc-${id} .gr3{transform-box:fill-box;transform-origin:center;transform:scaleX(.3125)}
      .on2 .sc-${id} .gr{transform:none;transition:transform 1.4s ease-in-out .2s}
      .on3 .sc-${id} .gr3{transform:none;transition:transform 1.2s ease-in-out .5s}
      ${chevCss(id)}
      ${popCss(id, 3, 'meet', 1.6)}
      ${fadeCss(id, 4, 'g1', .2)}${fadeCss(id, 4, 'g2', .5)}${fadeCss(id, 4, 'g3', .8)}${popCss(id, 4, 'lab', 1.2)}
    `));
  }

  // 평행선: 직선 가에 수직인 나, 다 → 위아래로 끝까지 늘어나도 안 만남 → 둘 다 주황, '평행선'
  {
    const id = 't42-m4-pyeonghaengseon';
    const y = 240, xs = [220, 420];
    const vline = (x) => `<path class="gr" d="M${x} 0 V360" stroke="${C.ink}" stroke-width="5" fill="none"/>`;
    const body = seg([20, y], [620, y], { w: 5, color: C.muted }) + text(604, y - 14, '가', { size: 24, color: C.muted })
      + `<g class="b1">${xs.map(vline).join('')}${xs.map((x) => rmark([x, y], [640, y], [x, 0], { s: 22, color: C.red })).join('')}`
      + text(xs[0] - 16, 104, '나', { size: 24, anchor: 'end' }) + text(xs[1] + 16, 104, '다', { size: 24, anchor: 'start' }) + '</g>'
      + `<g class="b2">${xs.map((x) => chev([x, 18], [0, -1]) + chev([x, 342], [0, 1])).join('')}</g>`
      + `<g class="b3"><g class="lab">${text(320, 168, '평행선', { size: 30, color: C.orange })}</g></g>`;
    put('4-2/수학/4/평행선', svg(id, body, `
      .sc-${id} .gr{transform-box:fill-box;transform-origin:center;transform:scaleY(.5556)}
      .on2 .sc-${id} .gr{transform:none;transition:transform 1.4s ease-in-out .2s}
      ${chevCss(id)}
      ${strokeCss(id, 3, 'gr', C.orange, .1)}${popCss(id, 3, 'lab', .5)}
    `));
  }

  // 평행선 사이의 거리: 두 직선 위 점을 잇는 선분 셋(길이 다름) → 수직인 선분이 가장 짧음 → 어디서 재도 4 cm → 거리
  {
    const id = 't42-m4-geori';
    const y1 = 100, y2 = 260, X = 300;
    const vert = (x, cls = '') => `<g class="${cls}">${seg([x, y1], [x, y2], { w: 5, color: C.orange })}${rmark([x, y1], [640, y1], [x, 360], { s: 18, color: C.orange })}${rmark([x, y2], [640, y2], [x, 0], { s: 18, color: C.orange })}${text(x + 14, 194, '4 cm', { size: 22, anchor: 'start', color: C.orange })}</g>`;
    const body = seg([20, y1], [620, y1], { w: 5 }) + seg([20, y2], [620, y2], { w: 5 })
      + text(36, y1 - 14, '가', { size: 24 }) + text(36, y2 - 14, '나', { size: 24 })
      + `<g class="b1 h3"><g class="sl">${drawSeg([150, y1], [80, y2], { w: 4, cls: 'd1' })}${drawSeg([400, y1], [530, y2], { w: 4, cls: 'd3' })}`
      + `<g class="l1">${text(92, 194, '4.4 cm', { size: 22, anchor: 'end' })}</g><g class="l3">${text(484, 194, '5.2 cm', { size: 22, anchor: 'start' })}</g></g></g>`
      + `<g class="b1">${drawSeg([X, y1], [X, y2], { w: 4, cls: 'd2 s2' })}<g class="l2">${text(X + 14, 194, '4 cm', { size: 22, anchor: 'start', color: C.ink, cls: 't2' })}</g></g>`
      + `<g class="b2"><g class="mk">${rmark([X, y1], [640, y1], [X, 360], { s: 18, color: C.orange })}${rmark([X, y2], [640, y2], [X, 0], { s: 18, color: C.orange })}</g></g>`
      + `<g class="b3"><g class="cp" style="--dx:-160px">${vert(X)}</g><g class="cp" style="--dx:200px">${vert(X)}</g></g>`
      + `<g class="b4"><g class="lab">${text(320, 322, '평행선 사이의 거리', { size: 28, color: C.green })}</g></g>`;
    put('4-2/수학/4/평행선 사이의 거리', svg(id, body, `
      ${drawCss(id, 1, 'd1', .1)}${drawCss(id, 1, 'd2', .5)}${drawCss(id, 1, 'd3', .9)}
      ${fadeCss(id, 1, 'l1', .8)}${fadeCss(id, 1, 'l2', 1.2)}${fadeCss(id, 1, 'l3', 1.6)}
      .on2 .sc-${id} .sl{opacity:.25;transition:opacity .5s ease .2s}
      ${strokeCss(id, 2, 's2', C.orange, .5)}
      .on2 .sc-${id} .s2{stroke-width:5}
      .on2 .sc-${id} .t2{fill:${C.orange};transition:fill .4s ease .5s}
      ${popCss(id, 2, 'mk', 1)}
      .sc-${id} .cp{opacity:0}
      .on3 .sc-${id} .cp{opacity:1;transform:translateX(var(--dx));transition:opacity .3s ease .2s,transform 1.1s ${MOVE} .3s}
      .on4 .sc-${id} .cp,.on4 .sc-${id} .s2,.on4 .sc-${id} .mk{animation:${id}-g 1.4s ease-in-out .2s both}
      @keyframes ${id}-g{0%,50%,100%{opacity:1}25%,75%{opacity:.25}}
      ${popCss(id, 4, 'lab', .4)}
    `));
  }

  // ── 사각형: 꼭짓점을 옮겨 조건을 하나씩 붙인다. 평행한 변 한 쌍은 주황, 다른 한 쌍은 파랑.
  const pairSide = (j) => (j % 2 ? 'pb' : 'po');
  const polyFill = (pts, fill = C.mint) => `<polygon points="${pts.map(P).join(' ')}" fill="${fill}" stroke="none"/>`;
  const polySides = (pts, color = (j) => C.ink, w = 4) => pts.map((p, j) => seg(p, pts[(j + 1) % pts.length], { color: color(j), w })).join('');

  // 사다리꼴: 평행한 변이 없는 사각형 → 꼭짓점 하나를 옮겨 위아래 변이 평행(주황) → 평행한 변이 두 쌍인 사각형도 → 둘 다 사다리꼴
  {
    const id = 't42-m4-sadari';
    const S0 = [[70, 270], [300, 270], [270, 150], [110, 110]];
    const S1 = [[70, 270], [300, 270], [250, 110], [110, 110]];
    const m = morph(id, 'q', [S0, S1], [2], { side: pairSide });
    const R = [[360, 270], [550, 270], [600, 110], [410, 110]];
    const body = `<g class="b1"><g class="lq"><g class="ext">${seg([30, 270], [340, 270], { color: C.orange, w: 3, extra: 'stroke-dasharray="8 8"' })}${seg([60, 110], [300, 110], { color: C.orange, w: 3, extra: 'stroke-dasharray="8 8"' })}</g>${m.body}</g></g>`
      + `<g class="b1 h3"><g class="cv2">${dot(S0[2], { r: 9, color: C.red })}</g></g>`
      + `<g class="b3"><g class="rq">${polyFill(R)}${polySides(R, (j) => (j % 2 ? C.blue : C.orange))}</g></g>`
      + `<g class="b4"><path d="M60 298 V310 H610 V298" stroke="${C.green}" stroke-width="3" fill="none"/><g class="lab">${text(335, 346, '사다리꼴', { size: 28, color: C.green })}</g></g>`;
    put('4-2/수학/4/사다리꼴', svg(id, body, `
      ${m.css}
      .on2 .sc-${id} .cv2{transform:translate(-20px,-40px);transition:transform 1.2s ${MOVE} .3s}
      ${strokeCss(id, 2, 'po', C.orange, 1.5)}${fadeCss(id, 2, 'ext', 1.6)}
      ${popCss(id, 3, 'rq', .2)}
      .on4 .sc-${id} .lq,.on4 .sc-${id} .rq{animation:${id}-fl 1.4s ease-in-out .4s both}
      @keyframes ${id}-fl{0%,50%,100%{opacity:1}25%,75%{opacity:.3}}
      ${popCss(id, 4, 'lab', .2)}
    `));
  }

  // 평행사변형: 위아래 변만 평행한 사다리꼴 → 꼭짓점 하나를 옮겨 양옆 변도 평행(파랑) → 두 쌍을 끝까지 늘인 점선, '평행사변형'
  {
    const id = 't42-m4-pyeonghaengsabyeon';
    const S0 = [[150, 280], [470, 280], [400, 110], [230, 110]];
    const S1 = [[150, 280], [470, 280], [550, 110], [230, 110]];
    const m = morph(id, 'q', [S0, S1], [2], { side: pairSide, stroke: (j) => (j % 2 ? C.ink : C.orange) });
    const dash = 'stroke-dasharray="8 8"';
    const at = (p, q, y) => [p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1]), y];
    const body = `<g class="b3"><g class="e1">${seg([20, 280], [620, 280], { color: C.orange, w: 3, extra: dash })}${seg([20, 110], [620, 110], { color: C.orange, w: 3, extra: dash })}</g>`
      + `<g class="e2">${seg(at(S1[0], S1[3], 340), at(S1[0], S1[3], 50), { color: C.blue, w: 3, extra: dash })}${seg(at(S1[1], S1[2], 340), at(S1[1], S1[2], 50), { color: C.blue, w: 3, extra: dash })}</g></g>`
      + `<g class="b1"><g class="qq">${m.body}</g></g>`
      + `<g class="b1 h3"><g class="cv2">${dot(S0[2], { r: 9, color: C.red })}</g></g>`
      + `<g class="b3"><g class="lab">${text(320, 334, '평행사변형', { size: 28, color: C.green })}</g></g>`;
    put('4-2/수학/4/평행사변형', svg(id, body, `
      ${m.css}
      .on2 .sc-${id} .cv2{transform:translateX(150px);transition:transform 1.2s ${MOVE} .3s}
      ${strokeCss(id, 2, 'pb', C.blue, 1.5)}
      ${fadeCss(id, 3, 'e1', .2)}${fadeCss(id, 3, 'e2', .7)}
      .on3 .sc-${id} .qq{animation:${id}-fl 1.4s ease-in-out .9s both}
      @keyframes ${id}-fl{0%,50%,100%{opacity:1}25%,75%{opacity:.35}}
      ${popCss(id, 3, 'lab', 1.2)}
    `));
  }

  // 마름모: 6 cm·4 cm 평행사변형 → 변 길이를 바꿔 네 변 모두 5 cm(같은 길이 표시) → 돌려 세워도 그대로, '마름모'
  {
    const id = 't42-m4-mareummo';
    const S0 = [[190, 270], [430, 270], [510, 131], [270, 131]];
    const S1 = [[200, 280], [400, 280], [520, 120], [320, 120]];
    const m = morph(id, 'q', [S0, S1], [2], { stroke: (j) => (j % 2 ? C.blue : C.orange) });
    const body = `<g class="b1"><g class="spin">${m.body}<g class="tk">${ticksOf(S1)}</g></g></g>`
      + `<g class="b1 h2">${text(310, 304, '6 cm', { size: 22 })}${text(222, 208, '4 cm', { size: 22, anchor: 'end' })}</g>`
      + `<g class="b2 h3"><g class="nl">${text(300, 316, '5 cm', { size: 22 })}${text(488, 214, '5 cm', { size: 22, anchor: 'start' })}${text(420, 104, '5 cm', { size: 22 })}${text(236, 192, '5 cm', { size: 22, anchor: 'end' })}</g></g>`
      + `<g class="b3"><g class="lab">${text(360, 342, '마름모', { size: 28, color: C.green })}</g></g>`;
    put('4-2/수학/4/마름모', svg(id, body, `
      ${m.css}
      ${fadeCss(id, 2, 'tk', 1.5)}${fadeCss(id, 2, 'nl', 1.6)}
      .sc-${id} .spin{transform-box:view-box;transform-origin:360px 200px}
      .on3 .sc-${id} .spin{transform:rotate(26.57deg);transition:transform 1.2s ${MOVE} .3s}
      ${popCss(id, 3, 'lab', 1.4)}
    `));
  }

  // 직사각형: 직각이 없는 평행사변형 → 기운 변을 세워 네 각 모두 직각(직각 표시 넷) → '직사각형'
  {
    const id = 't42-m4-jiksagak';
    const S0 = [[160, 270], [420, 270], [500, 120], [240, 120]];
    const S1 = [[190, 270], [450, 270], [450, 120], [190, 120]];
    const m = morph(id, 'q', [S0, S1], [2], { stroke: (j) => (j % 2 ? C.blue : C.orange) });
    const ua = unit(sub(S0[3], S0[0]));
    const arcA = `<path d="M${S0[0][0] + 32} ${S0[0][1]} A32 32 0 0 0 ${P(add(S0[0], mul(ua, 32)))}" stroke="${C.purple}" stroke-width="4" fill="none"/>`;
    const arcB = `<path d="M${S0[1][0] - 32} ${S0[1][1]} A32 32 0 0 1 ${P(add(S0[1], mul(ua, 32)))}" stroke="${C.purple}" stroke-width="4" fill="none"/>`;
    const marks = S1.map((p, i) => `<g class="mk mk${i}">${rmark(p, S1[(i + 3) % 4], S1[(i + 1) % 4], { s: 22, color: C.red })}</g>`).join('');
    const body = `<g class="b1">${m.body}</g><g class="b1 h2">${arcA}${arcB}</g>`
      + `<g class="b2"><g class="mks">${marks}</g></g>`
      + `<g class="b3"><g class="lab">${text(320, 330, '직사각형', { size: 28, color: C.green })}</g></g>`;
    put('4-2/수학/4/직사각형', svg(id, body, `
      ${m.css}
      ${[0, 1, 2, 3].map((i) => popCss(id, 2, `mk${i}`, 1.3 + .12 * i)).join('')}
      .on3 .sc-${id} .mks{animation:${id}-fl 1.4s ease-in-out .2s both}
      @keyframes ${id}-fl{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}
      ${popCss(id, 3, 'lab', .4)}
    `));
  }

  // 정사각형: 직사각형(직각 넷)과 마름모(같은 길이 넷) → 직사각형의 긴 변을 줄임 → 마름모를 세움 → 둘 다 정사각형
  {
    const id = 't42-m4-jeongsagak';
    const L0 = [[50, 270], [270, 270], [270, 120], [50, 120]], L1 = [[85, 270], [235, 270], [235, 120], [85, 120]];
    const R0 = [[380, 270], [530, 270], [605, 140.1], [455, 140.1]], R1 = [[405, 270], [555, 270], [555, 120], [405, 120]];
    const ml = morph(id, 'l', [L0, L1], [2]);
    const mr = morph(id, 'r', [R0, R1], [3]);
    const red = { s: 20, color: C.red };
    const body = `<g class="b1"><g class="sq1">${ml.body}</g><g class="sq2">${mr.body}</g></g>`
      + `<g class="b1 h2">${marksOf(L0, red)}</g><g class="b1 h3">${ticksOf(R0)}</g>`
      + `<g class="b2"><g class="late">${marksOf(L1, red)}${ticksOf(L1)}</g></g>`
      + `<g class="b3"><g class="late">${marksOf(R1, red)}${ticksOf(R1)}</g></g>`
      + `<g class="b1 h4">${text(160, 322, '직사각형', { size: 24 })}${text(486, 322, '마름모', { size: 24 })}</g>`
      + `<g class="b4"><g class="lab">${text(160, 322, '정사각형', { size: 26, color: C.green })}</g><g class="lab">${text(480, 322, '정사각형', { size: 26, color: C.green })}</g></g>`;
    put('4-2/수학/4/정사각형', svg(id, body, `
      ${ml.css}${mr.css}
      .sc-${id} .late{opacity:0}
      .on2 .sc-${id} .b2 .late,.on3 .sc-${id} .b3 .late{opacity:1;transition:opacity .4s ease 1.5s}
      .on4 .sc-${id} .sq1,.on4 .sc-${id} .sq2{animation:${id}-fl 1.4s ease-in-out .5s both}
      @keyframes ${id}-fl{0%,50%,100%{opacity:1}25%,75%{opacity:.35}}
      ${popCss(id, 4, 'lab', .2)}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
