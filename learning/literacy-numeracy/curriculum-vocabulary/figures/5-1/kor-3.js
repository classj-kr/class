// 국어 5-1 낱말 도식(5단원 의논하며 토의해요·6단원 작품을 즐겨요): 관점·토의·치중·배출량, 비유적 표현·빗대다·은유법·직유법·어부지리·외손·파장을
// 낱말 조각과 단순한 도형으로 움직여 보인다. 예는 교과서 그대로: 공공 자전거 글 가·나(234~236쪽), 토의 절차 다섯과 토의 주제 예시(242·247쪽),
// 「세계 문화 행사, 문제점은 없을까」 흥미 위주 치중(229쪽), 온실가스 배출량(235쪽, 수치 없음), 「땀이 빗물처럼」·「내 얼굴은 익은 토마토」(261쪽),
// 「딱지」 딱정벌레 같은 딱지(262쪽), 「마음 저울」(264~266쪽), 「풀잎과 바람」(268~269쪽), 「사랑이 뭔데요?」 그리움의 파장(280쪽), 하백의 외손(292쪽), 「어부지리」(300쪽).
// 도구(tile·tag·row·base·steps 따위)는 figures/6-1/kor-3.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 움직임은 transform·opacity·stroke-dashoffset·fill 만 쓴다(도형의 x·y·width·r 를 CSS 로 바꾸지 않는다).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 괄호 .36em, 쉼표·마침표 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!\[\]]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
  const tw = (s, size) => [...s].reduce((a, c) => a + cw(c), 0) * size;
  const wOf = (label, size = 28) => Math.round(tw(String(label).replace(/<[^>]+>/g, ''), size) + size * 1.3);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·slide·fall) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;

  // 낱말 조각: 배경 rect.bg, 글자 text.tx — 색 바꾸기는 CSS 로 .bg 의 fill/stroke 를 바꾼다
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '' } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx' })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: Math.round(size * 1.7), rx: Math.round(size * 0.85), fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange], r: [C.peach, C.red], w: ['white', C.line] };
  // 낱말 줄: 폭을 재어 왼쪽 x0 부터(또는 가운데 cx 에 맞춰) 늘어놓는다
  const row = (labels, { y, x0, cx = 320, gap = 16, size = 28 }) => {
    const ws = labels.map((l) => wOf(l, size));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (labels.length - 1);
    let x = x0 != null ? x0 : cx - total / 2;
    return labels.map((label, i) => { const c = x + ws[i] / 2; x += ws[i] + gap; return { label, cx: c, w: ws[i], y, size, l: c - ws[i] / 2, r: c + ws[i] / 2 }; });
  };
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
  // 그어지는 굽은 줄(칸 n, 경로 d 그대로). 끝 방향 ang 으로 화살촉
  const drawPath = (d, color, n, { width = 4, delay = 0, end = null, ang = 0, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + (end ? g(`fin fin${n}`, head(end[0], end[1], ang, color, width), delay + 0.9) : '') + '</g>';
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  // 오른쪽을 감싸는 묶음 괄호(세로, 끝이 오른쪽을 가리킴)
  const braceR = (x, y1, y2, color = C.green, w = 3.5) => {
    const m = (y1 + y2) / 2;
    return `<path d="M${x - 12} ${y1} Q${x} ${y1} ${x} ${y1 + 14} V${m - 12} Q${x} ${m} ${x + 12} ${m} Q${x} ${m} ${x} ${m + 12} V${y2 - 14} Q${x} ${y2} ${x - 12} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
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
    @keyframes ${id}-fall { 0% { opacity: 0; transform: translateY(-170px); } 15% { opacity: 1; } 100% { opacity: 1; transform: none; } }
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
    .on${n} .sc-${id} .fall${n} { animation: ${id}-fall .7s ease-in both; }
    .on${n} .sc-${id} .slide${n} { animation: ${id}-slide .55s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .2s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .shake${n} { animation: ${id}-shake .6s ease-in-out .2s 2; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .dim${n} { opacity: .3; }`;
    return s;
  };
  // 속성 없는 <g class="cls"> 의 transform 을 칸마다 바꾼다. list: [[칸, transform, 늦춤, 덧붙일 CSS]]
  const steps = (id, cls, first, list, { dur = 1, box = true, opacity = '' } = {}) => {
    let s = `.sc-${id} .${cls} { transform: ${first}; transition: transform ${dur}s ease-in-out, opacity .6s ease;${box ? ' transform-box: fill-box; transform-origin: center;' : ''}${opacity !== '' ? ` opacity: ${opacity};` : ''} }`;
    list.forEach(([n, t, d = 0, extra = '']) => { s += `\n    .on${n} .sc-${id} .${cls} { transform: ${t}; transition-delay: ${d}s;${extra ? ' ' + extra : ''} }`; });
    return s;
  };
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;

  const K = '5-1/국어/';
  const TAN = '#fdf3d3';
  const bar = (x, y, w, color = '#b5c4be', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;


  const eye = (x, y, color = C.blue) => `<path d="M${x - 26} ${y} Q${x} ${y - 22} ${x + 26} ${y} Q${x} ${y + 22} ${x - 26} ${y} Z" fill="white" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`;
  // 양팔저울(받침대 없이 저울대·접시만). 저울대는 .bm, 접시는 .pl·.pr 로 감싸 기울기를 CSS 로 준다.
  const scaleParts = (cx, cy, L, pw, drop, sw = 6) => {
    const pan = (x) => `<path d="M${x} ${cy} L${x - pw / 2} ${cy + drop} M${x} ${cy} L${x + pw / 2} ${cy + drop}" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<path d="M${x - pw / 2 - 6} ${cy + drop} H${x + pw / 2 + 6} Q${x + pw / 2 - 4} ${cy + drop + pw * 0.22} ${x} ${cy + drop + pw * 0.22} Q${x - pw / 2 + 4} ${cy + drop + pw * 0.22} ${x - pw / 2 - 6} ${cy + drop} Z" fill="${TAN}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    return {
      beam: `<path d="M${cx - L} ${cy} H${cx + L}" stroke="${C.ink}" stroke-width="${sw}" stroke-linecap="round"/>`,
      left: pan(cx - L), right: pan(cx + L),
      pivot: `<circle cx="${cx}" cy="${cy}" r="${sw + 3}" fill="${C.ink}"/>`
    };
  };
  // 저울대 기울기(deg, 음수면 왼쪽이 내려감)에 맞춘 접시 옮김
  const tilt = (L, deg) => {
    const a = deg * Math.PI / 180;
    return { l: `translate(${f(L - L * Math.cos(a))}px, ${f(-L * Math.sin(a))}px)`, r: `translate(${f(-(L - L * Math.cos(a)))}px, ${f(L * Math.sin(a))}px)` };
  };

  // ── 5단원: 관점(공공 자전거 한 대를 두 눈이 서로 다른 자리에서 바라본다 — 글 가·나의 관점) ──────────────────────────────
  (function () {
    const id = 't51-k3-gwanjeom';
    let css = base(id);
    let body = '';
    // 시선 부채꼴(칸 2·3에 옅게 칠해진다)
    body += `<g class="b1"><path class="fanL" d="M98 190 L232 132 L232 262 Z" fill="${C.sky}"/><path class="fanR" d="M542 190 L408 132 L408 262 Z" fill="${C.peach}"/></g>`;
    css += `.sc-${id} .fanL, .sc-${id} .fanR { opacity: 0; transition: opacity .8s ease .2s; }
      .on2 .sc-${id} .fanL, .on3 .sc-${id} .fanR { opacity: .75; }`;
    body += drawPath('M98 190 L232 132 M98 190 L232 262', C.blue, 1, { width: 3, delay: 0.9 });
    body += drawPath('M542 190 L408 132 M542 190 L408 262', C.orange, 1, { width: 3, delay: 1.2 });
    // 공공 자전거
    const bike = `<path d="M196 262 H444" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`
      + `<circle cx="262" cy="222" r="36" fill="white" stroke="${C.ink}" stroke-width="5"/><circle cx="378" cy="222" r="36" fill="white" stroke="${C.ink}" stroke-width="5"/>`
      + `<circle cx="262" cy="222" r="5" fill="${C.ink}"/><circle cx="378" cy="222" r="5" fill="${C.ink}"/>`
      + `<path d="M262 222 L300 168 L358 168 L378 222 M300 168 L322 222 L262 222 M322 222 L358 168 M300 168 L297 152" stroke="${C.green}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="M284 151 H312" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`
      + `<path d="M358 168 L352 144 M342 142 H364" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`
      + `<rect x="366" y="140" width="34" height="24" rx="4" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    body += at(1, 'pop', bike) + at(1, 'pop', tag(320, 108, '공공 자전거', ROLE.p, 20), 0.4);
    // 두 눈(깜박인다)
    body += at(1, 'pop', `<g class="eL">${eye(70, 190, C.blue)}</g>`, 0.5) + at(1, 'pop', `<g class="eR">${eye(570, 190, C.orange)}</g>`, 0.8);
    css += `@keyframes ${id}-blink { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(.1); } }
      .sc-${id} .eL, .sc-${id} .eR { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .eL { animation: ${id}-blink .35s ease-in-out .1s 2; }
      .on3 .sc-${id} .eR { animation: ${id}-blink .35s ease-in-out .1s 2; }`;
    // 왼쪽 자리에서 보이는 것 / 오른쪽 자리에서 보이는 것
    body += at(2, 'pop', tag(140, 74, '빌리기 편하다', ROLE.s, 20), 0.6) + at(2, 'pop', tag(140, 306, '환경에 좋다', ROLE.s, 20), 1.0);
    body += at(3, 'pop', tag(500, 74, '고장·도난', ROLE.o, 20), 0.6) + at(3, 'pop', tag(500, 306, '관리가 어렵다', ROLE.o, 20), 1.0);
    css += `.on4 .sc-${id} .fanL, .on4 .sc-${id} .fanR { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    body += at(4, 'pop', tag(320, 316, '관점', ROLE.p, 24), 0.5);
    put(K + '5/관점', svg(id, body, css));
  })();

  // ── 5단원: 토의(교과서 토의 절차 다섯 — 주제 정하기·의견 마련·나누기·모으기·결정하기) ──────────────────────────────
  (function () {
    const id = 't51-k3-toui';
    let css = base(id);
    let body = at(1, 'fin', tag(46, 34, '주제', ROLE.p, 19) + text(84, 41, '우리 반을 더 깨끗이 만드는 방법', { size: 20, anchor: 'start' }));
    // 오른쪽 절차 띠(세로)
    const steps5 = ['주제 정하기', '의견 마련하기', '의견 나누기', '의견 모으기', '의견 결정하기'];
    const ys = [80, 134, 188, 242, 296];
    body += at(1, 'fin', `<path d="M474 ${ys[0]} V${ys[4]}" stroke="${C.line}" stroke-width="3"/>`, 0.2);
    steps5.forEach((label, i) => {
      const w = wOf(label, 18);
      body += at(1, 'rise', `<circle cx="474" cy="${ys[i]}" r="14" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + text(474, ys[i] + 6.5, i + 1, { size: 18, color: C.muted })
        + `<g class="st st${i}">${tile(494 + w / 2, ys[i], label, { size: 18, h: 40, w })}</g>`, 0.3 + i * 0.12);
    });
    css += paint(id, '.st0', ROLE.p, 1, 1.2) + paint(id, '.st1', ROLE.p, 2, 0.1) + paint(id, '.st2', ROLE.p, 2, 1.0) + paint(id, '.st3', ROLE.p, 3, 0.1) + paint(id, '.st4', ROLE.p, 3, 1.3);
    // 모둠 친구 넷과 책상
    const px = [90, 180, 270, 360], pc = [C.blue, C.green, C.orange, C.purple];
    body += px.map((x, i) => at(1, 'pop', person(x, 212, pc[i], 17), 0.5 + i * 0.15)).join('');
    body += at(1, 'fin', `<ellipse cx="225" cy="262" rx="160" ry="42" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/>`, 0.3);
    // 의견 쪽지: 머리 위에 생겨(마련) 책상으로 내려오고(나누기), 가운데로 모인다(모으기)
    const tx = [135, 195, 255, 315];
    const card = (x, y, color) => `<rect x="${x - 26}" y="${y - 20}" width="52" height="40" rx="6" fill="white" stroke="${color}" stroke-width="3"/>`
      + bar(x - 16, y - 7, 32, color, 6) + bar(x - 16, y + 6, 22, color, 6);
    px.forEach((x, i) => {
      body += `<g class="b2"><g class="cd cd${i}"><g class="cdf">${g('pop pop2', card(tx[i], 262, pc[i]), 0.2 + i * 0.15)}</g></g></g>`;
      css += `.sc-${id} .cd${i} { transform: translate(${x - tx[i]}px, -150px); transition: transform 1s ease-in-out ${0.9 + i * 0.12}s; }
        .on2 .sc-${id} .cd${i} { transform: none; }
        .on3 .sc-${id} .cd${i} { transform: translate(${f((225 - tx[i]) * 0.85)}px, 0px); transition-delay: .2s; }`;
    });
    css += `.sc-${id} .cdf { transition: opacity .6s ease 1.2s; } .on3 .sc-${id} .cdf { opacity: .35; }`;
    // 정한 모둠 의견
    body += at(3, 'pop', `<rect x="171" y="236" width="108" height="52" rx="10" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5"/>` + text(225, 269, '모둠 의견', { size: 19, color: C.green }), 1.4);
    body += at(3, 'pop', check(290, 232, 11), 1.9);
    body += glowRect(456, ys[0] - 26, 180, ys[4] - ys[0] + 52, 4, C.green, 0.2) + at(4, 'pop', tag(225, 104, '토의', ROLE.p, 24), 0.5);
    put(K + '5/토의', svg(id, body, css));
  })();

  // ── 5단원: 치중(세계 문화 행사 — 음식·춤·노래만 올린 저울이 재미 쪽으로 기운다) ──────────────────────────────
  (function () {
    const id = 't51-k3-chijung';
    let css = base(id);
    const L = 150, deg = -12, tl = tilt(L, deg);
    const sp = scaleParts(320, 112, L, 150, 86, 7);
    let body = at(1, 'fin', `<path d="M320 112 V300" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/><rect x="250" y="296" width="140" height="16" rx="8" fill="${C.ink}"/>`);
    // 왼쪽 접시: 재미, 오른쪽 접시: 역사·의미
    const blocks = [['음식', 138, 179], ['노래', 202, 179], ['춤', 170, 145]];
    const left = sp.left + blocks.map(([w, x, y], i) => `<g class="b2">${g('fall fall2', tile(x, y, w, { size: 18, h: 32, fill: TAN, stroke: C.orange }), 0.2 + i * 0.45)}</g>`).join('')
      + tag(170, 252, '재미', ROLE.y, 20);
    const right = sp.right + tag(470, 252, '역사·의미', ROLE.s, 20);
    body += at(1, 'pop', `<g class="pl">${left}</g>`, 0.3) + at(1, 'pop', `<g class="pr">${right}</g>`, 0.5);
    body += at(1, 'fin', `<g class="bm">${sp.beam}</g>` + sp.pivot, 0.1);
    css += `.sc-${id} .bm { transform-box: view-box; transform-origin: 320px 112px; }
      .sc-${id} .bm, .sc-${id} .pl, .sc-${id} .pr { transition: transform 1.1s ease-in-out 1.7s; }
      .on2 .sc-${id} .bm { transform: rotate(${deg}deg); }
      .on2 .sc-${id} .pl { transform: ${tl.l}; }
      .on2 .sc-${id} .pr { transform: ${tl.r}; }`;
    // 칸 3: 쏠리는 쪽 화살표, 빈 접시 반짝임
    body += drawArrow(84, 120, 84, 250, C.orange, 3, { width: 6, delay: 0.2 });
    body += `<g class="b3"><g class="rg">${`<ellipse cx="470" cy="176" rx="98" ry="24" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 7"/>`}</g></g>`;
    css += `.sc-${id} .rg { opacity: 0; transition: opacity .5s ease .9s; } .on3 .sc-${id} .rg { opacity: 1; animation: ${id}-flash 1.4s ease-in-out .9s both; }`;
    body += at(4, 'pop', tag(320, 44, '치중', ROLE.y, 24), 0.4);
    put(K + '5/치중', svg(id, body, css));
  })();

  // ── 5단원: 배출량(자동차가 밖으로 내보낸 온실가스가 막대로 쌓이고, 자전거는 비어 있다 — 수치 없음) ──────────────────────────────
  (function () {
    const id = 't51-k3-baechul';
    let css = base(id);
    // 왼쪽을 보고 선 자동차(배기관이 오른쪽 뒤)
    const car = `<path d="M60 142 V114 Q62 102 76 100 L104 98 L128 72 H192 L214 98 H234 Q244 100 244 112 V142 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M134 80 H160 V98 H116 Z M168 80 H188 L206 98 H168 Z" fill="white" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<rect x="244" y="130" width="16" height="8" rx="3" fill="${C.muted}"/>`
      + `<circle cx="98" cy="144" r="17" fill="${C.ink}"/><circle cx="208" cy="144" r="17" fill="${C.ink}"/><circle cx="98" cy="144" r="6" fill="white"/><circle cx="208" cy="144" r="6" fill="white"/>`;
    let body = at(1, 'pop', car) + at(1, 'pop', tag(150, 36, '자동차', ROLE.s, 20), 0.3);
    // 배기관에서 나오는 온실가스(뭉게 덩이가 오른쪽으로 흘러 나간다)
    const puffs = [0, 0.5, 1.0, 1.5].map((d) => `<g class="pf"${dl(d)}><circle cx="272" cy="132" r="9" fill="${C.line}"/><circle cx="282" cy="126" r="7" fill="${C.line}"/></g>`).join('');
    body += `<g class="b1">${puffs}</g>`;
    css += `@keyframes ${id}-puff { 0% { opacity: 0; transform: translate(0, 0) scale(.6); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(42px, -8px) scale(1.4); } }
      .sc-${id} .pf { opacity: 0; transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .pf { animation: ${id}-puff 2s linear infinite; }`;
    body += at(1, 'pop', tag(292, 84, '온실가스', ROLE.w, 19), 0.9);
    // 막대 1: 자동차가 내보낸 양
    body += at(2, 'fin', `<rect x="326" y="106" width="276" height="38" rx="8" fill="white" stroke="${C.ink}" stroke-width="3"/>`);
    body += `<g class="b2"><g class="fill1"><rect x="329" y="109" width="270" height="32" rx="6" fill="${C.orange}"/></g></g>`;
    css += `.sc-${id} .fill1 { transform-box: view-box; transform-origin: 329px 0px; transform: scaleX(0); transition: transform 1.6s ease-out .4s; }
      .on2 .sc-${id} .fill1 { transform: scaleX(1); }`;
    body += at(2, 'pop', tag(464, 74, '배출량', ROLE.o, 20), 1.6);
    // 자전거와 빈 막대
    const bike = `<circle cx="104" cy="272" r="28" fill="white" stroke="${C.ink}" stroke-width="4.5"/><circle cx="200" cy="272" r="28" fill="white" stroke="${C.ink}" stroke-width="4.5"/>`
      + `<g class="wh1"><path d="M104 246 V298 M78 272 H130" stroke="${C.line}" stroke-width="2.5"/></g><g class="wh2"><path d="M200 246 V298 M174 272 H226" stroke="${C.line}" stroke-width="2.5"/></g>`
      + `<path d="M104 272 L134 228 L184 228 L200 272 M134 228 L152 272 L104 272 M152 272 L184 228 M134 228 L131 214" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="M120 213 H144" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><path d="M184 228 L179 210 M171 208 H190" stroke="${C.ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    body += at(3, 'slide', bike) + at(3, 'pop', tag(152, 326, '자전거', ROLE.p, 20), 0.4);
    css += `@keyframes ${id}-spin { to { transform: rotate(360deg); } }
      .sc-${id} .wh1, .sc-${id} .wh2 { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .wh1, .on3 .sc-${id} .wh2 { animation: ${id}-spin 1.2s linear infinite; }`;
    body += `<g class="b3"><rect class="draw draw3" pathLength="1" x="326" y="254" width="276" height="38" rx="8" fill="white" stroke="${C.ink}" stroke-width="3" style="transition-delay:.5s"/></g>`;
    body += drawArrow(464, 158, 464, 236, C.green, 3, { width: 5, delay: 1.2 });
    body += glowRect(318, 98, 292, 54, 4, C.orange, 0.2) + `<g class="b4"><g class="tg4">${tag(464, 74, '배출량', ROLE.o, 20)}</g></g>`;
    css += pulseCss(id, '.tg4', 4, 0.5);
    put(K + '5/배출량', svg(id, body, css));
  })();

  // ── 6단원: 비유적 표현(땀이 빗물처럼 · 내 얼굴은 익은 토마토 — 큰 상자 안에 직유법·은유법) ──────────────────────────────
  (function () {
    const id = 't51-k3-biyu';
    let css = base(id);
    let body = '';
    // 큰 상자(비유적 표현)와 안의 두 상자(직유법·은유법)
    body += `<g class="b2"><rect class="draw draw2 ob" pathLength="1" x="22" y="56" width="596" height="282" rx="18" fill="none" stroke="${C.green}" stroke-width="4"/></g>`;
    body += `<g class="b3"><rect class="draw draw3" pathLength="1" x="40" y="82" width="268" height="238" rx="14" fill="none" stroke="${C.blue}" stroke-width="3"/>`
      + `<rect class="draw draw3" pathLength="1" x="332" y="82" width="268" height="238" rx="14" fill="none" stroke="${C.purple}" stroke-width="3" style="transition-delay:.3s"/></g>`;
    // 왼쪽: 땀 ↔ 빗물
    const face = (x, y) => `<circle cx="${x}" cy="${y}" r="32" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><circle cx="${x - 11}" cy="${y - 5}" r="4" fill="${C.ink}"/><circle cx="${x + 11}" cy="${y - 5}" r="4" fill="${C.ink}"/><path d="M${x - 10} ${y + 13} Q${x} ${y + 19} ${x + 10} ${y + 13}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const drop = (x, y, s = 1) => `<path d="M${x} ${y - 10 * s} Q${x + 8 * s} ${y + 2 * s} ${x} ${y + 6 * s} Q${x - 8 * s} ${y + 2 * s} ${x} ${y - 10 * s} Z" fill="${C.blue}"/>`;
    body += at(1, 'pop', face(100, 160), 0.1);
    body += `<g class="b1">` + [[136, 150, 0], [64, 162, 0.5], [130, 176, 1.0]].map(([x, y, d]) => `<g class="fd"${dl(d)}>${drop(x, y)}</g>`).join('') + '</g>';
    const cloud = `<path d="M218 160 Q206 160 206 148 Q206 134 222 134 Q226 118 244 118 Q262 118 266 134 Q282 134 282 148 Q282 160 270 160 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`;
    body += at(1, 'pop', cloud, 0.4);
    body += `<g class="b1">` + [[226, 0.2], [246, 0.7], [266, 1.2], [236, 1.5], [258, 0.4]].map(([x, d]) => `<g class="rd"${dl(d)}>${drop(x, 178, 0.7)}</g>`).join('') + '</g>';
    css += `@keyframes ${id}-fall { 0% { opacity: 0; transform: translateY(-6px); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(26px); } }
      .sc-${id} .fd, .sc-${id} .rd { opacity: 0; }
      .on1 .sc-${id} .fd, .on1 .sc-${id} .rd { animation: ${id}-fall 1.6s ease-in infinite; }`;
    body += at(1, 'fin', text(100, 222, '땀', { size: 19, color: C.muted }) + text(244, 222, '빗물', { size: 19, color: C.muted }), 0.6);
    body += drawPath('M144 128 Q172 104 200 124', C.muted, 1, { width: 3, delay: 0.8, end: [200, 124], ang: 0.6 });
    // 오른쪽: 얼굴 ↔ 토마토
    body += at(1, 'pop', face(392, 160) + `<g class="blush"><circle cx="392" cy="160" r="30" fill="${C.red}"/></g>`, 0.3);
    css += `.sc-${id} .blush { opacity: 0; transition: opacity 1.2s ease 1s; } .on1 .sc-${id} .blush { opacity: .45; }`;
    const tomato = `<circle cx="540" cy="162" r="32" fill="${C.red}"/><path d="M526 132 L540 140 L554 132 L548 144 L540 140 L532 144 Z" fill="${C.green}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="528" cy="152" rx="7" ry="5" fill="white" opacity=".5"/>`;
    body += at(1, 'pop', tomato, 0.6);
    body += at(1, 'fin', text(392, 222, '얼굴', { size: 19, color: C.muted }) + text(540, 222, '토마토', { size: 19, color: C.muted }), 0.8);
    body += drawPath('M436 128 Q464 104 492 124', C.muted, 1, { width: 3, delay: 1.0, end: [492, 124], ang: 0.6 });
    // 비유 예 조각(이음말은 칸 3에 물든다)
    const phrase = (cx, cy, parts, w) => `<g class="tl"><rect class="bg" x="${cx - w / 2}" y="${cy - 26}" width="${w}" height="52" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + `<text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="22" font-weight="700" fill="${C.ink}">${parts.map(([s, c]) => c ? `<tspan class="${c}">${s}</tspan>` : s).join('')}</text></g>`;
    body += at(1, 'rise', phrase(174, 268, [['땀이 빗물'], ['처럼', 'hj']], 176), 1.3);
    body += at(1, 'rise', phrase(466, 268, [['내 얼굴'], ['은', 'hu'], [' 익은 토마토'], ['야', 'hu']], 248), 1.5);
    css += `.sc-${id} .hj, .sc-${id} .hu { transition: fill .6s ease .6s; }
      .on3 .sc-${id} .hj { fill: ${C.blue}; } .on3 .sc-${id} .hu { fill: ${C.purple}; }`;
    body += at(2, 'pop', tag(320, 56, '비유적 표현', ROLE.p, 22), 0.8);
    body += at(3, 'pop', tag(174, 82, '직유법', ROLE.s, 20), 0.8) + at(3, 'pop', tag(466, 82, '은유법', ROLE.x, 20), 1.1);
    css += `.on4 .sc-${id} .ob { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    put(K + '6/비유적 표현', svg(id, body, css));
  })();

  // ── 6단원: 빗대다(시 「딱지」 — 무릎의 딱지를 닮은 딱정벌레에 견주어 '딱정벌레 같은 딱지') ──────────────────────────────
  (function () {
    const id = 't51-k3-bitdae';
    let css = base(id);
    // 굽힌 다리와 무릎의 딱지
    const legD = 'M-30 150 L168 186 L150 296';
    const leg = `<path d="${legD}" stroke="${C.orange}" stroke-width="66" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="${legD}" stroke="${C.peach}" stroke-width="60" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="M116 300 Q116 290 132 290 H176 Q218 292 222 318 V330 H116 Z" fill="${C.blue}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    const scab = `<ellipse cx="172" cy="186" rx="21" ry="15" fill="${C.ink}" transform="rotate(-20 172 186)"/><ellipse cx="164" cy="181" rx="6" ry="3.5" fill="white" opacity=".55"/>`;
    let body = at(1, 'fin', `<g>${leg}</g>`);
    body += at(1, 'pop', `<g class="sb">${scab}</g>`, 0.5);
    body += at(1, 'pop', `<path d="M190 198 L226 222" stroke="${C.muted}" stroke-width="2.5"/>` + tag(262, 234, '딱지', ROLE.w, 20), 0.8);
    // 딱정벌레(오른쪽에서 기어 온다)
    const beetle = `<g class="lg">${[-1, 1].map((s) => [-16, 0, 16].map((dx) => `<path d="M${470 + dx} 190 Q${470 + dx + s * 0} ${190 + s * 30} ${470 + dx + (dx > 0 ? 12 : dx < 0 ? -12 : 0)} ${190 + s * 40}" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')).join('')}</g>`
      + `<path d="M424 182 Q410 170 404 158 M424 198 Q410 210 404 222" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + `<circle cx="428" cy="190" r="13" fill="${C.ink}"/>`
      + `<ellipse cx="478" cy="190" rx="42" ry="30" fill="${C.ink}"/><path d="M440 190 H520" stroke="${C.muted}" stroke-width="2.5"/><ellipse cx="466" cy="176" rx="12" ry="6" fill="white" opacity=".55"/>`;
    body += `<g class="b2"><g class="bt">${beetle}</g></g>`;
    css += `.sc-${id} .bt { transform: translateX(150px); opacity: 0; transition: transform 1.2s ease-out, opacity .4s ease; }
      .on2 .sc-${id} .bt { transform: none; opacity: 1; }
      @keyframes ${id}-legs { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(.8); } }
      .sc-${id} .lg { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .lg { animation: ${id}-legs .3s ease-in-out 4; }`;
    body += at(2, 'pop', tag(478, 270, '딱정벌레', ROLE.w, 20), 1.0);
    // 딱정벌레 몸 모양을 본뜬 점선이 딱지 위로 옮겨 가 꼭 맞는다
    body += `<g class="b2"><g class="gh"><ellipse cx="478" cy="190" rx="42" ry="30" fill="none" stroke="${C.purple}" stroke-width="4" stroke-dasharray="9 6"/></g></g>`;
    css += `.sc-${id} .gh { opacity: 0; transform-box: fill-box; transform-origin: center; transition: transform 1.1s ease-in-out 1.6s, opacity .4s ease 1.3s; }
      .on2 .sc-${id} .gh { opacity: 1; transform: translate(-306px, -4px) rotate(-20deg) scale(.55); }`;
    // 견주는 화살표와 비유 조각
    body += drawPath('M436 146 Q320 50 200 168', C.purple, 3, { width: 4.5, delay: 0.2, end: [200, 168], ang: 2.36 });
    body += at(3, 'rise', tile(420, 322, '딱정벌레 같은 딱지', { size: 22, h: 50, fill: C.lilac, stroke: C.purple }), 1.0);
    css += `.on3 .sc-${id} .sb { animation: ${id}-shake .5s ease-in-out 1.3s 2; transform-box: fill-box; transform-origin: center; }`;
    body += at(4, 'pop', tag(320, 36, '빗대다', ROLE.x, 24), 0.4);
    put(K + '6/빗대다', svg(id, body, css));
  })();

  // ── 6단원: 은유법·직유법(같은 틀: 두 카드 → 닮은 점 → 이음말 조각만 갈린다) ──────────────────────────────
  // 「마음 저울」 '내 마음은 / 접시 달린 양팔저울'(266쪽), 「풀잎과 바람」 '풀잎 같은 친구'(268~269쪽)
  const frame = (id, o) => {
    let css = base(id);
    const card = (cx, role, roleC, name) => at(1, 'pop', `<rect x="${cx - 105}" y="58" width="210" height="150" rx="16" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + text(cx, 196, name, { size: 20, color: C.muted }), cx < 320 ? 0 : 0.3) + at(1, 'pop', tag(cx, 58, role, roleC, 19), cx < 320 ? 0.4 : 0.7);
    let body = card(145, o.left.role, o.left.rc, o.left.name) + card(495, o.right.role, o.right.rc, o.right.name);
    body += at(1, 'pop', o.left.icon, 0.5) + at(1, 'pop', o.right.icon, 0.8);
    css += o.css || '';
    // 닮은 점(칸 2)
    body += drawPath('M262 140 H378', C.green, 2, { width: 4, delay: 0.1, end: [378, 140], ang: 0 }) + `<g class="b2">${g('fin fin2', head(262, 140, Math.PI, C.green, 4), 1.0)}</g>`;
    body += at(2, 'pop', tag(320, 108, o.alike, ROLE.p, 18), 0.6);
    // 비유 조각 줄(칸 3): 두 낱말 조각이 카드에서 내려오고, 이음말 조각이 가운데로 떨어진다
    const r = row([o.left.word, o.link, o.right.word], { y: 282, size: 28, gap: 12 });
    body += `<g class="b3"><g class="wl">${tile(r[0].cx, 282, r[0].label, { size: 28, w: r[0].w, fill: o.left.rc[0], stroke: o.left.rc[1] })}</g></g>`;
    body += `<g class="b3"><g class="wr">${tile(r[2].cx, 282, r[2].label, { size: 28, w: r[2].w, fill: o.right.rc[0], stroke: o.right.rc[1] })}</g></g>`;
    css += `.sc-${id} .wl, .sc-${id} .wr { transition: transform 1s ease-in-out .1s; }
      .sc-${id} .wl { transform: translate(${f(145 - r[0].cx)}px, -150px) scale(.6); }
      .sc-${id} .wr { transform: translate(${f(495 - r[2].cx)}px, -150px) scale(.6); }
      .on3 .sc-${id} .wl, .on3 .sc-${id} .wr { transform: none; }`;
    body += `<g class="b3">${g('fall fall3', `<g class="lk">${tile(r[1].cx, 282, r[1].label, { size: 28, w: r[1].w, fill: o.linkC[0], stroke: o.linkC[1], sw: 4 })}</g>`, 1.2)}</g>`;
    css += pulseCss(id, '.lk', 4, 0.3);
    body += at(4, 'pop', tag(320, 30, o.word, o.linkC, 22), 0.5) + at(4, 'rise', tag(320, 336, o.pattern, ROLE.w, 19), 0.9);
    return svg(id, body, css);
  };

  (function () {
    const id = 't51-k3-eunyu';
    const L = 60, tl = tilt(L, -12), tr = tilt(L, 12);
    const sp = scaleParts(495, 98, L, 56, 36, 5);
    const heart = `<g class="ht"><path d="M145 168 C88 128 104 86 145 108 C186 86 202 128 145 168 Z" fill="${C.peach}" stroke="${C.red}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
    const scale = `<path d="M495 98 V158" stroke="${C.ink}" stroke-width="5"/><rect x="465" y="156" width="60" height="9" rx="4" fill="${C.ink}"/>`
      + `<g class="pl">${sp.left}</g><g class="pr">${sp.right}</g><g class="bm">${sp.beam}</g>${sp.pivot}`;
    const kf = (name, a, b) => `@keyframes ${id}-${name} { 0% { transform: none; } 30% { transform: ${a}; } 65% { transform: ${b}; } 100% { transform: ${a}; } }`;
    const css = kf('bm', 'rotate(-12deg)', 'rotate(12deg)') + kf('pl', tl.l, tr.l) + kf('pr', tl.r, tr.r) + kf('ht', 'rotate(-14deg)', 'rotate(14deg)')
      + `.sc-${id} .bm { transform-box: view-box; transform-origin: 495px 98px; }
      .sc-${id} .ht { transform-box: fill-box; transform-origin: 50% 100%; }
      .on2 .sc-${id} .bm { animation: ${id}-bm 2s ease-in-out .3s both; }
      .on2 .sc-${id} .pl { animation: ${id}-pl 2s ease-in-out .3s both; }
      .on2 .sc-${id} .pr { animation: ${id}-pr 2s ease-in-out .3s both; }
      .on2 .sc-${id} .ht { animation: ${id}-ht 2s ease-in-out .3s both; }`;
    put(K + '6/은유법', frame(id, {
      left: { role: '대상', rc: ROLE.p, name: '내 마음', word: '내 마음', icon: heart },
      right: { role: '빗댄 것', rc: ROLE.o, name: '양팔저울', word: '양팔저울', icon: scale },
      alike: '기운다', link: '은', linkC: ROLE.x, word: '은유법', pattern: 'ㄱ은 ㄴ이다', css
    }));
  })();

  (function () {
    const id = 't51-k3-jigyu';
    // 풀잎 두 장(바람에 엉켰다가 다시 풀린다)
    const blade = (x, lean, cls) => `<g class="${cls}"><path d="M${x} 176 Q${x + lean * 0.3} 130 ${x + lean} 84 Q${x + lean * 0.3 + 10} 130 ${x + 10} 176 Z" fill="${C.green}"/></g>`;
    const grass = `<path d="M84 177 H206" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>` + blade(118, -14, 'gA') + blade(150, 6, 'gB') + blade(172, 18, 'gC')
      + `<g class="wd"><path d="M64 104 Q84 96 104 104 M60 124 Q84 116 108 124" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
    // 친구 둘(돌아섰다가 다시 마주한다)
    const friends = `<g class="fA">${person(468, 150, C.blue, 15)}</g><g class="fB">${person(524, 150, C.orange, 15)}</g>`
      + `<g class="hd"><path d="M486 166 Q496 160 506 166" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
    const kf = (name, a) => `@keyframes ${id}-${name} { 0%, 100% { transform: none; } 25%, 50% { transform: ${a}; } }`;
    const css = kf('gA', 'rotate(26deg)') + kf('gB', 'rotate(30deg)') + kf('gC', 'rotate(-28deg)') + kf('fA', 'rotate(-16deg)') + kf('fB', 'rotate(16deg)')
      + `@keyframes ${id}-wd { 0% { opacity: 0; transform: translateX(-20px); } 30% { opacity: 1; } 60% { opacity: 1; transform: translateX(30px); } 100% { opacity: 0; transform: translateX(60px); } }
      .sc-${id} .gA, .sc-${id} .gB, .sc-${id} .gC, .sc-${id} .fA, .sc-${id} .fB { transform-box: fill-box; transform-origin: 50% 100%; }
      .sc-${id} .wd { opacity: 0; } .sc-${id} .hd { opacity: 0; transition: opacity .5s ease 1.9s; } .on2 .sc-${id} .hd { opacity: 1; }
      .on2 .sc-${id} .wd { animation: ${id}-wd 1.6s ease-in-out .2s both; }
      .on2 .sc-${id} .gA { animation: ${id}-gA 2s ease-in-out .3s both; }
      .on2 .sc-${id} .gB { animation: ${id}-gB 2s ease-in-out .3s both; }
      .on2 .sc-${id} .gC { animation: ${id}-gC 2s ease-in-out .3s both; }
      .on2 .sc-${id} .fA { animation: ${id}-fA 2s ease-in-out .3s both; }
      .on2 .sc-${id} .fB { animation: ${id}-fB 2s ease-in-out .3s both; }`;
    put(K + '6/직유법', frame(id, {
      left: { role: '빗댄 것', rc: ROLE.o, name: '풀잎', word: '풀잎', icon: grass },
      right: { role: '대상', rc: ROLE.p, name: '친구', word: '친구', icon: friends },
      alike: '엉켰다 풀림', link: '같은', linkC: ROLE.s, word: '직유법', pattern: '같이 · 처럼 · 듯이', css
    }));
  })();

  // ── 6단원: 어부지리(조개와 황새가 서로 물고 버티는 사이 어부가 그물로 둘을 한꺼번에) ──────────────────────────────
  (function () {
    const id = 't51-k3-eobu';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M20 314 H620" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`);
    // 해
    body += at(1, 'pop', `<g class="sun"><circle cx="70" cy="70" r="24" fill="${C.yellow}"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r1 = 32, r2 = 44, c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(70 + r1 * c)} ${f(70 + r1 * s)} L${f(70 + r2 * c)} ${f(70 + r2 * s)}" stroke="${C.yellow}" stroke-width="4" stroke-linecap="round"/>`; }).join('')}</g>`);
    css += `@keyframes ${id}-spin { to { transform: rotate(360deg); } } .sc-${id} .sun { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .sun { animation: ${id}-spin 8s linear infinite; }`;
    // 조개(뚜껑이 열렸다가 칸 2에 닫힌다)
    const ridges = (up) => (up ? [[208, 256], [230, 252], [250, 254], [264, 264]] : [[208, 304], [230, 306], [250, 304], [264, 296]]).map(([x, y]) => `<path d="M194 280 L${x} ${y}" stroke="${C.orange}" stroke-width="2" opacity=".6"/>`).join('');
    const bottom = `<path d="M186 280 Q186 312 228 312 Q270 312 274 280 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    const lid = `<g class="lid"><path d="M186 280 Q186 248 228 248 Q270 248 274 280 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>${ridges(true)}</g>`;
    // 황새(오른쪽 위에서 날아와 부리를 조개 쪽으로)
    const stork = `<path d="M372 232 L364 314 M392 232 L398 314" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`
      + `<ellipse cx="384" cy="210" rx="44" ry="26" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M412 200 Q440 204 446 220 Q426 226 410 220 Z" fill="${C.ink}"/>`
      + `<path d="M350 202 Q330 196 326 176" stroke="${C.ink}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M350 202 Q330 196 326 176" stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>`
      + `<circle cx="322" cy="172" r="14" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="318" cy="168" r="3" fill="${C.ink}"/>`
      + `<path d="M310 176 L262 272" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`;
    body += `<g class="b1"><g class="fight"><g class="pop pop1">${bottom}${ridges(false)}${lid}</g>`
      + `<g class="sk"><g class="fly">${stork}</g></g></g></g>`;
    css += `.sc-${id} .lid { transform-box: view-box; transform-origin: 186px 280px; transform: rotate(-34deg); transition: transform .35s ease-in .3s; }
      .on2 .sc-${id} .lid { transform: none; }
      .sc-${id} .fly { transform: translate(260px, -120px); opacity: 0; transition: transform 1.3s ease-out .6s, opacity .3s ease .6s; }
      .on1 .sc-${id} .fly { transform: none; opacity: 1; }
      @keyframes ${id}-peck { 0%, 100% { transform: none; } 50% { transform: translate(-6px, 10px); } }
      .on1 .sc-${id} .sk { animation: ${id}-peck .3s ease-in-out 2s 3; }
      .on2 .sc-${id} .fight { animation: ${id}-shake .45s ease-in-out .7s 3; }`;
    body += at(1, 'pop', tag(230, 336, '조개', ROLE.o, 19), 0.3) + at(1, 'pop', tag(400, 336, '황새', ROLE.w, 19), 1.8);
    // 칸 2: 맞부딪친 자리의 반짝임
    const star = (x, y, r) => `<path d="M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`;
    body += at(2, 'pop', star(292, 238, 16), 0.6) + at(2, 'pop', star(250, 226, 11), 0.9);
    // 칸 3: 어부가 와서 그물을 던진다
    const fisher = person(566, 224, C.blue, 18) + `<path d="M544 176 H588 L578 160 H554 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M572 312 V252 M558 312 V252" stroke="${C.blue}" stroke-width="10" stroke-linecap="round"/>`;
    body += `<g class="b3"><g class="fs">${fisher}</g></g>`;
    css += `.sc-${id} .fs { transform: translateX(90px); opacity: 0; transition: transform .9s ease-out .1s, opacity .4s ease .1s; }
      .on3 .sc-${id} .fs { transform: none; opacity: 1; }`;
    const netLines = [];
    for (let i = 0; i <= 8; i++) netLines.push(`M${180 + i * 34} ${312} L${f(318 + (i - 4) * 12)} 150`);
    for (let k = 1; k <= 4; k++) { const y = 150 + k * 30, sp = 52 + (k / 5) * 98 + 14 * k / 4; netLines.push(`M${f(318 - sp - 26)} ${y} Q318 ${y - 10} ${f(318 + sp + 26)} ${y}`); }
    const net = `<path d="M180 312 Q180 150 318 146 Q456 150 456 312" fill="${C.sky}" fill-opacity=".35" stroke="${C.blue}" stroke-width="4"/>`
      + `<path d="${netLines.join(' ')}" stroke="${C.blue}" stroke-width="2" fill="none" opacity=".75"/>`
      + `<path d="M440 212 Q500 190 548 214" stroke="${C.muted}" stroke-width="3" fill="none" stroke-dasharray="6 5"/>`;
    body += `<g class="b3"><g class="nt">${net}</g></g>`;
    css += `.sc-${id} .nt { transform: translateY(-190px); opacity: 0; transition: transform .8s ease-in 1.1s, opacity .3s ease 1.1s; }
      .on3 .sc-${id} .nt { transform: none; opacity: 1; }`;
    body += at(3, 'pop', tag(566, 336, '어부', ROLE.s, 19), 0.8);
    body += `<g class="b4"><circle class="ring ring4" cx="566" cy="192" r="40" fill="none" stroke="${C.yellow}" stroke-width="5"/></g>` + at(4, 'pop', tag(320, 44, '어부지리', ROLE.y, 24), 0.4);
    put(K + '6/어부지리', svg(id, body, css));
  })();

  // ── 6단원: 외손(하백 → 딸 유화 → 주몽, 하백 쪽에서 보면 주몽은 딸이 낳은 자식) ──────────────────────────────
  (function () {
    const id = 't51-k3-oeson';
    let css = base(id);
    const X = 180;
    // 물의 신: 물결 무늬
    const waves = `<g class="wv">${[0, 1, 2].map((k) => `<path d="M${40} ${52 + k * 14} q8 -7 16 0 t16 0 t16 0 t16 0" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
    let body = at(1, 'fin', waves);
    css += `@keyframes ${id}-wv { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } } .on1 .sc-${id} .wv { animation: ${id}-wv 1.6s ease-in-out infinite; }`;
    body += at(1, 'pop', person(X, 88, C.blue, 18)) + at(1, 'pop', tag(X + 76, 72, '하백', ROLE.s, 21), 0.3);
    body += drawPath(`M${X} 120 V148`, C.ink, 1, { width: 4, delay: 0.6 });
    body += at(1, 'pop', person(X, 196, C.orange, 18), 1.1) + at(1, 'pop', tag(X + 76, 180, '유화', ROLE.o, 21), 1.3) + at(1, 'pop', tag(X + 156, 180, '딸', ROLE.w, 20), 1.5);
    body += drawPath(`M${X} 228 V256`, C.ink, 2, { width: 4, delay: 0.2 });
    body += at(2, 'pop', `<g class="zm">${person(X, 300, C.green, 16)}</g>`, 0.8) + at(2, 'pop', tag(X + 76, 288, '주몽', ROLE.p, 21), 1.0);
    // 하백 쪽에서 주몽을 가리키는 굽은 화살표
    body += drawPath(`M${X + 120} 72 C 560 72, 560 288, ${X + 132} 288`, C.purple, 3, { width: 5, delay: 0.2, end: [X + 132, 288], ang: Math.PI });
    body += at(3, 'pop', tag(522, 180, '외손', ROLE.x, 24), 1.1);
    css += pulseCss(id, '.zm', 3, 1.4);
    body += `<g class="b4"><path class="draw draw4" pathLength="1" d="M${X} 120 V148 M${X} 228 V256" stroke="${C.green}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    body += glowRect(468, 156, 108, 48, 4, C.purple, 0.6, 24);
    put(K + '6/외손', svg(id, body, css));
  })();

  // ── 6단원: 파장(한 사람의 칭찬 한마디가 끼친 기운이 곁의 친구들, 다시 더 먼 친구들로 번진다 — 영향이 퍼져 나가는 정도) ──────────────
  // 교과서 280쪽 '그리움이라는 감정은 파장이 물결처럼 꽤 오랫동안 지속되니까요'는 물결이 빗댄 것이고 파장은 마음이 끼치는 기운이므로, 물 위 동그라미로 그리지 않는다.
  (function () {
    const id = 't51-k3-pajang';
    let css = base(id);
    const O = [320, 206];
    const near = [[455, 206], [320, 290], [185, 206], [320, 122]];
    const far = [[588, 214], [508, 316], [132, 316], [52, 214], [132, 96], [508, 96]];
    const from = [0, 1, 1, 2, 3, 3]; // 먼 친구마다 기운을 건네는 가까운 친구
    const node = (x, y, color, cls, r = 13) => `<g class="${cls}">${person(x, y, C.line, r)}<g class="lit">${person(x, y, color, r)}</g></g>`;
    let body = '';
    // 번지는 줄(가운데 → 가까운 친구 → 먼 친구)
    near.forEach(([x, y], i) => { body += drawPath(`M${O[0]} ${O[1] - 12} L${x} ${y - 12}`, C.orange, 2, { width: 4, delay: 0.2 + i * 0.15 }); });
    far.forEach(([x, y], i) => { const [nx, ny] = near[from[i]]; body += drawPath(`M${nx} ${ny - 12} L${x} ${y - 12}`, C.orange, 3, { width: 4, delay: 0.2 + i * 0.12 }); });
    body += near.map(([x, y], i) => at(1, 'pop', node(x, y, C.blue, `nn nn${i}`), 0.3 + i * 0.08)).join('');
    body += far.map(([x, y], i) => at(1, 'pop', node(x, y, C.purple, `fn fn${i}`, 12), 0.5 + i * 0.06)).join('');
    css += `.sc-${id} .lit { opacity: 0; transition: opacity .6s ease; }`
      + near.map((_, i) => `.on2 .sc-${id} .nn${i} .lit { opacity: 1; transition-delay: ${f(1.0 + i * 0.15)}s; }`).join('\n')
      + far.map((_, i) => `.on3 .sc-${id} .fn${i} .lit { opacity: 1; transition-delay: ${f(1.0 + i * 0.12)}s; }`).join('\n');
    css += `.on2 .sc-${id} .nn { animation: ${id}-pulse .6s ease-in-out 1.2s 1; transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .fn { animation: ${id}-pulse .6s ease-in-out 1.2s 1; transform-box: fill-box; transform-origin: center; }`;
    // 가운데: 칭찬하는 사람과 반짝임
    body += `<g class="b1"><circle class="ring ring1" cx="${O[0]}" cy="${O[1] - 18}" r="30" fill="none" stroke="${C.yellow}" stroke-width="5"/></g>`;
    body += at(1, 'pop', `<circle cx="${O[0]}" cy="${O[1] - 18}" r="34" fill="${TAN}"/>` + person(O[0], O[1], C.green, 15));
    body += at(1, 'pop', tag(O[0], 34, '칭찬 한마디', ROLE.y, 20), 0.6) + drawPath(`M${O[0]} 52 L${O[0]} 66`, C.orange, 1, { width: 3, delay: 0.9 });
    // 칸 4: 퍼진 정도(가운데에서 가장 먼 친구까지)
    body += drawArrow(O[0] + 40, 340, 560, 340, C.orange, 4, { width: 4, delay: 0.3 }) + drawArrow(O[0] - 40, 340, 80, 340, C.orange, 4, { width: 4, delay: 0.3 });
    body += at(4, 'pop', tag(O[0], 340, '파장', ROLE.o, 22), 0.5);
    css += `.on4 .sc-${id} .draw3, .on4 .sc-${id} .draw2 { animation: ${id}-flash 1.4s ease-in-out .2s both; }`;
    put(K + '6/파장', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
