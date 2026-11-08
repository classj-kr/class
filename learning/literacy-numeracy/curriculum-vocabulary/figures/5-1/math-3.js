// 수학 5-1 3단원 약분과 통분: 낱말 도식
// 교과서 뜻을 따른다: 약분은 분모와 분자를 1이 아닌 공약수로 나누는 것(칠한 크기는 그대로), 기약분수는 분모와 분자의
// 공약수가 1뿐인 분수, 통분은 분모를 같게 하는 것, 공통분모는 통분한 분모, 분모가 10인 분수는 소수로 나타낼 수 있다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, oN 사라지기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기, gN 옅어지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} :is(.h2,.h3,.h4,.g2,.g3,.g4) { transition: opacity .5s ease; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .o${n} { animation: ${id}-out .4s ease-out both; }
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
  const numMid = (cy, size) => cy - size * 0.6;
  const denMid = (cy, size) => cy + size * 0.62;
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 22) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 20)}" width="${w}" height="40" rx="20" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(cx), f(cy + size * .36), s, { size, color })}`;
  const box = (x, y, w, h, fill, extra = '') => `<rect ${extra} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"/>`;
  // 휘는 화살표 (x1,y1) → (x2,y2), 가운데가 bend 만큼 위(음수)·아래(양수)로
  const bow = (x1, y1, x2, y2, bend, color, cls, d = 0) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + bend, a = Math.atan2(y2 - my, x2 - mx), l = 10;
    const p = (t) => `${f(x2 - l * Math.cos(a + t))} ${f(y2 - l * Math.sin(a + t))}`;
    return `<path class="draw ${cls}" pathLength="1" ${delay(d)} d="M${f(x1)} ${f(y1)} Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)} M${p(-0.5)} L${f(x2)} ${f(y2)} L${p(0.5)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  };

  // 피자: 가운데 O, 반지름 r, 8조각. k 번째 조각(12시부터 시계 방향)
  const pizzaSlice = (O, r, k, fill) => {
    const a0 = (-90 + k * 45) * Math.PI / 180, a1 = (-90 + (k + 1) * 45) * Math.PI / 180;
    return `<path d="M${O[0]} ${O[1]} L${f(O[0] + r * Math.cos(a0))} ${f(O[1] + r * Math.sin(a0))} A${r} ${r} 0 0 1 ${f(O[0] + r * Math.cos(a1))} ${f(O[1] + r * Math.sin(a1))} Z" fill="${fill}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
  };
  const sliceDir = (k) => { const a = (-90 + (k + .5) * 45) * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; };
  const pepperoni = (O, r, k) => { const [c, s] = sliceDir(k); return `<circle cx="${f(O[0] + r * .62 * c)}" cy="${f(O[1] + r * .62 * s)}" r="9" fill="${C.red}" opacity=".75"/>`; };
  const cutLines = (O, r, cls, d0) => [0, 1, 2, 3].map((k) => {
    const a = (-90 + k * 45) * Math.PI / 180;
    return `<path class="draw ${cls}" pathLength="1" ${delay(d0 + k * .15)} d="M${f(O[0] - r * Math.cos(a))} ${f(O[1] - r * Math.sin(a))} L${f(O[0] + r * Math.cos(a))} ${f(O[1] + r * Math.sin(a))}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
  }).join('');

  // 분모: 피자 한 판 → 똑같이 8조각 → 한 조각은 8분의 1, 아래 8 이 분모
  (function () {
    const id = 't51-m3-bunmo', O = [200, 180], r = 128, FX = 470, FY = 150, S = 64;
    let slices = '';
    for (let k = 0; k < 8; k++) {
      const [c, s] = sliceDir(k);
      const inner = pizzaSlice(O, r, k, C.peach) + pepperoni(O, r, k);
      slices += k === 1 ? `<g class="mv" style="--dx:${f(c * 34)}px;--dy:${f(s * 34)}px">${inner}</g>` : inner;
    }
    const num = (k) => { const [c, s] = sliceDir(k); return tag(O[0] + (r + 26) * c, O[1] + (r + 26) * s + 8, k + 1, C.blue, 'p1', .9 + k * .12, 22); };
    const nums = [0, 2, 3, 4, 5, 6, 7].map(num).join('');
    const [c1, s1] = sliceDir(1);
    const body = `<circle cx="${O[0]}" cy="${O[1]}" r="${r + 4}" fill="#e9b47a"/>` + slices + cutLines(O, r, 'd1', .2)
      + `<g class="k3">${nums.replace(/class="p1"/g, '')}</g>` + nums
      + `<g class="mv" style="--dx:${f(c1 * 34)}px;--dy:${f(s1 * 34)}px">${num(1)}</g>`
      + `<g class="s2" ${delay(.6)}>${frac(FX, FY, 1, 8, { size: S, nc: C.orange, dc: C.blue })}</g>`
      + ring(FX, denMid(FY, S), 36, C.blue, 'r3', .3)
      + `<g class="p3" ${delay(.6)}>${pill(FX + 100, 290, 100, '분모', C.blue, C.sky, 26)}</g>`
      + `<g class="s3" ${delay(.9)}>${arrow(FX + 74, 268, FX + 30, denMid(FY, S) + 22, C.blue)}</g>`;
    put('5-1/수학/3/분모', svg(id, body, motion(id) + `
      .sc-${id} .mv { transition: transform .7s ease-out .3s; }
      .on2 .sc-${id} .mv { transform: translate(var(--dx), var(--dy)); }`));
  })();

  // 분자: 8조각 피자, 분모 8 → 3조각을 먹음(1, 2, 3) → 위의 3 이 분자
  (function () {
    const id = 't51-m3-bunja', O = [200, 180], r = 128, FX = 470, FY = 150, S = 64;
    let slices = '';
    for (let k = 0; k < 8; k++) {
      const [c, s] = sliceDir(k);
      if (k < 3) slices += `<g class="mv" style="--w:${f(.2 + k * .3)}s;--dx:${f(c * 40)}px;--dy:${f(s * 40)}px">${pizzaSlice(O, r, k, C.peach)}${pepperoni(O, r, k)}</g>`;
      else slices += pizzaSlice(O, r, k, C.peach) + pepperoni(O, r, k);
    }
    const eat = [0, 1, 2].map((k) => { const [c, s] = sliceDir(k); return tag(O[0] + (r * .62 + 40) * c, O[1] + (r * .62 + 40) * s + 9, k + 1, C.orange, 'p2', .5 + k * .3, 28); }).join('');
    const body = `<circle cx="${O[0]}" cy="${O[1]}" r="${r + 4}" fill="#e9b47a"/>`
      + `<g class="s2" ${delay(.2)}>${[0, 1, 2].map((k) => pizzaSlice(O, r, k, 'white')).join('')}</g>`
      + slices + `<g class="s1">${cutLines(O, r, '', 0).replace(/class="draw "/g, '')}</g>`
      + eat
      + `<path d="M${FX - 36} ${FY} H${FX + 36}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`
      + text(FX, f(FY + S * .98), 8, { size: S, color: C.blue })
      + `<g class="h2">${text(FX, f(FY - S * .24), '?', { size: S, color: C.muted })}</g>`
      + `<g class="p2" ${delay(1.3)}>${text(FX, f(FY - S * .24), 3, { size: S, color: C.orange })}</g>`
      + ring(FX, numMid(FY, S), 36, C.orange, 'r3', .3)
      + `<g class="p3" ${delay(.6)}>${pill(FX + 100, 56, 100, '분자', C.orange, C.peach, 26)}</g>`
      + `<g class="s3" ${delay(.9)}>${arrow(FX + 74, 78, FX + 32, numMid(FY, S) - 14, C.orange)}</g>`;
    put('5-1/수학/3/분자', svg(id, body, motion(id) + `
      .on2 .sc-${id} .mv { transform: translate(var(--dx), var(--dy)); opacity: 0; transition: transform .6s ease-out var(--w), opacity .4s ease calc(var(--w) + .5s); }`));
  })();

  // 약분: 50칸 가운데 30칸(50분의 30) → 가로선을 지우면 5칸 가운데 3칸, 분모·분자 ÷10 → 칠한 크기는 그대로
  (function () {
    const id = 't51-m3-yakbun', X = 50, Y = 40, W = 250, H = 270, cols = 5, rws = 10;
    const cw = W / cols, rh = H / rws;
    const hLines = Array.from({ length: rws - 1 }, (_, k) => `<path d="M${X} ${f(Y + (k + 1) * rh)} H${X + W}" stroke="${C.ink}" stroke-width="1.5"/>`).join('');
    const vLines = Array.from({ length: cols - 1 }, (_, k) => `<path d="M${X + (k + 1) * cw} ${Y} V${Y + H}" stroke="${C.ink}" stroke-width="3"/>`).join('');
    const S = 46, LX = 400, RX = 560, FY = 150;
    const body = box(X, Y, W, H, 'white') + box(X, Y, 3 * cw, H, C.peach, `class="s1" ${delay(.2)}`)
      + `<g class="h2">${hLines}</g>` + vLines + `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + `<g class="s1" ${delay(.6)}>${frac(LX, FY, 30, 50, { size: S, nc: C.orange, dc: C.blue })}</g>`
      + bow(LX + 22, FY - 66, RX - 18, FY - 66, -36, C.green, 'd2', .4) + bow(LX + 22, FY + 50, RX - 18, FY + 50, 36, C.green, 'd2', .6)
      + tag(480, 50, '÷ 10', C.green, 's2', .6, 24) + tag(480, 272, '÷ 10', C.green, 's2', .8, 24)
      + `<g class="s2" ${delay(1.1)}>${frac(RX, FY, 3, 5, { size: S, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="k3" ${delay(.1)}><rect x="${X}" y="${Y}" width="${3 * cw}" height="${H}" fill="none" stroke="${C.orange}" stroke-width="6"/></g>`
      + `<g class="s3" ${delay(.6)}>${text(480, 162, '=', { size: 40 })}</g>`
      + `<g class="p3" ${delay(1)}>${pill(480, 322, 100, '약분', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/3/약분', svg(id, body, motion(id)));
  })();

  // 기약분수: 16칸 가운데 12칸 → ÷2 로 8분의 6 → 다시 ÷2 로 4분의 3, 3과 4의 공약수는 1뿐
  (function () {
    const id = 't51-m3-giyak', X = 46, Y = 50, W = 240, H = 240, c4 = W / 4, r4 = H / 4;
    const S = 38, FY = 130, xs = [370, 470, 570];
    const hl = (k, cls) => `<g class="${cls}"><path d="M${X} ${Y + k * r4} H${X + W}" stroke="${C.ink}" stroke-width="2.5"/></g>`;
    const body = box(X, Y, W, H, 'white') + box(X, Y, 3 * c4, H, C.peach)
      + hl(1, 'h2') + hl(3, 'h2') + hl(2, 'h3')
      + [1, 2, 3].map((k) => `<path d="M${X + k * c4} ${Y} V${Y + H}" stroke="${C.ink}" stroke-width="3"/>`).join('')
      + `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + frac(xs[0], FY, 12, 16, { size: S, nc: C.orange, dc: C.blue })
      + bow(xs[0] + 20, FY - 56, xs[1] - 16, FY - 56, -26, C.green, 'd2', .2) + tag((xs[0] + xs[1]) / 2, FY - 92, '÷ 2', C.green, 's2', .4, 22)
      + bow(xs[0] + 20, FY + 46, xs[1] - 16, FY + 46, 26, C.green, 'd2', .3) + tag((xs[0] + xs[1]) / 2, FY + 104, '÷ 2', C.green, 's2', .5, 22)
      + `<g class="s2" ${delay(.8)}>${frac(xs[1], FY, 6, 8, { size: S, nc: C.orange, dc: C.blue })}</g>`
      + bow(xs[1] + 16, FY - 56, xs[2] - 16, FY - 56, -26, C.green, 'd3', .2) + tag((xs[1] + xs[2]) / 2, FY - 92, '÷ 2', C.green, 's3', .4, 22)
      + bow(xs[1] + 16, FY + 46, xs[2] - 16, FY + 46, 26, C.green, 'd3', .3) + tag((xs[1] + xs[2]) / 2, FY + 104, '÷ 2', C.green, 's3', .5, 22)
      + `<g class="s3" ${delay(.8)}>${frac(xs[2], FY, 3, 4, { size: S, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="k3" ${delay(1.1)}><rect x="${xs[2] - 30}" y="${FY - 50}" width="60" height="100" rx="12" fill="none" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="p3" ${delay(1.5)}>${pill(470, 300, 150, '기약분수', C.green, C.mint, 26)}</g>`
      + `<g class="s3" ${delay(1.5)}>${arrow(530, 282, xs[2] - 6, FY + 56, C.green)}</g>`;
    put('5-1/수학/3/기약분수', svg(id, body, motion(id)));
  })();

  // 통분: 3분의 2와 4분의 1, 조각 크기가 다름 → 둘 다 12칸으로 잘라 12분의 8, 12분의 3 → 분모가 12로 같아짐
  (function () {
    const id = 't51-m3-tongbun', X = 40, W = 360, H = 60, yA = 60, yB = 196, S = 34;
    const lines = (y, n, cls, d0, w = 3) => Array.from({ length: n - 1 }, (_, k) => `<path ${cls ? `class="draw ${cls}" pathLength="1" ${delay(d0 + k * .05)}` : ''} d="M${f(X + (k + 1) * W / n)} ${y} V${y + H}" stroke="${C.ink}" stroke-width="${w}"/>`).join('');
    const extra = (y, n, keep, cls, d0) => Array.from({ length: n - 1 }, (_, k) => k + 1).filter((k) => k % keep).map((k, i) => `<path class="draw ${cls}" pathLength="1" ${delay(d0 + i * .06)} d="M${f(X + k * W / n)} ${y} V${y + H}" stroke="${C.blue}" stroke-width="2"/>`).join('');
    const fx = 470, gx = 580;
    const body = box(X, yA, W, H, 'white') + box(X, yA, W * 2 / 3, H, C.peach) + box(X, yB, W, H, 'white') + box(X, yB, W / 4, H, C.sky)
      + extra(yA, 12, 4, 'd2', .2) + extra(yB, 12, 3, 'd2', .5)
      + lines(yA, 3, '', 0) + lines(yB, 4, '', 0)
      + `<rect x="${X}" y="${yA}" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3"/><rect x="${X}" y="${yB}" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + `<g class="p1" ${delay(.2)}>${frac(fx, yA + 30, 2, 3, { size: S, color: C.ink, nc: C.orange })}</g>`
      + `<g class="p1" ${delay(.5)}>${frac(fx, yB + 30, 1, 4, { size: S, color: C.ink, nc: C.blue })}</g>`
      + `<g class="h2"><g class="k1" ${delay(.8)}><rect x="${X}" y="${yA}" width="${W / 3}" height="${H}" fill="none" stroke="${C.red}" stroke-width="5"/><rect x="${X}" y="${yB}" width="${W / 4}" height="${H}" fill="none" stroke="${C.red}" stroke-width="5"/></g></g>`
      + `<g class="s2" ${delay(1)}>${text(fx + 50, yA + 42, '=', { size: 34 })}${frac(gx, yA + 30, 8, 12, { size: S, color: C.ink, nc: C.orange, dc: C.green })}</g>`
      + `<g class="s2" ${delay(1.2)}>${text(fx + 50, yB + 42, '=', { size: 34 })}${frac(gx, yB + 30, 3, 12, { size: S, color: C.ink, nc: C.blue, dc: C.green })}</g>`
      + tag(X + W / 2, yA + H + 32, '12칸', C.blue, 's2', .9, 20) + tag(X + W / 2, yB + H + 32, '12칸', C.blue, 's2', 1.1, 20)
      + ring(gx, denMid(yA + 30, S), 26, C.green, 'r3', .2) + ring(gx, denMid(yB + 30, S), 26, C.green, 'r3', .2)
      + `<g class="k3" ${delay(.6)}><rect x="${gx - 30}" y="${yA + 34}" width="60" height="40" rx="10" fill="none" stroke="${C.green}" stroke-width="3.5"/><rect x="${gx - 30}" y="${yB + 34}" width="60" height="40" rx="10" fill="none" stroke="${C.green}" stroke-width="3.5"/></g>`
      + `<g class="p3" ${delay(1)}>${pill(gx - 50, 326, 100, '통분', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/3/통분', svg(id, body, motion(id)));
  })();

  // 공통분모: 2분의 1과 3분의 1 → 2의 배수·3의 배수에 함께 있는 6 → 6분의 3, 6분의 2 로 통분, 같아진 6 이 공통분모
  (function () {
    const id = 't51-m3-gongtong', S = 46, yA = 104, yB = 236, fx = 80;
    const cols = [2, 3, 4, 6], cx = (v) => 214 + cols.indexOf(v) * 52;
    const chip = (v, y, color, fill, cls, d) => `<g class="${cls}" ${delay(d)}><circle cx="${cx(v)}" cy="${y}" r="21" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(cx(v), y + 8, v, { size: 22 })}</g>`;
    const body = frac(fx, yA, 1, 2, { size: S, dc: C.blue }) + frac(fx, yB, 1, 3, { size: S, dc: C.purple })
      + ring(fx, denMid(yA, S), 28, C.blue, 'r1', .3) + ring(fx, denMid(yB, S), 28, C.purple, 'r1', .5)
      + `<g class="s2" ${delay(1.2)}><rect x="${cx(6) - 28}" y="${yA - 2}" width="56" height="${yB - yA + 40}" rx="16" fill="${C.yellow}" fill-opacity=".45" stroke="${C.orange}" stroke-width="3"/></g>`
      + [2, 4, 6].map((v, i) => chip(v, yA + 26, C.blue, C.sky, 'p2', .2 + i * .2)).join('')
      + [3, 6].map((v, i) => chip(v, yB + 26, C.purple, C.lilac, 'p2', .5 + i * .25)).join('')
      + tag(cx(6) + 50, yA + 34, '…', C.blue, 's2', .8, 24) + tag(cx(6) + 50, yB + 34, '…', C.purple, 's2', .9, 24)
      + `<g class="s3" ${delay(.2)}>${text(440, yA + 12, '=', { size: 40 })}${frac(510, yA, 3, 6, { size: S, dc: C.orange })}</g>`
      + `<g class="s3" ${delay(.5)}>${text(440, yB + 12, '=', { size: 40 })}${frac(510, yB, 2, 6, { size: S, dc: C.orange })}</g>`
      + tag(440, yA - 26, '× 3', C.muted, 's3', .4, 22) + tag(440, yB - 26, '× 2', C.muted, 's3', .7, 22)
      + `<g class="k3" ${delay(1)}><rect x="482" y="${yA + 6}" width="56" height="54" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/><rect x="482" y="${yB + 6}" width="56" height="54" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`
      + `<g class="p3" ${delay(1.4)}>${pill(510, 336, 140, '공통분모', C.orange, C.peach, 24)}</g>`;
    put('5-1/수학/3/공통분모', svg(id, body, motion(id)));
  })();

  // 소수: 1 L 통을 10칸, 9칸 = 10분의 9 = 0.9 → 5칸 가운데 4칸 = 10분의 8 = 0.8 → 점을 찍어 나타낸 수
  (function () {
    const id = 't51-m3-sosu', Y = 40, H = 220, W = 76;
    const cup = (x, n, fill, stroke, k, cls, d) => {
      let s = `<rect x="${x}" y="${Y}" width="${W}" height="${H}" rx="6" fill="white"/>`
        + `<g class="fill ${cls}" ${delay(d)}><rect x="${x}" y="${f(Y + H - k * H / 10)}" width="${W}" height="${f(k * H / 10)}" fill="${fill}" fill-opacity=".45"/></g>`;
      for (let i = 1; i < n; i++) s += `<path d="M${x} ${f(Y + i * H / n)} H${x + W}" stroke="${stroke}" stroke-width="2.5"/>`;
      return s + `<rect x="${x}" y="${Y}" width="${W}" height="${H}" rx="6" fill="none" stroke="${C.ink}" stroke-width="3"/>` + text(x + W / 2, Y - 12, '1 L', { size: 20, color: C.muted });
    };
    const xA = 60, xB = 380;
    const tens = Array.from({ length: 4 }, (_, i) => [1, 3, 5, 7][i]).map((i) => `<path class="draw d2" pathLength="1" ${delay(1 + i * .05)} d="M${xB} ${f(Y + i * H / 10)} H${xB + W}" stroke="${C.blue}" stroke-width="2"/>`).join('');
    const S = 34;
    const body = cup(xA, 10, C.blue, C.blue, 9, 'gr1', .2)
      + `<g class="s2">${cup(xB, 5, C.orange, C.orange, 8, 'gr2', .2)}</g>` + tens
      + `<g class="s1" ${delay(1)}>${frac(220, 82, 9, 10, { size: S })}${text(220, 158, '=', { size: 30, color: C.muted })}${text(220, 204, '0.9', { size: 48, color: C.blue })}</g>`
      + `<g class="s2" ${delay(.5)}>${frac(512, 82, 4, 5, { size: S })}</g>`
      + `<g class="s2" ${delay(1.3)}>${text(566, 100, '=', { size: 30, color: C.muted })}${frac(604, 82, 8, 10, { size: 26 })}${text(512, 158, '=', { size: 30, color: C.muted })}${text(512, 204, '0.8', { size: 48, color: C.orange })}</g>`
      + `<g class="k3" ${delay(.2)}><circle cx="220" cy="199" r="8" fill="none" stroke="${C.red}" stroke-width="2.5"/><circle cx="512" cy="199" r="8" fill="none" stroke="${C.red}" stroke-width="2.5"/></g>`
      + `<g class="p3" ${delay(.8)}>${pill(220, 256, 90, '소수', C.green, C.mint, 24)}</g>`
      + `<g class="p3" ${delay(1)}>${pill(512, 256, 90, '소수', C.green, C.mint, 24)}</g>`
      + `<g class="s3" ${delay(1.3)}>${text(366, 330, '0.9 &gt; 0.8', { size: 30 })}</g>`;
    put('5-1/수학/3/소수', svg(id, body, motion(id) + `
      .sc-${id} .fill { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out; }
      .on1 .sc-${id} .gr1, .on2 .sc-${id} .gr2 { transform: scaleY(1); }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
