// 3학년 1학기 2단원 평면도형 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록(기본꼴 1~4와 통합 목록, 심화꼴)과 덧문서를 처음부터 끝까지 다시 읽고, 3-1-2a.js·3-1-2b.js 의 유형이 묻지 않는 꼴을 옮겼다.
// 꼴과 조건은 그 문제를 따르고 그림과 문장은 새로 만들었다. ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n·④n 은 기본꼴_2·3·4, 심n 은 심화꼴의 n번이다.
// 주는 것(그림 하나·그림 여럿·글만), 묻는 것(수·고르기·차례·까닭), 그림의 얼개(선분과 점·그려진 도형·자른 종이)가 다르면 따로 실었다.
//
// 뺀 것과 까닭
//  - 위 학년: 네 변의 길이의 합이 나오는 꼴 모두, 이어 붙인 도형의 변·선분 길이(5학년 「다각형의 둘레와 넓이」 — b.js 의 판정을 그대로 따랐다),
//    직사각형에서 만들 수 있는 가장 큰 정사각형(b.js 의 판정), 크고 작은 각·직각삼각형·직사각형·정사각형 세기와 점을 이어 그을 수 있는
//    선분·반직선·각의 수(경우 따지기), 「정사각형은 직사각형이다」 같은 포함 관계 말 가리기(4학년), 「각의 크기」가 보기에 나오는 것(4학년 각도),
//    두 점을 지나는 직선의 수(중학교 1학년), 변에 직각인 선 긋기(4학년 수직),
//    대관람차 자리로 직각 찾기(모눈 없이 한 바퀴를 넷으로 나누어 생각해야 한다 — 4학년 각도. 모눈 위라면 right-join 과 같은 문제다)
//  - 긋기·그리기(작도), 까닭·다른 점·고친 문장 쓰기(서술형), 놀이·만들기, 2학년 되짚기. 다만 고르기로 바꿀 수 있는 것은 바꾸어 실었다
//    (이을 점 고르기, 나머지 꼭짓점 고르기, 까닭 고르기, 바르게 나눈 그림 고르기).
//  - 퍼즐·경우 따지기: 선분을 그어 직각삼각형 여럿으로 나누기, 같은 직사각형으로 나누기, 점 종이의 정사각형 모두 찾기, 로봇의 길, 여러 번 접어 자르기, 「~이 아닌 ~」 말 잇기
//  - 뜻 없는 셈: 여러 도형의 각·직각 수의 합과 차, 도형의 변·꼭짓점·직각의 수끼리 더하거나 비교하기, 직각삼각형 안에 적힌 수의 합, 직사각형 안의 수로 가장 큰 수 만들기, 두 그림의 조각 수 더하기
//  - 검사가 막는 그림: 오목하게 꺾인 도형·글자·칠교 모양의 직각 세기(안쪽으로 꺾인 곳과 획이 만나는 곳을 세는 기준이 자료마다 다르다)
//  - 이미 있는 유형과 묻는 틀만 다른 것: 「가장 많은 도형」과 「많은 차례」는 내용마다 하나씩만 두었다(각은 가장 많은 도형, 직각은 차례).
//    선 그림과 이름 잇기, 직각삼각형·직사각형·정사각형의 수 세기(찾기와 같다), 옳은 것과 옳지 않은 것만 바꾼 설명 가리기, 국기·칠교 모양에서 찾기(상황만 다르다)
// 그림이 필요해 미룬 꼴: 물건 그림에서 도형 모양 찾기(물건 그림), 접고 잘라 펼친 도형의 이름(접는 차례 그림)
// 도형은 모눈의 점 위에 꼭짓점을 두고, 직각처럼 보이지만 직각이 아닌 각(76°~104°)은 쓰지 않는다. 닿소리 글자 이름은 모두 받침이 있어 토씨를 과·을·은으로 적는다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, box, N, M, C } = B.kit;
  const G = B.kit.geo;
  const LINE = '4수03-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바'];
  const CIRCLED = ['①', '②', '③', '④'];
  const PAIRS = [['ㄱ', 'ㄴ'], ['ㄷ', 'ㄹ'], ['ㅁ', 'ㅂ']];
  const TRIPLES = [['ㄱ', 'ㄴ', 'ㄷ'], ['ㄴ', 'ㄷ', 'ㄹ'], ['ㄹ', 'ㅁ', 'ㅂ']];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';

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
  // 도형을 판 가운데에 놓는다.
  function centered(points, cols, rows) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    const dx = Math.floor((cols - Math.max(...xs) - Math.min(...xs)) / 2), dy = Math.floor((rows - Math.max(...ys) - Math.min(...ys)) / 2);
    return points.map((p) => [p[0] + dx, p[1] + dy]);
  }
  const far = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
  const eq = (p, q) => p[0] === q[0] && p[1] === q[1];
  const spread = (list, gap) => list.every((p, i) => list.every((q, j) => i === j || far(p, q) >= gap));
  // 점 c 가 직선 pq 에서 한 칸 넘게 떨어져 있는가(점과 이름표가 선에 붙지 않게)
  const offLine = (p, q, c) => { const k = G.cross(G.sub(q, p), G.sub(c, p)); return k * k >= G.len2(G.sub(q, p)); };
  function lattice(cols, rows) { const out = []; for (let x = 0; x <= cols; x += 1) for (let y = 0; y <= rows; y += 1) out.push([x, y]); return out; }
  const dots = (points) => points.map((p) => G.point(p)).join('');
  const numbered = (points) => points.map((p, i) => G.point(p) + G.text([p[0] + 0.45, p[1] - 0.4], CIRCLED[i], 'mb-label is-small')).join('');
  // 직각인 꼭짓점마다 직각 표시
  const marks = (points) => points.map((v, i) => (G.rightAt(points, i) ? G.rightMark(v, points[(i + points.length - 1) % points.length], points[(i + 1) % points.length]) : '')).join('');
  // 왼쪽 점 p, 오른쪽 점 q 를 지나는 선. 이름은 늘 선 아래에 적는다. kind: segment, rayL(왼쪽 점에서 시작), rayR(오른쪽 점에서 시작), line
  function lineOn(kind, p, q, names) {
    const from = kind === 'rayR' || kind === 'line' ? G.beyond(q, p, 1) : p, to = kind === 'rayL' || kind === 'line' ? G.beyond(p, q, 1) : q;
    return G.line(from, to) + G.point(p) + G.point(q) + (names ? G.text([p[0], p[1] + 0.62], names[0]) + G.text([q[0], q[1] + 0.62], names[1]) : '');
  }

  // ── 그림 감 ──────────────────────────────────────────────────
  // 각: [꼭짓점, 지나는 점, 지나는 점]
  const ANGLES = [[[0, 3], [2, 0], [3, 3]], [[0, 3], [3, 1], [3, 3]], [[1, 3], [0, 0], [4, 3]], [[2, 3], [0, 2], [4, 2]], [[0, 3], [1, 0], [4, 2]]];
  const angleFigure = (names, [V, P, Q]) => G.board(5, 4, [G.rays([V[0] + 0.5, V[1] + 0.5], [[P[0] + 0.5, P[1] + 0.5], [Q[0] + 0.5, Q[1] + 0.5]], names)], { grid: false, scale: 1.3 });
  // 볼록한 도형을 직각의 수로 나눈 것(모눈 위, 직각처럼 보이는 각 없음)
  const BY_RIGHT = {
    0: [[[0, 3], [2, 0], [4, 3]], [[1, 0], [4, 0], [3, 3], [0, 3]], [[0, 1], [2, 0], [4, 1], [2, 2]], [[1, 0], [3, 0], [4, 2], [3, 4], [1, 4], [0, 2]]],
    1: [[[0, 0], [0, 3], [4, 3]], [[1, 0], [4, 1], [0, 3]], [[0, 0], [3, 0], [0, 3]]],
    2: [[[0, 0], [2, 0], [4, 3], [0, 3]], [[0, 0], [4, 0], [4, 3], [1, 3]]],
    3: [[[0, 2], [2, 0], [4, 2], [4, 4], [0, 4]], [[0, 0], [3, 0], [4, 1], [4, 3], [0, 3]]],
    4: [[[0, 0], [4, 0], [4, 2], [0, 2]], [[0, 0], [3, 0], [3, 3], [0, 3]], [[1, 0], [4, 3], [3, 4], [0, 1]]]
  };
  const gridTile = (points) => G.board(4, 4, [G.polygon(centered(points, 4, 4))], { grid: 'lines' });
  // 모눈 없이 그리는 도형(선분의 수로 찾는다): 닫힌 도형과, 점을 차례로 이은 꺾인 선
  const CLOSED = {
    3: [[0.3, 3.4], [2, 0.6], [3.7, 3.4]], 4: [[0.3, 0.7], [3.7, 0.7], [3, 3.3], [1, 3.3]], 5: [[0.3, 1.8], [2, 0.4], [3.7, 1.8], [3, 3.6], [1, 3.6]],
    6: [[1.1, 0.4], [2.9, 0.4], [3.8, 2], [2.9, 3.6], [1.1, 3.6], [0.2, 2]], 7: [[1, 0.3], [3, 0.3], [3.8, 1.4], [3.8, 2.9], [2, 3.8], [0.2, 2.9], [0.2, 1.4]],
    8: [[1.2, 0.3], [2.8, 0.3], [3.7, 1.2], [3.7, 2.8], [2.8, 3.7], [1.2, 3.7], [0.3, 2.8], [0.3, 1.2]]
  };
  const OPEN = { 3: [[0.3, 3.2], [1.4, 0.8], [2.6, 3.2], [3.7, 0.8]], 4: [[0.2, 3.2], [1.1, 0.8], [2, 3.2], [2.9, 0.8], [3.8, 3.2]], 5: [[0.2, 3.2], [0.9, 0.8], [1.6, 3.2], [2.4, 0.8], [3.1, 3.2], [3.8, 0.8]] };
  const plain = (points) => G.polygon(points, 'mb-poly is-plain') + dots(points);
  const zigzag = (points) => G.polyline(points) + dots(points);
  const bow = () => G.line([0.3, 3], [3.7, 3]) + G.curve([3.7, 3], [0.3, 3]);                                   // 선분 하나와 굽은 선
  const sector = () => G.line([2, 3.6], [0.4, 1.5]) + G.line([2, 3.6], [3.6, 1.5]) + G.curve([3.6, 1.5], [0.4, 1.5]) + G.point([2, 3.6]);   // 선분 둘과 굽은 선
  const lens = () => G.curve([0.4, 2], [3.6, 2]) + G.curve([3.6, 2], [0.4, 2]);                                 // 굽은 선 둘
  const bare = (part) => G.board(4, 4, [part], { grid: false });
  // 종이를 세로 띠로 나누어 자른 조각. cols: [종류, 너비] — whole 그대로, split 가로로 반, diag 비스듬히 한 번, tent 한 점에서 두 번
  function cutPaper(d, cols, tall) {
    const pieces = [], cuts = []; let x = 0;
    cols.forEach(([kind, w], i) => {
      if (i > 0) cuts.push([[x, 0], [x, tall]]);
      const a = [x, 0], b = [x + w, 0], c = [x + w, tall], e = [x, tall];
      if (kind === 'whole') pieces.push([a, b, c, e]);
      else if (kind === 'split') { const m = tall / 2; pieces.push([a, b, [x + w, m], [x, m]], [[x, m], [x + w, m], c, e]); cuts.push([[x, m], [x + w, m]]); }
      else if (kind === 'diag') { if (d.bool()) { pieces.push([a, b, c], [a, c, e]); cuts.push([a, c]); } else { pieces.push([a, b, e], [b, c, e]); cuts.push([b, e]); } }
      else if (d.bool()) { const top = [x + w / 2, 0]; pieces.push([a, top, e], [top, b, c], [e, top, c]); cuts.push([e, top], [c, top]); }
      else { const top = [x + w / 2, tall]; pieces.push([a, top, e], [b, c, top], [a, b, top]); cuts.push([a, top], [b, top]); }
      x += w;
    });
    return { pieces, cuts, width: x, paper: [[0, 0], [x, 0], [x, tall], [0, tall]] };
  }
  const cutFigure = (cut, tall, more) => G.board(cut.width, tall, [G.polygon(cut.paper, 'mb-poly is-plain')].concat(cut.cuts.map(([p, q]) => G.line(p, q, 'mb-line is-cut')), more || []), { grid: 'lines', scale: cut.width >= 9 ? 1.15 : 1.3 });

  // ── 선분, 반직선, 직선 ─────────────────────────────────────────
  B.addTypes('3-1-2', 'line', [
    T('line-notseg', '선분이 아닌 것 찾기', '③4 ④3', (d) => {
      const WHY = { bent: '두 점을 이었지만 곧지 않고 꺾인 선이므로', curve: '곧은 선이 아니라 굽은 선이므로', ray: '한쪽으로 끝없이 늘인 반직선이므로', line: '양쪽으로 끝없이 늘인 직선이므로' };
      const odd = d.pick(['bent', 'curve', 'ray', 'line']), kinds = d.shuffle(['segment', 'segment', 'segment', odd]);
      const ends = d.shuffle([[[1, 1.7], [3, 0.3]], [[1, 0.3], [3, 1.7]], [[1, 1], [3, 1]]]);
      let used = 0;
      const draw = (kind) => {
        if (kind === 'segment') { used += 1; return G.straight('segment', ends[used - 1][0], ends[used - 1][1]); }
        if (kind === 'bent') return G.polyline([[0.7, 1.8], [2, 0.2], [3.3, 1.8]]) + G.point([0.7, 1.8]) + G.point([3.3, 1.8]);
        if (kind === 'curve') return G.curve([1, 1.6], [3, 0.4]);
        return G.straight(kind, [1, 1], [3, 1]);
      };
      const list = kinds.map((kind, i) => [TAGS[i], G.board(4, 2, [draw(kind)], { grid: false })]), at = kinds.indexOf(odd);
      return C('선분이 아닌 것은?', TAGS.slice(0, 4), at, {
        figure: G.tiles(list), explain: `선분은 두 점을 곧게 이은 선이다. ${TAGS[at]}는 ${WHY[odd]} 선분이 아니다.`, facts: { kindPick: { kinds, target: odd } }
      });
    }),
    T('line-pick-ray', '같은 두 점 위에 그린 선에서 반직선 고르기', '②6 ③6 ④5 심2 심6', (d) => {
      // 네 그림 모두 같은 두 점을 지난다. 시작하는 점과 늘인 쪽을 보아야 고를 수 있다.
      const [l, r] = d.pick(PAIRS), fromLeft = d.bool(), kinds = d.shuffle(['segment', 'rayL', 'rayR', 'line']), from = fromLeft ? l : r, to = fromLeft ? r : l;
      const list = kinds.map((kind, i) => [TAGS[i], G.board(4, 2, [lineOn(kind, [1, 0.8], [3, 0.8], [l, r])], { grid: false })]);
      return C(`반직선 ${from}${to}을 바르게 그린 것은?`, TAGS.slice(0, 4), kinds.indexOf(fromLeft ? 'rayL' : 'rayR'), {
        figure: G.tiles(list), explain: `반직선 ${from}${to}은 점 ${from}에서 시작하여 점 ${to}을 지나 끝없이 늘인 곧은 선이다. 점 ${from}에서 멈추고 점 ${to} 쪽으로만 늘인 것을 고른다.`,
        facts: { kindPick: { kinds, target: fromLeft ? 'rayL' : 'rayR' } }
      });
    }),
    T('line-both-names', '선의 이름이 될 수 있는 것 모두 고르기', '①5 ③7', (d) => {
      // 선분과 직선은 두 점의 차례를 바꾸어 읽어도 같다. 보기: 한 가지만 고른 것, 선분과 직선을 섞은 것, 반직선까지 넣은 것
      const [a, b] = d.pick(PAIRS), kind = d.pick(['선분', '직선']), other = kind === '선분' ? '직선' : '선분';
      const labels = [`${kind} ${a}${b}`, `${kind} ${b}${a}`, `${other} ${a}${b}`, `반직선 ${a}${b}`], flags = [true, true, false, false];
      const sets = d.shuffle([[0, 1], [0], [0, 2], [0, 1, 3]]).map((picked) => picked.map((i) => labels[i]));
      return C('그림의 선을 나타내는 이름을 모두 고른 것은?', sets.map((o) => o.join(', ')), sets.findIndex((o) => o.length === 2 && o[1] === labels[1]), {
        figure: G.board(5, 3, [lineOn(kind === '선분' ? 'segment' : 'line', [1, 1.2], [4, 1.2], [a, b])], { grid: false, scale: 1.4 }),
        explain: (kind === '선분' ? '두 점을 곧게 이은 선이므로 선분이다. ' : '양쪽으로 끝없이 늘인 곧은 선이므로 직선이다. ') + `${kind}은 두 점의 차례를 바꾸어 읽어도 같으므로 ${kind} ${a}${b} 또는 ${kind} ${b}${a}이라고 한다.`,
        facts: { sets: { labels, flags, options: sets } }
      });
    }),
    T('line-from-point', '한 점과 다른 점을 이은 선분의 수', '①8 ③13', (d) => {
      const n = d.int(4, 6), points = [[1, 2.1], [2.5, 0.5], [4.5, 0.4], [6, 2], [4, 3.6], [1.9, 3.5]].slice(0, n), names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'].slice(0, n), t = d.int(0, n - 1);
      const base = [dots(points), G.vertexLabels(points, names)];
      return N(`점 ${n}개가 있다. 점 ${names[t]}과 다른 점을 하나씩 이어 선분을 그으려고 한다. 그을 수 있는 선분은 모두 몇 개인가?`, n - 1, {
        unit: '개', figure: G.board(7, 4, base, { grid: false, scale: 1.2, label: `점 ${n}개` }),
        explain: `점 ${names[t]}과 이을 수 있는 점은 점 ${names[t]}을 뺀 ${n - 1}개이다. 두 점을 곧게 이으면 선분이 되므로 선분을 ${n - 1}개 그을 수 있다.` + G.board(7, 4, points.map((p, i) => (i === t ? '' : G.line(points[t], p))).concat(base), { grid: false, label: `점 ${n}개와 한 점에서 그은 선분 ${n - 1}개` }),
        facts: { calc: [[`${n}-1`, 0]], unseen: [1] }
      });
    }),
    T('line-about', '선 그림에 붙은 설명 가리기', '①7 ②9 ④8 심10', (d) => {
      const [a, b] = d.pick(PAIRS), isRay = d.bool(), fromLeft = d.bool(), s = fromLeft ? a : b, t = fromLeft ? b : a;
      const good = isRay ? [`점 ${s}에서 시작한다.`, `점 ${t}을 지난다.`, '한쪽으로 끝없이 늘인 곧은 선이다.'] : [`직선 ${b}${a}이라고도 한다.`, `점 ${a}과 점 ${b}을 지난다.`, '양쪽으로 끝없이 늘인 곧은 선이다.'];
      const bad = isRay ? d.pick([`반직선 ${t}${s}이라고도 한다.`, `점 ${t}에서 끝난다.`, `직선 ${s}${t}이라고도 한다.`]) : d.pick([`두 점을 이은 곧은 선이므로 선분 ${a}${b}이다.`, `점 ${a}에서 시작하여 점 ${b}에서 끝난다.`, `반직선 ${a}${b}이라고도 한다.`]);
      const list = d.shuffle(good.concat([bad]));
      return C('그림의 선에 대한 설명으로 옳지 않은 것은?', list, list.indexOf(bad), {
        figure: G.board(5, 3, [lineOn(isRay ? (fromLeft ? 'rayL' : 'rayR') : 'line', [1, 1.2], [4, 1.2], [a, b])], { grid: false, scale: 1.4 }),
        explain: isRay ? `그림은 점 ${s}에서 시작하여 점 ${t}을 지나 한쪽으로 끝없이 늘인 곧은 선이므로 반직선 ${s}${t}이다. 반직선은 시작하는 점을 먼저 읽고, 끝나는 점이 없다.` : `그림은 점 ${a}과 점 ${b}을 지나 양쪽으로 끝없이 늘인 곧은 선이므로 직선 ${a}${b} 또는 직선 ${b}${a}이다. 직선에는 시작하는 점도 끝나는 점도 없다.`,
        facts: { truth: list.map((o) => o !== bad), want: false }
      });
    }),
    T('line-sort', '여러 선을 선분·반직선·직선으로 나누어 세기', '②11 ③5 심4', (d) => {
      const [s, r, l, c] = d.until(() => [d.int(1, 3), d.int(1, 3), d.int(1, 2), d.int(0, 1)], ([x, y, z, w]) => x + y + z + w === 6 && !(x === y && y === z));
      const kinds = d.shuffle([].concat(Array(s).fill('segment'), Array(r).fill('ray'), Array(l).fill('line'), Array(c).fill('curve')));
      const ENDS = [[[1, 1.4], [3, 0.6]], [[1, 0.6], [3, 1.4]], [[1, 1], [3, 1]]];
      const draw = (kind) => { const [p, q] = d.pick(ENDS), flip = d.bool(); return kind === 'curve' ? (flip ? G.curve(p, q) : G.curve(q, p)) : kind === 'ray' ? (flip ? G.straight('ray', p, q) : G.straight('ray', q, p)) : G.straight(kind, p, q); };
      const list = kinds.map((kind, i) => [TAGS[i], G.board(4, 2, [draw(kind)], { grid: false })]), of = (kind) => TAGS.filter((_, i) => kinds[i] === kind).join(', ');
      return M('선분, 반직선, 직선은 각각 몇 개인가?', [{ label: '선분', answer: s, unit: '개' }, { label: '반직선', answer: r, unit: '개' }, { label: '직선', answer: l, unit: '개' }], {
        figure: G.tiles(list), explain: `두 점에서 멈춘 선분은 ${of('segment')}, 한쪽으로만 끝없이 늘인 반직선은 ${of('ray')}, 양쪽으로 끝없이 늘인 직선은 ${of('line')}이다.` + (c ? ' 굽은 선은 셋 중 어느 것도 아니다.' : ''),
        facts: { count: kinds.map((kind) => kind === 'segment'), calc: [[String(s), 0], [String(r), 1], [String(l), 2]] }
      });
    }),
    T('line-most', '선분이 가장 많은 것', '①11 ③12 심5', (d) => {
      // 굽은 선은 선분이 아니고, 점을 차례로 이은 꺾인 선은 점의 수보다 선분이 하나 적다.
      const [curved, open, first, second] = d.pick([[1, 5, 3, 4], [2, 3, 4, 5], [1, 4, 3, 6], [2, 5, 3, 6], [1, 3, 5, 4], [2, 5, 4, 3]]);
      const items = d.shuffle([[curved, curved === 1 ? bow() : sector()], [open, zigzag(OPEN[open])], [first, plain(CLOSED[first])], [second, plain(CLOSED[second])]]), counts = items.map(([n]) => n);
      return C('선분이 가장 많은 것은?', TAGS.slice(0, 4), counts.indexOf(Math.max(...counts)), {
        figure: G.tiles(items.map(([, part], i) => [TAGS[i], bare(part)])), explain: counts.map((n, i) => `${TAGS[i]} ${n}개`).join(', ') + '이다. 점과 점을 곧게 이은 선만 선분이고, 굽은 선은 선분이 아니다.',
        facts: { choose: { exprs: counts.map(String), rule: 'max' } }
      });
    }),
    T('line-find-name', '여러 선 가운데 반직선을 찾아 이름 쓰기', '①4 ④6 심3', (d) => {
      const names = d.shuffle(PAIRS), kinds = d.shuffle(['segment', 'ray', 'line']), fromLeft = d.bool(), at = kinds.indexOf('ray');
      const from = names[at][fromLeft ? 0 : 1], to = names[at][fromLeft ? 1 : 0], seg = names[kinds.indexOf('segment')], lin = names[kinds.indexOf('line')];
      // 줄마다 점의 자리를 조금씩 어긋나게 하고 줄 사이를 넉넉히 띄운다(이름이 어느 선의 것인지 헷갈리지 않게).
      const shifts = d.shuffle([-0.3, 0, 0.35]);
      const rows = kinds.map((kind, i) => lineOn(kind === 'ray' ? (fromLeft ? 'rayL' : 'rayR') : kind, [1.6 + shifts[i], 0.4 + i * 1.8], [4.4 + shifts[i], 0.4 + i * 1.8], names[i]));
      const list = d.shuffle([['반직선', from, to], ['반직선', to, from], ['반직선', seg[0], seg[1]], ['반직선', lin[0], lin[1]]]);
      return C('그림에서 반직선을 찾아 이름을 바르게 쓴 것은?', list.map(([kind, x, y]) => `${kind} ${x}${y}`), list.findIndex(([, x, y]) => x === from && y === to), {
        figure: G.board(6, 5, rows, { grid: false, scale: 1.3 }),
        explain: `한쪽으로만 끝없이 늘인 곧은 선은 점 ${from}에서 시작하여 점 ${to}을 지나는 선이다. 시작하는 점을 먼저 읽어 반직선 ${from}${to}이라고 한다.`,
        facts: { lineName: { kind: '반직선', from, to, options: list } }
      });
    }),
    T('line-differ', '두 가지 선의 다른 점', '③11 ④10', (d) => {
      const CONT = { 선분: '양쪽에 끝이 있고', 반직선: '한쪽으로만 끝없이 늘어나고', 직선: '양쪽으로 끝없이 늘어나고' }, END = { 선분: '양쪽에 끝이 있다', 반직선: '한쪽으로만 끝없이 늘어난다', 직선: '양쪽으로 끝없이 늘어난다' };
      const [x, y, z] = d.pick([['선분', '직선', '반직선'], ['반직선', '직선', '선분'], ['선분', '반직선', '직선']]);
      const say = (px, py) => `${x}은 ${CONT[px]}, ${y}은 ${END[py]}.`;
      const rows = d.shuffle([[say(x, y), true], [say(y, x), false], [say(z, y), false], [`${x}은 곧은 선이고, ${y}은 굽은 선이다.`, false]]);
      return C(`${x}과 ${y}의 다른 점을 바르게 설명한 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: '선분은 두 점을 곧게 이은 선이라 양쪽에 끝이 있다. 반직선은 한 점에서 시작하여 한쪽으로만, 직선은 양쪽으로 끝없이 늘인 곧은 선이다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('line-only', '선분으로만 이루어진 도형', '①12', (d) => {
      const kinds = d.shuffle(['polygon', 'bow', 'sector', 'lens']), n = d.pick([3, 4, 5]);
      const part = { polygon: () => plain(CLOSED[n]), bow, sector, lens };
      return C('선분으로만 이루어진 도형은?', TAGS.slice(0, 4), kinds.indexOf('polygon'), {
        figure: G.tiles(kinds.map((kind, i) => [TAGS[i], bare(part[kind]())])), explain: `${TAGS[kinds.indexOf('polygon')]}는 선분 ${n}개로 둘러싸여 있다. 나머지 도형에는 굽은 선이 있다.`,
        facts: { kindPick: { kinds, target: 'polygon' } }
      });
    })
  ]);

  // ── 각과 직각 ──────────────────────────────────────────────────
  B.addTypes('3-1-2', 'angle', [
    T('angle-sides', '각의 이름에서 꼭짓점과 변 찾기', '②15 ③21 ③23 ④14 심14', (d) => {
      // 그림 없이 이름만 보고 가린다. 보기: 처음 글자를 꼭짓점으로 여긴 것, 끝 글자를 꼭짓점으로 여긴 것, 꼭짓점은 맞지만 변을 다른 점에서 그은 것
      const [p, v, q] = d.shuffle(d.pick(TRIPLES));
      const rows = d.shuffle([[`꼭짓점은 점 ${v}, 변은 변 ${v}${p}과 변 ${v}${q}`, true], [`꼭짓점은 점 ${p}, 변은 변 ${p}${v}과 변 ${p}${q}`, false], [`꼭짓점은 점 ${q}, 변은 변 ${q}${p}과 변 ${q}${v}`, false], [`꼭짓점은 점 ${v}, 변은 변 ${p}${v}과 변 ${p}${q}`, false]]);
      return C(`각 ${p}${v}${q}의 꼭짓점과 변을 바르게 나타낸 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: `각 ${p}${v}${q}에서 가운데에 읽는 점 ${v}이 꼭짓점이다. 변은 점 ${v}에서 시작하는 변 ${v}${p}과 변 ${v}${q}이다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('angle-misread', '각을 잘못 읽은 것 찾기', '②16 ④16 심15', (d) => {
      // 한 각은 두 가지로 읽을 수 있다. 꼭짓점이 가운데에 오지 않은 것만 틀리다.
      const [v, p, q] = d.shuffle(d.pick(TRIPLES)), list = d.shuffle([[p, v, q], [q, v, p], d.pick([[v, p, q], [p, q, v]])]);
      return C('각을 잘못 읽은 것은?', list.map((o) => '각 ' + o.join('')), list.findIndex((o) => o[1] !== v), {
        figure: angleFigure([v, p, q], d.pick(ANGLES)), explain: `각의 꼭짓점인 점 ${v}이 가운데에 오도록 읽는다. 각 ${p}${v}${q}이라고 읽어도 되고 각 ${q}${v}${p}이라고 읽어도 된다.`,
        facts: { truth: list.map((o) => o[1] === v), want: false }
      });
    }),
    T('angle-count', '도형 하나의 각의 수', '①18 ②19 ③18 ④18 심20', (d) => {
      const n = d.pick([5, 6, 7, 8]), points = CLOSED[n];
      return N('도형에서 각은 모두 몇 개인가?', n, {
        unit: '개', figure: G.board(4, 4, [G.polygon(points)], { grid: false, scale: 1.3 }), explain: `두 변이 만나는 꼭짓점마다 각이 하나씩 있다. 각은 모두 ${n}개이다.`, facts: { segments: { points, closed: true } }
      });
    }),
    T('angle-part-word', '각의 부분의 이름', '②14 ③22 ④13', (d) => {
      const [p, v, q] = d.pick(TRIPLES), side = d.bool(), want = side ? '변' : '꼭짓점', list = d.shuffle(['변', '꼭짓점', '직각', '선분']);
      return C(side ? `각 ${p}${v}${q}에서 반직선 ${v}${p}과 반직선 ${v}${q}을 각의 무엇이라고 하는가?` : `각 ${p}${v}${q}에서 두 반직선이 시작하는 점 ${v}을 각의 무엇이라고 하는가?`, list, list.indexOf(want), {
        figure: angleFigure([v, p, q], d.pick(ANGLES)), explain: `각을 이루는 두 반직선 ${v}${p}, ${v}${q}을 각의 변이라 하고, 두 반직선이 시작하는 점 ${v}을 각의 꼭짓점이라고 한다.`, facts: { truth: list.map((word) => word === want), want: true }
      });
    }),
    T('angle-parts-count', '각의 변과 꼭짓점의 수', '①33 ③22', () => M('각 하나에서 변과 꼭짓점은 각각 몇 개인가?', [{ label: '변', answer: 2, unit: '개' }, { label: '꼭짓점', answer: 1, unit: '개' }], {
      explain: '각은 한 점에서 그은 두 반직선으로 이루어진 도형이다. 두 반직선이 변이므로 변은 2개이고, 두 반직선이 시작하는 점이 꼭짓점이므로 꼭짓점은 1개이다.', facts: { calc: [['2', 0], ['1', 1]], unseen: [2, 1] }
    })),
    T('angle-has', '각이 있는 도형 찾기', '①14 ③16 심17', (d) => {
      // 곧은 선끼리 만나는 곳에만 각이 있다. 굽은 선과 선분이 만나는 곳, 굽은 선끼리 만나는 곳은 각이 아니다.
      const some = d.int(2, 3), polys = d.shuffle([3, 4, 5, 6]).slice(0, some).map((n) => ['polygon', plain(CLOSED[n])]), rest = d.shuffle([['bow', bow()], ['lens', lens()]]).slice(0, 4 - some);
      const items = d.shuffle(polys.concat(rest)), flags = items.map(([kind]) => kind === 'polygon'), made = setOptions(d, TAGS.slice(0, 4), flags);
      return C('각이 있는 도형을 모두 고른 것은?', made.options, made.answer, {
        figure: G.tiles(items.map(([, part], i) => [TAGS[i], bare(part)])), explain: `각은 한 점에서 그은 두 반직선으로 이루어진 도형이다. 선분으로만 둘러싸인 ${TAGS.filter((_, i) => flags[i]).join(', ')}에는 각이 있고, 굽은 선이 만나는 곳은 각이 아니다.`,
        facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets } }
      });
    }),
    T('angle-define', '각의 뜻', '②54 ④1 심18', (d) => {
      const list = d.shuffle(['반직선', '선분', '직선', '굽은 선']);
      return C('□ 안에 알맞은 말은?', list, list.indexOf('반직선'), {
        figure: conditions([`한 점에서 그은 두 ${box()}으로 이루어진 도형을 각이라고 한다.`]), explain: '한 점에서 그은 두 반직선으로 이루어진 도형을 각이라고 한다.', facts: { truth: list.map((word) => word === '반직선'), want: true }
      });
    }),
    T('angle-why-not', '각이 아닌 까닭', '①21 ②57 ③17 ④57 심18', (d) => {
      // 그림마다 까닭이 다르다: 굽은 선이 있는 그림, 두 선이 한 점에서 만나지 않는 그림
      const curved = d.bool();
      const rows = d.shuffle([['곧은 선끼리 만난 것이 아니라 굽은 선이 있기 때문이다.', curved], ['두 곧은 선이 한 점에서 만나지 않기 때문이다.', !curved], ['두 선의 길이가 서로 다르기 때문이다.', false], ['선이 2개뿐이기 때문이다.', false]]);
      const part = curved ? G.line([0.3, 2.7], [3.7, 2.7]) + G.curve([3, 0.4], [0.3, 2.7]) : G.line([0.3, 2.7], [3.2, 2.7]) + G.line([1.2, 0.3], [3.8, 1.9]);
      return C('그림의 도형이 각이 아닌 까닭은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: G.board(4, 3, [part], { grid: false, scale: 1.3 }), explain: '각은 한 점에서 그은 두 반직선으로 이루어진 도형이다. ' + (curved ? '그림에는 굽은 선이 있으므로 각이 아니다.' : '그림의 두 선은 한 점에서 만나지 않으므로 각이 아니다.'),
        facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('right-define', '직각의 뜻', '②54 ③29 ④1 심27', (d) => {
      const list = d.shuffle(['직각', '꼭짓점', '반직선', '직각삼각형']);
      return C('종이를 반듯하게 두 번 접었을 때 생기는 각을 무엇이라고 하는가?', list, list.indexOf('직각'), {
        explain: '종이를 반듯하게 두 번 접었을 때 생기는 각을 직각이라고 한다. 삼각자의 직각 부분과 꼭 맞게 겹친다.', facts: { truth: list.map((word) => word === '직각'), want: true }
      });
    }),
    T('right-has', '직각이 있는 도형 찾기', '①25 ②23 ③34 심31', (d) => {
      const some = d.int(1, 3), yes = d.shuffle([].concat(BY_RIGHT[1], BY_RIGHT[2], BY_RIGHT[3], BY_RIGHT[4])).slice(0, some), no = d.shuffle(BY_RIGHT[0]).slice(0, 4 - some);
      const picks = d.shuffle(yes.concat(no)), flags = picks.map((points) => G.rightAngles(points) > 0), made = setOptions(d, TAGS.slice(0, 4), flags);
      return C('직각이 있는 도형을 모두 고른 것은?', made.options, made.answer, {
        figure: G.tiles(picks.map((points, i) => [TAGS[i], gridTile(points)])), explain: '직각의 수는 ' + picks.map((points, i) => `${TAGS[i]} ${G.rightAngles(points)}개`).join(', ') + '이다.',
        facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets } }
      });
    }),
    T('right-order', '직각이 많은 도형부터 차례대로', '①25 ②23 ③35 ④26 심31', (d) => {
      const counts = d.shuffle([1, 2, 3, 4]).slice(0, 3), picks = counts.map((n) => d.pick(BY_RIGHT[n])), right = [0, 1, 2].sort((x, y) => counts[y] - counts[x]);
      const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('직각이 많은 도형부터 차례대로 나열한 것은?', list.map((o) => o.map((i) => TAGS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: G.tiles(picks.map((points, i) => [TAGS[i], gridTile(points)])), explain: '직각의 수는 ' + counts.map((n, i) => `${TAGS[i]} ${n}개`).join(', ') + '이다.',
        facts: { choose: { exprs: counts.map(String), rule: 'descending', orders: list } }
      });
    }),
    T('right-in-tri', '삼각형의 세 각 가운데 직각', '①22', (d) => {
      const names = d.shuffle(['ㄱ', 'ㄴ', 'ㄷ']), points = centered(d.pick(BY_RIGHT[1]), 6, 5), order = d.shuffle([0, 1, 2]);
      const read = (i) => `각 ${names[(i + 2) % 3]}${names[i]}${names[(i + 1) % 3]}`, at = order.findIndex((i) => G.rightAt(points, i));
      const base = [G.polygon(points), G.vertexLabels(points, names)];
      return C(`삼각형 ${names.join('')}에서 직각인 각은?`, order.map(read), at, {
        figure: G.board(6, 5, base, { grid: 'lines', scale: 1.3 }), explain: `삼각자의 직각 부분을 대었을 때 꼭 맞게 겹치는 각은 점 ${names[order[at]]}을 꼭짓점으로 하는 ${read(order[at])}이다.` + G.board(6, 5, base.concat([marks(points)]), { grid: 'lines' }),
        facts: { anglePick: order.map((i) => [points[i], points[(i + 2) % 3], points[(i + 1) % 3]]) }
      });
    }),
    T('right-clock-text', '시계 그림 없이 직각인 시각 고르기', '①30 ②28 ③40 ④30 심35', (d) => {
      const hours = d.shuffle([d.pick([3, 9])].concat(d.shuffle([1, 2, 4, 5, 6, 7, 8, 10, 11, 12]).slice(0, 3))), at = hours.findIndex((h) => h === 3 || h === 9);
      return C('시계의 긴바늘이 12를 가리킬 때, 긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 직각인 시각은?', hours.map((h) => h + '시'), at, {
        explain: `긴바늘이 12를 가리킬 때 짧은바늘이 3 또는 9를 가리키면 두 바늘이 직각을 이룬다. 보기 중에서는 ${hours[at]}시이다.`, facts: { clocks: hours }
      });
    }),
    T('right-join', '직각이 되게 이을 점', '①29 ②25 ③75 ④29 심34', (d) => {
      // 선분 ㄱㄴ과 점 넷. 점 ㄱ과 이어 직각이 되는 점은 하나뿐이다.
      const [a, b] = d.pick([[[2, 4], [5, 4]], [[1, 4], [4, 4]], [[2, 4], [5, 3]], [[2, 4], [4, 2]], [[3, 4], [6, 3]]]), all = lattice(6, 3);
      const fits = (c) => !eq(c, b) && far(c, a) >= 2 && far(c, b) >= 2 && offLine(a, b, c);
      const right = d.pick(all.filter((c) => fits(c) && G.isRight(a, b, c)));
      const others = d.until(() => d.shuffle(all).slice(0, 3), (list) => list.every((c) => fits(c) && !G.isRight(a, b, c) && !G.nearRight(a, b, c)) && spread(list.concat([right]), 2));
      const points = d.shuffle(others.concat([right])), at = points.indexOf(right);
      const base = [G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.1, a[1] + 0.6], 'ㄱ'), G.text([b[0] + 0.1, b[1] + 0.6], 'ㄴ'), numbered(points)];
      return C('점 ㄱ을 꼭짓점으로 하고 선분 ㄱㄴ을 한 변으로 하는 직각을 그리려고 한다. 점 ㄱ과 이어야 할 점은?', CIRCLED, at, {
        figure: G.board(6, 5, base, { grid: 'dots', scale: 1.4 }), explain: `점 ㄱ과 ${CIRCLED[at]}번 점을 이은 선분은 선분 ㄱㄴ과 직각을 이룬다.` + G.board(6, 5, [G.line(a, right), G.rightMark(a, b, right)].concat(base), { grid: 'dots' }),
        facts: { anglePick: points.map((c) => [a, b, c]) }
      });
    }),
    T('right-setsquare', '삼각자를 바르게 놓은 그림', '③31', (d) => {
      // 직각 부분을 점에 맞추고 한 변을 선에 맞추어야 한다. 뾰족한 부분을 댄 것, 직각 부분은 댔지만 변을 선에 맞추지 않은 것을 섞는다.
      const flip = d.bool(), X = (x) => (flip ? 5 - x : x), P = [X(1.5), 3.1], kinds = d.shuffle(['good', 'acute', 'tilted']);
      const SHAPE = { good: [[1.5, 3.1], [3.6, 3.1], [1.5, 0.5]], acute: [[1.5, 3.1], [4.4, 3.1], [4.4, 1.3]], tilted: [[1.5, 3.1], [3.9, 1.9], [0.5, 1.1]] };
      const draw = (kind) => G.board(5, 4, [G.polygon(SHAPE[kind].map(([x, y]) => [X(x), y])), G.line([0.3, 3.1], [4.7, 3.1]), G.point(P), G.text([P[0], P[1] + 0.55], 'ㄱ')], { grid: false });
      return C('곧은 선 위의 점 ㄱ을 꼭짓점으로 하고 이 선을 한 변으로 하는 직각을 그리려고 한다. 색칠한 삼각형이 삼각자일 때, 삼각자를 바르게 놓은 것은?', TAGS.slice(0, 3), kinds.indexOf('good'), {
        figure: G.tiles(kinds.map((kind, i) => [TAGS[i], draw(kind)])), explain: '삼각자의 직각 부분을 점 ㄱ에 맞추고, 직각을 이루는 한 변을 곧은 선에 맞추어 놓는다. 그런 다음 삼각자의 다른 한 변을 따라 선을 긋는다.',
        facts: { truth: kinds.map((kind) => kind === 'good'), want: true }
      });
    }),
    T('right-clock-times', '직각을 이루는 시각이 몇 번인지 세기', '심37', (d) => {
      const [lo, hi] = d.pick([[1, 12], [2, 10], [1, 8], [4, 12], [2, 7], [5, 11]]), hours = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i), hits = hours.filter((h) => h === 3 || h === 9);
      return N(`${lo}시부터 ${hi}시까지 시계의 긴바늘이 12를 가리킬 때마다 두 바늘을 살펴보았다. 긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 직각인 때는 모두 몇 번인가?`, hits.length, {
        unit: '번', explain: `긴바늘이 12를 가리킬 때 두 바늘이 직각을 이루는 시각은 3시와 9시뿐이다. ${lo}시부터 ${hi}시까지에는 ${hits.length === 2 ? '3시와 9시가 모두 들어 있으므로 2번이다' : `${hits[0]}시만 들어 있으므로 1번이다`}.`,
        facts: { count: hours.map((h) => h === 3 || h === 9) }
      });
    }),
    T('right-things', '직각을 찾을 수 있는 물건', '①32 ②3 ③39 ④23', (d) => {
      const thing = d.pick(['공책', '칠판', '색종이', '수학책']), list = d.shuffle([thing].concat(d.shuffle(['동전', '훌라후프', '축구공', '둥근 접시', '탬버린']).slice(0, 3)));
      return C('직각을 찾을 수 있는 물건은?', list, list.indexOf(thing), {
        explain: `${thing}의 네 귀퉁이는 삼각자의 직각 부분과 꼭 맞게 겹친다. 나머지는 둥근 모양이어서 직각이 없다.`, facts: { truth: list.map((word) => word === thing), want: true }
      });
    })
  ]);

  // ── 직각삼각형 ─────────────────────────────────────────────────
  B.addTypes('3-1-2', 'rtri', [
    T('rtri-move', '꼭짓점을 옮겨 직각삼각형 만들기', '①48 ②33 ③46 ④38 심47', (d) => {
      // 직각삼각형이 아닌 삼각형 ㄱㄴㄷ과 점 넷. 꼭짓점 ㄱ을 옮겨 직각삼각형이 되는 점은 하나뿐이다.
      const [b, c] = d.pick([[[1, 4], [5, 4]], [[1, 4], [4, 4]], [[2, 4], [5, 4]]]), all = lattice(6, 3);
      const top = d.pick(all.filter((p) => p[1] >= 1 && p[1] <= 2 && p[0] > b[0] && p[0] < c[0] && !G.isRightTriangle([b, c, p]) && !G.looksRight([b, c, p])));
      const fits = (p) => far(p, top) >= 2 && offLine(b, top, p) && offLine(c, top, p);
      const right = d.pick(all.filter((p) => fits(p) && G.isRightTriangle([b, c, p])));
      const others = d.until(() => d.shuffle(all).slice(0, 3), (list) => list.every((p) => fits(p) && !G.isRightTriangle([b, c, p]) && !G.looksRight([b, c, p])) && spread(list.concat([right]), 2));
      const points = d.shuffle(others.concat([right])), at = points.indexOf(right);
      const names = [G.text([b[0] - 0.1, b[1] + 0.6], 'ㄴ'), G.text([c[0] + 0.1, c[1] + 0.6], 'ㄷ')], spots = numbered(points);
      return C('삼각형 ㄱㄴㄷ의 꼭짓점 ㄱ을 한 점으로 옮겨 직각삼각형을 만들려고 한다. 옮겨야 할 점은?', CIRCLED, at, {
        figure: G.board(6, 5, [G.polygon([top, b, c], 'mb-poly is-plain'), G.text([top[0] - 0.45, top[1] - 0.35], 'ㄱ')].concat(names, [spots]), { grid: 'dots', scale: 1.4 }),
        explain: `꼭짓점 ㄱ을 ${CIRCLED[at]}번 점으로 옮기면 한 각이 직각인 삼각형이 된다.` + G.board(6, 5, [G.polygon([right, b, c]), marks([right, b, c])].concat(names, [spots]), { grid: 'dots' }),
        facts: { triPoint: { a: b, b: c, candidates: points } }
      });
    }),
    T('rtri-true', '직각삼각형에 대한 설명', '②31 ③44 ④46 심44', (d) => {
      // 맞는 말과 같은 것(변의 수, 꼭짓점의 수 …)을 두고 맞서는 틀린 말은 함께 넣지 않는다(둘 중 하나 고르기가 되지 않게).
      const [good, about] = d.pick([['한 각이 직각인 삼각형이다.', 'right'], ['변이 3개이다.', 'side'], ['꼭짓점이 3개이다.', 'vertex'], ['선분 3개로 둘러싸인 도형이다.', 'side']]);
      const bad = d.shuffle([[d.pick(['세 각이 모두 직각이다.', '직각이 3개이다.']), 'right'], ['각이 1개뿐이다.', 'angle'], ['꼭짓점이 2개이다.', 'vertex'], ['세 변의 길이가 항상 모두 같다.', 'length'], ['변이 4개이다.', 'side']].filter(([, kind]) => kind !== about)).slice(0, 3).map(([text]) => text);
      const list = d.shuffle([good].concat(bad));
      return C('직각삼각형에 대한 설명으로 옳은 것은?', list, list.indexOf(good), {
        explain: '직각삼각형은 한 각이 직각인 삼각형이다. 변, 꼭짓점, 각이 3개씩이고 그중 직각은 1개이다.', facts: { truth: list.map((o) => o === good), want: true }
      });
    }),
    T('rtri-cut', '점선을 따라 자른 조각 가운데 직각삼각형', '①44 ②32 ③73 ④51 심50', (d) => {
      // 직각이 없는 삼각형 조각과 사각형 조각이 섞여 있다.
      const cols = d.until(() => d.shuffle([['whole', d.pick([2, 3])], ['diag', d.pick([2, 3, 4])], d.pick([['tent', 4], ['tent', 4], ['diag', 3], ['split', 2], ['split', 3]])]), (list) => list.reduce((sum, col) => sum + col[1], 0) <= 9);
      const cut = cutPaper(d, cols, 4), flags = cut.pieces.map((piece) => G.isRightTriangle(piece)), n = flags.filter(Boolean).length, plainTri = cut.pieces.some((piece) => piece.length === 3 && !G.isRightTriangle(piece));
      return N('직사각형 모양의 종이를 점선을 따라 모두 잘랐다. 잘린 조각 중에서 직각삼각형은 모두 몇 개인가?', n, {
        unit: '개', figure: cutFigure(cut, 4),
        explain: `점선을 따라 자르면 조각이 ${cut.pieces.length}개 생긴다. 그중 한 각이 직각인 삼각형은 ${n}개이다.` + (plainTri ? ' 직각이 없는 삼각형은 직각삼각형이 아니다.' : '') + cutFigure(cut, 4, cut.pieces.filter((_, i) => flags[i]).map(marks)),
        facts: { count: flags }
      });
    })
  ]);

  // ── 직사각형과 정사각형 ─────────────────────────────────────────
  B.addTypes('3-1-2', 'quad', [
    T('quad-blank', '직사각형의 뜻', '①33 ②54 ④1', (d) => {
      const list = d.shuffle(['한', '두', '세', '네']);
      return C('□ 안에 알맞은 말은?', list, list.indexOf('네'), {
        figure: conditions([`직사각형은 ${box()} 각이 모두 직각인 사각형이다.`]), explain: '네 각이 모두 직각인 사각형을 직사각형이라고 한다.', facts: { truth: list.map((word) => word === '네'), want: true }
      });
    }),
    T('quad-fourth', '두 변이 그려진 직사각형의 나머지 꼭짓점', '②40 ③75 ③76 ④55', (d) => {
      // 직각으로 만나는 두 선분 ㄱㄴ, ㄴㄷ과 점 넷. 직사각형이 되는 점은 하나뿐이다.
      const { corner, u, v } = d.pick([{ corner: [1, 4], u: [0, -3], v: [4, 0] }, { corner: [1, 4], u: [0, -2], v: [5, 0] }, { corner: [2, 4], u: [-1, -2], v: [4, -2] }, { corner: [2, 4], u: [-1, -1], v: [3, -3] }]);
      const a = [corner[0] + u[0], corner[1] + u[1]], c = [corner[0] + v[0], corner[1] + v[1]], right = [a[0] + v[0], a[1] + v[1]], around = lattice(7, 5).filter((p) => far(p, right) <= 4);
      const fits = (p) => far(p, right) >= 2 && far(p, a) >= 2 && far(p, c) >= 2 && offLine(corner, a, p) && offLine(corner, c, p);
      const others = d.until(() => d.shuffle(around).slice(0, 3), (list) => list.every(fits) && spread(list, 2));
      const points = d.shuffle(others.concat([right])), at = points.indexOf(right);
      const base = [G.line(a, corner), G.line(corner, c), dots([a, corner, c]), G.vertexLabels([a, corner, c], ['ㄱ', 'ㄴ', 'ㄷ']), numbered(points)];
      return C('선분 ㄱㄴ과 선분 ㄴㄷ을 두 변으로 하는 직사각형을 그리려고 한다. 나머지 한 꼭짓점이 될 점은?', CIRCLED, at, {
        figure: G.board(7, 5, base, { grid: 'dots', scale: 1.4 }), explain: `${CIRCLED[at]}번 점을 점 ㄱ, 점 ㄷ과 이으면 네 각이 모두 직각인 사각형이 된다.` + G.board(7, 5, [G.polygon([a, corner, c, right])].concat(base), { grid: 'dots' }),
        facts: { rectMove: { fixed: [corner, a, c], candidates: points } }
      });
    }),
    T('quad-grid-side', '모눈의 칸 수로 정하는 직사각형의 변', '②41', (d) => {
      const s = d.int(2, 4), k = d.int(2, 3), p = [1, 2], q = [1 + s, 2];
      return N(`모눈종이에 그은 선분을 짧은 변으로 하는 직사각형을 그리려고 한다. 긴 변을 짧은 변보다 모눈 ${k}칸만큼 더 길게 그릴 때, 긴 변은 모눈 몇 칸인가?`, s + k, {
        unit: '칸', figure: G.board(6, 3, [G.line(p, q), G.point(p), G.point(q)], { grid: 'lines', scale: 1.3, label: `모눈종이에 그은 길이가 모눈 ${s}칸인 선분` }),
        explain: `그은 선분의 길이는 모눈 ${s}칸이다. 긴 변은 이보다 ${k}칸만큼 더 긴 ${s + k}칸이다.`, facts: { calc: [[`${s}+${k}`, 0]] }
      });
    }),
    T('square-split', '선분 하나로 정사각형 2개 만들기', '②51 ③64', (d) => {
      // 가로 4칸, 세로 2칸인 직사각형: 가운데를 나누어야 정사각형 둘이 된다.
      const turn = d.bool(), at = ([x, y]) => (turn ? [y, x] : [x, y]), box4 = [[0, 1], [4, 1], [4, 3], [0, 3]];
      const WAYS = {
        half: { cut: [[2, 1], [2, 3]], pieces: [[[0, 1], [2, 1], [2, 3], [0, 3]], [[2, 1], [4, 1], [4, 3], [2, 3]]] },
        long: { cut: [[0, 2], [4, 2]], pieces: [[[0, 1], [4, 1], [4, 2], [0, 2]], [[0, 2], [4, 2], [4, 3], [0, 3]]] },
        side: { cut: [[1, 1], [1, 3]], pieces: [[[0, 1], [1, 1], [1, 3], [0, 3]], [[1, 1], [4, 1], [4, 3], [1, 3]]] },
        slant: { cut: [[0, 1], [4, 3]], pieces: [[[0, 1], [4, 1], [4, 3]], [[0, 1], [4, 3], [0, 3]]] }
      };
      const kinds = d.shuffle(['half', 'long', 'side', 'slant']), flags = kinds.map((kind) => WAYS[kind].pieces.every((piece) => G.isSquare(piece.map(at))));
      const draw = (kind) => G.board(4, 4, [G.polygon(box4.map(at), 'mb-poly is-plain'), G.line(at(WAYS[kind].cut[0]), at(WAYS[kind].cut[1]))], { grid: 'lines' });
      return C('직사각형에 선분 하나를 그어 정사각형 2개로 나눈 것은?', TAGS.slice(0, 4), flags.indexOf(true), {
        figure: G.tiles(kinds.map((kind, i) => [TAGS[i], draw(kind)])), explain: `${TAGS[flags.indexOf(true)]}는 나누어진 두 사각형이 모두 네 각이 직각이고 네 변의 길이가 모눈 2칸으로 같다.`,
        facts: { truth: flags, want: true }
      });
    }),
    T('square-point', '한 변이 그려진 정사각형의 꼭짓점', '②50 ③76 ④55', (d) => {
      // 직각이면서 길이도 같아야 한다. 보기: 직각이지만 길이가 다른 점, 길이는 비슷하지만 직각이 아닌 점
      const s = d.int(2, 3), a = [d.int(1, 2), 4], b = [a[0] + s, 4], right = [a[0], 4 - s], off = [a[0], d.bool() ? 3 - s : 5 - s], slant = [a[0] + d.pick([-1, 1]), 4 - s];
      const good = (p) => G.isRight(a, b, p) && G.len2(G.sub(p, a)) === G.len2(G.sub(b, a));
      const last = d.pick(lattice(6, 3).filter((p) => !G.isRight(a, b, p) && p[0] > b[0] && [right, off, slant, a, b].every((q) => far(p, q) >= 2)));
      const points = d.shuffle([right, off, slant, last]), flags = points.map(good), at = flags.indexOf(true);
      const base = [G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.1, 4.6], 'ㄱ'), G.text([b[0] + 0.1, 4.6], 'ㄴ'), numbered(points)];
      return C('선분 ㄱㄴ을 한 변으로 하는 정사각형을 그리려고 한다. 점 ㄱ과 이었을 때 정사각형의 또 다른 한 변이 되는 점은?', CIRCLED, at, {
        figure: G.board(6, 5, base, { grid: 'dots', scale: 1.4 }),
        explain: `정사각형은 네 각이 모두 직각이고 네 변의 길이가 모두 같다. 선분 ㄱㄴ의 길이가 ${s}칸이므로, 점 ㄱ에서 선분 ㄱㄴ과 직각을 이루며 ${s}칸만큼 떨어진 ${CIRCLED[at]}번 점과 잇는다.` + G.board(6, 5, [G.polygon([a, b, [b[0], 4 - s], right])].concat(base), { grid: 'dots' }),
        facts: { truth: flags, want: true }
      });
    }),
    T('square-true', '정사각형에 대한 설명', '②39 ④46 심44', (d) => {
      // 틀린 말과 맞서는 맞는 말(직각의 수, 변의 길이)은 함께 넣지 않는다(둘 중 하나 고르기가 되지 않게).
      const [bad, against] = d.pick([['직각이 1개뿐이다.', '네 각이 모두 직각이다.'], ['직각이 2개뿐이다.', '네 각이 모두 직각이다.'], ['네 변의 길이가 모두 다르다.', '네 변의 길이가 모두 같다.'], ['굽은 선으로 둘러싸인 도형이다.', '']]);
      const good = d.shuffle(['네 각이 모두 직각이다.', '네 변의 길이가 모두 같다.', '변이 4개이다.', '꼭짓점이 4개이다.'].filter((text) => text !== against)).slice(0, 3);
      const list = d.shuffle(good.concat([bad]));
      return C('정사각형에 대한 설명으로 옳지 않은 것은?', list, list.indexOf(bad), {
        explain: '정사각형은 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형이다.', facts: { truth: list.map((o) => o !== bad), want: false }
      });
    }),
    T('quad-common', '직사각형과 정사각형의 같은 점이 아닌 것', '①39 ③68 ④54 심59', (d) => {
      const same = d.shuffle(['네 각이 모두 직각이다.', '변이 4개이다.', '꼭짓점이 4개이다.', '선분으로 둘러싸인 도형이다.']).slice(0, 3), only = '네 변의 길이가 모두 같다.';
      const list = d.shuffle(same.concat([only]));
      return C('직사각형과 정사각형의 같은 점이 아닌 것은?', list, list.indexOf(only), {
        explain: '직사각형과 정사각형은 모두 변과 꼭짓점이 4개씩이고 네 각이 모두 직각이다. 네 변의 길이가 모두 같은 것은 정사각형이다.', facts: { truth: list.map((o) => o !== only), want: false }
      });
    }),
    T('square-counts', '정사각형의 꼭짓점·직각·길이가 같은 변의 수', '①35', () => M('정사각형에서 꼭짓점, 직각, 길이가 같은 변은 각각 몇 개인가?', [{ label: '꼭짓점', answer: 4, unit: '개' }, { label: '직각', answer: 4, unit: '개' }, { label: '길이가 같은 변', answer: 4, unit: '개' }], {
      explain: '정사각형은 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형이다. 꼭짓점, 직각, 길이가 같은 변이 모두 4개씩이다.', facts: { shapeCounts: '정사각형' }
    })),
    T('square-sides', '정사각형의 변의 길이', '①55 ②46 ③57 ④47 심72', (d) => {
      const a = d.int(4, 15), sq = [[2.4, 0.7], [5.4, 0.7], [5.4, 3.7], [2.4, 3.7]];
      return N('정사각형에서 ㉠에 알맞은 수는?', a, {
        figure: G.board(8, 4, [G.polygon(sq), G.text([3.9, 0.2], a + ' cm', 'mb-label is-length'), G.text([6.3, 2.2], LABELS[0] + ' cm', 'mb-label is-length')], { grid: false, scale: 1.2, label: `한 변의 길이가 ${a} cm인 정사각형` }),
        explain: `정사각형은 네 변의 길이가 모두 같으므로 ㉠에 알맞은 수는 ${a}이다.`, facts: { calc: [[String(a), 0]] }
      });
    }),
    T('quad-why-not', '직사각형이 아닌 까닭', '①41 ②57 ③71 ④57 심58', (d) => {
      // 「네 변의 길이가 같지 않아서」는 직사각형과 정사각형의 뜻을 섞어 아는 아이가 고른다.
      const points = d.pick([BY_RIGHT[2][0], BY_RIGHT[2][1], BY_RIGHT[0][1]]);
      const rows = d.shuffle([['네 각이 모두 직각은 아니기 때문이다.', true], ['네 변의 길이가 모두 같지는 않기 때문이다.', false], ['변이 4개이기 때문이다.', false], ['선분으로 둘러싸인 도형이기 때문이다.', false]]);
      return C('그림의 사각형이 직사각형이 아닌 까닭은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: G.board(4, 4, [G.polygon(centered(points, 4, 4), 'mb-poly is-plain')], { grid: 'lines', scale: 1.3 }),
        explain: `직사각형은 네 각이 모두 직각인 사각형이다. 그림의 사각형${G.rightAngles(points) ? `은 직각이 ${G.rightAngles(points)}개뿐이다` : '에는 직각이 없다'}. 네 변의 길이는 같지 않아도 된다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('square-why-not', '정사각형이 아닌 까닭', '①41 ②52 ③71 ④57 심58', (d) => {
      // 그림마다 어긋난 조건이 다르다: 네 각은 직각인데 변의 길이가 다른 것, 네 변의 길이는 같은데 직각이 아닌 것
      const long = d.bool(), points = long ? d.pick([[[0, 0], [4, 0], [4, 2], [0, 2]], [[0, 0], [2, 0], [2, 4], [0, 4]], [[0, 0], [3, 0], [3, 2], [0, 2]]]) : d.pick([[[0, 1], [2, 0], [4, 1], [2, 2]], [[1, 0], [2, 2], [1, 4], [0, 2]]]);
      const rows = d.shuffle([['네 각은 모두 직각이지만 네 변의 길이가 모두 같지는 않기 때문이다.', long], ['네 변의 길이는 모두 같지만 네 각이 모두 직각은 아니기 때문이다.', !long], ['변이 4개이기 때문이다.', false], ['꼭짓점이 4개이기 때문이다.', false]]);
      return C('그림의 사각형이 정사각형이 아닌 까닭은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: G.board(4, 4, [G.polygon(centered(points, 4, 4), 'mb-poly is-plain')], { grid: 'lines', scale: 1.3 }),
        explain: '정사각형은 네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형이다. ' + (long ? '그림의 사각형은 네 각이 모두 직각이지만 이웃한 두 변의 길이가 다르다.' : '그림의 사각형은 네 변의 길이가 모두 같지만 직각인 각이 없다.'),
        facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('square-cut', '점선을 따라 자른 조각 가운데 정사각형', '①44 ②32 ③73 ④51 심50', (d) => {
      // 크기가 다른 정사각형과, 네 각은 직각이지만 정사각형이 아닌 조각이 섞여 있다.
      const cut = d.until(() => cutPaper(d, [0, 1, 2].map(() => [d.bool() ? 'split' : 'whole', d.pick([2, 3, 4])]), 4), (made) => { const k = made.pieces.filter((piece) => G.isSquare(piece)).length; return made.width <= 9 && k >= 1 && made.pieces.length - k >= 2; });
      const flags = cut.pieces.map((piece) => G.isSquare(piece)), n = flags.filter(Boolean).length;
      return N('직사각형 모양의 종이를 점선을 따라 모두 잘랐다. 잘린 조각 중에서 정사각형은 모두 몇 개인가?', n, {
        unit: '개', figure: cutFigure(cut, 4), explain: `점선을 따라 자르면 조각이 ${cut.pieces.length}개 생긴다. 네 각이 모두 직각이고 네 변의 길이가 모두 같은 조각은 ${n}개이다. 나머지 조각은 이웃한 두 변의 길이가 다르다.`,
        facts: { count: flags }
      });
    }),
    T('paper-cut', '색종이를 점선을 따라 자른 도형', '①44 ①49 ③50 ③73 심50', (d) => {
      const s = [[0, 0], [4, 0], [4, 4], [0, 4]], m = [2, 2], flip = d.bool();
      const WAYS = {
        cross: { cuts: [[s[0], s[2]], [s[1], s[3]]], pieces: [[s[0], s[1], m], [s[1], s[2], m], [s[2], s[3], m], [s[3], s[0], m]], why: '두 점선이 직각으로 만나므로 한 각이 직각인 삼각형이 4개 생긴다.' },
        plus: { cuts: [[[2, 0], [2, 4]], [[0, 2], [4, 2]]], pieces: [[s[0], [2, 0], m, [0, 2]], [[2, 0], s[1], [4, 2], m], [m, [4, 2], s[2], [2, 4]], [[0, 2], m, [2, 4], s[3]]], why: '네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형이 4개 생긴다.' },
        slash: { cuts: flip ? [[s[0], s[2]]] : [[s[1], s[3]]], pieces: flip ? [[s[0], s[1], s[2]], [s[0], s[2], s[3]]] : [[s[0], s[1], s[3]], [s[1], s[2], s[3]]], why: '색종이의 직각인 귀퉁이를 하나씩 가진 삼각형이 2개 생긴다.' },
        bar: { cuts: flip ? [[[2, 0], [2, 4]]] : [[[0, 2], [4, 2]]], pieces: flip ? [[s[0], [2, 0], [2, 4], s[3]], [[2, 0], s[1], s[2], [2, 4]]] : [[s[0], s[1], [4, 2], [0, 2]], [[0, 2], [4, 2], s[2], s[3]]], why: '네 각이 모두 직각이고 이웃한 두 변의 길이가 다른 사각형이 2개 생긴다.' }
      };
      const way = WAYS[d.pick(['cross', 'plus', 'slash', 'bar'])];
      const name = way.pieces.every((piece) => G.isRightTriangle(piece)) ? '직각삼각형' : way.pieces.every((piece) => G.isSquare(piece)) ? '정사각형' : '직사각형', said = `${name} ${way.pieces.length}개`;
      const list = d.shuffle(['직각삼각형 4개', '정사각형 4개', '직각삼각형 2개', '직사각형 2개']);
      return C('정사각형 모양의 색종이를 점선을 따라 모두 잘랐다. 생기는 도형은?', list, list.indexOf(said), {
        figure: G.board(4, 4, [G.polygon(s, 'mb-poly is-plain')].concat(way.cuts.map(([p, q]) => G.line(p, q, 'mb-line is-cut'))), { grid: 'lines', scale: 1.4 }), explain: way.why, facts: { truth: list.map((o) => o === said), want: true }
      });
    }),
    T('picture-shapes', '그림에 쓰인 도형', '③79', (d) => {
      // 집 그림: 벽은 늘 직사각형, 지붕은 직각삼각형이거나 직각이 없는 삼각형, 창문(정사각형)은 있기도 하고 없기도 하다.
      const lean = d.bool(), win = d.bool(), flip = d.bool(), X = ([x, y]) => [flip ? 6 - x : x, y];
      const pieces = [[[1, 2], [5, 2], [5, 5], [1, 5]], lean ? [[1, 2], [5, 2], [1, 0]] : [[1, 2], [3, 1], [5, 2]]].concat(win ? [[[2, 3], [3, 3], [3, 4], [2, 4]]] : []).map((piece) => piece.map(X));
      const used = [pieces.some((piece) => G.isRightTriangle(piece)) ? '직각삼각형' : '', '직사각형', pieces.some((piece) => G.isSquare(piece)) ? '정사각형' : ''].filter(Boolean).join(', ');
      const list = d.shuffle(['직각삼각형, 직사각형, 정사각형', '직각삼각형, 직사각형', '직사각형, 정사각형', '직사각형']);
      return C('직각삼각형, 직사각형, 정사각형 중에서 그림을 그리는 데 쓰인 도형을 모두 고른 것은?', list, list.indexOf(used), {
        figure: G.board(6, 5, pieces.map((piece) => G.polygon(piece, 'mb-poly is-plain')), { grid: 'lines', scale: 1.3 }),
        explain: `벽은 네 각이 모두 직각인 직사각형이다. 지붕은 ${lean ? '한 각이 직각인 직각삼각형이다' : '직각이 없는 삼각형이다'}. ` + (win ? '창문은 네 변의 길이도 모두 같은 정사각형이다.' : '정사각형은 쓰이지 않았다.'),
        facts: { truth: list.map((o) => o === used), want: true }
      });
    })
  ]);

  // ── 실력 ───────────────────────────────────────────────────────
  // 이 단원에서 배운 뜻을 정확히 알아야 가릴 수 있는 문제만 싣는다(계산 단계를 늘리지 않는다).
  B.addTypes('3-1-2', 'hard', [
    H('h-on-line', '한 직선 위의 세 점으로 나타낸 선', '기본 ③15, 심9', (d) => {
      // 보기마다 걸리는 아이가 다르다.
      const [a, b, c] = d.pick(TRIPLES);
      const rows = d.shuffle([
        { text: `직선 ${a}${b}과 직선 ${b}${c}은 똑같은 도형이다.`, ok: true },       // 이름에 쓰인 점이 다르면 다른 직선이라고 여기는 아이가 고른다
        { text: `반직선 ${a}${b}과 반직선 ${a}${c}은 똑같은 도형이다.`, ok: true },   // 지나는 점의 이름이 다르면 다른 반직선이라고 여기는 아이가 고른다
        { text: `선분 ${a}${c}과 선분 ${c}${a}은 똑같은 도형이다.`, ok: true },       // 반직선처럼 선분도 차례를 바꾸면 달라진다고 여기는 아이가 고른다
        d.pick([{ text: `반직선 ${b}${a}과 반직선 ${b}${c}은 똑같은 도형이다.`, ok: false, why: `반직선 ${b}${a}과 반직선 ${b}${c}은 시작하는 점은 같지만 늘인 쪽이 서로 반대이므로 다른 도형이다.` },      // 시작하는 점만 같으면 같은 반직선이라고 여기면 답을 찾지 못한다
          { text: `선분 ${a}${b}과 선분 ${a}${c}은 똑같은 도형이다.`, ok: false, why: `선분 ${a}${b}과 선분 ${a}${c}은 한쪽 끝 점이 다르므로 다른 도형이다.` }])                                     // 반직선의 약속(시작하는 점과 늘인 쪽)을 선분에 대면 답을 찾지 못한다
      ]);
      const xs = [1.2, 3.2, 5.8], bad = rows.find((row) => !row.ok);
      return C(`한 직선 위에 세 점 ${a}, ${b}, ${c}이 차례로 놓여 있다. 옳지 않은 것은?`, rows.map((row) => row.text), rows.indexOf(bad), {
        figure: G.board(7, 3, [G.line([0.3, 1.2], [6.7, 1.2])].concat([a, b, c].map((n, i) => G.point([xs[i], 1.2]) + G.text([xs[i], 1.85], n))), { grid: false, scale: 1.05 }),
        explain: `${bad.why} 직선은 양쪽으로 끝없이 늘인 곧은 선이므로 그 위의 어느 두 점으로 이름을 붙여도 똑같은 도형이고, 반직선은 시작하는 점과 늘인 쪽이 같으면 똑같은 도형이다.`,
        facts: { truth: rows.map((row) => row.ok), want: false }
      });
    }, { standard: LINE }),
    H('h-length', '길이를 잴 수 있는 선', '심9', (d) => {
      const [a, b] = d.pick(PAIRS);
      const rows = d.shuffle([
        { text: `선분 ${a}${b}은 길이를 잴 수 있다.`, ok: true },
        { text: `반직선 ${a}${b}은 점 ${a}에서 시작하므로 길이를 잴 수 있다.`, ok: false },       // 시작하는 점이 있으면 잴 수 있다고 여기는 아이
        { text: `직선 ${a}${b}의 길이는 점 ${a}에서 점 ${b}까지의 길이이다.`, ok: false },         // 직선을 이름에 쓰인 두 점 사이로만 보는 아이(선분과 구별하지 못한다)
        { text: `반직선 ${a}${b}의 길이는 직선 ${a}${b}의 길이의 반이다.`, ok: false }            // 한쪽으로만 늘였으니 반이라고 여기는 아이
      ]);
      return C('선분, 반직선, 직선의 길이에 대한 설명으로 옳은 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        explain: '선분은 양쪽에 끝이 있으므로 길이를 잴 수 있다. 반직선과 직선은 끝없이 늘인 곧은 선이므로 길이를 잴 수 없고, 길이를 서로 비교할 수도 없다.', facts: { truth: rows.map((row) => row.ok), want: true }
      });
    }, { standard: LINE })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
