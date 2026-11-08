// 수학 5-1 2단원 약수와 배수: 낱말 도식
// 교과서 뜻을 따른다: 약수는 어떤 수를 나누어떨어지게 하는 수, 배수는 1배·2배·3배…한 수,
// 공약수·공배수는 두 수에 공통인 약수·배수, 최대공약수·최소공배수는 그 가운데 가장 큰·작은 수.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, oN 사라지기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기, gN 옅어지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} :is(.h2,.h3,.h4,.g2,.g3,.g4) { transition: opacity .4s ease; }
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
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .g${n} { opacity: .3; }`;
    return css;
  };
  const charW = (ch) => /[0-9]/.test(ch) ? .58 : ch === '…' ? 1 : /[÷=×<>+−]/.test(ch) ? .72 : .6;
  function expr(cx, cy, toks, size) {
    const items = toks.map((t) => (typeof t === 'object' ? t : { t: String(t) }));
    const ws = items.map((it) => [...it.t].reduce((s, ch) => s + charW(ch) * size, 0)), gap = size * .32;
    const total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = cx - total / 2;
    const xs = [];
    const body = items.map((it, i) => {
      const c = x + ws[i] / 2; xs.push(c);
      x += ws[i] + gap;
      return text(f(c), f(cy + size * .36), it.t, { size, color: it.color || C.ink });
    }).join('');
    return { body, xs, ws, total };
  }
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 22) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 20)}" width="${w}" height="40" rx="20" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(cx), f(cy + size * .36), s, { size, color })}`;
  // 위(또는 아래)로 휘는 깡충 화살표
  const hop = (x1, x2, y, h, color, cls, d = 0) => {
    const mx = (x1 + x2) / 2, my = y - h, a = Math.atan2(y - my, x2 - mx), l = 10;
    const p = (t) => `${f(x2 - l * Math.cos(a + t))} ${f(y - l * Math.sin(a + t))}`;
    return `<path class="draw ${cls}" pathLength="1" ${delay(d)} d="M${f(x1)} ${y} Q${f(mx)} ${f(my)} ${f(x2)} ${y} M${p(-0.5)} L${f(x2)} ${y} L${p(0.5)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const ball = (x, y, r, fill, stroke) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><circle cx="${f(x - r * .35)}" cy="${f(y - r * .35)}" r="${f(r * .28)}" fill="white" opacity=".75"/>`;
  const plate = (cx, cy, rx, ry = 20) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="white" stroke="${C.line}" stroke-width="3"/><ellipse cx="${cx}" cy="${cy}" rx="${rx - 14}" ry="${ry - 7}" fill="none" stroke="${C.line}" stroke-width="1.5"/>`;

  // 나머지: 구슬 13개 → 4명에게 3개씩, 1개 남음(13 ÷ 4 = 3 … 1) → 12개면 남는 것이 없어 나머지 0
  (function () {
    const id = 't51-m2-namuji', y0 = 62, px = [95, 235, 375, 515], py = 196;
    const xs = Array.from({ length: 13 }, (_, i) => 50 + i * 42);
    let marbles = '';
    xs.forEach((x, i) => {
      if (i === 12) return;
      const k = Math.floor(i / 3), j = i % 3;
      marbles += `<g class="mv" ${delay(.15 + k * .25, `--dx:${f(px[k] + (j - 1) * 32 - x)}px;--dy:${py - 12 - y0}px`)}>${ball(x, y0, 15, C.sky, C.blue)}</g>`;
    });
    const last = xs[12];
    const E1 = expr(320, 296, ['13', '÷', '4', '=', '3', '…', { t: '1', color: C.orange }], 40);
    const E2 = expr(320, 296, ['12', '÷', '4', '=', '3', '…', { t: '0', color: C.orange }], 40);
    const body = px.map((x, k) => plate(x, py, 66) + text(x, py + 50, `${k + 1}`, { size: 20, color: C.muted })).join('')
      + `<g class="o2"><g class="p1" ${delay(.3)}>${text(320, 140, '13개', { size: 26, color: C.blue })}</g></g>`
      + marbles
      + `<g class="o3">${ball(last, y0, 15, C.peach, C.orange)}`
      + `<g class="s2" ${delay(1.3)}><circle cx="${last}" cy="${y0}" r="25" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="6 5"/>${text(last - 2, y0 + 56, '나머지', { size: 22, color: C.orange })}</g></g>`
      + `<g class="h3"><g class="s2" ${delay(1.1)}>${E1.body}</g></g>`
      + `<g class="h3">${ring(E1.xs[6], 296, 24, C.orange, 'r2', 1.5)}</g>`
      + `<g class="s3" ${delay(.4)}>${E2.body}</g>`
      + ring(E2.xs[6], 296, 24, C.orange, 'r3', .9);
    put('5-1/수학/2/나머지', svg(id, body, motion(id) + `
      .sc-${id} .mv { transition: transform .8s ease-in-out; }
      .on2 .sc-${id} .mv { transform: translate(var(--dx), var(--dy)); }`));
  })();

  // 약수: 쿠키 12개 → 접시 3개에 4개씩 남김없이(12 ÷ 3 = 4) → 접시 5개면 2개가 남음 → 1~12 가운데 1, 2, 3, 4, 6, 12
  (function () {
    const id = 't51-m2-yaksu', y0 = 52;
    const xs = Array.from({ length: 12 }, (_, i) => 78 + i * 44);
    const A = [140, 320, 500], B = [64, 172, 280, 388, 496];
    const off4 = [[-17, -11], [17, -11], [-17, 11], [17, 11]];
    const cookies = xs.map((x, i) => {
      const a = A[Math.floor(i / 4)] + off4[i % 4][0], ay = 150 + off4[i % 4][1];
      const bIdx = Math.floor(i / 2);
      const b = bIdx < 5 ? B[bIdx] + (i % 2 ? 15 : -15) : 600, by = bIdx < 5 ? 150 : 128 + (i % 2) * 34;
      return `<g class="ck" style="--ax:${f(a - x)}px;--ay:${f(ay - y0)}px;--bx:${f(b - x)}px;--by:${f(by - y0)}px;--w:${f(i * .05)}s">`
        + `<circle cx="${x}" cy="${y0}" r="14" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`
        + `<circle cx="${x - 5}" cy="${y0 - 3}" r="2.6" fill="#8a5a2b"/><circle cx="${x + 5}" cy="${y0 + 4}" r="2.6" fill="#8a5a2b"/></g>`;
    }).join('');
    const platesA = A.map((x) => plate(x, 152, 62, 34)).join('');
    const platesB = B.map((x) => plate(x, 152, 46, 26)).join('');
    const strip = Array.from({ length: 12 }, (_, i) => {
      const n = i + 1, x = 70 + i * 46, isD = [1, 2, 3, 4, 6, 12].includes(n);
      return `<g class="${isD ? '' : 'g3'}"><rect x="${x - 21}" y="268" width="42" height="42" rx="8" fill="white" stroke="${C.line}" stroke-width="2"/>${text(x, 296, n, { size: 22, weight: 700 })}</g>`
        + (isD ? `<g class="p3" ${delay(.3 + i * .08)}><circle cx="${x}" cy="289" r="23" fill="none" stroke="${C.green}" stroke-width="4"/></g>` : '');
    }).join('');
    const sx = (n) => 70 + (n - 1) * 46;
    const E1 = expr(320, 222, ['12', '÷', { t: '3', color: C.green }, '=', '4'], 34);
    const E2 = expr(320, 222, ['12', '÷', { t: '5', color: C.red }, '=', '2', '…', { t: '2', color: C.red }], 34);
    const body = `<g class="pa"><g class="s1">${platesA}</g></g>` + `<g class="s2"><g class="h3">${platesB}</g></g>`
      + `<g class="h2"><g class="s1" ${delay(1.1)}>${E1.body}</g></g>`
      + `<g class="h3"><g class="s2" ${delay(1.1)}>${E2.body}</g></g>`
      + cookies
      + `<g class="h3"><g class="s2" ${delay(1.3)}><rect x="578" y="106" width="44" height="78" rx="12" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="6 5"/></g></g>`
      + strip
      + `<g class="h3"><g class="p1" ${delay(1.3)}><circle cx="${sx(3)}" cy="289" r="23" fill="none" stroke="${C.green}" stroke-width="4"/></g></g>`
      + `<g class="h3"><g class="p2" ${delay(1.3)}><path d="M${sx(5) - 16} 273 L${sx(5) + 16} 305 M${sx(5) + 16} 273 L${sx(5) - 16} 305" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/></g></g>`
      + `<g class="p3" ${delay(1.3)}>${pill(320, 222, 150, '12의 약수', C.green, C.mint, 24)}</g>`;
    put('5-1/수학/2/약수', svg(id, body, motion(id) + `
      .sc-${id} .ck { transition: transform .8s ease-in-out var(--w); }
      .on1 .sc-${id} .ck { transform: translate(var(--ax), var(--ay)); }
      .on2 .sc-${id} .ck { transform: translate(var(--bx), var(--by)); }
      .on3 .sc-${id} .ck { transform: translate(var(--ax), var(--ay)); }
      .sc-${id} .pa { transition: opacity .4s ease; }
      .on2 .sc-${id} .pa { opacity: 0; }
      .on3 .sc-${id} .pa { opacity: 1; }`));
  })();

  // 배수: 한 명에게 컵 받침 3개 → 2명 6개, 3명 9개, 4명 12개(수직선에서 3씩 깡충) → 3, 6, 9, 12, 15, 18, …
  (function () {
    const id = 't51-m2-baesu', y = 236, x0 = 52, u = 30;
    const at = (n) => x0 + n * u;
    let line = `<path d="M${x0 - 20} ${y} H${at(18) + 22}" stroke="${C.ink}" stroke-width="3"/>`;
    for (let n = 0; n <= 18; n++) line += `<path d="M${at(n)} ${y - (n % 3 ? 6 : 9)} V${y + (n % 3 ? 6 : 9)}" stroke="${n % 3 ? C.muted : C.ink}" stroke-width="2"/>`;
    line += text(at(0), y + 32, 0, { size: 19, weight: 600, color: C.muted });
    const beatOf = (k) => (k === 1 ? 1 : k <= 4 ? 2 : 3);
    const dOf = (k) => (k === 1 ? .2 : k <= 4 ? .2 + (k - 2) * .45 : .2 + (k - 5) * .45);
    let hops = '', nums = '', stacks = '';
    for (let k = 1; k <= 6; k++) {
      const b = beatOf(k), d = dOf(k);
      hops += hop(at(3 * k - 3) + 3, at(3 * k) - 3, y - 6, 46, C.orange, `d${b}`, d);
      nums += `<g class="p${b}" ${delay(d + .4)}><circle cx="${at(3 * k)}" cy="${y}" r="9" fill="${C.orange}" stroke="white" stroke-width="2"/>${text(at(3 * k), y + 34, 3 * k, { size: 24, color: C.orange })}</g>`;
      nums += tag(at(3 * k), y + 68, `${k}배`, C.muted, `s${b}`, d + .5, 20);
      if (k <= 4) {
        let sq = '';
        for (let c = 0; c < k; c++) for (let r = 0; r < 3; r++) sq += `<rect x="${f(at(3 * k) - k * 9 + c * 18 + 1)}" y="${148 - r * 18}" width="16" height="16" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`;
        stacks += `<g class="p${b}" ${delay(d + .2)}>${sq}${text(at(3 * k), 88, `${k}명`, { size: 20, color: C.muted })}</g>`;
      }
    }
    const body = line + hops + stacks + nums
      + `<g class="s3" ${delay(1.2)}>${text(at(18) + 34, y + 10, '…', { size: 28, color: C.orange })}</g>`
      + `<g class="p3" ${delay(1.4)}>${pill(at(16) - 6, 112, 136, '3의 배수', C.orange, C.peach, 24)}</g>`;
    put('5-1/수학/2/배수', svg(id, body, motion(id)));
  })();

  // 두 줄 약수 목록: 공통인 칸이 같은 세로줄에 오게 늘어놓는다
  const rows = (vals, A, B, { x0, step, yA, yB, colA, colB, fillA, fillB, labA, labB, dA = 1, dB = 2 }) => {
    const xOf = (v) => x0 + vals.indexOf(v) * step;
    let s = `<g class="s${dA}">${text(64, yA + 8, labA, { size: 22, color: colA })}</g><g class="s${dB}">${text(64, yB + 8, labB, { size: 22, color: colB })}</g>`;
    A.forEach((v, i) => { s += `<g class="p${dA}" ${delay(.2 + i * .15)}><circle cx="${xOf(v)}" cy="${yA}" r="24" fill="${fillA}" stroke="${colA}" stroke-width="2.5"/>${text(xOf(v), yA + 8, v, { size: 24, color: C.ink })}</g>`; });
    B.forEach((v, i) => { s += `<g class="p${dB}" ${delay(.2 + i * .15)}><circle cx="${xOf(v)}" cy="${yB}" r="24" fill="${fillB}" stroke="${colB}" stroke-width="2.5"/>${text(xOf(v), yB + 8, v, { size: 24, color: C.ink })}</g>`; });
    return { body: s, xOf };
  };

  // 공약수: 12의 약수 한 줄 → 16의 약수 한 줄 → 두 줄에 함께 있는 1, 2, 4
  (function () {
    const id = 't51-m2-gongyaksu', vals = [1, 2, 3, 4, 6, 8, 12, 16];
    const A = [1, 2, 3, 4, 6, 12], B = [1, 2, 4, 8, 16], com = [1, 2, 4];
    const R = rows(vals, A, B, { x0: 160, step: 64, yA: 92, yB: 186, colA: C.blue, colB: C.purple, fillA: C.sky, fillB: C.lilac, labA: '12의 약수', labB: '16의 약수' });
    const bands = com.map((v, i) => `<g class="s3" ${delay(.2 + i * .25)}><rect x="${R.xOf(v) - 31}" y="56" width="62" height="166" rx="16" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>`).join('');
    const body = bands + R.body
      + `<g class="k3" ${delay(.9)}>${com.map((v) => `<rect x="${R.xOf(v) - 31}" y="56" width="62" height="166" rx="16" fill="none" stroke="${C.green}" stroke-width="5"/>`).join('')}</g>`
      + `<g class="p3" ${delay(1.3)}>${pill(250, 296, 120, '공약수', C.green, C.mint, 26)}${text(330, 306, '1, 2, 4', { size: 30, color: C.green, anchor: 'start' })}</g>`;
    put('5-1/수학/2/공약수', svg(id, body, motion(id)));
  })();

  // 최대공약수: 18의 약수와 24의 약수를 두 원에 → 겹친 곳 1, 2, 3, 6 이 공약수 → 그 가운데 가장 큰 6
  (function () {
    const id = 't51-m2-choedae', L = [250, 158], Rr = [390, 158], r = 118;
    const n = (x, y, v, color, cls, d) => `<g class="${cls}" ${delay(d)}>${text(x, y + 10, v, { size: 30, color })}</g>`;
    const lens = `M320 ${f(158 - Math.sqrt(r * r - 70 * 70))} A${r} ${r} 0 0 1 320 ${f(158 + Math.sqrt(r * r - 70 * 70))} A${r} ${r} 0 0 1 320 ${f(158 - Math.sqrt(r * r - 70 * 70))} Z`;
    const body = `<g class="s2">${`<path d="${lens}" fill="${C.mint}"/>`}</g>`
      + `<circle cx="${L[0]}" cy="${L[1]}" r="${r}" fill="none" stroke="${C.blue}" stroke-width="4"/>`
      + `<circle cx="${Rr[0]}" cy="${Rr[1]}" r="${r}" fill="none" stroke="${C.purple}" stroke-width="4"/>`
      + text(96, 40, '18의 약수', { size: 22, color: C.blue }) + text(544, 40, '24의 약수', { size: 22, color: C.purple })
      + n(186, 128, 9, C.blue, 'p1', .2) + n(186, 186, 18, C.blue, 'p1', .35)
      + n(298, 128, 1, C.ink, 'p1', .6) + n(342, 128, 2, C.ink, 'p1', .7) + n(298, 186, 3, C.ink, 'p1', .8)
      + `<g class="p1" ${delay(.9)}>${text(342, 196, 6, { size: 30, color: C.ink })}</g>`
      + n(428, 128, 4, C.purple, 'p1', 1.1) + n(474, 128, 8, C.purple, 'p1', 1.2) + n(428, 186, 12, C.purple, 'p1', 1.3) + n(474, 186, 24, C.purple, 'p1', 1.4)
      + `<g class="s2" ${delay(.3)}><path d="${lens}" fill="none" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="h3"><g class="p2" ${delay(.8)}>${pill(320, 318, 120, '공약수', C.green, C.mint, 24)}</g></g>`
      + `<g class="s3"><circle cx="342" cy="186" r="22" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>${text(342, 196, 6, { size: 30, color: C.ink })}</g>`
      + ring(342, 186, 24, C.orange, 'r3', .4)
      + `<g class="p3" ${delay(1)}>${pill(300, 318, 170, '최대공약수', C.orange, C.peach, 24)}${text(404, 328, '6', { size: 32, color: C.orange, anchor: 'start' })}</g>`;
    put('5-1/수학/2/최대공약수', svg(id, body, motion(id)));
  })();

  // 공배수: 날짜 1~18 → 2일마다(2의 배수) → 3일마다(3의 배수) → 둘 다인 6, 12, 18
  (function () {
    const id = 't51-m2-gongbaesu', x0 = 132, u = 27, yS = 168;
    const xOf = (d) => x0 + (d - 1) * u;
    let strip = '';
    for (let d = 1; d <= 18; d++) strip += `<rect x="${f(xOf(d) - u / 2)}" y="${yS - 20}" width="${u}" height="40" fill="white" stroke="${C.line}" stroke-width="2"/>${text(xOf(d), yS + 7, d, { size: 18, weight: 600, color: C.muted })}`;
    const drop = (x, y, fill, stroke) => `<path d="M${x} ${y - 16} C${x + 4} ${y - 8} ${x + 12} ${y} ${x + 12} ${y + 5} A12 12 0 0 1 ${x - 12} ${y + 5} C${x - 12} ${y} ${x - 4} ${y - 8} ${x} ${y - 16} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
    let marks = '';
    for (let d = 2; d <= 18; d += 2) marks += `<g class="p1" ${delay(.1 + d * .06)}>${drop(xOf(d), 104, C.peach, C.red)}</g>`;
    for (let d = 3; d <= 18; d += 3) marks += `<g class="p2" ${delay(.1 + d * .07)}>${drop(xOf(d), 226, C.mint, C.green)}</g>`;
    const both = [6, 12, 18];
    const body = both.map((d, i) => `<g class="s3" ${delay(.2 + i * .25)}><rect x="${f(xOf(d) - 18)}" y="76" width="36" height="176" rx="12" fill="${C.yellow}" fill-opacity=".45" stroke="${C.orange}" stroke-width="3"/></g>`).join('')
      + strip + marks
      + `<g class="s1">${text(62, 112, '2의 배수', { size: 22, color: C.red })}</g>`
      + `<g class="s2">${text(62, 234, '3의 배수', { size: 22, color: C.green })}</g>`
      + text(62, 175, '날짜', { size: 20, color: C.muted })
      + both.map((d, i) => ring(xOf(d), yS, 15, C.orange, 'r3', .5 + i * .25)).join('')
      + `<g class="p3" ${delay(1.3)}>${pill(250, 306, 120, '공배수', C.orange, C.peach, 26)}${text(330, 316, '6, 12, 18, …', { size: 30, color: C.orange, anchor: 'start' })}</g>`;
    put('5-1/수학/2/공배수', svg(id, body, motion(id)));
  })();

  // 최소공배수: 10분마다(위로 깡충) → 15분마다(아래로 깡충) → 처음 함께 만나는 30
  (function () {
    const id = 't51-m2-choeso', y = 176, x0 = 64, u = 8.4;
    const at = (n) => x0 + n * u;
    let line = `<path d="M${x0} ${y} H${at(60) + 20}" stroke="${C.ink}" stroke-width="3"/>`;
    for (let n = 0; n <= 60; n += 5) line += `<path d="M${f(at(n))} ${y - (n % 10 ? 6 : 9)} V${y + (n % 10 ? 6 : 9)}" stroke="${C.ink}" stroke-width="2"/>`;
    line += text(at(0) - 22, y + 7, 0, { size: 20, color: C.muted });
    let up = '', down = '';
    for (let k = 1; k <= 6; k++) {
      up += hop(at(10 * k - 10) + 2, at(10 * k) - 2, y - 8, 44, C.blue, 'd1', .1 + k * .22);
      up += tag(at(10 * k), y - 62, 10 * k, C.blue, 'p1', .3 + k * .22, 22);
    }
    for (let k = 1; k <= 4; k++) {
      down += hop(at(15 * k - 15) + 2, at(15 * k) - 2, y + 8, -50, C.orange, 'd2', .1 + k * .3);
      down += tag(at(15 * k), y + 84, 15 * k, C.orange, 'p2', .3 + k * .3, 22);
    }
    const body = [30, 60].map((n, i) => `<g class="s3" ${delay(.2 + i * .3)}><rect x="${f(at(n) - 24)}" y="${y - 96}" width="48" height="192" rx="14" fill="${C.yellow}" fill-opacity=".4" stroke="${C.orange}" stroke-width="3"/></g>`).join('')
      + line + up + down
      + `<g class="s1">${text(40, 64, '10분', { size: 22, color: C.blue, anchor: 'start' })}</g>`
      + `<g class="s2">${text(40, 300, '15분', { size: 22, color: C.orange, anchor: 'start' })}</g>`
      + ring(at(30), y, 26, C.orange, 'r3', .8)
      + `<g class="s3" ${delay(.6)}>${text(at(30), y + 122, '공배수', { size: 20, color: C.muted })}${text(at(60), y + 122, '공배수', { size: 20, color: C.muted })}</g>`
      + `<g class="p3" ${delay(1.2)}>${pill(at(30), 334, 170, '최소공배수', C.orange, C.peach, 24)}</g>`;
    put('5-1/수학/2/최소공배수', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
