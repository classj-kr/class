// 수학 7-1 2단원 정수와 유리수: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const SERIF = "'Times New Roman',Times,serif";

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(class="draw dN" pathLength="1"), rN 퍼지는 고리,
  // kN 깜빡이며 남기, fN 날아오기(--dx, --dy 에서 제자리로), mvN 옮겨 가기(--xN, --yN 으로; 칸이 쌓이면 뒤 칸이 이김)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .6s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .mv { transition: transform .9s ease-in-out; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .9s ease-in-out both; }
    .on${n} .sc-${id} .mv${n} { transform: translate(var(--x${n}, 0px), var(--y${n}, 0px)); }`;
    return css;
  };

  // ── 수식 글자 ──
  // 영문자는 기울인 바탕체, 수·기호는 굵은 고딕. '-' 는 빼기표(−), '*' 는 곱셈표(×).
  // a^2, a^{12}: 위첨자. {#orange|글자}: 그 부분만 색. 위첨자 안에서도 ^{#blue|4} 처럼 쓴다.
  const esc = (s) => s.replace(/-/g, '−').replace(/\*/g, '×');
  function tsp(src, size) {
    const st = { back: 0 }, up = f(size * 0.42), small = f(size * 0.62);
    const dy = () => { const d = st.back; st.back = 0; return d ? ` dy="${d}"` : ''; };
    const walk = (s) => {
      let out = '', i = 0;
      while (i < s.length) {
        if (s.startsWith('{#', i)) {
          const bar = s.indexOf('|', i), end = s.indexOf('}', bar);
          out += `<tspan fill="${C[s.slice(i + 2, bar)] || s.slice(i + 2, bar)}">${walk(s.slice(bar + 1, end))}</tspan>`;
          i = end + 1; continue;
        }
        if (s[i] === '^') {
          let g;
          if (s[i + 1] === '{') { let j = i + 2, depth = 1; while (depth) { if (s[j] === '{') depth++; if (s[j] === '}') depth--; j++; } g = s.slice(i + 2, j - 1); i = j; } else { g = s[i + 1]; i += 2; }
          let color = '';
          if (g.startsWith('#')) { const bar = g.indexOf('|'); color = ` fill="${C[g.slice(1, bar)] || g.slice(1, bar)}"`; g = g.slice(bar + 1); }
          out += `<tspan dy="${f(-up + st.back)}" dx="2" font-size="${small}"${color}>${esc(g)}</tspan>`;
          st.back = up; continue;
        }
        const isL = /[a-zA-Z]/.test(s[i]);
        let j = i;
        while (j < s.length && s[j] !== '^' && !s.startsWith('{#', j) && /[a-zA-Z]/.test(s[j]) === isL) j++;
        const piece = s.slice(i, j); i = j;
        out += isL ? `<tspan${dy()} font-family="${SERIF}" font-style="italic">${piece}</tspan>` : `<tspan${dy()}>${esc(piece)}</tspan>`;
      }
      return out;
    };
    return walk(src);
  }
  const mt = (x, y, s, { size = 30, color = C.ink, anchor = 'middle', cls = '', st = '' } = {}) =>
    `<text class="${cls}" ${st} x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-size="${size}" font-weight="700" fill="${color}">${tsp(String(s), size)}</text>`;
  // 글자 폭 어림(고리·상자 자리 잡기용)
  const cw = (ch) => (/[0-9]/.test(ch) ? .58 : /[a-zA-Z]/.test(ch) ? .52 : ch === ' ' ? .3 : /[()|,.]/.test(ch) ? .34 : .66);
  function wid(src, size) {
    const s = String(src).replace(/\{#\w+\|([^{}]*)\}/g, '$1');
    let w = 0, i = 0;
    while (i < s.length) {
      if (s[i] === '^') {
        let g; if (s[i + 1] === '{') { const j = s.indexOf('}', i); g = s.slice(i + 2, j); i = j + 1; } else { g = s[i + 1]; i += 2; }
        w += [...g].reduce((a, c) => a + cw(c), 0) * size * .62 + 2; continue;
      }
      w += cw(s[i]) * size; i++;
    }
    return w;
  }
  // 세로 분수: 가운데 가로줄 높이가 cy
  function fr(x, cy, n, d, { size = 30, color = C.ink, nc = color, dc = color } = {}) {
    const w = Math.max(wid(n, size), wid(d, size)) + 12;
    return mt(x, cy - size * 0.24, n, { size, color: nc })
      + `<path d="M${f(x - w / 2)} ${f(cy)} H${f(x + w / 2)}" stroke="${color}" stroke-width="${size > 26 ? 3 : 2.5}" stroke-linecap="round"/>`
      + mt(x, cy + size * 0.98, d, { size, color: dc });
  }
  // 한 줄 수식: 조각마다 가운데 x(xs)와 폭(ws)을 돌려준다. 조각: '글자' | {s, c, cls, st, size} | {fr:[분자, 분모], c, cls, st}
  function row(cx, y, items, { size = 32, gap = size * .3, color = C.ink, anchor = 'middle' } = {}) {
    const it = items.map((o) => (typeof o === 'string' ? { s: o } : o));
    const ws = it.map((o) => o.w ?? (o.fr ? Math.max(wid(o.fr[0], size * .8), wid(o.fr[1], size * .8)) + 12 : wid(o.s, o.size || size)));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (it.length - 1);
    let x = anchor === 'middle' ? cx - total / 2 : anchor === 'end' ? cx - total : cx;
    const xs = [];
    let body = '';
    it.forEach((o, k) => {
      const c = x + ws[k] / 2; xs.push(f(c));
      let m = o.fr ? fr(c, y - size * .34, o.fr[0], o.fr[1], { size: size * .8, color: o.c || color })
        : o.s === '' ? '' : mt(c, y, o.s, { size: o.size || size, color: o.c || color });
      if (o.cls) m = `<g class="${o.cls}" ${o.st || ''}>${m}</g>`;
      body += m; x += ws[k] + gap;
    });
    return { body, xs, ws, total, left: anchor === 'middle' ? cx - total / 2 : cx };
  }
  const ring = (x, y, r, color, cls, d = 0, w = 4) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
  const pill = (x, y, label, color, { size = 24, cls = '', d = 0, fill = 'white' } = {}) => {
    const w = [...label].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : .6), 0) * size + 26, h = size + 18;
    return `<g class="${cls}" ${cls ? delay(d) : ''}><rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${color}" stroke-width="3"/>${text(x, f(y + size * .36), label, { size, color })}</g>`;
  };

  // 수직선: from~to 정수 눈금. at(n) 은 화면 x. 눈금 수는 +1, −1 처럼 부호를 붙인다(sign: false 면 붙이지 않음).
  const sgn = (n) => (n > 0 ? `+${n}` : n < 0 ? `-${-n}` : '0');
  function nline(from, to, { y = 200, x0 = 60, x1 = 580, sign = true, size = 19, labels = true, skip = [], cls = '' } = {}) {
    const at = (n) => x0 + (n - from) * (x1 - x0) / (to - from);
    let body = `<path class="${cls}" ${cls ? 'pathLength="1"' : ''} d="M${x0 - 22} ${y} H${x1 + 22}" stroke="${C.ink}" stroke-width="3"/>`;
    for (let n = from; n <= to; n++) {
      body += `<path d="M${f(at(n))} ${y - 9} V${y + 9}" stroke="${C.ink}" stroke-width="2"/>`;
      if (labels && !skip.includes(n)) body += mt(at(n), y + 34, sign ? sgn(n) : String(n), { size, color: n > 0 ? C.orange : n < 0 ? C.blue : C.ink });
    }
    return { body, at };
  }
  // 선으로 그려지는 화살표(class="draw dN")
  const darrow = (pts, color, cls, d = 0, w = 4) => {
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), l = 12;
    const p = (t) => `${f(x2 - l * Math.cos(a + t))} ${f(y2 - l * Math.sin(a + t))}`;
    return `<path class="draw ${cls}" pathLength="1" ${delay(d)} d="M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} M${p(-0.5)} L${f(x2)} ${f(y2)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  };
  const hop = (xa, xb, y, h, color, cls, d) => {
    const m = (xa + xb) / 2;
    return `<path class="draw ${cls}" pathLength="1" ${delay(d)} d="M${f(xa)} ${y} Q${f(m)} ${y - h} ${f(xb)} ${y}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  };
  const dot = (x, y, color, cls = '', d = 0, r = 9) => `<circle class="${cls}" ${cls ? delay(d) : ''} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${color}" stroke="white" stroke-width="2.5"/>`;

  // 온도계: 눈금 −5~5 ℃, 1 ℃ = 20px, 0 ℃ 는 y 170. 수은 기둥은 v ℃ 까지, 처음엔 0 ℃ 높이에서 시작해 늘거나 준다.
  function thermo(x, v, color, beat) {
    const Y = (t) => 170 - t * 20, bulb = 302;
    let s = `<rect x="${x - 13}" y="44" width="26" height="${bulb - 44}" rx="13" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<circle cx="${x}" cy="${bulb}" r="22" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    for (let t = -5; t <= 5; t++) s += `<path d="M${x - 13} ${Y(t)} h${t % 5 ? -10 : -18}" stroke="${C.ink}" stroke-width="${t % 5 ? 2 : 3}"/>`;
    for (const t of [-5, 5]) s += mt(x - 52, Y(t) + 7, sgn(t), { size: 19, color: t > 0 ? C.orange : C.blue });
    s += text(x - 54, Y(0) + 7, '0', { size: 22 });
    const top = Y(v), h0 = bulb - Y(0), h = bulb - top;
    s += `<circle cx="${x}" cy="${bulb}" r="15" fill="${color}"/>`
      + `<rect class="col${beat}" x="${x - 6}" y="${f(top)}" width="12" height="${f(h)}" rx="6" fill="${color}" style="--k:${f(h0 / h)}"/>`;
    return { body: s, Y };
  }
  const thermoCss = (id, beat) => `
    .sc-${id} .col${beat} { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(var(--k)); transition: transform 1.2s ease-in-out .2s; }
    .on${beat} .sc-${id} .col${beat} { transform: none; }`;

  // 양수: 0 ℃ 를 기준으로 → 5 ℃ 높아지면 +5 ℃ → 수직선 0 의 오른쪽
  // 음수: 0 ℃ 를 기준으로 → 3 ℃ 낮아지면 −3 ℃ → 수직선 0 의 왼쪽
  for (const [word, id, v, color, fill, pts, side] of [
    ['양수', 't71-m2-yangsu', 5, C.orange, C.peach, [1, 3, 5], 1],
    ['음수', 't71-m2-eumsu', -3, C.blue, C.sky, [-1, -3, -5], -1]
  ]) {
    const T = thermo(120, v, color, 2);
    const nl = nline(-5, 5, { y: 210, x0: 312, x1: 600, skip: [-4, -3, -2, -1, 1, 2, 3, 4] });
    const y0 = T.Y(0), yv = T.Y(v);
    const band = side > 0 ? [nl.at(0), nl.at(5)] : [nl.at(-5), nl.at(0)];
    const body = T.body
      + `<g class="s1" ${delay(.2)}><path d="M150 ${y0} H214" stroke="${C.green}" stroke-width="3" stroke-dasharray="7 6"/>${text(246, y0 + 8, '0 ℃', { size: 22, color: C.green })}</g>`
      + ring(120, y0, 18, C.green, 'r1', .4)
      + `<g class="s2" ${delay(1.2)}><path d="M150 ${yv} H196" stroke="${color}" stroke-width="3"/>${mt(200, yv + 9, `${sgn(v)} ℃`, { size: 28, color, anchor: 'start' })}</g>`
      + `<g class="s2" ${delay(.3)}>${arrow(96, y0, 96, yv + (side > 0 ? 8 : -8), color, '', 4)}</g>`
      + `<g class="s3"><rect x="${f(band[0])}" y="168" width="${f(band[1] - band[0])}" height="42" rx="6" fill="${fill}"/></g>`
      + `<g class="s3">${nl.body}</g>`
      + pts.map((n, i) => dot(nl.at(n), 210, color, 'p3', .5 + i * .25) + `<g class="s3" ${delay(.6 + i * .25)}>${mt(nl.at(n), 196, sgn(n), { size: 20, color })}</g>`).join('')
      + pill((band[0] + band[1]) / 2, 136, word, color, { size: 26, cls: 'p3', d: 1.3, fill });
    put(`7-1/수학/2/${word}`, svg(id, body, motion(id) + thermoCss(id, 2)));
  }

  // 부호: 0 에서 오른쪽으로 8칸, 왼쪽으로 8칸 → +8, −8 (숫자는 같고 기호만 다름) → +, − 가 부호
  (function () {
    const id = 't71-m2-buho';
    const nl = nline(-8, 8, { y: 230, x0: 60, x1: 580, labels: false });
    const zero = mt(nl.at(0), 264, '0', { size: 20 });
    const body = nl.body + zero
      + hop(nl.at(0), nl.at(8), 222, 120, C.orange, 'd1', .2) + hop(nl.at(0), nl.at(-8), 222, 120, C.blue, 'd1', .2)
      + dot(nl.at(8), 230, C.orange, 'p1', .8) + dot(nl.at(-8), 230, C.blue, 'p1', .8)
      + `<g class="s1" ${delay(.9)}>${text(nl.at(4), 152, '8칸', { size: 22, color: C.orange })}${text(nl.at(-4), 152, '8칸', { size: 22, color: C.blue })}</g>`
      + `<g class="s2">${mt(nl.at(8), 290, '8', { size: 40 })}${mt(nl.at(-8), 290, '8', { size: 40 })}</g>`
      + `<g class="p2" ${delay(.6)}>${mt(nl.at(8) - 26, 290, '+', { size: 40, color: C.orange })}</g>`
      + `<g class="p2" ${delay(.6)}>${mt(nl.at(-8) - 24, 290, '-', { size: 40, color: C.blue })}</g>`
      + ring(nl.at(8) - 26, 276, 22, C.orange, 'r3', .2) + ring(nl.at(-8) - 24, 276, 22, C.blue, 'r3', .2)
      + `<g class="p3" ${delay(.6)}>${mt(270, 62, '+', { size: 54, color: C.orange })}${mt(370, 62, '-', { size: 54, color: C.blue })}</g>`
      + pill(320, 330 - 0, '부호', C.green, { size: 26, cls: 'p3', d: 1, fill: C.mint });
    put('7-1/수학/2/부호', svg(id, body, motion(id)));
  })();

  // 양의 정수 / 음의 정수: 자연수 1, 2, 3 에 + 또는 − 를 붙여 → 수직선의 0 오른쪽(왼쪽) 눈금으로
  for (const [word, id, s, color, fill] of [
    ['양의 정수', 't71-m2-yangjeong', 1, C.orange, C.peach],
    ['음의 정수', 't71-m2-eumjeong', -1, C.blue, C.sky]
  ]) {
    const nl = nline(-4, 4, { y: 262, x0: 80, x1: 560, labels: false });
    const TX = (k) => 200 + k * 120, TY = 92;
    let body = nl.body + mt(nl.at(0), 296, '0', { size: 20 });
    [1, 2, 3].forEach((n, k) => {
      body += `<g class="p1" ${delay(.2 + k * .2)}><rect x="${TX(k) - 46}" y="${TY - 38}" width="92" height="70" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>${text(TX(k) + 10, TY + 12, n, { size: 36 })}</g>`
        + `<g class="p2" ${delay(.2 + k * .25)}>${mt(TX(k) - 16, TY + 12, s > 0 ? '+' : '-', { size: 36, color })}</g>`;
      const px = nl.at(s * n);
      body += dot(px, 262, color, 'p3', .7 + k * .2)
        + `<g class="f3" ${delay(.1 + k * .2, `--dx:${f(TX(k) - px)}px;--dy:${TY - 216}px`)}>${mt(px, 228, sgn(s * n), { size: 28, color })}</g>`;
    });
    body += `<g class="h2"><g class="s1" ${delay(.9)}>${text(320, 34, '자연수', { size: 22, color: C.muted })}</g></g>`
      + pill(s > 0 ? 470 : 170, 324, word, color, { size: 24, cls: 'p3', d: 1.2, fill });
    put(`7-1/수학/2/${word}`, svg(id, body, motion(id)));
  }

  // 정수: 수직선의 양의 정수(오른쪽) → 음의 정수(왼쪽) → 0 까지 통틀어
  (function () {
    const id = 't71-m2-jeongsu';
    const nl = nline(-4, 4, { y: 200, x0: 90, x1: 550 });
    const br = (a, b, y, color, cls, d, label, up = true) => {
      const s = up ? 1 : -1;
      return `<g class="${cls}" ${delay(d)}><path d="M${f(a)} ${y + 10 * s} V${y} H${f(b)} V${y + 10 * s}" stroke="${color}" stroke-width="3" fill="none"/>${text(f((a + b) / 2), up ? y - 12 : y + 30, label, { size: 24, color })}</g>`;
    };
    let body = nl.body;
    [1, 2, 3, 4].forEach((n, i) => { body += dot(nl.at(n), 200, C.orange, 'p1', .2 + i * .15) + dot(nl.at(-n), 200, C.blue, 'p2', .2 + i * .15); });
    body += dot(nl.at(0), 200, C.green, 'p3', .2, 11)
      + br(nl.at(1) - 12, nl.at(4) + 12, 160, C.orange, 's1', .9, '양의 정수')
      + br(nl.at(-4) - 12, nl.at(-1) + 12, 160, C.blue, 's2', .9, '음의 정수')
      + br(nl.at(-4) - 18, nl.at(4) + 18, 262, C.green, 's3', .8, '', false)
      + pill(320, 316, '정수', C.green, { size: 26, cls: 'p3', d: 1.1, fill: C.mint });
    put('7-1/수학/2/정수', svg(id, body, motion(id)));
  })();

  // 유리수: 정수(−3, 0, +2)의 작은 원 → 큰 원이 감싸며 +2/3, −0.5, −7/4 까지 → −0.5 = −1/2, 유리수
  (function () {
    const id = 't71-m2-yurisu';
    const sgnFr = (x, y, s, n, d, color, size = 30) => row(x, y, [{ s, c: color }, { fr: [n, d], c: color }], { size, gap: 4 }).body;
    const body = `<g class="p2" ${delay(.1)}><ellipse cx="322" cy="186" rx="292" ry="158" fill="${C.peach}" fill-opacity=".5" stroke="${C.orange}" stroke-width="3.5"/></g>`
      + `<g class="p1" ${delay(.1)}><ellipse cx="230" cy="190" rx="122" ry="92" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5"/></g>`
      + `<g class="s1" ${delay(.4)}>${text(230, 140, '정수', { size: 24, color: C.green })}${mt(180, 200, '-3', { size: 32 })}${mt(240, 232, '0', { size: 32 })}${mt(290, 196, '+2', { size: 32 })}</g>`
      + `<g class="p2" ${delay(.7)}>${sgnFr(450, 140, '+', 2, 3, C.ink)}</g>`
      + `<g class="p2" ${delay(.9)}>${mt(440, 226, '-0.5', { size: 32 })}</g>`
      + `<g class="p2" ${delay(1.1)}>${sgnFr(420, 300, '-', 7, 4, C.ink)}</g>`
      + `<g class="s3" ${delay(.2)}>${row(500, 226, ['=', { s: '-', c: C.orange }, { fr: ['1', '2'], c: C.orange }], { size: 32, gap: 6, anchor: 'start' }).body}</g>`
      + pill(322, 28, '유리수', C.orange, { size: 26, cls: 'p3', d: .8, fill: 'white' });
    put('7-1/수학/2/유리수', svg(id, body, motion(id)));
  })();

  // 수직선: 직선을 긋고 0 을 정함 → 같은 간격의 눈금 → 오른쪽 양수, 왼쪽 음수
  (function () {
    const id = 't71-m2-sujikseon';
    const at = (n) => 320 + n * 58;
    let body = `<path class="draw d1" pathLength="1" ${delay(.1)} d="M40 190 H600" stroke="${C.ink}" stroke-width="3.5"/>`
      + dot(at(0), 190, C.green, 'p1', .7, 10) + `<g class="s1" ${delay(.8)}>${text(at(0), 236, '0', { size: 24, color: C.green })}</g>`;
    for (let n = 1; n <= 4; n++) {
      for (const s of [1, -1]) {
        body += `<g class="p2" ${delay(.1 + n * .22)}><path d="M${at(s * n)} 180 V200" stroke="${C.ink}" stroke-width="3"/></g>`
          + `<g class="s3" ${delay(.1 + n * .2)}>${mt(at(s * n), 236, sgn(s * n), { size: 24, color: s > 0 ? C.orange : C.blue })}</g>`;
      }
    }
    body += [0, 1, 2, 3].map((k) => `<g class="s2" ${delay(.3 + k * .22)}><path d="M${at(k) + 6} 160 H${at(k + 1) - 6}" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/><path d="M${at(-k) - 6} 160 H${at(-k - 1) + 6}" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/></g>`).join('')
      + `<g class="s3" ${delay(1)}>${arrow(at(1), 294, at(4) + 20, 294, C.orange)}${text(at(2.5), 330, '양수', { size: 24, color: C.orange })}${arrow(at(-1), 294, at(-4) - 20, 294, C.blue)}${text(at(-2.5), 330, '음수', { size: 24, color: C.blue })}</g>`;
    put('7-1/수학/2/수직선', svg(id, body, motion(id)));
  })();

  // 원점: 0 의 점에 O → +5, −3 은 이 점에서 세어 감 → 세로 수직선도 이 점에서 만남
  (function () {
    const id = 't71-m2-wonjeom';
    const nl = nline(-5, 5, { y: 200, x0: 70, x1: 570, skip: [0] });
    let body = nl.body + `<g class="h3">${mt(nl.at(0), 234, '0', { size: 19 })}</g>`;
    for (let k = 0; k < 5; k++) body += hop(nl.at(k), nl.at(k + 1), 192, 44, C.orange, 'd2', .1 + k * .2);
    for (let k = 0; k < 3; k++) body += hop(nl.at(-k), nl.at(-k - 1), 192, 44, C.blue, 'd2', .1 + k * .2);
    body += dot(nl.at(5), 200, C.orange, 'p2', 1.1) + dot(nl.at(-3), 200, C.blue, 'p2', .7)
      // 3칸: 세로 수직선
      + `<path class="draw d3" pathLength="1" ${delay(.1)} d="M320 30 V340" stroke="${C.ink}" stroke-width="3"/>`
      + [-3, -2, -1, 1, 2, 3].map((k) => `<path class="s3" ${delay(.5)} d="M311 ${200 - k * 50} H329" stroke="${C.ink}" stroke-width="2"/>`).join('')
      + dot(320, 200, C.green, '', 0, 11) + ring(320, 200, 18, C.green, 'r1', .3) + ring(320, 200, 18, C.green, 'r3', .8)
      + `<g class="s1" ${delay(.3)}>${text(300, 160, 'O', { size: 28, color: C.green })}</g>`
      + pill(470, 300, '원점', C.green, { size: 26, cls: 'p3', d: 1, fill: C.mint });
    put('7-1/수학/2/원점', svg(id, body, motion(id)));
  })();

  // 절댓값: −6 과 +6 → 원점에서 둘 다 6칸 → |−6| = 6, |+6| = 6
  (function () {
    const id = 't71-m2-jeoldaet';
    const nl = nline(-7, 7, { y: 160, x0: 52, x1: 588 });
    const a = nl.at(-6), b = nl.at(6), o = nl.at(0);
    const body = nl.body
      + dot(a, 160, C.blue, 'p1', .2) + dot(b, 160, C.orange, 'p1', .4)
      + `<g class="s1" ${delay(.5)}>${mt(a, 128, '-6', { size: 30, color: C.blue })}${mt(b, 128, '+6', { size: 30, color: C.orange })}</g>`
      + `<path class="draw d2" pathLength="1" ${delay(.1)} d="M${f(o)} 236 H${f(a)}" stroke="${C.blue}" stroke-width="7" stroke-linecap="round"/>`
      + `<path class="draw d2" pathLength="1" ${delay(.1)} d="M${f(o)} 236 H${f(b)}" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/>`
      + `<g class="s2" ${delay(.2)}><path d="M${f(o)} 168 V250" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="6 5"/></g>`
      + `<g class="p2" ${delay(.7)}>${text((o + a) / 2, 268, '6', { size: 28, color: C.blue })}${text((o + b) / 2, 268, '6', { size: 28, color: C.orange })}</g>`
      + `<g class="s3" ${delay(.2)}>${row(150, 326, ['|{#blue|-6}|', '=', '6'], { size: 32 }).body}${row(490, 326, ['|{#orange|+6}|', '=', '6'], { size: 32 }).body}</g>`
      + pill(320, 316, '절댓값', C.green, { size: 26, cls: 'p3', d: .8, fill: C.mint });
    put('7-1/수학/2/절댓값', svg(id, body, motion(id)));
  })();

  // 교환법칙: (−3) + (+5) 와 (+5) + (−3) 이 수직선에서 둘 다 +2 에 닿음
  (function () {
    const id = 't71-m2-gyohwan';
    const nl = nline(-4, 6, { y: 296, x0: 80, x1: 560, size: 18 });
    const A = row(320, 58, [{ s: '(-3)', c: C.blue }, '+', { s: '(+5)', c: C.orange }, '=', '+2'], { size: 32, gap: 14 });
    const B = row(320, 118, [{ s: '(+5)', c: C.orange }, '+', { s: '(-3)', c: C.blue }, '=', '+2'], { size: 32, gap: 14 });
    const z = nl.at(0);
    const body = nl.body + `<g class="s1">${A.body}</g>`
      + darrow([[z, 254], [nl.at(-3), 254]], C.blue, 'd1', .3) + darrow([[nl.at(-3), 254], [nl.at(-3), 236], [nl.at(2), 236]], C.orange, 'd1', .9)
      + `<g class="f2" ${delay(.1, `--dx:${f(A.xs[2] - B.xs[0])}px;--dy:-60px`)}>${mt(B.xs[0], 118, '(+5)', { size: 32, color: C.orange })}</g>`
      + `<g class="f2" ${delay(.1, `--dx:${f(A.xs[0] - B.xs[2])}px;--dy:-60px`)}>${mt(B.xs[2], 118, '(-3)', { size: 32, color: C.blue })}</g>`
      + `<g class="s2" ${delay(.8)}>${mt(B.xs[1], 118, '+', { size: 32 })}${mt(B.xs[3], 118, '=', { size: 32 })}${mt(B.xs[4], 118, '+2', { size: 32 })}</g>`
      + darrow([[z, 196], [nl.at(5), 196]], C.orange, 'd2', .5) + darrow([[nl.at(5), 196], [nl.at(5), 178], [nl.at(2), 178]], C.blue, 'd2', 1.1)
      + dot(nl.at(2), 296, C.green, 'p1', 1.4, 10) + ring(nl.at(2), 296, 18, C.green, 'r2', 1.6)
      + ring(A.xs[4], 47, 26, C.green, 'r3', .2) + ring(B.xs[4], 107, 26, C.green, 'r3', .2)
      + pill(560, 88, '교환법칙', C.green, { size: 22, cls: 'p3', d: .7, fill: C.mint });
    put('7-1/수학/2/교환법칙', svg(id, body, motion(id)));
  })();

  // 결합법칙: (2 + 7) + 3 과 2 + (7 + 3) 을 블록으로 → 둘 다 12
  (function () {
    const id = 't71-m2-gyeolhap';
    const U = 32, X0 = 112;
    const blocks = (y, cls, d) => [[2, C.peach, C.orange], [7, C.sky, C.blue], [3, C.mint, C.green]].reduce((acc, [n, fill, stroke]) => {
      for (let i = 0; i < n; i++) acc.s += `<rect x="${X0 + (acc.k + i) * U + 2}" y="${y}" width="${U - 4}" height="${U}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
      acc.k += n; return acc;
    }, { s: '', k: 0 }).s;
    const br = (a, b, y, label, color, cls, d) => `<g class="${cls}" ${delay(d)}><path d="M${X0 + a * U + 2} ${y} v10 H${X0 + b * U - 2} v-10" stroke="${color}" stroke-width="3" fill="none"/>${text(X0 + (a + b) * U / 2, y + 36, label, { size: 26, color })}</g>`;
    const body = `<g class="s1">${row(X0, 70, ['(2 + 7) + 3'], { size: 30, anchor: 'start' }).body}${blocks(90)}</g>`
      + br(0, 9, 128, '9', C.purple, 's1', .5)
      + `<g class="p1" ${delay(1.1)}>${mt(570, 116, '12', { size: 36, color: C.purple })}</g>`
      + `<g class="s2">${row(X0, 222, ['2 + (7 + 3)'], { size: 30, anchor: 'start' }).body}${blocks(242)}</g>`
      + br(2, 12, 280, '10', C.purple, 's2', .5)
      + `<g class="p2" ${delay(1.1)}>${mt(570, 268, '12', { size: 36, color: C.purple })}</g>`
      + ring(570, 104, 30, C.purple, 'r3', .2) + ring(570, 256, 30, C.purple, 'r3', .2)
      + `<g class="s3" ${delay(.5)}>${mt(570, 192, '=', { size: 36, color: C.purple })}</g>`
      + pill(470, 186, '결합법칙', C.green, { size: 22, cls: 'p3', d: .8, fill: C.mint });
    put('7-1/수학/2/결합법칙', svg(id, body, motion(id)));
  })();

  // 분배법칙: 세로 4, 가로 5 + 3 인 직사각형 → 둘로 갈라 20 과 12 → 4 × (5 + 3) = 4 × 5 + 4 × 3
  (function () {
    const id = 't71-m2-bunbae';
    const U = 26, X = 56, Y = 104, H = 4 * U;
    let grid = '';
    for (let i = 1; i < 8; i++) if (i !== 5) grid += `<path d="M${X + i * U} ${Y} V${Y + H}" stroke="${C.line}" stroke-width="1.5"/>`;
    const hl = (x0, n) => [1, 2, 3].map((j) => `<path d="M${x0} ${Y + j * U} h${n * U}" stroke="${C.line}" stroke-width="1.5"/>`).join('');
    const part = (x0, n, fill, stroke, val, cls) => `<g class="${cls}"><rect x="${x0}" y="${Y}" width="${n * U}" height="${H}" fill="${fill}"/>${hl(x0, n)}`
      + (n === 5 ? [1, 2, 3, 4].map((i) => `<path d="M${x0 + i * U} ${Y} V${Y + H}" stroke="${C.line}" stroke-width="1.5"/>`).join('') : [1, 2].map((i) => `<path d="M${x0 + i * U} ${Y} V${Y + H}" stroke="${C.line}" stroke-width="1.5"/>`).join(''))
      + `<rect x="${x0}" y="${Y}" width="${n * U}" height="${H}" fill="none" stroke="${stroke}" stroke-width="3"/>`
      + `<g class="p2" ${delay(1)}><rect x="${x0 + n * U / 2 - 28}" y="${Y + H / 2 - 22}" width="56" height="40" rx="8" fill="white" fill-opacity=".9"/>${text(x0 + n * U / 2, Y + H / 2 + 10, val, { size: 28, color: stroke })}</g>`
      + text(x0 + n * U / 2, Y - 12, n, { size: 24, color: stroke }) + '</g>';
    const R1 = row(470, 166, ['=', '4 * 8', '=', '32'], { size: 32, gap: 12 });
    const body = part(X, 5, C.peach, C.orange, 20, '') + `<g class="mv mv2" style="--x2:36px;transition-delay:.2s">${part(X + 5 * U, 3, C.sky, C.blue, 12, '')}</g>`
      + text(X - 20, Y + H / 2 + 9, 4, { size: 26 })
      + `<g class="h2"><rect x="${X}" y="${Y}" width="${8 * U}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3.5"/></g>`
      + `<g class="s1" ${delay(.3)}>${row(470, 112, ['4 * (5 + 3)'], { size: 32 }).body}</g>`
      + `<g class="s1" ${delay(.8)}>${R1.body}</g>`
      + `<g class="s2" ${delay(1.2)}>${row(470, 236, ['{#orange|4 * 5}', '+', '{#blue|4 * 3}'], { size: 32, gap: 12 }).body}</g>`
      + `<g class="s3" ${delay(.2)}>${row(470, 290, ['=', '{#orange|20}', '+', '{#blue|12}', '=', '32'], { size: 32, gap: 12 }).body}</g>`
      + ring(565, 279, 28, C.green, 'r3', .8) + ring(R1.xs[3], 155, 28, C.green, 'r3', .8)
      + pill(166, 290, '분배법칙', C.green, { size: 24, cls: 'p3', d: 1, fill: C.mint });
    put('7-1/수학/2/분배법칙', svg(id, body, motion(id)));
  })();

  // 역수: −2/3 의 분자·분모를 뒤집어 −3/2 → 둘을 곱하면 1 → 서로의 역수
  (function () {
    const id = 't71-m2-yeoksu';
    const S = 56, cy = 136;
    const P = row(320, 296, ['(', '-', { fr: ['2', '3'] }, ')', '*', '(', '-', { fr: ['3', '2'] }, ')', '=', { s: '', w: 2 }, { s: '1', c: C.green, size: 42, cls: 'p2', st: delay(.8) }], { size: 34, gap: 6 });
    const body = mt(122, cy + 18, '-', { size: S }) + fr(176, cy, '2', '3', { size: S })
      + `<g class="s1">${mt(406, cy + 18, '-', { size: S })}<path d="M432 ${cy} H486" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></g>`
      + `<g class="sw1">${text(459, f(cy - S * .24), 2, { size: S, color: C.orange })}</g>`
      + `<g class="sw2">${text(459, f(cy + S * .98), 3, { size: S, color: C.blue })}</g>`
      + `<g class="h3">${darrow([[230, 96], [300, 70], [380, 96]], C.muted, 'd1', .1)}</g>`
      + `<g class="s2" ${delay(.2)}>${P.body}</g>` + ring(P.xs[11], 284, 28, C.green, 'r2', 1.1)
      + `<g class="s3">${arrow(240, 128, 380, 128, C.green, '', 4)}${arrow(380, 128, 240, 128, C.green, '', 4)}</g>`
      + pill(310, 70, '역수', C.green, { size: 26, cls: 'p3', d: .3, fill: C.mint });
    put('7-1/수학/2/역수', svg(id, body, motion(id) + `
      .on1 .sc-${id} .sw1 { animation: ${id}-dn 1s ease-in-out .5s both; }
      .on1 .sc-${id} .sw2 { animation: ${id}-up 1s ease-in-out .5s both; }
      @keyframes ${id}-dn { 0% { transform: none; } 50% { transform: translate(34px, ${f(S * .61)}px); } 100% { transform: translateY(${f(S * 1.22)}px); } }
      @keyframes ${id}-up { 0% { transform: none; } 50% { transform: translate(-34px, ${f(-S * .61)}px); } 100% { transform: translateY(${f(-S * 1.22)}px); } }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
