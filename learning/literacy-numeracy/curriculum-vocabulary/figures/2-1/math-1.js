// 수학 2-1 1단원 세 자리 수: 낱말 도식
// 수 모형은 교과서처럼 백 모형(10×10 판), 십 모형(막대), 일 모형(작은 정육면체). 한 칸 q 로 크기를 맞춘다.
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
  const flat = (x, y, q) => {
    let g = '';
    for (let k = 1; k < 10; k++) g += `M${x + k * q} ${y}v${10 * q}M${x} ${y + k * q}h${10 * q}`;
    return `<rect x="${x}" y="${y}" width="${10 * q}" height="${10 * q}" rx="2" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/><path d="${g}" stroke="${C.green}" stroke-width="1" opacity=".55"/>`;
  };
  const rod = (x, y, q) => {
    let g = '';
    for (let k = 1; k < 10; k++) g += `M${x} ${y + k * q}h${q}`;
    return `<rect x="${x}" y="${y}" width="${q}" height="${10 * q}" rx="1.5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><path d="${g}" stroke="${C.blue}" stroke-width="1"/>`;
  };
  const cube = (x, y, q) => `<rect x="${x}" y="${y}" width="${q}" height="${q}" rx="1.5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`;

  // 백: 십 모형 9개(90) → 하나 더 놓아 10개 → 막대가 붙어 백 모형 판 하나, 100 백
  (function () {
    const id = 't21-m1-baek', q = 14, x0 = 40, y0 = 60, gap = 30;
    let rods = '', nums = '';
    for (let i = 0; i < 10; i++) {
      const cls = i < 9 ? 'p1' : 'p2', d = i < 9 ? .15 + i * .15 : .2;
      rods += `<g class="m3" ${dl(.2, `--mx:${-(gap - q) * i}px;--my:0px`)}>${G(cls, d, rod(x0 + i * gap, y0, q))}</g>`;
      nums += tag(x0 + i * gap + q / 2, y0 + 10 * q + 30, (i + 1) * 10, i < 9 ? C.blue : C.red, i < 9 ? 's1' : 's2', i < 9 ? .3 + i * .15 : .4, 18);
    }
    const body = `<g class="g3" ${dl(.9)}>${rods}</g>`
      + `<g class="h3">${nums}</g>`
      + G('s3', 1, flat(x0, y0, q))
      + ring(x0 + 9 * gap + q / 2, y0 + 70, 22, C.red, 'r2', .5)
      + `<g class="h2">${tag(500, 160, '90', C.blue, 's1', 1.6, 64)}</g>`
      + `<g class="h3">${tag(500, 160, '10이 10개', C.red, 'p2', .7, 36)}</g>`
      + tag(500, 160, '100', C.green, 'p3', 1.3, 72)
      + G('p3', 1.8, pill(500, 240, 110, '백', C.green, C.mint, 36))
      + G('k3', 1.2, rect(x0 - 5, y0 - 5, 10 * q + 10, 10 * q + 10, 'none', C.green, 4, 6));
    reg('2-1/수학/1/백', id, body);
  })();

  // 세 자리 수: 자리 판에 백 모형 2, 십 모형 5, 일 모형 4 → 아래 칸에 2, 5, 4 → 254 이백오십사 → 숫자 3개, 100 ~ 999
  (function () {
    const id = 't21-m1-sejarisu', q = 10, top = 16, hy = 52;
    const col = [[20, 250], [250, 370], [370, 460]], mid = col.map(([a, b]) => (a + b) / 2);
    const board = rect(20, top, 440, 170, 'white', C.line, 3, 8)
      + `<path d="M20 ${hy}H460M250 ${top}V186M370 ${top}V186" stroke="${C.line}" stroke-width="3"/>`
      + ['백', '십', '일'].map((s, i) => T(mid[i], 44, s, { size: 22, color: C.muted })).join('');
    const by = 70;
    const blocks = G('p1', .2, flat(30, by, q)) + G('p1', .4, flat(140, by, q))
      + Array.from({ length: 5 }, (_, i) => G('p1', .6 + i * .1, rod(266 + i * 20, by, q))).join('')
      + Array.from({ length: 4 }, (_, i) => G('p1', 1.1 + i * .1, cube(382 + i * 18, by + 45, q))).join('');
    const dy = 206, dh = 76;
    const digits = ['2', '5', '4'].map((s, i) => G('p2', .2 + i * .3, rect(mid[i] - 36, dy, 72, dh, C.paper, C.ink, 3, 8) + T(mid[i], dy + 58, s, { size: 54 }))).join('');
    const body = board + blocks + digits
      + tag(560, 120, '254', C.ink, 's2', 1.1, 56)
      + tag(560, 176, '이백오십사', C.green, 's2', 1.5, 28)
      + G('s3', .2, brace(mid[0] - 36, mid[2] + 36, dy + dh + 6, C.orange) + T((mid[0] + mid[2]) / 2, 344, '숫자 3개', { size: 24, color: C.orange }))
      + ['1', '2', '3'].map((s, i) => ring(mid[i], dy + dh / 2, 30, C.orange, 'r3', .4 + i * .25)).join('')
      + `<g class="s3" ${dl(1.1)}>${rect(482, 216, 156, 58, C.mint, C.green, 3, 12)}${T(560, 254, '100 ~ 999', { size: 26, color: C.green })}</g>`
      + G('p3', 1.6, pill(560, 316, 150, '세 자리 수', C.green, C.mint, 26));
    reg('2-1/수학/1/세 자리 수', id, body);
  })();

  // 자리: 323 을 백·십·일의 자리 칸에 → 백의 자리 3 은 300, 일의 자리 3 은 3 → 십의 자리 2 는 20, 323 = 300 + 20 + 3
  (function () {
    const id = 't21-m1-jari', x0 = 30, w = 150, y0 = 24;
    const cx = [0, 1, 2].map((i) => x0 + w * i + w / 2);
    const table = rect(x0, y0, 3 * w, 150, 'white', C.ink, 3, 8)
      + `<path d="M${x0} ${y0 + 50}H${x0 + 3 * w}M${x0 + w} ${y0}V${y0 + 150}M${x0 + 2 * w} ${y0}V${y0 + 150}" stroke="${C.ink}" stroke-width="2.5"/>`
      + ['백의 자리', '십의 자리', '일의 자리'].map((s, i) => T(cx[i], y0 + 34, s, { size: 24, color: [C.orange, C.green, C.blue][i] })).join('');
    const digits = ['3', '2', '3'].map((s, i) => tag(cx[i], y0 + 130, s, C.ink, 'p1', .3 + i * .25, 68)).join('');
    const val = (i, s, color, cls, d) => G(cls, d, arrow(cx[i], y0 + 160, cx[i], 220, color) + T(cx[i], 262, s, { size: 42, color }));
    const body = table + digits
      + ring(cx[0], y0 + 106, 36, C.orange, 'r2', .2) + val(0, '300', C.orange, 's2', .4)
      + ring(cx[2], y0 + 106, 36, C.blue, 'r2', 1.1) + val(2, '3', C.blue, 's2', 1.3)
      + ring(cx[1], y0 + 106, 36, C.green, 'r3', .2) + val(1, '20', C.green, 's3', .4)
      + G('s3', 1.1, T(255, 328, '323 = 300 + 20 + 3', { size: 36 }))
      + G('p3', 1.7, pill(565, 120, 100, '자리', C.green, C.mint, 30));
    reg('2-1/수학/1/자리', id, body);
  })();

  // 뛰어 세기: 수직선 100 에서 출발 → 100씩 200, 300, 400 → 아래 수직선 235 부터 10씩 245, 255, 265
  (function () {
    const id = 't21-m1-ttwieo';
    const y1 = 130, at1 = (n) => 60 + n * 1.04;
    const y2 = 280, at2 = (n) => 60 + (n - 230) * 13;
    let t1 = '', t2 = '';
    for (let n = 0; n <= 500; n += 100) t1 += `M${f(at1(n))} ${y1 - 10}V${y1 + 10}`;
    for (let n = 230; n <= 270; n += 5) t2 += `M${f(at2(n))} ${y2 - (n % 10 ? 7 : 11)}V${y2 + (n % 10 ? 7 : 11)}`;
    const top = `<path d="M40 ${y1}H600" stroke="${C.ink}" stroke-width="3"/><path d="${t1}" stroke="${C.ink}" stroke-width="2.5"/>`
      + [0, 100, 200, 300, 400, 500].map((n) => T(at1(n), y1 + 36, n, { size: 20, weight: 600 })).join('');
    const hop = (a, b, at, y, color, cls, d, s) => {
      const xa = at(a), xb = at(b), m = (xa + xb) / 2;
      return draw(`M${f(xa)} ${y - 6} Q${f(m)} ${y - 62} ${f(xb)} ${y - 6}`, color, 3.5, cls, d)
        + G(`s${cls}`, d + .4, `<circle cx="${f(xb)}" cy="${y}" r="9" fill="${color}" stroke="white" stroke-width="2"/>`)
        + tag(m, y - 52, s, color, `s${cls}`, d + .3, 20);
    };
    const bottom = `<path d="M40 ${y2}H600" stroke="${C.ink}" stroke-width="3"/><path d="${t2}" stroke="${C.ink}" stroke-width="2.5"/>`;
    const body = top
      + G('p1', .3, `<circle cx="${f(at1(100))}" cy="${y1}" r="10" fill="${C.orange}" stroke="white" stroke-width="2"/>`) + ring(at1(100), y1, 14, C.orange, 'r1', .6)
      + tag(60, 46, '100씩', C.orange, 's2', .1, 26, 'start')
      + hop(100, 200, at1, y1, C.orange, 2, .3, '+100') + hop(200, 300, at1, y1, C.orange, 2, .9, '+100') + hop(300, 400, at1, y1, C.orange, 2, 1.5, '+100')
      + G('s3', .1, bottom + T(60, 206, '10씩', { size: 26, color: C.blue, anchor: 'start' }))
      + G('s3', .3, `<circle cx="${f(at2(235))}" cy="${y2}" r="9" fill="${C.blue}" stroke="white" stroke-width="2"/>`)
      + [235, 245, 255, 265].map((n, i) => tag(at2(n), y2 + 40, n, C.blue, 's3', .3 + i * .5, 22)).join('')
      + hop(235, 245, at2, y2, C.blue, 3, .3, '+10') + hop(245, 255, at2, y2, C.blue, 3, .8, '+10') + hop(255, 265, at2, y2, C.blue, 3, 1.3, '+10')
      + G('p3', 1.8, pill(540, 40, 150, '뛰어 세기', C.green, C.mint, 26));
    reg('2-1/수학/1/뛰어 세기', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
