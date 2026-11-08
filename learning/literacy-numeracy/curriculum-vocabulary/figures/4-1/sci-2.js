// 과학 4-1 낱말 도식(3단원 흐르는 물과 강 / 4단원 균류·원생생물·세균).
// 흐르는 물의 작용 셋은 교과서 흙 언덕 실험(플라스틱 상자 속 흙 언덕, 위쪽 종이컵에서 물이 흘러나옴)을 옆에서 본 그림으로 그린다.
// 상류·하류는 산에서 바다까지 강바닥을 옆에서 본 띠(위)와 그 부분을 위에서 내려다본 창(아래)으로 보인다.
// 생물은 단순한 선 그림. 균사·해캄은 초록·회색 선, 짚신벌레·세균은 연보라 몸에 보라 테두리.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·grow…) 움직임을 한 번 한다. hide 칸부터 사라진다
  const at = (n, kind, inner, s = 0, hide = 0) => `<g class="b${n}${hide ? ' h' + hide : ''}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GAS = [C.lilac, C.purple], GRAY = ['white', C.muted];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const pts = (list) => list.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');
  const glowPath = (d, n, color = C.green, s = 0, w = 6) => `<g class="b${n}"><path class="flash flash${n}"${dl(s)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 12) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const glowCircle = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="flash flash${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="6"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const drop = (x, y, r = 7) => `<path d="M${f(x)} ${f(y - r * 1.5)} Q${f(x + r * 1.05)} ${f(y - r * 0.2)} ${f(x + r)} ${f(y + r * 0.2)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y + r * 0.2)} Q${f(x - r * 1.05)} ${f(y - r * 0.2)} ${f(x)} ${f(y - r * 1.5)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
  const states = (id, cls, prop, vals, sec = 1, delay = 0.2) => `.sc-${id} .${cls} { ${prop}: ${vals[0]}; transition: ${prop} ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { ${prop}: ${v}; }`)).join('');
  // 확대해 본 동그라미 창과, 본 자리에서 창으로 잇는 두 선
  const view = (id, k, cx, cy, r, inner) => `<defs><clipPath id="${id}-v${k}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`
    + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/><g clip-path="url(#${id}-v${k})">${inner}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.muted}" stroke-width="4"/>`;
  const tie = (x, y, m, cx, cy, r) => {
    const L = Math.hypot(cx - x, cy - y), ux = (cx - x) / L, uy = (cy - y) / L, nx = -uy, ny = ux;
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${m}" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<path d="M${f(x + m * nx)} ${f(y + m * ny)} L${f(cx + r * nx)} ${f(cy + r * ny)} M${f(x - m * nx)} ${f(y - m * ny)} L${f(cx - r * nx)} ${f(cy - r * ny)}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 5"/>`;
  };
  const grain = (x, y, r, kind) => kind === 'gv'
    ? `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.8)}" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`
    : kind === 'sd' ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="1.6"/>`
      : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${C.muted}"/>`;
  const sandPat = (id) => `<pattern id="${id}-sd" width="14" height="12" patternUnits="userSpaceOnUse"><rect width="14" height="12" fill="white"/><rect width="14" height="12" fill="${C.yellow}" opacity=".42"/><circle cx="3.5" cy="3" r="1.6" fill="${C.orange}"/><circle cx="10.5" cy="9" r="1.6" fill="${C.orange}"/></pattern>`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .grow, .sc-${id} .spin, .sc-${id} .roll { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .growY, .sc-${id} .ob { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .growX, .sc-${id} .ol { transform-box: fill-box; transform-origin: 0% 50%; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .marF { animation: ${id}-mar .28s linear infinite; }
    .sc-${id} .marS { animation: ${id}-mar 1.8s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-in-out .3s; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite alternate; }
    .sc-${id} .bob { animation: ${id}-bob 2.4s ease-in-out infinite alternate; }
    .sc-${id} .fall { opacity: 0; animation: ${id}-fall 1.2s ease-in infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-grow { from { opacity: 0; transform: scale(.05); } 30% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-growY { from { opacity: 0; transform: scaleY(.02); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-growX { from { opacity: 0; transform: scaleX(.02); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jig { 0% { transform: translate(0, 0); } 33% { transform: translate(3px, -2px); } 66% { transform: translate(-2px, 2px); } 100% { transform: translate(2px, 3px); } }
    @keyframes ${id}-bob { from { transform: translateY(-4px); } to { transform: translateY(4px); } }
    @keyframes ${id}-fall { 0% { opacity: 0; transform: translateY(0); } 15%, 80% { opacity: 1; } 100% { opacity: 0; transform: translateY(54px); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .grow${n} { animation: ${id}-grow .9s ease-out both; }
    .on${n} .sc-${id} .growY${n} { animation: ${id}-growY 1s ease-out both; }
    .on${n} .sc-${id} .growX${n} { animation: ${id}-growX 1.2s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };

  // ════ 3단원 땅의 변화: 흐르는 물의 작용 — 흙 언덕 실험 ════
  // 플라스틱 상자(40~600, 위 64, 바닥 318) 안의 흙 언덕. 왼쪽 위 평평한 꼭대기에 종이컵, 비탈을 따라 물이 흐른다.
  const ys = (x) => 138 + 0.6222 * (x - 182);
  const E0 = 196, E1 = 420, DEEP = 30;
  const dep = (x) => (x <= E0 || x >= E1 ? 0 : DEEP * Math.sin((Math.PI * (x - E0)) / (E1 - E0)));
  const HXS = [];
  for (let x = E0; x <= E1; x += 8) HXS.push(x);
  const ORIG = HXS.map((x) => [x, ys(x)]);
  const LOW = HXS.map((x) => [x, ys(x) + dep(x)]);
  const HALF = HXS.map((x) => [x, ys(x) + dep(x) / 2]);
  const low = (x) => ys(x) + dep(x);
  const TOPL = [[40, 128], [146, 128], [166, 131], [182, 138]];
  const FOOT = [[452, 306], [462, 313], [478, 316], [598, 316]];
  const groundD = (mid) => `M40 318 ${pts([...TOPL, ...mid, ...FOOT]).replace('M', 'L')} V318 Z`;
  const wSlope = (mid) => [[118, 124], [146, 124], [166, 127], [182, 134], ...mid.map(([x, y]) => [x, y - 4]), [452, 302]];
  const W_FOOT = [[452, 302], [462, 309], [478, 312], [570, 312]];
  const stream = (list, cls = 'mar', attr = '') => `<path${attr} d="${pts(list)}" stroke="${C.sky}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<path class="${cls}" d="${pts(list)}" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const ground = (mid) => `<path d="${groundD(mid)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
  const puddle = `<path d="M470 309 H597 V316 H476 Z" fill="${C.sky}"/>`;
  const cupAndDrops = () => {
    let s = `<path d="M70 72 L124 72 L116 128 L78 128 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M73.5 94 L120.5 94 L116.8 125 L77.2 125 Z" fill="${C.sky}"/>`
      + `<path d="M70 72 L124 72 L116 128 L78 128 Z" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    [0, 0.4, 0.8].forEach((d) => { s += `<g class="fall" style="animation-delay:${d}s">${drop(97, 26, 6)}</g>`; });
    return s;
  };
  const box = `<path d="M40 64 V318 H600 V64" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  // 깎인 자리에 놓인 흙 알갱이(자갈·모래·흙)
  const BITS = [[236, 7, 'gv'], [262, 5, 'sd'], [290, 4, 'md'], [318, 7, 'gv'], [346, 5, 'sd'], [372, 4, 'md']];
  const bitAt = ([x, r, k]) => grain(x, low(x) - r - 1.5, r, k);
  // 알갱이가 물길을 따라 내려가는 길(깎인 자리를 따라 → 언덕 발치 → 마지막 자리). 낱알마다 keyframes 를 만든다
  const trackCss = (id, name, b, fx, fy, loop) => {
    const [x, r] = b, x0 = x, y0 = low(x) - r - 1.5;
    const P = [[x0, y0]];
    for (let xx = x + 14; xx < E1; xx += 14) P.push([xx, low(xx) - r - 2]);
    P.push([E1, ys(E1) - r - 2], [440, ys(440) - r - 2], [458, 306 - r - 2], [478, 312 - r - 1], [fx, fy]);
    const len = [0];
    for (let i = 1; i < P.length; i++) len.push(len[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const total = len[len.length - 1], end = loop ? 90 : 100;
    let k = `@keyframes ${id}-${name} { 0% { opacity: 0; transform: none; } 8% { opacity: 1; transform: none; }`;
    P.forEach(([px, py], i) => { if (i) k += ` ${f(8 + (end - 8) * len[i] / total)}% { opacity: 1; transform: translate(${f(px - x0)}px, ${f(py - y0)}px); }`; });
    if (loop) k += ` 100% { opacity: 0; transform: translate(${f(fx - x0)}px, ${f(fy - y0)}px); }`;
    return k + ' }';
  };

  // ── 침식 작용: 물이 흐르는 자리의 흙이 깎여 움푹 팬다 ──
  (function () {
    const id = 't41-c3a-chimsik';
    let css = base(id);
    let body = ground(LOW) + puddle + stream([...wSlope(LOW), ...W_FOOT.slice(1)]);
    body += `<g class="capB"><path d="${pts([...HALF, ...LOW.slice().reverse()])} Z" fill="${C.peach}" stroke="${C.peach}" stroke-width="5" stroke-linejoin="round"/></g>`;
    body += `<g class="capA"><path d="${pts([...ORIG, ...HALF.slice().reverse()])} Z" fill="${C.peach}" stroke="${C.peach}" stroke-width="3" stroke-linejoin="round"/><path d="${pts(ORIG)}" stroke="${C.orange}" stroke-width="3" fill="none"/></g>`;
    // 1칸: 처음 물줄기가 꼭대기에서 비탈을 따라 그어진다
    const top = [...wSlope(ORIG), ...W_FOOT.slice(1)];
    body += `<g class="wtop"><path class="draw draw1" pathLength="1" d="${pts(top)}" stroke="${C.sky}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + at(1, 'fin', `<path class="mar" d="${pts(top)}" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.6) + `</g>`;
    body += cupAndDrops() + box;
    body += at(1, 'pop', lead(146, 92, 125, 96) + tag(190, 92, '종이컵', GRAY, { size: 19 }), 0.3);
    body += at(1, 'pop', tag(250, 268, '흙 언덕', HOT, { size: 19 }), 0.6);
    // 2칸: 흙이 두 겹 차례로 깎여 나가고, 처음 땅 높이는 점선으로 남는다
    body += at(2, 'fin', `<path d="${pts(ORIG)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"/>`, 1.9);
    BITS.forEach((b, i) => { body += `<g class="b2"><g class="jig" style="animation-delay:${f(0.2 * i)}s">${at(2, 'pop', bitAt(b), 1.0 + 0.15 * i)}</g></g>`; });
    body += at(2, 'pop', lead(306, 160, 306, 208, C.orange) + tag(306, 142, '깎임', HOT, { size: 19 }), 1.7, 3);
    // 3칸: 움푹 팬 자리가 반짝이고 이름
    body += glowPath(pts(LOW), 3, C.orange, 0.2, 7);
    body += at(3, 'pop', lead(306, 162, 306, 208, C.orange) + tag(306, 140, '침식 작용', HOT, { size: 23 }), 0.5);
    css += `
      .sc-${id} .capA, .sc-${id} .capB, .sc-${id} .wtop { transition: opacity .9s ease-in-out; }
      .on2 .sc-${id} .wtop { opacity: 0; transition-delay: .2s; }
      .on2 .sc-${id} .capA { opacity: 0; transition-delay: .4s; }
      .on2 .sc-${id} .capB { opacity: 0; transition-delay: 1.2s; }`;
    put('4-1/과학/3/침식 작용', svg(id, body, css));
  })();

  // ── 운반 작용: 깎인 흙과 모래가 물에 실려 언덕 아래로 옮겨 간다 ──
  (function () {
    const id = 't41-c3a-unban';
    let css = base(id);
    let body = ground(LOW) + puddle + `<path d="${pts(ORIG)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"/>`;
    const path = [...wSlope(LOW), ...W_FOOT.slice(1)];
    body += stream(path);
    body += cupAndDrops() + box;
    // 1칸: 깎인 자리에 흙 알갱이
    BITS.forEach((b, i) => { body += at(1, 'pop', bitAt(b), 0.3 + 0.15 * i, 2); });
    body += at(1, 'pop', lead(306, 160, 306, 208, C.orange) + tag(306, 142, '깎인 흙', HOT, { size: 19 }), 1.2, 2);
    // 2칸: 알갱이들이 물길을 따라 계속 실려 내려간다
    let tr = '';
    const ends = [[520, 307], [540, 309], [560, 307], [500, 309], [580, 308], [530, 310]];
    BITS.forEach((b, i) => { css += trackCss(id, 'k' + i, b, ends[i][0], ends[i][1] - b[1], true); });
    for (let k = 0; k < 2; k++) {
      BITS.forEach((b, i) => { tr += `<g class="trav" style="animation-name:${id}-k${i};animation-delay:${f(0.4 * i + 1.3 * k)}s">${bitAt(b)}</g>`; });
    }
    body += shown(2, tr);
    body += at(2, 'fin', `<path d="M226 120 L408 233" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>` + head(408, 233, Math.atan2(113, 182), C.blue, 4), 0.3);
    body += at(2, 'pop', tag(262, 104, '옮김', COLD, { size: 19 }), 0.6, 3);
    // 3칸: 물길이 반짝이고 이름
    body += glowPath(pts(path), 3, C.blue, 0.2, 9);
    body += at(3, 'pop', tag(272, 102, '운반 작용', COLD, { size: 23 }), 0.5);
    css += `
      .sc-${id} .trav { opacity: 0; }
      .on2 .sc-${id} .trav { animation-duration: 2.6s; animation-timing-function: linear; animation-iteration-count: infinite; }`;
    put('4-1/과학/3/운반 작용', svg(id, body, css));
  })();

  // ── 퇴적 작용: 실려 온 흙과 모래가 언덕 아래 평평한 곳에 쌓인다 ──
  (function () {
    const id = 't41-c3a-toejeok';
    let css = base(id);
    const A = [424, ys(424)], Q1 = [470, 291], B = [597, 304];
    const qp = (t) => [(1 - t) ** 2 * A[0] + 2 * t * (1 - t) * Q1[0] + t * t * B[0], (1 - t) ** 2 * A[1] + 2 * t * (1 - t) * Q1[1] + t * t * B[1]];
    const pileD = `M${f(A[0])} ${f(A[1])} Q${Q1[0]} ${Q1[1]} ${B[0]} ${B[1]} L597 316 L478 316 Q462 316 452 306 Z`;
    let body = `<defs>${sandPat(id)}</defs>` + ground(LOW) + puddle + `<path d="${pts(ORIG)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"/>`;
    body += stream(wSlope(LOW));
    body += shown(1, stream(W_FOOT, 'marS'), 2);
    body += cupAndDrops();
    // 1칸: 알갱이들이 물에 실려 계속 내려온다
    let tr = '';
    const ends = [[520, 307], [540, 309], [560, 307], [500, 309], [580, 308], [530, 310]];
    BITS.forEach((b, i) => { css += trackCss(id, 'k' + i, b, ends[i][0], ends[i][1] - b[1], true); });
    for (let k = 0; k < 2; k++) {
      BITS.forEach((b, i) => { tr += `<g class="trav" style="animation-name:${id}-k${i};animation-delay:${f(0.4 * i + 1.3 * k)}s">${bitAt(b)}</g>`; });
    }
    body += shown(1, tr, 2);
    // 2칸: 평평한 곳에 이르러 멈추고, 흙더미가 솟는다
    body += `<g class="b2"><g class="growY growY2" style="animation-delay:1.3s"><path d="${pileD}" fill="url(#${id}-sd)" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/></g></g>`;
    const top = [];
    for (let t = 0; t <= 1.0001; t += 0.1) { const [x, y] = qp(t); top.push([x, y - 4]); }
    body += at(2, 'fin', stream(top, 'marS'), 2.2);
    let st = '';
    const rest = [0.3, 0.4, 0.5, 0.6, 0.7, 0.82];
    BITS.forEach((b, i) => {
      const [x, y] = qp(rest[i]);
      css += trackCss(id, 's' + i, b, x, y - b[1] - 1, false);
      st += `<g class="set" style="animation-name:${id}-s${i};animation-delay:${f(0.12 * i)}s">${bitAt(b)}</g>`;
    });
    body += shown(2, st);
    body += box;
    body += at(2, 'pop', lead(520, 250, 516, 288, C.green) + tag(520, 232, '쌓임', OK, { size: 19 }), 2.0, 3);
    // 3칸: 쌓인 흙더미가 반짝이고 이름
    body += glowPath(pileD, 3, C.green, 0.2, 5);
    body += at(3, 'pop', lead(510, 250, 510, 288, C.green) + tag(500, 230, '퇴적 작용', OK, { size: 23 }), 0.5);
    css += `
      .sc-${id} .trav, .sc-${id} .set { opacity: 0; }
      .on1 .sc-${id} .trav { animation-duration: 2.6s; animation-timing-function: linear; animation-iteration-count: infinite; }
      .on2 .sc-${id} .set { animation-duration: 2.2s; animation-timing-function: ease-out; animation-fill-mode: both; }`;
    put('4-1/과학/3/퇴적 작용', svg(id, body, css));
  })();

  // ════ 3단원: 강 상류와 하류 ════
  // 위: 산(왼쪽)에서 바다(오른쪽)까지 강바닥을 옆에서 본 띠. 230 왼쪽은 경사가 급하고 오른쪽은 완만하다.
  const PROF = [[30, 34], [80, 57], [130, 81], [180, 106], [230, 130], [300, 143], [380, 152], [460, 159], [566, 166]];
  const UP = PROF.slice(0, 5), DOWN = PROF.slice(4);
  const lift = (list, d = 4) => list.map(([x, y]) => [x, y - d]);
  const profile = (id, under = '') => {
    let s = `<path d="M0 190 L0 40 L16 28 ${pts(PROF).replace('M', 'L')} L566 190 Z" fill="${C.mint}"/>`
      + `<path d="M0 40 L16 28 ${pts(PROF).replace('M', 'L')}" fill="none" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M566 164 H640 V190 H566 Z" fill="${C.sky}"/><path d="M566 164 H640" stroke="${C.blue}" stroke-width="2.5"/>`
      + text(58, 150, '산', { size: 20, color: C.green }) + text(603, 150, '바다', { size: 19, color: C.blue }) + under;
    s += `<path class="draw draw1" pathLength="1" d="${pts(lift(PROF))}" stroke="${C.sky}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += at(1, 'fin', `<path class="marF" d="${pts(lift(UP))}" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" fill="none" stroke-linecap="round"/>`
      + `<path class="marS" d="${pts(lift(DOWN))}" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" fill="none" stroke-linecap="round"/>`, 1.7);
    return s;
  };
  // 위에서 내려다본 창: 물길 띠(y1~y2), 물 흐름 줄
  const card = (id, x, y, w, h, inner) => `<defs><clipPath id="${id}-cd"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/></clipPath></defs>`
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${C.mint}"/><g clip-path="url(#${id}-cd)">${inner}</g>`
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
  const rock = (cx, cy, r, seed) => {
    const rnd = seeded(seed), p = [];
    for (let k = 0; k < 7; k++) { const a = (k / 7) * Math.PI * 2, rr = r * (0.78 + 0.3 * rnd()); p.push([cx + rr * Math.cos(a), cy + rr * 0.8 * Math.sin(a)]); }
    return `<path d="${pts(p)} Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><path d="M${f(cx - r * 0.4)} ${f(cy + r * 0.25)} L${f(cx + r * 0.1)} ${f(cy - r * 0.05)}" stroke="${C.line}" stroke-width="2.5" stroke-linecap="round"/>`;
  };
  const bracket = (x, y1, y2, color = C.red) => `<path d="M${x - 9} ${y1} H${x + 9} M${x} ${y1} V${y2} M${x - 9} ${y2} H${x + 9}" stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none"/>`;

  // ── 상류: 산 가까운 위쪽. 경사가 급하고, 강폭이 좁고, 큰 바위가 많다 ──
  (function () {
    const id = 't41-c3a-sangryu';
    let css = base(id);
    let body = profile(id, glowPath(pts(lift(UP, 0)), 2, C.orange, 0.1, 7));
    // 2칸: 위쪽 부분 표시와 내려다본 창
    body += at(2, 'pop', `<ellipse cx="130" cy="80" rx="62" ry="40" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 6"/>`, 0.2);
    body += at(2, 'fin', `<path d="M130 120 V206" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="6 5"/>`, 0.4);
    let inner = `<rect x="24" y="260" width="376" height="32" fill="${C.sky}"/><path d="M24 260 H400 M24 292 H400" stroke="${C.blue}" stroke-width="2.5"/>`
      + `<path class="marF" d="M24 276 H400" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10"/>`;
    // 3칸: 큰 바위
    const rocks = [[70, 246, 21, 3], [150, 304, 24, 5], [232, 248, 19, 7], [306, 304, 22, 11], [196, 278, 15, 13], [110, 276, 13, 17], [352, 250, 17, 19]];
    rocks.forEach(([x, y, r, s], i) => { inner += at(3, 'pop', rock(x, y, r, s), 0.2 + 0.12 * i); });
    inner += at(3, 'fin', [[182, 270], [124, 270], [290, 286]].map(([x, y]) => `<g class="jig"><path d="M${x} ${y} q6 -8 12 0 M${x + 4} ${y + 10} q6 -8 12 0" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join(''), 0.9);
    inner += at(2, 'grow', bracket(382, 260, 292), 1.0);
    body += at(2, 'rise', card(id, 24, 206, 376, 140, inner), 0.5);
    // 오른쪽 이름표
    body += at(2, 'pop', tag(512, 230, '경사 급함', HOT), 0.9) + at(2, 'pop', tag(512, 277, '강폭 좁음', HOT), 1.2);
    body += at(3, 'pop', tag(512, 324, '침식 활발', HOT), 0.8);
    // 4칸: 이름
    body += at(4, 'pop', tag(222, 62, '상류', HOT, { size: 24 }), 0.3);
    body += ring(130, 80, 44, 4, C.orange, 0.5);
    put('4-1/과학/3/상류', svg(id, body, css));
  })();

  // ── 하류: 바다 가까운 아래쪽. 경사가 완만하고, 강폭이 넓고, 모래가 쌓인다 ──
  (function () {
    const id = 't41-c3a-haryu';
    let css = base(id);
    let body = `<defs>${sandPat(id)}</defs>` + profile(id, glowPath(pts(lift(DOWN, 0)), 2, C.green, 0.1, 7));
    body += at(2, 'pop', `<ellipse cx="455" cy="156" rx="96" ry="26" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="8 6"/>`, 0.2);
    body += at(2, 'fin', `<path d="M455 182 V206" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="6 5"/>`, 0.4);
    let inner = `<rect x="240" y="222" width="376" height="112" fill="${C.sky}"/><path d="M240 222 H616 M240 334 H616" stroke="${C.blue}" stroke-width="2.5"/>`;
    [250, 278, 306].forEach((y) => { inner += `<path class="marS" d="M240 ${y} H616" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10"/>`; });
    // 3칸: 강가에 모래톱이 솟는다
    inner += `<g class="b3"><g class="growY growY3" style="animation-delay:.3s"><path d="M330 334 Q360 314 430 312 Q500 312 540 334 Z" fill="url(#${id}-sd)" stroke="${C.orange}" stroke-width="2.5"/></g></g>`;
    inner += `<g class="b3"><g class="growY growY3" style="animation-delay:.7s;transform-origin:50% 0%"><path d="M440 222 Q470 240 530 240 Q590 240 616 230 L616 222 Z" fill="url(#${id}-sd)" stroke="${C.orange}" stroke-width="2.5"/></g></g>`;
    inner += at(2, 'grow', bracket(264, 222, 334), 1.0);
    body += at(2, 'rise', card(id, 240, 206, 376, 140, inner), 0.5);
    body += at(2, 'pop', tag(128, 230, '경사 완만', OK), 0.9) + at(2, 'pop', tag(128, 277, '강폭 넓음', OK), 1.2);
    body += at(3, 'pop', tag(128, 324, '퇴적 활발', OK), 0.8);
    body += at(4, 'pop', tag(455, 104, '하류', OK, { size: 24 }), 0.3);
    body += ring(455, 156, 50, 4, C.green, 0.5);
    put('4-1/과학/3/하류', svg(id, body, css));
  })();

  // ── 강폭: 위에서 내려다본 강. 이쪽 강가에서 건너편 강가까지 ──
  (function () {
    const id = 't41-c3a-gangpok';
    let css = base(id);
    const yc = (x) => 190 + 34 * Math.sin((x - 40) / 110);
    const hw = (x) => 11 + 62 * Math.pow(Math.min(1, Math.max(0, (x - 20) / 600)), 1.25);
    const xs = [];
    for (let x = -10; x <= 650; x += 10) xs.push(x);
    const upper = xs.map((x) => [x, yc(x) - hw(x)]), lower = xs.map((x) => [x, yc(x) + hw(x)]);
    let body = `<rect width="640" height="360" fill="${C.mint}"/>`;
    body += `<path d="${pts([...upper, ...lower.slice().reverse()])} Z" fill="${C.sky}"/>`;
    body += `<path d="${pts(upper)}" stroke="${C.blue}" stroke-width="3" fill="none"/><path d="${pts(lower)}" stroke="${C.blue}" stroke-width="3" fill="none"/>`;
    body += `<path class="mar" d="${pts(xs.map((x) => [x, yc(x)]))}" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" fill="none"/>`;
    body += at(1, 'pop', tag(70, 136, '상류', HOT), 0.3) + at(1, 'pop', tag(580, 300, '하류', OK), 0.6);
    // 1칸: 양쪽 강가 선이 반짝인다
    body += glowPath(pts(upper.filter(([x]) => x >= 0 && x <= 640)), 1, C.green, 0.9, 5) + glowPath(pts(lower.filter(([x]) => x >= 0 && x <= 640)), 1, C.green, 0.9, 5);
    // 2칸: 상류 쪽에서 이쪽 강가부터 건너편 강가까지 잰다
    const m = (x, n, s, color) => {
      const c = yc(x), w = hw(x);
      return `<g class="b${n}"><g class="grow grow${n}"${dl(s)}><path d="M${x} ${f(c)} V${f(c - w + 3)} M${x} ${f(c)} V${f(c + w - 3)}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`
        + head(x, f(c - w + 3), -Math.PI / 2, color, 4) + head(x, f(c + w - 3), Math.PI / 2, color, 4) + `</g></g>`
        + at(n, 'pop', `<circle cx="${x}" cy="${f(c - w)}" r="6" fill="white" stroke="${color}" stroke-width="3"/><circle cx="${x}" cy="${f(c + w)}" r="6" fill="white" stroke="${color}" stroke-width="3"/>`, s - 0.3);
    };
    body += m(213, 2, 0.6, C.red);
    body += at(2, 'pop', tag(213, 168, '강폭', HOT, { size: 22 }), 1.3);
    // 3칸: 하류 쪽에서도 잰다
    body += m(558, 3, 0.6, C.red);
    body += at(3, 'pop', tag(213, 284, '좁음', HOT), 1.2) + at(3, 'pop', tag(486, 156, '넓음', OK), 1.4);
    // 4칸: 두 화살표가 반짝이고 이름이 두근거린다
    body += glowRect(198, yc(213) - hw(213) - 10, 30, 2 * hw(213) + 20, 4, C.red, 0.1, 10) + glowRect(543, yc(558) - hw(558) - 10, 30, 2 * hw(558) + 20, 4, C.red, 0.1, 10);
    body += `<g class="b4"><g class="pulse pulse4">${tag(213, 168, '강폭', HOT, { size: 22 })}</g></g>`;
    put('4-1/과학/3/강폭', svg(id, body, css));
  })();

  // ── 경사: 널빤지 한쪽을 들어 올릴수록 많이 기울고, 공이 빨리 굴러 내려간다 ──
  (function () {
    const id = 't41-c3a-gyeongsa';
    let css = base(id);
    const PX = 520, PY = 288;
    const wedge = (deg, r, fill, stroke) => {
      const a = (deg * Math.PI) / 180;
      return `<path d="M${PX} ${PY} L${PX - r} ${PY} A${r} ${r} 0 0 1 ${f(PX - r * Math.cos(a))} ${f(PY - r * Math.sin(a))} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
    };
    const ball = (cx) => `<circle cx="${cx}" cy="258" r="14" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><path d="M${cx - 14} 258 H${cx + 14}" stroke="${C.blue}" stroke-width="2.5"/>`;
    let body = `<rect x="40" y="290" width="560" height="14" fill="${C.line}"/><path d="M40 290 H600" stroke="${C.muted}" stroke-width="3"/>`;
    body += shown(2, wedge(12, 110, C.mint, C.green), 3) + shown(3, wedge(28, 110, C.peach, C.orange));
    body += `<g class="post"><rect x="172" y="108" width="20" height="180" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/></g>`;
    body += `<g class="tilt"><rect x="120" y="240" width="400" height="48" fill="none"/>`
      + `<rect x="120" y="272" width="400" height="16" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + shown(1, ball(320), 2)
      + `<g class="b2 h3"><g class="roll roll2">${ball(145)}</g></g>`
      + `<g class="b3"><g class="roll roll3">${ball(145)}</g></g>`
      + `</g>`;
    body += `<circle cx="${PX}" cy="${PY}" r="6" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    body += at(1, 'pop', tag(320, 200, '평평함', GRAY), 0.5, 2);
    body += at(2, 'pop', tag(588, 236, '완만', OK), 1.1, 3);
    body += at(3, 'pop', tag(588, 236, '급함', HOT), 1.1);
    // 4칸: 기운 정도(부채꼴)에 이름
    body += ring(470, 270, 34, 4, C.orange, 0.2);
    body += at(4, 'pop', tag(330, 262, '경사', HOT, { size: 24 }) + lead(366, 266, 440, 274, C.orange), 0.4);
    css += states(id, 'tilt', 'transform', ['rotate(0deg)', 'rotate(0deg)', 'rotate(12deg)', 'rotate(28deg)'], 0.9, 0.1)
      + states(id, 'post', 'transform', ['scaleY(0)', 'scaleY(0)', 'scaleY(.399)', 'scaleY(.998)'], 0.9, 0.1) + `
      .sc-${id} .tilt { transform-box: fill-box; transform-origin: 100% 100%; }
      .sc-${id} .post { transform-box: fill-box; transform-origin: 50% 100%; }
      @keyframes ${id}-roll { from { transform: none; } to { transform: translateX(340px) rotate(720deg); } }
      .on2 .sc-${id} .roll2 { animation: ${id}-roll 2.8s ease-in 1.1s both; }
      .on3 .sc-${id} .roll3 { animation: ${id}-roll 1s ease-in 1.1s both; }`;
    put('4-1/과학/3/경사', svg(id, body, css));
  })();

  // ── 완만: 높이가 같은 언덕의 두 비탈. 오른쪽 비탈은 살짝만 기울어 공이 천천히 내려온다 ──
  (function () {
    const id = 't41-c3a-wanman';
    let css = base(id);
    const PK = [200, 104], BL = [110, 300], BR = [570, 300], R = 13;
    const ball = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${R}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><path d="M${f(x - R)} ${f(y)} H${f(x + R)}" stroke="${C.blue}" stroke-width="2.5"/>`;
    // 비탈 하나: 꼭대기에서 조금 내려온 자리 → 바닥 → 바닥 위로 조금 더
    const side = (B, dir, more) => {
      const L = Math.hypot(B[0] - PK[0], B[1] - PK[1]), ux = (B[0] - PK[0]) / L, uy = (B[1] - PK[1]) / L;
      const nx = uy * dir, ny = -ux * dir;
      const nn = ny > 0 ? [-nx, -ny] : [nx, ny];
      const s0 = [PK[0] + 20 * ux + R * nn[0], PK[1] + 20 * uy + R * nn[1]], s1 = [B[0] + R * nn[0], B[1] + R * nn[1]], s2 = [B[0] + more, B[1] - R];
      return { s0, d1: [s1[0] - s0[0], s1[1] - s0[1]], d2: [s2[0] - s0[0], s2[1] - s0[1]], L, ang: Math.atan2(B[1] - PK[1], Math.abs(B[0] - PK[0])) };
    };
    const SL = side(BL, 1, -46), SR = side(BR, -1, 30);
    const wedge = (B, r, a, left, fill, stroke) => {
      const ex = left ? B[0] + r * Math.cos(a) : B[0] - r * Math.cos(a), ey = B[1] - r * Math.sin(a);
      return `<path d="M${B[0]} ${B[1]} L${left ? B[0] + r : B[0] - r} ${B[1]} A${r} ${r} 0 0 ${left ? 0 : 1} ${f(ex)} ${f(ey)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
    };
    let body = `<rect x="30" y="300" width="580" height="14" fill="${C.line}"/><path d="M30 300 H610" stroke="${C.muted}" stroke-width="3"/>`;
    body += at(1, 'growY', `<path d="M${BL[0]} 300 L${PK[0]} ${PK[1]} L${BR[0]} 300 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`, 0.2);
    body += at(1, 'fin', `<path d="M${PK[0]} ${PK[1]} V300" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.9);
    body += at(1, 'fin', wedge(BL, 44, SL.ang, true, C.peach, C.red), 1.1) + at(1, 'fin', wedge(BR, 64, SR.ang, false, C.mint, C.green), 1.3);
    // 2칸: 꼭대기에서 공 두 개를 굴린다
    body += `<g class="b2"><g class="rl rlL">${ball(...SL.s0)}</g></g><g class="b2"><g class="rl rlR">${ball(...SR.s0)}</g></g>`;
    body += at(2, 'pop', tag(92, 176, '빠르게', HOT, { size: 19 }), 0.9, 3) + at(2, 'pop', tag(450, 166, '천천히', OK, { size: 19 }), 1.4, 3);
    // 3칸: 이름
    body += glowPath(`M${BL[0]} 300 L${PK[0]} ${PK[1]}`, 3, C.red, 0.1, 6) + glowPath(`M${PK[0]} ${PK[1]} L${BR[0]} 300`, 3, C.green, 0.4, 7);
    body += at(3, 'pop', tag(92, 176, '급함', HOT), 0.3) + at(3, 'pop', tag(450, 164, '완만', OK, { size: 24 }), 0.7);
    const rot = (d, k) => f((Math.hypot(...d) / (2 * Math.PI * R)) * 360 * k);
    css += `
      .sc-${id} .rl { transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-L { 0% { transform: none; } 82% { transform: translate(${f(SL.d1[0])}px, ${f(SL.d1[1])}px) rotate(${rot(SL.d1, -1)}deg); } 100% { transform: translate(${f(SL.d2[0])}px, ${f(SL.d2[1])}px) rotate(${rot(SL.d2, -1)}deg); } }
      @keyframes ${id}-R { 0% { transform: none; } 88% { transform: translate(${f(SR.d1[0])}px, ${f(SR.d1[1])}px) rotate(${rot(SR.d1, 1)}deg); } 100% { transform: translate(${f(SR.d2[0])}px, ${f(SR.d2[1])}px) rotate(${rot(SR.d2, 1)}deg); } }
      .on2 .sc-${id} .rlL { animation: ${id}-L .9s cubic-bezier(.5, 0, .9, .6) .6s both; }
      .on2 .sc-${id} .rlR { animation: ${id}-R 2.8s cubic-bezier(.45, 0, .8, .7) .6s both; }`;
    put('4-1/과학/3/완만', svg(id, body, css));
  })();

  // ════ 4단원 다양한 생물과 우리 생활 ════
  // 짚신벌레 몸(가운데 0,0, 길이 2L, 너비 2W). 한쪽 옆이 살짝 들어간 길쭉한 모양.
  const slipperD = (L = 90, W = 34) => `M${-L} 0 C${-L} ${-W}, ${-L * 0.6} ${-W * 1.15}, ${-L * 0.15} ${-W * 1.1} C${L * 0.4} ${-W * 1.05}, ${L} ${-W * 0.95}, ${L} 0 C${L} ${W * 0.85}, ${L * 0.6} ${W * 1.08}, ${L * 0.2} ${W * 1.02} C${-L * 0.1} ${W * 0.95}, ${-L * 0.2} ${W * 0.6}, ${-L * 0.42} ${W * 0.68} C${-L * 0.72} ${W * 0.8}, ${-L} ${W * 0.85}, ${-L} 0 Z`;
  const paramecium = (cx, cy, s = 1) => {
    const L = 90 * s, W = 34 * s;
    return `<g transform="translate(${f(cx)} ${f(cy)})">`
      + `<path d="${slipperD(L * 1.08, W * 1.16)}" fill="none" stroke="${C.purple}" stroke-width="${f(2 * Math.max(s, 0.7))}" stroke-dasharray="2 6" stroke-linecap="round"/>`
      + `<path d="${slipperD(L, W)}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="${f(3 * Math.max(s, 0.7))}"/>`
      + `<ellipse cx="${f(L * 0.05)}" cy="${f(-W * 0.15)}" rx="${f(L * 0.22)}" ry="${f(W * 0.38)}" fill="${C.purple}" opacity=".35"/>`
      + `<path d="M${f(L * 0.2)} ${f(W * 0.9)} Q${f(-L * 0.1)} ${f(W * 0.35)} ${f(-L * 0.36)} ${f(W * 0.55)}" fill="none" stroke="${C.purple}" stroke-width="${f(2.5 * Math.max(s, 0.7))}" stroke-linecap="round"/>`
      + `<circle cx="${f(-L * 0.62)}" cy="${f(-W * 0.2)}" r="${f(W * 0.24)}" fill="white" stroke="${C.purple}" stroke-width="2"/>`
      + `<circle cx="${f(L * 0.62)}" cy="${f(-W * 0.15)}" r="${f(W * 0.24)}" fill="white" stroke="${C.purple}" stroke-width="2"/></g>`;
  };
  // 해캄 한 가닥: 가늘고 긴 관, 칸막이, 칸 속 초록 띠
  const filament = (x0, len, y, h = 20) => {
    let s = `<rect x="${x0}" y="${f(y - h / 2)}" width="${len}" height="${h}" rx="${h / 2}" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    let zz = '';
    for (let x = x0 + 6, k = 0; x <= x0 + len - 6; x += 9, k++) zz += `${zz ? 'L' : 'M'}${x} ${f(y + (k % 2 ? 5 : -5))} `;
    s += `<path d="${zz}" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`;
    for (let x = x0 + 46; x < x0 + len - 20; x += 46) s += `<path d="M${x} ${f(y - h / 2)} V${f(y + h / 2)}" stroke="${C.green}" stroke-width="2.5"/>`;
    return s;
  };
  const mushroom = (x, y, s = 1) => `<rect x="${f(x - 11 * s)}" y="${f(y - 62 * s)}" width="${f(22 * s)}" height="${f(62 * s)}" rx="${f(6 * s)}" fill="white" stroke="${C.muted}" stroke-width="3"/>`
    + `<path d="M${f(x - 56 * s)} ${f(y - 56 * s)} Q${f(x - 52 * s)} ${f(y - 118 * s)} ${f(x)} ${f(y - 118 * s)} Q${f(x + 52 * s)} ${f(y - 118 * s)} ${f(x + 56 * s)} ${f(y - 56 * s)} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
  const bacRod = (cx, cy, a, w = 46, h = 18) => `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" transform="rotate(${a} ${f(cx)} ${f(cy)})"/>`;
  const waveD = (x0, y0, len, amp, turns) => {
    const p = [];
    for (let i = 0; i <= 48; i++) { const t = i / 48; p.push([x0 + len * t, y0 + amp * Math.sin(t * turns * Math.PI * 2)]); }
    return pts(p);
  };
  const bacSpiral = (x0, y0, len = 70, amp = 9, turns = 2.5) => `<path d="${waveD(x0, y0, len, amp, turns)}" fill="none" stroke="${C.purple}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="${waveD(x0, y0, len, amp, turns)}" fill="none" stroke="${C.lilac}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const bacBalls = (cx, cy, r = 12) => [[0, 0], [23, 5], [11, -19], [-12, -17], [-22, 7], [3, 22], [26, -16]]
    .map(([dx, dy]) => `<circle cx="${f(cx + dx)}" cy="${f(cy + dy)}" r="${r}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`).join('');

  // ── 균사: 곰팡이와 버섯을 크게 보면 가는 실이 엉켜 있다 ──
  (function () {
    const id = 't41-c4-gyunsa';
    let css = base(id);
    const bread = `<path d="M40 335 V272 Q36 240 62 236 Q95 216 128 236 Q154 240 150 272 V335 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M50 330 V274 Q48 250 68 246 Q95 230 122 246 Q142 250 140 274 V330 Z" fill="white" opacity=".55"/>`;
    const molds = [[78, 288, 14], [114, 306, 10], [104, 264, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.line}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="3 3"/>`).join('');
    let body = bread + `<g class="b1"><g class="pulse pulse1">${molds}</g></g>` + text(95, 354, '곰팡이', { size: 19 });
    body += mushroom(566, 334, 0.9) + text(566, 354, '버섯', { size: 19 });
    // 1칸: 곰팡이를 크게 본 창. 엉킨 실이 그어진다
    const rnd = seeded(21);
    let t1 = '';
    for (let k = 0; k < 10; k++) {
      const x1 = 140 + rnd() * 160, y1 = 50 + rnd() * 160, x2 = 140 + rnd() * 160, y2 = 50 + rnd() * 160;
      const c1x = 140 + rnd() * 160, c1y = 50 + rnd() * 160, c2x = 140 + rnd() * 160, c2y = 50 + rnd() * 160;
      t1 += `<path class="draw draw1" pathLength="1" style="transition-delay:${f(0.5 + 0.12 * k)}s" d="M${f(x1)} ${f(y1)} C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(x2)} ${f(y2)}" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    body += at(1, 'fin', tie(78, 288, 17, 220, 130, 92), 0.2);
    body += at(1, 'pop', view(id, 1, 220, 130, 92, t1), 0.3);
    // 2칸: 버섯을 크게 본 창. 가늘고 긴 실이 나란히 모여 있다
    let t2 = '';
    for (let k = 0; k < 9; k++) {
      const x = 368 + k * 18, w = 5 + (k % 3) * 2;
      t2 += `<path class="draw draw2" pathLength="1" style="transition-delay:${f(0.5 + 0.1 * k)}s" d="M${x} 36 C${x + w} 80 ${x - w} 120 ${x + 2} 160 S${x - w} 210 ${x + 3} 230" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    body += at(2, 'fin', tie(566, 300, 14, 440, 130, 92), 0.2);
    body += at(2, 'pop', view(id, 2, 440, 130, 92, t2), 0.3);
    // 3칸: 이름
    body += at(3, 'pop', lead(300, 262, 270, 214) + lead(360, 262, 390, 214) + tag(330, 274, '균사', OK, { size: 24 }), 0.4);
    body += ring(220, 130, 92, 3, C.green, 0.2) + ring(440, 130, 92, 3, C.green, 0.2);
    put('4-1/과학/4/균사', svg(id, body, css));
  })();

  // ── 포자: 균사 끝 주머니에서 작은 알갱이가 날아가 새 곰팡이가 자란다 ──
  (function () {
    const id = 't41-c4-poja';
    let css = base(id);
    let body = `<rect x="20" y="300" width="600" height="40" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + text(600, 328, '빵', { size: 19, anchor: 'end', color: C.orange });
    const colony = (n, kind, stalks, s0, baseX) => {
      let s = '';
      [0, 1, 2].forEach((k) => {
        const x = baseX + k * 44;
        s += `<g class="b${n}"><path class="draw draw${n}" pathLength="1" style="transition-delay:${f(s0 + 0.1 * k)}s" d="M${x - 22} 298 q11 -9 22 0 t22 0" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/></g>`;
      });
      stalks.forEach(([x, top, bend], k) => {
        s += at(n, 'growY', `<path d="M${x} 299 Q${x + bend} ${f((299 + top) / 2)} ${x} ${top + 15}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/>`, s0 + 0.2 + 0.15 * k);
        const sp = [[-6, -4], [5, -6], [0, 5], [-5, 6], [6, 4]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${top + dy}" r="3" fill="${C.purple}"/>`).join('');
        s += at(n, 'pop', `<circle cx="${x}" cy="${top}" r="16" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>${sp}`, s0 + 0.9 + 0.15 * k);
      });
      return s;
    };
    const SAC = [[90, 176, 8], [134, 150, -6], [178, 184, 7], [218, 204, -5]];
    body += colony(1, 'old', SAC, 0, 90);
    body += at(1, 'pop', lead(266, 252, 222, 262) + tag(290, 240, '균사', GRAY, { size: 19 }), 1.4);
    body += at(1, 'pop', lead(160, 78, 138, 133) + tag(160, 62, '주머니', GAS, { size: 19 }), 1.8);
    // 2칸: 주머니에서 나온 알갱이가 바람에 날려 오른쪽 빵 위로 간다
    body += at(2, 'fin', [[290, 110, 150], [330, 154, 120]].map(([x, y, l]) => `<path class="mar" d="M${x} ${y} q${l / 6} -10 ${l / 3} 0 t${l / 3} 0 t${l / 3} 0" stroke="${C.blue}" stroke-width="3" stroke-dasharray="14 10" fill="none" stroke-linecap="round"/>`).join(''), 0.2);
    const LAND = [452, 474, 498, 520, 544, 566];
    let fl = '';
    for (let k = 0; k < 12; k++) {
      const [sx, sy] = SAC[k % 4], lx = LAND[k % 6] + (k > 5 ? 8 : 0), ly = 294;
      const dx = lx - sx, dy = ly - sy;
      fl += `<g class="fly" style="--x1:${f(dx * 0.35)}px;--y1:${f(-60 - (k % 3) * 12)}px;--x2:${f(dx * 0.72)}px;--y2:${f(dy * 0.35 - 30)}px;--x3:${f(dx)}px;--y3:${f(dy)}px;animation-delay:${f(0.25 * k)}s"><circle cx="${sx}" cy="${sy}" r="4" fill="${C.purple}"/></g>`;
    }
    body += shown(2, fl);
    // 3칸: 내려앉은 자리에서 새 곰팡이가 자란다
    body += at(3, 'fin', LAND.map((x) => `<circle cx="${x}" cy="296" r="4" fill="${C.purple}"/>`).join(''), 0.1);
    body += colony(3, 'new', [[466, 214, 6], [510, 196, -6], [552, 222, 5]], 0.4, 466);
    // 4칸: 이름
    body += at(4, 'pop', lead(70, 120, 86, 160, C.purple) + tag(58, 102, '포자', GAS, { size: 24 }), 0.3);
    body += ring(90, 176, 22, 4, C.purple, 0.5) + ring(510, 292, 60, 4, C.purple, 0.7);
    css += `
      .sc-${id} .fly { opacity: 0; }
      .on2 .sc-${id} .fly { animation: ${id}-fly 3s ease-in-out infinite; }
      @keyframes ${id}-fly { 0% { opacity: 0; transform: none; } 8% { opacity: 1; } 40% { transform: translate(var(--x1), var(--y1)); } 70% { transform: translate(var(--x2), var(--y2)); } 92% { opacity: 1; transform: translate(var(--x3), var(--y3)); } 100% { opacity: 0; transform: translate(var(--x3), var(--y3)); } }`;
    put('4-1/과학/4/포자', svg(id, body, css));
  })();

  // ── 원생생물: 동물·식물·균류 어디에도 들지 않는 해캄과 짚신벌레 ──
  (function () {
    const id = 't41-c4-wonsaeng';
    let css = base(id);
    const boxAt = (x, label, icon) => `<rect x="${x}" y="24" width="130" height="128" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>${icon}${text(x + 65, 140, label, { size: 20 })}`;
    const fish = (cx, cy) => `<path d="M${cx + 22} ${cy} L${cx + 42} ${cy - 15} L${cx + 42} ${cy + 15} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="${cx - 4}" cy="${cy}" rx="30" ry="17" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><circle cx="${cx - 18}" cy="${cy - 4}" r="3.5" fill="${C.ink}"/>`;
    const sprout = (cx, cy) => `<path d="M${cx} ${cy + 32} V${cy - 8}" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/><path d="M${cx} ${cy - 2} Q${cx - 34} ${cy - 6} ${cx - 34} ${cy - 30} Q${cx - 6} ${cy - 30} ${cx} ${cy - 2} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M${cx} ${cy + 8} Q${cx + 34} ${cy + 4} ${cx + 34} ${cy - 22} Q${cx + 6} ${cy - 22} ${cx} ${cy + 8} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M${cx - 30} ${cy + 32} H${cx + 30}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`;
    let body = `<g class="dim">`
      + at(1, 'pop', boxAt(24, '동물', fish(85, 80)), 0.1)
      + at(1, 'pop', boxAt(168, '식물', sprout(233, 76)), 0.35)
      + at(1, 'pop', boxAt(312, '균류', mushroom(377, 120, 0.62)), 0.6) + `</g>`;
    // 3칸: 새 칸이 생기고 둘이 그리로 옮겨 간다
    body += at(3, 'fin', `<rect x="462" y="40" width="154" height="296" rx="16" fill="white" stroke="${C.purple}" stroke-width="3" stroke-dasharray="10 7"/>`, 0.1);
    // 2칸: 논물 한 방울을 크게 본 창
    body += `<g class="b2"><g class="vw">${at(2, 'pop', `<g transform="translate(70 266)">${drop(0, 0, 22)}</g>`, 0.1)}${tie(70, 266, 30, 230, 262, 82)}${view(id, 1, 230, 262, 82, '')}</g></g>`;
    const ham = `<g class="bob">${filament(170, 120, 232, 16)}</g>`;
    const jip = `<g class="jig">${paramecium(230, 292, 0.4)}</g>`;
    body += `<g class="b2"><g class="mvA">${at(2, 'fin', ham, 0.6)}</g></g><g class="b2"><g class="mvB">${at(2, 'fin', jip, 0.8)}</g></g>`;
    body += `<g class="b2"><g class="mvC">${at(2, 'pop', tag(350, 232, '해캄', OK, { size: 19 }), 1.1)}</g></g>`;
    body += `<g class="b2"><g class="mvD">${at(2, 'pop', tag(368, 292, '짚신벌레', GAS, { size: 19 }), 1.3)}</g></g>`;
    // 4칸: 이름
    body += glowRect(462, 40, 154, 296, 4, C.purple, 0.5, 16);
    body += at(4, 'pop', tag(539, 40, '원생생물', GAS, { size: 23 }), 0.3);
    css += states(id, 'dim', 'opacity', [1, 1, 1, 0.4], 0.8, 0.2)
      + states(id, 'vw', 'opacity', [1, 1, 1, 0.3], 0.8, 0.2)
      + states(id, 'mvA', 'transform', ['none', null, null, 'translate(309px, -88px)'], 1.2, 0.5)
      + states(id, 'mvB', 'transform', ['none', null, null, 'translate(309px, -52px)'], 1.2, 0.7)
      + states(id, 'mvC', 'transform', ['none', null, null, 'translate(189px, -54px)'], 1.2, 0.5)
      + states(id, 'mvD', 'transform', ['none', null, null, 'translate(171px, -14px)'], 1.2, 0.7);
    put('4-1/과학/4/원생생물', svg(id, body, css));
  })();

  // ── 해캄: 연못의 초록 실 뭉치, 크게 보면 가늘고 긴 모양 ──
  (function () {
    const id = 't41-c4-haekam';
    let css = base(id);
    let body = `<ellipse cx="160" cy="252" rx="140" ry="70" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M60 290 q10 -6 20 0 M240 210 q10 -6 20 0 M220 300 q10 -6 20 0" stroke="${C.blue}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      + text(160, 344, '연못', { size: 19, color: C.blue });
    // 1칸: 초록 실 뭉치가 떠 있다
    let clump = '';
    const rnd = seeded(5);
    for (let k = 0; k < 8; k++) {
      const y = 228 + k * 6, x = 112 + rnd() * 14, l = 80 + rnd() * 30;
      clump += `<path d="M${f(x)} ${f(y)} q${f(l / 4)} ${f(-10 + rnd() * 20)} ${f(l / 2)} 0 t${f(l / 2)} 0" fill="none" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>`;
    }
    body += at(1, 'pop', `<g class="bob">${clump}</g>`, 0.3);
    // 2칸: 한 가닥을 크게 본 창
    let inner = '';
    [[150, -8], [210, 4], [270, -3]].forEach(([y, a], k) => {
      inner += `<g transform="rotate(${a} 460 ${y})"><g class="growX growX2" style="animation-delay:${f(0.7 + 0.25 * k)}s">${filament(300, 330, y, 22)}</g></g>`;
    });
    body += at(2, 'fin', tie(165, 250, 44, 460, 190, 140), 0.1);
    body += at(2, 'pop', view(id, 1, 460, 190, 140, inner), 0.3);
    // 3칸: 이름
    body += glowCircle(460, 190, 140, 3, C.green, 0.1);
    body += at(3, 'pop', tag(460, 340, '해캄', OK, { size: 24 }), 0.4);
    put('4-1/과학/4/해캄', svg(id, body, css));
  })();

  // ── 짚신벌레: 길쭉하고 끝이 둥근 원생생물, 짚신을 닮았다 ──
  (function () {
    const id = 't41-c4-jipsin';
    let css = base(id);
    let body = '';
    body += at(1, 'drop', `<g transform="translate(110 110)">${drop(0, 0, 34)}</g>`, 0.1);
    body += at(1, 'pop', tag(110, 34, '논물', COLD, { size: 19 }), 0.5);
    body += at(1, 'fin', tie(110, 112, 42, 420, 170, 150), 0.4);
    // 2칸: 창 속에서 헤엄친다
    const inner = `<path d="M300 90 q10 -6 20 0 M500 260 q10 -6 20 0 M330 250 q10 -6 20 0" stroke="${C.sky}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + `<g class="b2"><g class="swim">${at(2, 'fin', paramecium(420, 168, 1), 0.4)}</g></g>`;
    body += at(1, 'pop', view(id, 1, 420, 170, 150, inner), 0.5);
    // 3칸: 짚신
    let sandal = `<path d="${slipperD(84, 26)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    for (let x = -64; x <= 70; x += 14) sandal += `<path d="M${x} -20 V20" stroke="${C.orange}" stroke-width="1.8" opacity=".7"/>`;
    sandal += `<path d="M30 -24 Q50 -2 30 26 M54 -22 Q38 0 54 24" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`;
    body += at(3, 'pop', `<g transform="translate(130 286)">${sandal}</g>`, 0.3);
    body += at(3, 'pop', text(130, 344, '짚신', { size: 20 }), 0.6);
    // 4칸: 이름
    body += at(4, 'pop', tag(420, 290, '짚신벌레', GAS, { size: 24 }), 0.4);
    body += glowCircle(420, 170, 150, 4, C.purple, 0.1);
    css += `
      .sc-${id} .swim { animation: ${id}-swim 3.2s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-swim { from { transform: translate(-34px, 8px) rotate(-5deg); } to { transform: translate(34px, -8px) rotate(5deg); } }`;
    put('4-1/과학/4/짚신벌레', svg(id, body, css));
  })();

  // ── 세균: 짚신벌레 옆 아주 작은 점, 더 크게 보면 공·막대·나선 모양 ──
  (function () {
    const id = 't41-c4-segyun';
    let css = base(id);
    const specks = [[204, 238], [214, 246], [222, 236], [209, 254], [228, 250], [218, 228]];
    const innerA = `<g class="swim">${paramecium(140, 150, 0.6)}</g>`
      + `<g class="pulse pulse1">${specks.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${C.purple}"/>`).join('')}</g>`;
    let body = at(1, 'pop', view(id, 1, 165, 180, 125, innerA), 0.2);
    body += at(1, 'pop', tag(165, 330, '짚신벌레 옆', GAS, { size: 19 }), 0.8, 2);
    // 2칸: 작은 점들을 훨씬 크게 본 창
    let innerB = '';
    innerB += at(2, 'pop', `<g class="jig">${bacBalls(410, 100)}</g>`, 0.8) + at(2, 'fin', text(530, 108, '공 모양', { size: 20 }), 1.0);
    innerB += at(2, 'pop', `<g class="jig" style="animation-delay:.4s">${bacRod(392, 178, -22)}${bacRod(430, 170, 18)}${bacRod(412, 198, 68, 40, 16)}</g>`, 1.2) + at(2, 'fin', text(530, 188, '막대 모양', { size: 20 }), 1.4);
    innerB += at(2, 'pop', `<g class="jig" style="animation-delay:.8s">${bacSpiral(374, 250)}${bacSpiral(384, 276, 62, 8, 2)}</g>`, 1.6) + at(2, 'fin', text(530, 268, '나선 모양', { size: 20 }), 1.8);
    body += at(2, 'fin', tie(216, 241, 20, 470, 180, 150), 0.2);
    body += at(2, 'pop', view(id, 2, 470, 180, 150, innerB), 0.4);
    // 3칸: 이름
    body += ring(216, 241, 20, 3, C.purple, 0.2);
    body += glowCircle(470, 180, 150, 3, C.purple, 0.3);
    body += at(3, 'pop', tag(470, 32, '세균', GAS, { size: 24 }), 0.4);
    css += `
      .sc-${id} .swim { animation: ${id}-swim 3.2s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-swim { from { transform: translate(-14px, 4px) rotate(-4deg); } to { transform: translate(14px, -4px) rotate(4deg); } }`;
    put('4-1/과학/4/세균', svg(id, body, css));
  })();

  // ── 단순: 식물 → 짚신벌레 → 세균, 생김새가 점점 간단해진다 ──
  (function () {
    const id = 't41-c4-dansun';
    let css = base(id);
    const cardBox = (x, w) => `<rect x="${x}" y="24" width="${w}" height="262" rx="16" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    // 식물: 꽃·잎·줄기·뿌리
    const petals = [0, 1, 2, 3, 4].map((k) => { const a = (k / 5) * Math.PI * 2 - Math.PI / 2; return `<circle cx="${f(90 + 17 * Math.cos(a))}" cy="${f(70 + 17 * Math.sin(a))}" r="12" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`; }).join('');
    const flower = petals + `<circle cx="90" cy="70" r="9" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
    const stem = `<path d="M90 86 V206" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/>`;
    const leaves = `<path d="M90 160 Q56 160 50 132 Q80 128 90 160 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M90 136 Q124 136 130 108 Q100 104 90 136 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    const roots = `<path d="M90 206 L66 246 M90 206 L90 254 M90 206 L114 244 M78 226 L60 232 M102 226 L120 230" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>`;
    const soil = `<path d="M36 206 H212" stroke="${C.muted}" stroke-width="3" stroke-dasharray="8 6"/>`;
    let body = at(1, 'pop', cardBox(24, 200) + soil + roots + stem + leaves + flower + text(124, 276, '식물', { size: 20 }), 0.1);
    [['꽃', 70, 108], ['잎', 134, 134], ['줄기', 182, 96], ['뿌리', 236, 118]].forEach(([w, y, x], k) => {
      body += at(1, 'pop', lead(x + 6, y - 6, 172, y - 6, C.line) + text(190, y, w, { size: 18, anchor: 'start', color: C.green }), 0.6 + 0.3 * k);
    });
    // 2칸: 짚신벌레와 세균
    body += at(2, 'pop', cardBox(240, 180) + `<g class="jig">${paramecium(330, 150, 0.62)}</g>` + text(330, 276, '짚신벌레', { size: 20 }), 0.2);
    body += at(2, 'pop', cardBox(436, 180) + `<g class="jig">${bacRod(526, 150, 0, 74, 28)}</g>` + text(526, 276, '세균', { size: 20 }), 0.9);
    // 3칸: 복잡 → 단순
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M112 324 H512" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/></g>`;
    body += at(3, 'fin', head(518, 324, 0, C.green, 5), 1.7);
    body += at(3, 'fin', text(70, 331, '복잡', { size: 20, color: C.muted }), 0.1);
    body += at(3, 'pop', tag(578, 324, '단순', OK, { size: 24 }), 1.8);
    body += glowRect(436, 24, 180, 262, 3, C.green, 1.9, 16);
    put('4-1/과학/4/단순', svg(id, body, css));
  })();

  // ── 나선: 철사를 막대에 빙빙 감았다가 빼면 용수철 모양 ──
  (function () {
    const id = 't41-c4-naseon';
    let css = base(id);
    const turns = 6, a = 340 / (turns * 2 * Math.PI), k = 15, R = 34, cy = 140;
    const coil = [];
    for (let t = 0; t <= turns * 2 * Math.PI + 0.001; t += 0.14) coil.push([150 + a * t + k * Math.cos(t), cy + R * Math.sin(t)]);
    const coilD = pts(coil);
    let body = `<g class="rod"><rect x="110" y="${cy - 13}" width="420" height="26" rx="8" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/></g>`;
    body += `<g class="spring"><path class="draw draw1" pathLength="1" style="transition-duration:2.2s" d="${coilD}" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>${glowPath(coilD, 4, C.green, 0.1, 8)}</g>`;
    body += at(1, 'pop', tag(80, 66, '철사', HOT, { size: 19 }) + lead(96, 84, 150, cy), 0.2);
    body += at(1, 'pop', tag(572, 72, '막대', GRAY, { size: 19 }) + lead(560, 90, 528, cy - 12), 0.5, 2);
    // 3칸: 소라 껍데기와 나선 모양 세균
    const sp = [];
    for (let t = 0; t <= 3.1 * Math.PI * 2; t += 0.12) { const r = 2 + 2.15 * t; sp.push([190 + r * Math.cos(t), 268 + r * Math.sin(t)]); }
    body += at(3, 'pop', `<circle cx="190" cy="268" r="${f(2 + 2.15 * 3.1 * Math.PI * 2 + 5)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`, 0.1);
    body += `<g class="b3"><path class="draw draw3" pathLength="1" style="transition-delay:.5s" d="${pts(sp)}" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/></g>`;
    body += at(3, 'fin', text(190, 352, '소라 껍데기', { size: 19 }), 0.6);
    body += at(3, 'pop', `<g class="jig">${bacSpiral(384, 268, 120, 16, 2.5)}</g>`, 0.9);
    body += at(3, 'fin', text(444, 352, '세균', { size: 19 }), 1.1);
    // 4칸: 이름
    body += at(4, 'pop', tag(586, 196, '나선', OK, { size: 24 }), 0.5);
    css += `
      .sc-${id} .rod { transition: transform 1.2s ease-in-out .2s, opacity .8s ease-in-out .9s; }
      .on2 .sc-${id} .rod { transform: translateX(220px); opacity: 0; }
      .sc-${id} .spring { transform-box: fill-box; transform-origin: 0% 50%; }
      .on2 .sc-${id} .spring { animation: ${id}-spring 1.4s ease-in-out 1.4s infinite alternate; }
      @keyframes ${id}-spring { from { transform: scaleX(1); } to { transform: scaleX(.82); } }`;
    put('4-1/과학/4/나선', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
