// 4학년 2학기 4단원 다각형 — 단원 틀과 기본 문항(다각형 알아보기, 다각형의 이름, 정다각형, 대각선).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 86·81·73꼴, 심화꼴 71꼴)을 번호마다 따져,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 보고 실었다.
// (사각형의 대각선, 모양 만들기, 모양 채우기의 기본 문항과 실력 문항은 4-2-4b.js에 있다. 대조표는 수집본의 _분석/4-2-4/싣기_대조표.md)
//
// 싣는 기준
//  - 주는 것(글·그림의 얼개), 묻는 것, 푸는 길이 다르면 다른 문제다. 수만 다르거나 상황만 다른 것은 한 번만 싣는다
//    (도형마다 ○× 하기·두 칸으로 나누기는 「모두 고르기」와, 표지판·벌집 모양의 이름은 「그림 속 다각형의 이름」과 같은 판단이다).
//  - 정다각형은 꼭짓점을 셈하여 그린다(변의 길이와 각의 크기가 정말로 같다). 정다각형이 아닌 도형은 눈으로 보아도 뚜렷이 다르게 그린다
//    (마름모는 두 대각선이 가로·세로로 놓인 길쭉한 모양으로, 직사각형은 긴 변이 짧은 변의 두 배가 되게 그린다). 길이와 각도를 적는 그림은 적힌 수대로 그린다.
//  - 대각선의 수는 삼각형(0개)부터 육각형(9개)까지만 묻는다. 그림에서 그어 세어 확인할 수 있는 범위이다.
//  - 정다각형의 각은 「각의 크기가 모두 같다」만 쓰는 것을 싣는다(다른 각의 크기, 한 각 × 각의 수, 직선 위의 각 180°). 한 각의 크기는 언제나 그림이나 글로 준다.
//
// 뺀 것과 까닭
//  - 정다각형의 모든 변의 길이의 합(①35~40 ②33~38 ③28~34 심20~25, 심41·43의 변형): 둘레는 5학년 「다각형의 둘레와 넓이」이다.
//    합에서 한 변·변의 수를 거꾸로 구하는 것, 철사·끈·울타리, 이어 붙인 모양의 굵은 선도 같은 갈래다. 한 변의 길이를 주고 다른 변의 길이를 묻는 것만 실었다.
//  - 다각형의 각의 크기의 합을 구하기, 각의 합에서 한 각 구하기, 삼각형으로 나누어 한 각 구하기(②30·32 ③27 심26·28·32, 심27의 「합 → 한 각」): 중학교 「다각형의 성질」이다.
//  - 대각선의 수의 규칙·공식, 칠각형이 넘는 다각형의 대각선의 수(①53의 칠각형, ①48·②46의 칠각형·팔각형, ②50의 변형, 심35의 칠각형, 심36): 중학교 내용이다.
//  - 그리기·완성하기·긋기(①34·47 ②14·27·43 ③35 심19·34, ①18 ②13 ③15 심10은 「선분을 몇 개 더 그어야 하는가」로 바꾸어 실었다),
//    까닭·공통점·알게 된 점 쓰기(①20 ③40 심11, 다각형·정다각형이 아닌 까닭 쓰기는 까닭 고르기로 바꾸어 실었다)
//  - 크고 작은 다각형 세기(①19·57 ③25), 대각선 하나로 생기는 사각형의 수에서 다각형을 거꾸로 찾기(①56 심44), 대각선을 따라 자르는 방법 찾기(③49): 경우 따지기
//  - 뜻 없는 셈: 변의 수와 꼭짓점의 수 더하기(①16의 변형 ②11 심7의 합), 변·꼭짓점·대각선의 수 더하기(③47), 빈칸의 수끼리 더하기(심17)
//  - 변의 수가 늘어나면 가까워지는 모양(③14): 도형판 활동 뒤의 관찰이고 정다각형일 때만 맞는 말이다.
//  - 정삼각형을 이어 그릴 꼭짓점(②28)·둘로 나눈 삼각형이 정삼각형인지(①32): 뽑은 글에 그림이 없어 얼개를 알 수 없다.
//  - 정오각형의 대각선의 길이(심46): 정오각형의 대각선의 길이가 모두 같다는 것은 배우지 않는다.
//  - 표지판·축구공·벌집 같은 물건 그림에서 다각형·정다각형 찾기(①17·33 ③12·24, 심18의 일부): 물건 그림을 그릴 도구가 없어 미루었다.
//    변의 수를 세어 이름을 정하는 판단은 「그림 속 다각형의 이름」이, 무늬 속 정다각형은 「모양을 만드는 데 쓴 정다각형」(4-2-4b.js)이 묻는다.
// 각도는 수에 붙여 적고(108°) 길이는 띄어 적는다(7 cm). 묻는 말: 값을 물으면 "~은?", 양을 물으면 "몇 개인가?/몇 도인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, josa, tagged, N, M, C } = B.kit;
  const G = B.kit.geo;
  const POLY = '4수03-11', MAKE = '4수03-12';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바'];
  const NAMES = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ'];
  const RAD = Math.PI / 180;
  const NAME = { 3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형', 7: '칠각형', 8: '팔각형', 9: '구각형', 10: '십각형', 11: '십일각형', 12: '십이각형', 13: '십삼각형' };
  // 정다각형의 한 각의 크기(도). 문제에서는 언제나 그림이나 글로 준다.
  const ANGLE = { 3: 60, 4: 90, 5: 108, 6: 120, 8: 135, 9: 140, 10: 144, 12: 150 };
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';
  // n각형에 그을 수 있는 대각선의 수: 꼭짓점마다 (n − 3)개씩 그으면 대각선마다 두 번 센다.
  const diagonals = (n) => (n * (n - 3)) / 2;
  const diagExpr = (n) => `${n}*(${n}-3)/2`;

  // ── 그림 ─────────────────────────────────────────────────────
  const mid = (p, q, t) => [p[0] + (q[0] - p[0]) * (t == null ? 0.5 : t), p[1] + (q[1] - p[1]) * (t == null ? 0.5 : t)];
  const centre = (points) => [points.reduce((s, p) => s + p[0], 0) / points.length, points.reduce((s, p) => s + p[1], 0) / points.length];
  // 판 안에 맞추기: 가로 box[0], 세로 box[1] 칸을 넘지 않게 키우고 둘레에 여백 pad 를 둔다.
  function place(raw, box, pad) {
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
    const k = Math.min(box[0] / w, box[1] / h);
    return { points: raw.map(([x, y]) => [(x - x0) * k + pad[0], (y - y0) * k + pad[1]]), cols: w * k + pad[0] * 2, rows: h * k + pad[1] * 2 };
  }
  // 그림 하나를 휴대폰 카드 너비(300px)를 넘지 않게 그린다. label 에는 그림 속 길이·각도를 글로 적는다.
  const draw = (fit, parts, label, scale) => G.board(fit.cols, fit.rows, parts, { grid: false, scale: Math.min(scale || 1.15, 296 / (32 + fit.cols * 22)), label });
  // 선 위에 적는 글: 밑에 깔린 선이 비치지 않게 둘레를 바탕색으로 두른다.
  const halo = (svg) => svg.replace('<text ', '<text style="paint-order:stroke;stroke:#fff8e1;stroke-width:4px;stroke-linejoin:round" ');
  // 정다각형의 꼭짓점(반지름 1). 아래 변이 가로로 놓이고, 첫 꼭짓점은 맨 위(짝수 각형은 왼쪽 위)이며 시계 반대쪽으로 돈다.
  const regular = (n) => Array.from({ length: n }, (_, i) => G.toward([0, 0], 1, (n % 2 ? 90 : 90 + 180 / n) + (i * 360) / n));
  // 변 p–q 를 한 변으로 하는 정n각형. 꼭짓점은 p, q 부터 차례로 돈다. left 에 따라 변의 이쪽이나 저쪽에 놓인다.
  function onSide(p, q, n, left) {
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]), apothem = len / (2 * Math.tan(Math.PI / n)), m = mid(p, q), way = left ? 1 : -1;
    const c = [m[0] - ((q[1] - p[1]) / len) * apothem * way, m[1] + ((q[0] - p[0]) / len) * apothem * way], r = Math.hypot(p[0] - c[0], p[1] - c[1]);
    const a0 = Math.atan2(p[1] - c[1], p[0] - c[0]);
    let step = Math.atan2(q[1] - c[1], q[0] - c[0]) - a0;
    while (step > Math.PI) step -= Math.PI * 2;
    while (step < -Math.PI) step += Math.PI * 2;
    return Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos(a0 + step * k), c[1] + r * Math.sin(a0 + step * k)]);
  }
  // 꼭짓점 v 에서 p 쪽과 q 쪽으로 벌어진 각에 호(직각이면 직각 표시)와 글을 넣는다. 좁은 각은 글이 두 변에 닿지 않게 멀리 적는다.
  function wedge(v, p, q, label, r) {
    const a = G.bearing(v, p), b = G.bearing(v, q);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    const open = to - from, way = (from + to) / 2, right = Math.abs(open - 90) < 0.01, half = Math.max(String(label || '').length * 0.17 + 0.12, 0.38);
    // 글이 호에 닿지 않게: 글은 눕혀 적으므로 옆으로 뻗은 각일수록 꼭짓점에서 멀리 적는다.
    const reach = half * Math.abs(Math.cos(way * RAD)) + 0.3 * Math.abs(Math.sin(way * RAD)), near = (r || 0.6) + 0.14 + reach;
    const far = Math.min(Math.max(near, half / Math.tan((open / 2) * RAD)), 3), size = far > near + 0.01 ? Math.max(r || 0.6, far - reach - 0.14) : (r || 0.6);
    return (right ? G.squareMark(v, from, to) : G.arc(v, from, to, size)) + (label ? G.text(G.toward(v, right ? 1.05 : far, way), label, 'mb-label is-length') : '');
  }
  // 다각형의 꼭짓점 i 안쪽에 각 표시와 글을 넣는다.
  const corner = (points, i, label, r) => wedge(points[i], points[(i + points.length - 1) % points.length], points[(i + 1) % points.length], label, r);
  // 변 p–q 의 바깥쪽(점 away 의 반대쪽)에 글을 적는다.
  function sideText(p, q, away, value) {
    const m = mid(p, q), len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let n = [-(q[1] - p[1]) / len, (q[0] - p[0]) / len];
    if ((away[0] - m[0]) * n[0] + (away[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const off = 0.42 + Math.abs(n[0]) * String(value).length * 0.15;
    return G.text([m[0] + n[0] * off, m[1] + n[1] * off], value, 'mb-label is-length');
  }
  // 다각형의 변 i(꼭짓점 i 와 i + 1 사이) 바깥쪽에 글을 적는다.
  const sideOf = (points, i, value) => sideText(points[i], points[(i + 1) % points.length], centre(points), value);
  const cm = (v) => v + ' cm';
  // 굽은 선은 촘촘한 점으로 그린다.
  const arcPoints = (c, r, from, to) => { const out = []; for (let a = from; a <= to + 0.001; a += 6) out.push(G.toward(c, r, a)); return out; };
  const bend = (p, ctrl, q) => Array.from({ length: 15 }, (_, i) => { const t = i / 14, u = 1 - t; return [u * u * p[0] + 2 * u * t * ctrl[0] + t * t * q[0], u * u * p[1] + 2 * u * t * ctrl[1] + t * t * q[1]]; });
  // 도형 여럿을 칸마다 하나씩 그리고 가, 나, 다 … 를 붙인다. items: [{ points, open(열린 도형), extra(자리 잡은 점들) → 덧그릴 것 }]
  function gallery(items, o) {
    const opt = o || {}, per = opt.per || (items.length > 4 ? 3 : 2), W = opt.W || (per === 3 ? 4 : 5.6), Ht = opt.H || (per === 3 ? 3.5 : 3.9), box = opt.box || (per === 3 ? [2.7, 2.2] : [3.4, 2.5]), parts = [];
    items.forEach((item, i) => {
      const ox = (i % per) * W, oy = Math.floor(i / per) * Ht, fit = place(item.points, box, [0, 0]);
      const dx = ox + (W - fit.cols) / 2 + 0.2, dy = oy + 0.7 + (Ht - 0.9 - fit.rows) / 2, pts = fit.points.map(([x, y]) => [x + dx, y + dy]);
      parts.push(item.open ? G.polyline(pts) : G.polygon(pts), G.text([ox + 0.35, oy + 0.42], (opt.tags || TAGS)[i]));
      if (item.extra) parts.push(item.extra(pts));
    });
    return G.board(per * W - 0.2, Math.ceil(items.length / per) * Ht - 0.1, parts, { grid: false, scale: opt.scale || 1, label: opt.label });
  }
  const told = (items) => `도형 ${items.length}개. ` + items.map((item, i) => `${TAGS[i]}: ${item.said}`).join(' / ');

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
  const listed = (labels, flags) => labels.filter((_, i) => flags[i]).join(', ');

  // ── 도형 감 ──────────────────────────────────────────────────
  // 변의 수에 따라 모은 다각형(가로 4칸, 세로 3칸 안). 이웃한 두 변이 곧게 이어져 보이는 곳이 없게 골랐다. 오목한 것도 섞여 있다.
  const POLYS = {
    3: [[[0, 3], [4, 3], [1, 0]], [[0, 0], [4, 1], [1.5, 3]], [[0, 3], [2, 0], [4, 3]]],
    4: [[[0, 0.4], [3.6, 0], [4, 2.6], [0.6, 3]], [[1, 0], [4, 0.8], [3, 3], [0, 2]], [[0, 0], [2, 1], [4, 0], [2, 3]], [[0.8, 0], [3.2, 0], [4, 3], [0, 3]]],
    5: [[[0, 1.2], [2, 0], [4, 1.2], [4, 3], [0, 3]], [[0.6, 0], [3.4, 0.3], [4, 2], [2, 3], [0, 1.8]], [[0, 0], [4, 0], [4, 3], [2, 1.4], [0, 3]], [[1, 0], [3, 0], [4, 1.6], [2, 3], [0, 1.6]]],
    6: [[[0, 0], [2, 0], [2, 1.5], [4, 1.5], [4, 3], [0, 3]], [[1, 0], [3, 0], [4, 1.5], [3, 3], [1, 3], [0, 1.5]], [[0, 0.6], [2, 0], [4, 1], [3.6, 3], [1.4, 3], [0, 2]]],
    7: [[[0, 1], [1.5, 0], [3, 0], [4, 1.5], [3.2, 3], [1, 3], [0, 2.2]], [[0, 1], [2.4, 1], [2.4, 0], [4, 1.5], [2.4, 3], [2.4, 2], [0, 2]], [[0, 0], [4, 0], [4, 3], [2.8, 3], [2, 1.6], [1.2, 3], [0, 3]]],
    8: [[[1, 0], [3, 0], [4, 1], [4, 2], [3, 3], [1, 3], [0, 2], [0, 1]], [[0, 0], [4, 0], [4, 1], [2.7, 1], [2.7, 3], [1.3, 3], [1.3, 1], [0, 1]], [[0, 1.2], [1.2, 0], [2.8, 0], [4, 1.2], [4, 2], [2.6, 3], [1.4, 3], [0, 2]]]
  };
  const mirror = (points) => points.map(([x, y]) => [4 - x, y]);
  const polyItem = (points) => ({ points, kind: 'poly', n: points.length, said: `선분 ${points.length}개로 둘러싸인 도형` });
  const anyPoly = (d, n) => polyItem(d.bool() ? mirror(d.pick(POLYS[n])) : d.pick(POLYS[n]));
  // 굽은 선이 있는 도형(다각형이 아니다). mixed: 선분과 굽은 선이 섞여 있다.
  const CURVED = [
    { points: () => arcPoints([0, 0], 1.5, 0, 354), said: '원' },
    { points: () => arcPoints([0, 0], 1.5, 0, 354).map(([x, y]) => [x * 1.4, y * 0.85]), said: '굽은 선으로 둘러싸인 길쭉한 도형' },
    { points: () => arcPoints([0, 0], 1.9, 0, 180), said: '선분 1개와 굽은 선으로 둘러싸인 도형', mixed: true },
    { points: () => [[0, 0]].concat(arcPoints([0, 0], 2.6, 0, 90)), said: '선분 2개와 굽은 선으로 둘러싸인 도형', mixed: true },
    { points: () => [[0, 3], [3, 3]].concat(arcPoints([1.5, 1.5], 1.5, 0, 180)), said: '선분 3개와 굽은 선으로 둘러싸인 도형', mixed: true },
    { points: () => [[0, 3]].concat(bend([4, 3], [4.4, 0.4], [1.8, 0])), said: '선분 2개와 굽은 선으로 둘러싸인 도형', mixed: true },
    { points: () => bend([0, 0], [2, 2.4], [4, 0]).concat([[4, 3], [0, 3]]), said: '선분 3개와 굽은 선으로 둘러싸인 도형', mixed: true }
  ];
  const curvedOf = (c) => ({ points: c.points(), kind: 'curved', said: c.said, mixed: Boolean(c.mixed) });
  const curvedItem = (d, mixedOnly) => curvedOf(d.pick(CURVED.filter((s) => !mixedOnly || s.mixed)));
  // 선분으로만 이루어져 있지만 둘러싸여 있지 않은 도형(다각형이 아니다)
  const OPENS = [[[1.2, 0], [0, 0], [0, 2.6], [3.6, 2.6], [3.6, 0], [2.4, 0]], [[0, 3], [0, 1.2], [2, 0], [4, 1.2], [4, 3]], [[2, 3], [0, 3], [1.8, 0], [4, 3], [3.4, 3]], [[0, 0], [4, 0], [0, 3], [4, 3]], [[1, 0], [3, 0], [4, 1.5], [3, 3], [1, 3], [0, 1.5]]];
  const openOf = (points) => ({ points, open: true, kind: 'open', said: '선분으로 이루어져 있지만 열려 있는 도형' });
  const openItem = (d) => openOf(d.pick(OPENS));
  // 정다각형과, 정다각형으로 잘못 보기 쉬운 도형
  const REGULAR_SAID = { 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형', 8: '정팔각형' };
  const regularItem = (n) => ({ points: regular(n), kind: 'regular', n, said: REGULAR_SAID[n] });
  const rhombusOf = (deg) => [[0, 0], [1, 0], [1 + Math.cos(deg * RAD), -Math.sin(deg * RAD)], [Math.cos(deg * RAD), -Math.sin(deg * RAD)]];
  // 마름모는 두 대각선이 가로·세로로 놓이게 그린다(비스듬히 눕힌 마름모는 평행사변형과 눈으로 가릴 수 없다).
  const rhombusItem = (d) => ({ points: d.pick([[[1.6, 0], [3.2, 1], [1.6, 2], [0, 1]], [[1, 0], [2, 1.6], [1, 3.2], [0, 1.6]], [[1.7, 0], [3.4, 0.9], [1.7, 1.8], [0, 0.9]]]), kind: 'rhombus', n: 4, said: '네 변의 길이는 같지만 네 각의 크기가 같지는 않은 사각형(마름모)' });
  const rectItem = (d) => ({ points: d.pick([[[0, 0], [3.4, 0], [3.4, 1.7], [0, 1.7]], [[0, 0], [1.5, 0], [1.5, 3], [0, 3]]]), kind: 'rect', n: 4, said: '네 각의 크기는 같지만 네 변의 길이가 같지는 않은 사각형(직사각형)' });
  // 변의 길이도 각의 크기도 같지 않은 다각형
  const PLAIN = [
    { points: [[0, 0], [0, 2.4], [3.4, 2.4]], said: '세 변의 길이가 모두 다른 직각삼각형' },
    { points: [[1, 0], [4, 0], [3, 1.8], [0, 1.8]], said: '이웃한 두 변의 길이가 다른 평행사변형' },
    { points: [[1.2, 0], [2.4, 0], [3.8, 1.9], [0, 1.9]], said: '사다리꼴' },
    { points: [[0, 1.1], [1.5, 0], [3, 1.1], [3, 2.9], [0, 2.9]], said: '변의 길이도 각의 크기도 같지 않은 오각형' },
    { points: [[0.5, 3], [1.9, 3], [1.2, 0]], said: '두 변만 길이가 같은 이등변삼각형' }
  ];
  const plainItems = (d, count) => d.shuffle(PLAIN).slice(0, count).map((s) => ({ points: s.points, kind: 'plain', n: s.points.length, said: s.said }));
  // 이름표를 붙여 그리는 볼록한 다각형. 꼭짓점은 ㄱ부터 시계 반대쪽으로 돈다.
  const CONVEX = {
    4: [[[0.5, 0.2], [0, 2.9], [3.9, 3.1], [3.3, 0]], [[0.9, 0], [0, 2.6], [4.2, 2.6], [2.9, 0.3]]],
    5: [[[2.1, 0], [0, 1.6], [0.9, 3.6], [3.5, 3.6], [4.3, 1.5]], [[1.6, 0], [0, 1.9], [1.3, 3.7], [3.8, 3.3], [4.1, 0.9]]],
    6: [[[1.3, 0], [0, 1.7], [1.1, 3.5], [3.3, 3.6], [4.5, 1.9], [3.4, 0.1]], [[1.5, 0], [0, 1.2], [0.4, 3.1], [2.6, 3.8], [4.4, 2.6], [3.9, 0.5]]]
  };
  // 이름표가 붙은 다각형 그림. more(자리 잡은 점들)로 선분 따위를 덧그린다.
  function namedFig(raw, o) {
    const opt = o || {}, fit = place(raw, opt.box || [4.4, 3.7], [1.05, 0.95]), p = fit.points;
    return draw(fit, [G.polygon(p)].concat(opt.more ? opt.more(p) : [], opt.names === false ? [] : [G.vertexLabels(p, NAMES)]), opt.label, opt.scale);
  }
  const adjacent = (n, i, j) => Math.abs(i - j) === 1 || Math.abs(i - j) === n - 1;
  const allDiagonals = (p) => { const out = []; for (let i = 0; i < p.length; i += 1) for (let j = i + 2; j < p.length; j += 1) if (!adjacent(p.length, i, j)) out.push(G.line(p[i], p[j], 'mb-line is-thin')); return out; };
  // 다각형 안에 긋는 선분의 끝: 꼭짓점 번호(수)이거나 변 위의 점([꼭짓점, 다음 꼭짓점, 몫])
  const endOf = (p, e) => (typeof e === 'number' ? p[e] : mid(p[e[0]], p[e[1]], e[2]));
  const isDiagonal = (n, [a, b]) => typeof a === 'number' && typeof b === 'number' && a !== b && !adjacent(n, a, b);
  // 선분 위에 기호를 적을 자리: 다른 선분·다른 기호에서 가장 멀리 떨어진 곳을 고른다.
  function markSpots(segs) {
    const spots = [];
    const gap = (p, a, b) => { const ab = G.sub(b, a), t = Math.max(0, Math.min(1, G.dot(G.sub(p, a), ab) / G.len2(ab))); return Math.hypot(p[0] - a[0] - ab[0] * t, p[1] - a[1] - ab[1] * t); };
    segs.forEach(([a, b], i) => {
      let best = null;
      for (const t of [0.5, 0.4, 0.6, 0.3, 0.7, 0.25, 0.75]) {
        const p = mid(a, b, t), clear = Math.min(...segs.map(([c, e], j) => (j === i ? 9 : gap(p, c, e))), ...spots.map((s) => Math.hypot(s[0] - p[0], s[1] - p[1]) / 1.5));
        if (!best || clear > best.clear + 0.05) best = { p, clear };
      }
      spots.push(best.p);
    });
    return spots;
  }
  // 한 변의 길이와 한 각의 크기를 적은 정다각형. sides·angles: [[자리, 글], …]
  function regularFig(n, o) {
    const fit = place(regular(n), [o.box || 4.5, o.box || 4.5], [1.6, 1]), p = fit.points, parts = [G.polygon(p)];
    (o.sides || []).forEach(([i, value]) => parts.push(sideOf(p, i, value)));
    (o.angles || []).forEach(([i, value]) => parts.push(corner(p, i, value)));
    return draw(fit, parts, o.label);
  }

  B.addUnit({
    id: '4-2-4', grade: 4, semester: 2, no: 4, title: '다각형', version: 1,
    groups: [
      {
        id: 'poly', title: '다각형 알아보기', standard: POLY,
        types: [
          T('poly-word', '다각형의 뜻', '①1 ②1 ③1 심3', (d) => {
            if (d.bool()) {
              const list = d.shuffle(['다각형', '정다각형', '대각선', '원']);
              return C('선분으로만 둘러싸인 도형을 무엇이라고 하는가?', list, list.indexOf('다각형'), { explain: '선분으로만 둘러싸인 도형을 다각형이라고 한다.', facts: { truth: list.map((word) => word === '다각형'), want: true } });
            }
            const list = d.shuffle(['선분', '굽은 선', '반직선', '직선']);
            return C('다각형은 무엇으로만 둘러싸인 도형인가?', list, list.indexOf('선분'), { explain: '다각형은 선분으로만 둘러싸인 도형이다. 굽은 선이 있거나 선분으로 둘러싸여 있지 않으면 다각형이 아니다.', facts: { truth: list.map((word) => word === '선분'), want: true } });
          }),
          T('poly-find', '도형 여럿 가운데 다각형 고르기', '①2·3·4 ②2·3 ③2·3 심1', (d) => {
            // 굽은 선이 있는 도형과 열린 도형을 꼭 하나씩 섞는다.
            const ns = d.shuffle([3, 4, 5, 6, 7, 8]).slice(0, 3), twoCurved = d.bool();
            const items = d.shuffle(ns.map((n) => anyPoly(d, n)).concat(d.shuffle(CURVED).slice(0, twoCurved ? 2 : 1).map(curvedOf), d.shuffle(OPENS).slice(0, twoCurved ? 1 : 2).map(openOf)));
            const flags = items.map((item) => item.kind === 'poly'), made = setOptions(d, TAGS, flags);
            const curved = listed(TAGS, items.map((item) => item.kind === 'curved')), open = listed(TAGS, items.map((item) => item.kind === 'open'));
            return C('다각형을 모두 고른 것은?', made.options, made.answer, {
              figure: gallery(items, { label: told(items) }),
              explain: `선분으로만 둘러싸인 도형이 다각형이다. ${curved}는 굽은 선이 있고, ${open}는 선분으로 둘러싸여 있지 않고 열려 있어서 다각형이 아니다.`,
              facts: { sets: { labels: TAGS, flags, options: made.sets } }
            });
          }),
          T('poly-open', '선분으로만 이루어졌지만 다각형이 아닌 도형', '①5 ③3', (d) => {
            const ns = d.shuffle([3, 4, 5, 6]).slice(0, 2), items = d.shuffle(ns.map((n) => anyPoly(d, n)).concat([curvedItem(d, true), openItem(d)])), at = items.findIndex((item) => item.kind === 'open');
            return C('선분으로만 이루어져 있지만 다각형이 아닌 도형은?', TAGS.slice(0, 4), at, {
              figure: gallery(items, { label: told(items) }),
              explain: `${TAGS[at]}는 선분으로만 이루어져 있지만 둘러싸여 있지 않고 열려 있어서 다각형이 아니다. ${TAGS[items.findIndex((item) => item.kind === 'curved')]}는 굽은 선이 있어서 다각형이 아니다.`,
              facts: { kindPick: { kinds: items.map((item, i) => (item.kind === 'open' ? 'open' : item.kind + i)), target: 'open' } }
            });
          }),
          T('poly-why', '다각형이 아닌 까닭', '①6 ②4 ③4 심2', (d) => {
            // 까닭 쓰기를 까닭 고르기로 바꾸었다. 굽은 선이 있는 도형은 닫혀 있고, 열린 도형은 선분으로만 이루어져 있다(까닭이 하나뿐이다).
            const item = d.bool() ? curvedItem(d, true) : openItem(d), fit = place(item.points, [4.6, 3.2], [0.7, 0.6]);
            const rows = d.shuffle([['굽은 선이 있다.', item.kind === 'curved'], ['선분으로 둘러싸여 있지 않고 열려 있다.', item.kind === 'open'], ['변의 길이가 서로 다르다.', false], ['변이 4개보다 적다.', false]]);
            return C('다음 도형이 다각형이 아닌 까닭으로 알맞은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              figure: draw(fit, [item.open ? G.polyline(fit.points) : G.polygon(fit.points)], item.said),
              explain: item.kind === 'curved' ? '다각형은 선분으로만 둘러싸인 도형이다. 이 도형은 굽은 선이 있어서 다각형이 아니다. 변의 길이나 변의 수는 다각형인지 아닌지와 관계없다.' : '다각형은 선분으로만 둘러싸인 도형이다. 이 도형은 선분으로만 이루어져 있지만 한쪽이 열려 있어서 다각형이 아니다.',
              facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('poly-say', '다각형에 대한 설명', '①7 ②5 ③13 심3', (d) => {
            // [틀린 설명, 바로잡는 말]
            const [wrong, why] = d.pick([
              ['다각형은 모든 변의 길이가 같다.', '변의 길이는 서로 달라도 된다.'],
              ['다각형에서 각의 수는 변의 수보다 1만큼 더 작다.', '변의 수, 꼭짓점의 수, 각의 수는 모두 같다.'],
              ['오각형, 육각형은 각의 크기에 따라 붙인 이름이다.', '변의 수에 따라 삼각형, 사각형, 오각형 …이라고 부른다.'],
              ['굽은 선이 있어도 선분이 섞여 있으면 다각형이다.', '굽은 선이 하나라도 있으면 다각형이 아니다.'],
              ['선분으로만 이루어져 있으면 한쪽이 열려 있어도 다각형이다.', '선분으로 둘러싸여 있지 않고 열려 있으면 다각형이 아니다.'],
              ['변이 2개인 다각형도 있다.', '선분 2개로는 둘러쌀 수 없으므로 변이 가장 적은 다각형은 삼각형이다.']
            ]);
            const rows = d.shuffle(d.shuffle(['다각형은 선분으로만 둘러싸인 도형이다.', '다각형에서 변의 수와 꼭짓점의 수는 같다.', '변이 5개인 다각형은 오각형이다.', '원은 다각형이 아니다.', '변이 3개인 다각형도 있다.', '모양이 달라도 변의 수가 같은 다각형은 이름이 같다.']).slice(0, 3).map((text) => [text, true]).concat([[wrong, false]]));
            return C('다각형에 대한 설명으로 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
              explain: `다각형은 선분으로만 둘러싸인 도형이다. ${why}`,
              facts: { truth: rows.map(([, ok]) => ok), want: false }
            });
          }),
          T('poly-talk', '그림 속 도형에 대한 설명', '①8 ②5', (d) => {
            // 설명 넷 가운데 하나만 틀리게 한다: 굽은 선이 있는 도형을 다각형이라 하거나, 꼭짓점의 수를 잘못 세거나, 변이 가장 많은 도형을 잘못 짚는다.
            const ns = d.shuffle([3, 4, 5, 6, 7]).slice(0, 3), items = d.shuffle(ns.map((n) => anyPoly(d, n)).concat([curvedItem(d, true)]));
            const polys = items.map((item, i) => (item.kind === 'poly' ? i : -1)).filter((i) => i >= 0), bent = items.findIndex((item) => item.kind === 'curved'), [a, b] = d.shuffle(polys);
            const most = polys.reduce((best, i) => (items[i].n > items[best].n ? i : best)), slip = d.pick(['bent', 'count', 'most']), other = polys.find((i) => i !== most);
            const said = slip === 'count' ? items[b].n + 1 : items[b].n, top = slip === 'most' ? other : most;
            const rows = d.shuffle([
              [`${TAGS[a]}는 변이 ${items[a].n}개인 ${NAME[items[a].n]}이다.`, true],
              [`${TAGS[b]}의 꼭짓점은 ${said}개이다.`, said === items[b].n],
              [slip === 'bent' ? `${TAGS[bent]}는 굽은 선이 있는 다각형이다.` : `${TAGS[bent]}는 굽은 선이 있으므로 다각형이 아니다.`, slip !== 'bent'],
              [`변의 수가 가장 많은 다각형은 ${TAGS[top]}이다.`, polys.every((i) => items[i].n <= items[top].n)]
            ]);
            return C('도형 가, 나, 다, 라에 대한 설명으로 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
              figure: gallery(items, { label: told(items) }),
              explain: polys.map((i) => `${TAGS[i]}는 ${NAME[items[i].n]}`).join(', ') + `이고, ${TAGS[bent]}는 굽은 선이 있어서 다각형이 아니다. 다각형의 꼭짓점의 수는 변의 수와 같고, 변이 가장 많은 다각형은 ${TAGS[most]}이다.`,
              facts: { truth: rows.map(([, ok]) => ok), want: false }
            });
          })
        ]
      },
      {
        id: 'name', title: '다각형의 이름', standard: POLY,
        types: [
          T('name-figure', '그림 속 다각형의 이름', '①9·10·17 ②6·9 ③5·6·7·12 심4', (d) => {
            const n = d.int(5, 8), item = anyPoly(d, n), fit = place(item.points, [5, 3.6], [0.7, 0.6]), ns = d.shuffle([5, 6, 7, 8]);
            return C('다음 다각형의 이름은?', ns.map((k) => NAME[k]), ns.indexOf(n), {
              figure: draw(fit, [G.polygon(fit.points)], '다각형 하나'),
              explain: `변의 수를 세면 ${n}개이다. 변이 ${n}개인 다각형은 ${NAME[n]}이다.`,
              facts: { kindPick: { kinds: ns.map((k) => 'n' + k), target: 'n' + item.points.length } }
            });
          }),
          T('name-pick', '이름에 맞는 다각형 모두 고르기', '①11 ②7 ③5·10', (d) => {
            // 모양이 달라도 변의 수가 같으면 이름이 같다. 같은 이름의 다각형을 모양이 다른 것으로 두세 개 섞는다.
            const n = d.pick([5, 6, 7]), k = d.int(2, 3), others = d.shuffle([4, 5, 6, 7, 8].filter((m) => m !== n)).slice(0, 6 - k);
            const items = d.shuffle(d.shuffle(POLYS[n]).slice(0, k).map(polyItem).concat(others.map((m) => anyPoly(d, m)))), flags = items.map((item) => item.n === n), made = setOptions(d, TAGS, flags);
            return C(`${NAME[n]}을 모두 고른 것은?`, made.options, made.answer, {
              figure: gallery(items, { label: '다각형 6개' }),
              explain: `변이 ${n}개인 다각형이 ${NAME[n]}이다. ` + items.map((item, i) => `${TAGS[i]}는 변이 ${item.n}개`).join(', ') + '이다. 모양이 달라도 변의 수가 같으면 이름이 같다.',
              facts: { sets: { labels: TAGS, flags, options: made.sets } }
            });
          }),
          T('name-odd', '이름이 다른 다각형', '②8 심5', (d) => {
            const n = d.pick([5, 6, 7]), m = d.pick([n - 1, n + 1]), items = d.shuffle(d.shuffle(POLYS[n]).slice(0, 3).map(polyItem).concat([anyPoly(d, m)])), at = items.findIndex((item) => item.n === m);
            return C('이름이 나머지 셋과 다른 다각형은?', TAGS.slice(0, 4), at, {
              figure: gallery(items, { label: '다각형 4개' }),
              explain: `${TAGS[at]}는 변이 ${m}개인 ${NAME[m]}이고, 나머지는 모두 변이 ${n}개인 ${NAME[n]}이다. 모양이 달라도 변의 수가 같으면 이름이 같다.`,
              facts: { kindPick: { kinds: items.map((item) => 'n' + item.n), target: 'n' + m } }
            });
          }),
          T('name-most', '변의 수가 가장 많은 다각형', '①12 ②8 ③11', (d) => {
            const most = d.bool(), ns = d.shuffle([3, 4, 5, 6, 7, 8]).slice(0, 4), items = ns.map((n) => anyPoly(d, n)), best = most ? Math.max(...ns) : Math.min(...ns);
            return C(`변의 수가 가장 ${most ? '많은' : '적은'} 다각형은?`, TAGS.slice(0, 4), ns.indexOf(best), {
              figure: gallery(items, { label: '다각형 4개' }),
              explain: items.map((item, i) => `${TAGS[i]}는 ${NAME[item.n]}`).join(', ') + `이다. 변의 수가 가장 ${most ? '많은' : '적은'} 것은 변이 ${best}개인 ${TAGS[ns.indexOf(best)]}이다.`,
              facts: { rank: { values: items.map((item) => item.points.length), nth: most ? 1 : 4 } }
            });
          }),
          T('name-counts', '다각형의 변·꼭짓점·각의 수', '①13 ②6 ③8', (d) => {
            const n = d.int(5, 12);
            return M(`${NAME[n]}의 변, 꼭짓점, 각은 각각 몇 개인가?`, [{ label: '변', answer: n, unit: '개' }, { label: '꼭짓점', answer: n, unit: '개' }, { label: '각', answer: n, unit: '개' }], {
              explain: `${NAME[n]}은 변이 ${n}개인 다각형이다. 다각형은 변의 수, 꼭짓점의 수, 각의 수가 모두 같으므로 꼭짓점도 ${n}개, 각도 ${n}개이다.`,
              facts: { calc: [[String(n), 0], [String(n), 1], [String(n), 2]], unseen: [n] }
            });
          }),
          T('name-from-count', '선분의 수를 듣고 이름 정하기', '①14 ②10 ③9 심4', (d) => {
            const n = d.int(7, 12), ns = d.shuffle([n, n - 1, n + 1, n === 12 ? 10 : n + (n >= 11 ? -2 : 2)]), byPoint = d.bool();
            return C(byPoint ? `꼭짓점이 ${n}개인 다각형의 이름은?` : `${n}개의 선분으로만 둘러싸인 도형의 이름은?`, ns.map((k) => NAME[k]), ns.indexOf(n), {
              explain: byPoint ? `다각형은 꼭짓점의 수와 변의 수가 같다. 변이 ${n}개인 다각형은 ${NAME[n]}이다.` : `선분으로만 둘러싸인 도형은 다각형이고, 변이 ${n}개인 다각형은 ${NAME[n]}이다.`,
              facts: { choose: { exprs: ns.map(String), rule: 'equals', target: n }, unseen: ns }
            });
          }),
          T('name-more', '변이 몇 개 더 많은 다각형', '①14', (d) => {
            const a = d.int(4, 7), k = d.int(2, 3), n = a + k, ns = d.shuffle([n, n - 1, n + 1, k === 2 ? n + 2 : a + 1]);
            return C(`${NAME[a]}보다 변이 ${k}개 더 많은 다각형의 이름은?`, ns.map((m) => NAME[m]), ns.indexOf(n), {
              explain: `${NAME[a]}의 변은 ${a}개이다. ${a} + ${k} = ${n}이므로 변이 ${n}개인 ${NAME[n]}이다.`,
              facts: { pick: { expr: `${a}+${k}`, options: ns }, unseen: [a] }
            });
          }),
          T('name-next', '규칙에 따라 다음에 올 다각형', '①14 심9', (d) => {
            const first = d.int(3, 4), ns = [0, 1, 2, 3].map((i) => first + i), n = first + 4, step = 2.35, parts = [];
            ns.forEach((m, i) => parts.push(G.polygon(regular(m).map(([x, y]) => [1.15 + i * step + x * 0.95, 1.35 + y * 0.95]))));
            const bx = 1.15 + 4 * step, corners = [[bx - 0.8, 0.55], [bx + 0.8, 0.55], [bx + 0.8, 2.15], [bx - 0.8, 2.15]];
            corners.forEach((p, i) => parts.push(G.line(p, corners[(i + 1) % 4], 'mb-line is-cut')));
            parts.push(G.text([bx, 1.35], '?'));
            const list = d.shuffle([n, n - 1, n + 1, n + 2]);
            return C('규칙에 따라 다각형을 늘어놓았다. ? 자리에 올 다각형의 이름은?', list.map((m) => NAME[m]), list.indexOf(n), {
              figure: G.board(bx + 1.1, 2.7, parts, { grid: false, scale: 1, label: `왼쪽부터 ${ns.map((m) => NAME[m]).join(', ')}, 그다음 자리는 비어 있다.` }),
              explain: `변이 ${ns.join('개, ')}개로 1개씩 늘어난다. 다음에는 변이 ${n}개인 ${NAME[n]}이 온다.`,
              facts: { pick: { expr: `${n - 1}+1`, options: list }, unseen: [n - 1, 1] }
            });
          }),
          T('name-sum-name', '변의 수와 꼭짓점의 수의 합으로 이름 찾기', '①15 ②11 심8', (d) => {
            // 합을 그대로 변의 수로 읽는 아이는 십이각형·십각형·팔각형을 고른다.
            const n = d.int(4, 6), ns = d.shuffle([n, n * 2, n + 1, n === 4 ? 6 : n - 1]);
            return C(`변의 수와 꼭짓점의 수를 더하면 모두 ${n * 2}개인 다각형의 이름은?`, ns.map((m) => NAME[m]), ns.indexOf(n), {
              explain: `다각형은 변의 수와 꼭짓점의 수가 같다. ${n} + ${n} = ${n * 2}이므로 변이 ${n}개인 ${NAME[n]}이다.`,
              facts: { choose: { exprs: ns.map((m) => `${m}+${m}`), rule: 'equals', target: n * 2 }, unseen: ns }
            });
          }),
          T('name-compare', '변·꼭짓점·각의 수 비교하기', '①16 ②11 심7', (d) => {
            const ns = d.shuffle([4, 5, 6, 7, 8, 9, 10, 12]).slice(0, 3), words = d.shuffle(['변', '꼭짓점', '각']), best = Math.max(...ns);
            return C('㉠, ㉡, ㉢ 가운데 수가 가장 큰 것은?', LABELS.slice(0, 3), ns.indexOf(best), {
              figure: tagged(ns.map((n, i) => `${NAME[n]}의 ${words[i]}의 수`)),
              explain: ns.map((n, i) => `${LABELS[i]} ${n}개`).join(', ') + `이다. 다각형은 변의 수, 꼭짓점의 수, 각의 수가 모두 같으므로 이름에 든 수를 비교하면 된다.`,
              facts: { choose: { exprs: ns.map(String), rule: 'max' }, unseen: ns }
            });
          }),
          T('name-complete', '다각형을 완성하려면 더 그어야 하는 선분', '①18 ②13 ③15 심10', (d) => {
            // 그리기 꼴을 수로 답하게 바꾸었다. 그려진 선분은 모두 변이 된다.
            const path = d.pick([[[1, 3], [0, 1], [2, 0], [4, 0]], [[1, 4], [0, 2], [1, 0], [4, 0], [5, 2]], [[0, 3], [0, 1], [2, 0], [4, 1], [5, 3]], [[2, 4], [0, 3], [0, 1], [2, 0], [4, 0], [5, 2]]]), k = path.length - 1, n = k + d.int(2, 3);
            return N(`점 종이에 선분 ${k}개를 이어 그렸다. 선분을 더 그어, 그려진 선분이 모두 변이 되는 ${NAME[n]}을 완성하려고 한다. 선분을 몇 개 더 그어야 하는가?`, n - k, {
              unit: '개', figure: G.board(5, 4, [G.polyline(path)].concat(path.map((p) => G.point(p))), { grid: 'dots', scale: 1.4, label: `점 종이에 이어 그린 선분 ${k}개` }),
              explain: `${NAME[n]}은 변이 ${n}개이다. 이미 ${k}개가 그려져 있으므로 ${n} − ${k} = ${n - k}(개)를 더 그어야 한다.`,
              facts: { calc: [[`${n}-${k}`, 0]], unseen: [n] }
            });
          })
        ]
      },
      {
        id: 'regular', title: '정다각형', standard: POLY,
        types: [
          T('regular-word', '정다각형의 뜻', '①21 ②15 ③16', (d) => {
            const rows = d.shuffle([['변, 각', true], ['각, 변', false], ['변, 꼭짓점', false], ['대각선, 각', false]]);
            return C('정다각형은 ㉠의 길이가 모두 같고 ㉡의 크기가 모두 같은 다각형이다. ㉠, ㉡에 알맞은 말을 차례대로 쓴 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              explain: '변의 길이가 모두 같고 각의 크기가 모두 같은 다각형을 정다각형이라고 한다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('regular-find', '도형 여럿 가운데 정다각형 고르기', '①22·23 ②16·17·18 ③17 심12', (d) => {
            // 변의 길이만 같은 마름모와 각의 크기만 같은 직사각형을 꼭 섞는다.
            const count = d.int(2, 3), items = d.shuffle(d.shuffle([3, 4, 5, 6, 8]).slice(0, count).map(regularItem).concat([rhombusItem(d), rectItem(d)], plainItems(d, 4 - count)));
            const flags = items.map((item) => item.kind === 'regular'), made = setOptions(d, TAGS, flags);
            return C('정다각형을 모두 고른 것은?', made.options, made.answer, {
              figure: gallery(items, { label: told(items) }),
              explain: `변의 길이가 모두 같고 각의 크기도 모두 같아야 정다각형이다. ${TAGS[items.findIndex((item) => item.kind === 'rhombus')]}는 변의 길이는 모두 같지만 각의 크기가 같지 않고, ${TAGS[items.findIndex((item) => item.kind === 'rect')]}는 각의 크기는 모두 같지만 변의 길이가 같지 않다.`,
              facts: { sets: { labels: TAGS, flags, options: made.sets } }
            });
          }),
          T('regular-parts', '변의 길이가 모두 같은 다각형, 각의 크기가 모두 같은 다각형', '①24 ③18', (d, turn) => {
            // 첫째는 변의 길이만, 둘째는 각의 크기만 본다. 마름모와 직사각형이 두 물음에서 갈린다.
            const items = d.shuffle(d.shuffle([3, 4, 5, 6]).slice(0, 2).map(regularItem).concat([rhombusItem(d), rectItem(d)], plainItems(d, 2)));
            const bySide = turn === 0, flags = items.map((item) => item.kind === 'regular' || item.kind === (bySide ? 'rhombus' : 'rect')), made = setOptions(d, TAGS, flags);
            return C(bySide ? '변의 길이가 모두 같은 다각형을 모두 고른 것은?' : '각의 크기가 모두 같은 다각형을 모두 고른 것은?', made.options, made.answer, {
              figure: gallery(items, { label: told(items) }),
              explain: `정다각형인 ${listed(TAGS, items.map((item) => item.kind === 'regular'))}는 변의 길이도 각의 크기도 모두 같다. ` + (bySide ? `마름모인 ${TAGS[items.findIndex((item) => item.kind === 'rhombus')]}는 각의 크기는 같지 않지만 네 변의 길이가 모두 같다.` : `직사각형인 ${TAGS[items.findIndex((item) => item.kind === 'rect')]}는 변의 길이는 같지 않지만 네 각이 모두 직각으로 같다.`),
              facts: { sets: { labels: TAGS, flags, options: made.sets } }
            });
          }, { count: 2 }),
          T('regular-name', '그림 속 정다각형의 이름', '①25 ②19·20 ③19 심13', (d) => {
            const n = d.int(7, 10), ns = d.shuffle([7, 8, 9, 10]), fit = place(regular(n), [4.8, 4.8], [0.6, 0.6]);
            return C('다음 도형은 정다각형이다. 이 도형의 이름은?', ns.map((k) => '정' + NAME[k]), ns.indexOf(n), {
              figure: draw(fit, [G.polygon(fit.points)], '정다각형 하나'),
              explain: `변의 수를 세면 ${n}개이다. 변이 ${n}개인 정다각형은 정${NAME[n]}이다.`,
              facts: { kindPick: { kinds: ns.map((k) => 'n' + k), target: 'n' + fit.points.length } }
            });
          }),
          T('regular-told', '조건을 읽고 정다각형의 이름 정하기', '①26 ②21 ③20 심14', (d) => {
            const n = d.int(5, 10), ns = d.shuffle([n, n - 1, n + 1, n + 2]);
            return C('다음 조건에 모두 맞는 도형의 이름은?', ns.map((k) => '정' + NAME[k]), ns.indexOf(n), {
              figure: conditions(['선분으로만 둘러싸여 있다.', `변이 ${n}개이다.`, '변의 길이가 모두 같고, 각의 크기도 모두 같다.']),
              explain: `선분으로만 둘러싸인 도형은 다각형이고, 변의 길이와 각의 크기가 모두 같으므로 정다각형이다. 변이 ${n}개인 정다각형은 정${NAME[n]}이다.`,
              facts: { choose: { exprs: ns.map(String), rule: 'equals', target: n }, unseen: ns }
            });
          }),
          T('regular-side', '정다각형의 변의 길이', '①27 ②22 ③22', (d) => {
            const n = d.pick([5, 6, 8]), s = d.int(3, 15), at = d.int(0, n - 1), ask = (at + Math.floor(n / 2)) % n;
            return N(`정${NAME[n]}에서 ㉠의 길이는 몇 cm인가?`, s, {
              unit: 'cm', figure: regularFig(n, { sides: [[at, cm(s)], [ask, '㉠']], label: `정${NAME[n]}. 한 변의 길이는 ${s} cm, 다른 한 변의 길이는 ㉠` }),
              explain: `정다각형은 변의 길이가 모두 같다. 그러므로 ㉠ = ${s} cm이다.`, facts: { calc: [[String(s), 0]] }
            });
          }),
          T('regular-angle', '정다각형의 각의 크기', '①28 ②23 ③22', (d) => {
            const n = d.pick([5, 6, 8, 9, 10]), at = d.int(0, n - 1), ask = (at + Math.floor(n / 2)) % n;
            return N(`정${NAME[n]}에서 ㉠의 크기는 몇 도인가?`, ANGLE[n], {
              unit: '°', figure: regularFig(n, { angles: [[at, ANGLE[n] + '°'], [ask, '㉠']], label: `정${NAME[n]}. 한 각의 크기는 ${ANGLE[n]}°, 다른 한 각의 크기는 ㉠` }),
              explain: `정다각형은 각의 크기가 모두 같다. 그러므로 ㉠ = ${ANGLE[n]}°이다.`, facts: { calc: [[String(ANGLE[n]), 0]] }
            });
          }),
          T('regular-joined-side', '이어 붙인 두 정다각형의 변의 길이', '②22', (d) => {
            // 맞닿은 변이 두 정다각형의 변이므로 두 도형의 변의 길이가 모두 같다.
            const [a, b] = d.pick([[5, 6], [4, 5], [4, 6], [3, 4], [3, 5], [6, 8]]), s = d.int(3, 12);
            const A = onSide([0, 1], [0, 0], a, true), Bp = onSide([0, 1], [0, 0], b, false), fit = place(A.concat(Bp), [6.6, 4], [1.5, 0.95]), pa = fit.points.slice(0, a), pb = fit.points.slice(a);
            return N(`정${NAME[a]}과 정${NAME[b]}을 한 변이 꼭 맞닿게 이어 붙였다. ㉠의 길이는 몇 cm인가?`, s, {
              unit: 'cm', figure: draw(fit, [G.polygon(pa), G.polygon(pb), sideOf(pa, Math.floor(a / 2), cm(s)), sideOf(pb, Math.floor(b / 2), '㉠')], `한 변이 맞닿은 정${NAME[a]}과 정${NAME[b]}. 정${NAME[a]}의 한 변의 길이는 ${s} cm, 정${NAME[b]}의 한 변의 길이는 ㉠`),
              explain: `정${NAME[a]}의 변은 모두 ${s} cm이므로 맞닿은 변도 ${s} cm이다. 맞닿은 변은 정${NAME[b]}의 변이기도 하므로 정${NAME[b]}의 변도 모두 ${s} cm이다.`,
              facts: { calc: [[String(s), 0]] }
            });
          }),
          T('regular-why', '정다각형이 아닌 까닭', '①29·30 ②24·26 ③21 심15', (d) => {
            // 까닭 쓰기를 까닭 고르기로 바꾸었다. 그림에 변의 길이와 각의 크기를 모두 적는다.
            const rhombus = d.bool(), s = d.int(4, 9), a = d.pick([60, 70]), [w, h] = d.pick([[7, 4], [8, 5], [6, 3], [9, 5]]);
            const raw = rhombus ? rhombusOf(a) : [[0, 0], [w, 0], [w, -h], [0, -h]], fit = place(raw, [5.4, 3.5], [1.55, 0.95]), p = fit.points;
            const sides = rhombus ? [s, s, s, s] : [w, h, w, h], angles = rhombus ? [a, 180 - a, a, 180 - a] : [90, 90, 90, 90];
            const sameSides = new Set(sides).size === 1, sameAngles = new Set(angles).size === 1;
            const rows = d.shuffle([['변의 길이는 모두 같지만 각의 크기가 모두 같지는 않다.', sameSides && !sameAngles], ['각의 크기는 모두 같지만 변의 길이가 모두 같지는 않다.', !sameSides && sameAngles], ['변의 길이도 모두 같지 않고 각의 크기도 모두 같지 않다.', !sameSides && !sameAngles], ['변의 길이와 각의 크기가 모두 같지만 변이 4개뿐이다.', false]]);
            return C('다음 사각형이 정다각형이 아닌 까닭으로 알맞은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              figure: draw(fit, [G.polygon(p)].concat(sides.map((v, i) => sideOf(p, i, cm(v))), angles.map((v, i) => (rhombus && i > 1 ? '' : corner(p, i, v === 90 ? '' : v + '°')))), rhombus ? `네 변의 길이가 모두 ${s} cm이고, 이웃한 두 각의 크기가 ${a}°, ${180 - a}°인 사각형` : `네 각이 모두 직각이고, 네 변의 길이가 ${w} cm, ${h} cm, ${w} cm, ${h} cm인 사각형`),
              explain: rhombus ? `네 변의 길이는 모두 ${s} cm로 같지만 각의 크기가 ${a}°와 ${180 - a}°로 같지 않다. 변의 길이와 각의 크기가 모두 같아야 정다각형이다.` : `네 각은 모두 직각으로 같지만 변의 길이가 ${w} cm와 ${h} cm로 같지 않다. 변의 길이와 각의 크기가 모두 같아야 정다각형이다.`,
              facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('regular-say', '정다각형에 대한 설명', '①31 ②21·24 ③23 심16', (d) => {
            // [틀린 설명, 바로잡는 말]. 마름모(변만 같다)와 직사각형(각만 같다)을 정다각형이라고 한 설명도 섞는다.
            const [wrong, why] = d.pick([
              ['정사각형의 한 각의 크기는 60°이다.', '정사각형의 한 각의 크기는 90°이다.'],
              ['정오각형의 변은 6개이다.', '정오각형의 변은 5개이다.'],
              ['정육각형은 여섯 각의 크기가 서로 다르다.', '정육각형은 여섯 각의 크기가 모두 같다.'],
              ['마름모는 네 변의 길이가 모두 같으므로 정다각형이다.', '마름모는 네 변의 길이는 같지만 네 각의 크기가 모두 같지는 않으므로 정다각형이 아니다.'],
              ['직사각형은 네 각의 크기가 모두 같으므로 정다각형이다.', '직사각형은 네 각의 크기는 같지만 네 변의 길이가 모두 같지는 않으므로 정다각형이 아니다.'],
              ['변이 8개이고 변의 길이가 모두 같은 다각형은 언제나 정팔각형이다.', '변의 길이가 모두 같아도 각의 크기가 다르면 정팔각형이 아니다.']
            ]);
            const rows = d.shuffle(d.shuffle(['정다각형은 변의 길이가 모두 같다.', '정다각형은 각의 크기가 모두 같다.', '변이 7개인 정다각형은 정칠각형이다.', '정팔각형과 팔각형은 변의 수가 같다.', '정삼각형과 정사각형은 정다각형이다.']).slice(0, 3).map((text) => [text, true]).concat([[wrong, false]]));
            return C('정다각형에 대한 설명으로 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
              explain: `정다각형은 변의 길이가 모두 같고 각의 크기도 모두 같은 다각형이다. ${why}`,
              facts: { truth: rows.map(([, ok]) => ok), want: false }
            });
          }),
          T('regular-talk', '그림 속 정다각형에 대한 설명', '②25', (d) => {
            const n = d.pick([5, 6, 8]), s = d.int(3, 12), A = ANGLE[n], at = d.int(0, n - 1), slip = d.pick(['points', 'side', 'angle']);
            const rows = d.shuffle([
              [`변은 모두 ${n}개이다.`, true],
              [slip === 'points' ? `꼭짓점은 모두 ${n + 1}개이다.` : `꼭짓점은 모두 ${n}개이다.`, slip !== 'points'],
              [slip === 'side' ? `길이가 ${s} cm인 변은 1개뿐이다.` : `모든 변의 길이는 ${s} cm이다.`, slip !== 'side'],
              [slip === 'angle' ? `크기가 ${A}°인 각은 1개뿐이다.` : `모든 각의 크기는 ${A}°이다.`, slip !== 'angle']
            ]);
            return C(`그림은 정${NAME[n]}이다. 이 도형에 대한 설명으로 옳지 않은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
              figure: regularFig(n, { sides: [[at, cm(s)]], angles: [[(at + Math.floor(n / 2)) % n, A + '°']], label: `정${NAME[n]}. 한 변의 길이는 ${s} cm, 한 각의 크기는 ${A}°` }),
              explain: `정${NAME[n]}은 변과 꼭짓점이 ${n}개씩이고, 변 ${n}개의 길이가 모두 ${s} cm, 각 ${n}개의 크기가 모두 ${A}°이다.`,
              facts: { truth: rows.map(([, ok]) => ok), want: false }
            });
          }),
          T('regular-angle-sum', '한 각의 크기로 모든 각의 크기의 합 구하기', '①41 ②29 ③26 심27', (d) => {
            // 각의 크기의 합 공식이 아니라, 주어진 한 각에 각의 수를 곱한다(각의 크기가 모두 같다).
            const n = d.pick([5, 6, 8, 9, 10]), A = ANGLE[n];
            return N(`정${NAME[n]}의 한 각의 크기는 ${A}°이다. 정${NAME[n]}의 모든 각의 크기의 합은 몇 도인가?`, A * n, {
              unit: '°', explain: `정${NAME[n]}은 각이 ${n}개이고 크기가 모두 ${A}°로 같다. ${A}° × ${n} = ${A * n}°`,
              facts: { calc: [[`${A}*${n}`, 0]], unseen: [n] }
            });
          }),
          T('regular-outer', '정다각형의 한 변을 늘인 바깥쪽 각', '②31 심29', (d) => {
            // 한 각의 크기는 다른 꼭짓점에 적는다. 각의 크기가 모두 같다는 것과 직선이 이루는 각 180°를 쓴다.
            const n = d.pick([5, 6, 8, 9, 10]), A = ANGLE[n], raw = regular(n), low = Math.max(...raw.map((p) => p[1]));
            const base = raw.map((p, i) => i).filter((i) => Math.abs(raw[i][1] - low) < 1e-6), q = raw[base[0]][0] > raw[base[1]][0] ? base[0] : base[1], next = base.includes((q + 1) % n) ? (q + n - 1) % n : (q + 1) % n;
            const fit = place(raw.concat([[raw[q][0] + 0.95, raw[q][1]]]), [5.8, 4.2], [0.8, 0.9]), p = fit.points.slice(0, n), end = fit.points[n], far = (q + Math.floor(n / 2)) % n;
            return N(`정${NAME[n]}의 한 변을 늘여 직선을 그었다. ㉠의 크기는 몇 도인가?`, 180 - A, {
              unit: '°', figure: draw(fit, [G.polygon(p), G.line(p[q], end), corner(p, far, A + '°'), wedge(p[q], p[next], end, '㉠')], `정${NAME[n]}의 한 각의 크기는 ${A}°. 한 변을 한쪽으로 늘인 직선과 이웃한 변이 이루는 바깥쪽 각이 ㉠`),
              explain: `정다각형은 각의 크기가 모두 같으므로 ㉠과 이웃한 안쪽 각도 ${A}°이다. 직선이 이루는 각은 180°이므로 ㉠ = 180° − ${A}° = ${180 - A}°이다.`,
              facts: { calc: [[`180-${A}`, 0]], unseen: [180] }
            });
          })
        ]
      },
      {
        id: 'diag', title: '대각선', standard: POLY,
        types: [
          T('diag-word', '대각선의 뜻', '①42·43 ②39 ③36', (d) => {
            const rows = d.shuffle([['다각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분', true], ['다각형에서 서로 이웃한 두 꼭짓점을 이은 선분', false], ['다각형의 변 위에 있는 두 점을 이은 선분', false], ['다각형을 가로지르는 굽은 선', false]]);
            return C('대각선의 뜻을 바르게 설명한 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              explain: '다각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 대각선이라고 한다. 서로 이웃한 두 꼭짓점을 이은 선분은 변이다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('diag-neighbors', '이웃하지 않는 꼭짓점', '②40', (d) => {
            const n = d.pick([5, 6]), raw = d.pick(CONVEX[n]), v = d.int(0, n - 1), others = NAMES.slice(0, n).filter((_, i) => i !== v), idx = NAMES.slice(0, n).map((_, i) => i).filter((i) => i !== v);
            const flags = idx.map((i) => !adjacent(n, v, i)), made = setOptions(d, others, flags);
            return C(`${NAME[n]}에서 꼭짓점 ${NAMES[v]}과 이웃하지 않는 꼭짓점을 모두 고른 것은?`, made.options, made.answer, {
              figure: namedFig(raw, { label: `${NAME[n]} ${NAMES.slice(0, n).join('')}` }),
              explain: `꼭짓점 ${NAMES[v]}과 변으로 이어진 꼭짓점 ${listed(others, flags.map((f) => !f))}은 이웃하는 꼭짓점이다. 나머지 ${listed(others, flags)}이 이웃하지 않는 꼭짓점이고, 이 꼭짓점들과 이은 선분이 대각선이다.`,
              facts: { sets: { labels: others, flags, options: made.sets } }
            });
          }),
          T('diag-names', '선분의 이름을 보고 대각선이 아닌 것 고르기', '①44 ②41 ③38', (d) => {
            // 첫 꼭짓점과 마지막 꼭짓점을 이은 선분도 변이다(이름이 떨어져 있어 대각선으로 보기 쉽다).
            const n = d.pick([5, 6]), raw = d.pick(CONVEX[n]), all = [];
            for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) all.push([i, j]);
            const side = d.bool() ? [0, n - 1] : d.pick(all.filter(([i, j]) => j - i === 1)), picks = d.shuffle(d.shuffle(all.filter((pair) => isDiagonal(n, pair))).slice(0, 3).concat([side]));
            const truth = picks.map((pair) => isDiagonal(n, pair)), word = ([i, j]) => `선분 ${NAMES[i]}${NAMES[j]}`;
            return C(`${NAME[n]} ${NAMES.slice(0, n).join('')}에서 대각선이 아닌 것은?`, picks.map(word), truth.indexOf(false), {
              figure: namedFig(raw, { label: `${NAME[n]} ${NAMES.slice(0, n).join('')}` }),
              explain: `${word(side)}은 서로 이웃한 두 꼭짓점을 이은 선분이므로 ${NAME[n]}의 변이다. 나머지는 서로 이웃하지 않는 두 꼭짓점을 이은 선분이므로 대각선이다.`,
              facts: { truth, want: false }
            });
          }),
          T('diag-drawn', '그어진 선분 가운데 대각선 고르기', '①45 ③39 심33', (d) => {
            // 한쪽 끝이 꼭짓점이 아니라 변 위의 점이면 대각선이 아니다. 선분끼리 엇갈리지 않게 골라 어느 기호가 어느 선분의 것인지 헷갈리지 않게 한다.
            const [n, layouts] = d.pick([
              [6, [[[0, 2], [3, 5], [[0, 5, 0.5], [2, 3, 0.5]]], [[1, 5], [2, 4], [[1, 2, 0.5], [4, 5, 0.5]]], [[0, 3], [1, [2, 3, 0.5]], [5, [3, 4, 0.5]]], [[1, 4], [[0, 1, 0.5], [0, 5, 0.5]], [2, [3, 4, 0.5]]]]],
              [5, [[[0, 2], [0, 3], [[0, 1, 0.5], [1, 2, 0.5]], [[0, 4, 0.5], [3, 4, 0.5]]], [[1, 3], [4, [0, 1, 0.5]], [[1, 2, 0.5], [2, 3, 0.5]]], [[2, 4], [1, [0, 4, 0.5]], [[2, 3, 0.5], [3, 4, 0.5]]]]]
            ]);
            const raw = CONVEX[n][0], segs = d.shuffle(d.pick(layouts)), marks = LABELS.slice(0, segs.length), flags = segs.map((seg) => isDiagonal(n, seg)), made = setOptions(d, marks, flags);
            const more = (p) => { const ends = segs.map(([a, b]) => [endOf(p, a), endOf(p, b)]), spots = markSpots(ends); return ends.map(([a, b]) => G.line(a, b)).concat(spots.map((spot, i) => halo(G.text(spot, marks[i], 'mb-label is-length')))); };
            return C(`${NAME[n]} 안에 선분 ${marks.join(', ')}을 그었다. 대각선을 모두 고른 것은?`, made.options, made.answer, {
              figure: namedFig(raw, { names: false, more, box: [4.9, 4.1], label: `${NAME[n]} 안에 그은 선분 ${segs.length}개. ` + segs.map((seg, i) => `${marks[i]}: ${flags[i] ? '이웃하지 않는 두 꼭짓점을 이은 선분' : '끝이 변 위에 있는 선분'}`).join(' / ') }),
              explain: `서로 이웃하지 않는 두 꼭짓점을 이은 선분만 대각선이다. ${listed(marks, flags.map((f) => !f))}은 끝이 꼭짓점이 아니라 변 위에 있으므로 대각선이 아니다.`,
              facts: { sets: { labels: marks, flags, options: made.sets } }
            });
          }),
          T('diag-right-figure', '대각선을 바르게 그은 그림', '①46 ②42 ③37 심33', (d) => {
            const n = d.pick([4, 5]), raw = CONVEX[n][0], wrongs = n === 4 ? [[0, [1, 2, 0.5]], [[0, 1, 0.5], [2, 3, 0.5]], [[0, 3, 0.4], [1, 2, 0.6]], [1, [2, 3, 0.5]]] : [[0, [2, 3, 0.5]], [[0, 1, 0.5], [2, 3, 0.5]], [1, [3, 4, 0.5]], [[1, 2, 0.5], [3, 4, 0.5]]];
            const right = n === 4 ? d.pick([[0, 2], [1, 3]]) : d.pick([[0, 2], [1, 3], [1, 4], [0, 3]]), segs = d.shuffle([right].concat(d.shuffle(wrongs).slice(0, 3))), truth = segs.map((seg) => isDiagonal(n, seg)), at = truth.indexOf(true);
            const items = segs.map((seg) => ({ points: raw, extra: (p) => G.line(endOf(p, seg[0]), endOf(p, seg[1])) }));
            return C(`${NAME[n]}에 대각선을 바르게 그은 것은?`, TAGS.slice(0, 4), at, {
              figure: gallery(items, { label: `같은 ${NAME[n]}에 선분을 하나씩 그은 그림 4개. ` + truth.map((ok, i) => `${TAGS[i]}: ${ok ? '이웃하지 않는 두 꼭짓점을 이은 선분' : '끝이 변 위에 있는 선분'}`).join(' / ') }),
              explain: `대각선은 서로 이웃하지 않는 두 꼭짓점을 이은 선분이다. ${TAGS[at]}만 두 끝이 모두 꼭짓점이고, 나머지는 선분의 끝이 변 위에 있다.`,
              facts: { truth, want: true }
            });
          }),
          T('diag-from-vertex', '한 꼭짓점에서 그을 수 있는 대각선의 수', '①48 ②46 ③43', (d) => {
            const n = d.int(4, 6), raw = d.pick(CONVEX[n]), v = d.int(0, n - 1);
            const more = (p, drawn) => (drawn ? p.map((q, i) => (i !== v && !adjacent(n, v, i) ? G.line(p[v], q, 'mb-line is-thin') : '')) : []).concat([G.point(p[v]), G.text(G.outward(p, v, 0.6), '㉠')]);
            return N('다각형의 꼭짓점 ㉠에서 그을 수 있는 대각선은 모두 몇 개인가?', n - 3, {
              unit: '개', figure: namedFig(raw, { names: false, more: (p) => more(p, false), label: `${NAME[n]}의 한 꼭짓점에 ㉠이라고 적혀 있다.` }),
              explain: `${NAME[n]}의 꼭짓점 ${n}개 가운데 ㉠ 자신과 ㉠에 이웃한 꼭짓점 2개에는 대각선을 그을 수 없다. ${n} − 3 = ${n - 3}(개)<br>` + namedFig(raw, { names: false, more: (p) => more(p, true), scale: 0.9, label: '꼭짓점 ㉠에서 그은 대각선' }),
              facts: { calc: [[`${raw.length}-3`, 0]], unseen: [n, 3] }
            });
          }),
          T('diag-count-figure', '그림의 다각형에 그을 수 있는 대각선의 수', '①49 ②44 ③41', (d) => {
            const n = d.int(4, 6), raw = d.pick(CONVEX[n]);
            return N('다각형에 그을 수 있는 대각선은 모두 몇 개인가?', diagonals(n), {
              unit: '개', figure: namedFig(raw, { names: false, label: `${NAME[n]} 하나` }),
              explain: `한 꼭짓점에서 ${n - 3}개씩 그을 수 있다. 꼭짓점 ${n}개에서 모두 그으면 같은 대각선을 두 번씩 긋게 되므로, 겹치지 않게 세면 ${diagonals(n)}개이다.<br>` + namedFig(raw, { names: false, more: allDiagonals, scale: 0.9, label: `대각선을 모두 그은 ${NAME[n]}` }),
              facts: { calc: [[diagExpr(raw.length), 0]], unseen: [n, 3, 2] }
            });
          }),
          T('diag-count-name', '선분의 수를 듣고 대각선의 수 구하기', '②45 ③42 심35', (d) => {
            const n = d.int(4, 6);
            return N(`${n}개의 선분으로 둘러싸인 다각형에 그을 수 있는 대각선은 모두 몇 개인가?`, diagonals(n), {
              unit: '개', explain: `${n}개의 선분으로 둘러싸인 다각형은 ${NAME[n]}이다. ${NAME[n]}에 대각선을 겹치지 않게 모두 그으면 ${diagonals(n)}개이다.`,
              facts: { calc: [[diagExpr(n), 0]], unseen: [3, 2] }
            });
          }),
          T('diag-none', '대각선을 그을 수 없는 도형', '①50 ②47 ③46 심39', (d) => {
            // 삼각형은 꼭짓점이 모두 서로 이웃하고, 원은 꼭짓점이 없다.
            const withCircle = d.bool(), rest = d.shuffle([4, 5, 6]).slice(0, withCircle ? 2 : 3).map((n) => polyItem(d.pick(CONVEX[n])));
            const items = d.shuffle([polyItem(d.pick(POLYS[3]))].concat(withCircle ? [{ points: CURVED[0].points(), kind: 'curved', said: '원' }] : [], rest)), flags = items.map((item) => item.kind === 'curved' || item.n === 3), made = setOptions(d, TAGS.slice(0, 4), flags);
            return C('대각선을 그을 수 없는 도형을 모두 고른 것은?', made.options, made.answer, {
              figure: gallery(items, { label: told(items) }),
              explain: `삼각형은 세 꼭짓점이 모두 서로 이웃하므로 대각선을 그을 수 없다.${withCircle ? ' 원은 꼭짓점이 없으므로 대각선을 그을 수 없다.' : ''} 사각형부터는 이웃하지 않는 꼭짓점이 있어 대각선을 그을 수 있다.`,
              facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets } }
            });
          }),
          T('diag-order', '대각선의 수가 많은 차례', '①51 ②48 ③44 심37', (d) => {
            const ns = d.shuffle([4, 5, 6]), items = ns.map((n) => polyItem(d.pick(CONVEX[n]))), orders = d.shuffle([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]);
            const right = [0, 1, 2].sort((x, y) => ns[y] - ns[x]), picks = d.shuffle([right].concat(orders.filter((o) => o.join() !== right.join()).slice(0, 3)));
            return C('대각선의 수가 많은 것부터 차례대로 쓴 것은?', picks.map((o) => o.map((i) => TAGS[i]).join(', ')), picks.findIndex((o) => o.join() === right.join()), {
              figure: gallery(items, { per: 3, label: '다각형 3개' }),
              explain: items.map((item, i) => `${TAGS[i]}는 ${NAME[item.n]}이라 ${diagonals(item.n)}개`).join(', ') + '이다. 변의 수가 많을수록 대각선의 수도 많다.',
              facts: { choose: { exprs: items.map((item) => diagExpr(item.points.length)), rule: 'descending', orders: picks }, unseen: [3, 2, 4, 5, 6] }
            });
          }),
          T('diag-most-name', '대각선을 가장 많이 그을 수 있는 도형', '③44 심37', (d) => {
            // 이름만 보고 변의 수를 떠올린다. 육각형이 없는 보기도 있다.
            const rows = [[d.pick(['정삼각형', '직각삼각형', '이등변삼각형']), 3], [d.pick(['마름모', '평행사변형', '직사각형', '사다리꼴']), 4], [d.pick(['오각형', '정오각형']), 5]].concat(d.bool() ? [[d.pick(['육각형', '정육각형']), 6]] : []);
            const list = d.shuffle(rows), values = list.map(([, n]) => diagonals(n)), best = Math.max(...values);
            return C('대각선을 가장 많이 그을 수 있는 도형은?', list.map(([word]) => word), values.indexOf(best), {
              explain: list.map(([word, n]) => `${word} ${diagonals(n)}개`).join(', ') + '이다. 변의 수가 많을수록 대각선을 많이 그을 수 있다.',
              facts: { rank: { values, nth: 1 } }
            });
          }),
          T('diag-same-count', '대각선의 수가 같은 두 도형', '①49·51 ②48', (d) => {
            // 모양이 달라도 변의 수가 같으면 대각선의 수가 같다.
            const quads = d.shuffle(['마름모', '사다리꼴', '직사각형', '평행사변형', '정사각형']), sides = { 정삼각형: 3, 이등변삼각형: 3, 오각형: 5, 정오각형: 5, 육각형: 6, 정육각형: 6 };
            const lone = d.shuffle([d.pick(['정삼각형', '이등변삼각형']), d.pick(['오각형', '정오각형']), d.pick(['육각형', '정육각형'])]);
            const pairs = d.shuffle([[quads[0], quads[1]], [lone[0], quads[2]], [lone[1], lone[2]], [quads[3], lone[1]]]), count = (word) => diagonals(sides[word] || 4);
            const truth = pairs.map(([x, y]) => count(x) === count(y)), at = truth.indexOf(true);
            return C('그을 수 있는 대각선의 수가 서로 같은 두 도형은?', pairs.map(([x, y]) => `${x}, ${y}`), at, {
              explain: `${josa(pairs[at][0], '과/와')} ${josa(pairs[at][1], '은/는')} 모두 사각형이므로 대각선을 2개씩 그을 수 있다. 모양이 달라도 변의 수가 같으면 대각선의 수가 같다.`,
              facts: { truth, want: true }
            });
          }),
          T('diag-sum', '여러 다각형의 대각선의 수의 합', '①52 ②49 ③45 심38', (d) => {
            const ns = d.shuffle([3].concat(d.shuffle([4, 5, 6]).slice(0, 2))), items = ns.map((n) => polyItem(n === 3 ? d.pick(POLYS[3]) : d.pick(CONVEX[n])));
            return N('세 다각형에 그을 수 있는 대각선은 모두 몇 개인가?', ns.reduce((s, n) => s + diagonals(n), 0), {
              unit: '개', figure: gallery(items, { per: 3, label: '다각형 3개' }),
              explain: items.map((item, i) => `${TAGS[i]}는 ${NAME[item.n]}이라 ${diagonals(item.n)}개`).join(', ') + `이다. ${ns.map(diagonals).join(' + ')} = ${ns.reduce((s, n) => s + diagonals(n), 0)}(개)`,
              facts: { calc: [[items.map((item) => diagExpr(item.points.length)).join('+'), 0]], unseen: [3, 2, 4, 5, 6] }
            });
          }),
          T('diag-diff', '두 다각형의 대각선의 수의 차', '②49 심38', (d) => {
            const [a, b] = d.pick([[6, 4], [6, 5], [5, 4]]);
            return N(`${NAME[a]}에 그을 수 있는 대각선은 ${NAME[b]}에 그을 수 있는 대각선보다 몇 개 더 많은가?`, diagonals(a) - diagonals(b), {
              unit: '개', explain: `${NAME[a]}에는 ${diagonals(a)}개, ${NAME[b]}에는 ${diagonals(b)}개를 그을 수 있다. ${diagonals(a)} − ${diagonals(b)} = ${diagonals(a) - diagonals(b)}(개)`,
              facts: { calc: [[`${diagExpr(a)}-${diagExpr(b)}`, 0]], unseen: [a, b, 3, 2] }
            });
          }),
          T('diag-to-name', '대각선의 수를 듣고 다각형의 이름 정하기', '①55 ②50 ③48 심42', (d) => {
            const n = d.int(4, 6), ns = d.shuffle([3, 4, 5, 6]);
            return C(`대각선을 모두 ${diagonals(n)}개 그을 수 있는 다각형의 이름은?`, ns.map((k) => NAME[k]), ns.indexOf(n), {
              explain: `삼각형은 0개, 사각형은 2개, 오각형은 5개, 육각형은 9개를 그을 수 있다. 대각선이 ${diagonals(n)}개인 다각형은 ${NAME[n]}이다.`,
              facts: { kindPick: { kinds: ns.map((k) => 'd' + diagonals(k)), target: 'd' + diagonals(n) } }
            });
          }),
          T('diag-say', '대각선에 대한 설명', '②51', (d) => {
            // [무엇을 말하는가, 다각형의 변의 수, 말한 수]. 참·거짓은 셈하여 정한다.
            const said = { total: (n, k) => `${NAME[n]}에 그을 수 있는 대각선은 모두 ${k}개이다.`, from: (n, k) => `${NAME[n]}의 한 꼭짓점에서 그을 수 있는 대각선은 ${k}개이다.` };
            const holds = ([what, n, k]) => (what === 'total' ? diagonals(n) : n - 3) === k;
            // 틀린 설명과 같은 것을 말하는 옳은 설명은 함께 내지 않는다(둘 가운데 하나가 틀린 것이 드러난다).
            const wrong = d.pick([['total', 3, 1], ['total', 5, 3], ['from', 4, 2], ['total', 6, 6], ['from', 6, 4]]), rights = d.shuffle([['total', 4, 2], ['from', 5, 2], ['total', 6, 9], ['total', 5, 5], ['from', 6, 3], ['from', 4, 1]].filter(([what, n]) => what !== wrong[0] || n !== wrong[1])).slice(0, 3);
            const rows = d.shuffle(rights.concat([wrong]));
            return C('대각선에 대한 설명으로 옳지 않은 것은?', rows.map(([what, n, k]) => said[what](n, k)), rows.findIndex((row) => !holds(row)), {
              explain: `${NAME[wrong[1]]}${wrong[0] === 'total' ? `에 그을 수 있는 대각선은 모두 ${diagonals(wrong[1])}개` : `의 한 꼭짓점에서 그을 수 있는 대각선은 ${wrong[1] - 3}개`}이다. 한 꼭짓점에서는 자신과 이웃한 두 꼭짓점을 뺀 나머지 꼭짓점에만 대각선을 그을 수 있다.`,
              facts: { truth: rows.map(holds), want: false }
            });
          }),
          T('diag-original', '대각선만 남은 그림에서 처음 다각형 찾기', '①54 ②52 심45', (d) => {
            // 그리기 꼴을 이름 고르기로 바꾸었다. 선분의 끝이 모이는 곳이 처음 다각형의 꼭짓점이다.
            const n = d.int(4, 6), fit = place(regular(n), [3.8, 3.8], [0.7, 0.7]), p = fit.points, ns = d.shuffle([4, 5, 6, n === 5 ? 10 : 8]);
            return C('어떤 다각형에 대각선을 모두 그은 다음 변을 지웠더니 다음과 같았다. 처음 다각형의 이름은?', ns.map((k) => NAME[k]), ns.indexOf(n), {
              figure: draw(fit, allDiagonals(p).map((svg) => svg.replace('mb-line is-thin', 'mb-line')), `선분 ${diagonals(n)}개`),
              explain: `대각선은 꼭짓점과 꼭짓점을 이은 선분이므로 선분의 끝 점이 처음 다각형의 꼭짓점이다. 끝 점이 ${n}곳이므로 ${NAME[n]}이다.<br>` + draw(fit, [G.polygon(p)].concat(allDiagonals(p)), `대각선을 모두 그은 ${NAME[n]}`, 0.9),
              facts: { kindPick: { kinds: ns.map((k) => 'n' + k), target: 'n' + p.length } }
            });
          })
        ]
      },
      { id: 'quad', title: '사각형의 대각선', standard: POLY, types: [] },
      { id: 'make', title: '모양 만들기', standard: MAKE, types: [] },
      { id: 'fill', title: '모양 채우기', standard: MAKE, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
