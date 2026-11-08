// 과학 6-2 낱말 도식: 움직임이나 흐름으로 보여야 하는 과학 낱말(태양 고도·공전·연소·전기 회로 …)을 코드로 그린다.
// 눈에 보이지 않는 기체(산소·이산화 탄소)는 점선 테두리의 빈 동그라미로 적는다(칸 글에서 보이지 않는다고 말한다).
// 전기가 흐르는 길은 전선 위를 흐르는 주황 점선으로 적는다(전지의 + 극에서 나와 - 극으로 들어간다).
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
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted];
  // 꼬리표. dash 는 기체처럼 눈에 안 보이는 것
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
  const wavePts = (x1, y1, x2, y2, amp = 8, len = 34) => {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, pts = [];
    for (let s = 0; s <= L; s += 3) { const o = amp * Math.sin((s / len) * Math.PI * 2) * Math.min(1, (L - s) / 18); pts.push([x1 + ux * s - uy * o, y1 + uy * s + ux * o]); }
    pts.push([x2, y2]);
    return pts;
  };
  // 기체 알갱이: 눈에 안 보이므로 점선 테두리. 산소는 파랑, 이산화 탄소는 회색
  const gas = (x, y, color = C.blue, r = 7) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${color}" stroke-width="2.5" stroke-dasharray="3.5 2.5"/>`;
  const drop = (x, y, r = 7) => `<g><path d="M${f(x)} ${f(y - r * 1.5)} Q${f(x + r * 1.05)} ${f(y - r * 0.2)} ${f(x + r)} ${f(y + r * 0.2)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y + r * 0.2)} Q${f(x - r * 1.05)} ${f(y - r * 0.2)} ${f(x)} ${f(y - r * 1.5)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/></g>`;
  // 불꽃(밑 가운데 x, y)
  const flame = (x, y, h = 32, w = 14, s = 0) => `<g class="flk"${dl(s)}><path d="M${x} ${y - h} Q${x + w} ${f(y - h * 0.35)} ${f(x + w * 0.6)} ${y} H${f(x - w * 0.6)} Q${x - w} ${f(y - h * 0.35)} ${x} ${y - h} Z" fill="${C.orange}"/><path d="M${x} ${f(y - h * 0.55)} Q${f(x + w * 0.5)} ${f(y - h * 0.2)} ${f(x + w * 0.3)} ${y} H${f(x - w * 0.3)} Q${f(x - w * 0.5)} ${f(y - h * 0.2)} ${x} ${f(y - h * 0.55)} Z" fill="${C.yellow}"/></g>`;
  // 해(빛살이 천천히 숨 쉰다). 도는 무리 안에서도 쓸 수 있게 빛살은 fill-box 로 키웠다 줄인다.
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  const thermo = (x, y1, y2, cls) => `<rect x="${x - 8}" y="${y1}" width="16" height="${y2 - y1 + 4}" rx="8" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<rect class="lv ${cls}" x="${x - 3.5}" y="${y1 + 5}" width="7" height="${y2 - y1}" rx="3.5" fill="${C.red}"/>`
    + `<circle cx="${x}" cy="${y2 + 9}" r="11" fill="${C.red}" stroke="${C.muted}" stroke-width="2.5"/>`;
  const level = (id, cls, steps) => `.sc-${id} .${cls} { transform: scaleY(${steps[0]}); }` + steps.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: scaleY(${v}); }`).join('');
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const beaker = (x1, y1, x2, y2, fill = 'white') => `<path d="M${x1} ${y1} V${y2 - 6} Q${x1} ${y2} ${x1 + 6} ${y2} H${x2 - 6} Q${x2} ${y2} ${x2} ${y2 - 6} V${y1}" fill="${fill}" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
  const beakerLine = (x1, y1, x2, y2) => beaker(x1, y1, x2, y2, 'none');
  const ground = (y = 290) => `<rect x="0" y="${y}" width="640" height="${360 - y}" fill="${C.mint}"/><path d="M0 ${y} H640" stroke="${C.green}" stroke-width="3"/>`;
  // 각: 꼭짓점 (cx, cy), 화면에서 위쪽이 + 인 도(°) 단위. a1 → a2 로 그린다.
  const rad = (a) => (a * Math.PI) / 180;
  const pt = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))];
  const arcD = (cx, cy, r, a1, a2) => {
    const [x1, y1] = pt(cx, cy, r, a1), [x2, y2] = pt(cx, cy, r, a2);
    return `M${f(x1)} ${f(y1)} A${r} ${r} 0 ${Math.abs(a2 - a1) > 180 ? 1 : 0} ${a2 > a1 ? 0 : 1} ${f(x2)} ${f(y2)}`;
  };

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .flk, .sc-${id} .rays { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .flk { transform-origin: 50% 100%; animation: ${id}-flk .6s ease-in-out infinite alternate; }
    .sc-${id} .rays { animation: ${id}-pulse 2.4s ease-in-out infinite; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease-in-out; }
    .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 2.2s ease-in-out .3s; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-flk { from { transform: scaleY(1); } to { transform: scaleY(.8) scaleX(1.06); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 75% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -120px)); } }
    @keyframes ${id}-in { 0% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, 0)); } 25% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(0, 0); } }
    @keyframes ${id}-shake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-7deg); } 75% { transform: rotate(7deg); } }
    .sc-${id} .up { animation: ${id}-up 2.6s ease-in infinite; }
    .sc-${id} .in { animation: ${id}-in 2s ease-in infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 도는 무리: 점 (x, y) 를 중심으로 칸마다 각(도, 화면에서 시계 방향 +)을 바꾼다
  const turnCss = (id, cls, x, y, angles, sec = 2) => `.sc-${id} .${cls} { transform-box: view-box; transform-origin: ${x}px ${y}px; transform: rotate(${angles[0]}deg); transition: transform ${sec}s ease-in-out .2s; }`
    + angles.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: rotate(${v}deg); }`).join('');
  // 자라는 호: pathLength 90 인 호의 앞쪽 deg 만큼만 칠한다
  const growCss = (id, cls, degs, sec = 2) => `.sc-${id} .${cls} { stroke-dasharray: ${degs[0]} 400; transition: stroke-dasharray ${sec}s ease-in-out .2s; }`
    + degs.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { stroke-dasharray: ${v} 400; }`).join('');

  // ════ 1단원 계절의 변화 ════

  // ── 태양 고도: 해가 떠오르며 빛과 땅이 이루는 각이 커진다 ──
  (function () {
    const id = 't62-s1-godo';
    let css = base(id);
    const ox = 200, oy = 290;
    let body = `<g class="rot">${flow([[468, oy], [ox + 8, oy]], C.orange, { w: 4 })}${sunIcon(500, oy, 24)}</g>`;
    body += ground(oy) + text(575, 332, '지표면', { size: 20, color: C.green });
    body += `<path class="arc" d="${arcD(ox, oy, 64, 0, 90)}" pathLength="90" stroke="${C.red}" stroke-width="5" fill="none"/>`;
    body += `<circle cx="${ox}" cy="${oy}" r="6" fill="${C.ink}"/>`;
    body += shown(1, text(320, 274, '25°', { size: 22, color: C.red }), 2) + at(2, 'fin', text(302, 248, '55°', { size: 22, color: C.red }), 1.7);
    body += `<g class="b3"><path class="flash flash3" d="${arcD(ox, oy, 64, 0, 55)}" stroke="${C.yellow}" stroke-width="13" fill="none" opacity=".8"/></g>`;
    body += at(3, 'pop', tag(372, 196, '태양 고도', HOT, { size: 22 }), 0.4);
    css += turnCss(id, 'rot', ox, oy, [0, -25, -55]) + growCss(id, 'arc', [0, 25, 55]);
    put('6-2/과학/1/태양 고도', svg(id, body, css));
  })();

  // ── 남중: 남쪽을 보고 선 하늘. 해가 동쪽에서 떠서 정남쪽에서 가장 높고 서쪽으로 진다 ──
  (function () {
    const id = 't62-s1-namjung';
    let css = base(id);
    const cx = 320, cy = 290, R = 200;
    let body = `<path d="${arcD(cx, cy, R, 180, 0)}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="4 10" fill="none" stroke-linecap="round"/>`;
    body += at(2, 'fin', `<path d="M${cx} 124 V${cy}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 7"/>`
      + `<circle cx="${cx}" cy="90" r="24" fill="${C.yellow}" opacity=".45" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="5 4"/>`, 1.8);
    body += `<g class="rot">${sunIcon(cx - R, cy, 24)}</g>`;
    body += ground(cy);
    body += text(cx - R, 328, '동', { size: 24 }) + text(cx, 328, '남', { size: 24 }) + text(cx + R, 328, '서', { size: 24 });
    body += `<g class="b2">${g('pop pop2', g('pulse pulse4', tag(450, 92, '남중', HOT, { size: 22 })), 1.6)}</g>`;
    body += at(2, 'fin', text(cx, 354, '낮 12시 30분쯤', { size: 18, color: C.muted }), 1.8);
    body += ring(cx, 90, 30, 2, C.orange, 1.7) + ring(cx, 90, 30, 4, C.red, 0.4);
    css += turnCss(id, 'rot', cx, cy, [0, 40, 90, 150, 186]);
    put('6-2/과학/1/남중', svg(id, body, css));
  })();

  // ── 남중 고도: 정남쪽 하늘의 해. 여름에는 높고 겨울에는 낮다(우리나라, 약 76°와 29°) ──
  (function () {
    const id = 't62-s1-namjung-godo';
    let css = base(id);
    const ox = 380, oy = 290, d = 230;
    const [sx, sy] = pt(ox, oy, d, 180 - 76);
    let body = at(2, 'fin', `<path d="M${ox} ${oy} L${f(sx)} ${f(sy)}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="6 6" opacity=".6"/><circle cx="${f(sx)}" cy="${f(sy)}" r="22" fill="${C.yellow}" opacity=".45" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="5 4"/>`, 1.8);
    body += `<g class="rot">${flow([[ox - d + 28, oy], [ox - 8, oy]], C.orange, { w: 4 })}${sunIcon(ox - d, oy, 22)}</g>`;
    body += ground(oy) + text(60, 330, '남', { size: 24 }) + text(600, 330, '북', { size: 24 });
    body += `<g class="b3"><path class="flash flash3" d="${arcD(ox, oy, 70, 180, 151)}" stroke="${C.yellow}" stroke-width="13" fill="none" opacity=".8"/></g>`;
    body += `<path class="arc" d="${arcD(ox, oy, 70, 180, 90)}" pathLength="90" stroke="${C.red}" stroke-width="5" fill="none"/>`;
    body += `<circle cx="${ox}" cy="${oy}" r="6" fill="${C.ink}"/>`;
    body += shown(1, text(300, 236, '76°', { size: 22, color: C.red }), 2) + at(2, 'fin', text(266, 272, '29°', { size: 22, color: C.red }), 1.7);
    body += at(1, 'pop', tag(222, 66, '여름', HOT), 1.6) + at(2, 'pop', tag(179, 118, '겨울', COLD), 1.8);
    body += at(3, 'pop', tag(262, 330, '남중 고도', HOT, { size: 22 }), 0.4);
    css += turnCss(id, 'rot', ox, oy, [60, 76, 29]) + growCss(id, 'arc', [60, 76, 29]);
    put('6-2/과학/1/남중 고도', svg(id, body, css));
  })();

  // ── 태양 에너지양: 폭이 같은 빛 묶음. 해가 낮아지면 땅에 넓게 퍼져 같은 면적에 닿는 빛줄기가 4개 → 2개 ──
  (function () {
    const id = 't62-s1-energy';
    let css = base(id);
    const px = 320, py = 290;
    let beam = `<rect x="${px - 60}" y="84" width="120" height="420" fill="${C.yellow}" opacity=".3"/>`;
    [-50, -30, -10, 10, 30, 50].forEach((o) => { beam += `<path class="mar" d="M${px + o} 92 V500" stroke="${C.orange}" stroke-width="3" stroke-dasharray="18 6"/>`; });
    let body = `<defs><clipPath id="${id}-c"><rect x="0" y="0" width="640" height="${py}"/></clipPath></defs>`;
    body += `<g clip-path="url(#${id}-c)"><g class="rot">${beam}</g></g>`;
    body += `<g class="rot">${sunIcon(px, 60, 24)}</g>`;
    body += ground(py);
    body += `<rect class="patch" x="275" y="291" width="90" height="16" fill="white"/>`;
    for (let x = 290; x < 365; x += 15) body += `<path d="M${x} 291 V307" stroke="${C.red}" stroke-width="1.5" opacity=".5"/>`;
    body += `<rect x="275" y="291" width="90" height="16" fill="none" stroke="${C.red}" stroke-width="3"/>`;
    // 빛줄기가 땅에 닿는 자리(같은 면적 안은 빨강)
    const hits = (alt) => [-50, -30, -10, 10, 30, 50].map((o) => { const x = px + o / Math.sin(rad(alt)), inside = Math.abs(x - px) < 45; return `<circle cx="${f(x)}" cy="${py}" r="${inside ? 6 : 4.5}" fill="${inside ? C.red : C.orange}"/>`; }).join('');
    body += shown(1, hits(70), 2) + at(2, 'fin', hits(30), 1.9);
    body += text(px, 336, '같은 면적', { size: 20 });
    body += thermo(592, 130, 240, 'tm');
    body += shown(1, tag(150, 60, '여름', HOT), 2) + at(2, 'pop', tag(121, 112, '겨울', COLD), 1.8);
    body += glowRect(266, 283, 108, 32, 3, C.red, 0.2, 8) + at(3, 'pop', tag(486, 334, '태양 에너지양', HOT), 0.5);
    css += turnCss(id, 'rot', px, py, [-20, -20, -60]) + level(id, 'tm', [0.15, 0.85, 0.4]);
    css += `
      .sc-${id} .patch { transition: fill 1.6s ease-in-out .4s; }
      .on1 .sc-${id} .patch { fill: ${C.orange}; }
      .on2 .sc-${id} .patch { fill: ${C.peach}; }`;
    put('6-2/과학/1/태양 에너지양', svg(id, body, css));
  })();

  // ── 면적: 위에서 본 모눈 땅. 네 칸만큼의 넓이에 똑바로 온 빛은 모이고, 비스듬히 온 빛은 두 배로 퍼진다 ──
  (function () {
    const id = 't62-s1-myeonjeok';
    let css = base(id);
    let body = '';
    // 모눈 땅(위에서 본 모습) 8 × 6 칸
    body += `<rect x="40" y="60" width="320" height="240" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    for (let x = 80; x < 360; x += 40) body += `<path d="M${x} 60 V300" stroke="${C.green}" stroke-width="1.5" opacity=".35"/>`;
    for (let y = 100; y < 300; y += 40) body += `<path d="M40 ${y} H360" stroke="${C.green}" stroke-width="1.5" opacity=".35"/>`;
    // 1칸: 네 칸이 하나씩 칠해진다
    [[160, 140], [200, 140], [160, 180], [200, 180]].forEach(([x, y], i) => {
      body += at(1, 'pop', `<rect x="${x + 3}" y="${y + 3}" width="34" height="34" rx="4" fill="${C.peach}"/>`, 0.2 + i * 0.3);
    });
    body += `<rect x="160" y="140" width="80" height="80" fill="none" stroke="${C.red}" stroke-width="4"/>`;
    // 빛이 비친 자리: 2칸 똑바로(네 칸에 꼭 맞음) → 3칸 두 배로 퍼지고 옅어짐
    body += `<g class="b2"><rect class="spot" x="160" y="140" width="80" height="80" fill="${C.yellow}"/></g>`;
    body += `<rect x="160" y="140" width="80" height="80" fill="none" stroke="${C.red}" stroke-width="4"/>`;
    body += at(1, 'fin', text(200, 330, '4칸', { size: 22, color: C.red }), 1.4);
    // 오른쪽: 옆에서 본 빛(똑바로 → 비스듬히)
    const qx = 530, qy = 260;
    let beam = `<rect x="${qx - 20}" y="120" width="40" height="300" fill="${C.yellow}" opacity=".35"/>`;
    [-12, 0, 12].forEach((o) => { beam += `<path class="mar" d="M${qx + o} 126 V420" stroke="${C.orange}" stroke-width="3" stroke-dasharray="10 14"/>`; });
    body += `<defs><clipPath id="${id}-c"><rect x="380" y="0" width="260" height="${qy}"/></clipPath></defs>`;
    body += shown(2, `<g clip-path="url(#${id}-c)"><g class="rot">${beam}</g></g><g class="rot">${sunIcon(qx, 104, 14)}</g>`);
    body += shown(2, `<path d="M410 ${qy} H630" stroke="${C.green}" stroke-width="3"/><rect x="${qx - 20}" y="${qy}" width="40" height="8" fill="${C.red}"/>`);
    body += at(4, 'pop', tag(530, 318, '면적', HOT, { size: 24 }), 0.3) + glowRect(152, 132, 96, 96, 4, C.red, 0.5, 8);
    css += turnCss(id, 'rot', qx, qy, [0, 0, 0, -60]);
    css += `
      .sc-${id} .spot { transform-box: fill-box; transform-origin: center; opacity: .85; transition: transform 2s ease-in-out .2s, opacity 2s ease-in-out .2s; }
      .on3 .sc-${id} .spot { transform: scaleX(2); opacity: .42; }`;
    put('6-2/과학/1/면적', svg(id, body, css));
  })();

  // ── 자전축: 팽이처럼 도는 지구, 가운데를 꿰는 보이지 않는 선, 기울어짐 ──
  (function () {
    const id = 't62-s1-jajeonchuk';
    let css = base(id);
    const cx = 320, cy = 190, r = 105, tilt = 23.5;
    let inner = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    const lats = [[0, 1], [40, 0.7], [-40, 0.7]];
    lats.forEach(([lat]) => {
      const y = cy - r * Math.sin(rad(lat)), rx = r * Math.cos(rad(lat)), ry = rx * 0.19;
      inner += `<ellipse cx="${cx}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${C.blue}" stroke-width="2" opacity=".45"/>`;
    });
    // 앞면을 왼쪽에서 오른쪽으로 지나가는 점들(자전)
    let dots = '';
    lats.forEach(([lat], li) => {
      const y = cy - r * Math.sin(rad(lat)), rx = r * Math.cos(rad(lat)), ry = rx * 0.19;
      const path = `M${f(cx - rx)} ${f(y)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(y)}`;
      for (let k = 0; k < 3; k++) {
        const begin = `-${f(k * 2 + li * 0.7)}s`;
        dots += `<circle r="7" fill="${C.green}" opacity="0"><animateMotion dur="6s" repeatCount="indefinite" begin="${begin}" path="${path}" calcMode="spline" keyTimes="0;1" keyPoints="0;1" keySplines=".45 0 .55 1"/><animate attributeName="opacity" dur="6s" repeatCount="indefinite" begin="${begin}" values="0;1;1;0" keyTimes="0;.12;.88;1"/></circle>`;
      }
    });
    inner += shown(1, dots);
    // 북극 위를 도는 방향 화살표
    inner += shown(1, `<path d="M${cx - 26} 40 A26 7 0 0 0 ${cx + 26} 40" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>${head(cx + 26, 40, -0.35, C.green, 4)}`, 3);
    inner += `<g class="b4"><path class="flash flash4" d="M${cx} ${cy - 152} V${cy + 152}" stroke="${C.yellow}" stroke-width="12" opacity=".8"/></g>`;
    inner += `<g class="b2"><path class="draw draw2" pathLength="1" d="M${cx} ${cy - 152} V${cy + 152}" stroke="${C.red}" stroke-width="4" fill="none"/></g>`;
    inner += `<g class="b2"><circle cx="${cx}" cy="${cy - r}" r="6" fill="${C.red}"/><circle cx="${cx}" cy="${cy + r}" r="6" fill="${C.red}"/></g>`;
    let body = at(3, 'fin', `<path d="M${cx} 34 V346" stroke="${C.muted}" stroke-width="3" stroke-dasharray="8 8"/>`);
    body += `<g transform="rotate(${tilt} ${cx} ${cy})">${inner}</g>`;
    body += `<g class="b3"><path class="flash flash3" d="${arcD(cx, cy, 130, 90, 90 - tilt)}" stroke="${C.lilac}" stroke-width="14" fill="none" opacity=".9"/></g>`;
    body += at(3, 'fin', `<path d="${arcD(cx, cy, 130, 90, 90 - tilt)}" stroke="${C.purple}" stroke-width="5" fill="none"/>`, 0.4);
    const [nx, ny] = pt(cx, cy, r, 90 - tilt), [sx2, sy2] = pt(cx, cy, r, 270 - tilt);
    body += at(2, 'pop', tag(f(nx + 48), f(ny + 20), '북극', ['white', C.red], { size: 18 }), 0.9) + at(2, 'pop', tag(f(sx2 - 48), f(sy2 - 18), '남극', ['white', C.red], { size: 18 }), 1.1);
    body += at(2, 'pop', tag(476, 46, '자전축', [C.peach, C.red]), 1.3);
    css += `.sc-${id} .draw { transition-duration: 1.4s; }`;
    put('6-2/과학/1/자전축', svg(id, body, css));
  })();

  // ── 공전: 태양 둘레를 도는 지구. 자전축은 늘 같은 쪽으로 기울어져 있다 ──
  (function () {
    const id = 't62-s1-gongjeon';
    let css = base(id);
    const cx = 320, cy = 200, rx = 220, ry = 80, tilt = 23.5;
    const orbit = `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} A${rx} ${ry} 0 0 0 ${cx - rx} ${cy}`;
    let body = `<path d="${orbit}" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 8" fill="none"/>`;
    body += `<g class="b4"><path class="flash flash4" d="${orbit}" stroke="${C.yellow}" stroke-width="7" fill="none" opacity=".8"/></g>`;
    body += head(cx + 6, cy + ry, 0, C.muted, 3) + head(cx - 6, cy - ry, Math.PI, C.muted, 3);
    body += sunIcon(cx, cy, 34);
    const spots = [[cx - rx, cy, '여름'], [cx, cy + ry, '가을'], [cx + rx, cy, '겨울'], [cx, cy - ry, '봄']];
    const plain = (x, y, r = 20) => `<g transform="translate(${x} ${y}) rotate(${tilt})"><circle r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/><ellipse rx="${r}" ry="${f(r * 0.22)}" fill="none" stroke="${C.blue}" stroke-width="1.5" opacity=".5"/><path d="M0 ${f(-r * 1.6)} V${f(r * 1.6)}" stroke="${C.red}" stroke-width="3.5"/></g>`;
    body += `<g class="b2"><g class="ghost">${spots.map(([x, y]) => plain(x, y)).join('')}</g></g>`;
    body += `<g class="b2">${spots.map(([x, y], i) => g('flash flash2', `<path d="M${f(x + 32 * Math.sin(rad(tilt)))} ${f(y - 32 * Math.cos(rad(tilt)))} L${f(x - 32 * Math.sin(rad(tilt)))} ${f(y + 32 * Math.cos(rad(tilt)))}" stroke="${C.yellow}" stroke-width="11" opacity=".8"/>`, 0.6 + i * 0.15)).join('')}</g>`;
    body += shown(1, `<g>${plain(0, 0)}<animateMotion dur="8s" repeatCount="indefinite" path="${orbit}"/></g>`, 3);
    // 3칸: 계절 이름과 남중 고도(높음·낮음) 작은 그림
    const lab = [[cx - rx, cy + 52], [cx, cy + ry + 48], [cx + rx, cy + 52], [cx, cy - ry - 36]];
    body += spots.map(([, , s], i) => at(3, 'pop', tag(lab[i][0], lab[i][1], s, s === '여름' ? HOT : s === '겨울' ? COLD : OK), 0.2 + i * 0.2)).join('');
    const inset = (x0, alt, label, colors) => {
      const gx = x0 + 120, gy = 108, [sx, sy] = pt(gx, gy, 62, 180 - alt);
      return `<rect x="${x0}" y="12" width="182" height="108" rx="12" fill="white" stroke="${colors[1]}" stroke-width="2.5"/>`
        + text(x0 + 91, 40, label, { size: 18 })
        + `<path d="M${x0 + 14} ${gy} H${x0 + 168}" stroke="${C.green}" stroke-width="3"/>`
        + `<path d="M${f(sx)} ${f(sy)} L${gx} ${gy}" stroke="${C.orange}" stroke-width="3"/>`
        + `<path d="${arcD(gx, gy, 24, 180, 180 - alt)}" stroke="${C.red}" stroke-width="4" fill="none"/>`
        + `<circle cx="${f(sx)}" cy="${f(sy)}" r="10" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
    };
    body += at(3, 'pop', inset(12, 66, '남중 고도 높음', HOT), 1.1) + at(3, 'pop', inset(446, 30, '남중 고도 낮음', COLD), 1.3);
    body += at(4, 'pop', tag(560, 318, '공전', [C.peach, C.red], { size: 22 }), 0.3);
    css += `
      .sc-${id} .ghost { opacity: .5; transition: opacity .45s ease; }
            .on3 .sc-${id} .ghost { opacity: 1; }`;
    put('6-2/과학/1/공전', svg(id, body, css));
  })();

  // ════ 2단원 물질의 연소 ════

  const candle = (x, y1, y2, w = 24) => `<rect x="${x - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" rx="3" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`;
  const wick = (x, y) => `<path d="M${x} ${y} V${y - 8}" stroke="${C.ink}" stroke-width="2.5"/>`;
  // 연소의 세 조건 삼각형. hi 는 밝히는 꼭짓점 이름
  const triangle = (hi, n, s = 0.2) => {
    const A = [515, 120], B = [430, 262], Cc = [600, 262];
    let t = `<path d="M${A[0]} ${A[1]} L${B[0]} ${B[1]} L${Cc[0]} ${Cc[1]} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="4" stroke-linejoin="round"/>`;
    t += text(515, 222, '연소', { size: 24, color: C.red });
    const corner = (x, y, label) => label === hi ? g('pulse pulse' + n, tag(x, y, label, [C.yellow, C.red], { size: 20 }), s + 0.6) : tag(x, y, label, GRAY, { size: 18 });
    t += corner(515, 84, '발화점 이상의 온도') + corner(430, 296, '탈 물질') + corner(585, 296, '산소');
    return at(n, 'fin', t, s);
  };

  // ── 연소: 촛불이 빛과 열을 내고, 둘레의 산소가 불꽃으로 들어간다 ──
  (function () {
    const id = 't62-s2-yeonso';
    let css = base(id);
    const x = 180;
    let body = `<path d="M40 320 H340" stroke="${C.muted}" stroke-width="3"/>`;
    body += shown(1, `<g class="glow"><circle cx="${x}" cy="168" r="72" fill="${C.yellow}" opacity=".35"/></g>`);
    body += shown(1, Array.from({ length: 8 }, (_, k) => { const a = (k * Math.PI) / 4 + 0.2; return `<path d="M${f(x + 82 * Math.cos(a))} ${f(168 + 82 * Math.sin(a))} L${f(x + 98 * Math.cos(a))} ${f(168 + 98 * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }).join(''));
    body += candle(x, 200, 320, 50) + wick(x, 200) + shown(1, flame(x, 196, 64, 22));
    body += shown(1, [150, 210].map((hx, i) => `<g class="up" style="animation-delay:${i * 1.1}s;--up:-70px"><path d="M${hx} 96 q-7 -9 0 -18 t0 -18" stroke="${C.red}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join(''));
    body += at(1, 'pop', tag(64, 104, '빛', [C.yellow, C.orange]), 0.6) + at(1, 'pop', tag(296, 70, '열', HOT), 0.9);
    // 2칸: 양쪽에서 산소가 불꽃 밑동으로 들어간다
    const r = seeded(7);
    let ox = '';
    for (let k = 0; k < 8; k++) {
      const side = k % 2 ? 1 : -1, dx = side * (110 + r() * 40), dy = 40 + r() * 70;
      ox += `<g class="in" style="animation-delay:${f(k * 0.25)}s;--dx:${f(dx)}px;--dy:${f(dy)}px">${gas(x + side * 16, 190)}</g>`;
    }
    body += shown(2, ox) + at(2, 'pop', tag(304, 262, '산소', COLD, { dash: true }), 0.6);
    // 3칸: 오른쪽에 낱말 정리
    body += ring(x, 168, 60, 3, C.orange);
    body += at(3, 'pop', tag(495, 90, '연소', [C.peach, C.red], { size: 26 }), 0.2);
    body += at(3, 'pop', tag(430, 168, '양초', OK) + text(493, 175, '+', { size: 26 }) + tag(556, 168, '산소', COLD, { dash: true }), 0.6);
    body += at(3, 'fin', flow([[495, 194], [495, 238]], C.orange, { w: 5 }), 1.0) + at(3, 'pop', tag(495, 268, '빛과 열', [C.yellow, C.orange], { size: 22 }), 1.3);
    css += `.sc-${id} .glow { transform-box: fill-box; transform-origin: center; animation: ${id}-pulse 1.6s ease-in-out infinite; }`;
    put('6-2/과학/2/연소', svg(id, body, css));
  })();

  // ── 탈 물질: 생일 초가 타서 짧아지다 다 타면 꺼진다 ──
  (function () {
    const id = 't62-s2-tal';
    let css = base(id);
    const x = 190, top = 150, bot = 290, H = bot - top;
    let body = `<path d="M40 318 H340" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<g class="cb">${candle(x, top, bot, 28)}<path d="M${x - 9} ${top + 20} V${bot - 10}" stroke="${C.red}" stroke-width="3" opacity=".35"/></g>`;
    body += `<rect x="120" y="${bot}" width="140" height="28" rx="12" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`;
    body += `<g class="fl">${wick(x, top)}<g class="b1">${flame(x, top - 4, 46, 16)}</g></g>`;
    body += at(3, 'fin', [0, 0.8].map((s) => `<g class="up" style="animation-delay:${s}s;--up:-90px"><path d="M${x} ${bot - 10} q-8 -10 0 -20 t0 -20" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join(''), 2.0);
    body += text(x, 346, '고무찰흙', { size: 18, color: C.muted });
    body += at(1, 'pop', tag(300, 168, '생일 초', OK), 0.5);
    body += triangle('탈 물질', 4);
    css += `
      .sc-${id} .cb { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 2s linear .2s; }
      .sc-${id} .fl { transition: transform 2s linear .2s, opacity .35s ease 1.6s; }
      .on2 .sc-${id} .cb { transform: scaleY(.35); }
      .on2 .sc-${id} .fl { transform: translateY(${f(H * 0.65)}px); }
      .on3 .sc-${id} .cb { transform: scaleY(.03); }
      .on3 .sc-${id} .fl { transform: translateY(${f(H * 0.97)}px); opacity: 0; }`;
    put('6-2/과학/2/탈 물질', svg(id, body, css));
  })();

  // ── 산소: 같은 통 두 개로 촛불을 덮는다. 산소를 더 넣은 오른쪽이 더 오래 탄다 ──
  (function () {
    const id = 't62-s2-sanso';
    let css = base(id);
    let body = `<path d="M14 300 H366" stroke="${C.muted}" stroke-width="3"/>`;
    [100, 270].forEach((x) => { body += candle(x, 236, 300, 22) + wick(x, 236); });
    body += `<g class="lf">${flame(100, 232, 36, 13)}</g><g class="rf">${flame(270, 232, 36, 13)}</g>`;
    // 통 속 산소 알갱이: 왼쪽 6개, 오른쪽 6개 + 더 넣은 8개
    const base6 = [[-40, 140], [0, 128], [40, 146], [-30, 186], [34, 190], [-44, 222]];
    const extra = [[-12, 160], [20, 170], [-36, 260], [44, 232], [6, 206], [-20, 112], [40, 116], [46, 270]];
    let lg = '', rg = '';
    base6.forEach(([dx, y], i) => { lg += `<g class="lo lo${i}">${gas(100 + dx, y)}</g>`; rg += `<g class="ro ro${i}">${gas(270 + dx, y)}</g>`; });
    extra.forEach(([dx, y], i) => { rg += `<g class="b1">${g('pop pop1', `<g class="re re${i}">${gas(270 + dx, y)}</g>`, 0.6 + i * 0.12)}</g>`; });
    body += lg + rg;
    // 통(뒤집어 덮는 투명한 통)
    const box = (x1) => `<path d="M${x1} 300 V112 Q${x1} 100 ${x1 + 12} 100 H${x1 + 128} Q${x1 + 140} 100 ${x1 + 140} 112 V300" fill="${C.sky}" fill-opacity=".25" stroke="${C.blue}" stroke-width="3.5"/><rect x="${x1 + 50}" y="86" width="40" height="14" rx="4" fill="${C.blue}" opacity=".6"/>`;
    body += at(1, 'drop', box(30), 0) + at(1, 'drop', box(200), 0.15);
    body += at(1, 'pop', tag(270, 62, '산소 더', COLD, { dash: true }), 0.5);
    // 타는 시간 막대
    body += text(190, 350, '타는 시간', { size: 18, color: C.muted });
    body += `<rect x="40" y="312" width="120" height="14" rx="7" fill="white" stroke="${C.line}" stroke-width="2"/><rect x="210" y="312" width="120" height="14" rx="7" fill="white" stroke="${C.line}" stroke-width="2"/>`;
    body += `<rect class="tl" x="40" y="312" width="120" height="14" rx="7" fill="${C.orange}"/><rect class="tr" x="210" y="312" width="120" height="14" rx="7" fill="${C.orange}"/>`;
    body += ring(270, 210, 34, 3, C.orange, 0.6);
    body += triangle('산소', 4);
    css += `
      .sc-${id} .tl, .sc-${id} .tr { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 2s linear .2s; }
      .on1 .sc-${id} .tl, .on1 .sc-${id} .tr { transform: scaleX(.22); }
      .on2 .sc-${id} .tl { transform: scaleX(.42); transition-duration: 1.5s; }
      .on2 .sc-${id} .tr { transform: scaleX(.6); }
      .on3 .sc-${id} .tr { transform: scaleX(1); }
      .sc-${id} .lf, .sc-${id} .rf { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .5s ease 1.4s, opacity .5s ease 1.4s; }
      .on2 .sc-${id} .lf { transform: scale(.2); opacity: 0; }
      .sc-${id} .lo, .sc-${id} .ro, .sc-${id} .re { transition: opacity .5s ease; }
      ${[0, 1, 2, 3, 4].map((i) => `.on2 .sc-${id} .lo${i} { opacity: 0; transition-delay: ${f(0.2 + i * 0.25)}s; }`).join('\n')}
      ${[0, 1, 2].map((i) => `.on2 .sc-${id} .ro${i} { opacity: 0; transition-delay: ${f(0.3 + i * 0.4)}s; }`).join('\n')}
      ${[3, 4, 5].map((i, k) => `.on3 .sc-${id} .ro${i} { opacity: 0; transition-delay: ${f(0.3 + k * 0.5)}s; }`).join('\n')}
      ${[0, 1, 2].map((i, k) => `.on3 .sc-${id} .re${i} { opacity: 0; transition-delay: ${f(0.5 + k * 0.5)}s; }`).join('\n')}`;
    put('6-2/과학/2/산소', svg(id, body, css));
  })();

  // ── 발화점: 구리판 가운데를 데우면, 불꽃에 닿지 않은 성냥 머리가 먼저, 나무 조각이 나중에 탄다 ──
  (function () {
    const id = 't62-s2-balhwa';
    let css = base(id);
    let body = `<path d="M20 322 H400" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<path d="M62 208 L44 322 M358 208 L376 322" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
    // 알코올램프
    body += `<path d="M178 322 Q170 286 196 276 H224 Q250 286 242 322 Z" fill="${C.sky}" stroke="${C.muted}" stroke-width="3"/><rect x="202" y="262" width="16" height="16" fill="${C.muted}"/>`;
    body += flame(210, 262, 54, 15);
    // 구리판과 퍼지는 열
    body += `<rect x="50" y="196" width="320" height="12" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    body += `<rect class="hot" x="52" y="198" width="316" height="8" fill="${C.orange}"/>`;
    body += `<ellipse cx="110" cy="189" rx="11" ry="7" fill="${C.red}"/><path d="M99 191 H121" stroke="${C.ink}" stroke-width="1.5" opacity=".4"/>`;
    body += `<rect x="294" y="185" width="32" height="11" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    body += text(110, 240, '성냥 머리', { size: 18 }) + text(310, 240, '나무', { size: 18 });
    body += at(2, 'pop', flame(110, 184, 34, 12), 1.2) + at(3, 'pop', flame(310, 184, 34, 12), 1.5);
    // 온도 막대와 발화점 눈금
    body += thermo(450, 90, 290, 'tg');
    const tick = (y, label) => `<path d="M460 ${y} H478" stroke="${C.ink}" stroke-width="3"/>` + text(486, y + 7, label, { size: 18, anchor: 'start' });
    body += tick(210, '성냥 머리') + tick(140, '나무');
    body += text(450, 340, '온도', { size: 18, color: C.muted });
    body += `<g class="b4">${g('flash flash4', `<path d="M452 210 H479 M452 140 H479" stroke="${C.yellow}" stroke-width="10"/>`, 0.4)}</g>`;
    body += at(4, 'pop', tag(450, 50, '발화점', HOT, { size: 22 }), 0.2);
    css += level(id, 'tg', [0.05, 0.22, 0.55, 0.9]);
    css += `
      .sc-${id} .hot { transform-box: fill-box; transform-origin: center; transform: scaleX(.08); transition: transform 2.2s ease-in-out .3s, opacity 2.2s ease .3s; opacity: .5; }
      .on1 .sc-${id} .hot { transform: scaleX(.45); opacity: .7; }
      .on2 .sc-${id} .hot { transform: scaleX(.8); opacity: .85; }
      .on3 .sc-${id} .hot { transform: scaleX(1); opacity: 1; }`;
    put('6-2/과학/2/발화점', svg(id, body, css));
  })();

  // 집기병(입구가 위)
  const jar = (x1, y1, x2, y2) => `<path d="M${x1 + 22} ${y1} V${y1 + 18} Q${x1} ${y1 + 26} ${x1} ${y1 + 48} V${y2 - 8} Q${x1} ${y2} ${x1 + 8} ${y2} H${x2 - 8} Q${x2} ${y2} ${x2} ${y2 - 8} V${y1 + 48} Q${x2} ${y1 + 26} ${x2 - 22} ${y1 + 18} V${y1}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
  // 석회수: 맑을 때는 옅은 물빛, 흐려지면 회색빛 흰색이 덮는다(cls 로 흐려짐)
  const lime = (x1, y1, x2, y2, cls) => `<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="${C.sky}" opacity=".45"/><g class="${cls}"><rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="${C.line}"/>${(() => { const r = seeded(x1 + y1); return Array.from({ length: 16 }, () => `<circle cx="${f(x1 + 8 + r() * (x2 - x1 - 16))}" cy="${f(y1 + 6 + r() * (y2 - y1 - 12))}" r="3" fill="white"/>`).join(''); })()}</g>`;
  const milkCss = (id, cls, n, delay = 1) => `.sc-${id} .${cls} { opacity: 0; transition: opacity 1.4s ease ${delay}s; } .on${n} .sc-${id} .${cls} { opacity: .95; }`;

  // ── 이산화 탄소: 집기병 속 촛불이 타며 보이지 않는 기체가 생기고, 석회수가 뿌옇게 흐려져 알 수 있다 ──
  (function () {
    const id = 't62-s2-co2';
    let css = base(id);
    let body = `<path d="M20 310 H600" stroke="${C.muted}" stroke-width="3"/>`;
    // 왼쪽: 뒤집어 덮은 집기병 속 촛불
    const x = 140;
    body += candle(x, 250, 310, 22) + wick(x, 250) + `<g class="cf">${flame(x, 246, 38, 13)}</g>`;
    const pts = [[-34, 150], [10, 140], [40, 168], [-20, 190], [28, 210], [-40, 228], [0, 176]];
    body += `<g class="b1">${pts.map(([dx, y], i) => g('pop pop1', gas(x + dx, y, C.muted), 0.5 + i * 0.22)).join('')}</g>`;
    body += at(1, 'drop', `<path d="M${x - 62} 310 V150 Q${x - 62} 128 ${x - 40} 120 V100 H${x + 40} V120 Q${x + 62} 128 ${x + 62} 150 V310" fill="${C.sky}" fill-opacity=".2" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`);
    body += at(1, 'pop', tag(x, 66, '보이지 않음', GRAY, { size: 18, dash: true }), 1.6);
    // 2칸: 촛불이 꺼진 병을 세워 석회수를 넣고 흔든다
    body += at(2, 'fin', flow([[226, 200], [320, 200]], C.muted, { w: 4 }), 0.2);
    const jx1 = 360, jx2 = 480;
    let J = `<g class="lw">${lime(jx1 + 3, 262, jx2 - 3, 306, 'milk')}</g>`;
    J += pts.slice(0, 5).map(([dx, y], i) => `<g class="gz gz${i}">${gas(420 + dx, y + 20, C.muted)}</g>`).join('');
    J += jar(jx1, 110, jx2, 310) + `<rect x="${jx1 + 12}" y="100" width="${jx2 - jx1 - 24}" height="8" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    body += `<g class="b2"><g class="shk">${J}</g></g>`;
    body += at(2, 'pop', tag(560, 284, '석회수', COLD), 0.5) + at(2, 'fin', lead(522, 284, 478, 284), 0.5);
    body += at(4, 'pop', tag(420, 60, '이산화 탄소', GRAY, { size: 22, dash: true }), 0.2) + ring(420, 284, 50, 4, C.muted, 0.6);
    css += milkCss(id, 'milk', 3, 0.3);
    css += `
      .sc-${id} .cf { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .5s ease 2s, opacity .5s ease 2s; }
      .on1 .sc-${id} .cf { transform: scale(.2); opacity: 0; }
      .sc-${id} .lw { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform .8s ease-out .4s; }
      .on2 .sc-${id} .lw { transform: none; }
      .sc-${id} .shk { transform-box: fill-box; transform-origin: 50% 100%; }
      .on2 .sc-${id} .shk { animation: ${id}-shake .5s ease-in-out 1.2s 3; }
      .sc-${id} .gz { transition: opacity .6s ease; }
      ${[0, 1, 2, 3, 4].map((i) => `.on3 .sc-${id} .gz${i} { opacity: 0; transition-delay: ${f(0.2 + i * 0.25)}s; }`).join('\n')}`;
    put('6-2/과학/2/이산화 탄소', svg(id, body, css));
  })();

  // ── 연소 생성물: 염화 코발트 종이가 붉게(물), 석회수가 뿌옇게(이산화 탄소) ──
  (function () {
    const id = 't62-s2-saengseong';
    let css = base(id);
    let body = `<path d="M20 290 H560" stroke="${C.muted}" stroke-width="3"/>`;
    const x = 140;
    body += candle(x, 226, 290, 24) + wick(x, 226) + `<g class="cf">${flame(x, 222, 38, 13)}</g>`;
    body += `<rect class="paper" x="66" y="120" width="22" height="84" rx="2" fill="${C.blue}"/>`;
    body += at(2, 'pop', [[100, 130], [196, 150], [180, 116], [110, 176]].map(([dx, dy]) => drop(dx, dy, 5)).join(''), 1.6);
    body += `<path d="M58 290 V112 Q58 100 70 100 H210 Q222 100 222 112 V290" fill="${C.sky}" fill-opacity=".2" stroke="${C.blue}" stroke-width="3.5"/>`;
    body += at(1, 'pop', tag(140, 62, '염화 코발트 종이', COLD, { size: 18 }), 0.5) + at(1, 'fin', lead(96, 80, 80, 118), 0.5);
    body += at(2, 'pop', tag(260, 150, '물', COLD), 1.8);
    // 3칸: 석회수를 넣고 흔든 집기병
    const jx1 = 330, jx2 = 440;
    let J = lime(jx1 + 3, 246, jx2 - 3, 286, 'milk') + jar(jx1, 110, jx2, 290);
    body += `<g class="b3"><g class="shk">${J}</g></g>`;
    body += at(3, 'pop', tag(510, 150, '이산화 탄소', GRAY, { dash: true }), 1.6);
    // 4칸: 타기 전 → 탄 뒤
    let eq = tag(90, 332, '양초', OK) + text(140, 339, '+', { size: 24 }) + tag(190, 332, '산소', COLD, { dash: true });
    eq += flow([[236, 332], [282, 332]], C.orange, { w: 4 });
    eq += g('pulse pulse4', tag(322, 332, '물', COLD), 0.9) + text(364, 339, '+', { size: 24 }) + g('pulse pulse4', tag(450, 332, '이산화 탄소', GRAY, { dash: true }), 1.0);
    body += at(4, 'fin', eq, 0.1);
    css += milkCss(id, 'milk', 3, 1.2);
    css += `
      .sc-${id} .cf { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .5s ease .3s, opacity .5s ease .3s; }
      .on2 .sc-${id} .cf { transform: scale(.2); opacity: 0; }
      .sc-${id} .paper { transition: fill 1.2s ease .9s; }
      .on2 .sc-${id} .paper { fill: ${C.red}; }
      .sc-${id} .shk { transform-box: fill-box; transform-origin: 50% 100%; }
      .on3 .sc-${id} .shk { animation: ${id}-shake .5s ease-in-out .3s 2; }`;
    put('6-2/과학/2/연소 생성물', svg(id, body, css));
  })();

  // 산호(밑 가운데 x, y)와 조개
  const coral = (x, y, s = 1) => {
    const P = (dx, dy) => `${f(x + dx * s)} ${f(y + dy * s)}`;
    return `<path d="M${P(0, 0)} L${P(0, -40)} M${P(0, -24)} L${P(-22, -50)} L${P(-24, -72)} M${P(-22, -50)} L${P(-38, -62)} M${P(0, -40)} L${P(16, -70)} L${P(12, -92)} M${P(16, -70)} L${P(34, -84)} M${P(0, -12)} L${P(26, -34)} L${P(40, -46)}" stroke="${C.orange}" stroke-width="${f(9 * s)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  };
  const shell = (x, y) => {
    let s = `<path d="M${x} ${y} L${x - 30} ${y - 26} A40 40 0 0 1 ${x + 30} ${y - 26} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    for (let k = -2; k <= 2; k++) s += `<path d="M${x} ${y} L${x + k * 13} ${y - 40 + Math.abs(k) * 4}" stroke="${C.orange}" stroke-width="2"/>`;
    return s + `<rect x="${x - 8}" y="${y - 2}" width="16" height="7" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`;
  };

  // ── 해양 산성화: 공기 속 이산화 탄소가 바닷물에 많이 녹아들어 조개·산호가 살기 어려워진다(바닷물 빛깔은 그대로) ──
  (function () {
    const id = 't62-s2-sanseonghwa';
    let css = base(id);
    let body = `<rect x="0" y="160" width="640" height="200" fill="${C.sky}"/><rect x="0" y="322" width="640" height="38" fill="${C.peach}"/>`;
    body += [176, 200].map((y, i) => `<g class="wv" style="animation-delay:-${i * 0.8}s"><path d="M${10 + i * 20} ${y} q16 -7 32 0 t32 0 M${250 + i * 14} ${y} q16 -7 32 0 t32 0 M${470 + i * 10} ${y} q16 -7 32 0 t32 0" stroke="${C.blue}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`).join('');
    body += `<path d="M0 160 H640" stroke="${C.blue}" stroke-width="3"/>`;
    body += `<g class="life">${coral(140, 324, 1.1)}</g><g class="life">${coral(500, 324, 1)}</g><g class="life">${shell(330, 330)}</g>`;
    // 공기 속 이산화 탄소: 1칸에 늘어나고, 2칸에 바다로 내려가 녹아든다
    const r = seeded(11);
    let dots = '';
    for (let k = 0; k < 14; k++) {
      const x = 30 + k * 43 + r() * 16, y = 40 + r() * 90, dy = 150 + r() * 60;
      dots += `<g class="b1">${g('pop pop1', `<g class="sink" style="--dy:${f(dy)}px;transition-delay:${f(r() * 0.8)}s">${gas(x, y, C.muted, 8)}</g>`, f(0.2 + k * 0.1))}</g>`;
    }
    body += dots;
    body += at(1, 'pop', tag(320, 24, '이산화 탄소', GRAY, { size: 18, dash: true }), 1.5);
    body += at(3, 'pop', tag(226, 343, '산호', HOT, { size: 18 }), 1.6) + at(3, 'pop', tag(398, 343, '조개', HOT, { size: 18 }), 1.8);
    body += at(4, 'pop', tag(500, 120, '해양 산성화', COLD, { size: 22 }), 0.2) + glowRect(6, 166, 628, 150, 4, C.blue, 0.5, 10);
    css += `
      .sc-${id} .wv { animation: ${id}-wv 2.1s ease-in-out infinite; }
      @keyframes ${id}-wv { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
      .sc-${id} .sink { transition: transform 1.8s ease-in .2s, opacity 1.8s ease .2s; }
      .on2 .sc-${id} .sink { transform: translateY(var(--dy)); opacity: .55; }
      .sc-${id} .life { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 2s ease-in-out .3s, opacity 2s ease-in-out .3s; }
      .on3 .sc-${id} .life { transform: scale(.72); opacity: .45; }`;
    put('6-2/과학/2/해양 산성화', svg(id, body, css));
  })();

  // ── 배출량: 관으로 내보내는 이산화 탄소. 내보낸 만큼 막대가 쌓이고, 줄이면 막대가 낮다 ──
  (function () {
    const id = 't62-s2-baechul';
    let css = base(id);
    let body = `<path d="M20 300 H620" stroke="${C.muted}" stroke-width="3"/>`;
    // 건물과 관, 밸브
    body += `<path d="M40 300 V170 L80 140 V170 L120 140 V170 L160 140 V300 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<rect x="70" y="220" width="30" height="30" fill="white" stroke="${C.muted}" stroke-width="2"/><rect x="110" y="220" width="30" height="30" fill="white" stroke="${C.muted}" stroke-width="2"/>`;
    body += `<rect x="160" y="186" width="90" height="22" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<g class="b3"><g class="vlv"><circle cx="205" cy="174" r="12" fill="white" stroke="${C.red}" stroke-width="3"/><path d="M193 174 H217 M205 162 V186" stroke="${C.red}" stroke-width="3"/></g></g>`;
    const r = seeded(5);
    const puff = (k, n) => `<g class="drift" style="animation-delay:${f(k * (2.4 / n))}s;--dx:${f(130 + r() * 60)}px;--dy:${f(-50 - r() * 70)}px">${gas(256, 197, C.muted, 7)}</g>`;
    body += shown(1, Array.from({ length: 10 }, (_, k) => puff(k, 10)).join(''), 3);
    body += shown(3, Array.from({ length: 4 }, (_, k) => puff(k, 4)).join(''));
    body += at(1, 'pop', tag(300, 72, '이산화 탄소', GRAY, { size: 18, dash: true }), 0.8);
    // 막대: 처음 / 줄인 뒤
    body += `<path d="M450 300 V90" stroke="${C.muted}" stroke-width="2"/>`;
    body += shown(2, `<rect class="bar1" x="470" y="100" width="56" height="200" rx="4" fill="${C.purple}"/>`) + shown(3, `<rect class="bar2" x="552" y="100" width="56" height="200" rx="4" fill="${C.purple}" opacity=".75"/>`);
    body += at(2, 'fin', text(498, 328, '처음', { size: 18 })) + at(3, 'fin', text(580, 328, '줄인 뒤', { size: 18 }));
    body += at(4, 'pop', tag(530, 62, '배출량', [C.lilac, C.purple], { size: 22 }), 0.2) + glowRect(460, 90, 158, 216, 4, C.purple, 0.5, 10);
    css += `
      .sc-${id} .drift { animation: ${id}-drift 2.4s ease-out infinite; opacity: 0; }
      @keyframes ${id}-drift { 0% { opacity: 0; transform: translate(0, 0); } 15% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)); } }
      .sc-${id} .bar1, .sc-${id} .bar2 { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 2s ease-out .2s; }
      .on2 .sc-${id} .bar1 { transform: scaleY(.9); }
      .on3 .sc-${id} .bar2 { transform: scaleY(.38); }
      .sc-${id} .vlv { transform-box: fill-box; transform-origin: center; transition: transform 1s ease-in-out .2s; }
      .on3 .sc-${id} .vlv { transform: rotate(90deg); }`;
    put('6-2/과학/2/배출량', svg(id, body, css));
  })();

  // ════ 3단원 전기의 이용 ════

  const wire = (d) => `<path d="${d}" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  const cur = (d, cls = 'cur') => `<g class="${cls}"><path class="mar" d="${d}" stroke="${C.orange}" stroke-width="3.5" stroke-dasharray="7 17" fill="none" stroke-linejoin="round"/></g>`;
  // 전지: 가운데 (cx, cy), + 극이 오른쪽
  const cell = (cx, cy) => `<g><rect x="${cx - 34}" y="${cy - 16}" width="68" height="32" rx="5" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><rect x="${cx + 34}" y="${cy - 7}" width="7" height="14" rx="2" fill="${C.green}"/>`
    + text(cx + 22, cy - 24, '+', { size: 22, color: C.red }) + text(cx - 22, cy - 24, '−', { size: 22, color: C.blue }) + '</g>';
  // 전구: 전선 높이 wy 위에 선다. lit 클래스가 켜짐
  const bulb = (cx, wy, lit = 'lit', big = false) => {
    const cy = wy - 32, r = 20, gr = big ? 64 : 44;
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 - Math.PI / 8; rays += `<path d="M${f(cx + (r + 8) * Math.cos(a))} ${f(cy + (r + 8) * Math.sin(a))} L${f(cx + (r + (big ? 30 : 18)) * Math.cos(a))} ${f(cy + (r + (big ? 30 : 18)) * Math.sin(a))}" stroke="${C.orange}" stroke-width="${big ? 4 : 3}" stroke-linecap="round"/>`; }
    return `<g class="${lit}"><circle cx="${cx}" cy="${cy}" r="${gr}" fill="${C.yellow}" opacity="${big ? 0.55 : 0.4}"/>${rays}</g>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${C.muted}" stroke-width="3"/>`
      + `<g class="${lit}"><circle cx="${cx}" cy="${cy}" r="${r - 2}" fill="${C.yellow}"/></g>`
      + `<path d="M${cx - 7} ${cy + 13} L${cx - 5} ${cy - 2} Q${cx} ${cy - 10} ${cx + 5} ${cy - 2} L${cx + 7} ${cy + 13}" stroke="${C.ink}" stroke-width="2" fill="none"/>`
      + `<rect x="${cx - 11}" y="${cy + r - 4}" width="22" height="${wy - (cy + r - 4) + 6}" rx="3" fill="${C.muted}"/>`;
  };
  // 칼날 스위치: 축 px, 받침 qx, 높이 y. 손잡이(lev)는 열리면 위로 들린다
  const knife = (px, qx, y, cls = 'lev') => `<rect x="${px - 16}" y="${y + 7}" width="${qx - px + 34}" height="12" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`
    + `<path d="M${qx - 3} ${y - 9} V${y + 6} M${qx + 5} ${y - 9} V${y + 6}" stroke="${C.ink}" stroke-width="3"/>`
    + `<g class="${cls}"><path d="M${px} ${y} H${qx + 12}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><rect x="${qx + 8}" y="${y - 16}" width="11" height="18" rx="3" fill="${C.red}"/></g>`
    + `<circle cx="${px}" cy="${y}" r="7" fill="${C.ink}"/>`;
  const leverCss = (id, px, y, opens) => `.sc-${id} .lev { transform-box: view-box; transform-origin: ${px}px ${y}px; transform: rotate(${opens[0] ? -38 : 0}deg); transition: transform .6s ease-in-out .2s; }`
    + opens.slice(1).map((o, i) => o == null ? '' : `.on${i + 1} .sc-${id} .lev { transform: rotate(${o ? -38 : 0}deg); }`).join('');
  // 켜짐(전구 빛·전기 흐름) 칸별: 1 켜짐, 0 꺼짐
  const litCss = (id, cls, states, delay = 0.7) => `.sc-${id} .${cls} { opacity: ${states[0]}; transition: opacity .35s ease; }`
    + states.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { opacity: ${v}; transition-delay: ${v ? delay : 0.1}s; }`).join('');
  // 철 클립(세로, 가운데 0,0)
  const clip = `<path d="M-4 9 V-9 A4 4 0 0 1 4 -9 V11 A6 6 0 0 1 -8 11 V-11 A6 6 0 0 1 4 -11" transform="translate(2 0)" stroke="${C.muted}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

  // ── 전기 회로: 떨어진 한 곳을 이으면 전기가 흘러 전구가 켜진다 ──
  (function () {
    const id = 't62-s3-hoero';
    let css = base(id);
    const B = 300, T = 90, L = 110, R = 530;
    let body = `<g class="b3">${g('flash flash3', `<path d="M${L} ${T} H${R} V${B} H${L} Z" stroke="${C.yellow}" stroke-width="14" fill="none" stroke-linejoin="round" opacity=".85"/>`, 0.2)}</g>`;
    body += wire(`M362 ${B} H${R} V${T} H330`) + wire(`M310 ${T} H${L} V170`) + wire(`M${L} 230 V${B} H284`);
    body += `<circle cx="${L}" cy="170" r="6" fill="${C.ink}"/><circle cx="${L}" cy="230" r="6" fill="${C.ink}"/>`;
    body += `<g class="pc">${wire(`M${L} 166 V234`)}</g>` + cur(`M362 ${B} H${R} V${T} H${L} V${B} H284`);
    body += cell(320, B) + bulb(320, T);
    body += at(1, 'pop', tag(320, 342, '전지'), 0.3) + at(1, 'pop', tag(404, 48, '전구', [C.yellow, C.orange]), 0.5) + at(1, 'pop', tag(586, 196, '전선', GRAY), 0.7);
    body += ring(L, 200, 40, 1, C.red, 0.5) + ring(320, 58, 34, 2, C.orange, 1.0);
    body += at(3, 'pop', tag(320, 200, '전기 회로', OK, { size: 24 }), 0.5);
    css += litCss(id, 'lit', [0, 0, 1], 1.0) + litCss(id, 'cur', [0, 0, 1], 1.0);
    css += `
      .sc-${id} .pc { transform: translate(-46px, 6px) rotate(-14deg); transform-box: fill-box; transform-origin: center; transition: transform .9s ease-in-out .2s; }
      .on2 .sc-${id} .pc { transform: none; }`;
    put('6-2/과학/3/전기 회로', svg(id, body, css));
  })();

  // ── 스위치: 닫으면 켜지고 열면 꺼진다, 마지막 칸은 저절로 여닫힌다 ──
  (function () {
    const id = 't62-s3-switch';
    let css = base(id);
    const B = 300, T = 90, L = 110, R = 530, px = 190, qx = 250;
    let body = wire(`M442 ${B} H${R} V${T} H343`) + wire(`M297 ${T} H${L} V${B} H${px}`) + wire(`M${qx} ${B} H364`);
    body += cur(`M442 ${B} H${R} V${T} H${L} V${B} H364`);
    body += cell(400, B) + bulb(320, T) + knife(px, qx, B);
    body += text(400, 346, '전지', { size: 18, color: C.muted });
    body += at(1, 'pop', tag(222, 210, '스위치', [C.peach, C.red]), 0.3);
    body += shown(1, text(222, 346, '열림', { size: 20, color: C.red }), 2) + shown(2, text(222, 346, '닫힘', { size: 20, color: C.green }), 3) + shown(3, text(222, 346, '열림', { size: 20, color: C.red }), 4);
    body += glowRect(166, 262, 116, 66, 4, C.red, 0.2, 12);
    css += leverCss(id, px, B, [1, 1, 0, 1, null]) + litCss(id, 'lit', [0, 0, 1, 0]) + litCss(id, 'cur', [0, 0, 1, 0]);
    css += `
      @keyframes ${id}-tog { 0%, 42% { transform: rotate(0); } 50%, 92% { transform: rotate(-38deg); } 100% { transform: rotate(0); } }
      @keyframes ${id}-lit { 0%, 44% { opacity: 1; } 47%, 98% { opacity: 0; } 100% { opacity: 1; } }
      .on4 .sc-${id} .lev { animation: ${id}-tog 2.6s ease-in-out infinite; }
      .on4 .sc-${id} .lit, .on4 .sc-${id} .cur { animation: ${id}-lit 2.6s linear infinite; }`;
    put('6-2/과학/3/스위치', svg(id, body, css));
  })();

  // ── 도체·부도체: 끊어진 곳에 물체를 끼워 본다. 오른쪽은 전선 속(구리)과 겉(비닐) ──
  const conductor = (good) => {
    const id = good ? 't62-s3-doche' : 't62-s3-budoche';
    let css = base(id);
    const B = 310, T = 130, L = 70, R = 400;
    let body = wire(`M198 ${B} H297`) + wire(`M343 ${B} H${R} V${T} H322`) + wire(`M148 ${T} H${L} V${B} H124`);
    body += cur(`M198 ${B} H${R} V${T} H${L} V${B} H124`);
    body += `<circle cx="150" cy="${T}" r="7" fill="${C.red}"/><circle cx="320" cy="${T}" r="7" fill="${C.red}"/>`;
    body += cell(160, B) + bulb(320, B);
    const rod = (fill, stroke, label, extra = '') => `<rect x="128" y="${T - 7}" width="214" height="14" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${extra}${text(235, T - 22, label, { size: 20 })}`;
    const objs = good
      ? [rod(C.line, C.muted, '쇠젓가락'), rod('white', C.muted, '알루미늄 포일', `<path d="M136 ${T} l12 -4 l12 6 l12 -6 l12 5 l12 -5 l12 6 l12 -6 l12 5 l12 -5 l12 6 l12 -6 l12 5 l12 -5 l12 6 l12 -5" stroke="${C.muted}" stroke-width="1.5" fill="none"/>`)]
      : [rod(C.peach, C.orange, '나무젓가락'), rod('white', C.blue, '종이 빨대', `<path d="M150 ${T - 7} l-10 14 M180 ${T - 7} l-10 14 M210 ${T - 7} l-10 14 M240 ${T - 7} l-10 14 M270 ${T - 7} l-10 14 M300 ${T - 7} l-10 14 M330 ${T - 7} l-10 14" stroke="${C.blue}" stroke-width="2.5"/>`)];
    body += `<g class="o1">${objs[0]}</g><g class="o2">${objs[1]}</g>`;
    if (!good) body += ring(320, 278, 30, 1, C.muted, 1.0) + ring(320, 278, 30, 2, C.muted, 1.4);
    // 3칸: 전선 끝(속은 구리, 겉은 비닐)
    let inset = `<rect x="436" y="204" width="124" height="28" rx="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`;
    inset += `<rect x="558" y="211" width="54" height="14" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M562 215 H610 M562 221 H610" stroke="${C.orange}" stroke-width="1.5"/>`;
    inset += text(498, 190, '비닐', { size: 20 }) + text(585, 190, '구리', { size: 20 });
    body += at(3, 'pop', inset, 0.2);
    body += good ? glowRect(552, 204, 66, 28, 3, C.orange, 0.7, 6) : glowRect(430, 198, 136, 40, 3, C.purple, 0.7, 12);
    const chips = good ? [[470, 278, '철'], [550, 278, '구리'], [510, 322, '알루미늄']] : [[470, 278, '나무'], [550, 278, '비닐'], [470, 322, '유리'], [550, 322, '종이']];
    body += chips.map(([x, y, s], i) => at(3, 'pop', tag(x, y, s, good ? HOT : [C.lilac, C.purple], { size: 18 }), 0.9 + i * 0.15)).join('');
    body += at(3, 'pop', tag(525, 80, good ? '도체' : '부도체', good ? HOT : [C.lilac, C.purple], { size: 24 }), 1.5);
    css += `
      .sc-${id} .o1, .sc-${id} .o2 { transform: translateY(-80px); opacity: 0; transition: transform .8s ease-in-out .2s, opacity .4s ease .2s; }
      .on1 .sc-${id} .o1 { transform: none; opacity: 1; }
      .on2 .sc-${id} .o1 { transform: translateY(-110px); opacity: 0; }
      .on2 .sc-${id} .o2 { transform: none; opacity: 1; transition-delay: .7s; }`;
    if (good) css += `
      .sc-${id} .lit, .sc-${id} .cur { opacity: 0; transition: opacity .3s ease; }
      .on1 .sc-${id} .lit, .on1 .sc-${id} .cur { opacity: 1; transition-delay: 1s; }
      @keyframes ${id}-swap { 0% { opacity: 1; } 12%, 70% { opacity: 0; } 85%, 100% { opacity: 1; } }
      .on2 .sc-${id} .lit, .on2 .sc-${id} .cur { animation: ${id}-swap 1.8s linear both; }`;
    else css += `.sc-${id} .lit, .sc-${id} .cur { opacity: 0; }`;
    put(`6-2/과학/3/${good ? '도체' : '부도체'}`, svg(id, body, css));
  };
  conductor(true);
  conductor(false);

  // ── 직렬연결: 전지 1개 회로와, 서로 다른 극끼리 한 줄로 이은 전지 2개 회로. 2개 쪽 전구가 더 밝다 ──
  (function () {
    const id = 't62-s3-jikryeol';
    let css = base(id);
    const B = 300, T = 110;
    let body = wire(`M196 ${B} H280 V${T} H183`) + wire(`M137 ${T} H40 V${B} H126`) + cur(`M196 ${B} H280 V${T} H40 V${B} H126`, 'cur c1');
    body += cell(160, B) + bulb(160, T, 'lit l1');
    body += at(1, 'fin', text(160, 346, '전지 1개', { size: 20 }), 0.2);
    let right = wire(`M546 ${B} H600 V${T} H493`) + wire(`M447 ${T} H340 V${B} H400`) + cur(`M546 ${B} H600 V${T} H340 V${B} H400`, 'cur c2');
    right += cell(434, B) + `<g class="cb2">${cell(506, B)}</g>` + bulb(470, T, 'lit l2', true);
    right += text(470, 346, '전지 2개', { size: 20 });
    body += shown(2, right);
    body += `<g class="b2">${g('flash flash2', `<circle cx="471" cy="${B}" r="16" fill="none" stroke="${C.red}" stroke-width="4"/>`, 1.0)}</g>`;
    body += ring(470, 78, 40, 3, C.orange, 0.8);
    body += at(4, 'pop', tag(470, 205, '직렬연결', [C.peach, C.red], { size: 24 }), 0.2) + ring(471, B, 22, 4, C.red, 0.5);
    css += litCss(id, 'l1', [0, 1], 0.5) + litCss(id, 'c1', [0, 1], 0.5) + litCss(id, 'l2', [0, 0, 0, 1], 0.4) + litCss(id, 'c2', [0, 0, 0, 1], 0.4);
    css += `
      .sc-${id} .cb2 { transform: translateY(-70px); transition: transform .8s ease-in-out .3s; }
      .on2 .sc-${id} .cb2 { transform: none; }`;
    put('6-2/과학/3/직렬연결', svg(id, body, css));
  })();

  // ── 전자석: 철 막대에 감은 전선에 전기가 흐를 때만 클립이 붙는다 ──
  (function () {
    const id = 't62-s3-jeonjaseok';
    let css = base(id);
    const B = 300, px = 130, qx = 190;
    let body = wire(`M302 ${B} H340 V205 H388`) + wire(`M388 95 H100 V${B} H${px}`) + wire(`M${qx} ${B} H224`);
    body += cur(`M302 ${B} H340 V205 H388`) + cur(`M388 95 H100 V${B} H224`);
    body += cell(260, B) + knife(px, qx, B);
    // 철 막대와 감은 전선
    body += `<rect x="390" y="70" width="20" height="160" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<g class="b2 h3"><rect class="flash flash2" x="384" y="64" width="32" height="172" rx="6" fill="none" stroke="${C.red}" stroke-width="4" style="animation-delay:.6s"/></g>`;
    body += `<g class="b4"><rect class="flash flash4" x="384" y="64" width="32" height="172" rx="6" fill="none" stroke="${C.red}" stroke-width="4" style="animation-delay:.6s"/></g>`;
    for (let y = 95; y <= 205; y += 10) body += `<path d="M386 ${y} Q400 ${y + 7} 414 ${y - 2}" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    // 바닥과 클립: 바닥에 누워 있다가 막대 끝에 붙는다
    body += `<path d="M330 334 H500" stroke="${C.muted}" stroke-width="3"/>`;
    const clips = [[393, 247, -33, 75], [409, 249, -11, 73], [393, 278, 43, 44]];
    clips.forEach(([x, y, dx, dy], i) => { body += `<g class="cl cl${i}" style="--dx:${dx}px;--dy:${dy}px"><g transform="translate(${x} ${y})">${clip}</g></g>`; });
    body += at(1, 'pop', tag(500, 140, '철 막대', GRAY, { size: 18 }), 0.3) + at(1, 'fin', lead(448, 140, 412, 140), 0.3);
    body += at(1, 'pop', tag(560, 318, '철 클립', GRAY, { size: 18 }), 0.5);
    body += shown(1, text(160, 346, '열림', { size: 20, color: C.red }), 2) + shown(2, text(160, 346, '닫힘', { size: 20, color: C.green }), 3) + shown(3, text(160, 346, '열림', { size: 20, color: C.red }), 4) + shown(4, text(160, 346, '닫힘', { size: 20, color: C.green }));
    body += at(4, 'pop', tag(510, 60, '전자석', [C.peach, C.red], { size: 24 }), 0.3) + ring(400, 255, 34, 4, C.red, 0.9);
    css += leverCss(id, px, B, [1, 1, 0, 1, 0]) + litCss(id, 'cur', [0, 0, 1, 0, 1], 0.6);
    css += `
      .sc-${id} .cl { transform-box: fill-box; transform-origin: center; transform: translate(var(--dx), var(--dy)) rotate(80deg); transition: transform .6s cubic-bezier(.5, 0, .7, 1) .3s; }
      .on2 .sc-${id} .cl, .on4 .sc-${id} .cl { transform: none; transition: transform .5s cubic-bezier(.2, .8, .4, 1) .9s; }
      .on2 .sc-${id} .cl1, .on4 .sc-${id} .cl1 { transition-delay: 1s; }
      .on2 .sc-${id} .cl2, .on4 .sc-${id} .cl2 { transition-delay: 1.2s; }
      .on3:not(.on4) .sc-${id} .cl { transform: translate(var(--dx), var(--dy)) rotate(80deg); transition: transform .6s cubic-bezier(.5, 0, .7, 1) .8s; }`;
    put('6-2/과학/3/전자석', svg(id, body, css));
  })();

  // ── 감전: 젖은 손으로 플러그를 만지면 물을 따라 전기가 몸으로 흘러들어 온다 ──
  (function () {
    const id = 't62-s3-gamjeon';
    let css = base(id);
    let body = `<rect x="0" y="0" width="120" height="360" fill="${C.mint}"/><path d="M120 0 V360" stroke="${C.green}" stroke-width="3"/>`;
    body += `<rect x="40" y="120" width="80" height="120" rx="14" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    // 플러그와 전기 줄, 전등
    body += wire('M200 180 H560 V140') + cur('M200 180 H560 V138', 'cur');
    body += `<rect x="120" y="150" width="80" height="60" rx="12" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    body += bulb(560, 140, 'lit');
    body += text(80, 270, '콘센트', { size: 18 }) + text(160, 238, '플러그', { size: 18 });
    // 젖은 손(손가락이 왼쪽 위로 향함)
    let hand = `<rect x="60" y="-26" width="220" height="52" rx="22" fill="${C.peach}" stroke="${C.ink}" stroke-width="3"/>`;
    hand += `<rect x="-6" y="-34" width="80" height="68" rx="24" fill="${C.peach}" stroke="${C.ink}" stroke-width="3"/>`;
    [-24, -8, 8, 24].forEach((y, k) => { hand += `<rect x="${-52 + Math.abs(k - 1.5) * 6}" y="${y - 7}" width="64" height="14" rx="7" fill="${C.peach}" stroke="${C.ink}" stroke-width="2.5"/>`; });
    hand += `<rect x="6" y="-58" width="16" height="44" rx="8" transform="rotate(35 14 -36)" fill="${C.peach}" stroke="${C.ink}" stroke-width="2.5"/>`;
    hand += drop(-30, -24, 5) + drop(20, 6, 6) + drop(48, -14, 5) + drop(-10, 22, 5);
    body += `<g class="b2"><g class="hd"><g transform="translate(250 204) rotate(18)">${hand}</g></g></g>`;
    // 2칸: 손끝에서 팔로 들어오는 전기와 불꽃
    body += at(2, 'fin', flow([[196, 192], [250, 206], [290, 232], [340, 238], [392, 262], [460, 282]], C.orange, { w: 5, dash: '10 8' }), 1.5);
    let spark = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; spark += `<path d="M${f(196 + 10 * Math.cos(a))} ${f(190 + 10 * Math.sin(a))} L${f(196 + 26 * Math.cos(a))} ${f(190 + 26 * Math.sin(a))}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`; }
    body += `<g class="b2">${g('pop pop2', g('zap', spark), 1.4)}</g>`;
    body += at(2, 'pop', tag(262, 112, '물', COLD), 0.9);
    body += at(3, 'pop', tag(420, 330, '감전', [C.peach, C.red], { size: 24 }), 0.2) + ring(196, 190, 30, 3, C.red, 0.5);
    css += litCss(id, 'lit', [0, 1], 0.4) + litCss(id, 'cur', [0, 1], 0.4);
    css += `
      .sc-${id} .hd { transform: translate(120px, 90px); transition: transform 1.2s ease-out .2s; }
      .on2 .sc-${id} .hd { transform: none; }
      .sc-${id} .zap { transform-box: fill-box; transform-origin: center; animation: ${id}-zap .5s steps(2) infinite; }
      @keyframes ${id}-zap { 0% { opacity: 1; transform: scale(1); } 100% { opacity: .3; transform: scale(1.25); } }`;
    put('6-2/과학/3/감전', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
