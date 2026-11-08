// 수학 4-2 1단원 소수의 덧셈과 뺄셈: 낱말 도식
// 색 약속: 1 은 파랑, 0.1 은 초록, 0.01 은 주황, 0.001 은 보라. 소수점은 빨간 동그라미로 그려 반짝이게 한다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +n.toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기, iN 밀려 들어오기, fN 날아오기, drN 떨어지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.i1,.i2,.i3,.i4,.f1,.f2,.f3,.f4,.dr1,.dr2,.dr3) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .45s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.6); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-in { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 25% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { 0% { opacity: 0; transform: translateY(-70px); } 60% { opacity: 1; transform: translateY(4px); } 100% { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.4s ease-in-out both; }
    .on${n} .sc-${id} .i${n} { animation: ${id}-in .6s ease-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .8s ease-in-out both; }
    .on${n} .sc-${id} .dr${n} { animation: ${id}-drop .55s ease-out both; }`;
    return css;
  };

  // 세로 분수: 가운데 가로줄의 높이가 cy
  function frac(x, cy, n, d, { size = 32, color = C.ink } = {}) {
    const w = Math.max(String(n).length, String(d).length) * size * 0.58 + 12;
    return text(f(x), f(cy - size * 0.24), n, { size, color })
      + `<path d="M${f(x - w / 2)} ${cy} H${f(x + w / 2)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`
      + text(f(x), f(cy + size * 0.98), d, { size, color });
  }
  // 소수를 글자 하나씩 놓는다. 소수점은 동그라미(반짝이게 할 수 있도록). xs 는 글자마다 가운데 x.
  function decimal(cx, y, str, { size = 60, colors = [], color = C.ink, pc = C.red, pcls = '', pst = '' } = {}) {
    const chars = [...str], adv = (ch) => (ch === '.' ? size * 0.36 : size * 0.6);
    let x = cx - chars.reduce((s, ch) => s + adv(ch), 0) / 2, body = '';
    const xs = [];
    chars.forEach((ch, i) => {
      const mid = x + adv(ch) / 2;
      xs.push(mid);
      body += ch === '.'
        ? `<circle class="${pcls}" ${pst} cx="${f(mid)}" cy="${f(y - size * 0.08)}" r="${f(size * 0.08)}" fill="${pc}"/>`
        : text(f(mid), y, ch, { size, color: colors[i] || color });
      x += adv(ch);
    });
    return { body, xs };
  }
  // 모눈 선: 세로 9줄(굵게), 가로 9줄(가늘게). cls 가 있으면 차례로 그려진다.
  function gridLines(x, y, s, { vcls = '', hcls = '', v0 = 0, h0 = 0, step = .06, color = C.ink, vw = 2.4, hw = 1.3, rows = true } = {}) {
    const c = s / 10;
    let out = '';
    for (let i = 1; i < 10; i++) out += `<path class="${vcls}" ${vcls ? `pathLength="1" ${delay(v0 + i * step)}` : ''} d="M${f(x + i * c)} ${y} V${y + s}" stroke="${color}" stroke-width="${vw}"/>`;
    if (rows) for (let i = 1; i < 10; i++) out += `<path class="${hcls}" ${hcls ? `pathLength="1" ${delay(h0 + i * step)}` : ''} d="M${x} ${f(y + i * c)} H${x + s}" stroke="${color}" stroke-width="${hw}"/>`;
    return out;
  }

  // 소수: 1을 10칸으로 → 100칸으로 → 1이 2개, 0.1이 5개, 0.01이 6개인 2.56
  (function () {
    const id = 't42-m1-sosu', X = 70, Y = 50, S = 230, c = S / 10;
    const k = 150 / S, tx = 400 - X * k, ty = 40 - Y * k;
    const grid = `<rect x="${X}" y="${Y}" width="${S}" height="${S}" fill="white"/>`
      + `<g class="h3"><g class="s1" ${delay(.8)}><rect x="${X}" y="${Y}" width="${c}" height="${S}" fill="${C.mint}"/></g></g>`
      + `<g class="h3"><g class="p2" ${delay(.9)}><rect x="${X}" y="${Y + 9 * c}" width="${c}" height="${c}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g></g>`
      + `<g class="s3" ${delay(1.1)}><rect x="${X}" y="${Y}" width="${5 * c}" height="${S}" fill="${C.mint}"/><rect x="${X + 5 * c}" y="${Y + 4 * c}" width="${c}" height="${6 * c}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g>`
      + gridLines(X, Y, S, { vcls: 'draw d1', hcls: 'draw d2', v0: .05, h0: .05 })
      + `<rect x="${X}" y="${Y}" width="${S}" height="${S}" fill="none" stroke="${C.ink}" stroke-width="3.5"/>`;
    const tenth = decimal(545, 148, '0.1', { size: 46, color: C.green, pc: C.green });
    const hund = decimal(550, 258, '0.01', { size: 46, color: C.orange, pc: C.orange });
    const square = (x, d) => `<g class="p3" ${delay(d)}><rect x="${x}" y="40" width="150" height="150" fill="${C.sky}"/>${gridLines(x, 40, 150, { color: C.blue, vw: 1.2, hw: .8 })}<rect x="${x}" y="40" width="150" height="150" fill="none" stroke="${C.blue}" stroke-width="3"/></g>`;
    const small = decimal(475, 228, '0.56', { size: 28, colors: [C.ink, '', C.green, C.orange] });
    const big = decimal(320, 322, '2.56', { size: 66, colors: [C.blue, '', C.green, C.orange], pcls: 'k3', pst: delay(1.7) });
    const px = big.xs[1];
    const body = `<g class="mv">${grid}</g>`
      + `<g class="h3"><g class="s1">${text(X + S / 2, Y - 12, '1', { size: 26 })}</g></g>`
      + `<g class="h3"><g class="s1" ${delay(1.1)}>${frac(400, 128, 1, 10, { size: 34 })}${text(460, 141, '=', { size: 40 })}${tenth.body}</g></g>`
      + `<g class="h3"><g class="s2" ${delay(1.2)}>${frac(400, 238, 1, 100, { size: 34 })}${text(460, 251, '=', { size: 40 })}${hund.body}</g></g>`
      + square(60, .2) + square(230, .45)
      + `<g class="s3" ${delay(1.3)}>${text(135, 228, '1', { size: 28, color: C.blue })}${text(305, 228, '1', { size: 28, color: C.blue })}${small.body}</g>`
      + `<g class="s3" ${delay(1.5)}>${big.body}</g>`
      + `<circle class="ring r3" ${delay(1.7)} cx="${f(px)}" cy="${f(322 - 66 * 0.08)}" r="12" fill="none" stroke="${C.red}" stroke-width="3"/>`;
    put('4-2/수학/1/소수', svg(id, body, motion(id) + `
      .sc-${id} .mv { transform-box: view-box; transform-origin: 0 0; transition: transform 1s ease-in-out; }
      .on3 .sc-${id} .mv { transform: translate(${f(tx)}px, ${f(ty)}px) scale(${k.toFixed(4)}); }`));
  })();

  // 자리 칸 표: 열 가운데 x 와 칸 그리기
  function placeTable(x0, w, heads, { top = 46, headH = 44, rowH = 104, size = 18 } = {}) {
    const bottom = top + headH + rowH;
    let s = `<rect x="${x0}" y="${top}" width="${w * heads.length}" height="${headH}" fill="${C.mint}"/>`
      + `<rect x="${x0}" y="${top + headH}" width="${w * heads.length}" height="${rowH}" fill="white"/>`;
    heads.forEach((h, i) => { s += text(x0 + w * i + w / 2, top + headH / 2 + 7, h, { size, color: C.green }); });
    for (let i = 1; i < heads.length; i++) s += `<path d="M${x0 + w * i} ${top} V${top + headH}" stroke="${C.line}" stroke-width="2"/><path d="M${x0 + w * i} ${top + headH} V${bottom}" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`;
    s += `<rect x="${x0}" y="${top}" width="${w * heads.length}" height="${bottom - top}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M${x0} ${top + headH} H${x0 + w * heads.length}" stroke="${C.ink}" stroke-width="2"/>`;
    return { body: s, cx: (i) => x0 + w * i + w / 2, bottom };
  }

  // 소수점: 2.56 을 자리 칸에 → 일의 자리와 소수 첫째 자리 사이의 점 → 세로 덧셈에서 소수점끼리 줄 맞추기
  (function () {
    const id = 't42-m1-sosujeom', x0 = 24, w = 136;
    const T = placeTable(x0, w, ['일의 자리', '소수 첫째 자리', '소수 둘째 자리'], { top: 46, headH: 44, rowH: 106 });
    const base = 172, P = [x0 + w, base - 6];
    const digits = ['2', '5', '6'].map((d, i) => `<g class="dr1" ${delay(.2 + i * .25)}>${text(T.cx(i), base, d, { size: 66 })}</g>`).join('');
    const point = `<g class="p2" ${delay(.2)}><circle cx="${P[0]}" cy="${P[1]}" r="12" fill="white"/><circle cx="${P[0]}" cy="${P[1]}" r="8" fill="${C.red}"/></g>`
      + `<circle class="ring r2" ${delay(.5)} cx="${P[0]}" cy="${P[1]}" r="14" fill="none" stroke="${C.red}" stroke-width="3"/>`
      + `<g class="s2" ${delay(.7)}>${arrow(P[0], 262, P[0], 198, C.red)}${text(P[0], 294, '소수점', { size: 26, color: C.red })}</g>`;
    // 세로 덧셈 4.7 + 2.15 = 6.85: 자리마다 같은 x
    const col = { one: 505, pt: 530, t: 555, h: 581 }, S = 42;
    const row = (y, chars, cls, d) => {
      const xs = [col.one, col.pt, col.t, col.h];
      return `<g class="${cls}" ${delay(d)}>` + [...chars].map((ch, i) => (ch === ' ' ? '' : ch === '.'
        ? `<circle cx="${xs[i]}" cy="${f(y - 4)}" r="4.5" fill="${C.red}"/>`
        : text(xs[i], y, ch, { size: S }))).join('') + '</g>';
    };
    const calc = `<g class="s3" ${delay(.9)}><rect x="${col.pt - 12}" y="72" width="24" height="184" rx="10" fill="${C.peach}"/></g>`
      + `<g class="k3" ${delay(1.3)}><rect x="${col.pt - 12}" y="72" width="24" height="184" rx="10" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`
      + row(112, '4.7', 'i3', .1) + `<g class="i3" ${delay(.35)}>${text(464, 168, '+', { size: S })}</g>` + row(168, '2.15', 'i3', .35)
      + `<g class="s3" ${delay(1.5)}><path d="M452 188 H604" stroke="${C.ink}" stroke-width="3"/></g>` + row(242, '6.85', 's3', 1.7);
    const body = T.body + digits + point + calc;
    put('4-2/수학/1/소수점', svg(id, body, motion(id)));
  })();

  // 소수 두 자리 수: 100칸 가운데 37칸 → 0.37, 소수점 오른쪽 숫자 둘 → 2.56, 1.25
  (function () {
    const id = 't42-m1-dujari', X = 40, Y = 54, S = 220, c = S / 10;
    const strips = [0, 1, 2].map((i) => `<g class="s1" ${delay(.15 + i * .3)}><rect x="${X + i * c}" y="${Y}" width="${c}" height="${S}" fill="${C.peach}"/></g>`).join('');
    const cells = Array.from({ length: 7 }, (_, i) => `<g class="p1" ${delay(1 + i * .11)}><rect x="${X + 3 * c}" y="${Y + i * c}" width="${c}" height="${c}" fill="${C.peach}"/></g>`).join('');
    const grid = `<rect x="${X}" y="${Y}" width="${S}" height="${S}" fill="white"/>` + strips + cells
      + gridLines(X, Y, S, { color: C.ink, vw: 1.6, hw: 1 })
      + `<rect x="${X}" y="${Y}" width="${S}" height="${S}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    const n = decimal(462, 160, '0.37', { size: 84, colors: [C.ink, '', C.orange, C.orange], pcls: 'k2', pst: delay(.1) });
    const [a, b] = [n.xs[2] - 28, n.xs[3] + 28];
    const bubble = (x, y, label, d, cls = 'p2') => `<g class="${cls}" ${delay(d)}><circle cx="${f(x)}" cy="${y}" r="17" fill="white" stroke="${C.orange}" stroke-width="3"/>${text(f(x), y + 7, label, { size: 20, color: C.orange })}</g>`;
    const ex = (cx, str, d) => {
      const e = decimal(cx, 306, str, { size: 46, colors: [C.ink, '', C.orange, C.orange] });
      return `<g class="s3" ${delay(d)}>${e.body}<path d="M${f(e.xs[2] - 16)} 320 H${f(e.xs[3] + 16)}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/></g>`;
    };
    const body = grid
      + `<g class="s1" ${delay(1.8)}>${n.body}</g>`
      + `<g class="s2" ${delay(.3)}><path d="M${f(a)} 178 V190 H${f(b)} V178" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/></g>`
      + bubble(n.xs[2], 222, '1', .6) + bubble(n.xs[3], 222, '2', .9)
      + ex(398, '2.56', .2) + ex(548, '1.25', .6);
    put('4-2/수학/1/소수 두 자리 수', svg(id, body, motion(id)));
  })();

  // 소수 세 자리 수: 0.01 한 칸을 늘여 10칸 → 0.001, 0.125 와 3.648 의 소수점 오른쪽 숫자 셋
  (function () {
    const id = 't42-m1-sejari', X = 40, Y = 54, s = 150, c = s / 10, BX = 250, BY = 54, B = 150;
    const small = `<rect x="${X}" y="${Y}" width="${s}" height="${s}" fill="white"/>`
      + `<rect x="${X + 9 * c}" y="${Y}" width="${c}" height="${c}" fill="${C.peach}"/>`
      + gridLines(X, Y, s, { vw: 1.2, hw: .8 })
      + `<rect x="${X}" y="${Y}" width="${s}" height="${s}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + `<rect x="${X + 9 * c}" y="${Y}" width="${c}" height="${c}" fill="none" stroke="${C.orange}" stroke-width="3"/>`;
    const zoom = `<g class="s1" ${delay(.1)}><path d="M${X + s} ${Y} L${BX} ${BY} M${X + s} ${Y + c} L${BX} ${BY + B}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="6 5"/></g>`
      + `<g class="p1" ${delay(.3)}><rect x="${BX}" y="${BY}" width="${B}" height="${B}" fill="${C.peach}"/></g>`
      + `<g class="s1" ${delay(1.3)}><rect x="${BX}" y="${BY}" width="${B / 10}" height="${B}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/></g>`
      + gridLines(BX, BY, B, { vcls: 'draw d1', v0: .5, step: .05, rows: false, vw: 1.8 })
      + `<g class="p1" ${delay(.3)}><rect x="${BX}" y="${BY}" width="${B}" height="${B}" fill="none" stroke="${C.orange}" stroke-width="3.5"/></g>`
      + `<g class="s1" ${delay(.4)}>${text(BX + B / 2, BY - 12, '0.01', { size: 22, color: C.orange })}</g>`;
    const v = decimal(574, 114, '0.001', { size: 32, color: C.purple, pc: C.purple });
    const label = `<g class="s1" ${delay(1.5)}>${frac(448, 100, 1, 1000, { size: 30 })}${text(510, 111, '=', { size: 34 })}${v.body}</g>`;
    const cols = [C.ink, '', C.green, C.orange, C.purple];
    const bubble = (x, y, lab, d) => `<g class="p${d[0]}" ${delay(d[1])}><circle cx="${f(x)}" cy="${y}" r="15" fill="white" stroke="${C.purple}" stroke-width="3"/>${text(f(x), y + 7, lab, { size: 19, color: C.purple })}</g>`;
    const num = (cx, str, beat, d0) => {
      const e = decimal(cx, 290, str, { size: 62, colors: cols, pcls: `k${beat}`, pst: delay(d0 + .3) });
      return `<g class="s${beat}" ${delay(d0)}>${e.body}</g>` + [2, 3, 4].map((i, j) => bubble(e.xs[i], 330, j + 1, [beat, d0 + .6 + j * .25])).join('');
    };
    const body = small + zoom + label + num(190, '0.125', 2, .1) + num(468, '3.648', 3, .1);
    put('4-2/수학/1/소수 세 자리 수', svg(id, body, motion(id)));
  })();

  // 소수 첫째·둘째·셋째 자리: 숫자를 자리 칸에 → 고른 자리를 밝히고 그 숫자만큼 단위 조각이 내려옴 → 나타내는 값
  function placeFig(id, key, str, t, value, color, fill) {
    const x0 = 40, w = 140;
    const T = placeTable(x0, w, ['일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'], { top: 26, headH: 42, rowH: 94 });
    const base = 142, digits = str.replace('.', '').split('');
    const digitEls = digits.map((d, i) => {
      const t0 = text(T.cx(i), base, d, { size: 60, color: i === t ? color : C.ink });
      return `<g class="dr1" ${delay(.2 + i * .22)}>${i === t ? `<g class="k3" ${delay(.1, 'opacity:1')}>${t0}</g>` : t0}</g>`;
    }).join('');
    const point = `<g class="p1" ${delay(.15)}><circle cx="${x0 + w}" cy="${base - 6}" r="7" fill="${C.red}"/></g>`;
    const hi = `<g class="s2"><rect x="${x0 + w * t}" y="26" width="${w}" height="42" fill="${fill}"/>${text(T.cx(t), 26 + 21 + 7, ['', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'][t], { size: 18, color: C.ink })}</g>`
      + `<g class="s2"><rect x="${x0 + w * t + 3}" y="29" width="${w - 6}" height="${T.bottom - 32}" rx="6" fill="none" stroke="${color}" stroke-width="4.5"/></g>`;
    const n = +digits[t], unit = ['', '0.1', '0.01', '0.001'][t], cw = [0, 62, 72, 84][t], gap = 8;
    const total = n * cw + (n - 1) * gap, cx0 = 320 - total / 2, cy = 196;
    const chips = Array.from({ length: n }, (_, i) => {
      const x = cx0 + i * (cw + gap);
      return `<g class="f2" ${delay(.4 + i * .14, `--dx:${f(T.cx(t) - x - cw / 2)}px;--dy:${f(100 - cy)}px`)}><rect x="${f(x)}" y="${cy}" width="${cw}" height="40" rx="8" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(x + cw / 2), cy + 27, unit, { size: 19 })}</g>`;
    }).join('');
    const x1 = cx0, x2 = cx0 + total, m = 320;
    const brace = `<g class="s3" ${delay(.2)}><path d="M${f(x1)} 246 Q${f(x1)} 258 ${f(x1 + 12)} 258 H${m - 12} Q${m} 258 ${m} 270 Q${m} 258 ${m + 12} 258 H${f(x2 - 12)} Q${f(x2)} 258 ${f(x2)} 246" fill="none" stroke="${color}" stroke-width="3"/></g>`;
    const vcol = [...value].map((ch, i) => (i === t + 1 ? color : C.ink));
    const v = decimal(320, 326, value, { size: 50, colors: vcol });
    const body = T.body + hi + digitEls + point + chips + brace + `<g class="p3" ${delay(.5)}>${v.body}</g>`;
    put(`4-2/수학/1/${key}`, svg(id, body, motion(id)));
  }
  placeFig('t42-m1-cheotjjae', '소수 첫째 자리', '2.56', 1, '0.5', C.green, C.mint);
  placeFig('t42-m1-duljjae', '소수 둘째 자리', '1.47', 2, '0.07', C.orange, C.peach);
  placeFig('t42-m1-setjjae', '소수 셋째 자리', '2.574', 3, '0.004', C.purple, C.lilac);
})(typeof window !== 'undefined' ? window : globalThis);
