// 국어 6-1 낱말 도식(3단원 토론·매체 단원·4단원 관용 표현과 견학 기록문): 말하기 절차·매체 양식·글의 짜임 낱말을 낱말 조각과 그림 조각으로 움직여 보인다.
// 도구(tile·tag·row·curve·base·move 따위)는 figures/4-2/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
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
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange], r: [C.peach, C.red] };
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
  // 그어지는 선(칸 n, 화살촉 없음)
  const drawLine = (d, color, n, { width = 4, delay = 0, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
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
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  // 칸 n 에서 늘어나며 나타나기(scaleX·scaleY), origin 은 fill-box 기준
  const growCss = (id, sel, n, { axis = 'X', origin = 'left center', delay = 0, dur = 0.7 } = {}) => `
    .sc-${id} ${sel} { transform-box: fill-box; transform-origin: ${origin}; transform: scale${axis}(0); transition: transform ${dur}s ease-out ${delay}s; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;

  const K = '6-1/국어/';
  const TAN = '#fdf3d3';
  const bar = (x, y, w, color = '#b5c4be', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14 * r / 18}" r="${r}" fill="${color}"/><path d="M${f(x - r * 1.6)} ${f(y + r * 1.5)} Q${f(x - r * 1.6)} ${y} ${x} ${y} Q${f(x + r * 1.6)} ${y} ${f(x + r * 1.6)} ${f(y + r * 1.5)} Z" fill="${color}"/>`;
  const eye = (x, y, color = C.blue) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`;
  const ear = (x, y, color = C.orange) => `<path d="M${x + 12} ${y + 28} Q${x - 2} ${y + 34} ${x - 6} ${y + 18} Q${x - 20} ${y + 4} ${x - 20} ${y - 10} Q${x - 20} ${y - 34} ${x + 2} ${y - 34} Q${x + 24} ${y - 34} ${x + 24} ${y - 10} Q${x + 24} ${y + 4} ${x + 12} ${y + 12}" fill="${C.peach}" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<path d="M${x - 8} ${y - 8} Q${x - 6} ${y - 22} ${x + 4} ${y - 21} Q${x + 13} ${y - 19} ${x + 10} ${y - 6} Q${x + 6} ${y + 2} ${x} ${y + 2}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  // 하트: 가운데 (x, y), 배율 s(1 이면 폭 80)
  const heartD = (x, y, s = 1) => {
    const P = (a, b) => `${f(x + a * s)} ${f(y + b * s)}`;
    return `M${P(0, 30)} C${P(-40, 2)} ${P(-42, -28)} ${P(-21, -37)} C${P(-9, -42)} ${P(0, -34)} ${P(0, -25)} C${P(0, -34)} ${P(9, -42)} ${P(21, -37)} C${P(42, -28)} ${P(40, 2)} ${P(0, 30)} Z`;
  };
  // 매체 양식 그림 조각: 가운데 (cx, cy) 둘레 약 64×56
  const icon = {
    text: (cx, cy) => `<rect x="${cx - 22}" y="${cy - 28}" width="44" height="56" rx="5" fill="white" stroke="${C.blue}" stroke-width="3"/>` + [-16, -5, 6, 17].map((d, i) => bar(cx - 14, cy + d, i === 3 ? 18 : 28, C.blue, 5)).join(''),
    pic: (cx, cy) => `<rect x="${cx - 30}" y="${cy - 25}" width="60" height="50" rx="5" fill="white" stroke="${C.green}" stroke-width="3"/><path d="M${cx - 26} ${cy + 21} L${cx - 9} ${cy - 2} L${cx + 3} ${cy + 11} L${cx + 12} ${cy + 3} L${cx + 26} ${cy + 21} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${cx + 14}" cy="${cy - 11}" r="6" fill="${C.yellow}"/>`,
    sound: (cx, cy, cls = '') => `<path d="M${cx - 26} ${cy - 9} H${cx - 14} L${cx} ${cy - 22} V${cy + 22} L${cx - 14} ${cy + 9} H${cx - 26} Z" fill="${C.orange}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`
      + `<g class="${cls}"><path d="M${cx + 9} ${cy - 9} Q${cx + 16} ${cy} ${cx + 9} ${cy + 9}" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${cx + 17} ${cy - 18} Q${cx + 30} ${cy} ${cx + 17} ${cy + 18}" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`,
    photo: (cx, cy) => `<rect x="${cx - 12}" y="${cy - 26}" width="24" height="10" rx="3" fill="${C.blue}"/><rect x="${cx - 30}" y="${cy - 18}" width="60" height="42" rx="7" fill="${C.sky}" stroke="${C.purple}" stroke-width="3"/><circle cx="${cx}" cy="${cy + 3}" r="13" fill="white" stroke="${C.purple}" stroke-width="3"/><circle cx="${cx}" cy="${cy + 3}" r="5" fill="${C.purple}"/>`
  };
  // 음표 하나: (x, y) 는 머리 가운데
  const note = (x, y, color = C.purple) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5.5" fill="${color}" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 6} ${y - 1} V${y - 28} Q${x + 14} ${y - 22} ${x + 18} ${y - 14}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  // 관용 표현 상자: 왼쪽 위 (x, y), 폭 220·높이 116, 칸 둘(관용어·속담) — cls 는 칸 조각 이름(.cA 관용어, .cB 속담)
  const idiomBox = (x, y) => `<rect x="${x}" y="${y}" width="220" height="116" rx="14" fill="white" stroke="${C.ink}" stroke-width="3"/>`
    + text(x + 110, y + 31, '관용 표현', { size: 20 })
    + tile(x + 58, y + 80, '관용어', { size: 20, w: 96, h: 52, fill: C.paper, stroke: C.line, cls: 'cA', sw: 2.5, rx: 10 })
    + tile(x + 162, y + 80, '속담', { size: 20, w: 96, h: 52, fill: C.paper, stroke: C.line, cls: 'cB', sw: 2.5, rx: 10 });

  // ── 3단원: 토론(찬성 편과 반대 편이 절차를 따라 번갈아 말한다) ──────────────────────────────
  (function () {
    const id = 't61-k2-toron';
    let css = base(id);
    let body = at(1, 'fin', tag(229, 34, '주제', ROLE.p, 19) + text(273, 41, '누리 소통망과 우정', { size: 20, anchor: 'start' }));
    body += at(1, 'pop', person(84, 168, C.blue, 20), 0.3) + at(1, 'pop', tag(84, 226, '찬성 편', ROLE.s, 19), 0.5);
    body += at(1, 'pop', person(556, 168, C.orange, 20), 0.6) + at(1, 'pop', tag(556, 226, '반대 편', ROLE.o, 19), 0.8);
    // 말풍선(꼬리가 말하는 사람 쪽)
    const bubble = (x, y, side, [fill, stroke]) => {
      const w = 130, h = 64, tx = side === 'l' ? x : x + w, dir = side === 'l' ? -1 : 1;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
        + `<path d="M${tx - dir * 2} ${y + h - 34} L${tx + dir * 24} ${y + h + 6} L${tx - dir * 2} ${y + h - 14}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
        + bar(x + 18, y + 18, w - 36, stroke, 7) + bar(x + 18, y + 32, w - 50, stroke, 7) + bar(x + 18, y + 46, w - 72, stroke, 7);
    };
    body += `<g class="bL">` + at(2, 'pop', bubble(140, 82, 'l', ROLE.s), 0.3) + '</g>';
    body += `<g class="bR">` + at(2, 'pop', bubble(370, 82, 'r', ROLE.o), 1.1) + '</g>';
    css += `.sc-${id} .bL, .sc-${id} .bR { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .bR { animation: ${id}-pulse .5s ease-in-out .3s 2; }
      .on3 .sc-${id} .bL { animation: ${id}-pulse .5s ease-in-out 1.1s 2; }`;
    // 절차 띠
    const steps = row(['주장 펼치기', '반론하기', '주장 다지기', '판정하기'], { y: 304, size: 20, gap: 30 });
    body += steps.map((p, i) => at(1, 'rise', `<g class="st st${i}">${T(p, { h: 46 })}</g>`, 1.0 + i * 0.15)).join('');
    body += at(1, 'fin', steps.slice(0, 3).map((p, i) => arrow(p.r + 5, 304, steps[i + 1].l - 5, 304, C.muted, '', 3)).join(''), 1.6);
    css += paint(id, '.st0', ROLE.p, 2, 0.1) + paint(id, '.st1', ROLE.p, 3, 0.3) + paint(id, '.st2', ROLE.p, 3, 0.95) + paint(id, '.st3', ROLE.p, 3, 1.55);
    // 차례 표시 점
    const d = steps.map((p) => f(p.cx - steps[0].cx));
    body += `<g class="b2"><g class="mk"><circle cx="${f(steps[0].cx)}" cy="268" r="9" fill="${C.green}"/></g></g>`;
    css += `@keyframes ${id}-hop { 0% { transform: none; } 15%, 40% { transform: translateX(${d[1]}px); } 55%, 75% { transform: translateX(${d[2]}px); } 90%, 100% { transform: translateX(${d[3]}px); } }
      .on3 .sc-${id} .mk { animation: ${id}-hop 1.8s ease-in-out .1s both; }`;
    // 판정단
    body += [290, 320, 350].map((x, i) => at(3, 'pop', person(x, 214, C.purple, 10), 1.5 + i * 0.1)).join('');
    body += glowRect(steps[0].l - 8, 276, steps[3].r - steps[0].l + 16, 56, 4, C.green, 0.2) + at(4, 'pop', tag(320, 113, '토론', ROLE.p, 22), 0.6);
    put(K + '3/토론', svg(id, body, css));
  })();

  // ── 3단원: 반론(상대 근거의 빈틈을 겨누는 화살표) ──────────────────────────────
  (function () {
    const id = 't61-k2-ballon';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M90 272 H320" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`);
    body += at(1, 'pop', tag(48, 70, '주장', ROLE.o, 19), 0.2) + at(1, 'pop', tag(48, 186, '근거', ROLE.o, 19), 0.6);
    body += `<g class="pl">` + at(1, 'rise', `<rect x="130" y="102" width="140" height="170" rx="6" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>`
      + text(200, 140, '교육', { size: 20 }) + text(200, 166, '전문가의 말', { size: 20 }), 0.5)
      + drawLine('M204 270 L188 248 L212 228 L192 206 L208 184', C.red, 3, { width: 4, delay: 0.3 }) + '</g>';
    body += at(1, 'pop', tag(200, 302, '반대 편', ROLE.o, 19), 0.8);
    body += `<g class="cl">` + at(1, 'drop', tile(200, 72, '우정에 방해', { size: 22, h: 56, fill: C.peach, stroke: C.orange }), 1) + '</g>';
    body += at(1, 'pop', person(546, 196, C.blue, 22), 0.3) + at(1, 'pop', tag(546, 262, '찬성 편', ROLE.s, 19), 0.5);
    // 칸 2: 근거를 겨누는 화살표와 물음
    body += drawArrow(490, 184, 288, 184, C.blue, 2, { width: 5, delay: 0.2 }) + at(2, 'pop', tag(392, 150, '누구?', ROLE.s, 20), 1.1);
    // 칸 3: 빈틈이 드러나고 근거가 흔들린다
    body += at(3, 'pop', tag(340, 238, '빈틈', ROLE.r, 20), 1.0);
    css += `.on3 .sc-${id} .pl { animation: ${id}-shake .45s ease-in-out 1.2s 2; }
      .sc-${id} .cl { transform-box: fill-box; transform-origin: right bottom; transition: transform .7s ease-in 1.6s; }
      .on3 .sc-${id} .cl { transform: rotate(-9deg) translateY(4px); }`;
    body += glowRect(282, 128, 220, 76, 4, C.blue, 0.2) + at(4, 'pop', tag(392, 320, '반론', ROLE.s, 22), 0.6);
    put(K + '3/반론', svg(id, body, css));
  })();

  // ── 3단원: 충분성(근거 기둥이 넉넉해야 주장이 반듯하게 선다) ──────────────────────────────
  (function () {
    const id = 't61-k2-chungbun';
    let css = base(id);
    const P = [[130, '2021', '156'], [210, '2022', '160'], [290, '2023', '180'], [370, '2024', '297']];
    let body = at(1, 'fin', `<path d="M70 290 H450" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`);
    const pillar = (x, num) => `<rect x="${x - 28}" y="132" width="56" height="158" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + text(x, 218, num, { size: 20, color: C.blue });
    P.forEach(([x, yr, num], i) => {
      if (i === 3) {
        body += at(1, 'rise', pillar(x, num), 0.2) + at(1, 'fin', text(x, 316, yr, { size: 18, color: C.muted }) + text(x, 340, '1~7월', { size: 18, color: C.muted }), 0.3);
      } else {
        body += `<g class="b2"><g class="pr pr${i}">${pillar(x, num)}</g></g>` + at(2, 'fin', text(x, 316, yr, { size: 18, color: C.muted }), 0.3 + i * 0.3);
      }
    });
    css += [0, 1, 2].map((i) => growCss(id, `.pr${i}`, 2, { axis: 'Y', origin: 'center bottom', delay: 0.2 + i * 0.3, dur: 0.6 })).join('');
    // 주장 판: 칸 1에 기둥 하나 위에서 기울고, 칸 2에 반듯해진다
    body += `<g class="sl">` + at(1, 'fin', `<rect x="90" y="92" width="320" height="40" rx="8" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(250, 120, '주장', { size: 22, color: C.green }), 0.4) + '</g>';
    css += `.sc-${id} .sl { transform-box: view-box; transform-origin: 370px 132px; transition: transform .9s cubic-bezier(.5,1.6,.6,1) .9s; }
      .on1 .sc-${id} .sl { transform: rotate(-8deg); }
      .on2 .sc-${id} .sl { transform: none; transition: transform .8s ease-out 1.3s; }`;
    // 넉넉함 눈금
    body += at(1, 'fin', `<defs><clipPath id="${id}-cp"><rect x="526" y="90" width="28" height="194" rx="14"/></clipPath></defs>`
      + `<rect x="520" y="84" width="40" height="206" rx="20" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<g clip-path="url(#${id}-cp)"><rect class="gf" x="526" y="90" width="28" height="194" fill="${C.orange}"/></g>`
      + text(540, 314, '모자람', { size: 18, color: C.muted }), 0.5);
    body += `<g class="h3">` + at(1, 'fin', text(540, 70, '넉넉함', { size: 18, color: C.muted }), 0.5) + '</g>';
    body += at(3, 'pop', `<g class="nk">${tag(540, 64, '넉넉함', ROLE.p, 19)}</g>`, 0.3);
    css += `.sc-${id} .gf { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform 1s ease-out 1s, fill .6s ease 1s; }
      .on1 .sc-${id} .gf { transform: scaleY(.22); }
      .on2 .sc-${id} .gf { transform: none; fill: ${C.green}; transition-delay: 1.3s; }` + pulseCss(id, '.nk .tl', 3, 0.8);
    body += glowRect(80, 82, 340, 214, 3, C.green, 0.4) + at(3, 'pop', tag(250, 46, '충분성', ROLE.p, 22), 1);
    put(K + '3/충분성', svg(id, body, css));
  })();

  // ── 3단원: 통계(센 수가 표로 모이고 막대그래프가 된다) ──────────────────────────────
  (function () {
    const id = 't61-k2-tonggye';
    let css = base(id);
    const R = [['2021', 156, 110], ['2022', 160, 165], ['2023', 180, 220], ['2024(1~7월)', 297, 275]];
    let body = at(1, 'fin', text(90, 66, '연도', { size: 18, color: C.muted }));
    R.forEach(([yr, v, y], i) => {
      body += at(1, 'fin', text(90, y + 7, yr, { size: 18 }), 0.2 + i * 0.1);
      const n = Math.round(v / 20);
      const dots = Array.from({ length: n }, (_, k) => `<circle cx="${174 + k * 9}" cy="${y}" r="4" fill="${C.orange}"/>`).join('');
      body += `<g class="h2"><g class="dt dt${i}">` + `<g class="b1">${g('pop pop1', dots, 0.5 + i * 0.35)}</g>` + '</g></g>';
      body += at(2, 'pop', text(208, y + 7, v, { size: 20, color: C.orange }), 0.6 + i * 0.15);
    });
    css += `.sc-${id} .dt { transform-box: fill-box; transform-origin: left center; transition: transform .5s ease-in; }
      .on2 .sc-${id} .dt { transform: scaleX(.1); }`;
    // 칸 2: 표 틀
    body += drawLine('M18 36 H254 V302 H18 Z M162 36 V302 M18 82 H254 M18 137 H254 M18 192 H254 M18 247 H254', C.ink, 2, { width: 2.5 });
    body += at(2, 'fin', text(208, 66, '건수', { size: 18, color: C.muted }), 0.4) + at(2, 'pop', tag(140, 330, '표', ROLE.y, 20), 1.2);
    // 칸 3: 막대그래프
    body += at(3, 'fin', `<path d="M290 82 V302" stroke="${C.ink}" stroke-width="3"/>`);
    R.forEach(([, v, y], i) => {
      const w = f(v * 300 / 297);
      body += `<g class="b3"><g class="br br${i}"><rect x="290" y="${y - 14}" width="${w}" height="28" rx="3" fill="${C.blue}"/></g></g>`;
      css += growCss(id, `.br${i}`, 3, { delay: 0.2 + i * 0.25, dur: 0.7 });
      body += at(3, 'fin', text(f(290 + w + 6), y + 7, v, { size: 18, anchor: 'start', color: C.blue }), 1 + i * 0.25);
    });
    body += at(3, 'pop', tag(440, 330, '그래프', ROLE.s, 20), 1.4);
    body += glowRect(10, 28, 622, 282, 4, C.green, 0.2) + at(4, 'pop', tag(440, 52, '통계', ROLE.p, 22), 0.6);
    put(K + '3/통계', svg(id, body, css));
  })();

  // ── 3단원: 겹받침(받침 자리에 자음 둘 — 맑다[막따]) ──────────────────────────────
  (function () {
    const id = 't61-k2-gyeop';
    let css = base(id);
    // 글자 통째: 칸 1에 나타났다가 풀린다
    let body = `<g class="b1"><g class="wh">${text(130, 184, '맑', { size: 150 })}</g></g>`;
    css += `@keyframes ${id}-whole { 0% { opacity: 0; transform: scale(.4); } 15% { opacity: 1; transform: scale(1); } 45% { opacity: 1; transform: scale(1); } 65%, 100% { opacity: 0; transform: scale(1.06); } }
      .sc-${id} .wh { opacity: 0; transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .wh { animation: ${id}-whole 1.9s ease-in-out both; }`;
    body += at(1, 'fin', `<rect x="32" y="132" width="196" height="96" rx="6" fill="${C.peach}"/>`, 1.3);
    body += at(1, 'fin', `<rect x="30" y="30" width="200" height="200" rx="8" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M30 130 H230 M130 30 V230" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 1.0);
    body += at(1, 'pop', text(80, 103, 'ㅁ', { size: 64 }), 1.0) + at(1, 'pop', text(180, 103, 'ㅏ', { size: 64 }), 1.1);
    body += `<g class="jr">` + at(1, 'pop', text(80, 203, 'ㄹ', { size: 64, color: C.orange }), 1.3) + '</g>';
    body += `<g class="jg">` + at(1, 'pop', text(180, 203, 'ㄱ', { size: 64, color: C.orange }), 1.4) + '</g>';
    body += at(1, 'pop', tag(130, 262, '받침 자리', ROLE.o, 19), 1.6);
    // 칸 2: ㄹ 은 쉬고 ㄱ 만 소리 난다
    css += `.sc-${id} .jr { transition: opacity .6s ease 1s; } .on2 .sc-${id} .jr { opacity: .25; }
      .on2 .sc-${id} .jg { animation: ${id}-pulse .6s ease-in-out 1.2s 2; transform-box: fill-box; transform-origin: center; }`;
    body += `<g class="b2"><circle class="ring ring2" cx="180" cy="180" r="38" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:1.1s"/></g>`;
    const line = (n, y, jamo, word, pron, d) =>
      at(n, 'pop', tile(290, y, jamo, { size: 48, w: 64, h: 48, rx: 23, fill: C.peach, stroke: C.orange, sw: 2.5 }), d) + at(n, 'rise', tile(372, y, word, { size: 26, h: 52 }), d + 0.2)
      + drawArrow(420, y, 458, y, C.muted, n, { width: 4, delay: d + 0.4 })
      + at(n, 'pop', tile(530, y, pron, { size: 26, h: 52, fill: C.mint, stroke: C.green }), d + 1.0);
    body += line(2, 80, 'ㄺ', '맑다', '[막따]', 0.1);
    body += line(3, 170, 'ㄻ', '삶지', '[삼ː찌]', 0.1) + line(3, 260, 'ㄿ', '읊다', '[읍따]', 0.7);
    body += glowRect(26, 126, 208, 108, 4, C.orange, 0.2, 10) + at(4, 'pop', tag(130, 314, '겹받침', ROLE.o, 22), 0.6);
    put(K + '3/겹받침', svg(id, body, css));
  })();

  // ── 매체 단원: 양식(한 소식을 담는 여러 꼴 — 글·그림·소리·사진) ──────────────────────────────
  const card = (cx, cy, kind, label, color, w = 150, h = 110) =>
    `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="14" fill="white" stroke="${color}" stroke-width="3"/>`
    + icon[kind](cx, cy - 14) + text(cx, cy + h / 2 - 14, label, { size: 20 });
  (function () {
    const id = 't61-k2-yangsik';
    let css = base(id);
    let body = at(1, 'pop', `<rect x="236" y="126" width="168" height="108" rx="14" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<circle class="bulb" cx="320" cy="160" r="19" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><rect x="311" y="180" width="18" height="10" rx="3" fill="${C.muted}"/>`
      + text(320, 220, '불 끄기 행사', { size: 20 }));
    body += `<g class="b1"><g class="ray">` + [[-34, -10, -44, -14], [34, -10, 44, -14], [-26, -32, -34, -40], [26, -32, 34, -40]].map(([a, b, c, d]) => `<path d="M${320 + a} ${160 + b} L${320 + c} ${160 + d}" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>`).join('') + '</g></g>';
    css += `.sc-${id} .bulb { transition: fill .6s ease 1.2s; } .on1 .sc-${id} .bulb { fill: white; }
      .sc-${id} .ray { transition: opacity .6s ease 1.2s; } .on1 .sc-${id} .ray { opacity: 0; }`;
    const C4 = [[110, 85, 'text', '글', C.blue, [240, 140, 190, 110]], [530, 85, 'pic', '그림', C.green, [400, 140, 450, 110]],
      [110, 275, 'sound', '소리', C.orange, [240, 222, 190, 250]], [530, 275, 'photo', '사진', C.purple, [400, 222, 450, 250]]];
    C4.forEach(([x, y, k, label, col, [x1, y1, x2, y2]], i) => {
      body += drawArrow(x1, y1, x2, y2, col, 2, { width: 4, delay: 0.1 + i * 0.4 });
      body += `<g class="cd cd${i}">` + at(2, 'pop', card(x, y, k, label, col), 0.7 + i * 0.4) + '</g>';
      css += pulseCss(id, `.cd${i}`, 3, 0.2 + i * 0.35);
    });
    body += at(3, 'pop', tag(320, 296, '양식', ROLE.p, 24), 1.6);
    put(K + 'media/양식', svg(id, body, css));
  })();

  // ── 매체 단원: 단일양식(라디오 뉴스는 소리만, 안내문은 글만) ──────────────────────────────
  (function () {
    const id = 't61-k2-danil';
    let css = base(id);
    const kinds = ['글', '그림', '소리', '사진'], xs = [220, 308, 396, 484];
    const slots = (y, n) => kinds.map((k, i) => `<g class="s${n}${i}">${tile(xs[i], y, k, { size: 22, w: 76, h: 50, fill: 'white', stroke: C.line, sw: 2.5, dash: '7 5', color: C.muted })}</g>`).join('');
    // 줄 A: 라디오
    const radio = `<rect x="40" y="78" width="80" height="50" rx="9" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><circle cx="62" cy="103" r="13" fill="white" stroke="${C.blue}" stroke-width="3"/>`
      + bar(84, 94, 26, C.blue, 5) + bar(84, 106, 26, C.blue, 5) + `<path d="M104 78 L116 52" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>`;
    let body = at(1, 'pop', radio) + at(1, 'pop', tag(80, 156, '라디오 뉴스', ROLE.s, 18), 0.2);
    body += `<g class="b1"><g class="wv">` + [10, 20].map((r) => `<path d="M${126 + r * 0.4} ${103 - r} Q${126 + r * 1.2} 103 ${126 + r * 0.4} ${103 + r}" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('') + '</g></g>';
    css += `.on1 .sc-${id} .wv { animation: ${id}-flash 1.4s ease-in-out .4s 2; }`;
    body += at(1, 'fin', slots(103, 'a'), 0.4);
    css += paint(id, '.sa2', ROLE.o, 1, 1.0) + `.sc-${id} .sa2 .tx { transition: fill .5s ease 1s; } .on1 .sc-${id} .sa2 .tx { fill: ${C.ink}; }` + `.on1 .sc-${id} .sa2 .bg { stroke-dasharray: none; }` + pulseCss(id, '.sa2', 1, 1.3);
    // 줄 B: 안내문
    const notice = `<rect x="50" y="208" width="60" height="70" rx="5" fill="white" stroke="${C.blue}" stroke-width="3"/><circle cx="80" cy="208" r="6" fill="${C.red}"/>`
      + [226, 240, 254, 266].map((y, i) => bar(60, y, i === 3 ? 24 : 40, C.blue, 5)).join('');
    body += at(2, 'pop', notice) + at(2, 'pop', tag(80, 304, '안내문', ROLE.s, 18), 0.2);
    body += at(2, 'fin', slots(243, 'b'), 0.4);
    css += paint(id, '.sb0', ROLE.s, 2, 1.0) + `.sc-${id} .sb0 .tx { transition: fill .5s ease 1s; } .on2 .sc-${id} .sb0 .tx { fill: ${C.ink}; }` + `.on2 .sc-${id} .sb0 .bg { stroke-dasharray: none; }` + pulseCss(id, '.sb0', 2, 1.3);
    // 칸 3: 한 가지
    const one = (y) => `<circle cx="578" cy="${y}" r="38" fill="white" stroke="${C.green}" stroke-width="3"/>` + text(578, y + 8, '1가지', { size: 20, color: C.green });
    body += at(3, 'pop', one(103), 0.2) + at(3, 'pop', one(243), 0.6);
    body += glowRect(176, 70, 352, 66, 3, C.orange, 1.0, 12) + glowRect(176, 210, 352, 66, 3, C.blue, 1.2, 12);
    body += at(3, 'pop', tag(352, 334, '단일양식', ROLE.p, 22), 1.6);
    put(K + 'media/단일양식', svg(id, body, css));
  })();

  // ── 매체 단원: 복합양식(글·그림·사진·소리 조각이 한 화면에 묶인다) ──────────────────────────────
  (function () {
    const id = 't61-k2-bokhap';
    let css = base(id);
    let body = at(2, 'fin', `<rect x="160" y="36" width="320" height="240" rx="14" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`);
    const P = [[245, 101, 'text', '글', C.blue, [-155, -11]], [395, 101, 'pic', '그림', C.green, [155, -11]],
      [245, 211, 'photo', '사진', C.purple, [-155, 39]], [395, 211, 'sound', '소리', C.orange, [155, 39]]];
    P.forEach(([x, y, k, label, col, [dx, dy]], i) => {
      body += `<g class="pc pc${i}">` + at(1, 'pop', card(x, y, k, label, col, 140, 100), 0.2 + i * 0.25) + '</g>';
      css += move(id, `pc${i}`, `translate(${dx}px, ${dy}px)`, 2, { dur: 0.9, delay: 0.5 + i * 0.25 });
    });
    // 칸 3: 화면이 흘러간다(진행 막대)
    body += at(3, 'fin', `<rect x="160" y="294" width="320" height="10" rx="5" fill="${C.line}"/>`);
    body += `<g class="b3"><g class="pg"><rect x="160" y="294" width="320" height="10" rx="5" fill="${C.green}"/></g></g>`;
    css += growCss(id, '.pg', 3, { delay: 0.2, dur: 2 });
    css += [0, 1, 2, 3].map((i) => pulseCss(id, `.pc${i} .pop`, 3, 0.3 + i * 0.3)).join('');
    body += glowRect(154, 30, 332, 252, 3, C.green, 1.4, 18) + at(3, 'pop', tag(320, 336, '복합양식', ROLE.p, 22), 1.6);
    put(K + 'media/복합양식', svg(id, body, css));
  })();

  // ── 매체 단원: 줄거리판(장면 칸이 번호 차례로 놓인 계획표) ──────────────────────────────
  (function () {
    const id = 't61-k2-julgeori';
    let css = base(id);
    const cols = [210, 370, 531];
    let body = drawLine('M130 30 H612 V302 H130 Z M290 30 V302 M451 30 V302 M130 70 H612 M130 170 H612 M130 250 H612', C.ink, 1, { width: 2.5 });
    body += [['번호', 56], ['장면 그림', 126], ['장면 설명', 216], ['효과음', 282]].map(([l, y], i) => at(1, 'fin', text(66, y, l, { size: 18, color: C.muted }), 0.3 + i * 0.15)).join('');
    body += cols.map((x, i) => `<g class="nb nb${i}">` + at(1, 'pop', `<circle cx="${x}" cy="50" r="15" fill="${C.green}"/>` + text(x, 57, i + 1, { size: 18, color: 'white' }), 0.9 + i * 0.25) + '</g>').join('');
    // 칸 2: 장면 그림과 설명
    const stairs = (x) => `<path d="M${x} 118 H${x + 20} V132 H${x + 40} V146 H${x + 60} V160" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
    const phone = (x, y) => `<rect x="${x}" y="${y}" width="12" height="19" rx="2" fill="${C.ink}"/>`;
    const pics = [
      `<rect x="${cols[0] + 26}" y="82" width="34" height="80" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="${cols[0] + 52}" cy="124" r="3" fill="${C.orange}"/>` + person(cols[0] - 24, 146, C.blue, 14) + phone(cols[0] - 9, 126),
      person(cols[1] - 44, 146, C.blue, 14) + phone(cols[1] - 29, 126) + stairs(cols[1] + 4),
      person(cols[2] - 38, 146, C.blue, 14) + stairs(cols[2] + 4) + text(cols[2] - 6, 112, '!', { size: 32, color: C.red })
    ];
    pics.forEach((p, i) => { body += at(2, 'pop', p, 0.2 + i * 0.5); });
    cols.forEach((x, i) => {
      body += `<g class="b2"><g class="ds ds${i}">` + [192, 210, 228].map((y, k) => bar(x - 62, y, k === 2 ? 76 : 124, '#a9bab3', 8)).join('') + '</g></g>';
      css += growCss(id, `.ds${i}`, 2, { delay: 0.5 + i * 0.5, dur: 0.6 });
    });
    // 칸 3: 효과음·배경 음악, 차례 화살표
    body += at(3, 'pop', note(cols[0] - 14, 284) + note(cols[0] + 14, 280), 0.2) + at(3, 'pop', note(cols[1], 282), 0.5);
    const bx = cols[2];
    body += at(3, 'pop', `<path d="M${bx - 14} 284 Q${bx - 14} 262 ${bx} 260 Q${bx + 14} 262 ${bx + 14} 284 L${bx + 18} 288 H${bx - 18} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${bx}" cy="293" r="4" fill="${C.orange}"/>`
      + `<path d="M${bx - 26} 266 Q${bx - 32} 276 ${bx - 26} 286 M${bx + 26} 266 Q${bx + 32} 276 ${bx + 26} 286" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`, 0.8);
    body += drawArrow(150, 324, 598, 324, C.green, 3, { width: 4, delay: 1.0 });
    css += [0, 1, 2].map((i) => pulseCss(id, `.nb${i}`, 3, 1.1 + i * 0.3)).join('');
    body += glowRect(124, 24, 494, 284, 4, C.green, 0.2, 10) + at(4, 'pop', tag(66, 330, '줄거리판', ROLE.p, 20), 0.6);
    put(K + 'media/줄거리판', svg(id, body, css));
  })();

  // ── 매체 단원: 편집(장면 조각을 고르고 자르고 차례대로 이어 붙인다) ──────────────────────────────
  (function () {
    const id = 't61-k2-pyeonjip';
    let css = base(id);
    const clip = (cx, cy, inner, fill) => `<rect x="${cx - 60}" y="${cy - 48}" width="120" height="96" rx="4" fill="${C.muted}"/>`
      + [0, 1, 2, 3, 4, 5].map((k) => `<rect x="${cx - 55 + k * 19}" y="${cy - 43}" width="10" height="8" rx="2" fill="white"/><rect x="${cx - 55 + k * 19}" y="${cy + 35}" width="10" height="8" rx="2" fill="white"/>`).join('')
      + `<rect x="${cx - 50}" y="${cy - 30}" width="100" height="60" rx="3" fill="${fill}"/>` + inner;
    const num = (cx, n, col) => text(cx, 132, n, { size: 34, color: col });
    const CL = [[110, '2', C.peach, C.orange], [390, '3', C.mint, C.green], [530, '1', C.sky, C.blue]];
    let body = '';
    CL.forEach(([x, n, fill, col], i) => { body += `<g class="cp cp${n}">` + at(1, 'rise', clip(x, 120, num(x, n, col), fill), 0.2 + i * 0.25) + '</g>'; });
    const blur = clip(250, 120, [100, 114, 128, 142].map((y) => `<path d="M210 ${y} q10 -6 20 0 t20 0 t20 0 t20 0" stroke="${C.purple}" stroke-width="3" fill="none" opacity=".6"/>`).join(''), C.lilac);
    body += `<g class="bz">` + at(1, 'rise', blur, 0.45) + '</g>';
    // 칸 2: 가위로 흐린 조각을 잘라 낸다
    const scissors = (x, y) => `<circle cx="${x - 9}" cy="${y + 14}" r="7" fill="white" stroke="${C.red}" stroke-width="3"/><circle cx="${x + 9}" cy="${y + 14}" r="7" fill="white" stroke="${C.red}" stroke-width="3"/><path d="M${x - 5} ${y + 8} L${x + 7} ${y - 16} M${x + 5} ${y + 8} L${x - 7} ${y - 16}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/>`;
    body += `<g class="h3">` + at(2, 'pop', scissors(180, 40) + scissors(320, 40), 0.1)
      + drawLine('M180 62 V178 M320 62 V178', C.red, 2, { width: 3, delay: 0.4 }) + '</g>';
    css += `.sc-${id} .bz { transition: transform .9s ease-in 1.3s, opacity .9s ease 1.3s; } .on2 .sc-${id} .bz { transform: translateY(140px); opacity: 0; }`;
    // 칸 3: 차례에 맞게 옮겨 이어 붙인다
    css += `.sc-${id} .cp2, .sc-${id} .cp3 { transition: transform 1s ease-in-out .3s; }
      .on3 .sc-${id} .cp2 { transform: translateX(210px); }
      .on3 .sc-${id} .cp3 { transform: translateX(50px); }
      @keyframes ${id}-c1 { 0% { transform: none; } 25% { transform: translate(0, 140px); } 75% { transform: translate(-330px, 140px); } 100% { transform: translate(-330px, 0); } }
      .on3 .sc-${id} .cp1 { animation: ${id}-c1 1.9s ease-in-out .1s both; }`;
    // 칸 4: 자막과 배경 음악
    body += at(4, 'fin', text(128, 256, '자막', { size: 18, anchor: 'end', color: C.muted }) + text(128, 306, '음악', { size: 18, anchor: 'end', color: C.muted }), 0.2);
    body += `<g class="b4"><g class="tk tk0"><rect x="140" y="236" width="250" height="28" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>${bar(154, 250, 70, C.orange, 7)}${bar(234, 250, 50, C.orange, 7)}${bar(294, 250, 80, C.orange, 7)}</g></g>`;
    body += `<g class="b4"><g class="tk tk1"><rect x="140" y="286" width="360" height="28" rx="6" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/><path d="M150 300 q10 -9 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="${C.purple}" stroke-width="3" fill="none"/></g></g>`;
    css += growCss(id, '.tk0', 4, { delay: 0.3, dur: 0.7 }) + growCss(id, '.tk1', 4, { delay: 0.7, dur: 0.9 });
    body += glowRect(134, 66, 372, 108, 4, C.green, 1.2, 8) + at(4, 'pop', tag(572, 266, '편집', ROLE.p, 22), 1.4);
    put(K + 'media/편집', svg(id, body, css));
  })();

  // ── 매체 단원: 자막(화면 아래에 글줄이 뜬다) ──────────────────────────────
  (function () {
    const id = 't61-k2-jamak';
    let css = base(id);
    let body = `<defs><clipPath id="${id}-sc"><rect x="70" y="16" width="500" height="264" rx="12"/></clipPath></defs>`;
    let scene = `<rect x="70" y="16" width="500" height="264" fill="${C.sky}"/><rect x="70" y="210" width="500" height="70" fill="${C.mint}"/>`
      + `<path d="M470 140 V210" stroke="${C.muted}" stroke-width="4"/><circle cx="470" cy="136" r="14" fill="white" stroke="${C.blue}" stroke-width="3"/>` + bar(462, 136, 16, C.blue, 5)
      + person(420, 186, C.purple, 15);
    const bus = `<rect x="120" y="150" width="140" height="56" rx="10" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`
      + [134, 166, 198, 230].map((x) => `<rect x="${x}" y="160" width="22" height="18" rx="3" fill="white" stroke="${C.orange}" stroke-width="2"/>`).join('')
      + `<circle cx="150" cy="208" r="10" fill="${C.ink}"/><circle cx="230" cy="208" r="10" fill="${C.ink}"/>`;
    scene += `<g class="bus2"><g class="bus">${bus}</g></g>`;
    body += at(1, 'fin', `<g clip-path="url(#${id}-sc)">${scene}</g><rect x="70" y="16" width="500" height="264" rx="12" fill="none" stroke="${C.ink}" stroke-width="4"/>`);
    css += `@keyframes ${id}-bus { from { transform: translateX(-160px); } to { transform: none; } }
      .on1 .sc-${id} .bus { animation: ${id}-bus 2s ease-out both; }
      .sc-${id} .bus2 { transition: transform 1.1s ease-in .1s; } .on3 .sc-${id} .bus2 { transform: translateX(-300px); }`;
    // 진행 막대와 재생 점
    body += at(1, 'fin', `<rect x="70" y="296" width="500" height="8" rx="4" fill="${C.line}"/>`) + `<g class="b1"><g class="ph"><circle cx="80" cy="300" r="9" fill="${C.green}"/></g></g>`;
    css += `.sc-${id} .ph { transition: transform 1.6s linear .2s; }
      .on1 .sc-${id} .ph { transform: translateX(110px); } .on2 .sc-${id} .ph { transform: translateX(220px); } .on3 .sc-${id} .ph { transform: translateX(380px); }`;
    // 칸 2: 첫 장면 제목 자막
    body += `<g class="h3">` + at(2, 'pop', `<text x="320" y="104" text-anchor="middle" font-size="42" font-weight="800" fill="${C.ink}" stroke="white" stroke-width="6" paint-order="stroke">다 함께 5초만</text>`, 0.4) + '</g>';
    // 칸 3: 아래 글줄(말이 바뀌면 글줄도 바뀐다)
    const strip = (cls, ws) => {
      let x = 170, s = '';
      ws.forEach((w) => { s += bar(x, 252, w, C.ink, 9); x += w + 14; });
      return `<g class="${cls}"><rect x="150" y="234" width="340" height="36" rx="8" fill="white" stroke="${C.line}" stroke-width="2"/>${s}</g>`;
    };
    body += `<g class="b3">${strip('sA', [56, 90, 48, 84])}${strip('sB', [80, 60, 110])}</g>`;
    css += `@keyframes ${id}-a { 0% { opacity: 0; } 12%, 55% { opacity: 1; } 65%, 100% { opacity: 0; } }
      @keyframes ${id}-b { 0%, 58% { opacity: 0; } 70%, 100% { opacity: 1; } }
      .sc-${id} .sA, .sc-${id} .sB { opacity: 0; }
      .on3 .sc-${id} .sA { animation: ${id}-a 2.2s ease both; }
      .on3 .sc-${id} .sB { animation: ${id}-b 2.2s ease both; }`;
    body += `<g class="b3"><g class="talk">` + [8, 16].map((r) => `<path d="M${436 + r * 0.4} ${142 - r} Q${436 + r * 1.2} 142 ${436 + r * 0.4} ${142 + r}" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') + '</g></g>';
    css += `.on3 .sc-${id} .talk { animation: ${id}-flash 1.4s ease-in-out .2s 2; }`;
    body += glowRect(144, 228, 352, 48, 4, C.green, 0.2, 10) + at(4, 'pop', tag(320, 336, '자막', ROLE.p, 22), 0.6);
    put(K + 'media/자막', svg(id, body, css));
  })();

  // ── 4단원: 관용 표현(발이 넓다 — 겉뜻과 속뜻이 갈린다) ──────────────────────────────
  (function () {
    const id = 't61-k2-gwanyong';
    let css = base(id);
    let body = `<g class="ph">` + at(1, 'drop', tile(320, 50, '발이 넓다', { size: 30, h: 60, fill: TAN, stroke: C.orange })) + '</g>';
    body += drawLine('M270 82 Q200 96 170 112', C.blue, 1, { width: 3.5, delay: 0.5 }) + drawLine('M370 82 Q440 96 470 112', C.orange, 2, { width: 3.5, delay: 0.1 });
    // 겉뜻: 넓은 발
    const foot = `<path d="M104 228 Q104 200 160 200 Q216 200 218 230 Q220 258 196 272 Q182 292 160 292 Q136 292 124 272 Q102 256 104 228 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + [[112, 196, 10], [134, 186, 11], [158, 182, 12], [182, 186, 11], [204, 196, 10]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`).join('');
    body += `<g class="dim dim2">` + at(1, 'pop', tag(160, 132, '겉뜻', ROLE.s, 20), 0.8) + at(1, 'pop', foot, 1.0)
      + `<g class="b1"><path class="draw draw1" pathLength="1" d="M100 306 H220" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round" style="transition-delay:1.3s"/>${g('fin fin1', head(100, 306, Math.PI, C.blue, 4) + head(220, 306, 0, C.blue, 4), 1.9)}</g>` + '</g>';
    body += at(2, 'pop', cross(222, 168, 11), 0.5);
    // 속뜻: 아는 사람이 많다
    const cx = 480, cy = 236, R = 72;
    const A = [0, 60, 120, 180, 240, 300].map((a) => [f(cx + R * Math.cos(a * Math.PI / 180)), f(cy + R * Math.sin(a * Math.PI / 180))]);
    body += at(2, 'pop', tag(480, 132, '속뜻', ROLE.o, 20), 0.6);
    body += A.map(([x, y], i) => drawLine(`M${cx} ${cy} L${x} ${y}`, C.orange, 2, { width: 3, delay: 0.9 + i * 0.12 })).join('');
    body += at(2, 'pop', `<circle cx="${cx}" cy="${cy}" r="28" fill="white"/>` + person(cx, cy + 6, C.orange, 13), 0.8);
    body += A.map(([x, y], i) => at(2, 'pop', `<circle cx="${x}" cy="${y}" r="15" fill="white"/>` + person(x, y + 6, C.green, 8), 1.0 + i * 0.12)).join('');
    css += pulseCss(id, '.ph .tl', 3, 0.3);
    body += at(3, 'pop', tag(320, 334, '관용 표현', ROLE.y, 22), 0.6);
    put(K + '4/관용 표현', svg(id, body, css));
  })();

  // ── 4단원: 관용어(눈을 + 붙이다 → 잠깐 자다) ──────────────────────────────
  (function () {
    const id = 't61-k2-gwanyongeo';
    let css = base(id);
    let body = at(1, 'drop', tile(150, 116, '눈을', { size: 28 }), 0.2);
    body += `<g class="w2">` + at(1, 'drop', tile(300, 116, '붙이다', { size: 28 }), 0.5) + '</g>';
    body += `<g class="h2">` + at(1, 'fin', text(225, 126, '+', { size: 28, color: C.muted }), 0.8) + '</g>';
    css += `.sc-${id} .w2 { transition: transform .8s ease-in-out .3s; } .on2 .sc-${id} .w2 { transform: translateX(-44px); }`;
    // 칸 2: 붙어 굳고 새 뜻이 된다
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M112 80 H308 A16 16 0 0 1 324 96 V136 A16 16 0 0 1 308 152 H112 A16 16 0 0 1 96 136 V96 A16 16 0 0 1 112 80 Z" fill="none" stroke="${C.green}" stroke-width="4" style="transition-delay:.9s"/></g>`;
    body += drawArrow(210, 160, 210, 200, C.green, 2, { width: 4, delay: 1.0 });
    body += at(2, 'pop', tile(210, 238, '잠깐 자다', { size: 24, h: 52, fill: C.peach, stroke: C.orange }), 1.5);
    body += at(2, 'rise', `<path d="M318 206 A20 20 0 1 0 336 236 A15 15 0 1 1 318 206 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`, 1.7);
    // 칸 3: 관용 표현 안의 관용어 칸
    body += at(3, 'fin', idiomBox(390, 180), 0.1);
    body += drawArrow(328, 132, 430, 214, C.green, 3, { width: 4, delay: 0.5 });
    css += paint(id, '.cA', ROLE.p, 3, 1.3) + pulseCss(id, '.cA', 3, 1.6);
    body += glowRect(394, 230, 108, 60, 3, C.green, 1.4, 12);
    put(K + '4/관용어', svg(id, body, css));
  })();

  // ── 4단원: 속담(천 리 길도 한 걸음부터 — 걸음이 쌓여 먼 길이 된다) ──────────────────────────────
  (function () {
    const id = 't61-k2-sokdam';
    let css = base(id);
    let body = `<g class="ph">` + at(1, 'drop', tile(320, 42, '천 리 길도 한 걸음부터', { size: 24, h: 54, fill: TAN, stroke: C.orange })) + '</g>';
    // 길
    body += at(1, 'fin', `<path d="M40 330 Q90 250 200 236 Q320 222 338 132" stroke="${C.line}" stroke-width="42" fill="none" stroke-linecap="round"/>`, 0.4);
    body += at(1, 'fin', `<path d="M344 132 V88" stroke="${C.ink}" stroke-width="3"/><path d="M344 88 L378 98 L344 108 Z" fill="${C.red}"/>` + tag(420, 118, '천 리', ROLE.r, 19), 0.7);
    // 칸 2: 발자국이 하나씩
    const F = [[62, 312, 1], [88, 284, 0.96], [118, 262, 0.92], [152, 248, 0.86], [190, 240, 0.8], [228, 234, 0.74], [266, 228, 0.68], [298, 214, 0.62], [320, 192, 0.56], [332, 166, 0.5], [338, 144, 0.45]];
    F.forEach(([x, y, s], i) => {
      const fx = f(x + (i % 2 ? 8 : -8) * s), col = i === 0 ? C.orange : C.muted;
      body += at(2, 'pop', `<ellipse cx="${fx}" cy="${f(y - 5 * s)}" rx="${f(7 * s)}" ry="${f(9 * s)}" fill="${col}"/><ellipse cx="${fx}" cy="${f(y + 10 * s)}" rx="${f(5.5 * s)}" ry="${f(5.5 * s)}" fill="${col}"/>`, 0.2 + i * 0.15);
    });
    body += `<g class="b2"><circle class="ring ring2" cx="54" cy="312" r="22" fill="none" stroke="${C.orange}" stroke-width="3"/></g>` + at(2, 'pop', tag(140, 334, '한 걸음', ROLE.o, 19), 0.4);
    // 칸 3: 교훈
    const bulb = `<circle cx="530" cy="122" r="26" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><rect x="519" y="148" width="22" height="14" rx="3" fill="${C.muted}"/>`
      + [[-40, 0, -52, 0], [40, 0, 52, 0], [-28, -28, -37, -37], [28, -28, 37, -37], [0, -38, 0, -50]].map(([a, b, c, d]) => `<path d="M${530 + a} ${122 + b} L${530 + c} ${122 + d}" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>`).join('');
    body += at(3, 'pop', bulb, 0.2) + at(3, 'pop', tile(530, 200, '시작이 중요', { size: 22, h: 46, fill: C.mint, stroke: C.green }), 0.8);
    // 칸 4: 관용 표현 안의 속담 칸
    body += at(4, 'fin', idiomBox(400, 236), 0.1);
    css += paint(id, '.cB', ROLE.y, 4, 0.7) + pulseCss(id, '.cB', 4, 1.0) + pulseCss(id, '.ph .tl', 4, 0.3);
    body += glowRect(508, 286, 108, 60, 4, C.orange, 0.8, 12);
    put(K + '4/속담', svg(id, body, css));
  })();

  // ── 4단원: 견학 기록문(글 속 여정·견문·감상이 세 칸으로 갈린다) ──────────────────────────────
  (function () {
    const id = 't61-k2-gyeonhak';
    let css = base(id);
    const COL = { r: [C.sky, C.blue, 372], s: [C.mint, C.green, 466], f: [C.peach, C.orange, 560] };
    let body = at(1, 'fin', `<rect x="18" y="18" width="288" height="324" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(162, 48, '장생포 고래문화특구를 다녀와서', { size: 18 }) + `<path d="M36 62 H288" stroke="${C.line}" stroke-width="2"/>`);
    const L = [[84, 'r'], [108, 's'], [132, 's'], [156, 'f'], [180, 'r'], [204, 's'], [228, 's'], [252, 'f'], [276, 'r'], [300, 's'], [324, 'f']];
    let hl = '', lines = '';
    L.forEach(([y, c], i) => {
      const w = i % 4 === 3 ? 180 : 240, x = 42;
      hl += `<g class="hl hl${i}"><rect x="${x - 6}" y="${y - 9}" width="${w + 12}" height="18" rx="5" fill="${COL[c][0]}" stroke="${COL[c][1]}" stroke-width="1.5"/></g>`;
      lines += bar(x, y, w, '#a9bab3', 8);
      css += `.sc-${id} .hl${i} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .5s ease-out ${f(0.2 + i * 0.12)}s; } .on2 .sc-${id} .hl${i} { transform: none; }`;
    });
    body += `<g class="b2">${hl}</g>` + at(1, 'fin', lines, 0.3);
    // 칸 3: 세 칸
    const iconR = (x) => `<path d="M${x - 28} 62 L${x} 44 L${x + 28} 58" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round"/>` + [[-28, 62], [0, 44], [28, 58]].map(([a, b]) => `<circle cx="${x + a}" cy="${b}" r="7" fill="${C.blue}"/>`).join('');
    const iconS = (x) => eye(x, 52, C.green);
    const iconF = (x) => `<path d="${heartD(x, 54, 0.62)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    const heads = [['r', '여정', iconR, ROLE.s], ['s', '견문', iconS, ROLE.p], ['f', '감상', iconF, ROLE.o]];
    heads.forEach(([c, label, ic, role], k) => {
      const x = COL[c][2];
      body += at(3, 'pop', ic(x), 0.1 + k * 0.15) + at(3, 'pop', tag(x, 100, label, role, 20), 0.2 + k * 0.15);
      body += at(3, 'fin', `<rect x="${x - 42}" y="122" width="84" height="178" rx="10" fill="${C.paper}" stroke="${COL[c][1]}" stroke-width="2.5" stroke-dasharray="7 5"/>`, 0.1);
    });
    const cnt = { r: 0, s: 0, f: 0 };
    L.forEach(([y, c], i) => {
      const x = COL[c][2], sy = 142 + cnt[c]++ * 26;
      body += `<g class="b3"><g class="fy fy${i}"><rect x="${x - 35}" y="${sy - 8}" width="70" height="16" rx="8" fill="${COL[c][0]}" stroke="${COL[c][1]}" stroke-width="2"/></g></g>`;
      css += `.sc-${id} .fy${i} { transform: translate(${162 - x}px, ${y - sy}px); opacity: 0; transition: transform .8s ease-in-out ${f(0.5 + i * 0.12)}s, opacity .3s ease ${f(0.5 + i * 0.12)}s; } .on3 .sc-${id} .fy${i} { transform: none; opacity: 1; }`;
    });
    body += glowRect(320, 26, 290, 282, 4, C.green, 0.2) + at(4, 'pop', tag(466, 336, '견학 기록문', ROLE.p, 22), 0.6);
    put(K + '4/견학 기록문', svg(id, body, css));
  })();

  // ── 4단원: 여정(다닌 곳을 차례로 잇는 길 위의 점) ──────────────────────────────
  (function () {
    const id = 't61-k2-yeojeong';
    let css = base(id);
    const H = [70, 296], D = [[220, 176], [380, 262], [540, 122]];
    let body = at(1, 'fin', `<rect x="440" y="0" width="200" height="200" fill="${C.sky}"/>` + [40, 150, 186].map((y) => `<path d="M${y === 40 ? 560 : 452} ${y} q10 -7 20 0 t20 0 t20 0" stroke="${C.blue}" stroke-width="3" fill="none" opacity=".7"/>`).join('') + text(600, 186, '바다', { size: 18, color: C.blue }));
    // 길(칸마다 한 도막씩 그어진다)
    body += drawLine(`M${H[0]} ${H[1] - 10} L${D[0][0]} ${D[0][1]}`, C.orange, 1, { width: 5, delay: 0.6, cls: 'rd' });
    body += drawLine(`M${D[0][0]} ${D[0][1]} L${D[1][0]} ${D[1][1]}`, C.orange, 2, { width: 5, delay: 0.1, cls: 'rd' });
    body += drawLine(`M${D[1][0]} ${D[1][1]} L${D[2][0]} ${D[2][1]}`, C.orange, 3, { width: 5, delay: 0.1, cls: 'rd' });
    body += at(1, 'pop', `<path d="M${H[0] - 22} 294 L${H[0]} 274 L${H[0] + 22} 294 V316 H${H[0] - 22} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>` + text(H[0], 344, '집', { size: 20 }));
    const dot = (k) => `<circle cx="${D[k][0]}" cy="${D[k][1]}" r="17" fill="${C.green}" stroke="white" stroke-width="3"/>` + text(D[k][0], D[k][1] + 7, k + 1, { size: 19, color: 'white' });
    const labels = [[312, 158, '고래박물관'], [380, 306, '고래생태체험관'], [434, 92, '고래 바다 여행선']];
    [1, 2, 3].forEach((n, k) => {
      body += `<g class="dt dt${k}">` + at(n, 'pop', dot(k), n === 1 ? 1.4 : 1.0) + '</g>' + at(n, 'pop', tag(labels[k][0], labels[k][1], labels[k][2], ROLE.p, 18), n === 1 ? 1.6 : 1.2);
    });
    // 지도 핀
    const pin = `<path d="M${H[0]} 270 C${H[0] - 10} 258 ${H[0] - 14} 252 ${H[0] - 14} 244 A14 14 0 1 1 ${H[0] + 14} 244 C${H[0] + 14} 252 ${H[0] + 10} 258 ${H[0]} 270 Z" fill="${C.red}" stroke="white" stroke-width="2"/><circle cx="${H[0]}" cy="244" r="5" fill="white"/>`;
    body += at(1, 'drop', `<g class="pin">${pin}</g>`, 0.2);
    const tr = D.map(([x, y]) => `translate(${x - H[0]}px, ${y - 17 - 270}px)`);
    css += `.sc-${id} .pin { transition: transform 1s ease-in-out .6s; }
      .on1 .sc-${id} .pin { transform: ${tr[0]}; }
      .on2 .sc-${id} .pin { transform: ${tr[1]}; transition-delay: .1s; }
      .on3 .sc-${id} .pin { transform: ${tr[2]}; transition-delay: .1s; }`;
    css += [0, 1, 2].map((k) => pulseCss(id, `.dt${k}`, 4, 0.2 + k * 0.4)).join('');
    css += `.sc-${id} .rd { transition-property: stroke-dashoffset, stroke; } .on4 .sc-${id} .rd { stroke: ${C.green}; }`;
    body += at(4, 'pop', tag(170, 330, '여정', ROLE.p, 22), 1.4);
    put(K + '4/여정', svg(id, body, css));
  })();

  // ── 4단원: 견문(눈으로 본 것, 귀로 들은 것을 모은다) ──────────────────────────────
  (function () {
    const id = 't61-k2-gyeonmun';
    let css = base(id);
    // 박물관 천장의 고래 뼈
    const skel = `<path d="M24 26 H316" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/><path d="M110 26 V70 M240 26 V66" stroke="${C.muted}" stroke-width="2"/>`
      + `<ellipse cx="62" cy="84" rx="28" ry="16" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M90 82 Q170 66 250 78 Q280 84 296 78" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`
      + [104, 122, 140, 158, 176, 194, 212].map((x, i) => `<path d="M${x} ${f(78 - i * 0.6)} q4 14 0 ${26 - i * 2}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')
      + `<path d="M296 78 L314 62 M296 78 L316 92" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
    // 칸 3에 나타나는 공책(조각보다 먼저 깔아 조각이 위에 놓이게)
    let body = at(3, 'fin', `<rect x="170" y="282" width="300" height="62" rx="10" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>`);
    body += at(1, 'fin', skel);
    body += at(1, 'pop', eye(160, 196, C.blue), 0.4) + drawLine('M160 172 L166 118', C.blue, 1, { width: 3, delay: 0.7 });
    body += `<g class="c1">` + at(1, 'pop', tile(160, 250, '고래 뼈', { size: 20, h: 44, fill: C.sky, stroke: C.blue }), 1.4) + '</g>';
    // 칸 2: 귀로 듣는다
    body += at(2, 'pop', person(540, 112, C.purple, 18), 0.1);
    body += `<g class="b2"><g class="wv">` + [10, 18, 26].map((r) => `<path d="M${494 - r * 0.4} ${150 - r} Q${494 - r * 1.2} 150 ${494 - r * 0.4} ${150 + r}" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') + '</g></g>';
    css += `.on2 .sc-${id} .wv { animation: ${id}-flash 1.4s ease-in-out .4s both; }`;
    body += at(2, 'pop', ear(420, 190), 0.6);
    body += `<g class="c2">` + at(2, 'pop', tile(470, 250, '포유류', { size: 20, h: 44, fill: C.mint, stroke: C.green }), 1.3) + '</g>';
    // 칸 3: 모아 적는다
    css += move(id, 'c1', 'none', 3, { to: 'translate(90px, 63px)', delay: 0.4 }) + move(id, 'c2', 'none', 3, { to: 'translate(-80px, 63px)', delay: 0.7 });
    body += glowRect(164, 276, 312, 74, 4, C.orange, 0.2) + at(4, 'pop', tag(560, 313, '견문', ROLE.y, 22), 0.6);
    put(K + '4/견문', svg(id, body, css));
  })();

  // ── 4단원: 감상(돌고래를 보고 마음속에 일어난 느낌과 생각) ──────────────────────────────
  (function () {
    const id = 't61-k2-gamsang';
    let css = base(id);
    const dolphin = (x, y) => `<path d="M${x - 30} ${y + 2} Q${x - 8} ${y - 16} ${x + 22} ${y - 4} L${x + 33} ${y - 1} L${x + 22} ${y + 3} Q${x} ${y + 12} ${x - 30} ${y + 4} Z" fill="${C.blue}"/>`
      + `<path d="M${x - 4} ${y - 9} L${x + 2} ${y - 21} L${x + 7} ${y - 7} Z" fill="${C.blue}"/><path d="M${x - 28} ${y + 3} L${x - 40} ${y - 7} L${x - 37} ${y + 3} L${x - 40} ${y + 13} Z" fill="${C.blue}"/><circle cx="${x + 18}" cy="${y - 3}" r="2" fill="white"/>`;
    const PV = [[125, 300], [176, 296], [226, 302]];
    let body = '';
    PV.forEach(([px, py], i) => {
      body += `<g class="b1"><g class="dp dp${i}">${dolphin(px, py - 120)}</g></g>`;
      css += `.sc-${id} .dp${i} { transform-box: view-box; transform-origin: ${px}px ${py}px; opacity: 0; }
        .on1 .sc-${id} .dp${i} { animation: ${id}-jump 2.4s ease-in-out ${f(i * 0.6)}s infinite; }`;
    });
    css += `@keyframes ${id}-jump { 0% { transform: rotate(-62deg); opacity: 1; } 70% { transform: rotate(62deg); opacity: 1; } 71%, 100% { transform: rotate(62deg); opacity: 0; } }`;
    body += at(1, 'fin', `<path d="M20 240 q16 -9 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 V306 H20 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`);
    body += at(1, 'fin', [[60, 268], [190, 290], [262, 262]].map(([x, y]) => `<path d="M${x} ${y} q8 -5 16 0 t16 0" stroke="${C.blue}" stroke-width="2.5" fill="none" opacity=".6"/>`).join(''));
    body += at(1, 'pop', tag(170, 334, '참돌고래 떼', ROLE.s, 19), 0.6);
    // 칸 2: 가슴이 뭉클 — 하트가 차오른다
    body += at(2, 'fin', `<defs><clipPath id="${id}-hc"><path d="${heartD(450, 130, 1.5)}"/></clipPath></defs>`
      + `<g clip-path="url(#${id}-hc)"><g class="hf"><rect x="380" y="70" width="140" height="120" fill="${C.red}" opacity=".75"/></g></g>`
      + `<path d="${heartD(450, 130, 1.5)}" fill="none" stroke="${C.red}" stroke-width="3.5" stroke-linejoin="round"/>`);
    css += growCss(id, '.hf', 2, { axis: 'Y', origin: 'center bottom', delay: 0.4, dur: 1.2 });
    css += `.on2 .sc-${id} .hb { animation: ${id}-pulse .6s ease-in-out 1.6s 2; transform-box: fill-box; transform-origin: center; }`;
    body += `<g class="hb">` + at(2, 'pop', tag(576, 92, '뭉클', ROLE.r, 20), 1.4) + '</g>';
    // 칸 3: 지켜야겠다는 생각
    body += at(3, 'pop', `<circle cx="444" cy="196" r="5" fill="white" stroke="${C.purple}" stroke-width="2.5"/>`, 0.1) + at(3, 'pop', `<circle cx="436" cy="216" r="8" fill="white" stroke="${C.purple}" stroke-width="2.5"/>`, 0.3);
    body += at(3, 'pop', `<ellipse cx="470" cy="276" rx="132" ry="40" fill="white" stroke="${C.purple}" stroke-width="3"/>` + text(470, 283, '바다를 지켜야겠다', { size: 20, color: C.purple }), 0.6);
    body += glowRect(350, 52, 270, 278, 4, C.red, 0.2, 18) + at(4, 'pop', tag(450, 28, '감상', ROLE.r, 22), 0.6);
    put(K + '4/감상', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
