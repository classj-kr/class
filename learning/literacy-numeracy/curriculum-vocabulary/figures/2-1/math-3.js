// 수학 2-1 3단원 덧셈과 뺄셈: 낱말 도식
// 덧셈식은 사탕 6개와 7개를 10칸 틀 두 개에 모아 13, 뺄셈식은 펭귄 16마리 가운데 4마리가 떠나 12.
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

  // 덧셈식: 노란 사탕 6, 빨간 사탕 7 → 10칸 틀로 모여 모두 13 → 6 + 7 = 13, + 와 = 에 고리, 덧셈식
  (function () {
    const id = 't21-m3-deotsemsik', cell = 50, fy = 60;
    const fx = [60, 330];
    const frames = fx.map((x) => {
      let g = '';
      for (let k = 1; k < 5; k++) g += `M${x + k * cell} ${fy}v${2 * cell}`;
      return rect(x, fy, 5 * cell, 2 * cell, 'white', C.ink, 3, 4) + `<path d="${g}M${x} ${fy + cell}h${5 * cell}" stroke="${C.ink}" stroke-width="2"/>`;
    }).join('');
    const candy = (x, y, fill, stroke) => `<circle cx="${x}" cy="${y}" r="17" fill="${fill}" stroke="${stroke}" stroke-width="3"/><circle cx="${x - 6}" cy="${y - 6}" r="4" fill="white" opacity=".8"/>`;
    const target = (k) => { const fr = k < 10 ? 0 : 1, j = k % 10; return [fx[fr] + (j % 5) * cell + cell / 2, fy + Math.floor(j / 5) * cell + cell / 2]; };
    let candies = '';
    for (let i = 0; i < 13; i++) {
      const yellow = i < 6, j = yellow ? i : i - 6;
      const x = yellow ? 90 + (j % 3) * 44 : 380 + (j % 4) * 44, y = 230 + Math.floor(j / (yellow ? 3 : 4)) * 44;
      const [tx, ty] = target(i);
      candies += `<g class="m2" ${dl(.2 + i * .07, `--mx:${f(tx - x)}px;--my:${f(ty - y)}px`)}>${G('p1', yellow ? .2 + j * .1 : .9 + j * .1, yellow ? candy(x, y, C.yellow, C.orange) : candy(x, y, C.red, C.red))}</g>`;
    }
    const eq = [[170, '6'], [228, '+'], [286, '7'], [344, '='], [414, '13']];
    const body = G('s2', .1, frames) + candies
      + `<g class="h2">${tag(134, 340, '6', C.orange, 's1', .8, 34)}${tag(446, 340, '7', C.red, 's1', 1.6, 34)}</g>`
      + tag(320, 214, '모두 13', C.green, 'p2', 1.5, 32)
      + eq.map(([x, s], i) => tag(x, 316, s, i === 4 ? C.green : C.ink, 's3', .1 + i * .2, 52)).join('')
      + ring(228, 299, 26, C.orange, 'r3', 1.2) + ring(344, 299, 26, C.orange, 'r3', 1.4)
      + G('p3', 1.6, pill(550, 300, 130, '덧셈식', C.green, C.mint, 30));
    reg('2-1/수학/3/덧셈식', id, body);
  })();

  // 뺄셈식: 펭귄 16마리 → 4마리가 오른쪽으로 떠나 흐려지고 12마리 남음 → 16 − 4 = 12, − 와 = 에 고리, 뺄셈식
  (function () {
    const id = 't21-m3-ppaelsemsik';
    const peng = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="23" fill="${C.ink}"/><ellipse cx="${x}" cy="${y + 5}" rx="9" ry="15" fill="white"/><path d="M${x - 5} ${y - 12} h10 l-5 7 Z" fill="${C.orange}"/>`;
    let birds = '';
    for (let i = 0; i < 16; i++) {
      const x = 70 + (i % 8) * 54, y = 80 + Math.floor(i / 8) * 80, leave = i >= 12;
      const p = G('p1', .1 + i * .07, peng(x, y));
      birds += leave ? `<g class="m2" ${dl(.2 + (i - 12) * .12, '--mx:160px;--my:0px')}><g class="x2" ${dl(1.2)}>${p}</g></g>` : p;
    }
    const eq = [[150, '16'], [218, '−'], [276, '4'], [334, '='], [404, '12']];
    const body = birds
      + `<g class="h2">${tag(270, 250, '16마리', C.ink, 's1', 1.4, 32)}</g>`
      + G('s2', .9, brace(430, 624, 196, C.red) + T(527, 250, '4마리', { size: 28, color: C.red }))
      + tag(178, 250, '12마리', C.green, 's2', 1.5, 32)
      + eq.map(([x, s], i) => tag(x, 326, s, i === 4 ? C.green : C.ink, 's3', .1 + i * .2, 52)).join('')
      + ring(218, 309, 26, C.orange, 'r3', 1.2) + ring(334, 309, 26, C.orange, 'r3', 1.4)
      + G('p3', 1.6, pill(550, 310, 130, '뺄셈식', C.green, C.mint, 30));
    reg('2-1/수학/3/뺄셈식', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
