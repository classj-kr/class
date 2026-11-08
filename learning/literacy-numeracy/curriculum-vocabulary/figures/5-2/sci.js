// 과학 5-2 낱말 도식: 그림 한 장으로는 움직임을 보일 수 없는 과학 원리 낱말(증발·대류·해풍 …)을 코드로 그린다.
// 수증기는 눈에 보이지 않지만, 보이게 그릴 때는 점선 테두리의 옅은 점으로 적는다(칸 글에서 안 보인다고 말한다).
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
  // 같은 씨앗이면 같은 자리가 나오는 난수(장면이 열 때마다 바뀌지 않게)
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // 글자 폭 어림(맑은 고딕 굵게: 한글·℃ 1em, 숫자 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣℃]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green];
  // 꼬리표. dash 는 수증기처럼 눈에 안 보이는 것
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20, dash = false } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"${dash ? ' stroke-dasharray="6 4"' : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  // 고·저 동그라미
  const mark = (cx, cy, label, color) => `<g><circle cx="${cx}" cy="${cy}" r="21" fill="white" stroke="${color}" stroke-width="3.5"/>${text(cx, cy + 8.5, label, { size: 24, color })}</g>`;
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다(무늬 한 마디 24). pts 는 꺾은선 [[x,y], ...].
  const flow = (pts, color, { w = 5, dash = '14 10', cls = '' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g class="${cls}"><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  // 물결선(빛·열기). 두 점 사이를 amp 높이, len 마디로 흔든다.
  const wavePts = (x1, y1, x2, y2, amp = 8, len = 34) => {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, pts = [];
    for (let s = 0; s <= L; s += 3) { const o = amp * Math.sin((s / len) * Math.PI * 2) * Math.min(1, (L - s) / 18); pts.push([x1 + ux * s - uy * o, y1 + uy * s + ux * o]); }
    pts.push([x2, y2]);
    return pts;
  };
  // 수증기 점(옅게, 점선 테두리)과 물방울
  const vapor = (x, y, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="2" stroke-dasharray="3 2.5"/>`;
  const drop = (x, y, r = 7) => `<g><path d="M${f(x)} ${f(y - r * 1.5)} Q${f(x + r * 1.05)} ${f(y - r * 0.2)} ${f(x + r)} ${f(y + r * 0.2)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y + r * 0.2)} Q${f(x - r * 1.05)} ${f(y - r * 0.2)} ${f(x)} ${f(y - r * 1.5)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><circle cx="${f(x - r * 0.35)}" cy="${f(y)}" r="${f(r * 0.28)}" fill="white"/></g>`;
  // 불꽃(밑 가운데 x, y)
  const flame = (x, y, h = 32, w = 14, s = 0) => `<g class="flk"${dl(s)}><path d="M${x} ${y - h} Q${x + w} ${f(y - h * 0.35)} ${f(x + w * 0.6)} ${y} H${f(x - w * 0.6)} Q${x - w} ${f(y - h * 0.35)} ${x} ${y - h} Z" fill="${C.orange}"/><path d="M${x} ${f(y - h * 0.55)} Q${f(x + w * 0.5)} ${f(y - h * 0.2)} ${f(x + w * 0.3)} ${y} H${f(x - w * 0.3)} Q${f(x - w * 0.5)} ${f(y - h * 0.2)} ${x} ${f(y - h * 0.55)} Z" fill="${C.yellow}"/></g>`;
  const sun = (x, y, r = 26) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 16) * Math.cos(a))} ${f(y + (r + 16) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="spin" style="transform-origin:${x}px ${y}px">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  const moon = (x, y, r = 26) => `<path d="M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r} A${f(r * 1.3)} ${f(r * 1.3)} 0 0 1 ${x} ${y - r} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const star = (x, y, s = 0) => g('twk', `<path d="M${x} ${y - 9} L${x + 2.5} ${y - 2.5} L${x + 9} ${y} L${x + 2.5} ${y + 2.5} L${x} ${y + 9} L${x - 2.5} ${y + 2.5} L${x - 9} ${y} L${x - 2.5} ${y - 2.5} Z" fill="${C.yellow}"/>`, s);
  // 구름: 밑변 가운데 (cx, cy), 배율 s
  const cloud = (cx, cy, s = 1, fill = 'white') => {
    const P = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`;
    return `<path d="M${P(-60, 0)} A${20 * s} ${20 * s} 0 0 1 ${P(-42, -30)} A${30 * s} ${30 * s} 0 0 1 ${P(8, -44)} A${26 * s} ${26 * s} 0 0 1 ${P(46, -22)} A${17 * s} ${17 * s} 0 0 1 ${P(60, 0)} Z" fill="${fill}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
  };
  // 온도계: 관 꼭대기 y1, 관 밑 y2, 빨간 기둥은 cls 로 높이를 바꾼다(scaleY, 아래 기준)
  const thermo = (x, y1, y2, cls) => `<rect x="${x - 8}" y="${y1}" width="16" height="${y2 - y1 + 4}" rx="8" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<rect class="lv ${cls}" x="${x - 3.5}" y="${y1 + 5}" width="7" height="${y2 - y1}" rx="3.5" fill="${C.red}"/>`
    + `<circle cx="${x}" cy="${y2 + 9}" r="11" fill="${C.red}" stroke="${C.muted}" stroke-width="2.5"/>`;
  const level = (id, cls, steps) => `.sc-${id} .${cls} { transform: scaleY(${steps[0]}); }` + steps.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: scaleY(${v}); }`).join('');
  // 테두리가 반짝이는 네모
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  // 비커(위가 열린 유리그릇)
  const beaker = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} V${y2 - 6} Q${x1} ${y2} ${x1 + 6} ${y2} H${x2 - 6} Q${x2} ${y2} ${x2} ${y2 - 6} V${y1}" fill="white" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
  const beakerLine = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} V${y2 - 6} Q${x1} ${y2} ${x1 + 6} ${y2} H${x2 - 6} Q${x2} ${y2} ${x2} ${y2 - 6} V${y1}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .flk, .sc-${id} .twk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .flk { transform-origin: 50% 100%; animation: ${id}-flk .6s ease-in-out infinite alternate; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .spin { transform-box: view-box; animation: ${id}-spin 14s linear infinite; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease-in-out; }
    .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 2.2s ease-in-out .3s; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-flk { from { transform: scaleY(1); } to { transform: scaleY(.8) scaleX(1.06); } }
    @keyframes ${id}-twk { from { opacity: .35; } to { opacity: 1; } }
    @keyframes ${id}-spin { to { transform: rotate(360deg); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 75% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -120px)); } }
    @keyframes ${id}-fall { 0% { opacity: 0; transform: translateY(0); } 12%, 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--fall, 60px)); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2.5px, -1.5px); } 50% { transform: translate(-2px, 1.5px); } 75% { transform: translate(1.5px, 2px); } }
    @keyframes ${id}-float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(5px, -7px); } }
    @keyframes ${id}-sway { 0%, 100% { transform: translateX(-14px); } 50% { transform: translateX(14px); } }
    .sc-${id} .up { animation: ${id}-up 2.6s ease-in infinite; }
    .sc-${id} .fall { animation: ${id}-fall .9s ease-in infinite; }
    .sc-${id} .float { animation: ${id}-float 2.4s ease-in-out infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 위로 날아가는 수증기 점들(xs 자리에서, rise 만큼)
  const vaporUp = (xs, y, rise, seed = 3) => {
    const r = seeded(seed);
    return xs.map((x, i) => `<g class="up" style="animation-delay:${f(i * 0.37 + r() * 0.3)}s;--up:${-rise}px">${vapor(x, y - r() * 10, 6)}</g>`).join('');
  };

  // ════ 1단원 혼합물의 분리 ════

  // ── 거름 ──
  (function () {
    const id = 's1-georeum';
    let css = base(id);
    let body = '';
    // 깔때기와 거름종이
    body += `<path d="M130 60 H330 L242 178 V232 H218 V178 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<path d="M142 66 H318 L230 176 Z" fill="white" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/><path d="M230 70 V172" stroke="${C.line}" stroke-width="2"/>`;
    body += `<g class="mix"><path d="M170 100 H290 L230 174 Z" fill="${C.sky}"/></g>`;
    const sand = [[230, 164], [222, 154], [238, 154], [214, 144], [230, 145], [246, 144], [222, 135], [238, 135]];
    body += shown(1, sand.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`).join(''));
    // 1칸: 위에서 붓는 물줄기와 섞여 떨어지는 모래
    body += shown(1, `<path d="M230 0 V98" stroke="${C.sky}" stroke-width="12" stroke-linecap="round"/><path class="mar" d="M230 0 V98" stroke="${C.blue}" stroke-width="4" stroke-dasharray="14 10"/>`
      + [0, 0.3, 0.6].map((s, i) => `<g class="fall" style="animation-delay:${s}s;--fall:80px"><circle cx="${228 + i * 2}" cy="12" r="5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/></g>`).join(''), 2);
    body += text(124, 106, '거름종이', { anchor: 'end' }) + lead(128, 99, 160, 90);
    // 받는 비커
    body += beaker(165, 245, 295, 340);
    body += `<g class="lvl"><rect x="168" y="292" width="124" height="45" fill="${C.sky}"/></g>`;
    body += beakerLine(165, 245, 295, 340);
    body += shown(3, [0, 0.3, 0.6].map((s) => `<g class="fall" style="animation-delay:${s}s;--fall:52px"><circle cx="230" cy="240" r="5" fill="${C.blue}"/></g>`).join(''));
    // 2칸: 돋보기 — 종이의 아주 작은 구멍보다 큰 모래는 걸리고, 물과 녹은 소금은 지나간다
    let zoom = `<path d="M288 106 L390 148" stroke="${C.green}" stroke-width="3" stroke-dasharray="6 5"/>`;
    zoom += `<defs><clipPath id="${id}-c"><circle cx="480" cy="180" r="98"/></clipPath></defs><circle cx="480" cy="180" r="100" fill="white"/>`;
    let inner = '';
    for (let k = 0; k < 6; k++) inner += `<rect x="${380 + 36 * k}" y="186" width="26" height="18" fill="${C.line}" stroke="${C.muted}" stroke-width="1.5"/>`;
    [411, 447, 483, 519, 555].forEach((x, i) => {
      inner += `<g class="fall" style="animation-delay:${f(i * 0.33)}s;animation-duration:2s;--fall:170px"><circle cx="${x}" cy="96" r="${i % 2 ? 3.5 : 4.5}" fill="${i % 2 ? C.purple : C.blue}"/></g>`;
      inner += `<g class="fall" style="animation-delay:${f(i * 0.33 + 1)}s;animation-duration:2s;--fall:170px"><circle cx="${x}" cy="96" r="${i % 2 ? 4.5 : 3.5}" fill="${i % 2 ? C.blue : C.purple}"/></g>`;
    });
    inner += [[429, 12], [465, 11], [501, 12]].map(([x, r]) => `<circle cx="${x}" cy="${186 - r}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`).join('');
    zoom += `<g clip-path="url(#${id}-c)">${inner}</g><circle cx="480" cy="180" r="100" fill="none" stroke="${C.green}" stroke-width="5"/>`;
    body += shown(2, g('pop pop2', zoom), 3);
    // 4칸: 남은 것과 빠져나간 것
    body += ring(230, 150, 30, 4, C.orange);
    body += at(4, 'pop', lead(122, 160, 208, 150) + tag(90, 160, '모래', HOT), 0.2);
    body += at(4, 'pop', lead(298, 312, 330, 312) + tag(372, 312, '소금물', COLD), 0.7);
    css += `
      .sc-${id} .mix { transform-box: fill-box; transform-origin: 50% 100%; transform: scale(0); transition: transform 2s ease-in-out .3s; }
      .on1 .sc-${id} .mix { transform: none; }
      .on3 .sc-${id} .mix { transform: scale(.22); transition-duration: 2.6s; }
      .sc-${id} .lvl { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 2.6s ease-in-out .4s; }
      .on3 .sc-${id} .lvl { transform: none; }`;
    put('5-2/과학/1/거름', svg(id, body, css));
  })();

  // ── 증발 ──
  (function () {
    const id = 's1-jeungbal';
    let css = base(id);
    let body = sun(100, 80, 34);
    body += beaker(240, 150, 420, 332);
    body += `<g class="wat"><rect x="243" y="200" width="174" height="129" fill="${C.sky}"/></g>`;
    body += `<g class="surf"><path d="M243 200 H417" stroke="${C.blue}" stroke-width="3"/></g>`;
    body += beakerLine(240, 150, 420, 332);
    body += text(330, 316, '물', { size: 22 });
    body += shown(1, flow([[140, 104], [272, 192]], C.orange, { w: 3, dash: '8 16' }) + flow([[150, 82], [330, 190]], C.orange, { w: 3, dash: '8 16' }));
    // 2칸부터: 겉면에서 수증기가 날아간다(3칸에서 물이 줄면 함께 내려간다)
    body += shown(2, `<g class="vmv">${vaporUp([262, 290, 318, 346, 374, 402, 276, 360], 194, 150, 7)}</g>`);
    body += at(2, 'pop', tag(530, 120, '수증기', ['white', C.blue], { dash: true }), 0.6);
    // 3칸: 처음 물 높이 표시
    body += shown(3, `<path d="M232 200 H428" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="8 6"/>` + text(436, 207, '처음', { anchor: 'start', size: 18, color: C.muted }));
    // 4칸: 물 → 수증기
    body += at(4, 'pop', tag(530, 270, '물', COLD), 0.2) + shown(4, flow([[530, 248], [530, 146]], C.blue, { w: 5 }));
    body += glowRect(236, 236, 188, 28, 4, C.green, 0.6, 10);
    css += `
      .sc-${id} .wat { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 2.6s ease-in-out .3s; }
      .sc-${id} .surf, .sc-${id} .vmv { transition: transform 2.6s ease-in-out .3s; }
      .on3 .sc-${id} .wat { transform: scaleY(.612); }
      .on3 .sc-${id} .surf, .on3 .sc-${id} .vmv { transform: translateY(50px); }`;
    put('5-2/과학/1/증발', svg(id, body, css));
  })();

  // ── 용해 ──
  (function () {
    const id = 's1-yonghae';
    let css = base(id);
    let body = '';
    // 저울
    body += `<path d="M170 314 H470 L486 352 H154 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><rect x="140" y="300" width="360" height="14" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`;
    body += `<rect x="266" y="319" width="108" height="29" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`;
    body += g('wt', text(320, 341, '120 g', { size: 20 }));
    // 비커와 물
    body += beaker(190, 130, 350, 300);
    body += `<rect x="193" y="168" width="154" height="129" fill="${C.sky}"/>`;
    // 2칸부터: 아주 작게 나뉜 설탕 알갱이가 각설탕 자리에서 물 전체로 퍼진다
    const r = seeded(11), cube = [280, 268];
    let pts = '';
    for (let row = 0; row < 6; row++) for (let col = 0; col < 7; col++) {
      const x = 207 + col * 21 + (r() - 0.5) * 10, y = 182 + row * 20 + (r() - 0.5) * 9;
      pts += `<g class="pt" style="--x:${f(cube[0] - x)}px;--y:${f(cube[1] - y)}px;transition-delay:${f(0.3 + r() * 0.9)}s"><g class="jg" style="animation-delay:-${f(r())}s"><circle cx="${f(x)}" cy="${f(y)}" r="4" fill="white" stroke="${C.purple}" stroke-width="1.6"/></g></g>`;
    }
    body += shown(2, pts);
    // 1칸: 각설탕이 저울 위에서 비커 속으로
    body += `<g class="cube">${shown(1, tag(430, 236, '설탕'), 2)}<g class="cin"><rect x="413" y="266" width="34" height="34" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/><path d="M413 278 H447 M425 266 V300 M437 266 V300 M413 289 H447" stroke="${C.line}" stroke-width="1.5"/></g></g>`;
    body += beakerLine(190, 130, 350, 300);
    // 3칸: 무게 그대로
    body += glowRect(260, 314, 120, 39, 3, C.green, 0.2, 8) + ring(320, 333, 60, 3);
    // 4칸: 위·아래 어디나 똑같이 퍼져 있다
    body += ring(240, 196, 24, 4, C.orange) + ring(300, 272, 24, 4, C.orange, 0.4);
    body += at(4, 'pop', lead(352, 196, 392, 196) + tag(442, 196, '설탕물', COLD), 0.6);
    css += `
      .sc-${id} .cin { transform-box: fill-box; transform-origin: center; transition: transform 1.8s ease-in .3s, opacity 1.8s ease-in .3s; }
      .on1 .sc-${id} .cube { animation: ${id}-cube 1.6s ease-in-out .4s both; }
      @keyframes ${id}-cube { 0% { transform: none; } 35% { transform: translate(0px, -185px); } 65% { transform: translate(-150px, -185px); } 100% { transform: translate(-150px, -15px); } }
      .on2 .sc-${id} .cin { transform: scale(0); opacity: 0; }
      .sc-${id} .pt { transform: translate(var(--x), var(--y)); transition: transform 1.9s ease-out; }
      .on2 .sc-${id} .pt { transform: none; }
      .sc-${id} .jg { animation: ${id}-jig 1.2s ease-in-out infinite; }`;
    put('5-2/과학/1/용해', svg(id, body, css));
  })();

  // ── 해수 담수화 ──
  (function () {
    const id = 's1-damsu';
    let css = base(id);
    let body = '';
    // 관: 냄비 뚜껑 → 위 → 오른쪽 → 찬물 통을 지나 아래로
    const pipe = 'M160 158 V100 Q160 90 170 90 H330 L470 200 V222';
    body += `<path d="M352 107.3 L448 182.7" stroke="${C.blue}" stroke-width="46" stroke-linecap="round"/><path d="M352 107.3 L448 182.7" stroke="${C.sky}" stroke-width="40" stroke-linecap="round"/>`;
    body += text(470, 138, '찬물', { anchor: 'start', color: C.blue });
    body += `<path d="${pipe}" stroke="${C.muted}" stroke-width="22" fill="none" stroke-linejoin="round"/><path d="${pipe}" stroke="white" stroke-width="16" fill="none" stroke-linejoin="round"/>`;
    // 냄비, 바닷물(녹은 소금은 작은 점)
    body += beaker(70, 170, 250, 290);
    const r = seeded(5);
    let salt = '';
    // 물이 줄면 소금 점은 찌그러지지 않고 아래로 모인다(바닥 287 쪽으로 0.6배)
    for (let i = 0; i < 18; i++) { const y = 218 + r() * 64; salt += `<g class="salt" style="--d:${f((287 - y) * 0.4)}px"><circle cx="${f(84 + r() * 152)}" cy="${f(y)}" r="2.6" fill="${C.ink}" fill-opacity=".55"/></g>`; }
    body += `<g class="sea"><rect x="73" y="205" width="174" height="82" fill="${C.sky}"/></g>${salt}`;
    body += beakerLine(70, 170, 250, 290);
    body += `<rect x="62" y="158" width="196" height="13" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`;
    // 불
    body += `<rect x="112" y="332" width="96" height="12" rx="3" fill="${C.muted}"/>` + flame(132, 330, 30, 12) + flame(160, 330, 36, 14, 0.2) + flame(188, 330, 30, 12, 0.4);
    body += at(1, 'pop', lead(252, 248, 270, 248) + tag(316, 248, '바닷물', COLD), 0.4);
    // 2칸: 수증기만 관으로 올라간다
    const mk = (path, dur, n, last) => Array.from({ length: n }, (_, i) => {
      const b = f(-i * dur / n);
      const vap = `<g opacity="0">${vapor(0, 0, 6)}<animate attributeName="opacity" values="0;.9;.9;${last ? '0;0' : '.9;0'}" keyTimes="0;.08;${last ? '.68;.78;1' : '.85;.95;1'}" dur="${dur}s" begin="${b}s" repeatCount="indefinite"/></g>`;
      const wat = last ? `<g opacity="0">${drop(0, 0, 6)}<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.7;.8;.96;1" dur="${dur}s" begin="${b}s" repeatCount="indefinite"/></g>` : '';
      return `<g>${vap}${wat}<animateMotion path="${path}" dur="${dur}s" begin="${b}s" repeatCount="indefinite"/></g>`;
    }).join('');
    body += shown(2, mk('M160 200 V100 Q160 90 170 90 H320', 2.6, 6, false), 3);
    body += at(2, 'pop', tag(245, 52, '수증기', ['white', C.blue], { dash: true }), 0.5);
    // 3칸: 찬물 통을 지나며 물방울이 되어 컵에 모인다
    body += shown(3, mk('M160 200 V100 Q160 90 170 90 H330 L462 194', 3.4, 8, true));
    body += beaker(420, 262, 520, 342);
    body += `<g class="cup"><rect x="423" y="300" width="94" height="39" fill="${C.sky}"/></g>`;
    body += beakerLine(420, 262, 520, 342);
    body += shown(3, [0, 0.45].map((s) => `<g class="fall" style="animation-delay:${s}s;--fall:72px"><circle cx="470" cy="228" r="5" fill="${C.blue}"/></g>`).join(''));
    // 4칸: 짜지 않은 물
    body += at(4, 'pop', lead(522, 318, 528, 318) + tag(575, 318, '맑은 물', COLD), 0.3) + glowRect(414, 256, 112, 92, 4, C.green, 0.8, 10);
    css += `
      .sc-${id} .sea { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 3s ease-in-out .3s; }
      .on3 .sc-${id} .sea { transform: scaleY(.6); }
      .sc-${id} .salt { transition: transform 3s ease-in-out .3s; }
      .on3 .sc-${id} .salt { transform: translateY(var(--d)); }
      .sc-${id} .cup { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 3s ease-in-out .8s; }
      .on3 .sc-${id} .cup { transform: none; }`;
    put('5-2/과학/1/해수 담수화', svg(id, body, css));
  })();

  // ════ 2단원 날씨와 우리 생활 ════

  // 수증기가 차가운 겉면으로 모여 물방울로 맺히는 장면(응결·이슬이 같이 쓴다).
  // spots: 물방울 자리, from: 처음 떠 있던 자리까지의 [dx, dy]
  const gather = (spots, n, seed) => {
    const r = seeded(seed);
    let air = '', drops = '';
    spots.forEach(([x, y, dx, dy], i) => {
      air += `<g class="vd" style="--x:${dx}px;--y:${dy}px;transition-delay:${f(r() * 0.7)}s"><g class="float" style="animation-delay:-${f(r() * 2.4)}s">${vapor(x, y, 6)}</g></g>`;
      drops += `<g class="pop pop${n + 1}" style="animation-delay:${f(0.2 + i * 0.12)}s">${drop(x, y, 7)}</g>`;
    });
    return { air: shown(1, air, n + 1), drops: `<g class="b${n + 1}">${drops}</g>` };
  };
  const gatherCss = (id, n) => `
    .sc-${id} .vd { transform: translate(var(--x), var(--y)); transition: transform 1.8s ease-in-out; }
    .on${n} .sc-${id} .vd { transform: none; }`;

  // ── 응결 ──
  (function () {
    const id = 's2-eunggyeol';
    let css = base(id) + gatherCss(id, 2);
    let body = '';
    body += `<path d="M250 90 L265 320 H375 L390 90" fill="white" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
    body += `<path d="M253 130 H387 L374 317 H266 Z" fill="${C.sky}"/>`;
    body += [[292, 152, -8], [338, 166, 12], [312, 206, 4]].map(([x, y, a]) => `<g class="float" style="animation-duration:3s"><rect x="${x - 17}" y="${y - 17}" width="34" height="34" rx="6" fill="white" fill-opacity=".85" stroke="${C.blue}" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/></g>`).join('');
    body += text(320, 350, '얼음물');
    const xl = (y) => 250 + ((y - 90) * 15) / 230 - 8, xr = (y) => 390 - ((y - 90) * 15) / 230 + 8;
    const spots = [
      [xl(150), 150, -150, -40], [xl(195), 195, -110, 30], [xl(240), 240, -170, 10], [xl(288), 288, -120, -20],
      [xr(165), 165, 140, -30], [xr(210), 210, 180, 20], [xr(255), 255, 120, -10], [xr(300), 300, 160, -30],
      [282, 262, -170, -150], [352, 300, 180, -150], [362, 236, 160, -170], [298, 290, -150, -40], [330, 250, 120, -200]
    ];
    const { air, drops } = gather(spots, 2, 21);
    body += air + drops;
    // 4칸: 물방울 하나가 흘러내린다, 수증기 → 물방울
    body += `<g class="b4"><g class="sld">${drop(330, 268, 8)}</g></g>`;
    body += at(4, 'pop', tag(110, 50, '수증기', ['white', C.blue], { dash: true }), 0.2) + shown(4, flow([[166, 50], [470, 50]], C.blue, { w: 5 }));
    body += at(4, 'pop', tag(530, 50, '물방울', COLD), 0.7);
    css += `
      .sc-${id} .sld { transform-box: fill-box; transform-origin: center; }
      .on4 .sc-${id} .sld { animation: ${id}-sld 2.2s ease-in .4s infinite; }
      @keyframes ${id}-sld { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(42px); } }`;
    put('5-2/과학/2/응결', svg(id, body, css));
  })();

  // ── 이슬 ──
  (function () {
    const id = 's2-iseul';
    let css = base(id) + gatherCss(id, 2);
    let body = `<rect x="0" y="330" width="640" height="30" fill="${C.mint}"/>`;
    const leaves = [[240, 332, 110, 175, 46], [300, 334, 300, 120, 44], [352, 332, 482, 180, 46]];
    const spots = [];
    const r = seeded(4);
    leaves.forEach(([bx, by, tx, ty, w]) => {
      const mx = (bx + tx) / 2, my = (by + ty) / 2, L = Math.hypot(tx - bx, ty - by), nx = -(ty - by) / L, ny = (tx - bx) / L;
      body += `<path d="M${bx} ${by} Q${f(mx + nx * w)} ${f(my + ny * w)} ${tx} ${ty} Q${f(mx - nx * w)} ${f(my - ny * w)} ${bx} ${by} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M${bx} ${by} L${tx} ${ty}" stroke="${C.green}" stroke-width="2"/>`;
      [0.38, 0.58, 0.78].forEach((t, k) => {
        const u = k % 2 ? -0.42 : 0.42, off = 2 * t * (1 - t) * w * u;
        const x = bx + (tx - bx) * t + nx * off, y = by + (ty - by) * t + ny * off;
        spots.push([f(x), f(y), f((r() - 0.5) * 120), f(-60 - r() * 50)]);
      });
    });
    const { air, drops } = gather(spots, 2, 9);
    body += air + drops;
    // 밤: 달·별, 풀잎이 식는다(온도계)
    body += shown(1, moon(80, 70, 28) + tag(152, 70, '밤', COLD), 4);
    body += shown(1, star(236, 44) + star(372, 34, 0.5) + star(470, 70, 1) + star(540, 30, 0.3), 4);
    body += thermo(578, 140, 290, 'tp');
    css += level(id, 'tp', [0.8, 0.3]);
    // 4칸: 아침, 이슬이 반짝인다
    body += shown(4, g('rise rise4', sun(80, 70, 26) + tag(156, 70, '아침', HOT)));
    body += spots.filter((_, i) => i % 3 === 1).map(([x, y], i) => ring(x, y, 12, 4, C.blue, 0.2 + i * 0.3)).join('');
    const pick = spots[7];
    body += at(4, 'pop', lead(504, 298, pick[0] + 8, pick[1] + 8) + tag(530, 314, '이슬', COLD), 0.8);
    put('5-2/과학/2/이슬', svg(id, body, css));
  })();

  // ── 안개 ──
  (function () {
    const id = 's2-angae';
    let css = base(id);
    let body = '';
    body += `<rect x="0" y="270" width="640" height="90" fill="${C.mint}"/>`;
    body += `<path d="M0 302 Q160 290 320 302 T640 298 V330 Q480 342 320 330 T0 334 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    const scene = `<rect x="100" y="218" width="70" height="52" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M90 220 L135 184 L180 220 Z" fill="${C.peach}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><rect x="126" y="240" width="18" height="30" fill="${C.line}"/>`
      + `<rect x="514" y="218" width="12" height="52" fill="${C.orange}"/><circle cx="520" cy="196" r="34" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    body += `<g class="dimg">${scene}</g>`;
    body += tag(60, 36, '새벽', COLD);
    // 1칸: 땅 가까운 공기가 식는다
    body += `<g class="cold"><rect x="0" y="170" width="640" height="100" fill="${C.sky}" fill-opacity=".55"/></g>`;
    // 2칸: 아주 작은 물방울이 생긴다
    const r = seeded(17);
    let tiny = '';
    for (let i = 0; i < 40; i++) tiny += `<g class="pop pop2" style="animation-delay:${f(r() * 1.6)}s"><circle cx="${f(12 + r() * 616)}" cy="${f(180 + r() * 82)}" r="3.4" fill="white" stroke="${C.blue}" stroke-width="1.5"/></g>`;
    body += `<g class="b2">${tiny}</g>`;
    // 3칸: 떠 있는 물방울 때문에 뿌옇다
    const fog = [[90, 236, 120, 28], [300, 214, 140, 26], [520, 238, 130, 28], [200, 252, 120, 20], [430, 252, 120, 20], [600, 210, 90, 22], [40, 206, 90, 22]];
    body += `<defs><filter id="${id}-blur" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="7"/></filter></defs>`;
    body += shown(3, `<g filter="url(#${id}-blur)">` + fog.map(([x, y, rx, ry], i) => `<g class="sw" style="animation-delay:-${f(i * 0.9)}s;animation-duration:${f(4 + (i % 3))}s"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="white" fill-opacity=".9"/></g>`).join('') + '</g>');
    // 4칸: 높은 곳의 구름과 견주기
    body += at(4, 'pop', cloud(480, 92, 1.15), 0.1) + at(4, 'pop', tag(340, 66, '구름'), 0.4);
    body += at(4, 'pop', tag(320, 148, '안개', COLD), 0.8) + glowRect(4, 172, 632, 96, 4, C.green, 1, 12);
    css += `
      .sc-${id} .cold { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 2s ease-in-out .3s; }
      .on1 .sc-${id} .cold { transform: none; }
      .sc-${id} .dimg { transition: opacity 1.2s ease .4s; }
      .on3 .sc-${id} .dimg { opacity: .45; }
      .sc-${id} .sw { animation: ${id}-sway 4s ease-in-out infinite; }`;
    put('5-2/과학/2/안개', svg(id, body, css));
  })();

  // ── 기압 ──
  (function () {
    const id = 's2-giap';
    let css = base(id);
    let body = `<rect x="0" y="330" width="640" height="30" fill="${C.mint}"/>`;
    body += `<path d="M250 331 L440 120 L630 331 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;
    // 공기 알갱이: 아래로 갈수록 빽빽하다(위에 쌓인 공기가 누른다)
    const r = seeded(29);
    const inMountain = (x, y) => y > 108 && Math.abs(x - 440) < ((y - 108) * 190) / 211 + 14;
    // 비워 둘 곳: 왼쪽 큰 화살표, 봉지 둘, 꼬리표 둘, 그리고 봉지를 누르는 화살표 둘레
    const keep = [[0, 0, 58, 330], [90, 280, 210, 334], [84, 146, 216, 190], [355, 60, 535, 125], [518, 120, 636, 162], [428, 14, 452, 66]];
    const segs = [[44, 309, 94, 309], [256, 309, 206, 309], [150, 196, 150, 282], [72, 222, 104, 262], [228, 222, 196, 262]];
    const near = (x, y, [ax, ay, bx, by]) => { const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2))); return Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay)) < 16; };
    const blocked = (x, y) => inMountain(x, y) || keep.some(([a, b, c, d]) => x > a && x < c && y > b && y < d) || segs.some((sg) => near(x, y, sg));
    let air = '';
    for (let row = 0; row < 11; row++) {
      const y = 34 + row * 28, n = Math.round(3 + row * row * 0.32 + row * 1.2);
      for (let k = 0; k < n; k++) {
        const x = 70 + ((k + r()) * 560) / n, yy = y + (r() - 0.5) * 12;
        if (!blocked(x, yy)) air += `<g class="jg" style="animation-delay:-${f(r() * 1.4)}s"><circle cx="${f(x)}" cy="${f(yy)}" r="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/></g>`;
      }
    }
    body += at(1, 'fin', air);
    body += shown(1, flow([[34, 40], [34, 318]], C.blue, { w: 6 }));
    // 산 아래 봉지: 사방에서 세게 누른다
    const bag = (cx, cy, w, h) => `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M${cx - w / 2 + 6} ${cy - h / 2 + 6} H${cx + w / 2 - 6} M${cx - w / 2 + 6} ${cy + h / 2 - 6} H${cx + w / 2 - 6}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="4 4"/>`;
    body += `<g class="sq">${bag(150, 309, 100, 38)}</g>`;
    body += shown(2, [[[44, 309], [94, 309]], [[256, 309], [206, 309]], [[150, 196], [150, 282]], [[72, 222], [104, 262]], [[228, 222], [196, 262]]].map((p) => flow(p, C.blue, { w: 6 })).join(''));
    // 산꼭대기 봉지: 누르는 공기가 적어 부푼다
    body += `<g class="pf">${bag(440, 104, 70, 28)}</g>`;
    body += shown(3, [[[352, 104], [384, 104]], [[528, 104], [496, 104]], [[440, 24], [440, 60]]].map((p) => flow(p, C.blue, { w: 3.5 })).join(''));
    // 4칸: 기압의 크기
    body += at(4, 'pop', tag(150, 168, '기압 높음', COLD), 0.2) + at(4, 'pop', tag(576, 141, '기압 낮음', HOT), 0.6);
    css += `
      .sc-${id} .jg { animation: ${id}-jig 1.4s ease-in-out infinite; }
      .sc-${id} .sq, .sc-${id} .pf { transform-box: fill-box; transform-origin: 50% 100%; }
      .on2 .sc-${id} .sq { animation: ${id}-sq .8s ease-in-out .2s 2; }
      @keyframes ${id}-sq { 0%, 100% { transform: none; } 50% { transform: scale(.94, .8); } }
      .sc-${id} .pf { transition: transform 1.6s ease-in-out .3s; }
      .on3 .sc-${id} .pf { transform: scale(1.25, 1.6); }`;
    put('5-2/과학/2/기압', svg(id, body, css));
  })();

  // ── 고기압·저기압: 옆에서 본 공기의 흐름 ──
  const pressure = (high) => {
    const id = high ? 's2-gogiap' : 's2-jeogiap';
    let css = base(id);
    let body = `<rect x="0" y="300" width="640" height="60" fill="${C.mint}"/>`;
    const xs = [270, 320, 370];
    const vert = xs.map((x) => flow(high ? [[x, 70], [x, 232]] : [[x, 244], [x, 112]], C.blue, { w: 5 })).join('');
    const dots = [295, 345, 295, 345].map((x, i) => `<g class="up" style="animation-delay:${f(i * 0.65)}s;--up:${high ? 130 : -130}px"><circle cx="${x}" cy="${high ? 84 : 236}" r="5" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/></g>`).join('');
    const side = high
      ? flow([[292, 272], [86, 272]], C.blue, { w: 7 }) + flow([[348, 272], [554, 272]], C.blue, { w: 7 })
      : flow([[86, 272], [282, 272]], C.blue, { w: 7 }) + flow([[554, 272], [358, 272]], C.blue, { w: 7 });
    const m = g('pulse pulse4', mark(320, 330, high ? '고' : '저', high ? C.blue : C.red));
    if (high) {
      body += shown(1, cloud(130, 110, 0.9) + cloud(520, 120, 0.8), 3);
      body += shown(1, vert + dots);
      body += at(2, 'pop', m);
      body += shown(3, side) + at(3, 'pop', sun(520, 82, 28), 0.6);
    } else {
      body += shown(1, side) + at(1, 'pop', m, 0.3);
      body += shown(2, vert + dots);
      body += at(3, 'pop', cloud(320, 96, 1.6), 0.1);
      body += shown(3, [214, 234, 254, 386, 406, 426].map((x, i) => `<g class="fall" style="animation-delay:${f((i % 3) * 0.3 + 0.6)}s;--fall:70px"><path d="M${x} 112 l-4 16" stroke="${C.blue}" stroke-width="3.5" stroke-linecap="round"/></g>`).join(''));
    }
    body += ring(320, 330, 24, 4, high ? C.blue : C.red);
    put(`5-2/과학/2/${high ? '고기압' : '저기압'}`, svg(id, body, css));
  };
  pressure(true);
  pressure(false);

  // ── 해풍·육풍: 왼쪽 바다, 오른쪽 육지 ──
  const breeze = (day) => {
    const id = day ? 's2-haepung' : 's2-yukpung';
    let css = base(id);
    let body = '';
    body += `<rect x="0" y="262" width="300" height="98" fill="${C.sky}"/>`;
    body += [286, 314, 342].map((y, i) => `<g class="wv" style="animation-delay:-${i * 0.7}s"><path d="M${20 + i * 14} ${y} q15 -7 30 0 t30 0 M${150 + i * 10} ${y} q15 -7 30 0 t30 0" stroke="${C.blue}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`).join('');
    const land = 'M286 262 L318 250 H640 V360 H286 Z';
    body += `<path d="${land}" fill="${C.mint}"/><g class="tint"><path d="${land}" fill="${day ? C.peach : C.sky}"/></g><path d="M286 262 L318 250 H640" stroke="${C.green}" stroke-width="3" fill="none"/>`;
    body += text(150, 334, '바다', { size: 22 }) + text(470, 324, '육지', { size: 22 });
    body += thermo(40, 276, 322, 'ts') + thermo(600, 266, 312, 'tl');
    css += day ? level(id, 'ts', [0.45, 0.6]) + level(id, 'tl', [0.45, 0.95]) : level(id, 'ts', [0.7, 0.6]) + level(id, 'tl', [0.7, 0.18]);
    body += day ? sun(590, 52, 24) + tag(520, 52, '낮', HOT) : moon(590, 52, 24) + star(470, 36) + star(410, 64, 0.6) + tag(520, 52, '밤', COLD);
    if (day) body += shown(1, [390, 560].map((x, i) => `<g class="up" style="animation-delay:${i * 0.9}s;--up:-60px">${`<path d="M${f(x)} 240 q-6 -8 0 -16 t0 -16" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`}</g>`).join(''), 2);
    const warm = day ? 480 : 140, cool = day ? 140 : 480;
    body += shown(2, flow([[warm, 210], [warm, 104]], C.orange, { w: 5 }) + flow([[cool, 104], [cool, 210]], C.blue, { w: 5 }));
    body += at(2, 'pop', mark(cool, 238, '고', C.blue), 0.3) + at(2, 'pop', mark(warm, 238, '저', C.red), 0.6);
    const dir = warm > cool ? 1 : -1;
    body += shown(3, flow([[cool + 34 * dir, 238], [warm - 32 * dir, 238]], C.blue, { w: 9 }) + flow([[warm, 92], [cool, 92]], C.muted, { w: 3, dash: '10 14' }));
    body += at(4, 'pop', tag(310, 204, day ? '해풍' : '육풍', COLD, { size: 22 }), 0.2) + glowRect(f(Math.min(cool, warm) + 26), 222, f(Math.abs(warm - cool) - 52), 32, 4, C.green, 0.7, 10);
    css += `
      .sc-${id} .tint { opacity: 0; transition: opacity 2.4s ease-in-out .3s; }
      .on1 .sc-${id} .tint { opacity: ${day ? 0.9 : 0.5}; }
      .sc-${id} .wv { animation: ${id}-wv 2.1s ease-in-out infinite; }
      @keyframes ${id}-wv { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }`;
    put(`5-2/과학/2/${day ? '해풍' : '육풍'}`, svg(id, body, css));
  };
  breeze(true);
  breeze(false);

  // ════ 3단원 열과 우리 생활 ════

  // ── 열 ──
  (function () {
    const id = 's3-yeol';
    let css = base(id);
    let body = beaker(60, 110, 360, 332);
    body += `<rect class="ow" x="63" y="140" width="294" height="189" fill="${C.sky}"/>`;
    body += beakerLine(60, 110, 360, 332);
    body += `<g class="dn">${beaker(150, 78, 270, 300)}<rect class="iw" x="153" y="118" width="114" height="179" fill="${C.orange}"/>${beakerLine(150, 78, 270, 300)}</g>`;
    // 온도: 80/20 → 60/27 → 35/35
    const t = (inner, outer) => text(210, 62, inner, { size: 24, color: C.ink }) + text(315, 130, outer, { size: 22, color: C.ink });
    body += shown(1, t('80 ℃', '20 ℃'), 2) + shown(2, t('60 ℃', '27 ℃'), 3) + at(3, 'pop', t('35 ℃', '35 ℃'));
    // 2칸: 컵 속에서 바깥으로 열이 옮겨 간다(3칸에서 온도가 같아지면 멈춘다)
    body += shown(2, [[[236, 190], [312, 190]], [[184, 190], [108, 190]], [[236, 260], [312, 260]], [[184, 260], [108, 260]]].map((p) => flow(p, C.red, { w: 5 })).join(''), 3);
    body += ring(210, 220, 50, 3) + ring(315, 230, 34, 3, C.green, 0.3);
    // 4칸: 온도가 높은 곳 → 낮은 곳
    body += at(4, 'pop', `<rect x="398" y="176" width="64" height="58" rx="8" fill="${C.orange}" stroke="${C.red}" stroke-width="3"/>` + text(430, 266, '높은 온도', { size: 18 }), 0.1);
    body += at(4, 'pop', `<rect x="562" y="176" width="64" height="58" rx="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + text(594, 266, '낮은 온도', { size: 18 }), 0.4);
    body += shown(4, flow([[470, 205], [552, 205]], C.red, { w: 6 }) + text(511, 186, '열', { size: 22, color: C.red }));
    css += `
      .sc-${id} .dn { transform: translateY(-70px); transition: transform 1.4s ease-in-out .3s; }
      .on1 .sc-${id} .dn { transform: none; }
      .sc-${id} .iw, .sc-${id} .ow { transition: fill 5s ease-in-out .3s; }
      .on2 .sc-${id} .iw { fill: ${C.peach}; }
      .on3 .sc-${id} .ow { fill: ${C.peach}; transition-duration: 1.2s; transition-delay: 0s; }`;
    put('5-2/과학/3/열', svg(id, body, css));
  })();

  // ── 전도 ──
  (function () {
    const id = 's3-jeondo';
    let css = base(id);
    let body = '';
    // 받침대
    body += `<rect x="566" y="186" width="10" height="146" fill="${C.muted}"/><rect x="540" y="330" width="62" height="10" rx="3" fill="${C.muted}"/><rect x="554" y="162" width="34" height="26" rx="4" fill="${C.muted}"/>`;
    const n = 10, x0 = 110, w = 45, hot = (i) => (i < 3 ? C.red : i < 6 ? C.orange : C.peach);
    for (let i = 0; i < n; i++) {
      const x = x0 + w * i, cx = x + w / 2, d = f(i * 0.32);
      body += `<rect class="sg sg${i}" x="${x}" y="150" width="${w}" height="50" fill="${C.line}" stroke="white" stroke-width="2"/>`;
      body += `<g class="pt pt${i}"><circle cx="${cx}" cy="175" r="11" fill="white" stroke="${C.muted}" stroke-width="2"/></g>`;
      body += `<g class="wx wx${i}"><ellipse cx="${cx}" cy="142" rx="8" ry="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/></g>`;
      css += `.on2 .sc-${id} .sg${i} { fill: ${hot(i)}; transition-delay: ${d}s; }
        .on2 .sc-${id} .wx${i} { opacity: 0; transform: scale(1.5, .2); transition-delay: ${f(d + 0.3)}s; }
        .on2 .sc-${id} .pt${i} { animation: ${id}-jig .3s linear ${d}s infinite; }`;
    }
    body += `<rect x="${x0}" y="150" width="${n * w}" height="50" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<rect x="112" y="252" width="40" height="12" rx="3" fill="${C.muted}"/>` + flame(132, 250, 40, 15);
    body += text(250, 242, '쇠막대');
    // 3칸: 알갱이는 제자리, 열만 옆으로
    const px = x0 + w * 5 + w / 2;
    body += shown(3, flow([[150, 116], [540, 116]], C.red, { w: 6 }) + text(345, 98, '열', { size: 22, color: C.red }));
    body += shown(3, `<circle cx="${px}" cy="175" r="18" fill="none" stroke="${C.green}" stroke-width="3.5" stroke-dasharray="6 4"/>`) + ring(px, 175, 18, 3);
    body += at(3, 'pop', lead(px, 194, px, 222) + tag(px, 238, '제자리'), 0.5);
    body += glowRect(x0 - 6, 144, n * w + 12, 62, 4, C.green, 0.2, 8);
    css += `
      .sc-${id} .sg { transition: fill .8s ease; }
      .on1 .sc-${id} .sg0 { fill: ${C.red}; }
      .on1 .sc-${id} .pt0 { animation: ${id}-jig .3s linear infinite; }
      .sc-${id} .wx { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .8s ease, opacity .8s ease; }
      .on1 .sc-${id} .wx0 { opacity: 0; transform: scale(1.5, .2); transition-delay: .5s; }`;
    put('5-2/과학/3/전도', svg(id, body, css));
  })();

  // ── 대류 ──
  (function () {
    const id = 's3-daeryu';
    let css = base(id);
    let body = beaker(150, 110, 490, 320);
    body += `<rect x="153" y="135" width="334" height="182" fill="${C.sky}"/>`;
    body += beakerLine(150, 110, 490, 320);
    body += `<rect x="270" y="346" width="100" height="12" rx="3" fill="${C.muted}"/>` + flame(292, 344, 26, 12) + flame(320, 344, 30, 14, 0.2) + flame(348, 344, 26, 12, 0.4);
    // 1칸: 바닥 가운데 물이 데워진다
    body += shown(1, `<g class="pulse pulse1" style="animation-iteration-count:infinite"><ellipse cx="320" cy="306" rx="54" ry="11" fill="${C.orange}" fill-opacity=".7"/></g>`);
    body += shown(1, [[300, 296], [320, 300], [340, 296], [310, 284], [332, 286]].map(([x, y], i) => `<g class="jg" style="animation-delay:-${i * 0.2}s"><circle cx="${x}" cy="${y}" r="5.5" fill="${C.orange}" stroke="white" stroke-width="1.5"/></g>`).join(''), 2);
    // 2칸: 데워진 물이 위로
    body += shown(2, flow([[320, 290], [320, 166]], C.orange, { w: 6 }));
    body += shown(2, [304, 336, 304, 336].map((x, i) => `<g class="up" style="animation-delay:${f(i * 0.6)}s;--up:-130px"><circle cx="${x}" cy="292" r="5.5" fill="${C.orange}" stroke="white" stroke-width="1.5"/></g>`).join(''), 3);
    // 3칸: 위에서 식어 옆으로, 아래로 — 빙글 도는 흐름
    body += shown(3, flow([[332, 158], [440, 158]], C.muted, { w: 4 }) + flow([[308, 158], [200, 158]], C.muted, { w: 4 })
      + flow([[456, 172], [456, 282]], C.blue, { w: 6 }) + flow([[184, 172], [184, 282]], C.blue, { w: 6 })
      + flow([[440, 300], [336, 300]], C.muted, { w: 4 }) + flow([[200, 300], [304, 300]], C.muted, { w: 4 }));
    const loop = (sx) => `M320 300 V175 Q320 160 ${320 + 15 * sx} 160 H${320 + 120 * sx} Q${320 + 135 * sx} 160 ${320 + 135 * sx} 175 V285 Q${320 + 135 * sx} 300 ${320 + 120 * sx} 300 Z`;
    const riders = [1, -1].map((sx) => Array.from({ length: 7 }, (_, i) => `<g><circle r="5.5" stroke="white" stroke-width="1.5" fill="${C.orange}"><animate attributeName="fill" values="${C.orange};${C.orange};${C.blue};${C.blue};${C.orange}" keyTimes="0;.28;.5;.82;1" dur="5.6s" begin="${f(-i * 0.8 - (sx < 0 ? 0.4 : 0))}s" repeatCount="indefinite"/></circle><animateMotion path="${loop(sx)}" dur="5.6s" begin="${f(-i * 0.8 - (sx < 0 ? 0.4 : 0))}s" repeatCount="indefinite"/></g>`).join('')).join('');
    body += shown(3, riders);
    // 4칸: 따뜻한 물은 오르고 찬물은 내려온다
    body += at(4, 'pop', lead(320, 92, 320, 128) + tag(320, 74, '따뜻한 물', HOT), 0.2);
    body += at(4, 'pop', lead(116, 230, 178, 230) + tag(76, 230, '찬물', COLD), 0.6) + at(4, 'pop', lead(462, 230, 524, 230) + tag(564, 230, '찬물', COLD), 0.9);
    css += `.sc-${id} .jg { animation: ${id}-jig .5s linear infinite; }`;
    put('5-2/과학/3/대류', svg(id, body, css));
  })();

  // ── 복사 ──
  (function () {
    const id = 's3-boksa';
    let css = base(id);
    let body = `<g class="sunglow"><circle cx="-40" cy="180" r="152" fill="${C.yellow}" fill-opacity=".35"/></g><circle cx="-40" cy="180" r="140" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>`;
    body += text(40, 190, '해', { size: 28 });
    body += `<circle cx="545" cy="180" r="58" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    body += `<path d="M520 140 q18 -8 30 4 q10 14 -4 26 q-14 8 -24 -6 q-8 -14 -2 -24 Z M548 196 q20 -6 28 8 q4 18 -14 22 q-18 2 -18 -14 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/>`;
    body += `<g class="warm"><path d="M545 122 A58 58 0 0 0 545 238 Z" fill="${C.orange}"/></g>`;
    body += `<circle cx="545" cy="180" r="58" fill="none" stroke="${C.blue}" stroke-width="3"/>`;
    body += text(545, 272, '지구');
    // 1칸: 해와 지구 사이는 텅 빈 우주
    body += at(1, 'fin', `<rect class="mar" x="122" y="82" width="344" height="196" rx="18" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="14 10"/>`);
    body += at(1, 'pop', tag(294, 304, '우주'), 0.8);
    // 2칸: 빛이 곧장 건너온다
    const rays = [[96, 120, 486, 150], [108, 180, 477, 180], [96, 240, 486, 210]];
    body += shown(2, rays.map(([a, b, c, d]) => flow(wavePts(a, b, c, d, 8, 34), C.orange, { w: 4, dash: '18 6' })).join(''));
    body += at(2, 'pop', text(300, 112, '빛', { size: 22, color: C.orange }), 0.5);
    // 3칸: 햇빛을 받은 쪽이 따뜻해진다
    body += shown(3, [505, 528].map((x, i) => `<g class="up" style="animation-delay:${i * 0.8}s;--up:-50px"><path d="M${x} 116 q-5 -7 0 -14 t0 -14" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join(''));
    // 4칸
    body += ring(545, 180, 60, 4, C.orange) + glowRect(122, 82, 344, 196, 4, C.green, 0.4, 18);
    css += `
      .sc-${id} .warm { opacity: 0; transition: opacity 1.6s ease-in-out .4s; }
      .on3 .sc-${id} .warm { opacity: .55; }
      .sc-${id} .sunglow { transform-box: fill-box; transform-origin: center; animation: ${id}-glow 2s ease-in-out infinite alternate; }
      @keyframes ${id}-glow { from { opacity: .4; } to { opacity: 1; } }`;
    put('5-2/과학/3/복사', svg(id, body, css));
  })();

  // ── 단열 ──
  (function () {
    const id = 's3-danyeol';
    let css = base(id);
    // 얇은 컵
    let body = beaker(120, 130, 240, 312);
    body += `<g class="fillup"><rect class="cw" x="123" y="165" width="114" height="144" fill="${C.orange}"/></g>`;
    body += beakerLine(120, 130, 240, 312).replace('stroke-width="4"', 'stroke-width="3"');
    // 보온병: 두 겹 벽 사이 빈 곳
    body += `<rect x="388" y="108" width="144" height="214" rx="18" fill="${C.lilac}" stroke="${C.muted}" stroke-width="4"/><rect x="408" y="128" width="104" height="174" rx="12" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<g class="fillup" style="transition-delay:.9s"><rect x="411" y="150" width="98" height="149" rx="9" fill="${C.orange}"/></g>`;
    body += `<rect x="398" y="88" width="124" height="22" rx="6" fill="${C.muted}"/>`;
    // 온도
    body += shown(1, text(180, 346, '70 ℃', { size: 24 }), 2) + at(2, 'pop', text(180, 346, '45 ℃', { size: 24, color: C.blue }), 1.4);
    body += shown(1, text(460, 350, '70 ℃', { size: 24 }), 3) + at(3, 'pop', text(460, 350, '68 ℃', { size: 24, color: C.red }), 1.4);
    // 2칸: 얇은 컵은 열이 벽을 지나 빠져나간다
    body += shown(2, [[[150, 228], [64, 228]], [[150, 282], [64, 282]], [[210, 228], [300, 228]], [[210, 282], [300, 282]]].map((p) => flow(p, C.red, { w: 5 })).join('')
      + flow(wavePts(180, 176, 180, 72, 6, 30), C.red, { w: 4, dash: '18 6' }));
    // 3칸: 보온병은 빈 곳에서 열의 길이 막힌다
    const x = (cx, cy) => `<path d="M${cx - 6} ${cy - 6} L${cx + 6} ${cy + 6} M${cx + 6} ${cy - 6} L${cx - 6} ${cy + 6}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`;
    body += shown(3, flow([[446, 228], [414, 228]], C.red, { w: 5 }) + flow([[474, 228], [506, 228]], C.red, { w: 5 })
      + flow([[446, 278], [414, 278]], C.red, { w: 5 }) + flow([[474, 278], [506, 278]], C.red, { w: 5 }));
    body += `<g class="b3">${[[398, 228], [522, 228], [398, 278], [522, 278]].map(([a, b], i) => g('pop pop3', x(a, b), 0.6 + i * 0.15)).join('')}</g>`;
    body += at(3, 'pop', lead(533, 118, 556, 78) + tag(575, 60, '두 겹 벽'), 0.9);
    // 4칸
    body += glowRect(382, 102, 156, 226, 4, C.green, 0.2, 22);
    css += `
      .sc-${id} .fillup { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1.2s ease-out .3s; }
      .on1 .sc-${id} .fillup { transform: none; }
      .sc-${id} .cw { transition: fill 2.6s ease-in-out .3s; }
      .on2 .sc-${id} .cw { fill: ${C.peach}; }`;
    put('5-2/과학/3/단열', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
