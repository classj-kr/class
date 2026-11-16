// 수학 2-2 6단원 규칙 찾기: 낱말 도식
// 규칙은 되풀이되는 모양과 일정하게 커지는 수 둘 다, 반복은 구슬 세 개 한 묶음이 거듭 나오는 것, 덧셈표는 왼쪽 수 + 위쪽 수.
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

  // 규칙: 빨강·노랑이 번갈아 → 다음은 빨강 / 2, 4, 6, 8 은 2씩 커짐 → 다음은 10 → 규칙
  (function () {
    const id = 't22-m6-gyuchik', tw = 60, ty = 40;
    const tile = (i) => {
      const red = i % 2 === 0, x = 40 + i * 76;
      return rect(x, ty, tw, tw, red ? C.red : C.yellow, red ? C.red : C.orange, 3, 8);
    };
    const tiles = Array.from({ length: 6 }, (_, i) => G('p1', .1 + i * .15, tile(i))).join('');
    const qx = 40 + 6 * 76;
    const q1 = `<g class="h2">${G('s1', 1, rect(qx, ty, tw, tw, 'white', C.muted, 3, 8).replace('stroke-width="3"', 'stroke-width="3" stroke-dasharray="7 6"') + T(qx + tw / 2, ty + 42, '?', { size: 34, color: C.muted }))}</g>`;
    const ny = 230, nx = (i) => 80 + i * 110;
    const circles = [2, 4, 6, 8].map((n, i) => G('p2', .1 + i * .2, `<circle cx="${nx(i)}" cy="${ny}" r="32" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + T(nx(i), ny + 11, n, { size: 32, color: C.blue }))).join('');
    let hops = '';
    for (let i = 0; i < 4; i++) hops += draw(`M${nx(i) + 20} ${ny - 34} Q${(nx(i) + nx(i + 1)) / 2} ${ny - 78} ${nx(i + 1) - 20} ${ny - 34}`, C.orange, 3.5, 2, .5 + i * .25) + tag((nx(i) + nx(i + 1)) / 2, ny - 66, '+2', C.orange, 's2', .7 + i * .25, 22);
    const body = tiles + q1 + G('p1', 1.7, tile(6))
      + circles + hops
      + `<g class="h3">${G('s2', .2, `<circle cx="${nx(4)}" cy="${ny}" r="32" fill="white" stroke="${C.muted}" stroke-width="3" stroke-dasharray="7 6"/>` + T(nx(4), ny + 11, '?', { size: 32, color: C.muted }))}</g>`
      + G('p2', 1.9, `<circle cx="${nx(4)}" cy="${ny}" r="32" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + T(nx(4), ny + 11, 10, { size: 32, color: C.blue }))
      + G('k3', .2, rect(34, ty - 6, 2 * 76 - 4, tw + 12, 'none', C.green, 4, 10))
      + G('k3', .6, rect(nx(0) - 42, ny - 104, 4 * 110 + 84, 148, 'none', C.green, 4, 14))
      + G('p3', 1, pill(540, 320, 110, '규칙', C.green, C.mint, 30));
    reg('2-2/수학/6/규칙', id, body);
  })();

  // 반복: 구슬 12개(빨강·노랑·파랑) → 세 개 한 묶음 테두리가 옮겨 가며 1~4 → 묶음마다 점선 테두리, 반복
  (function () {
    const id = 't22-m6-banbok', y = 160, st = 49, gw = 3 * st;
    const cols = [[C.red, C.red], [C.yellow, C.orange], [C.blue, C.blue]];
    const beads = Array.from({ length: 12 }, (_, i) => G('p1', .1 + i * .12, `<circle cx="${50 + i * st}" cy="${y}" r="19" fill="${cols[i % 3][0]}" stroke="${cols[i % 3][1]}" stroke-width="3"/><circle cx="${44 + i * st}" cy="${y - 6}" r="5" fill="white" opacity=".7"/>`)).join('');
    const box = (x, extra = '') => `<rect x="${x}" y="${y - 32}" width="${gw - 6}" height="64" rx="16" fill="none" stroke="${C.purple}" stroke-width="4" ${extra}/>`;
    const body = `<path d="M24 ${y}H616" stroke="${C.muted}" stroke-width="4"/>` + beads
      + `<g class="x3" ${dl(.1)}><g class="bx">${G('s2', .1, box(29))}</g></g>`
      + Array.from({ length: 4 }, (_, k) => tag(50 + st + k * gw, y + 70, k + 1, C.purple, 's2', .2 + k * .6, 28)).join('')
      + Array.from({ length: 4 }, (_, k) => G('s3', .2 + k * .2, box(29 + k * gw, 'stroke-dasharray="9 7"'))).join('')
      + G('p3', 1.2, pill(320, 300, 110, '반복', C.purple, C.lilac, 30));
    reg('2-2/수학/6/반복', id, body, `
      .on2 .sc-${id} .bx { animation: ${id}-step 1.8s steps(3, end) .2s both; }
      @keyframes ${id}-step { from { transform: none; } to { transform: translateX(${3 * gw}px); } }`);
  })();

  // 덧셈표: 위쪽과 왼쪽에 1~6 → 왼쪽 2 와 위쪽 3 이 만나는 칸에 5 → 모든 칸, 오른쪽으로 1씩 커짐
  (function () {
    const id = 't22-m6-deotsempyo', x0 = 30, y0 = 30, w = 60, h = 40, n = 6;
    const cx = (c) => x0 + (c + .5) * w, cy = (r) => y0 + (r + .5) * h + 8;
    let grid = '';
    for (let k = 1; k <= n; k++) grid += `M${x0 + k * w} ${y0}v${(n + 1) * h}M${x0} ${y0 + k * h}h${(n + 1) * w}`;
    const frame = rect(x0, y0, (n + 1) * w, (n + 1) * h, 'white', C.ink, 2.5, 4)
      + `<rect x="${x0}" y="${y0}" width="${(n + 1) * w}" height="${h}" fill="${C.mint}"/><rect x="${x0}" y="${y0}" width="${w}" height="${(n + 1) * h}" fill="${C.mint}"/>`
      + `<path d="${grid}" stroke="${C.line}" stroke-width="1.5"/><path d="M${x0 + w} ${y0}v${(n + 1) * h}M${x0} ${y0 + h}h${(n + 1) * w}" stroke="${C.ink}" stroke-width="2.5"/>`
      + T(cx(0), cy(0), '+', { size: 24, color: C.muted });
    const heads = Array.from({ length: n }, (_, i) => tag(cx(i + 1), cy(0), i + 1, C.green, 'p1', .1 + i * .08, 22)).join('')
      + Array.from({ length: n }, (_, i) => tag(cx(0), cy(i + 1), i + 1, C.green, 'p1', .7 + i * .08, 22)).join('');
    let cells = '';
    for (let r = 1; r <= n; r++) {
      let row = '';
      for (let c = 1; c <= n; c++) if (!(r === 2 && c === 3)) row += T(cx(c), cy(r), r + c, { size: 22, weight: 600 });
      cells += G('s3', .1 + r * .15, row);
    }
    const body = frame
      + G('s2', .1, `<rect x="${x0 + w}" y="${y0 + 2 * h}" width="${n * w}" height="${h}" fill="${C.yellow}" opacity=".45"/><rect x="${x0 + 3 * w}" y="${y0 + h}" width="${w}" height="${n * h}" fill="${C.sky}" opacity=".8"/>`)
      + heads + ring(cx(0), cy(2) - 8, 18, C.orange, 'r2', .3) + ring(cx(3), cy(0) - 8, 18, C.blue, 'r2', .3)
      + tag(cx(3), cy(2), 5, C.red, 'p2', .9, 24) + ring(cx(3), cy(2) - 8, 18, C.red, 'r2', 1.1)
      + tag(555, 110, '2 + 3 = 5', C.red, 's2', 1.2, 32)
      + cells
      + draw(`M${cx(1) - 14} ${y0 + 2 * h - 4} H${cx(n) + 14}`, C.purple, 3, 3, 1.2)
      + G('s3', 1.4, arrow(490, 190, 610, 190, C.purple) + T(550, 226, '1씩 커짐', { size: 24, color: C.purple }))
      + G('p3', 1.7, pill(550, 300, 130, '덧셈표', C.green, C.mint, 30));
    reg('2-2/수학/6/덧셈표', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
