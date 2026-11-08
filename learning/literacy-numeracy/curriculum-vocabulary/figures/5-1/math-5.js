// 수학 5-1 5단원 분수의 덧셈과 뺄셈: 낱말 도식
// 교과서를 따른다: 분모가 다른 분수는 통분하여 더하고 빼며, 합이 가분수이면 대분수로 나타내고,
// 대분수끼리는 자연수 부분끼리, 분수 부분끼리 계산한다. 분수 띠로 크기를 보인다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, oN 사라지기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} :is(.h2,.h3,.h4) { transition: opacity .4s ease; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .o${n} { animation: ${id}-out .3s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }`;
    return css;
  };

  // 세로 분수: 가운데 가로줄의 높이가 cy
  function frac(x, cy, n, d, { size = 32, color = C.ink, nc = color, dc = color } = {}) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.58 + 12;
    return `<text x="${f(x)}" y="${f(cy - size * 0.24)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${nc}">${n}</text>`
      + `<path d="M${f(x - w / 2)} ${f(cy)} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + `<text x="${f(x)}" y="${f(cy + size * 0.98)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${dc}">${d}</text>`;
  }
  const fracW = (n, d, size) => Math.max(String(n).length, String(d).length) * size * 0.58 + 12;
  const numMid = (cy, size) => cy - size * 0.6;
  // 식 한 줄: 토막은 글자, 분수 {fr:[n,d]}, 대분수 {mx:[w,n,d]}(wc 자연수 색, color 분수 색). cy 는 분수 가로줄 높이.
  const charW = (ch) => /[0-9]/.test(ch) ? .58 : /[÷=×<>+−]/.test(ch) ? .72 : .6;
  function expr(cx, cy, toks, size, fs = size * .8) {
    const items = toks.map((t) => (typeof t === 'object' ? t : { t: String(t) }));
    const wOf = (it) => it.fr ? fracW(...it.fr, fs) : it.mx ? String(it.mx[0]).length * size * .58 + 4 + fracW(it.mx[1], it.mx[2], fs) : [...it.t].reduce((s, ch) => s + charW(ch) * size, 0);
    const ws = items.map(wOf), gap = size * .3;
    const total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = cx - total / 2;
    const xs = [];
    const body = items.map((it, i) => {
      const c = x + ws[i] / 2; xs.push(c);
      let s;
      if (it.fr) s = frac(c, cy, ...it.fr, { size: fs, color: it.color || C.ink });
      else if (it.mx) {
        const ww = String(it.mx[0]).length * size * .58;
        s = text(f(x + ww / 2), f(cy + size * .36), it.mx[0], { size, color: it.wc || it.color || C.ink }) + frac(x + ww + 4 + fracW(it.mx[1], it.mx[2], fs) / 2, cy, it.mx[1], it.mx[2], { size: fs, color: it.color || C.ink });
      } else s = text(f(c), f(cy + size * .36), it.t, { size, color: it.color || C.ink });
      x += ws[i] + gap;
      return it.cls ? `<g class="${it.cls}" ${delay(it.d || 0)}>${s}</g>` : s;
    }).join('');
    return { body, xs, ws, total };
  }
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 22) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 20)}" width="${w}" height="40" rx="20" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(cx), f(cy + size * .36), s, { size, color })}`;
  const box = (x, y, w, h, fill, extra = '') => `<rect ${extra} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"/>`;
  // 칸 띠: 바탕(흰), 칸 선, 테두리
  const bar = (x, y, w, h, n, { sw = 2.5, edge = C.ink } = {}) => {
    let s = '';
    for (let k = 1; k < n; k++) s += `<path d="M${f(x + k * w / n)} ${y} V${y + h}" stroke="${C.ink}" stroke-width="${sw}"/>`;
    return s + `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="${h}" fill="none" stroke="${edge}" stroke-width="3"/>`;
  };
  const oneMark = (x, y1, y2, label = '1') => `<path d="M${x} ${y1} V${y2}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="7 6"/>` + text(x, y2 + 26, label, { size: 24, color: C.blue });

  // 진분수: 4칸 띠에 1칸, 2칸, 3칸 → 칠한 곳은 1까지 가지 못함(4분의 3 < 1) → 분자 3 < 분모 4
  (function () {
    const id = 't51-m5-jin', X = 50, Y = 120, W = 360, H = 66, cw = W / 4;
    const fills = [0, 1, 2].map((k) => box(X + k * cw, Y, cw, H, C.peach, `class="s1" ${delay(.2 + k * .5)}`)).join('');
    const labels = [1, 2, 3].map((k) => `<g class="p1" ${delay(.4 + (k - 1) * .5)}>${frac(X + k * cw, 74, k, 4, { size: 26, nc: C.orange, dc: C.blue })}</g>`).join('');
    const body = box(X, Y, W, H, 'white') + fills + bar(X, Y, W, H, 4) + labels
      + `<g class="s2">${oneMark(X + W, Y - 18, Y + H + 18)}</g>`
      + `<g class="k2" ${delay(.4)}><rect x="${X + 3 * cw + 4}" y="${Y + 4}" width="${cw - 8}" height="${H - 8}" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="8 5"/></g>`
      + `<g class="s2" ${delay(1)}>${frac(170, 262, 3, 4, { size: 34, nc: C.orange, dc: C.blue })}${text(232, 274, '&lt;', { size: 34 })}${text(282, 274, '1', { size: 34, color: C.blue })}</g>`
      + `<g class="s3" ${delay(.2)}>${frac(530, 140, 3, 4, { size: 56, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s3" ${delay(.6)}><text x="530" y="236" text-anchor="middle" font-size="32" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">3</tspan> &lt; <tspan fill="${C.blue}">4</tspan></text></g>`
      + [1, 2, 3].map((k) => ring(X + k * cw, 82, 26, C.orange, 'r3', .9 + k * .15)).join('')
      + `<g class="p3" ${delay(1.2)}>${pill(530, 300, 120, '진분수', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/5/진분수', svg(id, body, motion(id)));
  })();

  // 가분수: 4칸을 다 채우면 4분의 4 = 1 → 다음 띠로 넘어가 4분의 5, 6, 7 → 분자가 분모와 같거나 큼
  (function () {
    const id = 't51-m5-ga', Y = 116, H = 64, cw = 62, xA = 34, xB = 300;
    const cellX = (k) => (k < 4 ? xA + k * cw : xB + (k - 4) * cw);
    const fills = Array.from({ length: 7 }, (_, k) => box(cellX(k), Y, cw, H, C.peach, `class="s${k < 4 ? 1 : 2}" ${delay(k < 4 ? .2 + k * .3 : .2 + (k - 4) * .45)}`)).join('');
    const labels = Array.from({ length: 7 }, (_, k) => k + 1).filter((n) => n >= 4).map((n) => `<g class="p${n === 4 ? 1 : 2}" ${delay(n === 4 ? 1.4 : .4 + (n - 5) * .45)}>${frac(cellX(n - 1) + cw, 70, n, 4, { size: 26, nc: C.orange, dc: C.blue })}</g>`).join('');
    const body = box(xA, Y, 4 * cw, H, 'white') + box(xB, Y, 4 * cw, H, 'white') + fills + bar(xA, Y, 4 * cw, H, 4) + bar(xB, Y, 4 * cw, H, 4) + labels
      + `<g class="s1" ${delay(1.2)}>${oneMark(xA + 4 * cw, Y - 6, Y + H + 14)}</g>`
      + `<g class="s2" ${delay(1.2)}>${oneMark(xB + 4 * cw, Y - 6, Y + H + 14, '2')}</g>`
      + `<g class="s3" ${delay(.2)}>${frac(110, 270, 4, 4, { size: 40, nc: C.orange, dc: C.blue })}<text x="196" y="284" text-anchor="middle" font-size="30" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">4</tspan> = <tspan fill="${C.blue}">4</tspan></text></g>`
      + `<g class="s3" ${delay(.6)}>${frac(320, 270, 7, 4, { size: 40, nc: C.orange, dc: C.blue })}<text x="406" y="284" text-anchor="middle" font-size="30" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">7</tspan> &gt; <tspan fill="${C.blue}">4</tspan></text></g>`
      + `<g class="p3" ${delay(1.2)}>${pill(546, 274, 120, '가분수', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/5/가분수', svg(id, body, motion(id)));
  })();

  // 대분수: 1과 2분의 1 kg(통째 1 + 진분수 2분의 1) → 2와 3분의 1 kg → 자연수끼리, 분수끼리 더해 3과 6분의 5 kg
  (function () {
    const id = 't51-m5-dae', X = 30, u = 92, g = 10, H = 46, yA = 40, yB = 128;
    const whole = (x, y, cls) => `<g class="${cls}">${box(x, y, u, H, C.mint)}<rect x="${x}" y="${y}" width="${u}" height="${H}" fill="none" stroke="${C.green}" stroke-width="3.5"/></g>`;
    const part = (x, y, n, cls) => box(x, y, u, H, 'white') + `<g class="${cls}">${box(x, y, u / n, H, C.peach)}</g>` + bar(x, y, u, H, n);
    const rowA = whole(X, yA, '') + part(X + u + g, yA, 2, '');
    const rowB = whole(X, yB, '') + whole(X + u + g, yB, '') + part(X + 2 * (u + g), yB, 3, '');
    const MA = expr(480, yA + 22, [{ mx: [1, 1, 2], wc: C.green, color: C.orange }], 40, 30);
    const MB = expr(480, yB + 22, [{ mx: [2, 1, 3], wc: C.green, color: C.orange }], 40, 30);
    const E = expr(300, 284, [{ mx: [1, 1, 2], wc: C.green, color: C.orange }, '+', { mx: [2, 1, 3], wc: C.green, color: C.orange }, '=', { mx: [3, 5, 6], wc: C.green, color: C.orange }], 40, 30);
    const NW = expr(150, 200, [{ t: '1', color: C.green }, { t: '+', color: C.green }, { t: '2', color: C.green }, { t: '=', color: C.green }, { t: '3', color: C.green }], 26, 20);
    const NF = expr(400, 200, [{ fr: [1, 2], color: C.orange }, { t: '+', color: C.orange }, { fr: [1, 3], color: C.orange }, { t: '=', color: C.orange }, { fr: [5, 6], color: C.orange }], 26, 22);
    const kHi = (x, y, w, c) => `<rect x="${f(x - 4)}" y="${y - 4}" width="${f(w + 8)}" height="${H + 8}" rx="6" fill="none" stroke="${c}" stroke-width="4"/>`;
    const body = `<g class="p1" ${delay(.1)}>${rowA}</g>` + `<g class="p2" ${delay(.1)}>${rowB}</g>`
      + `<g class="s1" ${delay(.7)}>${MA.body}</g><g class="s2" ${delay(.7)}>${MB.body}</g>`
      + tag(X + u / 2, yA + H + 26, '자연수', C.green, 's1', 1.1, 18) + tag(X + 1.5 * u + g, yA + H + 26, '진분수', C.orange, 's1', 1.3, 18)
      + `<g class="s1" ${delay(1.1)}>${text(560, yA + 36, 'kg', { size: 24, color: C.muted })}</g><g class="s2" ${delay(1.1)}>${text(560, yB + 36, 'kg', { size: 24, color: C.muted })}</g>`
      + `<g class="k3" ${delay(.1)}>${kHi(X, yA, u, C.green)}${kHi(X, yB, 2 * u + g, C.green)}</g>`
      + `<g class="k3" ${delay(.9)}>${kHi(X + u + g, yA, u / 2, C.orange)}${kHi(X + 2 * (u + g), yB, u / 3, C.orange)}</g>`
      + `<g class="h4"><g class="s3" ${delay(.3)}>${NW.body}</g><g class="s3" ${delay(1)}>${NF.body}</g></g>`
      + `<g class="s3" ${delay(1.4)}>${E.body}</g>`
      + ring(E.xs[4], 280, 34, C.green, 'r3', 1.8)
      + `<g class="s4">${text(f(E.xs[4] + 60), 296, 'kg', { size: 24, color: C.muted })}</g>`
      + `<g class="k4" ${delay(.2)}><rect x="${f(E.xs[4] - E.ws[4] / 2 - 8)}" y="242" width="${f(E.ws[4] + 16)}" height="76" rx="12" fill="none" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="p4" ${delay(.8)}>${pill(560, 210, 120, '대분수', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/5/대분수', svg(id, body, motion(id)));
  })();

  // 합: 아침 4분의 3바퀴 + 저녁 2분의 1(= 4분의 2)바퀴 → 저녁 칸이 이어 붙어 4분의 5 → 1과 4분의 1바퀴
  (function () {
    const id = 't51-m5-hap', Y = 66, H = 60, cw = 70, xA = 30, xB = 330, yE = 190;
    const cellX = (k) => (k < 4 ? xA + k * cw : xB + (k - 4) * cw);
    const morning = [0, 1, 2].map((k) => box(cellX(k), Y, cw, H, C.peach, `class="s1" ${delay(.2 + k * .25)}`)).join('');
    const evening = [0, 1].map((k) => `<g class="mv" style="--dx:${cellX(3 + k) - (xA + k * cw)}px;--dy:${Y - yE}px">${box(xA + k * cw, yE, cw, H, C.sky)}<rect x="${xA + k * cw}" y="${yE}" width="${cw}" height="${H}" fill="none" stroke="${C.blue}" stroke-width="3"/></g>`).join('');
    const E = expr(300, 300, [{ fr: [3, 4], color: C.orange }, '+', { fr: [2, 4], color: C.blue }, '=', { fr: [5, 4] }, '=', { mx: [1, 1, 4], color: C.green }], 36, 30);
    const body = box(xA, Y, 4 * cw, H, 'white') + `<g class="s2">${box(xB, Y, 4 * cw, H, 'white')}</g>` + morning
      + bar(xA, Y, 4 * cw, H, 4) + `<g class="s2">${bar(xB, Y, 4 * cw, H, 4)}</g>`
      + `<g class="s1" ${delay(.8)}>${frac(xA + 3 * cw / 2, Y - 34, 3, 4, { size: 24, color: C.orange })}</g>`
      + `<g class="h2"><g class="s1" ${delay(.6)}>${box(xA, yE, 2 * cw, H, 'white')}<rect x="${xA}" y="${yE}" width="${2 * cw}" height="${H}" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 5"/></g></g>`
      + `<g class="s1" ${delay(.6)}>${evening}</g>`
      + `<g class="h2"><g class="s1" ${delay(1)}>${frac(220, yE + 22, 1, 2, { size: 30, color: C.blue })}${text(262, yE + 34, '=', { size: 30, color: C.muted })}${frac(304, yE + 22, 2, 4, { size: 30, color: C.blue })}</g></g>`
      + `<g class="s2" ${delay(1)}>${oneMark(xA + 4 * cw, Y - 14, Y + H + 12)}</g>`
      + `<g class="s2" ${delay(1.2)}>${frac((cellX(3) + cellX(4) + cw) / 2, Y - 34, 2, 4, { size: 24, color: C.blue })}</g>`
      + `<g class="s3" ${delay(.2)}>${E.body}</g>`
      + ring(E.xs[6], 296, 32, C.green, 'r3', 1)
      + `<g class="k3" ${delay(.4)}><rect x="${xA - 4}" y="${Y - 4}" width="${5 * cw + xB - xA - 4 * cw + 8}" height="${H + 8}" rx="8" fill="none" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="p3" ${delay(1.3)}>${pill(560, 300, 80, '합', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/5/합', svg(id, body, motion(id) + `
      .sc-${id} .mv { transition: transform 1s ease-in-out .2s; }
      .on2 .sc-${id} .mv { transform: translate(var(--dx), var(--dy)); }`));
  })();

  // 차: 수정과 4분의 3 L, 식혜 3분의 2 L → 둘 다 12칸으로(12분의 9, 12분의 8) → 더 많은 1칸, 12분의 1 L 가 차
  (function () {
    const id = 't51-m5-cha', X = 50, W = 480, H = 56, yA = 58, yB = 160, c12 = W / 12;
    const thin = (y, keep, d0) => Array.from({ length: 11 }, (_, k) => k + 1).filter((k) => k % keep).map((k, i) => `<path class="draw d2" pathLength="1" ${delay(d0 + i * .05)} d="M${f(X + k * c12)} ${y} V${y + H}" stroke="${C.blue}" stroke-width="1.8"/>`).join('');
    const E = expr(300, 308, [{ fr: [3, 4] }, '−', { fr: [2, 3] }, '=', { fr: [9, 12] }, '−', { fr: [8, 12] }, '=', { fr: [1, 12], color: C.red }], 34, 28);
    const body = box(X, yA, W, H, 'white') + box(X, yA, 9 * c12, H, C.peach) + box(X, yB, W, H, 'white') + box(X, yB, 8 * c12, H, C.sky)
      + thin(yA, 3, .2) + thin(yB, 4, .5)
      + bar(X, yA, W, H, 4) + bar(X, yB, W, H, 3)
      + text(X + W + 50, yA - 12, '수정과', { size: 18, color: C.muted }) + text(X + W + 50, yB - 12, '식혜', { size: 18, color: C.muted })
      + `<g class="h2"><g class="p1" ${delay(.2)}>${frac(X + W + 50, yA + 26, 3, 4, { size: 30, color: C.orange })}</g><g class="p1" ${delay(.5)}>${frac(X + W + 50, yB + 26, 2, 3, { size: 30, color: C.blue })}</g></g>`
      + `<g class="p2" ${delay(1.1)}>${frac(X + W + 50, yA + 26, 9, 12, { size: 30, color: C.orange })}</g><g class="p2" ${delay(1.3)}>${frac(X + W + 50, yB + 26, 8, 12, { size: 30, color: C.blue })}</g>`
      + `<g class="s3" ${delay(.2)}><path d="M${X + 8 * c12} ${yA - 4} V${yB + H + 6}" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="6 5"/><path d="M${X + 9 * c12} ${yA - 4} V${yB + H + 6}" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="6 5"/></g>`
      + `<g class="k3" ${delay(.5)}><rect x="${X + 8 * c12}" y="${yA}" width="${c12}" height="${H}" fill="${C.yellow}" stroke="${C.red}" stroke-width="4"/></g>`
      + `<g class="p3" ${delay(.9)}>${pill(X + 8.5 * c12, 244, 70, '차', C.red, C.peach, 24)}</g>`
      + `<g class="s3" ${delay(1.1)}>${E.body}</g>`
      + ring(E.xs[8], 304, 30, C.red, 'r3', 1.6);
    put('5-1/수학/5/차', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
