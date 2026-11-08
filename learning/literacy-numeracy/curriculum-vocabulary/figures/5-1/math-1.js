// 수학 5-1 1단원 자연수의 혼합 계산: 낱말 도식
// 교과서 순서를 따른다: ( ) 안을 가장 먼저, 다음에 곱셈과 나눗셈, 마지막에 덧셈과 뺄셈을 앞에서부터 차례대로.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const numberLine = (...a) => { const r = root.FigureKit.numberLine(...a); r.body = r.body.replace(/font-size="17"/g, 'font-size="19"'); return r; };
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기, fN 날아오기, oN 사라지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} :is(.h2,.h3,.h4) { transition: opacity .3s ease; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 25% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .o${n} { animation: ${id}-out .3s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .9s ease-in-out both; }`;
    return css;
  };

  const charW = (ch) => /[0-9]/.test(ch) ? .58 : ch === '…' ? 1 : /[÷=×<>+−]/.test(ch) ? .72 : .6;
  // 식 한 줄(가운데 맞춤): 토막은 글자 또는 {t, color, cls, d}. 돌려주는 xs·ws 로 고리 자리를 잡는다.
  function expr(cx, cy, toks, size) {
    const items = toks.map((t) => (typeof t === 'object' ? t : { t: String(t) }));
    const ws = items.map((it) => [...it.t].reduce((s, ch) => s + charW(ch) * size, 0)), gap = size * .32;
    const total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = cx - total / 2;
    const xs = [];
    const body = items.map((it, i) => {
      const c = x + ws[i] / 2; xs.push(c);
      const s = text(f(c), f(cy + size * .36), it.t, { size, color: it.color || C.ink });
      x += ws[i] + gap;
      return it.cls ? `<g class="${it.cls}" ${delay(it.d || 0)}>${s}</g>` : s;
    }).join('');
    return { body, xs, ws, total };
  }
  // 왼쪽 맞춤 식: x 에서 시작
  const exprL = (x, cy, toks, size) => expr(x + expr(0, cy, toks, size).total / 2, cy, toks, size);
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 22) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 20)}" width="${w}" height="40" rx="20" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(cx), f(cy + size * .36), s, { size, color })}`;

  // 자연수: 딸기를 하나씩 세면 1, 2, 3, 4, 5 → 수직선에서 1씩 커지며 이어짐 → 37 + 22 − 16 의 수는 모두 자연수
  (function () {
    const id = 't51-m1-jayeonsu', y = 118;
    const xs = [90, 180, 270, 360, 450];
    const berry = (x) => `<path d="M${x} ${y + 30} C${x - 36} ${y + 4} ${x - 30} ${y - 26} ${x} ${y - 18} C${x + 30} ${y - 26} ${x + 36} ${y + 4} ${x} ${y + 30} Z" fill="${C.red}" stroke="#9b2c20" stroke-width="2.5"/>`
      + `<path d="M${x - 14} ${y - 22} L${x} ${y - 14} L${x + 14} ${y - 22} L${x + 6} ${y - 28} L${x} ${y - 22} L${x - 6} ${y - 28} Z" fill="${C.green}"/>`
      + [[-10, -4], [8, -6], [-2, 8], [12, 10], [-14, 12]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="2.2" fill="${C.yellow}"/>`).join('');
    const berries = xs.map((x, i) => `<g class="p1" ${delay(.2 + i * .3)}>${berry(x)}</g>` + tag(x, y - 46, i + 1, C.orange, 'p1', .35 + i * .3, 28)).join('');
    const nl = numberLine(0, 10, { y: 262, x0: 50, x1: 550 });
    const dots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n, i) => `<g class="p2" ${delay(.2 + i * .13)}><circle cx="${f(nl.at(n))}" cy="262" r="9" fill="${C.orange}" stroke="white" stroke-width="2"/></g>`).join('');
    const E = expr(320, 104, [{ t: '37', color: C.orange }, '+', { t: '22', color: C.orange }, '−', { t: '16', color: C.orange }], 50);
    const body = `<g class="h3">${berries}</g>`
      + `<g class="s2" ${delay(.1)}>${nl.body}</g>` + dots
      + `<g class="s2" ${delay(1.5)}>${text(604, 270, '…', { size: 30, color: C.orange })}</g>`
      + `<g class="k3">${dots.replace(/class="p2"/g, '')}</g>`
      + `<g class="s3" ${delay(.3)}>${E.body}</g>`
      + [0, 2, 4].map((i) => ring(E.xs[i], 104, 32, C.orange, 'r3', .8 + i * .15)).join('')
      + `<g class="p3" ${delay(1.3)}>${pill(320, 178, 120, '자연수', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/1/자연수', svg(id, body, motion(id)));
  })();

  // 식: 버스에 24명 → 6명 내리고 7명 탐(25명) → 24 − 6 + 7 = 25 로 한 줄에 적은 것이 식
  (function () {
    const id = 't51-m1-sik', door = [424, 150];
    const person = (x, y, fill) => `<circle cx="${x}" cy="${y - 30}" r="9" fill="${fill}"/><rect x="${x - 9}" y="${y - 19}" width="18" height="24" rx="7" fill="${fill}"/>`;
    const bus = `<rect x="140" y="46" width="320" height="136" rx="22" fill="${C.sky}" stroke="${C.blue}" stroke-width="4"/>`
      + [0, 1, 2, 3].map((k) => `<rect x="${158 + k * 58}" y="64" width="46" height="42" rx="6" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`).join('')
      + `<rect x="402" y="64" width="44" height="112" rx="6" fill="white" stroke="${C.blue}" stroke-width="2.5"/><path d="M424 64 V176" stroke="${C.blue}" stroke-width="2"/>`
      + [200, 400].map((x) => `<circle cx="${x}" cy="184" r="20" fill="${C.ink}"/><circle cx="${x}" cy="184" r="7" fill="${C.line}"/>`).join('');
    const offX = [44, 72, 100, 128, 156, 184];
    const off = offX.map((x, i) => `<g class="out" ${delay(.2 + i * .12, `--dx:${door[0] - x}px;--dy:${door[1] + 10 - 262}px`)}>${person(x, 262, C.purple)}</g>`).join('');
    const onX = [452, 480, 508, 536, 564, 592, 620];
    const on = onX.map((x, i) => `<g class="in" style="--w:${f(.7 + i * .06)}s;--dx:${door[0] - x}px;--dy:${door[1] + 10 - 262}px">${person(x, 262, C.green)}</g>`).join('');
    const E = expr(370, 318, [{ t: '24', color: C.blue }, { t: '−', color: C.purple }, { t: '6', color: C.purple }, { t: '+', color: C.green }, { t: '7', color: C.green }, '=', '25'], 42);
    const body = bus
      + `<g class="o2" ${delay(1.4)}>${text(272, 160, '24명', { size: 36, color: C.blue })}</g>`
      + `<g class="s2" ${delay(1.5)}>${text(272, 160, '25명', { size: 36, color: C.blue })}</g>`
      + `<g class="s2">${off}</g>`
      + `<g class="s2" ${delay(.2)}>${on}</g>`
      + tag(114, 218, '−6', C.purple, 's2', .9, 30)
      + tag(536, 218, '+7', C.green, 's2', .6, 30)
      + `<g class="s2" ${delay(.6)}>${arrow(520, 200, 462, 170, C.green)}</g>`
      + `<g class="s2" ${delay(.9)}>${arrow(392, 226, 208, 244, C.purple)}</g>`
      + `<g class="s3" ${delay(.2)}>${E.body}</g>`
      + ring(E.xs[6], 318, 30, C.ink, 'r3', 1.2)
      + `<g class="p3" ${delay(1.3)}>${pill(70, 318, 76, '식', C.orange, C.peach, 26)}</g>`;
    put('5-1/수학/1/식', svg(id, body, motion(id) + `
      .sc-${id} .out { transform: translate(var(--dx), var(--dy)); opacity: 0; }
      .on2 .sc-${id} .out { transform: none; opacity: 1; transition: transform .9s ease-in-out, opacity .2s ease; }
      .on2 .sc-${id} .in { transform: translate(var(--dx), var(--dy)); opacity: 0; transition: transform .7s ease-in-out var(--w), opacity .25s ease calc(var(--w) + .55s); }`));
  })();

  // 혼합 계산: 17 − 42 ÷ (2 × 3) + 5 → 순서 ①( ) ②÷ ③− ④+ → 6, 7, 10 을 거쳐 15
  (function () {
    const id = 't51-m1-honhap', size = 32, X = 92, cy0 = 92, step = 55;
    const P = C.purple, B = C.blue, O = C.orange;
    const toks = ['17', { t: '−', color: O }, '42', { t: '÷', color: B }, { t: '(', color: P }, '2', { t: '×', color: B }, '3', { t: ')', color: P }, { t: '+', color: O }, '5'];
    const R1 = exprL(X, cy0, toks, size);
    // 4가지 셈 기호가 튀어나옴
    const opIdx = [1, 3, 6, 9];
    const ops = opIdx.map((i, k) => ring(R1.xs[i], cy0, 20, toks[i].color, 'r1', .4 + k * .2)).join('');
    const paren = `<g class="s1" ${delay(1.2)}><rect x="${f(R1.xs[4] - 12)}" y="${cy0 - 24}" width="${f(R1.xs[8] - R1.xs[4] + 24)}" height="48" rx="10" fill="${C.lilac}"/></g>`;
    // 계산 순서 ①~④
    const order = [[6, P], [3, B], [1, O], [9, O]].map(([i, c], k) => `<g class="p2" ${delay(.4 + k * .35)}><circle cx="${f(R1.xs[i])}" cy="38" r="17" fill="${c}"/>${text(f(R1.xs[i]), 45, k + 1, { size: 20, color: 'white' })}</g>`).join('');
    const rows = [
      ['=', '17', { t: '−', color: O }, '42', { t: '÷', color: B }, { t: '6', color: P }, { t: '+', color: O }, '5'],
      ['=', '17', { t: '−', color: O }, { t: '7', color: B }, { t: '+', color: O }, '5'],
      ['=', { t: '10', color: O }, { t: '+', color: O }, '5'],
      ['=', { t: '15', color: C.green }]
    ].map((r, k) => exprL(X - 34, cy0 + (k + 1) * step, r, size));
    const rowsBody = rows.map((r, k) => `<g class="s3" ${delay(.2 + k * .45)}>${r.body}</g>`).join('');
    const legend = [['( ) 안', P, C.lilac], ['× ÷', B, C.sky], ['+ −', O, C.peach]].map(([s, c, fl], k) =>
      `<g class="s2" ${delay(.3 + k * .4)}>${pill(540, 70 + k * 74, 132, s, c, fl, 24)}</g>`
      + (k < 2 ? `<g class="s2" ${delay(.5 + k * .4)}><path d="M540 ${94 + k * 74} V${118 + k * 74} M532 ${110 + k * 74} L540 ${118 + k * 74} L548 ${110 + k * 74}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>` : '')).join('');
    const last = rows[3];
    const body = paren + R1.body + ops + order + legend + rowsBody
      + ring(last.xs[1], cy0 + 4 * step, 30, C.green, 'r3', 1.8)
      + `<g class="k4" ${delay(.2)}><rect x="${f(X - 14)}" y="${cy0 - 30}" width="${f(R1.total + 28)}" height="60" rx="14" fill="none" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="p4" ${delay(.8)}>${pill(540, 300, 150, '혼합 계산', C.green, C.mint, 24)}</g>`;
    put('5-1/수학/1/혼합 계산', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
