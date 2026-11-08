// 국어 6-1 낱말 도식(5단원 자신의 글쓰기 과정을 살펴봐요·6단원 비판적으로 읽어요): 주장하는 글의 짜임, 인용과 출처,
// 글쓰기 과정(생성·조직·개요·통일성), 타당성·적절성, 제품 정보, 온돌, 다의어, 낱말 견주기를 낱말 조각과 단순한 도형으로 움직여 보인다.
// 예는 교과서 그대로: 「모두가 함께하는 디지털 세상을 만들자」(229~230쪽, 문단 다섯), 「미세 플라스틱을 줄이자」(238~240쪽),
// 출처 네 가지(236쪽 교육부 희망 직업 표), 「스마트폰을 과다하게 사용하지 말자」 문단 4(274쪽), 「보송보송 물놀이용 신발」(285~287쪽),
// 손 소독제·과채주스(276~277쪽), 받치다(293쪽), 껍데기·껍질·봉오리·봉우리(303쪽). 「제품 정보를 확인하자」의 일부러 틀린 문단(용량)은 그리지 않는다.
// 도구(tile·tag·row·base·move 따위)는 figures/4-2/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
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

  const K = '6-1/국어/';
  const TAN = '#fdf3d3';
  const bar = (x, y, w, color = '#b5c4be', h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;

  // ── 5단원: 주장(생각 조각이 앞에 서고, 이유와 근거가 아래에서 받친다) ──────────────────────────────
  (function () {
    const id = 't61-k3-jujang';
    let css = base(id);
    let body = at(1, 'pop', person(80, 236, C.purple, 20)) + at(1, 'fin', tag(80, 312, '글쓴이', ROLE.x, 19), 0.2);
    body += `<g class="b1">` + [[112, 176, 6], [134, 152, 8], [162, 126, 10]].map(([x, y, r], i) => g('pop pop1', `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`, 0.4 + i * 0.2)).join('') + '</g>';
    body += at(1, 'pop', `<g class="bd">${tile(384, 88, '미세 플라스틱을 줄여야 한다', { size: 24, h: 60, fill: TAN, stroke: C.orange, sw: 4 })}</g>`, 1.1);
    const col = (x, y1, y2) => `<rect x="${x - 8}" y="${y1}" width="16" height="${y2 - y1}" fill="${C.line}"/>`;
    body += at(2, 'rise', col(294, 118, 158) + tile(294, 182, '건강 위협', { size: 22, h: 48, fill: C.sky, stroke: C.blue }), 0.2);
    body += at(2, 'rise', col(474, 118, 158) + tile(474, 182, '생태계 파괴', { size: 22, h: 48, fill: C.sky, stroke: C.blue }), 0.7);
    body += at(2, 'pop', tag(594, 182, '이유', ROLE.s, 20), 1.2);
    body += at(3, 'fin', `<rect x="196" y="298" width="376" height="12" rx="6" fill="${C.muted}"/>`);
    body += at(3, 'rise', col(294, 206, 250) + tile(294, 272, '연구 자료', { size: 20, h: 44, fill: C.mint, stroke: C.green }), 0.3);
    body += at(3, 'rise', col(474, 206, 250) + tile(474, 272, '전문가 인터뷰', { size: 20, h: 44, fill: C.mint, stroke: C.green }), 0.7);
    body += at(3, 'pop', tag(594, 272, '근거', ROLE.p, 20), 1.1);
    body += glowRect(206, 52, 356, 72, 4, C.orange, 0.2) + at(4, 'pop', tag(384, 24, '주장', ROLE.y, 22), 0.5);
    css += pulseCss(id, '.bd', 4, 0.7);
    put(K + '5/주장', svg(id, body, css));
  })();

  // ── 5단원: 서론·본론·결론(「모두가 함께하는 디지털 세상을 만들자」 문단 다섯이 세 칸으로 나뉜다) ──────────────────────────────
  const essay = (focus) => {
    const names = ['서론', '본론', '결론'];
    const id = 't61-k3-' + ['seoron', 'bonron', 'gyeollon'][focus];
    let css = base(id);
    const Z = [[56, 118, C.sky, C.blue], [122, 278, C.mint, C.green], [282, 334, C.peach, C.orange]];
    const RL = [ROLE.s, ROLE.p, ROLE.o];
    let body = at(1, 'fin', `<rect x="18" y="16" width="228" height="326" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + bar(68, 36, 128, '#8fa39b', 10));
    body += at(1, 'fin', Z.map(([y1, y2, fill]) => `<rect x="26" y="${y1}" width="212" height="${y2 - y1}" rx="8" fill="${fill}" opacity=".6"/>`).join(''), 0.3);
    const P = [64, 130, 184, 238, 292];
    let lines = '';
    P.forEach((y0, k) => {
      lines += `<circle cx="44" cy="${y0 + 15}" r="12" fill="white" stroke="${C.muted}" stroke-width="2"/>` + text(44, y0 + 21.5, k + 1, { size: 18, color: C.muted });
      [0, 1, 2].forEach((j) => { lines += bar(j === 0 ? 72 : 64, y0 + j * 15, j === 2 ? 104 : (j === 0 ? 154 : 164), '#a9bab3', 8); });
    });
    body += at(1, 'fin', lines, 0.5);
    const [y1, y2, , col] = Z[focus], mid = (y1 + y2) / 2;
    body += glowRect(23, y1 - 3, 218, y2 - y1 + 6, 2, col, 0.1, 10);
    body += drawArrow(240, mid, 272, mid, col, 2, { width: 4, delay: 0.3 });
    body += at(2, 'fin', `<rect x="276" y="36" width="350" height="284" rx="14" fill="white" stroke="${col}" stroke-width="3"/>`, 0.5);
    body += at(2, 'pop', tag(336, 66, ['문단 1', '문단 2~4', '문단 5'][focus], RL[focus], 18), 0.7);
    if (focus === 0) {
      body += at(2, 'pop', tag(350, 116, '문제 상황', ROLE.o, 19), 1.0) + at(2, 'pop', tile(452, 162, '디지털 기기가 불편한 사람', { size: 20, h: 44 }), 1.3);
      body += at(3, 'pop', tag(328, 218, '주장', ROLE.y, 19), 0.2) + at(3, 'pop', `<g class="cl">${tile(452, 266, '활용 능력 차이를 줄여야 한다', { size: 20, h: 44, fill: TAN, stroke: C.orange })}</g>`, 0.6);
      css += pulseCss(id, '.cl', 3, 1.2);
    } else if (focus === 1) {
      const R = [['첫째', '소외 계층 불편', '기사'], ['둘째', '교육 불평등', '통계'], ['셋째', '사회적 불평등', '인터뷰']];
      R.forEach(([n, why, ev], k) => {
        const y = 120 + k * 66;
        body += at(2, 'slide', tag(320, y, n, ROLE.w, 18) + tile(442, y, why, { size: 19, h: 42, w: 160, fill: C.mint, stroke: C.green }), 1.0 + k * 0.3);
        body += at(3, 'pop', `<path d="M522 ${y} H540" stroke="${C.blue}" stroke-width="3"/>` + tag(580, y, ev, ROLE.s, 18), 0.2 + k * 0.4);
      });
    } else {
      const R = ['소외 계층 불편', '교육 불평등', '사회적 불평등'];
      R.forEach((why, k) => { body += at(2, 'slide', tile(372, 104 + k * 42, why, { size: 18, h: 34, w: 150, fill: C.mint, stroke: C.green }), 0.9 + k * 0.2); });
      body += at(2, 'fin', braceR(460, 86, 206, C.green), 1.5) + at(2, 'pop', `<g class="sm">${tile(540, 146, '소외와 불평등', { size: 19, h: 42 })}</g>`, 1.7);
      body += at(3, 'pop', tag(348, 228, '다시 강조', ROLE.y, 18), 0.2);
      body += at(3, 'pop', `<g class="cl">${tile(452, 280, '활용 능력 차이를 줄여야 한다!', { size: 22, h: 54, fill: TAN, stroke: C.orange, sw: 4 })}</g>`, 0.5);
      body += `<g class="b3"><rect class="ring ring3" x="290" y="252" width="324" height="56" rx="12" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:.9s"/></g>`;
      css += pulseCss(id, '.cl', 3, 1.0);
    }
    // 칸 4: 세 칸 이름표, 맡은 칸만 색을 띤다
    Z.forEach(([a, b], k) => {
      body += at(4, 'pop', `<g class="zt zt${k}">${tag(132, (a + b) / 2, names[k], k === focus ? RL[k] : ROLE.w, 20)}</g>`, 0.2 + k * 0.2);
    });
    body += glowRect(23, y1 - 3, 218, y2 - y1 + 6, 4, col, 0.8, 10);
    css += pulseCss(id, `.zt${focus} .tl`, 4, 1.0);
    put(K + '5/' + names[focus], svg(id, body, css));
  };
  essay(0);
  essay(1);
  essay(2);

  // ── 5단원: 인용(전문가의 말이 내 글로 옮겨 와 따옴표와 이름이 붙는다) ──────────────────────────────
  (function () {
    const id = 't61-k3-inyong';
    let css = base(id);
    let body = at(1, 'pop', person(84, 264, C.green, 20)) + at(1, 'fin', tile(84, 326, '박○○ 교수', { size: 18, h: 32, rx: 16, fill: C.mint, stroke: C.green, sw: 2.5, w: 122 }), 0.2);
    body += at(1, 'pop', `<rect x="22" y="36" width="290" height="124" rx="18" fill="white" stroke="${C.green}" stroke-width="3"/>`
      + `<path d="M70 158 L84 200 L104 158" fill="white" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/><path d="M73 159 H101" stroke="white" stroke-width="5"/>`
      + text(167, 88, '미세 플라스틱은', { size: 20 }) + text(167, 128, '해양 오염의 원인이 된다', { size: 20 }), 0.4);
    // 내 글
    body += at(1, 'fin', `<rect x="340" y="20" width="278" height="290" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + bar(364, 50, 230) + bar(358, 70, 236) + bar(358, 90, 170) + bar(358, 260, 236) + bar(358, 282, 150), 0.8);
    body += `<g class="b1 h3"><rect class="fin fin1" style="animation-delay:1s" x="356" y="146" width="246" height="92" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 7"/></g>`;
    // 칸 2: 말이 날아와 빈자리에 들어간다
    body += `<g class="b2"><g class="qm">${text(479, 181, '미세 플라스틱은', { size: 20 })}${text(479, 221, '해양 오염의 원인이 된다', { size: 20 })}</g></g>`;
    css += steps(id, 'qm', 'translate(-312px, -93px)', [[2, 'none', 0.3]], { dur: 1.2, box: false });
    // 칸 3: 따옴표와 이름
    body += at(3, 'drop', text(404, 194, '“', { size: 44, color: C.orange, anchor: 'end' }), 0.2) + at(3, 'drop', text(590, 236, '”', { size: 44, color: C.orange, anchor: 'start' }), 0.5);
    body += at(3, 'pop', tile(479, 122, '박○○ 교수에 따르면', { size: 18, h: 32, rx: 16, fill: C.mint, stroke: C.green, sw: 2.5, w: 204 }), 0.9);
    body += glowRect(350, 102, 258, 140, 4, C.green, 0.2) + at(4, 'pop', tag(479, 336, '인용', ROLE.p, 22), 0.5);
    put(K + '5/인용', svg(id, body, css));
  })();

  // ── 5단원: 출처(표 아래 빈 출처 칸이 누가·언제·자료명·실린 곳으로 채워진다) ──────────────────────────────
  (function () {
    const id = 't61-k3-chulcheo';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="18" y="18" width="290" height="252" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(163, 50, '초등학생 희망 직업', { size: 19 }));
    const jobs = ['운동선수', '의사', '크리에이터', '교사', '요리사'], len = [104, 90, 78, 66, 56];
    body += jobs.map((j, i) => {
      const y = 84 + i * 30;
      return at(1, 'fin', text(34, y + 6, (i + 1) + '위', { size: 18, color: C.muted, anchor: 'start' }) + text(76, y + 6, j, { size: 18, anchor: 'start' })
        + `<rect class="jb" x="184" y="${y - 7}" width="${len[i]}" height="14" rx="7" fill="${C.blue}" style="transition-delay:${0.4 + i * 0.12}s"/>`, 0.2 + i * 0.12);
    }).join('');
    css += `.sc-${id} .jb { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out; } .on1 .sc-${id} .jb { transform: none; }`;
    body += at(1, 'fin', text(34, 250, '출처:', { size: 18, anchor: 'start' }), 0.9);
    body += `<g class="b1 h3">${g('fin fin1', `<rect x="88" y="228" width="206" height="32" rx="8" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>` + text(191, 251, '?', { size: 22, color: C.muted }), 1.0)}</g>`;
    body += glowRect(84, 224, 214, 40, 2, C.orange, 0.1, 10);
    body += at(3, 'fin', text(88, 250, '교육부(2025), …', { size: 18, color: C.green, anchor: 'start' }), 1.4);
    // 오른쪽 카드
    body += at(1, 'fin', `<rect x="326" y="24" width="306" height="312" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`, 0.5);
    const lab = ['누가', '언제', '자료명', '실린 곳'], val = ['교육부', '2025년', '초등학생 희망 직업', '진로 교육 현황 조사'], rl = [ROLE.s, ROLE.o, ROLE.p, ROLE.x], ys = [66, 142, 218, 294];
    lab.forEach((l, k) => {
      const y = ys[k];
      body += at(1, 'pop', tag(380, y, l, rl[k], 18), 0.7 + k * 0.15);
      body += `<g class="b1 h${k < 2 ? 2 : 3}">${g('fin fin1', `<rect x="430" y="${y - 20}" width="192" height="40" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 1.2)}</g>`;
      body += at(k < 2 ? 2 : 3, 'pop', tile(526, y, val[k], { size: 18, h: 40, w: 192, fill: 'white', stroke: rl[k][1] }), k < 2 ? 0.6 + k * 0.5 : 0.2 + (k - 2) * 0.5);
    });
    body += glowRect(322, 20, 314, 320, 4, C.green, 0.2) + at(4, 'pop', tag(163, 312, '출처', ROLE.p, 22), 0.5);
    put(K + '5/출처', svg(id, body, css));
  })();

  // ── 5단원: 계층(섞여 있던 사람들이 솜씨가 비슷한 무리끼리 층으로 나뉜다) ──────────────────────────────
  (function () {
    const id = 't61-k3-gyecheung';
    let css = base(id);
    const bands = [[24, 106], [114, 196], [204, 286]], fills = [C.mint, C.sky, C.lilac];
    let body = bands.map(([a, b], L) => at(2, 'fin', `<rect class="bb bb${L}" x="150" y="${a}" width="470" height="${b - a}" rx="12" fill="${fills[L]}" opacity=".7"/>`, 0.1 + L * 0.1)).join('');
    body += [['잘 다룸', ROLE.p], ['보통', ROLE.s], ['어려움', ROLE.x]].map(([l, r], L) => at(2, 'pop', tag(88, (bands[L][0] + bands[L][1]) / 2, l, r, 19), 1.2 + L * 0.15)).join('');
    css += `.sc-${id} .bb2 { transition: fill .6s ease; } .on3 .sc-${id} .bb2 { fill: ${C.peach}; }`;
    const S = [[300, 170], [530, 260], [90, 100], [430, 90], [190, 250], [570, 130], [250, 80], [380, 280], [110, 200], [470, 190], [596, 296], [340, 100]];
    const RR = [12, 9, 11, 10, 12, 9, 11, 12, 10, 12, 11, 9], cols = [C.blue, C.orange, C.green, C.purple], screen = [C.green, C.yellow, C.line];
    const XS = [236, 316, 396, 476], YS = [78, 168, 258];
    S.forEach(([sx, sy], i) => {
      const L = Math.floor(i / 4), x = XS[i % 4], y = YS[L], r = RR[i];
      const phone = `<rect x="${f(x + r * 1.6 + 3)}" y="${y - 6}" width="11" height="18" rx="2.5" fill="${screen[L]}" stroke="${C.ink}" stroke-width="1.8"/>`;
      body += `<g class="pp pp${i}">` + at(1, 'pop', person(x, y, cols[i % 4], r) + phone, 0.1 + i * 0.07) + '</g>';
      css += steps(id, `pp${i}`, `translate(${sx - x}px, ${sy - y}px)`, [[2, 'none', 0.1 + (i % 4) * 0.08]], { dur: 1.1, box: false });
      if (L === 2) body += at(3, 'pop', text(x + 22, 226, '?', { size: 22, color: C.purple }), 0.4 + (i % 4) * 0.15);
    });
    // 칸 3: 맨 아래 층 — 병원에서 오래 기다림(시계)
    body += at(3, 'pop', `<circle cx="568" cy="245" r="24" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M568 245 V231" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`
      + `<g class="hand"><path d="M568 245 L580 245" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/></g>`, 0.3);
    css += `@keyframes ${id}-spin { to { transform: rotate(360deg); } }
      .sc-${id} .hand { transform-box: view-box; transform-origin: 568px 245px; }
      .on3 .sc-${id} .hand { animation: ${id}-spin 1.2s linear .5s infinite; }`;
    body += at(3, 'pop', tag(400, 318, '디지털 소외 계층', ROLE.x, 19), 1.1);
    body += bands.map(([a, b], L) => glowRect(146, a - 4, 478, b - a + 8, 4, [C.green, C.blue, C.purple][L], 0.2 + L * 0.4, 14)).join('');
    body += at(4, 'pop', tag(88, 318, '계층', ROLE.p, 22), 1.2);
    put(K + '5/계층', svg(id, body, css));
  })();

  // ── 5단원: 분해(플라스틱병이 큰 조각으로, 다시 미세 플라스틱으로 쪼개진다) ──────────────────────────────
  (function () {
    const id = 't61-k3-bunhae';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="0" y="262" width="640" height="38" fill="${TAN}"/><rect x="0" y="300" width="640" height="60" fill="${C.sky}"/>`);
    body += `<g class="wv">` + at(1, 'fin', [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${i * 120 - 20} 322 q15 -10 30 0 t30 0 t30 0" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')) + '</g>';
    css += `@keyframes ${id}-wave { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(22px); } }
      .on2 .sc-${id} .wv { animation: ${id}-wave 1.6s ease-in-out infinite; }`;
    const PC = [
      `<rect x="302" y="56" width="36" height="22" rx="4" fill="${C.blue}"/><path d="M306 78 H334 L352 110 L380 130 H260 L288 110 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`,
      `<path d="M260 130 L330 130 L310 185 L260 200 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`,
      `<path d="M330 130 L380 130 L380 210 L310 185 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`,
      `<path d="M260 200 L310 185 L380 210 L380 254 Q380 262 372 262 H268 Q260 262 260 254 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`
    ].map((p) => p.replace(/stroke="[^"]+" stroke-width="3"/, `class="pe" stroke="${C.blue}" stroke-width="3"`));
    const away = ['translate(-190px, 150px) rotate(-80deg)', 'translate(-46px, 76px) rotate(-62deg)', 'translate(84px, 70px) rotate(70deg)', 'translate(0px, 6px) rotate(4deg)'];
    const outline = `<path class="ol" d="M306 78 H334 L352 110 L380 130 V254 Q380 262 372 262 H268 Q260 262 260 254 V130 L288 110 Z" fill="none" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`;
    const silhouette = outline.replace('fill="none"', `fill="${C.sky}"`).replace(/stroke="[^"]+"/, 'stroke="none"');
    body += `<g class="pcs">` + at(1, 'pop', silhouette, 0.3) + PC.map((p, k) => `<g class="pc pc${k}">${at(1, 'pop', p, 0.3)}</g>`).join('') + at(1, 'pop', outline, 0.3) + '</g>';
    css += `.sc-${id} .pe { stroke-opacity: 0; transition: stroke-opacity .2s ease 1s; } .on2 .sc-${id} .pe { stroke-opacity: 1; }
      .sc-${id} .ol { transition: opacity .2s ease 1s; } .on2 .sc-${id} .ol { opacity: 0; }`;
    PC.forEach((_, k) => { css += steps(id, `pc${k}`, 'none', [[2, away[k], 1.0]], { dur: 0.8 }); });
    body += `<g class="b2"><path class="ck" pathLength="1" d="M330 130 L310 185 L260 200 M310 185 L380 210" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linejoin="round"/></g>`;
    css += `.sc-${id} .ck { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .7s ease .2s, opacity .3s ease 1s; }
      .on2 .sc-${id} .ck { stroke-dashoffset: 0; opacity: 0; }
      .sc-${id} .pcs { transform-box: fill-box; transform-origin: center; transition: transform .7s ease-in, opacity .7s ease-in; }
      .on3 .sc-${id} .pcs { transform: scale(.25); opacity: 0; }`;
    // 해와 파도
    body += at(2, 'pop', `<g class="sun"><circle cx="80" cy="70" r="24" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`
      + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(80 + 32 * c)} ${f(70 + 32 * s)} L${f(80 + 42 * c)} ${f(70 + 42 * s)}" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`; }).join('') + '</g>');
    css += `@keyframes ${id}-spin { to { transform: rotate(360deg); } }
      .sc-${id} .sun { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .sun { animation: ${id}-spin 6s linear infinite; }`;
    // 칸 3: 잘게 쪼개진 조각들
    const bits = [[160, 262], [184, 246], [204, 276], [228, 256], [250, 284], [270, 248], [292, 270], [316, 286], [334, 254], [356, 276], [378, 246], [398, 284], [420, 262], [440, 278], [456, 250], [214, 236], [306, 240], [388, 268]];
    const bit = (x, y, k) => k % 3 === 0 ? `<path d="M${x - 6} ${y + 5} L${x + 1} ${y - 7} L${x + 7} ${y + 4} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`
      : k % 3 === 1 ? `<rect x="${x - 5}" y="${y - 4}" width="10" height="8" rx="1.5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2" transform="rotate(${k * 23} ${x} ${y})"/>`
        : `<path d="M${x - 7} ${y} L${x - 1} ${y - 5} L${x + 6} ${y - 1} L${x + 2} ${y + 6} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    body += `<g class="b3">` + bits.map(([x, y], k) => g('pop pop3', bit(x, y, k), 0.4 + (k % 6) * 0.1)).join('') + '</g>';
    // 돋보기
    body += at(3, 'pop', `<circle cx="540" cy="118" r="60" fill="white" stroke="${C.ink}" stroke-width="4"/><path d="M582 160 L612 192" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>`
      + `<path d="M512 102 L526 82 L540 104 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/><rect x="548" y="88" width="20" height="16" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5" transform="rotate(20 558 96)"/>`
      + `<path d="M512 140 H568 M512 133 V147 M568 133 V147" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>`, 1.0);
    body += at(3, 'fin', text(540, 206, '5 mm 이하', { size: 18, color: C.orange }), 1.3) + at(3, 'pop', tag(540, 240, '미세 플라스틱', ROLE.s, 19), 1.5);
    body += glowRect(140, 222, 330, 80, 4, C.blue, 0.2) + at(4, 'pop', tag(320, 332, '분해', ROLE.s, 22), 0.5);
    put(K + '5/분해', svg(id, body, css));
  })();

  // ── 5단원: 매립(움푹한 구덩이에 쓰레기를 붓고 흙으로 덮어 메운다) ──────────────────────────────
  (function () {
    const id = 't61-k3-maerip';
    let css = base(id);
    let body = at(1, 'fin', `<path d="M20 150 H196 L232 302 H408 L444 150 H620 V344 H20 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`);
    const tuft = (x) => `<path d="M${x - 8} 150 L${x - 4} 138 L${x} 150 L${x + 4} 136 L${x + 8} 150" stroke="${C.green}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
    body += at(1, 'fin', [50, 110, 160, 480, 540, 596].map(tuft).join(''), 0.3);
    body += `<g class="b1 h2">${g('fin fin1', `<path d="M210 160 L238 290 H402 L430 160" stroke="${C.muted}" stroke-width="2.5" fill="none" stroke-dasharray="8 7"/>` + text(320, 232, '구덩이', { size: 20, color: C.muted }), 0.6)}</g>`;
    // 칸 2: 쓰레기가 떨어져 쌓인다
    const bottle = (c1, c2) => `<rect x="-30" y="-11" width="60" height="22" rx="9" fill="${c1}" stroke="${c2}" stroke-width="2.5"/><rect x="30" y="-6" width="10" height="12" rx="2" fill="${c2}"/>`;
    const bag = `<path d="M-26 14 Q-30 -12 -10 -16 L-4 -24 L4 -24 L10 -16 Q30 -12 26 14 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const cup = `<path d="M-16 -18 H16 L11 18 H-11 Z" fill="white" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const junk = [[268, 286, 0, bottle(C.sky, C.blue)], [340, 284, 0, bag], [384, 282, -18, bottle('white', C.green)], [300, 252, 12, cup], [372, 246, 0, bag], [252, 246, -30, bottle(C.sky, C.blue)], [336, 222, 20, bottle('white', C.orange)], [404, 220, 0, cup]];
    body += junk.map(([x, y, r, s], k) => at(2, 'fall', `<g transform="translate(${x} ${y}) rotate(${r})">${s}</g>`, 0.15 + k * 0.17)).join('');
    // 칸 3: 흙으로 덮는다
    body += at(3, 'fall', `<path d="M196 150 L214 226 H426 L444 150 Z" fill="${C.peach}"/><path d="M214 226 H426" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="8 6"/><path d="M194 150 H446" stroke="${C.orange}" stroke-width="3"/>`
      + [[250, 186], [300, 200], [360, 180], [400, 204], [330, 168]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${C.orange}" opacity=".5"/>`).join(''), 0.2);
    body += `<g class="b3">` + [230, 280, 330, 380, 420].map((x, k) => g('pop pop3', tuft(x), 1.0 + k * 0.12)).join('') + '</g>';
    body += glowRect(190, 144, 260, 164, 4, C.orange, 0.2) + at(4, 'pop', tag(320, 70, '매립', ROLE.o, 22), 0.5);
    put(K + '5/매립', svg(id, body, css));
  })();

  // ── 5단원: 글쓰기 과정(주제 「공공장소에서 조용히 하자」 — 교과서 248쪽 문제 상황 보기) ──────────────────────────────
  const TOPIC = '공공장소에서 조용히 하자';

  // 생성: 머릿속 전구와 설문지·신문에서 글감 조각이 새로 생겨난다
  (function () {
    const id = 't61-k3-saengseong';
    let css = base(id);
    let body = at(1, 'pop', person(80, 272, C.blue, 20));
    body += at(1, 'pop', `<g class="bulb"><circle cx="80" cy="166" r="20" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><rect x="71" y="185" width="18" height="12" rx="3" fill="${C.muted}"/></g>`, 0.3);
    body += `<g class="b2">` + [200, 240, 280, 320, 0].map((a, k) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return g('fin fin2', `<path d="M${f(80 + 28 * c)} ${f(166 + 28 * s)} L${f(80 + 40 * c)} ${f(166 + 40 * s)}" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`, k * 0.08); }).join('') + '</g>';
    body += at(1, 'drop', tile(390, 40, TOPIC, { size: 20, h: 44, fill: TAN, stroke: C.orange }), 0.6);
    const chip = (cls, cx, cy, label, [fill, stroke], from, n, delay) => {
      css += steps(id, cls, `translate(${from[0] - cx}px, ${from[1] - cy}px) scale(.2)`, [[n, 'none', delay]], { dur: 0.8, opacity: 0 }) + `\n.on${n} .sc-${id} .${cls} { opacity: 1; }`;
      return `<g class="b${n}"><g class="${cls}">${tile(cx, cy, label, { size: 20, h: 44, fill, stroke })}</g></g>`;
    };
    body += chip('c0', 250, 132, '남에게 방해', ROLE.x, [80, 166], 2, 0.3) + chip('c1', 446, 132, '안내 방송 놓침', ROLE.x, [80, 166], 2, 0.9);
    // 칸 3: 설문지와 신문에서 모은 조각
    const clip = `<rect x="500" y="276" width="40" height="50" rx="5" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="510" y="270" width="20" height="10" rx="3" fill="${C.muted}"/>`
      + [292, 304, 316].map((y) => `<path d="M508 ${y} h6 M520 ${y} h12" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`).join('');
    const news = `<rect x="566" y="278" width="54" height="46" rx="4" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="573" y="285" width="40" height="8" fill="${C.blue}"/>`
      + [302, 312].map((y) => `<path d="M573 ${y} H613" stroke="${C.muted}" stroke-width="2.5"/>`).join('') + `<rect x="573" y="296" width="14" height="22" fill="${C.sky}"/>`;
    body += at(3, 'pop', clip, 0) + at(3, 'pop', news, 0.15);
    body += chip('c2', 290, 222, '설문 조사', ROLE.s, [520, 300], 3, 0.5) + chip('c3', 460, 222, '뉴스 기사', ROLE.s, [593, 300], 3, 1.0);
    css += [0, 1, 2, 3].map((k) => pulseCss(id, `.c${k} .tl`, 4, 0.2 + k * 0.2)).join('');
    body += at(4, 'pop', tag(300, 318, '생성', ROLE.p, 22), 0.6);
    put(K + '5/생성', svg(id, body, css));
  })();

  // 조직: 흩어진 조각이 관련 있는 것끼리 묶이고, 서론·본론·결론 차례에 놓인다
  (function () {
    const id = 't61-k3-jojik';
    let css = base(id);
    // [이름, 칸 4 자리 cx, cy, 색, 칸 1 자리(cx, cy, 기울기), 칸 2 자리(cx, cy)]
    const CH = [
      ['공공장소 소음', 289, 75, ROLE.s, [480, 260, 7], [110, 300]],
      ['남에게 방해', 289, 150, ROLE.p, [150, 80, -8], [265, 110]],
      ['설문 조사', 408, 150, ROLE.x, [520, 110, 6], [384, 110]],
      ['안내 방송 놓침', 298, 212, ROLE.p, [320, 300, -5], [265, 190]],
      ['뉴스 기사', 426, 212, ROLE.x, [130, 220, 9], [393, 190]],
      ['조용히 하자', 280, 290, ROLE.y, [340, 170, -6], [540, 300]]
    ];
    // 칸 3: 틀
    let body2 = at(3, 'fin', `<rect x="140" y="40" width="360" height="290" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M140 110 H500 M140 250 H500 M226 40 V330" stroke="${C.line}" stroke-width="2.5"/>`);
    body2 += [['서론', 75, ROLE.s], ['본론', 180, ROLE.p], ['결론', 290, ROLE.o]].map(([l, y, r], k) => at(3, 'pop', tag(183, y, l, r, 19), 0.2 + k * 0.15)).join('');
    let body = body2;
    // 칸 2: 짝 묶음 상자(칸 3에 틀 안으로 함께 옮겨 간다)
    const boxes = [[222, 129, 244, 42, -24, -40], [222, 191, 262, 42, -33, -22]];
    boxes.forEach(([x, y, w, h, dx, dy], k) => {
      body += `<g class="b2"><g class="px px${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="7 5"/></g></g>`;
      css += steps(id, `px${k}`, `translate(${dx}px, ${dy}px)`, [[3, 'none', 0.6 + k * 0.3]], { dur: 1, box: false }) + `\n.sc-${id} .px${k} { opacity: 0; } .on2 .sc-${id} .px${k} { opacity: 1; transition-delay: 1.2s; } .on3 .sc-${id} .px${k} { opacity: 1; }`;
    });
    CH.forEach(([label, x, y, rl, [jx, jy, jr], [px, py]], k) => {
      body += `<g class="ck${k}">` + at(1, 'pop', tile(x, y, label, { size: 18, h: 34, fill: rl[0], stroke: rl[1] }), 0.1 + k * 0.12) + '</g>';
      css += steps(id, `ck${k}`, `translate(${jx - x}px, ${jy - y}px) rotate(${jr}deg)`, [[2, `translate(${px - x}px, ${py - y}px)`, 0.2 + k * 0.1], [3, 'none', 0.5 + k * 0.12]], { dur: 1 });
    });
    body += glowRect(136, 36, 368, 298, 4, C.green, 0.2) + at(4, 'fin', braceR(516, 44, 326, C.green), 0.4) + at(4, 'pop', tag(574, 185, '조직', ROLE.p, 22), 0.7);
    put(K + '5/조직', svg(id, body, css));
  })();

  // 개요: 서론·본론·결론 칸에 할 말을 짧게 적어 글의 뼈대를 세운다
  (function () {
    const id = 't61-k3-gaeyo';
    let css = base(id);
    let body = at(1, 'fin', tag(58, 30, '주제', ROLE.p, 19) + text(102, 37, TOPIC, { size: 20, anchor: 'start' }));
    body += at(1, 'fin', `<rect x="24" y="56" width="592" height="278" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M124 56 V334 M24 124 H616 M24 264 H616" stroke="${C.line}" stroke-width="2.5"/>`, 0.2);
    body += [['서론', 90, ROLE.s], ['본론', 194, ROLE.p], ['결론', 299, ROLE.o]].map(([l, y, r], k) => at(1, 'pop', tag(74, y, l, r, 20), 0.5 + k * 0.2)).join('');
    const put1 = (x0, y, label, rl) => { const w = wOf(label, 19); return { x: x0 + w / 2, y, label, w, rl }; };
    const S1 = [put1(142, 90, '공공장소 소음 문제', ROLE.w), put1(352, 90, '주장: 조용히 하자', ROLE.y)];
    const S2 = [put1(142, 160, '이유 1: 남에게 방해', ROLE.p), put1(352, 160, '근거: 설문 조사', ROLE.x), put1(142, 228, '이유 2: 안내 방송 놓침', ROLE.p), put1(376, 228, '근거: 뉴스 기사', ROLE.x)];
    const S3 = [put1(142, 299, '주장 다시 강조', ROLE.y)];
    const slot = (p) => `<rect x="${f(p.x - p.w / 2)}" y="${p.y - 20}" width="${p.w}" height="40" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 7"/>`;
    body += `<g class="b1 h2">${g('fin fin1', S1.map(slot).join(''), 1.1)}</g><g class="b1 h3">${g('fin fin1', S2.concat(S3).map(slot).join(''), 1.1)}</g>`;
    const T = (p) => tile(p.x, p.y, p.label, { size: 19, h: 40, w: p.w, fill: p.rl[0], stroke: p.rl[1] });
    body += S1.map((p, k) => at(2, 'pop', T(p), 0.3 + k * 0.6)).join('');
    body += S2.map((p, k) => at(3, 'pop', T(p), 0.2 + k * 0.3)).join('') + S3.map((p) => at(3, 'pop', T(p), 1.4)).join('');
    css += `.sc-${id} .fr { transition: stroke .6s ease .3s, stroke-width .6s ease .3s; } .on4 .sc-${id} .fr { stroke: ${C.green}; stroke-width: 5; }`;
    body += `<g class="b1"><path class="fr" d="M124 56 V334 M24 124 H616 M24 264 H616" stroke="none" stroke-width="2.5" fill="none"/></g>`;
    body += glowRect(20, 52, 600, 286, 4, C.green, 0.2) + at(4, 'pop', tag(570, 30, '개요', ROLE.y, 22), 0.5);
    put(K + '5/개요', svg(id, body, css));
  })();

  // 통일성: 주제를 가리키지 않는 조각이 빠지고, 남은 조각이 모두 주제를 향한다
  (function () {
    const id = 't61-k3-tongilseong';
    let css = base(id);
    const labels = ['남에게 방해', '안내 방송 놓침', '떡볶이 맛집', '설문 조사'];
    const r = row(labels, { y: 286, size: 20, gap: 20 });
    const keep = [0, 1, 3];
    const r2 = row(keep.map((i) => labels[i]), { y: 286, size: 20, gap: 28 });
    let body = at(1, 'drop', `<g class="tp">${tile(320, 52, TOPIC, { size: 22, h: 52, fill: TAN, stroke: C.orange, sw: 4 })}</g>`);
    body += r.map((p, i) => `<g class="mv m${i}">` + at(1, 'rise', `<g class="k${i}">${tile(p.cx, p.y, p.label, { size: 20, h: 46, w: p.w })}</g>`, 0.3 + i * 0.15) + '</g>').join('');
    // 칸 2: 화살표
    body += `<g class="ar2">` + r.map((p, i) => i === 2
      ? drawPath(`M${f(p.cx)} 262 Q${f(p.cx + 10)} 190 ${f(p.cx + 96)} 168`, C.red, 2, { width: 4, delay: 0.3 + i * 0.25, end: [p.cx + 96, 168], ang: Math.atan2(168 - 190, 96 - 10) })
      : drawArrow(p.cx, 262, 320 + (p.cx - 320) * 0.35, 84, C.muted, 2, { width: 4, delay: 0.3 + i * 0.25 })).join('') + '</g>';
    body += `<g class="b2 h3">${g('pop pop2', text(f(r[2].cx + 112), 166, '?', { size: 26, color: C.red }), 1.6)}</g>`;
    css += paint(id, '.k2', [C.peach, C.red], 2, 1.0);
    css += `.sc-${id} .ar2 { transition: opacity .4s ease; } .on3 .sc-${id} .ar2 { opacity: 0; }`;
    css += `.on3 .sc-${id} .k2 { animation: ${id}-shake .5s ease-in-out 0s 1; }`;
    css += `.sc-${id} .mv { transition: transform .8s ease-in-out, opacity .5s ease; }
      .on3 .sc-${id} .m2 { transform: translateY(80px); opacity: 0; transition-delay: .5s; }`;
    keep.forEach((i, j) => { css += `.on3 .sc-${id} .m${i} { transform: translateX(${f(r2[j].cx - r[i].cx)}px); transition-delay: .8s; }`; });
    body += r2.map((p, j) => drawArrow(p.cx, 262, 320 + (p.cx - 320) * 0.35, 84, C.green, 3, { width: 4.5, delay: 1.0 + j * 0.1 })).join('');
    body += at(3, 'pop', check(f(r2[2].r + 30), 286, 11), 1.6);
    body += glowRect(r2[0].l - 44, 22, r2[2].r - r2[0].l + 102, 292, 4, C.green, 0.2, 18) + at(4, 'pop', tag(320, 338, '통일성', ROLE.p, 22), 0.5);
    put(K + '5/통일성', svg(id, body, css));
  })();

  // ── 6단원: 타당성(이유 네 기둥 가운데 주장을 받치지 않는 문단 4가 빠진다) ──────────────────────────────
  (function () {
    const id = 't61-k3-tadangseong';
    let css = base(id);
    let body = at(1, 'drop', `<g class="bd">${tile(320, 56, '스마트폰을 과다하게 사용하지 말자', { size: 22, h: 54, fill: TAN, stroke: C.orange, sw: 4 })}</g>`);
    const labels = ['대화 줄어듦', '집중력 저하', '공부에 도움', '불안함'];
    const r = row(labels, { y: 232, size: 19, gap: 34 });
    r.forEach((p, i) => {
      body += `<g class="ps ps${i}">` + at(1, 'rise', `<rect x="${f(p.cx - 7)}" y="83" width="14" height="128" fill="${C.line}"/>`
        + `<g class="k${i}">${tile(p.cx, p.y, p.label, { size: 19, h: 42, w: p.w, fill: C.sky, stroke: C.blue })}</g>` + text(p.cx, 278, '문단 ' + (i + 2), { size: 18, color: C.muted }), 0.4 + i * 0.15) + '</g>';
      if (i !== 2) body += at(2, 'pop', check(p.cx, 148, 11), 0.3 + (i === 3 ? 2 : i) * 0.4);
    });
    body += `<g class="b2 h3">${g('pop pop2', `<circle cx="${f(r[2].cx)}" cy="148" r="20" fill="white" stroke="${C.orange}" stroke-width="3"/>` + text(r[2].cx, 157, '?', { size: 24, color: C.orange }), 1.5)}</g>`;
    body += `<g class="ps ps2">` + at(3, 'pop', cross(r[2].cx, 148, 11), 0.1) + '</g>';
    css += paint(id, '.k2', [C.peach, C.red], 3, 0.2);
    css += `.sc-${id} .ps2 { transition: transform .8s ease-in, opacity .6s ease; }
      .on3 .sc-${id} .ps2 { transform: translateY(70px); opacity: 0; transition-delay: 1s; }`;
    body += glowRect(r[0].l - 12, 24, r[3].r - r[0].l + 24, 270, 4, C.green, 0.2) + at(4, 'pop', tag(320, 330, '타당성', ROLE.p, 22), 0.5);
    css += pulseCss(id, '.bd', 4, 0.8);
    put(K + '6/타당성', svg(id, body, css));
  })();

  // ── 6단원: 적절성(광고의 거짓·과장·감추는 내용이 드러날수록 막대가 내려간다) ──────────────────────────────
  (function () {
    const id = 't61-k3-jeokjeolseong';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="24" y="18" width="350" height="326" rx="12" fill="white" stroke="${C.blue}" stroke-width="3"/>` + text(199, 52, '보송보송 물놀이용 신발', { size: 20 }));
    body += at(1, 'pop', `<path d="M114 148 L118 100 Q120 88 134 88 H160 Q168 108 194 112 Q246 118 284 130 Q302 136 302 148 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`
      + `<rect x="104" y="146" width="204" height="18" rx="9" fill="${C.blue}"/><path d="M134 88 Q146 100 160 88" stroke="${C.blue}" stroke-width="3" fill="none"/>`
      + [[146, 124], [176, 128], [206, 128], [236, 132], [264, 138]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`).join(''), 0.3);
    body += at(1, 'fin', text(199, 210, '물속에서도 발이 보송보송!', { size: 20 }), 0.6) + at(1, 'fin', text(199, 250, '절대 미끄러지지 않는', { size: 20 }), 0.8);
    body += `<g class="b1 h3">${g('fin fin1', bar(90, 296, 160, C.line, 6), 1.0)}</g>`;
    // 오른쪽 막대
    body += at(1, 'fin', `<rect x="518" y="56" width="44" height="248" rx="22" fill="white" stroke="${C.ink}" stroke-width="3"/>`, 0.4);
    body += at(1, 'fin', `<rect class="gf" x="525" y="63" width="30" height="234" rx="15" fill="${C.green}"/>`, 0.6);
    css += `.sc-${id} .gf { transform-box: fill-box; transform-origin: center bottom; transition: transform 1s ease-in-out, fill .6s ease; }
      .on2 .sc-${id} .gf { transform: scaleY(.55); fill: ${C.orange}; transition-delay: 1.1s; }
      .on3 .sc-${id} .gf { transform: scaleY(.22); fill: ${C.red}; transition-delay: .9s; }`;
    // 칸 2: 거짓·과장 밑줄과 꼬리표
    const wavy = (x1, x2, y) => { let d = `M${x1} ${y}`; for (let x = x1; x < x2; x += 16) d += ` q4 -5 8 0 t8 0`; return d; };
    body += drawPath(wavy(90, 306, 220), C.red, 2, { width: 3, delay: 0.1 }) + drawPath(wavy(114, 284, 260), C.red, 2, { width: 3, delay: 0.6 });
    body += at(2, 'pop', `<path d="M312 206 H384" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="5 5"/>` + tag(422, 206, '거짓', ROLE.r, 19), 0.5);
    body += at(2, 'pop', `<path d="M290 246 H384" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="5 5"/>` + tag(422, 246, '과장', ROLE.r, 19), 1.0);
    // 칸 3: 구석의 작은 글이 커져 보인다
    body += at(3, 'pop', text(186, 302, '※ 모래 묻으면 미끄러짐', { size: 18, color: C.ink }), 0.3);
    body += at(3, 'slide', `<circle cx="330" cy="296" r="17" fill="none" stroke="${C.ink}" stroke-width="3.5"/><path d="M342 308 L356 322" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`, 0.1);
    body += at(3, 'pop', `<path d="M362 296 H384" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="5 5"/>` + tag(422, 296, '감춤', ROLE.r, 19), 0.7);
    body += glowRect(512, 50, 56, 260, 4, C.green, 0.2, 24) + at(4, 'pop', tag(540, 334, '적절성', ROLE.p, 22), 0.5);
    put(K + '6/적절성', svg(id, body, css));
  })();

  // ── 6단원: 손 소독제 병(문구·유효 성분이 함께 쓴다) ──────────────────────────────
  const bottle = (cx, inner) => `<rect x="${cx - 30}" y="58" width="44" height="14" rx="4" fill="white" stroke="${C.ink}" stroke-width="3"/>`
    + `<rect x="${cx + 12}" y="60" width="34" height="9" rx="3" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`
    + `<rect x="${cx - 9}" y="72" width="18" height="24" fill="white" stroke="${C.ink}" stroke-width="3"/>`
    + `<rect x="${cx - 30}" y="96" width="60" height="22" rx="6" fill="${C.blue}"/>`
    + `<rect x="${cx - 62}" y="118" width="124" height="196" rx="26" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
    + `<rect x="${cx - 50}" y="150" width="100" height="140" rx="8" fill="white" stroke="${C.line}" stroke-width="2"/>` + inner;
  const labelBox = (cx, label) => `<rect x="${cx - 46}" y="164" width="92" height="34" rx="6" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/>` + text(cx, 187, label, { size: 18 });

  // 문구: 병의 '의약 외품'과 광고판의 '최단 기간 최다 판매 1위!'
  (function () {
    const id = 't61-k3-mungu';
    let css = base(id);
    let body = at(1, 'pop', bottle(130, labelBox(130, '의약 외품') + bar(92, 222, 76) + bar(92, 242, 64) + bar(92, 262, 76) + bar(92, 280, 48)));
    body += glowRect(80, 160, 100, 42, 2, C.orange, 0.2, 8);
    body += drawPath('M184 181 Q230 181 250 236', C.orange, 2, { width: 3, delay: 0.6 });
    body += at(2, 'pop', `<g class="z1">${tile(332, 250, '의약 외품', { size: 26, h: 56, fill: TAN, stroke: C.orange, sw: 4 })}</g>`, 1.2);
    body += `<g class="b3"><g class="sg"><rect x="300" y="24" width="320" height="152" rx="14" fill="${TAN}" stroke="${C.orange}" stroke-width="4"/>`
      + text(460, 88, '최단 기간', { size: 30 }) + text(460, 140, '최다 판매 1위!', { size: 30 }) + '</g></g>';
    css += steps(id, 'sg', 'translateX(80px)', [[3, 'none', 0.2]], { dur: 0.8, box: false }) + `\n.sc-${id} .sg { opacity: 0; } .on3 .sc-${id} .sg { opacity: 1; }`;
    body += `<g class="b3"><rect class="flash flash3" style="animation-delay:1s" x="312" y="34" width="296" height="132" rx="10" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`;
    body += glowRect(260, 216, 146, 68, 4, C.orange, 0.2) + glowRect(294, 18, 332, 164, 4, C.orange, 0.4);
    css += pulseCss(id, '.z1', 4, 0.8);
    body += at(4, 'pop', tag(530, 270, '문구', ROLE.y, 22), 0.7);
    put(K + '6/문구', svg(id, body, css));
  })();

  // 함량: 혼합 음료(오렌지 과즙 8 %)와 과채주스(사과 착즙액 99 %)의 속
  (function () {
    const id = 't61-k3-hamryang';
    let css = base(id);
    const carton = (cx, k, name, juice, pct, color) => {
      const inner = `<rect x="${cx - 62}" y="120" width="124" height="190" fill="${C.sky}" opacity=".7"/>`
        + `<rect class="fr fr${k}" x="${cx - 62}" y="120" width="124" height="190" fill="${color}"/>`;
      const front = `<g class="fp"><rect x="${cx - 67}" y="113" width="134" height="204" fill="white"/>`
        + `<rect x="${cx - 58}" y="126" width="116" height="32" rx="6" fill="${TAN}"/>` + text(cx, 149, name, { size: 19 })
        + text(cx, 200, juice, { size: 19, color: C.muted }) + '</g>';
      return `<polygon points="${cx - 70},110 ${cx - 52},72 ${cx + 52},72 ${cx + 70},110" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`
        + `<rect x="${cx - 52}" y="60" width="104" height="12" rx="3" fill="white" stroke="${C.ink}" stroke-width="3"/>`
        + inner + front + `<rect x="${cx - 70}" y="110" width="140" height="210" fill="none" stroke="${C.ink}" stroke-width="3"/>`
        + `<g class="pc pc${k}">${text(cx, 258, pct, { size: 34 })}</g>`;
    };
    let body = at(1, 'pop', carton(170, 0, '혼합 음료', '오렌지 과즙', '8 %', C.orange), 0.1) + at(1, 'pop', carton(420, 1, '과채주스', '사과 착즙액', '99 %', C.yellow), 0.5);
    css += `.sc-${id} .fr { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform 1s ease-out .6s; }
      .on3 .sc-${id} .fr0 { transform: scaleY(.08); } .on3 .sc-${id} .fr1 { transform: scaleY(.99); }
      .sc-${id} .fp { transition: opacity .6s ease; } .on3 .sc-${id} .fp { opacity: .08; }`;
    body += glowRect(118, 226, 104, 46, 2, C.orange, 0.2, 10) + glowRect(360, 226, 120, 46, 2, C.orange, 0.6, 10);
    css += pulseCss(id, '.pc0', 2, 0.4) + pulseCss(id, '.pc1', 2, 0.8);
    // 칸 3: 95 % 선
    body += at(3, 'fin', `<path d="M96 129.5 H500" stroke="${C.purple}" stroke-width="3" stroke-dasharray="9 6"/>` + text(552, 136, '95 %', { size: 19, color: C.purple }), 1.4);
    body += glowRect(102, 286, 136, 30, 4, C.orange, 0.2, 6) + glowRect(352, 116, 136, 200, 4, C.orange, 0.5, 6);
    body += at(4, 'pop', tag(295, 342, '함량', ROLE.o, 22), 0.8);
    put(K + '6/함량', svg(id, body, css));
  })();

  // 유효 성분: 손 소독제 속 여러 물질 가운데 세균을 없애는 에탄올
  (function () {
    const id = 't61-k3-yuhyo';
    let css = base(id);
    let body = at(1, 'pop', bottle(120, labelBox(120, '유효 성분') + bar(82, 252, 76) + bar(82, 272, 56)));
    body += `<g class="b1 h3">${g('fin fin1', bar(82, 230, 76), 0.2)}</g>`;
    body += `<g class="b1 h2">${glowRect(70, 160, 100, 42, 1, C.green, 0.6, 8).replace('<g class="b1">', '<g>')}</g>`;
    body += at(3, 'pop', text(120, 237, '에탄올', { size: 19, color: C.green }), 1.4);
    // 칸 2: 크게 본 속
    body += drawPath('M184 160 L336 88', C.line, 2, { width: 3 }) + drawPath('M184 280 L336 258', C.line, 2, { width: 3 });
    const cx = 450, cy = 172;
    let inside = `<circle cx="${cx}" cy="${cy}" r="126" fill="white"/>`;
    const drop = (x, y) => `<path d="M${x} ${y - 10} Q${x + 8} ${y} ${x} ${y + 6} Q${x - 8} ${y} ${x} ${y - 10} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    const scent = (x, y) => [0, 72, 144, 216, 288].map((a) => `<circle cx="${f(x + 6 * Math.cos(a * Math.PI / 180))}" cy="${f(y + 6 * Math.sin(a * Math.PI / 180))}" r="4" fill="${C.lilac}" stroke="${C.purple}" stroke-width="1.5"/>`).join('');
    const star = (x, y) => `<path d="M${x} ${y - 12} L${x + 4} ${y - 4} L${x + 12} ${y} L${x + 4} ${y + 4} L${x} ${y + 12} L${x - 4} ${y + 4} L${x - 12} ${y} L${x - 4} ${y - 4} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const D = [[370, 120], [402, 214], [436, 92], [466, 252], [498, 140], [388, 260], [354, 186], [520, 100], [446, 168], [416, 150]];
    const Sc = [[420, 228], [470, 100], [380, 152], [512, 204]];
    const St = [[410, 110, 0, 0], [456, 210, 0, 0], [500, 172, 12, 14], [520, 236, -8, 8], [372, 222, 0, 0], [530, 140, -6, -10]];
    inside += D.map(([x, y]) => drop(x, y)).join('') + Sc.map(([x, y]) => scent(x, y)).join('');
    let stars = St.map(([x, y], k) => `<g class="st st${k}">${star(x, y)}</g>`).join('');
    const germ = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="${C.peach}" stroke="${C.red}" stroke-width="2.5"/>` + [0, 60, 120, 180, 240, 300].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(x + 13 * c)} ${f(y + 13 * s)} L${f(x + 19 * c)} ${f(y + 19 * s)}" stroke="${C.red}" stroke-width="2.5" stroke-linecap="round"/>`; }).join('');
    const G = [[516, 116], [530, 202], [500, 256]];
    let germs = G.map(([x, y], k) => `<g class="gm gm${k}"><g class="gk gk${k}">${germ(x, y)}</g></g>`).join('');
    body += at(2, 'pop', `<defs><clipPath id="${id}-lens"><circle cx="${cx}" cy="${cy}" r="124"/></clipPath></defs><g clip-path="url(#${id}-lens)">${inside}${stars}<g class="b3">${germs}</g></g>`
      + `<circle cx="${cx}" cy="${cy}" r="126" fill="none" stroke="${C.blue}" stroke-width="4"/>`, 0.8);
    G.forEach((_, k) => {
      css += steps(id, `gm${k}`, 'translateX(110px)', [[3, 'none', 0.1 + k * 0.15]], { dur: 0.7, box: false });
      css += `.sc-${id} .gk${k} { transform-box: fill-box; transform-origin: center; transition: transform .5s ease-in, opacity .5s ease-in; }
      .on3 .sc-${id} .gk${k} { transform: scale(.55); opacity: .45; transition-delay: ${1.1 + k * 0.15}s; }`;
    });
    St.forEach(([, , dx, dy], k) => { if (dx || dy) css += steps(id, `st${k}`, 'none', [[3, `translate(${dx}px, ${dy}px)`, 0.7]], { dur: 0.5, box: false }); });
    css += `.on3 .sc-${id} .st { animation: ${id}-pulse .5s ease-in-out .9s 2; transform-box: fill-box; transform-origin: center; }`;
    body += [['물', ROLE.s], ['향', ROLE.x], ['에탄올', ROLE.p]].map(([l, rl], k) => at(2, 'pop', `<g class="lg lg${k}">${tag(370 + k * 82 + (k === 2 ? 14 : 0), 334, l, rl, 19)}</g>`, 1.3 + k * 0.2)).join('');
    css += pulseCss(id, '.lg2 .tl', 3, 1.4);
    body += glowRect(66, 158, 108, 92, 4, C.green, 0.2, 10) + at(4, 'pop', tag(120, 30, '유효 성분', ROLE.p, 22), 0.5);
    put(K + '6/유효 성분', svg(id, body, css));
  })();

  // ── 6단원: 온돌(아궁이 불길이 구들장 밑을 지나 굴뚝으로, 데워진 구들장이 방바닥을 데운다) ──────────────────────────────
  (function () {
    const id = 't61-k3-ondol';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="0" y="288" width="640" height="72" fill="${C.peach}" opacity=".55"/>`
      + `<polygon points="150,84 340,28 530,84" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M172 84 V200 M508 84 V200" stroke="${C.ink}" stroke-width="3"/>`
      + `<rect x="172" y="216" width="356" height="72" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<rect x="166" y="238" width="12" height="48" fill="white"/>`
      + [236, 300, 364, 428].map((x) => `<rect x="${x}" y="256" width="18" height="32" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`).join('')
      + `<rect x="528" y="66" width="36" height="222" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="522" y="230" width="12" height="54" fill="white"/>`
      + `<rect x="96" y="226" width="76" height="62" rx="4" fill="${C.line}" stroke="${C.ink}" stroke-width="3"/><path d="M120 288 V264 Q142 240 164 264 V288 Z" fill="${C.ink}" opacity=".85"/>`);
    // 구들장
    body += at(1, 'fin', [0, 1, 2, 3, 4, 5].map((i) => `<rect class="sl sl${i}" x="${173 + i * 56}" y="200" width="55" height="16" rx="2" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`).join('') + `<rect x="508" y="200" width="22" height="16" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`, 0.3);
    body += at(1, 'pop', tag(340, 172, '구들장', ROLE.w, 19), 0.6) + at(1, 'fin', text(84, 196, '부엌', { size: 18, color: C.muted }), 0.8);
    // 칸 2: 불과 불길
    body += at(2, 'pop', `<g class="fl"><path d="M126 287 Q124 268 138 254 Q142 266 148 260 Q160 272 158 287 Z" fill="${C.orange}"/><path d="M134 287 Q134 274 142 266 Q150 276 148 287 Z" fill="${C.yellow}"/></g>`, 0.1);
    css += `@keyframes ${id}-flick { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.15) scaleX(.94); } }
      .sc-${id} .fl { transform-box: fill-box; transform-origin: center bottom; }
      .on2 .sc-${id} .fl { animation: ${id}-flick .6s ease-in-out infinite; }`;
    body += drawPath('M150 268 C176 268 184 236 208 236 S252 228 282 236 S334 244 362 236 S420 228 452 236 S520 248 546 224 L546 76', C.red, 2, { width: 5, delay: 0.4, end: [546, 76], ang: -Math.PI / 2 });
    body += `<g class="b2">` + [0, 1, 2].map((k) => `<circle class="sm sm${k}" cx="${546 + (k - 1) * 8}" cy="52" r="${9 - k}" fill="${C.line}"/>`).join('') + '</g>';
    css += `@keyframes ${id}-smoke { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: .9; } 100% { opacity: 0; transform: translateY(-34px); } }
      ${[0, 1, 2].map((k) => `.on2 .sc-${id} .sm${k} { animation: ${id}-smoke 1.8s ease-out ${1.2 + k * 0.5}s infinite; }`).join('\n')}
      .sc-${id} .sm { opacity: 0; }`;
    body += at(2, 'pop', tag(134, 314, '아궁이', ROLE.o, 19), 0.3) + at(2, 'pop', tag(603, 150, '굴뚝', ROLE.s, 19), 1.0);
    // 칸 3: 구들장이 데워지고 열기가 오른다
    css += `.sc-${id} .sl { transition: fill .6s ease, stroke .6s ease; }
      ${[0, 1, 2, 3, 4, 5].map((i) => `.on3 .sc-${id} .sl${i} { fill: ${i < 2 ? C.orange : C.peach}; stroke: ${C.orange}; transition-delay: ${0.2 + i * 0.2}s; }`).join('\n')}`;
    body += `<g class="b3">` + [214, 258, 422, 466].map((x, k) => `<path class="hw hw${k}" d="M${x} 190 q-8 -12 0 -24 t0 -24" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('') + '</g>';
    css += `@keyframes ${id}-heat { 0% { opacity: 0; transform: translateY(8px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateY(-22px); } }
      ${[0, 1, 2, 3].map((k) => `.on3 .sc-${id} .hw${k} { animation: ${id}-heat 1.6s ease-out ${0.4 + k * 0.25}s infinite; }`).join('\n')}
      .sc-${id} .hw { opacity: 0; }`;
    body += glowRect(166, 194, 368, 98, 4, C.orange, 0.2, 10) + at(4, 'pop', tag(80, 44, '온돌', ROLE.o, 22), 0.5);
    put(K + '6/온돌', svg(id, body, css));
  })();

  // ── 6단원: 다의어(받치다 — 한 낱말에서 이어진 뜻이 세 갈래로 뻗는다) ──────────────────────────────
  (function () {
    const id = 't61-k3-daeuieo';
    let css = base(id);
    let body = at(1, 'pop', `<g class="rt">${tile(104, 180, '받치다', { size: 30, h: 64, fill: TAN, stroke: C.orange, sw: 4 })}</g>`);
    const br = (y, color, n, delay) => drawPath(`M170 180 C214 180 214 ${y} 258 ${y}`, color, n, { width: 5, delay, cls: 'br' });
    // 갈래 1: 소반 다리가 상판을 받친다
    body += br(92, C.orange, 2, 0.1);
    body += at(2, 'pop', `<g class="sp"><path d="M296 64 H344 Q342 84 320 84 Q298 84 296 64 Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><rect x="268" y="84" width="104" height="13" rx="4" fill="${TAN}" stroke="${C.orange}" stroke-width="3"/></g>`
      + `<path d="M284 97 Q276 114 286 130 M356 97 Q364 114 354 130" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/>`, 0.8);
    body += at(2, 'pop', tag(492, 96, '밑에 대다', ROLE.o, 20), 1.2);
    css += `@keyframes ${id}-lift { 0%, 100% { transform: none; } 50% { transform: translateY(-6px); } }
      .on2 .sc-${id} .sp { animation: ${id}-lift .6s ease-in-out 1.3s 2; }`;
    // 갈래 2·3
    body += br(186, C.blue, 3, 0.1) + br(290, C.purple, 3, 0.5);
    body += at(3, 'pop', `<path d="M296 150 L280 160 L286 174 L296 170 L296 194 L344 194 L344 170 L354 174 L360 160 L344 150 Q320 162 296 150 Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M298 196 H342 L354 228 H286 Z" fill="${C.blue}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`, 0.8);
    body += at(3, 'pop', tag(492, 190, '어울리게 입다', ROLE.s, 20), 1.1);
    body += `<g class="b3"><g class="um"><path d="M274 282 Q320 236 366 282 Q354 274 343 282 Q332 274 320 282 Q308 274 297 282 Q286 274 274 282 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/></g>`
      + `<path d="M320 282 V314 Q320 322 312 322" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
    css += steps(id, 'um', 'scaleX(.15)', [[3, 'none', 1.0]], { dur: 0.6 }) + `\n.sc-${id} .um { opacity: 0; } .on3 .sc-${id} .um { opacity: 1; }`;
    body += at(3, 'pop', tag(492, 294, '펴서 들다', ROLE.x, 20), 1.4);
    css += `.sc-${id} .br { transition: stroke-dashoffset 1s ease-in-out, stroke .6s ease; } .on4 .sc-${id} .br { stroke: ${C.green}; transition-delay: 0s, .3s; }`;
    css += pulseCss(id, '.rt', 4, 0.6);
    body += at(4, 'pop', tag(104, 262, '다의어', ROLE.p, 22), 0.8);
    put(K + '6/다의어', svg(id, body, css));
  })();

  // ── 6단원: 껍데기·껍질(단단해서 깨지는 겉 / 깎거나 벗기는 무른 겉) ──────────────────────────────
  const shell = (focus) => {
    const id = focus ? 't61-k3-kkeopjil' : 't61-k3-kkeopdegi';
    let css = base(id);
    const nL = focus ? 3 : 1, aL = focus ? 3 : 2, dL = focus ? 0.8 : 0; // 왼쪽(껍데기) 등장 칸·움직임 칸·늦춤
    const nR = focus ? 1 : 3, aR = focus ? 2 : 3, dR = focus ? 0 : 0.8;
    let body = '';
    // 왼쪽: 달걀과 조개
    body += at(nL, 'pop', `<ellipse cx="110" cy="176" rx="46" ry="60" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`, dL * 0.3);
    body += at(nL, 'pop', `<path d="M186 208 A54 54 0 0 1 294 208 Q240 226 186 208 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`
      + [208, 236, 270, 304, 332].map((a) => `<path d="M240 216 L${f(240 + 48 * Math.cos(a * Math.PI / 180))} ${f(208 + 48 * Math.sin(a * Math.PI / 180))}" stroke="${C.purple}" stroke-width="2"/>`).join(''), dL * 0.3 + 0.2);
    body += at(nL, 'fin', text(110, 266, '달걀', { size: 18, color: C.muted }) + text(240, 266, '조개', { size: 18, color: C.muted }), dL * 0.3 + 0.4);
    // 숟가락으로 톡
    body += `<g class="b${aL}"><g class="hm"><ellipse cx="116" cy="90" rx="20" ry="12" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><rect x="134" y="86" width="54" height="8" rx="4" fill="${C.muted}"/></g></g>`;
    css += `@keyframes ${id}-tap { 0% { transform: rotate(0); } 30% { transform: rotate(-28deg); } 55% { transform: rotate(10deg); } 70% { transform: rotate(4deg); } 100% { transform: rotate(0); } }
      .sc-${id} .hm { transform-box: view-box; transform-origin: 188px 88px; opacity: 0; transition: opacity .3s ease; }
      .on${aL} .sc-${id} .hm { opacity: 1; animation: ${id}-tap .7s ease-in-out ${dL}s 2; }`;
    body += drawPath('M66 168 L82 158 L92 176 L106 154 L120 178 L134 158 L154 170', C.ink, aL, { width: 3, delay: dL + 0.9 });
    body += `<g class="b${aL}">` + [[84, 146, -40, 50, -30], [130, 146, 36, 54, 40]].map(([x, y, dx, dy, r], k) => `<g class="bt bt${k}"><path d="M${x - 11} ${y + 4} Q${x - 2} ${y - 9} ${x + 11} ${y - 4} L${x + 6} ${y + 3} L${x} ${y - 1} L${x - 4} ${y + 7} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/></g>`).join('') + '</g>';
    [[-36, 92, -30], [40, 96, 40]].forEach(([dx, dy, r], k) => { css += steps(id, `bt${k}`, 'none', [[aL, `translate(${dx}px, ${dy}px) rotate(${r}deg)`, dL + 1.2]], { dur: 0.6 }) + `\n.sc-${id} .bt${k} { opacity: 0; } .on${aL} .sc-${id} .bt${k} { opacity: 1; }`; });
    body += `<g class="b${aL}"><circle class="ring ring${aL}" cx="240" cy="200" r="40" fill="none" stroke="${C.purple}" stroke-width="3" style="animation-delay:${dL + 0.6}s"/></g>`;
    // 오른쪽: 사과와 귤
    body += at(nR, 'pop', `<circle cx="420" cy="182" r="48" fill="${TAN}" stroke="${C.orange}" stroke-width="2.5"/><circle class="pe" cx="420" cy="182" r="48" fill="${C.red}"/>`
      + `<path d="M420 136 Q418 122 424 112" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="436" cy="120" rx="12" ry="6" fill="${C.green}" transform="rotate(-25 436 120)"/>`, dR * 0.3);
    css += `.sc-${id} .pe { transition: opacity 1s ease; } .on${aR} .sc-${id} .pe { opacity: .12; transition-delay: ${dR + 0.3}s; }`;
    body += drawPath('M466 170 C496 182 494 214 470 222 C446 230 450 254 476 258 C500 262 508 240 524 250', C.red, aR, { width: 9, delay: dR + 0.2 });
    body += at(nR, 'pop', `<circle cx="566" cy="188" r="40" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`
      + [0, 60, 120].map((a) => { const c = Math.cos(a * Math.PI / 180) * 36, s = Math.sin(a * Math.PI / 180) * 36; return `<path d="M${f(566 - c)} ${f(188 - s)} L${f(566 + c)} ${f(188 + s)}" stroke="${C.orange}" stroke-width="2"/>`; }).join('')
      + `<path d="M526 188 A40 40 0 0 0 606 188 Z" fill="${C.orange}"/>`, dR * 0.3 + 0.2);
    body += `<g class="b${nR}"><g class="gc"><path d="M526 188 A40 40 0 0 1 606 188 Z" fill="${C.orange}"/></g></g>`;
    css += steps(id, 'gc', 'none', [[aR, 'translate(22px, -40px) rotate(32deg)', dR + 0.5]], { dur: 0.8 });
    body += at(nR, 'fin', text(420, 266, '사과', { size: 18, color: C.muted }) + text(566, 266, '귤', { size: 18, color: C.muted }), dR * 0.3 + 0.4);
    body += at(3, 'fin', `<path d="M326 40 V300" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`);
    // 이름표: 견주는 쪽은 칸 3에 흰 이름표, 맡은 낱말은 칸 4
    const tags = [['껍데기', 175, ROLE.o], ['껍질', 490, ROLE.r]];
    tags.forEach(([l, x, rl], k) => {
      if (k === focus) body += at(4, 'pop', `<g class="ft">${tag(x, 316, l, rl, 22)}</g>`, 0.5);
      else body += at(3, 'pop', tag(x, 316, l, ROLE.w, 20), 1.6);
    });
    css += pulseCss(id, '.ft .tl', 4, 1.0);
    body += focus ? glowRect(360, 106, 266, 168, 4, C.red, 0.2) : glowRect(52, 104, 254, 170, 4, C.orange, 0.2);
    put(K + '6/' + (focus ? '껍질' : '껍데기'), svg(id, body, css));
  };
  shell(0);
  shell(1);

  // ── 6단원: 봉오리·봉우리(아직 피지 않은 꽃 / 산의 뾰족한 꼭대기) ──────────────────────────────
  const bud = (focus) => {
    const id = focus ? 't61-k3-bongu' : 't61-k3-bongo';
    let css = base(id);
    const nL = focus ? 3 : 1, nR = focus ? 1 : 3;
    const budShape = (x, y) => `<path d="M${x} ${y - 28} C${x + 18} ${y - 16} ${x + 20} ${y + 14} ${x} ${y + 24} C${x - 20} ${y + 14} ${x - 18} ${y - 16} ${x} ${y - 28} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="M${x} ${y - 26} C${x + 6} ${y - 8} ${x + 6} ${y + 10} ${x} ${y + 22}" stroke="${C.orange}" stroke-width="2" fill="none"/>`
      + `<path d="M${x - 15} ${y + 16} Q${x} ${y + 34} ${x + 15} ${y + 16} Q${x} ${y + 24} ${x - 15} ${y + 16} Z" fill="${C.green}"/>`;
    const stem = (x, top) => `<path d="M${x} 300 C${x - 4} 250 ${x + 4} 200 ${x} ${top}" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${x} 250 Q${x + 26} 236 ${x + 34} 250 Q${x + 18} 262 ${x} 250 Z" fill="${C.green}"/>`;
    let body = at(nL, 'fin', `<path d="M30 300 H290" stroke="${C.green}" stroke-width="4"/>` + stem(110, 160));
    body += at(nL, 'pop', `<g class="bd1">${budShape(110, 134)}</g>`, 0.3);
    if (!focus) {
      body += at(1, 'fin', stem(224, 168), 0.2) + `<g class="b1 h2">${g('pop pop1', budShape(224, 142), 0.5)}</g>`;
      // 칸 2: 옆 봉오리가 핀다
      let fl = [0, 72, 144, 216, 288].map((a) => `<ellipse cx="224" cy="114" rx="15" ry="26" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" transform="rotate(${a} 224 140)"/>`).join('') + `<circle cx="224" cy="140" r="12" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
      body += `<g class="b2"><g class="fw">${fl}</g></g>`;
      css += `.sc-${id} .fw { transform-box: view-box; transform-origin: 224px 140px; transform: scale(.2) rotate(-40deg); transition: transform 1.1s ease-out .5s; } .on2 .sc-${id} .fw { transform: none; }`;
      body += `<g class="b2"><circle class="ring ring2" cx="110" cy="136" r="34" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:1.2s"/></g>`;
    }
    // 오른쪽 산
    body += at(nR, 'fin', `<polygon points="340,300 410,170 450,220 500,104 548,196 580,160 630,300" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`, focus ? 0 : 0.2);
    if (focus) {
      body += `<g class="b2">` + [[410, 170], [500, 104], [580, 160]].map(([x, y], k) => `<circle class="ring ring2" cx="${x}" cy="${y}" r="16" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:${0.1 + k * 0.25}s"/>`).join('') + '</g>';
      body += `<g class="b2">` + [[410, 170], [500, 104], [580, 160]].map(([x, y], k) => g('pop pop2', `<circle cx="${x}" cy="${y}" r="6" fill="${C.orange}"/>`, 0.1 + k * 0.25)).join('') + '</g>';
      body += drawPath('M382 296 Q424 262 450 220 L498 112', C.orange, 2, { width: 3.5, delay: 0.5 });
      body += at(2, 'drop', `<path d="M500 104 V64" stroke="${C.ink}" stroke-width="3"/><path d="M500 64 L530 74 L500 84 Z" fill="${C.red}"/>`, 1.5);
    }
    // 칸 3: 두 낱말, 한 글자 차이
    const words = [['봉<tspan fill="' + C.orange + '">오</tspan>리', 165], ['봉<tspan fill="' + C.orange + '">우</tspan>리', 485]];
    words.forEach(([w, x], k) => { body += at(3, 'pop', `<g class="wd wd${k}">${tile(x, 332, w, { size: 24, h: 44 })}</g>`, 0.6 + k * 0.4); });
    css += paint(id, `.wd${focus}`, focus ? ROLE.p : ROLE.o, 4, 0.3) + pulseCss(id, `.wd${focus}`, 4, 0.7);
    body += focus ? `<g class="b4">` + [[410, 170], [500, 104], [580, 160]].map(([x, y], k) => `<circle class="flash flash4" style="animation-delay:${0.2 + k * 0.2}s" cx="${x}" cy="${y}" r="20" fill="none" stroke="${C.green}" stroke-width="5"/>`).join('') + '</g>' : glowRect(82, 96, 56, 80, 4, C.orange, 0.2);
    put(K + '6/' + (focus ? '봉우리' : '봉오리'), svg(id, body, css));
  };
  bud(0);
  bud(1);
})(typeof window !== 'undefined' ? window : globalThis);
