// 4학년 2학기 2단원 사각형 — 평행사변형, 마름모, 여러 가지 사각형의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3의 「평행사변형」「마름모」「직사각형·정사각형과 여러 가지 사각형」「자르고 접고 이어 붙인 사각형」 묶음, 심화꼴 102꼴)을 번호마다 따져서 실었다.
//
// 실력 문항의 잣대: 실력에는 두 가지만 둔다.
//   ① 그림·상황 자체에 함정이 있어 뜻을 정확히 대야 풀리는 문제. 어려움이 보기가 아니라 문제의 장치에서 나온다.
//      - 그림에서는 만나지 않지만 늘이면 만나는 두 선분, 길이와 놓인 자리가 다른 평행한 두 선분을 섞어 놓고 평행한 것을 센다.
//      - 서로 평행한 직선이 셋인 그림에서 평행선의 쌍을 센다. 계단 모양 도형에서 평행한 변의 길이까지 적어 놓고 두 변 사이의 거리를 묻는다.
//      - 평행사변형·직사각형·마름모를 섞어 놓고 사다리꼴을 센다. 비스듬히 놓인 정사각형과 마름모를 섞어 놓고 정사각형·직사각형을 센다.
//   ② 성질을 두 번 넘게 이어 써야 풀리는 변·각 문제(평행선과 수선·삼각형의 각, 평행사변형·마름모에 그은 선분, 이어 붙인 사각형, 겹친 종이띠).
// 기본에서 이미 하는 일(뜻·이름 되묻기, 성질 하나로 변·각 하나 구하기)을 고르기로 바꾸고 틀린 보기에 흔한 실수를 넣은 것은 실력이 아니다.
// 그런 꼴(비스듬한 선분의 길이를 거리로 읽은 말 가리기, 한 각만 아는 마름모의 네 각 말하기, 거꾸로 말한 사각형 사이의 관계 고르기, 비스듬한 정사각형의 이름 모두 고르기)은
// 기본의 「길이가 적힌 선분에서 거리 읽기」「마름모의 마주 보는·이웃한 각」「사각형 사이의 관계」「한 사각형의 이름 모두 고르기」가 같은 일을 하므로 싣지 않았다.
// 평행선에서 엇갈린 쪽·같은 쪽 각이 같다는 성질과 맞꼭지각은 쓰지 않는다. 수선을 긋거나 사각형의 네 각의 합·삼각형의 세 각의 합·직선 위의 각 180°만으로 푼다.
//
// 뺀 것과 까닭(4-2-2a.js에 적은 것 말고)
//  - 네 변의 길이의 합(①55·56·67·68·74·75·94 ②65·77·93·94·101·102 ③55·56·64·65·66·82·86·88 심50·51·62·63·77·79·81~85, 심75·96의 일부):
//    더하는 꼴도, 합에서 한 변을 거꾸로 구하는 꼴도, 끈·철사로 만든 사각형의 한 변도, 이어 붙인 도형의 굵은 선도 모두 둘레다(5학년 「다각형의 둘레와 넓이」).
//    이어 붙인 도형에서 성질로 한 변만 구하는 것은 실었다(정사각형과 마름모, 이등변삼각형과 평행사변형, 직사각형 속의 정사각형, 평행사변형에서 잘라 낸 마름모).
//  - 대각선(②95 심74·75, 심96의 디딤돌 꼴, ①79·②84·심70의 대각선 조건): 「대각선」이라는 낱말과 직사각형·정사각형·평행사변형의 대각선 성질은 4-2-4 「다각형」이다.
//    마름모에서 「마주 보는 꼭짓점끼리 이은 두 선분이 수직으로 만나고 서로를 똑같이 둘로 나눈다」는 이 단원의 성질이므로 그 말 그대로 실었다(①66 ③63 심60·61).
//  - 한 각이 이웃한 각의 몇 배(①69 ②61): 합과 배로 두 수를 찾는 조건 풀이다. 두 각의 차·두 변의 길이의 합(①55·66·67의 변형 ②58·60의 변형 ③54 심46·58의 변형)은 뜻 없는 셈.
//  - 크고 작은 사각형 세기(①92 ②106 ③90 심100·101·102): 경우 따지기
//  - 접은 종이에서 접은 각이 같다는 것(심97): 5학년 합동. 한 쌍의 변이 평행하고 길이가 같은 사각형(②105): 평행사변형이 되는 조건은 중학교.
//  - 그리기·완성하기·꼭짓점 옮기기(①57·58·71·84 ②66·67·78·79·96 ③47·48·83·85 심44·56·76), 까닭·성질 쓰기(①85 ②56의 까닭 ③70·84 심42·54·66): 작도·서술형.
//    고르기로 바꿀 수 있는 것(평행사변형·마름모가 되는 점, 정사각형이 아닌 까닭)은 바꾸어 실었다.
//  - 사다리꼴 속 마름모의 각(심87)·장화 모양 그림(심89): 뽑은 글에 그림이 없어 얼개를 알 수 없고 조건 셋을 이어야 풀린다. 같은 생각은 「이어 붙인 도형의 각」들이 묻는다.
//  - 빈칸 수의 크기 차례(심72의 지학사 꼴)·사다리꼴 5 + 평행사변형 3 − 직사각형 2(심68의 지학사 꼴): 뜻 없는 셈
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C, josa, tagged } = B.kit;
  const G = B.kit.geo;
  const UNIT = '4-2-2', LINE = '4수03-03', QUAD = '4수03-10';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바'], CIRCLED = ['①', '②', '③', '④', '⑤'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const RAD = Math.PI / 180;
  const cm = (v) => v + ' cm';
  const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const unit = (w) => { const s = Math.hypot(w[0], w[1]); return [w[0] / s, w[1] / s]; };

  // (아래 「보기 짜기」부터 「종이띠를 자른 조각」까지는 4-2-2a.js와 같은 도구다.)
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

  // ── 그림(이 파일에서만 쓰는 것) ──────────────────────────────
  const N4 = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], ANG4 = ['각 ㄴㄱㄹ', '각 ㄱㄴㄷ', '각 ㄴㄷㄹ', '각 ㄱㄹㄷ'], SIDE4 = ['변 ㄱㄴ', '변 ㄴㄷ', '변 ㄷㄹ', '변 ㄱㄹ'];
  const NAMES5 = ['사다리꼴', '평행사변형', '마름모', '직사각형', '정사각형'];
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';
  // 밑변 a, 옆변 b, 왼쪽 아래 각이 deg°인 평행사변형 [ㄱ 왼쪽 위, ㄴ 왼쪽 아래, ㄷ 오른쪽 아래, ㄹ 오른쪽 위]. 꼭짓점 ㄴ, ㄹ의 각이 deg°, ㄱ, ㄷ의 각이 (180 − deg)°이다.
  const pg = (a, b, deg) => { const c = b * Math.cos(deg * RAD), s = b * Math.sin(deg * RAD); return [[c, 0], [0, s], [a, s], [a + c, 0]]; };
  const SLOPES = [55, 60, 65, 70, 110, 115, 120, 125];
  // 세 점 p–v–q 가 이루는 각에 호와 글을 넣는다.
  function wedge(v, p, q, label, r) {
    const a = G.bearing(v, p), b = G.bearing(v, q);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    return sector(v, from, to, label, r);
  }
  // 점 여럿으로 이루어진 그림: raw 를 판에 맞춘 뒤 build(맞춘 점들)가 그릴 것을 돌려준다.
  function scene(raw, build, o) { const fit = place(raw, o.box || [6.2, 4], o.pad || [1.7, 1]); return draw(fit, build(fit.points, fit), o.label, o.scale); }
  // 그림 전체의 가운데에서 바깥쪽으로 밀어 적는 이름(이름이 '' 이면 적지 않는다)
  const outs = (pts, names, amount) => names.map((name, i) => (name ? G.text(G.outward(pts, i, amount || 0.6), name) : '')).join('');
  const thin = (p, q) => G.line(p, q, 'mb-line is-thin');
  const dashed = (p, q) => G.line(p, q, 'mb-line is-cut');
  const lengthAt = (at, value) => G.text(at, value, 'mb-label is-length');
  // 밑변 p–q 의 길이는 꼭짓점 이름보다 아래에 적어, 밑변 위에 놓인 점의 이름과 겹치지 않게 한다.
  const under = (p, q, value) => lengthAt([(p[0] + q[0]) / 2, p[1] + 1.0], value);
  // 마주 보는 꼭짓점끼리 이은 두 선분을 그은 마름모 [ㄱ 위, ㄴ 왼쪽, ㄷ 아래, ㄹ 오른쪽, ㅇ 두 선분이 만나는 점]. w, h: 가로·세로로 놓인 선분의 반
  function diamond(w, h, build, label, box) {
    return scene([[0, -h], [-w, 0], [0, h], [w, 0], [0, 0]], (p) => [G.polygon(p.slice(0, 4)), thin(p[0], p[2]), thin(p[1], p[3]), G.text([p[0][0], p[0][1] - 0.5], 'ㄱ'), G.text([p[1][0] - 0.5, p[1][1]], 'ㄴ'), G.text([p[2][0], p[2][1] + 0.5], 'ㄷ'), G.text([p[3][0] + 0.5, p[3][1]], 'ㄹ'), G.text([p[4][0] + 0.38, p[4][1] + 0.42], 'ㅇ')].concat(build ? build(p) : []), { box: box || [5.8, 4.4], pad: [1.5, 1.1], label });
  }
  const RHOMBI = [[[2, 0], [4, 1], [2, 2], [0, 1]], [[0, 0], [2, 1], [3, 3], [1, 2]], [[1, 0], [2, 2], [1, 4], [0, 2]]];
  const SQUARES = [[[0, 0], [3, 0], [3, 3], [0, 3]], [[0, 0], [2, 0], [2, 2], [0, 2]]], TILTED = [[[1, 0], [3, 1], [2, 3], [0, 2]], [[2, 0], [4, 2], [2, 4], [0, 2]]];
  // 여럿을 고르는 보기를 손수 짠다. lists: 보기마다 고를 이름표들(첫째가 정답). 이름표는 labels 차례로 적는다.
  function handSets(d, labels, lists) {
    const key = (s) => s.join(', '), sets = d.shuffle(lists.map((list) => labels.filter((l) => list.includes(l)))), right = key(labels.filter((l) => lists[0].includes(l)));
    return { sets, options: sets.map(key), answer: sets.findIndex((s) => key(s) === right) };
  }
  // 사각형마다 언제나 가지는 성질
  const PROP = { para1: '평행한 변이 한 쌍이라도 있다', para2: '마주 보는 두 쌍의 변이 서로 평행하다', sides4: '네 변의 길이가 모두 같다', angles4: '네 각의 크기가 모두 같다', oppSides: '마주 보는 두 변의 길이가 같다', oppAngles: '마주 보는 두 각의 크기가 같다' };
  const HAS = { 사다리꼴: ['para1'], 평행사변형: ['para1', 'para2', 'oppSides', 'oppAngles'], 마름모: ['para1', 'para2', 'oppSides', 'oppAngles', 'sides4'], 직사각형: ['para1', 'para2', 'oppSides', 'oppAngles', 'angles4'], 정사각형: ['para1', 'para2', 'oppSides', 'oppAngles', 'sides4', 'angles4'] };
  // a 는 b 라고 할 수 있는가: b 의 성질을 a 가 모두 가지면 그렇다.
  const isA = (a, b) => HAS[b].every((p) => HAS[a].includes(p));
  const relation = (a, b) => `${josa(a, '은/는')} ${josa(b, '이라고/라고')} 할 수 있다.`;
  const deg = (list) => list.map((v) => v + '°').join(', ');

  B.addTypes(UNIT, 'pgram', [
    T('pgram-word', '평행사변형의 뜻', '①42 ②54 ③38', (d) => {
      const want = '마주 보는 두 쌍의 변이 서로 평행한 사각형', options = d.shuffle([want, '평행한 변이 한 쌍뿐인 사각형', '네 변의 길이가 모두 같은 사각형', '네 각이 모두 직각인 사각형']);
      return C('평행사변형의 뜻으로 알맞은 것은?', options, options.indexOf(want), { explain: '마주 보는 두 쌍의 변이 서로 평행한 사각형을 평행사변형이라고 한다.', facts: { truth: options.map((o) => o === want), want: true } });
    }),
    T('pgram-find', '평행사변형 찾기', '①49 ②55 ③42 심41', (d) => {
      const picks = d.shuffle(d.shuffle(PGRAMS).slice(0, 2).concat([d.pick(TRAPS), d.pick(NONES)])).map((pts) => vary(d, pts)), flags = picks.map((pts) => kindOf(pts).pgram), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
      return C('평행사변형을 모두 고른 것은?', made.options, made.answer, {
        figure: tilesOf(picks, '모눈종이 위의 사각형'), explain: `${labels.filter((_, i) => flags[i]).join(', ')}는 마주 보는 두 쌍의 변이 서로 평행하다. 나머지는 평행한 변이 한 쌍뿐이거나 없다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('pgram-say', '평행사변형에 대한 설명', '①50·51 ②54·64 ③49 심52', (d) => say(d, '평행사변형에 대한 설명으로 옳지 않은 것은?',
      ['마주 보는 두 쌍의 변이 서로 평행하다.', '마주 보는 두 변의 길이가 같다.', '마주 보는 두 각의 크기가 같다.', '이웃한 두 각의 크기의 합이 180°이다.'],
      ['네 변의 길이가 언제나 모두 같다.', '이웃한 두 각의 크기가 언제나 같다.', '이웃한 두 각의 크기의 합이 90°이다.', '네 각이 언제나 모두 직각이다.', '네 각의 크기의 합이 400°이다.'], false,
      '평행사변형은 마주 보는 두 쌍의 변이 서로 평행한 사각형이다. 마주 보는 두 변의 길이가 같고, 마주 보는 두 각의 크기가 같으며, 이웃한 두 각의 크기의 합은 180°이다. 네 각의 크기의 합은 다른 사각형과 같이 360°이다.')),
    T('pgram-adjacent-sum', '평행사변형의 이웃한 두 각의 크기의 합', '②60 ③53', (d) => {
      const i = d.int(0, 3), j = (i + 1) % 4;
      return N(`평행사변형 ㄱㄴㄷㄹ에서 ${ANG4[i]}과 ${ANG4[j]}의 크기의 합은 몇 도인가?`, 180, {
        unit: '°', figure: shape(pg(5, 3, d.pick(SLOPES)), { names: N4, box: [6, 3.4], label: '평행사변형 ㄱㄴㄷㄹ' }),
        explain: `${ANG4[i]}과 ${ANG4[j]}은 이웃한 두 각이다. 평행사변형에서 이웃한 두 각의 크기의 합은 180°이다.`, facts: { calc: [['180', 0]], unseen: [180] }
      });
    }),
    T('pgram-side', '평행사변형의 마주 보는 변의 길이', '①52 ②58 ③50 심45', (d) => {
      const [a, b] = d.until(() => [d.int(7, 13), d.int(4, 9)], ([x, y]) => x >= y + 2 && x <= y * 2), long = d.bool(), value = long ? a : b;
      return N(`평행사변형 ㄱㄴㄷㄹ에서 ${long ? '변 ㄱㄹ' : '변 ㄷㄹ'}의 길이는 몇 cm인가?`, value, {
        unit: 'cm', figure: shape(pg(a, b, d.pick(SLOPES)), { names: N4, sides: { 0: cm(b), 1: cm(a) }, box: [6, 3.4], label: `평행사변형 ㄱㄴㄷㄹ. 변 ㄱㄴ ${b} cm, 변 ㄴㄷ ${a} cm` }),
        explain: `평행사변형은 마주 보는 두 변의 길이가 같다. ${long ? '변 ㄱㄹ은 변 ㄴㄷ과' : '변 ㄷㄹ은 변 ㄱㄴ과'} 마주 보므로 ${value} cm이다.`, facts: { calc: [[String(value), 0]] }
      });
    }),
    T('pgram-angle-opp', '평행사변형의 마주 보는 각의 크기', '①53 ②59 ③51 심45', (d) => {
      const slope = d.pick(SLOPES), given = d.int(0, 3), ask = (given + 2) % 4, value = given % 2 ? slope : 180 - slope;
      return N(`평행사변형 ㄱㄴㄷㄹ에서 ${ANG4[ask]}의 크기는 몇 도인가?`, value, {
        unit: '°', figure: shape(pg(5, 3.2, slope), { names: N4, angles: { [given]: value + '°' }, box: [6, 3.4], label: `평행사변형 ㄱㄴㄷㄹ. ${ANG4[given]}은 ${value}°` }),
        explain: `평행사변형은 마주 보는 두 각의 크기가 같다. ${ANG4[ask]}은 ${ANG4[given]}과 마주 보므로 ${value}°이다.`, facts: { calc: [[String(value), 0]], rule: 'pgram-opp' }
      });
    }),
    T('pgram-angle-adj', '평행사변형의 이웃한 각의 크기', '①54 ②60 ③52 심46', (d) => {
      const slope = d.pick(SLOPES), given = d.int(0, 3), ask = (given + d.pick([1, 3])) % 4, value = given % 2 ? slope : 180 - slope;
      return N('평행사변형에서 ㉠의 크기는 몇 도인가?', 180 - value, {
        unit: '°', figure: shape(pg(5, 3.2, slope), { angles: { [given]: value + '°', [ask]: '㉠' }, box: [6, 3.4], pad: [1, 0.8], label: `평행사변형. 한 각은 ${value}°, 그 각과 이웃한 각은 ㉠` }),
        explain: `평행사변형에서 이웃한 두 각의 크기의 합은 180°이다. ㉠ = 180° − ${value}° = ${180 - value}°`, facts: { calc: [[`180-${value}`, 0]], unseen: [180] }
      });
    }),
    T('pgram-angles-not', '네 각의 크기를 보고 평행사변형이 아닌 것 고르기', '심43', (d) => {
      // 평행사변형은 마주 보는 두 각(첫째와 셋째, 둘째와 넷째)의 크기가 같다.
      const [a, b, c, e] = d.shuffle([50, 55, 60, 65, 70, 75, 80]), gap = d.pick([10, 20]);
      const rows = d.shuffle([[a, 180 - a, a, 180 - a], [180 - b, b, 180 - b, b], [c, 180 - c, c, 180 - c], [e, 180 - e, e + gap, 180 - e - gap]]), ok = rows.map((r) => r[0] === r[2] && r[1] === r[3]), at = ok.indexOf(false);
      return C('사각형의 네 각의 크기를 꼭짓점 차례대로 적은 것이다. 평행사변형이 될 수 없는 것은?', rows.map(deg), at, {
        explain: `평행사변형은 마주 보는 두 각의 크기가 같으므로 첫째와 셋째, 둘째와 넷째 각의 크기가 같아야 한다. ${deg(rows[at])}는 첫째 각 ${rows[at][0]}°와 셋째 각 ${rows[at][2]}°의 크기가 다르다.`,
        facts: { kindPick: { kinds: ok.map((good, i) => (good ? 'ok' + i : 'not')), target: 'not' } }
      });
    }),
    T('pgram-point', '평행사변형이 되는 꼭짓점 고르기', '②68 ①44·57', (d) => {
      const mir = d.bool(), mx = ([x, y]) => [mir ? 8 - x : x, y], P = mx([3, 2]), Q = mx([1, 5]), R = mx([5, 5]), far = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= 2;
      const points = d.until(() => d.shuffle([[7, 2]].concat(d.shuffle([[6, 3], [8, 1], [6, 1], [8, 3], [5, 2], [7, 4], [7, 0]]).slice(0, 3))), (list) => list.every((p, i) => list.every((q, j) => i === j || far(p, q)))).map(mx);
      const kinds = points.map((S, i) => (kindOf([P, Q, R, S]).pgram ? 'pgram' : 'no' + i)), at = kinds.indexOf('pgram');
      const base = [G.line(P, Q), G.line(Q, R), G.point(P), G.point(Q), G.point(R)].concat(points.map((p, i) => G.point(p) + G.text([p[0] + 0.45, p[1] - 0.35], CIRCLED[i], 'mb-label is-small')));
      return C('점 종이 위에 선분 2개가 그려져 있다. 한 점을 골라 두 선분의 끝과 이어 평행사변형을 완성하려고 한다. 골라야 하는 점은?', CIRCLED.slice(0, 4), at, {
        figure: G.board(8, 6, base, { grid: 'dots', scale: 1.25, label: '점 종이 위에 한 끝이 이어진 선분 2개와 점 넷' }),
        explain: `점 ${CIRCLED[at]}${['을', '를', '을', '를'][at]} 고르면 마주 보는 두 쌍의 변이 서로 평행한 사각형이 된다. 점 사이의 칸을 세어 기울어진 정도를 비교한다.` + G.board(8, 6, [G.polygon([P, Q, R, points[at]])].concat(base), { grid: 'dots', label: '완성한 평행사변형' }),
        facts: { kindPick: { kinds, target: 'pgram' } }
      });
    })
  ]);

  B.addTypes(UNIT, 'rhom', [
    T('rhom-word', '마름모의 뜻', '①42 ②69 ③38', (d) => {
      const want = '네 변의 길이가 모두 같은 사각형', options = d.shuffle([want, '네 각이 모두 직각인 사각형', '평행한 변이 한 쌍뿐인 사각형', '마주 보는 두 변의 길이만 같은 사각형']);
      return C('마름모의 뜻으로 알맞은 것은?', options, options.indexOf(want), { explain: '네 변의 길이가 모두 같은 사각형을 마름모라고 한다.', facts: { truth: options.map((o) => o === want), want: true } });
    }),
    T('rhom-find', '마름모 찾기', '①60 ②70 ③43 심53', (d) => {
      const picks = d.shuffle(d.shuffle(RHOMBI).slice(0, 2).concat([d.pick(PGRAMS.slice(0, 2)), d.pick([NONES[0], NONES[2], RECTS[0]])])).map((pts) => vary(d, pts)), flags = picks.map((pts) => kindOf(pts).rhom), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
      return C('마름모를 모두 고른 것은?', made.options, made.answer, {
        figure: tilesOf(picks, '모눈종이 위의 사각형'), explain: `${labels.filter((_, i) => flags[i]).join(', ')}는 네 변의 길이가 모두 같다. 나머지 사각형은 길이가 다른 변이 있다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('rhom-list', '네 변의 길이를 보고 마름모 고르기', '②71 ③44 심54', (d) => {
      const s = d.int(4, 9), t = d.pick([s - 2, s - 1, s + 1, s + 2]), u = d.pick([3, 10, 11].filter((v) => v !== s && v !== t));
      const rows = d.shuffle([[s, s, s, s], [s, t, s, t], [t, t, s, s], [u, u, u, t]]), even = rows.map((r) => new Set(r).size === 1), at = even.indexOf(true);
      return C('사각형의 네 변의 길이를 차례대로 적은 것이다. 마름모인 것은?', rows.map((r) => r.map(cm).join(', ')), at, {
        explain: `마름모는 네 변의 길이가 모두 같은 사각형이다. 네 변의 길이가 모두 ${s} cm인 사각형을 고른다. 길이가 다른 변이 하나라도 있으면 마름모가 아니다.`,
        facts: { kindPick: { kinds: even.map((ok, i) => (ok ? 'even' : 'no' + i)), target: 'even' } }
      });
    }),
    T('rhom-same', '마름모에서 길이가 같은 변·크기가 같은 각', '①61 ②72 ③58', (d, n) => {
      const figure = shape(pg(4, 4, d.pick(SLOPES)), { names: N4, box: [5.4, 3.6], label: '마름모 ㄱㄴㄷㄹ' });
      if (n === 0) {
        const rows = d.shuffle([['변 ㄴㄷ, 변 ㄷㄹ, 변 ㄱㄹ', true], ['변 ㄷㄹ', false], ['변 ㄴㄷ, 변 ㄱㄹ', false], ['변 ㄴㄷ, 변 ㄷㄹ', false]]);
        return C('마름모 ㄱㄴㄷㄹ에서 변 ㄱㄴ과 길이가 같은 변을 모두 고른 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), { figure, explain: '마름모는 네 변의 길이가 모두 같다. 변 ㄱㄴ과 길이가 같은 변은 나머지 세 변 모두이다.', facts: { truth: rows.map((r) => r[1]), want: true } });
      }
      const given = d.int(0, 3), rows = d.shuffle([0, 1, 2, 3].filter((i) => i !== given));
      return C(`마름모 ㄱㄴㄷㄹ에서 ${ANG4[given]}과 크기가 같은 각은?`, rows.map((i) => ANG4[i]), rows.indexOf((given + 2) % 4), { figure, explain: `마름모는 마주 보는 두 각의 크기가 같다. ${ANG4[given]}과 마주 보는 각은 ${ANG4[(given + 2) % 4]}이다.`, facts: { truth: rows.map((i) => i === (given + 2) % 4), want: true } });
    }, { count: 2 }),
    T('rhom-say', '마름모에 대한 설명', '①62·63 ②76 ③58·59 심64', (d) => say(d, '마름모에 대한 설명으로 옳지 않은 것은?',
      ['네 변의 길이가 모두 같다.', '마주 보는 두 각의 크기가 같다.', '마주 보는 두 쌍의 변이 서로 평행하다.', '이웃한 두 각의 크기의 합이 180°이다.', '마주 보는 꼭짓점끼리 이은 두 선분은 서로 수직으로 만난다.', '마주 보는 꼭짓점끼리 이은 두 선분은 서로를 똑같이 둘로 나눈다.'],
      ['네 각의 크기가 언제나 모두 같다.', '이웃한 두 각의 크기가 언제나 같다.', '마주 보는 꼭짓점끼리 이은 두 선분의 길이가 언제나 같다.', '마주 보는 두 각의 크기의 합이 언제나 180°이다.', '이웃한 두 변이 언제나 서로 수직으로 만난다.'], false,
      '마름모는 네 변의 길이가 모두 같고, 마주 보는 두 쌍의 변이 서로 평행하다. 마주 보는 두 각의 크기가 같고 이웃한 두 각의 크기의 합이 180°이다. 마주 보는 꼭짓점끼리 이은 두 선분은 서로 수직으로 만나고 서로를 똑같이 둘로 나눈다. 네 각이 모두 같거나 두 선분의 길이가 같은 것은 정사각형일 때뿐이다.')),
    T('rhom-side', '마름모의 변의 길이', '①64 ②73 ③60 심57', (d) => {
      const s = d.int(4, 15), ask = d.pick([1, 3]);
      return N(`마름모 ㄱㄴㄷㄹ에서 ${SIDE4[ask]}의 길이는 몇 cm인가?`, s, {
        unit: 'cm', figure: shape(pg(4, 4, d.pick(SLOPES)), { names: N4, sides: { 0: cm(s) }, box: [5.4, 3.6], label: `마름모 ㄱㄴㄷㄹ. 변 ㄱㄴ ${s} cm` }),
        explain: `마름모는 네 변의 길이가 모두 같다. ${SIDE4[ask]}의 길이도 변 ㄱㄴ과 같은 ${s} cm이다.`, facts: { calc: [[String(s), 0]] }
      });
    }),
    T('rhom-angle-opp', '마름모의 마주 보는 각의 크기', '①65 ②74 ③61 심57', (d) => {
      const slope = d.pick(SLOPES), given = d.int(0, 3), ask = (given + 2) % 4, value = given % 2 ? slope : 180 - slope;
      return N(`마름모 ㄱㄴㄷㄹ에서 ${ANG4[ask]}의 크기는 몇 도인가?`, value, {
        unit: '°', figure: shape(pg(4, 4, slope), { names: N4, angles: { [given]: value + '°' }, box: [5.4, 3.6], label: `마름모 ㄱㄴㄷㄹ. ${ANG4[given]}은 ${value}°` }),
        explain: `마름모는 마주 보는 두 각의 크기가 같다. ${ANG4[ask]}은 ${ANG4[given]}과 마주 보므로 ${value}°이다.`, facts: { calc: [[String(value), 0]], rule: 'rhom-opp' }
      });
    }),
    T('rhom-angle-adj', '마름모의 이웃한 각의 크기', '①65 ②75 ③62 심58', (d) => {
      const slope = d.pick(SLOPES), given = d.int(0, 3), ask = (given + d.pick([1, 3])) % 4, value = given % 2 ? slope : 180 - slope;
      return N('마름모에서 ㉠의 크기는 몇 도인가?', 180 - value, {
        unit: '°', figure: shape(pg(4, 4, slope), { angles: { [given]: value + '°', [ask]: '㉠' }, box: [5.4, 3.6], pad: [1, 0.8], label: `마름모. 한 각은 ${value}°, 그 각과 이웃한 각은 ㉠` }),
        explain: `마름모에서 이웃한 두 각의 크기의 합은 180°이다. ㉠ = 180° − ${value}° = ${180 - value}°`, facts: { calc: [[`180-${value}`, 0]], unseen: [180] }
      });
    }),
    T('rhom-cross-angle', '마름모의 마주 보는 꼭짓점끼리 이은 두 선분이 이루는 각', '①66 ③63 심60', (d) => {
      const [w, h] = d.pick([[2.6, 1.6], [1.7, 2.3], [2.4, 1.4]]), name = d.pick(['ㄱㅇㄴ', 'ㄴㅇㄷ', 'ㄷㅇㄹ', 'ㄱㅇㄹ']);
      return N(`마름모 ㄱㄴㄷㄹ에서 마주 보는 꼭짓점끼리 이은 두 선분이 점 ㅇ에서 만난다. 각 ${name}의 크기는 몇 도인가?`, 90, {
        unit: '°', figure: diamond(w, h, null, '마름모 ㄱㄴㄷㄹ. 선분 ㄱㄷ과 선분 ㄴㄹ이 점 ㅇ에서 만난다.'),
        explain: '마름모에서 마주 보는 꼭짓점끼리 이은 두 선분은 서로 수직으로 만난다. 그러므로 90°이다.', facts: { calc: [['90', 0]], unseen: [90] }
      });
    }),
    T('rhom-cross-len', '마름모의 마주 보는 꼭짓점끼리 이은 선분의 길이', '①66 ②95 ③63 심60', (d, n) => {
      const half = d.int(3, 12), left = d.bool(), part = left ? 'ㄴㅇ' : 'ㅇㄹ', rest = left ? 'ㅇㄹ' : 'ㄴㅇ', lead = '마름모 ㄱㄴㄷㄹ에서 마주 보는 꼭짓점끼리 이은 두 선분이 점 ㅇ에서 만난다. ';
      if (n === 0) {
        return N(lead + '선분 ㄴㄹ의 길이는 몇 cm인가?', half * 2, {
          unit: 'cm', figure: diamond(2.8, 1.8, (p) => [lengthAt([(p[left ? 1 : 3][0] + p[4][0]) / 2, p[4][1] - 0.4], cm(half))], `마름모 ㄱㄴㄷㄹ. 선분 ㄱㄷ과 선분 ㄴㄹ이 점 ㅇ에서 만난다. 선분 ${part}의 길이 ${half} cm`),
          explain: `마름모에서 마주 보는 꼭짓점끼리 이은 두 선분은 서로를 똑같이 둘로 나눈다. 선분 ${rest}의 길이도 ${half} cm이므로 선분 ㄴㄹ의 길이는 ${half} × 2 = ${half * 2}(cm)이다.`, facts: { calc: [[`${half}*2`, 0]], unseen: [2] }
        });
      }
      return N(lead + `선분 ㄴㄹ의 길이가 ${half * 2} cm일 때, 선분 ${part}의 길이는 몇 cm인가?`, half, {
        unit: 'cm', figure: diamond(2.8, 1.8, null, '마름모 ㄱㄴㄷㄹ. 선분 ㄱㄷ과 선분 ㄴㄹ이 점 ㅇ에서 만난다.'),
        explain: `마름모에서 마주 보는 꼭짓점끼리 이은 두 선분은 서로를 똑같이 둘로 나눈다. 선분 ${part}의 길이는 ${half * 2} ÷ 2 = ${half}(cm)이다.`, facts: { calc: [[`${half * 2}/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('rhom-point', '마름모가 되는 꼭짓점 고르기', '②80 심55 ①44', (d) => {
      // 길이가 같은 두 선분의 끝과 이어 네 변의 길이가 모두 같은 사각형이 되는 점은 하나뿐이다.
      const mir = d.bool(), mx = ([x, y]) => [mir ? 8 - x : x, y], far = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= 2;
      const lay = d.pick([{ P: [2, 2], Q: [1, 5], R: [4, 4], S: [5, 1], wrong: [[4, 2], [6, 2], [5, 3], [7, 1], [6, 0]] }, { P: [3, 1], Q: [0, 5], R: [5, 5], S: [8, 1], wrong: [[6, 1], [7, 2], [8, 3], [6, 3]] }]), P = mx(lay.P), Q = mx(lay.Q), R = mx(lay.R);
      const points = d.until(() => d.shuffle([lay.S].concat(d.shuffle(lay.wrong).slice(0, 3))), (list) => list.every((p, i) => list.every((q, j) => i === j || far(p, q)))).map(mx);
      const kinds = points.map((S, i) => (kindOf([P, Q, R, S]).rhom ? 'rhom' : 'no' + i)), at = kinds.indexOf('rhom');
      const base = [G.line(P, Q), G.line(Q, R), G.point(P), G.point(Q), G.point(R)].concat(points.map((p, i) => G.point(p) + G.text([p[0] + 0.45, p[1] - 0.35], CIRCLED[i], 'mb-label is-small')));
      return C('점 종이 위에 길이가 같은 선분 2개가 그려져 있다. 한 점을 골라 두 선분의 끝과 이어 마름모를 완성하려고 한다. 골라야 하는 점은?', CIRCLED.slice(0, 4), at, {
        figure: G.board(8, 6, base, { grid: 'dots', scale: 1.25, label: '점 종이 위에 한 끝이 이어진 길이가 같은 선분 2개와 점 넷' }),
        explain: `점 ${CIRCLED[at]}${['을', '를', '을', '를'][at]} 고르면 새로 그은 두 변이 처음 두 선분과 각각 평행하고 길이도 같아서 네 변의 길이가 모두 같은 사각형이 된다.` + G.board(8, 6, [G.polygon([P, Q, R, points[at]])].concat(base), { grid: 'dots', label: '완성한 마름모' }),
        facts: { kindPick: { kinds, target: 'rhom' } }
      });
    })
  ]);

  B.addTypes(UNIT, 'kinds', [
    T('kinds-rect-fill', '직사각형의 변과 각', '①72 ②81 ③67 심65', (d) => {
      const [w, h] = d.until(() => [d.int(6, 14), d.int(3, 9)], ([x, y]) => x >= y + 2 && x <= y * 2 + 1);
      return M('직사각형 ㄱㄴㄷㄹ에서 변 ㄱㄹ의 길이와 각 ㄴㄷㄹ의 크기를 구하시오.', [{ label: '변 ㄱㄹ', answer: w, unit: 'cm' }, { label: '각 ㄴㄷㄹ', answer: 90, unit: '°' }], {
        figure: shape([[0, 0], [0, h], [w, h], [w, 0]], { names: N4, sides: { 0: cm(h), 1: cm(w) }, box: [6, 3.6], label: `직사각형 ㄱㄴㄷㄹ. 변 ㄱㄴ ${h} cm, 변 ㄴㄷ ${w} cm` }),
        explain: `직사각형은 마주 보는 두 변의 길이가 같으므로 변 ㄱㄹ의 길이는 변 ㄴㄷ과 같은 ${w} cm이다. 직사각형의 네 각은 모두 직각이므로 각 ㄴㄷㄹ은 90°이다.`,
        facts: { calc: [[String(w), 0], ['90', 1]], unseen: [90] }
      });
    }),
    T('kinds-square-side', '정사각형의 변의 길이', '①72 ②81 ③67', (d) => {
      const s = d.int(3, 15), ask = d.pick([1, 3]);
      return N(`정사각형 ㄱㄴㄷㄹ에서 ${SIDE4[ask]}의 길이는 몇 cm인가?`, s, {
        unit: 'cm', figure: shape([[0, 0], [0, 1], [1, 1], [1, 0]], { names: N4, sides: { 0: cm(s) }, box: [3.6, 3.6], label: `정사각형 ㄱㄴㄷㄹ. 변 ㄱㄴ ${s} cm` }),
        explain: `정사각형은 네 변의 길이가 모두 같다. ${SIDE4[ask]}의 길이도 ${s} cm이다.`, facts: { calc: [[String(s), 0]] }
      });
    }),
    T('kinds-rect-say', '직사각형·정사각형에 대한 설명', '①73 ②82 ③68 심72', (d, n) => (n === 0
      ? say(d, '직사각형에 대한 설명으로 옳지 않은 것은?', ['네 각이 모두 직각이다.', '마주 보는 두 변의 길이가 같다.', '마주 보는 두 쌍의 변이 서로 평행하다.', '이웃한 두 변이 서로 수직으로 만난다.'],
        ['네 변의 길이가 언제나 모두 같다.', '마주 보는 두 변의 길이가 서로 다르다.', '평행한 변이 한 쌍뿐이다.'], false, '직사각형은 네 각이 모두 직각이고, 마주 보는 두 쌍의 변이 서로 평행하며, 마주 보는 두 변의 길이가 같다. 네 변의 길이가 모두 같은 직사각형은 정사각형뿐이다.')
      : say(d, '정사각형에 대한 설명으로 옳지 않은 것은?', ['네 변의 길이가 모두 같다.', '네 각이 모두 직각이다.', '마주 보는 두 쌍의 변이 서로 평행하다.', '마주 보는 두 각의 크기가 같다.'],
        ['마주 보는 두 각의 크기가 서로 다르다.', '이웃한 두 변의 길이가 서로 다르다.', '평행한 변이 한 쌍뿐이다.', '이웃한 두 각의 크기의 합이 90°이다.'], false, '정사각형은 네 변의 길이가 모두 같고 네 각이 모두 직각이다. 마주 보는 두 쌍의 변이 서로 평행하고, 네 각이 모두 90°이므로 마주 보는 두 각의 크기도 같다.')), { count: 2 }),
    T('kinds-find', '여러 사각형에서 이름에 맞는 것 모두 찾기', '①76 ②85 ③71·73 심68', (d, n) => {
      // 정사각형은 마름모이기도 하고 직사각형이기도 하다.
      const kinds = d.shuffle(['sq', 'rc', 'rh', 'pg', 'tr']), picks = kinds.map((k) => vary(d, d.pick({ sq: SQUARES, rc: RECTS.slice(0, 2), rh: RHOMBI, pg: PGRAMS, tr: TRAPS }[k]))), labels = TAGS.slice(0, 5), tag = (k) => labels[kinds.indexOf(k)];
      const flags = picks.map((pts) => (n === 0 ? kindOf(pts).rhom : kindOf(pts).rect));
      const made = handSets(d, labels, n === 0 ? [[tag('sq'), tag('rh')], [tag('rh')], [tag('rh'), tag('pg')], [tag('sq'), tag('rh'), tag('pg')]] : [[tag('sq'), tag('rc')], [tag('rc')], [tag('rc'), tag('pg')], [tag('sq'), tag('rc'), tag('rh')]]);
      return C(n === 0 ? '모눈종이에 그린 사각형 가운데 마름모를 모두 고른 것은?' : '모눈종이에 그린 사각형 가운데 네 각의 크기가 모두 같은 사각형을 모두 고른 것은?', made.options, made.answer, {
        figure: tilesOf(picks, '모눈종이 위의 사각형'),
        explain: n === 0 ? `네 변의 길이가 모두 같은 사각형은 ${labels.filter((_, i) => flags[i]).join(', ')}이다. ${tag('sq')}는 정사각형이지만 네 변의 길이가 모두 같으므로 마름모이기도 하다.`
          : `네 각이 모두 직각인 사각형은 ${labels.filter((_, i) => flags[i]).join(', ')}이다. 직사각형과 정사각형은 네 각의 크기가 모두 90°로 같다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('kinds-names-of', '한 사각형의 이름이 될 수 있는 것 모두 고르기', '①77 ②87 ③77 심69', (d) => {
      const [pts, lists] = d.pick([
        [d.pick(RECTS), [['사다리꼴', '평행사변형', '직사각형'], ['직사각형'], ['평행사변형', '직사각형'], ['사다리꼴', '평행사변형', '직사각형', '정사각형']]],
        [d.pick(RHOMBI), [['사다리꼴', '평행사변형', '마름모'], ['마름모'], ['평행사변형', '마름모'], ['사다리꼴', '평행사변형', '마름모', '정사각형']]],
        [d.pick(PGRAMS), [['사다리꼴', '평행사변형'], ['평행사변형'], ['사다리꼴', '평행사변형', '마름모'], ['사다리꼴', '평행사변형', '직사각형']]]
      ]), turned = vary(d, pts), k = kindOf(turned), flags = [k.trap, k.pgram, k.rhom, k.rect, k.square], made = handSets(d, NAMES5, lists), rows = Math.max(3, Math.max(...turned.map((p) => p[1])) - Math.min(...turned.map((p) => p[1])));
      return C('모눈종이에 그린 사각형의 이름이 될 수 있는 것을 모두 고른 것은?', made.options, made.answer, {
        figure: G.board(4, rows, [gp(centered(turned, 4, rows))], { grid: 'lines', scale: 1.5, label: '모눈종이 위의 사각형' }),
        explain: `이 사각형은 ${k.rect ? '네 각이 모두 직각이지만 네 변의 길이가 모두 같지는 않다' : k.rhom ? '네 변의 길이가 모두 같지만 네 각이 직각은 아니다' : '마주 보는 두 쌍의 변이 서로 평행하지만 네 변의 길이가 모두 같지도, 네 각이 직각이지도 않다'}. 마주 보는 두 쌍의 변이 서로 평행하므로 평행사변형이고, 평행한 변이 있으므로 사다리꼴이라고도 할 수 있다. 그러므로 ${NAMES5.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels: NAMES5, flags, options: made.sets } }
      });
    }),
    T('kinds-by-prop', '성질에 맞는 사각형 이름 모두 고르기', '①78 ②89·90 ③74 심70·71', (d, n) => {
      const [prop, text, lists] = [
        ['sides4', '네 변의 길이가 언제나 모두 같은', [['마름모', '정사각형'], ['마름모'], ['정사각형'], ['평행사변형', '마름모', '정사각형']]],
        ['angles4', '네 각의 크기가 언제나 모두 같은', [['직사각형', '정사각형'], ['직사각형'], ['정사각형'], ['마름모', '직사각형', '정사각형']]],
        ['para2', '마주 보는 두 쌍의 변이 언제나 서로 평행한', [['평행사변형', '마름모', '직사각형', '정사각형'], ['평행사변형'], ['평행사변형', '직사각형', '정사각형'], ['사다리꼴', '평행사변형', '마름모', '직사각형', '정사각형']]]
      ][n], flags = NAMES5.map((name) => HAS[name].includes(prop)), made = handSets(d, NAMES5, lists);
      return C(`사다리꼴, 평행사변형, 마름모, 직사각형, 정사각형 가운데 ${text} 사각형을 모두 고른 것은?`, made.options, made.answer, {
        explain: `${PROP[prop]}는 성질을 언제나 가지는 사각형은 ${NAMES5.filter((_, i) => flags[i]).join(', ')}이다. ` + ['정사각형도 네 변의 길이가 모두 같으므로 빠뜨리지 않는다.', '정사각형도 네 각이 모두 직각이므로 빠뜨리지 않는다.', '사다리꼴은 평행한 변이 한 쌍뿐일 수도 있다.'][n],
        facts: { sets: { labels: NAMES5, flags, options: made.sets } }
      });
    }, { count: 3 }),
    T('kinds-by-conds', '조건을 모두 만족하는 사각형', '①79 ②88 ③76 심70', (d) => {
      const props = d.shuffle(d.bool() ? ['para2', 'sides4', 'angles4'] : ['sides4', 'angles4']), options = d.shuffle(NAMES5), ok = options.map((name) => props.every((p) => HAS[name].includes(p)));
      return C('다음 조건을 모두 만족하는 사각형은?', options, ok.indexOf(true), {
        figure: conditions(props.map((p) => PROP[p] + '.')), explain: '네 변의 길이가 모두 같은 사각형은 마름모와 정사각형이고, 네 각의 크기가 모두 같은 사각형은 직사각형과 정사각형이다. 두 조건을 모두 만족하는 사각형은 정사각형이다.',
        facts: { truth: ok, want: true }
      });
    }),
    T('kinds-mixed-say', '여러 사각형의 성질을 섞어 말한 설명', '①81 ②83 ③80 심72', (d) => {
      const props = ['para2', 'sides4', 'angles4', 'oppSides', 'oppAngles'], all = [];
      NAMES5.forEach((name) => props.forEach((p) => all.push([name, p, HAS[name].includes(p)])));
      const bad = d.pick(all.filter((r) => !r[2])), good = d.until(() => d.shuffle(all.filter((r) => r[2] && r[0] !== bad[0])).slice(0, 3), (list) => new Set(list.map((r) => r[0])).size === 3 && new Set(list.map((r) => r[1]).concat([bad[1]])).size >= 3), rows = d.shuffle(good.concat([bad]));
      return C('여러 가지 사각형에 대한 설명으로 옳지 않은 것은?', rows.map(([name, p]) => `${josa(name, '은/는')} 언제나 ${PROP[p]}.`), rows.indexOf(bad), {
        explain: `${bad[0]} 가운데에는 ${PROP[bad[1]].replace(/같다$/, '같지 않은').replace(/평행하다$/, '평행하지 않은')} 것도 있다. 사각형마다 언제나 가지는 성질을 구별한다.`,
        facts: { truth: rows.map((r) => r[2]), want: false }
      });
    }),
    T('kinds-common', '두 사각형의 같은 점', '①82 ②84 ③69 심71', (d) => {
      const [a, b] = d.pick([['사다리꼴', '평행사변형'], ['평행사변형', '정사각형'], ['마름모', '직사각형'], ['직사각형', '정사각형'], ['평행사변형', '마름모']]), both = (p) => HAS[a].includes(p) && HAS[b].includes(p);
      const props = d.until(() => d.shuffle(Object.keys(PROP)).slice(0, 4), (list) => { const n = list.filter(both).length; return n >= 1 && n <= 3; }), labels = MARKS.slice(0, 4), flags = props.map(both), made = setOptions(d, labels, flags);
      return C(`${josa(a, '과/와')} ${b}의 같은 점을 모두 고른 것은?`, made.options, made.answer, {
        figure: tagged(props.map((p) => PROP[p] + '.')), explain: `${a}에서도 ${b}에서도 언제나 성립하는 것은 ${labels.filter((_, i) => flags[i]).join(', ')}이다. 나머지는 두 사각형 가운데 한쪽에서만 언제나 성립하거나 어느 쪽에서도 언제나 성립하지는 않는다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('kinds-props-of', '한 사각형이 언제나 가지는 성질 모두 고르기', '③75 심71', (d) => {
      const name = d.pick(['평행사변형', '마름모', '직사각형']), has = (p) => HAS[name].includes(p);
      const props = d.until(() => d.shuffle(['para2', 'sides4', 'angles4', 'oppSides', 'oppAngles']).slice(0, 4), (list) => { const n = list.filter(has).length; return n >= 1 && n <= 3; }), labels = MARKS.slice(0, 4), flags = props.map(has), made = setOptions(d, labels, flags);
      return C(`${name}에 대한 설명으로 옳은 것을 모두 고른 것은?`, made.options, made.answer, {
        figure: tagged(props.map((p) => PROP[p] + '.')), explain: `${josa(name, '은/는')} ${props.filter(has).map((p) => PROP[p]).join('. 또 ')}. 나머지 설명은 ${name}에서 언제나 성립하지는 않는다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('kinds-sticks', '막대로 만들 수 없는 사각형', '①91 ②92 ③81 심73', (d) => {
      // 길이가 다른 막대가 2개씩이라 네 변의 길이를 모두 같게 할 수 없다.
      const [a, b] = d.until(() => [d.int(5, 9), d.int(8, 14)], ([x, y]) => y >= x + 2), flags = NAMES5.map((name) => HAS[name].includes('sides4'));
      const made = handSets(d, NAMES5, [['마름모', '정사각형'], ['정사각형'], ['마름모', '직사각형', '정사각형'], ['사다리꼴', '마름모', '정사각형']]);
      return C(`길이가 ${a} cm인 막대 2개와 ${b} cm인 막대 2개가 있다. 막대 4개를 모두 변으로 하여 사각형을 만들 때, 만들 수 없는 사각형을 모두 고른 것은?`, made.options, made.answer, {
        explain: `마름모와 정사각형은 네 변의 길이가 모두 같아야 하는데, 막대의 길이가 ${a} cm와 ${b} cm로 달라서 만들 수 없다. 길이가 같은 막대를 마주 보게 놓으면 평행사변형과 직사각형을 만들 수 있고, 이것은 사다리꼴이라고도 할 수 있다.`,
        facts: { sets: { labels: NAMES5, flags, options: made.sets } }
      });
    }),
    T('kinds-strip', '종이띠를 자른 조각 가운데 평행사변형의 수', '①87 ②57 ③45·72 심91', (d) => {
      const strip = stripOf(d), flags = strip.pieces.map((p) => p.pgram), count = flags.filter(Boolean).length;
      return N('직사각형 모양의 종이띠를 선을 따라 잘랐다. 잘라 낸 조각 가운데 평행사변형은 모두 몇 개인가?', count, {
        unit: '개', figure: strip.figure, explain: `마주 보는 두 쌍의 변이 서로 평행한 조각은 ${strip.tags.filter((_, i) => flags[i]).join(', ')}의 ${count}개이다. 직사각형·정사각형·마름모 모양의 조각도 마주 보는 두 쌍의 변이 서로 평행하므로 평행사변형이다.`,
        facts: { count: flags }
      });
    }),
    T('kinds-strip-talk', '종이띠를 자른 조각에 대한 설명', '①88 ②91 심92', (d) => {
      const strip = stripOf(d), ps = strip.pieces, tagOf = (test) => { const i = ps.findIndex(test); return i < 0 ? null : strip.tags[i]; }, count = (test) => ps.filter(test).length;
      const traps = count((p) => p.trap), pgrams = count((p) => p.pgram), onlyTraps = count((p) => p.trap && !p.pgram), plain = count((p) => p.pgram && !p.rect && !p.rhom), tri = tagOf((p) => !p.quad), box = tagOf((p) => p.rect), slant = tagOf((p) => p.pgram && !p.rect);
      // 설명마다 조각을 다시 세어 참·거짓을 정한다.
      const claims = [[`사다리꼴은 모두 ${traps}개이다.`, true], [`평행사변형은 모두 ${pgrams}개이다.`, true], [`사다리꼴은 평행사변형보다 ${traps - pgrams}개 더 많다.`, true], [`조각 ${slant}는 평행사변형이다.`, Boolean(slant)], [`조각 ${box}는 사다리꼴이다.`, Boolean(box)],
        [`사다리꼴은 모두 ${onlyTraps}개이다.`, onlyTraps === traps], [`평행사변형은 모두 ${plain}개이다.`, plain === pgrams], [`조각 ${tri}는 사다리꼴이다.`, false], [`조각 ${box}는 평행사변형이 아니다.`, !box]].filter((c) => !/null/.test(c[0]));
      const bad = d.pick(claims.filter((c) => !c[1])), rows = d.shuffle(d.shuffle(claims.filter((c) => c[1])).slice(0, 3).concat([bad]));
      return C('직사각형 모양의 종이띠를 선을 따라 잘랐다. 잘라 낸 조각에 대한 설명으로 옳지 않은 것은?', rows.map((c) => c[0]), rows.indexOf(bad), {
        figure: strip.figure, explain: `사각형 조각은 모두 평행한 변이 있으므로 사다리꼴은 ${traps}개이고, 그 가운데 마주 보는 두 쌍의 변이 서로 평행한 평행사변형은 ${pgrams}개이다. 직사각형 모양의 조각도 평행사변형이고 사다리꼴이다. 삼각형 조각은 사다리꼴이 아니다.`,
        facts: { truth: rows.map((c) => c[1]), want: false }
      });
    }),
    T('kinds-fold', '접어서 자른 종이를 펼친 사각형', '①89 ②97 ③84 심95', (d) => {
      // 두 번 접은 채로 한 번 자르면 겹쳐 있던 네 겹이 똑같이 잘린다: 펼친 사각형의 네 변의 길이가 모두 같다.
      const a = d.pick([1.2, 1.5, 1.8]), b = d.pick([2.5, 3, 3.5]), x0 = 2.6, y0 = 0.5, w = 4.4, h = 3.2, o = [x0, y0 + h], p = [x0, y0 + h - a], q = [x0 + b, y0 + h];
      const parts = [G.polygon([o, p, q]).replace('class="mb-poly"', 'class="mb-poly" style="fill:#fcd34d;stroke:none"'), G.line([x0, y0], [x0 + w, y0]), G.line([x0 + w, y0], [x0 + w, y0 + h]), dashed([x0, y0], o), dashed(o, [x0 + w, y0 + h]), G.line(p, q),
        G.text([x0 - 1.25, y0 + 1.2], '접은 곳', 'mb-label is-small'), G.text([x0 + w - 0.9, y0 + h + 0.5], '접은 곳', 'mb-label is-small')];
      // 펼친 사각형: 가로 2b, 세로 2a 인 두 선분이 수직으로 만나 서로를 반으로 나눈다. a ≠ b 이면 네 각이 직각이 아니다.
      const rows = d.shuffle([['마름모', true], ['직사각형', a === b], ['정사각형', a === b], ['평행한 변이 한 쌍뿐인 사다리꼴', false]]);
      return C('직사각형 모양의 종이를 반으로 접고 다시 반으로 접은 다음, 접은 채로 그림과 같이 선을 따라 잘랐다. 색칠한 부분을 펼치면 어떤 사각형이 되는가?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: G.board(x0 + w + 0.5, y0 + h + 0.9, parts, { grid: false, scale: 1.2, label: '두 번 접은 종이. 접은 두 곳이 만나는 모서리에서, 한쪽 접은 곳의 한 점과 다른 쪽 접은 곳의 한 점을 이은 선을 따라 자른다. 모서리 쪽 삼각형 부분을 색칠하였다. 모서리에서 두 점까지의 길이는 서로 다르다.' }),
        explain: '접은 채로 한 번 자르면 겹쳐 있던 종이 네 겹이 똑같이 잘리므로, 펼친 사각형은 네 변의 길이가 모두 같은 마름모이다. 접은 모서리에서 자른 선의 두 끝까지의 길이가 서로 달라 네 각이 직각은 아니다.',
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('kinds-tri-join', '정삼각형 2개를 이어 붙인 사각형의 이름', '②98 ①92', (d) => {
      const raw = pg(1, 1, 60), made = handSets(d, NAMES5, [['사다리꼴', '평행사변형', '마름모'], ['마름모'], ['평행사변형', '마름모'], ['사다리꼴', '평행사변형', '마름모', '정사각형']]);
      // 네 변이 모두 정삼각형의 변이라 길이가 같고, 각은 60°와 120°라 직각이 아니다.
      const s = sidesOf(raw).map((v) => Math.hypot(v[0], v[1])), even = s.every((v) => Math.abs(v - s[0]) < 1e-9), right = Math.abs(G.dot(G.sub(raw[0], raw[1]), G.sub(raw[2], raw[1]))) < 1e-9, flags = [true, true, even, right, even && right];
      return C('크기가 같은 정삼각형 2개를 변끼리 이어 붙여 사각형 ㄱㄴㄷㄹ을 만들었다. 이 사각형의 이름이 될 수 있는 것을 모두 고른 것은?', made.options, made.answer, {
        figure: shape(raw, { names: N4, extra: (p) => thin(p[0], p[2]), box: [5.2, 3.4], label: '정삼각형 ㄱㄴㄷ과 정삼각형 ㄱㄷㄹ을 변 ㄱㄷ에서 이어 붙인 사각형 ㄱㄴㄷㄹ' }),
        explain: '사각형의 네 변은 모두 정삼각형의 변이라 길이가 같으므로 마름모이다. 마름모는 평행사변형이고 사다리꼴이라고도 할 수 있다. 네 각은 60°, 120°, 60°, 120°라 직각이 아니므로 직사각형이나 정사각형은 아니다.',
        facts: { sets: { labels: NAMES5, flags, options: made.sets } }
      });
    }),
    T('kinds-square-rhom', '한 변을 맞댄 정사각형과 마름모', '③87', (d) => {
      const s = d.int(4, 15), tilt = d.pick([25, 30, 35]), v = [Math.cos(tilt * RAD), -Math.sin(tilt * RAD)], ask = d.pick(['ㄷㅁ', 'ㅁㅂ', 'ㄹㅂ']);
      const raw = [[0, 0], [0, 1], [1, 1], [1, 0], [1 + v[0], 1 + v[1]], [1 + v[0], v[1]]];   // ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ
      return N(`정사각형 ㄱㄴㄷㄹ과 마름모 ㄹㄷㅁㅂ을 변 ㄹㄷ에서 이어 붙였다. 변 ${ask}의 길이는 몇 cm인가?`, s, {
        unit: 'cm', figure: scene(raw, (p) => [G.polygon(p.slice(0, 4)), G.polygon([p[3], p[2], p[4], p[5]]), outs(p, ['ㄱ', 'ㄴ', '', '', 'ㅁ', 'ㅂ']), G.text([p[2][0], p[2][1] + 0.5], 'ㄷ'), G.text([p[3][0] - 0.1, p[3][1] - 0.5], 'ㄹ'), sideText(p[0], p[1], p[2], cm(s))], { box: [6, 3.6], pad: [1.8, 1.1], label: `정사각형 ㄱㄴㄷㄹ의 변 ㄹㄷ에 마름모 ㄹㄷㅁㅂ을 이어 붙인 그림. 변 ㄱㄴ ${s} cm` }),
        explain: `정사각형은 네 변의 길이가 모두 같으므로 변 ㄹㄷ의 길이는 ${s} cm이다. 마름모도 네 변의 길이가 모두 같으므로 변 ${ask}의 길이도 ${s} cm이다.`, facts: { calc: [[String(s), 0]] }
      });
    }),
    T('kinds-not-square-why', '정사각형이 아닌 까닭', '②86 ③44 심66', (d) => {
      const rhombus = d.bool(), s = d.int(4, 9), slope = d.pick([60, 65, 70, 110, 115, 120]), w = s + d.int(2, 4);
      const raw = rhombus ? pg(4, 4, slope) : [[0, 0], [0, s], [w, s], [w, 0]], lens = rhombus ? [s, s, s, s] : [s, w, s, w], angs = rhombus ? [180 - slope, slope, 180 - slope, slope] : [90, 90, 90, 90];
      const rows = d.shuffle([['네 각의 크기가 모두 같지는 않기 때문이다.', new Set(angs).size > 1], ['네 변의 길이가 모두 같지는 않기 때문이다.', new Set(lens).size > 1], ['마주 보는 두 쌍의 변이 서로 평행하지 않기 때문이다.', false], ['마주 보는 두 각의 크기가 서로 다르기 때문이다.', angs[0] !== angs[2] || angs[1] !== angs[3]]]);
      return C(`${rhombus ? '네 변의 길이가 모두 같은' : '네 각이 모두 직각인'} 사각형이다. 이 사각형이 정사각형이 아닌 까닭으로 알맞은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: shape(raw, rhombus ? { sides: { 0: cm(s), 1: cm(s), 2: cm(s), 3: cm(s) }, angles: { 1: slope + '°', 2: (180 - slope) + '°' }, box: [5, 3.4], pad: [1.6, 1], label: `네 변의 길이가 모두 ${s} cm인 사각형. 이웃한 두 각은 ${slope}°와 ${180 - slope}°` }
          : { sides: { 0: cm(s), 1: cm(w), 2: cm(s), 3: cm(w) }, rights: [0, 1, 2, 3], box: [5.6, 3.4], pad: [1.6, 1], label: `네 각이 모두 직각인 사각형. 가로 ${w} cm, 세로 ${s} cm` }),
        explain: rhombus ? `정사각형은 네 변의 길이가 모두 같고 네 각이 모두 직각이어야 한다. 이 사각형은 네 변의 길이는 같지만 각이 ${slope}°와 ${180 - slope}°라 네 각의 크기가 모두 같지는 않다.` : `정사각형은 네 변의 길이가 모두 같고 네 각이 모두 직각이어야 한다. 이 사각형은 네 각은 직각이지만 변의 길이가 ${w} cm와 ${s} cm로 다르다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    })
  ]);

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: QUAD,
    types: [
      H('hard-para-extend', '늘이면 만나는 두 선분과 평행한 두 선분', '17, 기본 ②25', (d) => {
        // 그림에 함정을 둔다: 그림에서는 만나지 않지만 늘이면 만나는 두 선분(만나지 않으면 평행이라고 보는 아이가 센다)과,
        // 길이와 놓인 자리가 달라도 평행한 두 선분 둘(나란히 놓이지 않으면 평행이 아니라고 보는 아이가 뺀다).
        const pools = {
          full: [[[[0, 1], [4, 2]], [[0, 3], [4, 4]]], [[[0, 2], [4, 0]], [[0, 4], [4, 2]]]], stagger: [[[[0, 1], [2, 0]], [[0, 4], [4, 2]]], [[[0, 0], [1, 2]], [[2, 0], [4, 4]]]],
          near: [[[[0, 1], [4, 1]], [[0, 3], [4, 4]]], [[[0, 0], [3, 1]], [[1, 4], [4, 4]]]], cross: [[[[0, 0], [4, 3]], [[0, 3], [3, 0]]], [[[0, 2], [4, 2]], [[2, 2], [3, 4]]]]
        };
        const kinds = d.shuffle(['full', 'stagger', 'stagger', 'near', 'cross']), both = d.shuffle(pools.stagger), picks = kinds.map((k) => (k === 'stagger' ? both.pop() : d.pick(pools[k]))), labels = TAGS.slice(0, 5);
        const flags = picks.map(([[a, b], [p, q]]) => G.cross(G.sub(b, a), G.sub(q, p)) === 0), near = labels[kinds.indexOf('near')];
        return N('모눈종이에 선분을 2개씩 그렸다. 선분을 양쪽으로 끝없이 늘여 직선을 만들 때, 두 직선이 서로 평행한 것은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: G.tiles(picks.map(([[a, b], [p, q]], i) => [labels[i], G.board(4, 4, [G.line(a, b), G.line(p, q)], { grid: 'lines', label: '모눈종이 위의 두 선분' })])),
          explain: `${labels.filter((_, i) => flags[i]).join(', ')}는 두 선분이 기울어진 정도가 같아서 아무리 늘여도 만나지 않는다. ${near}는 그림에서는 만나지 않지만 기울어진 정도가 달라서 늘이면 만난다. 평행한지는 선분의 길이나 놓인 자리가 아니라 늘였을 때 만나는지로 가린다.`,
          facts: { count: flags }
        });
      }, { standard: LINE }),
      H('hard-para-triple', '서로 평행한 직선이 셋일 때 평행선의 쌍 세기', '10·11', (d) => {
        const nv = d.pick([1, 2]), made = crossing(d, 3, nv, nv === 1 ? 1 : 0), pairs = pairsOf(made.lines.length), flags = pairs.map(([i, j]) => isPara(made, i, j)), us = made.lines.map((l, i) => (l.kind === 'u' ? i : -1)).filter((i) => i >= 0);
        return N('그림에서 평행선은 모두 몇 쌍 찾을 수 있는가?', flags.filter(Boolean).length, {
          unit: '쌍', figure: lineArt(made), explain: `${us.map(ln).join(', ')}는 서로 평행하다. 서로 평행한 직선이 3개이면 둘씩 짝 지어 3쌍이 된다.` + (nv === 2 ? ' 나머지 두 직선도 서로 평행하므로 모두 3 + 1 = 4(쌍)이다.' : ' 나머지 직선끼리는 평행하지 않으므로 모두 3쌍이다.'),
          facts: { count: flags }
        });
      }, { standard: LINE }),
      H('hard-dist-stairs', '꺾인 도형에서 평행한 두 변 사이의 거리', '26, 기본 ②39 ③35', (d) => {
        // 그림에 함정을 둔다: 계단 모양 도형 ㄱㄴㄷㄹㅁㅂ에 평행한 변의 길이까지 적는다. 거리는 두 변에 수직인 변 둘의 길이의 합이다.
        const [w1, w2, h1, h2] = d.until(() => [d.int(4, 6), d.int(4, 6), d.int(3, 5), d.int(3, 4)], (v) => new Set(v).size === 4), tall = d.bool(), W = w1 + w2, Hh = h1 + h2, value = tall ? Hh : W;
        const build = (p) => {
          const half = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], at = (pt, dx, dy, text) => G.text([pt[0] + dx, pt[1] + dy], text), len = (pt, dx, dy, text) => lengthAt([pt[0] + dx, pt[1] + dy], text), wide = (text) => 0.3 + text.length * 0.155;
          return [G.polygon(p)].concat([0, 1, 2, 3, 5].map((i) => corner(p, i)), [at(p[0], -0.4, -0.35, 'ㄱ'), at(p[1], -0.4, 0.35, 'ㄴ'), at(p[2], 0.4, 0.35, 'ㄷ'), at(p[3], 0.45, -0.3, 'ㄹ'), at(p[4], -0.4, 0.42, 'ㅁ'), at(p[5], 0.4, -0.35, 'ㅂ'),
            len(half(p[0], p[5]), 0, -0.45, cm(w1)), len(half(p[4], p[5]), -wide(cm(h1)), 0, cm(h1)), len(half(p[3], p[4]), 0, 0.45, cm(w2)), len(half(p[2], p[3]), wide(cm(h2)), 0, cm(h2))]);
        };
        return N(`도형 ㄱㄴㄷㄹㅁㅂ에서 이웃한 두 변은 모두 서로 수직으로 만난다. ${tall ? '변 ㄱㅂ과 변 ㄴㄷ' : '변 ㄱㄴ과 변 ㄷㄹ'} 사이의 거리는 몇 cm인가?`, value, {
          unit: 'cm', figure: scene([[0, 0], [0, Hh], [W, Hh], [W, h1], [w1, h1], [w1, 0]], build, { box: [6.6, 4.4], pad: [1.7, 1.1], label: `계단 모양의 도형 ㄱㄴㄷㄹㅁㅂ. 변 ㄱㅂ ${w1} cm, 변 ㅁㅂ ${h1} cm, 변 ㄹㅁ ${w2} cm, 변 ㄷㄹ ${h2} cm` }),
          explain: tall ? `변 ㄱㅂ과 변 ㄴㄷ에 수직인 변은 변 ㅁㅂ과 변 ㄷㄹ이다. 거리는 두 변의 길이를 더한 ${h1} + ${h2} = ${value}(cm)이다.` : `변 ㄱㄴ과 변 ㄷㄹ에 수직인 변은 변 ㄱㅂ과 변 ㄹㅁ이다. 거리는 두 변의 길이를 더한 ${w1} + ${w2} = ${value}(cm)이다.`,
          facts: { calc: [[tall ? `${h1}+${h2}` : `${w1}+${w2}`, 0]] }
        });
      }, { standard: LINE }),
      H('hard-trap-all', '평행한 변이 두 쌍인 사각형이 섞인 그림에서 사다리꼴 세기', '36·68, 기본 ②45 ③39·40', (d) => {
        // 그림에 함정을 둔다: 평행사변형·직사각형(정사각형)·마름모를 섞는다. 평행한 변이 한 쌍뿐이어야 사다리꼴이라고 보는 아이는 1개라고 답한다.
        const kinds = d.shuffle(['tr', 'pg', 'rc', 'rh', 'no']), picks = kinds.map((k) => vary(d, d.pick({ tr: TRAPS, pg: PGRAMS, rc: RECTS.slice(0, 2).concat(SQUARES), rh: RHOMBI, no: NONES }[k]))), labels = TAGS.slice(0, 5), flags = picks.map((pts) => kindOf(pts).trap);
        return N('모눈종이에 그린 사각형 가운데 사다리꼴은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tilesOf(picks, '모눈종이 위의 사각형'), explain: `사다리꼴은 평행한 변이 한 쌍이라도 있는 사각형이다. 평행한 변이 두 쌍인 사각형도 사다리꼴이므로 ${labels.filter((_, i) => flags[i]).join(', ')}가 모두 사다리꼴이다. ${labels[kinds.indexOf('no')]}에는 평행한 변이 없다.`,
          facts: { count: flags }
        });
      }),
      H('hard-trap-cut', '사다리꼴에 평행한 선분을 그어 생긴 평행사변형', '86, 기본 ①59 ③57', (d) => {
        const [t, b] = d.pick([[7, 10], [8, 11], [9, 12], [9, 13], [10, 14], [11, 15]]), o = 2, h = 5, raw = [[o, 0], [0, h], [b, h], [o + t, 0], [t, h]];
        return N('사다리꼴 ㄱㄴㄷㄹ에서 변 ㄱㄹ과 변 ㄴㄷ은 서로 평행하다. 변 ㄱㄴ과 평행하게 선분 ㄹㅁ을 그었다. 선분 ㅁㄷ의 길이는 몇 cm인가?', b - t, {
          unit: 'cm', figure: shape(raw, { count: 4, names: N4, sides: { 3: cm(t) }, extra: (p) => thin(p[3], p[4]) + G.text([p[4][0], p[4][1] + 0.5], 'ㅁ') + under(p[1], p[2], cm(b)), box: [6.6, 3.4], pad: [1.7, 1.35], label: `사다리꼴 ㄱㄴㄷㄹ. 변 ㄱㄹ ${t} cm, 변 ㄴㄷ ${b} cm. 꼭짓점 ㄹ에서 변 ㄱㄴ과 평행하게 그은 선분이 변 ㄴㄷ과 점 ㅁ에서 만난다.` }),
          explain: `사각형 ㄱㄴㅁㄹ은 마주 보는 두 쌍의 변이 서로 평행하므로 평행사변형이다. 선분 ㄴㅁ의 길이는 마주 보는 변 ㄱㄹ과 같은 ${t} cm이다. 선분 ㅁㄷ의 길이는 ${b} − ${t} = ${b - t}(cm)이다.`,
          facts: { calc: [[`${b}-${t}`, 0]] }
        });
      }),
      H('hard-square-find', '기울어진 정사각형과 마름모가 섞인 그림에서 정사각형 세기', '67, 기본 ②85·86 ③44', (d) => {
        // 그림에 함정을 둔다: 비스듬히 놓인 정사각형 둘(기울어진 것은 정사각형이 아니라고 보는 아이가 뺀다), 마름모(네 변이 같으면 정사각형이라고 보는 아이가 센다), 직사각형.
        const kinds = d.shuffle(['sq', 'tilt', 'tilt2', 'rh', 'rc']), picks = kinds.map((k) => vary(d, { sq: d.pick(SQUARES), tilt: TILTED[0], tilt2: TILTED[1], rh: d.pick(RHOMBI), rc: d.pick(RECTS.slice(0, 2)) }[k])), labels = TAGS.slice(0, 5), tag = (k) => labels[kinds.indexOf(k)];
        const flags = picks.map((pts) => kindOf(pts).square);
        return N('모눈종이에 그린 사각형 가운데 정사각형은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tilesOf(picks, '모눈종이 위의 사각형'), explain: `정사각형은 네 변의 길이가 모두 같고 네 각이 모두 직각인 사각형이다. ${tag('tilt')}, ${tag('tilt2')}는 비스듬히 놓여 있지만 칸을 세어 보면 네 변의 길이가 같고 네 각이 모두 직각이다. ${tag('rh')}는 네 변의 길이는 같지만 직각이 없고, ${tag('rc')}는 네 각은 직각이지만 변의 길이가 다르다. 정사각형은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-rect-count', '비스듬히 놓인 정사각형이 섞인 그림에서 직사각형 세기', '68, 기본 ①76 ②85', (d) => {
        // 그림에 함정을 둔다: 정사각형(직사각형이 아니라고 보는 아이가 뺀다), 비스듬히 놓인 정사각형(마름모로만 보는 아이가 뺀다), 마름모.
        const kinds = d.shuffle(['rc', 'sq', 'tilt', 'rh']), picks = kinds.map((k) => vary(d, d.pick({ rc: RECTS, sq: SQUARES, tilt: TILTED, rh: RHOMBI }[k]))), labels = TAGS.slice(0, 4), tag = (k) => labels[kinds.indexOf(k)];
        const flags = picks.map((pts) => kindOf(pts).rect);
        return N('모눈종이에 그린 사각형 가운데 직사각형은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tilesOf(picks, '모눈종이 위의 사각형'), explain: `직사각형은 네 각이 모두 직각인 사각형이다. 정사각형도 네 각이 모두 직각이므로 직사각형이다. ${tag('tilt')}는 비스듬히 놓여 있지만 네 각이 모두 직각인 정사각형이다. ${tag('rh')}에는 직각이 없다. 직사각형은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
          facts: { rectCount: picks }
        });
      }),
      H('hard-square-rect', '직사각형을 정사각형과 직사각형으로 나눈 그림', '88', (d) => {
        const [L, r] = d.pick([[13, 4], [12, 4], [14, 4], [15, 5], [11, 3], [16, 5]]), s = L - r, raw = [[0, 0], [0, s], [L, s], [L, 0], [s, s], [s, 0]];
        return N('직사각형 ㄱㄴㅁㅂ을 선분 ㄹㄷ으로 나누었더니 사각형 ㄱㄴㄷㄹ이 정사각형이 되었다. 변 ㄱㄴ의 길이는 몇 cm인가?', s, {
          unit: 'cm', figure: shape(raw, { count: 4, names: ['ㄱ', 'ㄴ', 'ㅁ', 'ㅂ'], extra: (p) => G.line(p[5], p[4]) + G.text([p[4][0], p[4][1] + 0.5], 'ㄷ') + G.text([p[5][0] - 0.3, p[5][1] - 0.5], 'ㄹ') + lengthAt([(p[5][0] + p[3][0]) / 2, p[5][1] - 0.45], cm(r)) + under(p[1], p[2], cm(L)), box: [6.4, 3.8], pad: [1.7, 1.35], label: `직사각형 ㄱㄴㅁㅂ. 변 ㄱㅂ 위의 점 ㄹ과 변 ㄴㅁ 위의 점 ㄷ을 이은 선분 ㄹㄷ. 변 ㄴㅁ ${L} cm, 선분 ㄹㅂ ${r} cm` }),
          explain: `직사각형은 마주 보는 두 변의 길이가 같으므로 변 ㄱㅂ의 길이는 ${L} cm이고, 선분 ㄱㄹ의 길이는 ${L} − ${r} = ${s}(cm)이다. 사각형 ㄱㄴㄷㄹ이 정사각형이므로 변 ㄱㄴ의 길이도 ${s} cm이다.`,
          facts: { calc: [[`${L}-${r}`, 0]] }
        });
      }),
      H('hard-iso-pgram', '이등변삼각형과 평행사변형을 이어 붙인 도형의 변', '78·85', (d) => {
        const [e, t] = d.until(() => [d.int(6, 10), d.int(5, 12)], ([x, y]) => x !== y && y >= x - 3 && y <= x + 3), m = 2 * e * Math.cos(65 * RAD), hgt = e * Math.sin(65 * RAD);
        const raw = [[m / 2, 0], [0, hgt], [m + t, hgt], [m / 2 + t, 0], [m, hgt]];   // ㄱ ㄴ ㄷ ㄹ ㅁ
        return M('삼각형 ㄱㄴㅁ은 변 ㄱㄴ과 변 ㄱㅁ의 길이가 같은 이등변삼각형이고, 사각형 ㄱㅁㄷㄹ은 평행사변형이다. 변 ㄹㄷ의 길이와 선분 ㅁㄷ의 길이를 구하시오.', [{ label: '변 ㄹㄷ', answer: e, unit: 'cm' }, { label: '선분 ㅁㄷ', answer: t, unit: 'cm' }], {
          figure: shape(raw, { count: 4, names: N4, sides: { 0: cm(e), 3: cm(t) }, extra: (p) => G.line(p[0], p[4]) + G.text([p[4][0], p[4][1] + 0.5], 'ㅁ'), box: [6.6, 3.6], label: `이등변삼각형 ㄱㄴㅁ과 평행사변형 ㄱㅁㄷㄹ을 변 ㄱㅁ에서 이어 붙인 그림. 점 ㅁ은 선분 ㄴㄷ 위에 있다. 변 ㄱㄴ ${e} cm, 변 ㄱㄹ ${t} cm` }),
          explain: `변 ㄱㅁ의 길이는 변 ㄱㄴ과 같은 ${e} cm이다. 평행사변형은 마주 보는 두 변의 길이가 같으므로 변 ㄹㄷ의 길이는 변 ㄱㅁ과 같은 ${e} cm, 선분 ㅁㄷ의 길이는 변 ㄱㄹ과 같은 ${t} cm이다.`,
          facts: { calc: [[String(e), 0], [String(t), 1]] }
        });
      }),
      H('hard-pgram-rhom-cut', '평행사변형에서 마름모를 잘라 낸 나머지', '기본 ③86', (d) => {
        const [a, b] = d.pick([[10, 7], [11, 8], [12, 9], [13, 9], [14, 10], [9, 6]]), slope = d.pick([60, 65, 70]), r = pg(a, b, slope), raw = r.concat([[r[0][0] + b, 0], [b, r[1][1]]]);   // ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ
        return N('평행사변형 ㄱㄴㄷㄹ을 선분 ㅁㅂ으로 나누었더니 사각형 ㄱㄴㅂㅁ이 마름모가 되었다. 선분 ㅂㄷ의 길이는 몇 cm인가?', a - b, {
          unit: 'cm', figure: shape(raw, { count: 4, names: N4, sides: { 0: cm(b) }, extra: (p) => thin(p[4], p[5]) + G.text([p[4][0], p[4][1] - 0.5], 'ㅁ') + G.text([p[5][0], p[5][1] + 0.5], 'ㅂ') + under(p[1], p[2], cm(a)), box: [6.6, 3.4], pad: [1.7, 1.35], label: `평행사변형 ㄱㄴㄷㄹ. 변 ㄱㄹ 위의 점 ㅁ과 변 ㄴㄷ 위의 점 ㅂ을 이은 선분 ㅁㅂ. 변 ㄱㄴ ${b} cm, 변 ㄴㄷ ${a} cm` }),
          explain: `마름모 ㄱㄴㅂㅁ은 네 변의 길이가 모두 같으므로 선분 ㄴㅂ의 길이는 변 ㄱㄴ과 같은 ${b} cm이다. 선분 ㅂㄷ의 길이는 ${a} − ${b} = ${a - b}(cm)이다.`,
          facts: { calc: [[`${a}-${b}`, 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
