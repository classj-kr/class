// 국어 5-1 낱말 도식(첫째 묶음: 독서 단원 추천사·훑어 읽기·중심 문장·팔도, 1단원 생략·문맥·장단,
// 2단원 시간 표현·기행문·여정·견문·감상·해협·이듬해·그저께·모레·글피·사흘·나흘).
// 도구(tile·tag·row·base·move 따위)는 figures/6-1/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 움직임은 transform·opacity·stroke-dashoffset(과 색 바꾸기)만 쓴다. 아이패드 사파리는 CSS 로 x·y·width·height·r·d 를 바꾸지 못한다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게 실측: 한글 1em, 괄호 .36em, 쉼표·마침표·쌍점 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!\[\]]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
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
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  // 칸 n 에서 늘어나며 나타나기(scaleX·scaleY), origin 은 fill-box 기준
  const growCss = (id, sel, n, { axis = 'X', origin = 'left center', delay = 0, dur = 0.7 } = {}) => `
    .sc-${id} ${sel} { transform-box: fill-box; transform-origin: ${origin}; transform: scale${axis}(0); transition: transform ${dur}s ease-out ${delay}s; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;

  const K = '5-1/국어/';
  const TAN = '#fdf3d3', GRAY = '#b5c4be';
  const bar = (x, y, w, color = GRAY, h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${f(y - r - 14 * r / 18)}" r="${r}" fill="${color}"/><path d="M${f(x - r * 1.6)} ${f(y + r * 1.5)} Q${f(x - r * 1.6)} ${y} ${x} ${y} Q${f(x + r * 1.6)} ${y} ${f(x + r * 1.6)} ${f(y + r * 1.5)} Z" fill="${color}"/>`;
  const eye = (x, y, color = C.blue) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`;
  const ear = (x, y, color = C.orange) => `<path d="M${x + 12} ${y + 28} Q${x - 2} ${y + 34} ${x - 6} ${y + 18} Q${x - 20} ${y + 4} ${x - 20} ${y - 10} Q${x - 20} ${y - 34} ${x + 2} ${y - 34} Q${x + 24} ${y - 34} ${x + 24} ${y - 10} Q${x + 24} ${y + 4} ${x + 12} ${y + 12}" fill="${C.peach}" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<path d="M${x - 8} ${y - 8} Q${x - 6} ${y - 22} ${x + 4} ${y - 21} Q${x + 13} ${y - 19} ${x + 10} ${y - 6} Q${x + 6} ${y + 2} ${x} ${y + 2}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  // 하트: 가운데 (x, y), 배율 s(1 이면 폭 84, 높이 67)
  const heartD = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `M${P(0, 30)} C${P(-40, 2)} ${P(-42, -28)} ${P(-21, -37)} C${P(-9, -42)} ${P(0, -34)} ${P(0, -25)} C${P(0, -34)} ${P(9, -42)} ${P(21, -37)} C${P(42, -28)} ${P(40, 2)} ${P(0, 30)} Z`;
  };
  const sun = (x, y, r = 15, col = C.orange) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${C.yellow}" stroke="${col}" stroke-width="2.5"/>`
    + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(c * (r + 5))} ${f(s * (r + 5))} L${f(c * (r + 11))} ${f(s * (r + 11))}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`; }).join('') + '</g>';
  const cloud = (x, y, s = 1, fill = 'white', stroke = C.muted) => `<path d="M${f(x - 40 * s)} ${f(y + 14 * s)} Q${f(x - 52 * s)} ${f(y - 4 * s)} ${f(x - 30 * s)} ${f(y - 8 * s)} Q${f(x - 24 * s)} ${f(y - 30 * s)} ${f(x)} ${f(y - 24 * s)} Q${f(x + 18 * s)} ${f(y - 38 * s)} ${f(x + 32 * s)} ${f(y - 12 * s)} Q${f(x + 54 * s)} ${f(y - 8 * s)} ${f(x + 42 * s)} ${f(y + 14 * s)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  // 번호 동그라미
  const badge = (x, y, n, color = C.green) => `<circle cx="${x}" cy="${y}" r="15" fill="${color}" stroke="white" stroke-width="2.5"/>` + text(x, y + 7, n, { size: 19, color: 'white' });

  // ── 독서 단원: 추천사(『강아지와 행복한 하루』 — 띠지가 반짝, 뒤표지의 권하는 글, 친구에게 권함) ──────────────────────────────
  (function () {
    const id = 't51-k1-chucheon';
    let css = base(id);
    const dog = (x, y) => `<ellipse cx="${x - 24}" cy="${y - 4}" rx="10" ry="18" fill="${C.orange}"/><ellipse cx="${x + 24}" cy="${y - 4}" rx="10" ry="18" fill="${C.orange}"/>`
      + `<circle cx="${x}" cy="${y}" r="24" fill="white" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${x - 8}" cy="${y - 4}" r="3.2" fill="${C.ink}"/><circle cx="${x + 8}" cy="${y - 4}" r="3.2" fill="${C.ink}"/><ellipse cx="${x}" cy="${y + 8}" rx="5.5" ry="4" fill="${C.ink}"/>`;
    const cover = `<rect x="40" y="60" width="160" height="250" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    const front = cover + `<rect x="40" y="60" width="16" height="250" rx="6" fill="${C.blue}" opacity=".4"/>`
      + text(128, 112, '강아지와', { size: 20 }) + text(128, 140, '행복한 하루', { size: 20 }) + dog(128, 194)
      + `<rect x="41.5" y="246" width="157" height="44" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>` + text(128, 275, '추천하는 책', { size: 18, color: C.orange });
    const back = cover + bar(62, 92, 116, GRAY) + bar(62, 112, 92, GRAY)
      + `<rect x="54" y="140" width="132" height="152" rx="10" fill="white" stroke="${C.orange}" stroke-width="2.5"/>`
      + text(70, 178, '“', { size: 34, color: C.orange }) + text(170, 286, '”', { size: 34, color: C.orange })
      + [[182, 96], [204, 104], [226, 90], [248, 100]].map(([y, w]) => bar(72, y, w, GRAY, 9)).join('');
    let body = `<g class="b1"><g class="fr"><g class="pop pop1">${front}</g></g></g><g class="bk">${back}</g>`;
    css += `.sc-${id} .fr, .sc-${id} .bk { transform-box: fill-box; transform-origin: center; }
      .sc-${id} .fr { transition: transform .4s ease-in .3s; } .on2 .sc-${id} .fr { transform: scaleX(0); }
      .sc-${id} .bk { transform: scaleX(0); transition: transform .4s ease-out .7s; } .on2 .sc-${id} .bk { transform: none; }`;
    body += `<g class="h2">${glowRect(36, 242, 168, 52, 1, C.orange, 0.7, 6)}</g>`;
    // 칸 2: 뒤표지의 권하는 글 자리가 반짝
    body += glowRect(48, 134, 144, 164, 2, C.orange, 1.3, 14);
    body += at(2, 'pop', tag(120, 30, '뒤표지', ROLE.s, 18), 1.0);
    // 칸 3: 그 글 속을 크게 — 기억에 남는 장면·좋은 까닭·누구에게
    body += at(3, 'fin', dashed(186, 140, 250, 40, C.orange) + dashed(186, 292, 250, 250, C.orange)
      + `<rect x="250" y="40" width="370" height="210" rx="14" fill="white" stroke="${C.orange}" stroke-width="3"/>`);
    const rows = [['기억에 남는 장면', '용기를 얻는 장면', ROLE.s], ['좋은 까닭', '진심을 나누는 힘', ROLE.p], ['누구에게', '친구가 필요한 친구', ROLE.x]];
    rows.forEach(([l, v, r], i) => {
      const y = 82 + i * 63;
      body += at(3, 'slide', tag(342, y, l, r, 18), 0.4 + i * 0.35);
      body += at(3, 'pop', tile(522, y, v, { size: 18, h: 40, fill: r[0], stroke: r[1], sw: 2.5 }), 0.6 + i * 0.35);
    });
    // 칸 4: 친구에게 권한다
    body += drawArrow(420, 258, 520, 296, C.orange, 4, { width: 4, delay: 0.2 });
    body += at(4, 'pop', person(556, 314, C.purple, 16), 0.6);
    body += at(4, 'pop', `<g class="ht"><path d="${heartD(596, 282, 0.36)}" fill="${C.peach}" stroke="${C.red}" stroke-width="2.5"/></g>`, 1.1);
    css += pulseCss(id, '.ht', 4, 1.6);
    body += glowRect(246, 36, 378, 218, 4, C.orange, 0.2, 16) + at(4, 'pop', tag(352, 320, '추천사', ROLE.y, 24), 0.9);
    put(K + 'reading/추천사', svg(id, body, css));
  })();

  // ── 독서 단원: 훑어 읽기(눈길이 제목 → 사진 → 큰 글씨 → 작가의 말만 짚고 지나감) ──────────────────────────────
  (function () {
    const id = 't51-k1-hulteo';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="26" y="20" width="290" height="302" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/><rect x="324" y="20" width="290" height="302" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    // 왼쪽 쪽: 제목·사진·작은 글줄
    body += at(1, 'fin', text(160, 72, '기다리는 매미', { size: 26, weight: 800 }), 0.2);
    const pic = `<rect x="56" y="98" width="200" height="104" rx="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/><path d="M57.5 182 H254.5 V200.5 H57.5 Z" fill="${C.mint}"/>`
      + `<rect x="140" y="136" width="16" height="50" rx="4" fill="${C.muted}"/><circle cx="148" cy="134" r="26" fill="${C.green}" opacity=".75"/>`
      + `<ellipse cx="160" cy="168" rx="6" ry="10" fill="${C.ink}"/><path d="M154 162 L142 172 M166 162 L178 172" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>` + sun(224, 128, 11);
    body += at(1, 'fin', pic, 0.3);
    const L = [[56, 224, 220], [56, 244, 200], [56, 264, 214], [56, 284, 190], [56, 304, 120], [354, 104, 176], [354, 126, 166], [354, 148, 176], [354, 170, 150], [354, 192, 120]];
    body += `<g class="dim dim3">` + L.map(([x, y, w], i) => at(1, 'fin', bar(x, y, w, GRAY, 9), 0.3 + i * 0.04)).join('') + '</g>';
    // 오른쪽 쪽: 큰 글씨·작가의 말
    body += at(1, 'fin', text(442, 72, '땅속에서 5년', { size: 24, weight: 800 }), 0.4);
    body += at(1, 'fin', `<rect x="352" y="212" width="182" height="98" rx="10" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>` + text(443, 240, '작가의 말', { size: 18, color: C.purple })
      + bar(370, 264, 146, GRAY, 8) + bar(370, 282, 136, GRAY, 8) + bar(370, 300, 90, GRAY, 8), 0.5);
    // 눈이 멈추는 자리(각 덩이의 오른쪽 옆)
    const S = [[290, 66], [290, 150], [568, 66], [568, 260]];
    const glows = [[64, 42, 192, 44], [50, 92, 212, 116], [352, 42, 180, 44], [346, 206, 194, 110]];
    body += glowRect(...glows[0], 2, C.orange, 0.2, 10) + glowRect(...glows[1], 2, C.orange, 1.2, 10);
    body += glowRect(...glows[2], 3, C.orange, 0.7, 10) + glowRect(...glows[3], 3, C.orange, 1.6, 10);
    // 눈길이 지나간 자국(점이 차례로 찍힌다)
    const dots = (pts, n, d0, step) => pts.map(([x, y], i) => at(n, 'fin', `<circle cx="${f(x)}" cy="${f(y)}" r="3.5" fill="${C.orange}"/>`, f(d0 + i * step))).join('');
    const lin = (a, b, k) => Array.from({ length: k }, (_, i) => { const t = (i + 1) / (k + 1); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; });
    const quad = (a, c, b, k) => Array.from({ length: k }, (_, i) => { const t = (i + 1) / (k + 1), u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; });
    body += dots(lin([S[0][0], S[0][1] + 16], [S[1][0], S[1][1] - 16], 4), 2, 0.6, 0.12);
    body += dots(quad([S[1][0] + 18, S[1][1] - 12], [440, -64], [S[2][0] - 8, S[2][1] - 18], 11), 3, 0.15, 0.05);
    body += dots(lin([S[2][0], S[2][1] + 16], [S[3][0], S[3][1] - 16], 7), 3, 1.0, 0.08);
    const d = S.map(([x, y]) => [x - S[0][0], y - S[0][1]]);
    body += `<g class="b2"><g class="ey">${eye(S[0][0], S[0][1], C.orange)}</g></g>`;
    css += `@keyframes ${id}-hopA { 0%, 30% { transform: translate(0px, 0px); } 70%, 100% { transform: translate(${d[1][0]}px, ${d[1][1]}px); } }
      @keyframes ${id}-hopB { 0%, 10% { transform: translate(${d[1][0]}px, ${d[1][1]}px); } 40%, 55% { transform: translate(${d[2][0]}px, ${d[2][1]}px); } 85%, 100% { transform: translate(${d[3][0]}px, ${d[3][1]}px); } }
      .on2 .sc-${id} .ey { animation: ${id}-hopA 1.6s ease-in-out both; }
      .on3 .sc-${id} .ey { animation: ${id}-hopB 1.9s ease-in-out both; }`;
    // 칸 4
    body += glows.map((r, i) => glowRect(...r, 4, C.orange, 0.1 + i * 0.2, 10)).join('');
    body += at(4, 'pop', tag(320, 341, '훑어 읽기', ROLE.y, 22), 0.9);
    put(K + 'reading/훑어 읽기', svg(id, body, css));
  })();

  // ── 독서 단원: 중심 문장(층간 소음 글 문단 셋 — 첫 문장에 밑줄, 그 문장들이 떠오른다) ──────────────────────────────
  (function () {
    const id = 't51-k1-jungsim';
    let css = base(id);
    let body = '';
    const Y0 = [22, 130, 238], ws = [196, 206, 184, 140];
    const labels = ['규칙을 만들기', '도움 되는 물건 쓰기', '이해하고 배려하기'];
    Y0.forEach((y0, k) => {
      body += at(1, 'rise', `<rect x="30" y="${y0}" width="276" height="100" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + `<circle cx="52" cy="${y0 + 22}" r="14" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + text(52, y0 + 29, k + 1, { size: 18, color: C.muted }), k * 0.2);
      ws.forEach((w, j) => {
        const y = y0 + (j ? 28 + j * 20 : 22);
        if (j === 0) body += at(1, 'fin', `<rect class="sb" x="76" y="${y - 5}" width="${w}" height="10" rx="5" fill="${GRAY}"/>`, 0.3 + k * 0.2);
        else body += `<g class="dim dim3">${at(1, 'fin', bar(76, y, w, GRAY, 10), 0.3 + k * 0.2)}</g>`;
      });
      // 칸 2: 밑줄
      body += drawLine(`M76 ${y0 + 33} H${76 + ws[0]}`, C.orange, 2, { width: 4, delay: 0.3 + k * 0.35 });
    });
    css += `.sc-${id} .sb { transition: fill .5s ease .2s; } .on2 .sc-${id} .sb { fill: ${C.orange}; }`;
    // 칸 3: 밑줄 친 문장이 오른쪽으로 떠올라 조각이 된다
    Y0.forEach((y0, k) => {
      const y = y0 + 22, ty = y0 + 50, tx = 470;
      body += `<g class="b3"><g class="fl fl${k}"><rect x="76" y="${y - 5}" width="${ws[0]}" height="10" rx="5" fill="${C.orange}"/></g></g>`;
      css += `.sc-${id} .fl${k} { transition: transform .9s ease-in-out ${f(0.2 + k * 0.3)}s, opacity .3s ease ${f(0.95 + k * 0.3)}s; } .on3 .sc-${id} .fl${k} { transform: translate(${f(tx - 76 - ws[0] / 2)}px, ${f(ty - y)}px); opacity: 0; }`;
      body += at(3, 'pop', `<g class="tp tp${k}">${tile(tx, ty, labels[k], { size: 20, h: 50, fill: TAN, stroke: C.orange, sw: 3 })}</g>`, 1.0 + k * 0.3);
      body += at(3, 'fin', dashed(310, y0 + 50, tx - wOf(labels[k], 20) / 2 - 6, ty, C.orange), 1.2 + k * 0.3);
    });
    // 칸 4
    css += [0, 1, 2].map((k) => pulseCss(id, `.tp${k}`, 4, 0.2 + k * 0.25)).join('');
    body += at(4, 'pop', tag(470, 20, '중심 문장', ROLE.y, 22), 0.9);
    put(K + 'reading/중심 문장', svg(id, body, css));
  })();

  // ── 독서 단원: 팔도(여덟 도 이름 조각이 둥글게 모여 '팔도') ──────────────────────────────
  (function () {
    const id = 't51-k1-paldo';
    let css = base(id);
    const names = ['경기도', '충청도', '경상도', '전라도', '강원도', '황해도', '평안도', '함경도'];
    const grid = (i) => [95 + (i % 4) * 150, i < 4 ? 70 : 150];
    const ringAt = (i) => { const a = (-90 + 45 * i) * Math.PI / 180; return [f(320 + 228 * Math.cos(a)), f(185 + 128 * Math.sin(a))]; };
    let body = drawLine('M92 185 A228 128 0 1 1 548 185 A228 128 0 1 1 92 185', C.green, 4, { width: 4, delay: 0.1, cls: 'rg' });
    names.forEach((nm, i) => {
      const [gx, gy] = grid(i), [rx, ry] = ringAt(i);
      body += `<g class="b1"><g class="mv mv${i}">${g('pop pop1', tile(rx, ry, nm, { size: 24, h: 50, w: 106, fill: 'white', stroke: C.green, cls: `nm nm${i}` }), 0.1 + i * 0.12)}`
        + `<g class="b2">${g('pop pop2', badge(rx - 58, ry - 25, i + 1), 0.2 + i * 0.18)}</g></g></g>`;
      css += move(id, `mv${i}`, `translate(${f(gx - rx)}px, ${f(gy - ry)}px)`, 3, { dur: 1, delay: 0.1 + i * 0.06 });
      css += paint(id, `.nm${i}`, ROLE.p, 2, 0.2 + i * 0.18);
    });
    // 칸 2: 여덟 = 팔
    body += `<g class="h3">` + at(2, 'pop', tile(320, 262, '여덟 = 팔(八)', { size: 28, h: 60, fill: TAN, stroke: C.orange, sw: 3 }), 1.8) + '</g>';
    // 칸 3: 가운데에 '팔도'
    body += at(3, 'pop', `<g class="ct">${tile(320, 175, '팔도', { size: 40, h: 74, w: 150, fill: C.mint, stroke: C.green, sw: 4 })}</g>`, 1.4);
    // 칸 4
    css += pulseCss(id, '.ct', 4, 0.3) + `.on4 .sc-${id} .rg { transition-duration: 1.6s; }`;
    body += at(4, 'pop', tag(320, 238, '온 나라', ROLE.y, 22), 1.2);
    put(K + 'reading/팔도', svg(id, body, css));
  })();

  // ── 1단원: 생략(규진 '우민이 있어?' — '선생님이 오래'가 빠지고, 친구는 짐작한다) ──────────────────────────────
  (function () {
    const id = 't51-k1-saengryak';
    let css = base(id);
    let body = at(1, 'pop', person(70, 266, C.blue, 18) + tag(70, 322, '규진', ROLE.s, 18));
    body += at(1, 'fin', `<path d="M168 136 L94 208 L206 136 Z" fill="white" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/><rect x="130" y="36" width="484" height="104" rx="24" fill="white" stroke="${C.line}" stroke-width="3"/><path d="M170 133 L204 133 L190 150 Z" fill="white"/>`, 0.2);
    const r = row(['우민이', '있어?', '선생님이 오래'], { y: 88, cx: 372, size: 26, gap: 14 });
    body += at(1, 'pop', T(r[0], { fill: C.sky, stroke: C.blue }), 0.5) + at(1, 'pop', T(r[1], { fill: C.sky, stroke: C.blue }), 0.7);
    // 빠질 말: 칸 2 에 점선 자리만 남기고 위로 날아간다
    body += at(2, 'fin', `<rect x="${f(r[2].l)}" y="60" width="${r[2].w}" height="56" rx="12" fill="none" stroke="${C.purple}" stroke-width="3" stroke-dasharray="9 7"/>`, 0.2);
    body += `<g class="b1"><g class="om">${g('pop pop1', T(r[2], { fill: C.sky, stroke: C.blue, cls: 'omt' }), 0.9)}</g></g>`;
    css += paint(id, '.omt', ROLE.x, 2, 0.1) + `.sc-${id} .om { transition: transform .9s ease-in .6s, opacity .7s ease .8s; } .on2 .sc-${id} .om { transform: translateY(-46px); opacity: 0; }`;
    // 칸 3: 땀 흘리며 다급한 모습 → 친구가 짐작
    const drop = (x, y) => `<path d="M${x} ${y - 9} Q${x + 7} ${y + 1} ${x} ${y + 6} Q${x - 7} ${y + 1} ${x} ${y - 9} Z" fill="${C.blue}" stroke="white" stroke-width="1.5"/>`;
    body += at(3, 'drop', drop(100, 222) + drop(108, 244), 0.2);
    body += at(3, 'pop', person(572, 266, C.purple, 18) + tag(572, 322, '친구', ROLE.x, 18), 0.4);
    body += at(3, 'pop', `<circle cx="542" cy="236" r="6" fill="white" stroke="${C.purple}" stroke-width="2.5"/><circle cx="524" cy="226" r="9" fill="white" stroke="${C.purple}" stroke-width="2.5"/>`, 0.8);
    body += at(3, 'pop', `<ellipse cx="366" cy="226" rx="140" ry="38" fill="white" stroke="${C.purple}" stroke-width="3"/>` + text(366, 233, '급한 일이 있나 봐', { size: 20, color: C.purple }), 1.1);
    // 칸 4
    body += glowRect(r[2].l - 6, 54, r[2].w + 12, 68, 4, C.purple, 0.2, 16);
    body += at(4, 'pop', tag(r[2].cx, 160, '생략', ROLE.x, 22), 0.8);
    put(K + '1/생략', svg(id, body, css));
  })();

  // ── 1단원: 문맥('꿉꿉한'의 뜻을 앞뒤 조각이 정해 준다) ──────────────────────────────
  (function () {
    const id = 't51-k1-munmaek';
    let css = base(id);
    const CY = 160;
    let body = at(1, 'pop', `<g class="kw">${tile(320, CY, '꿉꿉한', { size: 30, h: 64, w: 128, fill: TAN, stroke: C.orange, sw: 3.5, cls: 'kwt' })}</g>`);
    body += `<g class="h3">${at(1, 'pop', `<circle cx="378" cy="${CY - 34}" r="17" fill="white" stroke="${C.red}" stroke-width="3"/>` + text(378, CY - 26, '?', { size: 24, color: C.red, weight: 800 }), 0.5)}</g>`;
    // 칸 2: 바로 앞뒤 조각
    body += at(2, 'slide', tile(152, CY, '나무문을 열자', { size: 22, h: 50, fill: C.sky, stroke: C.blue }), 0.2);
    body += at(2, 'slideL', tile(474, CY, '책 냄새', { size: 22, h: 50, fill: C.sky, stroke: C.blue }), 0.4);
    body += drawArrow(238, CY, 252, CY, C.blue, 2, { width: 4, delay: 0.8 }) + drawArrow(422, CY, 388, CY, C.blue, 2, { width: 4, delay: 0.8 });
    // 칸 3: 더 앞뒤 조각 — 비 와서 접은 우산, 오래된 책방
    body += at(3, 'drop', tile(150, 58, '우산을 접고', { size: 22, h: 50, fill: C.sky, stroke: C.blue }), 0.2);
    body += at(3, 'drop', tile(490, 58, '오래된 책들', { size: 22, h: 50, fill: C.sky, stroke: C.blue }), 0.4);
    body += curve(212, 84, 278, 124, 90, C.blue, 3, { width: 4, delay: 0.6 }) + curve(428, 84, 362, 124, 90, C.blue, 3, { width: 4, delay: 0.6 });
    body += drawArrow(320, 202, 320, 232, C.green, 3, { width: 4, delay: 1.0 });
    body += at(3, 'pop', `<g class="mn">${tile(320, 262, '조금 축축한', { size: 24, h: 54, fill: C.mint, stroke: C.green, sw: 3 })}</g>`, 1.9);
    css += paint(id, '.kwt', ROLE.p, 3, 1.8);
    // 칸 4: 앞뒤 조각이 함께 반짝
    body += glowRect(40, 20, 560, 180, 4, C.blue, 0.1, 18);
    css += pulseCss(id, '.mn', 4, 0.5);
    body += at(4, 'pop', tag(320, 322, '문맥', ROLE.s, 24), 0.9);
    put(K + '1/문맥', svg(id, body, css));
  })();

  // ── 1단원: 장단(밤[밤]은 짧게, 밤[밤ː]은 길게 — 소리 막대) ──────────────────────────────
  (function () {
    const id = 't51-k1-jangdan';
    let css = base(id);
    const Y = [118, 250];
    const moon = (x, y) => `<path d="M${x + 6} ${y - 24} A24 24 0 0 0 ${x + 6} ${y + 24} A30 30 0 0 1 ${x + 6} ${y - 24} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M${x + 22} ${y - 18} l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill="${C.yellow}"/>`;
    const chestnut = (x, y) => `<path d="M${x} ${y - 26} Q${x + 24} ${y - 6} ${x + 22} ${y + 10} Q${x} ${y + 28} ${x - 22} ${y + 10} Q${x - 24} ${y - 6} ${x} ${y - 26} Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2"/>`
      + `<path d="M${x - 21} ${y + 6} Q${x} ${y + 14} ${x + 21} ${y + 6} Q${x + 18} ${y + 20} ${x} ${y + 24} Q${x - 18} ${y + 20} ${x - 21} ${y + 6} Z" fill="${C.peach}"/>`;
    let body = '';
    Y.forEach((y, i) => { body += at(1, 'pop', tile(76, y, '밤', { size: 36, h: 70, w: 86, fill: 'white', stroke: C.ink, sw: 3 }), i * 0.3); });
    body += at(1, 'pop', text(76, 194, '=', { size: 30, color: C.muted }), 0.7);
    // 칸 2: 해가 진 밤 — 짧게
    body += at(2, 'pop', moon(172, Y[0]), 0.1) + at(2, 'fin', text(262, Y[0] + 10, '[밤]', { size: 28 }), 0.4);
    body += `<g class="b2"><g class="sb">${bar(318, Y[0], 92, C.blue, 34)}</g></g>` + at(2, 'fin', text(364, Y[0] + 7, '짧게', { size: 20, color: 'white' }), 1.2);
    css += growCss(id, '.sb', 2, { delay: 0.7, dur: 0.4 });
    // 칸 3: 밤나무 열매 — 길게
    body += at(3, 'pop', chestnut(172, Y[1]), 0.1) + at(3, 'fin', text(270, Y[1] + 10, '[밤', { size: 28, anchor: 'end' }) + text(288, Y[1] + 10, ']', { size: 28, anchor: 'start' }), 0.4);
    body += `<g class="b3"><g class="lb">${bar(318, Y[1], 282, C.orange, 34)}</g></g>` + at(3, 'fin', text(459, Y[1] + 7, '길게', { size: 20, color: 'white' }), 2.0);
    css += growCss(id, '.lb', 3, { delay: 0.7, dur: 1.3 });
    body += `<g class="b3"><g class="lm">${text(279, Y[1] + 10, 'ː', { size: 30, color: C.red, weight: 800 })}</g></g>`;
    css += `.on3 .sc-${id} .lm { animation: ${id}-flash 1.4s ease-in-out .3s both; }`;
    // 칸 4: 두 막대 길이를 견준다
    body += at(4, 'fin', dashed(410, Y[0] + 24, 410, Y[1] - 24, C.muted) + dashed(600, Y[0] + 24, 600, Y[1] - 24, C.muted), 0.2);
    body += glowRect(312, Y[0] - 24, 104, 48, 4, C.blue, 0.4, 20) + glowRect(312, Y[1] - 24, 294, 48, 4, C.orange, 0.7, 20);
    body += at(4, 'pop', tag(505, Y[0], '장단', ROLE.y, 24), 1.1);
    put(K + '1/장단', svg(id, body, css));
  })();

  // ── 2단원: 시간 표현(시간 줄 위 과거·현재·미래 — -었-·-는-·-겠-, 어제·아까·지금·내일·이따) ──────────────────────────────
  (function () {
    const id = 't51-k1-sigan';
    let css = base(id);
    const LY = 196, X = [120, 320, 520];
    let body = `<g class="b1"><path class="draw draw1" pathLength="1" d="M30 ${LY} H606" stroke="${C.ink}" stroke-width="4" fill="none"/>${g('fin fin1', head(618, LY, 0, C.ink, 4), 0.9)}</g>`;
    [['과거', ROLE.s], ['현재', ROLE.p], ['미래', ROLE.o]].forEach(([l, r], i) => { body += at(1, 'pop', tag(X[i], LY, l, r, 20), 0.6 + i * 0.25); });
    // 끝이 바뀌는 낱말: 바뀐 부분 뒤에 옅은 색 띠
    const word = (cx, cy, parts, [fill, stroke], cls) => {
      const label = parts.map((p) => p[0]).join(''), size = 26, w = wOf(label, size);
      let x = cx - tw(label, size) / 2, hl = '';
      parts.forEach(([s, h]) => { const pw = tw(s, size); if (h) hl += `<g class="hl ${cls}"><rect x="${f(x - 2)}" y="${cy - 19}" width="${f(pw + 4)}" height="38" rx="6" fill="${C.yellow}" opacity=".85"/></g>`; x += pw; });
      return `<rect x="${f(cx - w / 2)}" y="${cy - 28}" width="${w}" height="56" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + hl + text(cx, f(cy + size * 0.36), label, { size });
    };
    css += `.sc-${id} .hl { transform-box: fill-box; transform-origin: center; }`;
    // 칸 2: 과거
    body += at(2, 'drop', tag(X[0] - 48, 74, '어제', ROLE.s, 20), 0.1) + at(2, 'drop', tag(X[0] + 48, 74, '아까', ROLE.s, 20), 0.3);
    body += drawLine(`M${X[0]} 98 V176`, C.blue, 2, { width: 3, delay: 0.5 });
    body += at(2, 'rise', word(X[0], 276, [['먹', 0], ['었', 1], ['다', 0]], ROLE.s, 'q0'), 0.9);
    body += drawLine(`M${X[0]} 214 V246`, C.blue, 2, { width: 3, delay: 0.7 });
    css += `.on2 .sc-${id} .q0 { animation: ${id}-pulse .6s ease-in-out 1.5s 2; }`;
    // 칸 3: 현재와 미래
    body += at(3, 'drop', tag(X[1], 74, '지금', ROLE.p, 20), 0.1) + drawLine(`M${X[1]} 98 V176`, C.green, 3, { width: 3, delay: 0.3 });
    body += at(3, 'rise', word(X[1], 276, [['읽', 0], ['는', 1], ['다', 0]], ROLE.p, 'q1'), 0.5) + drawLine(`M${X[1]} 214 V246`, C.green, 3, { width: 3, delay: 0.3 });
    body += at(3, 'drop', tag(X[2] - 48, 74, '내일', ROLE.o, 20), 1.0) + at(3, 'drop', tag(X[2] + 48, 74, '이따', ROLE.o, 20), 1.2) + drawLine(`M${X[2]} 98 V176`, C.orange, 3, { width: 3, delay: 1.3 });
    body += at(3, 'rise', word(X[2], 276, [['가', 0], ['겠', 1], ['다', 0]], ROLE.o, 'q2'), 1.5) + drawLine(`M${X[2]} 214 V246`, C.orange, 3, { width: 3, delay: 1.3 });
    css += `.on3 .sc-${id} .q1 { animation: ${id}-pulse .6s ease-in-out 1s 2; } .on3 .sc-${id} .q2 { animation: ${id}-pulse .6s ease-in-out 2s 2; }`;
    // 칸 4: 시간을 알려 주는 조각이 함께 반짝
    css += `.on4 .sc-${id} .hl { animation: ${id}-flash 1.4s ease-in-out .3s both; }`;
    body += [0, 1, 2].map((i) => glowRect(X[i] - (i === 1 ? 44 : 92), 52, i === 1 ? 88 : 184, 44, 4, [C.blue, C.green, C.orange][i], 0.2 + i * 0.2, 20)).join('');
    body += at(4, 'pop', tag(320, 340, '시간 표현', ROLE.y, 22), 1.0);
    put(K + '2/시간 표현', svg(id, body, css));
  })();

  // ── 2단원: 기행문(「다채로운 모습의 설악산」 — 여정·견문·감상 세 줄) ──────────────────────────────
  (function () {
    const id = 't51-k1-gihaeng';
    let css = base(id);
    const X = [205, 365, 525], Y = [80, 168, 256];
    const RW = [['여정', ROLE.s], ['견문', ROLE.p], ['감상', ROLE.o]];
    let body = '';
    RW.forEach(([l, r], i) => {
      body += at(i + 1, 'fin', `<rect x="22" y="${Y[i] - 38}" width="596" height="76" rx="14" fill="${r[0]}" opacity=".45"/>`);
      body += at(i + 1, 'slide', `<g class="rt rt${i}">${tag(64, Y[i], l, r, 20)}</g>`, 0.1);
    });
    const cells = [['신흥사', '흔들바위', '울산 바위'], ['신라 때 세운 절', '흔들리는 바위', '꼭대기는 평평'], ['배우는 마음', '놀라운 세상', '마음의 키']];
    cells.forEach((cs, i) => cs.forEach((c, j) => {
      const r = RW[i][1];
      body += at(i + 1, 'pop', tile(X[j], Y[i], c, { size: i ? 18 : 20, h: i ? 42 : 46, fill: 'white', stroke: r[1], sw: 2.5 }), 0.4 + j * 0.4);
    }));
    // 칸 1: 다닌 곳 사이 화살표
    body += drawArrow(252, Y[0], 306, Y[0], C.blue, 1, { width: 4, delay: 0.7 }) + drawArrow(422, Y[0], 464, Y[0], C.blue, 1, { width: 4, delay: 1.1 });
    // 칸 3: 감상 조각 옆 작은 하트
    body += X.map((x, j) => at(3, 'pop', `<path d="${heartD(x + (j === 2 ? 58 : 66), Y[2] - 18, 0.2)}" fill="${C.red}"/>`, 0.8 + j * 0.4)).join('');
    // 칸 4: 세 줄이 한 편의 글로 묶인다
    body += `<g class="b4"><path class="draw draw4" pathLength="1" d="M34 30 H606 Q618 30 618 42 V292 Q618 304 606 304 H34 Q22 304 22 292 V42 Q22 30 34 30 Z" stroke="${C.green}" stroke-width="4" fill="none" style="transition-duration:1.4s"/></g>`;
    css += [0, 1, 2].map((i) => pulseCss(id, `.rt${i}`, 4, 0.4 + i * 0.25)).join('');
    body += at(4, 'pop', tag(320, 334, '기행문', ROLE.p, 24), 1.2);
    put(K + '2/기행문', svg(id, body, css));
  })();

  // ── 2단원: 여정(설악산 — 신흥사 → 흔들바위 → 울산 바위, 오르는 길이 한 도막씩 그어진다) ──────────────────────────────
  (function () {
    const id = 't51-k1-yeojeong';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M0 352 L110 300 L220 248 L300 204 L370 166 L440 116 L478 82 Q500 66 524 80 L570 116 L640 196 V360 H0 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M470 86 Q482 60 500 60 Q522 58 532 84 Z" fill="#d6dfdb" stroke="${C.muted}" stroke-width="2.5"/>` + sun(80, 70, 16));
    const P = [[30, 344], [150, 300], [330, 206], [500, 92]];
    body += drawLine(`M${P[0][0]} ${P[0][1]} L${P[1][0]} ${P[1][1]}`, C.orange, 1, { width: 5, delay: 0.5, cls: 'rd' });
    body += drawLine(`M${P[1][0]} ${P[1][1]} L240 268 L${P[2][0]} ${P[2][1]}`, C.orange, 2, { width: 5, delay: 0.1, cls: 'rd' });
    body += drawLine(`M${P[2][0]} ${P[2][1]} L400 168 L440 140 L${P[3][0]} ${P[3][1]}`, C.orange, 3, { width: 5, delay: 0.1, cls: 'rd' });
    const stops = [['신흥사', 120, 248], ['흔들바위', 270, 156], ['울산 바위', 404, 42]];
    stops.forEach(([l, lx, ly], k) => {
      const [x, y] = P[k + 1], n = k + 1;
      body += `<g class="dt dt${k}">` + at(n, 'pop', badge(x, y, n), 1.3) + '</g>';
      body += at(n, 'pop', tag(lx, ly, l, ROLE.p, 20), 1.5);
    });
    // 걷는 사람(점)
    body += at(1, 'fin', `<g class="wk"><circle cx="${P[0][0]}" cy="${P[0][1] - 4}" r="11" fill="${C.orange}" stroke="white" stroke-width="3"/></g>`);
    const tr = P.map(([x, y]) => `translate(${x - P[0][0]}px, ${y - P[0][1] - 22}px)`);
    css += `.sc-${id} .wk { transition: transform 1s ease-in-out .5s; }
      .on1 .sc-${id} .wk { transform: ${tr[1]}; }
      .on2 .sc-${id} .wk { transform: ${tr[2]}; transition-delay: .1s; }
      .on3 .sc-${id} .wk { transform: ${tr[3]}; transition-delay: .1s; }`;
    // 칸 4
    css += [0, 1, 2].map((k) => pulseCss(id, `.dt${k}`, 4, 0.2 + k * 0.4)).join('');
    css += `.on4 .sc-${id} .rd { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    body += at(4, 'pop', tag(560, 300, '여정', ROLE.y, 26), 1.4);
    put(K + '2/여정', svg(id, body, css));
  })();

  // ── 2단원: 견문(눈으로 본 흔들바위, 귀로 들은 신흥사 이야기 — 見 볼 견, 聞 들을 문) ──────────────────────────────
  (function () {
    const id = 't51-k1-gyeonmun';
    let css = base(id);
    // 칸 3 공책(조각보다 먼저 깔아 조각이 위에 놓이게)
    let body = at(3, 'fin', `<rect x="164" y="290" width="312" height="62" rx="10" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>`);
    // 칸 1: 흔들바위가 흔들린다
    body += at(1, 'fin', `<path d="M40 222 H300" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>`);
    body += `<g class="b1"><g class="rk"><path d="M150 222 Q112 220 114 178 Q118 126 176 120 Q238 118 242 172 Q244 220 196 222 Z" fill="#d6dfdb" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></g></g>`;
    css += `.sc-${id} .rk { transform-box: fill-box; transform-origin: 50% 100%; }
      @keyframes ${id}-rock { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
      .on1 .sc-${id} .rk { animation: ${id}-rock 1.1s ease-in-out .6s infinite; }`;
    body += at(1, 'pop', person(76, 196, C.blue, 14) + `<path d="M96 192 L112 182" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/>`, 0.3);
    body += at(1, 'pop', eye(270, 64, C.blue), 0.6) + drawLine('M252 78 L222 112', C.blue, 1, { width: 3, delay: 0.9 });
    body += `<g class="c1">` + at(1, 'pop', tile(170, 256, '흔들리는 바위', { size: 18, h: 40, fill: C.sky, stroke: C.blue }), 1.4) + '</g>';
    // 칸 2: 귀로 듣는다
    body += at(2, 'pop', person(566, 150, C.purple, 18), 0.1);
    body += `<g class="b2"><g class="wv">` + [10, 18, 26].map((r) => `<path d="M${f(518 - r * 0.4)} ${126 - r} Q${f(518 - r * 1.2)} 126 ${f(518 - r * 0.4)} ${126 + r}" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') + '</g></g>';
    css += `.on2 .sc-${id} .wv { animation: ${id}-flash 1.4s ease-in-out .4s both; }`;
    body += at(2, 'pop', ear(420, 128), 0.6);
    body += `<g class="c2">` + at(2, 'pop', tile(470, 256, '신라 때 세운 절', { size: 18, h: 40, fill: C.mint, stroke: C.green }), 1.3) + '</g>';
    // 칸 3: 모아 적는다
    css += move(id, 'c1', 'none', 3, { to: 'translate(68px, 65px)', delay: 0.4 }) + move(id, 'c2', 'none', 3, { to: 'translate(-71px, 65px)', delay: 0.7 });
    // 칸 4: 볼 견 + 들을 문
    body += at(4, 'pop', tag(270, 24, '見 볼 견', ROLE.s, 18), 0.3) + at(4, 'pop', tag(420, 54, '聞 들을 문', ROLE.p, 18), 0.6);
    body += glowRect(158, 284, 324, 74, 4, C.orange, 0.2) + at(4, 'pop', tag(560, 321, '견문', ROLE.y, 24), 0.9);
    put(K + '2/견문', svg(id, body, css));
  })();

  // ── 2단원: 감상(울산 바위 꼭대기 — 뭉클한 마음, 마음의 키가 한 뼘 자람) ──────────────────────────────
  (function () {
    const id = 't51-k1-gamsang';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="20" y="28" width="292" height="304" rx="14" fill="${C.sky}"/>`
      + `<path d="M222 252 q12 -7 24 0 t24 0 t24 0 V330 H222 Z" fill="${C.blue}" opacity=".35"/>`
      + `<path d="M22 330 L108 170 L150 150 L190 168 L262 330 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`);
    body += `<g class="b1"><g class="cl">${cloud(232, 76, 0.8)}</g></g>`;
    css += `@keyframes ${id}-drift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-26px); } } .on1 .sc-${id} .cl { animation: ${id}-drift 4s ease-in-out infinite; }`;
    body += at(1, 'pop', person(150, 136, C.purple, 15), 0.5);
    body += at(1, 'pop', tag(262, 300, '동해', ROLE.s, 18), 0.9);
    // 오래된 굽은 나무
    body += `<g class="tr">` + at(1, 'fin', `<path d="M72 300 Q66 270 82 252 Q96 236 88 214" stroke="${C.muted}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="86" cy="206" r="22" fill="${C.green}" opacity=".8"/><circle cx="104" cy="222" r="15" fill="${C.green}" opacity=".8"/>`, 0.4) + '</g>';
    css += pulseCss(id, '.tr', 2, 0.2);
    // 칸 2: 하트가 차오른다
    const HX = 438, HY = 252, HS = 1.5;
    body += at(2, 'fin', `<defs><clipPath id="${id}-hc"><path d="${heartD(HX, HY, HS)}"/></clipPath></defs>`);
    body += `<g class="hg">` + at(2, 'fin', `<g clip-path="url(#${id}-hc)"><g class="hf"><rect x="370" y="190" width="140" height="110" fill="${C.red}" opacity=".7"/></g></g>`
      + `<path d="${heartD(HX, HY, HS)}" fill="none" stroke="${C.red}" stroke-width="3.5" stroke-linejoin="round"/>`, 0.3) + '</g>';
    css += growCss(id, '.hf', 2, { axis: 'Y', origin: 'center bottom', delay: 0.6, dur: 1.2 });
    body += `<g class="h3">` + at(2, 'pop', tag(352, 160, '뭉클', ROLE.r, 20), 1.5) + '</g>';
    // 칸 3: 마음의 키가 한 뼘 자란다
    css += `.sc-${id} .hg { transform-box: view-box; transform-origin: ${HX}px 297px; transition: transform 1.2s ease-in-out .5s; } .on3 .sc-${id} .hg { transform: scaleY(1.42); }`;
    body += at(3, 'fin', `<path d="M534 297 V100" stroke="${C.ink}" stroke-width="3"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<path d="M534 ${297 - k * 20} H${k % 5 ? 544 : 552}" stroke="${C.ink}" stroke-width="2.5"/>`).join(''), 0.1);
    body += at(3, 'fin', dashed(374, 197, 544, 197, C.muted, 2.5), 0.3);
    body += at(3, 'fin', `<path d="M374 155 H544" stroke="${C.red}" stroke-width="3" stroke-dasharray="7 6"/>`, 1.6);
    body += at(3, 'pop', `<path d="M560 197 Q570 197 570 187 V184 Q570 176 578 176 Q570 176 570 168 V165 Q570 155 560 155" stroke="${C.red}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` + text(604, 184, '한 뼘', { size: 20, color: C.red }), 1.8);
    body += at(3, 'pop', tag(HX, 330, '마음의 키', ROLE.x, 20), 2.0);
    // 칸 4
    body += glowRect(342, 112, 288, 238, 4, C.red, 0.2, 18) + at(4, 'pop', tag(HX, 40, '감상', ROLE.r, 24), 0.7);
    put(K + '2/감상', svg(id, body, css));
  })();

  // ── 2단원: 해협(위아래 두 땅 사이에 낀 좁고 긴 바다 — 양쪽이 넓은 바다로 통한다) ──────────────────────────────
  (function () {
    const id = 't51-k1-haehyeop';
    let css = base(id);
    let body = at(1, 'fin', `<rect width="640" height="360" fill="${C.sky}"/>`);
    // 바닷물 무늬(칸 3 에 흐른다)
    const wave = (y, x0, x1) => { let d = `M${x0} ${y}`; for (let x = x0; x < x1; x += 32) d += ` q8 -6 16 0 t16 0`; return d; };
    body += `<g class="b2">` + [[150, 0, 640], [180, 0, 640], [210, 0, 640], [60, 0, 160], [100, 0, 140], [270, 0, 140], [310, 0, 160], [60, 480, 640], [100, 500, 640], [270, 500, 640], [310, 480, 640]]
      .map(([y, a, b]) => `<path class="wv" d="${wave(y, a, b)}" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>`).join('') + '</g>';
    css += `@keyframes ${id}-flow { from { transform: translateX(-32px); } to { transform: translateX(0); } } .on3 .sc-${id} .wv { animation: ${id}-flow 1.2s linear infinite; }`;
    // 두 땅
    const up = `<path d="M100 -4 Q120 124 210 142 Q320 156 430 142 Q520 124 540 -4 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/>`;
    const dn = `<path d="M100 364 Q120 236 210 218 Q320 204 430 218 Q520 236 540 364 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/>`;
    body += at(1, 'drop', up + tag(320, 54, '땅', ROLE.p, 22), 0.2) + at(1, 'rise', dn + tag(320, 306, '땅', ROLE.p, 22), 0.2);
    // 칸 2: 양쪽 넓은 바다, 가운데 좁은 바다
    body += at(2, 'pop', tag(72, 180, '넓은 바다', ROLE.s, 20), 0.3) + at(2, 'pop', tag(568, 180, '넓은 바다', ROLE.s, 20), 0.5);
    body += drawLine('M210 142 Q320 156 430 142', C.orange, 2, { width: 4, delay: 0.9 }) + drawLine('M210 218 Q320 204 430 218', C.orange, 2, { width: 4, delay: 0.9 });
    body += `<g class="h4">` + at(2, 'pop', `<path d="M320 154 V206" stroke="${C.orange}" stroke-width="3.5"/>` + head(320, 154, -Math.PI / 2, C.orange, 3.5) + head(320, 206, Math.PI / 2, C.orange, 3.5), 1.5) + '</g>';
    // 칸 3: 물이 흐르고 물수리가 건넌다
    body += drawArrow(140, 180, 250, 180, C.blue, 3, { width: 5, delay: 0.2 }) + drawArrow(390, 180, 500, 180, C.blue, 3, { width: 5, delay: 0.8 });
    const bird = `<path d="M-30 0 Q-15 -16 0 0 Q15 -16 30 0" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    body += `<g class="b3"><g class="bd"><g transform="translate(250 100)"><g class="wg">${bird}</g></g></g></g>`;
    css += `@keyframes ${id}-fly { 0% { transform: translate(0px, 0px); opacity: 0; } 10% { opacity: 1; } 100% { transform: translate(${400 - 250}px, ${270 - 100}px); opacity: 1; } }
      @keyframes ${id}-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(-.6); } }
      .sc-${id} .wg { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .bd { animation: ${id}-fly 1.8s ease-in-out .3s both; }
      .on3 .sc-${id} .wg { animation: ${id}-flap .35s ease-in-out infinite; }`;
    // 칸 4
    body += at(4, 'pop', tag(320, 180, '해협', ROLE.y, 24), 0.5);
    body += `<g class="b4"><path class="flash flash4" d="M210 142 Q320 156 430 142 L430 218 Q320 204 210 218 Z" fill="none" stroke="${C.orange}" stroke-width="4" stroke-dasharray="9 7"/></g>`;
    put(K + '2/해협', svg(id, body, css));
  })();

  // ── 2단원: 이듬해(재작년 → 작년, 올해 → 내년 — 어떤 해의 바로 다음 해) ──────────────────────────────
  (function () {
    const id = 't51-k1-ideumhae';
    let css = base(id);
    const names = ['재작년', '작년', '올해', '내년'], cx = (i) => 92 + i * 152;
    let body = '';
    names.forEach((nm, i) => {
      body += at(1, 'pop', `<rect x="${cx(i) - 68}" y="44" width="136" height="176" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${cx(i) - 66.5}" y="45.5" width="133" height="38" rx="10" fill="${i === 2 ? C.mint : C.paper}"/><path d="M${cx(i) - 68} 84 H${cx(i) + 68}" stroke="${C.ink}" stroke-width="2"/>`
        + text(cx(i), 72, nm, { size: 20, color: i === 2 ? C.green : C.ink }), i * 0.12);
      body += `<g class="pt pt${i}"><rect x="${cx(i) - 66.5}" y="85.5" width="133" height="133" rx="0" fill="${C.peach}"/></g>`;
    });
    css += `.sc-${id} .pt { opacity: 0; transition: opacity .6s ease; } .on2 .sc-${id} .pt1 { opacity: 1; transition-delay: 1s; } .on3 .sc-${id} .pt3 { opacity: 1; transition-delay: 1s; } .on3 .sc-${id} .pt1 { opacity: 0; transition-delay: 0s; } .on4 .sc-${id} .pt1 { opacity: 1; transition-delay: .3s; }`;
    // 화분과 나무
    const pot = (x) => `<path d="M${x - 24} 186 H${x + 24} L${x + 18} 212 H${x - 18} Z" fill="${C.orange}"/>`;
    const sprout = (x) => `<g class="gr"><path d="M${x} 186 V150" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/><path d="M${x} 158 Q${x - 18} 146 ${x - 20} 160 Q${x - 8} 166 ${x} 158 Z M${x} 152 Q${x + 18} 140 ${x + 20} 154 Q${x + 8} 160 ${x} 152 Z" fill="${C.green}"/></g>`;
    const bush = (x, berry) => `<path d="M${x} 186 V140" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/><circle cx="${x}" cy="128" r="30" fill="${C.green}" opacity=".8"/><circle cx="${x - 22}" cy="146" r="18" fill="${C.green}" opacity=".8"/><circle cx="${x + 22}" cy="146" r="18" fill="${C.green}" opacity=".8"/>`
      + [[-12, 120], [10, 130], [-2, 146], [20, 112], [-22, 140]].map(([dx, y]) => `<circle cx="${x + dx}" cy="${y}" r="5.5" fill="${berry}" stroke="white" stroke-width="1.5"/>`).join('');
    body += at(1, 'fin', pot(cx(0)), 0.5) + `<g class="b1">${sprout(cx(0))}</g>`;
    css += growCss(id, '.gr', 1, { axis: 'Y', origin: 'center bottom', delay: 0.9, dur: 0.8 });
    // 칸 2: 재작년 → 이듬해 = 작년
    body += `<g class="dim dim3">` + curve(cx(0) + 10, 228, cx(1) - 10, 228, 262, C.orange, 2, { width: 4, delay: 0.2 }) + '</g>';
    body += at(2, 'pop', pot(cx(1)) + bush(cx(1), C.mint), 1.0);
    body += `<g class="h3">` + at(2, 'pop', tag(cx(1), 300, '이듬해', ROLE.o, 22), 1.4) + '</g>';
    // 칸 3: 올해 → 이듬해 = 내년
    body += at(3, 'pop', pot(cx(2)) + bush(cx(2), C.blue), 0.1);
    body += curve(cx(2) + 10, 228, cx(3) - 10, 228, 262, C.orange, 3, { width: 4, delay: 0.5 });
    body += at(3, 'pop', `<rect x="${cx(3) - 26}" y="140" width="52" height="66" rx="10" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><rect x="${cx(3) - 30}" y="128" width="60" height="16" rx="5" fill="${C.purple}"/>` + text(cx(3), 182, '잼', { size: 20, color: C.purple }), 1.0);
    body += `<g class="h4">` + at(3, 'pop', tag(cx(3), 300, '이듬해', ROLE.o, 22), 1.4) + '</g>';
    // 칸 4: 두 짝이 함께 반짝
    body += at(4, 'pop', tag(cx(1), 300, '이듬해', ROLE.o, 22), 0.3) + at(4, 'pop', tag(cx(3), 300, '이듬해', ROLE.o, 22), 0.3);
    body += curve(cx(0) + 10, 228, cx(1) - 10, 228, 262, C.orange, 4, { width: 4 }) + curve(cx(2) + 10, 228, cx(3) - 10, 228, 262, C.orange, 4, { width: 4 });
    body += glowRect(cx(1) - 72, 40, 144, 184, 4, C.orange, 0.6, 14) + glowRect(cx(3) - 72, 40, 144, 184, 4, C.orange, 0.6, 14);
    body += at(4, 'fin', text(cx(0) + 76, 344, '바로 다음 해', { size: 20, color: C.orange }) + text(cx(2) + 76, 344, '바로 다음 해', { size: 20, color: C.orange }), 1.0);
    put(K + '2/이듬해', svg(id, body, css));
  })();

  // ── 2단원: 그저께·모레·글피(오늘 수요일에서 하루씩 건너 세어 칸을 칠한다) ──────────────────────────────
  const dayFig = (word, id, dir, steps, rel) => {
    let css = base(id);
    const days = ['일', '월', '화', '수', '목', '금', '토'], dates = [10, 11, 12, 13, 14, 15, 16];
    const cx = (i) => 80 + i * 80, T0 = 3, target = T0 + dir * steps;
    const near = { '-1': '어제', '-2': '그저께', 1: '내일', 2: '모레', 3: '글피' };
    let body = at(1, 'fin', `<rect x="40" y="40" width="560" height="160" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="41.5" y="41.5" width="557" height="36" rx="10" fill="${C.paper}"/><path d="M40 78 H600" stroke="${C.ink}" stroke-width="2"/>`
      + [1, 2, 3, 4, 5, 6].map((i) => `<path d="M${40 + 80 * i} 78 V200" stroke="${C.line}" stroke-width="2"/>`).join('')
      + days.map((d, i) => text(cx(i), 67, d, { size: 19, color: i === 0 ? C.red : i === 6 ? C.blue : C.ink })).join(''));
    // 칠해지는 칸(아래에서 차오른다)
    body += `<rect class="fl ft" x="${cx(T0) - 38}" y="80" width="76" height="118" fill="${C.mint}"/><rect class="fl fg" x="${cx(target) - 38}" y="80" width="76" height="118" fill="${C.peach}"/>`;
    css += `.sc-${id} .fl { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform .6s ease-out; }
      .on1 .sc-${id} .ft { transform: none; transition-delay: .5s; }
      .on3 .sc-${id} .fg { transform: none; transition-delay: .2s; }`;
    body += at(1, 'fin', dates.map((d, i) => text(cx(i) + 32, 100, d, { size: 18, anchor: 'end', color: C.muted })).join(''));
    body += at(1, 'pop', `<circle cx="${cx(T0)}" cy="176" r="18" fill="${C.green}"/>` + text(cx(T0), 183, '★', { size: 20, color: 'white' }), 0.9);
    body += at(1, 'pop', tag(cx(T0), 232, '오늘', ROLE.p, 20), 1.1);
    // 칸 2: 하루씩 건너뛴다
    for (let k = 1; k <= steps; k++) {
      const a = cx(T0 + dir * (k - 1)), b = cx(T0 + dir * k), d = 0.2 + (k - 1) * 0.6;
      body += curve(a + dir * 4, 150, b - dir * 4, 150, 122, C.orange, 2, { width: 4, delay: d });
      body += at(2, 'pop', `<circle cx="${(a + b) / 2}" cy="148" r="13" fill="white" stroke="${C.orange}" stroke-width="2.5"/>` + text((a + b) / 2, 155, k, { size: 18, color: C.orange }), d + 0.7);
      if (k < steps) body += at(2, 'pop', tag(b, 232, near[dir * k], ROLE.g, 18), d + 0.9);
    }
    // 칸 3: 닿은 칸이 칠해지고 이름이 붙는다
    body += at(3, 'drop', `<g class="wd">${tag(cx(target), 232, word, ROLE.o, 18)}</g>`, 0.8);
    const xa = Math.min(cx(T0), cx(target)), xb = Math.max(cx(T0), cx(target));
    body += at(3, 'fin', braceBottom(xa, xb, 256, C.orange) + text((xa + xb) / 2, 306, `${steps}일 ${dir < 0 ? '전' : '뒤'}`, { size: 22, color: C.orange }), 1.2);
    // 칸 4
    body += glowRect(cx(target) - 40, 78, 80, 124, 4, C.orange, 0.2, 6);
    css += pulseCss(id, '.wd', 4, 0.4);
    const relX = dir < 0 ? 470 : 170;
    body += at(4, 'pop', tile(relX, 300, rel, { size: 22, h: 50, fill: TAN, stroke: C.orange, sw: 3 }), 0.8);
    return svg(id, body, css);
  };
  put(K + '2/그저께', dayFig('그저께', 't51-k1-geujeokke', -1, 2, '어제의 전날'));
  put(K + '2/모레', dayFig('모레', 't51-k1-more', 1, 2, '내일의 다음 날'));
  put(K + '2/글피', dayFig('글피', 't51-k1-geulpi', 1, 3, '모레의 다음 날'));

  // ── 2단원: 사흘(강낭콩을 지켜본 날 — 하루·이틀·사흘, 하루 더 가면 나흘) ──────────────────────────────
  // ── 2단원: 나흘(비 온 날 — 하루·이틀·사흘·나흘, 웅덩이가 커진다) ──────────────────────────────
  const countDays = (id, count) => {
    let css = base(id);
    const cx = (i) => 105 + i * 143, NAMES = ['하루', '이틀', '사흘', '나흘'];
    const cell = (i, dash = false) => `<rect x="${cx(i) - 65}" y="40" width="130" height="156" rx="12" fill="white" stroke="${dash ? C.muted : C.ink}" stroke-width="3"${dash ? ' stroke-dasharray="8 6"' : ''}/><rect x="${cx(i) - 63.5}" y="41.5" width="127" height="34" rx="10" fill="${C.paper}"/><path d="M${cx(i) - 65} 76 H${cx(i) + 65}" stroke="${dash ? C.muted : C.ink}" stroke-width="2"/>`
      + text(cx(i), 66, `${i + 1}일`, { size: 20, color: dash ? C.muted : C.ink });
    // 칸 1·2·3 에 나타날 날의 차례: count 3 → [1][2,3][dash 4], count 4 → [1][2,3][4]
    const when = (i) => (i === 0 ? 1 : i < 3 ? 2 : 3);
    let body = '';
    const bean = (x, k) => {
      const h = [24, 52, 82][k];
      return `<path d="M${x - 22} 172 H${x + 22} L${x + 17} 192 H${x - 17} Z" fill="${C.orange}"/><path d="M${x} 172 V${172 - h}" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>`
        + `<path d="M${x} ${180 - h} Q${x - 18} ${168 - h} ${x - 20} ${182 - h} Q${x - 8} ${188 - h} ${x} ${180 - h} Z M${x} ${178 - h} Q${x + 18} ${166 - h} ${x + 20} ${180 - h} Q${x + 8} ${186 - h} ${x} ${178 - h} Z" fill="${C.green}"/>`
        + (k === 2 ? `<path d="M${x} ${172 - 34} Q${x + 20} ${172 - 44} ${x + 22} ${172 - 30} Q${x + 10} ${172 - 26} ${x} ${172 - 34} Z" fill="${C.green}"/>` : '');
    };
    const rain = (x, k) => cloud(x, 104, 0.8, 'white', C.blue) + `<g class="rn rn${k}">` + [-22, -6, 10, 26].map((dx, j) => `<path d="M${x + dx} ${130 + (j % 2) * 10} l-4 12" stroke="${C.blue}" stroke-width="3.5" stroke-linecap="round"/>`).join('') + '</g>';
    for (let i = 0; i < 4; i++) {
      const n = when(i), d = i === 2 ? 1.0 : 0.2;
      if (i === 3 && count === 3) {
        body += `<g class="dim dim4">` + at(3, 'fin', cell(i, true), 1.0) + at(3, 'pop', tag(cx(i), 222, '나흘', ROLE.g, 20), 1.3) + '</g>';
        continue;
      }
      body += at(n, 'pop', cell(i), d);
      body += at(n, 'rise', count === 3 ? bean(cx(i), i) : rain(cx(i), i), d + 0.4);
      body += at(n, 'pop', tag(cx(i), 222, NAMES[i], ROLE.o, 20), d + 0.8);
    }
    if (count === 4) {
      css += `@keyframes ${id}-rain { from { transform: translateY(-6px); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }
        .sc-${id} .rn { animation: ${id}-rain .9s linear infinite; }`;
      // 웅덩이(칸마다 커진다)
      body += at(1, 'fin', `<path d="M30 268 H610" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`);
      body += `<g class="b1"><g class="pd"><ellipse cx="320" cy="268" rx="240" ry="15" fill="${C.blue}" opacity=".55"/></g></g>`;
      css += `.sc-${id} .pd { transform-box: fill-box; transform-origin: center; transform: scaleX(0); transition: transform 1s ease-out .9s; }
        .on1 .sc-${id} .pd { transform: scaleX(.22); } .on2 .sc-${id} .pd { transform: scaleX(.6); } .on3 .sc-${id} .pd { transform: none; }`;
    }
    // 칸 3: 묶음 괄호와 날수
    const last = count - 1, by = count === 4 ? 284 : 248;
    body += at(3, 'fin', braceBottom(cx(0) - 62, cx(last) + 62, by, C.orange), count === 4 ? 1.6 : 0.3);
    body += `<g class="h4">` + at(3, 'fin', text((cx(0) + cx(last)) / 2, by + 50, `${count}일`, { size: 24, color: C.orange }), count === 4 ? 1.8 : 0.5) + '</g>';
    // 칸 4: 날들이 함께 반짝, 이름과 날수
    body += glowRect(cx(0) - 68, 37, cx(last) - cx(0) + 136, 162, 4, C.orange, 0.2, 14);
    body += at(4, 'pop', tile((cx(0) + cx(last)) / 2, by + 44, `${NAMES[last]} = ${count}일`, { size: 24, h: 50, fill: TAN, stroke: C.orange, sw: 3 }), 0.6);
    return svg(id, body, css);
  };
  put(K + '2/사흘', countDays('t51-k1-saheul', 3));
  put(K + '2/나흘', countDays('t51-k1-naheul', 4));
})(typeof window !== 'undefined' ? window : globalThis);
