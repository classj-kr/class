// 4학년 1학기 4단원 삼각형 — 각의 크기에 따라 분류하기, 두 가지 기준으로 분류하기의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3의 「예각·직각·둔각삼각형」「두 기준으로 분류」 묶음, 심화꼴 64꼴)을 번호마다 따져서 실었다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 이등변삼각형에서 크기가 같은 두 각을 「아래에 놓인 두 각」이나 「길이가 같은 두 변 사이의 각과 그 옆의 각」으로 여긴다(삼각형이 돌아가 있으면 틀린다).
//   ② 예각이 하나라도 있으면 예각삼각형이라고 여긴다(직각삼각형·둔각삼각형에도 예각이 둘 있다).
//   ③ 둔각삼각형에는 둔각이 둘 있을 수 있다고 여긴다.
//   ④ 모양이 뒤집히거나 돌아가 있으면 다른 삼각형으로 여긴다(기울어진 직각을 못 본다).
//   ⑤ 한 삼각형의 이름은 하나뿐이라고 여긴다(이등변삼각형이면서 직각삼각형).
//   ⑥ 한 각만 아는 이등변삼각형에서 그 각을 한 가지 자리로만 본다.
// 그다음에 두 번 넘게 따져야 하는 각도 문제를 실었다(직선 위의 각과 이등변삼각형의 각, 이어 붙인 정삼각형과 이등변삼각형, 원 안의 삼각형 둘).
//
// 뺀 것과 까닭(4-1-4a.js에 적은 것 말고)
//  - 크고 작은 삼각형을 모두 세기(①53 ②59·72 ③52 심62·63), 원 위의 점으로 만들 수 있는 삼각형 세기(②73 심64 — 직각임을 아는 데는 중학교 원주각도 든다): 경우 따지기
//  - 예각삼각형·둔각삼각형이 되는 각의 범위(②58·74): 조건을 거꾸로 따져 범위를 잡는 것이 전부다.
//  - 그리기·선분 그어 나누기(①54·55·64 ②60·61·71 ③50·51·62·65·66 심60·61), 고쳐 쓰기·까닭 쓰기(①65, ①50·②51·③48·59·60의 글 쓰기), 성냥개비 옮기기(③67)
//  - 길이가 같은 막대 3개로 만든 삼각형의 이름 모두(②68)·정삼각형 그림의 이름 모두(①56·②63·③54·심50의 정삼각형 그림): 정삼각형을 이등변삼각형으로 치느냐에 답이 달려 있다.
//  - 꼭짓점을 몇 칸 옮겨야 예각삼각형이 되는가(심49의 디딤돌 꼴): 위쪽 각이 직각을 넘는 자리를 삼각자 없이 화면에서 가릴 수 없다. 한두 칸 옮긴 삼각형의 종류만 묻는다.
//  - 두 기준 분류표(①60 ②66 ③58 심54): 답이 표다. 같은 판단은 「두 조건에 맞는 삼각형 찾기」가 묻는다.
//  - 조각 그림에서 종류별로 세기(①52)·분류해 놓은 무리의 이름(①46): 뽑은 글에 그림이 없다. 같은 판단은 「잘라 낸 조각 가르기」「삼각형 하나의 이름」이 묻는다.
// 모눈·점 종이 위의 삼각형은 꼭짓점이 모두 모눈의 점 위에 있어 예각·직각·둔각을 내적으로 가린다. 직각이 아닌 각은 72°~108° 사이에 두지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, tagged, N, M, C } = B.kit;
  const G = B.kit.geo;
  const SIDE = '4수03-08', ANGLE = '4수03-09';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바', '사'];
  const CIRCLED = ['①', '②', '③', '④'];
  const RAD = Math.PI / 180;
  const KIND = { acute: '예각삼각형', right: '직각삼각형', obtuse: '둔각삼각형' };
  const NAMES5 = ['이등변삼각형', '정삼각형', '예각삼각형', '직각삼각형', '둔각삼각형'];
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';
  const deg = (list) => list.map((v) => v + '°').join(', ');

  // ── 그림(4-1-4a.js와 같은 도구) ──────────────────────────────
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  function place(raw, box, pad) {
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
    const k = Math.min(box[0] / w, box[1] / h);
    return { points: raw.map(([x, y]) => [(x - x0) * k + pad[0], (y - y0) * k + pad[1]]), cols: w * k + pad[0] * 2, rows: h * k + pad[1] * 2 };
  }
  const draw = (fit, parts, label, scale) => G.board(fit.cols, fit.rows, parts, { grid: false, scale: Math.min(scale || 1.15, 296 / (32 + fit.cols * 22)), label });
  function bySides(base, left, right) {
    const a = Math.acos((left * left + base * base - right * right) / (2 * left * base));
    return [[0, 0], [base, 0], [left * Math.cos(a), -left * Math.sin(a)]];
  }
  // 꼭짓점 v 에서 p 쪽과 q 쪽으로 벌어진 각에 호(직각이면 직각 표시)와 글을 넣는다. limit: 꼭짓점에서 맞은편 변까지의 거리(글이 그 변을 넘지 않게 당겨 적는다).
  function wedge(v, p, q, label, r, limit) {
    const a = G.bearing(v, p), b = G.bearing(v, q);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    const open = to - from, way = (from + to) / 2, right = Math.abs(open - 90) < 0.01, half = Math.max(String(label || '').length * 0.17 + 0.12, 0.38);
    const reach = half * Math.abs(Math.cos(way * RAD)) + 0.3 * Math.abs(Math.sin(way * RAD));
    const near = (r || 0.6) + 0.62, far = Math.min(Math.max(near, half / Math.tan((open / 2) * RAD)), limit ? limit - reach - 0.12 : 3);
    // 좁은 각은 글이 꼭짓점에서 멀어지므로 호도 글 바로 앞까지 크게 그려 어느 각의 글인지 알 수 있게 한다.
    const size = far > near + 0.01 ? Math.max(r || 0.6, far - reach - 0.12) : Math.min(r || 0.6, Math.max(0.3, far - 0.52));
    return (right ? G.squareMark(v, from, to) : G.arc(v, from, to, size)) + (label ? G.text(G.toward(v, right ? 1.05 : far, way), label, 'mb-label is-length') : '');
  }
  function corner(points, i, label, r) {
    const n = points.length, v = points[i], p = points[(i + n - 1) % n], q = points[(i + 1) % n];
    if (n !== 3) return wedge(v, p, q, label, r);
    const unit = (w) => { const size = Math.hypot(w[0], w[1]); return [w[0] / size, w[1] / size]; }, u1 = unit(G.sub(p, v)), u2 = unit(G.sub(q, v)), u = unit([u1[0] + u2[0], u1[1] + u2[1]]);
    return wedge(v, p, q, label, r, G.cross(G.sub(p, v), G.sub(q, p)) / G.cross(u, G.sub(q, p)));
  }
  function sideSpot(p, q, away, value) {
    const m = mid(p, q), len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let n = [-(q[1] - p[1]) / len, (q[0] - p[0]) / len];
    if ((away[0] - m[0]) * n[0] + (away[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const off = 0.42 + Math.abs(n[0]) * String(value).length * 0.15;
    return [m[0] + n[0] * off, m[1] + n[1] * off];
  }
  const sideText = (p, q, away, value) => G.text(sideSpot(p, q, away, value), value, 'mb-label is-length');
  const sideOf = (points, i, j, value) => sideText(points[i], points[j], points[3 - i - j], value);
  const cm = (v) => v + ' cm';
  // 삼각형 여럿을 두 줄로 늘어놓고 가, 나, 다 … 를 붙인다. cells: [{ raw: 꼭짓점 셋, sides: [변 0–1, 변 0–2, 변 1–2 에 적을 글], square: 직각 표시를 하는가 }]
  function gallery(cells, label) {
    const W = 6, Hh = 4.4, parts = [], PAIRS = [[0, 1], [0, 2], [1, 2]];
    cells.forEach((cell, i) => {
      const ox = (i % 2) * W, oy = Math.floor(i / 2) * Hh, at = place(cell.raw, [3.1, 2.3], [0, 0]).points;
      const spots = PAIRS.map(([a, b], k) => { const c = sideSpot(at[a], at[b], at[3 - a - b], cell.sides[k]), half = cell.sides[k].length * 0.16; return [[c[0] - half, c[1] - 0.3], [c[0] + half, c[1] + 0.3]]; });
      const all = at.concat(...spots), xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
      const dx = ox + (W - Math.max(...xs) - Math.min(...xs)) / 2, dy = oy + 0.25 + (Hh - Math.max(...ys) - Math.min(...ys)) / 2, points = at.map(([x, y]) => [x + dx, y + dy]);
      parts.push(G.polygon(points), G.text([ox + 0.3, oy + 0.4], TAGS[i]));
      PAIRS.forEach(([a, b], k) => parts.push(sideOf(points, a, b, cell.sides[k])));
      if (cell.square) points.forEach((_, v) => { if (Math.abs(G.angleOf(points, v) - 90) < 0.01) parts.push(corner(points, v)); });
    });
    return G.board(W * 2 - 0.3, Math.ceil(cells.length / 2) * Hh - 0.2, parts, { grid: false, scale: 1, label });
  }
  // 밑변의 두 각이 b° 인 이등변삼각형 [왼쪽 아래 ㄴ, 오른쪽 아래 ㄷ, 위 ㄱ]
  const isoFit = (b) => place(G.triangle(b, b, 1, [0, 0]), [b <= 40 ? 7 : 5.4, 5.6], [1.5, 0.95]);
  const NAMES3 = ['ㄴ', 'ㄷ', 'ㄱ'];
  const ISO = [[30, 7, 4], [35, 10, 6], [40, 9, 6], [50, 9, 7], [55, 7, 6], [65, 5, 6], [70, 7, 10], [75, 5, 10]];
  const ring = (c, r) => G.circle(c, r).replace('class="mb-poly"', 'class="mb-poly is-plain"');
  // 모눈 위의 도형을 판 가운데에 놓아 그린다.
  function centered(points, cols, rows) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    const dx = Math.floor((cols - Math.max(...xs) - Math.min(...xs)) / 2), dy = Math.floor((rows - Math.max(...ys) - Math.min(...ys)) / 2);
    return points.map((p) => [p[0] + dx, p[1] + dy]);
  }
  const gridTile = (points, rows) => G.board(4, rows, [G.polygon(centered(points, 4, rows))], { grid: 'lines', label: '모눈종이 위의 삼각형' });
  const lattice = (cols, rows) => { const out = []; for (let x = 0; x <= cols; x += 1) for (let y = 0; y <= rows; y += 1) out.push([x, y]); return out; };
  // 원의 중심 ㅇ과 원 위의 두 점 ㄱ, ㄴ을 이은 삼각형. open: 가운데 각, up: 삼각형이 중심의 위쪽에 놓이는가
  function circleTriangle(open, up, mark) {
    const c = [3.3, 3.3], r = 2.5, turn = up ? 180 : 0, p = G.toward(c, r, turn + 270 - open / 2), q = G.toward(c, r, turn + 270 + open / 2);
    return G.board(6.6, 6.6, [ring(c, r), G.polygon([c, p, q]), corner([c, p, q], 0, mark), G.point(c), G.point(p), G.point(q), G.text(G.toward(c, 0.5, turn + 90), 'ㅇ'), G.text(G.beyond(c, p, 0.45), 'ㄱ'), G.text(G.beyond(c, q, 0.45), 'ㄴ')],
      { grid: false, scale: 1.3, label: `원의 중심 ㅇ과 원 위의 두 점 ㄱ, ㄴ을 이은 삼각형 ㅇㄱㄴ. 각 ㄱㅇㄴ은 ${open === 90 ? '직각' : open + '°'}` });
  }

  // ── 판정 ─────────────────────────────────────────────────────
  // 모눈의 점 위에 꼭짓점이 있는 삼각형: 두 변의 내적이 0이면 직각, 음수이면 둔각
  const dotsOf = (t) => t.map((v, i) => { const a = G.sub(t[(i + 1) % 3], v), b = G.sub(t[(i + 2) % 3], v); return [G.dot(a, b), G.len2(a) * G.len2(b)]; });
  const kindOf = (t) => { const list = dotsOf(t).map(([x]) => x); return list.some((x) => x === 0) ? 'right' : list.some((x) => x < 0) ? 'obtuse' : 'acute'; };
  // 직각이 아닌 각이 직각과 뚜렷이 다른가(72°~108° 사이의 각이 없다)
  const clear = (t) => dotsOf(t).every(([x, size]) => x === 0 || (x * x) / size >= 0.095);
  const isoLattice = (t) => new Set([G.len2(G.sub(t[0], t[1])), G.len2(G.sub(t[1], t[2])), G.len2(G.sub(t[0], t[2]))]).size < 3;
  const kindByAngles = (list) => { const top = Math.max(...list); return top === 90 ? 'right' : top > 90 ? 'obtuse' : 'acute'; };
  const third = (x, y) => 180 - x - y;
  const isoByAngles = (x, y) => x === y || third(x, y) === x || third(x, y) === y;

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
  // 삼각형의 이름을 모두 고르는 문제: 이등변삼각형인가(iso), 각으로 본 종류(kind), 잘못 고르기 쉬운 이름(lure).
  // 보기는 「두 이름」「각으로 본 이름만」「변으로 본 이름 + 틀린 이름」「틀린 이름만」이다(이등변삼각형이 아니면 둘째가 답이다).
  function nameOptions(d, iso, kind, lure) {
    const ordered = (list) => NAMES5.filter((word) => list.includes(word));
    const flags = NAMES5.map((word) => (word === '이등변삼각형' ? iso : word === KIND[kind])), right = NAMES5.filter((_, i) => flags[i]);
    const sets = d.shuffle([['이등변삼각형', KIND[kind]], [KIND[kind]], ['이등변삼각형', lure], [lure]].map(ordered));
    return { options: sets.map((s) => s.join(', ')), answer: sets.findIndex((s) => s.join() === right.join()), facts: { sets: { labels: NAMES5, flags, options: sets } } };
  }
  // 각으로 본 종류를 헷갈려 고르기 쉬운 이름: 직각·둔각삼각형에도 예각이 둘 있어 예각삼각형으로 여긴다.
  const LURE = { acute: '둔각삼각형', right: '예각삼각형', obtuse: '예각삼각형' };

  // ── 그림 감 ──────────────────────────────────────────────────
  // 모눈 위의 삼각형(가로 4칸). 밑변이 아래에 놓인 것
  const UPRIGHT = {
    acute: [[[0, 3], [4, 3], [2, 0]], [[0, 3], [4, 3], [1, 0]], [[0, 3], [4, 3], [3, 0]], [[1, 3], [4, 3], [2, 0]], [[0, 3], [3, 3], [1, 0]]],
    right: [[[0, 0], [0, 3], [4, 3]], [[0, 3], [4, 3], [4, 0]], [[0, 3], [3, 3], [0, 0]], [[0, 2], [2, 0], [4, 2]]],
    obtuse: [[[0, 3], [2, 3], [4, 0]], [[2, 3], [4, 3], [0, 0]], [[0, 3], [4, 3], [2, 2]], [[0, 3], [2, 3], [4, 1]], [[1, 3], [4, 3], [0, 0]], [[0, 3], [3, 3], [4, 0]]]
  };
  // 뒤집히거나 기울어진 것(가로 4칸, 세로 4칸)
  const TURNED = {
    acute: [[[0, 0], [4, 0], [2, 3]], [[0, 1], [4, 0], [3, 4]], [[0, 0], [1, 4], [4, 1]], [[0, 0], [3, 2], [0, 4]]],
    right: [[[1, 0], [4, 1], [0, 3]], [[0, 1], [3, 0], [4, 3]], [[0, 1], [1, 4], [3, 0]]],
    obtuse: [[[0, 0], [3, 1], [4, 4]], [[0, 4], [1, 1], [4, 0]], [[0, 0], [0, 2], [3, 4]], [[0, 0], [4, 0], [2, 1]]]
  };
  // 변의 길이를 적어 그리는 삼각형 [밑변, 왼쪽 변, 오른쪽 변](cm). 각으로 본 종류가 눈에 뚜렷한 것만(가장 큰 각이 76°보다 작거나 직각이거나 108°보다 크다).
  const SHAPES = {
    'iso-acute': [[5, 6, 6], [4, 5, 5], [5, 7, 7], [6, 8, 8], [6, 7, 7]],
    'iso-obtuse': [[9, 5, 5], [10, 6, 6], [7, 4, 4], [11, 6, 6], [12, 7, 7]],
    'other-acute': [[9, 7, 8], [10, 8, 9], [11, 9, 10], [8, 6, 7]],
    'other-right': [[4, 3, 5], [8, 6, 10]],
    'other-obtuse': [[8, 4, 5], [7, 3, 5], [9, 4, 6], [10, 5, 6], [10, 5, 7]]
  };
  const shapeCell = (s, kind) => ({ raw: bySides(s[0], s[1], s[2]), sides: s.map(cm), square: kind.endsWith('right') });
  const SIDE_WORD = { iso: '두 변의 길이가 같은 삼각형', other: '세 변의 길이가 모두 다른 삼각형' };
  const KIND_SAID = { acute: '세 각이 모두 예각', right: '한 각이 직각', obtuse: '한 각이 둔각' };
  const shapesTold = (list) => '삼각형 ' + list.length + '개. ' + list.map(([s, kind], i) => `${TAGS[i]}: 세 변의 길이 ${s.map(cm).join(', ')}, ${KIND_SAID[kind.split('-')[1]]}`).join(' / ');
  // 세 각의 크기(글로 주는 삼각형)
  const ANGLES3 = {
    acute: [[50, 60, 70], [40, 60, 80], [55, 60, 65], [45, 55, 80], [70, 70, 40], [65, 50, 65], [80, 45, 55], [75, 35, 70]],
    right: [[30, 60, 90], [20, 70, 90], [40, 50, 90], [45, 45, 90], [35, 55, 90], [10, 80, 90]],
    obtuse: [[30, 40, 110], [20, 50, 110], [25, 35, 120], [35, 45, 100], [40, 40, 100], [45, 40, 95], [15, 60, 105], [30, 30, 120]]
  };

  B.addTypes('4-1-4', 'angles', [
    T('angles-word', '뜻에 맞는 삼각형의 이름', '①43 ②45 ③40', (d) => {
      const [say, want] = d.pick([['세 각이 모두 예각인 삼각형', '예각삼각형'], ['한 각이 둔각인 삼각형', '둔각삼각형']]), list = d.shuffle(['예각삼각형', '직각삼각형', '둔각삼각형']);
      return C(`${say}을 무엇이라고 하는가?`, list, list.indexOf(want), { explain: `${say}을 ${want}이라고 한다.`, facts: { truth: list.map((word) => word === want), want: true } });
    }),
    T('angles-count', '삼각형에 있는 예각·직각·둔각의 수', '①44 ②53 ③46', (d) => {
      const [name, word] = d.pick([['둔각삼각형', '둔각'], ['직각삼각형', '직각']]);
      return M(`${name}에는 예각과 ${word}이 각각 몇 개 있는가?`, [{ label: '예각', answer: 2, unit: '개' }, { label: word, answer: 1, unit: '개' }], {
        explain: `${name}은 한 각이 ${word}인 삼각형이다. 세 각의 크기의 합이 180°이므로 ${word}은 1개뿐이고, 나머지 두 각은 예각이다.`, facts: { calc: [['2', 0], ['1', 1]], unseen: [2, 1] }
      });
    }),
    T('angles-find', '그림에서 예각삼각형·둔각삼각형 찾기', '①45 ②47·48 ③41 심42', (d) => {
      const target = d.pick(['acute', 'obtuse']), other = target === 'acute' ? 'obtuse' : 'acute';
      const mix = d.pick([[target, target, other, 'right'], [target, other, other, 'right'], [target, target, other, other], [target, target, 'right', 'right']]);
      const used = { acute: d.shuffle(UPRIGHT.acute), right: d.shuffle(UPRIGHT.right), obtuse: d.shuffle(UPRIGHT.obtuse) };
      const picks = d.shuffle(mix.map((kind) => used[kind].pop())), flags = picks.map((points) => kindOf(points) === target), made = setOptions(d, TAGS.slice(0, 4), flags);
      return C(`${KIND[target]}을 모두 고른 것은?`, made.options, made.answer, {
        figure: G.tiles(picks.map((points, i) => [TAGS[i], gridTile(points, 3)])),
        explain: `${target === 'acute' ? '세 각이 모두 예각인 삼각형이 예각삼각형이다' : '한 각이 둔각인 삼각형이 둔각삼각형이다'}. ` + picks.map((points, i) => `${TAGS[i]}는 ${KIND[kindOf(points)]}`).join(', ') + '이다.',
        facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets } }
      });
    }),
    T('angles-name', '삼각형 하나의 이름', '①46 ②46 ③41', (d) => {
      // 가장 큰 각이 아래나 옆에 놓인 삼각형도 섞는다.
      const kind = d.pick(['acute', 'obtuse', 'obtuse', 'right']), points = d.pick(TURNED[kind].concat(UPRIGHT[kind].slice(0, 2))), order = d.shuffle(['acute', 'right', 'obtuse']);
      return C('모눈종이에 그린 삼각형이다. 예각삼각형, 직각삼각형, 둔각삼각형 가운데 어느 것인가?', order.map((k) => KIND[k]), order.indexOf(kind), {
        figure: G.board(4, 4, [G.polygon(centered(points, 4, 4))], { grid: 'lines', scale: 1.5, label: '모눈종이 위의 삼각형' }),
        explain: { acute: '세 각이 모두 직각보다 작으므로 예각삼각형이다.', right: '한 각이 직각이므로 직각삼각형이다.', obtuse: '한 각이 직각보다 크므로 둔각삼각형이다.' }[kind],
        facts: { kindPick: { kinds: order, target: kindOf(points) } }
      });
    }),
    T('angles-cut', '선을 따라 자른 조각 가르기', '①47·52 ②54 ③42 심47', (d) => {
      // 직사각형 종이의 위·아래 변을 나누고 지그재그로 선을 그어 삼각형 조각으로 자른다. 조각의 꼭짓점은 모두 모눈의 점 위에 있다.
      const W = 10, Ht = 3, target = d.pick(['acute', 'obtuse']);
      const cuts = (n) => d.until(() => [0].concat(d.shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, n - 1).sort((x, y) => x - y), [W]), (xs) => xs.every((x, i) => i === 0 || x - xs[i - 1] >= 2));
      const pieces = d.until(() => {
        const top = cuts(d.int(2, 3)), low = cuts(d.int(3, 4)), list = []; let i = 0, j = 0;
        while (i < top.length - 1 || j < low.length - 1) {
          const up = j === low.length - 1 || (i < top.length - 1 && d.bool());
          if (up) { list.push([[top[i], 0], [top[i + 1], 0], [low[j], Ht]]); i += 1; } else { list.push([[low[j], Ht], [low[j + 1], Ht], [top[i], 0]]); j += 1; }
        }
        return list;
      }, (list) => list.length >= 5 && list.length <= 7 && list.every((t) => clear(t) && [0, 1, 2].every((k) => G.angleOf(t, k) >= 20))
        && list.some((t) => kindOf(t) === 'acute') && list.some((t) => kindOf(t) === 'obtuse') && list.filter((t) => kindOf(t) === 'right').length <= 2);
      const flags = pieces.map((t) => kindOf(t) === target), names = (kind) => pieces.map((t, i) => (kindOf(t) === kind ? TAGS[i] : '')).filter(Boolean).join(', ') || '없음';
      const parts = pieces.map((t) => G.polygon(t)).concat(pieces.map((t, i) => G.text([(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3], TAGS[i], 'mb-label is-small')));
      return N(`직사각형 모양의 종이를 선을 따라 모두 잘랐다. 잘라 낸 조각 가운데 ${KIND[target]}은 모두 몇 개인가?`, flags.filter(Boolean).length, {
        unit: '개', figure: G.board(W, Ht, parts, { grid: false, scale: 1.15, label: `직사각형 종이를 선을 따라 자른 삼각형 조각 ${pieces.length}개(${TAGS.slice(0, pieces.length).join(', ')})` }),
        explain: `예각삼각형은 ${names('acute')}, 직각삼각형은 ${names('right')}, 둔각삼각형은 ${names('obtuse')}이다. ${KIND[target]}은 ${flags.filter(Boolean).length}개이다.`,
        facts: { count: flags }
      });
    }),
    T('angles-list-three', '세 각의 크기를 보고 고르기', '①48 ②49 ③43 심43', (d) => {
      const target = d.pick(['acute', 'obtuse']), other = target === 'acute' ? 'obtuse' : 'acute';
      const two = d.shuffle(ANGLES3[other]).slice(0, 2), rows = d.shuffle([d.pick(ANGLES3[target]), d.pick(ANGLES3.right), two[0], two[1]]).map((t) => d.shuffle(t)), at = rows.findIndex((t) => kindByAngles(t) === target);
      return C(`세 각의 크기가 다음과 같은 삼각형 가운데 ${KIND[target]}은?`, rows.map(deg), at, {
        explain: target === 'acute' ? `세 각이 모두 90°보다 작은 삼각형을 고른다. 세 각의 크기가 ${deg(rows[at])}인 삼각형이 예각삼각형이다.` : `한 각이 90°보다 큰 삼각형을 고른다. 세 각의 크기가 ${deg(rows[at])}인 삼각형은 ${Math.max(...rows[at])}°인 각이 둔각이므로 둔각삼각형이다.`,
        facts: { kindPick: { kinds: rows.map((t, i) => (kindByAngles(t) === target ? target : 'no' + i)), target } }
      });
    }),
    T('angles-two', '두 각의 크기를 보고 삼각형의 이름 정하기', '①49 ②50 ③44·45 심44', (d) => {
      // 적힌 두 각은 모두 예각이다. 나머지 한 각을 구해야 종류가 정해진다.
      const want = d.pick(['obtuse', 'obtuse', 'right', 'acute']);
      const [x, y] = d.until(() => [d.int(3, 16) * 5, d.int(3, 16) * 5], ([p, q]) => p !== q && p < 90 && q < 90 && third(p, q) !== p && third(p, q) !== q && kindByAngles([p, q, third(p, q)]) === want && third(p, q) <= 130);
      const order = d.shuffle(['acute', 'right', 'obtuse']), z = third(x, y);
      return C(`두 각의 크기가 ${x}°, ${y}°인 삼각형은 예각삼각형, 직각삼각형, 둔각삼각형 가운데 어느 것인가?`, order.map((k) => KIND[k]), order.indexOf(want), {
        explain: `나머지 한 각의 크기는 180° − ${x}° − ${y}° = ${z}°이다. ` + { acute: '세 각이 모두 예각이므로 예각삼각형이다.', right: '한 각이 직각이므로 직각삼각형이다.', obtuse: `${z}°인 각이 둔각이므로 둔각삼각형이다.` }[want],
        facts: { kindPick: { kinds: order, target: kindByAngles([x, y, z]) } }
      });
    }),
    T('angles-say', '예각삼각형·직각삼각형·둔각삼각형의 뜻', '②52 ③47', (d) => {
      const wrong = d.pick([['acute', '예각삼각형은 한 각이 예각인 삼각형이다.'], ['right', '직각삼각형은 두 각이 직각인 삼각형이다.'], ['obtuse', '둔각삼각형은 세 각이 모두 둔각인 삼각형이다.']]);
      const true3 = { acute: '예각삼각형은 세 각이 모두 예각인 삼각형이다.', right: '직각삼각형은 한 각이 직각인 삼각형이다.', obtuse: '둔각삼각형은 한 각이 둔각인 삼각형이다.' };
      const rows = d.shuffle(['acute', 'right', 'obtuse'].map((kind) => (kind === wrong[0] ? [wrong[1], false] : [true3[kind], true])));
      return C('삼각형의 뜻을 잘못 설명한 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        explain: `${true3[wrong[0]]} 직각이나 둔각은 한 삼각형에 1개까지만 있을 수 있고, 예각은 어느 삼각형에나 2개나 3개 있다.`, facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('angles-cannot', '예각삼각형의 한 각이 될 수 없는 크기', '③46', (d) => {
      const values = d.shuffle(d.shuffle([15, 25, 35, 45, 50, 65, 70]).slice(0, 2).concat([d.pick([80, 85]), d.pick([90, 95, 100, 120])]));
      return C('예각삼각형의 한 각의 크기가 될 수 없는 것은?', values.map((v) => v + '°'), values.findIndex((v) => v >= 90), {
        explain: '예각삼각형은 세 각이 모두 예각이다. 예각은 0°보다 크고 90°보다 작은 각이므로 90°이거나 90°보다 큰 각은 예각삼각형의 각이 될 수 없다.', facts: { only: { values, test: 'atLeast', target: 90 } }
      });
    }),
    T('angles-point', '예각삼각형·둔각삼각형이 되는 점', '①51 ②55 ③49 심48', (d) => {
      // 선분 끝의 바로 위에 있는 점과 이으면 직각삼각형, 그 바깥쪽 점과 이으면 둔각삼각형이 된다.
      const [a, b] = d.pick([[[1, 4], [5, 4]], [[2, 4], [6, 4]], [[1, 4], [4, 4]], [[2, 4], [5, 4]]]), target = d.pick(['acute', 'obtuse']), far = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= 2;
      const points = d.until(() => d.shuffle(lattice(6, 3)).slice(0, 4), (list) => { const kinds = list.map((c) => kindOf([a, b, c])); return kinds.filter((k) => k === target).length === 1 && kinds.includes('right') && kinds.includes(target === 'acute' ? 'obtuse' : 'acute') && list.every((c) => clear([a, b, c])) && list.every((p, i) => list.every((q, j) => i === j || far(p, q))); });
      const base = [G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.1, a[1] + 0.6], 'ㄱ'), G.text([b[0] + 0.1, b[1] + 0.6], 'ㄴ')].concat(points.map((p, i) => G.point(p) + G.text([p[0] + 0.5, p[1] - 0.35], CIRCLED[i], 'mb-label is-small')));
      const kinds = points.map((c) => kindOf([a, b, c])), at = kinds.indexOf(target);
      return C(`선분 ㄱㄴ의 두 끝 점과 한 점을 이어 ${KIND[target]}을 그리려고 한다. 이어야 할 점은?`, CIRCLED, at, {
        figure: G.board(6, 5, base, { grid: 'dots', scale: 1.4, label: '점 종이 위의 선분 ㄱㄴ과 점 넷' }),
        explain: `점 ${CIRCLED[at]}${['과', '와', '과', '와'][at]} 이으면 ${target === 'acute' ? '세 각이 모두 예각인' : '한 각이 둔각인'} 삼각형이 된다(` + points.map((_, i) => `${CIRCLED[i]} ${KIND[kinds[i]]}`).join(', ') + ').' + G.board(6, 5, [G.polygon([a, b, points[at]])].concat(base), { grid: 'dots', label: KIND[target] }),
        facts: { kindPick: { kinds: kinds.map((k, i) => (k === target ? target : 'no' + i)), target } }
      });
    }),
    T('angles-move', '꼭짓점을 옮긴 삼각형', '②56 심49', (d) => {
      // 직각삼각형의 위 꼭짓점을 옆으로 옮기면 밑변의 한 끝에 있던 직각이 예각이나 둔각으로 바뀐다.
      const flip = d.bool(), step = d.int(1, 2), inward = d.bool(), x = (v) => (flip ? 7 - v : v);
      const low = [x(2), 4], end = [x(6), 4], top = [x(2), 1], moved = [x(2 + (inward ? step : -step)), 1], order = d.shuffle(['acute', 'right', 'obtuse']), kind = kindOf([moved, low, end]);
      const way = (inward ? !flip : flip) ? '오른쪽' : '왼쪽', names = flip ? ['ㄷ', 'ㄴ'] : ['ㄴ', 'ㄷ'];
      const parts = [G.polygon([top, low, end]), G.text([top[0], top[1] - 0.55], 'ㄱ'), G.text([low[0], 4.6], names[0]), G.text([end[0], 4.6], names[1])];
      return C(`점 종이에 그린 직각삼각형 ㄱㄴㄷ에서 꼭짓점 ㄱ을 ${way}으로 ${step}칸 옮겼다. 옮긴 뒤의 삼각형은 예각삼각형, 직각삼각형, 둔각삼각형 가운데 어느 것인가?`, order.map((k) => KIND[k]), order.indexOf(kind), {
        figure: G.board(7, 5, parts, { grid: 'dots', scale: 1.3, label: `점 종이 위의 직각삼각형 ㄱㄴㄷ. 각 ㄱ${names[0]}${names[1]}이 직각이고 변 ㄴㄷ이 아래에 가로로 놓여 있다.` }),
        explain: `꼭짓점 ㄱ을 ${way}으로 옮기면 직각이던 각 ㄱ${names[0]}${names[1]}이 ${kind === 'acute' ? '직각보다 작아진다. 세 각이 모두 예각이므로 예각삼각형이다.' : '직각보다 커진다. 한 각이 둔각이므로 둔각삼각형이다.'}` + G.board(7, 5, [G.polygon([moved, low, end])], { grid: 'dots', label: '옮긴 뒤의 삼각형' }),
        facts: { kindPick: { kinds: order, target: kind } }
      });
    })
  ]);

  B.addTypes('4-1-4', 'both', [
    T('both-names', '그림 속 삼각형의 이름 모두 고르기', '①56 ②63 ③54 심50', (d) => {
      // 정삼각형 그림은 쓰지 않는다. 길이가 같은 두 변 사이의 각을 주고 나머지 두 각을 구해 종류를 정한다.
      const right = d.int(0, 3) === 0, [b, , leg] = right ? [45, 0, d.int(4, 9)] : d.pick(ISO), top = 180 - b * 2, kind = kindByAngles([b, b, top]), fit = isoFit(b), p = fit.points;
      const made = nameOptions(d, true, kind, kind === 'acute' ? '정삼각형' : '예각삼각형');
      return C('그림과 같은 삼각형의 이름이 될 수 있는 것을 모두 고른 것은?', made.options, made.answer, {
        figure: draw(fit, [G.polygon(p), sideOf(p, 0, 2, cm(leg)), sideOf(p, 1, 2, cm(leg)), corner(p, 2, right ? '' : top + '°')], `두 변의 길이가 ${leg} cm로 같은 삼각형. 길이가 같은 두 변 사이의 각은 ${right ? '직각' : top + '°'}`),
        explain: '두 변의 길이가 같으므로 이등변삼각형이다. ' + { acute: `나머지 두 각은 (180° − ${top}°) ÷ 2 = ${b}°씩이다. 세 각이 모두 예각이므로 예각삼각형이기도 하다.`, right: '길이가 같은 두 변 사이의 각이 직각이므로 직각삼각형이기도 하다.', obtuse: `${top}°인 각이 둔각이므로 둔각삼각형이기도 하다.` }[kind],
        facts: made.facts
      });
    }),
    T('both-words', '두 조건에 맞는 삼각형의 이름', '②62·69 ③53', (d) => {
      // 정삼각형도 두 변의 길이가 같으므로, 정삼각형이 될 수 없는 조건(직각·둔각)만 쓴다.
      const kind = d.pick(['right', 'obtuse']), made = nameOptions(d, true, kind, '정삼각형');
      return C('다음 두 조건에 모두 맞는 삼각형의 이름을 모두 고른 것은?', made.options, made.answer, {
        figure: conditions(d.shuffle(['두 변의 길이가 같다.', kind === 'right' ? '한 각이 직각이다.' : '한 각이 둔각이다.'])),
        explain: `두 변의 길이가 같으므로 이등변삼각형이고, 한 각이 ${kind === 'right' ? '직각이므로 직각삼각형' : '둔각이므로 둔각삼각형'}이다. 정삼각형은 세 각이 모두 60°라서 ${kind === 'right' ? '직각' : '둔각'}이 있을 수 없다.`,
        facts: made.facts
      });
    }),
    T('both-torn', '두 각만 보이는 삼각형의 이름', '①57·61 ②57·64 ③55·56 심51', (d) => {
      const [x, y] = d.pick([[40, 100], [30, 120], [35, 110], [50, 65], [70, 55], [40, 70], [35, 35], [40, 40], [45, 90], [50, 60], [30, 40], [35, 50]]), z = third(x, y), kind = kindByAngles([x, y, z]), iso = isoByAngles(x, y);
      const flip = d.bool(), [l, r] = flip ? [y, x] : [x, y], whole = place(G.triangle(l, r, 1, [0, 0]), [6.6, 5.2], [1.2, 0.9]), part = (p, q) => [p[0] + (q[0] - p[0]) * 0.6, p[1] + (q[1] - p[1]) * 0.6];
      // 위 꼭짓점 쪽을 찢어 낸다: 두 변을 중간에서 끊고 그 사이를 삐죽삐죽한 선으로 잇는다. 찢겨 나간 만큼 그림을 위로 당겨 빈자리를 없앤다.
      const lift = Math.min(part(whole.points[0], whole.points[2])[1], part(whole.points[1], whole.points[2])[1]) - 0.75, [L, R, Top] = whole.points.map(([px, py]) => [px, py - lift]), fit = { cols: whole.cols, rows: whole.rows - lift };
      const cutL = part(L, Top), cutR = part(R, Top);
      const jag = [1, 2, 3, 4, 5].map((k) => [cutR[0] + ((cutL[0] - cutR[0]) * k) / 6, cutR[1] + ((cutL[1] - cutR[1]) * k) / 6 + (k % 2 ? -0.16 : 0.16)]);
      const mark = (v) => (v === 90 ? '' : v + '°'), made = nameOptions(d, iso, kind, LURE[kind]);
      return C('삼각형 모양 종이의 한쪽이 찢어져 두 각만 보인다. 찢어지기 전의 삼각형의 이름이 될 수 있는 것을 모두 고른 것은?', made.options, made.answer, {
        figure: draw(fit, [G.polygon([L, R, cutR].concat(jag, [cutL])), wedge(L, R, Top, mark(l)), wedge(R, L, Top, mark(r))], `한쪽이 찢어진 삼각형. 보이는 두 각은 ${l === 90 ? '직각' : l + '°'}, ${r === 90 ? '직각' : r + '°'}`),
        explain: `보이지 않는 각의 크기는 180° − ${x}° − ${y}° = ${z}°이다. 세 각이 ${deg([x, y, z])}이므로 ${iso ? '두 각의 크기가 같아 이등변삼각형이고, ' : '크기가 같은 각이 없어 이등변삼각형이 아니고, '}${{ acute: '세 각이 모두 예각이라 예각삼각형이다', right: '한 각이 직각이라 직각삼각형이다', obtuse: '한 각이 둔각이라 둔각삼각형이다' }[kind]}.`,
        facts: made.facts
      });
    }),
    T('both-pick-three', '세 각의 크기를 보고 두 조건에 맞는 것 고르기', '①58 ③56', (d) => {
      const target = d.pick(['iso-obtuse', 'iso-acute']), isoOf = (t) => new Set(t).size === 2, cls = (t) => (isoOf(t) ? 'iso' : 'other') + '-' + kindByAngles(t);
      const from = (kind, iso) => d.pick(ANGLES3[kind].filter((t) => isoOf(t) === iso));
      const rows = d.shuffle([from(target.split('-')[1], true), from(target === 'iso-obtuse' ? 'acute' : 'obtuse', true), from(target.split('-')[1], false), d.bool() ? [45, 45, 90] : from('right', false)]).map((t) => d.shuffle(t));
      const at = rows.findIndex((t) => cls(t) === target), word = KIND[target.split('-')[1]];
      return C(`세 각의 크기가 다음과 같은 삼각형 가운데 이등변삼각형이면서 ${word}인 것은?`, rows.map(deg), at, {
        explain: `두 각의 크기가 같으면 이등변삼각형이다. 세 각의 크기가 ${deg(rows[at])}인 삼각형은 두 각의 크기가 같고 ${target === 'iso-obtuse' ? '한 각이 둔각이다' : '세 각이 모두 예각이다'}.`,
        facts: { kindPick: { kinds: rows.map((t, i) => (cls(t) === target ? target : 'no' + i)), target } }
      });
    }),
    T('both-find', '두 조건에 맞는 삼각형 찾기', '①59·60 ②65·66 ③57·58 심53·54', (d) => {
      // 변으로 본 종류는 적힌 길이로, 각으로 본 종류는 그림으로 가린다. 한 조건만 맞는 삼각형을 꼭 섞는다.
      const target = d.pick(['iso-obtuse', 'iso-acute', 'other-obtuse', 'other-acute']), [side, kind] = target.split('-'), flipSide = side === 'iso' ? 'other' : 'iso', flipKind = kind === 'acute' ? 'obtuse' : 'acute';
      const classes = d.shuffle([target, flipSide + '-' + kind, side + '-' + flipKind, d.pick(['other-right', flipSide + '-' + flipKind])]), picks = classes.map((name) => [d.pick(SHAPES[name]), name]);
      const at = classes.indexOf(target);
      return C(`${side === 'iso' ? '이등변삼각형이면서' : '세 변의 길이가 모두 다르면서'} ${KIND[kind]}인 것은?`, TAGS.slice(0, 4), at, {
        figure: gallery(picks.map(([s, name]) => shapeCell(s, name)), shapesTold(picks)),
        explain: picks.map(([, name], i) => `${TAGS[i]}는 ${SIDE_WORD[name.split('-')[0]]}이면서 ${KIND[name.split('-')[1]]}`).join(', ') + `이다. 두 조건에 모두 맞는 것은 ${TAGS[at]}이다.`,
        facts: { kindPick: { kinds: classes.map((name, i) => (name === target ? target : 'no' + i)), target } }
      });
    }),
    T('both-equi', '정삼각형을 각의 크기에 따라 분류하기', '②67 ③60', (d) => {
      const list = d.shuffle(['예각삼각형', '직각삼각형', '둔각삼각형']);
      return C('정삼각형을 각의 크기에 따라 분류하면 어떤 삼각형인가?', list, list.indexOf('예각삼각형'), {
        explain: '정삼각형은 세 각의 크기가 모두 60°이다. 세 각이 모두 예각이므로 예각삼각형이다.', facts: { truth: list.map((word) => word === '예각삼각형'), want: true }
      });
    }),
    T('both-square', '정사각형을 잘라 만든 삼각형의 이름', '①62 ③21', (d) => {
      const s = 3.6, o = [1, 0.8], sq = [o, [o[0], o[1] + s], [o[0] + s, o[1] + s], [o[0] + s, o[1]]], cut = d.bool() ? [sq[0], sq[2]] : [sq[1], sq[3]], made = nameOptions(d, true, 'right', '예각삼각형');
      return C('정사각형 모양의 색종이를 점선을 따라 잘라 삼각형 2개를 만들었다. 만든 삼각형 한 개의 이름이 될 수 있는 것을 모두 고른 것은?', made.options, made.answer, {
        figure: G.board(s + 2, s + 1.6, [G.polygon(sq), G.line(cut[0], cut[1], 'mb-line is-cut')], { grid: false, scale: 1.2, label: '정사각형 모양의 색종이. 마주 보는 두 꼭짓점을 이은 점선이 그어져 있다.' }),
        explain: '정사각형은 네 변의 길이가 같고 네 각이 모두 직각이다. 만든 삼각형은 두 변이 정사각형의 변이라 길이가 같으므로 이등변삼각형이고, 그 두 변 사이의 각이 직각이므로 직각삼각형이다.',
        facts: made.facts
      });
    }),
    T('both-circle', '원 안의 삼각형의 이름', '①63 심58', (d) => {
      // 60°는 쓰지 않는다(정삼각형).
      const open = d.pick([50, 70, 80, 90, 100, 110, 120]), base = (180 - open) / 2, kind = kindByAngles([open, base, base]), made = nameOptions(d, true, kind, LURE[kind]);
      return C('점 ㅇ은 원의 중심이고, 점 ㄱ과 점 ㄴ은 원 위의 점이다. 삼각형 ㅇㄱㄴ의 이름이 될 수 있는 것을 모두 고른 것은?', made.options, made.answer, {
        figure: circleTriangle(open, d.bool(), open === 90 ? '' : open + '°'),
        explain: '변 ㅇㄱ과 변 ㅇㄴ은 원의 반지름이라 길이가 같으므로 이등변삼각형이다. ' + { acute: `나머지 두 각은 (180° − ${open}°) ÷ 2 = ${base}°씩이다. 세 각이 모두 예각이므로 예각삼각형이기도 하다.`, right: '각 ㄱㅇㄴ이 직각이므로 직각삼각형이기도 하다.', obtuse: `${open}°인 각이 둔각이므로 둔각삼각형이기도 하다.` }[kind],
        facts: made.facts
      });
    }),
    T('both-move', '꼭짓점을 옮겨 두 조건에 맞추기', '③61', (d) => {
      // 밑변의 한가운데 위로 옮겨야 두 변의 길이가 같아진다. 높이가 밑변의 반보다 커서 그때 세 각이 모두 예각이다.
      const flip = d.bool(), need = d.int(1, 3), x = (v) => (flip ? 6 - v : v), low = [x(1), 4], end = [x(5), 4], top = [x(3 - need), 1];
      const spots = [1, 2, 3, 4].map((k) => [x(3 - need + k), 1]), cls = (c) => (isoLattice([c, low, end]) ? 'iso' : 'other') + '-' + kindOf([c, low, end]), names = flip ? ['ㄷ', 'ㄴ'] : ['ㄴ', 'ㄷ'];
      const parts = [G.polygon([top, low, end]), G.text([top[0], top[1] - 0.55], 'ㄱ'), G.text([low[0], 4.6], names[0]), G.text([end[0], 4.6], names[1])];
      return C(`점 종이에 그린 삼각형 ㄱㄴㄷ에서 꼭짓점 ㄱ을 ${flip ? '왼쪽' : '오른쪽'}으로 몇 칸 옮기면 이등변삼각형이면서 예각삼각형이 되는가?`, ['1칸', '2칸', '3칸', '4칸'], need - 1, {
        figure: G.board(6, 5, parts, { grid: 'dots', scale: 1.4, label: '점 종이 위의 삼각형 ㄱㄴㄷ. 변 ㄴㄷ은 아래에 가로로 4칸 길이로 놓여 있고, 꼭짓점 ㄱ은 변 ㄴㄷ보다 3칸 위에 있다.' }),
        explain: `꼭짓점 ㄱ이 변 ㄴㄷ의 한가운데 위에 오면 변 ㄱㄴ과 변 ㄱㄷ의 길이가 같아진다. ${need}칸 옮기면 되고, 이때 세 각이 모두 예각이다.` + G.board(6, 5, [G.polygon([spots[need - 1], low, end])], { grid: 'dots', label: '옮긴 뒤의 삼각형' }),
        facts: { kindPick: { kinds: spots.map((c, i) => (cls(c) === 'iso-acute' ? 'iso-acute' : 'no' + i)), target: 'iso-acute' } }
      });
    })
  ]);

  // ── 실력 ─────────────────────────────────────────────────────
  // 길이가 같은 두 변이 만나는 꼭짓점이 아래에 놓인 이등변삼각형 [ㄴ, ㄷ, ㄱ]. apex: 그 꼭짓점의 각, atLeft: 그 꼭짓점이 ㄴ(왼쪽 아래)인가
  function turnedIso(apex, atLeft) {
    const across = Math.cos(apex * RAD), up = -Math.sin(apex * RAD);
    return place([[0, 0], [1, 0], [atLeft ? across : 1 - across, up]], [5.2, 4.2], [1.5, 0.95]);
  }

  B.addGroup('4-1-4', {
    id: 'hard', title: '실력 문제', standard: SIDE,
    types: [
      H('hard-same-angles', '돌려 놓은 이등변삼각형에서 크기가 같은 두 각', '기본 ①15 ②23', (d) => {
        // 「아래에 놓인 두 각이 같다」고 여기면 길이가 같은 두 변 사이의 각을 고른다.
        const atLeft = d.bool(), apex = d.pick([40, 50, 100, 110]), fit = turnedIso(apex, atLeft), p = fit.points;
        const rows = d.shuffle(atLeft ? [['각 ㄴㄱㄷ과 각 ㄴㄷㄱ', true], ['각 ㄱㄴㄷ과 각 ㄴㄷㄱ', false], ['각 ㄱㄴㄷ과 각 ㄴㄱㄷ', false]] : [['각 ㄷㄱㄴ과 각 ㄷㄴㄱ', true], ['각 ㄱㄷㄴ과 각 ㄷㄴㄱ', false], ['각 ㄱㄷㄴ과 각 ㄷㄱㄴ', false]]);
        return C(`삼각형 ㄱㄴㄷ에서 변 ${atLeft ? 'ㄱㄴ' : 'ㄱㄷ'}과 변 ㄴㄷ의 길이가 같다. 크기가 같은 두 각은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
          figure: draw(fit, [G.polygon(p), G.vertexLabels(p, NAMES3)], `변 ${atLeft ? 'ㄱㄴ' : 'ㄱㄷ'}과 변 ㄴㄷ의 길이가 같은 삼각형 ㄱㄴㄷ. 변 ㄴㄷ이 아래에 가로로 놓여 있다.`),
          explain: `길이가 같은 두 변이 만나는 각 ${atLeft ? 'ㄱㄴㄷ' : 'ㄱㄷㄴ'}을 뺀 나머지 두 각의 크기가 같다. 삼각형이 어떻게 놓여 있어도 길이가 같은 두 변을 먼저 찾는다.`,
          facts: { truth: rows.map(([, ok]) => ok), want: true }
        });
      }),
      H('hard-angle-claims', '삼각형에 있는 예각·직각·둔각의 수에 대한 설명', '45, 기본 ②52·53 ③46·47·48', (d) => {
        const good = d.pick(['직각삼각형에는 예각이 2개 있다.', '둔각삼각형에는 예각이 2개 있다.', '정삼각형은 예각삼각형이다.']);
        const bad = d.shuffle(['둔각이 2개인 둔각삼각형도 있다.', '예각이 1개만 있어도 예각삼각형이다.', '직각이 2개인 직각삼각형도 있다.', '둔각삼각형에는 예각이 없다.', '이등변삼각형은 모두 예각삼각형이다.']).slice(0, 3);
        const rows = d.shuffle([[good, true]].concat(bad.map((text) => [text, false])));
        return C('삼각형에 대한 설명으로 옳은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
          explain: '삼각형의 세 각의 크기의 합은 180°이므로 직각이나 둔각은 한 삼각형에 1개까지만 있고, 나머지 두 각은 예각이다. 예각삼각형은 세 각이 모두 예각이어야 하며, 이등변삼각형 가운데에는 직각삼각형이나 둔각삼각형인 것도 있다.',
          facts: { truth: rows.map(([, ok]) => ok), want: true }
        });
      }, { standard: ANGLE }),
      H('hard-turned-kinds', '뒤집히거나 기울어진 삼각형 가르기', '42, 기본 ①45 ②47 ③41', (d) => {
        // 기울어진 직각삼각형을 예각삼각형으로 보는 아이, 뒤집힌 예각삼각형을 빼는 아이가 고를 보기를 넣는다.
        const two = d.shuffle(TURNED.acute).slice(0, 2), picks = d.shuffle([['acute', two[0]], ['acute', two[1]], ['right', d.pick(TURNED.right)], ['obtuse', d.pick(TURNED.obtuse)]]);
        const labels = TAGS.slice(0, 4), flags = picks.map(([, points]) => kindOf(points) === 'acute'), tagOf = (kind, n) => labels.filter((_, i) => picks[i][0] === kind)[n || 0];
        const ordered = (list) => labels.filter((tag) => list.includes(tag)), sets = d.shuffle([[tagOf('acute', 0), tagOf('acute', 1)], [tagOf('acute', 0), tagOf('acute', 1), tagOf('right')], [tagOf('acute', d.int(0, 1))], [tagOf('acute', d.int(0, 1)), tagOf('right')]].map(ordered));
        const right = labels.filter((_, i) => flags[i]);
        return C('모눈종이에 그린 삼각형 가운데 예각삼각형을 모두 고른 것은?', sets.map((s) => s.join(', ')), sets.findIndex((s) => s.join() === right.join()), {
          figure: G.tiles(picks.map(([, points], i) => [labels[i], gridTile(points, 4)])),
          explain: picks.map(([kind], i) => `${labels[i]}는 ${KIND[kind]}`).join(', ') + '이다. 삼각형이 뒤집히거나 기울어져 있어도 세 각을 하나씩 직각과 비교하여 가린다.',
          facts: { sets: { labels, flags, options: sets } }
        });
      }, { standard: ANGLE }),
      H('hard-relations', '삼각형 사이의 관계', '4, 기본 ②1·38·70 ③60', (d) => {
        const rows = d.shuffle([['정삼각형은 두 변의 길이가 같으므로 이등변삼각형이라고 할 수 있다.', true], ['이등변삼각형은 세 변의 길이가 같으므로 정삼각형이라고 할 수 있다.', false], ['이등변삼각형은 모두 예각삼각형이다.', false], ['정삼각형 가운데에는 직각삼각형인 것도 있다.', false]]);
        return C('삼각형 사이의 관계를 바르게 설명한 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
          explain: '정삼각형은 세 변의 길이가 같으므로 두 변의 길이도 같다. 그래서 이등변삼각형이라고 할 수 있다. 거꾸로 이등변삼각형은 두 변의 길이만 같아도 되므로 모두 정삼각형인 것은 아니다. 정삼각형은 세 각이 모두 60°인 예각삼각형이다.',
          facts: { truth: rows.map(([, ok]) => ok), want: true }
        });
      }),
      H('hard-cannot', '그릴 수 없는 삼각형', '56', (d) => {
        const rows = d.shuffle([[`정삼각형이면서 ${d.pick(['둔각삼각형', '직각삼각형'])}인 삼각형`, false], ['이등변삼각형이면서 직각삼각형인 삼각형', true], ['이등변삼각형이면서 둔각삼각형인 삼각형', true], ['세 변의 길이가 모두 다르면서 예각삼각형인 삼각형', true]]);
        return C('그릴 수 없는 삼각형은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
          explain: '정삼각형은 세 각의 크기가 모두 60°이므로 언제나 예각삼각형이다. 직각이나 둔각이 있는 정삼각형은 그릴 수 없다. 이등변삼각형은 세 각이 45°, 45°, 90°이거나 30°, 30°, 120°인 것처럼 직각삼각형·둔각삼각형일 수 있다.',
          facts: { truth: rows.map(([, ok]) => ok), want: false }
        });
      }, { standard: ANGLE }),
      H('hard-acute-count', '세 삼각형에 있는 예각의 수', '46', () => N('예각삼각형, 직각삼각형, 둔각삼각형을 한 개씩 그렸다. 세 삼각형에 있는 예각은 모두 몇 개인가?', 7, {
        unit: '개', explain: '예각삼각형에는 예각이 3개, 직각삼각형에는 2개, 둔각삼각형에는 2개 있다. 3 + 2 + 2 = 7', facts: { calc: [['3+2+2', 0]], unseen: [3, 2] }
      }), { standard: ANGLE }),
      H('hard-iso-cases', '한 각만 아는 이등변삼각형의 나머지 두 각', '기본 ①21', (d) => {
        // 아는 각이 길이가 같은 두 변 사이의 각일 수도 있고, 크기가 같은 두 각 가운데 하나일 수도 있다.
        const x = d.pick([20, 30, 40, 50, 70, 80]), p = (180 - x) / 2, pairs = d.shuffle([[p, p], [x, 180 - x * 2], [x, x]]);
        const flags = pairs.map(([u, v]) => u + v + x === 180 && (u === v || u === x || v === x)), made = setOptions(d, LABELS.slice(0, 3), flags);
        return C(`한 각의 크기가 ${x}°인 이등변삼각형이 있다. 나머지 두 각의 크기가 될 수 있는 것을 모두 고른 것은?`, made.options, made.answer, {
          figure: tagged(pairs.map(deg)),
          explain: `${x}°인 각이 길이가 같은 두 변 사이의 각이면 나머지 두 각은 (180° − ${x}°) ÷ 2 = ${p}°씩이다. ${x}°인 각이 크기가 같은 두 각 가운데 하나이면 나머지 두 각은 ${x}°와 180° − ${x}° − ${x}° = ${180 - x * 2}°이다.`,
          facts: { sets: { labels: LABELS.slice(0, 3), flags, options: made.sets } }
        });
      }),
      H('hard-iso-acute', '예각삼각형인 이등변삼각형의 가장 큰 각', '57', (d) => {
        const x = d.pick([20, 30, 40]);
        return N(`세 각이 모두 예각인 이등변삼각형이 있다. 한 각의 크기가 ${x}°일 때, 이 삼각형에서 가장 큰 각의 크기는 몇 도인가?`, (180 - x) / 2, {
          unit: '°', explain: `${x}°인 각이 크기가 같은 두 각 가운데 하나이면 나머지 한 각이 180° − ${x}° − ${x}° = ${180 - x * 2}°로 둔각이 되어 예각삼각형이 아니다. 그러므로 나머지 두 각의 크기가 같고, (180° − ${x}°) ÷ 2 = ${(180 - x) / 2}°이다.`,
          facts: { calc: [[`(180-${x})/2`, 0]], unseen: [180, 2] }
        });
      }),
      H('hard-pick-pair', '두 각의 크기를 보고 두 조건에 맞는 것 고르기', '52, 기본 ①58 ③56', (d) => {
        // 나머지 한 각을 구해야 두 조건을 따질 수 있다. 45°, 45°는 이등변삼각형이지만 직각삼각형이다.
        const cls = ([x, y]) => (isoByAngles(x, y) ? 'iso' : 'other') + '-' + kindByAngles([x, y, third(x, y)]);
        const b = d.pick([50, 55, 65, 70, 75, 80]), rows = d.shuffle([[b, 180 - b * 2], d.pick([[45, 45], [45, 90], [30, 30], [35, 35], [40, 100], [25, 130]]), d.pick([[40, 60], [55, 45], [35, 70], [65, 45]]), d.pick([[20, 40], [30, 50], [25, 65], [35, 40]])]).map((t) => d.shuffle(t));
        const at = rows.findIndex((t) => cls(t) === 'iso-acute');
        return C('두 각의 크기가 다음과 같은 삼각형 가운데 이등변삼각형이면서 예각삼각형인 것은?', rows.map(deg), at, {
          explain: '나머지 한 각의 크기를 구하여 따진다. ' + rows.map((t) => `(${deg(t)}) → ${third(t[0], t[1])}°`).join(', ') + `. 두 각의 크기가 같고 세 각이 모두 예각인 것은 두 각이 ${deg(rows[at])}인 삼각형이다.`,
          facts: { kindPick: { kinds: rows.map((t, i) => (cls(t) === 'iso-acute' ? 'iso-acute' : 'no' + i)), target: 'iso-acute' } }
        });
      }, { standard: ANGLE }),
      H('hard-both-talk', '분류한 말이 옳은지 가리기', '55', (d) => {
        // 말마다 삼각형 둘을 변으로 한 번, 각으로 한 번 확인해야 한다.
        const classes = d.shuffle(['iso-acute', 'iso-obtuse', 'other-obtuse', 'other-acute']), picks = classes.map((name) => [d.pick(SHAPES[name]), name]), tag = (name) => TAGS[classes.indexOf(name)];
        const has = (name, word) => (word === '이등변삼각형' ? name.startsWith('iso') : KIND[name.split('-')[1]] === word);
        const said = (x, y, word) => { const [p, q] = [tag(x), tag(y)].sort(); return [`${p}와 ${q}는 ${word}이다.`, has(x, word) && has(y, word)]; };
        const good = d.pick([said('iso-acute', 'iso-obtuse', '이등변삼각형'), said('iso-obtuse', 'other-obtuse', '둔각삼각형'), said('iso-acute', 'other-acute', '예각삼각형')]);
        const bad = d.shuffle([said('iso-acute', 'iso-obtuse', '예각삼각형'), said('iso-acute', 'iso-obtuse', '둔각삼각형'), said('iso-obtuse', 'other-obtuse', '이등변삼각형'), said('iso-acute', 'other-acute', '이등변삼각형'), said('other-obtuse', 'other-acute', '둔각삼각형'), said('other-obtuse', 'other-acute', '예각삼각형')]).slice(0, 3);
        const rows = d.shuffle([good].concat(bad));
        return C('삼각형을 보고 바르게 말한 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
          figure: gallery(picks.map(([s, name]) => shapeCell(s, name)), shapesTold(picks)),
          explain: picks.map(([, name], i) => `${TAGS[i]}는 ${name.startsWith('iso') ? '이등변삼각형이면서 ' : ''}${KIND[name.split('-')[1]]}`).join(', ') + '이다. 두 삼각형을 변의 길이와 각의 크기로 하나씩 확인한다.',
          facts: { truth: rows.map(([, ok]) => ok), want: true }
        });
      }, { standard: ANGLE })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
