// 2학년 1학기 4단원 길이 재기 — 단원 틀, 그림 도구, 기본 문항(본떠서 비교하기 · 여러 가지 단위 · 1 cm).
// 수집해 둔 교과서 평가 자료(미래엔·아이스크림미디어·천재)에서 뽑은 꼴 목록(기본꼴 53꼴, 심화꼴 46꼴)을 처음부터 끝까지 대조하여 실었다.
// 영역은 「도형과 측정」 가운데 측정. 성취기준은 [2수03-10] 길이 단위 1 cm와 1 m를 알고, 이를 이용하여 주변 사물의 길이를 측정할 수 있다(이 단원은 1 cm까지),
// [2수03-12] 여러 가지 물건의 길이를 어림하고, 길이에 대한 양감을 기른다.
//
// 싣는 기준
//  - 유형은 주는 것(그림·표·글), 재는 방법(본뜨기·단위 잇기·자), 묻는 것(몇 번·몇 cm·고르기·차례)이 다를 때만 나눈다. 물건이나 수만 바꾼 같은 문제는 한 번만 싣는다.
//  - 단위는 cm만 쓴다(m는 2학년 2학기, mm는 3학년). 자에는 1 cm 눈금만 긋고 12 cm 안쪽까지만 그린다.
//  - 교육과정: 「양을 비교할 때 '짧다', '많다', '넓다' 등과 같이 한글로 쓰게 하는 것은 지양한다」 → 길고 짧음, 「센티미터」 읽기, 「약」은 고르기로만 묻고 답 칸에는 숫자만 받는다.
//  - 자 없이 「제 자로 재어 보시오」 하는 꼴(①39·51·52·53, 심25·44·45·46)은 자를 함께 그려 읽게 바꾸었다. 본뜨는 꼴은 길이만큼 자른 종이띠를 칸 위에 함께 그렸다.
//  - 선 잇기(①12·24·46, 심40)와 글자를 쓰게 하는 꼴(①23·42, 심14·20)은 고르기로 바꾸었다. ①14는 까닭 쓰기를 빼고 고르기만 남겼다.
//  - 물건의 길이가 문제의 수와 어긋나 보이지 않게, 수를 마음대로 정하는 문항에는 막대·끈·색 테이프처럼 길이가 정해지지 않은 물건을 쓴다.
//  - 그림 속 눈금(두 끝이 놓인 자리)과 조각의 수는 그림 설명(aria-label)에 적는다(검사가 그 글로 답을 다시 읽는다).
//
// 뺀 것과 까닭(꼴 번호: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번)
//  - 앞 학년 되짚기: ①1(한쪽 끝을 맞춘 줄 셋 중 가장 긴 것 — 1학년 1학기 「비교하기」)
//  - 긋기·그리기·색칠하기: ①29(1·2·3 cm 막대로 7 cm 채워 색칠), ①30·심19(주어진 길이만큼 긋기), ①47(어림하여 선 긋기), 심12(설명대로 막대 색칠), 심33(벽돌을 재어 같은 길이끼리 색칠)
//  - 쓰기·서술형: ①18·심11(뼘으로 잰 수가 다른 까닭, 단위가 다르면 불편한 점 쓰기), ①32(잘못 잰 까닭 쓰기), ①20(1 cm를 바르게 쓴 손글씨 모양 고르기 — 화면 글자로는 가릴 수 없다)
//  - 정답이 하나로 정해지지 않는 것: ①45·심38(어림한 길이 쓰기 — 「더 가깝게 어림한 사람」으로 갈음)
//  - 나눗셈 얼개(3학년): ①28(8 cm를 4 cm로 몇 번), 심23(1 cm 막대로 15번인 길이를 5 cm 막대로 몇 번)
//  - 같은 수를 네 번 넘게 더하거나 합이 20을 넘는 곱셈 얼개: 심21(11 cm씩 3뼘, 10 cm씩 8번), 심22(7 cm 막대 3번), 심24(2 cm 선 10개) — 두세 번 더해 20 안쪽인 것만 실력에 실었다(h-unit-cm).
//  - 세 자리 수의 뺄셈·100 cm가 넘는 길이: 심43(120 cm보다 20 cm 더 짧게) — 두 자리 수로 낮춘 ①50은 실력에 실었다.
//  - 같은 문제: 심1(다섯 쌍을 본떠 견주기)은 copy-two를 다섯 번 하는 것이다. ①38(두 물건을 재어 더 짧은 것)은 실력의 h-longest(셋 중 가장 긴 것)와 하는 일이 같다.
//  - 그림이 필요해 미룬 꼴: 심31(삼각형의 가장 긴 변), 심37(사각형의 가장 긴 변은 약 몇 cm) — 비스듬한 변마다 자를 대어 보이는 그림이 있어야 한다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, lines, tagged, table, N, M, C } = B.kit;
  const MEASURE = '2수03-10', GUESS = '2수03-12';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수 고르기 ────────────────────────────────────────────────
  const some = (d, list, n) => d.shuffle(list).slice(0, n);
  const TAGS = ['가', '나', '다', '라'];
  // 늘어놓은 낱말의 마지막에만 토씨를 붙인다: listed(['우산', '빗자루'], '으로/로') → '우산, 빗자루로'
  const listed = (list, pair) => list.slice(0, -1).concat([josa(list[list.length - 1], pair)]).join(', ');
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  // 차례 고르기의 보기: 맞는 차례 하나와 틀린 차례 셋. musts 는 꼭 넣을 틀린 차례(흔한 잘못).
  function orderOptions(d, right, musts) {
    const wrong = [];
    for (const o of (musts || []).concat(d.shuffle(ORDERS))) if (o.join() !== right.join() && !wrong.some((w) => w.join() === o.join()) && wrong.length < 3) wrong.push(o);
    const list = d.shuffle(wrong.concat([right]));
    return { list, answer: list.findIndex((o) => o.join() === right.join()) };
  }

  // ── 그림 ────────────────────────────────────────────────────
  const fx = (n) => Math.round(n * 100) / 100;
  const INK = '#1f2933', GRID = 'stroke:#c9d6e4;stroke-width:0.8', DASH = 'stroke:#1d4ed8;stroke-width:0.8;stroke-dasharray:2.5 2';
  const PALETTE = ['#93c5fd', '#fdba74', '#86efac', '#f9a8d4', '#fde68a', '#c4b5fd'];
  const PENS = ['#2563eb', '#ea580c', '#16a34a'];
  // 그림은 휴대폰 너비(카드 안쪽 290px) 안에서 1.3배까지 키워 그린다(눈금 숫자와 조각이 잘 보이게).
  const svg = (w, h, label, body) => `<svg class="mb-geo" viewBox="0 0 ${fx(w)} ${fx(h)}" width="${Math.round(w * Math.max(1, Math.min(1.3, 286 / w)))}" role="img" aria-label="${label}">${body}</svg>`;
  const seg = (x1, y1, x2, y2, style) => `<line x1="${fx(x1)}" y1="${fx(y1)}" x2="${fx(x2)}" y2="${fx(y2)}" style="${style || GRID}"/>`;
  const slab = (x, y, w, h, fill, rx) => `<rect x="${fx(x)}" y="${fx(y)}" width="${fx(w)}" height="${fx(h)}"${rx ? ` rx="${rx}"` : ''} style="fill:${fill};stroke:${INK};stroke-width:1"/>`;
  const dot = (cx, cy, r, fill) => `<circle cx="${fx(cx)}" cy="${fx(cy)}" r="${r}" style="fill:${fill || INK}"/>`;
  const word = (x, y, text, anchor, size) => `<text class="mb-label" x="${fx(x)}" y="${fx(y)}" text-anchor="${anchor || 'middle'}" dominant-baseline="central"${size ? ` style="font-size:${size}px"` : ''}>${text}</text>`;
  // 글의 너비(13px 글씨)
  const wide = (text) => Array.from(String(text)).reduce((s, ch) => s + (ch === ' ' ? 4 : /[0-9A-Za-z]/.test(ch) ? 7.5 : 13), 0);
  const widest = (names) => Math.max.apply(null, names.map(wide).concat([0]));

  // 가로로 놓인 물건 하나. 두 끝은 x1, x2 에 꼭 맞는다. kind: 'bar'(띠·막대) | 'pencil'(연필) | 'nail'(못) | 'line'(선)
  function thing(kind, x1, x2, cy, color) {
    if (kind === 'pencil') {
      const neck = Math.max(x1 + 4, x2 - 10);
      return slab(x1, cy - 5, neck - x1, 10, color, 1.5)
        + `<path d="M${fx(neck)} ${fx(cy - 5)}L${fx(x2)} ${fx(cy)}L${fx(neck)} ${fx(cy + 5)}Z" style="fill:#fdf0d5;stroke:${INK};stroke-width:1;stroke-linejoin:round"/>`
        + `<path d="M${fx(x2 - 3.4)} ${fx(cy - 1.7)}L${fx(x2)} ${fx(cy)}L${fx(x2 - 3.4)} ${fx(cy + 1.7)}Z" style="fill:${INK}"/>`;
    }
    if (kind === 'nail') {
      return slab(x1, cy - 6, 3.2, 12, '#94a3b8', 1) + slab(x1 + 3.2, cy - 2, Math.max(2, x2 - x1 - 10.2), 4, '#cbd5e1')
        + `<path d="M${fx(x2 - 7)} ${fx(cy - 2)}L${fx(x2)} ${fx(cy)}L${fx(x2 - 7)} ${fx(cy + 2)}Z" style="fill:#cbd5e1;stroke:${INK};stroke-width:1;stroke-linejoin:round"/>`;
    }
    if (kind === 'line') return seg(x1, cy, x2, cy, `stroke:${color || '#b42318'};stroke-width:3`) + seg(x1, cy - 4, x1, cy + 4, `stroke:${INK};stroke-width:1.2`) + seg(x2, cy - 4, x2, cy + 4, `stroke:${INK};stroke-width:1.2`);
    return slab(x1, cy - 5, x2 - x1, 10, color, 2);
  }

  // 자(눈금 한 칸이 1 cm, 작은 눈금은 없다)와 그 위에 한 줄씩 놓인 물건.
  // things: [{ name, from, to, kind, color, tilt(비스듬히 놓은 각도), said(그림 설명을 바꿀 때) }] — from·to 는 눈금의 열 배(67 = 눈금 6과 7 사이에서 7에 가까운 곳).
  // o: last(자에 적는 마지막 수), first(앞쪽이 끊어진 자의 첫 수), band([a, b]: 자 위에 색칠할 두 눈금), u(1 cm의 크기), room(위쪽 여백), label(그림 설명)
  const place = (t) => { const r = ((t % 10) + 10) % 10, lo = Math.floor(t / 10); return r === 0 ? `눈금 ${lo}` : r < 5 ? `눈금 ${josa(lo, '을/를')} 조금 지난 곳` : `눈금 ${lo + 1}에 조금 못 미친 곳`; };
  function ruler(things, o) {
    const first = o.first || 0, last = o.last, left = widest(things.filter((t) => t.name).map((t) => t.name)) + 16;
    const U = o.u || Math.min(26, Math.floor((288 - left - 14) / (last - first))), x = (t) => left + (t / 10 - first) * U;
    const rowH = 17, top = 4 + (o.room || 0), yR = top + things.length * rowH + (things.length ? 2 : 0), xl = left - 9, xr = x(last * 10) + 9;
    // 자의 몸: 끊어진 자는 왼쪽 가장자리를 톱니 모양으로 그린다.
    let out = first ? `<path class="mb-ruler-body" d="M${fx(xr)} ${yR}H${fx(xl)}l4 5l-4 5l4 5l-4 5l4 5l-4 5H${fx(xr)}Z"/>` : `<rect class="mb-ruler-body" x="${fx(xl)}" y="${yR}" width="${fx(xr - xl)}" height="30" rx="2.5"/>`;
    if (o.band) out += `<rect x="${fx(x(o.band[0] * 10))}" y="${yR}" width="${fx((o.band[1] - o.band[0]) * U)}" height="13" style="fill:#f87171;opacity:0.65"/>`;
    for (let c = first; c <= last; c += 1) out += `<line class="mb-ruler-tick" x1="${fx(x(c * 10))}" y1="${yR}" x2="${fx(x(c * 10))}" y2="${yR + 13}" style="stroke-width:1"/><text class="mb-ruler-number" x="${fx(x(c * 10))}" y="${yR + 25}" text-anchor="middle">${c}</text>`;
    things.forEach((t, i) => {
      const cy = top + i * rowH + rowH / 2, x1 = x(t.from), x2 = x(t.to), color = t.color || PALETTE[i % PALETTE.length];
      if (t.name) out += word(left - 12, cy, t.name, 'end');
      if (t.tilt) { out += `<g transform="rotate(${-t.tilt} ${fx(x1)} ${fx(cy)})">${thing(t.kind, x1, x2, cy, color)}</g>`; return; }
      out += seg(x1, cy, x1, yR, DASH) + seg(x2, cy, x2, yR, DASH) + thing(t.kind, x1, x2, cy, color);
    });
    const said = (t) => (t.name ? t.name + ' — ' : '') + (t.said || `왼쪽 끝은 ${place(t.from)}, 오른쪽 끝은 ${place(t.to)}`);
    return svg(xr + 5, yR + 34, o.label || '자 위에 놓인 물건: ' + things.map(said).join(' / '), out);
  }

  // 단위 조각 하나(너비 w, 높이 12). 같은 조각을 빈틈없이 이어 그린다.
  const PIECE = {
    clip: (x, y, w) => `<rect x="${fx(x + 1)}" y="${fx(y + 1)}" width="${fx(w - 2)}" height="10" rx="5" style="fill:#fff;stroke:#475569;stroke-width:1.5"/><rect x="${fx(x + 5)}" y="${fx(y + 3.8)}" width="${fx(w - 9)}" height="4.4" rx="2.2" style="fill:none;stroke:#475569;stroke-width:1.1"/>`,
    eraser: (x, y, w) => slab(x + 0.5, y + 1, w - 1, 10, '#fecdd3', 2) + slab(x + 0.5, y + 1, (w - 1) * 0.6, 10, '#60a5fa', 2),
    stick: (x, y, w, color) => slab(x + 0.5, y + 2, w - 1, 8, color || '#fde68a', 4),
    span: (x, y, w) => `<path d="M${fx(x + 1)} ${fx(y + 11)}Q${fx(x + w / 2)} ${fx(y - 9)} ${fx(x + w - 1)} ${fx(y + 11)}" style="fill:none;stroke:#b45309;stroke-width:1.6"/>` + dot(x + 1, y + 11, 1.8, '#b45309') + dot(x + w - 1, y + 11, 1.8, '#b45309')
  };
  // 물건 밑에 단위를 이어 놓은 그림. stacks: [{ name, len(물건의 길이 px), off(왼쪽에서 띄운 거리), kind, color, rows: [{ name, kind, w(조각 하나의 너비), n, color }] }]
  function chains(stacks, label) {
    const names = [];
    stacks.forEach((s) => { if (s.name) names.push(s.name); s.rows.forEach((r) => { if (r.name) names.push(r.name); }); });
    const left = widest(names) + 12;
    let y = 6, right = 0, out = '';
    stacks.forEach((s, i) => {
      const x1 = left + (s.off || 0), x2 = x1 + s.len, bottom = y + 15 + s.rows.length * 16;
      out += seg(x1, y - 3, x1, bottom, DASH) + seg(x2, y - 3, x2, bottom, DASH) + thing(s.kind || 'bar', x1, x2, y + 6, s.color || PALETTE[i % PALETTE.length]);
      if (s.name) out += word(left - 8, y + 6, s.name, 'end');
      s.rows.forEach((r, k) => {
        const ry = y + 15 + k * 16;
        for (let j = 0; j < r.n; j += 1) out += PIECE[r.kind](x1 + j * r.w, ry, r.w, r.color);
        if (r.name) out += word(left - 8, ry + 6, r.name, 'end');
        right = Math.max(right, x1 + r.n * r.w);
      });
      right = Math.max(right, x2); y = bottom + 9;
    });
    return svg(right + 10, y - 3, label, out);
  }

  // 모눈 위에 가로로 놓은 띠. rows: [{ name, from, to, color }](칸), o: cols(가로 칸 수), u(한 칸의 크기), label
  function strips(rows, o) {
    const u = o.u || 14, left = widest(rows.map((r) => r.name)) + 12, top = 6, rh = 18, bottom = top + rows.length * rh, right = left + o.cols * u;
    let out = seg(left, top, right, top) + seg(left, bottom, right, bottom);
    for (let c = 0; c <= o.cols; c += 1) out += seg(left + c * u, top, left + c * u, bottom);
    rows.forEach((r, i) => { const cy = top + i * rh + rh / 2; out += slab(left + r.from * u, cy - 5, (r.to - r.from) * u, 10, r.color || PALETTE[i % PALETTE.length], 2) + word(left - 7, cy, r.name, 'end'); });
    return svg(right + 8, bottom + 6, o.label, out);
  }

  // 한 칸이 1 cm인 모눈과 모눈 선을 따라 그은 선. paths: [{ name, points: [[가로, 세로], …], color, ends: [왼쪽 끝 글, 오른쪽 끝 글] }], o: cols, rows, right(오른쪽 여백), label
  const pathLength = (points) => points.slice(1).reduce((sum, p, i) => sum + Math.abs(p[0] - points[i][0]) + Math.abs(p[1] - points[i][1]), 0);
  function grid(paths, o) {
    const U = 22, left = widest(paths.map((p) => (p.ends ? p.ends[0] : p.name || ''))) + 14, top = 8, right = left + o.cols * U, bottom = top + o.rows * U, at = (p) => fx(left + p[0] * U) + ',' + fx(top + p[1] * U);
    let out = '';
    for (let c = 0; c <= o.cols; c += 1) out += seg(left + c * U, top, left + c * U, bottom);
    for (let r = 0; r <= o.rows; r += 1) out += seg(left, top + r * U, right, top + r * U);
    // 한 칸의 길이: 모눈 아래 첫 칸에 「1 cm」라고 적는다.
    out += `<path d="M${left} ${bottom + 4}v5h${U}v-5" style="fill:none;stroke:${INK};stroke-width:1"/>` + word(left + U + 5, bottom + 9, '1 cm', 'start', 12);
    paths.forEach((p, i) => {
      const a = p.points[0], z = p.points[p.points.length - 1];
      out += `<polyline points="${p.points.map(at).join(' ')}" style="fill:none;stroke:${p.color || PENS[i % PENS.length]};stroke-width:3.6;stroke-linejoin:round"/>`;
      if (p.ends) out += dot(left + a[0] * U, top + a[1] * U, 4) + dot(left + z[0] * U, top + z[1] * U, 4) + word(left + a[0] * U - 8, top + a[1] * U, p.ends[0], 'end') + word(left + z[0] * U + 8, top + z[1] * U, p.ends[1], 'start');
      else if (p.name) out += word(left - 8, top + a[1] * U, p.name, 'end');
    });
    return svg(right + (o.right || 10), bottom + 18, o.label, out);
  }

  // 방향이 서로 다른 선 셋. turn[i]: i번째 선의 자리(0 가로, 1 세로, 2 비스듬히)
  function threeLines(lens, turn, u) {
    const SAY = ['가로로', '세로로', '비스듬히'];
    let out = '';
    lens.forEach((len, i) => {
      const L = len * u, style = `stroke:${PENS[i]};stroke-width:4`;
      if (turn[i] === 0) out += seg(10, 34, 10 + L, 34, style) + word(10 + L / 2, 20, TAGS[i]);
      else if (turn[i] === 1) out += seg(134, 8, 134, 8 + L, style) + word(121, 8 + L / 2, TAGS[i]);
      else { const x2 = 158 + L * 0.819, y2 = 108 - L * 0.574; out += seg(158, 108, x2, y2, style) + word((158 + x2) / 2 + 9, (108 + y2) / 2 + 11, TAGS[i]); }
    });
    return svg(250, 116, '방향이 다른 선 셋: ' + lens.map((_, i) => `${TAGS[i]}는 ${SAY[turn[i]]}`).join(', ') + ' 놓였다', out);
  }
  // 집에서 세 곳까지 곧게 이은 선(방향이 서로 다르다)
  function mapLines(places, lens, u) {
    const cx = 122, cy = 100, DIR = [[-0.906, -0.423], [0.574, -0.819], [0.94, 0.342]];
    let out = '';
    places.forEach((p, i) => {
      const L = lens[i] * u, x2 = cx + DIR[i][0] * L, y2 = cy + DIR[i][1] * L;
      out += seg(cx, cy, x2, y2, `stroke:${PENS[i]};stroke-width:3.6`) + dot(x2, y2, 4) + (i === 0 ? word(x2, y2 - 13, p) : word(x2 + 8, y2, p, 'start'));
    });
    return svg(272, 150, `집에서 세 곳까지 곧게 이은 선: ${places.join(', ')}(방향이 서로 다르다)`, out + dot(cx, cy, 4.5) + word(cx - 4, cy + 15, '집'));
  }
  // 긴 쪽과 짧은 쪽이 있는 물건: 위쪽이 ㉠, 왼쪽이 ㉡
  function frame(what, a, b, u) {
    const left = 28, top = 24, w = a * u, h = b * u;
    return svg(left + w + 12, top + h + 10, `${what}: 위쪽이 ㉠, 왼쪽이 ㉡`,
      slab(left, top, w, h, '#fff8e1') + slab(left + 7, top + 7, w - 14, h - 14, '#fff')
      + seg(left, top, left + w, top, `stroke:${PENS[0]};stroke-width:4`) + seg(left, top, left, top + h, `stroke:${PENS[1]};stroke-width:4`)
      + word(left + w / 2, top - 12, '㉠') + word(left - 14, top + h / 2, '㉡'));
  }
  // 연결큐브를 한 줄로 이은 것 셋: 둘은 가로로(왼쪽 끝을 달리하여), 하나는 세로로 놓는다.
  function cubeRows(counts, offs, upright, label) {
    const c = 15, left = 24, colX = left + 9 * c + 40;
    const cube = (x, y, fill) => slab(x, y, c, c, fill) + `<circle cx="${fx(x + c / 2)}" cy="${fx(y + c / 2)}" r="2.6" style="fill:#fff;stroke:${INK};stroke-width:0.8"/>`;
    let out = '', row = 0;
    counts.forEach((n, i) => {
      if (i === upright) { for (let k = 0; k < n; k += 1) out += cube(colX, 8 + k * c, PALETTE[i]); out += word(colX - 13, 8 + n * c / 2, TAGS[i]); return; }
      const y = 24 + row * 48; row += 1;
      for (let k = 0; k < n; k += 1) out += cube(left + (offs[i] + k) * c, y, PALETTE[i]);
      out += word(left - 12, y + c / 2, TAGS[i]);
    });
    return svg(colX + c + 12, 8 + 7 * c + 8, label, out);
  }

  // 다른 파일(2-1-4b.js)에서도 쓴다.
  B.kit.g214 = { MEASURE, GUESS, some, TAGS, listed, ORDERS, orderOptions, PALETTE, ruler, place, chains, strips, grid, pathLength };

  // ── 물건들 ───────────────────────────────────────────────────
  // 겪어 보아 아는 길이. 같은 줄의 것끼리는 견주지 않는다.
  const TINY = ['클립', '지우개', '머리핀', '공깃돌'];
  const LONG = ['우산', '빗자루', '지팡이', '야구 방망이'];
  const STICKS = ['빨간 막대', '파란 막대', '노란 막대', '초록 막대'];
  const ROPES = ['빨간 끈', '파란 끈', '노란 끈', '초록 끈'];
  // 몸과 물건으로 삼는 단위: 뒤로 갈수록 길다.
  const UNITS = ['엄지손톱의 너비', '클립', '뼘', '걸음', '양팔을 벌린 길이'];

  B.addUnit({
    id: '2-1-4', grade: 2, semester: 1, no: 4, title: '길이 재기', version: 1,
    groups: [
      {
        id: 'copy', title: '종이띠로 길이 비교하기', standard: MEASURE,
        types: [
          T('copy-method', '본떠서 비교해야 하는 것 고르기', '①4', (d) => {
            const what = d.pick(['창문', '책상', '칠판', '냉장고']), apart = `${what}의 긴 쪽과 짧은 쪽`;
            const list = d.shuffle(some(d, ['연필과 볼펜', '숟가락과 젓가락', '색연필과 크레파스', '빨대와 붓', '칫솔과 빗'], 3).concat([apart]));
            return C('두 길이를 비교하려고 한다. 직접 맞대어 볼 수 없어서 종이띠를 이용해야 하는 것은?', list.map((v) => v + '의 길이'), list.indexOf(apart), {
              explain: `${what}의 긴 쪽과 짧은 쪽은 옮겨서 맞대어 볼 수 없다. 길이만큼 종이띠를 자른 다음 종이띠끼리 맞대어 비교한다.`, facts: { truth: list.map((v) => v === apart), want: true }
            });
          }),
          T('copy-two', '본뜬 종이띠로 두 길이 비교하기', '①2 심1', (d) => {
            const what = d.pick(['창문', '액자', '게시판', '거울']), s = d.int(4, 6), lens = d.shuffle([s, s + 1]), longer = d.bool(), u = 14, want = lens.indexOf(longer ? s + 1 : s);
            return C(`${what}의 ㉠과 ㉡의 길이만큼 종이띠를 잘라 나란히 놓았다. 더 ${longer ? '긴' : '짧은'} 쪽은?`, ['㉠', '㉡'], want, {
              figure: frame(what, lens[0], lens[1], u) + strips([{ name: '㉠', from: 0, to: lens[0], color: PALETTE[0] }, { name: '㉡', from: 0, to: lens[1], color: PALETTE[1] }], { cols: 8, u, label: `길이만큼 자른 종이띠: ㉠ ${lens[0]}칸, ㉡ ${lens[1]}칸` }),
              explain: `종이띠의 왼쪽 끝을 맞추었으므로 오른쪽 끝을 비교한다. ㉠의 종이띠는 ${lens[0]}칸, ㉡의 종이띠는 ${lens[1]}칸이다. ${['㉠', '㉡'][want]}이 더 ${longer ? '길다' : '짧다'}.`,
              facts: { choose: { exprs: lens.map(String), rule: longer ? 'max' : 'min' } }
            });
          }),
          T('copy-three', '본뜬 종이띠로 세 길이의 차례 정하기', '①3', (d) => {
            const s = d.int(4, 5), lens = d.shuffle([s, s + 1, s + 2]), turn = d.shuffle([0, 1, 2]), u = 14;
            const right = [0, 1, 2].sort((p, q) => lens[q] - lens[p]), opt = orderOptions(d, right);
            return C('방향이 다른 선 가, 나, 다의 길이만큼 종이띠를 잘라 나란히 놓았다. 긴 선부터 차례로 쓴 것은?', opt.list.map((o) => o.map((i) => TAGS[i]).join(', ')), opt.answer, {
              figure: threeLines(lens, turn, u) + strips(lens.map((len, i) => ({ name: TAGS[i], from: 0, to: len, color: PALETTE[i] })), { cols: 8, u, label: '길이만큼 자른 종이띠: ' + lens.map((len, i) => `${TAGS[i]} ${len}칸`).join(', ') }),
              explain: `종이띠의 왼쪽 끝을 맞추었으므로 오른쪽 끝을 비교한다. 종이띠는 ${lens.map((len, i) => `${TAGS[i]} ${len}칸`).join(', ')}이다. 긴 것부터 쓰면 ${right.map((i) => TAGS[i]).join(', ')}이다.`,
              facts: { choose: { exprs: lens.map(String), rule: 'descending', orders: opt.list } }
            });
          }),
          T('copy-map', '본떠서 가장 가까운 곳 찾기', '①5 심32', (d) => {
            const places = some(d, ['학교', '병원', '도서관', '놀이터', '공원', '우체국'], 3), s = d.int(4, 5), lens = d.shuffle([s, s + 1, s + 2]), u = 14, near = d.bool(), want = lens.indexOf(near ? s : s + 2);
            return C(`집에서 세 곳까지 곧게 이은 선의 길이만큼 종이띠를 잘라 나란히 놓았다. 집에서 가장 ${near ? '가까운' : '먼'} 곳은?`, places, want, {
              figure: mapLines(places, lens, u) + strips(lens.map((len, i) => ({ name: places[i], from: 0, to: len, color: PALETTE[i] })), { cols: 8, u, label: '길이만큼 자른 종이띠: ' + lens.map((len, i) => `${places[i]} ${len}칸`).join(', ') }),
              explain: `종이띠는 ${lens.map((len, i) => `${places[i]} ${len}칸`).join(', ')}이다. 종이띠가 가장 ${near ? '짧은' : '긴'} ${places[want]}까지가 가장 ${near ? '가깝다' : '멀다'}.`,
              facts: { choose: { exprs: lens.map(String), rule: near ? 'min' : 'max' } }
            });
          })
        ]
      },
      {
        id: 'unit', title: '여러 가지 단위로 길이 재기', standard: MEASURE,
        types: [
          T('unit-count', '이어 놓은 단위를 세어 길이 재기', '①6 심2', (d) => {
            // [잴 것, 그림 속 이름, 물건 모양, 단위, 조각 모양, 조각 너비, 가장 많은 횟수]
            const [what, shown, kind, unit, piece, w, most] = d.pick([['연필', '연필', 'pencil', '클립', 'clip', 24, 7], ['칫솔', '칫솔', 'bar', '클립', 'clip', 24, 7], ['붓', '붓', 'bar', '지우개', 'eraser', 28, 6], ['책상의 긴 쪽', '책상', 'bar', '뼘', 'span', 36, 5]]);
            const n = d.int(3, most), each = unit === '뼘' ? '번' : '개';
            return N(`${what}의 길이는 ${josa(unit, '으로/로')} 몇 번인가?`, n, {
              unit: '번', figure: chains([{ name: shown, len: n * w, kind, rows: [{ name: unit, kind: piece, w, n }] }], `${shown} 밑에 ${unit} ${n}${each === '개' ? '개를' : '번을'} 빈틈없이 이어 놓았다. 두 끝이 꼭 맞는다`),
              explain: `${josa(unit, '을/를')} 세면 ${n}${each}이다. ${what}의 길이는 ${josa(unit, '으로/로')} ${n}번이다.`, facts: { calc: [[String(n), 0]] }
            });
          }),
          T('unit-about', '「몇 번쯤」인지 고르기', '①7 심2', (d) => {
            const [what, unit, piece, w] = d.pick([['칫솔', '클립', 'clip', 30], ['숟가락', '지우개', 'eraser', 32], ['빨대', '클립', 'clip', 30]]);
            const n = d.int(3, 5), over = d.bool(), reach = n + (over ? 0.25 : 0.8), k = over ? n : n + 1, start = Math.max(2, k - d.int(0, 3)), list = [0, 1, 2, 3].map((i) => start + i);
            return C(`${what}의 길이는 ${josa(unit, '으로/로')} 몇 번쯤인가?`, list.map((v) => `${v}번쯤`), list.indexOf(k), {
              figure: chains([{ name: what, len: reach * w, rows: [{ name: unit, kind: piece, w, n: n + 1 }] }], `${what} 밑에 ${unit} ${n + 1}개를 빈틈없이 이어 놓았다. ${what}의 오른쪽 끝은 ${over ? `${unit} ${n}개를 조금 지난 곳` : `${unit} ${n + 1}개에 조금 못 미친 곳`}`),
              explain: `${what}의 오른쪽 끝은 ${unit} ${k}개가 끝나는 곳에 가장 가깝다. ${josa(unit, '으로/로')} ${k}번쯤이다.`, facts: { choose: { exprs: list.map(String), rule: 'nearest', target: reach } }
            });
          }),
          T('unit-two', '한 물건을 두 가지 단위로 재기', '①8', (d) => {
            const [big, small, piece] = d.pick([['풀', '클립', 'clip'], ['볼펜', '지우개', 'eraser'], ['크레파스', '클립', 'clip']]), [p, q] = d.pick([[2, 4], [2, 6], [3, 6], [2, 8], [4, 8], [3, 9]]), w = 20;
            return M(`색 테이프의 길이를 ${josa(big, '과/와')} ${josa(small, '으로/로')} 재었다. 색 테이프의 길이는 각각 몇 번인가?`, [{ label: big, answer: p, unit: '번' }, { label: small, answer: q, unit: '번' }], {
              figure: chains([{ name: '색 테이프', len: q * w, rows: [{ name: big, kind: 'stick', w: q * w / p, n: p, color: '#fde68a' }, { name: small, kind: piece, w, n: q }] }], `색 테이프 밑에 ${big} ${p}개, 그 밑에 ${small} ${q}개를 빈틈없이 이어 놓았다. 두 끝이 꼭 맞는다`),
              explain: `${josa(big, '은/는')} ${p}개, ${josa(small, '은/는')} ${q}개를 이어 놓았다. ${josa(big, '으로/로')} ${p}번, ${josa(small, '으로/로')} ${q}번이다.`, facts: { calc: [[String(p), 0], [String(q), 1]] }
            });
          }),
          T('unit-find', '잰 횟수가 주어진 수인 것 찾기', '①9', (d) => {
            const s = d.int(2, 4), counts = d.shuffle([s, s + 1, s + 2]), k = d.pick(counts), w = 22;
            return C(`길이가 클립으로 ${k}번인 색 테이프는?`, TAGS.slice(0, 3), counts.indexOf(k), {
              figure: chains(counts.map((n, i) => ({ name: TAGS[i], len: n * w, off: d.int(0, 2) * 11, rows: [{ kind: 'clip', w, n }] })), '색 테이프 밑에 클립을 빈틈없이 이어 놓았다: ' + counts.map((n, i) => `${TAGS[i]} 클립 ${n}개`).join(', ')),
              explain: `클립을 세면 ${counts.map((n, i) => `${TAGS[i]} ${n}개`).join(', ')}이다. 클립으로 ${k}번인 것은 ${TAGS[counts.indexOf(k)]}이다.`, facts: { choose: { exprs: counts.map(String), rule: 'equals', target: k } }
            });
          }),
          T('unit-cubes', '연결큐브의 수로 길이 비교하기', '①10 심7', (d) => {
            const s = d.int(4, 5), counts = d.shuffle([s, s + 1, s + 2]), long = d.bool(), want = counts.indexOf(long ? s + 2 : s);
            return C(`똑같은 연결큐브를 한 줄로 이었다. 가장 ${long ? '길게' : '짧게'} 이은 것은?`, TAGS.slice(0, 3), want, {
              figure: cubeRows(counts, counts.map(() => d.int(0, 2)), d.int(0, 2), '연결큐브를 한 줄로 이은 것: ' + counts.map((n, i) => `${TAGS[i]} ${n}개`).join(', ')),
              explain: `연결큐브의 수를 세면 ${counts.map((n, i) => `${TAGS[i]} ${n}개`).join(', ')}이다. 연결큐브의 수가 가장 ${long ? '많은' : '적은'} ${TAGS[want]}가 가장 ${long ? '길다' : '짧다'}.`,
              facts: { choose: { exprs: counts.map(String), rule: long ? 'max' : 'min' } }
            });
          }),
          T('unit-move', '단위 하나를 옮겨 가며 재기', '심3', (d) => {
            const w = d.int(2, 3), n = d.int(3, w === 2 ? 5 : 4), L = w * n;
            return N('지우개를 옮겨 가며 연필의 길이를 재려고 한다. 연필의 길이는 지우개로 몇 번인가?', n, {
              unit: '번', figure: strips([{ name: '연필', from: 0, to: L, color: PALETTE[4] }, { name: '지우개', from: 0, to: w, color: PALETTE[3] }], { cols: L + 1, u: 16, label: `모눈 위에 놓인 물건의 길이: 연필 ${L}칸, 지우개 ${w}칸` }),
              explain: `지우개의 길이는 ${w}칸이다. 연필 ${L}칸은 ${w}칸씩 ${n}번이므로 지우개로 ${n}번이다.`, facts: { calc: [[`${L}/${w}`, 0]] }
            });
          }),
          T('unit-size', '단위의 길이 비교하기', '①11 심4', (d) => {
            const picks = d.shuffle([0, 1, 2, 3, 4]).slice(0, 4), long = d.bool(), best = long ? Math.max(...picks) : Math.min(...picks);
            return C(`길이를 재는 단위로 쓰려고 한다. 길이가 가장 ${long ? '긴' : '짧은'} 것은?`, picks.map((i) => UNITS[i]), picks.indexOf(best), {
              explain: `넷 가운데 ${josa(UNITS[best], '이/가')} 가장 ${long ? '길다' : '짧다'}.`, facts: { rank: { values: picks, nth: long ? 1 : 4 } }
            });
          }),
          T('unit-fit', '잴 것에 알맞은 단위 고르기', '①12·14 심5', (d, n) => {
            if (n === 0) {
              // 긴 것을 잴 때: 너무 짧은 단위로는 아주 여러 번 재어야 한다(잴 것보다 긴 단위는 쓸 수 없다는 것은 unit-can 이 묻는다).
              const what = d.pick(['운동장의 긴 쪽', '교실의 긴 쪽', '복도']), fit = '걸음', list = d.shuffle(['클립', '엄지손톱의 너비', '지우개', fit]);
              return C(`${what}의 길이를 재려고 한다. 단위로 쓰기에 가장 알맞은 것은?`, list, list.indexOf(fit), {
                explain: `${josa(what, '은/는')} 길다. 클립, 엄지손톱의 너비, 지우개는 너무 짧아서 아주 여러 번 재어야 한다. 걸음이 알맞다.`,
                facts: { truth: list.map((v) => v === fit), want: true }
              });
            }
            // 단위 → 잴 것
            const far = d.bool(), unit = far ? '걸음' : '클립', fit = far ? d.pick(['운동장의 긴 쪽', '복도']) : d.pick(['연필', '필통']);
            const list = d.shuffle((far ? ['지우개', '연필', '수학책의 짧은 쪽'] : ['운동장의 긴 쪽', '복도', '교실의 긴 쪽']).concat([fit]));
            return C(`${josa(unit, '으로/로')} 길이를 재기에 가장 알맞은 것은?`, list.map((v) => v + '의 길이'), list.indexOf(fit), {
              explain: far ? `걸음은 지우개, 연필, 수학책의 짧은 쪽보다 길어서 이것들을 잴 수 없다. ${fit}의 길이를 재기에 알맞다.` : `클립은 짧아서 운동장, 복도, 교실처럼 긴 것은 아주 여러 번 재어야 한다. ${fit}의 길이를 재기에 알맞다.`,
              facts: { truth: list.map((v) => v === fit), want: true }
            });
          }, { count: 2 }),
          T('unit-can', '단위로 쓸 수 있는 것 모두 고르기', '①13 심5', (d) => {
            const what = d.pick(['수학책의 짧은 쪽', '공책의 짧은 쪽', '필통']), rows = d.shuffle(some(d, TINY, 2).map((v) => [v, true]).concat(some(d, LONG, 2).map((v) => [v, false])));
            const flags = rows.map(([, ok]) => ok), right = LABELS.filter((_, i) => flags[i]), all = [];
            for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) all.push([LABELS[i], LABELS[j]]);
            const sets = d.shuffle(d.shuffle(all.filter((p) => p.join() !== right.join())).slice(0, 3).concat([right]));
            return C(`${what}의 길이를 재려고 한다. 단위로 쓸 수 있는 것을 모두 고른 것은?`, sets.map((p) => p.join(', ')), sets.findIndex((p) => p.join() === right.join()), {
              figure: tagged(rows.map(([v]) => v)),
              explain: `${what}보다 긴 ${listed(rows.filter(([, ok]) => !ok).map(([v]) => v), '으로/로')}는 잴 수 없다. ${what}보다 짧은 ${listed(rows.filter(([, ok]) => ok).map(([v]) => v), '으로/로')} 잴 수 있다.`,
              facts: { sets: { labels: LABELS.slice(), flags, options: sets } }
            });
          }),
          T('unit-same', '같은 단위로 잰 횟수로 길이 비교하기', '①15 심6', (d) => {
            const who = d.pick(NAMES), ropes = some(d, ROPES, 3), s = d.int(4, 7), counts = d.shuffle([s, s + 1, s + 3]), long = d.bool(), want = counts.indexOf(long ? s + 3 : s);
            return C(`${nick(who)}의 뼘으로 끈의 길이를 재었다. ${ropes.map((r, i) => `${josa(r, '은/는')} ${counts[i]}번`).join(', ')}이다. 가장 ${long ? '긴' : '짧은'} 끈은?`, ropes, want, {
              explain: `같은 뼘으로 재었으므로 잰 횟수가 많을수록 길다. ${counts[want]}번인 ${josa(ropes[want], '이/가')} 가장 ${long ? '길다' : '짧다'}.`, facts: { choose: { exprs: counts.map(String), rule: long ? 'max' : 'min' } }
            });
          }),
          T('unit-table', '같은 길이를 잰 횟수로 단위의 길이 비교하기', '①16 심9', (d) => {
            const what = d.pick(['책상의 긴 쪽', '칠판의 짧은 쪽', '식탁의 긴 쪽']), things = some(d, STICKS, 3), s = d.int(5, 9), counts = d.shuffle([s, s + 1, s + 2]), long = d.bool(), want = counts.indexOf(long ? s : s + 2);
            return C(`${what}의 길이를 세 가지 막대로 재었다. 길이가 가장 ${long ? '긴' : '짧은'} 막대는?`, things, want, {
              figure: table(['막대', '잰 횟수'], things.map((t, i) => [t, `${counts[i]}번`])),
              explain: `같은 길이를 잴 때 막대가 길수록 잰 횟수가 적다. 잰 횟수가 가장 ${long ? '적은' : '많은'} ${josa(things[want], '이/가')} 가장 ${long ? '길다' : '짧다'}.`,
              facts: { choose: { exprs: counts.map(String), rule: long ? 'min' : 'max' } }
            });
          }),
          T('unit-rule', '단위의 길이로 잰 횟수 비교하기', '①16 심10', (d) => {
            const who = some(d, NAMES, 3), s = d.int(2, 4), lens = d.shuffle([s, s + 1, s + 2]), offs = lens.map((len) => d.int(0, 8 - len)), few = d.bool(), want = lens.indexOf(few ? s + 2 : s);
            return C(`세 사람이 각자 가진 막대로 같은 책상의 긴 쪽을 재려고 한다. 잰 횟수가 가장 ${few ? '적은' : '많은'} 사람은?`, who, want, {
              figure: strips(who.map((w, i) => ({ name: w, from: offs[i], to: offs[i] + lens[i] })), { cols: 8, u: 18, label: '세 사람이 가진 막대의 길이: ' + who.map((w, i) => `${w} ${lens[i]}칸`).join(', ') }),
              explain: `막대의 길이는 ${who.map((w, i) => `${w} ${lens[i]}칸`).join(', ')}이다. 막대가 길수록 잰 횟수가 적으므로, 막대가 가장 ${few ? '긴' : '짧은'} ${name(who[want], '이/가')} 잰 횟수가 가장 ${few ? '적다' : '많다'}.`,
              facts: { choose: { exprs: lens.map(String), rule: few ? 'max' : 'min' } }
            });
          }),
          T('unit-samecount', '잰 횟수가 같을 때 길이 비교하기', '①17 심8', (d) => {
            const who = some(d, NAMES, 3), order = d.shuffle([0, 1, 2]), things = [d.pick(['클립', '지우개', '머리핀']), d.pick(['색연필', '숟가락', '볼펜']), d.pick(['우산', '빗자루', '지팡이'])], n = d.int(5, 9), long = d.bool(), want = order.indexOf(long ? 2 : 0);
            return C(`${who.map((w, i) => `${name(w, '은/는')} ${josa(things[order[i]], '으로/로')}`).join(', ')} ${n}번씩 재어 끈을 잘랐다. 가장 ${long ? '긴' : '짧은'} 끈을 가진 사람은?`, who, want, {
              explain: `잰 횟수가 같으면 단위가 길수록 끈이 길다. 가장 ${long ? '긴' : '짧은'} ${josa(things[order[want]], '으로/로')} 잰 ${nick(who[want])}의 끈이 가장 ${long ? '길다' : '짧다'}.`,
              facts: { rank: { values: order, nth: long ? 1 : 3 } }
            });
          }),
          T('unit-exact', '길이를 정확하게 나타낸 것 고르기', '①19', (d) => {
            const cm = d.int(5, 9) * 10 + d.int(1, 9), rows = d.shuffle([[`${cm} cm`, true], [`뼘으로 ${d.int(4, 6)}번`, false], [`걸음으로 ${d.int(2, 3)}번`, false], [`연필로 ${d.int(4, 7)}번`, false]]);
            return C('책상의 긴 쪽의 길이를 네 가지 방법으로 나타내었다. 누가 재어도 똑같이 나타나는 것은?', rows.map(([v]) => v), rows.findIndex(([, ok]) => ok), {
              explain: `뼘, 걸음, 연필의 길이는 사람마다 물건마다 달라서 잰 횟수가 달라질 수 있다. 1 cm는 누가 재어도 길이가 같으므로 ${cm} cm는 누가 재어도 똑같다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          })
        ]
      },
      {
        id: 'cm', title: '1 cm 알기', standard: MEASURE,
        types: [
          T('cm-tick', '자의 눈금 한 칸의 길이', '①21', (d) => {
            const a = d.int(1, 5);
            return N('자에서 색칠한 한 칸의 길이는 몇 cm인가?', 1, {
              unit: 'cm', figure: ruler([], { last: 7, band: [a, a + 1], label: `자: 눈금 ${josa(a, '과/와')} 눈금 ${a + 1} 사이 한 칸을 색칠` }),
              explain: `자에서 숫자가 적힌 눈금 한 칸의 길이는 1 cm이다. 눈금 ${josa(a, '과/와')} ${a + 1} 사이도 1 cm이다.`, facts: { calc: [[`${a + 1}-${a}`, 0]] }
            });
          }),
          T('cm-cells', '1 cm가 몇 번인지 세어 길이 구하기', '①22', (d) => {
            const n = d.int(3, 9), U = 26, left = 12, top = 26;
            let out = `<path d="M${left} ${top - 3}v-5h${U}v5" style="fill:none;stroke:${INK};stroke-width:1"/>` + word(left + U / 2, 8, '1 cm', 'middle', 12);
            for (let i = 0; i < n; i += 1) out += slab(left + i * U, top, U, 16, PALETTE[i % 2 ? 4 : 0]);
            return N('한 칸의 길이가 1 cm인 색 테이프이다. 색 테이프의 길이는 몇 cm인가?', n, {
              unit: 'cm', figure: svg(left * 2 + n * U, top + 24, `색 테이프: 1 cm인 칸 ${n}개를 이어 붙였다`, out),
              explain: `1 cm가 ${n}번이므로 ${n} cm이다.`, facts: { calc: [[String(n), 0]] }
            });
          }),
          T('cm-read', '길이를 바르게 읽은 것 고르기', '①23·24 심14', (d) => {
            const n = d.int(2, 19), rows = d.shuffle([[`${n} 센티미터`, true], [`${n} 센치미터`, false], [`${n} 미터`, false], [`${n} 씨엠`, false]]);
            return C(`${n} cm를 바르게 읽은 것은?`, rows.map(([v]) => v), rows.findIndex(([, ok]) => ok), {
              explain: `cm는 센티미터라고 읽는다. ${n} cm는 ${n} 센티미터이다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('cm-times', '「1 cm가 몇 번」과 「몇 cm」', '①25 심15', (d) => {
            const [a, b] = d.until(() => [d.int(5, 28), d.int(5, 28)], ([x, y]) => x !== y);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }], {
              figure: lines([`${a} cm는 1 cm가 ㉠번이다.`, `1 cm가 ${b}번이면 ㉡ cm이다.`]),
              explain: `${a} cm는 1 cm가 ${a}번이고, 1 cm가 ${b}번이면 ${b} cm이다.`, facts: { calc: [[String(a), 0], [String(b), 1]] }
            });
          }),
          T('cm-odd', '나타내는 길이가 다른 하나 찾기', '①26 심17', (d) => {
            const a = d.int(4, 9), b = d.pick([a + 10, a + 1, a - 1]), forms = d.shuffle([(v) => `${v} cm`, (v) => `1 cm가 ${v}번인 길이`, (v) => `${v} 센티미터`]), odd = d.int(0, 2), values = [0, 1, 2].map((i) => (i === odd ? b : a));
            return C('나타내는 길이가 나머지와 다른 하나는?', LABELS.slice(0, 3), odd, {
              figure: tagged(values.map((v, i) => forms[i](v))),
              explain: `모두 cm로 나타내면 ${values.map((v, i) => `${LABELS[i]} ${v} cm`).join(', ')}이다. 다른 하나는 ${LABELS[odd]}이다.`, facts: { choose: { exprs: values.map(String), rule: 'odd' } }
            });
          }),
          T('cm-compare', '여러 가지로 나타낸 길이 비교하기', '①27 심18', (d) => {
            const s = d.int(5, 12), values = d.shuffle([s, s + 1, s + 2, s + 3]), forms = d.shuffle([(v) => `${v} cm`, (v) => `1 cm가 ${v}번인 길이`, (v) => `${v} 센티미터`, (v) => `1 cm가 ${v}번인 길이`]), long = d.bool(), want = values.indexOf(long ? s + 3 : s);
            return C(`길이가 가장 ${long ? '긴' : '짧은'} 것은?`, LABELS.slice(), want, {
              figure: tagged(values.map((v, i) => forms[i](v))),
              explain: `모두 cm로 나타내면 ${values.map((v, i) => `${LABELS[i]} ${v} cm`).join(', ')}이다. 가장 ${long ? '긴' : '짧은'} 것은 ${LABELS[want]}이다.`, facts: { choose: { exprs: values.map(String), rule: long ? 'max' : 'min' } }
            });
          }),
          T('cm-grid', '모눈 위에 그은 길의 길이', '심20', (d) => {
            // 모눈 선을 따라 두 번 꺾인 길: 오른쪽으로 가다가 위아래로 꺾고, 다시 오른쪽으로 간다.
            const cols = 7, x1 = d.int(1, 3), x2 = d.int(x1 + 2, 6), [y0, y1, y2] = d.until(() => [d.int(0, 3), d.int(0, 3), d.int(0, 3)], ([p, q, r]) => p !== q && q !== r);
            const points = [[0, y0], [x1, y0], [x1, y1], [x2, y1], [x2, y2], [cols, y2]], n = pathLength(points);
            return N('그림에서 한 칸의 길이는 1 cm이다. 집에서 학교까지 가는 길의 길이는 몇 cm인가?', n, {
              unit: 'cm', figure: grid([{ points, ends: ['집', '학교'], color: '#ea580c' }], { cols, rows: 3, right: 40, label: `한 칸이 1 cm인 모눈 위에 그은 길: 집에서 학교까지 모눈 ${n}칸` }),
              explain: `길을 따라 1 cm인 칸을 세면 ${n}번이다. 길의 길이는 ${n} cm이다.`, facts: { calc: [[String(n), 0]] }
            });
          })
        ]
      },
      { id: 'ruler', title: '자로 길이 재기', standard: MEASURE, types: [] },
      { id: 'about', title: '약 몇 cm로 나타내기', standard: MEASURE, types: [] },
      { id: 'guess', title: '길이 어림하기', standard: GUESS, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
