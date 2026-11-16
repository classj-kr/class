// 국어 7-2(중학교 1학년 2학기) 낱말 도식:
// 1단원 희곡, 3단원 담화·맥락, 4단원 형태소·어근·접사·접두사·접미사·단일어·복합어·합성어·파생어·새말,
// 5단원 양상, 7단원 모호하다·명확하다. 4단원 색 약속: 어근 초록, 접사 보라.
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

  const K = '7-2/국어/';
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


  const sent = (labels, { y = 76, size = 26, gaps = [], cx = 320 } = {}) => {
    const ws = labels.map((l) => wOf(l, size)), gs = labels.slice(1).map((_, i) => (gaps[i] == null ? 14 : gaps[i]));
    let x = cx - (ws.reduce((a, b) => a + b, 0) + gs.reduce((a, b) => a + b, 0)) / 2;
    return labels.map((label, i) => { const p = { label, cx: x + ws[i] / 2, w: ws[i], y, size, l: x, r: x + ws[i] }; x += ws[i] + (gs[i] || 0); return p; });
  };
  const bubble = (cx, cy, label, [fill, stroke], size = 22, tail = 'left') => {
    const w = wOf(label, size) + 6, h = size + 26, x0 = cx - w / 2, y1 = cy + h / 2, tx = tail === 'left' ? x0 + 22 : x0 + w - 22, d = tail === 'left' ? -10 : 10;
    return `<rect x="${f(x0)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
      + `<path d="M${f(tx - 8)} ${f(y1 - 1.5)} L${f(tx + d)} ${f(y1 + 14)} L${f(tx + 8)} ${f(y1 - 1.5)}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${f(tx - 6)} ${f(y1 - 1.5)} H${f(tx + 6)}" stroke="${fill}" stroke-width="4"/>`
      + text(f(cx), f(cy + size * 0.36), label, { size });
  };

  // ── 1단원: 희곡(해설·대사·지문으로 된 글이 무대의 배경·말·움직임이 된다) ──────────────────────────────
  (function () {
    const id = 't72-k1-huigok';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="24" y="24" width="276" height="312" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    // 해설
    body += at(1, 'fin', `<rect x="40" y="40" width="244" height="82" rx="8" fill="${C.sky}" fill-opacity=".6"/>` + text(56, 70, '때: 봄날 아침', { size: 19, anchor: 'start' }) + text(56, 102, '곳: 숲속 오두막', { size: 19, anchor: 'start' }), 0.2);
    // 대사와 지문
    body += at(1, 'fin', `<rect x="40" y="138" width="244" height="44" rx="8" fill="${C.peach}" fill-opacity=".7"/>` + text(56, 167, '토끼: 안녕?', { size: 20, anchor: 'start' }), 0.4);
    body += at(1, 'fin', `<rect x="40" y="196" width="244" height="44" rx="8" fill="${C.lilac}" fill-opacity=".8"/>` + text(56, 225, '(깡충 뛰며)', { size: 20, anchor: 'start', color: C.purple }), 0.6);
    body += at(1, 'fin', bar(56, 262, 200) + bar(56, 284, 150) + bar(56, 306, 180), 0.8);
    // 무대
    body += at(1, 'fin', `<rect x="340" y="40" width="276" height="250" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M340 250 H616" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M340 40 Q372 120 352 250 L340 250 Z M616 40 Q584 120 604 250 L616 250 Z" fill="${C.red}" opacity=".85"/>`, 0.3);
    // 칸 2: 해설 → 무대 배경(해, 오두막)
    body += at(2, 'pop', tag(162, 30, '해설', ROLE.s, 20), 0.1);
    body += at(2, 'fin', sun(410, 86, 16) + `<path d="M500 250 V196 L540 168 L580 196 V250 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><rect x="530" y="214" width="20" height="36" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`, 0.6);
    body += curve(284, 80, 380, 90, 50, C.blue, 2, { width: 3, delay: 0.3 });
    // 칸 3: 대사 → 말풍선, 지문 → 움직임
    body += at(3, 'pop', tag(238, 138, '대사', ROLE.o, 19), 0.1) + at(3, 'pop', tag(238, 196, '지문', ROLE.x, 19), 0.3);
    const rabbit = `<ellipse cx="430" cy="226" rx="20" ry="24" fill="white" stroke="${C.ink}" stroke-width="3"/><ellipse cx="422" cy="188" rx="6" ry="16" fill="white" stroke="${C.ink}" stroke-width="3"/><ellipse cx="438" cy="188" rx="6" ry="16" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="430" cy="208" r="13" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    body += `<g class="b3"><g class="rb">${rabbit}</g></g>`;
    css += `@keyframes ${id}-hop { 0%, 100% { transform: none; } 30% { transform: translate(12px, -34px); } 60% { transform: translate(24px, 0); } }
      .sc-${id} .rb { transition: transform .4s; } .on3 .sc-${id} .rb { animation: ${id}-hop .9s ease-in-out 1s 2; }`;
    body += at(3, 'pop', bubble(400, 146, '안녕?', ROLE.o, 20, 'right'), 0.6);
    // 칸 4
    body += glowRect(18, 18, 288, 324, 4, C.green, 0.1, 14);
    body += drawArrow(306, 300, 334, 300, C.green, 4, { width: 4, delay: 0.3 });
    body += at(4, 'pop', tag(478, 320, '희곡', ROLE.y, 24), 0.7);
    put(K + '1/희곡', svg(id, body, css));
  })();

  // ── 3단원: 담화(전화로 '여보세요'부터 '끊을게'까지 주고받은 말 전체가 한 덩어리) ──────────────────────────────
  (function () {
    const id = 't72-k3-damhwa';
    let css = base(id);
    let body = at(1, 'pop', person(80, 200, C.blue, 24)) + at(1, 'pop', person(560, 200, C.orange, 24), 0.2);
    const B = [['여보세요?', 'L', 50, 1], ['응, 나야.', 'R', 108, 2], ['내일 만나!', 'L', 166, 2], ['그래, 끊을게.', 'R', 224, 2]];
    B.forEach(([l, s, y, n], i) => {
      const left = s === 'L', x = left ? 250 : 390;
      body += at(n, left ? 'slide' : 'slideL', bubble(x, y, l, left ? ROLE.s : ROLE.o, 22, left ? 'left' : 'right'), i === 0 ? 0.6 : 0.2 + (i - 1) * 0.5);
    });
    // 칸 3: 한 덩어리로 묶는 괄호
    body += at(3, 'fin', `<rect x="148" y="16" width="344" height="252" rx="20" fill="none" stroke="${C.green}" stroke-width="4" stroke-dasharray="10 7"/>`, 0.2);
    body += at(3, 'pop', tag(320, 296, '여러 말 → 한 덩어리', ROLE.p, 20), 0.8);
    // 칸 4
    body += glowRect(142, 10, 356, 264, 4, C.green, 0.1, 22);
    body += at(4, 'pop', tag(320, 338, '담화', ROLE.y, 24), 0.6);
    put(K + '3/담화', svg(id, body, css));
  })();

  // ── 3단원: 맥락(같은 '대박!'이 선물을 받았을 때와 숙제를 잃어버렸을 때 다른 뜻이 된다) ──────────────────────────────
  (function () {
    const id = 't72-k3-maengnak';
    let css = base(id);
    let body = at(1, 'pop', bubble(320, 60, '대박!', ['white', C.ink], 28, 'left'));
    body += `<g class="h2">${at(1, 'pop', text(320, 140, '?', { size: 34, color: C.muted }), 0.5)}</g>`;
    // 칸 2: 선물을 받은 때
    const gift = (x, y) => `<rect x="${x - 30}" y="${y - 20}" width="60" height="48" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M${x} ${y - 20} V${y + 28} M${x - 30} ${y} H${x + 30}" stroke="${C.red}" stroke-width="4"/><path d="M${x} ${y - 20} Q${x - 16} ${y - 40} ${x - 10} ${y - 24} Z M${x} ${y - 20} Q${x + 16} ${y - 40} ${x + 10} ${y - 24} Z" fill="${C.red}"/>`;
    body += at(2, 'fin', `<rect x="30" y="112" width="260" height="196" rx="16" fill="${C.mint}" fill-opacity=".5" stroke="${C.green}" stroke-width="3"/>`, 0.1);
    body += at(2, 'pop', gift(110, 196), 0.4) + at(2, 'pop', `<path d="${heartD(220, 192, 0.6)}" fill="${C.red}"/>`, 0.9);
    body += at(2, 'pop', tag(160, 278, '기뻐요', ROLE.p, 20), 1.2);
    body += curve(270, 70, 200, 120, 80, C.green, 2, { width: 3, delay: 0.2 });
    // 칸 3: 숙제를 잃어버린 때
    const noteX = (x, y) => `<rect x="${x - 26}" y="${y - 32}" width="52" height="64" rx="4" fill="white" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 5"/>` + text(x, y + 10, '?', { size: 28, color: C.muted });
    body += at(3, 'fin', `<rect x="350" y="112" width="260" height="196" rx="16" fill="${C.peach}" fill-opacity=".5" stroke="${C.orange}" stroke-width="3"/>`, 0.1);
    body += at(3, 'pop', noteX(430, 192), 0.4) + at(3, 'pop', `<circle cx="540" cy="192" r="26" fill="white" stroke="${C.orange}" stroke-width="3"/><circle cx="531" cy="186" r="3" fill="${C.ink}"/><circle cx="549" cy="186" r="3" fill="${C.ink}"/><circle cx="540" cy="204" r="6" fill="none" stroke="${C.ink}" stroke-width="3"/>`, 0.9);
    body += at(3, 'pop', tag(480, 278, '큰일 났어요', ROLE.o, 20), 1.2);
    body += curve(370, 70, 440, 120, 80, C.orange, 3, { width: 3, delay: 0.2 });
    // 칸 4: 말을 둘러싼 사정
    body += glowRect(24, 106, 272, 208, 4, C.green, 0.1, 18) + glowRect(344, 106, 272, 208, 4, C.orange, 0.3, 18);
    body += at(4, 'pop', tag(320, 336, '맥락', ROLE.y, 24), 0.7);
    put(K + '3/맥락', svg(id, body, css));
  })();

  // ── 5단원: 양상(같은 물건도 세대에 따라, 지역에 따라 부르는 낱말이 다르게 나타난다) ──────────────────────────────
  (function () {
    const id = 't72-k5-yangsang';
    let css = base(id);
    const camera = (x, y) => `<rect x="${x - 34}" y="${y - 20}" width="68" height="46" rx="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="${x - 14}" y="${y - 30}" width="26" height="12" rx="3" fill="${C.blue}"/><circle cx="${x}" cy="${y + 3}" r="14" fill="white" stroke="${C.blue}" stroke-width="3"/><circle cx="${x}" cy="${y + 3}" r="6" fill="${C.blue}"/>`;
    const chive = (x, y) => [-14, -5, 4, 13].map((d, i) => `<path d="M${x + d / 2} ${y + 30} Q${x + d} ${y} ${x + d * 1.8} ${y - 34 + i % 2 * 6}" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') + `<rect x="${x - 14}" y="${y + 22}" width="28" height="10" rx="3" fill="${C.orange}"/>`;
    // 칸 1·2: 세대
    let body = at(1, 'pop', camera(160, 60));
    body += at(1, 'fin', `<path d="M160 92 V110 M160 110 H70 V128 M160 110 H250 V128" stroke="${C.muted}" stroke-width="3" fill="none"/>`, 0.4);
    body += at(1, 'pop', person(70, 170, C.muted, 16) + person(250, 172, C.blue, 13), 0.6);
    body += at(2, 'pop', tag(70, 222, '사진기', ROLE.g, 20), 0.2) + at(2, 'pop', tag(250, 222, '카메라', ROLE.s, 20), 0.6);
    body += at(2, 'fin', text(70, 262, '할아버지', { size: 18, color: C.muted }) + text(250, 262, '우리', { size: 18, color: C.blue }), 0.9);
    body += at(2, 'pop', tag(160, 300, '세대', ROLE.x, 20), 1.2);
    // 칸 3: 지역
    body += at(3, 'pop', chive(480, 64));
    body += at(3, 'fin', `<path d="M480 100 V110 M480 110 H390 V128 M480 110 H570 V128" stroke="${C.muted}" stroke-width="3" fill="none"/>`, 0.3);
    const pin = (x, y, c) => `<path d="M${x} ${y + 18} C${x - 18} ${y - 2} ${x - 14} ${y - 22} ${x} ${y - 22} C${x + 14} ${y - 22} ${x + 18} ${y - 2} ${x} ${y + 18} Z" fill="${c}"/><circle cx="${x}" cy="${y - 8}" r="6" fill="white"/>`;
    body += at(3, 'pop', pin(390, 160, C.blue) + pin(570, 160, C.orange), 0.5);
    body += at(3, 'pop', tag(390, 222, '부추', ROLE.s, 20), 0.8) + at(3, 'pop', tag(570, 222, '정구지', ROLE.o, 20), 1.1);
    body += at(3, 'fin', text(390, 262, '서울', { size: 18, color: C.blue }) + text(570, 262, '경상도', { size: 18, color: C.orange }), 1.3);
    body += at(3, 'pop', tag(480, 300, '지역', ROLE.x, 20), 1.5);
    // 칸 4
    body += glowRect(24, 200, 272, 120, 4, C.purple, 0.1, 16) + glowRect(344, 200, 272, 120, 4, C.purple, 0.3, 16);
    body += at(4, 'pop', tag(320, 340, '양상', ROLE.y, 24), 0.7);
    put(K + '5/양상', svg(id, body, css));
  })();

  // 모호하다·명확하다가 같이 쓰는 판: 위에 말풍선, 가운데 한 주 달력, 아래 두 친구
  const DAYS = ['월', '화', '수', '목', '금', '토', '일'], DX = (i) => 110 + i * 70;
  const week = (n) => at(n, 'fin', DAYS.map((d, i) => `<rect x="${DX(i) - 30}" y="120" width="60" height="64" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(DX(i), 160, d, { size: 22, color: i > 4 ? C.red : C.ink })).join(''), 0.1);

  // ── 7단원: 모호하다('나중에 만나자' — 어느 날인지 흐릿해서 두 친구가 다른 날에 간다) ──────────────────────────────
  (function () {
    const id = 't72-k7-moho';
    let css = base(id);
    let body = at(1, 'pop', `<g class="bb">${bubble(320, 50, '나중에 만나자!', ['white', C.ink], 26, 'left')}</g>`);
    body += week(1);
    // 칸 2: 물음표가 여러 날 위를 떠돈다
    [0, 2, 3, 5, 6].forEach((i, k) => { body += `<g class="b2"><g class="qm" style="animation-delay:${f(0.2 + k * 0.25)}s">${text(DX(i), 110, '?', { size: 28, color: C.purple })}</g></g>`; });
    css += `@keyframes ${id}-q { 0% { opacity: 0; transform: translateY(8px); } 50% { opacity: 1; transform: none; } 100% { opacity: .55; transform: none; } }
      .on2 .sc-${id} .qm { animation: ${id}-q .9s ease-out both; }`;
    css += `@keyframes ${id}-blur { 0%, 100% { transform: translateX(0); opacity: 1; } 50% { transform: translateX(3px); opacity: .55; } }`;
    // 칸 3: 두 친구가 다른 날에 간다
    body += `<g class="b3"><g class="pa">${person(DX(1), 268, C.blue, 18)}</g></g><g class="b3"><g class="pb">${person(DX(4), 268, C.orange, 18)}</g></g>`;
    css += steps(id, 'pa', 'translateX(-60px)', [[3, 'none', 0.2]], { box: false }) + steps(id, 'pb', 'translateX(60px)', [[3, 'none', 0.4]], { box: false });
    body += glowRect(DX(1) - 34, 116, 68, 72, 3, C.blue, 1.2, 10) + glowRect(DX(4) - 34, 116, 68, 72, 3, C.orange, 1.4, 10);
    body += at(3, 'pop', cross(320, 268, 13), 1.8);
    // 칸 4
    css += `.on4 .sc-${id} .bb { animation: ${id}-blur 1.2s ease-in-out .3s 3; }`;
    body += [0, 2, 3, 5, 6].map((i) => glowRect(DX(i) - 34, 116, 68, 72, 4, C.purple, 0.2, 10)).join('');
    body += at(4, 'pop', tag(560, 290, '모호하다', ROLE.y, 24), 0.7);
    put(K + '7/모호하다', svg(id, body, css));
  })();

  // ── 7단원: 명확하다('토요일 10시, 정문' — 날짜가 하나로 정해져 두 친구가 같은 곳에서 만난다) ──────────────────────────────
  (function () {
    const id = 't72-k7-myeonghwak';
    let css = base(id);
    let body = at(1, 'pop', bubble(320, 50, '토요일 10시, 정문!', ['white', C.ink], 26, 'left'));
    body += week(1);
    // 칸 2: 토요일 한 칸만 또렷하게
    body += at(2, 'fin', `<rect x="${DX(5) - 30}" y="120" width="60" height="64" rx="8" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>` + text(DX(5), 160, '토', { size: 22, color: C.red }), 0.2);
    body += `<g class="b2"><circle class="ring ring2" cx="${DX(5)}" cy="152" r="40" fill="none" stroke="${C.green}" stroke-width="3"/></g>`;
    const clock = (x, y) => `<circle cx="${x}" cy="${y}" r="24" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M${x} ${y} L${x - 11} ${y - 7} M${x} ${y} V${y - 17}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`;
    body += at(2, 'pop', clock(DX(5), 226), 0.8);
    // 칸 3: 두 친구가 같은 곳으로
    body += `<g class="b3"><g class="pa">${person(DX(5) - 26, 300, C.blue, 16)}</g></g><g class="b3"><g class="pb">${person(DX(5) + 26, 300, C.orange, 16)}</g></g>`;
    css += steps(id, 'pa', 'translateX(-300px)', [[3, 'none', 0.2]], { dur: 1.2, box: false }) + steps(id, 'pb', 'translateX(80px)', [[3, 'none', 0.2]], { dur: 1.2, box: false });
    body += at(3, 'pop', check(DX(5) - 90, 300, 12), 1.6);
    // 칸 4
    body += glowRect(183, 18, 274, 64, 4, C.green, 0.1, 18) + glowRect(DX(5) - 36, 114, 72, 76, 4, C.green, 0.3, 12);
    body += at(4, 'pop', tag(170, 290, '명확하다', ROLE.y, 24), 0.7);
    put(K + '7/명확하다', svg(id, body, css));
  })();


  // 4단원 색 약속: 어근 초록, 접사 보라
  const RT = ROLE.p, AF = ROLE.x, WH = ['white', C.line];
  const chip0 = (cx, cy, label, col = ROLE.o) => tile(cx, cy, label, { size: 20, h: 32, rx: 16, fill: col[0], stroke: col[1], sw: 2.5, w: wOf(label, 20) });
  // 조각 하나(글씨 30)
  const blk = (cx, cy, label, col, o = {}) => tile(cx, cy, label, { size: 30, h: 60, fill: col[0], stroke: col[1], sw: 3.5, ...o });
  // 붙은 조각들: parts = [[글자, 색]], 가운데 cx 에 틈 3 으로 붙여 늘어놓는다. 돌려주는 값 { body, xs }
  const glued = (parts, cx, cy, size = 30, gap = 3) => {
    const ws = parts.map(([l]) => wOf(l, size)), total = ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
    let x = cx - total / 2; const xs = [];
    const body = parts.map(([l, col], i) => { const c = x + ws[i] / 2; xs.push(c); x += ws[i] + gap; return tile(c, cy, l, { size, h: size * 2, fill: col[0], stroke: col[1], sw: 3.5, w: ws[i] }); }).join('');
    return { body, xs, ws };
  };
  // 칸 n 에서 붙기: 떨어져 있던 조각(cls)이 dx 만큼 다가와 붙는다
  const joinCss = (id, cls, dx, n, delay = 0.3) => steps(id, cls, `translateX(${dx}px)`, [[n, 'none', delay]], { box: false });

  // ── 4단원: 형태소(눈사람 → 눈 + 사람, 사람을 더 쪼개면 뜻이 사라진다) ──────────────────────────────
  (function () {
    const id = 't72-k4-hyeongtaeso';
    let css = base(id);
    let body = `<g class="h2">${at(1, 'pop', blk(320, 70, '눈사람', ['white', C.ink]))}</g>`;
    // 칸 2: 눈 | 사람
    body += `<g class="b2"><g class="pa">${blk(230, 70, '눈', RT)}</g></g><g class="b2"><g class="pb">${blk(410, 70, '사람', RT)}</g></g>`;
    css += steps(id, 'pa', 'translateX(62px)', [[2, 'none', 0.2]], { box: false }) + steps(id, 'pb', 'translateX(-62px)', [[2, 'none', 0.2]], { box: false });
    body += drawLine('M320 30 V112', C.red, 2, { width: 3, delay: 0.1, cls: '' });
    body += at(2, 'pop', check(230, 140, 11) + check(410, 140, 11), 1.1);
    body += at(2, 'fin', text(320, 150, '뜻이 있음', { size: 19, color: C.green }), 1.3);
    // 칸 3: 사람 → 사 | 람 이면 뜻이 사라진다
    body += drawLine('M410 166 V196', C.muted, 3, { width: 3 });
    body += `<g class="b3"><g class="sa">${blk(370, 236, '사', ['white', C.muted], { dash: '7 5' })}</g></g><g class="b3"><g class="sb">${blk(450, 236, '람', ['white', C.muted], { dash: '7 5' })}</g></g>`;
    css += steps(id, 'sa', 'translateX(20px)', [[3, 'none', 0.4]], { box: false }) + steps(id, 'sb', 'translateX(-20px)', [[3, 'none', 0.4]], { box: false });
    css += `.on3 .sc-${id} .sa > *, .on3 .sc-${id} .sb > * { animation: ${id}-shake .5s ease-in-out 1.2s 2; }`;
    body += at(3, 'pop', cross(530, 236, 12), 1.6) + at(3, 'fin', text(530, 290, '뜻이 없음', { size: 19, color: C.red }), 1.8);
    // 칸 4
    body += glowRect(190, 34, 80, 72, 4, C.green, 0.1, 14) + glowRect(354, 34, 112, 72, 4, C.green, 0.3, 14);
    body += at(4, 'pop', tag(160, 250, '형태소', ROLE.y, 24), 0.7);
    put(K + '4/형태소', svg(id, body, css));
  })();

  // ── 4단원: 어근(맨손·손질에 든 '손'이 진짜 뜻을 품은 가운데 부분, 뿌리가 내린다) ──────────────────────────────
  (function () {
    const id = 't72-k4-eogeun';
    let css = base(id);
    const A = glued([['맨', AF], ['손', RT]], 180, 80), B = glued([['손', RT], ['질', AF]], 460, 80);
    let body = at(1, 'rise', glued([['맨', WH], ['손', WH]], 180, 80).body, 0.1) + at(1, 'rise', glued([['손', WH], ['질', WH]], 460, 80).body, 0.3);
    // 칸 2: 어근은 초록, 접사는 보라로 칠한 조각이 덮인다
    body += at(2, 'fin', A.body + B.body, 0.2);
    // 칸 3: 두 '손'이 가운데로 모여 뿌리를 내린다
    body += `<g class="b3"><g class="ra">${blk(A.xs[1], 80, '손', RT, { w: A.ws[1] })}</g></g><g class="b3"><g class="rb">${blk(B.xs[0], 80, '손', RT, { w: B.ws[0] })}</g></g>`;
    css += steps(id, 'ra', 'none', [[3, `translate(${f(320 - A.xs[1])}px, 130px)`, 0.2]], { box: false }) + steps(id, 'rb', 'none', [[3, `translate(${f(320 - B.xs[0])}px, 130px)`, 0.2]], { box: false });
    [[-40, 330], [-14, 342], [16, 340], [42, 326]].forEach(([dx, y], k) => { body += drawLine(`M${320 + dx / 4} 240 Q${320 + dx * 0.7} ${y - 50} ${320 + dx} ${y}`, C.orange, 3, { width: 4, delay: 1.2 + k * 0.1 }); });
    body += at(3, 'fin', text(420, 216, '진짜 뜻', { size: 19, color: C.green }), 1.4);
    // 칸 4
    body += glowRect(284, 174, 72, 72, 4, C.green, 0.1, 14);
    body += at(4, 'pop', tag(170, 210, '어근', ROLE.y, 24), 0.6);
    put(K + '4/어근', svg(id, body, css));
  })();

  // ── 4단원: 접사(홀로 못 서는 '햇-'이 밤 앞에, '-꾸러기'가 잠 뒤에 붙어 뜻을 더한다) ──────────────────────────────
  (function () {
    const id = 't72-k4-jeopsa';
    let css = base(id);
    let body = `<g class="b1"><g class="st">${blk(320, 70, '햇-', AF, { dash: '7 5' })}</g></g>`;
    body += `<g class="h2">${at(1, 'pop', cross(390, 70, 11) + text(320, 136, '홀로는 못 씀', { size: 19, color: C.purple }), 0.9)}</g>`;
    css += `@keyframes ${id}-wob { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
      .sc-${id} .st { transform-box: fill-box; transform-origin: center bottom; } .on1 .sc-${id} .st > * { animation: ${id}-wob .7s ease-in-out .4s 2; transform-box: fill-box; transform-origin: center bottom; }`;
    // 칸 2: 햇- + 밤
    const A = glued([['햇', AF], ['밤', RT]], 200, 190);
    body += at(2, 'rise', blk(A.xs[1], 190, '밤', RT, { w: A.ws[1] }), 0.1);
    css += steps(id, 'st', 'none', [[2, `translate(${f(A.xs[0] - 320)}px, 120px)`, 0.5]], { box: false });
    body += at(2, 'fin', text(200, 256, '그해에 난', { size: 19, color: C.purple }), 1.5);
    // 칸 3: 잠 + -꾸러기
    const B = glued([['잠', RT], ['꾸러기', AF]], 460, 190);
    body += at(3, 'rise', blk(B.xs[0], 190, '잠', RT, { w: B.ws[0] }), 0.1);
    body += `<g class="b3"><g class="sf">${blk(B.xs[1], 190, '꾸러기', AF, { w: B.ws[1] })}</g></g>`;
    css += steps(id, 'sf', 'translate(120px, -120px)', [[3, 'none', 0.5]], { box: false });
    body += at(3, 'fin', text(460, 256, '많이 하는 사람', { size: 19, color: C.purple }), 1.5);
    // 칸 4: 앞에도 뒤에도
    body += at(4, 'fin', text(A.xs[0], 146, '앞', { size: 20, color: C.purple }) + text(B.xs[1], 146, '뒤', { size: 20, color: C.purple }), 0.2);
    body += glowRect(A.xs[0] - A.ws[0] / 2 - 6, 154, A.ws[0] + 12, 72, 4, C.purple, 0.3, 14) + glowRect(B.xs[1] - B.ws[1] / 2 - 6, 154, B.ws[1] + 12, 72, 4, C.purple, 0.5, 14);
    body += at(4, 'pop', tag(320, 316, '접사', ROLE.y, 24), 0.8);
    put(K + '4/접사', svg(id, body, css));
  })();

  // ── 4단원: 접두사(풋- 이 사과·고추 앞에 붙자 빨간 열매가 덜 익은 초록이 된다) ──────────────────────────────
  (function () {
    const id = 't72-k4-jeopdu';
    let css = base(id);
    const apple = (x, y, c) => `<circle cx="${x}" cy="${y}" r="34" fill="${c}"/><path d="M${x} ${y - 32} Q${x + 2} ${y - 44} ${x + 8} ${y - 48}" stroke="${C.ink}" stroke-width="3" fill="none"/>`;
    const pepper = (x, y, c) => `<path d="M${x - 40} ${y - 14} Q${x - 10} ${y - 20} ${x + 30} ${y - 6} Q${x + 52} ${y + 4} ${x + 46} ${y + 14} Q${x + 10} ${y + 10} ${x - 36} ${y + 6} Q${x - 46} ${y - 4} ${x - 40} ${y - 14} Z" fill="${c}"/><path d="M${x - 40} ${y - 6} Q${x - 52} ${y - 10} ${x - 56} ${y - 22}" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const ROW = [{ y: 90, word: '사과', n: 2, pic: apple, px: 540 }, { y: 236, word: '고추', n: 3, pic: pepper, px: 540 }];
    let body = '';
    ROW.forEach((r, k) => {
      const G = glued([['풋', AF], [r.word, RT]], 300, r.y);
      body += at(k ? 3 : 1, 'rise', blk(G.xs[1], r.y, r.word, RT, { w: G.ws[1] }), 0.1);
      body += at(k ? 3 : 1, 'pop', r.pic(r.px, r.y, C.red), 0.3);
      body += `<g class="b${r.n}"><g class="pf${k}">${blk(G.xs[0], r.y, '풋', AF, { w: G.ws[0] })}</g></g>`;
      css += steps(id, `pf${k}`, 'translateX(-130px)', [[r.n, 'none', k ? 0.8 : 0.2]], { box: false });
      body += at(r.n, 'fin', r.pic(r.px, r.y, C.green), k ? 1.6 : 1.1);
      body += at(r.n, 'pop', tag(r.px, r.y + 56, '덜 익은', AF, 18), k ? 1.9 : 1.4);
    });
    // 칸 4
    body += glowRect(208, 54, 82, 72, 4, C.purple, 0.1, 14) + glowRect(208, 200, 82, 72, 4, C.purple, 0.3, 14);
    body += at(4, 'fin', text(249, 170, '앞에 붙음', { size: 20, color: C.purple }), 0.4) + at(4, 'pop', tag(120, 330, '접두사', ROLE.y, 24), 0.8);
    put(K + '4/접두사', svg(id, body, css));
  })();

  // ── 4단원: 접미사(선생 뒤 '-님'은 높이는 뜻을 더하고, 덮- 뒤 '-개'는 동사를 명사로 바꾼다) ──────────────────────────────
  (function () {
    const id = 't72-k4-jeommi';
    let css = base(id);
    const A = glued([['선생', RT], ['님', AF]], 280, 80);
    let body = at(1, 'rise', blk(A.xs[0], 80, '선생', RT, { w: A.ws[0] }));
    body += `<g class="b2"><g class="sa">${blk(A.xs[1], 80, '님', AF, { w: A.ws[1] })}</g></g>`;
    css += steps(id, 'sa', 'translateX(140px)', [[2, 'none', 0.2]], { box: false });
    body += at(2, 'pop', tag(480, 80, '높임', AF, 20), 1.2);
    // 칸 3: 덮- + -개 → 덮개(동사 → 명사)
    const B = glued([['덮', RT], ['개', AF]], 280, 220);
    body += at(3, 'rise', blk(B.xs[0], 220, '덮', RT, { w: B.ws[0] }) + chip0(B.xs[0], 284, '덮다 · 동사'), 0.1);
    body += `<g class="b3"><g class="sb">${blk(B.xs[1], 220, '개', AF, { w: B.ws[1] })}</g></g>`;
    css += steps(id, 'sb', 'translateX(140px)', [[3, 'none', 0.6]], { box: false });
    const lid = `<path d="M470 236 Q470 196 520 196 Q570 196 570 236 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="512" y="184" width="16" height="12" rx="4" fill="${C.blue}"/><rect x="462" y="236" width="116" height="12" rx="4" fill="${C.blue}"/>`;
    body += at(3, 'pop', lid, 1.5) + at(3, 'pop', tag(520, 284, '명사', ROLE.s, 20), 1.8);
    // 칸 4
    body += glowRect(A.xs[1] - A.ws[1] / 2 - 6, 44, A.ws[1] + 12, 72, 4, C.purple, 0.1, 14) + glowRect(B.xs[1] - B.ws[1] / 2 - 6, 184, B.ws[1] + 12, 72, 4, C.purple, 0.3, 14);
    body += at(4, 'fin', text(322, 156, '뒤에 붙음', { size: 20, color: C.purple }), 0.4) + at(4, 'pop', tag(80, 330, '접미사', ROLE.y, 24), 0.8);
    put(K + '4/접미사', svg(id, body, css));
  })();

  // ── 4단원: 단일어(구름·거미·바람은 쪼개면 뜻이 사라지는 통짜 낱말) ──────────────────────────────
  (function () {
    const id = 't72-k4-danil';
    let css = base(id);
    const X = [140, 320, 500], W = [['구', '름'], ['거', '미'], ['바', '람']], NB = [2, 3, 3];
    let body = '';
    X.forEach((x, i) => {
      const n = NB[i], d = i ? 0.4 * (i - 1) : 0;
      body += at(1, 'rise', `<g class="wh${i}">${blk(x, 100, W[i].join(''), RT)}</g>`, 0.1 + i * 0.2);
      css += `.sc-${id} .wh${i} { transition: opacity .3s ease ${f(0.2 + d)}s; } .on${n} .sc-${id} .wh${i} { opacity: 0; } .on4 .sc-${id} .wh${i} { opacity: 1; transition-delay: 0s; }`;
      body += `<g class="h4"><g class="b${n}"><g class="l${i}">${blk(x - 26, 100, W[i][0], ['white', C.muted], { w: 50, dash: '7 5' })}</g><g class="r${i}">${blk(x + 26, 100, W[i][1], ['white', C.muted], { w: 50, dash: '7 5' })}</g></g></g>`;
      css += steps(id, `l${i}`, 'none', [[n, 'translateX(-16px)', f(0.3 + d)]], { box: false }) + steps(id, `r${i}`, 'none', [[n, 'translateX(16px)', f(0.3 + d)]], { box: false });
      body += `<g class="h4">${at(n, 'pop', cross(x, 176, 11), f(1.0 + d))}</g>`;
      body += at(4, 'fin', text(x, 176, '어근 하나', { size: 19, color: C.green }), 0.5);
    });
    body += `<g class="h4">${at(2, 'fin', text(320, 240, '뜻이 없어짐', { size: 19, color: C.red }), 1.3)}</g>`;
    body += X.map((x, i) => glowRect(x - 52, 64, 104, 72, 4, C.green, 0.1 + i * 0.15, 14)).join('');
    body += at(4, 'pop', tag(320, 260, '단일어', ROLE.y, 24), 0.8);
    put(K + '4/단일어', svg(id, body, css));
  })();

  // ── 4단원: 복합어(낱말 짜임 나무: 단일어 '하늘' / 복합어 — 합성어 '돌다리', 파생어 '풋사과'·'덮개') ──────────────────────────────
  (function () {
    const id = 't72-k4-bokhap';
    let css = base(id);
    let body = at(1, 'pop', chip0(320, 30, '단어', ['white', C.ink]));
    body += drawLine('M320 46 V60 H120 V80 M320 60 H440 V80', C.muted, 1, { width: 3, delay: 0.3 });
    body += at(1, 'pop', chip0(120, 98, '단일어', ['white', C.muted]), 0.7) + at(1, 'pop', chip0(440, 98, '복합어', ROLE.y), 0.9);
    body += at(1, 'rise', glued([['하늘', RT]], 120, 180, 26).body, 1.1);
    body += at(1, 'fin', text(120, 236, '어근 하나', { size: 18, color: C.muted }), 1.3);
    // 칸 2: 합성어
    body += drawLine('M440 114 V128 H340 V146', C.orange, 2, { width: 3, delay: 0.1 }) + drawLine('M440 128 H540 V146', C.purple, 3, { width: 3, delay: 0 });
    body += at(2, 'pop', chip0(340, 162, '합성어', ROLE.p), 0.5);
    body += at(2, 'rise', glued([['돌', RT], ['다리', RT]], 340, 230, 26).body, 0.8);
    body += at(2, 'fin', text(340, 284, '어근 + 어근', { size: 18, color: C.green }), 1.2);
    // 칸 3: 파생어
    body += at(3, 'pop', chip0(540, 162, '파생어', ROLE.x), 0.2);
    body += at(3, 'rise', glued([['풋', AF], ['사과', RT]], 540, 222, 24).body, 0.5) + at(3, 'rise', glued([['덮', RT], ['개', AF]], 540, 284, 24).body, 0.9);
    body += at(3, 'fin', text(540, 336, '어근 + 접사', { size: 18, color: C.purple }), 1.3);
    // 칸 4
    body += glowRect(262, 80, 360, 270, 4, C.orange, 0.1, 18);
    body += at(4, 'fin', text(130, 340, '조각 둘 이상', { size: 18, color: C.orange }), 0.3);
    body += at(4, 'pop', tag(130, 300, '복합어', ROLE.y, 24), 0.7);
    put(K + '4/복합어', svg(id, body, css));
  })();

  // ── 4단원: 합성어(돌 + 다리 → 돌다리, 눈 + 물 → 눈물: 홀로 쓰이는 어근 둘이 손잡는다) ──────────────────────────────
  (function () {
    const id = 't72-k4-hapseong';
    let css = base(id);
    const stone = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="24" ry="16" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    const bridge = (x, y) => `<path d="M${x - 46} ${y + 14} Q${x} ${y - 30} ${x + 46} ${y + 14}" stroke="${C.orange}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${x - 50} ${y + 16} H${x + 50}" stroke="${C.blue}" stroke-width="4"/>`;
    const sbridge = (x, y) => `<path d="M${x - 56} ${y + 18} Q${x} ${y - 36} ${x + 56} ${y + 18}" stroke="${C.muted}" stroke-width="18" fill="none"/>` + [-40, -20, 0, 20, 40].map((d) => `<path d="M${x + d} ${y + (Math.abs(d) > 30 ? 4 : Math.abs(d) > 10 ? -10 : -16)} v12" stroke="white" stroke-width="2.5"/>`).join('') + `<path d="M${x - 60} ${y + 22} H${x + 60}" stroke="${C.blue}" stroke-width="4"/>`;
    const G = glued([['돌', RT], ['다리', RT]], 320, 200);
    let body = at(1, 'pop', stone(150, 60) + bridge(490, 60));
    body += `<g class="b1"><g class="ja">${blk(G.xs[0], 200, '돌', RT, { w: G.ws[0] })}</g></g><g class="b1"><g class="jb">${blk(G.xs[1], 200, '다리', RT, { w: G.ws[1] })}</g></g>`;
    css += joinCss(id, 'ja', -150, 2, 0.2) + joinCss(id, 'jb', 150, 2, 0.2);
    body += `<g class="h2">${at(1, 'fin', text(320, 210, '+', { size: 34, color: C.green }) + text(170, 140, '홀로 씀', { size: 18, color: C.green }) + text(470, 140, '홀로 씀', { size: 18, color: C.green }), 0.6)}</g>`;
    body += at(2, 'pop', sbridge(320, 100), 1.1);
    // 칸 3: 눈 + 물 → 눈물
    body += at(3, 'rise', glued([['눈', RT], ['물', RT]], 320, 296, 26).body, 0.3);
    body += at(3, 'pop', `<path d="M470 280 Q484 300 470 312 Q456 300 470 280 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`, 0.8) + at(3, 'pop', eye(170, 296, C.blue), 0.6);
    // 칸 4
    body += glowRect(G.xs[0] - G.ws[0] / 2 - 8, 162, G.ws[0] + G.ws[1] + 19, 76, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(560, 200, '합성어', ROLE.y, 24), 0.6) + at(4, 'fin', text(560, 244, '어근 + 어근', { size: 18, color: C.green }), 0.9);
    put(K + '4/합성어', svg(id, body, css));
  })();

  // ── 4단원: 파생어(먹- + -이 → 먹이, 맨- + 손 → 맨손: 어근에 접사가 붙는다) ──────────────────────────────
  (function () {
    const id = 't72-k4-pasaeng';
    let css = base(id);
    const A = glued([['먹', RT], ['이', AF]], 320, 90), B = glued([['맨', AF], ['손', RT]], 320, 230);
    let body = at(1, 'rise', blk(A.xs[0], 90, '먹', RT, { w: A.ws[0] }) + text(A.xs[0], 150, '어근', { size: 19, color: C.green }));
    body += `<g class="b2"><g class="ea">${blk(A.xs[1], 90, '이', AF, { w: A.ws[1] })}</g></g>`;
    css += joinCss(id, 'ea', 160, 2, 0.2);
    body += at(2, 'fin', text(A.xs[1], 150, '접사', { size: 19, color: C.purple }), 1.1);
    body += at(2, 'pop', `<ellipse cx="520" cy="96" rx="40" ry="14" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + [500, 516, 532].map((x) => `<circle cx="${x}" cy="88" r="5" fill="${C.orange}"/>`).join(''), 1.3);
    // 칸 3: 맨- + 손
    body += at(3, 'rise', blk(B.xs[1], 230, '손', RT, { w: B.ws[1] }) + text(B.xs[1], 290, '어근', { size: 19, color: C.green }), 0.1);
    body += `<g class="b3"><g class="eb">${blk(B.xs[0], 230, '맨', AF, { w: B.ws[0] })}</g></g>`;
    css += joinCss(id, 'eb', -160, 3, 0.5);
    body += at(3, 'fin', text(B.xs[0], 290, '접사', { size: 19, color: C.purple }), 1.4);
    // 칸 4
    body += glowRect(A.xs[0] - A.ws[0] / 2 - 8, 52, A.ws[0] + A.ws[1] + 19, 76, 4, C.orange, 0.1, 16) + glowRect(B.xs[0] - B.ws[0] / 2 - 8, 192, B.ws[0] + B.ws[1] + 19, 76, 4, C.orange, 0.3, 16);
    body += at(4, 'pop', tag(130, 160, '파생어', ROLE.y, 24), 0.6) + at(4, 'fin', text(130, 204, '어근 + 접사', { size: 18, color: C.orange }), 0.9);
    put(K + '4/파생어', svg(id, body, css));
  })();

  // ── 4단원: 새말(새로 생긴 것을 부르려고 있던 말을 붙이거나 줄여 새 낱말을 만든다) ──────────────────────────────
  (function () {
    const id = 't72-k4-saemal';
    let css = base(id);
    let body = at(1, 'pop', browser(40, 30, 200, 140, { barH: 26 }) + bar(60, 82, 120) + bar(60, 104, 150));
    body += at(1, 'pop', `<rect x="70" y="120" width="140" height="36" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>` + bar(84, 138, 100, C.blue, 7), 0.4);
    body += at(1, 'pop', sparkle(232, 40, 1.2) + text(140, 206, '새로 생긴 것', { size: 19, color: C.orange }), 0.8);
    // 칸 2: 누리 + -꾼 → 누리꾼
    const A = glued([['누리', RT], ['꾼', AF]], 450, 80);
    body += at(2, 'rise', blk(A.xs[0], 80, '누리', RT, { w: A.ws[0] }), 0.1);
    body += `<g class="b2"><g class="ka">${blk(A.xs[1], 80, '꾼', AF, { w: A.ws[1] })}</g></g>`;
    css += joinCss(id, 'ka', 110, 2, 0.5);
    body += at(2, 'fin', text(450, 140, '인터넷을 하는 사람', { size: 18, color: C.green }), 1.4);
    // 칸 3: 혼자 + 밥 → 혼밥(줄여 붙임)
    body += at(3, 'rise', `<g class="hj">${blk(380, 230, '혼', RT, { w: 70 })}</g><g class="ja2">${blk(446, 230, '자', ['white', C.muted], { w: 62 })}</g>`, 0.1);
    body += `<g class="b3"><g class="bp">${blk(544, 230, '밥', RT, { w: 70 })}</g></g>`;
    css += `.sc-${id} .ja2 { transform-box: fill-box; transform-origin: center; transition: transform .5s ease .9s, opacity .5s ease .9s; } .on3 .sc-${id} .ja2 { transform: scale(0); opacity: 0; }
      .sc-${id} .hj { transition: transform .7s ease-in-out 1.4s; } .on3 .sc-${id} .hj { transform: translateX(46px); }`;
    css += steps(id, 'bp', 'translateX(40px)', [[3, 'translateX(-46px)', 1.4]], { box: false, dur: 0.7 });
    body += at(3, 'fin', text(463, 290, '줄여 붙임', { size: 18, color: C.green }), 2.0);
    // 칸 4
    body += glowRect(A.xs[0] - A.ws[0] / 2 - 8, 42, A.ws[0] + A.ws[1] + 19, 76, 4, C.orange, 0.1, 16) + glowRect(385, 192, 154, 76, 4, C.orange, 0.3, 16);
    body += at(4, 'pop', tag(140, 300, '새말', ROLE.y, 24), 0.6);
    put(K + '4/새말', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
