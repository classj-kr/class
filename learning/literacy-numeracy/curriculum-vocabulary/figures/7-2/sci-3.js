// 과학 중1-2(7-2) Ⅶ단원 「태양계」 낱말 도식(1): 행성·작은 천체·태양의 표면과 대기·태양 활동./n// 행성 크기는 차례만 맞추고 실제 비는 줄였다. 태양 가장자리 단면은 큰 원의 꼭대기만 보이게 그린다. 모양·위치 속성은 CSS 로 바꾸지 않는다.
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

  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rad = (a) => (a * Math.PI) / 180;
  // 해(빛살이 천천히 숨 쉰다)
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  // 행성 여덟(이름, 바탕색, 테두리색)
  const PL = [['수성', C.line, C.muted], ['금성', C.yellow, C.orange], ['지구', C.sky, C.blue], ['화성', C.peach, C.red],
    ['목성', C.peach, C.orange], ['토성', C.yellow, C.orange], ['천왕성', C.mint, C.green], ['해왕성', C.sky, C.blue]];
  const planet = (k, x, y, r) => {
    const [, fill, stroke] = PL[k];
    let s = '';
    if (k === 5) s += `<ellipse cx="${x}" cy="${y}" rx="${f(r * 1.9)}" ry="${f(r * 0.42)}" fill="none" stroke="${C.orange}" stroke-width="${f(Math.max(2.5, r * 0.18))}"/>`;
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${r > 14 ? 3 : 2.5}"${k === 7 ? ' fill-opacity=".9"' : ''}/>`;
    if (k === 4) s += `<path d="M${f(x - r * 0.9)} ${f(y - r * 0.3)} H${f(x + r * 0.9)} M${f(x - r * 0.95)} ${f(y + r * 0.2)} H${f(x + r * 0.95)}" stroke="${C.orange}" stroke-width="${f(r * 0.14)}" opacity=".6"/>`;
    if (k === 5) s += `<path d="M${f(x - r * 1.9)} ${y} A${f(r * 1.9)} ${f(r * 0.42)} 0 0 0 ${f(x + r * 1.9)} ${y}" fill="none" stroke="${C.orange}" stroke-width="${f(Math.max(2.5, r * 0.18))}"/>`;
    if (k === 7) s += `<circle cx="${x}" cy="${y}" r="${f(r * 0.55)}" fill="${C.blue}" opacity=".25"/>`;
    return s;
  };
  const base3 = (id) => base(id) + `
    .sc-${id} .rays { transform-box: fill-box; transform-origin: center; animation: ${id}-pulse 2.4s ease-in-out infinite; }`;

  // ════ 7단원 태양계 ════

  // ── 행성: 태양 둘레를 도는 여덟 행성, 수성부터 해왕성까지 ──
  (function () {
    const id = 't72-s7-haeng';
    let css = base3(id);
    const SX = -160, SY = 180, SR = 200;
    let body = `<circle cx="${SX}" cy="${SY}" r="${SR}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>` + text(14, 186, '태양', { size: 18, anchor: 'start' });
    const xs = [78, 112, 150, 186, 256, 348, 446, 534], rs = [5, 9, 9, 6, 24, 19, 13, 13];
    xs.forEach((x, k) => {
      const R = x - SX, a = rad(30);
      body += drawPath(`M${f(SX + R * Math.cos(a))} ${f(SY - R * Math.sin(a))} A${R} ${R} 0 0 1 ${f(SX + R * Math.cos(a))} ${f(SY + R * Math.sin(a))}`, 1, C.line, 2.5, f(k * 0.12));
      body += at(1, 'pop', planet(k, x, SY, rs[k]), f(0.4 + k * 0.15));
      const up = k % 2 === 0, ly = up ? SY - 40 : SY + 52;
      body += at(2, 'rise', text(x, ly, PL[k][0], { size: 18 }), f(k * 0.18));
      body += ring(x, SY, rs[k] + 6, 3, C.green, f(k * 0.12));
    });
    body += at(3, 'pop', tag(320, 316, '행성 8개', KEY, { size: 24 }), 1.2);
    put('7-2/과학/7/행성', svg(id, body, css));
  })();

  // ── 지구형·목성형 행성에 같이 쓰는 줄(크기 차례는 맞추고 실제 크기 비는 줄였다) ──
  const ROWX = [42, 84, 132, 178, 272, 392, 494, 582], ROWR = [8, 14, 15, 10, 44, 36, 24, 23], ROWY = 160;
  const row = () => ROWX.map((x, k) => planet(k, x, ROWY, ROWR[k]) + text(x, ROWY + (k < 4 ? 46 : ROWR[k] + 32), PL[k][0], { size: 18 })).join('');

  // ── 지구형 행성: 작고 표면이 단단한 암석, 위성이 없거나 적다 ──
  (function () {
    const id = 't72-s7-jigu';
    let css = base3(id);
    let body = row();
    body += glowRect(18, 116, 186, 104, 2, C.blue);
    // 위성: 지구 1, 화성 2
    body += at(2, 'pop', `<circle cx="${ROWX[2] + 22}" cy="${ROWY - 16}" r="3.5" fill="${C.muted}"/>`, 0.8) + at(2, 'pop', `<circle cx="${ROWX[3] + 16}" cy="${ROWY - 13}" r="3" fill="${C.muted}"/><circle cx="${ROWX[3] - 15}" cy="${ROWY + 12}" r="3" fill="${C.muted}"/>`, 1);
    body += at(2, 'pop', tag(110, 262, '크기 작음', COLD, { size: 18 }), 1.2) + at(2, 'pop', tag(110, 300, '단단한 암석', COLD, { size: 18 }), 1.4) + at(2, 'pop', tag(110, 338, '위성 0~2개', COLD, { size: 18 }), 1.6);
    body += `<g class="b3">${g('pulse pulse3', ROWX.slice(0, 4).map((x, k) => `<circle cx="${x}" cy="${ROWY}" r="${ROWR[k] + 5}" fill="none" stroke="${C.blue}" stroke-width="3"/>`).join(''))}</g>`;
    body += at(3, 'pop', tag(110, 60, '지구형 행성', KEY, { size: 22 }), 0.6);
    put('7-2/과학/7/지구형 행성', svg(id, body, css));
  })();

  // ── 목성형 행성: 크고 표면이 기체, 고리와 많은 위성 ──
  (function () {
    const id = 't72-s7-mok';
    let css = base3(id);
    let body = row();
    body += glowRect(222, 92, 404, 150, 2, C.orange);
    // 고리(가는 고리를 더한다)와 위성
    [[4, 1.6], [6, 1.7], [7, 1.6]].forEach(([k, s2], j) => { body += drawPath(`M${f(ROWX[k] - ROWR[k] * s2)} ${ROWY} A${f(ROWR[k] * s2)} ${f(ROWR[k] * 0.3)} 0 0 0 ${f(ROWX[k] + ROWR[k] * s2)} ${ROWY}`, 2, C.muted, 2, f(0.5 + j * 0.2)); });
    const rnd = seeded(5);
    let moons = '';
    [4, 5, 6, 7].forEach((k) => { for (let m = 0; m < 6; m++) { const a = rnd() * Math.PI * 2, rr = ROWR[k] + 8 + rnd() * 16; moons += `<circle cx="${f(ROWX[k] + rr * Math.cos(a))}" cy="${f(ROWY + rr * Math.sin(a) * 0.8)}" r="2.6" fill="${C.muted}"/>`; } });
    body += at(2, 'fin', moons, 1);
    body += at(2, 'pop', tag(330, 286, '크기 큼', HOT, { size: 18 }), 1.2) + at(2, 'pop', tag(450, 286, '기체', HOT, { size: 18 }), 1.4) + at(2, 'pop', tag(330, 326, '고리', HOT, { size: 18 }), 1.6) + at(2, 'pop', tag(460, 326, '위성 많음', HOT, { size: 18 }), 1.8);
    body += `<g class="b3">${g('pulse pulse3', ROWX.slice(4).map((x, k) => `<circle cx="${x}" cy="${ROWY}" r="${ROWR[k + 4] + 5}" fill="none" stroke="${C.orange}" stroke-width="3"/>`).join(''))}</g>`;
    body += at(3, 'pop', tag(430, 46, '목성형 행성', KEY, { size: 22 }), 0.6);
    put('7-2/과학/7/목성형 행성', svg(id, body, css));
  })();

  // ── 위성: 지구 둘레를 도는 달, 목성 둘레를 도는 많은 위성 ──
  (function () {
    const id = 't72-s7-wi';
    let css = base3(id);
    const orbit = (cx, cy, rx, ry) => `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} A${rx} ${ry} 0 0 0 ${cx - rx} ${cy}`;
    const mover = (p, dur, begin, r, fill) => `<circle r="${r}" fill="${fill}" stroke="${C.ink}" stroke-width="1.5"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${p}"/></circle>`;
    let body = `<path d="${orbit(160, 190, 110, 44)}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/>`;
    body += planet(2, 160, 190, 36) + `<g class="b1">${mover(orbit(160, 190, 110, 44), 5, -1, 11, C.line)}</g>`;
    body += text(160, 262, '지구', { size: 18 }) + at(1, 'pop', `<circle cx="124" cy="100" r="9" fill="${C.line}" stroke="${C.ink}" stroke-width="1.5"/>` + tag(162, 100, '달', GRAY, { size: 18 }), 0.8);
    // 칸 2: 목성
    let jb = planet(4, 470, 190, 50);
    const rnd = seeded(9);
    for (let m = 0; m < 7; m++) {
      const rx = 70 + m * 12, ry = 16 + m * 4, p = orbit(470, 190, rx, ry);
      jb += `<path d="${p}" fill="none" stroke="${C.line}" stroke-width="1.5"/>` + mover(p, f(3 + m * 0.9), f(-rnd() * 6), 4.5, C.line);
    }
    body += `<g class="b2">${g('fin fin2', jb)}</g>` + at(2, 'pop', text(470, 300, '목성', { size: 18 }), 0.6) + at(2, 'pop', tag(470, 54, '위성 많음', HOT, { size: 18 }), 1);
    body += ring(124, 100, 14, 3, C.green, 0) + at(3, 'pop', tag(320, 330, '위성', KEY, { size: 26 }), 0.5);
    put('7-2/과학/7/위성', svg(id, body, css));
  })();

  // ── 왜소 행성: 태양 둘레를 돌고 둥글지만 행성보다 작다(명왕성) ──
  (function () {
    const id = 't72-s7-waeso';
    let css = base3(id);
    const op = 'M590 140 A250 80 0 0 0 90 140 A250 80 0 0 0 590 140';
    let body = `<path d="${op}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/>` + sunIcon(103, 140, 24);
    body += `<g class="b1"><circle r="9" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"><animateMotion dur="7s" begin="-1s" repeatCount="indefinite" path="${op}"/></circle></g>`;
    body += at(1, 'pop', tag(560, 40, '명왕성', LIL, { size: 18 }) + `<circle cx="496" cy="40" r="9" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`, 0.6);
    // 칸 2: 크기 견주기(지구 · 수성 · 명왕성)
    body += at(2, 'fin', `<path d="M40 248 H600" stroke="${C.line}" stroke-width="2"/>`, 0);
    body += at(2, 'pop', planet(2, 150, 290, 36) + text(150, 348, '지구', { size: 18 }), 0.2) + at(2, 'pop', planet(0, 300, 290, 14) + text(300, 348, '수성', { size: 18 }), 0.5)
      + at(2, 'pop', `<circle cx="430" cy="290" r="7" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>` + text(430, 348, '명왕성', { size: 18 }), 0.8);
    body += at(2, 'pop', tag(545, 290, '더 작다', LIL, { size: 18 }), 1.3);
    body += ring(430, 290, 16, 3, C.purple, 0) + at(3, 'pop', tag(320, 200, '왜소 행성', KEY, { size: 24 }), 0.5);
    put('7-2/과학/7/왜소 행성', svg(id, body, css));
  })();

  // ── 소행성: 화성과 목성 사이에 많이 모여 도는 작고 울퉁불퉁한 천체 ──
  (function () {
    const id = 't72-s7-soh';
    let css = base3(id);
    const cx = 250, cy = 180, ors = [32, 48, 64, 84, 152], ang = [40, 200, 300, 130, 330];
    let body = sunIcon(cx, cy, 14);
    ors.forEach((r, k) => {
      const pk = k < 4 ? k : 4;
      body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.line}" stroke-width="2"/>` + planet(pk, f(cx + r * Math.cos(rad(ang[k]))), f(cy - r * Math.sin(rad(ang[k]))), [4, 5, 5, 4.5, 11][k]);
    });
    body += text(f(cx + 84 * Math.cos(rad(130)) - 26), f(cy - 84 * Math.sin(rad(130)) - 6), '화성', { size: 18 }) + text(f(cx + 152 * Math.cos(rad(330)) + 4), f(cy - 152 * Math.sin(rad(330)) + 36), '목성', { size: 18 });
    // 칸 2: 띠
    const rnd = seeded(21);
    let belt = '';
    for (let k = 0; k < 70; k++) { const a = rnd() * Math.PI * 2, r = 100 + rnd() * 30; belt += `<circle cx="${f(cx + r * Math.cos(a))}" cy="${f(cy + r * Math.sin(a))}" r="${f(1.8 + rnd() * 1.8)}" fill="${C.muted}"/>`; }
    body += `<g class="b2"><g class="fin fin2"><g class="belt">${belt}</g></g></g>`;
    css += `.sc-${id} .belt { transform-box: view-box; transform-origin: ${cx}px ${cy}px; animation: ${id}-spin 40s linear infinite; }
      @keyframes ${id}-spin { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }`;
    body += ring(cx, cy, 115, 2, C.orange, 0.6);
    // 칸 3: 가까이 본 소행성
    const lump = 'M500 120 C470 112 452 86 470 64 C482 46 506 52 520 42 C540 30 572 40 580 62 C590 84 584 104 566 116 C548 130 524 126 500 120 Z';
    body += at(3, 'pop', `<path d="${lump}" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><circle cx="498" cy="80" r="8" fill="none" stroke="${C.muted}" stroke-width="2"/><circle cx="544" cy="96" r="6" fill="none" stroke="${C.muted}" stroke-width="2"/><circle cx="556" cy="62" r="4" fill="none" stroke="${C.muted}" stroke-width="2"/>`, 0.2);
    body += at(3, 'fin', `<path d="M368 160 L470 112" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 5"/>`, 0.1);
    body += at(3, 'pop', tag(530, 170, '울퉁불퉁', GRAY, { size: 18 }), 0.6) + at(3, 'pop', tag(530, 300, '소행성', KEY, { size: 26 }), 0.9);
    put('7-2/과학/7/소행성', svg(id, body, css));
  })();

  // ── 혜성: 태양에 가까워지면 태양 반대쪽으로 꼬리가 길게 생긴다 ──
  (function () {
    const id = 't72-s7-hye';
    let css = base3(id);
    const ex = 380, ey = 180, rx = 240, ry = 120, sx = 172, sy = 180;
    let body = `<path d="M${ex + rx} ${ey} A${rx} ${ry} 0 0 0 ${ex - rx} ${ey} A${rx} ${ry} 0 0 0 ${ex + rx} ${ey}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 7"/>`;
    body += sunIcon(sx, sy, 24);
    const P = (t) => [ex + rx * Math.cos(rad(t)), ey - ry * Math.sin(rad(t))];
    // 혜성 하나: 머리(t 자리)와 태양 반대쪽 꼬리(길이 L)
    const comet = (t, L) => {
      const [x, y] = P(t), dx = x - sx, dy = y - sy, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, w = L * 0.22;
      let s = '';
      if (L) {
        const tx = x + ux * L, ty = y + uy * L, px = -uy, py = ux;
        s += `<g class="tail" style="transform-origin:${f(x)}px ${f(y)}px"><path d="M${f(x + px * 7)} ${f(y + py * 7)} L${f(tx + px * w)} ${f(ty + py * w)} Q${f(tx + ux * 8)} ${f(ty + uy * 8)} ${f(tx - px * w)} ${f(ty - py * w)} L${f(x - px * 7)} ${f(y - py * 7)} Z" fill="${C.sky}" fill-opacity=".9" stroke="${C.blue}" stroke-width="1.5" stroke-opacity=".5"/>`
          + `<path d="M${f(x)} ${f(y)} L${f(x + ux * L * 0.8)} ${f(y + uy * L * 0.8)}" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".9"/></g>`;
      }
      return s + `<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="white" stroke="${C.blue}" stroke-width="3"/>`;
    };
    css += `.sc-${id} .tail { transform-box: view-box; } @keyframes ${id}-tail { from { transform: scale(0); } to { transform: scale(1); } }
      .on2 .sc-${id} .b2 .tail, .on3 .sc-${id} .b3 .tail { animation: ${id}-tail 1s ease-out .5s both; }`;
    body += at(1, 'pop', comet(14, 0), 0.2) + at(1, 'pop', tag(574, 100, '얼음과 먼지', GRAY, { size: 18 }), 0.6);
    body += at(2, 'pop', comet(105, 46), 0) + `<g class="b2">${g('pop pop2', comet(158, 128), 0.6)}</g>`;
    body += at(3, 'pop', comet(215, 92), 0) + ring(sx, sy, 36, 3, C.orange, 0.8);
    body += at(2, 'pop', tag(sx - 72, sy, '태양', ['white', C.orange], { size: 18 }), 0.2);
    body += at(3, 'pop', tag(520, 300, '혜성', KEY, { size: 26 }), 1.2);
    put('7-2/과학/7/혜성', svg(id, body, css));
  })();

  // ── 눈 그림(옆모습) ──
  const eye = (x, y) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="${x + 6}" cy="${y}" r="8" fill="${C.ink}"/>`;
  // 태양 원반(빛나는 표면). 가장자리가 조금 더 짙다
  const disk = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r - 10}" fill="white" fill-opacity=".25"/>`;

  // ── 광구: 우리 눈에 보이는 태양의 둥글고 밝은 표면 ──
  (function () {
    const id = 't72-s7-gwang';
    let css = base3(id);
    const cx = 400, cy = 186, r = 130, ex = 70;
    let body = disk(cx, cy, r) + eye(ex, cy);
    // 눈에서 원반 가장자리로 닿는 시선
    const d = cx - ex, a = Math.asin(r / d), tl = Math.sqrt(d * d - r * r);
    [-1, 1].forEach((sg, k) => { body += drawPath(`M${ex + 26} ${cy} L${f(ex + tl * Math.cos(a))} ${f(cy + sg * tl * Math.sin(a))}`, 1, C.muted, 2.5, f(0.2 + k * 0.2), ' stroke-dasharray="6 6"'); });
    body += `<g class="b1"><circle class="flash flash1" style="animation-delay:1s" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.orange}" stroke-width="10"/></g>`;
    body += at(2, 'fin', lead(cx + 70, cy - 60, 580, 60, C.red), 0.2) + at(2, 'pop', tag(570, 40, '약 6000 ℃', HOT), 0.5);
    body += at(3, 'pop', tag(cx, cy, '광구', KEY, { size: 30 }), 0.4);
    put('7-2/과학/7/광구', svg(id, body, css));
  })();

  // ── 흑점: 주변보다 온도가 낮아 검게 보이고, 날마다 자리를 옮긴다 ──
  (function () {
    const id = 't72-s7-heuk';
    let css = base3(id);
    const cx = 320, cy = 190, r = 140;
    let body = disk(cx, cy, r);
    const spots = `<ellipse cx="236" cy="168" rx="16" ry="13" fill="${C.muted}" fill-opacity=".6"/><circle cx="236" cy="168" r="8" fill="${C.ink}" fill-opacity=".85"/>`
      + `<ellipse cx="270" cy="182" rx="11" ry="9" fill="${C.muted}" fill-opacity=".6"/><circle cx="270" cy="182" r="5" fill="${C.ink}" fill-opacity=".85"/>`;
    body += `<g class="b2">${spots.replace(/fill-opacity="\.(6|85)"/g, 'fill-opacity=".18"')}</g>`;
    body += `<g class="b1"><g class="fin fin1"><g class="mv">${spots}</g></g></g>`;
    css += steps(id, 'mv', ['translateX(0px)', null, 'translateX(150px)'], 2.2, 0.4);
    body += `<g class="b1 h2">${g('fin fin1', lead(236, 154, 140, 60, C.ink) + tag(120, 46, '약 4000 ℃', GRAY), 0.6)}</g>`;
    body += at(1, 'fin', lead(400, 110, 520, 50, C.red) + tag(540, 40, '약 6000 ℃', HOT), 1);
    body += at(2, 'fin', `<path d="M250 205 Q320 222 390 205" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="6 5"/><path d="M380 199 L392 205 L381 213" fill="none" stroke="${C.red}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, 2.4);
    body += ring(410, 175, 30, 3, C.ink, 0) + at(3, 'pop', tag(120, 300, '흑점', KEY, { size: 26 }), 0.5);
    put('7-2/과학/7/흑점', svg(id, body, css));
  })();

  // ── 쌀알 무늬: 광구 아래 대류 — 가운데로 뜨거운 기체가 올라오고 가장자리로 식은 기체가 내려간다 ──
  (function () {
    const id = 't72-s7-ssal';
    let css = base3(id);
    const rnd = seeded(31);
    let cells = '';
    const R = 28, W = R * Math.sqrt(3);
    for (let rr = 0; rr < 3; rr++) for (let c = -1; c < 13; c++) {
      const x = 40 + c * W + (rr % 2 ? W / 2 : 0), y = 50 + rr * R * 1.5;
      let d = '';
      for (let k = 0; k < 6; k++) { const a = rad(60 * k + 30), j = 0.8 + rnd() * 0.25; d += `${k ? 'L' : 'M'}${f(x + R * j * Math.cos(a))} ${f(y + R * j * Math.sin(a))} `; }
      cells += `<path class="${rnd() < 0.3 ? 'tw' : ''}" style="animation-delay:${f(-rnd() * 3)}s" d="${d}Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="5" stroke-linejoin="round"/>`;
    }
    let body = `<defs><clipPath id="${id}-c"><rect x="30" y="26" width="580" height="112" rx="14"/></clipPath></defs><rect x="30" y="26" width="580" height="112" rx="14" fill="${C.orange}"/><g clip-path="url(#${id}-c)">${cells}</g><rect x="30" y="26" width="580" height="112" rx="14" fill="none" stroke="${C.orange}" stroke-width="3"/>`;
    css += `.sc-${id} .tw { animation: ${id}-tw 3s ease-in-out infinite; } @keyframes ${id}-tw { 0%, 100% { opacity: 1; } 50% { opacity: .55; } }`;
    body += at(1, 'pop', tag(320, 160, '광구', HOT, { size: 18 }), 0.4);
    // 칸 2: 단면 — 대류
    body += at(2, 'fin', `<rect x="30" y="186" width="580" height="150" rx="14" fill="${C.peach}"/><path d="M30 186 H610" stroke="${C.orange}" stroke-width="4"/>`, 0);
    [130, 320, 510].forEach((x, k) => {
      const s = f(0.4 + k * 0.25);
      body += drawPath(`M${x} 320 V214`, 2, C.red, 5, s) + drawPath(`M${x - 8} 206 Q${x - 60} 200 ${x - 84} 230 V300`, 2, C.blue, 4, f(+s + 0.6)) + drawPath(`M${x + 8} 206 Q${x + 60} 200 ${x + 84} 230 V300`, 2, C.blue, 4, f(+s + 0.6));
      body += at(2, 'fin', `<path d="M${x - 8} 224 L${x} 212 L${x + 8} 224" fill="none" stroke="${C.red}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x - 92} 290 L${x - 84} 302 L${x - 76} 290 M${x + 76} 290 L${x + 84} 302 L${x + 92} 290" fill="none" stroke="${C.blue}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`, f(+s + 1.4));
    });
    body += at(2, 'pop', tag(175, 322, '올라옴', HOT, { size: 18 }), 2.2) + at(2, 'pop', tag(465, 322, '내려감', COLD, { size: 18 }), 2.4);
    body += glowRect(30, 26, 580, 112, 3, C.red) + at(3, 'pop', tag(320, 160, '쌀알 무늬', KEY, { size: 22 }), 0.5);
    put('7-2/과학/7/쌀알 무늬', svg(id, body, css));
  })();

  // ── 태양 가장자리 단면(광구·채층·코로나·홍염에 같이 쓴다): 큰 원의 꼭대기만 보인다 ──
  const LX = 320, LY = 650, LR = 450; // 광구 꼭대기 y = 200
  const limbArc = (r) => { const a = rad(50); return `M${f(LX - r * Math.sin(a))} ${f(LY - r * Math.cos(a))} A${r} ${r} 0 0 1 ${f(LX + r * Math.sin(a))} ${f(LY - r * Math.cos(a))}`; };
  const limbY = (x, r) => f(LY - Math.sqrt(r * r - (x - LX) * (x - LX)));
  const photo = () => `<circle cx="${LX}" cy="${LY}" r="${LR}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>`;
  const chromo = (cls = '') => `<path class="${cls}" d="${limbArc(LR + 10)}" fill="none" stroke="${C.red}" stroke-width="16" stroke-opacity=".8"${cls ? ' pathLength="1"' : ''}/>`;

  // ── 채층: 광구 바로 위의 얇고 붉은 대기층 ──
  (function () {
    const id = 't72-s7-chae';
    let css = base3(id);
    let body = photo() + at(1, 'pop', tag(320, 290, '광구', HOT), 0.3);
    body += `<g class="b2">${chromo('draw draw2')}</g>`;
    body += at(2, 'fin', lead(470, limbY(470, LR + 10), 520, 110, C.red), 1.2) + at(2, 'pop', tag(530, 92, '채층', KEY, { size: 24 }), 1.4);
    body += at(2, 'fin', `<path d="M180 ${limbY(180, LR) + 2} L150 150 M180 ${limbY(180, LR + 20) - 1} L150 150" stroke="${C.muted}" stroke-width="2"/>`, 1.6) + at(2, 'pop', tag(120, 132, '얇다', GRAY, { size: 18 }), 1.8);
    body += `<g class="b3"><path class="flash flash3" d="${limbArc(LR + 10)}" fill="none" stroke="${C.red}" stroke-width="26" stroke-opacity=".35"/></g>` + at(3, 'pop', tag(320, 120, '붉은 대기층', HOT, { size: 20 }), 0.5);
    put('7-2/과학/7/채층', svg(id, body, css));
  })();

  // ── 홍염: 채층에서 고리나 불기둥처럼 높이 솟는 붉은 기체 ──
  (function () {
    const id = 't72-s7-hong';
    let css = base3(id);
    let body = photo() + chromo() + at(1, 'pop', tag(320, 290, '광구', HOT), 0.2) + at(1, 'pop', tag(560, 150, '채층', ['white', C.red], { size: 18 }), 0.5);
    const y1 = limbY(230, LR + 14), y2 = limbY(350, LR + 14);
    const loop = `M230 ${y1} C214 120 250 52 292 56 C334 60 360 120 350 ${y2}`;
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="${loop}" fill="none" stroke="${C.red}" stroke-width="20" stroke-opacity=".75" stroke-linecap="round"/><path class="draw draw2" pathLength="1" d="${loop}" fill="none" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/></g>`;
    const y3 = limbY(470, LR + 14);
    const col = `M462 ${y3} C452 150 486 128 470 100 C460 82 478 70 486 62`;
    body += `<g class="b2"><path class="draw draw2" style="animation-delay:.8s" pathLength="1" d="${col}" fill="none" stroke="${C.red}" stroke-width="14" stroke-opacity=".75" stroke-linecap="round"/></g>`;
    css += `.on2 .sc-${id} .draw2 { animation-duration: 1.8s; }`;
    body += `<g class="b3">${g('pulse pulse3', `<path d="${loop}" fill="none" stroke="${C.red}" stroke-width="30" stroke-opacity=".2" stroke-linecap="round"/>`)}</g>`;
    body += at(3, 'pop', tag(110, 70, '홍염', KEY, { size: 26 }), 0.5) + at(3, 'fin', lead(150, 80, 222, 110, C.red), 0.7);
    put('7-2/과학/7/홍염', svg(id, body, css));
  })();

  // ── 코로나: 달이 광구를 가리면 보이는, 멀리까지 퍼진 하얀 바깥 대기 ──
  (function () {
    const id = 't72-s7-coro';
    let css = base3(id);
    const cx = 320, cy = 180, r = 78;
    let halo = `<circle cx="${cx}" cy="${cy}" r="${r + 70}" fill="${C.lilac}" fill-opacity=".55"/><circle cx="${cx}" cy="${cy}" r="${r + 36}" fill="${C.lilac}"/>`;
    [20, 75, 140, 200, 250, 320].forEach((a, k) => {
      const L = [150, 120, 160, 130, 150, 120][k], w = 0.16, p = (ang, rr) => `${f(cx + rr * Math.cos(rad(ang)))} ${f(cy - rr * Math.sin(rad(ang)))}`;
      halo += `<path d="M${p(a - 22, r)} Q${p(a - 6, r + L * 0.6)} ${p(a, r + L)} Q${p(a + 6, r + L * 0.6)} ${p(a + 22, r)} Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="1.5" stroke-opacity=".35"/>`;
    });
    let body = `<g class="b2"><g class="halo">${halo}</g></g>`;
    css += `.sc-${id} .halo { transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.7); transition: opacity 1s ease .3s, transform 1.4s ease .3s; } .on2 .sc-${id} .halo { opacity: 1; transform: scale(1); }`;
    body += disk(cx, cy, r) + `<g class="b2"><circle cx="${cx}" cy="${cy}" r="${r + 3}" fill="none" stroke="${C.red}" stroke-width="5" stroke-opacity=".8"/></g>`;
    body += `<g class="moon"><circle cx="${cx}" cy="${cy}" r="${r + 1}" fill="${C.ink}" fill-opacity=".88"/>${tag(cx, cy, '달', GRAY, { size: 18 })}</g>`;
    css += `.sc-${id} .moon { transform: translateX(300px); } @keyframes ${id}-moon { from { transform: translateX(300px); } to { transform: translateX(0); } }
      .on1 .sc-${id} .moon { animation: ${id}-moon 2s ease-in-out .3s both; }`;
    body += `<g class="b1 h2">${g('pop pop1', tag(cx, cy + r + 24, '태양', ['white', C.orange], { size: 18 }), 0.2)}</g>`;
    body += `<g class="b3"><circle class="ring ring3" cx="${cx}" cy="${cy}" r="${r + 140}" fill="none" stroke="${C.purple}" stroke-width="3" stroke-dasharray="8 8"/></g>`;
    body += at(3, 'pop', tag(540, 320, '코로나', KEY, { size: 26 }), 0.5) + at(3, 'fin', lead(500, 300, 432, 236, C.purple), 0.7);
    put('7-2/과학/7/코로나', svg(id, body, css));
  })();

  // ── 플레어: 흑점 부근에서 갑자기 강한 폭발이 일어나 짧게 많은 에너지를 내뿜는다 ──
  (function () {
    const id = 't72-s7-flare';
    let css = base3(id);
    const cx = 320, cy = 196, r = 140, fx = 286, fy = 168;
    let body = disk(cx, cy, r);
    body += `<ellipse cx="270" cy="176" rx="14" ry="11" fill="${C.muted}" fill-opacity=".6"/><circle cx="270" cy="176" r="7" fill="${C.ink}" fill-opacity=".85"/><ellipse cx="306" cy="186" rx="10" ry="8" fill="${C.muted}" fill-opacity=".6"/><circle cx="306" cy="186" r="5" fill="${C.ink}" fill-opacity=".85"/>`;
    body += at(1, 'fin', lead(266, 162, 170, 70, C.ink) + tag(150, 54, '흑점', GRAY, { size: 18 }), 0.4);
    let star = '';
    for (let k = 0; k < 16; k++) { const a = rad(k * 22.5), rr = k % 2 ? 22 : 54; star += `${k ? 'L' : 'M'}${f(fx + rr * Math.cos(a))} ${f(fy + rr * Math.sin(a))} `; }
    body += `<g class="b2"><g class="burst"><path d="${star}Z" fill="white" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><circle cx="${fx}" cy="${fy}" r="16" fill="white"/></g></g>`;
    css += `.sc-${id} .burst { transform-box: fill-box; transform-origin: center; opacity: 0; }
      @keyframes ${id}-burst { 0% { opacity: 0; transform: scale(.1); } 18% { opacity: 1; transform: scale(1.25); } 35% { transform: scale(1); } 100% { opacity: 1; transform: scale(1); } }
      @keyframes ${id}-fade { from { opacity: 1; transform: scale(1); } to { opacity: .15; transform: scale(.5); } }
      .on2 .sc-${id} .burst { animation: ${id}-burst 1.4s ease-out .3s both; }
      .on3 .sc-${id} .burst { animation: ${id}-fade 1.6s ease-in .2s both; }`;
    [0, 1, 2].forEach((k) => { body += `<g class="b2"><circle class="ring ring2" style="animation-delay:${f(0.5 + k * 0.3)}s" cx="${fx}" cy="${fy}" r="40" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`; });
    [[-60, 0], [-20, 0], [30, 0]].forEach(([a], k) => { const u = rad(a - 90); body += grow(2, fx + 60 * Math.cos(u), fy + 60 * Math.sin(u), fx + 110 * Math.cos(u), fy + 110 * Math.sin(u), C.orange, 5, f(0.8 + k * 0.15)); });
    body += at(2, 'pop', tag(510, 60, '폭발', HOT, { size: 20 }), 0.9);
    body += at(3, 'pop', tag(510, 320, '플레어', KEY, { size: 26 }), 0.5) + at(3, 'pop', tag(130, 320, '짧은 시간', LIL, { size: 18 }), 1.2);
    put('7-2/과학/7/플레어', svg(id, body, css));
  })();

  // ── 태양풍: 태양에서 우주로 끊임없이 뿜어져 나오는 전기를 띤 입자의 흐름 ──
  (function () {
    const id = 't72-s7-pung';
    let css = base3(id);
    const SX = -90, SY = 180, SR = 190;
    let body = `<circle cx="${SX}" cy="${SY}" r="${SR}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/>` + text(20, 186, '태양', { size: 20, anchor: 'start' });
    const rnd = seeded(41);
    let flow = '';
    for (let k = 0; k < 26; k++) {
      const a = f(-38 + rnd() * 76), dur = f(2.6 + rnd() * 1.4);
      flow += `<g transform="rotate(${a} ${SX} ${SY})"><g class="fly" style="animation-duration:${dur}s;animation-delay:${f(-rnd() * dur)}s"><circle cx="${SX + SR + 8}" cy="${SY}" r="${f(3 + rnd() * 2)}" fill="${C.orange}"/></g></g>`;
    }
    body += `<g class="b1">${flow}</g>`;
    css += `@keyframes ${id}-fly { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateX(560px); opacity: 0; } }
      .sc-${id} .fly { animation: ${id}-fly 3s linear infinite; }`;
    body += at(1, 'pop', tag(250, 50, '전기를 띤 입자', HOT, { size: 18 }), 0.8);
    body += at(2, 'pop', planet(2, 520, 200, 26) + text(520, 256, '지구', { size: 18 }), 0.2) + ring(520, 200, 34, 2, C.blue, 0.6);
    body += at(3, 'pop', tag(320, 320, '태양풍', KEY, { size: 26 }), 0.5);
    put('7-2/과학/7/태양풍', svg(id, body, css));
  })();

})(typeof window !== 'undefined' ? window : globalThis);
