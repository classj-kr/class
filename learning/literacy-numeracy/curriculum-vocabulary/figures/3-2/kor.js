// 국어 3-2 낱말 도식(첫 묶음): 독서 단원 차례·중심 내용·중심 문장, 1단원 말하는 이·연·원인·결과·기호·간추리다·생각그물, 2단원 발음·얼개.
// 예는 모두 교과서 글에서 가져왔다: 『도시에서 만난 야생 동물 이야기』 차례(10쪽), 「갈대와 억새」(16~17쪽), 「은행잎 편지」(36~37쪽, 6연),
// 「호랑이를 이긴 개미」 원인·결과 표(54~55쪽), 「생각이 달라도 대화로 풀어요」(51쪽), 「우리 지역의 자랑거리」(56~58쪽), 생각그물 보기(64쪽),
// 'ㅎ' 받침 발음(64쪽 낳아·놓아·좋아), 태권도 발표 자료 얼개(96쪽).
// 도구(tile·tag·row·curve·base·move 따위)는 figures/4-2/kor.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 움직임은 transform·opacity·stroke-dashoffset·색만 쓴다(도형의 x·y·width·height·r·d 를 CSS 로 바꾸지 않는다).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게 실측: 한글 1em, 괄호 .36em, 쉼표·마침표·쌍점 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
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
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange] };
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
  const drawArrow = (x1, y1, x2, y2, color, n, { width = 5, delay = 0 } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + g(`fin fin${n}`, head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color, width), delay + 0.9) + '</g>';
  // 그어지는 줄(화살촉 없음). cls 를 주면 칸 4 에 색을 바꾸는 데 쓴다.
  const line = (x1, y1, x2, y2, color, n, { width = 4, delay = 0, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
  const arrowR = (x1, x2, y, color = C.muted) => `<path d="M${x1} ${y} H${x2}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>${head(x2, y, 0, color, 5)}`;
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;

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
    @keyframes ${id}-wave { 0%, 100% { opacity: .15; } 50% { opacity: 1; } }
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
    .on${n} .sc-${id} .wv${n} { animation: ${id}-wave 1.2s ease-in-out infinite; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .dim${n} { opacity: .3; }`;
    return s;
  };
  // 칸 n 에서 속성 없는 <g class="cls"> 를 옮긴다(처음 자리는 CSS transform 으로 둔다)
  const move = (id, cls, from, n, { dur = 1, delay = 0, to = 'none' } = {}) => `
    .sc-${id} .${cls} { transform: ${from}; transition: transform ${dur}s ease-in-out ${delay}s, opacity .6s ease ${delay}s; }
    .on${n} .sc-${id} .${cls} { transform: ${to}; }`;
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  const glowCss = (id, sel, n, delay = 0.2) => `.on${n} .sc-${id} ${sel} { animation: ${id}-flash 1.4s ease-in-out ${delay}s both; }`;

  const K = '3-2/국어/';
  const TAN = '#fdf3d3';
  const GRAY = '#b5c4be';
  const bar = (x, y, w, color = GRAY, h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 글자를 한 자씩 따로 놓은 조각(글자마다 색을 바꿀 때). 글자 폭은 1em 으로 본다.
  const charTile = (cx, cy, chars, o = {}) => {
    const { size = 30, h = 58, fill = 'white', stroke = C.line, cls = '', sw = 3 } = o;
    const w = o.w || Math.round(chars.length * size + size * 1.3);
    const x0 = cx - (chars.length * size) / 2 + size / 2;
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
      + chars.map((c, i) => text(f(x0 + i * size), f(cy + size * 0.36), c, { size, cls: `ch ch${i}` })).join('') + '</g>';
  };
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;
  // 소리 물결 세 겹(오른쪽으로 퍼짐). cls 에 wvN 을 주면 칸 N 부터 깜박인다.
  const waves = (x, y, color, cls = 'snd', k = 1) => [0, 1, 2].map((i) =>
    `<path class="${cls}" style="animation-delay:${i * 0.2}s" d="M${f(x + i * 11 * k)} ${f(y - (10 + i * 6) * k)} q${f((8 + i * 3) * k)} ${f((10 + i * 6) * k)} 0 ${f((20 + i * 12) * k)}" stroke="${color}" stroke-width="${3.5 * Math.min(k, 1.4)}" fill="none" stroke-linecap="round"/>`).join('');
  // 다섯 모 별
  const star = (x, y, R, fill = C.yellow, stroke = C.orange) => {
    const pts = [];
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? R * 0.42 : R; pts.push(`${f(x + r * Math.cos(a))} ${f(y + r * Math.sin(a))}`); }
    return `<path d="M${pts.join(' L')} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  };
  // 글 쪽 안의 낱말 칩(줄 위에 얹힘)
  const chip = (cx, cy, label, [fill, stroke] = ['white', C.line], size = 18, cls = '') => {
    const w = Math.round(tw(label, size) + 14);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - 12)}" width="${w}" height="24" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };

  // ── 독서 단원: 차례(『도시에서 만난 야생 동물 이야기』 — 황조롱이 15쪽을 바로 펼친다) ──────────────────────────────
  (function () {
    const id = 't32-k1-charye';
    let css = base(id);
    const PX = 36, PW = 324;
    let body = at(1, 'fin', `<rect x="${PX}" y="18" width="${PW}" height="324" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + text(PX + PW / 2, 60, '차례', { size: 26 }) + `<path d="M${PX + 24} 78 H${PX + PW - 24}" stroke="${C.line}" stroke-width="2"/>`);
    const rows = [['머리말', '4'], ['둥지와 알', '12'], ['날개', '14'], ['황조롱이', '15'], ['참새', '26']];
    const ry = (i) => 114 + i * 48;
    const nx = PX + PW - 26;
    rows.forEach(([l, p], i) => {
      const y = ry(i), lx = PX + 28;
      const le = lx + tw(l, 22) + 12;
      const hl = i === 3 ? `<g class="hl"><rect x="${PX + 12}" y="${y - 22}" width="${PW - 24}" height="42" rx="10" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/></g>` : '';
      body += at(1, 'slide', hl + text(lx, y + 8, l, { size: 22, anchor: 'start' })
        + `<path d="M${f(le)} ${y + 4} H${nx - 38}" stroke="#a9bab3" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>`
        + `<g class="pn">${text(nx, y + 8, p, { size: 22, anchor: 'end', color: C.blue })}</g>`, 0.3 + i * 0.2);
    });
    css += `.sc-${id} .hl { opacity: 0; transition: opacity .5s ease .2s; } .on3 .sc-${id} .hl { opacity: 1; }`;
    // 칸 2: 이름 옆 숫자는 쪽 번호
    body += `<g class="h3">${glowRect(nx - 52, 88, 64, 246, 2, C.blue, 0.2, 12)}</g>`;
    css += `.sc-${id} .h3 { transition: opacity .4s ease; }`;
    body += at(2, 'pop', tag(nx - 20, 50, '쪽', ROLE.s, 20), 0.2);
    css += pulseCss(id, '.pn', 2, 0.6);
    // 칸 3: 황조롱이 줄 → 15쪽을 펼친다(쪽이 넘어간다)
    body += drawArrow(PX + PW + 6, ry(3) - 4, 418, 226, C.orange, 3, { delay: 0.4 });
    const book = `<path d="M428 112 Q474 104 520 116 Q566 104 612 112 V270 Q566 262 520 274 Q474 262 428 270 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M520 116 V274" stroke="${C.line}" stroke-width="2.5"/>`
      + [146, 170, 194, 218, 242].map((y, k) => bar(442, y, k === 4 ? 46 : 64, GRAY, 8)).join('');
    body += at(3, 'pop', book, 0.6);
    const bird = (x, y) => `<path d="M${x - 44} ${y + 2} L${x - 62} ${y - 8} L${x - 58} ${y + 12} Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<ellipse cx="${x - 14}" cy="${y + 4}" rx="34" ry="17" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5"/>`
      + `<path d="M${x - 30} ${y - 4} Q${x - 10} ${y - 30} ${x + 8} ${y - 2} Q${x - 10} ${y + 6} ${x - 30} ${y - 4} Z" fill="${C.peach}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<circle cx="${x + 20}" cy="${y - 10}" r="13" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5"/>`
      + `<path d="M${x + 31} ${y - 13} L${x + 42} ${y - 8} L${x + 31} ${y - 4} Z" fill="${C.ink}"/><circle cx="${x + 23}" cy="${y - 13}" r="2.6" fill="${C.ink}"/>`;
    body += at(3, 'pop', bird(566, 184) + text(600, 260, '15', { size: 20, anchor: 'end', color: C.blue }), 2.1);
    // 넘어가는 쪽 세 장(쪽 오른쪽 위에 겹쳐 있다가 왼쪽으로 뒤집힌다)
    body += [0, 1, 2].map((i) => `<g class="b3"><path class="fp fp${i}" d="M520 116 Q566 104 612 112 V270 Q566 262 520 274 Z" fill="white" stroke="${C.line}" stroke-width="2.5"/></g>`).join('');
    css += `.sc-${id} .fp { transform-box: fill-box; transform-origin: left center; opacity: 0; }
      @keyframes ${id}-flip { 0% { opacity: 1; transform: scaleX(1); } 80% { opacity: 1; transform: scaleX(-1); } 100% { opacity: 0; transform: scaleX(-1); } }`
      + [0, 1, 2].map((i) => `.on3 .sc-${id} .fp${i} { animation: ${id}-flip .7s ease-in-out ${(1.0 + i * 0.3).toFixed(1)}s both; }`).join('\n');
    // 칸 4
    body += glowRect(PX - 6, 12, PW + 12, 336, 4, C.green, 0.1, 16);
    body += at(4, 'pop', tag(520, 318, '차례', ROLE.p, 22), 0.6);
    put(K + 'reading/차례', svg(id, body, css));
  })();

  // ── 독서 단원: 중심 내용(「갈대와 억새」 네 문단 → 갈대와 억새를 구별하는 방법) ──────────────────────────────
  (function () {
    const id = 't32-k1-jungsimnaeyong';
    let css = base(id);
    const bx = (i) => 26 + i * 152, BW = 132, LY = [94, 124, 154, 184, 214];
    const bcx = (i) => bx(i) + BW / 2;
    const TY = 298;
    // 칸 1: 제목과 네 문단
    let body = `<g class="b1"><g class="ti">${g('pop pop1', tile(320, 32, '갈대와 억새', { size: 22, h: 44, fill: TAN, stroke: C.orange }))}</g></g>`;
    body += [0, 1, 2, 3].map((i) => {
      const x = bx(i);
      const lines = LY.map((y, k) => bar(x + 14, y, k === 4 ? 70 : 104, GRAY, 9)).join('');
      return `<g class="dim dim4">` + at(1, 'rise', `<rect x="${x}" y="66" width="${BW}" height="170" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + lines, 0.3 + i * 0.25) + '</g>';
    }).join('');
    // 칸 2: 문단마다 '갈대', '억새'가 나온다
    const spots = [[[1, 46], [3, 86]], [[0, 80], [2, 50]], [[2, 86], [3, 46]], [[0, 46], [4, 50]]];
    const chips = [];
    spots.forEach((pair, i) => pair.forEach(([k, dx], j) => chips.push({ x: bx(i) + dx, y: LY[k], label: j === 0 ? '갈대' : '억새', d: 0.2 + i * 0.25 + j * 0.12 })));
    chips.forEach((c, n) => {
      css += `.sc-${id} .cw${n} { transition: transform .9s ease-in-out ${(0.2 + n * 0.05).toFixed(2)}s, opacity .35s ease ${(0.85 + n * 0.05).toFixed(2)}s; }
        .on4 .sc-${id} .cw${n} { transform: translate(${f(320 - c.x)}px, ${f(TY - c.y)}px); opacity: 0; }`;
      body += `<g class="b2"><g class="cw${n}">${g('pop pop2', chip(c.x, c.y, c.label, ROLE.s), c.d)}</g></g>`;
    });
    // 칸 3: 문단마다 말하는 것
    const labels = ['닮은 점', '꽃', '색깔', '자라는 곳'];
    labels.forEach((l, i) => {
      css += `.sc-${id} .lw${i} { transition: transform .9s ease-in-out ${(0.3 + i * 0.1).toFixed(1)}s, opacity .35s ease ${(1.0 + i * 0.1).toFixed(1)}s; }
        .on4 .sc-${id} .lw${i} { transform: translate(${f(320 - bcx(i))}px, ${TY - 270}px); opacity: 0; }`;
      body += `<g class="b3"><g class="lw${i}">` + line(bcx(i), 238, bcx(i), 250, C.green, 3, { width: 3, delay: i * 0.3 })
        + g('pop pop3', tile(bcx(i), 270, l, { size: 20, h: 40, fill: C.mint, stroke: C.green }), 0.3 + i * 0.3) + '</g></g>';
    });
    // 칸 4: 모두 모여 하나가 된다
    css += `.sc-${id} .ti { transition: transform .9s ease-in-out .2s, opacity .35s ease .85s; } .on4 .sc-${id} .ti { transform: translateY(${TY - 32}px); opacity: 0; }`;
    const main = '갈대와 억새를 구별하는 방법';
    body += at(4, 'pop', tile(320, TY, main, { size: 22, h: 50, fill: TAN, stroke: C.orange, sw: 4 }), 1.3);
    body += at(4, 'pop', tag(320, 340, '중심 내용', ROLE.y, 20), 1.8);
    put(K + 'reading/중심 내용', svg(id, body, css));
  })();

  // ── 독서 단원: 중심 문장(「갈대와 억새」 자라는 곳 문단 — 첫 문장을 둘째·셋째 문장이 받친다) ──────────────────────────────
  // 갈대(물가)와 억새(언덕) 그림
  const reed = (x, y, k = 1) => [-12, 0, 12].map((dx, i) => {
    const h = (52 + (i === 1 ? 10 : 0)) * k, tx = x + dx * k + (i - 1) * 3 * k;
    return `<path d="M${f(x + dx * k)} ${y} Q${f(x + dx * k)} ${f(y - h * 0.6)} ${f(tx)} ${f(y - h)}" stroke="${C.green}" stroke-width="${3 * k}" fill="none" stroke-linecap="round"/>`
      + `<path d="M${f(tx)} ${f(y - h + 2)} q${f(-7 * k)} ${f(-8 * k)} ${f(-4 * k)} ${f(-18 * k)} M${f(tx)} ${f(y - h + 2)} q${f(7 * k)} ${f(-8 * k)} ${f(4 * k)} ${f(-18 * k)} M${f(tx)} ${f(y - h + 2)} v${f(-20 * k)}" stroke="${C.orange}" stroke-width="${4 * k}" fill="none" stroke-linecap="round"/>`;
  }).join('');
  const silver = (x, y, k = 1) => [-12, 0, 12].map((dx, i) => {
    const h = (50 + (i === 1 ? 10 : 0)) * k, tx = x + dx * k + (i - 1) * 4 * k;
    const fan = [-0.5, -0.17, 0.17, 0.5].map((a) => `M${f(tx)} ${f(y - h)} l${f(Math.sin(a) * 18 * k)} ${f(-Math.cos(a) * 18 * k)}`).join(' ');
    return `<path d="M${f(x + dx * k)} ${y} Q${f(x + dx * k)} ${f(y - h * 0.6)} ${f(tx)} ${f(y - h)}" stroke="${C.green}" stroke-width="${3 * k}" fill="none" stroke-linecap="round"/>`
      + `<path d="${fan}" stroke="${C.muted}" stroke-width="${4.5 * k}" fill="none" stroke-linecap="round"/>`
      + `<path d="${fan}" stroke="white" stroke-width="${2 * k}" fill="none" stroke-linecap="round"/>`;
  }).join('');
    const water = (x1, x2, y) => [0, 12].map((d) => { let p = `M${x1} ${y + d}`; for (let x = x1; x < x2; x += 20) p += ' q5 -6 10 0 t10 0'; return `<path d="${p}" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }).join('');
  (function () {
    const id = 't32-k1-jungsimmunjang';
    let css = base(id);
    const S = [[100, 230], [152, 140], [204, 140]];
    // 칸 1: 한 문단, 문장 셋
    let body = `<g class="dim dim3">` + at(1, 'fin', `<rect x="30" y="56" width="300" height="190" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`) + '</g>';
    body += at(1, 'pop', tag(180, 34, '「갈대와 억새」 한 문단', ['white', C.line], 18), 0);
    S.forEach(([y, w], i) => {
      body += `<g class="${i ? 'dim dim3' : ''}">` + at(1, 'pop', `<circle cx="60" cy="${y}" r="15" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + text(60, y + 7, String(i + 1), { size: 19, color: C.muted }), 0.3 + i * 0.3) + '</g>';
      const inner = `<rect class="sb sb${i}" x="86" y="${y - 8}" width="${w}" height="16" rx="8" fill="${GRAY}"/>`;
      body += `<g class="b1"><g class="sm sm${i}">${g('slide slide1', inner, 0.4 + i * 0.3)}</g></g>`;
    });
    // 칸 2: 첫 문장 — 갈대는 물가, 억새는 마른땅
    css += `.sc-${id} .sb { transition: fill .5s ease .2s; } .on2 .sc-${id} .sb0 { fill: ${C.orange}; } .on3 .sc-${id} .sb1, .on3 .sc-${id} .sb2 { fill: ${C.green}; }`;
    const hill = (x, y, w, hgt) => `<path d="M${x - w / 2} ${y} Q${x - w / 4} ${y - hgt} ${x} ${y - hgt} Q${x + w / 4} ${y - hgt} ${x + w / 2} ${y} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    body += at(2, 'pop', water(380, 480, 136) + reed(428, 134, 1) + tag(428, 166, '갈대', ROLE.o, 18), 0.6);
    body += at(2, 'pop', hill(560, 138, 120, 36) + silver(560, 110, 0.9) + tag(560, 166, '억새', ['white', C.muted], 18), 1.1);
    body += curve(320, 98, 372, 92, 74, C.orange, 2, { width: 3.5, delay: 0.2 });
    // 칸 3: 둘째·셋째 문장 — 산에는 갈대가 없고 모두 억새. 두 문장이 다리가 되어 첫 문장을 받친다.
    const mount = (x, y) => `<path d="M${x - 56} ${y} L${x} ${y - 66} L${x + 56} ${y} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;
    body += at(3, 'pop', mount(430, 300) + reed(430, 262, 0.8) + g('pop pop3', cross(474, 226, 11), 1.2), 0.7);
    body += at(3, 'pop', mount(564, 300) + silver(564, 262, 0.8) + g('pop pop3', check(608, 226, 11), 1.5), 1.0);
    body += at(3, 'fin', tag(430, 324, '갈대', ROLE.o, 18) + tag(564, 324, '억새', ['white', C.muted], 18), 1.2);
    // 둘째(왼쪽 다리)·셋째(오른쪽 다리): 막대 가운데 (156, y) → 다리 가운데
    const legs = [[1, 116, 178], [2, 300, 178]];
    legs.forEach(([i, x, y]) => {
      const [sy, sw] = S[i], cx0 = 86 + sw / 2;
      css += `.sc-${id} .sm${i} { transform-box: fill-box; transform-origin: center; transition: transform 1s ease-in-out ${0.3 + (i - 1) * 0.25}s; }
        .on3 .sc-${id} .sm${i} { transform: translate(${f(x - cx0)}px, ${f(y - sy)}px) rotate(90deg); }`;
    });
    body += at(3, 'pop', tag(208, 270, '뒷받침', ROLE.p, 18), 1.6);
    // 칸 4: 위에 놓인 첫 문장
    body += glowRect(78, 86, 246, 28, 4, C.orange, 0.1, 14);
    body += at(4, 'pop', tag(200, 316, '중심 문장', ROLE.y, 22), 0.6);
    css += pulseCss(id, '.sm0', 4, 0.3);
    put(K + 'reading/중심 문장', svg(id, body, css));
  })();

  // ── 1단원: 「은행잎 편지」 시 쪽(6연, 연마다 2줄) ──────────────────────────────
  const POEM_W = [[120, 90], [118, 78], [126, 86], [108, 80], [116, 100], [112, 96]];

  // ── 1단원: 말하는 이(시를 쓴 시인과 시 속에서 이야기하는 '나') ──────────────────────────────
  (function () {
    const id = 't32-k1-malhaneun';
    let css = base(id);
    const PX = 120, PW = 200, LX = PX + 22;
    const ly = (k, j) => 98 + k * 40 + j * 16;
    let body = `<g class="dim dim4">` + at(1, 'fin', `<rect x="${PX}" y="18" width="${PW}" height="324" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + tile(PX + PW / 2, 52, '은행잎 편지', { size: 20, h: 40, fill: TAN, stroke: C.orange })
      + POEM_W.map((ws, k) => ws.map((w, j) => bar(LX, ly(k, j), w, GRAY, 7)).join('')).join('')) + '</g>';
    // 칸 1: '나', '내'가 나오는 자리(1연 첫 줄, 5연 첫 줄, 6연 둘째 줄)
    const me = [[LX + 48, ly(0, 0), '나'], [LX + 62, ly(4, 0), '내'], [LX + 12, ly(5, 1), '내']];
    body += me.map(([x, y, ch], i) => at(1, 'pop', `<g class="me">${tile(x, y, ch, { size: 18, w: 30, h: 30, rx: 15, fill: C.peach, stroke: C.orange, sw: 2.5 })}</g>`, 0.8 + i * 0.3)).join('');
    css += pulseCss(id, '.me .tl', 3, 0.3);
    // 칸 2: 시 속의 '나'가 은행잎에 이야기를 담아 이사 간 친구에게 띄워 보낸다
    const leaf = `<path d="M0 6 L-15 -16 Q-8 -24 -1 -19 L0 -12 L1 -19 Q8 -24 15 -16 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 6 V14" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round"/>`;
    body += at(2, 'fin', `<path d="M352 290 Q420 274 490 290 T630 290" stroke="${C.sky}" stroke-width="22" fill="none" stroke-linecap="round"/>`
      + `<path d="M366 290 q12 -6 24 0 t24 0 M470 292 q12 -6 24 0 t24 0 M570 290 q12 -6 24 0" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`, 0);
    body += curve(LX + 64, ly(0, 0), 384, 154, 84, C.orange, 2, { width: 3, arrowHead: false, delay: 0.1 });
    body += `<g class="sp">` + at(2, 'pop', person(400, 210, C.orange, 17), 0.7) + '</g>';
    body += `<g class="b2"><g class="lf">${leaf}</g></g>`;
    css += `.sc-${id} .lf { transform: translate(424px, 280px) scale(1.15); opacity: 0; }
      @keyframes ${id}-float { 0% { opacity: 0; transform: translate(424px, 280px) scale(1.15) rotate(0deg); } 10% { opacity: 1; } 50% { transform: translate(492px, 272px) scale(1.15) rotate(14deg); } 100% { opacity: 1; transform: translate(552px, 280px) scale(1.15) rotate(-8deg); } }
      .on2 .sc-${id} .lf { animation: ${id}-float 2.4s ease-in-out 1.1s both; }`;
    const house = `<path d="M556 160 V118 L590 90 L624 118 V160 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><rect x="580" y="132" width="18" height="28" fill="${C.sky}" stroke="${C.ink}" stroke-width="2.5"/>`;
    body += at(2, 'pop', house + person(590, 220, C.blue, 15), 0.9);
    body += at(2, 'pop', tag(590, 64, '친구', ROLE.s, 18), 1.2);
    // 칸 3: 시를 쓴 사람은 시인, 시 속에서 이야기하는 사람은 '나'
    body += `<g class="dim dim4">` + at(3, 'pop', person(58, 196, C.green, 20)
      + `<path d="M84 210 L112 184" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="M112 184 L118 178" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/>`
      + tag(58, 262, '시인', ROLE.p, 18), 0.2) + '</g>';
    body += at(3, 'pop', tag(400, 256, '나', ROLE.o, 20), 0.9);
    // 칸 4
    body += glowRect(356, 150, 88, 122, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(400, 330, '말하는 이', ROLE.y, 22), 0.6);
    css += pulseCss(id, '.sp', 4, 0.3);
    put(K + '1/말하는 이', svg(id, body, css));
  })();

  // ── 1단원: 연(「은행잎 편지」 열두 줄이 두 줄씩 묶여 6연이 된다) ──────────────────────────────
  (function () {
    const id = 't32-k1-yeon';
    let css = base(id);
    const PX = 110, PW = 260, LX = 136;
    const yE = (i) => 100 + i * 18;                 // 칸 1: 고르게 늘어선 열두 줄
    const yG = (k, j) => 70 + k * 48 + j * 18;      // 칸 2: 두 줄씩 묶이고 사이가 벌어진다
    let body = at(1, 'fin', `<rect x="${PX}" y="12" width="${PW}" height="336" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + tile(PX + PW / 2 - 20, 40, '은행잎 편지', { size: 20, h: 40, fill: TAN, stroke: C.orange }));
    // 칸 3에 깔리는 연 바탕(줄 아래)
    body += [0, 1, 2, 3, 4, 5].map((k) => at(3, 'fin', `<rect x="${LX - 10}" y="${yG(k, 0) - 12}" width="146" height="42" rx="10" fill="${k % 2 ? C.sky : C.mint}"/>`, 0.2 + k * 0.25)).join('');
    for (let i = 0; i < 12; i++) {
      const k = Math.floor(i / 2), j = i % 2, w = POEM_W[k][j];
      body += `<g class="b1"><g class="sh sh${i}"><rect class="gr gr${i}" x="${LX}" y="${yE(i) - 4}" width="${w}" height="8" rx="4" fill="${GRAY}"/></g></g>`;
      css += `.sc-${id} .gr${i} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .35s ease-out ${(0.3 + i * 0.12).toFixed(2)}s; }
        .on1 .sc-${id} .gr${i} { transform: none; }
        .sc-${id} .sh${i} { transition: transform .9s ease-in-out ${(0.2 + k * 0.08).toFixed(2)}s; }
        .on2 .sc-${id} .sh${i} { transform: translateY(${yG(k, j) - yE(i)}px); }`;
    }
    body += at(1, 'pop', tile(520, 96, '12줄', { size: 26, h: 52, fill: 'white', stroke: C.line }), 1.9);
    // 칸 2: 묶음 사이에 한 줄씩 빈자리
    body += [0, 1, 2, 3, 4].map((k) => {
      const gy = yG(k, 1) + 15;
      return `<g class="h3">` + at(2, 'fin', `<path d="M${LX} ${gy} H${LX + 124}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/>`, 1.2 + k * 0.15) + '</g>';
    }).join('');
    css += `.on2 .sc-${id} .fin2 { animation: ${id}-flash 1.4s ease-in-out both; } .sc-${id} .h3 { transition: opacity .4s ease; }`;
    // 칸 3: 묶음마다 1연 … 6연
    body += [0, 1, 2, 3, 4, 5].map((k) => {
      const y1 = yG(k, 0) - 8, y2 = yG(k, 1) + 8, m = (y1 + y2) / 2;
      return at(3, 'pop', `<path d="M282 ${y1} H290 V${y2} H282" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<g class="yt yt${k}">${tag(330, m, `${k + 1}연`, k === 5 ? ROLE.y : ROLE.p, 18)}</g>`, 0.2 + k * 0.25);
    }).join('');
    body += `<g class="b3">${g('fin fin3', `<path d="M520 128 V176" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>` + head(520, 178, Math.PI / 2, C.muted, 5), 1.6)}</g>`;
    body += at(3, 'pop', tile(520, 214, '6연', { size: 26, h: 52, fill: C.mint, stroke: C.green }), 1.9);
    // 칸 4: 덩어리 하나하나가 연
    css += [0, 1, 2, 3, 4, 5].map((k) => pulseCss(id, `.yt${k} .tl`, 4, 0.2 + k * 0.2)).join('');
    body += glowRect(LX - 14, yG(5, 0) - 16, 154, 50, 4, C.orange, 0.2, 12);
    body += at(4, 'pop', tag(520, 300, '연', ROLE.y, 24), 1.4);
    put(K + '1/연', svg(id, body, css));
  })();

  // ── 1단원: 원인·결과(「호랑이를 이긴 개미」 원인/결과 표) ──────────────────────────────
  // 호랑이 얼굴(가운데 x, y, 크기 s): mood 는 angry·plain·calm
  const tiger = (x, y, s, mood) => {
    let m = `<circle cx="-34" cy="-36" r="15" fill="${C.orange}" stroke="${C.ink}" stroke-width="3"/><circle cx="34" cy="-36" r="15" fill="${C.orange}" stroke="${C.ink}" stroke-width="3"/>`
      + `<circle cx="-34" cy="-36" r="7" fill="${C.peach}"/><circle cx="34" cy="-36" r="7" fill="${C.peach}"/>`
      + `<circle cx="0" cy="0" r="48" fill="${C.orange}" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M-12 -46 L-8 -32 M0 -48 V-33 M12 -46 L8 -32 M-48 -6 L-32 -4 M-47 9 L-32 7 M48 -6 L32 -4 M47 9 L32 7" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`
      + `<ellipse cx="0" cy="18" rx="24" ry="18" fill="white"/><path d="M-7 6 H7 L0 14 Z" fill="${C.ink}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`;
    if (mood === 'angry') m += `<path d="M-28 -24 L-9 -15 M28 -24 L9 -15" stroke="${C.ink}" stroke-width="4.5" stroke-linecap="round"/><circle cx="-17" cy="-8" r="5" fill="${C.ink}"/><circle cx="17" cy="-8" r="5" fill="${C.ink}"/>`
      + `<path d="M-13 23 Q0 15 13 23 Q0 38 -13 23 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    else if (mood === 'calm') m += `<path d="M-25 -9 Q-17 -2 -9 -9 M9 -9 Q17 -2 25 -9" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
      + `<path d="M-9 22 Q-4.5 28 0 22 Q4.5 28 9 22" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="-30" cy="10" r="6" fill="${C.peach}"/><circle cx="30" cy="10" r="6" fill="${C.peach}"/>`;
    else m += `<circle cx="-17" cy="-9" r="5" fill="${C.ink}"/><circle cx="17" cy="-9" r="5" fill="${C.ink}"/><path d="M-9 23 Q0 20 9 23" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${m}</g>`;
  };
  // 개미(오른쪽을 본다)
  const ant = (x, y, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`
    + `<path d="M-2 2 L-9 12 M1 2 L1 13 M3 2 L11 12" stroke="${C.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
    + `<path d="M15 -10 Q18 -18 25 -18 M12 -10 Q12 -19 17 -22" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`
    + `<ellipse cx="-14" cy="0" rx="10" ry="8" fill="${C.ink}"/><ellipse cx="0" cy="-1" rx="6" ry="5" fill="${C.ink}"/><circle cx="12" cy="-4" r="7" fill="${C.ink}"/><circle cx="14.5" cy="-6" r="2" fill="white"/></g>`;
  const rabbit = (x, y) => `<ellipse cx="${x - 8}" cy="${y - 42}" rx="6" ry="18" fill="white" stroke="${C.ink}" stroke-width="2.5"/><ellipse cx="${x + 8}" cy="${y - 42}" rx="6" ry="18" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`
    + `<ellipse cx="${x}" cy="${y + 22}" rx="20" ry="18" fill="white" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${x}" cy="${y - 12}" r="17" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`
    + `<circle cx="${x - 6}" cy="${y - 14}" r="2.6" fill="${C.ink}"/><circle cx="${x + 6}" cy="${y - 14}" r="2.6" fill="${C.ink}"/><path d="M${x - 4} ${y - 6} Q${x} ${y - 2} ${x + 4} ${y - 6}" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const card = (x) => `<rect x="${x}" y="64" width="250" height="210" rx="16" fill="white" stroke="${C.line}" stroke-width="3"/>`;
  const causeScene = (focus) => {
    const w = focus === 'w';
    const id = w ? 't32-k1-wonin' : 't32-k1-gyeolgwa';
    let css = base(id);
    let body = '';
    if (w) {
      // 원인 카드: 호랑이 앞에서도 당당한 개미
      body += `<g class="lc">` + at(1, 'fin', card(30));
      body += at(1, 'pop', `<g class="pa">${ant(160, 150, 3.2, -12)}</g>`, 0.3);
      body += `<g class="b1">` + [[70, 96], [250, 100], [66, 196], [252, 200]].map(([x, y], i) => g('fin fin1', `<path d="M${x} ${y} l${x < 160 ? -10 : 10} ${y < 150 ? -8 : 8}" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round"/>`, 0.9 + i * 0.1)).join('') + '</g>';
      body += at(1, 'pop', tile(155, 244, '당당한 개미', { size: 20, h: 40, fill: C.lilac, stroke: C.purple }), 1.1) + '</g>';
      css += pulseCss(id, '.pa', 1, 1.0);
      // 결과 카드: 화가 난 호랑이
      body += drawArrow(288, 170, 350, 170, C.muted, 2, { delay: 0.1 });
      body += `<g class="rc">` + at(2, 'fin', card(360), 0.9);
      body += at(2, 'pop', `<g class="tg">${tiger(485, 146, 0.95, 'angry')}</g>`
        + `<path d="M540 96 l8 -12 M552 108 l13 -6 M530 88 l1 -14" stroke="${C.red}" stroke-width="4.5" stroke-linecap="round"/>`, 1.1);
      body += at(2, 'pop', tile(485, 244, '화가 난 호랑이', { size: 20, h: 40, fill: C.peach, stroke: C.orange }), 1.6) + '</g>';
      css += `.sc-${id} .tg { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .tg { animation: ${id}-shake .5s ease-in-out 1.6s 3; }`;
    } else {
      // 원인 카드: 개미 떼가 호랑이 털 속으로
      body += `<g class="lc">` + at(1, 'fin', card(30));
      body += at(1, 'fin', `<g class="tg">${tiger(155, 142, 0.92, 'plain')}</g>`, 0.1);
      body += at(1, 'pop', tile(155, 244, '개미 떼', { size: 20, h: 40, fill: C.lilac, stroke: C.purple }), 0.2);
      const spots = [[112, 128, -70], [132, 100, -40], [180, 100, 30], [200, 130, 70], [194, 168, 110], [116, 168, -110]];
      spots.forEach(([x, y, r], i) => {
        const sx = 80 + i * 30, sy = 300;
        css += `.sc-${id} .an${i} { transform: translate(${sx - x}px, ${sy - y}px); opacity: 0; transition: transform 1.3s ease-in-out ${(0.5 + i * 0.15).toFixed(2)}s, opacity .3s ease ${(0.5 + i * 0.15).toFixed(2)}s; }
          .on1 .sc-${id} .an${i} { transform: none; opacity: 1; }`;
        body += `<g class="b1"><g class="an${i}">${ant(x, y, 0.75, r)}</g></g>`;
      });
      body += '</g>';
      css += `.sc-${id} .tg { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .tg { animation: ${id}-shake .5s ease-in-out 2.0s 3; }`;
      // 결과 카드: 다른 동물을 괴롭히지 않는 호랑이
      body += drawArrow(288, 170, 350, 170, C.muted, 2, { delay: 0.1 });
      body += `<g class="rc">` + at(2, 'fin', card(360), 0.9);
      body += at(2, 'pop', tiger(448, 146, 0.82, 'calm'), 1.1);
      body += at(2, 'pop', `<g class="rb">${rabbit(556, 166)}</g>`, 1.4);
      body += at(2, 'pop', tile(485, 244, '괴롭히지 않음', { size: 20, h: 40, fill: C.peach, stroke: C.orange }), 1.8) + '</g>';
      css += pulseCss(id, '.rb', 2, 2.0);
    }
    // 칸 3: 거슬러 묻기(원인) / 따라가기(결과)
    if (w) body += curve(485, 58, 155, 58, 24, C.orange, 3, { width: 4.5 }) + at(3, 'pop', tag(320, 28, '왜?', ROLE.y, 20), 0.9);
    else body += curve(155, 58, 485, 58, 24, C.orange, 3, { width: 4.5 }) + at(3, 'pop', tag(320, 28, '그래서', ROLE.y, 20), 0.9);
    const on = w ? 0 : 1;
    body += [['원인', 155], ['결과', 485]].map(([label, x], k) => `<g class="${k === on ? '' : 'dim dim4'}">` + at(3, 'pop', `<g class="ct ct${k}">${tag(x, 318, label, ['white', C.line], 22)}</g>`, 1.4) + '</g>').join('');
    css += paint(id, `.ct${on}`, ROLE.y, 3, 1.6) + pulseCss(id, `.ct${on} .tl`, 4, 0.4);
    css += `.sc-${id} .lc, .sc-${id} .rc { transition: opacity .6s ease; } .on4 .sc-${id} ${on ? '.lc' : '.rc'} { opacity: .3; }`;
    body += glowRect(on ? 356 : 26, 60, 258, 218, 4, C.orange, 0.2, 18);
    put(K + '1/' + (w ? '원인' : '결과'), svg(id, body, css));
  };
  causeScene('w');
  causeScene('g');

  // ── 1단원: 기호(중요·질문·그래서 → ★ ? →, 들은 내용을 적은 쪽지에 붙인다) ──────────────────────────────
  (function () {
    const id = 't32-k1-giho';
    let css = base(id);
    const XS = [130, 320, 510], WY = 54, SY = 142;
    const arrowSym = (x, y, color = C.green) => `<path d="M${x - 22} ${y} H${x + 18}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>` + head(x + 20, y, 0, color, 6);
    const qSym = (x, y) => text(x, y + 16, '?', { size: 46, color: C.blue, weight: 800 });
    const syms = [(x, y) => star(x, y, 24), qSym, arrowSym];
    const words = ['중요', '질문', '그래서'];
    // 칸 1: 말로 쓴 조각 셋 / 칸 2: 조각 아래로 화살표가 내려가 짧은 표시가 생긴다
    let body = '';
    words.forEach((wd, i) => {
      body += `<g class="dim dim3">` + at(1, 'pop', tile(XS[i], WY, wd, { size: 26, h: 54, fill: 'white', stroke: C.line }), 0.2 + i * 0.3)
        + drawArrow(XS[i], WY + 34, XS[i], SY - 34, C.muted, 2, { width: 4, delay: 0.2 + i * 0.4 })
        + at(2, 'pop', syms[i](XS[i], SY), 1.0 + i * 0.4) + '</g>';
    });
    // 칸 3: 들은 내용을 적은 쪽지 — 기호가 날아와 줄 앞에 붙는다
    const NX = 140, NW = 360, LY = [222, 266, 310];
    body += at(3, 'fin', `<rect x="${NX}" y="184" width="${NW}" height="160" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + LY.map((y, k) => `<rect class="nl nl${k}" x="${NX + 74}" y="${y - 6}" width="${k === 1 ? 210 : 250}" height="12" rx="6" fill="${GRAY}"/>`).join(''), 0);
    const order = [[1, 0], [2, 1], [0, 2]]; // [기호 번호, 줄]
    order.forEach(([sn, k], n) => {
      const tx = NX + 38, ty = LY[k];
      css += `.sc-${id} .fy${n} { transform: translate(${XS[sn] - tx}px, ${SY - ty}px); transition: transform 1s ease-in-out ${(0.3 + n * 0.35).toFixed(2)}s; }
        .on3 .sc-${id} .fy${n} { transform: none; }`;
      body += `<g class="b3"><g class="fy${n}">${syms[sn](tx, ty)}</g></g>`;
    });
    css += `.sc-${id} .nl { transition: fill .5s ease 1.6s; } .on3 .sc-${id} .nl2 { fill: ${C.orange}; }`;
    // 칸 4
    body += glowRect(NX + 10, 194, 56, 144, 4, C.orange, 0.1, 14);
    body += at(4, 'pop', tag(570, 266, '기호', ROLE.y, 24), 0.6);
    put(K + '1/기호', svg(id, body, css));
  })();

  // ── 1단원: 간추리다(「우리 지역의 자랑거리」 — 긴 이야기에서 지역과 자랑거리만 쪽지로) ──────────────────────────────
  (function () {
    const id = 't32-k1-ganchu';
    let css = base(id);
    const PX = 28, PW = 282, LY = (k) => 88 + k * 21;
    let body = at(1, 'fin', `<rect x="${PX}" y="18" width="${PW}" height="324" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + person(56, 62, C.blue, 12) + waves(80, 50, C.blue, 'wv1', 0.8), 0);
    const items = [['홍천 옥수수', 1, 120], ['울릉도 오징어', 4, 176], ['전주 한지', 7, 112], ['공주 알밤', 10, 200]];
    let lines = '';
    for (let k = 0; k < 12; k++) {
      const x = PX + 18, wdt = k % 4 === 3 ? 150 : PW - 36;
      lines += `<rect class="ln ln${k} nb" x="${x}" y="${LY(k) - 5}" width="${wdt}" height="10" rx="5" fill="${GRAY}"/>`;
      css += `.sc-${id} .ln${k} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .35s ease-out ${(0.3 + k * 0.1).toFixed(2)}s, opacity .6s ease; }
        .on1 .sc-${id} .ln${k} { transform: none; }`;
    }
    body += `<g class="b1">${lines}</g>`;
    items.forEach(([l, k, cx], i) => {
      body += `<g class="b1"><g class="kc">${g('fin fin1', chip(cx, LY(k), l, ['white', C.line], 18, `ck ck${i}`), 1.0 + k * 0.1)}</g></g>`;
    });
    // 칸 2: 지역과 자랑거리에 표시
    css += items.map((_, i) => paint(id, `.ck${i}`, [TAN, C.orange], 2, 0.2 + i * 0.3)).join('');
    css += items.map((_, i) => `.on2 .sc-${id} .ck${i} { animation: ${id}-flash 1s ease-in-out ${(0.2 + i * 0.3).toFixed(2)}s both; }`).join('');
    // 칸 3: 나머지는 흐려지고 표시한 것만 쪽지로 옮겨 간다
    css += `.on3 .sc-${id} .nb, .on3 .sc-${id} .kc { opacity: .25; transition-delay: 0s; } .sc-${id} .kc { transition: opacity .6s ease; }`;
    const NX = 380, NW = 232, NY = 72;
    body += at(3, 'fin', `<rect x="${NX}" y="${NY}" width="${NW}" height="226" rx="12" fill="white" stroke="${C.orange}" stroke-width="3"/>`, 0.2);
    body += `<g class="b3">${g('fin fin3', arrowR(320, 364, 185, C.muted), 0.2)}</g>`;
    items.forEach(([l, k, cx], i) => {
      const ty = NY + 40 + i * 50, w = Math.round(tw(l, 18) + 14), tx = NX + 22 + w / 2;
      css += `.sc-${id} .mv${i} { transform: translate(${f(cx - tx)}px, ${LY(k) - ty}px); transition: transform 1s ease-in-out ${(0.4 + i * 0.2).toFixed(1)}s; }
        .on3 .sc-${id} .mv${i} { transform: none; }`;
      body += `<g class="b3"><g class="mv${i}">${chip(tx, ty, l, [TAN, C.orange])}</g></g>`;
    });
    // 칸 4: 짧아진 정리
    body += glowRect(NX - 6, NY - 6, NW + 12, 238, 4, C.orange, 0.1, 16);
    body += at(4, 'pop', tag(NX + NW / 2, 330, '간추리다', ROLE.y, 22), 0.5);
    put(K + '1/간추리다', svg(id, body, css));
  })();

  // ── 1단원: 생각그물(가운데 '동물' → 개·고래·나비 → 꼬리·바다·꽃·날개) ──────────────────────────────
  (function () {
    const id = 't32-k1-saenggak';
    let css = base(id);
    const CX = 320, CY = 180;
    const L1 = [['개', 170, 100], ['고래', 470, 100], ['나비', 320, 290]];
    const L2 = [['꼬리', 0, 66, 196], ['바다', 1, 574, 196], ['날개', 2, 160, 300], ['꽃', 2, 480, 300]];
    let body = '';
    // 줄을 먼저 깔고 조각을 위에 얹는다
    body += L1.map(([, x, y], i) => line(CX, CY, x, y, C.green, 2, { width: 4.5, delay: i * 0.3, cls: 'ln' })).join('');
    body += L2.map(([, p, x, y], i) => line(L1[p][1], L1[p][2], x, y, C.blue, 3, { width: 3.5, delay: i * 0.25, cls: 'ln' })).join('');
    body += at(1, 'pop', `<g class="ring ring1"><circle cx="${CX}" cy="${CY}" r="52" fill="none" stroke="${C.green}" stroke-width="4"/></g>`, 0.4);
    body += at(1, 'pop', `<g class="nd nd0">${tile(CX, CY, '동물', { size: 30, h: 64, fill: C.mint, stroke: C.green, sw: 4 })}</g>`, 0);
    body += L1.map(([l, x, y], i) => at(2, 'pop', `<g class="nd nd${i + 1}">${tile(x, y, l, { size: 26, h: 54, fill: 'white', stroke: C.green })}</g>`, 0.8 + i * 0.3)).join('');
    body += L2.map(([l, , x, y], i) => at(3, 'pop', `<g class="nd nd${i + 4}">${tile(x, y, l, { size: 22, h: 46, fill: 'white', stroke: C.blue })}</g>`, 0.8 + i * 0.25)).join('');
    // 칸 4: 그물 전체가 빛난다
    css += `.sc-${id} .ln { transition-property: stroke-dashoffset, stroke; } .on4 .sc-${id} .ln { stroke: ${C.orange}; transition: stroke .5s ease .2s; }`;
    css += [0, 1, 2, 3, 4, 5, 6, 7].map((k) => pulseCss(id, `.nd${k} .tl`, 4, (0.3 + (k === 0 ? 0 : k < 4 ? 0.3 : 0.6)).toFixed(1))).join('');
    body += at(4, 'pop', tag(320, 30, '생각그물', ROLE.y, 22), 1.0);
    put(K + '1/생각그물', svg(id, body, css));
  })();

  // ── 2단원: 발음(글자 '좋아' → 소리 [조아], 'ㅎ' 받침은 소리 나지 않는다) ──────────────────────────────
  // 발음 기관 옆모습(4-2 본뜨다와 같은 그림, 얼굴은 왼쪽을 본다). 120×170 칸 안 좌표.
  const ORG = {
    face: 'M50 4 Q32 8 30 28 L28 42 Q22 52 13 66 L10 72 Q12 78 22 78 Q15 82 17 89 L22 92 L17 95 Q15 102 20 106 Q22 110 26 111 Q18 122 26 132 Q40 140 60 138 L70 170',
    eye: 'M34 44 Q40 40 46 44',
    upTooth: 'M26 81 H33 V88 Q29.5 91 26 88 Z', loTooth: 'M26 104 H33 V98 Q29.5 95 26 98 Z',
    roof: 'M30 84 Q36 74 50 73 L74 73 Q96 74 98 96 L98 170',
    floor: 'M31 104 Q50 116 70 118 Q80 120 82 132 L82 170',
    tongueRest: 'M32 100 Q44 90 62 90 Q84 90 90 106 L88 150 L82 150 L82 132 Q80 120 70 118 Q50 116 32 104 Z'
  };
  const sideView = () => `<path d="${ORG.face}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${ORG.eye}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + `<path d="${ORG.roof}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linejoin="round"/><path d="${ORG.floor}" stroke="${C.ink}" stroke-width="3" fill="none"/>`
    + `<path d="${ORG.upTooth}" fill="white" stroke="${C.ink}" stroke-width="2"/><path d="${ORG.loTooth}" fill="white" stroke="${C.ink}" stroke-width="2"/>`
    + `<path d="${ORG.tongueRest}" fill="${C.peach}" stroke="${C.red}" stroke-width="2.5" stroke-linejoin="round"/>`;
  (function () {
    const id = 't32-k2-bareum';
    let css = base(id);
    // 얼굴을 뒤집어 오른쪽을 보게 한다: 바깥 x = 172 - 안 x
    let body = at(1, 'fin', `<g transform="translate(172 4) scale(-1 1)">${sideView()}</g>`, 0);
    // 칸 1: 책에 적힌 글자 '좋아'를 본다
    body += at(1, 'pop', charTile(330, 56, ['좋', '아'], { size: 38, h: 66, fill: TAN, stroke: C.orange, cls: 'jt' }), 0.3);
    body += `<g class="b1"><path class="draw draw1" pathLength="1" d="M144 48 L262 54" stroke="${C.muted}" stroke-width="3" style="transition-delay:.8s"/></g>`;
    body += `<g class="b1">${g('fin fin1', `<circle cx="144" cy="48" r="4" fill="${C.muted}"/>`, 0.8)}</g>`;
    // 칸 2: 입에서 소리 [조아]
    body += `<g class="b2">${waves(166, 104, C.blue, 'wv2', 1.0)}</g>`;
    body += curve(210, 118, 244, 150, 150, C.blue, 2, { width: 3.5, delay: 0.3 });
    body += at(2, 'pop', `<g class="sd">${tile(330, 152, '[조아]', { size: 34, h: 64, fill: C.sky, stroke: C.blue })}</g>`, 1.0);
    // 칸 3: '좋'의 받침 ㅎ 은 소리 나지 않는다 + 놓아·낳아
    css += `.sc-${id} .jt .ch0 { transition: fill .5s ease .2s; } .on3 .sc-${id} .jt .ch0 { fill: ${C.orange}; }`;
    body += at(3, 'pop', `<g class="hh">${tile(460, 56, 'ㅎ', { size: 28, w: 52, h: 50, fill: 'white', stroke: C.orange })}</g>`, 0.4);
    body += curve(314, 22, 432, 44, 6, C.orange, 3, { width: 3, delay: 0.1 });
    body += at(3, 'pop', cross(492, 32, 10), 1.0);
    css += `.sc-${id} .hh { transform-box: fill-box; transform-origin: center; transition: opacity .6s ease 1.5s; } .on3 .sc-${id} .hh { opacity: .55; }`;
    const ex = [['놓아', '[노아]', 250], ['낳아', '[나아]', 312]];
    ex.forEach(([a, b, y], i) => {
      body += at(3, 'slide', tile(170, y, a, { size: 26, h: 50, fill: TAN, stroke: C.orange }) + arrowR(228, 286, y, C.muted)
        + `<g class="sd">${tile(360, y, b, { size: 26, h: 50, fill: C.sky, stroke: C.blue })}</g>`, 1.5 + i * 0.4);
    });
    // 칸 4: 소리 쪽이 빛난다
    css += pulseCss(id, '.sd', 4, 0.3);
    body += glowRect(242, 112, 176, 80, 4, C.blue, 0.1, 16);
    body += at(4, 'pop', tag(540, 250, '발음', ROLE.s, 24), 0.6);
    put(K + '2/발음', svg(id, body, css));
  })();

  // ── 2단원: 얼개(태권도 발표 자료 — 칸 나눔이 먼저, 내용은 그 위에) ──────────────────────────────
  (function () {
    const id = 't32-k2-eolgae';
    let css = base(id);
    const FX = 52, FW = 404;
    const box = (x, y, w, h, n, delay) => `<g class="b${n}"><path class="draw draw${n} sk" pathLength="1" d="M${x} ${y} H${x + w} V${y + h} H${x} Z" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linejoin="round" style="transition-delay:${delay}s"/></g>`;
    let body = at(1, 'fin', `<rect x="${FX}" y="14" width="${FW}" height="332" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`, 0);
    // 칸 1: 뼈대 — 제목 칸 하나, 그림·이름·설명 칸이 세 줄
    const TB = [76, 30, 356, 50];
    const ROWY = (r) => 98 + r * 82, RH = 68;
    const COL = [[76, 84], [170, 116], [296, 136]];
    body += box(...TB, 1, 0.2);
    for (let r = 0; r < 3; r++) COL.forEach(([x, w], c) => { body += box(x, ROWY(r), w, RH, 1, 0.4 + r * 0.25 + c * 0.08); });
    const lb = [[TB[0] + TB[2] / 2, TB[1] + TB[3] / 2, '제목']];
    for (let r = 0; r < 3; r++) ['그림', '이름', '설명'].forEach((l, c) => lb.push([COL[c][0] + COL[c][1] / 2, ROWY(r) + RH / 2, l]));
    body += `<g class="lb">` + lb.map(([x, y, l], i) => at(1, 'fin', text(x, y + 7, l, { size: 18, color: C.muted, weight: 600 }), 1.0 + i * 0.05)).join('') + '</g>';
    css += `.sc-${id} .lb { transition: opacity .4s ease .1s; } .on2 .sc-${id} .lb { opacity: 0; }`;
    // 칸 2: 글 가를 읽고 칸을 채운다
    const stance = (cx, y0, kind) => {
      const st = `stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
      const hip = y0 + 36, top = y0 + 18;
      const legs = kind === 0 ? `M${cx} ${hip} L${cx + 14} ${y0 + 60} M${cx} ${hip} L${cx - 10} ${y0 + 60}`
        : kind === 1 ? `M${cx} ${hip} L${cx - 16} ${hip + 10} L${cx - 20} ${y0 + 60} M${cx} ${hip} L${cx + 16} ${hip + 10} L${cx + 20} ${y0 + 60}`
          : `M${cx} ${hip} L${cx + 16} ${hip + 8} L${cx + 20} ${y0 + 60} M${cx} ${hip} L${cx - 24} ${y0 + 60}`;
      return `<circle cx="${cx}" cy="${y0 + 10}" r="7" fill="${C.blue}"/><path d="M${cx} ${top} V${hip} M${cx - 13} ${top + 8} L${cx} ${top + 4} L${cx + 13} ${top + 8} ${legs}" ${st}/>`;
    };
    const names = ['앞서기', '주춤서기', '앞굽이 서기'];
    let ct = at(2, 'fin', text(TB[0] + TB[2] / 2, TB[1] + 34, '태권도의 기본자세', { size: 24, color: C.blue }), 0.4);
    for (let r = 0; r < 3; r++) {
      const y = ROWY(r), d = 0.8 + r * 0.35;
      ct += at(2, 'pop', stance(COL[0][0] + COL[0][1] / 2, y + 2, r), d);
      ct += at(2, 'fin', text(COL[1][0] + COL[1][1] / 2, y + RH / 2 + 7, names[r], { size: 19 }), d + 0.1);
      ct += at(2, 'slide', bar(COL[2][0] + 14, y + 24, 108, GRAY, 9) + bar(COL[2][0] + 14, y + 44, 74, GRAY, 9), d + 0.2);
    }
    body += `<g class="ct">${ct}</g>`;
    // 글 가(오른쪽 종이)
    const paper = `<rect x="484" y="104" width="130" height="150" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + [136, 160, 184, 208, 232].map((y, k) => bar(498, y, k === 4 ? 60 : 102, GRAY, 8)).join('');
    body += `<g class="ct">` + at(2, 'pop', paper + tag(549, 84, '글 가', ROLE.s, 18), 0) + drawArrow(478, 180, 462, 180, C.muted, 2, { width: 4, delay: 0.2 }) + '</g>';
    // 칸 3: 내용을 흐리게 하면 뼈대가 드러난다 / 칸 4: 내용이 돌아오고 뼈대가 얼개
    css += `.sc-${id} .ct { transition: opacity .6s ease .2s; } .on3 .sc-${id} .ct { opacity: .12; } .on4 .sc-${id} .ct { opacity: 1; }
      .sc-${id} .sk { transition-property: stroke-dashoffset, stroke; } .on3 .sc-${id} .sk { stroke: ${C.orange}; transition: stroke .5s ease .5s; }`;
    css += glowCss(id, '.sk', 3, 0.8);
    body += at(4, 'pop', tag(549, 300, '얼개', ROLE.y, 24), 0.6);
    body += glowRect(FX - 6, 8, FW + 12, 344, 4, C.orange, 0.2, 16);
    put(K + '2/얼개', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
