// 국어 7-1(중학교 1학년 1학기) 낱말 도식 첫째 묶음:
// 1단원 운율·비유·의인법·상징·시어·시구, 2단원 수필, 3단원 일반화·재구성·세부·예시, 4단원 설명문·도표·시각 자료,
// 6단원 상호 작용·쌍방향·생산자·수용자. 5단원 품사 도식은 kor-2.js.
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


  // 1단원에 같이 쓰는 작은 그림: 구름, 솜사탕, 꽃, 비둘기
  const cloud = (x, y, s = 1, fill = 'white', stroke = C.blue) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `<path d="M${P(-62, 28)} C${P(-90, 28)} ${P(-86, -14)} ${P(-56, -10)} C${P(-54, -44)} ${P(-10, -50)} ${P(2, -24)} C${P(16, -52)} ${P(66, -44)} ${P(58, -6)} C${P(88, -6)} ${P(90, 28)} ${P(62, 28)} Z" fill="${fill}" stroke="${stroke}" stroke-width="${f(3.5)}" stroke-linejoin="round"/>`;
  };
  const candy = (x, y) => `<path d="M${x} ${y + 30} L${x} ${y + 92}" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`
    + `<path d="M${x - 46} ${y + 4} C${x - 62} ${y - 30} ${x - 28} ${y - 58} ${x - 4} ${y - 44} C${x + 20} ${y - 66} ${x + 62} ${y - 38} ${x + 48} ${y - 6} C${x + 66} ${y + 20} ${x + 30} ${y + 46} ${x + 4} ${y + 34} C${x - 22} ${y + 50} ${x - 62} ${y + 30} ${x - 46} ${y + 4} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/>`
    + `<path d="M${x - 22} ${y - 10} Q${x} ${y - 26} ${x + 22} ${y - 8} M${x - 26} ${y + 12} Q${x} ${y - 2} ${x + 26} ${y + 14}" stroke="${C.orange}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".6"/>`;
  const flower = (x, y) => `<path d="M${x} ${y + 10} Q${x - 6} ${y + 60} ${x} ${y + 100}" stroke="${C.green}" stroke-width="6" fill="none" stroke-linecap="round"/>`
    + `<path d="M${x - 2} ${y + 70} Q${x - 40} ${y + 50} ${x - 46} ${y + 76} Q${x - 22} ${y + 88} ${x - 2} ${y + 70} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
    + [0, 72, 144, 216, 288].map((a) => { const r = a * Math.PI / 180; return `<circle cx="${f(x + Math.sin(r) * 27)}" cy="${f(y - Math.cos(r) * 27)}" r="19" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`; }).join('')
    + `<circle cx="${x}" cy="${y}" r="20" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  const dove = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `<path d="M${P(-58, 8)} L${P(-92, -10)} L${P(-86, 22)} Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${P(-62, 10)} Q${P(-26, -26)} ${P(26, -16)} Q${P(40, -40)} ${P(56, -24)} L${P(74, -18)} L${P(56, -10)} Q${P(52, 26)} ${P(-6, 30)} Q${P(-46, 30)} ${P(-62, 10)} Z" fill="white" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<path d="M${P(56, -24)} L${P(76, -18)} L${P(56, -11)}" fill="${C.orange}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`
      + `<circle cx="${P(44, -24).split(' ')[0]}" cy="${P(44, -24).split(' ')[1]}" r="${f(3.6 * s)}" fill="${C.ink}"/>`
      + `<path d="M${P(-18, 0)} Q${P(0, -30)} ${P(34, -32)} Q${P(26, -8)} ${P(10, 10)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/>`;
  };

  // ── 1단원: 운율(세 줄의 첫머리 '졸졸졸'이 되풀이되고, 줄마다 세 글자·세 글자로 끊겨 같은 가락이 물결친다) ──────────────────────────────
  (function () {
    const id = 't71-k1-unyul';
    let css = base(id);
    const Y = [70, 150, 230], A = ['시냇물', '흘러서', '바다로'], X1 = 210, X2 = 370, S = 30;
    let body = '';
    Y.forEach((y, i) => {
      body += at(1, 'rise', `<g class="c1">${tile(X1, y, '졸졸졸', { size: S, h: 60, w: 138 })}</g>` + tile(X2, y, A[i], { size: S, h: 60, w: 138 }), 0.15 + i * 0.3);
      // 칸 3: 글자 위 점 셋·셋과 오른쪽 '3·3'
      const dots = [X1, X2].map((cx) => [-1, 0, 1].map((k) => `<circle cx="${cx + k * S}" cy="${y - 40}" r="4.5" fill="${C.purple}"/>`).join('')).join('');
      body += at(3, 'fin', dots, 0.2 + i * 0.35);
      body += at(3, 'pop', tag(510, y, '3 · 3', ROLE.x, 22), 0.5 + i * 0.35);
    });
    // 칸 2: 첫머리 '졸졸졸'이 주황으로 칠해지며 차례로 부푼다
    css += paint(id, '.c1', ROLE.o, 2, 0.2);
    css += `.on2 .sc-${id} .c1 { animation: ${id}-pulse .7s ease-in-out .4s 2; transform-box: fill-box; transform-origin: center; }`;
    body += `<g class="h3">${at(2, 'pop', tag(X1, 290, '같은 소리', ROLE.o, 20), 1.0)}</g>`;
    // 칸 4: 물결(가락)이 줄을 따라 그어진다
    let wave = 'M70 306';
    for (let k = 0; k < 8; k++) wave += ` q24 ${k % 2 ? 22 : -22} 48 0`;
    body += drawLine(wave, C.green, 4, { width: 4, delay: 0.2, cls: 'wv' });
    css += `.sc-${id} .wv { transition-duration: 1.6s; }`;
    body += at(4, 'pop', text(100, 290, '♪', { size: 30, color: C.green }) + text(430, 296, '♪', { size: 30, color: C.green }), 1.2);
    body += glowRect(X1 - 76, 34, 312, 232, 4, C.green, 0.2, 16);
    body += at(4, 'pop', tag(560, 306, '운율', ROLE.y, 24), 1.4);
    put(K + '1/운율', svg(id, body, css));
  })();

  // ── 1단원: 비유(구름과 솜사탕 — 하얗다·폭신하다 닮은 점이 이어지고 '구름은 솜사탕'이 된다) ──────────────────────────────
  (function () {
    const id = 't71-k1-biyu';
    let css = base(id);
    let body = at(1, 'pop', cloud(130, 120, 1));
    body += at(1, 'rise', tile(130, 206, '구름', { size: 26, h: 50, fill: C.sky, stroke: C.blue }), 0.3);
    body += at(1, 'fin', text(130, 40, '나타내려는 대상', { size: 18, color: C.blue }), 0.5);
    body += at(2, 'pop', candy(510, 100));
    body += at(2, 'rise', tile(510, 206, '솜사탕', { size: 26, h: 50, fill: C.peach, stroke: C.orange }), 0.3);
    body += at(2, 'fin', text(510, 40, '빗댄 대상', { size: 18, color: C.orange }), 0.5);
    // 닮은 점 두 가지(가운데)
    [['하얗다', 92], ['폭신하다', 150]].forEach(([l, y], i) => {
      body += drawLine(`M222 ${y} H260 M380 ${y} H${430 - 6}`, C.muted, 2, { width: 3, delay: 0.8 + i * 0.3 });
      body += at(2, 'pop', tag(320, y, l, ROLE.p, 20), 1.0 + i * 0.3);
    });
    body += at(2, 'fin', text(320, 56, '닮은 점', { size: 18, color: C.green }), 0.9);
    // 칸 3: '구름은 솜사탕'
    const R = row(['구름은', '솜사탕'], { y: 300, cx: 320, size: 28, gap: 14 });
    body += `<g class="b3"><g class="sa">${T(R[0], { fill: C.sky, stroke: C.blue })}</g></g><g class="b3"><g class="sb">${T(R[1], { fill: C.peach, stroke: C.orange })}</g></g>`;
    css += steps(id, 'sa', `translate(${f(130 - R[0].cx)}px, -94px)`, [[3, 'none', 0.2]], { box: false });
    css += steps(id, 'sb', `translate(${f(510 - R[1].cx)}px, -94px)`, [[3, 'none', 0.5]], { box: false });
    // 칸 4
    body += glowRect(R[0].l - 10, 266, R[1].r - R[0].l + 20, 68, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(320, 222, '비유', ROLE.y, 24), 0.6);
    put(K + '1/비유', svg(id, body, css));
  })();

  // ── 1단원: 의인법(사람이 아닌 꽃에 사람이 하는 '춤추다'를 빗대자 꽃이 웃으며 몸을 흔든다) ──────────────────────────────
  (function () {
    const id = 't71-k1-uiin';
    let css = base(id);
    let body = at(1, 'pop', `<g class="fw">${flower(150, 120)}<g class="b3"><g class="fin fin3" style="animation-delay:.9s"><circle cx="143" cy="116" r="2.8" fill="${C.ink}"/><circle cx="157" cy="116" r="2.8" fill="${C.ink}"/><path d="M142 125 Q150 132 158 125" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g></g></g>`);
    body += at(1, 'rise', tag(150, 262, '꽃', ROLE.p, 22), 0.4);
    body += at(1, 'fin', text(150, 304, '사람이 아닌 것', { size: 18, color: C.green }), 0.6);
    // 칸 2: 사람과 사람이 하는 일
    body += at(2, 'pop', `<g class="ps">${person(490, 168, C.blue, 22)}<path d="M454 176 L428 140 M526 176 L552 140" stroke="${C.blue}" stroke-width="9" stroke-linecap="round"/></g>`);
    body += at(2, 'rise', tag(490, 262, '춤추다', ROLE.s, 22), 0.4);
    body += at(2, 'fin', text(490, 304, '사람이 하는 일', { size: 18, color: C.blue }), 0.6);
    css += `@keyframes ${id}-sway { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }
      .sc-${id} .ps, .sc-${id} .fw { transform-box: fill-box; transform-origin: 50% 100%; }
      .on2 .sc-${id} .ps { animation: ${id}-sway 1.2s ease-in-out .6s 2; }
      .on3 .sc-${id} .ps { animation: none; }
      .on3 .sc-${id} .fw { animation: ${id}-sway 1.2s ease-in-out 1.2s 3; }`;
    // 칸 3: '춤추다'가 꽃에게로 건너간다
    body += curve(450, 236, 196, 236, 186, C.orange, 3, { width: 4, delay: 0.1 });
    body += at(3, 'pop', tile(420, 60, '꽃이 춤춘다', { size: 26, h: 52, fill: TAN, stroke: C.orange }), 1.4);
    // 칸 4
    body += glowRect(58, 22, 184, 304, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(320, 140, '의인법', ROLE.y, 24), 0.6);
    put(K + '1/의인법', svg(id, body, css));
  })();

  // ── 1단원: 상징(눈에 보이지 않는 '평화'를 눈에 보이는 비둘기 하나로 대신 나타낸다) ──────────────────────────────
  (function () {
    const id = 't71-k1-sangjing';
    let css = base(id);
    // 칸 1: 점선 구름 속 흐린 '평화'
    let body = `<g class="b1"><g class="fin fin1 dm">${cloud(470, 120, 1.25, 'none', C.muted).replace('stroke-width', 'stroke-dasharray="9 7" stroke-width')}${text(470, 136, '평화', { size: 32, color: C.muted })}</g></g>`;
    body += at(1, 'fin', text(470, 226, '보이지 않는 뜻', { size: 18, color: C.muted }), 0.4);
    // 칸 2: 비둘기
    body += at(2, 'pop', `<g class="dv">${dove(170, 128, 1.1)}</g>`);
    body += at(2, 'fin', text(170, 226, '보이는 사물', { size: 18, color: C.blue }), 0.5);
    // 칸 3: 비둘기에서 뜻으로 화살표, 구름이 또렷해진다
    body += drawArrow(268, 120, 358, 120, C.orange, 3, { width: 5, delay: 0.2 });
    body += at(3, 'fin', cloud(470, 120, 1.25, C.mint, C.green) + text(470, 136, '평화', { size: 32, color: C.green }), 1.0);
    const R = row(['하늘', '높이', '나는', '비둘기'], { y: 300, cx: 320, size: 24, gap: 10 });
    body += R.map((p, i) => at(3, 'rise', T(p, i === 3 ? { fill: C.sky, stroke: C.blue } : {}), 1.4 + i * 0.12)).join('');
    // 칸 4
    body += glowRect(70, 64, 200, 130, 4, C.blue, 0.1, 16) + glowRect(360, 54, 220, 140, 4, C.green, 0.4, 16);
    body += at(4, 'pop', tag(316, 222, '상징', ROLE.y, 24), 0.8);
    put(K + '1/상징', svg(id, body, css));
  })();

  // 시어·시구가 함께 쓰는 짧은 시 두 줄
  const POEM = [['하얀', '눈', '소복소복'], ['까만', '밤', '반짝반짝']];

  // ── 1단원: 시어(시 두 줄이 낱말 조각 하나하나로 갈라진다) ──────────────────────────────
  (function () {
    const id = 't71-k1-sieo';
    let css = base(id);
    const YS = [116, 216];
    let body = at(1, 'fin', `<rect x="70" y="40" width="500" height="236" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    YS.forEach((y, i) => {
      body += `<g class="h2">${at(1, 'fin', text(320, y + 11, POEM[i].join(' '), { size: 32 }), 0.3 + i * 0.3)}</g>`;
      row(POEM[i], { y, cx: 320, size: 30, gap: 30 }).forEach((p, k) => {
        body += at(2, 'pop', `<g class="w w${i}${k}">${T(p, { h: 60 })}</g>`, 0.3 + (i * 3 + k) * 0.15);
      });
    });
    // 칸 3: 낱말 하나씩 짚는다
    css += paint(id, '.w01', ROLE.s, 3, 0.2) + paint(id, '.w02', ROLE.s, 3, 0.7) + paint(id, '.w12', ROLE.s, 3, 1.2);
    css += pulseCss(id, '.w01', 3, 0.2) + `.on3 .sc-${id} .w02 { animation: ${id}-pulse .7s ease-in-out .7s 2; transform-box: fill-box; transform-origin: center; } .on3 .sc-${id} .w12 { animation: ${id}-pulse .7s ease-in-out 1.2s 2; transform-box: fill-box; transform-origin: center; }`;
    // 칸 4: 모든 낱말
    css += paint(id, '.w', ROLE.p, 4, 0.1);
    body += at(4, 'pop', tag(320, 318, '시어', ROLE.y, 24), 0.7);
    put(K + '1/시어', svg(id, body, css));
  })();

  // ── 1단원: 시구(낱말 조각이 '하얀 눈', '까만 밤'처럼 덩어리로 묶인다) ──────────────────────────────
  (function () {
    const id = 't71-k1-sigu';
    let css = base(id);
    const YS = [90, 230], G = 30;
    let body = '';
    YS.forEach((y, i) => {
      const P = row(POEM[i], { y, cx: 320, size: 30, gap: G });
      const col = i ? ROLE.s : ROLE.o, n = 2 + i;
      // 덩어리 테두리(앞 두 낱말)
      const l = P[0].l + (G - 6) / 2 - 8, r = P[1].r - (G - 6) / 2 + 8;
      body += `<g class="b${n}"><g class="pop pop${n}" style="animation-delay:1s"><rect x="${f(l)}" y="${y - 40}" width="${f(r - l)}" height="80" rx="18" fill="none" stroke="${col[1]}" stroke-width="4"/></g></g>`;
      P.forEach((p, k) => { body += at(1, 'rise', `<g class="m${i}${k}">${T(p, { h: 60 })}</g>`, 0.2 + (i * 3 + k) * 0.12); });
      css += steps(id, `m${i}0`, 'none', [[n, `translate(${(G - 6) / 2}px, 0px)`, 0.2]], { box: false });
      css += steps(id, `m${i}1`, 'none', [[n, `translate(${-(G - 6) / 2}px, 0px)`, 0.2]], { box: false });
      css += paint(id, `.m${i}0`, col, n, 0.6) + paint(id, `.m${i}1`, col, n, 0.6);
      body += `<g class="h4">${at(n, 'pop', tag(f((l + r) / 2), y + 64, POEM[i][0] + ' ' + POEM[i][1], col, 18), 1.3)}</g>`;
    });
    // 칸 4: 두 덩어리가 반짝이고 이름표
    body += at(4, 'pop', tag(320, 316, '시구', ROLE.y, 24), 0.6);
    css += ['.m00', '.m01', '.m10', '.m11'].map((c) => pulseCss(id, c, 4, 0.2)).join('');
    put(K + '1/시구', svg(id, body, css));
  })();


  // ── 2단원: 수필(실제로 겪은 일과 그때의 생각·느낌이 정해진 틀 없이 한 편의 글로 흘러 들어간다) ──────────────────────────────
  (function () {
    const id = 't71-k2-supil';
    let css = base(id);
    const bike = (x, y) => `<circle cx="${x - 34}" cy="${y + 18}" r="22" fill="none" stroke="${C.ink}" stroke-width="4"/><circle cx="${x + 34}" cy="${y + 18}" r="22" fill="none" stroke="${C.ink}" stroke-width="4"/>`
      + `<path d="M${x - 34} ${y + 18} L${x - 8} ${y - 14} L${x + 22} ${y - 14} L${x + 34} ${y + 18} M${x - 8} ${y - 14} L${x} ${y + 18} L${x + 22} ${y - 14} M${x - 14} ${y - 24} H${x} M${x + 22} ${y - 14} L${x + 18} ${y - 28} H${x + 30}" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    let body = at(1, 'fin', `<rect x="28" y="28" width="220" height="132" rx="14" fill="white" stroke="${C.blue}" stroke-width="3"/>`);
    body += at(1, 'pop', `<g class="bk">${bike(138, 92)}</g>`, 0.3) + at(1, 'fin', tag(138, 160, '겪은 일', ROLE.s, 20), 0.7);
    css += `@keyframes ${id}-tip { 0%, 100% { transform: rotate(0deg); } 40% { transform: rotate(-14deg); } 70% { transform: rotate(4deg); } }
      .sc-${id} .bk { transform-box: fill-box; transform-origin: 50% 100%; } .on1 .sc-${id} .bk { animation: ${id}-tip 1.4s ease-in-out 1s 1; }`;
    // 칸 2: 생각·느낌
    body += at(2, 'pop', `<path d="${heartD(100, 250, 0.8)}" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`, 0.1);
    body += at(2, 'pop', cloud(196, 240, 0.62, C.lilac, C.purple) + text(196, 248, '다시!', { size: 20, color: C.purple }), 0.5);
    body += at(2, 'fin', tag(138, 318, '생각 · 느낌', ROLE.x, 20), 0.9);
    // 칸 3: 정해진 틀 없이 한 편의 글로
    body += at(3, 'fin', `<rect x="332" y="28" width="280" height="300" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += drawArrow(254, 94, 322, 120, C.blue, 3, { width: 4, delay: 0.2 }) + drawArrow(254, 262, 322, 230, C.purple, 3, { width: 4, delay: 0.4 });
    const LN = [[360, 60, 220, GRAY], [360, 84, 180, GRAY], [360, 108, 236, C.sky], [380, 140, 200, C.sky], [360, 164, 150, GRAY], [360, 196, 228, C.lilac], [360, 220, 190, C.lilac], [380, 252, 210, GRAY], [360, 276, 120, C.lilac]];
    LN.forEach(([x, y, w, c], i) => { body += `<g class="b3"><g class="ln${i}">${bar(x, y, w, c, 11)}</g></g>`; css += growCss(id, `.ln${i}`, 3, { delay: f(0.8 + i * 0.12), dur: 0.4 }); });
    body += at(3, 'fin', text(472, 318, '정해진 틀 없이', { size: 18, color: C.muted }), 2.0);
    // 칸 4
    body += glowRect(326, 22, 292, 312, 4, C.green, 0.1, 14);
    body += at(4, 'pop', tag(472, 20 + 4, '수필', ROLE.y, 24), 0.6);
    put(K + '2/수필', svg(id, body, css));
  })();


  // ── 3단원: 일반화(개나리·진달래·벚꽃이 아래로 내려가고, 셋을 아우르는 '봄꽃'이 위에서 묶는다) ──────────────────────────────
  (function () {
    const id = 't71-k3-ilban';
    let css = base(id);
    const S = 22, Y = 56, TX = [170, 320, 470];
    const P = [['마당에', 83.5, 95], ['개나리', 192.5, 95], ['진달래', 301.5, 95], ['벚꽃', 399.5, 73], ['이', 464.5, 51], ['피었다', 551.5, 95]];
    let body = '';
    const old = (i) => tile(P[i][1], Y, P[i][0], { size: S, h: 48, w: P[i][2] });
    body += `<g class="h4"><g class="dim dim2">` + at(1, 'rise', old(0) + old(4) + old(5), 0.1) + `<g class="h2">${at(1, 'rise', text(246, Y + 12, ',', { size: 24 }) + text(355, Y + 12, ',', { size: 24 }), 0.1)}</g></g></g>`;
    [1, 2, 3].forEach((i, k) => {
      body += `<g class="b1"><g class="fl${k}">${g('rise rise1', old(i), 0.1)}</g></g>`;
      css += steps(id, `fl${k}`, 'none', [[2, `translate(${f(TX[k] - P[i][1])}px, 214px)`, f(0.2 + k * 0.25)]], { box: false });
      css += paint(id, `.fl${k}`, ROLE.o, 2, f(0.2 + k * 0.25));
    });
    // 칸 3: 위에서 묶는 '봄꽃'
    body += TX.map((x, k) => drawLine(`M320 186 L${x} 244`, C.orange, 3, { width: 4, delay: f(0.5 + k * 0.15) })).join('');
    body += at(3, 'pop', tile(320, 160, '봄꽃', { size: 28, h: 56, w: 110, fill: TAN, stroke: C.orange, sw: 4 }), 0.1);
    body += at(3, 'fin', text(500, 168, '더 큰 말', { size: 19, color: C.orange }), 1.1);
    // 칸 4: 새 문장 '마당에 봄꽃이 피었다'
    const N = row(['마당에', '봄꽃이', '피었다'], { y: Y, cx: 320, size: S, gap: 14 });
    body += N.map((p, i) => at(4, 'drop', T(p, { h: 48, ...(i === 1 ? { fill: TAN, stroke: C.orange } : {}) }), 0.2 + i * 0.15)).join('');
    body += glowRect(N[1].l - 6, Y - 30, N[1].w + 12, 60, 4, C.orange, 0.8, 14);
    body += at(4, 'pop', tag(530, 108, '일반화', ROLE.y, 24), 1.1);
    put(K + '3/일반화', svg(id, body, css));
  })();

  // ── 3단원: 재구성(중심 문장이 없는 문단에서 중요한 말을 모아 새 중심 문장을 짓는다) ──────────────────────────────
  (function () {
    const id = 't71-k3-jaegu';
    let css = base(id);
    const SY = [80, 160, 240], SEN = ['냉장고에 넣는다', '소금에 절인다', '햇볕에 말린다'], KEY = [['냉장고', 96], ['소금', 91], ['햇볕', 91]];
    let body = at(1, 'fin', `<rect x="24" y="30" width="282" height="262" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    SY.forEach((y, i) => { body += at(1, 'rise', tile(165, y, SEN[i], { size: 22, h: 50 }), 0.2 + i * 0.2); });
    // 칸 2: 돋보기가 줄을 훑고 '중심 문장?'에 ×
    body += `<g class="h3"><g class="b2"><g class="ln">${lens(270, 70, 18, C.blue)}</g></g>`
      + at(2, 'pop', tag(140, 324, '중심 문장?', ROLE.s, 20) + cross(232, 324, 10), 2.0) + '</g>';
    css += `@keyframes ${id}-scan { from { transform: none; } to { transform: translateY(160px); } }
      .on2 .sc-${id} .ln { animation: ${id}-scan 1.8s ease-in-out .2s both; }`;
    // 칸 3: 중요한 말이 오른쪽 상자로 모인다
    body += at(3, 'fin', `<rect x="350" y="30" width="266" height="262" rx="14" fill="${C.mint}" fill-opacity=".45" stroke="${C.green}" stroke-width="3"/>`, 0.1);
    body += drawArrow(312, 160, 344, 160, C.green, 3, { width: 4, delay: 0.1 });
    KEY.forEach(([l, x], i) => {
      body += `<g class="b3"><g class="k${i}">${g('pop pop3', tag(x, SY[i], l, ROLE.o, 19), 0.2 + i * 0.15)}</g></g>`;
      css += steps(id, `k${i}`, 'none', [[3, `translate(${f(410 + i * 80 - x)}px, ${68 - SY[i]}px)`, f(0.8 + i * 0.15)]], { box: false });
    });
    const box = `<rect x="370" y="122" width="226" height="118" rx="12" fill="white" stroke="${C.green}" stroke-width="3"/>`
      + text(483, 172, '음식을 오래 두는', { size: 22 }) + text(483, 206, '여러 방법', { size: 22 });
    body += at(3, 'pop', box, 1.8);
    body += `<g class="b3">${g('fin fin3', text(483, 274, '새 중심 문장', { size: 18, color: C.green }), 2.1)}</g>`;
    // 칸 4
    body += glowRect(364, 116, 238, 130, 4, C.green, 0.1, 14);
    body += at(4, 'pop', tag(483, 328, '재구성', ROLE.y, 24), 0.6);
    put(K + '3/재구성', svg(id, body, css));
  })();

  // ── 3단원: 세부(중심 내용 '우리 반 소풍' 아래로 날짜·탈것·점심이 작은 가지로 달린다) ──────────────────────────────
  (function () {
    const id = 't71-k3-sebu';
    let css = base(id);
    const DX = [150, 320, 490], DET = ['5월 3일', '버스 두 대', '점심 김밥'], LAB = ['때', '탈것', '먹은 것'];
    let body = at(1, 'pop', tile(320, 62, '우리 반 소풍', { size: 28, h: 60, fill: C.mint, stroke: C.green, sw: 4 }));
    body += at(1, 'fin', text(320, 124, '중심 내용', { size: 19, color: C.green }), 0.5);
    DX.forEach((x, i) => {
      body += drawLine(`M320 136 L${x} 182`, C.muted, 2, { width: 3, delay: 0.1 + i * 0.2 });
      body += at(2, 'pop', `<g class="d${i}">${tile(x, 206, DET[i], { size: 22, h: 46 })}</g>`, 0.7 + i * 0.2);
      body += at(3, 'fin', text(x, 254, LAB[i], { size: 19, color: C.purple }), 0.4 + i * 0.5);
      css += paint(id, `.d${i}`, ROLE.x, 3, f(0.3 + i * 0.5)) + pulseCss(id, `.d${i}`, 3, f(0.3 + i * 0.5));
    });
    // 칸 3: 돋보기가 작은 조각들을 훑는다
    body += `<g class="h4"><g class="b3"><g class="ln">${lens(130, 186, 22, C.purple)}</g></g></g>`;
    css += `@keyframes ${id}-scan { 0% { transform: none; opacity: 1; } 85% { opacity: 1; } 100% { transform: translateX(400px); opacity: 0; } }
      .on3 .sc-${id} .ln { animation: ${id}-scan 1.8s ease-in-out .2s both; }`;
    // 칸 4: 아래 묶음
    body += at(4, 'fin', braceBottom(70, 570, 272, C.purple), 0.2);
    body += at(4, 'pop', tag(320, 326, '세부', ROLE.y, 24), 0.6);
    put(K + '3/세부', svg(id, body, css));
  })();

  // ── 3단원: 예시(흐릿한 생각 '겨울잠 자는 동물' 아래에 곰·개구리·다람쥐 본보기가 놓이자 또렷해진다) ──────────────────────────────
  (function () {
    const id = 't71-k3-yesi';
    let css = base(id);
    const EX = [['곰', 160], ['개구리', 320], ['다람쥐', 480]];
    let body = at(1, 'pop', tile(320, 62, '겨울잠 자는 동물', { size: 26, h: 58, fill: 'white', stroke: C.muted, dash: '9 7' }));
    body += at(3, 'fin', tile(320, 62, '겨울잠 자는 동물', { size: 26, h: 58, fill: C.sky, stroke: C.blue, sw: 4 }), 0.9);
    body += at(1, 'fin', text(120, 69, '생각', { size: 19, color: C.muted }), 0.4);
    EX.forEach(([l, x], i) => {
      body += at(2, 'pop', tile(x, 212, l, { size: 26, h: 56, fill: TAN, stroke: C.orange }), 0.3 + i * 0.3);
      const zx = x + wOf(l, 26) / 2 + 12;
      body += `<g class="b2"><g class="zz" style="animation-delay:${f(0.8 + i * 0.3)}s">${text(zx, 214, 'z', { size: 20, color: C.purple, anchor: 'start' })}${text(zx + 14, 198, 'z', { size: 24, color: C.purple, anchor: 'start' })}</g></g>`;
      body += drawLine(`M${x} 182 L${x < 320 ? 290 : x > 320 ? 350 : 320} 96`, C.blue, 3, { width: 3, delay: 0.1 + i * 0.15 });
    });
    css += `@keyframes ${id}-z { 0% { opacity: 0; transform: none; } 40% { opacity: 1; } 100% { opacity: 0; transform: translate(6px, -14px); } }
      .on2 .sc-${id} .zz { animation: ${id}-z 1.6s ease-out infinite; }`;
    // 칸 4
    body += glowRect(100, 176, 440, 72, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(320, 300, '예시', ROLE.y, 24), 0.6);
    put(K + '3/예시', svg(id, body, css));
  })();

  // ── 4단원: 설명문(무지개를 설명하는 글이 처음·가운데·끝 차례로 채워지고 읽는 사람이 알게 된다) ──────────────────────────────
  (function () {
    const id = 't71-k4-seolmyeong';
    let css = base(id);
    const rainbow = (x, y) => [[C.red, 52], [C.orange, 42], [C.yellow, 32], [C.green, 22], [C.blue, 12]]
      .map(([c, r]) => `<path d="M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y}" stroke="${c}" stroke-width="9" fill="none"/>`).join('');
    let body = at(1, 'fin', `<rect x="150" y="22" width="260" height="316" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(1, 'pop', rainbow(530, 110), 0.3) + at(1, 'rise', tag(530, 140, '무지개', ROLE.s, 22), 0.6);
    body += drawArrow(474, 100, 420, 100, C.muted, 1, { width: 3, delay: 0.9 });
    // 처음
    body += at(2, 'pop', tag(90, 66, '처음', ROLE.o, 22), 0.1);
    body += at(2, 'rise', tag(240, 52, '무지개란?', ROLE.o, 19) + bar(176, 86, 210), 0.4);
    // 가운데
    body += at(3, 'pop', tag(90, 170, '가운데', ROLE.s, 22), 0.1);
    body += at(3, 'rise', badge(184, 136, 1, C.blue) + text(208, 143, '생기는 때', { size: 19, anchor: 'start' }) + bar(176, 166, 200), 0.4);
    body += at(3, 'rise', badge(184, 200, 2, C.blue) + text(208, 207, '일곱 가지 색', { size: 19, anchor: 'start' }) + bar(176, 230, 190), 0.9);
    // 끝
    body += at(4, 'pop', tag(90, 286, '끝', ROLE.p, 22), 0.1);
    body += at(4, 'rise', tag(220, 274, '정리', ROLE.p, 19) + bar(176, 306, 196), 0.3);
    body += at(4, 'pop', person(530, 320, C.green, 18) + `<circle cx="566" cy="252" r="15" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><rect x="560" y="266" width="12" height="8" rx="2" fill="${C.muted}"/>`, 0.8);
    body += drawArrow(420, 290, 500, 290, C.green, 4, { width: 3, delay: 0.6 });
    body += at(4, 'pop', tag(530, 206, '설명문', ROLE.y, 24), 1.2);
    put(K + '4/설명문', svg(id, body, css));
  })();

  // ── 4단원: 도표(흩어진 쪽지가 줄과 칸에 들어가고, 옆에 막대가 자란다) ──────────────────────────────
  (function () {
    const id = 't71-k4-dopyo';
    let css = base(id);
    const D = [['봄', 8], ['여름', 12], ['가을', 6], ['겨울', 4]], RY = [118, 166, 214, 262];
    const SC = [[420, 70, -8], [540, 150, 6], [410, 210, 5], [530, 290, -6]];
    let body = at(2, 'fin', `<rect x="36" y="44" width="268" height="242" rx="10" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="M36 94 H304 M140 44 V286" stroke="${C.ink}" stroke-width="2"/>`
      + text(88, 78, '계절', { size: 19 }) + text(222, 78, '사람 수', { size: 19 }), 0.6);
    D.forEach(([l, v], i) => {
      const y = RY[i], [sx, sy, r] = SC[i];
      // 쪽지(칸 1, 흩어짐) → 칸 2에 제 줄로 날아가 사라지고 그 자리에 표의 줄이 나타난다
      body += `<g class="b1"><g class="nt${i}">${g('pop pop1', `<rect x="110" y="${y - 22}" width="120" height="44" rx="6" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/>` + text(170, y + 7, l + ' ' + v + '명', { size: 20 }), 0.1 + i * 0.15)}</g></g>`;
      css += `.sc-${id} .nt${i} { transform-box: fill-box; transform-origin: center; transform: translate(${sx - 170}px, ${sy - y}px) rotate(${r}deg); transition: transform .9s ease-in-out ${f(0.1 + i * 0.12)}s, opacity .4s ease ${f(1.1 + i * 0.12)}s; }
        .on2 .sc-${id} .nt${i} { transform: none; opacity: 0; }`;
      body += at(2, 'fin', `<rect x="44" y="${y - 20}" width="252" height="40" rx="6" fill="${TAN}" stroke="${C.orange}" stroke-width="2"/>` + text(88, y + 7, l, { size: 20 }) + text(222, y + 7, v + '명', { size: 20 }), f(1.1 + i * 0.12));
      // 칸 3: 막대
      const x = 390 + i * 62, h = v * 17;
      body += `<g class="b3"><g class="br${i}"><rect x="${x - 20}" y="${300 - h}" width="40" height="${h}" rx="4" fill="${[C.mint, C.peach, C.sky, C.lilac][i]}" stroke="${[C.green, C.orange, C.blue, C.purple][i]}" stroke-width="2.5"/></g></g>`;
      css += growCss(id, `.br${i}`, 3, { axis: 'Y', origin: 'center bottom', delay: f(0.3 + i * 0.2) });
      body += at(3, 'fin', text(x, 326, l, { size: 18 }) + text(x, 292 - h, v, { size: 18, color: C.muted }), f(0.9 + i * 0.2));
    });
    body += at(3, 'fin', `<path d="M356 300 H620 M356 300 V80" stroke="${C.ink}" stroke-width="2.5"/>`, 0.1);
    // 칸 4
    body += glowRect(30, 38, 280, 254, 4, C.green, 0.1, 12) + glowRect(352, 70, 274, 270, 4, C.green, 0.3, 12);
    body += at(4, 'pop', tag(170, 324, '도표', ROLE.y, 24), 0.7);
    put(K + '4/도표', svg(id, body, css));
  })();

  // ── 4단원: 시각 자료(글만 있던 쪽 옆에 그림·사진·도표 카드가 하나씩 붙는다) ──────────────────────────────
  (function () {
    const id = 't71-k4-sigak';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="26" y="24" width="270" height="312" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    [52, 76, 100, 140, 164, 188, 228, 252, 276].forEach((y, i) => { body += at(1, 'fin', bar(48, y, [226, 200, 150, 226, 210, 120, 226, 190, 140][i]), 0.1 + i * 0.05); });
    const card = (x, y, w, h, inner, label, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="white" stroke="${col[1]}" stroke-width="3"/>` + inner + tag(x + 34, y + h, label, col, 18);
    // 칸 2: 달 모양 그림
    const R = 19, MX = [376, 432, 488, 544], MY = 76;
    const moons = `<circle cx="${MX[0]}" cy="${MY}" r="${R}" fill="white" stroke="${C.muted}" stroke-width="2"/><path d="M${MX[0]} ${MY - R} A${R} ${R} 0 0 1 ${MX[0]} ${MY + R} A${R * 0.55} ${R} 0 0 0 ${MX[0]} ${MY - R} Z" fill="${C.yellow}"/>`
      + `<circle cx="${MX[1]}" cy="${MY}" r="${R}" fill="white" stroke="${C.muted}" stroke-width="2"/><path d="M${MX[1]} ${MY - R} A${R} ${R} 0 0 1 ${MX[1]} ${MY + R} Z" fill="${C.yellow}"/>`
      + `<circle cx="${MX[2]}" cy="${MY}" r="${R}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`
      + `<circle cx="${MX[3]}" cy="${MY}" r="${R}" fill="white" stroke="${C.muted}" stroke-width="2"/><path d="M${MX[3]} ${MY - R} A${R} ${R} 0 0 0 ${MX[3]} ${MY + R} Z" fill="${C.yellow}"/>`;
    body += at(2, 'slideL', card(338, 30, 244, 92, moons, '그림', ROLE.o), 0.2);
    body += `<g class="b2">${g('fin fin2', dashed(298, 76, 336, 76, C.orange, 3), 0.8)}</g>`;
    // 칸 3: 사진과 도표
    const photo = `<rect x="352" y="168" width="96" height="70" rx="4" fill="${C.sky}"/><path d="M352 238 L384 196 L404 218 L420 200 L448 238 Z" fill="${C.green}"/><circle cx="428" cy="184" r="9" fill="${C.yellow}"/>`;
    const chart = `<path d="M486 238 H578 M486 238 V170" stroke="${C.ink}" stroke-width="2"/>` + [[500, 40], [522, 58], [544, 30], [566, 50]].map(([x, h]) => `<rect x="${x - 8}" y="${238 - h}" width="16" height="${h}" fill="${C.blue}"/>`).join('');
    body += at(3, 'slideL', card(338, 154, 124, 98, photo, '사진', ROLE.s), 0.2);
    body += at(3, 'slideL', card(474, 154, 118, 98, chart, '도표', ROLE.x), 0.6);
    body += `<g class="b3">${g('fin fin3', dashed(298, 152, 336, 186, C.blue, 3) + dashed(298, 240, 470, 240, C.purple, 3), 1.1)}</g>`;
    // 칸 4
    body += glowRect(330, 24, 268, 248, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(464, 318, '시각 자료', ROLE.y, 24), 0.6);
    put(K + '4/시각 자료', svg(id, body, css));
  })();

  // 6단원에 같이 쓰는 그림: 말풍선, 노트북
  const bubble = (cx, cy, label, [fill, stroke], size = 22, tail = 'left') => {
    const w = wOf(label, size) + 6, h = size + 26, x0 = cx - w / 2, y1 = cy + h / 2, tx = tail === 'left' ? x0 + 22 : x0 + w - 22, d = tail === 'left' ? -10 : 10;
    return `<rect x="${f(x0)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
      + `<path d="M${f(tx - 8)} ${f(y1 - 1.5)} L${f(tx + d)} ${f(y1 + 16)} L${f(tx + 8)} ${f(y1 - 1.5)}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${f(tx - 6)} ${f(y1 - 1.5)} H${f(tx + 6)}" stroke="${fill}" stroke-width="4"/>`
      + text(f(cx), f(cy + size * 0.36), label, { size });
  };
  const laptop = (x, y, col = C.ink) => `<rect x="${x - 34}" y="${y - 44}" width="68" height="46" rx="5" fill="white" stroke="${col}" stroke-width="3"/><rect x="${x - 27}" y="${y - 37}" width="54" height="32" rx="2" fill="${C.sky}"/><path d="M${x - 46} ${y + 8} H${x + 46} L${x + 38} ${y + 2} H${x - 38} Z" fill="${col}"/>`;

  // ── 6단원: 상호 작용(두 사람이 말을 주고받으며 서로의 생각을 바꾸어 날짜를 함께 정한다) ──────────────────────────────
  (function () {
    const id = 't71-k6-sangho';
    let css = base(id);
    let body = at(1, 'pop', person(110, 250, C.blue, 24)) + at(1, 'pop', person(530, 250, C.orange, 24), 0.2);
    const cal = (inner) => `<rect x="286" y="34" width="68" height="62" rx="8" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="286" y="34" width="68" height="18" rx="6" fill="${C.red}"/>` + inner;
    body += `<g class="h4">${at(1, 'pop', cal(text(320, 88, '?', { size: 28, color: C.muted })), 0.5)}</g>`;
    // 칸 2: 왼쪽 사람이 묻는다
    body += `<g class="h3">${at(2, 'pop', bubble(140, 120, '월요일?', ROLE.s, 22, 'left'), 0.1)}</g>`;
    body += `<g class="h4">${drawArrow(160, 200, 476, 200, C.blue, 2, { width: 4, delay: 0.6 })}</g>`;
    // 칸 3: 오른쪽 사람이 답하고, 왼쪽 사람의 생각이 바뀐다
    body += at(3, 'pop', bubble(500, 120, '수요일!', ROLE.o, 22, 'right'), 0.1);
    body += `<g class="h4">${drawArrow(480, 236, 164, 236, C.orange, 3, { width: 4, delay: 0.6 })}</g>`;
    body += at(3, 'pop', bubble(140, 120, '좋아!', ROLE.s, 22, 'left'), 1.7);
    // 칸 4: 둘이 함께 정한 날짜, 서로 도는 화살표
    body += at(4, 'pop', cal(text(320, 88, '수', { size: 28, color: C.green })), 0.1);
    body += curve(170, 290, 470, 290, 330, C.green, 4, { width: 4, delay: 0.3 }) + curve(470, 172, 170, 172, 150, C.green, 4, { width: 4, delay: 0.6 });
    body += at(4, 'pop', tag(320, 222, '상호 작용', ROLE.y, 24), 1.3);
    put(K + '6/상호 작용', svg(id, body, css));
  })();

  // ── 6단원: 쌍방향(텔레비전은 한쪽으로만, 온라인 수업은 질문과 대답이 양쪽으로 오간다) ──────────────────────────────
  (function () {
    const id = 't71-k6-ssangbang';
    let css = base(id);
    const tv = (x, y) => `<rect x="${x - 46}" y="${y - 34}" width="92" height="68" rx="8" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${x - 38}" y="${y - 26}" width="76" height="52" rx="3" fill="${C.sky}"/><path d="M${x - 16} ${y + 34} L${x - 24} ${y + 48} M${x + 16} ${y + 34} L${x + 24} ${y + 48}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
    let body = `<path d="M320 24 V300" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`;
    // 왼쪽: 한쪽으로만
    body += at(1, 'pop', tv(80, 140)) + at(1, 'pop', person(250, 170, C.muted, 20), 0.2);
    body += drawArrow(132, 130, 214, 130, C.muted, 1, { width: 4, delay: 0.5 });
    body += at(1, 'fin', text(160, 270, '한쪽으로만', { size: 20, color: C.muted }), 0.8);
    // 칸 2: 물음이 돌아가지 못한다
    body += `<g class="b2"><g class="q1">${tag(226, 196, '?', ROLE.s, 22)}</g></g>`;
    css += steps(id, 'q1', 'none', [[2, 'translate(-36px, 0px)', 0.2]], { dur: 0.8, box: false });
    body += at(2, 'pop', cross(138, 196, 11), 1.1);
    css += `.on2 .sc-${id} .q1 > * { animation: ${id}-shake .5s ease-in-out 1.2s 2; }`;
    // 오른쪽: 양쪽으로
    body += at(3, 'pop', laptop(410, 160)) + at(3, 'pop', person(410, 136, C.orange, 9), 0.1) + at(3, 'pop', person(570, 170, C.blue, 20), 0.2);
    body += drawArrow(466, 118, 534, 118, C.orange, 3, { width: 4, delay: 0.4 }) + drawArrow(534, 210, 466, 210, C.blue, 3, { width: 4, delay: 0.8 });
    body += `<g class="b3"><g class="q2">${tag(538, 210, '?', ROLE.s, 22)}</g></g><g class="b3"><g class="a2">${tag(462, 118, '!', ROLE.o, 22)}</g></g>`;
    css += `.sc-${id} .a2 { opacity: 0; }
      @keyframes ${id}-q { 0% { transform: none; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateX(-76px); opacity: 0; } }
      @keyframes ${id}-a { 0% { transform: none; opacity: 0; } 15% { opacity: 1; } 100% { transform: translateX(76px); opacity: 1; } }
      .on3 .sc-${id} .q2 { animation: ${id}-q 1.2s ease-in-out 1.2s both; }
      .on3 .sc-${id} .a2 { animation: ${id}-a 1.2s ease-in-out 2.4s both; }`;
    // 칸 4
    body += glowRect(338, 70, 282, 180, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(480, 290, '쌍방향', ROLE.y, 24), 0.6);
    put(K + '6/쌍방향', svg(id, body, css));
  })();

  // 생산자·수용자가 같이 쓰는 판: 왼쪽 만드는 사람, 가운데 누리집, 오른쪽 받는 사람 셋
  const RY6 = [78, 176, 274];
  const mediaBase = (dimProducer, dimReceivers) => {
    let b = `<g class="${dimProducer ? 'pd' : ''}">` + at(1, 'pop', person(90, 236, C.orange, 22) + laptop(90, 300)) + '</g>';
    b += at(1, 'fin', browser(228, 96, 196, 150, { barH: 28 }), 0.2);
    b += `<g class="${dimReceivers ? 'rc' : ''}">`;
    return b;
  };

  // ── 6단원: 생산자(만드는 사람이 글·사진·영상을 만들어 누리집에 올리고, 그것이 여러 사람에게 퍼진다) ──────────────────────────────
  (function () {
    const id = 't71-k6-saengsan';
    let css = base(id);
    let body = mediaBase(false, true);
    body += RY6.map((y, i) => at(3, 'pop', person(560, y + 18, C.muted, 14), 0.6 + i * 0.15)).join('') + '</g>';
    // 칸 2: 만든 것이 누리집으로
    [['글', 146], ['사진', 184], ['영상', 222]].forEach(([l, y], i) => {
      const y0 = 160 + i * 46;
      body += `<g class="b2"><g class="ch${i}">${g('pop pop2', tag(172, y0, l, ROLE.o, 20), 0.1 + i * 0.25)}</g></g>`;
      css += steps(id, `ch${i}`, 'none', [[2, `translate(${326 - 172}px, ${y - y0}px)`, f(1.0 + i * 0.2)]], { box: false });
    });
    // 칸 3: 여러 사람에게 퍼진다
    body += RY6.map((y, i) => drawArrow(430, 171, 528, y + 6, C.muted, 3, { width: 3, delay: 0.2 + i * 0.1 })).join('');
    // 칸 4: 만든 사람
    body += `<g class="b4"><circle class="ring ring4" cx="90" cy="230" r="48" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    body += glowRect(36, 170, 108, 150, 4, C.orange, 0.2, 16);
    body += at(4, 'pop', tag(90, 342, '생산자', ROLE.y, 22), 0.6);
    css += `.sc-${id} .rc { opacity: .75; }`;
    put(K + '6/생산자', svg(id, body, css));
  })();

  // ── 6단원: 수용자(누리집의 광고가 세 사람에게 닿고, 사람마다 다르게 받아들인다) ──────────────────────────────
  (function () {
    const id = 't71-k6-suyong';
    let css = base(id);
    let body = mediaBase(true, false);
    body += RY6.map((y, i) => at(2, 'pop', person(560, y + 18, C.blue, 14), 1.0 + i * 0.15)).join('') + '</g>';
    body += at(1, 'fin', tag(326, 150, '광고', ROLE.o, 20) + bar(258, 196, 136) + bar(258, 218, 100), 0.5);
    // 칸 2: 사람들에게 닿는다
    body += RY6.map((y, i) => drawArrow(430, 171, 528, y + 6, C.blue, 2, { width: 3, delay: 0.2 + i * 0.1 })).join('');
    // 칸 3: 사람마다 다른 반응
    const heart = `<path d="${heartD(612, RY6[0] - 6, 0.3)}" fill="${C.red}"/>`;
    body += at(3, 'pop', heart, 0.2);
    body += at(3, 'pop', `<circle cx="612" cy="${RY6[1] - 4}" r="14" fill="white" stroke="${C.purple}" stroke-width="3"/>` + text(612, RY6[1] + 4, '?', { size: 20, color: C.purple }), 0.6);
    body += at(3, 'pop', sparkle(612, RY6[2] - 6, 1.1), 1.0);
    // 칸 4: 받는 사람들
    body += glowRect(520, 30, 112, 284, 4, C.blue, 0.2, 16);
    body += at(4, 'pop', tag(560, 340, '수용자', ROLE.y, 22), 0.6);
    css += `.sc-${id} .pd { opacity: .45; }`;
    put(K + '6/수용자', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
