// 수학 7-1 3단원 문자와 식: 낱말 도식
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

  // 조각 둘레 상자(수식 조각 xs·ws 로 자리 잡기). a~b 번째 조각을 감싼다.
  const boxAround = (R, a, b, y, size, color, { cls = '', d = 0, fill = 'none', pad = 9, dash = false } = {}) => {
    const x0 = R.xs[a] - R.ws[a] / 2 - pad, x1 = R.xs[b] + R.ws[b] / 2 + pad;
    return `<rect class="${cls}" ${cls ? delay(d) : ''} ${dash ? 'pathLength="1"' : ''} x="${f(x0)}" y="${f(y - size * .92)}" width="${f(x1 - x0)}" height="${f(size * 1.3)}" rx="10" fill="${fill}" stroke="${color}" stroke-width="3"/>`;
  };
  const midOf = (R, a, b) => (R.xs[a] - R.ws[a] / 2 + R.xs[b] + R.ws[b] / 2) / 2;
  // 아래로 여는 묶음 선과 이름표
  const brace = (x0, x1, y, color, label, { cls = '', d = 0, size = 22 } = {}) =>
    `<g class="${cls}" ${cls ? delay(d) : ''}><path d="M${f(x0)} ${y} q0 10 10 10 H${f((x0 + x1) / 2 - 8)} l8 8 l8 -8 H${f(x1 - 10)} q10 0 10 -10" stroke="${color}" stroke-width="3" fill="none" stroke-linejoin="round"/>${label ? mt((x0 + x1) / 2, y + 44, label, { size, color }) : ''}</g>`;
  const card = (x, y, w, h, color = C.ink, fill = 'white') => `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${color}" stroke-width="3"/>`;
  const mark = (x, y, ok, cls, d) => `<g class="${cls}" ${delay(d)}>${pill(x, y, ok ? '참' : '거짓', ok ? C.green : C.red, { size: 22, fill: ok ? C.mint : C.peach })}</g>`;

  // 대입: 2x + 1 의 x 자리 → 3 을 넣어 2 × 3 + 1 → = 7
  (function () {
    const id = 't71-m3-daeip';
    const A = row(250, 112, ['2x', '+', '1'], { size: 58, gap: 18 });
    const ax = A.xs[0] + A.ws[0] / 2 - wid('x', 58) / 2;
    const B = row(250, 236, ['2', '*', '3', '+', '1'], { size: 58, gap: 18 });
    const body = A.body
      + `<rect class="k1" ${delay(.3)} x="${f(ax - 20)}" y="70" width="50" height="58" rx="8" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="7 5"/>`
      + `<g class="s1" ${delay(.6)}>${card(530, 96, 150, 64, C.orange, C.peach)}${row(530, 112, ['x', '=', '{#orange|3}'], { size: 38 }).body}</g>`
      + `<g class="s2">${arrow(250, 138, 250, 172, C.muted)}${mt(B.xs[0], 236, '2', { size: 58 })}${mt(B.xs[1], 236, '*', { size: 58 })}${mt(B.xs[3], 236, '+', { size: 58 })}${mt(B.xs[4], 236, '1', { size: 58 })}</g>`
      + `<g class="f2" ${delay(.3, `--dx:${f(568 - B.xs[2])}px;--dy:-124px`)}>${mt(B.xs[2], 236, '3', { size: 58, color: C.orange })}</g>`
      + `<g class="s3" ${delay(.2)}>${row(B.left + B.total + 22, 236, ['=', '{#green|7}'], { size: 58, anchor: 'start', gap: 18 }).body}</g>`
      + pill(250, 316, '대입', C.orange, { size: 26, cls: 'p3', d: .8, fill: C.peach });
    put('7-1/수학/3/대입', svg(id, body, motion(id)));
  })();

  // 식의 값: x = 2 를 5x − 3 에 넣어 7 → x = 1 이면 2, x = 3 이면 12
  (function () {
    const id = 't71-m3-sikgap';
    const rowsY = [92, 172, 252];
    const body = `<rect x="230" y="134" width="180" height="76" rx="14" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3.5"/>` + mt(320, 186, '5x - 3', { size: 38 })
      + `<g class="f1" ${delay(.2, '--dx:-60px;--dy:0px')}>${mt(116, 184, 'x = 2', { size: 32, color: C.blue })}</g>`
      + `<g class="s1" ${delay(.8)}>${arrow(170, 172, 222, 172, C.blue)}</g>`
      + `<g class="s2" ${delay(.1)}>${arrow(418, 172, 474, 172, C.orange)}</g>`
      + `<g class="p2" ${delay(.5)}>${mt(520, 186, '7', { size: 40, color: C.orange })}</g>`
      + ring(520, 172, 26, C.orange, 'r2', .8)
      + `<g class="s2" ${delay(.3)}>${row(320, 330, ['5 * 2 - 3', '=', '10 - 3', '=', '{#orange|7}'], { size: 28, gap: 12 }).body}</g>`
      + [[0, 1, 2], [2, 3, 12]].map(([r, x, v], i) => `<g class="s3" ${delay(.2 + i * .4)}>${mt(116, rowsY[r] + 12, `x = ${x}`, { size: 30, color: C.blue })}`
        + `<path d="M170 ${rowsY[r]} L222 ${r ? 196 : 148}" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/><path d="M418 ${r ? 196 : 148} L474 ${rowsY[r]}" stroke="${C.orange}" stroke-width="3" stroke-linecap="round"/>`
        + `${mt(520, rowsY[r] + 12, String(v), { size: 34, color: C.orange })}</g>`).join('')
      + pill(578, 40, '식의 값', C.orange, { size: 22, cls: 'p3', d: 1, fill: C.peach });
    put('7-1/수학/3/식의 값', svg(id, body, motion(id)));
  })();

  // 항: 3x − 2y + 5 → 3x + (−2y) + 5 로 고쳐 더해지는 조각 셋 → 하나하나가 항
  (function () {
    const id = 't71-m3-hang';
    const A = row(320, 96, ['3x - 2y + 5'], { size: 54 });
    const B = row(320, 220, ['3x', '+', '(-2y)', '+', '5'], { size: 50, gap: 20 });
    const cols = [C.orange, C.blue, C.green], fills = [C.peach, C.sky, C.mint];
    const body = `<g class="s1">${A.body}</g>`
      + `<g class="s2">${arrow(320, 120, 320, 152, C.muted)}</g>`
      + [0, 2, 4].map((k, i) => boxAround(B, k, k, 220, 50, cols[i], { cls: 'p2', d: .3 + i * .25, fill: fills[i] })).join('')
      + `<g class="s2" ${delay(.2)}>${B.body}</g>`
      + [0, 2, 4].map((k, i) => `<g class="p3" ${delay(.2 + i * .25)}>${text(B.xs[k], 292, '항', { size: 24, color: cols[i] })}${text(B.xs[k], 170, i + 1, { size: 20, color: C.muted })}</g>`).join('');
    put('7-1/수학/3/항', svg(id, body, motion(id)));
  })();

  // 상수항: 3x² − 2x + 5 의 세 항 → x 가 있는 항과 수만 있는 항 → 5 가 상수항(3x − 8 의 −8 도)
  (function () {
    const id = 't71-m3-sangsu';
    const A = row(320, 120, ['3x^2', '-2x', '+', '5'], { size: 54, gap: 32 });
    const body = boxAround(A, 0, 0, 120, 54, C.blue, { fill: 'white' }) + boxAround(A, 1, 1, 120, 54, C.blue, { fill: 'white' }) + boxAround(A, 3, 3, 120, 54, C.ink, { fill: 'white' })
      + boxAround(A, 0, 0, 120, 54, C.blue, { cls: 's2', d: .2, fill: C.sky }) + boxAround(A, 1, 1, 120, 54, C.blue, { cls: 's2', d: .4, fill: C.sky })
      + boxAround(A, 3, 3, 120, 54, C.orange, { cls: 's2', d: .8, fill: C.peach })
      + A.body
      + `<g class="s2" ${delay(.5)}>${mt(midOf(A, 0, 1), 52, '문자 x 있음', { size: 22, color: C.blue })}</g>`
      + `<g class="s2" ${delay(1)}>${text(A.xs[3], 52, '수만', { size: 22, color: C.orange })}</g>`
      + ring(A.xs[3], 102, 30, C.orange, 'r3', .2)
      + `<g class="s3" ${delay(.4)}>${arrow(A.xs[3], 216, A.xs[3], 168, C.orange)}</g>`
      + pill(A.xs[3], 244, '상수항', C.orange, { size: 26, cls: 'p3', d: .6, fill: C.peach })
      + `<g class="s3" ${delay(1.1)}>${row(200, 312, ['3x {#orange|- 8}'], { size: 40 }).body}</g>`;
    put('7-1/수학/3/상수항', svg(id, body, motion(id)));
  })();

  // 계수: −5x = (−5) × x → 문자 앞에 곱해진 −5 → 3x² − 2x + 5 에서 3 과 −2
  (function () {
    const id = 't71-m3-gyesu';
    const A = row(320, 104, ['-5x', '=', '(-5)', '*', 'x'], { size: 52, gap: 20 });
    const B = row(320, 256, ['{#orange|3}x^2', '{#orange|-2}x', '+', '5'], { size: 50, gap: 22 });
    const lx = A.xs[0] - A.ws[0] / 2 + wid('-5', 52) / 2;
    const b0 = B.xs[0] - B.ws[0] / 2 + wid('3', 50) / 2, b1 = B.xs[1] - B.ws[1] / 2 + wid('-2', 50) / 2;
    const body = `<g class="s1">${A.body}</g>`
      + `<g class="p2" ${delay(.2)}>${mt(A.xs[0], 104, '{#orange|-5}{#none|x}', { size: 52 })}${mt(A.xs[2], 104, '{#none|(}{#orange|-5}{#none|)}', { size: 52 })}</g>`
      + ring(A.xs[2], 86, 34, C.orange, 'r2', .5)
      + `<g class="s2" ${delay(.7)}>${arrow(A.xs[2], 168, A.xs[2], 132, C.orange)}${mt(A.xs[2], 192, 'x의 계수', { size: 22, color: C.orange })}</g>`
      + `<g class="s3" ${delay(.2)}>${B.body}</g>`
      + `<g class="s3" ${delay(.7)}>${arrow(b0, 306, b0, 274, C.orange)}${mt(b0, 334, 'x^2의 계수', { size: 22, color: C.orange })}${arrow(b1, 306, b1, 274, C.orange)}${mt(b1 + 22, 334, 'x의 계수', { size: 22, color: C.orange })}</g>`
      + pill(560, 256, '계수', C.orange, { size: 26, cls: 'p3', d: 1.1, fill: C.peach });
    put('7-1/수학/3/계수', svg(id, body, motion(id)));
  })();

  // 단항식: 3x, −5, −4ab 는 저마다 한 덩어리 → −4ab = (−4) × a × b, 곱셈뿐 → 항이 하나뿐인 식
  (function () {
    const id = 't71-m3-danhang';
    const X = [130, 320, 510], items = ['3x', '-5', '-4ab'];
    const body = items.map((s, i) => `<g class="p1" ${delay(.2 + i * .25)}>${card(X[i], 104, 150, 86)}${mt(X[i], 122, s, { size: 46 })}</g>`).join('')
      + `<g class="s2" ${delay(.1)}>${arrow(510, 152, 510, 184, C.muted)}</g>`
      + `<g class="s2" ${delay(.4)}>${row(440, 232, ['=', '(-4)', '{#purple|*}', 'a', '{#purple|*}', 'b'], { size: 36, gap: 12 }).body}</g>`
      + `<g class="s2" ${delay(.9)}>${text(440, 276, '곱셈뿐', { size: 22, color: C.purple })}</g>`
      + X.map((x, i) => `<g class="s3" ${delay(.1 + i * .2)}><rect x="${x - 75}" y="61" width="150" height="86" rx="12" fill="none" stroke="${C.green}" stroke-width="5"/></g>`
        + `<g class="p3" ${delay(.3 + i * .2)}>${text(x, i === 2 ? 40 : 182, '항 1개', { size: 22, color: C.green })}</g>`).join('')
      + pill(170, 316, '단항식', C.green, { size: 26, cls: 'p3', d: 1, fill: C.mint });
    put('7-1/수학/3/단항식', svg(id, body, motion(id)));
  })();

  // 다항식: 2x + 3y − 1 → 항 세 개로 나뉨 → 항이 하나든 여럿이든 항의 합으로 된 식
  (function () {
    const id = 't71-m3-dahang';
    const A = row(320, 84, ['2x', '+', '3y', '-', '1'], { size: 50, gap: 18 });
    const B = row(250, 210, ['2x', '+', '3y', '+', '(-1)'], { size: 44, gap: 16 });
    const cols = [C.orange, C.blue, C.green], fills = [C.peach, C.sky, C.mint];
    const src = [0, 2, 4];
    const body = `<g class="s1">${A.body}</g>`
      + [0, 2, 4].map((k, i) => boxAround(B, k, k, 210, 44, cols[i], { cls: 'p2', d: .6 + i * .2, fill: fills[i] })).join('')
      + [0, 2, 4].map((k, i) => `<g class="f2" ${delay(.1 + i * .15, `--dx:${f(A.xs[src[i]] - B.xs[k] - (i === 2 ? 16 : 0))}px;--dy:-126px`)}>${mt(B.xs[k], 210, ['2x', '3y', '(-1)'][i], { size: 44, color: cols[i] })}</g>`).join('')
      + `<g class="s2" ${delay(.8)}>${mt(B.xs[1], 210, '+', { size: 44 })}${mt(B.xs[3], 210, '+', { size: 44 })}</g>`
      + [0, 2, 4].map((k, i) => `<g class="p2" ${delay(.9 + i * .2)}>${text(B.xs[k], 152, i + 1, { size: 22, color: cols[i] })}</g>`).join('')
      + `<g class="s3" ${delay(.2)}>${text(B.xs[2], 270, '항 3개', { size: 22, color: C.muted })}${card(530, 194, 120, 74)}${mt(530, 210, '3x', { size: 44 })}${text(530, 270, '항 1개', { size: 22, color: C.muted })}</g>`
      + `<rect class="draw d3" pathLength="1" ${delay(.6)} x="40" y="128" width="560" height="166" rx="20" fill="none" stroke="${C.purple}" stroke-width="3.5"/>`
      + pill(320, 300, '다항식', C.purple, { size: 26, cls: 'p3', d: 1.1, fill: C.lilac });
    put('7-1/수학/3/다항식', svg(id, body, motion(id)));
  })();

  // 차수: 3 × x × x (x 두 번) → 3x² 의 2 → −2x 는 x 한 번이라 1
  (function () {
    const id = 't71-m3-chasu';
    const A = row(180, 92, ['3', '*', 'x', '*', 'x'], { size: 46, gap: 14 });
    const B = row(470, 92, ['(-2)', '*', 'x'], { size: 46, gap: 14 });
    const body = `<g class="s1">${A.body}</g>`
      + [2, 4].map((k, i) => `<g class="p1" ${delay(.5 + i * .3)}>${text(A.xs[k], 134, i + 1, { size: 22, color: C.blue })}</g>`).join('')
      + `<g class="s2">${arrow(180, 150, 180, 180, C.muted)}</g>`
      + `<g class="p2" ${delay(.2)}>${mt(180, 252, '3x^{#blue|2}', { size: 64 })}</g>`
      + ring(212, 214, 22, C.blue, 'r2', .7)
      + pill(180, 312, '차수 2', C.blue, { size: 24, cls: 's2', d: 1, fill: C.sky })
      + `<g class="s3"><path d="M330 50 V320" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/>${B.body}</g>`
      + `<g class="p3" ${delay(.4)}>${text(B.xs[2], 134, 1, { size: 22, color: C.blue })}</g>`
      + `<g class="s3" ${delay(.4)}>${arrow(470, 150, 470, 180, C.muted)}${mt(470, 252, '-2x', { size: 64 })}</g>`
      + pill(470, 312, '차수 1', C.blue, { size: 24, cls: 'p3', d: 1, fill: C.sky });
    put('7-1/수학/3/차수', svg(id, body, motion(id)));
  })();

  // 일차식: 4x − 5 는 차수 1 → −2x + 3 도 1, x² + 1 은 2 → 차수가 1 인 다항식
  (function () {
    const id = 't71-m3-ilcha';
    const Y = [86, 176, 266], ex = ['4x - 5', '-2x + 3', 'x^2 + 1'], dg = [1, 1, 2];
    const body = Y.map((y, i) => `<g class="${i ? 's2' : 's1'}" ${delay(i ? (i - 1) * .5 : .1)}>${card(220, y - 14, 220, 72)}${mt(220, y + 2, ex[i], { size: 42 })}</g>`
      + `<g class="${i ? 'p2' : 'p1'}" ${delay(i ? .3 + (i - 1) * .5 : .6)}>${pill(410, y - 14, `차수 ${dg[i]}`, dg[i] === 1 ? C.green : C.muted, { size: 22, fill: 'white' })}</g>`).join('')
      + `<g class="s3" ${delay(.2)}><rect x="108" y="${Y[2] - 50}" width="224" height="72" rx="12" fill="${C.paper}" fill-opacity=".72"/></g>`
      + `<path class="draw d3" pathLength="1" ${delay(.2)} d="M478 ${Y[0] - 48} q14 0 14 14 V${Y[1] + 6} q0 14 -14 14" stroke="${C.green}" stroke-width="3.5" fill="none"/>`
      + [0, 1].map((i) => `<rect class="k3" ${delay(.3)} x="106" y="${Y[i] - 54}" width="228" height="80" rx="14" fill="none" stroke="${C.green}" stroke-width="4"/>`).join('')
      + pill(560, (Y[0] + Y[1]) / 2 - 14, '일차식', C.green, { size: 26, cls: 'p3', d: .8, fill: C.mint });
    put('7-1/수학/3/일차식', svg(id, body, motion(id)));
  })();

  // 동류항: 3x + x² − 5x + 2x² → x 끼리, x² 끼리 모음 → −2x, 3x²
  (function () {
    const id = 't71-m3-dongryu';
    const A = row(320, 86, ['{#blue|3x}', '+', '{#purple|x^2}', '{#blue|-}', '{#blue|5x}', '{#purple|+}', '{#purple|2x^2}'], { size: 46, gap: 14 });
    const L = row(170, 210, ['3x', '-', '5x'], { size: 42, gap: 12 });
    const Rr = row(470, 210, ['x^2', '+', '2x^2'], { size: 42, gap: 12 });
    const fly = (R, k, s, color, from, d) => `<g class="f2" ${delay(d, `--dx:${f(A.xs[from] - R.xs[k])}px;--dy:-124px`)}>${mt(R.xs[k], 210, s, { size: 42, color })}</g>`;
    const body = `<g class="s1">${A.body}</g>`
      + boxAround(L, 0, 2, 210, 42, C.blue, { cls: 's2', d: .8, fill: C.sky }) + boxAround(Rr, 0, 2, 210, 42, C.purple, { cls: 's2', d: .8, fill: C.lilac })
      + fly(L, 0, '3x', C.blue, 0, .1) + fly(L, 1, '-', C.blue, 3, .2) + fly(L, 2, '5x', C.blue, 4, .2)
      + fly(Rr, 0, 'x^2', C.purple, 2, .4) + fly(Rr, 1, '+', C.purple, 5, .5) + fly(Rr, 2, '2x^2', C.purple, 6, .5)
      + `<g class="s3" ${delay(.2)}>${arrow(170, 238, 170, 262, C.blue)}${row(170, 306, ['=', '{#blue|-2x}'], { size: 42 }).body}</g>`
      + `<g class="s3" ${delay(.5)}>${arrow(470, 238, 470, 262, C.purple)}${row(470, 306, ['=', '{#purple|3x^2}'], { size: 42 }).body}</g>`
      + pill(320, 210, '동류항', C.green, { size: 24, cls: 'p3', d: 1, fill: C.mint });
    put('7-1/수학/3/동류항', svg(id, body, motion(id)));
  })();

  // 등식: 저울 왼쪽 2 + 3, 오른쪽 5 가 수평 → 2 + 3 = 5 → x + 1 = 4 도
  (function () {
    const id = 't71-m3-deungsik';
    const PV = [320, 92], L = 160, PY = 196;
    const cubes = (cx, list) => { let s = '', x = cx - list.length * 14; for (const c of list) { s += `<rect x="${x + 1}" y="${PY - 27}" width="26" height="26" rx="4" fill="${c[0]}" stroke="${c[1]}" stroke-width="2.5"/>`; x += 28; } return s; };
    const O = [C.peach, C.orange], B = [C.sky, C.blue], G = [C.mint, C.green];
    const bag = (cx) => `<rect x="${cx - 22}" y="${PY - 46}" width="44" height="46" rx="10" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>${mt(cx, PY - 14, 'x', { size: 30, color: C.purple })}`;
    const pan = (cx, inner) => `<path d="M${cx} ${PV[1]} L${cx - 70} ${PY} M${cx} ${PV[1]} L${cx + 70} ${PY}" stroke="${C.muted}" stroke-width="2"/>${inner}<path d="M${cx - 84} ${PY} H${cx + 84} l-14 14 H${cx - 70} Z" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const left1 = cubes(PV[0] - L, [O, O, B, B, B]), right1 = cubes(PV[0] + L, [G, G, G, G, G]);
    const left2 = bag(PV[0] - L - 18) + `<rect x="${PV[0] - L + 12}" y="${PY - 27}" width="26" height="26" rx="4" fill="${O[0]}" stroke="${O[1]}" stroke-width="2.5"/>`, right2 = cubes(PV[0] + L, [G, G, G, G]);
    const body = `<path d="M${PV[0]} ${PV[1]} L${PV[0] - 34} 262 H${PV[0] + 34} Z" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<g class="beam"><path d="M${PV[0] - L - 10} ${PV[1]} H${PV[0] + L + 10}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></g>`
      + `<g class="panL">${pan(PV[0] - L, `<g class="h3">${left1}</g><g class="s3" ${delay(.2)}>${left2}</g>`)}</g>`
      + `<g class="panR">${pan(PV[0] + L, `<g class="h3">${right1}</g><g class="s3" ${delay(.2)}>${right2}</g>`)}</g>`
      + `<circle cx="${PV[0]} " cy="${PV[1]}" r="9" fill="${C.ink}"/>`
      + `<g class="h3"><g class="s2" ${delay(.1)}>${row(320, 318, ['{#orange|2}', '+', '{#blue|3}', '{#none|=}', '{#green|5}'], { size: 44, gap: 16 }).body}</g></g>`
      + `<g class="h3"><g class="p2" ${delay(.5)}>${mt(row(320, 318, ['2', '+', '3', '=', '5'], { size: 44, gap: 16 }).xs[3], 318, '=', { size: 44 })}</g></g>`
      + `<g class="s3" ${delay(.6)}>${row(320, 318, ['{#purple|x}', '+', '{#orange|1}', '=', '{#green|4}'], { size: 44, gap: 16 }).body}</g>`
      + pill(320, 36, '등식', C.green, { size: 26, cls: 'p3', d: 1.1, fill: C.mint });
    const t = (a, b) => `transform: translate(${a}px, ${b}px)`;
    put('7-1/수학/3/등식', svg(id, body, motion(id) + `
      .sc-${id} .beam { transform-box: view-box; transform-origin: ${PV[0]}px ${PV[1]}px; transform: rotate(-9deg); }
      .sc-${id} .panL { ${t(0, 25)}; } .sc-${id} .panR { ${t(0, -25)}; }
      .on1 .sc-${id} .beam { animation: ${id}-beam 1.6s ease-out .2s both; }
      .on1 .sc-${id} .panL { animation: ${id}-l 1.6s ease-out .2s both; }
      .on1 .sc-${id} .panR { animation: ${id}-r 1.6s ease-out .2s both; }
      @keyframes ${id}-beam { 0% { transform: rotate(-9deg); } 55% { transform: rotate(3deg); } 80% { transform: rotate(-1deg); } 100% { transform: none; } }
      @keyframes ${id}-l { 0% { ${t(0, 25)}; } 55% { ${t(0, -8)}; } 80% { ${t(0, 3)}; } 100% { transform: none; } }
      @keyframes ${id}-r { 0% { ${t(0, -25)}; } 55% { ${t(0, 8)}; } 80% { ${t(0, -3)}; } 100% { transform: none; } }`));
  })();

  // 좌변·우변: 등호를 기준으로 왼쪽(오른쪽) 부분
  for (const [word, id, items, side, color, fill] of [
    ['좌변', 't71-m3-jwabyeon', ['3x', '+', '2', '=', '11'], 0, C.orange, C.peach],
    ['우변', 't71-m3-ubyeon', ['2x', '-', '1', '=', '9'], 1, C.blue, C.sky]
  ]) {
    const R = row(320, 150, items, { size: 60, gap: 22 });
    const eq = R.xs[3], a = side ? 4 : 0, b = side ? 4 : 2;
    const body = boxAround(R, a, b, 150, 60, color, { cls: 's3', d: .1, fill, pad: 14 })
      + `<g class="s1">${R.body}</g>`
      + ring(eq, 130, 30, C.green, 'r2', .2)
      + `<g class="s2" ${delay(.4)}><path d="M${eq} 66 V226" stroke="${C.green}" stroke-width="3" stroke-dasharray="8 7"/></g>`
      + brace(R.xs[a] - R.ws[a] / 2 - 10, R.xs[b] + R.ws[b] / 2 + 10, 196, color, '', { cls: 's3', d: .5 })
      + pill(midOf(R, a, b), 270, word, color, { size: 26, cls: 'p3', d: .8, fill });
    put(`7-1/수학/3/${word}`, svg(id, body, motion(id)));
  }

  // 양변: x − 2 = 5 의 좌변·우변 → 양변에 똑같이 + 2 → 두 변을 함께 양변
  (function () {
    const id = 't71-m3-yangbyeon';
    const R = row(320, 78, ['x', '-', '2', '=', '5'], { size: 50, gap: 20 });
    const R2 = row(320, 258, ['x', '-', '2', '{#green|+ 2}', '=', '5', '{#green|+ 2}'], { size: 44, gap: 16 });
    const lx0 = R.xs[0] - R.ws[0] / 2 - 8, lx1 = R.xs[2] + R.ws[2] / 2 + 8, rx0 = R.xs[4] - R.ws[4] / 2 - 14, rx1 = R.xs[4] + R.ws[4] / 2 + 14;
    const body = `<g class="s1">${R.body}</g>`
      + brace(lx0, lx1, 92, C.orange, '좌변', { cls: 's1', d: .4 }) + brace(rx0, rx1, 92, C.blue, '우변', { cls: 's1', d: .7 })
      + `<g class="s2" ${delay(.1)}>${mt(R2.xs[0], 258, 'x', { size: 44 })}${mt(R2.xs[1], 258, '-', { size: 44 })}${mt(R2.xs[2], 258, '2', { size: 44 })}${mt(R2.xs[4], 258, '=', { size: 44 })}${mt(R2.xs[5], 258, '5', { size: 44 })}</g>`
      + `<g class="f2" ${delay(.4, '--dx:0px;--dy:-60px')}>${mt(R2.xs[3], 258, '+ 2', { size: 44, color: C.green })}</g>`
      + `<g class="f2" ${delay(.4, '--dx:0px;--dy:-60px')}>${mt(R2.xs[6], 258, '+ 2', { size: 44, color: C.green })}</g>`
      + `<g class="s2" ${delay(1.2)}>${row(560, 330, ['x', '=', '{#green|7}'], { size: 40 }).body}${arrow(560, 272, 560, 292, C.muted)}</g>`
      + `<g class="k3" ${delay(.1)}><path d="M${f(lx0)} 92 q0 10 10 10 H${f(lx1 - 10)} q10 0 10 -10 M${f(rx0)} 92 q0 10 10 10 H${f(rx1 - 10)} q10 0 10 -10" stroke="${C.green}" stroke-width="5" fill="none"/></g>`
      + `<path class="draw d3" pathLength="1" ${delay(.4)} d="M${f((lx0 + lx1) / 2)} 152 Q${f((lx0 + rx1) / 2)} 196 ${f((rx0 + rx1) / 2)} 152" stroke="${C.green}" stroke-width="3.5" fill="none"/>`
      + pill((lx0 + rx1) / 2, 192, '양변', C.green, { size: 26, cls: 'p3', d: .9, fill: C.mint });
    put('7-1/수학/3/양변', svg(id, body, motion(id)));
  })();

  // 방정식: x + 3 = 8 에 4 → 거짓, 5 → 참, 6 → 거짓
  (function () {
    const id = 't71-m3-bangjeong';
    const Y = [146, 216, 286], vals = [4, 5, 6];
    const body = `<g>${row(320, 64, ['x + 3 = 8'], { size: 50 }).body}</g>`
      + vals.map((v, i) => {
        const b = i ? 2 : 1, d = i ? (i - 1) * .7 : .1;
        return `<g class="s${b}" ${delay(d)}>${mt(120, Y[i] + 12, `x = ${v}`, { size: 32, color: C.purple })}${arrow(176, Y[i], 214, Y[i], C.muted, '', 3)}${row(330, Y[i] + 12, [`{#purple|${v}} + 3 = 8`], { size: 34 }).body}</g>`
          + mark(530, Y[i], v === 5, `p${b}`, d + .4);
      }).join('')
      + `<rect class="k3" ${delay(.2)} x="62" y="${Y[1] - 30}" width="546" height="60" rx="12" fill="none" stroke="${C.green}" stroke-width="3"/>`
      + pill(540, 64, '방정식', C.purple, { size: 26, cls: 'p3', d: .8, fill: C.lilac });
    put('7-1/수학/3/방정식', svg(id, body, motion(id)));
  })();

  // 미지수: x + 4 = 10 의 x 는 아직 모름 → 막대로 보면 6 → 값을 모르는 수를 나타내는 문자
  (function () {
    const id = 't71-m3-miji';
    const R = row(320, 84, ['x', '+', '4', '=', '10'], { size: 52, gap: 20 });
    const U = 40, X0 = 120;
    let cubes = '';
    for (let i = 0; i < 4; i++) cubes += `<rect x="${X0 + (6 + i) * U + 2}" y="140" width="${U - 4}" height="${U - 4}" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    let ten = '';
    for (let i = 0; i < 10; i++) ten += `<rect x="${X0 + i * U + 2}" y="210" width="${U - 4}" height="${U - 4}" rx="5" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`;
    let six = '';
    for (let i = 0; i < 6; i++) six += `<rect class="p2" ${delay(.2 + i * .12)} x="${X0 + i * U + 2}" y="140" width="${U - 4}" height="${U - 4}" rx="5" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`;
    const body = `<g class="s1">${R.body}</g>`
      + `<g class="k1" ${delay(.3)}>${mt(R.xs[0] + 2, 36, '?', { size: 28, color: C.purple })}</g>` + ring(R.xs[0], 66, 24, C.purple, 'r1', .2)
      + `<g class="s1" ${delay(.5)}><rect x="${X0 + 2}" y="140" width="${6 * U - 4}" height="${U - 4}" rx="6" fill="white" stroke="${C.purple}" stroke-width="2.5" stroke-dasharray="7 6"/>${mt(X0 + 3 * U, 166, 'x', { size: 30, color: C.purple })}${cubes}${ten}${text(X0 + 10 * U + 34, 238, 10, { size: 26, color: C.green })}${text(X0 + 8 * U, 130, 4, { size: 22, color: C.orange })}</g>`
      + six + `<g class="p2" ${delay(1)}><rect x="${X0 + 3 * U - 22}" y="146" width="44" height="26" rx="6" fill="white"/>${text(X0 + 3 * U, 168, 6, { size: 26, color: C.purple })}</g>`
      + `<g class="s2" ${delay(1.1)}>${row(320, 306, ['x', '=', '{#purple|6}'], { size: 40 }).body}</g>`
      + ring(R.xs[0], 66, 24, C.purple, 'r3', .2)
      + `<g class="s3" ${delay(.4)}>${arrow(R.xs[0] - 76, 66, R.xs[0] - 34, 66, C.purple)}</g>`
      + pill(R.xs[0] - 128, 66, '미지수', C.purple, { size: 24, cls: 'p3', d: .5, fill: C.lilac });
    put('7-1/수학/3/미지수', svg(id, body, motion(id)));
  })();

  // 해: x + 5 = 9 의 x 에 1~6 을 넣어 보면 → 4 일 때만 참 → x = 4 가 해
  (function () {
    const id = 't71-m3-hae';
    const X = (i) => 170 + i * 82;
    let body = row(320, 60, ['x + 5 = 9'], { size: 48 }).body
      + mt(62, 142, 'x', { size: 30, color: C.purple }) + mt(62, 222, 'x + 5', { size: 24 });
    for (let i = 0; i < 6; i++) {
      const n = i + 1, ok = n === 4;
      body += `<g class="p1" ${delay(.1 + i * .12)}>${card(X(i), 130, 64, 60)}${text(X(i), 142, n, { size: 30, color: C.purple })}</g>`
        + `<g class="s2" ${delay(.1 + i * .2)}>${text(X(i), 222, n + 5, { size: 30, color: ok ? C.green : C.muted })}</g>`;
      if (!ok) body += `<rect class="s2" ${delay(.3 + i * .2)} x="${X(i) - 34}" y="98" width="68" height="64" rx="12" fill="${C.paper}" fill-opacity=".7"/>`;
    }
    body += `<g class="p2" ${delay(1)}>${card(X(3), 130, 64, 60, C.green, C.mint)}${text(X(3), 142, 4, { size: 30, color: C.green })}</g>`
      + `<rect class="k2" ${delay(1.1)} x="${X(3) - 38}" y="94" width="76" height="150" rx="14" fill="none" stroke="${C.green}" stroke-width="4"/>`
      + `<g class="s3" ${delay(.2)}>${row(270, 306, ['x', '=', '{#green|4}'], { size: 44 }).body}</g>`
      + pill(430, 296, '해', C.green, { size: 28, cls: 'p3', d: .6, fill: C.mint });
    put('7-1/수학/3/해', svg(id, body, motion(id)));
  })();

  // 항등식: 2(x + 1) = 2x + 2 에 1, 2, 3 → 모두 참 → 좌변을 풀면 우변과 같은 식
  (function () {
    const id = 't71-m3-hangdeung';
    const C1 = 110, C2 = 260, C3 = 410, C4 = 540;
    const R = row(320, 54, ['2(x + 1)', '=', '2x + 2'], { size: 42, gap: 14 });
    const L0 = R.xs[0] - R.ws[0] / 2;
    let body = R.body
      + `<g class="s1">${mt(C1, 136, 'x', { size: 28, color: C.purple })}${mt(C2, 136, '2(x + 1)', { size: 28, color: C.muted })}${mt(C3, 136, '2x + 2', { size: 28, color: C.muted })}<path d="M60 150 H590" stroke="${C.line}" stroke-width="2.5"/></g>`;
    [1, 2, 3].forEach((x, i) => {
      const y = 188 + i * 44;
      body += `<g class="s1" ${delay(.3 + i * .35)}>${text(C1, y, x, { size: 28, color: C.purple })}${text(C2, y, 2 * (x + 1), { size: 28 })}${text(C3, y, 2 * x + 2, { size: 28 })}</g>`
        + mark(C4, y - 9, true, 'p1', .5 + i * .35);
    });
    // 2칸: 2 를 x 와 1 에 각각 곱하는 활
    const r0 = L0 + wid('2', 42) / 2;
    const xX = L0 + wid('2(', 42) + wid('x', 42) / 2, x1 = L0 + wid('2(x + ', 42) + wid('1', 42) / 2;
    body += `<path class="draw d2" pathLength="1" ${delay(.1)} d="M${f(r0)} 18 Q${f((r0 + xX) / 2)} 2 ${f(xX)} 18" stroke="${C.orange}" stroke-width="3" fill="none"/>`
      + `<path class="draw d2" pathLength="1" ${delay(.5)} d="M${f(r0)} 18 Q${f((r0 + x1) / 2)} -8 ${f(x1)} 18" stroke="${C.orange}" stroke-width="3" fill="none"/>`
      + `<g class="s2" ${delay(1)}><rect x="${f(R.xs[2] - R.ws[2] / 2 - 8)}" y="66" width="${f(R.ws[2] + 16)}" height="6" rx="3" fill="${C.green}"/>${mt(f(R.xs[0]), 98, '= 2x + 2', { size: 22, color: C.orange })}</g>`
      + [0, 1, 2].map((i) => `<rect class="k3" ${delay(.1)} x="${C4 - 40}" y="${188 + i * 44 - 32}" width="80" height="46" rx="23" fill="none" stroke="${C.green}" stroke-width="4"/>`).join('')
      + pill(320, 330, '항등식', C.green, { size: 26, cls: 'p3', d: .6, fill: C.mint });
    put('7-1/수학/3/항등식', svg(id, body, motion(id)));
  })();

  // 이항: x + 6 = 10 의 +6 → 등호를 건너 우변으로 가며 −6 → x = 4
  (function () {
    const id = 't71-m3-ihang';
    const A = row(320, 96, ['x', '+6', '=', '10'], { size: 58, gap: 22 });
    const B = row(320, 212, ['x', '=', '10', '-6'], { size: 58, gap: 22 });
    const dx = A.xs[1] - B.xs[3], dy = 96 - 212;
    const body = `<g class="s1">${mt(A.xs[0], 96, 'x', { size: 58 })}${mt(A.xs[2], 96, '=', { size: 58 })}${mt(A.xs[3], 96, '10', { size: 58 })}</g>`
      + `<g class="h2">${mt(A.xs[1], 96, '+6', { size: 58, color: C.orange })}</g>`
      + `<g class="s2">${mt(A.xs[1], 96, '+6', { size: 58, color: C.line })}</g>`
      + boxAround(A, 1, 1, 96, 58, C.orange, { cls: 'k1', d: .3 })
      + `<g class="s2">${mt(B.xs[0], 212, 'x', { size: 58 })}${mt(B.xs[1], 212, '=', { size: 58 })}${mt(B.xs[2], 212, '10', { size: 58 })}</g>`
      + `<g class="jump"><g class="pl">${mt(B.xs[3], 212, '+6', { size: 58, color: C.orange })}</g><g class="mi">${mt(B.xs[3], 212, '-6', { size: 58, color: C.blue })}</g></g>`
      + `<g class="s2" ${delay(1.2)}>${text((A.xs[2] + B.xs[3]) / 2 + 60, 150, '+ → −', { size: 24, color: C.blue })}</g>`
      + `<g class="s3" ${delay(.2)}>${row(220, 312, ['x', '=', '{#green|4}'], { size: 48 }).body}</g>`
      + pill(450, 300, '이항', C.blue, { size: 28, cls: 'p3', d: .6, fill: C.sky });
    put('7-1/수학/3/이항', svg(id, body, motion(id) + `
      .sc-${id} .jump, .sc-${id} .mi { opacity: 0; }
      .on2 .sc-${id} .jump { animation: ${id}-jump 1.3s ease-in-out .2s both; }
      .on2 .sc-${id} .pl { animation: ${id}-out 1.3s ease-in-out .2s both; }
      .on2 .sc-${id} .mi { animation: ${id}-in 1.3s ease-in-out .2s both; }
      @keyframes ${id}-jump { 0% { opacity: 1; transform: translate(${f(dx)}px, ${dy}px); } 50% { transform: translate(${f(dx / 2)}px, ${dy - 40}px); } 100% { opacity: 1; transform: none; } }
      @keyframes ${id}-out { 0%, 40% { opacity: 1; } 60%, 100% { opacity: 0; } }
      @keyframes ${id}-in { 0%, 40% { opacity: 0; } 60%, 100% { opacity: 1; } }`));
  })();

  // 일차방정식: 3x − 5 = 10 → 10 을 이항해 3x − 15 = 0, 곧 (일차식) = 0 → 해 x = 5
  (function () {
    const id = 't71-m3-ilchabang';
    const A = row(320, 70, ['3x - 5', '=', '10'], { size: 50, gap: 18 });
    const B = row(320, 160, ['3x - 5', '{#blue|- 10}', '=', '0'], { size: 44, gap: 16 });
    const D = row(320, 252, ['3x - 15', '=', '0'], { size: 50, gap: 18 });
    const body = `<g class="s1">${A.body}</g>`
      + `<g class="s2" ${delay(.1)}>${mt(B.xs[0], 160, '3x - 5', { size: 44 })}${mt(B.xs[2], 160, '=', { size: 44 })}${mt(B.xs[3], 160, '0', { size: 44 })}</g>`
      + `<g class="f2" ${delay(.2, `--dx:${f(A.xs[2] - B.xs[1])}px;--dy:-90px`)}>${mt(B.xs[1], 160, '- 10', { size: 44, color: C.blue })}</g>`
      + `<g class="s2" ${delay(1)}>${D.body}</g>`
      + brace(D.xs[0] - D.ws[0] / 2 - 6, D.xs[0] + D.ws[0] / 2 + 6, 266, C.purple, '일차식', { cls: 's2', d: 1.3 })
      + `<g class="s3" ${delay(.2)}>${row(570, 252, ['x', '=', '{#green|5}'], { size: 36 }).body}</g>`
      + pill(486, 316, '일차방정식', C.green, { size: 24, cls: 'p3', d: .5, fill: C.mint });
    put('7-1/수학/3/일차방정식', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
