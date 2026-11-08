// 수학 6-1 1단원 분수의 나눗셈: 낱말 도식
// 교과서 방법을 따른다: (자연수)÷(자연수)는 하나씩 똑같이 나누어 몫을 분수로, (분수)÷(자연수)는 분자를 나누거나
// 「3등분한 것 중의 1」= ×(1/3) 로, 대분수는 가분수로 바꾸어 계산한다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const numberLine = (...a) => { const r = root.FigureKit.numberLine(...a); r.body = r.body.replace(/font-size="17"/g, 'font-size="19"'); return r; };
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기, fN 날아오기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 25% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .9s ease-in-out both; }`;
    return css;
  };
  // 칸이 열리면 제자리에서 (dx, dy) 로 옮겨 가는 조각
  const moveCss = (id, n, cls, dur = .9, wait = 0) => `
    .sc-${id} .${cls} { transition: transform ${dur}s ease-in-out ${wait}s; }
    .on${n} .sc-${id} .${cls} { transform: translate(var(--dx), var(--dy)); }`;

  // 세로 분수: 가운데 가로줄의 높이가 cy
  function frac(x, cy, n, d, { size = 32, color = C.ink, nc = color, dc = color } = {}) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.58 + 12;
    return `<text x="${f(x)}" y="${f(cy - size * 0.24)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${nc}">${n}</text>`
      + `<path d="M${f(x - w / 2)} ${f(cy)} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + `<text x="${f(x)}" y="${f(cy + size * 0.98)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${dc}">${d}</text>`;
  }
  const fracW = (n, d, size) => Math.max(String(n).length, String(d).length) * size * 0.58 + 12;
  const numMid = (cy, size) => cy - size * 0.6;
  const denMid = (cy, size) => cy + size * 0.62;

  // 식 한 줄: 토막은 글자('÷'), 분수 {fr:[n,d]}, 대분수 {mx:[w,n,d]}. cy 는 분수 가로줄 높이(글자는 그 높이에 가운데).
  // 돌려주는 xs·ws 로 고리·화살표 자리를 잡는다.
  const charW = (ch) => /[0-9]/.test(ch) ? .58 : ch === '…' ? 1 : /[÷=×<>+]/.test(ch) ? .72 : .6;
  function expr(cx, cy, toks, size, fs = size * .78) {
    const items = toks.map((t) => (typeof t === 'string' || typeof t === 'number' ? { t: String(t) } : t));
    const wOf = (it) => it.fr ? fracW(...it.fr, fs) : it.mx ? String(it.mx[0]).length * size * .58 + 4 + fracW(it.mx[1], it.mx[2], fs) : [...it.t].reduce((s, ch) => s + charW(ch) * size, 0);
    const ws = items.map(wOf), gap = size * .32;
    const total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = cx - total / 2;
    const xs = [];
    const body = items.map((it, i) => {
      const c = x + ws[i] / 2; xs.push(c);
      let s;
      if (it.fr) s = frac(c, cy, ...it.fr, { size: fs, color: it.color || C.ink });
      else if (it.mx) {
        const ww = String(it.mx[0]).length * size * .58;
        s = text(f(x + ww / 2), f(cy + size * .36), it.mx[0], { size, color: it.color || C.ink }) + frac(x + ww + 4 + fracW(it.mx[1], it.mx[2], fs) / 2, cy, it.mx[1], it.mx[2], { size: fs, color: it.color || C.ink });
      } else s = text(f(c), f(cy + size * .36), it.t, { size, color: it.color || C.ink });
      x += ws[i] + gap;
      return it.cls ? `<g class="${it.cls}" ${delay(it.d || 0, it.more || '')}>${s}</g>` : s;
    }).join('');
    return { body, xs, ws };
  }
  const cells = (x, y, w, h, n, sw = 2.5) => {
    let s = '';
    for (let k = 1; k < n; k++) s += `<path d="M${f(x + k * w / n)} ${y} V${y + h}" stroke="${C.ink}" stroke-width="${sw}"/>`;
    return s + `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  };
  const box = (x, y, w, h, fill, extra = '') => `<rect ${extra} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"/>`;
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;

  // 자연수: 구슬을 하나씩 세며 1, 2, 3, 4, 5 → 수직선에서 1씩 커지며 이어짐 → 7 ÷ 2 의 두 수
  (function () {
    const id = 't61-m1-jayeonsu', y = 120;
    const xs = [70, 150, 230, 310, 390];
    const balls = xs.map((x, i) => `<g class="p1" ${delay(.2 + i * .3)}><circle cx="${x}" cy="${y}" r="26" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<circle cx="${x - 8}" cy="${y - 9}" r="6" fill="white" opacity=".8"/></g>`
      + tag(x, y - 42, i + 1, C.orange, 'p1', .35 + i * .3, 26)).join('');
    const nl = numberLine(0, 8, { y: 262, x0: 50, x1: 530 });
    const dots = [1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => `<g class="p2" ${delay(.2 + i * .15)}><circle cx="${f(nl.at(n))}" cy="262" r="9" fill="${C.orange}" stroke="white" stroke-width="2"/></g>`).join('');
    const E = expr(540, 110, [{ t: '7', color: C.orange }, '÷', { t: '2', color: C.orange }], 48);
    const body = balls
      + `<g class="s2" ${delay(.1)}>${nl.body}</g>` + dots
      + `<g class="s2" ${delay(1.5)}>${text(598, 270, '…', { size: 30, color: C.orange })}</g>`
      + `<g class="k3">${dots.replace(/class="p2"/g, '')}</g>`
      + `<g class="s3" ${delay(.2)}>${E.body}</g>`
      + ring(E.xs[0], 104, 24, C.orange, 'r3', .6) + ring(E.xs[2], 104, 24, C.orange, 'r3', .6)
      + tag(540, 176, '자연수', C.green, 'p3', 1, 26);
    put('6-1/수학/1/자연수', svg(id, body, motion(id)));
  })();

  // 몫: 떡 3개를 4조각씩 → 한 명 몫은 조각마다 하나씩 3조각 → 3 ÷ 4 = 4분의 3
  (function () {
    const id = 't61-m1-mok', y = 50, s = 100, q = 25, xs = [50, 170, 290], T = [470, y];
    const fills = [C.peach, C.sky, C.mint, C.lilac];
    let pieces = '', moving = '';
    xs.forEach((x, i) => {
      for (let k = 1; k < 4; k++) pieces += box(x + k * q, y, q, s, fills[k], `class="s1" ${delay(.9 + k * .15)}`);
      moving += `<g class="mv" style="--dx:${T[0] + i * q - x}px;--dy:0px">${box(x, y, q, s, C.peach)}</g>`;
    });
    const cuts = xs.map((x) => [1, 2, 3].map((k) => `<path class="draw d1" pathLength="1" ${delay(.2 + k * .15)} d="M${x + k * q} ${y} V${y + s}" stroke="${C.ink}" stroke-width="2.5"/>`).join('')).join('');
    const E = expr(300, 300, ['3', '÷', '4', '=', { fr: [3, 4], color: C.orange }], 40, 34);
    const body = xs.map((x) => box(x, y, s, s, 'white')).join('')
      + `<g class="s1" ${delay(.9)}>${moving}</g>` + pieces
      + xs.map((x) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="none" stroke="${C.ink}" stroke-width="3"/>`).join('') + cuts
      + `<g class="s2"><rect x="${T[0]}" y="${y}" width="${s}" height="${s}" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`
      + [1, 2, 3].map((k) => `<path d="M${T[0] + k * q} ${y} V${y + s}" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="5 5"/>`).join('') + '</g>'
      + `<g class="s2" ${delay(1)}>${[0, 1, 2].map((i) => `<rect x="${T[0] + i * q}" y="${y}" width="${q}" height="${s}" fill="none" stroke="${C.orange}" stroke-width="3"/>`).join('')}</g>`
      + [0, 1, 2].map((i) => tag(T[0] + i * q + q / 2, y + s + 30, i + 1, C.orange, 'p2', 1 + i * .2, 22)).join('')
      + `<g class="s2" ${delay(1.6)}>${frac(T[0] + s / 2, 222, 3, 4, { size: 30, color: C.orange })}</g>`
      + `<g class="s3" ${delay(.2)}>${E.body}</g>`
      + ring(E.xs[4], 300, 30, C.orange, 'r3', .8)
      + `<g class="s3" ${delay(1)}>${arrow(E.xs[4] + 96, 300, E.xs[4] + 34, 300, C.orange)}${text(E.xs[4] + 124, 310, '몫', { size: 28, color: C.orange })}</g>`;
    put('6-1/수학/1/몫', svg(id, body, motion(id) + moveCss(id, 2, 'mv', 1)));
  })();

  // 나머지: 종이 4장을 3명이 1장씩 → 1장이 남음(4 ÷ 3 = 1 … 1) → 남은 1장을 3조각으로 나누어 1과 3분의 1장씩
  (function () {
    const id = 't61-m1-namuji', y0 = 40, w = 64, h = 84, top = [40, 120, 200, 280], trays = [40, 240, 440], ty = 208;
    const sheet = (x, y, fill = C.sky) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${C.blue}" stroke-width="3"/>`;
    const moving = [0, 1, 2].map((i) => `<g class="mv" style="--dx:${trays[i] + 20 - top[i]}px;--dy:${ty - y0}px">${sheet(top[i], y0)}</g>`).join('');
    const sw = w / 3;
    const strips = [0, 1, 2].map((j) => `<g class="mv3" style="--dx:${f(trays[j] + 20 + w + 14 - (top[3] + j * sw))}px;--dy:${ty - y0}px">`
      + `<rect x="${f(top[3] + j * sw)}" y="${y0}" width="${f(sw)}" height="${h}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g>`).join('');
    const E = expr(492, 84, ['4', '÷', '3', '=', '1', '…', { t: '1', color: C.orange }], 34);
    const E2 = expr(492, 150, ['4', '÷', '3', '=', { mx: [1, 1, 3], color: C.green }], 34, 26);
    const body = trays.map((x) => `<rect x="${x}" y="${ty - 14}" width="170" height="${h + 28}" rx="12" fill="${C.mint}" fill-opacity=".55" stroke="${C.line}" stroke-width="2.5"/>`).join('')
      + moving
      + `<g class="h3">${sheet(top[3], y0, C.peach)}</g>`
      + `<g class="b3">${strips}</g>`
      + `<g class="cutl">${[1, 2].map((k) => `<path d="M${f(top[3] + k * sw)} ${y0 - 8} V${y0 + h + 8}" stroke="${C.red}" stroke-width="3.5" stroke-dasharray="6 5"/>`).join('')}</g>`
      + `<g class="s1" ${delay(1.1)}>${E.body}</g>`
      + `<g class="h3"><g class="s1" ${delay(1)}><rect x="${top[3] - 6}" y="${y0 - 6}" width="${w + 12}" height="${h + 12}" rx="8" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-dasharray="8 6"/></g>`
      + tag(top[3] + w / 2, y0 + h + 34, '나머지', C.orange, 'p2', .2, 24) + '</g>'
      + `<g class="k2" ${delay(.2)}><circle cx="${f(E.xs[6])}" cy="84" r="22" fill="none" stroke="${C.orange}" stroke-width="3.5"/></g>`
      + ring(E.xs[6], 84, 22, C.orange, 'r2', .6)
      + `<g class="s3" ${delay(1.2)}>${E2.body}</g>`
      + ring(E2.xs[4] + 8, 150, 30, C.green, 'r3', 1.6)
      + trays.map((x, i) => tag(x + 150, ty + h + 2, i + 1, C.muted, '', 0, 18, 'end')).join('');
    put('6-1/수학/1/나머지', svg(id, body, motion(id) + moveCss(id, 1, 'mv', .8, .2) + moveCss(id, 3, 'mv3', .9, .5) + `
      .sc-${id} .cutl { opacity: 0; }
      .on3 .sc-${id} .cutl { animation: ${id}-cut .9s ease both; }
      @keyframes ${id}-cut { 0% { opacity: 0; } 20%, 60% { opacity: 1; } 100% { opacity: 0; } }`));
  })();

  // 등분: 네모의 5분의 4 → 가로선 2개로 똑같이 3부분(3등분) → 한 부분은 15칸 중 4칸: 4/5 ÷ 3 = 4/15
  (function () {
    const id = 't61-m1-deungbun', x = 80, y = 60, cw = 60, rh = 70, W = 300, H = 210;
    const colFill = [0, 1, 2, 3].map((k) => box(x + k * cw, y, cw, H, C.peach, `class="s1" ${delay(.2 + k * .25)}`)).join('');
    const rows = [1, 2].map((k) => `<path class="draw d2" pathLength="1" ${delay(.2 + k * .3)} d="M${x - 14} ${y + k * rh} H${x + W + 14}" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`).join('');
    const rowNo = [0, 1, 2].map((k) => tag(x - 34, y + k * rh + rh / 2 + 9, k + 1, C.blue, 'p2', .9 + k * .2, 24)).join('');
    const pick = [0, 1, 2, 3].map((k) => tag(x + k * cw + cw / 2, y + rh / 2 + 9, k + 1, C.orange, 'p3', .4 + k * .2, 24)).join('');
    const E1 = expr(520, 116, [{ fr: [4, 5] }, { t: '÷', cls: 's2', d: .9 }, { t: '3', cls: 's2', d: .9, color: C.blue }], 40, 36);
    const body = box(x, y, W, H, 'white') + colFill
      + `<g class="s3" ${delay(.1)}>${box(x, y + rh, 4 * cw, 2 * rh, 'white', 'fill-opacity=".55"')}</g>`
      + cells(x, y, W, H, 5) + rows
      + `<g class="s3" ${delay(.1)}>${[1, 2, 3].map((k) => `<path d="M${x + k * cw} ${y} V${y + H}" stroke="${C.ink}" stroke-width="2.5"/>`).join('')}</g>`
      + rowNo
      + `<g class="s1" ${delay(1.2)}>${E1.body}</g>`
      + `<g class="s2" ${delay(1.2)}>${text(520, 196, '3등분', { size: 26, color: C.blue })}</g>`
      + `<g class="k3" ${delay(.1)}><rect x="${x - 2}" y="${y - 2}" width="${4 * cw + 4}" height="${rh + 4}" fill="none" stroke="${C.orange}" stroke-width="6"/></g>`
      + pick
      + `<g class="s3" ${delay(1.2)}>${text(470, 272, '=', { size: 40 })}${frac(530, 260, 4, 15, { size: 36, nc: C.orange, dc: C.ink })}</g>`
      + ring(530, numMid(260, 36), 24, C.orange, 'r3', 1.6);
    put('6-1/수학/1/등분', svg(id, body, motion(id)));
  })();

  // 진분수: 5칸 가운데 4칸(4 < 5, 1에 못 미침) → 두 병에 2칸씩: 4/5 ÷ 2 = (4÷2)/5 = 2/5 → 분자 < 분모
  (function () {
    const id = 't61-m1-jin', x = 70, yA = 64, yB = 186, w = 400, h = 56, cw = 80;
    const stay = [0, 1].map((k) => box(x + k * cw, yA, cw, h, C.peach, `class="s1" ${delay(.2 + k * .3)}`)).join('');
    const go = [2, 3].map((k) => `<g class="s1" ${delay(.2 + k * .3)}><g class="mv" style="--dx:${-2 * cw}px;--dy:${yB - yA}px">${box(x + k * cw, yA, cw, h, C.peach)}</g></g>`).join('');
    const E = expr(262, 300, [{ fr: [4, 5] }, '÷', '2', '=', { fr: ['4÷2', 5] }, '=', { fr: [2, 5], color: C.orange }], 36, 30);
    const body = box(x, yA, w, h, 'white') + `<g class="s2">${box(x, yB, w, h, 'white')}</g>` + stay + go
      + cells(x, yA, w, h, 5) + `<g class="s2">${cells(x, yB, w, h, 5)}</g>`
      + `<path class="draw d1" pathLength="1" ${delay(1.2)} d="M${x + w} ${yA - 20} V${yB + h + 16}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"/>`
      + `<g class="s1" ${delay(1.2)}>${text(x + w, yA - 28, '1', { size: 24, color: C.blue })}</g>`
      + `<g class="h2"><g class="k1" ${delay(1.4)}><rect x="${x + 4 * cw + 3}" y="${yA + 3}" width="${cw - 6}" height="${h - 6}" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="8 5"/></g>`
      + `<g class="s1" ${delay(1)}>${frac(550, 84, 4, 5, { size: 36, nc: C.orange, dc: C.blue })}<text x="550" y="172" text-anchor="middle" font-size="30" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">4</tspan> &lt; <tspan fill="${C.blue}">5</tspan></text></g></g>`
      + `<g class="s2" ${delay(1)}>${frac(550, 86, 2, 5, { size: 32, nc: C.orange, dc: C.blue })}${frac(550, 208, 2, 5, { size: 32, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s2" ${delay(1.3)}>${E.body}</g>`
      + ring(E.xs[0], 300, 32, C.orange, 'r3', .2) + ring(E.xs[6], 300, 32, C.orange, 'r3', .2)
      + `<g class="s3" ${delay(.6)}><rect x="476" y="282" width="148" height="40" rx="20" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>${text(550, 309, '분자 &lt; 분모', { size: 22, color: C.orange })}</g>`;
    put('6-1/수학/1/진분수', svg(id, body, motion(id) + moveCss(id, 2, 'mv', 1, .2)));
  })();

  // 가분수: 1과 3분의 2 → 통째 막대를 3칸으로 잘라 세면 3분의 5(5 > 3) → 5/3 ÷ 3: 칸마다 3등분, 윗줄 5조각 = 9분의 5
  (function () {
    const id = 't61-m1-ga', y = 64, h = 90, cw = 60, xA = 60, xB = 270, W = 180;
    const nums = [0, 1, 2, 3, 4].map((i) => { const cx = (i < 3 ? xA : xB - 3 * cw) + i * cw + cw / 2; return `<g class="h3">${tag(cx, y + h / 2 + 9, i + 1, C.orange, 'p2', .7 + i * .18, 26)}</g>`; }).join('');
    const nums3 = [0, 1, 2, 3, 4].map((i) => { const cx = (i < 3 ? xA : xB - 3 * cw) + i * cw + cw / 2; return tag(cx, y + 23, i + 1, C.orange, 'p3', .7 + i * .15, 20); }).join('');
    const hl = (x) => `<path class="draw d3" pathLength="1" ${delay(.2)} d="M${x} ${y + 30} H${x + W}" stroke="${C.blue}" stroke-width="3"/><path class="draw d3" pathLength="1" ${delay(.35)} d="M${x} ${y + 60} H${x + W}" stroke="${C.blue}" stroke-width="3"/>`;
    const E = expr(320, 300, [{ fr: [5, 3], color: C.orange }, '÷', '3', '=', { fr: [5, 3] }, '×', { fr: [1, 3] }, '=', { fr: [5, 9], color: C.green }], 36, 30);
    const body = box(xA, y, W, h, C.peach) + box(xB, y, W, h, 'white') + box(xB, y, 2 * cw, h, C.peach)
      + `<rect x="${xA}" y="${y}" width="${W}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + [1, 2].map((k) => `<path class="draw d2" pathLength="1" ${delay(.2 + k * .2)} d="M${xA + k * cw} ${y} V${y + h}" stroke="${C.ink}" stroke-width="2.5"/>`).join('')
      + cells(xB, y, W, h, 3)
      + hl(xA) + hl(xB)
      + `<g class="s3" ${delay(.6)}>${box(xA, y + 30, W, 60, 'white', 'fill-opacity=".5"')}${box(xB, y + 30, 2 * cw, 60, 'white', 'fill-opacity=".5"')}</g>`
      + nums + nums3
      + `<g class="h2"><g class="s1" ${delay(.5)}>${expr(540, 110, [{ mx: [1, 2, 3] }], 54, 40).body}</g></g>`
      + `<g class="s2" ${delay(1.4)}>${frac(540, 100, 5, 3, { size: 46, nc: C.orange, dc: C.blue })}<text x="540" y="214" text-anchor="middle" font-size="30" font-weight="700" fill="${C.ink}"><tspan fill="${C.orange}">5</tspan> &gt; <tspan fill="${C.blue}">3</tspan></text></g>`
      + `<g class="s3" ${delay(1.2)}>${E.body}</g>`
      + ring(E.xs[8], 300, 30, C.green, 'r3', 1.8)
      + `<g class="s4">${[0, 4].map((i) => `<rect x="${f(E.xs[i] - 21)}" y="262" width="42" height="76" rx="8" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`).join('')}</g>`
      + `<g class="k4" ${delay(.3)}><rect x="498" y="40" width="84" height="120" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    put('6-1/수학/1/가분수', svg(id, body, motion(id)));
  })();

  // 대분수: 통째 막대 3개와 2분의 1 → 3과 2분의 1 → 2분의 1씩 세면 7: 3 1/2 ÷ 2 = 7/2 × 1/2 = 7/4 = 1 3/4
  (function () {
    const id = 't61-m1-dae', y = 54, h = 56, w = 112, xs = [40, 166, 292], xh = 430;
    const whole = xs.map((x, i) => `<g class="p1" ${delay(.1 + i * .3)}>${box(x, y, w, h, C.peach)}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${C.orange}" stroke-width="3.5"/></g>`).join('');
    const half = `<g class="p1" ${delay(1)}>${box(xh, y, w, h, 'white')}${box(xh, y, w / 2, h, C.peach)}${cells(xh, y, w, h, 2)}</g>`;
    const brace = (x1, x2, yy, color) => { const m = (x1 + x2) / 2; return `<path d="M${x1} ${yy} Q${x1} ${yy + 12} ${x1 + 12} ${yy + 12} H${m - 10} Q${m} ${yy + 12} ${m} ${yy + 24} Q${m} ${yy + 12} ${m + 10} ${yy + 12} H${x2 - 12} Q${x2} ${yy + 12} ${x2} ${yy}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`; };
    const halves = xs.map((x) => `<path class="draw d3" pathLength="1" ${delay(.2)} d="M${x + w / 2} ${y} V${y + h}" stroke="${C.orange}" stroke-width="2.5"/>`).join('');
    const count = [...xs.flatMap((x) => [x + w / 4, x + 3 * w / 4]), xh + w / 4].map((cx, i) => tag(cx, y + 37, i + 1, C.ink, 'p3', .5 + i * .15, 22)).join('');
    const big3 = [f((xs[0] + xs[2] + w) / 2), 190];
    const E0 = expr(320, 296, [{ mx: [3, 1, 2] }, '÷', '2', '=', { fr: [7, 2] }, '×', { fr: [1, 2] }, '=', { fr: [7, 4] }, '=', { mx: [1, 3, 4] }], 34, 28);
    const M3 = [E0.xs[0] - E0.ws[0] / 2 + 10, 296];
    const rest = (i) => ({ cls: 's3', d: .5 + i * .12 });
    const E = expr(320, 296, [{ mx: [3, 1, 2], color: C.green, cls: 'f2', d: .2, more: `--dx:${f(big3[0] - M3[0])}px;--dy:${f(big3[1] - 14 - M3[1])}px` },
      { t: '÷', ...rest(0) }, { t: '2', ...rest(1) }, { t: '=', ...rest(2) }, { fr: [7, 2], ...rest(3) }, { t: '×', ...rest(4) }, { fr: [1, 2], ...rest(5) },
      { t: '=', ...rest(6) }, { fr: [7, 4], ...rest(7) }, { t: '=', ...rest(8) }, { mx: [1, 3, 4], color: C.green, ...rest(9) }], 34, 28);
    const body = whole + half
      + `<g class="s1" ${delay(1.4)}>${brace(xs[0], xs[2] + w, y + h + 10, C.orange)}${text(big3[0], big3[1], 3, { size: 40, color: C.orange })}${frac(xh + w / 2, 168, 1, 2, { size: 30, color: C.orange })}</g>`
      + `<g class="s1" ${delay(1.4)}>${text(f((xs[2] + w + xh) / 2), 186, '+', { size: 36, color: C.muted })}</g>`
      + halves + count + E.body
      + `<g class="s4">${[0, 10].map((i) => `<rect x="${f(E.xs[i] - E.ws[i] / 2 - 7)}" y="258" width="${f(E.ws[i] + 14)}" height="74" rx="10" fill="none" stroke="${C.green}" stroke-width="3.5"/>`).join('')}</g>`
      + `<g class="s4" ${delay(.6)}>${text(E.xs[0], 354, '대분수', { size: 20, color: C.green })}${text(E.xs[10], 354, '대분수', { size: 20, color: C.green })}</g>`;
    put('6-1/수학/1/대분수', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
