// 국어 3-2 낱말 도식(3단원 뒤 반·4단원): 통계·점자·창제·원리·이어 주는 말·과열·합선·짜임, 높임 표현·반말·방언·표준어·포함.
// 도구(tile·tag·row·curve·base·move 따위)는 figures/4-2/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
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

  // 낱말 조각: 배경 rect.bg, 글자 text.tx
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '', color = C.ink } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx', color })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: 34, rx: 17, fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple] };
  // 낱말 줄: 폭을 재어 가운데 cx 에 맞춰 늘어놓는다
  const row = (labels, { y, cx = 320, gap = 16, size = 28 }) => {
    const ws = labels.map((l) => wOf(l, size));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (labels.length - 1);
    let x = cx - total / 2;
    return labels.map((label, i) => { const c = x + ws[i] / 2; x += ws[i] + gap; return { label, cx: c, w: ws[i], y, size, l: c - ws[i] / 2, r: c + ws[i] / 2 }; });
  };
  const T = (p, o = {}) => tile(p.cx, p.y, p.label, { size: p.size, w: p.w, ...o });

  const head = (x, y, ang, color, w = 4) => {
    const l = 13, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 그어지는 굽은 줄(칸 n). peak 는 줄 꼭대기(또는 바닥) y.
  const curve = (x1, y1, x2, y2, peak, color, n, { width = 4, arrowHead = true, delay = 0 } = {}) => {
    const cx = (x1 + x2) / 2, cy = 2 * peak - (y1 + y2) / 2, ang = Math.atan2(y2 - cy, x2 - cx);
    return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
      + (arrowHead ? g(`fin fin${n}`, head(x2, y2, ang, color, width), delay + 0.9) : '') + '</g>';
  };
  // 그어지는 곧은 줄(칸 n), 끝에 화살촉
  const drawArrow = (x1, y1, x2, y2, color, n, { width = 5, delay = 0, arrowHead = true } = {}) =>
    `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + (arrowHead ? g(`fin fin${n}`, head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color, width), delay + 0.9) : '') + '</g>';
  const cross = (x, y, r = 13, color = C.red) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
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
    .sc-${id} .${cls} { transform: ${from}; transition: transform ${dur}s ease-in-out ${delay}s; }
    .on${n} .sc-${id} .${cls} { transform: ${to}; }`;
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;

  const K = '3-2/국어/';
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;
  const bar = (x, y, w, color = C.line, h = 9) => `<rect x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 점자 한 칸: 세로 셋·가로 둘, 왼쪽 위에서 아래로 1·2·3점, 오른쪽 위에서 아래로 4·5·6점. (cx, cy)는 칸 가운데
  const brailleDots = (cx, cy, dots, { gap = 26, r = 9, cls = '' } = {}) => {
    let s = '';
    for (let n = 1; n <= 6; n++) {
      const x = cx + (n <= 3 ? -gap / 2 : gap / 2), y = cy + ((n - 1) % 3 - 1) * gap;
      s += dots.includes(n)
        ? `<g class="${cls} d${n}"><circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.ink}"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.32)}" fill="white" opacity=".55"/></g>`
        : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.45)}" fill="${C.line}"/>`;
    }
    return s;
  };
  const cellBox = (cx, cy, gap = 26) => `<rect x="${f(cx - gap - 2)}" y="${f(cy - gap * 1.85)}" width="${f(gap * 2 + 4)}" height="${f(gap * 3.7)}" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/>`;

  // ── 3단원: 통계(좋아하는 과일 조사 — 흩어진 쪽지가 표로 모이고, 표가 막대그래프가 된다) ──────────────────────────────
  (function () {
    const id = 't32-k2-tonggye';
    let css = base(id);
    const kinds = [['사과', C.red, 5], ['귤', C.orange, 4], ['포도', C.purple, 3]];
    const ys = [119, 189, 259];
    const fruit = (k, x, y) => k === 2
      ? `<circle cx="${x - 6}" cy="${y - 4}" r="7.5" fill="${C.purple}"/><circle cx="${x + 6}" cy="${y - 4}" r="7.5" fill="${C.purple}"/><circle cx="${x}" cy="${y + 7}" r="7.5" fill="${C.purple}"/><path d="M${x} ${y - 11} V${y - 17}" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>`
      : `<circle cx="${x}" cy="${y + 1}" r="13" fill="${kinds[k][1]}"/><path d="M${x} ${y - 12} Q${x + 5} ${y - 21} ${x + 12} ${y - 18}" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const scatter = [[70, 100], [200, 92], [292, 132], [110, 172], [240, 205], [62, 250], [180, 262], [298, 245], [142, 122], [262, 295], [92, 302], [222, 152]];
    let body = at(1, 'drop', tag(170, 36, '좋아하는 과일', ROLE.p, 20));
    // 표 틀(칸 2)
    body += at(2, 'fin', `<rect x="30" y="84" width="300" height="210" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M30 154 H330 M30 224 H330 M100 84 V294 M276 84 V294" stroke="${C.line}" stroke-width="2.5"/>`);
    body += kinds.map(([name], k) => at(2, 'fin', text(65, ys[k] + 7, name, { size: 20 }), 0.2)).join('');
    // 조사 쪽지(과일 그림) 열두 개: 칸 1에 흩어져 나타나고 칸 2에 표의 줄로 모인다
    let j = 0;
    kinds.forEach(([, , count], k) => {
      for (let i = 0; i < count; i++, j++) {
        const fx = 126 + i * 36, fy = ys[k], [sx, sy] = scatter[(j * 5) % 12];
        body += `<g class="b1"><g class="tk tk${j}">${g('pop pop1', fruit(k, fx, fy), 0.3 + j * 0.08)}</g></g>`;
        css += move(id, `tk${j}`, `translate(${sx - fx}px, ${sy - fy}px)`, 2, { dur: 0.9, delay: 0.3 + j * 0.05 });
      }
    });
    body += kinds.map(([, , count], k) => at(2, 'pop', text(303, ys[k] + 9, count, { size: 26, color: C.green }), 1.7 + k * 0.15)).join('');
    // 막대그래프(칸 3)
    const xs = [430, 500, 570], unit = 36;
    body += drawArrow(338, 189, 368, 189, C.green, 3, { width: 4 });
    body += at(3, 'fin', `<path d="M386 84 V294 H612" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`, 0.2);
    kinds.forEach(([name, color, count], k) => {
      const h = count * unit;
      body += `<g class="b3"><rect class="gb gb${k}" x="${xs[k] - 22}" y="${294 - h}" width="44" height="${h}" rx="4" fill="${color}"/></g>`;
      css += `.sc-${id} .gb${k} { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform .8s ease-out ${0.5 + k * 0.3}s; } .on3 .sc-${id} .gb${k} { transform: none; }`;
      body += at(3, 'fin', text(xs[k], 294 - h - 10, count, { size: 22 }), 1.3 + k * 0.3);
      body += at(3, 'fin', text(xs[k], 322, name, { size: 19 }), 0.3);
    });
    body += glowRect(24, 78, 312, 222, 4, C.green, 0.1) + glowRect(372, 70, 254, 266, 4, C.green, 0.4);
    body += at(4, 'pop', tag(500, 36, '통계', ROLE.p, 22), 0.8);
    put(K + '3/통계', svg(id, body, css));
  })();

  // ── 3단원: 점자(여섯 점 칸 — 볼록 점의 자리로 글자가 정해진다. 교과서의 수표·숫자 1·2) ──────────────────────────────
  (function () {
    const id = 't32-k2-jeomja';
    let css = base(id);
    // 칸 1: 큰 칸과 점 번호
    const bx = 120, by = 156, bg = 56;
    let body = at(1, 'fin', `<rect x="${bx - bg - 6}" y="${by - bg * 1.6}" width="${bg * 2 + 12}" height="${bg * 3.2}" rx="16" fill="white" stroke="${C.ink}" stroke-width="3"/>`);
    for (let n = 1; n <= 6; n++) {
      const x = bx + (n <= 3 ? -bg / 2 : bg / 2), y = by + ((n - 1) % 3 - 1) * bg;
      body += at(1, 'pop', `<circle cx="${x}" cy="${y}" r="17" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`, 0.3 + n * 0.22);
      body += at(1, 'fin', text(n <= 3 ? bx - bg - 24 : bx + bg + 24, y + 7, n, { size: 20, color: C.blue }), 0.4 + n * 0.22);
    }
    body += at(1, 'pop', tag(bx, 320, '여섯 점', ROLE.s, 20), 1.8);
    // 칸 2: 수표(3·4·5·6점) + 1(1점)
    const c1 = 304, c2 = 404, cy = 156, G = { gap: 34, r: 12 };
    body += at(2, 'fin', cellBox(c1, cy, 34) + cellBox(c2, cy, 34) + brailleDots(c1, cy, [], G) + brailleDots(c2, cy, [], G));
    body += at(2, 'pop', brailleDots(c1, cy, [3, 4, 5, 6], G), 0.4) + at(2, 'pop', brailleDots(c2, cy, [1], G), 0.9);
    body += at(2, 'pop', tag(c1, 58, '수표', ROLE.x, 19), 0.6);
    body += drawArrow(452, cy, 496, cy, C.green, 2, { width: 4, delay: 1.1 });
    body += `<g class="b2 h3">${g('pop pop2', tile(556, cy, '1', { size: 34, w: 74, h: 66, fill: C.mint, stroke: C.green }), 1.6)}</g>`;
    // 칸 3: 2점이 하나 더 솟으면 2가 된다
    const p2 = [c2 - 17, cy];
    body += at(3, 'pop', `<circle cx="${p2[0]}" cy="${p2[1]}" r="12" fill="${C.ink}"/><circle cx="${f(p2[0] - 3.6)}" cy="${f(p2[1] - 3.6)}" r="3.8" fill="white" opacity=".55"/>`, 0.3);
    body += ring(p2[0], p2[1], 17, C.orange, 3, 0.4);
    body += at(3, 'pop', tile(556, cy, '2', { size: 34, w: 74, h: 66, fill: C.mint, stroke: C.green }), 1);
    // 칸 4: 손끝이 점을 따라 지나간다
    const finger = `<rect x="-19" y="0" width="38" height="120" rx="19" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><rect x="-11" y="7" width="22" height="24" rx="9" fill="white" stroke="${C.orange}" stroke-width="2"/>`;
    body += `<g class="b4"><g class="fg"><g transform="translate(${c1 - 17} 196)">${finger}</g></g></g>`;
    css += `@keyframes ${id}-rub { 0% { transform: translateX(0); } 45%, 55% { transform: translateX(${c2 - c1 + 34}px); } 100% { transform: translateX(0); } }
      .on4 .sc-${id} .fg { animation: ${id}-rub 1.8s ease-in-out .3s 2; }`;
    body += glowRect(c1 - 48, 84, c2 - c1 + 96, 144, 4, C.green, 0.1);
    body += at(4, 'pop', tag(556, 300, '점자', ROLE.p, 22), 0.6);
    put(K + '3/점자', svg(id, body, css));
  })();

  // ── 3단원: 창제(빈 자리에 없던 글자가 새로 그려져 훈민정음이 된다) ──────────────────────────────
  (function () {
    const id = 't32-k2-changje';
    let css = base(id);
    let body = at(1, 'pop', g('pf', person(110, 214, C.purple, 24))) + at(1, 'pop', tag(110, 288, '세종 대왕', ROLE.x, 19), 0.3);
    body += at(1, 'fin', `<rect x="240" y="64" width="360" height="236" rx="16" fill="white" stroke="${C.muted}" stroke-width="3" stroke-dasharray="12 10"/>`, 0.4);
    body += `<g class="b1 h2">${g('fin fin1', text(420, 206, '?', { size: 76, color: C.line }), 0.7)}</g>`;
    // 칸 2: 자음 다섯·모음 셋이 한 획씩 그려진다
    body += curve(150, 176, 238, 182, 146, C.purple, 2, { width: 4 });
    const y0 = 116, h = 54, w = 44;
    const strokes = [
      `M270 ${y0} H${270 + w} V${y0 + h}`,
      `M335 ${y0} V${y0 + h} H${335 + w}`,
      `M400 ${y0} H${400 + w} V${y0 + h} H400 Z`,
      `M${465 + w / 2} ${y0} L465 ${y0 + h} M${465 + w / 2 + 3} ${y0 + h / 2} L${465 + w} ${y0 + h}`,
      `M530 ${y0 + h / 2} a ${w / 2} ${h / 2} 0 1 0 ${w} 0 a ${w / 2} ${h / 2} 0 1 0 ${-w} 0`,
      'M375 240 H440', 'M500 212 V268'
    ];
    body += strokes.map((d, i) => `<g class="b2"><path class="draw draw2" pathLength="1" d="${d}" stroke="${C.ink}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transition-delay:${0.5 + i * 0.2}s"/></g>`).join('');
    body += at(2, 'pop', `<circle cx="330" cy="240" r="9" fill="${C.ink}"/>`, 1.2);
    // 칸 3: 틀이 또렷해지고 이름이 붙는다
    body += at(3, 'fin', `<rect x="240" y="64" width="360" height="236" rx="16" fill="none" stroke="${C.green}" stroke-width="4"/>`);
    body += at(3, 'drop', tile(420, 64, '훈민정음', { size: 26, h: 52, fill: C.mint, stroke: C.green }), 0.4);
    body += [[252, 286], [588, 286], [252, 120], [588, 120]].map(([x, y], i) => ring(x, y, 14, C.orange, 3, 0.7 + i * 0.15)).join('');
    body += at(3, 'pop', tag(190, 96, '처음', ROLE.o, 20), 1.1);
    body += glowRect(232, 56, 376, 252, 4, C.green, 0.1);
    body += at(4, 'pop', tag(110, 332, '창제', ROLE.p, 22), 0.5);
    css += pulseCss(id, '.pf', 4, 0.6);
    put(K + '3/창제', svg(id, body, css));
  })();

  // ── 3단원: 원리(훈민정음도 한글 점자도 자음과 모음을 모아 '고'를 쓴다) ──────────────────────────────
  (function () {
    const id = 't32-k2-wonri';
    let css = base(id);
    const ty = 80, by = 236, xa = 220, xb = 350, xr = 510;
    let body = at(1, 'pop', tag(78, ty, '훈민정음', ROLE.o, 19));
    body += at(1, 'slide', tile(xa, ty, 'ㄱ', { size: 32, w: 64, h: 60 }), 0.3) + at(1, 'fin', text(285, ty + 11, '+', { size: 30, color: C.muted }), 0.6);
    body += at(1, 'slr', tile(xb, ty, 'ㅗ', { size: 32, w: 64, h: 60 }), 0.6);
    body += drawArrow(394, ty, 444, ty, C.green, 1, { width: 4, delay: 0.9 });
    body += at(1, 'pop', g('rs1', tile(xr, ty, '고', { size: 34, w: 82, h: 64, fill: C.mint, stroke: C.green })), 1.8);
    // 칸 2: 점자 칸 — ㄱ(4점), ㅗ(1·3·6점)
    body += at(2, 'pop', tag(78, by, '점자', ROLE.s, 19));
    body += [xa, xb].map((x, i) => `<g class="b2"><path class="draw draw2" pathLength="1" d="M${x} ${ty + 32} V${by - 50}" stroke="${C.line}" stroke-width="3" fill="none" style="transition-delay:${0.2 + i * 0.3}s"/></g>`).join('');
    body += at(2, 'pop', cellBox(xa, by) + brailleDots(xa, by, [4]), 0.7) + at(2, 'fin', text(285, by + 11, '+', { size: 30, color: C.muted }), 1);
    body += at(2, 'pop', cellBox(xb, by) + brailleDots(xb, by, [1, 3, 6]), 1);
    body += drawArrow(394, by, 444, by, C.green, 2, { width: 4, delay: 1.1 });
    body += at(2, 'pop', g('rs2', cellBox(xr - 29, by) + cellBox(xr + 29, by) + brailleDots(xr - 29, by, [4]) + brailleDots(xr + 29, by, [1, 3, 6])), 1.7);
    body += at(2, 'fin', text(xr, 326, '고', { size: 22, color: C.green }), 1.9);
    // 칸 3: 두 줄이 같은 규칙 — 자음 + 모음
    body += at(3, 'pop', tag(xa, 158, '자음', ROLE.s, 19), 0.2) + at(3, 'pop', tag(xb, 158, '모음', ROLE.x, 19), 0.5);
    body += glowRect(178, 40, 214, 274, 3, C.green, 0.8);
    // 칸 4: 원리
    css += pulseCss(id, '.rs1', 4, 0.2) + pulseCss(id, '.rs2', 4, 0.2);
    body += at(4, 'pop', tag(xa + 65, 340, '원리', ROLE.p, 22), 0.6);
    put(K + '3/원리', svg(id, body, css));
  })();

  // ── 3단원: 이어 주는 말(「감기 걸린 날」 — 두 문장 사이에 그래서·그리고·그러나가 들어가 잇는다) ──────────────────────────────
  (function () {
    const id = 't32-k2-ieo';
    let css = base(id);
    const rows = [['몸이 아팠습니다.', '그래서', '병원에 갔습니다.', ROLE.o], ['약을 주셨습니다.', '그리고', '푹 쉬라고 하셨습니다.', ROLE.s], ['괜찮다고 하셨습니다.', '그러나', '걱정되었습니다.', ROLE.x]];
    const ys = [58, 154, 250];
    let body = '';
    rows.forEach(([a, c, b, col], k) => {
      const n = k + 1, y = ys[k];
      const [pa, pc, pb] = row([a, c, b], { y, size: 22, gap: 14 });
      body += at(n, 'slide', T(pa, { h: 48 })) + at(n, 'slr', T(pb, { h: 48 }));
      body += at(n, 'fin', `<rect x="${f(pc.l)}" y="${y - 24}" width="${pc.w}" height="48" rx="12" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`, 0.3);
      body += at(n, 'drop', g(`cn cn${n}`, T(pc, { h: 48, fill: col[0], stroke: col[1] })), 0.9);
      body += ring(pc.cx, y, 26, col[1], n, 1.1);
      body += curve(pa.cx, y + 26, pb.cx, y + 26, y + 50, col[1], n, { width: 3.5, delay: 1.3 });
      body += glowRect(pc.l - 6, y - 30, pc.w + 12, 60, 4, col[1], 0.1 + k * 0.25, 14);
    });
    css += [1, 2, 3].map((n) => pulseCss(id, `.cn${n}`, 4, 0.2 + n * 0.25)).join('');
    body += at(4, 'pop', tag(320, 334, '이어 주는 말', ROLE.p, 22), 1.1);
    put(K + '3/이어 주는 말', svg(id, body, css));
  })();

  // ── 3단원: 과열(전기를 많이 쓰는 제품을 한 전원 꽂이에 꽂을수록 줄이 뜨거워진다) ──────────────────────────────
  (function () {
    const id = 't32-k2-gwayeol';
    let css = base(id);
    // 온도계
    let body = at(1, 'fin', `<g class="therm"><rect x="40" y="40" width="20" height="136" rx="10" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`
      + [64, 92, 120, 148].map((y) => `<path d="M64 ${y} H74" stroke="${C.muted}" stroke-width="2.5"/>`).join('')
      + `<rect class="merc" x="45" y="50" width="10" height="134" rx="5" fill="${C.red}"/><circle cx="50" cy="186" r="17" fill="${C.red}"/></g>`);
    css += `.sc-${id} .merc { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(.22); transition: transform 1.2s ease-in-out; }
      .on2 .sc-${id} .merc { transform: scaleY(.5); transition-delay: 1.3s; }
      .on3 .sc-${id} .merc { transform: scaleY(1); transition-delay: .3s; }`;
    // 콘센트·전원 꽂이·전깃줄
    body += at(1, 'fin', `<rect x="16" y="216" width="64" height="92" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="34" y="244" width="6" height="18" rx="2" fill="${C.ink}"/><rect x="56" y="244" width="6" height="18" rx="2" fill="${C.ink}"/>`);
    body += at(1, 'fin', `<path class="cord" d="M80 262 C150 262 170 304 240 304" stroke-width="11" fill="none" stroke-linecap="round"/>`, 0.2);
    css += `.sc-${id} .cord { stroke: ${C.muted}; transition: stroke 1s ease; }
      .on2 .sc-${id} .cord { stroke: ${C.orange}; transition-delay: 1.3s; }
      .on3 .sc-${id} .cord { stroke: ${C.red}; transition-delay: .3s; }`;
    const xs = [330, 430, 530];
    body += at(1, 'fin', `<rect x="240" y="282" width="360" height="44" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + xs.map((x) => `<rect x="${x - 9}" y="297" width="4" height="14" fill="${C.ink}"/><rect x="${x + 5}" y="297" width="4" height="14" fill="${C.ink}"/>`).join(''), 0.2);
    const dev = (x, label) => tag(x, 108, label, ROLE.s, 20) + `<path d="M${x} 126 V238" stroke="${C.muted}" stroke-width="5"/>`
      + `<rect x="${x - 17}" y="238" width="34" height="30" rx="6" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5"/><rect x="${x - 9}" y="268" width="4" height="12" fill="${C.ink}"/><rect x="${x + 5}" y="268" width="4" height="12" fill="${C.ink}"/>`;
    const names = ['밥솥', '난로', '다리미'];
    body += at(1, 'fin', dev(xs[0], names[0]), 0.5);
    [1, 2].forEach((k) => {
      body += `<g class="b2"><g class="dv dv${k}">${dev(xs[k], names[k])}</g></g>`;
      css += `.sc-${id} .dv${k} { transform: translateY(-46px); transition: transform .6s ease-in ${0.2 + (k - 1) * 0.5}s; } .on2 .sc-${id} .dv${k} { transform: none; }`;
    });
    // 칸 3: 줄 위로 열기가 피어오른다
    const waves = [[122, 248], [166, 266], [208, 284]];
    body += waves.map(([x, y], i) => `<g class="b3"><path class="wave wv${i}" d="M${x} ${y} q 9 -10 0 -20 q -9 -10 0 -20" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`).join('');
    css += `@keyframes ${id}-wave { 0% { opacity: 0; transform: translateY(6px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateY(-16px); } }
      .sc-${id} .wave { opacity: 0; }
      ${waves.map((_, i) => `.on3 .sc-${id} .wv${i} { animation: ${id}-wave 1.4s ease-out ${0.8 + i * 0.3}s infinite; }`).join('\n')}`;
    body += glowRect(84, 236, 162, 88, 4, C.red, 0.1);
    body += at(4, 'pop', tag(150, 340, '과열', ROLE.o, 22), 0.5);
    css += pulseCss(id, '.therm', 4, 0.3);
    put(K + '3/과열', svg(id, body, css));
  })();

  // ── 3단원: 합선(껍질이 벗겨진 두 전깃줄이 닿아 전기가 지름길로 흐른다) ──────────────────────────────
  (function () {
    const id = 't32-k2-hapseon';
    let css = base(id);
    const s = 0.625; // 비탈 기울기
    // 전깃줄 하나: 구리선(core), 껍질 세 조각, 전기 흐름 점선
    const wire = (cls, y0, dir, color) => {
      const tip = y0 + dir * 50, ye = y0 + dir * 30 * s; // 비탈에서 껍질이 끊기는 높이(x 270, 370)
      const endY = dir > 0 ? 146 : 214;
      const full = `M64 ${y0} H240 L320 ${tip} L400 ${y0} H590 V${endY}`;
      return `<g class="${cls}">`
        + `<path d="${full}" stroke="${C.orange}" stroke-width="7" fill="none" stroke-linejoin="round"/>`
        + `<path d="M64 ${y0} H240 L270 ${f(ye)}" stroke="${color}" stroke-width="24" fill="none" stroke-linejoin="round"/>`
        + `<path d="M370 ${f(ye)} L400 ${y0} H590 V${endY}" stroke="${color}" stroke-width="24" fill="none" stroke-linejoin="round"/>`
        + `<path class="peel" d="M270 ${f(ye)} L320 ${tip} L370 ${f(ye)}" stroke="${color}" stroke-width="24" fill="none" stroke-linejoin="round"/>`
        + `<path class="flow flowL ${dir > 0 ? 'fw' : 'bw'}" d="M64 ${y0} H240 L320 ${tip}" stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
        + `<path class="flow flowR ${dir > 0 ? 'fw' : 'bw'}" d="M320 ${tip} L400 ${y0} H590 V${endY}" stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
        + '</g>';
    };
    // 전기 나오는 곳과 전구
    let body = at(1, 'fin', `<rect x="14" y="88" width="50" height="184" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M45 152 L30 184 H42 L34 212 L54 176 H42 L50 152 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`);
    body += at(1, 'fin', wire('w1', 110, 1, C.blue) + wire('w2', 250, -1, C.purple), 0.2);
    body += at(1, 'fin', `<circle cx="590" cy="180" r="30" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<g class="lit"><circle cx="590" cy="180" r="24" fill="${C.yellow}"/>${[-35, 0, 35, 180].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M${f(590 + 36 * Math.cos(r))} ${f(180 + 36 * Math.sin(r))} L${f(590 + 48 * Math.cos(r))} ${f(180 + 48 * Math.sin(r))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }).join('')}</g>`, 0.4);
    body += at(1, 'pop', tag(150, 52, '껍질', ROLE.s, 20) + `<path d="M150 69 V94" stroke="${C.blue}" stroke-width="3"/>`, 0.8);
    css += `@keyframes ${id}-fw { to { stroke-dashoffset: -40; } } @keyframes ${id}-bw { to { stroke-dashoffset: 40; } }
      .sc-${id} .flow { stroke-dasharray: 6 14; }
      .sc-${id} .fw { animation: ${id}-fw 1s linear infinite; } .sc-${id} .bw { animation: ${id}-bw 1s linear infinite; }
      .sc-${id} .flowR, .sc-${id} .lit, .sc-${id} .peel { transition: opacity .5s ease; }
      .on2 .sc-${id} .peel { opacity: 0; transition-delay: .3s; }
      .sc-${id} .w1, .sc-${id} .w2 { transition: transform .8s ease-in-out .2s; }
      .on3 .sc-${id} .w1 { transform: translateY(16px); } .on3 .sc-${id} .w2 { transform: translateY(-16px); }
      .on3 .sc-${id} .flowR, .on3 .sc-${id} .lit { opacity: 0; transition-delay: 1s; }
      .on3 .sc-${id} .flowL { animation-duration: .35s; }`;
    // 칸 2: 껍질이 벗겨진 자리
    body += `<g class="b2 h3">${g('pop pop2', tag(482, 180, '벗겨짐', ROLE.o, 20) + `<path d="M436 172 L356 146 M436 188 L356 214" stroke="${C.orange}" stroke-width="3"/>`, 0.8)}</g>`;
    // 칸 3: 닿는 자리에 불꽃
    const star = Array.from({ length: 16 }, (_, i) => { const r = i % 2 ? 9 : 22, a = (i * Math.PI) / 8; return `${f(320 + r * Math.cos(a))} ${f(180 + r * Math.sin(a))}`; }).join(' L');
    body += at(3, 'pop', g('spark', `<path d="M${star} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`), 1);
    body += ring(320, 180, 26, C.orange, 3, 1.1);
    body += at(3, 'pop', text(320, 254, '팍!', { size: 24, color: C.orange }), 1.2);
    css += pulseCss(id, '.spark', 4, 0.2);
    body += glowRect(282, 146, 76, 68, 4, C.orange, 0.1);
    body += at(4, 'pop', tag(150, 180, '합선', ROLE.o, 22), 0.5);
    put(K + '3/합선', svg(id, body, css));
  })();

  // ── 3단원: 짜임(설명하는 글 — 처음·가운데·끝, 하는 일이 다른 세 부분) ──────────────────────────────
  (function () {
    const id = 't32-k2-jjaim';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="40" y="18" width="290" height="324" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += at(1, 'fin', text(185, 50, '사물함 정리하는 방법', { size: 19 }), 0.2);
    const parts = [['처음', 66, 114, ROLE.s, '쓰는 목적'], ['가운데', 122, 262, ROLE.p, '순서나 방법'], ['끝', 270, 332, ROLE.x, '간추리기']];
    parts.forEach(([, y1, y2, col], k) => {
      body += `<g class="b2"><rect class="bd bd${k}" x="48" y="${y1}" width="274" height="${y2 - y1}" rx="8" fill="${col[0]}"/></g>`;
      css += `.sc-${id} .bd${k} { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .6s ease-out ${k * 0.6}s; } .on2 .sc-${id} .bd${k} { transform: none; }`;
    });
    // 글줄
    body += at(1, 'fin', bar(60, 84, 240) + bar(60, 100, 190), 0.4);
    ['첫째', '둘째', '셋째'].forEach((w, i) => {
      const y = 148 + i * 44;
      body += at(1, 'fin', text(58, y + 6, w, { size: 18, anchor: 'start', color: C.muted }) + bar(112, y, i === 1 ? 170 : 196), 0.6 + i * 0.15);
    });
    body += at(1, 'fin', bar(60, 290, 236) + bar(60, 312, 150), 1.1);
    // 이름표(칸 2)와 하는 일(칸 3)
    parts.forEach(([label, y1, y2, col, job], k) => {
      const y = (y1 + y2) / 2, w = wOf(label, 19) + 4;
      body += at(2, 'slide', `<path d="M334 ${y} H${410 - w / 2 - 4}" stroke="${col[1]}" stroke-width="2.5" stroke-dasharray="5 5"/>` + g(`pt pt${k}`, tag(410, y, label, col, 19)), 0.3 + k * 0.6);
      body += at(3, 'pop', tile(548, y, job, { size: 19, h: 40, fill: 'white', stroke: col[1], sw: 2.5 }), 0.3 + k * 0.5);
    });
    css += parts.map((_, k) => pulseCss(id, `.pt${k}`, 4, 0.3 + k * 0.25)).join('');
    body += glowRect(30, 8, 598, 344, 4, C.green, 0.1);
    body += at(4, 'pop', tag(540, 34, '짜임', ROLE.p, 22), 0.9);
    put(K + '3/짜임', svg(id, body, css));
  })();

  // ── 4단원: 높임 표현(할아버지께 — 생일→생신, 오는→오시는, 고마워→고맙습니다) ──────────────────────────────
  (function () {
    const id = 't32-k2-nopim';
    let css = base(id);
    let body = at(1, 'pop', person(70, 196, C.purple, 20)) + at(1, 'pop', tag(70, 262, '할아버지', ROLE.x, 19), 0.3);
    const ys = [90, 180, 270], lx = 220, rx = 470, rw = 210;
    ['생일', '오는', '고마워'].forEach((w, i) => { body += at(1, 'rise', tile(lx, ys[i], w, { size: 26, w: 130 }), 0.4 + i * 0.25); });
    // 칸 2: 낱말이 높임의 뜻이 있는 낱말로 바뀐다
    body += drawArrow(292, ys[0], 352, ys[0], C.green, 2, { delay: 0.2 }) + at(2, 'pop', tile(rx, ys[0], '생신', { size: 28, w: rw, fill: C.mint, stroke: C.green }), 1);
    body += ring(rx, ys[0], 30, C.green, 2, 1.3);
    // 칸 3: '오는' 사이에 '시'가 들어가고, '고마워'는 '-습니다'로 끝난다
    body += drawArrow(292, ys[1], 352, ys[1], C.green, 3, { delay: 0.1 });
    body += at(3, 'pop', `<rect x="${rx - rw / 2}" y="${ys[1] - 28}" width="${rw}" height="56" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
      + `<g class="oa">${text(rx - 30, ys[1] + 10, '오', { size: 28 })}</g><g class="ob">${text(rx + 30, ys[1] + 10, '는', { size: 28 })}</g>`, 0.5);
    body += at(3, 'drop', text(rx, ys[1] + 10, '시', { size: 30, color: C.orange }), 1.1);
    css += move(id, 'oa', 'translateX(15px)', 3, { delay: 0.7, dur: 0.4 }) + move(id, 'ob', 'translateX(-15px)', 3, { delay: 0.7, dur: 0.4 });
    body += drawArrow(292, ys[2], 352, ys[2], C.green, 3, { delay: 0.7 });
    body += at(3, 'pop', `<rect x="${rx - rw / 2}" y="${ys[2] - 28}" width="${rw}" height="56" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
      + text(rx - 5, ys[2] + 10, '고맙', { size: 28, anchor: 'end' }), 1.1);
    body += at(3, 'slr', text(rx - 5, ys[2] + 10, '습니다', { size: 28, anchor: 'start', color: C.orange }), 1.5);
    body += glowRect(rx - rw / 2 - 8, 52, rw + 16, 256, 4, C.green, 0.2);
    body += at(4, 'pop', tag(rx, 28, '높임 표현', ROLE.p, 22), 0.5);
    put(K + '4/높임 표현', svg(id, body, css));
  })();

  // ── 4단원: 반말(친구에게 '고마워' — 엄마에게 '물 줘!'는 '물 주세요.'로) ──────────────────────────────
  (function () {
    const id = 't32-k2-banmal';
    let css = base(id);
    // 칸 1: 친구 사이
    let body = at(1, 'pop', person(70, 100, C.blue, 16)) + at(1, 'pop', person(575, 100, C.orange, 16), 0.2);
    body += at(1, 'pop', tag(575, 150, '친구', ROLE.o, 19), 0.4);
    body += `<g class="b1"><g class="mv1">${tile(320, 92, '고마워', { size: 28, w: 140 })}</g></g>`;
    css += `.sc-${id} .mv1 { opacity: 0; transform: translateX(-200px); transition: transform .9s ease-out .6s, opacity .4s ease .6s; } .on1 .sc-${id} .mv1 { opacity: 1; transform: none; }`;
    body += at(1, 'pop', check(424, 92, 12), 1.5);
    // 칸 2: 엄마에게 '물 줘!'
    body += at(2, 'pop', person(70, 262, C.blue, 16)) + at(2, 'pop', person(575, 250, C.purple, 22), 0.2);
    body += at(2, 'pop', tag(575, 326, '엄마', ROLE.x, 19), 0.4);
    body += `<g class="b2"><g class="dim dim3"><g class="mv2">${g('shake shake2', tile(220, 262, '물 줘!', { size: 28, w: 130 }), 1.2)}</g></g></g>`;
    css += `.sc-${id} .mv2 { opacity: 0; transform: translateX(-110px); transition: transform .8s ease-out .5s, opacity .4s ease .5s; } .on2 .sc-${id} .mv2 { opacity: 1; transform: none; }
      .on2 .sc-${id} .shake2 { animation-delay: 1.4s; }`;
    // 칸 3: 높인 말로 바뀐다
    body += drawArrow(292, 262, 342, 262, C.green, 3, { width: 4 });
    body += at(3, 'pop', tile(434, 262, '물 주세요.', { size: 26, fill: C.mint, stroke: C.green }), 0.9);
    body += at(3, 'pop', check(434, 214, 11), 1.4);
    // 칸 4: 반말
    body += glowRect(242, 58, 156, 68, 4, C.orange, 0.1) + glowRect(147, 228, 146, 68, 4, C.orange, 0.3);
    body += at(4, 'pop', tag(320, 34, '반말', ROLE.o, 21), 0.6) + at(4, 'pop', tag(220, 206, '반말', ROLE.o, 21), 0.8);
    put(K + '4/반말', svg(id, body, css));
  })();

  // ── 4단원: 방언·표준어(교과서 다지기 — 개구락지·까구리·깨구리 / 가우·가새·가시개) ──────────────────────────────
  const PX = [120, 320, 520], PCOL = [ROLE.s, ROLE.o, ROLE.x];
  const panels = (n, s = 0) => PX.map((x, k) => at(n, 'pop',
    `<rect x="${x - 90}" y="140" width="180" height="196" rx="16" fill="${PCOL[k][0]}" stroke="${PCOL[k][1]}" stroke-width="2.5"/>`
    + `<path d="M${x - 78} 176 L${x - 64} 162 L${x - 50} 176 Z" fill="${PCOL[k][1]}"/><rect x="${x - 74}" y="176" width="20" height="16" fill="white" stroke="${PCOL[k][1]}" stroke-width="2.5"/>`, s + k * 0.2)).join('');
  const frog = (cx, cy) => `<ellipse cx="${cx}" cy="${cy + 8}" rx="40" ry="26" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
    + [-1, 1].map((d) => `<circle cx="${cx + d * 20}" cy="${cy - 14}" r="12" fill="white" stroke="${C.green}" stroke-width="3"/><circle cx="${cx + d * 20}" cy="${cy - 13}" r="5" fill="${C.ink}"/>`).join('')
    + `<path d="M${cx - 14} ${cy + 12} Q${cx} ${cy + 22} ${cx + 14} ${cy + 12}" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + `<path d="M${cx - 34} ${cy + 30} q -10 6 -16 4 M${cx + 34} ${cy + 30} q 10 6 16 4" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const scissors = (cx, cy) => `<path d="M${cx - 12} ${cy - 38} L${cx + 9} ${cy + 12} M${cx + 12} ${cy - 38} L${cx - 9} ${cy + 12}" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/>`
    + `<circle cx="${cx - 15}" cy="${cy + 24}" r="12" fill="white" stroke="${C.red}" stroke-width="6"/><circle cx="${cx + 15}" cy="${cy + 24}" r="12" fill="white" stroke="${C.red}" stroke-width="6"/>`
    + `<circle cx="${cx}" cy="${cy - 8.6}" r="4" fill="${C.ink}"/>`;
  const dial = (x, label) => tile(x, 212, label, { size: 26, h: 52, fill: 'white', stroke: C.orange });

  // 방언: 같은 개구리를 고장마다 다르게 부른다
  (function () {
    const id = 't32-k2-bangeon';
    let css = base(id);
    const words = ['개구락지', '까구리', '깨구리'];
    let body = at(1, 'pop', frog(320, 68)) + panels(1, 0.4);
    const line = (k, n, delay) => curve(PX[k] + (k === 0 ? 50 : k === 2 ? -50 : 0), 140, 320 + (k - 1) * 30, 104, k === 1 ? 122 : 116, C.muted, n, { width: 3, arrowHead: false, delay });
    body += line(0, 2, 0.1) + at(2, 'rise', dial(PX[0], words[0]), 0.7);
    body += line(1, 3, 0.1) + at(3, 'rise', dial(PX[1], words[1]), 0.6);
    body += line(2, 3, 0.6) + at(3, 'rise', dial(PX[2], words[2]), 1.1);
    body += PX.map((x, k) => glowRect(x - wOf(words[k], 26) / 2 - 6, 180, wOf(words[k], 26) + 12, 64, 4, C.orange, 0.1 + k * 0.2)).join('');
    body += PX.map((x, k) => at(4, 'pop', tag(x, 290, '방언', ROLE.o, 21), 0.6 + k * 0.2)).join('');
    body += at(4, 'fin', g('dim', tile(486, 68, '개구리', { size: 24, h: 46, fill: 'white', stroke: C.green, color: C.muted })), 1.4) + at(4, 'fin', tag(590, 68, '표준어', ROLE.p, 18), 1.6);
    put(K + '4/방언', svg(id, body, css));
  })();

  // 표준어: 고장마다 다른 말 가운데 '가위'를 모두 함께 쓰기로 정한다
  (function () {
    const id = 't32-k2-pyojun';
    let css = base(id);
    const words = ['가우', '가새', '가시개'];
    let body = at(1, 'pop', scissors(320, 76)) + panels(1, 0.3);
    body += PX.map((x, k) => `<g class="b1"><g class="dim dim2">${g('rise rise1', dial(x, words[k]), 0.9 + k * 0.3)}</g></g>`).join('');
    // 칸 2: 가위
    body += at(2, 'drop', g('pulse pulse4', tile(452, 76, '가위', { size: 28, w: 110, fill: C.mint, stroke: C.green })), 0.6);
    body += ring(452, 76, 34, C.green, 2, 0.9);
    // 칸 3: 가위가 고장마다 날아가 앉는다
    PX.forEach((x, k) => {
      body += `<g class="b3"><g class="cp cp${k}">${tile(x, 280, '가위', { size: 26, w: 104, h: 50, fill: C.mint, stroke: C.green })}</g></g>`;
      css += move(id, `cp${k}`, `translate(${452 - x}px, ${76 - 280}px)`, 3, { dur: 0.9, delay: 0.3 + k * 0.35 });
    });
    body += PX.map((x, k) => ring(x, 280, 30, C.green, 3, 1.2 + k * 0.35)).join('');
    body += at(4, 'pop', tag(574, 76, '표준어', ROLE.p, 21), 0.5);
    css += [0, 1, 2].map((k) => pulseCss(id, `.cp${k} .tl`, 4, 0.6 + k * 0.15)).join('');
    put(K + '4/표준어', svg(id, body, css));
  })();

  // ── 4단원: 포함(가구라는 큰 묶음 안에 식탁·의자·침대가 들어간다) ──────────────────────────────
  (function () {
    const id = 't32-k2-poham';
    let css = base(id);
    const items = [['식탁', 140, 208], ['의자', 260, 320], ['침대', 380, 432]];
    // 칸 2: 큰 묶음(낱말 조각보다 먼저 깔아 조각이 위에 오게)
    let body = `<g class="b2"><path class="draw draw2" pathLength="1" d="M162 116 H478 Q498 116 498 136 V312 Q498 332 478 332 H162 Q142 332 142 312 V136 Q142 116 162 116 Z" fill="none" stroke="${C.green}" stroke-width="4"/></g>`;
    body += at(2, 'fin', `<rect x="144" y="118" width="352" height="212" rx="18" fill="${C.mint}" opacity=".55"/>`, 0.8);
    body += at(2, 'drop', g('box', tile(320, 166, '가구', { size: 30, w: 120, h: 58, fill: 'white', stroke: C.green })), 1);
    body += items.map(([w, sx], i) => `<g class="b1"><g class="it it${i}">${g('pop pop1', tile(sx, 52, w, { size: 28, w: 96 }), 0.2 + i * 0.3)}</g></g>`).join('');
    body += at(1, 'pop', g('apple', tile(520, 52, '사과', { size: 28, w: 96 })), 1.1);
    // 칸 3: 식탁·의자·침대가 묶음 안으로
    items.forEach(([, sx, fx], i) => { css += move(id, `it${i}`, 'none', 3, { dur: 0.9, delay: 0.2 + i * 0.35, to: `translate(${fx - sx}px, ${258 - 52}px)` }); });
    body += items.map(([, , fx], i) => ring(fx, 258, 30, C.green, 3, 1 + i * 0.35)).join('');
    // 칸 4: 포함
    css += pulseCss(id, '.box', 4, 0.2) + `.sc-${id} .apple { transition: opacity .6s ease; } .on4 .sc-${id} .apple { opacity: .35; }`;
    body += glowRect(136, 110, 368, 228, 4, C.green, 0.1);
    body += at(4, 'pop', tag(572, 210, '포함', ROLE.p, 22), 0.5);
    put(K + '4/포함', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
