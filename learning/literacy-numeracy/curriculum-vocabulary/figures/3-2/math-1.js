// 수학 3-2 1단원 곱셈: 낱말 도식
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

  // 곱셈: 500원 배표가 한 장씩 → 500 + 500 + 500 → 500 × 3 → = 1500
  (function () {
    const id = 't32-m1-gopsem';
    const tx = (k) => 95 + k * 160;
    const tickets = [0, 1, 2].map((k) => `<g class="p1" ${delay(.2 + k * .55)}>`
      + `<rect x="${tx(k)}" y="40" width="130" height="72" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M${tx(k) + 100} 44 V108" stroke="${C.blue}" stroke-width="2" stroke-dasharray="5 5"/>`
      + T(tx(k) + 50, 86, '500원', { size: 24, color: C.blue }) + '</g>').join('');
    const counts = [0, 1, 2].map((k) => `<g class="p2" ${delay(.2 + k * .4)}>${T(tx(k) + 65, 146, k + 1, { size: 24, color: C.orange })}</g>`).join('');
    const plus = [[170, '500'], [250, '+'], [330, '500'], [410, '+'], [490, '500']]
      .map(([x, s], i) => `<g class="s1" ${delay(.3 + Math.floor((i + 1) / 2) * .55)}>${T(x, 212, s, { size: 40 })}</g>`).join('');
    const body = tickets + counts + plus
      + `<g class="s2" ${delay(1.3)}>${arrow(110, 222, 150, 262, C.muted)}</g>`
      + `<g class="s2" ${delay(1.4)}>${T(200, 300, '500', { size: 40 })}${T(268, 300, '×', { size: 40 })}${T(320, 300, '3', { size: 40, color: C.orange })}</g>`
      + ring(320, 286, 24, C.orange, 'r2', 1.6)
      + `<g class="p3" ${delay(.2)}>${T(372, 300, '=', { size: 40 })}${T(452, 300, '1500', { size: 40, color: C.green })}</g>`
      + label(580, 300, '곱셈', C.green, 'p3', .8);
    put('3-2/수학/1/곱셈', svg(id, body, motion(id)));
  })();

  // 올림: 54 × 3. 일의 자리 4 × 3 = 12 → 일 모형 10개가 십 모형 하나로 묶여 십의 자리로 → 작은 1
  (function () {
    const id = 't32-m1-ollim';
    const cube = 20, gap = 2;
    const cpos = (i) => [202 + (i % 4) * 25, 104 + Math.floor(i / 4) * 34];   // 일 모형 12개(4개씩 3줄)
    const rpos = (i) => [95, 103 + i * (cube + gap)];                          // 십 모형으로 쌓일 자리
    let cubes = '';
    for (let i = 0; i < 12; i++) {
      const [x, y] = cpos(i), [rx, ry] = rpos(i);
      const sq = `<rect x="${x}" y="${y}" width="${cube}" height="${cube}" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
      const row = Math.floor(i / 4);
      cubes += i < 10
        ? `<g class="m2" ${delay(.2 + i * .07, `--mx:${rx - x}px;--my:${ry - y}px`)}><g class="p1" ${delay(.2 + row * .5 + (i % 4) * .06)}>${sq}</g></g>`
        : `<g class="p1" ${delay(.2 + row * .5 + (i % 4) * .06)}>${sq}</g>`;
    }
    const rodBox = `<rect x="91" y="99" width="${cube + 8}" height="${10 * (cube + gap) + 6}" rx="4" fill="none" stroke="${C.red}" stroke-width="4"/>`;
    const board = `<rect x="40" y="40" width="290" height="300" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + `<path d="M40 84 H330 M170 40 V340" stroke="${C.line}" stroke-width="3"/>`
      + T(105, 72, '십', { size: 22, color: C.muted }) + T(250, 72, '일', { size: 22, color: C.muted });
    // 세로셈: 백 470, 십 520, 일 570
    const S = 44, X = { h: 470, t: 520, o: 570 };
    const calc = T(X.t, 152, '5', { size: S }) + T(X.o, 152, '4', { size: S })
      + T(426, 208, '×', { size: S }) + T(X.o, 208, '3', { size: S })
      + `<path d="M405 226 H600" stroke="${C.ink}" stroke-width="3"/>`
      + `<g class="h3"><g class="s1" ${delay(1.6)}>${T(512, 336, '4 × 3 = 12', { size: 24, color: C.orange })}</g></g>`
      + ring(X.o, 136, 24, C.orange, 'r1', .1) + ring(X.o, 192, 24, C.orange, 'r1', .1)
      + `<g class="f2" ${delay(1.1, `--dx:${105 - X.t}px;--dy:${215 - 92}px`)}>${T(X.t, 100, '1', { size: 26, color: C.red })}</g>`
      + `<g class="p2" ${delay(1.6)}>${T(X.o, 282, '2', { size: S, color: C.orange })}</g>`
      + `<g class="s3" ${delay(.2)}>${T(512, 336, '5 × 3 + 1 = 16', { size: 24, color: C.blue })}</g>`
      + `<g class="p3" ${delay(.9)}>${T(X.h, 282, '1', { size: S, color: C.blue })}${T(X.t, 282, '6', { size: S, color: C.blue })}</g>`
      + ring(X.t, 92, 18, C.red, 'r3', .2)
      + `<g class="s2" ${delay(1.9)}>${arrow(596, 78, 540, 90, C.red)}${T(600, 70, '올림', { size: 24, color: C.red, anchor: 'end' })}</g>`;
    const body = board + cubes
      + `<g class="s2" ${delay(1)}>${rodBox}</g>`
      + calc;
    put('3-2/수학/1/올림', svg(id, body, motion(id) + `
      .sc-${id} .m2 { transition-duration: .7s; }
    `));
  })();

  // 어림셈: 796 이 가까운 800 으로 → 800 × 2 = 1600 → 796 × 2 = 1592 와 견주기
  (function () {
    const id = 't32-m1-eorimsem';
    const x0 = 90, x1 = 550, y = 112, at = (n) => x0 + (n - 700) * (x1 - x0) / 200;
    let ticks = `<path d="M${x0 - 16} ${y} H${x1 + 16}" stroke="${C.ink}" stroke-width="3"/>`;
    for (let n = 700; n <= 900; n += 10) ticks += `<path d="M${f(at(n))} ${y - (n % 100 ? 6 : 11)} V${y + (n % 100 ? 6 : 11)}" stroke="${C.ink}" stroke-width="${n % 100 ? 1.8 : 3}"/>`;
    ticks += [700, 800, 900].map((n) => T(at(n), y + 38, n, { size: 20, weight: 600 })).join('');
    const dx = at(800) - at(796);
    const body = ticks
      + `<g class="m1" ${delay(1, `--mx:${f(dx)}px;--my:0px`)}><g class="p1" ${delay(.2)}><circle cx="${f(at(796))}" cy="${y}" r="10" fill="${C.orange}" stroke="white" stroke-width="2"/></g></g>`
      + `<g class="h2"><g class="s1" ${delay(.3)}>${T(at(796) - 20, y - 24, '796', { size: 24, color: C.orange })}</g></g>`
      + `<g class="s2" ${delay(0)}>${T(at(800), y - 24, '800', { size: 24, color: C.green })}</g>`
      + `<g class="s2" ${delay(.3)}>${T(92, 222, '어림셈', { size: 24, color: C.green })}${T(250, 224, '800 × 2 =', { size: 36 })}</g>`
      + `<g class="p2" ${delay(.9)}>${T(560, 224, '약 1600', { size: 36, color: C.green, anchor: 'end' })}</g>`
      + `<g class="s3" ${delay(.2)}>${T(92, 302, '계산', { size: 24, color: C.muted })}${T(250, 304, '796 × 2 =', { size: 36 })}</g>`
      + `<g class="p3" ${delay(.8)}>${T(560, 304, '1592', { size: 36, color: C.orange, anchor: 'end' })}</g>`
      + `<g class="s3" ${delay(1.4)}><rect x="398" y="182" width="182" height="140" rx="12" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"/></g>`;
    put('3-2/수학/1/어림셈', svg(id, body, motion(id) + `
      .sc-${id} .m1 { transition: transform .8s ease-in-out; }
    `));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
