// 과학 4-2 낱말 도식(2~4단원): 생태계·먹이 관계, 기체의 부피와 압력, 기후와 해수면을 코드로 그린다.
// 눈에 보이지 않는 기체는 점선 테두리의 빈 동그라미로 적는다(6-2 sci.js 와 같은 약속).
// 먹이 관계 화살표는 교과서대로 먹히는 생물에서 먹는 생물 쪽으로 긋는다.
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
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GAS = [C.lilac, C.purple];
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
  // 곧은 화살표(흐르지 않는다)
  const solid = (x1, y1, x2, y2, color, w = 4) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>${head(x2, y2, ang, color, w)}`;
  };
  // 기체 알갱이: 눈에 안 보이므로 점선 테두리
  const gas = (x, y, color = C.purple, r = 7) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${color}" stroke-width="2.5" stroke-dasharray="3.5 2.5"/>`;
  const drop = (x, y, r = 7) => `<path d="M${f(x)} ${f(y - r * 1.5)} Q${f(x + r * 1.05)} ${f(y - r * 0.2)} ${f(x + r)} ${f(y + r * 0.2)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y + r * 0.2)} Q${f(x - r * 1.05)} ${f(y - r * 0.2)} ${f(x)} ${f(y - r * 1.5)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  // 작은 해(빛살 고정)
  const sunSmall = (x, y, r = 13) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 4) * Math.cos(a))} ${f(y + (r + 4) * Math.sin(a))} L${f(x + (r + 10) * Math.cos(a))} ${f(y + (r + 10) * Math.sin(a))}" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>`; }
    return `${rays}<circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
  };
  // 구름: 밑변 가운데 (cx, cy), 배율 s
  const cloud = (cx, cy, s = 1, fill = 'white') => {
    const P = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`;
    return `<path d="M${P(-60, 0)} A${20 * s} ${20 * s} 0 0 1 ${P(-42, -30)} A${30 * s} ${30 * s} 0 0 1 ${P(8, -44)} A${26 * s} ${26 * s} 0 0 1 ${P(46, -22)} A${17 * s} ${17 * s} 0 0 1 ${P(60, 0)} Z" fill="${fill}" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/>`;
  };
  const thermo = (x, y1, y2, cls) => `<rect x="${x - 8}" y="${y1}" width="16" height="${y2 - y1 + 4}" rx="8" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<rect class="lv ${cls}" x="${x - 3.5}" y="${y1 + 5}" width="7" height="${y2 - y1}" rx="3.5" fill="${C.red}"/>`
    + `<circle cx="${x}" cy="${y2 + 9}" r="11" fill="${C.red}" stroke="${C.muted}" stroke-width="2.5"/>`;
  const level = (id, cls, steps) => `.sc-${id} .${cls} { transform: scaleY(${steps[0]}); }` + steps.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: scaleY(${v}); }`).join('');
  // 칸마다 바뀌는 CSS 값(vals[0] 은 첫 칸이 열리기 전 모습)
  const states = (id, cls, prop, vals, sec = 2, delay = 0.2) => `.sc-${id} .${cls} { ${prop}: ${vals[0]}; transition: ${prop} ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { ${prop}: ${v}; }`).join('');
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .rays, .sc-${id} .grow { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .rays { animation: ${id}-pulse 2.4s ease-in-out infinite; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-in-out .2s; }
    .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 2s ease-in-out .3s; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite alternate; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jig { 0% { transform: translate(0, 0); } 33% { transform: translate(3px, -2px); } 66% { transform: translate(-2px, 2px); } 100% { transform: translate(2px, 3px); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 75% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -60px)); } }
    @keyframes ${id}-in { 0% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, 0)); } 25% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(0, 0); } }
    @keyframes ${id}-chew { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-6deg); } }
    .sc-${id} .up { animation: ${id}-up 2.4s ease-in infinite; }
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

  // ── 숲 그림 조각 ──
  const GY = 270; // 땅 위
  const soil = () => `<rect x="0" y="${GY}" width="640" height="${360 - GY}" fill="${C.peach}"/>`
    + `<rect x="0" y="${GY - 6}" width="640" height="10" fill="${C.mint}"/><path d="M0 ${GY - 6} H640" stroke="${C.green}" stroke-width="3"/>`
    + [[60, 300], [150, 336], [250, 300], [470, 330], [560, 310], [610, 345]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="${C.line}"/>`).join('');
  const tree = (x, y) => {
    const cs = [[x, y - 140, 46], [x - 36, y - 108, 34], [x + 36, y - 108, 34]];
    return `<rect x="${x - 10}" y="${y - 100}" width="20" height="100" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + cs.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.green}" stroke-width="6"/>`).join('')
      + cs.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.mint}"/>`).join('');
  };
  const grass = (x, y) => `<path d="M${x - 9} ${y} Q${x - 11} ${y - 14} ${x - 16} ${y - 24} M${x} ${y} Q${x} ${y - 18} ${x + 2} ${y - 30} M${x + 9} ${y} Q${x + 11} ${y - 13} ${x + 17} ${y - 22}" stroke="${C.green}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  // 토끼: (x, y) 는 발밑 가운데, 왼쪽을 본다
  const rabbit = (x, y) => `<ellipse cx="${x - 22}" cy="${y - 60}" rx="5.5" ry="16" fill="white" stroke="${C.muted}" stroke-width="2.5" transform="rotate(-12 ${x - 22} ${y - 60})"/>`
    + `<ellipse cx="${x - 10}" cy="${y - 60}" rx="5.5" ry="16" fill="white" stroke="${C.muted}" stroke-width="2.5" transform="rotate(10 ${x - 10} ${y - 60})"/>`
    + `<circle cx="${x + 30}" cy="${y - 24}" r="7" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<ellipse cx="${x + 8}" cy="${y - 18}" rx="25" ry="18" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<circle cx="${x - 16}" cy="${y - 34}" r="14" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<circle cx="${x - 21}" cy="${y - 37}" r="2.4" fill="${C.ink}"/><circle cx="${x - 29}" cy="${y - 31}" r="2" fill="${C.orange}"/>`;
  // 새: (x, y) 몸 가운데, 왼쪽을 본다
  const bird = (x, y) => `<path d="M${x + 16} ${y - 2} L${x + 34} ${y - 10} L${x + 30} ${y + 4} Z" fill="${C.blue}"/>`
    + `<ellipse cx="${x}" cy="${y}" rx="21" ry="13" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
    + `<circle cx="${x - 18}" cy="${y - 9}" r="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
    + `<path d="M${x - 27} ${y - 11} L${x - 38} ${y - 7} L${x - 27} ${y - 5} Z" fill="${C.orange}"/>`
    + `<circle cx="${x - 21}" cy="${y - 11}" r="2.2" fill="${C.ink}"/>`
    + `<path d="M${x - 6} ${y - 4} Q${x + 6} ${y - 24} ${x + 14} ${y - 6}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-linecap="round"/>`;
  const mushroom = (x, y) => `<rect x="${x - 6}" y="${y - 22}" width="12" height="22" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<path d="M${x - 22} ${y - 18} Q${x} ${y - 54} ${x + 22} ${y - 18} Z" fill="${C.red}" stroke="${C.red}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<circle cx="${x - 8}" cy="${y - 28}" r="3.5" fill="white"/><circle cx="${x + 7}" cy="${y - 33}" r="3" fill="white"/>`;
  // 쓰러진 통나무와 곰팡이
  const moldLog = (x, y) => {
    const rnd = seeded(7);
    let spots = '';
    for (let i = 0; i < 9; i++) spots += `<circle cx="${f(x - 26 + rnd() * 50)}" cy="${f(y - 20 + rnd() * 12)}" r="${f(3.5 + rnd() * 3)}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="1.8"/>`;
    return `<rect x="${x - 42}" y="${y - 24}" width="84" height="24" rx="12" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><ellipse cx="${x + 34}" cy="${y - 12}" rx="7" ry="11" fill="white" stroke="${C.orange}" stroke-width="2.5"/>` + spots;
  };
  // 돋보기 속 세균
  const germs = (x, y, r = 30) => {
    const caps = [[-12, -10, 20], [8, -14, -30], [-4, 6, 70], [14, 8, 10], [-16, 12, -50]];
    return `<path d="M${f(x + r * 0.7)} ${f(y + r * 0.7)} L${f(x + r * 1.3)} ${f(y + r * 1.3)}" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/>`
      + `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.muted}" stroke-width="3.5"/>`
      + caps.map(([dx, dy, a]) => `<rect x="${x + dx - 7}" y="${y + dy - 3.5}" width="14" height="7" rx="3.5" fill="${C.lilac}" stroke="${C.purple}" stroke-width="1.8" transform="rotate(${a} ${x + dx} ${y + dy})"/>`).join('');
  };
  const wind = (x, y, len = 120) => `<path class="mar" d="M${x} ${y} q${len / 6} -10 ${len / 3} 0 t${len / 3} 0 t${len / 3} 0" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" fill="none" stroke-linecap="round"/>`;
  const pond = (x, y, rx = 62) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="16" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
    + `<path d="M${x - 30} ${y - 2} q8 -5 16 0 M${x + 8} ${y + 4} q8 -5 16 0" stroke="${C.blue}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

  // ════ 2단원 생물과 환경 ════

  // ── 생물 요소: 숲에서 살아 있는 것(나무·풀·토끼·새, 버섯·곰팡이·세균) ──
  (function () {
    const id = 't42-c2-saengmul';
    let css = base(id);
    let body = `<g class="nl">${soil()}${sunIcon(62, 58, 24)}${wind(440, 70)}${wind(470, 104, 90)}${pond(574, 284, 60)}</g>`;
    body += at(1, 'pop', tree(130, GY), 0) + at(1, 'pop', grass(282, GY) + grass(304, GY), 0.25)
      + at(1, 'pop', rabbit(386, GY), 0.5) + at(1, 'pop', bird(300, 112), 0.75);
    body += at(1, 'pop', tag(130, 64, '나무'), 0.2) + at(1, 'pop', tag(294, 226, '풀'), 0.45)
      + at(1, 'pop', tag(380, 186, '토끼'), 0.7) + at(1, 'pop', tag(300, 62, '새'), 0.95);
    body += at(2, 'pop', mushroom(214, GY), 0) + at(2, 'pop', moldLog(488, GY), 0.3) + at(2, 'pop', germs(300, 316, 28), 0.6);
    body += at(2, 'pop', tag(214, 196, '버섯'), 0.2) + at(2, 'pop', tag(488, 222, '곰팡이'), 0.5) + at(2, 'pop', tag(392, 318, '세균', GAS), 0.8);
    [[130, 158, 70], [294, 250, 26], [386, 236, 42], [300, 108, 38], [214, 252, 28], [488, 256, 46], [300, 316, 36]]
      .forEach(([x, y, r], i) => { body += ring(x, y, r, 3, C.green, 0.1 * i); });
    body += at(3, 'pop', tag(560, 186, '생물 요소', OK, { size: 22 }), 0.5);
    css += states(id, 'nl', 'opacity', [1, 1, 1, 0.35], 1);
    put('4-2/과학/2/생물 요소', svg(id, body, css));
  })();

  // ── 비생물 요소: 햇빛·공기·물·흙. 살아 있지 않지만 싹이 자라게 한다 ──
  (function () {
    const id = 't42-c2-bisaengmul';
    let css = base(id);
    const px = 330;
    let body = soil() + `<g class="sunG">${sunIcon(80, 70, 28)}</g>` + `<g class="windG">${wind(390, 64)}${wind(420, 100, 90)}</g>` + pond(560, 284, 64);
    // 싹: 칸 2에 자란다
    const sprout = `<path d="M${px} ${GY} C${px - 4} ${GY - 40} ${px + 4} ${GY - 80} ${px} ${GY - 120}" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round"/>`
      + `<path d="M${px} ${GY - 50} Q${px - 30} ${GY - 80} ${px - 62} ${GY - 66} Q${px - 32} ${GY - 44} ${px} ${GY - 50} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
      + `<path d="M${px} ${GY - 84} Q${px + 30} ${GY - 114} ${px + 62} ${GY - 100} Q${px + 32} ${GY - 78} ${px} ${GY - 84} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
      + `<path d="M${px} ${GY - 118} Q${px - 16} ${GY - 140} ${px - 4} ${GY - 152} Q${px + 14} ${GY - 136} ${px} ${GY - 118} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    const roots = `<path d="M${px} ${GY} L${px - 4} ${GY + 34} M${px} ${GY + 8} L${px - 22} ${GY + 30} M${px} ${GY + 10} L${px + 20} ${GY + 34}" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    body += `<g class="sprout">${sprout}</g>` + `<g class="b2">${g('fin fin2', roots, 0.3)}</g>`;
    body += at(1, 'pop', tag(80, 136, '햇빛', HOT), 0) + at(1, 'pop', tag(520, 40, '공기', COLD), 0.3)
      + at(1, 'pop', tag(560, 330, '물', COLD), 0.6) + at(1, 'pop', tag(90, 318, '흙', HOT), 0.9);
    body += ring(80, 70, 40, 1, C.orange, 0) + ring(470, 82, 54, 1, C.blue, 0.3) + ring(560, 284, 50, 1, C.blue, 0.6);
    // 칸 2: 햇빛이 잎으로, 물이 흙 속에서 뿌리로
    body += at(2, 'fin', flow([[118, 100], [px - 70, GY - 82]], C.orange, { w: 4 }) + flow([[122, 82], [px - 12, GY - 120]], C.orange, { w: 4 }), 0.2);
    body += at(2, 'fin', `<path class="mar" d="M${514} ${300} Q${430} ${318} ${px + 24} ${GY + 30}" stroke="${C.blue}" stroke-width="4" stroke-dasharray="10 8" fill="none" stroke-linecap="round"/>` + drop(420, 316, 7) + drop(382, 306, 6), 0.5);
    body += `<g class="b2">${['', 0.8, 1.6].map((s) => `<g class="up" style="--up:-110px;animation-delay:${s || 0}s">${drop(px + 8, GY + 26, 5)}</g>`).join('')}</g>`;
    body += [[80, 70, 40, C.orange], [470, 82, 54, C.blue], [560, 284, 50, C.blue], [90, 318, 40, C.orange]].map(([x, y, r, c], i) => ring(x, y, r, 3, c, 0.12 * i)).join('');
    body += at(3, 'pop', tag(230, 40, '비생물 요소', HOT, { size: 22 }), 0.5);
    css += `.sc-${id} .sprout { transform-box: fill-box; transform-origin: 50% 100%; transform: scale(.35); transition: transform 2s ease-in-out .3s; }
      .on2 .sc-${id} .sprout { transform: scale(1); }`;
    put('4-2/과학/2/비생물 요소', svg(id, body, css));
  })();

  // ── 생산자: 식물이 햇빛을 받아 양분을 스스로 만든다. 토끼는 식물을 먹는다 ──
  (function () {
    const id = 't42-c2-saengsanja';
    let css = base(id);
    const sx = 220, gy = 290;
    let body = `<rect x="0" y="${gy}" width="640" height="${360 - gy}" fill="${C.peach}"/><rect x="0" y="${gy - 6}" width="640" height="10" fill="${C.mint}"/><path d="M0 ${gy - 6} H640" stroke="${C.green}" stroke-width="3"/>`;
    body += sunIcon(66, 60, 28);
    const leaf = (y, dir, len = 74) => `<path class="lf" d="M${sx} ${y} Q${sx + dir * len * 0.45} ${y - 34} ${sx + dir * len} ${y - 12} Q${sx + dir * len * 0.45} ${y + 12} ${sx} ${y} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    const leaves = [[262, 1, 92], [236, -1, 74], [200, 1, 74], [166, -1, 70], [134, 1, 62]];
    body += `<path d="M${sx} ${gy} C${sx - 6} ${gy - 60} ${sx + 6} ${gy - 120} ${sx} ${gy - 176}" stroke="${C.green}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    body += leaves.map(([y, d, l]) => leaf(y, d, l)).join('');
    body += `<path d="M${sx} ${gy} L${sx - 6} ${gy + 40} M${sx} ${gy + 8} L${sx - 30} ${gy + 34} M${sx} ${gy + 10} L${sx + 28} ${gy + 38}" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    // 칸 1: 햇빛이 잎에 닿는다
    body += at(1, 'fin', flow([[100, 82], [sx - 62, 162]], C.orange, { w: 4 }) + flow([[106, 64], [sx + 20, 120]], C.orange, { w: 4 }) + flow([[96, 100], [sx - 60, 228]], C.orange, { w: 4 }), 0.2);
    body += `<g class="b1"><g class="leafglow">${leaves.map(([y, d, l]) => `<path d="M${sx} ${y} Q${sx + d * l * 0.45} ${y - 34} ${sx + d * l} ${y - 12} Q${sx + d * l * 0.45} ${y + 12} ${sx} ${y} Z" fill="${C.yellow}" opacity=".55"/>`).join('')}</g></g>`;
    // 칸 2: 잎마다 양분 알갱이가 생기고 줄기를 타고 내려간다
    const nut = (x, y, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.orange}" stroke="white" stroke-width="2"/>`;
    body += leaves.map(([y, d, l], i) => at(2, 'pop', nut(sx + d * l * 0.42, y - 8) + nut(sx + d * l * 0.68, y - 10, 5), 0.2 + i * 0.18)).join('');
    body += `<g class="b2">${[0, 0.6, 1.2].map((s) => `<g class="up" style="--up:90px;animation-delay:${s}s">${nut(sx, 150, 5)}</g>`).join('')}</g>`;
    body += at(2, 'pop', tag(110, 236, '양분', HOT), 1.1) + at(2, 'fin', lead(140, 232, sx - 34, 232), 1.1);
    // 칸 3: 토끼가 와서 아래 잎을 먹고, 양분이 토끼에게 간다
    body += `<g class="b3"><g class="rab"><g class="chew">${rabbit(338, gy)}</g></g></g>`;
    body += `<g class="b3">${[0.6, 1.3].map((s) => `<g class="in" style="--dx:-50px;--dy:-18px;animation-delay:${s}s">${nut(350, 268, 5)}</g>`).join('')}</g>`;
    body += at(3, 'pop', tag(392, 196, '토끼'), 0.9);
    body += ring(sx, 200, 110, 4, C.green, 0.1) + at(4, 'pop', tag(470, 90, '생산자', OK, { size: 22 }), 0.4);
    css += states(id, 'rab', 'transform', ['translateX(320px)', 'translateX(320px)', 'translateX(320px)', 'translateX(0)'], 1.4, 0);
    css += `.sc-${id} .leafglow { opacity: 0; } .on1 .sc-${id} .leafglow { animation: ${id}-flash 1.6s ease-in-out .6s both; } .on2 .sc-${id} .leafglow { animation: none; opacity: 0; transition: opacity .6s; }
      .sc-${id} .chew { transform-box: fill-box; transform-origin: 20% 80%; } .on3 .sc-${id} .chew { animation: ${id}-chew .5s ease-in-out 1.4s infinite; }
      .on4 .sc-${id} .chew { animation: none; }`;
    put('4-2/과학/2/생산자', svg(id, body, css));
  })();

  // ── 먹이 관계 타일과 화살표 ──
  const tile = (n, label, plant, size = 20) => {
    const w = n.w, h = n.h;
    const [fill, stroke] = plant ? OK : HOT;
    return `<rect x="${f(n.x - w / 2)}" y="${f(n.y - h / 2)}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + text(n.x, f(n.y + size * 0.36), label, { size });
  };
  // a 의 테두리에서 b 쪽으로 나가는 점
  const edge = (a, b, pad) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const tx = dx ? (a.w / 2 + pad) / Math.abs(dx) : Infinity, ty = dy ? (a.h / 2 + pad) / Math.abs(dy) : Infinity;
    const t = Math.min(tx, ty);
    return [a.x + dx * t, a.y + dy * t];
  };
  const link = (a, b, color, w = 4) => { const p = edge(a, b, 4), q = edge(b, a, 6); return flow([p, q], color, { w, dash: '10 7' }); };

  // ── 먹이사슬: 벼 → 메뚜기 → 개구리 → 뱀 → 매가 계단처럼 한 줄로 이어진다 ──
  (function () {
    const id = 't42-c2-sasl';
    let css = base(id);
    const names = ['벼', '메뚜기', '개구리', '뱀', '매'];
    const N = names.map((nm, i) => ({ nm, x: 64 + i * 128, y: 310 - i * 70, w: 98, h: 44 }));
    let body = '';
    const linkAt = (i, n, s) => at(n, 'fin', link(N[i], N[i + 1], C.orange), s);
    body += at(1, 'pop', tile(N[0], '벼', true), 0) + linkAt(0, 1, 0.5) + at(1, 'pop', tile(N[1], '메뚜기'), 0.8) + linkAt(1, 1, 1.3) + at(1, 'pop', tile(N[2], '개구리'), 1.6);
    body += linkAt(2, 2, 0.2) + at(2, 'pop', tile(N[3], '뱀'), 0.5) + linkAt(3, 2, 1.0) + at(2, 'pop', tile(N[4], '매'), 1.3);
    // 칸 3: 오른쪽 아래에 크게 한 쌍
    const A = { x: 430, y: 262, w: 104, h: 46 }, B = { x: 576, y: 262, w: 104, h: 46 };
    body += at(3, 'rise', tile(A, '메뚜기') + tile(B, '개구리') + solid(A.x + A.w / 2 + 6, A.y, B.x - B.w / 2 - 6, B.y, C.red, 5)
      + text(A.x, 314, '먹히는 쪽', { size: 18, color: C.muted }) + text(B.x, 314, '먹는 쪽', { size: 18, color: C.muted }), 0.2);
    body += `<g class="b3">${g('pulse pulse3', link(N[1], N[2], C.red, 5), 0.8)}</g>`;
    // 칸 4: 사슬 고리처럼 차례로 반짝인다
    N.forEach((n, i) => { body += glowRect(n.x - n.w / 2 - 5, n.y - n.h / 2 - 5, n.w + 10, n.h + 10, 4, C.green, 0.25 * i, 16); });
    body += at(4, 'pop', tag(150, 70, '먹이사슬', OK, { size: 22 }), 1.3);
    put('4-2/과학/2/먹이사슬', svg(id, body, css));
  })();

  // ── 먹이그물: 사슬 하나에 쥐·참나무 열매, 박새가 더해져 그물처럼 얽힌다 ──
  (function () {
    const id = 't42-c2-geumul';
    let css = base(id);
    const T = (x, y, w = 96) => ({ x, y, w, h: 42 });
    const P = {
      '매': T(330, 40), '개구리': T(76, 142), '뱀': T(236, 132), '박새': T(540, 150),
      '메뚜기': T(110, 232), '쥐': T(340, 232), '벼': T(196, 318), '참나무 열매': T(470, 318, 140)
    };
    const L = (a, b, color) => link(P[a], P[b], color);
    let body = '';
    const chain1 = [['벼', '메뚜기'], ['메뚜기', '개구리'], ['개구리', '뱀'], ['뱀', '매']];
    const chain2 = [['벼', '쥐'], ['참나무 열매', '쥐'], ['쥐', '뱀'], ['쥐', '매']];
    const chain3 = [['메뚜기', '박새'], ['박새', '매']];
    const lines = (list, n, color, s0) => list.map(([a, b], i) => at(n, 'fin', L(a, b, color), s0 + i * 0.3)).join('');
    body += `<g class="lk">` + lines(chain1, 1, C.orange, 0.5) + lines(chain2, 2, C.blue, 0.6) + lines(chain3, 3, C.purple, 0.5) + `</g>`;
    const tiles = (list, n, s0) => list.map((nm, i) => at(n, 'pop', tile(P[nm], nm, nm === '벼' || nm === '참나무 열매'), s0 + i * 0.25)).join('');
    body += tiles(['벼', '메뚜기', '개구리', '뱀', '매'], 1, 0) + tiles(['참나무 열매', '쥐'], 2, 0) + tiles(['박새'], 3, 0);
    body += ring(340, 232, 44, 2, C.blue, 1.8) + ring(540, 150, 44, 3, C.purple, 1.3);
    body += `<g class="b4"><g class="flash flash4">` + [...chain1, ...chain2, ...chain3].map(([a, b]) => L(a, b, C.green)).join('') + `</g></g>`;
    body += at(4, 'pop', tag(530, 52, '먹이그물', OK, { size: 22 }), 0.9);
    // 위의 반짝이는 화살표 묶음이 타일 위를 덮지 않도록 타일을 한 번 더 얹는다
    body += `<g class="b4">${Object.entries(P).map(([nm, n]) => tile(n, nm, nm === '벼' || nm === '참나무 열매')).join('')}</g>`;
    css += states(id, 'lk', 'opacity', [1, 1, 1, 1, 0.25], 0.6);
    put('4-2/과학/2/먹이그물', svg(id, body, css));
  })();

  // ════ 3단원 여러 가지 기체 ════

  // ── 기체: 둥근 병을 가득 채운 기체를 길쭉한 상자로 옮기면 상자 모양대로 퍼져 가득 채운다 ──
  (function () {
    const id = 't42-c3-giche';
    let css = base(id);
    const fx = 150, fy = 220, fr = 80;
    const flask = `<path d="M${fx - 18} 92 V${fy - fr + 6} A${fr} ${fr} 0 1 0 ${fx + 18} ${fy - fr + 6} V92" fill="white" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`
      + `<rect x="${fx - 24}" y="72" width="48" height="24" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    const bx1 = 330, bx2 = 610, by1 = 170, by2 = 300;
    const box = `<rect x="${bx1}" y="${by1}" width="${bx2 - bx1}" height="${by2 - by1}" rx="10" fill="white" stroke="${C.muted}" stroke-width="4"/>`;
    let body = `<g class="flaskG">${flask}</g>` + at(2, 'fin', box, 0);
    // 알갱이 자리: 병 안과 상자 안에 고르게
    const rnd = seeded(11);
    const inFlask = [], inBox = [];
    const cols = 7, rows = 3;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) inBox.push([bx1 + 26 + c * ((bx2 - bx1 - 52) / (cols - 1)) + (rnd() - 0.5) * 16, by1 + 26 + r * ((by2 - by1 - 52) / (rows - 1)) + (rnd() - 0.5) * 14]);
    while (inFlask.length < inBox.length) {
      const x = fx + (rnd() * 2 - 1) * 70, y = fy + (rnd() * 2 - 1) * 70;
      if (Math.hypot(x - fx, y - fy) > 64) continue;
      if (inFlask.some(([a, b]) => Math.hypot(a - x, b - y) < 22)) continue;
      inFlask.push([x, y]);
    }
    inFlask[0] = [fx, 118]; // 목에도 하나
    inBox.forEach(([x, y], i) => {
      const [ax, ay] = inFlask[i];
      body += `<g class="k${i}"><g class="jig" style="animation-delay:-${f(rnd() * 1.3)}s">${gas(x, y)}</g></g>`;
      const from = `translate(${f(ax - x)}px, ${f(ay - y)}px)`;
      css += `.sc-${id} .k${i} { transform: ${from}; transition: transform 1.6s ease-in-out ${f(0.2 + i * 0.04)}s; } .on2 .sc-${id} .k${i} { transform: none; }`;
    });
    body += `<g class="b1 h2"><path class="flash flash1" style="animation-delay:.6s" d="M${fx - 18} 96 V${fy - fr + 6} A${fr} ${fr} 0 1 0 ${fx + 18} ${fy - fr + 6} V96" fill="none" stroke="${C.purple}" stroke-width="7" stroke-linejoin="round"/></g>`;
    body += at(1, 'pop', tag(150, 336, '둥근 병'), 0.4);
    body += at(2, 'pop', tag(470, 140, '길쭉한 상자'), 1.4) + glowRect(bx1 - 8, by1 - 8, bx2 - bx1 + 16, by2 - by1 + 16, 3, C.purple, 0.1, 16);
    body += at(3, 'pop', tag(470, 336, '기체', GAS, { size: 22, dash: true }), 0.6);
    css += states(id, 'flaskG', 'opacity', [1, 1, 0.3], 1.2);
    put('4-2/과학/3/기체', svg(id, body, css));
  })();

  // ── 부피: 고무풍선을 씌운 병. 뜨거운 물에서 기체가 차지하는 공간이 커지고 얼음물에서 작아진다 ──
  (function () {
    const id = 't42-c3-bupi';
    let css = base(id);
    const cx = 290;
    // 물통(비커)
    const wx1 = 150, wx2 = 430, wy1 = 186, wy2 = 330;
    let body = '';
    // 물: 칸 2 뜨거운 물, 칸 3 얼음물
    body += `<rect class="water" x="${wx1 + 4}" y="${wy1 + 30}" width="${wx2 - wx1 - 8}" height="${wy2 - wy1 - 34}" />`;
    // 병과 그 안의 기체(옅은 보라)
    const jar = `<path d="M${cx - 22} 148 V176 Q${cx - 60} 182 ${cx - 60} 210 V300 Q${cx - 60} 316 ${cx - 44} 316 H${cx + 44} Q${cx + 60} 316 ${cx + 60} 300 V210 Q${cx + 60} 182 ${cx + 22} 176 V148 Z" fill="${C.lilac}" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
    const balloon = `<path d="M${cx - 20} 150 C${cx - 30} 120 ${cx - 58} 92 ${cx - 50} 60 C${cx - 42} 26 ${cx + 42} 26 ${cx + 50} 60 C${cx + 58} 92 ${cx + 30} 120 ${cx + 20} 150 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3.5" stroke-linejoin="round"/>`;
    body += `<g class="bal">${balloon}${gas(cx - 16, 78)}${gas(cx + 18, 92)}${gas(cx, 118)}<g class="b4"><path class="flash flash4" d="M${cx - 20} 150 C${cx - 30} 120 ${cx - 58} 92 ${cx - 50} 60 C${cx - 42} 26 ${cx + 42} 26 ${cx + 50} 60 C${cx + 58} 92 ${cx + 30} 120 ${cx + 20} 150" fill="none" stroke="${C.purple}" stroke-width="9"/></g></g>`;
    body += jar + `<rect x="${cx - 26}" y="144" width="52" height="12" rx="4" fill="${C.purple}"/>`;
    const rnd = seeded(5);
    [[cx - 30, 220], [cx + 22, 214], [cx - 6, 248], [cx + 34, 262], [cx - 36, 284], [cx + 6, 292], [cx, 190]].forEach(([x, y]) => { body += `<g class="jig" style="animation-delay:-${f(rnd())}s">${gas(x, y)}</g>`; });
    // 물 위로 비치는 앞면(옅게)
    body += `<rect class="waterTop" x="${wx1 + 4}" y="${wy1 + 30}" width="${wx2 - wx1 - 8}" height="${wy2 - wy1 - 34}" opacity=".45"/>`;
    body += `<path d="M${wx1} ${wy1} V${wy2 - 8} Q${wx1} ${wy2} ${wx1 + 8} ${wy2} H${wx2 - 8} Q${wx2} ${wy2} ${wx2} ${wy2 - 8} V${wy1}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
    // 김과 얼음
    body += `<g class="b2 h3">${[0, 0.8, 1.6].map((s, i) => `<g class="up" style="--up:-50px;animation-delay:${s}s"><path d="M${[182, 210, 390][i]} 214 q-8 -10 0 -20 q8 -10 0 -20" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join('')}</g>`;
    body += at(3, 'drop', [[178, 222], [207, 238], [396, 226]].map(([x, y]) => `<rect x="${x - 15}" y="${y - 13}" width="30" height="26" rx="6" fill="white" stroke="${C.blue}" stroke-width="3"/>`).join(''), 0.2);
    // 온도계
    body += thermo(520, 120, 280, 'tm');
    body += `<g class="b2 h3">${g('pop pop2', tag(520, 318, '뜨거운 물', HOT), 0.3)}</g>`;
    body += `<g class="b3">${g('pop pop3', tag(520, 318, '얼음물', COLD), 0.3)}</g>`;
    css += `.sc-${id} .water, .sc-${id} .waterTop { fill: ${C.sky}; transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1.2s ease-out, fill 1.2s ease-in-out; }
      .on2 .sc-${id} .water, .on2 .sc-${id} .waterTop { transform: scaleY(1); fill: ${C.peach}; }
      .on3 .sc-${id} .water, .on3 .sc-${id} .waterTop { fill: ${C.sky}; }`;
    css += `.sc-${id} .bal { transform-box: fill-box; transform-origin: 50% 100%; transform: scale(.42); transition: transform 2s ease-in-out .5s; }
      .on2 .sc-${id} .bal { transform: scale(1); }
      .on3 .sc-${id} .bal { transform: scale(.3, .22); }`;
    css += level(id, 'tm', [0.45, 0.45, 0.92, 0.12]);
    // 칸 4: 기체가 차지한 공간이 반짝이고 '부피'
    const space = `<path d="M${cx - 22} 156 V176 Q${cx - 60} 182 ${cx - 60} 210 V300 Q${cx - 60} 316 ${cx - 44} 316 H${cx + 44} Q${cx + 60} 316 ${cx + 60} 300 V210 Q${cx + 60} 182 ${cx + 22} 176 V156" fill="none" stroke="${C.purple}" stroke-width="6" stroke-linejoin="round"/>`;
    body += `<g class="b4"><g class="flash flash4">${space}</g></g>`;
    body += at(4, 'pop', tag(110, 120, '부피', GAS, { size: 22 }), 0.5) + at(4, 'fin', lead(140, 132, cx - 54, 200, C.purple), 0.5);
    put('4-2/과학/3/부피', svg(id, body, css));
  })();

  // ── 압력: 마개로 막은 주사기. 피스톤을 밀면 기체가 눌려 부피가 줄고, 당기면 늘어난다 ──
  (function () {
    const id = 't42-c3-apryeok';
    let css = base(id);
    const x0 = 124, y1 = 150, y2 = 230, P0 = 400; // 기체 왼쪽 끝, 통 위아래, 처음 피스톤 자리
    const PX = [P0, P0, 280, 448, 280];           // 칸마다 피스톤 자리
    let body = '';
    // 기체 칸(옅은 보라): 오른쪽 끝이 피스톤을 따라간다
    body += `<rect class="gasR" x="${x0}" y="${y1 + 4}" width="${P0 - x0}" height="${y2 - y1 - 8}" fill="${C.lilac}"/>`;
    // 통과 눈금, 마개
    body += `<rect x="${x0 - 4}" y="${y1}" width="${500 - x0}" height="${y2 - y1}" rx="6" fill="none" stroke="${C.muted}" stroke-width="4"/>`;
    for (let x = 150; x <= 480; x += 30) body += `<path d="M${x} ${y1} V${y1 + (x % 60 === 30 ? 12 : 7)}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<rect x="96" y="178" width="26" height="24" fill="white" stroke="${C.muted}" stroke-width="3.5"/>`;
    body += `<rect x="66" y="170" width="32" height="40" rx="8" fill="${C.ink}"/>`;
    body += text(82, 262, '마개', { size: 18, color: C.muted });
    // 기체 알갱이: 피스톤 자리에 맞춰 왼쪽 끝을 기준으로 모이고 퍼진다
    const rnd = seeded(3);
    const pts = [];
    for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) pts.push([x0 + 24 + c * 56 + (rnd() - 0.5) * 8, y1 + 25 + r * 18 + (rnd() - 0.5) * 4]);
    pts.forEach(([x, y], i) => {
      body += `<g class="k${i}"><g class="jig" style="animation-delay:-${f(rnd() * 1.3)}s">${gas(x, y, C.purple, 6.5)}</g></g>`;
      const dx = (p) => `translateX(${f((x - x0) * ((p - x0) / (P0 - x0)) - (x - x0))}px)`;
      css += states(id, `k${i}`, 'transform', PX.map(dx), 1.8, 0.3);
    });
    css += `.sc-${id} .gasR { transform-box: view-box; transform-origin: ${x0}px 0; }` + states(id, 'gasR', 'transform', PX.map((p) => `scaleX(${f((p - x0) / (P0 - x0))})`), 1.8, 0.3);
    // 피스톤(고무 머리, 막대, 손잡이)
    const piston = `<rect x="${P0}" y="${y1 + 3}" width="18" height="${y2 - y1 - 6}" rx="4" fill="${C.ink}"/>`
      + `<rect x="${P0 + 18}" y="182" width="${130}" height="16" fill="white" stroke="${C.muted}" stroke-width="3"/>`
      + `<rect x="${P0 + 146}" y="134" width="14" height="112" rx="5" fill="white" stroke="${C.muted}" stroke-width="3.5"/>`
      + text(P0 + 84, 124, '피스톤', { size: 18, color: C.muted });
    body += `<g class="pis">${piston}</g>`;
    css += states(id, 'pis', 'transform', PX.map((p) => `translateX(${p - P0}px)`), 1.8, 0.3);
    // 부피 눈금 띠
    body += `<path class="vol" d="M${x0} 266 H${P0}" stroke="${C.purple}" stroke-width="4"/><path d="M${x0} 254 V278" stroke="${C.purple}" stroke-width="4"/>`;
    body += `<g class="volEnd"><path d="M${P0} 254 V278" stroke="${C.purple}" stroke-width="4"/></g>`;
    css += `.sc-${id} .vol { transform-box: view-box; transform-origin: ${x0}px 0; }` + states(id, 'vol', 'transform', PX.map((p) => `scaleX(${f((p - x0) / (P0 - x0))})`), 1.8, 0.3);
    css += states(id, 'volEnd', 'transform', PX.map((p) => `translateX(${p - P0}px)`), 1.8, 0.3);
    body += `<g class="volT">${text((x0 + P0) / 2, 302, '부피', { size: 20, color: C.purple })}</g>`;
    css += states(id, 'volT', 'transform', PX.map((p) => `translateX(${f((p - P0) / 2)}px)`), 1.8, 0.3);
    // 미는 손 화살표, 당기는 화살표
    body += `<g class="b2 h3">${g('fin fin2', solid(PX[2] + 250, 106, PX[2] + 168, 106, C.red, 6) + text(PX[2] + 222, 86, '밂', { size: 20, color: C.red }), 0)}</g>`;
    body += `<g class="b3 h4">${g('fin fin3', solid(520, 300, 604, 300, C.blue, 6) + text(562, 334, '당김', { size: 20, color: C.blue }), 0)}</g>`;
    // 칸 4: 피스톤 면을 수직으로 누르는 화살표들
    body += at(4, 'fin', [168, 190, 212].map((y) => solid(PX[4] - 2, y, PX[4] - 28, y, C.red, 4)).join(''), 1.6);
    body += at(4, 'fin', solid(PX[4] + 250, 106, PX[4] + 168, 106, C.red, 6), 0.2);
    body += at(4, 'pop', tag(560, 50, '압력', HOT, { size: 22 }), 1.9);
    put('4-2/과학/3/압력', svg(id, body, css));
  })();

  // ════ 4단원 기후변화와 우리 생활 ════

  // ── 기후: 날마다 바뀌는 날씨를 30년 모아 평균을 내면 그 지역의 기후(여름 덥고 비 많음, 겨울 춥고 건조) ──
  (function () {
    const id = 't42-c4-gihu';
    let css = base(id);
    const rainCloud = (x, y, s = 0.5) => cloud(x, y, s, C.sky) + [-14, 0, 14].map((d) => `<path d="M${x + d} ${y + 6} l-5 12" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>`).join('');
    const icon = (k, x, y) => (k === 0 ? sunSmall(x, y - 12, 15) : k === 1 ? cloud(x, y, 0.5) : rainCloud(x, y - 6, 0.5));
    const week = [0, 0, 1, 2, 0, 1, 2];
    let body = '';
    // 칸 1: 이레 동안의 날씨
    body += `<g class="b1 h2">${week.map((k, i) => g('pop pop1', icon(k, 74 + i * 82, 110) + text(74 + i * 82, 158, `${i + 1}일`, { size: 18, color: C.muted }), i * 0.22)).join('')}`
      + g('pop pop1', tag(320, 236, '날씨'), 1.6) + `</g>`;
    // 칸 2: 30년 × 12달 날씨 칸(여름은 비, 겨울은 맑음이 많다)
    const gx = 80, gy = 44, cw = 21, ch = 8.4, rnd = seeded(29);
    const rainP = [0.08, 0.1, 0.18, 0.22, 0.28, 0.45, 0.7, 0.65, 0.35, 0.18, 0.16, 0.1];
    const cloudP = [0.25, 0.25, 0.3, 0.3, 0.3, 0.3, 0.2, 0.2, 0.3, 0.25, 0.3, 0.28];
    let grid = '';
    for (let r = 0; r < 30; r++) {
      let row = '';
      for (let m = 0; m < 12; m++) {
        const u = rnd(), k = u < rainP[m] ? 2 : u < rainP[m] + cloudP[m] ? 1 : 0;
        row += `<rect x="${f(gx + m * cw)}" y="${f(gy + r * ch)}" width="${cw - 2}" height="${f(ch - 1.6)}" rx="1.5" fill="${[C.yellow, C.line, C.blue][k]}"/>`;
      }
      grid += g('fin fin2', row, f(0.1 + r * 0.045));
    }
    body += `<g class="b2">${grid}</g>`;
    body += at(2, 'fin', `<path d="M${gx - 12} ${gy} H${gx - 20} V${f(gy + 30 * ch - 1.6)} H${gx - 12}" stroke="${C.muted}" stroke-width="3" fill="none"/>` + text(34, f(gy + 15 * ch + 7), '30년', { size: 20 }), 1.2);
    body += at(2, 'fin', text(gx + cw * 0.5 - 1, 334, '1월', { size: 18, color: C.muted }) + text(gx + cw * 6.5 - 1, 334, '7월', { size: 18, color: C.muted }) + text(gx + cw * 11.5 - 1, 334, '12월', { size: 18, color: C.muted }), 0.2);
    // 칸 2: 칸 색이 뜻하는 날씨
    const mini = (k, x, y) => (k === 0 ? sunSmall(x, y - 8, 10) : cloud(x, y, 0.38, k === 2 ? C.sky : 'white') + (k === 2 ? [-10, 2, 14].map((d) => `<path d="M${x + d} ${y + 5} l-4 9" stroke="${C.blue}" stroke-width="2.5" stroke-linecap="round"/>`).join('') : ''));
    body += `<g class="b2 h4">${g('fin fin2', [0, 1, 2].map((k, i) => `<rect x="${384 + i * 84}" y="38" width="18" height="14" rx="2" fill="${[C.yellow, C.line, C.blue][k]}"/>` + mini(k, 384 + i * 84 + 50, 56)).join(''), 0.3)}</g>`;
    // 칸 3: 평균을 내 여름과 겨울
    body += at(3, 'fin', flow([[gx + 12 * cw + 6, 196], [404, 196]], C.muted, { w: 4 }) + text(f((gx + 12 * cw + 404) / 2), 180, '평균', { size: 18, color: C.muted }), 0);
    const panel = (x, label, colors, drops, cls) => `<rect x="${x}" y="104" width="104" height="228" rx="14" fill="white" stroke="${colors[1]}" stroke-width="3"/>`
      + tag(x + 52, 132, label, colors) + thermo(x + 28, 166, 286, cls)
      + Array.from({ length: drops }, (_, i) => drop(x + 72 + (i % 2) * 18, 190 + Math.floor(i / 2) * 34, 8)).join('');
    body += at(3, 'rise', panel(412, '여름', HOT, 6, 'tmS'), 0.4) + at(3, 'rise', panel(526, '겨울', COLD, 1, 'tmW'), 0.8);
    css += level(id, 'tmS', [0.2, 0.2, 0.2, 0.92]) + level(id, 'tmW', [0.2, 0.2, 0.2, 0.15]);
    body += glowRect(406, 98, 230, 240, 4, C.green, 0.1, 18) + at(4, 'pop', tag(520, 52, '기후', OK, { size: 22 }), 0.5);
    put('4-2/과학/4/기후', svg(id, body, css));
  })();

  // ── 평년: 지난 30년 동안의 8월 기온 막대와 그 평균 선. 올해 막대가 평년 선보다 높다 ──
  (function () {
    const id = 't42-c4-pyeongnyeon';
    let css = base(id);
    // 세로축은 0 ℃에서 시작하고, 0 ℃와 23 ℃ 사이는 물결선으로 줄였다(막대 차이가 부풀어 보이지 않게 줄였음을 보인다)
    const base0 = 300, Y = (t) => 276 - (t - 23) * 47;
    const rnd = seeded(41);
    const temps = Array.from({ length: 30 }, () => 24.6 + rnd() * 2.2);
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    const thisYear = 27.9;
    let body = '';
    // 눈금
    [24, 26, 28].forEach((t) => { body += `<path d="M78 ${f(Y(t))} H600" stroke="${C.line}" stroke-width="2"/>` + text(70, f(Y(t) + 7), `${t} ℃`, { size: 18, color: C.muted, anchor: 'end' }); });
    body += `<path d="M78 ${base0} H600" stroke="${C.ink}" stroke-width="3"/><path d="M78 ${base0} V28" stroke="${C.ink}" stroke-width="3"/>` + text(70, base0 + 7, '0 ℃', { size: 18, color: C.muted, anchor: 'end' });
    // 30년 막대
    let bars = '';
    temps.forEach((t, i) => {
      const x = 86 + i * 14;
      bars += `<g class="b1"><rect class="bar fin1" style="animation-delay:${f(i * 0.04)}s" x="${x}" y="${f(Y(t))}" width="11" height="${f(base0 - Y(t))}" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/></g>`;
    });
    body += bars;
    body += at(1, 'fin', `<path d="M86 316 V324 H503 V316" stroke="${C.muted}" stroke-width="2.5" fill="none"/>` + text(294, 348, '지난 30년', { size: 18, color: C.muted }), 1.2);
    // 칸 2: 평균 선(평년)
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M78 ${f(Y(avg))} H600" stroke="${C.green}" stroke-width="4" stroke-dasharray="1" /></g>`;
    body += at(2, 'pop', tag(598, f(Y(avg) + 28), '평년'), 1.6);
    // 칸 3: 올해 막대
    body += `<g class="b3"><rect class="tall" x="522" y="${f(Y(thisYear))}" width="30" height="${f(base0 - Y(thisYear))}" rx="3" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/></g>`;
    // 물결선: 축과 막대를 가로질러 0 ℃~23 ℃ 사이를 줄였음을 보인다(막대보다 위에 그린다)
    const zig = (y, back = false) => { let d = ''; for (let x = 72; x < 600; x += 16) d += back ? ' q-4 5 -8 0 t-8 0' : ' q4 -5 8 0 t8 0'; return d; };
    const yA = 282, yB = 292;
    body += `<g class="b1">${g('fin fin1', `<path d="M72 ${yA}${zig(yA)} V${yB}${zig(yB, true)} Z" fill="${C.paper}"/>`
      + `<path d="M72 ${yA}${zig(yA)}" stroke="${C.ink}" stroke-width="2.5" fill="none"/><path d="M72 ${yB}${zig(yB)}" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`, 0.9)}</g>`;
    body += at(3, 'fin', text(537, 324, '올해', { size: 18, color: C.red }), 0.2);
    body += at(3, 'fin', solid(572, f(Y(avg) - 4), 572, f(Y(thisYear) + 4), C.red, 4) + `<path d="M564 ${f(Y(thisYear))} H580" stroke="${C.red}" stroke-width="3"/>`, 1.6);
    body += `<g class="b4"><path class="flash flash4" d="M78 ${f(Y(avg))} H600" stroke="${C.yellow}" stroke-width="12" opacity=".8"/></g>`;
    body += `<g class="b4"><path d="M78 ${f(Y(avg))} H600" stroke="${C.green}" stroke-width="4"/></g>` + `<g class="b4">${g('pulse pulse4', tag(598, f(Y(avg) + 28), '평년'), 0.3)}</g>`;
    css += `.sc-${id} .bar, .sc-${id} .tall { transform-box: fill-box; transform-origin: 50% 100%; }
      .sc-${id} .tall { transform: scaleY(0); transition: transform 1.4s ease-out .2s; } .on3 .sc-${id} .tall { transform: scaleY(1); }
      @keyframes ${id}-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      .on1 .sc-${id} .bar { animation-name: ${id}-grow; animation-duration: .5s; }`;
    put('4-2/과학/4/평년', svg(id, body, css));
  })();

  // ── 해수면: 바닷가 마을 단면. 빙하가 녹은 물이 바다로 흘러 바닷물의 표면이 높아져 집이 잠긴다 ──
  (function () {
    const id = 't42-c4-haesumyeon';
    let css = base(id);
    const L0 = 252, L1 = 196; // 처음 해수면, 높아진 해수면
    // 땅 겉면: 바다 밑 → 비탈 → 산
    const floor = [[0, 342], [270, 332], [530, 186], [560, 160], [604, 62], [640, 92]];
    const landD = 'M' + floor.map(([x, y]) => `${x} ${y}`).join(' L') + ' L640 360 L0 360 Z';
    const basinD = 'M0 0 L0 342 ' + floor.slice(1).map(([x, y]) => `L${x} ${y}`).join(' ') + ' L640 0 Z';
    let body = `<defs><clipPath id="${id}-c"><path d="${basinD}"/></clipPath></defs>`;
    body += `<path d="${landD}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    const slopeY = (x) => 332 - (x - 270) * (146 / 260);
    // 빙하(칸 2에 줄어든다)
    body += `<g class="ice"><path d="M574 128 L604 62 L640 92 L640 118 Q624 126 612 116 Q598 132 586 124 Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/></g>`;
    // 집과 나무
    const hx = 452, hy = slopeY(hx);
    body += `<rect x="${hx - 26}" y="${f(hy - 40)}" width="52" height="40" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M${hx - 34} ${f(hy - 38)} L${hx} ${f(hy - 70)} L${hx + 34} ${f(hy - 38)} Z" fill="${C.red}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><rect x="${hx - 8}" y="${f(hy - 22)}" width="16" height="22" fill="${C.sky}" stroke="${C.ink}" stroke-width="2"/>`;
    const tx = 512, ty = slopeY(tx);
    body += `<rect x="${tx - 5}" y="${f(ty - 36)}" width="10" height="36" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="${tx}" cy="${f(ty - 52)}" r="22" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    // 칸 2: 빙하가 녹은 물이 비탈을 따라 바다로(바다 밑에 그려 물에 잠긴 곳은 옅게 보인다)
    body += at(2, 'fin', `<path class="mar" d="M588 128 L560 164 L532 194 Q480 220 ${f(270 + (332 - L0) * 260 / 146)} ${L0 - 6}" stroke="${C.blue}" stroke-width="4" stroke-dasharray="10 8" fill="none" stroke-linecap="round"/>`
      + `<g class="up" style="--up:40px">${drop(560, 150, 6)}</g>`, 0.2);
    // 바다(물높이가 칸 3에 오른다)
    const wave = (y) => { let d = `M-40 ${y}`; for (let x = -40; x < 680; x += 40) d += ` q10 -6 20 0 t20 0`; return d; };
    body += `<g clip-path="url(#${id}-c)"><g class="sea"><rect x="-40" y="${L0}" width="720" height="${360 - L0 + 80}" fill="${C.sky}" opacity=".88"/><path class="surf" d="${wave(L0)}" stroke="${C.blue}" stroke-width="4" fill="none"/></g></g>`;
    // 처음 높이 표시
    body += at(1, 'fin', `<path d="M16 ${L0} H360" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 6"/>` + text(20, L0 + 30, '처음 높이', { size: 18, color: C.ink, anchor: 'start' }), 1.0);
    body += `<g class="seaTag">${at(1, 'pop', tag(200, L0 - 26, '해수면', COLD), 0.4)}</g>`;
    body += at(2, 'pop', tag(530, 40, '빙하', COLD), 0.3);
    // 칸 3: 물높이가 오른 만큼 화살표
    body += at(3, 'fin', solid(300, L0 - 4, 300, L1 + 6, C.red, 4), 1.4);
    body += `<g class="b4"><g class="flash flash4"><path d="${wave(L1)}" stroke="${C.yellow}" stroke-width="12" fill="none" opacity=".8" clip-path="url(#${id}-c)"/></g></g>`;
    css += states(id, 'sea', 'transform', [0, 0, 0, L1 - L0].map((d) => `translateY(${d}px)`), 2.2, 0.4);
    css += states(id, 'seaTag', 'transform', [0, 0, 0, L1 - L0].map((d) => `translateY(${d}px)`), 2.2, 0.4);
    css += `.sc-${id} .ice { transform-box: fill-box; transform-origin: 70% 0; transition: transform 2s ease-in-out .4s; } .on2 .sc-${id} .ice { transform: scale(.55); }
      .sc-${id} .surf { animation: ${id}-wave 2s linear infinite; } @keyframes ${id}-wave { from { transform: translateX(0); } to { transform: translateX(40px); } }`;
    put('4-2/과학/4/해수면', svg(id, body, css));
  })();

  // ── 상승: 해마다 잰 해수면 높이를 이은 선이 오른쪽으로 갈수록 올라간다. 옆 눈금 기둥의 물도 오른다 ──
  (function () {
    const id = 't42-c4-sangseung';
    let css = base(id);
    const ax0 = 84, ax1 = 452, ay0 = 300, ay1 = 60;
    const years = 31, X = (i) => ax0 + 14 + i * ((ax1 - ax0 - 28) / (years - 1));
    const rnd = seeded(17);
    const vals = Array.from({ length: years }, (_, i) => 0.12 + i * 0.024 + (rnd() - 0.5) * 0.07);
    const Yv = (v) => ay0 - v * (ay0 - ay1);
    let body = `<path d="M${ax0} ${ay1 - 10} V${ay0} H${ax1 + 10}" stroke="${C.ink}" stroke-width="3" fill="none"/>`;
    body += text(ax0 + 4, ay1 - 22, '해수면 높이', { size: 18, color: C.muted, anchor: 'start' });
    [0, 10, 20, 30].forEach((i) => { body += `<path d="M${f(X(i))} ${ay0} V${ay0 + 8}" stroke="${C.ink}" stroke-width="2"/>` + text(f(X(i)), ay0 + 32, 1990 + i, { size: 18, color: C.muted }); });
    const d = 'M' + vals.map((v, i) => `${f(X(i))} ${f(Yv(v))}`).join(' L');
    body += `<g class="b1"><path class="draw draw1" pathLength="1" d="${d}" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linejoin="round"/></g>`;
    body += `<g class="b1">${vals.map((v, i) => (i % 3 === 0 ? g('pop pop1', `<circle cx="${f(X(i))}" cy="${f(Yv(v))}" r="5" fill="${C.blue}"/>`, f(0.2 + i * 0.05)) : '')).join('')}</g>`;
    // 칸 2: 처음 높이 점선과 오른쪽 끝까지 오른 만큼 화살표
    const v0 = Yv(vals[0]), vN = Yv(vals[years - 1]);
    body += at(2, 'fin', `<path d="M${f(X(0))} ${f(v0)} H${ax1}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.1);
    body += at(2, 'fin', solid(ax1 - 6, f(v0 - 4), ax1 - 6, f(vN - 2), C.red, 5), 0.8);
    body += `<g class="b2"><circle class="ring ring2" cx="${f(X(years - 1))}" cy="${f(vN)}" r="12" fill="none" stroke="${C.red}" stroke-width="4" style="animation-delay:1.4s"/></g>`;
    // 오른쪽 눈금 기둥(바닷물 높이)
    const gx1 = 520, gx2 = 600, gy1 = 70, gy2 = 300;
    body += `<rect class="tank" x="${gx1 + 3}" y="${gy1}" width="${gx2 - gx1 - 6}" height="${gy2 - gy1 - 3}" fill="${C.sky}"/>`;
    body += `<rect x="${gx1}" y="${gy1}" width="${gx2 - gx1}" height="${gy2 - gy1}" rx="6" fill="none" stroke="${C.muted}" stroke-width="4"/>`;
    for (let y = gy1 + 20; y < gy2; y += 20) body += `<path d="M${gx2 - 4} ${y} H${gx2 - (y % 40 === 30 ? 26 : 16)}" stroke="${C.ink}" stroke-width="2"/>`;
    body += text((gx1 + gx2) / 2, gy2 + 32, '바닷물', { size: 18, color: C.muted });
    css += `.sc-${id} .tank { transform-box: fill-box; transform-origin: 50% 100%; }` + states(id, 'tank', 'transform', ['scaleY(.25)', 'scaleY(.25)', 'scaleY(.8)', 'scaleY(.8)'], 2, 0.6);
    body += at(2, 'fin', solid(gx1 - 18, 230, gx1 - 18, 120, C.red, 5), 1.2);
    // 칸 3
    body += `<g class="b3"><path class="flash flash3" d="${d}" stroke="${C.yellow}" stroke-width="12" fill="none" opacity=".75" stroke-linejoin="round"/></g>`;
    body += `<g class="b3"><path d="${d}" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linejoin="round"/></g>`;
    body += at(3, 'pop', tag(250, 110, '상승', HOT, { size: 22 }), 0.6);
    put('4-2/과학/4/상승', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
