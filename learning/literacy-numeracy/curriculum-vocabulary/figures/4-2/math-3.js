// 수학 4-2 3단원 규칙 찾기와 식 만들기: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +n.toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.i1,.i2,.i3,.i4,.f1,.f2,.f3,.f4,.dr1,.dr2,.dr3) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring,.u1,.u2,.u3,.u4) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-in { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 25% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { 0% { opacity: 0; transform: translateY(-90px); } 60% { opacity: 1; transform: translateY(4px); } 100% { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.25); } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.4s ease-in-out both; }
    .on${n} .sc-${id} .i${n} { animation: ${id}-in .6s ease-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .8s ease-in-out both; }
    .on${n} .sc-${id} .dr${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .u${n} { animation: ${id}-pulse .7s ease-in-out 2; }`;
    return css;
  };
  // 위로 볼록한 짧은 곡선 화살표(a → b)
  const hop = (x1, y1, x2, y2, bend, color, cls = '', d = 0) => {
    const mx = (x1 + x2) / 2 + bend[0], my = (y1 + y2) / 2 + bend[1];
    const a = Math.atan2(y2 - my, x2 - mx), l = 10;
    const p = (t) => `${f(x2 - l * Math.cos(a + t))} ${f(y2 - l * Math.sin(a + t))}`;
    return `<path class="${cls}" ${delay(d)} d="M${x1} ${y1} Q${f(mx)} ${f(my)} ${x2} ${y2} M${p(-0.5)} L${x2} ${y2} L${p(0.5)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  };

  // 규칙: 방 번호 배열 — 오른쪽으로 1씩, 위로 100씩 → 빈칸은 규칙대로 304
  (function () {
    const id = 't42-m3-gyuchik', X = 150, Y = 54, W = 88, H = 62;
    const floors = [3, 2, 1], hole = [0, 3];
    let cells = '';
    floors.forEach((fl, r) => {
      for (let c = 0; c < 5; c++) {
        const x = X + c * W, y = Y + r * H, n = fl * 100 + c + 1;
        const isHole = r === hole[0] && c === hole[1];
        cells += `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`;
        if (isHole) cells += `<g class="h3">${text(x + W / 2, y + 41, '?', { size: 30, color: C.muted })}</g>`
          + `<g class="p3" ${delay(.9)}><rect x="${x + 4}" y="${y + 4}" width="${W - 8}" height="${H - 8}" rx="6" fill="${C.peach}"/>${text(x + W / 2, y + 41, n, { size: 28, color: C.orange })}</g>`;
        else cells += text(x + W / 2, y + 41, n, { size: 28 });
      }
    });
    const bottom = Y + 3 * H;
    // 1칸: 맨 아래 줄을 밝히고 아래로 +1 깡충
    const row = `<g class="h3"><g class="s1"><rect x="${X}" y="${Y + 2 * H}" width="${5 * W}" height="${H}" fill="${C.sky}" fill-opacity=".7"/></g></g>`
      + [0, 1, 2, 3].map((c) => {
        const x1 = X + c * W + W / 2 + 8, x2 = X + (c + 1) * W + W / 2 - 8;
        return hop(x1, bottom + 8, x2, bottom + 8, [0, 34], C.blue, 's1', .3 + c * .3)
          + `<g class="s1" ${delay(.35 + c * .3)}>${text((x1 + x2) / 2, bottom + 54, '+1', { size: 22, color: C.blue })}</g>`;
      }).join('');
    // 2칸: 왼쪽 세로줄을 밝히고 왼쪽으로 +100 깡충
    const col = `<g class="h3"><g class="s2"><rect x="${X}" y="${Y}" width="${W}" height="${3 * H}" fill="${C.mint}" fill-opacity=".9"/></g></g>`
      + [2, 1].map((r, j) => {
        const y1 = Y + r * H + H / 2 + 6, y2 = Y + (r - 1) * H + H / 2 - 6;
        return hop(X - 8, y1, X - 8, y2, [-38, 0], C.green, 's2', .3 + j * .4)
          + `<g class="s2" ${delay(.35 + j * .4)}>${text(X - 76, (y1 + y2) / 2 + 8, '+100', { size: 22, color: C.green })}</g>`;
      }).join('');
    // 3칸: 빈칸이 있는 줄과 칸을 밝힌다
    const cross = `<g class="s3" ${delay(.1)}><rect x="${X}" y="${Y}" width="${5 * W}" height="${H}" fill="${C.sky}" fill-opacity=".6"/><rect x="${X + 3 * W}" y="${Y}" width="${W}" height="${3 * H}" fill="${C.mint}" fill-opacity=".8"/></g>`;
    const body = `<rect x="${X}" y="${Y}" width="${5 * W}" height="${3 * H}" fill="white"/>` + row + col + cross + cells
      + `<circle class="ring r3" ${delay(1.1)} cx="${X + 3.5 * W}" cy="${Y + H / 2}" r="34" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`;
    put('4-2/수학/3/규칙', svg(id, body, motion(id) + `
      .sc-${id} .h3 { transition: opacity .3s ease .6s; }`));
  })();

  // 배열: 첫째·둘째·셋째 모양이 차례로 늘어섬 → 한 줄 더 붙은 넷째 → 수도 1, 3, 6, 10 으로 늘어섬
  (function () {
    const id = 't42-m3-baeyeol', R = 17, D = 36, base = 222;
    const cx = [80, 200, 350, 535];
    const shape = (k, cls, d0) => {
      let s = '';
      for (let row = 0; row < k + 1; row++) {
        const n = k + 1 - row;                       // 아래 줄일수록 많다
        for (let i = 0; i < n; i++) {
          const x = cx[k] + (i - (n - 1) / 2) * D, y = base - row * (D - 5);
          const isNew = k === 3 && row === 0;
          s += `<circle class="${isNew ? 'nw' : ''}" cx="${f(x)}" cy="${f(y)}" r="${R}" fill="${isNew ? C.peach : C.yellow}" stroke="${isNew ? C.orange : C.ink}" stroke-width="2.5"/>`;
        }
      }
      return `<g class="${cls}" ${delay(d0)}>${s}</g>`;
    };
    const names = ['첫째', '둘째', '셋째', '넷째'], nums = [1, 3, 6, 10];
    let body = '';
    for (let k = 0; k < 3; k++) body += shape(k, 'p1', .2 + k * .5) + `<g class="s1" ${delay(.4 + k * .5)}>${text(cx[k], 272, names[k], { size: 22, color: C.muted })}</g>`;
    // 넷째: 셋째 모양을 복사해 옮기고, 아래에 4개 한 줄이 밀려 들어온다
    const fourthTop = (() => {
      let s = '';
      for (let row = 1; row < 4; row++) {
        const n = 4 - row;
        for (let i = 0; i < n; i++) s += `<circle cx="${f(cx[3] + (i - (n - 1) / 2) * D)}" cy="${f(base - row * (D - 5))}" r="${R}" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5"/>`;
      }
      return s;
    })();
    const newRow = [0, 1, 2, 3].map((i) => `<circle cx="${f(cx[3] + (i - 1.5) * D)}" cy="${base}" r="${R}" fill="${C.orange}" fill-opacity=".45" stroke="${C.orange}" stroke-width="3"/>`).join('');
    body += `<g class="f2" ${delay(.1, `--dx:${cx[2] - cx[3]}px;--dy:${D - 5}px`)}>${fourthTop}</g>`
      + `<g class="i2" ${delay(.9)}>${newRow}</g>`
      + `<g class="s2" ${delay(1.3)}>${text(cx[3], 272, names[3], { size: 22, color: C.muted })}</g>`;
    // 수
    body += nums.map((n, k) => `<g class="p3" ${delay(.2 + k * .35)}>${text(cx[k], 330, n, { size: 32, color: C.orange })}</g>`).join('')
      + [0, 1, 2].map((k) => hop(cx[k] + 24, 306, cx[k + 1] - 24, 306, [0, -22], C.muted, 's3', .5 + k * .35)
        + `<g class="s3" ${delay(.55 + k * .35)}>${text((cx[k] + cx[k + 1]) / 2, 284 + 50, `+${k + 2}`, { size: 20, color: C.muted })}</g>`).join('');
    put('4-2/수학/3/배열', svg(id, body, motion(id)));
  })();

  // 계산식: 구슬 4개씩 3줄 → 수와 기호로 3 × 4 = 12 → +, −, ÷ 로 쓴 다른 계산식
  (function () {
    const id = 't42-m3-gyesansik';
    let dots = '';
    for (let r = 0; r < 3; r++) {
      let row = '';
      for (let c = 0; c < 4; c++) row += `<circle cx="${100 + c * 44}" cy="${80 + r * 52}" r="17" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`;
      dots += `<g class="i1" ${delay(.2 + r * .35)}>${row}</g>`;
    }
    const brace = `<g class="s1" ${delay(1.3)}><path d="M80 46 H252" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>${text(166, 36, '4개씩', { size: 20, color: C.blue })}<path d="M74 60 V204" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>${text(42, 139, '3줄', { size: 20, color: C.orange })}</g>`;
    // 3 × 4 = 12 : 글자마다 따로(날아오기)
    const parts = [['3', 300, C.orange], ['×', 352, C.red], ['4', 404, C.blue], ['=', 460, C.ink], ['12', 528, C.ink]];
    const from = [[42, 139], null, [166, 36], null, [166, 132]];
    const eq = parts.map(([s, x, color], i) => {
      const fr = from[i];
      const st = fr ? `--dx:${fr[0] - x}px;--dy:${fr[1] - 128}px` : '';
      const cls = fr ? 'f2' : 'p2';
      return `<g class="${cls}" ${delay(.2 + i * .25, st)}>${text(x, 144, s, { size: 56, color })}</g>`;
    }).join('');
    const op = (x, y, s) => `<g class="u3" ${delay(1.4)}><g>${text(x, y, s, { size: 34, color: C.red })}</g></g>`;
    const others = [['5', '+', '7', 300], ['15', '−', '3', 300], ['24', '÷', '2', 300]].map(([a, o, b], i) => {
      const y = 236 + i * 46, d = .2 + i * .35;
      return `<g class="i3" ${delay(d)}>${text(250, y, a, { size: 34, anchor: 'end' })}${text(314, y, b, { size: 34, anchor: 'start' })}${text(380, y, '=', { size: 34 })}${text(420, y, '12', { size: 34, anchor: 'start' })}</g>`
        + `<g class="i3" ${delay(d)}>${op(283, y, o)}</g>`;
    }).join('');
    const xr = `<circle class="ring r3" ${delay(1.4)} cx="352" cy="126" r="30" fill="none" stroke="${C.red}" stroke-width="3.5"/>`;
    const body = dots + brace + eq + others + xr;
    put('4-2/수학/3/계산식', svg(id, body, motion(id)));
  })();

  // 등호: 왼쪽 접시에 20 g, 30 g → 기울어짐, 오른쪽 접시에 10 g, 40 g → 수평 → 20 + 30 = 10 + 40
  (function () {
    const id = 't42-m3-deungho', PV = [320, 96], L = 150, TILT = 12;
    const dy = f(L * Math.sin(TILT * Math.PI / 180));
    const block = (x, w, label, color, fill) => `<rect x="${x}" y="${-42}" width="${w}" height="42" rx="8" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(x + w / 2, -14, label, { size: 18 })}`;
    const pan = (cx, cls, inner) => `<g class="${cls}"><path d="M${cx} ${PV[1]} L${cx - 70} ${PV[1] + 96} M${cx} ${PV[1]} L${cx + 70} ${PV[1] + 96}" stroke="${C.muted}" stroke-width="2"/>`
      + `<path d="M${cx - 84} ${PV[1] + 96} H${cx + 84} Q${cx + 70} ${PV[1] + 116} ${cx} ${PV[1] + 116} Q${cx - 70} ${PV[1] + 116} ${cx - 84} ${PV[1] + 96} Z" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5"/>`
      + `<g transform="translate(0 ${PV[1] + 96})">${inner}</g></g>`;
    const wL = (m) => 36 + m * 1.2;
    const leftBlocks = `<g class="dr1" ${delay(.2)}>${block(PV[0] - L - 69, wL(20), '20 g', C.orange, C.peach)}</g>`
      + `<g class="dr1" ${delay(.5)}>${block(PV[0] - L - 69 + wL(20) + 6, wL(30), '30 g', C.orange, C.peach)}</g>`;
    const rightBlocks = `<g class="dr2" ${delay(.2)}>${block(PV[0] + L - 69, wL(10), '10 g', C.blue, C.sky)}</g>`
      + `<g class="dr2" ${delay(.5)}>${block(PV[0] + L - 69 + wL(10) + 6, wL(40), '40 g', C.blue, C.sky)}</g>`;
    const stand = `<path d="M${PV[0]} ${PV[1]} L${PV[0] - 34} 262 H${PV[0] + 34} Z" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${PV[0] - 80} 262 H${PV[0] + 80}" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
    const beam = `<g class="beam"><path d="M${PV[0] - L - 10} ${PV[1]} H${PV[0] + L + 10}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/><circle cx="${PV[0] - L}" cy="${PV[1]}" r="5" fill="${C.ink}"/><circle cx="${PV[0] + L}" cy="${PV[1]}" r="5" fill="${C.ink}"/></g>`;
    const needle = `<g class="beam"><path d="M${PV[0]} ${PV[1]} V${PV[1] - 40}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/></g>`;
    const expr = `<g class="s1" ${delay(1)}>${text(PV[0] - L, 312, '20 + 30', { size: 30 })}</g>`
      + `<g class="s2" ${delay(1)}>${text(PV[0] + L, 312, '10 + 40', { size: 30 })}</g>`
      + `<g class="p2" ${delay(1.7)}>${text(PV[0] - L, 348, '50', { size: 24, color: C.orange })}</g>`
      + `<g class="p2" ${delay(1.9)}>${text(PV[0] + L, 348, '50', { size: 24, color: C.blue })}</g>`
      + `<g class="dr3" ${delay(.2)}>${text(PV[0], 316, '=', { size: 54, color: C.red })}</g>`
      + `<circle class="ring r3" ${delay(.8)} cx="${PV[0]}" cy="300" r="26" fill="none" stroke="${C.red}" stroke-width="3.5"/>`;
    const body = stand + needle + beam
      + pan(PV[0] - L, 'panL', leftBlocks) + pan(PV[0] + L, 'panR', rightBlocks)
      + `<circle cx="${PV[0]}" cy="${PV[1]}" r="8" fill="${C.ink}"/>` + expr;
    put('4-2/수학/3/등호', svg(id, body, motion(id) + `
      .sc-${id} .beam { transform-box: view-box; transform-origin: ${PV[0]}px ${PV[1]}px; transition: transform .9s ease-in-out .9s; }
      .sc-${id} :is(.panL,.panR) { transition: transform .9s ease-in-out .9s; }
      .on1 .sc-${id} .beam { transform: rotate(${-TILT}deg); }
      .on1 .sc-${id} .panL { transform: translateY(${dy}px); }
      .on1 .sc-${id} .panR { transform: translateY(${-dy}px); }
      .on2 .sc-${id} .beam, .on2 .sc-${id} .panL, .on2 .sc-${id} .panR { transform: none; }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
