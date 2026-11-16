// 수학 2-1 4단원 길이 재기: 낱말 도식
// 자는 2학년 교과서처럼 cm 눈금만(mm 없음). 물건의 한쪽 끝을 눈금 0에 맞추고, 끝이 눈금 사이면 가까운 쪽 숫자에 「약」.
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
  // x0 = 눈금 0 자리, y = 자의 위 모서리, ppc = 1 cm 의 화면 길이, n = 몇 cm 까지
  const ruler = (x0, y, ppc, n, h = 54, size = 20) => {
    let ticks = '', nums = '';
    for (let c = 0; c <= n; c++) {
      const x = x0 + c * ppc;
      ticks += `M${f(x)} ${y}v${c % 5 ? 18 : 24}`;
      nums += T(x, y + h - 10, c, { size, weight: 700 });
    }
    return `<rect x="${f(x0 - 14)}" y="${y}" width="${f(n * ppc + 28)}" height="${h}" rx="5" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="${ticks}" stroke="${C.ink}" stroke-width="2.5"/>` + nums;
  };
  // 오른쪽을 향한 연필: x 부터 len 길이(심 끝까지), 굵기 th
  const pencil = (x, y, len, th = 28, body = C.sky, edge = C.blue, lead = C.blue) => {
    const tip = 26;
    return `<rect x="${f(x)}" y="${f(y)}" width="${f(len - tip)}" height="${th}" rx="3" fill="${body}" stroke="${edge}" stroke-width="2.5"/>`
      + `<path d="M${f(x + len - tip)} ${f(y)} L${f(x + len)} ${f(y + th / 2)} L${f(x + len - tip)} ${f(y + th)} Z" fill="${C.peach}" stroke="${edge}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M${f(x + len - 9)} ${f(y + th / 2 - 4)} L${f(x + len)} ${f(y + th / 2)} L${f(x + len - 9)} ${f(y + th / 2 + 4)} Z" fill="${lead}"/>`;
  };
  const endLine = (x, y1, y2, color = C.red) => `<path d="M${f(x)} ${y1}V${y2}" stroke="${color}" stroke-width="3" stroke-dasharray="6 5"/>`;

  // 단위: 수학책 긴 쪽에 종이집게를 6번쯤 → 지우개를 4번쯤 → 몇 번 들어가는지 세는 바탕 길이가 단위
  (function () {
    const id = 't21-m4-danwi', x0 = 130, L = 276;
    const clip = (x, y) => `<path d="M${x + 6} ${y + 4} H${x + 38} a6 6 0 0 1 0 12 H${x + 8} a4 4 0 0 1 0 -8 H${x + 34}" fill="none" stroke="${C.purple}" stroke-width="3.5" stroke-linecap="round"/>`;
    const eraser = (x, y) => rect(x + 1, y, 66, 30, 'white', C.blue, 2.5, 4) + `<rect x="${x + 1}" y="${y}" width="24" height="30" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`;
    const body = rect(x0, 40, L, 70, C.peach, C.orange, 3, 4) + T(x0 + L / 2, 84, '수학책', { size: 26, color: C.orange })
      + `<path d="M${x0} 116V250M${x0 + L} 116V250" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 5"/>`
      + Array.from({ length: 6 }, (_, i) => G('p1', .2 + i * .25, clip(x0 + i * 45, 128)) + tag(x0 + i * 45 + 22, 172, i + 1, C.purple, 's1', .3 + i * .25, 20)).join('')
      + tag(425, 152, '종이집게', C.purple, 's1', .1, 24, 'start') + tag(425, 182, '6번쯤', C.purple, 's1', 1.8, 28, 'start')
      + Array.from({ length: 4 }, (_, i) => G('p2', .2 + i * .35, eraser(x0 + i * 68, 200)) + tag(x0 + i * 68 + 34, 254, i + 1, C.blue, 's2', .3 + i * .35, 20)).join('')
      + tag(425, 222, '지우개', C.blue, 's2', .1, 24, 'start') + tag(425, 252, '4번쯤', C.blue, 's2', 1.8, 28, 'start')
      + G('k3', .2, rect(x0 - 4, 124, 52, 30, 'none', C.green, 3.5, 6) + rect(x0 - 4, 196, 76, 38, 'none', C.green, 3.5, 6))
      + G('s3', .5, arrow(76, 150, x0 - 10, 140, C.green) + arrow(76, 205, x0 - 10, 214, C.green) + T(60, 186, '단위', { size: 28, color: C.green }))
      + G('p3', 1.2, pill(320, 316, 110, '단위', C.green, C.mint, 30));
    reg('2-1/수학/4/단위', id, body);
  })();

  // 뼘: 엄지와 검지를 쫙 편 손, 두 끝 사이가 1뼘 → 끈을 따라 손을 옮기며 1뼘, 2뼘, 3뼘 → 뼘
  (function () {
    const id = 't21-m4-ppyeom', x0 = 70, W = 150, y = 210;
    const hand = (x) => {
      const parts = [`M${x + 44} ${y - 52} L${x + 10} ${y - 12}`, `M${x + 78} ${y - 60} L${x + W - 10} ${y - 12}`];
      const out = parts.map((d) => `<path d="${d}" stroke="${C.orange}" stroke-width="28" stroke-linecap="round"/>`).join('') + `<ellipse cx="${x + 64}" cy="${y - 68}" rx="40" ry="31" fill="${C.orange}"/>`;
      const fill = parts.map((d) => `<path d="${d}" stroke="${C.peach}" stroke-width="22" stroke-linecap="round"/>`).join('') + `<ellipse cx="${x + 64}" cy="${y - 68}" rx="37" ry="28" fill="${C.peach}"/>`;
      const nails = `<ellipse cx="${x + 15}" cy="${y - 20}" rx="7" ry="5" transform="rotate(-50 ${x + 15} ${y - 20})" fill="white" stroke="${C.orange}" stroke-width="1.5"/><ellipse cx="${x + W - 16}" cy="${y - 19}" rx="7" ry="5" transform="rotate(40 ${x + W - 16} ${y - 19})" fill="white" stroke="${C.orange}" stroke-width="1.5"/>`;
      return out + fill + nails;
    };
    const seg = (i, cls, d) => G(cls, d, rect(x0 + i * W + 2, y + 2, W - 4, 14, i % 2 ? C.lilac : C.peach, i % 2 ? C.purple : C.orange, 2, 4) + T(x0 + i * W + W / 2, y + 50, `${i + 1}뼘`, { size: 26, color: i % 2 ? C.purple : C.orange }));
    const body = `<path d="M${x0 - 20} ${y + 9}H${x0 + 3 * W + 20}" stroke="${C.muted}" stroke-width="8" stroke-linecap="round"/>`
      + T(x0 + 3 * W + 30, y + 16, '끈', { size: 24, color: C.muted, anchor: 'start' })
      + seg(0, 's1', .8) + seg(1, 's2', 1.1) + seg(2, 's2', 1.9)
      + `<g class="x3" ${dl(.1)}><g class="hd">${hand(x0)}`
      + G('s1', .3, dot(x0, y) + dot(x0 + W, y) + T(x0 - 6, y - 26, '엄지', { size: 22, color: C.ink, anchor: 'end' }) + T(x0 + W + 8, y - 30, '검지', { size: 22, color: C.ink, anchor: 'start' }))
      + `</g></g>`
      + G('s3', .3, `<path d="M${x0} ${y - 150}V${y - 4}M${x0 + W} ${y - 150}V${y - 4}" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="5 5"/>` + arrow(x0 + W / 2, y - 140, x0 + 4, y - 140, C.orange) + arrow(x0 + W / 2, y - 140, x0 + W - 4, y - 140, C.orange) + T(x0 + W / 2, y - 152, '1뼘', { size: 28, color: C.orange }))
      + G('p3', 1, pill(450, 80, 100, '뼘', C.orange, C.peach, 30));
    reg('2-1/수학/4/뼘', id, body, `
      .on2 .sc-${id} .hd { animation: ${id}-step 1.6s steps(2, end) .2s both; }
      @keyframes ${id}-step { from { transform: none; } to { transform: translateX(${2 * W}px); } }`);
    function dot(x, yy) { return `<circle cx="${x}" cy="${yy}" r="7" fill="${C.red}" stroke="white" stroke-width="2"/>`; }
  })();

  // 센티미터: 자의 0~1 사이가 1 cm → 색연필 옆에 1 cm 가 6번 → 6 cm, 센티미터
  (function () {
    const id = 't21-m4-cm', x0 = 80, ppc = 48, y = 190;
    const tiles = Array.from({ length: 6 }, (_, i) => G('p2', .2 + i * .25, rect(x0 + i * ppc + 1, 150, ppc - 2, 30, i % 2 ? C.lilac : C.peach, i % 2 ? C.purple : C.orange, 2, 3) + T(x0 + i * ppc + ppc / 2, 172, i + 1, { size: 20, color: C.ink }))).join('');
    const body = ruler(x0, y, ppc, 10)
      + G('p1', .3, `<rect x="${x0}" y="${y + 2}" width="${ppc}" height="16" fill="${C.orange}" opacity=".55"/>`)
      + `<g class="h2">${G('s1', .6, brace(x0, x0 + ppc, y - 8, C.orange, false) + T(x0 + ppc / 2, y - 40, '1 cm', { size: 30, color: C.orange }))}`
      + tag(390, 120, '1 센티미터', C.orange, 's1', 1.2, 30) + '</g>'
      + G('s2', .1, pencil(x0, 96, 6 * ppc, 34))
      + tiles + G('s2', 1.7, endLine(x0 + 6 * ppc, 130, y))
      + tag(500, 126, '6 cm', C.blue, 'p3', .2, 44)
      + tag(500, 300, '6 센티미터', C.blue, 's3', .7, 28)
      + G('p3', 1.2, pill(210, 314, 160, '센티미터', C.green, C.mint, 28));
    reg('2-1/수학/4/센티미터', id, body);
  })();

  // 자: 자가 밀려 들어오고 0 에 고리 → 색연필 끝을 0 에 맞춰 다른 끝 8 → 자를 대고 곧은 선 긋기
  (function () {
    const id = 't21-m4-ja', x0 = 60, ppc = 50, y = 200;
    const body = G('f1', .1, ruler(x0, y, ppc, 10, 56, 22), '--dx:-80px;--dy:0px')
      + ring(x0, y + 40, 18, C.orange, 'r1', .9)
      + `<g class="g3" ${dl(.1)}><g class="m2" ${dl(.2, '--mx:-90px;--my:0px')}>${G('s2', .1, pencil(x0 + 90, 140, 8 * ppc, 32))}</g>`
      + G('s2', 1.2, endLine(x0 + 8 * ppc, 132, y) + endLine(x0, 132, y, C.green)) + '</g>'
      + `<g class="h3">${tag(x0 + 8 * ppc, 118, '8 cm', C.red, 'p2', 1.5, 34)}</g>`
      + draw(`M${x0} ${y - 6} H${x0 + 9 * ppc}`, C.blue, 5, 3, .2)
      + `<g class="pn">${pencil(x0 - 200, y - 19, 200, 26, C.yellow, C.orange, C.ink)}</g>`
      + G('p3', 1.4, pill(320, 316, 90, '자', C.green, C.mint, 32));
    reg('2-1/수학/4/자', id, body, `
      .sc-${id} .pn { opacity: 0; transform: rotate(0deg); }
      .on3 .sc-${id} .pn { animation: ${id}-pen .7s linear .2s both; }
      @keyframes ${id}-pen { from { opacity: 1; transform: none; } to { opacity: 1; transform: translate(${9 * ppc}px, 0px); } }
      .on3 .sc-${id} .d3 { transition-duration: .7s; transition-timing-function: linear; }`);
  })();

  // 눈금: 크게 본 자의 짧은 줄이 하나씩 그어짐 → 줄 사이마다 1 cm → 지우개 끝이 닿은 줄 4 → 눈금
  (function () {
    const id = 't21-m4-nungeum', x0 = 60, ppc = 86, y = 200, n = 6;
    const ticks = Array.from({ length: n + 1 }, (_, c) => draw(`M${x0 + c * ppc} ${y} V${y + 32}`, C.ink, 4, 1, .2 + c * .2)).join('');
    const body = rect(x0 - 16, y, n * ppc + 32, 70, 'white', C.ink, 3, 6) + ticks
      + Array.from({ length: n + 1 }, (_, c) => T(x0 + c * ppc, y + 60, c, { size: 24 })).join('')
      + Array.from({ length: n }, (_, c) => G('s2', .2 + c * .2, brace(x0 + c * ppc + 4, x0 + (c + 1) * ppc - 4, y + 80, C.orange) + T(x0 + c * ppc + ppc / 2, y + 128, '1 cm', { size: 22, color: C.orange }))).join('')
      + G('f3', .1, rect(x0, 130, 4 * ppc, 56, 'white', C.blue, 3, 6) + `<rect x="${x0}" y="130" width="100" height="56" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`, '--dx:0px;--dy:-60px')
      + G('s3', .8, endLine(x0 + 4 * ppc, 186, y + 34))
      + ring(x0 + 4 * ppc, y + 16, 20, C.red, 'r3', 1) + tag(x0 + 2 * ppc, 116, '4 cm', C.red, 'p3', 1.1, 34)
      + G('k3', 1.3, rect(x0 + 5 * ppc - 14, y - 4, 28, 42, 'none', C.green, 3.5, 6))
      + G('p3', 1.5, pill(x0 + 5 * ppc + 10, 66, 110, '눈금', C.green, C.mint, 30))
      + G('s3', 1.5, arrow(x0 + 5 * ppc + 10, 92, x0 + 5 * ppc, y - 8, C.green));
    reg('2-1/수학/4/눈금', id, body);
  })();

  // 약: 연필 끝을 0 에 맞춤 → 다른 끝은 8 과 9 사이, 9 에 더 가까움 → 약 9 cm
  (function () {
    const id = 't21-m4-yak', x0 = 50, ppc = 54, y = 200, len = 8.8 * ppc;
    const body = ruler(x0, y, ppc, 10, 56, 22)
      + G('s1', .1, pencil(x0, 140, len, 32, C.mint, C.green, C.green))
      + G('s1', .6, endLine(x0, 130, y, C.green)) + ring(x0, y + 46, 18, C.green, 'r1', .8)
      + G('s2', .1, endLine(x0 + len, 130, y + 30))
      + G('k2', .4, `<rect x="${x0 + 8 * ppc}" y="${y + 2}" width="${ppc}" height="16" fill="${C.yellow}" opacity=".8"/>`)
      + G('s2', .9, arrow(x0 + len, y + 74, x0 + 8 * ppc + 3, y + 74, C.muted) + arrow(x0 + len, y + 74, x0 + 9 * ppc - 2, y + 74, C.red) + T(x0 + 8 * ppc, y + 102, '8', { size: 22, color: C.muted }) + T(x0 + 9 * ppc + 4, y + 102, '9', { size: 26, color: C.red }))
      + ring(x0 + 9 * ppc, y + 46, 18, C.red, 'r2', 1.3)
      + tag(250, 96, '약 9 cm', C.red, 'p3', .2, 48)
      + ring(156, 80, 30, C.orange, 'r3', .8)
      + G('p3', 1.2, pill(430, 82, 80, '약', C.orange, C.peach, 32));
    reg('2-1/수학/4/약', id, body);
  })();

  // 어림: 엄지손톱 너비 약 1 cm → 자 없이 지우개 옆에 손톱을 4번쯤 대어 약 4 cm 로 짐작 → 자로 재니 약 4 cm
  (function () {
    const id = 't21-m4-eorim', x0 = 80, ppc = 60, len = 4.2 * ppc;
    const thumb = `<ellipse cx="540" cy="120" rx="40" ry="56" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><rect x="510" y="76" width="${ppc}" height="56" rx="24" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`;
    const body = G('p1', .2, thumb)
      + G('s1', .7, brace(510, 510 + ppc, 64, C.purple, false) + T(540, 34, '약 1 cm', { size: 26, color: C.purple }))
      + G('s1', .1, rect(x0, 150, len, 50, 'white', C.blue, 3, 6) + `<rect x="${x0}" y="150" width="70" height="50" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`)
      + Array.from({ length: 4 }, (_, i) => G('p2', .2 + i * .3, rect(x0 + i * ppc + 2, 124, ppc - 4, 20, C.lilac, C.purple, 2, 8) + T(x0 + i * ppc + ppc / 2, 116, i + 1, { size: 20, color: C.purple }))).join('')
      + tag(540, 214, '어림', C.purple, 's2', 1.4, 24) + tag(540, 248, '약 4 cm', C.purple, 's2', 1.6, 32)
      + G('f3', .1, ruler(x0, 208, ppc, 6, 54, 22), '--dx:-70px;--dy:0px')
      + G('s3', .8, endLine(x0 + len, 140, 232))
      + tag(540, 294, '잰 길이', C.red, 's3', 1, 24) + tag(540, 328, '약 4 cm', C.red, 's3', 1.2, 32)
      + G('k3', 1.4, rect(470, 188, 140, 76, 'none', C.purple, 3.5, 12));
    reg('2-1/수학/4/어림', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
