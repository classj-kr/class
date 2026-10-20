// 4학년 1학기 2단원 각도 — 각도의 합과 차, 삼각형의 세 각의 크기의 합, 사각형의 네 각의 크기의 합의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3의 「각도의 합과 차」「삼각형」「사각형」 묶음, 심화꼴 113꼴)과 덧문서를 꼴마다 따져서 실었다. ref 의 ①n·②n·③n 은 기본꼴_1·2·3, 심n 은 심화꼴의 n번이다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 변이 길게 그려진 각이 더 크다고 여긴다.
//   ② 각도기의 안쪽 눈금과 바깥쪽 눈금을 바꿔 읽는다(0에 맞춘 쪽의 눈금을 읽어야 한다).
//   ③ 한 변이 0이 아닌 눈금에 놓인 각도 끝 눈금을 그대로 읽는다(두 눈금의 차를 읽어야 한다).
//   ④ 둔각을 「90°보다 큰 각」으로만 알아 180°와 그보다 큰 각도까지 둔각이라고 한다.
//   ⑤ 삼각형이 크면 세 각의 크기의 합도 크다고 여긴다. 한 삼각형에 둔각이나 직각이 둘 있을 수 있다고 여긴다.
//   ⑥ 사각형을 삼각형 4개로 나누면 네 각의 크기의 합이 180°×4라고 여긴다(가운데 모인 각은 사각형의 각이 아니다).
//   ⑦ 30분일 때 짧은바늘이 숫자를 그대로 가리킨다고 여긴다(3시 30분을 직각으로 본다).
// 그다음에 두 번 넘게 따져야 하는 각도 문제를 실었다(직선 위의 각과 삼각형·사각형의 각을 함께 쓰는 것, 삼각형과 사각형이 이어진 그림, 삼각자 두 개).
//
// 싣는 기준
//  - 그림의 각은 적힌 각도 그대로 그린다. 답이 되는 각에는 ㉠만 적는다(그 각이 직각이면 직각 표시가 답을 흘리므로 답이 90°인 그림은 만들지 않는다).
//  - 한 직선 위의 각이 180°, 한 바퀴가 360°라는 것은 각도의 합과 차에서 쓴다. 삼각자의 각(30°·60°·90°, 45°·45°·90°)을 이어 붙이거나 겹친 각을 싣는다.
//  - 그림 속 글끼리 겹치면 다시 만든다(textsClear). 좁은 각의 글은 변에 닿지 않게 꼭짓점에서 멀리 적는다.
//
// 뺀 것과 까닭
//  - 위 학년·다른 단원: 평행한 두 거울 사이의 빛 ②77(엇각, 중학교), 삼각형 세 꼭짓점의 바깥쪽 각의 합 심86(외각, 중학교),
//    오각형·팔각형에 표시된 각의 합과 각이 모두 같은 도형의 한 각 ②106 심107·108(다각형의 각의 크기의 합, 중학교),
//    종이를 접어 생긴 각 ②107 심110~112(접은 모양의 합동, 5학년), 접어서 생긴 정삼각형 심113(「삼각형」 단원의 정삼각형),
//    긴바늘·짧은바늘이 움직인 각도 ②75·76(비례), 원을 똑같이 나눈 조각의 각 ②67
//  - 조건 풀이·경우 따지기: 삼각자 2개로 만들 수 없는 각 ①71 심74 ③96(합과 차의 짝을 모두 따진다), 한 각이 다른 각의 2배 ②78,
//    네 번 넘게 이어 구하기 심89·105·106
//  - 뜻 없는 셈: 두 식의 빈칸에 들어갈 각도의 합·차 ①65 심61, 서로 다른 도형에서 구한 두 각의 합·차 ②108 심102·103
//  - 재거나 그려야 답이 되는 것(작도): ①61·63·75·80·95 ②53·74·79·93 ③52·53·63·67·78·80 심56·66·75·90
//  - 까닭·방법 쓰기(서술형): ①88·93 ②92 ③77·88·92(수만 묻는 것은 실었다)
//  - 답이 정해지지 않는 것: 케이크 조각 둘을 골라 더하기 ③64
//  - 이미 실은 문제와 같은 얼개여서 따로 싣지 않은 것: 식과 결과 잇기 ②54, 말로 나타낸 각도 견주기 심58,
//    한 각을 똑같이 둘로 나눈 선 ②91(h-tri-split 과 같은 얼개에 조건 하나를 더한 것), 겹친 삼각자에서 각을 이어 구하기 심73(h-set-cross 와 같은 얼개)
//  - 수·상황만 달라 한 유형으로 묶은 것(ref 에 함께 적었다): 따로 그린 두 각의 합·차 ①59·60, 세 각·네 각이 적힌 그림의 합 식 채우기 ①79·94,
//    접어서 모은 삼각형 ③70, 똑같은 삼각자 둘을 맞댄 사각형 ③93, 직사각형을 자른 직각삼각형과 직선 심87, 직선 위의 두 각과 사각형 심98·99,
//    삼각형과 사각형이 한 변을 맞댄 도형 ②104, 두 사각형의 네 각의 합 견주기 ①101, 접힌 모서리의 직각 둘과 한 각 심109
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, expr, lines, tagged, numbers, josa, name, N, M, C } = B.kit;
  const G = B.kit.geo;
  const KIND = '4수03-02', DEG = '4수03-24', SUMS = '4수03-25';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SIGNS = ['&gt;', '=', '&lt;'];
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const kindOf = (deg) => (deg < 90 ? '예각' : deg === 90 ? '직각' : '둔각');
  const signOf = (left, right) => (left > right ? 0 : left === right ? 1 : 2);
  const sumOf = (list) => list.reduce((s, v) => s + v, 0);
  const degs = (list) => list.map((v) => v + '°').join(', ');
  // 각도의 식: 화면에 적는 글과 검사가 다시 셈하는 식
  const plus = (a, b) => ({ html: expr(a + '°', '+', b + '°'), calc: `${a}+${b}`, value: a + b, said: `${a}° + ${b}° = ${a + b}°` });
  const minus = (a, b) => ({ html: expr(a + '°', '-', b + '°'), calc: `${a}-${b}`, value: a - b, said: `${a}° - ${b}° = ${a - b}°` });
  // 값이 v 인 덧셈식이나 뺄셈식. step: 수의 단위(5이면 5의 배수만)
  function exprOf(d, v, add, step) {
    const k = step || 1;
    if (add) { const a = d.int(Math.ceil(20 / k), Math.floor((v - 20) / k)) * k; return Object.assign(plus(a, v - a), { parts: [a + '°', '+', v - a + '°'] }); }
    const b = d.int(Math.ceil(20 / k), Math.floor(75 / k)) * k; return Object.assign(minus(v + b, b), { parts: [v + b + '°', '-', b + '°'] });
  }

  // ── 그림 ─────────────────────────────────────────────────────
  // 그림 조각은 { pts: 원점을 기준으로 한 테두리 점들, draw(원점을 놓을 자리): 그림 글, label: 그림 설명 } 꼴로 만들고,
  // 판에 놓을 때 테두리에 맞춰 원점을 옮긴다. 방향은 오른쪽이 0°이고 시계 반대쪽으로 커진다.
  const RAD = Math.PI / 180, Z = [0, 0];
  const at = G.toward;
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
  const widthOf = (svg) => Number(svg.match(/ width="(\d+)"/)[1]);
  // 도구가 그린 조각(선·다각형·글)에 모양을 덧입힌다.
  const styled = (svg, style) => svg.replace(/^<(\w+) /, '<$1 style="' + style + '" ');
  function span(points, m) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    return { o: [m - x0, m - y0], cols: Math.max(...xs) - x0 + 2 * m, rows: Math.max(...ys) - y0 + 2 * m };
  }
  // 그림 하나를 판에 꼭 맞게 놓는다. 휴대폰의 카드 안 너비(290px)를 넘으면 줄여 그린다.
  function single(it, scale, m) {
    const sp = span(it.pts, m === undefined ? 0.3 : m), plain = widthOf(G.board(sp.cols, sp.rows, [], { grid: false }));
    return G.board(sp.cols, sp.rows, [it.draw(sp.o)], { grid: false, scale: Math.min(scale || 1, 290 / plain), label: it.label });
  }
  // 이름표가 붙은 칸 여럿. 칸의 크기를 모두 같게 하고 그림은 칸 가운데에 놓는다(두 칸이 한 줄에 들어가게 120px).
  function tilesOf(items, tags, limit) {
    const boxes = items.map((it) => span(it.pts, 0.14)), cols = Math.max(...boxes.map((b) => b.cols)), rows = Math.max(...boxes.map((b) => b.rows));
    const scale = Math.min(1, (limit || 120) / widthOf(G.board(cols, rows, [], { grid: false })));
    return G.tiles(items.map((it, i) => {
      const b = boxes[i], o = [b.o[0] + (cols - b.cols) / 2, b.o[1] + (rows - b.rows) / 2];
      return [tags[i], G.board(cols, rows, [it.draw(o)], { grid: false, scale, label: it.label })];
    }));
  }
  // 각 표시 옆 글의 자리: 좁은 각일수록 꼭짓점에서 멀리 적는다. wide: 글이 '70°'처럼 길 때
  const markAt = (deg, r, wide) => Math.max(r + 0.55, (wide ? 0.72 : 0.45) / Math.sin((Math.min(deg, 180) / 2) * RAD));
  // 글(text)을 적을 자리. 세 자리 각도('130°')는 글이 길어 조금 더 안쪽에 적는다.
  const textAt = (deg, text, q) => (q && q.at) || markAt(deg, (q && q.r) || 0.65, text.length > 1) + (text.length > 3 ? 0.2 : 0);
  // 각 표시: 꼭짓점 o 에서 from°~to° 사이의 호(직각이면 직각 표시)와 그 옆의 글. q: { r 호의 반지름, at 글의 자리, halo 글 뒤를 가릴 빛깔, round 직각도 호로 }
  function mark(o, from, to, text, q) {
    const opt = q || {}, r = opt.r || 0.65, deg = to - from;
    let out = Math.abs(deg - 90) < 0.01 && !opt.round ? G.squareMark(o, from, to, 0.34) : G.arc(o, from, to, r);
    if (text) {
      const word = G.text(at(o, textAt(deg, text, opt), (from + to) / 2), text, 'mb-label is-length');
      out += opt.halo ? styled(word, 'paint-order:stroke;stroke:' + opt.halo + ';stroke-width:4px;stroke-linejoin:round') : word;
    }
    return out;
  }
  const markSpot = ([from, to, text, q]) => at(Z, textAt(to - from, text, q) + 0.5, (from + to) / 2);
  // 한 점에서 그은 변들과 각 표시. rays: [방향, 길이, 이름], marks: [from, to, 글, q], vertex: 꼭짓점 이름
  function fanItem(rays, marks, label, vertex) {
    const back = G.bearing(Z, rays.reduce((s, [dir]) => add(s, at(Z, 1, dir)), Z)) + 180;
    return {
      pts: [Z].concat(vertex ? [at(Z, 0.75, back)] : [], rays.map(([dir, len, nm]) => at(Z, len + (nm ? 0.62 : 0), dir)), marks.filter((m) => m[2]).map(markSpot)), label,
      draw: (o) => rays.map(([dir, len, nm]) => G.line(o, at(o, len, dir)) + (nm ? G.text(at(o, len + 0.42, dir), nm) : '')).join('') + marks.map(([from, to, text, q]) => mark(o, from, to, text, q)).join('') + (vertex ? G.text(at(o, 0.5, back), vertex) : '')
    };
  }
  // 각 하나(각의 크기 비교)
  function angleItem(s, label) {
    const rot = s.rot || 0, a = s.a || 2.2, r = Math.min(0.62, a * 0.42);
    return { pts: [Z, at(Z, a, rot), at(Z, a, rot + s.deg)], label, draw: (o) => G.line(o, at(o, a, rot)) + G.line(o, at(o, a, rot + s.deg)) + G.arc(o, rot, rot + s.deg, r) };
  }
  // 도형을 잘라 꼭짓점을 한 점에 모아 붙인 조각들. list: 조각의 각, texts: 조각에 적는 글
  const TINT = ['#fff8e1', '#e0f2fe', '#fce7f3', '#dcfce7'];
  function wedgeItem(list, texts, label, start) {
    const len = [4.0, 3.5, 3.9, 3.4, 4.0], cuts = []; let from = start || 0;
    list.forEach((deg) => { cuts.push([from, from + deg]); from += deg; });
    const piece = (o, [f, t], i) => [o, at(o, len[i], f), at(o, (len[i] + len[i + 1]) * 0.46, (f + t) / 2), at(o, len[i + 1], t)];
    return {
      pts: [Z].concat(cuts.flatMap((cut, i) => piece(Z, cut, i))), label,
      draw: (o) => cuts.map((cut, i) => styled(G.polygon(piece(o, cut, i)), 'fill:' + TINT[i])).join('') + cuts.map(([f, t], i) => mark(o, f, t, texts[i], { r: 0.75, at: Math.max(1.85, markAt(t - f, 0.75, texts[i].length > 1)), round: true })).join('')
    };
  }
  // 테두리 상자에 맞춰 키우고 옮기는 변환
  function fitter(points, w, h) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), k = Math.min(w / (Math.max(...xs) - x0), h / (Math.max(...ys) - y0));
    return (p) => [(p[0] - x0) * k, (p[1] - y0) * k];
  }
  const fit = (points, w, h) => points.map(fitter(points, w, h));
  // 꼭짓점 i 의 안쪽 각이 차지하는 방향 [from, to]
  function cornerSpan(p, i) {
    const n = p.length, a = G.bearing(p[i], p[(i + n - 1) % n]), b = G.bearing(p[i], p[(i + 1) % n]);
    return Math.max(a, b) - Math.min(a, b) > 180 ? [Math.max(a, b), Math.min(a, b) + 360] : [Math.min(a, b), Math.max(a, b)];
  }
  // 볼록한 도형의 꼭짓점 i 안쪽에 각 표시(직각이면 직각 표시)와 글을 넣는다. 좁은 각의 글은 변과 겹치지 않게 꼭짓점에서 멀리 적는다.
  function corner(p, i, text, q) {
    const [from, to] = cornerSpan(p, i), right = Math.abs(to - from - 90) < 0.01;
    return mark(p[i], right ? Math.round(from * 1e6) / 1e6 : from, right ? Math.round(from * 1e6) / 1e6 + 90 : to, text, Object.assign({ r: 0.6 }, q || {}));
  }
  // 꼭짓점마다 각 표시와 글을 넣은 도형. texts[i]: 글('' 이면 표시만, null 이면 표시하지 않는다)
  // more: { pts(꼭짓점들): 테두리에 넣을 덧점들, draw(옮긴 꼭짓점들, 원점 자리): 덧그림 }
  function shapeItem(pts, texts, label, more) {
    return { pts: pts.concat(more && more.pts ? more.pts(pts) : []), label, draw: (o) => { const p = pts.map((q) => add(q, o)); return G.polygon(p) + texts.map((t, i) => (t === null ? '' : corner(p, i, t))).join('') + (more ? more.draw(p, o) : ''); } };
  }
  // 밑변의 두 각이 left, right 인 삼각형 [왼쪽 아래, 오른쪽 아래, 위]
  const triPts = (left, right, w, h) => fit(G.triangle(left, right, 1, Z), w || 7.8, h || 4.6);
  // 네 각이 A(왼쪽 아래), B(오른쪽 아래), C(오른쪽 위), D(왼쪽 위)인 사각형. 밑변의 길이는 1, 왼쪽 변의 길이는 s 이다.
  function quadRaw(A, B, D, s) {
    const p3 = at(Z, s, A), u1 = at(Z, 1, A + D - 180), u2 = at(Z, 1, 180 - B);
    const dx = 1 - p3[0], dy = -p3[1], det = -u1[0] * u2[1] + u2[0] * u1[1];
    if (Math.abs(det) < 1e-9) return null;
    const p = (-dx * u2[1] + u2[0] * dy) / det, t = (u1[0] * dy - u1[1] * dx) / det;
    return p > 0.05 && t > 0.05 ? [Z, [1, 0], [1 + t * u2[0], t * u2[1]], p3] : null;
  }
  // 변의 길이가 가장 고른 것을 고른다(밑변의 길이 1). 그릴 수 없으면 null.
  function quadBest(A, B, D) {
    let best = null;
    for (let s = 0.3; s <= 1.8; s += 0.05) {
      const q = quadRaw(A, B, D, s); if (!q) continue;
      const sides = q.map((p, i) => Math.hypot(p[0] - q[(i + 1) % 4][0], p[1] - q[(i + 1) % 4][1])), score = Math.min(...sides) / Math.max(...sides);
      if (!best || score > best.score) best = { q, score };
    }
    return best && best.score >= 0.4 ? best.q : null;
  }
  const quadPts = (A, B, D, w, h) => fit(quadBest(A, B, D), w || 7, h || 4.6);
  // 두 선이 만나는 점: p 에서 a° 쪽으로 가는 선과 q 에서 b° 쪽으로 가는 선
  function meet(p, a, q, b) {
    const u = at(Z, 1, a), v = at(Z, 1, b), s = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / (u[0] * v[1] - u[1] * v[0]);
    return [p[0] + s * u[0], p[1] + s * u[1]];
  }
  // 각도기(반지름 5.1칸)와 그 위의 변. rays: 변의 방향(안쪽 눈금의 수와 같다), o: { tag 그림의 이름, label }
  function proBoard(rays, o) {
    const c = [6, 6.05], r = 5.1, parts = [G.protractor(c, r, { rays })];
    if (o.tag) parts.push(G.text([0.4, 0.5], o.tag, 'mb-label is-length'));
    return G.board(12, 6.45, parts, { grid: false, label: o.label });
  }
  // 삼각자. 세 각이 45°·45°·90°인 것(A)과 30°·60°·90°인 것(B). 한 각에서 나가는 두 변의 길이의 비
  const SET = { A: '45°, 45°, 90°', B: '30°, 60°, 90°' };
  const SIDES = { A45: [1, Math.SQRT2], A90: [1, 1], B30: [Math.sqrt(3), 2], B60: [1, 2], B90: [1, Math.sqrt(3)] };
  // 꼭짓점 o 의 각이 deg 이고 가장 긴 변의 길이가 long 인 삼각자 [o, dir 쪽 끝, dir + deg 쪽 끝]. flip: 두 변의 길고 짧음을 바꾼다
  // (두 삼각자의 가장 긴 변을 같게 그리면 어느 쪽도 너무 작아지지 않는다.)
  function setSquare(o, dir, kind, deg, long, flip) {
    const [x, y] = SIDES[kind + deg], s = flip ? [y, x] : [x, y], k = long / (kind === 'A' ? Math.SQRT2 : 2);
    return [o, at(o, s[0] * k, dir), at(o, s[1] * k, dir + deg)];
  }
  const rightMarks = (p) => p.map((_, i) => (Math.abs(G.angleOf(p, i) - 90) < 0.01 ? corner(p, i) : '')).join('');
  // 그림 글 속의 글끼리 겹치지 않는가. 글 상자의 크기는 글자 수로 어림한다(세 자리 각도 32, 두 자리 각도 25, 기호 16).
  function textsClear(svg) {
    const boxes = [...svg.matchAll(/<text[^>]* x="([\d.-]+)" y="([\d.-]+)"[^>]*>([^<]*)<\/text>/g)].map((m) => [Number(m[1]), Number(m[2]), m[3].length > 3 ? 32 : m[3].length > 1 ? 25 : 16]);
    return boxes.every(([x, y, w], i) => boxes.every(([p, q, v], j) => j <= i || Math.abs(x - p) >= (w + v) / 2 || Math.abs(y - q) >= 16));
  }
  // 글끼리 겹치지 않는 그림이 나올 때까지 다시 만든다. make: () => ({ it: 그림 조각, … })
  const drawn = (d, make) => d.until(make, (r) => textsClear(r.it.draw(Z)));
  // 삼각자 여럿을 판 크기에 맞춘다. 돌려주는 것: 옮긴 삼각자들과, 다른 점을 같이 옮기는 변환
  function fitSets(sets, extra, w, h) { const f = fitter([].concat(...sets, extra || []), w, h); return { sets: sets.map((p) => p.map(f)), f }; }

  // ── 각도의 합과 차 ───────────────────────────────────────────
  B.addTypes('4-1-2', 'sum', [
    T('sum-add', '각도의 합', '①56 ②51 ③48 심54', (d) => {
      const [a, b] = d.until(() => [d.int(15, 140), d.int(15, 120)], ([x, y]) => (x % 10) + (y % 10) >= 10 && x !== y && x + y <= 230);
      return N('각도의 합을 구하시오.', a + b, { unit: '°', figure: plus(a, b).html, explain: `자연수의 덧셈과 같은 방법으로 계산한 다음 °를 붙인다. ${plus(a, b).said}`, facts: { calc: [[`${a}+${b}`, 0]] } });
    }),
    T('sum-sub', '각도의 차', '①57 ②51 ③49 심54', (d) => {
      const [a, b] = d.until(() => [d.int(60, 186), d.int(15, 120)], ([x, y]) => x - y >= 15 && x % 10 < y % 10);
      return N('각도의 차를 구하시오.', a - b, { unit: '°', figure: minus(a, b).html, explain: `자연수의 뺄셈과 같은 방법으로 계산한 다음 °를 붙인다. ${minus(a, b).said}`, facts: { calc: [[`${a}-${b}`, 0]] } });
    }),
    T('sum-both', '두 각도의 합과 차', '①58·59·60 ②52 ③50 심54', (d) => {
      const [a, b] = d.until(() => [d.int(60, 150), d.int(20, 85)], ([x, y]) => x - y >= 15);
      return M('두 각도의 합과 차는 각각 몇 도인가?', [{ label: '합', answer: a + b, unit: '°' }, { label: '차', answer: a - b, unit: '°' }], {
        figure: numbers([a + '°', b + '°']), explain: `합: ${plus(a, b).said}, 차: ${minus(a, b).said}`, facts: { calc: [[`${a}+${b}`, 0], [`${a}-${b}`, 1]] }
      });
    }),
    T('sum-fig-add', '이어 붙인 두 각을 합한 각', '②62 ③51 심55·65', (d) => {
      const [a, b] = d.until(() => [d.int(8, 17) * 5, d.int(8, 17) * 5], ([x, y]) => x + y <= 165 && Math.abs(x - y) >= 15 && x + y !== 90);
      const it = fanItem([[0, 4.2], [a, 4.2], [a + b, 4.2]], [[0, a, a + '°', { r: 0.6 }], [a, a + b, b + '°', { r: 0.6 }], [0, a + b, '㉠', { r: 3.1, at: 3.6, halo: '#fff', round: true }]], `한 꼭짓점에서 겹치지 않게 이어 붙인 두 각: ${a}°와 ${b}°. 두 각을 합한 각이 ㉠`);
      return N('두 각을 겹치지 않게 이어 붙였다. 두 각을 합한 각 ㉠의 크기는?', a + b, { unit: '°', figure: single(it, 1.1), explain: `㉠ = ${plus(a, b).said}`, facts: { calc: [[`${a}+${b}`, 0]] } });
    }),
    T('sum-fig-sub', '전체 각에서 한쪽을 뺀 각', '①74 ②63 ③51 심65', (d) => {
      const [whole, part] = d.until(() => [d.int(18, 33) * 5, d.int(8, 17) * 5], ([w, p]) => w - p >= 40 && w - p !== 90 && Math.abs(w - 2 * p) >= 15), first = d.bool(), cut = first ? part : whole - part;
      const it = fanItem([[0, 4.2], [cut, 4.2], [whole, 4.2]], [[0, cut, first ? part + '°' : '㉠', { r: 0.6 }], [cut, whole, first ? '㉠' : part + '°', { r: 0.6 }], [0, whole, whole + '°', { r: 3.1, at: 3.65, halo: '#fff', round: true }]], `한 각을 두 각으로 나눈 그림: 전체 각은 ${whole}°, 나눈 한 각은 ${part}°, 나머지 한 각이 ㉠`);
      return N('큰 각을 두 각으로 나누었다. ㉠의 각도는?', whole - part, { unit: '°', figure: single(it, 1.1), explain: `전체 각에서 한쪽 각을 뺀다. ㉠ = ${minus(whole, part).said}`, facts: { calc: [[`${whole}-${part}`, 0]] } });
    }),
    T('sum-pro-two', '각도기로 잰 두 각의 합과 차', '①62', (d) => {
      const [x, y] = d.until(() => [d.int(5, 31) * 5, d.int(5, 31) * 5], ([p, q]) => Math.abs(p - q) >= 15 && Math.abs(p - 90) >= 15 && Math.abs(q - 90) >= 15);
      const figure = proBoard([0, x], { tag: '가', label: `각도기로 잰 각 가: 한 변은 안쪽 눈금 0에, 나머지 변은 안쪽 눈금 ${x}에 놓여 있다` }) + proBoard([180, 180 - y], { tag: '나', label: `각도기로 잰 각 나: 한 변은 바깥쪽 눈금 0에, 나머지 변은 바깥쪽 눈금 ${y}에 놓여 있다` });
      return M('각 가와 각 나를 각도기로 재고 있다. 두 각도의 합과 차는 각각 몇 도인가?', [{ label: '합', answer: x + y, unit: '°' }, { label: '차', answer: Math.abs(x - y), unit: '°' }], {
        figure, explain: `각 가는 안쪽 눈금을 읽어 ${x}°, 각 나는 바깥쪽 눈금을 읽어 ${y}°이다. 합: ${plus(x, y).said}, 차: ${minus(Math.max(x, y), Math.min(x, y)).said}`,
        facts: { calc: [[`${x}+${y}`, 0], [`${Math.max(x, y)}-${Math.min(x, y)}`, 1]] }
      });
    }),
    T('sum-box', '□가 있는 각도의 식', '①64·73 ②60 심60', (d) => {
      const form = d.pick(['x+b=a', 'b+x=a', 'a-x=c', 'x-b=c']), m = d.int(25, 110), n = d.int(25, 95), blank = '<span class="mb-box"></span>°';
      const [figure, facts, answer, said] = {
        'x+b=a': [expr(blank, '+', n + '°', '=', m + n + '°'), ['x+b=a', m + n, n, 0], m, minus(m + n, n).said],
        'b+x=a': [expr(n + '°', '+', blank, '=', m + n + '°'), ['b+x=a', m + n, n, 0], m, minus(m + n, n).said],
        'a-x=c': [expr(m + n + '°', '-', blank, '=', n + '°'), ['a-x=c', m + n, 0, n], m, minus(m + n, n).said],
        'x-b=c': [expr(blank, '-', n + '°', '=', m + '°'), ['x-b=c', 0, n, m], m + n, plus(m, n).said]
      }[form];
      return N('□ 안에 알맞은 수는?', answer, { figure, explain: `덧셈과 뺄셈의 관계를 이용한다. ${said}이므로 □ 안에 알맞은 수는 ${answer}이다.`, facts: { inverse: facts } });
    }),
    T('sum-compare', '두 식의 계산 결과 비교', '①66 ②55 ③54 심57', (d) => {
      const v = d.int(14, 30) * 5, left = exprOf(d, v, true, 5), right = exprOf(d, v + d.pick([-10, -5, 0, 5, 10]), false, 5);
      return C('계산한 각도의 크기를 비교하여 ○ 안에 알맞은 것을 고르면?', SIGNS, signOf(left.value, right.value), {
        figure: `<div class="mb-versus">${left.html}<span class="mb-ring"></span>${right.html}</div>`, explain: `${left.said}, ${right.said}`, facts: { choose: { exprs: [left.calc, right.calc], rule: 'compare' } }
      });
    }),
    T('sum-max', '계산 결과가 가장 큰(작은) 식', '①67 ②56 ③55 심57', (d) => {
      const base = d.int(18, 28) * 5, most = d.bool(), rows = d.shuffle([0, 5, 10, 15, -5, -10]).slice(0, 4).map((off, i) => exprOf(d, base + off, i % 2 === 0, 5)), values = rows.map((row) => row.value);
      const answer = values.indexOf(most ? Math.max(...values) : Math.min(...values));
      return C(`계산한 각도가 가장 ${most ? '큰' : '작은'} 것은?`, LABELS.slice(0, 4), answer, {
        figure: tagged(rows.map((row) => row.html)), explain: rows.map((row, i) => `${LABELS[i]} ${row.said}`).join(', '), facts: { choose: { exprs: rows.map((row) => row.calc), rule: most ? 'max' : 'min' } }
      });
    }),
    T('sum-order', '계산 결과를 크기 순서로 늘어놓기', '②57 ③56 심57', (d) => {
      const base = d.int(14, 26) * 5, rows = d.shuffle([0, 10, 15, -5, -15]).slice(0, 3).map((off, i) => exprOf(d, base + off, i !== 1, 5)), values = rows.map((row) => row.value);
      const right = [0, 1, 2].sort((x, y) => values[x] - values[y]), list = d.shuffle([right].concat(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3)));
      return C('계산한 각도가 작은 것부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map((row) => row.html)), explain: rows.map((row, i) => `${LABELS[i]} ${row.said}`).join(', '), facts: { choose: { exprs: rows.map((row) => row.calc), rule: 'ascending', orders: list } }
      });
    }),
    T('sum-same', '계산 결과가 같은 두 식', '③57 심54', (d) => {
      const base = d.int(14, 26) * 5, vals = d.shuffle([base, base, base + d.pick([5, 10]), base - d.pick([5, 10])]);
      const rows = d.until(() => vals.map((v, i) => exprOf(d, v, i % 2 === 0, 5)), (list) => new Set(list.map((row) => row.calc)).size === 4), same = [0, 1, 2, 3].filter((i) => vals[i] === base);
      const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], list = d.shuffle([same].concat(d.shuffle(pairs.filter((pair) => pair.join() !== same.join())).slice(0, 3)));
      return C('계산한 각도가 같은 두 식은?', list.map((pair) => pair.map((i) => LABELS[i]).join(', ')), list.findIndex((pair) => pair.join() === same.join()), {
        figure: tagged(rows.map((row) => row.html)), explain: rows.map((row, i) => `${LABELS[i]} ${row.said}`).join(', '), facts: { choose: { exprs: rows.map((row) => row.calc), rule: 'same', pairsShown: list } }
      });
    }),
    T('sum-claim', '각도의 합과 차를 바르게 계산한 사람', '③58', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), good = d.int(0, 2);
      const rows = who.map((_, i) => { const e = exprOf(d, d.int(10, 28) * 5, i !== 1, 5); return { e, said: e.value + (i === good ? 0 : d.pick([-10, 10])) }; });
      return C('각도의 합과 차를 바르게 계산한 사람은?', who, good, {
        figure: lines(rows.map((row, i) => `${who[i]}: ${expr(...row.e.parts, '=', row.said + '°')}`)), explain: '바르게 계산하면 ' + rows.map((row) => row.e.said).join(', ') + '이다.',
        facts: { claimed: rows.map((row) => [row.e.calc, row.said]), claimedWant: true }
      });
    }),
    T('sum-ends', '가장 큰 각도와 가장 작은 각도의 합과 차', '①68 ②59 ③59 심62', (d) => {
      const list = d.shuffle(Array.from({ length: 30 }, (_, i) => 20 + i * 5)).slice(0, 5), big = Math.max(...list), small = Math.min(...list);
      return M('가장 큰 각도와 가장 작은 각도의 합과 차는 각각 몇 도인가?', [{ label: '합', answer: big + small, unit: '°' }, { label: '차', answer: big - small, unit: '°' }], {
        figure: numbers(list.map((v) => v + '°')), explain: `가장 큰 각도는 ${big}°, 가장 작은 각도는 ${small}°이다. 합: ${plus(big, small).said}, 차: ${minus(big, small).said}`,
        facts: { calc: [[`${big}+${small}`, 0], [`${big}-${small}`, 1]] }
      });
    }),
    T('sum-kind-ends', '가장 큰 예각과 가장 작은 둔각의 합', '①69 심63', (d) => {
      const acute = d.shuffle([15, 25, 35, 45, 55, 65, 75, 85]).slice(0, 3), obtuse = d.shuffle([95, 105, 115, 125, 135, 145, 155, 165, 175]).slice(0, 3), a = Math.max(...acute), o = Math.min(...obtuse);
      return N('예각 가운데 가장 큰 각과 둔각 가운데 가장 작은 각의 크기의 합은 몇 도인가?', a + o, {
        unit: '°', figure: numbers(d.shuffle(acute.concat(obtuse)).map((v) => v + '°')), explain: `예각은 ${degs(acute)}이고 이 가운데 가장 큰 각은 ${a}°이다. 둔각은 ${degs(obtuse)}이고 이 가운데 가장 작은 각은 ${o}°이다. ${plus(a, o).said}`,
        facts: { calc: [[`${a}+${o}`, 0]] }
      });
    }),
    T('sum-kind', '계산 결과가 예각인 식', '①43 ②58 심59', (d) => {
      // 90°를 사이에 두고 몰려 있는 값: 예각 하나, 직각 하나, 둔각 둘
      const vals = d.shuffle([d.int(84, 89), 90, d.int(91, 93), d.int(94, 97)]), rows = vals.map((v, i) => exprOf(d, v, i % 2 === 0));
      return C('계산한 각도가 예각인 것은?', LABELS.slice(0, 4), vals.findIndex((v) => v < 90), {
        figure: tagged(rows.map((row) => row.html)), explain: rows.map((row, i) => `${LABELS[i]} ${row.said}`).join(', ') + '. 90°보다 작은 각이 예각이다. 90°는 직각이다.',
        facts: { between: { low: '0', high: '90', exprs: rows.map((row) => row.calc) } }
      });
    }),
    T('sum-right-less', '직각보다 몇 도 작은(큰) 각', '②61', (d) => {
      const k = d.int(3, 13) * 5, less = d.bool();
      return N(`직각보다 ${k}°만큼 더 ${less ? '작은' : '큰'} 각의 크기는 몇 도인가?`, less ? 90 - k : 90 + k, {
        unit: '°', explain: `직각은 90°이다. ${less ? minus(90, k).said : plus(90, k).said}`, facts: { calc: [[less ? `90-${k}` : `90+${k}`, 0]], unseen: [90] }
      });
    }),
    T('sum-right-join', '직각을 이어 붙인 각도', '심64', (d) => {
      const k = d.int(2, 4);
      return N(`직각 ${k}개를 겹치지 않게 이어 붙이면 몇 도가 되는가?`, 90 * k, {
        unit: '°', explain: `직각은 90°이다. ${Array.from({ length: k }, () => '90°').join(' + ')} = ${90 * k}°`, facts: { calc: [[`90*${k}`, 0]], unseen: [90] }
      });
    }),
    T('sum-word-add', '더 펼친 각도', '①72 ②65', (d) => {
      const a = d.int(9, 22) * 5, b = d.int(4, 12) * 5;
      return N(`부채를 ${a}°만큼 펼쳤다가 ${b}°만큼 더 펼쳤다. 부채를 펼친 각도는 모두 몇 도인가?`, a + b, { unit: '°', explain: plus(a, b).said, facts: { calc: [[`${a}+${b}`, 0]] } });
    }),
    T('sum-word-sub', '움직인 각도', '②65 ③62 심54', (d) => {
      const a = d.int(7, 16) * 5, b = a + d.int(3, 10) * 5;
      return N(`독서대를 처음에 ${a}°로 세웠다가 ${b}°가 되도록 더 세웠다. 독서대를 더 세운 각도는 몇 도인가?`, b - a, { unit: '°', explain: `나중 각도에서 처음 각도를 뺀다. ${minus(b, a).said}`, facts: { calc: [[`${b}-${a}`, 0]] } });
    }),
    T('sum-need', '합이 정해진 각도가 되도록 더 벌릴 각도', '②66', (d) => {
      const a = d.int(4, 9) * 5, b = d.int(10, 15) * 5, more = d.int(2, 6) * 5, total = a + b + more;
      return N(`가위 두 개를 각각 ${a}°, ${b}°만큼 벌렸다. 두 가위를 벌린 각도의 합이 ${total}°가 되게 하려면 가위 하나를 몇 도 더 벌려야 하는가?`, more, {
        unit: '°', explain: `지금 벌린 각도의 합은 ${plus(a, b).said}이다. ${minus(total, a + b).said}만큼 더 벌려야 한다.`, facts: { calc: [[`${total}-(${a}+${b})`, 0]] }
      });
    }),
    T('sum-diff-sum', '큰 각과 두 각도의 차를 알 때 합', '②64', (d) => {
      const big = d.int(16, 28) * 5, diff = d.int(4, 10) * 5;
      return N(`크기가 다른 두 각이 있다. 큰 각의 크기는 ${big}°이고 두 각도의 차는 ${diff}°이다. 두 각도의 합은 몇 도인가?`, big + big - diff, {
        unit: '°', explain: `작은 각의 크기는 ${minus(big, diff).said}이다. 두 각도의 합은 ${plus(big, big - diff).said}이다.`, facts: { calc: [[`${big}+(${big}-${diff})`, 0]] }
      });
    }),
    T('sum-set-join', '삼각자 2개를 이어 붙인 각', '①70 ②72 ③60 심69', (d) => {
      const [k1, a1, k2, a2] = d.pick([['A', 45, 'B', 30], ['B', 30, 'A', 45], ['A', 45, 'B', 60], ['B', 60, 'A', 45], ['A', 90, 'B', 30], ['B', 30, 'A', 90], ['B', 90, 'A', 45], ['A', 45, 'B', 90], ['A', 90, 'B', 60]]);
      const t1 = setSquare(Z, 0, k1, a1, 1, d.bool()), t2 = setSquare(Z, a1, k2, a2, 1, d.bool()), fitted = fitSets([t1, t2], [], 7.6, 5);
      const it = {
        pts: [].concat(...fitted.sets), label: `삼각자 2개를 이어 붙인 그림: 한 삼각자의 ${a1}°인 각과 다른 삼각자의 ${a2}°인 각이 한 꼭짓점에 모여 ㉠을 이룬다`,
        draw: (o) => { const [p, q] = fitted.sets.map((s) => s.map((v) => add(v, o))); return G.polygon(p) + styled(G.polygon(q), 'fill:' + TINT[1]) + rightMarks(p) + rightMarks(q) + mark(p[0], 0, a1 + a2, '㉠', { r: 1.05, round: true, halo: TINT[(a1 + a2) / 2 < a1 ? 0 : 1] }); }
      };
      return N(`세 각의 크기가 ${SET.B}인 삼각자와 ${SET.A}인 삼각자를 겹치지 않게 이어 붙였다. ㉠의 각도는?`, a1 + a2, {
        unit: '°', figure: single(it, 1.1), explain: `㉠은 한 삼각자의 ${a1}°인 각과 다른 삼각자의 ${a2}°인 각을 이어 붙인 각이다. ${plus(a1, a2).said}`, facts: { calc: [[`${a1}+${a2}`, 0]] }
      });
    }),
    T('sum-set-overlap', '삼각자 2개를 겹친 각', '②73 ③60 심70', (d) => {
      const [k1, a1, k2, a2] = d.pick([['A', 45, 'B', 30], ['B', 60, 'A', 45], ['A', 90, 'B', 30], ['A', 90, 'B', 60], ['B', 90, 'A', 45]]), gap = a1 - a2;
      const t1 = setSquare(Z, 0, k1, a1, 1, d.bool()), t2 = setSquare(Z, 0, k2, a2, d.pick([0.75, 0.86]), d.bool()), fitted = fitSets([t1, t2], [], 7.6, 5.2), reach = markAt(gap, 0.9, false);
      const it = {
        pts: [].concat(...fitted.sets), label: `삼각자 2개를 한 꼭짓점과 한 변이 맞닿게 겹친 그림: 한 삼각자의 ${a1}°인 각 안에 다른 삼각자의 ${a2}°인 각이 겹쳐 있고, 겹치지 않은 부분의 각이 ㉠`,
        draw: (o) => { const [p, q] = fitted.sets.map((s) => s.map((v) => add(v, o))); return G.polygon(p) + styled(G.polygon(q), 'fill:' + TINT[1]) + G.polygon(p, 'mb-poly is-plain') + rightMarks(p) + rightMarks(q) + mark(p[0], a2, a1, '㉠', { r: reach - 0.5, at: reach, round: true, halo: TINT[0] }); }
      };
      return N(`세 각의 크기가 ${SET.B}인 삼각자와 ${SET.A}인 삼각자를 한 꼭짓점과 한 변이 맞닿도록 겹쳤다. ㉠의 각도는?`, gap, {
        unit: '°', figure: single(it, 1.1), explain: `㉠은 한 삼각자의 ${a1}°인 각에서 다른 삼각자의 ${a2}°인 각을 뺀 각이다. ${minus(a1, a2).said}`, facts: { calc: [[`${a1}-${a2}`, 0]] }
      });
    }),
    T('sum-line-two', '직선 위의 두 각', '②68 심67', (d) => {
      const a = d.until(() => d.int(6, 30) * 5, (v) => v !== 90), right = d.bool(), cut = right ? a : 180 - a;
      const it = fanItem([[0, 3.6], [180, 3.6], [cut, 3.2]], [[0, cut, right ? a + '°' : '㉠'], [cut, 180, right ? '㉠' : a + '°']], `직선 위의 한 점에 모인 두 각: ${a}°와 ㉠`);
      return N('직선 위의 한 점에서 반직선을 하나 그었다. ㉠의 각도는?', 180 - a, {
        unit: '°', figure: single(it, 1.1), explain: `직선 위의 한 점에 모인 각의 크기의 합은 직각 2개와 같은 180°이다. ㉠ = ${minus(180, a).said}`, facts: { calc: [[`180-${a}`, 0]], unseen: [180] }
      });
    }),
    T('sum-line-three', '직선 위의 세 각(직각이 낀 것)', '②68 ③65 심67', (d) => {
      const p = d.int(6, 12) * 5, right = d.bool(), cut = right ? p : 90 - p;
      const it = fanItem([[0, 3.6], [180, 3.6], [cut, 3.2], [cut + 90, 3.2]], [[0, cut, right ? p + '°' : '㉠'], [cut, cut + 90, ''], [cut + 90, 180, right ? '㉠' : p + '°']], `직선 위의 한 점에 모인 세 각: ${p}°, 직각, ㉠`);
      return N('직선 위의 한 점에서 반직선을 두 개 그었다. ㉠의 각도는?', 90 - p, {
        unit: '°', figure: single(it, 1.1), explain: `직선 위의 한 점에 모인 각의 크기의 합은 180°이고, 직각은 90°이다. ㉠ = 180° - 90° - ${p}° = ${90 - p}°`, facts: { calc: [[`180-90-${p}`, 0]], unseen: [180, 90] }
      });
    }),
    T('sum-line-sum', '직선 위에서 양쪽 두 각의 합', '②69', (d) => {
      const [p, b] = d.until(() => [d.int(6, 16) * 5, d.int(8, 20) * 5], ([x, y]) => x !== 90 && y !== 90 && 180 - x - y >= 30 && 180 - x - y !== 90);
      const it = fanItem([[0, 3.6], [180, 3.6], [p, 3.2], [p + b, 3.2]], [[0, p, '㉠'], [p, p + b, b + '°'], [p + b, 180, '㉡']], `직선 위의 한 점에 모인 세 각: ㉠, ${b}°, ㉡`);
      return N('직선 위의 한 점에서 반직선을 두 개 그었다. ㉠과 ㉡의 각도의 합은?', 180 - b, {
        unit: '°', figure: single(it, 1.1), explain: `직선 위의 한 점에 모인 세 각의 크기의 합은 180°이다. ㉠ + ㉡ = ${minus(180, b).said}`, facts: { calc: [[`180-${b}`, 0]], unseen: [180] }
      });
    }),
    T('sum-round', '한 점에 모인 세 각', '②70 심68', (d) => {
      const { a, b, it } = drawn(d, () => {
        const [a, b] = d.until(() => [d.int(14, 30) * 5, d.int(14, 30) * 5], ([x, y]) => 360 - x - y >= 70 && 360 - x - y <= 160 && 360 - x - y !== 90 && x !== 90 && y !== 90), rot = d.pick([0, 20, 200]);
        return { a, b, it: fanItem([[rot, 2.8], [rot + a, 2.8], [rot + a + b, 2.8]], [[rot, rot + a, a + '°'], [rot + a, rot + a + b, b + '°'], [rot + a + b, rot + 360, '㉠']], `한 점에 모인 세 각: ${a}°, ${b}°, ㉠`) };
      });
      return N('한 점에서 반직선을 세 개 그었다. ㉠의 각도는?', 360 - a - b, {
        unit: '°', figure: single(it, 1.1), explain: `한 점을 한 바퀴 돌면 직각 4개와 같은 360°이다. ㉠ = 360° - ${a}° - ${b}° = ${360 - a - b}°`, facts: { calc: [[`360-${a}-${b}`, 0]], unseen: [360] }
      });
    })
  ]);

  // ── 삼각형의 세 각의 크기의 합 ───────────────────────────────
  // 세 각(5의 배수, 모두 lo 이상). 답이 되는 각은 직각이 아니다.
  const triSet = (d, lo) => d.until(() => { const a = d.int(lo / 5, 22) * 5, b = d.int(lo / 5, 22) * 5; return [a, b, 180 - a - b]; }, ([, , c]) => c >= 30 && c !== 90 && c <= 115);
  B.addTypes('4-1-2', 'tri', [
    T('tri-sum', '삼각형의 세 각의 크기의 합', '①76·77 ②80 ③66·68 심76', (d) => {
      const set = d.shuffle(d.pick([[50, 60, 70], [40, 60, 80], [45, 55, 80], [40, 65, 75]]));
      return N('삼각형을 세 조각으로 잘라 세 꼭짓점이 한 점에 모이도록 겹치지 않게 이어 붙였더니 세 각이 직선 위에 꼭 맞게 놓였다. 삼각형의 세 각 ㉠, ㉡, ㉢의 크기의 합은 몇 도인가?', 180, {
        unit: '°', figure: single(wedgeItem(set, LABELS.slice(0, 3), '삼각형의 세 각 ㉠, ㉡, ㉢을 잘라 한 점에 모아 붙인 그림: 세 각이 직선을 이룬다'), 1.1),
        explain: '세 각을 이어 붙이면 직선이 된다. 직선이 이루는 각은 직각 2개와 같은 180°이므로 삼각형의 세 각의 크기의 합은 180°이다.', facts: { calc: [['90+90', 0]], unseen: [90] }
      });
    }),
    T('tri-cut-rest', '잘라 붙인 삼각형의 세 각 가운데 한 각', '①78 ②81 ③69·70', (d) => {
      const [a, b, c] = d.until(() => { const x = d.int(8, 17) * 5, y = d.int(8, 17) * 5; return [x, y, 180 - x - y]; }, (set) => set[2] >= 40 && set[2] <= 100 && set[2] !== 90), at0 = d.int(0, 2);
      const set = [a, b].slice(0, at0).concat([c], [a, b].slice(at0)), texts = set.map((v, i) => (i === at0 ? '㉠' : v + '°'));
      return N('삼각형을 세 조각으로 잘라 세 꼭짓점이 한 점에 모이도록 겹치지 않게 이어 붙였다. ㉠의 각도는?', c, {
        unit: '°', figure: single(wedgeItem(set, texts, `삼각형의 세 각을 잘라 한 점에 모아 붙인 그림: ${texts.join(', ')}`), 1.1),
        explain: `삼각형의 세 각의 크기의 합은 180°이다. ㉠ = 180° - ${a}° - ${b}° = ${c}°`, facts: { calc: [[`180-${a}-${b}`, 0]], unseen: [180] }
      });
    }),
    T('tri-two-fig', '삼각형의 두 각을 보고 나머지 한 각 구하기', '①79·81 ②82 ③71 심77', (d) => {
      const { a, b, c, it } = drawn(d, () => {
        const [a, b, c] = triSet(d, 35), spot = d.int(0, 2), set = [a, b].slice(0, spot).concat([c], [a, b].slice(spot));
        return { a, b, c, it: shapeItem(triPts(set[0], set[1]), set.map((v, i) => (i === spot ? '㉠' : v + '°')), `삼각형: 두 각의 크기는 ${a}°, ${b}°이고 나머지 한 각은 ㉠`) };
      });
      return N('삼각형에서 ㉠의 각도는?', c, { unit: '°', figure: single(it, 1.1), explain: `삼각형의 세 각의 크기의 합은 180°이다. ㉠ = 180° - ${a}° - ${b}° = ${c}°`, facts: { calc: [[`180-${a}-${b}`, 0]], unseen: [180] } });
    }),
    T('tri-two-text', '두 각의 크기를 알 때 나머지 한 각', '①82 ③72 심77', (d) => {
      const [a, b] = d.until(() => [d.int(15, 110), d.int(15, 110)], ([x, y]) => x + y <= 160 && x !== y && (x % 5 !== 0 || y % 5 !== 0));
      return N(`삼각형의 세 각 중 두 각의 크기가 ${a}°, ${b}°이다. 나머지 한 각의 크기는 몇 도인가?`, 180 - a - b, {
        unit: '°', explain: `삼각형의 세 각의 크기의 합은 180°이다. 180° - ${a}° - ${b}° = ${180 - a - b}°`, facts: { calc: [[`180-${a}-${b}`, 0]], unseen: [180] }
      });
    }),
    T('tri-right-fig', '직각삼각형의 한 각을 보고 나머지 한 각 구하기', '③74 심77', (d) => {
      // left: 직각이 왼쪽 아래에 있다. base: 밑변 쪽 예각에 각도를 적고 위쪽 각을 묻는다.
      const { known, it } = drawn(d, () => {
        const a = d.pick([30, 35, 40, 50, 55, 60]), left = d.bool(), base = d.bool(), known = base ? a : 90 - a, texts = [null, null, base ? '㉠' : known + '°'];
        texts[left ? 0 : 1] = ''; texts[left ? 1 : 0] = base ? known + '°' : '㉠';
        return { known, it: shapeItem(triPts(left ? 90 : a, left ? a : 90, 7, 4.4), texts, `직각삼각형: 한 각은 직각, 다른 한 각은 ${known}°, 나머지 한 각은 ㉠`) };
      });
      return N('직각삼각형에서 ㉠의 각도는?', 90 - known, {
        unit: '°', figure: single(it, 1.1), explain: `직각은 90°이고 삼각형의 세 각의 크기의 합은 180°이다. ㉠ = 180° - 90° - ${known}° = ${90 - known}°`, facts: { calc: [[`180-90-${known}`, 0]], unseen: [180, 90] }
      });
    }),
    T('tri-one-sum', '삼각형의 한 각을 보고 나머지 두 각의 합 구하기', '①83 ②85 ③74 심78', (d) => {
      const { g, it } = drawn(d, () => {
        const [g, x, y] = d.until(() => { const p = d.int(8, 25) * 5, q = d.int(6, 20) * 5; return [p, q, 180 - p - q]; }, (set) => set[2] >= 30 && set[0] !== 90 && set[1] !== 90 && set[2] !== 90), spot = d.int(0, 2);
        const set = [x, y].slice(0, spot).concat([g], [x, y].slice(spot)), marks = ['㉠', '㉡'];
        return { g, it: shapeItem(triPts(set[0], set[1]), set.map((v, i) => (i === spot ? g + '°' : marks.shift())), `삼각형: 한 각의 크기는 ${g}°이고 나머지 두 각은 ㉠, ㉡`) };
      });
      return N('삼각형에서 ㉠과 ㉡의 각도의 합은?', 180 - g, {
        unit: '°', figure: single(it, 1.1), explain: `삼각형의 세 각의 크기의 합은 180°이다. ㉠ + ㉡ = ${minus(180, g).said}`, facts: { calc: [[`180-${g}`, 0]], unseen: [180] }
      });
    }),
    T('tri-sum-rest', '두 각의 크기의 합을 알 때 나머지 한 각', '②84 ③73', (d) => {
      const s = d.int(13, 31) * 5;
      return N(`삼각형의 세 각 중 두 각의 크기의 합이 ${s}°이다. 나머지 한 각의 크기는 몇 도인가?`, 180 - s, {
        unit: '°', explain: `삼각형의 세 각의 크기의 합은 180°이다. ${minus(180, s).said}`, facts: { calc: [[`180-${s}`, 0]], unseen: [180] }
      });
    }),
    T('tri-wrong', '삼각형의 세 각을 잘못 잰 사람', '①84 ②86 ③75·76 심81', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), bad = d.int(0, 2), off = d.pick([-10, -5, 5, 10]);
      const rows = who.map((_, i) => { const [a, b] = d.until(() => [d.int(5, 20) * 5, d.int(5, 20) * 5], ([x, y]) => 180 - x - y >= 25); return [a, b, 180 - a - b + (i === bad ? off : 0)]; });
      return C('세 사람이 서로 다른 삼각형의 세 각의 크기를 재었다. 각도를 잘못 잰 사람은?', who, bad, {
        figure: lines(rows.map((row, i) => `${who[i]}: ${degs(row)}`)), explain: `삼각형의 세 각의 크기의 합은 180°이어야 한다. ${name(who[bad], '이/가')} 잰 세 각의 크기의 합은 ${sumOf(rows[bad])}°이다.`,
        facts: { choose: { exprs: rows.map((row) => row.join('+')), rule: 'odd' } }
      });
    }),
    T('tri-rest-kind', '나머지 한 각이 예각·직각·둔각 중 어느 것인지', '②83 심82', (d) => {
      const [a, b] = d.pick([[20, 75], [35, 55], [30, 40], [65, 35], [25, 65], [50, 25], [40, 35], [70, 25]]), c = 180 - a - b, rows = ['예각', '직각', '둔각'].map((word) => [word, word === kindOf(c)]);
      return C(`삼각형의 세 각 중 두 각의 크기가 ${a}°, ${b}°이다. 나머지 한 각은 예각, 직각, 둔각 중 어느 것인가?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `나머지 한 각의 크기는 180° - ${a}° - ${b}° = ${c}°이다. ${c === 90 ? '90°는 직각이다.' : c < 90 ? '90°보다 작으므로 예각이다.' : '90°보다 크고 180°보다 작으므로 둔각이다.'}`, facts: truthOf(rows, true)
      });
    }),
    T('tri-pick-two', '한 각을 알 때 나머지 두 각이 될 수 있는 것', '②87 심79', (d) => {
      // 180°에서 빼지 않고 합이 180°인 짝을 고르는 아이, 주어진 각과 합이 같은 짝을 고르는 아이
      const a = d.pick([40, 50, 70, 80, 100, 110]), rest = 180 - a, p = d.int(4, rest / 5 - 5) * 5, q = d.int(5, 16) * 5, r = d.int(3, a / 5 - 4) * 5;
      const off = rest + 20 === a ? -10 : 10, list = d.shuffle([[p, rest - p], [q, 180 - q], [r, a - r], [p + off, rest - p + off]]);
      return C(`삼각형의 한 각의 크기가 ${a}°이다. 나머지 두 각의 크기가 될 수 있는 것은?`, list.map(degs), list.findIndex(([x, y]) => x + y === rest), {
        explain: `나머지 두 각의 크기의 합은 ${minus(180, a).said}이어야 한다. ${plus(p, rest - p).said}`, facts: { choose: { exprs: list.map(([x, y]) => `${x}+${y}`), rule: 'equals', target: rest } }
      });
    })
  ]);

  // ── 사각형의 네 각의 크기의 합 ───────────────────────────────
  // 네 각(5의 배수)과 답이 되는 꼭짓점. 답이 되는 각은 직각이 아니다.
  const quadSet = (d) => d.until(() => { const A = d.int(12, 24) * 5, Bq = d.int(12, 24) * 5, D = d.int(12, 26) * 5; return [A, Bq, 360 - A - Bq - D, D]; }, (set) => set[2] >= 60 && set[2] <= 135 && quadBest(set[0], set[1], set[3]) !== null);
  B.addTypes('4-1-2', 'quad', [
    T('quad-sum', '사각형의 네 각의 크기의 합', '①89·90 ②80 ③79·81', (d) => {
      const set = d.shuffle(d.pick([[70, 80, 100, 110], [60, 85, 95, 120], [75, 80, 95, 110]]));
      return N('사각형을 네 조각으로 잘라 네 꼭짓점이 한 점에 모이도록 겹치지 않게 이어 붙였더니 네 각이 빈틈없이 한 바퀴를 채웠다. 사각형의 네 각의 크기의 합은 몇 도인가?', 360, {
        unit: '°', figure: single(wedgeItem(set, LABELS.slice(0, 4), '사각형의 네 각 ㉠, ㉡, ㉢, ㉣을 잘라 한 점에 모아 붙인 그림: 네 각이 한 바퀴를 채운다', 20), 1.1),
        explain: '네 각을 이어 붙이면 한 바퀴가 된다. 한 바퀴는 직각 4개와 같은 360°이므로 사각형의 네 각의 크기의 합은 360°이다.', facts: { calc: [['90*4', 0]], unseen: [90, 4] }
      });
    }),
    T('quad-cut-rest', '잘라 붙인 사각형의 네 각 가운데 한 각', '①91 ②96 ③82 심68', (d) => {
      const set = d.until(() => { const x = d.int(13, 24) * 5, y = d.int(13, 24) * 5, z = d.int(13, 24) * 5; return [x, y, z, 360 - x - y - z]; }, (s) => s[3] >= 60 && s[3] <= 125 && s[3] !== 90), spot = d.int(0, 3);
      const list = set.slice(0, 3).slice(0, spot).concat([set[3]], set.slice(0, 3).slice(spot)), texts = list.map((v, i) => (i === spot ? '㉠' : v + '°'));
      return N('사각형을 네 조각으로 잘라 네 꼭짓점이 한 점에 모이도록 겹치지 않게 이어 붙였다. ㉠의 각도는?', set[3], {
        unit: '°', figure: single(wedgeItem(list, texts, `사각형의 네 각을 잘라 한 점에 모아 붙인 그림: ${texts.join(', ')}`, 20), 1.1),
        explain: `사각형의 네 각의 크기의 합은 360°이다. ㉠ = 360° - ${set[0]}° - ${set[1]}° - ${set[2]}° = ${set[3]}°`, facts: { calc: [[`360-${set[0]}-${set[1]}-${set[2]}`, 0]], unseen: [360] }
      });
    }),
    T('quad-split', '삼각형 2개로 나누어 네 각의 크기의 합 구하기', '①92 ②94 ③89·90 심91', (d) => {
      const pts = quadPts(75, 80, 95, 6.4, 4.2), it = shapeItem(pts, [null, null, null, null], '사각형의 마주 보는 두 꼭짓점을 선분으로 이어 삼각형 2개로 나눈 그림', { draw: (p) => G.line(p[0], p[2], 'mb-line is-cut') });
      const rows = d.shuffle([['180° × 2', '180*2'], ['180° × 4', '180*4'], ['90° × 2', '90*2'], ['360° × 2', '360*2']]);
      return C('사각형을 삼각형 2개로 나누었다. 사각형의 네 각의 크기의 합을 구하는 식으로 알맞은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === '180*2'), {
        figure: single(it, 1.1), explain: '사각형의 네 각의 크기의 합은 삼각형 2개의 세 각의 크기의 합과 같다. 180° × 2 = 360°', facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: 360 } }
      });
    }),
    T('quad-three-fig', '사각형의 세 각을 보고 나머지 한 각 구하기', '①94·96 ②97 ③83 심92', (d) => {
      const { set, spot, given, it } = drawn(d, () => {
        const [set, spot] = d.until(() => [quadSet(d), d.int(0, 3)], ([s, i]) => s[i] !== 90), given = set.filter((_, i) => i !== spot);
        return { set, spot, given, it: shapeItem(quadPts(set[0], set[1], set[3]), set.map((v, i) => (i === spot ? '㉠' : v + '°')), `사각형: 세 각의 크기는 ${degs(given)}이고 나머지 한 각은 ㉠`) };
      });
      return N('사각형에서 ㉠의 각도는?', set[spot], {
        unit: '°', figure: single(it, 1.1), explain: `사각형의 네 각의 크기의 합은 360°이다. ㉠ = 360° - ${given.join('° - ')}° = ${set[spot]}°`, facts: { calc: [[`360-${given.join('-')}`, 0]], unseen: [360] }
      });
    }),
    T('quad-three-text', '세 각의 크기를 알 때 나머지 한 각', '①97 ②97 ③84 심92', (d) => {
      const [a, b, c] = d.until(() => [d.int(30, 140), d.int(30, 140), d.int(30, 140)], ([x, y, z]) => 360 - x - y - z >= 30 && 360 - x - y - z <= 150 && new Set([x, y, z]).size === 3 && (x + y + z) % 5 === 0);
      return N(`사각형의 네 각 중 세 각의 크기가 ${a}°, ${b}°, ${c}°이다. 나머지 한 각의 크기는 몇 도인가?`, 360 - a - b - c, {
        unit: '°', explain: `사각형의 네 각의 크기의 합은 360°이다. 360° - ${a}° - ${b}° - ${c}° = ${360 - a - b - c}°`, facts: { calc: [[`360-${a}-${b}-${c}`, 0]], unseen: [360] }
      });
    }),
    T('quad-two-sum', '사각형의 두 각을 보고 나머지 두 각의 합 구하기', '①98 ②99 ③85·93 심93', (d) => {
      const { p, q, it } = drawn(d, () => {
        const [set, pair] = d.until(() => [quadSet(d), d.pick([[0, 1], [1, 2], [2, 3], [0, 3], [0, 2], [1, 3]])], ([s, [i, j]]) => s.every((v, k) => k === i || k === j || v !== 90)), marks = ['㉠', '㉡'];
        return { p: set[pair[0]], q: set[pair[1]], it: shapeItem(quadPts(set[0], set[1], set[3]), set.map((v, i) => (pair.includes(i) ? v + '°' : marks.shift())), `사각형: 두 각의 크기는 ${set[pair[0]]}°, ${set[pair[1]]}°이고 나머지 두 각은 ㉠, ㉡`) };
      });
      return N('사각형에서 ㉠과 ㉡의 각도의 합은?', 360 - p - q, {
        unit: '°', figure: single(it, 1.1), explain: `사각형의 네 각의 크기의 합은 360°이다. ㉠ + ㉡ = 360° - ${p}° - ${q}° = ${360 - p - q}°`, facts: { calc: [[`360-${p}-${q}`, 0]], unseen: [360] }
      });
    }),
    T('quad-sum-sum', '두 각의 크기의 합을 알 때 나머지 두 각의 합', '①99', (d) => {
      const s = d.int(24, 46) * 5;
      return N(`사각형의 네 각 중 두 각의 크기의 합이 ${s}°이다. 나머지 두 각의 크기의 합은 몇 도인가?`, 360 - s, {
        unit: '°', explain: `사각형의 네 각의 크기의 합은 360°이다. ${minus(360, s).said}`, facts: { calc: [[`360-${s}`, 0]], unseen: [360] }
      });
    }),
    T('quad-one-sum', '한 각의 크기를 알 때 나머지 세 각의 합', '①100', (d) => {
      const a = d.until(() => d.int(45, 150), (v) => v % 10 !== 0);
      return N(`사각형의 한 각의 크기가 ${a}°이다. 나머지 세 각의 크기의 합은 몇 도인가?`, 360 - a, {
        unit: '°', explain: `사각형의 네 각의 크기의 합은 360°이다. ${minus(360, a).said}`, facts: { calc: [[`360-${a}`, 0]], unseen: [360] }
      });
    }),
    T('quad-wrong', '사각형의 네 각을 바르게 잰 사람', '①102 ②100 ③87 심94', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), good = d.int(0, 2), offs = d.shuffle([-10, -5, 5, 10]);
      const rows = who.map((_, i) => { const [a, b, c] = d.until(() => [d.int(9, 28) * 5, d.int(9, 28) * 5, d.int(9, 28) * 5], ([x, y, z]) => 360 - x - y - z >= 45 && 360 - x - y - z <= 150); return [a, b, c, 360 - a - b - c + (i === good ? 0 : offs[i])]; });
      return C('세 사람이 서로 다른 사각형의 네 각의 크기를 재었다. 각도를 바르게 잰 사람은?', who, good, {
        figure: lines(rows.map((row, i) => `${who[i]}: ${degs(row)}`)), explain: `사각형의 네 각의 크기의 합은 360°이어야 한다. 네 각의 크기의 합은 ${rows.map((row, i) => `${who[i]} ${sumOf(row)}°`).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map((row) => row.join('+')), rule: 'equals', target: 360 } }
      });
    }),
    T('quad-rest-kind', '나머지 한 각이 예각·직각·둔각 중 어느 것인지', '①44 ②98', (d) => {
      const [a, b, c] = d.pick([[65, 115, 85], [75, 130, 70], [55, 105, 85], [80, 95, 95], [110, 70, 90], [120, 100, 85], [70, 125, 85], [95, 100, 105]]), rest = 360 - a - b - c, rows = ['예각', '직각', '둔각'].map((word) => [word, word === kindOf(rest)]);
      return C(`사각형의 네 각 중 세 각의 크기가 ${a}°, ${b}°, ${c}°이다. 나머지 한 각은 예각, 직각, 둔각 중 어느 것인가?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `나머지 한 각의 크기는 360° - ${a}° - ${b}° - ${c}° = ${rest}°이다. ${rest === 90 ? '90°는 직각이다.' : rest < 90 ? '90°보다 작으므로 예각이다.' : '90°보다 크고 180°보다 작으므로 둔각이다.'}`, facts: truthOf(rows, true)
      });
    }),
    T('quad-rect-cut', '직사각형을 잘라 만든 사각형의 각', '심100·109', (d) => {
      const acute = d.pick([40, 50, 55, 60, 65, 70]), askAcute = d.bool(), given = askAcute ? 180 - acute : acute;
      const it = shapeItem(quadPts(90, acute, 90, 6.6, 3.6), ['', askAcute ? '㉠' : acute + '°', askAcute ? given + '°' : '㉠', ''], `직사각형을 잘라 만든 사각형: 두 각은 직각, 한 각은 ${given}°, 나머지 한 각은 ㉠`);
      return N('직사각형 모양의 종이를 곧게 한 번 잘라 사각형을 만들었다. ㉠의 각도는?', 180 - given, {
        unit: '°', figure: single(it, 1.1), explain: `직사각형의 각이었던 두 각은 직각이다. 사각형의 네 각의 크기의 합은 360°이므로 ㉠ = 360° - 90° - 90° - ${given}° = ${180 - given}°`,
        facts: { calc: [[`360-90-90-${given}`, 0]], unseen: [360, 90] }
      });
    }),
    T('quad-two-tri', '삼각형 2개를 이어 붙인 사각형의 각', '②105 심95', (d) => {
      // 삼각형 둘이 가로로 놓인 변을 맞대고 있다. 왼쪽 꼭짓점의 각은 q(위 삼각형)와 p(아래 삼각형)로 나뉘어 적혀 있고, 오른쪽 꼭짓점의 각이 ㉠이다.
      const { p, b, q, e, c1, c2, it } = drawn(d, () => {
        const [p, b, q, e] = d.until(() => [d.int(9, 12) * 5, d.int(12, 16) * 5, d.int(9, 12) * 5, d.int(12, 16) * 5], ([x, y, z, w]) => 180 - x - y >= 40 && 180 - z - w >= 40 && 360 - x - y - z - w !== 90 && 360 - x - y - z - w <= 145 && x !== z && y !== w);
        const c1 = 180 - p - b, c2 = 180 - q - e, up = G.triangle(q, c2, 1, Z), down = G.triangle(p, c1, 1, Z).map(([x, y]) => [x, -y]), f = fitter(up.concat(down), 7.4, 7.2), [L, R, top, low] = [Z, [1, 0], up[2], down[2]].map(f);
        return {
          p, b, q, e, c1, c2, it: {
            pts: [L, R, top, low], label: `삼각형 2개를 이어 붙여 만든 사각형: 한 꼭짓점의 각은 ${p}°와 ${q}°로 나뉘어 있고, 두 각은 ${b}°, ${e}°, 나머지 한 각이 ㉠`,
            draw: (o) => {
              const [l, r, t, w] = [L, R, top, low].map((v) => add(v, o)), quad = [l, w, r, t];
              return G.polygon(quad) + G.line(l, r) + mark(l, 0, q, q + '°', { r: 0.9 }) + mark(l, 360 - p, 360, p + '°', { r: 0.9 }) + corner(quad, 1, b + '°') + corner(quad, 3, e + '°') + mark(r, 180 - c2, 180 + c1, '㉠', { r: 0.7, round: true, halo: TINT[0] });
            }
          }
        };
      });
      return N('삼각형 2개를 한 변이 맞닿게 이어 붙여 사각형을 만들었다. ㉠의 각도는?', c1 + c2, {
        unit: '°', figure: single(it, 1.1), explain: `사각형의 네 각의 크기의 합은 360°이다. 왼쪽 꼭짓점의 각은 ${plus(p, q).said}이므로 ㉠ = 360° - ${p + q}° - ${b}° - ${e}° = ${c1 + c2}°`,
        facts: { calc: [[`360-(${p}+${q})-${b}-${e}`, 0]], unseen: [360] }
      });
    })
  ]);

  // ── 실력 문항 ────────────────────────────────────────────────
  // 한 변을 늘인 삼각형·사각형: 오른쪽 아래 꼭짓점(p[1])에서 밑변을 오른쪽으로 늘이고, 바깥쪽 각(늘인 선과 옆 변 사이)에 글을 적는다.
  const extended = (inner, text) => ({ pts: (pts) => [add(pts[1], [2, 0]), add(pts[1], markSpot([0, 180 - inner, text, { r: 0.6 }]))], draw: (p) => G.line(p[1], add(p[1], [2, 0])) + mark(p[1], 0, 180 - inner, text, { r: 0.6, round: true }) });
  const halfClock = (h) => { const gap = Math.abs(h * 30 + 15 - 180); return Math.min(gap, 360 - gap); };

  B.addGroup('4-1-2', {
    id: 'hard', title: '단원 종합', standard: DEG,
    types: [
      H('h-long-sides', '변의 길이가 다른 세 각의 크기 비교', '8, 기본 ②8 ③6', (d) => {
        // 변이 가장 긴 각을 가장 작게, 변이 가장 짧은 각을 가장 크게 그렸다. 변의 길이로 판단하는 아이는 첫째나 둘째 보기를 고른다.
        const set = d.pick([[35, 70, 120], [40, 65, 130], [30, 75, 125]]), order = d.shuffle([0, 1, 2]), specs = order.map((k) => ({ deg: set[k], rot: d.pick([0, 15, 200, 335]), a: [3.3, 2.4, 1.5][k] }));
        const long = TAGS[order.indexOf(0)], short = TAGS[order.indexOf(2)];
        const rows = d.shuffle([[`변의 길이가 가장 긴 각 ${long}의 크기가 가장 크다.`, false], [`변의 길이가 가장 짧은 각 ${short}의 크기가 가장 작다.`, false], [`두 변이 가장 많이 벌어진 각 ${short}의 크기가 가장 크다.`, true], ['변의 길이가 서로 다르므로 세 각의 크기를 비교할 수 없다.', false]]);
        return C('세 각의 크기를 비교한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          figure: tilesOf(specs.map((s, i) => angleItem(s, `각 ${TAGS[i]}: ${s.deg}°`)), TAGS), explain: `각의 크기는 변의 길이와 관계없이 두 변이 벌어진 정도이다. 변은 가장 짧지만 두 변이 가장 많이 벌어진 각 ${short}의 크기가 가장 크다.`,
          facts: truthOf(rows, true)
        });
      }, { standard: KIND }),
      H('h-pro-offset', '0이 아닌 눈금에서 시작한 각 읽기', '13, 기본 ③14', (d) => {
        // 끝 눈금을 그대로 읽는 아이(q), 바깥쪽 눈금으로 읽는 아이(180 - p), 두 눈금을 더하는 아이(p + q)
        const [p, q] = d.until(() => [d.int(4, 14) * 5, d.int(16, 32) * 5], ([x, y]) => y - x >= 35 && new Set([y - x, y, 180 - x, x + y]).size === 4 && x + y <= 180);
        const list = d.shuffle([q - p, q, 180 - p, p + q]);
        return C('각도기의 밑금에 각의 변을 맞추지 않고 각도를 재었다. 각도를 바르게 읽은 것은?', list.map((v) => v + '°'), list.indexOf(q - p), {
          figure: proBoard([p, q], { label: `각도기: 각의 두 변이 안쪽 눈금 ${josa(p, '과/와')} ${q}에 놓여 있다(바깥쪽 눈금으로는 ${josa(180 - p, '과/와')} ${180 - q}). 눈금 0에 놓인 변은 없다` }),
          explain: `한 변이 눈금 0에 놓여 있지 않으므로 두 변이 가리키는 눈금의 차를 구한다. 안쪽 눈금으로 ${minus(q, p).said}이다. 끝 눈금 ${josa(q, '을/를')} 그대로 읽으면 틀린다.`,
          facts: { pick: { expr: `${q}-${p}`, options: list } }
        });
      }),
      H('h-tri-big', '크기가 다른 두 삼각형의 세 각의 크기의 합', '83, 기본 ①85·101', (d) => {
        // 큰 삼각형의 합이 더 크다고 여기는 아이, 둔각이 있으면 합이 더 크다고 여기는 아이
        const bigFirst = d.bool(), big = triPts(50, 60, 4.2, 3.6), small = triPts(30, 35, 2.6, 1.5), tags = bigFirst ? ['가', '나'] : ['나', '가'];
        const items = [shapeItem(big, [null, null, null], `삼각형 ${tags[0]}: 큰 삼각형, 세 각은 50°, 60°, 70°`), shapeItem(small, [null, null, null], `삼각형 ${tags[1]}: 작은 삼각형, 세 각은 30°, 35°, 115°`)];
        const rows = d.shuffle([['두 삼각형의 세 각의 크기의 합은 같다.', true], [`더 큰 삼각형 ${tags[0]}의 세 각의 크기의 합이 더 크다.`, false], [`둔각이 있는 삼각형 ${tags[1]}의 세 각의 크기의 합이 더 크다.`, false], ['세 각을 모두 재어 보기 전에는 알 수 없다.', false]]);
        return C('삼각형 가와 나의 세 각의 크기의 합을 바르게 비교한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          figure: tilesOf(bigFirst ? items : [items[1], items[0]], TAGS), explain: '삼각형의 세 각의 크기의 합은 삼각형의 크기나 모양과 관계없이 언제나 180°이다.', facts: truthOf(rows, true)
        });
      }, { standard: SUMS }),
      H('h-tri-true', '삼각형의 각에 대한 설명', '82', (d) => {
        // 한 삼각형에 둔각이나 직각이 둘 있을 수 있다고 여기는 아이
        // 옳은 설명과 정면으로 맞서는 틀린 설명은 함께 내지 않는다(둘을 견주면 답이 좁혀진다).
        const [good, clash] = d.pick([['세 각이 모두 예각인 삼각형이 있다.', -1], ['직각삼각형에서 직각이 아닌 두 각의 크기의 합은 90°이다.', -1], ['한 삼각형에 둔각은 1개까지만 있을 수 있다.', 0]]);
        const bad = d.shuffle(['둔각이 2개인 삼각형이 있다.', '직각이 2개인 삼각형이 있다.', '예각이 1개뿐인 삼각형이 있다.', '두 각의 크기가 100°, 80°인 삼각형이 있다.'].filter((_, i) => i !== clash)).slice(0, 3), rows = d.shuffle([[good, true]].concat(bad.map((text) => [text, false])));
        return C('삼각형에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          explain: '삼각형의 세 각의 크기의 합은 180°이다. 직각이나 둔각이 2개이면 두 각의 크기의 합만으로 180°이거나 180°보다 크므로 삼각형이 될 수 없다. 그래서 삼각형에는 예각이 적어도 2개 있다.', facts: truthOf(rows, true)
        });
      }, { standard: SUMS }),
      H('h-clock-half', '30분인 시각에 두 바늘이 이루는 각', '41, 기본 ①37 ②35·36 ③31', (d) => {
        // 30분에도 짧은바늘이 숫자를 그대로 가리킨다고 여기는 아이는 3시 30분과 9시 30분을 직각으로 본다.
        const [good, trap] = d.pick([[[3, '예각'], [9, '직각']], [[9, '둔각'], [3, '직각']]]), h = good[0];
        const rows = d.shuffle([good, trap].concat(d.shuffle([[4, '둔각'], [1, '예각'], [10, '예각'], [7, '둔각']]).slice(0, 2))).map(([hour, word]) => [`${hour}시 30분에는 ${word}이다.`, kindOf(halfClock(hour)) === word]);
        return C('시계의 긴바늘과 짧은바늘이 이루는 작은 쪽의 각에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          explain: `30분에는 긴바늘이 6을 가리키고 짧은바늘은 두 숫자의 가운데에 있다. ${h}시 30분에 짧은바늘은 ${josa(h, '과/와')} ${h + 1}의 가운데에 있으므로 두 바늘 사이는 큰 눈금 ${h === 3 ? '2칸 반' : '3칸 반'}이다. 직각인 3칸보다 ${h === 3 ? '좁으므로 예각' : '넓으므로 둔각'}이다.`,
          facts: truthOf(rows, true)
        });
      }, { standard: KIND }),
      H('h-two-rights', '겹쳐진 두 직각', '기본 ②71', (d) => {
        const x = d.pick([25, 30, 35, 40, 50, 55, 60, 65]), whole = 90 + x;
        const it = fanItem([[0, 3.2, 'ㄱ'], [x, 3.2, 'ㄴ'], [90, 3.2, 'ㄷ'], [whole, 3.2, 'ㄹ']], [], '한 점 ㅁ에서 그은 변 ㅁㄱ, ㅁㄴ, ㅁㄷ, ㅁㄹ이 차례로 놓여 있다', 'ㅁ');
        return N(`각 ㄱㅁㄷ과 각 ㄴㅁㄹ은 모두 직각이고, 각 ㄱㅁㄹ의 크기는 ${whole}°이다. 각 ㄴㅁㄷ의 크기는 몇 도인가?`, 90 - x, {
          unit: '°', figure: single(it, 1.15), explain: `각 ㄷㅁㄹ의 크기는 ${minus(whole, 90).said}이다. 각 ㄴㅁㄹ이 직각이므로 각 ㄴㅁㄷ의 크기는 ${minus(90, x).said}이다.`,
          facts: { calc: [[`90-(${whole}-90)`, 0]], unseen: [90] }
        });
      }),
      H('h-clock-deg', '정각에 두 바늘이 이루는 각도', '46', (d) => {
        const h = d.pick([2, 4, 5, 7, 8, 10]), gap = Math.min(h, 12 - h);
        return N('시계의 큰 눈금 3칸이 이루는 각은 직각이다. 시계가 나타내는 시각에 긴바늘과 짧은바늘이 이루는 작은 쪽의 각도는?', gap * 30, {
          unit: '°', figure: G.clock(h, 0), explain: `큰 눈금 3칸이 90°이므로 한 칸은 30°이다. ${h}시에 두 바늘 사이는 큰 눈금 ${gap}칸이므로 30°를 ${gap}번 더한 ${gap * 30}°이다.`,
          facts: { calc: [[h <= 6 ? `90/3*${h}` : `90/3*(12-${h})`, 0]], unseen: [90, 12] }
        });
      }),
      H('h-set-rest', '두 각만 적힌 삼각형 모양의 자 2개를 이어 붙인 각', '기본 ③61', (d) => {
        // 자마다 맞닿은 꼭짓점의 각은 적혀 있지 않다. 삼각형의 세 각의 크기의 합으로 그 각을 먼저 구한다.
        const { a1, a2, rest, it } = drawn(d, () => {
          const [k1, a1, k2, a2] = d.pick([['B', 60, 'A', 90], ['B', 30, 'A', 45], ['B', 60, 'A', 45], ['B', 30, 'A', 90], ['A', 90, 'B', 60], ['A', 45, 'B', 30], ['A', 45, 'B', 60], ['A', 90, 'B', 30]]);
          const t1 = setSquare(Z, 0, k1, a1, 1, d.bool()), t2 = setSquare(Z, a1, k2, a2, 1, d.bool()), fitted = fitSets([t1, t2], [], 8.4, 5.6);
          const others = (tri) => [1, 2].map((i) => Math.round(G.angleOf(tri, i))), rest = [others(t1), others(t2)], shown = (v) => (v === 90 ? '직각' : v + '°');
          return {
            a1, a2, rest, it: {
              pts: [].concat(...fitted.sets), label: `삼각형 모양의 자 2개를 이어 붙인 그림: 한 자의 두 각은 ${rest[0].map(shown).join(', ')}, 다른 자의 두 각은 ${rest[1].map(shown).join(', ')}. 두 자의 나머지 각을 이어 붙인 각이 ㉠`,
              draw: (o) => {
                const [p, q] = fitted.sets.map((s) => s.map((v) => add(v, o))), corners = (tri, list) => [1, 2].map((i) => corner(tri, i, list[i - 1] === 90 ? '' : list[i - 1] + '°')).join('');
                return G.polygon(p) + styled(G.polygon(q), 'fill:' + TINT[1]) + corners(p, rest[0]) + corners(q, rest[1]) + mark(p[0], 0, a1 + a2, '㉠', { r: 0.95, round: true, halo: TINT[(a1 + a2) / 2 < a1 ? 0 : 1] });
              }
            }
          };
        });
        return N('삼각형 모양의 자 2개를 한 꼭짓점이 맞닿도록 겹치지 않게 이어 붙였다. ㉠의 각도는?', a1 + a2, {
          unit: '°', figure: single(it, 1.05), explain: `삼각형의 세 각의 크기의 합은 180°이다. 한 자의 나머지 각은 180° - ${rest[0][0]}° - ${rest[0][1]}° = ${a1}°, 다른 자의 나머지 각은 180° - ${rest[1][0]}° - ${rest[1][1]}° = ${a2}°이다. ㉠ = ${plus(a1, a2).said}`,
          facts: { calc: [[`(180-${rest[0][0]}-${rest[0][1]})+(180-${rest[1][0]}-${rest[1][1]})`, 0]], unseen: [180, 90] }
        });
      }, { standard: SUMS }),
      H('h-set-line', '삼각자 2개를 직선 위에 놓았을 때 사이의 각', '71', (d) => {
        const [k1, a1, k2, a2] = d.pick([['B', 30, 'A', 45], ['B', 60, 'A', 45], ['A', 45, 'B', 30], ['A', 45, 'B', 60]]), gap = 180 - a1 - a2;
        const t1 = setSquare(Z, 0, k1, a1, 1, d.bool()), t2 = setSquare(Z, 180 - a2, k2, a2, 1, d.bool()), xs = t1.concat(t2).map((v) => v[0]), ends = [[Math.min(...xs) - 0.2, 0], [Math.max(...xs) + 0.2, 0]], fitted = fitSets([t1, t2], ends, 9.4, 4.8);
        const it = {
          pts: [].concat(...fitted.sets, ends.map(fitted.f)), label: `직선 위의 한 점에 삼각자 2개의 꼭짓점을 모은 그림: 한 삼각자의 ${a1}°인 각과 다른 삼각자의 ${a2}°인 각이 직선에 닿아 있고, 두 삼각자 사이의 각이 ㉠`,
          draw: (o) => { const [p, q] = fitted.sets.map((s) => s.map((v) => add(v, o))), [e1, e2] = ends.map(fitted.f).map((v) => add(v, o)); return G.line(e1, e2) + G.polygon(p) + styled(G.polygon(q), 'fill:' + TINT[1]) + rightMarks(p) + rightMarks(q) + mark(p[0], a1, 180 - a2, '㉠', { r: 0.75, round: true }); }
        };
        return N(`세 각의 크기가 ${SET.B}인 삼각자와 ${SET.A}인 삼각자를 한 꼭짓점이 맞닿도록 직선 위에 놓았다. ㉠의 각도는?`, gap, {
          unit: '°', figure: single(it, 1.05), explain: `직선 위의 한 점에 모인 각의 크기의 합은 180°이다. 직선에 닿은 두 삼각자의 각은 ${a1}°와 ${a2}°이므로 ㉠ = 180° - ${a1}° - ${a2}° = ${gap}°`,
          facts: { calc: [[`180-${a1}-${a2}`, 0]], unseen: [180] }
        });
      }),
      H('h-set-cross', '삼각자 2개를 겹쳤을 때 비스듬한 두 변이 이루는 각', '72, 기본 ①86', (d) => {
        // 왼쪽 삼각자의 45°인 각과 오른쪽 삼각자의 30°(60°)인 각이 한 직선 위에 있다. 두 삼각자의 비스듬한 변과 그 직선이 삼각형을 이룬다.
        const beta = d.pick([30, 60]), q = beta === 30 ? 7 : 5.2, a = beta === 30 ? 4.4 : 3.75, l = beta === 30 ? 2.05 : 2.75, tan = Math.tan(beta * RAD), x = (q * tan) / (1 + tan);
        const A = [[0, 0], [a, 0], [a, -a]], Bt = [[q, 0], [l, 0], [l, -(q - l) * tan]], X = [x, -x], f = fitter(A.concat(Bt), 8.6, 5.2);
        const it = {
          pts: A.concat(Bt).map(f), label: `한 변이 같은 직선 위에 놓이도록 겹친 삼각자 2개: 두 삼각자의 비스듬한 변과 아래쪽 직선이 삼각형을 이룬다. 그 삼각형의 두 각은 45°, ${beta}°이고 나머지 한 각이 ㉠`,
          draw: (o) => {
            const p = A.map(f).map((v) => add(v, o)), r = Bt.map(f).map((v) => add(v, o)), cross = add(f(X), o);
            return G.polygon(p) + styled(G.polygon(r), 'fill:' + TINT[1]) + G.polygon(p, 'mb-poly is-plain') + corner(p, 1, '') + corner(r, 1, '') + mark(p[0], 0, 45, '45°', { r: 0.8, at: 1.5 }) + mark(r[0], 180 - beta, 180, beta + '°', { r: 0.8, at: beta === 30 ? 2.2 : 1.3 }) + mark(cross, 225, 360 - beta, '㉠', { r: 0.6, round: true });
          }
        };
        return N('삼각자 2개를 한 변이 같은 직선 위에 놓이도록 겹쳤다. 두 삼각자의 비스듬한 변이 만나 이루는 ㉠의 각도는?', 135 - beta, {
          unit: '°', figure: single(it, 1.05), explain: `두 삼각자의 비스듬한 변과 아래쪽 직선으로 둘러싸인 삼각형의 두 각의 크기는 45°, ${beta}°이다. 삼각형의 세 각의 크기의 합은 180°이므로 ㉠ = 180° - 45° - ${beta}° = ${135 - beta}°`,
          facts: { calc: [[`180-45-${beta}`, 0]], unseen: [180] }
        });
      }, { standard: SUMS }),
      H('h-tri-ext', '삼각형의 두 각을 보고 바깥쪽 각 구하기', '84·87, 기본 ②88', (d) => {
        const { l, t, r, it } = drawn(d, () => {
          const [l, t, r] = d.until(() => { const x = d.int(8, 16) * 5, y = d.int(8, 16) * 5; return [x, y, 180 - x - y]; }, (set) => set[2] >= 40 && set[2] <= 110 && set[2] !== 90);
          return { l, t, r, it: shapeItem(triPts(l, r, 6, 4.4), [l + '°', null, t + '°'], `한 변을 늘인 삼각형: 두 각의 크기는 ${l}°, ${t}°이고, 나머지 한 각의 바깥쪽에 생긴 각이 ㉠`, extended(r, '㉠')) };
        });
        return N('삼각형의 한 변을 길게 늘였다. ㉠의 각도는?', 180 - r, {
          unit: '°', figure: single(it, 1.1), explain: `삼각형의 나머지 한 각의 크기는 180° - ${l}° - ${t}° = ${r}°이다. 직선 위의 한 점에 모인 각의 크기의 합은 180°이므로 ㉠ = ${minus(180, r).said}`,
          facts: { calc: [[`180-(180-${l}-${t})`, 0]], unseen: [180] }
        });
      }, { standard: SUMS }),
      H('h-tri-ext-in', '바깥쪽 각과 한 각을 보고 삼각형의 나머지 각 구하기', '85, 기본 ②89', (d) => {
        const { l, t, r, outer, it } = drawn(d, () => {
          const [l, t, r] = d.until(() => { const x = d.int(7, 16) * 5, y = d.int(7, 18) * 5; return [x, y, 180 - x - y]; }, (set) => set[2] >= 40 && set[2] <= 110 && set[1] !== 90 && set[2] !== 90), outer = 180 - r;
          return { l, t, r, outer, it: shapeItem(triPts(l, r, 6, 4.4), [l + '°', null, '㉠'], `한 변을 늘인 삼각형: 한 각의 크기는 ${l}°, 다른 한 각의 바깥쪽에 생긴 각의 크기는 ${outer}°, 나머지 한 각이 ㉠`, extended(r, outer + '°')) };
        });
        return N('삼각형의 한 변을 길게 늘였더니 바깥쪽에 생긴 각의 크기가 그림과 같았다. ㉠의 각도는?', t, {
          unit: '°', figure: single(it, 1.1), explain: `바깥쪽 각과 이웃한 삼각형의 각의 크기는 ${minus(180, outer).said}이다. ㉠ = 180° - ${l}° - ${r}° = ${t}°`,
          facts: { calc: [[`180-${l}-(180-${outer})`, 0]], unseen: [180] }
        });
      }, { standard: SUMS }),
      H('h-tri-split', '삼각형 안에 그은 선분이 나눈 각', '기본 ②90', (d) => {
        // 오른쪽 아래 꼭짓점에서 마주 보는 변에 선분을 그었다. 그 꼭짓점의 각이 x 와 ㉠으로 나뉜다.
        const { l, t, x, r, it } = drawn(d, () => {
          const [l, t, x] = d.until(() => [d.pick([40, 45, 50, 55]), d.pick([40, 45, 50, 55]), d.int(8, 11) * 5], ([a, b, c]) => 180 - a - b - c >= 30 && 180 - a - b - c !== c), r = 180 - l - t;
          return {
            l, t, x, r, it: shapeItem(triPts(l, r, 7.4, 5.2), [l + '°', null, t + '°'], `삼각형의 한 꼭짓점에서 마주 보는 변에 선분을 그은 그림: 삼각형의 두 각은 ${l}°, ${t}°이고, 나머지 한 각은 선분으로 ${x}°와 ㉠으로 나뉜다`, {
              draw: (p) => G.line(p[1], meet(p[1], 180 - x, p[0], l)) + mark(p[1], 180 - x, 180, x + '°', { r: 1.15 }) + mark(p[1], 180 - r, 180 - x, '㉠', { r: 0.85, round: true })
            })
          };
        });
        return N('삼각형의 한 꼭짓점에서 마주 보는 변에 선분을 그었다. ㉠의 각도는?', r - x, {
          unit: '°', figure: single(it, 1.1), explain: `삼각형의 나머지 한 각의 크기는 180° - ${l}° - ${t}° = ${r}°이다. 이 각이 ${x}°와 ㉠으로 나뉘므로 ㉠ = ${minus(r, x).said}`,
          facts: { calc: [[`180-${l}-${t}-${x}`, 0]], unseen: [180] }
        });
      }, { standard: SUMS }),
      H('h-tri-equal', '한 각을 알고 나머지 두 각의 크기가 같을 때', '80', (d) => {
        const a = d.pick([20, 30, 40, 50, 70, 80, 100, 110, 120, 130]);
        return N(`삼각형의 한 각의 크기가 ${a}°이고 나머지 두 각의 크기는 서로 같다. 크기가 같은 두 각 가운데 한 각의 크기는 몇 도인가?`, (180 - a) / 2, {
          unit: '°', explain: `나머지 두 각의 크기의 합은 ${minus(180, a).said}이다. 두 각의 크기가 같으므로 한 각의 크기는 ${180 - a}°의 절반인 ${(180 - a) / 2}°이다.`,
          facts: { calc: [[`(180-${a})/2`, 0]], unseen: [180, 2] }
        });
      }, { standard: SUMS }),
      H('h-two-tri-line', '직선 위에 놓인 두 삼각형 사이의 각', '88, 기본 ①87', (d) => {
        // 두 삼각형이 직선 위의 한 점에서 만난다. 삼각형마다 그 점의 각을 구한 다음 180°에서 뺀다.
        const { a1, t1, b2, t2, o1, o2, it } = drawn(d, () => {
          const [a1, t1, b2, t2] = d.until(() => [d.int(9, 14) * 5, d.int(9, 14) * 5, d.int(9, 14) * 5, d.int(9, 14) * 5], ([a, b, c, e]) => { const x = 180 - a - b, y = 180 - c - e; return x >= 50 && y >= 50 && 180 - x - y >= 40 && 180 - x - y !== 90; });
          const o1 = 180 - a1 - t1, o2 = 180 - b2 - t2, left = G.triangle(a1, o1, 1, [-1, 0]), right = G.triangle(o2, b2, 1, Z), f = fitter(left.concat(right), 10.6, 4.6);
          return {
            a1, t1, b2, t2, o1, o2, it: {
              pts: left.concat(right).map(f), label: `직선 위의 한 점에서 만나는 두 삼각형: 왼쪽 삼각형의 두 각은 ${a1}°, ${t1}°, 오른쪽 삼각형의 두 각은 ${t2}°, ${b2}°이고, 두 삼각형 사이의 각이 ㉠`,
              draw: (o) => { const p = left.map(f).map((v) => add(v, o)), q = right.map(f).map((v) => add(v, o)); return G.polygon(p) + G.polygon(q) + corner(p, 0, a1 + '°') + corner(p, 2, t1 + '°') + corner(q, 1, b2 + '°') + corner(q, 2, t2 + '°') + mark(q[0], o2, 180 - o1, '㉠', { r: 0.6, round: true }); }
            }
          };
        });
        return N('삼각형 2개를 한 꼭짓점이 맞닿도록 직선 위에 놓았다. ㉠의 각도는?', 180 - o1 - o2, {
          unit: '°', figure: single(it, 1), explain: `두 삼각형이 맞닿은 꼭짓점의 각은 왼쪽 삼각형이 180° - ${a1}° - ${t1}° = ${o1}°, 오른쪽 삼각형이 180° - ${t2}° - ${b2}° = ${o2}°이다. 직선 위의 한 점에 모인 각의 크기의 합은 180°이므로 ㉠ = 180° - ${o1}° - ${o2}° = ${180 - o1 - o2}°`,
          facts: { calc: [[`180-(180-${a1}-${t1})-(180-${t2}-${b2})`, 0]], unseen: [180] }
        });
      }, { standard: SUMS }),
      H('h-tri-quad-line', '직선 위에 놓인 삼각형과 사각형 사이의 각', '104, 기본 ①103', (d) => {
        // 직각삼각형과 직각이 하나 있는 사각형이 직선 위의 한 점에서 만난다. 도형마다 그 점의 각을 구한 다음 180°에서 뺀다.
        const { t1, c, e, o1, o2, it } = drawn(d, () => {
          const [t1, c, e] = d.until(() => [d.int(7, 11) * 5, d.int(14, 24) * 5, d.int(14, 24) * 5], ([x, y, z]) => { const k = 270 - y - z; return y !== 90 && z !== 90 && k >= 50 && k <= 85 && x + 90 - k >= 35 && x + 90 - k !== 90 && quadBest(k, 90, z) !== null; });
          const o1 = 90 - t1, o2 = 270 - c - e, left = G.triangle(90, o1, 0.7, [-0.7, 0]), quad = quadBest(o2, 90, e), f = fitter(left.concat(quad), 10.4, 5);
          return {
            t1, c, e, o1, o2, it: {
              pts: left.concat(quad).map(f), label: `직선 위의 한 점에서 만나는 삼각형과 사각형: 삼각형의 두 각은 직각과 ${t1}°, 사각형의 세 각은 직각, ${c}°, ${e}°이고, 두 도형 사이의 각이 ㉠`,
              draw: (o) => { const p = left.map(f).map((v) => add(v, o)), q = quad.map(f).map((v) => add(v, o)); return G.polygon(p) + G.polygon(q) + corner(p, 0, '') + corner(p, 2, t1 + '°') + corner(q, 1, '') + corner(q, 2, c + '°') + corner(q, 3, e + '°') + mark(q[0], o2, 180 - o1, '㉠', { r: 0.6, round: true }); }
            }
          };
        });
        return N('삼각형과 사각형을 한 꼭짓점이 맞닿도록 직선 위에 놓았다. ㉠의 각도는?', 180 - o1 - o2, {
          unit: '°', figure: single(it, 1), explain: `두 도형이 맞닿은 꼭짓점의 각은 삼각형이 180° - 90° - ${t1}° = ${o1}°, 사각형이 360° - 90° - ${c}° - ${e}° = ${o2}°이다. 직선 위의 한 점에 모인 각의 크기의 합은 180°이므로 ㉠ = 180° - ${o1}° - ${o2}° = ${180 - o1 - o2}°`,
          facts: { calc: [[`180-(180-90-${t1})-(360-90-${c}-${e})`, 0]], unseen: [180, 360, 90] }
        });
      }, { standard: SUMS }),
      H('h-quad-ext', '사각형의 세 각을 보고 바깥쪽 각 구하기', '96·99, 기본 ②101 ③86', (d) => {
        const { set, it } = drawn(d, () => {
          const set = d.until(() => quadSet(d), (s) => s[1] !== 90 && s[1] >= 60 && s[1] <= 120);
          return { set, it: shapeItem(quadPts(set[0], set[1], set[3], 5.6, 4.4), [set[0] + '°', null, set[2] + '°', set[3] + '°'], `한 변을 늘인 사각형: 세 각의 크기는 ${set[0]}°, ${set[2]}°, ${set[3]}°이고, 나머지 한 각의 바깥쪽에 생긴 각이 ㉠`, extended(set[1], '㉠')) };
        });
        return N('사각형의 한 변을 길게 늘였다. ㉠의 각도는?', 180 - set[1], {
          unit: '°', figure: single(it, 1.1), explain: `사각형의 나머지 한 각의 크기는 360° - ${set[0]}° - ${set[2]}° - ${set[3]}° = ${set[1]}°이다. 직선 위의 한 점에 모인 각의 크기의 합은 180°이므로 ㉠ = ${minus(180, set[1]).said}`,
          facts: { calc: [[`180-(360-${set[0]}-${set[2]}-${set[3]})`, 0]], unseen: [180, 360] }
        });
      }, { standard: SUMS }),
      H('h-quad-ext-in', '바깥쪽 각과 두 각을 보고 사각형의 나머지 각 구하기', '97·98, 기본 ②102', (d) => {
        const { set, outer, it } = drawn(d, () => {
          const set = d.until(() => quadSet(d), (s) => s[1] !== 90 && s[2] !== 90 && s[1] >= 60 && s[1] <= 120), outer = 180 - set[1];
          return { set, outer, it: shapeItem(quadPts(set[0], set[1], set[3], 5.6, 4.4), [set[0] + '°', null, '㉠', set[3] + '°'], `한 변을 늘인 사각형: 두 각의 크기는 ${set[0]}°, ${set[3]}°, 다른 한 각의 바깥쪽에 생긴 각의 크기는 ${outer}°, 나머지 한 각이 ㉠`, extended(set[1], outer + '°')) };
        });
        return N('사각형의 한 변을 길게 늘였더니 바깥쪽에 생긴 각의 크기가 그림과 같았다. ㉠의 각도는?', set[2], {
          unit: '°', figure: single(it, 1.1), explain: `바깥쪽 각과 이웃한 사각형의 각의 크기는 ${minus(180, outer).said}이다. ㉠ = 360° - ${set[0]}° - ${set[3]}° - ${set[1]}° = ${set[2]}°`,
          facts: { calc: [[`360-${set[0]}-${set[3]}-(180-${outer})`, 0]], unseen: [180, 360] }
        });
      }, { standard: SUMS }),
      H('h-quad-split', '사각형 안에 그은 선분이 나눈 각', '기본 ②103', (d) => {
        // 왼쪽 아래 꼭짓점과 마주 보는 꼭짓점을 이었다. 왼쪽 아래의 각이 x(아래쪽)와 ㉠(위쪽)으로 나뉜다. 아래 삼각형의 각 x, b 와 위 삼각형의 각 ㉠, e 로 모양을 정한다.
        const { x, b, w, e, c, it } = drawn(d, () => {
          const [x, b, w, e] = d.until(() => [d.int(7, 10) * 5, d.int(14, 19) * 5, d.int(7, 10) * 5, d.int(14, 19) * 5], ([p, q, r, s]) => { const k = 360 - p - q - r - s; return 180 - p - q >= 35 && 180 - r - s >= 35 && k >= 70 && k <= 130 && p !== r && q !== 90 && s !== 90; });
          const c = 360 - x - b - w - e, low = G.triangle(x, b, 1, Z), far = Math.hypot(low[2][0], low[2][1]), top = at(Z, (far * Math.sin((180 - w - e) * RAD)) / Math.sin(e * RAD), x + w), pts = fit(low.concat([top]), 7.4, 5.8);
          return {
            x, b, w, e, c, it: shapeItem(pts, [null, b + '°', null, e + '°'], `사각형의 마주 보는 두 꼭짓점을 선분으로 이은 그림: 사각형의 세 각은 ${e}°, ${c}°, ${b}°이고, 나머지 한 각은 선분으로 ${x}°와 ㉠으로 나뉜다`, {
              draw: (p) => { const [from, to] = cornerSpan(p, 2); return G.line(p[0], p[2]) + mark(p[2], from, to, c + '°', { r: 0.6, round: true, halo: TINT[0] }) + mark(p[0], 0, x, x + '°', { r: 1.2 }) + mark(p[0], x, x + w, '㉠', { r: 0.9, round: true }); }
            })
          };
        });
        return N('사각형의 마주 보는 두 꼭짓점을 선분으로 이었다. ㉠의 각도는?', w, {
          unit: '°', figure: single(it, 1.1), explain: `사각형의 나머지 한 각의 크기는 360° - ${e}° - ${c}° - ${b}° = ${x + w}°이다. 이 각이 ${x}°와 ㉠으로 나뉘므로 ㉠ = ${minus(x + w, x).said}`,
          facts: { calc: [[`360-${e}-${c}-${b}-${x}`, 0]], unseen: [360] }
        });
      }, { standard: SUMS }),
      H('h-tri-in-quad', '삼각형을 선분으로 나누어 생긴 사각형의 각', '101, 기본 ②104', (d) => {
        // 직각삼각형(왼쪽 아래가 직각, 위 꼭짓점의 각이 t)을 선분으로 나누면 아래쪽에 사각형이 생긴다. 사각형의 각: 직각, 삼각형의 나머지 각, y(빗변 위), ㉠(왼쪽 변 위)
        const { t, y, r, ans, it } = drawn(d, () => {
          const [t, y] = d.until(() => [d.pick([40, 45, 50]), d.int(21, 28) * 5], ([a, b]) => 180 + a - b >= 80 && 180 + a - b <= 120 && 180 + a - b !== 90), r = 90 - t, ans = 180 + t - y;
          const pts = triPts(90, r, 6.6, 5.4), side = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]), up = Math.hypot(pts[2][0] - pts[0][0], pts[2][1] - pts[0][1]), ratio = Math.sin(y * RAD) / Math.sin(ans * RAD);
          // 위 꼭짓점에서 빗변을 따라 cut 만큼 간 점과, 왼쪽 변을 따라 cut × ratio 만큼 내려간 점을 잇는다.
          const cut = Math.min(0.6 * side, (0.72 * up) / ratio), onRight = [pts[2][0] + ((pts[1][0] - pts[2][0]) * cut) / side, pts[2][1] + ((pts[1][1] - pts[2][1]) * cut) / side], onLeft = [pts[2][0], pts[2][1] + cut * ratio];
          return {
            t, y, r, ans, it: shapeItem(pts, ['', null, t + '°'], `직각삼각형을 선분으로 나눈 그림: 직각삼각형의 한 각은 ${t}°이고, 아래쪽에 생긴 사각형의 한 각은 ${y}°, 다른 한 각이 ㉠`, {
              draw: (p, o) => { const a = add(onLeft, o), b = add(onRight, o), from = G.bearing(b, a); return G.line(a, b) + mark(b, from, from + y, y + '°', { r: 0.6 }) + mark(a, 270, 270 + ans, '㉠', { r: 0.55, round: true }); }
            })
          };
        });
        return N('직각삼각형 안에 선분을 그어 삼각형과 사각형으로 나누었다. 사각형의 한 각인 ㉠의 크기는?', ans, {
          unit: '°', figure: single(it, 1.1), explain: `직각삼각형의 나머지 한 각의 크기는 180° - 90° - ${t}° = ${r}°이다. 사각형의 네 각은 직각, ${r}°, ${y}°, ㉠이므로 ㉠ = 360° - 90° - ${r}° - ${y}° = ${ans}°`,
          facts: { calc: [[`360-90-(180-90-${t})-${y}`, 0]], unseen: [360, 180, 90] }
        });
      }, { standard: SUMS })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
