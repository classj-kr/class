// 국어 2-2 낱말 도식: 1단원 흉내 내는 말, 3단원 중심 내용·대상·간추리다, 4단원 문장 부호, 5단원 바른 말, 7단원 중심 생각, 8단원 노랫말·흐름·간결하다.
// 도구(tile·tag·row·base·move 따위)는 figures/3-1/kor.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 2학년 눈높이: 글씨를 크게(조각 24~34), 한 장면에 한 생각.
// 움직임은 transform·opacity·stroke-dashoffset(과 색 바꾸기)만 쓴다. 아이패드 사파리는 CSS 로 x·y·width·height·r·d 를 바꾸지 못한다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게 실측: 한글 1em, 괄호 .36em, 쉼표·마침표·쌍점 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ○]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!\[\]]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
  const tw = (s, size) => [...s].reduce((a, c) => a + cw(c), 0) * size;
  const wOf = (label, size = 28) => Math.round(tw(label, size) + size * 1.3);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·slide) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;

  // 낱말 조각: 배경 rect.bg, 글자 text.tx — 색 바꾸기는 CSS 로 .bg 의 fill/stroke 를 바꾼다
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '', color = C.ink } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx', color })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: Math.round(size * 1.7), rx: Math.round(size * 0.85), fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange], r: [C.peach, C.red], g: ['white', C.muted] };
  // 낱말 줄: 폭을 재어 왼쪽 x0 부터(또는 가운데 cx 에 맞춰) 늘어놓는다
  const row = (labels, { y, x0, cx = 320, gap = 16, size = 28 }) => {
    const ws = labels.map((l) => wOf(l, size));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (labels.length - 1);
    let x = x0 != null ? x0 : cx - total / 2;
    return labels.map((label, i) => { const c = x + ws[i] / 2; x += ws[i] + gap; return { label, cx: c, w: ws[i], y, size, l: c - ws[i] / 2, r: c + ws[i] / 2 }; });
  };
  const T = (p, o = {}) => tile(p.cx, p.y, p.label, { size: p.size, w: p.w, ...o });
  const paint = (id, sel, [fill, stroke], n, delay = 0) =>
    `.on${n} .sc-${id} ${sel} .bg { fill: ${fill}; stroke: ${stroke};${delay ? ` transition-delay: ${delay}s;` : ''} }`;

  const head = (x, y, ang, color, w = 4) => {
    const l = 13, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 그어지는 곧은 화살표(칸 n)
  const drawArrow = (x1, y1, x2, y2, color, n, { width = 5, delay = 0 } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + g(`fin fin${n}`, head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color, width), delay + 0.9) + '</g>';
  // 그어지는 굽은 화살표(칸 n). peak 는 줄 꼭대기(또는 바닥) y
  const curve = (x1, y1, x2, y2, peak, color, n, { width = 4, arrowHead = true, delay = 0 } = {}) => {
    const cx = (x1 + x2) / 2, cy = 2 * peak - (y1 + y2) / 2, ang = Math.atan2(y2 - cy, x2 - cx);
    return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
      + (arrowHead ? g(`fin fin${n}`, head(x2, y2, ang, color, width), delay + 0.9) : '') + '</g>';
  };
  // 그어지는 선(칸 n, 화살촉 없음)
  const drawLine = (d, color, n, { width = 4, delay = 0, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ringAt = (cx, cy, r, n, color, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;

  // 장면마다 같이 쓰는 움직임. 같은 요소에 여러 칸 움직임이 붙으면 뒤 칸 것이 이긴다(칸 차례로 적는다).
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .shake, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1s ease-in-out; }
    .sc-${id} .bg { transition: fill .5s ease, stroke .5s ease; }
    .sc-${id} .dim { transition: opacity .6s ease; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-slide { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5); } }
    `;
    for (let n = 1; n <= 6; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .45s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .slide${n} { animation: ${id}-slide .55s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .2s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .shake${n} { animation: ${id}-shake .6s ease-in-out .2s 2; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .dim${n} { opacity: .3; }`;
    return s;
  };
  // 칸 n 에서 속성 없는 <g class="cls"> 를 옮긴다(처음 자리는 CSS transform 으로 둔다)
  const move = (id, cls, from, n, { dur = 1, delay = 0, to = 'none' } = {}) => `
    .sc-${id} .${cls} { transform: ${from}; transition: transform ${dur}s ease-in-out ${delay}s, opacity .6s ease ${delay}s; }
    .on${n} .sc-${id} .${cls} { transform: ${to}; }`;
  // 여러 칸에 걸쳐 옮기기: list = [[칸, transform, delay, 덧붙일 CSS]]
  const steps = (id, cls, first, list, { dur = 1, box = true } = {}) => {
    let s = `.sc-${id} .${cls} { transform: ${first}; transition: transform ${dur}s ease-in-out, opacity .6s ease;${box ? ' transform-box: fill-box; transform-origin: center;' : ''} }`;
    list.forEach(([n, t, d = 0, extra = '']) => { s += `\n    .on${n} .sc-${id} .${cls} { transform: ${t}; transition-delay: ${d}s;${extra ? ' ' + extra : ''} }`; });
    return s;
  };
  // 칸 n 에서 (dx, dy) 만큼 떨어진 곳에서 날아와 제자리에 앉는다(처음에는 보이지 않음)
  const flyIn = (id, cls, dx, dy, n, { delay = 0, dur = 0.9 } = {}) => `
    .sc-${id} .${cls} { transform: translate(${f(dx)}px, ${f(dy)}px); opacity: 0; transition: transform ${dur}s ease-in-out ${delay}s, opacity .25s ease ${delay}s; }
    .on${n} .sc-${id} .${cls} { transform: none; opacity: 1; }`;
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  const fadeCss = (id, sel, n, { to = 0.25, delay = 0 } = {}) => `.sc-${id} ${sel} { transition: opacity .6s ease ${delay}s; } .on${n} .sc-${id} ${sel} { opacity: ${to}; }`;

  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${f(y - r - 14 * r / 18)}" r="${r}" fill="${color}"/><path d="M${f(x - r * 1.6)} ${f(y + r * 1.5)} Q${f(x - r * 1.6)} ${y} ${x} ${y} Q${f(x + r * 1.6)} ${y} ${f(x + r * 1.6)} ${f(y + r * 1.5)} Z" fill="${color}"/>`;
  // 말풍선: 네모(x, y, w, h)와 꼬리 끝(tx, ty)
  const bubble = (x, y, w, h, tx, ty, stroke = C.muted, fill = 'white') => {
    const bx = Math.min(Math.max(tx, x + 24), x + w - 24);
    return `<path d="M${f(bx - 12)} ${f(y + h - 2)} L${f(tx)} ${f(ty)} L${f(bx + 12)} ${f(y + h - 2)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
      + `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
      + `<path d="M${f(bx - 10.5)} ${f(y + h - 1.5)} H${f(bx + 10.5)}" stroke="${fill}" stroke-width="4"/>`;
  };
  const bar = (x, y, w, color = '#b5c4be', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  const badge = (x, y, n, color = C.green, r = 16) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="white" stroke-width="2.5"/>` + text(x, y + 7, n, { size: 20, color: 'white' });
  const vMark = (x, y, color, w = 4) => `<path d="M${x - 9} ${y - 17} L${x} ${y + 3} L${x + 9} ${y - 17}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const sun = (x, y, r = 15, col = C.orange) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${C.yellow}" stroke="${col}" stroke-width="2.5"/>`
    + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(c * (r + 5))} ${f(s * (r + 5))} L${f(c * (r + 11))} ${f(s * (r + 11))}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`; }).join('') + '</g>';
  const moon = (x, y, r = 22) => `<path d="M${x + 6} ${y - r} A${r} ${r} 0 0 0 ${x + 6} ${y + r} A${f(r * 1.25)} ${f(r * 1.25)} 0 0 1 ${x + 6} ${y - r} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const sparkle = (x, y, s = 1, col = C.yellow) => `<path d="M${x} ${f(y - 12 * s)} L${f(x + 3.5 * s)} ${f(y - 3.5 * s)} L${f(x + 12 * s)} ${y} L${f(x + 3.5 * s)} ${f(y + 3.5 * s)} L${x} ${f(y + 12 * s)} L${f(x - 3.5 * s)} ${f(y + 3.5 * s)} L${f(x - 12 * s)} ${y} L${f(x - 3.5 * s)} ${f(y - 3.5 * s)} Z" fill="${col}" stroke="${C.orange}" stroke-width="1.5" stroke-linejoin="round"/>`;

  const K = '2-2/국어/';
  const GRAY = '#b5c4be';

  // ── 1단원: 흉내 내는 말(강아지 소리 '멍멍', 토끼가 뛰는 모양 '깡충깡충') ──────────────────────────────
  (function () {
    const id = 't22-k1-hyungnae';
    let css = base(id);
    const dog = `<path d="M70 262 Q58 240 66 226" stroke="${C.orange}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      + `<rect x="86" y="282" width="12" height="34" rx="5" fill="${C.orange}"/><rect x="152" y="282" width="12" height="34" rx="5" fill="${C.orange}"/>`
      + `<ellipse cx="124" cy="266" rx="58" ry="30" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<circle cx="188" cy="222" r="30" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M168 202 Q150 214 160 244 Q172 236 176 210 Z" fill="${C.orange}"/>`
      + `<circle cx="196" cy="214" r="4" fill="${C.ink}"/><ellipse cx="216" cy="226" rx="6" ry="5" fill="${C.ink}"/><path d="M200 238 Q210 244 218 238" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    let body = at(1, 'fin', `<path d="M30 318 H290" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/><path d="M350 318 H610" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`);
    body += `<g class="b1"><g class="dg">${dog}</g></g>`;
    css += `.sc-${id} .dg { transform-box: fill-box; transform-origin: center bottom; }
      @keyframes ${id}-bark { 0%, 100% { transform: none; } 30% { transform: rotate(-3deg) translateY(-4px); } 60% { transform: none; } }
      .on1 .sc-${id} .dg { animation: ${id}-bark .5s ease-in-out .5s 3; }`;
    [16, 30, 44].forEach((rad, i) => { body += drawLine(`M232 ${226 - rad} A${rad} ${rad} 0 0 1 232 ${226 + rad}`, C.orange, 1, { width: 5, delay: 0.5 + i * 0.2 }); });
    body += at(1, 'pop', tile(165, 110, '멍멍', { size: 34, h: 64, fill: C.peach, stroke: C.orange, cls: 'm1' }), 1.0);
    // 칸 2: 토끼가 깡충깡충 뛰어 온다
    const rabbit = `<ellipse cx="0" cy="-26" rx="36" ry="26" fill="white" stroke="${C.muted}" stroke-width="3"/><circle cx="-36" cy="-30" r="9" fill="white" stroke="${C.muted}" stroke-width="3"/>`
      + `<ellipse cx="22" cy="-82" rx="7" ry="22" fill="white" stroke="${C.muted}" stroke-width="3" transform="rotate(-10 22 -82)"/><ellipse cx="38" cy="-80" rx="7" ry="22" fill="white" stroke="${C.muted}" stroke-width="3" transform="rotate(12 38 -80)"/>`
      + `<circle cx="30" cy="-52" r="20" fill="white" stroke="${C.muted}" stroke-width="3"/><circle cx="38" cy="-55" r="3.5" fill="${C.ink}"/><circle cx="48" cy="-47" r="3" fill="${C.red}"/>`;
    body += drawLine(`M302 316 Q334 236 367 316 Q399 236 432 316`, GRAY, 2, { width: 3, delay: 0.1 });
    body += `<g class="b2"><g class="rb"><g transform="translate(472 318)">${rabbit}</g></g></g>`;
    css += `.sc-${id} .rb { transform: translate(-130px, 0px); }
      @keyframes ${id}-hop { 0% { transform: translate(-130px, 0px); } 25% { transform: translate(-97px, -70px); } 50% { transform: translate(-65px, 0px); } 75% { transform: translate(-32px, -70px); } 100% { transform: none; } }
      .on2 .sc-${id} .rb { animation: ${id}-hop 1.3s ease-in-out .2s both; }`;
    body += at(2, 'pop', tile(470, 110, '깡충깡충', { size: 34, h: 64, fill: C.sky, stroke: C.blue, cls: 'm2' }), 1.4);
    // 칸 3: 소리를 흉내 낸 말, 모양을 흉내 낸 말
    body += at(3, 'pop', tag(165, 172, '소리 흉내', ROLE.o, 22), 0.2) + at(3, 'pop', tag(470, 172, '모양 흉내', ROLE.s, 22), 0.6);
    css += pulseCss(id, '.m1', 3, 0.3) + pulseCss(id, '.m2', 3, 0.7);
    // 칸 4
    body += at(4, 'pop', tag(320, 40, '흉내 내는 말', ROLE.p, 24), 0.2);
    body += glowRect(105, 74, 120, 72, 4, C.orange, 0.6, 16) + glowRect(372, 74, 196, 72, 4, C.blue, 0.8, 16);
    put(K + '1/흉내 내는 말', svg(id, body, css));
  })();

  // ── 3단원: 대상·중심 내용·간추리다(「빗자루」 — 네 문단이 모두 빗자루를 설명한다 / 문단의 알맹이 / 짧게 정리) ──────────────────────────────
  const broom = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-6 -90 L6 -90 L8 10 L-8 10 Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<path d="M-14 6 H14 L40 86 Q0 96 -40 86 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M-14 22 H14 M-6 30 L-18 84 M4 30 L4 88 M12 30 L24 86 M-12 30 L-30 84" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round"/></g>`;
  const article = (id, mode) => {
    let css = base(id);
    const PX = 30, PW = 262, PT = [96, 160, 224, 288];
    let body = at(1, 'fin', `<rect x="${PX}" y="24" width="${PW}" height="318" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(PX + PW / 2, 62, '빗자루', { size: 26 }), 0.1);
    // 문단 넷: 첫 줄은 '빗자루' 조각과 줄, 나머지 두 줄
    PT.forEach((y, i) => {
      const lines = bar(PX + 104, y, PW - 120, GRAY, 10) + bar(PX + 16, y + 20, PW - 32 - (i % 2) * 30, GRAY, 10) + bar(PX + 16, y + 40, PW - 80 + (i % 2) * 24, GRAY, 10);
      body += at(1, 'fin', `<g class="pa${i}">${tile(PX + 52, y, '빗자루', { size: 18, h: 28, w: 76, rx: 8, sw: 2, cls: `bj${i}` })}${lines}</g>`, 0.2 + i * 0.12);
    });
    const KEY = ['청소 도구', '만드는 법', '여러 가지 이름'];
    const under = (n, d0 = 0.1) => [0, 1, 2].map((i) => drawLine(`M${PX + 100} ${PT[i] + 10} H${PX + PW - 12}`, C.orange, n, { width: 4, delay: f(d0 + i * 0.35) })).join('');
    if (mode === 'daesang') {
      // 칸 2: 문단마다 '빗자루'가 빛난다
      PT.forEach((y, i) => { css += paint(id, `.bj${i}`, ROLE.o, 2, f(0.2 + i * 0.3)); css += pulseCss(id, `.bj${i}`, 2, f(0.3 + i * 0.3)); });
      // 칸 3: 네 문단에서 빗자루 그림으로 화살표가 모인다
      body += at(3, 'pop', broom(470, 182, 1.15), 0.1);
      PT.forEach((y, i) => { body += drawArrow(PX + PW + 6, y + 20, 418, 150 + i * 22, C.orange, 3, { width: 4, delay: f(0.4 + i * 0.15) }); });
      // 칸 4
      body += at(4, 'pop', tag(470, 322, '대상', ROLE.o, 26), 0.4);
      body += ringAt(470, 190, 90, 4, C.orange, 0.1);
    } else if (mode === 'jungsim') {
      body += under(2);
      // 칸 3: 밑줄 친 내용이 알맹이 동그라미로 모인다
      body += at(3, 'fin', `<circle cx="466" cy="190" r="128" fill="${C.peach}" fill-opacity=".45" stroke="${C.orange}" stroke-width="3" stroke-dasharray="10 8"/>`, 0.1);
      KEY.forEach((k, i) => {
        const y = 136 + i * 54;
        body += `<g class="b3"><g class="k${i}">${tile(466, y, k, { size: 22, h: 44, fill: 'white', stroke: C.orange })}</g></g>`;
        css += flyIn(id, `k${i}`, PX + PW / 2 - 466, PT[i] + 12 - y, 3, { delay: f(0.3 + i * 0.3), dur: 0.8 });
      });
      body += glowRect(334, 58, 264, 264, 4, C.orange, 0.1, 132);
      body += at(4, 'pop', tag(466, 30, '중심 내용', ROLE.o, 22), 0.7);
      css += pulseCss(id, '.k0 .tl', 4, 1.0) + pulseCss(id, '.k1 .tl', 4, 1.1) + pulseCss(id, '.k2 .tl', 4, 1.2);
    } else {
      body += under(2);
      // 칸 2: 밑줄 없는 줄은 덜어 낸다
      css += [0, 1, 2].map((i) => [2, 3].map((m) => fadeCss(id, `.pa${i} > rect:nth-of-type(${m})`, 2, { to: 0.2, delay: 1.2 })).join('')).join('') + fadeCss(id, '.pa3', 2, { to: 0.2, delay: 1.2 });
      // 칸 3: 짧은 쪽지
      body += drawArrow(300, 190, 340, 190, C.muted, 3, { width: 4, delay: 0.1 });
      body += at(3, 'rise', `<rect x="358" y="96" width="250" height="188" rx="12" fill="${C.yellow}" fill-opacity=".35" stroke="${C.orange}" stroke-width="3"/>` + text(483, 128, '빗자루', { size: 24 }), 0.3);
      KEY.forEach((k, i) => {
        const y = 168 + i * 40;
        body += `<g class="b3"><g class="n${i}">${text(376, y + 8, `${i + 1}. ${k}`, { size: 22, anchor: 'start' })}</g></g>`;
        css += flyIn(id, `n${i}`, PX + 20 - 376, PT[i] + 4 - y, 3, { delay: f(0.6 + i * 0.3), dur: 0.7 });
      });
      body += glowRect(352, 90, 262, 200, 4, C.orange, 0.1, 16);
      body += at(4, 'pop', tag(483, 322, '간추리다', ROLE.o, 24), 0.6);
    }
    return svg(id, body, css);
  };
  put(K + '3/대상', article('t22-k3-daesang', 'daesang'));
  put(K + '3/중심 내용', article('t22-k3-jungsim', 'jungsim'));
  put(K + '3/간추리다', article('t22-k3-ganchu', 'ganchu'));

  // ── 4단원: 문장 부호('밥 먹었어' 끝에 . ? ! 를 붙이면 뜻이 달라진다, 쉼표와 따옴표) ──────────────────────────────
  (function () {
    const id = 't22-k4-buho';
    let css = base(id);
    const Y = [86, 162, 238], S = 34, X0 = 110, wS = tw('밥 먹었어', S);
    const M = [['.', C.green, '알림', '마침표'], ['?', C.blue, '물음', '물음표'], ['!', C.orange, '느낌', '느낌표']];
    const face = (x, y, k) => `<circle cx="${x}" cy="${y}" r="27" fill="#fdf3d3" stroke="${C.orange}" stroke-width="3"/>`
      + (k === 0 ? `<circle cx="${x - 9}" cy="${y - 6}" r="3" fill="${C.ink}"/><circle cx="${x + 9}" cy="${y - 6}" r="3" fill="${C.ink}"/><path d="M${x - 10} ${y + 8} Q${x} ${y + 15} ${x + 10} ${y + 8}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
        : k === 1 ? `<circle cx="${x - 9}" cy="${y - 6}" r="3" fill="${C.ink}"/><circle cx="${x + 9}" cy="${y - 6}" r="3" fill="${C.ink}"/><circle cx="${x}" cy="${y + 11}" r="5" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M${x - 14} ${y - 16} L${x - 5} ${y - 14}" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>`
          : `<path d="M${x - 14} ${y - 10} Q${x - 9} ${y - 16} ${x - 4} ${y - 10} M${x + 4} ${y - 10} Q${x + 9} ${y - 16} ${x + 14} ${y - 10}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x - 11} ${y + 3} Q${x} ${y + 24} ${x + 11} ${y + 3} Z" fill="${C.red}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`);
    let body = '';
    M.forEach(([mk, col, lab, name], i) => {
      const n = i + 1, y = Y[i];
      body += at(n, 'fin', text(X0, y + 12, '밥 먹었어', { size: S, anchor: 'start' }), 0.1);
      body += at(n, 'pop', `<g class="mk${i}">${text(f(X0 + wS + 3), y + 12, mk, { size: S + 4, anchor: 'start', color: col, weight: 800 })}</g>`, 0.6);
      body += ringAt(f(X0 + wS + 12), y, 20, n, col, 0.8);
      body += at(n, 'pop', face(390, y, i), 1.1);
      body += at(n, 'fin', text(432, y + 8, lab, { size: 22, anchor: 'start', color: col }), 1.4);
      body += at(4, 'pop', tag(560, y, name, [col === C.green ? C.mint : col === C.blue ? C.sky : C.peach, col], 20), f(0.2 + i * 0.2));
    });
    // 칸 4: 쉼표와 따옴표
    body += at(4, 'fin', text(220, 324, `<tspan fill="${C.red}">“</tspan>응<tspan fill="${C.purple}">,</tspan> 먹었어.<tspan fill="${C.red}">”</tspan>`, { size: 30 }), 0.8);
    body += at(4, 'pop', tag(394, 314, '쉼표', ROLE.x, 20), 1.0) + at(4, 'pop', tag(484, 314, '따옴표', ROLE.r, 20), 1.2);
    body += at(4, 'pop', tag(320, 30, '문장 부호', ROLE.p, 22), 1.4);
    put(K + '4/문장 부호', svg(id, body, css));
  })();

  // ── 5단원: 바른 말(크기가 작을 때는 '작다', 양이 조금일 때는 '적다') ──────────────────────────────
  (function () {
    const id = 't22-k5-bareun';
    let css = base(id);
    const r = row(['가방이 너무', '적네'], { y: 76, cx: 165, size: 28, gap: 10 });
    let body = at(1, 'fin', text(r[0].cx, 86, '가방이 너무', { size: 28 }), 0.1);
    body += `<g class="b1 h3"></g>`;
    body += `<g class="b1"><g class="w1">${T(r[1], { h: 56, fill: 'white', stroke: C.muted })}</g></g>`;
    body += `<g class="b2"><g class="w2">${T({ ...r[1], label: '작네' }, { h: 56, fill: C.mint, stroke: C.green })}</g></g>`;
    css += `.sc-${id} .w1, .sc-${id} .w2 { transform-box: fill-box; transform-origin: center; }
      .sc-${id} .w1 { transition: transform .35s ease-in 1.2s; } .on2 .sc-${id} .w1 { transform: scaleY(0); }
      .sc-${id} .w2 { transform: scaleY(0); transition: transform .35s ease-out 1.55s; } .on2 .sc-${id} .w2 { transform: none; }
      @keyframes ${id}-shk { 0%, 100% { transform: translateX(0); } 25%, 75% { transform: translateX(-7px); } 50% { transform: translateX(7px); } }
      .on2 .sc-${id} .w1 .tl { animation: ${id}-shk .5s ease-in-out .2s 2; }`;
    body += `<g class="b2"><g class="xx">${g('pop pop2', cross(r[1].r - 4, 46, 9), 0.4)}</g></g>`;
    css += `.sc-${id} .xx { transition: opacity .3s ease 1.2s; } .on2 .sc-${id} .xx { opacity: 0; }`;
    body += at(2, 'pop', check(r[1].r - 4, 46, 9), 1.8);
    // 작은 가방과 다 들어가지 않는 책
    body += at(1, 'fin', `<rect x="128" y="160" width="70" height="92" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" transform="rotate(-6 163 206)"/>`
      + `<path d="M138 214 Q165 176 192 214" stroke="${C.purple}" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="112" y="206" width="106" height="84" rx="16" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><rect x="150" y="226" width="30" height="14" rx="5" fill="${C.purple}"/>`, 0.3);
    // 칸 2: 크기 재기
    body += drawLine(`M112 310 H218`, C.green, 2, { width: 4, delay: 0.6 }) + at(2, 'fin', `<path d="M112 302 V318 M218 302 V318" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>` + text(165, 342, '크기', { size: 22, color: C.green }), 0.9);
    // 칸 3: 과자가 적다(양)
    const r3 = row(['과자가', '적네'], { y: 76, cx: 470, size: 28, gap: 10 });
    body += at(3, 'fin', text(r3[0].cx, 86, '과자가', { size: 28 }), 0.1);
    body += at(3, 'pop', `<g class="w3">${T(r3[1], { h: 56, fill: C.mint, stroke: C.green })}</g>`, 0.9) + at(3, 'pop', check(r3[1].r - 4, 46, 9), 1.4);
    body += at(3, 'rise', `<ellipse cx="480" cy="262" rx="96" ry="26" fill="white" stroke="${C.muted}" stroke-width="3"/><ellipse cx="480" cy="256" rx="70" ry="15" fill="none" stroke="${C.line}" stroke-width="2.5"/>`
      + [[456, 246], [500, 250]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><circle cx="${x - 6}" cy="${y - 4}" r="2.5" fill="${C.orange}"/><circle cx="${x + 5}" cy="${y + 3}" r="2.5" fill="${C.orange}"/>`).join(''), 0.3);
    body += at(3, 'fin', text(480, 330, '양', { size: 22, color: C.green }), 1.1);
    // 칸 4
    css += pulseCss(id, '.w2 .tl', 4, 0.2) + pulseCss(id, '.w3 .tl', 4, 0.4);
    body += at(4, 'pop', tag(320, 200, '바른 말', ROLE.p, 24), 0.8);
    put(K + '5/바른 말', svg(id, body, css));
  })();

  // ── 7단원: 중심 생각(「반려견을 사랑한다면」 문단 셋의 가장 중요한 생각이 모여 글쓴이의 생각이 된다) ──────────────────────────────
  (function () {
    const id = 't22-k7-jungsim';
    let css = base(id);
    const PT = [62, 152, 242], PX = 26, PW = 270;
    const IDEA = ['배설물 치우기', '목줄 채우기', '못 가는 곳 피하기'], IY = [96, 176, 256], IX = 462;
    let body = at(1, 'pop', tag(160, 24, '반려견을 사랑한다면', ROLE.g, 18), 0.1);
    PT.forEach((y, i) => {
      body += at(1, 'fin', `<rect x="${PX}" y="${y - 18}" width="${PW}" height="80" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`
        + badge(PX + 22, y + 2, i + 1, C.muted, 14) + bar(PX + 44, y + 2, PW - 62, GRAY, 10) + bar(PX + 16, y + 24, PW - 32, GRAY, 10) + bar(PX + 16, y + 44, PW - 70, GRAY, 10), 0.2 + i * 0.15);
      body += drawLine(`M${PX + 42} ${y + 14} H${PX + PW - 14}`, C.orange, 2, { width: 4, delay: f(0.2 + i * 0.4) });
    });
    // 칸 3: 문단마다 중요한 생각이 오른쪽으로
    IDEA.forEach((t, i) => {
      body += `<g class="b3"><g class="i${i}">${tile(IX, IY[i], t, { size: 22, h: 46, fill: C.peach, stroke: C.orange })}</g></g>`;
      css += flyIn(id, `i${i}`, PX + PW / 2 - IX, PT[i] + 2 - IY[i], 3, { delay: f(0.2 + i * 0.35), dur: 0.8 });
    });
    // 칸 4: 중심 생각이 모여 글쓴이의 생각
    body += at(4, 'fin', `<rect x="336" y="80" width="252" height="190" rx="18" fill="none" stroke="${C.green}" stroke-width="4" stroke-dasharray="12 8"/>`, 0.8);
    css += `.on4 .sc-${id} .i0 { transform: translateY(18px); transition-delay: .1s; } .on4 .sc-${id} .i2 { transform: translateY(-18px); transition-delay: .1s; }`;
    body += at(4, 'pop', tag(IX, 36, '중심 생각', ROLE.o, 22), 0.2);
    body += at(4, 'pop', tag(IX, 318, '글쓴이의 생각', ROLE.p, 22), 1.1);
    css += pulseCss(id, '.i0 .tl', 4, 0.3) + pulseCss(id, '.i1 .tl', 4, 0.4) + pulseCss(id, '.i2 .tl', 4, 0.5);
    put(K + '7/중심 생각', svg(id, body, css));
  })();

  // ── 8단원: 노랫말(놀이터에서 논 일을 '그네 타고 시소 타고 / 너랑 함께 신난 하루'로 — 되풀이와 네 글자 맞추기) ──────────────────────────────
  (function () {
    const id = 't22-k8-noraet';
    let css = base(id);
    // 왼쪽: 겪은 일을 쓴 글
    const swing = `<path d="M96 132 L120 74 L180 74 L204 132" stroke="${C.muted}" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M140 74 V112 M160 74 V112" stroke="${C.ink}" stroke-width="2.5"/><rect x="134" y="110" width="32" height="8" rx="3" fill="${C.orange}"/>`;
    let body = `<g class="dim dim4">` + at(1, 'fin', `<rect x="30" y="56" width="240" height="242" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + swing
      + [160, 184, 208, 232, 256].map((y, i) => bar(48, y, [200, 186, 204, 170, 120][i], GRAY, 10)).join('') + text(150, 38, '겪은 일', { size: 20, color: C.muted }), 0.1) + '</g>';
    // 칸 2: 노랫말 쪽지
    body += drawArrow(282, 178, 326, 178, C.muted, 2, { width: 4, delay: 0.1 });
    const L1 = '그네 타고 시소 타고', L2 = '너랑 함께 신난 하루', S = 26, CX = 478, Y1 = 158, Y2 = 236;
    const xs = (line) => { const out = []; let x = CX - tw(line, S) / 2; for (const ch of line) { if (ch !== ' ') out.push([ch, x + cw(ch) * S / 2]); x += cw(ch) * S; } return out; };
    const p1 = xs(L1), p2 = xs(L2);
    body += at(2, 'rise', `<rect x="342" y="56" width="272" height="242" rx="12" fill="${C.lilac}" fill-opacity=".5" stroke="${C.purple}" stroke-width="3"/>`, 0.3);
    // 칸 3: '타고' 되풀이 표시(글자 아래에 깔림)
    [[2, 3], [6, 7]].forEach(([a, b], k) => { body += at(3, 'pop', `<rect x="${f(p1[a][1] - 16)}" y="${Y1 - 26}" width="${f(p1[b][1] - p1[a][1] + 32)}" height="36" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`, f(0.1 + k * 0.3)); });
    body += at(2, 'fin', text(CX, Y1, L1, { size: S }) + text(CX, Y2, L2, { size: S }), 0.6);
    // 칸 3: 글자마다 박자 점
    [[p1, Y1], [p2, Y2]].forEach(([ps, y], li) => {
      ps.forEach(([ch, x], i) => { body += at(3, 'pop', `<circle cx="${f(x)}" cy="${y + 22}" r="5.5" fill="${i < 4 ? C.blue : C.green}"/>`, f(0.7 + li * 0.4 + i * 0.05)); });
    });
    // 음표
    const note = (x, y, col) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="${col}" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 8} ${y - 2} V${y - 34} Q${x + 18} ${y - 28} ${x + 22} ${y - 18}" stroke="${col}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    body += `<g class="b2"><g class="nt">${note(370, 110, C.purple)}${note(588, 104, C.blue)}${note(594, 292, C.orange)}</g></g>`;
    css += `.sc-${id} .nt { opacity: 0; transition: opacity .5s ease 1s; } .on2 .sc-${id} .nt { opacity: 1; }
      @keyframes ${id}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      .on4 .sc-${id} .nt { animation: ${id}-bob .8s ease-in-out 0s 2; }`;
    body += at(4, 'pop', tag(CX, 324, '노랫말', ROLE.x, 24), 0.5);
    body += glowRect(336, 50, 284, 254, 4, C.purple, 0.1, 16);
    put(K + '8/노랫말', svg(id, body, css));
  })();

  // ── 8단원: 흐름(씨앗 → 싹 → 꽃 → 다음은? 열매 — 일이 물 흐르듯 이어진다) ──────────────────────────────
  (function () {
    const id = 't22-k8-heureum';
    let css = base(id);
    const CX = [92, 242, 392, 548], CY = 176, CW = 116, CH = 124;
    const river = `M10 262 Q90 236 170 262 T330 262 T490 262 T650 262`;
    let body = at(1, 'fin', `<path d="${river}" stroke="${C.sky}" stroke-width="42" fill="none" stroke-linecap="round"/><path class="fl" d="${river}" stroke="white" stroke-width="5" fill="none" stroke-dasharray="26 22" stroke-linecap="round"/>`, 0.1);
    css += `@keyframes ${id}-flow { from { stroke-dashoffset: 48; } to { stroke-dashoffset: 0; } }
      .sc-${id} .fl { animation: ${id}-flow 1.2s linear infinite; }`;
    const card = (x, label, art, o = {}) => `<rect x="${x - CW / 2}" y="${CY - CH / 2}" width="${CW}" height="${CH}" rx="14" fill="${o.fill || 'white'}" stroke="${o.stroke || C.ink}" stroke-width="3"${o.dash ? ' stroke-dasharray="9 7"' : ''}/>` + art + (label ? text(x, CY + CH / 2 - 10, label, { size: 24 }) : '');
    const soil = (x) => `<path d="M${x - 40} ${CY + 8} H${x + 40}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`;
    const seed = (x) => soil(x) + `<ellipse cx="${x}" cy="${CY + 18}" rx="10" ry="7" fill="${C.orange}" stroke="${C.ink}" stroke-width="2"/>`;
    const sprout = (x) => soil(x) + `<path d="M${x} ${CY + 8} V${CY - 24}" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/><path d="M${x} ${CY - 16} Q${x - 26} ${CY - 34} ${x - 30} ${CY - 14} Q${x - 12} ${CY - 6} ${x} ${CY - 16} Z M${x} ${CY - 22} Q${x + 24} ${CY - 42} ${x + 30} ${CY - 22} Q${x + 12} ${CY - 12} ${x} ${CY - 22} Z" fill="${C.green}"/>`;
    const flower = (x) => soil(x) + `<path d="M${x} ${CY + 8} V${CY - 18}" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>` + [0, 72, 144, 216, 288].map((a) => `<circle cx="${f(x + 12 * Math.sin(a * Math.PI / 180))}" cy="${f(CY - 30 - 12 * Math.cos(a * Math.PI / 180))}" r="10" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`).join('') + `<circle cx="${x}" cy="${CY - 30}" r="7" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;
    const fruit = (x, y = CY - 20, k = 1) => `<path d="M${x} ${f(y - 22 * k)} V${f(y - 34 * k)}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${f(22 * k)}" fill="${C.red}"/><path d="M${x} ${f(y - 28 * k)} Q${f(x + 14 * k)} ${f(y - 40 * k)} ${f(x + 20 * k)} ${f(y - 28 * k)} Q${f(x + 10 * k)} ${f(y - 22 * k)} ${x} ${f(y - 28 * k)} Z" fill="${C.green}"/>`;
    const snowman = (x, y, k = 1) => `<circle cx="${x}" cy="${f(y + 10 * k)}" r="${f(16 * k)}" fill="white" stroke="${C.blue}" stroke-width="2.5"/><circle cx="${x}" cy="${f(y - 14 * k)}" r="${f(11 * k)}" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`;
    body += at(1, 'pop', card(CX[0], '씨앗', seed(CX[0])), 0.4);
    body += at(2, 'pop', card(CX[1], '싹', sprout(CX[1])), 0.4) + at(2, 'pop', card(CX[2], '꽃', flower(CX[2])), 1.1);
    body += drawArrow(CX[0] + CW / 2 + 4, CY, CX[1] - CW / 2 - 4, CY, C.blue, 2, { width: 4, delay: 0.1 }) + drawArrow(CX[1] + CW / 2 + 4, CY, CX[2] - CW / 2 - 4, CY, C.blue, 2, { width: 4, delay: 0.8 });
    // 칸 3: 다음은? — 열매가 이어지고, 눈사람은 아니다
    body += `<g class="h4">` + at(3, 'fin', card(CX[3], '', text(CX[3], CY + 12, '?', { size: 44, color: C.muted }), { dash: true, stroke: C.muted }), 0.1) + '</g>';
    body += `<g class="dim dim4">` + at(3, 'pop', `<rect x="${CX[3] - 138}" y="22" width="88" height="70" rx="12" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + snowman(CX[3] - 94, 58, 1), 0.3)
      + at(3, 'pop', cross(CX[3] - 56, 30, 9), 0.8) + '</g>';
    body += `<g class="b3"><g class="fr">${card(CX[3], '열매', fruit(CX[3]), { stroke: C.green })}</g></g>`;
    css += `.sc-${id} .fr { transform-box: fill-box; transform-origin: center; transform: translate(-4px, -120px) scale(.6); opacity: 0; transition: transform .8s ease-in-out 1.1s, opacity .3s ease .9s; }
      .on3 .sc-${id} .fr { transform: none; opacity: 1; }`;
    body += at(3, 'pop', `<rect x="${CX[3] - 28}" y="22" width="88" height="70" rx="12" fill="white" stroke="${C.green}" stroke-width="2.5"/>` + fruit(CX[3] + 16, 62, 0.8), 0.3);
    body += drawArrow(CX[2] + CW / 2 + 4, CY, CX[3] - CW / 2 - 4, CY, C.blue, 3, { width: 4, delay: 0.7 });
    // 칸 4
    body += at(4, 'pop', tag(320, 324, '흐름', ROLE.s, 26), 0.6);
    css += `.on4 .sc-${id} .fl { animation-duration: .6s; }`;
    put(K + '8/흐름', svg(id, body, css));
  })();

  // ── 8단원: 간결하다(긴 글에서 없어도 되는 말을 지우면 '밤새 눈이 내려 온 세상이 하얗다.') ──────────────────────────────
  (function () {
    const id = 't22-k8-gangyeol';
    let css = base(id);
    const S = 24, H = 48;
    const R = [row(['오늘', '아침에', '일어나', '창문을', '열어 보니'], { y: 56, size: S, gap: 10 }), row(['밤새', '하얀', '눈이', '펑펑', '내려'], { y: 118, size: S, gap: 10 }), row(['온 세상이', '정말', '하얗다.'], { y: 180, size: S, gap: 10 })];
    const KEEP = ['밤새', '눈이', '내려', '온 세상이', '하얗다.'];
    const F = row(KEEP, { y: 300, size: S, gap: 10 });
    let body = '';
    let k = 0, cut = 0;
    R.flat().forEach((p, i) => {
      const keep = KEEP.indexOf(p.label);
      body += `<g class="b1"><g class="t${i}">${g('pop pop1', T(p, { h: H }), f(0.1 + i * 0.06))}</g></g>`;
      if (keep < 0) {
        css += fadeCss(id, `.t${i}`, 2, { to: 0.25, delay: f(0.3 + cut * 0.15 + 0.6) });
        body += drawLine(`M${f(p.l - 4)} ${p.y} H${f(p.r + 4)}`, C.red, 2, { width: 4, delay: f(0.2 + cut * 0.15) });
        cut++;
      } else {
        const q = F[keep];
        css += steps(id, `t${i}`, 'none', [[3, `translate(${f(q.cx - p.cx)}px, ${f(q.y - p.y)}px)`, f(0.1 + keep * 0.15)]], { dur: 0.9, box: false });
        css += paint(id, `.t${i}`, ROLE.p, 3, f(0.9 + keep * 0.15));
        k++;
      }
    });
    // 칸 4
    body += glowRect(F[0].l - 10, 268, F[4].r - F[0].l + 20, 64, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(320, 240, '간결하다', ROLE.p, 24), 0.7);
    put(K + '8/간결하다', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
