// 국어 3-1 낱말 도식(첫째 묶음: 독서 단원 표지·책등·출판사·짐작,
// 1단원 감각적 표현·행·연·돌림 노래·비교·강조·한나절, 매체 단원 매체·저작권·출처·게시판·익명·줄임말).
// 도구(tile·tag·row·base·move 따위)는 figures/4-1/kor.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
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
    tile(cx, cy, label, { size, h: 34, rx: 17, fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
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
  const dashed = (x1, y1, x2, y2, color = C.muted, w = 3) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${w}" stroke-dasharray="7 6" fill="none" stroke-linecap="round"/>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  // 아래로 여는 묶음 괄호(가로): x1~x2, 위 끝 y
  const braceBottom = (x1, x2, y, color = C.orange, w = 3.5) => {
    const m = (x1 + x2) / 2;
    return `<path d="M${x1} ${y} Q${x1} ${y + 12} ${x1 + 14} ${y + 12} H${m - 12} Q${m} ${y + 12} ${m} ${y + 24} Q${m} ${y + 12} ${m + 12} ${y + 12} H${x2 - 14} Q${x2} ${y + 12} ${x2} ${y}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };

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
    @keyframes ${id}-slideL { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
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
    .on${n} .sc-${id} .slideL${n} { animation: ${id}-slideL .55s ease-out both; }
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
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  // 칸 n 에서 늘어나며 나타나기(scaleX·scaleY), origin 은 fill-box 기준
  const growCss = (id, sel, n, { axis = 'X', origin = 'left center', delay = 0, dur = 0.7 } = {}) => `
    .sc-${id} ${sel} { transform-box: fill-box; transform-origin: ${origin}; transform: scale${axis}(0); transition: transform ${dur}s ease-out ${delay}s; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;
  // 칸 n 에서 흰 덮개가 왼쪽부터 걷히며 글자가 한 자씩 찍히듯 보인다(steps)
  const typeCover = (id, cls, x, y, w, h, n, { delay = 0.3, steps: st = 6, dur = 1.1, fill = 'white' } = {}) => ({
    body: `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/></g>`,
    css: `.sc-${id} .${cls} { transform-box: fill-box; transform-origin: right center; transition: transform ${dur}s steps(${st}) ${delay}s; }
      .on${n} .sc-${id} .${cls} { transform: scaleX(0); }`
  });

  const K = '3-1/국어/';
  const TAN = '#fdf3d3', GRAY = '#b5c4be';
  const bar = (x, y, w, color = GRAY, h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${f(y - r - 14 * r / 18)}" r="${r}" fill="${color}"/><path d="M${f(x - r * 1.6)} ${f(y + r * 1.5)} Q${f(x - r * 1.6)} ${y} ${x} ${y} Q${f(x + r * 1.6)} ${y} ${f(x + r * 1.6)} ${f(y + r * 1.5)} Z" fill="${color}"/>`;
  const eye = (x, y, color = C.blue) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`;
  // 번호 동그라미
  const badge = (x, y, n, color = C.green) => `<circle cx="${x}" cy="${y}" r="15" fill="${color}" stroke="white" stroke-width="2.5"/>` + text(x, y + 7, n, { size: 19, color: 'white' });
  const sparkle = (x, y, s = 1, col = C.yellow) => `<path d="M${x} ${f(y - 12 * s)} L${f(x + 3.5 * s)} ${f(y - 3.5 * s)} L${f(x + 12 * s)} ${y} L${f(x + 3.5 * s)} ${f(y + 3.5 * s)} L${x} ${f(y + 12 * s)} L${f(x - 3.5 * s)} ${f(y + 3.5 * s)} L${f(x - 12 * s)} ${y} L${f(x - 3.5 * s)} ${f(y - 3.5 * s)} Z" fill="${col}" stroke="${C.orange}" stroke-width="1.5" stroke-linejoin="round"/>`;
  // 하트: 가운데 (x, y), 배율 s(1 이면 폭 84, 높이 67)
  const heartD = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `M${P(0, 30)} C${P(-40, 2)} ${P(-42, -28)} ${P(-21, -37)} C${P(-9, -42)} ${P(0, -34)} ${P(0, -25)} C${P(0, -34)} ${P(9, -42)} ${P(21, -37)} C${P(42, -28)} ${P(40, 2)} ${P(0, 30)} Z`;
  };
  const sun = (x, y, r = 15, col = C.orange) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${C.yellow}" stroke="${col}" stroke-width="2.5"/>`
    + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(c * (r + 5))} ${f(s * (r + 5))} L${f(c * (r + 11))} ${f(s * (r + 11))}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`; }).join('') + '</g>';
  const moon = (x, y, r = 22) => `<path d="M${x + 6} ${y - r} A${r} ${r} 0 0 0 ${x + 6} ${y + r} A${f(r * 1.25)} ${f(r * 1.25)} 0 0 1 ${x + 6} ${y - r} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
  // 돋보기: (x, y) 는 렌즈 가운데
  const lens = (x, y, r, color = C.blue, fill = 'none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${color}" stroke-width="${f(r * 0.28)}"/><path d="M${f(x + r * 0.72)} ${f(y + r * 0.72)} L${f(x + r * 1.6)} ${f(y + r * 1.6)}" stroke="${color}" stroke-width="${f(r * 0.4)}" stroke-linecap="round"/>`;
  // 인터넷 창: 맨 위 띠(점 셋, addr 가 있으면 주소 칸)
  const browser = (x, y, w, h, { barH = 32, addr = null, dots = true } = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>`
    + `<path d="M${x + 1.5} ${y + barH} V${y + 12} Q${x + 1.5} ${y + 1.5} ${x + 12} ${y + 1.5} H${x + w - 12} Q${x + w - 1.5} ${y + 1.5} ${x + w - 1.5} ${y + 12} V${y + barH} Z" fill="${C.sky}"/>`
    + `<path d="M${x} ${y + barH} H${x + w}" stroke="${C.ink}" stroke-width="2.5"/>`
    + (dots ? [0, 1, 2].map((i) => `<circle cx="${x + 18 + i * 15}" cy="${y + barH / 2}" r="5" fill="${[C.red, C.yellow, C.green][i]}"/>`).join('') : '')
    + (addr ? `<rect x="${addr[0]}" y="${y + 7}" width="${addr[1]}" height="${barH - 14}" rx="${(barH - 14) / 2}" fill="white" stroke="${C.line}" stroke-width="2"/>` : '');
  // 검색 칸: 둥근 네모 칸과 오른쪽 돋보기 단추(.btn)
  const searchBox = (x, y, w, h) => {
    const r = h / 2 - 5, bx = x + w - h / 2, by = y + h / 2;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="white" stroke="${C.blue}" stroke-width="3"/>`
      + `<g class="btn"><circle cx="${bx}" cy="${by}" r="${r}" fill="${C.blue}"/>${lens(bx - r * 0.18, by - r * 0.18, r * 0.42, 'white')}</g>`;
  };
  // 앞부분(stem)과 끝부분(end)의 바탕색이 갈린 낱말 조각
  const twoTone = (cx, cy, stem, end, { size = 28, h = 56, cls = '' } = {}) => {
    const label = stem + end, w = wOf(label, size), x0 = cx - tw(label, size) / 2, sw = tw(stem, size);
    return `<g class="${cls}"><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + `<rect class="hs" x="${f(x0 - 5)}" y="${f(cy - h / 2 + 8)}" width="${f(sw + 6)}" height="${h - 16}" rx="7" fill="${C.mint}"/>`
      + `<rect class="he" x="${f(x0 + sw + 2)}" y="${f(cy - h / 2 + 8)}" width="${f(tw(end, size) + 4)}" height="${h - 16}" rx="7" fill="${C.peach}"/>`
      + text(f(cx), f(cy + size * 0.36), label, { size }) + '</g>';
  };


  // 위로 여는 묶음 괄호(가로): x1~x2, 아래 끝 y
  const braceTop = (x1, x2, y, color = C.purple, w = 3.5) => {
    const m = (x1 + x2) / 2;
    return `<path d="M${x1} ${y} Q${x1} ${y - 12} ${x1 + 14} ${y - 12} H${m - 12} Q${m} ${y - 12} ${m} ${y - 24} Q${m} ${y - 12} ${m + 12} ${y - 12} H${x2 - 14} Q${x2} ${y - 12} ${x2} ${y}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
  // 세로 글자(책등 제목): 글자마다 아래로, 띄어쓰기는 반 칸
  const vtext = (x, y0, label, { size = 20, color = 'white', step = 24 } = {}) => {
    let y = y0, s = '';
    for (const ch of label) { if (ch === ' ') { y += step / 3; continue; } s += text(x, y, ch, { size, color }); y += step; }
    return s;
  };
  // 작은 그림들
  const book = (x, y, { w = 52, h = 68, fill = C.mint, stroke = C.green } = {}) =>
    `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
    + `<rect x="${f(x - w / 2 + 1.5)}" y="${f(y - h / 2 + 1.5)}" width="7" height="${h - 3}" fill="${stroke}" opacity=".55"/>`
    + bar(x - w / 2 + 14, y - h / 2 + 16, w - 22, 'white', 7)
    + `<circle cx="${f(x + 3)}" cy="${f(y + h / 2 - 12)}" r="5" fill="${C.purple}"/>`;
  const bird = (x, y, s = 1, color = C.blue) =>
    `<ellipse cx="${x}" cy="${y}" rx="${f(11 * s)}" ry="${f(8.5 * s)}" fill="${color}"/><circle cx="${f(x + 10 * s)}" cy="${f(y - 8 * s)}" r="${f(6 * s)}" fill="${color}"/>`
    + `<path d="M${f(x + 15 * s)} ${f(y - 10 * s)} L${f(x + 22 * s)} ${f(y - 7 * s)} L${f(x + 15 * s)} ${f(y - 4.5 * s)} Z" fill="${C.orange}"/>`
    + `<path d="M${f(x - 10 * s)} ${f(y - 2 * s)} L${f(x - 20 * s)} ${f(y - 8 * s)} L${f(x - 17 * s)} ${f(y + 3 * s)} Z" fill="${color}"/>`
    + `<circle cx="${f(x + 11.5 * s)}" cy="${f(y - 9.5 * s)}" r="${f(1.6 * s)}" fill="white"/>`;
  const nest = (x, y, s = 1) => `<path d="M${f(x - 18 * s)} ${y} Q${x} ${f(y + 18 * s)} ${f(x + 18 * s)} ${y} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<path d="M${f(x - 12 * s)} ${f(y + 4 * s)} H${f(x + 12 * s)} M${f(x - 7 * s)} ${f(y + 9 * s)} H${f(x + 7 * s)}" stroke="${C.orange}" stroke-width="2" stroke-linecap="round"/>`;
  const flower = (x, y, col = C.purple, fill = C.lilac) => [0, 72, 144, 216, 288].map((a) => {
    const r = a * Math.PI / 180;
    return `<circle cx="${f(x + 10 * Math.sin(r))}" cy="${f(y - 10 * Math.cos(r))}" r="8" fill="${fill}" stroke="${col}" stroke-width="2"/>`;
  }).join('') + `<circle cx="${x}" cy="${y}" r="6.5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;
  const candy = (x, y) => `<path d="M${x - 13} ${y} L${x - 25} ${y - 9} L${x - 25} ${y + 9} Z M${x + 13} ${y} L${x + 25} ${y - 9} L${x + 25} ${y + 9} Z" fill="${C.peach}" stroke="${C.red}" stroke-width="2" stroke-linejoin="round"/>`
    + `<circle cx="${x}" cy="${y}" r="13" fill="${C.red}"/><path d="M${x - 7} ${y - 7} Q${x} ${y} ${x + 7} ${y + 7}" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const bee = (x, y) => `<ellipse cx="${x - 4}" cy="${y - 12}" rx="8" ry="11" fill="white" stroke="${C.blue}" stroke-width="2" transform="rotate(-25 ${x - 4} ${y - 12})"/><ellipse cx="${x + 5}" cy="${y - 12}" rx="8" ry="11" fill="white" stroke="${C.blue}" stroke-width="2" transform="rotate(25 ${x + 5} ${y - 12})"/>`
    + `<ellipse cx="${x}" cy="${y}" rx="15" ry="11" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x - 4} ${y - 10} V${y + 10} M${x + 4} ${y - 10} V${y + 10}" stroke="${C.ink}" stroke-width="3.5"/>`;
  const bowl = (x, y, s = 1) => `<path d="M${f(x - 30 * s)} ${f(y - 6 * s)} Q${f(x - 26 * s)} ${f(y - 22 * s)} ${f(x - 12 * s)} ${f(y - 14 * s)} Q${f(x - 4 * s)} ${f(y - 26 * s)} ${f(x + 6 * s)} ${f(y - 14 * s)} Q${f(x + 16 * s)} ${f(y - 24 * s)} ${f(x + 26 * s)} ${f(y - 8 * s)}" stroke="${C.yellow}" stroke-width="${f(4 * s)}" fill="none" stroke-linecap="round"/>`
    + `<path d="M${f(x + 6 * s)} ${f(y - 8 * s)} L${f(x + 30 * s)} ${f(y - 40 * s)} M${f(x + 14 * s)} ${f(y - 6 * s)} L${f(x + 38 * s)} ${f(y - 36 * s)}" stroke="${C.orange}" stroke-width="${f(3 * s)}" stroke-linecap="round"/>`
    + `<path d="M${f(x - 34 * s)} ${f(y - 6 * s)} H${f(x + 34 * s)} Q${f(x + 32 * s)} ${f(y + 24 * s)} ${x} ${f(y + 24 * s)} Q${f(x - 32 * s)} ${f(y + 24 * s)} ${f(x - 34 * s)} ${f(y - 6 * s)} Z" fill="white" stroke="${C.blue}" stroke-width="${f(3 * s)}" stroke-linejoin="round"/>`
    + `<path d="M${f(x - 24 * s)} ${f(y + 6 * s)} H${f(x + 24 * s)}" stroke="${C.sky}" stroke-width="${f(4 * s)}" stroke-linecap="round"/>`;
  const qmark = (x, y, color = C.purple, r = 17) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${color}" stroke-width="3"/>` + text(x, y + r * 0.45, '?', { size: Math.round(r * 1.35), color, weight: 800 });

  // ── 독서 단원: 표지(『둥지는 아늑해』 — 종이 묶음을 두꺼운 겉종이가 싸고, 앞표지에 제목·글쓴이·그린 이·출판사·그림, 뒤표지에 흙 둥지) ──────────────────────────────
  (function () {
    const id = 't31-k1-pyoji';
    let css = base(id);
    const FX = 70, FY = 56, FW = 180, FH = 244, BX = 390;
    // 칸 1: 속종이 묶음 위로 두꺼운 겉종이가 내려와 싼다
    let body = at(1, 'fin', `<rect x="${FX + 12}" y="${FY + 6}" width="${FW}" height="${FH - 12}" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<path d="M${FX + FW + 3} ${FY + 10} V${FY + FH - 10} M${FX + FW + 7} ${FY + 10} V${FY + FH - 10}" stroke="${C.line}" stroke-width="2"/>`, 0.1);
    const front = `<rect x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`
      + text(FX + FW / 2, FY + 52, '둥지는 아늑해', { size: 22, color: C.green })
      + `<rect x="${FX + 20}" y="${FY + 66}" width="140" height="110" rx="6" fill="${C.sky}"/>`
      + `<rect x="${FX + 20}" y="${FY + 160}" width="140" height="16" fill="${C.mint}"/>`
      + `<rect x="${FX + 80}" y="${FY + 112}" width="13" height="56" fill="${C.orange}"/><path d="M${FX + 90} ${FY + 140} L${FX + 140} ${FY + 128}" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/>`
      + `<circle cx="${FX + 64}" cy="${FY + 104}" r="22" fill="${C.green}"/><circle cx="${FX + 88}" cy="${FY + 92}" r="24" fill="${C.green}"/><circle cx="${FX + 82}" cy="${FY + 118}" r="18" fill="${C.green}"/>`
      + nest(FX + 136, FY + 126, 0.9) + bird(FX + 134, FY + 112, 0.85)
      + bar(FX + 40, FY + 196, 100, C.muted, 9) + bar(FX + 50, FY + 214, 80, GRAY, 9)
      + `<circle cx="${FX + 58}" cy="${FY + 230}" r="8" fill="${C.purple}"/>` + bar(FX + 72, FY + 230, 56, C.purple, 8);
    body += at(1, 'drop', front, 0.8);
    // 칸 2: 앞표지에 있는 다섯 가지
    const T2 = [
      ['책 제목', FX + FW / 2 + 76, FY + 46, 100],
      ['표지 그림', FX + 162, FY + 121, 154],
      ['글쓴이', FX + 144, FY + 196, 206],
      ['그린 이', FX + 134, FY + 214, 250],
      ['출판사', FX + 132, FY + 230, 294]
    ];
    T2.forEach(([label, x, y, ty], i) => {
      body += `<g class="h3">${drawLine(`M${x} ${y} L314 ${ty}`, C.orange, 2, { width: 2.5, delay: 0.2 + i * 0.25 })}`
        + at(2, 'pop', tag(372, ty, label, ROLE.o, 18), 0.5 + i * 0.25) + '</g>';
    });
    // 칸 3: 책을 뒤집으면 뒤표지
    body += `<g class="h4">${curve(FX + FW / 2 + 20, FY - 8, BX + 60, FY - 8, 14, C.muted, 3, { width: 3.5 })}</g>`;
    const back = `<rect x="${BX}" y="${FY}" width="${FW}" height="${FH}" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`
      + bar(BX + 30, FY + 38, 120, C.muted, 9) + bar(BX + 46, FY + 60, 88, C.muted, 9)
      + `<rect x="${BX + 20}" y="${FY + 84}" width="140" height="126" rx="6" fill="${C.sky}"/><rect x="${BX + 20}" y="${FY + 180}" width="140" height="30" fill="${C.mint}"/>`
      + `<path d="M${BX + 48} ${FY + 136} Q${BX + 48} ${FY + 178} ${BX + 90} ${FY + 178} Q${BX + 132} ${FY + 178} ${BX + 132} ${FY + 136} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${BX + 58} ${FY + 150} q8 -5 16 0 t16 0 t16 0 t16 0 M${BX + 66} ${FY + 164} q8 -5 16 0 t16 0 t16 0" stroke="${C.orange}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      + bird(BX + 92, FY + 122, 0.9);
    body += `<g class="b3"><g class="bk">${back}</g></g>`;
    css += `.sc-${id} .bk { transform-box: fill-box; transform-origin: center; transform: scaleX(0); transition: transform .7s ease-out .9s; }
      .on3 .sc-${id} .bk { transform: none; }`;
    body += at(3, 'pop', tag(FX + FW / 2, 330, '앞표지', ROLE.p, 18), 0.4);
    body += at(3, 'pop', tag(BX + FW / 2, 330, '뒤표지', ROLE.p, 18), 1.6);
    // 칸 4: 맨 겉을 싸는 두꺼운 종이가 표지
    body += glowRect(FX - 6, FY - 6, FW + 20, FH + 12, 4, C.orange, 0.1, 10);
    body += glowRect(BX - 6, FY - 6, FW + 12, FH + 12, 4, C.orange, 0.4, 10);
    body += at(4, 'pop', tag(320, 178, '표지', ROLE.y, 22), 0.9);
    put(K + 'reading/표지', svg(id, body, css));
  })();

  // ── 독서 단원: 책등(『허허 할아버지』 겉을 펼치면 뒤표지·책등·앞표지 — 덮으면 책등만 남고, 책장에 꽂으면 책등만 보인다) ──────────────────────────────
  (function () {
    const id = 't31-k1-chaekdeung';
    let css = base(id);
    const Y0 = 64, H = 220, BX = 130, W = 160, SX = 290, SW = 44, FX = 334;
    const back = `<rect x="${BX}" y="${Y0}" width="${W}" height="${H}" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + bar(BX + 22, Y0 + 40, 116, GRAY, 9) + bar(BX + 22, Y0 + 62, 96, GRAY, 9) + bar(BX + 22, Y0 + 84, 108, GRAY, 9)
      + `<rect x="${BX + 92}" y="${Y0 + 170}" width="50" height="30" fill="white"/>`
      + [0, 4, 7, 12, 15, 19, 24, 27, 31, 36, 40].map((d, i) => `<rect x="${BX + 96 + d}" y="${Y0 + 174}" width="${i % 3 ? 2 : 3}" height="22" fill="${C.ink}"/>`).join('');
    const front = `<rect x="${FX}" y="${Y0}" width="${W}" height="${H}" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + text(FX + W / 2, Y0 + 42, '허허 할아버지', { size: 20, color: C.blue })
      + `<circle cx="${FX + W / 2}" cy="${Y0 + 116}" r="34" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="M${FX + 56} ${Y0 + 132} Q${FX + 80} ${Y0 + 178} ${FX + 104} ${Y0 + 132} Q${FX + 80} ${Y0 + 146} ${FX + 56} ${Y0 + 132} Z" fill="white" stroke="${C.muted}" stroke-width="2"/>`
      + `<path d="M${FX + 64} ${Y0 + 110} q6 -7 12 0 M${FX + 84} ${Y0 + 110} q6 -7 12 0 M${FX + 70} ${Y0 + 128} q10 8 20 0" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + `<circle cx="${FX + 50}" cy="${Y0 + 198}" r="7" fill="${C.purple}"/>` + bar(FX + 62, Y0 + 198, 50, GRAY, 8);
    const spine = `<rect x="${SX}" y="${Y0}" width="${SW}" height="${H}" fill="${C.blue}" stroke="${C.blue}" stroke-width="3"/>`
      + vtext(SX + SW / 2, Y0 + 40, '허허 할아버지') + `<circle cx="${SX + SW / 2}" cy="${Y0 + 200}" r="7" fill="white"/>`;
    // 칸 1: 겉을 펼친 모습 — 가운데 좁은 면에서 양쪽으로 펼쳐진다
    let body = at(1, 'fin', spine, 0.1);
    body += `<g class="b1"><g class="bk">${back}</g></g><g class="b1"><g class="fr">${front}</g></g>`;
    css += steps(id, 'bk', 'scaleX(0)', [[1, 'none', 0.4], [2, 'scaleX(0)', 0.3]], { box: false })
      + `.sc-${id} .bk { transform-box: fill-box; transform-origin: right center; }`
      + steps(id, 'fr', 'scaleX(0)', [[1, 'none', 0.4], [2, 'scaleX(0)', 0.3]], { box: false })
      + `.sc-${id} .fr { transform-box: fill-box; transform-origin: left center; }`;
    body += `<g class="h2">${at(1, 'pop', tag(BX + W / 2, 316, '뒤표지', ROLE.s, 18), 1.3)}${at(1, 'pop', tag(FX + W / 2, 316, '앞표지', ROLE.s, 18), 1.5)}</g>`;
    body += glowRect(SX - 5, Y0 - 5, SW + 10, H + 10, 1, C.orange, 1.8, 8);
    // 칸 2: 덮으면 앞표지와 뒤표지가 접혀 책등만 남는다
    body += glowRect(SX - 5, Y0 - 5, SW + 10, H + 10, 2, C.orange, 1.4, 8);
    // 칸 3: 책장에 꽂힌 다른 책들
    const L = [[40, C.green, 196], [32, C.orange, 176], [44, C.purple, 212], [36, C.red, 188], [42, C.yellow, 204], [34, C.muted, 180]];
    const R = [[38, C.orange, 200], [44, C.green, 184], [34, C.purple, 208], [40, C.red, 192], [36, C.yellow, 178], [42, C.muted, 196]];
    const spineOf = (x, w, col, h) => `<rect x="${x}" y="${Y0 + H - h}" width="${w}" height="${h}" rx="3" fill="${col}"/>`
      + `<rect x="${f(x + w / 2 - 3)}" y="${Y0 + H - h + 22}" width="6" height="${f(h * 0.45)}" rx="3" fill="${col === C.yellow ? C.orange : 'white'}"/>`;
    let shelf = `<rect x="44" y="${Y0 + H}" width="542" height="14" rx="3" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/>`;
    let r = SX - 2;
    L.forEach(([w, col, h], i) => { r -= w; shelf += g(`rise rise3`, spineOf(r, w, col, h), f(0.1 + i * 0.08)); r -= 2; });
    let l = SX + SW + 2;
    R.forEach(([w, col, h], i) => { shelf += g(`rise rise3`, spineOf(l, w, col, h), f(0.1 + i * 0.08)); l += w + 2; });
    body += `<g class="b3">${shelf}</g>`;
    body += `<g class="b3"><g class="mg">${lens(0, 0, 26, C.purple, 'none')}</g></g>`;
    css += `.sc-${id} .mg { transform: translate(70px, 150px); }
      @keyframes ${id}-find { from { transform: translate(70px, 150px); } to { transform: translate(${SX + SW / 2}px, 150px); } }
      .on3 .sc-${id} .mg { animation: ${id}-find 1.3s ease-in-out .7s both; }
      .on4 .sc-${id} .mg { opacity: 0; transition: opacity .4s ease; }`;
    body += glowRect(SX - 5, Y0 - 5, SW + 10, H + 10, 3, C.purple, 1.9, 8);
    // 칸 4
    body += glowRect(SX - 5, Y0 - 5, SW + 10, H + 10, 4, C.orange, 0.2, 8);
    body += at(4, 'pop', tag(SX + SW / 2, 330, '책등', ROLE.y, 22), 0.7);
    put(K + 'reading/책등', svg(id, body, css));
  })();

  // ── 독서 단원: 출판사(글쓴이의 글과 그린 이의 그림이 출판사로 모여 책이 되고, 같은 책이 여러 권 세상으로) ──────────────────────────────
  (function () {
    const id = 't31-k1-chulpansa';
    let css = base(id);
    // 칸 1: 글쓴이와 글, 그린 이와 그림
    let body = at(1, 'pop', person(70, 104, C.blue, 16) + tag(70, 150, '글쓴이', ROLE.s, 18), 0.1);
    body += at(1, 'pop', person(70, 244, C.orange, 16) + tag(70, 290, '그린 이', ROLE.o, 18), 0.4);
    const paper1 = `<rect x="112" y="62" width="56" height="68" rx="4" fill="white" stroke="${C.blue}" stroke-width="2.5"/>` + [76, 90, 104, 118].map((y, i) => bar(121, y, [38, 32, 38, 24][i], GRAY, 6)).join('');
    const paper2 = `<rect x="112" y="202" width="56" height="68" rx="4" fill="white" stroke="${C.orange}" stroke-width="2.5"/><rect x="118" y="208" width="44" height="56" fill="${C.sky}"/>`
      + `<circle cx="150" cy="220" r="6" fill="${C.yellow}"/><path d="M118 264 Q136 234 162 264 Z" fill="${C.green}"/>`;
    body += `<g class="b1"><g class="p1">${g('fin fin1', paper1, 0.7)}</g></g><g class="b1"><g class="p2">${g('fin fin1', paper2, 1.0)}</g></g>`;
    css += `@keyframes ${id}-in1 { 0% { transform: none; opacity: 1; } 85% { transform: translate(185px, 185px) scale(.3); opacity: 1; } 100% { transform: translate(185px, 185px) scale(.3); opacity: 0; } }
      @keyframes ${id}-in2 { 0% { transform: none; opacity: 1; } 85% { transform: translate(185px, 45px) scale(.3); opacity: 1; } 100% { transform: translate(185px, 45px) scale(.3); opacity: 0; } }
      .sc-${id} .p1, .sc-${id} .p2 { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .p1 { animation: ${id}-in1 1s ease-in .2s both; }
      .on2 .sc-${id} .p2 { animation: ${id}-in2 1s ease-in .5s both; }`;
    // 출판사 건물(칸 1부터)
    const bld = `<rect x="262" y="150" width="126" height="150" rx="4" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<rect x="270" y="114" width="110" height="36" rx="6" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>`
      + `<circle cx="300" cy="132" r="10" fill="${C.purple}"/>` + bar(318, 132, 48, C.purple, 8)
      + [[280, 166], [348, 166], [280, 212], [348, 212]].map(([x, y]) => `<rect x="${x}" y="${y}" width="22" height="22" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`).join('')
      + `<rect x="312" y="260" width="26" height="40" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    body += at(1, 'rise', bld, 0.6);
    // 칸 2: 글과 그림이 들어가고 책이 나온다
    body += drawArrow(344, 282, 402, 250, C.green, 2, { width: 4, delay: 1.2 });
    body += at(2, 'pop', book(440, 225), 1.5);
    // 칸 3: 같은 책이 여러 권 만들어져 퍼져 나간다
    const DEST = [[514, 136], [584, 136], [514, 252], [584, 252]];
    DEST.forEach(([x, y], i) => {
      body += `<g class="b3"><g class="cp cp${i}">${book(x, y)}</g></g>`;
      css += move(id, `cp${i}`, `translate(${440 - x}px, ${225 - y}px)`, 3, { dur: 0.8, delay: 0.2 + i * 0.25 });
    });
    body += `<g class="b3"><circle class="ring ring3" cx="300" cy="132" r="14" fill="none" stroke="${C.purple}" stroke-width="3"/><circle class="ring ring3" cx="443" cy="247" r="9" fill="none" stroke="${C.purple}" stroke-width="3"/></g>`;
    // 칸 4
    body += glowRect(255, 106, 140, 202, 4, C.orange, 0.1, 10);
    body += at(4, 'pop', tag(325, 334, '출판사', ROLE.y, 22), 0.7);
    put(K + 'reading/출판사', svg(id, body, css));
  })();

  // ── 독서 단원: 짐작(제목의 '둥지'와 표지 그림의 새 → 생각 구름에 새와 둥지, 그리고 물음표) ──────────────────────────────
  (function () {
    const id = 't31-k1-jimjak';
    let css = base(id);
    const tw0 = tw('둥지는 아늑해', 22), x0 = 130 - tw0 / 2;
    let body = at(1, 'fin', `<rect x="40" y="30" width="180" height="270" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`);
    body += at(1, 'fin', `<rect x="${f(x0 - 4)}" y="52" width="${f(tw('둥지', 22) + 8)}" height="32" rx="7" fill="${C.peach}"/>`, 0.7);
    body += at(1, 'fin', text(130, 76, '둥지는 아늑해', { size: 22, color: C.green })
      + `<rect x="58" y="100" width="144" height="150" rx="6" fill="${C.sky}"/><rect x="58" y="234" width="144" height="16" fill="${C.mint}"/>`
      + `<rect x="124" y="160" width="14" height="76" fill="${C.orange}"/><path d="M134 200 L190 188" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`
      + `<circle cx="106" cy="150" r="26" fill="${C.green}"/><circle cx="136" cy="136" r="28" fill="${C.green}"/><circle cx="128" cy="168" r="22" fill="${C.green}"/>`
      + nest(180, 188) + bird(178, 172) + `<path d="M198 163 L210 172" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round"/>`
      + bar(78, 270, 104, C.muted, 9) + bar(88, 286, 84, GRAY, 9), 0.1);
    body += glowRect(54, 96, 152, 158, 1, C.orange, 1.2, 8);
    // 칸 2: 단서 둘이 이어져 생각이 떠오른다
    body += drawArrow(222, 70, 334, 104, C.orange, 2, { width: 4, delay: 0.1 });
    body += drawArrow(210, 178, 330, 164, C.orange, 2, { width: 4, delay: 0.3 });
    const cloudD = 'M352 206 Q318 206 322 176 Q316 144 350 136 Q350 98 392 96 Q410 64 452 72 Q484 50 514 78 Q556 74 562 110 Q596 122 590 160 Q594 206 552 206 Z';
    body += at(2, 'pop', `<path d="${cloudD}" fill="white" stroke="${C.purple}" stroke-width="3" stroke-dasharray="9 6" stroke-linejoin="round"/>`
      + bird(396, 148, 1.5) + nest(474, 160, 1.8), 1.0);
    body += `<g class="b2"><g class="qm">${g('pop pop2', text(546, 160, '?', { size: 48, color: C.purple, weight: 800 }), 1.6)}</g></g>`;
    // 칸 3: 책을 펼쳐 읽으며 맞는지 살핀다
    const pages = `<path d="M470 262 Q440 250 400 256 V314 Q440 308 470 320 Z M470 262 Q500 250 540 256 V314 Q500 308 470 320 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`
      + [270, 282, 294].map((y) => `<path d="M412 ${y} Q436 ${y - 4} 458 ${y + 2} M482 ${y + 2} Q504 ${y - 4} 528 ${y}" stroke="${GRAY}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
    body += `<g class="h4">${at(3, 'rise', pages, 0.1)}<g class="b3">${g('fin fin3', dashed(470, 248, 470, 214, C.purple, 3), 0.6)}</g></g>`;
    css += pulseCss(id, '.qm', 3, 0.9);
    // 칸 4
    body += at(4, 'fin', `<path class="flash flash4" d="${cloudD}" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linejoin="round"/>`, 0.1);
    body += at(4, 'pop', tag(456, 272, '짐작', ROLE.y, 22), 0.6);
    put(K + 'reading/짐작', svg(id, body, css));
  })();

  // ── 1단원: 감각적 표현(눈·귀·코·혀·손 다섯 감각 — 시의 말이 저마다 맞는 감각으로 날아가 붙는다) ──────────────────────────────
  (function () {
    const id = 't31-k1-gamgak';
    let css = base(id);
    const X = [72, 196, 320, 444, 568], IY = 66;
    const icons = [
      (x, y) => eye(x, y, C.blue),
      (x, y) => `<path d="M${x - 4} ${y + 26} C${x - 16} ${y + 26} ${x - 14} ${y + 10} ${x - 10} ${y + 2} C${x - 18} ${y - 12} ${x - 12} ${y - 28} ${x + 4} ${y - 28} C${x + 18} ${y - 28} ${x + 22} ${y - 12} ${x + 16} ${y - 2} C${x + 12} ${y + 6} ${x + 4} ${y + 8} ${x + 4} ${y + 18} C${x + 4} ${y + 24} ${x} ${y + 26} ${x - 4} ${y + 26} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/>`
        + `<path d="M${x - 3} ${y - 6} C${x - 6} ${y - 18} ${x + 10} ${y - 20} ${x + 9} ${y - 8} C${x + 8} ${y} ${x + 2} ${y} ${x + 2} ${y + 8}" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      (x, y) => `<path d="M${x} ${y - 26} C${x - 3} ${y - 10} ${x - 10} ${y + 2} ${x - 16} ${y + 10} C${x - 20} ${y + 18} ${x - 10} ${y + 22} ${x - 5} ${y + 17} C${x - 2} ${y + 21} ${x + 2} ${y + 21} ${x + 5} ${y + 17} C${x + 10} ${y + 22} ${x + 20} ${y + 18} ${x + 16} ${y + 10} C${x + 10} ${y + 2} ${x + 3} ${y - 10} ${x} ${y - 26} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/>`
        + `<ellipse cx="${x - 7}" cy="${y + 13}" rx="3.5" ry="2.2" fill="${C.green}"/><ellipse cx="${x + 7}" cy="${y + 13}" rx="3.5" ry="2.2" fill="${C.green}"/>`,
      (x, y) => `<path d="M${x - 26} ${y - 2} Q${x - 12} ${y - 16} ${x} ${y - 7} Q${x + 12} ${y - 16} ${x + 26} ${y - 2} Q${x} ${y + 26} ${x - 26} ${y - 2} Z" fill="${C.peach}" stroke="${C.red}" stroke-width="3.5" stroke-linejoin="round"/>`
        + `<path d="M${x - 20} ${y - 1} Q${x} ${y + 4} ${x + 20} ${y - 1}" stroke="${C.red}" stroke-width="2.5" fill="none"/><path d="M${x - 10} ${y + 4} Q${x} ${y + 20} ${x + 10} ${y + 4} Z" fill="${C.red}"/>`,
      (x, y) => [[-15, -22], [-6.5, -27], [2, -26], [10.5, -20]].map(([dx, top]) => `<rect x="${x + dx}" y="${y + top}" width="8" height="${30 - top * 0.2}" rx="4" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`).join('')
        + `<rect x="${x + 12}" y="${y + 2}" width="9" height="22" rx="4.5" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" transform="rotate(-40 ${x + 16} ${y + 14})"/>`
        + `<rect x="${x - 16}" y="${y - 4}" width="32" height="30" rx="10" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`
    ];
    const SENSE = [['보다', ROLE.s], ['듣다', ROLE.o], ['냄새 맡다', ROLE.p], ['맛보다', [C.peach, C.red]], ['만지다', ROLE.x]];
    let body = '';
    X.forEach((x, i) => {
      body += at(1, 'pop', `<g class="ic ic${i}"><circle cx="${x}" cy="${IY}" r="38" fill="white" stroke="${C.line}" stroke-width="3"/>${icons[i](x, IY)}</g>`, 0.1 + i * 0.3);
      body += at(1, 'rise', tag(x, 128, SENSE[i][0], SENSE[i][1], 18), 0.3 + i * 0.3);
    });
    // 칸 2·3: 시의 말이 아래에 나타났다가 맞는 감각 밑으로 올라간다
    const WORDS = [
      // [칸, 낱말, 감각, 처음 x, 끝 y]
      [2, '봉긋봉긋', 0, 250, 196], [2, '푸하하하', 1, 370, 196], [2, '간질간질', 4, 490, 196],
      [3, '초록빛 향기', 2, 274, 196], [3, '뻐뻐 뻐꾸룻', 1, 424, 246]
    ];
    WORDS.forEach(([n, w, s, sx, ty], i) => {
      const [fill, stroke] = SENSE[s][1];
      body += `<g class="b${n}"><g class="wd wd${i}">${g(`pop pop${n}`, tile(X[s], ty, w, { size: 19, h: 40, fill, stroke, sw: 2.5 }), 0.3 + (i % 3) * 0.2)}</g></g>`;
      css += move(id, `wd${i}`, `translate(${sx - X[s]}px, ${318 - ty}px)`, n, { dur: 0.9, delay: 1.0 + (i % 3) * 0.2 });
      css += pulseCss(id, `.ic${s}`, n, 1.9);
    });
    body += `<g class="h3">${at(2, 'pop', tag(102, 318, '웃음 참는 나무', ROLE.g, 18), 0.1)}</g>`;
    body += `<g class="h4">${at(3, 'pop', tag(102, 318, '오늘부터는', ROLE.g, 18), 0.1)}</g>`;
    // 칸 4
    css += [0, 1, 2, 3, 4].map((i) => pulseCss(id, `.wd${i} .tl`, 4, 0.1 + i * 0.15)).join('');
    body += at(4, 'pop', tag(320, 318, '감각적 표현', ROLE.y, 22), 0.9);
    put(K + '1/감각적 표현', svg(id, body, css));
  })();

  // ── 1단원: 행(「줄넘기」 여덟 줄, 두 줄씩 네 연(42쪽) — 첫째 줄이 1행, 줄마다 2행 … 8행) ──────────────────────────────
  (function () {
    const id = 't31-k1-haeng';
    let css = base(id);
    const CX0 = 140, CW = 280, LX = 168;
    // 교과서 시처럼 두 줄마다 빈 줄을 둔다(연은 띠 색이 번갈아 바뀐다)
    const Y = (i) => 96 + i * 26 + Math.floor(i / 2) * 14;
    const ODD = (i) => Math.floor(i / 2) % 2 === 1;
    // [흉내 내는 말, 줄 앞(0)/뒤(1), 나머지 줄 길이]
    const LINES = [['빙글빙글', 0, 96], ['사뿐사뿐', 0, 96], ['폴짝폴짝', 1, 92], ['조심조심', 1, 92], ['빙글빙글', 0, 88], ['빙글빙글', 0, 76], ['살짝살짝', 0, 96], ['사뿐사뿐', 0, 88]];
    const WW = tw('빙글빙글', 19);
    let body = at(1, 'fin', `<rect x="${CX0}" y="26" width="${CW}" height="316" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + tile(CX0 + CW / 2, 54, '줄넘기', { size: 20, h: 38, fill: TAN, stroke: C.orange }));
    LINES.forEach(([w, pos, bw], i) => {
      const y = Y(i);
      body += `<g class="b2"><rect class="bd bd${i}" x="${LX - 12}" y="${y - 13}" width="${pos ? bw + WW + 34 : WW + bw + 34}" height="26" rx="8" fill="${ODD(i) ? C.sky : C.peach}"/></g>`;
      const line = pos
        ? bar(LX, y, bw, GRAY, 9) + text(LX + bw + 10, y + 7, w, { size: 19, anchor: 'start', color: C.ink })
        : text(LX, y + 7, w, { size: 19, anchor: 'start', color: C.ink }) + bar(LX + WW + 10, y, bw, GRAY, 9);
      body += at(1, 'slide', line, f(0.3 + i * 0.15));
    });
    css += `.sc-${id} .bd { opacity: 0; transition: opacity .4s ease; } .on2 .sc-${id} .bd0 { opacity: 1; }`
      + [1, 2, 3, 4, 5, 6, 7].map((i) => `.on3 .sc-${id} .bd${i} { opacity: 1; transition-delay: ${f(0.2 + i * 0.22)}s; }`).join('');
    body += `<g class="h4">${at(1, 'pop', tile(556, 196, '8줄', { size: 26, h: 52 }), 1.7)}</g>`;
    // 칸 2: 첫째 줄이 1행
    body += at(2, 'pop', badge(116, Y(0), 1, C.orange), 0.3);
    body += at(2, 'pop', tag(486, Y(0), '1행', ROLE.o, 20), 0.6);
    // 칸 3: 줄마다 차례로 번호
    for (let i = 1; i < 8; i++) body += at(3, 'pop', badge(116, Y(i), i + 1, ODD(i) ? C.blue : C.orange), f(0.2 + i * 0.22));
    body += at(3, 'pop', tag(486, Y(7), '8행', ROLE.s, 20), 1.9);
    // 칸 4: 한 줄 한 줄이 차례로 반짝인다
    css += [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `@keyframes ${id}-blink${i} { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
      .on4 .sc-${id} .bd${i} { animation: ${id}-blink${i} .5s ease-in-out ${f(0.1 + i * 0.18)}s 2; }`).join('');
    body += at(4, 'pop', tag(556, 196, '행', ROLE.y, 24), 1.2);
    put(K + '1/행', svg(id, body, css));
  })();

  // ── 1단원: 연(「웃음 참는 나무」 열한 줄 — 빈 줄로 나뉜 네 덩어리, 2연에 '푸푸푸', 4연에 '푸하하하') ──────────────────────────────
  (function () {
    const id = 't31-k1-yeon';
    let css = base(id);
    const CNT = [3, 3, 2, 3], CH = [8, 9, 12, 4, 3, 8, 9, 9, 6, 4, 9], LX = 104;
    const lines = [];
    CNT.forEach((c, k) => { for (let j = 0; j < c; j++) lines.push([k, j]); });
    const Y = (i) => 60 + i * 20 + lines[i][0] * 22;
    let body = at(1, 'fin', `<rect x="80" y="30" width="250" height="314" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(1, 'pop', tag(480, 48, '웃음 참는 나무', [TAN, C.orange], 20), 0.1);
    // 칸 2에 깔리는 연 바탕
    const blocks = [];
    let i0 = 0;
    CNT.forEach((c, k) => { blocks.push([Y(i0) - 12, Y(i0 + c - 1) + 12]); i0 += c; });
    blocks.forEach(([y1, y2], k) => { body += at(2, 'fin', `<rect x="${LX - 12}" y="${y1}" width="160" height="${y2 - y1}" rx="9" fill="${k % 2 ? C.sky : C.mint}"/>`, 0.2 + k * 0.3); });
    lines.forEach((_, i) => {
      body += `<g class="b1"><rect class="gr gr${i}" x="${LX}" y="${Y(i) - 4}" width="${CH[i] * 12}" height="8" rx="4" fill="${GRAY}"/></g>`;
      css += `.sc-${id} .gr${i} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .3s ease-out ${f(0.3 + i * 0.1)}s; }
        .on1 .sc-${id} .gr${i} { transform: none; }`;
    });
    // 칸 1: 빈 줄 자리
    [0, 1, 2].map((k) => (blocks[k][1] + blocks[k + 1][0]) / 2).forEach((gy, k) => {
      body += `<g class="h2"><g class="b1"><path class="flash flash1" style="animation-delay:${f(1.6 + k * 0.15)}s" d="M${LX} ${gy} H${LX + 140}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/></g></g>`;
    });
    body += `<g class="h3">${at(1, 'pop', tile(480, 112, '11줄', { size: 26, h: 52 }), 1.5)}</g>`;
    // 칸 2: 덩어리마다 1연 … 4연
    blocks.forEach(([y1, y2], k) => {
      const m = (y1 + y2) / 2;
      body += at(2, 'pop', `<path d="M258 ${y1 + 4} H266 V${y2 - 4} H258" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<g class="yt yt${k}">${tag(302, m, `${k + 1}연`, ROLE.p, 18)}</g>`, 0.3 + k * 0.3);
    });
    // 칸 3: 2연과 4연에 담긴 소리
    const m1 = (blocks[1][0] + blocks[1][1]) / 2, m3 = (blocks[3][0] + blocks[3][1]) / 2;
    body += glowRect(LX - 16, blocks[1][0] - 4, 178, blocks[1][1] - blocks[1][0] + 8, 3, C.orange, 0.1, 10);
    body += glowRect(LX - 16, blocks[3][0] - 4, 178, blocks[3][1] - blocks[3][0] + 8, 3, C.orange, 0.8, 10);
    body += `<g class="b3">${g('fin fin3', dashed(336, m1, 414, m1, C.orange, 3), 0.4)}${g('fin fin3', dashed(336, m3, 414, m3, C.orange, 3), 1.1)}</g>`;
    body += at(3, 'pop', tile(470, m1, '푸푸푸', { size: 22, h: 46, fill: C.peach, stroke: C.orange }), 0.5);
    body += at(3, 'pop', tile(480, m3, '푸하하하', { size: 22, h: 46, fill: C.peach, stroke: C.orange }), 1.2);
    // 칸 4
    css += [0, 1, 2, 3].map((k) => pulseCss(id, `.yt${k} .tl`, 4, 0.1 + k * 0.25)).join('');
    body += at(4, 'pop', tag(480, 226, '연', ROLE.y, 24), 1.2);
    put(K + '1/연', svg(id, body, css));
  })();

  // ── 1단원: 돌림 노래(친구 셋이 같은 가락을 한 마디씩 늦게 시작 — 같은 때에 서로 다른 행) ──────────────────────────────
  (function () {
    const id = 't31-k1-dollim';
    let css = base(id);
    const LY = [92, 172, 252], X0 = 104, BW = 74, ST = 78;
    const PC = [C.blue, C.orange, C.green];
    const COL = [ROLE.s, ROLE.o, ROLE.p, ROLE.x];
    let body = '';
    LY.forEach((y, p) => {
      body += at(1, 'pop', person(54, y + 14, PC[p], 13), 0.1 + p * 0.2);
      body += at(1, 'fin', dashed(X0 - 6, y + 30, 600, y + 30, C.line, 2.5), 0.4 + p * 0.2);
    });
    body += drawArrow(X0, 306, 594, 306, C.muted, 1, { width: 3.5, delay: 0.9 });
    body += at(1, 'pop', tag(560, 334, '시간', ROLE.g, 18), 1.6);
    // 칸 2·3: 블록이 왼쪽부터 자라며 생긴다
    LY.forEach((y, p) => {
      const n = p === 0 ? 2 : 3;
      for (let j = 0; j < 4; j++) {
        const x = X0 + (p + j) * ST, dly = p === 0 ? 0.2 + j * 0.4 : 0.1 + (p - 1) * 0.35 + j * 0.3;
        body += `<g class="b${n}"><g class="bl bl${p}${j}">${tile(x + BW / 2, y, `${j + 1}행`, { size: 18, w: BW, h: 42, rx: 9, fill: COL[j][0], stroke: COL[j][1], sw: 2.5 })}</g></g>`;
        css += growCss(id, `.bl${p}${j}`, n, { delay: f(dly), dur: 0.35 });
      }
    });
    // 칸 3: 같은 때에 세 사람이 부르는 행
    body += `<g class="h4">${glowRect(X0 + 2 * ST - 5, 60, BW + 10, 222, 3, C.red, 1.6, 10)}</g>`;
    // 칸 4: 1행이 대각선으로 뒤쫓아 간다
    css += [0, 1, 2].map((p) => pulseCss(id, `.bl${p}0 .tl`, 4, 0.2 + p * 0.35)).join('');
    body += `<g class="b4">${[0, 1].map((p) => g('fin fin4', `<path d="M${X0 + p * ST + BW / 2 + 12} ${LY[p] + 20} L${X0 + (p + 1) * ST + BW / 2 - 8} ${LY[p + 1] - 18}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="6 6"/>`, 0.5 + p * 0.35)).join('')}</g>`;
    body += at(4, 'pop', tag(320, 334, '돌림 노래', ROLE.y, 22), 1.2);
    put(K + '1/돌림 노래', svg(id, body, css));
  })();

  // ── 1단원: 비교(꽃 사이를 돌아다니는 꿀벌 ↔ 사탕을 담으려고 돌아다니던 나 — 같은 점과 다른 점) ──────────────────────────────
  (function () {
    const id = 't31-k1-bigyo';
    let css = base(id);
    const STOP = [[40, 140], [130, 60], [220, 140]];
    const pathAt = (ox, oy) => `M${ox + 40} ${oy + 140} C${ox + 60} ${oy + 70} ${ox + 100} ${oy + 50} ${ox + 130} ${oy + 60} C${ox + 160} ${oy + 70} ${ox + 200} ${oy + 90} ${ox + 220} ${oy + 140}`;
    const panel = (ox, col) => `<rect x="${ox}" y="24" width="260" height="182" rx="12" fill="white" stroke="${col}" stroke-width="3"/>`;
    // 칸 1: 꿀벌
    let body = at(1, 'fin', panel(20, C.orange) + STOP.map(([x, y]) => flower(20 + x, 24 + y)).join(''));
    body += at(1, 'pop', tag(66, 50, '꿀벌', ROLE.o, 18), 0.2);
    body += drawLine(pathAt(20, 24), C.orange, 1, { width: 3, delay: 0.5, cls: 'tr' });
    body += `<g class="b1"><g class="mv1">${bee(0, 0)}</g></g>`;
    const kf = (ox, name) => `@keyframes ${id}-${name} { 0% { transform: translate(${ox + 40}px, ${24 + 140 - 26}px); } 50% { transform: translate(${ox + 130}px, ${24 + 60 - 26}px); } 100% { transform: translate(${ox + 220}px, ${24 + 140 - 26}px); } }`;
    css += kf(20, 'fly') + `.sc-${id} .mv1 { transform: translate(60px, 138px); } .on1 .sc-${id} .mv1 { animation: ${id}-fly 1.6s ease-in-out .5s both; }
      .sc-${id} .tr { stroke-dasharray: 1; } .sc-${id} .draw.tr { transition-duration: 1.6s; }`;
    // 칸 2: 사탕을 담으러 돌아다니던 나
    body += at(2, 'fin', panel(360, C.blue) + STOP.map(([x, y]) => candy(360 + x, 24 + y)).join(''));
    body += at(2, 'pop', tag(406, 50, '지혜', ROLE.s, 18), 0.2);
    body += drawLine(pathAt(360, 24), C.blue, 2, { width: 3, delay: 0.5, cls: 'tr' });
    body += `<g class="b2"><g class="mv2">${person(0, 6, C.blue, 11)}</g></g>`;
    css += kf(360, 'walk') + `.sc-${id} .mv2 { transform: translate(400px, 138px); } .on2 .sc-${id} .mv2 { animation: ${id}-walk 1.6s ease-in-out .5s both; }`;
    // 칸 3: 같은 점(돌아다니는 모양) · 다른 점(꿀과 사탕)
    const sx = 0.62, bx = 180 - 130 * sx, by = 300 - 140 * sx;
    const small = (col, n, dl, wd) => `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="${pathAt(0, 0)}" transform="translate(${f(bx)} ${f(by)}) scale(${sx})" stroke="${col}" stroke-width="${f(wd / sx)}" fill="none" stroke-linecap="round" style="transition-delay:${dl}s"/></g>`;
    body += small(C.orange, 3, 0.2, 9) + small(C.blue, 3, 0.9, 3.5);
    body += at(3, 'pop', tag(180, 326, '같은 점', ROLE.p, 18), 1.7);
    body += at(3, 'pop', flower(410, 270) + text(470, 282, '≠', { size: 34, color: C.red }) + candy(530, 270), 0.5);
    body += at(3, 'pop', tag(470, 326, '다른 점', ROLE.r, 18), 1.0);
    // 칸 4
    body += glowRect(14, 18, 272, 194, 4, C.orange, 0.1, 14) + glowRect(354, 18, 272, 194, 4, C.blue, 0.1, 14);
    body += at(4, 'pop', tag(320, 115, '비교', ROLE.y, 22), 0.7);
    put(K + '1/비교', svg(id, body, css));
  })();

  // ── 1단원: 강조(「줄넘기」 첫째 행 — '빙글빙글'만 크고 힘 있게, 소리 막대가 높이 솟는다) ──────────────────────────────
  (function () {
    const id = 't31-k1-gangjo';
    let css = base(id);
    const P = row(['빙글빙글', '줄이', '돌면'], { y: 140, cx: 340, gap: 30, size: 30 });
    let body = at(1, 'pop', person(50, 160, C.blue, 16), 0.1);
    body += at(1, 'fin', `<path d="M76 118 q10 10 0 20 M86 110 q16 18 0 36" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`, 0.3);
    P.forEach((p, i) => {
      body += `<g class="b1"><g class="tk tk${i}">${g('pop pop1', T(p, { h: 60 }), 0.3 + i * 0.3)}</g></g>`;
      // 소리 막대 다섯 칸
      for (let k = 0; k < 5; k++) {
        const y = 290 - k * 16;
        body += at(1, 'fin', `<rect x="${f(p.cx - 16)}" y="${y - 6}" width="32" height="12" rx="3" fill="${C.line}"/>`, 0.3 + i * 0.3);
        const on = k < 2 ? 1 : (i === 0 ? 3 : 0);
        if (on) body += `<g class="b${on}">${g(`fin fin${on}`, `<rect x="${f(p.cx - 16)}" y="${y - 6}" width="32" height="12" rx="3" fill="${k < 2 ? C.green : C.orange}"/>`, on === 1 ? 0.5 + i * 0.3 + k * 0.1 : 0.6 + k * 0.18)}</g>`;
      }
    });
    // 칸 2: '빙글빙글'을 골라 색칠
    css += paint(id, '.tk0', [C.peach, C.orange], 2, 0.3);
    body += `<g class="b2"><rect class="ring ring2" x="${f(P[0].l - 4)}" y="106" width="${f(P[0].w + 8)}" height="68" rx="14" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    // 칸 3: 크고 힘 있게
    css += `.sc-${id} .tk0 { transform-box: fill-box; transform-origin: center; transition: transform .6s cubic-bezier(.3,1.6,.5,1) .2s; }
      .on3 .sc-${id} .tk0 { transform: scale(1.25); }
      .sc-${id} .tk1, .sc-${id} .tk2 { transition: opacity .6s ease .2s; }
      .on3 .sc-${id} .tk1, .on3 .sc-${id} .tk2 { opacity: .5; }`;
    // 칸 4
    css += pulseCss(id, '.tk0 .tl', 4, 0.2);
    body += at(4, 'pop', tag(320, 334, '강조', ROLE.y, 22), 0.6);
    put(K + '1/강조', svg(id, body, css));
  })();

  // ── 1단원: 한나절(해가 뜨고 지는 낮 — 낮의 반쯤, 또는 낮 전체) ──────────────────────────────
  (function () {
    const id = 't31-k1-hannajeol';
    let css = base(id);
    const OX = 320, OY = 220, R = 190, B0 = OX - R, B1 = OX + R, BY = 270;
    let body = at(1, 'fin', `<path d="M${B0} ${OY} A${R} ${R} 0 0 1 ${B1} ${OY}" stroke="${C.line}" stroke-width="3" stroke-dasharray="7 7" fill="none"/>`
      + `<path d="M70 ${OY} H570" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/>`
      + `<rect x="${B0}" y="${BY - 8}" width="${B1 - B0}" height="16" rx="8" fill="${C.line}"/>`);
    body += at(1, 'pop', tag(74, BY, '해 뜸', ROLE.g, 18), 0.2) + at(1, 'pop', tag(566, BY, '해 짐', ROLE.g, 18), 2.0);
    body += `<g class="b1"><rect class="dayf" x="${B0}" y="${BY - 8}" width="${B1 - B0}" height="16" rx="8" fill="${C.yellow}"/></g>`;
    css += growCss(id, '.dayf', 1, { delay: 0.3, dur: 1.8 }).replace('ease-out', 'linear');
    body += `<g class="b1"><g class="sw">${sun(B0, OY, 18)}</g></g>`;
    css += `.sc-${id} .sw { transform-origin: ${OX}px ${OY}px; }
      @keyframes ${id}-all { from { transform: rotate(0deg); } to { transform: rotate(180deg); } }
      @keyframes ${id}-half { from { transform: rotate(0deg); } to { transform: rotate(90deg); } }
      .on1 .sc-${id} .sw { animation: ${id}-all 1.8s linear .3s both; }
      .on2 .sc-${id} .sw { animation: ${id}-half 1.2s linear .2s both; }
      .on3 .sc-${id} .sw { animation: ${id}-all 1.6s linear .2s both; }`;
    body += `<g class="h3">${at(1, 'pop', tag(OX, 186, '낮', [C.yellow, C.orange], 20), 1.4)}</g>`;
    // 칸 2: 낮의 반쯤
    body += `<g class="b2"><rect class="halff" x="${B0}" y="${BY - 8}" width="${R}" height="16" rx="8" fill="${C.orange}"/></g>`;
    css += growCss(id, '.halff', 2, { delay: 0.2, dur: 1.2 }).replace('ease-out', 'linear');
    body += at(2, 'fin', braceBottom(B0, OX, BY + 14, C.orange), 1.3) + at(2, 'pop', tag((B0 + OX) / 2, 330, '한나절', ROLE.o, 20), 1.5);
    // 칸 3: 낮 전체
    body += at(3, 'fin', braceTop(B0, B1, BY - 14, C.purple), 1.7) + at(3, 'pop', tag(OX, 186, '한나절', ROLE.x, 20), 1.9);
    // 칸 4
    body += `<g class="b4"><rect class="flash flash4" x="${B0 - 4}" y="${BY - 12}" width="${R + 8}" height="24" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    body += `<g class="b4"><rect class="flash flash4" style="animation-delay:1.2s" x="${B0 - 8}" y="${BY - 16}" width="${2 * R + 16}" height="32" rx="16" fill="none" stroke="${C.purple}" stroke-width="4"/></g>`;
    put(K + '1/한나절', svg(id, body, css));
  })();

  // ── 매체 단원: 매체(생각이나 정보를 책·신문·라디오·텔레비전·휴대 전화·컴퓨터에 담아 다른 사람에게) ──────────────────────────────
  (function () {
    const id = 't31-k1-maeche';
    let css = base(id);
    const card = (x, y) => `<rect x="${x - 30}" y="${y - 22}" width="60" height="44" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<circle cx="${x - 13}" cy="${y - 4}" r="8" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/><rect x="${x - 16}" y="${y + 4}" width="6" height="6" fill="${C.orange}"/>`
      + bar(x + 1, y - 8, 20, C.orange, 5) + bar(x + 1, y + 2, 16, C.orange, 5) + bar(x - 20, y + 14, 36, C.orange, 5);
    const ICON = [
      (x, y) => `<path d="M${x} ${y - 14} Q${x - 16} ${y - 22} ${x - 32} ${y - 16} V${y + 18} Q${x - 16} ${y + 12} ${x} ${y + 20} Q${x + 16} ${y + 12} ${x + 32} ${y + 18} V${y - 16} Q${x + 16} ${y - 22} ${x} ${y - 14} Z M${x} ${y - 14} V${y + 20}" fill="white" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`
        + `<path d="M${x - 24} ${y - 6} H${x - 8} M${x - 24} ${y + 4} H${x - 8} M${x + 8} ${y - 6} H${x + 24} M${x + 8} ${y + 4} H${x + 24}" stroke="${GRAY}" stroke-width="3" stroke-linecap="round"/>`,
      (x, y) => `<rect x="${x - 30}" y="${y - 24}" width="60" height="48" rx="3" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${x - 24}" y="${y - 18}" width="48" height="9" fill="${C.ink}"/>`
        + `<rect x="${x - 24}" y="${y - 4}" width="20" height="18" fill="${C.sky}"/>` + bar(x + 2, y - 2, 22, GRAY, 5) + bar(x + 2, y + 6, 22, GRAY, 5) + bar(x + 2, y + 14, 16, GRAY, 5),
      (x, y) => `<path d="M${x - 14} ${y - 18} L${x + 14} ${y - 34}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><rect x="${x - 32}" y="${y - 18}" width="64" height="40" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
        + `<circle cx="${x - 12}" cy="${y + 2}" r="11" fill="white" stroke="${C.orange}" stroke-width="2.5"/><circle cx="${x - 12}" cy="${y + 2}" r="4" fill="${C.orange}"/><path d="M${x + 8} ${y - 6} H${x + 24} M${x + 8} ${y + 2} H${x + 24} M${x + 8} ${y + 10} H${x + 24}" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>`,
      (x, y) => `<rect x="${x - 32}" y="${y - 24}" width="64" height="42" rx="5" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${x - 26}" y="${y - 18}" width="52" height="30" rx="3" fill="${C.sky}"/>`
        + `<path d="M${x - 6} ${y - 10} V${y + 4} L${x + 7} ${y - 3} Z" fill="${C.blue}"/><path d="M${x - 12} ${y + 26} H${x + 12} M${x} ${y + 18} V${y + 26}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`,
      (x, y) => `<rect x="${x - 16}" y="${y - 28}" width="32" height="56" rx="7" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${x - 11}" y="${y - 20}" width="22" height="36" rx="2" fill="${C.mint}"/>`
        + `<rect x="${x - 8}" y="${y - 15}" width="13" height="7" rx="3" fill="white"/><rect x="${x - 4}" y="${y - 4}" width="13" height="7" rx="3" fill="${C.green}"/><circle cx="${x}" cy="${y + 22}" r="2.5" fill="${C.ink}"/>`,
      (x, y) => `<rect x="${x - 30}" y="${y - 26}" width="60" height="40" rx="4" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${x - 24}" y="${y - 20}" width="48" height="28" fill="${C.lilac}"/>`
        + `<path d="M${x - 38} ${y + 24} L${x - 30} ${y + 14} H${x + 30} L${x + 38} ${y + 24} Z" fill="${C.line}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>` + bar(x - 18, y - 12, 26, C.purple, 5) + bar(x - 18, y - 2, 36, C.purple, 5)
    ];
    const POS = [[230, 100], [320, 100], [410, 100], [230, 250], [320, 250], [410, 250]];
    // 칸 1: 알리고 싶은 생각과 정보, 멀리 있는 사람
    let body = at(1, 'pop', person(70, 230, C.blue, 20), 0.1) + at(1, 'pop', person(570, 230, C.orange, 20), 0.5);
    body += `<g class="b1"><g class="cd">${g('pop pop1', card(70, 130), 0.9)}</g></g>`;
    // 칸 2: 여러 가지 매체
    POS.forEach(([x, y], i) => { body += at(2, 'pop', `<g class="mi mi${i}">${ICON[i](x, y)}</g>`, 0.2 + i * 0.2); });
    // 칸 3: 매체에 실려 상대에게 전해진다
    body += drawArrow(110, 176, 530, 176, C.orange, 3, { width: 4, delay: 0.2 });
    css += `@keyframes ${id}-go { 0% { transform: none; } 20% { transform: translate(0, 46px); } 80% { transform: translate(500px, 46px); } 100% { transform: translate(500px, 0); } }
      .on3 .sc-${id} .cd { animation: ${id}-go 2s ease-in-out .3s both; }`;
    css += POS.map(([x], i) => pulseCss(id, `.mi${i}`, 3, f(0.7 + (x - 70) / 500 * 1.2))).join('');
    // 칸 4
    body += glowRect(184, 54, 272, 236, 4, C.orange, 0.2, 18);
    body += at(4, 'pop', tag(320, 334, '매체', ROLE.y, 22), 0.8);
    put(K + 'media/매체', svg(id, body, css));
  })();

  // ── 매체 단원: 저작권(쌀국수 그림은 그린 사람의 것 — 허락 없이 가져가면 안 되고, 물어서 허락을 받으면 쓴다) ──────────────────────────────
  (function () {
    const id = 't31-k1-jeojak';
    let css = base(id);
    const art = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.sky}" stroke="${C.ink}" stroke-width="3"/>`
      + bowl(x + w / 2, y + h / 2 + 8, w / 150);
    // 칸 1: 만든 사람과 그림
    let body = at(1, 'pop', person(100, 268, C.blue, 20) + tag(100, 330, '만든 사람', ROLE.s, 18), 0.1);
    body += at(1, 'pop', art(40, 60, 150, 120), 0.5);
    body += drawLine('M100 226 V186', C.blue, 1, { width: 4, delay: 1.0 });
    // 칸 2: 쓰려는 사람이 허락 없이 가져가면
    const SL = [486, 98, 110, 74];
    body += at(2, 'pop', person(540, 268, C.orange, 20) + tag(540, 330, '쓰려는 사람', ROLE.o, 18), 0.1);
    body += at(2, 'pop', `<rect x="470" y="60" width="140" height="120" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/>` + bar(486, 76, 108, C.muted, 8)
      + `<rect x="${SL[0]}" y="${SL[1]}" width="${SL[2]}" height="${SL[3]}" rx="5" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 5"/>`, 0.3);
    body += `<g class="b2"><g class="cp">${art(SL[0], SL[1], SL[2], SL[3])}</g></g>`;
    const from = `translate(${115 - (SL[0] + SL[2] / 2)}px, ${120 - (SL[1] + SL[3] / 2)}px) scale(${f(150 / SL[2])})`;
    css += `.sc-${id} .cp { transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-take { 0% { opacity: 0; transform: ${from}; } 15% { opacity: 1; } 100% { opacity: 1; transform: none; } }
      .on2 .sc-${id} .cp { animation: ${id}-take 1s ease-in-out .7s both; }
      .on3 .sc-${id} .cp { animation: ${id}-take 1s ease-in-out 1.6s both; }`;
    body += `<g class="h3">${at(2, 'pop', cross(SL[0] + SL[2] / 2, SL[1] + SL[3] / 2, 16), 1.8)}</g>`;
    // 칸 3: 물어서 허락을 받는다
    body += curve(500, 222, 150, 222, 196, C.orange, 3, { width: 3.5 });
    body += at(3, 'pop', qmark(325, 196, C.orange, 16), 0.5);
    body += at(3, 'pop', check(190, 252, 12) + tag(250, 252, '허락', ROLE.p, 18), 1.0);
    body += at(3, 'pop', check(SL[0] + SL[2] - 4, SL[1] + 4, 10), 2.0);
    // 칸 4: 만든 사람이 가진 힘
    body += glowRect(34, 54, 162, 132, 4, C.orange, 0.1, 10);
    body += at(4, 'pop', `<circle cx="186" cy="64" r="17" fill="${C.purple}" stroke="white" stroke-width="2.5"/>` + text(186, 72, '©', { size: 22, color: 'white' }), 0.5);
    body += at(4, 'pop', tag(325, 118, '저작권', ROLE.y, 22), 0.9);
    put(K + 'media/저작권', svg(id, body, css));
  })();

  // ── 매체 단원: 출처(참고한 책의 만든 사람·자료의 이름·만든 곳을 찾아 과제 끝에 적는다) ──────────────────────────────
  (function () {
    const id = 't31-k1-chulcheo';
    let css = base(id);
    // 칸 1: 참고한 책과 과제
    let body = at(1, 'fin', `<rect x="40" y="22" width="160" height="200" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`
      + text(120, 56, '세계 음식의', { size: 20, color: C.green }) + text(120, 82, '모든 것', { size: 20, color: C.green })
      + text(120, 112, '김○○', { size: 18, color: C.ink, weight: 600 }) + bowl(120, 160, 0.8)
      + text(120, 208, '△△△출판사', { size: 18, color: C.purple, weight: 700 }));
    body += at(1, 'rise', `<rect x="440" y="22" width="170" height="200" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/>` + bar(456, 40, 110, C.muted, 9)
      + bowl(490, 86, 0.6) + bar(530, 76, 64, GRAY, 6) + bar(530, 90, 52, GRAY, 6)
      + [124, 140, 156, 172].map((y, i) => bar(456, y, [138, 124, 138, 96][i], GRAY, 6)).join(''), 0.4);
    body += `<g class="h2">${drawArrow(212, 120, 426, 120, C.green, 1, { width: 4, delay: 1.0 })}</g>`;
    // 칸 2: 책에서 세 가지를 찾는다
    const SPOT = [
      ['자료의 이름', ROLE.o, [52, 36, 136, 54], 58],
      ['만든 사람', ROLE.s, [88, 96, 64, 24], 116],
      ['만든 곳', ROLE.p, [62, 192, 116, 24], 192]
    ];
    SPOT.forEach(([label, col, [x, y, w, h], ty], i) => {
      body += `<g class="b2">${g('flash flash2', `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${col[1]}" stroke-width="3.5"/>`, 0.2 + i * 0.4)}</g>`;
      body += drawLine(`M${x + w + 4} ${y + h / 2} L250 ${ty}`, col[1], 2, { width: 2.5, delay: 0.3 + i * 0.4 });
      body += at(2, 'pop', tag(316, ty, label, col, 18), 0.6 + i * 0.4);
    });
    // 칸 3: 과제 끝에 적는 출처
    body += at(3, 'fin', `<path d="M452 204 H598" stroke="${C.orange}" stroke-width="3" stroke-dasharray="6 5"/>`
      + `<path d="M452 206 L96 262 M598 206 L558 262" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 5"/>`
      + `<rect x="24" y="262" width="534" height="58" rx="10" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`, 0.1);
    body += at(3, 'pop', `<g class="cc">${tag(62, 291, '출처', ROLE.y, 18)}</g>`, 0.4);
    const ROW = row(['김○○', '『세계 음식의 모든 것』', '△△△출판사'], { y: 291, x0: 110, gap: 10, size: 18 });
    const ORDER = [1, 0, 2];   // 줄 차례: 만든 사람, 자료의 이름, 만든 곳
    ROW.forEach((p, i) => {
      const s = SPOT[ORDER[i]];
      body += `<g class="b3"><g class="ct ct${i}">${T(p, { h: 40, fill: s[1][0], stroke: s[1][1], sw: 2.5 })}</g></g>`;
      css += move(id, `ct${i}`, `translate(${316 - p.cx}px, ${s[3] - 291}px)`, 3, { dur: 0.9, delay: 0.6 + i * 0.3 });
    });
    // 칸 4
    css += pulseCss(id, '.cc', 4, 0.2) + [0, 1, 2].map((i) => pulseCss(id, `.ct${i} .tl`, 4, 0.5 + i * 0.2)).join('');
    body += glowRect(20, 258, 542, 66, 4, C.orange, 0.2, 12);
    put(K + 'media/출처', svg(id, body, css));
  })();

  // ── 매체 단원: 게시판(네 사람이 글과 그림을 한곳에 올리고, 모두가 와서 본다) ──────────────────────────────
  (function () {
    const id = 't31-k1-gesipan';
    let css = base(id);
    const PP = [[70, 116, C.blue], [70, 266, C.green], [570, 116, C.orange], [570, 266, C.purple]];
    const SLOT = [[260, 116], [380, 116], [260, 210], [380, 210]];
    const cardOf = (i, x, y) => {
      const r = `<rect x="${x - 48}" y="${y - 34}" width="96" height="68" rx="6" fill="white" stroke="${PP[i][2]}" stroke-width="3"/>`;
      if (i === 0) return r + bowl(x, y + 4, 0.5);
      if (i === 3) return r + `<rect x="${x - 40}" y="${y - 26}" width="80" height="52" fill="${C.sky}"/><circle cx="${x + 22}" cy="${y - 12}" r="7" fill="${C.yellow}"/><path d="M${x - 40} ${y + 26} Q${x - 10} ${y - 10} ${x + 40} ${y + 26} Z" fill="${C.green}"/>`;
      return r + [-16, -4, 8, 20].map((d, k) => bar(x - 36, y + d, [72, 60, 72, 44][k], GRAY, 6)).join('');
    };
    // 칸 1: 게시판과 사람들
    let body = at(1, 'fin', `<rect x="196" y="40" width="248" height="226" rx="10" fill="${TAN}" stroke="${C.ink}" stroke-width="3.5"/><rect x="198" y="42" width="244" height="26" rx="8" fill="${C.sky}"/>`);
    PP.forEach(([x, y, col], i) => { body += at(1, 'pop', person(x, y, col, 16), 0.3 + i * 0.2); });
    // 칸 2: 저마다 글과 그림을 올린다
    PP.forEach(([x, y], i) => {
      const [sx, sy] = SLOT[i];
      body += `<g class="b1"><g class="cd cd${i}">${g('fin fin1', cardOf(i, sx, sy), 0.6 + i * 0.2)}</g></g>`;
      const ox = x < 320 ? x + 42 : x - 42;
      css += move(id, `cd${i}`, `translate(${ox - sx}px, ${y - 64 - sy}px) scale(.55)`, 2, { dur: 0.9, delay: 0.2 + i * 0.3 });
      css += `.sc-${id} .cd${i} { transform-box: fill-box; transform-origin: center; }`;
      body += at(2, 'pop', `<circle cx="${sx}" cy="${sy - 34}" r="6" fill="${C.red}" stroke="white" stroke-width="2"/>`, 1.1 + i * 0.3);
    });
    // 칸 3: 여러 사람이 와서 본다
    PP.forEach(([x, y], i) => {
      const ex = x < 320 ? x + 30 : x - 30, ey = y - 46;
      body += at(3, 'pop', `<g transform="translate(${ex} ${ey}) scale(.55)">${eye(0, 0, C.ink)}</g>`, 0.2 + i * 0.2);
      body += `<g class="b3">${g('fin fin3', dashed(x < 320 ? ex + 18 : ex - 18, ey, x < 320 ? 192 : 448, ey < 100 ? 110 : 210, C.muted, 2.5), 0.5 + i * 0.2)}</g>`;
    });
    // 칸 4
    body += glowRect(190, 34, 260, 238, 4, C.orange, 0.1, 12);
    body += at(4, 'pop', tag(320, 318, '게시판', ROLE.y, 22), 0.6);
    put(K + 'media/게시판', svg(id, body, css));
  })();

  // ── 매체 단원: 익명(댓글마다 이어져 있던 글쓴이가 가려지고, 이름 자리에 '방글방글'·'냥냥이'·'튼튼이') ──────────────────────────────
  (function () {
    const id = 't31-k1-ikmyeong';
    let css = base(id);
    const RY = [104, 178, 252], PC = [C.blue, C.orange, C.green], NICK = ['방글방글', '냥냥이', '튼튼이'];
    let body = at(1, 'fin', `<rect x="30" y="34" width="380" height="270" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="32" y="36" width="376" height="30" rx="8" fill="${C.sky}"/>`);
    RY.forEach((y, i) => {
      body += at(1, 'fin', `<circle cx="70" cy="${y}" r="20" fill="${PC[i]}"/><circle cx="70" cy="${y - 6}" r="7" fill="white"/><path d="M58 ${y + 12} Q70 ${y} 82 ${y + 12}" fill="white"/>`
        + bar(104, y - 10, 60, C.ink, 11) + bar(102, y + 12, [270, 230, 250][i], GRAY, 9), 0.2 + i * 0.2);
      body += at(1, 'pop', person(548, y + 14, PC[i], 14), 0.5 + i * 0.2);
      body += `<g class="h2">${drawLine(`M414 ${y} H520`, PC[i], 1, { width: 3.5, delay: 1.0 + i * 0.2 })}</g>`;
    });
    // 칸 2: 이름이 가려진다
    RY.forEach((y, i) => {
      body += at(2, 'pop', `<circle cx="70" cy="${y}" r="21" fill="${GRAY}"/>` + text(70, y + 9, '?', { size: 26, color: 'white', weight: 800 }), 0.3 + i * 0.2);
      body += at(2, 'slide', tag(f(98 + (wOf(NICK[i], 18) + 4) / 2), y - 10, NICK[i], ROLE.g, 18), 0.6 + i * 0.2);
    });
    body += at(2, 'fin', `<rect x="492" y="58" width="114" height="236" rx="14" fill="${C.line}"/>`, 1.2);
    body += RY.map((y, i) => `<g class="b2"><g class="qq qq${i}">${g('pop pop2', qmark(549, y, C.muted, 18), 1.4 + i * 0.15)}</g></g>`).join('');
    // 칸 3: 글은 읽히지만 누가 썼는지는 모른다
    body += RY.map((y, i) => glowRect(96, y + 5, 290, 15, 3, C.green, 0.2 + i * 0.25, 7)).join('');
    css += [0, 1, 2].map((i) => pulseCss(id, `.qq${i}`, 3, 1.0 + i * 0.2)).join('');
    // 칸 4
    body += RY.map((y, i) => glowRect(94, y - 29, wOf(NICK[i], 18) + 12, 38, 4, C.orange, 0.1 + i * 0.2, 19)).join('');
    body += at(4, 'pop', tag(220, 334, '익명', ROLE.y, 22), 0.8);
    put(K + 'media/익명', svg(id, body, css));
  })();

  // ── 매체 단원: 줄임말('열심히 공부하다' → 열공, '너의 의견이 곧 나의 의견' → '의견이'·'의견'은 빼고 앞 글자 너·곧·나 → 너곧나) ──────────────────────────────
  (function () {
    const id = 't31-k1-julim';
    let css = base(id);
    // 낱말 조각의 첫 글자 가운데 x
    const firstX = (p) => p.cx - tw(p.label, p.size) / 2 + p.size / 2;
    const chip = (x, y, ch, size, [fill, stroke]) => `<rect x="${f(x - size / 2 - 3)}" y="${f(y - size * 0.62)}" width="${size + 6}" height="${f(size * 1.24)}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>` + text(f(x), f(y + size * 0.36), ch, { size, color: C.ink });
    const R1 = row(['열심히', '공부하다'], { y: 96, x0: 40, gap: 16, size: 26 });
    const R2 = row(['너의', '의견이', '곧', '나의', '의견'], { y: 226, x0: 26, gap: 10, size: 22 });
    let body = '';
    R1.forEach((p, i) => { body += `<g class="dim dim2">${at(1, 'pop', T(p), 0.2 + i * 0.3)}</g>`; });
    // 칸 1: 첫 글자에 색 → 칸 2: 첫 글자만 오른쪽으로 모여 '열공'
    const PICK1 = [0, 1], RES1 = { cx: 540, y: 96 };
    let r1 = '';
    PICK1.forEach((k, j) => {
      const p = R1[k], x = firstX(p), tx = RES1.cx - 17 + j * 34;
      r1 += `<g class="b1"><g class="c1 c1${j}">${g('fin fin1', chip(x, p.y, p.label[0], 26, [C.peach, C.orange]), 0.9 + j * 0.3)}</g></g>`;
      css += move(id, `c1${j}`, 'none', 2, { dur: 0.9, delay: 0.4 + j * 0.2, to: `translate(${f(tx - x)}px, 0)` });
    });
    body += drawArrow(338, 96, 476, 96, C.orange, 2, { width: 4, delay: 0.2 });
    r1 += at(2, 'fin', `<rect x="${RES1.cx - 46}" y="64" width="92" height="64" rx="14" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`, 1.4);
    body += `<g class="rs1">${r1}</g>`;
    // 칸 3: 너의 의견이 곧 나의 의견 → 너곧나
    // '의견이'·'의견'은 통째로 빠진다 — 칸 3에서 빨간 줄이 그어진다
    const DROP2 = [1, 4];
    R2.forEach((p, i) => { body += `<g class="dim dim4">${at(3, 'pop', T(p, { h: 50 }), 0.1 + i * 0.15)}${DROP2.includes(i) ? drawLine(`M${f(p.l + 4)} ${p.y} L${f(p.r - 4)} ${p.y}`, C.red, 3, { width: 4, delay: 0.5 + DROP2.indexOf(i) * 0.2 }) : ''}</g>`; });
    const PICK2 = [0, 2, 3], RES2 = { cx: 560, y: 226 };
    let r2 = '';
    PICK2.forEach((k, j) => {
      const p = R2[k], x = firstX(p), tx = RES2.cx - 30 + j * 30;
      r2 += `<g class="b3"><g class="c2 c2${j}">${g('fin fin3', chip(x, p.y, p.label[0], 22, [C.sky, C.blue]), 0.6 + j * 0.1)}</g></g>`;
      css += move(id, `c2${j}`, 'none', 3, { dur: 0.8, delay: 1.0 + j * 0.1, to: `translate(${f(tx - x)}px, 0)` });
    });
    body += drawArrow(450, 226, 500, 226, C.blue, 3, { width: 4, delay: 0.8 });
    r2 += at(3, 'fin', `<rect x="${RES2.cx - 52}" y="196" width="104" height="60" rx="14" fill="none" stroke="${C.blue}" stroke-width="3.5"/>`, 1.8);
    body += `<g class="rs2">${r2}</g>`;
    // 칸 4: 두 줄임말이 부푼다(가운데를 px 로 잡는다 — 안의 글자가 CSS 로 옮겨져 있어서)
    css += `.sc-${id} .rs1 { transform-origin: ${RES1.cx}px ${RES1.y}px; } .sc-${id} .rs2 { transform-origin: ${RES2.cx}px ${RES2.y}px; }
      .on4 .sc-${id} .rs1 { animation: ${id}-pulse .7s ease-in-out .2s 2; }
      .on4 .sc-${id} .rs2 { animation: ${id}-pulse .7s ease-in-out .5s 2; }`;
    body += at(4, 'pop', tag(320, 320, '줄임말', ROLE.y, 22), 0.9);
    put(K + 'media/줄임말', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
