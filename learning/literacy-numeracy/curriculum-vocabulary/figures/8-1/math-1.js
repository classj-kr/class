// 수학 8-1(중학교 2학년 1학기) 1단원 유리수와 순환소수 — 맨 위는 중2 수학 도식 공용 도구
// ── 중2 수학 도식 공용 도구(root.CVMath8) ──
// 8-1/math-1.js 와 8-2/math-1.js 맨 위에 똑같이 들어 있다. 학기마다 math-1.js 가 먼저 읽히므로(파일 이름 차례) 뒤 파일은 이것을 쓴다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리). 칸마다 움직임은 2초 안에 끝낸다.
(function (root) {
  'use strict';
  if (root.CVMath8) return;
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const D = Math.PI / 180;
  // 화면 위 각: 오른쪽이 0°, 시계 반대 방향으로 커진다.
  const pol = (O, r, a) => [O[0] + r * Math.cos(a * D), O[1] - r * Math.sin(a * D)];
  const ang = (O, A) => Math.atan2(-(A[1] - O[1]), A[0] - O[0]) / D;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const unit = (a) => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // 점 p 에서 직선 ab 에 내린 수선의 발
  const foot = (p, a, b) => { const u = unit(sub(b, a)), t = (p[0] - a[0]) * u[0] + (p[1] - a[1]) * u[1]; return add(a, mul(u, t)); };
  const st = (d = 0, more = '') => (d || more ? `style="${d ? `animation-delay:${d}s;transition-delay:${d}s;` : ''}${more}"` : '');
  const g = (cls, inner, d = 0, more = '') => `<g class="${cls}" ${st(d, more)}>${inner}</g>`;

  // sN 나타나기, pN 튀어나오기, dN 선 그리기(.draw), rN 퍼지는 고리, kN 깜빡이며 남기, gN 두 번 반짝, xN 흐려지기,
  // oN 사라지기, fN 날아오기(--dx, --dy 에서 제자리로), mvN 옮겨 가기(--xN, --yN 으로; 칸이 쌓이면 뒤 칸이 이김)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.s5,.p1,.p2,.p3,.p4,.p5,.k1,.k2,.k3,.k4,.k5,.f1,.f2,.f3,.f4,.f5) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.p5,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1 1; stroke-dashoffset: 1; transition: stroke-dashoffset .7s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .mv { transition: transform .9s ease-in-out; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.3); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-glow { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 5; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .45s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring .8s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.2s ease-in-out both; }
    .on${n} .sc-${id} .g${n} { animation: ${id}-glow .6s ease-in-out 2; }
    .on${n} .sc-${id} .x${n} { opacity: .22; transition: opacity .5s ease; }
    .on${n} .sc-${id} .o${n} { opacity: 0; transition: opacity .4s ease; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .9s ease-in-out both; }
    .on${n} .sc-${id} .mv${n} { transform: translate(var(--x${n}, 0px), var(--y${n}, 0px)); }`;
    return css;
  };

  // ── 글자 ──
  const SERIF = "'Times New Roman',Times,serif";
  const lab = (x, y, s, { c = C.ink, size = 22, anchor = 'middle', w = 700 } = {}) => text(f(x), f(y), s, { size, color: c, anchor, weight: w });
  // 수식 글자: 영문자는 기울인 바탕체, 수·기호는 굵은 고딕. '-' 는 빼기표(−), '*' 는 곱셈표(×).
  // '<'·'>' 는 그대로 쓴다(글자로 바뀐다). a^2, a^{12}: 위첨자. {#orange|글자}: 그 부분만 색. 위첨자 안에서도 ^{#blue|4} 처럼 쓴다.
  const esc = (s) => s.replace(/-/g, '−').replace(/\*/g, '×').replace(/&(?![a-z]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function tsp(src, size) {
    const sv = { back: 0 }, up = f(size * 0.42), small = f(size * 0.62);
    const dy = () => { const d = sv.back; sv.back = 0; return d ? ` dy="${d}"` : ''; };
    const walk = (s) => {
      let out = '', i = 0;
      while (i < s.length) {
        if (s.startsWith('{#', i)) {
          const bar = s.indexOf('|', i);
          let j = bar + 1, depth = 1;
          while (depth) { if (s[j] === '{') depth++; if (s[j] === '}') depth--; j++; }
          out += `<tspan fill="${C[s.slice(i + 2, bar)] || s.slice(i + 2, bar)}"${dy()}>${walk(s.slice(bar + 1, j - 1))}</tspan>`;
          i = j; continue;
        }
        if (s[i] === '^') {
          let gg;
          if (s[i + 1] === '{') { let j = i + 2, depth = 1; while (depth) { if (s[j] === '{') depth++; if (s[j] === '}') depth--; j++; } gg = s.slice(i + 2, j - 1); i = j; } else { gg = s[i + 1]; i += 2; }
          let color = '';
          if (gg.startsWith('#')) { const bar = gg.indexOf('|'); color = ` fill="${C[gg.slice(1, bar)] || gg.slice(1, bar)}"`; gg = gg.slice(bar + 1); }
          out += `<tspan dy="${f(-up + sv.back)}" dx="2" font-size="${small}"${color}>${esc(gg)}</tspan>`;
          sv.back = up; continue;
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
  const mt = (x, y, s, { size = 30, color = C.ink, anchor = 'middle', cls = '', d = 0 } = {}) =>
    `<text class="${cls}" ${cls ? st(d) : ''} x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-size="${size}" font-weight="700" fill="${color}">${tsp(String(s), size)}</text>`;
  // 글자 폭 어림(자리 잡기용)
  const cw = (ch) => (/[0-9]/.test(ch) ? .58 : /[a-zA-Z]/.test(ch) ? .52 : ch === ' ' ? .3 : /[()|,.]/.test(ch) ? .34 : /[가-힣]/.test(ch) ? 1 : .66);
  function wid(src, size) {
    const s = String(src).replace(/\{#\w+\|/g, '').replace(/\}/g, '');
    let w = 0, i = 0;
    while (i < s.length) {
      if (s[i] === '^') {
        let gg; if (s[i + 1] === '{') { const j = s.indexOf('}', i); gg = s.slice(i + 2, j); i = j + 1; } else { gg = s[i + 1]; i += 2; }
        w += [...gg].reduce((a, c) => a + cw(c), 0) * size * .62 + 2; continue;
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
  // 한 줄 수식: 조각마다 가운데 x(xs)와 폭(ws)을 돌려준다. 조각: '글자' | {s, c, cls, d, size, w} | {fr:[분자, 분모], c, cls, d}
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
      if (o.cls) m = g(o.cls, m, o.d || 0, o.more || '');
      body += m; x += ws[k] + gap;
    });
    const left = x - total - gap;
    return { body, xs, ws, total, left: f(left), right: f(left + total) };
  }
  const pill = (x, y, label, color, { size = 24, cls = '', d = 0, fill = 'white' } = {}) => {
    const w = [...label].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : .6), 0) * size + 26, h = size + 18;
    return `<g class="${cls}" ${cls ? st(d) : ''}><rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${color}" stroke-width="3"/>${text(f(x), f(y + size * .36), label, { size, color })}</g>`;
  };
  const card = (x, y, w, h, color = C.ink, fill = 'white', sw = 3) => `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="12" fill="${fill}" stroke="${color}" stroke-width="${sw}"/>`;
  // 아래(위)로 여는 묶음 선. up=true 면 위쪽을 묶는다.
  const brace = (x0, x1, y, color, { up = false } = {}) => {
    const s = up ? -1 : 1, m = (x0 + x1) / 2;
    return `<path d="M${f(x0)} ${f(y)} q0 ${10 * s} 10 ${10 * s} H${f(m - 8)} l8 ${8 * s} l8 ${-8 * s} H${f(x1 - 10)} q10 0 10 ${-10 * s}" stroke="${color}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  };

  // ── 도형 ──
  const isDraw = (cls) => /(^|\s)d\d(\s|$)/.test(cls);
  const line = (p, q, { c = C.ink, w = 4, cls = '', d = 0, dash = '' } = {}) => {
    const dr = isDraw(cls);
    return `<path class="${dr ? 'draw ' : ''}${cls}" ${dr ? 'pathLength="1"' : ''} ${st(d)} d="M${P(p)} L${P(q)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  const pathD = (dd, { c = C.ink, w = 4, cls = '', d = 0, fill = 'none', dash = '' } = {}) => {
    const dr = isDraw(cls);
    return `<path class="${dr ? 'draw ' : ''}${cls}" ${dr ? 'pathLength="1"' : ''} ${st(d)} d="${dd}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="${fill}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  const polyD = (pts) => `M${pts.map(P).join(' L')} Z`;
  const circ = (O, r, { c = C.ink, w = 4, cls = '', d = 0, fill = 'none', dash = '' } = {}) => {
    // 선 그리기가 되도록 원을 path 로 그린다(맨 위에서 시작해 시계 반대 방향).
    const dd = `M${f(O[0])} ${f(O[1] - r)} A${r} ${r} 0 1 0 ${f(O[0])} ${f(O[1] + r)} A${r} ${r} 0 1 0 ${f(O[0])} ${f(O[1] - r)}`;
    return pathD(dd, { c, w, cls, d, fill, dash });
  };
  const dot = (p, { r = 7, c = C.ink, cls = '', d = 0 } = {}) => `<circle class="${cls}" ${st(d)} cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${c}" stroke="white" stroke-width="2"/>`;
  const ring = (p, r, c, cls, d = 0) => `<circle class="ring ${cls}" ${st(d)} cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="none" stroke="${c}" stroke-width="4"/>`;
  const poly = (pts, attr) => `<polygon points="${pts.map(P).join(' ')}" ${attr}/>`;
  // 부채꼴(각 표시): O 에서 a1° 부터 a2° 까지 시계 반대 방향
  const sector = (O, r, a1, a2, fill, extra = '') => `<path ${extra} d="M${P(O)} L${P(pol(O, r, a1))} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${P(pol(O, r, a2))} Z" fill="${fill}" stroke="${C.ink}" stroke-width="1.5" stroke-linejoin="round"/>`;
  // 꼭짓점 O 에서 OA·OB 사이 작은 쪽 각 표시
  const angMark = (O, A, B, r, fill, extra = '') => {
    let a1 = ang(O, A), a2 = ang(O, B);
    let s = ((a2 - a1) % 360 + 360) % 360;
    if (s > 180) { [a1, a2] = [a2, a1]; s = 360 - s; }
    return sector(O, r, a1, a1 + s, fill, extra);
  };
  const midAng = (O, A, B) => { const u = unit(sub(A, O)), v = unit(sub(B, O)); return unit(add(u, v)); };
  const rmark = (O, a, b, { s = 18, c = C.red, w = 3 } = {}) => {
    const u = mul(unit(sub(a, O)), s), v = mul(unit(sub(b, O)), s);
    return `<path d="M${P(add(O, u))} L${P(add(add(O, u), v))} L${P(add(O, v))}" stroke="${c}" stroke-width="${w}" fill="none"/>`;
  };
  const tick = (p, q, { n = 1, c = C.green, len = 10 } = {}) => {
    const m = mid(p, q), u = unit(sub(q, p)), v = [-u[1], u[0]];
    let s = '';
    for (let i = 0; i < n; i++) { const o = add(m, mul(u, (i - (n - 1) / 2) * 8)); s += line(add(o, mul(v, -len)), add(o, mul(v, len)), { c, w: 3 }); }
    return s;
  };
  // 평행 표시(선분 가운데 작은 화살 머리 n 개)
  const par = (p, q, { n = 1, c = C.ink } = {}) => {
    const m = mid(p, q), u = unit(sub(q, p)), v = [-u[1], u[0]];
    let s = '';
    for (let i = 0; i < n; i++) {
      const o = add(m, mul(u, (i - (n - 1) / 2) * 10 + 5));
      s += `<path d="M${P(add(add(o, mul(u, -9)), mul(v, -7)))} L${P(o)} L${P(add(add(o, mul(u, -9)), mul(v, 7)))}" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return s;
  };
  // 수직선: from~to 정수 눈금, 눈금 글씨 18px 이상
  const numLine = (from, to, { y = 200, x0 = 60, x1 = 580, size = 19, every = 1, color = C.ink } = {}) => {
    const at = (n) => x0 + (n - from) * (x1 - x0) / (to - from);
    let body = `<path d="M${f(x0 - 18)} ${y} H${f(x1 + 18)}" stroke="${color}" stroke-width="3"/>`;
    for (let n = from; n <= to; n++) {
      body += `<path d="M${f(at(n))} ${y - 8} V${y + 8}" stroke="${color}" stroke-width="2"/>`;
      if ((n - from) % every === 0) body += mt(at(n), y + 32, n < 0 ? `-${-n}` : n, { size, color });
    }
    return { body, at };
  };
  // 좌표평면: 조각을 따로 돌려준다(grid 모눈, xa·ya 축, xn·yn 눈금 수, O, lx·ly 축 이름). X(x)·Y(y) 는 화면 자리.
  // skipX·skipY: 눈금 수를 쓰지 않을 값(그래프·이름표와 겹치는 자리)
  function plane({ ox = 320, oy = 180, u = 26, x0 = -5, x1 = 5, y0 = -5, y1 = 5, every = 1, size = 18, skipX = [], skipY = [] } = {}) {
    const X = (x) => ox + x * u, Y = (y) => oy - y * u;
    const sg = (n) => (n < 0 ? `-${-n}` : String(n));
    let grid = '', xn = '', yn = '';
    for (let x = x0; x <= x1; x++) if (x) grid += `M${f(X(x))} ${f(Y(y1))} V${f(Y(y0))}`;
    for (let y = y0; y <= y1; y++) if (y) grid += `M${f(X(x0))} ${f(Y(y))} H${f(X(x1))}`;
    grid = `<path d="${grid}" stroke="${C.line}" stroke-width="1.3"/>`;
    for (let x = x0; x <= x1; x++) if (x && x % every === 0 && !skipX.includes(x)) xn += mt(X(x), Y(0) + 24, sg(x), { size });
    for (let y = y0; y <= y1; y++) if (y && y % every === 0 && !skipY.includes(y)) yn += mt(X(0) - 8, Y(y) + 6, sg(y), { size, anchor: 'end' });
    const ah = (x, y, dx, dy) => `<path d="M${f(x - 10 * dx - 7 * dy)} ${f(y - 10 * dy - 7 * dx)} L${f(x)} ${f(y)} L${f(x - 10 * dx + 7 * dy)} ${f(y - 10 * dy + 7 * dx)}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const xa = `<path d="M${f(X(x0) - 12)} ${f(Y(0))} H${f(X(x1) + 18)}" stroke="${C.ink}" stroke-width="3"/>` + ah(X(x1) + 18, Y(0), 1, 0);
    const ya = `<path d="M${f(X(0))} ${f(Y(y0) + 12)} V${f(Y(y1) - 18)}" stroke="${C.ink}" stroke-width="3"/>` + ah(X(0), Y(y1) - 18, 0, -1);
    const lx = mt(X(x1) + 20, Y(0) + 28, 'x', { size: 24 }), ly = mt(X(0) + 18, Y(y1) - 12, 'y', { size: 24 });
    const O = mt(X(0) - 12, Y(0) + 24, 'O', { size: 19 });
    return { grid, xa, ya, xn, yn, lx, ly, O, X, Y, at: (x, y) => [X(x), Y(y)], all: grid + xa + ya + xn + yn + lx + ly + O };
  }

  root.CVMath8 = { C, svg, text, arrow, put, f, P, D, pol, ang, add, sub, mul, dist, unit, mid, lerp, foot, st, g, motion, SERIF, lab, mt, wid, fr, row, pill, card, brace,
    line, pathD, polyD, circ, dot, ring, poly, sector, angMark, midAng, rmark, tick, par, numLine, plane };
})(typeof window !== 'undefined' ? window : globalThis);

// 수학 8-1 1단원 유리수와 순환소수: 낱말 도식
// 나눗셈 몫이 한 자리씩 나오고 그 아래에 나머지가 적힌다(나머지가 0이면 멈추고, 같은 나머지가 돌아오면 되풀이).
(function (root) {
  'use strict';
  const { C, svg, put, f, g, motion, lab, mt, fr, row, pill, brace, ring, arrow } = root.CVMath8;
  const KEY = '8-1/수학/1/';
  // 한 글자씩 자리를 정해 쓰는 소수: 글자마다 가운데 x(xs)를 돌려준다. each(i, ch) → { cls, d, c }
  const adv = (ch, s) => (/[0-9]/.test(ch) ? .62 : ch === '.' ? .32 : ch === '⋯' ? 1.05 : ch === ' ' ? .32 : ch === '=' ? .9 : .7) * s;
  function dec(x, y, str, { size = 54, color = C.ink, each = () => ({}), anchor = 'start' } = {}) {
    const chars = [...str], ws = chars.map((ch) => adv(ch, size)), total = ws.reduce((a, b) => a + b, 0);
    let cx = anchor === 'middle' ? x - total / 2 : anchor === 'end' ? x - total : x;
    const left = cx, xs = [];
    let body = '';
    chars.forEach((ch, i) => {
      const c = cx + ws[i] / 2; xs.push(c); cx += ws[i];
      if (ch === ' ') return;
      const o = each(i, ch) || {};
      const t = `<text x="${f(c)}" y="${f(y)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${o.c || color}">${ch}</text>`;
      body += o.cls ? g(o.cls, t, o.d || 0) : t;
    });
    return { body, xs, left, right: cx, w: ws };
  }
  // 글자 i..j 뒤에 까는 색 띠
  const band = (R, i, j, y, size, fill, cls = '', d = 0) => {
    const x0 = R.xs[i] - R.w[i] / 2 - 2, x1 = R.xs[j] + R.w[j] / 2 + 2;
    return g(cls, `<rect x="${f(x0)}" y="${f(y - size * .82)}" width="${f(x1 - x0)}" height="${f(size * 1.02)}" rx="8" fill="${fill}"/>`, d);
  };
  const overDot = (R, i, y, size, color, cls = '', d = 0) => g(cls, `<circle cx="${f(R.xs[i])}" cy="${f(y - size * .86)}" r="${f(size * .075)}" fill="${color}"/>`, d);

  // 유한소수: 3/8 = 3 ÷ 8 → 몫 3, 7, 5 와 나머지 6, 4, 0, 나머지 0 에서 끝 → 0.375, 1/4 = 0.25, 7/20 = 0.35
  {
    const id = 't81-m1-yuhan';
    const Y = 126, S = 54;
    const R = dec(318, Y, '0.375', { size: S, each: (i) => (i >= 2 ? { cls: 'p2', d: .1 + (i - 2) * .4 } : { cls: 's1', d: 1 }) });
    const rem = ['6', '4', '0'];
    const body = fr(66, Y - 20, '3', '8', { size: 40 })
      + g('f1', mt(204, Y, '3 ÷ 8', { size: 44 }), .2, '--dx:-138px;--dy:0px')
      + mt(116, Y, '=', { size: 44 }) + g('s1', mt(282, Y, '=', { size: 44 }), .9) + R.body
      + g('s2', lab(R.xs[0] - 18, 184, '나머지', { c: C.muted, size: 20, anchor: 'end' }), .1)
      + rem.map((r, k) => g('s2', lab(R.xs[k + 2], 184, r, { c: k === 2 ? C.red : C.muted, size: 24 }), .3 + k * .4)).join('')
      + g('p2', pill(R.right + 52, Y - 18, '끝', C.red, { size: 24, fill: C.peach }), 1.4)
      + g('s3', brace(R.xs[2] - 16, R.xs[4] + 16, 64, C.orange, { up: true }) + lab((R.xs[2] + R.xs[4]) / 2, 42, '3개', { c: C.orange, size: 22 }), .1)
      + g('s3', row(130, 292, [{ fr: ['1', '4'] }, '=', '0.25'], { size: 36 }).body, .4)
      + g('s3', row(330, 292, [{ fr: ['7', '20'] }, '=', '0.35'], { size: 36 }).body, .7)
      + pill(530, 284, '유한소수', C.green, { size: 26, cls: 'p3', d: 1.1, fill: C.mint });
    put(KEY + '유한소수', svg(id, body, motion(id)));
  }

  // 무한소수: 1 ÷ 3 → 몫 3 이 끝없이(나머지 늘 1) → π = 3.1415926⋯ → 둘 다 끝없이 이어짐
  {
    const id = 't81-m1-muhan';
    const S = 50;
    const A = dec(208, 104, '0.3333⋯', { size: S, each: (i, ch) => (i >= 2 ? { cls: ch === '⋯' ? 's1' : 'p1', d: ch === '⋯' ? 1.3 : .1 + (i - 2) * .3 } : {}) });
    const B = dec(120, 252, '3.1415926⋯', { size: S, each: (i, ch) => (i >= 2 ? { cls: ch === '⋯' ? 's2' : 'p2', d: ch === '⋯' ? 1.2 : .1 + (i - 2) * .14 } : { cls: 's2' }) });
    const body = mt(110, 104, '1 ÷ 3 =', { size: 42 }) + A.body
      + g('s1', lab(A.xs[0] - 16, 156, '나머지', { c: C.muted, size: 20, anchor: 'end' }))
      + [2, 3, 4, 5].map((i, k) => g('s1', lab(A.xs[i], 156, '1', { c: C.muted, size: 24 }), .25 + k * .3)).join('')
      + g('s1', arrow(A.right + 6, 88, 616, 88, C.orange, 'draw d1', 4).replace('<path ', `<path pathLength="1" style="transition-delay:1.3s" `), 0)
      + g('s2', mt(66, 252, 'π =', { size: 42 }), 0)
      + g('s2', arrow(B.right + 6, 236, 616, 236, C.orange, 'draw d2', 4).replace('<path ', `<path pathLength="1" style="transition-delay:1.2s" `), 0)
      + B.body
      + ring([A.xs[6], 92], 22, C.orange, 'r3', .1) + ring([B.xs[9], 240], 22, C.orange, 'r3', .1)
      + g('s3', lab(560, 128, '끝없이', { c: C.orange, size: 22 }) + lab(560, 276, '끝없이', { c: C.orange, size: 22 }), .2)
      + pill(320, 326, '무한소수', C.green, { size: 26, cls: 'p3', d: .9, fill: C.mint });
    put(KEY + '무한소수', svg(id, body, motion(id)));
  }

  // 순환소수: 4 ÷ 11 → 몫 3, 6, 3, 6 / 나머지 7, 4, 7, 4 → 나머지 4 가 돌아와 36 이 되풀이 → 0.1252525⋯ 는 둘째 자리부터
  {
    const id = 't81-m1-sunhwan';
    const S = 50;
    const A = dec(222, 108, '0.363636⋯', { size: S, each: (i, ch) => (i >= 2 ? { cls: ch === '⋯' ? 's1' : 'p1', d: ch === '⋯' ? 1.5 : .1 + (i - 2) * .22 } : {}) });
    const rem = ['7', '4', '7', '4', '7', '4'];
    const fills = [C.peach, C.sky, C.peach];
    const B = dec(170, 258, '0.1252525⋯', { size: S });
    const T = row(200, 108, ['4', '÷', '11', '='], { size: 42, anchor: 'end', gap: 12 });
    const body = [0, 1, 2].map((k) => band(A, 2 + 2 * k, 3 + 2 * k, 108, S, fills[k], 's2', .1 + k * .35)).join('')
      + T.body + g('k2', mt(T.xs[0], 108, '4', { size: 42, color: C.blue }), .1) + A.body
      + lab(A.xs[0] - 14, 160, '나머지', { c: C.muted, size: 20, anchor: 'end' })
      + rem.map((r, k) => g('s1', lab(A.xs[k + 2], 160, r, { c: C.muted, size: 24 }), .2 + k * .22)).join('')
      + [3, 5, 7].map((i, k) => g('k2', lab(A.xs[i], 160, '4', { c: C.blue, size: 24 }), .1 + k * .2)).join('')
      + g('b3', [0, 1, 2].map((k) => band(B, 3 + 2 * k, 4 + 2 * k, 258, S, fills[k], 's3', .2 + k * .3)).join('') + B.body)
      + g('s3', lab(B.xs[2], 306, '한 번', { c: C.muted, size: 20 }), 1)
      + g('s3', brace(B.xs[3] - 16, B.xs[8] + 16, 274, C.orange) + lab((B.xs[3] + B.xs[8]) / 2, 318, '25 되풀이', { c: C.orange, size: 20 }), 1.1)
      + pill(548, 300, '순환소수', C.green, { size: 26, cls: 'p3', d: 1.4, fill: C.mint });
    put(KEY + '순환소수', svg(id, body, motion(id)));
  }

  // 순환마디: 0.363636⋯ 에서 36 이 되풀이 → 가장 짧은 한 부분 36 이 순환마디 → 처음과 끝 숫자 위에 점: 0.3̇6̇, 0.1̇23̇
  {
    const id = 't81-m1-madi';
    const S = 52;
    const A = dec(40, 120, '0.363636⋯', { size: S });
    const fills = [C.peach, C.sky, C.peach];
    const A2 = dec(A.right + 70, 120, '0.36', { size: S });
    const B = dec(40, 290, '0.123123⋯', { size: S });
    const B2 = dec(B.right + 70, 290, '0.123', { size: S });
    const box = (R, i, j, y, cls, d) => g(cls, `<rect x="${f(R.xs[i] - R.w[i] / 2 - 5)}" y="${f(y - S * .9)}" width="${f(R.xs[j] - R.xs[i] + R.w[i] + 10)}" height="${f(S * 1.18)}" rx="9" fill="none" stroke="${C.orange}" stroke-width="4"/>`, d);
    const body = [0, 1, 2].map((k) => band(A, 2 + 2 * k, 3 + 2 * k, 120, S, fills[k], 's1', .2 + k * .4)).join('') + A.body
      + box(A, 2, 3, 120, 'p2', .2)
      + g('s2', `<path d="M${f(A.xs[2] + 16)} 140 V172" stroke="${C.orange}" stroke-width="3"/>` + pill(A.xs[2] + 16, 194, '순환마디', C.orange, { size: 22, fill: C.peach }), .6)
      + g('s3', mt(A.right + 34, 120, '=', { size: 44 }) + A2.body, .1)
      + overDot(A2, 2, 120, S, C.red, 'p3', .5) + overDot(A2, 3, 120, S, C.red, 'p3', .7)
      + g('b3', box(B, 2, 4, 290, 's3', .9) + B.body + mt(B.right + 34, 290, '=', { size: 44 }) + B2.body, .9)
      + overDot(B2, 2, 290, S, C.red, 'p3', 1.3) + overDot(B2, 4, 290, S, C.red, 'p3', 1.5);
    put(KEY + '순환마디', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
