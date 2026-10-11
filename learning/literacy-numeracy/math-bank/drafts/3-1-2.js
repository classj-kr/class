// 3학년 1학기 2단원 평면도형.
// 선분·반직선·직선 → 각과 직각 → 직각삼각형 → 직사각형과 정사각형 → 섞어 풀기.
// 도형의 꼭짓점은 모두 모눈의 점 위에 두어, 직각인지 아닌지를 정수 셈으로 정한다(geometry.js).
// 그리기·이유 쓰기처럼 자동으로 채점할 수 없는 활동은 넣지 않는다.
// 말투는 수능 문체다: "~을 구하시오.", "~은?", "~이다".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, expr, box } = B.kit;
  const G = B.kit.geo;
  const LINE = '4수03-01', ANGLE = '4수03-02', TRIANGLE = '4수03-09', QUADS = '4수03-10';
  const TILE = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const S = 4;   // 작은 그림 한 칸의 모눈 크기

  // ── 모눈 위 도형 만들기 ───────────────────────────────────────
  const fit = (points) => {
    const mx = Math.min(...points.map((p) => p[0])), my = Math.min(...points.map((p) => p[1]));
    return points.map(([x, y]) => [x - mx, y - my]);
  };
  // 뒤집고 돌려 모양을 다양하게 한다(직각·변의 길이는 그대로다).
  const turn = (d, points) => {
    let out = points;
    if (d.bool()) out = out.map(([x, y]) => [y, x]);
    if (d.bool()) out = out.map(([x, y]) => [S - x, y]);
    if (d.bool()) out = out.map(([x, y]) => [x, S - y]);
    return fit(out);
  };
  const wide = (points) => Math.max(...points.map((p) => p[0])) - Math.min(...points.map((p) => p[0])) >= 2 && Math.max(...points.map((p) => p[1])) - Math.min(...points.map((p) => p[1])) >= 2;
  const anyTriangle = (d) => [[d.int(0, S), d.int(0, S)], [d.int(0, S), d.int(0, S)], [d.int(0, S), d.int(0, S)]];
  const rightTriangle = (d) => fit(d.until(() => anyTriangle(d), (t) => G.area2(t) >= 6 && wide(t) && G.isRightTriangle(t) && !G.looksRight(t)));
  const plainTriangle = (d) => fit(d.until(() => anyTriangle(d), (t) => G.area2(t) >= 6 && wide(t) && G.rightAngles(t) === 0 && !G.looksRight(t)));
  const QUAD = {
    rect: (d) => { const [w, h] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x !== y); return [[0, 0], [w, 0], [w, h], [0, h]]; },
    rectTilt: (d) => { const [a, b] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1]]); return [[b, 0], [b + a, a], [a, a + b], [0, b]]; },
    square: (d) => { const s = d.int(2, 4); return [[0, 0], [s, 0], [s, s], [0, s]]; },
    squareTilt: (d) => { const [p, q] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 2]]); return [[q, 0], [q + p, q], [p, q + p], [0, p]]; },
    slant: (d) => d.until(() => { const k = d.int(1, 2), w = d.int(2, 4 - k), h = d.int(2, 4); return [[k, 0], [k + w, 0], [w, h], [0, h]]; }, (q) => G.rightAngles(q) === 0 && !G.looksRight(q)),
    trapezoid: (d) => { const h = d.int(2, 3), [a, b] = d.pick([[1, 3], [1, 2], [2, 3]]); return [[a, 0], [b, 0], [4, h], [0, h]]; },
    rightTrapezoid: (d) => { const h = d.int(2, 3), b = d.int(1, 3); return [[0, 0], [b, 0], [4, h], [0, h]]; },
    rhombus: (d) => d.pick([[[2, 0], [4, 1], [2, 2], [0, 1]], [[1, 0], [2, 2], [1, 4], [0, 2]]])
  };
  const quad = (d, kind) => turn(d, QUAD[kind](d));
  const PENTAGON = [[[2, 0], [4, 1], [3, 4], [1, 4], [0, 1]], [[1, 0], [3, 0], [4, 2], [2, 4], [0, 2]]];
  const HEXAGON = [[[1, 0], [3, 0], [4, 2], [3, 4], [1, 4], [0, 2]], [[2, 0], [4, 1], [4, 3], [2, 4], [0, 3], [0, 1]]];
  const polygonWith = (d, corners) => (corners === 3 ? (d.bool() ? rightTriangle(d) : plainTriangle(d)) : corners === 4 ? quad(d, d.pick(['rect', 'slant', 'trapezoid', 'squareTilt'])) : turn(d, d.pick(corners === 5 ? PENTAGON : HEXAGON)));
  // 직각의 수가 분명한 도형들
  const HOUSE = [[[0, 4], [0, 2], [2, 0], [4, 2], [4, 4]], [[0, 4], [0, 2], [2, 1], [4, 2], [4, 4]]];
  const cornerShape = (d) => d.pick([() => quad(d, 'rect'), () => quad(d, 'squareTilt'), () => rightTriangle(d), () => quad(d, 'rightTrapezoid'), () => turn(d, HOUSE[0]), () => turn(d, HOUSE[1]), () => quad(d, 'slant'), () => plainTriangle(d)])();

  const tileOf = (label, points) => G.tile(label, G.board(S, S, [G.polygon(points)]));
  const tiles = (list) => list.map((points, i) => tileOf(TILE[i], points)).join('');
  const labelsOf = (flags) => flags.map((yes, i) => (yes ? TILE[i] : '')).filter(Boolean);

  // 여러 도형 가운데 하나를 고르는 문항
  function pickOne(d, text, right, others, test, why) {
    const order = d.shuffle([right, ...others]);
    return { text, figure: tiles(order), choice: { options: TILE.slice(0, order.length), answer: order.indexOf(right) }, explain: `${why} 도형은 ${TILE[order.indexOf(right)]}이다.`, facts: { tiles: order, test, mode: 'pick' } };
  }
  // 여러 도형 가운데 조건에 맞는 것의 수를 세는 문항
  function countThem(text, order, check, test, why) {
    const flags = order.map(check);
    return { text, figure: tiles(order), inputs: [{ answer: flags.filter(Boolean).length, unit: '개' }], explain: `${why} 도형은 ${labelsOf(flags).join(', ')}이다.`, facts: { tiles: order, test, mode: 'count' } };
  }

  // 옳은 것 / 옳지 않은 것 고르기. pool: [문장, 참인가, 거짓이면 바로잡은 말]
  function claims(d, pool, wantTrue, topic) {
    const yes = d.shuffle(pool.filter((c) => c[1])), no = d.shuffle(pool.filter((c) => !c[1]));
    const target = wantTrue ? yes[0] : no[0];
    const order = d.shuffle([target, ...(wantTrue ? no.slice(0, 3) : yes.slice(0, 3))]);
    return {
      text: `${topic}에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`,
      choice: { options: order.map((c) => c[0]), answer: order.indexOf(target) },
      explain: order.filter((c) => !c[1]).map((c) => c[2]).join(' '),
      facts: { truths: order.map((c) => c[1]), wantTrue }
    };
  }
  const LINE_CLAIMS = [
    ['선분은 두 점을 곧게 이은 선이다.', true],
    ['반직선은 한 점에서 시작하여 한쪽으로 끝없이 늘인 곧은 선이다.', true],
    ['직선은 양쪽으로 끝없이 늘인 곧은 선이다.', true],
    ['선분 ㄱㄴ과 선분 ㄴㄱ은 같은 선분이다.', true],
    ['직선 ㄱㄴ과 직선 ㄴㄱ은 같은 직선이다.', true],
    ['반직선 ㄱㄴ과 반직선 ㄴㄱ은 같은 반직선이다.', false, '반직선 ㄱㄴ은 점 ㄱ에서, 반직선 ㄴㄱ은 점 ㄴ에서 시작하므로 서로 다르다.'],
    ['선분은 양쪽으로 끝없이 늘어난다.', false, '양쪽으로 끝없이 늘인 곧은 선은 직선이다.'],
    ['직선에는 시작하는 점이 있다.', false, '직선은 양쪽으로 끝없이 늘인 선이므로 시작하는 점이 없다.'],
    ['반직선은 양쪽으로 끝없이 늘인 곧은 선이다.', false, '반직선은 한쪽으로만 끝없이 늘인 선이다.'],
    ['두 점을 이은 굽은 선도 선분이다.', false, '선분은 두 점을 곧게 이은 선이다.']
  ];
  const ANGLE_CLAIMS = [
    ['각은 한 점에서 그은 두 반직선으로 이루어진 도형이다.', true],
    ['각 ㄱㄴㄷ의 꼭짓점은 점 ㄴ이다.', true],
    ['각 ㄱㄴㄷ의 변은 변 ㄴㄱ과 변 ㄴㄷ이다.', true],
    ['삼각형에는 각이 3개 있다.', true],
    ['각 ㄱㄴㄷ과 각 ㄷㄴㄱ은 같은 각이다.', true],
    ['각 ㄱㄴㄷ의 꼭짓점은 점 ㄱ이다.', false, '각 ㄱㄴㄷ의 꼭짓점은 가운데에 적은 점 ㄴ이다.'],
    ['원에는 각이 1개 있다.', false, '원에는 각이 없다.'],
    ['각의 변은 굽은 선이다.', false, '각의 변은 곧은 선(반직선)이다.'],
    ['사각형에는 각이 3개 있다.', false, '사각형에는 각이 4개 있다.'],
    ['직각삼각형의 세 각은 모두 직각이다.', false, '직각삼각형은 한 각만 직각이다.']
  ];
  const TRIANGLE_CLAIMS = [
    ['직각삼각형은 한 각이 직각인 삼각형이다.', true],
    ['직각삼각형에는 변이 3개 있다.', true],
    ['직각삼각형에는 꼭짓점이 3개 있다.', true],
    ['직각삼각형에는 직각이 1개 있다.', true],
    ['직각삼각형에는 직각이 2개 있다.', false, '직각삼각형에는 직각이 1개 있다.'],
    ['직각삼각형에는 각이 4개 있다.', false, '직각삼각형에는 각이 3개 있다.'],
    ['직각삼각형은 세 각이 모두 직각이다.', false, '직각삼각형은 한 각만 직각이다.'],
    ['직각삼각형에는 변이 4개 있다.', false, '직각삼각형에는 변이 3개 있다.'],
    ['직각이 없는 삼각형도 직각삼각형이다.', false, '한 각이 직각이어야 직각삼각형이다.']
  ];
  const QUAD_CLAIMS = [
    ['직사각형은 네 각이 모두 직각이다.', true],
    ['정사각형은 네 변의 길이가 모두 같다.', true],
    ['정사각형은 네 각이 모두 직각이다.', true],
    ['직사각형은 마주 보는 두 변의 길이가 같다.', true],
    ['정사각형은 직사각형이라고 할 수 있다.', true],
    ['직사각형은 네 변의 길이가 항상 모두 같다.', false, '네 변의 길이가 모두 같은 직사각형은 정사각형뿐이다.'],
    ['직사각형은 항상 정사각형이다.', false, '네 변의 길이가 모두 같아야 정사각형이다.'],
    ['정사각형에는 직각이 2개 있다.', false, '정사각형에는 직각이 4개 있다.'],
    ['직사각형에는 변이 3개 있다.', false, '직사각형에는 변이 4개 있다.'],
    ['네 변의 길이가 모두 같은 사각형은 항상 정사각형이다.', false, '네 각이 모두 직각이어야 정사각형이다.']
  ];

  // 자를 선을 그은 직사각형: 조각을 모두 늘어놓고 직각삼각형을 센다.
  function cutPaper(d, kind) {
    const made = {
      diagonal: () => { const [w, h] = d.pick([[4, 2], [4, 3], [3, 2], [5, 3]]); return { w, h, cuts: [[[0, 0], [w, h]]], pieces: [[[0, 0], [w, h], [0, h]], [[0, 0], [w, 0], [w, h]]] }; },
      cross: () => { const s = d.pick([2, 4]); const c = [s / 2, s / 2]; return { w: s, h: s, cuts: [[[0, 0], [s, s]], [[s, 0], [0, s]]], pieces: [[[0, 0], [s, 0], c], [[s, 0], [s, s], c], [[s, s], [0, s], c], [[0, s], [0, 0], c]] }; },
      halves: () => { const [w, h, k] = d.pick([[4, 2, 2], [5, 2, 2], [5, 3, 3], [6, 3, 2]]); return { w, h, cuts: [[[k, 0], [k, h]], [[0, 0], [k, h]], [[k, 0], [w, h]]], pieces: [[[0, 0], [k, h], [0, h]], [[0, 0], [k, 0], [k, h]], [[k, 0], [w, h], [k, h]], [[k, 0], [w, 0], [w, h]]] }; },
      corner: () => { const [w, h, k] = d.pick([[5, 3, 2], [4, 3, 1], [6, 2, 3], [5, 2, 3]]); return { w, h, cuts: [[[0, 0], [k, h]]], pieces: [[[0, 0], [k, h], [0, h]], [[0, 0], [w, 0], [w, h], [k, h]]] }; },
      roof: () => { const [w, h] = d.pick([[4, 3], [6, 2], [2, 3], [6, 4]]); const m = w / 2; return { w, h, cuts: [[[m, 0], [0, h]], [[m, 0], [w, h]]], pieces: [[[0, 0], [m, 0], [0, h]], [[m, 0], [w, 0], [w, h]], [[m, 0], [w, h], [0, h]]] }; }
    }[kind]();
    const answer = made.pieces.filter((p) => G.isRightTriangle(p)).length;
    return {
      text: '직사각형 모양의 종이를 점선을 따라 모두 자를 때, 생기는 직각삼각형은 모두 몇 개인가?',
      figure: G.board(made.w, made.h, [G.polygon([[0, 0], [made.w, 0], [made.w, made.h], [0, made.h]]), ...made.cuts.map(([p, q]) => G.line(p, q, 'mb-cut'))]),
      inputs: [{ answer, unit: '개' }],
      explain: `자르면 조각이 ${made.pieces.length}개 생기고, 그중 한 각이 직각인 삼각형은 ${answer}개이다.`,
      facts: { pieces: made.pieces }
    };
  }

  // 작은 직사각형으로 나눈 그림에서 크고 작은 직사각형 세기
  function gridRectangles(d) {
    const [cols, rows] = d.pick([[3, 1], [4, 1], [2, 2]]);
    const lines = [];
    for (let x = 1; x < cols; x += 1) lines.push(G.line([x * 2, 0], [x * 2, rows * 1.5]));
    for (let y = 1; y < rows; y += 1) lines.push(G.line([0, y * 1.5], [cols * 2, y * 1.5]));
    const answer = (cols * (cols + 1) / 2) * (rows * (rows + 1) / 2);
    const explain = rows === 1
      ? `작은 직사각형 1개로 된 것이 ${cols}개, 2개로 된 것이 ${cols - 1}개` + (cols >= 3 ? `, 3개로 된 것이 ${cols - 2}개` : '') + (cols >= 4 ? `, 4개로 된 것이 ${cols - 3}개` : '') + `이므로 모두 ${answer}개이다.`
      : '작은 직사각형 1개로 된 것이 4개, 2개로 된 것이 4개, 4개로 된 것이 1개이므로 모두 9개이다.';
    return {
      text: '다음 도형에서 찾을 수 있는 크고 작은 직사각형은 모두 몇 개인가?',
      figure: G.board(cols * 2, rows * 1.5, [G.polygon([[0, 0], [cols * 2, 0], [cols * 2, rows * 1.5], [0, rows * 1.5]]), ...lines], { grid: false }),
      inputs: [{ answer, unit: '개' }], explain, facts: { gridCount: [cols, rows] }
    };
  }

  const squareSum = (d) => {
    const a = d.int(3, 9);
    return { text: `정사각형의 한 변의 길이가 ${a}cm일 때, 네 변의 길이의 합은 몇 cm인가?`, inputs: [{ answer: 4 * a, unit: 'cm' }], explain: expr(a, '+', a, '+', a, '+', a, '=', 4 * a), facts: { sides: [a, a, a, a] } };
  };
  const rectSum = (d) => {
    const [a, b] = d.until(() => [d.int(3, 14), d.int(2, 9)], ([x, y]) => x > y);
    return { text: `가로가 ${a}cm, 세로가 ${b}cm인 직사각형의 네 변의 길이의 합은 몇 cm인가?`, inputs: [{ answer: 2 * (a + b), unit: 'cm' }], explain: expr(a, '+', b, '+', a, '+', b, '=', 2 * (a + b)), facts: { sides: [a, b, a, b] } };
  };

  B.addUnit({
    id: '3-1-2', grade: 3, semester: 1, no: 2, title: '평면도형',
    groups: [
      {
        id: 'lines', title: '선분, 반직선, 직선', standard: LINE,
        types: [
          {
            id: 'line-name', level: '기본', title: '선의 이름', count: 2,
            make: (d) => {
              const kind = d.pick(['segment', 'ray', 'line']);
              const [n0, n1] = d.pick([['ㄱ', 'ㄴ'], ['ㄷ', 'ㄹ'], ['ㅁ', 'ㅂ']]);
              const left = [1, d.int(1, 2)], right = [4, d.int(1, 2)];
              const fromLeft = d.bool();   // 반직선이 시작하는 쪽
              const figure = G.board(5, 3, [fromLeft ? G.straight(kind, left, right, [n0, n1]) : G.straight(kind, right, left, [n1, n0])], { grid: false });
              const options = [`선분 ${n0}${n1}`, `반직선 ${n0}${n1}`, `반직선 ${n1}${n0}`, `직선 ${n0}${n1}`];
              const answer = kind === 'segment' ? 0 : kind === 'line' ? 3 : fromLeft ? 1 : 2;
              const why = { segment: '두 점을 곧게 이은 선이다.', ray: `점 ${fromLeft ? n0 : n1}에서 시작하여 점 ${fromLeft ? n1 : n0} 쪽으로 끝없이 늘인 곧은 선이다.`, line: '양쪽으로 끝없이 늘인 곧은 선이다.' }[kind];
              return { text: '다음 도형의 이름은?', figure, choice: { options, answer }, explain: why, facts: { lineKind: kind, fromLeft, names: [n0, n1] } };
            }
          },
          {
            id: 'line-pick', level: '기본', title: '선 고르기', count: 2,
            make: (d) => {
              const kinds = d.shuffle(['segment', 'ray', 'line', 'curve']);
              const ask = d.pick(['segment', 'ray', 'line']);
              const draw = (kind) => { const p = [1, d.int(1, 3)], q = [3, d.int(1, 3)]; return G.board(S, S, [kind === 'curve' ? G.curve(p, q) : G.straight(kind, p, q)], { grid: false }); };
              return {
                text: `다음 중 ${{ segment: '선분', ray: '반직선', line: '직선' }[ask]}은?`,
                figure: kinds.map((kind, i) => G.tile(TILE[i], draw(kind))).join(''),
                choice: { options: TILE.slice(0, 4), answer: kinds.indexOf(ask) },
                explain: { segment: '선분은 두 점을 곧게 이은 선이다.', ray: '반직선은 한 점에서 시작하여 한쪽으로 끝없이 늘인 곧은 선이다.', line: '직선은 양쪽으로 끝없이 늘인 곧은 선이다.' }[ask],
                facts: { lineKinds: kinds, ask }
              };
            }
          },
          { id: 'line-true', level: '기본', title: '옳은 설명 고르기', make: (d) => claims(d, LINE_CLAIMS, true, '선분, 반직선, 직선') },
          { id: 'line-false', level: '기본', title: '옳지 않은 설명 고르기', make: (d) => claims(d, LINE_CLAIMS, false, '선분, 반직선, 직선') },
          {
            id: 'line-count', level: '실력', title: '그을 수 있는 선의 수', count: 2,
            make: (d, n) => {
              if (n === 0) {
                const points = d.pick([[[1, 0], [4, 1], [3, 4], [0, 3]], [[2, 0], [4, 2], [3, 4], [1, 4], [0, 2]]]);
                const names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].slice(0, points.length);
                const total = points.length * (points.length - 1) / 2;
                const steps = Array.from({ length: points.length - 1 }, (_, i) => points.length - 1 - i);
                return {
                  text: `점 ${points.length}개 중 두 점을 이어 그을 수 있는 선분은 모두 몇 개인가?`,
                  figure: G.board(S, S, [points.map(G.point).join(''), G.vertexLabels(points, names)], { grid: false }),
                  inputs: [{ answer: total, unit: '개' }],
                  explain: `점 ㄱ에서 ${steps[0]}개를 긋고, 다음 점부터는 새로 그을 수 있는 선분이 하나씩 줄어든다. ` + expr(...steps.flatMap((v, i) => (i ? ['+', v] : [v])), '=', total),
                  facts: { pointCount: points.length, drawn: 'segment' }
                };
              }
              const points = d.pick([[[0, 3], [4, 3], [2, 0]], [[0, 0], [4, 1], [1, 4]]]);
              return {
                text: '세 점 중 두 점을 지나는 반직선은 모두 몇 개인가?',
                figure: G.board(S, S, [points.map(G.point).join(''), G.vertexLabels(points, ['ㄱ', 'ㄴ', 'ㄷ'])], { grid: false }),
                inputs: [{ answer: 6, unit: '개' }],
                explain: '두 점을 지나는 반직선은 시작하는 점에 따라 2개이다. 두 점을 고르는 방법이 3가지이므로 ' + expr(2, '+', 2, '+', 2, '=', 6),
                facts: { pointCount: 3, drawn: 'ray' }
              };
            }
          }
        ]
      },
      {
        id: 'angles', title: '각과 직각', standard: ANGLE,
        types: [
          {
            id: 'angle-name', level: '기본', title: '각의 이름과 꼭짓점', count: 2,
            make: (d, n) => {
              const names = d.pick([['ㄱ', 'ㄴ', 'ㄷ'], ['ㄹ', 'ㅁ', 'ㅂ'], ['ㄴ', 'ㄷ', 'ㄹ']]);
              const v = [1, 3], p = [d.int(1, 3), 0], q = [4, d.int(2, 3)];
              const figure = G.board(5, 4, [G.angle(v, p, q, names)], { grid: false });
              const [a, b, c] = names;
              if (n === 0) {
                const options = d.shuffle([`각 ${a}${b}${c}`, `각 ${b}${a}${c}`, `각 ${a}${c}${b}`]);
                return { text: '다음 각의 이름은?', figure, choice: { options, answer: options.indexOf(`각 ${a}${b}${c}`) }, explain: `각의 이름은 꼭짓점 ${b}이 가운데에 오도록 읽는다.`, facts: { angleNames: names, asks: 'name' } };
              }
              const options = d.shuffle([`점 ${a}`, `점 ${b}`, `점 ${c}`]);
              return { text: '다음 각의 꼭짓점은?', figure, choice: { options, answer: options.indexOf(`점 ${b}`) }, explain: `두 반직선이 만나는 점 ${b}이 꼭짓점이다.`, facts: { angleNames: names, asks: 'vertex' } };
            }
          },
          {
            id: 'angle-count', level: '기본', title: '도형의 각의 수',
            make: (d) => {
              const corners = d.int(3, 6), points = polygonWith(d, corners);
              return { text: '다음 도형에서 찾을 수 있는 각은 모두 몇 개인가?', figure: G.board(S, S, [G.polygon(points)], { grid: false }), inputs: [{ answer: corners, unit: '개' }], explain: `꼭짓점이 ${corners}개이므로 각도 ${corners}개이다.`, facts: { polygon: points } };
            }
          },
          {
            id: 'angle-most', level: '기본', title: '각이 가장 많은 도형',
            make: (d) => {
              const counts = d.shuffle([3, 4, 5, 6]).slice(0, 3);
              const shapes = counts.map((k) => polygonWith(d, k));
              return {
                text: '각이 가장 많은 도형은?',
                figure: shapes.map((points, i) => G.tile(TILE[i], G.board(S, S, [G.polygon(points)], { grid: false }))).join(''),
                choice: { options: TILE.slice(0, 3), answer: counts.indexOf(Math.max(...counts)) },
                explain: counts.map((k, i) => `${TILE[i]} ${k}개`).join(', ') + '이다.',
                facts: { polygons: shapes }
              };
            }
          },
          {
            id: 'right-pick', level: '기본', title: '직각 고르기',
            make: (d) => {
              const arm = () => d.until(() => [d.int(-3, 3), d.int(-3, 3)], ([x, y]) => x * x + y * y >= 4 && x * x + y * y <= 10);
              const fitAngle = (v, p, q) => { const mx = Math.min(v[0], p[0], q[0]), my = Math.min(v[1], p[1], q[1]); return [v, p, q].map(([x, y]) => [x - mx, y - my]); };
              const inBox = (a) => a.every(([x, y]) => x <= S && y <= S);
              const rightOne = d.until(() => { const u = arm(); return fitAngle([0, 0], u, [-u[1], u[0]]); }, inBox);
              const other = () => d.until(() => { const u = arm(), w = arm(); return { u, w, a: fitAngle([0, 0], u, w) }; }, ({ u, w, a }) => {
                const dotp = u[0] * w[0] + u[1] * w[1], cos2 = (dotp * dotp) / ((u[0] * u[0] + u[1] * u[1]) * (w[0] * w[0] + w[1] * w[1]));
                return inBox(a) && u[0] * w[1] - u[1] * w[0] !== 0 && cos2 >= 0.12 && cos2 <= 0.85;
              }).a;
              const order = d.shuffle([rightOne, other(), other(), other()]);
              return {
                text: '다음 중 직각은?',
                figure: order.map(([v, p, q], i) => G.tile(TILE[i], G.board(S, S, [G.line(v, p), G.line(v, q), G.point(v)]))).join(''),
                choice: { options: TILE.slice(0, 4), answer: order.indexOf(rightOne) },
                explain: `모눈의 점을 따라 살펴보면 ${TILE[order.indexOf(rightOne)]}의 두 변이 직각으로 만난다.`,
                facts: { anglesList: order }
              };
            }
          },
          {
            id: 'right-count', level: '기본', title: '도형의 직각의 수', count: 2,
            make: (d, n) => {
              if (n === 0) {
                const points = d.until(() => cornerShape(d), (s) => G.rightAngles(s) >= 1);
                return { text: '다음 도형에서 찾을 수 있는 직각은 모두 몇 개인가?', figure: G.board(S, S, [G.polygon(points)]), inputs: [{ answer: G.rightAngles(points), unit: '개' }], explain: `직각인 각은 ${G.rightAngles(points)}개이다.`, facts: { shapes: [points] } };
              }
              const pair = d.until(() => [cornerShape(d), cornerShape(d)], ([a, b]) => G.rightAngles(a) + G.rightAngles(b) >= 2 && a.length !== b.length);
              return {
                text: '두 도형에서 찾을 수 있는 직각은 모두 몇 개인가?',
                figure: pair.map((points, i) => tileOf(['가', '나'][i], points)).join(''),
                inputs: [{ answer: G.rightAngles(pair[0]) + G.rightAngles(pair[1]), unit: '개' }],
                explain: `가에 ${G.rightAngles(pair[0])}개, 나에 ${G.rightAngles(pair[1])}개이므로 ` + expr(G.rightAngles(pair[0]), '+', G.rightAngles(pair[1]), '=', G.rightAngles(pair[0]) + G.rightAngles(pair[1])),
                facts: { shapes: pair }
              };
            }
          },
          {
            id: 'clock-right', level: '기본', title: '직각인 시각',
            make: (d) => {
              const right = d.pick([3, 9]);
              const hours = d.shuffle([right, ...d.shuffle([1, 2, 4, 5, 6, 7, 8, 10, 11, 12]).slice(0, 3)]);
              return {
                text: '시계의 긴바늘과 짧은바늘이 이루는 각이 직각인 것은?',
                figure: hours.map((h, i) => G.tile(TILE[i], G.clock(h, 0, { size: 104 }))).join(''),
                choice: { options: TILE.slice(0, 4), answer: hours.indexOf(right) },
                explain: `${right}시에 두 바늘이 이루는 각이 직각이다.`,
                facts: { hours }
              };
            }
          },
          { id: 'angle-true', level: '기본', title: '옳은 설명 고르기', make: (d) => claims(d, ANGLE_CLAIMS, d.bool(), '각') },
          {
            id: 'angle-fan', level: '실력', title: '크고 작은 각의 수', count: 2,
            make: (d, n) => {
              const ends = n === 0 ? [[4, 4], [4, 2], [3, 0], [1, 0]] : [[4, 4], [4, 2], [4, 0], [2, 0], [0, 1]];
              const v = n === 0 ? [0, 4] : [1, 4];
              const k = ends.length, total = k * (k - 1) / 2;
              const steps = Array.from({ length: k - 1 }, (_, i) => k - 1 - i);
              return {
                text: '점 ㅇ을 꼭짓점으로 하는 크고 작은 각은 모두 몇 개인가?',
                figure: G.board(5, 5, [ends.map((e) => G.line(v, e)).join(''), G.point(v), G.text([v[0] - 0.15, v[1] + 0.6], 'ㅇ'), ...ends.map((e, i) => G.text(G.beyond(v, e, 0.45), ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'][i]))], { grid: false }),
                inputs: [{ answer: total, unit: '개' }],
                explain: `이웃한 두 반직선으로 된 각이 ${steps[0]}개이고, 사이에 반직선이 하나씩 더 들어갈 때마다 하나씩 줄어든다. ` + expr(...steps.flatMap((s, i) => (i ? ['+', s] : [s])), '=', total),
                facts: { fan: k }
              };
            }
          }
        ]
      },
      {
        id: 'right-triangles', title: '직각삼각형', standard: TRIANGLE,
        types: [
          { id: 'rt-pick', level: '기본', title: '직각삼각형 고르기', count: 2, make: (d) => pickOne(d, '다음 중 직각삼각형은?', rightTriangle(d), [plainTriangle(d), plainTriangle(d), plainTriangle(d)], 'rightTriangle', '한 각이 직각인') },
          {
            id: 'rt-count', level: '기본', title: '직각삼각형의 수',
            make: (d) => {
              const k = d.int(2, 3);
              const order = d.shuffle([...Array.from({ length: k }, () => rightTriangle(d)), ...Array.from({ length: 5 - k }, () => plainTriangle(d))]);
              return countThem('다음 중 직각삼각형은 모두 몇 개인가?', order, G.isRightTriangle, 'rightTriangle', '한 각이 직각인');
            }
          },
          { id: 'rt-true', level: '기본', title: '옳은 설명 고르기', make: (d) => claims(d, TRIANGLE_CLAIMS, true, '직각삼각형') },
          { id: 'rt-false', level: '기본', title: '옳지 않은 설명 고르기', make: (d) => claims(d, TRIANGLE_CLAIMS, false, '직각삼각형') },
          { id: 'rt-cut', level: '실력', title: '잘라서 생기는 직각삼각형', count: 2, make: (d, n) => cutPaper(d, n === 0 ? d.pick(['halves', 'roof']) : d.pick(['cross', 'corner', 'diagonal'])) }
        ]
      },
      {
        id: 'rectangles', title: '직사각형과 정사각형', standard: QUADS,
        types: [
          { id: 'rect-pick', level: '기본', title: '직사각형 고르기', make: (d) => pickOne(d, '다음 중 직사각형은?', quad(d, d.pick(['rect', 'rect', 'rectTilt'])), [quad(d, 'slant'), quad(d, d.pick(['trapezoid', 'rightTrapezoid'])), quad(d, 'rhombus')], 'rectangle', '네 각이 모두 직각인') },
          { id: 'square-pick', level: '기본', title: '정사각형 고르기', make: (d) => pickOne(d, '다음 중 정사각형은?', quad(d, d.pick(['square', 'square', 'squareTilt'])), [quad(d, d.pick(['rect', 'rectTilt'])), quad(d, 'rhombus'), quad(d, d.pick(['slant', 'trapezoid']))], 'square', '네 각이 모두 직각이고 네 변의 길이가 모두 같은') },
          {
            id: 'rect-side', level: '기본', title: '길이가 같은 변',
            make: (d) => {
              const [w, h] = d.until(() => [d.int(3, 5), d.int(2, 4)], ([x, y]) => x !== y);
              const points = [[1, 1], [1, 1 + h], [1 + w, 1 + h], [1 + w, 1]];   // ㄱ(왼쪽 위)에서 시계 반대 방향
              const names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
              const sides = ['ㄱㄴ', 'ㄴㄷ', 'ㄹㄷ', 'ㄱㄹ'];   // 왼쪽, 아래, 오른쪽, 위
              const ask = d.int(0, 3), same = [2, 3, 0, 1][ask];
              const options = d.shuffle(sides.filter((_, i) => i !== ask));
              return {
                text: `직사각형 ㄱㄴㄷㄹ에서 변 ${sides[ask]}과 길이가 같은 변은?`,
                figure: G.board(w + 2, h + 2, [G.polygon(points), G.vertexLabels(points, names)], { grid: false }),
                choice: { options: options.map((s) => '변 ' + s), answer: options.indexOf(sides[same]) },
                explain: '직사각형은 마주 보는 두 변의 길이가 같다.',
                facts: { rectSide: [ask, same], options }
              };
            }
          },
          { id: 'square-sum', level: '기본', title: '정사각형의 네 변의 길이의 합', make: squareSum },
          { id: 'rect-sum', level: '기본', title: '직사각형의 네 변의 길이의 합', make: rectSum },
          { id: 'quad-true', level: '기본', title: '옳은 설명 고르기', make: (d) => claims(d, QUAD_CLAIMS, true, '직사각형과 정사각형') },
          { id: 'quad-false', level: '기본', title: '옳지 않은 설명 고르기', make: (d) => claims(d, QUAD_CLAIMS, false, '직사각형과 정사각형') },
          {
            id: 'rect-all', level: '실력', title: '정사각형까지 넣어 직사각형 세기',
            make: (d) => {
              const order = d.shuffle([quad(d, 'rect'), quad(d, d.pick(['square', 'squareTilt'])), quad(d, d.pick(['rectTilt', 'square'])), quad(d, d.pick(['slant', 'rhombus'])), quad(d, d.pick(['trapezoid', 'rightTrapezoid']))]);
              const item = countThem('다음 중 직사각형은 모두 몇 개인가?', order, G.isRectangle, 'rectangle', '네 각이 모두 직각인');
              item.explain += ' 정사각형도 네 각이 모두 직각이므로 직사각형이다.';
              return item;
            }
          },
          {
            id: 'square-side', level: '실력', title: '합에서 한 변 구하기', count: 2,
            make: (d, n) => {
              if (n === 0) {
                const a = d.int(3, 9);
                return { text: `네 변의 길이의 합이 ${4 * a}cm인 정사각형의 한 변의 길이는 몇 cm인가?`, inputs: [{ answer: a, unit: 'cm' }], explain: expr(a, '+', a, '+', a, '+', a, '=', 4 * a) + `이므로 한 변의 길이는 ${a}cm이다.`, facts: { sides: [a, a, a, a], asked: 'side' } };
              }
              const [a, b] = d.until(() => [d.int(4, 15), d.int(2, 12)], ([x, y]) => x > y);
              const total = 2 * (a + b);
              return {
                text: `네 변의 길이의 합이 ${total}cm인 직사각형의 가로가 ${a}cm일 때, 세로는 몇 cm인가?`,
                inputs: [{ answer: b, unit: 'cm' }],
                explain: `가로 두 변의 길이의 합은 ${expr(a, '+', a, '=', 2 * a)}(cm)이므로 세로 두 변의 길이의 합은 ${expr(total, '-', 2 * a, '=', 2 * b)}(cm)이다. 따라서 세로는 ${b}cm이다.`,
                facts: { sides: [a, b, a, b], asked: 'height' }
              };
            }
          },
          { id: 'rect-grid', level: '실력', title: '크고 작은 직사각형의 수', make: gridRectangles }
        ]
      },
      {
        id: 'mix', title: '평면도형 섞어 풀기', standard: QUADS,
        types: [
          {
            id: 'mix-name', level: '기본', title: '설명에 맞는 도형', count: 2,
            make: (d, n) => {
              const pool = n === 0
                ? [['한 각이 직각인 삼각형', '직각삼각형'], ['네 각이 모두 직각인 사각형', '직사각형'], ['네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형', '정사각형']]
                : [['두 점을 곧게 이은 선', '선분'], ['한 점에서 시작하여 한쪽으로 끝없이 늘인 곧은 선', '반직선'], ['양쪽으로 끝없이 늘인 곧은 선', '직선'], ['한 점에서 그은 두 반직선으로 이루어진 도형', '각']];
              const names = n === 0 ? ['직각삼각형', '직사각형', '정사각형', '삼각형'] : ['선분', '반직선', '직선', '각'];
              const [said, name] = d.pick(pool);
              const options = d.shuffle(names);
              return { text: '다음에서 설명하는 도형은?', figure: `<div class="mb-note">${said}</div>`, choice: { options, answer: options.indexOf(name) }, explain: `${said}${n === 0 ? '은' : name === '각' ? '은' : '은'} ${name}이다.`, facts: { named: name, options }, standard: n === 0 ? QUADS : LINE };
            }
          },
          {
            id: 'mix-pick', level: '기본', title: '도형 고르기', count: 2,
            make: (d, n) => (n === 0
              ? Object.assign(pickOne(d, '다음 중 직각삼각형은?', rightTriangle(d), [plainTriangle(d), plainTriangle(d), plainTriangle(d)], 'rightTriangle', '한 각이 직각인'), { standard: TRIANGLE })
              : pickOne(d, '다음 중 정사각형은?', quad(d, d.pick(['square', 'squareTilt'])), [quad(d, d.pick(['rect', 'rectTilt'])), quad(d, 'rhombus'), quad(d, 'rightTrapezoid')], 'square', '네 각이 모두 직각이고 네 변의 길이가 모두 같은'))
          },
          {
            id: 'mix-corners', level: '기본', title: '직각의 수',
            make: (d) => {
              const pair = d.until(() => [cornerShape(d), cornerShape(d)], ([a, b]) => G.rightAngles(a) + G.rightAngles(b) >= 3 && a.length !== b.length);
              return {
                text: '두 도형에서 찾을 수 있는 직각은 모두 몇 개인가?',
                figure: pair.map((points, i) => tileOf(['가', '나'][i], points)).join(''),
                inputs: [{ answer: G.rightAngles(pair[0]) + G.rightAngles(pair[1]), unit: '개' }],
                explain: `가에 ${G.rightAngles(pair[0])}개, 나에 ${G.rightAngles(pair[1])}개이므로 ` + expr(G.rightAngles(pair[0]), '+', G.rightAngles(pair[1]), '=', G.rightAngles(pair[0]) + G.rightAngles(pair[1])),
                facts: { shapes: pair }, standard: ANGLE
              };
            }
          },
          { id: 'mix-sum', level: '기본', title: '네 변의 길이의 합', count: 2, make: (d, n) => (n === 0 ? squareSum(d) : rectSum(d)) },
          {
            id: 'mix-largest', level: '실력', title: '잘라 만든 가장 큰 정사각형',
            make: (d) => {
              const [a, b] = d.until(() => [d.int(5, 15), d.int(3, 9)], ([x, y]) => x > y);
              return {
                text: `가로가 ${a}cm, 세로가 ${b}cm인 직사각형 모양의 종이를 잘라 가장 큰 정사각형을 만들 때, 만든 정사각형의 네 변의 길이의 합은 몇 cm인가?`,
                inputs: [{ answer: 4 * b, unit: 'cm' }],
                explain: `가장 큰 정사각형의 한 변의 길이는 짧은 변과 같은 ${b}cm이다. ` + expr(b, '+', b, '+', b, '+', b, '=', 4 * b),
                facts: { sides: [b, b, b, b], paper: [a, b] }
              };
            }
          },
          {
            id: 'mix-wire', level: '실력', title: '철사로 만든 정사각형',
            make: (d) => {
              const a = d.int(4, 9), rest = d.int(3, 19), total = 4 * a + rest;
              return {
                text: `길이가 ${total}cm인 철사를 사용하여 한 변의 길이가 ${a}cm인 정사각형을 1개 만들었다. 남은 철사의 길이는 몇 cm인가?`,
                inputs: [{ answer: rest, unit: 'cm' }],
                explain: `정사각형의 네 변의 길이의 합은 ${expr(a, '+', a, '+', a, '+', a, '=', 4 * a)}(cm)이다. ` + expr(total, '-', 4 * a, '=', rest),
                facts: { wire: [total, a] }
              };
            }
          },
          { id: 'mix-cut', level: '실력', title: '잘라서 생기는 직각삼각형', make: (d) => Object.assign(cutPaper(d, d.pick(['halves', 'roof', 'corner'])), { standard: TRIANGLE }) },
          { id: 'mix-grid', level: '실력', title: '크고 작은 직사각형의 수', make: gridRectangles }
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
