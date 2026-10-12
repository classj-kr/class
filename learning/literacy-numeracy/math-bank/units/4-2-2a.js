// 4학년 2학기 2단원 사각형 — 단원 틀과 기본 문항(수직과 수선, 평행과 평행선, 평행선 사이의 거리, 사다리꼴).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 94·106·91꼴, 심화꼴 102꼴)을 번호마다 따져,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 보고 실었다.
// (평행사변형, 마름모, 여러 가지 사각형의 기본 문항과 실력 문항은 4-2-2b.js에 있다. 대조표는 수집본의 _분석/4-2-2/싣기_대조표.md)
//
// 싣는 기준
//  - 주는 것(글·그림의 얼개), 묻는 것, 푸는 길이 다르면 다른 문제다. 수만 다르거나 상황만 다른 것은 한 번만 싣는다.
//  - 직선·도형은 모눈의 점을 지나는 방향으로만 그려 수직(내적 0)·평행(외적 0)을 정수 셈으로 가린다.
//    수직이 아닌 각은 76°~104° 사이에 두지 않고, 평행하지 않은 두 직선은 14° 넘게 벌린다.
//  - 수직으로 만나는 곳에는 직각 표시를 한다. 평행은 글로 밝히거나(모눈 위에서는) 칸을 세어 알 수 있게 한다. 평행 화살표는 쓰지 않는다.
//  - 길이를 적은 그림은 적힌 수대로 그린다(비스듬한 선분은 수직인 선분과 직각삼각형을 이루는 길이: 12·13·15, 24·25·26 …).
//
// 뺀 것과 까닭
//  - 긋기·그리기·재기·표시하기(①3·14·26·32·34·41·45·46 ②11·12·15·29·30·34·36·42·43·50~53 ③5·12·24·30·37·47·48 심9·19·22·39):
//    작도와 자로 재기는 화면에서 할 수 없다. 고르기로 바꿀 수 있는 것(수선이 되는 점, 거리에 맞게 그은 평행선, 사다리꼴이 되는 점)은 바꾸어 실었다.
//  - 까닭·말로 쓰기(①15·27 ②14 심8·16·37), 각도기로 수선 긋는 차례(①10)·평행선 긋는 차례(②28): 서술형·작도 절차
//  - 삼각자 둘을 대고 평행선을 그은 그림 고르기(①24 ②27 ③23·32 심18의 삼각자 그림): 자와 삼각자를 댄 그림이 있어야 한다 → 미룸
//  - 평행한 두 변의 길이의 합(①28)·두 거리의 차(①34): 뜻 없는 셈
//  - 수직인 두 직선·한 직선 위의 각에서 각도 빼기, 사다리꼴의 나머지 한 각(네 각의 합 360°): 이 단원은 도형 영역이다. 각도를 더하고 빼는 셈은 「각도」 단원(측정)의 일이고, 이어 붙인 도형에서 각을 좇는 것은 중학교 「삼각형·사각형의 성질」「평행선의 성질」 꼴이다(교육과정: 성질은 관찰·측정 같은 귀납으로 이해한다). (2026-10-12 걷어 냄)
//  - 비스듬한 선분(변)의 길이를 거리로 읽은 말 가리기(①35·40 심21): 「길이가 적힌 선분에서 거리 읽기」「사다리꼴의 평행한 두 변 사이의 거리」가 같은 판단을 값으로 묻는다.
//  - 크고 작은 사다리꼴 세기(①47 심98·99), 실물(구절판) 그림에서 세기(심40): 겹친 도형 세기는 경우 따지기다.
//  - 한 점에서 도형의 각 변에 그을 수 있는 수선의 수(②9의 변형 ③8): 뽑은 글에 그림이 없고, 수선의 발이 변 밖에 떨어지는 경우의 판단이 갈린다.
//  - 생활 그림(지도·포장지·잠금 패턴: ①5의 변형 ③19 심8)·기준에 따라 나누기(①83): 「서로 수직(평행)인 직선 찾기」「평행한 변이 있는 도형 고르기」와 같은 판단
// 각도는 수에 붙여 적고(70°) 길이는 띄어 적는다(7 cm). 묻는 말: 값을 물으면 "~은?", 양을 물으면 "몇 도인가?/몇 cm인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, C } = B.kit;
  const G = B.kit.geo;
  const UNIT = '4-2-2', LINE = '4수03-03', QUAD = '4수03-10';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바'], CIRCLED = ['①', '②', '③', '④', '⑤'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const RAD = Math.PI / 180;
  const cm = (v) => v + ' cm';
  const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const unit = (w) => { const s = Math.hypot(w[0], w[1]); return [w[0] / s, w[1] / s]; };

  // ── 보기 짜기 ────────────────────────────────────────────────
  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags) {
    const key = (list) => list.join(', ');
    const right = labels.filter((_, i) => flags[i]);
    const pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  // 설명 고르기: want 가 true 이면 옳은 것 하나와 틀린 것 셋, false 이면 옳은 것 셋과 틀린 것 하나
  function say(d, text, trues, falses, want, explain, figure) {
    const rows = d.shuffle(want ? [[d.pick(trues), true]].concat(d.shuffle(falses).slice(0, 3).map((t) => [t, false])) : d.shuffle(trues).slice(0, 3).map((t) => [t, true]).concat([[d.pick(falses), false]]));
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === want), { figure, explain, facts: { truth: rows.map((r) => r[1]), want } });
  }

  // ── 그림: 이름 붙인 도형 ─────────────────────────────────────
  // 판 안에 맞추기: 가로 box[0], 세로 box[1] 칸을 넘지 않게 키우고 둘레에 여백 pad 를 둔다.
  function place(raw, box, pad) {
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
    const k = Math.min(box[0] / w, box[1] / h), map = ([x, y]) => [(x - x0) * k + pad[0], (y - y0) * k + pad[1]];
    return { points: raw.map(map), map, cols: w * k + pad[0] * 2, rows: h * k + pad[1] * 2 };
  }
  const draw = (fit, parts, label, scale) => G.board(fit.cols, fit.rows, parts, { grid: false, scale: Math.min(scale || 1.15, 296 / (32 + fit.cols * 22)), label });
  // 꼭짓점 o 에서 from°~to° 로 벌어진 각에 호(직각이면 직각 표시)와 글을 넣는다. 좁은 각은 글이 두 변에 닿지 않게 멀리 적는다.
  function sector(o, from, to, label, r) {
    const span = to - from, near = (r || 0.7) + 0.62, far = Math.max(near, (0.3 + String(label || '').length * 0.12) / Math.sin((span / 2) * RAD));
    if (Math.abs(span - 90) < 0.01) return G.squareMark(o, from, to) + (label ? G.text(G.toward(o, 1.05, (from + to) / 2), label, 'mb-label is-length') : '');
    return G.arc(o, from, to, far > near + 0.01 ? far - 0.55 : (r || 0.7)) + (label ? G.text(G.toward(o, far, (from + to) / 2), label, 'mb-label is-length') : '');
  }
  // 다각형의 꼭짓점 i 안쪽에 각 표시와 글을 넣는다.
  function corner(points, i, label, r) {
    const n = points.length, a = G.bearing(points[i], points[(i + n - 1) % n]), b = G.bearing(points[i], points[(i + 1) % n]);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    return sector(points[i], from, to, label, r);
  }
  // 변 p–q 의 바깥쪽(점 inside 의 반대쪽)에 글을 적는다.
  function sideText(p, q, inside, value) {
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let n = [-(q[1] - p[1]) / len, (q[0] - p[0]) / len];
    if ((inside[0] - m[0]) * n[0] + (inside[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const off = 0.42 + Math.abs(n[0]) * String(value).length * 0.15;
    return G.text([m[0] + n[0] * off, m[1] + n[1] * off], value, 'mb-label is-length');
  }
  // 이름 붙인 다각형. o: { names, sides: { 변 번호: 글 }(변 i 는 꼭짓점 i 와 i+1 사이), angles: { 꼭짓점 번호: 글 }, rights: [직각 표시할 꼭짓점], extra(p, fit), box, pad, label }
  function shape(raw, o) {
    const fit = place(raw, o.box || [6.2, 4], o.pad || [1.7, 1]), p = fit.points.slice(0, o.count || raw.length), c = centroid(p), n = p.length, parts = [G.polygon(p)];
    if (o.extra) parts.push(o.extra(fit.points, fit));
    if (o.names) parts.push(G.vertexLabels(p, o.names));
    Object.keys(o.sides || {}).forEach((i) => parts.push(sideText(p[i], p[(Number(i) + 1) % n], c, o.sides[i])));
    Object.keys(o.angles || {}).forEach((i) => parts.push(corner(p, Number(i), o.angles[i])));
    (o.rights || []).forEach((i) => parts.push(corner(p, i)));
    return draw(fit, parts, o.label, o.scale);
  }

  // ── 그림: 모눈 위의 도형 ─────────────────────────────────────
  const sidesOf = (pts) => pts.map((p, i) => G.sub(pts[(i + 1) % pts.length], p));
  const pairsOf = (n) => { const out = []; for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) out.push([i, j]); return out; };
  // 서로 평행한 변의 쌍 수
  const paraPairs = (pts) => { const s = sidesOf(pts); return pairsOf(s.length).filter(([i, j]) => G.cross(s[i], s[j]) === 0).length; };
  // 사각형의 갈래(꼭짓점이 모눈의 점 위에 있는 사각형)
  function kindOf(pts) {
    const s = sidesOf(pts), p1 = G.cross(s[0], s[2]) === 0, p2 = G.cross(s[1], s[3]) === 0, even = new Set(s.map(G.len2)).size === 1, right = G.dot(s[0], s[1]) === 0;
    return { trap: p1 || p2, pgram: p1 && p2, rhom: p1 && p2 && even, rect: p1 && p2 && right, square: p1 && p2 && even && right };
  }
  const flipped = (pts, mx, my) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), sx = Math.max(...xs) + Math.min(...xs), sy = Math.max(...ys) + Math.min(...ys); return pts.map(([x, y]) => [mx ? sx - x : x, my ? sy - y : y]); };
  const vary = (d, pts) => flipped(pts, d.bool(), d.bool());
  function centered(points, cols, rows) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    const dx = Math.floor((cols - Math.max(...xs) - Math.min(...xs)) / 2), dy = Math.floor((rows - Math.max(...ys) - Math.min(...ys)) / 2);
    return points.map((p) => [p[0] + dx, p[1] + dy]);
  }
  // 모눈 위의 도형은 모눈이 비쳐 보이게 옅게 칠한다(칸을 세어 수직·평행·거리를 따지므로).
  const gp = (pts) => G.polygon(pts).replace('class="mb-poly"', 'class="mb-poly" style="fill:rgba(251,191,36,0.22)"');
  // 모눈 4칸 너비의 작은 그림 칸(두 칸씩 나란히 놓인다)
  const gridTile = (points, label) => { const rows = Math.max(3, Math.max(...points.map((p) => p[1])) - Math.min(...points.map((p) => p[1]))); return G.board(4, rows, [gp(centered(points, 4, rows))], { grid: 'lines', label: label || '모눈종이 위의 도형' }); };
  const tilesOf = (list, label) => G.tiles(list.map((points, i) => [TAGS[i], gridTile(points, label)]));
  // 모눈 위의 도형(가로 4칸, 세로 3~4칸 안). 평행한 변이 한 쌍뿐인 사다리꼴 / 평행사변형 / 평행한 변이 없는 사각형 / 삼각형
  const TRAPS = [[[1, 0], [3, 0], [4, 3], [0, 3]], [[1, 0], [2, 0], [4, 3], [0, 3]], [[0, 0], [2, 0], [4, 3], [0, 3]], [[0, 0], [4, 1], [4, 2], [0, 3]], [[0, 1], [1, 0], [4, 1], [2, 3]]];
  const PGRAMS = [[[1, 0], [4, 0], [3, 3], [0, 3]], [[0, 0], [2, 0], [4, 3], [2, 3]], [[0, 0], [3, 1], [4, 3], [1, 2]], [[1, 1], [4, 1], [3, 2], [0, 2]]];
  const RECTS = [[[0, 0], [4, 0], [4, 2], [0, 2]], [[0, 0], [2, 0], [2, 3], [0, 3]], [[0, 2], [2, 0], [3, 1], [1, 3]]];
  const NONES = [[[2, 0], [4, 1], [2, 3], [0, 1]], [[0, 0], [4, 2], [3, 3], [0, 3]], [[2, 0], [3, 1], [2, 3], [1, 1]], [[0, 3], [1, 1], [4, 0], [4, 3]]];
  const TRIS = [[[2, 0], [4, 3], [0, 3]], [[1, 0], [4, 3], [0, 3]], [[0, 0], [0, 3], [4, 3]]];
  const HEX = [[1, 0], [3, 0], [4, 2], [3, 4], [1, 4], [0, 2]];

  // ── 그림: 직선 여럿 ──────────────────────────────────────────
  // 직선은 { at: 지나는 점, dir: 방향(정수) } 로 적고, 판 안에 들어오는 부분만 그린다. 수직으로 만나는 곳에는 직각 표시를 한다.
  const BOXL = [0.8, 0.8, 11.2, 7.4], CEN = [6, 4.1];
  function clip(l) {
    const ts = [], at = l.at, dir = l.dir;
    if (dir[0]) ts.push((BOXL[0] - at[0]) / dir[0], (BOXL[2] - at[0]) / dir[0]);
    if (dir[1]) ts.push((BOXL[1] - at[1]) / dir[1], (BOXL[3] - at[1]) / dir[1]);
    const pts = ts.map((t) => [at[0] + dir[0] * t, at[1] + dir[1] * t]).filter((p) => p[0] > BOXL[0] - 1e-6 && p[0] < BOXL[2] + 1e-6 && p[1] > BOXL[1] - 1e-6 && p[1] < BOXL[3] + 1e-6);
    pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    return pts.length >= 2 ? [pts[0], pts[pts.length - 1]] : null;
  }
  const meet = (a, b) => { const t = G.cross(G.sub(b.at, a.at), b.dir) / G.cross(a.dir, b.dir); return [a.at[0] + a.dir[0] * t, a.at[1] + a.dir[1] * t]; };
  // 점 e 에서 선분 p–q 까지의 거리
  const away = (e, p, q) => { const v = G.sub(q, p), t = Math.max(0, Math.min(1, G.dot(G.sub(e, p), v) / G.len2(v))); return Math.hypot(e[0] - p[0] - v[0] * t, e[1] - p[1] - v[1] * t); };
  // 직선들을 판에 놓아 본다. 너무 짧게 잘리거나, 직각 표시를 다른 직선이 지나가거나, 이름 놓을 자리가 없으면 null.
  function layLines(lines) {
    const segs = lines.map(clip);
    if (segs.some((s) => !s || Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]) < 4.6)) return null;
    const marks = [], spots = [];
    for (const [i, j] of pairsOf(lines.length)) {
      if (G.dot(lines[i].dir, lines[j].dir) !== 0) continue;
      const v = meet(lines[i], lines[j]);
      if (v[0] < BOXL[0] + 0.6 || v[0] > BOXL[2] - 0.6 || v[1] < BOXL[1] + 0.6 || v[1] > BOXL[3] - 0.6) return null;
      if (lines.some((_, k) => k !== i && k !== j && away(v, segs[k][0], segs[k][1]) < 0.75)) return null;
      const sa = G.dot(lines[i].dir, G.sub(CEN, v)) >= 0 ? 1 : -1, sb = G.dot(lines[j].dir, G.sub(CEN, v)) >= 0 ? 1 : -1;
      marks.push(G.rightMark(v, [v[0] + lines[i].dir[0] * sa, v[1] + lines[i].dir[1] * sa], [v[0] + lines[j].dir[0] * sb, v[1] + lines[j].dir[1] * sb]));
    }
    for (let i = 0; i < segs.length; i += 1) {
      const [p, q] = segs[i], ends = [G.beyond(q, p, 0.42), G.beyond(p, q, 0.42)];
      const room = (e) => Math.min(...spots.map((s) => Math.hypot(s[0] - e[0], s[1] - e[1])).concat(segs.map((s, k) => (k === i ? 9 : away(e, s[0], s[1])))));
      const e = room(ends[0]) >= room(ends[1]) ? ends[0] : ends[1];
      if (room(e) < 0.7) return null;
      spots.push(e);
    }
    return { segs, marks, spots };
  }
  // 서로 수직인 두 방향 u, v 와 어느 쪽과도 수직·평행이 아닌 방향 w
  const FRAMES = [
    { u: [1, 0], v: [0, 1], w: [[1, 2], [2, -3]] }, { u: [0, 1], v: [1, 0], w: [[1, 2], [2, -3]] },
    { u: [2, 1], v: [-1, 2], w: [[1, 0], [1, 3]] }, { u: [1, 1], v: [1, -1], w: [[3, 1], [1, 3]] }, { u: [3, 1], v: [-1, 3], w: [[1, 1], [2, -1]] }
  ];
  // u 쪽 직선 nu 개(서로 평행), v 쪽 직선 nv 개(u 쪽 직선에 수직), 비스듬한 직선 nw 개. 직선의 이름은 가, 나, 다 … 차례로 붙는다.
  function crossing(d, nu, nv, nw) {
    return d.until(() => {
      const f = d.pick(FRAMES), mir = d.bool() ? -1 : 1, turn = (w) => [w[0] * mir, w[1]], uh = unit(turn(f.u)), vh = unit(turn(f.v));
      const spread = (n, gap) => (n === 1 ? [d.pick([-0.4, 0.4]) * gap] : n === 2 ? [-gap / 2, gap / 2] : [-gap, 0, gap]).map((t) => t + d.int(-2, 2) * 0.1);
      const lines = [];
      spread(nu, nu === 3 ? 2 : 3.2).forEach((t) => lines.push({ kind: 'u', dir: turn(f.u), at: [CEN[0] + vh[0] * t, CEN[1] + vh[1] * t] }));
      spread(nv, nv === 3 ? 2.6 : 4.2).forEach((s) => lines.push({ kind: 'v', dir: turn(f.v), at: [CEN[0] + uh[0] * s, CEN[1] + uh[1] * s] }));
      d.shuffle(f.w).slice(0, nw).forEach((w) => lines.push({ kind: 'w', dir: turn(w), at: [CEN[0] + d.int(-28, 28) * 0.1, CEN[1] + d.int(-14, 14) * 0.1] }));
      const order = d.shuffle(lines), lay = layLines(order);
      return lay && { lines: order, lay };
    }, Boolean);
  }
  const isPerp = (made, i, j) => i !== j && G.dot(made.lines[i].dir, made.lines[j].dir) === 0;
  const isPara = (made, i, j) => i !== j && G.cross(made.lines[i].dir, made.lines[j].dir) === 0;
  const perpTo = (made, i) => made.lines.map((_, j) => j).filter((j) => isPerp(made, i, j));
  const told = (made) => { const list = pairsOf(made.lines.length).filter(([i, j]) => isPerp(made, i, j)).map(([i, j]) => `${TAGS[i]}와 ${TAGS[j]}`); return `직선 ${made.lines.map((_, i) => TAGS[i]).join(', ')}. ` + (list.length ? `직각 표시가 있는 곳: ${list.join(', ')}` : '직각 표시가 없다.'); };
  const lineArt = (made) => G.board(12, 8.2, made.lay.segs.map(([p, q]) => G.line(p, q)).concat(made.lay.marks, made.lay.spots.map((e, i) => G.text(e, TAGS[i]))), { grid: false, scale: 1, label: told(made) });
  const ln = (i) => '직선 ' + TAGS[i];

  // ── 그림: 평행선과 그 사이의 선분 ────────────────────────────
  // 평행한 두 직선 가(위), 나(아래) 사이에 그은 선분들. segs: [{ off: 위 끝이 아래 끝보다 오른쪽으로 나간 칸 수, tag: 위에 적을 기호, text: 옆에 적을 글, mark: 직각 표시 }]
  // o: { gap: 두 직선 사이의 칸 수, names: [위, 아래 직선의 이름], ends: 선분 끝에 적을 이름 [[위, 아래] …] }
  function band(segs, o) {
    const top = 1.4, gap = o.gap || 3.2, names = o.names || ['가', '나'], step = 10 / segs.length;
    const parts = [G.line([0.9, top], [11.6, top]), G.line([0.9, top + gap], [11.6, top + gap]), G.text([0.45, top], names[0]), G.text([0.45, top + gap], names[1])];
    segs.forEach((s, i) => {
      const cx = 1.3 + step * (i + 0.5), p = [cx + s.off / 2, top], q = [cx - s.off / 2, top + gap];
      parts.push(G.line(p, q));
      if (s.mark) parts.push(G.rightMark(q, p, [q[0] + 1, q[1]]));
      if (s.tag) parts.push(G.text([p[0], top - 0.5], s.tag));
      if (s.ends) parts.push(G.text([p[0] + 0.45, top - 0.45], s.ends[0]), G.text([q[0] + 0.45, top + gap + 0.5], s.ends[1]));
      if (s.text) { const far = 0.3 + 0.3 * Math.abs(s.off) / gap + s.text.length * 0.155; parts.push(G.text([cx + (s.left ? -far : far), top + gap / 2], s.text, 'mb-label is-length')); }
    });
    return G.board(12, top + gap + 0.8, parts, { grid: false, scale: 1, label: o.label });
  }
  // 비스듬한 선분의 길이: 수직인 선분의 길이(cm) → [[비스듬한 선분의 길이, 옆으로 나간 길이] …] (직각삼각형의 세 변)
  const SLANTS = { 12: [[13, 5], [15, 9]], 24: [[25, 7], [26, 10], [30, 18]], 15: [[17, 8], [25, 20]], 20: [[25, 15], [29, 21]] };
  // 평행한 직선 여럿과 그 사이의 거리. shown: 이웃한 두 직선 사이에 적을 글(null 이면 선분을 긋지 않는다), whole: 맨 위와 맨 아래 직선 사이에 적을 글
  // (맨 위와 맨 아래 사이의 거리를 적을 때에는 가운데 직선을 짧게 그어, 그 선분이 가운데 직선을 지나지 않게 한다.)
  function ladder(dists, shown, whole) {
    const total = dists.reduce((s, v) => s + v, 0), k = (dists.length === 2 ? 4.8 : 6) / total, ys = [1];
    dists.forEach((v) => ys.push(ys[ys.length - 1] + v * k));
    const parts = ys.map((y, i) => G.line([0.9, y], [whole && i > 0 && i < ys.length - 1 ? 7.4 : 11, y]) + G.text([0.45, y], TAGS[i])), last = ys[ys.length - 1];
    const post = (x, y1, y2, text, at) => G.line([x, y1], [x, y2], 'mb-line is-thin') + G.rightMark([x, y2], [x, y1], [x + 1, y2]) + G.text([x + 0.55 + text.length * 0.155, at], text, 'mb-label is-length');
    dists.forEach((v, i) => { if (shown[i]) parts.push(post(2.6 + i * 2.3, ys[i], ys[i + 1], shown[i], (ys[i] + ys[i + 1]) / 2)); });
    if (whole) parts.push(post(9, ys[0], last, whole, (ys[0] + last) / 2));
    return G.board(12, last + 0.9, parts, { grid: false, scale: 1, label: `서로 평행한 직선 ${ys.map((_, i) => TAGS[i]).join(', ')}. ` + dists.map((v, i) => (shown[i] ? `${TAGS[i]}와 ${TAGS[i + 1]} 사이의 거리 ${shown[i]}` : '')).filter(Boolean).join(', ') + (whole ? `, ${TAGS[0]}와 ${TAGS[ys.length - 1]} 사이의 거리 ${whole}` : '') });
  }

  // ── 그림: 종이띠를 자른 조각 ─────────────────────────────────
  // 폭이 4칸인 직사각형 종이띠. top, bottom: 자르는 선이 위·아래 변과 만나는 자리(왼쪽 끝 0부터 오른쪽 끝까지)
  const STRIPS = [
    { top: [0, 4, 7, 12, 14, 14, 20], bottom: [0, 4, 10, 15, 17, 20, 20] },   // 정사각형, 사다리꼴, 마름모, 평행사변형, 삼각형, 삼각형
    { top: [0, 5, 8, 8, 14, 20], bottom: [0, 2, 5, 11, 14, 20] },             // 사다리꼴, 평행사변형, 삼각형, 사다리꼴, 직사각형
    { top: [0, 0, 5, 9, 13, 16, 20], bottom: [0, 3, 8, 9, 13, 19, 20] },      // 삼각형, 마름모, 사다리꼴, 정사각형, 사다리꼴, 사다리꼴
    { top: [0, 3, 6, 10, 10, 20], bottom: [0, 3, 9, 13, 16, 20] }             // 직사각형, 사다리꼴, 평행사변형, 삼각형, 사다리꼴
  ];
  function stripOf(d) {
    const s = d.pick(STRIPS), W = 20, mir = d.bool(), turn = (list) => (mir ? list.map((x) => W - x).reverse() : list), top = turn(s.top), bottom = turn(s.bottom);
    const pieces = top.slice(1).map((_, i) => {
      const tw = top[i + 1] - top[i], bw = bottom[i + 1] - bottom[i], lean = top[i] - bottom[i], quad = tw > 0 && bw > 0, pgram = quad && tw === bw;
      return { quad, trap: quad, pgram, rhom: pgram && tw * tw === 16 + lean * lean, rect: pgram && lean === 0, square: pgram && lean === 0 && tw === 4, points: [[top[i], 0], [bottom[i], 4], [bottom[i + 1], 4], [top[i + 1], 0]].filter((p, n, all) => !all.slice(0, n).some((q) => q[0] === p[0] && q[1] === p[1])) };
    });
    const k = 11 / W, at = ([x, y]) => [0.5 + x * k, 0.6 + y * k];
    const parts = [G.polygon([[0, 0], [0, 4], [W, 4], [W, 0]].map(at))].concat(top.slice(1, -1).map((x, i) => G.line(at([x, 0]), at([bottom[i + 1], 4]))), pieces.map((piece, i) => G.text(at(centroid(piece.points)), TAGS[i])));
    return { pieces, tags: TAGS.slice(0, pieces.length), figure: G.board(12, 0.6 + 4 * k + 0.6, parts, { grid: false, scale: 1, label: `직사각형 모양의 종이띠를 선을 따라 잘라 만든 조각 ${pieces.length}개(${TAGS.slice(0, pieces.length).join(', ')})` }) };
  }

  B.addUnit({
    id: '4-2-2', grade: 4, semester: 2, no: 2, title: '사각형', version: 2,
    groups: [
      {
        id: 'perp', title: '수직과 수선', standard: LINE,
        types: [
          T('perp-word', '수직과 수선의 뜻', '①1 ②1 ③1 심6', (d, n) => {
            const [text, want, list] = n === 0
              ? ['두 직선이 만나서 이루는 각이 직각일 때, 두 직선의 관계를 나타내는 말은?', '수직', ['수직', '평행', '수선', '직선']]
              : ['두 직선이 서로 수직으로 만날 때, 한 직선을 다른 직선에 대한 무엇이라고 하는가?', '수선', ['수선', '평행선', '선분', '반직선']];
            const options = d.shuffle(list);
            return C(text, options, options.indexOf(want), { explain: '두 직선이 만나서 이루는 각이 직각일 때 두 직선은 서로 수직이라고 한다. 두 직선이 서로 수직으로 만나면 한 직선을 다른 직선에 대한 수선이라고 한다.', facts: { truth: options.map((o) => o === want), want: true } });
          }, { count: 2 }),
          T('perp-pick-two', '두 직선이 수직으로 만나는 그림 고르기', '①2 ②4 ③2', (d) => {
            // 한 점 v 에서 a, b 쪽으로 뻗은 두 직선. 수직이 아닌 것은 45°~65°로 벌려 눈으로 가릴 수 있게 한다.
            const rights = [[[2, 1], [-1, 2]], [[2, 2], [2, -2]], [[2, 0], [0, 2]], [[1, 2], [2, -1]]], wrongs = [[[2, 1], [2, -1]], [[2, 0], [2, 2]], [[1, 2], [1, -2]], [[2, 1], [0, 2]], [[2, 0], [1, 2]]];
            const picks = d.shuffle([d.pick(rights)].concat(d.shuffle(wrongs).slice(0, 3))), v = [2, 2];
            const art = ([a, b], whole) => G.board(4, 4, [G.line(G.sub(v, a), [v[0] + a[0], v[1] + a[1]]), G.line(whole ? G.sub(v, b) : v, [v[0] + b[0], v[1] + b[1]])], { grid: false, label: '두 직선이 만나는 그림' });
            const triples = picks.map(([a, b]) => [v, [v[0] + a[0], v[1] + a[1]], [v[0] + b[0], v[1] + b[1]]]), at = triples.findIndex(([o, p, q]) => G.isRight(o, p, q));
            return C('두 직선이 서로 수직으로 만나는 것은?', TAGS.slice(0, 4), at, {
              figure: G.tiles(picks.map((pair, i) => [TAGS[i], art(pair, d.bool())])), explain: `${TAGS[at]}의 두 직선이 만나서 이루는 각이 직각이다. 나머지는 두 직선이 만나서 이루는 각이 직각이 아니다.`,
              facts: { anglePick: triples }
            });
          }),
          T('perp-find', '직선 여럿에서 한 직선에 대한 수선 찾기', '①4 ②2 ③3 심1', (d) => {
            const made = crossing(d, 2, 1, 2), t = made.lines.findIndex((l) => l.kind === 'u'), others = made.lines.map((_, i) => i).filter((i) => i !== t), at = others.findIndex((i) => isPerp(made, t, i));
            return C(`${ln(t)}에 대한 수선은?`, others.map(ln), at, {
              figure: lineArt(made), explain: `${ln(t)}와 만나서 이루는 각이 직각인 직선은 ${ln(others[at])}이다. 두 직선이 서로 수직일 때 한 직선을 다른 직선에 대한 수선이라고 한다.`,
              facts: { truth: others.map((i) => isPerp(made, t, i)), want: true }
            });
          }),
          T('perp-count', '한 직선에 수직인 직선의 수', '①4 ③4 심1', (d) => {
            const nv = d.pick([2, 3]), made = crossing(d, 1, nv, nv === 3 ? 1 : 2), t = made.lines.findIndex((l) => l.kind === 'u'), others = made.lines.map((_, i) => i).filter((i) => i !== t), flags = others.map((i) => isPerp(made, t, i));
            return N(`${ln(t)}에 수직인 직선은 모두 몇 개인가?`, flags.filter(Boolean).length, {
              unit: '개', figure: lineArt(made), explain: `${ln(t)}와 직각으로 만나는 직선은 ${others.filter((_, k) => flags[k]).map(ln).join(', ')}이다. 나머지 직선은 ${ln(t)}와 만나지만 직각을 이루지 않는다.`,
              facts: { count: flags }
            });
          }),
          T('perp-pairs', '서로 수직인 직선끼리 짝 짓기', '①5 ②3 심1', (d) => {
            // 서로 수직인 두 직선이 두 쌍 있다. 두 쌍의 방향은 서로 수직·평행이 아니다.
            const made = d.until(() => {
              const [fa, fb] = d.pick([[0, 3], [0, 2], [3, 4]]).map((k) => FRAMES[k]), up = d.bool(), ca = [3.4 + d.int(-3, 3) * 0.1, up ? 2.9 : 5.2], cb = [8.4 + d.int(-3, 3) * 0.1, up ? 5.2 : 2.9];
              const lines = d.shuffle([{ dir: fa.u, at: ca }, { dir: fa.v, at: ca }, { dir: fb.u, at: cb }, { dir: fb.v, at: cb }]), lay = layLines(lines);
              return lay && { lines, lay };
            }, Boolean);
            const perp = pairsOf(4).filter(([i, j]) => isPerp(made, i, j)), matchings = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]], rows = d.shuffle(matchings);
            const ok = rows.map((m) => m.every(([i, j]) => isPerp(made, i, j))), text = (m) => m.map(([i, j]) => `${ln(i)}와 ${ln(j)}`).join(', ');
            return C('서로 수직인 직선끼리 바르게 짝 지은 것은?', rows.map(text), ok.indexOf(true), {
              figure: lineArt(made), explain: `직각으로 만나는 직선은 ${perp.map(([i, j]) => `${ln(i)}와 ${ln(j)}`).join(', ')}이다. 다른 짝은 만나서 이루는 각이 직각이 아니다.`,
              facts: { truth: ok, want: true }
            });
          }),
          T('perp-claims', '직선 여럿을 보고 한 설명', '③9 심5', (d) => {
            const made = crossing(d, 2, 2, 1), by = (kind) => made.lines.map((l, i) => (l.kind === kind ? i : -1)).filter((i) => i >= 0), [u1, u2] = by('u'), [v1, v2] = by('v'), [w] = by('w');
            const same = (list, want) => list.length === want.length && want.every((i) => list.includes(i));
            // 설명마다 그림에서 다시 따진다: [글, 참인가, 무엇에 대한 말인가]
            const claims = [
              [`${ln(u1)}에 대한 수선은 2개이다.`, perpTo(made, u1).length === 2, u1], [`${ln(v1)}에 대한 수선은 ${ln(u1)}와 ${ln(u2)}이다.`, same(perpTo(made, v1), [u1, u2]), v1],
              [`${ln(w)}에 대한 수선은 없다.`, perpTo(made, w).length === 0, w], [`${ln(u2)}는 ${ln(v2)}에 대한 수선이다.`, isPerp(made, u2, v2), u2],
              [`${ln(w)}에 대한 수선은 1개이다.`, perpTo(made, w).length === 1, w], [`${ln(u2)}에 대한 수선은 ${ln(v1)}와 ${ln(w)}이다.`, same(perpTo(made, u2), [v1, w]), u2], [`${ln(v2)}에 대한 수선은 1개이다.`, perpTo(made, v2).length === 1, v2]
            ];
            const bad = d.pick(claims.filter((c) => !c[1])), rows = d.shuffle(d.shuffle(claims.filter((c) => c[1] && c[2] !== bad[2])).slice(0, 3).concat([bad]));
            return C('그림을 보고 한 설명으로 옳지 않은 것은?', rows.map((c) => c[0]), rows.indexOf(bad), {
              figure: lineArt(made), explain: `${ln(u1)}와 ${ln(u2)}는 각각 ${ln(v1)}, ${ln(v2)}와 직각으로 만난다. ${ln(w)}는 어느 직선과도 직각으로 만나지 않으므로 ${ln(w)}에 대한 수선은 없다.`,
              facts: { truth: rows.map((c) => c[1]), want: false }
            });
          }),
          T('perp-shape-has', '서로 수직인 변이 있는 도형 고르기', '①6 ②5 ③7 심3', (d) => {
            const has = [TRIS[2], RECTS[0], RECTS[1], TRAPS[2], RECTS[2], NONES[1]], none = [TRIS[0], TRIS[1], PGRAMS[0], PGRAMS[1], TRAPS[0], [[2, 0], [4, 1], [2, 2], [0, 1]]];
            const picks = d.shuffle(d.shuffle(has).slice(0, 2).concat(d.shuffle(none).slice(0, 2))).map((pts) => vary(d, pts)), flags = picks.map((pts) => G.rightAngles(pts) > 0), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
            return C('서로 수직인 변이 있는 도형을 모두 고른 것은?', made.options, made.answer, {
              figure: tilesOf(picks), explain: `${labels.filter((_, i) => flags[i]).join(', ')}에는 직각으로 만나는 두 변이 있다. 나머지 도형에는 직각으로 만나는 변이 없다.`,
              facts: { sets: { labels, flags, options: made.sets } }
            });
          }),
          T('perp-side-of', '도형에서 한 변에 수직인 변 찾기', '①7 ②6 ③6 심2', (d) => {
            const pts = d.pick([[[2, 1], [2, 5], [8, 5], [5, 1]], [[4, 1], [1, 5], [7, 5], [7, 1]], [[5, 1], [2, 3], [2, 6], [8, 6], [8, 3]]]), names = 'ㄱㄴㄷㄹㅁ'.slice(0, pts.length).split(''), n = pts.length, s = sidesOf(pts);
            const sideName = (i) => '변 ' + [names[i], names[(i + 1) % n]].sort().join(''), t = d.pick(s.map((_, i) => i).filter((i) => s.some((w, j) => j !== i && G.dot(s[i], w) === 0)));
            const others = s.map((_, i) => i).filter((i) => i !== t), flags = others.map((i) => G.dot(s[t], s[i]) === 0), labels = others.map(sideName), made = setOptions(d, labels, flags);
            const parts = [gp(pts), G.vertexLabels(pts, names)].concat(pts.map((v, i) => (G.rightAt(pts, i) ? G.rightMark(v, pts[(i + n - 1) % n], pts[(i + 1) % n]) : '')));
            return C(`도형에서 ${sideName(t)}에 수직인 변을 모두 고른 것은?`, made.options, made.answer, {
              figure: G.board(10, 7, parts, { grid: 'lines', scale: 1.15, label: `모눈종이 위의 도형 ${names.join('')}. 직각 표시가 있는 꼭짓점: ${names.filter((_, i) => G.rightAt(pts, i)).join(', ')}` }),
              explain: `${sideName(t)}과 직각으로 만나는 변은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`, facts: { sets: { labels, flags, options: made.sets } }
            });
          }),
          T('perp-side-pairs', '도형에서 서로 수직인 변의 쌍 세기', '①8 심4', (d) => {
            // 볼록한 도형에서는 직각인 꼭짓점마다 수직인 변이 한 쌍 있다. 만나지 않는 두 변이 수직인 방향으로 놓인 도형은 쓰지 않는다.
            const pts = vary(d, d.pick([[[0, 0], [0, 4], [6, 4]], [[0, 0], [3, 0], [6, 4], [0, 4]], [[0, 0], [6, 0], [6, 4], [0, 4]], [[3, 0], [6, 2], [6, 5], [0, 5], [0, 2]], [[0, 0], [6, 3], [4, 5], [0, 5]]])), count = G.rightAngles(pts);
            return N('모눈종이에 그린 도형에서 서로 수직인 변은 모두 몇 쌍인가?', count, {
              unit: '쌍', figure: G.board(8, Math.max(...pts.map((p) => p[1])) + 2, [gp(pts.map(([x, y]) => [x + 1, y + 1]))], { grid: 'lines', scale: 1.2, label: '모눈종이 위의 도형' }),
              explain: `직각으로 만나는 두 변을 찾는다. 도형에 직각인 곳이 ${count}군데 있으므로 서로 수직인 변은 ${count}쌍이다.`, facts: { rightCount: pts }
            });
          }),
          T('perp-drawn', '삼각자로 수선을 바르게 그은 그림 고르기', '①9 ②7 ③11 심7', (d) => {
            // 삼각자의 직각을 낀 한 변을 직선 가에 맞추고 다른 한 변을 따라 그어야 수선이 된다.
            const turned = (a, deg) => { const c = Math.cos(deg * RAD), s = Math.sin(deg * RAD); return [[a[0] + 2 * c, a[1] - 2 * s], [a[0] - 2.3 * s, a[1] - 2.3 * c]]; };
            const kinds = d.shuffle(['leg', 'slope', 'tilted']), mir = d.bool(), mx = ([x, y]) => [mir ? 4 - x : x, y], blue = (svg) => svg.replace('class="mb-line"', 'class="mb-line" style="stroke:#1d4ed8;stroke-width:2.2"');
            const made = kinds.map((kind) => {
              const a = [kind === 'tilted' ? 2 : 1.4, 3.2], [b, c] = turned(a, kind === 'tilted' ? 20 : 0), [p, q] = kind === 'slope' ? [b, c] : [a, c], dir = unit(G.sub(q, p)), from = [p[0] - dir[0] * 0.5, p[1] - dir[1] * 0.5], to = [q[0] + dir[0] * 0.5, q[1] + dir[1] * 0.5];
              const ruler = G.polygon([a, b, c].map(mx)).replace('class="mb-poly"', 'class="mb-poly" style="fill:#dbeafe;stroke:#64748b;stroke-width:1"');
              return { ok: Math.abs(dir[0]) < 1e-9, svg: G.board(4, 4, [ruler, G.line(mx([0.1, 3.2]), mx([3.9, 3.2])), blue(G.line(mx(from), mx(to))), G.text(mx([3.7, 3.6]), '가'), G.text(mx([to[0] + (kind === 'leg' ? 0.45 : -0.5), to[1] + 0.25]), '나')], { grid: false, label: '직선 가에 삼각자를 대고 삼각자의 변을 따라 직선 나를 그은 그림' }) };
            });
            const at = made.findIndex((m) => m.ok);
            return C('삼각자를 사용하여 직선 가에 대한 수선 나를 바르게 그은 것은?', TAGS.slice(0, 3), at, {
              figure: G.tiles(made.map((m, i) => [TAGS[i], m.svg])), explain: `삼각자에서 직각을 낀 한 변을 직선 가에 꼭 맞추고, 직각을 낀 다른 한 변을 따라 그어야 수선이 된다. ${TAGS[at]}가 그렇게 그은 것이다.`,
              facts: { truth: made.map((m) => m.ok), want: true }
            });
          }),
          T('perp-right-count', '수선을 그으면 생기는 직각의 수', '①11 심6', (d) => {
            const n = d.int(1, 3);
            return N(`한 직선에 대한 수선을 ${n}개 그었다. 이 직선과 수선이 만나서 이루는 각 가운데 직각은 모두 몇 개인가?`, 4 * n, {
              unit: '개', explain: `수직으로 만나는 두 직선이 이루는 네 각은 모두 직각이다. 수선 하나마다 직각이 4개 생기므로 4 × ${n} = ${4 * n}(개)이다.`, facts: { calc: [[`4*${n}`, 0]], unseen: [4] }
            });
          }),
          T('perp-talk', '수직과 수선에 대한 설명', '①13 ③22 심6', (d) => say(d, '수직과 수선에 대한 설명으로 옳지 않은 것은?',
            ['두 직선이 만나서 이루는 각이 직각일 때 두 직선은 서로 수직이다.', '한 직선에 대한 수선은 셀 수 없이 많이 그을 수 있다.', '두 선분이 만나서 이루는 각이 직각일 때에도 두 선분은 서로 수직이다.', '직사각형에서 이웃한 두 변은 서로 수직이다.', '두 직선이 서로 수직이면 한 직선은 다른 직선에 대한 수선이다.'],
            ['한 직선에 대한 수선은 1개만 그을 수 있다.', '직사각형에는 서로 수직인 변이 없다.', '두 직선이 한 점에서 만나면 언제나 서로 수직이다.', '서로 수직인 두 직선이 만나서 이루는 네 각 가운데에는 직각이 아닌 각도 있다.'], false,
            '두 직선(선분)이 만나서 이루는 각이 직각이면 서로 수직이고, 이때 이루는 네 각은 모두 직각이다. 한 직선 위의 점마다 수선을 그을 수 있으므로 한 직선에 대한 수선은 셀 수 없이 많다. 직사각형은 네 각이 모두 직각이라 이웃한 두 변이 서로 수직이다.')),
          T('perp-how-many', '그을 수 있는 수선의 수', '②9 ③22', (d, n) => {
            const options = d.shuffle(['1개', '2개', '4개', '셀 수 없이 많다.']), want = n === 0 ? '셀 수 없이 많다.' : '1개';
            return C(n === 0 ? '직선 가에 수직인 직선은 몇 개 그을 수 있는가?' : '직선 가와 그 위에 있지 않은 점 ㄱ이 있다. 점 ㄱ을 지나고 직선 가에 수직인 직선은 몇 개 그을 수 있는가?', options, options.indexOf(want), {
              explain: n === 0 ? '직선 가 위의 어느 점에서나 수선을 그을 수 있으므로 직선 가에 수직인 직선은 셀 수 없이 많다.' : '직선 가에 수직인 직선은 셀 수 없이 많지만, 그 가운데 점 ㄱ을 지나는 것은 1개뿐이다.',
              facts: { truth: options.map((o) => o === want), want: true }
            });
          }, { count: 2 }),
          T('perp-point-pick', '수선이 되게 이을 점 고르기', '②13 ①14', (d) => {
            // 직선 가 위의 점 ㄱ과 이었을 때 직선 가와 직각을 이루는 점은 하나뿐이다. 나머지 점은 직각과 뚜렷이 다른 각을 이룬다.
            const [u, o] = d.pick([[[2, 1], [4, 3]], [[1, 2], [4, 3]], [[1, 1], [4, 3]], [[3, 1], [4, 3]], [[2, -1], [4, 3]], [[1, -1], [4, 3]]]), other = [o[0] + u[0], o[1] + u[1]];
            const all = []; for (let x = 0; x <= 8; x += 1) for (let y = 0; y <= 6; y += 1) if (G.cross(u, [x - o[0], y - o[1]]) !== 0 && Math.abs(x - o[0]) + Math.abs(y - o[1]) >= 2) all.push([x, y]);
            const good = all.filter((c) => G.isRight(o, other, c)), bad = all.filter((c) => !G.isRight(o, other, c) && !G.nearRight(o, other, c));
            const far = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= 3;
            const points = d.until(() => d.shuffle([d.pick(good)].concat(d.shuffle(bad).slice(0, 3))), (list) => list.every((p, i) => list.every((q, j) => i === j || far(p, q)) && away(p, [o[0] - u[0] * 9, o[1] - u[1] * 9], [o[0] + u[0] * 9, o[1] + u[1] * 9]) > 0.8));
            const ts = [(0 - o[0]) / u[0], (8 - o[0]) / u[0], (0 - o[1]) / u[1], (6 - o[1]) / u[1]].map((t) => [o[0] + u[0] * t, o[1] + u[1] * t]).filter((p) => p[0] > -1e-6 && p[0] < 8 + 1e-6 && p[1] > -1e-6 && p[1] < 6 + 1e-6).sort((p, q) => p[0] - q[0]);
            const base = [G.line(ts[0], ts[ts.length - 1]), G.point(o), G.text(G.beside(o, other, o, 0.55), 'ㄱ'), G.text(G.beside(ts[0], ts[ts.length - 1], G.beyond(ts[0], ts[ts.length - 1], -0.5), 0.5), '가')].concat(points.map((p, i) => G.point(p) + G.text([p[0] + 0.45, p[1] - 0.35], CIRCLED[i], 'mb-label is-small')));
            const at = points.findIndex((c) => G.isRight(o, other, c));
            return C('점 종이 위에 직선 가와 그 위의 점 ㄱ이 있다. 점 ㄱ과 한 점을 이어 직선 가에 대한 수선을 그으려고 한다. 이어야 할 점은?', CIRCLED.slice(0, 4), at, {
              figure: G.board(8, 6, base, { grid: 'dots', scale: 1.25, label: '점 종이 위의 직선 가, 그 위의 점 ㄱ, 점 넷' }),
              explain: `점 ㄱ과 점 ${CIRCLED[at]}${['을', '를', '을', '를'][at]} 이은 선분은 직선 가와 직각으로 만난다.` + G.board(8, 6, [G.line(o, points[at]), G.rightMark(o, other, points[at])].concat(base), { grid: 'dots', label: '직선 가에 대한 수선' }),
              facts: { anglePick: points.map((c) => [o, other, c]) }
            });
          })
        ]
      },
      {
        id: 'para', title: '평행과 평행선', standard: LINE,
        types: [
          T('para-word', '평행과 평행선의 뜻', '①1 ②16 ③13', (d, n) => {
            const [text, want, list] = n === 0
              ? ['한 직선에 수직인 두 직선을 그으면 그 두 직선은 서로 만나지 않는다. 이와 같이 서로 만나지 않는 두 직선의 관계를 나타내는 말은?', '평행', ['평행', '수직', '수선', '직각']]
              : ['서로 만나지 않는 두 직선, 곧 평행한 두 직선을 무엇이라고 하는가?', '평행선', ['평행선', '수선', '반직선', '선분']];
            const options = d.shuffle(list);
            return C(text, options, options.indexOf(want), { explain: '서로 만나지 않는 두 직선을 평행하다고 하고, 평행한 두 직선을 평행선이라고 한다.', facts: { truth: options.map((o) => o === want), want: true } });
          }, { count: 2 }),
          T('para-pick-two', '두 직선이 평행한 그림 고르기', '①16 ②19 ③14', (d) => {
            const yes = [[[[0, 1], [4, 2]], [[0, 3], [4, 4]]], [[[0, 3], [3, 0]], [[1, 4], [4, 1]]], [[[1, 0], [1, 4]], [[3, 0], [3, 4]]], [[[0, 2], [4, 0]], [[0, 4], [4, 2]]]];
            const no = [[[[0, 0], [4, 4]], [[0, 3], [4, 1]]], [[[0, 0], [4, 1]], [[0, 4], [4, 2]]], [[[0, 2], [4, 2]], [[2, 2], [3, 4]]], [[[0, 4], [2, 0]], [[2, 0], [4, 4]]], [[[0, 1], [4, 0]], [[0, 2], [4, 4]]]];
            const picks = d.shuffle([d.pick(yes)].concat(d.shuffle(no).slice(0, 3))), par = picks.map(([[a, b], [p, q]]) => G.cross(G.sub(b, a), G.sub(q, p)) === 0), at = par.indexOf(true);
            return C('모눈종이에 그린 두 직선이 서로 평행한 것은?', TAGS.slice(0, 4), at, {
              figure: G.tiles(picks.map(([[a, b], [p, q]], i) => [TAGS[i], G.board(4, 4, [G.line(a, b), G.line(p, q)], { grid: 'lines', label: '모눈종이 위의 두 직선' })])),
              explain: `${TAGS[at]}의 두 직선은 기울어진 정도가 같아서 아무리 늘여도 만나지 않는다. 나머지는 이미 만나거나 늘이면 만난다.`,
              facts: { kindPick: { kinds: par.map((ok, i) => (ok ? 'parallel' : 'no' + i)), target: 'parallel' } }
            });
          }),
          T('para-find', '직선 여럿에서 평행한 직선 찾기', '①17 ②17 ③15 심10', (d) => {
            const made = crossing(d, 2, 1, 2), t = made.lines.findIndex((l) => l.kind === 'u'), others = made.lines.map((_, i) => i).filter((i) => i !== t), at = others.findIndex((i) => isPara(made, t, i)), v = made.lines.findIndex((l) => l.kind === 'v');
            return C(`${ln(t)}와 평행한 직선은?`, others.map(ln), at, {
              figure: lineArt(made), explain: `${ln(t)}와 ${ln(others[at])}는 모두 ${ln(v)}에 수직이다. 한 직선에 수직인 두 직선은 서로 만나지 않으므로 평행하다.`,
              facts: { truth: others.map((i) => isPara(made, t, i)), want: true }
            });
          }),
          T('para-pair-count', '평행선이 몇 쌍인지 세기', '①18 ②18 ③16 심10', (d) => {
            const nv = d.pick([1, 2]), made = crossing(d, 2, nv, nv === 2 ? 1 : 2), pairs = pairsOf(made.lines.length), flags = pairs.map(([i, j]) => isPara(made, i, j));
            return N('그림에서 서로 평행한 직선은 모두 몇 쌍인가?', flags.filter(Boolean).length, {
              unit: '쌍', figure: lineArt(made), explain: `서로 평행한 직선은 ${pairs.filter((_, k) => flags[k]).map(([i, j]) => `${ln(i)}와 ${ln(j)}`).join(', ')}이다. 한 직선에 수직인 두 직선은 서로 평행하다.`,
              facts: { count: flags }
            });
          }),
          T('para-from-perp', '한 직선에 수직인 두 직선의 관계', '①19 ②16 ③15', (d) => {
            const made = crossing(d, 1, 2, 1), u = made.lines.findIndex((l) => l.kind === 'u'), [v1, v2] = made.lines.map((l, i) => (l.kind === 'v' ? i : -1)).filter((i) => i >= 0);
            const rows = d.shuffle([['서로 평행하다.', isPara(made, v1, v2)], ['서로 수직이다.', isPerp(made, v1, v2)], ['길게 늘이면 한 점에서 만난다.', !isPara(made, v1, v2)]]);
            return C(`${ln(v1)}와 ${ln(v2)}는 모두 ${ln(u)}에 수직이다. ${ln(v1)}와 ${ln(v2)}에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: lineArt(made), explain: '한 직선에 수직인 두 직선은 아무리 늘여도 서로 만나지 않는다. 서로 만나지 않는 두 직선은 평행하다.', facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('para-side-of', '도형에서 한 변과 평행한 변 찾기', '①20 ②21 ③17 심12', (d) => {
            const pts = [[3, 1], [1, 4], [3, 6], [6, 6], [8, 3], [6, 1]], names = 'ㄱㄴㄷㄹㅁㅂ'.split(''), s = sidesOf(pts), sideName = (i) => '변 ' + [names[i], names[(i + 1) % 6]].sort().join('');
            const t = d.int(0, 5), mate = s.findIndex((w, i) => i !== t && G.cross(s[t], w) === 0), rows = d.shuffle([mate].concat(d.shuffle([0, 1, 2, 3, 4, 5].filter((i) => i !== t && i !== mate)).slice(0, 3)));
            return C(`도형 ㄱㄴㄷㄹㅁㅂ에서 ${sideName(t)}과 평행한 변은?`, rows.map(sideName), rows.indexOf(mate), {
              figure: G.board(9, 7, [gp(pts), G.vertexLabels(pts, names)], { grid: 'lines', scale: 1.2, label: '모눈종이 위의 도형 ㄱㄴㄷㄹㅁㅂ' }),
              explain: `${sideName(t)}과 ${sideName(mate)}은 기울어진 정도가 같아서 늘여도 만나지 않는다. 그러므로 서로 평행하다.`, facts: { truth: rows.map((i) => G.cross(s[t], s[i]) === 0), want: true }
            });
          }),
          T('para-side-pairs', '도형에서 평행한 변의 쌍 세기', '①22 ②22 ③17 심11', (d) => {
            const pts = vary(d, d.pick([[[2, 0], [0, 3], [2, 5], [5, 5], [7, 2], [5, 0]], [[3, 0], [0, 2], [0, 5], [6, 5], [6, 2]], [[2, 0], [0, 5], [7, 5], [5, 0]], [[2, 0], [0, 5], [5, 5], [7, 0]], [[0, 0], [0, 3], [2, 5], [5, 5], [5, 0]]]));
            const s = sidesOf(pts), flags = pairsOf(s.length).map(([i, j]) => G.cross(s[i], s[j]) === 0), count = flags.filter(Boolean).length;
            return N('모눈종이에 그린 도형에서 서로 평행한 변은 모두 몇 쌍인가?', count, {
              unit: '쌍', figure: G.board(9, 7, [gp(pts.map(([x, y]) => [x + 1, y + 1]))], { grid: 'lines', scale: 1.2, label: '모눈종이 위의 도형' }),
              explain: `기울어진 정도가 같아서 늘여도 만나지 않는 두 변을 찾는다. 서로 평행한 변은 ${count}쌍이다.`, facts: { count: flags }
            });
          }),
          T('para-shape-has', '평행한 변이 있는 도형 고르기', '①23 ②20 ③18 심14', (d) => {
            const picks = d.shuffle(d.shuffle(TRAPS.concat(PGRAMS, RECTS)).slice(0, 2).concat([d.pick(TRIS), d.pick(NONES)])).map((pts) => vary(d, pts)), flags = picks.map((pts) => paraPairs(pts) > 0), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
            return C('서로 평행한 변이 있는 도형을 모두 고른 것은?', made.options, made.answer, {
              figure: tilesOf(picks), explain: `${labels.filter((_, i) => flags[i]).join(', ')}에는 늘여도 만나지 않는 두 변이 있다. 나머지 도형은 어느 두 변을 늘여도 만난다.`,
              facts: { sets: { labels, flags, options: made.sets } }
            });
          }),
          T('para-most', '평행한 변이 가장 많은 도형', '②23 ③18 심13', (d) => {
            const picks = d.shuffle(d.bool() ? [HEX, d.pick(PGRAMS.concat(RECTS)), d.pick(TRAPS), d.pick(TRIS)] : [d.pick(PGRAMS.concat(RECTS)), d.pick(TRAPS), d.pick(TRIS), d.pick(NONES)]).map((pts) => vary(d, pts)), counts = picks.map(paraPairs), at = counts.indexOf(Math.max(...counts));
            return C('서로 평행한 변이 몇 쌍인지 세었을 때, 그 수가 가장 큰 도형은?', TAGS.slice(0, 4), at, {
              figure: tilesOf(picks), explain: `서로 평행한 변의 쌍을 세면 ${picks.map((_, i) => `${TAGS[i]} ${counts[i]}쌍`).join(', ')}이다. ${TAGS[at]}가 ${counts[at]}쌍으로 가장 많다.`,
              facts: { mostAngles: counts }
            });
          }),
          T('para-not-pair', '서로 평행하지 않은 두 선분 찾기', '③20', (d) => {
            // 위·아래 두 줄은 평행하고, 두 줄을 잇는 세 선분 가운데 둘만 평행하다.
            const left = d.bool(), P = left ? { ㄱ: [1, 1], ㄴ: [4, 1], ㄷ: [7, 1], ㄹ: [0, 4], ㅁ: [3, 4], ㅂ: [7, 4] } : { ㄱ: [1, 1], ㄴ: [4, 1], ㄷ: [7, 1], ㄹ: [1, 4], ㅁ: [5, 4], ㅂ: [8, 4] };
            const par = (x, y) => G.cross(G.sub(P[x[1]], P[x[0]]), G.sub(P[y[1]], P[y[0]])) === 0, pairs = [['ㄱㄷ', 'ㄹㅂ'], ['ㄱㄴ', 'ㅁㅂ'], left ? ['ㄱㄹ', 'ㄴㅁ'] : ['ㄴㅁ', 'ㄷㅂ'], d.pick(left ? [['ㄴㅁ', 'ㄷㅂ'], ['ㄱㄹ', 'ㄷㅂ']] : [['ㄱㄹ', 'ㄴㅁ'], ['ㄱㄹ', 'ㄷㅂ']])];
            const rows = d.shuffle(pairs), ok = rows.map(([x, y]) => par(x, y)), names = Object.keys(P);
            const parts = [G.line(P.ㄱ, P.ㄷ), G.line(P.ㄹ, P.ㅂ), G.line(P.ㄱ, P.ㄹ), G.line(P.ㄴ, P.ㅁ), G.line(P.ㄷ, P.ㅂ)].concat(names.map((name) => G.point(P[name]) + G.text([P[name][0], P[name][1] + (P[name][1] === 1 ? -0.5 : 0.55)], name)));
            return C('점 종이 위에 그린 그림에서 서로 평행하지 않은 두 선분은?', rows.map(([x, y]) => `선분 ${x}과 선분 ${y}`), ok.indexOf(false), {
              figure: G.board(8, 5, parts, { grid: 'dots', scale: 1.25, label: '점 종이 위에 선분 ㄱㄷ, 선분 ㄹㅂ, 선분 ㄱㄹ, 선분 ㄴㅁ, 선분 ㄷㅂ을 그린 그림. 점 ㄴ은 선분 ㄱㄷ 위에, 점 ㅁ은 선분 ㄹㅂ 위에 있다.' }),
              explain: `점 사이의 칸을 세어 기울어진 정도를 비교한다. 선분 ${rows[ok.indexOf(false)][0]}과 선분 ${rows[ok.indexOf(false)][1]}은 기울어진 정도가 달라서 늘이면 만난다.`,
              facts: { truth: ok, want: false }
            });
          }),
          T('para-talk', '평행과 평행선에 대한 설명', '①25 ②24 ③21 심17', (d) => say(d, '평행과 평행선에 대한 설명으로 옳지 않은 것은?',
            ['평행한 두 직선은 아무리 길게 늘여도 서로 만나지 않는다.', '한 직선에 수직인 두 직선은 서로 평행하다.', '한 직선과 평행한 직선은 셀 수 없이 많이 그을 수 있다.', '평행한 두 직선을 평행선이라고 한다.'],
            ['평행한 두 직선을 길게 늘이면 언젠가 만난다.', '평행한 두 직선에서 한 직선을 다른 직선에 대한 수선이라고 한다.', '한 직선과 평행한 직선은 1개만 그을 수 있다.', '평행한 두 직선이 만나서 이루는 각은 직각이다.', '한 직선에 수직인 두 직선은 서로 수직이다.'], false,
            '평행한 두 직선은 아무리 늘여도 만나지 않으므로 만나서 이루는 각이 없다. 수선은 서로 수직으로 만나는 두 직선에서 쓰는 말이다. 한 직선에 수직인 두 직선은 서로 평행하고, 한 직선과 평행한 직선은 셀 수 없이 많다.')),
          T('para-how-many', '그을 수 있는 평행선의 수', '①25 ②26 ③22 심17', (d, n) => {
            const options = d.shuffle(['1개', '2개', '4개', '셀 수 없이 많다.']), want = n === 0 ? '셀 수 없이 많다.' : '1개';
            return C(n === 0 ? '직선 가와 평행한 직선은 몇 개 그을 수 있는가?' : '직선 가와 그 위에 있지 않은 점 ㄱ이 있다. 점 ㄱ을 지나고 직선 가와 평행한 직선은 몇 개 그을 수 있는가?', options, options.indexOf(want), {
              explain: n === 0 ? '직선 가와 떨어진 거리를 바꾸어 가며 평행한 직선을 얼마든지 그을 수 있다. 그러므로 셀 수 없이 많다.' : '직선 가와 평행한 직선은 셀 수 없이 많지만, 그 가운데 점 ㄱ을 지나는 것은 1개뿐이다.',
              facts: { truth: options.map((o) => o === want), want: true }
            });
          }, { count: 2 }),
          T('para-letters', '수직인 선분과 평행한 선분이 모두 있는 글자', '②10 ①23 심14·15', (d) => {
            // 선분으로 쓴 글자(가로 2칸, 세로 4칸). 만나는 두 선분이 직각을 이루면 수직, 방향이 같고 한 줄에 놓이지 않은 두 선분은 평행.
            const L = {
              H: [[[0, 0], [0, 4]], [[2, 0], [2, 4]], [[0, 2], [2, 2]]], E: [[[0, 0], [0, 4]], [[0, 0], [2, 0]], [[0, 2], [2, 2]], [[0, 4], [2, 4]]], F: [[[0, 0], [0, 4]], [[0, 0], [2, 0]], [[0, 2], [2, 2]]],
              T: [[[0, 0], [2, 0]], [[1, 0], [1, 4]]], L: [[[0, 0], [0, 4]], [[0, 4], [2, 4]]], N: [[[0, 0], [0, 4]], [[0, 0], [2, 4]], [[2, 0], [2, 4]]], Z: [[[0, 0], [2, 0]], [[2, 0], [0, 4]], [[0, 4], [2, 4]]],
              M: [[[0, 4], [0, 0]], [[0, 0], [1, 2]], [[1, 2], [2, 0]], [[2, 0], [2, 4]]], X: [[[0, 0], [2, 4]], [[2, 0], [0, 4]]], V: [[[0, 0], [1, 4]], [[2, 0], [1, 4]]], Y: [[[0, 0], [1, 2]], [[2, 0], [1, 2]], [[1, 2], [1, 4]]]
            };
            const dirOf = ([p, q]) => G.sub(q, p), touch = ([a, b], [p, q]) => away(a, p, q) < 1e-9 || away(b, p, q) < 1e-9 || away(p, a, b) < 1e-9 || away(q, a, b) < 1e-9;
            const hasPerp = (strokes) => pairsOf(strokes.length).some(([i, j]) => G.dot(dirOf(strokes[i]), dirOf(strokes[j])) === 0 && touch(strokes[i], strokes[j]));
            const hasPara = (strokes) => pairsOf(strokes.length).some(([i, j]) => G.cross(dirOf(strokes[i]), dirOf(strokes[j])) === 0 && G.cross(dirOf(strokes[i]), G.sub(strokes[j][0], strokes[i][0])) !== 0);
            const picks = d.shuffle([d.pick(['H', 'E', 'F']), d.pick(['T', 'L']), d.pick(['N', 'Z', 'M']), d.pick(['X', 'V', 'Y'])]), kinds = picks.map((ch) => (hasPerp(L[ch]) ? 'perp' : 'no') + (hasPara(L[ch]) ? 'para' : 'no')), at = kinds.indexOf('perppara');
            const art = (ch) => G.board(4, 5, L[ch].map(([p, q]) => G.line([p[0] + 1, p[1] + 0.5], [q[0] + 1, q[1] + 0.5]).replace('class="mb-line"', 'class="mb-line" style="stroke-width:3"')), { grid: false, label: '선분으로 쓴 글자 ' + ch });
            return C('선분으로 쓴 글자 가운데 서로 수직인 선분과 서로 평행한 선분이 모두 있는 글자는?', TAGS.slice(0, 4), at, {
              figure: G.tiles(picks.map((ch, i) => [TAGS[i], art(ch)])),
              explain: picks.map((ch, i) => `${TAGS[i]}(${ch})에는 ` + ({ perppara: '수직인 선분과 평행한 선분이 모두 있다', perpno: '수직인 선분만 있다', nopara: '평행한 선분만 있다', nono: '수직인 선분도 평행한 선분도 없다' }[kinds[i]])).join('. ') + '.',
              facts: { kindPick: { kinds: kinds.map((kind, i) => (kind === 'perppara' ? 'both' : 'no' + i)), target: 'both' } }
            });
          })
        ]
      },
      {
        id: 'dist', title: '평행선 사이의 거리', standard: LINE,
        types: [
          T('dist-word', '평행선 사이의 거리의 뜻', '①1 ②31 ③25', (d) => {
            const options = d.shuffle(['평행선 사이의 거리', '평행선', '수직', '직각']);
            return C('평행선의 한 직선에서 다른 직선에 수선을 그었다. 이 수선의 길이를 무엇이라고 하는가?', options, options.indexOf('평행선 사이의 거리'), {
              explain: '평행선의 한 직선에서 다른 직선에 수선을 그었을 때, 이 수선의 길이를 평행선 사이의 거리라고 한다.', facts: { truth: options.map((o) => o === '평행선 사이의 거리'), want: true }
            });
          }),
          T('dist-angle', '거리를 나타내는 선분이 평행선과 이루는 각', '②31 ③25', (d) => {
            const up = d.bool();
            return N(`직선 가와 직선 나는 서로 평행하고, 선분 ㄱㄴ의 길이는 평행선 사이의 거리이다. 선분 ㄱㄴ이 직선 ${up ? '가' : '나'}와 만나서 이루는 각의 크기는 몇 도인가?`, 90, {
              unit: '°', figure: band([{ off: 0, ends: ['ㄱ', 'ㄴ'] }], { gap: 2.8, label: '평행한 두 직선 가, 나와 그 사이의 선분 ㄱㄴ. 점 ㄱ은 직선 가 위에, 점 ㄴ은 직선 나 위에 있다.' }),
              explain: '평행선 사이의 거리는 평행선의 한 직선에서 다른 직선에 그은 수선의 길이이다. 수선은 두 직선과 모두 직각으로 만나므로 90°이다.', facts: { calc: [['90', 0]], unseen: [90] }
            });
          }),
          T('dist-pick', '평행선 사이의 거리를 나타내는 선분 고르기', '①29 ②32 ③26 심20', (d) => {
            const sign = () => (d.bool() ? 1 : -1), offs = d.shuffle([0, 0, 0.9 * sign(), 1.2 * sign(), 1.5 * sign()]), flags = offs.map((off) => off === 0), made = setOptions(d, MARKS, flags);
            return C('직선 가와 직선 나는 서로 평행하다. 평행선 사이의 거리를 나타내는 선분을 모두 고른 것은?', made.options, made.answer, {
              figure: band(offs.map((off, i) => ({ off, tag: MARKS[i], mark: off === 0 })), { label: `평행한 두 직선 가, 나 사이에 그은 선분 ${MARKS.join(', ')}. 직각 표시가 있는 선분: ${MARKS.filter((_, i) => flags[i]).join(', ')}` }),
              explain: `평행선 사이의 거리는 평행선에 수직인 선분의 길이이다. 두 직선과 직각으로 만나는 선분은 ${MARKS.filter((_, i) => flags[i]).join(', ')}이다.`,
              facts: { sets: { labels: MARKS, flags, options: made.sets } }
            });
          }),
          T('dist-shortest', '평행선을 잇는 가장 짧은 선분', '①30 ②32 ③25', (d) => {
            const sign = () => (d.bool() ? 1 : -1), offs = d.shuffle([0, 0.9 * sign(), 1.4 * sign(), 1.9 * sign()]), at = offs.indexOf(0);
            return C('직선 가와 직선 나는 서로 평행하다. 두 직선 사이에 그은 선분 가운데 길이가 가장 짧은 것은?', MARKS.slice(0, 4), at, {
              figure: band(offs.map((off, i) => ({ off, tag: MARKS[i] })), { label: `평행한 두 직선 가, 나 사이에 그은 선분 ${MARKS.slice(0, 4).join(', ')}. 선분 ${MARKS[at]}만 두 직선에 수직이고 나머지는 비스듬하다.` }),
              explain: `평행선 사이에 그은 선분 가운데 평행선에 수직인 선분이 가장 짧다. 두 직선에 수직인 선분은 ${MARKS[at]}이다.`,
              facts: { kindPick: { kinds: offs.map((off, i) => (off === 0 ? 'perp' : 'no' + i)), target: 'perp' } }
            });
          }),
          T('dist-read', '길이가 적힌 선분에서 평행선 사이의 거리 읽기', '①31·40 ②33 ③27 심21', (d) => {
            const h = d.pick([12, 24, 15, 20]), two = d.shuffle(SLANTS[h]).slice(0, 2), gap = Math.min(3.2, (5 * h) / (two[0][1] + two[1][1])), k = gap / h, sign = () => (d.bool() ? 1 : -1);
            const segs = d.shuffle([{ off: 0, text: cm(h), mark: true, len: h }].concat(two.map(([len, out]) => ({ off: out * k * sign(), text: cm(len), len }))));
            return N('직선 가와 직선 나는 서로 평행하다. 평행선 사이의 거리는 몇 cm인가?', h, {
              unit: 'cm', figure: band(segs, { gap, label: `평행한 두 직선 가, 나 사이에 그은 선분 3개. 왼쪽부터 ${segs.map((s) => (s.mark ? '두 직선에 수직인 선분 ' : '비스듬한 선분 ') + s.text).join(', ')}` }),
              explain: `평행선 사이의 거리는 평행선에 수직인 선분의 길이이다. 직각 표시가 있는 선분의 길이가 ${h} cm이므로 ${h} cm이다. 비스듬한 선분은 수직인 선분보다 길다.`,
              facts: { minOf: segs.map((s) => s.len) }
            });
          }),
          T('dist-same-length', '평행선 사이의 거리와 길이가 같은 선분 고르기', '③28', (d) => {
            // 평행선 사이의 거리는 어디에서 재어도 같다: 두 직선에 수직인 선분은 길이가 모두 같다.
            const h = d.int(4, 15), sign = () => (d.bool() ? 1 : -1), first = d.bool(), rest = d.shuffle(d.bool() ? [0, 0, 1.3 * sign()] : [0, 1.0 * sign(), 1.6 * sign()]), offs = first ? [0].concat(rest) : rest.concat([0]), known = first ? 0 : 3;
            const labels = MARKS.slice(0, 4), flags = offs.map((off) => off === 0), made = setOptions(d, labels, flags);
            return C(`직선 가와 직선 나는 서로 평행하다. 선분 ${labels[known]}의 길이가 ${h} cm일 때, 길이가 ${h} cm인 선분을 모두 고른 것은?`, made.options, made.answer, {
              figure: band(offs.map((off, i) => ({ off, tag: labels[i], mark: off === 0, text: i === known ? cm(h) : '', left: first })), { label: `평행한 두 직선 가, 나 사이에 그은 선분 ${labels.join(', ')}. 직각 표시가 있는 선분: ${labels.filter((_, i) => flags[i]).join(', ')}. 선분 ${labels[known]}의 길이 ${h} cm` }),
              explain: `평행선 사이의 거리는 어디에서 재어도 같다. 두 직선에 수직인 선분 ${labels.filter((_, i) => flags[i]).join(', ')}의 길이는 모두 ${h} cm이고, 비스듬한 선분은 ${h} cm보다 길다.`,
              facts: { sets: { labels, flags, options: made.sets } }
            });
          }),
          T('dist-shape', '사다리꼴의 평행한 두 변 사이의 거리', '①33·35 ②35 심23', (d) => {
            // 직각이 둘인 사다리꼴: 평행한 두 변에 수직인 변의 길이가 거리이다. 비스듬한 변의 길이도 적어 둔다.
            const [h, slant, out] = d.pick([[12, 13, 5], [8, 10, 6], [12, 15, 9], [15, 17, 8], [4, 5, 3]]), t = Math.round(h * d.pick([0.5, 0.75])), b = t + out, flip = d.bool();
            const raw = flip ? [[out, 0], [0, h], [b, h], [b, 0]] : [[0, 0], [0, h], [b, h], [t, 0]], upright = flip ? 'ㄷㄹ' : 'ㄱㄴ', tilted = flip ? 'ㄱㄴ' : 'ㄷㄹ';
            return N('사다리꼴 ㄱㄴㄷㄹ에서 변 ㄱㄹ과 변 ㄴㄷ은 서로 평행하다. 이 평행선 사이의 거리는 몇 cm인가?', h, {
              unit: 'cm', figure: shape(raw, { names: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], sides: { 0: cm(flip ? slant : h), 1: cm(b), 2: cm(flip ? h : slant), 3: cm(t) }, rights: flip ? [2, 3] : [0, 1], box: [6, 3.8],
                label: `사다리꼴 ㄱㄴㄷㄹ. 변 ㄱㄹ ${t} cm, 변 ㄴㄷ ${b} cm, 변 ${upright} ${h} cm, 변 ${tilted} ${slant} cm. 변 ${upright}은 변 ㄱㄹ, 변 ㄴㄷ과 직각으로 만난다.` }),
              explain: `평행선 사이의 거리는 평행한 두 변에 수직인 선분의 길이이다. 변 ${upright}이 변 ㄱㄹ, 변 ㄴㄷ과 직각으로 만나므로 거리는 변 ${upright}의 길이인 ${h} cm이다. 비스듬한 변 ${tilted}의 길이는 거리가 아니다.`,
              facts: { calc: [[String(h), 0]] }
            });
          }),
          T('dist-drop', '수선을 그은 사다리꼴에서 평행선 사이의 거리', '③27 ①33', (d) => {
            const [h, s1, o1, s2, o2] = d.pick([[12, 15, 9, 13, 5], [12, 13, 5, 15, 9], [24, 26, 10, 25, 7], [24, 25, 7, 30, 18], [15, 17, 8, 25, 20], [24, 30, 18, 26, 10]]), t = Math.round(h * d.pick([0.5, 0.75])), b = o1 + t + o2;
            const raw = [[o1, 0], [0, h], [b, h], [o1 + t, 0], [o1 + t, h]];
            const extra = (p) => G.line(p[3], p[4], 'mb-line is-cut') + G.rightMark(p[4], p[3], p[1]) + G.text([p[4][0], p[4][1] + 0.5], 'ㅁ') + G.text([p[3][0] - 0.35 - cm(h).length * 0.155, (p[3][1] + p[4][1]) / 2], cm(h), 'mb-label is-length');
            return N('사다리꼴 ㄱㄴㄷㄹ에서 변 ㄱㄹ과 변 ㄴㄷ은 서로 평행하고, 선분 ㄹㅁ은 변 ㄴㄷ에 수직이다. 변 ㄱㄹ과 변 ㄴㄷ 사이의 거리는 몇 cm인가?', h, {
              unit: 'cm', figure: shape(raw, { count: 4, names: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], sides: { 0: cm(s1), 2: cm(s2) }, extra, box: [7.4, 3.8], pad: [1.9, 1],
                label: `사다리꼴 ㄱㄴㄷㄹ. 변 ㄱㄴ ${s1} cm, 변 ㄹㄷ ${s2} cm. 꼭짓점 ㄹ에서 변 ㄴㄷ에 그은 수선 ㄹㅁ의 길이 ${h} cm` }),
              explain: `평행선 사이의 거리는 평행한 두 변에 수직인 선분의 길이이다. 선분 ㄹㅁ이 변 ㄴㄷ에 수직이므로 거리는 ${h} cm이다. 변 ㄱㄴ과 변 ㄹㄷ은 비스듬하여 거리보다 길다.`,
              facts: { minOf: [h, s1, s2] }
            });
          }),
          T('dist-grid', '모눈종이에서 평행선 사이의 거리', '③29', (d) => {
            const h = d.int(2, 4), a = d.int(2, 3), pts = [[a, 1], [1, 1 + h], [8, 1 + h], [d.int(5, 6), 1]], rows = [0, 1, 2, 3, 4, 5];
            return N('모눈 한 칸의 길이는 1 cm이다. 사각형 ㄱㄴㄷㄹ에서 평행한 두 변 ㄱㄹ과 ㄴㄷ 사이의 거리는 몇 cm인가?', h, {
              unit: 'cm', figure: G.board(9, 2 + h, [gp(pts), G.vertexLabels(pts, ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'])], { grid: 'lines', scale: 1.2, label: '모눈종이 위의 사각형 ㄱㄴㄷㄹ. 변 ㄱㄹ과 변 ㄴㄷ은 가로줄 위에 있다.' }),
              explain: `평행한 두 변에 수직인 선분의 길이를 모눈의 칸으로 센다. 변 ㄱㄹ과 변 ㄴㄷ 사이에 모눈이 세로로 ${h}칸 있으므로 ${h} cm이다.`,
              facts: { count: rows.map((y) => y >= 1 && y < 1 + h) }
            });
          }),
          T('dist-grid-find', '도형에서 평행한 두 변을 찾아 거리 구하기', '③31 ①33 심22', (d) => {
            // 세로로 놓인 두 변만 평행하다. 그 사이의 가로 칸 수가 거리이다.
            const w = d.pick([4, 5, 6]), mir = d.bool(), pts = [[1, 2], [1, 5], [4, 6], [1 + w, 4], [1 + w, 1]].map(([x, y]) => [mir ? 2 + w - x : x, y]), cols = [0, 1, 2, 3, 4, 5, 6, 7];
            return N('모눈 한 칸의 길이는 1 cm이다. 도형에서 서로 평행한 두 변을 찾아 그 사이의 거리를 구하면 몇 cm인가?', w, {
              unit: 'cm', figure: G.board(w + 2, 7, [gp(pts)], { grid: 'lines', scale: 1.2, label: '모눈종이 위의 도형. 세로줄 위에 놓인 변이 2개 있다.' }),
              explain: `세로줄 위에 놓인 두 변이 서로 평행하다. 두 변 사이에 모눈이 가로로 ${w}칸 있으므로 평행선 사이의 거리는 ${w} cm이다.`,
              facts: { count: cols.map((x) => x >= 1 && x < 1 + w) }
            });
          }),
          T('dist-three-add', '평행선 여럿: 거리 더하기', '①36 ②37 ③34 심24', (d) => {
            const n = d.pick([2, 3]), dists = d.until(() => Array.from({ length: n }, () => d.int(3, 9)), (list) => Math.max(...list) <= Math.min(...list) * 2 && new Set(list).size === n), total = dists.reduce((s, v) => s + v, 0);
            return N(`직선 ${TAGS.slice(0, n + 1).join(', ')}는 서로 평행하다. 직선 가와 직선 ${TAGS[n]} 사이의 거리는 몇 cm인가?`, total, {
              unit: 'cm', figure: ladder(dists, dists.map(cm)), explain: `직선 가와 직선 ${TAGS[n]} 사이의 거리는 이웃한 평행선 사이의 거리를 모두 더한 것과 같다. ${dists.join(' + ')} = ${total}(cm)`,
              facts: { calc: [[dists.join('+'), 0]] }
            });
          }),
          T('dist-three-sub', '평행선 셋: 전체에서 빼기', '①37 ②38 심25', (d) => {
            const [a, b] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([x, y]) => x !== y && Math.max(x, y) <= Math.min(x, y) * 2), upper = d.bool();
            return N(`직선 가, 나, 다는 서로 평행하다. 직선 ${upper ? '나와 직선 다' : '가와 직선 나'} 사이의 거리는 몇 cm인가?`, upper ? b : a, {
              unit: 'cm', figure: ladder([a, b], upper ? [cm(a), null] : [null, cm(b)], cm(a + b)),
              explain: `직선 가와 직선 다 사이의 거리에서 직선 ${upper ? '가와 직선 나' : '나와 직선 다'} 사이의 거리를 뺀다. ${a + b} − ${upper ? a : b} = ${upper ? b : a}(cm)`,
              facts: { calc: [[`${a + b}-${upper ? a : b}`, 0]] }
            });
          }),
          T('dist-talk', '평행선 사이의 거리에 대한 설명', '②41 ③33 심17', (d) => say(d, '평행선 사이의 거리에 대한 설명으로 옳지 않은 것은?',
            ['평행선 사이에 그은 선분 가운데 가장 짧은 선분의 길이이다.', '평행선의 한 직선에서 다른 직선에 그은 수선의 길이이다.', '평행선의 어디에서 재어도 길이가 같다.'],
            ['재는 곳에 따라 길이가 달라진다.', '평행선 사이에 그은 선분 가운데 가장 긴 선분의 길이이다.', '평행선 사이에 비스듬히 그은 선분의 길이이다.'], false,
            '평행선 사이의 거리는 평행선의 한 직선에서 다른 직선에 그은 수선의 길이이다. 이 수선은 평행선 사이에 그은 선분 가운데 가장 짧고, 평행선의 어디에서 그어도 길이가 같다.')),
          T('dist-drawn-pick', '거리에 맞게 그은 평행선 고르기', '②40 ①41 심18', (d) => {
            const want = d.pick([2, 3]), y = 1, rows = d.shuffle([[[0, y + want], [4, y + want]], [[0, y + want + 1], [4, y + want + 1]], [[0, y + want - 1], [4, y + want - 1]], d.bool() ? [[0, y + want - 1], [4, y + want]] : [[0, y + want], [4, y + want - 1]]]);
            const ok = rows.map(([p, q]) => p[1] === q[1] && p[1] - y === want), at = ok.indexOf(true);
            return C(`모눈 한 칸의 길이는 1 cm이다. 직선 가와 평행하고, 직선 가와의 거리가 ${want} cm인 직선 나를 바르게 그은 것은?`, CIRCLED.slice(0, 4), at, {
              figure: G.tiles(rows.map(([p, q], i) => [CIRCLED[i], G.board(4, 5, [G.line([0, y], [4, y]), G.line(p, q), G.text([0.35, y - 0.4], '가'), G.text([0.35, Math.min(p[1], q[1]) - 0.4 + (p[1] > q[1] ? 0.75 : 0)], '나')], { grid: 'lines', label: '모눈종이 위의 직선 가와 직선 나' })])),
              explain: `직선 가와 평행하려면 직선 나도 가로줄을 따라 그어야 하고, 두 직선 사이에 모눈이 세로로 ${want}칸 있어야 한다. ${CIRCLED[at]}${['이', '가', '이', '가'][at]} 그렇게 그은 것이다.`,
              facts: { kindPick: { kinds: ok.map((good, i) => (good ? 'right' : 'no' + i)), target: 'right' } }
            });
          }),
          T('dist-bridge', '평행선까지 가장 짧은 선분을 그을 점', '③36 ②42', (d) => {
            // 비스듬히 놓인 평행선: 직선 가 위의 점 ㄱ에서 직선 나에 그은 수선이 닿는 점을 고른다.
            const mir = d.bool(), mx = ([x, y]) => [mir ? 8 - x : x, y], o = mx([2, 4]), side = mir ? -1 : 1, dir = [side, 1];
            const points = d.shuffle([[4, 0], [6, 2], [7, 3], [8, 4]]).slice(0, 3).concat([[5, 1]]).sort((p, q) => p[0] - q[0]).map(mx);
            const triples = points.map((c) => [c, [c[0] + dir[0], c[1] + dir[1]], o]), at = triples.findIndex(([v, p, q]) => G.isRight(v, p, q));
            const base = [G.line(mx([0, 2]), mx([4, 6])), G.line(mx([4, 0]), mx([8, 4])), G.point(o), G.text([o[0] - 0.4 * side, o[1] + 0.42], 'ㄱ'), G.text(mx([0.75, 1.85]), '가'), G.text(mx([3.85, 0.75]), '나')].concat(points.map((p, i) => G.point(p) + G.text([p[0] + 0.45 * side, p[1] - 0.45], CIRCLED[i], 'mb-label is-small')));
            return C('점 종이 위에 서로 평행한 직선 가와 직선 나가 있다. 직선 가 위의 점 ㄱ에서 직선 나까지 가장 짧은 선분을 그으려고 한다. 점 ㄱ과 이어야 할 점은?', CIRCLED.slice(0, 4), at, {
              figure: G.board(8, 6, base, { grid: 'dots', scale: 1.25, label: '점 종이 위에 비스듬히 놓인 평행한 두 직선 가, 나. 직선 가 위의 점 ㄱ과 직선 나 위의 점 넷' }),
              explain: `평행선 사이에 그은 선분 가운데 평행선에 수직인 선분이 가장 짧다. 점 ㄱ과 점 ${CIRCLED[at]}${['을', '를', '을', '를'][at]} 이은 선분이 직선 나와 직각으로 만난다.` + G.board(8, 6, [G.line(o, points[at]), G.rightMark(points[at], o, [points[at][0] + dir[0], points[at][1] + dir[1]])].concat(base), { grid: 'dots', label: '평행선에 수직인 선분' }),
              facts: { anglePick: triples }
            });
          })
        ]
      },
      {
        id: 'trap', title: '사다리꼴', standard: QUAD,
        types: [
          T('trap-word', '사다리꼴의 뜻', '①42 ②44 ③38', (d) => {
            const want = '평행한 변이 한 쌍이라도 있는 사각형', options = d.shuffle([want, '평행한 변이 없는 사각형', '네 변의 길이가 모두 같은 사각형', '네 각이 모두 직각인 사각형']);
            return C('사다리꼴의 뜻으로 알맞은 것은?', options, options.indexOf(want), { explain: '평행한 변이 한 쌍이라도 있는 사각형을 사다리꼴이라고 한다.', facts: { truth: options.map((o) => o === want), want: true } });
          }),
          T('trap-find', '사다리꼴 찾기', '①43 ②45 ③39 심36', (d) => {
            const picks = d.shuffle(d.shuffle(TRAPS).slice(0, 2).concat(d.shuffle(NONES).slice(0, 2))).map((pts) => vary(d, pts)), flags = picks.map((pts) => kindOf(pts).trap), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
            return C('사다리꼴을 모두 고른 것은?', made.options, made.answer, {
              figure: tilesOf(picks, '모눈종이 위의 사각형'), explain: `${labels.filter((_, i) => flags[i]).join(', ')}에는 평행한 변이 한 쌍 있다. 나머지 사각형에는 평행한 변이 없다.`,
              facts: { sets: { labels, flags, options: made.sets } }
            });
          }),
          T('trap-why', '사다리꼴인 까닭', '②46 ③40 심37', (d) => {
            const pts = vary(d, d.pick(TRAPS.slice(0, 4))), k = kindOf(pts), s = sidesOf(pts);
            const rows = d.shuffle([['평행한 변이 한 쌍 있기 때문이다.', k.trap], ['네 변의 길이가 모두 같기 때문이다.', new Set(s.map(G.len2)).size === 1], ['네 각이 모두 직각이기 때문이다.', G.rightAngles(pts) === 4], ['마주 보는 두 쌍의 변이 서로 평행하기 때문이다.', k.pgram]]);
            return C('모눈종이에 그린 사각형은 사다리꼴이다. 그 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: G.board(4, 3, [gp(centered(pts, 4, 3))], { grid: 'lines', scale: 1.5, label: '모눈종이 위의 사각형' }),
              explain: '평행한 변이 한 쌍이라도 있는 사각형이 사다리꼴이다. 이 사각형은 한 쌍의 변만 서로 평행하고, 네 변의 길이가 모두 같거나 네 각이 모두 직각인 것은 아니다.',
              facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('trap-parallel-sides', '사다리꼴에서 평행한 두 변', '①21 ②21 ③17 심36', (d) => {
            const pts = d.pick([[[3, 1], [1, 5], [8, 5], [6, 1]], [[2, 1], [2, 6], [7, 5], [7, 3]], [[4, 1], [1, 5], [8, 5], [8, 1]], [[1, 2], [1, 5], [7, 6], [7, 1]]]), names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], s = sidesOf(pts), sideName = (i) => '변 ' + [names[i], names[(i + 1) % 4]].sort().join('');
            const rows = d.shuffle([[0, 2], [1, 3], [0, 1], [2, 3]]), ok = rows.map(([i, j]) => G.cross(s[i], s[j]) === 0);
            return C('사다리꼴 ㄱㄴㄷㄹ에서 서로 평행한 두 변은?', rows.map(([i, j]) => `${sideName(i)}과 ${sideName(j)}`), ok.indexOf(true), {
              figure: G.board(9, 7, [gp(pts), G.vertexLabels(pts, names)], { grid: 'lines', scale: 1.2, label: '모눈종이 위의 사다리꼴 ㄱㄴㄷㄹ' }),
              explain: `${sideName(rows[ok.indexOf(true)][0])}과 ${sideName(rows[ok.indexOf(true)][1])}은 모눈의 같은 방향 줄 위에 있어서 늘여도 만나지 않는다. 나머지 두 변은 늘이면 만난다.`,
              facts: { truth: ok, want: true }
            });
          }),
          T('trap-strip', '종이띠를 자른 조각 가운데 사다리꼴의 수', '①86 ②47 ③45 심90', (d) => {
            const strip = stripOf(d), flags = strip.pieces.map((p) => p.trap), count = flags.filter(Boolean).length;
            return N('직사각형 모양의 종이띠를 선을 따라 잘랐다. 잘라 낸 조각 가운데 사다리꼴은 모두 몇 개인가?', count, {
              unit: '개', figure: strip.figure, explain: `종이띠의 위쪽 변과 아래쪽 변이 서로 평행하므로, 잘라 낸 사각형 조각은 모두 평행한 변이 있는 사다리꼴이다. 사각형 조각은 ${strip.tags.filter((_, i) => flags[i]).join(', ')}의 ${count}개이고, 나머지는 삼각형이다.`,
              facts: { count: flags }
            });
          }),
          T('trap-point', '사다리꼴이 되는 꼭짓점 고르기', '①44 ②48 ③46 심38', (d) => {
            // 두 선분 ㄱㄴ, ㄴㄷ이 주어지고, 넷째 꼭짓점을 골라 사각형을 만든다. 변 ㄴㄷ과 평행한 변이 생기는 점은 하나뿐이다.
            const mir = d.bool(), mx = ([x, y]) => [mir ? 8 - x : x, y], P = mx([2, 2]), Q = mx([1, 5]), R = mx([6, 5]), far = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= 2;
            const points = d.until(() => d.shuffle([d.pick([[4, 2], [5, 2], [6, 2]])].concat(d.shuffle([[5, 1], [4, 3], [5, 3], [6, 3], [4, 1], [3, 1], [6, 1]]).slice(0, 3))), (list) => list.every((p, i) => list.every((q, j) => i === j || far(p, q)))).map(mx);
            const kinds = points.map((S, i) => (kindOf([P, Q, R, S]).trap ? 'trap' : 'no' + i)), at = kinds.indexOf('trap');
            const base = [G.line(P, Q), G.line(Q, R), G.point(P), G.point(Q), G.point(R)].concat(points.map((p, i) => G.point(p) + G.text([p[0] + 0.45, p[1] - 0.35], CIRCLED[i], 'mb-label is-small')));
            return C('점 종이 위에 선분 2개가 그려져 있다. 한 점을 골라 두 선분의 끝과 이어 사다리꼴을 완성하려고 한다. 골라야 하는 점은?', CIRCLED.slice(0, 4), at, {
              figure: G.board(8, 6, base, { grid: 'dots', scale: 1.25, label: '점 종이 위에 한 끝이 이어진 선분 2개와 점 넷' }),
              explain: `점 ${CIRCLED[at]}${['을', '를', '을', '를'][at]} 고르면 아래쪽 변과 평행한 변이 생겨 평행한 변이 한 쌍 있는 사각형이 된다.` + G.board(8, 6, [G.polygon([P, Q, R, points[at]])].concat(base), { grid: 'dots', label: '완성한 사다리꼴' }),
              facts: { kindPick: { kinds, target: 'trap' } }
            });
          }),
          T('trap-talk', '사다리꼴에 대한 설명', '②49 ③41', (d) => say(d, '사다리꼴에 대한 설명으로 옳은 것은?',
            ['평행한 변이 한 쌍이라도 있다.', '평행한 변이 한 쌍만 있어도 사다리꼴이다.'],
            ['네 변의 길이가 언제나 모두 같다.', '이웃한 두 각의 크기가 언제나 같다.', '서로 평행한 변이 없다.', '네 각이 언제나 모두 직각이다.', '마주 보는 두 변의 길이가 언제나 같다.'], true,
            '사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이다. 변의 길이나 각의 크기는 정해져 있지 않다.'))
        ]
      },
      { id: 'pgram', title: '평행사변형', standard: QUAD, types: [] },
      { id: 'rhom', title: '마름모', standard: QUAD, types: [] },
      { id: 'kinds', title: '여러 가지 사각형', standard: QUAD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
