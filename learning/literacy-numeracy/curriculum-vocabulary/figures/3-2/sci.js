// 과학 3-2 낱말 도식: 물체와 물질·물질의 상태·밀물과 썰물·소리·감염병 낱말을 코드로 그린다.
// 물질 색: 나무 살구/주황, 유리 하늘/파랑, 금속 회색, 플라스틱 연보라/보라. 물은 하늘색.
// 눈에 보이지 않는 공기는 점선 테두리의 빈 동그라미로 적는다(칸 글에서 보이지 않는다고 말한다).
// 병원체는 작은 보라 동그라미에 짧은 돌기를 붙인 단순한 표시로 그린다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple];
  const MAT = { wood: HOT, glass: COLD, metal: [C.line, C.muted], plastic: LIL };
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20, dash = false } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"${dash ? ' stroke-dasharray="6 4"' : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다. pts 는 꺾은선 [[x,y], ...].
  const flow = (pts, color, { w = 5, dash = '14 10', cls = '' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g class="${cls}"><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  // 굽은 화살표(2차 곡선)
  const bend = (x1, y1, cx, cy, x2, y2, color, w = 4, dash = '') => `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>` + head(x2, y2, Math.atan2(y2 - cy, x2 - cx), color, w);
  const gas = (x, y, color = C.blue, r = 8) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${color}" stroke-width="2.5" stroke-dasharray="3.5 2.5"/>`;
  // 흔들흔들 떠다니는 기체 알갱이
  const jig = (x, y, k, color = C.blue, r = 8) => `<g class="jig" style="animation-delay:${f(-(k * 0.37) % 2.4)}s">${gas(x, y, color, r)}</g>`;
  const germ = (x, y, r = 9) => {
    let s = '';
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3 + 0.5, c = Math.cos(a), d = Math.sin(a);
      s += `<path d="M${f(x + r * c)} ${f(y + r * d)} L${f(x + (r + 4) * c)} ${f(y + (r + 4) * d)}" stroke="${C.purple}" stroke-width="2.5" stroke-linecap="round"/><circle cx="${f(x + (r + 5.5) * c)}" cy="${f(y + (r + 5.5) * d)}" r="2.6" fill="${C.purple}"/>`;
    }
    return `<g>${s}<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/></g>`;
  };
  // 사람 표시: (x, y) 는 어깨선 가운데
  const person = (x, y, [fill, stroke] = GRAY, s = 1) => `<g><circle cx="${f(x)}" cy="${f(y - 26 * s)}" r="${f(17 * s)}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
    + `<path d="M${f(x - 28 * s)} ${f(y + 62 * s)} V${f(y + 14 * s)} Q${f(x - 28 * s)} ${f(y)} ${f(x - 14 * s)} ${f(y)} H${f(x + 14 * s)} Q${f(x + 28 * s)} ${f(y)} ${f(x + 28 * s)} ${f(y + 14 * s)} V${f(y + 62 * s)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/></g>`;
  const flame = (x, y, h = 32, w = 14, s = 0) => `<g class="flk"${dl(s)}><path d="M${x} ${y - h} Q${x + w} ${f(y - h * 0.35)} ${f(x + w * 0.6)} ${y} H${f(x - w * 0.6)} Q${x - w} ${f(y - h * 0.35)} ${x} ${y - h} Z" fill="${C.orange}"/><path d="M${x} ${f(y - h * 0.55)} Q${f(x + w * 0.5)} ${f(y - h * 0.2)} ${f(x + w * 0.3)} ${y} H${f(x - w * 0.3)} Q${f(x - w * 0.5)} ${f(y - h * 0.2)} ${x} ${f(y - h * 0.55)} Z" fill="${C.yellow}"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const glowPath = (d, n, color = C.green, delay = 0, w = 6) => `<g class="b${n}"><path class="flash flash${n}"${dl(delay)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 컵(옆에서 본 모습): 밑 가운데 (cx, by), 높이 h, 위 폭 tw, 밑 폭 bw
  const cupD = (cx, by, h, top, bot) => `M${f(cx - top / 2)} ${f(by - h)} L${f(cx - bot / 2)} ${by} H${f(cx + bot / 2)} L${f(cx + top / 2)} ${f(by - h)} Z`;
  const cup = (cx, by, h, top, bot, [fill, stroke]) => `<path d="${cupD(cx, by, h, top, bot)}" fill="${fill}" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round"/><path d="M${f(cx - top / 2)} ${f(by - h)} H${f(cx + top / 2)}" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>`;
  // 위가 트인 그릇(투명)
  const openBox = (x1, y1, x2, y2, stroke = C.blue) => `<path d="M${x1} ${y1} V${y2 - 6} Q${x1} ${y2} ${x1 + 6} ${y2} H${x2 - 6} Q${x2} ${y2} ${x2} ${y2 - 6} V${y1}" fill="white" fill-opacity=".55" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`;
  const openLine = (x1, y1, x2, y2, stroke = C.blue) => `<path d="M${x1} ${y1} V${y2 - 6} Q${x1} ${y2} ${x1 + 6} ${y2} H${x2 - 6} Q${x2} ${y2} ${x2} ${y2 - 6} V${y1}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`;
  // 나무토막
  const woodBlock = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
    + `<path d="M${x + 8} ${f(y + h * 0.35)} Q${f(x + w * 0.5)} ${f(y + h * 0.2)} ${x + w - 8} ${f(y + h * 0.38)} M${x + 8} ${f(y + h * 0.68)} Q${f(x + w * 0.5)} ${f(y + h * 0.82)} ${x + w - 8} ${f(y + h * 0.64)}" stroke="${C.orange}" stroke-width="2" fill="none" opacity=".7"/>`;
  const speaker = (x, y, s = 1) => `<g><rect x="${f(x - 20 * s)}" y="${f(y - 12 * s)}" width="${f(14 * s)}" height="${f(24 * s)}" rx="3" fill="${C.muted}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${f(x - 6 * s)} ${f(y - 12 * s)} L${f(x + 12 * s)} ${f(y - 26 * s)} V${f(y + 26 * s)} L${f(x - 6 * s)} ${f(y + 12 * s)} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/></g>`;
  // 귀(옆에서 본 모습, 왼쪽에서 오는 소리를 듣는다)
  const ear = (x, y) => `<g><path d="M${x - 8} ${y - 24} C${x + 14} ${y - 32} ${x + 28} ${y - 6} ${x + 14} ${y + 8} C${x + 6} ${y + 16} ${x + 10} ${y + 28} ${x - 4} ${y + 28} C${x - 12} ${y + 28} ${x - 14} ${y + 20} ${x - 12} ${y + 14} C${x - 16} ${y + 2} ${x - 20} ${y - 18} ${x - 8} ${y - 24} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M${x - 6} ${y - 10} C${x + 4} ${y - 16} ${x + 12} ${y - 6} ${x + 4} ${y + 2} C${x} ${y + 6} ${x + 2} ${y + 12} ${x - 4} ${y + 14}" fill="none" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/></g>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .flk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .flk { transform-origin: 50% 100%; animation: ${id}-flk .6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease-in-out; }
    .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .jig { animation: ${id}-jig 2.4s ease-in-out infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-flk { from { transform: scaleY(1); } to { transform: scaleY(.8) scaleX(1.06); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(3px, -3px); } 50% { transform: translate(-2px, 3px); } 75% { transform: translate(-3px, -1px); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -60px)); } }
    @keyframes ${id}-fly { 0% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, 0)); } 15% { opacity: 1; } 100% { opacity: 1; transform: translate(0, 0); } }
    .sc-${id} .up { animation: ${id}-up 2.4s ease-out infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .fly${n} { animation: ${id}-fly 1.1s ease-out both; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };
  // 칸마다 값이 바뀌는 transform. vals[0] 은 처음, vals[n] 은 n칸. null 은 그대로.
  const steps = (id, cls, vals, sec = 1.6, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`).join('');

  // ════ 1단원 물체와 물질 ════

  // ── 물체: 컵·연필·숟가락. 모양이 있고 자리를 차지한다 ──
  (function () {
    const id = 't32-c1-mulche';
    let css = base(id);
    let body = `<rect x="40" y="270" width="560" height="16" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    // 차지한 자리(물체 뒤에 깐다)
    const room = [[102, 138, 116, 132], [246, 244, 186, 26], [432, 244, 144, 26]];
    room.forEach(([x, y, w, h], k) => { body += at(2, 'pop', `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-dasharray="8 6"/>`, 0.15 * k); });
    const cupG = cup(160, 270, 124, 104, 76, MAT.glass) + `<path d="M132 168 L137 250" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".9"/>`;
    const pencil = `<rect x="262" y="252" width="132" height="18" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><path d="M262 252 h-10 v18 h10" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><path d="M394 252 L424 261 L394 270 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M414 258 L424 261 L414 264 Z" fill="${C.ink}"/>`;
    const spoon = `<rect x="440" y="257" width="86" height="9" rx="4.5" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><ellipse cx="546" cy="259" rx="26" ry="10" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    [cupG, pencil, spoon].forEach((o, k) => { body += at(1, 'drop', g('pulse pulse2', o, 0.2 * k), 0.2 * k); });
    body += at(3, 'pop', tag(160, 112, '물체', OK, { size: 22 }), 0) + at(3, 'pop', tag(338, 214, '물체', OK, { size: 22 }), 0.2) + at(3, 'pop', tag(504, 214, '물체', OK, { size: 22 }), 0.4);
    put('3-2/과학/1/물체', svg(id, body, css));
  })();

  // ── 물질: 같은 컵을 다른 물질로, 나무 한 가지로 여러 물체를 ──
  (function () {
    const id = 't32-c1-muljil';
    let css = base(id);
    let body = `<path d="M318 40 V250" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 8"/>`;
    const cups = [[65, MAT.glass, '유리'], [165, MAT.plastic, '플라스틱'], [265, MAT.metal, '금속']];
    cups.forEach(([x, m, name], k) => {
      body += at(1, 'pop', cup(x, 200, 92, 74, 54, m), 0.2 * k);
      body += at(1, 'fin', text(x, 238, name, { size: 19, color: m[1] === C.muted ? C.ink : m[1] }), 0.2 * k + 0.3);
    });
    body += at(2, 'pop', woodBlock(345, 148, 80, 50), 0) + at(2, 'fin', text(385, 238, '나무', { size: 19, color: C.orange }), 0.2);
    const spoon = `<rect x="482" y="90" width="80" height="11" rx="5.5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><ellipse cx="584" cy="95" rx="24" ry="14" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    const bowl = `<path d="M496 166 Q500 208 545 208 Q590 208 594 166 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M490 166 H600" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/>`;
    const sticks = `<path d="M492 262 L604 246 M492 276 L604 264" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/>`;
    [[spoon, [432, 162, 476, 108]], [bowl, [432, 173, 482, 182]], [sticks, [432, 184, 478, 252]]].forEach(([o, [x1, y1, x2, y2]], k) => {
      body += at(2, 'fin', `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>` + head(x2, y2, Math.atan2(y2 - y1, x2 - x1), C.orange, 3.5), 0.4 + 0.3 * k);
      body += at(2, 'pop', o, 0.6 + 0.3 * k);
    });
    // 3칸: 재료 이름이 모두 물질
    [[65, 2], [165, 4], [265, 2], [385, 2]].forEach(([x, n], k) => { body += glowRect(x - n * 10 - 10, 216, n * 20 + 20, 32, 3, C.green, 0.15 * k, 10); });
    body += shown(3, `<path d="M40 256 V266 H410 V256 M225 266 V286" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    body += at(3, 'pop', tag(225, 312, '물질', OK, { size: 24 }), 0.5);
    put('3-2/과학/1/물질', svg(id, body, css));
  })();

  // ── 분류: 섞인 물건을 '물질의 종류' 기준으로 네 무리로 나눈다 ──
  (function () {
    const id = 't32-c1-bunryu';
    let css = base(id);
    let body = '';
    const bins = [[95, '나무', MAT.wood], [245, '유리', MAT.glass], [395, '금속', MAT.metal], [545, '플라스틱', MAT.plastic]];
    bins.forEach(([x, name, m], k) => {
      body += at(2, 'rise', `<path d="M${x - 65} 236 V316 Q${x - 65} 322 ${x - 59} 322 H${x + 59} Q${x + 65} 322 ${x + 65} 316 V236" fill="white" stroke="${m[1]}" stroke-width="4" stroke-linejoin="round"/>` + tag(x, 214, name, m, { size: 19 }), 0.15 * k);
    });
    body += at(2, 'pop', tag(320, 34, '기준: 물질의 종류', GRAY, { size: 20 }), 0.7);
    // 물건(무리 안 마지막 자리에 그리고, 처음엔 위쪽 더미로 옮겨 둔다)
    const W = MAT.wood, G = MAT.glass, M = MAT.metal, P = MAT.plastic;
    const items = [
      [65, 292, `<path d="M41 302 L89 280 M45 308 L93 286" stroke="${W[1]}" stroke-width="6" stroke-linecap="round"/>`, [300, 110]],
      [125, 292, woodBlock(103, 278, 44, 28), [440, 82]],
      [215, 292, `<circle cx="215" cy="292" r="14" fill="${G[0]}" stroke="${G[1]}" stroke-width="3"/><circle cx="210" cy="287" r="4" fill="white"/>`, [160, 92]],
      [275, 292, `<path d="M269 270 H281 V278 Q291 284 291 294 V306 Q291 310 287 310 H263 Q259 310 259 306 V294 Q259 284 269 278 Z" fill="${G[0]}" stroke="${G[1]}" stroke-width="3" stroke-linejoin="round"/>`, [522, 124]],
      [365, 292, `<path d="M358 306 V280 Q358 272 366 272 Q374 272 374 280 V302 Q374 308 368 308 Q362 308 362 302 V284" fill="none" stroke="${M[1]}" stroke-width="4" stroke-linecap="round"/>`, [232, 152]],
      [425, 292, `<circle cx="425" cy="292" r="14" fill="none" stroke="${M[1]}" stroke-width="7"/>`, [378, 150]],
      [515, 296, `<rect x="495" y="286" width="40" height="22" rx="3" fill="${P[0]}" stroke="${P[1]}" stroke-width="3"/><rect x="501" y="279" width="10" height="7" rx="2" fill="${P[0]}" stroke="${P[1]}" stroke-width="2.5"/><rect x="519" y="279" width="10" height="7" rx="2" fill="${P[0]}" stroke="${P[1]}" stroke-width="2.5"/>`, [100, 140]],
      [575, 292, `<path d="M555 310 L595 310 L555 272 Z M563 302 L578 302 L563 288 Z" fill="${P[0]}" fill-rule="evenodd" stroke="${P[1]}" stroke-width="3" stroke-linejoin="round"/>`, [255, 76]]
    ];
    items.forEach(([x, y, o, [px, py]], k) => {
      body += `<g class="it it${k}">${o}</g>`;
      css += `.sc-${id} .it${k} { transform: translate(${px - x}px, ${py - y}px); transition: transform 1.1s ease-in-out ${f(0.12 * k)}s; } .on3 .sc-${id} .it${k} { transform: none; }`;
    });
    bins.forEach(([x, , m], k) => { body += glowRect(x - 72, 196, 144, 132, 4, m[1], 0.15 * k, 12); });
    body += at(4, 'pop', tag(320, 140, '분류', OK, { size: 26 }), 0.6);
    put('3-2/과학/1/분류', svg(id, body, css));
  })();

  // ── 상태: 플라스틱 조각·물·공기 → 고체·액체·기체 ──
  (function () {
    const id = 't32-c1-sangtae';
    let css = base(id);
    let body = '';
    [110, 320, 530].forEach((x, k) => { body += at(k + 1, 'fin', `<rect x="${x - 95}" y="62" width="190" height="200" rx="18" fill="white" stroke="${C.line}" stroke-width="3"/>`); });
    // 1칸: 플라스틱 조각
    body += at(1, 'pop', `<g class="wob"><path d="M74 122 L130 106 L150 148 L104 172 L78 158 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3.5" stroke-linejoin="round"/></g>`, 0.2);
    body += at(1, 'pop', tag(75, 228, '보임', OK, { size: 18 }), 0.6) + at(1, 'pop', tag(145, 228, '잡힘', OK, { size: 18 }), 0.8);
    // 2칸: 기울인 컵에서 물이 흐른다
    body += at(2, 'fin', `<g transform="rotate(40 290 112)">${cup(290, 147, 70, 60, 44, ['white', C.blue])}</g><path d="M334 109 L285 151 L252 125 L262 109 Z" fill="${C.sky}"/><g transform="rotate(40 290 112)"><path d="${cupD(290, 147, 70, 60, 44)}" fill="none" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/></g>`);
    body += shown(2, `<path class="mar" d="M334 110 Q352 128 352 196" stroke="${C.sky}" stroke-width="9" stroke-linecap="round" stroke-dasharray="14 10" fill="none"/>`);
    body += at(2, 'pop', `<ellipse cx="352" cy="202" rx="44" ry="9" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`, 0.5);
    body += at(2, 'pop', tag(285, 228, '보임', OK, { size: 18 }), 0.8) + at(2, 'pop', tag(355, 228, '흐름', COLD, { size: 18 }), 1.0);
    // 3칸: 지퍼 백 속 공기
    let air = '';
    [[500, 130], [540, 118], [575, 140], [512, 168], [552, 160], [582, 182], [492, 186], [530, 190]].forEach(([x, y], k) => { air += jig(x, y, k); });
    body += at(3, 'pop', `<path d="M470 100 H590 Q602 150 590 202 Q530 214 470 202 Q458 150 470 100 Z" fill="white" stroke="${C.muted}" stroke-width="3"/><rect x="466" y="92" width="128" height="10" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>${air}`, 0.1);
    body += at(3, 'pop', tag(530, 232, '안 보임', GRAY, { size: 18, dash: true }), 0.8);
    // 4칸: 이름과 '상태'
    [[110, '고체'], [320, '액체'], [530, '기체']].forEach(([x, name], k) => { body += at(4, 'pop', tag(x, 300, name, OK, { size: 22 }), 0.2 * k); });
    body += shown(4, lead(286, 32, 110, 62, C.green) + lead(320, 48, 320, 62, C.green) + lead(354, 32, 530, 62, C.green));
    body += at(4, 'pop', tag(320, 30, '상태', OK, { size: 22 }), 0.7);
    css += `.sc-${id} .wob { transform-box: fill-box; transform-origin: center; animation: ${id}-wob 2.6s ease-in-out infinite; }
      @keyframes ${id}-wob { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-6deg); } }`;
    put('3-2/과학/1/상태', svg(id, body, css));
  })();

  // ── 고체: 나무토막을 모양이 다른 그릇으로 옮겨도 모양과 크기가 그대로 ──
  (function () {
    const id = 't32-c1-goche';
    let css = base(id);
    let body = openBox(60, 170, 220, 270) + `<path d="M240 170 A80 115 0 0 0 400 170" fill="white" fill-opacity=".55" stroke="${C.blue}" stroke-width="4"/>` + openBox(450, 110, 560, 280);
    // 떠난 자리에 남는 점선 테두리
    body += at(2, 'fin', `<rect x="105" y="216" width="70" height="50" rx="5" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="7 5"/>`, 0.3);
    body += at(2, 'fin', `<rect x="285" y="216" width="70" height="50" rx="5" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="7 5"/>`, 1.2);
    body += at(1, 'drop', `<g class="mv">${woodBlock(105, 216, 70, 50)}</g>`, 0.2);
    css += `.on2 .sc-${id} .mv { animation: ${id}-mv 2s ease-in-out both; }
      @keyframes ${id}-mv { 0% { transform: translate(0, 0); } 14% { transform: translate(0, -110px); } 30% { transform: translate(180px, -110px); } 42%, 52% { transform: translate(180px, 0); } 66% { transform: translate(180px, -165px); } 84% { transform: translate(365px, -165px); } 100% { transform: translate(365px, 10px); } }`;
    [[105, 216], [285, 216], [470, 226]].forEach(([x, y], k) => { body += glowRect(x - 5, y - 5, 80, 60, 3, C.green, 0.2 * k, 8); });
    body += at(3, 'pop', tag(170, 60, '모양 그대로', OK, { size: 19 }), 0.5) + at(3, 'pop', tag(320, 60, '크기 그대로', OK, { size: 19 }), 0.7);
    body += at(3, 'pop', tag(505, 60, '고체', OK, { size: 24 }), 1.0);
    put('3-2/과학/1/고체', svg(id, body, css));
  })();

  // ── 액체: 물을 옮겨 담으면 모양은 그릇대로, 다시 부으면 처음 높이 ──
  (function () {
    const id = 't32-c1-aekche';
    let css = base(id);
    let body = '';
    body += `<rect class="lv wA" x="62" y="190" width="126" height="88" fill="${C.sky}"/>`;
    body += `<rect class="lv wB" x="237" y="215" width="176" height="63" fill="${C.sky}"/>`;
    body += `<rect class="lv wC" x="467" y="110" width="66" height="168" fill="${C.sky}"/>`;
    body += openLine(60, 110, 190, 280) + openLine(235, 200, 415, 280) + openLine(465, 80, 535, 280);
    body += at(1, 'fin', `<path d="M50 190 H200" stroke="${C.red}" stroke-width="3.5" stroke-dasharray="9 6"/>` + text(125, 176, '처음 높이', { size: 18, color: C.red }), 1.1);
    body += shown(2, bend(150, 100, 250, 60, 300, 190, C.blue, 4, '10 7'), 3);
    body += `<g class="b2 h3">${g('fin fin2', bend(395, 195, 420, 60, 495, 72, C.blue, 4, '10 7'), 1)}</g>`;
    body += at(2, 'pop', tag(340, 128, '모양 바뀜', COLD, { size: 19 }), 0.6).replace('class="b2"', 'class="b2 h3"');
    body += shown(3, bend(505, 70, 320, -20, 130, 100, C.blue, 4, '10 7'));
    body += at(3, 'pop', tag(340, 128, '부피 그대로', OK, { size: 19 }), 1.4);
    body += `<g class="b3"><path class="flash flash3" style="animation-delay:1.3s" d="M50 190 H200" stroke="${C.red}" stroke-width="7" fill="none"/></g>`;
    body += glowRect(60, 185, 130, 97, 4, C.green, 0, 6) + at(4, 'pop', tag(340, 75, '액체', COLD, { size: 24 }), 0.4);
    css += `
      .sc-${id} .wA { transform: scaleY(0); transition: transform .9s ease-in-out .2s; }
      .on1 .sc-${id} .wA { transform: scaleY(1); }
      .on2 .sc-${id} .wA { transform: scaleY(0); transition-delay: 0s; }
      .on3 .sc-${id} .wA { transform: scaleY(1); transition: transform 1s ease-in-out .1s; }
      .sc-${id} .wB { transform: scaleY(0); }
      .on2 .sc-${id} .wB { animation: ${id}-b 2s ease-in-out both; }
      @keyframes ${id}-b { 0% { transform: scaleY(0); } 45%, 55% { transform: scaleY(1); } 100% { transform: scaleY(0); } }
      .sc-${id} .wC { transform: scaleY(0); transition: transform .9s ease-in-out; }
      .on2 .sc-${id} .wC { transform: scaleY(1); transition-delay: 1.1s; }
      .on3 .sc-${id} .wC { transform: scaleY(0); transition: transform 1s ease-in-out .1s; }`;
    put('3-2/과학/1/액체', svg(id, body, css));
  })();

  // ── 기체: 모양이 다른 튜브에 넣은 공기가 튜브 모양이 되어 안을 가득 채운다 ──
  (function () {
    const id = 't32-c1-giche';
    let css = base(id);
    const rnd = seeded(32071);
    const shapes = [
      { cx: 135, cy: 205, d: 'M82 163 H188 A42 42 0 0 1 188 247 H82 A42 42 0 0 1 82 163 Z', inside: (x, y) => (x >= 82 && x <= 188 && Math.abs(y - 205) <= 30) || Math.hypot(x - 82, y - 205) <= 30 || Math.hypot(x - 188, y - 205) <= 30, n: 1, top: 163 },
      { cx: 330, cy: 205, d: 'M258 205 A72 72 0 1 1 402 205 A72 72 0 1 1 258 205 Z', inside: (x, y) => Math.hypot(x - 330, y - 205) <= 60, n: 2, top: 133 },
      { cx: 520, cy: 205, d: 'M442 205 A78 78 0 1 1 598 205 A78 78 0 1 1 442 205 Z M492 205 A28 28 0 1 0 548 205 A28 28 0 1 0 492 205 Z', inside: (x, y) => { const r = Math.hypot(x - 520, y - 205); return r >= 40 && r <= 66; }, n: 2, top: 127 }
    ];
    let body = '';
    shapes.forEach((s, k) => {
      const fill = `<path d="${s.d}" fill="${C.sky}" fill-opacity=".35" fill-rule="evenodd" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round"/>`;
      body += `<g class="noz noz${k}"><rect x="${s.cx - 7}" y="${s.top - 16}" width="14" height="18" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/></g>`;
      css += steps(id, `noz${k}`, s.n === 1 ? [`translateY(${f(0.88 * (s.cy - s.top))}px)`, 'none'] : [`translateY(${f(0.88 * (s.cy - s.top))}px)`, null, 'none'], 1.6, 0.4);
      body += `<g class="inf inf${k}">${fill}</g>`;
      css += `.sc-${id} .inf${k} { transform-box: view-box; transform-origin: ${s.cx}px ${s.cy}px; }` + steps(id, `inf${k}`, s.n === 1 ? ['scaleY(.12)', 'scaleY(1)'] : ['scaleY(.12)', null, 'scaleY(1)'], 1.6, 0.4);
      // 공기 알갱이: 고르게 흩어 놓는다
      const pts = [];
      for (let t = 0; t < 900 && pts.length < 40; t++) {
        const x = s.cx - 80 + rnd() * 160, y = s.cy - 72 + rnd() * 144;
        if (s.inside(x, y) && pts.every(([a, b]) => Math.hypot(a - x, b - y) >= 24)) pts.push([x, y]);
      }
      body += `<g class="b${s.n}"><g class="air air${k}">${pts.map(([x, y], j) => jig(x, y, j + k * 7, C.blue, 7)).join('')}</g></g>`;
      css += `.sc-${id} .air${k} { opacity: 0; transition: opacity .8s ease-in 1.2s; } .on${s.n} .sc-${id} .air${k} { opacity: 1; }`;
      body += shown(s.n, flow([[s.cx, 52], [s.cx, s.top - 22]], C.blue, { w: 4, dash: '10 8' }), 3);
      body += glowPath(s.d, 3, C.green, 0.25 * k, 6);
    });
    body += at(4, 'pop', tag(330, 50, '기체', COLD, { size: 24 }), 0.3);
    put('3-2/과학/1/기체', svg(id, body, css));
  })();

  // ── 부피: 같은 그릇 속 물이 차지하는 자리의 크기 ──
  (function () {
    const id = 't32-c1-bupi';
    let css = base(id);
    let body = `<rect class="lv wL" x="112" y="236" width="136" height="52" fill="${C.sky}"/><rect class="lv wR" x="392" y="158" width="136" height="130" fill="${C.sky}"/>`;
    const cells = (x1, y1, rows) => {
      let s = '';
      for (let c = 1; c < 4; c++) s += `M${x1 + c * 34} ${y1} V288 `;
      for (let r = 1; r < rows; r++) s += `M${x1} ${y1 + r * 26} H${x1 + 136} `;
      return `<path d="${s}" stroke="white" stroke-width="3" stroke-dasharray="6 5"/>`;
    };
    body += at(2, 'fin', cells(112, 236, 2) + cells(392, 158, 5), 0.2);
    body += openLine(110, 100, 250, 290) + openLine(390, 100, 530, 290);
    body += glowRect(110, 233, 140, 58, 2, C.blue, 0.6, 4) + glowRect(390, 155, 140, 136, 2, C.blue, 0.6, 4);
    body += at(2, 'pop', tag(180, 325, '작다', COLD, { size: 20 }), 1.0) + at(2, 'pop', tag(460, 325, '크다', COLD, { size: 20 }), 1.2);
    body += glowRect(388, 152, 144, 142, 3, C.green, 0.2, 6) + at(3, 'pop', tag(460, 62, '부피', OK, { size: 24 }), 0.6) + shown(3, lead(460, 81, 460, 150, C.green));
    css += steps(id, 'wL', ['scaleY(0)', 'scaleY(1)'], 1.4, 0.3) + steps(id, 'wR', ['scaleY(0)', 'scaleY(1)'], 1.8, 0.3);
    put('3-2/과학/1/부피', svg(id, body, css));
  })();

  // ── 공간: 거꾸로 넣은 컵 속 공기가 자리를 차지해 수조의 물 높이가 올라간다 ──
  (function () {
    const id = 't32-c1-gonggan';
    let css = base(id);
    let body = `<rect class="lv wat" x="122" y="200" width="396" height="98" fill="${C.sky}"/>`;
    body += `<path d="M104 200 H136" stroke="${C.red}" stroke-width="4"/>` + text(56, 207, '처음 높이', { size: 18, color: C.red });
    // 공과 컵은 함께 내려간다
    const cupIn = 'M282 92 H358 L368 196 H272 Z';
    let airDots = '';
    [[300, 120], [338, 118], [292, 154], [322, 146], [348, 160]].forEach(([x, y], k) => { airDots += jig(x, y, k, C.blue, 7); });
    body += `<g class="b1"><g class="cupmv"><path d="${cupIn}" fill="white"/>${airDots}<path d="M280 92 H360 L370 212 M280 92 L270 212" fill="none" stroke="${C.purple}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`
      + `<g class="b3"><path class="flash flash3" d="${cupIn}" fill="none" stroke="${C.green}" stroke-width="5" stroke-linejoin="round"/></g></g></g>`;
    body += `<g class="ball"><circle cx="320" cy="196" r="17" fill="white" stroke="${C.muted}" stroke-width="3"/></g>`;
    body += `<path d="M120 100 V294 Q120 300 126 300 H514 Q520 300 520 294 V100" fill="none" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round"/>`;
    body += shown(2, flow([[478, 236], [478, 186]], C.orange, { w: 4, dash: '8 7' }));
    body += at(2, 'pop', tag(205, 140, '공기', GRAY, { size: 19, dash: true }), 1.5) + shown(2, lead(226, 156, 286, 212, C.muted));
    body += at(3, 'pop', tag(560, 50, '공간', OK, { size: 24 }), 0.5) + shown(3, lead(530, 64, 372, 188, C.green));
    css += steps(id, 'cupmv', ['translateY(-60px)', 'translateY(0)', 'translateY(84px)'], 1.4, 0.2)
      + steps(id, 'ball', ['none', null, 'translateY(84px)'], 1.4, 0.2)
      + steps(id, 'wat', ['scaleY(1)', null, 'scaleY(1.2)'], 1.4, 0.2);
    put('3-2/과학/1/공간', svg(id, body, css));
  })();

  // ════ 2단원 지구와 바다 ════

  // ── 가열: 증발 접시의 바닷물에 가열 장치로 열을 준다 ──
  (function () {
    const id = 't32-c2-gayeol';
    let css = base(id);
    const bowl = 'M220 150 Q232 202 320 202 Q408 202 420 150 Z';
    let body = `<defs><clipPath id="${id}-c"><path d="${bowl}"/></clipPath></defs>`;
    body += `<path d="M240 206 L228 306 M400 206 L412 306" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/><path d="M230 206 H410" stroke="${C.muted}" stroke-width="6" stroke-linecap="round"/>`;
    body += `<rect x="284" y="262" width="72" height="44" rx="6" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<path d="${bowl}" fill="white"/>`;
    body += `<g clip-path="url(#${id}-c)"><rect class="lv wat" x="216" y="160" width="208" height="44" fill="${C.sky}"/></g>`;
    body += `<path class="rim" d="${bowl}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
    // 2칸: 불, 열, 김
    body += shown(2, flame(320, 262, 48, 18));
    [292, 348].forEach((x) => { body += shown(2, flow([[x, 254], [x, 216]], C.orange, { w: 3.5, dash: '6 7' })); });
    [262, 300, 340, 378].forEach((x, k) => { body += shown(2, `<g class="up" style="animation-delay:${f(0.6 * k)}s;--up:-70px"><path d="M${x} 140 q-9 -12 0 -24 q9 -12 0 -24" stroke="${C.muted}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`); });
    body += text(140, 170, '바닷물', { size: 19, color: C.blue }) + lead(178, 176, 250, 178, C.blue);
    body += text(500, 158, '증발 접시', { size: 19 }) + lead(450, 152, 424, 152);
    body += text(500, 290, '가열 장치', { size: 19 }) + lead(450, 284, 360, 284);
    body += ring(320, 236, 34, 3, C.orange, 0) + at(3, 'pop', tag(140, 252, '가열', HOT, { size: 26 }), 0.4);
    css += steps(id, 'wat', ['scaleY(1)', null, 'scaleY(.45)'], 3, 0.6)
      + `.sc-${id} .rim { transition: stroke .8s ease .3s; } .on2 .sc-${id} .rim { stroke: ${C.orange}; }`;
    put('3-2/과학/2/가열', svg(id, body, css));
  })();

  // ── 밀물·썰물: 옆에서 본 바닷가. 바닷물의 높이가 오르내린다 ──
  [true, false].forEach((rising) => {
    const id = rising ? 't32-c2-milmul' : 't32-c2-sseolmul';
    let css = base(id);
    const LOW = 'translateY(57px)';
    let body = `<rect class="sea" x="0" y="205" width="640" height="160" fill="${C.sky}"/><path class="sea" d="M0 205 H640" stroke="${C.blue}" stroke-width="3"/>`;
    body += `<g class="b3"><g class="sea"><path class="flash flash3" d="M0 205 H640" stroke="${C.green}" stroke-width="7"/></g></g>`;
    body += `<path d="M0 140 H170 L230 215 L640 290 V360 H0 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M0 140 H170" stroke="${C.green}" stroke-width="8"/>`;
    // 바닷물 높이 막대
    let ticks = '';
    for (let y = 185; y <= 275; y += 15) ticks += `M608 ${y} H622 `;
    body += `<path d="M615 170 V286" stroke="${C.muted}" stroke-width="5"/><path d="${ticks}" stroke="${C.muted}" stroke-width="2.5"/>`;
    // 배: 바닷물 위에 떠 있을 때를 기준으로 그리고, 물이 빠지면 갯벌에 얹힌다
    body += `<g class="boat"><path d="M384 196 H456 L446 212 H394 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M420 196 V162 L446 190 H420" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/></g>`;
    body += text(80, 200, '육지', { size: 22 }) + text(560, 182, '바다', { size: 22, color: C.blue });
    const gyet = `${text(400, 290, '갯벌', { size: 20, color: C.orange })}`;
    body += rising ? shown(1, gyet, 2) : at(2, 'fin', gyet, 1.4);
    const dir = rising ? flow([[520, 120], [300, 120]], C.blue, { w: 5 }) : flow([[300, 120], [520, 120]], C.blue, { w: 5 });
    body += shown(2, dir) + at(2, 'pop', tag(410, 80, rising ? '육지 쪽으로' : '바다 쪽으로', COLD, { size: 19 }), 0.3);
    body += shown(2, rising ? flow([[592, 258], [592, 212]], C.orange, { w: 4 }) : flow([[592, 212], [592, 258]], C.orange, { w: 4 }));
    body += at(3, 'pop', tag(170, 60, rising ? '밀물' : '썰물', OK, { size: 26 }), 0.5);
    css += steps(id, 'sea', rising ? [LOW, null, 'none'] : ['none', null, LOW], 2, 0.2)
      + `.sc-${id} .boat { transform-box: fill-box; transform-origin: 50% 100%; }` + steps(id, 'boat', rising ? ['translateY(38px) rotate(8deg)', null, 'none'] : ['none', null, 'translateY(38px) rotate(8deg)'], 2, 0.2);
    put(`3-2/과학/2/${rising ? '밀물' : '썰물'}`, svg(id, body, css));
  });

  // ════ 3단원 소리의 성질 ════

  // ── 떨림: 소리굽쇠를 치면 빠르게 떨리고, 물에 대면 물이 튄다 ──
  (function () {
    const id = 't32-c3-tteollim';
    let css = base(id);
    let body = `<rect x="140" y="292" width="220" height="50" rx="6" fill="${C.sky}"/><path d="M140 292 H360" stroke="${C.blue}" stroke-width="3"/><path d="M136 270 V336 Q136 344 144 344 H356 Q364 344 364 336 V270" fill="none" stroke="${C.blue}" stroke-width="4"/>`;
    const fork = `<path d="M250 112 V36" stroke="${C.muted}" stroke-width="13" stroke-linecap="round"/>`
      + `<g class="pl"><path d="M225 230 V134 Q225 112 250 112" stroke="${C.muted}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`
      + `<g class="pr"><path d="M275 230 V134 Q275 112 250 112" stroke="${C.muted}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
    body += `<g class="fk">${fork}</g>`;
    // 고무망치(1칸에 친다)
    body += shown(1, `<g class="mal"><path d="M370 120 L298 176" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/><circle cx="292" cy="181" r="13" fill="${C.red}" stroke="${C.ink}" stroke-width="2.5"/></g>`, 2);
    // 소리 물결
    let arcs = '';
    [0, 1, 2].forEach((k) => { arcs += `<path class="wv" style="animation-delay:${f(0.45 * k)}s" d="M168 120 Q150 170 168 220 M332 120 Q350 170 332 220" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`; });
    body += shown(1, arcs, 3);
    // 2칸: 크게 본 떨림
    let zoom = `<circle cx="480" cy="160" r="86" fill="white" stroke="${C.green}" stroke-width="4"/>`;
    zoom += `<g clip-path="url(#${id}-z)"><g class="zl"><path d="M450 90 V250" stroke="${C.muted}" stroke-width="18"/></g><g class="zr"><path d="M510 90 V250" stroke="${C.muted}" stroke-width="18"/></g></g>`;
    zoom += `<path d="M424 196 h-12 M424 212 h-12 M536 196 h12 M536 212 h12" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>`;
    body += `<defs><clipPath id="${id}-z"><circle cx="480" cy="160" r="84"/></clipPath></defs>`;
    body += `<g class="b2 h3">${lead(286, 214, 398, 186, C.green)}${g('pop pop2', zoom, 0.2)}</g>`;
    // 3칸: 물이 튄다
    let splash = '';
    [[214, -40, -26], [236, -52, 14], [264, -48, -14], [288, -38, 24], [222, -30, 30], [278, -56, -6]].forEach(([x, h, dx], k) => {
      splash += `<g class="sp" style="animation-delay:${f(0.13 * k)}s;--h:${h}px;--dx:${dx}px"><circle cx="${x}" cy="290" r="5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/></g>`;
    });
    body += shown(3, splash);
    body += ring(250, 200, 50, 4, C.green, 0) + at(4, 'pop', tag(120, 80, '떨림', OK, { size: 26 }), 0.4) + shown(4, lead(150, 96, 218, 150, C.green));
    css += `
      .sc-${id} .pl, .sc-${id} .pr { transform-box: view-box; transform-origin: 250px 112px; }
      .on1 .sc-${id} .pl { animation: ${id}-vl .08s linear .5s infinite; }
      .on1 .sc-${id} .pr { animation: ${id}-vr .08s linear .5s infinite; }
      @keyframes ${id}-vl { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(1.4deg); } }
      @keyframes ${id}-vr { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-1.4deg); } }
      .sc-${id} .zl, .sc-${id} .zr { animation: ${id}-zl .16s ease-in-out infinite; }
      .sc-${id} .zr { animation-name: ${id}-zr; }
      @keyframes ${id}-zl { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-11px); } }
      @keyframes ${id}-zr { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(11px); } }
      .sc-${id} .mal { transform-box: view-box; transform-origin: 370px 120px; }
      .on1 .sc-${id} .mal { animation: ${id}-hit .9s ease-in both; }
      @keyframes ${id}-hit { 0% { transform: rotate(-30deg); } 45% { transform: rotate(-34deg); } 60% { transform: rotate(0); } 75% { transform: rotate(-12deg); } 100% { transform: rotate(-18deg); } }
      .sc-${id} .wv { transform-box: view-box; transform-origin: 250px 170px; opacity: 0; animation: ${id}-wv 1.35s ease-out .5s infinite; }
      @keyframes ${id}-wv { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5); } }
      .sc-${id} .sp { opacity: 0; animation: ${id}-sp .8s ease-out 1.2s infinite; }
      @keyframes ${id}-sp { 0% { opacity: 1; transform: translate(0, 0); } 50% { opacity: 1; transform: translate(calc(var(--dx) * .6), var(--h)); } 100% { opacity: 0; transform: translate(var(--dx), 4px); } }`
      + steps(id, 'fk', ['none', null, null, 'translateY(60px)'], 1, 0.1);
    put('3-2/과학/3/떨림', svg(id, body, css));
  })();

  // ── 소리의 세기: 작은북을 약하게·세게 칠 때 ──
  (function () {
    const id = 't32-c3-segi';
    let css = base(id);
    let body = '';
    const drum = (cx, n, strong) => {
      const amp = strong ? -64 : -14;
      let s = `<path d="M${cx - 92} 230 V292 A92 20 0 0 0 ${cx + 92} 292 V230" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/>`;
      s += `<path d="M${cx - 80} 246 L${cx - 50} 300 L${cx - 20} 246 L${cx + 10} 304 L${cx + 40} 246 L${cx + 70} 300" stroke="${C.orange}" stroke-width="2.5" fill="none" opacity=".7"/>`;
      s += `<g class="skin${n}"><ellipse cx="${cx}" cy="230" rx="92" ry="20" fill="white" stroke="${C.muted}" stroke-width="3.5"/></g>`;
      [-50, -25, 0, 25, 50].forEach((dx, k) => {
        s += `<g class="bit bit${n}" style="animation-delay:${f(0.11 * k)}s;--h:${f(amp * (0.75 + 0.25 * ((k * 3) % 4) / 3))}px"><circle cx="${cx + dx}" cy="${226 - (k % 2) * 4}" r="6" fill="white" stroke="${C.muted}" stroke-width="2.5"/></g>`;
      });
      s += `<g class="stk stk${n}"><path d="M${cx + 150} 172 L${cx + 46} 212" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/><circle cx="${cx + 42}" cy="214" r="9" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g>`;
      let arcs = '';
      for (let k = 0; k < (strong ? 3 : 2); k++) arcs += `<path class="wv${n}" style="animation-delay:${f(0.36 * k)}s" d="M${f(cx - 70 * Math.cos(0.96))} ${f(225 - 70 * Math.sin(0.96))} A70 70 0 0 1 ${f(cx + 70 * Math.cos(0.96))} ${f(225 - 70 * Math.sin(0.96))}" stroke="${C.blue}" stroke-width="${strong ? 7 : 3}" fill="none" stroke-linecap="round"/>`;
      css += `.sc-${id} .wv${n} { transform-box: view-box; transform-origin: ${cx}px 225px; opacity: 0; }
        .on${n} .sc-${id} .wv${n} { animation: ${id}-wv 1.1s ease-out .2s infinite; }
        .sc-${id} .stk${n} { transform-box: view-box; transform-origin: ${cx + 150}px 172px; }
        .on${n} .sc-${id} .stk${n} { animation: ${id}-stk${n} .55s ease-in-out infinite; }
        .on${n} .sc-${id} .bit${n} { animation: ${id}-bit .55s ease-out infinite; }
        .sc-${id} .skin${n} { transform-box: fill-box; transform-origin: center; }
        .on${n} .sc-${id} .skin${n} { animation: ${id}-skin${n} .1s linear infinite; }
        @keyframes ${id}-stk${n} { 0%, 100% { transform: rotate(${strong ? -26 : -7}deg); } 30% { transform: rotate(0); } }
        @keyframes ${id}-skin${n} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(${strong ? 3 : 0.8}px); } }`;
      return s + arcs;
    };
    body += at(1, 'fin', drum(170, 1, false)) + at(2, 'fin', drum(470, 2, true));
    body += at(1, 'fin', text(170, 338, '약하게', { size: 20 }), 0.2) + at(2, 'fin', text(470, 338, '세게', { size: 20 }), 0.2);
    body += at(1, 'pop', tag(170, 56, '작은 소리', COLD, { size: 19 }), 0.8) + at(2, 'pop', tag(470, 56, '큰 소리', COLD, { size: 22 }), 0.8);
    body += at(3, 'pop', tag(320, 56, '소리의 세기', OK, { size: 22 }), 0.3);
    body += glowRect(105, 36, 130, 40, 3, C.green, 0.6, 20) + glowRect(410, 34, 120, 44, 3, C.green, 0.6, 22);
    css += `
      @keyframes ${id}-wv { 0% { opacity: .95; transform: scale(1); } 100% { opacity: 0; transform: scale(1.95); } }
      @keyframes ${id}-bit { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(0); } 62% { transform: translateY(var(--h)); } }`;
    put('3-2/과학/3/소리의 세기', svg(id, body, css));
  })();

  // ── 소리의 높낮이: 실로폰 음판이 짧을수록 높은 소리 ──
  (function () {
    const id = 't32-c3-nopnaji';
    let css = base(id);
    const cols = [C.red, C.orange, C.yellow, C.green, C.blue, C.purple];
    const X = (k) => 150 + k * 68, L = (k) => 170 - k * 18, NY = (k) => 105 - k * 12;
    let body = `<path d="M118 ${f(220 - 85 + 0.22 * 170)} L522 ${f(220 - 40 + 0.22 * 80)} M118 ${f(220 + 85 - 0.22 * 170)} L522 ${f(220 + 40 - 0.22 * 80)}" stroke="${C.muted}" stroke-width="6" stroke-linecap="round"/>`;
    for (let k = 0; k < 6; k++) {
      body += `<g class="bar bar${k}"><rect x="${X(k) - 22}" y="${220 - L(k) / 2}" width="44" height="${L(k)}" rx="6" fill="${cols[k]}" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${X(k)}" cy="${f(220 - L(k) / 2 + 0.22 * L(k))}" r="3.5" fill="white"/><circle cx="${X(k)}" cy="${f(220 + L(k) / 2 - 0.22 * L(k))}" r="3.5" fill="white"/></g>`;
    }
    const note = (k) => `<g><ellipse cx="${X(k)}" cy="${NY(k)}" rx="10" ry="7.5" transform="rotate(-20 ${X(k)} ${NY(k)})" fill="${cols[k]}" stroke="${C.ink}" stroke-width="2"/><path d="M${X(k) + 9} ${NY(k) - 2} V${NY(k) - 30} Q${X(k) + 19} ${NY(k) - 24} ${X(k) + 21} ${NY(k) - 14}" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
    body += at(1, 'pop', note(0), 0.6) + at(2, 'pop', note(5), 0.6);
    [1, 2, 3, 4].forEach((k) => { body += at(3, 'pop', note(k), 0.3 * k); });
    body += shown(3, `<path class="draw draw3" pathLength="1" d="M${X(0)} ${NY(0) + 14} ${[1, 2, 3, 4, 5].map((k) => `L${X(k)} ${NY(k) + 14}`).join(' ')}" stroke="${C.green}" stroke-width="3" stroke-dasharray="1" fill="none" style="transition-delay:1.2s"/>`);
    body += at(1, 'pop', tag(65, NY(0), '낮은 소리', COLD, { size: 18 }), 0.8) + at(2, 'pop', tag(574, NY(5) + 4, '높은 소리', HOT, { size: 18 }), 0.8);
    body += at(1, 'fin', text(X(0), 334, '긴 음판', { size: 19 }), 0.3) + at(2, 'fin', text(X(5), 334, '짧은 음판', { size: 19 }), 0.3);
    // 채
    const mallet = (k, d) => { const hx = X(k), hy = 200; return `<g class="ml ml${k}"><path d="M${hx + d * 62} ${hy - 52} L${hx + d * 8} ${hy - 7}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="11" fill="white" stroke="${C.ink}" stroke-width="3"/></g>`; };
    body += shown(1, mallet(0, -1), 2) + shown(2, mallet(5, 1), 3);
    [[0, -1], [5, 1]].forEach(([k, d]) => { css += `.sc-${id} .ml${k} { transform-box: view-box; transform-origin: ${X(k) + d * 62}px 148px; } .on${k ? 2 : 1} .sc-${id} .ml${k} { animation: ${id}-tap${k} 1s ease-in-out .1s 2 both; } @keyframes ${id}-tap${k} { 0%, 100% { transform: rotate(${-d * 16}deg); } 40% { transform: rotate(0); } }`; });
    css += `.sc-${id} .bar { transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .bar0 { animation: ${id}-sh .12s linear .45s 6; }
      .on2 .sc-${id} .bar5 { animation: ${id}-sh .12s linear .45s 6; }
      ${[1, 2, 3, 4].map((k) => `.on3 .sc-${id} .bar${k} { animation: ${id}-sh .12s linear ${f(0.3 * k - 0.1)}s 4; }`).join('')}
      @keyframes ${id}-sh { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2.5px); } 75% { transform: translateX(2.5px); } }
`;
    body += at(4, 'pop', tag(320, 335, '소리의 높낮이', OK, { size: 22 }), 0.3);
    for (let k = 0; k < 6; k++) body += ring(X(k), NY(k), 16, 4, C.green, 0.1 * k);
    put('3-2/과학/3/소리의 높낮이', svg(id, body, css));
  })();

  // ── 전달: 소리가 공기·실·물을 거쳐 귀까지 간다 ──
  (function () {
    const id = 't32-c3-jeondal';
    let css = base(id);
    let body = '';
    const travel = (n, y, x1, x2, color, count, h = 20) => {
      let s = '';
      for (let k = 0; k < count; k++) s += `<g class="tv${n}" style="animation-delay:${f((-2 * k) / count)}s"><path d="M0 ${-h} Q${h * 0.7} 0 0 ${h}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
      css += `.on${n} .sc-${id} .tv${n} { animation: ${id}-tv${n} 2s linear infinite; }
        .sc-${id} .tv${n} { transform: translate(${x1}px, ${y}px); }
        @keyframes ${id}-tv${n} { 0% { opacity: 0; transform: translate(${x1}px, ${y}px); } 12%, 88% { opacity: 1; } 100% { opacity: 0; transform: translate(${x2}px, ${y}px); } }`;
      return s;
    };
    // 1칸: 공기
    body += at(1, 'fin', speaker(75, 60) + ear(580, 60) + travel(1, 60, 108, 545, C.blue, 4) + text(320, 108, '공기', { size: 20, color: C.muted }));
    // 2칸: 실 전화기
    const cupL = `<path d="M58 140 L104 152 V178 L58 190 Z" fill="white" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`;
    const cupR = `<path d="M582 140 L536 152 V178 L582 190 Z" fill="white" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`;
    let dots = '';
    for (let k = 0; k < 3; k++) dots += `<g class="dt" style="animation-delay:${f((-1.6 * k) / 3)}s"><circle cx="0" cy="165" r="6" fill="${C.orange}"/></g>`;
    body += at(2, 'fin', `<path d="M104 165 H536" stroke="${C.ink}" stroke-width="3"/>` + cupL + cupR + ear(612, 165) + dots + text(320, 200, '실', { size: 20, color: C.muted })
      + `<path d="M30 150 Q22 165 30 180 M44 144 Q34 165 44 186" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    css += `.sc-${id} .dt { transform: translateX(110px); } .on2 .sc-${id} .dt { animation: ${id}-dt 1.6s linear infinite; }
      @keyframes ${id}-dt { 0% { opacity: 0; transform: translateX(112px); } 10%, 90% { opacity: 1; } 100% { opacity: 0; transform: translateX(528px); } }`;
    // 3칸: 물
    body += at(3, 'fin', `<rect x="40" y="232" width="480" height="74" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + speaker(88, 262, 0.8)
      + `<rect x="468" y="254" width="104" height="16" rx="5" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>` + ear(592, 262) + travel(3, 262, 118, 500, C.blue, 4, 15) + text(320, 296, '물', { size: 20, color: C.blue }));
    body += glowRect(282, 86, 76, 30, 4, C.green, 0, 10) + glowRect(296, 179, 48, 28, 4, C.green, 0.2, 10) + glowRect(296, 275, 48, 28, 4, C.green, 0.4, 10);
    body += at(4, 'pop', tag(320, 337, '전달', OK, { size: 22 }), 0.6);
    put('3-2/과학/3/전달', svg(id, body, css));
  })();

  // ════ 4단원 감염병과 건강한 생활 ════

  // ── 감염: 병원체가 옆 사람 몸속으로 들어온다 ──
  (function () {
    const id = 't32-c4-gamyeom';
    let css = base(id);
    let body = '<g transform="translate(320 185) scale(1.25) translate(-320 -150)">' + person(150, 170, HOT) + `<g class="bodyB">${person(480, 170, GRAY)}</g>`;
    body += `<path d="M160 147 h8" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><path d="M462 147 h8" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
    [[118, 205], [178, 225], [140, 250]].forEach(([x, y], k) => { body += at(1, 'pop', germ(x, y), 0.2 * k); });
    body += at(1, 'pop', tag(150, 52, '병원체', LIL, { size: 18 }), 0.8);
    // 2칸: 날아간다, 3칸: 몸속으로
    body += shown(2, `<path d="M180 140 Q315 60 456 140" stroke="${C.purple}" stroke-width="3" stroke-dasharray="7 7" fill="none"/>`, 3);
    [[0, 0], [1, 0.35]].forEach(([k, s]) => {
      body += `<g class="b2"><g class="gm gm${k}"><g class="gi gi${k}">${germ(456, 140 + k * 14)}</g></g></g>`;
      css += `.sc-${id} .gm${k} { transform: translate(${-276 + k * 10}px, ${k * -14}px); opacity: 0; }
        .on2 .sc-${id} .gm${k} { animation: ${id}-fly${k} 1.5s ease-in-out ${s}s both; }
        .sc-${id} .gi${k} { transition: transform 1.2s ease-in-out; }
        .on3 .sc-${id} .gi${k} { transform: translate(${k ? 34 : 12}px, ${k ? 70 : 76}px); }
        @keyframes ${id}-fly${k} { 0% { opacity: 0; transform: translate(${-276 + k * 10}px, ${k * -14}px); } 15% { opacity: 1; } 50% { transform: translate(-140px, -76px); } 100% { opacity: 1; transform: translate(0, 0); } }`;
    });
    body += at(3, 'pop', germ(478, 236, 8), 1.2) + ring(480, 210, 46, 3, C.orange, 1.1);
    body += glowRect(440, 112, 80, 136, 4, C.green, 0, 30) + at(4, 'pop', tag(480, 52, '감염', OK, { size: 22 }), 0.4) + '</g>';
    css += `.sc-${id} .bodyB circle, .sc-${id} .bodyB path { transition: fill 1s ease 1.2s, stroke 1s ease 1.2s; }
      .on3 .sc-${id} .bodyB circle, .on3 .sc-${id} .bodyB path { fill: ${C.peach}; stroke: ${C.orange}; }`;
    put('3-2/과학/4/감염', svg(id, body, css));
  })();

  // ── 비말: 기침할 때 입에서 튀어나오는 작은 물방울 ──
  (function () {
    const id = 't32-c4-bimal';
    let css = base(id);
    let body = '<g transform="translate(320 200) scale(1.15) translate(-320 -170)">' + `<g class="cough">${person(100, 170, GRAY)}<path d="M112 152 h10" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></g>` + person(560, 170, GRAY);
    body += `<path d="M542 152 h-10" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
    body += at(1, 'pop', text(150, 104, '콜록', { size: 20, color: C.muted }), 0.1);
    const rnd = seeded(3207);
    const mk = (n, count, xmin, xmax) => {
      let s = '';
      for (let k = 0; k < count; k++) {
        const x = xmin + rnd() * (xmax - xmin), y = 152 + (rnd() - 0.5) * 2 * 0.21 * (x - 124), r = 3 + rnd() * 4;
        const withGerm = n === 2 && k % 3 === 0;
        s += `<g class="fly${n}" style="--dx:${f(124 - x)}px;--dy:${f(152 - y)}px;animation-delay:${f(rnd() * 0.5)}s"><circle cx="${f(x)}" cy="${f(y)}" r="${f(withGerm ? 7 : r)}" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>${withGerm ? `<circle cx="${f(x)}" cy="${f(y)}" r="2.8" fill="${C.purple}"/>` : ''}</g>`;
      }
      return s;
    };
    body += `<g class="b1">${mk(1, 22, 140, 330)}</g><g class="b2">${mk(2, 16, 330, 520)}</g>`;
    body += ring(560, 150, 30, 2, C.purple, 1.1);
    body += at(3, 'pop', tag(300, 268, '비말', COLD, { size: 24 }), 0.4) + shown(3, lead(300, 250, 300, 206, C.blue)) + '</g>';
    css += `.sc-${id} .cough { transform-box: fill-box; transform-origin: 50% 100%; }
      .on1 .sc-${id} .cough { animation: ${id}-cough .5s ease-in-out 2; }
      @keyframes ${id}-cough { 0%, 100% { transform: rotate(0); } 40% { transform: rotate(5deg); } }`;
    put('3-2/과학/4/비말', svg(id, body, css));
  })();

  // ── 환기: 창문을 열어 안의 공기를 바깥의 맑은 공기로 바꾼다 ──
  (function () {
    const id = 't32-c4-hwangi';
    let css = base(id);
    let body = `<path d="M150 70 H490 V130 M490 210 V290 H150 V210 M150 130 V70" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/><rect x="153" y="73" width="334" height="214" fill="white" opacity=".4"/>`;
    // 창문(2칸에 열린다)
    [150, 490].forEach((x, k) => { body += `<g class="win win${k}"><rect x="${x - 5}" y="130" width="10" height="80" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`; css += `.sc-${id} .win${k} { transform-box: fill-box; transform-origin: 50% 0; }`; });
    css += steps(id, 'win0', ['none', null, 'scaleY(.08)'], 0.6, 0) + steps(id, 'win1', ['none', null, 'scaleY(.08)'], 0.6, 0);
    // 안의 묵은 공기와 떠다니는 병원체
    const rnd = seeded(907);
    let old = '';
    for (let k = 0; k < 12; k++) {
      const x = 190 + (k % 4) * 85 + rnd() * 30, y = 100 + Math.floor(k / 4) * 70 + rnd() * 20;
      old += `<g class="out" style="--sx:${f(560 - x + rnd() * 60)}px;transition-delay:${f(0.05 * k)}s">${jig(x, y, k, C.muted, 8)}</g>`;
    }
    [[250, 175], [400, 125], [360, 245]].forEach(([x, y], k) => { old += `<g class="out" style="--sx:${f(600 - x)}px;transition-delay:${f(0.2 + 0.1 * k)}s"><g class="jig" style="animation-delay:-${k}s">${germ(x, y, 8)}</g></g>`; });
    body += old;
    let fresh = '';
    for (let k = 0; k < 12; k++) {
      const x = 185 + (k % 4) * 88 + rnd() * 26, y = 98 + Math.floor(k / 4) * 72 + rnd() * 20;
      fresh += `<g class="in" style="--sx:${f(-x + 30 - rnd() * 40)}px;transition-delay:${f(0.4 + 0.05 * k)}s">${jig(x, y, k + 5, C.blue, 8)}</g>`;
    }
    body += fresh;
    css += `.sc-${id} .out { transition: transform 1.6s ease-in, opacity .6s ease 1s; }
      .on2 .sc-${id} .out { transform: translateX(var(--sx)); opacity: 0; }
      .sc-${id} .in { transform: translateX(var(--sx)); opacity: 0; transition: transform 1.5s ease-out, opacity .4s ease; }
      .on2 .sc-${id} .in { transform: none; opacity: 1; }`;
    body += shown(2, flow([[20, 170], [140, 170]], C.blue, { w: 5 }) + flow([[200, 170], [440, 170]], C.blue, { w: 4, dash: '10 12' }) + flow([[500, 170], [620, 170]], C.muted, { w: 5 }));
    body += at(2, 'fin', text(66, 140, '바깥 공기', { size: 18, color: C.blue }), 0.2) + text(150, 322, '창문', { size: 19, color: C.blue }) + text(490, 322, '창문', { size: 19, color: C.blue }) + lead(150, 304, 150, 214, C.blue) + lead(490, 304, 490, 214, C.blue);
    body += glowRect(146, 66, 348, 228, 3, C.green, 0.2, 8) + at(3, 'pop', tag(320, 36, '환기', OK, { size: 24 }), 0.5);
    put('3-2/과학/4/환기', svg(id, body, css));
  })();

  // ── 유행: 한 사람에게서 시작한 감염병이 많은 사람에게 퍼진다 ──
  (function () {
    const id = 't32-c4-yuhaeng';
    let css = base(id);
    let body = '';
    const step = (c, r) => { const d = Math.abs(c - 3) + Math.abs(r - 1); return d === 0 ? 1 : d === 1 ? 2 : d <= 3 ? 3 : 0; };
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
      const x = 80 + c * 80, y = 104 + r * 92, n = step(c, r);
      body += `<g class="p${n ? ' sick' + n : ''}">${person(x, y, GRAY, 0.62)}</g>`;
      if (n) body += ring(x, y + 8, 30, n, C.orange, 0.3 + ((c + r) % 3) * 0.15);
    }
    for (let n = 1; n <= 3; n++) css += `.on${n} .sc-${id} .sick${n} circle, .on${n} .sc-${id} .sick${n} path { fill: ${C.peach}; stroke: ${C.orange}; }`;
    css += `.sc-${id} .p circle, .sc-${id} .p path { transition: fill .6s ease .3s, stroke .6s ease .3s; }`;
    body += shown(1, tag(80, 32, '1명', HOT, { size: 20 }), 2) + shown(2, tag(80, 32, '5명', HOT, { size: 20 }), 3) + shown(3, tag(80, 32, '17명', HOT, { size: 20 }));
    body += at(4, 'pop', tag(320, 32, '유행', OK, { size: 24 }), 0.3);
    put('3-2/과학/4/유행', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
