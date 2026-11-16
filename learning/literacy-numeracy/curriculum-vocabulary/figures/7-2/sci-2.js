// 과학 중1-2(7-2) Ⅵ단원 「기체의 성질」 낱말 도식: 기체 입자는 벽에 튀는 푸른 점(데우면 붉고 빠르게), 압력은 바늘 계기로 그린다./n// 입자는 가로 왕복과 세로 왕복을 따로 돌려(transform) 벽에서 튕기는 것처럼 보이게 한다. 모양·위치 속성은 CSS 로 바꾸지 않는다.
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
  // 상자 [x0,x1]×[y0,y1] 안에서 벽에 튀는 기체 입자. 가로 왕복과 세로 왕복을 따로 돌려 벽에서 튕기는 것처럼 보인다.
  // speed 가 크면 빠르다. 돌려주는 것: { body, css }
  const gas = (id, key, [x0, y0, x1, y1], n, seed, { speed = 1, r = 8, color = C.blue } = {}) => {
    const rnd = seeded(seed), W = f(x1 - x0 - 2 * r), H = f(y1 - y0 - 2 * r);
    let css = `@keyframes ${id}-${key}x { from { transform: translateX(0); } to { transform: translateX(${W}px); } }
      @keyframes ${id}-${key}y { from { transform: translateY(0); } to { transform: translateY(${H}px); } }`;
    let body = '';
    for (let k = 0; k < n; k++) {
      const vx = (55 + rnd() * 75) * speed, vy = (55 + rnd() * 75) * speed, dx = f(W / vx), dy = f(H / vy);
      body += `<g style="animation:${id}-${key}x ${dx}s linear ${f(-rnd() * 2 * dx)}s infinite alternate"><g style="animation:${id}-${key}y ${dy}s linear ${f(-rnd() * 2 * dy)}s infinite alternate">`
        + `<circle cx="${f(x0 + r)}" cy="${f(y0 + r)}" r="${r}" fill="${color}" fill-opacity=".85" stroke="white" stroke-width="1.5"/></g></g>`;
    }
    return { body, css };
  };
  // 바늘 계기: 0~max 눈금, 바늘은 cls 로 돌린다(위쪽이 가운데). ang(v) 로 바늘 각도
  const dial = (cx, cy, r, max, cls, label) => {
    const ang = (v) => -120 + (240 * v) / max;
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${C.ink}" stroke-width="3.5"/>`;
    for (let v = 0; v <= max; v++) {
      const a = (ang(v) * Math.PI) / 180, sx = Math.sin(a), sy = -Math.cos(a);
      s += `<path d="M${f(cx + sx * (r - 12))} ${f(cy + sy * (r - 12))} L${f(cx + sx * (r - 3))} ${f(cy + sy * (r - 3))}" stroke="${C.ink}" stroke-width="3"/>`;
      s += text(f(cx + sx * (r - 26)), f(cy + sy * (r - 26) + 6), v, { size: 18 });
    }
    s += `<g class="${cls}"><path d="M${cx} ${cy + 8} L${cx - 5} ${cy} L${cx} ${cy - r + 14} L${cx + 5} ${cy} Z" fill="${C.red}"/></g><circle cx="${cx}" cy="${cy}" r="6" fill="${C.ink}"/>`;
    s += text(cx, cy + r + 26, label, { size: 18 });
    return { s, ang, css: (id) => `.sc-${id} .${cls} { transform-box: view-box; transform-origin: ${cx}px ${cy}px; }` };
  };
  // 온도계: 둥근 끝 (x, by), 관 위 끝 ty. 붉은 기둥은 cls 로 늘인다(아래 끝 기준)
  const thermo = (x, ty, by, cls) => `<rect x="${x - 9}" y="${ty}" width="18" height="${by - ty}" rx="9" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`
    + `<g class="${cls}"><rect x="${x - 4}" y="${ty + 8}" width="8" height="${by - ty - 8}" rx="4" fill="${C.red}"/></g><circle cx="${x}" cy="${by + 6}" r="14" fill="${C.red}" stroke="${C.ink}" stroke-width="2.5"/>`;
  // 실린더(위가 열린 통)와 피스톤. 피스톤은 cls 로 움직인다(맨 위 y = py)
  const cylinder = (x0, x1, top, bottom) => `<path d="M${x0} ${top} V${bottom} H${x1} V${top}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`;
  const piston = (x0, x1, py, cls, extra = '') => `<g class="${cls}"><path d="M${(x0 + x1) / 2} ${py - 70} V${py}" stroke="${C.muted}" stroke-width="10"/><rect x="${x0 + 3}" y="${py}" width="${x1 - x0 - 6}" height="16" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>${extra}</g>`;
  const flame = (x, y) => `<path d="M${x} ${y - 46} C${x + 22} ${y - 22} ${x + 22} ${y} ${x} ${y} C${x - 22} ${y} ${x - 22} ${y - 22} ${x} ${y - 46} Z" fill="${C.orange}"/><path d="M${x} ${y - 24} C${x + 10} ${y - 12} ${x + 9} ${y} ${x} ${y} C${x - 9} ${y} ${x - 10} ${y - 12} ${x} ${y - 24} Z" fill="${C.yellow}"/>`;

  // ════ 6단원 기체의 성질 ════

  // ── 압력: 같은 벽돌이라도 좁은 면으로 세우면 스펀지가 더 깊이 눌린다 ──
  (function () {
    const id = 't72-s6-ap';
    let css = base(id);
    const sy = 254, sh = 60;
    const sponge = (x0, x1, c0, c1, cls) => {
      const part = (a, b) => `<rect x="${a}" y="${sy}" width="${b - a}" height="${sh}" fill="${C.yellow}" fill-opacity=".55"/><path d="M${a} ${sy} H${b}" stroke="${C.orange}" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
      return part(x0, c0) + part(c1, x1) + `<g class="${cls}">${part(c0, c1)}</g>`
        + `<path d="M${x0} ${sy} V${sy + sh} H${x1} V${sy}" fill="none" stroke="${C.orange}" stroke-width="3"/>`;
    };
    let body = sponge(50, 290, 90, 250, 'cA') + sponge(350, 590, 440, 500, 'cB');
    css += `.sc-${id} .cA, .sc-${id} .cB { transform-box: fill-box; transform-origin: 50% 100%; }`;
    // 왼쪽: 넓은 면(160×56)
    const brick = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`;
    body += `<g class="bA">${brick(90, sy - 56, 160, 56)}${grow(1, 170, sy - 130, 170, sy - 62, C.red, 7, 0.1)}</g>`;
    css += steps(id, 'cA', ['scaleY(1)', 'scaleY(.82)'], 0.9, 1) + steps(id, 'bA', ['translateY(0px)', `translateY(${f(sh * 0.18)}px)`], 0.9, 1);
    body += at(1, 'fin', `<path d="M92 ${sy + 4 + sh * 0.18} H248" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`, 1.9) + at(1, 'pop', tag(170, 340, '넓은 면', HOT, { size: 18 }), 2);
    // 오른쪽: 좁은 면(60×160 으로 세움)
    body += `<g class="b2"><g class="bB">${brick(440, sy - 160, 60, 160)}${grow(2, 470, sy - 200, 470, sy - 166, C.red, 7, 0.1)}</g></g>`;
    css += steps(id, 'cB', ['scaleY(1)', null, 'scaleY(.5)'], 0.9, 1) + steps(id, 'bB', ['translateY(0px)', null, `translateY(${f(sh * 0.5)}px)`], 0.9, 1);
    body += at(2, 'fin', `<path d="M442 ${sy + 4 + sh * 0.5} H498" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`, 1.9) + at(2, 'pop', tag(470, 340, '좁은 면', HOT, { size: 18 }), 2);
    body += at(2, 'pop', tag(560, 60, '같은 힘', GRAY, { size: 18 }), 0.4);
    body += ring(470, sy + sh * 0.5, 34, 3, C.red, 0) + at(3, 'pop', tag(320, 46, '압력', KEY, { size: 26 }), 0.4) + at(3, 'pop', tag(320, 100, '힘 ÷ 넓이', LIL), 0.8);
    put('7-2/과학/6/압력', svg(id, body, css));
  })();

  // ── 기체의 압력: 이리저리 움직이는 입자가 벽에 부딪쳐 벽을 민다 ──
  (function () {
    const id = 't72-s6-giap';
    let css = base(id);
    const B = [170, 60, 470, 300];
    let body = `<rect x="${B[0] - 4}" y="${B[1] - 4}" width="${B[2] - B[0] + 8}" height="${B[3] - B[1] + 8}" rx="14" fill="white" stroke="${C.ink}" stroke-width="5"/>`;
    const gs = gas(id, 'a', B, 12, 7, { speed: 1.6 });
    body += gs.body; css += gs.css;
    // 칸 2: 벽 여러 곳이 부딪혀 반짝이고, 바깥으로 미는 화살표
    const hits = [[170, 110], [170, 230], [470, 150], [470, 260], [250, 60], [390, 60], [300, 300], [420, 300]];
    hits.forEach(([x, y], k) => { body += `<g class="b2"><circle class="hit" style="animation-delay:${f(k * 0.37)}s" cx="${x}" cy="${y}" r="12" fill="${C.yellow}" fill-opacity=".9"/></g>`; });
    css += `.sc-${id} .hit { transform-box: fill-box; transform-origin: center; opacity: 0; }
      @keyframes ${id}-hit { 0% { opacity: 0; transform: scale(.3); } 15% { opacity: 1; transform: scale(1.1); } 45%, 100% { opacity: 0; transform: scale(1.5); } }
      .on2 .sc-${id} .hit { animation: ${id}-hit 1.5s ease-out infinite; }`;
    [[160, 180, 90, 180], [480, 180, 550, 180], [320, 50, 320, 14], [320, 310, 320, 346]].forEach(([a, b2, c, d], k) => { body += grow(2, a, b2, c, d, C.blue, 7, f(0.6 + k * 0.15)); });
    body += glowRect(158, 48, 324, 264, 3, C.blue);
    body += at(3, 'pop', tag(540, 330, '기체의 압력', KEY, { size: 22 }), 0.5);
    put('7-2/과학/6/기체의 압력', svg(id, body, css));
  })();

  // ── 대기압: 지구를 둘러싼 공기가 땅과 물체를 모든 방향에서 누른다 ──
  (function () {
    const id = 't72-s6-daegi';
    let css = base(id);
    const ER = 900, ECX = 320, ECY = 300 + ER; // 땅 표면 꼭대기 y=300
    let body = `<circle cx="${ECX}" cy="${ECY}" r="${ER}" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`;
    // 칸 1: 공기층(아래로 갈수록 빽빽)
    let air = `<circle cx="${ECX}" cy="${ECY}" r="${ER + 230}" fill="${C.sky}" fill-opacity=".55"/>`;
    const rnd = seeded(11);
    let dots = '';
    for (let k = 0; k < 46; k++) {
      const h = Math.pow(rnd(), 1.8) * 210, x = 30 + rnd() * 580, y = 296 - h - Math.pow((x - ECX) / ER, 2) * ER * 0.5;
      dots += `<circle cx="${f(x)}" cy="${f(y)}" r="4.5" fill="${C.blue}" fill-opacity=".7"/>`;
    }
    body += at(1, 'fin', air, 0) + `<circle cx="${ECX}" cy="${ECY}" r="${ER}" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`;
    body += `<g class="b1"><g class="fin fin1 jig" style="animation-delay:.4s">${dots}</g></g>`;
    body += at(1, 'pop', tag(110, 50, '공기', COLD), 1);
    // 칸 2: 위에서 땅을 누른다
    [80, 180, 460, 560].forEach((x, k) => { body += grow(2, x, 210, x, 286, C.blue, 7, f(k * 0.15)); });
    // 칸 3: 땅 위 상자를 모든 방향에서
    body += at(3, 'rise', `<rect x="280" y="240" width="80" height="60" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`, 0);
    [[320, 180, 320, 234], [220, 270, 274, 270], [420, 270, 366, 270], [250, 200, 284, 236], [390, 200, 356, 236]].forEach(([a, b2, c, d], k) => { body += grow(3, a, b2, c, d, C.purple, 6, f(0.3 + k * 0.12)); });
    body += at(3, 'pop', tag(530, 50, '대기압', KEY, { size: 26 }), 1);
    put('7-2/과학/6/대기압', svg(id, body, css));
  })();

  // ── 보일 법칙: 온도는 그대로, 피스톤을 눌러 부피를 반으로 줄이면 압력은 2배 ──
  (function () {
    const id = 't72-s6-boyle';
    let css = base(id);
    const x0 = 170, x1 = 370, bottom = 320, p0 = 100, p1 = 210;
    let body = cylinder(x0, x1, 60, bottom);
    const big = gas(id, 'a', [x0 + 4, p0 + 18, x1 - 4, bottom - 4], 10, 3, { speed: 1.3 });
    const small = gas(id, 'b', [x0 + 4, p1 + 18, x1 - 4, bottom - 4], 10, 3, { speed: 1.3 });
    body += `<g class="h2">${big.body}</g><g class="b2">${small.body}</g>`;
    css += big.css + small.css;
    const wts = `<g class="b2"><g class="drop drop2"><rect x="${(x0 + x1) / 2 - 50}"  y="${p0 - 100}" width="100" height="30" rx="5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/></g></g>`;
    body += piston(x0, x1, p0, 'ps', wts);
    css += steps(id, 'ps', ['translateY(0px)', null, `translateY(${p1 - p0}px)`], 1.2, 0.7);
    const D = dial(520, 120, 64, 3, 'nd', '압력');
    body += D.s; css += D.css(id) + steps(id, 'nd', [`rotate(${D.ang(1)}deg)`, null, `rotate(${D.ang(2)}deg)`], 1.2, 0.8);
    body += thermo(520, 236, 300, 'tm') + text(560, 278, '온도', { size: 18, anchor: 'start' });
    body += `<g class="b1 h2">${g('pop pop1', tag(270, 345, '부피 2', OK, { size: 18 }), 0.4)}</g>`;
    body += at(2, 'pop', tag(110, 266, '부피 1', OK, { size: 18 }), 1.6) + ring(520, 120, 70, 2, C.red, 1.6);
    body += at(3, 'pop', tag(110, 60, '보일 법칙', KEY, { size: 22 }), 0.5) + glowRect(498, 220, 44, 104, 3, C.green, 0.2, 20) + at(3, 'pop', tag(596, 236, '그대로', OK, { size: 18 }), 0.9);
    put('7-2/과학/6/보일 법칙', svg(id, body, css));
  })();

  // ── 샤를 법칙: 누르는 힘(압력)은 그대로, 데우면 입자가 빨라져 피스톤이 올라간다 ──
  (function () {
    const id = 't72-s6-charles';
    let css = base(id);
    const x0 = 120, x1 = 300, bottom = 290, p0 = 190, p1 = 100;
    let body = cylinder(x0, x1, 50, bottom);
    const cold = gas(id, 'a', [x0 + 4, p0 + 18, x1 - 4, bottom - 4], 9, 5, { speed: 0.6 });
    const hot = gas(id, 'b', [x0 + 4, p1 + 18, x1 - 4, bottom - 4], 9, 5, { speed: 1.9, color: C.red });
    body += `<g class="h2">${cold.body}</g><g class="b2">${hot.body}</g>`;
    css += cold.css + hot.css;
    body += piston(x0, x1, p0, 'ps', `<rect x="${(x0 + x1) / 2 - 36}" y="${p0 - 60}" width="72" height="26" rx="5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`);
    css += steps(id, 'ps', ['translateY(0px)', null, `translateY(${p1 - p0}px)`], 1.4, 0.8);
    body += `<g class="b2">${g('rise rise2', flame(180, 340) + flame(240, 340), 0)}</g>`;
    body += thermo(350, 120, 280, 'tm');
    css += `.sc-${id} .tm { transform-box: fill-box; transform-origin: 50% 100%; }` + steps(id, 'tm', ['scaleY(.35)', null, 'scaleY(.9)'], 1.4, 0.6);
    body += `<g class="b1 h2">${g('pop pop1', tag(390, 330, '차가움', COLD, { size: 18 }), 0.3)}</g>` + at(2, 'pop', tag(390, 330, '뜨거움', HOT, { size: 18 }), 1);
    body += ring(350, 140, 22, 2, C.red, 1.6);
    // 오른쪽 그래프: 온도가 높아지면 부피가 늘어난다
    const O = [430, 290];
    body += `<path d="M${O[0]} ${O[1] - 190} V${O[1]} H${O[0] + 180}" fill="none" stroke="${C.ink}" stroke-width="3"/>` + text(O[0] + 180, O[1] + 26, '온도', { size: 18, anchor: 'end' }) + text(O[0], O[1] - 200, '부피', { size: 18 });
    body += at(1, 'pop', dot(O[0] + 40, O[1] - 70, C.blue, 8), 0.6) + at(2, 'pop', dot(O[0] + 150, O[1] - 160, C.red, 8), 1.8);
    body += drawPath(`M${O[0] + 10} ${O[1] - 44} L${O[0] + 170} ${O[1] - 177}`, 3, C.purple, 4, 0);
    body += at(2, 'pop', tag(560, 50, '압력 그대로', GRAY, { size: 18 }), 0.4);
    body += at(3, 'pop', tag(560, 200, '샤를 법칙', KEY, { size: 22 }), 0.8);
    put('7-2/과학/6/샤를 법칙', svg(id, body, css));
  })();

  // ── 반비례: 압력이 2배·3배가 되면 부피는 2분의 1·3분의 1 ──
  (function () {
    const id = 't72-s6-banbi';
    let css = base(id);
    const O = [70, 300], xu = 36, yu = 34, P = (x, y) => [O[0] + x * xu, O[1] - y * yu];
    let body = `<path d="M${O[0]} 66 V${O[1]} H${O[0] + 236}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    for (let k = 1; k <= 6; k++) {
      body += `<path d="M${P(k, 0)[0]} ${O[1]} v8 M${O[0]} ${P(0, k)[1]} h-8" stroke="${C.ink}" stroke-width="2"/>` + text(P(k, 0)[0], O[1] + 28, k, { size: 18, weight: 600 }) + text(O[0] - 18, P(0, k)[1] + 6, k, { size: 18, weight: 600 });
    }
    body += text(O[0] + 236, O[1] - 12, '압력', { size: 18, anchor: 'end' }) + text(O[0] + 36, 62, '부피', { size: 18 });
    const pts = [[1, 6, 1], [2, 3, 1], [3, 2, 2]];
    pts.forEach(([x, y, n], k) => {
      const [px, py] = P(x, y);
      body += at(n, 'fin', `<path d="M${px} ${O[1]} V${py} H${O[0]}" fill="none" stroke="${C.muted}" stroke-width="2" stroke-dasharray="4 5"/>`, f(0.2 + (k % 2) * 0.6)) + at(n, 'pop', dot(px, py, C.red, 8), f(0.3 + (k % 2) * 0.6));
    });
    // 표
    const cx1 = 440, cx2 = 540, ry = [130, 190, 250];
    body += tag(cx1, 74, '압력', GRAY) + tag(cx2, 74, '부피', GRAY);
    pts.forEach(([x, y, n], k) => {
      body += at(n, 'pop', `<rect x="${cx1 - 36}" y="${ry[k] - 24}" width="172" height="48" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/>` + text(cx1, ry[k] + 8, x, { size: 24 }) + text(cx2, ry[k] + 8, y, { size: 24 }), f(0.3 + (k % 2) * 0.6));
    });
    const arc = (x, y1, y2, bend, color) => `<path d="M${x} ${y1} Q${x + bend} ${(y1 + y2) / 2} ${x} ${y2}" fill="none" stroke="${color}" stroke-width="3.5"/>` + `<path d="M${x + (bend > 0 ? 2 : -2)} ${y2 - 12} L${x} ${y2} L${x + (bend > 0 ? 12 : -12)} ${y2 - 4}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    body += at(1, 'fin', arc(400, 136, 184, -26, C.orange) + text(354, 168, '×2', { size: 20, color: C.orange }), 1.2) + at(1, 'fin', arc(580, 136, 184, 26, C.blue) + text(622, 168, '×½', { size: 20, color: C.blue }), 1.6);
    body += at(2, 'fin', arc(400, 136, 244, -58, C.orange) + text(322, 214, '×3', { size: 20, color: C.orange }), 0.9) + at(2, 'fin', arc(580, 136, 244, 58, C.blue) + text(620, 286, '×⅓', { size: 20, color: C.blue }), 1.3);
    // 칸 3: 곡선
    let d = '';
    for (let x = 1; x <= 6.01; x += 0.25) { const [px, py] = P(x, 6 / x); d += `${d ? 'L' : 'M'}${f(px)} ${f(py)} `; }
    body += drawPath(d, 3, C.purple, 4, 0);
    body += at(3, 'pop', tag(490, 330, '반비례', KEY, { size: 24 }), 1);
    put('7-2/과학/6/반비례', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
