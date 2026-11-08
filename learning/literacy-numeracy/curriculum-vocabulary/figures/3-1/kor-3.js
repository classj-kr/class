// 국어 3-1 낱말 도식(4단원 메모·기호·천적·메주·볏짚·띄우다·발효·미생물·숯·이랑·아름드리, 5단원 인물·성격·높임 표현·추신·겨우내·흑백·구체적,
// 6단원 사실·의견·구분·과거·현재·쓰임새·협동·인공 지능·공익 광고·분리배출·그루잠, 덧붙임: 4단원 액체·무역·성분, 6단원 소화·기온·기사·감상문·보고서). 도구(tile·tag·row·base·move 따위)는 figures/4-1/kor-3.js 에서 옮겨 왔다.
// 움직임은 transform·opacity·stroke-dashoffset(과 색 바꾸기)만 쓴다. 아이패드 사파리는 CSS 로 x·y·width·height·r·d 를 바꾸지 못한다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게 실측: 한글 1em, 괄호 .36em, 쉼표·마침표·쌍점 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ○『』「」]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
  const tw = (s, size) => [...s].reduce((a, c) => a + cw(c), 0) * size;
  const wOf = (label, size = 28) => Math.round(tw(label, size) + size * 1.3);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·slide·slr) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;

  // 낱말 조각: 배경 rect.bg, 글자 text.tx — 색 바꾸기는 CSS 로 .bg 의 fill/stroke 를 바꾼다
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '' } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx' })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: 34, rx: 17, fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const TAN = '#fdf3d3';
  const GRAY = '#b5c4be';
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: [TAN, C.orange], r: [C.peach, C.red], g: ['white', C.muted] };
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
  // 그어지는 굽은 줄(칸 n). peak 는 줄 꼭대기 y. 끝에 화살촉.
  const curve = (x1, y1, x2, y2, peak, color, n, { width = 4, arrowHead = true, delay = 0 } = {}) => {
    const cx = (x1 + x2) / 2, cy = 2 * peak - (y1 + y2) / 2, ang = Math.atan2(y2 - cy, x2 - cx);
    return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
      + (arrowHead ? g(`fin fin${n}`, head(x2, y2, ang, color, width), delay + 0.9) : '') + '</g>';
  };
  // 그어지는 곧은 화살표(칸 n)
  const drawArrow = (x1, y1, x2, y2, color, n, { width = 5, delay = 0, arrowHead = true } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + (arrowHead ? g(`fin fin${n}`, head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color, width), delay + 0.9) : '') + '</g>';
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  // 오른쪽을 감싸는 묶음 괄호(세로, 끝이 오른쪽을 가리킴)
  const braceR = (x, y1, y2, color = C.green, w = 3.5) => {
    const m = (y1 + y2) / 2;
    return `<path d="M${x - 12} ${y1} Q${x} ${y1} ${x} ${y1 + 14} V${m - 12} Q${x} ${m} ${x + 12} ${m} Q${x} ${m} ${x} ${m + 12} V${y2 - 14} Q${x} ${y2} ${x - 12} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (x, y, r, color, n, delay = 0) => `<g class="b${n}"><circle class="ring ring${n}" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="3"${dl(delay)}/></g>`;

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
    @keyframes ${id}-slr { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
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
    .on${n} .sc-${id} .slr${n} { animation: ${id}-slr .55s ease-out both; }
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
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  // 왼쪽에서 오른쪽으로 자라는 막대(칸 n)
  const growCss = (id, sel, n) => `.sc-${id} ${sel} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;
  const bar = (x, y, w, color = GRAY, h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;
  const at0 = (x, y, inner, s = 1) => `<g transform="translate(${x} ${y})${s !== 1 ? ` scale(${s})` : ''}">${inner}</g>`;

  // ── 이 파일에서 더 쓰는 도구 ──────────────────────────────
  const P = (d, fill = 'none', stroke = C.ink, sw = 3, extra = '') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const star = (cx, cy, r, fill = C.yellow, stroke = C.orange) => {
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += `${i ? 'L' : 'M'}${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))} `; }
    return P(d + 'Z', fill, stroke, 3);
  };
  const card = (x, y, w, h, stroke = C.line) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="white" stroke="${stroke}" stroke-width="3"/>`;
  // 칸 n 에서 속성 없는 <g class="cls"> 가 왼쪽부터 자란다(지연 s 초)
  const growAt = (id, cls, n, s = 0, dur = 0.4) => `.sc-${id} .${cls} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform ${dur}s ease-out ${s}s; }
    .on${n} .sc-${id} .${cls} { transform: none; }`;
  // 돌며 나타나기
  const spinCss = (id) => `@keyframes ${id}-spin { from { opacity: 0; transform: rotate(-180deg) scale(.2); } to { opacity: 1; transform: none; } }
    .sc-${id} .spin { transform-box: fill-box; transform-origin: center; }
    ${[1, 2, 3, 4].map((n) => `.on${n} .sc-${id} .spin${n} { animation: ${id}-spin .7s ease-out both; }`).join('\n')}`;
  // 흔들리기(매달린 것): 축 x, y
  const swingCss = (id, cls, x, y, n, delay = 0.6) => `@keyframes ${id}-swing { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(4deg); } 75% { transform: rotate(-4deg); } }
    .sc-${id} .${cls} { transform-box: view-box; transform-origin: ${x}px ${y}px; }
    .on${n} .sc-${id} .${cls} { animation: ${id}-swing 1.6s ease-in-out ${delay}s 2; }`;
  // 물방울
  const drip = (x, y, s = 1, color = C.blue) => `<path d="M${x} ${f(y - 11 * s)} Q${f(x + 8 * s)} ${y} ${f(x + 8 * s)} ${f(y + 4 * s)} A${f(8 * s)} ${f(8 * s)} 0 0 1 ${f(x - 8 * s)} ${f(y + 4 * s)} Q${f(x - 8 * s)} ${y} ${x} ${f(y - 11 * s)} Z" fill="${color}"/>`;
  // 항아리: 가운데 cx, 위 top, 배 폭 w, 높이 h
  const jar = (cx, top, w, h, fill = C.peach, stroke = C.orange) => {
    const q = (k) => f(cx + k * w), y = (k) => f(top + k * h);
    return P(`M${q(-0.24)} ${y(0)} Q${q(-0.24)} ${y(0.07)} ${q(-0.3)} ${y(0.12)} C${q(-0.62)} ${y(0.3)} ${q(-0.6)} ${y(0.78)} ${q(-0.28)} ${y(1)} H${q(0.28)} C${q(0.6)} ${y(0.78)} ${q(0.62)} ${y(0.3)} ${q(0.3)} ${y(0.12)} Q${q(0.24)} ${y(0.07)} ${q(0.24)} ${y(0)} Z`, fill, stroke, 3.5)
      + `<rect x="${q(-0.28)}" y="${f(top - 8)}" width="${f(w * 0.56)}" height="12" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  };
  // 메주: 네모난 콩 덩이(ties 면 볏짚 두 줄로 묶음)
  const meju = (cx, cy, w = 84, h = 66, ties = true) => `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="10" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/>`
    + `<path d="M${f(cx - w / 2 + 12)} ${f(cy - h / 4)} l8 4 M${f(cx + w / 8)} ${f(cy + h / 8)} l9 -3 M${f(cx - w / 6)} ${f(cy + h / 3)} l7 3" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`
    + (ties ? [-1, 1].map((k) => `<path d="M${f(cx + k * w / 4)} ${f(cy - h / 2 - 2)} V${f(cy + h / 2 + 2)}" stroke="${C.orange}" stroke-width="9" stroke-linecap="round"/><path d="M${f(cx + k * w / 4)} ${f(cy - h / 2 - 2)} V${f(cy + h / 2 + 2)}" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round"/>`).join('') : '');
  // 매단 메주: 장대(y = poleY)에서 볏짚 두 줄로 매단다
  const hung = (cx, cy, poleY, w = 84, h = 66) => P(`M${cx - 70} ${poleY} H${cx + 70}`, 'none', C.orange, 8)
    + [-1, 1].map((k) => P(`M${f(cx + k * w / 4)} ${poleY} V${f(cy - h / 2)}`, 'none', C.yellow, 5)).join('') + meju(cx, cy, w, h);
  // 새(까마귀 따위): 오른쪽을 본다, flip 이면 왼쪽
  const bird = (x, y, { flip = false, s = 1, body = C.ink, wing = C.muted, beak = C.orange, wingCls = 'wg' } = {}) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">`
    + `<path d="M-34 4 L-60 -4 L-58 12 Z" fill="${body}"/><ellipse cx="-6" cy="4" rx="34" ry="22" fill="${body}"/><circle cx="24" cy="-16" r="17" fill="${body}"/>`
    + `<path d="M38 -21 L60 -14 L38 -8 Z" fill="${beak}"/><circle cx="28" cy="-20" r="4.5" fill="white"/><circle cx="29" cy="-20" r="2" fill="${C.ink}"/>`
    + `<path d="M-8 25 V40 M6 25 V40" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`
    + `<g class="${wingCls}"><path d="M-24 -2 Q-4 -32 20 -4 Q0 8 -24 -2 Z" fill="${wing}" stroke="${body}" stroke-width="2"/></g></g>`;
  const flapCss = (id, sel, n, delay = 0.4, times = 3) => `@keyframes ${id}-flap { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-28deg); } }
    .sc-${id} ${sel} { transform-box: fill-box; transform-origin: 15% 80%; }
    .on${n} .sc-${id} ${sel} { animation: ${id}-flap .45s ease-in-out ${delay}s ${times}; }`;
  const bobCss = (id, sel, n, delay = 0.4, times = 3) => `@keyframes ${id}-bob { 0%, 100% { transform: none; } 50% { transform: translateY(-8px); } }
    .on${n} .sc-${id} ${sel} { animation: ${id}-bob .7s ease-in-out ${delay}s ${times}; }`;
  // 칸 n 에서 sel 의 바탕색(fill)을 바꾼다
  const fillCss = (id, sel, color, n, delay = 0) => `.sc-${id} ${sel} { transition: fill .6s ease ${delay}s; } .on${n} .sc-${id} ${sel} { fill: ${color}; }`;

  const K = '3-1/국어/';

  // ── 4단원: 메모(「매미가 내뿜는 액체」를 다 받아 적은 긴 글 → 제목과 번호를 붙인 짧은 글) ──────────────────────────────
  (function () {
    const id = 't31-k3-memo';
    let css = base(id);
    let body = at(1, 'drop', tile(320, 32, '「매미가 내뿜는 액체」', { size: 20, h: 40, fill: TAN, stroke: C.orange }));
    // 스피커와 소리 물결
    body += at(1, 'pop', `<path d="M30 22 H42 L58 8 V56 L42 42 H30 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`);
    body += `<g class="b1">` + [0, 1].map((k) => `<path class="wv" style="animation-delay:${0.3 + k * 0.2}s" d="M${70 + k * 12} ${18 - k * 6} q${12 + k * 4} ${14 + k * 6} 0 ${28 + k * 12}" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('') + '</g>';
    css += `.sc-${id} .wv { opacity: 0; } .on1 .sc-${id} .wv { animation: ${id}-flash 1.4s ease-in-out both; } .on2 .sc-${id} .wv { opacity: 0; animation: none; }`;
    // 왼쪽 종이: 들은 말을 그대로 다 쓴 긴 줄
    const W = [182, 164, 176, 146, 180, 168, 156, 178, 124];
    const by = (i) => 100 + i * 27;
    let left = card(24, 70, 224, 276);
    W.forEach((w, i) => { left += `<g class="br${i}">${bar(44, by(i), w, GRAY, 10)}</g>`; });
    body += `<g class="dim dim4"><g class="lc">${left}</g></g>`;
    css += `.sc-${id} .lc { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .lc { animation: ${id}-shake .6s ease-in-out 1s 2; }`;
    W.forEach((_, i) => { css += growAt(id, `br${i}`, i < 6 ? 1 : 2, i < 6 ? 0.5 + i * 0.22 : 0.1 + (i - 6) * 0.2); });
     body += `<g class="h3">` + at(2, 'pop', `<circle cx="226" cy="92" r="20" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + text(226, 101, '?', { size: 26, color: C.orange }), 1.0) + '</g>';
    // 칸 3: 중요한 줄 셋에 형광펜, 오른쪽 종이에 제목과 번호 붙인 짧은 줄
    const key = [1, 4, 7];
    body += key.map((i, k) => at(3, 'fin', `<rect x="38" y="${by(i) - 11}" width="${W[i] + 12}" height="22" rx="6" fill="${C.yellow}" opacity=".6"/>`, 0.1 + k * 0.1)).join('');
    // 오른쪽 종이: 교과서 181쪽 연주의 메모 세 줄 그대로
    const RX = 444;
    body += at(3, 'fin', card(270, 70, 348, 276), 0.1);
    body += at(3, 'pop', text(RX, 120, '제목: 매미가 내뿜는 액체', { size: 18 }) + `<path d="M${RX - 104} 132 H${RX + 104}" stroke="${C.ink}" stroke-width="2"/>`, 0.3);
    const lines = ['1. 배 밑의 구멍에서 액체를 내뿜음.', '2. 액체를 내뿜으며 몸을 보호함.', '3. 액체는 단맛이 남.'];
    const ly = [182, 236, 290];
    lines.forEach((l, k) => {
      const i = key[k];
      body += `<g class="b3"><g class="fl${k}">${tile(RX, ly[k], l, { size: 18, h: 40, w: 324, fill: 'white', stroke: C.blue })}</g></g>`;
      css += move(id, `fl${k}`, `translate(${f(44 + W[i] / 2 - RX)}px, ${f(by(i) - ly[k])}px) scale(.5)`, 3, { dur: 0.8, delay: 0.5 + k * 0.3 })
        + `.sc-${id} .fl${k} { opacity: 0; } .on3 .sc-${id} .fl${k} { opacity: 1; }`;
    });
    // 칸 4
    body += glowRect(266, 66, 356, 284, 4, C.green, 0.1, 16) + at(4, 'pop', tag(RX, 70, '메모', ROLE.y, 22), 0.5);
    put(K + '4/메모', svg(id, body, css));
  })();

  // ── 4단원: 기호(교과서 181쪽 연주의 메모처럼 중요한 둘째 줄에 밑줄을 긋고 줄 끝에 별표 — 긴 말 대신 짧은 표시) ──────────────────────────────
  (function () {
    const id = 't31-k3-giho';
    let css = base(id) + spinCss(id);
    const L = ['1. 배 밑의 구멍에서 액체를 내뿜음.', '2. 액체를 내뿜으며 몸을 보호함.', '3. 액체는 단맛이 남.'];
    const LY = [166, 221, 276], LX = 40;
    const w2 = tw(L[1], 18), SX = f(LX + w2 + 26);
    let body = at(1, 'slide', card(20, 56, 368, 250) + text(204, 102, '매미가 내뿜는 액체', { size: 22 }) + `<path d="M108 114 H300" stroke="${C.ink}" stroke-width="2.5"/>`
      + L.map((l, k) => text(LX, LY[k], l, { size: 18, anchor: 'start', weight: 600 })).join(''), 0.2);
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M${LX} ${LY[1] + 9} H${f(LX + w2)}" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round" style="transition-delay:.1s"/></g>`;
    body += `<g class="b2"><g class="st1">${g('spin spin2', star(SX, LY[1] - 7, 15), 0.8)}</g></g>`;
    body += ring(SX, LY[1] - 7, 21, C.orange, 2, 1.4);
    // 칸 3: '중요한 내용'이라는 말 → 별표 하나
    body += at(3, 'pop', tile(510, 96, '중요한 내용', { size: 22, h: 48, fill: 'white', stroke: C.orange }), 0.2);
    body += drawArrow(510, 128, 510, 178, C.orange, 3, { delay: 0.6 });
    body += `<g class="b3"><g class="st2">${g('spin spin3', star(510, 238, 48), 1.3)}</g></g>`;
    css += pulseCss(id, '.st2', 4, 0.3) + pulseCss(id, '.st1', 4, 0.3);
    body += ring(510, 238, 56, C.orange, 4, 0.2) + ring(SX, LY[1] - 7, 21, C.orange, 4, 0.2);
    body += at(4, 'pop', tag(510, 326, '기호', ROLE.y, 22), 0.6);
    put(K + '4/기호', svg(id, body, css));
  })();

  // ── 4단원: 천적(새가 매미를 잡아먹으려 함 → 매미는 액체를 찍 내뿜으며 날아올라 달아남. 새가 매미를 잡아먹는 것은 일반 사실 — 듣기 글은 교과서에 실리지 않았다) ──────────────────────────────
  const cicada = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">`
    + `<ellipse cx="-9" cy="8" rx="9" ry="27" transform="rotate(12 -9 8)" fill="white" fill-opacity=".75" stroke="${C.muted}" stroke-width="2"/>`
    + `<ellipse cx="9" cy="8" rx="9" ry="27" transform="rotate(-12 9 8)" fill="white" fill-opacity=".75" stroke="${C.muted}" stroke-width="2"/>`
    + `<ellipse cx="0" cy="2" rx="9" ry="22" fill="${C.green}"/><ellipse cx="0" cy="-20" rx="12" ry="7" fill="${C.green}"/>`
    + `<circle cx="-10" cy="-21" r="3.5" fill="${C.ink}"/><circle cx="10" cy="-21" r="3.5" fill="${C.ink}"/></g>`;
  (function () {
    const id = 't31-k3-cheonjeok';
    let css = base(id);
    const tree = `<rect x="424" y="70" width="78" height="300" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + P('M444 120 q6 30 0 60 M484 200 q-6 30 0 60 M450 280 q6 24 0 48', 'none', C.orange, 2.5)
      + `<circle cx="420" cy="36" r="56" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="500" cy="22" r="60" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="572" cy="48" r="50" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    let body = at(1, 'fin', tree) + at(1, 'pop', `<g class="fly"><g class="cc">${cicada(463, 214, 1.15)}</g></g>`, 0.4);
    css += pulseCss(id, '.cc', 1, 0.9);
    // 칸 2: 새가 날아온다
    body += `<g class="b2"><g class="bd"><g class="bb">${bird(190, 160, { s: 1.1, body: C.blue, wing: C.sky })}</g></g></g>`;
    css += move(id, 'bd', 'translate(-260px, -60px)', 2, { dur: 1, delay: 0.2 }) + flapCss(id, '.wg', 2, 0.2, 2) + bobCss(id, '.bb', 2, 1.2, 2);
    // 칸 3: 매미가 날아올라 오른쪽 위로 달아난다
    css += `.sc-${id} .fly { transition: transform 1s ease-in-out .9s; } .on3 .sc-${id} .fly { transform: translate(140px, -70px) rotate(18deg); }`;
    body += `<g class="dim dim3">${drawArrow(262, 178, 426, 206, C.red, 2, { delay: 1.2 })}</g>`;
    // 칸 3: 매미가 액체를 내뿜는다
    body += `<g class="b3">` + [0, 1, 2, 3].map((k) => `<g class="dp" style="animation-delay:${0.2 + k * 0.15}s">${drip(440, 206 + k * 6, 0.9)}</g>`).join('') + '</g>';
    css += `.sc-${id} .dp { opacity: 0; }
      @keyframes ${id}-spray { 0% { opacity: 0; transform: none; } 20% { opacity: 1; } 100% { opacity: 0; transform: translate(-150px, -10px); } }
      .on3 .sc-${id} .dp { animation: ${id}-spray .9s ease-out both 2; }`;
    body += at(3, 'fin', drip(404, 212, 0.8) + drip(368, 222, 0.7) + drip(330, 208, 0.75) + drip(296, 218, 0.6), 1.0) + at(3, 'pop', tag(352, 262, '액체', ROLE.s, 20), 0.5);
    // 칸 4: 새 → 매미 (잡아먹음)
    body += at(4, 'pop', tag(96, 322, '새', ROLE.s, 22), 0.1) + drawArrow(130, 322, 290, 322, C.red, 4, { delay: 0.3 })
      + at(4, 'fin', text(210, 308, '잡아먹음', { size: 18, color: C.red }), 0.6) + at(4, 'pop', tag(338, 322, '매미', ROLE.p, 22), 0.9);
    body += at(4, 'pop', tag(186, 52, '천적', ROLE.y, 22), 1.2) + ring(186, 154, 70, C.orange, 4, 1.2);
    put(K + '4/천적', svg(id, body, css));
  })();

  // ── 4단원: 메주(콩 → 찧은 반죽 → 네모나게 빚어 말리기 → 볏짚으로 매달아 띄우기 → 된장·간장) ──────────────────────────────
  (function () {
    const id = 't31-k3-meju';
    let css = base(id);
    const Y = 160;
    const beans = [[-24, -8], [0, -16], [24, -8], [-14, 10], [12, 10], [0, 28], [-30, 20], [30, 20]]
      .map(([dx, dy]) => `<ellipse cx="${72 + dx}" cy="${Y + dy}" rx="12" ry="9" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`).join('');
    let body = at(1, 'pop', beans, 0.1) + at(1, 'pop', tag(72, 296, '콩', ROLE.s, 20), 0.2);
    body += drawArrow(110, Y, 156, Y, C.muted, 1, { delay: 0.5 });
    // 칸 1: 찧은 반죽(울퉁불퉁) / 칸 2: 네모나게 빚어 말리기
    body += `<g class="h2">` + at(1, 'pop', P(`M168 ${Y + 12} Q162 ${Y - 22} 190 ${Y - 26} Q216 ${Y - 34} 236 ${Y - 18} Q252 ${Y} 240 ${Y + 22} Q214 ${Y + 36} 190 ${Y + 30} Q170 ${Y + 26} 168 ${Y + 12} Z`, C.peach, C.orange, 3.5), 1.0)
      + at(1, 'pop', tag(206, 296, '찧은 반죽', ROLE.s, 18), 1.2) + '</g>';
    body += at(2, 'pop', meju(206, Y, 84, 66, false), 0.2) + at(2, 'pop', tag(206, 296, '빚어 말리기', ROLE.s, 18), 0.4);
    const sun = `<circle cx="206" cy="66" r="16" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(206 + c * 22)} ${f(66 + s * 22)} L${f(206 + c * 30)} ${f(66 + s * 30)}" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`; }).join('');
    body += `<g class="b2 h3"><g class="sn">${g('pop pop2', sun, 0.7)}</g></g>` + at(2, 'pop', tag(206, 246, '20여 일', ROLE.o, 18), 1.0);
    css += `.sc-${id} .sn { transform-box: fill-box; transform-origin: center; } @keyframes ${id}-rot { to { transform: rotate(90deg); } } .on2 .sc-${id} .sn { animation: ${id}-rot 2s linear .9s 1 both; }`;
    // 칸 3: 볏짚으로 묶어 매달아 띄우기
    body += drawArrow(256, Y, 294, Y, C.muted, 3, { delay: 0.1 });
    body += `<g class="b3"><g class="hg">${g('drop drop3', hung(348, Y, 64), 0.3)}</g></g>`;
    css += swingCss(id, 'hg', 348, 64, 3, 0.9);
    body += `<g class="b3 h4">` + [128, 160, 192].map((y, k) => `<path class="wd" style="animation-delay:${0.8 + k * 0.2}s" d="M412 ${y} q14 -8 28 0 t28 0" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') + '</g>';
    css += `.sc-${id} .wd { opacity: 0; } @keyframes ${id}-wind { 0% { opacity: 0; transform: translateX(-16px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateX(20px); } }
      .on3 .sc-${id} .wd { animation: ${id}-wind 1.2s ease-in-out 2; }`;
    body += at(3, 'pop', tag(348, 246, '서너 달', ROLE.o, 18), 1.1) + at(3, 'pop', tag(348, 296, '매달아 띄우기', ROLE.s, 18), 0.5);
    // 칸 4: 메주 → 된장·간장
    body += drawArrow(398, Y, 466, Y, C.green, 4, { delay: 0.3 });
    body += at(4, 'pop', jar(522, 118, 64, 90) + jar(598, 118, 64, 90), 0.8)
      + at(4, 'pop', tag(522, 296, '된장', ROLE.p, 18), 1.1) + at(4, 'pop', tag(598, 296, '간장', ROLE.p, 18), 1.2);
    body += glowRect(300, 120, 96, 80, 4, C.orange, 0.1, 14) + at(4, 'pop', tag(348, 338, '메주', ROLE.y, 20), 0.5);
    put(K + '4/메주', svg(id, body, css));
  })();

  // ── 4단원: 볏짚(다 익은 벼 → 낟알을 털어 냄 → 남은 줄기를 묶음) ──────────────────────────────
  (function () {
    const id = 't31-k3-byeotjip';
    let css = base(id);
    const XS = [130, 200, 270];
    const qpt = (x, t) => { const p0 = [x + 16, 120], c = [x + 36, 94], p1 = [x + 60, 130]; const u = 1 - t; return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]; };
    const stalk = (x) => P(`M${x} 318 Q${x + 4} 210 ${x + 16} 120 Q${x + 36} 94 ${x + 60} 130`, 'none', C.orange, 7) + P(`M${x} 318 Q${x + 4} 210 ${x + 16} 120 Q${x + 36} 94 ${x + 60} 130`, 'none', C.yellow, 4)
      + P(`M${x + 2} 262 Q${x - 26} 236 ${x - 42} 204`, 'none', C.green, 4) + P(`M${x + 5} 222 Q${x + 30} 196 ${x + 46} 172`, 'none', C.green, 4);
    const grains = (x) => [0.12, 0.26, 0.4, 0.54, 0.68, 0.82, 0.96].map((t) => { const [gx, gy] = qpt(x, t); return `<ellipse cx="${f(gx)}" cy="${f(gy + 7)}" rx="5" ry="7.5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`; }).join('');
    let body = at(1, 'fin', P('M40 318 H600', 'none', C.orange, 3) + `<rect x="40" y="320" width="560" height="26" fill="${C.peach}" opacity=".6"/>`);
    body += at(2, 'pop', P('M440 262 H560 Q556 312 500 314 Q444 312 440 262 Z', TAN, C.orange, 3.5), 0.1);
    XS.forEach((x, i) => {
      body += `<g class="b1"><g class="st st${i}">${g('rise rise1', stalk(x), 0.2 + i * 0.25)}</g></g>`;
      body += `<g class="b1"><g class="gr gr${i}">${g('rise rise1', grains(x), 0.2 + i * 0.25)}</g></g>`;
    });
    // 칸 2: 낟알을 털어 바구니로
    body += at(2, 'pop', tag(500, 232, '낟알', ROLE.o, 20), 1.6);
    XS.forEach((x, i) => {
      css += `.sc-${id} .gr${i} { transform-box: fill-box; transform-origin: center; transition: transform .9s ease-in ${0.4 + i * 0.3}s; }
        .on2 .sc-${id} .gr${i} { transform: translate(${f(476 + i * 24 - (x + 38))}px, ${f(266 - 119)}px) scale(.8); }`;
    });
    // 칸 3: 남은 줄기를 한데 모아 묶는다
    [60, 0, -60].forEach((dx, i) => { css += move(id, `st${i}`, 'none', 3, { dur: 0.9, delay: 0.3, to: `translate(${dx}px, 0)` }); });
    body += at(3, 'pop', `<rect x="178" y="238" width="72" height="16" rx="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`, 1.3);
    // 칸 4
    body += glowRect(152, 84, 130, 240, 4, C.orange, 0.1, 16) + at(4, 'pop', tag(340, 196, '볏짚', ROLE.y, 22), 0.5);
    put(K + '4/볏짚', svg(id, body, css));
  })();

  // ── 4단원: 띄우다(바람 통하는 곳에 매단 메주에 작은 생물이 옮겨 와 퍼진다) ──────────────────────────────
  (function () {
    const id = 't31-k3-ttiuda';
    let css = base(id);
    const MX = 230, MY = 178, MW = 124, MH = 96;
    const sun = `<circle cx="64" cy="64" r="20" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(64 + c * 27)} ${f(64 + s * 27)} L${f(64 + c * 35)} ${f(64 + s * 35)}" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`; }).join('');
    let body = at(1, 'pop', sun, 0.1);
    body += `<g class="b1"><g class="hg">${g('drop drop1', hung(MX, MY, 58, MW, MH), 0.2)}<g class="ov"><rect x="${MX - MW / 2}" y="${MY - MH / 2}" width="${MW}" height="${MH}" rx="10" fill="${C.orange}"/></g></g></g>`;
    css += swingCss(id, 'hg', MX, 58, 1, 0.8);
    body += `<g class="b1">` + [150, 186, 222].map((y, k) => `<path class="wd" style="animation-delay:${0.6 + k * 0.25}s" d="M44 ${y} q16 -9 32 0 t32 0" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') + '</g>';
    css += `.sc-${id} .wd { opacity: 0; } @keyframes ${id}-wind { 0% { opacity: 0; transform: translateX(-18px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateX(22px); } }
      .on1 .sc-${id} .wd { animation: ${id}-wind 1.3s ease-in-out 2; }`;
    // 칸 2: 볏짚과 공기 속 작은 생물이 메주로 옮겨 간다
    const from = [[200, 84], [260, 96], [118, 124], [334, 122], [126, 262], [336, 252]];
    const to = [[204, 154], [252, 146], [192, 202], [264, 196], [214, 214], [240, 174]];
    from.forEach(([x, y], i) => {
      body += `<g class="b2"><g class="mb${i}">${g('pop pop2', `<circle cx="${to[i][0]}" cy="${to[i][1]}" r="6" fill="${C.purple}"/>`, 0.1 + i * 0.08)}</g></g>`;
      css += move(id, `mb${i}`, `translate(${x - to[i][0]}px, ${y - to[i][1]}px)`, 2, { dur: 1, delay: 0.7 + i * 0.1 });
    });
    body += at(2, 'pop', tag(488, 112, '작은 생물', ROLE.x, 20), 1.0) + drawArrow(430, 124, 278, 188, C.purple, 2, { width: 3.5, delay: 1.3 });
    // 칸 3: 서너 달이 지나며 메주 가득 퍼진다
    const more = [[186, 150], [222, 140], [270, 156], [178, 176], [206, 182], [282, 178], [184, 216], [236, 200], [266, 216], [226, 160], [252, 222], [196, 196]];
    body += `<g class="b3">` + more.map(([x, y], i) => g('pop pop3', `<circle cx="${x}" cy="${y}" r="5" fill="${C.purple}"/>`, 0.2 + i * 0.1)).join('') + '</g>';
    css += `.sc-${id} .ov { opacity: 0; transition: opacity 2s ease .3s; } .on3 .sc-${id} .ov { opacity: .25; }`;
    const cal = (x) => `<rect x="${x - 20}" y="262" width="40" height="38" rx="5" fill="white" stroke="${C.blue}" stroke-width="3"/><rect x="${x - 20}" y="262" width="40" height="11" rx="4" fill="${C.blue}"/>`;
    body += [436, 488, 540].map((x, k) => at(3, 'pop', cal(x), 0.4 + k * 0.35)).join('') + at(3, 'pop', tag(488, 228, '서너 달', ROLE.o, 20), 1.5);
    // 칸 4
    body += glowRect(MX - MW / 2 - 10, MY - MH / 2 - 10, MW + 20, MH + 20, 4, C.orange, 0.1, 16) + at(4, 'pop', tag(488, 336, '띄우다', ROLE.y, 22), 0.5);
    put(K + '4/띄우다', svg(id, body, css));
  })();

  // ── 4단원: 발효(항아리 속 메주에서 작은 생물이 일해 고유한 맛과 향의 된장이 된다) ──────────────────────────────
  const germ = (x, y, kind, rot = 0) => kind === 'r'
    ? `<rect x="${x - 17}" y="${y - 7}" width="34" height="14" rx="7" transform="rotate(${rot} ${x} ${y})" fill="${C.green}" opacity=".85"/>`
    : `<circle cx="${x}" cy="${y}" r="9" fill="${C.purple}" opacity=".85"/>`;
  (function () {
    const id = 't31-k3-balhyo';
    let css = base(id);
    let body = at(1, 'pop', jar(180, 80, 196, 212) + `<rect x="118" y="150" width="124" height="118" rx="22" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`, 0.1);
    // 칸 1: 메주와 소금물을 함께 넣어 삭힌다 → 칸 3: 메주를 건져 내면 소금물이 빠진다(187쪽)
    body += `<g class="sw">` + at(1, 'fin', `<rect x="122" y="198" width="116" height="66" rx="18" fill="${C.sky}"/>`, 1.3) + '</g>';
    css += `.sc-${id} .sw { transition: opacity .8s ease .2s; } .on3 .sc-${id} .sw { opacity: 0; }`;
    body += `<g class="h2">` + at(1, 'pop', tag(336, 246, '소금물', ROLE.s, 20), 1.6) + '</g>';
    body += `<g class="ld">` + at(1, 'fin', P('M128 73 Q180 34 232 73 Z', C.orange, C.orange, 3), 0.1) + '</g>';
    css += `.sc-${id} .ld { transform-box: fill-box; transform-origin: center; transition: transform 1s ease-in-out .2s; } .on3 .sc-${id} .ld { transform: translate(176px, 60px) rotate(20deg); }`;
    body += `<g class="b1"><g class="mj">${meju(180, 226, 82, 58, false)}</g></g>`;
    css += move(id, 'mj', 'translate(0, -190px)', 1, { dur: 0.9, delay: 0.5 }) + `.sc-${id} .mj { opacity: 0; } .on1 .sc-${id} .mj { opacity: 1; }`;
    // 칸 3에 된장 빛으로 바뀐다
    body += `<g class="dj">${P('M140 250 Q138 206 168 200 Q198 192 218 208 Q232 226 222 252 Q200 262 170 260 Q146 258 140 250 Z', C.orange, C.orange, 3)}<circle cx="168" cy="226" r="4" fill="${C.peach}"/><circle cx="196" cy="238" r="4" fill="${C.peach}"/><circle cx="204" cy="216" r="3" fill="${C.peach}"/></g>`;
    css += `.sc-${id} .dj { opacity: 0; transition: opacity 1.6s ease .5s; } .on3 .sc-${id} .dj { opacity: 1; }
      .on3 .sc-${id} .mj { opacity: 0; transition: transform .9s ease-in-out .5s, opacity 1.6s ease .5s; }`;
    body += `<g class="h3">` + at(1, 'pop', tag(180, 326, '메주', ROLE.o, 20), 1.2) + '</g>' + at(3, 'pop', tag(180, 326, '된장', ROLE.o, 20), 1.6);
    // 칸 2: 돋보기 속 작은 생물
    const ZX = 456, ZY = 168, ZR = 100;
    const bugs = [[420, 126, 'r', 20], [486, 116, 'c'], [452, 160, 'r', -30], [512, 170, 'r', 60], [404, 190, 'c'], [470, 214, 'c'], [430, 236, 'r', -10], [506, 230, 'c']];
    let zoom = P(`M242 196 L${ZX - ZR + 6} ${ZY - 34} M242 250 L${ZX - ZR + 10} ${ZY + 46}`, 'none', C.purple, 2.5, ' stroke-dasharray="6 6"')
      + `<circle cx="${ZX}" cy="${ZY}" r="${ZR}" fill="${C.peach}" stroke="${C.purple}" stroke-width="4"/>`;
    zoom += bugs.map(([x, y, k, r], i) => `<g class="bg${i % 3}">${g('pop pop2', germ(x, y, k, r || 0), 0.4 + i * 0.12)}</g>`).join('');
    body += `<g class="b2 h3">${zoom}${at(2, 'pop', tag(ZX, 300, '작은 생물', ROLE.x, 20), 1.4)}</g>`;
    css += `.sc-${id} .bg0, .sc-${id} .bg1, .sc-${id} .bg2 { transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-wig { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(14deg) translateX(3px); } }
      .on2 .sc-${id} .bg0 { animation: ${id}-wig .8s ease-in-out 1.4s 3; } .on2 .sc-${id} .bg1 { animation: ${id}-wig .9s ease-in-out 1.5s 3; } .on2 .sc-${id} .bg2 { animation: ${id}-wig .7s ease-in-out 1.6s 3; }`;
    body += `<g class="b2 h3">` + [[150, 0], [184, 0.4], [214, 0.2]].map(([x, d]) => `<g class="bu" style="animation-delay:${d}s"><circle cx="${x}" cy="258" r="5" fill="white" stroke="${C.blue}" stroke-width="2"/></g>`).join('') + '</g>';
    css += `.sc-${id} .bu { opacity: 0; } @keyframes ${id}-bu { 0% { opacity: 0; transform: none; } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-90px); } }
      .on2 .sc-${id} .bu { animation: ${id}-bu 1.6s ease-in 3; }`;
    // 칸 3: 뚜껑을 열어 햇볕과 바람, 맛과 향
    const sun = `<circle cx="556" cy="76" r="24" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(556 + c * 32)} ${f(76 + s * 32)} L${f(556 + c * 42)} ${f(76 + s * 42)}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }).join('');
    body += at(3, 'pop', sun, 0.3);
    body += `<g class="b3">` + [150, 180, 210].map((x, k) => `<path class="ar" style="animation-delay:${0.9 + k * 0.2}s" d="M${x} 60 q-10 -12 0 -24 q10 -12 0 -24" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('') + '</g>';
    css += `.sc-${id} .ar { opacity: 0; } @keyframes ${id}-ar { 0% { opacity: 0; transform: translateY(10px); } 50% { opacity: 1; } 100% { opacity: .9; transform: translateY(-6px); } }
      .on3 .sc-${id} .ar { animation: ${id}-ar 1.2s ease-out both; }`;
    body += at(3, 'pop', tag(264, 26, '맛과 향', ROLE.o, 20), 1.5);
    // 칸 4
    body += glowRect(70, 56, 222, 248, 4, C.green, 0.1, 18) + at(4, 'pop', tag(470, 214, '발효', ROLE.y, 26), 0.5);
    css += pulseCss(id, '.dj', 4, 0.8);
    put(K + '4/발효', svg(id, body, css));
  })();

  // ── 4단원: 미생물(눈으로는 안 보이는 볏짚 위 작은 생물 — 크게 키워 보면 움직이고 늘어난다) ──────────────────────────────
  (function () {
    const id = 't31-k3-misaengmul';
    let css = base(id);
    const straws = [-28, -18, -8, 2, 12, 22, 30].map((dx, i) => P(`M${150 + dx * 0.6} 318 L${150 + dx * 1.4} ${152 + (i % 2) * 8}`, 'none', C.yellow, 6)).join('');
    let body = at(1, 'rise', straws + `<rect x="126" y="232" width="48" height="14" rx="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`, 0.1);
    const eye = `<path d="M-30 0 Q0 -25 30 0 Q0 25 -30 0 Z" fill="white" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/><circle r="10" fill="${C.blue}"/><circle cx="-3" cy="-3" r="3" fill="white"/>`;
    body += at(1, 'pop', `<g class="ey">${at0(150, 62, eye)}</g>`, 0.4) + `<g class="b1">` + P('M150 92 V138', 'none', C.blue, 3, ' stroke-dasharray="5 6"') + '</g>';
    css += `.sc-${id} .ey { transform-box: fill-box; transform-origin: center; } @keyframes ${id}-blink { 0%, 100% { transform: none; } 50% { transform: scaleY(.1); } }
      .on1 .sc-${id} .ey { animation: ${id}-blink .35s ease-in-out 1.1s 2; }`;
    // 칸 2: 아주 크게 키워 본 볏짚 겉
    const ZX = 452, ZY = 180, ZR = 124;
    let zoom = `<circle cx="160" cy="200" r="16" fill="none" stroke="${C.purple}" stroke-width="3"/>`
      + P(`M174 192 L${ZX - ZR + 12} ${ZY - 52} M174 210 L${ZX - ZR + 14} ${ZY + 56}`, 'none', C.purple, 2.5, ' stroke-dasharray="6 6"')
      + `<clipPath id="${id}-c"><circle cx="${ZX}" cy="${ZY}" r="${ZR}"/></clipPath><circle cx="${ZX}" cy="${ZY}" r="${ZR}" fill="white"/>`
      + `<g clip-path="url(#${id}-c)"><rect x="${ZX - ZR}" y="${ZY - ZR}" width="${2 * ZR}" height="${2 * ZR}" fill="${C.yellow}" opacity=".4"/>${[-90, -40, 10, 60, 110].map((d) => `<path d="M${ZX - 140} ${ZY + d + 60} L${ZX + 140} ${ZY + d - 70}" stroke="${C.orange}" stroke-width="3" opacity=".35"/>`).join('')}</g>`
      + `<circle cx="${ZX}" cy="${ZY}" r="${ZR}" fill="none" stroke="${C.purple}" stroke-width="4"/>`;
    body += at(2, 'fin', zoom, 0.1);
    const bugs = [[400, 130, 'r', 25], [460, 104, 'c'], [520, 140, 'r', -20], [396, 214, 'c'], [452, 196, 'r', 70], [500, 252, 'r', 10], [432, 262, 'c'], [538, 196, 'c']];
    body += `<g class="b2">` + bugs.map(([x, y, k, r], i) => `<g class="wg${i % 3}">${g('pop pop2', germ(x, y, k, r || 0), 0.6 + i * 0.12)}</g>`).join('') + '</g>';
    // 칸 3: 꿈틀거리고, 하나가 둘로 나뉜다
    css += `.sc-${id} .wg0, .sc-${id} .wg1, .sc-${id} .wg2 { transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-wig { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(16deg) translateX(4px); } }
      .on3 .sc-${id} .wg0 { animation: ${id}-wig .8s ease-in-out .2s 3; } .on3 .sc-${id} .wg1 { animation: ${id}-wig .9s ease-in-out .3s 3; } .on3 .sc-${id} .wg2 { animation: ${id}-wig .7s ease-in-out .4s 3; }`;
    body += `<g class="b3"><g class="dv">${germ(460, 104, 'c')}</g></g>` + ring(474, 108, 22, C.purple, 3, 1.4);
    css += `.sc-${id} .dv { transform: none; transition: transform .9s ease-out .6s; } .on3 .sc-${id} .dv { transform: translate(26px, 8px); }`;
    // 칸 4
    body += ring(ZX, ZY, ZR, C.purple, 4, 0.1) + at(4, 'pop', tag(ZX, 334, '미생물', ROLE.y, 22), 0.5);
    put(K + '4/미생물', svg(id, body, css));
  })();

  // ── 4단원: 숯(나무를 뜨거운 불로 구워 까만 덩어리 → 항아리 속 나쁜 균과 냄새를 없앤다) ──────────────────────────────
  (function () {
    const id = 't31-k3-sut';
    let css = base(id);
    const log = (fill, stroke, end) => `<rect x="66" y="130" width="168" height="62" rx="30" fill="${fill}" stroke="${stroke}" stroke-width="3.5"/><ellipse cx="226" cy="161" rx="16" ry="31" fill="${end}" stroke="${stroke}" stroke-width="3"/>`;
    let body = `<g class="b1"><g class="lg">${g('pop pop1', log(C.peach, C.orange, TAN) + `<ellipse cx="226" cy="161" rx="8" ry="17" fill="none" stroke="${C.orange}" stroke-width="2"/>`, 0.1)}`
      + `<g class="ch">${log(C.ink, C.ink, C.muted)}${P('M100 150 l18 10 l-6 14 M150 142 l-10 16 l14 12 M190 150 l10 14', 'none', C.muted, 2.5)}</g></g></g>`;
    css += `.sc-${id} .lg { transform-box: fill-box; transform-origin: center; transition: transform 1.4s ease .4s; } .on2 .sc-${id} .lg { transform: scale(.88); }
      .sc-${id} .ch { opacity: 0; transition: opacity 1.4s ease .4s; } .on2 .sc-${id} .ch { opacity: 1; }`;
    const flame = (x, s) => `<g class="fm" style="animation-delay:${s}s">${P(`M${x} 196 Q${x - 26} 232 ${x - 18} 252 Q${x} 266 ${x + 18} 252 Q${x + 26} 232 ${x} 196 Z`, C.orange, C.red, 2.5)}${P(`M${x} 222 Q${x - 11} 240 ${x - 7} 250 Q${x} 256 ${x + 7} 250 Q${x + 11} 240 ${x} 222 Z`, C.yellow, 'none', 0)}</g>`;
    body += `<g class="b1 h2">` + [110, 150, 190].map((x, k) => flame(x, k * 0.15)).join('') + '</g>';
    css += `.sc-${id} .fm { transform-box: fill-box; transform-origin: center bottom; } @keyframes ${id}-flick { 0%, 100% { transform: scale(1); } 30% { transform: scale(1.12, .9); } 60% { transform: scale(.9, 1.15); } }
      .on1 .sc-${id} .fm { animation: ${id}-flick .7s ease-in-out .4s 3; }`;
    body += `<g class="h2">` + at(1, 'pop', tag(150, 92, '나무', ROLE.p, 20), 0.6) + '</g>' + at(2, 'pop', tag(150, 92, '숯', ROLE.s, 22), 1.2);
    // 칸 3: 항아리에 숯과 붉은 고추 → 나쁜 균과 냄새가 없어진다
    body += at(3, 'pop', jar(440, 120, 156, 176) + `<rect x="394" y="178" width="92" height="96" rx="18" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`, 0.1);
    body += `<g class="b3"><g class="gm">` + [[410, 200], [452, 196], [430, 228], [470, 234], [412, 256]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${C.red}"/>`).join('')
      + [410, 440, 470].map((x) => P(`M${x} 102 q-9 -10 0 -20 q9 -10 0 -20`, 'none', C.muted, 3)).join('') + '</g></g>';
    css += `.sc-${id} .gm { transition: opacity .8s ease 1.4s; } .on3 .sc-${id} .gm { opacity: 0; }`;
    body += `<g class="b3"><g class="pc">${`<rect x="408" y="236" width="36" height="24" rx="8" fill="${C.ink}"/>` + P('M456 218 Q482 226 476 258 Q470 262 466 256 Q470 232 452 226 Z', C.red, C.red, 2) + P('M456 218 l-6 -8', 'none', C.green, 3)}</g></g>`;
    css += move(id, 'pc', 'translate(0, -180px)', 3, { dur: 0.8, delay: 0.5 }) + `.sc-${id} .pc { opacity: 0; } .on3 .sc-${id} .pc { opacity: 1; }`;
    body += at(3, 'pop', tag(568, 196, '나쁜 균', ROLE.r, 18), 0.2) + at(3, 'pop', tag(568, 252, '냄새', ROLE.g, 18), 0.3)
      + `<g class="b3"><path class="draw draw3" pathLength="1" d="M532 196 H604" stroke="${C.red}" stroke-width="4" stroke-linecap="round" style="transition-delay:1.6s"/><path class="draw draw3" pathLength="1" d="M538 252 H598" stroke="${C.red}" stroke-width="4" stroke-linecap="round" style="transition-delay:1.8s"/></g>`;
    // 칸 4
    body += glowRect(52, 112, 200, 102, 4, C.orange, 0.1, 18); css += paint(id, '.sut', ROLE.y, 4, 0.3);
    body = body.replace(tag(150, 92, '숯', ROLE.s, 22), `<g class="sut">${tag(150, 92, '숯', ROLE.s, 22)}</g>`);
    css += pulseCss(id, '.sut .tl', 4, 0.5);
    put(K + '4/숯', svg(id, body, css));
  })();

  // ── 4단원: 이랑(밭에 흙을 길쭉하고 두두룩하게 쌓은 줄 — 감자꽃, 할머니·아빠·엄마가 한 줄씩) ──────────────────────────────
  (function () {
    const id = 't31-k3-irang';
    let css = base(id);
    const DX = 130, DY = -150, FY = 316;
    let body = at(1, 'fin', `<path d="M36 ${FY + 4} H488 L618 ${FY + 4 + DY} H166 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`);
    const RX = [80, 200, 320];
    RX.forEach((x, i) => {
      const ridge = `<path d="M${x} ${FY} Q${x + 45} ${FY - 48} ${x + 90} ${FY} L${x + 90 + DX} ${FY + DY} Q${x + 45 + DX} ${FY - 48 + DY} ${x + DX} ${FY + DY} Z" fill="${C.orange}" fill-opacity=".45" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`
        + `<path d="M${x} ${FY} Q${x + 45} ${FY - 48} ${x + 90} ${FY} Z" fill="${C.orange}" fill-opacity=".85"/>`
        + `<path d="M${x + 45} ${FY - 24} L${x + 45 + DX} ${FY - 24 + DY}" stroke="${C.orange}" stroke-width="3"/>`;
      body += at(1, 'rise', ridge, 0.3 + i * 0.3);
    });
    const crest = (x, t) => [f(x + 45 + DX * t), f(FY - 24 + DY * t)];
    // 칸 2: 이랑마다 감자꽃
    RX.forEach((x, i) => [0.38, 0.62, 0.86].forEach((t, k) => {
      const [cx, cy] = crest(x, t), purple = i === 1 && k === 1;
      body += at(2, 'pop', `<path d="M${cx} ${cy} l-9 6 M${cx} ${cy} l9 6" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${f(cy - 9)}" r="8.5" fill="${purple ? C.purple : 'white'}" stroke="${purple ? C.purple : C.line}" stroke-width="2"/><circle cx="${cx}" cy="${f(cy - 9)}" r="3" fill="${C.yellow}"/>`, 0.2 + i * 0.25 + k * 0.08);
    }));
    body += ring(crest(200, 0.62)[0], crest(200, 0.62)[1] - 9, 14, C.purple, 2, 1.4);
    // 칸 3: 할머니는 맨 앞 이랑, 아빠는 다음, 엄마는 그다음
    const who = [['할머니', C.purple], ['아빠', C.blue], ['엄마', C.green]];
    RX.forEach((x, i) => {
      const [cx, cy] = crest(x, 0.12);
      body += at(3, 'rise', person(cx, cy + 6, who[i][1], 11), 0.2 + i * 0.4) + at(3, 'pop', tag(x + 45, 342, who[i][0], ROLE.g, 18), 0.3 + i * 0.4);
    });
    // 칸 4: 등줄기가 다시 그어지고 '이랑'
    RX.forEach((x, i) => { body += `<g class="b4"><path class="draw draw4" pathLength="1" d="M${x + 45} ${FY - 24} L${x + 45 + DX} ${FY - 24 + DY}" stroke="${C.green}" stroke-width="7" stroke-linecap="round" style="transition-delay:${0.1 + i * 0.2}s"/></g>`; });
    body += at(4, 'pop', tag(578, 262, '이랑', ROLE.y, 22), 0.8) + drawArrow(540, 258, 470, 196, C.green, 4, { width: 4, delay: 1.0 });
    put(K + '4/이랑', svg(id, body, css));
  })();

  // ── 4단원: 아름드리(둘레가 한 아름이 넘는 굵은 나무 — 위에서 본 모습, 두 팔을 다 벌려도 손끝이 서로 닿지 않는다) ──────────────────────────────
  (function () {
    const id = 't31-k3-areumdeuri';
    let css = base(id);
    const tree = `<circle cx="112" cy="74" r="56" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="178" cy="52" r="62" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="242" cy="80" r="52" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
      + `<rect x="124" y="108" width="104" height="224" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/>` + P('M150 140 q8 34 0 68 M200 180 q-8 34 0 68 M164 260 q6 26 0 52', 'none', C.orange, 2.5);
    let body = at(1, 'fin', P('M30 332 H320', 'none', C.orange, 3)) + at(1, 'rise', tree, 0.1) + at(1, 'pop', person(282, 304, C.green, 13), 0.7);
    // 칸 2: 위에서 본 나무 둘레와 팔
    const O = [462, 184], R = 92;
    const pt = (deg) => [f(O[0] + R * Math.cos(deg * Math.PI / 180)), f(O[1] + R * Math.sin(deg * Math.PI / 180))];
    body += at(2, 'pop', `<circle cx="${O[0]}" cy="${O[1]}" r="80" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/><circle cx="${O[0]}" cy="${O[1]}" r="54" fill="none" stroke="${C.orange}" stroke-width="2" opacity=".6"/><circle cx="${O[0]}" cy="${O[1]}" r="28" fill="none" stroke="${C.orange}" stroke-width="2" opacity=".6"/>`, 0.1);
    body += at(2, 'pop', `<ellipse cx="${O[0]}" cy="290" rx="34" ry="12" fill="${C.green}"/><circle cx="${O[0]}" cy="296" r="17" fill="${C.green}" stroke="white" stroke-width="2"/>`, 0.4);
    // 두 팔은 줄기 꼭대기까지 못 가고 232°·308°에서 멈춘다(두 손 사이가 벌어진다)
    const [a1, a2] = [pt(116), pt(232)], [b1, b2] = [pt(64), pt(308)];
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M432 288 L${a1[0]} ${a1[1]} A${R} ${R} 0 0 1 ${a2[0]} ${a2[1]}" stroke="${C.green}" stroke-width="11" fill="none" stroke-linecap="round" style="transition: stroke-dashoffset 1.3s ease-in-out .7s"/>`
      + `<path class="draw draw2" pathLength="1" d="M492 288 L${b1[0]} ${b1[1]} A${R} ${R} 0 0 0 ${b2[0]} ${b2[1]}" stroke="${C.green}" stroke-width="11" fill="none" stroke-linecap="round" style="transition: stroke-dashoffset 1.3s ease-in-out .7s"/></g>`;
    // 칸 3: 두 손끝이 닿지 않는다 — 두 손 사이 둘레가 빨간 점선으로 남는다
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M${a2[0]} ${a2[1]} A${R} ${R} 0 0 1 ${b2[0]} ${b2[1]}" stroke="${C.red}" stroke-width="6" fill="none" stroke-linecap="round" style="transition: stroke-dashoffset .8s ease-in-out 1.1s"/></g>`;
    body += ring(O[0], O[1] - R, 16, C.red, 3, 1.8) + at(3, 'pop', tag(O[0], 46, '안 닿음', ROLE.r, 20), 1.8) + at(3, 'pop', `<circle cx="${a2[0]}" cy="${a2[1]}" r="8" fill="${C.peach}" stroke="${C.green}" stroke-width="3"/><circle cx="${b2[0]}" cy="${b2[1]}" r="8" fill="${C.peach}" stroke="${C.green}" stroke-width="3"/>`, 0.1);
    body += `<g class="b3"><circle class="draw draw3" pathLength="1" cx="${O[0]}" cy="${O[1]}" r="80" fill="none" stroke="${C.blue}" stroke-width="5" style="transition: stroke-dashoffset 1.2s ease-in-out .6s"/></g>`;
    body += at(3, 'pop', tag(598, 120, '둘레', ROLE.s, 20), 1.2) + at(3, 'pop', tag(598, 262, '두 팔', ROLE.p, 20), 1.4);
    // 칸 4
    body += glowRect(48, 4, 252, 336, 4, C.orange, 0.1, 18) + at(4, 'pop', tag(176, 226, '아름드리', ROLE.y, 22), 0.5);
    put(K + '4/아름드리', svg(id, body, css));
  })();

  // ── 5단원: 인물(「까망이와 까미」 — 말하고 움직이는 까마귀 둘, 말하지 않는 물병과 돌멩이) ──────────────────────────────
  const bubble = (x, y, flip = false) => `<ellipse cx="${x}" cy="${y}" rx="40" ry="24" fill="white" stroke="${C.ink}" stroke-width="3"/>`
    + P(`M${x + (flip ? 14 : -14)} ${y + 20} L${x + (flip ? 34 : -34)} ${y + 40} L${x + (flip ? 0 : 0)} ${y + 23}`, 'white', C.ink, 3)
    + `<rect x="${x - 6}" y="${y + 18}" width="20" height="6" fill="white"/>` + [-14, 0, 14].map((d) => `<circle cx="${x + d}" cy="${y}" r="4" fill="${C.ink}"/>`).join('');
  const bottle = (x, top, stroke = C.blue) => `<path d="M${x - 16} ${top} V${top + 42} Q${x - 44} ${top + 50} ${x - 44} ${top + 78} V${top + 166} Q${x - 44} ${top + 174} ${x - 36} ${top + 174} H${x + 36} Q${x + 44} ${top + 174} ${x + 44} ${top + 166} V${top + 78} Q${x + 44} ${top + 50} ${x + 16} ${top + 42} V${top} Z" fill="white" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round"/>`;
  (function () {
    const id = 't31-k3-inmul';
    let css = base(id);
    let body = at(1, 'drop', tile(320, 32, '「까망이와 까미」', { size: 20, h: 40, fill: TAN, stroke: C.orange }));
    const book = P('M320 282 Q260 268 136 276 V344 Q260 336 320 352 Z', 'white', C.line, 3) + P('M320 282 Q380 268 504 276 V344 Q380 336 320 352 Z', 'white', C.line, 3)
      + P('M320 282 V352', 'none', C.muted, 3) + [292, 308, 324].map((y) => P(`M160 ${y} Q240 ${y - 6} 300 ${y + 4} M340 ${y + 4} Q400 ${y - 6} 480 ${y}`, 'none', C.line, 2.5)).join('');
    body += at(1, 'pop', book, 0.3);
    // 칸 2: 책에서 까마귀 둘이 나와 말하고 날갯짓한다
    const crows = [[190, 146, false, '까망이'], [450, 146, true, '까미']];
    crows.forEach(([x, y, flip, name], i) => {
      body += `<g class="b2"><g class="cw${i}"><g class="bb${i}">${bird(x, y, { flip, wingCls: 'wg' })}</g></g></g>`;
      css += move(id, `cw${i}`, `translate(${320 - x}px, 150px) scale(.3)`, 2, { dur: 0.9, delay: 0.2 + i * 0.3 }) + bobCss(id, `.bb${i}`, 2, 1.3 + i * 0.2, 2);
      body += at(2, 'pop', bubble(flip ? x - 70 : x + 70, 78, flip), 1.3 + i * 0.2);
      body += at(2, 'pop', `<g class="nm${i}">${tag(x, 214, name, ROLE.s, 20)}</g>`, 1.0 + i * 0.3);
    });
    css += flapCss(id, '.wg', 2, 1.1, 3);
    // 칸 3: 물병과 돌멩이(말하지도 움직이지도 않는다)
    body += `<g class="dim dim4">` + at(3, 'fin', bottle(320, 92, C.muted) + `<rect x="280" y="210" width="80" height="50" rx="6" fill="${C.sky}"/>`, 0.2)
      + at(3, 'fin', [[296, 252], [318, 256], [340, 251]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${GRAY}" stroke="${C.muted}" stroke-width="2"/>`).join(''), 0.6) + '</g>';
    // 칸 4
    crows.forEach(([x], i) => { body += glowRect(x - 72, 100, 144, 134, 4, C.orange, 0.1 + i * 0.2, 16); css += paint(id, `.nm${i}`, ROLE.y, 4, 0.3 + i * 0.2) + pulseCss(id, `.nm${i} .tl`, 4, 0.5 + i * 0.2); });
    body += crows.map(([x], i) => at(4, 'pop', tag(x, 256, '인물', ROLE.y, 20), 0.8 + i * 0.2)).join('');
    put(K + '5/인물', svg(id, body, css));
  })();

  // ── 5단원: 성격(까미는 '희망이 없어' 하고 돌아감, 까망이는 돌멩이를 넣어 물을 마심 → 포기가 빠르다 / 끈기 있다) ──────────────────────────────
  (function () {
    const id = 't31-k3-seonggyeok';
    let css = base(id);
    // 물병과 물(칸 2에 물이 차오른다)
    let body = at(1, 'fin', bottle(320, 112), 0.1);
    body += `<clipPath id="${id}-b">${bottle(320, 112)}</clipPath><g class="b1"><g clip-path="url(#${id}-b)"><g class="wt"><rect x="274" y="242" width="92" height="44" fill="${C.sky}"/></g></g></g>` + at(1, 'fin', bottle(320, 112).replace('fill="white"', 'fill="none"'), 0.1);
    css += `.sc-${id} .wt { transform-box: fill-box; transform-origin: center bottom; transition: transform 1s ease-in-out .9s; } .on2 .sc-${id} .wt { transform: scaleY(3.6); }`;
    // 까미(왼쪽): 말하고 떠난다
    body += `<g class="b1"><g class="km">${g('pop pop1', bird(140, 196, {}), 0.2)}</g></g>`;
    css += `.sc-${id} .km { transition: transform 1s ease-in-out 1.3s, opacity 1s ease 1.3s; } .on1 .sc-${id} .km { transform: translate(-50px, -40px); opacity: .35; }`;
    body += at(1, 'pop', tile(140, 92, '희망이 없어', { size: 20, h: 42, fill: 'white', stroke: C.orange }), 0.6);
    // 까망이(오른쪽): 돌멩이를 하나씩 넣는다
    body += `<g class="hop">` + at(1, 'pop', `<g class="kg">${bird(506, 196, { flip: true })}</g>`, 0.3) + '</g>';
    css += `.sc-${id} .hop { transition: transform .5s ease-in-out 1.6s; } .on2 .sc-${id} .hop { transform: translate(-104px, -64px); }`;
    css += bobCss(id, '.kg', 2, 0.5, 3);
    body += at(2, 'pop', tile(506, 70, '포기할 수는 없어', { size: 20, h: 42, fill: 'white', stroke: C.green }), 0.1);
    [[300, 272], [322, 276], [342, 270]].forEach(([x, y], i) => {
      body += `<g class="b2"><g class="sn${i}"><circle cx="${x}" cy="${y}" r="9" fill="${GRAY}" stroke="${C.muted}" stroke-width="2"/></g></g>`;
      css += move(id, `sn${i}`, `translate(${448 - x}px, ${180 - y}px)`, 2, { dur: 0.5, delay: 0.3 + i * 0.25 }) + `.sc-${id} .sn${i} { opacity: 0; } .on2 .sc-${id} .sn${i} { opacity: 1; }`;
    });
    // 칸 3: 말과 행동에서 알 수 있는 성격
    body += at(3, 'pop', `<g class="t0">${tag(140, 300, '포기가 빠르다', ROLE.o, 20)}</g>`, 0.3) + at(3, 'pop', `<g class="t1">${tag(506, 300, '끈기 있다', ROLE.p, 20)}</g>`, 0.8);
    // 칸 4
    body += at(4, 'pop', tag(320, 338, '성격', ROLE.y, 22), 0.2) + drawArrow(282, 334, 214, 318, C.orange, 4, { width: 3.5, delay: 0.5 }) + drawArrow(358, 334, 448, 318, C.orange, 4, { width: 3.5, delay: 0.5 });
    css += pulseCss(id, '.t0 .tl', 4, 1.2) + pulseCss(id, '.t1 .tl', 4, 1.4);
    put(K + '5/성격', svg(id, body, css));
  })();

  // ── 5단원: 높임 표현(잭슨이 할아버지께 쓴 글 ↔ 할아버지가 잭슨에게 쓴 글 — 께·-요·올림) ──────────────────────────────
  (function () {
    const id = 't31-k3-nopim';
    let css = base(id);
    const S = 22;
    const T = (x, y, s, o = {}) => text(f(x), y, s, { size: S, anchor: 'start', weight: 600, ...o });
    // 칸 1: 할아버지가 잭슨에게(오른쪽)
    let right = card(334, 66, 288, 232) + T(358, 122, '잭슨에게') + T(358, 192, '여긴 고요하단다.') + T(440, 262, '할아버지로부터');
    let body = at(1, 'pop', tag(398, 38, '할아버지', ROLE.o, 18), 0.1) + drawArrow(446, 38, 512, 38, C.muted, 1, { width: 3.5, delay: 0.3 }) + at(1, 'pop', tag(554, 38, '잭슨', ROLE.s, 18), 0.5);
    body += `<g class="dim dim4">` + at(1, 'slr', right, 0.6);
    // 오른쪽 글의 끝말에 점선 밑줄(칸 3)
    const ul = (x, y, w, d) => `<g class="b3"><path class="draw draw3" pathLength="1" d="M${f(x)} ${y + 8} H${f(x + w)}" stroke="${C.muted}" stroke-width="3" stroke-linecap="round" style="transition-delay:${d}s"/></g>`;
    body += ul(358 + 2 * S, 122, 2 * S, 1.0) + ul(358 + tw('여긴 고요하', S), 192, 2 * S, 1.2) + ul(440 + 4 * S, 262, 3 * S, 1.4) + '</g>';
    // 칸 2: 잭슨이 웃어른인 할아버지께(왼쪽)
    body += at(2, 'pop', tag(78, 38, '잭슨', ROLE.s, 18), 0.1) + drawArrow(110, 38, 176, 38, C.muted, 2, { width: 3.5, delay: 0.3 }) + at(2, 'pop', tag(230, 38, '할아버지', ROLE.o, 18), 0.5);
    const hl = (x, w, y, d) => `<g class="b3"><rect class="flash flash3"${dl(d)} x="${f(x - 3)}" y="${y - 25}" width="${f(w + 6)}" height="34" rx="7" fill="${C.yellow}" opacity=".7"/></g>`;
    let left = card(18, 66, 288, 232);
    left += hl(42 + 4 * S, S, 122, 0.2) + hl(42 + tw('표지판을 세웠어', S), S, 192, 0.6) + hl(150 + tw('잭슨 ', S), 2 * S, 262, 1.0);
    left += T(42, 122, '할아버지께') + T(42, 192, '표지판을 세웠어요.') + T(150, 262, '잭슨 올림');
    body += `<g class="b2"><g class="lc">${g('slide slide2', left, 0.6)}</g></g>`;
    // 칸 4
    body += glowRect(14, 62, 296, 240, 4, C.orange, 0.1, 18) + at(4, 'pop', tag(162, 334, '높임 표현', ROLE.y, 22), 0.5);
    put(K + '5/높임 표현', svg(id, body, css));
  })();

  // ── 5단원: 추신(받는 사람·전하는 말·쓴 사람으로 글을 마친 뒤 맨 아래에 덧붙인 말) ──────────────────────────────
  (function () {
    const id = 't31-k3-chusin';
    let css = base(id);
    let body = at(1, 'fin', card(56, 16, 388, 330), 0.1) + at(1, 'slide', text(84, 64, '할아버지께', { size: 22, anchor: 'start' }), 0.3);
    const BW = [330, 300, 336, 210];
    BW.forEach((w, i) => { body += `<g class="b1"><g class="br${i}">${bar(84, 108 + i * 32, w, GRAY, 10)}</g></g>`; css += growAt(id, `br${i}`, 1, 0.6 + i * 0.2); });
    const side = (y, label, role, n, d, cls = '') => at(n, 'pop', `<g class="${cls}">${tag(548, y, label, role, 20)}</g>`, d) + `<g class="b${n}">${P(`M452 ${y} H${548 - wOf(label, 20) / 2 - 8}`, 'none', C.line, 3, ' stroke-dasharray="5 6"')}</g>`;
    body += side(58, '받는 사람', ROLE.s, 1, 0.5) + side(156, '전하는 말', ROLE.s, 1, 1.3);
    // 칸 2: 쓴 사람
    body += at(2, 'pop', text(414, 254, '잭슨 올림', { size: 22, anchor: 'end' }), 0.2) + side(248, '쓴 사람', ROLE.s, 2, 0.6);
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M84 278 H414" stroke="${C.line}" stroke-width="3" style="transition-delay:.9s"/></g>`;
    // 칸 3: 쓴 사람 아래에 덧붙인 말
    const rose = `<path d="M346 324 V306" stroke="${C.green}" stroke-width="3.5" stroke-linecap="round"/><path d="M346 316 q10 -8 16 -2 q-8 8 -16 2 Z" fill="${C.green}"/><circle cx="346" cy="296" r="12" fill="${C.red}"/>`
      + P('M346 296 m-6 0 a6 6 0 1 1 6 6 a3 3 0 1 1 -3 -3', 'none', 'white', 2);
    // 추신은 교과서 238쪽 그대로(두 줄로 나눈다)
    body += at(3, 'slr', text(84, 306, '추신: 할아버지를 위해', { size: 20, anchor: 'start' }) + text(84, 334, '장미를 그렸어요.', { size: 20, anchor: 'start' }), 0.2) + at(3, 'pop', `<g transform="translate(0 14)">${rose}</g>`, 0.8) + side(306, '추신', ROLE.o, 3, 1.0, 'cs');
    body += glowRect(68, 282, 310, 62, 3, C.orange, 0.5, 10);
    // 칸 4
    body += glowRect(68, 282, 310, 62, 4, C.green, 0.1, 10); css += paint(id, '.cs', ROLE.y, 4, 0.3);
    css += pulseCss(id, '.cs .tl', 4, 0.5);
    put(K + '5/추신', svg(id, body, css));
  })();

  // ── 5단원: 겨우내(가을에 도토리를 저장 → 12월·1월·2월 석 달 동안 쭉 꺼내 먹는다) ──────────────────────────────
  const acorn = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="5" rx="10" ry="12" fill="${C.orange}"/><path d="M-12 -1 Q0 -14 12 -1 Z" fill="${C.muted}"/><path d="M0 -9 V-15" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/></g>`;
  (function () {
    const id = 't31-k3-gyeounae';
    let css = base(id);
    const O = [190, 190], RO = 146, RI = 62;
    const p = (a, r) => [f(O[0] + r * Math.sin(a * Math.PI / 180)), f(O[1] - r * Math.cos(a * Math.PI / 180))];
    let ringSvg = '';
    for (let m = 1; m <= 12; m++) {
      const a0 = (m - 1) * 30, a1 = m * 30, [x0, y0] = p(a0, RI), [x1, y1] = p(a0, RO), [x2, y2] = p(a1, RO), [x3, y3] = p(a1, RI), [lx, ly] = p(a0 + 15, 106);
      ringSvg += `<path class="wd${m}" d="M${x0} ${y0} L${x1} ${y1} A${RO} ${RO} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${RI} ${RI} 0 0 0 ${x0} ${y0} Z" fill="white" stroke="${C.line}" stroke-width="2.5"/>`
        + text(lx, f(+ly + 6), `${m}월`, { size: 18, weight: 600 });
    }
    let body = at(1, 'fin', ringSvg, 0.1);
    [9, 10, 11].forEach((m, k) => { css += fillCss(id, `.wd${m}`, C.peach, 1, 0.5 + k * 0.2); });
    [12, 1, 2].forEach((m, k) => { css += fillCss(id, `.wd${m}`, C.sky, 2, 0.3 + k * 0.5); });
    // 바늘(칸 3): 12월 머리에서 2월 끝까지 돈다
    body += `<g class="b3"><g class="hd">${P(`M${O[0]} ${O[1]} V${O[1] - 138}`, 'none', C.red, 5)}${P(`M${O[0] - 9} ${O[1] - 124} L${O[0]} ${O[1] - 140} L${O[0] + 9} ${O[1] - 124}`, 'none', C.red, 5)}</g></g>`;
    css += `.sc-${id} .hd { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; transform: rotate(330deg); transition: transform 1.9s linear .2s; } .on3 .sc-${id} .hd { transform: rotate(420deg); }`;
    body += `<circle cx="${O[0]}" cy="${O[1]}" r="${RI - 3}" fill="white"/>`;
    body += `<g class="h2">` + at(1, 'pop', text(O[0], O[1] + 9, '가을', { size: 24, color: C.orange }), 0.6) + '</g>'
      + at(2, 'pop', text(O[0], O[1] - 4, '겨울', { size: 24, color: C.blue }), 0.2) + at(2, 'pop', text(O[0], O[1] + 24, '석 달', { size: 18, color: C.muted }), 1.3);
    // 땅속 보금자리와 도토리
    body += at(1, 'fin', `<rect x="370" y="118" width="270" height="242" fill="${C.peach}" opacity=".5"/>` + P('M370 118 H640', 'none', C.orange, 3)
      + P('M420 118 Q414 170 452 214', 'none', C.orange, 16) + P('M420 118 Q414 170 452 214', 'none', C.peach, 10)
      + `<ellipse cx="512" cy="258" rx="98" ry="56" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>` + P('M392 118 l-6 -14 M398 118 l2 -16 M600 118 l-4 -14 M606 118 l4 -14', 'none', C.green, 3), 0.1);
    const AC = [[456, 270], [486, 282], [516, 266], [546, 282], [574, 264], [500, 242]];
    AC.forEach(([x, y], i) => {
      body += `<g class="ac${i}">${acorn(x, y, 1.1)}</g>`;
      css += `.sc-${id} .ac${i} { opacity: 0; transform: translate(${f(420 - x)}px, ${f(80 - y)}px); transition: transform .7s ease-in ${0.7 + i * 0.18}s, opacity .3s ease ${0.7 + i * 0.18}s; }
        .on1 .sc-${id} .ac${i} { opacity: 1; transform: none; }`;
      if (i < 5) css += `.on3 .sc-${id} .ac${i} { opacity: 0; transition: opacity .4s ease ${0.5 + i * 0.3}s; }`;
    });
    // 칸 4: 겨울 석 달 내내
    const [ax, ay] = p(330, 160), [bx, by2] = p(60, 160);
    body += `<g class="b4"><path class="draw draw4" pathLength="1" d="M${ax} ${ay} A160 160 0 0 1 ${bx} ${by2}" stroke="${C.blue}" stroke-width="10" fill="none" stroke-linecap="round" style="transition: stroke-dashoffset 1.2s ease-in-out .2s"/></g>`;
    body += at(4, 'pop', tag(372, 52, '겨우내', ROLE.y, 22), 1.1);
    put(K + '5/겨우내', svg(id, body, css));
  })();

  // ── 5단원: 흑백(할아버지가 여덟 살 때 처음 생긴 텔레비전 — 빛깔이 빠지고 검은색·흰색·회색만) ──────────────────────────────
  (function () {
    const id = 't31-k3-heukbaek';
    let css = base(id);
    const tv = `<path d="M320 62 L270 10 M320 62 L372 12" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`
      + `<rect x="166" y="60" width="310" height="230" rx="22" fill="${C.peach}" stroke="${C.orange}" stroke-width="4"/>`
      + P('M204 290 L194 316 M440 290 L450 316', 'none', C.orange, 6)
      + `<circle cx="440" cy="118" r="16" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/><circle cx="440" cy="172" r="16" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>`
      + P('M422 218 H458 M422 234 H458 M422 250 H458 M422 266 H458', 'none', C.orange, 3);
    const pic = (c) => `<rect x="190" y="84" width="212" height="182" fill="${c.sky}" opacity="${c.skyO}"/>`
      + `<circle cx="242" cy="126" r="20" fill="${c.sun}" opacity="${c.sunO}"/>`
      + `<path d="M190 236 Q250 186 310 222 Q356 196 402 214 V266 H190 Z" fill="${c.hill}" opacity="${c.hillO}"/>`
      + `<rect x="314" y="190" width="54" height="46" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="M306 192 L341 160 L376 192 Z" fill="${c.roof}" opacity="${c.roofO}"/>`
      + `<rect x="232" y="214" width="10" height="30" fill="${c.trunk}" opacity="${c.trunkO}"/><circle cx="237" cy="200" r="22" fill="${c.tree}" opacity="${c.treeO}"/>`;
    const color = { sky: C.sky, skyO: 1, sun: C.yellow, sunO: 1, hill: C.green, hillO: 0.75, roof: C.red, roofO: 1, trunk: C.orange, trunkO: 1, tree: C.green, treeO: 1 };
    const gray = { sky: 'white', skyO: 1, sun: C.line, sunO: 1, hill: GRAY, hillO: 1, roof: C.ink, roofO: 1, trunk: C.ink, trunkO: 1, tree: C.muted, treeO: 1 };
    const screen = `<clipPath id="${id}-c"><rect x="190" y="84" width="212" height="182" rx="24"/></clipPath>`;
    let body = at(1, 'pop', tv + screen + `<g clip-path="url(#${id}-c)">${pic(color)}<g class="gy">${pic(gray)}</g></g><rect x="190" y="84" width="212" height="182" rx="24" fill="none" stroke="${C.ink}" stroke-width="3.5"/>`, 0.1);
    css += `.sc-${id} .gy { opacity: 0; transition: opacity 1.6s ease .4s; } .on2 .sc-${id} .gy { opacity: 1; }`;
    // 칸 3: 검은색에서 흰색까지
    [1, 0.7, 0.45, 0.2, 0].forEach((o, k) => {
      body += at(3, 'pop', `<rect x="${206 + k * 46}" y="318" width="44" height="32" fill="${o ? C.ink : 'white'}" opacity="${o || 1}" stroke="${C.line}" stroke-width="${o ? 0 : 2}"/>`, 0.2 + k * 0.15);
    });
    body += at(3, 'pop', tag(140, 334, '검은색', ROLE.g, 18), 1.0) + at(3, 'pop', tag(498, 334, '흰색', ROLE.g, 18), 1.2);
    // 칸 4
    body += glowRect(184, 78, 224, 194, 4, C.orange, 0.1, 26) + at(4, 'pop', tag(560, 160, '흑백', ROLE.y, 26), 0.5);
    put(K + '5/흑백', svg(id, body, css));
  })();

  // ── 5단원: 구체적('미안해.'만 → 언제·어디에서·무슨 일을 채워 또렷하게) ──────────────────────────────
  (function () {
    const id = 't31-k3-guchejeok';
    let css = base(id);
    const S = 20;
    const r = row(['어제', '운동장에서', '공을 피하다 넘어질 뻔해서', '미안해.'], { y: 290, size: S, gap: 10 });
    // 칸 1: '미안해.' 하나뿐
    let body = `<g class="b1"><g class="sr">${g('pop pop1', tile(320, 54, '미안해.', { size: S, w: r[3].w, h: 50, fill: 'white', stroke: C.orange }), 0.1)}</g></g>`;
    css += move(id, 'sr', 'none', 3, { dur: 1, delay: 1.2, to: `translate(${f(r[3].cx - 320)}px, ${290 - 54}px)` });
    body += `<g class="h3">` + [[226, 46], [414, 40], [446, 86]].map(([x, y], k) => at(1, 'pop', `<g class="qm"><circle cx="${x}" cy="${y}" r="17" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>${text(x, y + 8, '?', { size: 22, color: C.orange })}</g>`, 0.6 + k * 0.2)).join('') + '</g>';
    css += `.sc-${id} .qm { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .qm { animation: ${id}-shake .6s ease-in-out 1.4s 2; }`;
    // 칸 2: 언제? 어디에서? 무슨 일?
    const slot = [[96, '언제?'], [262, '어디에서?'], [484, '무슨 일?']];
    slot.forEach(([x, q], i) => {
      body += `<g class="dim dim3">` + at(2, 'pop', tag(x, 140, q, ROLE.s, 20), 0.1 + i * 0.4) + '</g>';
      body += `<g class="b2"><g class="an${i}">${g('pop pop2', tile(x, 196, r[i].label, { size: S, w: r[i].w, h: 46, fill: 'white', stroke: C.blue }), 0.3 + i * 0.4)}</g></g>`;
      css += move(id, `an${i}`, 'none', 3, { dur: 1, delay: 0.2 + i * 0.25, to: `translate(${f(r[i].cx - x)}px, ${290 - 196}px)` });
    });
    // 칸 4
    body += glowRect(r[0].l - 8, 258, r[3].r - r[0].l + 16, 64, 4, C.green, 0.1, 14) + at(4, 'pop', tag(320, 54, '구체적', ROLE.y, 24), 0.5);
    put(K + '5/구체적', svg(id, body, css));
  })();

  // ── 6단원: 사실·의견(지호의 일기 네 문장을 '있었던 일'과 '생각' 바구니에 나눈다) ──────────────────────────────
  const factScene = (focus) => {
    const id = ['t31-k3-sasil', 't31-k3-uigyeon'][focus];
    const name = ['사실', '의견'][focus];
    let css = base(id);
    const S = 20;
    // [글, 처음 x, 처음 y, 갈 곳(0 사실·1 의견), 바구니 안 y]
    const SEN = [['동물원에 다녀왔다', 160, 52, 0, 244], ['한쪽 다리로 선 홍학을 보았다', 452, 52, 0, 302], ['어쩐지 불편해 보였다', 160, 108, 1, 244], ['까닭을 알아보고 싶다', 452, 108, 1, 302]];
    const BIN = [[16, '사실', '있었던 일', ROLE.s], [330, '의견', '생각', ROLE.o]];
    let body = '';
    BIN.forEach(([x, label, sub, role], k) => {
      body += `<g class="${k === focus ? '' : 'dim dim4'}">` + at(1, 'fin', `<rect x="${x}" y="160" width="294" height="186" rx="16" fill="${role[0]}" opacity=".45"/><rect x="${x}" y="160" width="294" height="186" rx="16" fill="none" stroke="${role[1]}" stroke-width="3"/>`, 0.1 + k * 0.2)
        + at(1, 'pop', `<g class="hd${k}">${tag(x + 147, 160, label, ['white', role[1]], 20)}</g>`, 0.3 + k * 0.2) + at(1, 'fin', text(x + 147, 204, sub, { size: 18, color: role[1] }), 0.5 + k * 0.2) + '</g>';
    });
    const nOf = (to) => (to === focus ? 2 : 3);
    SEN.forEach(([s, x, y, to, ty], i) => {
      body += `<g class="${to === focus ? '' : 'dim dim4'}"><g class="b1"><g class="sn${i}">${g('drop drop1', tile(x, y, s, { size: s.length > 14 ? 19 : S, h: 46, fill: 'white', stroke: C.line }), 0.6 + i * 0.15)}</g></g></g>`;
      const n = nOf(to), k = SEN.filter((e, j) => j < i && e[3] === to).length;
      css += move(id, `sn${i}`, 'none', n, { dur: 1, delay: 0.2 + k * 0.5, to: `translate(${BIN[to][0] + 147 - x}px, ${ty - y}px)` }) + paint(id, `.sn${i}`, BIN[to][3], n, 1.0 + k * 0.5);
    });
    body += glowRect(BIN[focus][0] - 4, 156, 302, 194, 4, C.orange, 0.1, 18); css += paint(id, `.hd${focus}`, ROLE.y, 4, 0.3);
    css += pulseCss(id, `.hd${focus} .tl`, 4, 0.5);
    put(K + '6/' + name, svg(id, body, css));
  };
  factScene(0);
  factScene(1);

  // ── 6단원: 구분(섞인 문장 → '있었던 일인가, 생각인가' 기준으로 금을 긋고 두 갈래로 나눈다) ──────────────────────────────
  (function () {
    const id = 't31-k3-gubun';
    let css = base(id);
    const S = 18;
    // [글, 처음 x, 처음 y, 기울기, 갈 x, 갈 y]
    const SEN = [['봄이 지나면 여름이 온다', 206, 160, -6, 162, 168], ['나는 여름이 가장 좋다', 446, 186, 5, 478, 168], ['옆 반과 축구 경기를 했다', 226, 246, 4, 162, 234], ['로봇 공학자가 멋진 일을\n한다고 생각한다', 430, 290, -4, 478, 240]];
    let body = '';
    // 두 줄 조각(교과서 문장이 길 때): '\n' 으로 나눈다
    const tile2 = (cx, cy, label, { size, fill, stroke }) => {
      const [l1, l2] = label.split('\n'), w = Math.round(Math.max(tw(l1, size), tw(l2, size)) + size * 1.3), h = Math.round(size * 2.9);
      return `<g class="tl"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
        + text(f(cx), f(cy - size * 0.66 + size * 0.36), l1, { size, cls: 'tx' }) + text(f(cx), f(cy + size * 0.66 + size * 0.36), l2, { size, cls: 'tx' }) + '</g>';
    };
    SEN.forEach(([s, x, y, rot, tx, ty], i) => {
      const o = { size: S, h: 44, fill: 'white', stroke: C.line };
      body += `<g class="b1"><g class="sn${i}">${g('pop pop1', s.includes('\n') ? tile2(x, y, s, o) : tile(x, y, s, o), 0.1 + i * 0.2)}</g></g>`;
      css += `.sc-${id} .sn${i} { transform-box: fill-box; transform-origin: center; transform: rotate(${rot}deg); transition: transform 1s ease-in-out ${0.2 + i * 0.25}s; }
        .on3 .sc-${id} .sn${i} { transform: translate(${tx - x}px, ${ty - y}px); }` + paint(id, `.sn${i}`, tx < 320 ? ROLE.s : ROLE.o, 3, 1.0 + i * 0.25);
    });
    css += `.on1 .sc-${id} .sn0, .on1 .sc-${id} .sn2 { animation: ${id}-shake .6s ease-in-out 1s 2; }`;
    // 칸 2: 기준과 가운데 금
    body += at(2, 'pop', tag(320, 32, '기준', ROLE.x, 20), 0.1) + at(2, 'fin', text(320, 72, '있었던 일인가, 생각인가', { size: 18, color: C.purple }), 0.4);
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M320 94 V290" stroke="${C.purple}" stroke-width="4" stroke-linecap="round" style="transition-delay:.8s"/></g>`;
    body += at(2, 'pop', tag(162, 112, '사실', ROLE.s, 20), 1.4) + at(2, 'pop', tag(478, 112, '의견', ROLE.o, 20), 1.6);
    // 칸 4
    body += glowRect(14, 140, 296, 128, 4, C.blue, 0.1, 16) + glowRect(326, 140, 306, 140, 4, C.orange, 0.3, 16) + at(4, 'pop', tag(320, 318, '구분', ROLE.y, 24), 0.6);
    put(K + '6/구분', svg(id, body, css));
  })();

  // ── 6단원: 과거·현재(시간 화살표 — 소금이 귀하고 비싸던 옛날, 흔해진 지금) ──────────────────────────────
  const salt = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 -4 Q0 -64 40 -4 Z" fill="white" stroke="${C.muted}" stroke-width="2.5"/><path d="M-50 -6 H50 Q46 34 0 36 Q-46 34 -50 -6 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/></g>`;
  const timeScene = (focus) => {
    const id = ['t31-k3-gwageo', 't31-k3-hyeonjae'][focus];
    const name = ['과거', '현재'][focus];
    let css = base(id);
    const Y = 200, NOW = 430;
    let body = '';
    if (focus === 0) { body += `<g class="b4"><g class="pb"><rect x="40" y="${Y - 16}" width="${NOW - 46}" height="32" rx="16" fill="${C.sky}"/></g></g>`; css += growAt(id, 'pb', 4, 0.1, 0.9); }
    body += `<g class="b1"><path class="draw draw1" pathLength="1" d="M40 ${Y} H${NOW}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>`;
    body += at(1, 'fin', P(`M${NOW + 14} ${Y} H596`, 'none', C.muted, 4, ' stroke-dasharray="8 9"') + head(604, Y, 0, C.muted, 4), 0.9);
    body += at(1, 'pop', `<circle cx="${NOW}" cy="${Y}" r="11" fill="${C.red}"/>`, 1.0) + ring(NOW, Y, 14, C.red, 1, 1.2) + at(1, 'fin', text(NOW, Y + 38, '지금', { size: 18, color: C.red }), 1.2);
    // 칸 2: 옛날 — 작은 소금, 동전 더미
    const coins = [0, 1, 2, 3].map((k) => `<ellipse cx="262" cy="${150 - k * 9}" rx="20" ry="7" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`).join('');
    body += at(2, 'pop', salt(194, 146, 0.6), 0.2) + at(2, 'rise', coins, 0.6) + at(2, 'pop', tag(220, 266, '구하기 어렵고 비쌈', ROLE.o, 18), 1.1);
    // 칸 3: 지금 — 소금이 수북
    body += at(3, 'pop', salt(NOW, 140, 1.2), 0.2) + at(3, 'pop', tag(NOW, 274, '흔함', ROLE.p, 18), 0.9);
    // 칸 4
    if (focus === 0) body += at(4, 'pop', tag(220, 326, '과거', ROLE.y, 24), 0.8);
    else body += ring(NOW, Y, 22, C.orange, 4, 0.1) + glowRect(NOW - 74, 70, 148, 220, 4, C.orange, 0.2, 18) + at(4, 'pop', tag(NOW, 326, '현재', ROLE.y, 24), 0.6);
    put(K + '6/' + name, svg(id, body, css));
  };
  timeScene(0);
  timeScene(1);

  // ── 6단원: 쓰임새(소금 한 가지가 음식·몸속·생활 여러 곳에 쓰인다) ──────────────────────────────
  (function () {
    const id = 't31-k3-sseuimsae';
    let css = base(id);
    const C0 = [320, 176];
    // [이름표, x, y, 칸, 빛깔]
    const USE = [['간 맞추기', 112, 66, 1, ROLE.o], ['소화액 만들기', 112, 176, 2, ROLE.p], ['뇌의 신호 돕기', 112, 286, 2, ROLE.p], ['치약·비누', 528, 66, 3, ROLE.s], ['눈길 얼지 않게', 528, 176, 3, ROLE.s], ['먼지 막기', 528, 286, 3, ROLE.s]];
    let body = '';
    const seen = {};
    USE.forEach(([label, x, y, n, role], i) => {
      const k = seen[n] = (seen[n] || 0) + 1;
      const d = 0.2 + (k - 1) * 0.5;
      body += `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${C0[0]} ${C0[1]} L${x} ${y}" stroke="${role[1]}" stroke-width="3.5" stroke-linecap="round" style="transition-delay:${d}s"/></g>`;
      body += at(n, 'pop', `<g class="us${i}">${tag(x, y, label, role, 20)}</g>`, d + 0.6);
      css += pulseCss(id, `.us${i} .tl`, 4, 0.3 + i * 0.12);
    });
    body += at(1, 'pop', `<circle cx="${C0[0]}" cy="${C0[1]}" r="66" fill="white" stroke="${C.line}" stroke-width="3"/>` + salt(C0[0], C0[1] + 6, 0.95), 0.1)
      + at(1, 'pop', tag(C0[0], 258, '소금', ROLE.g, 20), 0.3);
    body += at(4, 'pop', tag(320, 324, '쓰임새', ROLE.y, 24), 0.2) + ring(C0[0], C0[1], 70, C.orange, 4, 0.2);
    put(K + '6/쓰임새', svg(id, body, css));
  })();

  // ── 6단원: 협동(아이스크림 가게 — 점원은 주문을 받고 통을 끼우고, 로봇은 짜서 컵에 담는다) ──────────────────────────────
  (function () {
    const id = 't31-k3-hyeopdong';
    let css = base(id);
    let body = at(1, 'rise', person(150, 214, C.green, 22), 0.1);
    // 로봇: 몸통과 팔(팔은 이음매 J 를 축으로 돈다)
    const J = [500, 182];
    body += at(1, 'rise', `<rect x="440" y="182" width="80" height="58" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><circle cx="462" cy="200" r="6" fill="${C.blue}"/><rect x="452" y="214" width="56" height="22" rx="5" fill="white" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="5 4"/>`, 0.3);
    const arm = P(`M${J[0]} ${J[1]} L450 110`, 'none', C.blue, 14) + `<rect x="436" y="96" width="28" height="22" rx="6" transform="rotate(-35 450 107)" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><circle cx="${J[0]}" cy="${J[1]}" r="11" fill="white" stroke="${C.blue}" stroke-width="3.5"/>`;
    body += `<g class="b1"><g class="arm">${g('rise rise1', arm, 0.3)}</g></g>`;
    css += `.sc-${id} .arm { transform-box: view-box; transform-origin: ${J[0]}px ${J[1]}px; transition: transform 1s ease-in-out .3s; } .on3 .sc-${id} .arm { transform: rotate(118deg); }`;
    // 계산대(사람 아랫몸을 가린다)
    body += at(1, 'fin', `<rect x="30" y="238" width="580" height="30" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`);
    body += at(1, 'pop', tag(150, 306, '점원', ROLE.p, 20), 0.6) + at(1, 'pop', tag(480, 306, '로봇', ROLE.s, 20), 0.8);
    // 아이스크림 통: 칸 2에 점원 곁에서 로봇에 끼워진다
    const tub = `<rect x="462" y="208" width="36" height="28" rx="4" fill="white" stroke="${C.purple}" stroke-width="3"/><ellipse cx="480" cy="208" rx="18" ry="5" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`;
    body += at(1, 'fin', `<g class="tb">${tub}</g>`, 0.8);
    css += move(id, 'tb', 'translate(-270px, 0)', 2, { dur: 1, delay: 1.0 });
    // 칸 2: 주문 받기
    body += at(2, 'pop', `<rect x="186" y="150" width="34" height="44" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + P('M193 164 H213 M193 174 H213 M193 184 H206', 'none', C.muted, 2.5), 0.2)
      + at(2, 'pop', tag(150, 56, '주문 받기', ROLE.p, 20), 0.4) + at(2, 'pop', tag(150, 100, '통 끼우기', ROLE.p, 20), 1.1);
    // 칸 3: 로봇이 짜서 컵에 담는다
    body += at(1, 'fin', P('M554 196 L562 238 H590 L598 196 Z', 'white', C.orange, 3), 0.9);
    body += at(3, 'pop', `<g class="ic"><circle cx="576" cy="190" r="17" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><circle cx="569" cy="184" r="4" fill="white"/></g>`, 1.3);
    body += at(3, 'pop', tag(480, 56, '짜서 담기', ROLE.s, 20), 0.2);
    // 칸 4: 둘이 힘을 합친다
    body += at(4, 'pop', tag(320, 306, '협동', ROLE.y, 24), 0.2) + drawArrow(186, 306, 274, 306, C.orange, 4, { width: 3.5, delay: 0.5 }) + drawArrow(446, 306, 366, 306, C.orange, 4, { width: 3.5, delay: 0.5 });
    css += pulseCss(id, '.ic', 4, 1.1);
    put(K + '6/협동', svg(id, body, css));
  })();

  // ── 6단원: 인공 지능(사람처럼 보고·배우고·판단하는 컴퓨터 기술을 로봇에 더하면 앞의 사람을 알아보고 멈춘다) ──────────────────────────────
  (function () {
    const id = 't31-k3-ingong';
    let css = base(id);
    let body = at(1, 'pop', person(110, 150, C.green, 26), 0.1);
    const SK = [['보기', 226], ['배우기', 268], ['판단하기', 310]];
    SK.forEach(([l, y], i) => { body += at(1, 'pop', tag(110, y, l, ROLE.p, 20), 0.5 + i * 0.3); });
    // 칸 2: 그 일을 하는 컴퓨터 기술(칩)이 로봇 가슴으로
    const chip = `<rect x="270" y="110" width="60" height="60" rx="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3.5"/><rect x="286" y="126" width="28" height="28" rx="4" fill="${C.purple}"/>`
      + [0, 1, 2].map((k) => P(`M${282 + k * 18} 110 V100 M${282 + k * 18} 170 V180 M270 ${122 + k * 18} H260 M330 ${122 + k * 18} H340`, 'none', C.purple, 3)).join('');
    body += drawArrow(172, 268, 254, 168, C.purple, 2, { width: 3.5, delay: 0.1 });
    css += move(id, 'cp', 'none', 2, { dur: 0.9, delay: 1.4, to: 'translate(215px, 46px) scale(.45)' }) + `.sc-${id} .cp { transform-box: fill-box; transform-origin: center; }`;
    body += at(2, 'pop', `<g class="ai">${tag(290, 216, '인공 지능', ROLE.x, 20)}</g>`, 0.8);
    // 로봇(칸 2에 나타나고, 칸 3에 앞으로 가다 멈춘다)
    const robot = `<path d="M515 66 V80" stroke="${C.blue}" stroke-width="3.5"/><circle cx="515" cy="62" r="6" fill="${C.orange}"/>`
      + `<rect x="478" y="80" width="74" height="52" rx="12" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5"/><circle cx="500" cy="104" r="7" fill="${C.blue}"/><circle cx="530" cy="104" r="7" fill="${C.blue}"/>`
      + `<rect x="468" y="138" width="94" height="84" rx="12" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5"/>`
      + P('M468 160 L446 196 M562 160 L584 196', 'none', C.blue, 8) + `<circle cx="488" cy="234" r="12" fill="${C.ink}"/><circle cx="542" cy="234" r="12" fill="${C.ink}"/>`;
    body += at(1, 'fin', P('M330 248 H630', 'none', C.muted, 3), 0.2);
    body += `<g class="b2"><g class="rb">${g('pop pop2', robot, 0.2)}<g class="cp">${g('pop pop2', chip, 0.5)}</g></g></g>`;
    css += `.sc-${id} .rb { transition: transform 1.3s ease-out .5s; } .on3 .sc-${id} .rb { transform: translateX(-40px); }`;
    // 칸 3: 앞의 사람을 알아보고 멈춘다
    body += at(3, 'rise', person(372, 222, C.orange, 13), 0.1);
    body += `<g class="b3">${g('flash flash3', P('M452 104 L390 190 L390 236 Z', C.yellow, 'none', 0, ' fill-opacity=".45"'), 1.3)}</g>`;
    body += at(3, 'pop', tag(475, 30, '멈춤', ROLE.r, 20), 1.7);
    // 칸 4
    body += glowRect(400, 48, 150, 206, 4, C.purple, 0.1, 16); css += paint(id, '.ai', ROLE.y, 4, 0.3);
    css += pulseCss(id, '.ai .tl', 4, 0.6);
    put(K + '6/인공 지능', svg(id, body, css));
  })();

  // ── 6단원: 공익 광고(과자를 파는 광고 ↔ 종이와 플라스틱을 나누어 버리자고 알리는 광고) ──────────────────────────────
  const paper = (x, y) => `<rect x="${x - 14}" y="${y - 12}" width="28" height="24" rx="3" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 8} ${y - 3} H${x + 8} M${x - 8} ${y + 4} H${x + 4}" stroke="${C.orange}" stroke-width="2" stroke-linecap="round"/>`;
  const pbottle = (x, y) => `<path d="M${x - 4} ${y - 20} H${x + 4} V${y - 14} Q${x + 9} ${y - 10} ${x + 9} ${y - 4} V${y + 16} Q${x + 9} ${y + 19} ${x + 6} ${y + 19} H${x - 6} Q${x - 9} ${y + 19} ${x - 9} ${y + 16} V${y - 4} Q${x - 9} ${y - 10} ${x - 4} ${y - 14} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const can = (x, y) => `<rect x="${x - 10}" y="${y - 15}" width="20" height="30" rx="5" fill="white" stroke="${C.purple}" stroke-width="2.5"/><rect x="${x - 10}" y="${y - 4}" width="20" height="9" fill="${C.lilac}"/>`;
  const bin = (x, top, w, h, fill, stroke) => `<path d="M${x - w / 2} ${top} H${x + w / 2} L${x + w / 2 - 10} ${top + h} H${x - w / 2 + 10} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/><rect x="${x - w / 2 - 6}" y="${top - 8}" width="${w + 12}" height="10" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  (function () {
    const id = 't31-k3-gongik';
    let css = base(id);
    // 칸 1: 과자를 파는 광고
    const bag = `<rect x="116" y="84" width="84" height="112" rx="10" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/>` + P('M116 96 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8 l7 -8 l7 8', 'none', C.orange, 2.5)
      + `<circle cx="158" cy="142" r="24" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + star(158, 142, 13, 'white', C.orange);
    let body = `<g class="dim dim3">` + at(1, 'pop', card(26, 34, 264, 262) + bag, 0.1) + at(1, 'pop', `<g class="pr">${tile(158, 244, '1,000원', { size: 24, h: 50, fill: C.peach, stroke: C.red })}</g>`, 0.6)
      + at(1, 'pop', tag(158, 326, '물건 팔기', ROLE.g, 18), 1.0) + '</g>';
    css += pulseCss(id, '.pr', 1, 1.1);
    // 칸 2: 종이와 플라스틱이 함께 버려진 쓰레기통
    body += at(2, 'fin', card(350, 34, 264, 262), 0.1);
    body += at(2, 'pop', bin(410, 120, 70, 92, 'white', C.muted), 0.3) + ring(410, 150, 52, C.red, 2, 0.9);
    // 칸 3: 나누어 버린다
    body += drawArrow(450, 160, 482, 160, C.green, 3, { delay: 0.2 });
    body += at(3, 'pop', bin(514, 126, 44, 76, C.peach, C.orange) + bin(566, 126, 44, 76, C.sky, C.blue), 0.4);
    body += `<g class="b2"><g class="pp">${g('pop pop2', paper(514, 148), 0.5)}</g><g class="pb">${g('pop pop2', pbottle(566, 146), 0.6)}</g></g>`;
    css += move(id, 'pp', 'translate(-106px, -38px)', 3, { dur: 0.9, delay: 0.8 }) + move(id, 'pb', 'translate(-134px, -46px)', 3, { dur: 0.9, delay: 1.1 });
    // 칸 4: 모두에게 이로운 일을 알린다
    body += glowRect(346, 30, 272, 270, 4, C.green, 0.1, 18) + at(4, 'pop', tag(450, 326, '공익 광고', ROLE.y, 22), 0.5);
    body += [548, 582, 616].map((x, k) => at(4, 'rise', person(x, 330, [C.blue, C.orange, C.purple][k], 9), 0.8 + k * 0.15)).join('');
    put(K + '6/공익 광고', svg(id, body, css));
  })();

  // ── 6단원: 분리배출(한 통에 섞인 종이·플라스틱·캔 → 종류마다 다른 통에) ──────────────────────────────
  (function () {
    const id = 't31-k3-bunri';
    let css = base(id);
    let body = `<g class="h4"><g class="dim dim3">` + at(1, 'pop', bin(320, 96, 110, 104, 'white', C.muted), 0.1) + '</g></g>';
    // 칸 2: 종류마다 통
    const BINS = [[150, '종이', C.peach, C.orange], [320, '플라스틱', C.sky, C.blue], [492, '캔', C.lilac, C.purple]];
    BINS.forEach(([x, label, fill, stroke], k) => {
      body += at(2, 'rise', bin(x, 236, 120, 100, fill, stroke), 0.2 + k * 0.25) + at(2, 'pop', tag(x, 304, label, ['white', stroke], 18), 0.5 + k * 0.25);
    });
    // [그림, 처음 x, y, 갈 x, y]
    const IT = [[paper, 290, 92, 132, 244], [paper, 344, 74, 166, 250], [pbottle, 320, 80, 306, 242], [pbottle, 362, 98, 336, 248], [can, 300, 68, 478, 244], [can, 336, 104, 506, 250]];
    IT.forEach(([draw, x, y, tx, ty], i) => {
      body += `<g class="b1"><g class="it${i}">${g('drop drop1', draw(x, y), 0.4 + i * 0.12)}</g></g>`;
      css += move(id, `it${i}`, 'none', 3, { dur: 0.9, delay: 0.2 + i * 0.2, to: `translate(${tx - x}px, ${ty - y}px)` });
    });
    // 칸 4: 다시 쓰인다(돌아가는 화살표)
    const O = [320, 110], R = 44;
    let rec = '';
    [0, 120, 240].forEach((a) => {
      const s = (a + 12) * Math.PI / 180, e = (a + 100) * Math.PI / 180;
      const [x1, y1, x2, y2] = [O[0] + R * Math.cos(s), O[1] + R * Math.sin(s), O[0] + R * Math.cos(e), O[1] + R * Math.sin(e)];
      rec += P(`M${f(x1)} ${f(y1)} A${R} ${R} 0 0 1 ${f(x2)} ${f(y2)}`, 'none', C.green, 7) + head(f(x2), f(y2), e + Math.PI / 2, C.green, 6);
    });
    body += `<g class="b4"><g class="rc">${g('pop pop4', rec, 0.2)}</g></g>`;
    css += `.sc-${id} .rc { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; } @keyframes ${id}-rot { to { transform: rotate(360deg); } } .on4 .sc-${id} .rc { animation: ${id}-rot 1.6s ease-in-out .7s 1; }`;
    body += glowRect(78, 220, 484, 124, 4, C.green, 0.3, 16) + at(4, 'pop', tag(500, 110, '분리배출', ROLE.y, 24), 0.9);
    put(K + '6/분리배출', svg(id, body, css));
  })();

  // ── 6단원: 그루잠(밤에 잠듦 → 한밤중에 깸 → 다시 든 잠) ──────────────────────────────
  (function () {
    const id = 't31-k3-grujam';
    let css = base(id);
    const Y = 200;
    let body = at(1, 'pop', P('M88 44 A30 30 0 1 0 112 92 A24 24 0 1 1 88 44 Z', C.yellow, C.orange, 2.5) + star(150, 50, 7, 'white', C.yellow) + star(130, 100, 5, 'white', C.yellow), 0.1);
    const seg = [[60, 300, C.sky, C.blue, 1], [300, 360, C.yellow, C.orange, 2], [360, 580, C.lilac, C.purple, 3]];
    seg.forEach(([x1, x2, fill, stroke, n], k) => {
      body += `<g class="b${n}"><g class="sg${k}"><rect x="${x1}" y="${Y - 16}" width="${x2 - x1}" height="32" rx="${k === 1 ? 4 : 16}" fill="${fill}" stroke="${stroke}" stroke-width="3"/></g></g>`;
      css += growAt(id, `sg${k}`, n, 0.3, k === 1 ? 0.5 : 1.2);
    });
    const zz = (x, n, d) => `<g class="b${n}">` + [0, 1, 2].map((k) => `<g class="z z${n}" style="animation-delay:${d + k * 0.25}s">${text(x + k * 18, 150 - k * 16, 'z', { size: 20 + k * 4, color: C.blue })}</g>`).join('') + '</g>';
    body += zz(160, 1, 1.0);
    css += `.sc-${id} .z { opacity: 0; } @keyframes ${id}-z { 0% { opacity: 0; transform: translateY(8px); } 40% { opacity: 1; } 100% { opacity: 1; transform: none; } }
      .on1 .sc-${id} .z1 { animation: ${id}-z .6s ease-out both; } .on3 .sc-${id} .z3 { animation: ${id}-z .6s ease-out both; }`;
    const eye = `<path d="M-26 0 Q0 -22 26 0 Q0 22 -26 0 Z" fill="white" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/><circle r="9" fill="${C.orange}"/><circle cx="-3" cy="-3" r="3" fill="white"/>`;
    body += at(2, 'pop', at0(330, 140, eye), 0.6) + at(2, 'fin', text(330, 296, '한밤중', { size: 18, color: C.orange }), 1.0);
    body += zz(450, 3, 1.2);
    body += at(1, 'pop', tag(180, 254, '잠', ROLE.s, 20), 0.8) + at(2, 'pop', tag(330, 254, '깸', ROLE.o, 20), 0.8) + at(3, 'pop', `<g class="gj">${tag(470, 254, '다시 든 잠', ROLE.x, 20)}</g>`, 1.0);
    // 칸 4
    body += glowRect(354, Y - 22, 232, 44, 4, C.orange, 0.1, 18) + at(4, 'pop', tag(470, 316, '그루잠', ROLE.y, 24), 0.5); css += paint(id, '.gj', ROLE.y, 4, 0.3);
    put(K + '6/그루잠', svg(id, body, css));
  })();

  // 위로 뾰족한 묶음 괄호(가로): x1~x2, 높이 y
  const braceUp = (x1, x2, y, color = C.green) => { const m = (x1 + x2) / 2; return P(`M${x1} ${y + 12} Q${x1} ${y} ${x1 + 14} ${y} H${m - 12} Q${m} ${y} ${m} ${y - 12} Q${m} ${y} ${m + 12} ${y} H${x2 - 14} Q${x2} ${y} ${x2} ${y + 12}`, 'none', color, 3.5); };

  // ── 4단원: 액체(돌멩이는 어느 그릇에서나 제 모양, 물은 그릇 모양대로 — 매미가 내뿜는 것도 흘러 퍼진다) ──────────────────────────────
  (function () {
    const id = 't31-k3-aekche';
    let css = base(id);
    const bowl = 'M60 214 H200 Q200 300 130 300 Q60 300 60 214 Z';
    const box = 'M246 196 V300 H366 V196';
    let body = at(1, 'fin', `<clipPath id="${id}-a"><path d="${bowl}"/></clipPath><clipPath id="${id}-b"><rect x="246" y="190" width="120" height="110"/></clipPath>`);
    // 칸 2: 물이 그릇 모양대로 찬다(그릇보다 먼저 그려 그릇 테두리가 위에 오게)
    body += `<g class="b2"><g clip-path="url(#${id}-a)"><g class="wa"><rect x="56" y="226" width="148" height="80" fill="${C.sky}"/></g></g><g clip-path="url(#${id}-b)"><g class="wb"><rect x="246" y="226" width="120" height="80" fill="${C.sky}"/></g></g></g>`;
    css += `.sc-${id} .wa, .sc-${id} .wb { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform 1.2s ease-out .7s; } .on2 .sc-${id} .wa, .on2 .sc-${id} .wb { transform: none; }`;
    body += at(1, 'pop', P(bowl, 'none', C.ink, 3.5) + P(box, 'none', C.ink, 3.5), 0.1) + at(1, 'fin', text(130, 334, '둥근 그릇', { size: 18, color: C.muted }) + text(306, 334, '네모 그릇', { size: 18, color: C.muted }), 0.2);
    // 칸 1: 돌멩이는 제 모양 그대로
    const stone = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="22" fill="${GRAY}" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<g class="h2">` + [[130, 274], [306, 276]].map(([x, y], k) => `<g class="b1"><g class="ss${k}">${stone(x, y)}</g></g>`).join('') + at(1, 'pop', tag(218, 150, '돌멩이', ROLE.g, 20), 1.3) + '</g>';
    [0, 1].forEach((k) => { css += move(id, `ss${k}`, 'translate(0, -170px)', 1, { dur: 0.7, delay: 0.4 + k * 0.3 }) + `.sc-${id} .ss${k} { opacity: 0; } .on1 .sc-${id} .ss${k} { opacity: 1; }`; });
    // 칸 2: 위에서 물을 붓는다
    body += `<g class="b2 h3">` + [130, 306].map((x, k) => `<g class="pr" style="animation-delay:${0.2 + k * 0.2}s"><rect x="${x - 5}" y="120" width="10" height="110" rx="5" fill="${C.blue}" opacity=".7"/></g>`).join('') + '</g>';
    css += `.sc-${id} .pr { opacity: 0; } @keyframes ${id}-pour { 0% { opacity: 0; } 20%, 80% { opacity: 1; } 100% { opacity: 0; } } .on2 .sc-${id} .pr { animation: ${id}-pour 1.6s ease both; }`;
    body += at(2, 'pop', tag(218, 150, '물', ROLE.s, 20), 1.6) + at(2, 'fin', P('M66 236 Q130 222 194 236', 'none', C.blue, 3, ' stroke-dasharray="6 6"') + `<rect x="250" y="230" width="112" height="66" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 6"/>`, 1.9);
    // 칸 3: 매미가 내뿜는 것도 흘러 떨어져 퍼진다
    body += at(3, 'fin', `<rect x="540" y="0" width="60" height="320" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + P('M420 320 H630', 'none', C.orange, 3), 0.1) + at(3, 'pop', cicada(540, 110, 1.1), 0.3);
    body += `<g class="b3">` + [0, 1, 2].map((k) => `<g class="fd" style="animation-delay:${0.6 + k * 0.35}s">${drip(520, 140, 0.9)}</g>`).join('') + `<g class="pd"><ellipse cx="500" cy="318" rx="56" ry="9" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/></g></g>`;
    css += `.sc-${id} .fd { opacity: 0; } @keyframes ${id}-fall { 0% { opacity: 0; transform: none; } 15% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; transform: translate(-20px, 172px); } }
      .on3 .sc-${id} .fd { animation: ${id}-fall .8s ease-in both; }
      .sc-${id} .pd { transform-box: fill-box; transform-origin: center; transform: scale(0, 1); transition: transform 1.2s ease-out 1.2s; } .on3 .sc-${id} .pd { transform: none; }`;
    // 칸 4
    body += glowRect(48, 204, 330, 104, 4, C.blue, 0.1, 16) + at(4, 'pop', tag(218, 150, '액체', ROLE.y, 24), 0.5) + ring(500, 318, 30, C.blue, 4, 0.6);
    put(K + '4/액체', svg(id, body, css));
  })();

  // ── 4단원: 무역(바다를 사이에 둔 두 나라 — 배가 이쪽 물건을 싣고 가서 팔고, 저쪽 물건을 사서 돌아온다) ──────────────────────────────
  (function () {
    const id = 't31-k3-muyeok';
    let css = base(id);
    const pot = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${jar(0, -18, 30, 36, 'white', C.blue)}<path d="M-10 0 H10" stroke="${C.blue}" stroke-width="2.5"/></g>`;
    const cloth = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-17" y="-14" width="34" height="28" rx="6" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/><path d="M-9 -14 V14 M3 -14 V14" stroke="${C.purple}" stroke-width="2.5"/></g>`;
    let body = at(1, 'fin', `<rect x="0" y="150" width="640" height="210" fill="${C.sky}" opacity=".6"/>`);
    body += at(1, 'rise', `<path d="M0 120 H150 Q176 120 176 146 V360 H0 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`, 0.1) + at(1, 'rise', `<path d="M640 120 H490 Q464 120 464 146 V360 H640 Z" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>`, 0.3);
    body += at(1, 'pop', tag(80, 92, '우리나라', ROLE.p, 20), 0.5) + at(1, 'pop', tag(560, 92, '다른 나라', ROLE.o, 20), 0.7);
    body += at(1, 'pop', pot(46, 200) + pot(92, 200) + pot(69, 250), 0.8) + at(1, 'pop', cloth(548, 196) + cloth(594, 196) + cloth(571, 246), 1.0);
    body += `<g class="b1">` + [[240, 300], [330, 250], [410, 310]].map(([x, y], k) => `<path class="wv" style="animation-delay:${k * 0.3}s" d="M${x} ${y} q12 -8 24 0 t24 0" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') + '</g>';
    css += `@keyframes ${id}-wave { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } } .on1 .sc-${id} .wv { animation: ${id}-wave 1.4s ease-in-out infinite; }`;
    // 배: 칸 2에 오른쪽으로, 칸 3에 다시 왼쪽으로
    const ship = `<path d="M176 186 H272 L258 210 H190 Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M224 186 V122" stroke="${C.ink}" stroke-width="3"/><path d="M226 126 L262 176 H226 Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    body += `<g class="b1"><g class="sp">${g('fin fin1', ship, 0.6)}<g class="b2 h3">${pot(200, 184, 0.8)}</g><g class="b3">${cloth(202, 176, 0.8)}</g></g></g>`;
    css += `.sc-${id} .sp { transition: transform 1.3s ease-in-out .3s; } .on2 .sc-${id} .sp { transform: translateX(190px); } .on3 .sc-${id} .sp { transform: none; }`;
    body += at(2, 'pop', pot(617, 250), 1.8) + drawArrow(250, 150, 420, 150, C.green, 2, { delay: 0.3 }) + at(2, 'pop', tag(334, 50, '팔기', ROLE.p, 20), 0.5);
    body += at(3, 'pop', cloth(115, 250), 1.8) + drawArrow(420, 232, 250, 232, C.orange, 3, { delay: 0.3 }) + at(3, 'pop', tag(334, 336, '사기', ROLE.o, 20), 0.5);
    // 칸 4
    body += ring(320, 190, 120, C.orange, 4, 0.1) + at(4, 'pop', tag(334, 100, '무역', ROLE.y, 24), 0.4);
    put(K + '4/무역', svg(id, body, css));
  })();

  // ── 4단원: 성분(치약 한 줄을 크게 키워 보면 여러 가지가 섞여 있고, 그 가운데 소금도 있다) ──────────────────────────────
  (function () {
    const id = 't31-k3-seongbun';
    let css = base(id);
    const tube = `<path d="M40 140 H150 L176 126 V166 L150 152 H40 Q32 146 40 140 Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/><rect x="176" y="134" width="18" height="24" rx="3" fill="${C.blue}"/><path d="M60 140 V152 M74 140 V152" stroke="${C.blue}" stroke-width="2.5"/>`;
    let body = at(1, 'slide', tube, 0.1);
    body += `<g class="b1"><g class="pst">${P('M196 146 Q214 128 230 146 T262 146 T290 146', 'none', C.sky, 16)}${P('M196 146 Q214 128 230 146 T262 146 T290 146', 'none', 'white', 7)}</g></g>`;
    css += `.sc-${id} .pst { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform 1s ease-out .6s; } .on1 .sc-${id} .pst { transform: none; }`;
    body += at(1, 'pop', tag(160, 72, '치약', ROLE.s, 20), 1.2);
    // 칸 2: 크게 키워 보면 여러 가지 알갱이
    const ZX = 450, ZY = 172, ZR = 122;
    body += at(2, 'fin', `<circle cx="258" cy="146" r="14" fill="none" stroke="${C.purple}" stroke-width="3"/>` + P(`M270 138 L${ZX - ZR + 10} ${ZY - 50} M270 154 L${ZX - ZR + 12} ${ZY + 52}`, 'none', C.purple, 2.5, ' stroke-dasharray="6 6"') + `<circle cx="${ZX}" cy="${ZY}" r="${ZR}" fill="white" stroke="${C.purple}" stroke-width="4"/>`, 0.1);
    const KIND = [
      ['sa', (x, y) => `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" rx="2" fill="white" stroke="${C.blue}" stroke-width="3"/>`, [[400, 110], [500, 200], [430, 240]]],
      ['k1', (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`, [[460, 90], [380, 180], [520, 136]]],
      ['k2', (x, y) => `<path d="M${x} ${y - 12} L${x + 12} ${y + 9} H${x - 12} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`, [[440, 160], [530, 250], [400, 260]]],
      ['k3', (x, y) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`, [[490, 160], [470, 280], [360, 130]]]
    ];
    KIND.forEach(([cls, draw, pts], k) => { body += `<g class="${cls}">` + pts.map(([x, y], i) => at(2, 'pop', draw(x, y), 0.5 + k * 0.2 + i * 0.1)).join('') + '</g>'; });
    // 칸 3: 그 가운데 하나는 소금
    css += ['k1', 'k2', 'k3'].map((c) => `.sc-${id} .${c} { transition: opacity .6s ease .3s; } .on3 .sc-${id} .${c} { opacity: .25; } .on4 .sc-${id} .${c} { opacity: 1; }`).join('');
    body += KIND[0][2].map(([x, y], i) => ring(x, y, 16, C.blue, 3, 0.4 + i * 0.15)).join('');
    body += `<g class="b3 h4">` + at(3, 'pop', salt(140, 262, 0.75), 0.6) + at(3, 'pop', tag(140, 326, '소금', ROLE.s, 20), 0.9) + drawArrow(186, 258, 410, 236, C.blue, 3, { width: 3.5, delay: 1.1 }) + '</g>';
    // 칸 4: 여러 가지가 모여 치약을 이룬다
    body += KIND.map(([, draw], k) => at(4, 'pop', draw(60 + k * 56, 284), 0.2 + k * 0.15)).join('') + at(4, 'fin', braceUp(40, 248, 262, C.green), 0.8)
      + ring(ZX, ZY, ZR, C.purple, 4, 0.2) + at(4, 'pop', tag(146, 236, '성분', ROLE.y, 22), 1.0);
    put(K + '4/성분', svg(id, body, css));
  })();

  // ── 6단원: 소화(음식이 입 → 목 → 배 속으로, 소화액이 잘게 부수고 녹여 몸 구석구석에 쓰인다) ──────────────────────────────
  (function () {
    const id = 't31-k3-sohwa';
    let css = base(id);
    const torso = `<circle cx="320" cy="62" r="38" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M304 98 V116 H336 V98" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="M226 150 Q226 116 266 116 H374 Q414 116 414 150 V318 Q414 340 390 340 H250 Q226 340 226 318 Z" fill="white" stroke="${C.orange}" stroke-width="3"/>`;
    const gut = P('M320 82 V160', 'none', C.orange, 8) + `<path d="M318 160 Q356 150 368 176 Q378 210 338 214 Q300 216 296 190 Q294 168 318 160 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + P('M332 214 Q346 236 314 240 Q280 244 290 262 Q300 280 336 272 Q366 266 356 290 Q346 310 316 304', 'none', C.orange, 8);
    let body = at(1, 'fin', torso + gut, 0.1);
    body += at(1, 'pop', P('M306 76 Q320 88 334 76', 'none', C.ink, 3), 0.1);
    // 칸 1: 밥 한 덩이가 입에서 배 속으로
    body += `<g class="b1 h3"><g class="fo"><circle cx="332" cy="188" r="15" fill="white" stroke="${C.muted}" stroke-width="3"/><circle cx="328" cy="184" r="3" fill="${C.muted}"/></g></g>`;
    css += `@keyframes ${id}-eat { 0% { transform: translate(-162px, -110px); } 40%, 55% { transform: translate(-12px, -114px); } 100% { transform: none; } } .on1 .sc-${id} .fo { animation: ${id}-eat 1.8s ease-in-out .4s both; }`;
    body += at(1, 'pop', `<path d="M120 86 H220 Q216 118 170 120 Q124 118 120 86 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`, 0.1) + at(1, 'pop', tag(170, 150, '밥', ROLE.g, 20), 0.3);
    body += at(1, 'pop', tag(470, 62, '입', ROLE.g, 18), 0.5) + at(1, 'pop', tag(470, 130, '목', ROLE.g, 18), 0.7) + at(1, 'pop', tag(470, 188, '배 속', ROLE.g, 18), 1.6)
      + `<g class="b1">${P('M436 62 H350 M440 130 H330 M436 188 H372', 'none', C.line, 2.5, ' stroke-dasharray="4 5"')}</g>`;
    // 칸 2: 소화액이 나와 잘게 부수고 녹인다
    body += `<g class="b2">` + [[304, 172], [356, 170], [330, 204]].map(([x, y], k) => `<g class="lq" style="animation-delay:${0.2 + k * 0.25}s">${drip(x, y, 0.8, C.green)}</g>`).join('') + '</g>';
    css += `.sc-${id} .lq { opacity: 0; } @keyframes ${id}-lq { 0% { opacity: 0; transform: translateY(-14px); } 50% { opacity: 1; } 100% { opacity: 1; transform: none; } } .on2 .sc-${id} .lq { animation: ${id}-lq .7s ease-out both; } .on3 .sc-${id} .lq { opacity: 0; transition: opacity .5s; }`;
    css += `.on2 .sc-${id} .fo { animation: ${id}-shake .5s ease-in-out .9s 2; }`;
    body += `<g class="b2 h3">` + [[324, 186], [340, 192], [330, 178], [346, 182]].map(([x, y], k) => g('pop pop2', `<circle cx="${x}" cy="${y}" r="5" fill="white" stroke="${C.muted}" stroke-width="2"/>`, 1.6 + k * 0.1)).join('') + '</g>';
    body += at(2, 'pop', tag(110, 236, '소화액', ROLE.p, 20), 0.4) + drawArrow(160, 236, 292, 200, C.green, 2, { width: 3.5, delay: 0.6 });
    body += at(2, 'pop', salt(110, 304, 0.55), 0.9) + at(2, 'fin', text(160, 312, '소금', { size: 18, color: C.blue, anchor: 'start' }), 1.0);
    // 칸 3: 아주 잘게 된 것이 몸 구석구석으로
    const OUT = [[240, 140], [400, 140], [250, 326], [390, 326], [232, 240], [408, 240]];
    OUT.forEach(([x, y], k) => {
      body += `<g class="b3"><g class="bt${k}"><circle cx="${x}" cy="${y}" r="5" fill="${C.orange}"/></g></g>`;
      css += move(id, `bt${k}`, `translate(${330 - x}px, ${280 - y}px)`, 3, { dur: 1, delay: 0.3 + k * 0.12 });
    });
    body += ring(320, 230, 96, C.orange, 3, 1.3) + at(3, 'pop', tag(530, 300, '몸 구석구석', ROLE.o, 20), 1.0);
    // 칸 4
    body += glowRect(220, 108, 200, 238, 4, C.green, 0.1, 22) + at(4, 'pop', tag(530, 240, '소화', ROLE.y, 24), 0.5);
    put(K + '6/소화', svg(id, body, css));
  })();

  // ── 6단원: 기온(바깥 공기 속 온도계 — 따뜻한 봄, 더운 여름, 추운 겨울에 빨간 기둥이 오르내린다) ──────────────────────────────
  // 3-1 교과서에는 기온 수치가 없어 눈금에 숫자를 쓰지 않는다. 기둥 높이만 서울 평년값 언저리(4월 약 13, 8월 약 26, 1월 약 −2)로 잡았다.
  (function () {
    const id = 't31-k3-gion';
    let css = base(id);
    const yOf = (t) => 230 - t * 5;
    let body = `<g class="b1">` + [96, 156, 216].map((y, k) => `<path class="ai" style="animation-delay:${0.2 + k * 0.2}s" d="M40 ${y} q20 -10 40 0 t40 0 t40 0" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('') + '</g>'
      + at(1, 'fin', text(100, 60, '공기', { size: 20, color: C.blue }), 0.2);
    css += `.sc-${id} .ai { opacity: 0; } @keyframes ${id}-air { 0% { opacity: 0; transform: translateX(-12px); } 50% { opacity: 1; } 100% { opacity: .8; transform: translateX(10px); } } .on1 .sc-${id} .ai { animation: ${id}-air 1.4s ease-out both; }`;
    let th = `<rect x="292" y="62" width="32" height="210" rx="16" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    for (let t = 0; t <= 30; t += 10) th += P(`M324 ${yOf(t)} H340`, 'none', C.ink, 2.5);
    for (let t = 5; t <= 25; t += 10) th += P(`M324 ${yOf(t)} H333`, 'none', C.ink, 2);
    body += at(1, 'pop', th, 0.1);
    body += `<g class="b1"><g class="col"><rect x="301" y="80" width="14" height="190" fill="${C.red}"/></g></g>` + at(1, 'pop', `<circle cx="308" cy="290" r="24" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>`, 0.1);
    const sc = (t) => f((270 - yOf(t)) / 190);
    css += `.sc-${id} .col { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(${sc(0)}); transition: transform 1.2s ease-in-out .4s; }
      .on1 .sc-${id} .col { transform: scaleY(${sc(13)}); } .on2 .sc-${id} .col { transform: scaleY(${sc(26)}); } .on3 .sc-${id} .col { transform: scaleY(${sc(-2)}); }`;
    // 계절과 기온
    body += `<g class="h2">` + at(1, 'pop', tag(520, 200, '봄 따뜻함', ROLE.p, 22), 1.4) + at(1, 'pop', P('M520 122 V160', 'none', C.green, 4) + `<circle cx="520" cy="112" r="12" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M520 150 q-16 -2 -18 -14 q14 -2 18 14 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`, 1.2) + '</g>';
    const sun = `<circle cx="520" cy="112" r="24" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(520 + c * 32)} ${f(112 + s * 32)} L${f(520 + c * 42)} ${f(112 + s * 42)}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }).join('');
    body += `<g class="h3">` + at(2, 'pop', sun, 0.2) + at(2, 'pop', tag(520, 200, '여름 더움', ROLE.r, 22), 1.4) + '</g>';
    const flake = (x, y) => `<g transform="translate(${x} ${y})">${[0, 60, 120].map((a) => `<path d="M0 -11 V11" transform="rotate(${a})" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`;
    body += `<g class="b3">` + [[480, 0], [520, 0.4], [560, 0.2], [500, 0.7], [545, 0.9]].map(([x, d], k) => `<g class="fl" style="animation-delay:${d}s">${flake(x, 80 + (k % 2) * 30)}</g>`).join('') + '</g>';
    css += `.sc-${id} .fl { opacity: 0; } @keyframes ${id}-snow { 0% { opacity: 0; transform: none; } 20% { opacity: 1; } 100% { opacity: 1; transform: translateY(40px); } } .on3 .sc-${id} .fl { animation: ${id}-snow 1.4s ease-in both; }`;
    body += at(3, 'pop', tag(520, 200, '겨울 추움', ROLE.s, 22), 1.3) + at(3, 'fin', `<rect x="440" y="250" width="160" height="22" rx="11" fill="white" stroke="${C.line}" stroke-width="3"/>`, 1.0);
    // 칸 4
    body += glowRect(282, 52, 52, 270, 4, C.red, 0.1, 22) + at(4, 'pop', tag(140, 300, '기온', ROLE.y, 24), 0.5) + drawArrow(186, 296, 276, 272, C.orange, 4, { width: 3.5, delay: 0.7 });
    put(K + '6/기온', svg(id, body, css));
  })();

  // ── 6단원: 기사·감상문·보고서(오른쪽 세 글을 견주며, 왼쪽에 고른 글의 짜임을 크게) ──────────────────────────────
  const thumb = {
    기사: (x, y) => `<rect x="${x - 30}" y="${y - 42}" width="60" height="84" rx="5" fill="white" stroke="${C.line}" stroke-width="2.5"/><rect x="${x - 24}" y="${y - 36}" width="48" height="7" fill="${C.ink}"/><rect x="${x - 24}" y="${y - 22}" width="22" height="20" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/>`
      + [y - 20, y - 12, y - 4].map((yy) => `<rect x="${x + 2}" y="${yy}" width="22" height="3" fill="${GRAY}"/>`).join('') + [y + 8, y + 16, y + 24, y + 32].map((yy) => `<rect x="${x - 24}" y="${yy}" width="48" height="3" fill="${GRAY}"/>`).join(''),
    감상문: (x, y) => `<rect x="${x - 30}" y="${y - 42}" width="60" height="84" rx="5" fill="white" stroke="${C.line}" stroke-width="2.5"/><rect x="${x - 14}" y="${y - 34}" width="28" height="20" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="1.5"/>`
      + `<path d="M${x} ${y + 30} q-14 -10 -10 -18 q5 -6 10 1 q5 -7 10 -1 q4 8 -10 18 Z" fill="${C.red}"/>` + [y - 4, y + 4].map((yy) => `<rect x="${x - 24}" y="${yy}" width="48" height="3" fill="${GRAY}"/>`).join(''),
    보고서: (x, y) => `<rect x="${x - 30}" y="${y - 42}" width="60" height="84" rx="5" fill="white" stroke="${C.line}" stroke-width="2.5"/>`
      + [y - 30, y - 16, y - 2].map((yy) => `<circle cx="${x - 20}" cy="${yy}" r="3.5" fill="${C.blue}"/><rect x="${x - 12}" y="${yy - 1.5}" width="36" height="3" fill="${GRAY}"/>`).join('')
      + `<rect x="${x - 24}" y="${y + 10}" width="48" height="24" fill="none" stroke="${C.blue}" stroke-width="1.5"/><path d="M${x - 24} ${y + 22} H${x + 24} M${x - 8} ${y + 10} V${y + 34} M${x + 8} ${y + 10} V${y + 34}" stroke="${C.blue}" stroke-width="1.5"/>`
  };
  const DOCS = ['기사', '감상문', '보고서'];
  const docScene = (focus) => {
    const name = DOCS[focus];
    const id = ['t31-k3-gisa', 't31-k3-gamsangmun', 't31-k3-bogoseo'][focus];
    let css = base(id);
    let body = at(1, 'fin', card(20, 14, 396, 332), 0.1);
    // 오른쪽: 세 글 견주기
    DOCS.forEach((d, k) => {
      const y = 66 + k * 114;
      body += `<g class="${k === focus ? '' : 'dim dim4'}">` + at(1, 'pop', thumb[d](476, y), 0.3 + k * 0.15) + at(1, 'pop', `<g class="tn${k}">${tag(570, y, d, k === focus ? ROLE.s : ROLE.g, 20)}</g>`, 0.4 + k * 0.15) + '</g>';
    });
    body += glowRect(436, 66 + focus * 114 - 50, 192, 100, 4, C.orange, 0.1, 14);
    css += paint(id, `.tn${focus}`, ROLE.y, 4, 0.3) + pulseCss(id, `.tn${focus} .tl`, 4, 0.5);
    const T = (x, y, s, o = {}) => text(x, y, s, { size: 18, anchor: 'start', weight: 600, ...o });
    const bars = (x, y0, ws, n, d, gap = 22) => ws.map((w, i) => `<g class="b${n}"><g class="g${n}${i}${Math.round(y0)}">${bar(x, y0 + i * gap, w, GRAY, 9)}</g></g>`).join('');
    const grows = (x, y0, ws, n, d, gap = 22) => ws.map((_, i) => growAt(id, `g${n}${i}${Math.round(y0)}`, n, d + i * 0.15)).join('');
    if (focus === 0) {
      // 교과서 266~267쪽 차례: 신문 이름·날짜 → 큰 제목 → 작은 제목 → 글 → 사진 → 글 → '강○○ 기자'
      body += at(1, 'slide', T(44, 46, '○○신문') + T(392, 46, '20○○년 ○○월 ○○일', { anchor: 'end', color: C.muted, weight: 500 }) + P('M40 58 H396', 'none', C.ink, 4), 0.4)
        + at(1, 'pop', text(218, 94, '로봇과 함께하는 미래', { size: 26 }), 0.8);
      body += `<g class="b2"><g class="sub">${bar(88, 116, 260, C.muted, 11)}</g></g>` + bars(44, 136, [352, 340, 300], 2, 0, 18);
      css += growAt(id, 'sub', 2, 0.1) + grows(44, 136, [352, 340, 300], 2, 0.4, 18);
      body += at(2, 'pop', `<rect x="150" y="190" width="136" height="68" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/><rect x="201" y="197" width="34" height="23" rx="6" fill="white" stroke="${C.blue}" stroke-width="2.5"/><rect x="197" y="223" width="42" height="29" rx="6" fill="white" stroke="${C.blue}" stroke-width="2.5"/><circle cx="211" cy="208" r="3" fill="${C.blue}"/><circle cx="225" cy="208" r="3" fill="${C.blue}"/>`, 1.0)
        + at(2, 'pop', tag(350, 224, '사진', ROLE.s, 18), 1.3) + bars(44, 272, [300], 2, 0)
        + at(2, 'pop', T(392, 300, '강○○ 기자', { anchor: 'end' }), 1.9);
      css += grows(44, 272, [300], 2, 1.5);
      const r = row(['지난 10일', '○○시', '가게가 문을 엶'], { y: 326, size: 18, gap: 8, cx: 218 });
      body += r.map((p, i) => at(3, 'pop', tile(p.cx, p.y, p.label, { size: 18, w: p.w, h: 34, rx: 17, fill: C.peach, stroke: C.orange, sw: 2.5 }), 0.3 + i * 0.4)).join('');
      body += at(3, 'fin', `<rect x="38" y="127" width="364" height="36" rx="6" fill="${C.yellow}" opacity=".4"/>`, 0.1);
    } else if (focus === 1) {
      body += at(1, 'pop', text(218, 62, '「마음 쓰기」를 읽고', { size: 24 }) + P('M100 76 H336', 'none', C.ink, 2.5), 0.4);
      body += at(2, 'pop', tag(110, 112, '감동적인 부분', ROLE.s, 18), 0.1) + bars(44, 142, [340, 300], 2, 0) + at(2, 'pop', tag(118, 200, '그렇게 느낀 까닭', ROLE.s, 18), 0.8) + bars(44, 230, [340, 280], 2, 0);
      css += grows(44, 142, [340, 300], 2, 0.4) + grows(44, 230, [340, 280], 2, 1.1);
      const heart = (x, y, s = 1) => `<path d="M${x} ${y + 12 * s} q-20 -14 -14 -26 q7 -9 14 1 q7 -10 14 -1 q6 12 -14 26 Z" fill="${C.red}" transform="translate(0 0)"/>`;
      body += [[372, 112], [384, 200]].map(([x, y], k) => at(3, 'pop', heart(x, y), 0.3 + k * 0.3)).join('');
      body += [[0, 142], [1, 164], [0, 230], [1, 252]].map(([, y], k) => at(3, 'fin', `<rect x="44" y="${y - 4.5}" width="${[340, 300, 340, 280][k]}" height="9" rx="4.5" fill="${C.orange}" opacity=".55"/>`, 0.5 + k * 0.15)).join('');
      body += at(3, 'pop', tag(218, 306, '생각과 느낌', ROLE.o, 20), 1.2);
    } else {
      body += at(1, 'pop', text(218, 58, '실험 보고서', { size: 24 }) + P('M150 72 H286', 'none', C.ink, 2.5), 0.4)
        + at(1, 'slide', T(44, 106, '날짜: 20○○년 ○○월 ○○일') + T(44, 136, '장소: 과학실'), 0.8);
      body += at(2, 'slide', T(52, 178, '1. 알아본 것'), 0.2) + bars(176, 172, [210], 2, 0) + at(2, 'slide', T(52, 212, '2. 한 방법'), 0.6) + bars(176, 206, [190], 2, 0);
      css += grows(176, 172, [210], 2, 0.4) + grows(176, 206, [190], 2, 0.8);
      body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M36 166 V214" stroke="${C.blue}" stroke-width="4" stroke-linecap="round" style="transition-delay:1s"/></g>`;
      body += at(3, 'slide', T(52, 252, '3. 결과'), 0.2) + at(3, 'pop', `<rect x="176" y="230" width="210" height="44" fill="white" stroke="${C.blue}" stroke-width="2.5"/><path d="M176 252 H386 M246 230 V274 M316 230 V274" stroke="${C.blue}" stroke-width="2"/>`, 0.4)
        + at(3, 'slide', T(52, 312, '알게 된 점'), 0.8) + bars(176, 306, [210], 3, 0);
      css += grows(176, 306, [210], 3, 1.0);
      body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M36 218 V300" stroke="${C.blue}" stroke-width="4" stroke-linecap="round" style="transition-delay:.2s"/></g>` + at(3, 'fin', head(36, 306, Math.PI / 2, C.blue, 4), 1.1);
    }
    body += glowRect(16, 10, 404, 340, 4, C.green, 0.1, 18);
    put(K + '6/' + name, svg(id, body, css));
  };
  docScene(0);
  docScene(1);
  docScene(2);
})(typeof window !== 'undefined' ? window : globalThis);
