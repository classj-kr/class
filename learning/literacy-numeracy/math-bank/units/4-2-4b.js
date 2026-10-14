// 4학년 2학기 4단원 다각형 — 사각형의 대각선, 모양 만들기, 모양 채우기의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3의 「사각형의 대각선의 성질」「모양 만들기」「모양 채우기」 묶음, 심화꼴 71꼴)을 번호마다 따져서 실었다.
//
// 실력 문항의 잣대: 기본에서 이미 하는 일(뜻·이름 되묻기, 수 하나 세기, 성질 하나로 길이 하나 구하기)을 고르기로 바꾸고
// 틀린 보기에 흔한 실수를 넣은 것은 실력이 아니다. 실력에는 두 가지만 둔다.
//   ① 그림이나 상황 자체에 함정이 있어 뜻을 정확히 대야 풀리는 문제(보기 없이 수로 답한다)
//      - 오목한 다각형, 한 곳만 굽은 도형, 조금 열린 도형을 섞어 놓고 다각형을 센다.
//      - 마름모(변만 같다), 직사각형(각만 같다), 정다각형을 닮았지만 한 변이 굽었거나 없는 도형을 섞어 놓고 정다각형을 센다.
//      - 변, 대각선, 끝이 변 위에 있는 선분을 함께 굵게 그어 놓고 대각선을 센다.
//      - 기울어진 정사각형을 섞어 놓고 대각선의 성질에 맞는 사각형을 센다. 잘라 낸 조각 가운데 대각선의 길이가 같은 것을 센다.
//      - 조각의 한 변이 몇 배로 길어진 도형을 만드는 데 드는 조각의 수(변의 길이의 배만큼만 든다고 여기면 틀린다).
//   ② 심화꼴 목록에 있는, 성질을 두 번 넘게 이어 써야 풀리는 문제
//      (대각선이 만드는 삼각형의 각, 정다각형을 이어 붙인 모양의 각처럼 각도를 거듭 셈하는 문제는 싣지 않는다. 이 단원은 도형 영역이다. 각도를 더하고 빼는 셈은 「각도」 단원(측정)의 일이고, 이어 붙인 도형에서 각을 좇는 것은 중학교 「삼각형·사각형의 성질」「평행선의 성질」 꼴이다(교육과정: 성질은 관찰·측정 같은 귀납으로 이해한다).)
//      - 대각선의 길이의 합에서 거꾸로 구하기, 정삼각형 2개를 이어 붙인 사각형의 대각선
//      - 한 꼭짓점에서 그을 수 있는 대각선의 수에서 다각형을 찾아 대각선의 수 구하기, 조각을 바꾸어 채울 때의 수와 값
// (처음에 실력에 두었던 「다각형·정다각형·대각선에 대한 설명 고르기」「변의 길이와 각의 크기를 읽고 정다각형 고르기」
//  「한 꼭짓점에서 그을 수 있는 대각선 고르기」는 기본 유형이 같은 일을 하므로 지웠고, 그 틀린 설명은 기본의 설명 가리기에 넣었다.
//  「그림에서 대각선의 성질 가리기」「작은 정사각형의 대각선으로 큰 정사각형의 대각선 구하기」는 기본 묶음으로 내렸다.)
//
// 뺀 것과 까닭(4-2-4a.js에 적은 것 말고)
//  - 조각을 돌려 가며 맞춰 봐야 풀리는 것: 조각 몇 개로 만들 수 있는 도형 고르기(①73 ②67·69), 가장 적은 개수로 채우기(①80 ②76 심68),
//    한 가지 조각으로 채울 수 없는 조각 찾기(②77 심67 — 정육각형을 채우는 것만 실었다), 칠교 조각으로 만들기·채우기(②71·79 심64), 조각 수를 정해 채우기(③73),
//    정육각형의 대각선이 만드는 각을 세 단계로 구하기(심31의 대표 — 이등변삼각형의 각까지만 실었다)
//  - 만들기·채우기 그리기(①75·86 ②70·72·78 ③65·72 심63·70), 만든 방법 쓰기(③66), 대각선의 공통점·차이점 쓰기(①65 심57)
//  - 여러 조각을 모두 써서 채울 때 조각별 수(②75): 채우는 방법이 여럿이라 답이 하나로 정해지지 않는다. 나눈 선을 그린 그림은 「쓰인 조각의 수 세기」가 묻는다.
//  - 만든 모양 속 정다각형을 모두 찾기(③67): 조각 여럿을 묶은 큰 도형까지 찾아야 한다(크고 작은 도형 세기).
//  - 빈틈없이 덮을 수 있는 정다각형(②80 심71)·조각을 한 점에 모아 각도 구하기(②81): 조각의 각을 스스로 끌어내어 한 점에 모아야 한다(범위 밖).
//  - 대각선이 만드는 삼각형의 세 변의 길이의 합(심54): 둘레는 5학년이다. 같은 성질은 「대각선의 길이의 합에서 거꾸로 구하기」가 묻는다.
//  - 조건 여럿을 이어 사각형의 이름 추리기(심48의 대표): 「길이가 같고 수직으로 만나는 사각형」만 실었다.
//  - 한 조각의 수가 정해졌을 때 다른 조각의 수(①81)는 넓이가 아니라 모눈 칸을 세어 푸는 꼴로 실었다.
// 모양 조각은 삼각 모눈 위에 놓는다(작은 정삼각형 1칸 = 정삼각형 조각, 2칸 = 마름모 조각, 3칸 = 사다리꼴 조각, 6칸 = 정육각형 조각).
// 「채울 수 있다」는 손으로 적지 않고 칸을 조각으로 덮는 방법을 찾아(tiling) 정한다. 테두리만 그린 모양은 삼각 모눈 위에 그려 칸을 셀 수 있게 한다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, josa, tagged, N, M, C } = B.kit;
  const G = B.kit.geo;
  const POLY = '4수03-11', MAKE = '4수03-12';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바'];
  const NAMES = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ'];
  const RAD = Math.PI / 180;
  const NAME = { 3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형', 7: '칠각형', 8: '팔각형', 9: '구각형', 10: '십각형' };
  const ANGLE = { 3: 60, 4: 90, 5: 108, 6: 120, 8: 135, 9: 140, 10: 144 };
  const diagonals = (n) => (n * (n - 3)) / 2;

  // ── 그림(4-2-4a.js와 같은 도구) ──────────────────────────────
  const mid = (p, q, t) => [p[0] + (q[0] - p[0]) * (t == null ? 0.5 : t), p[1] + (q[1] - p[1]) * (t == null ? 0.5 : t)];
  const centre = (points) => [points.reduce((s, p) => s + p[0], 0) / points.length, points.reduce((s, p) => s + p[1], 0) / points.length];
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  function place(raw, box, pad) {
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
    const k = Math.min(box[0] / w, box[1] / h);
    return { points: raw.map(([x, y]) => [(x - x0) * k + pad[0], (y - y0) * k + pad[1]]), cols: w * k + pad[0] * 2, rows: h * k + pad[1] * 2 };
  }
  const draw = (fit, parts, label, scale) => G.board(fit.cols, fit.rows, parts, { grid: false, scale: Math.min(scale || 1.15, 296 / (32 + fit.cols * 22)), label });
  const halo = (svg, color) => svg.replace('<text ', `<text style="paint-order:stroke;stroke:${color || '#fff8e1'};stroke-width:4px;stroke-linejoin:round" `);
  const regular = (n) => Array.from({ length: n }, (_, i) => G.toward([0, 0], 1, (n % 2 ? 90 : 90 + 180 / n) + (i * 360) / n));
  function onSide(p, q, n, left) {
    const len = dist(p, q), apothem = len / (2 * Math.tan(Math.PI / n)), m = mid(p, q), way = left ? 1 : -1;
    const c = [m[0] - ((q[1] - p[1]) / len) * apothem * way, m[1] + ((q[0] - p[0]) / len) * apothem * way], r = dist(p, c), a0 = Math.atan2(p[1] - c[1], p[0] - c[0]);
    let step = Math.atan2(q[1] - c[1], q[0] - c[0]) - a0;
    while (step > Math.PI) step -= Math.PI * 2;
    while (step < -Math.PI) step += Math.PI * 2;
    return Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos(a0 + step * k), c[1] + r * Math.sin(a0 + step * k)]);
  }
  // 꼭짓점 v 에서 p 쪽과 q 쪽으로 벌어진 각의 방향 [시작, 끝](도). 180°보다 작은 쪽을 잡는다.
  function spread(v, p, q) {
    const a = G.bearing(v, p), b = G.bearing(v, q);
    let from = Math.min(a, b), to = Math.max(a, b);
    if (to - from > 180) { const t = from + 360; from = to; to = t; }
    return [from, to];
  }
  // 각에 호(직각이면 직각 표시)와 글을 넣는다. 좁은 각은 글이 두 변에 닿지 않게 멀리 적는다.
  function wedge(v, p, q, label, r) {
    const [from, to] = spread(v, p, q), open = to - from, way = (from + to) / 2, right = Math.abs(open - 90) < 0.01, half = Math.max(String(label || '').length * 0.17 + 0.12, 0.38);
    const reach = half * Math.abs(Math.cos(way * RAD)) + 0.3 * Math.abs(Math.sin(way * RAD)), near = (r || 0.6) + 0.14 + reach;
    const far = Math.min(Math.max(near, half / Math.tan((open / 2) * RAD)), 3), size = far > near + 0.01 ? Math.max(r || 0.6, far - reach - 0.14) : (r || 0.6);
    return (right ? G.squareMark(v, from, to) : G.arc(v, from, to, size)) + (label ? G.text(G.toward(v, right ? 1.05 : far, way), label, 'mb-label is-length') : '');
  }
  const corner = (points, i, label, r) => wedge(points[i], points[(i + points.length - 1) % points.length], points[(i + 1) % points.length], label, r);
  function sideText(p, q, away, value) {
    const m = mid(p, q), len = dist(p, q);
    let n = [-(q[1] - p[1]) / len, (q[0] - p[0]) / len];
    if ((away[0] - m[0]) * n[0] + (away[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const off = 0.42 + Math.abs(n[0]) * String(value).length * 0.15;
    return G.text([m[0] + n[0] * off, m[1] + n[1] * off], value, 'mb-label is-length');
  }
  const sideOf = (points, i, value) => sideText(points[i], points[(i + 1) % points.length], centre(points), value);
  const cm = (v) => v + ' cm';
  function gallery(items, o) {
    const opt = o || {}, per = opt.per || (items.length > 4 ? 3 : 2), W = opt.W || (per === 3 ? 4 : 5.6), Ht = opt.H || (per === 3 ? 3.5 : 3.9), box = opt.box || (per === 3 ? [2.7, 2.2] : [3.4, 2.5]), parts = [];
    items.forEach((item, i) => {
      const ox = (i % per) * W, oy = Math.floor(i / per) * Ht, fit = place(item.points, box, [0, 0]);
      const dx = ox + (W - fit.cols) / 2 + 0.2, dy = oy + 0.7 + (Ht - 0.9 - fit.rows) / 2, pts = fit.points.map(([x, y]) => [x + dx, y + dy]);
      parts.push(item.open ? G.polyline(pts) : G.polygon(pts), G.text([ox + 0.35, oy + 0.42], (opt.tags || TAGS)[i]));
    });
    return G.board(per * W - 0.2, Math.ceil(items.length / per) * Ht - 0.1, parts, { grid: false, scale: opt.scale || 1, label: opt.label });
  }
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

  // ── 사각형과 대각선 ──────────────────────────────────────────
  // 모눈종이 위의 사각형(가로 3칸, 세로 4칸 안). 꼭짓점이 모두 모눈의 점 위에 있어 대각선의 성질을 정수 셈으로 가린다.
  // 사다리꼴은 두 대각선의 길이가 같아지는 것(등변사다리꼴)을 쓰지 않는다.
  // 마름모는 두 대각선이 모눈의 선 위에 놓이게 그린다(비스듬히 눕힌 마름모는 평행사변형과 눈으로 가리기 어렵다).
  const QUADS = {
    square: [[[0, 0], [0, 2], [2, 2], [2, 0]], [[0, 0], [0, 3], [3, 3], [3, 0]]],
    rect: [[[0, 0], [0, 2], [3, 2], [3, 0]], [[0, 0], [0, 3], [2, 3], [2, 0]], [[0, 0], [0, 1], [3, 1], [3, 0]]],
    rhombus: [[[1, 0], [0, 2], [1, 4], [2, 2]]],
    para: [[[1, 0], [0, 2], [2, 2], [3, 0]], [[0, 0], [1, 3], [3, 3], [2, 0]], [[0, 0], [1, 2], [3, 2], [2, 0]]],
    trap: [[[0, 0], [0, 2], [3, 2], [1, 0]], [[0, 0], [0, 2], [3, 2], [2, 0]], [[2, 0], [0, 3], [3, 3], [3, 0]]],
    tilted: [[[1, 0], [0, 2], [2, 3], [3, 1]]]
  };
  const QUAD_NAME = { square: '정사각형', rect: '직사각형', rhombus: '마름모', para: '평행사변형', trap: '사다리꼴', tilted: '정사각형' };
  const PROPS = {
    equal: { test: (q) => G.len2(G.sub(q[0], q[2])) === G.len2(G.sub(q[1], q[3])), ask: '두 대각선의 길이가 같은', say: '두 대각선의 길이가 같다', who: '두 대각선의 길이가 같은 사각형은 직사각형과 정사각형이다.' },
    perp: { test: (q) => G.dot(G.sub(q[0], q[2]), G.sub(q[1], q[3])) === 0, ask: '두 대각선이 서로 수직으로 만나는', say: '두 대각선이 서로 수직으로 만난다', who: '두 대각선이 서로 수직으로 만나는 사각형은 마름모와 정사각형이다.' },
    bisect: { test: (q) => q[0][0] + q[2][0] === q[1][0] + q[3][0] && q[0][1] + q[2][1] === q[1][1] + q[3][1], ask: '한 대각선이 다른 대각선을 똑같이 둘로 나누는', say: '한 대각선이 다른 대각선을 똑같이 둘로 나눈다', who: '한 대각선이 다른 대각선을 똑같이 둘로 나누는 사각형은 평행사변형, 마름모, 직사각형, 정사각형이다. 사다리꼴의 대각선은 서로를 똑같이 나누지 않는다.' }
  };
  // 이름만 주는 문항의 참·거짓은 본보기 도형의 좌표로 셈한다.
  const holds = (kind, prop) => PROPS[prop].test(QUADS[kind][0]);
  const seeThrough = (svg) => svg.replace('class="mb-poly"', 'class="mb-poly" style="fill:rgba(250,204,21,0.2)"');
  // 모눈종이에 사각형을 한 줄에 셋씩 그리고 가, 나, 다 … 를 붙인다. lines 이면 대각선도 긋는다.
  function gridGallery(quads, label, lines) {
    const parts = [], rows = quads.length > 3 ? 10 : 5, lastRow = quads.length % 3;
    quads.forEach((q, i) => {
      const w = Math.max(...q.map((p) => p[0])), h = Math.max(...q.map((p) => p[1])), row = Math.floor(i / 3), push = row === 1 && lastRow === 2 ? 2 : 0;
      const cx = (i % 3) * 4 + push, ox = cx + Math.floor((3 - w) / 2), oy = row * 5 + 1 + Math.floor((4 - h) / 2), pts = q.map(([x, y]) => [x + ox, y + oy]);
      parts.push(seeThrough(G.polygon(pts)), halo(G.text([cx + 0.3, row * 5 + 0.45], TAGS[i]), '#fff'));
      if (lines) parts.push(G.line(pts[0], pts[2], 'mb-line is-thin'), G.line(pts[1], pts[3], 'mb-line is-thin'));
    });
    return G.board(11, rows, parts, { grid: 'lines', scale: lines ? 0.85 : 1, label });
  }
  const meet = (a, b, c, e) => { const r = G.sub(b, a), s = G.sub(e, c), t = G.cross(G.sub(c, a), s) / G.cross(r, s); return [a[0] + r[0] * t, a[1] + r[1] * t]; };
  // 두 대각선이 이루는 각이 정해진 직사각형 [ㄱ, ㄴ, ㄷ, ㄹ]. low: 각 ㄴㅁㄷ의 크기(도)
  const rectBy = (low) => [G.toward([0, 0], 1, 90 + low / 2), G.toward([0, 0], 1, 270 - low / 2), G.toward([0, 0], 1, 270 + low / 2), G.toward([0, 0], 1, 90 - low / 2)];
  // 각 ㄴㄱㅁ이 half(도)인 마름모 [ㄱ(위), ㄴ(왼쪽), ㄷ(아래), ㄹ(오른쪽)]
  const rhombusBy = (half) => [[0, -Math.cos(half * RAD)], [-Math.sin(half * RAD), 0], [0, Math.cos(half * RAD)], [Math.sin(half * RAD), 0]];
  // 대각선의 반쪽 길이가 a, b 인 평행사변형 [ㄱ, ㄴ, ㄷ, ㄹ]
  const paraBy = (a, b) => [G.toward([0, 0], a, 150), G.toward([0, 0], b, 215), G.toward([0, 0], a, 330), G.toward([0, 0], b, 35)];
  // 두 대각선을 그은 사각형 ㄱㄴㄷㄹ과 두 대각선이 만나는 점 ㅁ.
  // o: halves [[꼭짓점 자리, 글]](점 ㅁ에서 그 꼭짓점까지의 선분 한가운데에 적는 길이), busy [틈 번호](ㅁ을 적지 않을 틈: i 는 꼭짓점 i 와 i + 1 사이), more(p, m), names: false
  function crossFig(raw, o) {
    const opt = o || {}, fit = place(raw, opt.box || [4.8, 3.7], opt.names === false ? [0.5, 0.5] : [1.1, 0.95]), p = fit.points, m = meet(p[0], p[2], p[1], p[3]), busy = new Set(opt.busy || []);
    const parts = [G.polygon(p), G.line(p[0], p[2], 'mb-line is-thin'), G.line(p[1], p[3], 'mb-line is-thin')];
    // 반쪽 길이는 선분 위가 아니라 옆에 적는다. 선분을 따라 자리를 옮겨 가며 양옆을 다 재 보고, 다른 선분·다른 글과 가장 멀리 떨어지는 자리를 고른다.
    const segs = [[p[0], p[1]], [p[1], p[2]], [p[2], p[3]], [p[3], p[0]], [p[0], p[2]], [p[1], p[3]]], boxes = [];
    const segGap = (q, [a, b]) => { const r = G.sub(b, a), t = Math.max(0, Math.min(1, G.dot(G.sub(q, a), r) / G.dot(r, r))); return dist(q, [a[0] + r[0] * t, a[1] + r[1] * t]); };
    const boxGap = (c, hw, hh, seg) => {
      for (let k = 0; k <= 16; k += 1) { const q = mid(seg[0], seg[1], k / 16); if (Math.abs(q[0] - c[0]) < hw && Math.abs(q[1] - c[1]) < hh) return 0; }
      return Math.min(...[[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]].map(([x, y]) => segGap([c[0] + x * hw, c[1] + y * hh], seg)));
    };
    (opt.halves || []).forEach(([i, value]) => {
      busy.add(i); busy.add((i + 3) % 4);
      const len = dist(m, p[i]), u = [(p[i][0] - m[0]) / len, (p[i][1] - m[1]) / len], n = [-u[1], u[0]], hw = String(value).length * 0.16, hh = 0.3, away = hw * Math.abs(n[0]) + hh * Math.abs(n[1]) + 0.13;
      let best = null;
      for (const t of [0.3, 0.38, 0.46, 0.54, 0.62, 0.7]) for (const side of [1, -1]) {
        const on = mid(m, p[i], t), c = [on[0] + n[0] * side * away, on[1] + n[1] * side * away];
        const room = Math.min(...segs.filter((_, k) => k !== 4 + (i % 2)).map((seg) => boxGap(c, hw, hh, seg)), ...boxes.map((b) => Math.max(Math.abs(b.c[0] - c[0]) - b.hw - hw, Math.abs(b.c[1] - c[1]) - b.hh - hh)));
        if (!best || room > best.room) best = { room, c };
      }
      boxes.push({ c: best.c, hw, hh });
      parts.push(G.text(best.c, value, 'mb-label is-length'));
    });
    if (opt.more) parts.push(...opt.more(p, m));
    if (opt.names !== false) {
      // ㅁ은 네 선분 사이의 틈 가운데 비어 있고 가장 넓은 곳에 적는다.
      let best = null;
      for (let i = 0; i < 4; i += 1) { const [from, to] = spread(m, p[i], p[(i + 1) % 4]); if (!busy.has(i) && (!best || to - from > best.open)) best = { open: to - from, way: (from + to) / 2 }; }
      parts.push(G.vertexLabels(p, NAMES), G.text(G.toward(m, 0.48, best.way), 'ㅁ'));
    }
    return draw(fit, parts, opt.label);
  }
  const quadFind = (prop) => (d) => {
    const kinds = d.shuffle(['square', 'rect', 'rhombus', 'para', 'trap']), quads = kinds.map((kind) => d.pick(QUADS[kind])), labels = TAGS.slice(0, 5), flags = quads.map(PROPS[prop].test), made = setOptions(d, labels, flags);
    return C(`${PROPS[prop].ask} 사각형을 모두 고른 것은?`, made.options, made.answer, {
      figure: gridGallery(quads, '모눈종이에 그린 사각형 5개. ' + kinds.map((kind, i) => `${TAGS[i]}: ${QUAD_NAME[kind]}`).join(' / ')),
      explain: kinds.map((kind, i) => `${TAGS[i]}는 ${QUAD_NAME[kind]}`).join(', ') + `이다. ${PROPS[prop].who}<br>` + gridGallery(quads, '대각선을 그은 사각형 5개', true),
      facts: { sets: { labels, flags, options: made.sets } }
    });
  };

  // ── 삼각 모눈과 모양 조각 ────────────────────────────────────
  // 모눈의 점 (i, j)의 자리는 가로 i + j / 2, 세로 −j × (√3 / 2)이다. 작은 정삼각형 한 칸은 꼭짓점 셋으로 적는다.
  const S3 = Math.sqrt(3) / 2;
  const up = (i, j) => [[i, j], [i + 1, j], [i, j + 1]];
  const down = (i, j) => [[i + 1, j], [i + 1, j + 1], [i, j + 1]];
  // 칸의 이름표: 세 꼭짓점의 좌표를 더한 값(위로 뾰족한 칸은 3으로 나눈 나머지가 1, 아래로 뾰족한 칸은 2이다)
  const keyOf = (tri) => (tri[0][0] + tri[1][0] + tri[2][0]) + ',' + (tri[0][1] + tri[1][1] + tri[2][1]);
  const pairOf = (key) => key.split(',').map(Number);
  const cellOf = (key) => { const [a, b] = pairOf(key), r = ((a % 3) + 3) % 3; return r === 1 ? up((a - 1) / 3, (b - 1) / 3) : down((a - 2) / 3, (b - 2) / 3); };
  const PIECES = { tri: [up(0, 0)], rhombus: [up(0, 0), down(0, 0)], trap: [up(0, 0), down(0, 0), up(1, 0)], hex: [up(1, 1), up(0, 1), up(1, 0), down(0, 0), down(1, 0), down(0, 1)] };
  const PIECE = { tri: '정삼각형', rhombus: '마름모', trap: '사다리꼴', hex: '정육각형' };
  const AREA = { tri: 1, rhombus: 2, trap: 3, hex: 6 };
  const FILL = { tri: '#bbf7d0', rhombus: '#bfdbfe', trap: '#fecaca', hex: '#fde68a' };
  const SIDES = { tri: 3, rhombus: 4, trap: 4, hex: 6 };
  // 조각을 60°씩 돌린 모양(칸의 이름표 묶음). 모눈의 점 (i, j)를 60° 돌리면 (−j, i + j)가 된다.
  const TURNS = {};
  for (const kind of Object.keys(PIECES)) {
    const seen = new Set();
    let cells = PIECES[kind];
    TURNS[kind] = [];
    for (let k = 0; k < 6; k += 1) {
      const keys = cells.map((tri) => pairOf(keyOf(tri))).sort((x, y) => x[0] - y[0] || x[1] - y[1]), da = Math.floor(keys[0][0] / 3) * 3, db = Math.floor(keys[0][1] / 3) * 3;
      const shape = keys.map(([a, b]) => [a - da, b - db]), name = shape.join(' ');
      if (!seen.has(name)) { seen.add(name); TURNS[kind].push(shape); }
      cells = cells.map((tri) => tri.map(([i, j]) => [-j, i + j]));
    }
  }
  // 칸(cells)을 조각(kinds)으로 빈틈없이 덮는 방법 하나를 찾는다. 없으면 null.
  // d 를 주면 놓아 보는 차례를 섞어 씨앗마다 다른 방법을 찾는다. exact: { 조각: 수 }를 주면 그 조각은 꼭 그 수만큼 쓴다.
  function tiling(cells, kinds, d, exact) {
    const left = new Set(cells.map(keyOf)), out = [], used = {};
    const go = () => {
      if (!left.size) return !exact || Object.keys(exact).every((kind) => (used[kind] || 0) === exact[kind]);
      let first = null;
      for (const key of left) { const [a, b] = pairOf(key); if (!first || b < first[1] || (b === first[1] && a < first[0])) first = [a, b]; }
      for (const kind of (d ? d.shuffle(kinds) : kinds)) {
        if (exact && exact[kind] != null && (used[kind] || 0) >= exact[kind]) continue;
        for (const shape of (d ? d.shuffle(TURNS[kind]) : TURNS[kind])) for (const anchor of shape) {
          const da = first[0] - anchor[0], db = first[1] - anchor[1];
          if (da % 3 !== 0 || db % 3 !== 0) continue;
          const keys = shape.map(([a, b]) => (a + da) + ',' + (b + db));
          if (!keys.every((key) => left.has(key))) continue;
          keys.forEach((key) => left.delete(key)); out.push({ kind, keys }); used[kind] = (used[kind] || 0) + 1;
          if (go()) return true;
          out.pop(); used[kind] -= 1; keys.forEach((key) => left.add(key));
        }
      }
      return false;
    };
    return go() ? out : null;
  }
  // 한 가지 조각만으로 채울 때 드는 조각의 수(채울 수 없으면 0)
  const fillCount = (cells, kind) => { const made = tiling(cells, [kind]); return made ? made.length : 0; };
  // 칸 묶음의 테두리(모눈의 점을 차례로 이은 것). 곧게 이어진 점은 뺀다.
  function outline(cells) {
    const edges = new Map();
    for (const tri of cells) for (let k = 0; k < 3; k += 1) { const p = tri[k], q = tri[(k + 1) % 3], back = q + '>' + p; if (edges.has(back)) edges.delete(back); else edges.set(p + '>' + q, [p, q]); }
    const next = new Map();
    for (const [p, q] of edges.values()) next.set(String(p), q);
    const start = [...edges.values()][0][0], loop = [];
    let at = start;
    do { loop.push(at); at = next.get(String(at)); } while (String(at) !== String(start) && loop.length < 300);
    return loop.filter((p, i) => { const a = loop[(i + loop.length - 1) % loop.length], b = loop[(i + 1) % loop.length]; return (p[0] - a[0]) * (b[1] - p[1]) !== (p[1] - a[1]) * (b[0] - p[0]); });
  }
  const pieceCells = (piece) => piece.keys.map(cellOf);
  // 모양: 큰 정삼각형(한 변 n), 평행사변형(가로 a, 비스듬한 변 b), 사다리꼴(아랫변 base, 높이 h줄), 정육각형(한 변 n), 별
  const triangleOf = (n) => { const out = []; for (let j = 0; j < n; j += 1) for (let i = 0; i < n - j; i += 1) { out.push(up(i, j)); if (i < n - j - 1) out.push(down(i, j)); } return out; };
  const paraOf = (a, b) => { const out = []; for (let j = 0; j < b; j += 1) for (let i = 0; i < a; i += 1) out.push(up(i, j), down(i, j)); return out; };
  const trapOf = (base, h) => triangleOf(base).filter((tri) => tri.every((p) => p[1] <= h));
  const hexOf = (n) => { const out = [], inside = ([i, j]) => Math.max(Math.abs(i - n), Math.abs(j - n), Math.abs(i + j - 2 * n)) <= n; for (let j = 0; j < 2 * n; j += 1) for (let i = 0; i < 2 * n; i += 1) for (const tri of [up(i, j), down(i, j)]) if (tri.every(inside)) out.push(tri); return out; };
  const starOf = () => hexOf(1).concat([down(1, 1), up(0, 2), down(-1, 1), up(0, 0), down(1, -1), up(2, 0)]);
  const TINT = 'rgba(250,204,21,0.2)';
  const rawOf = ([i, j]) => [i + j / 2, -j * S3];
  // 삼각 모눈의 선: 네모 [x0, x1] × [y0, y1] 안에 드는 부분만 세 방향으로 긋는다.
  function gridLines(x0, x1, y0, y1) {
    const out = [], R3 = Math.sqrt(3), reach = Math.max(Math.abs(y0), Math.abs(y1)) / R3 + 1;
    for (let j = Math.ceil(-y1 / S3); j <= Math.floor(-y0 / S3); j += 1) out.push([[x0, -j * S3], [x1, -j * S3]]);
    for (let i = Math.floor(x0 - reach); i <= Math.ceil(x1 + reach); i += 1) {
      // 오른쪽 위로 가는 선: x = i − y / √3,  왼쪽 위로 가는 선: x = i + y / √3
      const a = [Math.max(y0, (i - x1) * R3), Math.min(y1, (i - x0) * R3)], b = [Math.max(y0, (x0 - i) * R3), Math.min(y1, (x1 - i) * R3)];
      if (a[0] < a[1] - 1e-9) out.push([[i - a[0] / R3, a[0]], [i - a[1] / R3, a[1]]]);
      if (b[0] < b[1] - 1e-9) out.push([[i + b[0] / R3, b[0]], [i + b[1] / R3, b[1]]]);
    }
    return out;
  }
  // 삼각 모눈 위의 그림. shapes: [{ cells(칸 묶음) | raw(자리를 바로 적은 점들), at: [i, j](모눈 칸만큼 옮긴다), shift: [가로, 세로](모눈과 관계없이 옮긴다),
  //   fill, over(위에 적는 글), under(아랫변 밑에 적는 글) }], o: { grid, unit, scale, label }
  const shapePoints = (s) => { const at = s.at || [0, 0], shift = s.shift || [0, 0]; return (s.raw || outline(s.cells).map(([i, j]) => rawOf([i + at[0], j + at[1]]))).map(([x, y]) => [x + shift[0], y + shift[1]]); };
  const spanOf = (shapes) => { const xs = [].concat(...shapes.map(shapePoints)).map((q) => q[0]); return Math.max(...xs) - Math.min(...xs) + 0.9; };
  // 그림의 가로가 휴대폰 카드 너비를 넘지 않는 가장 큰 칸 크기. 그림 여럿을 넘기면 가장 넓은 그림에 맞춘다(그림끼리 칸의 크기가 같아진다).
  const unitFor = (...rows) => Math.max(0.9, Math.min(1.5, 11.6 / Math.max(...rows.map(spanOf))));
  function latticeFig(shapes, o) {
    const opt = o || {}, u = opt.unit || unitFor(shapes);
    const drawn = shapes.map((s) => {
      const pts = shapePoints(s), xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]), low = Math.max(...ys), base = pts.filter((q) => Math.abs(q[1] - low) < 1e-6).map((q) => q[0]);
      return { s, pts, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: low, baseMid: (Math.min(...base) + Math.max(...base)) / 2 };
    });
    const m = 0.45, top = drawn.some((it) => it.s.over) ? 0.55 : 0, bottom = drawn.some((it) => it.s.under) ? 0.55 : 0;
    const x0 = Math.min(...drawn.map((it) => it.x0)) - m, x1 = Math.max(...drawn.map((it) => it.x1)) + m, y0 = Math.min(...drawn.map((it) => it.y0)) - m - top, y1 = Math.max(...drawn.map((it) => it.y1)) + m + bottom;
    const to = ([x, y]) => [(x - x0) * u, (y - y0) * u], parts = [];
    // 모눈의 선은 칸을 셀 수 있게 조금 짙게 긋는다.
    if (opt.grid) for (const [a, b] of gridLines(x0, x1, y0 + top, y1 - bottom)) parts.push(G.line(to(a), to(b), 'mb-gridline').replace('<line ', '<line style="stroke:#a3b1c2;stroke-width:0.9" '));
    drawn.forEach((it) => {
      parts.push(G.polygon(it.pts.map(to)).replace('class="mb-poly"', `class="mb-poly" style="fill:${it.s.fill || TINT}"`));
      if (it.s.over) parts.push(halo(G.text(to([(it.x0 + it.x1) / 2, it.y0 - 0.42]), it.s.over, TAGS.includes(it.s.over) ? 'mb-label' : 'mb-label is-small'), '#fff'));
      if (it.s.under) parts.push(G.text(to([it.baseMid, it.y1 + 0.42]), it.s.under, 'mb-label is-length'));
    });
    return G.board((x1 - x0) * u, (y1 - y0) * u, parts, { grid: false, scale: Math.min(opt.scale || 1, 296 / (32 + (x1 - x0) * u * 22)), label: opt.label });
  }
  // 조각으로 덮은 모양(조각마다 색을 달리 칠한다)
  const tiled = (pieces, o) => latticeFig(pieces.map((piece) => ({ cells: pieceCells(piece), fill: FILL[piece.kind] })), o);
  // 모양 조각을 한 줄로 늘어놓는다. 모눈 위에 놓을 때(grid)는 칸에 맞추어, 아니면 고르게 띄워 놓는다. over: 조각 위에 적을 글
  function pieceRow(kinds, o) {
    const opt = o || {}, shapes = [];
    let cursor = 0;
    kinds.forEach((kind, i) => {
      const cells = PIECES[kind], xs = outline(cells).map((p) => rawOf(p)[0]), w = Math.max(...xs) - Math.min(...xs), start = opt.grid ? Math.ceil(cursor - Math.min(...xs) - 1e-9) : cursor - Math.min(...xs);
      shapes.push(Object.assign({ cells, fill: FILL[kind], over: opt.over ? opt.over[i] : PIECE[kind] }, opt.grid ? { at: [start, 0] } : { shift: [start, 0] }));
      cursor = start + Math.min(...xs) + w + (opt.gap || 0.75);
    });
    return shapes;
  }
  const piecesFig = (kinds, o) => latticeFig(pieceRow(kinds, o), Object.assign({ label: '모양 조각: ' + kinds.map((kind) => PIECE[kind]).join(', ') }, o || {}));
  // 조각 보기와 채울 모양(테두리만 그린다)을 칸의 크기가 같은 삼각 모눈 위에 따로 그린다. 조각이 몇 칸짜리인지 모눈에서 읽을 수 있다.
  function withPieces(kinds, cells, over, said) {
    const row = pieceRow(kinds, { grid: true, gap: 0.6 }), target = [{ cells, over }], unit = unitFor(row, target);
    return latticeFig(row, { grid: true, unit, label: '삼각 모눈 위에 그린 모양 조각. ' + kinds.map((kind) => `${PIECE[kind]} 조각은 작은 정삼각형 ${AREA[kind]}칸`).join(', ') }) + latticeFig(target, { grid: true, unit, label: said });
  }
  // 모양 조각으로 만든 모양: 조각 kinds 가 모두 쓰이고 조각이 너무 많지 않게, 씨앗마다 다른 방법으로 덮는다.
  const DESIGNS = [() => triangleOf(4), () => paraOf(4, 2), () => trapOf(5, 2), starOf, () => paraOf(3, 2), () => trapOf(4, 2), () => hexOf(2)];
  function design(d, kinds, ok) {
    return d.until(() => { const cells = d.pick(DESIGNS)(), pieces = tiling(cells, kinds, d); return pieces && { cells, pieces, count: (kind) => pieces.filter((piece) => piece.kind === kind).length }; },
      (made) => made && kinds.every((kind) => made.count(kind) >= 1) && made.pieces.length >= 4 && made.pieces.length <= 9 && made.count('tri') <= 6 && (!ok || ok(made)));
  }
  const usedSaid = (made) => `모양 조각 ${made.pieces.length}개로 만든 모양. ` + Object.keys(PIECE).filter((kind) => made.count(kind)).map((kind) => `${PIECE[kind]} ${made.count(kind)}개`).join(', ');
  // 채울 모양(삼각 모눈 위에 테두리만 그린다)
  const TARGETS = [
    { word: '정삼각형', cells: triangleOf(2) }, { word: '정삼각형', cells: triangleOf(3) }, { word: '평행사변형', cells: paraOf(2, 1) }, { word: '평행사변형', cells: paraOf(3, 1) },
    { word: '마름모', cells: paraOf(2, 2) }, { word: '평행사변형', cells: paraOf(3, 2) }, { word: '사다리꼴', cells: trapOf(3, 1) }, { word: '사다리꼴', cells: trapOf(4, 2) }, { word: '정육각형', cells: hexOf(1) }
  ];
  const TANGRAM = [[[0, 0], [8, 0], [4, 4]], [[0, 0], [4, 4], [0, 8]], [[4, 4], [6, 2], [8, 4], [6, 6]], [[8, 0], [8, 4], [6, 2]], [[4, 4], [6, 6], [2, 6]], [[0, 8], [2, 6], [6, 6], [4, 8]], [[8, 4], [8, 8], [4, 8]]];

  B.addTypes('4-2-4', 'quad', [
    T('quad-equal', '두 대각선의 길이가 같은 사각형 고르기', '①58 ②53 ③50·55 심47', quadFind('equal')),
    T('quad-perp', '두 대각선이 수직으로 만나는 사각형 고르기', '①59 ②54 ③51·55 심47', quadFind('perp')),
    T('quad-bisect', '한 대각선이 다른 대각선을 똑같이 둘로 나누는 사각형 고르기', '②55 ③52·55 심47', quadFind('bisect')),
    T('quad-names', '이름을 보고 대각선의 성질에 맞는 사각형 고르기', '③53', (d) => {
      const prop = d.pick(['equal', 'perp']), kinds = d.shuffle(['para', 'rhombus', 'rect', 'square']), flags = kinds.map((kind) => holds(kind, prop)), made = setOptions(d, LABELS, flags);
      return C(`${PROPS[prop].ask} 사각형을 모두 고른 것은?`, made.options, made.answer, {
        figure: tagged(kinds.map((kind) => QUAD_NAME[kind])), explain: PROPS[prop].who + (prop === 'equal' ? ' 평행사변형과 마름모는 두 대각선의 길이가 다를 수 있다.' : ' 평행사변형과 직사각형의 두 대각선은 수직으로 만나지 않을 수 있다.'),
        facts: { sets: { labels: LABELS, flags, options: made.sets } }
      });
    }),
    T('quad-both', '길이도 같고 수직으로도 만나는 사각형', '①60 ②56 ③54 심48', (d) => {
      const kinds = d.shuffle(['square'].concat(d.shuffle(['para', 'rhombus', 'rect', 'trap']).slice(0, 3))), truth = kinds.map((kind) => holds(kind, 'equal') && holds(kind, 'perp'));
      return C('두 대각선의 길이가 같고, 두 대각선이 서로 수직으로 만나는 사각형은?', kinds.map((kind) => QUAD_NAME[kind]), truth.indexOf(true), {
        explain: '두 대각선의 길이가 같은 사각형은 직사각형과 정사각형이고, 두 대각선이 서로 수직으로 만나는 사각형은 마름모와 정사각형이다. 두 가지에 모두 맞는 것은 정사각형이다.',
        facts: { truth, want: true }
      });
    }),
    T('quad-say', '사각형의 대각선에 대한 설명', '①61 ②57', (d) => {
      const all = [];
      for (const kind of ['para', 'rhombus', 'rect', 'square']) for (const prop of ['equal', 'perp', 'bisect']) all.push([kind, prop]);
      const ok = ([kind, prop]) => holds(kind, prop), wrong = d.pick(all.filter((row) => !ok(row))), rows = d.shuffle(d.shuffle(all.filter(ok)).slice(0, 3).concat([wrong]));
      return C('사각형의 대각선에 대한 설명으로 옳지 않은 것은?', rows.map(([kind, prop]) => `${josa(QUAD_NAME[kind], '은/는')} ${PROPS[prop].say}.`), rows.findIndex((row) => !ok(row)), {
        explain: `${PROPS[wrong[1]].who} ${josa(QUAD_NAME[wrong[0]], '은/는')} 그렇지 않다.`, facts: { truth: rows.map(ok), want: false }
      });
    }),
    T('quad-rect-other', '직사각형의 다른 대각선의 길이', '①62 ②60 ③56 심51', (d) => {
      // 변의 길이도 함께 준다(변과 대각선을 가려 읽는다). 그림은 적힌 수대로 그린다.
      const [a, b, c] = d.pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [10, 24, 26]]);
      return N(`직사각형 ㄱㄴㄷㄹ에서 변 ㄱㄴ의 길이는 ${a} cm, 선분 ㄱㄷ의 길이는 ${c} cm이다. 선분 ㄴㄹ의 길이는 몇 cm인가?`, c, {
        unit: 'cm', figure: crossFig([[0, 0], [0, a], [b, a], [b, 0]], { box: [5.4, 3.4], label: '두 대각선 ㄱㄷ, ㄴㄹ을 그은 직사각형 ㄱㄴㄷㄹ. 두 대각선이 만나는 점 ㅁ' }),
        explain: `직사각형의 두 대각선은 길이가 같다. 선분 ㄱㄷ과 선분 ㄴㄹ이 두 대각선이므로 선분 ㄴㄹ의 길이도 ${c} cm이다.`, facts: { calc: [[String(c), 0]] }
      });
    }),
    T('quad-angle', '두 대각선이 만나 이루는 각', '①63 ②58 ③59 심50', (d) => {
      // 직각 표시를 하지 않고 호로 그린다(직각인지를 묻는다).
      const square = d.bool(), raw = square ? [[0, 0], [0, 1], [1, 1], [1, 0]] : rhombusBy(d.pick([40, 50])), gap = d.int(0, 3), word = square ? '정사각형' : '마름모';
      const mark = (p, m) => { const [from, to] = spread(m, p[gap], p[(gap + 1) % 4]); return [G.arc(m, from, to, 0.38), G.text(G.toward(m, 0.86, (from + to) / 2), '㉠', 'mb-label is-length')]; };
      return N(`${word} ㄱㄴㄷㄹ에 두 대각선을 그었다. ㉠의 크기는 몇 도인가?`, 90, {
        unit: '°', figure: crossFig(raw, { box: [4.6, 4], busy: [gap], more: mark, label: `두 대각선을 그은 ${word} ㄱㄴㄷㄹ. 두 대각선이 만나 이루는 각이 ㉠` }),
        explain: `${josa(word, '은/는')} 두 대각선이 서로 수직으로 만난다. 그러므로 ㉠ = 90°이다.`, facts: { calc: [['90', 0]], unseen: [90] }
      });
    }),
    T('quad-half', '평행사변형의 대각선의 길이', '②59 ③58 심51', (d) => {
      // 반쪽 길이를 둘 다 적는다(어느 반쪽이 묻는 대각선의 것인지 가려 읽는다).
      const [a, b] = d.until(() => [d.int(4, 12), d.int(4, 12)], ([x, y]) => x !== y && x / y > 0.6 && x / y < 1.7), first = d.bool(), v = first ? a : b;
      return N(`평행사변형 ㄱㄴㄷㄹ에서 선분 ${first ? 'ㄱㄷ' : 'ㄴㄹ'}의 길이는 몇 cm인가?`, v * 2, {
        unit: 'cm', figure: crossFig(paraBy(a, b), { box: [7.6, 5.2], halves: [[0, cm(a)], [1, cm(b)]], label: `두 대각선을 그은 평행사변형 ㄱㄴㄷㄹ. 두 대각선이 만나는 점 ㅁ. 선분 ㄱㅁ의 길이 ${a} cm, 선분 ㄴㅁ의 길이 ${b} cm` }),
        explain: `평행사변형의 한 대각선은 다른 대각선을 똑같이 둘로 나눈다. 선분 ${first ? 'ㄱㅁ과 선분 ㅁㄷ' : 'ㄴㅁ과 선분 ㅁㄹ'}의 길이가 같으므로 ${v} × 2 = ${v * 2}(cm)이다.`,
        facts: { calc: [[`${v}*2`, 0]], unseen: [2] }
      });
    }),
    T('quad-square-half', '두 성질을 함께 써서 대각선의 반쪽 길이 구하기', '②61 심51', (d) => {
      const square = d.bool(), h = d.int(3, 12), word = square ? '정사각형' : '직사각형';
      return N(`${word} ㄱㄴㄷㄹ에서 두 대각선이 만나는 점이 ㅁ이다. 선분 ㄱㄷ의 길이가 ${h * 2} cm일 때, 선분 ㄴㅁ의 길이는 몇 cm인가?`, h, {
        unit: 'cm', figure: crossFig(square ? [[0, 0], [0, 1], [1, 1], [1, 0]] : rectBy(d.pick([110, 120, 125])), { box: [4.8, 3.6], label: `두 대각선을 그은 ${word} ㄱㄴㄷㄹ. 두 대각선이 만나는 점 ㅁ` }),
        explain: `${word}의 두 대각선은 길이가 같으므로 선분 ㄴㄹ의 길이도 ${h * 2} cm이다. 한 대각선은 다른 대각선을 똑같이 둘로 나누므로 선분 ㄴㅁ의 길이는 ${h * 2} ÷ 2 = ${h}(cm)이다.`,
        facts: { calc: [[`${h * 2}/2`, 0]], unseen: [2] }
      });
    }),
    T('quad-rect-sum', '두 대각선의 길이의 합으로 한 대각선의 길이 구하기', '③57', (d) => {
      const c = d.int(6, 24);
      return N(`직사각형에 두 대각선을 그었다. 두 대각선의 길이의 합이 ${c * 2} cm일 때, 한 대각선의 길이는 몇 cm인가?`, c, {
        unit: 'cm', explain: `직사각형의 두 대각선은 길이가 같다. 길이가 같은 두 선분의 합이 ${c * 2} cm이므로 한 대각선의 길이는 ${c * 2} ÷ 2 = ${c}(cm)이다.`,
        facts: { calc: [[`${c * 2}/2`, 0]], unseen: [2] }
      });
    }),
    T('quad-paths', '대각선을 따라 낸 두 길의 길이', '②62 심52', (d) => {
      const [a, b] = d.until(() => [d.int(4, 12), d.int(4, 12)], ([x, y]) => x !== y && x / y > 0.7 && x / y < 1.45);
      return N('마름모 모양의 꽃밭에 두 대각선을 따라 곧은 길을 2개 냈다. 두 길이 만나는 곳에서 꽃밭의 꼭짓점까지의 거리가 그림과 같을 때, 두 길의 길이의 합은 몇 m인가?', a * 2 + b * 2, {
        unit: 'm', figure: crossFig([[0, -a], [-b, 0], [0, a], [b, 0]], { names: false, box: [7.4, 6], halves: [[0, a + ' m'], [3, b + ' m']], label: `두 대각선을 그은 마름모. 두 대각선이 만나는 곳에서 위쪽 꼭짓점까지 ${a} m, 오른쪽 꼭짓점까지 ${b} m` }),
        explain: `마름모의 한 대각선은 다른 대각선을 똑같이 둘로 나눈다. 두 길의 길이는 ${a} × 2 = ${a * 2}(m), ${b} × 2 = ${b * 2}(m)이므로 합은 ${a * 2} + ${b * 2} = ${a * 2 + b * 2}(m)이다.`,
        facts: { calc: [[`${a}*2+${b}*2`, 0]], unseen: [2] }
      });
    }),
    T('quad-claims', '그림에서 대각선의 성질 가리기', '①61 ②57 심47', (d) => {
      // 설명 넷은 같고 사각형에 따라 참·거짓이 달라진다(그림의 좌표로 셈한다).
      // 직사각형에서는 틀린 설명(수직)을, 평행사변형에서는 옳은 설명(서로를 똑같이 둘로 나눈다)을 고른다.
      const rect = d.bool(), raw = rect ? rectBy(d.pick([110, 125, 130, 70])) : paraBy(d.pick([1.5, 1.7]), 1), m = meet(raw[0], raw[2], raw[1], raw[3]), same = (x, y) => Math.abs(x - y) < 1e-6;
      const rows = d.shuffle([
        ['선분 ㄱㄷ과 선분 ㄴㄹ의 길이는 같다.', same(dist(raw[0], raw[2]), dist(raw[1], raw[3]))],
        ['선분 ㄱㅁ과 선분 ㄷㅁ의 길이는 같다.', same(dist(raw[0], m), dist(raw[2], m))],
        ['선분 ㄱㅁ과 선분 ㄴㅁ의 길이는 같다.', same(dist(raw[0], m), dist(raw[1], m))],
        ['각 ㄱㅁㄴ의 크기는 90°이다.', same(G.dot(G.sub(raw[0], m), G.sub(raw[1], m)), 0)]
      ]);
      return C(`${rect ? '직사각형' : '평행사변형'} ㄱㄴㄷㄹ에 두 대각선을 그었다. 두 대각선이 만나는 점이 ㅁ일 때, 옳${rect ? '지 않은' : '은'} 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok !== rect), {
        figure: crossFig(raw, { label: `두 대각선을 그은 ${rect ? '직사각형' : '평행사변형'} ㄱㄴㄷㄹ. 두 대각선이 만나는 점 ㅁ` }),
        explain: rect ? '직사각형의 두 대각선은 길이가 같고 서로를 똑같이 둘로 나누므로 선분 ㄱㅁ, ㄴㅁ, ㄷㅁ, ㄹㅁ의 길이가 모두 같다. 그러나 두 대각선이 수직으로 만나는 것은 마름모와 정사각형이다.' : '평행사변형의 한 대각선은 다른 대각선을 똑같이 둘로 나누므로 선분 ㄱㅁ과 선분 ㄷㅁ의 길이가 같다. 두 대각선의 길이가 같거나 수직으로 만나는 것은 아니다.',
        facts: { truth: rows.map(([, ok]) => ok), want: !rect }
      });
    }),
    T('quad-small-squares', '작은 정사각형의 대각선으로 큰 정사각형의 대각선 구하기', '①64', (d) => {
      const v = d.int(3, 12), parts = [G.polygon([[0, 0], [0, 6], [6, 6], [6, 0]]), G.line([3, 0], [3, 6]), G.line([0, 3], [6, 3]), G.line([0, 0], [3, 3], 'mb-line is-thin'), G.text([1.95, 0.8], cm(v), 'mb-label is-length')];
      return N(`크기가 같은 작은 정사각형 4개를 이어 붙여 큰 정사각형을 만들었다. 작은 정사각형의 한 대각선의 길이가 ${v} cm일 때, 큰 정사각형의 두 대각선의 길이의 합은 몇 cm인가?`, v * 4, {
        unit: 'cm', figure: G.board(6, 6, parts, { grid: false, scale: 1, label: `작은 정사각형 4개를 두 줄로 이어 붙인 큰 정사각형. 작은 정사각형 하나에 그은 대각선의 길이 ${v} cm` }),
        explain: `큰 정사각형의 대각선은 작은 정사각형의 대각선 2개를 곧게 이은 것이므로 ${v} × 2 = ${v * 2}(cm)이다. 정사각형의 두 대각선은 길이가 같으므로 합은 ${v * 2} × 2 = ${v * 4}(cm)이다.`,
        facts: { calc: [[`${v}*2*2`, 0]], unseen: [2] }
      });
    })
  ]);

  B.addTypes('4-2-4', 'make', [
    T('make-used', '모양을 만드는 데 쓴 다각형', '①66 ②12·64 ③60 심6·58', (d) => {
      const kinds = d.pick([['tri', 'rhombus'], ['tri', 'hex'], ['rhombus', 'hex'], ['tri', 'trap'], ['tri', 'trap', 'hex'], ['tri', 'rhombus', 'trap'], ['trap', 'hex']]), made = design(d, kinds);
      const labels = ['삼각형', '사각형', '오각형', '육각형'], flags = [3, 4, 5, 6].map((n) => made.pieces.some((piece) => SIDES[piece.kind] === n)), options = setOptions(d, labels, flags);
      return C('모양 조각으로 다음과 같은 모양을 만들었다. 모양을 만드는 데 쓴 다각형을 모두 고른 것은?', options.options, options.answer, {
        figure: tiled(made.pieces, { label: usedSaid(made) }),
        explain: kinds.map((kind) => `${PIECE[kind]} 조각은 ${NAME[SIDES[kind]]}`).join(', ') + '이다. 변의 수를 세어 이름을 정한다.',
        facts: { sets: { labels, flags, options: options.sets } }
      });
    }),
    T('make-used-regular', '모양을 만드는 데 쓴 정다각형', '①33·66 ③24·60 심18', (d) => {
      // 마름모 조각을 꼭 섞는다(네 변의 길이가 같아 정사각형으로 잘못 보기 쉽다).
      const kinds = d.pick([['tri', 'rhombus'], ['rhombus', 'hex'], ['tri', 'rhombus', 'hex'], ['tri', 'rhombus', 'trap'], ['rhombus', 'trap', 'hex']]), made = design(d, kinds);
      // 보기: 맞는 묶음 / 마름모 조각을 정사각형으로 본 묶음 / 정사각형만 / 정삼각형·정육각형 가운데 하나를 더하거나 뺀 묶음
      const labels = ['정삼각형', '정사각형', '정오각형', '정육각형'], flags = [made.count('tri') > 0, false, false, made.count('hex') > 0], right = labels.filter((_, i) => flags[i]);
      const other = right.length === 2 ? ['정삼각형'] : ['정삼각형', '정육각형'], sets = d.shuffle([right, labels.filter((word) => right.includes(word) || word === '정사각형'), ['정사각형'], other]);
      const options = { options: sets.map((set) => set.join(', ')), answer: sets.findIndex((set) => set.join() === right.join()), sets };
      return C('모양 조각으로 다음과 같은 모양을 만들었다. 쓴 조각 가운데 정다각형을 모두 고른 것은?', options.options, options.answer, {
        figure: tiled(made.pieces, { label: usedSaid(made) }),
        explain: `쓴 조각은 ${kinds.map((kind) => PIECE[kind]).join(', ')}이다. 마름모 조각은 네 변의 길이는 같지만 네 각의 크기가 같지 않으므로 정다각형이 아니다.${kinds.includes('trap') ? ' 사다리꼴 조각도 변의 길이와 각의 크기가 같지 않다.' : ''}`,
        facts: { sets: { labels, flags, options: options.sets } }
      });
    }),
    T('make-unused', '모양을 만드는 데 쓰지 않은 조각', '①67 심58', (d) => {
      const all = d.shuffle(['tri', 'rhombus', 'trap', 'hex']), kinds = all.slice(0, 3), made = design(d, kinds), list = d.shuffle(all);
      return C('모양 조각으로 다음과 같은 모양을 만들었다. 모양을 만드는 데 쓰지 않은 조각은?', list.map((kind) => PIECE[kind] + ' 조각'), list.indexOf(all[3]), {
        figure: tiled(made.pieces, { label: usedSaid(made) }),
        explain: `쓴 조각은 ${kinds.map((kind) => `${PIECE[kind]} ${made.count(kind)}개`).join(', ')}이다. ${PIECE[all[3]]} 조각은 쓰지 않았다.`,
        facts: { kindPick: { kinds: list.map((kind) => (made.count(kind) ? 'used-' + kind : 'unused')), target: 'unused' } }
      });
    }),
    T('make-count', '쓰인 조각의 수 세기', '①68 ②65 ③61 심58', (d) => {
      // 마름모 조각과 사다리꼴 조각은 모두 사각형으로 센다.
      const quads = d.pick([['rhombus'], ['trap'], ['rhombus', 'trap']]), made = design(d, ['tri'].concat(quads, ['hex'])), four = quads.map((kind) => made.count(kind));
      return M('모양 조각으로 다음과 같은 모양을 만들었다. 삼각형, 사각형, 육각형 모양 조각을 각각 몇 개 썼는가?', [{ label: '삼각형', answer: made.count('tri'), unit: '개' }, { label: '사각형', answer: four.reduce((s, v) => s + v, 0), unit: '개' }, { label: '육각형', answer: made.count('hex'), unit: '개' }], {
        figure: tiled(made.pieces, { label: usedSaid(made) }),
        explain: `정삼각형 조각이 ${made.count('tri')}개, ${quads.map((kind, i) => `${PIECE[kind]} 조각이 ${four[i]}개`).join(', ')}, 정육각형 조각이 ${made.count('hex')}개이다.${quads.length > 1 ? ` 마름모와 사다리꼴은 모두 사각형이므로 사각형 조각은 ${four.join(' + ')} = ${four[0] + four[1]}(개)이다.` : ` ${PIECE[quads[0]]} 조각이 사각형이다.`}`,
        facts: { calc: [[String(made.pieces.filter((piece) => piece.kind === 'tri').length), 0], [four.join('+'), 1], [String(made.pieces.filter((piece) => piece.kind === 'hex').length), 2]] }
      });
    }),
    T('make-talk', '만든 모양에 대한 설명', '③62 심58', (d) => {
      const kinds = d.pick([['tri', 'rhombus', 'hex'], ['tri', 'trap', 'hex'], ['tri', 'rhombus', 'trap']]), made = design(d, kinds), total = made.pieces.length, slip = d.pick(['total', 'kinds', 'tri', 'hex']);
      const saidTotal = slip === 'total' ? total + 1 : total, saidKinds = slip === 'kinds' ? kinds.length - 1 : kinds.length, saidTri = slip === 'tri' ? made.count('tri') + 1 : made.count('tri'), noHex = slip === 'hex' ? made.count('hex') > 0 : made.count('hex') === 0;
      const rows = d.shuffle([
        [`모양 조각을 모두 ${saidTotal}개 썼다.`, saidTotal === total],
        [`모양 조각을 ${saidKinds}가지 썼다.`, saidKinds === kinds.filter((kind) => made.count(kind)).length],
        [`정삼각형 조각을 ${saidTri}개 썼다.`, saidTri === made.count('tri')],
        [noHex ? '정육각형 조각은 쓰지 않았다.' : '정육각형 조각을 썼다.', noHex === (made.count('hex') === 0)]
      ]);
      return C('모양 조각으로 다음과 같은 모양을 만들었다. 만든 모양에 대한 설명으로 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        figure: tiled(made.pieces, { label: usedSaid(made) }),
        explain: `쓴 조각은 ${kinds.map((kind) => `${PIECE[kind]} ${made.count(kind)}개`).join(', ')}로, 모두 ${kinds.length}가지 ${total}개이다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('make-sort', '모양 조각을 다각형의 이름으로 나누기', '①69', (d) => {
      const thin = [[0, 0], [1, 0], [1 + Math.cos(30 * RAD), -Math.sin(30 * RAD)], [Math.cos(30 * RAD), -Math.sin(30 * RAD)]], wide = [[0, 0], [1, 0], [1.5, -S3], [0.5, -S3]];
      const items = d.shuffle([{ points: regular(3), word: '정삼각형' }, { points: regular(4), word: '정사각형' }, { points: wide, word: '마름모' }, { points: thin, word: '마름모' }, { points: [[0, 0], [2, 0], [1.5, -S3], [0.5, -S3]], word: '사다리꼴' }, { points: regular(6), word: '정육각형' }]);
      const n = d.pick([4, 4, 3, 6]), flags = items.map((item) => item.points.length === n), made = setOptions(d, TAGS, flags);
      return C(`모양 조각 가운데 ${NAME[n]}인 것을 모두 고른 것은?`, made.options, made.answer, {
        figure: gallery(items, { label: '모양 조각 6개. ' + items.map((item, i) => `${TAGS[i]}: ${item.word}`).join(' / ') }),
        explain: items.map((item, i) => `${TAGS[i]}는 변이 ${item.points.length}개`).join(', ') + `이다. 변이 ${n}개인 조각이 ${NAME[n]}이다.`,
        facts: { sets: { labels: TAGS, flags, options: made.sets } }
      });
    }),
    T('make-hexagon', '한 가지 조각으로 정육각형 조각 만들기', '①79 ②66 ③64 심59', () => {
      const cells = PIECES.hex, counts = ['tri', 'rhombus', 'trap'].map((kind) => fillCount(cells, kind));
      return M('한 가지 모양 조각만 여러 개 써서 정육각형 모양 조각과 똑같은 모양을 만들려고 한다. 정삼각형, 마름모, 사다리꼴 모양 조각은 각각 몇 개 필요한가?', ['tri', 'rhombus', 'trap'].map((kind, i) => ({ label: PIECE[kind], answer: counts[i], unit: '개' })), {
        figure: piecesFig(['tri', 'rhombus', 'trap', 'hex']),
        explain: '정육각형 조각은 정삼각형 조각 6개, 마름모 조각 3개, 사다리꼴 조각 2개로 만들 수 있다.<br>' + ['tri', 'rhombus', 'trap'].map((kind) => tiled(tiling(cells, [kind]), { scale: 0.8, label: `${PIECE[kind]} 조각으로 만든 정육각형` })).join(''),
        facts: { calc: [['6/1', 0], ['6/2', 1], ['6/3', 2]], unseen: [6, 1, 2, 3] }
      });
    }),
    T('make-many', '조각 여러 개를 만드는 데 드는 작은 조각의 수', '①74 ②66 심59·61', (d) => {
      const [small, big] = d.pick([['tri', 'trap'], ['tri', 'rhombus'], ['tri', 'hex'], ['rhombus', 'hex'], ['trap', 'hex']]), per = fillCount(PIECES[big], small), k = d.int(2, 5);
      return N(`${PIECE[small]} 모양 조각을 여러 개 써서 ${PIECE[big]} 모양 조각 ${k}개와 똑같은 모양을 만들려고 한다. ${PIECE[small]} 모양 조각은 모두 몇 개 필요한가?`, per * k, {
        unit: '개', figure: piecesFig([small, big]),
        explain: `${PIECE[big]} 조각 1개는 ${PIECE[small]} 조각 ${per}개로 만들 수 있다. ${per} × ${k} = ${per * k}(개)<br>` + tiled(tiling(PIECES[big], [small]), { scale: 0.8, label: `${PIECE[small]} 조각으로 만든 ${PIECE[big]}` }),
        facts: { calc: [[`${AREA[big]}/${AREA[small]}*${k}`, 0]], unseen: [AREA[big], AREA[small]] }
      });
    }),
    T('make-relations', '모양 조각 사이의 관계', '①71', (d) => {
      // [작은 조각, 개수, 큰 조각]. 참·거짓은 큰 조각을 작은 조각만으로 덮어 보아 정한다.
      const order = ['tri', 'rhombus', 'trap', 'hex'], tag = (kind) => TAGS[order.indexOf(kind)], holdsFor = ([small, k, big]) => fillCount(PIECES[big], small) === k;
      // 틀린 설명과 같은 두 조각을 말하는 옳은 설명은 함께 내지 않는다(둘 가운데 하나가 틀린 것이 드러난다).
      const wrong = d.pick([['tri', 2, 'trap'], ['rhombus', 2, 'hex'], ['trap', 3, 'hex'], ['tri', 3, 'rhombus'], ['tri', 4, 'hex']]);
      const rows = d.shuffle(d.shuffle([['tri', 2, 'rhombus'], ['tri', 3, 'trap'], ['tri', 6, 'hex'], ['rhombus', 3, 'hex'], ['trap', 2, 'hex']].filter(([small, , big]) => small !== wrong[0] || big !== wrong[2])).slice(0, 3).concat([wrong]));
      return C('모양 조각 가, 나, 다, 라에 대한 설명으로 옳지 않은 것은?', rows.map(([small, k, big]) => `${tag(small)} 조각 ${k}개로 ${tag(big)} 조각과 똑같은 모양을 만들 수 있다.`), rows.findIndex((row) => !holdsFor(row)), {
        figure: piecesFig(order, { over: TAGS, label: '모양 조각 4개. 가: 정삼각형, 나: 마름모, 다: 사다리꼴, 라: 정육각형' }),
        explain: `${tag(wrong[2])} 조각은 ${tag(wrong[0])} 조각 ${fillCount(PIECES[wrong[2]], wrong[0])}개로 만들 수 있다. 가 조각 2개로 나, 3개로 다, 6개로 라를 만들 수 있고, 나 조각 3개나 다 조각 2개로도 라를 만들 수 있다.`,
        facts: { truth: rows.map(holdsFor), want: false }
      });
    }),
    T('make-cannot', '정삼각형 조각만으로 만들 수 없는 도형', '①72 심62', (d) => {
      // 삼각 모눈 위의 모양은 정삼각형 조각으로 덮어 보아 정한다. 정사각형·직사각형은 직각이 있어 삼각 모눈 위에 놓이지 않는다.
      const can = { 마름모: paraOf(1, 1), 사다리꼴: trapOf(2, 1), 평행사변형: paraOf(2, 1), 정육각형: hexOf(1), '더 큰 정삼각형': triangleOf(2) }, cannot = d.pick(['정사각형', '직사각형']);
      const list = d.shuffle(d.shuffle(Object.keys(can)).slice(0, 3).concat([cannot])), truth = list.map((word) => Boolean(can[word]) && fillCount(can[word], 'tri') > 0);
      return C('정삼각형 모양 조각만 여러 개 써서 만들 수 없는 도형은?', list, truth.indexOf(false), {
        explain: `정삼각형의 한 각의 크기는 60°이다. 정삼각형 조각을 빈틈없이 이어 붙이면 각의 크기가 60°, 120°, 180° …인 모양만 생기므로, 한 각이 90°인 ${cannot}은 만들 수 없다.`,
        facts: { truth, want: false }
      });
    }),
    T('make-tangram', '칠교판에 없는 도형', '①70', (d) => {
      const flip = d.bool(), pieces = TANGRAM.map((points) => points.map(([x, y]) => (flip ? [8 - x, y] : [x, y]))), len = (p, q) => G.len2(G.sub(p, q));
      const has = {
        정삼각형: pieces.some((p) => p.length === 3 && len(p[0], p[1]) === len(p[1], p[2]) && len(p[1], p[2]) === len(p[0], p[2])),
        직각삼각형: pieces.some((p) => G.isRightTriangle(p)),
        이등변삼각형: pieces.some((p) => p.length === 3 && new Set([len(p[0], p[1]), len(p[1], p[2]), len(p[0], p[2])]).size === 2),
        정사각형: pieces.some((p) => G.isSquare(p)),
        평행사변형: pieces.some((p) => p.length === 4 && !G.isRectangle(p) && G.cross(G.sub(p[1], p[0]), G.sub(p[2], p[3])) === 0 && G.cross(G.sub(p[2], p[1]), G.sub(p[3], p[0])) === 0)
      };
      const list = d.shuffle(['정삼각형', d.pick(['직각삼각형', '이등변삼각형']), '정사각형', '평행사변형']);
      return C('칠교판의 조각 7개 가운데에서 찾을 수 없는 도형은?', list, list.indexOf('정삼각형'), {
        figure: G.board(8, 8, pieces.map((points) => G.polygon(points)), { grid: false, scale: 1.05, label: '칠교판. 크고 작은 삼각형 5개와 사각형 2개' }),
        explain: '칠교판의 삼각형 조각 5개는 모두 한 각이 직각이고 두 변의 길이가 같은 삼각형이다. 사각형 조각은 정사각형 1개와 평행사변형 1개이다. 세 변의 길이가 같은 정삼각형 조각은 없다.',
        facts: { truth: list.map((word) => has[word]), want: false }
      });
    })
  ]);

  B.addTypes('4-2-4', 'fill', [
    T('fill-rule', '모양을 채우는 방법', '①76 ②73 ③71 심69', (d) => {
      const rows = d.shuffle([['빈틈이 생기지 않게 이어 붙인다.', true], ['조각이 서로 겹치지 않게 놓는다.', true], ['같은 모양 조각을 여러 번 써도 된다.', true], [d.pick(['조각이 서로 겹치게 이어 붙인다.', '조각 사이에 빈틈이 생기게 놓는다.']), false]]);
      return C('모양 조각으로 모양을 채우는 방법을 설명한 것이다. 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        explain: '모양을 채울 때에는 모양 조각을 서로 겹치지 않게, 빈틈없이 이어 붙인다. 같은 조각을 여러 번 써도 된다.', facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('fill-name-count', '모양을 채운 조각의 이름과 수', '①77 ③68', (d) => {
      const [target, kind, made] = d.until(() => { const t = d.pick(TARGETS.concat([{ cells: starOf() }, { cells: triangleOf(4) }])), k = d.pick(['tri', 'rhombus', 'trap']); return [t, k, tiling(t.cells, [k], d)]; }, ([t, k, m]) => m && m.length >= 3 && m.length <= 8 && t.cells.length > AREA[k]);
      // 틀린 보기: 다른 조각의 이름, 다른 조각으로 채울 때의 수(없으면 하나 더한 수)
      const n = made.length, other = d.pick(['tri', 'rhombus', 'trap'].filter((k) => k !== kind)), swap = target.cells.length / AREA[other], miss = Number.isInteger(swap) && swap !== n ? swap : n + 1;
      const rows = d.shuffle([[kind, n], [other, n], [kind, miss], [other, miss]]);
      return C('한 가지 모양 조각으로 채운 모양이다. 채운 조각의 이름과 수를 바르게 쓴 것은?', rows.map(([k, v]) => `${PIECE[k]} ${v}개`), rows.findIndex(([k, v]) => k === kind && v === n), {
        figure: tiled(made, { label: `${PIECE[kind]} 모양 조각 ${n}개로 채운 모양` }),
        explain: `모양을 채운 조각은 모두 ${PIECE[kind]}이고, 세어 보면 ${n}개이다.`,
        facts: { truth: rows.map(([k, v]) => k === made[0].kind && v === made.length), want: true }
      });
    }),
    T('fill-one-count', '한 가지 조각으로 채울 때 필요한 조각의 수', '①78 ②74 ③69 심65', (d) => {
      // 테두리만 그린 모양을 삼각 모눈 위에 놓는다. 조각도 같은 모눈 위에 그려 몇 칸짜리인지 보인다.
      const [target, kind, n] = d.until(() => { const t = d.pick(TARGETS.filter((item) => item.word !== '정육각형')), k = d.pick(['tri', 'rhombus', 'trap']); return [t, k, fillCount(t.cells, k)]; }, ([, , count]) => count >= 3 && count <= 12);
      const made = tiling(target.cells, [kind], d), wide = Math.ceil(Math.max(...outline(PIECES[kind]).map((p) => rawOf(p)[0])) + 0.9);
      return N('왼쪽 모양 조각만 여러 개 써서 오른쪽 모양을 빈틈없이 채우려고 한다. 모양 조각은 모두 몇 개 필요한가?', n, {
        unit: '개', figure: latticeFig([{ cells: PIECES[kind], fill: FILL[kind], over: '조각' }, { cells: target.cells, at: [wide, 0], over: '채울 모양' }], { grid: true, label: `삼각 모눈 위에 그린 ${PIECE[kind]} 모양 조각(작은 정삼각형 ${AREA[kind]}칸)과 채울 ${target.word} 모양(작은 정삼각형 ${target.cells.length}칸)` }),
        explain: `채울 모양은 작은 정삼각형 ${target.cells.length}칸이고 조각은 ${AREA[kind]}칸이다. ${AREA[kind] === 1 ? `조각은 ${n}개 필요하다.` : `${target.cells.length} ÷ ${AREA[kind]} = ${n}(개)`}<br>` + tiled(made, { scale: 0.85, label: `${PIECE[kind]} 조각 ${n}개로 채운 모양` }),
        facts: { calc: [[`${target.cells.length}/${AREA[kind]}`, 0]] }
      });
    }),
    T('fill-hexagon-which', '정육각형을 채울 수 있는 조각', '①82·84 ③64 심62', (d) => {
      // 삼각 모눈 위의 조각은 정육각형을 덮어 보아 정한다. 정사각형 조각은 직각이 있어 정육각형(한 각 120°)을 채울 수 없다.
      const order = d.shuffle(['tri', 'square', 'rhombus', 'trap']), labels = TAGS.slice(0, 4), flags = order.map((kind) => kind !== 'square' && fillCount(hexOf(1), kind) > 0), made = setOptions(d, labels, flags);
      const shapes = [];
      let cursor = 0;
      order.forEach((kind, i) => {
        const raw = kind === 'square' ? [[0, 0], [1, 0], [1, -1], [0, -1]] : outline(PIECES[kind]).map(rawOf), x0 = Math.min(...raw.map((p) => p[0])), w = Math.max(...raw.map((p) => p[0])) - x0;
        shapes.push({ raw, shift: [cursor - x0, 0], fill: kind === 'square' ? '#fed7aa' : FILL[kind], over: TAGS[i] });
        cursor += w + 0.8;
      });
      const word = (kind) => (kind === 'square' ? '정사각형' : PIECE[kind]);
      return C('한 가지 모양 조각만 여러 개 써서 정육각형 모양을 빈틈없이 채우려고 한다. 채울 수 있는 조각을 모두 고른 것은? (조각의 짧은 변과 정육각형의 한 변은 길이가 같다.)', made.options, made.answer, {
        figure: latticeFig(shapes, { unit: unitFor(shapes), label: '모양 조각 4개. ' + order.map((kind, i) => `${TAGS[i]}: ${word(kind)}`).join(' / ') }) + latticeFig([{ cells: hexOf(1), over: '채울 모양' }], { unit: unitFor(shapes), label: '채울 정육각형 모양' }),
        explain: `정육각형은 정삼각형 조각 6개, 마름모 조각 3개, 사다리꼴 조각 2개로 채울 수 있다. 정사각형 조각(${TAGS[order.indexOf('square')]})은 한 각이 90°라서 한 각이 120°인 정육각형의 모서리를 빈틈없이 채울 수 없다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('fill-two-pieces', '모양을 채우는 서로 다른 두 조각', '①83 ②68 ③63', (d) => {
      // 조각을 하나씩만 쓰므로 칸 수의 합이 맞아야 한다. 실제로 채워지는지는 두 조각으로 덮어 보아 정한다.
      const target = d.pick([{ word: '사다리꼴', cells: trapOf(2, 1) }, { word: '평행사변형', cells: paraOf(2, 1) }, { word: '정삼각형', cells: triangleOf(2) }, { word: '사다리꼴', cells: trapOf(3, 1) }]);
      const pairs = d.shuffle([['tri', 'rhombus'], ['tri', 'trap'], ['rhombus', 'trap']]), once = ([x, y]) => tiling(target.cells, [x, y], null, { [x]: 1, [y]: 1 }), truth = pairs.map((pair) => Boolean(once(pair))), at = truth.indexOf(true);
      return C('서로 다른 모양 조각 2개를 한 번씩만 써서 아래 모양을 빈틈없이 채우려고 한다. 써야 하는 두 조각은?', pairs.map(([x, y]) => `${PIECE[x]}, ${PIECE[y]}`), at, {
        figure: withPieces(['tri', 'rhombus', 'trap'], target.cells, '채울 모양', `삼각 모눈 위에 그린 ${target.word} 모양(작은 정삼각형 ${target.cells.length}칸)`),
        explain: `채울 모양은 작은 정삼각형 ${target.cells.length}칸이다. ${PIECE[pairs[at][0]]} 조각은 ${AREA[pairs[at][0]]}칸, ${PIECE[pairs[at][1]]} 조각은 ${AREA[pairs[at][1]]}칸이므로 두 조각을 이어 붙이면 꼭 맞는다.<br>` + tiled(once(pairs[at]), { scale: 0.85, label: '두 조각으로 채운 모양' }),
        facts: { truth, want: true }
      });
    }),
    T('fill-two-same', '같은 조각 2개로 채울 수 있는 모양', '③70', (d) => {
      const kind = d.pick(['trap', 'rhombus']), fits = (cells) => fillCount(cells, kind) === 2;
      const pool = kind === 'trap' ? [hexOf(1), paraOf(3, 1), triangleOf(2), paraOf(2, 2), trapOf(3, 1), paraOf(2, 1), triangleOf(3)] : [paraOf(2, 1), hexOf(1), paraOf(3, 1), trapOf(3, 1), triangleOf(3), trapOf(2, 1)];
      const picks = d.shuffle([d.pick(pool.filter(fits))].concat(d.shuffle(pool.filter((cells) => !fits(cells))).slice(0, 3))), truth = picks.map(fits), at = truth.indexOf(true);
      // 모양 넷을 한 모눈 위에 두 줄로 놓는다: 윗줄은 모눈 다섯 줄 위, 오른쪽 칸은 가로로 다섯 칸 옆
      const shapes = picks.map((cells, i) => { const lift = i < 2 ? 5 : 0, left = Math.min(...outline(cells).map((q) => rawOf(q)[0])); return { cells, at: [Math.round((i % 2) * 5 - lift / 2 - left), lift], over: TAGS[i] }; });
      const piece = [{ cells: PIECES[kind], fill: FILL[kind], over: '조각' }], unit = unitFor(shapes);
      return C(`${PIECE[kind]} 모양 조각 2개로 빈틈없이 채울 수 있는 모양은?`, TAGS.slice(0, 4), at, {
        figure: latticeFig(piece, { grid: true, unit, label: `삼각 모눈 위에 그린 ${PIECE[kind]} 모양 조각(작은 정삼각형 ${AREA[kind]}칸)` }) + latticeFig(shapes, { grid: true, unit, label: '삼각 모눈 위에 그린 모양 4개. ' + picks.map((cells, i) => `${TAGS[i]}: 작은 정삼각형 ${cells.length}칸`).join(' / ') }),
        explain: `${PIECE[kind]} 조각은 작은 정삼각형 ${AREA[kind]}칸이므로 2개로 채울 수 있는 모양은 ${AREA[kind] * 2}칸이다. ${TAGS[at]}가 ${AREA[kind] * 2}칸이고 조각 2개가 꼭 맞는다.<br>` + tiled(tiling(picks[at], [kind]), { scale: 0.85, label: `${PIECE[kind]} 조각 2개로 채운 모양` }),
        facts: { truth, want: true }
      });
    }),
    T('fill-rest', '한 조각의 수가 정해졌을 때 다른 조각의 수', '①81', (d) => {
      // 큰 조각만으로 채워지는 모양에서 큰 조각 몇 개를 정삼각형 조각으로 바꾼 것이므로 반드시 채워진다. 칸 수로 셈하면 답은 하나다.
      const [target, kind, all] = d.until(() => { const t = d.pick(TARGETS), k = d.pick(['rhombus', 'trap']); return [t, k, tiling(t.cells, [k], d)]; }, ([, , made]) => made && made.length >= 2), b = d.int(1, all.length - 1), rest = target.cells.length - b * AREA[kind];
      const shown = all.slice(0, b).concat(...all.slice(b).map((piece) => piece.keys.map((key) => ({ kind: 'tri', keys: [key] }))));
      return N(`${PIECE[kind]} 모양 조각 ${b}개와 정삼각형 모양 조각 여러 개를 써서 아래 모양을 빈틈없이 채웠다. 정삼각형 모양 조각은 몇 개 썼는가?`, rest, {
        unit: '개', figure: withPieces(['tri', kind], target.cells, '채운 모양', `삼각 모눈 위에 그린 ${target.word} 모양(작은 정삼각형 ${target.cells.length}칸)`),
        explain: `채운 모양은 작은 정삼각형 ${target.cells.length}칸이다. ${PIECE[kind]} 조각 ${b}개가 ${AREA[kind]} × ${b} = ${AREA[kind] * b}(칸)을 채우므로 남은 ${target.cells.length} − ${AREA[kind] * b} = ${rest}(칸)을 정삼각형 조각 ${rest}개가 채운다.<br>` + tiled(shown, { scale: 0.85, label: '채운 방법의 하나' }),
        facts: { calc: [[`${target.cells.length}-${AREA[kind]}*${b}`, 0]] }
      });
    }),
    T('fill-talk', '채우는 방법에 대한 설명', '①85', (d) => {
      // [조각, 말한 수]. 참·거짓은 그 조각만으로 덮어 보아 정한다.
      const target = d.pick(TARGETS.filter((t) => ['tri', 'rhombus', 'trap'].every((kind) => fillCount(t.cells, kind) > 0))), cells = target.cells, slip = d.pick(['tri', 'rhombus', 'trap']);
      const wrongCount = { tri: cells.length / 2, rhombus: cells.length / 3, trap: cells.length / 2 }[slip], rows = d.shuffle(['tri', 'rhombus', 'trap'].map((kind) => [kind, kind === slip ? wrongCount : fillCount(cells, kind)]));
      const ok = ([kind, said]) => fillCount(cells, kind) === said;
      return C('한 가지 모양 조각만 써서 아래 모양을 빈틈없이 채우려고 한다. 옳지 않은 것은?', rows.map(([kind, said]) => `${PIECE[kind]} 모양 조각 ${said}개로 채울 수 있다.`), rows.findIndex((row) => !ok(row)), {
        figure: withPieces(['tri', 'rhombus', 'trap'], cells, '채울 모양', `삼각 모눈 위에 그린 ${target.word} 모양(작은 정삼각형 ${cells.length}칸)`),
        explain: `채울 모양은 작은 정삼각형 ${cells.length}칸이다. 정삼각형 조각은 ${cells.length}개, 마름모 조각은 ${cells.length} ÷ 2 = ${cells.length / 2}(개), 사다리꼴 조각은 ${cells.length} ÷ 3 = ${cells.length / 3}(개)로 채울 수 있다.`,
        facts: { truth: rows.map(ok), want: false }
      });
    })
  ]);

  // ── 실력 문항의 도형 감 ──────────────────────────────────────
  // 이름표 없이 그리는 볼록한 다각형(4-2-4a.js와 같다). 꼭짓점은 왼쪽 위부터 시계 반대쪽으로 돈다.
  const CONVEX = { 5: [[2.1, 0], [0, 1.6], [0.9, 3.6], [3.5, 3.6], [4.3, 1.5]], 6: [[1.3, 0], [0, 1.7], [1.1, 3.5], [3.3, 3.6], [4.5, 1.9], [3.4, 0.1]] };
  const adjacent = (n, i, j) => Math.abs(i - j) === 1 || Math.abs(i - j) === n - 1;
  // 다각형 안에 긋는 선분의 끝: 꼭짓점 번호(수)이거나 변 위의 점([꼭짓점, 다음 꼭짓점, 몫])
  const endOf = (pts, e) => (typeof e === 'number' ? pts[e] : mid(pts[e[0]], pts[e[1]], e[2]));
  const isDiagonal = (n, [a, b]) => typeof a === 'number' && typeof b === 'number' && a !== b && !adjacent(n, a, b);
  const bend = (a, ctrl, b) => Array.from({ length: 15 }, (_, i) => { const t = i / 14, u = 1 - t; return [u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0], u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1]]; });
  // 오목한 다각형(별, 화살표, 화살촉, 한쪽이 팬 모양, ㅜ자, ㄴ자)과 볼록한 다각형
  const ODD_POLYS = [Array.from({ length: 10 }, (_, i) => G.toward([0, 0], i % 2 ? 0.42 : 1, 90 + i * 36)), [[0, 1], [2.4, 1], [2.4, 0], [4, 1.5], [2.4, 3], [2.4, 2], [0, 2]], [[0, 0], [2, 1], [4, 0], [2, 3]], [[0, 0], [4, 0], [4, 3], [2, 1.4], [0, 3]], [[0, 0], [4, 0], [4, 1], [2.7, 1], [2.7, 3], [1.3, 3], [1.3, 1], [0, 1]], [[0, 0], [2, 0], [2, 1.5], [4, 1.5], [4, 3], [0, 3]]];
  const PLAIN_POLYS = [[[0, 3], [4, 3], [1, 0]], [[0, 0.4], [3.6, 0], [4, 2.6], [0.6, 3]], [[1, 0], [3, 0], [4, 1.6], [2, 3], [0, 1.6]], [[1, 0], [3, 0], [4, 1.5], [3, 3], [1, 3], [0, 1.5]]];
  // 한 곳만 굽은 도형(나머지는 모두 선분이다)
  const BENT = [() => [[0, 3], [0, 0.9]].concat(bend([0, 0.9], [2, -0.9], [4, 0.9]), [[4, 3]]), () => [[0, 3]].concat(bend([4, 3], [4.5, 0.3], [1.8, 0])), () => bend([0, 0], [2, 2.3], [4, 0]).concat([[4, 3], [0, 3]]), () => [[0, 0], [3, 0]].concat(bend([3, 0], [5, 1.5], [3, 3]), [[0, 3]])];
  // 한 곳만 열린 도형(선분으로만 이루어져 있다)
  const GAPS = [[[1.2, 0], [0, 0], [0, 2.6], [3.6, 2.6], [3.6, 0], [2.4, 0]], [[2, 3], [0, 3], [1.8, 0], [4, 3], [3.4, 3]], [[0, 3], [0, 1.2], [2, 0], [4, 1.2], [4, 3]], [[1, 0], [3, 0], [4, 1.5], [3, 3], [1, 3], [0, 1.5]]];
  // 정n각형의 변 i 를 바깥으로 굽힌 도형, 변 i 를 뺀 열린 도형
  const bentRegular = (n, i) => { const pts = regular(n), out = []; pts.forEach((v, k) => { out.push(v); if (k === i) { const w = pts[(k + 1) % n], m = mid(v, w); out.push(...bend(v, [m[0] * 1.9, m[1] * 1.9], w).slice(1, -1)); } }); return out; };
  const openRegular = (n, i) => { const pts = regular(n); return pts.map((_, k) => pts[(i + 1 + k) % n]); };

  B.addGroup('4-2-4', {
    id: 'hard', title: '실력 문제', standard: POLY,
    types: [
      H('hard-poly-count', '오목한 다각형과 다각형처럼 보이는 도형이 섞인 그림에서 다각형 세기', '1·3', (d) => {
        // 그림의 함정: 오목하게 들어간 도형도 선분으로만 둘러싸여 있으면 다각형이다. 한 곳만 굽었거나 한 곳만 열린 도형은 다각형이 아니다.
        const plain = d.int(0, 1), bent = plain ? d.int(1, 2) : 2, gap = 4 - plain - bent;
        const items = d.shuffle(d.shuffle(ODD_POLYS).slice(0, 2).map((points) => ({ points, kind: 'poly', said: `오목한 다각형(선분 ${points.length}개로 둘러싸인 도형)` }))
          .concat(d.shuffle(PLAIN_POLYS).slice(0, plain).map((points) => ({ points, kind: 'poly', said: `선분 ${points.length}개로 둘러싸인 도형` })),
            d.shuffle(BENT).slice(0, bent).map((make) => ({ points: make(), kind: 'bent', said: '한 곳이 굽은 선인 도형' })),
            d.shuffle(GAPS).slice(0, gap).map((points) => ({ points, open: true, kind: 'gap', said: '한 곳이 열려 있는 도형' }))));
        const flags = items.map((item) => item.kind === 'poly'), names = (kind) => listed(TAGS, items.map((item) => item.kind === kind));
        return N('다각형은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: gallery(items, { label: '도형 6개. ' + items.map((item, i) => `${TAGS[i]}: ${item.said}`).join(' / ') }),
          explain: `${names('bent')}는 굽은 선이 있고, ${names('gap')}는 선분으로 둘러싸여 있지 않고 열려 있어서 다각형이 아니다. ${names('poly')}는 선분으로만 둘러싸여 있으므로 다각형이다. 안쪽으로 들어간 곳이 있어도 다각형이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-regular-count', '정다각형을 닮은 도형이 섞인 그림에서 정다각형 세기', '12·15·16', (d) => {
        // 그림의 함정: 마름모(변만 같다), 직사각형(각만 같다), 정다각형을 닮았지만 한 변이 굽은 도형, 한 변이 없는 도형
        const count = d.int(2, 3), traps = d.shuffle([
          { points: [[1.6, 0], [3.2, 1], [1.6, 2], [0, 1]], kind: 'rhombus', said: '네 변의 길이는 같지만 각의 크기가 같지 않은 사각형(마름모)' },
          { points: [[0, 0], [3.4, 0], [3.4, 1.7], [0, 1.7]], kind: 'rect', said: '네 각의 크기는 같지만 변의 길이가 같지 않은 사각형(직사각형)' },
          { points: bentRegular(d.pick([5, 6]), d.int(0, 4)), kind: 'bent', said: '정다각형을 닮았지만 한 변이 굽은 선인 도형' },
          { points: openRegular(d.pick([5, 6]), d.int(0, 4)), open: true, kind: 'gap', said: '정다각형을 닮았지만 한 변이 없어 열려 있는 도형' }
        ]).slice(0, 6 - count);
        const items = d.shuffle(d.shuffle([3, 4, 5, 6, 8]).slice(0, count).map((n) => ({ points: regular(n), kind: 'regular', said: '정' + NAME[n] })).concat(traps)), flags = items.map((item) => item.kind === 'regular');
        const why = { rhombus: '변의 길이는 모두 같지만 각의 크기가 같지 않다', rect: '각의 크기는 모두 같지만 변의 길이가 같지 않다', bent: '굽은 선이 있어서 다각형이 아니다', gap: '열려 있어서 다각형이 아니다' };
        return N('정다각형은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: gallery(items, { label: '도형 6개. ' + items.map((item, i) => `${TAGS[i]}: ${item.said}`).join(' / ') }),
          explain: items.map((item, i) => (item.kind === 'regular' ? '' : `${TAGS[i]}는 ${why[item.kind]}. `)).join('') + `변의 길이가 모두 같고 각의 크기도 모두 같은 다각형은 ${listed(TAGS, flags)}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-diag-count', '변과 대각선을 함께 그어 놓은 그림에서 대각선 세기', '33·40', (d) => {
        // 그림의 함정: 굵은 선분 가운데에는 변(이웃한 두 꼭짓점을 이은 선분)도 있고, 한쪽 끝이 꼭짓점이 아니라 변 위에 있는 선분도 있다.
        const [n, layouts] = d.pick([
          [6, [[[0, 2], [3, 5], [[0, 5, 0.5], [2, 3, 0.5]], [0, 1], [3, 4]], [[1, 5], [2, 4], [[1, 2, 0.5], [4, 5, 0.5]], [2, 3], [0, 5]], [[0, 3], [1, [2, 3, 0.5]], [5, [3, 4, 0.5]], [4, 5], [1, 2]], [[0, 2], [0, 3], [0, 4], [0, 1], [0, 5]]]],
          [5, [[[0, 2], [0, 3], [0, 1], [0, 4]], [[1, 3], [4, [0, 1, 0.5]], [[1, 2, 0.5], [2, 3, 0.5]], [3, 4], [0, 4]], [[0, 2], [0, 3], [[0, 1, 0.5], [1, 2, 0.5]], [[0, 4, 0.5], [3, 4, 0.5]], [2, 3]]]]
        ]);
        const segs = d.pick(layouts), flags = segs.map((seg) => isDiagonal(n, seg)), sides = segs.filter(([a, b]) => typeof a === 'number' && typeof b === 'number' && adjacent(n, a, b)).length, loose = segs.length - sides - flags.filter(Boolean).length;
        const fit = place(CONVEX[n], [4.8, 4], [0.8, 0.8]), q = fit.points, bold = (svg) => svg.replace('<line ', '<line style="stroke:#2563eb;stroke-width:3.4" ');
        return N(`${NAME[n]}에 굵은 선분을 ${segs.length}개 그었다. 굵은 선분 가운데 대각선은 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', figure: draw(fit, [G.polygon(q)].concat(segs.map(([a, b]) => bold(G.line(endOf(q, a), endOf(q, b))))), `${NAME[n]}에 그은 굵은 선분 ${segs.length}개. 이웃한 두 꼭짓점을 이은 선분 ${sides}개, 끝이 변 위에 있는 선분 ${loose}개, 이웃하지 않는 두 꼭짓점을 이은 선분이 섞여 있다.`),
          explain: `굵은 선분 가운데 ${sides}개는 서로 이웃한 두 꼭짓점을 이은 것이라 ${NAME[n]}의 변이다.${loose ? ` ${loose}개는 끝이 꼭짓점이 아니라 변 위에 있다.` : ''} 서로 이웃하지 않는 두 꼭짓점을 이은 선분만 대각선이므로 ${flags.filter(Boolean).length}개이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-quad-count', '기울어진 정사각형이 섞인 그림에서 대각선의 성질에 맞는 사각형 세기', '47', (d) => {
        // 그림의 함정: 기울어진 정사각형을 마름모로만 보면 「길이가 같은 것」에서 빠뜨리고, 직사각형·마름모는 성질을 하나씩만 가진다.
        const prop = d.pick(['equal', 'perp']), kinds = d.shuffle(['tilted', 'rect', 'rhombus', 'para', d.pick(['square', 'trap'])]), quads = kinds.map((kind) => d.pick(QUADS[kind])), flags = quads.map(PROPS[prop].test);
        return N(`모눈종이에 그린 사각형 가운데 ${PROPS[prop].ask} 것은 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', figure: gridGallery(quads, '모눈종이에 그린 사각형 5개. ' + kinds.map((kind, i) => `${TAGS[i]}: ${kind === 'tilted' ? '기울어진 정사각형' : QUAD_NAME[kind]}`).join(' / ')),
          explain: `${TAGS[kinds.indexOf('tilted')]}는 기울어져 있지만 네 변의 길이가 같고 네 각이 모두 직각인 정사각형이다. ${PROPS[prop].who} 그러므로 ${listed(TAGS.slice(0, 5), flags)}의 ${flags.filter(Boolean).length}개이다.<br>` + gridGallery(quads, '대각선을 그은 사각형 5개', true),
          facts: { count: flags }
        });
      }),
      H('hard-cut-pieces', '잘라 낸 조각 가운데 대각선의 길이가 같은 사각형', '49', (d) => {
        // 세로로 자른 선 사이의 조각만 직사각형(정사각형)이다. 비스듬한 선은 모두 같은 쪽으로 기울여 등변사다리꼴이 생기지 않게 한다.
        const W = 12, Ht = 3, lean = d.pick([1, -1]);
        const pieces = d.until(() => {
          const tops = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, d.int(4, 5)).sort((x, y) => x - y);
          const cuts = [[0, 0]].concat(tops.map((t) => [t, t + lean * d.pick([0, 0, 0, 1, 2])]), [[W, W]]);
          return cuts.slice(1).map(([t, b], i) => [[cuts[i][0], 0], [cuts[i][1], Ht], [b, Ht], [t, 0]]);
        }, (list) => { const same = list.filter(PROPS.equal.test).length; return list.every((q) => q[3][0] - q[0][0] >= 1 && q[2][0] - q[1][0] >= 1) && same >= 2 && same <= list.length - 2; });
        const flags = pieces.map(PROPS.equal.test), n = pieces.length;
        const parts = pieces.map((q) => seeThrough(G.polygon(q))).concat(pieces.map((q, i) => halo(G.text(centre(q), TAGS[i], 'mb-label is-small'), '#fff')));
        return N(`직사각형 모양의 종이를 선을 따라 잘라 사각형 조각 ${n}개를 만들었다. 두 대각선의 길이가 같은 조각은 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', figure: G.board(W, Ht, parts, { grid: 'lines', scale: 1, label: `모눈종이 위의 직사각형 종이를 선을 따라 자른 사각형 조각 ${n}개(${TAGS.slice(0, n).join(', ')})` }),
          explain: `두 대각선의 길이가 같은 사각형은 직사각형과 정사각형이다. 네 각이 모두 직각인 조각은 ${listed(TAGS.slice(0, n), flags)}이다. 나머지는 사다리꼴이나 평행사변형이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-vertex-to-total', '한 꼭짓점에서의 수로 다각형을 찾아 대각선의 수 구하기', '41·43', (d) => {
        const k = d.int(1, 3), n = k + 3;
        return N(`한 꼭짓점에서 그을 수 있는 대각선이 ${k}개인 다각형이 있다. 이 다각형에 그을 수 있는 대각선은 모두 몇 개인가?`, diagonals(n), {
          unit: '개', explain: `한 꼭짓점에서는 자신과 이웃한 두 꼭짓점을 뺀 나머지 꼭짓점에 대각선을 그을 수 있으므로 꼭짓점은 ${k} + 3 = ${n}(개)이다. ${NAME[n]}에 그을 수 있는 대각선은 모두 ${diagonals(n)}개이다.`,
          facts: { calc: [[`(${k}+3)*${k}/2`, 0]], unseen: [3, 2] }
        });
      }),
      H('hard-para-sum', '두 대각선의 길이의 합에서 거꾸로 구하기', '53', (d) => {
        const [a, b] = d.until(() => [d.int(5, 12), d.int(4, 11)], ([x, y]) => x !== y && x / y > 0.6 && x / y < 1.7), sum = a * 2 + b * 2;
        return N(`평행사변형 ㄱㄴㄷㄹ에서 두 대각선의 길이의 합은 ${sum} cm이다. 두 대각선이 만나는 점이 ㅁ이고 선분 ㄴㅁ의 길이가 ${b} cm일 때, 선분 ㄱㅁ의 길이는 몇 cm인가?`, a, {
          unit: 'cm', figure: crossFig(paraBy(a, b), { label: '두 대각선을 그은 평행사변형 ㄱㄴㄷㄹ. 두 대각선이 만나는 점 ㅁ' }),
          explain: `평행사변형의 한 대각선은 다른 대각선을 똑같이 둘로 나눈다. 선분 ㄴㄹ의 길이는 ${b} × 2 = ${b * 2}(cm)이므로 선분 ㄱㄷ의 길이는 ${sum} − ${b * 2} = ${a * 2}(cm)이고, 선분 ㄱㅁ의 길이는 ${a * 2} ÷ 2 = ${a}(cm)이다.`,
          facts: { calc: [[`(${sum}-${b}*2)/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-two-triangles', '정삼각형 2개를 이어 붙인 사각형의 대각선', '56', (d) => {
        // 맞닿은 변이 대각선이다. 네 변의 길이가 같으므로 마름모이고, 한 대각선이 다른 대각선을 똑같이 둘로 나눈다.
        const s = d.int(3, 8) * 2, raw = [[0, -0.5], [-S3, 0], [0, 0.5], [S3, 0]];
        return N(`한 변의 길이가 ${s} cm인 정삼각형 ㄱㄴㄷ과 정삼각형 ㄱㄷㄹ을 이어 붙여 사각형 ㄱㄴㄷㄹ을 만들었다. 사각형 ㄱㄴㄷㄹ의 두 대각선이 만나는 점이 ㅁ일 때, 선분 ㄱㅁ의 길이는 몇 cm인가?`, s / 2, {
          unit: 'cm', figure: crossFig(raw, { box: [5.4, 3.3], more: (p) => [G.line(p[0], p[2]), sideOf(p, 0, cm(s))], label: `정삼각형 ㄱㄴㄷ과 정삼각형 ㄱㄷㄹ을 변 ㄱㄷ에서 이어 붙인 사각형 ㄱㄴㄷㄹ. 변 ㄱㄴ의 길이 ${s} cm. 선분 ㄱㄷ과 선분 ㄴㄹ이 만나는 점 ㅁ` }),
          explain: `맞닿은 변 ㄱㄷ은 정삼각형의 변이므로 ${s} cm이고, 사각형 ㄱㄴㄷㄹ의 대각선이다. 사각형 ㄱㄴㄷㄹ은 네 변의 길이가 모두 ${s} cm인 마름모이므로 대각선 ㄴㄹ이 대각선 ㄱㄷ을 똑같이 둘로 나눈다. ${s} ÷ 2 = ${s / 2}(cm)`,
          facts: { calc: [[`${s}/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-fill-length', '변의 길이로 준 조각으로 큰 도형 만들기', '60', (d) => {
        // 한 변이 2배이면 조각은 2개가 아니라 4개, 3배이면 9개가 든다(변의 길이의 배만큼만 든다고 여기는 아이가 틀린다). 답은 칸을 세어 정하고, 검사는 식으로 다시 셈한다.
        const a = d.int(2, 5), [word, k, cells, lead, why] = d.pick([
          ['정삼각형', 2, triangleOf(2), '', '위에서부터 한 줄에 1개, 3개씩 놓이므로 1 + 3 = 4(개)이다.'],
          ['정삼각형', 3, triangleOf(3), '', '위에서부터 한 줄에 1개, 3개, 5개씩 놓이므로 1 + 3 + 5 = 9(개)이다.'],
          ['정삼각형', 4, triangleOf(4), '', '위에서부터 한 줄에 1개, 3개, 5개, 7개씩 놓이므로 1 + 3 + 5 + 7 = 16(개)이다.'],
          ['마름모', 2, paraOf(2, 2), '2*', '마름모는 한 변이 조각의 2배인 정삼각형 2개로 나눌 수 있고, 그 정삼각형 하나에 조각이 4개씩 놓이므로 4 × 2 = 8(개)이다.'],
          ['정육각형', 2, hexOf(2), '6*', '정육각형은 한 변이 조각의 2배인 정삼각형 6개로 나눌 수 있고, 그 정삼각형 하나에 조각이 4개씩 놓이므로 4 × 6 = 24(개)이다.']
        ]), L = a * k;
        return N(`한 변의 길이가 ${a} cm인 정삼각형 모양 조각을 빈틈없이 이어 붙여, 그림과 같이 한 변의 길이가 ${L} cm인 ${josa(word, '을/를')} 만들려고 한다. 조각은 모두 몇 개 필요한가?`, cells.length, {
          unit: '개', figure: latticeFig([{ cells: PIECES.tri, fill: FILL.tri, over: '조각', under: cm(a) }, { cells, shift: [2, 0], over: `만들 ${word}`, under: cm(L) }], { label: `한 변의 길이가 ${a} cm인 정삼각형 조각과 한 변의 길이가 ${L} cm인 ${word}` }),
          explain: `${word}의 한 변에 조각의 변이 ${k}개 놓인다. ${why}<br>` + tiled(tiling(cells, ['tri']), { scale: 0.85, label: `정삼각형 조각 ${cells.length}개로 만든 ${word}` }),
          facts: { calc: [[`${lead}(${L}/${a})*(${L}/${a})`, 0]], unseen: [2, 6] }
        });
      }, { standard: MAKE }),
      H('hard-fill-diff', '조각을 바꾸어 채울 때 필요한 조각 수의 차', '66, 기본 ①79', (d) => {
        const [target, kind, n] = d.until(() => { const t = d.pick(TARGETS), k = d.pick(['rhombus', 'trap']); return [t, k, fillCount(t.cells, k)]; }, ([, , count]) => count >= 2), cells = target.cells.length;
        return N(`한 가지 모양 조각만 써서 아래 모양을 빈틈없이 채우려고 한다. 정삼각형 모양 조각만 쓸 때에는 ${PIECE[kind]} 모양 조각만 쓸 때보다 조각이 몇 개 더 필요한가?`, cells - n, {
          unit: '개', figure: withPieces(['tri', kind], target.cells, '채울 모양', `삼각 모눈 위에 그린 ${target.word} 모양(작은 정삼각형 ${cells}칸)`),
          explain: `채울 모양은 작은 정삼각형 ${cells}칸이다. 정삼각형 조각은 ${cells}개, ${PIECE[kind]} 조각은 ${cells} ÷ ${AREA[kind]} = ${n}(개) 필요하므로 차는 ${cells} − ${n} = ${cells - n}(개)이다.<br>` + tiled(tiling(target.cells, [kind]), { scale: 0.85, label: `${PIECE[kind]} 조각 ${n}개로 채운 모양` }),
          facts: { calc: [[`${cells}-${cells}/${AREA[kind]}`, 0]] }
        });
      }, { standard: MAKE }),
      H('hard-fill-cost', '조각을 바꾸어 채울 때 드는 값 비교하기', '61', (d) => {
        const [x, y] = d.pick([['tri', 'rhombus'], ['tri', 'trap'], ['rhombus', 'trap']]), nx = fillCount(hexOf(1), x), ny = fillCount(hexOf(1), y);
        const [px, py] = d.until(() => [d.int(2, 6) * 50, d.int(3, 12) * 50], ([p, q]) => q > p && nx * p > ny * q && nx * p - ny * q >= 100);
        return N(`정육각형 모양을 한 가지 모양 조각만 써서 빈틈없이 채우려고 한다. ${PIECE[x]} 조각은 1개에 ${px}원, ${PIECE[y]} 조각은 1개에 ${py}원이다. ${PIECE[x]} 조각만 써서 채울 때에는 ${PIECE[y]} 조각만 써서 채울 때보다 몇 원이 더 드는가?`, nx * px - ny * py, {
          unit: '원', figure: withPieces([x, y], hexOf(1), '채울 모양', '삼각 모눈 위에 그린 정육각형 모양(작은 정삼각형 6칸)'),
          explain: `정육각형은 ${PIECE[x]} 조각 ${nx}개나 ${PIECE[y]} 조각 ${ny}개로 채울 수 있다. ${PIECE[x]} 조각으로는 ${px} × ${nx} = ${px * nx}(원), ${PIECE[y]} 조각으로는 ${py} × ${ny} = ${py * ny}(원)이 들므로 ${px * nx} − ${py * ny} = ${nx * px - ny * py}(원)이 더 든다.`,
          facts: { calc: [[`6/${AREA[x]}*${px}-6/${AREA[y]}*${py}`, 0]] }
        });
      }, { standard: MAKE })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
