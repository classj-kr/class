// 국어 4-1 낱말 도식(첫째 묶음: 독서 단원 훑어보다·간추리다·관련짓다·직접적·용암 동굴·동굴 생성물,
// 1단원 관계·흐름·발효·섣달, 매체 단원 검색어·정보 무늬·누리 소통망·접속·간격,
// 4단원 동형이의어·다의어·형태·기본형·뜻풀이·가리키는 말·중심 생각·두서없이·증폭).
// 도구(tile·tag·row·base·move 따위)는 figures/5-1/kor.js·kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
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

  const K = '4-1/국어/';
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

  // ── 독서 단원: 훑어보다(『신통방통 홈 쇼핑』 네 쪽 — 눈길이 글줄은 건너뛰고 그림만 첫 쪽부터 끝 쪽까지 죽) ──────────────────────────────
  (function () {
    const id = 't41-k1-hulteo';
    let css = base(id);
    const PX = [30, 178, 326, 474], PW = 136, PY = 92, PH = 214;
    const scenes = [
      // 텔레비전
      (x, y) => `<rect x="${x + 26}" y="${y + 22}" width="60" height="44" rx="8" fill="white" stroke="${C.ink}" stroke-width="2.5"/><rect x="${x + 33}" y="${y + 29}" width="46" height="30" rx="4" fill="${C.mint}"/>`
        + `<path d="M${x + 46} ${y + 22} L${x + 38} ${y + 8} M${x + 66} ${y + 22} L${x + 74} ${y + 8}" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>`,
      // 선물 상자
      (x, y) => `<rect x="${x + 32}" y="${y + 32}" width="48" height="40" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x + 56} ${y + 32} V${y + 72} M${x + 32} ${y + 48} H${x + 80}" stroke="${C.red}" stroke-width="4"/>`
        + `<path d="M${x + 56} ${y + 32} Q${x + 42} ${y + 14} ${x + 46} ${y + 28} Q${x + 50} ${y + 34} ${x + 56} ${y + 32} Q${x + 70} ${y + 14} ${x + 66} ${y + 28} Q${x + 62} ${y + 34} ${x + 56} ${y + 32} Z" fill="${C.red}"/>`,
      // 초록색 모자를 쓴 아이
      (x, y) => `<path d="M${x + 34} ${y + 82} Q${x + 34} ${y + 62} ${x + 56} ${y + 62} Q${x + 78} ${y + 62} ${x + 78} ${y + 82} Z" fill="${C.blue}"/><circle cx="${x + 56}" cy="${y + 48}" r="14" fill="${C.peach}" stroke="${C.ink}" stroke-width="2"/>`
        + `<g class="hat"><rect x="${x + 44}" y="${y + 16}" width="24" height="22" rx="4" fill="${C.green}"/><rect x="${x + 44}" y="${y + 27}" width="24" height="5" fill="${C.mint}"/><rect x="${x + 36}" y="${y + 34}" width="40" height="6" rx="3" fill="${C.green}"/></g>`,
      // 반짝이
      (x, y) => sparkle(x + 34, y + 30, 1.1) + sparkle(x + 76, y + 46, 1.4) + sparkle(x + 46, y + 66, 0.8)
    ];
    let body = at(1, 'pop', tag(320, 30, '신통방통 홈 쇼핑', ROLE.s, 20));
    PX.forEach((x, i) => {
      const pic = `<rect x="${x + 12}" y="${PY + 14}" width="112" height="84" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>` + scenes[i](x + 12, PY + 14);
      body += at(1, 'rise', `<rect x="${x}" y="${PY}" width="${PW}" height="${PH}" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>` + pic, 0.2 + i * 0.15);
      body += `<g class="dim dim2">` + at(1, 'fin', [0, 1, 2, 3, 4].map((j) => bar(x + 14, PY + 120 + j * 20, [104, 92, 108, 84, 60][(j + i) % 5])).join(''), 0.4 + i * 0.15) + '</g>';
    });
    // 칸 2: 눈길이 그림 위를 한 번에 죽 지나간다
    body += `<g class="h3">${drawLine('M70 66 H570', C.orange, 2, { width: 3, delay: 0.2, cls: 'sw' })}</g>`;
    body += `<g class="h3"><g class="b2"><g class="ey">${eye(98, 66, C.orange)}</g></g></g>`;
    css += `.sc-${id} .sw { transition-duration: 1.8s; transition-timing-function: linear; }
      @keyframes ${id}-sweep { from { transform: translateX(0); } to { transform: translateX(444px); } }
      .on2 .sc-${id} .ey { animation: ${id}-sweep 1.8s linear .2s both; }`;
    body += PX.map((x, i) => glowRect(x + 8, PY + 10, 120, 92, 2, C.orange, f(0.15 + i * 0.6), 10)).join('');
    // 칸 3: 그림 속 초록색 모자가 눈에 띈다
    css += pulseCss(id, '.hat', 3, 0.3);
    body += glowRect(PX[2] + 8, PY + 10, 120, 92, 3, C.purple, 0.1, 10);
    body += at(3, 'pop', `<circle cx="${PX[2] + 124}" cy="${PY + 10}" r="17" fill="white" stroke="${C.purple}" stroke-width="3"/>` + text(PX[2] + 124, PY + 18, '?', { size: 24, color: C.purple, weight: 800 }), 0.6);
    body += `<g class="h4">${at(3, 'pop', tag(PX[2] + 68, 334, '초록색 모자', ROLE.x, 20), 0.9)}</g>`;
    // 칸 4
    body += PX.map((x, i) => glowRect(x + 8, PY + 10, 120, 92, 4, C.orange, f(0.1 + i * 0.25), 10)).join('');
    body += at(4, 'pop', tag(320, 334, '훑어보다', ROLE.y, 22), 1.1);
    put(K + 'reading/훑어보다', svg(id, body, css));
  })();

  // ── 독서 단원: 간추리다(긴 이야기 쪽에서 언제·어디서·무슨 일 줄만 남아 쪽지로 모인다) ──────────────────────────────
  (function () {
    const id = 't41-k1-ganchu';
    let css = base(id);
    const W = [230, 206, 224, 190, 230, 214, 198, 226, 208, 180, 120];
    const KEY = { 1: ['언제', 120], 5: ['어디서', 180], 8: ['무슨 일', 240] };
    let body = at(1, 'fin', `<rect x="30" y="24" width="270" height="306" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(3, 'fin', `<rect x="384" y="78" width="224" height="200" rx="12" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/><path d="M384 96 H608" stroke="${C.orange}" stroke-width="2" opacity=".4"/>`, 0.1);
    let rest = '';
    W.forEach((w, i) => {
      const y = 50 + i * 26;
      if (!KEY[i]) { rest += at(1, 'fin', bar(54, y, w, GRAY, 10), 0.2 + i * 0.05); return; }
      const [label, ty] = KEY[i], s = 110 / w;
      body += `<g class="b1"><g class="kb kb${i}">${g('fin fin1', bar(54, y, w, GRAY, 10, 'kf'), 0.2 + i * 0.05)}</g></g>`;
      css += `.sc-${id} .kb${i} { transform-box: fill-box; transform-origin: left center; transition: transform 1s ease-in-out ${f(0.3 + Object.keys(KEY).indexOf(String(i)) * 0.25)}s; }
        .on3 .sc-${id} .kb${i} { transform: translate(${f(482 - 54)}px, ${ty - y}px) scaleX(${f(s)}); }`;
      body += `<g class="h3">${at(2, 'pop', tag(345, y, label, ROLE.o, 18), 0.4 + Object.keys(KEY).indexOf(String(i)) * 0.3)}</g>`;
      body += at(3, 'pop', tag(432, ty, label, ROLE.o, 18), 1.2 + Object.keys(KEY).indexOf(String(i)) * 0.2);
    });
    body += `<g class="ot">${rest}</g>`;
    css += `.sc-${id} .kf { transition: fill .5s ease .3s; } .on2 .sc-${id} .kf { fill: ${C.orange}; }
      .sc-${id} .ot { transition: transform .8s ease-in, opacity .8s ease; }
      .on3 .sc-${id} .ot { transform: translateY(14px); opacity: .15; }`;
    // 칸 3: 짧은 쪽지(위의 쪽지에 줄이 모인다)
    body += drawArrow(312, 178, 372, 178, C.orange, 3, { width: 4, delay: 0.2 });
    // 칸 4
    body += glowRect(378, 72, 236, 212, 4, C.orange, 0.2);
    body += at(4, 'pop', tag(496, 318, '간추리다', ROLE.y, 22), 0.8);
    put(K + 'reading/간추리다', svg(id, body, css));
  })();

  // ── 독서 단원: 관련짓다(「토끼와 거북」의 꾸준한 거북 ↔ 내 줄넘기 연습이 선으로 이어진다) ──────────────────────────────
  (function () {
    const id = 't41-k1-gwallyeon';
    let css = base(id);
    const turtle = (x, y) => `<ellipse cx="${x - 18}" cy="${y + 2}" rx="7" ry="5" fill="${C.green}"/><ellipse cx="${x + 18}" cy="${y + 2}" rx="7" ry="5" fill="${C.green}"/>`
      + `<circle cx="${x + 36}" cy="${y - 8}" r="9" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/><circle cx="${x + 39}" cy="${y - 10}" r="2" fill="${C.ink}"/>`
      + `<path d="M${x - 30} ${y} A30 26 0 0 1 ${x + 30} ${y} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${x - 14} ${y} L${x - 8} ${y - 14} L${x + 8} ${y - 14} L${x + 14} ${y} M${x - 8} ${y - 14} L${x - 2} ${y - 24} M${x + 8} ${y - 14} L${x + 2} ${y - 24}" stroke="${C.green}" stroke-width="2" fill="none"/>`;
    // 왼쪽 카드: 책
    let body = at(1, 'fin', `<rect x="26" y="26" width="250" height="206" rx="14" fill="white" stroke="${C.blue}" stroke-width="3"/>`);
    body += at(1, 'pop', tag(151, 56, '책', ROLE.s, 20), 0.2);
    body += at(1, 'fin', `<path d="M48 176 H254" stroke="${C.muted}" stroke-width="3" stroke-dasharray="8 6"/><path d="M236 176 V118" stroke="${C.ink}" stroke-width="3"/><path d="M236 118 L262 128 L236 138 Z" fill="${C.red}"/>`, 0.3);
    body += `<g class="b1"><g class="tt">${turtle(84, 168)}</g></g>`;
    css += move(id, 'tt', 'none', 1, { dur: 2.4, delay: 0.5, to: 'translateX(110px)' });
    body += at(1, 'pop', tag(151, 258, '꾸준히 기어감', ROLE.p, 18), 1.4);
    // 오른쪽 카드: 나
    body += at(2, 'fin', `<rect x="364" y="26" width="250" height="206" rx="14" fill="white" stroke="${C.orange}" stroke-width="3"/>`);
    body += at(2, 'pop', tag(560, 56, '나', ROLE.o, 20), 0.2);
    body += `<g class="b2"><g class="jp">${person(489, 146, C.orange, 16)}</g><g class="rp"><path d="M449 136 Q489 226 529 136" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>`;
    css += `@keyframes ${id}-jump { 0%, 100% { transform: none; } 50% { transform: translateY(-12px); } }
      @keyframes ${id}-rope { 0% { transform: scaleY(1); } 50% { transform: scaleY(-1); } 100% { transform: scaleY(1); } }
      .sc-${id} .rp { transform-box: fill-box; transform-origin: center top; }
      .on2 .sc-${id} .jp { animation: ${id}-jump .8s ease-in-out .3s infinite; }
      .on2 .sc-${id} .rp { animation: ${id}-rope .8s linear .3s infinite; }`;
    [0, 1, 2, 3, 4].forEach((k) => {
      const x = 420 + k * 34;
      body += at(2, 'pop', `<rect x="${x - 12}" y="196" width="24" height="24" rx="5" fill="white" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 6} 208 L${x - 1} 213 L${x + 7} 202" stroke="${C.green}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 0.6 + k * 0.2);
    });
    body += at(2, 'pop', tag(489, 258, '줄넘기 연습', ROLE.o, 18), 1.6);
    // 칸 3: 두 카드가 선으로 이어진다
    body += drawLine('M276 130 C306 92 334 168 364 130', C.purple, 3, { width: 6, delay: 0.2 });
    body += at(3, 'pop', `<g class="kk">${tag(320, 84, '꾸준히', ROLE.x, 18)}</g>`, 1.1);
    body += at(3, 'pop', `<circle cx="320" cy="186" r="20" fill="white" stroke="${C.purple}" stroke-width="3"/>` + text(320, 195, '?', { size: 26, color: C.purple, weight: 800 }), 1.5);
    css += pulseCss(id, '.kk', 4, 0.3);
    // 칸 4
    body += glowRect(22, 22, 258, 214, 4, C.blue, 0.1) + glowRect(360, 22, 258, 214, 4, C.orange, 0.3);
    body += at(4, 'pop', tag(320, 322, '관련짓다', ROLE.x, 22), 0.9);
    put(K + 'reading/관련짓다', svg(id, body, css));
  })();

  // ── 독서 단원: 직접적(질문에서 책 속 답으로 곧바로 닿는 화살표 / 단서를 거쳐 짐작하는 길) ──────────────────────────────
  (function () {
    const id = 't41-k1-jikjeop';
    let css = base(id);
    const bubble = (x, y, col) => `<path d="M${x - 50} ${y - 30} H${x + 50} Q${x + 60} ${y - 30} ${x + 60} ${y - 20} V${y + 20} Q${x + 60} ${y + 30} ${x + 50} ${y + 30} H${x - 22} L${x - 38} ${y + 46} L${x - 34} ${y + 30} H${x - 50} Q${x - 60} ${y + 30} ${x - 60} ${y + 20} V${y - 20} Q${x - 60} ${y - 30} ${x - 50} ${y - 30} Z" fill="white" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`
      + text(x, y + 12, '?', { size: 34, color: col, weight: 800 });
    // 책 한 쪽
    let body = at(1, 'fin', `<rect x="386" y="22" width="226" height="176" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/><rect x="386" y="22" width="12" height="176" rx="5" fill="${C.sky}"/>`);
    [[50, 176], [78, 150], [106, 128], [134, 170], [162, 140]].forEach(([y, w], i) => {
      body += at(1, 'fin', i === 2 ? `<rect class="ans" x="414" y="${y - 5}" width="${w}" height="10" rx="5" fill="${GRAY}"/>` : bar(414, y, w), 0.2 + i * 0.05);
    });
    body += at(1, 'pop', bubble(96, 104, C.orange), 0.3);
    // 칸 2: 곧바로 닿는다
    css += `.sc-${id} .ans { transition: fill .5s ease 1s; } .on2 .sc-${id} .ans { fill: ${C.green}; }`;
    body += drawArrow(162, 104, 402, 106, C.green, 2, { width: 6, delay: 0.1 });
    body += at(2, 'pop', tag(280, 62, '바로', ROLE.p, 20), 0.8) + at(2, 'pop', tag(574, 106, '답', ROLE.p, 18), 1.2);
    body += glowRect(406, 92, 142, 28, 2, C.green, 1.1, 10);
    // 칸 3: 단서를 거쳐 짐작한다
    let low = at(3, 'pop', bubble(96, 262, C.purple), 0.1);
    const clue = (x, y) => tile(x, y, '단서', { size: 18, h: 36, w: 64, fill: C.lilac, stroke: C.purple, sw: 2.5 });
    low += drawArrow(160, 266, 206, 300, C.purple, 3, { width: 4, delay: 0.2 }) + at(3, 'pop', clue(244, 312), 0.6);
    low += drawArrow(278, 298, 320, 252, C.purple, 3, { width: 4, delay: 0.6 }) + at(3, 'pop', clue(356, 238), 1.0);
    low += drawArrow(390, 252, 452, 286, C.purple, 3, { width: 4, delay: 1.0 });
    low += at(3, 'pop', tile(520, 296, '답', { size: 22, h: 48, w: 96, fill: 'white', stroke: C.purple, sw: 3, dash: '8 6' }) + tag(520, 252, '짐작', ROLE.x, 18), 1.5);
    low += at(3, 'pop', tag(220, 222, '거쳐서', ROLE.x, 18), 0.5);
    body += `<g class="dim dim4">${low}</g>`;
    // 칸 4
    body += glowRect(150, 88, 266, 36, 4, C.green, 0.2, 18);
    body += at(4, 'pop', tag(280, 156, '직접적', ROLE.p, 22), 0.7);
    put(K + 'reading/직접적', svg(id, body, css));
  })();

  // ── 독서 단원: 용암 동굴(거문오름 — 용암이 산비탈을 흐르고, 겉이 굳고, 속이 빠져나가 텅 빈 굴) ──────────────────────────────
  (function () {
    const id = 't41-k1-yongam';
    let css = base(id);
    const ANG = 19.17, L = 440;
    let body = at(1, 'fin', `<path d="M0 360 V262 L56 160 L96 100 L108 112 L128 112 L140 104 L560 250 V360 Z" fill="${C.line}"/><path d="M0 262 L56 160 L96 100 L108 112 L128 112 L140 104 L560 250" stroke="${C.green}" stroke-width="4" fill="none" stroke-linejoin="round"/>`
      + `<rect x="560" y="254" width="80" height="106" fill="${C.sky}"/><path d="M560 256 Q574 248 588 256 Q602 264 616 256 Q628 249 640 256" stroke="${C.blue}" stroke-width="3" fill="none"/>`);
    body += at(1, 'pop', tag(112, 62, '거문오름', ROLE.o, 18), 0.2);
    // 분화구에서 솟는 용암 방울(칸 1에만)
    body += `<g class="h2"><g class="b1">` + [[110, 0], [120, 0.35], [102, 0.7]].map(([x, d]) => `<g class="sp" style="animation-delay:${d}s"><circle cx="${x}" cy="100" r="5" fill="${C.orange}"/></g>`).join('') + '</g></g>';
    css += `@keyframes ${id}-sp { 0% { transform: none; opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-34px); opacity: 0; } }
      .on1 .sc-${id} .sp { animation: ${id}-sp 1s ease-out infinite; }`;
    // 산비탈을 따라 기울인 틀(속성 있는 g) 안에서 굴을 그린다
    let tube = `<g class="b1"><rect x="0" y="-12" width="${L}" height="24" fill="white"/></g>`;
    tube += `<g class="b1"><g class="lv"><path class="draw draw1" pathLength="1" d="M0 0 H${L}" stroke="${C.orange}" stroke-width="24" fill="none"/><path class="draw draw1" pathLength="1" d="M0 0 H${L}" stroke="${C.yellow}" stroke-width="7" fill="none" opacity=".8"/></g></g>`;
    css += `.sc-${id} .lv .draw { transition: stroke-dashoffset 1.8s ease-in .3s; }
      .sc-${id} .lv { transform-box: fill-box; transform-origin: right center; transition: transform 2.2s ease-in .4s; }
      .on3 .sc-${id} .lv { transform: scaleX(0); }`;
    // 칸 2: 겉이 굳는다
    tube += drawLine(`M0 -13 H${L}`, C.ink, 2, { width: 6, delay: 0.6 }) + drawLine(`M0 13 H${L}`, C.ink, 2, { width: 6, delay: 0.9 });
    // 칸 3: 안쪽 용암이 빠져나간다(흐름 표시)
    tube += `<g class="h4"><g class="b3">` + [60, 170, 280, 390].map((x, i) => `<g class="fl" style="animation-delay:${f(i * 0.15)}s"><path d="M${x - 8} -7 L${x + 2} 0 L${x - 8} 7" stroke="${C.red}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`).join('') + '</g></g>';
    css += `@keyframes ${id}-fl { 0% { transform: none; opacity: 0; } 30% { opacity: 1; } 100% { transform: translateX(46px); opacity: 0; } }
      .on3 .sc-${id} .fl { animation: ${id}-fl .9s linear infinite; }`;
    // 칸 4: 텅 빈 굴이 반짝
    tube += glowRect(-4, -19, L + 8, 38, 4, C.purple, 0.2, 18);
    body += `<g transform="translate(145 123) rotate(${ANG})">${tube}</g>`;
    body += drawArrow(258, 52, 258, 124, C.blue, 2, { width: 4, delay: 0.1 }) + drawArrow(352, 84, 352, 156, C.blue, 2, { width: 4, delay: 0.3 }) + drawArrow(446, 118, 446, 190, C.blue, 2, { width: 4, delay: 0.5 });
    body += at(2, 'pop', tag(356, 34, '차가운 공기', ROLE.s, 18), 0.2);
    body += at(2, 'pop', tag(250, 200, '굳음', ROLE.g, 18), 1.6);
    body += at(3, 'pop', tag(584, 220, '빠져나감', ROLE.o, 18), 1.0);
    body += at(3, 'drop', [586, 606, 624].map((x, i) => `<circle cx="${x}" cy="${282 + i * 8}" r="5" fill="${C.orange}"/>`).join(''), 1.6);
    body += at(4, 'pop', tag(330, 300, '용암 동굴', ROLE.x, 22), 0.8);
    put(K + 'reading/용암 동굴', svg(id, body, css));
  })();

  // ── 독서 단원: 동굴 생성물(물방울이 떨어지며 종유석은 아래로, 석순은 위로 자라 맞닿으면 석주) ──────────────────────────────
  (function () {
    const id = 't41-k1-saengseong';
    let css = base(id);
    const ROCK = C.line, ST = TAN, SS = C.muted;
    let body = at(1, 'fin', `<path d="M0 0 H640 V66 L590 74 L520 64 L440 70 L380 62 L300 74 L200 70 L130 62 L60 72 L0 66 Z" fill="${ROCK}"/>`
      + `<path d="M0 360 V292 L80 286 L200 294 L300 284 L440 294 L520 298 L640 288 V360 Z" fill="${ROCK}"/>`);
    // 작은 장식 생성물
    body += at(1, 'fin', `<path d="M70 70 L92 71 L84 108 Q81 114 78 108 Z" fill="${ST}" stroke="${SS}" stroke-width="2"/><path d="M560 69 L586 72 L576 116 Q572 122 568 116 Z" fill="${ST}" stroke="${SS}" stroke-width="2"/>`
      + `<path d="M300 286 L328 285 L318 258 Q314 252 310 258 Z" fill="${ST}" stroke="${SS}" stroke-width="2"/>`, 0.2);
    const drip = (x, n, cls) => `<g class="b${n}"><g class="dp ${cls}"><path d="M${x} 74 Q${x + 6} 84 ${x} 88 Q${x - 6} 84 ${x} 74 Z" fill="${C.blue}"/></g></g>`;
    body += `<g class="h3">${drip(200, 1, 'dA')}</g>` + drip(440, 1, 'dB');
    css += `@keyframes ${id}-dp { 0% { transform: none; opacity: 0; } 10% { opacity: 1; } 85% { transform: translateY(196px); opacity: 1; } 100% { transform: translateY(200px); opacity: 0; } }
      .on1 .sc-${id} .dA { animation: ${id}-dp 1.4s ease-in .3s infinite; }
      .on1 .sc-${id} .dB { animation: ${id}-dp 1.4s ease-in 1s infinite; }`;
    const down = (x, tip) => `<path d="M${x - 26} 66 L${x + 26} 66 L${x + 7} ${tip - 10} Q${x} ${tip + 4} ${x - 7} ${tip - 10} Z" fill="${ST}" stroke="${SS}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const up = (x, tip) => `<path d="M${x - 32} 294 L${x + 32} 294 L${x + 9} ${tip + 12} Q${x} ${tip - 4} ${x - 9} ${tip + 12} Z" fill="${ST}" stroke="${SS}" stroke-width="2.5" stroke-linejoin="round"/>`;
    // A(왼쪽): 끝내 맞닿아 석주 / B(오른쪽): 따로 자라는 종유석·석순
    body += `<g class="b2"><g class="gA1">${down(200, 180)}</g><g class="gA2">${up(200, 176)}</g></g>`;
    body += `<g class="b2"><g class="gB1">${down(440, 172)}</g><g class="gB2">${up(440, 196)}</g></g>`;
    const grow = (cls, origin, a, b) => `.sc-${id} .${cls} { transform-box: fill-box; transform-origin: ${origin}; transform: scaleY(0); transition: transform 1.4s ease-out .2s; }
      .on2 .sc-${id} .${cls} { transform: scaleY(${a}); } .on3 .sc-${id} .${cls} { transform: scaleY(${b}); transition-duration: 1.3s; }`;
    css += grow('gA1', 'center top', 0.5, 1) + grow('gA2', 'center bottom', 0.5, 1) + grow('gB1', 'center top', 0.55, 0.8) + grow('gB2', 'center bottom', 0.55, 0.8);
    // 칸 3: 맞닿은 자리를 기둥으로 메운다
    body += at(3, 'fin', `<path d="M191 150 Q194 178 190 200 L210 200 Q206 178 209 150 Z" fill="${ST}"/><path d="M191 150 Q194 178 190 200 M209 150 Q206 178 210 200" stroke="${SS}" stroke-width="2.5" fill="none"/>`, 1.4);
    body += at(1, 'pop', tag(536, 180, '물방울', ROLE.s, 18), 0.8);
    body += at(2, 'pop', tag(536, 120, '종유석', ROLE.o, 18), 1.2) + at(2, 'pop', tag(536, 244, '석순', ROLE.o, 18), 1.4);
    body += drawLine('M496 120 H462', C.orange, 2, { width: 3, delay: 1.3 }) + drawLine('M508 244 H470', C.orange, 2, { width: 3, delay: 1.5 });
    body += at(3, 'pop', tag(100, 180, '석주', ROLE.x, 18), 1.5) + drawLine('M128 180 H184', C.purple, 3, { width: 3, delay: 1.5 });
    body += `<g class="h4">${at(3, 'pop', tag(320, 326, '오랜 세월', ROLE.y, 18), 0.3)}</g>`;
    // 칸 4
    body += glowRect(166, 62, 68, 236, 4, C.purple, 0.1, 18) + glowRect(408, 62, 64, 92, 4, C.orange, 0.4, 14) + glowRect(402, 200, 76, 98, 4, C.orange, 0.6, 14);
    body += at(4, 'pop', tag(320, 326, '동굴 생성물', ROLE.y, 22), 0.9);
    put(K + 'reading/동굴 생성물', svg(id, body, css));
  })();

  // ── 1단원: 관계(「헤엄이」 — 헤엄이와 빨간 물고기들은 도와주는 선, 큰 물고기와는 갈등하는 선) ──────────────────────────────
  (function () {
    const id = 't41-k1-gwangye';
    let css = base(id);
    // 물고기: dir 1 은 오른쪽을 본다
    const fish = (x, y, L, fill, stroke, dir = 1, eyeCol = 'white') => {
      const h = L * 0.42, back = x - dir * L * 0.32, end = x - dir * L * 0.6;
      return `<path d="M${f(back)} ${y} L${f(end)} ${f(y - h * 0.48)} L${f(end)} ${f(y + h * 0.48)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>`
        + `<ellipse cx="${x}" cy="${y}" rx="${f(L * 0.38)}" ry="${f(h / 2)}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`
        + `<circle cx="${f(x + dir * L * 0.2)}" cy="${f(y - h * 0.1)}" r="${f(Math.max(3, L * 0.045))}" fill="${eyeCol}"/>`;
    };
    let body = at(1, 'pop', `<g class="sw">${fish(120, 76, 76, C.ink, C.ink)}</g>`, 0.1) + at(1, 'pop', tag(120, 124, '헤엄이', ROLE.g, 18), 0.4);
    const OFF = [[-52, -22], [0, -28], [52, -20], [-28, 6], [24, 4], [-50, 32], [0, 34], [50, 30]];
    body += `<g class="b1"><g class="cl">` + OFF.map(([dx, dy], i) => g('pop pop1', fish(120 + dx, 262 + dy, 38, C.red, C.red), 0.3 + i * 0.06)).join('') + '</g></g>';
    body += at(1, 'pop', tag(120, 334, '빨간 물고기들', ROLE.r, 18), 0.9);
    const big = fish(486, 170, 230, C.lilac, C.purple, -1, C.purple)
      + `<path d="M398 162 L408 172 L398 180 L410 188 L400 196" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
    body += at(1, 'pop', `<g class="bf">${big}</g>`, 0.6) + at(1, 'pop', tag(486, 262, '큰 물고기', ROLE.x, 18), 1.0);
    // 칸 2: 도와주는 관계
    body += drawLine('M120 142 V222', C.green, 2, { width: 6, delay: 0.2, cls: 'ln' });
    body += at(2, 'pop', tag(120, 182, '도와주는', ROLE.p, 18), 1.0);
    css += `@keyframes ${id}-bob { 0%, 100% { transform: none; } 50% { transform: translateY(-8px); } }
      .on2 .sc-${id} .sw { animation: ${id}-bob .7s ease-in-out .2s 3; }
      .sc-${id} .cl { transform-box: fill-box; transform-origin: center; transition: transform .8s ease-in-out .6s; }
      .on2 .sc-${id} .cl { transform: scale(.86); }`;
    // 칸 3: 갈등하는 관계(번개 같은 선)
    body += drawLine('M384 150 L330 138 L300 120 L262 112 L232 96 L190 88', C.red, 3, { width: 5, delay: 0.5, cls: 'ln' });
    body += drawLine('M384 192 L332 204 L300 220 L262 228 L232 244 L196 252', C.red, 3, { width: 5, delay: 0.8, cls: 'ln' });
    body += at(3, 'pop', tag(290, 172, '갈등하는', ROLE.r, 18), 1.6);
    css += `.on3 .sc-${id} .bf { animation: ${id}-shake .5s ease-in-out .2s 2; }`;
    // 칸 4
    css += `.on4 .sc-${id} .ln { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    body += at(4, 'pop', tag(320, 326, '관계', ROLE.y, 24), 1.0);
    put(K + '1/관계', svg(id, body, css));
  })();

  // ── 1단원: 흐름(「어머니의 시험」 — 한양 → 고향집 → 한양, 일이 차례로 이어진다) ──────────────────────────────
  (function () {
    const id = 't41-k1-heureum';
    let css = base(id);
    const X = [110, 320, 530], LY = 150;
    const palace = (x, y) => `<rect x="${x - 24}" y="${y + 4}" width="48" height="26" fill="white" stroke="${C.blue}" stroke-width="2.5"/><rect x="${x - 7}" y="${y + 12}" width="14" height="18" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`
      + `<path d="M${x - 38} ${y + 6} Q${x - 24} ${y - 2} ${x - 28} ${y - 14} H${x + 28} Q${x + 24} ${y - 2} ${x + 38} ${y + 6} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const hut = (x, y) => `<rect x="${x - 24}" y="${y + 4}" width="48" height="26" fill="white" stroke="${C.orange}" stroke-width="2.5"/><rect x="${x - 7}" y="${y + 12}" width="14" height="18" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`
      + `<path d="M${x - 34} ${y + 6} Q${x - 30} ${y - 22} ${x} ${y - 22} Q${x + 30} ${y - 22} ${x + 34} ${y + 6} Z" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/>`;
    const PL = [['한양', ROLE.s, palace], ['고향집', ROLE.o, hut], ['한양', ROLE.s, palace]];
    const EV = ['명필로 인정', '어둠 속 시험', '굳은 결심'];
    let body = `<g class="b1"><path d="M40 ${LY} H600" stroke="${C.line}" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/></g>`;
    X.forEach((x, i) => {
      const n = i + 1;
      body += at(n, 'pop', tag(x, 36, PL[i][0], PL[i][1], 20), 0.1 + (i ? 1 : 0));
      body += at(n, 'pop', PL[i][2](x, 92), 0.2 + (i ? 1 : 0));
      body += at(n, 'pop', `<circle cx="${x}" cy="${LY}" r="10" fill="${C.orange}" stroke="white" stroke-width="3"/>`, 0.3 + (i ? 1 : 0));
      body += at(n, 'rise', `<g class="ev">${tile(x, 252, EV[i], { size: 20, h: 46, fill: 'white', stroke: C.orange, sw: 3 })}</g>`, 0.5 + (i ? 1.2 : 0));
    });
    body += drawArrow(126, LY, 300, LY, C.orange, 2, { width: 5, delay: 0.1 }) + drawArrow(336, LY, 510, LY, C.orange, 3, { width: 5, delay: 0.1 });
    // 석봉(움직이는 사람)
    body += `<g class="b1"><g class="mk">${person(110, 196, C.blue, 12)}</g></g>`;
    css += steps(id, 'mk', 'none', [[2, 'translateX(210px)', 0.1], [3, 'translateX(420px)', 0.1]], { dur: 1.1, box: false });
    // 칸 4: 차례 번호와 흐름
    body += X.map((x, i) => at(4, 'pop', badge(x - wOf(EV[i], 20) / 2 - 2, 230, i + 1, C.orange), 0.2 + i * 0.25)).join('');
    css += `.on4 .sc-${id} .ev { animation: ${id}-pulse .6s ease-in-out both; transform-box: fill-box; transform-origin: center; }`;
    body += glowRect(30, 124, 580, 52, 4, C.orange, 0.3, 26);
    body += at(4, 'pop', tag(320, 324, '흐름', ROLE.y, 24), 1.1);
    put(K + '1/흐름', svg(id, body, css));
  })();

  // ── 1단원: 발효(옹기 속 김치 — 작은 생물이 일하며 날이 갈수록 새콤하게 익는다) ──────────────────────────────
  (function () {
    const id = 't41-k1-balhyo';
    let css = base(id);
    const ongi = `<path d="M138 76 Q128 86 116 96 Q74 130 74 190 Q74 252 112 292 L118 304 H222 L228 292 Q266 252 266 190 Q266 130 224 96 Q212 86 202 76 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<rect x="130" y="64" width="80" height="14" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M124 64 Q170 30 216 64 Z" fill="${C.orange}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    const win = `<rect x="104" y="140" width="132" height="128" rx="22" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`;
    const leaves = [[130, 238, -20], [168, 246, 10], [206, 236, 25], [142, 200, 15], [190, 204, -15], [166, 172, 0]]
      .map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="14" transform="rotate(${a} ${x} ${y})" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`).join('')
      + [[124, 226], [156, 218], [182, 230], [208, 214], [150, 186], [192, 180], [174, 254], [214, 250]].map(([x, y]) => `<rect x="${x}" y="${y}" width="7" height="5" rx="1.5" fill="${C.red}"/>`).join('');
    let body = at(1, 'pop', ongi + win + leaves, 0.1);
    // 익어 가는 빛깔(칸 3)
    body += `<g class="rp"><rect x="105.5" y="141.5" width="129" height="125" rx="21" fill="${C.orange}"/></g>`;
    css += `.sc-${id} .rp { opacity: 0; transition: opacity 2.4s ease .4s; } .on3 .sc-${id} .rp { opacity: .38; }`;
    // 뽀글뽀글 거품(칸 2부터)
    body += `<g class="b2">` + [[132, 0], [170, 0.5], [210, 0.25], [150, 0.9], [196, 1.2]].map(([x, d]) => `<g class="bb" style="animation-delay:${d}s"><circle cx="${x}" cy="256" r="5" fill="white" stroke="${C.blue}" stroke-width="2"/></g>`).join('') + '</g>';
    css += `@keyframes ${id}-bb { 0% { transform: none; opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-96px); opacity: 0; } }
      .on2 .sc-${id} .bb { animation: ${id}-bb 1.8s ease-in infinite; }`;
    // 칸 2: 돋보기 속 작은 생물
    const MB = [[400, 120, 'r', -20], [452, 108, 'c', 0], [486, 146, 'r', 30], [410, 176, 'c', 0], [462, 190, 'r', 70], [432, 146, 'r', 10], [500, 196, 'c', 0], [380, 150, 'c', 0]];
    let lensBody = `<circle cx="440" cy="152" r="84" fill="white" stroke="${C.purple}" stroke-width="4"/>`;
    lensBody += MB.map(([x, y, k, a], i) => `<g class="mb mb${i % 3}">` + (k === 'r'
      ? `<rect x="${x - 13}" y="${y - 5}" width="26" height="10" rx="5" transform="rotate(${a} ${x} ${y})" fill="${C.green}"/>`
      : `<circle cx="${x}" cy="${y}" r="7" fill="${C.purple}"/>`) + '</g>').join('');
    body += `<g class="h4">` + at(2, 'fin', dashed(236, 168, 358, 132, C.purple) + dashed(236, 236, 372, 204, C.purple), 0.2)
      + at(2, 'pop', lensBody, 0.4) + at(2, 'pop', tag(440, 258, '작은 생물', ROLE.x, 18), 1.0) + '</g>';
    css += `@keyframes ${id}-w0 { 0%, 100% { transform: none; } 50% { transform: translate(5px, -4px) rotate(12deg); } }
      @keyframes ${id}-w1 { 0%, 100% { transform: none; } 50% { transform: translate(-5px, 4px) rotate(-10deg); } }
      @keyframes ${id}-w2 { 0%, 100% { transform: none; } 50% { transform: translate(3px, 5px) rotate(8deg); } }
      .sc-${id} .mb { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .mb0 { animation: ${id}-w0 .9s ease-in-out infinite; }
      .on2 .sc-${id} .mb1 { animation: ${id}-w1 1.1s ease-in-out infinite; }
      .on2 .sc-${id} .mb2 { animation: ${id}-w2 .8s ease-in-out infinite; }`;
    // 칸 3: 날이 지난다
    const days = [['1일', 352], ['3일', 450], ['7일', 548]];
    days.forEach(([l, x], i) => { body += at(3, 'pop', tile(x, 312, l, { size: 20, h: 40, w: 70, fill: i === 2 ? C.peach : 'white', stroke: C.orange, sw: 2.5 }), 0.2 + i * 0.6); });
    body += drawArrow(390, 312, 412, 312, C.orange, 3, { width: 3, delay: 0.5 }) + drawArrow(488, 312, 510, 312, C.orange, 3, { width: 3, delay: 1.1 });
    body += at(3, 'pop', `<g class="tm">${tag(300, 36, '새콤한 맛', ROLE.o, 20)}</g>`, 1.8);
    // 칸 4: 된장·간장도
    const mini = (x, label) => `<g transform="translate(${x - 75} 98) scale(.44)">${ongi}</g>` + tag(x, 252, label, ROLE.o, 18);
    body += [['김치', 380], ['된장', 470], ['간장', 560]].map(([l, x], i) => at(4, 'pop', mini(x, l), 0.2 + i * 0.25)).join('');
    css += pulseCss(id, '.tm', 4, 0.2);
    body += at(4, 'pop', tag(170, 334, '발효', ROLE.y, 24), 1.1);
    put(K + '1/발효', svg(id, body, css));
  })();

  // ── 1단원: 섣달(음력 열두 달 고리 — 정월에서 시작해 맨 끝 열두째 달이 섣달, 그다음은 설날) ──────────────────────────────
  (function () {
    const id = 't41-k1-seotdal';
    let css = base(id);
    const CX = 320, CY = 186, RX = 248, RY = 124;
    const pos = (m) => { const a = (-90 + (m - 1) * 30) * Math.PI / 180; return [f(CX + RX * Math.cos(a)), f(CY + RY * Math.sin(a))]; };
    let body = '';
    for (let m = 1; m <= 12; m++) {
      const [x, y] = pos(m);
      body += at(1, 'pop', `<g class="mo mo${m}">${tile(x, y, `${m}월`, { size: 22, h: 42, w: 76, fill: 'white', stroke: C.line, sw: 3 })}</g>`, 0.1 + (m - 1) * 0.06);
      if (m <= 11) css += paint(id, `.mo${m}`, ROLE.p, 2, f(0.5 + (m - 1) * 0.14));
    }
    // 가운데: 달이 차고 기운다
    const phases = [
      (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`,
      (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="white" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x} ${y - 15} A15 15 0 0 1 ${x} ${y + 15} A8 15 0 0 0 ${x} ${y - 15} Z" fill="${C.yellow}"/>`,
      (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="white" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x} ${y - 15} A15 15 0 0 1 ${x} ${y + 15} Z" fill="${C.yellow}"/>`,
      (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`
    ];
    body += phases.map((p, i) => at(1, 'pop', p(260 + i * 40, 186), 0.9 + i * 0.25)).join('');
    body += at(1, 'pop', tag(320, 232, '음력', ROLE.y, 20), 1.9);
    // 칸 2: 정월부터 한 달씩
    body += at(2, 'pop', tag(320, 108, '정월', ROLE.p, 20), 0.2);
    // 칸 3: 열두째 달 = 섣달, 다음은 설날
    css += paint(id, '.mo12', ROLE.o, 3, 0.2) + `.on3 .sc-${id} .mo12 { animation: ${id}-shake .5s ease-in-out .5s 2; }`;
    const [x12, y12] = pos(12);
    body += at(3, 'pop', `<g class="sd">${tag(x12 + 6, y12 + 50, '섣달', ROLE.o, 22)}</g>`, 0.8);
    body += curve(x12 + 34, y12 - 12, 284, 44, 26, C.red, 3, { width: 4, delay: 1.2 });
    body += at(3, 'pop', tag(208, 22, '설날', ROLE.r, 18), 2.0);
    // 칸 4
    body += glowRect(x12 - 44, y12 - 27, 88, 54, 4, C.orange, 0.2, 14);
    css += pulseCss(id, '.sd', 4, 0.6);
    put(K + '1/섣달', svg(id, body, css));
  })();

  // ── 매체 단원: 검색어(박물관 누리집 — '국가유산'만 넣으면 너무 많고, '○○ 지역'을 더하면 원하는 자료) ──────────────────────────────
  (function () {
    const id = 't41-k1-geomsaek';
    let css = base(id);
    let body = at(1, 'fin', browser(30, 14, 580, 300)) + at(1, 'fin', searchBox(56, 64, 528, 56), 0.2);
    const chip = (cx, label, w) => tile(cx, 92, label, { size: 22, h: 40, w, fill: C.sky, stroke: C.blue, sw: 2.5 });
    const W1 = 108, W2 = 112, X1 = 74 + W1 / 2, X2 = 74 + W1 + 10 + W2 / 2;
    // '국가유산'은 처음엔 맨 앞, 칸 3에 '○○ 지역'이 들어오면 뒤로 비킨다
    body += `<g class="b1"><g class="c2">${g('drop drop1', chip(X2, '국가유산', W2), 0.6)}</g></g>`;
    css += move(id, 'c2', `translateX(${-(W1 + 10)}px)`, 3, { dur: 0.6, delay: 0.2 });
    body += `<g class="b1"><circle class="ring ring1" cx="556" cy="92" r="23" fill="none" stroke="${C.blue}" stroke-width="3" style="animation-delay:1.3s"/></g>`;
    css += pulseCss(id, '.btn', 1, 1.2);
    // 칸 2: 결과가 너무 많다
    const many = ['국가유산 체험', '국가유산 사진', '국가유산 소식', '국가유산 지도', '국가유산 놀이', '국가유산 여행'];
    body += `<g class="b2"><g class="many"><g class="ms">` + many.map((l, i) => g('pop pop2', tile(i % 2 ? 455 : 185, 164 + (i >> 1) * 54, l, { size: 19, h: 42, w: 250, fill: 'white', stroke: C.line }), 0.2 + i * 0.12)).join('')
      + `<rect x="596" y="138" width="6" height="168" rx="3" fill="${C.line}"/><rect x="596" y="138" width="6" height="20" rx="3" fill="${C.muted}"/></g></g></g>`;
    css += `.on2 .sc-${id} .ms { animation: ${id}-shake .5s ease-in-out 1.2s 2; }
      .sc-${id} .many { transition: transform .7s ease-in, opacity .5s ease; }
      .on3 .sc-${id} .many { transform: translateY(40px); opacity: 0; }`;
    // 칸 3: 핵심 낱말 두 개
    body += at(3, 'slide', chip(X1, '○○ 지역', W1), 0.7);
    body += at(3, 'pop', tile(320, 214, '○○ 지역 대표 유물 전시회', { size: 20, h: 46, w: 380, fill: C.mint, stroke: C.green }) + check(536, 214, 11), 1.4);
    body += at(3, 'pop', tile(320, 272, '○○ 지역 국가유산', { size: 20, h: 46, w: 380, fill: C.mint, stroke: C.green }) + check(536, 272, 11), 1.7);
    // 칸 4
    body += glowRect(X1 - W1 / 2 - 6, 66, W1 + W2 + 22, 52, 4, C.blue, 0.1, 14);
    body += at(4, 'pop', `<g class="kw">${tag(X1 + 60, 150, '검색어', ROLE.s, 22)}</g>`, 0.5);
    css += pulseCss(id, '.kw', 4, 1);
    put(K + 'media/검색어', svg(id, body, css));
  })();

  // ── 매체 단원: 정보 무늬(교과서 귀퉁이의 까만 네모 무늬 — 카메라가 훑어 읽으면 누리집이 열린다) ──────────────────────────────
  (function () {
    const id = 't41-k1-qr';
    let css = base(id);
    // 21칸 네모 무늬: 세 귀퉁이의 찾기 무늬, 6번째 줄·칸의 점선, 나머지는 정해진 차례의 흑백
    const qr = (x0, y0, m) => {
      const N = 21;
      let s = 20261109, d = '';
      const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      const fin = (r, c) => {
        const rr = r < 8 ? r : r - (N - 7), cc = c < 8 ? c : c - (N - 7);
        if (rr < 0 || cc < 0 || rr > 6 || cc > 6) return false;
        return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
      };
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const inF = (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
        const v = rnd();
        const on = inF ? fin(r, c) : (r === 6 || c === 6) ? (r + c) % 2 === 0 : v < 0.5;
        if (on) d += `M${f(x0 + c * m)} ${f(y0 + r * m)}h${m}v${m}h${-m}z`;
      }
      return `<rect x="${f(x0 - m)}" y="${f(y0 - m)}" width="${f(23 * m)}" height="${f(23 * m)}" fill="white"/><path d="${d}" fill="${C.ink}"/>`;
    };
    // 교과서 쪽과 무늬
    let body = at(1, 'fin', `<rect x="30" y="24" width="248" height="290" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + bar(54, 52, 190) + bar(54, 76, 150));
    body += at(1, 'pop', `<g class="qr">${qr(70, 112, 8)}</g>`, 0.3);
    css += pulseCss(id, '.qr', 1, 1);
    // 칸 2: 휴대 전화가 무늬를 찍는다
    const phone = `<rect x="384" y="24" width="186" height="300" rx="28" fill="${C.ink}"/><rect x="396" y="54" width="162" height="244" rx="8" fill="white"/><circle cx="477" cy="40" r="5" fill="${C.muted}"/><rect x="452" y="306" width="50" height="7" rx="3.5" fill="${C.muted}"/>`;
    body += at(2, 'fin', `<path d="M384 150 L246 104 L246 296 L384 212 Z" fill="${C.yellow}" opacity=".28"/>`, 0.5);
    body += at(2, 'slideL', phone, 0.1);
    body += `<g class="h3"><g class="b2">${g('fin fin2', `<g transform="translate(420 112) scale(.6)">${qr(8, 8, 8)}</g>`
      + [[414, 100, 1, 1], [540, 100, -1, 1], [414, 236, 1, -1], [540, 236, -1, -1]].map(([x, y, a, b]) => `<path d="M${x} ${y + b * 18} V${y} H${x + a * 18}" stroke="${C.orange}" stroke-width="4" fill="none"/>`).join(''), 0.7)}`
      + `<g class="sl"><rect x="412" y="108" width="130" height="4" rx="2" fill="${C.orange}"/></g></g></g>`;
    css += `@keyframes ${id}-sl { 0%, 100% { transform: none; } 50% { transform: translateY(116px); } }
      .sc-${id} .sl { opacity: 0; } .on2 .sc-${id} .sl { opacity: 1; animation: ${id}-sl 1.4s ease-in-out 1s infinite; transition: opacity .3s ease 1s; }`;
    // 칸 3: 화면에 누리집이 열린다
    let site = `<rect x="396" y="54" width="162" height="40" fill="${C.mint}"/>` + text(477, 81, '국립부여박물관', { size: 18 });
    site += `<rect x="412" y="108" width="130" height="92" rx="8" fill="${C.sky}"/><path d="M462 186 Q458 160 477 150 Q496 160 492 186 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/><path d="M468 186 H486 L490 196 H464 Z" fill="${C.orange}"/><circle cx="477" cy="142" r="6" fill="${C.orange}"/>`;
    site += [218, 238, 258, 278].map((y, i) => bar(412, y, [130, 112, 124, 90][i])).join('');
    body += `<g class="b3"><g class="st">${site}</g></g>`;
    css += `.sc-${id} .st { transform: translateY(20px); opacity: 0; transition: transform .7s ease-out .3s, opacity .5s ease .3s; } .on3 .sc-${id} .st { transform: none; opacity: 1; }`;
    // 칸 4
    body += glowRect(60, 102, 188, 188, 4, C.green, 0.2, 8);
    body += at(4, 'pop', tag(154, 340, '정보 무늬', ROLE.p, 22), 0.7);
    put(K + 'media/정보 무늬', svg(id, body, css));
  })();

  // ── 매체 단원: 누리 소통망(사람들이 그물처럼 이어지고, 한 사람이 올린 글과 사진이 퍼져 댓글이 오간다) ──────────────────────────────
  (function () {
    const id = 't41-k1-nuri';
    let css = base(id);
    const P = [[110, 80], [320, 58], [530, 80], [80, 226], [320, 188], [560, 226], [200, 306], [440, 306]];
    const E = [[0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 6], [4, 7], [5, 7], [6, 7]];
    const COL = [C.blue, C.purple, C.green, C.red, C.orange, C.blue, C.green, C.purple];
    const NB = [1, 3, 5, 6, 7];
    let body = '';
    E.forEach(([a, b], i) => {
      const hot = a === 4 || b === 4 ? ` hot` : '';
      body += drawLine(`M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}`, C.muted, 2, { width: 3.5, delay: f(0.1 + i * 0.07), cls: `eg${hot}` });
    });
    P.forEach(([x, y], i) => {
      body += at(1, 'pop', `<circle cx="${x}" cy="${y}" r="28" fill="white" stroke="${COL[i]}" stroke-width="3"/>` + person(x, y + 12, COL[i], 9)
        + `<rect x="${x + 12}" y="${y + 4}" width="11" height="17" rx="2.5" fill="${C.ink}"/>`, 0.1 + i * 0.08);
    });
    css += `.sc-${id} .eg { transition: stroke-dashoffset 1s ease-in-out, stroke .5s ease; }
      .on3 .sc-${id} .hot { stroke: ${C.orange}; transition-delay: 0s, .2s; }
      .on4 .sc-${id} .eg { stroke: ${C.green}; animation: ${id}-flash 1.4s ease-in-out .1s both; }`;
    // 칸 3: 가운데 사람이 글과 사진을 올리면 그물을 따라 퍼진다
    const card = (x, y) => `<rect x="${x - 17}" y="${y - 13}" width="34" height="26" rx="4" fill="white" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 13} ${y + 9} L${x - 3} ${y - 3} L${x + 4} ${y + 4} L${x + 8} ${y} L${x + 13} ${y + 9} Z" fill="${C.green}"/><circle cx="${x + 7}" cy="${y - 6}" r="3" fill="${C.yellow}"/>`;
    const [cx0, cy0] = [P[4][0] + 30, P[4][1] - 30];
    body += at(3, 'pop', card(cx0, cy0), 0.1);
    NB.forEach((k, i) => {
      const tx = P[k][0] + 30, ty = P[k][1] - 30;
      body += `<g class="b3"><g class="pc pc${i}">${card(cx0, cy0)}</g></g>`;
      css += `.sc-${id} .pc${i} { opacity: 0; transition: transform 1s ease-in-out ${f(0.5 + i * 0.2)}s, opacity .3s ease ${f(0.5 + i * 0.2)}s; }
        .on3 .sc-${id} .pc${i} { transform: translate(${tx - cx0}px, ${ty - cy0}px); opacity: 1; }`;
      body += at(3, 'pop', `<path d="${heartD(P[k][0] - 28, P[k][1] - 26, 0.22)}" fill="${C.red}"/>`, f(1.7 + i * 0.2));
    });
    // 칸 4
    body += at(4, 'pop', tag(320, 342, '누리 소통망', ROLE.y, 22), 0.9);
    put(K + 'media/누리 소통망', svg(id, body, css));
  })();

  // ── 매체 단원: 접속(태블릿 주소창에 박물관 주소를 넣으면 누리집과 이어져 화면이 열린다) ──────────────────────────────
  (function () {
    const id = 't41-k1-jeopsok';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="20" y="62" width="270" height="238" rx="20" fill="white" stroke="${C.ink}" stroke-width="4"/><rect x="34" y="76" width="242" height="210" rx="8" fill="${C.paper}" stroke="${C.line}" stroke-width="2"/>`
      + `<rect x="44" y="86" width="222" height="34" rx="17" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`);
    body += at(1, 'pop', tag(155, 36, '태블릿 피시', ROLE.g, 18), 0.3);
    // 누리집
    let site = browser(370, 46, 246, 216, { barH: 30 }) + `<rect x="371.5" y="77" width="243" height="36" fill="${C.mint}"/>` + text(493, 102, '국립부여박물관', { size: 18 });
    site += `<rect x="388" y="126" width="96" height="80" rx="6" fill="${C.sky}"/><path d="M420 196 Q416 170 436 160 Q456 170 452 196 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
    site += [140, 160, 180, 200].map((y, i) => bar(498, y, [100, 84, 96, 70][i])).join('') + bar(388, 226, 210) + bar(388, 246, 170);
    body += at(1, 'fin', site, 0.2);
    body += `<g class="h3">` + at(1, 'fin', dashed(296, 180, 364, 156), 0.6) + at(1, 'pop', `<circle cx="330" cy="168" r="18" fill="white" stroke="${C.red}" stroke-width="3"/>` + text(330, 177, '?', { size: 24, color: C.red, weight: 800 }), 0.9) + '</g>';
    // 칸 2: 주소창에 주소를 쳐 넣는다
    const tc = typeCover(id, 'cv', 52, 90, 208, 26, 2, { delay: 0.2, steps: 9, dur: 1.4 });
    body += `<g class="b2">${text(56, 110, 'buyeo.museum.go.kr', { size: 18, anchor: 'start', weight: 600 })}${tc.body}</g>`;
    css += tc.css;
    body += glowRect(40, 82, 230, 42, 2, C.blue, 1.7, 20);
    // 칸 3: 이어진다
    body += drawLine('M292 182 L366 156', C.blue, 3, { width: 6, delay: 0.1 });
    body += `<g class="b3">` + [0, 0.4, 0.8].map((d) => `<g class="dt" style="animation-delay:${f(0.8 + d)}s"><circle cx="292" cy="182" r="5" fill="${C.orange}"/></g>`).join('') + '</g>';
    css += `@keyframes ${id}-dt { 0% { transform: none; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translate(74px, -26px); opacity: 0; } }
      .on3 .sc-${id} .dt { animation: ${id}-dt 1.2s linear infinite; }`;
    let mini = `<rect x="44" y="130" width="222" height="32" fill="${C.mint}"/>` + text(155, 152, '국립부여박물관', { size: 18 });
    mini += `<rect x="54" y="172" width="86" height="72" rx="6" fill="${C.sky}"/><path d="M84 236 Q80 212 97 204 Q114 212 110 236 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
    mini += [186, 206, 226].map((y, i) => bar(152, y, [100, 84, 94][i])).join('') + bar(54, 264, 200);
    body += `<g class="b3"><g class="mi">${mini}</g></g>`;
    css += `.sc-${id} .mi { transform: translateY(18px); opacity: 0; transition: transform .7s ease-out 1s, opacity .5s ease 1s; } .on3 .sc-${id} .mi { transform: none; opacity: 1; }`;
    // 칸 4: 접속하는 세 가지 길
    body += at(4, 'pop', `<g class="jk">${tag(330, 122, '접속', ROLE.s, 22)}</g>`, 0.2);
    css += pulseCss(id, '.jk', 4, 0.8);
    body += [['정보 무늬', 160, ROLE.g], ['주소창', 320, ROLE.s], ['검색창', 480, ROLE.g]].map(([l, x, r], i) => at(4, 'rise', tag(x, 330, l, r, 18), 0.6 + i * 0.2)).join('');
    put(K + 'media/접속', svg(id, body, css));
  })();

  // ── 매체 단원: 간격(공룡 발자국 화석 사이의 거리 / 모기 기피제를 3~4시간마다 다시 바름) ──────────────────────────────
  (function () {
    const id = 't41-k1-gangyeok';
    let css = base(id);
    const print = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="-8" cy="0" rx="12" ry="11" fill="${C.muted}"/>`
      + [-40, 0, 40].map((a) => `<path d="M0 -6 Q18 -5 32 0 Q18 5 0 6 Z" transform="rotate(${a})" fill="${C.muted}"/>`).join('') + '</g>';
    let body = at(1, 'fin', `<rect x="20" y="54" width="600" height="100" rx="16" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`);
    const FX = [110, 250, 390, 530], FY = [84, 124, 84, 124];
    body += FX.map((x, i) => at(1, 'pop', print(x, FY[i]), 0.3 + i * 0.3)).join('');
    body += at(1, 'pop', tag(110, 30, '발자국 화석', ROLE.o, 18), 1.4);
    // 칸 2: 발자국과 발자국 사이
    const span = (x1, x2, y, color) => `<path d="M${x1} ${y - 9} V${y + 9} M${x2} ${y - 9} V${y + 9}" stroke="${color}" stroke-width="3"/>` + `<path d="M${x1 + 4} ${y} H${x2 - 4}" stroke="${color}" stroke-width="3.5"/>`
      + head(x2 - 3, y, 0, color, 3.5) + head(x1 + 3, y, Math.PI, color, 3.5);
    body += [0, 1, 2].map((i) => at(2, 'fin', `<g class="sp">${span(FX[i], FX[i + 1], 176, C.orange)}</g>`, 0.2 + i * 0.4)).join('');
    body += at(2, 'pop', `<g class="gk">${tag(320, 30, '간격', ROLE.y, 22)}</g>`, 1.5);
    // 칸 3: 시간 줄 위에서 3~4시간마다 바른다
    body += `<g class="b3"><path class="draw draw3 tl3" pathLength="1" d="M60 278 H594" stroke="${C.ink}" stroke-width="3.5" fill="none"/>${g('fin fin3', head(606, 278, 0, C.ink, 3.5), 2.2)}</g>`;
    css += `.sc-${id} .tl3 { transition-duration: 2.4s; transition-timing-function: linear; }`;
    body += at(3, 'fin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((k) => `<path d="M${80 + k * 37.5} 271 V285" stroke="${C.muted}" stroke-width="2"/>`).join('') + text(610, 310, '시간', { size: 18, color: C.muted, anchor: 'end' }), 0.3);
    const BX = [80, 220, 360, 500];
    const bottle = (x) => `<rect x="${x - 11}" y="220" width="22" height="38" rx="5" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/><rect x="${x - 6}" y="210" width="12" height="11" rx="2" fill="${C.green}"/><path d="M${x + 6} 214 H${x + 14}" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>`;
    BX.forEach((x, i) => {
      body += at(3, 'pop', bottle(x), f(0.2 + i * 0.6));
      body += `<g class="b3"><g class="mist" style="animation-delay:${f(0.5 + i * 0.6)}s">` + [[20, 206], [26, 214], [20, 222]].map(([dx, y]) => `<circle cx="${x + dx}" cy="${y}" r="3.5" fill="${C.blue}" opacity=".7"/>`).join('') + '</g></g>';
      if (i < 3) body += at(3, 'fin', braceBottom(x + 8, BX[i + 1] - 8, 292, C.orange) + text((x + BX[i + 1]) / 2, 336, '3~4시간', { size: 18, color: C.orange }), f(0.6 + i * 0.6));
    });
    css += `@keyframes ${id}-mist { 0% { transform: none; opacity: 0; } 30% { opacity: 1; } 100% { transform: translateX(16px); opacity: 0; } }
      .on3 .sc-${id} .mist { animation: ${id}-mist .8s ease-out both; }`;
    // 칸 4
    css += `.on4 .sc-${id} .sp { animation: ${id}-flash 1.4s ease-in-out .1s both; }` + pulseCss(id, '.gk', 4, 0.4);
    body += [0, 1, 2].map((i) => glowRect(BX[i] + 4, 288, BX[i + 1] - BX[i] - 8, 56, 4, C.orange, f(0.6 + i * 0.2), 12)).join('');
    put(K + 'media/간격', svg(id, body, css));
  })();

  // 4단원에 같이 쓰는 작은 그림: 눈 결정, 공과 발
  const snow = (x, y, r = 16, col = C.blue) => `<g>${[0, 60, 120].map((a) => { const c = Math.cos(a * Math.PI / 180) * r, s = Math.sin(a * Math.PI / 180) * r; return `<path d="M${f(x - c)} ${f(y - s)} L${f(x + c)} ${f(y + s)}" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>`; }).join('')}<circle cx="${x}" cy="${y}" r="3.5" fill="${col}"/></g>`;
  const ball = (x, y, r = 15) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${f(y - r * 0.45)} L${f(x + r * 0.43)} ${f(y - r * 0.14)} L${f(x + r * 0.27)} ${f(y + r * 0.36)} L${f(x - r * 0.27)} ${f(y + r * 0.36)} L${f(x - r * 0.43)} ${f(y - r * 0.14)} Z" fill="${C.ink}"/>`;
  const foot = (x, y) => `<path d="M${x - 30} ${y - 26} V${y - 4} Q${x - 30} ${y + 8} ${x - 18} ${y + 8} H${x + 6} Q${x + 14} ${y + 8} ${x + 14} ${y} Q${x + 14} ${y - 8} ${x + 2} ${y - 8} H${x - 14} V${y - 26} Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`;

  // ── 4단원: 동형이의어(물이 차다 · 공을 차다 — 겹치면 똑같은 '차다'가 서로 아무 관계 없는 두 상자로 갈린다) ──────────────────────────────
  (function () {
    const id = 't41-k1-donghyeong';
    let css = base(id);
    const L = row(['물이', '차다'], { y: 62, cx: 166, size: 26, gap: 12 }), R = row(['공을', '차다'], { y: 62, cx: 474, size: 26, gap: 12 });
    let body = at(1, 'rise', T(L[0]) + `<rect x="${f(L[1].l)}" y="34" width="${L[1].w}" height="56" rx="12" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="7 6"/>`)
      + at(1, 'rise', T(R[0]) + `<rect x="${f(R[1].l)}" y="34" width="${R[1].w}" height="56" rx="12" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.3);
    // 칸 3에 드러날 두 상자(낱말 조각보다 먼저 깐다)
    const box = (x0, col, fill) => `<rect x="${x0}" y="228" width="240" height="104" rx="16" fill="${fill}" fill-opacity=".5" stroke="${col}" stroke-width="3"/>`;
    body += at(3, 'fin', box(40, C.blue, C.sky) + box(360, C.orange, C.peach), 0.3);
    const word = (p, cls) => `<g class="b1"><g class="${cls}">${T(p, { fill: TAN, stroke: C.orange, cls: `${cls}t` })}</g></g>`;
    body += word(L[1], 'wl') + word(R[1], 'wr');
    // 칸 2: 가운데에서 겹친다 / 칸 3: 두 상자로 갈린다
    css += steps(id, 'wl', 'none', [[2, `translate(${f(320 - L[1].cx)}px, 96px)`, 0.2], [3, `translate(${f(160 - L[1].cx)}px, 150px)`, 0.2]], { box: false });
    css += steps(id, 'wr', 'none', [[2, `translate(${f(320 - R[1].cx)}px, 96px)`, 0.5], [3, `translate(${f(480 - R[1].cx)}px, 150px)`, 0.2]], { box: false });
    body += `<g class="h3"><g class="b2"><circle class="ring ring2" cx="320" cy="158" r="44" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:1.3s"/></g>${at(2, 'pop', tag(320, 214, '같은 소리·같은 모양', ROLE.y, 18), 1.6)}</g>`;
    // 칸 3: 서로 떨어진 두 상자
    body += at(3, 'pop', snow(84, 288) + tag(190, 288, '온도가 낮다', ROLE.s, 20), 1.1);
    body += at(3, 'pop', foot(398, 298) + `<g class="bl">${ball(432, 282, 13)}</g>` + tag(528, 288, '발로 지르다', ROLE.o, 20), 1.3);
    css += `@keyframes ${id}-kick { 0% { transform: none; } 60% { transform: translate(12px, -10px); } 100% { transform: none; } }
      .on3 .sc-${id} .bl { animation: ${id}-kick .7s ease-out 1.8s 2; }`;
    // 사전 번호(차다4·차다2)
    body += at(3, 'pop', badge(206, 192, 4, C.blue), 1.6) + at(3, 'pop', badge(526, 192, 2, C.orange), 1.7);
    body += at(3, 'pop', cross(320, 280, 11, C.red), 2.0);
    // 칸 4
    body += glowRect(36, 224, 248, 112, 4, C.blue, 0.1, 18) + glowRect(356, 224, 248, 112, 4, C.orange, 0.3, 18);
    body += at(4, 'pop', tag(320, 140, '동형이의어', ROLE.y, 22), 0.8);
    put(K + '4/동형이의어', svg(id, body, css));
  })();

  // ── 4단원: 다의어(눈 — 보는 몸의 부분에서 알아보는 힘, 가려 보는 힘으로 뜻이 가지 친다) ──────────────────────────────
  (function () {
    const id = 't41-k1-daeui';
    let css = base(id);
    const Y = [74, 186, 298], COLS = [ROLE.o, ROLE.s, ROLE.x];
    const EX = ['눈을 깜빡이다', '눈이 나쁘다', '과일 보는 눈'], MEAN = ['보는 몸의 부분', '알아보는 힘', '가려 보는 힘'];
    let body = at(1, 'pop', eye(90, 116, C.orange), 0.1);
    body += at(1, 'pop', `<g class="rt">${tile(90, 186, '눈', { size: 36, h: 72, w: 84, fill: TAN, stroke: C.orange, sw: 4 })}</g>`, 0.2);
    Y.forEach((y, i) => {
      const n = i + 1, ex = EX[i], w = wOf(ex, 20), cx = 262 + w / 2;
      body += drawLine(`M134 186 C186 186 186 ${y} 238 ${y}`, COLS[i][1], n, { width: 5, delay: 0.3, cls: 'br' });
      body += at(n, 'pop', badge(238, y, n, COLS[i][1]), 1.0);
      body += at(n, 'pop', tile(cx, y, ex, { size: 20, h: 46, fill: 'white', stroke: COLS[i][1], sw: 3 }), 1.2);
      body += drawArrow(cx + w / 2 + 6, y, 444, y, COLS[i][1], n, { width: 3, delay: 1.5 });
      body += at(n, 'pop', tag(532, y, MEAN[i], COLS[i], 20), 2.0);
    });
    // 칸 4: 뜻끼리 점선으로 이어진 한 낱말
    body += at(4, 'fin', [[94, 166], [206, 278]].map(([a, b]) => `<path d="M532 ${a} V${b}" stroke="${C.green}" stroke-width="3.5" stroke-dasharray="5 6" stroke-linecap="round"/>`).join(''), 0.6);
    css += `.sc-${id} .br { transition: stroke-dashoffset 1s ease-in-out, stroke .6s ease; } .on4 .sc-${id} .br { stroke: ${C.green}; transition-delay: 0s, .2s; }`;
    css += pulseCss(id, '.rt', 4, 0.5);
    body += at(4, 'pop', tag(90, 268, '다의어', ROLE.p, 22), 0.9);
    put(K + '4/다의어', svg(id, body, css));
  })();

  // ── 4단원: 형태(두 '차다'는 겉꼴이 똑같고, 먹고·먹었다·먹기도는 끝부분 꼴이 다르다) ──────────────────────────────
  (function () {
    const id = 't41-k1-hyeongtae';
    let css = base(id);
    const XL = 200, XR = 440, WY = 130;
    let body = at(1, 'rise', tile(XL, 42, '물이 차다', { size: 22, h: 46 })) + at(1, 'rise', tile(XR, 42, '공을 차다', { size: 22, h: 46 }), 0.2);
    body += drawArrow(XL, 68, XL, 90, C.muted, 1, { width: 3, delay: 0.5 }) + drawArrow(XR, 68, XR, 90, C.muted, 1, { width: 3, delay: 0.6 });
    const big = (x, cls) => `<g class="${cls}">${tile(x, WY, '차다', { size: 34, h: 66, w: 116, fill: 'white', stroke: C.ink, sw: 3 })}</g>`;
    body += at(1, 'drop', big(XL, 'bl'), 0.8) + at(1, 'drop', big(XR, 'br'), 1.0);
    // 칸 2: 오른쪽 '차다'의 겉꼴(점선)이 왼쪽으로 가서 꼭 맞는다
    body += `<g class="b2"><g class="gh"><rect x="${XR - 62}" y="${WY - 37}" width="124" height="74" rx="15" fill="none" stroke="${C.green}" stroke-width="4" stroke-dasharray="9 6"/></g></g>`;
    css += steps(id, 'gh', 'none', [[2, `translate(${XL - XR}px, 0px)`, 0.3]], { dur: 1.2, box: false }) + `\n.on3 .sc-${id} .gh { transform: none; transition-delay: .1s; }`;
    css += paint(id, '.bl', ROLE.p, 2, 1.5) + paint(id, '.br', ROLE.p, 2, 1.5);
    body += at(2, 'pop', text(320, WY + 14, '=', { size: 44, color: C.green, weight: 800 }), 1.7);
    body += at(2, 'pop', snow(XL, 208) + ball(XR, 208, 15) + text(320, 218, '≠', { size: 30, color: C.muted, weight: 800 }), 2.0);
    // 칸 3: 끝부분 꼴이 다른 세 낱말
    const EN = [['먹', '고', 150], ['먹', '었다', 320], ['먹', '기도', 490]];
    EN.forEach(([s, e, x], i) => { body += at(3, 'rise', `<g class="ew">${twoTone(x, 292, s, e, { size: 28, h: 58 })}</g>`, 0.2 + i * 0.3); });
    body += at(3, 'pop', text(236, 302, '≠', { size: 30, color: C.orange, weight: 800 }) + text(406, 302, '≠', { size: 30, color: C.orange, weight: 800 }), 1.3);
    css += `.on3 .sc-${id} .he { animation: ${id}-flash 1.4s ease-in-out 1.1s both; }`;
    // 칸 4
    body += glowRect(130, 90, 380, 80, 4, C.green, 0.1, 18) + glowRect(84, 256, 472, 72, 4, C.orange, 0.4, 18);
    body += at(4, 'pop', tag(574, WY, '형태', ROLE.y, 24), 0.9);
    put(K + '4/형태', svg(id, body, css));
  })();

  // ── 4단원: 기본형(먹고·먹었다·먹기도·먹었구나 → 그대로인 '먹'에 '다'를 붙인 '먹다'가 국어사전에) ──────────────────────────────
  (function () {
    const id = 't41-k1-gibon';
    let css = base(id);
    const ys = [70, 140, 210, 280], EN = [['고', 64], ['었다', 92], ['기도', 92], ['었구나', 120]];
    let body = '';
    ys.forEach((y, k) => {
      const [e, w] = EN[k];
      body += `<g class="dim dim3">${at(1, 'rise', `<g class="st">${tile(80, y, '먹', { size: 28, h: 52, w: 62 })}</g>`, k * 0.25)}</g>`;
      body += `<g class="b3"><g class="sm sm${k}">${tile(80, y, '먹', { size: 28, h: 52, w: 62, fill: C.mint, stroke: C.green })}</g></g>`;
      body += `<g class="en">${at(1, 'rise', tile(80 + 31 + 6 + w / 2, y, e, { size: 28, h: 52, w }), k * 0.25)}</g>`;
      css += steps(id, `sm${k}`, 'none', [[3, `translate(${380 - 80}px, ${168 - y}px)`, f(0.7 + k * 0.12)]], { dur: 0.9, box: false });
    });
    css += `.sc-${id} .en { transition: transform .7s ease-in-out .3s, opacity .5s ease; }
      .on2 .sc-${id} .en { transform: translateX(14px); }
      .on3 .sc-${id} .en { transform: translate(14px, 40px); opacity: 0; transition: transform .6s ease-in .2s, opacity .5s ease .3s; }`;
    css += paint(id, '.st', ROLE.p, 2, 0.8) + paint(id, '.en', ROLE.o, 2, 0.8);
    body += `<g class="h3">` + at(2, 'fin', text(80, 26, '그대로', { size: 19, color: C.green }), 1.0) + at(2, 'fin', text(186, 26, '바뀜', { size: 19, color: C.orange }), 1.2) + '</g>';
    // 칸 3: '먹' + '다' = '먹다'
    body += drawArrow(270, 168, 336, 168, C.green, 3, { delay: 0.4 });
    body += at(3, 'drop', `<g class="da">${tile(446, 168, '다', { size: 28, h: 52, w: 62, fill: C.lilac, stroke: C.purple })}</g>`, 1.6);
    body += `<g class="b3"><circle class="ring ring3" cx="446" cy="168" r="32" fill="none" stroke="${C.purple}" stroke-width="3" style="animation-delay:1.8s"/></g>`;
    // 칸 4: 국어사전에 실린 꼴
    body += glowRect(342, 136, 142, 64, 4, C.green, 0.2);
    body += at(4, 'drop', tag(413, 104, '기본형', ROLE.p, 24), 0.5);
    body += `<g class="b4"><path class="draw draw4" pathLength="1" d="M413 204 V230" stroke="${C.blue}" stroke-width="3" style="transition-delay:.6s"/></g>`;
    const dict = `<rect x="320" y="236" width="230" height="104" rx="10" fill="white" stroke="${C.blue}" stroke-width="3"/><rect x="320" y="236" width="14" height="104" rx="5" fill="${C.sky}"/>`
      + text(350, 276, '먹다', { size: 24, anchor: 'start', weight: 800 }) + bar(412, 270, 120, GRAY, 9) + bar(350, 300, 182) + bar(350, 322, 140);
    body += at(4, 'pop', dict + tag(250, 288, '국어사전', ROLE.s, 18), 0.9);
    put(K + '4/기본형', svg(id, body, css));
  })();

  // ── 4단원: 뜻풀이(국어사전 '차다' — 낱말 옆에 풀이 줄이 이어지고, 쓰임 예가 붙는다) ──────────────────────────────
  (function () {
    const id = 't41-k1-tteutpuri';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="30" y="20" width="580" height="312" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/><rect x="30" y="20" width="16" height="312" rx="6" fill="${C.sky}"/>`);
    const grey = (y, n) => text(64, y + 8, '차다', { size: 24, anchor: 'start', color: C.muted }) + text(118, y - 4, n, { size: 18, anchor: 'start', color: C.muted }) + bar(150, y, [300, 260, 280][n % 3], GRAY, 10);
    body += `<g class="dim dim2">` + at(1, 'fin', grey(62, 1), 0.2) + at(1, 'fin', grey(252, 3), 0.3) + at(1, 'fin', grey(298, 4), 0.4) + '</g>';
    body += at(1, 'pop', `<g class="hw">${text(64, 148, '차다', { size: 32, anchor: 'start', weight: 800 })}${text(132, 128, '2', { size: 20, anchor: 'start', color: C.orange })}</g>`, 0.5);
    css += pulseCss(id, '.hw', 1, 1);
    // 칸 2: 낱말 옆 풀이 줄
    const tc = typeCover(id, 'cv', 154, 116, 336, 42, 2, { delay: 0.2, steps: 15, dur: 1.6 });
    body += `<g class="b2">${text(158, 146, '발로 내어 지르거나 받아 올리다.', { size: 21, anchor: 'start', weight: 600 })}${tc.body}</g>`;
    css += tc.css;
    body += drawLine('M158 160 H480', C.orange, 2, { width: 4, delay: 1.9 });
    // 칸 3: 쓰임 예
    body += at(3, 'pop', tag(178, 196, '예', ROLE.s, 18), 0.2) + at(3, 'fin', text(204, 204, '공을 차다.', { size: 21, anchor: 'start', weight: 600, color: C.blue }), 0.5);
    body += `<g class="b3"><g class="rb">${ball(330, 198, 13)}</g></g>`;
    css += `@keyframes ${id}-roll { from { transform: translateX(-30px) rotate(-200deg); opacity: 0; } to { transform: none; opacity: 1; } }
      .sc-${id} .rb { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .rb { animation: ${id}-roll 1s ease-out .9s both; }`;
    // 칸 4
    body += glowRect(146, 108, 352, 116, 4, C.orange, 0.2, 14);
    body += at(4, 'pop', tag(560, 166, '뜻풀이', ROLE.y, 22), 0.7);
    put(K + '4/뜻풀이', svg(id, body, css));
  })();

  // ── 4단원: 가리키는 말(긴 '고양이 그림이 그려진 파란색 물병'이 이것·그것·저것으로 바뀌어 물병을 짚는다) ──────────────────────────────
  (function () {
    const id = 't41-k1-garikineun';
    let css = base(id);
    const Y = [80, 180, 280], COL = [ROLE.s, ROLE.o, ROLE.x], PT = ['이것', '그것', '저것'];
    const LONG = '고양이 그림이 그려진 파란색 물병';
    const bottle = `<rect x="542" y="98" width="36" height="20" rx="5" fill="${C.blue}"/><rect x="526" y="116" width="68" height="160" rx="18" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M542 176 L546 156 L556 168 L564 168 L574 156 L578 176 Q578 200 560 200 Q542 200 542 176 Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<circle cx="553" cy="180" r="2.5" fill="${C.ink}"/><circle cx="567" cy="180" r="2.5" fill="${C.ink}"/><path d="M556 188 Q560 192 564 188" stroke="${C.ink}" stroke-width="2" fill="none"/>`;
    let body = at(1, 'pop', `<g class="bt">${bottle}</g>`, 0.1);
    Y.forEach((y, i) => {
      body += at(1, 'pop', person(44, y + 4, COL[i][1], 13), 0.2 + i * 0.2);
      body += `<g class="b1"><g class="lg lg${i}">${g('slide slide1', tile(240, y, LONG, { size: 18, h: 46, fill: 'white', stroke: C.line, sw: 2.5 }), 0.4 + i * 0.3)}</g></g>`;
      css += `.sc-${id} .lg${i} { transform-box: fill-box; transform-origin: left center; transition: transform .6s ease-in ${f(0.2 + i * 0.4)}s, opacity .4s ease ${f(0.5 + i * 0.4)}s; }
        .on2 .sc-${id} .lg${i} { transform: scaleX(.2); opacity: 0; }`;
      body += at(2, 'pop', `<g class="pt pt${i}">${tile(118, y, PT[i], { size: 26, h: 52, fill: COL[i][0], stroke: COL[i][1], sw: 3 })}</g>`, f(0.7 + i * 0.4));
      // 칸 3: 세 말이 모두 같은 물병을 짚는다
      body += curve(168, y, 516, 190 + (i - 1) * 24, (y + 190) / 2 - 40 + i * 10, COL[i][1], 3, { width: 4, delay: f(0.2 + i * 0.45) });
    });
    css += [0, 1, 2].map((i) => `.on1 .sc-${id} .lg${i} .tl { animation: ${id}-shake .5s ease-in-out ${f(1.6 + i * 0.15)}s 1; }`).join('');
    css += pulseCss(id, '.bt', 3, 1.8);
    // 칸 4
    css += [0, 1, 2].map((i) => pulseCss(id, `.pt${i}`, 4, f(0.2 + i * 0.25))).join('');
    body += at(4, 'pop', tag(320, 334, '가리키는 말', ROLE.y, 22), 1.0);
    put(K + '4/가리키는 말', svg(id, body, css));
  })();

  // ── 4단원: 중심 생각(「감기 친구는 싫어」 — 제목과 주요 장면에서 화살표가 모여 생각 조각이 떠오른다) ──────────────────────────────
  (function () {
    const id = 't41-k1-jungsim';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="26" y="168" width="588" height="168" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(1, 'pop', `<g class="tt">${tile(320, 200, '감기 친구는 싫어', { size: 22, h: 46, fill: TAN, stroke: C.orange, sw: 3 })}</g>`, 0.3);
    css += pulseCss(id, '.tt', 1, 1);
    const SC = [['병원에 감', 130], ['막는 방법 들음', 320], ['꾸준히 실천', 510]];
    SC.forEach(([l, x], i) => {
      body += at(2, 'slide', tile(x, 290, l, { size: 20, h: 48, fill: C.sky, stroke: C.blue, sw: 2.5 }), 0.2 + i * 0.45);
      body += at(2, 'pop', badge(x - wOf(l, 20) / 2 - 2, 266, i + 1, C.blue), 0.4 + i * 0.45);
    });
    body += drawArrow(196, 290, 236, 290, C.blue, 2, { width: 3.5, delay: 0.6 }) + drawArrow(404, 290, 438, 290, C.blue, 2, { width: 3.5, delay: 1.05 });
    // 칸 3: 화살표가 모여 생각 조각이 떠오른다
    body += drawArrow(130, 262, 236, 110, C.purple, 3, { width: 4, delay: 0.2 }) + drawArrow(320, 176, 320, 128, C.purple, 3, { width: 4, delay: 0.3 }) + drawArrow(510, 262, 404, 110, C.purple, 3, { width: 4, delay: 0.4 });
    const cloud = `<ellipse cx="320" cy="72" rx="176" ry="48" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3.5"/>` + text(320, 80, '건강 수칙 꾸준히 지키기', { size: 22, color: C.ink });
    body += `<g class="b3"><g class="cd">${g('pop pop3', cloud, 1.3)}</g></g>`;
    css += `@keyframes ${id}-float { 0%, 100% { transform: none; } 50% { transform: translateY(-6px); } }
      .on3 .sc-${id} .cd { animation: ${id}-float 2s ease-in-out 2s infinite; }`;
    // 칸 4
    body += `<g class="b4"><ellipse class="flash flash4" style="animation-delay:.2s" cx="320" cy="72" rx="186" ry="58" fill="none" stroke="${C.purple}" stroke-width="5"/></g>`;
    body += at(4, 'pop', tag(570, 72, '중심 생각', ROLE.x, 20), 0.8);
    put(K + '4/중심 생각', svg(id, body, css));
  })();

  // ── 4단원: 두서없이(생각 조각이 차례 없이 뒤죽박죽 나오고, 메모지에서는 1·2·3·4 차례대로) ──────────────────────────────
  (function () {
    const id = 't41-k1-duseo';
    let css = base(id);
    const PC = ['공원에 갔어', '그네를 탔어', '넘어졌어', '병원에 갔어'];
    const COL = [ROLE.s, ROLE.p, ROLE.o, ROLE.x];
    const piece = (cx, cy, i) => tile(cx, cy, PC[i], { size: 18, h: 42, w: 126, fill: COL[i][0], stroke: COL[i][1], sw: 2.5 }) + badge(cx - 63, cy - 20, i + 1, COL[i][1]);
    // 칸 1: 머리 위에 흩어진 생각 조각
    let body = at(1, 'pop', person(84, 300, C.ink, 20), 0.1);
    const SCAT = [[110, 56], [210, 120], [90, 186], [200, 244]];
    // 칸 2: 뒤죽박죽 줄(3·1·4·2)
    const MESS = { 2: [338, 64, -7], 0: [362, 136, 6], 3: [330, 206, -5], 1: [366, 276, 8] };
    [0, 1, 2, 3].forEach((i) => {
      const [sx, sy] = SCAT[i], [mx, my, a] = MESS[i];
      body += `<g class="b1"><g class="mv mv${i}">${g('pop pop1', `<g class="jg jg${i}">${piece(sx, sy, i)}</g>`, 0.3 + i * 0.2)}</g></g>`;
      css += `.sc-${id} .mv${i} { transform-box: fill-box; transform-origin: center; transition: transform 1s ease-in-out ${f(0.2 + [1, 3, 0, 2][i] * 0.3)}s; }
        .on2 .sc-${id} .mv${i} { transform: translate(${mx - sx}px, ${my - sy}px) rotate(${a}deg); }`;
    });
    css += `@keyframes ${id}-jg { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
      .sc-${id} .jg { transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .jg { animation: ${id}-jg 1s ease-in-out infinite; }
      .on2 .sc-${id} .jg { animation: none; }`;
    body += `<g class="b2"><g class="qm">${g('pop pop2', `<circle cx="232" cy="112" r="18" fill="white" stroke="${C.red}" stroke-width="3"/>` + text(232, 121, '?', { size: 24, color: C.red, weight: 800 }), 1.8)}</g></g>`;
    css += `.on2 .sc-${id} .qm { animation: ${id}-shake .5s ease-in-out 2.3s 2; }`;
    // 칸 3: 메모지에 차례대로
    body += at(3, 'fin', `<rect x="460" y="34" width="166" height="278" rx="10" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>` + [96, 160, 224, 288].map((y) => `<path d="M472 ${y + 14} H614" stroke="${C.orange}" stroke-width="1.5" opacity=".4"/>`).join(''), 0.1);
    [0, 1, 2, 3].forEach((i) => { body += at(3, 'slideL', piece(552, 74 + i * 64, i), f(0.4 + i * 0.35)); });
    body += at(3, 'pop', tag(543, 336, '차례대로', ROLE.p, 18), 2.0);
    // 칸 4: 뒤죽박죽 쪽이 두서없이
    body += glowRect(262, 30, 178, 280, 4, C.red, 0.2, 16);
    body += at(4, 'pop', tag(350, 336, '두서없이', ROLE.r, 22), 0.8);
    put(K + '4/두서없이', svg(id, body, css));
  })();

  // ── 4단원: 증폭(낮의 피아노 소리 물결 / 밤에는 같은 소리가 크게 커져 이웃집까지) ──────────────────────────────
  (function () {
    const id = 't41-k1-jeungpok';
    let css = base(id);
    const piano = (x, y) => `<rect x="${x}" y="${y}" width="96" height="50" rx="6" fill="${C.ink}"/><rect x="${x + 6}" y="${y + 20}" width="84" height="26" fill="white"/>`
      + [1, 2, 3, 4, 5, 6].map((k) => `<path d="M${x + 6 + k * 12} ${y + 20} V${y + 46}" stroke="${C.line}" stroke-width="1.5"/>`).join('')
      + [1, 2, 4, 5, 6].map((k) => `<rect x="${x + 2 + k * 12}" y="${y + 20}" width="7" height="15" fill="${C.ink}"/>`).join('');
    const wave = (y0, A) => { let d = `M150 ${y0}`; for (let k = 0; k < 10; k++) { const x = 150 + k * 30; d += ` Q${x + 7.5} ${y0 - A} ${x + 15} ${y0} Q${x + 22.5} ${y0 + A} ${x + 30} ${y0}`; } return d; };
    const note = (x, y, col) => `<path d="M${x} ${y} V${y - 26} L${x + 14} ${y - 30} V${y - 6}" stroke="${col}" stroke-width="3" fill="none"/><ellipse cx="${x - 5}" cy="${y}" rx="6" ry="4.5" fill="${col}"/><ellipse cx="${x + 9}" cy="${y - 4}" rx="6" ry="4.5" fill="${col}"/>`;
    // 낮
    let body = at(1, 'fin', `<rect x="14" y="12" width="612" height="142" rx="16" fill="${C.sky}" fill-opacity=".55"/>`) + at(1, 'pop', sun(44, 42, 13), 0.2) + at(1, 'pop', tag(96, 42, '낮', ROLE.s, 18), 0.3);
    body += at(1, 'pop', piano(30, 78), 0.3) + at(1, 'pop', note(140, 74, C.blue), 0.6);
    body += drawLine(wave(110, 12), C.blue, 1, { width: 4, delay: 0.7, cls: 'wv' });
    // 밤
    body += at(2, 'fin', `<rect x="14" y="166" width="612" height="142" rx="16" fill="${C.lilac}" fill-opacity=".6"/>`) + at(2, 'pop', moon(42, 198, 16), 0.2) + at(2, 'pop', tag(96, 198, '밤', ROLE.x, 18), 0.3);
    body += at(2, 'pop', piano(30, 232), 0.3) + at(2, 'pop', note(140, 228, C.purple), 0.6);
    body += `<g class="b2"><g class="gw"><path class="draw draw2 wv" pathLength="1" d="${wave(264, 31)}" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linecap="round" style="transition-delay:.5s"/></g></g>`;
    css += `.sc-${id} .wv { transition-duration: 1.2s; }
      .sc-${id} .gw { transform-box: fill-box; transform-origin: center; transform: scaleY(.39); transition: transform 1s ease-out 1.1s; }
      .on2 .sc-${id} .gw { transform: none; }`;
    // 이웃집
    const house = `<rect x="490" y="226" width="110" height="70" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M480 228 L545 180 L610 228 Z" fill="${C.peach}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`
      + `<rect x="516" y="244" width="58" height="36" rx="4" fill="${C.sky}" stroke="${C.ink}" stroke-width="2"/>`;
    body += at(2, 'pop', `<g class="hs">${house}</g>`, 0.4);
    body += `<g class="h3">${at(2, 'fin', text(570, 270, 'z', { size: 18, color: C.blue }) + text(584, 258, 'z', { size: 20, color: C.blue }) + text(600, 244, 'Z', { size: 22, color: C.blue }), 0.9)}</g>`;
    body += at(2, 'fin', person(545, 278, C.orange, 9), 0.6);
    // 칸 3: 이웃이 깬다
    body += at(3, 'pop', `<circle cx="590" cy="250" r="14" fill="white" stroke="${C.red}" stroke-width="3"/>` + text(590, 258, '!', { size: 22, color: C.red, weight: 800 }), 0.4);
    css += `.on3 .sc-${id} .hs { animation: ${id}-shake .5s ease-in-out .2s 2; transform-box: fill-box; transform-origin: center; }`;
    body += `<g class="b3"><circle class="ring ring3" cx="545" cy="248" r="56" fill="none" stroke="${C.red}" stroke-width="3"/></g>`;
    // 칸 4: 작은 물결 → 큰 물결
    const amp = (x, y1, y2, col) => `<path d="M${x} ${y1 + 4} V${y2 - 4}" stroke="${col}" stroke-width="3"/>` + head(x, y1, -Math.PI / 2, col, 3) + head(x, y2, Math.PI / 2, col, 3);
    body += at(4, 'fin', amp(464, 96, 124, C.blue), 0.2) + at(4, 'fin', amp(464, 230, 298, C.purple), 0.5);
    body += glowRect(146, 220, 312, 88, 4, C.purple, 0.4, 16);
    body += at(4, 'pop', tag(320, 336, '증폭', ROLE.y, 24), 1.0);
    put(K + '4/증폭', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
