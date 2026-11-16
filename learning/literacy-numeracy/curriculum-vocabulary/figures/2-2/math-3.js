// 수학 2-2 3단원 길이 재기: 낱말 도식
// 100 cm = 1 m, 1 m 20 cm = 120 cm(교과서). 길이의 합·차는 m 는 m 끼리, cm 는 cm 끼리 계산한다.
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
  // 세로 계산: 행 [m, cm], 기호 op
  const mcm = (y, m, cm, size, color = C.ink, xs = [262, 292, 352, 400]) =>
    T(xs[0], y, m, { size, color }) + T(xs[1], y, 'm', { size: size * .8, color }) + T(xs[2], y, cm, { size, color }) + T(xs[3], y, 'cm', { size: size * .8, color });

  // 미터: 10 cm 막대 10개 → 100 cm → 하나로 묶여 1 m → 20 cm 를 더 이어 1 m 20 cm = 120 cm
  (function () {
    const id = 't22-m3-miteo', x0 = 70, seg = 40, y = 140, h = 36;
    const piece = (i, cls, d) => G(cls, d, rect(x0 + i * seg, y, seg, h, i % 2 ? 'white' : C.peach, C.orange, 2.5, 0), '--dx:0px;--dy:-60px');
    const num = (i, cls, d) => tag(x0 + (i + 1) * seg, y + h + 28, (i + 1) * 10, C.ink, cls, d, 18);
    const body = Array.from({ length: 10 }, (_, i) => piece(i, 'f1', .1 + i * .15)).join('')
      + Array.from({ length: 10 }, (_, i) => num(i, 's1', .25 + i * .15)).join('')
      + T(x0, y + h + 28, 0, { size: 18 }) + T(x0 + 12 * seg + 34, y + h + 28, '(cm)', { size: 18, color: C.muted, anchor: 'start' })
      + `<g class="h2">${tag(x0 + 10 * seg, y - 18, '100 cm', C.orange, 'p1', 1.8, 26)}</g>`
      + G('s2', .1, rect(x0, y, 10 * seg, h, C.mint, C.green, 4, 0))
      + G('s2', .5, brace(x0, x0 + 10 * seg, y - 10, C.green, false) + T(x0 + 5 * seg, y - 46, '1 m', { size: 34, color: C.green }))
      + `<g class="h3">${tag(320, 274, '100 cm = 1 m', C.ink, 's2', 1, 42)}${tag(320, 330, '1 미터', C.green, 's2', 1.5, 30)}</g>`
      + piece(10, 'f3', .1) + piece(11, 'f3', .4) + num(10, 's3', .4) + num(11, 's3', .7)
      + G('s3', .9, brace(x0 + 10 * seg, x0 + 12 * seg, y - 10, C.orange, false) + T(x0 + 11 * seg, y - 46, '20 cm', { size: 26, color: C.orange }))
      + tag(320, 274, '1 m 20 cm = 120 cm', C.ink, 's3', 1.3, 38)
      + G('p3', 1.8, pill(320, 328, 110, '미터', C.green, C.mint, 30));
    reg('2-2/수학/3/미터', id, body);
  })();

  // 줄자: 바닥의 줄자 통 → 통을 들어 올리며 띠가 풀려 키 옆에 섬 → 머리끝 눈금 130, 1 m 30 cm
  (function () {
    const id = 't22-m3-julja', fl = 330, tx = 300, cm = (c) => fl - 2 * c;
    let ticks = '', labels = '';
    for (let c = 10; c <= 140; c += 10) ticks += `M${tx - 14} ${cm(c)}h${c % 50 ? 12 : 22}`;
    for (const c of [50, 100]) labels += T(tx + 26, cm(c) + 7, c, { size: 20, anchor: 'start' });
    const tape = `<g class="tp"><rect x="${tx - 15}" y="${cm(140)}" width="30" height="${2 * 140}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/><path d="${ticks}" stroke="${C.ink}" stroke-width="2"/>${labels}</g>`;
    const box = `<g class="m2" ${dl(.2, `--mx:0px;--my:${cm(140) - 38 - (fl - 38)}px`)}>${rect(tx - 34, fl - 38, 68, 38, C.orange, C.orange, 3, 10)}<circle cx="${tx}" cy="${fl - 19}" r="10" fill="${C.peach}"/></g>`;
    const kid = `<rect x="148" y="116" width="44" height="126" rx="16" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M160 240 V${fl - 2} M180 240 V${fl - 2}" stroke="${C.blue}" stroke-width="14" stroke-linecap="round"/>`
      + `<path d="M150 136 L128 200 M190 136 L212 200" stroke="${C.peach}" stroke-width="12" stroke-linecap="round"/>`
      + `<circle cx="170" cy="${cm(130) + 22}" r="22" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    const body = `<path d="M30 ${fl}H620" stroke="${C.ink}" stroke-width="3"/>`
      + G('s2', .1, kid) + tape + box
      + `<g class="h2">${tag(tx + 50, fl - 12, '줄자', C.orange, 's1', .3, 26, 'start')}</g>`
      + ring(tx, fl - 19, 30, C.orange, 'r1', .6)
      + G('s3', .2, `<path d="M140 ${cm(130)} H${tx - 16}" stroke="${C.red}" stroke-width="4"/>`)
      + ring(tx, cm(130), 16, C.red, 'r3', .6)
      + tag(500, cm(130) + 8, '130 cm', C.red, 'p3', .8, 32) + tag(500, cm(130) + 54, '1 m 30 cm', C.red, 'p3', 1.2, 32)
      + G('p3', 1.6, pill(500, 250, 110, '줄자', C.orange, C.peach, 30));
    reg('2-2/수학/3/줄자', id, body, `
      .sc-${id} .tp { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform .8s ease-in-out .2s; }
      .on2 .sc-${id} .tp { transform: none; }`);
  })();

  // 합: 1 m 70 cm 끈과 1 m 20 cm 끈 → 이어 붙여 전체 → m 끼리, cm 끼리 더해 2 m 90 cm
  (function () {
    const id = 't22-m3-hap', x0 = 40, k = 1.4, a = 170 * k, b = 120 * k;
    const body = G('p1', .2, rect(x0, 30, a, 40, C.peach, C.orange, 3, 6) + T(x0 + a / 2, 58, '1 m 70 cm', { size: 22, color: C.orange }))
      + `<g class="m2" ${dl(.2, `--mx:${f(a)}px;--my:-60px`)}>${G('p1', .6, rect(x0, 90, b, 40, C.sky, C.blue, 3, 6) + T(x0 + b / 2, 118, '1 m 20 cm', { size: 22, color: C.blue }))}</g>`
      + G('s2', 1, brace(x0, x0 + a + b, 78, C.green))
      + `<g class="h3">${tag(x0 + (a + b) / 2, 128, '?', C.green, 's2', 1.3, 30)}</g>`
      + tag(x0 + (a + b) / 2, 128, '2 m 90 cm', C.green, 'p3', 1.6, 30)
      + G('s3', .1, mcm(200, 1, 70, 32) + mcm(246, 1, 20, 32) + T(210, 246, '+', { size: 32 }) + `<path d="M196 262 H430" stroke="${C.ink}" stroke-width="3"/>`)
      + tag(352, 306, '90', C.green, 'p3', .5, 32) + tag(262, 306, '2', C.green, 'p3', .9, 32)
      + G('s3', 1, T(292, 306, 'm', { size: 26, color: C.green }) + T(400, 306, 'cm', { size: 26, color: C.green }))
      + ring(352, 294, 28, C.orange, 'r3', .6) + ring(262, 294, 24, C.orange, 'r3', 1)
      + G('p3', 1.8, pill(550, 296, 80, '합', C.green, C.mint, 32));
    reg('2-2/수학/3/합', id, body);
  })();

  // 차: 2 m 50 cm 끈과 1 m 40 cm 끈을 나란히 → 긴 끈의 남는 부분 → m 끼리, cm 끼리 빼서 1 m 10 cm
  (function () {
    const id = 't22-m3-cha', x0 = 40, k = 1.4, a = 250 * k, b = 140 * k;
    const xs = [470, 496, 548, 592];
    const body = G('p1', .2, rect(x0, 60, a, 40, C.peach, C.orange, 3, 6) + T(x0 + b / 2, 88, '2 m 50 cm', { size: 22, color: C.orange }))
      + G('f1', .7, rect(x0, 120, b, 40, C.sky, C.blue, 3, 6) + T(x0 + b / 2, 148, '1 m 40 cm', { size: 22, color: C.blue }), '--dx:-60px;--dy:0px')
      + G('s2', .2, `<path d="M${x0 + b} 50 V170" stroke="${C.red}" stroke-width="3" stroke-dasharray="6 5"/>`)
      + G('k2', .5, `<rect x="${x0 + b}" y="60" width="${a - b}" height="40" rx="4" fill="${C.yellow}" opacity=".7" stroke="${C.red}" stroke-width="3"/>`)
      + G('s2', 1, brace(x0 + b, x0 + a, 170, C.red))
      + `<g class="h3">${tag(x0 + (a + b) / 2, 220, '?', C.red, 's2', 1.3, 30)}</g>`
      + tag(x0 + (a + b) / 2, 220, '1 m 10 cm', C.red, 'p3', 1.6, 30)
      + G('s3', .1, mcm(90, 2, 50, 28, C.ink, xs) + mcm(134, 1, 40, 28, C.ink, xs) + T(430, 134, '−', { size: 28 }) + `<path d="M420 150 H620" stroke="${C.ink}" stroke-width="3"/>`)
      + tag(xs[2], 190, '10', C.red, 'p3', .5, 28) + tag(xs[0], 190, '1', C.red, 'p3', .9, 28)
      + G('s3', 1, T(xs[1], 190, 'm', { size: 22, color: C.red }) + T(xs[3], 190, 'cm', { size: 22, color: C.red }))
      + G('p3', 1.8, pill(520, 300, 80, '차', C.red, C.peach, 32));
    reg('2-2/수학/3/차', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
