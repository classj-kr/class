// 수학 3-2 3단원 나눗셈: 낱말 도식
// 나누어 담기는 '날아오기(fN)'로 그린다. 물건은 담긴 자리(마지막 자리)에 그리고, --dx/--dy 에 처음 자리와의 차이를 준다.
// 처음 자리에 있던 물건은 같은 때 gN(그 칸에서 사라지기)으로 지운다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(pathLength="1"), rN 퍼지는 고리, kN 깜빡이며 남기,
  // fN 날아오기(--dx,--dy 만큼 떨어진 곳에서 제자리로), mN 옮겨 가 머물기(--mx,--my), gN 그 칸에서 사라지기(지연 가능)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} :is(.m2,.m3,.m4) { transition: transform .9s ease-in-out; }
    .sc-${id} :is(.g2,.g3,.g4) { transition: opacity .15s linear; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 1; transform: translate(var(--dx), var(--dy)); } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .6s ease-in-out both; }
    .on${n} .sc-${id} .m${n} { transform: translate(var(--mx, 0px), var(--my, 0px)); }
    .on${n} .sc-${id} .g${n} { opacity: 0; }`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const ring = (x, y, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const label = (x, y, s, color, cls, d = 0, size = 28) => `<g class="${cls}" ${delay(d)}>${T(x, y, s, { size, color })}</g>`;

  // 물건 모양
  const orange = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="13" fill="${C.orange}" stroke="#b5601f" stroke-width="2"/><path d="M${f(x)} ${f(y - 13)} q5 -7 11 -5 q-4 6 -11 5 Z" fill="${C.green}"/>`;
  const candy = (x, y, c = C.purple) => `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="${c}" stroke="white" stroke-width="2.5"/>`;
  const token = (x, y, c = C.blue) => `<circle cx="${f(x)}" cy="${f(y)}" r="14" fill="${c}" stroke="white" stroke-width="3"/>`;
  const CUBE = 14, STEP = 10;
  const cube = (x, y) => `<rect x="${f(x)}" y="${f(y)}" width="${CUBE}" height="${CUBE}" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`;
  const rod = (x, y) => `<rect x="${f(x)}" y="${f(y)}" width="${CUBE}" height="${10 * STEP}" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`
    + Array.from({ length: 9 }, (_, k) => `<path d="M${f(x)} ${f(y + (k + 1) * STEP)} h${CUBE}" stroke="${C.blue}" stroke-width="1.5"/>`).join('');
  const plate = (cx, cy, rx = 80) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="17" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
  const basket = (cx) => `<path d="M${cx - 70} 225 H${cx + 70} L${cx + 58} 292 H${cx - 58} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M${cx - 64} 248 H${cx + 64} M${cx - 61} 270 H${cx + 61}" stroke="${C.orange}" stroke-width="1.5" opacity=".6"/>`;
  // 처음 자리 → 담긴 자리: 처음 자리 물건은 gN 으로 지우고 담긴 자리 물건이 fN 으로 날아온다
  const move = (n, d, from, to, draw) =>
    `<g class="g${n}" ${delay(d)}>${draw(...from)}</g><g class="f${n}" ${delay(d, `--dx:${f(from[0] - to[0])}px;--dy:${f(from[1] - to[1])}px`)}>${draw(...to)}</g>`;
  // 식 조각: [x, 글자, 색] 을 늘어놓는다
  const eq = (y, parts, size = 38) => parts.map(([x, s, color = C.ink]) => T(x, y, s, { size, color })).join('');

  // 나눗셈: 귤 12개 → 바구니 3개에 하나씩 돌아가며 담기 → 12 ÷ 3 = 4
  (function () {
    const id = 't32-m3-nanutsem', bx = [150, 320, 490];
    const start = (i) => [100 + i * 40, 72];
    const end = (i) => [bx[i % 3] - 45 + Math.floor(i / 3) * 30, 254];
    let fruits = '';
    for (let i = 0; i < 12; i++) fruits += `<g class="p1" ${delay(.15 + i * .07)}>${move(2, .2 + i * .12, start(i), end(i), orange)}</g>`;
    const body = bx.map(basket).join('')
      + `<g class="h2"><g class="s1" ${delay(1.2)}>${T(320, 128, '12개', { size: 26, color: C.orange })}</g></g>`
      + fruits
      + bx.map((x, k) => `<g class="p2" ${delay(1.6 + k * .12)}>${T(x, 330, '4개', { size: 24, color: C.orange })}</g>`).join('')
      + `<g class="s3" ${delay(.2)}>${eq(92, [[220, '12'], [272, '÷'], [318, '3'], [362, '='], [408, '4', C.orange]])}</g>`
      + ring(408, 79, 24, C.orange, 'r3', .6)
      + label(560, 92, '나눗셈', C.green, 'p3', .9, 28);
    put('3-2/수학/3/나눗셈', svg(id, body, motion(id)));
  })();

  // 몫: 사탕 15개를 5개씩 묶기 → 묶음 1, 2, 3 → 15 ÷ 5 = 3 의 3
  (function () {
    const id = 't32-m3-mok';
    const x = (i) => 74 + i * 32 + Math.floor(i / 5) * 24;
    const candies = Array.from({ length: 15 }, (_, i) => `<g class="p1" ${delay(.15 + i * .06)}>${candy(x(i), 130)}</g>`).join('');
    const lasso = [0, 1, 2].map((g) => {
      const x0 = x(g * 5) - 22, w = x(g * 5 + 4) - x(g * 5) + 44;
      return `<rect class="draw d2" pathLength="1" ${delay(.2 + g * .5)} x="${f(x0)}" y="100" width="${f(w)}" height="60" rx="26" fill="none" stroke="${C.green}" stroke-width="4"/>`
        + `<g class="p2" ${delay(.5 + g * .5)}>${T(x0 + w / 2, 86, `${g + 1}`, { size: 26, color: C.green })}</g>`;
    }).join('');
    const body = candies + lasso
      + `<g class="s2" ${delay(1.8)}>${T(x(2), 196, '5개', { size: 22, color: C.purple })}${T(x(7), 196, '5개', { size: 22, color: C.purple })}${T(x(12), 196, '5개', { size: 22, color: C.purple })}</g>`
      + `<g class="s3" ${delay(.2)}>${eq(290, [[190, '15'], [244, '÷'], [292, '5'], [338, '='], [386, '3', C.orange]], 42)}</g>`
      + ring(386, 275, 26, C.orange, 'r3', .6)
      + `<g class="s3" ${delay(1)}>${arrow(500, 276, 420, 276, C.orange)}${T(540, 286, '몫', { size: 32, color: C.orange })}</g>`;
    put('3-2/수학/3/몫', svg(id, body, motion(id)));
  })();

  // 나누어지는 수: 수 모형 36(십 모형 3, 일 모형 6) → 접시 3개에 똑같이 → 36 ÷ 3 = 12 의 36
  (function () {
    const id = 't32-m3-nanueojineun', px = [140, 320, 500];
    const rodFrom = (k) => [262 + k * 24, 38], rodTo = (k) => [px[k] - 34, 196];
    const cubeFrom = (i) => [350 + (i % 3) * 18, 106 + Math.floor(i / 3) * 18], cubeTo = (i) => [px[i % 3] - 4 + Math.floor(i / 3) * 18, 282];
    let pieces = '';
    for (let k = 0; k < 3; k++) pieces += move(2, .2 + k * .3, rodFrom(k), rodTo(k), rod);
    for (let i = 0; i < 6; i++) pieces += move(2, 1.1 + i * .12, cubeFrom(i), cubeTo(i), cube);
    const body = px.map((x) => plate(x, 306)).join('')
      + `<g class="s1">${pieces}</g>`
      + `<g class="g2" ${delay(.2)}><g class="s1" ${delay(.5)}>${T(440, 96, '36', { size: 32, color: C.orange })}</g></g>`
      + px.map((x, k) => `<g class="p2" ${delay(2 + k * .1)}>${T(x + 56, 240, '12', { size: 26, color: C.blue })}</g>`).join('')
      + `<g class="s3" ${delay(.2)}>${eq(86, [[214, '36', C.orange], [272, '÷'], [318, '3'], [362, '='], [414, '12']])}</g>`
      + ring(214, 72, 32, C.orange, 'r3', .6)
      + `<g class="s3" ${delay(1)}>${arrow(160, 150, 200, 104, C.orange)}${T(130, 176, '나누어지는 수', { size: 26, color: C.orange })}</g>`;
    put('3-2/수학/3/나누어지는 수', svg(id, body, motion(id)));
  })();

  // 나누는 수: 사탕 20개 → 접시 5개(1~5) → 하나씩 돌아가며 4개씩 → 20 ÷ 5 = 4 의 5
  (function () {
    const id = 't32-m3-nanuneun', px = [80, 200, 320, 440, 560];
    const start = (i) => [140 + (i % 10) * 40, 62 + Math.floor(i / 10) * 36];
    const end = (i) => { const p = i % 5, s = Math.floor(i / 5); return [px[p] - 15 + (s % 2) * 30, 262 - Math.floor(s / 2) * 26]; };
    let c = '';
    for (let i = 0; i < 20; i++) c += `<g class="s1" ${delay(.1 + i * .03)}>${move(2, .2 + i * .07, start(i), end(i), candy)}</g>`;
    const body = px.map((x, k) => plate(x, 290, 52) + `<g class="p1" ${delay(.9 + k * .15)}>${T(x, 336, k + 1, { size: 24, color: C.blue })}</g>`).join('')
      + c
      + px.map((x, k) => ring(x, 328, 16, C.blue, 'r3', .9 + k * .12)).join('')
      + `<g class="s3" ${delay(.2)}>${eq(96, [[214, '20'], [266, '÷'], [312, '5', C.blue], [356, '='], [402, '4']], 42)}</g>`
      + ring(312, 81, 26, C.blue, 'r3', .4)
      + `<g class="s3" ${delay(.6)}>${arrow(312, 150, 312, 116, C.blue)}${T(312, 180, '나누는 수', { size: 26, color: C.blue })}</g>`;
    put('3-2/수학/3/나누는 수', svg(id, body, motion(id)));
  })();

  // 나머지: 14명 → 4명씩 묶으면 3묶음, 2명 남음 → 남은 2명은 4칸을 못 채움(2 < 4) → 14 ÷ 4 = 3 … 2
  (function () {
    const id = 't32-m3-nameoji';
    const x = (i) => 62 + i * 39 + Math.floor(i / 4) * 12;
    const slot = (k) => [430 + k * 40, 250];
    let people = '';
    for (let i = 0; i < 14; i++) {
      const p = `<g class="p1" ${delay(.1 + i * .06)}>${token(x(i), 100, i < 12 ? C.blue : C.orange)}</g>`;
      people += i < 12 ? p : `<g class="m3" ${delay(.2, `--mx:${f(slot(i - 12)[0] - x(i))}px;--my:${250 - 100}px`)}>${p}</g>`;
    }
    const lasso = [0, 1, 2].map((g) => {
      const x0 = x(g * 4) - 24, w = x(g * 4 + 3) - x(g * 4) + 48;
      return `<rect class="draw d2" pathLength="1" ${delay(.2 + g * .45)} x="${f(x0)}" y="72" width="${f(w)}" height="56" rx="26" fill="none" stroke="${C.green}" stroke-width="4"/>`
        + `<g class="p2" ${delay(.5 + g * .45)}>${T(x0 + w / 2, 58, `${g + 1}`, { size: 24, color: C.green })}</g>`;
    }).join('');
    const frame = `<rect x="402" y="220" width="216" height="60" rx="28" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="9 7"/>`
      + [2, 3].map((k) => `<circle cx="${slot(k)[0]}" cy="250" r="14" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="5 4"/>`).join('');
    const body = lasso + `<g class="b3">${frame}</g>` + ring(x(12), 100, 16, C.orange, 'r2', 1.7) + ring(x(13), 100, 16, C.orange, 'r2', 1.7)
      + `<g class="k3" ${delay(1.1)}>${[2, 3].map((k) => `<circle cx="${slot(k)[0]}" cy="250" r="14" fill="${C.peach}"/>`).join('')}</g>`
      + people
      + `<g class="s3" ${delay(1.3)}>${T(510, 320, '2 < 4', { size: 30, color: C.orange })}</g>`
      + `<g class="s4" ${delay(.2)}>${eq(250, [[64, '14'], [114, '÷'], [154, '4'], [194, '='], [232, '3'], [276, '…'], [320, '2', C.orange]], 36)}</g>`
      + ring(320, 237, 22, C.orange, 'r4', .5)
      + `<g class="s4" ${delay(.8)}>${arrow(320, 296, 320, 268, C.orange)}${T(320, 326, '나머지', { size: 26, color: C.orange })}</g>`;
    put('3-2/수학/3/나머지', svg(id, body, motion(id) + `
      .sc-${id} .m3 { transition: transform .9s ease-in-out; }
    `));
  })();

  // 나누어떨어지다: 14명 → 2명씩 짝 7쌍, 남는 사람 없음 → 나머지 0
  (function () {
    const id = 't32-m3-tteoreoji';
    const x = (i) => 56 + i * 38 + Math.floor(i / 2) * 6;
    const people = Array.from({ length: 14 }, (_, i) => `<g class="p1" ${delay(.1 + i * .06)}>${token(x(i), 112)}</g>`).join('');
    const pairs = Array.from({ length: 7 }, (_, g) => {
      const x0 = x(g * 2) - 22, w = x(g * 2 + 1) - x(g * 2) + 44;
      return `<rect class="draw d2" pathLength="1" ${delay(.2 + g * .22)} x="${f(x0)}" y="84" width="${f(w)}" height="56" rx="26" fill="none" stroke="${C.green}" stroke-width="4"/>`
        + `<g class="p2" ${delay(.4 + g * .22)}>${T(x0 + w / 2, 70, `${g + 1}`, { size: 22, color: C.green })}</g>`;
    }).join('');
    const body = people + pairs
      + `<g class="s3" ${delay(.2)}>${eq(258, [[70, '14'], [122, '÷'], [164, '2'], [206, '='], [248, '7']], 38)}</g>`
      + `<g class="s3" ${delay(.6)}><rect x="420" y="196" width="170" height="90" rx="14" fill="white" stroke="${C.muted}" stroke-width="3" stroke-dasharray="9 7"/>${T(505, 228, '남은 사람', { size: 20, color: C.muted })}</g>`
      + `<g class="p3" ${delay(1)}>${T(505, 274, '0', { size: 40, color: C.orange })}</g>`
      + ring(505, 260, 22, C.orange, 'r3', 1.2)
      + `<g class="s3" ${delay(1.6)}>${T(160, 318, '나누어떨어진다', { size: 28, color: C.green })}</g>`;
    put('3-2/수학/3/나누어떨어지다', svg(id, body, motion(id)));
  })();

  // 내림: 42 ÷ 3. 십 모형 3개를 하나씩 → 남은 십 모형 1개를 일 모형 10개로 바꿈 → 일 모형 12개를 4개씩 → 14
  (function () {
    const id = 't32-m3-naerim', px = [140, 320, 500];
    const rodFrom = (k) => [70 + k * 26, 44], rodTo = (k) => [px[k] - 40, 196];
    const cpos = (i) => [236 + (i % 6) * 18, 112 + Math.floor(i / 6) * 18];        // 일 모형 12개 자리(2줄)
    const cTo = (i) => [px[i % 3] - 12 + (Math.floor(i / 3) % 2) * 18, 278 - Math.floor(i / 6) * 18];
    let s = '';
    for (let k = 0; k < 3; k++) s += `<g class="s1" ${delay(.1)}>${move(1, .5 + k * .35, rodFrom(k), rodTo(k), rod)}</g>`;
    const left = rodFrom(3);
    s += `<g class="s1" ${delay(.1)}><g class="g2" ${delay(.5)}><g class="k1" ${delay(1.7)}>${rod(...left)}</g></g></g>`;
    // 일 모형 12개: 앞의 10개는 2칸에 생기고(바꾼 것), 뒤 2개는 처음부터 있다
    for (let i = 0; i < 12; i++) {
      const piece = move(3, .2 + i * .1, cpos(i), cTo(i), cube);
      s += i < 10 ? `<g class="f2" ${delay(.5 + i * .09, `--dx:${f(left[0] - cpos(i)[0])}px;--dy:${f(left[1] + i * STEP - cpos(i)[1])}px`)}>${piece}</g>` : `<g class="s1" ${delay(.1)}>${piece}</g>`;
    }
    const body = px.map((x) => plate(x, 306)).join('')
      + `<g class="h2"><g class="s1" ${delay(.1)}>${T(236, 86, '42', { size: 30, color: C.ink })}</g></g>`
      + s
      + `<g class="h3"><g class="s2" ${delay(1.3)}>${T(366, 132, '12', { size: 28, color: C.orange, anchor: 'start' })}</g></g>`
      + `<g class="s2" ${delay(1)}>${T(290, 84, '내림', { size: 30, color: C.red })}</g>`
      + px.map((x, k) => `<g class="p4" ${delay(.2 + k * .12)}>${T(x + 54, 240, '14', { size: 28, color: C.blue })}</g>`).join('')
      + `<g class="s4" ${delay(.6)}>${eq(124, [[436, '42'], [482, '÷'], [520, '3'], [556, '='], [600, '14', C.blue]], 32)}</g>`;
    put('3-2/수학/3/내림', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
