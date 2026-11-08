// 수학 3-2 4단원 무게와 들이: 낱말 도식
// 양팔 저울: 저울대(.bm)는 받침점 둘레로 돌고, 접시(.pl, .pr)는 기울지 않은 채 위아래로만 움직인다.
// 각 θ(시계 방향 +)일 때 오른쪽 접시는 half·sinθ 만큼 내려가고 왼쪽 접시는 그만큼 올라간다. tilt() 가 칸마다 열쇠틀을 만든다.
// 물 붓기: 병은 제 가운데를 축으로 기울고(fill-box), 병 속 물은 병 입구 쪽으로 줄어들며, 받는 그릇의 물은 바닥에서부터 차오른다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(pathLength="1"), rN 퍼지는 고리, kN 깜빡이며 남기,
  // fN 날아오기(--dx,--dy 만큼 떨어진 곳에서 제자리로), gN 그 칸에서 사라지기(지연 가능)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} :is(.g2,.g3,.g4) { transition: opacity .3s linear; }
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
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .5s ease-in both; }
    .on${n} .sc-${id} .g${n} { opacity: 0; }`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const ring = (x, y, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const label = (x, y, s, color, cls, d = 0, size = 28) => `<g class="${cls}" ${delay(d)}>${T(x, y, s, { size, color })}</g>`;
  const drop = (n, d, dy, inner) => `<g class="f${n}" ${delay(d, `--dx:0px;--dy:${dy}px`)}>${inner}</g>`;

  // ---------- 양팔 저울 ----------
  // cx 받침점 x, py 저울대 높이, half 팔 길이, len 끈 길이. 접시 윗면 높이 = py + len
  function balance(cx, py, half, len, left, right, { base = 330, dish = 62 } = {}) {
    const pan = (ex, items, cls) => `<g class="${cls}"><path d="M${ex} ${py} L${ex - dish + 8} ${py + len} M${ex} ${py} L${ex + dish - 8} ${py + len}" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<path d="M${ex - dish} ${py + len} Q${ex} ${py + len + 30} ${ex + dish} ${py + len} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>${items}</g>`;
    return `<path d="M${cx} ${py} V${base}" stroke="${C.muted}" stroke-width="10" stroke-linecap="round"/>`
      + `<rect x="${cx - 70}" y="${base - 6}" width="140" height="18" rx="6" fill="${C.muted}"/>`
      + pan(cx - half, left, 'pl') + pan(cx + half, right, 'pr')
      + `<g class="bm"><rect x="${cx - half - 6}" y="${py - 6}" width="${2 * half + 12}" height="12" rx="6" fill="${C.green}"/></g>`
      + `<circle cx="${cx}" cy="${py}" r="11" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5"/>`;
  }
  // seq: 칸 번호 n 마다 [[%, 각], …] 열쇠틀. start 는 처음 각
  function tilt(id, cx, py, half, start, seq) {
    const dy = (deg) => f(half * Math.sin(deg * Math.PI / 180));
    let css = `
    .sc-${id} .bm { transform-box: view-box; transform-origin: ${cx}px ${py}px; transform: rotate(${start}deg); }
    .sc-${id} .pl { transform: translateY(${-dy(start)}px); } .sc-${id} .pr { transform: translateY(${dy(start)}px); }`;
    seq.forEach(({ n, frames, dur, d = 0 }, i) => {
      const k = (fn) => frames.map(([p, a]) => `${p}% { transform: ${fn(a)}; }`).join(' ');
      css += `
    @keyframes ${id}-bm${i} { ${k((a) => `rotate(${a}deg)`)} }
    @keyframes ${id}-pl${i} { ${k((a) => `translateY(${-dy(a)}px)`)} }
    @keyframes ${id}-pr${i} { ${k((a) => `translateY(${dy(a)}px)`)} }
    .on${n} .sc-${id} .bm { animation: ${id}-bm${i} ${dur}s ease-in-out ${d}s both; }
    .on${n} .sc-${id} .pl { animation: ${id}-pl${i} ${dur}s ease-in-out ${d}s both; }
    .on${n} .sc-${id} .pr { animation: ${id}-pr${i} ${dur}s ease-in-out ${d}s both; }`;
    });
    return css;
  }
  // 물건 모양 (x, y 는 놓이는 바닥 가운데)
  const boxOn = (x, y, w, h, fill, stroke, name) => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + (name ? T(x, y - h / 2 + 8, name, { size: 22, color: stroke }) : '');
  const clip = (x, y) => `<rect x="${x - 6}" y="${y - 24}" width="12" height="24" rx="6" fill="none" stroke="${C.blue}" stroke-width="2.5"/><path d="M${x - 2} ${y - 18} V${y - 6}" stroke="${C.blue}" stroke-width="2"/>`;
  const stone = (x, y) => `<circle cx="${x}" cy="${y - 11}" r="11" fill="${C.ink}" stroke="white" stroke-width="2"/>`;
  const weight = (x, y, w, h, name, size = 20) => `<path d="M${x - w / 2} ${y} L${x - w / 2 + 6} ${y - h} H${x + w / 2 - 6} L${x + w / 2} ${y} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<rect x="${x - 9}" y="${y - h - 9}" width="18" height="10" rx="4" fill="${C.ink}"/>` + (name ? T(x, y - h / 2 + size * .36, name, { size, color: 'white' }) : '');

  // 무게: 크기가 같은 두 상자(솜, 돌) → 저울에 올리면 돌 쪽이 내려감 → 무겁다·가볍다
  (function () {
    const id = 't32-m4-muge', cx = 320, py = 116, half = 170, len = 116, top = py + len;
    const L = drop(2, .2, -140, boxOn(cx - half, top, 84, 62, C.sky, C.blue, '솜'));
    const R = drop(2, .5, -140, boxOn(cx + half, top, 84, 62, C.peach, C.orange, '돌'));
    const body = `<g class="h2"><g class="s1" ${delay(.2)}>${boxOn(cx - half, 90, 84, 62, C.sky, C.blue, '솜')}${boxOn(cx + half, 90, 84, 62, C.peach, C.orange, '돌')}</g></g>`
      + `<g class="h2"><g class="s1" ${delay(.6)}>${arrow(cx - half - 66, 30, cx - half - 66, 88, C.muted, '', 3)}${arrow(cx - half - 66, 88, cx - half - 66, 30, C.muted, '', 3)}${T(cx, 66, '같은 크기', { size: 22, color: C.muted })}${arrow(cx + half + 66, 30, cx + half + 66, 88, C.muted, '', 3)}${arrow(cx + half + 66, 88, cx + half + 66, 30, C.muted, '', 3)}</g></g>`
      + balance(cx, py, half, len, L, R)
      + `<g class="s3" ${delay(.3)}>${T(cx - half, 316, '가볍다', { size: 26, color: C.blue })}${T(cx + half, 316, '무겁다', { size: 26, color: C.orange })}</g>`
      + `<g class="p3" ${delay(1)}>${T(cx, 56, '무게', { size: 34, color: C.green })}</g>`;
    put('3-2/수학/4/무게', svg(id, body, motion(id) + tilt(id, cx, py, half, 0, [{ n: 2, frames: [[0, 0], [100, 9]], dur: 1, d: 1 }])));
  })();

  // 단위: 지우개를 클립으로 재면 12개, 바둑돌로 재면 5개 → 재는 것마다 수가 다르다 → kg, g, L, mL, cm
  (function () {
    const id = 't32-m4-danwi', cx = 260, py = 130, half = 150, len = 80, top = py + len;
    const eraser = `<rect x="${cx - half - 40}" y="${top - 32}" width="80" height="32" rx="5" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="${cx - half + 10}" y="${top - 32}" width="30" height="32" rx="3" fill="${C.blue}"/>`;
    const clips = Array.from({ length: 12 }, (_, i) => `<g class="g2" ${delay(.1)}>${drop(1, .3 + i * .1, -120, clip(cx + half - 40 + (i % 6) * 16, top - Math.floor(i / 6) * 26))}</g>`).join('');
    const stones = Array.from({ length: 5 }, (_, i) => drop(2, .6 + i * .15, -120, stone(cx + half - 36 + (i % 4) * 24, top - Math.floor(i / 4) * 22))).join('');
    const units = ['kg', 'g', 'L', 'mL', 'cm'].map((u, k) => `<g class="p3" ${delay(.6 + k * .2)}><rect x="530" y="${54 + k * 56}" width="84" height="44" rx="10" fill="white" stroke="${C.green}" stroke-width="3"/>${T(572, 85 + k * 56, u, { size: 26, color: C.green })}</g>`).join('');
    const body = balance(cx, py, half, len, eraser, clips + stones)
      + `<g class="s1" ${delay(.1)}>${T(cx - half, top + 50, '지우개', { size: 22, color: C.blue })}</g>`
      + `<g class="s1" ${delay(1.7)}>${T(cx + half, 44, '클립 12개', { size: 24, color: C.blue })}</g>`
      + `<g class="s2" ${delay(1.6)}>${T(cx + half, 80, '바둑돌 5개', { size: 24, color: C.ink })}</g>`
      + `<g class="k3" ${delay(.1)}><rect x="${cx + half - 80}" y="16" width="160" height="76" rx="10" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`
      + units
      + `<g class="p3" ${delay(1.8)}>${T(572, 38, '단위', { size: 30, color: C.green })}</g>`;
    put('3-2/수학/4/단위', svg(id, body, motion(id) + tilt(id, cx, py, half, -9, [
      { n: 1, frames: [[0, -9], [100, 0]], dur: .6, d: 1.5 },
      { n: 2, frames: [[0, 0], [25, -9], [70, -9], [100, 0]], dur: 1.8, d: .1 }
    ])));
  })();

  // 킬로그램: 1 kg 추 → 100 g 추를 하나씩 10개 올리면 수평 → 1 kg = 1000 g
  (function () {
    const id = 't32-m4-kg', cx = 300, py = 120, half = 170, len = 80, top = py + len;
    const kg = drop(1, .3, -130, weight(cx - half, top, 84, 54, '1 kg', 22));
    const small = Array.from({ length: 10 }, (_, i) => drop(2, .2 + i * .14, -130, weight(cx + half - 44 + (i % 5) * 22, top - Math.floor(i / 5) * 26, 20, 20, ''))).join('');
    const body = balance(cx, py, half, len, kg, small)
      + `<g class="s2" ${delay(.1)}>${weight(548, 72, 20, 20, '')}${T(566, 66, '100 g', { size: 20, anchor: 'start', color: C.ink })}</g>`
      + `<g class="p2" ${delay(1.9)}>${T(cx + half, top + 84, '1000 g', { size: 28, color: C.orange })}</g>`
      + `<g class="p1" ${delay(1)}>${T(cx - half, top + 84, '1 kg', { size: 28, color: C.blue })}</g>`
      + `<g class="s3" ${delay(.2)}>${T(cx, 52, '1 kg = 1000 g', { size: 36, color: C.ink })}</g>`
      + ring(cx, 40, 30, C.green, 'r3', .6)
      + `<g class="s3" ${delay(1)}>${T(cx - half, 324, '킬로그램', { size: 26, color: C.green })}</g>`;
    put('3-2/수학/4/킬로그램', svg(id, body, motion(id) + tilt(id, cx, py, half, 0, [
      { n: 1, frames: [[0, 0], [100, -10]], dur: .7, d: .8 },
      { n: 2, frames: [[0, -10], [100, 0]], dur: .6, d: 1.6 }
    ])));
  })();

  // 그램: 클립 1개와 1 g 추가 수평 → 100 g 칸이 10개 차오름 → 1000 g = 1 kg
  (function () {
    const id = 't32-m4-g', cx = 320, py = 70, half = 120, len = 64, top = py + len;
    const body = balance(cx, py, half, len, drop(1, .2, -80, clip(cx - half, top)), drop(1, .6, -80, weight(cx + half, top, 34, 22, '')), { base: 196, dish: 46 })
      + `<g class="s1" ${delay(.9)}>${T(cx - half - 70, top - 6, '클립', { size: 22, color: C.blue })}${T(cx + half + 74, top - 6, '1 g', { size: 26, color: C.ink })}</g>`
      + `<rect x="60" y="238" width="520" height="44" rx="6" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + Array.from({ length: 10 }, (_, k) => `<rect class="cell" ${delay(.2 + k * .16)} x="${62 + k * 51.6}" y="240" width="51.6" height="40" fill="${C.peach}"/>`).join('')
      + Array.from({ length: 9 }, (_, k) => `<path d="M${60 + (k + 1) * 52} 238 V282" stroke="${C.ink}" stroke-width="2"/>`).join('')
      + T(60, 310, '0 g', { size: 20, weight: 600 }) + `<g class="s2" ${delay(.1)}>${T(112, 230, '100 g', { size: 20, color: C.orange })}</g>`
      + `<g class="p2" ${delay(1.9)}>${T(580, 310, '1000 g', { size: 22, color: C.orange })}</g>`
      + `<g class="s3" ${delay(.2)}>${weight(560, 226, 60, 40, '1 kg', 18)}</g>`
      + `<g class="s3" ${delay(.6)}>${T(330, 346, '1000 g = 1 kg', { size: 30, color: C.ink })}</g>`
      + `<g class="k3" ${delay(.3)}><rect x="60" y="238" width="520" height="44" rx="6" fill="none" stroke="${C.green}" stroke-width="6"/></g>`
      + `<g class="s3" ${delay(1)}>${T(120, 346, '그램', { size: 26, color: C.green })}</g>`;
    put('3-2/수학/4/그램', svg(id, body, motion(id) + tilt(id, cx, py, half, 0, [{ n: 1, frames: [[0, 0], [40, 8], [100, 0]], dur: 1.2, d: .4 }]) + `
      .sc-${id} .cell { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .2s linear; }
      .on2 .sc-${id} .cell { transform: none; }
    `));
  })();

  // 톤: 100 kg 상자가 하나씩 트럭에 실려 10개 → 1000 kg → 1 t
  (function () {
    const id = 't32-m4-ton';
    const bw = 74, bh = 44, x0 = 108, bed = 236;
    const boxes = Array.from({ length: 10 }, (_, i) => {
      const x = x0 + (i % 5) * (bw + 4), y = bed - bh - Math.floor(i / 5) * (bh + 4);
      return drop(1, .2 + i * .17, -170, `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>${T(x + bw / 2, y + 29, '100 kg', { size: 18, color: C.orange })}`);
    }).join('');
    const truck = `<rect x="96" y="${bed}" width="410" height="26" rx="4" fill="${C.blue}"/>`
      + `<path d="M512 ${bed + 26} V166 H572 L612 212 V${bed + 26} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round"/>`
      + `<path d="M524 178 H566 L594 210 H524 Z" fill="white" stroke="${C.blue}" stroke-width="3"/>`
      + [150, 250, 450, 560].map((x) => `<circle cx="${x}" cy="${bed + 40}" r="24" fill="${C.ink}"/><circle cx="${x}" cy="${bed + 40}" r="9" fill="${C.line}"/>`).join('')
      + `<path d="M20 ${bed + 64} H620" stroke="${C.line}" stroke-width="4"/>`;
    const body = truck + boxes
      + `<g class="p1" ${delay(2)}>${T(300, 56, '1000 kg', { size: 32, color: C.orange })}</g>`
      + `<g class="s2" ${delay(.3)}>${T(400, 56, '=', { size: 32 })}</g>`
      + `<g class="p2" ${delay(.7)}><rect x="436" y="16" width="96" height="56" rx="10" fill="white" stroke="${C.red}" stroke-width="4"/>${T(484, 56, '1 t', { size: 32, color: C.red })}</g>`
      + ring(484, 44, 40, C.red, 'r3', .3)
      + `<g class="s3" ${delay(.8)}>${T(580, 56, '톤', { size: 30, color: C.green })}</g>`;
    put('3-2/수학/4/톤', svg(id, body, motion(id)));
  })();

  // 어림: 사과를 들고 200 g쯤 → 저울에 올리니 바늘이 210 g → 짐작과 잰 값이 가깝다
  (function () {
    const id = 't32-m4-eorim', cx = 420, cy = 230, R = 92;
    const ang = (g) => -120 + 240 * g / 500;
    const ticks = Array.from({ length: 26 }, (_, k) => {
      const a = (ang(k * 20) - 90) * Math.PI / 180, r1 = k % 5 ? R - 12 : R - 20;
      return `<path d="M${f(cx + R * Math.cos(a))} ${f(cy + R * Math.sin(a))} L${f(cx + r1 * Math.cos(a))} ${f(cy + r1 * Math.sin(a))}" stroke="${C.ink}" stroke-width="${k % 5 ? 1.5 : 3}"/>`;
    }).join('') + [0, 100, 200, 300, 400, 500].map((g) => { const a = (ang(g) - 90) * Math.PI / 180; return T(cx + (R - 40) * Math.cos(a), cy + (R - 40) * Math.sin(a) + 7, g, { size: 18, weight: 600 }); }).join('');
    const apple = (x, y) => `<circle cx="${x - 14}" cy="${y}" r="30" fill="${C.red}"/><circle cx="${x + 14}" cy="${y}" r="30" fill="${C.red}"/><path d="M${x} ${y - 28} q3 -16 10 -20" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${x + 4} ${y - 34} q16 -12 26 -2 q-14 10 -26 2 Z" fill="${C.green}"/>`;
    const scale = `<rect x="${cx - 110}" y="${cy - 128}" width="220" height="16" rx="6" fill="${C.muted}"/><rect x="${cx - 10}" y="${cy - 114}" width="20" height="20" fill="${C.muted}"/>`
      + `<rect x="${cx - 112}" y="${cy - 100}" width="224" height="212" rx="24" fill="${C.sky}" stroke="${C.blue}" stroke-width="4"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="white" stroke="${C.ink}" stroke-width="3"/>` + ticks + T(cx, cy + 44, 'g', { size: 20, color: C.muted });
    const body = scale
      + `<g class="needle"><path d="M${cx} ${cy + 12} V${cy - R + 14}" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/></g><circle cx="${cx}" cy="${cy}" r="8" fill="${C.red}"/>`
      + `<g class="ap">${apple(130, 220)}</g>`
      + `<g class="h2"><g class="s1" ${delay(.5)}><path d="M70 140 q-40 -10 -30 -46 q4 -36 50 -40 q30 -30 74 -6 q44 -10 54 30 q36 14 12 50 q-10 22 -60 18 q-40 18 -100 -6 Z" fill="white" stroke="${C.muted}" stroke-width="3"/><circle cx="118" cy="166" r="6" fill="white" stroke="${C.muted}" stroke-width="2.5"/>${T(134, 106, '200 g쯤', { size: 26, color: C.purple })}</g></g>`
      + `<g class="s3" ${delay(.2)}>${T(120, 60, '어림', { size: 26, color: C.purple })}${T(120, 96, '200 g쯤', { size: 28, color: C.purple })}</g>`
      + `<g class="s3" ${delay(.6)}>${T(120, 170, '잰 무게', { size: 26, color: C.red })}${T(120, 206, '210 g', { size: 28, color: C.red })}</g>`
      + `<g class="p2" ${delay(1.9)}>${T(588, 236, '210 g', { size: 28, color: C.red })}</g>`
      + `<g class="s3" ${delay(1.2)}><rect x="30" y="28" width="180" height="196" rx="14" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="9 7"/></g>`;
    const apDx = cx - 130, apDy = (cy - 128) - 30 - 220;
    put('3-2/수학/4/어림', svg(id, body, motion(id) + `
      .sc-${id} .needle { transform-box: view-box; transform-origin: ${cx}px ${cy}px; transform: rotate(${ang(0)}deg); }
      .on2 .sc-${id} .needle { animation: ${id}-nd 1.2s ease-out .9s both; }
      @keyframes ${id}-nd { 0% { transform: rotate(${ang(0)}deg); } 60% { transform: rotate(${f(ang(240))}deg); } 80% { transform: rotate(${f(ang(200))}deg); } 100% { transform: rotate(${f(ang(210))}deg); } }
      .sc-${id} .ap { transition: transform .9s ease-in-out .1s, opacity .4s; }
      .on2 .sc-${id} .ap { transform: translate(${apDx}px, ${apDy}px); }
    `));
  })();

  // ---------- 물 붓기 ----------
  // 병(가운데 bx, by 기준 그림)은 .tip 으로 기울고, 병 속 물 .bw 는 입구(위) 쪽으로 줄고, 그릇 물 .cw 는 바닥부터 찬다.
  function pourCss(id, n, cls, deg, d) {
    return `
    .sc-${id} .${cls} .tip { transform-box: fill-box; transform-origin: center; transition: transform .7s ease-in-out ${d}s; }
    .on${n} .sc-${id} .${cls} .tip { transform: rotate(${deg}deg); }
    .sc-${id} .${cls} .bw { transform-box: fill-box; transform-origin: center top; transition: transform 1.2s linear ${d + .7}s; }
    .on${n} .sc-${id} .${cls} .bw { transform: scaleY(0); }
    .sc-${id} .${cls} .cw { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform 1.2s linear ${d + .7}s; }
    .on${n} .sc-${id} .${cls} .cw { transform: none; }
    .sc-${id} .${cls} .st { opacity: 0; }
    .on${n} .sc-${id} .${cls} .st { animation: ${id}-st 1.3s linear ${d + .65}s both; }
    @keyframes ${id}-st { 0%, 100% { opacity: 0; } 8%, 90% { opacity: 1; } }`;
  }
  // 받는 그릇(눈금 없는 컵): 가운데 x, 바닥 y, 너비 w, 높이 h, 물 높이 wh
  const cup = (x, y, w, h, wh, cls = 'cw') => `<rect class="${cls}" x="${x - w / 2 + 3}" y="${y - wh}" width="${w - 6}" height="${wh - 3}" fill="${C.sky}"/>`
    + `<path d="M${x - w / 2} ${y - h} V${y} H${x + w / 2} V${y - h}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  // 병: 몸통 가운데 (x, y), 너비 w, 높이 h, 목 너비 nw
  const bottle = (x, y, w, h, nw, name, color) => {
    const t = y - h / 2, b = y + h / 2;
    return `<g class="tip"><rect class="bw" x="${x - w / 2 + 4}" y="${t + 26}" width="${w - 8}" height="${h - 30}" fill="${C.sky}"/>`
      + `<path d="M${x - nw / 2} ${t} V${t + 12} Q${x - w / 2} ${t + 18} ${x - w / 2} ${t + 32} V${b} H${x + w / 2} V${t + 32} Q${x + w / 2} ${t + 18} ${x + nw / 2} ${t + 12} V${t}" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round"/>`
      + T(x, y + 16, name, { size: 26, color }) + '</g>';
  };
  const stream = (x, y1, y2) => `<rect class="st" x="${x - 4}" y="${y1}" width="8" height="${y2 - y1}" rx="4" fill="${C.blue}" opacity=".7"/>`;

  // 들이: 모양이 다른 물병 가, 나 → 같은 컵에 붓기 → 가 쪽 물이 더 높다
  (function () {
    const id = 't32-m4-deuli', cupY = 336, cupH = 150, cw = 120;
    const A = { x: 200, h: 110 }, B = { x: 450, h: 74 };
    const body = `<g class="pa">${cup(A.x, cupY, cw, cupH, A.h)}${bottle(A.x - 72, 96, 54, 150, 26, '가', C.blue)}${stream(A.x - 2, 124, cupY - 4)}</g>`
      + `<g class="pb">${cup(B.x, cupY, cw, cupH, B.h)}${bottle(B.x - 74, 112, 96, 112, 30, '나', C.orange)}${stream(B.x - 22, 133, cupY - 4)}</g>`
      + `<g class="s3" ${delay(.2)}><path d="M${A.x - 70} ${cupY - A.h} H${B.x + 70}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"/></g>`
      + `<g class="s3" ${delay(.6)}>${arrow(B.x + 80, cupY - B.h, B.x + 80, cupY - A.h + 4, C.blue, '', 3)}</g>`
      + `<g class="s3" ${delay(1)}>${T(A.x, cupY - cupH - 12, '가', { size: 28, color: C.blue })}${T(B.x, cupY - cupH - 12, '나', { size: 28, color: C.orange })}</g>`
      + `<g class="p3" ${delay(1.3)}>${T(570, 120, '들이', { size: 32, color: C.green })}${T(570, 160, '가 > 나', { size: 26, color: C.ink })}</g>`;
    put('3-2/수학/4/들이', svg(id, body, motion(id) + pourCss(id, 2, 'pa', 112, .2) + pourCss(id, 2, 'pb', 112, .2) + `
      .on3 .sc-${id} .tip { opacity: 0; transition: opacity .4s; }
      .on3 .sc-${id} .st { display: none; }
    `));
  })();

  // 비커(눈금 mL): 가운데 x, 바닥 y, 너비 w, 1000 mL 높이 h
  function beaker(x, y, w, h, wh, cls, labels = [200, 400, 600, 800, 1000]) {
    let s = `<rect class="${cls}" x="${x - w / 2 + 3}" y="${y - wh}" width="${w - 6}" height="${wh - 3}" fill="${C.sky}"/>`;
    for (let k = 1; k <= 10; k++) s += `<path d="M${x - w / 2} ${f(y - k * h / 10)} h${k % 2 ? 14 : 24}" stroke="${C.ink}" stroke-width="2"/>`;
    s += labels.map((v) => T(x + w / 2 + 8, f(y - v * h / 1000 + 7), v, { size: 18, weight: 600, anchor: 'start' })).join('');
    s += `<path d="M${x - w / 2} ${y - h - 16} V${y} H${x + w / 2} V${y - h - 16}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    s += T(x + w / 2 + 8, y - h - 26, '(mL)', { size: 18, anchor: 'start', color: C.muted });
    return s;
  }
  const carton = (x, y, w, h, name) => {
    const t = y - h / 2, b = y + h / 2;
    return `<g class="tip"><rect class="bw" x="${x - w / 2 + 4}" y="${t + 30}" width="${w - 8}" height="${h - 34}" fill="${C.sky}"/>`
      + `<path d="M${x - w / 2} ${b} V${t + 24} L${x - w / 2 + 10} ${t} H${x + w / 2 - 10} L${x + w / 2} ${t + 24} V${b} Z" fill="none" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round"/>`
      + `<path d="M${x - w / 2} ${t + 24} H${x + w / 2}" stroke="${C.blue}" stroke-width="2.5"/>` + T(x, y + 22, name, { size: 26, color: C.blue }) + '</g>';
  };

  // 리터: 1 L 우유갑 → 비커에 다 부으면 1000 mL 눈금까지 → 1 L = 1000 mL
  (function () {
    const id = 't32-m4-liter', bx = 400, by = 336, h = 230;
    const body = `<g class="pa">${beaker(bx, by, 120, h, h, 'cw')}${carton(bx - 150, 150, 92, 150, '1 L')}${stream(bx - 30, 168, by - 4)}</g>`
      + ring(bx + 70, by - h, 22, C.orange, 'r3', .3)
      + `<g class="s3" ${delay(.6)}>${T(150, 70, '1 L = 1000 mL', { size: 32, color: C.ink })}</g>`
      + `<g class="s3" ${delay(1.2)}>${T(150, 116, '리터', { size: 26, color: C.green })}</g>`;
    put('3-2/수학/4/리터', svg(id, body, motion(id) + pourCss(id, 2, 'pa', 116, .2) + `
      .on3 .sc-${id} .tip { opacity: 0; transition: opacity .4s; }
      .on3 .sc-${id} .st { display: none; }
    `));
  })();

  // 밀리리터: 스포이트로 물을 조금씩 넣어 약 컵 눈금이 1 mL → 5 mL 로 오른다(물방울 수와 mL 를 맞대지 않는다. 1 mL 는 스무 방울쯤) → 큰 비커 1000 mL 까지 → 1000 mL = 1 L
  (function () {
    const id = 't32-m4-ml', mx = 150, my = 300, mh = 120, bx = 440, by = 336, h = 230;
    // 약 컵: 0~10 mL, 높이 mh
    const medCup = `<rect class="mw" x="${mx - 37}" y="${my - mh / 2}" width="74" height="${mh / 2 - 3}" fill="${C.sky}"/>`
      + Array.from({ length: 10 }, (_, k) => `<path d="M${mx - 40} ${f(my - (k + 1) * mh / 10)} h${(k + 1) % 5 ? 10 : 20}" stroke="${C.ink}" stroke-width="2"/>`).join('')
      + T(mx + 50, my - mh / 2 + 7, 5, { size: 18, weight: 600, anchor: 'start' }) + T(mx + 50, my - mh + 7, 10, { size: 18, weight: 600, anchor: 'start' })
      + T(mx + 50, my - mh - 22, '(mL)', { size: 18, anchor: 'start', color: C.muted })
      + `<path d="M${mx - 40} ${my - mh - 12} V${my} H${mx + 40} V${my - mh - 12}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    const dropper = `<rect x="${mx - 9}" y="40" width="18" height="70" rx="4" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M${mx - 5} 110 L${mx} 128 L${mx + 5} 110" fill="none" stroke="${C.ink}" stroke-width="3"/><rect x="${mx - 14}" y="22" width="28" height="22" rx="10" fill="${C.red}"/>`;
    // 가는 물줄기: 스포이트 끝에서 약 컵 바닥까지(위에서부터 뻗어 내려간다)
    const flow = `<rect class="fl" x="${mx - 2}" y="130" width="4" height="${my - 133}" rx="2" fill="${C.blue}" opacity=".8"/>`;
    // 물이 1 mL 눈금을 지날 때마다 그 수가 뜬다(물 높이 1.7초 동안 0 → 5 mL, 0.34초에 1 mL)
    const counts = Array.from({ length: 5 }, (_, k) => `<g class="${k < 4 ? 'cn' : 'cnl'}" ${delay(.4 + (k + 1) * .34)}>${T(mx + 90, 96, `${k + 1} mL`, { size: 26, color: C.blue })}</g>`).join('');
    const body = dropper + flow + medCup + counts
      + `<g class="b2">${beaker(bx, by, 120, h, h, 'bwz')}</g>`
      + ring(bx + 76, by - h, 22, C.blue, 'r2', 1.9)
      + `<g class="s3" ${delay(.4)}>${T(330, 52, '1000 mL = 1 L', { size: 32, color: C.ink })}</g>`
      + `<g class="s3" ${delay(1)}>${T(mx, 346, '밀리리터', { size: 26, color: C.green })}</g>`;
    put('3-2/수학/4/밀리리터', svg(id, body, motion(id) + `
      .sc-${id} .fl { opacity: 0; transform-box: fill-box; transform-origin: center top; }
      .on1 .sc-${id} .fl { animation: ${id}-fl 1.9s linear .25s both; }
      @keyframes ${id}-fl { 0% { opacity: .8; transform: scaleY(0); } 8% { opacity: .8; transform: none; } 92% { opacity: .8; transform: none; } 100% { opacity: 0; transform: none; } }
      .sc-${id} .mw { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform 1.7s linear .4s; }
      .on1 .sc-${id} .mw { transform: none; }
      .sc-${id} .cn { opacity: 0; }
      .on1 .sc-${id} .cn { animation: ${id}-cn .34s linear both; }
      .sc-${id} .cnl { opacity: 0; }
      .on1 .sc-${id} .cnl { animation: ${id}-fin .2s linear both; }
      @keyframes ${id}-cn { 0%, 100% { opacity: 0; } 10%, 90% { opacity: 1; } }
      .on2 .sc-${id} :is(.cn, .cnl) { display: none; }
      .on3 .sc-${id} .mw { opacity: .35; }
      .sc-${id} .bwz { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform 1.6s ease-in-out .3s; }
      .on2 .sc-${id} .bwz { transform: none; }
    `));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
