// 수학 6-2 1단원 분수의 나눗셈: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  // 수직선 눈금 수는 19px 로(kit 기본 17px)
  const numberLine = (...a) => { const r = root.FigureKit.numberLine(...a); r.body = r.body.replace(/font-size="17"/g, 'font-size="19"'); return r; };
  const f = (n) => +n.toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기, iN 왼쪽에서 밀려 들어오기, fN 날아오기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.i1,.i2,.i3,.i4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-in { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 25% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .i${n} { animation: ${id}-in .7s ease-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .8s ease-in-out both; }`;
    return css;
  };

  // 세로 분수: 가운데 가로줄의 높이가 cy
  function frac(x, cy, n, d, { size = 32, color = C.ink, nc = color, dc = color, ncls = '', dcls = '', nst = '', dst = '' } = {}) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.58 + 12;
    return `<text class="${ncls}" ${nst} x="${f(x)}" y="${f(cy - size * 0.24)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${nc}">${n}</text>`
      + `<path d="M${f(x - w / 2)} ${cy} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + `<text class="${dcls}" ${dst} x="${f(x)}" y="${f(cy + size * 0.98)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${dc}">${d}</text>`;
  }
  // 분수의 분자·분모 글자 가운데 높이
  const numMid = (cy, size) => cy - size * 0.24 - size * 0.36;
  const denMid = (cy, size) => cy + size * 0.98 - size * 0.36;

  // 원 조각(12시부터 시계 방향)
  const pt = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
  function sector(cx, cy, r, n, k) {
    const a0 = -90 + 360 * k / n, a1 = a0 + 360 / n;
    const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
    return `M${cx} ${cy} L${f(x0)} ${f(y0)} A${r} ${r} 0 ${360 / n > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)} Z`;
  }
  const mid = (cx, cy, r, n, k) => pt(cx, cy, r * 0.62, -90 + 360 * (k + 0.5) / n);
  const cutLines = (cx, cy, r, n, cls = '', step = 0) => Array.from({ length: n }, (_, k) => {
    const [x, y] = pt(cx, cy, r, -90 + 360 * k / n);
    return `<path class="${cls}" ${cls ? `pathLength="1" ${delay(k * step)}` : ''} d="M${cx} ${cy} L${f(x)} ${f(y)}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
  }).join('');
  // 칸 막대: 테두리와 나눔선
  const cells = (x, y, w, h, n, sw = 2.5) => {
    let s = '';
    for (let k = 1; k < n; k++) s += `<path d="M${f(x + k * w / n)} ${y} V${y + h}" stroke="${C.ink}" stroke-width="${sw}"/>`;
    return s + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  };
  const box = (x, y, w, h, fill, extra = '') => `<rect ${extra} x="${f(x)}" y="${y}" width="${f(w)}" height="${h}" fill="${fill}"/>`;
  const label = (x, y, s, color, cls, d, size = 26) => `<g class="${cls}" ${delay(d)}>${text(x, y, s, { size, color })}</g>`;

  // 분모: 원을 8조각으로 자르고 세어 가로선 아래에 8
  (function () {
    const id = 't62-m1-bunmo', A = [200, 182], r = 125, F = [450, 166], S = 64;
    const nums = Array.from({ length: 8 }, (_, k) => { const [x, y] = mid(...A, r, 8, k); return `<g class="p2" ${delay(.2 + k * .17)}>${text(f(x), f(y + 8), k + 1, { size: 24 })}</g>`; }).join('');
    const dy = denMid(F[1], S);
    const body = `<circle cx="${A[0]}" cy="${A[1]}" r="${r}" fill="white"/>`
      + `<path class="s3" d="${sector(...A, r, 8, 0)}" fill="${C.peach}"/>`
      + cutLines(...A, r, 8, 'draw d1', .16)
      + `<circle cx="${A[0]}" cy="${A[1]}" r="${r}" fill="none" stroke="${C.ink}" stroke-width="3.5"/>`
      + nums
      + `<g class="s2" ${delay(1.6)}>${frac(F[0], F[1], '', 8, { size: S, dc: C.orange })}</g>`
      + `<g class="s3" ${delay(.3)}>${text(F[0], f(F[1] - S * 0.24), 1, { size: S, color: C.muted })}</g>`
      + `<circle class="ring r3" ${delay(.6)} cx="${F[0]}" cy="${f(dy)}" r="34" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + `<g class="s3" ${delay(.8)}>${arrow(560, f(dy), 494, f(dy), C.orange)}${text(588, f(dy + 9), '분모', { size: 26, color: C.orange, anchor: 'middle' })}</g>`;
    put('6-2/수학/1/분모', svg(id, body, motion(id)));
  })();

  // 분자: 6조각 가운데 5조각을 칠하고 세어 가로선 위에 5
  (function () {
    const id = 't62-m1-bunja', A = [200, 182], r = 125, F = [450, 166], S = 64;
    const fills = [0, 1, 2, 3, 4].map((k) => `<path class="s2" ${delay(.2 + k * .32)} d="${sector(...A, r, 6, k)}" fill="${C.peach}"/>`).join('');
    const nums = [0, 1, 2, 3, 4].map((k) => { const [x, y] = mid(...A, r, 6, k); return `<g class="p2" ${delay(.35 + k * .32)}>${text(f(x), f(y + 8), k + 1, { size: 24 })}</g>`; }).join('');
    const ny = numMid(F[1], S);
    const body = `<circle cx="${A[0]}" cy="${A[1]}" r="${r}" fill="white"/>` + fills
      + cutLines(...A, r, 6, 'draw d1', .16)
      + `<circle cx="${A[0]}" cy="${A[1]}" r="${r}" fill="none" stroke="${C.ink}" stroke-width="3.5"/>`
      + nums
      + `<g class="s1" ${delay(1)}>${frac(F[0], F[1], '', 6, { size: S, dc: C.muted })}</g>`
      + `<g class="h3"><g class="s1" ${delay(1)}><rect x="${F[0] - 25}" y="${f(ny - 30)}" width="50" height="60" rx="6" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="7 6"/></g></g>`
      + `<g class="p3" ${delay(.2)}>${text(F[0], f(F[1] - S * 0.24), 5, { size: S, color: C.orange })}</g>`
      + `<circle class="ring r3" ${delay(.7)} cx="${F[0]}" cy="${f(ny)}" r="34" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + `<g class="s3" ${delay(.9)}>${arrow(560, f(ny), 494, f(ny), C.orange)}${text(588, f(ny + 9), '분자', { size: 26, color: C.orange })}</g>`;
    put('6-2/수학/1/분자', svg(id, body, motion(id)));
  })();

  // 몫: 3을 4분의 3씩 덜어 내면 4도막 → 3 ÷ 3/4 = 4
  (function () {
    const id = 't62-m1-mok', y = 150, h = 46;
    const nl = numberLine(0, 3, { y: 236, x0: 80, x1: 560 });
    let ticks = '';
    for (let k = 1; k < 12; k++) if (k % 4) ticks += `<path d="M${f(nl.at(k / 4))} 230 V242" stroke="${C.ink}" stroke-width="1.8"/>`;
    const seg = nl.at(0.75) - nl.at(0);
    const segs = [0, 1, 2, 3].map((k) => box(80 + k * seg, y, seg, h, k % 2 ? C.sky : C.peach, `class="s2" ${delay(.2 + k * .42)}`)).join('');
    const nums = [0, 1, 2, 3].map((k) => `<g class="p2" ${delay(.35 + k * .42)}>${text(f(80 + (k + .5) * seg), y + 31, k + 1, { size: 24 })}</g>`).join('');
    const cuts = [1, 2, 3].map((k) => `<path class="s2" ${delay(.3 + k * .42)} d="M${f(80 + k * seg)} ${y - 10} V${y + h + 10}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`).join('');
    const eqY = 322, mY = 308;
    const body = nl.body + ticks
      + box(80, y, 480, h, 'white') + segs
      + `<rect x="80" y="${y}" width="480" height="${h}" fill="none" stroke="${C.ink}" stroke-width="3"/>` + cuts + nums
      + text(560, 136, '3 m', { size: 22, anchor: 'end' })
      + `<g class="h2"><g class="i1" ${delay(.2)}><rect x="80" y="92" width="${f(seg)}" height="32" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>${frac(f(80 + seg + 34), 108, 3, 4, { size: 22, color: C.orange })}${text(f(80 + seg + 54), 116, 'm', { size: 22, color: C.orange, anchor: 'start' })}</g></g>`
      + `<g class="s3" ${delay(.2)}>${text(220, eqY, 3, { size: 40 })}${text(268, eqY, '÷', { size: 40 })}${frac(318, mY, 3, 4, { size: 30 })}${text(368, eqY, '=', { size: 40 })}${text(420, eqY, 4, { size: 40, color: C.orange })}</g>`
      + `<circle class="ring r3" ${delay(.8)} cx="420" cy="${mY}" r="28" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + `<g class="s3" ${delay(1)}>${arrow(520, mY, 452, mY, C.orange)}${text(548, mY + 10, '몫', { size: 28, color: C.orange })}</g>`;
    put('6-2/수학/1/몫', svg(id, body, motion(id)));
  })();

  // 통분: 3분의 1과 4분의 1 → 둘 다 12칸으로 다시 잘라 12분의 4, 12분의 3
  (function () {
    const id = 't62-m1-tongbun', x = 150, w = 360, h = 52, T = 80, B = 196, cw = w / 12;
    let extraT = '', extraB = '';
    for (let k = 1; k < 12; k++) {
      if (k % 4) extraT += `<path class="draw d2" pathLength="1" ${delay(.1 + k * .07)} d="M${f(x + k * cw)} ${T} V${T + h}" stroke="${C.ink}" stroke-width="1.8"/>`;
      if (k % 3) extraB += `<path class="draw d2" pathLength="1" ${delay(.1 + k * .07)} d="M${f(x + k * cw)} ${B} V${B + h}" stroke="${C.ink}" stroke-width="1.8"/>`;
    }
    const nT = [0, 1, 2, 3].map((k) => `<g class="p3" ${delay(.2 + k * .18)}>${text(f(x + (k + .5) * cw), T + 33, k + 1, { size: 19 })}</g>`).join('');
    const nB = [0, 1, 2].map((k) => `<g class="p3" ${delay(.2 + k * .18)}>${text(f(x + (k + .5) * cw), B + 33, k + 1, { size: 19 })}</g>`).join('');
    const dT = denMid(T + 26, 30), dB = denMid(B + 26, 30);
    const body = box(x, T, w, h, 'white') + box(x, B, w, h, 'white')
      + box(x, T, w / 3, h, C.peach, `class="s1" ${delay(.2)}`) + box(x, B, w / 4, h, C.sky, `class="s1" ${delay(.7)}`)
      + extraT + extraB + cells(x, T, w, h, 3, 3) + cells(x, B, w, h, 4, 3)
      + frac(84, T + 26, 1, 3, { size: 32 }) + frac(84, B + 26, 1, 4, { size: 32 })
      + nT + nB
      + `<g class="s3" ${delay(1)}>${text(538, T + 37, '=', { size: 32 })}${frac(588, T + 26, 4, 12, { size: 30, dc: C.green })}`
      + `${text(538, B + 37, '=', { size: 32 })}${frac(588, B + 26, 3, 12, { size: 30, dc: C.green })}</g>`
      + `<circle class="ring r4" ${delay(.2)} cx="588" cy="${f(dT)}" r="22" fill="none" stroke="${C.green}" stroke-width="4"/>`
      + `<circle class="ring r4" ${delay(.2)} cx="588" cy="${f(dB)}" r="22" fill="none" stroke="${C.green}" stroke-width="4"/>`
      + `<rect class="k4" ${delay(.1)} x="${x - 3}" y="${T - 3}" width="${w / 3 + 6}" height="${h + 6}" fill="none" stroke="${C.orange}" stroke-width="6"/>`
      + `<rect class="k4" ${delay(.1)} x="${x - 3}" y="${B - 3}" width="${w / 4 + 6}" height="${h + 6}" fill="none" stroke="${C.blue}" stroke-width="6"/>`;
    put('6-2/수학/1/통분', svg(id, body, motion(id)));
  })();

  // 단위분수: 1을 5도막 → 한 도막 5분의 1 → 1 안에 5번 → 2분의 1, 5분의 1, 7분의 1
  (function () {
    const id = 't62-m1-danwi', x = 110, y = 70, w = 400, h = 50, cw = 80, rowY = 200;
    const cutsMain = [1, 2, 3, 4].map((k) => `<path class="draw d1" pathLength="1" ${delay(k * .25)} d="M${x + k * cw} ${y} V${y + h}" stroke="${C.ink}" stroke-width="2.5"/>`).join('');
    const hopT = 1.7, land = (k) => .3 + hopT * (k * .22);
    const ghosts = [0, 1, 2, 3, 4].map((k) => `<rect class="s3" ${delay(k ? land(k) + .05 : .3)} x="${x + k * cw}" y="${rowY}" width="${cw}" height="${h}" fill="none" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="7 5"/>`).join('');
    const counts = [0, 1, 2, 3, 4].map((k) => `<g class="p3" ${delay(k ? land(k) : .1)}>${text(x + k * cw + cw / 2, rowY - 14, k + 1, { size: 22, color: C.orange })}</g>`).join('');
    const minis = [[2, 40], [5, 240], [7, 440]].map(([n, gx], i) => `<g class="s4" ${delay(.2 + i * .3)}>${frac(gx + 22, 268, 1, n, { size: 28, nc: C.orange })}`
      + `${box(gx + 56, 252, 130, 34, 'white')}${box(gx + 56, 252, 130 / n, 34, C.peach)}${cells(gx + 56, 252, 130, 34, n, 2)}</g>`
      + `<circle class="ring r4" ${delay(.6 + i * .3)} cx="${gx + 22}" cy="${f(numMid(268, 28))}" r="18" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`).join('');
    const hops = [1, 2, 3, 4].map((k) => { const t = k * 22; return `${t - 11}% { transform: translate(${k * cw - cw / 2}px, -34px); } ${t}% { transform: translate(${k * cw}px, 0); }`; }).join(' ');
    const body = box(x, y, w, h, 'white') + box(x, y, cw, h, C.peach, `class="s2" ${delay(.1)}`) + cutsMain
      + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + text(556, y + 36, 1, { size: 32 })
      + `<g class="h4">${ghosts}${counts}<g class="dn"><g class="hop"><rect x="${x}" y="${y}" width="${cw}" height="${h}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/></g></g>`
      + `<g class="s2" ${delay(1)}>${frac(x + cw / 2, 296, 1, 5, { size: 30, nc: C.orange })}</g></g>`
      + minis;
    put('6-2/수학/1/단위분수', svg(id, body, motion(id) + `
      .sc-${id} .dn { opacity: 0; transition: transform .8s ease-in-out .2s, opacity .3s ease .1s; }
      .on2 .sc-${id} .dn { opacity: 1; transform: translateY(${rowY - y}px); }
      .on3 .sc-${id} .hop { animation: ${id}-hop ${hopT}s ease-in-out .3s both; }
      @keyframes ${id}-hop { 0% { transform: none; } ${hops} 100% { transform: translate(${4 * cw}px, 0); } }`));
  })();

  // 진분수: 1을 4칸으로 나눈 막대에서 3칸 → 1에 못 미침 → 3 < 4
  (function () {
    const id = 't62-m1-jin', x = 80, y = 160, w = 320, h = 56, cw = 80;
    const nl = numberLine(0, 1, { y: 262, x0: 80, x1: 400 });
    let ticks = '';
    for (let k = 1; k < 4; k++) ticks += `<path d="M${x + k * cw} 255 V269" stroke="${C.ink}" stroke-width="2"/>`;
    const fills = [0, 1, 2].map((k) => box(x + k * cw, y, cw, h, C.peach, `class="s1" ${delay(.2 + k * .35)}`)).join('');
    const body = nl.body + ticks + box(x, y, w, h, 'white') + fills + cells(x, y, w, h, 4)
      + `<g class="s1" ${delay(1.3)}>${frac(200, 112, 3, 4, { size: 30, nc: C.orange, dc: C.blue })}</g>`
      + `<path class="draw d2" pathLength="1" d="M${x + w} 130 V262" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"/>`
      + `<rect class="k2" ${delay(.4)} x="${x + 3 * cw + 3}" y="${y + 3}" width="${cw - 6}" height="${h - 6}" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="8 5"/>`
      + `<path class="k2" ${delay(.4)} d="M${x + 3 * cw} 262 H${x + w}" stroke="${C.red}" stroke-width="6"/>`
      + `<g class="p2" ${delay(.2)}><circle cx="${x + 3 * cw}" cy="262" r="10" fill="${C.orange}" stroke="white" stroke-width="2"/></g>`
      + `<circle class="ring r2" ${delay(.6)} cx="${x + 3 * cw}" cy="262" r="12" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + `<g class="s3" ${delay(.2)}>${frac(525, 120, 3, 4, { size: 52, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s3" ${delay(.9)}><text x="525" y="262" text-anchor="middle" font-size="36" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">3</tspan> &lt; <tspan fill="${C.blue}">4</tspan></text></g>`;
    put('6-2/수학/1/진분수', svg(id, body, motion(id)));
  })();

  // 대분수: 통째 막대 2개 + 4분의 1 → 2와 4분의 1
  (function () {
    const id = 't62-m1-dae', y = 96, h = 50, w = 150, xs = [65, 240, 415];
    const whole = [0, 1].map((i) => `<g class="i1" ${delay(.1 + i * .4)}>${box(xs[i], y, w, h, C.peach)}<rect x="${xs[i]}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${C.orange}" stroke-width="3.5"/>${text(xs[i] + w / 2, y + 34, 1, { size: 26 })}</g>`).join('');
    const brace = `<path d="M${xs[0]} 166 Q${xs[0]} 180 ${xs[0] + 14} 180 H${f((xs[0] + xs[1] + w) / 2 - 12)} Q${f((xs[0] + xs[1] + w) / 2)} 180 ${f((xs[0] + xs[1] + w) / 2)} 194 Q${f((xs[0] + xs[1] + w) / 2)} 180 ${f((xs[0] + xs[1] + w) / 2 + 12)} 180 H${xs[1] + w - 14} Q${xs[1] + w} 180 ${xs[1] + w} 166" fill="none" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/>`;
    const bx = (xs[0] + xs[1] + w) / 2;
    const fx = xs[2] + w / 2, fcy = 196;
    const M2 = [300, 330], MF = [346, 306];
    const body = whole
      + `<g class="s1" ${delay(1)}>${brace}${text(f(bx), 236, 2, { size: 40, color: C.green })}</g>`
      + `<g class="s2" ${delay(.1)}>${box(xs[2], y, w, h, 'white')}</g>`
      + box(xs[2], y, w / 4, h, C.peach, `class="s2" ${delay(.6)}`)
      + `<g class="s2" ${delay(.1)}>${cells(xs[2], y, w, h, 4)}</g>`
      + `<g class="s2" ${delay(1)}>${frac(fx, fcy, 1, 4, { size: 30, color: C.orange })}</g>`
      + `<g class="f3" ${delay(.2, `--dx:${f(bx - M2[0])}px;--dy:${f(236 - M2[1])}px`)}>${text(M2[0], M2[1], 2, { size: 60, color: C.green })}</g>`
      + `<g class="f3" ${delay(.6, `--dx:${f(fx - MF[0])}px;--dy:${f(fcy - MF[1])}px`)}>${frac(MF[0], MF[1], 1, 4, { size: 34, color: C.orange })}</g>`;
    put('6-2/수학/1/대분수', svg(id, body, motion(id)));
  })();

  // 가분수: 4분의 1 조각 9개를 모음 → 4개면 1, 9개면 4분의 9 → 9 > 4
  (function () {
    const id = 't62-m1-ga', y = 86, h = 50, w = 150, xs = [65, 240, 415], cw = w / 4, home = [600, 330];
    const slots = Array.from({ length: 9 }, (_, i) => [xs[Math.floor(i / 4)] + (i % 4) * cw, i]);
    const pieces = slots.map(([px, i]) => `<g class="f1" ${delay(.1 + i * .17, `--dx:${f(home[0] - px)}px;--dy:${f(home[1] - y)}px`)}>`
      + `${box(px, y, cw, h, C.peach)}${text(f(px + cw / 2), y + 33, i + 1, { size: 19 })}</g>`).join('');
    const body = xs.map((x) => box(x, y, w, h, 'white')).join('') + pieces + xs.map((x) => cells(x, y, w, h, 4)).join('')
      + `<rect class="k2" ${delay(.1)} x="${xs[0] - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="none" stroke="${C.green}" stroke-width="6"/>`
      + `<g class="s2" ${delay(.5)}>${frac(109, 190, 4, 4, { size: 30, nc: C.orange, dc: C.blue })}${text(134, 201, '= 1', { size: 30, anchor: 'start' })}</g>`
      + `<g class="s2" ${delay(1.1)}>${frac(490, 196, 9, 4, { size: 46, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s3" ${delay(.2)}><text x="129" y="292" text-anchor="middle" font-size="32" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">4</tspan> = <tspan fill="${C.blue}">4</tspan></text></g>`
      + `<g class="s3" ${delay(.8)}><text x="490" y="308" text-anchor="middle" font-size="32" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">9</tspan> &gt; <tspan fill="${C.blue}">4</tspan></text></g>`;
    put('6-2/수학/1/가분수', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
