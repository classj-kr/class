// 과학 중2-2(8-2) Ⅶ단원 「전기와 자기」 낱말 도식: 마찰 전기·대전·전기력·정전기 유도, 전류·전압·저항·옴의 법칙, 직렬·병렬연결, 전기 에너지·소비 전력, 자기력·자기장·코일·전자석·전동기.
// 전자는 (−)극에서 나와 (+)극으로, 전류는 (+)극에서 나와 (−)극으로 흐르게 그린다. 자기장은 자석 밖에서 N극 → S극.
// 코일은 앞쪽 도선(진한 줄)에서 전류가 아래로 흐르면 오른쪽 끝이 N극이다(오른손 네 손가락을 전류 방향으로 감아쥐면 엄지가 N극).
// 모양·위치 속성은 CSS 로 바꾸지 않는다(transform·opacity·stroke-dashoffset 만).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const rad = (a) => (a * Math.PI) / 180;
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.34 : /[+−=×÷→]/.test(c) ? 0.78 : 0.62), 0) * size;
  const HOT = [C.peach, C.red], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], KEY = [C.peach, C.red], SUN = [C.yellow, C.orange];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  const farrow = (x1, y1, x2, y2, color = C.red, w = 7) => {
    const a = Math.atan2(y2 - y1, x2 - x1), hl = w * 2.5, hw = w * 1.5;
    const bx = x2 - hl * Math.cos(a), by = y2 - hl * Math.sin(a), px = -Math.sin(a) * hw, py = Math.cos(a) * hw;
    return `<path d="M${f(x1)} ${f(y1)} L${f(bx)} ${f(by)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`
      + `<path d="M${f(x2)} ${f(y2)} L${f(bx + px)} ${f(by + py)} L${f(bx - px)} ${f(by - py)} Z" fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`;
  };
  const grow = (n, x1, y1, x2, y2, color = C.red, w = 7, s = 0) => `<g class="b${n}"><g class="gr gr${n}" style="transform-origin:${f(x1)}px ${f(y1)}px${s ? `;animation-delay:${s}s` : ''}">${farrow(x1, y1, x2, y2, color, w)}</g></g>`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .gr { transform-box: view-box; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .fl { animation: ${id}-fl 1s linear infinite; }
    .sc-${id} .fl.slow { animation-duration: 2s; }
    .sc-${id} .fl.fast { animation-duration: .45s; }
    .sc-${id} .spin { transform-box: fill-box; transform-origin: center; animation: ${id}-spin 1.6s linear infinite; }
    @keyframes ${id}-fl { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -28px; } }
    @keyframes ${id}-spin { to { transform: rotate(360deg); } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-46px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-grow { from { opacity: 0; transform: scale(0); } 30% { opacity: 1; } to { opacity: 1; transform: scale(1); } }
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
  // 칸마다 opacity 를 바꾼다: states[0] 처음, states[k] 칸 k(null 은 그대로)
  const fade = (id, cls, states, delay = 0.6, sec = 0.4) => `.sc-${id} .${cls} { opacity: ${states[0]}; transition: opacity ${sec}s ease; }`
    + states.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { opacity: ${v}; transition-delay: ${v ? delay : 0.1}s; }`)).join('');
  // 칸마다 transform 을 바꾼다
  const steps = (id, cls, vals, sec = 1.1, delay = 0.2, extra = '') => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s;${extra} }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`)).join('');

  // ── 공통 그림 ──
  const wire = (d, w = 5) => `<path d="${d}" stroke="${C.ink}" stroke-width="${w}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  // 전자 흐름(파란 점), 전류 흐름(주황 짧은 줄): 경로 방향으로 움직인다
  const eflow = (d, cls = '') => `<g class="${cls}"><path class="fl ${cls.includes('fast') ? 'fast' : cls.includes('slow') ? 'slow' : ''}" d="${d}" stroke="${C.blue}" stroke-width="10" stroke-linecap="round" stroke-dasharray="0 28" fill="none" stroke-linejoin="round"/></g>`;
  const iflow = (d, cls = '') => `<g class="${cls}"><path class="fl" d="${d}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round" stroke-dasharray="12 16" fill="none" stroke-linejoin="round"/></g>`;
  // 전하 동그라미: + 는 빨강, − 는 파랑
  const chg = (x, y, sign, r = 12) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${sign > 0 ? C.red : C.blue}" stroke-width="2.5"/>`
    + `<path d="M${f(x - r * 0.5)} ${f(y)} H${f(x + r * 0.5)}${sign > 0 ? ` M${f(x)} ${f(y - r * 0.5)} V${f(y + r * 0.5)}` : ''}" stroke="${sign > 0 ? C.red : C.blue}" stroke-width="3" stroke-linecap="round"/>`;
  // 전지: 가운데 (cx, cy). plusLeft 면 (+)극이 왼쪽
  const cell = (cx, cy, plusLeft = false) => {
    const tx = plusLeft ? cx - 41 : cx + 34;
    return `<g><rect x="${cx - 34}" y="${cy - 16}" width="68" height="32" rx="5" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><rect x="${tx}" y="${cy - 7}" width="7" height="14" rx="2" fill="${C.green}"/>`
      + text(plusLeft ? cx - 22 : cx + 22, cy - 24, '+', { size: 22, color: C.red }) + text(plusLeft ? cx + 22 : cx - 22, cy - 24, '−', { size: 22, color: C.blue }) + '</g>';
  };
  // 전구: 전선 높이 wy 위에 선다. lit 클래스가 켜짐
  const bulb = (cx, wy, lit = 'lit', big = false) => {
    const cy = wy - 32, r = 20, gr = big ? 60 : 42;
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 - Math.PI / 8; rays += `M${f(cx + (r + 8) * Math.cos(a))} ${f(cy + (r + 8) * Math.sin(a))} L${f(cx + (r + (big ? 28 : 17)) * Math.cos(a))} ${f(cy + (r + (big ? 28 : 17)) * Math.sin(a))} `; }
    return `<g class="${lit}"><circle cx="${cx}" cy="${cy}" r="${gr}" fill="${C.yellow}" opacity="${big ? 0.5 : 0.38}"/><path d="${rays}" stroke="${C.orange}" stroke-width="${big ? 4 : 3}" stroke-linecap="round"/></g>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${C.muted}" stroke-width="3"/>`
      + `<g class="${lit}"><circle cx="${cx}" cy="${cy}" r="${r - 2}" fill="${C.yellow}"/></g>`
      + `<path d="M${cx - 7} ${cy + 13} L${cx - 5} ${cy - 2} Q${cx} ${cy - 10} ${cx + 5} ${cy - 2} L${cx + 7} ${cy + 13}" stroke="${C.ink}" stroke-width="2" fill="none"/>`
      + `<rect x="${cx - 11}" y="${cy + r - 4}" width="22" height="${wy - (cy + r - 4) + 6}" rx="3" fill="${C.muted}"/>`;
  };
  // 칼날 스위치: 축 px, 받침 qx, 높이 y. 손잡이(lev)는 열리면 위로 들린다
  const knife = (px, qx, y) => `<rect x="${px - 16}" y="${y + 7}" width="${qx - px + 34}" height="12" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`
    + `<path d="M${qx - 3} ${y - 9} V${y + 6} M${qx + 5} ${y - 9} V${y + 6}" stroke="${C.ink}" stroke-width="3"/>`
    + `<g class="lev"><path d="M${px} ${y} H${qx + 12}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><rect x="${qx + 8}" y="${y - 16}" width="11" height="18" rx="3" fill="${C.red}"/></g>`
    + `<circle cx="${px}" cy="${y}" r="7" fill="${C.ink}"/>`;
  const leverCss = (id, px, y, opens) => `.sc-${id} .lev { transform-box: view-box; transform-origin: ${px}px ${y}px; transform: rotate(${opens[0] ? -38 : 0}deg); transition: transform .6s ease-in-out .2s; }`
    + opens.slice(1).map((o, i) => (o == null ? '' : `.on${i + 1} .sc-${id} .lev { transform: rotate(${o ? -38 : 0}deg); }`)).join('');
  const clip = `<path d="M-4 9 V-9 A4 4 0 0 1 4 -9 V11 A6 6 0 0 1 -8 11 V-11 A6 6 0 0 1 4 -11" transform="translate(2 0)" stroke="${C.muted}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  // 코일(옆에서 본 나선): 왼쪽 아래 (x0, cy+r)에서 시작해 오른쪽 아래 (x1, cy+r)에서 끝난다.
  // 앞쪽 반바퀴(front)는 위에서 아래로, 뒤쪽 반바퀴(back)는 아래에서 위로 간다.
  const helix = (x0, x1, cy, r, k, n) => {
    const N = n * 40, pts = [];
    for (let i = 0; i <= N; i++) { const t = i / N, p = Math.PI + 2 * Math.PI * n * t; pts.push([x0 + (x1 - x0) * t + k * Math.sin(p), cy - r * Math.cos(p), Math.sin(p)]); }
    let front = '', back = '', all = `M${f(pts[0][0])} ${f(pts[0][1])}`, prev = null;
    for (let i = 1; i <= N; i++) {
      const [x, y, s] = pts[i], [px, py, ps] = pts[i - 1], side = (s + ps) / 2 > 0 ? 'f' : 'b';
      const seg = (prev === side ? '' : `M${f(px)} ${f(py)} `) + `L${f(x)} ${f(y)} `;
      if (side === 'f') front += seg; else back += seg;
      prev = side; all += ` L${f(x)} ${f(y)}`;
    }
    return { front, back, all };
  };
  const magnet = (x, y, w, h, nLeft = true) => {
    const half = w / 2;
    const L = nLeft ? ['N', C.red, C.peach] : ['S', C.blue, C.sky], R = nLeft ? ['S', C.blue, C.sky] : ['N', C.red, C.peach];
    return `<rect x="${x}" y="${y}" width="${half}" height="${h}" fill="${L[2]}" stroke="${L[1]}" stroke-width="3"/><rect x="${x + half}" y="${y}" width="${half}" height="${h}" fill="${R[2]}" stroke="${R[1]}" stroke-width="3"/>`
      + text(x + half / 2, y + h / 2 + 9, L[0], { size: 26, color: L[1] }) + text(x + half * 1.5, y + h / 2 + 9, R[0], { size: 26, color: R[1] });
  };
  const compass = (x, y, a, r = 19) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<g class="ndl" style="--a:${f(a)}deg"><path d="M${f(x)} ${f(y - r + 4)} L${f(x + 5)} ${f(y)} L${f(x - 5)} ${f(y)} Z" fill="${C.red}"/><path d="M${f(x)} ${f(y + r - 4)} L${f(x + 5)} ${f(y)} L${f(x - 5)} ${f(y)} Z" fill="${C.muted}"/></g>`;

  // ════ 마찰 전기·대전·대전체: 털가죽과 빨대 ════
  // 털가죽에서 빨대로 전자 2개가 옮겨 간다(털가죽 (+), 빨대 (−))
  const rub = (word, id) => {
    let css = base(id);
    const pre = word === '대전체';
    const fur = `<rect x="50" y="100" width="200" height="160" rx="22" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="${Array.from({ length: 9 }, (_, k) => `M${66 + k * 21} 100 q4 -12 10 -3 M${66 + k * 21} 260 q4 12 10 3`).join(' ')}" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const fx = [88, 132, 176, 220], fy = [160, 205];
    let furC = '';
    [[-1, 1, null, 1], [1, -1, 1, null]].forEach((row, j) => row.forEach((s, i) => { if (s) furC += chg(fx[i], fy[j], s); }));
    let body = fur + furC;
    // 전자가 떠난 빈자리
    const holes = `<circle cx="176" cy="160" r="12" fill="none" stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 4"/><circle cx="220" cy="205" r="12" fill="none" stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 4"/>`;
    body += pre ? holes : at(2, 'fin', holes, 1.3);
    // 빨대: 왼쪽 끝 362 자리가 전자가 들어올 빈칸
    const sx = [412, 462, 512, 562], sy = [166, 194];
    let straw = `<rect x="330" y="150" width="270" height="60" rx="30" fill="white" stroke="${C.muted}" stroke-width="3"/><path d="M345 158 H585" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    [[1, -1, 1, -1], [-1, 1, -1, 1]].forEach((row, j) => row.forEach((s, i) => { straw += chg(sx[i], sy[j], s); }));
    body += `<g class="straw">${straw}</g>`;
    body += `<g class="e1">${chg(176, 160, -1)}</g><g class="e2">${chg(220, 205, -1)}</g>`;
    body += text(150, 84, '털가죽', { size: 20 }) + text(465, 134, '빨대', { size: 20 });
    if (pre) {
      css += `.sc-${id} .e1 { transform: translate(186px, 6px); } .sc-${id} .e2 { transform: translate(142px, -11px); }`;
    } else {
      // 빨대가 털가죽 위를 오가며 문지르고, 그때 전자 두 개가 빨대 왼쪽 끝으로 옮겨 타서 함께 돌아간다
      css += `
      @keyframes ${id}-rub { 0% { transform: none; } 25% { transform: translateX(-230px); } 40% { transform: translateX(-190px); } 55% { transform: translateX(-230px); } 70% { transform: translateX(-190px); } 85% { transform: translateX(-230px); } 100% { transform: none; } }
      @keyframes ${id}-e1 { 0%, 25% { transform: none; } 40% { transform: translate(-4px, 6px); } 55% { transform: translate(-44px, 6px); } 70% { transform: translate(-4px, 6px); } 85% { transform: translate(-44px, 6px); } 100% { transform: translate(186px, 6px); } }
      @keyframes ${id}-e2 { 0%, 25% { transform: none; } 40% { transform: translate(-48px, -11px); } 55% { transform: translate(-88px, -11px); } 70% { transform: translate(-48px, -11px); } 85% { transform: translate(-88px, -11px); } 100% { transform: translate(142px, -11px); } }
      .on2 .sc-${id} .straw { animation: ${id}-rub 1.5s linear both; }
      .on2 .sc-${id} .e1 { animation: ${id}-e1 1.5s linear both; }
      .on2 .sc-${id} .e2 { animation: ${id}-e2 1.5s linear both; }`;
      // 문지르는 자리의 반짝임
      body += at(2, 'pop', `<path d="M118 120 l6 -16 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`, 0.5);
      body += ring(362, 180, 30, 2, C.blue, 1.5);
      body += at(2, 'pop', tag(362, 245, '전자', COLD, { size: 18 }), 1.6);
    }
    return { body, css };
  };

  // ── 마찰 전기 ──
  (function () {
    const id = 't82-s7-machal';
    let { body, css } = rub('마찰 전기', id);
    body += at(3, 'pop', tag(150, 296, '(+) 전기', HOT), 0.2) + at(3, 'pop', tag(465, 296, '(−) 전기', COLD), 0.4);
    body += at(3, 'pop', tag(320, 336, '마찰 전기', KEY, { size: 22 }), 0.8);
    body += glowRect(44, 94, 212, 172, 3, C.red, 0.2, 26) + glowRect(324, 144, 282, 72, 3, C.blue, 0.4, 36);
    put('8-2/과학/7/마찰 전기', svg(id, body, css));
  })();

  // ── 대전 ──
  (function () {
    const id = 't82-s7-daejeon';
    let { body, css } = rub('대전', id);
    body += at(1, 'pop', tag(150, 296, '+4  −4', GRAY), 0.3) + at(1, 'pop', tag(465, 296, '+4  −4', GRAY), 0.5);
    body += at(3, 'pop', tag(150, 296, '전자 잃음 → (+)', HOT, { size: 18 }), 0.2) + at(3, 'pop', tag(465, 296, '전자 얻음 → (−)', COLD, { size: 18 }), 0.5);
    body += at(3, 'pop', tag(320, 340, '대전', KEY, { size: 22 }), 0.9);
    css += `.on2 .sc-${id} .b1 .pop1 { opacity: 0; transition: opacity .3s ease 1.5s; animation: none; }`;
    put('8-2/과학/7/대전', svg(id, body, css));
  })();

  // ── 대전체: 전기를 띤 빨대가 종잇조각을 끌어당긴다 ──
  (function () {
    const id = 't82-s7-daejeonche';
    let { body, css } = rub('대전체', id);
    body += `<path d="M330 318 H610" stroke="${C.muted}" stroke-width="3"/>`;
    const bits = [[372, 305, 20], [410, 309, -15], [452, 304, 35], [496, 308, -30], [540, 305, 10], [580, 309, -40]];
    bits.forEach(([x, y, a], i) => {
      body += `<g class="pb pb${i}"><rect x="${x - 9}" y="${y - 6}" width="18" height="12" rx="2" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2" transform="rotate(${a} ${x} ${y})"/></g>`;
      css += `.on2 .sc-${id} .pb${i} { transform: translateY(${212 + 7 - y}px); transition-delay: ${f(0.4 + i * 0.12)}s; }`;
    });
    css += `.sc-${id} .pb { transition: transform .45s cubic-bezier(.3, 0, .6, 1) .4s; }`;
    body += at(1, 'pop', tag(150, 296, '(+)', HOT), 0.3) + at(1, 'pop', tag(548, 128, '(−)', COLD, { size: 18 }), 0.5);
    body += at(3, 'fin', lead(250, 52, 200, 96) + lead(330, 52, 420, 146), 0.4);
    body += at(3, 'pop', tag(290, 44, '대전체', KEY, { size: 22 }), 0.2);
    body += glowRect(44, 94, 212, 172, 3, C.red, 0.6, 26) + glowRect(324, 144, 282, 72, 3, C.blue, 0.8, 36);
    put('8-2/과학/7/대전체', svg(id, body, css));
  })();

  // ── 전기력: 같은 종류끼리 밀고, 다른 종류끼리 당긴다 ──
  (function () {
    const id = 't82-s7-ryeok';
    let css = base(id);
    const PY = 60, L = 170, R = 24;
    let body = `<path d="M60 ${PY} H580" stroke="${C.muted}" stroke-width="6" stroke-linecap="round"/>`;
    const ball = (px, sign, cls) => `<g class="${cls}"><path d="M${px} ${PY} V${PY + L - R}" stroke="${C.muted}" stroke-width="2.5"/><circle cx="${px}" cy="${PY + L}" r="${R}" fill="${sign > 0 ? C.peach : C.sky}" stroke="${sign > 0 ? C.red : C.blue}" stroke-width="3"/>`
      + `<path d="M${px - 9} ${PY + L} H${px + 9}${sign > 0 ? ` M${px} ${PY + L - 9} V${PY + L + 9}` : ''}" stroke="${sign > 0 ? C.red : C.blue}" stroke-width="4" stroke-linecap="round"/></g>`;
    const P = [120, 230, 450, 560];
    body += shown(1, ball(P[0], 1, 'bA') + ball(P[1], 1, 'bB'));
    body += shown(2, ball(P[2], 1, 'bC') + ball(P[3], -1, 'bD'));
    const sw = (cls, px, deg, n) => `.sc-${id} .${cls} { transform-box: view-box; transform-origin: ${px}px ${PY}px; transition: transform .8s ease-out .3s; } .on${n} .sc-${id} .${cls} { transform: rotate(${deg}deg); }`;
    css += sw('bA', P[0], 14, 1) + sw('bB', P[1], -14, 1) + sw('bC', P[2], -8, 2) + sw('bD', P[3], 8, 2);
    const bx = (px, deg) => px - L * Math.sin(rad(deg)), by = (deg) => PY + L * Math.cos(rad(deg));
    const xa = bx(P[0], 14), xb = bx(P[1], -14), xc = bx(P[2], -8), xd = bx(P[3], 8), ya = by(14), yc = by(8);
    body += grow(1, xa - R - 4, ya, xa - R - 40, ya, C.red, 6, 1.1) + grow(1, xb + R + 4, ya, xb + R + 40, ya, C.red, 6, 1.1);
    body += grow(2, xc - R - 40, yc, xc - R - 6, yc, C.green, 6, 1.1) + grow(2, xd + R + 40, yc, xd + R + 6, yc, C.green, 6, 1.1);
    body += at(1, 'pop', tag(175, 300, '밀어냄', HOT), 1.3) + at(2, 'pop', tag(505, 300, '당김', OK), 1.3);
    body += at(3, 'pop', tag(340, 116, '전기력', KEY, { size: 24 }), 0.2);
    body += glowRect(130, 278, 90, 44, 3, C.red, 0.6, 22) + glowRect(465, 278, 80, 44, 3, C.green, 0.8, 22);
    put('8-2/과학/7/전기력', svg(id, body, css));
  })();

  // ── 정전기 유도: (−) 대전체를 가까이 하면 금속 속 전자가 먼 쪽으로 밀려난다 ──
  (function () {
    const id = 't82-s7-yudo';
    let css = base(id);
    let body = `<rect x="400" y="230" width="20" height="70" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><rect x="350" y="300" width="120" height="16" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<rect x="270" y="150" width="300" height="80" rx="40" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><path d="M300 160 H540" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;
    const xs = [310, 370, 430, 490, 550], to = [410, 445, 480, 515, 550];
    xs.forEach((x) => { body += chg(x, 176, 1); });
    xs.forEach((x, i) => { body += `<g class="ev" style="--dx:${to[i] - x}px">${chg(x, 206, -1)}</g>`; });
    body += text(420, 128, '금속', { size: 20 });
    // (−) 대전체(빨대)
    let rod = `<rect x="20" y="170" width="215" height="44" rx="22" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    [50, 90, 130, 170, 210].forEach((x) => { rod += chg(x, 192, -1, 11); });
    rod += text(128, 150, '대전체', { size: 20 });
    body += shown(2, `<g class="rod">${rod}</g>`);
    css += `
      .sc-${id} .rod { transform: translateX(-260px); transition: transform .9s ease-out .1s; }
      .on2 .sc-${id} .rod { transform: none; }
      .sc-${id} .ev { transition: transform .8s ease-in-out 1s; }
      .on2 .sc-${id} .ev { transform: translateX(var(--dx)); }`;
    body += glowRect(282, 156, 116, 66, 3, C.red, 0.2, 24) + glowRect(394, 186, 172, 40, 3, C.blue, 0.4, 20);
    body += at(3, 'pop', tag(320, 98, '다른 종류', HOT, { size: 18 }), 0.4) + at(3, 'pop', tag(510, 98, '같은 종류', COLD, { size: 18 }), 0.6);
    body += at(3, 'pop', tag(150, 300, '정전기 유도', KEY, { size: 22 }), 1.0);
    put('8-2/과학/7/정전기 유도', svg(id, body, css));
  })();

  // ── 전류: 전자는 (−)극 → (+)극, 전류는 (+)극 → (−)극 ──
  (function () {
    const id = 't82-s7-jeonryu';
    let css = base(id);
    const B = 290, T = 100, L = 110, R = 530;
    let body = wire(`M361 ${B} H${R} V${T} H332`) + wire(`M308 ${T} H${L} V${B} H286`);
    body += eflow(`M286 ${B} H${L} V${T} H${R} V${B} H361`, 'efl');
    body += cell(320, B) + bulb(320, T);
    // 전자 방향(안쪽 파란 화살표)
    body += at(1, 'fin', farrow(L + 28, 230, L + 28, 150, C.blue, 5) + farrow(R - 28, 150, R - 28, 230, C.blue, 5), 0.6);
    body += at(1, 'pop', tag(200, 190, '전자', COLD), 0.9);
    // 전류 방향(바깥 주황 화살표)
    body += at(2, 'fin', farrow(R + 26, 230, R + 26, 150, C.orange, 6) + farrow(L - 26, 150, L - 26, 230, C.orange, 6) + farrow(250, T - 26, 180, T - 26, C.orange, 6) + farrow(400, B + 30, 470, B + 30, C.orange, 6), 0.3);
    body += at(2, 'pop', tag(440, 190, '전류', SUN), 0.9);
    body += ring(200, 190, 40, 2, C.blue, 0.2);
    // 전류계
    body += at(3, 'pop', tag(440, 245, '단위 A', KEY, { size: 22 }), 0.6) + glowRect(398, 168, 84, 44, 3, C.orange, 0.2, 22);
    put('8-2/과학/7/전류', svg(id, body, css));
  })();

  // ── 전압: 전지 1개(1.5 V)와 2개(3 V). 전압이 크면 전자가 더 빨리 흐르고 전구가 밝다 ──
  (function () {
    const id = 't82-s7-jeonap';
    let css = base(id);
    const B = 290, T = 110;
    let body = wire(`M201 ${B} H280 V${T} H171`) + wire(`M149 ${T} H40 V${B} H126`) + eflow(`M126 ${B} H40 V${T} H280 V${B} H201`, 'slow');
    body += cell(160, B) + bulb(160, T);
    body += at(1, 'pop', tag(160, 338, '1.5 V', GRAY), 0.3);
    let right = wire(`M547 ${B} H600 V${T} H481`) + wire(`M459 ${T} H340 V${B} H400`) + eflow(`M400 ${B} H340 V${T} H600 V${B} H547`, 'fast');
    right += cell(434, B) + cell(506, B) + bulb(470, T, 'lit', true);
    body += shown(2, right);
    body += at(2, 'pop', tag(470, 338, '3 V', HOT), 0.4) + ring(470, 78, 44, 2, C.orange, 0.8);
    body += at(3, 'pop', tag(320, 200, '전압 (V)', KEY, { size: 22 }), 0.2);
    body += glowRect(110, 316, 100, 44, 3, C.red, 0.5, 22) + glowRect(424, 316, 92, 44, 3, C.red, 0.6, 22);
    put('8-2/과학/7/전압', svg(id, body, css));
  })();

  // ── 저항: 도선 속 전자가 원자에 부딪힌다. 길수록, 가늘수록 저항이 크다 ──
  (function () {
    const id = 't82-s7-jeohang';
    let css = base(id);
    let body = `<rect x="40" y="62" width="560" height="106" rx="20" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" opacity=".9"/>`;
    let atoms = '';
    for (let k = 0; k < 8; k++) atoms += `<circle cx="${84 + 64 * k}" cy="90" r="13" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><circle cx="${116 + 64 * k}" cy="140" r="13" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += atoms;
    let zz = 'M40 115';
    for (let k = 0; k < 8; k++) zz += ` L${84 + 64 * k} 106 L${116 + 64 * k} 124`;
    zz += ' L600 115';
    body += shown(1, eflow(zz));
    body += at(1, 'pop', tag(84, 40, '원자', GRAY, { size: 18 }), 0.5) + at(1, 'fin', lead(84, 52, 84, 76), 0.5);
    body += at(1, 'pop', tag(560, 40, '전자', COLD, { size: 18 }), 0.8);
    // 길이·굵기 견주기
    const cu = (x1, x2, y, h) => `<rect x="${x1}" y="${f(y - h / 2)}" width="${x2 - x1}" height="${h}" rx="${Math.min(h / 2, 6)}" fill="${C.orange}" stroke="${C.ink}" stroke-width="1.5"/>`;
    let cmp = cu(50, 140, 240, 12) + text(180, 247, '짧다', { size: 18 }) + cu(50, 260, 312, 12) + text(296, 319, '길다', { size: 18 });
    cmp += cu(350, 510, 240, 24) + text(552, 247, '굵다', { size: 18 }) + cu(350, 510, 312, 5) + text(560, 319, '가늘다', { size: 18 });
    body += at(2, 'fin', cmp, 0.2);
    body += at(2, 'pop', tag(160, 278, '저항 큼', HOT, { size: 18 }), 1.0) + at(2, 'pop', tag(430, 278, '저항 큼', HOT, { size: 18 }), 1.2);
    body += at(2, 'fin', lead(160, 294, 160, 304, C.red) + lead(430, 294, 430, 306, C.red), 1.0);
    body += glowRect(40, 296, 230, 32, 2, C.red, 1.0, 12) + glowRect(340, 300, 180, 24, 2, C.red, 1.2, 12);
    body += at(3, 'pop', tag(320, 202, '저항 (Ω)', KEY, { size: 22 }), 0.2) + glowRect(36, 58, 568, 114, 3, C.red, 0.4, 22);
    put('8-2/과학/7/저항', svg(id, body, css));
  })();

  // ── 옴의 법칙: 전압-전류 그래프는 원점을 지나는 직선. 저항이 크면 기울기가 작다 ──
  (function () {
    const id = 't82-s7-om';
    let css = base(id);
    const OX = 100, OY = 300, SX = 100, SY = 600;
    const px = (v) => OX + v * SX, py = (i) => OY - i * SY;
    let body = '';
    for (let v = 1; v <= 4; v++) body += `<path d="M${px(v)} ${OY} V${py(0.4)}" stroke="${C.line}" stroke-width="1.5"/>` + text(px(v), OY + 26, v, { size: 18, weight: 600 });
    for (let k = 1; k <= 4; k++) body += `<path d="M${OX} ${py(k / 10)} H${px(4)}" stroke="${C.line}" stroke-width="1.5"/>` + text(OX - 12, py(k / 10) + 6, (k / 10).toFixed(1), { size: 18, weight: 600, anchor: 'end' });
    body += `<path d="M${OX} ${OY} H${px(4) + 30} M${OX} ${OY} V${py(0.4) - 26}" stroke="${C.ink}" stroke-width="3"/>`;
    body += `<path d="M${px(4) + 30} ${OY} l-12 -7 v14 Z M${OX} ${py(0.4) - 26} l-7 12 h14 Z" fill="${C.ink}"/>`;
    body += text(OX - 10, OY + 26, 0, { size: 18, weight: 600, anchor: 'end' });
    body += text(px(2.5), OY + 54, '전압 (V)', { size: 20 }) + text(OX + 14, 30, '전류 (A)', { size: 20, anchor: 'start' });
    [1, 2, 3].forEach((v, i) => {
      body += at(1, 'fin', `<path d="M${px(v)} ${OY} V${py(v / 10)} H${OX}" stroke="${C.blue}" stroke-width="2" stroke-dasharray="5 5" fill="none"/>`, f(0.2 + i * 0.4));
      body += at(1, 'pop', `<circle cx="${px(v)}" cy="${py(v / 10)}" r="8" fill="${C.blue}" stroke="white" stroke-width="2.5"/>`, f(0.3 + i * 0.4));
    });
    body += drawPath(`M${OX} ${OY} L${px(4)} ${py(0.4)}`, 2, C.blue, 5);
    body += at(2, 'pop', tag(px(1.3), py(0.3), '비례', COLD), 1.2);
    body += drawPath(`M${OX} ${OY} L${px(4)} ${py(0.2)}`, 3, C.red, 5);
    body += at(3, 'pop', tag(560, py(0.2), '저항 큼', HOT, { size: 18 }), 1.1) + at(3, 'pop', tag(568, py(0.4) + 4, '저항 작음', COLD, { size: 18 }), 1.3);
    body += at(4, 'pop', tag(264, 34, '옴의 법칙', OK, { size: 22 }), 0.2) + at(4, 'pop', tag(420, 34, 'V = I R', KEY, { size: 24 }), 0.6);
    put('8-2/과학/7/옴의 법칙', svg(id, body, css));
  })();

  // ── 직렬연결: 길이 하나. 전류는 어디서나 같고, 전압은 나뉜다. 하나를 빼면 모두 꺼진다 ──
  (function () {
    const id = 't82-s7-jikryeol';
    let css = base(id);
    const B = 300, T = 130, L = 70, R = 570;
    let body = wire(`M361 ${B} H${R} V${T} H421`) + wire(`M399 ${T} H241`) + wire(`M219 ${T} H${L} V${B} H286`);
    body += `<g class="h3">${drawPath(`M361 ${B} H${R} V${T} H${L} V${B} H286`, 1, C.yellow, 12, 0, ' opacity=".7"')}</g>`;
    body += iflow(`M361 ${B} H${R} V${T} H${L} V${B} H286`, 'cur');
    body += cell(320, B) + bulb(230, T, 'lit l1') + `<g class="out">${bulb(410, T, 'lit l2')}</g>`;
    body += at(1, 'pop', tag(320, 175, '0.2 A', SUN, { size: 18 }), 1.2) + at(1, 'pop', tag(R - 52, 230, '0.2 A', SUN, { size: 18 }), 1.4) + at(1, 'pop', tag(L + 52, 230, '0.2 A', SUN, { size: 18 }), 1.6);
    body += shown(2, at(2, 'pop', tag(230, 32, '1.5 V', COLD, { size: 18 }), 0.4) + at(2, 'pop', tag(410, 32, '1.5 V', COLD, { size: 18 }), 0.6), 3);
    body += at(2, 'pop', tag(320, 343, '3 V', HOT, { size: 18 }), 0.2);
    css += `.on3 .sc-${id} .b1 .pop1 { opacity: 0; animation: none; transition: opacity .2s; }`;
    css += steps(id, 'out', ['none', null, null, 'translateY(-70px)'], 0.7, 0.2, ' opacity: 1;') + `.on3 .sc-${id} .out { opacity: 0; transition: transform .7s ease-in .2s, opacity .5s ease .5s; }`;
    css += fade(id, 'l1', [1, null, null, 0], 0.7) + fade(id, 'cur', [1, null, null, 0], 0.7);
    body += ring(410, T, 22, 3, C.red, 0.9);
    body += at(3, 'pop', tag(320, 215, '직렬연결', KEY, { size: 24 }), 1.1);
    put('8-2/과학/7/직렬연결', svg(id, body, css));
  })();

  // ── 병렬연결: 갈래가 둘. 전류는 나뉘고, 전압은 같다. 하나를 빼도 다른 하나는 켜져 있다 ──
  (function () {
    const id = 't82-s7-byeongryeol';
    let css = base(id);
    const T1 = 92, T2 = 196, B = 300, L = 90, R = 550;
    let body = wire(`M${L} ${T2} V${T1} H308`) + wire(`M332 ${T1} H${R} V${T2}`) + wire(`M${L} ${T2} H308`) + wire(`M332 ${T2} H${R}`) + wire(`M${R} ${T2} V${B} H361`) + wire(`M286 ${B} H${L} V${T2}`);
    body += `<circle cx="${L}" cy="${T2}" r="7" fill="${C.ink}"/><circle cx="${R}" cy="${T2}" r="7" fill="${C.ink}"/>`;
    body += iflow(`M361 ${B} H${R} V${T2}`) + iflow(`M${R} ${T2} V${T1} H${L} V${T2}`, 'cb1') + iflow(`M${R} ${T2} H${L}`) + iflow(`M${L} ${T2} V${B} H286`);
    body += cell(320, B) + `<g class="out">${bulb(320, T1, 'lit l1')}</g>` + bulb(320, T2, 'lit l2');
    body += shown(1, at(1, 'pop', tag(460, T1 + 24, '0.2 A', SUN, { size: 18 }), 0.6) + at(1, 'pop', tag(460, T2 + 24, '0.2 A', SUN, { size: 18 }), 0.8) + at(1, 'pop', tag(596, 250, '0.4 A', HOT, { size: 18 }), 1.1), 3);
    body += shown(2, at(2, 'pop', tag(222, T1 - 30, '3 V', COLD, { size: 18 }), 0.4) + at(2, 'pop', tag(222, T2 - 30, '3 V', COLD, { size: 18 }), 0.6), 3);
    body += at(2, 'pop', tag(320, 343, '3 V', COLD, { size: 18 }), 0.2);
    css += steps(id, 'out', ['none', null, null, 'translateY(-60px)'], 0.7, 0.2, ' opacity: 1;') + `.on3 .sc-${id} .out { opacity: 0; transition: transform .7s ease-in .2s, opacity .5s ease .5s; }`;
    css += fade(id, 'cb1', [1, null, null, 0], 0.5);
    body += ring(320, T2 - 32, 34, 3, C.green, 1.0);
    body += at(3, 'pop', tag(450, 250, '병렬연결', KEY, { size: 24 }), 1.1);
    put('8-2/과학/7/병렬연결', svg(id, body, css));
  })();

  // ── 전기 에너지: 전기가 빛·열·소리·운동으로 바뀐다 ──
  (function () {
    const id = 't82-s7-energy';
    let css = base(id);
    const Y = 180, X1 = 290, X2 = 490;
    // 콘센트
    let body = `<rect x="40" y="130" width="100" height="100" rx="18" fill="white" stroke="${C.muted}" stroke-width="3"/><circle cx="90" cy="180" r="32" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><circle cx="78" cy="180" r="6" fill="${C.ink}"/><circle cx="102" cy="180" r="6" fill="${C.ink}"/>`;
    body += wire(`M140 ${Y} H${X2}`, 4) + wire(`M${X1} ${Y} V112 M${X1} ${Y} V250 M${X2} ${Y} V116 M${X2} ${Y} V250`, 4);
    body += iflow(`M140 ${Y} H${X2}`) + iflow(`M${X1} ${Y} V112`) + iflow(`M${X1} ${Y} V250`) + iflow(`M${X2} ${Y} V116`) + iflow(`M${X2} ${Y} V250`);
    // 전구(빛)
    body += bulb(X1, 112, 'lit');
    // 전열기(열)
    body += `<rect x="${X2 - 36}" y="66" width="72" height="50" rx="8" fill="white" stroke="${C.muted}" stroke-width="3"/><g class="lit"><path d="M${X2 - 26} 91 l8 -12 l8 24 l8 -24 l8 24 l8 -24 l8 24 l4 -12" stroke="${C.red}" stroke-width="4" fill="none" stroke-linejoin="round"/></g>`;
    body += `<g class="lit"><g class="heat"><path d="M${X2 - 16} 58 q-6 -9 0 -18 q6 -9 0 -18 M${X2} 58 q-6 -9 0 -18 q6 -9 0 -18 M${X2 + 16} 58 q-6 -9 0 -18 q6 -9 0 -18" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`;
    // 스피커(소리)
    body += `<path d="M${X1 - 26} 262 h14 l22 -18 v52 l-22 -18 h-14 Z" fill="${C.line}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<g class="lit"><g class="snd"><path d="M${X1 + 20} 256 q10 14 0 28 M${X1 + 32} 248 q16 22 0 44" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g></g>`;
    // 선풍기(운동)
    let blades = '';
    for (let k = 0; k < 3; k++) blades += `<ellipse cx="${X2}" cy="${266 - 22}" rx="9" ry="22" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5" transform="rotate(${k * 120} ${X2} 266)"/>`;
    body += `<path d="M${X2} 266 V300 M${X2 - 24} 302 H${X2 + 24}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
    body += `<g class="fan"><g>${blades}</g></g><circle cx="${X2}" cy="266" r="8" fill="${C.ink}"/>`;
    body += at(2, 'pop', tag(X1 + 78, 78, '빛', SUN), 0.4) + at(2, 'pop', tag(X2 + 86, 91, '열', HOT), 0.6) + at(2, 'pop', tag(X1 + 104, 270, '소리', [C.lilac, C.purple]), 0.8) + at(2, 'pop', tag(X2 + 90, 266, '운동', COLD), 1.0);
    body += at(3, 'pop', tag(90, 268, '전기 에너지', KEY, { size: 20 }), 0.2) + glowRect(34, 124, 112, 112, 3, C.red, 0.4, 20);
    css += fade(id, 'lit', [0, 0, 1], 0.2);
    css += `
      .sc-${id} .fan { transform-box: view-box; transform-origin: ${X2}px 266px; }
      .on2 .sc-${id} .fan { animation: ${id}-spin .9s linear .3s infinite; }
      .on2 .sc-${id} .heat { animation: ${id}-heat 1.4s ease-in-out infinite; }
      .on2 .sc-${id} .snd { transform-box: fill-box; transform-origin: left center; animation: ${id}-snd 1s ease-out infinite; }
      @keyframes ${id}-heat { 0% { transform: translateY(6px); opacity: .3; } 50% { opacity: 1; } 100% { transform: translateY(-6px); opacity: .3; } }
      @keyframes ${id}-snd { 0% { transform: scale(.7); opacity: .3; } 60% { opacity: 1; } 100% { transform: scale(1.15); opacity: 0; } }`;
    put('8-2/과학/7/전기 에너지', svg(id, body, css));
  })();

  // ── 소비 전력: 1초 동안 쓰는 전기 에너지. 60 W 는 20 W 의 세 배를 쓴다 ──
  (function () {
    const id = 't82-s7-sobi';
    let css = base(id);
    const W = 230, XA = 200, XB = 440;
    let body = `<circle cx="320" cy="72" r="38" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="312" y="24" width="16" height="10" rx="2" fill="${C.ink}"/>`;
    for (let k = 0; k < 12; k++) body += `<path d="M${f(320 + 30 * Math.cos(rad(k * 30)))} ${f(72 + 30 * Math.sin(rad(k * 30)))} L${f(320 + 35 * Math.cos(rad(k * 30)))} ${f(72 + 35 * Math.sin(rad(k * 30)))}" stroke="${C.muted}" stroke-width="2"/>`;
    body += `<g class="hand"><path d="M320 72 V44" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/></g><circle cx="320" cy="72" r="5" fill="${C.ink}"/>`;
    body += text(390, 80, '1초', { size: 22 });
    const stand = (x) => `<path d="M${x} ${W} V292" stroke="${C.muted}" stroke-width="8"/><rect x="${x - 50}" y="292" width="100" height="14" rx="5" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += stand(XA) + stand(XB) + bulb(XA, W, 'lit la') + bulb(XB, W, 'lit lb', true);
    body += tag(XA, 336, '20 W', GRAY) + tag(XB, 336, '60 W', GRAY);
    // 에너지 덩이: 1초마다 왼쪽 1개, 오른쪽 3개가 받침을 타고 올라가 전구로 들어간다
    const blk = (x, d) => `<g class="eb" style="animation-delay:${d}s"><rect x="${x - 9}" y="282" width="18" height="18" rx="3" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/></g>`;
    body += shown(2, blk(XA - 26, 0) + blk(XB - 26, 0) + blk(XB - 26, 0.6) + blk(XB - 26, 1.2));
    css += `
      .sc-${id} .hand { transform-box: view-box; transform-origin: 320px 72px; }
      .on2 .sc-${id} .hand { animation: ${id}-spin 1.8s linear infinite; }
      .sc-${id} .eb { opacity: 0; transform-box: fill-box; transform-origin: center; animation: ${id}-eb 1.8s ease-in infinite; }
      @keyframes ${id}-eb { 0% { opacity: 0; transform: none; } 15% { opacity: 1; } 75% { opacity: 1; transform: translate(26px, -66px) scale(.6); } 100% { opacity: 0; transform: translate(26px, -80px) scale(.3); } }`;
    css += fade(id, 'la', [0, 0, 1], 0.2) + fade(id, 'lb', [0, 0, 1], 0.2);
    body += at(1, 'fin', `<rect x="${XA - 38}" y="317" width="76" height="38" rx="19" fill="none" stroke="${C.ink}" stroke-width="2"/><rect x="${XB - 38}" y="317" width="76" height="38" rx="19" fill="none" stroke="${C.ink}" stroke-width="2"/>`, 0.2);
    body += ring(XA, 336, 30, 1, C.muted, 0.2) + ring(XB, 336, 30, 1, C.muted, 0.4);
    body += at(3, 'pop', tag(320, 296, '소비 전력', KEY, { size: 22 }), 0.2) + glowRect(XB - 44, 314, 88, 44, 3, C.red, 0.5, 22);
    body += at(3, 'pop', tag(562, 336, 'W (와트)', HOT, { size: 18 }), 0.7);
    put('8-2/과학/7/소비 전력', svg(id, body, css));
  })();

  // ── 자기력: 같은 극끼리 밀고, 다른 극끼리 당긴다 ──
  (function () {
    const id = 't82-s7-jagiryeok';
    let css = base(id);
    const Y = 160, H = 56;
    let body = magnet(60, Y, 200, H, false);
    body += `<g class="mv"><g class="mA">${magnet(320, Y, 200, H, true)}</g><g class="mB">${magnet(320, Y, 200, H, false)}</g></g>`;
    css += steps(id, 'mv', ['none', 'translateX(80px)', 'translateX(-58px)'], 0.8, 0.3);
    css += `.on2 .sc-${id} .mv { transition: transform .8s ease-in 1s; }`;
    css += fade(id, 'mB', [0, 0, 1], 0.3, 0.5) + fade(id, 'mA', [1, 1, 0], 0.3, 0.5);
    body += shown(1, grow(1, 200, Y - 26, 150, Y - 26, C.red, 6, 1.0) + grow(1, 450, Y - 26, 500, Y - 26, C.red, 6, 1.0) + at(1, 'pop', tag(320, 280, '밀어냄', HOT), 1.2), 2);
    body += grow(2, 140, Y - 26, 190, Y - 26, C.green, 6, 1.8) + grow(2, 400, Y - 26, 350, Y - 26, C.green, 6, 1.8) + at(2, 'pop', tag(320, 280, '당김', OK), 1.8);
    body += at(3, 'pop', tag(320, 60, '자기력', KEY, { size: 24 }), 0.2) + glowRect(56, Y - 4, 410, H + 8, 3, C.red, 0.4, 8);
    put('8-2/과학/7/자기력', svg(id, body, css));
  })();

  // ── 자기장: 나침반 바늘이 자기장 방향을 가리키고, 자기력선은 N극에서 나와 S극으로 ──
  (function () {
    const id = 't82-s7-jagijang';
    let css = base(id);
    const NX = 240, SX = 400, Y0 = 180;
    const field = (x, y) => {
      let bx = 0, by = 0;
      for (const [px, q] of [[NX, 1], [SX, -1]]) { const dx = x - px, dy = y - Y0, r3 = Math.pow(dx * dx + dy * dy, 1.5); bx += (q * dx) / r3; by += (q * dy) / r3; }
      const m = Math.hypot(bx, by); return [bx / m, by / m];
    };
    const trace = (a) => {
      let x = NX + 12 * Math.cos(rad(a)), y = Y0 + 12 * Math.sin(rad(a));
      const pts = [[x, y]];
      for (let i = 0; i < 1600; i++) {
        const [ux, uy] = field(x, y); x += 2.5 * ux; y += 2.5 * uy; pts.push([x, y]);
        if (Math.hypot(x - SX, y - Y0) < 12) return { pts, out: false };
        if (x < -20 || x > 660 || y < -20 || y > 380) return { pts, out: true };
      }
      return { pts, out: true };
    };
    const toD = (pts) => 'M' + pts.filter((_, i) => i % 3 === 0 || i === pts.length - 1).map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');
    let lines = '', heads = '';
    const head = (x, y) => { const [ux, uy] = field(x, y), a = Math.atan2(uy, ux); const p = (d) => `${f(x - 11 * Math.cos(a + d))} ${f(y - 11 * Math.sin(a + d))}`; return `M${p(-0.55)} L${f(x)} ${f(y)} L${p(0.55)}`; };
    [-140, -105, -75, -45, 45, 75, 105, 140, 180].forEach((a) => {
      const { pts, out } = trace(a);
      lines += toD(pts) + ' ';
      if (!out) { const top = pts.reduce((m, p) => (Math.abs(p[1] - Y0) > Math.abs(m[1] - Y0) ? p : m)); heads += head(top[0], top[1]) + ' '; }
      else {
        // 화면 밖으로 나간 선은 S극 쪽에 좌우를 뒤집은 짝을 그린다
        lines += toD(pts.map(([x, y]) => [640 - x, y])) + ' ';
        const k = Math.min(pts.length - 1, 50); heads += head(pts[k][0], pts[k][1]) + ' ' + head(640 - pts[k][0], pts[k][1]) + ' ';
      }
    });
    let body = `<g class="b3"><rect class="flash flash3" x="30" y="30" width="580" height="296" rx="40" fill="${C.lilac}" style="animation-delay:.1s"/></g>`;
    body += drawPath(lines, 2, C.purple, 2.5, 0.1);
    body += at(2, 'fin', `<path d="${heads}" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.1);
    body += magnet(220, Y0 - 25, 200, 50, true);
    const spots = [[320, 92], [320, 268], [130, 180], [510, 180], [180, 100], [460, 100], [180, 260], [460, 260]];
    spots.forEach(([x, y]) => { const [ux, uy] = field(x, y); body += compass(x, y, (Math.atan2(uy, ux) * 180) / Math.PI + 90); });
    css += `.sc-${id} .ndl { transform-box: fill-box; transform-origin: center; transform: rotate(0deg); transition: transform 1s ease-in-out .3s; } .on1 .sc-${id} .ndl { transform: rotate(var(--a)); }`;
    body += at(3, 'pop', tag(560, 326, '자기장', KEY, { size: 24 }), 0.3);
    put('8-2/과학/7/자기장', svg(id, body, css));
  })();

  // ── 코일: 곧은 도선을 용수철처럼 감는다 ──
  (function () {
    const id = 't82-s7-coil';
    let css = base(id);
    const x0 = 190, x1 = 450, cy = 160, r = 64, k = 16, B = 310;
    const hx = helix(x0, x1, cy, r, k, 8);
    let body = wire(`M${x0} ${cy + r} V${B} H279`, 4) + wire(`M354 ${B} H${x1} V${cy + r}`, 4) + cell(320, B, true);
    body += shown(1, wire(`M${x0} ${cy + r} H${x1}`, 4), 2);
    body += at(1, 'pop', tag(320, cy + r - 34, '곧은 도선', GRAY, { size: 18 }), 0.4);
    css += `.on2 .sc-${id} .b1 .pop1 { opacity: 0; transition: opacity .3s; animation: none; }`;
    body += drawPath(hx.back, 2, C.peach, 4, 0.3) + drawPath(hx.front, 2, C.orange, 5, 0.3);
    body += shown(3, iflow(hx.all) + iflow(`M279 ${B} H${x0} V${cy + r}`) + iflow(`M${x1} ${cy + r} V${B} H354`));
    body += at(2, 'pop', tag(560, cy, '감은 도선', GRAY, { size: 18 }), 1.3);
    body += at(3, 'pop', tag(320, 44, '코일', KEY, { size: 26 }), 0.3) + glowRect(x0 - 30, cy - r - 12, x1 - x0 + 60, 2 * r + 24, 3, C.orange, 0.5, 20);
    put('8-2/과학/7/코일', svg(id, body, css));
  })();

  // ── 전자석: 철심에 감은 코일에 전류가 흐를 때만 자석이 된다 ──
  (function () {
    const id = 't82-s7-jeonjaseok';
    let css = base(id);
    const x0 = 210, x1 = 410, cy = 150, r = 46, k = 13, B = 312, px = 350, qx = 400;
    const hx = helix(x0, x1, cy, r, k, 8);
    let body = wire(`M${x0} ${cy + r} V${B} H239`, 4) + wire(`M314 ${B} H${px}`, 4) + wire(`M${qx} ${B} H${x1 + 30} V${cy + r} H${x1}`, 4);
    body += `<path d="${hx.back}" stroke="${C.peach}" stroke-width="4" fill="none"/>`;
    body += `<rect x="170" y="${cy - 22}" width="280" height="44" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<path d="${hx.front}" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    body += `<g class="cur">${iflow(`M239 ${B} H${x0} V${cy + r}`)}${iflow(hx.all)}${iflow(`M${x1} ${cy + r} H${x1 + 30} V${B} H${qx}`)}${iflow(`M${px} ${B} H314`)}</g>`;
    body += cell(276, B, true) + knife(px, qx, B);
    body += at(1, 'pop', tag(310, 58, '철심', GRAY, { size: 18 }), 0.3) + at(1, 'fin', lead(310, 74, 310, 104), 0.3);
    body += `<path d="M470 286 H610" stroke="${C.muted}" stroke-width="3"/>`;
    const clips = [[462, 136, 38, 144], [462, 152, 73, 128], [462, 168, 108, 112]];
    clips.forEach(([x, y, dx, dy], i) => { body += `<g class="cl cl${i}" style="--dx:${dx}px;--dy:${dy}px"><g transform="translate(${x} ${y}) rotate(90)">${clip}</g></g>`; });
    body += shown(2, at(2, 'pop', text(470, 112, 'N', { size: 26, color: C.red }) + text(150, 112, 'S', { size: 26, color: C.blue }), 0.9), 3);
    body += shown(1, text(375, 352, '열림', { size: 20, color: C.red }), 2) + shown(2, text(375, 352, '닫힘', { size: 20, color: C.green }), 3) + shown(3, text(375, 352, '열림', { size: 20, color: C.red }));
    body += at(3, 'pop', tag(560, 60, '전자석', KEY, { size: 24 }), 1.0);
    css += leverCss(id, px, B, [1, 1, 0, 1]) + fade(id, 'cur', [0, 0, 1, 0], 0.5);
    css += `
      .sc-${id} .cl { transform: translate(var(--dx), var(--dy)); transition: transform .6s cubic-bezier(.5, 0, .7, 1) .3s; }
      .on2 .sc-${id} .cl { transform: none; transition: transform .45s cubic-bezier(.2, .8, .4, 1) .9s; }
      .on2 .sc-${id} .cl1 { transition-delay: 1s; }
      .on2 .sc-${id} .cl2 { transition-delay: 1.1s; }
      .on3 .sc-${id} .cl { transform: translate(var(--dx), var(--dy)); transition: transform .6s cubic-bezier(.5, 0, .7, 1) .8s; }`;
    put('8-2/과학/7/전자석', svg(id, body, css));
  })();

  // ── 전동기: 자기장 속 코일이 힘을 받아 돈다(코일 끝에서 본 그림) ──
  // 자기장 왼쪽 → 오른쪽(N → S). 왼쪽 도선은 전류가 앞으로 나오고(⊙) 오른쪽은 뒤로 들어간다(⊗).
  // 오른손: 네 손가락 자기장, 엄지 전류, 손바닥 힘 → 왼쪽 도선은 위, 오른쪽 도선은 아래로 힘 → 시계 방향으로 돈다.
  (function () {
    const id = 't82-s7-jeondonggi';
    let css = base(id);
    const CX = 320, CY = 190, A = 105;
    let body = `<rect x="40" y="100" width="110" height="180" rx="6" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>` + text(95, 200, 'N', { size: 34, color: C.red });
    body += `<rect x="490" y="100" width="110" height="180" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + text(545, 200, 'S', { size: 34, color: C.blue });
    [130, 250].forEach((y) => { body += `<path d="M156 ${y} H476" stroke="${C.purple}" stroke-width="2.5" stroke-dasharray="8 7"/>` + `<path d="M470 ${y - 7} L482 ${y} L470 ${y + 7}" stroke="${C.purple}" stroke-width="3" fill="none"/>`; });
    body += text(320, 80, '자기장', { size: 20, color: C.purple });
    // 회전하는 코일(막대 + 양 끝 도선)
    const coil = `<path d="M${CX - A} ${CY} H${CX + A}" stroke="${C.orange}" stroke-width="8" stroke-linecap="round"/><circle cx="${CX - A}" cy="${CY}" r="18" fill="white" stroke="${C.orange}" stroke-width="4"/><circle cx="${CX + A}" cy="${CY}" r="18" fill="white" stroke="${C.orange}" stroke-width="4"/>`;
    body += `<g class="rot">${coil}</g><circle cx="${CX}" cy="${CY}" r="9" fill="${C.ink}"/>`;
    const dotIn = `<circle cx="${CX - A}" cy="${CY}" r="5" fill="${C.ink}"/>`, crossIn = `<path d="M${CX + A - 8} ${CY - 8} L${CX + A + 8} ${CY + 8} M${CX + A + 8} ${CY - 8} L${CX + A - 8} ${CY + 8}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`;
    body += shown(1, at(1, 'pop', dotIn, 0.4) + at(1, 'pop', crossIn, 0.6) + at(1, 'pop', tag(CX - A, CY + 46, '전류', SUN, { size: 18 }), 0.8) + at(1, 'pop', tag(CX + A, CY - 46, '전류', SUN, { size: 18 }), 1.0), 3);
    body += shown(2, grow(2, CX - A, CY - 22, CX - A, CY - 92, C.red, 7, 0.3) + grow(2, CX + A, CY + 22, CX + A, CY + 92, C.red, 7, 0.5) + at(2, 'pop', tag(CX - A + 46, CY - 72, '힘', HOT), 1.0) + at(2, 'pop', tag(CX + A - 46, CY + 72, '힘', HOT), 1.2), 3);
    // 3칸: 시계 방향으로 계속 돈다
    // 아래쪽 호: 오른쪽 → 왼쪽(시계 방향)
    body += at(3, 'fin', `<path d="M${CX + 60} ${CY + 112} A127 127 0 0 1 ${CX - 60} ${CY + 112}" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${CX - 46} ${CY + 126} L${CX - 62} ${CY + 112} L${CX - 42} ${CY + 102}" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 0.2);
    body += at(3, 'pop', tag(CX, 36, '전동기', KEY, { size: 24 }), 0.5);
    css += `
      .sc-${id} .rot { transform-box: view-box; transform-origin: ${CX}px ${CY}px; }
      .on3 .sc-${id} .rot { animation: ${id}-spin 2s linear .2s infinite; }`;
    put('8-2/과학/7/전동기', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
