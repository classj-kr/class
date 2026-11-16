// 수학 7-1 1단원 소인수분해: 낱말 도식
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

  // 소수: 1~12 의 약수 개수만큼 점 → 점이 두 개뿐인 수(2, 3, 5, 7, 11)
  (function () {
    const id = 't71-m1-sosu';
    const cnt = [1, 2, 2, 3, 2, 4, 2, 4, 3, 4, 2, 6];
    let body = '', di = 0;
    cnt.forEach((c, k) => {
      const col = k % 6, rw = Math.floor(k / 6), x = 44 + col * 94, y = 18 + rw * 140, w = 82, h = 124;
      body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="white" stroke="${C.line}" stroke-width="2.5"/>`;
      if (c === 2) body += `<rect class="s2" ${delay(.2 + di++ * .2)} x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>`;
      body += text(x + w / 2, y + 48, k + 1, { size: 36, color: c === 2 ? C.green : C.ink });
      for (let i = 0; i < c; i++) {
        const r = Math.floor(i / 3), m = Math.min(3, c - r * 3), cc = i % 3;
        body += `<circle class="p1" ${delay(.15 + k * .09 + i * .05)} cx="${f(x + w / 2 + (cc - (m - 1) / 2) * 21)}" cy="${y + 78 + r * 21}" r="7" fill="${c === 2 ? C.green : C.orange}"/>`;
      }
      if (c === 2) body += `<rect class="k3" ${delay(.1)} x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="15" fill="none" stroke="${C.green}" stroke-width="5"/>`;
      if (k === 0) body += `<rect class="s3" ${delay(.2)} x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${C.paper}" fill-opacity=".72" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
    });
    body += pill(230, 326, '약수 2개', C.green, { cls: 's2', d: 1.1 })
      + `<g class="s3" ${delay(.2)}>${arrow(300, 326, 360, 326, C.green, '', 4)}</g>`
      + pill(420, 326, '소수', C.green, { size: 28, cls: 'p3', d: .4, fill: C.mint });
    put('7-1/수학/1/소수', svg(id, body, motion(id)));
  })();

  // 합성수: 네모 12개를 1 × 12 → 2 × 6 → 3 × 4 로 다시 놓는다
  (function () {
    const id = 't71-m1-hapseong', S = 38;
    const pos = (k, rows) => { const cols = 12 / rows, x0 = 320 - cols * S / 2, y0 = 182 - rows * S / 2; return [x0 + (k % cols) * S, y0 + Math.floor(k / cols) * S]; };
    let sq = '';
    for (let k = 0; k < 12; k++) {
      const [x1, y1] = pos(k, 1), [x2, y2] = pos(k, 2), [x3, y3] = pos(k, 3);
      sq += `<g class="mv mv2 mv3" style="--x2:${f(x2 - x1)}px;--y2:${f(y2 - y1)}px;--x3:${f(x3 - x1)}px;--y3:${f(y3 - y1)}px;transition-delay:${(k * .04).toFixed(2)}s">`
        + `<rect class="p1" ${delay(.1 + k * .07)} x="${f(x1 + 2)}" y="${f(y1 + 2)}" width="${S - 4}" height="${S - 4}" rx="5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/></g>`;
    }
    const dims = (a, b, cls) => `<g class="${cls}">${row(320, 70, [String(a), '*', String(b)], { size: 40 }).body}</g>`;
    const body = sq
      + `<g class="h2">${dims(1, 12, 's1')}</g>`
      + `<g class="h3"><g class="s2" ${delay(.9)}>${dims(2, 6, '')}</g></g>`
      + `<g class="s3" ${delay(.9)}>${dims(3, 4, '')}</g>`
      + `<g class="s3" ${delay(1.2)}>${text(250, 316, '약수', { size: 24, color: C.muted })}${row(395, 316, ['1, 2, 3, 4, 6, 12'], { size: 26, color: C.orange }).body}</g>`
      + pill(560, 182, '합성수', C.orange, { size: 26, cls: 'p3', d: 1.5, fill: C.peach });
    put('7-1/수학/1/합성수', svg(id, body, motion(id)));
  })();

  // 거듭제곱: 2 × 2 × 2 × 2 → 2 네 개가 하나로 모이고 곱한 개수 4 가 오른쪽 위에 → = 16
  (function () {
    const id = 't71-m1-geodeup';
    const top = row(320, 100, ['2', '*', '2', '*', '2', '*', '2'], { size: 46, gap: 22 });
    const twos = [0, 2, 4, 6].map((i) => top.xs[i]);
    const BX = 250, BY = 262, BS = 80;
    const cnt = twos.map((x, k) => `<g class="p1" ${delay(.3 + k * .25)}>${text(x, 146, k + 1, { size: 22, color: C.blue })}</g>`).join('');
    const fly = twos.map((x, k) => `<g class="f2" ${delay(k * .12, `--dx:${f(x - BX)}px;--dy:${f(100 - BY)}px`)}>${text(BX, BY, 2, { size: BS })}</g>`).join('');
    const body = `<g class="s1">${top.body}</g>` + cnt
      + `<g class="s2" ${delay(.2)}>${arrow(BX, 160, BX, 192, C.muted)}</g>`
      + fly
      + `<g class="p2" ${delay(1.1)}>${text(BX + 36, BY - 38, 4, { size: 44, color: C.blue, anchor: 'start' })}</g>`
      + ring(BX + 49, BY - 54, 26, C.blue, 'r2', 1.4)
      + `<g class="s3" ${delay(.2)}>${row(BX + 90, BY, ['=', '16'], { size: 56, anchor: 'start', gap: 24 }).body}</g>`
      + pill(320, 326, '거듭제곱', C.green, { size: 26, cls: 'p3', d: .7, fill: C.mint });
    put('7-1/수학/1/거듭제곱', svg(id, body, motion(id)));
  })();

  // 밑: 3⁴ = 3 × 3 × 3 × 3 → 되풀이해 곱하는 3 → 4³ 에서는 4
  (function () {
    const id = 't71-m1-mit';
    const line = (y, b, e, n, val, cls) => {
      const items = [`${b}^${e}`, '='];
      for (let i = 0; i < n; i++) items.push(String(b), '*');
      items.pop(); items.push('=', String(val));
      const r = row(360, y, items, { size: 40, gap: 14 });
      const bx = r.xs[0] - r.ws[0] / 2 + wid(String(b), 40) / 2;
      const reps = r.xs.slice(2, 2 + 2 * n - 1).filter((_, i) => i % 2 === 0);
      return { r, bx, reps, cls };
    };
    const A = line(130, 3, 4, 4, 81), B = line(250, 4, 3, 3, 64);
    const mark = (L, y, b, beat, d0) =>
      L.reps.map((x, i) => `<g class="p${beat}" ${delay(d0 + i * .15)}>${text(x, y, b, { size: 40, color: C.orange })}</g>`).join('')
      + `<g class="p${beat}" ${delay(d0)}>${text(L.bx, y, b, { size: 40, color: C.orange })}</g>`
      + ring(L.bx, y - 15, 30, C.orange, `r${beat}`, d0 + .5)
      + `<g class="s${beat}" ${delay(d0 + .7)}>${arrow(L.bx - 74, y - 14, L.bx - 36, y - 14, C.orange)}${text(L.bx - 94, y - 4, '밑', { size: 28, color: C.orange })}</g>`;
    const body = `<g class="s1">${A.r.body}</g>` + mark(A, 130, 3, 2, .2)
      + `<g class="s3" ${delay(.1)}>${B.r.body}</g>` + mark(B, 250, 4, 3, .6);
    put('7-1/수학/1/밑', svg(id, body, motion(id)));
  })();

  // 지수: 10 을 여섯 번 곱함(1~6 세기) → 10⁶ 의 6 → = 1000000(0 이 여섯 개)
  (function () {
    const id = 't71-m1-jisu';
    const items = []; for (let i = 0; i < 6; i++) items.push('10', '*'); items.pop();
    const top = row(320, 92, items, { size: 34, gap: 12 });
    const tens = top.xs.filter((_, i) => i % 2 === 0);
    const cnt = tens.map((x, k) => `<g class="p1" ${delay(.3 + k * .18)}>${text(x, 134, k + 1, { size: 22, color: C.blue })}</g>`).join('');
    const BX = 150, BY = 282;
    const body = `<g class="s1">${top.body}</g>` + cnt
      + `<g class="s2" ${delay(.1)}>${text(BX, BY, 10, { size: 72, anchor: 'end' })}</g>`
      + `<g class="p2" ${delay(.6)}>${text(BX + 4, BY - 36, 6, { size: 46, color: C.blue, anchor: 'start' })}</g>`
      + ring(BX + 18, BY - 52, 26, C.blue, 'r2', .9)
      + `<g class="s2" ${delay(1)}>${arrow(BX + 96, BY - 96, BX + 42, BY - 74, C.blue)}${text(BX + 126, BY - 92, '지수', { size: 26, color: C.blue })}</g>`
      + `<g class="s3" ${delay(.2)}><text x="${BX + 70}" y="${BY}" font-size="58" font-weight="700" fill="${C.ink}">= 1<tspan fill="${C.blue}">000000</tspan></text></g>`
      + `<g class="k3" ${delay(.7)}><path d="M${BX + 150} ${BY + 18} H${BX + 360}" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>${text(BX + 255, BY + 50, '0이 6개', { size: 22, color: C.blue })}</g>`;
    put('7-1/수학/1/지수', svg(id, body, motion(id)));
  })();

  // 소인수: 18 의 약수(짝 지은 곱) → 그중 소수 2, 3 → 소인수
  (function () {
    const id = 't71-m1-soinsu';
    const ds = [1, 2, 3, 6, 9, 18], X = (i) => 95 + i * 90, Y = 170;
    const prime = [false, true, true, false, false, false];
    const arc = (a, b, h, d) => `<path class="draw d1" pathLength="1" ${delay(d)} d="M${X(a)} ${Y - 40} C${X(a)} ${Y - 40 - h} ${X(b)} ${Y - 40 - h} ${X(b)} ${Y - 40}" stroke="${C.muted}" stroke-width="3" fill="none"/>`;
    let body = arc(0, 5, 120, .4) + arc(1, 4, 80, .7) + arc(2, 3, 40, 1);
    ds.forEach((n, i) => {
      body += `<g class="p1" ${delay(.1 + i * .08)}><rect x="${X(i) - 36}" y="${Y - 36}" width="72" height="72" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>${text(X(i), Y + 12, n, { size: 34 })}</g>`;
      if (prime[i]) body += `<g class="p2" ${delay(.2 + i * .2)}><rect x="${X(i) - 36}" y="${Y - 36}" width="72" height="72" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/>${text(X(i), Y + 12, n, { size: 34, color: C.green })}</g>`;
      else body += `<rect class="s2" ${delay(.5)} x="${X(i) - 38}" y="${Y - 38}" width="76" height="76" rx="12" fill="${C.paper}" fill-opacity=".7"/>`;
    });
    body += `<g class="s2" ${delay(.8)}>${text(X(1), Y + 70, '소수', { size: 22, color: C.green })}${text(X(2), Y + 70, '소수', { size: 22, color: C.green })}</g>`;
    // 3칸: 2, 3 이 아래 상자로 내려온다
    const BY = 300;
    body += `<g class="s3"><rect x="${X(1) - 70}" y="${BY - 38}" width="${X(2) - X(1) + 140}" height="64" rx="14" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>`
      + `<g class="f3" ${delay(.3, `--dx:0px;--dy:${Y - BY + 12}px`)}>${text(X(1), BY + 6, 2, { size: 34, color: C.green })}</g>`
      + `<g class="f3" ${delay(.45, `--dx:0px;--dy:${Y - BY + 12}px`)}>${text(X(2), BY + 6, 3, { size: 34, color: C.green })}</g>`
      + `<g class="s3" ${delay(.6)}>${text((X(1) + X(2)) / 2, BY + 4, ',', { size: 30, color: C.green })}</g>`
      + pill(X(4) + 10, BY - 6, '18의 소인수', C.green, { size: 24, cls: 'p3', d: 1.1 });
    put('7-1/수학/1/소인수', svg(id, body, motion(id)));
  })();

  // 소인수분해: 72 를 가지로 나누어 → 끝에 남은 소수 2, 2, 2, 3, 3 → 72 = 2³ × 3²
  (function () {
    const id = 't71-m1-bunhae';
    const N = [[110, 50, 72], [70, 116, 2], [150, 116, 36], [110, 182, 2], [190, 182, 18], [150, 248, 2], [230, 248, 9], [190, 314, 3], [270, 314, 3]];
    const E = [[0, 1], [0, 2], [2, 3], [2, 4], [4, 5], [4, 6], [6, 7], [6, 8]];
    const leaf = new Set([1, 3, 5, 7, 8]);
    let body = E.map(([a, b], i) => `<path class="draw d1" pathLength="1" ${delay(.1 + Math.floor(i / 2) * .35)} d="M${N[a][0]} ${N[a][1] + 12} L${N[b][0]} ${N[b][1] - 26}" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/>`).join('');
    N.forEach(([x, y, n], i) => {
      const lv = i === 0 ? 0 : Math.ceil(i / 2);
      body += `<g class="${i ? 's1' : ''}" ${i ? delay(.3 + (lv - 1) * .35) : ''}>${text(x, y + 10, n, { size: 30 })}</g>`;
      if (leaf.has(i)) body += `<g class="p2" ${delay(.1 + i * .08)}><circle cx="${x}" cy="${y}" r="24" fill="${i > 6 ? C.peach : C.mint}" stroke="${i > 6 ? C.orange : C.green}" stroke-width="3"/>${text(x, y + 10, n, { size: 30, color: i > 6 ? C.orange : C.green })}</g>`;
    });
    const R = row(470, 150, ['72', '=', '{#green|2}', '*', '{#green|2}', '*', '{#green|2}', '*', '{#orange|3}', '*', '{#orange|3}'], { size: 28, gap: 9 });
    const R2 = row(470, 250, ['=', '{#green|2}^{#green|3}', '*', '{#orange|3}^{#orange|2}'], { size: 46, gap: 18 });
    body += `<g class="s2" ${delay(.7)}>${R.body}</g>`
      + `<g class="s3" ${delay(.1)}>${arrow(470, 172, 470, 204, C.muted)}</g>`
      + `<g class="p3" ${delay(.4)}>${R2.body}</g>`
      + pill(470, 322, '소인수분해', C.ink, { size: 24, cls: 's3', d: 1.1, fill: C.paper });
    put('7-1/수학/1/소인수분해', svg(id, body, motion(id)));
  })();

  // 서로소: 8 의 약수, 15 의 약수 두 원 → 원이 겹치면 가운데(공약수)에 1 하나뿐
  (function () {
    const id = 't71-m1-seoroso';
    const L = [235, 185], Rr = [405, 185], r = 118;
    const grp = (cx, nums, one, side, color, fill, name, nx) =>
      `<g class="mv ${side}">`
      + `<circle cx="${cx}" cy="${L[1]}" r="${r}" fill="${fill}" fill-opacity=".55" stroke="${color}" stroke-width="3.5"/>`
      + nums.map(([x, y, n]) => text(x, y, n, { size: 32 })).join('')
      + text(nx, 40, name, { size: 24, color }) + '</g>';
    const body = grp(L[0], [[180, 136, 2], [158, 198, 4], [186, 258, 8]], '', 'gl', C.blue, C.sky, '8의 약수', 200)
      + grp(Rr[0], [[460, 136, 3], [484, 198, 5], [460, 258, 15]], 'h2', 'gr', C.orange, C.peach, '15의 약수', 440)
      + `<g class="mv gl">${text(320, L[1] + 11, 1, { size: 32 })}</g><g class="mv gr one">${text(320, L[1] + 11, 1, { size: 32 })}</g>`
      + ring(320, L[1], 26, C.green, 'r2', 1.1)
      + `<g class="s2" ${delay(1.2)}>${arrow(320, 296, 320, 222, C.green)}${text(320, 328, '공약수', { size: 24, color: C.green })}</g>`
      + pill(548, 326, '서로소', C.green, { size: 28, cls: 'p3', d: .3, fill: C.mint });
    put('7-1/수학/1/서로소', svg(id, body, motion(id) + `
      .sc-${id} .gl { transform: translateX(-62px); }
      .sc-${id} .gr { transform: translateX(62px); }
      .on2 .sc-${id} .gl, .on2 .sc-${id} .gr { transform: none; transition-delay: .2s; }
      .on2 .sc-${id} .one { opacity: 0; transition: transform .9s ease-in-out .2s, opacity .3s ease 1.1s; }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
