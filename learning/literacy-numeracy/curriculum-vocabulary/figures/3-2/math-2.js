// 수학 3-2 2단원 원: 낱말 도식
// 원을 그리는 움직임: 띠 종이(또는 컴퍼스)를 누름 못 자리 ㅇ 둘레로 돌리고(transform-origin = ㅇ),
// 같은 시간 동안 <circle pathLength="1"> 의 테두리를 그린다. 원 테두리는 3시 방향에서 시작해 시계 방향으로 그려지므로
// 띠 종이도 3시 방향에 두고 시계 방향(+deg)으로 돌린다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(pathLength="1"), rN 퍼지는 고리, kN 깜빡이며 남기,
  // fN 날아오기(--dx,--dy 만큼 떨어진 곳에서 제자리로), mN 옮겨 가 머물기(--mx,--my)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} :is(.m2,.m3,.m4) { transition: transform .9s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .8s ease-in-out both; }
    .on${n} .sc-${id} .m${n} { transform: translate(var(--mx, 0px), var(--my, 0px)); }`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const ring = (x, y, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const label = (x, y, s, color, cls, d = 0, size = 28) => `<g class="${cls}" ${delay(d)}>${T(x, y, s, { size, color })}</g>`;
  const pt = (O, r, deg) => [O[0] + r * Math.cos(deg * Math.PI / 180), O[1] + r * Math.sin(deg * Math.PI / 180)];
  const line = (p, q, { color = C.ink, w = 4, cls = '', d = 0, dash = '' } = {}) =>
    `<path class="${cls}" ${cls.includes('draw') ? `pathLength="1" ${delay(d)}` : ''} d="M${f(p[0])} ${f(p[1])} L${f(q[0])} ${f(q[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''} fill="none"/>`;
  const dot = (p, r = 7, color = C.ink, cls = '', d = 0) => `<circle class="${cls}" ${delay(d)} cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${color}"/>`;
  // 원 테두리: 그려지는 원(draw) 또는 처음부터 있는 원
  const outline = (O, r, { cls = '', d = 0, dur = 1.8, color = C.ink, w = 4 } = {}) =>
    `<circle class="${cls}" ${cls ? `pathLength="1" ${delay(d, `transition-duration:${dur}s;transition-timing-function:linear`)}` : ''} cx="${O[0]}" cy="${O[1]}" r="${r}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
  // 누름 못 + 띠 종이 + 연필(3시 방향). 돌리는 겉 <g class="spin"> 는 CSS 로만 돌린다.
  const strip = (O, r) => `<rect x="${O[0] - 16}" y="${O[1] - 13}" width="${r + 32}" height="26" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" opacity=".92"/>`
    + `<circle cx="${O[0] + r}" cy="${O[1]}" r="9" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5"/>`
    + `<circle cx="${O[0]}" cy="${O[1]}" r="11" fill="${C.red}" stroke="white" stroke-width="2.5"/>`;
  const spinCss = (id, O, n, dur, d = 0) => `
    .sc-${id} .spin { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; }
    .on${n} .sc-${id} .spin { animation: ${id}-spin ${dur}s linear ${d}s both; }`;

  // 원: 띠 종이가 누름 못 둘레를 돌며 원이 그려진다 → 원 위 점 8개까지 같은 길이 → 원
  (function () {
    const id = 't32-m2-won', O = [230, 182], r = 128;
    const marks = Array.from({ length: 8 }, (_, k) => {
      const p = pt(O, r, -90 + k * 45);
      return line(O, p, { color: C.blue, w: 3, cls: 'draw d2', d: .3 + k * .15, dash: '' }) + dot(p, 8, C.blue, 'p2', .5 + k * .15);
    }).join('');
    const body = `<circle cx="${O[0]}" cy="${O[1]}" r="${r}" class="s3" fill="${C.mint}"/>`
      + marks
      + outline(O, r, { cls: 'draw d1', d: .3 })
      + `<g class="h2"><g class="spin">${strip(O, r)}</g></g>`
      + `<g class="s2">${dot(O, 7, C.ink)}</g>`
      + `<g class="s2" ${delay(1.6)}>${T(510, 130, '같은 길이', { size: 26, color: C.blue })}${arrow(450, 142, 312, 176, C.blue)}</g>`
      + `<circle class="k3" ${delay(.2)} cx="${O[0]}" cy="${O[1]}" r="${r}" fill="none" stroke="${C.green}" stroke-width="8"/>`
      + label(500, 270, '원', C.green, 'p3', .6, 40);
    put('3-2/수학/2/원', svg(id, body, motion(id) + spinCss(id, O, 1, 1.8, .3)));
  })();

  // 선분: 두 점 ㄱ, ㄴ → 자를 대고 곧게 긋기 → 굽은 선은 선분이 아니다
  (function () {
    const id = 't32-m2-seonbun', A = [130, 250], B = [500, 140];
    const ang = Math.atan2(B[1] - A[1], B[0] - A[0]) * 180 / Math.PI;
    const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const ruler = `<g transform="translate(${A[0]} ${A[1]}) rotate(${f(ang)})"><rect x="-50" y="6" width="${f(len + 100)}" height="40" rx="5" fill="${C.sky}" fill-opacity=".7" stroke="${C.blue}" stroke-width="2.5"/>`
      + Array.from({ length: Math.floor((len + 90) / 24) }, (_, k) => `<path d="M${-40 + k * 24} 6 V${k % 5 ? 16 : 24}" stroke="${C.blue}" stroke-width="2"/>`).join('') + '</g>';
    const curve = `M${A[0]} ${A[1]} C${A[0] + 40} ${A[1] - 200} ${B[0] - 160} ${B[1] - 120} ${B[0]} ${B[1]}`;
    const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const body = `<g class="b2 h3"><g class="ru">${ruler}</g></g>`
      + `<path class="draw d3" pathLength="1" ${delay(.3, 'transition-duration:.9s')} d="${curve}" stroke="${C.muted}" stroke-width="4" fill="none"/>`
      + `<g class="s3" ${delay(1.3)}>${T(290, 42, '굽은 선', { size: 24, color: C.muted })}<path d="M342 22 l22 22 M364 22 l-22 22" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/></g>`
      + line(A, B, { color: C.orange, w: 6, cls: 'draw d2', d: .9 })
      + `<g class="k3" ${delay(.2)}>${line(A, B, { color: C.orange, w: 9 })}</g>`
      + dot(A, 9, C.ink, 'p1', .2) + dot(B, 9, C.ink, 'p1', .6)
      + label(A[0] - 34, A[1] + 6, 'ㄱ', C.ink, 's1', .2, 40) + label(B[0] + 34, B[1] + 6, 'ㄴ', C.ink, 's1', .6, 40)
      + ring(A[0], A[1], 12, C.orange, 'r3', .4) + ring(B[0], B[1], 12, C.orange, 'r3', .4)
      + `<g class="p3" ${delay(.9)}>${T(mid[0] + 60, mid[1] + 76, '선분 ㄱㄴ', { size: 32, color: C.orange })}</g>`;
    put('3-2/수학/2/선분', svg(id, body, motion(id) + `
      .sc-${id} .ru { transform: translateY(60px); transition: transform .7s ease-out; }
      .on2 .sc-${id} .ru { transform: none; }
    `));
  })();

  // 원의 중심: 띠 종이로 원 그리기 → 누름 못을 뽑으면 점 ㅇ → 여러 선이 모두 ㅇ을 지난다
  (function () {
    const id = 't32-m2-jungsim', O = [220, 182], r = 128;
    const diam = [0, 45, 90, 135].map((a, k) => line(pt(O, r, a), pt(O, r, a + 180), { color: C.blue, w: 3, cls: 'draw d3', d: .2 + k * .3 })).join('');
    const body = outline(O, r, { cls: 'draw d1', d: .3, dur: 1.6 })
      + diam
      + `<g class="h2"><g class="spin">${strip(O, r)}</g></g>`
      + `<g class="m2" ${delay(.2, '--mx:0px;--my:-60px')}><g class="h2"><path d="M${O[0]} ${O[1]} V${O[1] - 40}" stroke="${C.muted}" stroke-width="4"/><circle cx="${O[0]}" cy="${O[1] - 44}" r="13" fill="${C.red}"/></g></g>`
      + `<g class="s2" ${delay(.6)}>${dot(O, 8, C.ink)}${T(O[0] - 9, O[1] + 58, 'ㅇ', { size: 46 })}</g>`
      + ring(O[0], O[1], 14, C.orange, 'r3', 1.4)
      + `<g class="s3" ${delay(1.5)}>${arrow(470, 120, 250, 175, C.orange)}${T(520, 110, '원의 중심', { size: 30, color: C.orange })}</g>`;
    put('3-2/수학/2/원의 중심', svg(id, body, motion(id) + spinCss(id, O, 1, 1.6, .3) + `
      .sc-${id} .m2 { transition: transform .6s ease-in; }
    `));
  })();

  // 반지름: ㅇ에서 원 위의 한 점까지 → 여러 개 → 주황 선분 하나가 돌며 모두와 겹친다(모두 같은 길이)
  (function () {
    const id = 't32-m2-banjireum', O = [220, 182], r = 130;
    const first = pt(O, r, -40);
    const more = [5, 50, 95, 140, 185, 230, 275].map((a, k) => line(O, pt(O, r, a), { color: C.blue, w: 4, cls: 'draw d2', d: .2 + k * .2 }) + dot(pt(O, r, a), 6, C.blue, 'p2', .4 + k * .2)).join('');
    const body = outline(O, r)
      + line(O, first, { color: C.blue, w: 4, cls: 'draw d1', d: .5 }) + dot(first, 7, C.blue, 'p1', 1)
      + more
      + dot(O, 8) + T(O[0] - 38, O[1] - 10, 'ㅇ', { size: 46 })
      + `<g class="s3"><g class="sweep">${line(O, pt(O, r, -40), { color: C.orange, w: 9 })}</g></g>`
      + `<g class="s1" ${delay(1.2)}>${T(520, 116, '반지름', { size: 30, color: C.blue })}</g>`
      + `<g class="p3" ${delay(2)}>${T(520, 190, '3 cm', { size: 30, color: C.orange })}</g>`
      + `<g class="s3" ${delay(2)}>${T(520, 232, '모두 같다', { size: 22, color: C.orange })}</g>`;
    put('3-2/수학/2/반지름', svg(id, body, motion(id) + `
      .sc-${id} .sweep { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; }
      .on3 .sc-${id} .sweep { animation: ${id}-spin 2s ease-in-out .2s both; }
    `));
  })();

  // 지름: ㅇ을 지나지 않는 선분 둘(짧다)과 ㅇ을 지나는 선분 → 반지름 둘로 나뉨(3 cm, 3 cm) → 옆으로 옮겨 6 cm, 반지름의 2배
  (function () {
    const id = 't32-m2-jireum', O = [190, 182], r = 105;
    const L = [O[0] - r, O[1]], R = [O[0] + r, O[1]];
    const bx = 362, by = 250;
    const body = outline(O, r)
      + line(pt(O, r, 200), pt(O, r, 300), { color: C.muted, w: 4, cls: 'draw d1', d: .2 })
      + line(pt(O, r, 120), pt(O, r, 30), { color: C.muted, w: 4, cls: 'draw d1', d: .6 })
      + line(L, R, { color: C.orange, w: 7, cls: 'draw d1', d: 1.1 })
      + dot(O, 7) + T(O[0], O[1] + 44, 'ㅇ', { size: 46 })
      + ring(O[0], O[1], 12, C.orange, 'r1', 1.5)
      + `<g class="s2" ${delay(.2)}>${line(L, O, { color: C.blue, w: 7 })}${line(O, R, { color: C.green, w: 7 })}${dot(O, 7)}</g>`
      + `<g class="s2" ${delay(.6)}>${T(O[0] - r / 2, O[1] - 16, '3 cm', { size: 20, color: C.blue })}${T(O[0] + r / 2, O[1] - 16, '3 cm', { size: 20, color: C.green })}</g>`
      // 옮겨 가는 두 반지름
      + `<g class="s3"><g class="m3" ${delay(.2, `--mx:${bx - L[0]}px;--my:${by - O[1]}px`)}>${line(L, O, { color: C.blue, w: 9 })}</g>`
      + `<g class="m3" ${delay(.5, `--mx:${bx - L[0]}px;--my:${by - O[1]}px`)}>${line(O, R, { color: C.green, w: 9 })}</g></g>`
      + `<g class="s3" ${delay(1.2)}>${T(bx + r / 2, by + 36, '3 cm', { size: 20, color: C.blue })}${T(bx + r * 1.5, by + 36, '3 cm', { size: 20, color: C.green })}</g>`
      + line([bx, by - 46], [bx + 2 * r, by - 46], { color: C.orange, w: 9, cls: 'draw d3', d: 1.4 })
      + `<g class="s3" ${delay(1.8)}>${T(bx + r, by - 64, '지름 6 cm', { size: 28, color: C.orange })}</g>`
      + `<g class="s3" ${delay(2)}>${T(bx + r, 116, '반지름의 2배', { size: 24, color: C.ink })}</g>`
      + `<g class="s1" ${delay(1.7)}>${T(O[0], 56, '지름', { size: 28, color: C.orange })}</g>`;
    put('3-2/수학/2/지름', svg(id, body, motion(id)));
  })();

  // 컴퍼스: 자에 대어 2 cm 벌리기 → 침을 ㅇ에 꽂고 한 바퀴 → 벌린 길이가 반지름
  (function () {
    const id = 't32-m2-compass', O = [210, 190], r = 120;
    const P = [O[0] + r, O[1]], H = [O[0] + r / 2, O[1] - 130];
    const compass = `<path d="M${H[0]} ${H[1]} L${O[0] + 4} ${O[1] - 18}" stroke="${C.muted}" stroke-width="10" stroke-linecap="round"/>`
      + `<path d="M${O[0] + 4} ${O[1] - 18} L${O[0]} ${O[1]}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`
      + `<path d="M${H[0]} ${H[1]} L${P[0] - 6} ${P[1] - 28}" stroke="${C.muted}" stroke-width="10" stroke-linecap="round"/>`
      + `<path d="M${P[0] - 11} ${P[1] - 30} L${P[0]} ${P[1]} L${P[0] + 1} ${P[1] - 26} Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`
      + `<rect x="${H[0] - 7}" y="${H[1] - 34}" width="14" height="26" rx="5" fill="${C.ink}"/>`
      + `<circle cx="${H[0]}" cy="${H[1]}" r="10" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5"/>`;
    const cm = 60;
    const ruler = `<rect x="${O[0] - 20}" y="${O[1] + 6}" width="${3 * cm + 40}" height="44" rx="5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
      + Array.from({ length: 31 }, (_, k) => `<path d="M${O[0] + k * 6} ${O[1] + 6} V${O[1] + (k % 10 ? (k % 5 ? 13 : 17) : 21)}" stroke="${C.blue}" stroke-width="${k % 10 ? 1.5 : 2.5}"/>`).join('')
      + [0, 1, 2, 3].map((k) => T(O[0] + k * cm, O[1] + 42, k, { size: 18, weight: 600, color: C.blue })).join('');
    const body = `<g class="h2"><g class="ru">${ruler}</g></g>`
      + `<g class="h2"><g class="s1" ${delay(1.2)}>${T(O[0] + r / 2, O[1] + 80, '2 cm', { size: 24, color: C.orange })}</g></g>`
      + ring(P[0], P[1], 12, C.orange, 'r1', 1)
      + outline(O, r, { cls: 'draw d2', d: .3 })
      + `<g class="b3">${line(O, P, { color: C.orange, w: 6 })}${T(O[0] + r / 2, O[1] + 32, '2 cm', { size: 24, color: C.orange })}</g>`
      + `<g class="s2" ${delay(.1)}>${T(O[0] - 30, O[1] + 14, 'ㅇ', { size: 46 })}</g>`
      + `<g class="spin">${compass}</g>`
      + `<g class="s3" ${delay(.6)}>${T(520, 96, '컴퍼스', { size: 30, color: C.orange })}${arrow(470, 92, H[0] + 22, H[1] + 4, C.orange)}</g>`
      + `<g class="s3" ${delay(1.2)}>${T(520, 300, '반지름', { size: 26, color: C.blue })}${arrow(470, 290, O[0] + r - 16, O[1] + 8, C.blue)}</g>`;
    put('3-2/수학/2/컴퍼스', svg(id, body, motion(id) + spinCss(id, O, 2, 1.8, .3) + `
      .sc-${id} .ru { transform: translateY(70px); opacity: 0; transition: transform .7s ease-out .3s, opacity .4s ease .3s; }
      .on1 .sc-${id} .ru { transform: none; opacity: 1; }
    `));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
