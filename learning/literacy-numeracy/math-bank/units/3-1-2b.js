// 3학년 1학기 2단원 평면도형 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(40개 문서)에 나온
// 문제 꼴 85개와, 기본 자료의 꼴 가운데 어렵다고 표시된 것을 하나씩 따져 고른 것이다. 꼴과 조건은 그 문제를 따르고 그림과 수만 바꾼다.
//
// 고른 기준
//  - 정의를 그대로 대면 풀리는 문제는 기본 문항으로 보냈다(3-1-2a.js).
//  - 그림만 다르거나 말만 다른 꼴은 한 번만 싣는다(크고 작은 정사각형 세기는 직사각형 세기와 같은 꼴로 본다).
//  - 서술형(까닭 쓰기, 설명 고쳐 쓰기)과 그리기 문제는 싣지 않는다.
//  - 아래는 뺐다.
//      뒤 단원 것이 있어야 풀리는 것(나눗셈은 3단원): 네 변의 길이의 합으로 한 변 구하기, 네 변의 합이 같은 직사각형과 정사각형,
//        네 변의 합과 한 변으로 직사각형의 다른 변 구하기, 철사로 만들 수 있는 정사각형의 수, 종이에서 잘라 낼 수 있는 정사각형의 수
//      뒤 학년 것: 변에 직각인 선을 그어 나누기(4학년 수직), 직사각형·정사각형의 포함 관계를 따지는 말 가리기
//      도형의 뜻보다 경우 따지기·퍼즐이 어려움의 대부분인 것: 점 다섯 개로 그을 수 있는 선분·각의 수, 한 줄 위 세 점의 반직선,
//        점 종이에 그릴 수 있는 정사각형의 가짓수, 표시가 하나씩 들어가게 나누기, 여러 번 접어 자르기, 「~이 아닌 ~」 말 잇기,
//        글자·칠교 모양에서 직각 세기(획이 만나는 곳을 세는 기준이 자료마다 다르다)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, expr, N, M, C } = B.kit;
  const G = B.kit.geo;
  const LINE = '4수03-01', ANGLE = '4수03-02', RTRI = '4수03-09', QUAD = '4수03-10';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';
  const NUMBERED = ['①', '②', '③', '④', '⑤', '⑥'];

  B.addGroup('3-1-2', {
    id: 'hard', title: '실력 문제', standard: QUAD,
    types: [
      H('h-segments', '점을 이어 그을 수 있는 선분의 수', 'YBM 단원심화평가·수학익힘 심화 · 미래엔·지학사 단원평가 심화', (d) => {
        // 한 줄에 놓이지 않은 점 4개 → 선분 6개
        const lattice = []; for (let x = 0; x <= 6; x += 1) for (let y = 0; y <= 3; y += 1) lattice.push([x, y]);
        const points = d.until(() => d.shuffle(lattice).slice(0, 4).sort((p, q) => p[0] - q[0] || p[1] - q[1]), (list) => {
          for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) {
            if (Math.abs(list[i][0] - list[j][0]) + Math.abs(list[i][1] - list[j][1]) < 3) return false;
            for (let k = j + 1; k < 4; k += 1) if (G.cross(G.sub(list[j], list[i]), G.sub(list[k], list[i])) === 0) return false;
          }
          return true;
        });
        const names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
        return N('점 4개 중 두 점을 이어 그을 수 있는 선분은 모두 몇 개인가?', 6, {
          unit: '개', figure: G.board(6, 4, points.map((p, i) => G.point([p[0], p[1] + 0.6]) + G.text([p[0], p[1] + 0.05], names[i])), { grid: false, scale: 1.4 }),
          explain: `점 ㄱ에서 그을 수 있는 선분이 3개, 점 ㄴ에서 새로 그을 수 있는 선분이 2개, 점 ㄷ에서 새로 그을 수 있는 선분이 1개이다. ${expr(3, '+', 2, '+', 1, '=', 6)}`,
          facts: { choose2: points }
        });
      }, { standard: LINE }),
      H('h-angles', '크고 작은 각의 수', 'YBM 단원심화평가·수학익힘 심화 · 디딤돌 서술형 · 미래엔 단원평가 심화', (d) => {
        // 한 점에서 그은 반직선 4개 → 3+2+1=6
        const DIRS = [[5, 0], [5, -1], [5, -2], [4, -3], [3, -3], [3, -4], [2, -4], [1, -4], [0, -4]];
        const dirs = d.until(() => d.shuffle(DIRS).slice(0, 4).sort((a, b) => Math.atan2(-a[1], a[0]) - Math.atan2(-b[1], b[0])), (list) => list.every((a, i) => i === 0 || (() => { const b = list[i - 1], dot = a[0] * b[0] + a[1] * b[1]; return (dot * dot) / ((a[0] * a[0] + a[1] * a[1]) * (b[0] * b[0] + b[1] * b[1])) < 0.9; })()));
        const V = [0.8, 5.2], ends = dirs.map((u) => [V[0] + u[0], V[1] + u[1]]);
        return N('도형에서 찾을 수 있는 크고 작은 각은 모두 몇 개인가?', 6, {
          unit: '개', figure: G.board(7, 6, [G.rays(V, ends, ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'])], { grid: false, scale: 1.3 }),
          explain: `작은 각 1개로 된 각이 3개, 작은 각 2개로 된 각이 2개, 작은 각 3개로 된 각이 1개이다. ${expr(3, '+', 2, '+', 1, '=', 6)}`,
          facts: { rayAngles: dirs }
        });
      }, { standard: ANGLE }),
      H('h-time', '조건에 맞는 시각', 'YBM·디딤돌·지학사 단원평가 심화', (d) => {
        // 긴바늘이 12, 두 바늘이 직각, 6시와 12시 사이 → 9시
        const answer = d.pick([3, 9]), lo = answer === 3 ? d.int(1, 2) : d.int(4, 8), hi = answer === 3 ? d.int(4, 8) : d.int(10, 12);
        return N('다음 조건을 모두 만족하는 시각은 몇 시인가?', answer, {
          unit: '시', figure: conditions(['긴바늘이 12를 가리킨다.', '긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 직각이다.', `${lo}시와 ${hi}시 사이의 시각이다.`]),
          explain: `긴바늘이 12를 가리키고 두 바늘이 직각을 이루는 시각은 3시와 9시이다. 그중 ${lo}시와 ${hi}시 사이의 시각은 ${answer}시이다.`,
          facts: { time: { lo, hi } }
        });
      }, { standard: ANGLE }),
      H('h-named', '겹친 그림에서 직각삼각형 가리기', 'YBM 수학익힘 심화 · 미래엔 단원평가 심화', (d) => {
        // 직각삼각형 ㄱㄴㄷ의 긴 변 위의 점 ㄹ, 밑변 위의 점 ㅁ. 선분 ㄴㄹ과 ㄹㅁ을 긋는다.
        const m = d.pick([4, 6]), flip = d.bool(), X = (x) => (flip ? 8 - x : x);
        const points = { ㄱ: [X(0), 0], ㄴ: [X(0), 4], ㄷ: [X(8), 4], ㄹ: [X(m), m / 2], ㅁ: [X(m), 4] };
        const P = (name) => points[name], tri = (names) => names.split('').map(P);
        const list = d.shuffle(['ㄱㄴㄷ', 'ㄹㅁㄷ', 'ㄴㄹㅁ', 'ㄴㄹㄷ']);
        const side = flip ? 1 : -1;
        const figure = G.board(8, 5, [G.polygon(tri('ㄱㄴㄷ'), 'mb-poly is-plain'), G.line(P('ㄴ'), P('ㄹ')), G.line(P('ㄹ'), P('ㅁ')),
          G.text([P('ㄱ')[0] + side * 0.45, 0.1], 'ㄱ'), G.text([P('ㄴ')[0] + side * 0.45, 4.25], 'ㄴ'), G.text([P('ㄷ')[0] - side * 0.5, 4.25], 'ㄷ'),
          G.text([P('ㄹ')[0] - side * 0.35, P('ㄹ')[1] - 0.5], 'ㄹ'), G.text([P('ㅁ')[0], 4.6], 'ㅁ')], { grid: false, scale: 1.4 });
        return C('직각삼각형이 아닌 것은?', list.map((names) => '삼각형 ' + names), list.indexOf('ㄴㄹㄷ'), {
          figure, explain: '삼각형 ㄱㄴㄷ은 각 ㄱㄴㄷ이, 삼각형 ㄹㅁㄷ과 삼각형 ㄴㄹㅁ은 점 ㅁ에 있는 각이 직각이다. 삼각형 ㄴㄹㄷ에는 직각이 없다.',
          facts: { named: { points, options: list } }
        });
      }, { standard: RTRI }),
      H('h-rtris', '크고 작은 직각삼각형의 수', 'YBM·동아·미래엔·비상·아이스크림·지학사 단원평가 심화 · 디딤돌 서술형', (d) => {
        // 사각형의 마주 보는 꼭짓점을 이은 선분 2개
        const [w, h] = d.pick([[4, 4], [6, 4]]), square = w === h;
        const nodes = [[0, 0], [w, 0], [w, h], [0, h], [w / 2, h / 2]];
        const figure = G.board(w, h, [G.polygon(nodes.slice(0, 4), 'mb-poly is-plain'), G.line(nodes[0], nodes[2]), G.line(nodes[1], nodes[3])], { grid: false, scale: 1.4 });
        return N(`${square ? '정사각형' : '직사각형'}에 선분 2개를 그었다. 도형에서 찾을 수 있는 크고 작은 직각삼각형은 모두 몇 개인가?`, square ? 8 : 4, {
          unit: '개', figure,
          explain: square ? `가장 작은 삼각형 4개가 모두 직각삼각형이고, 작은 삼각형 2개를 붙인 직각삼각형이 4개 있다. ${expr(4, '+', 4, '=', 8)}` : '작은 삼각형 2개를 붙인 삼각형 4개가 직각삼각형이다. 가장 작은 삼각형 4개에는 직각이 없다.',
          facts: { lattice: { nodes, lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4, 2], [1, 4, 3]] } }
        });
      }, { standard: RTRI }),
      H('h-pieces', '자른 조각 가운데 직사각형과 정사각형', '미래엔·천재 단원평가 심화', (d) => {
        // 정사각형도 직사각형으로 센다.
        const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
        const pieces = d.pick([
          [box(0, 0, 2, 2), [[2, 0], [6, 0], [6, 2]], [[2, 0], [6, 2], [2, 2]], box(0, 2, 3, 4), box(3, 2, 5, 4), box(5, 2, 6, 4)],
          [box(0, 0, 4, 1), box(0, 1, 3, 4), box(3, 1, 4, 4), box(4, 0, 6, 2), [[4, 2], [6, 2], [6, 4]], [[4, 2], [6, 4], [4, 4]]]
        ]);
        const center = (points) => [points.reduce((s, p) => s + p[0], 0) / points.length, points.reduce((s, p) => s + p[1], 0) / points.length];
        const rects = pieces.filter((p) => G.isRectangle(p)).length, squares = pieces.filter((p) => G.isSquare(p)).length;
        return M('직사각형 모양의 종이를 선을 따라 모두 잘랐다. 잘라 낸 조각 중 직사각형은 모두 몇 개이고, 그중 정사각형은 몇 개인가?', [{ label: '직사각형', answer: rects, unit: '개' }, { label: '정사각형', answer: squares, unit: '개' }], {
          figure: G.board(6, 4, pieces.map((points, i) => G.polygon(points) + G.text(center(points), NUMBERED[i], 'mb-label is-small')), { grid: false, scale: 1.5 }),
          explain: `네 각이 모두 직각인 조각은 ${pieces.map((p, i) => (G.isRectangle(p) ? NUMBERED[i] : '')).filter(Boolean).join(', ')}이다. 정사각형도 직사각형이다. 그중 네 변의 길이가 모두 같은 조각은 ${pieces.map((p, i) => (G.isSquare(p) ? NUMBERED[i] : '')).filter(Boolean).join(', ')}이다.`,
          facts: { pieces }
        });
      }),
      H('h-bigsquare', '직사각형에서 만들 수 있는 가장 큰 정사각형', 'YBM 수학익힘 심화 · 동아·천재 단원평가 심화', (d) => {
        const b = d.int(6, 14), a = b + d.int(3, 9);
        const figure = G.board(8, 4, [G.polygon([[2, 0.6], [6.5, 0.6], [6.5, 3.4], [2, 3.4]]), G.text([4.25, 0.12], a + ' cm', 'mb-label is-length'), G.text([1, 2], b + ' cm', 'mb-label is-length')], { grid: false, scale: 1.2 });
        return N(`가로가 ${a}cm, 세로가 ${b}cm인 직사각형 모양의 종이를 잘라 정사각형을 만들려고 한다. 만들 수 있는 가장 큰 정사각형의 한 변의 길이는 몇 cm인가?`, b, {
          unit: 'cm', figure, explain: `정사각형은 네 변의 길이가 모두 같으므로, 한 변의 길이는 직사각형의 짧은 변인 ${b}cm를 넘을 수 없다.`, facts: { bigSquare: [a, b] }
        });
      }),
      H('h-rects', '크고 작은 직사각형의 수', 'YBM·동아·미래엔·천재 단원평가 심화 · 디딤돌 서술형', (d) => {
        // 한 줄 3칸 → 3+2+1=6, 2줄 2칸 → 4+4+1=9
        const [rows, cols] = d.pick([[1, 3], [2, 2]]), cw = cols === 3 ? 2 : 3, ch = rows === 1 ? 3 : 2;
        const parts = [G.polygon([[0, 0], [cols * cw, 0], [cols * cw, rows * ch], [0, rows * ch]], 'mb-poly is-plain')];
        for (let c = 1; c < cols; c += 1) parts.push(G.line([c * cw, 0], [c * cw, rows * ch]));
        for (let r = 1; r < rows; r += 1) parts.push(G.line([0, r * ch], [cols * cw, r * ch]));
        const total = (rows * (rows + 1) / 2) * (cols * (cols + 1) / 2);
        return N('도형에서 찾을 수 있는 크고 작은 직사각형은 모두 몇 개인가?', total, {
          unit: '개', figure: G.board(cols * cw, rows * ch, parts, { grid: false, scale: 1.3 }),
          explain: rows === 1 ? `작은 직사각형 1개로 된 것이 3개, 2개로 된 것이 2개, 3개로 된 것이 1개이다. ${expr(3, '+', 2, '+', 1, '=', 6)}` : `작은 직사각형 1개로 된 것이 4개, 2개로 된 것이 4개, 4개로 된 것이 1개이다. ${expr(4, '+', 4, '+', 1, '=', 9)}`,
          facts: { gridRects: [rows, cols] }
        });
      }),
      H('h-joined', '같은 정사각형을 이어 붙인 직사각형', '미래엔 단원평가 심화 · 비상 실력 문제·차시별 심화 · 천재 서술형', (d) => {
        // 한 변 6 cm인 정사각형 2개 → 6+12+6+12=36
        const s = d.int(4, 9), k = d.pick([2, 3]), long = s * k;
        const parts = [G.polygon([[0.5, 0.8], [0.5 + 2 * k, 0.8], [0.5 + 2 * k, 2.8], [0.5, 2.8]])];
        for (let i = 1; i < k; i += 1) parts.push(G.line([0.5 + 2 * i, 0.8], [0.5 + 2 * i, 2.8], 'mb-line is-thin'));
        parts.push(G.text([1.5, 0.35], s + ' cm', 'mb-label is-length'));
        return N(`한 변의 길이가 ${s}cm인 정사각형 ${k}개를 겹치지 않게 한 줄로 이어 붙여 직사각형을 만들었다. 이 직사각형의 네 변의 길이의 합은 몇 cm인가?`, long + s + long + s, {
          unit: 'cm', figure: G.board(2 * k + 1, 3, parts, { grid: false, scale: 1.4 }),
          explain: `직사각형의 긴 변은 ${k === 2 ? expr(s, '+', s, '=', long) : expr(s, '+', s, '+', s, '=', long)}(cm), 짧은 변은 ${s}cm이다. ${expr(long, '+', s, '+', long, '+', s, '=', long + s + long + s)}`,
          facts: { joined: [s, k] }
        });
      }),
      H('h-two', '크기가 다른 정사각형을 이어 붙인 도형', 'YBM 단원심화평가 · 디딤돌·미래엔·지학사 서술형', (d) => {
        // 작은 정사각형의 한 변 7 cm, 두 정사각형의 밑변을 이은 길이 19 cm → 큰 정사각형 12 cm → 어긋난 선분 5 cm
        const a = d.int(5, 9), b = a + d.int(3, 8), total = a + b, scale = 8 / total;
        const A = a * scale, Bg = b * scale, X = 1.9, Y = 0.4;
        const P = { ㄱ: [X, Y + Bg - A], ㄴ: [X, Y + Bg], ㄷ: [X + A, Y + Bg], ㄹ: [X + A, Y + Bg - A], ㅁ: [X + A, Y], ㅂ: [X + A + Bg, Y], ㅅ: [X + A + Bg, Y + Bg] };
        const figure = G.board(11, Math.ceil(Bg + 1.7), [
          G.polygon([P.ㄱ, P.ㄴ, P.ㄷ, P.ㄹ]), G.polygon([P.ㅁ, P.ㄷ, P.ㅅ, P.ㅂ]),
          G.text([P.ㄱ[0] - 0.3, P.ㄱ[1] - 0.3], 'ㄱ'), G.text([P.ㄴ[0] - 0.3, P.ㄴ[1] + 0.35], 'ㄴ'), G.text([P.ㄷ[0], P.ㄷ[1] + 0.4], 'ㄷ'), G.text([P.ㄹ[0] - 0.35, P.ㄹ[1] - 0.3], 'ㄹ'),
          G.text([P.ㅁ[0] - 0.35, P.ㅁ[1] + 0.05], 'ㅁ'), G.text([P.ㅂ[0] + 0.35, P.ㅂ[1] + 0.05], 'ㅂ'), G.text([P.ㅅ[0] + 0.35, P.ㅅ[1] + 0.2], 'ㅅ'),
          G.text([X - 1.05, Y + Bg - A / 2], a + ' cm', 'mb-label is-length'), G.text([X + (A + Bg) / 2, Y + Bg + 1], total + ' cm', 'mb-label is-length')
        ], { grid: false, scale: 1.2 });
        return N(`크기가 다른 정사각형 2개를 겹치지 않게 이어 붙였다. 선분 ㄱㄴ의 길이가 ${a}cm, 선분 ㄴㅅ의 길이가 ${total}cm일 때, 선분 ㅁㄹ의 길이는 몇 cm인가?`, b - a, {
          unit: 'cm', figure,
          explain: `작은 정사각형의 한 변이 ${a}cm이므로 선분 ㄴㄷ도 ${a}cm이다. 큰 정사각형의 한 변은 ${expr(total, '-', a, '=', b)}(cm)이므로 선분 ㅁㄷ은 ${b}cm이다. 선분 ㄹㄷ이 ${a}cm이므로 ${expr(b, '-', a, '=', b - a)}`,
          facts: { twoSquares: [a, total] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
