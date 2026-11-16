// 과학 중1-2(7-2) Ⅶ단원 「태양계」 낱말 도식(2): 겉보기 운동·천구·연주 운동, 달의 위상, 일식·월식, 우주 기상./n// 위에서 내려다본 그림은 북쪽 위에서 본 것이라 지구의 자전·공전과 달의 공전이 모두 시계 반대 방향이다. 햇빛은 오른쪽에서 온다.
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
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.34 : /[+−=×÷]/.test(c) ? 0.78 : 0.62), 0) * size;
  const HOT = [C.peach, C.red], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple], KEY = [C.peach, C.red];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  // 힘 화살표: 굵은 줄 + 채운 머리. (x1, y1) 이 작용점
  const farrow = (x1, y1, x2, y2, color = C.red, w = 7) => {
    const a = Math.atan2(y2 - y1, x2 - x1), hl = w * 2.5, hw = w * 1.5;
    const bx = x2 - hl * Math.cos(a), by = y2 - hl * Math.sin(a), px = -Math.sin(a) * hw, py = Math.cos(a) * hw;
    return `<path d="M${f(x1)} ${f(y1)} L${f(bx)} ${f(by)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`
      + `<path d="M${f(x2)} ${f(y2)} L${f(bx + px)} ${f(by + py)} L${f(bx - px)} ${f(by - py)} Z" fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`;
  };
  // 칸 n 에 작용점에서 자라나는 힘 화살표
  const grow = (n, x1, y1, x2, y2, color = C.red, w = 7, s = 0) => `<g class="b${n}"><g class="gr gr${n}" style="transform-origin:${f(x1)}px ${f(y1)}px${s ? `;animation-delay:${s}s` : ''}">${farrow(x1, y1, x2, y2, color, w)}</g></g>`;
  const st = (o) => ` style="${Object.entries(o).map(([k, v]) => `${k}:${v}`).join(';')}"`;
  // 칸마다 transform 을 바꾸는 이음(transition). vals[0] 은 처음, vals[k] 는 칸 k(null 은 그대로)
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`)).join('');

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .gr { transform-box: view-box; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .jig { animation: ${id}-jig 1.6s ease-in-out infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-46px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-grow { from { opacity: 0; transform: scale(0); } 30% { opacity: 1; } to { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s ease-in-out .2s both; }
    .on${n} .sc-${id} .gr${n} { animation: ${id}-grow .8s ease-out both; }`;
    return s;
  };

  // ── 공통 그림 ──
  const floor = (x1, x2, y) => `<path d="M${x1} ${y} H${x2}" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`
    + Array.from({ length: Math.floor((x2 - x1) / 24) }, (_, k) => `<path d="M${x1 + 12 + k * 24} ${y + 2} l-10 12" stroke="${C.line}" stroke-width="2.5"/>`).join('');
  const box = (x, y, w, h, [fill, stroke] = [C.peach, C.orange]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
    + `<path d="M${x + 10} ${y + 10} L${x + w - 10} ${y + h - 10} M${x + w - 10} ${y + 10} L${x + 10} ${y + h - 10}" stroke="${stroke}" stroke-width="2" opacity=".35"/>`;
  const dot = (x, y, color = C.ink, r = 7) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${color}" stroke="white" stroke-width="2.5"/>`;

  const rad = (a) => (a * Math.PI) / 180;
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  const earth = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
  const star = (x, y, r = 7, color = C.yellow, stroke = C.orange) => {
    let d = '';
    for (let k = 0; k < 10; k++) { const a = rad(-90 + k * 36), rr = k % 2 ? r * 0.45 : r; d += `${k ? 'L' : 'M'}${f(x + rr * Math.cos(a))} ${f(y + rr * Math.sin(a))} `; }
    return `<path d="${d}Z" fill="${color}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>`;
  };
  // 달 모양(지구에서 본 모습): new 삭, first 상현, full 망, last 하현
  const moonFace = (cx, cy, r, ph) => {
    const dark = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.line}" stroke="${C.muted}" stroke-width="2"${ph === 'new' ? ' stroke-dasharray="4 4" fill-opacity=".5"' : ''}/>`;
    if (ph === 'new') return dark;
    if (ph === 'full') return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
    const sweep = ph === 'first' ? 1 : 0;
    return dark + `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 ${sweep} ${cx} ${cy + r} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
  };
  // 우주에서 본 달: 햇빛이 오는 오른쪽 반이 밝다
  const moonLit = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.muted}" stroke="${C.ink}" stroke-width="2"/><path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;
  const sunlight = (x1, x2, ys, n = 1, s = 0) => ys.map((y, k) => grow(n, x1, y, x2, y, C.orange, 4, f(s + k * 0.15))).join('');
  const base4 = (id) => base(id) + `
    .sc-${id} .rays { transform-box: fill-box; transform-origin: center; animation: ${id}-pulse 2.4s ease-in-out infinite; }`;

  // ════ 7단원 태양계 — 지구와 달의 운동 ════

  // ── 겉보기 운동: 지구가 도는데, 땅에서는 해가 동쪽에서 서쪽으로 움직이는 것처럼 보인다 ──
  (function () {
    const id = 't72-s7-geot';
    let css = base4(id);
    const ex = 150, ey = 190, er = 72;
    let body = earth(ex, ey, er) + `<circle cx="${ex}" cy="${ey}" r="5" fill="${C.ink}"/>`;
    body += `<g class="spin"><circle cx="${ex}" cy="${ey}" r="${er - 22}" fill="none" stroke="${C.blue}" stroke-width="2" stroke-dasharray="6 8" opacity=".6"/></g><g class="pp"><circle cx="${ex}" cy="${ey + er}" r="9" fill="${C.orange}" stroke="white" stroke-width="2.5"/></g>`;
    body += at(1, 'fin', `<path d="M${ex} ${ey - er} A${er} ${er} 0 0 0 ${ex} ${ey + er} Z" fill="${C.ink}" fill-opacity=".18"/>`, 0.2);
    css += `.sc-${id} .pp { transform-box: view-box; transform-origin: ${ex}px ${ey}px; }
      @keyframes ${id}-pp1 { 0% { transform: rotate(0deg); opacity: 0; } 8% { opacity: 1; } 90% { opacity: 1; } 100% { transform: rotate(-180deg); opacity: 0; } }
      @keyframes ${id}-pp2 { 0% { transform: rotate(0deg); opacity: 0; } 8% { opacity: 1; } 90% { opacity: 1; } 100% { transform: rotate(-180deg); opacity: 0; } }
      .on1 .sc-${id} .pp { animation: ${id}-pp1 3s linear .4s infinite; }
      .on2 .sc-${id} .pp { animation: ${id}-pp2 3s linear .4s infinite; }`;
    css += `.sc-${id} .spin { transform-box: view-box; transform-origin: ${ex}px ${ey}px; animation: ${id}-spin 6s linear infinite; } @keyframes ${id}-spin { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }`;
    // 도는 쪽 화살표(시계 반대 방향)
    const ar = er + 18, a1 = rad(200), a2 = rad(120);
    // 위쪽(120°)에서 왼쪽을 지나 아래쪽(200°)으로 — 화면에서 시계 반대 방향. 머리는 200° 끝에 접선 방향으로
    const hx2 = ex + ar * Math.cos(a1), hy2 = ey - ar * Math.sin(a1), tdx = -Math.sin(a1), tdy = -Math.cos(a1), nx = -tdy, ny = tdx;
    body += `<path d="M${f(ex + ar * Math.cos(a2))} ${f(ey - ar * Math.sin(a2))} A${ar} ${ar} 0 0 0 ${f(hx2)} ${f(hy2)}" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>`;
    body += `<path d="M${f(hx2 - tdx * 13 + nx * 8)} ${f(hy2 - tdy * 13 + ny * 8)} L${f(hx2)} ${f(hy2)} L${f(hx2 - tdx * 13 - nx * 8)} ${f(hy2 - tdy * 13 - ny * 8)}" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    body += sunIcon(318, ey, 20) + sunlight(290, 236, [150, 230], 1, 0.2);
    body += at(1, 'pop', tag(ex, 46, '지구', COLD, { size: 18 }), 0.4);
    // 칸 2: 땅에서 본 하늘
    const hx = 495, hy = 270, R = 100;
    let sky = `<rect x="370" y="50" width="250" height="270" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/><rect x="372" y="${hy}" width="246" height="48" rx="12" fill="${C.mint}"/><path d="M372 ${hy} H618" stroke="${C.green}" stroke-width="3"/>`;
    sky += `<path d="M${hx - R} ${hy} A${R} ${R} 0 0 1 ${hx + R} ${hy}" fill="none" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="6 6"/>`;
    sky += text(hx - R, hy + 34, '동', { size: 20 }) + text(hx, hy + 34, '남', { size: 20 }) + text(hx + R, hy + 34, '서', { size: 20 });
    sky += `<circle cx="${hx}" cy="${hy - 24}" r="7" fill="${C.ink}"/><path d="M${hx - 8} ${hy} V${hy - 10} Q${hx - 8} ${hy - 16} ${hx} ${hy - 16} Q${hx + 8} ${hy - 16} ${hx + 8} ${hy - 10} V${hy} Z" fill="${C.ink}"/>`;
    sky += `<path d="M${hx + R - 8} ${hy - 16} L${hx + R} ${hy - 3} L${hx + R + 8} ${hy - 16}" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    sky += `<g class="sun"><g>${sunIcon(hx, hy - R, 15)}</g></g>`;
    body += at(2, 'fin', sky, 0) + at(2, 'fin', `<path d="M${ex} ${ey + er + 10} L370 300" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 5"/>`, 0.3);
    css += `.sc-${id} .sun { transform-box: view-box; transform-origin: ${hx}px ${hy}px; transform: rotate(-90deg); }
      @keyframes ${id}-sweep { 0% { transform: rotate(-90deg); opacity: 0; } 8% { opacity: 1; } 90% { opacity: 1; } 100% { transform: rotate(90deg); opacity: 0; } }
      .on2 .sc-${id} .sun { animation: ${id}-sweep 3s linear .4s infinite; }`;
    body += at(3, 'pop', tag(495, 30, '겉보기 운동', KEY, { size: 22 }), 0.5);
    put('7-2/과학/7/겉보기 운동', svg(id, body, css));
  })();

  // ── 일주 운동: 북쪽 하늘의 별이 북극성을 중심으로 한 시간에 15°씩, 하루에 한 바퀴 도는 것처럼 보인다 ──
  (function () {
    const id = 't72-s7-iljoo';
    let css = base4(id);
    const cx = 320, cy = 150, hy = 300;
    let body = `<defs><clipPath id="${id}-sky"><rect x="0" y="0" width="640" height="${hy}"/></clipPath></defs>`;
    const stars = [[60, 20], [92, 150], [118, 250], [140, 75], [76, 300], [128, 190], [150, 330]];
    let trails = '', dots = '';
    stars.forEach(([r, a], k) => {
      const x = cx + r * Math.cos(rad(a)), y = cy + r * Math.sin(rad(a)), x2 = cx + r * Math.cos(rad(a - 45)), y2 = cy + r * Math.sin(rad(a - 45));
      trails += `<path class="draw draw2" pathLength="1" d="M${f(x)} ${f(y)} A${r} ${r} 0 0 0 ${f(x2)} ${f(y2)}" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`;
      dots += star(f(x), f(y), 9);
    });
    body += `<g clip-path="url(#${id}-sky)"><g class="b2">${trails}</g><g class="sky">${dots}</g></g>`;
    css += `.sc-${id} .sky { transform-box: view-box; transform-origin: ${cx}px ${cy}px; transition: transform 1.6s ease-in-out .2s; }
      .on2 .sc-${id} .sky { transform: rotate(-45deg); }
      @keyframes ${id}-spin { from { transform: rotate(-45deg); } to { transform: rotate(-405deg); } }
      .on3 .sc-${id} .sky { animation: ${id}-spin 7s linear .3s infinite; }
      .on2 .sc-${id} .draw2 { animation-duration: 1.6s; }`;
    body += `<rect x="0" y="${hy}" width="640" height="${360 - hy}" fill="${C.mint}"/><path d="M0 ${hy} H640" stroke="${C.green}" stroke-width="3"/>` + text(cx, hy + 40, '북', { size: 22 });
    body += star(cx, cy, 13, C.yellow, C.red) + at(1, 'pop', tag(cx + 70, cy - 10, '북극성', HOT, { size: 18 }), 0.4);
    body += at(2, 'pop', tag(110, 40, '1시간에 15°', OK, { size: 18 }), 1.6);
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M${cx + 190} ${cy + 40} A195 195 0 0 0 ${cx + 150} ${cy - 120}" fill="none" stroke="${C.green}" stroke-width="4"/></g>` + at(2, 'fin', `<path d="M${cx + 138} ${cy - 108} L${cx + 150} ${cy - 120} L${cx + 154} ${cy - 104}" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`, 1.4);
    body += at(3, 'pop', tag(530, 40, '하루에 한 바퀴', OK, { size: 18 }), 0.4) + at(3, 'pop', tag(530, 330, '일주 운동', KEY, { size: 24 }), 0.8);
    put('7-2/과학/7/일주 운동', svg(id, body, css));
  })();

  // ── 천구: 지구를 가운데 두고 하늘을 아주 큰 공의 안쪽 면처럼 생각한 둥근 하늘 ──
  (function () {
    const id = 't72-s7-cheon';
    let css = base4(id);
    const cx = 320, cy = 180, R = 150, ry = 40;
    let body = '';
    body += `<g class="b2"><circle class="pop pop2" cx="${cx}" cy="${cy}" r="${R}" fill="${C.sky}" fill-opacity=".35" stroke="${C.blue}" stroke-width="3"/></g>`;
    body += drawPath(`M${cx - R} ${cy} A${R} ${ry} 0 0 0 ${cx + R} ${cy}`, 2, C.blue, 2, 0.5, ' stroke-dasharray="6 6" opacity=".6"') + drawPath(`M${cx - R} ${cy} A${R} ${ry} 0 0 1 ${cx + R} ${cy}`, 2, C.blue, 2.5, 0.5);
    body += `<path d="M${cx} ${cy - R - 30} V${cy + R + 20}" stroke="${C.red}" stroke-width="3" stroke-dasharray="7 6"/>` + earth(cx, cy, 26);
    body += at(1, 'pop', tag(cx + 70, cy + 6, '지구', COLD, { size: 18 }), 0.3);
    const fixed = [[-110, -70], [-60, -120], [40, -110], [100, -80], [-130, 30], [120, 40], [-40, 100], [70, 110]];
    fixed.forEach(([dx, dy], k) => { body += at(2, 'pop', star(cx + dx, cy + dy, 8), f(0.6 + k * 0.1)); });
    // 칸 3: 별이 동쪽에서 서쪽으로(앞면 오른쪽→왼쪽) 지나간다
    let mv = '';
    [[-70, 0.6], [-20, 0.95], [40, 0.8]].forEach(([dy, s], k) => {
      const y = cy + dy, rx = Math.sqrt(R * R - dy * dy) - 4, rr = rx * 0.27;
      const p = `M${f(cx + rx)} ${f(y)} A${f(rx)} ${f(rr)} 0 0 1 ${f(cx - rx)} ${f(y)}`;
      for (let j = 0; j < 2; j++) mv += `<g opacity="0">${star(0, 0, 8, C.yellow, C.red)}<animateMotion dur="5s" begin="${f(-j * 2.5 - k * 0.8)}s" repeatCount="indefinite" path="${p}"/><animate attributeName="opacity" dur="5s" begin="${f(-j * 2.5 - k * 0.8)}s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;.15;.85;1"/></g>`;
    });
    body += `<g class="b3">${mv}</g>`;
    body += at(3, 'pop', tag(560, 50, '천구', KEY, { size: 26 }), 0.4) + at(3, 'fin', lead(540, 66, 440, 96, C.blue), 0.6);
    put('7-2/과학/7/천구', svg(id, body, css));
  })();

  // ── 연주 운동·황도에 같이 쓰는 그림: 가운데 태양, 지구 공전 궤도, 둘레의 별자리 ──
  const YC = [320, 180], YR = 95, RING = 152;
  const ringPt = (phi, r = RING) => [YC[0] + r * Math.cos(rad(phi)), YC[1] - r * Math.sin(rad(phi))];
  const cluster = (x, y, s = 1) => [[-12, -6], [0, 6], [12, -4], [6, 14]].map(([dx, dy]) => `<circle cx="${f(x + dx * s)}" cy="${f(y + dy * s)}" r="${f(3.5 * s)}" fill="${C.purple}"/>`).join('')
    + `<path d="M${f(x - 12 * s)} ${f(y - 6 * s)} L${x} ${f(y + 6 * s)} L${f(x + 12 * s)} ${f(y - 4 * s)} M${x} ${f(y + 6 * s)} L${f(x + 6 * s)} ${f(y + 14 * s)}" stroke="${C.purple}" stroke-width="1.5" opacity=".6"/>`;
  // 지구와 시선(지구 → 태양 → 둘레): 지구는 phi=270 자리(아래)
  const earthLine = () => { const [ex, ey] = ringPt(270, YR), [gx, gy] = ringPt(90); return `<path d="M${f(ex)} ${f(ey)} L${f(gx)} ${f(gy + 14)}" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="6 6"/><circle cx="${f(gx)}" cy="${f(gy)}" r="15" fill="${C.yellow}" fill-opacity=".55" stroke="${C.orange}" stroke-width="2" stroke-dasharray="4 3"/>` + earth(f(ex), f(ey), 13); };

  // ── 연주 운동: 지구가 공전하면 태양이 별자리 사이를 서쪽에서 동쪽으로 옮겨 가는 것처럼 보인다 ──
  (function () {
    const id = 't72-s7-yeonju';
    let css = base4(id);
    let body = `<circle cx="${YC[0]}" cy="${YC[1]}" r="${YR}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/>`;
    const names = [[90, '쌍둥이자리', 96, 0], [180, '처녀자리', 0, 44], [270, '궁수자리', 86, 6], [0, '물고기자리', 0, 44]];
    names.forEach(([phi, name, dx, dy]) => { const [x, y] = ringPt(phi); body += cluster(f(x), f(y)) + text(f(x + dx), f(y + dy), name, { size: 18, color: C.purple }); });
    body += `<g class="eg">${earthLine()}</g>` + sunIcon(YC[0], YC[1], 22);
    css += `.sc-${id} .eg { transform-box: view-box; transform-origin: ${YC[0]}px ${YC[1]}px; transition: transform 2.2s ease-in-out .3s; } .on2 .sc-${id} .eg { transform: rotate(-90deg); }`;
    body += `<g class="b1 h2">${g('fin fin1', tag(100, 316, '지구', COLD, { size: 18 }) + lead(140, 312, 300, 276, C.blue), 0.3)}</g>`;
    body += `<g class="b1 h2">${g('pulse pulse1', `<circle cx="${YC[0]}" cy="${YC[1] - RING}" r="24" fill="none" stroke="${C.orange}" stroke-width="3"/>`, 0.8)}</g>`;
    body += `<g class="b2"><circle class="ring ring2" style="animation-delay:2.2s" cx="${YC[0] - RING}" cy="${YC[1]}" r="24" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`;
    // 칸 3: 태양이 옮겨 간 길
    const [ax, ay] = ringPt(84), [bx, by] = ringPt(186);
    body += drawPath(`M${f(ax)} ${f(ay)} A${RING} ${RING} 0 0 0 ${f(bx)} ${f(by)}`, 3, C.orange, 5, 0);
    body += at(3, 'fin', `<path d="M${f(bx - 9)} ${f(by - 12)} L${f(bx)} ${f(by)} L${f(bx + 10)} ${f(by - 10)}" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`, 1.3);
    body += at(3, 'pop', tag(545, 300, '연주 운동', KEY, { size: 22 }), 0.8) + at(3, 'pop', tag(545, 340, '1년에 한 바퀴', OK, { size: 18 }), 1.2);
    put('7-2/과학/7/연주 운동', svg(id, body, css));
  })();

  // ── 황도: 1년 동안 태양이 별자리 사이를 옮겨 가며 지나가는 하늘의 길 ──
  (function () {
    const id = 't72-s7-hwang';
    let css = base4(id);
    let body = `<circle cx="${YC[0]}" cy="${YC[1]}" r="${YR}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/>`;
    for (let k = 0; k < 12; k++) { const [x, y] = ringPt(k * 30 + 15); body += cluster(f(x), f(y), 0.7); }
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M${YC[0] + RING} ${YC[1]} A${RING} ${RING} 0 1 0 ${YC[0] - RING} ${YC[1]} A${RING} ${RING} 0 1 0 ${YC[0] + RING} ${YC[1]}" fill="none" stroke="${C.orange}" stroke-width="7" stroke-opacity=".7"/></g>`;
    body += `<g class="eg">${earthLine()}</g>` + sunIcon(YC[0], YC[1], 22);
    css += `.sc-${id} .eg { transform-box: view-box; transform-origin: ${YC[0]}px ${YC[1]}px; animation: ${id}-orbit 9s linear infinite; }
      @keyframes ${id}-orbit { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      .on2 .sc-${id} .draw2 { animation-duration: 2.4s; }`;
    body += at(1, 'pop', tag(84, 40, '별자리', LIL, { size: 18 }), 0.4) + at(1, 'pop', earth(522, 40, 9) + tag(570, 40, '지구', COLD, { size: 18 }), 0.6);
    body += `<g class="b3"><path class="flash flash3" d="M${YC[0] + RING} ${YC[1]} A${RING} ${RING} 0 1 0 ${YC[0] - RING} ${YC[1]} A${RING} ${RING} 0 1 0 ${YC[0] + RING} ${YC[1]}" fill="none" stroke="${C.red}" stroke-width="4"/></g>`;
    body += at(3, 'pop', tag(560, 320, '황도', KEY, { size: 26 }), 0.6);
    put('7-2/과학/7/황도', svg(id, body, css));
  })();

  // ── 달의 위상: 달은 늘 햇빛 쪽 반이 밝고, 지구 둘레를 돌면 지구에서 보이는 모양이 바뀐다 ──
  (function () {
    const id = 't72-s7-wisang';
    let css = base4(id);
    const ex = 175, ey = 180, R = 105;
    const orbit = `M${ex + R} ${ey} A${R} ${R} 0 0 0 ${ex - R} ${ey} A${R} ${R} 0 0 0 ${ex + R} ${ey}`;
    let body = `<path d="${orbit}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/>` + earth(ex, ey, 24);
    body += sunlight(352, 318, [60, 300], 1, 0) + at(1, 'pop', tag(335, 28, '햇빛', ['white', C.orange], { size: 18 }), 0.5);
    body += `<g class="b1 h2"><g><g>${moonLit(0, 0, 13)}</g><animateMotion dur="6s" repeatCount="indefinite" path="${orbit}"/></g></g>`;
    // 칸 2: 네 자리와 지구에서 본 모양
    const pos = [[0, '삭', 'new'], [90, '상현', 'first'], [180, '망', 'full'], [270, '하현', 'last']];
    pos.forEach(([phi, name, ph], k) => {
      const x = ex + R * Math.cos(rad(phi)), y = ey - R * Math.sin(rad(phi));
      const lx = ex + (R + 36) * Math.cos(rad(phi)) + (phi === 90 || phi === 270 ? 44 : 0), ly = ey - (R + 30) * Math.sin(rad(phi)) + (phi % 180 === 0 ? -34 : 6);
      body += at(2, 'pop', moonLit(f(x), f(y), 13), f(k * 0.4)) + at(2, 'pop', text(f(lx), f(ly), name, { size: 18 }), f(k * 0.4 + 0.1));
      const px = 412 + k * 66;
      body += at(2, 'pop', moonFace(px, 180, 24, ph) + text(px, 236, name, { size: 18 }), f(0.2 + k * 0.4));
      if (k < 3) body += at(2, 'fin', `<path d="M${px + 28} 180 h10 m-5 -5 l5 5 l-5 5" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`, f(0.4 + k * 0.4));
    });
    body += at(2, 'pop', tag(510, 120, '지구에서 본 모양', GRAY, { size: 18 }), 1.8);
    body += at(3, 'pop', tag(510, 290, '약 한 달', OK, { size: 18 }), 0.3) + at(3, 'pop', tag(510, 334, '달의 위상', KEY, { size: 22 }), 0.7) + glowRect(380, 146, 260, 104, 3, C.green, 0.1);
    put('7-2/과학/7/달의 위상', svg(id, body, css));
  })();

  // ── 삭·망: 달이 지구 둘레를 돌아 태양 쪽(삭) 또는 반대쪽(망)에 온다 ──
  const sakMang = (id, word, side) => {
    let css = base4(id);
    const ex = 300, ey = 180, R = 140, mx = side > 0 ? ex + R : ex - R;
    let body = `<circle cx="780" cy="${ey}" r="180" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>` + text(620, 330, '태양', { size: 18 });
    body += `<circle cx="${ex}" cy="${ey}" r="${R}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/>` + earth(ex, ey, 34) + text(ex, ey + 6, '지구', { size: 18 });
    body += sunlight(590, 520, [40, 110], 1, 0.2);
    body += `<g class="orb"><g class="inner">${moonLit(mx, ey, 18)}</g></g>`;
    css += `.sc-${id} .orb { transform-box: view-box; transform-origin: ${ex}px ${ey}px; }
      .sc-${id} .inner { transform-box: fill-box; transform-origin: center; }`
      + steps(id, 'orb', ['rotate(60deg)', 'rotate(0deg)'], 1.6, 0.3) + steps(id, 'inner', ['rotate(-60deg)', 'rotate(0deg)'], 1.6, 0.3);
    body += at(1, 'pop', tag(mx, ey - 44, '달', GRAY, { size: 18 }), 1.8);
    // 칸 2: 지구에서 본 모양
    body += drawPath(`M${ex + side * 36} ${ey} L${mx - side * 22} ${ey}`, 2, C.muted, 2.5, 0, ' stroke-dasharray="5 5"');
    const ix = side > 0 ? 110 : 500, iy = 290;
    body += at(2, 'pop', `<rect x="${ix - 70}" y="${iy - 50}" width="140" height="100" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>` + moonFace(ix, iy - 8, 26, side > 0 ? 'new' : 'full'), 0.6);
    body += at(2, 'pop', tag(ix, iy + 40, side > 0 ? '안 보임' : '보름달', side > 0 ? GRAY : HOT, { size: 18 }), 1.1);
    body += at(3, 'pop', tag(side > 0 ? 470 : 140, 60, word, KEY, { size: 30 }), 0.4) + ring(mx, ey, 26, 3, C.orange, 0.6);
    put(`7-2/과학/7/${word}`, svg(id, body, css));
  };
  sakMang('t72-s7-sak', '삭', 1);
  sakMang('t72-s7-mang', '망', -1);

  // ── 일식: 달이 지구와 태양 사이에 들어와 달의 그림자가 지구에 생긴다 ──
  (function () {
    const id = 't72-s7-ilsik';
    let css = base4(id);
    let body = `<circle cx="60" cy="180" r="50" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>` + text(60, 262, '태양', { size: 18 });
    body += earth(560, 180, 50) + text(560, 262, '지구', { size: 18 });
    body += `<g class="b2">${g('fin fin2', `<path d="M400 166 L400 194 L560 224 L560 136 Z" fill="${C.muted}" fill-opacity=".22"/><path d="M400 166 L400 194 L532 180 Z" fill="${C.ink}" fill-opacity=".45"/>`, 0.3)}</g>`;
    body += `<g class="mm"><circle cx="400" cy="180" r="14" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/></g>`;
    css += steps(id, 'mm', ['translateY(-110px)', 'translateY(0px)'], 1.4, 0.3);
    body += at(1, 'pop', tag(400, 130, '달', GRAY, { size: 18 }), 1.6);
    body += drawPath('M112 180 H382', 1, C.muted, 2, 1.6, ' stroke-dasharray="5 6"');
    body += at(2, 'pop', tag(560, 100, '그림자', GRAY, { size: 18 }), 1.1) + at(2, 'fin', lead(548, 114, 520, 172, C.muted), 1.2);
    // 칸 3: 지구에서 본 모습(태양이 가려진다)
    body += at(3, 'pop', `<rect x="200" y="250" width="160" height="96" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/><circle cx="280" cy="298" r="30" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`, 0.2);
    body += `<g class="b3"><g class="cov"><circle cx="280" cy="298" r="30" fill="${C.ink}" fill-opacity=".85"/></g></g>`;
    css += `.sc-${id} .cov { transform: translateX(60px); } @keyframes ${id}-cov { from { transform: translateX(60px); } to { transform: translateX(22px); } }
      .on3 .sc-${id} .cov { animation: ${id}-cov 1.4s ease-in-out .6s both; }`;
    body += at(3, 'pop', tag(480, 320, '일식', KEY, { size: 26 }), 1.2);
    put('7-2/과학/7/일식', svg(id, body, css));
  })();

  // ── 월식: 지구가 태양과 달 사이에 들어와 달이 지구의 그림자 속으로 들어간다 ──
  (function () {
    const id = 't72-s7-wolsik';
    let css = base4(id);
    let body = `<circle cx="50" cy="180" r="60" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>` + text(50, 272, '태양', { size: 18 });
    body += earth(300, 180, 40) + text(300, 250, '지구', { size: 18 });
    body += `<g class="mm"><circle cx="500" cy="180" r="15" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>${tag(500, 222, '달', GRAY, { size: 18 })}</g>`;
    css += steps(id, 'mm', ['translateY(120px)', 'translateY(26px)', 'translateY(0px)'], 1.6, 0.3);
    body += `<path d="M300 140 L640 4 L640 356 L300 220 Z" fill="${C.muted}" fill-opacity=".12"/><path d="M300 140 L640 167 L640 193 L300 220 Z" fill="${C.ink}" fill-opacity=".42"/>`;
    body += at(1, 'pop', tag(560, 120, '그림자', GRAY, { size: 18 }), 0.4);
    body += ring(500, 180, 24, 2, C.orange, 1.6);
    body += drawPath('M112 180 H258', 3, C.muted, 2, 0, ' stroke-dasharray="5 6"');
    body += at(3, 'pop', tag(160, 60, '월식', KEY, { size: 26 }), 0.6) + at(3, 'pop', tag(160, 104, '태양 - 지구 - 달', LIL, { size: 18 }), 1);
    put('7-2/과학/7/월식', svg(id, body, css));
  })();

  // ── 개기 일식: 달이 태양을 완전히 가려 낮에도 밤처럼 어두워진다 ──
  (function () {
    const id = 't72-s7-gil';
    let css = base4(id);
    const cx = 320, cy = 170, r = 78;
    let body = `<g class="b2"><rect class="fin fin2" style="animation-delay:1s" width="640" height="360" fill="${C.ink}" fill-opacity=".38"/></g>`;
    let halo = `<circle cx="${cx}" cy="${cy}" r="${r + 60}" fill="${C.lilac}" fill-opacity=".6"/><circle cx="${cx}" cy="${cy}" r="${r + 26}" fill="${C.lilac}"/>`;
    body += `<g class="b2">${g('fin fin2', halo, 1.4)}</g>`;
    body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>`;
    body += `<g class="moon"><circle cx="${cx}" cy="${cy}" r="${r + 1}" fill="${C.ink}" fill-opacity=".9"/></g>`;
    css += steps(id, 'moon', ['translateX(320px)', 'translateX(70px)', 'translateX(0px)'], 1.6, 0.3);
    body += `<g class="b1 h2">${g('pop pop1', tag(cx, 316, '조금 가림', GRAY, { size: 18 }), 1.6)}</g>`;
    body += at(2, 'pop', tag(cx, 316, '완전히 가림', ['white', C.ink], { size: 18 }), 1.6) + at(2, 'pop', tag(110, 50, '어두워짐', ['white', C.purple], { size: 18 }), 1.8);
    body += at(3, 'pop', tag(530, 50, '개기 일식', KEY, { size: 24 }), 0.5) + ring(cx, cy, r + 8, 3, C.orange, 0.2);
    put('7-2/과학/7/개기 일식', svg(id, body, css));
  })();

  // ── 개기 월식: 달 전체가 지구의 그림자 속에 들어가 붉게 보인다 ──
  (function () {
    const id = 't72-s7-gwol';
    let css = base4(id);
    const cx = 320, cy = 170, r = 72;
    let body = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
    body += `<g class="b2"><circle class="cf" cx="${cx}" cy="${cy}" r="${r}" fill="${C.red}" fill-opacity=".75"/></g>`;
    css += `.sc-${id} .cf { opacity: 0; transition: opacity 1.2s ease 1.2s; } .on2 .sc-${id} .cf { opacity: 1; }`;
    body += `<g class="sh"><circle cx="${cx}" cy="${cy}" r="160" fill="${C.ink}" fill-opacity=".28" stroke="${C.ink}" stroke-opacity=".3" stroke-width="2"/>${tag(cx - 70, 50, '지구의 그림자', GRAY, { size: 18 })}</g>`;
    css += steps(id, 'sh', ['translateX(-420px)', 'translateX(-150px)', 'translateX(0px)'], 1.6, 0.3);
    body += at(1, 'pop', tag(cx + 120, cy - 60, '달', GRAY, { size: 18 }), 0.3);
    body += at(2, 'pop', tag(530, 300, '붉은 달', HOT, { size: 20 }), 2.2);
    body += ring(cx, cy, r + 6, 3, C.red, 0.2) + at(3, 'pop', tag(320, 320, '개기 월식', KEY, { size: 24 }), 0.5);
    put('7-2/과학/7/개기 월식', svg(id, body, css));
  })();

  // ── 우주 기상: 태양 활동 → 태양풍 → 지구 둘레(인공위성·전파)의 상태가 바뀐다 ──
  (function () {
    const id = 't72-s7-gisang';
    let css = base4(id);
    const SX = -90, SY = 180, SR = 190, ex = 470, ey = 200, er = 46;
    const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let body = `<circle cx="${SX}" cy="${SY}" r="${SR}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>` + text(16, 186, '태양', { size: 20, anchor: 'start' });
    const flow = (n, seed, big) => {
      const rnd = seeded(seed);
      let s = '';
      for (let k = 0; k < n; k++) {
        const a = f(-30 + rnd() * 60), dur = f(big ? 1.3 + rnd() * 0.6 : 3.6 + rnd() * 1.2);
        s += `<g transform="rotate(${a} ${SX} ${SY})"><g class="fly" style="animation-duration:${dur}s;animation-delay:${f(-rnd() * dur)}s"><circle cx="${SX + SR + 8}" cy="${SY}" r="${big ? f(4 + rnd() * 2) : 3}" fill="${big ? C.red : C.orange}"/></g></g>`;
      }
      return s;
    };
    body += `<g class="b1 h2">${flow(7, 3, false)}</g><g class="b2">${flow(30, 8, true)}</g>`;
    css += `@keyframes ${id}-fly { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateX(520px); opacity: 0; } }
      .sc-${id} .fly { animation: ${id}-fly 3s linear infinite; }`;
    body += earth(ex, ey, er) + text(ex, ey + er + 28, '지구', { size: 18 });
    // 인공위성과 전파
    const sx = 580, sy = 86;
    const sat = `<rect x="${sx - 10}" y="${sy - 8}" width="20" height="16" rx="3" fill="white" stroke="${C.ink}" stroke-width="2.5"/><rect x="${sx - 40}" y="${sy - 6}" width="26" height="12" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><rect x="${sx + 14}" y="${sy - 6}" width="26" height="12" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    body += `<g class="sat">${sat}</g>` + text(sx, sy - 20, '인공위성', { size: 18 });
    const ax = ex + 30, ay = ey - 34;
    body += `<path d="M${ax} ${ay} l-8 -12 h16 Z" fill="${C.ink}"/>`;
    let waves = '';
    [0.25, 0.5, 0.75].forEach((t, k) => {
      const x = ax + (sx - ax) * t, y = ay - 12 + (sy - ay + 12) * t;
      waves += `<g class="wv" style="animation-delay:${f(k * 0.35)}s"><path d="M${f(x - 12)} ${f(y - 10)} Q${f(x + 6)} ${f(y - 4)} ${f(x + 12)} ${f(y + 12)}" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/></g>`;
    });
    body += `<g class="h2">${waves}</g>`;
    css += `.sc-${id} .wv { animation: ${id}-wv 1.2s ease-in-out infinite; } @keyframes ${id}-wv { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }`;
    body += at(1, 'pop', tag(560, 330, '전파 잘 됨', OK, { size: 18 }), 0.8);
    // 칸 2: 태양 폭발 → 위성 흔들림, 전파 끊김
    let burst = '';
    for (let k = 0; k < 16; k++) { const a = rad(k * 22.5), rr = k % 2 ? 14 : 34; burst += `${k ? 'L' : 'M'}${f(92 + rr * Math.cos(a))} ${f(150 + rr * Math.sin(a))} `; }
    body += at(2, 'pop', `<path d="${burst}Z" fill="white" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`, 0);
    body += at(2, 'pop', tag(170, 60, '태양 폭발', HOT, { size: 18 }), 0.3);
    body += at(2, 'pop', `<path d="M${(ax + sx) / 2 - 12} ${(ay + sy) / 2 - 18} l24 24 m0 -24 l-24 24" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`, 1.2);
    body += at(2, 'pop', tag(560, 330, '전파 끊김', HOT, { size: 18 }), 1.4) + ring(sx, sy, 34, 2, C.red, 1.2);
    css += `.sc-${id} .sat { transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
      .on2 .sc-${id} .sat { animation: ${id}-shake .5s ease-in-out 1s 4; }`;
    body += at(3, 'pop', tag(300, 330, '우주 기상', KEY, { size: 24 }), 0.5) + glowRect(380, 40, 250, 240, 3, C.purple, 0.2);
    put('7-2/과학/7/우주 기상', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
