// 과학 5-1 낱말 도식(1단원 지층과 화석·3단원 용해와 용액): 쌓이고 깎이고 굳고 녹는 과정을 코드로 그린다.
// 퇴적물 색: 자갈은 살구 바탕에 흰 돌, 모래는 옅은 노랑에 주황 점, 진흙은 회색. 층은 무늬(pattern)로 칠한다.
// 이암·사암·역암은 같은 확대 원(가운데 큰 원)에 알갱이 크기만 다르게 그린다.
// 녹아서 눈에 안 보이는 알갱이는 확대 원 안에서만 작은 동그라미로 보인다(비커 물은 투명하게 둔다).
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·sink) 움직임을 한 번 한다
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

  // 층 무늬: 자갈(gv)·모래(sd)·진흙(md)
  const defs = (id, extra = '') => `<defs>
    <pattern id="${id}-gv" width="36" height="24" patternUnits="userSpaceOnUse"><rect width="36" height="24" fill="${C.peach}"/><ellipse cx="9" cy="7" rx="6.5" ry="5" fill="white" stroke="${C.orange}" stroke-width="2"/><ellipse cx="27" cy="17" rx="7" ry="5" fill="white" stroke="${C.orange}" stroke-width="2"/></pattern>
    <pattern id="${id}-sd" width="14" height="12" patternUnits="userSpaceOnUse"><rect width="14" height="12" fill="white"/><rect width="14" height="12" fill="${C.yellow}" opacity=".42"/><circle cx="3.5" cy="3" r="1.6" fill="${C.orange}"/><circle cx="10.5" cy="9" r="1.6" fill="${C.orange}"/></pattern>
    <pattern id="${id}-md" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="${C.line}"/><path d="M3 4 H10 M14 9 H20" stroke="${C.muted}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/></pattern>
    ${extra}</defs>`;
  const layer = (id, p, x, y, w, h) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="url(#${id}-${p})"/><path d="M${f(x)} ${f(y)} H${f(x + w)}" stroke="${C.muted}" stroke-width="2"/>`;
  // 알갱이 하나: 자갈·모래·진흙
  const grain = (x, y, r, kind) => kind === 'gv'
    ? `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.8)}" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`
    : kind === 'sd' ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="1.6"/>`
      : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${C.muted}"/>`;
  // 비커(옆에서 본 모습)
  const beakerD = (x1, y1, x2, y2) => `M${x1 - 7} ${y1} H${x1} V${y2 - 10} Q${x1} ${y2} ${x1 + 10} ${y2} H${x2 - 10} Q${x2} ${y2} ${x2} ${y2 - 10} V${y1} H${x2 + 7}`;
  const beakerLine = (x1, y1, x2, y2) => `<path d="${beakerD(x1, y1, x2, y2)}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  const waterD = (x1, wy, x2, y2) => `M${x1} ${wy} V${y2 - 10} Q${x1} ${y2} ${x1 + 10} ${y2} H${x2 - 10} Q${x2} ${y2} ${x2} ${y2 - 10} V${wy} Z`;
  const water = (x1, wy, x2, y2, fill = C.sky, attr = '') => `<path${attr} d="${waterD(x1 + 2, wy, x2 - 2, y2 - 2)}" fill="${fill}"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .jig { animation: ${id}-jig 2.4s ease-in-out infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-sink { 0% { opacity: 0; transform: translateY(-120px); } 30% { opacity: 1; } 100% { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2px, -2px); } 50% { transform: translate(-2px, 2px); } 75% { transform: translate(-2px, -1px); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .sink${n} { animation: ${id}-sink .9s ease-in both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }`;
    return s;
  };

  // ════ 1단원 지층과 화석 ════

  // ── 지층: 수조 물 밑에 퇴적물이 한 층씩 쌓이고, 아래층이 먼저 ──
  (function () {
    const id = 't51-c1-jicheung';
    let css = base(id);
    const X1 = 130, X2 = 510, TOP = 70, BOT = 320;
    let body = defs(id) + `<rect x="${X1}" y="92" width="${X2 - X1}" height="${BOT - 92}" fill="${C.sky}"/><path d="M${X1} 92 H${X2}" stroke="${C.blue}" stroke-width="2.5" opacity=".7"/>`;
    const L = [['gv', 40], ['md', 26], ['sd', 46], ['md', 22]];
    let y = BOT;
    const mids = [];
    L.forEach(([p, h], k) => {
      const y0 = y - h;
      mids.push(y0 + h / 2);
      body += at(1, 'sink', layer(id, p, X1 + 2, y0, X2 - X1 - 4, h), 0.2 + 0.6 * k);
      y = y0;
    });
    body += `<path d="M${X1} ${TOP} V${BOT} H${X2} V${TOP}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
    // 2칸: 쌓인 차례와 먼저·나중
    mids.forEach((m, k) => { body += at(2, 'pop', `<circle cx="102" cy="${f(m)}" r="14" fill="white" stroke="${C.green}" stroke-width="2.5"/>` + text(102, f(m + 6.5), k + 1, { size: 18 }), 0.2 * k); });
    body += at(2, 'fin', arrow(548, 312, 548, 192, C.green, '', 4), 0.9);
    body += at(2, 'fin', text(594, 312, '먼저', { size: 19, color: C.green }) + text(594, 202, '나중', { size: 19, color: C.green }), 1.1);
    body += glowRect(X1 + 2, BOT - 40, X2 - X1 - 4, 40, 2, C.orange, 1.2, 4);
    // 3칸: 줄무늬 전체가 지층
    body += glowRect(X1 + 2, y, X2 - X1 - 4, BOT - y, 3, C.green, 0.2, 4);
    body += at(3, 'pop', tag(320, 140, '지층', OK, { size: 24 }), 0.6);
    put('5-1/과학/1/지층', svg(id, body, css));
  })();

  // ── 수평: 기운 판에서는 구슬이 구르고, 반듯한 판에서는 멈춘다. 지층 세 가지 ──
  (function () {
    const id = 't51-c1-supyeong';
    let css = base(id);
    const extra = [30, 235, 440].map((x, k) => `<clipPath id="${id}-c${k}"><rect x="${x}" y="196" width="170" height="100" rx="10"/></clipPath>`).join('');
    let body = defs(id, extra);
    // 받침과 판
    body += `<path d="M220 170 H420" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/><path d="M320 124 L296 170 H344 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    const ball = (cx) => `<circle cx="${cx}" cy="96" r="15" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><circle cx="${cx - 5}" cy="90" r="4.5" fill="white"/>`;
    body += `<g class="tilt"><rect x="130" y="78" width="380" height="80" fill="none"/><rect x="130" y="111" width="380" height="14" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><rect x="130" y="99" width="10" height="12" rx="2" fill="${C.orange}"/><rect x="500" y="99" width="10" height="12" rx="2" fill="${C.orange}"/>`
      + shown(1, `<g class="ball">${ball(320)}</g>`, 2) + `</g>`;
    body += `<g class="b2"><g class="bnc">${ball(320)}</g></g>`;
    body += at(2, 'fin', `<path d="M78 118 H556" stroke="${C.red}" stroke-width="3" stroke-dasharray="10 7"/>`, 1.1);
    body += at(2, 'pop', tag(598, 118, '수평', HOT, { size: 20 }), 1.4);
    // 3칸: 지층 세 가지
    const card = (x, k, inner, label) => at(3, 'pop', `<rect x="${x}" y="196" width="170" height="100" rx="10" fill="${C.line}"/><g clip-path="url(#${id}-c${k})">${inner}</g><rect x="${x}" y="196" width="170" height="100" rx="10" fill="none" stroke="${C.muted}" stroke-width="3"/>` + text(x + 85, 328, label, { size: 19 }), 0.25 * k);
    const pats = ['sd', 'md', 'gv', 'md', 'sd', 'md'];
    // 수평인 지층
    let flat = '';
    [196, 221, 246, 271].forEach((y, k) => { flat += layer(id, pats[k], 30, y, 170, 25); });
    // 휘어진 지층: 가운데가 솟은 띠
    let fold = '';
    for (let k = 0; k < 6; k++) {
      const a = 192 + k * 24, b = a + 24, x0 = 225, x1 = 415, xm = 320, A = 44;
      fold += `<path d="M${x0} ${a} Q${xm} ${a - A} ${x1} ${a} L${x1} ${b} Q${xm} ${b - A} ${x0} ${b} Z" fill="url(#${id}-${pats[k]})" stroke="${C.muted}" stroke-width="2"/>`;
    }
    // 끊어진 지층: 비스듬한 금을 따라 오른쪽이 내려앉음
    let cut = '';
    const fx = (y) => 545 - 0.28 * (y - 196), D = 20;
    for (let k = -1; k < 4; k++) {
      const a = 196 + k * 25, b = a + 25;
      if (k >= 0) cut += `<path d="M440 ${a} L${f(fx(a))} ${a} L${f(fx(b))} ${b} L440 ${b} Z" fill="url(#${id}-${pats[k]})" stroke="${C.muted}" stroke-width="2"/>`;
      const p = pats[(k + 6) % 6];
      cut += `<path d="M${f(fx(a + D))} ${a + D} L612 ${a + D} L612 ${b + D} L${f(fx(b + D))} ${b + D} Z" fill="url(#${id}-${p})" stroke="${C.muted}" stroke-width="2"/>`;
    }
    cut += `<path d="M${f(fx(190))} 190 L${f(fx(300))} 300" stroke="${C.ink}" stroke-width="3"/>`;
    body += card(30, 0, flat, '수평인 지층') + card(235, 1, fold, '휘어진 지층') + card(440, 2, cut, '끊어진 지층');
    // 4칸: 판과 첫째 지층이 같은 수평
    body += glowRect(28, 194, 174, 104, 4, C.red, 0.1, 12);
    body += at(4, 'fin', `<path d="M38 221 H192 M38 246 H192 M38 271 H192" stroke="${C.red}" stroke-width="3" stroke-dasharray="8 6"/>`, 0.4);
    body += `<g class="b4"><g class="pulse pulse4">${tag(598, 118, '수평', HOT, { size: 20 })}</g></g>`;
    css += `
      .sc-${id} .tilt { transform-box: fill-box; transform-origin: center; transition: transform .9s ease-in-out .1s; }
      .on1 .sc-${id} .tilt { transform: rotate(9deg); }
      .on2 .sc-${id} .tilt { transform: rotate(0deg); }
      .sc-${id} .ball { transform-box: fill-box; transform-origin: center; transition: transform 1.3s ease-in 1s; }
      .on1 .sc-${id} .ball { transform: translateX(165px) rotate(630deg); }
      .sc-${id} .bnc { opacity: 0; }
      .on2 .sc-${id} .bnc { animation: ${id}-bnc 1s ease-out .8s both; }
      @keyframes ${id}-bnc { 0% { opacity: 0; transform: translateY(-70px); } 45% { opacity: 1; transform: translateY(0); } 65% { transform: translateY(-12px); } 85%, 100% { opacity: 1; transform: none; } }`;
    put('5-1/과학/1/수평', svg(id, body, css));
  })();

  // ── 퇴적물: 흐르는 물이 자갈·모래·진흙을 싣고 와서 물 밑에 쌓는다 ──
  (function () {
    const id = 't51-c1-toejeokmul';
    let css = base(id);
    let body = defs(id);
    body += `<path d="M289.7 220 H640 V330 H360 L300 226 Z" fill="${C.sky}"/><path d="M289.7 220 H640" stroke="${C.blue}" stroke-width="2.5" opacity=".7"/>`;
    body += `<path d="M0 92 L70 92 L300 226 L360 330 H640 V360 H0 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<path d="M0 87 L70 87 L292 216" stroke="${C.sky}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    body += `<path class="mar" d="M0 87 L70 87 L292 216" stroke="${C.blue}" stroke-width="4" stroke-dasharray="14 10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    // 1칸: 비탈을 따라 실려 가는 알갱이
    const trav = [['gv', 9], ['sd', 5.5], ['md', 3.5], ['sd', 5.5], ['gv', 8], ['md', 3.5]];
    let tr = '';
    trav.forEach(([k, r], i) => { tr += `<g class="trav" style="animation-delay:${f(i * 0.47)}s">${grain(12, 86 - r - 2, r, k)}</g>`; });
    body += shown(1, tr);
    // 2칸: 물에 들어가 바닥에 가라앉는다(자갈은 가까이, 진흙은 멀리)
    body += `<g class="b2"><g class="lv pile" style="transition-delay:1.9s"><rect x="352" y="318" width="90" height="12" fill="url(#${id}-gv)"/><rect x="442" y="318" width="100" height="12" fill="url(#${id}-sd)"/><rect x="542" y="318" width="98" height="12" fill="url(#${id}-md)"/></g></g>`;
    const fin = [];
    [372, 397, 422].forEach((x) => fin.push(['gv', x, 310, 10]));
    [452, 472, 492, 512, 532].forEach((x) => fin.push(['sd', x, 312.5, 5.5]));
    [556, 573, 590, 607, 624].forEach((x) => fin.push(['md', x, 315, 3]));
    let st = '';
    fin.forEach(([k, x, y, r], i) => { st += `<g class="set" style="--dx:${f(300 - x)}px;--dy:${f(222 - y)}px;animation-delay:${f(0.1 + i * 0.1)}s">${grain(x, y, r, k)}</g>`; });
    body += shown(2, st);
    // 3칸: 이름
    body += at(3, 'pop', tag(397, 278, '자갈', HOT, { size: 19 }), 0) + at(3, 'pop', tag(492, 278, '모래', HOT, { size: 19 }), 0.2) + at(3, 'pop', tag(590, 278, '진흙', GRAY, { size: 19 }), 0.4);
    body += shown(3, `<path d="M397 258 V246 H590 V258 M492 246 V194" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
    body += at(3, 'pop', tag(492, 176, '퇴적물', OK, { size: 22 }), 0.7);
    body += glowRect(352, 296, 288, 36, 3, C.green, 0.5, 6);
    css += `
      .sc-${id} .trav { opacity: 0; }
      .on1 .sc-${id} .trav { animation: ${id}-trav 2.8s linear infinite; }
      @keyframes ${id}-trav { 0% { opacity: 0; transform: translate(0, 0); } 8% { opacity: 1; } 22% { transform: translate(58px, 0); } 90% { opacity: 1; transform: translate(276px, 127px); } 100% { opacity: 0; transform: translate(288px, 134px); } }
      .sc-${id} .set { opacity: 0; }
      .on2 .sc-${id} .set { animation: ${id}-set 2s ease-in-out both; }
      @keyframes ${id}-set { 0% { opacity: 0; transform: translate(var(--dx), var(--dy)); } 10% { opacity: 1; } 50% { transform: translate(0px, var(--dy)); } 100% { opacity: 1; transform: none; } }
      .sc-${id} .pile { transform: scaleY(0); transition: transform .8s ease-out; }
      .on2 .sc-${id} .pile { transform: scaleY(1); }`;
    put('5-1/과학/1/퇴적물', svg(id, body, css));
  })();

  // ── 침식 작용: 흐르는 물이 비탈을 깎아 내고, 깎인 흙과 돌은 실려 가 쌓인다 ──
  (function () {
    const id = 't51-c1-chimsik';
    let css = base(id);
    const yo = (x) => 80 + x * 0.3234, D = 38;
    const d = (x) => (x <= 90 || x >= 400 ? 0 : D * Math.sin((Math.PI * (x - 90)) / 310));
    const xs = [];
    for (let x = 90; x <= 400; x += 10) xs.push(x);
    const low = xs.map((x) => [x, yo(x) + d(x)]);
    const half = xs.map((x) => [x, yo(x) + d(x) / 2]);
    const orig = xs.map((x) => [x, yo(x)]);
    let body = defs(id);
    body += `<path d="M451.4 226 H640 V320 H520 Z" fill="${C.sky}"/><path d="M451.4 226 H640" stroke="${C.blue}" stroke-width="2.5" opacity=".7"/>`;
    body += `<path d="M0 360 L0 80 ${pts(low).replace('M', 'L')} L451.4 226 L520 320 H640 V360 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    const lowLine = [[0, 75], ...low.map(([x, y]) => [x, y - 5]), [451.4, 221]];
    body += `<path d="${pts(lowLine)}" stroke="${C.sky}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path class="mar" d="${pts(lowLine)}" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    // 깎여 나갈 땅 두 겹(위 겹이 먼저 사라진다)
    body += `<g class="capB"><path d="${pts([...half, ...low.slice().reverse()])} Z" fill="${C.peach}"/></g>`;
    body += `<g class="capA"><path d="${pts([...orig, ...half.slice().reverse()])} Z" fill="${C.peach}"/><path d="${pts(orig)}" stroke="${C.orange}" stroke-width="3" fill="none"/></g>`;
    body += `<g class="wtop"><path d="M0 75 L451.4 221" stroke="${C.sky}" stroke-width="9" stroke-linecap="round"/><path class="mar" d="M0 75 L451.4 221" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" stroke-linecap="round"/></g>`;
    // 처음 땅 높이(점선)
    body += at(1, 'fin', `<path d="${pts(orig)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"/>`, 2.3);
    // 깎여 나온 흙과 돌
    const ch = [[150, 7, 'gv'], [200, 5, 'sd'], [245, 8, 'gv'], [290, 5, 'sd'], [335, 6, 'gv']];
    const pile = [[548, 7], [566, 5], [584, 8], [602, 5], [620, 6]];
    ch.forEach(([x, r, k], i) => {
      const y = yo(x) + d(x) - r - 1, [px, pr] = pile[i];
      body += `<g class="b1"><g class="carry" style="--ex:${f(451 - x)}px;--ey:${f(222 - r - y)}px;--fx:${f(px - x)}px;--fy:${f(308 - pr - y)}px;transition-delay:${f(0.15 * i)}s"><g class="pop pop1" style="animation-delay:${f(1.0 + 0.2 * i)}s">${grain(x, y, r, k)}</g></g></g>`;
    });
    body += `<g class="b2"><g class="lv pl" style="transition-delay:2.2s"><rect x="534" y="308" width="104" height="12" fill="url(#${id}-gv)"/></g></g>`;
    body += at(1, 'pop', lead(245, 124, 245, 186, C.orange) + tag(245, 105, '깎임', HOT, { size: 19 }), 1.6).replace('class="b1"', 'class="b1 h3"');
    body += at(2, 'pop', tag(345, 150, '운반', COLD, { size: 19 }), 0.6) + at(2, 'pop', tag(586, 272, '퇴적', OK, { size: 19 }), 2.2);
    // 3칸: 깎인 자리가 침식 작용
    body += glowPath(pts(low), 3, C.orange, 0.2, 7);
    body += at(3, 'pop', lead(245, 124, 245, 186, C.orange) + tag(245, 105, '침식 작용', HOT, { size: 22 }), 0.5);
    css += `
      .sc-${id} .capA, .sc-${id} .capB, .sc-${id} .wtop { transition: opacity .9s ease-in-out; }
      .on1 .sc-${id} .wtop { opacity: 0; transition-delay: .3s; }
      .on1 .sc-${id} .capA { opacity: 0; transition-delay: .6s; }
      .on1 .sc-${id} .capB { opacity: 0; transition-delay: 1.4s; }
      .on2 .sc-${id} .carry { animation: ${id}-carry 2.4s ease-in-out both; }
      @keyframes ${id}-carry { 0% { transform: none; } 55% { transform: translate(var(--ex), var(--ey)); } 100% { transform: translate(var(--fx), var(--fy)); } }
      .sc-${id} .pl { transform: scaleY(0); transition: transform .7s ease-out; }
      .on2 .sc-${id} .pl { transform: scaleY(1); }`;
    put('5-1/과학/1/침식 작용', svg(id, body, css));
  })();

  // ── 퇴적암: 쌓인 알갱이가 눌려 틈이 좁아지고, 엉겨 붙어 굳는다 ──
  (function () {
    const id = 't51-c1-toejeokam';
    let css = base(id);
    const CX = 465, CY = 190, R = 125;
    let body = defs(id, `<clipPath id="${id}-z"><circle cx="${CX}" cy="${CY}" r="${R - 2}"/></clipPath>`);
    // 왼쪽 수조
    body += `<rect x="40" y="100" width="220" height="220" fill="${C.sky}"/><path d="M40 100 H260" stroke="${C.blue}" stroke-width="2.5" opacity=".7"/>`;
    body += at(1, 'sink', layer(id, 'sd', 42, 290, 216, 30), 0.2) + at(1, 'sink', layer(id, 'md', 42, 264, 216, 26), 0.8);
    body += at(2, 'sink', layer(id, 'gv', 42, 234, 216, 30), 0.1) + at(2, 'sink', layer(id, 'sd', 42, 208, 216, 26), 0.6);
    body += `<g class="b4"><rect class="rock" x="42" y="264" width="216" height="56" fill="${C.muted}" opacity="0"/></g>`;
    body += `<path d="M40 80 V320 H260 V80" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
    // 확대 표시
    const a1 = (205 * Math.PI) / 180, a2 = (155 * Math.PI) / 180;
    body += at(1, 'fin', `<circle cx="214" cy="304" r="13" fill="none" stroke="${C.ink}" stroke-width="3"/>` + lead(226, 298, CX + R * Math.cos(a1), CY + R * Math.sin(a1), C.ink) + lead(226, 310, CX + R * Math.cos(a2), CY + R * Math.sin(a2), C.ink), 1.2);
    // 큰 원 안 알갱이
    const rnd = seeded(29), parts = [];
    for (let row = 0; row < 5; row++) for (let col = -4; col <= 4; col++) {
      const x = col * 32 + (row % 2 ? 16 : 0) + (rnd() - 0.5) * 3, y = 98 - row * 48 + (rnd() - 0.5) * 4, r = 10.5 + rnd() * 3;
      if (Math.hypot(x, y) > R - r - 6) continue;
      parts.push([x, y, r]);
    }
    const AY = 98, K = 0.62;
    let gr = '';
    parts.forEach(([x, y, r], i) => {
      const tx = 0, ty = (AY + (y - AY) * K) - y;
      gr += `<g class="cmp" style="--tx:${f(tx)}px;--ty:${f(ty)}px">${grain(CX + x, CY + y, r, i % 5 === 2 ? 'gv' : 'sd')}</g>`;
    });
    let top = '';
    [-64, -32, 0, 32, 64].forEach((x, i) => { top += `<g class="b2"><g class="drop drop2" style="animation-delay:${f(1.9 + i * 0.1)}s">${grain(CX + x, CY - 50, 11, 'gv')}</g></g>`; });
    body += at(1, 'pop', `<circle cx="${CX}" cy="${CY}" r="${R}" fill="white"/><g clip-path="url(#${id}-z)"><g class="b3"><rect class="glue" x="${CX - R}" y="${CY - R}" width="${2 * R}" height="${2 * R}" fill="${C.peach}"/></g>${gr}${top}</g><circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="4"/>`, 1.4);
    // 2칸: 위에서 누른다
    [405, 465, 525].forEach((x, i) => { body += at(2, 'drop', arrow(x, 20, x, 58, C.red, '', 4), 0.2 + 0.1 * i); });
    body += at(2, 'pop', tag(598, 40, '눌림', HOT, { size: 19 }), 0.7);
    // 3칸: 엉겨 붙음
    body += at(3, 'pop', tag(CX, 340, '엉겨 붙음', HOT, { size: 19 }), 1.2);
    // 4칸: 굳은 돌
    body += glowRect(42, 262, 216, 60, 4, C.green, 0.6, 4) + glowCircle(CX, CY, R, 4, C.green, 0.4);
    body += at(4, 'pop', tag(150, 342, '퇴적암', OK, { size: 22 }), 0.8);
    css += `
      .sc-${id} .cmp { transition: transform 1.3s ease-in-out .5s; }
      .on2 .sc-${id} .cmp { transform: translate(var(--tx), var(--ty)); }
      .sc-${id} .glue { opacity: 0; transition: opacity 1.6s ease-in-out .3s; }
      .on3 .sc-${id} .glue { opacity: .9; }
      .sc-${id} .rock { transition: opacity 1.2s ease-in-out .2s; }
      .on4 .sc-${id} .rock { opacity: .28; }`;
    put('5-1/과학/1/퇴적암', svg(id, body, css));
  })();

  // ── 이암·사암·역암: 같은 확대 원, 알갱이 크기만 다르다 ──
  const rockScene = (word, slug, kind) => {
    const id = `t51-c1-${slug}`;
    let css = base(id);
    const CX = 405, CY = 160, R = 112;
    const extra = `<pattern id="${id}-fn" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${C.line}"/><circle cx="2" cy="2" r="1.4" fill="${C.muted}"/><circle cx="6" cy="6" r="1.2" fill="${C.muted}" opacity=".7"/></pattern>
      <pattern id="${id}-mx" width="16" height="14" patternUnits="userSpaceOnUse"><rect width="16" height="14" fill="${C.line}"/><circle cx="4" cy="4" r="2.8" fill="${C.yellow}" stroke="${C.orange}" stroke-width="1"/><circle cx="12" cy="10" r="2.6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="1"/><circle cx="11.5" cy="3" r="1.2" fill="${C.muted}"/><circle cx="3.5" cy="11" r="1.2" fill="${C.muted}"/></pattern>
      <pattern id="${id}-cg" width="56" height="44" patternUnits="userSpaceOnUse"><rect width="56" height="44" fill="url(#${id}-mx)"/><ellipse cx="14" cy="12" rx="10" ry="8" fill="white" stroke="${C.orange}" stroke-width="2"/><ellipse cx="40" cy="32" rx="11" ry="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/></pattern>
      <clipPath id="${id}-z"><circle cx="${CX}" cy="${CY}" r="${R - 2}"/></clipPath>`;
    let body = defs(id, extra);
    const rockFill = { md: `url(#${id}-md)`, sd: `url(#${id}-sd)`, gv: `url(#${id}-cg)` }[kind];
    body += `<g class="pulse pulse1"><path d="M50 132 L94 90 L174 82 L226 120 L234 200 L192 246 L102 252 L52 212 Z" fill="${rockFill}" stroke="${C.muted}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
    // 큰 원 안
    let inner = '';
    if (kind === 'md') inner = `<rect x="${CX - R}" y="${CY - R}" width="${2 * R}" height="${2 * R}" fill="url(#${id}-fn)"/>`;
    else if (kind === 'sd') {
      inner = `<rect x="${CX - R}" y="${CY - R}" width="${2 * R}" height="${2 * R}" fill="${C.line}"/>`;
      const rnd = seeded(7);
      for (let row = -5; row <= 5; row++) for (let col = -6; col <= 6; col++) {
        const x = col * 23 + (row % 2 ? 11.5 : 0) + (rnd() - 0.5) * 4, y = row * 20 + (rnd() - 0.5) * 4;
        if (Math.hypot(x, y) > R + 4) continue;
        inner += grain(CX + x, CY + y, 9 + rnd() * 2, 'sd');
      }
    } else {
      inner = `<rect x="${CX - R}" y="${CY - R}" width="${2 * R}" height="${2 * R}" fill="url(#${id}-mx)"/>`;
      const peb = [[-50, -58, 30, 23, 0], [14, -70, 26, 20, 1], [66, -34, 28, 23, 2], [-74, 6, 24, 20, 1], [-14, -6, 32, 25, 0], [50, 30, 28, 22, 1], [-42, 60, 27, 20, 2], [18, 74, 25, 19, 0], [86, 50, 18, 15, 2]];
      const fills = [['white', C.orange], [C.peach, C.orange], [C.lilac, C.purple]];
      peb.forEach(([x, y, rx, ry, c]) => { inner += `<ellipse cx="${CX + x}" cy="${CY + y}" rx="${rx}" ry="${ry}" fill="${fills[c][0]}" stroke="${fills[c][1]}" stroke-width="2.5"/>`; });
    }
    // 1칸: 돋보기가 돌 위로
    body += `<g class="b1"><g class="lens"><circle cx="150" cy="160" r="28" fill="white" fill-opacity=".35" stroke="${C.ink}" stroke-width="5"/><path d="M170 180 L198 208" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/></g></g>`;
    // 2칸: 크게 보기
    body += at(2, 'fin', lead(166, 137, CX - 56, CY - 97, C.ink) + lead(166, 183, CX - 56, CY + 97, C.ink), 0.3);
    body += at(2, 'pop', `<circle cx="${CX}" cy="${CY}" r="${R}" fill="white"/><g clip-path="url(#${id}-z)">${inner}</g><circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="4"/>`, 0.1);
    // 3칸: 알갱이 크기 줄과 이름
    const row = [[300, 'md', 3, '진흙'], [400, 'sd', 8, '모래'], [500, 'gv', 16, '자갈']];
    row.forEach(([x, k, r, name], i) => { body += at(3, 'pop', grain(x, 322, r, k) + text(x + 24, 329, name, { size: 19, anchor: 'start' }), 0.15 * i); });
    const cur = row.findIndex((r) => r[1] === kind), [cx0, , cr] = row[cur];
    body += glowRect(cx0 - cr - 10, 298, cr + 84, 48, 3, C.orange, 0.6, 12);
    body += glowCircle(CX, CY, R, 3, C.green, 0.4);
    body += at(3, 'pop', tag(142, 294, word, OK, { size: 24 }), 0.8);
    css += `
      .sc-${id} .lens { transform: translate(140px, 130px); transition: transform 1.3s ease-in-out .2s; }
      .on1 .sc-${id} .lens { transform: none; }`;
    put(`5-1/과학/1/${word}`, svg(id, body, css));
  };
  rockScene('이암', 'iam', 'md');
  rockScene('사암', 'saam', 'sd');
  rockScene('역암', 'yeogam', 'gv');

  // ── 화석: 가라앉고, 덮이고, 굳고, 드러난다 ──
  (function () {
    const id = 't51-c1-hwaseok';
    let css = base(id);
    let body = defs(id);
    body += `<g class="sea"><rect x="30" y="70" width="420" height="262" fill="${C.sky}"/><path d="M30 70 H450" stroke="${C.blue}" stroke-width="2.5" opacity=".7"/></g>`;
    let land = `<rect x="30" y="330" width="420" height="80" fill="${C.peach}"/>`;
    // 층: 아래부터. 둘째~넷째 층은 가운데 조각이 나중에 깎여 나간다
    const Ls = [['sd', 300, 30, null], ['md', 274, 26, [175, 305]], ['gv', 246, 28, [160, 320]], ['sd', 222, 24, [140, 340]]];
    Ls.forEach(([p, y, h, cut], k) => {
      let inner;
      if (!cut) inner = layer(id, p, 30, y, 420, h);
      else inner = layer(id, p, 30, y, cut[0] - 30, h) + layer(id, p, cut[1], y, 450 - cut[1], h) + `<g class="mid m${k}">${layer(id, p, cut[0], y, cut[1] - cut[0], h)}</g>`;
      land += at(2, 'sink', inner, 0.2 + 0.55 * k);
    });
    // 물고기와 화석
    const fish = `<path d="M200 316 Q240 296 282 316 Q240 336 200 316 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/><path d="M201 316 L184 303 V329 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/><circle cx="268" cy="313" r="2.6" fill="${C.ink}"/>`;
    let bone = `<ellipse cx="236" cy="316" rx="50" ry="15" fill="${C.muted}" opacity=".22"/><path d="M196 316 H268 M268 307 Q284 316 268 325 M196 316 L184 305 M196 316 L184 327" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    for (let x = 208; x <= 258; x += 10) bone += `<path d="M${x} 306 Q${x + 4} 316 ${x} 326" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    land += `<g class="b1"><g class="fall"><g class="body">${fish}</g></g></g><g class="b2"><g class="bone">${bone}</g></g>`;
    body += `<g class="land">${land}</g>`;
    // 3칸: 드러난 화석
    body += `<g class="b3"><circle class="ring ring3" style="animation-delay:2.4s" cx="236" cy="276" r="56" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    // 4칸: 몸체·흔적 화석과 이름
    const stone = (y) => `<rect x="470" y="${y}" width="150" height="122" rx="14" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    let shell = '';
    for (let a = -60; a <= 60; a += 20) { const r = (a * Math.PI) / 180; shell += `<path d="M545 140 L${f(545 + 40 * Math.sin(r))} ${f(140 - 40 * Math.cos(r))}" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`; }
    body += at(4, 'pop', stone(68) + `<path d="M545 142 L507 116 A44 44 0 0 1 583 116 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>${shell}` + text(545, 174, '몸체', { size: 20 }), 0.2);
    const toe = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="20" transform="rotate(${rot} ${x} ${y})" fill="${C.muted}" opacity=".75"/>`;
    body += at(4, 'pop', stone(206) + toe(526, 244, -28) + toe(545, 236, 0) + toe(564, 244, 28) + `<ellipse cx="545" cy="270" rx="15" ry="11" fill="${C.muted}" opacity=".75"/>` + text(545, 312, '흔적', { size: 20 }), 0.5);
    body += at(4, 'pop', lead(236, 210, 236, 254, C.orange) + tag(236, 190, '화석', HOT, { size: 24 }), 0.9);
    css += `
      .sc-${id} .fall { animation: none; }
      .on1 .sc-${id} .fall { animation: ${id}-fall 2.4s ease-in-out .2s both; }
      @keyframes ${id}-fall { 0% { opacity: 0; transform: translate(0, -190px); } 15% { opacity: 1; } 40% { transform: translate(8px, -120px); } 70% { transform: translate(-6px, -50px); } 100% { opacity: 1; transform: none; } }
      .sc-${id} .body { transition: opacity 1.2s ease-in-out 2.6s; }
      .on2 .sc-${id} .body { opacity: 0; }
      .sc-${id} .bone { opacity: 0; transition: opacity 1.2s ease-in-out 2.8s; }
      .on2 .sc-${id} .bone { opacity: 1; }
      .sc-${id} .sea { transition: opacity 1s ease-in-out .2s; }
      .on3 .sc-${id} .sea { opacity: 0; }
      .sc-${id} .land { transition: transform 1.2s ease-in-out .5s; }
      .on3 .sc-${id} .land { transform: translateY(-40px); }
      .sc-${id} .mid { transition: opacity .6s ease-in-out; }
      .on3 .sc-${id} .m3 { opacity: 0; transition-delay: 1.6s; }
      .on3 .sc-${id} .m2 { opacity: 0; transition-delay: 2s; }
      .on3 .sc-${id} .m1 { opacity: 0; transition-delay: 2.4s; }`;
    put('5-1/과학/1/화석', svg(id, body, css));
  })();

  // ════ 3단원 용해와 용액 ════

  // ── 용해: 각설탕이 작아지며, 확대 원 안에서 알갱이가 물 전체로 고르게 퍼진다 ──
  (function () {
    const id = 't51-c3-yonghae';
    let css = base(id);
    const CX = 470, CY = 190, R = 115;
    let body = `<defs><clipPath id="${id}-z"><circle cx="${CX}" cy="${CY}" r="${R - 2}"/></clipPath></defs>`;
    body += water(90, 140, 270, 320);
    const cube = `<rect x="162" y="281" width="36" height="36" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/><path d="M162 293 H198 M162 305 H198 M174 281 V317 M186 281 V317" stroke="${C.line}" stroke-width="1.5"/>`;
    body += `<g class="b1"><g class="fall"><g class="shr">${cube}</g></g></g>`;
    body += beakerLine(90, 100, 270, 320);
    body += at(1, 'pop', tag(340, 300, '각설탕', GRAY, { size: 19 }), 1.4).replace('class="b1"', 'class="b1 h2"');
    // 2칸: 확대 원
    body += at(2, 'fin', `<circle cx="180" cy="297" r="27" fill="none" stroke="${C.ink}" stroke-width="3"/>` + lead(204, 284, CX - 108, CY - 39, C.ink) + lead(206, 304, CX - 108, CY + 39, C.ink), 0.1);
    const rnd = seeded(41), fin = [];
    for (let row = -3; row <= 3; row++) for (let col = -3; col <= 3; col++) {
      const x = col * 33 + (row % 2 ? 16 : 0) + (rnd() - 0.5) * 10, y = row * 30 + (rnd() - 0.5) * 10;
      if (Math.hypot(x, y) <= R - 16) fin.push([x, y]);
    }
    fin.sort((a, b) => b[1] - a[1]);
    let dots = '';
    fin.forEach(([x, y], i) => {
      const bx = (i % 6) * 10 - 25, by = R - 16 - Math.floor(i / 6) * 10;
      dots += `<g class="pt" style="--x:${f(bx - x)}px;--y:${f(by - y)}px;transition-delay:${f(0.9 + rnd() * 0.9)}s"><g class="jig" style="animation-delay:-${f(rnd() * 2.4)}s"><circle cx="${f(CX + x)}" cy="${f(CY + y)}" r="5" fill="white" stroke="${C.purple}" stroke-width="2"/></g></g>`;
    });
    body += at(2, 'pop', `<circle cx="${CX}" cy="${CY}" r="${R}" fill="${C.sky}"/><g clip-path="url(#${id}-z)">${dots}</g><circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="4"/>`, 0.2);
    // 3칸: 위아래 고르게
    body += ring(CX - 30, CY - 62, 30, 3, C.orange, 0) + ring(CX + 30, CY + 62, 30, 3, C.orange, 0.4);
    body += ring(180, 175, 30, 3, C.orange, 0) + ring(180, 285, 30, 3, C.orange, 0.4);
    body += at(3, 'pop', tag(CX, 42, '용해', OK, { size: 24 }), 0.8);
    css += `
      .on1 .sc-${id} .fall { animation: ${id}-fall 1.3s ease-in .3s both; }
      @keyframes ${id}-fall { 0% { opacity: 0; transform: translateY(-250px); } 20% { opacity: 1; } 75% { transform: translateY(-4px); } 100% { opacity: 1; transform: none; } }
      .sc-${id} .shr { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 3s ease-in .6s, opacity .8s ease-in 3s; }
      .on2 .sc-${id} .shr { transform: scale(.08); opacity: 0; }
      .sc-${id} .pt { transform: translate(var(--x), var(--y)); transition: transform 2.2s ease-out; }
      .on2 .sc-${id} .pt { transform: none; }`;
    put('5-1/과학/3/용해', svg(id, body, css));
  })();

  // ── 용질: 티백 속 소금·갈색설탕은 녹아 빠져나가고 색 모래는 남는다 ──
  (function () {
    const id = 't51-c3-yongjil';
    let css = base(id);
    const xs = [120, 320, 520], names = ['소금', '갈색설탕', '색 모래'];
    let body = '';
    xs.forEach((x, k) => {
      body += water(x - 72, 180, x + 72, 320);
      if (k === 1) body += `<g class="tint"><path d="${waterD(x - 70, 180, x + 70, 318)}" fill="white"/><path d="${waterD(x - 70, 180, x + 70, 318)}" fill="${C.orange}" opacity=".3"/></g>`;
    });
    // 고정 막대와 티백(함께 내려간다)
    let rig = `<path d="M30 70 H610" stroke="${C.muted}" stroke-width="8" stroke-linecap="round"/>`;
    const rnd = seeded(5);
    xs.forEach((x, k) => {
      let fill = '';
      for (let i = 0; i < 11; i++) {
        const px = x - 20 + (i % 5) * 10 + (rnd() - 0.5) * 4, py = 246 - Math.floor(i / 5) * 9 + (rnd() - 0.5) * 3;
        fill += k === 0 ? `<circle cx="${f(px)}" cy="${f(py)}" r="3.6" fill="white" stroke="${C.muted}" stroke-width="1.5"/>`
          : k === 1 ? `<circle cx="${f(px)}" cy="${f(py)}" r="3.8" fill="${C.orange}"/>`
            : `<circle cx="${f(px)}" cy="${f(py)}" r="3.8" fill="${i % 2 ? C.purple : C.blue}"/>`;
      }
      rig += `<path d="M${x} 70 V190" stroke="${C.muted}" stroke-width="2.5"/><rect x="${x - 30}" y="190" width="60" height="66" rx="10" fill="white" fill-opacity=".6" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="5 3"/>`
        + (k < 2 ? `<g class="gone">${fill}</g>` : fill);
    });
    body += `<g class="rig">${rig}</g>`;
    // 2칸: 녹아 흘러내리는 줄기
    [0, 1].forEach((k) => {
      const x = xs[k], c = k ? C.orange : C.muted;
      body += `<g class="b2"><g class="strm">${[-14, 0, 14].map((dx) => `<path class="mar" d="M${x + dx} 258 Q${x + dx * 1.6} 285 ${x + dx * 2.4} 308" stroke="${c}" stroke-width="3" stroke-dasharray="6 6" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}</g></g>`;
    });
    xs.forEach((x, k) => { body += beakerLine(x - 72, 150, x + 72, 320); });
    xs.forEach((x, k) => { body += text(x, 348, names[k], { size: 20 }); });
    body += at(2, 'pop', tag(520, 286, '남음', GRAY, { size: 19 }), 2.0);
    // 3칸: 녹는 물질이 용질
    body += at(3, 'pop', tag(120, 120, '용질', OK, { size: 22 }), 0.3) + at(3, 'pop', tag(320, 120, '용질', OK, { size: 22 }), 0.5);
    body += glowRect(44, 146, 152, 178, 3, C.green, 0.6, 12) + glowRect(244, 146, 152, 178, 3, C.green, 0.8, 12);
    css += `
      .sc-${id} .rig { transform: translateY(-80px); transition: transform 1.4s ease-in-out .3s; }
      .on1 .sc-${id} .rig { transform: none; }
      .sc-${id} .gone { transition: opacity 2.6s ease-in .4s; }
      .on2 .sc-${id} .gone { opacity: 0; }
      .sc-${id} .tint { opacity: 0; transition: opacity 2.8s ease-in-out .6s; }
      .on2 .sc-${id} .tint { opacity: 1; }
      .sc-${id} .strm { opacity: 0; }
      .on2 .sc-${id} .strm { animation: ${id}-strm 3.2s ease-in-out .2s both; }
      @keyframes ${id}-strm { 0% { opacity: 0; } 15%, 75% { opacity: 1; } 100% { opacity: 0; } }`;
    put('5-1/과학/3/용질', svg(id, body, css));
  })();

  // ── 용매: 소금 + 물 → 소금물, 설탕 + 물 → 설탕물. 녹이는 쪽은 물 ──
  (function () {
    const id = 't51-c3-yongmae';
    let css = base(id);
    let body = '';
    const rowAt = (n, yc, solute, out, seed) => {
      const rnd = seeded(seed);
      let heap = `<ellipse cx="85" cy="${yc + 34}" rx="52" ry="12" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
      for (let i = 0; i < 14; i++) {
        const x = 62 + (i % 5) * 11 + (Math.floor(i / 5) % 2) * 5 + (rnd() - 0.5) * 3, y = yc + 28 - Math.floor(i / 5) * 8;
        heap += n === 1 ? `<circle cx="${f(x)}" cy="${f(y)}" r="4" fill="white" stroke="${C.muted}" stroke-width="1.6"/>`
          : `<rect x="${f(x - 4)}" y="${f(y - 4)}" width="8" height="8" rx="1.5" fill="white" stroke="${C.muted}" stroke-width="1.6"/>`;
      }
      const bk = (x, dots) => water(x - 48, yc - 18, x + 48, yc + 50) + dots + beakerLine(x - 48, yc - 50, x + 48, yc + 50);
      let dots = '';
      for (let i = 0; i < 9; i++) dots += `<circle cx="${f(490 - 32 + (i % 3) * 32 + (rnd() - 0.5) * 12)}" cy="${f(yc - 4 + Math.floor(i / 3) * 18 + (rnd() - 0.5) * 6)}" r="3" fill="white" stroke="${C.purple}" stroke-width="1.5"/>`;
      let s = '';
      s += at(n, 'pop', `<g class="sol">${heap}</g>` + text(85, yc + 78, solute, { size: 20 }), 0.1);
      s += at(n, 'fin', text(180, yc + 12, '+', { size: 34, color: C.muted }), 0.4);
      s += at(n, 'pop', `<g class="wat">${bk(275, '')}</g>` + text(275, yc + 78, '물', { size: 20 }), 0.6);
      s += at(n, 'fin', arrow(338, yc, 412, yc, C.muted, '', 4), 1.0);
      s += at(n, 'pop', bk(490, dots) + text(490, yc + 78, out, { size: 20 }), 1.3);
      return s;
    };
    body += rowAt(1, 100, '소금', '소금물', 3) + rowAt(2, 255, '설탕', '설탕물', 9);
    // 3칸: 두 줄 모두 녹인 쪽은 물
    body += glowRect(218, 42, 114, 302, 3, C.blue, 0.3, 16);
    body += at(3, 'pop', tag(275, 24, '용매', COLD, { size: 22 }), 0.7);
    css += `
      .sc-${id} .sol { transition: opacity .8s ease-in-out .2s; }
      .on3 .sc-${id} .sol { opacity: .4; }
      .sc-${id} .wat { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .wat { animation: ${id}-pulse .7s ease-in-out .4s 2; }`;
    put('5-1/과학/3/용매', svg(id, body, css));
  })();

  // ── 용액: 설탕물은 고르게 섞여 그대로, 흙탕물은 가라앉는다 ──
  (function () {
    const id = 't51-c3-yongaek';
    let css = base(id);
    const A = [110, 270], B = [370, 530], TOPW = 160, BOT = 320;
    let body = water(A[0], TOPW, A[1], BOT) + water(B[0], TOPW, B[1], BOT);
    body += `<g class="b1"><g class="mud"><path d="${waterD(B[0] + 2, TOPW, B[1] - 2, BOT - 2)}" fill="${C.orange}"/></g></g>`;
    // 넣는 알갱이
    const rnd = seeded(13);
    let sug = '', soil = '';
    for (let i = 0; i < 8; i++) sug += `<g class="melt" style="animation-delay:${f(0.2 + i * 0.12)}s"><rect x="${f(170 + (i % 4) * 12)}" y="${f(60 + Math.floor(i / 4) * 12)}" width="8" height="8" rx="1.5" fill="white" stroke="${C.muted}" stroke-width="1.6"/></g>`;
    for (let i = 0; i < 12; i++) {
      const x = B[0] + 22 + (i % 6) * 22 + (rnd() - 0.5) * 8, y = 185 + Math.floor(i / 6) * 50 + (rnd() - 0.5) * 30, r = 4 + rnd() * 3;
      soil += `<g class="dn" style="--dn:${f(BOT - 10 - r - y - rnd() * 6)}px;transition-delay:${f(0.2 + rnd() * 0.8)}s"><g class="jig" style="animation-delay:-${f(rnd() * 2.4)}s"><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/></g></g>`;
    }
    body += shown(1, sug) + at(1, 'fin', soil, 0.8);
    body += `<g class="b2"><g class="lv sed" style="transition-delay:1.6s"><rect x="${B[0] + 3}" y="${BOT - 14}" width="${B[1] - B[0] - 6}" height="11" fill="${C.peach}"/></g></g>`;
    // 젓는 막대
    const rod = (x) => `<g class="b1 h2"><g class="stir"><path d="M${x} 90 L${x + 18} 300" stroke="${C.muted}" stroke-width="6" stroke-linecap="round"/></g></g>`;
    body += rod(178) + rod(438);
    body += beakerLine(A[0], 120, A[1], BOT) + beakerLine(B[0], 120, B[1], BOT);
    body += at(1, 'fin', text(190, 348, '설탕', { size: 20 }) + text(450, 348, '흙', { size: 20 }), 0).replace('class="b1"', 'class="b1 h2"');
    body += at(2, 'fin', text(190, 348, '설탕물', { size: 20 }) + text(450, 348, '흙탕물', { size: 20 }), 0);
    // 2칸: 가라앉음·그대로
    body += at(2, 'pop', tag(450, 262, '가라앉음', GRAY, { size: 19 }), 1.8);
    body += ring(190, 190, 30, 2, C.green, 1.2) + ring(190, 285, 30, 2, C.green, 1.6);
    // 3칸: 설탕물이 용액
    body += glowRect(A[0] - 10, 112, A[1] - A[0] + 20, 216, 3, C.green, 0.2, 14);
    body += at(3, 'pop', tag(190, 86, '용액', OK, { size: 24 }), 0.6);
    css += `
      .sc-${id} .melt { opacity: 0; }
      .on1 .sc-${id} .melt { animation: ${id}-melt 1.6s ease-in both; }
      @keyframes ${id}-melt { 0% { opacity: 0; transform: translateY(-20px); } 15% { opacity: 1; } 60% { opacity: 1; transform: translateY(120px); } 100% { opacity: 0; transform: translateY(170px); } }
      .sc-${id} .mud { opacity: 0; transition: opacity 1s ease-in-out .8s; }
      .on1 .sc-${id} .mud { opacity: .4; }
      .on2 .sc-${id} .mud { opacity: .08; transition: opacity 2s ease-in-out .3s; }
      .sc-${id} .dn { transition: transform 1.8s ease-in; }
      .on2 .sc-${id} .dn { transform: translateY(var(--dn)); }
      .sc-${id} .sed { transform: scaleY(0); transition: transform .8s ease-out; }
      .on2 .sc-${id} .sed { transform: scaleY(1); }
      .sc-${id} .stir { transform-box: fill-box; transform-origin: 50% 0; }
      .on1 .sc-${id} .stir { animation: ${id}-stir .9s ease-in-out infinite alternate; }
      @keyframes ${id}-stir { from { transform: rotate(-9deg); } to { transform: rotate(9deg); } }`;
    put('5-1/과학/3/용액', svg(id, body, css));
  })();

  // ── 진하기: 같은 양의 물에 많이 녹이면 색이 진하고, 메추리알이 더 높이 뜬다 ──
  (function () {
    const id = 't51-c3-jinhagi';
    let css = base(id);
    const xs = [90, 230, 410, 550], HW = 56, TP = 140, BT = 310, WL = 175;
    let body = `<path d="M320 40 V330" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 8"/>`;
    body += text(160, 56, '물 150 mL', { size: 18, color: C.muted }) + at(3, 'fin', text(480, 56, '물 150 mL', { size: 18, color: C.muted }), 0);
    // 왼쪽 둘: 갈색설탕
    [0, 1].forEach((k) => {
      const x = xs[k];
      const wd = waterD(x - HW + 2, WL, x + HW - 2, BT - 2);
      body += water(x - HW, WL, x + HW, BT) + `<g class="tn"><path d="${wd}" fill="white"/><path d="${wd}" fill="${C.orange}" opacity="${k ? 0.6 : 0.16}"/></g>` + beakerLine(x - HW, TP, x + HW, BT);
    });
    const rnd = seeded(17);
    let gr = '';
    [[90, 3], [230, 14]].forEach(([x, n]) => {
      for (let i = 0; i < n; i++) gr += `<g class="melt" style="animation-delay:${f(0.2 + rnd() * 1.1)}s"><circle cx="${f(x - 30 + rnd() * 60)}" cy="${f(78 + rnd() * 30)}" r="4" fill="${C.orange}"/></g>`;
    });
    body += shown(1, gr);
    body += text(90, 340, '2숟가락', { size: 18 }) + text(230, 340, '10숟가락', { size: 18 });
    // 2칸: 연함·진함
    body += at(2, 'pop', tag(90, 250, '연함', GRAY, { size: 19 }), 0.2) + at(2, 'pop', tag(230, 250, '진함', HOT, { size: 19 }), 0.4);
    body += ring(230, 240, 50, 2, C.orange, 0.5);
    // 3칸: 오른쪽 둘: 색 없는 설탕물에 메추리알
    const egg = `<ellipse cx="0" cy="0" rx="16" ry="12" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="-6" cy="-3" r="2.6" fill="${C.muted}"/><circle cx="5" cy="3" r="2.2" fill="${C.muted}"/><circle cx="7" cy="-5" r="1.8" fill="${C.muted}"/>`;
    [2, 3].forEach((k) => {
      const x = xs[k];
      body += at(3, 'fin', water(x - HW, WL, x + HW, BT) + `<g class="egg e${k}"><g transform="translate(${x} 0)">${egg}</g></g>` + beakerLine(x - HW, TP, x + HW, BT), 0);
    });
    body += at(3, 'fin', text(410, 340, '각설탕 1개', { size: 18 }) + text(550, 340, '각설탕 10개', { size: 18 }), 0);
    // 4칸: 진한 쪽 둘
    body += glowRect(xs[1] - HW - 8, TP - 8, 2 * HW + 16, BT - TP + 16, 4, C.orange, 0.2, 12) + glowRect(xs[3] - HW - 8, TP - 8, 2 * HW + 16, BT - TP + 16, 4, C.orange, 0.4, 12);
    body += at(4, 'pop', tag(550, 114, '진함', HOT, { size: 19 }), 0.6);
    body += at(4, 'pop', tag(320, 24, '진하기', OK, { size: 22 }), 0.9);
    css += `
      .sc-${id} .melt { opacity: 0; }
      .on1 .sc-${id} .melt { animation: ${id}-melt 1.3s ease-in both; }
      @keyframes ${id}-melt { 0% { opacity: 0; } 15% { opacity: 1; } 70% { opacity: 1; transform: translateY(95px); } 100% { opacity: 0; transform: translateY(130px); } }
      .sc-${id} .tn { opacity: 0; transition: opacity 2s ease-in-out 1.2s; }
      .on1 .sc-${id} .tn { opacity: 1; }
      .sc-${id} .egg { transform: translateY(90px); opacity: 0; }
      .on3 .sc-${id} .e2 { animation: ${id}-e2 2.2s ease-in-out .4s both; }
      .on3 .sc-${id} .e3 { animation: ${id}-e3 2.6s ease-in-out .4s both; }
      @keyframes ${id}-e2 { 0% { opacity: 0; transform: translateY(90px); } 15% { opacity: 1; } 100% { opacity: 1; transform: translateY(${BT - 16}px); } }
      @keyframes ${id}-e3 { 0% { opacity: 0; transform: translateY(90px); } 15% { opacity: 1; } 55% { transform: translateY(262px); } 100% { opacity: 1; transform: translateY(204px); } }`;
    put('5-1/과학/3/진하기', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
