// 수학 3-1 4단원 곱셈: 낱말 도식
// 교과서 예: 폐건전지 한 상자에 20개씩 4상자(20 × 4), 17명씩 4줄(17 × 4, 7 × 4 = 28 에서 올림한 수 2), 노란색 끈 13 m 의 6배(13 × 6).
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
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }`;
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

  // 곱셈: 폐건전지 20개씩 든 상자가 하나씩 → 20 + 20 + 20 + 20 = 80 → 20 × 4 = 80
  (function () {
    const id = 't31-m4-gopsem';
    const bx = (k) => 40 + k * 150, cx = (k) => bx(k) + 60;
    // 건전지 10개를 한 줄로(한 path): 몸통 8×22, 위에 작은 꼭지
    const row = (x, y) => {
      let d = '';
      for (let i = 0; i < 10; i++) { const X = x + 6 + i * 11; d += `M${X} ${y + 4}h8v22h-8Z M${X + 2} ${y}h4v4h-4Z `; }
      return `<path d="${d}" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5" stroke-linejoin="round"/>`;
    };
    const boxes = [0, 1, 2, 3].map((k) => `<g class="f1" ${delay(.2 + k * .4, '--dx:0px;--dy:-60px')}>`
      + `<rect x="${bx(k)}" y="44" width="120" height="96" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + row(bx(k) + 2, 54) + row(bx(k) + 2, 98)
      + T(cx(k), 172, '20개', { size: 22, color: C.orange }) + '</g>').join('');
    const counts = [0, 1, 2, 3].map((k) => `<g class="p3" ${delay(.2 + k * .2)}>${T(cx(k), 34, k + 1, { size: 22, color: C.red })}</g>`).join('');
    // 덧셈식: 20 이 상자 아래에서 날아와 줄을 선다
    const sx = [100, 200, 300, 400];
    const sum = sx.map((x, k) => `<g class="f2" ${delay(.2 + k * .35, `--dx:${cx(k) - x}px;--dy:-72px`)}>${T(x, 244, '20', { size: 40 })}</g>`).join('')
      + [150, 250, 350].map((x, k) => `<g class="s2" ${delay(.5 + k * .35)}>${T(x, 244, '+', { size: 40 })}</g>`).join('')
      + `<g class="s2" ${delay(1.6)}>${T(455, 244, '=', { size: 40 })}</g>`
      + `<g class="p2" ${delay(1.8)}>${T(522, 244, '80', { size: 40, color: C.green })}</g>`;
    const prod = `<g class="s3" ${delay(.1)}>${arrow(52, 222, 52, 300, C.muted)}</g>`
      + `<g class="s3" ${delay(.3)}>${T(160, 318, '20', { size: 44 })}${T(214, 318, '×', { size: 44 })}${T(274, 318, '4', { size: 44, color: C.red })}</g>`
      + ring(274, 302, 22, C.red, 'r3', 1)
      + `<g class="p3" ${delay(1.2)}>${T(334, 318, '=', { size: 44 })}${T(400, 318, '80', { size: 44, color: C.green })}</g>`
      + label(540, 316, '곱셈', C.green, 'p3', 1.6, 34);
    put('3-1/수학/4/곱셈', svg(id, boxes + counts + sum + prod, motion(id)));
  })();

  // 올림: 17 × 4. 십 모형 4개와 일 모형 28개 → 일 모형 20개가 십 모형 2개로 묶여 십의 자리로, 작은 2 → 1 × 4 + 2 = 6, 68
  (function () {
    const id = 't31-m4-ollim';
    const cube = 20, rodX = (r) => 44 + r * 26, rodY = (i) => 100 + i * 22;
    const rod = (x) => `<rect x="${x}" y="100" width="${cube}" height="218" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
      + `<path d="${Array.from({ length: 9 }, (_, i) => `M${x} ${rodY(i + 1) - 1}h${cube}`).join('')}" stroke="${C.blue}" stroke-width="1.5"/>`;
    const rods = [0, 1, 2, 3].map((r) => `<g class="p1" ${delay(.2 + r * .3)}>${rod(rodX(r))}</g>`).join('');
    const cpos = (i) => [212 + (i % 7) * 25, 104 + Math.floor(i / 7) * 40];  // 일 모형 28개(7개씩 4줄 = 17 의 7 이 네 번)
    let cubes = '';
    for (let i = 0; i < 28; i++) {
      const [x, y] = cpos(i), row = Math.floor(i / 7);
      // 앞의 20개는 십 모형 2개 자리로, 남은 8개는 앞줄로 모인다
      const [tx, ty] = i < 20 ? [rodX(4 + Math.floor(i / 10)), rodY(i % 10)] : cpos(i - 20);
      const sq = `<rect x="${x}" y="${y}" width="${cube}" height="${cube}" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
      cubes += `<g class="m2" ${delay(.2 + (i % 10) * .05, `--mx:${tx - x}px;--my:${ty - y}px`)}><g class="p1" ${delay(.3 + row * .35 + (i % 7) * .04)}>${sq}</g></g>`;
    }
    const board = `<rect x="30" y="40" width="360" height="300" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + `<path d="M30 84 H390 M200 40 V340" stroke="${C.line}" stroke-width="3"/>`
      + T(115, 72, '십', { size: 22, color: C.muted }) + T(295, 72, '일', { size: 22, color: C.muted });
    const box = `<g class="s2" ${delay(1.2)}><rect x="${rodX(4) - 4}" y="96" width="${2 * 26 + 2}" height="226" rx="4" fill="none" stroke="${C.red}" stroke-width="4"/></g>`;
    const S = 44, X = { t: 510, o: 565 };
    const calc = T(X.t, 152, '1', { size: S }) + T(X.o, 152, '7', { size: S })
      + T(462, 208, '×', { size: S }) + T(X.o, 208, '4', { size: S })
      + `<path d="M440 226 H600" stroke="${C.ink}" stroke-width="3"/>`
      + ring(X.o, 136, 24, C.orange, 'r1', 1.6) + ring(X.o, 192, 24, C.orange, 'r1', 1.6)
      + `<g class="h3"><g class="s1" ${delay(1.7)}>${T(520, 336, '7 × 4 = 28', { size: 26, color: C.orange })}</g></g>`
      + `<g class="f2" ${delay(1.3, `--dx:${rodX(4) + 26 - X.t}px;--dy:${210 - 92}px`)}>${T(X.t, 100, '2', { size: 26, color: C.red })}</g>`
      + `<g class="p2" ${delay(1.6)}>${T(X.o, 290, '8', { size: S, color: C.orange })}</g>`
      + `<g class="s2" ${delay(1.9)}>${arrow(590, 78, 532, 88, C.red)}${T(612, 70, '올림', { size: 24, color: C.red, anchor: 'end' })}</g>`
      + `<g class="s3" ${delay(.2)}>${T(520, 336, '1 × 4 + 2 = 6', { size: 26, color: C.blue })}</g>`
      + ring(X.t, 92, 18, C.red, 'r3', .3)
      + `<g class="p3" ${delay(1)}>${T(X.t, 290, '6', { size: S, color: C.blue })}</g>`
      + ring(X.t, 92, 18, C.red, 'r4', .2)
      + `<g class="k4" ${delay(.4)}><rect x="${rodX(4) - 8}" y="92" width="${2 * 26 + 10}" height="234" rx="6" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`;
    put('3-1/수학/4/올림', svg(id, board + rods + cubes + box + calc, motion(id) + `
      .sc-${id} .m2 { transition-duration: .8s; }
    `));
  })();

  // 배: 노란색 끈 13 m → 같은 길이가 여섯 번 이어져 파란색 끈 → 13 × 6 = 78, 78 m
  (function () {
    const id = 't31-m4-bae', x0 = 100, u = 72, yY = 72, yB = 176, h = 26;
    const yellow = `<rect x="${x0}" y="${yY}" width="${u}" height="${h}" rx="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
    const segs = Array.from({ length: 6 }, (_, k) => `<g class="f2" ${delay(.2 + k * .22, `--dx:${-k * u}px;--dy:${yY - yB}px`)}>`
      + `<rect x="${x0 + k * u}" y="${yB}" width="${u}" height="${h}" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`).join('');
    const nums = Array.from({ length: 6 }, (_, k) => `<g class="p2" ${delay(.9 + k * .22)}>${T(x0 + k * u + u / 2, yB - 12, k + 1, { size: 20, color: C.blue })}</g>`).join('');
    const x1 = x0 + 6 * u, m = (x0 + x1) / 2, by = yB + h + 10;
    const brace = `<path d="M${x0} ${by} Q${x0} ${by + 12} ${x0 + 12} ${by + 12} H${m - 12} Q${m} ${by + 12} ${m} ${by + 24} Q${m} ${by + 12} ${m + 12} ${by + 12} H${x1 - 12} Q${x1} ${by + 12} ${x1} ${by}" fill="none" stroke="${C.blue}" stroke-width="3"/>`;
    const body = `<g class="s1" ${delay(.1)}>${T(52, yY + 20, '노란 끈', { size: 20, color: C.orange })}</g>`
      + `<g class="p1" ${delay(.2)}>${yellow}</g>`
      + `<g class="s1" ${delay(.6)}>${T(x0 + u + 14, yY + 21, '13 m', { size: 26, color: C.orange, anchor: 'start' })}</g>`
      + `<g class="s2" ${delay(.1)}>${T(52, yB + 20, '파란 끈', { size: 20, color: C.blue })}</g>`
      + segs + nums
      + `<g class="p2" ${delay(2)}>${T(x1 + 52, yB + 22, '6배', { size: 30, color: C.green })}</g>`
      + `<g class="s3" ${delay(.2)}>${brace}</g>`
      + `<g class="p3" ${delay(.5)}>${T(m, by + 56, '78 m', { size: 30, color: C.blue })}</g>`
      + `<g class="s3" ${delay(1)}>${T(m, 336, '13 × 6 = 78', { size: 36 })}</g>`
      + `<g class="k4" ${delay(.1)}><rect x="${x0 - 6}" y="${yB - 6}" width="${6 * u + 12}" height="${h + 12}" rx="10" fill="none" stroke="${C.green}" stroke-width="3"/></g>`
      + ring(x1 + 52, yB + 12, 26, C.green, 'r4', .3);
    put('3-1/수학/4/배', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
