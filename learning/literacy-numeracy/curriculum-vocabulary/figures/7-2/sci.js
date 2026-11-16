// 과학 중1-2(7-2) Ⅴ단원 「힘의 작용」 낱말 도식: 힘은 화살표(작용점에서 시작, 길이가 크기)로, 저울은 눈금과 표시 자로 그린다.
// 손이나 사람이 주는 힘은 C.red, 탄성력·마찰력·부력처럼 되돌리거나 막는 힘은 C.blue, 두 힘을 합한 알짜힘은 C.purple.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(모양·위치 속성은 CSS 로 바꾸지 않는다).
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
  // 용수철(지그재그): (x1,y) 에서 (x2,y) 까지 가로로
  const coilH = (x1, x2, y, amp = 16, n = 12, color = C.muted) => {
    let d = `M${x1} ${y}`;
    for (let i = 1; i <= n; i++) d += ` L${f(x1 + ((x2 - x1) * (i - 0.5)) / n)} ${i % 2 ? y - amp : y + amp}`;
    return `<path d="${d} L${x2} ${y}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
  };
  const wall = (x, y1, y2) => `<rect x="${x - 18}" y="${y1}" width="18" height="${y2 - y1}" fill="${C.line}"/>` + `<path d="M${x} ${y1} V${y2}" stroke="${C.muted}" stroke-width="4"/>`
    + Array.from({ length: Math.floor((y2 - y1) / 20) }, (_, k) => `<path d="M${x - 2} ${y1 + 8 + k * 20} l-14 12" stroke="${C.muted}" stroke-width="2" opacity=".6"/>`).join('');

  // 용수철저울(세로). cx 가운데, 0 눈금 z0, 1 N 마다 ppn px, max N 까지. hang 은 고리 아래 매다는 것(고리 끝 y = z0 + rod + 14 를 0 으로 놓고 그린다).
  // 돌려주는 것: fixed(몸통), spring(늘어나는 용수철, cls 로 움직임), moving(표시 자·막대·고리·매단 것)
  const springScale = (cx, { z0 = 78, ppn = 20, max = 6, rod = 80, hang = '', spr = 'spr', mv = 'mv', every = 1 } = {}) => {
    const top = 50, bottom = z0 + max * ppn + 16, L = cx - 44, R = cx + 44;
    let s = `<circle cx="${cx}" cy="22" r="12" fill="none" stroke="${C.ink}" stroke-width="5"/><path d="M${cx} 34 V${top}" stroke="${C.ink}" stroke-width="5"/>`;
    s += `<rect x="${L}" y="${top}" width="${R - L}" height="${bottom - top}" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    s += `<rect x="${L + 8}" y="${top + 8}" width="28" height="${bottom - top - 16}" rx="6" fill="${C.sky}" stroke="${C.line}" stroke-width="2"/>`;
    let d = '';
    for (let n = 0; n <= max; n += 1) {
      const y = f(z0 + n * ppn);
      d += `M${cx - 4} ${y} H${cx + 10} `;
      if (n % every === 0) s += text(cx + 14, f(y + 6.5), n, { size: 18, anchor: 'start' });
    }
    s += `<path d="${d}" stroke="${C.ink}" stroke-width="2.2"/>` + text(R - 4, top - 8, 'N', { size: 18, color: C.muted, anchor: 'end' });
    // 용수철
    const st0 = top + 12, n = 8;
    let zz = `M${L + 22} ${st0}`;
    for (let i = 1; i <= n; i++) zz += ` L${i % 2 ? L + 12 : L + 32} ${f(st0 + ((z0 - st0) * (i - 0.5)) / n)}`;
    zz += ` L${L + 22} ${z0}`;
    const spring = `<g class="${spr}"><path d="${zz}" fill="none" stroke="${C.muted}" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></g>`;
    const hx = L + 22, hy = z0 + rod;
    let moving = `<path d="M${hx} ${z0} V${hy}" stroke="${C.ink}" stroke-width="3.5"/>`
      + `<path d="M${hx} ${hy - 4} V${hy + 4} A8 8 0 1 1 ${hx - 16} ${hy + 4}" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`
      + `<path d="M${hx - 12} ${z0 - 3} H${cx + 2} L${cx + 10} ${z0} L${cx + 2} ${z0 + 3} H${hx - 12} Z" fill="${C.red}" stroke="${C.red}" stroke-width="1.5" stroke-linejoin="round"/>`;
    moving += `<g transform="translate(${hx} ${hy + 12})">${hang}</g>`;
    return { fixed: s, spring, moving: `<g class="${mv}">${moving}</g>`, hx, sprLen: z0 - st0, top: st0, bottom };
  };
  // 고리에 매다는 덩어리(가운데 위 0,0)
  const lump = (w = 56, h = 42, [fill, stroke] = [C.lilac, C.purple]) => `<path d="M0 0 V8" stroke="${C.ink}" stroke-width="2.5"/><rect x="${-w / 2}" y="8" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  // 저울 표시 자를 d px 내리는 움직임(용수철도 같이 늘어난다)
  const scaleMove = (id, sc, mv, spr, ds, sec = 1.1, delay = 0.4) => steps(id, mv, ds.map((d) => (d == null ? null : `translateY(${f(d)}px)`)), sec, delay)
    + steps(id, spr, ds.map((d) => (d == null ? null : `scaleY(${f((sc.sprLen + d) / sc.sprLen)})`)), sec, delay)
    + `.sc-${id} .${spr} { transform-box: fill-box; transform-origin: 50% 0; }`;

  // ════ 5단원 힘의 작용 ════

  // ── 힘: 찰흙은 눌려 모양이 바뀌고, 굴러가던 공은 옆에서 밀려 가는 방향이 바뀐다 ──
  (function () {
    const id = 't72-s5-him';
    let css = base(id);
    let body = floor(40, 290, 290);
    body += `<g class="clay"><path d="M119 290 C112 250 130 202 165 200 C202 198 220 248 211 290 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
    body += `<g class="push">${grow(1, 165, 80, 165, 196, C.red, 8)}</g>`;
    css += `.sc-${id} .clay { transform-box: fill-box; transform-origin: 50% 100%; }` + steps(id, 'clay', ['scale(1,1)', 'scale(1.5,.56)'], 1, 0.8) + steps(id, 'push', ['translateY(0px)', 'translateY(40px)'], 1, 0.8);
    body += at(1, 'pop', tag(165, 330, '모양', HOT), 1.6);
    // 오른쪽: 위에서 내려다본 공
    const P = [470, 230];
    body += `<path d="M350 230 H470" stroke="${C.line}" stroke-width="3" stroke-dasharray="7 7" fill="none"/>` + shown(2, `<path d="M470 230 L590 128" stroke="${C.line}" stroke-width="3" stroke-dasharray="7 7" fill="none"/>`);
    [380, 420].forEach((x) => { body += `<circle cx="${x}" cy="230" r="17" fill="${C.sky}" stroke="${C.blue}" stroke-width="2" opacity=".35"/>`; });
    [[510, 196], [550, 162]].forEach(([x, y], k) => { body += at(2, 'fin', `<circle cx="${x}" cy="${y}" r="17" fill="${C.sky}" stroke="${C.blue}" stroke-width="2" opacity=".35"/>`, f(1.4 + k * 0.3)); });
    body += `<g class="ball"><circle cx="350" cy="230" r="18" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`;
    body += grow(2, P[0], 320, P[0], 252, C.red, 8, 0.2);
    css += `.sc-${id} .ball { transform: translate(120px, 0); }
      @keyframes ${id}-roll { 0% { transform: translate(0, 0); } 50% { transform: translate(120px, 0); } 100% { transform: translate(240px, -102px); } }
      .on2 .sc-${id} .ball { animation: ${id}-roll 2s linear .1s both; }`;
    body += at(2, 'pop', tag(560, 300, '방향', COLD), 1.6);
    body += glowRect(70, 176, 190, 124, 3, C.orange) + glowRect(330, 110, 290, 150, 3, C.blue, 0.2);
    body += at(3, 'pop', tag(320, 44, '힘', KEY, { size: 26 }), 0.6);
    put('7-2/과학/5/힘', svg(id, body, css));
  })();

  // ── 작용점: 상자를 끄는 힘의 화살표는 힘이 닿는 점에서 시작하고, 길이는 크기, 머리는 방향 ──
  (function () {
    const id = 't72-s5-jakyong';
    let css = base(id);
    let body = floor(60, 600, 290) + box(200, 170, 140, 120);
    const P = [340, 230];
    body += grow(1, P[0], P[1], 520, P[1], C.red, 8, 0.2);
    body += at(1, 'pop', dot(P[0], P[1], C.ink, 8), 0);
    // 칸 2: 크기와 방향
    body += drawPath(`M${P[0]} 188 V200 M${P[0]} 194 H520 M520 188 V200`, 2, C.orange, 3, 0.1);
    body += at(2, 'pop', tag(430, 162, '크기', HOT), 0.9);
    body += ring(508, P[1], 22, 2, C.red, 0.6) + at(2, 'pop', tag(580, P[1], '방향', HOT), 1.1);
    // 칸 3: 작용점
    body += ring(P[0], P[1], 16, 3, C.green, 0) + `<g class="b3">${g('pulse pulse3', dot(P[0], P[1], C.green, 10))}</g>`;
    body += at(3, 'fin', lead(P[0] - 8, P[1] + 12, 300, 316, C.green), 0.3) + at(3, 'pop', tag(280, 326, '작용점', KEY, { size: 24 }), 0.5);
    put('7-2/과학/5/작용점', svg(id, body, css));
  })();

  // ── 힘의 평형: 양쪽에서 같은 크기로 끌면 상자는 움직이지 않는다 ──
  (function () {
    const id = 't72-s5-pyeong';
    let css = base(id);
    let body = floor(40, 600, 290);
    body += `<g class="jig">${box(260, 180, 120, 110)}</g>`;
    body += grow(1, 260, 235, 110, 235, C.red, 8, 0.1) + grow(1, 380, 235, 530, 235, C.red, 8, 0.4);
    body += at(1, 'pop', text(185, 204, '5 N', { size: 22, color: C.red }), 0.9) + at(1, 'pop', text(455, 204, '5 N', { size: 22, color: C.red }), 1.1);
    // 칸 2: 길이가 같다, 알짜힘 0
    body += drawPath('M110 262 V276 M110 269 H260 M260 262 V276', 2, C.orange, 3) + drawPath('M380 262 V276 M380 269 H530 M530 262 V276', 2, C.orange, 3, 0.2);
    body += at(2, 'pop', tag(320, 120, '알짜힘 0', LIL), 0.9);
        body += glowRect(96, 214, 448, 42, 3, C.green, 0, 21);
    body += at(3, 'pop', tag(320, 330, '힘의 평형', KEY, { size: 24 }), 0.5);
    css += `.sc-${id} .jig { animation-duration: .5s; }`;
    put('7-2/과학/5/힘의 평형', svg(id, body, css));
  })();

  // ── 알짜힘: 같은 방향이면 더하고, 반대 방향이면 큰 힘에서 작은 힘을 뺀다 ──
  (function () {
    const id = 't72-s5-aljja';
    let css = base(id);
    const U = 30; // 1 N 에 30 px
    let body = floor(40, 600, 160) + floor(40, 600, 314);
    // 칸 1: 같은 방향
    body += box(90, 80, 80, 80);
    body += grow(1, 170, 110, 170 + 3 * U, 110, C.red, 7, 0.1) + grow(1, 170 + 3 * U, 110, 170 + 5 * U, 110, C.orange, 7, 0.7);
    body += at(1, 'fin', text(170 + 1.5 * U, 92, '3 N', { size: 20, color: C.red }), 0.5) + at(1, 'fin', text(170 + 4 * U, 92, '2 N', { size: 20, color: C.orange }), 1.1);
    body += grow(1, 170, 140, 170 + 5 * U, 140, C.purple, 7, 1.5);
    body += at(1, 'pop', tag(490, 125, '3 N + 2 N = 5 N', LIL, { size: 20 }), 2.0);
    // 칸 2: 반대 방향
    body += `<g class="b2">${box(290, 234, 80, 80)}</g>`;
    body += grow(2, 370, 264, 370 + 5 * U, 264, C.red, 7, 0.1) + grow(2, 290, 264, 290 - 2 * U, 264, C.orange, 7, 0.6);
    body += at(2, 'fin', text(370 + 2.5 * U, 246, '5 N', { size: 20, color: C.red }), 0.5) + at(2, 'fin', text(290 - U, 246, '2 N', { size: 20, color: C.orange }), 1.0);
    body += grow(2, 370, 296, 370 + 3 * U, 296, C.purple, 7, 1.5);
    body += at(2, 'pop', tag(140, 296, '5 N − 2 N = 3 N', LIL, { size: 20 }), 2.0);
    // 칸 3
    body += glowRect(160, 124, 170, 32, 3, C.purple, 0, 10) + glowRect(360, 280, 110, 32, 3, C.purple, 0.2, 10);
    body += at(3, 'pop', tag(560, 210, '알짜힘', KEY, { size: 24 }), 0.6);
    put('7-2/과학/5/알짜힘', svg(id, body, css));
  })();

  // ── 운동 상태: 빠르기가 바뀌는 공(간격이 벌어진다), 방향이 바뀌는 공(둥근 길) ──
  (function () {
    const id = 't72-s5-undong';
    let css = base(id);
    const xs = [66, 102, 144, 196, 260, 340, 436];
    let body = `<path d="M50 96 H590" stroke="${C.line}" stroke-width="3" stroke-dasharray="7 7"/>`;
    xs.forEach((x, k) => { body += at(1, 'fin', `<circle cx="${x}" cy="96" r="16" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5" opacity="${k === xs.length - 1 ? 1 : 0.45}"/>`, f(k * 0.22)); });
    body += drawPath('M150 140 H520', 1, C.orange, 4, 1.6) + at(1, 'fin', `<path d="M506 132 L522 140 L506 148" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 2.6);
    body += at(1, 'pop', tag(560, 96, '빠르기', COLD), 1.8);
    // 칸 2: 같은 빠르기로 둥글게 돈다 — 방향이 바뀐다
    const cx = 260, cy = 340, R = 120;
    body += shown(2, `<path d="M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}" stroke="${C.line}" stroke-width="3" stroke-dasharray="7 7" fill="none"/>`);
    [160, 125, 90, 55, 20].forEach((a, k) => {
      const r = (a * Math.PI) / 180, x = cx + R * Math.cos(r), y = cy - R * Math.sin(r);
      const tx = Math.sin(r) * 44, ty = Math.cos(r) * 44; // 시계 방향 접선
      body += at(2, 'fin', `<circle cx="${f(x)}" cy="${f(y)}" r="15" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`, f(k * 0.3));
      body += grow(2, x, y, x + tx, y + ty, C.green, 4, f(0.15 + k * 0.3));
    });
    body += at(2, 'pop', tag(520, 270, '방향', HOT), 1.8);
    body += glowRect(40, 66, 560, 92, 3, C.blue) + glowRect(116, 186, 300, 160, 3, C.orange, 0.2);
    body += at(3, 'pop', tag(520, 210, '운동 상태', KEY, { size: 24 }), 0.6);
    put('7-2/과학/5/운동 상태', svg(id, body, css));
  })();

  // ── 중력: 지구 어디에 있든 물체는 지구 중심 쪽으로 끌린다 ──
  (function () {
    const id = 't72-s5-jung';
    let css = base(id);
    const cx = 320, cy = 200, R = 100;
    let body = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${R - 14}" fill="none" stroke="${C.blue}" stroke-width="2" opacity=".25"/>`;
    // 칸 1: 사과가 떨어진다
    const apple = `<circle cx="${cx}" cy="40" r="15" fill="${C.red}"/><path d="M${cx} 26 q4 -10 12 -10" stroke="${C.green}" stroke-width="3" fill="none"/>`;
    body += `<g class="b1"><g class="fall">${apple}</g></g>`;
    css += `@keyframes ${id}-fall { 0% { transform: translateY(0); } 60%, 100% { transform: translateY(${cy - R - 15 - 40}px); } }
      .on1 .sc-${id} .fall { animation: ${id}-fall 1.6s ease-in .3s both; }`;
    body += grow(1, cx + 40, 46, cx + 40, 86, C.red, 6, 1.2);
    // 칸 2: 여러 곳의 물체가 모두 중심 쪽으로
    body += at(2, 'pop', dot(cx, cy, C.ink, 7), 0);
    [70, 145, 215, 290].forEach((a, k) => {
      const r = (a * Math.PI) / 180, sx = Math.sin(r), cy2 = -Math.cos(r);
      const ox = cx + sx * (R + 18), oy = cy + cy2 * (R + 18);
      body += at(2, 'fin', `<path d="M${f(ox)} ${f(oy)} L${cx} ${cy}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 6"/>`, f(k * 0.2));
      body += at(2, 'pop', `<circle cx="${f(ox)}" cy="${f(oy)}" r="13" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`, f(k * 0.2));
      body += grow(2, cx + sx * (R + 62), cy + cy2 * (R + 62), cx + sx * (R + 34), cy + cy2 * (R + 34), C.red, 6, f(0.4 + k * 0.2));
    });
    body += at(2, 'pop', tag(cx, cy + 34, '중심', GRAY, { size: 18 }), 1.4);
    body += ring(cx, cy, 30, 3, C.red, 0) + at(3, 'pop', tag(560, 50, '중력', KEY, { size: 26 }), 0.5);
    put('7-2/과학/5/중력', svg(id, body, css));
  })();

  // ── 무게·질량에 같이 쓰는 땅(지구는 푸른 띠, 달은 회색 띠) ──
  const ground = (cx, label, moon) => `<path d="M${cx - 120} 360 Q${cx} 318 ${cx + 120} 360 Z" fill="${moon ? C.line : C.sky}" stroke="${moon ? C.muted : C.blue}" stroke-width="3"/>` + text(cx, 354, label, { size: 20 });

  // ── 무게: 같은 물체를 용수철저울에 걸면 지구에서 6 N, 달에서 1 N ──
  (function () {
    const id = 't72-s5-muge';
    let css = base(id);
    let body = '';
    [[180, 'sa', 'ma', 6, '지구', false, 1], [460, 'sb', 'mb', 1, '달', true, 2]].forEach(([cx, spr, mv, n, label, moon, b]) => {
      const sc = springScale(cx, { z0: 74, ppn: 14, max: 6, rod: 106, hang: lump(), spr, mv, every: 2 });
      const inner = sc.fixed + sc.spring + sc.moving;
      body += b === 1 ? inner : `<g class="b2">${inner}</g>`;
      body += b === 1 ? ground(cx, label, moon) : at(2, 'fin', ground(cx, label, moon));
      const ds = b === 1 ? [0, n * 14] : [0, null, n * 14];
      css += scaleMove(id, sc, mv, spr, ds, 1.1, 0.5);
      body += ring(cx + 10, 74 + n * 14, 18, b, C.red, 1.4) + at(b, 'pop', tag(cx + 100, 74 + n * 14, `${n} N`, HOT, { size: 22 }), 1.5);
    });
    body += at(2, 'pop', tag(320, 240, '6분의 1', LIL), 2.1);
    body += glowRect(234, 138, 92, 40, 3, C.red, 0, 20) + glowRect(514, 68, 92, 40, 3, C.red, 0.2, 20);
    body += at(3, 'pop', tag(320, 40, '무게', KEY, { size: 26 }), 0.6);
    put('7-2/과학/5/무게', svg(id, body, css));
  })();

  // ── 질량: 양팔저울은 지구에서도 달에서도 600 g 추와 수평 ──
  (function () {
    const id = 't72-s5-jil';
    let css = base(id);
    let body = '';
    const balance = (cx, k) => {
      const py = 120, half = 100;
      let s = `<path d="M${cx} ${py} V290 M${cx - 50} 292 H${cx + 50}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><path d="M${cx - 12} ${py} L${cx} ${py - 16} L${cx + 12} ${py} Z" fill="${C.ink}"/>`;
      const pan = (sx, inner) => `<path d="M${sx} ${py} L${sx - 34} ${py + 80} M${sx} ${py} L${sx + 34} ${py + 80}" stroke="${C.muted}" stroke-width="2"/><path d="M${sx - 44} ${py + 80} H${sx + 44} Q${sx + 40} ${py + 96} ${sx} ${py + 96} Q${sx - 40} ${py + 96} ${sx - 44} ${py + 80} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>${inner}`;
      const obj = `<rect x="${cx - half - 26}" y="${py + 42}" width="52" height="38" rx="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>`;
      const wt = `<g class="b${k}"><g class="drop drop${k}" style="animation-delay:.2s"><rect x="${cx + half - 22}" y="${py + 40}" width="44" height="40" rx="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>${text(cx + half, py + 122, '600 g', { size: 18 })}</g></g>`;
      s += `<g class="beam${k}"><path d="M${cx - half} ${py} H${cx + half}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></g>`;
      s += `<g class="pl${k}">${pan(cx - half, obj)}</g><g class="pr${k}">${pan(cx + half, wt)}</g>`;
      const dy = f(half * Math.sin((10 * Math.PI) / 180));
      const v = (a, b2) => (k === 1 ? [a, b2] : [a, null, b2]);
      css += `.sc-${id} .beam${k} { transform-box: view-box; transform-origin: ${cx}px ${py}px; }`
        + steps(id, `beam${k}`, v('rotate(-10deg)', 'rotate(0deg)'), 0.9, 0.8)
        + steps(id, `pl${k}`, v(`translateY(${dy}px)`, 'translateY(0px)'), 0.9, 0.8)
        + steps(id, `pr${k}`, v(`translateY(${-dy}px)`, 'translateY(0px)'), 0.9, 0.8);
      return s;
    };
    body += balance(170, 1) + ground(170, '지구', false);
    body += `<g class="b2">${balance(470, 2)}${ground(470, '달', true)}</g>`;
    body += at(1, 'pop', tag(170, 52, '수평', OK), 1.8) + at(2, 'pop', tag(470, 52, '수평', OK), 1.8);
    body += glowRect(120, 30, 100, 44, 3, C.green, 0, 22) + glowRect(420, 30, 100, 44, 3, C.green, 0.2, 22);
    body += at(3, 'pop', tag(320, 52, '질량', KEY, { size: 26 }), 0.6);
    put('7-2/과학/5/질량', svg(id, body, css));
  })();

  // ── 뉴턴: 100 g 추 하나를 걸면 1 N, 셋을 걸면 3 N ──
  (function () {
    const id = 't72-s5-newton';
    let css = base(id);
    const wt = (k, cls) => `<g class="${cls}"><rect x="-26" y="${k * 22}" width="52" height="20" rx="5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/></g>`;
    const hang = `<path d="M0 -4 V4" stroke="${C.ink}" stroke-width="2.5"/>` + `<g transform="translate(0 4)"><g class="b1">${wt(0, 'drop drop1')}</g><g class="b2">${wt(1, 'drop drop2')}${g('drop drop2', wt(2, ''), 0.25)}</g></g>`;
    const sc = springScale(250, { z0: 80, ppn: 24, max: 3, rod: 94, hang, spr: 'spr', mv: 'mv' });
    let body = sc.fixed + sc.spring + sc.moving;
    css += scaleMove(id, sc, 'mv', 'spr', [0, 24, 72], 1.1, 0.6);
    body += `<g class="b1 h2">${g('pop pop1', tag(130, 250, '100 g', ['white', C.orange]), 0.2)}</g>`;
    body += ring(260, 104, 18, 1, C.red, 1.4) + `<g class="b1 h2">${g('pop pop1', tag(380, 104, '1 N', HOT, { size: 22 }), 1.5)}</g>`;
    body += at(2, 'pop', tag(130, 250, '300 g', ['white', C.orange]), 0.2);
    body += ring(260, 152, 18, 2, C.red, 1.4) + at(2, 'pop', tag(380, 152, '3 N', HOT, { size: 22 }), 1.5);
    body += at(3, 'pop', `<circle cx="520" cy="150" r="56" fill="${C.peach}" stroke="${C.red}" stroke-width="4"/>` + text(520, 172, 'N', { size: 60 }), 0.2);
    body += at(3, 'pop', tag(520, 250, '뉴턴', KEY, { size: 26 }), 0.6);
    put('7-2/과학/5/뉴턴', svg(id, body, css));
  })();

  // ── 변형: 눌린 공은 모양이, 당긴 용수철은 길이가 바뀐다 ──
  (function () {
    const id = 't72-s5-byeon';
    let css = base(id);
    let body = floor(40, 260, 300);
    body += `<g class="ball"><circle cx="150" cy="250" r="50" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5"/><path d="M118 230 q14 -18 34 -20" stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
    body += `<g class="push">${grow(1, 150, 90, 150, 196, C.red, 8)}</g>`;
    css += `.sc-${id} .ball { transform-box: fill-box; transform-origin: 50% 100%; }` + steps(id, 'ball', ['scale(1,1)', 'scale(1.32,.66)'], 0.9, 0.8) + steps(id, 'push', ['translateY(0px)', 'translateY(34px)'], 0.9, 0.8);
    body += at(1, 'pop', tag(150, 336, '모양', HOT), 1.6);
    // 칸 2: 용수철을 당기면 길어진다
    body += `<g class="b2">${wall(330, 170, 290)}</g>`;
    const sp = `<g class="coil">${coilH(330, 450, 230, 16, 12)}</g>`;
    body += `<g class="b2">${sp}<g class="hd"><circle cx="458" cy="230" r="9" fill="${C.ink}"/>${grow(2, 466, 230, 540, 230, C.red, 7, 0.1)}</g></g>`;
    body += at(2, 'fin', `<path d="M450 196 V264" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="5 5"/>`, 0);
    css += `.sc-${id} .coil { transform-box: fill-box; transform-origin: 0 50%; }` + steps(id, 'coil', ['scaleX(1)', null, 'scaleX(1.5)'], 1, 0.7) + steps(id, 'hd', ['translateX(0px)', null, 'translateX(60px)'], 1, 0.7);
    body += drawPath('M450 290 H510', 2, C.orange, 4, 1.6) + at(2, 'pop', tag(480, 320, '길이', HOT), 1.8);
    body += glowRect(70, 180, 166, 124, 3, C.orange) + glowRect(316, 186, 290, 96, 3, C.orange, 0.2);
    body += at(3, 'pop', tag(320, 60, '변형', KEY, { size: 26 }), 0.6);
    put('7-2/과학/5/변형', svg(id, body, css));
  })();

  // ── 탄성: 당겼던 용수철을 놓으면 원래 길이로 되돌아간다 ──
  (function () {
    const id = 't72-s5-tan';
    let css = base(id);
    const y = 180, x0 = 150, x1 = 340, S = 1.55, dx = f((x1 - x0) * (S - 1));
    let body = wall(x0, 100, 260) + `<path d="M${x1} 110 V250" stroke="${C.green}" stroke-width="3" stroke-dasharray="6 6"/>` + text(x1, 280, '원래 길이', { size: 18, color: C.green });
    body += `<g class="coil">${coilH(x0, x1, y, 22, 14)}</g>`;
    body += `<g class="hd"><circle cx="${x1 + 10}" cy="${y}" r="12" fill="white" stroke="${C.ink}" stroke-width="4"/><g class="h2">${grow(1, x1 + 22, y, x1 + 110, y, C.red, 8, 0.1)}</g></g>`;
    css += `.sc-${id} .coil { transform-box: fill-box; transform-origin: 0 50%; }
      @keyframes ${id}-c1 { from { transform: scaleX(1); } to { transform: scaleX(${S}); } }
      @keyframes ${id}-h1 { from { transform: translateX(0); } to { transform: translateX(${dx}px); } }
      @keyframes ${id}-c2 { 0% { transform: scaleX(${S}); } 45% { transform: scaleX(.88); } 70% { transform: scaleX(1.06); } 85% { transform: scaleX(.97); } 100% { transform: scaleX(1); } }
      @keyframes ${id}-h2 { 0% { transform: translateX(${dx}px); } 45% { transform: translateX(${f(-(x1 - x0) * 0.12)}px); } 70% { transform: translateX(${f((x1 - x0) * 0.06)}px); } 85% { transform: translateX(${f(-(x1 - x0) * 0.03)}px); } 100% { transform: translateX(0); } }
      .on1 .sc-${id} .coil { animation: ${id}-c1 1s ease-in-out .7s both; }
      .on1 .sc-${id} .hd { animation: ${id}-h1 1s ease-in-out .7s both; }
      .on2 .sc-${id} .coil { animation: ${id}-c2 1.3s ease-out .4s both; }
      .on2 .sc-${id} .hd { animation: ${id}-h2 1.3s ease-out .4s both; }`;
    body += `<g class="b1 h2">${g('pop pop1', tag(450, 90, '늘어남', HOT), 1.6)}</g>`;
    body += at(2, 'pop', tag(x1, 320, '되돌아감', OK), 1.6);
    body += ring(x1 + 10, y, 20, 2, C.green, 1.4);
    body += glowRect(130, 140, 240, 80, 3, C.green);
    body += at(3, 'pop', tag(520, 200, '탄성', KEY, { size: 26 }), 0.6);
    put('7-2/과학/5/탄성', svg(id, body, css));
  })();

  // ── 탄성력: 당기면 안쪽으로, 누르면 바깥쪽으로 — 손이 준 힘(빨강)과 반대 방향(파랑) ──
  (function () {
    const id = 't72-s5-tanryeok';
    let css = base(id);
    const x0 = 110, x1 = 300;
    let body = wall(x0, 50, 160) + wall(x0, 210, 320);
    // 위: 당긴다(끝 고리 x1+8 이 57 px 오른쪽으로)
    body += `<g class="ca">${coilH(x0, x1, 105, 18, 12)}</g><g class="ha"><circle cx="${x1 + 8}" cy="105" r="10" fill="white" stroke="${C.ink}" stroke-width="4"/>`
      + `<path d="M${x1 + 8} 92 V68 M${x1 + 8} 118 V142" stroke="${C.muted}" stroke-width="2" stroke-dasharray="4 4"/>`
      + grow(1, x1 + 8, 70, x1 + 108, 70, C.red, 7, 0.1) + grow(1, x1 + 8, 140, x1 - 92, 140, C.blue, 7, 1.3) + `</g>`;
    css += `.sc-${id} .ca, .sc-${id} .cb { transform-box: fill-box; transform-origin: 0 50%; }`
      + steps(id, 'ca', ['scaleX(1)', 'scaleX(1.3)'], 0.9, 0.3) + steps(id, 'ha', ['translateX(0px)', 'translateX(57px)'], 0.9, 0.3);
    body += at(1, 'pop', tag(530, 70, '손', HOT, { size: 18 }), 1) + at(1, 'pop', tag(200, 140, '탄성력', COLD), 1.8);
    // 아래: 누른다(판이 61 px 왼쪽으로)
    body += `<g class="b2"><g class="cb">${coilH(x0, x1, 265, 18, 12)}</g><g class="hb"><rect x="${x1}" y="235" width="14" height="60" rx="4" fill="${C.ink}"/>`
      + grow(2, x1, 226, x1 - 100, 226, C.red, 7, 0.1) + grow(2, x1 + 14, 304, x1 + 114, 304, C.blue, 7, 1.3) + `</g></g>`;
    css += steps(id, 'cb', ['scaleX(1)', null, 'scaleX(.68)'], 0.9, 0.3) + steps(id, 'hb', ['translateX(0px)', null, 'translateX(-61px)'], 0.9, 0.3);
    body += at(2, 'pop', tag(110, 192, '손', HOT, { size: 18 }), 1) + at(2, 'pop', tag(440, 304, '탄성력', COLD), 1.8);
    body += glowRect(150, 120, 100, 40, 3, C.blue, 0, 20) + glowRect(390, 284, 100, 40, 3, C.blue, 0.2, 20);
    body += at(3, 'pop', tag(530, 200, '반대 방향', LIL), 0.4);
    put('7-2/과학/5/탄성력', svg(id, body, css));
  })();

  // ── 마찰력: 미끄러지는 상자의 바닥 면에서 움직이는 쪽과 반대로 ──
  (function () {
    const id = 't72-s5-machal';
    let css = base(id);
    let body = `<path d="M30 260 H610" stroke="${C.muted}" stroke-width="4"/>`;
    let teeth = 'M30 262';
    for (let x = 30; x < 610; x += 16) teeth += ` L${x + 8} 270 L${x + 16} 262`;
    body += `<path d="${teeth}" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<g class="sl">${box(60, 170, 110, 90)}<path d="M64 260 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7 l6 -7 l6 7" fill="none" stroke="${C.orange}" stroke-width="2"/>`
      + `<g class="b2">${grow(2, 115, 280, 30, 280, C.blue, 7, 0.1)}</g></g>`;
    css += `@keyframes ${id}-slide { from { transform: translateX(0); } to { transform: translateX(300px); } }
      .sc-${id} .sl { transform: translateX(300px); }
      .on1 .sc-${id} .sl { animation: ${id}-slide 2s cubic-bezier(.2,.7,.4,1) .3s both; }`;
    body += `<g class="b1 h2">${farrow(150, 140, 330, 140, C.green, 5)}${g('pop pop1', tag(240, 110, '움직이는 쪽', OK, { size: 18 }), 0.4)}</g>`;
    body += at(2, 'pop', tag(290, 316, '마찰력', COLD), 0.8) + ring(415, 268, 30, 2, C.blue, 0.9);
    body += glowRect(356, 246, 120, 34, 3, C.blue, 0, 10);
    body += at(3, 'pop', tag(530, 80, '마찰력', KEY, { size: 26 }), 0.6);
    put('7-2/과학/5/마찰력', svg(id, body, css));
  })();

  // ── 부력: 공기 중에서 5 N 인 추가 물속에서는 3 N — 물이 위로 2 N 만큼 밀어 올린다 ──
  (function () {
    const id = 't72-s5-bu';
    let css = base(id);
    const sc = springScale(230, { z0: 74, ppn: 20, max: 6, rod: 82, hang: lump(56, 40, [C.line, C.muted]), spr: 'spr', mv: 'mv' });
    let body = '';
    // 비커(칸 2에 올라온다)
    const bx = sc.hx, bw = 170, bt = 214, bb = 342;
    const beakerG = `<rect x="${bx - bw / 2 + 3}" y="${bt + 8}" width="${bw - 6}" height="${bb - bt - 10}" rx="8" fill="${C.sky}" fill-opacity=".8"/>`
      + `<path d="M${bx - bw / 2} ${bt} V${bb - 9} Q${bx - bw / 2} ${bb} ${bx - bw / 2 + 9} ${bb} H${bx + bw / 2 - 9} Q${bx + bw / 2} ${bb} ${bx + bw / 2} ${bb - 9} V${bt}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
    body += `<g class="bk">${beakerG}</g>`;
    body += sc.fixed + sc.spring + sc.moving;
    css += scaleMove(id, sc, 'mv', 'spr', [100, null, 60], 1.1, 0.9) + steps(id, 'bk', ['translateY(170px)', null, 'translateY(0px)'], 1.1, 0.2);
    // 물을 앞에 한 번 더 옅게(추가 물속에 있어 보이게)
    body += `<g class="bk"><rect x="${bx - bw / 2 + 3}" y="${bt + 8}" width="${bw - 6}" height="${bb - bt - 10}" rx="8" fill="${C.sky}" fill-opacity=".45"/><path d="M${bx - bw / 2 + 4} ${bt + 8} H${bx + bw / 2 - 4}" stroke="${C.blue}" stroke-width="2.5"/></g>`;
    body += ring(240, 174, 18, 1, C.red, 1.2) + `<g class="b1 h2">${tag(360, 174, '5 N', HOT, { size: 22 })}</g>`;
    body += ring(240, 134, 18, 2, C.blue, 1.8) + at(2, 'pop', tag(360, 134, '3 N', COLD, { size: 22 }), 1.9);
    body += grow(2, sc.hx, 334, sc.hx, 282, C.blue, 8, 2.0);
    body += at(3, 'pop', tag(500, 60, '5 N − 3 N = 2 N', LIL), 0.2) + at(3, 'pop', tag(510, 210, '부력', KEY, { size: 26 }), 0.7);
    body += glowRect(sc.hx - 36, 228, 72, 54, 3, C.blue, 0.2, 10);
    put('7-2/과학/5/부력', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
