// 과학 4-1 3단원 「땅의 변화」 화산·지진 낱말 도식: 땅을 옆에서 자른 단면으로 마그마·용암·화산 분출물·화성암·지진을 그린다.
// 땅은 회녹색(C.line), 지표는 그 위 테두리 선. 마그마와 용암은 주황 바탕에 빨강 테두리(빛 번짐 없이), 화산 가스는 흰 구름에 회색 테두리.
// 마그마는 땅속(지표선 아래)에만, 용암은 땅 위(지표선 위)에만 그린다.
// 현무암·화강암은 같은 확대 원(CX·CY·R)에 알갱이 크기와 색만 다르게 그린다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const glowPath = (d, n, color = C.green, s = 0, w = 6) => `<g class="b${n}"><path class="flash flash${n}"${dl(s)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowCircle = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="flash flash${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="7"/></g>`;
  const pts = (list) => list.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');
  const plen = (list) => list.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - list[i - 1][0], p[1] - list[i - 1][1]) : 0), 0);
  // 2차 곡선 위의 점들(t0~t1, n 등분), dy 만큼 위아래로 띄운다
  const qpts = (p0, p1, p2, t0 = 0, t1 = 1, n = 16, dy = 0) => {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = t0 + ((t1 - t0) * i) / n, u = 1 - t;
      out.push([u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1] + dy]);
    }
    return out;
  };

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .puff, .sc-${id} .swell, .sc-${id} .spin { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .bub { opacity: 0; animation: ${id}-bub 2.2s ease-in infinite; }
    .sc-${id} .jig { animation: ${id}-jig 1.6s ease-in-out infinite; }
    .sc-${id} .bob { animation: ${id}-bob 1.2s ease-in-out infinite; }
    .sc-${id} .fx { animation: ${id}-fx 1.9s linear infinite; }
    .sc-${id} .fy { opacity: 0; animation: ${id}-fy 1.9s linear infinite; }
    .sc-${id} .puff { opacity: 0; animation: ${id}-puff 3.2s ease-out infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-bub { 0% { opacity: 0; transform: none; } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(-16px); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(4px, -3px); } 50% { transform: translate(-3px, 4px); } 75% { transform: translate(-4px, -2px); } }
    @keyframes ${id}-bob { 0%, 100% { transform: none; } 50% { transform: translateY(10px); } }
    @keyframes ${id}-fx { from { transform: none; } to { transform: translateX(var(--dx)); } }
    @keyframes ${id}-fy { 0% { opacity: 1; transform: none; animation-timing-function: ease-out; } 45% { transform: translateY(var(--up)); animation-timing-function: ease-in; } 80% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--dn)); } }
    @keyframes ${id}-puff { 0% { opacity: 0; transform: translate(0, 0) scale(.4); } 20% { opacity: .95; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1.5); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }`;
    return s;
  };

  // 튀어 오르는 용암 덩이: [옆으로, 솟는 높이, 떨어지는 깊이, 반지름, 늦춤]
  const blob = (x, y, r) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.orange}" stroke="${C.red}" stroke-width="2"/>`;
  const spurt = (x, y, list, s0 = 0, draw = blob) => list.map(([dx, up, dn, r, s]) =>
    `<g class="fx" style="--dx:${dx}px;animation-delay:${f(s0 + s)}s"><g class="fy" style="--up:${-up}px;--dn:${dn}px;animation-delay:${f(s0 + s)}s">${draw(x, y, r)}</g></g>`).join('');
  // 피어오르는 구름(화산재는 회색, 화산 가스는 흰색)
  const cloud = (x, y, r, fill = 'white', stroke = C.muted) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle cx="${f(x + r * 0.8)}" cy="${f(y + r * 0.25)}" r="${f(r * 0.7)}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle cx="${f(x - r * 0.75)}" cy="${f(y + r * 0.3)}" r="${f(r * 0.62)}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  const puffs = (x, y, list, s0 = 0, fill = 'white', stroke = C.muted) => list.map(([dx, dy, r, s]) =>
    `<g class="puff" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${f(s0 + s)}s">${cloud(x, y, r, fill, stroke)}</g>`).join('');

  // ── 가운데 화산 단면(지표 y=250): 화산·분출·용암이 같이 쓴다 ──
  const G = 250;
  const VL = [140, 252], VLC = [250, 237], VLR = [290, 98], VRR = [350, 98], VRC = [390, 237], VR = [500, 252];
  const coneD = `M140 252 Q250 237 290 98 H300 Q320 124 340 98 H350 Q390 237 500 252 Z`;
  const coneLine = `M140 250 Q250 236 290 98 H300 Q320 124 340 98 H350 Q390 236 500 250`;
  const ground = () => `<rect x="0" y="${G}" width="640" height="${360 - G}" fill="${C.line}"/>`
    + `<path d="M0 288 Q160 280 320 288 T640 288 M0 326 Q160 318 320 326 T640 326" stroke="${C.muted}" stroke-width="2" fill="none" opacity=".45"/>`
    + `<path d="M0 ${G} H640" stroke="${C.muted}" stroke-width="3"/>`;
  const cone = () => `<path d="${coneD}" fill="${C.line}"/><path d="${coneLine}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
  const chamber = () => {
    let s = `<g class="swell"><ellipse cx="320" cy="338" rx="120" ry="28" fill="${C.orange}" stroke="${C.red}" stroke-width="3"/></g>`;
    [[250, 344, 0], [300, 336, 0.7], [350, 346, 1.3], [395, 340, 0.4], [275, 350, 1.7]].forEach(([x, y, d]) => { s += `<circle class="bub" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="4" fill="${C.peach}"/>`; });
    return s;
  };
  const pipeLow = () => `<rect x="312" y="${G - 2}" width="16" height="64" fill="${C.orange}"/><path d="M312 ${G - 2} V312 M328 ${G - 2} V312" stroke="${C.red}" stroke-width="2"/>`;
  const pipeHigh = () => `<rect x="312" y="110" width="16" height="${G - 108}" fill="${C.orange}"/><path d="M312 112 V${G} M328 112 V${G}" stroke="${C.red}" stroke-width="2"/>`;
  const magmaTag = (n) => at(n, 'pop', lead(441, 336, 478, 322, C.red) + tag(522, 318, '마그마', HOT, { size: 19 }), 0.3);

  // ════ 화산 ════
  // 땅속 마그마 → 틈을 뚫고 땅 위로 → 쌓여 산 → 화산
  (function () {
    const id = 't41-c3b-hwasan';
    let css = base(id);
    let body = ground() + chamber() + magmaTag(1);
    // 2칸: 틈을 따라 올라와 땅 위로 뿜어져 나옴
    body += `<g class="b2"><g class="lv up">${pipeLow()}</g></g>`;
    body += `<g class="b2 h3"><g class="spread"><ellipse cx="320" cy="248" rx="54" ry="6" fill="${C.orange}" stroke="${C.red}" stroke-width="2"/></g></g>`;
    body += shown(2, spurt(320, 244, [[-70, 90, 0, 6, 0], [-30, 120, 0, 5, 0.3], [20, 130, 0, 6, 0.6], [60, 100, 0, 5, 0.9], [95, 70, 0, 4, 1.2], [-100, 60, 0, 4, 1.5]], 0.9), 3);
    // 3칸: 쌓여서 산
    body += `<g class="b3"><g class="lv grow">${cone()}${pipeHigh()}</g></g>`;
    body += shown(3, spurt(320, 106, [[-90, 60, 80, 6, 0], [-40, 80, 50, 5, 0.3], [30, 85, 50, 6, 0.6], [80, 70, 80, 5, 0.9], [110, 50, 100, 4, 1.2], [-120, 40, 110, 4, 1.5]], 2.0));
    body += shown(3, puffs(320, 92, [[-34, -46, 15, 0], [28, -50, 16, 1.1], [-4, -54, 14, 2.1]], 2.0, C.line));
    // 4칸: 화산
    body += glowPath(coneLine, 4, C.green, 0.1, 6);
    body += at(4, 'pop', lead(398, 186, 500, 160, C.green) + tag(541, 154, '화산', OK, { size: 24 }), 0.5);
    css += `
      .sc-${id} .up { transform: scaleY(0); transition: transform .9s ease-out .2s; }
      .on2 .sc-${id} .up { transform: none; }
      .sc-${id} .spread { transform-box: fill-box; transform-origin: center; transform: scaleX(0); transition: transform 1.2s ease-out 1s; }
      .on2 .sc-${id} .spread { transform: none; }
      .sc-${id} .grow { transform: scaleY(.04); transition: transform 1.8s ease-out .2s; }
      .on3 .sc-${id} .grow { transform: none; }
      .sc-${id} .swell { animation: ${id}-swell 2.4s ease-in-out infinite; }
      @keyframes ${id}-swell { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03, 1.08); } }`;
    put('4-1/과학/3/화산', svg(id, body, css));
  })();

  // ════ 마그마 ════
  // 깊을수록 뜨거움 → 깊은 곳 암석이 녹음 → 마그마
  (function () {
    const id = 't41-c3b-magma';
    let css = base(id);
    const S = 84;
    const top = `M0 ${S} Q120 70 220 80 Q300 88 360 ${S} Q470 74 640 ${S}`;
    let body = `<path d="${top} V360 H0 Z" fill="${C.line}"/>`;
    body += `<defs><linearGradient id="${id}-heat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.peach}" stop-opacity="0"/><stop offset="1" stop-color="${C.peach}"/></linearGradient></defs><rect x="0" y="130" width="640" height="230" fill="url(#${id}-heat)"/>`;
    body += `<path d="${top}" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
    // 깊이 화살표
    body += arrow(60, 104, 60, 330, C.ink, '', 4);
    body += text(84, 132, '얕은 곳', { size: 19, anchor: 'start' }) + text(84, 318, '깊은 곳', { size: 19, anchor: 'start' });
    // 1칸: 아래에서 올라오는 열(점선 물결)
    const wave = (x) => `<path class="mar" d="M${x} 352 q-10 -18 0 -36 t0 -36 t0 -36" stroke="${C.orange}" stroke-width="3.5" stroke-dasharray="10 8" fill="none" stroke-linecap="round"/>`;
    body += at(1, 'fin', wave(174) + wave(560) + wave(612), 0.3);
    // 깊은 곳의 암석 조각들(2칸에 녹아 사라짐)
    const rnd = seeded(13);
    let rocks = '';
    for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) {
      const cx = 218 + col * 34 + (row % 2 ? 17 : 0), cy = 254 + row * 30;
      if (row % 2 && col === 6) continue;
      const p = [];
      for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3 + rnd() * 0.4, rr = 13 + rnd() * 4; p.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a) * 0.85]); }
      rocks += `<g class="melt" style="transition-delay:${f(0.2 + rnd() * 1.1)}s"><path d="${pts(p)} Z" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/></g>`;
    }
    body += rocks;
    body += shown(1, lead(456, 262, 500, 216, C.muted) + tag(532, 200, '암석', GRAY, { size: 19 }), 2);
    // 2칸: 녹은 덩어리
    const blobD = 'M200 284 C198 250 258 238 322 244 C392 236 452 252 450 284 C450 318 386 330 322 326 C252 332 202 318 200 284 Z';
    let melt = `<path d="${blobD}" fill="${C.orange}" stroke="${C.red}" stroke-width="3"/>`;
    [[250, 296, 0], [300, 286, 0.6], [350, 300, 1.2], [400, 288, 0.3], [330, 312, 1.6]].forEach(([x, y, d]) => { melt += `<circle class="bub" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="5" fill="${C.peach}"/>`; });
    body += `<g class="b2"><g class="ooze">${melt}</g></g>`;
    body += at(2, 'pop', lead(448, 266, 496, 216, C.orange) + tag(530, 200, '녹음', HOT, { size: 19 }), 1.4).replace('class="b2"', 'class="b2 h3"');
    // 3칸: 마그마
    body += ring(325, 285, 60, 3, C.orange, 0);
    body += at(3, 'pop', lead(448, 266, 492, 220, C.red) + tag(540, 200, '마그마', HOT, { size: 24 }), 0.5);
    css += `
      .sc-${id} .melt { transition: opacity 1s ease-in, transform 1s ease-in; transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .melt { opacity: 0; transform: scale(.5) translateY(10px); }
      .sc-${id} .ooze { transform-box: fill-box; transform-origin: center; transform: scale(.6); opacity: 0; transition: transform 1.4s ease-out .6s, opacity 1.2s ease-out .5s; }
      .on2 .sc-${id} .ooze { transform: none; opacity: 1; animation: ${id}-wob 2.6s ease-in-out 2s infinite; }
      @keyframes ${id}-wob { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03, .96); } }`;
    put('4-1/과학/3/마그마', svg(id, body, css));
  })();

  // ════ 분출 ════
  // 갇힌 마그마가 밀어 올림 → 막힌 꼭대기가 뚫리며 세차게 솟구침 → 분출
  (function () {
    const id = 't41-c3b-bunchul';
    let css = base(id);
    let body = ground() + cone() + chamber() + pipeLow() + pipeHigh();
    // 막힌 꼭대기
    body += `<g class="plug"><path d="M298 98 Q320 126 342 98 Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/></g>`;
    // 1칸: 밀어 올리는 화살표
    body += shown(1, `<g class="bob">${arrow(282, 300, 282, 262, C.red, '', 5)}${arrow(358, 300, 358, 262, C.red, '', 5)}</g>`, 2);
    body += shown(1, `<g class="bob" style="animation-delay:.3s">${arrow(296, 200, 296, 160, C.red, '', 5)}${arrow(344, 200, 344, 160, C.red, '', 5)}</g>`, 2);
    // 2칸: 솟구치는 줄기와 튀는 덩이
    const jetD = 'M311 112 C307 86 294 52 288 30 H352 C346 52 333 86 329 112 Z';
    const crown = [[294, 30, 15], [320, 22, 18], [346, 30, 15], [307, 14, 11], [334, 12, 12]];
    const jetShape = (attr) => `<path d="${jetD}" ${attr}/>` + crown.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${attr}/>`).join('');
    body += `<g class="b2"><g class="lv jet"><g class="lv flick">${jetShape(`fill="${C.red}" stroke="${C.red}" stroke-width="6"`)}${jetShape(`fill="${C.orange}"`)}<path d="M317 104 C314 80 306 50 300 26 M324 100 C328 76 334 50 340 28" stroke="${C.peach}" stroke-width="4" fill="none" stroke-linecap="round"/></g></g></g>`;
    body += shown(2, spurt(320, 60, [[-100, 40, 120, 6, 0], [-55, 60, 90, 5, 0.25], [50, 55, 95, 6, 0.5], [95, 45, 120, 5, 0.75], [-80, 30, 140, 4, 1.0], [80, 30, 140, 4, 1.25]], 0.6));
    body += shown(2, puffs(320, 44, [[-80, -6, 14, 0], [78, -4, 15, 1.1], [-60, 10, 13, 2.1]], 0.8, C.line));
    // 3칸: 분출
    body += at(3, 'pop', `<g class="bob">${arrow(250, 130, 250, 50, C.red, '', 5)}${arrow(390, 130, 390, 50, C.red, '', 5)}</g>`, 0.1);
    body += at(3, 'pop', tag(470, 92, '분출', OK, { size: 24 }), 0.5);
    css += `
      .sc-${id} .swell { animation: ${id}-swell 1s ease-in-out infinite; }
      @keyframes ${id}-swell { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04, 1.12); } }
      .on2 .sc-${id} .plug { animation: ${id}-plug 1s ease-out .2s both; }
      .sc-${id} .plug { transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-plug { 0% { transform: none; opacity: 1; } 100% { transform: translate(-90px, -150px) rotate(-220deg); opacity: 0; } }
      .sc-${id} .jet { transform: scaleY(0); }
      .on2 .sc-${id} .jet { animation: ${id}-jet .6s cubic-bezier(.2, 1.5, .5, 1) .3s both; }
      @keyframes ${id}-jet { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      .sc-${id} .flick { animation: ${id}-flick .5s ease-in-out infinite alternate; }
      @keyframes ${id}-flick { from { transform: scale(1, 1); } to { transform: scale(1.08, .93); } }`;
    put('4-1/과학/3/분출', svg(id, body, css));
  })();

  // ════ 분화구 ════
  // 꼭대기 가운데 움푹 → 마그마가 나오는 곳 → 물이 고이면 호수 → 분화구
  (function () {
    const id = 't41-c3b-bunhwagu';
    let css = base(id);
    const bowl = 'M252 120 Q320 230 388 120';
    let body = `<defs><clipPath id="${id}-b"><path d="${bowl} Z"/></clipPath></defs>`;
    body += `<rect x="0" y="338" width="640" height="22" fill="${C.line}"/>`;
    const rim = 'M20 340 Q180 318 220 128 Q226 120 236 120 H252 Q320 230 388 120 H404 Q414 120 420 128 Q460 318 620 340';
    body += `<path d="${rim.replace('M20 340', 'M20 342')} L620 342 Z" fill="${C.line}"/>`;
    body += `<path d="M0 340 H20 ${rim.replace('M20 340', 'L20 340')} H640" fill="none" stroke="${C.muted}" stroke-width="3.5" stroke-linejoin="round"/>`;
    // 1칸: 꼭대기 가운데를 가리키는 화살표
    body += shown(1, `<g class="bob">${arrow(320, 30, 320, 96, C.orange, '', 5)}</g>`, 2);
    body += ring(320, 150, 42, 1, C.orange, 0.6);
    // 2칸: 마그마가 이곳으로 올라와 뿜어져 나옴
    body += `<g class="b2 h3"><g class="lv up"><rect x="310" y="172" width="20" height="190" fill="${C.orange}"/><path d="M310 174 V360 M330 174 V360" stroke="${C.red}" stroke-width="2"/></g></g>`;
    body += shown(2, spurt(320, 168, [[-50, 70, 30, 6, 0], [-15, 95, 0, 5, 0.3], [30, 90, 10, 6, 0.6], [60, 60, 40, 5, 0.9]], 1.0), 3);
    body += shown(2, puffs(320, 140, [[-30, -80, 16, 0], [25, -84, 18, 1.1], [-5, -90, 15, 2.1]], 1.0, C.line), 3);
    // 3칸: 물이 고여 호수
    body += `<g class="b3"><g clip-path="url(#${id}-b)"><g class="lv fill"><rect x="252" y="140" width="136" height="40" fill="${C.sky}"/><path d="M252 140 H388" stroke="${C.blue}" stroke-width="3"/></g></g></g>`;
    body += at(3, 'pop', lead(372, 150, 450, 190, C.blue) + tag(486, 200, '호수', COLD, { size: 19 }), 1.4);
    // 4칸: 분화구
    body += glowPath(bowl, 4, C.green, 0.1, 7);
    body += at(4, 'pop', lead(320, 70, 320, 112, C.green) + tag(320, 50, '분화구', OK, { size: 24 }), 0.5);
    css += `
      .sc-${id} .up { transform: scaleY(0); transition: transform 1s ease-out .2s; }
      .on2 .sc-${id} .up { transform: none; }
      .sc-${id} .fill { transform: scaleY(0); transition: transform 1.6s ease-out .3s; }
      .on3 .sc-${id} .fill { transform: none; }`;
    put('4-1/과학/3/분화구', svg(id, body, css));
  })();

  // ════ 화산 분출물 ════
  // 분화구에서 여러 가지가 나옴 → 기체·액체·고체 카드 → 모두 묶어 화산 분출물
  (function () {
    const id = 't41-c3b-bunchulmul';
    let css = base(id);
    const GY = 320;
    const RR = [212, 140], RC = [232, 306], RB = [350, 322];
    let body = `<rect x="0" y="${GY}" width="640" height="${360 - GY}" fill="${C.line}"/><path d="M0 ${GY} H640" stroke="${C.muted}" stroke-width="3"/>`;
    const vD = 'M10 320 Q140 304 158 140 Q161 134 166 134 H170 Q185 166 200 134 H204 Q209 134 212 140 Q232 304 350 320';
    body += `<path d="${vD.replace('M10 320', 'M10 322')} L350 322 Z" fill="${C.line}"/><path d="${vD}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    // 1칸: 가스·화산재·암석 조각·용암
    const flowPts = [[204, 132], ...qpts(RR, RC, RB, 0.03, 1, 14, -3.5)];
    const L = Math.ceil(plen(flowPts));
    body += shown(1, `<path class="lava" d="${pts(flowPts)}" stroke="${C.red}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${L} ${L}"/><path class="lava" d="${pts(flowPts)}" stroke="${C.orange}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${L} ${L}"/>`);
    body += shown(1, puffs(185, 118, [[40, -80, 18, 0], [80, -74, 20, 1.1], [14, -86, 16, 2.1]], 0.3));
    const ash = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.muted}"/>`;
    const chunk = (x, y, r) => `<path d="M${x - r} ${y} L${x - r * 0.3} ${y - r} L${x + r} ${y - r * 0.4} L${x + r * 0.6} ${y + r * 0.8} L${x - r * 0.5} ${y + r * 0.7} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="1.5"/>`;
    body += shown(1, spurt(185, 140, [[-110, 70, 120, 4, 0], [-60, 95, 80, 3.5, 0.4], [70, 100, 60, 4, 0.8], [130, 70, 110, 3.5, 1.2], [-130, 50, 140, 3.5, 1.6], [100, 90, 90, 4, 0.2], [-30, 105, 40, 3.5, 1.0], [35, 110, 30, 3.5, 1.4]], 0.2, ash));
    body += shown(1, spurt(185, 140, [[-80, 60, 110, 8, 0.1], [55, 75, 100, 7, 0.9], [-30, 85, 60, 6, 1.5]], 0.2, chunk));
    // 2칸: 세 가지 카드
    const card = (y, icon, name, state, s, size = 20) => at(2, 'pop', `<rect x="358" y="${y - 35}" width="264" height="70" rx="14" fill="white" stroke="${C.line}" stroke-width="2.5"/>${icon}`
      + text(414, y + 7, name, { size, anchor: 'start' }) + text(612, y + 7, state, { size: 19, color: C.green, anchor: 'end' }), s);
    const gasIcon = cloud(386, 52 + 35, 11);
    const lavaIcon = `<path d="M386 160 C378 172 374 180 374 186 A12 12 0 0 0 398 186 C398 180 394 172 386 160 Z" fill="${C.orange}" stroke="${C.red}" stroke-width="2.5"/>`;
    const solidIcon = chunk(380, 268, 9) + ash(395, 258, 3) + ash(398, 274, 3) + ash(388, 280, 2.5);
    body += card(85, gasIcon, '화산 가스', '기체', 0.2) + card(175, lavaIcon, '용암', '액체', 0.8) + card(265, solidIcon, '화산재·암석 조각', '고체', 1.4, 19);
    // 3칸: 모두 묶어 화산 분출물
    body += glowRect(352, 44, 276, 262, 3, C.green, 0.1, 18);
    body += at(3, 'pop', tag(490, 337, '화산 분출물', OK, { size: 22 }), 0.5);
    css += `
      .sc-${id} .lava { stroke-dashoffset: ${L}; transition: stroke-dashoffset 1.8s ease-in-out .4s; }
      .on1 .sc-${id} .lava { stroke-dashoffset: 0; }`;
    put('4-1/과학/3/화산 분출물', svg(id, body, css));
  })();

  // ════ 용암 ════
  // 땅속 마그마 → 분화구 밖으로 흘러내림 → 땅 위로 나온 것이 용암(지표선으로 갈림)
  (function () {
    const id = 't41-c3b-yongam';
    let css = base(id);
    let body = ground() + cone() + chamber() + pipeLow() + pipeHigh() + magmaTag(1);
    // 3칸 지표선(용암보다 아래 겹)
    body += glowPath(`M0 ${G} H140 ${coneLine.replace('M140 250', 'L140 250')} H640`, 3, C.green, 0.1, 6);
    // 2칸: 분화구 밖으로 흘러내림
    const right = [[342, 97], ...qpts(VRR, VRC, VR, 0.01, 1, 18, -2.5), [612, G - 2.5]];
    const left = [[298, 97], ...qpts(VLR, VLC, VL, 0.01, 0.78, 14, -2.5)];
    const Lr = Math.ceil(plen(right)), Ll = Math.ceil(plen(left));
    const lava = (list, cls, Lx) => `<path class="${cls}" d="${pts(list)}" stroke="${C.red}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${Lx} ${Lx}"/><path class="${cls}" d="${pts(list)}" stroke="${C.orange}" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${Lx} ${Lx}"/>`;
    body += at(2, 'pop', `<path d="M298 98 Q320 124 342 98 Q320 84 298 98 Z" fill="${C.orange}" stroke="${C.red}" stroke-width="2.5" stroke-linejoin="round"/>`, 0.1);
    body += shown(2, lava(right, 'fr', Lr) + lava(left, 'fl', Ll));
    // 3칸: 땅 위·땅속, 용암·마그마
    body += at(3, 'pop', tag(64, 205, '땅 위', COLD, { size: 19 }), 0.3) + at(3, 'pop', tag(64, 300, '땅속', GRAY, { size: 19 }), 0.5);
    body += at(3, 'pop', lead(560, 182, 560, 236, C.red) + tag(560, 160, '용암', HOT, { size: 24 }), 0.8);
    body += `<g class="b3"><g class="pulse pulse3" style="animation-delay:1s">${tag(522, 318, '마그마', HOT, { size: 19 })}</g></g>`;
    css += `
      .sc-${id} .swell { animation: ${id}-swell 2.4s ease-in-out infinite; }
      @keyframes ${id}-swell { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03, 1.08); } }
      .sc-${id} .fr { stroke-dashoffset: ${Lr}; transition: stroke-dashoffset 1.9s ease-in-out .3s; }
      .sc-${id} .fl { stroke-dashoffset: ${Ll}; transition: stroke-dashoffset 1.4s ease-in-out .3s; }
      .on2 .sc-${id} .fr, .on2 .sc-${id} .fl { stroke-dashoffset: 0; }`;
    put('4-1/과학/3/용암', svg(id, body, css));
  })();

  // ════ 화산 가스 ════
  // 분화구에서 하얀 기체 → 크게 보면 대부분 수증기 → 화산 가스
  (function () {
    const id = 't41-c3b-gas';
    let css = base(id);
    const CX = 482, CY = 168, R = 116;
    let body = `<defs><clipPath id="${id}-z"><circle cx="${CX}" cy="${CY}" r="${R - 2}"/></clipPath></defs>`;
    body += `<rect x="0" y="330" width="640" height="30" fill="${C.line}"/><path d="M380 330 H640" stroke="${C.muted}" stroke-width="3"/>`;
    const vD = 'M0 330 Q140 314 162 180 Q165 174 170 174 H176 Q190 198 204 174 H210 Q215 174 218 180 Q240 314 380 330';
    body += `<path d="${vD.replace('M0 330', 'M0 332')} L380 332 Z" fill="${C.line}"/><path d="${vD}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    // 1칸: 피어오르는 기체와 머무는 구름
    body += shown(1, puffs(190, 170, [[20, -110, 16, 0], [45, -104, 18, 0.8], [5, -118, 15, 1.6], [35, -112, 17, 2.4]]));
    body += at(1, 'fin', cloud(222, 84, 20) + cloud(250, 100, 14), 0.6);
    // 2칸: 확대 원 — 대부분 수증기
    body += at(2, 'fin', `<circle cx="232" cy="90" r="38" fill="none" stroke="${C.ink}" stroke-width="3"/>` + lead(264, 70, CX + R * Math.cos(3.6), CY + R * Math.sin(3.6), C.ink) + lead(266, 108, CX + R * Math.cos(2.7), CY + R * Math.sin(2.7), C.ink), 0.1);
    const rnd = seeded(23), dots = [];
    for (let row = -3; row <= 3; row++) for (let col = -3; col <= 3; col++) {
      const x = col * 44 + (row % 2 ? 22 : 0) + (rnd() - 0.5) * 14, y = row * 40 + (rnd() - 0.5) * 12;
      if (Math.hypot(x, y) <= R - 16) dots.push([x, y]);
    }
    const other = new Set([2, 9, 15]), gray = new Set([6]);
    let mol = '';
    dots.forEach(([x, y], i) => {
      const [fill, stroke] = other.has(i) ? [C.lilac, C.purple] : gray.has(i) ? ['white', C.muted] : [C.sky, C.blue];
      mol += `<g class="jig" style="animation-delay:-${f(rnd() * 1.6)}s"><circle cx="${f(CX + x)}" cy="${f(CY + y)}" r="8" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/></g>`;
    });
    body += at(2, 'pop', `<circle cx="${CX}" cy="${CY}" r="${R}" fill="white"/><g clip-path="url(#${id}-z)">${mol}</g><circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="4"/>`, 0.2);
    body += at(2, 'pop', `<circle cx="384" cy="308" r="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>` + text(399, 315, '수증기', { size: 19, anchor: 'start' }), 1.0);
    body += at(2, 'pop', `<circle cx="490" cy="308" r="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>` + text(505, 315, '다른 기체', { size: 19, anchor: 'start' }), 1.3);
    // 3칸: 화산 가스
    body += glowCircle(CX, CY, R, 3, C.green, 0.1);
    body += at(3, 'pop', lead(164, 132, 204, 104, C.green) + tag(100, 140, '화산 가스', OK, { size: 22 }), 0.5);
    body += at(3, 'pop', tag(100, 186, '기체', GRAY, { size: 19 }), 0.8);
    put('4-1/과학/3/화산 가스', svg(id, body, css));
  })();

  // ════ 지표 ════
  // 하늘과 땅속 → 빗물이 땅의 맨 겉을 따라 흘러 고임 → 지표
  (function () {
    const id = 't41-c3b-jipyo';
    let css = base(id);
    const yS = (x) => 175 - 65 * Math.exp(-(((x - 190) / 75) ** 2)) + 38 * Math.exp(-(((x - 430) / 55) ** 2));
    const surf = [];
    for (let x = 0; x <= 640; x += 8) surf.push([x, yS(x)]);
    const soil = surf.map(([x, y]) => [x, y + 26]).reverse();
    let body = `<path d="${pts(surf)} L640 360 L0 360 Z" fill="${C.line}"/>`;
    body += `<path d="${pts(surf)} ${pts(soil).replace('M', 'L')} Z" fill="${C.peach}"/>`;
    // 땅속 돌
    [[90, 270, 16], [250, 300, 20], [400, 305, 14], [470, 262, 15], [330, 250, 11]].forEach(([x, y, r]) => { body += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.7)}" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`; });
    body += `<path d="${pts(surf)}" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
    // 언덕 위 나무
    const tx = 168, ty = yS(168);
    body += `<path d="M${tx} ${f(ty + 2)} V${f(ty - 34)}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><circle cx="${tx}" cy="${f(ty - 50)}" r="24" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    // 1칸: 하늘·땅속
    body += at(1, 'pop', tag(570, 60, '하늘', COLD, { size: 19 }), 0.3) + at(1, 'pop', tag(572, 318, '땅속', GRAY, { size: 19 }), 0.6);
    // 2칸: 비구름과 빗물
    body += shown(2, `<g class="rise rise2">${cloud(370, 40, 24)}${cloud(300, 46, 18)}</g>`, 3);
    const lowX = 430, lowY = yS(430);
    const puddle = surf.filter(([, y]) => y > lowY - 24);
    body += `<g class="b2"><g class="lv pool"><path d="${pts(puddle)} Z" fill="${C.sky}"/><path d="M${f(puddle[0][0])} ${f(puddle[0][1])} H${f(puddle[puddle.length - 1][0])}" stroke="${C.blue}" stroke-width="3"/></g></g>`;
    let rain = '';
    [270, 300, 330, 360, 520, 560].forEach((x0, k) => {
      const kf = [], steps = 6;
      const y0 = yS(x0) - 7;
      kf.push(`0% { opacity: 0; transform: translate(0px, ${f(60 - y0)}px); }`, `8% { opacity: 1; }`, `35% { transform: translate(0px, 0px); }`);
      for (let i = 1; i <= steps; i++) {
        const x = x0 + ((lowX - x0) * i) / steps;
        kf.push(`${f(35 + (50 * i) / steps)}% { transform: translate(${f(x - x0)}px, ${f(yS(x) - 7 - y0)}px); }`);
      }
      kf.push(`92% { opacity: 1; }`, `100% { opacity: 0; transform: translate(${f(lowX - x0)}px, ${f(lowY - 7 - y0)}px); }`);
      css += `\n      .sc-${id} .rd${k} { animation: ${id}-rd${k} 2.6s linear ${f(k * 0.4)}s infinite; opacity: 0; }\n      @keyframes ${id}-rd${k} { ${kf.join(' ')} }`;
      rain += `<g class="rd${k}"><path d="M${x0} ${f(y0 - 11)} Q${x0 + 9} ${f(y0 + 2)} ${x0} ${f(y0 + 7)} Q${x0 - 9} ${f(y0 + 2)} ${x0} ${f(y0 - 11)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/></g>`;
    });
    body += shown(2, rain, 3);
    // 3칸: 땅의 맨 겉 선
    const Ls = Math.ceil(plen(surf));
    body += `<g class="b3"><path class="edge" d="${pts(surf)}" fill="none" stroke="${C.green}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${Ls} ${Ls}"/></g>`;
    body += at(3, 'pop', lead(300, 122, 300, yS(300) - 8, C.green) + tag(300, 100, '지표', OK, { size: 24 }), 1.2);
    css += `
      .sc-${id} .pool { transform: scaleY(0); transition: transform 1.4s ease-out 1s; }
      .on2 .sc-${id} .pool { transform: none; }
      .sc-${id} .edge { stroke-dashoffset: ${Ls}; transition: stroke-dashoffset 1.6s ease-in-out .1s; }
      .on3 .sc-${id} .edge { stroke-dashoffset: 0; }`;
    put('4-1/과학/3/지표', svg(id, body, css));
  })();

  // ── 화성암 무늬: 현무암(어둡고 아주 작은 알갱이)·화강암(밝은 바탕에 큰 알갱이와 검은 점) ──
  const GRAN = () => `<rect width="40" height="40" fill="white"/>
      <path d="M2 3 L14 1 L17 11 L8 16 L1 12 Z" fill="${C.peach}" stroke="${C.muted}" stroke-width=".8"/>
      <path d="M22 4 L35 6 L37 17 L26 19 L20 12 Z" fill="${C.line}" stroke="${C.muted}" stroke-width=".8"/>
      <path d="M18 13 L24 15 L22 22 L16 21 Z" fill="${C.ink}"/>
      <path d="M24 24 L38 23 L39 36 L28 38 L22 31 Z" fill="${C.peach}" stroke="${C.muted}" stroke-width=".8"/>
      <path d="M3 22 L13 20 L17 30 L9 37 L2 32 Z" fill="${C.line}" stroke="${C.muted}" stroke-width=".8"/>
      <path d="M33 18 L38 19 L37 24 L32 23 Z" fill="${C.ink}"/><path d="M12 32 L18 33 L18 39 L12 38 Z" fill="${C.ink}"/>`;
  const rockDefs = (id) => `<pattern id="${id}-bs" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="${C.ink}"/><circle cx="2" cy="2" r=".9" fill="${C.muted}"/><circle cx="5.3" cy="5" r=".7" fill="${C.line}" opacity=".7"/></pattern>
    <pattern id="${id}-gr" width="40" height="40" patternUnits="userSpaceOnUse">${GRAN(id)}</pattern>
    <pattern id="${id}-gs" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(.55)">${GRAN(id)}</pattern>`;
  // 화강암 확대 원 속 알갱이
  const graniteGrains = (cx, cy, R, seed) => {
    const rnd = seeded(seed);
    let s = `<rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" fill="white"/>`;
    for (let row = -6; row <= 6; row++) for (let col = -6; col <= 6; col++) {
      const x = col * 27 + (row % 2 ? 13.5 : 0) + (rnd() - 0.5) * 8, y = row * 24 + (rnd() - 0.5) * 8;
      if (Math.hypot(x, y) > R + 12) continue;
      const r = 13 + rnd() * 5, k = rnd();
      const fill = k < 0.2 ? C.ink : k < 0.48 ? C.peach : k < 0.72 ? C.line : 'white';
      const a0 = rnd() * Math.PI, p = [];
      for (let i = 0; i < 6; i++) { const a = a0 + (i * Math.PI) / 3, rr = r * (0.75 + rnd() * 0.35); p.push([cx + x + rr * Math.cos(a), cy + y + rr * Math.sin(a) * 0.9]); }
      s += `<path d="${pts(p)} Z" fill="${fill}" stroke="${C.muted}" stroke-width="1.2" stroke-linejoin="round"/>`;
    }
    return s;
  };
  const basaltInner = (cx, cy, R) => {
    let s = `<rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" fill="url(#__-bs)"/>`;
    [[-42, -34, 12, 8], [36, -52, 8, 6], [50, 34, 13, 9], [-30, 52, 8, 6], [4, 4, 6, 4.5]].forEach(([x, y, rx, ry]) => {
      s += `<ellipse cx="${cx + x}" cy="${cy + y}" rx="${rx}" ry="${ry}" fill="${C.ink}" stroke="${C.line}" stroke-width="2"/><path d="M${cx + x - rx * 0.6} ${cy + y + ry * 0.2} Q${cx + x} ${cy + y + ry * 0.9} ${cx + x + rx * 0.6} ${cy + y + ry * 0.2}" stroke="${C.muted}" stroke-width="2" fill="none"/>`;
    });
    return s;
  };

  // ════ 화성암 ════
  // 땅 위·땅속에서 식는 마그마 → 굳어 암석 → 현무암·화강암 → 화성암
  (function () {
    const id = 't41-c3b-hwaseongam';
    let css = base(id);
    const S = 112;
    let body = `<defs>${rockDefs(id)}</defs>`;
    body += `<rect x="20" y="${S}" width="350" height="${330 - S}" rx="6" fill="${C.line}"/><path d="M20 ${S} H370" stroke="${C.muted}" stroke-width="3"/>`;
    const lens = 'M70 113 Q90 94 150 93 Q220 93 250 113 Z';
    const pocket = '<ellipse cx="225" cy="275" rx="110" ry="40"/>';
    const fillShape = (attr) => `<path d="${lens}" ${attr}/>` + pocket.replace('/>', ` ${attr}/>`);
    // 굳은 암석(밑) — 주황 마그마가 사라지며 드러남
    body += `<path d="${lens}" fill="url(#${id}-bs)" stroke="${C.ink}" stroke-width="2.5"/>` + pocket.replace('/>', ` fill="url(#${id}-gr)" stroke="${C.muted}" stroke-width="2.5"/>`);
    body += `<g class="hot">${fillShape(`fill="${C.orange}" stroke="${C.red}" stroke-width="3"`)}</g>`;
    // 1칸: 열이 빠져나감
    const wave = (x, y) => `<path class="mar" d="M${x} ${y} q-8 -12 0 -24 t0 -24" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 6" fill="none" stroke-linecap="round"/>`;
    body += shown(1, wave(120, 88) + wave(180, 88) + wave(190, 228) + wave(260, 228), 2);
    // 3칸: 현무암·화강암 표본
    const stone1 = 'M395 95 L425 78 L475 86 L494 116 L478 150 L430 158 L398 140 Z';
    const stone2 = 'M395 262 L428 244 L478 250 L496 280 L480 312 L428 318 L397 300 Z';
    body += at(3, 'fin', `<path d="M250 104 L388 112" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.1);
    body += at(3, 'pop', `<path d="${stone1}" fill="url(#${id}-bs)" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>` + text(508, 126, '현무암', { size: 21, anchor: 'start' }), 0.3);
    body += at(3, 'fin', `<path d="M336 278 L388 280" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.8);
    body += at(3, 'pop', `<path d="${stone2}" fill="url(#${id}-gr)" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>` + text(508, 288, '화강암', { size: 21, anchor: 'start' }), 1.0);
    // 4칸: 둘 다 화성암
    body += at(4, 'fin', `<path d="M445 162 V181 M445 217 V240" stroke="${C.green}" stroke-width="3.5" stroke-linecap="round"/>`, 0.2);
    body += at(4, 'pop', tag(445, 199, '화성암', OK, { size: 22 }), 0.4);
    body += glowPath(stone1 + ' Z', 4, C.green, 0.7, 5) + glowPath(stone2 + ' Z', 4, C.green, 0.9, 5);
    css += `
      .sc-${id} .hot { transition: opacity 1.8s ease-in-out .4s; }
      .on2 .sc-${id} .hot { opacity: 0; }`;
    put('4-1/과학/3/화성암', svg(id, body, css));
  })();

  // ════ 현무암·화강암: 같은 틀(왼쪽 생긴 곳, 가운데 확대 원, 아래 견주기 줄) ════
  const igneous = (word, slug, kind) => {
    const id = `t41-c3b-${slug}`;
    let css = base(id);
    const CX = 445, CY = 160, R = 112, S = 120;
    let body = `<defs>${rockDefs(id)}<clipPath id="${id}-z"><circle cx="${CX}" cy="${CY}" r="${R - 2}"/></clipPath></defs>`;
    // 왼쪽: 땅 단면(지표 가까이의 용암 자리, 깊은 곳의 마그마 자리)
    body += `<rect x="20" y="${S}" width="230" height="${296 - S}" rx="6" fill="${C.line}"/><path d="M20 ${S} H250" stroke="${C.muted}" stroke-width="3"/>`;
    const lens = 'M44 121 Q62 102 120 101 Q186 101 210 121 Z';
    const pocket = [135, 250, 84, 30];
    const pocketEl = (attr) => `<ellipse cx="${pocket[0]}" cy="${pocket[1]}" rx="${pocket[2]}" ry="${pocket[3]}" ${attr}/>`;
    const near = kind === 'bs';
    const empty = `fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"`;
    if (near) {
      body += pocketEl(empty);
      body += `<path d="${lens}" fill="url(#${id}-bs)" stroke="${C.ink}" stroke-width="2.5"/><g class="hot"><path d="${lens}" fill="${C.orange}" stroke="${C.red}" stroke-width="3"/></g>`;
      body += at(1, 'pop', tag(127, 64, '빨리 식음', COLD, { size: 19 }), 0.8);
    } else {
      body += `<path d="${lens}" ${empty}/>`;
      body += pocketEl(`fill="url(#${id}-gr)" stroke="${C.muted}" stroke-width="2.5"`) + `<g class="hot">${pocketEl(`fill="${C.orange}" stroke="${C.red}" stroke-width="3"`)}</g>`;
      body += at(1, 'pop', tag(135, 176, '천천히 식음', COLD, { size: 19 }), 0.8);
    }
    // 2칸: 확대 원
    const [sx, sy, sr] = near ? [128, 110, 22] : [135, 250, 26];
    body += at(2, 'fin', `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="none" stroke="${C.ink}" stroke-width="3"/>` + lead(sx + sr * 0.8, sy - sr * 0.6, CX + R * Math.cos(near ? 3.75 : 3.4), CY + R * Math.sin(near ? 3.75 : 3.4), C.ink) + lead(sx + sr * 0.8, sy + sr * 0.6, CX + R * Math.cos(near ? 2.75 : 2.5), CY + R * Math.sin(near ? 2.75 : 2.5), C.ink), 0.1);
    const inner = near ? basaltInner(CX, CY, R).replace('__', id) : graniteGrains(CX, CY, R, 17);
    body += at(2, 'pop', `<circle cx="${CX}" cy="${CY}" r="${R}" fill="white"/><g clip-path="url(#${id}-z)">${inner}</g><circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="4"/>`, 0.2);
    // 3칸: 견주기 줄(같은 크기 표본)과 이름
    const row = [[364, 'bs', '현무암'], [500, 'gr', '화강암']];
    row.forEach(([x, k, name], i) => {
      body += at(3, 'pop', `<circle cx="${x}" cy="320" r="20" fill="url(#${id}-${k === 'gr' ? 'gs' : k})" stroke="${k === 'bs' ? C.ink : C.muted}" stroke-width="2.5"/>` + text(x + 30, 327, name, { size: 20, anchor: 'start' }), 0.15 * i);
    });
    const cur = near ? 364 : 500;
    body += glowRect(cur - 30, 294, 126, 52, 3, C.orange, 0.6, 14);
    body += glowCircle(CX, CY, R, 3, C.green, 0.4);
    body += at(3, 'pop', tag(135, 330, word, OK, { size: 24 }), 0.8);
    css += `
      .on1 .sc-${id} .hot { animation: ${id}-cool ${near ? 1.8 : 3.6}s ease-in .3s both; }
      @keyframes ${id}-cool { 0% { opacity: 1; } ${near ? 35 : 10}% { opacity: 1; } 100% { opacity: 0; } }`;
    put(`4-1/과학/3/${word}`, svg(id, body, css));
  };
  igneous('현무암', 'hyeonmuam', 'bs');
  igneous('화강암', 'hwagangam', 'gr');

  // ════ 지진 ════
  // 차곡차곡 쌓인 층 → 갑자기 끊어져 어긋남 → 떨림이 퍼져 흔들리고 갈라짐 → 지진
  (function () {
    const id = 't41-c3b-jijin';
    let css = base(id);
    const X1 = 40, X2 = 600, TOP = 140, BOT = 330;
    const fa = [330, TOP], fb = [400, BOT];
    const defs = `<defs>
      <pattern id="${id}-gv" width="36" height="24" patternUnits="userSpaceOnUse"><rect width="36" height="24" fill="${C.peach}"/><ellipse cx="9" cy="7" rx="6.5" ry="5" fill="white" stroke="${C.orange}" stroke-width="2"/><ellipse cx="27" cy="17" rx="7" ry="5" fill="white" stroke="${C.orange}" stroke-width="2"/></pattern>
      <pattern id="${id}-sd" width="14" height="12" patternUnits="userSpaceOnUse"><rect width="14" height="12" fill="white"/><rect width="14" height="12" fill="${C.yellow}" opacity=".42"/><circle cx="3.5" cy="3" r="1.6" fill="${C.orange}"/><circle cx="10.5" cy="9" r="1.6" fill="${C.orange}"/></pattern>
      <pattern id="${id}-md" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="${C.line}"/><path d="M3 4 H10 M14 9 H20" stroke="${C.muted}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/></pattern>
      <clipPath id="${id}-o"><rect x="${X1}" y="0" width="${X2 - X1}" height="${BOT}"/></clipPath>
      <clipPath id="${id}-l"><path d="M${X1} ${TOP} L${fa[0]} ${fa[1]} L${fb[0]} ${fb[1]} L${X1} ${BOT} Z"/></clipPath>
      <clipPath id="${id}-r"><path d="M${fa[0]} ${fa[1]} L${X2 + 20} ${TOP} L${X2 + 20} ${BOT + 40} L${fb[0] + 14} ${BOT + 40} Z"/></clipPath></defs>`;
    const Ls = [['sd', 38], ['md', 34], ['gv', 42], ['sd', 38], ['md', 38]];
    const layers = (side, x0, x1, extra = 0) => {
      let s = '', y = TOP;
      Ls.forEach(([p, h], k) => {
        const hh = k === Ls.length - 1 ? h + extra : h;
        s += `<g class="b1"><g class="drop drop1" style="animation-delay:${f(0.15 * k)}s"><rect x="${x0}" y="${y}" width="${x1 - x0}" height="${hh}" fill="url(#${id}-${p})"/><path d="M${x0} ${y} H${x1}" stroke="${C.muted}" stroke-width="2"/></g></g>`;
        y += h;
      });
      return `<g clip-path="url(#${id}-${side})">${s}</g>`;
    };
    const tree = (x) => `<path d="M${x} ${TOP} V${TOP - 30}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${TOP - 46}" r="22" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    let body = defs;
    let inner = layers('l', X1, 420) + `<path d="M${X1} ${TOP} H${fa[0]}" stroke="${C.muted}" stroke-width="3"/>` + tree(170);
    // 2칸: 끊어지는 금
    inner += `<g class="b2"><path class="crack" d="M${fa[0]} ${fa[1]} L${fb[0]} ${fb[1]}" stroke="${C.ink}" stroke-width="3.5" stroke-dasharray="220 220"/></g>`;
    inner += `<g class="slip">${layers('r', 300, X2 + 20, 40)}<path d="M${fa[0]} ${TOP} H${X2 + 20}" stroke="${C.muted}" stroke-width="3"/>${tree(490)}</g>`;
    body += `<g class="quake"><g clip-path="url(#${id}-o)">${inner}</g></g>`;
    // 2칸: 끊어진 자리에서 퍼지는 고리
    const mx = 365, my = 235;
    body += ring(mx, my, 26, 2, C.red, 0.5) + ring(mx, my, 26, 2, C.red, 0.9);
    // 3칸: 떨림이 퍼져 땅이 흔들림
    body += ring(mx, my, 60, 3, C.red, 0) + ring(mx, my, 60, 3, C.red, 0.5) + ring(mx, my, 60, 3, C.red, 1.0);
    const shake = (cx, cy) => [-1, 1].map((d) => [32, 41].map((o) => `<path d="M${cx + d * o} ${cy - 13} Q${cx + d * (o + 8)} ${cy} ${cx + d * o} ${cy + 13}" stroke="${C.red}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')).join('');
    body += shown(3, `<g class="jig">${shake(170, TOP - 46) + shake(499, TOP - 21)}</g>`);
    body += glowPath(`M${fa[0] - 30} ${TOP} H${fa[0]} L${fa[0] + 9} ${TOP + 25} H${fa[0] + 40}`, 3, C.orange, 1.2, 6);
    // 4칸: 지진
    body += at(4, 'pop', tag(330, 52, '지진', OK, { size: 24 }), 0.3);
    body += glowPath(`M${X1} ${TOP} H${fa[0]} L${fa[0] + 9} ${TOP + 25} H${X2}`, 4, C.green, 0.6, 6);
    css += `
      .sc-${id} .crack { stroke-dashoffset: 220; transition: stroke-dashoffset .5s ease-in .1s; }
      .on2 .sc-${id} .crack { stroke-dashoffset: 0; }
      .on2 .sc-${id} .slip { animation: ${id}-slip .7s cubic-bezier(.3, 1.4, .5, 1) .5s both; }
      @keyframes ${id}-slip { from { transform: none; } to { transform: translate(9px, 25px); } }
      .on3 .sc-${id} .quake { animation: ${id}-quake .16s linear .1s 12; }
      .on4 .sc-${id} .quake { animation: ${id}-quake .16s linear .1s 4; }
      @keyframes ${id}-quake { 0%, 100% { transform: none; } 25% { transform: translate(5px, -2px); } 50% { transform: translate(-4px, 2px); } 75% { transform: translate(3px, 1px); } }`;
    put('4-1/과학/3/지진', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
