// 국어 4-1 낱말 도식(5단원 독서 감상문·이야기 세 요소·순우리말, 6단원 원인·결과·이어 주는 말·감각·시의 행과 연·강조).
// 도구(tile·tag·row·curve·base·move 따위)는 figures/4-2/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
// 「방울토마토는 일곱 살」은 저작권이 있는 시라 본문 대신 회색 줄로 그린다. 「차르륵차르륵」 세 줄은 교과서 273쪽 보기 글이다.
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
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·slide·slr) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;

  // 낱말 조각: 배경 rect.bg, 글자 text.tx — 색 바꾸기는 CSS 로 .bg 의 fill/stroke 를 바꾼다
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '' } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx' })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: 34, rx: 17, fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const TAN = '#fdf3d3';
  const GRAY = '#b5c4be';
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: [TAN, C.orange] };
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
  // 그어지는 굽은 줄(칸 n). peak 는 줄 꼭대기 y. 끝에 화살촉.
  const curve = (x1, y1, x2, y2, peak, color, n, { width = 4, arrowHead = true, delay = 0 } = {}) => {
    const cx = (x1 + x2) / 2, cy = 2 * peak - (y1 + y2) / 2, ang = Math.atan2(y2 - cy, x2 - cx);
    return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
      + (arrowHead ? g(`fin fin${n}`, head(x2, y2, ang, color, width), delay + 0.9) : '') + '</g>';
  };
  // 그어지는 곧은 화살표(칸 n)
  const drawArrow = (x1, y1, x2, y2, color, n, { width = 5, delay = 0, arrowHead = true } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + (arrowHead ? g(`fin fin${n}`, head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color, width), delay + 0.9) : '') + '</g>';
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  // 오른쪽을 감싸는 묶음 괄호(세로, 끝이 오른쪽을 가리킴)
  const braceR = (x, y1, y2, color = C.green, w = 3.5) => {
    const m = (y1 + y2) / 2;
    return `<path d="M${x - 12} ${y1} Q${x} ${y1} ${x} ${y1 + 14} V${m - 12} Q${x} ${m} ${x + 12} ${m} Q${x} ${m} ${x} ${m + 12} V${y2 - 14} Q${x} ${y2} ${x - 12} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (x, y, r, color, n, delay = 0) => `<g class="b${n}"><circle class="ring ring${n}" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="3"${dl(delay)}/></g>`;

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
    @keyframes ${id}-slr { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
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
    .on${n} .sc-${id} .slr${n} { animation: ${id}-slr .55s ease-out both; }
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
  // 왼쪽에서 오른쪽으로 자라는 막대(칸 n)
  const growCss = (id, sel, n) => `.sc-${id} ${sel} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;
  const bar = (x, y, w, color = GRAY, h = 9, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;
  const at0 = (x, y, inner, s = 1) => `<g transform="translate(${x} ${y})${s !== 1 ? ` scale(${s})` : ''}">${inner}</g>`;

  // 감각 기관 아이콘(가운데 0,0, 폭 50 남짓)
  const ORG = {
    eye: `<path d="M-25 0 Q0 -21 25 0 Q0 21 -25 0 Z" fill="white" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/><circle r="9" fill="${C.blue}"/><circle cx="-3" cy="-3" r="3" fill="white"/>`,
    ear: `<path d="M-4 22 Q-14 22 -12 10 Q-18 2 -17 -8 Q-15 -24 1 -24 Q18 -24 18 -6 Q18 6 7 12 Q3 15 3 19 Q1 26 -4 22 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-5 -6 Q-1 -15 7 -9 Q10 -3 3 2 Q-1 5 1 10" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    nose: `<path d="M0 -24 Q-2 -2 -14 9 Q-16 19 -6 18 Q0 22 6 18 Q16 19 14 9 Q2 -2 0 -24 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="-6" cy="13" r="2.8" fill="${C.orange}"/><circle cx="6" cy="13" r="2.8" fill="${C.orange}"/>`,
    tongue: `<path d="M-24 -9 Q0 -2 24 -9 Q16 20 0 20 Q-16 20 -24 -9 Z" fill="${C.red}" stroke="${C.red}" stroke-width="3" stroke-linejoin="round"/><path d="M-12 5 Q0 -3 12 5 Q10 17 0 17 Q-10 17 -12 5 Z" fill="${C.peach}"/><path d="M-20 -7 Q0 -1 20 -7" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    hand: [-13, -5, 3, 11].map((x, i) => `<rect x="${x - 3.5}" y="${[-22, -26, -25, -20][i]}" width="7.5" height="26" rx="3.75" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`).join('')
      + `<rect x="-24" y="-2" width="20" height="8" rx="4" transform="rotate(-35 -14 2)" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<rect x="-17" y="-6" width="34" height="28" rx="11" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
  };
  const SENSE = [['eye', '눈'], ['ear', '귀'], ['nose', '코'], ['tongue', '혀'], ['hand', '피부']];
  // 감각으로 알아채는 것(가운데 0,0)
  const drop = (x, y, s = 1) => `<path d="M${x} ${y - 11 * s} Q${x + 8 * s} ${y} ${x + 8 * s} ${y + 4 * s} A${8 * s} ${8 * s} 0 0 1 ${x - 8 * s} ${y + 4 * s} Q${x - 8 * s} ${y} ${x} ${y - 11 * s} Z" fill="${C.blue}"/>`;
  const THING = {
    tomato: `<circle cy="4" r="19" fill="${C.red}"/><path d="M0 -15 L-9 -20 M0 -15 L9 -20 M0 -15 L-4 -24 M0 -15 L5 -24" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/><circle cx="-7" cy="-2" r="4" fill="white" opacity=".55"/>`,
    rain: drop(-12, -6) + drop(4, -14) + drop(-2, 12) + `<path d="M14 2 q6 6 0 12 M20 -4 q10 12 0 24" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    soil: `<path d="M-24 18 Q0 4 24 18 Z" fill="${C.orange}" opacity=".75"/><path d="M0 12 V-2" stroke="${C.green}" stroke-width="3.5" stroke-linecap="round"/><path d="M0 0 Q-11 -4 -12 -12 Q-2 -11 0 0 M0 -2 Q10 -8 12 -15 Q2 -14 0 -2" fill="${C.green}"/><path d="M-18 -4 q-5 -6 0 -12 q5 -6 0 -12 M17 -2 q-5 -6 0 -12 q5 -6 0 -12" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    pancake: `<ellipse cy="5" rx="25" ry="14" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><circle cx="-9" cy="3" r="2.6" fill="${C.orange}"/><circle cx="6" cy="9" r="2.6" fill="${C.orange}"/><circle cx="10" cy="0" r="2.2" fill="${C.orange}"/><path d="M-8 -14 q-4 -5 0 -10 M4 -14 q-4 -5 0 -10" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    sun: `<circle r="12" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${f(c * 17)} ${f(s * 17)} L${f(c * 24)} ${f(s * 24)}" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`; }).join('')
  };

  const K = '4-1/국어/';

  // ── 5단원: 독서 감상문(『발표하기 무서워요!』 → 제목·읽은 까닭·책의 내용·인상 깊은 장면·생각이나 느낌) ──────────────────────────────
  (function () {
    const id = 't41-k3-gamsang';
    let css = base(id);
    const BX = 86, BY = 180;
    let body = at(1, 'pop', `<g class="bk"><rect x="22" y="96" width="128" height="168" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<rect x="22" y="96" width="16" height="168" rx="6" fill="${C.blue}" opacity=".45"/>`
      + text(94, 134, '발표하기', { size: 20 }) + text(94, 160, '무서워요!', { size: 20 })
      + `<circle cx="94" cy="206" r="17" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M76 204 Q78 184 96 186 Q112 188 112 200 Q100 196 92 204 Q84 210 76 204 Z" fill="${C.orange}"/>`
      + `<path d="M68 252 Q68 228 94 228 Q120 228 120 252 Z" fill="${C.orange}" opacity=".8"/></g>`);
    css += pulseCss(id, '.bk', 1, 0.5);
    body += at(1, 'fin', `<rect x="168" y="14" width="456" height="332" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + [84, 148, 212, 276].map((y) => `<path d="M186 ${y} H606" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`).join(''), 0.3);
    const ry = [52, 116, 180, 244, 308];
    const parts = [
      ['제목', ROLE.s, 1, '나도 발표가 무서워!', 'pop'], ['읽은 까닭', ROLE.s, 2, '제목이 내 마음 같아서', 'fly'], ['책의 내용', ROLE.s, 2, '알프레드의 발표 준비', 'fly'],
      ['인상 깊은 장면', ROLE.o, 3, '앞머리를 넘긴 장면', 'fly'], ['생각이나 느낌', ROLE.o, 3, '나도 열심히 준비할래', 'pop']
    ];
    let fly = 0;
    parts.forEach(([label, role, n, say, how], i) => {
      const k = n === 1 ? 0 : (i - 1) % 2;
      body += at(n, 'pop', `<g class="pt pt${i}">${tag(262, ry[i], label, role, 18)}</g>`, 0.6 * (n === 1 ? 1 : 0) + k * 0.6);
      const t = tile(488, ry[i], say, { size: 20, h: 44, w: 236, fill: n === 3 ? TAN : 'white', stroke: n === 3 ? C.orange : C.blue });
      if (how === 'fly') {
        body += `<g class="b${n}"><g class="fc${fly}">${t}</g></g>`;
        css += move(id, `fc${fly}`, `translate(${BX - 488}px, ${BY - ry[i]}px) scale(.4)`, n, { dur: 0.9, delay: 0.3 + k * 0.6 })
          + `.sc-${id} .fc${fly} { opacity: 0; } .on${n} .sc-${id} .fc${fly} { opacity: 1; }`;
        fly++;
      } else body += at(n, 'pop', t, n === 1 ? 1.1 : 0.3 + k * 0.6);
    });
    body += glowRect(164, 10, 464, 340, 4, C.green, 0.1, 18) + at(4, 'pop', tag(86, 306, '독서 감상문', ROLE.y, 22), 0.6);
    css += parts.map((_, i) => pulseCss(id, `.pt${i} .tl`, 4, 0.3 + i * 0.15)).join('');
    put(K + '5/독서 감상문', svg(id, body, css));
  })();

  // ── 5단원: 이야기 세 요소(『사자마트』 — 등장인물·배경·줄거리 세 칸) ──────────────────────────────
  const lion = (x, y) => `<g transform="translate(${x} ${y})">`
    + [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => `<circle cx="${f(Math.cos(a * Math.PI / 180) * 30)}" cy="${f(Math.sin(a * Math.PI / 180) * 30)}" r="12" fill="${C.orange}"/>`).join('')
    + `<circle r="27" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><circle cx="-18" cy="-20" r="7" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="18" cy="-20" r="7" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`
    + `<circle r="27" fill="${C.yellow}"/><circle cx="-9" cy="-5" r="3.5" fill="${C.ink}"/><circle cx="9" cy="-5" r="3.5" fill="${C.ink}"/>`
    + `<path d="M-6 4 H6 L0 10 Z" fill="${C.ink}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M-8 15 Q0 21 8 15" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  const CELL = [14, 222, 430], CW = 196, CX = CELL.map((x) => x + CW / 2);
  const HEAD = [['등장인물', ROLE.s], ['배경', ROLE.p], ['줄거리', ROLE.x]];
  const storyScene = (focus) => {
    const name = ['등장인물', '배경', '줄거리'][focus];
    const id = ['t41-k3-deungjang', 't41-k3-baegyeong', 't41-k3-julgeori'][focus];
    let css = base(id);
    let body = at(1, 'drop', tile(320, 27, '『사자마트』', { size: 20, h: 40, fill: TAN, stroke: C.orange }));
    CELL.forEach((x, k) => {
      body += `<g class="${k === focus ? '' : 'dim dim4'}">` + at(1, 'fin', `<rect x="${x}" y="56" width="${CW}" height="286" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`, 0.3 + k * 0.2)
        + at(1, 'pop', `<g class="hd hd${k}">${tag(CX[k], 84, HEAD[k][0], HEAD[k][1], 20)}</g>`, 0.6 + k * 0.25) + '</g>';
    });
    const nOf = (k) => (k === focus ? 2 : 3);
    const dOf = (k, d) => (k === focus ? d : d * 0.5 + (k > focus ? 0.6 : 0));
    // 등장인물 칸
    const c0 = (() => {
      const n = nOf(0), d = (v) => dOf(0, v);
      return at(n, 'pop', `<g class="ln">${lion(CX[0], 150)}</g>`, d(0.2)) + at(n, 'pop', tile(CX[0], 214, '사자 씨', { size: 18, h: 34, fill: C.peach, stroke: C.orange }), d(0.6))
        + at(n, 'rise', person(CX[0] - 34, 272, C.blue, 12) + person(CX[0], 272, C.green, 12) + person(CX[0] + 34, 272, C.purple, 12), d(1.0))
        + at(n, 'pop', tile(CX[0], 318, '동네 사람들', { size: 18, h: 34, fill: C.sky, stroke: C.blue }), d(1.3));
    })();
    // 배경 칸: 아파트 상가(곳)와 전기가 나간 날(때)
    const c1 = (() => {
      const n = nOf(1), d = (v) => dOf(1, v), x = CX[1];
      let s = `<rect x="${x - 62}" y="110" width="124" height="94" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
      for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) s += `<rect x="${x - 52 + c * 27}" y="${118 + r * 18}" width="16" height="11" rx="2" fill="white"/>`;
      s += `<rect x="${x - 56}" y="158" width="112" height="26" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>` + text(x, 177, '사자마트', { size: 18 })
        + `<rect x="${x - 10}" y="186" width="20" height="18" fill="${C.blue}" opacity=".6"/>`;
      const candle = `<circle class="gl" cx="${x}" cy="258" r="20" fill="${C.yellow}" opacity=".35"/><rect x="${x - 8}" y="262" width="16" height="26" rx="3" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`
        + `<path class="fl" d="M${x} 242 Q${x + 8} 252 ${x} 259 Q${x - 8} 252 ${x} 242 Z" fill="${C.orange}"/>`;
      return at(n, 'rise', `<g class="bd">${s}</g>`, d(0.2)) + at(n, 'fin', text(CELL[1] + 22, 229, '곳', { size: 18, color: C.muted }), d(0.6))
        + at(n, 'pop', tile(x + 12, 222, '아파트 상가', { size: 18, h: 34, fill: C.mint, stroke: C.green }), d(0.6))
        + at(n, 'pop', candle, d(1.1)) + at(n, 'fin', text(CELL[1] + 22, 325, '때', { size: 18, color: C.muted }), d(1.4))
        + at(n, 'pop', tile(x + 14, 318, '전기가 나간 날', { size: 18, h: 34, fill: C.mint, stroke: C.green }), d(1.4));
    })();
    css += `.sc-${id} .fl, .sc-${id} .gl { transform-box: fill-box; transform-origin: center bottom; }
      @keyframes ${id}-flick { 0%, 100% { transform: scale(1); } 30% { transform: scale(1.15, .9); } 60% { transform: scale(.9, 1.12); } }
      .on${nOf(1)} .sc-${id} .fl { animation: ${id}-flick .8s ease-in-out ${dOf(1, 1.5)}s 3; }`;
    // 줄거리 칸: 일어난 일 네 가지가 차례로
    const c2 = (() => {
      const n = nOf(2), d = (v) => dOf(2, v), x = CX[2];
      const ev = ['사자마트를 엶', '손님이 없음', '촛불을 밝힘', '마음을 알게 됨'];
      const ys = [128, 182, 236, 290];
      let s = `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${CELL[2] + 18} 120 V298" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round" style="transition-delay:${d(0.1)}s"/></g>`;
      ev.forEach((e, i) => {
        s += at(n, 'pop', `<circle cx="${CELL[2] + 18}" cy="${ys[i]}" r="7" fill="${C.purple}"/>`, d(0.3 + i * 0.35))
          + at(n, 'slide', tile(x + 14, ys[i], e, { size: 18, h: 38, w: 158, fill: C.lilac, stroke: C.purple }), d(0.35 + i * 0.35));
      });
      return s;
    })();
    body += [c0, c1, c2].map((c, k) => `<g class="${k === focus ? '' : 'dim dim4'}">${c}</g>`).join('');
    css += pulseCss(id, '.ln', 2, 0.9);
    // 칸 4: 고른 칸이 반짝이고 머리 이름표가 노랗게
    css += paint(id, `.hd${focus}`, ROLE.y, 4, 0.3) + pulseCss(id, `.hd${focus} .tl`, 4, 0.5);
    body += glowRect(CELL[focus] - 4, 52, CW + 8, 294, 4, C.orange, 0.2, 18);
    put(K + '5/' + name, svg(id, body, css));
  };
  storyScene(0);
  storyScene(1);
  storyScene(2);

  // ── 5단원: 순우리말(학교·버스·시나브로·알근달근하다를 온 곳에 따라 바구니에 나눈다) ──────────────────────────────
  (function () {
    const id = 't41-k3-sunuri';
    let css = base(id);
    const r = row(['학교', '버스', '시나브로', '알근달근하다'], { y: 74, size: 22, gap: 22 });
    // 바구니 셋
    const bins = [[16, 150, '한자', ROLE.s], [176, 146, '다른 나라 말', ROLE.o], [334, 290, '옛날부터 우리말', ROLE.p]];
    let body = '';
    bins.forEach(([x, w, label, col], k) => {
      body += at(1, 'fin', `<rect x="${x}" y="178" width="${w}" height="164" rx="14" fill="${col[0]}" opacity=".55"/><rect x="${x}" y="178" width="${w}" height="164" rx="14" fill="none" stroke="${col[1]}" stroke-width="3"/>`, 0.2 + k * 0.2)
        + at(1, 'pop', `<g class="bn bn${k}">${tag(x + w / 2, 178, label, ['white', col[1]], 18)}</g>`, 0.5 + k * 0.2);
    });
    // 낱말 조각: 위에서 바구니로 옮겨 간다
    const dest = [[91, 236, 2, 0.2], [249, 236, 2, 1.0], [340 + r[2].w / 2, 236, 3, 0.2], [340 + r[3].w / 2, 302, 3, 0.9]];
    r.forEach((p, i) => {
      const [dx, dy, n, dd] = dest[i];
      body += at(1, 'drop', `<g class="wd wd${i}">${T(p, { h: 50 })}</g>`, 0.9 + i * 0.15);
      css += `.sc-${id} .wd${i} { transition: transform 1s ease-in-out ${dd}s; }
        .on${n} .sc-${id} .wd${i} { transform: translate(${f(dx - p.cx)}px, ${f(dy - p.y)}px); }`;
    });
    // 칸 2: 온 곳(한자·로마자)
    body += at(2, 'pop', text(91, 300, '學校', { size: 26, color: C.blue }), 1.1) + at(2, 'pop', text(249, 300, 'bus', { size: 26, color: C.orange }), 1.9);
    body += ring(91, 236, 40, C.blue, 2, 1.1) + ring(249, 236, 40, C.orange, 2, 1.9);
    // 칸 3: 뜻
    const m1 = 340 + r[2].w + 10, m2 = 340 + r[3].w + 10;
    body += at(3, 'slide', tag(m1 + wOf('조금씩 조금씩', 18) / 2 + 2, 236, '조금씩 조금씩', ROLE.p, 18), 1.3)
      + at(3, 'slide', tag(m2 + wOf('맵고 달다', 18) / 2 + 2, 302, '맵고 달다', ROLE.p, 18), 1.8);
    // 칸 4
    body += glowRect(326, 150, 306, 200, 4, C.green, 0.1, 18) + at(4, 'pop', `<g class="fn">${tag(479, 112, '순우리말', ROLE.y, 24)}</g>`, 0.6);
    css += `.sc-${id} .bn0, .sc-${id} .bn1 { transition: opacity .6s ease; } .on4 .sc-${id} .bn0, .on4 .sc-${id} .bn1 { opacity: .4; }` + pulseCss(id, '.fn .tl', 4, 1.1);
    put(K + '5/순우리말', svg(id, body, css));
  })();

  // ── 6단원: 원인(윤우 — 밤늦게까지 숙제를 함 → 늦잠을 잠) ──────────────────────────────
  (function () {
    const id = 't41-k3-wonin';
    let css = base(id);
    const card = (x) => `<rect x="${x}" y="64" width="250" height="210" rx="16" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    // 원인 카드: 달, 공책, 연필
    const moon = `<path d="M74 82 A22 22 0 1 0 96 118 A17 17 0 1 1 74 82 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;
    const book = `<path d="M100 196 L100 148 Q128 138 155 150 Q182 138 210 148 V196 Q182 186 155 198 Q128 186 100 196 Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/><path d="M155 150 V198" stroke="${C.blue}" stroke-width="2.5"/>`
      + [160, 172, 184].map((y) => `<path d="M110 ${y} Q128 ${y - 6} 146 ${y}" stroke="${C.line}" stroke-width="2.5" fill="none"/><path d="M164 ${y} Q182 ${y - 6} 200 ${y}" stroke="${C.line}" stroke-width="2.5" fill="none"/>`).join('');
    const pencil = `<g transform="translate(206 128) rotate(40)"><rect x="-5" y="-34" width="10" height="44" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/><path d="M-5 10 L0 22 L5 10 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/></g>`;
    let body = `<g class="lc">` + at(1, 'fin', card(30)) + at(1, 'pop', moon, 0.3) + at(1, 'fin', book, 0.5) + `<g class="b1"><g class="pc">${pencil}</g></g>`;
    body += at(1, 'pop', tile(155, 244, '밤늦게까지 숙제', { size: 20, h: 40, fill: C.lilac, stroke: C.purple }), 1.2) + '</g>';
    css += `@keyframes ${id}-write { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-14px, 8px); } 50% { transform: translate(-28px, 2px); } 75% { transform: translate(-14px, 10px); } }
      .on1 .sc-${id} .pc { animation: ${id}-write 1s ease-in-out .6s 2; }`;
    // 결과 카드: 시계와 잠든 얼굴
    const cx0 = 432, cy0 = 150;
    let clock = `<circle cx="${cx0}" cy="${cy0}" r="42" fill="white" stroke="${C.ink}" stroke-width="3.5"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; clock += `<path d="M${f(cx0 + Math.sin(a) * 34)} ${f(cy0 - Math.cos(a) * 34)} L${f(cx0 + Math.sin(a) * 38)} ${f(cy0 - Math.cos(a) * 38)}" stroke="${C.ink}" stroke-width="${i % 3 ? 2 : 3.5}" stroke-linecap="round"/>`; }
    clock += `<g transform="rotate(260 ${cx0} ${cy0})"><path d="M${cx0} ${cy0} V${cy0 - 20}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>`
      + `<g class="mh"><g transform="rotate(240 ${cx0} ${cy0})"><path d="M${cx0} ${cy0} V${cy0 - 31}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/></g></g><circle cx="${cx0}" cy="${cy0}" r="4" fill="${C.ink}"/>`;
    const sleeper = `<rect x="486" y="172" width="104" height="30" rx="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="488" y="150" width="34" height="18" rx="8" fill="white" stroke="${C.line}" stroke-width="2.5"/>`
      + `<circle cx="512" cy="160" r="16" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M504 160 q4 4 8 0 M516 160 q4 4 8 0" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      + `<path d="M528 170 Q560 158 590 172" stroke="${C.blue}" stroke-width="3" fill="${C.sky}"/>`;
    body += drawArrow(288, 170, 350, 170, C.muted, 2, { delay: 0.1 });
    body += `<g class="rc">` + at(2, 'fin', card(360), 0.8) + at(2, 'pop', `<g class="ck">${clock}</g>`, 1.0) + at(2, 'fin', sleeper, 1.0);
    body += [0, 1, 2].map((i) => at(2, 'rise', text(552 + i * 16, 140 - i * 22, 'z', { size: 18 + i * 4, color: C.blue }), 1.4 + i * 0.25)).join('');
    body += at(2, 'pop', tile(485, 244, '늦잠', { size: 22, h: 40, fill: C.peach, stroke: C.orange }), 1.6) + '</g>';
    css += `.sc-${id} .mh { transform-box: view-box; transform-origin: ${cx0}px ${cy0}px; transform: rotate(-300deg); transition: transform 1.4s ease-in-out 1.1s; }
      .on2 .sc-${id} .mh { transform: none; }
      .on2 .sc-${id} .ck { animation: ${id}-shake .4s ease-in-out 2.4s 2; }`;
    // 칸 3: 결과에서 거슬러 묻는다
    body += curve(485, 58, 155, 58, 24, C.orange, 3, { width: 4.5 }) + at(3, 'pop', tag(320, 28, '왜?', ROLE.y, 20), 0.9);
    body += [['원인', 155], ['결과', 485]].map(([label, x], k) => `<g class="${k ? 'dim dim4' : ''}">` + at(3, 'pop', `<g class="ct ct${k}">${tag(x, 318, label, ['white', C.line], 22)}</g>`, 1.4) + '</g>').join('');
    css += paint(id, '.ct0', ROLE.y, 3, 1.6) + pulseCss(id, '.ct0 .tl', 4, 0.4);
    css += `.sc-${id} .lc, .sc-${id} .rc { transition: opacity .6s ease; } .on4 .sc-${id} .rc { opacity: .3; }`;
    body += glowRect(26, 60, 258, 218, 4, C.orange, 0.2, 18);
    put(K + '6/원인', svg(id, body, css));
  })();

  // ── 6단원: 결과(지민이 — 바람 → 모자가 날아감 → 줍지 못함, 결과가 다시 원인이 된다) ──────────────────────────────
  (function () {
    const id = 't41-k3-gyeolgwa';
    let css = base(id);
    const X = [14, 227, 440], W = 186, MX = X.map((x) => x + W / 2);
    const card = (k) => `<rect x="${X[k]}" y="60" width="${W}" height="196" rx="16" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    const hat = `<ellipse cx="0" cy="6" rx="24" ry="6" fill="${C.orange}"/><path d="M-14 6 A14 14 0 0 1 14 6 Z" fill="${C.orange}"/><path d="M-13 1 H13" stroke="${C.yellow}" stroke-width="3"/>`;
    // 카드 1: 바람
    const winds = [[104, 0.1], [140, 0.35], [176, 0.6]].map(([y, d], i) => `<path class="draw draw1" pathLength="1" d="M${X[0] + 22} ${y} H${X[0] + 116 + i * 10} q22 0 22 -16 q0 -14 -14 -14 q-12 0 -12 12" stroke="${C.blue}" stroke-width="4.5" fill="none" stroke-linecap="round" style="transition-delay:${d}s"/>`).join('');
    let body = `<g class="c0">` + at(1, 'fin', card(0)) + `<g class="b1"><g class="gu">${winds}</g></g>`
      + at(1, 'pop', tile(MX[0], 222, '바람이 세게 붊', { size: 18, h: 38, fill: C.sky, stroke: C.blue }), 1.1) + '</g>';
    css += `@keyframes ${id}-gust { 0%, 100% { transform: none; } 50% { transform: translateX(12px); } }
      .on1 .sc-${id} .gu { animation: ${id}-gust .5s ease-in-out 1.3s 3; }`;
    // 카드 2: 모자가 날아 연못 한가운데로
    const pond = (k) => `<ellipse cx="${MX[k]}" cy="176" rx="72" ry="22" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    body += drawArrow(X[0] + W + 3, 158, X[1] - 4, 158, C.muted, 2, { width: 4.5, delay: 0.1 }) + at(2, 'pop', tag(X[1] - 7, 34, '그래서', ROLE.y, 18), 0.4);
    body += `<g class="c1">` + at(2, 'fin', card(1) + pond(1), 0.5);
    body += `<g class="b2"><g class="ht"><g transform="translate(${MX[1]} 170)">${hat}</g></g></g>`;
    css += `.sc-${id} .ht { opacity: 0; }
      @keyframes ${id}-fly { 0% { opacity: 1; transform: translate(-70px, -86px) rotate(-20deg); } 35% { transform: translate(-20px, -102px) rotate(25deg); } 70% { transform: translate(20px, -60px) rotate(-15deg); } 100% { opacity: 1; transform: none; } }
      .on2 .sc-${id} .ht { opacity: 1; animation: ${id}-fly 1.3s ease-in-out .7s both; }`;
    body += ring(MX[1], 176, 26, C.blue, 2, 1.7);
    body += at(2, 'pop', tile(MX[1], 222, '모자가 날아감', { size: 18, h: 38, fill: C.peach, stroke: C.orange }), 1.9) + '</g>';
    // 카드 3: 손이 닿지 않는다
    body += drawArrow(X[1] + W + 3, 158, X[2] - 4, 158, C.muted, 3, { width: 4.5, delay: 0.1 }) + at(3, 'pop', tag(X[2] - 7, 34, '그래서', ROLE.y, 18), 0.4);
    body += `<g class="c2">` + at(3, 'fin', card(2) + pond(2) + `<g transform="translate(${MX[2]} 170)">${hat}</g>`, 0.5);
    body += at(3, 'slide', `<g class="rc">${person(X[2] + 34, 150, C.green, 13)}<path d="M${X[2] + 52} 156 L${X[2] + 80} 150" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/></g>`, 0.8);
    body += at(3, 'pop', cross(MX[2] + 6, 118, 10), 1.5);
    body += at(3, 'pop', tile(MX[2], 222, '줍지 못함', { size: 18, h: 38, fill: C.peach, stroke: C.orange }), 1.7) + '</g>';
    css += `@keyframes ${id}-reach { 0%, 100% { transform: none; } 50% { transform: translateX(10px); } }
      .on3 .sc-${id} .rc { animation: ${id}-reach .6s ease-in-out 1.2s 2; }`;
    // 원인·결과 이름표: 가운데 카드는 결과이면서 다음 일의 원인
    body += at(1, 'pop', `<g class="lb0">${tag(MX[0], 290, '원인', ['white', C.blue], 20)}</g>`, 1.4);
    body += at(2, 'pop', `<g class="mv1"><g class="lb1">${tag(MX[1], 290, '결과', ['white', C.orange], 20)}</g></g>`, 2.0);
    // 칸 3: 가운데 결과가 옆으로 비켜서며 다음 일의 원인이 된다
    css += move(id, 'mv1', 'none', 3, { dur: 0.7, delay: 0.1, to: 'translateX(-48px)' });
    body += drawArrow(MX[1] - 8, 290, MX[1] + 6, 290, C.muted, 3, { width: 3.5, delay: 0.6 }) + at(3, 'pop', tag(MX[1] + 48, 290, '원인', ['white', C.blue], 20), 0.9);
    body += at(3, 'pop', `<g class="lb2">${tag(MX[2], 290, '결과', ['white', C.orange], 20)}</g>`, 1.6);
    // 칸 4: 결과 둘이 노랗게 반짝
    css += paint(id, '.lb1', ROLE.y, 4, 0.2) + paint(id, '.lb2', ROLE.y, 4, 0.5) + pulseCss(id, '.lb1 .tl', 4, 0.4) + pulseCss(id, '.lb2 .tl', 4, 0.7);
    css += `.sc-${id} .c0 { transition: opacity .6s ease; } .on4 .sc-${id} .c0 { opacity: .35; }`;
    body += glowRect(X[1] - 4, 56, W + 8, 204, 4, C.orange, 0.2, 18) + glowRect(X[2] - 4, 56, W + 8, 204, 4, C.orange, 0.5, 18);
    put(K + '6/결과', svg(id, body, css));
  })();

  // ── 6단원: 이어 주는 말(지민이의 모자 — 그래서·왜냐하면 … 때문이야) ──────────────────────────────
  (function () {
    const id = 't41-k3-ieo';
    let css = base(id);
    let body = '';
    // 첫 줄: 원인 그래서 결과
    const [a1, c1, b1] = row(['바람이 세게 불었어.', '그래서', '모자가 날아갔어.'], { y: 76, size: 22, gap: 16 });
    body += at(1, 'slide', T(a1, { h: 52 })) + at(1, 'slr', T(b1, { h: 52 }), 0.3);
    body += `<g class="b1 h2">` + g('fin fin1', `<rect x="${f(c1.l)}" y="50" width="${c1.w}" height="52" rx="12" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>` + text(c1.cx, 86, '?', { size: 26, color: C.muted }), 0.7) + '</g>';
    body += at(2, 'drop', `<g class="cn1">${T(c1, { h: 52, fill: C.peach, stroke: C.orange })}</g>`, 0.2) + ring(c1.cx, 76, 30, C.orange, 2, 0.5);
    body += at(2, 'pop', tag(a1.cx, 130, '원인', ['white', C.blue], 18), 1.0) + at(2, 'pop', tag(b1.cx, 130, '결과', ['white', C.orange], 18), 1.6);
    body += drawArrow(a1.cx + 40, 130, b1.cx - 42, 130, C.muted, 2, { width: 3.5, delay: 1.1 });
    // 둘째 줄: 결과 왜냐하면 원인 때문이야
    const [a2, c2, b2, d2] = row(['모자를 줍지 못했어.', '왜냐하면', '연못에 떨어졌기', '때문이야.'], { y: 228, size: 20, gap: 12 });
    body += at(3, 'slide', T(a2, { h: 48 })) + at(3, 'slr', T(b2, { h: 48 }), 0.2) + at(3, 'slr', `<g class="dm">${T(d2, { h: 48 })}</g>`, 0.3);
    body += at(3, 'drop', `<g class="cn2">${T(c2, { h: 48, fill: C.lilac, stroke: C.purple })}</g>`, 0.6) + ring(c2.cx, 228, 30, C.purple, 3, 0.8);
    css += paint(id, '.dm', ROLE.x, 3, 1.2);
    body += curve(c2.cx, 202, d2.cx, 202, 176, C.purple, 3, { width: 3.5, arrowHead: false, delay: 1.1 });
    body += at(3, 'pop', tag(a2.cx, 280, '결과', ['white', C.orange], 18), 1.3) + at(3, 'pop', tag((b2.l + d2.r) / 2, 280, '원인', ['white', C.blue], 18), 1.3);
    body += drawArrow((b2.l + d2.r) / 2 - 44, 280, a2.cx + 44, 280, C.muted, 3, { width: 3.5, delay: 1.2 });
    // 칸 4
    css += pulseCss(id, '.cn1', 4, 0.2) + pulseCss(id, '.cn2', 4, 0.6);
    body += glowRect(c1.l - 6, 44, c1.w + 12, 64, 4, C.orange, 0.1, 14) + glowRect(c2.l - 6, 198, c2.w + 12, 60, 4, C.purple, 0.4, 14);
    body += at(4, 'pop', tag(320, 332, '이어 주는 말', ROLE.y, 22), 1.0);
    put(K + '6/이어 주는 말', svg(id, body, css));
  })();

  // ── 6단원: 감각적 표현(눈·귀·코·혀·피부에서 새빨간·차르륵차르륵·고소한·달콤한·간지러운이 나온다) ──────────────────────────────
  (function () {
    const id = 't41-k3-gamgakjeok';
    let css = base(id);
    const xs = [80, 200, 320, 440, 560];
    const say = [['새빨간', 220, 2, 0.2], ['차르륵차르륵', 284, 3, 0.2], ['고소한', 220, 3, 0.8], ['달콤한', 284, 2, 0.9], ['간지러운', 220, 3, 1.4]];
    const col = [C.red, C.blue, C.green, C.orange, C.purple];
    let body = '';
    SENSE.forEach(([key, label], i) => {
      body += at(1, 'pop', `<g class="og og${i}"><circle cx="${xs[i]}" cy="88" r="40" fill="white" stroke="${C.line}" stroke-width="3"/>${at0(xs[i], 88, ORG[key])}</g>`, 0.2 + i * 0.2)
        + at(1, 'fin', text(xs[i], 154, label, { size: 20, color: C.muted }), 0.4 + i * 0.2);
    });
    say.forEach(([w, y, n, d], i) => {
      body += `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${xs[i]} 166 V${y - 22}" stroke="${col[i]}" stroke-width="3" stroke-dasharray="1" fill="none" style="transition-delay:${d}s"/></g>`;
      body += at(n, 'drop', `<g class="ex ex${i}">${tile(xs[i], y, w, { size: 20, h: 44, fill: 'white', stroke: col[i] })}</g>`, d + 0.5);
      css += `.on${n} .sc-${id} .og${i} circle:first-child { stroke: ${col[i]}; transition: stroke .4s ease ${d}s; }`;
      css += `.on${n} .sc-${id} .og${i} { animation: ${id}-pulse .6s ease-in-out ${d}s 1; transform-box: fill-box; transform-origin: center; }`;
    });
    css += `.sc-${id} .og circle:first-child { transition: stroke .4s ease; }`;
    css += say.map((_, i) => pulseCss(id, `.ex${i}`, 4, 0.2 + i * 0.18)).join('');
    body += at(4, 'pop', tag(320, 334, '감각적 표현', ROLE.y, 22), 1.1);
    put(K + '6/감각적 표현', svg(id, body, css));
  })();

  // ── 6단원: 감각(방울토마토·빗방울 소리·흙냄새·감자전·햇살 → 눈·귀·코·혀·피부) ──────────────────────────────
  (function () {
    const id = 't41-k3-gamgak';
    let css = base(id);
    const ys = [44, 112, 180, 248, 316];
    const th = [['tomato', 2, 0.2], ['rain', 2, 0.9], ['soil', 3, 0.2], ['pancake', 3, 0.8], ['sun', 3, 1.4]];
    const verb = ['보다', '듣다', '냄새 맡다', '맛보다', '느끼다'];
    let body = '';
    SENSE.forEach(([key, label], i) => {
      const y = ys[i];
      body += at(1, 'pop', `<g class="og og${i}"><circle cx="246" cy="${y}" r="30" fill="white" stroke="${C.line}" stroke-width="3"/>${at0(246, y, ORG[key], 0.82)}</g>`, 0.2 + i * 0.2)
        + at(1, 'fin', text(290, y + 7, label, { size: 20, anchor: 'start' }), 0.4 + i * 0.2);
      const [tk, n, d] = th[i];
      body += `<g class="b${n}"><g class="th th${i}">${at0(70, y, THING[tk])}</g></g>`;
      css += `.sc-${id} .th${i} { opacity: 0; transform: translateX(-50px); transition: transform .7s ease-out ${d}s, opacity .5s ease ${d}s; }
        .on${n} .sc-${id} .th${i} { opacity: 1; transform: none; }`;
      body += drawArrow(110, y, 206, y, C.muted, n, { width: 4, delay: d + 0.4 });
      body += at(n, 'pop', `<g class="vb vb${i}">${tag(414, y, verb[i], ROLE.s, 20)}</g>`, d + 1.0);
      css += `.on${n} .sc-${id} .og${i} { animation: ${id}-pulse .6s ease-in-out ${d + 1}s 1; transform-box: fill-box; transform-origin: center; }`;
    });
    body += at(4, 'fin', braceR(494, 26, 334, C.orange), 0.2) + at(4, 'pop', tag(560, 180, '감각', ROLE.y, 24), 0.6);
    css += SENSE.map((_, i) => pulseCss(id, `.og${i}`, 4, 0.3 + i * 0.15)).join('');
    put(K + '6/감각', svg(id, body, css));
  })();

  // ── 6단원: 행(「방울토마토는 일곱 살」 앞부분 — 줄 하나하나가 행, 낱말 하나뿐인 줄도 행) ──────────────────────────────
  (function () {
    const id = 't41-k3-haeng';
    let css = base(id);
    const LX = 186, ys = [116, 160, 204, 248, 292], ws = [220, 120, 262, 200, 238];
    let body = at(1, 'fin', `<rect x="150" y="14" width="340" height="332" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + tile(320, 52, '방울토마토는 일곱 살', { size: 20, h: 40, fill: TAN, stroke: C.orange }));
    // 칸 2·3: 줄을 따라 칠해지는 띠(줄 아래)
    ys.forEach((y, i) => {
      const n = i === 0 ? 2 : 3;
      body += `<g class="b${n}"><rect class="hl hl${i}" x="${LX - 10}" y="${y - 17}" width="${ws[i] + 20}" height="34" rx="9" fill="${i === 1 ? C.peach : C.mint}"/></g>`;
      css += `.sc-${id} .hl${i} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .7s ease-out ${n === 2 ? 0.2 : 0.2 + (i - 1) * 0.35}s; }
        .on${n} .sc-${id} .hl${i} { transform: none; }`;
    });
    // 칸 1: 회색 줄이 한 줄씩 그어지고 끝에서 줄을 바꾼다
    ys.forEach((y, i) => {
      body += `<g class="b1">${bar(LX, y, ws[i], GRAY, 10, `gr gr${i}`)}</g>`;
      css += `.sc-${id} .gr${i} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .4s ease-out ${(0.3 + i * 0.3).toFixed(2)}s; }
        .on1 .sc-${id} .gr${i} { transform: none; }`;
      if (i < 4) { const e = LX + ws[i]; body += at(1, 'fin', `<path d="M${e + 24} ${y - 10} V${y + 6} H${e + 8}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + head(e + 8, y + 6, Math.PI, C.muted, 3), 0.6 + i * 0.3); }
    });
    // 이름표: 1행(칸 2), 2~5행(칸 3)
    ys.forEach((y, i) => {
      const n = i === 0 ? 2 : 3, d = n === 2 ? 0.8 : 0.5 + (i - 1) * 0.35;
      body += at(n, 'slr', `<path d="M496 ${y} H514" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="4 4"/>` + `<g class="lt lt${i}">${tag(548, y, `${i + 1}행`, i === 1 ? ROLE.o : ROLE.p, 20)}</g>`, d);
    });
    body += ring(LX + 60, ys[1], 40, C.orange, 3, 0.8);
    css += ys.map((_, i) => pulseCss(id, `.lt${i} .tl`, 4, 0.2 + i * 0.15)).join('');
    body += glowRect(LX - 14, ys[0] - 21, 290, 42, 4, C.green, 0.1, 12) + at(4, 'pop', tag(320, 328, '행', ROLE.y, 24), 1.0);
    put(K + '6/행', svg(id, body, css));
  })();

  // ── 6단원: 연(교과서 보기 시 — 빗방울에서 내 마음으로 대상이 바뀌는 곳에서 한 줄을 비워 두 연으로) ──────────────────────────────
  (function () {
    const id = 't41-k3-yeon';
    let css = base(id);
    const LX = 150, Y = [102, 150, 198], GAP = 62;
    let body = '';
    // 칸 3·4: 연 바탕(글 아래)
    body += at(3, 'fin', `<rect x="${LX - 16}" y="${Y[0] - 34}" width="358" height="${Y[1] - Y[0] + 56}" rx="12" fill="${C.sky}" opacity=".6"/>`, 1.4);
    body += at(3, 'fin', `<rect x="${LX - 16}" y="${Y[2] + GAP - 34}" width="358" height="56" rx="12" fill="${C.peach}" opacity=".6"/>`, 1.4);
    const line = (y, inner, d) => at(1, 'slide', `<text x="${LX}" y="${y}" font-size="26" font-weight="700" fill="${C.ink}">${inner}</text>`, d);
    body += line(Y[0], '차르륵차르륵', 0.2) + line(Y[1], `우산을 두드리는 <tspan class="w1">빗방울</tspan>처럼`, 0.5);
    body += `<g class="l3">` + line(Y[2], `네 옆의 <tspan class="w2">내 마음</tspan>도 두근두근`, 0.8);
    // 칸 2: 대상 그림(하트)은 셋째 줄과 함께 움직인다
    body += at(2, 'pop', `<g class="ic2"><path d="M86 ${Y[2] + 4} q-15 -13 -15 -23 q0 -11 11 -11 q7 0 10 7 q3 -7 10 -7 q11 0 11 11 q0 10 -15 23 l-6 5 Z" fill="${C.red}" opacity=".85"/></g>`, 1.2) + '</g>';
    body += at(2, 'pop', `<g class="ic1">${drop(92, 124, 2.2)}</g>`, 0.4);
    css += `.sc-${id} .w1, .sc-${id} .w2 { transition: fill .5s ease; }
      .on2 .sc-${id} .w1 { fill: ${C.blue}; transition-delay: .4s; } .on2 .sc-${id} .w2 { fill: ${C.red}; transition-delay: 1.2s; }`;
    css += pulseCss(id, '.ic1', 2, 0.9) + pulseCss(id, '.ic2', 2, 1.7);
    // 칸 3: 셋째 줄이 내려가며 한 줄이 빈다
    css += move(id, 'l3', 'none', 3, { dur: 0.9, delay: 0.2, to: `translateY(${GAP}px)` });
    body += at(3, 'fin', `<path d="M${LX} ${Y[2] + 6} H${LX + 300}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 7"/>` + text(LX + 366, Y[2] + 13, '빈 줄', { size: 18, color: C.muted, anchor: 'start' }), 1.0);
    const yb = [[Y[0] - 30, Y[1] + 14, '1연', ROLE.s], [Y[2] + GAP - 30, Y[2] + GAP + 14, '2연', ROLE.o]];
    yb.forEach(([y1, y2, label, role], k) => {
      body += at(3, 'pop', `<path d="M${LX + 352} ${y1} H${LX + 362} V${y2} H${LX + 352}" stroke="${role[1]}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<g class="yt yt${k}">${tag(LX + 416, (y1 + y2) / 2, label, role, 22)}</g>`, 1.6 + k * 0.3);
    });
    css += pulseCss(id, '.yt0 .tl', 4, 0.2) + pulseCss(id, '.yt1 .tl', 4, 0.5);
    body += glowRect(LX - 20, Y[0] - 38, 366, Y[1] - Y[0] + 64, 4, C.blue, 0.1, 14) + glowRect(LX - 20, Y[2] + GAP - 38, 366, 64, 4, C.orange, 0.4, 14);
    body += at(4, 'pop', tag(320, 334, '연', ROLE.y, 24), 1.0);
    put(K + '6/연', svg(id, body, css));
  })();

  // ── 6단원: 강조(교과서 보기 — '차르륵차르륵'을 따로 떼어 한 행에 놓으면 두드러진다) ──────────────────────────────
  (function () {
    const id = 't41-k3-gangjo';
    let css = base(id);
    const S = 24, LX = 52, Y1 = 120, Y2 = 180;
    const wA = tw('차르륵', S), wSp = 0.3 * S, xB = LX + 2 * wA + wSp;
    let body = '';
    // 칸 3 바탕 띠(글 아래)
    body += `<g class="b3"><g class="hb"><rect x="${LX - 12}" y="${Y1 - 34}" width="${f(2 * wA + 24)}" height="46" rx="10" fill="${C.sky}"/></g></g>`;
    css += `.sc-${id} .hb { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out .2s; }
      .on3 .sc-${id} .hb { transform: scale(1.4); }`;
    // '차르륵' 두 토막(되풀이)과 나머지 말
    const A = `<g class="aa"><g class="a1"><text x="${LX}" y="${Y1}" font-size="${S}" font-weight="700" fill="${C.ink}" class="at">차르륵</text></g>`
      + `<g class="a2"><text x="${f(LX + wA)}" y="${Y1}" font-size="${S}" font-weight="700" fill="${C.ink}" class="at">차르륵</text></g></g>`;
    body += at(1, 'slide', A, 0.2);
    body += `<g class="b1"><g class="bb">${g('slide slide1', `<text x="${f(xB)}" y="${Y1}" font-size="${S}" font-weight="700" fill="${C.ink}">우산을 두드리는 빗방울처럼</text>`, 0.4)}</g></g>`;
    // 칸 1: 한 줄 밑줄
    const lineEnd = xB + tw('우산을 두드리는 빗방울처럼', S);
    body += `<g class="b1 h2"><path class="draw draw1" pathLength="1" d="M${LX} ${Y1 + 14} H${f(lineEnd)}" stroke="${C.muted}" stroke-width="3" fill="none" stroke-dasharray="1" style="transition-delay:.9s"/></g>`;
    // 칸 2: 나머지 말이 다음 줄로
    css += `.sc-${id} .bb { transition: transform 1s ease-in-out .3s; } .on2 .sc-${id} .bb { transform: translate(${f(LX - xB)}px, ${Y2 - Y1}px); }`;
    body += `<g class="h3">` + at(2, 'fin', `<path d="M${f(LX + 2 * wA + 14)} ${Y1 - 8} q20 0 20 22 q0 22 -24 22" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>` + head(f(LX + 2 * wA + 10), Y1 + 36, Math.PI, C.orange, 3), 1.2) + '</g>';
    body += at(2, 'pop', tag(560, Y1 - 10, '1행', ROLE.p, 20), 1.3) + at(2, 'pop', tag(560, Y2 - 10, '2행', ROLE.p, 20), 1.5);
    // 칸 3: 혼자 놓인 '차르륵차르륵'이 커지고, 두 토막이 번갈아 울린다
    css += `.sc-${id} .aa { transform-box: fill-box; transform-origin: left bottom; transition: transform .6s ease-out .2s; }
      .on3 .sc-${id} .aa { transform: scale(1.4); }
      .sc-${id} .at { transition: fill .5s ease .2s; } .on3 .sc-${id} .at { fill: ${C.blue}; }
      .sc-${id} .a1, .sc-${id} .a2 { transform-box: fill-box; transform-origin: center bottom; }
      @keyframes ${id}-beat { 0%, 100% { transform: none; } 50% { transform: translateY(-8px); } }
      .on3 .sc-${id} .a1 { animation: ${id}-beat .5s ease-in-out .9s 3; }
      .on3 .sc-${id} .a2 { animation: ${id}-beat .5s ease-in-out 1.15s 3; }
      .sc-${id} .bb { transition: transform 1s ease-in-out .3s, opacity .6s ease; } .on3 .sc-${id} .bb { opacity: .45; }`;
    // 우산과 빗방울
    const umb = `<path d="M330 286 A62 62 0 0 1 454 286 Q438 276 423 286 Q407 276 392 286 Q376 276 361 286 Q345 276 330 286 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<path d="M392 226 V218 M392 286 V326 q0 12 -12 12 q-12 0 -12 -12" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    body += `<g transform="translate(60 0)">` + at(1, 'fin', umb, 0.8);
    const drops = [[352, 0], [384, 0.25], [416, 0.5], [440, 0.15], [368, 0.4]];
    body += `<g class="b1">` + drops.map(([x, d], i) => `<g class="dp dp${i}">${drop(x, 200, 1)}</g>`).join('') + '</g></g>';
    css += `.sc-${id} .dp { opacity: 0; }
      @keyframes ${id}-rain { 0% { opacity: 0; transform: translateY(-40px); } 30% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(30px); } }
      @keyframes ${id}-rain2 { 0% { opacity: 0; transform: translateY(-40px); } 30% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(30px); } }
      ${drops.map(([, d], i) => `.on1 .sc-${id} .dp${i} { animation: ${id}-rain .9s linear ${0.8 + d}s 2; } .on3 .sc-${id} .dp${i} { animation: ${id}-rain2 .7s linear ${0.6 + d}s 4; }`).join('\n')}`;
    // 칸 3: 소리 물결
    body += `<g class="b3">` + [0, 1].map((k) => `<path class="sw sw${k}" d="M${530 + k * 16} 226 q10 14 0 28" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round" style="animation-delay:${0.9 + k * 0.2}s"/>`).join('') + '</g>';
    css += `.sc-${id} .sw { opacity: 0; } .on3 .sc-${id} .sw { animation: ${id}-flash 1.4s ease-in-out both; }`;
    // 칸 4
    body += glowRect(LX - 16, Y1 - 52, f(2 * wA * 1.4 + 32), 66, 4, C.orange, 0.1, 12) + at(4, 'pop', tag(560, 300, '강조', ROLE.y, 24), 0.8);
    put(K + '6/강조', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
