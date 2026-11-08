// 수학 4-1 5단원 분수의 덧셈과 뺄셈: 낱말 도식
// 교과서를 따른다: 분모가 같은 분수끼리는 분모는 그대로 두고 분자끼리 더한다(단위분수가 몇 개인지 센다).
// 합이 가분수이면 대분수로 나타낼 수 있고, 대분수끼리는 자연수끼리, 분수끼리 더한다. 크기는 칸 띠로 보인다.
// 예는 교과서 것: 부침개 5조각 중 3조각, 거북 로봇 7분의 2 m + 7분의 4 m, 6분의 2 + 6분의 3, 색종이 2장과 3분의 2장,
// 케이크 4분의 2판 + 4분의 1판, 5분의 3 + 5분의 4, 정수기 1과 5분의 2컵 + 2와 5분의 1컵.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기, flN 깜빡이기, mvN 옮겨 가기(--dx, --dy)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .4s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} :is(.mv2,.mv3) { transition: transform 1s ease-in-out; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fl { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: .3; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .fl${n} { animation: ${id}-fl 1.4s ease-in-out both; }
    .on${n} .sc-${id} .mv${n} { transform: translate(var(--dx), var(--dy)); }`;
    return css;
  };

  // 세로 분수: 가운데 가로줄 높이 cy
  const fracW = (n, d, size) => Math.max(String(n).length, String(d).length) * size * 0.58 + 12;
  function frac(x, cy, n, d, { size = 32, color = C.ink, nc = color, dc = color } = {}) {
    const w = fracW(n, d, size);
    return `<text x="${f(x)}" y="${f(cy - size * 0.24)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${nc}">${n}</text>`
      + `<path d="M${f(x - w / 2)} ${f(cy)} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + `<text x="${f(x)}" y="${f(cy + size * 0.98)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${dc}">${d}</text>`;
  }
  const numY = (cy, fs) => cy - fs * .6, denY = (cy, fs) => cy + fs * .62;
  // 식 한 줄: 토막은 글자 또는 {fr:[n,d], nc, dc} 또는 {mx:[w,n,d], wc, color}. cy 는 분수 가로줄 높이.
  const charW = (ch) => /[0-9]/.test(ch) ? .58 : /[=+−<>]/.test(ch) ? .72 : .6;
  function expr(cx, cy, toks, size, fs = size * .8) {
    const items = toks.map((t) => (typeof t === 'object' ? t : { t: String(t) }));
    const wOf = (it) => it.fr ? fracW(...it.fr, fs) : it.mx ? String(it.mx[0]).length * size * .58 + 4 + fracW(it.mx[1], it.mx[2], fs) : [...it.t.replace(/&lt;/g, '<').replace(/&gt;/g, '>')].reduce((s, ch) => s + charW(ch) * size, 0);
    const ws = items.map(wOf), gap = size * .3;
    const total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = cx - total / 2;
    const xs = [], wx = [];
    const body = items.map((it, i) => {
      const c = x + ws[i] / 2; xs.push(c);
      let s;
      if (it.fr) s = frac(c, cy, ...it.fr, { size: fs, color: it.color || C.ink, nc: it.nc || it.color || C.ink, dc: it.dc || it.color || C.ink });
      else if (it.mx) {
        const ww = String(it.mx[0]).length * size * .58;
        wx.push(x + ww / 2);
        s = text(f(x + ww / 2), f(cy + size * .36), it.mx[0], { size, color: it.wc || it.color || C.ink }) + frac(x + ww + 4 + fracW(it.mx[1], it.mx[2], fs) / 2, cy, it.mx[1], it.mx[2], { size: fs, color: it.color || C.ink });
      } else s = text(f(c), f(cy + size * .36), it.t, { size, color: it.color || C.ink });
      x += ws[i] + gap;
      return it.cls ? `<g class="${it.cls}" ${delay(it.d || 0)}>${s}</g>` : s;
    }).join('');
    return { body, xs, ws, wx };
  }
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 22, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color = C.green, fill = C.mint, size = 24) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 21)}" width="${w}" height="42" rx="21" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(cx), f(cy + size * .36), s, { size, color })}`;
  const box = (x, y, w, h, fill, extra = '') => `<rect ${extra} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"/>`;
  // 칸 띠: 칸 선과 테두리(바탕은 따로)
  const bar = (x, y, w, h, n, edge = C.ink) => {
    let d = '';
    for (let k = 1; k < n; k++) d += `M${f(x + k * w / n)} ${y}V${y + h}`;
    return (d ? `<path d="${d}" stroke="${C.ink}" stroke-width="2.5"/>` : '') + `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="${h}" fill="none" stroke="${edge}" stroke-width="3"/>`;
  };
  const oneMark = (x, y1, y2, label = '1') => `<path d="M${x} ${y1}V${y2}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="7 6"/>` + text(x, y2 + 26, label, { size: 24, color: C.blue });
  // 아래 묶음 표시와 이름
  const brace = (x1, x2, y, s, color, cls, d = 0, up = false) => `<g class="${cls}" ${delay(d)}><path d="M${f(x1)} ${y + (up ? 8 : -8)}V${y}H${f(x2)}V${y + (up ? 8 : -8)}M${f((x1 + x2) / 2)} ${y}V${y + (up ? -7 : 7)}" fill="none" stroke="${color}" stroke-width="3"/>${text(f((x1 + x2) / 2), up ? y - 14 : y + 30, s, { size: 22, color })}</g>`;

  // 분수: 부침개 한 장을 똑같이 5조각 → 3조각을 먹음 → 5분의 3
  (function () {
    const id = 't41-m5-bunsu', X = 60, Y = 130, W = 400, H = 72, cw = W / 5;
    const cuts = [1, 2, 3, 4].map((k) => `<path class="draw d1" pathLength="1" ${delay(.3 + k * .25)} d="M${X + k * cw} ${Y}V${Y + H}" stroke="${C.ink}" stroke-width="3"/>`).join('');
    const fills = [0, 1, 2].map((k) => box(X + k * cw, Y, cw, H, C.peach, `class="s2" ${delay(.2 + k * .35)}`)).join('');
    const nums = [0, 1, 2].map((k) => `<g class="p2" ${delay(.35 + k * .35)}>${text(X + (k + .5) * cw, Y + H / 2 + 10, k + 1, { size: 28, color: C.orange })}</g>`).join('');
    const body = box(X, Y, W, H, '#fff4d6') + fills + cuts + `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3.5"/>` + nums
      + text(X - 12, Y + H / 2 + 8, '1장', { size: 22, color: C.muted, anchor: 'end' })
      + brace(X, X + W, Y + H + 18, '5조각', C.blue, 's1', 1.4)
      + brace(X, X + 3 * cw, Y - 16, '3조각', C.orange, 's2', 1.3, true)
      + `<g class="s3" ${delay(.2)}>${frac(565, 150, 3, 5, { size: 60, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s3" ${delay(.8)}>${text(565, 262, '5분의 3', { size: 26 })}</g>`
      + ring(565, numY(150, 60), 30, C.orange, 'r3', 1) + ring(565, denY(150, 60), 30, C.blue, 'r3', 1.3)
      + `<g class="p3" ${delay(1.5)}>${pill(565, 316, 90, '분수')}</g>`;
    put('4-1/수학/5/분수', svg(id, body, motion(id)));
  })();

  // 분모: 7칸 띠에 7분의 2 → 7분의 4 칸이 옮겨 와 이어짐 → 칸 크기가 같아 7은 그대로, 7분의 6 → 이름
  (function () {
    const id = 't41-m5-bunmo', X = 40, W = 420, cw = W / 7, H = 58, yA = 70, yB = 170;
    const A = [0, 1].map((k) => box(X + k * cw, yA, cw, H, C.mint)).join('');
    const B = [0, 1, 2, 3].map((k) => `<g class="mv2" ${delay(.9 + k * .12, `--dx:${2 * cw}px;--dy:${yA - yB}px`)}>${box(X + k * cw, yB, cw, H, C.peach)}<rect x="${f(X + k * cw)}" y="${yB}" width="${f(cw)}" height="${H}" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`).join('');
    const E = expr(260, 286, [{ fr: [2, 7], nc: C.green, dc: C.blue }, '+', { fr: [4, 7], nc: C.orange, dc: C.blue }, '=', { fr: [6, 7], dc: C.blue }], 38, 32);
    const body = box(X, yA, W, H, 'white') + A + bar(X, yA, W, H, 7)
      + `<g class="h3"><g class="s2">${box(X, yB, W, H, 'white')}${bar(X, yB, W, H, 7)}</g></g>`
      + `<g class="s2">${B}</g>`
      + brace(X, X + W, yA - 12, '7칸', C.blue, 's1', .5, true)
      + `<g class="h3">${frac(540, yA + 22, 2, 7, { size: 34, nc: C.green, dc: C.blue })}</g>` + ring(540, denY(yA + 22, 34), 24, C.blue, 'r1', .9)
      + `<g class="h3"><g class="s2" ${delay(.2)}>${frac(540, yB + 22, 4, 7, { size: 34, nc: C.orange, dc: C.blue })}</g></g>`
      + `<g class="s3">${frac(540, yA + 22, 6, 7, { size: 34, dc: C.blue })}</g>`
      + `<g class="s3" ${delay(.3)}>${E.body}</g>`
      + [0, 2, 4].map((i, j) => ring(E.xs[i], denY(286, 32), 22, C.blue, 'r3', 1 + j * .25)).join('')
      + `<g class="p4" ${delay(.4)}>${pill(560, 300, 90, '분모')}</g>`
      + `<g class="k4" ${delay(.2)}><rect x="${f(E.xs[4] - 18)}" y="${f(denY(286, 32) - 22)}" width="36" height="44" rx="8" fill="none" stroke="${C.blue}" stroke-width="3.5"/></g>`;
    put('4-1/수학/5/분모', svg(id, body, motion(id)));
  })();

  // 분자: 6분의 2 는 6분의 1 이 2개 → 6분의 3 은 3개 → 모두 5개라 6분의 5 → 이름
  (function () {
    const id = 't41-m5-bunja', X = 60, W = 420, cw = W / 6, Y = 122, H = 66;
    const cell = (k, fill, cls, d) => box(X + k * cw, Y, cw, H, fill, `class="${cls}" ${delay(d)}`);
    const num = (k, n, color, cls, d) => `<g class="${cls}" ${delay(d)}>${text(X + (k + .5) * cw, Y + H / 2 + 10, n, { size: 26, color })}</g>`;
    const E = expr(290, 286, [{ fr: [2, 6], nc: C.green }, '+', { fr: [3, 6], nc: C.orange }, '=', { fr: [5, 6], nc: C.purple }], 38, 32);
    const body = box(X, Y, W, H, 'white')
      + cell(0, C.mint, 's1', .2) + cell(1, C.mint, 's1', .5)
      + [2, 3, 4].map((k, i) => cell(k, C.peach, 's2', .2 + i * .3)).join('')
      + bar(X, Y, W, H, 6)
      + `<g class="h3">${num(0, 1, C.green, 'p1', .3)}${num(1, 2, C.green, 'p1', .6)}${[2, 3, 4].map((k, i) => num(k, i + 1, C.orange, 'p2', .3 + i * .3)).join('')}</g>`
      + [0, 1, 2, 3, 4].map((k) => num(k, k + 1, C.purple, 'p3', .2 + k * .2)).join('')
      + `<g class="s1" ${delay(.8)}>${frac(X + cw, 76, 2, 6, { size: 28, nc: C.green })}</g>`
      + `<g class="s2" ${delay(1)}>${frac(X + 3.5 * cw, 76, 3, 6, { size: 28, nc: C.orange })}</g>`
      + `<g class="s1" ${delay(1.1)}>${text(X + W + 16, Y + H / 2 + 8, '6칸', { size: 22, color: C.muted, anchor: 'start' })}</g>`
      + `<g class="s3" ${delay(1.2)}>${E.body}</g>`
      + [0, 2, 4].map((i, j) => ring(E.xs[i], numY(286, 32), 22, [C.green, C.orange, C.purple][j], 'r3', 1.5 + j * .2)).join('')
      + `<g class="p4" ${delay(.4)}>${pill(560, 300, 90, '분자', C.purple, C.lilac)}</g>`
      + `<g class="k4" ${delay(.2)}><rect x="${f(E.xs[4] - 18)}" y="${f(numY(286, 32) - 22)}" width="36" height="44" rx="8" fill="none" stroke="${C.purple}" stroke-width="3.5"/></g>`;
    put('4-1/수학/5/분자', svg(id, body, motion(id)));
  })();

  // 자연수: 빨간 색종이 1장, 2장을 셈 → 초록 색종이 3분의 2장 → 2 + 3분의 2 = 2와 3분의 2 → 셀 때 쓰는 수 2
  (function () {
    const id = 't41-m5-jayeonsu', U = 130, Y = 90, H = 90, xs = [40, 190, 340];
    const sheet = (x) => `<rect x="${x}" y="${Y}" width="${U}" height="${H}" rx="4" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`;
    const part = box(xs[2], Y, U, H, 'white') + box(xs[2], Y, U * 2 / 3, H, C.mint) + bar(xs[2], Y, U, H, 3, C.green);
    const E = expr(300, 268, [{ t: '2', color: C.red }, '+', { fr: [2, 3], color: C.green }, '=', { mx: [2, 2, 3], wc: C.red, color: C.green }], 42, 34);
    const body = `<g class="p1" ${delay(.2)}>${sheet(xs[0])}</g><g class="p1" ${delay(.9)}>${sheet(xs[1])}</g>`
      + tag(xs[0] + U / 2, Y - 16, '1', C.red, 'p1', .5, 30) + tag(xs[1] + U / 2, Y - 16, '2', C.red, 'p1', 1.2, 30)
      + `<g class="p2" ${delay(.2)}>${part}</g>`
      + `<g class="s2" ${delay(.8)}>${frac(xs[2] + U / 2, Y - 34, 2, 3, { size: 26, color: C.green })}</g>`
      + `<g class="s3" ${delay(.2)}>${E.body}</g>`
      + ring(E.xs[0], 268, 30, C.red, 'r3', 1) + ring(E.wx[0], 268, 30, C.red, 'r3', 1.2)
      + `<g class="k4" ${delay(.1)}><rect x="${xs[0] - 6}" y="${Y - 6}" width="${xs[1] + U - xs[0] + 12}" height="${H + 12}" rx="10" fill="none" stroke="${C.red}" stroke-width="4"/></g>`
      + `<g class="p4" ${delay(.8)}>${pill(560, 135, 110, '자연수', C.red, C.peach)}</g>`;
    put('4-1/수학/5/자연수', svg(id, body, motion(id)));
  })();

  // 진분수: 케이크 4분의 2판 + 4분의 1판 → 4분의 3판, 1판에 1칸 모자람 → 분자 3 < 분모 4 → 이름
  (function () {
    const id = 't41-m5-jin', X = 60, W = 400, cw = W / 4, Y = 110, H = 70;
    const E = expr(280, 268, [{ fr: [2, 4], color: C.green }, '+', { fr: [1, 4], color: C.orange }, '=', { fr: [3, 4] }, ' &lt; ', { t: '1', color: C.blue }], 36, 30);
    const body = box(X, Y, W, H, 'white') + box(X, Y, cw, H, C.mint, `class="s1" ${delay(.2)}`) + box(X + cw, Y, cw, H, C.mint, `class="s1" ${delay(.5)}`) + box(X + 2 * cw, Y, cw, H, C.peach, `class="s1" ${delay(1.1)}`)
      + bar(X, Y, W, H, 4)
      + `<g class="s1" ${delay(.7)}>${frac(X + cw, Y - 42, 2, 4, { size: 28, color: C.green })}</g><g class="s1" ${delay(1.3)}>${frac(X + 2.5 * cw, Y - 42, 1, 4, { size: 28, color: C.orange })}</g>`
      + `<g class="s2">${oneMark(X + W, Y - 18, Y + H + 14)}</g>`
      + `<g class="k2" ${delay(.4)}><rect x="${X + 3 * cw + 5}" y="${Y + 5}" width="${cw - 10}" height="${H - 10}" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="8 5"/></g>`
      + `<g class="s2" ${delay(.9)}>${E.body}</g>`
      + `<g class="s3" ${delay(.2)}><text x="560" y="160" text-anchor="middle" font-size="36" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">3</tspan> &lt; <tspan fill="${C.blue}">4</tspan></text></g>`
      + [0, 2, 4].map((i, j) => ring(E.xs[i], 268, 30, C.green, 'r3', .6 + j * .25)).join('')
      + `<g class="p3" ${delay(1.4)}>${pill(560, 82, 110, '진분수')}</g>`;
    put('4-1/수학/5/진분수', svg(id, body, motion(id)));
  })();

  // 가분수: 5분의 3 + 5분의 4 → 옮겨 담으면 첫 띠가 꽉 차 5분의 5(=1), 2칸 넘침 → 5분의 7 → 분자 ≥ 분모
  (function () {
    const id = 't41-m5-ga', cw = 56, H = 60, xA = 30, xB = 330, Y = 92, yB = 200;
    const cellX = (k) => (k < 5 ? xA + k * cw : xB + (k - 5) * cw);
    const moving = [0, 1, 2, 3].map((k) => `<g class="mv2" ${delay(.3 + k * .15, `--dx:${cellX(3 + k) - (xA + k * cw)}px;--dy:${Y - yB}px`)}>${box(xA + k * cw, yB, cw, H, C.sky)}<rect x="${xA + k * cw}" y="${yB}" width="${cw}" height="${H}" fill="none" stroke="${C.blue}" stroke-width="3"/></g>`).join('');
    const E = expr(300, 282, [{ fr: [3, 5], color: C.orange }, '+', { fr: [4, 5], color: C.blue }, '=', { fr: [7, 5] }], 38, 32);
    const body = box(xA, Y, 5 * cw, H, 'white') + [0, 1, 2].map((k) => box(xA + k * cw, Y, cw, H, C.peach, `class="s1" ${delay(.2 + k * .2)}`)).join('') + bar(xA, Y, 5 * cw, H, 5)
      + `<g class="s2">${box(xB, Y, 5 * cw, H, 'white')}${bar(xB, Y, 5 * cw, H, 5)}</g>`
      + `<g class="gone"><g class="s1" ${delay(.8)}>${box(xA, yB, 5 * cw, H, 'white')}${bar(xA, yB, 5 * cw, H, 5)}</g></g>`
      + `<g class="s1" ${delay(.9)}>${moving}</g>`
      + `<g class="h2"><g class="s1" ${delay(.6)}>${frac(xA + 1.5 * cw, Y - 32, 3, 5, { size: 26, color: C.orange })}</g><g class="s1" ${delay(1.2)}>${frac(xA + 5 * cw + 46, yB + 22, 4, 5, { size: 28, color: C.blue })}</g></g>`
      + `<g class="s2" ${delay(1.1)}>${oneMark(xA + 5 * cw, Y - 14, Y + H + 10)}</g>`
      + `<g class="s2" ${delay(1.4)}>${frac(xA + 2.5 * cw, Y - 32, 5, 5, { size: 26 })}${frac(xB + cw, Y - 32, 2, 5, { size: 26, color: C.blue })}</g>`
      + `<g class="h3"><g class="s2" ${delay(1.6)}>${E.body}</g></g>`
      + `<g class="s3" ${delay(.2)}>${frac(110, 262, 5, 5, { size: 40, nc: C.orange, dc: C.blue })}<text x="196" y="276" text-anchor="middle" font-size="30" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">5</tspan> = <tspan fill="${C.blue}">5</tspan></text></g>`
      + `<g class="s3" ${delay(.6)}>${frac(330, 262, 7, 5, { size: 40, nc: C.orange, dc: C.blue })}<text x="416" y="276" text-anchor="middle" font-size="30" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">7</tspan> &gt; <tspan fill="${C.blue}">5</tspan></text></g>`
      + `<g class="p3" ${delay(1.2)}>${pill(556, 268, 110, '가분수')}</g>`;
    put('4-1/수학/5/가분수', svg(id, body, motion(id) + `
      .sc-${id} .gone { transition: opacity .4s ease 1.3s; }
      .on2 .sc-${id} .gone { opacity: 0; }`));
  })();

  // 대분수: 1과 5분의 2컵(자연수 1 + 진분수 5분의 2) → 2와 5분의 1컵 → 자연수끼리, 분수끼리 더해 3과 5분의 3컵 → 이름
  (function () {
    const id = 't41-m5-dae', X = 30, u = 110, g = 10, H = 46, yA = 40, yB = 124;
    const whole = (x, y) => `${box(x, y, u, H, C.mint)}<rect x="${x}" y="${y}" width="${u}" height="${H}" fill="none" stroke="${C.green}" stroke-width="3.5"/>`;
    const part = (x, y, k) => box(x, y, u, H, 'white') + box(x, y, u * k / 5, H, C.peach) + bar(x, y, u, H, 5);
    const rowA = whole(X, yA) + part(X + u + g, yA, 2);
    const rowB = whole(X, yB) + whole(X + u + g, yB) + part(X + 2 * (u + g), yB, 1);
    const MA = expr(500, yA + 22, [{ mx: [1, 2, 5], wc: C.green, color: C.orange }], 40, 30);
    const MB = expr(500, yB + 22, [{ mx: [2, 1, 5], wc: C.green, color: C.orange }], 40, 30);
    const E = expr(300, 286, [{ mx: [1, 2, 5], wc: C.green, color: C.orange }, '+', { mx: [2, 1, 5], wc: C.green, color: C.orange }, '=', { mx: [3, 3, 5], wc: C.green, color: C.orange }], 40, 30);
    const NW = expr(150, 212, [{ t: '1', color: C.green }, { t: '+', color: C.green }, { t: '2', color: C.green }, { t: '=', color: C.green }, { t: '3', color: C.green }], 28, 22);
    const NF = expr(410, 212, [{ fr: [2, 5], color: C.orange }, { t: '+', color: C.orange }, { fr: [1, 5], color: C.orange }, { t: '=', color: C.orange }, { fr: [3, 5], color: C.orange }], 28, 22);
    const hi = (x, y, w, c) => `<rect x="${f(x - 4)}" y="${y - 4}" width="${f(w + 8)}" height="${H + 8}" rx="6" fill="none" stroke="${c}" stroke-width="4"/>`;
    const body = `<g class="p1" ${delay(.1)}>${rowA}</g><g class="p2" ${delay(.1)}>${rowB}</g>`
      + `<g class="s1" ${delay(.7)}>${MA.body}${text(575, yA + 34, '컵', { size: 22, color: C.muted })}</g><g class="s2" ${delay(.7)}>${MB.body}${text(575, yB + 34, '컵', { size: 22, color: C.muted })}</g>`
      + tag(X + u / 2, yA + H + 26, '자연수', C.green, 's1', 1.1, 19) + tag(X + 1.5 * u + g, yA + H + 26, '진분수', C.orange, 's1', 1.3, 19)
      + `<g class="k3" ${delay(.1)}>${hi(X, yA, u, C.green)}${hi(X, yB, 2 * u + g, C.green)}</g>`
      + `<g class="k3" ${delay(.9)}>${hi(X + u + g, yA, u * 2 / 5, C.orange)}${hi(X + 2 * (u + g), yB, u / 5, C.orange)}</g>`
      + `<g class="h4"><g class="s3" ${delay(.3)}>${NW.body}</g><g class="s3" ${delay(1)}>${NF.body}</g></g>`
      + `<g class="s3" ${delay(1.4)}>${E.body}${text(f(E.xs[4] + 62), 300, '컵', { size: 22, color: C.muted })}</g>`
      + ring(E.xs[4], 282, 34, C.green, 'r3', 1.8)
      + `<g class="k4" ${delay(.2)}><rect x="${f(E.xs[4] - E.ws[4] / 2 - 8)}" y="246" width="${f(E.ws[4] + 16)}" height="76" rx="12" fill="none" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="p4" ${delay(.8)}>${pill(540, 212, 110, '대분수')}</g>`;
    put('4-1/수학/5/대분수', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
