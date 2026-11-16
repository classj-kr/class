// 국어 7-1(중학교 1학년 1학기) 낱말 도식 둘째 묶음: 5단원 품사의 종류와 특성
// 품사·불변어·가변어·체언·용언·수식언·관계언·독립언·명사·대명사·수사·동사·형용사·관형사·부사·조사·감탄사·활용·어간·어미.
// 색 약속: 체언 파랑, 용언 주황, 수식언 초록, 관계언 보라, 독립언 회색, 가변어 빨강.
// 도구는 figures/4-1/kor.js 와 같은 것을 옮겨 왔다. 움직임은 transform·opacity·stroke-dashoffset(과 색 바꾸기)만 쓴다.
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

  const K = '7-1/국어/';
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


  // 5단원 색 약속: 체언 파랑, 용언 주황, 수식언 초록, 관계언 보라, 독립언 회색 / 불변어 흰색, 가변어 빨강
  const FN = { che: ROLE.s, yong: ROLE.o, su: ROLE.p, gw: ROLE.x, dok: ROLE.g, bul: ['white', C.ink], ga: ROLE.r };
  // 작은 둥근 조각(나무 칸): 글씨 18
  const chip = (cx, cy, label, [fill, stroke], o = {}) => tile(cx, cy, label, { size: 18, h: 28, rx: 14, fill, stroke, sw: 2.5, w: wOf(label, 18), ...o });
  // 갈래 상자: 아래쪽 상자(가운데 cx, 폭 w), 맨 위 테두리에 이름 조각, 칸 아래 이름(의미)
  const sortBox = (cx, w, label, col, { y0 = 214, y1 = 336 } = {}) =>
    `<rect x="${f(cx - w / 2)}" y="${y0}" width="${w}" height="${y1 - y0}" rx="16" fill="${col[0]}" fill-opacity=".35" stroke="${col[1]}" stroke-width="3"/>` + tag(cx, y0, label, col, 20);
  // 낱말 조각 하나를 칸 n 에 (tx, ty) 로 날려 보낸다(처음 자리 p)
  const fly = (id, cls, p, tx, ty, n, delay) => steps(id, cls, 'none', [[n, `translate(${f(tx - p.cx)}px, ${f(ty - p.y)}px)`, delay]], { box: false });

  // ── 5단원: 품사(한 문장의 낱말이 형태 → 기능 → 의미 갈래를 따라 아홉 줄에 들어간다) ──────────────────────────────
  (function () {
    const id = 't71-k5-pumsa';
    let css = base(id);
    // 문장: 와, 새 공 둘이 아주 예뻐서 나는 웃었다.
    const W = [['와', 'dok', 6], ['새', 'su', 3], ['공', 'che', 0], ['둘', 'che', 2], ['이', 'gw', 5], ['아주', 'su', 4], ['예뻐서', 'yong', 8], ['나', 'che', 1], ['는', 'gw', 5], ['웃었다', 'yong', 7]];
    const GAP = [10, 8, 8, 2, 8, 8, 8, 2, 8];
    const ws = W.map(([l]) => wOf(l, 18));
    let x = 320 - (ws.reduce((a, b) => a + b, 0) + GAP.reduce((a, b) => a + b, 0)) / 2;
    const P = W.map(([l], i) => { const p = { label: l, cx: x + ws[i] / 2, w: ws[i], y: 30, size: 18 }; x += ws[i] + (GAP[i] || 0); return p; });
    const RY = (r) => 82 + r * 31;
    const NAME = ['명사', '대명사', '수사', '관형사', '부사', '조사', '감탄사', '동사', '형용사'];
    const FUN = [['체언', 'che', 0, 2], ['수식언', 'su', 3, 4], ['관계언', 'gw', 5, 5], ['독립언', 'dok', 6, 6], ['용언', 'yong', 7, 8]];
    const FORM = [['불변어', 'bul', 0, 6], ['가변어', 'ga', 7, 8]];
    const XF = 66, XK = 194, XN = 322, XW = 446;
    const mid = (a, b) => (RY(a) + RY(b)) / 2;
    let body = '';
    // 칸 1: 문장 조각
    P.forEach((p, i) => { body += at(1, 'rise', `<g class="w${i}">${T(p, { h: 30, rx: 10 })}</g>`, 0.1 + i * 0.06); });
    // 칸 2: 형태
    FORM.forEach(([l, c, a, b], k) => { body += at(2, 'pop', chip(XF, mid(a, b), l, FN[c], { size: 19, h: 32, w: wOf(l, 19) }), 0.2 + k * 0.3); });
    body += at(2, 'fin', `<path d="M${XF} ${mid(0, 6) - 18} V${RY(0) - 8} M${XF} ${mid(0, 6) + 18} V${RY(6) + 8}" stroke="${C.ink}" stroke-width="2" stroke-dasharray="4 5"/>`, 0.5);
    W.forEach(([, c], i) => { css += paint(id, `.w${i}`, c === 'yong' ? FN.ga : FN.bul, 2, 0.6); });
    // 칸 3: 기능
    FUN.forEach(([l, c, a, b], k) => {
      const fy = c === 'yong' ? mid(7, 8) : mid(0, 6);
      body += drawLine(`M${XF + 42} ${f(fy)} H${XF + 64} V${f(mid(a, b))} H${XK - 38}`, C.muted, 3, { width: 2.5, delay: 0.1 + k * 0.15 });
      body += at(3, 'pop', chip(XK, mid(a, b), l, FN[c]), 0.5 + k * 0.15);
    });
    W.forEach(([, c], i) => { css += paint(id, `.w${i}`, FN[c], 3, 0.8); });
    // 칸 4: 의미 아홉 갈래, 낱말이 제 줄로 날아간다
    FUN.forEach(([, c, a, b], k) => {
      for (let r = a; r <= b; r++) {
        body += drawLine(`M${XK + 38} ${f(mid(a, b))} H${XK + 60} V${RY(r)} H${XN - 38}`, FN[c][1], 4, { width: 2.5, delay: 0.1 });
        body += at(4, 'pop', chip(XN, RY(r), NAME[r], FN[c]), 0.3 + r * 0.06);
      }
    });
    let jo = XW - 26;
    W.forEach(([, , r], i) => {
      let left = XW - 26;
      if (r === 5) { left = jo; jo += P[i].w + 6; }
      css += fly(id, `w${i}`, P[i], left + P[i].w / 2, RY(r), 4, f(0.5 + i * 0.05));
    });
    body += at(4, 'pop', tag(570, 196, '품사', ROLE.y, 26), 1.5);
    put(K + '5/품사', svg(id, body, css));
  })();

  const ball = (x, y, r = 15) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${f(y - r * 0.45)} L${f(x + r * 0.43)} ${f(y - r * 0.14)} L${f(x + r * 0.27)} ${f(y + r * 0.36)} L${f(x - r * 0.27)} ${f(y + r * 0.36)} L${f(x - r * 0.43)} ${f(y - r * 0.14)} Z" fill="${C.ink}"/>`;

  // 낱말 줄: gaps 는 조각 사이 틈(조사는 2)
  const sent = (labels, { y = 76, size = 26, gaps = [], cx = 320 } = {}) => {
    const ws = labels.map((l) => wOf(l, size)), gs = labels.slice(1).map((_, i) => (gaps[i] == null ? 14 : gaps[i]));
    let x = cx - (ws.reduce((a, b) => a + b, 0) + gs.reduce((a, b) => a + b, 0)) / 2;
    return labels.map((label, i) => { const p = { label, cx: x + ws[i] / 2, w: ws[i], y, size, l: x, r: x + ws[i] }; x += ws[i] + (gs[i] || 0); return p; });
  };
  // 문장 → 갈래 상자 도식(체언·용언·수식언·관계언·독립언이 같이 쓴다)
  // o: { id, key, P(낱말 자리), go: {낱말 차례: [x, 이름]}, col, box: [cx, w, 이름], extra2/extra3: {body, css} }
  const sortScene = (o) => {
    let css = base(o.id), body = '';
    o.P.forEach((p, i) => { body += at(1, 'rise', `<g class="s${i}">${T(p, { h: 52 })}</g>`, 0.1 + i * 0.08); });
    const idx = Object.keys(o.go).map(Number);
    idx.forEach((i, k) => { css += paint(o.id, `.s${i}`, o.col, 2, 0.2) + pulseCss(o.id, `.s${i}`, 2, f(0.3 + k * 0.2)); });
    if (o.extra2) { body += o.keep2 ? o.extra2.body || '' : `<g class="h3">${o.extra2.body || ''}</g>`; css += o.extra2.css || ''; }
    // 칸 3: 상자로 날아간다
    body = at(3, 'fin', sortBox(o.box[0], o.box[1], o.box[2], o.col), 0.1) + body;
    idx.forEach((i, k) => {
      const [x, name] = o.go[i];
      css += fly(o.id, `s${i}`, o.P[i], x, 270, 3, f(0.4 + k * 0.2));
      if (name) body += at(3, 'fin', text(x, 318, name, { size: 19, color: o.col[1] }), f(1.2 + k * 0.2));
    });
    if (o.extra3) { body += o.extra3.body || ''; css += o.extra3.css || ''; }
    body += glowRect(o.box[0] - o.box[1] / 2 - 6, 192, o.box[1] + 12, 150, 4, o.col[1], 0.1, 18);
    body += at(4, 'pop', tag(o.tagAt ? o.tagAt[0] : 320, o.tagAt ? o.tagAt[1] : 160, o.key, ROLE.y, 24), 0.6);
    if (o.extra4) { body += o.extra4.body || ''; css += o.extra4.css || ''; }
    put(K + '5/' + o.key, svg(o.id, body, css));
  };

  // ── 5단원: 불변어(바다 뒤 조사만 바뀌고 '바다'는 그대로, '빨리'도 어디서나 '빨리') ──────────────────────────────
  (function () {
    const id = 't71-k5-bulbyeon';
    let css = base(id);
    const ROWS = [['가', 90], ['를', 170], ['에서', 250]];
    let body = '';
    ROWS.forEach(([j, y], i) => {
      const P = sent(['바다', j], { y, cx: 0, gaps: [2], size: 28 }), dx = 150 - P[0].cx;
      body += at(i ? 2 : 1, 'drop', `<g class="st">${tile(150, y, '바다', { size: 28, h: 56, w: P[0].w })}</g>` + tile(P[1].cx + dx, y, j, { size: 28, h: 56, w: P[1].w, fill: C.lilac, stroke: C.purple }), i ? 0.2 + i * 0.3 : 0.1);
    });
    css += paint(id, '.st', ROLE.p, 2, 1.0) + pulseCss(id, '.st', 2, 1.1);
    body += at(2, 'fin', text(150, 36, '그대로', { size: 20, color: C.green }) + `<path d="M150 124 V136 M150 204 V216" stroke="${C.green}" stroke-width="3" stroke-dasharray="3 4"/>`, 1.2);
    // 칸 3: '빨리'
    [['와', 120], ['먹자', 220]].forEach(([wd, y], i) => {
      const P = sent(['빨리', wd], { y, cx: 0, size: 28 }).map((q, _, A) => ({ ...q, cx: q.cx + 390 - A[0].l }));
      body += at(3, 'rise', `<g class="bl">${T(P[0], { h: 56 })}</g>` + T(P[1], { h: 56 }), 0.2 + i * 0.4);
    });
    css += paint(id, '.bl', ROLE.p, 3, 1.0) + pulseCss(id, '.bl', 3, 1.1);
    body += at(3, 'fin', text(436, 66, '그대로', { size: 20, color: C.green }), 1.2);
    // 칸 4
    body += glowRect(98, 56, 104, 228, 4, C.green, 0.1, 14) + glowRect(384, 86, 104, 168, 4, C.green, 0.3, 14);
    body += at(4, 'pop', tag(320, 324, '불변어', ROLE.y, 24), 0.6);
    put(K + '5/불변어', svg(id, body, css));
  })();

  // ── 5단원: 가변어('자다'가 자고·자니·자서로 끝이 바뀐다) ──────────────────────────────
  (function () {
    const id = 't71-k5-gabyeon';
    let css = base(id);
    let body = at(1, 'pop', tile(320, 60, '자다', { size: 32, h: 64, w: 120, fill: 'white', stroke: C.ink }));
    const F = [['고', 180], ['니', 320], ['서', 460]];
    F.forEach(([e, x], i) => {
      body += drawLine(`M320 94 L${x} 150`, C.muted, 2, { width: 3, delay: 0.1 + i * 0.2 });
      body += at(2, 'rise', `<g class="tw">${twoTone(x, 180, '자', e, { size: 30, h: 60 })}</g>`, 0.6 + i * 0.25);
    });
    css += `.sc-${id} .hs, .sc-${id} .he { opacity: 0; transition: opacity .5s ease; } .on3 .sc-${id} .hs { opacity: 1; transition-delay: .2s; } .on3 .sc-${id} .he { opacity: 1; transition-delay: .6s; }
      .on3 .sc-${id} .he { animation: ${id}-flash 1.4s ease-in-out .7s both; }`;
    body += at(3, 'fin', text(180, 240, '바뀜', { size: 20, color: C.red }) + text(320, 240, '바뀜', { size: 20, color: C.red }) + text(460, 240, '바뀜', { size: 20, color: C.red }), 1.0);
    // 칸 4
    body += glowRect(120, 144, 400, 72, 4, C.red, 0.1, 16);
    body += at(4, 'pop', tag(320, 292, '가변어', ROLE.y, 24), 0.5);
    body += at(4, 'pop', chip(220, 334, '동사', FN.yong) + chip(420, 334, '형용사', FN.yong), 0.9);
    put(K + '5/가변어', svg(id, body, css));
  })();

  // ── 5단원: 체언(그가 공 하나를 찼다 — 몸통 낱말 셋이 명사·대명사·수사 칸으로) ──────────────────────────────
  (function () {
    const P = sent(['그', '가', '공', '하나', '를', '찼다'], { gaps: [2, 16, 16, 2, 16] });
    const css2 = paint('t71-k5-cheeon', '.s1', ROLE.x, 2, 0.8) + paint('t71-k5-cheeon', '.s4', ROLE.x, 2, 0.8);
    sortScene({ id: 't71-k5-cheeon', key: '체언', P, col: FN.che, go: { 2: [190, '명사'], 0: [320, '대명사'], 3: [450, '수사'] }, box: [320, 420, '체언'],
      extra2: { body: `<g class="h3">${at(2, 'fin', [0, 2, 3].map((i) => text(P[i].cx, 132, '몸통', { size: 19, color: C.blue })).join(''), 1.0)}</g>`, css: css2 } });
  })();

  // ── 5단원: 용언(아기가 잔다·하늘이 맑다 — 풀이하는 낱말이 끝을 바꾸고 동사·형용사 칸으로) ──────────────────────────────
  (function () {
    const id = 't71-k5-yongeon';
    const A = sent(['아기', '가', '잔다'], { gaps: [2, 14], cx: 166, size: 26 }), B = sent(['하늘', '이', '맑다'], { gaps: [2, 14], cx: 474, size: 26 });
    const P = [...A, ...B];
    const extra2 = { body: curve(A[2].cx, 104, A[0].cx, 104, 132, C.orange, 2, { width: 3, delay: 0.6 }) + curve(B[2].cx, 104, B[0].cx, 104, 132, C.orange, 2, { width: 3, delay: 0.8 })
      + at(2, 'pop', chip(A[2].cx, 30, '자고 · 자서', FN.yong) + chip(B[2].cx, 30, '맑고 · 맑아서', FN.yong), 1.4) };
    sortScene({ id, key: '용언', P, col: FN.yong, go: { 2: [250, '동사'], 5: [390, '형용사'] }, box: [320, 300, '용언'], extra2, tagAt: [320, 166] });
  })();

  // ── 5단원: 수식언(저 꽃이 정말 예쁘다 — 꾸며 주는 낱말이 관형사·부사 칸으로) ──────────────────────────────
  (function () {
    const id = 't71-k5-susik';
    const P = sent(['저', '꽃', '이', '정말', '예쁘다'], { gaps: [16, 2, 26, 16] });
    const extra2 = { body: curve(P[0].cx, 48, P[1].cx, 48, 18, C.green, 2, { width: 4, delay: 0.5 }) + curve(P[3].cx, 48, P[4].cx, 48, 18, C.green, 2, { width: 4, delay: 0.8 })
      + `<g class="h3">${at(2, 'fin', text(P[0].cx - 4, 134, '꾸밈', { size: 19, color: C.green }) + text(P[3].cx, 134, '꾸밈', { size: 19, color: C.green }), 1.3)}</g>` };
    sortScene({ id, key: '수식언', P, col: FN.su, go: { 0: [250, '관형사'], 3: [390, '부사'] }, box: [320, 300, '수식언'], extra2 });
  })();

  // ── 5단원: 관계언(언니가 동생에게 책을 주었다 — 가·에게·을이 누가·누구에게·무엇을을 알려 준다) ──────────────────────────────
  (function () {
    const id = 't71-k5-gwangye';
    const P = sent(['언니', '가', '동생', '에게', '책', '을', '주었다'], { gaps: [2, 16, 2, 16, 2, 16], size: 24 });
    const extra2 = { body: `<g class="h3">${at(2, 'fin', text(P[1].cx - 8, 132, '누가', { size: 19, color: C.purple }) + text(P[3].cx - 4, 132, '누구에게', { size: 19, color: C.purple }) + text(P[5].cx, 132, '무엇을', { size: 19, color: C.purple }), 1.0)}</g>` };
    sortScene({ id, key: '관계언', P, col: FN.gw, go: { 1: [230, ''], 3: [320, ''], 5: [410, ''] }, box: [320, 300, '관계언'], extra2,
      extra3: { body: at(3, 'fin', text(320, 318, '조사', { size: 19, color: C.purple }), 1.4) } });
  })();

  // ── 5단원: 독립언(와, 눈이 온다 — '와'는 다른 낱말과 이어지지 않고, 빠져도 문장이 그대로) ──────────────────────────────
  (function () {
    const id = 't71-k5-dongnip';
    const P = sent(['와,', '눈', '이', '온다'], { gaps: [40, 2, 16], size: 28 });
    const extra2 = { body: curve(P[1].cx, 46, P[3].cx, 46, 14, C.green, 2, { width: 4, delay: 0.4, arrowHead: false }) + `<g class="h3">${at(2, 'fin', text(P[0].cx, 134, '홀로', { size: 19, color: C.muted }), 1.0)}</g>`,
      css: `.on2 .sc-${id} .s0 > g { animation: ${id}-shake .6s ease-in-out 1s 2; }` };
    const extra3 = { body: at(3, 'pop', check(P[3].r + 34, 76, 11), 1.6) };
    const extra4 = { body: at(4, 'pop', chip(214, 270, '어머', FN.dok) + chip(426, 270, '네', FN.dok), 0.9) };
    sortScene({ id, key: '독립언', P, col: FN.dok, go: { 0: [320, '감탄사'] }, box: [320, 340, '독립언'], extra2, extra3, extra4, keep2: true });
  })();

  // ── 5단원: 명사(사과·연필·사랑 — 대상마다 이름이 붙고 이름들이 명사 상자로) ──────────────────────────────
  (function () {
    const id = 't71-k5-myeongsa';
    let css = base(id);
    const X = [160, 320, 480], L = ['사과', '연필', '사랑'];
    const apple = (x, y) => `<circle cx="${x}" cy="${y + 4}" r="30" fill="${C.red}"/><path d="M${x} ${y - 24} Q${x + 2} ${y - 36} ${x + 8} ${y - 40}" stroke="${C.ink}" stroke-width="3" fill="none"/><path d="M${x + 4} ${y - 30} Q${x + 22} ${y - 44} ${x + 30} ${y - 28} Q${x + 16} ${y - 20} ${x + 4} ${y - 30} Z" fill="${C.green}"/>`;
    const pencil = (x, y) => `<g transform="rotate(-30 ${x} ${y})"><rect x="${x - 50}" y="${y - 12}" width="78" height="24" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x + 28} ${y - 12} L${x + 52} ${y} L${x + 28} ${y + 12} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x + 44} ${y - 4} L${x + 52} ${y} L${x + 44} ${y + 4} Z" fill="${C.ink}"/><rect x="${x - 60}" y="${y - 12}" width="12" height="24" fill="${C.red}"/></g>`;
    const heart = (x, y) => `<path d="${heartD(x, y + 4, 0.8)}" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`;
    let body = at(1, 'pop', apple(X[0], 80), 0.1) + at(1, 'pop', pencil(X[1], 80), 0.3) + at(1, 'pop', heart(X[2], 80), 0.5);
    L.forEach((l, i) => {
      body += `<g class="b2"><g class="nm${i}">${g('drop drop2', tile(X[i], 158, l, { size: 26, h: 52, fill: C.sky, stroke: C.blue }), 0.2 + i * 0.3)}</g></g>`;
      css += steps(id, `nm${i}`, 'none', [[3, `translate(${(X[i] - 320) * -0.25}px, 112px)`, f(0.4 + i * 0.15)]], { box: false });
    });
    body = at(3, 'fin', sortBox(320, 420, '명사', FN.che, { y0: 230 }), 0.1) + body;
    body += `<g class="h3">${at(2, 'fin', text(X[2], 210, '눈에 안 보임', { size: 18, color: C.muted }), 1.2)}</g>`;
    body += glowRect(104, 212, 432, 132, 4, C.blue, 0.1, 18);
    body += at(4, 'pop', tag(560, 196, '명사', ROLE.y, 24), 0.6);
    put(K + '5/명사', svg(id, body, css));
  })();

  // ── 5단원: 대명사(친구 → 그, 연필 → 이것: 이름 대신 가리키는 낱말로 바뀐다) ──────────────────────────────
  (function () {
    const id = 't71-k5-daemyeong';
    let css = base(id);
    const ROW = [{ y: 96, from: '친구', to: '그', rest: ['가', '웃는다'], n: 2 }, { y: 236, from: '연필', to: '이것', rest: ['을', '줘'], n: 3 }];
    let body = at(1, 'pop', person(70, 112, C.orange, 20)) + at(1, 'pop', `<g transform="rotate(-30 70 236)"><rect x="34" y="226" width="58" height="20" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/><path d="M92 226 L110 236 L92 246 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/></g>`, 0.2);
    ROW.forEach((r, k) => {
      const P = sent([r.from, ...r.rest], { y: r.y, cx: 330, gaps: [2, 16], size: 28 });
      body += at(1, 'rise', `<g class="fr${k}">${T(P[0], { h: 56 })}</g>` + T(P[1], { h: 56 }) + T(P[2], { h: 56 }), 0.2 + k * 0.3);
      css += `.sc-${id} .fr${k} { transform-box: fill-box; transform-origin: center; transition: transform .5s ease-in .2s, opacity .4s ease .4s; } .on${r.n} .sc-${id} .fr${k} { transform: scaleX(0); opacity: 0; }`;
      const wTo = wOf(r.to, 28);
      body += at(r.n, 'pop', tile(P[0].r - wTo / 2, r.y, r.to, { size: 28, h: 56, w: wTo, fill: C.sky, stroke: C.blue, sw: 3.5 }), 0.7);
      body += curve(P[0].r - wTo / 2, r.y - 30, 100, r.y - 30, r.y - 70, C.blue, r.n, { width: 4, delay: 1.2 });
    });
    body += at(4, 'pop', tag(330, 170, '대명사', ROLE.y, 24), 0.5);
    body += glowRect(150, 60, 380, 72, 4, C.blue, 0.1, 16) + glowRect(150, 200, 380, 72, 4, C.blue, 0.3, 16);
    put(K + '5/대명사', svg(id, body, css));
  })();

  // ── 5단원: 수사(사과 하나·둘·셋, 줄 선 차례 첫째·둘째·셋째) ──────────────────────────────
  (function () {
    const id = 't71-k5-susa';
    let css = base(id);
    const X = [200, 320, 440], A = ['하나', '둘', '셋'], O = ['첫째', '둘째', '셋째'];
    let body = '';
    X.forEach((x, i) => {
      body += at(1, 'pop', `<circle cx="${x}" cy="70" r="26" fill="${C.red}"/><path d="M${x + 2} ${46} Q${x + 18} ${34} ${x + 24} ${48} Q${x + 12} ${54} ${x + 2} ${46} Z" fill="${C.green}"/>`, 0.1 + i * 0.15);
      body += at(2, 'pop', chip(x, 128, A[i], FN.che, { size: 22, h: 40, w: wOf(A[i], 22) }), 0.3 + i * 0.4);
      body += at(3, 'rise', person(x, 236, [C.orange, C.green, C.purple][i], 18), 0.1 + i * 0.25) + at(3, 'pop', badge(x + 26, 206, i + 1, C.blue), 0.5 + i * 0.25);
      body += at(3, 'pop', chip(x, 300, O[i], FN.che, { size: 22, h: 40, w: wOf(O[i], 22) }), 0.9 + i * 0.3);
    });
    body += at(2, 'fin', text(560, 136, '수량', { size: 20, color: C.blue }), 1.4) + at(3, 'fin', text(560, 308, '순서', { size: 20, color: C.blue }), 1.8);
    body += at(3, 'fin', `<path d="M140 270 H500" stroke="${C.line}" stroke-width="3"/>`, 0.1);
    body += glowRect(150, 102, 340, 52, 4, C.blue, 0.1, 16) + glowRect(150, 274, 340, 52, 4, C.blue, 0.3, 16);
    body += at(4, 'pop', tag(80, 196, '수사', ROLE.y, 24), 0.6);
    put(K + '5/수사', svg(id, body, css));
  })();

  // 동사·형용사가 같이 쓰는 세 칸 판
  const COLX = [110, 320, 530];
  const panel = (i, n) => at(n, 'fin', `<rect x="${COLX[i] - 96}" y="28" width="192" height="196" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`, 0);

  // ── 5단원: 동사(공이 구르다·해가 뜨다·새가 날다 — 움직임) ──────────────────────────────
  (function () {
    const id = 't71-k5-dongsa';
    let css = base(id);
    let body = '';
    // 칸 1: 공이 구른다
    body += panel(0, 1) + at(1, 'fin', `<path d="M24 200 H196" stroke="${C.muted}" stroke-width="3"/>`) + `<g class="b1"><g class="bl">${ball(50, 182, 17)}</g></g>`;
    css += `@keyframes ${id}-roll { from { transform: none; } to { transform: translateX(120px) rotate(360deg); } }
      .sc-${id} .bl { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .bl { animation: ${id}-roll 1.6s ease-in-out .3s both; }`;
    body += at(1, 'pop', chip(COLX[0], 262, '구르다', FN.yong, { size: 24, h: 44, w: wOf('구르다', 24) }), 1.0);
    // 칸 2: 해가 뜬다
    body += panel(1, 2) + at(2, 'fin', `<path d="M234 170 H406" stroke="${C.muted}" stroke-width="3"/>`) + `<g class="b2"><g class="sn">${sun(320, 196, 20)}</g></g>`;
    body += at(2, 'fin', `<rect x="232" y="172" width="176" height="50" fill="white"/>`);
    css += `.sc-${id} .sn { transition: transform 1.5s ease-out .3s; } .on2 .sc-${id} .sn { transform: translateY(-110px); }`;
    body += at(2, 'pop', chip(COLX[1], 262, '뜨다', FN.yong, { size: 24, h: 44, w: wOf('뜨다', 24) }), 1.0);
    // 칸 3: 새가 난다
    const bird = (x, y) => `<path d="M${x - 22} ${y - 6} Q${x - 10} ${y - 18} ${x} ${y} Q${x + 10} ${y - 18} ${x + 22} ${y - 6}" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    body += panel(2, 3) + `<g class="b3"><g class="bd">${bird(460, 190)}</g></g>`;
    css += `.sc-${id} .bd { transition: transform 1.6s ease-in-out .3s; } .on3 .sc-${id} .bd { transform: translate(120px, -130px); }`;
    body += at(3, 'pop', chip(COLX[2], 262, '날다', FN.yong, { size: 24, h: 44, w: wOf('날다', 24) }), 1.0);
    // 칸 4
    body += glowRect(40, 236, 560, 52, 4, C.orange, 0.1, 18);
    body += at(4, 'fin', text(250, 327, '움직임', { size: 20, color: C.orange }), 0.4) + at(4, 'pop', tag(380, 320, '동사', ROLE.y, 24), 0.8);
    put(K + '5/동사', svg(id, body, css));
  })();

  // ── 5단원: 형용사(풍선이 크다·사과가 빨갛다·탑이 높다 — 모습과 성질) ──────────────────────────────
  (function () {
    const id = 't71-k5-hyeongyong';
    let css = base(id);
    let body = '';
    // 칸 1: 크다
    body += panel(0, 1) + `<g class="b1"><g class="bg1"><circle cx="110" cy="116" r="62" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g></g>`;
    body += at(1, 'fin', `<circle cx="64" cy="190" r="12" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`, 0.2);
    css += growCss(id, '.bg1', 1, { axis: '', origin: 'center', delay: 0.3, dur: 1 }).replace(/scale\(0\)/, 'scale(.2)');
    body += at(1, 'pop', chip(COLX[0], 262, '크다', FN.yong, { size: 24, h: 44, w: wOf('크다', 24) }), 1.0);
    // 칸 2: 빨갛다
    body += panel(1, 2) + at(2, 'fin', `<circle cx="320" cy="132" r="54" fill="white" stroke="${C.red}" stroke-width="3"/>`) + `<g class="b2"><g class="rd"><circle cx="320" cy="132" r="54" fill="${C.red}"/></g></g>`;
    body += at(2, 'fin', `<path d="M322 78 Q326 62 336 56" stroke="${C.ink}" stroke-width="4" fill="none"/>`);
    css += `.sc-${id} .rd { opacity: 0; transition: opacity 1.2s ease .4s; } .on2 .sc-${id} .rd { opacity: 1; }`;
    body += at(2, 'pop', chip(COLX[1], 262, '빨갛다', FN.yong, { size: 24, h: 44, w: wOf('빨갛다', 24) }), 1.0);
    // 칸 3: 높다
    body += panel(2, 3) + `<g class="b3"><g class="tw3"><rect x="510" y="48" width="40" height="166" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>${[80, 120, 160].map((y) => `<rect x="520" y="${y}" width="20" height="14" fill="white"/>`).join('')}</g></g>`;
    css += growCss(id, '.tw3', 3, { axis: 'Y', origin: 'center bottom', delay: 0.3, dur: 1.1 });
    body += at(3, 'pop', chip(COLX[2], 262, '높다', FN.yong, { size: 24, h: 44, w: wOf('높다', 24) }), 1.0);
    // 칸 4
    body += glowRect(40, 236, 560, 52, 4, C.orange, 0.1, 18);
    body += at(4, 'fin', text(236, 327, '모습 · 성질', { size: 20, color: C.orange }), 0.4) + at(4, 'pop', tag(390, 320, '형용사', ROLE.y, 24), 0.8);
    put(K + '5/형용사', svg(id, body, css));
  })();

  // ── 5단원: 관형사(새 책·헌 책 — 체언 '책' 앞에서 어떤 책인지 꾸민다) ──────────────────────────────
  (function () {
    const id = 't71-k5-gwanhyeong';
    let css = base(id);
    const book = (x, y, fill, stroke) => `<path d="M${x - 40} ${y - 26} Q${x - 20} ${y - 34} ${x} ${y - 24} Q${x + 20} ${y - 34} ${x + 40} ${y - 26} V${y + 26} Q${x + 20} ${y + 18} ${x} ${y + 28} Q${x - 20} ${y + 18} ${x - 40} ${y + 26} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/><path d="M${x} ${y - 24} V${y + 28}" stroke="${stroke}" stroke-width="2.5"/>`;
    const ROW = [{ y: 96, m: '새', n: 2, pic: book(530, 96, C.sky, C.blue) + sparkle(574, 66, 0.9) + sparkle(492, 120, 0.7) }, { y: 236, m: '헌', n: 3, pic: book(530, 236, C.line, C.muted) + `<path d="M500 222 L512 230 M552 248 L560 240" stroke="${C.muted}" stroke-width="2.5"/>` }];
    let body = '';
    ROW.forEach((r, k) => {
      const P = sent([r.m, '책'], { y: r.y, cx: 300, size: 30, gaps: [18] });
      body += at(k ? 3 : 1, 'rise', `<g class="nn">${T(P[1], { h: 60 })}</g>`, 0.1);
      body += at(r.n, 'slide', `<g class="md">${T(P[0], { h: 60, fill: C.mint, stroke: C.green, sw: 3.5 })}</g>`, k ? 0.4 : 0.2);
      body += curve(P[0].cx, r.y - 32, P[1].cx, r.y - 32, r.y - 58, C.green, r.n, { width: 4, delay: 0.8 });
      body += at(r.n, 'pop', r.pic, 1.3);
    });
    body += at(1, 'pop', book(530, 96, 'white', C.muted), 0.3);
    // 칸 4: 꾸밈을 받는 것은 체언
    css += paint(id, '.nn', FN.che, 4, 0.2) + paint(id, '.md', FN.su, 4, 0.2);
    body += at(4, 'pop', chip(334, 166, '체언', FN.che), 0.5) + at(4, 'pop', tag(140, 166, '관형사', ROLE.y, 24), 0.9);
    body += glowRect(214, 60, 85, 72, 4, C.green, 0.1, 14) + glowRect(214, 200, 85, 72, 4, C.green, 0.3, 14);
    put(K + '5/관형사', svg(id, body, css));
  })();

  // ── 5단원: 부사(빨리 달린다 — 점이 빨라지고, 몹시 덥다 — 온도계가 치솟는다) ──────────────────────────────
  (function () {
    const id = 't71-k5-busa';
    let css = base(id);
    // 위 줄: 달린다
    const A = sent(['빨리', '달린다'], { y: 64, cx: 220, size: 28, gap: 16 });
    let body = at(1, 'rise', T(A[1], { h: 56, fill: C.peach, stroke: C.orange }));
    body += at(1, 'fin', `<path d="M400 64 H610" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 6"/>`, 0.2);
    body += `<g class="b1"><g class="rn"><circle cx="410" cy="64" r="12" fill="${C.orange}"/></g></g>`;
    css += `@keyframes ${id}-run { from { transform: none; } to { transform: translateX(190px); } }
      .on1 .sc-${id} .rn { animation: ${id}-run 3s linear .3s infinite; }
      .on2 .sc-${id} .rn { animation: ${id}-run .9s linear .6s infinite; }`;
    body += at(2, 'slide', T(A[0], { h: 56, fill: C.mint, stroke: C.green, sw: 3.5 }), 0.1);
    body += curve(A[0].cx, 32, A[1].cx, 32, 8, C.green, 2, { width: 4, delay: 0.4 });
    // 아래 줄: 덥다
    const B = sent(['몹시', '덥다'], { y: 220, cx: 220, size: 28 });
    body += at(3, 'rise', T(B[1], { h: 56, fill: C.peach, stroke: C.orange }));
    body += at(3, 'fin', `<rect x="496" y="140" width="22" height="150" rx="11" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="507" cy="298" r="18" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>`, 0.1);
    body += `<g class="b3"><g class="th"><rect x="501" y="150" width="12" height="140" rx="6" fill="${C.red}"/></g></g>`;
    css += `.sc-${id} .th { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(.35); transition: transform 1.2s ease-out 1.4s; } .on3 .sc-${id} .th { transform: scaleY(1); }`;
    body += at(3, 'slide', T(B[0], { h: 56, fill: C.mint, stroke: C.green, sw: 3.5 }), 0.7);
    body += curve(B[0].cx, 188, B[1].cx, 188, 164, C.green, 3, { width: 4, delay: 1.0 });
    // 칸 4: 꾸밈을 받는 것은 용언
    body += at(4, 'pop', chip(A[1].cx, 112, '용언', FN.yong) + chip(B[1].cx, 268, '용언', FN.yong), 0.3);
    body += glowRect(A[0].l - 6, 30, A[0].w + 12, 68, 4, C.green, 0.1, 14) + glowRect(B[0].l - 6, 186, B[0].w + 12, 68, 4, C.green, 0.3, 14);
    body += at(4, 'pop', tag(340, 326, '부사', ROLE.y, 24), 0.8);
    put(K + '5/부사', svg(id, body, css));
  })();

  // ── 5단원: 조사(친구가·친구를·친구에게 — 뒤에 붙어 맡은 몫을 알리고, 친구도·친구만은 뜻을 더한다) ──────────────────────────────
  (function () {
    const id = 't71-k5-josa';
    let css = base(id);
    const ROWS = [['가', '누가', 80], ['를', '누구를', 160], ['에게', '누구에게', 240]];
    let body = '';
    ROWS.forEach(([j, lab, y], i) => {
      const P = sent(['친구', j], { y, cx: 0, gaps: [2], size: 28 }).map((q, _, A) => ({ ...q, cx: q.cx + 30 - A[0].l, r: q.r + 30 - A[0].l }));
      body += at(1, 'rise', T(P[0], { h: 56, fill: C.sky, stroke: C.blue }), 0.1 + i * 0.15);
      body += at(2, 'slideL', T(P[1], { h: 56, fill: C.lilac, stroke: C.purple, sw: 3.5 }), 0.2 + i * 0.35);
      body += at(2, 'fin', text(P[1].r + 14, y + 7, lab, { size: 19, color: C.purple, anchor: 'start' }), 0.7 + i * 0.35);
    });
    // 칸 3: 뜻을 더하는 조사
    const M = [['도', 110, 2], ['만', 236, 1]];
    body += at(3, 'fin', `<path d="M346 30 V310" stroke="${C.line}" stroke-width="3" stroke-dasharray="7 7"/>`);
    M.forEach(([j, y, cnt], i) => {
      const P = sent(['친구', j], { y, cx: 446, gaps: [2], size: 28 });
      body += at(3, 'rise', T(P[0], { h: 56, fill: C.sky, stroke: C.blue }) + T(P[1], { h: 56, fill: C.lilac, stroke: C.purple, sw: 3.5 }), 0.2 + i * 0.6);
      const people = cnt === 2 ? person(566, y + 12, C.muted, 13) + person(606, y + 12, C.blue, 13) : person(586, y + 12, C.blue, 13);
      body += at(3, 'pop', people, 0.6 + i * 0.6);
    });
    body += at(3, 'fin', text(500, 300, '뜻을 더함', { size: 19, color: C.purple }), 1.6);
    // 칸 4
    body += at(4, 'pop', tag(160, 326, '조사', ROLE.y, 24), 0.5);
    put(K + '5/조사', svg(id, body, css));
  })();

  // ── 5단원: 감탄사(와!·여보세요·응 — 놀람, 부름, 대답의 한마디) ──────────────────────────────
  (function () {
    const id = 't71-k5-gamtan';
    let css = base(id);
    const X = [110, 320, 530], W = ['와', '여보세요', '응'], L = ['놀람', '부름', '대답'];
    let body = '';
    X.forEach((x, i) => {
      const n = i + 1;
      body += panel(i, n);
      body += at(n, 'pop', tile(x, 100, W[i], { size: 30, h: 62, fill: 'white', stroke: C.muted, sw: 3.5 }), 0.1);
      body += at(n, 'fin', text(x, 196, L[i], { size: 20, color: C.muted }), 0.9);
    });
    // 놀람: 반짝이 / 부름: 퍼지는 물결 / 대답: 동그라미 확인
    body += at(1, 'pop', sparkle(56, 56, 1.1) + sparkle(166, 50, 0.9) + sparkle(160, 150, 0.7), 0.5);
    body += `<g class="b2">${[0, 1].map((k) => `<path class="ring ring2" d="M${388 + k * 14} 76 Q${400 + k * 14} 100 ${388 + k * 14} 124" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round" style="animation-delay:${0.5 + k * 0.2}s"/>`).join('')}</g>`;
    body += at(3, 'pop', check(588, 64, 11), 0.5);
    // 칸 4: 문장에서 따로 떨어져 쓰인다
    const S = sent(['와,', '눈이', '온다'], { y: 280, cx: 320, size: 26, gaps: [36, 14] });
    body += at(4, 'rise', T(S[0], { h: 52, fill: C.peach, stroke: C.orange, sw: 3.5 }) + T(S[1], { h: 52 }) + T(S[2], { h: 52 }), 0.1);
    body += at(4, 'pop', tag(560, 280, '감탄사', ROLE.y, 24), 0.7);
    css += `.sc-${id} .ring { opacity: 0; }`;
    put(K + '5/감탄사', svg(id, body, css));
  })();

  // ── 5단원: 활용('먹다'가 먹고·먹어·먹으니로 — 앞은 그대로, 끝이 바뀐다) ──────────────────────────────
  (function () {
    const id = 't71-k5-hwalyong';
    let css = base(id);
    let body = at(1, 'pop', tile(320, 58, '먹다', { size: 32, h: 64, w: 124, fill: 'white', stroke: C.ink }));
    body += at(1, 'fin', text(320, 116, '사전에 실린 꼴', { size: 18, color: C.muted }), 0.5);
    const F = [['고', 170, '밥을'], ['어', 320, '밥을'], ['으니', 470, '밥을']];
    F.forEach(([e, x], i) => {
      body += drawLine(`M320 128 L${x} 178`, C.muted, 2, { width: 3, delay: 0.1 + i * 0.2 });
      body += at(2, 'rise', tile(x, 210, '먹' + e, { size: 30, h: 60 }), 0.6 + i * 0.25);
      body += at(3, 'fin', twoTone(x, 210, '먹', e, { size: 30, h: 60 }), 0.2 + i * 0.3);
    });
    css += `.on3 .sc-${id} .he { animation: ${id}-flash 1.4s ease-in-out 1.1s both; }`;
    body += at(3, 'fin', text(56, 217, '먹', { size: 20, color: C.green }) + text(56, 245, '그대로', { size: 18, color: C.green }), 1.2);
    body += at(3, 'fin', text(586, 217, '끝', { size: 20, color: C.orange }) + text(586, 245, '바뀜', { size: 18, color: C.orange }), 1.4);
    body += glowRect(100, 174, 440, 72, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(320, 304, '활용', ROLE.y, 24), 0.6);
    put(K + '5/활용', svg(id, body, css));
  })();

  // 어간·어미가 같이 쓰는 세 줄(앞부분 stem, 끝부분 ends)
  const stemRows = (id, stem, ends, xs = 150) => {
    let body = '';
    const Y = [80, 170, 260];
    ends.forEach((e, k) => {
      const w = wOf(stem + e, 30), x0 = xs - tw(stem + e, 30) / 2, sw = tw(stem, 30);
      body += at(1, 'rise', `<rect x="${f(xs - w / 2)}" y="${Y[k] - 30}" width="${w}" height="60" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`, k * 0.2);
      body += at(1, 'rise', `<g class="sm sm${k}">${text(f(x0 + sw / 2), Y[k] + 11, stem, { size: 30 })}</g><g class="en en${k}">${text(f(x0 + sw + tw(e, 30) / 2), Y[k] + 11, e, { size: 30 })}</g>`, k * 0.2);
      // 칸 2: 자르는 점선
      body += drawLine(`M${f(x0 + sw + 1)} ${Y[k] - 24} V${Y[k] + 24}`, C.red, 2, { width: 3, delay: 0.2 + k * 0.2 });
    });
    return { body, Y };
  };

  // ── 5단원: 어간(신고·신으니·신어서 — 앞부분 '신-'은 모두 같아 한데 겹친다) ──────────────────────────────
  (function () {
    const id = 't71-k5-eogan';
    let css = base(id);
    const ends = ['고', '으니', '어서'];
    const { body: b0, Y } = stemRows(id, '신', ends);
    let body = b0;
    css += `.sc-${id} .sm text, .sc-${id} .en text { transition: fill .5s ease .6s; } .on2 .sc-${id} .sm text { fill: ${C.green}; }`;
    // 칸 3: 앞부분이 오른쪽 한 자리로 겹친다
    const x0 = (k) => 150 - tw('신' + ends[k], 30) / 2 + 15;
    ends.forEach((e, k) => { css += steps(id, `sm${k}`, 'none', [[3, `translate(${f(430 - x0(k))}px, ${170 - Y[k]}px)`, f(0.2 + k * 0.15)]], { box: false }); });
    css += `.on3 .sc-${id} .en { opacity: .35; }`;
    body = at(3, 'pop', `<rect x="394" y="132" width="92" height="76" rx="14" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`, 0.1) + body;
    body += at(3, 'fin', text(466, 180, '-', { size: 30, color: C.green }), 1.1);
    body += at(3, 'fin', text(440, 240, '늘 그대로', { size: 19, color: C.green }), 1.2);
    body += glowRect(388, 126, 104, 88, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(440, 300, '어간', ROLE.y, 24), 0.6);
    put(K + '5/어간', svg(id, body, css));
  })();

  // ── 5단원: 어미(읽고·읽어서·읽으니 — 끝부분이 떨어져 나와 저마다 다르다) ──────────────────────────────
  (function () {
    const id = 't71-k5-eomi';
    let css = base(id);
    const ends = ['고', '어서', '으니'];
    const { body: b0, Y } = stemRows(id, '읽', ends);
    let body = '';
    css += `.sc-${id} .en text { transition: fill .5s ease .6s; } .on2 .sc-${id} .en text { fill: ${C.orange}; }`;
    // 칸 3: 끝부분이 오른쪽으로 떨어져 나와 '-고' 조각이 된다
    ends.forEach((e, k) => {
      const xe = 150 - tw('읽' + e, 30) / 2 + 30 + tw(e, 30) / 2;
      css += steps(id, `en${k}`, 'none', [[3, `translate(${f(440 - xe)}px, 0px)`, f(0.2 + k * 0.15)]], { box: false });
      body += at(3, 'fin', `<rect x="${f(440 - tw(e, 30) / 2 - 30)}" y="${Y[k] - 28}" width="${f(tw(e, 30) + 48)}" height="56" rx="12" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + text(f(440 - tw(e, 30) / 2 - 16), Y[k] + 11, '-', { size: 30, color: C.orange }), 1.1);
    });
    body += b0;
    css += `.on3 .sc-${id} .sm { opacity: .35; transition: opacity .5s ease .2s; }`;
    css += `.on3 .sc-${id} .en text { animation: ${id}-flash 1.4s ease-in-out 1.2s both; }`;
    body += at(3, 'fin', text(560, 178, '바뀜', { size: 20, color: C.orange }), 1.4);
    body += glowRect(376, 44, 136, 252, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(560, 316, '어미', ROLE.y, 24), 0.6);
    put(K + '5/어미', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
