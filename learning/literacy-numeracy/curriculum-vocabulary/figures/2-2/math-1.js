// 수학 2-2 1단원 네 자리 수: 낱말 도식
// 수 모형: 천 모형(정육면체), 백 모형(판), 십 모형(막대), 일 모형(작은 정육면체). 천 모형은 앞면·윗면·옆면에 칸 줄을 그린 비스듬한 그림.
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
    return `<rect x="${x}" y="${y}" width="${10 * q}" height="${10 * q}" rx="2" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/><path d="${g}" stroke="${C.green}" stroke-width="1" opacity=".55"/>`;
  };
  const rod = (x, y, q) => {
    let g = '';
    for (let k = 1; k < 10; k++) g += `M${x} ${y + k * q}h${q}`;
    return `<rect x="${x}" y="${y}" width="${q}" height="${10 * q}" rx="1.5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><path d="${g}" stroke="${C.blue}" stroke-width="1"/>`;
  };
  const cube = (x, y, q) => `<rect x="${x}" y="${y}" width="${q}" height="${q}" rx="1.5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`;
  // 천 모형: 앞면 왼쪽 위 (x, y), 한 칸 q, 깊이 d(오른쪽 위로)
  const thousand = (x, y, q) => {
    const s = 10 * q, d = 4 * q;
    let g = '';
    for (let k = 1; k < 10; k++) {
      g += `M${x + k * q} ${y}v${s}M${x} ${y + k * q}h${s}`;
      g += `M${x + k * q} ${y}l${d} ${-d}M${f(x + k * d / 10)} ${f(y - k * d / 10)}h${s}`;
      g += `M${x + s} ${y + k * q}l${d} ${-d}M${f(x + s + k * d / 10)} ${f(y - k * d / 10)}v${s}`;
    }
    return `<path d="M${x} ${y}l${d} ${-d}h${s}l${-d} ${d}Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M${x + s} ${y}l${d} ${-d}v${s}l${-d} ${d}Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`
      + `<path d="${g}" stroke="${C.purple}" stroke-width="1" opacity=".5"/>`;
  };

  // 천: 백 모형 9개(900) → 하나 더 놓아 10개 → 모두 모여 천 모형 하나, 1000 천
  (function () {
    const id = 't22-m1-cheon', q = 6;
    const cx = 150, cy = 170;
    let flats = '';
    for (let i = 0; i < 10; i++) {
      const x = 30 + (i % 5) * 76, y = 60 + Math.floor(i / 5) * 90;
      const cls = i < 9 ? 'p1' : 'p2', d = i < 9 ? .1 + i * .17 : .2;
      flats += `<g class="m3" ${dl(.1 + i * .04, `--mx:${cx - 30 - x}px;--my:${cy - 30 - y}px`)}>${G(cls, d, flat(x, y, q))}</g>`;
    }
    const body = `<g class="g3" ${dl(.9)}>${flats}</g>`
      + ring(30 + 4 * 76 + 30, 150 + 30, 40, C.red, 'r2', .4)
      + G('p3', 1, thousand(cx - 60, cy - 40, 10))
      + `<g class="h2">${tag(530, 170, '900', C.green, 's1', 1.7, 64)}</g>`
      + `<g class="h3">${tag(530, 170, '100이 10개', C.red, 'p2', .7, 34)}</g>`
      + tag(530, 170, '1000', C.purple, 'p3', 1.3, 68)
      + G('p3', 1.8, pill(530, 250, 110, '천', C.purple, C.lilac, 36));
    reg('2-2/수학/1/천', id, body);
  })();

  // 네 자리 수: 자리 판에 천 1, 백 5, 십 3, 일 6 → 칸에 1, 5, 3, 6 → 1536 천오백삼십육 → 숫자 4개, 1000 ~ 9999
  (function () {
    const id = 't22-m1-nejarisu', top = 16, hy = 52;
    const col = [[16, 120], [120, 300], [300, 390], [390, 470]], mid = col.map(([a, b]) => (a + b) / 2);
    const board = rect(16, top, 454, 172, 'white', C.line, 3, 8)
      + `<path d="M16 ${hy}H470M120 ${top}V188M300 ${top}V188M390 ${top}V188" stroke="${C.line}" stroke-width="3"/>`
      + ['천', '백', '십', '일'].map((s, i) => T(mid[i], 44, s, { size: 22, color: C.muted })).join('');
    const blocks = G('p1', .1, thousand(34, 96, 5))
      + Array.from({ length: 5 }, (_, i) => G('p1', .4 + i * .1, flat(130 + (i % 3) * 56, 62 + Math.floor(i / 3) * 60, 5))).join('')
      + Array.from({ length: 3 }, (_, i) => G('p1', .9 + i * .1, rod(322 + i * 18, 80, 6))).join('')
      + Array.from({ length: 6 }, (_, i) => G('p1', 1.2 + i * .07, cube(402 + (i % 3) * 20, 100 + Math.floor(i / 3) * 20, 12))).join('');
    const dy = 206, dh = 76;
    const digits = ['1', '5', '3', '6'].map((s, i) => G('p2', .2 + i * .25, rect(mid[i] - 34, dy, 68, dh, C.paper, C.ink, 3, 8) + T(mid[i], dy + 58, s, { size: 52 }))).join('');
    const body = board + blocks + digits
      + tag(560, 110, '1536', C.ink, 's2', 1.2, 54)
      + tag(560, 160, '천오백삼십육', C.green, 's2', 1.6, 24)
      + G('s3', .2, brace(mid[0] - 34, mid[3] + 34, dy + dh + 6, C.orange) + T((mid[0] + mid[3]) / 2, 344, '숫자 4개', { size: 24, color: C.orange }))
      + mid.map((x, i) => ring(x, dy + dh / 2, 30, C.orange, 'r3', .4 + i * .2)).join('')
      + `<g class="s3" ${dl(1.1)}>${rect(482, 214, 156, 58, C.lilac, C.purple, 3, 12)}${T(560, 252, '1000 ~ 9999', { size: 24, color: C.purple })}</g>`
      + G('p3', 1.6, pill(560, 316, 150, '네 자리 수', C.purple, C.lilac, 26));
    reg('2-2/수학/1/네 자리 수', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
