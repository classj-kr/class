// 5학년 2학기 3단원 합동과 대칭 — 기본 문항(선대칭도형의 성질과 그리기, 점대칭도형과 대칭의 중심, 점대칭도형의 성질과 그리기, 선대칭도형과 점대칭도형).
// 단원 틀과 판정·그림 도구(B.kit.sym523)는 5-2-3a.js 에 있다. 실력 문항은 5-2-3c.js. 대조표는 수집본의 _분석/5-2-3/싣기_대조표.md.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 싣는 기준(이 파일의 네 묶음)
//  - 선대칭도형·점대칭도형은 좌표로 짓는다: 선대칭도형은 반쪽을 대칭축으로 접어 옮기고, 점대칭도형은 반쪽을 대칭의 중심으로 180° 돌려 옮긴다.
//    대응점·대응변·대응각은 손으로 적지 않고 옮긴 자리의 좌표로 찾는다.
//  - 길이를 적는 그림은 길이가 자연수가 되게 짓고(비스듬한 변은 직각삼각형의 빗변: 5·12·13, 8·15·17 …), 각의 크기를 적는 그림은 각이 자연수 도가 되게 짓는다.
//    대칭축 위의 꼭짓점에는 각의 크기를 적지 않는다(글이 대칭축과 겹친다). 그런 각은 문제 글에 적는다.
//  - 「완성하시오」는 ① 완성한 도형 고르기 ② 대응점을 찍을 자리 고르기 ③ 완성했을 때 나타나는 수·글자 ④ 완성한 도형의 꼭짓점 수로 바꾸어 싣는다.
//    완성한 도형 고르기의 오답은 「옆으로 밀어 옮긴 것」「점대칭(선대칭)으로 잘못 완성한 것」「거리를 한 칸 틀리게 옮긴 것」이다.
//  - 각도는 한 번만 셈한다: 대응각을 옮긴 뒤 세 각의 합(네 각의 합)에서 한 번 뺀다. 대칭축과 대응점을 이은 선분이 만드는 90°를 쓰는 것도 삼각형 하나에서 한 번 빼는 데까지만 싣는다.
//
// 뺀 것과 까닭
//  - 각도를 이어 셈하는 것(①74·75 심56·59·60): 점대칭인 사각형의 이웃한 각, 그은 선분이 만든 각을 더하고 빼며 좇기, 직선 위의 각을 거쳐 구하기, 대칭에서 이등변삼각형을 알아내 밑각 구하기
//  - 넓이 셈이 대부분인 것(①76 겹친 두 정사각형의 넓이, ③41 심41 대칭축으로 변을 구해 넓이, ①83 심46 넓이에서 거꾸로 모눈 한 칸의 길이, ②69 ③66 심45 점대칭도형의 넓이)
//  - 조건에 맞는 수를 모두 세는 것(②57 심31), 점대칭 숫자의 합(②56): 경우 따지기, 뜻 없는 셈. 가장 큰 수 하나 만들기는 실력에 실었다.
//  - 그리기·작품·열린 답(①55 ③46·47·69·70 심64), 까닭 쓰기(③30·53): 작도·서술형
//  - 한 부분의 둘레로 전체 둘레(①72), 변을 지나는 선분(①69의 변형), 다른 도형 조건이 붙은 둘레(②47): 수집본에 그림이 없어 얼개를 알 수 없다.
//  - 국기·건축물·지도 기호(①33 ②55 ③50·55의 변형, 심10): 실제 그림이 있어야 한다 → 미룸. 같은 판단은 선분으로 그린 글자 카드와 모눈 위의 도형이 묻는다.
//  - 세 선분의 길이의 합(①69의 변형), 두 변의 차(②40·63의 변형): 뜻 없는 셈
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, tagged, box } = B.kit;
  const G = B.kit.geo;
  const K = B.kit.sym523;
  const { TAGS, MARKS, JA, RAD, cm, calc, dist, mid, mean, TOL, samePt, sidesOf, sameFig, mirror, halfTurn, isAxis, isHalfTurn, kindOf, kindOfPoly, setItem, oneItem, say, truthItem, pickWord, tagList,
    restyle, axisLine, centreDot, mark, onGrid, tiles, gridTiles, Sheet, nameSpot, canon, scaled, toCorner, spanOf, tidy, insidePoly, anglesOf, from, LINE_ONLY, TURN_ONLY, BOTH, NEITHER,
    LETTERS, JAMO, LETTER_KIND, JAMO_KIND, strokeCard, letterTiles, DIGITS, DIGIT_KIND, digitCard, plainRow } = K;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const seg = (a, b) => '선분 ' + [a, b].sort((x, y) => JA.indexOf(x) - JA.indexOf(y)).join('');
  const sideOf = (names, i) => '변 ' + [names[i], names[(i + 1) % names.length]].sort((x, y) => JA.indexOf(x) - JA.indexOf(y)).join('');
  // 각의 이름: 가운데가 꼭짓점 i. order 를 주면 그 차례(대응하는 차례)로 적는다.
  const angleOf = (names, i) => { const n = names.length, [a, b] = [names[(i + n - 1) % n], names[(i + 1) % n]].sort((x, y) => JA.indexOf(x) - JA.indexOf(y)); return '각 ' + a + names[i] + b; };
  const drawn = (d, make) => d.until(make, (x) => !x.clash);

  // ── 선대칭도형 그림(대칭축은 세로로 놓는다) ────────────────────
  // spec: { top: 대칭축 위 맨 위 꼭짓점의 세로 자리(없으면 빈 값), right: 오른쪽 꼭짓점들 [대칭축에서의 거리, 세로 자리](위에서 아래로), bottom: 대칭축 위 맨 아래 꼭짓점의 세로 자리(없으면 빈 값) }
  // 꼭짓점은 이름 차례(맨 위에서 시작해 왼쪽으로 내려갔다가 오른쪽으로 올라온다)로 놓인다. 대칭축은 가로 자리 0인 세로선이다.
  function lineShape(spec, maxW, maxH) {
    const raw = [].concat(spec.top == null ? [] : [[0, spec.top]], spec.right.map(([x, y]) => [-x, y]), spec.bottom == null ? [] : [[0, spec.bottom]], spec.right.slice().reverse());
    const [w, h] = spanOf(raw), k = Math.min((maxW || 5) / w, (maxH || 4.4) / h), y0 = Math.min(...raw.map((p) => p[1]));
    const P = raw.map(([x, y]) => [x * k, (y - y0) * k]), n = P.length;
    if (!isAxis(sidesOf(P), [0, 0], [0, 1])) throw new Error('선대칭도형이 아니다');
    // 대응점은 대칭축으로 접어 옮긴 자리에 있는 꼭짓점이다.
    return { P, n, names: JA.slice(0, n), k, height: h * k, partner: (i) => P.findIndex((p) => samePt(p, mirror(P[i], [0, 0], [0, 1]))), onAxis: (i) => Math.abs(P[i][0]) < TOL };
  }
  // 그림: 도형, 대칭축(일점쇄선), 꼭짓점 이름. o.axis: 대칭축 두 끝의 이름, o.links: [왼쪽 꼭짓점 번호, 대칭축과 만나는 점의 이름] — 대응점을 이은 선분을 긋는다.
  function axisSheet(shape, o) {
    const opt = o || {}, { P, names, height } = shape, sheet = new Sheet().poly(P).line([0, -0.8], [0, height + 0.8], 'axis');
    P.forEach((p, i) => sheet.text(shape.onAxis(i) ? [-0.4, p[1] + (p[1] < height / 2 ? -0.3 : 0.32)] : nameSpot(P, i, 0.46), names[i]));
    if (opt.axis) sheet.text([0.38, -0.72], opt.axis[0]).text([0.38, height + 0.72], opt.axis[1]);
    (opt.links || []).forEach(([i, name]) => { const p = P[i], q = P[shape.partner(i)]; sheet.line(p, q, 'thin'); if (name) sheet.text([0.34, p[1] + 0.36], name); });
    return sheet;
  }
  // 길이를 적는 선대칭 육각형 ㄱㄴㄷㄹㅁㅂ(ㄱ과 ㄹ이 대칭축 위). 비스듬한 변은 직각삼각형의 빗변으로 지어 길이가 자연수다. lens: 변 ㄱㄴ, ㄴㄷ, ㄷㄹ의 길이
  const SLANT = { 8: [[6, 10], [15, 17]], 12: [[5, 13], [9, 15], [16, 20]], 15: [[8, 17], [20, 25]], 24: [[7, 25], [18, 30]] };
  function lengthHex(d) {
    const p = d.pick([8, 12, 15, 24]), [s1, s2] = d.shuffle(SLANT[p]).slice(0, 2), v = d.until(() => d.int(Math.ceil(p * 0.5), Math.round(p * 1.2)), (x) => Math.abs(x - s1[1]) >= 2 && Math.abs(x - s2[1]) >= 2);
    return { spec: { top: 0, right: [[p, s1[0]], [p, s1[0] + v]], bottom: s1[0] + v + s2[0] }, lens: [s1[1], v, s2[1]], half: p };
  }
  // 각의 크기를 적는 선대칭 육각형: 각 ㄴㄱㅂ = 2a, 각 ㄱㄴㄷ = 180 − a(변 ㄴㄷ은 대칭축과 나란하다), 각 ㄴㄷㄹ = g, 각 ㄷㄹㅁ = 360 − 2g. 변 ㄱㄴ(l)과 변 ㄴㄷ(v)의 길이는 자연수다.
  function angleHex(d) {
    const [a, g] = d.until(() => [d.pick([50, 55, 60, 65]), d.pick([110, 115, 120, 125])], ([x, y]) => Math.abs(180 - x - y) >= 10), l = d.int(4, 6), v = d.int(3, 4), x = l * Math.sin(a * RAD), y1 = l * Math.cos(a * RAD), unit = d.pick([1, 2, 3]);
    return { spec: { top: 0, right: [[x, y1], [x, y1 + v]], bottom: y1 + v + x / Math.tan((180 - g) * RAD) }, angles: [2 * a, 180 - a, g, 360 - 2 * g, g, 180 - a], lens: [l * unit, v * unit] };
  }
  // 이름만 적는 선대칭도형(길이·각도를 적지 않는다): 육각형과 오각형
  function plainLineShape(d) {
    return d.pick([
      { top: 0, right: [[d.pick([2.4, 2.8]), 1.2], [d.pick([1.6, 2]), 3.4]], bottom: d.pick([4.2, 4.6]) },
      { top: 0, right: [[2.2, 1.6], [3, 3.2]], bottom: 4.4 },
      { top: 0, right: [[1.6, 1], [2.8, 2.4], [2, 4]], bottom: null },
      { top: null, right: [[1.2, 0], [2.8, 1.6], [2, 4]], bottom: null }
    ]);
  }

  // ── 점대칭도형 그림 ──────────────────────────────────────────
  // 대칭의 중심으로 180° 돌려도 처음과 같은 도형. 꼭짓점은 이름 차례로 놓인다.
  function turnShape(raw, maxW, maxH) {
    const A = canon(raw), [w, h] = spanOf(A), k = Math.min((maxW || 5.2) / w, (maxH || 4.2) / h), P = scaled(toCorner(A), k), O = mean(P), n = P.length;
    if (!isHalfTurn(sidesOf(P))) throw new Error('점대칭도형이 아니다');
    // 대응점은 대칭의 중심으로 180° 돌려 옮긴 자리에 있는 꼭짓점이다.
    return { P, n, names: JA.slice(0, n), O, k, partner: (i) => P.findIndex((p) => samePt(p, halfTurn(P[i], O))) };
  }
  // 그림: 도형, 꼭짓점 이름, 대칭의 중심(붉은 점)과 그 이름. o.links: 대응점을 이은 선분을 그을 꼭짓점 번호들. 중심의 이름은 선분들에서 가장 먼 쪽에 적는다.
  function centerSheet(shape, o) {
    const opt = o || {}, { P, names, O } = shape, sheet = new Sheet().poly(P).names(P, names), lines = (opt.links || []).map((i) => [P[i], P[shape.partner(i)]]);
    lines.forEach(([p, q]) => sheet.line(p, q, 'thin'));
    sheet.dot(O, true);
    if (opt.center !== false) {
      const spots = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => G.toward(O, lines.length > 1 ? 0.66 : 0.48, deg));
      const room = (s) => (lines.length ? Math.min(...lines.map(([p, q]) => Math.abs(G.cross(G.sub(s, p), G.sub(q, p))) / dist(p, q))) : (s[0] > O[0] && s[1] < O[1] ? 1 : 0));
      sheet.text(spots.slice().sort((x, y) => room(y) - room(x))[0], opt.center || 'ㅇ');
    }
    return sheet;
  }
  // 점대칭 육각형 ㄱㄴㄷㄹㅁㅂ: 변 ㄱㄴ(세로, a), 변 ㄴㄷ(b, 각 ㄱㄴㄷ = deg°), 변 ㄷㄹ(가로, w). 나머지 세 변은 대칭의 중심 건너편의 대응변이다. 각은 차례로 90°, deg°, (270 − deg)°가 두 번씩이다.
  function turnHex(a, b, w, deg) {
    const p1 = [0, 0], p2 = [0, a], p3 = [b * Math.sin(deg * RAD), a - b * Math.cos(deg * RAD)], p4 = [p3[0] + w, p3[1]], c = mid(p1, p4);
    return [p1, p2, p3, p4, halfTurn(p2, c), halfTurn(p3, c)];
  }
  const someTurnHex = (d) => { const [a, b, w] = d.until(() => [d.int(5, 9), d.int(5, 10), d.int(6, 12)], ([x, y, z]) => Math.abs(x - y) >= 2 && Math.abs(y - z) >= 2 && Math.abs(x - z) >= 2), deg = d.pick([110, 120, 125, 130, 140]); return { raw: turnHex(a, b, w, deg), lens: [a, b, w], angles: [90, deg, 270 - deg, 90, deg, 270 - deg] }; };
  // 이름만 적는 점대칭도형: 평행사변형 또는 육각형
  const plainTurnShape = (d) => (d.bool() ? someTurnHex(d).raw : (() => { const s = d.pick([1.4, 1.8, -1.4, -1.8]), w = d.pick([4, 4.6]), h = 3; return [[Math.max(0, s), 0], [Math.max(0, -s), h], [Math.max(0, -s) + w, h], [Math.max(0, s) + w, 0]]; })());

  // ── 완성하기: 모눈 위의 반쪽 도형 ─────────────────────────────
  // 세로선(가로 3칸째) 위의 점에서 시작해 왼쪽을 돌아 그 세로선 위의 점에서 끝나는 길. 위아래가 같지 않은 것만 쓴다(접은 것과 180° 돌린 것이 달라야 한다).
  const HALVES = [
    [[3, 0], [1, 0], [0, 2], [2, 4], [3, 4]],
    [[3, 0], [2, 0], [2, 1], [0, 1], [0, 3], [1, 3], [1, 4], [3, 4]],
    [[3, 0], [0, 1], [1, 3], [3, 4]],
    [[3, 0], [1, 1], [1, 2], [0, 2], [0, 4], [3, 4]],
    [[3, 0], [2, 0], [0, 2], [0, 3], [2, 3], [2, 4], [3, 4]],
    [[3, 0], [1, 0], [1, 2], [0, 3], [3, 4]]
  ];
  const HX = 3, HY = 4;
  const MOVES = {
    fold: ([x, y]) => [HX * 2 - x, y],            // 세로선으로 접어 옮긴다(선대칭)
    turn: ([x, y]) => [HX * 2 - x, HY - y],       // 세로선의 한가운데를 중심으로 180° 돌려 옮긴다(점대칭)
    slide: ([x, y]) => [x + HX, y]                // 옆으로 밀어 옮긴다
  };
  // 거리를 한 칸 틀리게 옮긴 것: 가장 바깥쪽 꼭짓점들을 한 칸 안쪽으로 당긴다.
  const tweaked = (half, move) => { const far = Math.min(...half.map((p) => p[0])); return half.map((p) => { const q = move(p); return p[0] === far ? [q[0] - 1, q[1]] : q; }); };
  const edgesOf = (path) => path.slice(0, -1).map((p, i) => [p, path[i + 1]]);
  const onLineX = ([p, q]) => Math.abs(p[0] - HX) < TOL && Math.abs(q[0] - HX) < TOL;
  // 반쪽과 옮긴 조각을 붙인 그림의 테두리: 세로선 위에서는 한쪽 조각만 닿아 있는 곳만 테두리다.
  function outline(half, piece) {
    const all = edgesOf(half.concat([half[0]])).concat(edgesOf(piece.concat([piece[0]]))), out = all.filter((e) => !onLineX(e));
    for (let y = 0; y < HY; y += 0.5) {
      const covered = all.filter((e) => onLineX(e) && Math.min(e[0][1], e[1][1]) <= y + TOL && Math.max(e[0][1], e[1][1]) >= y + 0.5 - TOL).length;
      if (covered % 2 === 1) out.push([[HX, y], [HX, y + 0.5]]);
    }
    return out;
  }
  // 완성한 그림 한 칸(모눈 6×4칸): 두 조각을 옅게 칠하고 테두리를 긋는다. extra: 대칭축이나 대칭의 중심
  function madeTile(half, piece, extra) {
    const fill = (pts) => G.polygon(pts).replace('class="mb-poly"', 'class="mb-poly" style="fill:rgba(251,191,36,0.28);stroke:none"');
    return G.board(HX * 2, HY, [fill(half), fill(piece)].concat(outline(half, piece).map(([p, q]) => G.line(p, q)), extra || []), { grid: 'lines', scale: 0.68, label: '반쪽 도형에 나머지 반쪽을 그려 완성한 도형' });
  }
  const tileAxis = () => axisLine([HX, -0.45], [HX, HY + 0.45]);
  for (const half of HALVES) {
    const whole = (piece) => outline(half, piece);
    if (!isAxis(whole(half.map(MOVES.fold)), [HX, 0], [HX, 1]) || isAxis(whole(half.map(MOVES.turn)), [HX, 0], [HX, 1]) || isAxis(whole(half.map(MOVES.slide)), [HX, 0], [HX, 1]) || isAxis(whole(tweaked(half, MOVES.fold)), [HX, 0], [HX, 1])) throw new Error('선대칭으로 완성한 그림의 판정이 생각과 다르다');
    const turned = (segs) => sameFig(segs.map((s) => s.map((p) => halfTurn(p, [HX, HY / 2]))), segs);
    if (!turned(whole(half.map(MOVES.turn))) || turned(whole(half.map(MOVES.fold))) || turned(whole(half.map(MOVES.slide))) || turned(whole(tweaked(half, MOVES.turn)))) throw new Error('점대칭으로 완성한 그림의 판정이 생각과 다르다');
  }
  // 반쪽만 그린 그림(열린 선). 판은 가로 8칸: 반쪽은 가로 1~4칸, 나머지 반쪽이 놓일 자리는 4~7칸
  const shift = ([x, y]) => [x + 1, y];
  const openPath = (half) => restyle(G.polyline(half.map(shift)), 'stroke-width:2;stroke-linejoin:round');
  // 완성한 도형의 꼭짓점: 반쪽의 길과 옮긴 길을 이어 한 줄에 놓인 점을 걷어 낸다.
  const joined = (half, move) => tidy(half.concat(half.slice(1, -1).reverse().map(move)));

  // ── 글자의 반쪽 ──────────────────────────────────────────────
  // 선분 묶음에서 세로선 x = c 의 왼쪽(또는 가로선 y = c 의 위쪽)에 있는 부분만 남긴다.
  function clip(segs, axis, c) {
    const out = [];
    for (const [p, q] of segs) {
      const a = p[axis], b = q[axis];
      if (a > c + TOL && b > c + TOL) continue;
      if (a <= c + TOL && b <= c + TOL) { out.push([p, q]); continue; }
      const t = (c - a) / (b - a), cut = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      out.push(a <= c ? [p, cut] : [cut, q]);
    }
    return out;
  }
  const halfKey = (segs) => segs.map((s) => s.map((p) => p.map((v) => Math.round(v * 100)).join(',')).sort().join('~')).sort().join(' ');
  const FOLD_LETTERS = Object.keys(LETTERS).filter((ch) => isAxis(LETTERS[ch], [1.5, 0], [1.5, 4])), TURN_LETTERS = Object.keys(LETTERS).filter((ch) => LETTER_KIND[ch].turn);
  if (FOLD_LETTERS.join('') !== 'AHIMTUVXY' || TURN_LETTERS.join('') !== 'HINSXZ') throw new Error('반쪽 글자에 쓸 글자가 생각과 다르다');

  // ── 선대칭도형의 성질과 그리기 ────────────────────────────────
  B.addTypes('5-2-3', 'lsym', [
    T('lsym-find', '선대칭도형에서 대응변·대응각 찾기', '①40 ②37 ③33 심11', (d, n) => {
      const shape = lineShape(plainLineShape(d)), axis = [JA[shape.n], JA[shape.n + 1]], figure = axisSheet(shape, { axis }).svg(`직선 ${axis.join('')}을 대칭축으로 하는 선대칭도형. 꼭짓점은 ${shape.names.join(', ')}`);
      const lead = `직선 ${axis.join('')}을 대칭축으로 하는 선대칭도형이다. `;
      if (n === 0) {
        // 대응변: 대칭축과 만나지 않는 변을 묻는다.
        const sides = Array.from({ length: shape.n }, (_, i) => i).filter((i) => shape.partner(i) !== (i + 1) % shape.n), i = d.pick(sides.filter((j) => shape.P[j][0] <= TOL && shape.P[(j + 1) % shape.n][0] <= TOL));
        const want = [shape.partner(i), shape.partner((i + 1) % shape.n)], same = (j) => [j, (j + 1) % shape.n].sort().join() === want.slice().sort().join();
        const list = d.shuffle(sides.filter((j) => j !== i)).slice(0, 4);
        if (!list.some(same)) list[0] = sides.find(same);
        const options = d.shuffle(list);
        return oneItem(`${lead}${sideOf(shape.names, i)}의 대응변은?`, options.map((j) => sideOf(shape.names, j)), options.map(same), {
          figure, explain: `대칭축을 따라 접었을 때 점 ${shape.names[i]}은 점 ${shape.names[want[0]]}과, 점 ${shape.names[(i + 1) % shape.n]}은 점 ${shape.names[want[1]]}과 겹친다. ${sideOf(shape.names, i)}과 겹치는 변은 ${sideOf(shape.names, options.find(same))}이다.`
        });
      }
      // 대응각: 대칭축 위에 있지 않은 꼭짓점의 각을 묻는다.
      const off = Array.from({ length: shape.n }, (_, i) => i).filter((i) => !shape.onAxis(i)), i = d.pick(off.filter((j) => shape.P[j][0] < 0)), options = d.shuffle(off.filter((j) => j !== i)).slice(0, 4);
      if (!options.includes(shape.partner(i))) options[0] = shape.partner(i);
      const list = d.shuffle(options);
      return oneItem(`${lead}${angleOf(shape.names, i)}의 대응각은?`, list.map((j) => angleOf(shape.names, j)), list.map((j) => j === shape.partner(i)), {
        figure, explain: `대칭축을 따라 접었을 때 점 ${shape.names[i]}과 겹치는 점은 점 ${shape.names[shape.partner(i)]}이다. ${angleOf(shape.names, i)}과 겹치는 각은 ${angleOf(shape.names, shape.partner(i))}이다.`
      });
    }, { count: 2 }),
    T('lsym-talk', '선대칭도형에 대한 설명 가려내기', '②38 심11', (d) => {
      // 육각형 ㄱㄴㄷㄹㅁㅂ(ㄱ과 ㄹ이 대칭축 위). 틀린 설명 하나: 대응점·대응변·대응각을 잘못 댄 것
      const shape = lineShape({ top: 0, right: [[d.pick([2.4, 2.8]), 1.2], [d.pick([1.6, 2]), 3.4]], bottom: 4.4 }), nm = shape.names, bad = d.int(0, 2), pr = (i) => nm[shape.partner(i)];
      const rows = [
        [`점 ㄴ의 대응점은 점 ${bad === 0 ? pr(2) : pr(1)}이다.`, bad !== 0],
        [`변 ㄴㄷ의 대응변은 ${bad === 1 ? sideOf(nm, 3) : sideOf(nm, 4)}이다.`, bad !== 1],
        [`각 ㄴㄷㄹ의 대응각은 ${bad === 2 ? angleOf(nm, 5) : angleOf(nm, 4)}이다.`, bad !== 2],
        ['변 ㄱㄴ과 변 ㄱㅂ은 길이가 같다.', true]
      ];
      if (shape.partner(1) !== 5 || shape.partner(2) !== 4) throw new Error('대응이 생각과 다르다');
      return truthItem(d, '직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이다. 옳지 않은 설명은?', rows, false, {
        figure: axisSheet(shape, { axis: ['ㅅ', 'ㅇ'] }).svg('직선 ㅅㅇ을 대칭축으로 하는 선대칭도형 ㄱㄴㄷㄹㅁㅂ. 점 ㄱ과 점 ㄹ은 대칭축 위에 있다.'),
        explain: `대칭축을 따라 접으면 점 ㄴ은 점 ㅂ과, 점 ㄷ은 점 ㅁ과 겹친다. 그러므로 변 ㄴㄷ의 대응변은 변 ㅁㅂ이고, 각 ㄴㄷㄹ의 대응각은 각 ㄹㅁㅂ이다.`
      });
    }),
    T('lsym-pairs', '선대칭도형에서 대응변의 수', '심11', (d) => {
      // 대칭축이 두 꼭짓점을 지나는 육각형·팔각형: 변마다 대칭축 건너편에 대응변이 하나씩 있다. 대응변의 쌍은 좌표로 센다.
      const shape = lineShape(d.pick([{ top: 0, right: [[2.6, 1.2], [1.8, 3.4]], bottom: 4.5 }, { top: 0, right: [[1.7, 0.9], [2.7, 2.4], [1.5, 3.9]], bottom: 4.6 }])), n = shape.n, axis = [JA[n], JA[n + 1]];
      let pairs = 0;
      for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) if ([shape.partner(i), shape.partner((i + 1) % n)].sort().join() === [j, (j + 1) % n].sort().join()) pairs += 1;
      return N(`직선 ${axis.join('')}을 대칭축으로 하는 선대칭도형이다. 이 도형에서 대응변은 모두 몇 쌍인가?`, pairs, {
        unit: '쌍', figure: axisSheet(shape, { axis }).svg(`직선 ${axis.join('')}을 대칭축으로 하는 선대칭도형. 꼭짓점은 ${shape.names.join(', ')}`),
        explain: `대칭축을 따라 접었을 때 겹치는 변끼리 짝을 짓는다. 변이 ${n}개이고 대칭축의 양쪽에 ${n / 2}개씩 있으므로 대응변은 ${n} ÷ 2 = ${pairs}(쌍)이다.`, facts: calc(`${n}/2`, [n, 2])
      });
    }),
    T('lsym-two-axes', '대칭축에 따라 달라지는 대응변', '①41', (d) => {
      // 대칭축이 둘인 육각형. 직선 가(세로)와 직선 나(가로) 가운데 어느 것으로 접는지에 따라 대응변이 달라진다.
      const w = d.pick([2.2, 2.6]), a = d.pick([1.1, 1.3]), h = 4.4, P = [[0, 0], [-w, a], [-w, h - a], [0, h], [w, h - a], [w, a]], nm = JA.slice(0, 6), flat = d.bool();
      const sheet = new Sheet().poly(P).line([0, -0.8], [0, h + 0.8], 'axis').line([-w - 0.9, h / 2], [w + 0.9, h / 2], 'axis').text([0.42, -0.7], '가').text([w + 0.85, h / 2 - 0.36], '나');
      P.forEach((p, i) => sheet.text(i === 0 ? [-0.4, -0.3] : i === 3 ? [-0.4, h + 0.32] : nameSpot(P, i, 0.46), nm[i]));
      const to = (p) => (flat ? mirror(p, [0, h / 2], [1, h / 2]) : mirror(p, [0, 0], [0, 1])), at = (p) => P.findIndex((q) => samePt(q, to(p)));
      const i = d.pick([0, 2]), want = [at(P[i]), at(P[i + 1])].sort().join(), sides = d.shuffle([0, 1, 2, 3, 4, 5].filter((j) => j !== i)).slice(0, 4), same = (j) => [j, (j + 1) % 6].sort().join() === want;
      if (!sides.some(same)) sides[0] = [0, 1, 2, 3, 4, 5].find(same);
      const options = d.shuffle(sides);
      return oneItem(`직선 가와 직선 나는 모두 이 도형의 대칭축이다. 직선 ${flat ? '나' : '가'}를 대칭축으로 할 때 ${sideOf(nm, i)}의 대응변은?`, options.map((j) => sideOf(nm, j)), options.map(same), {
        figure: sheet.svg('대칭축이 직선 가(세로)와 직선 나(가로) 둘인 선대칭도형 ㄱㄴㄷㄹㅁㅂ'),
        explain: `직선 ${flat ? '나' : '가'}를 따라 접었을 때 ${sideOf(nm, i)}과 겹치는 변을 찾는다. 점 ${nm[i]}은 점 ${nm[at(P[i])]}과, 점 ${nm[i + 1]}은 점 ${nm[at(P[i + 1])]}과 겹치므로 대응변은 ${sideOf(nm, options.find(same))}이다. 대칭축이 달라지면 대응변도 달라진다.`
      });
    }),
    T('lsym-read', '선대칭도형의 대응변의 길이와 대응각의 크기', '①42 ②40 ③34·35·36 심12', (d) => {
      // 왼쪽 반에만 길이와 각이 적혀 있다. 대칭축 건너편의 변과 각을 묻는다.
      const made = drawn(d, () => {
        const hex = angleHex(d), shape = lineShape(hex.spec, 5.6, 5.2), sheet = axisSheet(shape, { axis: ['ㅅ', 'ㅇ'] });
        if (anglesOf(shape.P).some((x, i) => Math.abs(x - hex.angles[i]) > 1e-6)) throw new Error('각의 크기가 생각과 다르다');
        sheet.side(shape.P, 0, cm(hex.lens[0]), 0.62).side(shape.P, 1, cm(hex.lens[1])).corner(shape.P, 1, hex.angles[1] + '°').corner(shape.P, 2, hex.angles[2] + '°');
        return { hex, shape, sheet, clash: sheet.clash() };
      });
      const { hex, shape } = made, nm = shape.names, si = d.pick([0, 1]), ai = d.pick([1, 2]), sideAsk = si === 0 ? 5 : 4, angleAsk = shape.partner(ai);
      return M(`직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이다. ${sideOf(nm, sideAsk)}의 길이와 ${angleOf(nm, angleAsk)}의 크기를 구하시오.`, [{ label: sideOf(nm, sideAsk), answer: hex.lens[si], unit: 'cm' }, { label: angleOf(nm, angleAsk), answer: hex.angles[ai], unit: '°' }], {
        figure: made.sheet.svg(`직선 ㅅㅇ을 대칭축으로 하는 선대칭도형 ㄱㄴㄷㄹㅁㅂ. 변 ㄱㄴ ${cm(hex.lens[0])}, 변 ㄴㄷ ${cm(hex.lens[1])}, 각 ㄱㄴㄷ ${hex.angles[1]}°, 각 ㄴㄷㄹ ${hex.angles[2]}°`),
        explain: `${sideOf(nm, sideAsk)}의 대응변은 ${sideOf(nm, si)}이므로 ${cm(hex.lens[si])}이고, ${angleOf(nm, angleAsk)}의 대응각은 ${angleOf(nm, ai)}이므로 ${hex.angles[ai]}°이다.`,
        facts: { calc: [[String(hex.lens[si]), 0], [String(hex.angles[ai]), 1]] }
      });
    }),
    T('lsym-right', '대응점을 이은 선분과 대칭축이 만나서 이루는 각', '①43 ②41 심25', (d) => {
      const shape = lineShape(plainLineShape(d)), left = Array.from({ length: shape.n }, (_, i) => i).filter((i) => shape.P[i][0] < -TOL), i = d.pick(left), meet = JA[shape.n + 2], a = shape.names[i], b = shape.names[shape.partner(i)];
      return N(`직선 ${JA[shape.n]}${JA[shape.n + 1]}을 대칭축으로 하는 선대칭도형이다. ${seg(a, b)}이 대칭축과 만나서 이루는 각은 몇 도인가?`, 90, {
        unit: '°', figure: axisSheet(shape, { axis: [JA[shape.n], JA[shape.n + 1]], links: [[i, meet]] }).svg(`선대칭도형과 대칭축. 대응점인 점 ${a}과 점 ${b}을 이은 선분이 대칭축과 점 ${meet}에서 만난다.`),
        explain: `점 ${a}과 점 ${b}은 대응점이다. 선대칭도형에서 대응점끼리 이은 선분은 대칭축과 수직으로 만나므로 90°이다.`, facts: calc('90', [90])
      });
    }),
    T('lsym-half', '대칭축이 대응점을 이은 선분을 똑같이 둘로 나눈다', '①44 ②42·43 ③37 심12', (d, n) => {
      // 육각형 ㄱㄴㄷㄹㅁㅂ: 선분 ㄴㅂ은 점 ㅈ에서, 선분 ㄷㅁ은 점 ㅊ에서 대칭축과 만난다.
      const shape = lineShape({ top: 0, right: [[d.pick([2, 2.3]), 1.1], [d.pick([3.1, 3.4]), 3.2]], bottom: 4.6 }), figure = axisSheet(shape, { axis: ['ㅅ', 'ㅇ'], links: [[1, 'ㅈ'], [2, 'ㅊ']] }).svg('직선 ㅅㅇ을 대칭축으로 하는 선대칭도형 ㄱㄴㄷㄹㅁㅂ. 선분 ㄴㅂ은 점 ㅈ에서, 선분 ㄷㅁ은 점 ㅊ에서 대칭축과 만난다.');
      const lead = '직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이다. ';
      if (n === 0) {
        const up = d.bool(), rows = d.shuffle(up ? [['선분 ㅂㅈ', true], ['선분 ㄷㅊ', false], ['선분 ㅁㅊ', false], ['선분 ㄱㅈ', false]] : [['선분 ㅁㅊ', true], ['선분 ㄴㅈ', false], ['선분 ㅂㅈ', false], ['선분 ㄹㅊ', false]]);
        return oneItem(`${lead}선분 ${up ? 'ㄴㅈ' : 'ㄷㅊ'}과 길이가 같은 선분은?`, rows.map((r) => r[0]), rows.map((r) => r[1]), {
          figure, explain: `점 ${up ? 'ㄴ' : 'ㄷ'}과 점 ${up ? 'ㅂ' : 'ㅁ'}은 대응점이다. 대칭축은 대응점끼리 이은 선분을 똑같이 둘로 나누므로 선분 ${up ? 'ㄴㅈ' : 'ㄷㅊ'}과 선분 ${up ? 'ㅂㅈ' : 'ㅁㅊ'}의 길이가 같다.`
        });
      }
      const half = d.int(4, 12), twice = d.bool();
      return N(twice ? `${lead}선분 ㄷㅊ이 ${cm(half)}일 때 선분 ㄷㅁ은 몇 cm인가?` : `${lead}선분 ㄴㅂ이 ${cm(half * 2)}일 때 선분 ㄴㅈ은 몇 cm인가?`, twice ? half * 2 : half, {
        unit: 'cm', figure, explain: twice ? `대칭축은 대응점끼리 이은 선분 ㄷㅁ을 똑같이 둘로 나눈다. 선분 ㅁㅊ도 ${cm(half)}이므로 선분 ㄷㅁ은 ${half} + ${half} = ${half * 2}(cm)` : `대칭축은 대응점끼리 이은 선분 ㄴㅂ을 똑같이 둘로 나눈다. 선분 ㄴㅈ은 ${half * 2} ÷ 2 = ${half}(cm)`,
        facts: calc(twice ? `${half}+${half}` : `${half * 2}/2`, [2])
      });
    }, { count: 2 }),
    T('lsym-bisect-not', '대칭축이 똑같이 둘로 나누지 않는 선분', '①45', (d) => {
      // 팔각형 ㄱㄴㄷㄹㅁㅂㅅㅇ(ㄱ과 ㅁ이 대칭축 위). 대응점끼리 이은 선분 셋과, 대응점이 아닌 두 점을 이은 선분 하나
      const shape = lineShape({ top: 0, right: [[1.7, 0.9], [2.7, 2.4], [1.5, 3.9]], bottom: 4.6 }), nm = shape.names, pairs = [1, 2, 3].map((i) => [i, shape.partner(i)]);
      const odd = d.pick([[1, 6], [2, 7], [3, 6], [1, 3]]), rows = pairs.map(([i, j]) => [seg(nm[i], nm[j]), true]).concat([[seg(nm[odd[0]], nm[odd[1]]), false]]);
      // 대칭축이 선분을 똑같이 둘로 나누는가: 선분의 한가운데가 대칭축 위에 있고 두 끝이 대칭축의 양쪽에 있다.
      const halved = ([i, j]) => Math.abs(mid(shape.P[i], shape.P[j])[0]) < TOL && shape.P[i][0] * shape.P[j][0] < 0;
      if (pairs.some((p) => !halved(p)) || halved(odd)) throw new Error('선분을 나누는 판정이 생각과 다르다');
      const sheet = axisSheet(shape, { axis: ['ㅈ', 'ㅊ'] });
      return truthItem(d, '직선 ㅈㅊ을 대칭축으로 하는 선대칭도형이다. 대칭축이 똑같이 둘로 나누는 선분이 아닌 것은?', rows, false, {
        figure: sheet.svg('직선 ㅈㅊ을 대칭축으로 하는 선대칭도형 ㄱㄴㄷㄹㅁㅂㅅㅇ. 점 ㄱ과 점 ㅁ은 대칭축 위에 있다.'),
        explain: `대칭축은 대응점끼리 이은 선분을 똑같이 둘로 나눈다. 점 ${nm[odd[0]]}과 점 ${nm[odd[1]]}은 대응점이 아니므로 ${seg(nm[odd[0]], nm[odd[1]])}은 대칭축이 똑같이 둘로 나누지 않는다.`
      });
    }),
    T('lsym-peri', '선대칭도형의 둘레', '①46 ②44 ③39 심13', (d) => {
      const made = drawn(d, () => {
        const hex = lengthHex(d), shape = lineShape(hex.spec, 4.8, 4.8), sheet = axisSheet(shape, { axis: ['ㅅ', 'ㅇ'] });
        // 대칭축 위의 꼭짓점 이름과 겹치지 않게, 대칭축과 닿는 변의 길이는 대칭축에서 먼 쪽에 적는다.
        sheet.side(shape.P, 0, cm(hex.lens[0]), 0.62).side(shape.P, 1, cm(hex.lens[1])).side(shape.P, 2, cm(hex.lens[2]), 0.38);
        return { hex, sheet, clash: sheet.clash() };
      }), [a, b, c] = made.hex.lens, total = (a + b + c) * 2;
      return N('직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이다. 이 도형의 둘레는 몇 cm인가?', total, {
        unit: 'cm', figure: made.sheet.svg(`직선 ㅅㅇ을 대칭축으로 하는 선대칭도형 ㄱㄴㄷㄹㅁㅂ. 변 ㄱㄴ ${cm(a)}, 변 ㄴㄷ ${cm(b)}, 변 ㄷㄹ ${cm(c)}`),
        explain: `대응변의 길이는 서로 같으므로 변 ㄱㅂ은 ${cm(a)}, 변 ㅁㅂ은 ${cm(b)}, 변 ㄹㅁ은 ${cm(c)}이다. 둘레는 (${a} + ${b} + ${c}) × 2 = ${total}(cm)`, facts: calc(`(${a}+${b}+${c})*2`, [2])
      });
    }),
    T('lsym-angle-sum', '대응각을 옮겨 남은 한 각 구하기(선대칭)', '①48 ②48 ③38 심54', (d) => {
      // 연 모양 사각형 ㄱㄴㄷㄹ(직선 ㄱㄷ이 대칭축). 각도 셈은 한 번: 대응각을 옮긴 뒤 네 각의 합에서 뺀다. 대칭축 위의 각은 글이 대칭축과 겹치므로 문제 글에 적는다.
      const [a, b] = d.until(() => [d.pick([35, 40, 45, 50, 55]), d.pick([20, 25, 30])], ([x, y]) => x - y >= 15), top = a * 2, sidev = 180 - a - b, ask = b * 2;
      const shape = lineShape({ top: 0, right: [[1, 1 / Math.tan(a * RAD)]], bottom: 1 / Math.tan(a * RAD) + 1 / Math.tan(b * RAD) }, 4.4, 5), found = anglesOf(shape.P);
      if ([top, sidev, ask, sidev].some((x, i) => Math.abs(found[i] - x) > 1e-6)) throw new Error('각의 크기가 생각과 다르다');
      return N(`사각형 ㄱㄴㄷㄹ은 직선 ㄱㄷ을 대칭축으로 하는 선대칭도형이다. 각 ㄴㄱㄹ이 ${top}°이고 각 ㄱㄴㄷ이 ${sidev}°일 때, 각 ㄴㄷㄹ은 몇 도인가?`, ask, {
        unit: '°', figure: axisSheet(shape).svg('직선 ㄱㄷ을 대칭축으로 하는 선대칭도형인 사각형 ㄱㄴㄷㄹ'),
        explain: `각 ㄱㄹㄷ의 대응각은 각 ㄱㄴㄷ이므로 ${sidev}°이다. 사각형의 네 각의 크기의 합은 360°이므로 각 ㄴㄷㄹ은 360° − ${top}° − ${sidev}° − ${sidev}° = ${ask}°`, facts: calc(`360-${top}-${sidev}-${sidev}`, [360])
      });
    }),
    T('lsym-prop', '선대칭도형의 성질', '①39 ②39 ③32 심26', (d) => say(d, '선대칭도형에 대한 설명으로 옳지 않은 것은?',
      ['대칭축으로 나누어진 두 도형은 서로 합동이다.', '각각의 대응변의 길이는 서로 같다.', '각각의 대응각의 크기는 서로 같다.', '대응점끼리 이은 선분은 대칭축과 수직으로 만난다.', '대칭축은 대응점끼리 이은 선분을 똑같이 둘로 나눈다.', '대응점에서 대칭축까지의 거리는 서로 같다.'],
      ['대응점끼리 이은 선분은 대칭축과 평행하다.', '대칭축은 어느 도형에서나 1개뿐이다.', '대응점에서 대칭축까지의 거리는 서로 다르다.'], false,
      '선대칭도형은 대칭축을 따라 접었을 때 완전히 겹친다. 대응변의 길이와 대응각의 크기는 각각 같고, 대응점끼리 이은 선분은 대칭축과 수직으로 만나며 대칭축이 그 선분을 똑같이 둘로 나눈다. 대칭축은 도형에 따라 여러 개일 수도 있다.')),
    T('lsym-draw-order', '선대칭도형을 그리는 차례', '①50·51 ③43', (d) => {
      const steps = ['점 ㄴ에서 대칭축에 수선을 긋는다.', '그은 수선 위에 대칭축까지의 거리가 같도록 점 ㄴ의 대응점을 찍는다.', '같은 방법으로 나머지 점의 대응점도 찍는다.', '찍은 대응점을 차례로 이어 선대칭도형을 완성한다.'];
      const order = d.shuffle([0, 1, 2, 3]), tagOf = (step) => MARKS[order.indexOf(step)], line = (list) => list.map(tagOf).join(' → ');
      const rows = [[line([0, 1, 2, 3]), true], [line([1, 0, 2, 3]), false], [line([0, 1, 3, 2]), false], [line([3, 0, 1, 2]), false]];
      return truthItem(d, '선대칭도형의 나머지 반쪽을 그리는 방법을 차례 없이 적었다. 그리는 차례대로 늘어놓은 것은?', rows, true, {
        figure: tagged(order.map((step) => steps[step]), MARKS),
        explain: `먼저 한 점에서 대칭축에 수선을 긋고(${tagOf(0)}), 그 수선 위에 대칭축까지의 거리가 같도록 대응점을 찍는다(${tagOf(1)}). 나머지 점도 같은 방법으로 찍은 다음(${tagOf(2)}) 차례로 잇는다(${tagOf(3)}).`
      });
    }),
    T('lsym-complete-pick', '선대칭도형이 되게 완성한 도형', '①52 ②49 ③44 심63', (d) => {
      // 그리기를 고르기로. 오답: 옆으로 밀어 옮긴 것, 점대칭이 되게 180° 돌려 옮긴 것, 가장 바깥쪽 점을 한 칸 가깝게 옮긴 것
      const half = d.pick(HALVES), pieces = d.shuffle([half.map(MOVES.fold), half.map(MOVES.turn), half.map(MOVES.slide), tweaked(half, MOVES.fold)]), flags = pieces.map((piece) => isAxis(outline(half, piece), [HX, 0], [HX, 1])), at = flags.indexOf(true);
      const shown = G.board(HX * 2 + 2, HY, [openPath(half), axisLine([HX + 1, -0.45], [HX + 1, HY + 0.45])], { grid: 'lines', scale: 0.95, label: '모눈종이에 선대칭도형의 반쪽과 대칭축이 그려져 있다.' });
      return oneItem('대칭축의 왼쪽에 선대칭도형의 반쪽이 그려져 있다. 나머지 반쪽을 그려 선대칭도형을 바르게 완성한 것은?', TAGS.slice(0, 4), flags, {
        figure: shown + tiles(pieces.map((piece) => madeTile(half, piece, [tileAxis()]))),
        explain: `각 점에서 대칭축에 수선을 긋고, 대칭축까지의 거리가 같은 자리에 대응점을 찍어 이은 것을 찾는다. ${TAGS[at]}만 대칭축을 따라 접었을 때 완전히 겹친다.`
      });
    }),
    T('lsym-draw-point', '선대칭도형을 그릴 때 대응점을 찍을 자리', '①51·52 ②49 ③44 심63', (d) => {
      // 오답: 대칭축까지의 거리가 한 칸 다른 점, 옆으로 밀어 옮긴 자리, 180° 돌려 옮긴 자리
      const made = d.until(() => { const half = d.pick(HALVES), p = d.pick(half.filter(([x, y]) => x <= 1 && y !== HY / 2)); return { half, p }; }, (m) => m.p);
      const { half, p } = made, near = [HX * 2 - p[0] - 1, p[1]], slid = MOVES.slide(p), cands = d.shuffle([MOVES.fold(p), MOVES.turn(p), slid, samePt(near, slid) ? [HX * 2 - p[0] + 1, p[1]] : near]);
      const flags = cands.map((c) => samePt(c, mirror(p, [HX, 0], [HX, 1]))), at = flags.indexOf(true), gap = HX - p[0];
      if (new Set(cands.map((c) => c.join())).size !== 4) throw new Error('보기 점이 겹친다');
      const parts = [openPath(half), axisLine([HX + 1, -0.45], [HX + 1, HY + 0.45]), G.point(shift(p)), G.text([p[0] + 1 - 0.42, p[1] - 0.42], 'ㄱ')].concat(cands.map((c, i) => mark(shift(c), TAGS[i])));
      return oneItem('대칭축의 왼쪽에 선대칭도형의 반쪽이 그려져 있다. 나머지 반쪽을 그릴 때 점 ㄱ의 대응점을 찍을 자리는?', TAGS.slice(0, 4), flags, {
        figure: G.board(HX * 2 + 2, HY, parts, { grid: 'lines', scale: 1.12, label: '모눈종이에 선대칭도형의 반쪽과 대칭축, 점 ㄱ, 점 가, 나, 다, 라가 있다.' }),
        explain: `점 ㄱ에서 대칭축에 수선을 그으면 대칭축까지 ${gap}칸이다. 그 수선을 늘여 대칭축에서 ${gap}칸 떨어진 자리가 대응점이다. 답은 점 ${TAGS[at]}이다.`
      });
    }),
    T('lsym-hidden', '선대칭으로 완성하면 나타나는 수와 글자', '①53 ②50 ③45 심32', (d, n) => {
      if (n === 0) {
        // 디지털 숫자의 위쪽 절반: 가운데 가로선을 대칭축으로 완성하면 수가 된다(위아래가 같은 숫자 0, 1, 3, 8).
        const text = d.until(() => Array.from({ length: d.pick([3, 4]) }, () => d.pick(['0', '1', '3', '8'])).join(''), (t) => t[0] !== '0' && new Set(t).size >= 3);
        const tops = text.split('').map((ch) => G.SEGMENTS[ch].split('').filter((s) => 'abfg'.includes(s)).join(''));
        // 위쪽 절반을 아래로 접어 옮겨 합친 획이 처음 수와 같은지 확인한다.
        const whole = tops.map((segs) => Array.from(new Set((segs + G.segMove(segs, 'updown')).split(''))).sort().join(''));
        if (G.segText(whole) !== text) throw new Error('완성한 수가 생각과 다르다');
        const svg = G.segDigits(tops, { scale: 1.5, label: '디지털 숫자의 위쪽 절반만 보이는 화면. 화면의 한가운데에 가로로 대칭축이 그어져 있다.' }), width = Number(/viewBox="0 0 (\d+)/.exec(svg)[1]);
        const figure = svg.replace('</svg>', `<line x1="3" y1="33" x2="${width - 3}" y2="33" style="stroke:#1d4ed8;stroke-width:1.2;stroke-dasharray:9 3 2 3"/></svg>`);
        return N('계산기 화면이 고장 나서 수의 위쪽 절반만 보인다. 화면 한가운데의 직선을 대칭축으로 하는 선대칭도형이 되도록 아래쪽 절반을 그리면 어떤 수가 되는가?', Number(text), {
          figure, explain: `대칭축을 따라 접었을 때 완전히 겹치도록 위쪽의 획을 아래쪽에 그대로 옮겨 그린다. 완성한 수는 ${text}이다.`, facts: calc(text, [Number(text)])
        });
      }
      // 글자 카드의 왼쪽 절반: 가운데 세로선을 대칭축으로 완성하면 글자가 된다.
      const list = d.shuffle(FOLD_LETTERS).slice(0, 4), want = list[0], half = clip(LETTERS[want], 0, 1.5), options = d.shuffle(list);
      if (new Set(list.map((ch) => halfKey(clip(LETTERS[ch], 0, 1.5)))).size !== 4) throw new Error('왼쪽 절반이 같은 글자가 있다');
      return oneItem('글자 카드의 왼쪽 절반만 보인다. 카드 한가운데의 직선을 대칭축으로 하는 선대칭도형이 되도록 오른쪽 절반을 그리면 어떤 글자가 되는가?', options, options.map((ch) => halfKey(clip(LETTERS[ch], 0, 1.5)) === halfKey(half)), {
        figure: strokeCard(half, { scale: 1, label: '선분으로 그린 글자의 왼쪽 절반과 카드 한가운데의 세로 대칭축', extra: (at) => [axisLine(at([1.5, -0.45]), at([1.5, 4.45]))] }),
        explain: `대칭축을 따라 접었을 때 완전히 겹치도록 왼쪽의 획을 오른쪽에 옮겨 그리면 글자 ${want}가 된다.`
      });
    }, { count: 2 }),
    T('lsym-complete-count', '완성한 선대칭도형의 꼭짓점 수', '①54 심33', (d) => {
      // 대칭축과 수직으로 만나는 변은 건너편의 변과 이어져 한 변이 되고, 비스듬히 만나는 변은 대칭축 위에 꼭짓점을 만든다.
      const half = d.pick(HALVES), whole = joined(half, MOVES.fold), count = whole.length;
      if (!isAxis(sidesOf(whole), [HX, 0], [HX, 1])) throw new Error('완성한 도형이 선대칭이 아니다');
      const top = half[1][1] === half[0][1], bottom = half[half.length - 2][1] === half[half.length - 1][1];
      return N('대칭축의 왼쪽에 선대칭도형의 반쪽이 그려져 있다. 나머지 반쪽을 그려 완성한 선대칭도형의 꼭짓점은 모두 몇 개인가?', count, {
        unit: '개', figure: G.board(HX * 2 + 2, HY, [openPath(half), axisLine([HX + 1, -0.45], [HX + 1, HY + 0.45])], { grid: 'lines', scale: 1.12, label: '모눈종이에 선대칭도형의 반쪽과 대칭축이 그려져 있다.' }),
        explain: `대칭축 위에 있지 않은 꼭짓점은 ${half.length - 2}개이고 대응점도 ${half.length - 2}개이다. 대칭축과 만나는 곳은 변이 대칭축과 수직이면 건너편 변과 이어져 꼭짓점이 생기지 않고, 비스듬하면 꼭짓점이 생긴다. 위쪽은 ${top ? '수직' : '비스듬'}, 아래쪽은 ${bottom ? '수직' : '비스듬'}이므로 꼭짓점은 모두 ${count}개이다.`,
        facts: calc(`${half.length - 2}*2+${count - (half.length - 2) * 2}`, [half.length - 2, 2, count - (half.length - 2) * 2])
      });
    })
  ]);

  // ── 점대칭도형과 대칭의 중심 ──────────────────────────────────
  // 점 c 가 이 도형의 대칭의 중심인가(그 점을 중심으로 180° 돌리면 처음과 같은가)
  const isCentre = (pts, c) => { const segs = sidesOf(pts); return sameFig(segs.map((s) => s.map((p) => halfTurn(p, c))), segs); };
  B.addTypes('5-2-3', 'point', [
    T('point-word', '점대칭도형과 대칭의 중심의 뜻', '①58 ②52 ③48 심1', (d, n) => (n === 0
      ? N(`어떤 점을 중심으로 ${box()}°만큼 돌렸을 때 처음 도형과 완전히 겹치는 도형을 점대칭도형이라고 한다. ${box()} 안에 알맞은 수는?`, 180, { explain: '한 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형을 점대칭도형이라고 한다.', facts: calc('180', [180]) })
      : pickWord(d, '점대칭도형을 180° 돌릴 때 중심이 되는 점을 무엇이라고 하는가?', '대칭의 중심', ['대칭축', '대응점', '꼭짓점'], '한 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형을 점대칭도형이라 하고, 그 점을 대칭의 중심이라고 한다.')), { count: 2 }),
    T('point-find', '점대칭도형 찾기', '①59 ②53 ③49 심14', (d) => {
      // 점대칭이 아닌 것에는 선대칭뿐인 도형(이등변삼각형, 사다리꼴 따위)을 꼭 넣는다.
      const turns = from(d, (s) => s.turn, d.int(2, 3)), list = d.shuffle(turns.concat(from(d, LINE_ONLY, 4 - turns.length), from(d, NEITHER, 1))), labels = TAGS.slice(0, 5), flags = list.map((s) => kindOfPoly(s.pts).turn);
      return setItem(d, '점대칭도형을 모두 고른 것은?', labels, flags, {
        figure: gridTiles(list.map((s) => s.pts)), again: { kind: 'turn', polys: list.map((s) => s.pts), flags }, explain: `한 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형을 찾는다. 점대칭도형은 ${tagList(labels, flags)}이다. 접어서 겹치는 도형이라도 180° 돌렸을 때 겹치지 않으면 점대칭도형이 아니다.`
      });
    }),
    T('point-letter', '점대칭 모양인 글자와 숫자', '①60 ②55 ③50 심29', (d, n) => {
      if (n === 1) {
        // 디지털 숫자 카드: 2와 5는 접어서는 겹치지 않지만 180° 돌리면 겹친다. 3은 접으면 겹치지만 돌리면 겹치지 않는다.
        const turn = d.shuffle(DIGITS.filter((x) => DIGIT_KIND[x].turn)).slice(0, d.int(2, 3)), list = d.shuffle(turn.concat([3], d.shuffle(DIGITS.filter((x) => !DIGIT_KIND[x].turn && x !== 3)).slice(0, 5 - turn.length))).sort((x, y) => x - y);
        const flags = list.map((x) => DIGIT_KIND[x].turn), count = flags.filter(Boolean).length;
        return N('디지털 숫자 카드이다. 점대칭도형 모양인 숫자 카드는 모두 몇 장인가?', count, {
          unit: '장', figure: plainRow(list.map((x) => digitCard(x))), explain: `카드를 180° 돌렸을 때 처음과 완전히 겹치는 숫자를 찾는다. ${list.filter((_, i) => flags[i]).map((x, i, all) => (i === all.length - 1 ? josa(x, '이/가') : x)).join(', ')} 점대칭도형 모양이므로 모두 ${count}장이다.`, facts: { count: flags }
        });
      }
      const names = Object.keys(JAMO), turn = d.shuffle(names.filter((ch) => JAMO_KIND[ch].turn)).slice(0, 2), line = d.shuffle(names.filter((ch) => JAMO_KIND[ch].line && !JAMO_KIND[ch].turn)).slice(0, 2), none = d.shuffle(names.filter((ch) => !JAMO_KIND[ch].line && !JAMO_KIND[ch].turn)).slice(0, 1);
      const list = d.shuffle(turn.concat(line, none)), flags = list.map((ch) => kindOf(JAMO[ch]).turn);
      return setItem(d, '선분으로 그린 자음자 카드이다. 점대칭도형 모양인 글자를 모두 고른 것은?', list, flags, {
        figure: letterTiles(JAMO, list, list), explain: `카드를 180° 돌렸을 때 처음과 완전히 겹치는 글자를 찾는다. 점대칭도형 모양인 글자는 ${tagList(list, flags)}이다. 나머지는 180° 돌리면 처음과 다른 모양이 된다.`
      });
    }, { count: 2 }),
    T('point-center', '대칭의 중심 찾기', '①61·62·63 ②58·59 ③51·52 심15·66', (d, n) => {
      if (n === 1) {
        // 대칭의 중심을 잘못 나타낸 것: 점이 한 칸 치우쳐 있다.
        const list = from(d, (s) => s.turn, 4), odd = d.int(0, 3), dots = list.map((s, i) => { const c = mean(s.pts), near = d.shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]]).map(([x, y]) => [c[0] + x, c[1] + y]); return i === odd ? (near.find((p) => insidePoly(p, s.pts)) || near[0]) : c; });
        const flags = list.map((s, i) => !isCentre(s.pts, dots[i])), at = flags.indexOf(true);
        return oneItem('점대칭도형에 대칭의 중심을 점으로 나타내었다. 대칭의 중심을 잘못 나타낸 것은?', TAGS.slice(0, 4), flags, {
          figure: tiles(list.map((s, i) => onGrid(s.pts, { extra: (m) => [centreDot(m(dots[i]))], label: '모눈종이 위의 점대칭도형과 붉은 점 하나' }))),
          explain: `대칭의 중심은 대응점끼리 이은 선분들이 만나는 점이다. ${TAGS[at]}는 점이 한 칸 치우쳐 있어서, 그 점을 중심으로 180° 돌리면 처음 도형과 겹치지 않는다.`
        });
      }
      const made = d.until(() => {
        // 틀린 점은 되도록 도형 안쪽(변에서 떨어진 곳)에서 고른다.
        const [s] = from(d, (x) => x.turn, 1), c = mean(s.pts), near = d.shuffle([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]).map(([x, y]) => [c[0] + x, c[1] + y]);
        const deep = (p) => insidePoly(p, s.pts) && Math.min(...sidesOf(s.pts).map(([a, b]) => { const r = [b[0] - a[0], b[1] - a[1]], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * r[0] + (p[1] - a[1]) * r[1]) / (r[0] * r[0] + r[1] * r[1]))); return Math.hypot(p[0] - a[0] - r[0] * t, p[1] - a[1] - r[1] * t); })) > 0.3;
        const wrong = near.filter(deep).concat(near.filter((p) => !deep(p) && p[0] >= 0 && p[0] <= 4 && p[1] >= 0 && p[1] <= 4)).slice(0, 3);
        return { s, cands: d.shuffle([c].concat(wrong)) };
      }, (m) => m.cands.length === 4);
      const flags = made.cands.map((p) => isCentre(made.s.pts, p)), at = flags.indexOf(true);
      return oneItem('점대칭도형에서 대칭의 중심은 어느 점인가?', TAGS.slice(0, 4).map((t) => '점 ' + t), flags, {
        figure: onGrid(made.s.pts, { scale: 1.7, extra: (m) => made.cands.map((p, i) => mark(m(p), TAGS[i])), label: '모눈종이 위의 점대칭도형과 점 가, 나, 다, 라' }),
        explain: `대응점끼리 이은 선분들이 만나는 점이 대칭의 중심이다. 점 ${TAGS[at]}를 중심으로 180° 돌리면 처음 도형과 완전히 겹친다.`
      });
    }, { count: 2 }),
    T('point-pairs', '점대칭도형에서 대응점의 수', '①65 심15', (d) => {
      const [s] = from(d, (x) => x.turn && x.pts.length >= 6, 1), count = tidy(s.pts).length;
      return N('점대칭도형에서 대응점은 모두 몇 쌍인가?', count / 2, {
        unit: '쌍', figure: onGrid(s.pts, { scale: 1.5, extra: (m) => [centreDot(m(mean(s.pts)))], label: `모눈종이 위의 점대칭도형과 대칭의 중심. 꼭짓점은 ${count}개이다.` }),
        explain: `꼭짓점마다 대칭의 중심 건너편에 대응점이 하나씩 있다. 꼭짓점이 ${count}개이므로 대응점은 ${count} ÷ 2 = ${count / 2}(쌍)이다.`, facts: calc(`${count}/2`, [2])
      });
    })
  ]);

  // ── 점대칭도형의 성질과 그리기 ────────────────────────────────
  B.addTypes('5-2-3', 'psym', [
    T('psym-find', '점대칭도형에서 대응변·대응각 찾기', '①66 ②60 ③59 심16', (d, n) => {
      const shape = turnShape(plainTurnShape(d)), nm = shape.names, all = nm.map((_, i) => i), figure = centerSheet(shape).svg(`점 ㅇ을 대칭의 중심으로 하는 점대칭도형. 꼭짓점은 ${nm.join(', ')}`), i = d.int(0, shape.n - 1), next = (i + 1) % shape.n;
      const lead = '점 ㅇ을 대칭의 중심으로 하는 점대칭도형이다. ';
      if (n === 0) {
        const want = [shape.partner(i), shape.partner(next)].sort().join(), same = (j) => [j, (j + 1) % shape.n].sort().join() === want, list = d.shuffle(all.filter((j) => j !== i)).slice(0, Math.min(4, shape.n - 1));
        if (!list.some(same)) list[0] = all.find(same);
        const options = d.shuffle(list);
        return oneItem(`${lead}${sideOf(nm, i)}의 대응변은?`, options.map((j) => sideOf(nm, j)), options.map(same), {
          figure, explain: `점 ㅇ을 중심으로 180° 돌렸을 때 점 ${nm[i]}은 점 ${nm[shape.partner(i)]}과, 점 ${nm[next]}은 점 ${nm[shape.partner(next)]}과 겹친다. ${sideOf(nm, i)}과 겹치는 변은 ${sideOf(nm, options.find(same))}이다.`
        });
      }
      const list = d.shuffle(all.filter((j) => j !== i)).slice(0, Math.min(4, shape.n - 1));
      if (!list.includes(shape.partner(i))) list[0] = shape.partner(i);
      const options = d.shuffle(list);
      return oneItem(`${lead}${angleOf(nm, i)}의 대응각은?`, options.map((j) => angleOf(nm, j)), options.map((j) => j === shape.partner(i)), {
        figure, explain: `점 ㅇ을 중심으로 180° 돌렸을 때 점 ${nm[i]}과 겹치는 점은 대칭의 중심 건너편의 점 ${nm[shape.partner(i)]}이다. ${angleOf(nm, i)}과 겹치는 각은 ${angleOf(nm, shape.partner(i))}이다.`
      });
    }, { count: 2 }),
    T('psym-talk', '점대칭도형에 대한 설명 가려내기', '②61 심16', (d) => {
      const shape = turnShape(someTurnHex(d).raw), nm = shape.names, bad = d.int(0, 2), pr = (i) => shape.partner(i);
      if (pr(0) !== 3 || pr(1) !== 4 || pr(2) !== 5) throw new Error('대응이 생각과 다르다');
      const rows = [
        [`점 ㄴ의 대응점은 점 ${bad === 0 ? nm[5] : nm[4]}이다.`, bad !== 0],
        [`변 ㄱㄴ의 대응변은 ${bad === 1 ? sideOf(nm, 4) : sideOf(nm, 3)}이다.`, bad !== 1],
        [`각 ㄴㄷㄹ의 대응각은 ${bad === 2 ? angleOf(nm, 4) : angleOf(nm, 5)}이다.`, bad !== 2],
        ['선분 ㄱㅇ과 선분 ㄹㅇ은 길이가 같다.', true]
      ];
      return truthItem(d, '점 ㅇ을 대칭의 중심으로 하는 점대칭도형이다. 옳지 않은 설명은?', rows, false, {
        figure: centerSheet(shape).svg('점 ㅇ을 대칭의 중심으로 하는 점대칭도형 ㄱㄴㄷㄹㅁㅂ'),
        explain: '점 ㅇ을 중심으로 180° 돌리면 점 ㄱ은 점 ㄹ과, 점 ㄴ은 점 ㅁ과, 점 ㄷ은 점 ㅂ과 겹친다. 그러므로 변 ㄱㄴ의 대응변은 변 ㄹㅁ이고, 각 ㄴㄷㄹ의 대응각은 각 ㄱㅂㅁ이다.'
      });
    }),
    T('psym-read', '점대칭도형의 대응변의 길이와 대응각의 크기', '①67 ②63 ③60·61·62 심17', (d) => {
      // 육각형 ㄱㄴㄷㄹㅁㅂ의 한쪽 변 셋과 각 둘이 적혀 있다. 대칭의 중심 건너편의 변과 각을 묻는다.
      const made = drawn(d, () => {
        const hex = someTurnHex(d), shape = turnShape(hex.raw, 5.6, 4.6), sheet = centerSheet(shape);
        if (anglesOf(shape.P).some((x, i) => Math.abs(x - hex.angles[i]) > 1e-6)) throw new Error('각의 크기가 생각과 다르다');
        // 크기를 적는 두 각 사이의 변이 짧으면 글이 서로 붙는다.
        if (hex.lens[1] < 7) return { clash: true };
        [0, 1, 2].forEach((i) => sheet.side(shape.P, i, cm(hex.lens[i])));
        sheet.corner(shape.P, 1, hex.angles[1] + '°').corner(shape.P, 2, hex.angles[2] + '°');
        return { hex, shape, sheet, clash: sheet.clash() };
      });
      const { hex, shape } = made, nm = shape.names, si = d.int(0, 2), ai = d.pick([1, 2]);
      return M(`점 ㅇ을 대칭의 중심으로 하는 점대칭도형이다. ${sideOf(nm, si + 3)}의 길이와 ${angleOf(nm, ai + 3)}의 크기를 구하시오.`, [{ label: sideOf(nm, si + 3), answer: hex.lens[si], unit: 'cm' }, { label: angleOf(nm, ai + 3), answer: hex.angles[ai], unit: '°' }], {
        figure: made.sheet.svg(`점 ㅇ을 대칭의 중심으로 하는 점대칭도형 ㄱㄴㄷㄹㅁㅂ. 변 ㄱㄴ ${cm(hex.lens[0])}, 변 ㄴㄷ ${cm(hex.lens[1])}, 변 ㄷㄹ ${cm(hex.lens[2])}, 각 ㄱㄴㄷ ${hex.angles[1]}°, 각 ㄴㄷㄹ ${hex.angles[2]}°`),
        explain: `${sideOf(nm, si + 3)}의 대응변은 ${sideOf(nm, si)}이므로 ${cm(hex.lens[si])}이고, ${angleOf(nm, ai + 3)}의 대응각은 ${angleOf(nm, ai)}이므로 ${hex.angles[ai]}°이다.`,
        facts: { calc: [[String(hex.lens[si]), 0], [String(hex.angles[ai]), 1]] }
      });
    }),
    T('psym-dist', '대칭의 중심이 대응점을 이은 선분을 똑같이 둘로 나눈다', '①68·69 ②64·65 ③63 심17', (d, n) => {
      // 육각형 ㄱㄴㄷㄹㅁㅂ에 대응점을 이은 선분 ㄱㄹ, ㄴㅁ, ㄷㅂ을 긋는다. 중심에서 세 꼭짓점까지의 거리는 뚜렷이 다르다.
      const shape = d.until(() => turnShape(someTurnHex(d).raw), (s) => { const r = [0, 1, 2].map((i) => dist(s.P[i], s.O)); return r.every((x, i) => r.every((y, j) => i === j || Math.max(x, y) / Math.min(x, y) >= 1.2)); });
      const nm = shape.names, figure = centerSheet(shape, { links: [0, 1, 2] }).svg('점 ㅇ을 대칭의 중심으로 하는 점대칭도형 ㄱㄴㄷㄹㅁㅂ. 선분 ㄱㄹ, 선분 ㄴㅁ, 선분 ㄷㅂ이 점 ㅇ에서 만난다.');
      const lead = '점 ㅇ을 대칭의 중심으로 하는 점대칭도형이다. ', i = d.int(0, 2), a = nm[i], b = nm[i + 3];
      if (n === 0) {
        const rows = d.shuffle(nm.filter((x) => x !== a)).slice(0, 4);
        if (!rows.includes(b)) rows[0] = b;
        const options = d.shuffle(rows);
        return oneItem(`${lead}선분 ${a}ㅇ과 길이가 같은 선분은?`, options.map((x) => `선분 ${x}ㅇ`), options.map((x) => x === b), {
          figure, explain: `점 ${a}의 대응점은 점 ${b}이다. 대칭의 중심은 대응점끼리 이은 선분을 똑같이 둘로 나누므로 선분 ${a}ㅇ과 선분 ${b}ㅇ의 길이가 같다.`
        });
      }
      const half = d.int(4, 12), twice = d.bool();
      return N(twice ? `${lead}선분 ${a}ㅇ이 ${cm(half)}일 때 ${seg(a, b)}은 몇 cm인가?` : `${lead}${seg(a, b)}이 ${cm(half * 2)}일 때 선분 ${b}ㅇ은 몇 cm인가?`, twice ? half * 2 : half, {
        unit: 'cm', figure, explain: twice ? `대칭의 중심은 대응점끼리 이은 ${seg(a, b)}을 똑같이 둘로 나눈다. 선분 ${b}ㅇ도 ${cm(half)}이므로 ${seg(a, b)}은 ${half} + ${half} = ${half * 2}(cm)` : `대칭의 중심은 대응점끼리 이은 ${seg(a, b)}을 똑같이 둘로 나눈다. 선분 ${b}ㅇ은 ${half * 2} ÷ 2 = ${half}(cm)`,
        facts: calc(twice ? `${half}+${half}` : `${half * 2}/2`, [2])
      });
    }, { count: 2 }),
    T('psym-peri', '점대칭도형의 둘레', '①70 ②67 ③65 심18', (d) => {
      const made = drawn(d, () => {
        const hex = someTurnHex(d), shape = turnShape(hex.raw, 5, 4.2), sheet = centerSheet(shape);
        [0, 1, 2].forEach((i) => sheet.side(shape.P, i, cm(hex.lens[i])));
        return { hex, sheet, clash: sheet.clash() };
      }), [a, b, c] = made.hex.lens, total = (a + b + c) * 2;
      return N('점 ㅇ을 대칭의 중심으로 하는 점대칭도형이다. 이 도형의 둘레는 몇 cm인가?', total, {
        unit: 'cm', figure: made.sheet.svg(`점 ㅇ을 대칭의 중심으로 하는 점대칭도형 ㄱㄴㄷㄹㅁㅂ. 변 ㄱㄴ ${cm(a)}, 변 ㄴㄷ ${cm(b)}, 변 ㄷㄹ ${cm(c)}`),
        explain: `대응변의 길이는 서로 같으므로 변 ㄹㅁ은 ${cm(a)}, 변 ㅁㅂ은 ${cm(b)}, 변 ㄱㅂ은 ${cm(c)}이다. 둘레는 (${a} + ${b} + ${c}) × 2 = ${total}(cm)`, facts: calc(`(${a}+${b}+${c})*2`, [2])
      });
    }),
    T('psym-angle-sum', '대응각을 옮겨 남은 한 각 구하기(점대칭)', '①73 ②70 심57', (d) => {
      // 평행사변형 ㄱㄴㄷㄹ에 대각선 ㄴㄹ을 긋는다. 삼각형 ㄴㄷㄹ의 두 각으로 각 ㄴㄷㄹ을 구하면 그 대응각이 각 ㄴㄱㄹ이다(각도 셈은 한 번).
      const made = drawn(d, () => {
        const [x, y] = d.until(() => [d.pick([25, 30, 35, 40, 45]), d.pick([30, 35, 40, 45, 50, 55])], ([p, q]) => Math.abs(p - q) >= 10 && p + q <= 85);
        // 점 ㄴ(왼쪽 아래), ㄷ(오른쪽 아래)은 밑변 위. 각 ㄷㄴㄹ = x, 각 ㄴㄹㄷ = y 가 되게 점 ㄹ을 잡는다(각 ㄴㄷㄹ = 180 − x − y).
        const z = 180 - x - y, base = 5, n2 = [0, 0], n3 = [base, 0], side = base * Math.sin(x * RAD) / Math.sin(y * RAD), n4 = G.toward(n3, side, 180 - z), n1 = [n2[0] + n4[0] - n3[0], n2[1] + n4[1] - n3[1]];
        const shape = turnShape([n1, n2, n3, n4], 5.6, 4.2), P = shape.P, sheet = centerSheet(shape, { links: [1] });
        if (Math.abs(anglesOf(P)[2] - z) > 1e-6 || shape.partner(1) !== 3) return { clash: true };
        sheet.between(P[1], P[2], P[3], x + '°').between(P[3], P[1], P[2], y + '°');
        return { x, y, z, sheet, clash: sheet.clash() };
      }), { x, y, z } = made;
      return N('사각형 ㄱㄴㄷㄹ은 점 ㅇ을 대칭의 중심으로 하는 점대칭도형이다. 각 ㄴㄱㄹ은 몇 도인가?', z, {
        unit: '°', figure: made.sheet.svg(`점 ㅇ을 대칭의 중심으로 하는 점대칭도형인 사각형 ㄱㄴㄷㄹ과 선분 ㄴㄹ. 각 ㄷㄴㄹ ${x}°, 각 ㄴㄹㄷ ${y}°`),
        explain: `삼각형 ㄴㄷㄹ에서 각 ㄴㄷㄹ은 180° − ${x}° − ${y}° = ${z}°이다. 각 ㄴㄱㄹ의 대응각은 각 ㄴㄷㄹ이므로 각 ㄴㄱㄹ도 ${z}°이다.`, facts: calc(`180-${x}-${y}`, [180])
      });
    }),
    T('psym-prop', '점대칭도형의 성질', '①64 ②62 ③54·58 심27', (d) => say(d, '점대칭도형에 대한 설명으로 옳지 않은 것은?',
      ['각각의 대응변의 길이는 서로 같다.', '각각의 대응각의 크기는 서로 같다.', '대칭의 중심은 대응점끼리 이은 선분을 똑같이 둘로 나눈다.', '대응점끼리 이은 선분은 모두 대칭의 중심을 지난다.', '대칭의 중심은 1개뿐이다.', '대응점에서 대칭의 중심까지의 거리는 서로 같다.'],
      ['대칭의 중심은 도형에 따라 여러 개일 수도 있다.', '대칭의 중심에서 모든 꼭짓점까지의 거리는 같다.', '점대칭도형은 어느 것이나 한 직선을 따라 접으면 완전히 겹친다.'], false,
      '점대칭도형은 한 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹친다. 대칭의 중심은 1개뿐이고, 대응점끼리 이은 선분을 똑같이 둘로 나눈다. 거리가 같은 것은 서로 대응점인 두 점까지이고, 모든 꼭짓점까지의 거리가 같은 것은 아니다.')),
    T('psym-draw-order', '점대칭도형을 그리는 차례', '①77·78 ③67', (d) => {
      const steps = ['점 ㄴ에서 대칭의 중심을 지나는 직선을 긋는다.', '그은 직선 위에 대칭의 중심까지의 거리가 같도록 점 ㄴ의 대응점을 찍는다.', '같은 방법으로 나머지 점의 대응점도 찍는다.', '찍은 대응점을 차례로 이어 점대칭도형을 완성한다.'];
      const order = d.shuffle([0, 1, 2, 3]), tagOf = (step) => MARKS[order.indexOf(step)], line = (list) => list.map(tagOf).join(' → ');
      const rows = [[line([0, 1, 2, 3]), true], [line([1, 0, 2, 3]), false], [line([0, 1, 3, 2]), false], [line([3, 0, 1, 2]), false]];
      return truthItem(d, '점대칭도형의 나머지 반쪽을 그리는 방법을 차례 없이 적었다. 그리는 차례대로 늘어놓은 것은?', rows, true, {
        figure: tagged(order.map((step) => steps[step]), MARKS),
        explain: `먼저 한 점에서 대칭의 중심을 지나는 직선을 긋고(${tagOf(0)}), 그 직선 위에 대칭의 중심까지의 거리가 같도록 대응점을 찍는다(${tagOf(1)}). 나머지 점도 같은 방법으로 찍은 다음(${tagOf(2)}) 차례로 잇는다(${tagOf(3)}).`
      });
    }),
    T('psym-complete-pick', '점대칭도형이 되게 완성한 도형', '①79 ②71 ③68 심65', (d) => {
      // 오답: 선대칭이 되게 접어 옮긴 것, 옆으로 밀어 옮긴 것, 가장 바깥쪽 점을 한 칸 가깝게 옮긴 것
      const half = d.pick(HALVES), centre = [HX, HY / 2], pieces = d.shuffle([half.map(MOVES.turn), half.map(MOVES.fold), half.map(MOVES.slide), tweaked(half, MOVES.turn)]);
      const flags = pieces.map((piece) => { const segs = outline(half, piece); return sameFig(segs.map((s) => s.map((p) => halfTurn(p, centre))), segs); }), at = flags.indexOf(true);
      const shown = G.board(HX * 2 + 2, HY, [openPath(half), centreDot(shift(centre)), G.text([HX + 1 + 0.42, HY / 2 - 0.4], 'ㅇ')], { grid: 'lines', scale: 0.95, label: '모눈종이에 점대칭도형의 반쪽과 대칭의 중심 ㅇ이 그려져 있다.' });
      return oneItem('점 ㅇ을 대칭의 중심으로 하는 점대칭도형의 반쪽이 그려져 있다. 나머지 반쪽을 그려 점대칭도형을 바르게 완성한 것은?', TAGS.slice(0, 4), flags, {
        figure: shown + tiles(pieces.map((piece) => madeTile(half, piece, [centreDot(centre)]))),
        explain: `각 점에서 대칭의 중심을 지나는 직선을 긋고, 대칭의 중심까지의 거리가 같은 자리에 대응점을 찍어 이은 것을 찾는다. ${TAGS[at]}만 점 ㅇ을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹친다.`
      });
    }),
    T('psym-draw-point', '점대칭도형을 그릴 때 대응점을 찍을 자리', '①78·79 ②71 ③68 심65', (d) => {
      // 오답: 세로선으로 접어 옮긴 자리, 옆으로 밀어 옮긴 자리, 대칭의 중심까지의 거리가 한 칸 짧은 자리
      const half = d.pick(HALVES), p = d.pick(half.filter(([x, y]) => x <= 1 && y !== HY / 2)), centre = [HX, HY / 2], want = halfTurn(p, centre);
      const cands = d.shuffle([want, MOVES.fold(p), MOVES.slide(p), [want[0] - 1, want[1]]]), flags = cands.map((c) => samePt(c, want)), at = flags.indexOf(true);
      if (new Set(cands.map((c) => c.join())).size !== 4) throw new Error('보기 점이 겹친다');
      const parts = [openPath(half), centreDot(shift(centre)), G.text([HX + 1 - 0.1, HY / 2 - 0.5], 'ㅇ'), G.point(shift(p)), G.text([p[0] + 1 - 0.42, p[1] - 0.42], 'ㄱ')].concat(cands.map((c, i) => mark(shift(c), TAGS[i])));
      return oneItem('점 ㅇ을 대칭의 중심으로 하는 점대칭도형의 반쪽이 그려져 있다. 나머지 반쪽을 그릴 때 점 ㄱ의 대응점을 찍을 자리는?', TAGS.slice(0, 4), flags, {
        figure: G.board(HX * 2 + 2, HY, parts, { grid: 'lines', scale: 1.12, label: '모눈종이에 점대칭도형의 반쪽과 대칭의 중심 ㅇ, 점 ㄱ, 점 가, 나, 다, 라가 있다.' }),
        explain: `점 ㄱ에서 점 ㅇ을 지나는 직선을 긋고, 그 직선 위에서 점 ㅇ까지의 거리가 선분 ㄱㅇ과 같은 자리를 찾는다. 점 ㄱ에서 점 ㅇ까지 오른쪽으로 ${HX - p[0]}칸, ${p[1] < HY / 2 ? '아래쪽' : '위쪽'}으로 ${Math.abs(HY / 2 - p[1])}칸이므로 점 ㅇ에서 같은 만큼 더 간 점 ${TAGS[at]}이다.`
      });
    }),
    T('psym-hidden', '점대칭으로 완성하면 나타나는 글자', '①80 심32', (d) => {
      // 글자 카드의 위쪽 절반: 카드의 한가운데를 대칭의 중심으로 180° 돌려 옮기면 글자가 된다.
      const list = d.shuffle(TURN_LETTERS).slice(0, 4), want = list[0], half = clip(LETTERS[want], 1, 2), options = d.shuffle(list);
      if (new Set(list.map((ch) => halfKey(clip(LETTERS[ch], 1, 2)))).size !== 4) throw new Error('위쪽 절반이 같은 글자가 있다');
      return oneItem('글자 카드의 위쪽 절반만 보인다. 점 ㅇ을 대칭의 중심으로 하는 점대칭도형이 되도록 아래쪽 절반을 그리면 어떤 글자가 되는가?', options, options.map((ch) => halfKey(clip(LETTERS[ch], 1, 2)) === halfKey(half)), {
        figure: strokeCard(half, { scale: 1, label: '선분으로 그린 글자의 위쪽 절반과 카드 한가운데의 점 ㅇ', extra: (at) => [centreDot(at([1.5, 2])), G.text(at([want === 'N' || want === 'X' || want === 'Z' ? 2.1 : 1.5, 2.5]), 'ㅇ')] }),
        explain: `위쪽의 획을 점 ㅇ을 중심으로 180° 돌려 아래쪽에 옮겨 그리면 글자 ${want}가 된다. 위쪽 부분은 아래쪽으로, 왼쪽 부분은 오른쪽으로 간다.`
      });
    })
  ]);

  // ── 선대칭도형과 점대칭도형 ───────────────────────────────────
  const KINDS = ['선대칭도형이지만 점대칭도형은 아니다.', '점대칭도형이지만 선대칭도형은 아니다.', '선대칭도형이면서 점대칭도형이다.', '선대칭도형도 점대칭도형도 아니다.'];
  const kindAt = (k) => (k.axes > 0 && !k.turn ? 0 : k.axes === 0 && k.turn ? 1 : k.axes > 0 && k.turn ? 2 : 3);
  B.addTypes('5-2-3', 'both', [
    T('both-find', '선대칭도형이면서 점대칭도형인 것', '①84 ②74 ③55·56 심24', (d) => {
      const both = from(d, BOTH, d.int(1, 2)), list = d.shuffle(both.concat(from(d, LINE_ONLY, 3 - both.length), from(d, TURN_ONLY, 1), from(d, NEITHER, 1))), labels = TAGS.slice(0, 5), kinds = list.map((s) => kindOfPoly(s.pts)), flags = kinds.map((k) => k.axes > 0 && k.turn);
      return setItem(d, '선대칭도형이면서 점대칭도형인 것을 모두 고른 것은?', labels, flags, {
        figure: gridTiles(list.map((s) => s.pts)), again: { kind: 'both', polys: list.map((s) => s.pts), flags },
        explain: `선대칭도형은 ${tagList(labels, kinds.map((k) => k.axes > 0))}이고, 점대칭도형은 ${tagList(labels, kinds.map((k) => k.turn))}이다. 둘 다인 것은 ${tagList(labels, flags)}이다.`
      });
    }),
    T('both-kind', '도형 하나를 선대칭·점대칭으로 가르기', '②52 ③55 심22', (d) => {
      const [s] = from(d, d.pick([LINE_ONLY, TURN_ONLY, TURN_ONLY, BOTH, NEITHER]), 1), k = kindOfPoly(s.pts), order = d.shuffle([0, 1, 2, 3]);
      return oneItem('모눈종이에 그린 도형에 대한 설명으로 옳은 것은?', order.map((i) => KINDS[i]), order.map((i) => i === kindAt(k)), {
        figure: onGrid(s.pts, { scale: 1.3 }),
        explain: `이 도형은 접었을 때 완전히 겹치는 직선이 ${k.axes > 0 ? k.axes + '개 있고' : '없고'}, 한 점을 중심으로 180° 돌렸을 때 처음 도형과 ${k.turn ? '완전히 겹친다' : '겹치지 않는다'}. 그러므로 ${KINDS[kindAt(k)]}`
      });
    }),
    T('both-letter', '선대칭이면서 점대칭인 글자', '②75 심29', (d) => {
      // 선분으로 그린 알파벳 카드 여섯 장: 둘 다인 글자(H, I, X), 선대칭뿐인 글자, 점대칭뿐인 글자(N, S, Z)를 섞는다.
      const names = Object.keys(LETTERS), pick = (test, k) => d.shuffle(names.filter((ch) => test(LETTER_KIND[ch]))).slice(0, k), both = pick((k) => k.line && k.turn, d.int(1, 2));
      const list = both.concat(pick((k) => k.line && !k.turn, 4 - both.length), pick((k) => !k.line && k.turn, 2)).sort(), flags = list.map((ch) => { const k = kindOf(LETTERS[ch]); return k.axes > 0 && k.turn; }), count = flags.filter(Boolean).length;
      return N('선분으로 그린 알파벳 카드이다. 선대칭도형이면서 점대칭도형인 글자는 모두 몇 개인가?', count, {
        unit: '개', figure: letterTiles(LETTERS, list, list),
        explain: `선대칭도형 모양인 글자는 ${list.filter((ch) => LETTER_KIND[ch].line).join(', ')}이고, 점대칭도형 모양인 글자는 ${list.filter((ch) => LETTER_KIND[ch].turn).join(', ')}이다. 둘 다인 글자는 ${list.filter((_, i) => flags[i]).join(', ')}이므로 ${count}개이다.`, facts: { count: flags }
      });
    }),
    T('both-talk', '선대칭도형과 점대칭도형의 뜻 가르기', '①86 ②27 ③54', (d) => say(d, '선대칭도형과 점대칭도형에 대한 설명으로 옳은 것은?',
      ['선대칭도형은 한 직선을 따라 접었을 때 완전히 겹치는 도형이다.', '점대칭도형은 한 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형이다.', '선대칭도형이면서 점대칭도형인 도형도 있다.'],
      ['점대칭도형은 한 직선을 따라 접었을 때 완전히 겹치는 도형이다.', '선대칭도형은 한 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형이다.', '점대칭도형은 모두 선대칭도형이다.', '선대칭도형은 모두 점대칭도형이다.', '점대칭도형에는 대칭축이 1개 있다.'], true,
      '선대칭도형은 한 직선(대칭축)을 따라 접었을 때 완전히 겹치는 도형이고, 점대칭도형은 한 점(대칭의 중심)을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형이다. 직사각형처럼 둘 다인 도형도 있고, 평행사변형처럼 점대칭도형이지만 선대칭도형이 아닌 도형도 있다.'))
  ]);

  // 5-2-3c.js(실력)가 같은 도구를 쓴다.
  Object.assign(K, { seg, sideOf, angleOf, lineShape, axisSheet, lengthHex, angleHex, turnShape, centerSheet, turnHex, someTurnHex, HALVES, HX, HY, MOVES, tweaked, outline, madeTile, tileAxis, shift, openPath, joined, clip, isCentre, KINDS, kindAt, SLANT });
})(typeof window !== 'undefined' ? window : globalThis);
