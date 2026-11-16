// 과학 중2-1(8-1) Ⅳ단원 「물질의 구성」 낱말 도식: 원자 모형은 교과서 공통의 간단한 모형(가운데 원자핵에 (+)전하량, 둘레 점선 위에 (−) 전자).
// 원자핵은 살구색·빨강, 전자는 하늘색·파랑, 중성자는 흰색·회색. 원자 크기와 원자핵 크기의 비는 실제와 다르게 줄였다. 모양·위치 속성은 CSS 로 바꾸지 않는다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  const at = (n, kind, inner, s = 0, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.34 : /[+−=×÷<>]/.test(c) ? 0.78 : 0.62), 0) * size;
  const OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple], KEY = [C.peach, C.red], HOT = [C.peach, C.red], COLD = [C.sky, C.blue];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const drawPath = (d, n, color, w = 4, s = 0, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`)).join('');
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .spin, .sc-${id} .rot { transform-box: view-box; }
    .sc-${id} .gx { transform-box: fill-box; transform-origin: 0% 50%; }
    .sc-${id} .gy { transform-box: fill-box; transform-origin: 50% 0%; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.18); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-gx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @keyframes ${id}-gy { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes ${id}-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes ${id}-unspin { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .6s ease-in-out .2s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1s ease-out .2s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk .8s ease-in-out .1s both; }
    .on${n} .sc-${id} .gx${n} { animation: ${id}-gx .8s ease-out both; }
    .on${n} .sc-${id} .gy${n} { animation: ${id}-gy .8s ease-out both; }`;
    return s;
  };
  const rad = (d) => (d * Math.PI) / 180;
  const polar = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const head = (x, y, a, color, l = 14, w = 8) => {
    const bx = x - l * Math.cos(a), by = y - l * Math.sin(a), px = -Math.sin(a) * w, py = Math.cos(a) * w;
    return `<path d="M${f(x)} ${f(y)} L${f(bx + px)} ${f(by + py)} L${f(bx - px)} ${f(by - py)} Z" fill="${color}"/>`;
  };
  const arrow = (x1, y1, x2, y2, color = C.muted, w = 4) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>` + head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color);

  // ── 원자 모형 조각 ──
  const nucleus = (x, y, Z, r = 24, label = true) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>` + (label ? text(f(x), f(y + 7), `+${Z}`, { size: 20, color: C.red }) : '');
  const electron = (x, y, r = 11) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>` + text(f(x), f(y + 6.5), '−', { size: 20, color: C.blue });
  const orbit = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
  const angles = (n, start = -90) => Array.from({ length: n }, (_, k) => start + (360 * k) / n);
  // 끊임없이 도는 전자들(글자는 거꾸로 돌려 똑바로 둔다)
  const spinning = (id, x, y, r, angs, dur = 6) => `<g class="spin" style="transform-origin:${x}px ${y}px;animation:${id}-spin ${dur}s linear infinite">`
    + angs.map((a) => { const [ex, ey] = polar(x, y, r, a); return `<g class="spin" style="transform-origin:${f(ex)}px ${f(ey)}px;animation:${id}-unspin ${dur}s linear infinite">${electron(ex, ey)}</g>`; }).join('') + `</g>`;
  const proton = (x, y, r = 13) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.peach}" stroke="${C.red}" stroke-width="2.5"/>` + text(f(x), f(y + r * 0.5), '+', { size: Math.max(18, r * 1.3), color: C.red });
  const neutron = (x, y, r = 13) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`;
  // 공 모형 원자
  const ball = (x, y, el) => {
    const st = { H: [18, C.sky, C.blue, 18], O: [28, C.peach, C.red, 22], C: [26, '#d9dcd6', C.ink, 22] }[el];
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${st[0]}" fill="${st[1]}" stroke="${st[2]}" stroke-width="3"/>` + text(f(x), f(y + st[3] * 0.36), el, { size: st[3], color: st[2] });
  };
  // 화학식·이온식: [글자, 아래첨자/위첨자] 조각
  const formula = (x, y, parts, size = 46) => {
    let s = `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${C.ink}">`;
    let back = 0;
    parts.forEach(([t, kind]) => {
      if (!kind) { s += `<tspan${back ? ` dy="${-back}"` : ''}>${t}</tspan>`; back = 0; }
      else if (kind === 'sub') { back = Math.round(size * 0.24); s += `<tspan font-size="${Math.round(size * 0.62)}" dy="${back}" fill="${C.red}">${t}</tspan>`; }
      else s += `<tspan font-size="${Math.round(size * 0.62)}" dy="${-Math.round(size * 0.42)}" fill="${C.red}">${t}</tspan>`;
    });
    return s + '</text>';
  };

  // ── 원소: 물은 수소와 산소로 나뉘지만, 수소와 산소는 더 나누어지지 않는다 ──
  (function () {
    const id = 't81-s4-wonso';
    let css = base(id);
    const card = (x, y, label, [fill, stroke], w = 120) => `<rect x="${x - w / 2}" y="${y - 30}" width="${w}" height="60" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + text(x, y + 9, label, { size: 26 });
    const bolt = (x, y) => `<path d="M${x + 4} ${y - 20} L${x - 9} ${y + 3} H${x + 1} L${x - 4} ${y + 20} L${x + 10} ${y - 4} H${x} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`;
    let body = card(100, 185, '물', COLD);
    body += at(1, 'pop', bolt(196, 185), 0.1);
    body += drawPath('M164 172 L262 122', 1, C.muted, 4, 0.3) + drawPath('M164 198 L262 248', 1, C.muted, 4, 0.3);
    body += at(1, 'fin', head(262, 122, Math.atan2(-50, 98), C.muted) + head(262, 248, Math.atan2(50, 98), C.muted), 0.9);
    body += at(1, 'pop', card(330, 110, '수소', OK), 1.1) + at(1, 'pop', card(330, 260, '산소', LIL), 1.3);
    const cross = (x, y) => `<path d="M${x - 14} ${y - 14} L${x + 14} ${y + 14} M${x + 14} ${y - 14} L${x - 14} ${y + 14}" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`;
    [110, 260].forEach((y, k) => {
      body += at(2, 'pop', bolt(420, y), 0.1 + k * 0.2) + drawPath(`M396 ${y} H478`, 2, C.muted, 4, 0.3 + k * 0.2) + at(2, 'pop', cross(500, y), 0.9 + k * 0.2) + at(2, 'pop', tag(574, y, '안 나뉨', GRAY, { size: 18 }), 1.2 + k * 0.2);
    });
    body += glowRect(266, 76, 128, 68, 3, C.red, 0.1) + glowRect(266, 226, 128, 68, 3, C.red, 0.3) + at(3, 'pop', tag(330, 185, '원소', KEY, { size: 24 }), 0.5);
    put('8-1/과학/4/원소', svg(id, body, css));
  })();

  // ── 원소 기호: 이름의 알파벳 첫 글자(첫 글자가 같으면 둘째 글자를 소문자로 붙임) ──
  (function () {
    const id = 't81-s4-wonsogiho';
    let css = base(id);
    const items = [['수소', 'Hydrogen', 'H', 1], ['산소', 'Oxygen', 'O', 1], ['탄소', 'Carbon', 'C', 1], ['철', 'Ferrum', 'Fe', 2]];
    let body = '';
    items.forEach(([ko, en, sym, k], i) => {
      const x = 110 + i * 140;
      body += at(1, 'pop', `<rect x="${x - 55}" y="63" width="110" height="50" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(x, 96, ko, { size: 22 }), 0.1 + i * 0.15);
      const hl = sym === 'Fe' ? `<tspan fill="${C.red}">F</tspan><tspan fill="${C.blue}">e</tspan>${en.slice(2)}` : `<tspan fill="${C.red}">${en[0]}</tspan>${en.slice(1)}`;
      body += at(2, 'fin', `<text x="${x}" y="150" text-anchor="middle" font-size="19" font-weight="700" fill="${C.muted}">${hl}</text>`, 0.1 + i * 0.12);
      body += drawPath(`M${x} 162 V192`, 2, C.muted, 3.5, 0.4 + i * 0.12) + at(2, 'fin', head(x, 198, Math.PI / 2, C.muted), 0.9 + i * 0.12);
      const symMark = sym === 'Fe' ? `<tspan fill="${C.red}">F</tspan><tspan fill="${C.blue}">e</tspan>` : `<tspan fill="${C.red}">${sym}</tspan>`;
      body += at(2, 'drop', `<rect x="${x - 42}" y="208" width="84" height="84" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/><text x="${x}" y="266" text-anchor="middle" font-size="46" font-weight="700">${symMark}</text>`, 1.0 + i * 0.15);
      body += glowRect(x - 48, 202, 96, 96, 3, C.red, 0.1 + i * 0.15, 14);
      void k;
    });
    body += at(3, 'pop', tag(320, 34, '원소 기호', KEY, { size: 22 }), 0.6);
    put('8-1/과학/4/원소 기호', svg(id, body, css));
  })();

  // ── 화합물: 수소와 산소가 결합해 물이 된다 ──
  (function () {
    const id = 't81-s4-hwahapmul';
    let css = base(id);
    const W = [[480, 108], [480, 252]], hx = 31, hy = 26;
    // [원소, 끝 자리, 처음 자리]
    const atoms = [
      ['H', [W[0][0] - hx, W[0][1] + hy], [96, 110]], ['H', [W[0][0] + hx, W[0][1] + hy], [124, 110]],
      ['H', [W[1][0] - hx, W[1][1] + hy], [96, 260]], ['H', [W[1][0] + hx, W[1][1] + hy], [124, 260]],
      ['O', W[0], [248, 185]], ['O', W[1], [292, 185]]
    ];
    let body = '';
    atoms.forEach(([el, [x, y], [sx, sy]], k) => {
      body += `<g class="a${k}">${ball(x, y, el)}</g>`;
      css += steps(id, `a${k}`, [`translate(${f(sx - x)}px, ${f(sy - y)}px)`, null, 'translate(0px, 0px)'], 1.3, 0.2 + (el === 'O' ? 0 : 0.1));
    });
    body = shown(1, body);
    body += at(1, 'pop', tag(110, 185, '수소', OK, { size: 20 }), 0.4, 2) + at(1, 'pop', tag(270, 240, '산소', LIL, { size: 20 }), 0.6, 2);
    body += at(2, 'pop', tag(480, 185, '물', COLD, { size: 22 }), 1.5);
    body += at(2, 'pop', tag(220, 320, '수소 + 산소 → 물', GRAY, { size: 20 }), 1.6);
    body += glowRect(424, 68, 112, 240, 3, C.red, 0.1) + at(3, 'pop', tag(300, 46, '화합물', KEY, { size: 24 }), 0.4) + at(3, 'fin', lead(350, 54, 424, 90), 0.6);
    put('8-1/과학/4/화합물', svg(id, body, css));
  })();

  // ── 원자: 연필심을 크게 보면 알갱이가 모여 있고, 알갱이 하나는 원자핵과 전자로 되어 있다 ──
  (function () {
    const id = 't81-s4-wonja';
    let css = base(id);
    let body = `<rect x="22" y="160" width="124" height="40" rx="4" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/><path d="M146 160 L196 180 L146 200 Z" fill="${C.peach}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M181 174 L196 180 L181 186 Z" fill="${C.ink}"/>`;
    body += text(150, 236, '연필심', { size: 20 }) + lead(170, 218, 188, 188);
    const Z1 = [338, 180], r1 = 88;
    let pack = `<defs><clipPath id="${id}-z1"><circle cx="${Z1[0]}" cy="${Z1[1]}" r="${r1}"/></clipPath></defs>`
      + lead(196, 180, Z1[0] - 40, Z1[1] - 78) + lead(196, 180, Z1[0] - 40, Z1[1] + 78)
      + `<circle cx="${Z1[0]}" cy="${Z1[1]}" r="${r1}" fill="white" stroke="${C.ink}" stroke-width="4"/><g clip-path="url(#${id}-z1)">`;
    for (let r = -3; r <= 3; r++) for (let c = -4; c <= 4; c++) {
      const x = Z1[0] + c * 36 + (r % 2 ? 18 : 0), y = Z1[1] + r * 31;
      if (Math.hypot(x - Z1[0], y - Z1[1]) < r1 + 14) pack += `<circle cx="${x}" cy="${y}" r="16" fill="#d9dcd6" stroke="${C.muted}" stroke-width="2"/>`;
    }
    pack += `</g>`;
    body += at(1, 'pop', pack, 0.2);
    // 칸 2: 가운데 알갱이 하나를 더 크게
    const Z2 = [548, 180], r2 = 84;
    body += at(2, 'fin', `<circle cx="${Z1[0]}" cy="${Z1[1]}" r="16" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>` + lead(Z1[0] + 14, Z1[1] - 8, Z2[0] - 50, Z2[1] - 67) + lead(Z1[0] + 14, Z1[1] + 8, Z2[0] - 50, Z2[1] + 67), 0.1);
    body += at(2, 'pop', `<circle cx="${Z2[0]}" cy="${Z2[1]}" r="${r2}" fill="white" stroke="${C.ink}" stroke-width="4"/>${orbit(Z2[0], Z2[1], 58)}${nucleus(Z2[0], Z2[1], 6, 22)}`, 0.4);
    body += shown(2, spinning(id, Z2[0], Z2[1], 58, angles(6), 7));
    body += ring(Z1[0], Z1[1], 18, 3, C.red) + at(3, 'pop', tag(Z1[0], 312, '원자', KEY, { size: 24 }), 0.4) + at(3, 'fin', lead(Z1[0], 294, Z1[0], 198), 0.6);
    put('8-1/과학/4/원자', svg(id, body, css));
  })();

  // ── 원자핵: 가운데의 (+)전하 알갱이, 원자 질량의 대부분 ──
  (function () {
    const id = 't81-s4-wonjahaek';
    let css = base(id);
    const A = [200, 180], R = 106;
    let body = orbit(A[0], A[1], R) + `<g class="nuc">${nucleus(A[0], A[1], 2, 26)}</g>` + spinning(id, A[0], A[1], R, [-90, 90], 6);
    css += `.sc-${id} .nuc { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .nuc { animation: ${id}-pulse .6s ease-in-out .2s 2; }`;
    body += ring(A[0], A[1], 30, 2, C.red, 0.1);
    // 칸 2: 저울. 원자핵 쪽으로 기운다
    const PX = 470, PY = 150, L = 96;
    const pan = (x, inner) => `<path d="M${x} ${PY} L${x - 34} ${PY + 58} M${x} ${PY} L${x + 34} ${PY + 58}" stroke="${C.muted}" stroke-width="2.5"/><path d="M${x - 44} ${PY + 58} H${x + 44} Q${x} ${PY + 84} ${x - 44} ${PY + 58} Z" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5"/>${inner}`;
    let scale = `<path d="M${PX} ${PY} V292 M${PX - 50} 296 H${PX + 50}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
    scale += `<g class="beam"><path d="M${PX - L} ${PY} H${PX + L}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/></g>`;
    scale += `<g class="panL">${pan(PX - L, nucleus(PX - L, PY + 42, 2, 18, false) + text(PX - L, PY + 49, '+2', { size: 18, color: C.red }))}</g>`;
    scale += `<g class="panR">${pan(PX + L, electron(PX + L - 12, PY + 48, 9) + electron(PX + L + 12, PY + 48, 9))}</g>`;
    scale += `<circle cx="${PX}" cy="${PY}" r="7" fill="${C.ink}"/>`;
    const dy = f(L * Math.sin(rad(12)));
    css += `.sc-${id} .beam { transform-box: view-box; transform-origin: ${PX}px ${PY}px; }`
      + steps(id, 'beam', ['rotate(0deg)', null, 'rotate(-12deg)'], 0.9, 0.8) + steps(id, 'panL', ['translate(0px, 0px)', null, `translate(0px, ${dy}px)`], 0.9, 0.8) + steps(id, 'panR', ['translate(0px, 0px)', null, `translate(0px, ${-dy}px)`], 0.9, 0.8);
    body += at(2, 'fin', scale, 0.1);
    body += at(3, 'pop', tag(A[0], 330, '원자핵', KEY, { size: 22 }), 0.3) + at(3, 'fin', lead(A[0], 311, A[0], 208), 0.5) + ring(A[0], A[1], 30, 3, C.red, 0.2);
    put('8-1/과학/4/원자핵', svg(id, body, css));
  })();

  // ── 양성자: 원자핵 속 (+)전하 알갱이, 그 수가 원소를 정한다 ──
  (function () {
    const id = 't81-s4-yangseongja';
    let css = base(id);
    const A = [110, 136], Z = [380, 136];
    let body = orbit(A[0], A[1], 60) + nucleus(A[0], A[1], 2, 12, false) + spinning(id, A[0], A[1], 60, [-90, 90], 6);
    body += at(1, 'pop', lead(A[0] + 10, A[1] - 7, Z[0] - 40, Z[1] - 78) + lead(A[0] + 10, A[1] + 7, Z[0] - 40, Z[1] + 78)
      + `<circle cx="${Z[0]}" cy="${Z[1]}" r="88" fill="white" stroke="${C.ink}" stroke-width="4"/>`
      + neutron(Z[0] + 25, Z[1] - 25, 30) + neutron(Z[0] - 25, Z[1] + 25, 30), 0.2);
    const P1 = [Z[0] - 25, Z[1] - 25], P2 = [Z[0] + 25, Z[1] + 25];
    body += at(1, 'pop', `<g class="pp">${proton(P1[0], P1[1], 30)}</g><g class="pp">${proton(P2[0], P2[1], 30)}</g>`, 0.2);
    css += `.sc-${id} .pp { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .pp { animation: ${id}-pulse .6s ease-in-out .2s 2; }`;
    body += ring(P1[0], P1[1], 32, 2, C.red, 0.1) + ring(P2[0], P2[1], 32, 2, C.red, 0.3);
    body += at(2, 'pop', tag(548, 84, '중성자', GRAY, { size: 20 }), 0.8) + at(2, 'fin', lead(500, 92, Z[0] + 50, Z[1] - 30), 1.0);
    // 칸 3: 양성자 수가 1·2·3 개인 원자핵
    const small = [
      [140, [[0, 0, 'p']], '수소'],
      [320, [[-14, -14, 'p'], [14, 14, 'p'], [14, -14, 'n'], [-14, 14, 'n']], '헬륨'],
      [500, [[0, 0, 'n'], [26, 0, 'p'], [13, 22.5, 'n'], [-13, 22.5, 'p'], [-26, 0, 'n'], [-13, -22.5, 'p'], [13, -22.5, 'n']], '리튬']
    ];
    small.forEach(([x, parts, name], k) => {
      const inner = parts.map(([dx, dy, t]) => (t === 'p' ? proton(x + dx, 288 + dy, 13) : neutron(x + dx, 288 + dy, 13))).join('');
      body += at(3, 'pop', inner + text(x, 350, name, { size: 20 }), 0.1 + k * 0.3);
    });
    body += at(4, 'pop', tag(548, 196, '양성자', KEY, { size: 22 }), 0.3) + at(4, 'fin', lead(502, 192, P2[0] + 30, P2[1] + 4), 0.5) + ring(P1[0], P1[1], 32, 4, C.red, 0.1) + ring(P2[0], P2[1], 32, 4, C.red, 0.2);
    put('8-1/과학/4/양성자', svg(id, body, css));
  })();

  // ── 전자: 원자핵 둘레를 움직이는 (−)전하 알갱이 ──
  (function () {
    const id = 't81-s4-jeonja';
    let css = base(id);
    const A = [220, 185], R = 104;
    let body = orbit(A[0], A[1], R) + at(1, 'pop', nucleus(A[0], A[1], 3, 26), 0.1) + ring(A[0], A[1], 30, 1, C.red, 0.5);
    // 칸 2: 전자 셋이 120° 돌아 제자리에 선다(이름표가 따라가지 않아도 되게)
    let es = '';
    angles(3).forEach((a) => { const [x, y] = polar(A[0], A[1], R, a); es += `<g class="up">${electron(x, y, 14)}</g>`; });
    body += `<g class="b2"><g class="rot">${es}</g></g>`;
    css += `.sc-${id} .rot { transform-origin: ${A[0]}px ${A[1]}px; } .sc-${id} .up { transform-box: fill-box; transform-origin: center; }` + steps(id, 'rot', ['rotate(-120deg)', null, 'rotate(0deg)'], 1.5, 0.1) + steps(id, 'up', ['rotate(120deg)', null, 'rotate(0deg)'], 1.5, 0.1);
    body += at(2, 'pop', tag(480, 185, '(+3) + (−3) = 0', LIL, { size: 20 }), 1.5);
    const [ex, ey] = polar(A[0], A[1], R, -90);
    body += angles(3).map((a, k) => { const [x, y] = polar(A[0], A[1], R, a); return ring(x, y, 15, 3, C.blue, k * 0.15); }).join('');
    body += at(3, 'pop', tag(380, 64, '전자', KEY, { size: 22 }), 0.4) + at(3, 'fin', lead(350, 66, ex + 16, ey - 2), 0.6);
    put('8-1/과학/4/전자', svg(id, body, css));
  })();

  // ── 전하: (+)와 (−)는 끌어당기고, 같은 것끼리는 밀어 낸다 ──
  (function () {
    const id = 't81-s4-jeonha';
    let css = base(id);
    let body0 = '';
    const ch = (x, y, s) => (s > 0 ? `<circle cx="${x}" cy="${y}" r="30" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>` + text(x, y + 11, '+', { size: 32, color: C.red })
      : `<circle cx="${x}" cy="${y}" r="30" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + text(x, y + 11, '−', { size: 32, color: C.blue }));
    const fa = (x1, x2, y, color) => arrow(x1, y, x2, y, color, 5);
    const rows = [
      // y, [x 끝, 처음 옮김, 부호, 힘 화살표(끝 자리 기준)]
      [82, [[244, -50, 1, [278, 308]], [396, 50, -1, [362, 332]]], '당김', 1],
      [185, [[230, 50, 1, [196, 170]], [410, -50, 1, [444, 470]]], '밂', 2],
      [288, [[230, 50, -1, [196, 170]], [410, -50, -1, [444, 470]]], '밂', 2]
    ];
    rows.forEach(([y, balls, label, n], r) => {
      balls.forEach(([x, dx, s, [a1, a2]], k) => {
        const cls = `m${r}${k}`;
        body0 += `<g class="b${n}"><g class="${cls}">${ch(x, y, s)}${fa(a1, a2, y, s > 0 ? C.red : C.blue)}</g></g>`;
        css += steps(id, cls, [`translate(${dx}px, 0px)`, ...(n === 1 ? ['translate(0px, 0px)'] : [null, 'translate(0px, 0px)'])], 1.1, 0.4);
      });
      body0 += at(n, 'pop', tag(560, y, label, n === 1 ? LIL : GRAY, { size: 22 }), 1.4 + (r === 2 ? 0.2 : 0));
    });
    body0 += glowRect(140, 40, 360, 290, 3, C.purple, 0.1, 18) + at(3, 'pop', tag(72, 185, '전하', KEY, { size: 24 }), 0.4);
    put('8-1/과학/4/전하', svg(id, body0, css));
  })();
  // ── 원자 모형: 가운데 원자핵, 둘레에 전자. 수소(+1, 전자 1개)와 헬륨(+2, 전자 2개) ──
  (function () {
    const id = 't81-s4-wonjamohyeong';
    let css = base(id);
    const H = [170, 165], He = [460, 165], R = 85;
    let body = shown(1, orbit(H[0], H[1], R) + orbit(He[0], He[1], R));
    body += at(1, 'pop', nucleus(H[0], H[1], 1, 24), 0.1) + at(1, 'pop', nucleus(He[0], He[1], 2, 24), 0.3);
    body += at(1, 'pop', tag(315, 165, '원자핵', HOT, { size: 20 }), 0.8) + at(1, 'fin', lead(272, 165, H[0] + 26, H[1]) + lead(358, 165, He[0] - 26, He[1]), 1.0);
    // 칸 2: 전자가 반 바퀴 돌아 위·아래에 선다
    const eH = `<g class="rotH">${electron(H[0], H[1] - R, 14)}</g>`;
    const eHe = `<g class="rotHe">${electron(He[0], He[1] - R, 14)}${electron(He[0], He[1] + R, 14)}</g>`;
    body += shown(2, eH + eHe);
    css += `.sc-${id} .rotH { transform-box: view-box; transform-origin: ${H[0]}px ${H[1]}px; } .sc-${id} .rotHe { transform-box: view-box; transform-origin: ${He[0]}px ${He[1]}px; }`
      + steps(id, 'rotH', ['rotate(-180deg)', null, 'rotate(0deg)'], 1.5, 0.1) + steps(id, 'rotHe', ['rotate(-180deg)', null, 'rotate(0deg)'], 1.5, 0.1);
    body += at(2, 'pop', tag(315, 72, '전자', COLD, { size: 20 }), 1.6) + at(2, 'fin', lead(286, 74, H[0] + 15, H[1] - R + 4) + lead(344, 74, He[0] - 15, He[1] - R + 4), 1.7);
    body += at(2, 'pop', text(H[0], 300, '수소', { size: 22 }) + text(He[0], 300, '헬륨', { size: 22 }), 1.2);
    body += glowRect(70, 64, 200, 202, 3, C.purple, 0.1, 100) + glowRect(360, 64, 200, 202, 3, C.purple, 0.3, 100) + at(3, 'pop', tag(315, 30, '원자 모형', KEY, { size: 22 }), 0.5);
    put('8-1/과학/4/원자 모형', svg(id, body, css));
  })();

  // ── 원자 번호: 양성자 수 1·2·3 → 번호 1·2·3 ──
  (function () {
    const id = 't81-s4-wonjabeonho';
    let css = base(id);
    const els = [[120, 1, 'H', '수소'], [320, 2, 'He', '헬륨'], [520, 3, 'Li', '리튬']], ay = 108, R = 56;
    let body = '';
    els.forEach(([x, Z, sym, name], k) => {
      const es = angles(Z, Z === 2 ? 0 : -90).map((a) => { const [ex, ey] = polar(x, ay, R, a); return electron(ex, ey, 11); }).join('');
      body += at(1, 'pop', orbit(x, ay, R) + `<g class="nz${k}">${nucleus(x, ay, Z, 22)}</g>` + es, 0.1 + k * 0.25);
      css += `.sc-${id} .nz${k} { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .nz${k} { animation: ${id}-pulse .6s ease-in-out ${f(0.9 + k * 0.25)}s 2; }`;
      // 칸 2: 주기율표 칸
      const box = `<rect x="${x - 50}" y="200" width="100" height="96" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`
        + text(x - 34, 226, Z, { size: 22, color: C.red, anchor: 'start' }) + text(x, 262, sym, { size: 32 }) + text(x, 288, name, { size: 18, color: C.muted });
      body += at(2, 'drop', box, 0.6 + k * 0.25);
      body += at(2, 'fin', arrow(x - 8, ay + 26, x - 26, 194, C.red, 3), 0.1 + k * 0.25);
      body += ring(x - 28, 219, 18, 3, C.red, k * 0.15);
    });
    body += at(3, 'pop', tag(320, 330, '원자 번호', KEY, { size: 22 }), 0.5);
    put('8-1/과학/4/원자 번호', svg(id, body, css));
  })();

  // ════ 주기율표(1~20번). 세로줄 1·2·13~18족, 가로줄 1~4주기 ════
  const PT = [['H', 0, 0], ['He', 7, 0], ['Li', 0, 1], ['Be', 1, 1], ['B', 2, 1], ['C', 3, 1], ['N', 4, 1], ['O', 5, 1], ['F', 6, 1], ['Ne', 7, 1],
    ['Na', 0, 2], ['Mg', 1, 2], ['Al', 2, 2], ['Si', 3, 2], ['P', 4, 2], ['S', 5, 2], ['Cl', 6, 2], ['Ar', 7, 2], ['K', 0, 3], ['Ca', 1, 3]];
  const GROUPS = ['1', '2', '13', '14', '15', '16', '17', '18'];
  const cx0 = (c) => 92 + c * 62 + (c >= 2 ? 16 : 0), cy0 = (r) => 74 + r * 64, CW = 58, CH = 58;
  const cell = (k) => {
    const [sym, c, r] = PT[k], x = cx0(c), y = cy0(r);
    return `<rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="6" fill="white" stroke="${C.muted}" stroke-width="2"/>`
      + text(x + 5, y + 19, k + 1, { size: 18, color: C.muted, anchor: 'start', weight: 600 }) + text(x + CW / 2, y + 48, sym, { size: 24 });
  };
  const ptFrame = (popIn) => {
    let s = GROUPS.map((gname, c) => text(cx0(c) + CW / 2, 64, gname, { size: 18, color: C.muted })).join('')
      + [0, 1, 2, 3].map((r) => text(68, cy0(r) + 36, r + 1, { size: 18, color: C.muted })).join('');
    PT.forEach((_, k) => { s += popIn ? at(1, 'pop', cell(k), f(0.1 + k * 0.06)) : cell(k); });
    return s;
  };
  const LIGHT = { [C.orange]: C.peach, [C.purple]: C.lilac, [C.green]: C.mint, [C.blue]: C.sky };
  const tint = (ks, color) => ks.map((k) => { const [, c, r] = PT[k]; return `<rect x="${cx0(c)}" y="${cy0(r)}" width="${CW}" height="${CH}" rx="6" fill="${LIGHT[color]}" stroke="${color}" stroke-width="3"/>`
    + text(cx0(c) + 5, cy0(r) + 19, k + 1, { size: 18, color: C.muted, anchor: 'start', weight: 600 }) + text(cx0(c) + CW / 2, cy0(r) + 48, PT[k][0], { size: 24 }); }).join('');

  // ── 주기율표: 원자 번호 차례로 늘어놓고, 성질이 비슷한 원소는 같은 세로줄 ──
  (function () {
    const id = 't81-s4-jugiyulpyo';
    let css = base(id);
    let body = ptFrame(true);
    body += at(2, 'fin', tint([2, 10, 18], C.orange), 0.1) + at(2, 'fin', tint([8, 16], C.purple), 0.5) + at(2, 'fin', tint([1, 9, 17], C.green), 0.9);
    body += glowRect(84, 46, 524, 286, 3, C.red, 0.1, 12) + at(3, 'pop', tag(420, 295, '주기율표', KEY, { size: 24 }), 0.4);
    put('8-1/과학/4/주기율표', svg(id, body, css));
  })();

  // ── 족: 주기율표의 세로줄 ──
  (function () {
    const id = 't81-s4-jok';
    let css = base(id);
    let body = ptFrame(false);
    const band = (n, c, r0, r1, color, s) => `<g class="b${n}"><g class="gy gy${n}"${dl(s)}><rect x="${cx0(c) - 5}" y="${cy0(r0) - 5}" width="${CW + 10}" height="${(r1 - r0) * 64 + CH + 10}" rx="10" fill="none" stroke="${color}" stroke-width="4"/></g></g>`;
    body += band(2, 0, 0, 3, C.orange, 0.1) + at(2, 'fin', tint([2, 10, 18], C.orange), 0.8);
    body += band(3, 6, 1, 2, C.purple, 0.1) + at(3, 'fin', tint([8, 16], C.purple), 0.6);
    body += ring(cx0(0) + CW / 2, 58, 18, 3, C.orange, 0.8) + ring(cx0(6) + CW / 2, 58, 20, 3, C.purple, 0.9);
    body += at(3, 'pop', tag(420, 295, '족', KEY, { size: 26 }), 1.0);
    put('8-1/과학/4/족', svg(id, body, css));
  })();

  // ── 주기: 주기율표의 가로줄 ──
  (function () {
    const id = 't81-s4-jugi';
    let css = base(id);
    let body = ptFrame(false);
    const band = (n, r, color, s) => `<g class="b${n}"><g class="gx gx${n}"${dl(s)}><rect x="${cx0(0) - 5}" y="${cy0(r) - 5}" width="${cx0(7) + CW - cx0(0) + 10}" height="${CH + 10}" rx="10" fill="none" stroke="${color}" stroke-width="4"/></g></g>`;
    body += band(2, 1, C.orange, 0.1);
    body += band(3, 2, C.blue, 0.1);
    body += ring(68, cy0(1) + 30, 16, 2, C.orange, 0.8) + ring(68, cy0(2) + 30, 16, 3, C.blue, 0.9);
    body += at(3, 'pop', tag(420, 295, '주기', KEY, { size: 26 }), 1.0);
    put('8-1/과학/4/주기', svg(id, body, css));
  })();

  // ── 분자: 원자 셋이 결합한 물 분자 ──
  (function () {
    const id = 't81-s4-bunja';
    let css = base(id);
    const O = [320, 130], hx = 46, hy = 36;
    const big = (x, y, el) => {
      const [r, fill, stroke, size] = el === 'O' ? [40, C.peach, C.red, 28] : [26, C.sky, C.blue, 22];
      return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + text(f(x), f(y + size * 0.36), el, { size, color: stroke });
    };
    let body = `<g class="hA">${big(O[0] - hx, O[1] + hy, 'H')}</g><g class="hB">${big(O[0] + hx, O[1] + hy, 'H')}</g>` + big(O[0], O[1], 'O');
    body = at(1, 'pop', body, 0.1);
    css += steps(id, 'hA', [`translate(${f(150 - (O[0] - hx))}px, ${f(-hy)}px)`, null, 'translate(0px, 0px)'], 1.2, 0.2)
      + steps(id, 'hB', [`translate(${f(490 - (O[0] + hx))}px, ${f(-hy)}px)`, null, 'translate(0px, 0px)'], 1.2, 0.2);
    body += at(2, 'pop', tag(320, 228, '물', COLD, { size: 22 }), 1.4);
    // 칸 3: 다른 분자들
    body += at(3, 'pop', ball(128, 292, 'O') + ball(172, 292, 'O') + text(150, 350, '산소', { size: 20 }), 0.1);
    body += at(3, 'pop', ball(444, 292, 'O') + ball(536, 292, 'O') + ball(490, 292, 'C') + text(490, 350, '이산화 탄소', { size: 20 }), 0.3);
    body += glowRect(242, 80, 156, 120, 3, C.red, 0.2, 40) + at(3, 'pop', tag(320, 300, '분자', KEY, { size: 24 }), 0.6);
    put('8-1/과학/4/분자', svg(id, body, css));
  })();

  // ── 화학식: H₂O, CO₂ ──
  (function () {
    const id = 't81-s4-hwahaksik';
    let css = base(id);
    let body = at(1, 'pop', ball(170, 104, 'O') + ball(170 - 34, 104 + 27, 'H') + ball(170 + 34, 104 + 27, 'H'), 0.1)
      + at(1, 'pop', ball(470 - 52, 116, 'O') + ball(470 + 52, 116, 'O') + ball(470, 116, 'C'), 0.3);
    body += at(1, 'pop', text(170, 196, '물', { size: 22 }) + text(470, 196, '이산화 탄소', { size: 22 }), 0.6);
    body += at(2, 'drop', formula(170, 284, [['H'], ['2', 'sub'], ['O']]), 0.2) + at(2, 'drop', formula(470, 284, [['CO'], ['2', 'sub']]), 0.5);
    body += at(2, 'pop', tag(126, 330, 'H 2개', COLD, { size: 18 }), 1.1) + at(2, 'pop', tag(214, 330, 'O 1개', HOT, { size: 18 }), 1.2)
      + at(2, 'pop', tag(426, 330, 'C 1개', GRAY, { size: 18 }), 1.3) + at(2, 'pop', tag(514, 330, 'O 2개', HOT, { size: 18 }), 1.4);
    body += glowRect(100, 236, 140, 64, 3, C.red, 0.1) + glowRect(400, 236, 140, 64, 3, C.red, 0.3) + at(3, 'pop', tag(320, 268, '화학식', KEY, { size: 22 }), 0.5);
    put('8-1/과학/4/화학식', svg(id, body, css));
  })();

  // ════ 이온: 리튬(+3, 전자 3개) → Li⁺, 플루오린(+9, 전자 9개) → F⁻, 산소(+8, 전자 8개) → O²⁻ ════
  // 떨어져 나가거나 들어오는 전자 하나: 칸 n 에 (x, y) 에서 (dx, dy) 만큼 옮겨 간다. out 이면 사라지고, 아니면 나타난다
  const mover = (id, key, n, x, y, dx, dy, out, s = 0.2) => {
    const css = out
      ? `@keyframes ${id}-${key} { 0% { transform: translate(0px, 0px); opacity: 1; } 75% { opacity: 1; } 100% { transform: translate(${dx}px, ${dy}px); opacity: 0; } } .on${n} .sc-${id} .${key} { animation: ${id}-${key} 1.2s ease-in ${s}s both; }`
      : `@keyframes ${id}-${key} { 0% { transform: translate(${dx}px, ${dy}px); opacity: 0; } 25% { opacity: 1; } 100% { transform: translate(0px, 0px); opacity: 1; } } .sc-${id} .${key} { opacity: 0; } .on${n} .sc-${id} .${key} { animation: ${id}-${key} 1.2s ease-out ${s}s both; }`;
    return { css, body: `<g class="${key}">${electron(x, y, 11)}</g>` };
  };
  const ionAtom = (x, y, Z, r, angs) => orbit(x, y, r) + nucleus(x, y, Z, Z > 5 ? 26 : 24) + angs.map((a) => { const [ex, ey] = polar(x, y, r, a); return electron(ex, ey, 11); }).join('');
  const countRow = (n1, hide, plus, minus, sign, y = 188) => at(n1, 'pop', tag(420, y, `(+)전하 ${plus}`, HOT, { size: 18 }) + text(497, y + 8, sign, { size: 26 }) + tag(574, y, `(−)전하 ${minus}`, COLD, { size: 18 }), n1 === 1 ? 0.6 : 1.3, hide);

  // ── 양이온: 리튬 원자가 전자 1개를 잃는다 ──
  (function () {
    const id = 't81-s4-yangion';
    let css = base(id);
    const A = [200, 180], R = 70;
    let body = ionAtom(A[0], A[1], 3, R, [90, 210]);
    const [mx, my] = polar(A[0], A[1], R, -30), mv = mover(id, 'lv', 2, mx, my, 120, -96, true);
    body += mv.body; css += mv.css;
    body += countRow(1, 2, 3, 3, '=') + countRow(2, null, 3, 2, '>');
    body += at(1, 'pop', tag(A[0], 296, '리튬 원자', GRAY, { size: 20 }), 0.3, 3);
    body += at(3, 'pop', tag(A[0], 296, '리튬 이온', HOT, { size: 20 }), 0.2) + at(3, 'pop', `<circle cx="${A[0] + 62}" cy="${A[1] - 62}" r="17" fill="${C.red}"/>` + text(A[0] + 62, A[1] - 52, '+', { size: 28, color: 'white' }), 0.4);
    body += at(3, 'pop', tag(500, 96, '양이온', KEY, { size: 24 }), 0.6) + at(3, 'pop', formula(500, 300, [['Li'], ['+', 'sup']], 48), 0.9);
    put('8-1/과학/4/양이온', svg(id, body, css));
  })();

  // ── 음이온: 플루오린 원자가 전자 1개를 얻는다 ──
  (function () {
    const id = 't81-s4-eumion';
    let css = base(id);
    const A = [200, 180], R = 84;
    const slots = angles(10, -90), gap = 1;
    let body = ionAtom(A[0], A[1], 9, R, slots.filter((_, k) => k !== gap));
    const [mx, my] = polar(A[0], A[1], R, slots[gap]), mv = mover(id, 'in', 2, mx, my, 120, -80, false);
    body += mv.body; css += mv.css;
    body += countRow(1, 2, 9, 9, '=') + countRow(2, null, 9, 10, '<');
    body += at(1, 'pop', tag(A[0], 306, '플루오린 원자', GRAY, { size: 20 }), 0.3, 3);
    body += at(3, 'pop', tag(A[0], 306, '플루오린화 이온', COLD, { size: 20 }), 0.2) + at(3, 'pop', `<circle cx="${A[0] + 112}" cy="${A[1] - 70}" r="17" fill="${C.blue}"/>` + text(A[0] + 112, A[1] - 61, '−', { size: 28, color: 'white' }), 0.4);
    body += at(3, 'pop', tag(500, 96, '음이온', KEY, { size: 24 }), 0.6) + at(3, 'pop', formula(500, 300, [['F'], ['−', 'sup']], 48), 0.9);
    put('8-1/과학/4/음이온', svg(id, body, css));
  })();

  // ── 이온: 리튬의 전자 1개가 플루오린으로 옮겨 가 둘 다 전하를 띤다 ──
  (function () {
    const id = 't81-s4-ion';
    let css = base(id);
    const L = [150, 170], F = [462, 170], RL = 62, RF = 84;
    let body = ionAtom(L[0], L[1], 3, RL, [120, 240]) + ionAtom(F[0], F[1], 9, RF, angles(10, 180).slice(1));
    body += `<g class="go">${electron(L[0] + RL, L[1], 11)}</g>`;
    css += steps(id, 'go', ['translate(0px, 0px)', null, `translate(${F[0] - RF - L[0] - RL}px, 0px)`], 1.3, 0.2);
    body += at(2, 'fin', `<path d="M${L[0] + RL + 18} ${L[1] - 26} Q${(L[0] + F[0]) / 2} ${L[1] - 60} ${F[0] - RF - 18} ${L[1] - 26}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 5" fill="none"/>` + head(F[0] - RF - 16, L[1] - 24, Math.atan2(16, 40), C.blue), 0.2);
    body += text(L[0], 300, '리튬', { size: 22 }) + text(F[0], 300, '플루오린', { size: 22 });
    body += at(3, 'pop', `<circle cx="${L[0] + 54}" cy="${L[1] - 54}" r="17" fill="${C.red}"/>` + text(L[0] + 54, L[1] - 44, '+', { size: 28, color: 'white' }), 0.2)
      + at(3, 'pop', `<circle cx="${F[0] + 110}" cy="${F[1] - 72}" r="17" fill="${C.blue}"/>` + text(F[0] + 110, F[1] - 63, '−', { size: 28, color: 'white' }), 0.4);
    body += at(3, 'pop', formula(L[0], 346, [['Li'], ['+', 'sup']], 34), 0.6) + at(3, 'pop', formula(F[0], 346, [['F'], ['−', 'sup']], 34), 0.7);
    body += at(3, 'pop', tag(306, 52, '이온', KEY, { size: 24 }), 0.9);
    put('8-1/과학/4/이온', svg(id, body, css));
  })();

  // ── 이온식: 원소 기호 오른쪽 위에 잃거나 얻은 전자 수와 전하의 종류 ──
  (function () {
    const id = 't81-s4-ionsik';
    let css = base(id);
    const L = [160, 128], O = [470, 128], RL = 60, RO = 72;
    let body = ionAtom(L[0], L[1], 3, RL, [90, 210]);
    const [lx, ly] = polar(L[0], L[1], RL, -30), lv = mover(id, 'lv', 1, lx, ly, 96, -78, true, 0.3);
    body += lv.body; css += lv.css;
    body += at(1, 'pop', tag(L[0], 238, '전자 1개 잃음', GRAY, { size: 18 }), 1.2) + at(1, 'drop', formula(L[0], 312, [['Li'], ['+', 'sup']], 50), 1.4);
    const slots = angles(10, -90), gaps = [2, 8];
    body += shown(2, ionAtom(O[0], O[1], 8, RO, slots.filter((_, k) => !gaps.includes(k))));
    gaps.forEach((k, i) => {
      const [x, y] = polar(O[0], O[1], RO, slots[k]), mv = mover(id, `in${i}`, 2, x, y, i ? -90 : 90, -80, false, 0.3 + i * 0.2);
      body += mv.body; css += mv.css;
    });
    body += at(2, 'pop', tag(O[0], 238, '전자 2개 얻음', GRAY, { size: 18 }), 1.3) + at(2, 'drop', formula(O[0], 312, [['O'], ['2−', 'sup']], 50), 1.5);
    body += glowRect(L[0] - 56, 264, 112, 64, 3, C.red, 0.1) + glowRect(O[0] - 60, 264, 120, 64, 3, C.red, 0.3) + at(3, 'pop', tag(315, 296, '이온식', KEY, { size: 22 }), 0.5);
    put('8-1/과학/4/이온식', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
