// 수학 8-2(중학교 2학년 2학기) 6단원 삼각형과 사각형의 성질 — 맨 위는 중2 수학 도식 공용 도구
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

// 수학 8-2 6단원 삼각형과 사각형의 성질: 낱말 도식
// 접기는 반쪽을 감싼 <g> 를 접는 선 둘레로 scaleX(-1), 포개기는 translate·rotate 로 옮긴다(글자는 움직이는 묶음 밖에 둔다).
(function (root) {
  'use strict';
  const { C, svg, put, f, P, g, motion, lab, mt, pill, card, line, pathD, polyD, circ, dot, ring, poly, angMark, midAng, rmark, tick, par, arrow,
    add, sub, mul, dist, unit, mid, lerp, foot, pol } = root.CVMath8;
  const KEY = '8-2/수학/6/';
  const cen = (...p) => [p.reduce((a, q) => a + q[0], 0) / p.length, p.reduce((a, q) => a + q[1], 0) / p.length];
  // 꼭짓점 이름: 무게중심에서 바깥쪽으로 d 만큼
  const vlab = (Pt, G, s, { d = 24, c = C.ink, size = 24 } = {}) => { const q = add(Pt, mul(unit(sub(Pt, G)), d)); return lab(q[0], q[1] + size * .36, s, { c, size }); };
  const tri = (pts, fill = C.mint, stroke = C.ink, w = 4) => `<path d="${polyD(pts)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
  // 각의 이등분선 방향으로 r 만큼 떨어진 점
  const inAng = (V, A, B, r) => add(V, mul(midAng(V, A, B), r));
  // 외심·내심
  const circum = (A, B, Cc) => {
    const d = 2 * (A[0] * (B[1] - Cc[1]) + B[0] * (Cc[1] - A[1]) + Cc[0] * (A[1] - B[1]));
    const s = (p) => p[0] * p[0] + p[1] * p[1];
    return [(s(A) * (B[1] - Cc[1]) + s(B) * (Cc[1] - A[1]) + s(Cc) * (A[1] - B[1])) / d, (s(A) * (Cc[0] - B[0]) + s(B) * (A[0] - Cc[0]) + s(Cc) * (B[0] - A[0])) / d];
  };
  const incen = (A, B, Cc) => { const a = dist(B, Cc), b = dist(Cc, A), c = dist(A, B), t = a + b + c; return [(a * A[0] + b * B[0] + c * Cc[0]) / t, (a * A[1] + b * B[1] + c * Cc[1]) / t]; };

  // 증명: 두 직선이 만나 생긴 ∠a, ∠c(가정) → ∠a + ∠b = 180° → ∠c + ∠b = 180° → 그래서 ∠a = ∠c(결론)
  {
    const id = 't82-m6-jeungmyeong';
    const O = [150, 180], TH = 50;
    const ray = (a) => pol(O, 135, a);
    const sec = (a1, a2, fill, extra = '') => `<path ${extra} d="M${P(O)} L${P(pol(O, 46, a1))} A46 46 0 0 0 ${P(pol(O, 46, a2))} Z" fill="${fill}" stroke="${C.ink}" stroke-width="1.5"/>`;
    const nm = (a, s, c) => lab(...add(pol(O, 74, a), [0, 8]), s, { c, size: 24 });
    const bx = (y, s, cls, d, color = C.ink, fill = 'white') => g(cls, card(490, y, 250, 48, color, fill) + mt(490, y + 10, s, { size: 26 }), d);
    const tagp = (y, s, c, fill, cls, d) => g(cls, pill(318, y, s, c, { size: 20, fill }), d);
    const body = sec(0, TH, C.peach) + sec(180, 180 + TH, C.peach)
      + g('s2', sec(TH, 180, C.sky), .1)
      + line(pol(O, 135, 180), pol(O, 135, 0), { w: 4 }) + line(ray(180 + TH), ray(TH), { w: 4 })
      + nm(TH / 2, '∠a', C.orange) + nm(180 + TH / 2, '∠c', C.orange) + g('s2', nm(115, '∠b', C.blue), .2)
      + g('h3', g('s2', pathD(`M${P(pol(O, 58, 0))} A58 58 0 0 0 ${P(pol(O, 58, 180))}`, { c: C.green, w: 4 }) + lab(...pol(O, 92, 70), '180°', { c: C.green, size: 22 }), .3))
      + g('s3', pathD(`M${P(pol(O, 58, TH))} A58 58 0 0 0 ${P(pol(O, 58, 180 + TH))}`, { c: C.purple, w: 4 }) + lab(...add(pol(O, 90, 115), [0, -10]), '180°', { c: C.purple, size: 22 }), .3)
      + bx(52, '∠a, ∠c 맞꼭지각', 's1', .2) + tagp(52, '가정', C.blue, C.sky, 's1', .4)
      + g('s2', arrow(490, 80, 490, 100, C.muted, '', 3), .1) + bx(130, '∠a + ∠b = 180°', 's2', .5)
      + g('s3', arrow(490, 158, 490, 178, C.muted, '', 3), .1) + bx(208, '∠c + ∠b = 180°', 's3', .5)
      + g('s4', arrow(490, 236, 490, 256, C.muted, '', 3), .1) + bx(286, '∠a = ∠c', 's4', .4, C.green, C.mint) + tagp(286, '결론', C.green, C.mint, 's4', .6)
      + pill(150, 322, '증명', C.green, { size: 28, cls: 'p4', d: 1, fill: C.mint });
    put(KEY + '증명', svg(id, body, motion(id)));
  }

  // 이등변삼각형의 성질: AB = AC → 꼭지각의 이등분선 AD 를 따라 접으면 꼭 포개짐 → ∠B = ∠C, BD = CD, AD ⊥ BC
  {
    const id = 't82-m6-ideungsung';
    const A = [320, 44], B = [196, 258], Cc = [444, 258], Dd = [320, 258], G = cen(A, B, Cc);
    const body = tri([A, B, Cc], C.mint)
      + tick(A, B, { c: C.orange }) + tick(A, Cc, { c: C.orange })
      + vlab(A, G, 'A') + vlab(B, G, 'B') + vlab(Cc, G, 'C')
      + `<g class="fold">${tri([A, Dd, Cc], C.peach, C.ink, 3)}</g>`
      + line(A, Dd, { c: C.purple, w: 3, cls: 'd2', d: .1 })
      + g('s2', lab(320, 288, 'D', { size: 24 }), .4)
      + g('b3', angMark(B, A, Cc, 34, C.sky) + angMark(Cc, A, B, 34, C.sky) + rmark(Dd, A, Cc) + tick(B, Dd, { n: 2, c: C.blue }) + tick(Dd, Cc, { n: 2, c: C.blue }))
      + g('s3', lab(100, 128, '∠B = ∠C', { size: 28, c: C.blue }), .9)
      + g('s3', lab(548, 118, 'BD = CD', { size: 26, c: C.blue }) + lab(548, 166, 'AD ⊥ BC', { size: 26, c: C.purple }), 1.2)
      + pill(320, 330, '이등변삼각형의 성질', C.green, { size: 20, cls: 'p3', d: 1.5, fill: C.mint });
    put(KEY + '이등변삼각형의 성질', svg(id, body, motion(id) + `
      .sc-${id} .fold { transform-box: view-box; transform-origin: 320px 0; opacity: 0; }
      .on2 .sc-${id} .fold { animation: ${id}-fold 1.1s ease-in-out .7s both; }
      .on3 .sc-${id} .fold { animation: ${id}-open .8s ease-in-out .1s both; }
      @keyframes ${id}-fold { from { opacity: 1; transform: scaleX(1); } to { opacity: .85; transform: scaleX(-1); } }
      @keyframes ${id}-open { from { opacity: .85; transform: scaleX(-1); } to { opacity: 0; transform: scaleX(1); } }`));
  }

  // 꼭지각: 같은 두 변 AB, AC → 그 사이의 각 ∠A 가 꼭지각 → 옆으로 누운 이등변삼각형에서도 같은 두 변 사이의 각
  {
    const id = 't82-m6-kkokji';
    const A = [190, 60], B = [80, 270], Cc = [300, 270], G = cen(A, B, Cc);
    const Q = [590, 190], R = [400, 100], S = [400, 280], G2 = cen(Q, R, S);
    const body = tri([A, B, Cc], C.paper)
      + g('s1', line(A, B, { c: C.orange, w: 6 }) + line(A, Cc, { c: C.orange, w: 6 }) + tick(A, B, { c: C.orange }) + tick(A, Cc, { c: C.orange }), .2)
      + vlab(A, G, 'A') + vlab(B, G, 'B') + vlab(Cc, G, 'C')
      + g('p2', angMark(A, B, Cc, 46, C.peach), .1) + ring(A, 18, C.orange, 'r2', .3)
      + g('s2', lab(92, 82, '꼭지각', { c: C.orange, size: 24 }) + line([126, 86], [176, 98], { c: C.orange, w: 2.5 }), .6)
      + g('s2', lab(190, 302, '밑변', { c: C.muted, size: 20 }), .9)
      + g('b3', tri([Q, R, S], C.paper) + line(Q, R, { c: C.orange, w: 6 }) + line(Q, S, { c: C.orange, w: 6 }) + tick(Q, R, { c: C.orange }) + tick(Q, S, { c: C.orange }))
      + g('p3', angMark(Q, R, S, 46, C.peach), .7)
      + g('s3', lab(560, 104, '꼭지각', { c: C.orange, size: 24 }) + line([568, 112], [574, 168], { c: C.orange, w: 2.5 }), 1)
      + pill(320, 334, '꼭지각', C.green, { size: 24, cls: 'p3', d: 1.4, fill: C.mint });
    put(KEY + '꼭지각', svg(id, body, motion(id)));
  }

  // 밑각: AB = AC 인 삼각형 → 꼭지각과 마주 보는 변 BC 가 밑변 → 밑변 양 끝의 두 각 ∠B, ∠C 가 밑각(55°로 같음)
  {
    const id = 't82-m6-mitgak';
    const A = [320, 66], B = [180, 266], Cc = [460, 266], G = cen(A, B, Cc);
    const body = tri([A, B, Cc], C.paper) + tick(A, B, { c: C.orange }) + tick(A, Cc, { c: C.orange })
      + g('s1', angMark(A, B, Cc, 34, C.lilac) + lab(320, 136, '70°', { c: C.purple, size: 20 }), .3)
      + line(B, Cc, { c: C.blue, w: 7, cls: 'd2', d: .1 }) + g('s2', lab(320, 304, '밑변', { c: C.blue, size: 24 }), .6)
      + g('p3', angMark(B, A, Cc, 40, C.sky), .1) + g('p3', angMark(Cc, A, B, 40, C.sky), .4)
      + g('s3', lab(...add(inAng(B, A, Cc, 62), [0, 8]), '55°', { c: C.blue, size: 20 }) + lab(...add(inAng(Cc, A, B, 62), [0, 8]), '55°', { c: C.blue, size: 20 }), .7)
      + vlab(A, G, 'A') + vlab(B, G, 'B') + vlab(Cc, G, 'C')
      + g('s3', lab(96, 220, '밑각', { c: C.blue, size: 24 }) + lab(544, 220, '밑각', { c: C.blue, size: 24 })
        + line([110, 228], [176, 252], { c: C.blue, w: 2.5 }) + line([530, 228], [464, 252], { c: C.blue, w: 2.5 }), 1)
      + pill(320, 340, '∠B = ∠C', C.blue, { size: 22, cls: 'p3', d: 1.4, fill: C.sky });
    put(KEY + '밑각', svg(id, body, motion(id)));
  }

  // 빗변: 직각삼각형 → 직각과 마주 보는 변 AB 가 빗변 → 세 변 3, 4, 5 가운데 가장 긴 변, 돌려 놓아도 직각의 맞은편
  {
    const id = 't82-m6-bitbyeon';
    const Cc = [130, 262], B = [370, 262], A = [130, 82], G = cen(A, B, Cc);
    const Pp = [530, 96], Qq = add(Pp, mul([-0.6, 0.8], 130)), Rr = add(Pp, mul([0.8, 0.6], 104));
    const body = tri([A, B, Cc], C.mint) + rmark(Cc, A, B, { s: 22 })
      + vlab(A, G, 'A') + vlab(B, G, 'B') + vlab(Cc, G, 'C')
      + g('o3', g('s2', arrow(150, 242, 236, 186, C.red, '', 3), .1))
      + line(A, B, { c: C.red, w: 7, cls: 'd2', d: .5 })
      + g('s2', lab(282, 150, '빗변', { c: C.red, size: 26 }), 1.1)
      + g('s3', lab(108, 180, '3', { size: 24 }) + lab(250, 294, '4', { size: 24 }) + lab(232, 202, '5', { c: C.red, size: 24 }), .1)
      + g('b3', tri([Pp, Qq, Rr], C.mint, C.ink, 3) + rmark(Pp, Qq, Rr, { s: 16 }))
      + line(Qq, Rr, { c: C.red, w: 6, cls: 'd3', d: .7 })
      + g('s3', lab(...add(mid(Qq, Rr), [18, 30]), '빗변', { c: C.red, size: 22 }), 1.3);
    put(KEY + '빗변', svg(id, body, motion(id)));
  }

  // RHA·RHS 합동: 두 직각삼각형의 직각(R), 빗변(H), 한 예각(A) 또는 다른 한 변(S) 이 같음 → 하나를 돌려 옮기면 꼭 포개짐
  for (const kind of ['RHA', 'RHS']) {
    const id = `t82-m6-${kind.toLowerCase()}`;
    const C1 = [120, 262], A1 = [120, 102], B1 = [330, 262], G1 = cen(A1, B1, C1), dd = [330, -46];
    const map = (p) => add(sub(mul(G1, 2), p), dd); // 180° 돌리고 옮긴 자리
    const C2 = map(C1), A2 = map(A1), B2 = map(B1), G2 = map(G1);
    const marks = (cls, d) => g(cls, rmark(C1, A1, B1, { s: 20 }), d)
      + g(cls, line(A1, B1, { c: C.orange, w: 7 }) + tick(A1, B1, { c: C.orange }), d + .3)
      + (kind === 'RHA' ? g(cls, angMark(B1, A1, C1, 40, C.sky), d + .6) : g(cls, line(C1, B1, { c: C.blue, w: 7 }) + tick(C1, B1, { n: 2, c: C.blue }), d + .6));
    const shape = tri([A1, B1, C1], C.peach, C.ink, 3) + marks('s2', .1);
    const body = tri([A1, B1, C1], C.mint) + marks('s2', .1)
      + vlab(A1, G1, 'A') + vlab(B1, G1, 'B') + vlab(C1, G1, 'C')
      + g('o3', vlab(A2, G2, 'D') + vlab(B2, G2, 'E') + vlab(C2, G2, 'F'))
      + `<g class="mvt">${shape}</g>`
      + g('s2', lab(C1[0] + 34, C1[1] - 30, 'R', { c: C.red, size: 22 }), .4)
      + g('s2', lab(...add(mid(A1, B1), [30, -22]), 'H', { c: C.orange, size: 24 }), .7)
      + g('s2', kind === 'RHA' ? lab(B1[0] - 66, B1[1] - 14, 'A', { c: C.blue, size: 22 }) : lab(225, 296, 'S', { c: C.blue, size: 24 }), 1)
      + pill(320, 334, `${kind} 합동`, C.green, { size: 26, cls: 'p3', d: 1.3, fill: C.mint })
      + g('s3', lab(540, 342, '△ABC ≡ △DEF', { size: 24 }), 1.5);
    put(KEY + `${kind} 합동`, svg(id, body, motion(id) + `
      .sc-${id} .mvt { transform-box: view-box; transform-origin: ${f(G1[0])}px ${f(G1[1])}px; transform: translate(${dd[0]}px, ${dd[1]}px) rotate(180deg); transition: transform 1.2s ease-in-out .1s; }
      .on3 .sc-${id} .mvt { transform: none; }`));
  }

  // 외접원: 삼각형 ABC → 세 꼭짓점을 모두 지나는 원 → 그 원이 외접원
  const OC = [300, 180], RC = 145;
  const TA = pol(OC, RC, 110), TB = pol(OC, RC, 215), TC = pol(OC, RC, 330);
  {
    const id = 't82-m6-oejeobwon';
    const G = cen(TA, TB, TC);
    const body = tri([TA, TB, TC], C.mint)
      + circ(OC, RC, { c: C.orange, w: 4, cls: 'd2', d: .1 })
      + [TA, TB, TC].map((p, k) => dot(p, { r: 8, c: C.orange, cls: 'p2', d: .1 + k * .15 }) + ring(p, 10, C.orange, 'r2', .2 + k * .1)).join('')
      + vlab(TA, OC, 'A', { d: 26 }) + vlab(TB, OC, 'B', { d: 26 }) + vlab(TC, OC, 'C', { d: 26 })
      + g('b3', g('g3', circ(OC, RC, { c: C.orange, w: 7 }), .1))
      + pill(540, 60, '외접원', C.orange, { size: 28, cls: 'p3', d: .6, fill: C.peach });
    put(KEY + '외접원', svg(id, body, motion(id).replace('stroke-dashoffset .7s', 'stroke-dashoffset 1.2s')));
  }

  // 외심: 세 변의 수직이등분선 → 한 점 O 에서 만남 → OA = OB = OC, O 가 외접원의 중심
  {
    const id = 't82-m6-oesim';
    const sh = [-50, 0], A = add(TA, sh), B = add(TB, sh), Cc = add(TC, sh), O = add(OC, sh);
    const bis = (p, q, k) => {
      const M = mid(p, q), u = unit(sub(O, M)), L = dist(O, M);
      return line(add(M, mul(u, -34)), add(M, mul(u, L + 40)), { c: C.purple, w: 3, cls: 'd2', d: .1 + k * .45 })
        + g('s2', rmark(M, add(M, u), q, { s: 14, c: C.purple }) + tick(p, M, { c: C.purple }) + tick(M, q, { c: C.purple }), .3 + k * .45);
    };
    const body = tri([A, B, Cc], C.mint)
      + bis(A, B, 0) + bis(B, Cc, 1) + bis(Cc, A, 2)
      + vlab(A, O, 'A', { d: 26 }) + vlab(B, O, 'B', { d: 26 }) + vlab(Cc, O, 'C', { d: 26 })
      + dot(O, { r: 9, c: C.red, cls: 'p3', d: .2 }) + ring(O, 12, C.red, 'r3', .3) + g('s3', lab(O[0] + 16, O[1] + 44, 'O', { c: C.red, size: 26 }), .4)
      + [A, B, Cc].map((p, k) => line(O, p, { c: C.red, w: 4, cls: 'd4', d: .1 + k * .2 })).join('')
      + g('s4', circ(O, RC, { c: C.red, w: 2.5, dash: '8 7' }), .8)
      + g('s4', lab(540, 176, 'OA = OB = OC', { c: C.red, size: 26 }), .9)
      + pill(548, 240, '외심', C.red, { size: 30, cls: 'p4', d: 1.2, fill: C.peach });
    put(KEY + '외심', svg(id, body, motion(id)));
  }

  // 접선: 원과 두 점에서 만나는 직선 → 위로 옮겨 가 한 점에서만 만남 → 접점까지의 반지름과 수직
  {
    const id = 't82-m6-jeopseon';
    const O = [250, 210], r = 110, y1 = 150, dx = Math.sqrt(r * r - (O[1] - y1) ** 2), T = [O[0], O[1] - r];
    const body = circ(O, r, { c: C.blue, w: 4, fill: C.sky }) + dot(O, { r: 6 }) + lab(O[0] + 4, O[1] + 30, 'O', { size: 22 })
      + `<g class="mv mv2" style="--y2:${T[1] - y1}px;transition-delay:.2s">${line([50, y1], [480, y1], { c: C.orange, w: 5 })}</g>`
      + g('o2', dot([O[0] - dx, y1], { r: 8, c: C.red }) + dot([O[0] + dx, y1], { r: 8, c: C.red }) + lab(O[0], y1 + 30, '2개', { c: C.red, size: 22 }), .1)
      + dot(T, { r: 9, c: C.red, cls: 'p2', d: 1.1 }) + g('s2', lab(T[0] + 24, T[1] - 14, '1개', { c: C.red, size: 22, anchor: 'start' }), 1.3)
      + line(O, T, { c: C.ink, w: 3, cls: 'd3', d: .1 }) + g('s3', rmark(T, O, [480, T[1]], { s: 16 }), .6)
      + g('s3', lab(470, T[1] - 14, '접선', { c: C.orange, size: 26, anchor: 'end' }), .4)
      + pill(560, 210, '접선', C.orange, { size: 30, cls: 'p3', d: 1, fill: C.peach });
    put(KEY + '접선', svg(id, body, motion(id)));
  }

  // 접점: 원과 접선 → 둘이 만나는 단 한 점이 접점 → 접선을 원을 따라 돌려도 만나는 점은 늘 하나
  {
    const id = 't82-m6-jeopjeom';
    const O = [250, 196], r = 110, T0 = [O[0], O[1] - r], turn = 70;
    const T1 = add(O, mul([Math.sin(turn * Math.PI / 180), -Math.cos(turn * Math.PI / 180)], r));
    const tan = (c) => line([T0[0] - 140, T0[1]], [T0[0] + 140, T0[1]], { c, w: 5 });
    const body = circ(O, r, { c: C.blue, w: 4, fill: C.sky }) + dot(O, { r: 6 }) + lab(O[0] - 4, O[1] + 30, 'O', { size: 22 })
      + g('b3', `<g opacity=".35">${tan(C.orange)}${dot(T0, { r: 8, c: C.red })}</g>`)
      + `<g class="spin">${tan(C.orange)}${line(O, T0, { c: C.ink, w: 2.5, dash: '6 5' })}${dot(T0, { r: 9, c: C.red })}</g>`
      + ring(T0, 12, C.red, 'r2', .1) + g('o3', g('s2', lab(T0[0], T0[1] - 18, '접점', { c: C.red, size: 26 }), .3))
      + g('s3', lab(T1[0] + 22, T1[1] - 10, '접점', { c: C.red, size: 24, anchor: 'start' }), 1.4)
      + g('s3', lab(T0[0], T0[1] - 18, '접점', { c: C.red, size: 22 }).replace(`fill="${C.red}"`, `fill="${C.red}" fill-opacity=".5"`), .2)
      + pill(560, 300, '접점', C.red, { size: 30, cls: 'p3', d: 1.4, fill: C.peach });
    put(KEY + '접점', svg(id, body, motion(id) + `
      .sc-${id} .spin { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; transition: transform 1.2s ease-in-out .2s; }
      .on3 .sc-${id} .spin { transform: rotate(${turn}deg); }`));
  }

  // 내접원·내심 공통 삼각형
  const NA = [210, 50], NB = [70, 300], NC = [420, 300];
  const NI = incen(NA, NB, NC), Nr = dist(NI, foot(NI, NB, NC));
  // 내접원: 삼각형 → 안에서 원이 커져 세 변에 모두 닿음 → 세 접점
  {
    const id = 't82-m6-naejeobwon';
    const sh = [40, 0], A = add(NA, sh), B = add(NB, sh), Cc = add(NC, sh), I = add(NI, sh);
    const F = [foot(I, A, B), foot(I, B, Cc), foot(I, Cc, A)];
    const body = tri([A, B, Cc], C.mint) + vlab(A, I, 'A') + vlab(B, I, 'B') + vlab(Cc, I, 'C')
      + `<g class="grow">${circ(I, Nr, { c: C.orange, w: 4, fill: C.peach })}</g>`
      + F.map((p, k) => dot(p, { r: 8, c: C.red, cls: 'p2', d: 1.2 + k * .15 })).join('')
      + F.map((p) => ring(p, 10, C.red, 'r3', .1)).join('')
      + g('s3', lab(I[0], I[1] + 8, '내접원', { c: C.orange, size: 24 }), .3)
      + pill(560, 90, '내접원', C.orange, { size: 28, cls: 'p3', d: .8, fill: C.peach });
    put(KEY + '내접원', svg(id, body, motion(id) + `
      .sc-${id} .grow { transform-box: fill-box; transform-origin: center; transform: scale(0); opacity: 0; transition: transform 1.1s ease-out .1s, opacity .2s .1s; }
      .on2 .sc-${id} .grow { transform: none; opacity: 1; }`));
  }

  // 내심: 세 내각의 이등분선 → 한 점 I 에서 만남 → I 에서 세 변까지의 거리가 같음 → I 가 내접원의 중심
  {
    const id = 't82-m6-naesim';
    const A = NA, B = NB, Cc = NC, I = NI;
    const F = [foot(I, A, B), foot(I, B, Cc), foot(I, Cc, A)];
    const half = (V, p, q, fill, k) => {
      const m = inAng(V, p, q, 10);
      return g('p2', angMark(V, p, m, 42, fill) + angMark(V, m, q, 42, fill), .3 + k * .45);
    };
    const toSide = (V, p, q) => { // V 의 이등분선이 맞은편 변과 만나는 점
      const d = unit(sub(I, V)), n = [-(q[1] - p[1]), q[0] - p[0]];
      const t = ((p[0] - V[0]) * n[0] + (p[1] - V[1]) * n[1]) / (d[0] * n[0] + d[1] * n[1]);
      return add(V, mul(d, t));
    };
    const body = tri([A, B, Cc], C.mint) + vlab(A, I, 'A') + vlab(B, I, 'B') + vlab(Cc, I, 'C')
      + half(A, B, Cc, C.peach, 0) + half(B, Cc, A, C.sky, 1) + half(Cc, A, B, C.lilac, 2)
      + line(A, toSide(A, B, Cc), { c: C.purple, w: 3, cls: 'd2', d: .2 }) + line(B, toSide(B, Cc, A), { c: C.purple, w: 3, cls: 'd2', d: .65 }) + line(Cc, toSide(Cc, A, B), { c: C.purple, w: 3, cls: 'd2', d: 1.1 })
      + dot(I, { r: 9, c: C.red, cls: 'p3', d: .1 }) + ring(I, 12, C.red, 'r3', .2)
      + F.map((p, k) => line(I, p, { c: C.red, w: 4, cls: 'd3', d: .4 + k * .2 }) + g('s3', rmark(p, I, k === 1 ? Cc : k === 0 ? A : A, { s: 12, c: C.red }), .8 + k * .2)).join('')
      + g('s3', lab(I[0] - 20, I[1] + 9, 'I', { c: C.red, size: 26, anchor: 'end' }), .3)
      + g('s4', circ(I, Nr, { c: C.red, w: 2.5, dash: '8 7' }), .1)
      + g('s3', F.map((p, k) => vlab(p, I, 'DEF'[k], { d: 22, size: 22, c: C.red })).join(''), 1.2)
      + g('s4', lab(540, 186, 'ID = IE = IF', { c: C.red, size: 26 }), .4)
      + pill(548, 260, '내심', C.red, { size: 30, cls: 'p4', d: .9, fill: C.peach });
    put(KEY + '내심', svg(id, body, motion(id)));
  }

  // 평행사변형: 평행한 두 쌍의 직선이 만나 사각형 → 마주 보는 변과 각이 같음 → 두 대각선이 서로를 이등분
  {
    const id = 't82-m6-pyeonghaeng';
    const A = [190, 80], D = [470, 80], B = [110, 270], Cc = [390, 270], O = mid(A, Cc);
    const ext = (p, q, e) => { const u = unit(sub(q, p)); return [add(p, mul(u, -e)), add(q, mul(u, e))]; };
    const L = (p, q, c, d) => { const [a, b] = ext(p, q, 46); return line(a, b, { c, w: 3, cls: 'd1', d }); };
    const body = L(A, D, C.blue, .1) + L(B, Cc, C.blue, .3) + L(B, A, C.orange, .6) + L(Cc, D, C.orange, .8)
      + g('s1', tri([A, B, Cc, D], C.mint, C.ink, 4) + par(A, D, { c: C.blue }) + par(B, Cc, { c: C.blue }) + par(B, A, { n: 2, c: C.orange }) + par(Cc, D, { n: 2, c: C.orange }), 1.3)
      + vlab(A, O, 'A') + vlab(B, O, 'B') + vlab(Cc, O, 'C') + vlab(D, O, 'D')
      + g('s2', tick(A, D, { c: C.blue }).replace(/<path/g, '<path transform="translate(-40 0)"') + tick(B, Cc, { c: C.blue }).replace(/<path/g, '<path transform="translate(-40 0)"') + tick(A, B, { n: 2, c: C.orange }).replace(/<path/g, '<path transform="translate(-16 37)"') + tick(D, Cc, { n: 2, c: C.orange }).replace(/<path/g, '<path transform="translate(-16 37)"'), .1)
      + g('p2', angMark(A, D, B, 30, C.peach), .5) + g('p2', angMark(Cc, B, D, 30, C.peach), .5)
      + g('p2', angMark(B, A, Cc, 30, C.sky), .9) + g('p2', angMark(D, Cc, A, 30, C.sky), .9)
      + line(A, Cc, { c: C.purple, w: 3, cls: 'd3', d: .1 }) + line(B, D, { c: C.purple, w: 3, cls: 'd3', d: .4 })
      + dot(O, { r: 7, c: C.purple, cls: 'p3', d: .9 }) + g('s3', lab(O[0], O[1] + 32, 'O', { c: C.purple, size: 22 }), .9)
      + g('s3', tick(A, O, { c: C.purple, len: 8 }) + tick(O, Cc, { c: C.purple, len: 8 }) + tick(B, O, { n: 2, c: C.green, len: 8 }) + tick(O, D, { n: 2, c: C.green, len: 8 }), 1.1)
      + pill(560, 330, '평행사변형', C.green, { size: 24, cls: 'p3', d: 1.4, fill: C.mint });
    put(KEY + '평행사변형', svg(id, body, motion(id)));
  }

  // 등변사다리꼴: 윗변 ∥ 아랫변인 사다리꼴 → 아랫변 양 끝 각이 65° 로 같음 → 가운데 선으로 접으면 포개져 두 다리 길이도 같음
  {
    const id = 't82-m6-deungbyeon';
    const A = [236, 94], D = [404, 94], B = [152, 274], Cc = [488, 274], O = [320, 184];
    const body = tri([A, B, Cc, D], C.mint)
      + par(A, D, { c: C.blue }) + par(B, Cc, { c: C.blue })
      + g('s1', lab(320, 80, '윗변', { c: C.muted, size: 20 }) + lab(320, 304, '아랫변', { c: C.muted, size: 20 }), .3)
      + vlab(A, O, 'A') + vlab(B, O, 'B') + vlab(Cc, O, 'C') + vlab(D, O, 'D')
      + g('p2', angMark(B, A, Cc, 40, C.sky), .1) + g('p2', angMark(Cc, D, B, 40, C.sky), .4)
      + g('s2', lab(...add(inAng(B, A, Cc, 64), [0, 8]), '65°', { c: C.blue, size: 20 }) + lab(...add(inAng(Cc, D, B, 64), [0, 8]), '65°', { c: C.blue, size: 20 }), .7)
      + line([320, 94], [320, 274], { c: C.purple, w: 2.5, cls: 'd3', d: .05 })
      + `<g class="fold">${tri([A, B, [320, 274], [320, 94]], C.peach, C.ink, 3)}</g>`
      + g('s3', tick(A, B, { n: 2, c: C.orange }) + tick(D, Cc, { n: 2, c: C.orange }), 1.5)
      + pill(320, 340, '등변사다리꼴', C.green, { size: 22, cls: 'p3', d: 1.5, fill: C.mint });
    put(KEY + '등변사다리꼴', svg(id, body, motion(id) + `
      .sc-${id} .fold { transform-box: view-box; transform-origin: 320px 0; opacity: 0; }
      .on3 .sc-${id} .fold { animation: ${id}-fold 1.4s ease-in-out .2s both; }
      @keyframes ${id}-fold { 0% { opacity: 1; transform: scaleX(1); } 50% { opacity: .9; transform: scaleX(-1); } 100% { opacity: 0; transform: scaleX(1); } }`));
  }
})(typeof window !== 'undefined' ? window : globalThis);
