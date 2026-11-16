// 수학 2-2 2단원 곱셈구구: 낱말 도식
// 곱셈표는 교과서처럼 왼쪽 세로줄 수 × 위쪽 가로줄 수를 만나는 칸에 쓴다(1~9).
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
  const eqLine = (y, a, b, size, cls, d, ansColor = C.ink, xs = [70, 100, 130, 162, 206]) =>
    G(cls, d, T(xs[0], y, a, { size }) + T(xs[1], y, '×', { size, color: C.muted }) + T(xs[2], y, b, { size }) + T(xs[3], y, '=', { size, color: C.muted }) + T(xs[4], y, a * b, { size, color: ansColor }));

  // 곱셈구구: 2단 2 × 1 = 2 … 2 × 9 = 18 이 차례로 → 1단~9단 카드 → 모두 묶어 곱셈구구
  (function () {
    const id = 't22-m2-gugu';
    let rows = '';
    for (let n = 1; n <= 9; n++) rows += eqLine(28 + n * 32, 2, n, 24, 's1', .1 + n * .16, C.orange);
    const cards = Array.from({ length: 9 }, (_, i) => {
      const k = i + 1, x = 310 + (i % 3) * 106, y = 34 + Math.floor(i / 3) * 78, two = k === 2;
      return G('p2', two ? .1 : .2 + i * .12, rect(x, y, 94, 62, two ? C.peach : C.sky, two ? C.orange : C.blue, 3, 10) + T(x + 47, y + 41, `${k}단`, { size: 28, color: two ? C.orange : C.blue }));
    }).join('');
    const body = G('s1', .1, rect(40, 34, 200, 300, 'white', C.orange, 3, 12)) + rows
      + G('s2', .1, `<path d="M240 70 C270 70 280 72 306 66" stroke="${C.orange}" stroke-width="3" fill="none" stroke-dasharray="6 5"/>`)
      + cards
      + G('k3', .2, rect(300, 24, 330, 250, 'none', C.green, 4, 16))
      + G('p3', .8, pill(465, 318, 150, '곱셈구구', C.green, C.mint, 28));
    reg('2-2/수학/2/곱셈구구', id, body);
  })();

  // 단: 3 × 1 … 3 × 9 → 곱 사이마다 +3 → 3에 곱한 한 묶음, 3단
  (function () {
    const id = 't22-m2-dan', y0 = 46, st = 34;
    let rows = '', hops = '';
    for (let n = 1; n <= 9; n++) rows += eqLine(y0 + (n - 1) * st, 3, n, 24, 's1', .1 + n * .14, C.blue);
    for (let n = 1; n < 9; n++) {
      const ya = y0 + (n - 1) * st - 8, yb = ya + st;
      hops += draw(`M232 ${ya} Q262 ${ya + st / 2} 234 ${yb}`, C.orange, 3, 2, .1 + n * .18) + tag(272, ya + st / 2 + 7, '+3', C.orange, 's2', .3 + n * .18, 20, 'start');
    }
    const body = rows + hops
      + G('k3', .2, rect(52, y0 - 28, 36, 9 * st + 6, 'none', C.purple, 3.5, 8))
      + G('s3', .6, `<path d="M325 22 q14 0 14 14 V160 q0 14 14 14 q-14 0 -14 14 V312 q0 14 -14 14" fill="none" stroke="${C.purple}" stroke-width="3"/>`)
      + tag(450, 198, '3단', C.purple, 'p3', .9, 64);
    reg('2-2/수학/2/단', id, body);
  })();

  // 곱셈표: 위쪽과 왼쪽에 1~9 → 왼쪽 3 과 위쪽 5 가 만나는 칸에 15 → 모든 칸이 채워지고 5 × 3 칸도 15
  (function () {
    const id = 't22-m2-gopsempyo', x0 = 20, y0 = 22, w = 40, h = 31;
    const cx = (c) => x0 + (c + .5) * w, cy = (r) => y0 + (r + .5) * h + 7;
    let grid = '';
    for (let k = 1; k < 10; k++) grid += `M${x0 + k * w} ${y0}v${10 * h}M${x0} ${y0 + k * h}h${10 * w}`;
    const frame = rect(x0, y0, 10 * w, 10 * h, 'white', C.ink, 2.5, 4)
      + `<rect x="${x0}" y="${y0}" width="${10 * w}" height="${h}" fill="${C.mint}"/><rect x="${x0}" y="${y0}" width="${w}" height="${10 * h}" fill="${C.mint}"/>`
      + `<path d="${grid}" stroke="${C.line}" stroke-width="1.5"/><path d="M${x0 + w} ${y0}v${10 * h}M${x0} ${y0 + h}h${10 * w}" stroke="${C.ink}" stroke-width="2.5"/>`
      + T(cx(0), cy(0), '×', { size: 20, color: C.muted });
    const heads = Array.from({ length: 9 }, (_, i) => tag(cx(i + 1), cy(0), i + 1, C.green, 'p1', .1 + i * .06, 19)).join('')
      + Array.from({ length: 9 }, (_, i) => tag(cx(0), cy(i + 1), i + 1, C.green, 'p1', .7 + i * .06, 19)).join('');
    let cells = '';
    for (let r = 1; r <= 9; r++) {
      let row = '';
      for (let c = 1; c <= 9; c++) if (!(r === 3 && c === 5)) row += T(cx(c), cy(r), r * c, { size: 18, weight: 600 });
      cells += G('s3', .1 + r * .12, row);
    }
    const body = frame
      + G('s2', .1, `<rect x="${x0 + w}" y="${y0 + 3 * h}" width="${9 * w}" height="${h}" fill="${C.yellow}" opacity=".45"/><rect x="${x0 + 5 * w}" y="${y0 + h}" width="${w}" height="${9 * h}" fill="${C.sky}" opacity=".8"/>`)
      + heads + ring(cx(0), cy(3) - 7, 16, C.orange, 'r2', .3) + ring(cx(5), cy(0) - 7, 16, C.blue, 'r2', .3)
      + tag(cx(5), cy(3), 15, C.red, 'p2', .9, 20) + ring(cx(5), cy(3) - 7, 16, C.red, 'r2', 1.1)
      + tag(535, 120, '3 × 5 = 15', C.red, 's2', 1.2, 30)
      + cells
      + `<g class="s3" ${dl(1.4)}><rect x="${x0 + 3 * w + 2}" y="${y0 + 5 * h + 2}" width="${w - 4}" height="${h - 4}" rx="4" fill="none" stroke="${C.red}" stroke-width="3"/></g>`
      + tag(535, 180, '5 × 3 = 15', C.red, 's3', 1.6, 30)
      + G('p3', 1.8, pill(535, 290, 130, '곱셈표', C.green, C.mint, 30));
    reg('2-2/수학/2/곱셈표', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
