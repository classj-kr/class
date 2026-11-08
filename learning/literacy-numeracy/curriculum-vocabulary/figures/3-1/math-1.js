// 수학 3-1 1단원 덧셈과 뺄셈: 낱말 도식
// 수 모형은 교과서처럼 백 모형(10×10 판), 십 모형(막대), 일 모형(작은 정육면체). 한 칸 Q 로 크기를 맞춘다.
// 받아올림은 일 모형 10개가 쌓여 십 모형 하나가 되고, 받아내림은 백 모형 하나가 같은 자리에서 십 모형 10개로 갈라진다.
// 움직임은 transform·opacity·stroke-dashoffset 만(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(2);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);

  // sN 나타나기, pN 튀어나오기, dN 선 그리기(class="dr", pathLength="100"), rN 퍼지는 고리, kN 깜빡이기,
  // fN 날아오기(--dx,--dy 만큼 떨어진 곳에서 제자리로), mN 옮겨 가 머물기(--mx,--my), gN 사라지기, xN 흐려지기(덜어 냄)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.f1,.f2,.f3,.f4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .7s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .9s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4,.x1,.x2,.x3,.x4){transition:opacity .4s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.18)}100%{opacity:1;transform:none}}
    @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
    @keyframes ${id}-blink{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}
    @keyframes ${id}-fly{from{opacity:1;transform:translate(var(--dx),var(--dy))}to{opacity:1;transform:none}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .4s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .5s ease-out both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0}
    .on${n} .sc-${id} .r${n}{animation:${id}-ring 1.1s ease-out 2 both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.4s ease-in-out both}
    .on${n} .sc-${id} .f${n}{animation:${id}-fly .7s ease-in-out both}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}
    .on${n} .sc-${id} .x${n}{opacity:.22}`;
    return css;
  };
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${dl(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${dl(d)}>${T(x, y, s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 26) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 22)}" width="${w}" height="44" rx="22" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${T(cx, cy + size * .36, s, { size, color })}`;

  // 수 모형
  const Q = 8;
  const flat = (x, y) => {
    let g = '';
    for (let k = 1; k < 10; k++) g += `M${x + k * Q} ${y}v${10 * Q}M${x} ${y + k * Q}h${10 * Q}`;
    return `<rect x="${x}" y="${y}" width="${10 * Q}" height="${10 * Q}" rx="2" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/><path d="${g}" stroke="${C.green}" stroke-width="1" opacity=".55"/>`;
  };
  const rod = (x, y) => {
    let g = '';
    for (let k = 1; k < 10; k++) g += `M${x} ${y + k * Q}h${Q}`;
    return `<rect x="${x}" y="${y}" width="${Q}" height="${10 * Q}" rx="1.5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><path d="${g}" stroke="${C.blue}" stroke-width="1"/>`;
  };
  const cube = (x, y) => `<rect x="${x}" y="${y}" width="${Q}" height="${Q}" rx="1.5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`;
  // 자리 판: 백 12~200, 십 200~296, 일 296~392
  const board = (twoRows) => `<rect x="12" y="12" width="380" height="240" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>`
    + `<path d="M12 48H392M200 12V252M296 12V252" stroke="${C.line}" stroke-width="3"/>`
    + (twoRows ? `<path d="M12 149H392" stroke="${C.line}" stroke-width="2" stroke-dasharray="7 6"/>` : '')
    + T(106, 39, '백', { size: 20, color: C.muted }) + T(248, 39, '십', { size: 20, color: C.muted }) + T(344, 39, '일', { size: 20, color: C.muted });
  const colX = { h: 106, t: 248, o: 344 };
  // 세로셈 자리: 백 466, 십 516, 일 566
  const X = { h: 466, t: 516, o: 566 }, Y = { up: 92, a: 136, b: 190, line: 208, r: 262 }, S = 44;
  const column = (a, b, op) => [...a].map((d, i) => T([X.h, X.t, X.o][i], Y.a, d, { size: S })).join('')
    + [...b].map((d, i) => T([X.h, X.t, X.o][i], Y.b, d, { size: S })).join('')
    + T(420, Y.b, op, { size: S }) + `<path d="M400 ${Y.line}H600" stroke="${C.ink}" stroke-width="3"/>`;

  // 덧셈: 어른 324명 막대와 어린이 215명 막대 → 이어 붙여 모두 → 같은 자리끼리 더해 539
  (function () {
    const id = 't31-m1-deotsem', x0 = 50, y0 = 54, h = 44;
    const bar = (x, y, w, fill, stroke, s) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="3"/>${T(x + w / 2, y + 30, s, { size: 22 })}`;
    const cx = { h: 286, t: 336, o: 386 }, R = { a: 214, b: 262, line: 278, r: 326 };
    const body = `<g class="p1" ${dl(.2)}>${bar(x0, y0, 324, C.peach, C.orange, '어른 324')}</g>`
      + `<g class="m2" ${dl(.2, '--mx:324px;--my:-70px')}><g class="p1" ${dl(.7)}>${bar(x0, y0 + 70, 215, C.sky, C.blue, '어린이 215')}</g></g>`
      + `<path class="dr d2" pathLength="100" ${dl(1.1)} d="M${x0} 108V118H${x0 + 539}V108M${x0 + 269.5} 118V128" stroke="${C.green}" stroke-width="3" fill="none"/>`
      + `<g class="h3">${tag(x0 + 269.5, 158, '?', C.green, 's2', 1.6, 30)}</g>`
      + tag(x0 + 269.5, 158, '539', C.green, 'p3', 2, 30)
      + `<g class="s3" ${dl(.1)}>${['3', '2', '4'].map((d, i) => T([cx.h, cx.t, cx.o][i], R.a, d, { size: 40 })).join('')}`
      + ['2', '1', '5'].map((d, i) => T([cx.h, cx.t, cx.o][i], R.b, d, { size: 40 })).join('')
      + T(236, R.b, '+', { size: 40 }) + `<path d="M220 ${R.line}H412" stroke="${C.ink}" stroke-width="3"/></g>`
      + tag(cx.o, R.r, '5', C.green, 'p3', .5, 40) + tag(cx.t, R.r, '3', C.green, 'p3', .9, 40) + tag(cx.h, R.r, '5', C.green, 'p3', 1.3, 40)
      + ring(236, R.b - 14, 22, C.orange, 'r3', 1.6)
      + `<g class="p3" ${dl(1.8)}>${pill(530, 262, 108, '덧셈', C.green, C.mint, 28)}</g>`;
    put('3-1/수학/1/덧셈', svg(id, body, motion(id)));
  })();

  // 뺄셈: 책 317권에서 172권을 덜어 내면 145권 → 물고기 475마리와 328마리의 차이 147 → 둘 다 − 기호
  (function () {
    const id = 't31-m1-ppaelsem', x0 = 40;
    const rect = (x, y, w, fill, stroke) => `<rect x="${x}" y="${y}" width="${w}" height="40" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
    const eq = (y, parts, size = 32) => parts.map(([x, s, color = C.ink]) => T(x, y, s, { size, color })).join('');
    const body = rect(x0, 36, 145, C.sky, C.blue)
      + `<g class="m1" ${dl(.8, '--mx:160px;--my:0px')}><g class="x1" ${dl(1.6)}>${rect(x0 + 145, 36, 172, C.sky, C.blue)}</g>${tag(x0 + 145 + 86, 64, '172', C.orange, 's1', .6, 22)}</g>`
      + `<g class="g1" ${dl(.5)}>${T(x0 + 158, 64, '317', { size: 22 })}</g>`
      + tag(x0 + 72, 64, '145', C.ink, 's1', 1.5, 22)
      + `<g class="s1" ${dl(1.9)}>${eq(124, [[90, '317'], [146, '−'], [200, '172'], [256, '='], [312, '145', C.green]])}</g>`
      + `<g class="s2" ${dl(.1)}>${rect(x0, 186, 475, C.sky, C.blue)}${T(x0 + 160, 214, '475', { size: 22 })}`
      + `${rect(x0, 236, 328, '#fdf3cf', '#c99a1b')}${T(x0 + 160, 264, '328', { size: 22 })}</g>`
      + `<path class="dr d2" pathLength="100" ${dl(.8)} d="M${x0 + 328} 178V284" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 6" fill="none"/>`
      + `<g class="s2" ${dl(1.2)}><g class="k2" ${dl(1.4)}><rect x="${x0 + 328}" y="186" width="147" height="40" rx="4" fill="${C.peach}" fill-opacity=".8" stroke="${C.orange}" stroke-width="4"/></g>${T(x0 + 401.5, 264, '147', { size: 24, color: C.orange })}</g>`
      + `<g class="s2" ${dl(1.8)}>${eq(330, [[150, '475'], [206, '−'], [260, '328'], [316, '='], [372, '147', C.green]])}</g>`
      + ring(146, 113, 20, C.orange, 'r3', .7) + ring(206, 319, 20, C.orange, 'r3', .7)
      + `<g class="p3" ${dl(.9)}>${pill(540, 124, 108, '뺄셈', C.green, C.mint, 28)}</g>`;
    put('3-1/수학/1/뺄셈', svg(id, body, motion(id)));
  })();

  // 받아올림: 127 + 215. 일 모형 7 + 5 = 12 → 10개가 쌓여 십 모형 하나로 십의 자리에 → 작은 1, 일의 자리 2 → 1 + 2 + 1 = 4, 3 → 342
  (function () {
    const id = 't31-m1-badaollim';
    const ones = [];
    for (let i = 0; i < 7; i++) ones.push([306 + (i % 5) * 15, 62 + Math.floor(i / 5) * 15]);
    for (let j = 0; j < 5; j++) ones.push([306 + j * 15, 164]);
    let cubes = '';
    ones.forEach(([x, y], i) => {
      const c = cube(x, y);
      if (i < 10) {
        const tx = 262, ty = 58 + i * Q;
        cubes += `<g class="m2" ${dl(.3 + i * .08, `--mx:${tx - x}px;--my:${ty - y}px`)}>${c}</g>`;
      } else cubes += c;
    });
    const body = board(true)
      + flat(24, 58) + rod(214, 58) + rod(228, 58)
      + flat(24, 160) + flat(110, 160) + rod(214, 160)
      + cubes
      + `<g class="s2" ${dl(1.4)}><rect x="257" y="53" width="18" height="90" rx="4" fill="none" stroke="${C.red}" stroke-width="3"/></g>`
      + ring(358, 168, 20, C.orange, 'r2', 1.6)
      + column('127', '215', '+')
      + ring(X.o, Y.a - 16, 24, C.orange, 'r1', .7) + ring(X.o, Y.b - 16, 24, C.orange, 'r1', .7)
      + `<g class="h3">${tag(516, 326, '7 + 5 = 12', C.orange, 's2', .2, 24)}</g>`
      + `<g class="f2" ${dl(1.5, `--dx:${266 - X.t}px;--dy:${100 - 84}px`)}>${T(X.t, 84, '1', { size: 28, color: C.red })}</g>`
      + tag(X.o, Y.r, '2', C.orange, 'p2', 1.9, S) + tag(colX.o, 292, '2', C.orange, 'p2', 1.9, 28)
      + tag(516, 326, '1 + 2 + 1 = 4', C.blue, 's3', .2, 24)
      + tag(X.t, Y.r, '4', C.blue, 'p3', .7, S) + tag(colX.t, 292, '4', C.blue, 'p3', .7, 28)
      + tag(X.h, Y.r, '3', C.green, 'p3', 1.2, S) + tag(colX.h, 292, '3', C.green, 'p3', 1.2, 28)
      + ring(X.t, 75, 18, C.red, 'r3', 1.6)
      + `<g class="s3" ${dl(1.6)}>${arrow(574, 50, 532, 70, C.red)}${T(632, 40, '받아올림', { size: 24, color: C.red, anchor: 'end' })}</g>`;
    put('3-1/수학/1/받아올림', svg(id, body, motion(id) + `
      .sc-${id} .m2{transition-duration:.7s}`));
  })();

  // 받아내림: 317 − 172. 일 7 − 2 = 5 → 십 1에서 7을 못 뺌 → 백 모형 하나가 십 모형 10개로 갈라져 십의 자리로(3 → 2, 십 위에 10)
  // → 십 11개에서 7개, 백 2개에서 1개를 덜어 냄 → 145
  (function () {
    const id = 't31-m1-badanaerim';
    let rods = '';
    for (let j = 0; j < 10; j++) {
      const [tx, ty] = j < 4 ? [228 + 14 * j, 58] : [214 + 14 * (j - 4), 160];
      const fx = 24 + Q * j, fy = 160;
      const gone = j >= 3 ? 'x4' : '';
      rods += `<g class="${gone}" ${dl(.4)}><g class="f3" ${dl(.4 + j * .07, `--dx:${fx - tx}px;--dy:${fy - ty}px`)}>${rod(tx, ty)}</g></g>`;
    }
    let cubes = '';
    for (let i = 0; i < 7; i++) {
      const c = cube(306 + (i % 5) * 15, 62 + Math.floor(i / 5) * 15);
      cubes += i >= 5 ? `<g class="x2" ${dl(.6)}>${c}</g>` : c;
    }
    const body = board(false)
      + flat(24, 58) + `<g class="x4" ${dl(1)}>${flat(110, 58)}</g>`
      + `<g class="g3" ${dl(.3)}>${flat(24, 160)}</g>`
      + rod(214, 58) + rods + cubes
      + column('317', '172', '−')
      + `<g class="h3">${tag(516, 326, '7 − 2 = 5', C.orange, 's2', .9, 24)}</g>`
      + tag(X.o, Y.r, '5', C.orange, 'p2', 1.2, S) + tag(colX.o, 292, '5', C.orange, 'p2', 1.2, 28)
      + ring(X.t, Y.a - 16, 22, C.red, 'r2', 1.8) + ring(X.t, Y.b - 16, 22, C.red, 'r2', 1.8) + ring(218, 98, 22, C.red, 'r2', 1.8)
      + `<g class="s3" ${dl(1.2)}><path d="M${X.h - 14} ${Y.a - 4}L${X.h + 14} ${Y.a - 30}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/></g>`
      + tag(X.h, Y.up, '2', C.red, 'p3', 1.3, 24) + tag(X.t, Y.up, '10', C.red, 'p3', 1.5, 24)
      + `<g class="h4">${tag(516, 326, '10 + 1 = 11', C.red, 's3', 1.6, 24)}</g>`
      + tag(516, 326, '11 − 7 = 4', C.blue, 's4', .4, 24)
      + tag(X.t, Y.r, '4', C.blue, 'p4', .9, S) + tag(colX.t, 292, '4', C.blue, 'p4', .9, 28)
      + tag(X.h, Y.r, '1', C.green, 'p4', 1.4, S) + tag(colX.h, 292, '1', C.green, 'p4', 1.4, 28)
      + ring(X.t, Y.up - 8, 20, C.red, 'r4', 1.8)
      + `<g class="s4" ${dl(1.8)}>${arrow(574, 50, 538, 68, C.red)}${T(632, 40, '받아내림', { size: 24, color: C.red, anchor: 'end' })}</g>`;
    put('3-1/수학/1/받아내림', svg(id, body, motion(id)));
  })();

  // 어림셈: 수직선에서 195와 217 → 둘 다 가까운 200으로 → 200 + 200 = 약 400 → 195 + 217 = 412 와 견주기
  (function () {
    const id = 't31-m1-eorimsem', y = 124, at = (n) => 60 + (n - 100) * 2.6;
    let ticks = `<path d="M44 ${y}H596" stroke="${C.ink}" stroke-width="3"/>`, t = '';
    for (let n = 100; n <= 300; n += 10) t += `M${f(at(n))} ${y - (n % 100 ? 6 : 11)}V${y + (n % 100 ? 6 : 11)}`;
    ticks += `<path d="${t}" stroke="${C.ink}" stroke-width="2"/>` + [100, 200, 300].map((n) => T(at(n), y + 40, n, { size: 20, weight: 600 })).join('');
    const pin = (n, color, d) => `<g class="m2" ${dl(.2, `--mx:${f(at(200) - at(n))}px;--my:0px`)}><g class="p1" ${dl(d)}><circle cx="${f(at(n))}" cy="${y}" r="10" fill="${color}" stroke="white" stroke-width="2"/></g></g>`;
    const body = ticks
      + pin(195, C.orange, .2) + pin(217, C.blue, .6)
      + `<g class="h2">${tag(at(195) - 6, y - 30, '195', C.orange, 's1', .3, 24)}${tag(at(217) + 8, y - 30, '217', C.blue, 's1', .7, 24)}</g>`
      + ring(at(200), y, 16, C.green, 'r1', 1.2)
      + tag(at(200), y - 30, '200', C.green, 's2', 1, 26)
      + `<g class="s2" ${dl(1.2)}>${T(96, 236, '어림셈', { size: 24, color: C.green })}${T(300, 238, '200 + 200 =', { size: 36 })}</g>`
      + tag(586, 238, '약 400', C.green, 'p2', 1.7, 36, 'end')
      + `<g class="s3" ${dl(.2)}>${T(96, 314, '계산', { size: 24, color: C.muted })}${T(300, 316, '195 + 217 =', { size: 36 })}</g>`
      + tag(586, 316, '412', C.orange, 'p3', .8, 36, 'end')
      + `<g class="s3" ${dl(1.4)}><rect x="448" y="196" width="158" height="140" rx="12" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"/></g>`;
    put('3-1/수학/1/어림셈', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
