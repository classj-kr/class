// 수학 6-1 3단원 소수의 나눗셈: 낱말 도식
// 교과서 방법: 자연수의 나눗셈(117 ÷ 3)을 이용하고, 몫의 소수점은 나누어지는 수의 소수점 바로 위에 올려 찍는다.
// 몫이 1보다 작으면 일의 자리에 0, 나눌 수 없는 자리에는 0을 쓴다(18.1 ÷ 2 = 9.05).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const numberLine = (...a) => { const r = root.FigureKit.numberLine(...a); r.body = r.body.replace(/font-size="17"/g, 'font-size="19"'); return r; };
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4,.u1,.u2,.u3,.u4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .7s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 25% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-46px); } 60% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .9s ease-in-out both; }
    .on${n} .sc-${id} .u${n} { animation: ${id}-drop .6s ease-out both; }`;
    return css;
  };

  // 식: 토막마다 따로 놓아 가운데 x 를 돌려준다
  const charW = (ch) => /[0-9]/.test(ch) ? .58 : ch === '.' ? .3 : ch === '…' ? 1 : /[÷=×<>]/.test(ch) ? .72 : .6;
  function eq(cx, y, toks, size, { cls = '', d = 0 } = {}) {
    const items = toks.map((t) => (typeof t === 'string' ? { t } : t));
    const ws = items.map(({ t }) => [...String(t)].reduce((s, ch) => s + charW(ch) * size, 0));
    const gap = size * .36, total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = cx - total / 2;
    const xs = [];
    const body = items.map((it, i) => {
      const c = x + ws[i] / 2; xs.push(c); x += ws[i] + gap;
      const t = text(f(c), y, it.t, { size, color: it.color || C.ink });
      return it.cls ? `<g class="${it.cls}" ${delay(it.d || 0)}>${t}</g>` : t;
    }).join('');
    return { body: cls ? `<g class="${cls}" ${delay(d)}>${body}</g>` : body, xs, ws, mid: y - size * .36 };
  }
  const oval = (x, y, w, h, color, cls = '', d = 0) => `<ellipse class="${cls}" ${cls ? delay(d) : ''} cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(h)}" fill="none" stroke="${color}" stroke-width="3.5"/>`;
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 22, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;
  const dotAt = (x, y, r = 5.5, color = C.red) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${color}"/>`;
  const tenths = (nl, from, to, y, len = 6) => {
    let s = '';
    for (let v = from * 10; v <= to * 10; v++) if (v % 10) s += `<path d="M${f(nl.at(v / 10))} ${y - len} V${y + len}" stroke="${C.ink}" stroke-width="1.5"/>`;
    return s;
  };
  const check = (x, y) => `<path d="M${f(x - 11)} ${y} l8 9 l16 -19" stroke="${C.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const cross = (x, y) => `<path d="M${f(x - 10)} ${y - 10} l20 20 M${f(x + 10)} ${y - 10} l-20 20" stroke="${C.red}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
  // 자리 칸 표: 칸 가운데 x 목록, 위 이름표(두 줄), 세로 칸선
  function placeTable(cols, x0, cw, yTop, yBot, names, { size = 19, fills = [] } = {}) {
    let s = '';
    cols.forEach((_, i) => {
      const x = x0 + i * cw;
      s += `<rect x="${x}" y="${yTop}" width="${cw}" height="${yBot - yTop}" fill="${fills[i] || 'white'}" stroke="${C.line}" stroke-width="2.5"/>`;
      const [a, b] = names[i];
      s += text(x + cw / 2, yTop + 28, a, { size, color: C.muted }) + (b ? text(x + cw / 2, yTop + 52, b, { size, color: C.muted }) : '');
    });
    return s + `<path d="M${x0} ${yTop + (names.some((n) => n[1]) ? 66 : 42)} H${x0 + cols.length * cw}" stroke="${C.line}" stroke-width="2.5"/>`;
  }

  // 소수: 3.6 m 끈을 3도막 → 한 도막을 수직선에 대면 1과 조금 더 → 1.2: 1보다 작은 부분 0.2를 점 뒤에
  (function () {
    const id = 't61-m3-sosu', u = 150, x0 = 60, ty = 56, th = 40, ny = 262;
    const nl = numberLine(0, 2, { y: ny, x0, x1: x0 + 2 * u });
    const pieces = [0, 1, 2].map((k) => `<rect x="${x0 + k * 1.2 * u}" y="${ty}" width="${1.2 * u}" height="${th}" fill="${k % 2 ? C.sky : C.peach}"/>`).join('');
    const cuts = [1, 2].map((k) => `<path class="s1" ${delay(1 + k * .2)} d="M${x0 + k * 1.2 * u} ${ty - 8} V${ty + th + 8}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/>`).join('');
    const E = eq(320, 150, ['3.6', '÷', '3', '=', { t: '1.2', color: C.orange }], 36, { cls: 's1', d: 1.5 });
    const big = [520, 250];
    const body = `<g class="tp">${pieces}<rect x="${x0}" y="${ty}" width="${3.6 * u}" height="${th}" fill="none" stroke="${C.ink}" stroke-width="3"/></g>` + cuts
      + `<g class="s1" ${delay(1)}>${text(x0 + 3.6 * u, ty - 12, '3.6 m', { size: 22, anchor: 'end' })}</g>` + E.body
      + `<g class="s2">${nl.body}${tenths(nl, 0, 2, ny)}</g>`
      + `<g class="s2"><g class="dn"><rect x="${x0}" y="${ty}" width="${1.2 * u}" height="${th}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g></g>`
      + `<g class="s2" ${delay(1.2)}><rect x="${x0 + u}" y="${ny - 52}" width="${0.2 * u}" height="${th}" fill="${C.orange}" fill-opacity=".55" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="M${x0 + u} ${ny - 62} V${ny + 10}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 5"/></g>`
      + `<g class="s2" ${delay(1.5)}>${text(x0 + u / 2, ny - 66, '1', { size: 24, color: C.blue })}${text(x0 + 1.1 * u, ny - 66, '0.2', { size: 22, color: C.orange })}</g>`
      + `<g class="s3" ${delay(.2)}>${text(big[0] - 40, big[1], '1', { size: 80, color: C.blue })}${text(big[0] + 40, big[1], '2', { size: 80, color: C.orange })}</g>`
      + `<g class="p3" ${delay(.8)}>${dotAt(big[0], big[1] - 6, 9)}</g>`
      + ring(big[0], big[1] - 6, 14, C.red, 'r3', 1.1)
      + `<g class="s3" ${delay(1.2)}>${text(big[0] - 40, big[1] + 48, '1', { size: 22, color: C.blue })}${text(big[0] + 40, big[1] + 48, '0.2', { size: 22, color: C.orange })}</g>`;
    put('6-1/수학/3/소수', svg(id, body, motion(id) + `
      .sc-${id} .tp { transform-box: view-box; transform-origin: ${x0}px 0; transform: scaleX(0); transition: transform 1s ease-out .2s; }
      .on1 .sc-${id} .tp { transform: none; }
      .sc-${id} .dn { transition: transform .9s ease-in-out .2s; }
      .on2 .sc-${id} .dn { transform: translateY(${ny - 52 - ty}px); }`));
  })();

  // 소수점: 11.7의 1(일의 자리)과 7(소수 첫째 자리) 사이 점 → 세로 나눗셈 3, 9 → 몫의 점은 바로 위로 올려 찍어 3.9
  (function () {
    const id = 't61-m3-sosujeom', S = 72;
    // 왼쪽 큰 수 11.7
    const nx = [70, 120, 190], NY = 120; // 1, 1, 7 의 가운데
    const big = nx.map((x, i) => text(x, NY, [1, 1, 7][i], { size: S, color: i === 1 ? C.green : i === 2 ? C.blue : C.ink })).join('');
    const bdot = [155, NY - 7];
    const tags = `<path d="M${nx[1]} ${NY + 14} V${NY + 40} H${nx[1] - 12} M${nx[2]} ${NY + 14} V${NY + 40} H${nx[2] + 12}" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`
      + text(nx[1] - 18, NY + 47, '일의 자리', { size: 20, color: C.green, anchor: 'end' }) + text(nx[2] + 18, NY + 47, '소수 첫째 자리', { size: 20, color: C.blue, anchor: 'start' });
    // 오른쪽 세로 나눗셈 11.7 ÷ 3
    const cx = [430, 474, 518], cw = 44, R = [116, 168, 208, 252, 292, 336], D = 34;
    const dg = (x, y, s, color = C.ink, cls = '', d = 0) => `<g class="${cls}" ${delay(d)}>${text(x, y, s, { size: D, color })}</g>`;
    const bx = cx[0] - cw / 2 - 4, top = R[1] - 36;
    const frame = `<path d="M${bx} ${top} H${cx[2] + cw / 2 + 6}" stroke="${C.ink}" stroke-width="3"/><path d="M${bx} ${top} Q${bx + 10} ${R[1] - 12} ${bx - 4} ${R[1] + 10}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + text(bx - 26, R[1], '3', { size: D }) + cx.map((x, i) => text(x, R[1], [1, 1, 7][i], { size: D })).join('');
    const ddot = [cx[1] + cw / 2, R[1] - 4];
    const steps = dg(cx[1], R[0], '3', C.orange, 'u2', .2) + dg(cx[1], R[2], '9', C.ink, 's2', .5)
      + `<path class="s2" ${delay(.6)} d="M${cx[0] - 16} ${R[2] + 10} H${cx[1] + 18}" stroke="${C.ink}" stroke-width="2.5"/>`
      + dg(cx[1], R[3], '2', C.ink, 's2', .8) + dg(cx[2], R[3], '7', C.ink, 's2', 1)
      + dg(cx[2], R[0], '9', C.orange, 'u2', 1.2) + dg(cx[1], R[4], '2', C.ink, 's2', 1.4) + dg(cx[2], R[4], '7', C.ink, 's2', 1.4)
      + `<path class="s2" ${delay(1.5)} d="M${cx[1] - 16} ${R[4] + 10} H${cx[2] + 18}" stroke="${C.ink}" stroke-width="2.5"/>` + dg(cx[2], R[5], '0', C.ink, 's2', 1.6);
    const body = `<g class="s1">${big}</g>` + `<g class="p1" ${delay(.6)}>${dotAt(...bdot, 9)}</g>` + ring(...bdot, 14, C.red, 'r1', .9)
      + `<g class="s1" ${delay(1.2)}>${tags}</g>`
      + `<g class="s2">${frame}${dotAt(...ddot, 5.5)}</g>` + steps
      + `<g class="b3"><g class="up">${dotAt(...ddot, 6.5)}</g></g>`
      + `<g class="s3" ${delay(.2)}><path d="M${ddot[0]} ${R[1] - 30} V${R[0] + 10}" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="4 5"/></g>`
      + ring(ddot[0], R[0] - 4, 14, C.red, 'r3', 1.2)
      + `<g class="s3" ${delay(1.4)}>${text(128, 268, '3', { size: 56, color: C.orange })}${text(186, 268, '9', { size: 56, color: C.orange })}</g>`
      + `<g class="p3" ${delay(1.6)}>${dotAt(157, 262, 7.5)}</g>`
      + ring(...bdot, 14, C.red, 'r4', .2) + ring(ddot[0], R[0] - 4, 14, C.red, 'r4', .2) + ring(ddot[0], ddot[1], 14, C.red, 'r4', .2) + ring(157, 262, 14, C.red, 'r4', .2);
    put('6-1/수학/3/소수점', svg(id, body, motion(id) + `
      .sc-${id} .up { transition: transform .8s ease-in-out .3s; }
      .on3 .sc-${id} .up { transform: translateY(${R[0] - R[1]}px); }`));
  })();

  // 일의 자리: 6.8 ÷ 2 = 3.4 의 몫이 자리 칸에 떨어짐(3은 일의 자리) → 3.2 ÷ 4 = 0.8, 일의 자리에 0 → 점 바로 왼쪽 칸
  (function () {
    const id = 't61-m3-ilui', x0 = 270, cw = 170, yT = 40, yB = 320, r1 = 170, r2 = 270, S = 54;
    const c1 = x0 + cw / 2, c2 = x0 + cw * 1.5, bx = x0 + cw;
    const table = placeTable([0, 1], x0, cw, yT, yB, [['일의 자리'], ['소수 첫째 자리']], { size: 22 });
    const body = `<g class="hl">${`<rect x="${x0}" y="${yT}" width="${cw}" height="${yB - yT}" fill="${C.mint}"/>`}</g>`
      + table.replace(/fill="white"/, 'fill="none"')
      + `<g class="s1">${eq(140, r1, ['6.8', '÷', '2', '='], 34).body}</g>`
      + tag(c1, r1 + 10, '3', C.green, 'u1', .5, S) + tag(c2, r1 + 10, '4', C.ink, 'u1', .9, S)
      + `<g class="p1" ${delay(1.3)}>${dotAt(bx, r1 + 2, 8)}</g>`
      + ring(c1, r1 - 9, 36, C.green, 'r1', 1.6)
      + `<g class="s2">${eq(140, r2, ['3.2', '÷', '4', '='], 34).body}</g>`
      + tag(c2, r2 + 10, '8', C.ink, 'u2', .4, S)
      + `<g class="k2" ${delay(1)}>${text(c1, r2 + 10, '0', { size: S, color: C.red })}</g>`
      + `<g class="p2" ${delay(1.4)}>${dotAt(bx, r2 + 2, 8)}</g>`
      + `<g class="s3" ${delay(.2)}><rect x="${x0 + 3}" y="${yT + 3}" width="${cw - 6}" height="${yB - yT - 6}" fill="none" stroke="${C.green}" stroke-width="5"/></g>`
      + ring(bx, r1 + 2, 12, C.red, 'r3', .8) + ring(bx, r2 + 2, 12, C.red, 'r3', .8);
    put('6-1/수학/3/일의 자리', svg(id, body, motion(id) + `
      .sc-${id} .hl { opacity: 0; }
      .on3 .sc-${id} .hl { opacity: .7; transition: opacity .6s ease .2s; }`));
  })();

  // 소수 첫째 자리: 38.6의 6은 소수 첫째 자리(0.1이 6) → 18.1 ÷ 2 = 9.05: 1을 2로 나눌 수 없어 소수 첫째 자리에 0
  (function () {
    const id = 't61-m3-cheotjjae', x0 = 186, cw = 108, yT = 30, yB = 330, r1 = 168, r2 = 276, S = 50;
    const cc = (i) => x0 + cw * (i + .5), bx = x0 + 2 * cw;
    const table = placeTable([0, 1, 2, 3], x0, cw, yT, yB, [['십의', '자리'], ['일의', '자리'], ['소수 첫째', '자리'], ['소수 둘째', '자리']], { size: 19 });
    const tenth = Array.from({ length: 6 }, (_, k) => `<g class="p1" ${delay(1.5 + k * .12)}><rect x="${f(cc(2) - 39 + k * 13)}" y="${r1 + 24}" width="11" height="26" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/></g>`).join('');
    const body = `<g class="hl"><rect x="${x0 + 2 * cw}" y="${yT}" width="${cw}" height="${yB - yT}" fill="${C.sky}"/></g>` + table.replace(/fill="white"/g, 'fill="none"')
      + `<g class="s1">${text(96, r1, '38.6', { size: 34 })}</g>`
      + [3, 8, 6].map((n, i) => tag(cc(i), r1, n, i === 2 ? C.blue : C.ink, 'u1', .3 + i * .3, S)).join('')
      + `<g class="p1" ${delay(1.2)}>${dotAt(bx, r1 - 6, 7.5)}</g>` + tenth
      + `<g class="s2">${eq(96, r2, ['18.1', '÷', '2', '='], 26).body}</g>`
      + tag(cc(1), r2, '9', C.ink, 'u2', .3, S) + tag(cc(3), r2, '5', C.ink, 'u2', .7, S)
      + `<g class="p2" ${delay(.5)}>${dotAt(bx, r2 - 6, 7.5)}</g>`
      + `<g class="k2" ${delay(1.2)}>${text(cc(2), r2, '0', { size: S, color: C.red })}</g>`
      + ring(cc(2), r2 - 18, 30, C.red, 'r2', 1.8)
      + `<g class="s3" ${delay(.2)}><rect x="${x0 + 2 * cw + 3}" y="${yT + 3}" width="${cw - 6}" height="${yB - yT - 6}" fill="none" stroke="${C.blue}" stroke-width="5"/></g>`
      + ring(bx, r1 - 6, 12, C.red, 'r3', .8) + ring(bx, r2 - 6, 12, C.red, 'r3', .8);
    put('6-1/수학/3/소수 첫째 자리', svg(id, body, motion(id) + `
      .sc-${id} .hl { opacity: 0; }
      .on1 .sc-${id} .hl { opacity: .35; transition: opacity .6s ease 1.2s; }
      .on3 .sc-${id} .hl { opacity: .8; transition: opacity .6s ease .2s; }`));
  })();

  // 나누어지는 수: 846 ÷ 2 = 423 → 84.6 ÷ 2 = 42.3 → 8.46 ÷ 2 = 4.23, 나누어지는 수가 1/10배씩 되면 몫도 1/10배씩 → ÷ 앞의 수
  (function () {
    const id = 't61-m3-nanueo', S = 42, rows = [92, 186, 280], DX = 236, QX = 386;
    const row = (y, a, q, cls, d) => `<g class="${cls}" ${delay(d)}>${text(DX, y, a, { size: S, color: C.orange, anchor: 'end' })}`
      + text(276, y, '÷', { size: S }) + text(312, y, '2', { size: S }) + text(350, y, '=', { size: S }) + text(QX, y, q, { size: S, anchor: 'start' }) + '</g>';
    const tenthLabel = (x, y) => `${text(x, y - 6, 1, { size: 18, color: C.blue })}<path d="M${x - 13} ${y} H${x + 13}" stroke="${C.blue}" stroke-width="2"/>${text(x, y + 20, 10, { size: 18, color: C.blue })}${text(x + 16, y + 8, '배', { size: 20, color: C.blue, anchor: 'start' })}`;
    const arc = (x, dir, y1, y2) => `<path class="draw" pathLength="1" d="M${x} ${y1 - 8} Q${x + dir * 34} ${(y1 + y2) / 2 - 14} ${x} ${y2 - 30}" fill="none" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>`
      + head([x, y2 - 30], [x + dir * 22, (y1 + y2) / 2]);
    const head = (t, from) => { const a = Math.atan2(t[1] - from[1], t[0] - from[0]), l = 11; const p = (d) => `${f(t[0] - l * Math.cos(a + d))} ${f(t[1] - l * Math.sin(a + d))}`; return `<path class="hd" d="M${p(-.5)} L${t[0]} ${t[1]} L${p(.5)}" stroke="${C.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`; };
    const step = (n, y1, y2) => `<g class="b${n}"><g class="dd${n}">${arc(144, -1, y1, y2)}${arc(480, 1, y1, y2)}</g>${tenthLabel(64, (y1 + y2) / 2 - 18)}${tenthLabel(548, (y1 + y2) / 2 - 18)}</g>`;
    const body = row(rows[0], '846', '423', 's1', .2)
      + `<g class="b1">${oval(DX - 33, rows[0] - 15, 56, 30, C.orange)}${text(DX - 33, rows[0] - 54, '÷ 앞', { size: 21, color: C.orange })}</g>`
      + row(rows[1], '84.6', '42.3', 's2', .9) + step(2, rows[0], rows[1])
      + row(rows[2], '8.46', '4.23', 's3', .9) + step(3, rows[1], rows[2])
      + `<g class="s4" ${delay(.2)}><rect x="${DX - 92}" y="${rows[0] - 46}" width="104" height="${rows[2] - rows[0] + 64}" rx="14" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`
      + `<g class="k4" ${delay(.6)}>${text(DX - 40, 344, '나누어지는 수', { size: 24, color: C.orange })}</g>`;
    put('6-1/수학/3/나누어지는 수', svg(id, body, motion(id).replace(/\.sc-[^ ]+ \.draw \{[^}]+\}/, '') + `
      .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
      .on2 .sc-${id} .dd2 .draw, .on3 .sc-${id} .dd3 .draw { stroke-dashoffset: 0; transition: stroke-dashoffset .7s ease-in-out .3s; }
      .sc-${id} .hd { opacity: 0; }
      .on2 .sc-${id} .dd2 .hd, .on3 .sc-${id} .dd3 .hd { opacity: 1; transition: opacity .2s ease .95s; }`));
  })();

  // 나누는 수: 13.79 ÷ 7 = 1.97 → 13.79 띠를 똑같이 7도막, 한 도막 1.97 → ÷ 뒤의 수, 6.8 ÷ 2 에서는 2
  (function () {
    const id = 't61-m3-nanuneun', x0 = 60, W = 520, ty = 150, th = 44;
    const E = eq(320, 86, ['13.79', '÷', { t: '7', color: C.blue }, '=', '1.97'], 44);
    const pw = W / 7;
    const segs = Array.from({ length: 7 }, (_, k) => `<rect class="s2" ${delay(.2 + k * .16)} x="${f(x0 + k * pw)}" y="${ty}" width="${f(pw)}" height="${th}" fill="${k % 2 ? C.sky : C.mint}"/>`
      + tag(x0 + (k + .5) * pw, ty + 30, k + 1, C.ink, 'p2', .3 + k * .16, 22)).join('');
    const cuts = Array.from({ length: 6 }, (_, k) => `<path class="s2" ${delay(.35 + k * .16)} d="M${f(x0 + (k + 1) * pw)} ${ty - 8} V${ty + th + 8}" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>`).join('');
    const E2 = eq(320, 316, ['6.8', '÷', { t: '2', color: C.blue }, '=', '3.4'], 38, { cls: 's3', d: .3 });
    const body = E.body
      + `<rect x="${x0}" y="${ty}" width="${W}" height="${th}" fill="white"/>` + segs + `<rect x="${x0}" y="${ty}" width="${W}" height="${th}" fill="none" stroke="${C.ink}" stroke-width="3"/>` + cuts
      + text(x0 + W, ty - 12, '13.79', { size: 22, anchor: 'end', color: C.muted })
      + `<g class="s2" ${delay(1.5)}><path d="M${x0} ${ty + th + 12} V${ty + th + 22} H${f(x0 + pw)} V${ty + th + 12}" fill="none" stroke="${C.orange}" stroke-width="3"/>${text(f(x0 + pw / 2), ty + th + 50, '1.97', { size: 24, color: C.orange })}</g>`
      + `<g class="s1" ${delay(.6)}>${oval(E.xs[2], E.mid, 24, 30, C.blue)}${text(E.xs[2], 34, '÷ 뒤', { size: 21, color: C.blue })}</g>`
      + ring(E.xs[2], E.mid, 26, C.blue, 'r1', .9)
      + E2.body
      + `<g class="s3" ${delay(1)}>${oval(E2.xs[2], E2.mid, 22, 27, C.blue)}${text(E2.xs[2], 262, '÷ 뒤', { size: 21, color: C.blue })}</g>`
      + ring(E2.xs[2], E2.mid, 24, C.blue, 'r3', 1.3);
    put('6-1/수학/3/나누는 수', svg(id, body, motion(id)));
  })();

  // 어림셈: 수박 3통 18.3 kg → 18.3은 약 18 → 18 ÷ 3 = 6, 약 6 → 18.3 ÷ 3 = 6.1 은 6과 가까워 맞음, 21.9 ÷ 3 = 0.73 은 7과 멀어 틀림
  (function () {
    const id = 't61-m3-eorimsem';
    const E = eq(130, 64, ['18.3', '÷', '3'], 38);
    const n1 = numberLine(17, 19, { y: 164, x0: 70, x1: 330 });
    const a = n1.at(18.3), b = n1.at(18);
    const E2 = eq(480, 64, [{ t: '18', color: C.blue }, '÷', '3', '=', { t: '6', color: C.blue }], 38, { cls: 's2', d: .2 });
    const chip = (x, y, s, color, fill, cls, d) => `<g class="${cls}" ${delay(d)}><rect x="${x - 46}" y="${y - 22}" width="92" height="40" rx="20" fill="${fill}" stroke="${color}" stroke-width="3"/>${text(x, y + 7, s, { size: 22, color })}</g>`;
    const E3 = eq(250, 262, ['18.3', '÷', '3', '=', { t: '6.1', color: C.green }], 34, { cls: 's3', d: .2 });
    const E4 = eq(250, 330, ['21.9', '÷', '3', '=', { t: '0.73', color: C.red }], 34, { cls: 's4', d: .2 });
    const body = E.body + n1.body + tenths(n1, 17, 19, 164)
      + text(f(a), 202, '18.3', { size: 20, color: C.orange })
      + `<circle cx="${f(a)}" cy="164" r="8" fill="${C.orange}"/>`
      + `<path class="draw d1" pathLength="1" ${delay(.3)} d="M${f(a)} 152 Q${f((a + b) / 2)} 116 ${f(b)} 150" fill="none" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`
      + `<g class="p1" ${delay(1)}><circle cx="${f(b)}" cy="164" r="12" fill="none" stroke="${C.blue}" stroke-width="4"/></g>`
      + chip(f(b) - 20, 112, '약 18', C.blue, C.sky, 'p1', 1.2)
      + E2.body + chip(480, 122, '약 6', C.blue, C.sky, 'p2', 1)
      + E3.body + `<g class="p3" ${delay(.9)}>${check(E3.xs[4] + 50, 250)}</g>`
      + chip(530, 255, '약 6', C.green, C.mint, 's3', 1.1)
      + E4.body + `<g class="p4" ${delay(.9)}>${cross(E4.xs[4] + 56, 320)}</g>`
      + `<g class="s4" ${delay(1.1)}>${text(470, 332, '21 ÷ 3 = 7', { size: 22, color: C.red, anchor: 'start' })}</g>`;
    put('6-1/수학/3/어림셈', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
