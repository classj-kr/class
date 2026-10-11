// 3학년 1학기 2단원 평면도형 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(40개 문서)에 나온
// 문제 꼴 85개와, 기본 자료의 꼴 가운데 어렵다고 표시된 것을 하나씩 따져 고른 것이다. 꼴과 조건은 그 문제를 따르고 그림과 수만 바꾼다.
//
// 고른 기준
//  - 정의를 그대로 대면 풀리는 문제는 기본 문항으로 보냈다(3-1-2a.js).
//  - 그림만 다르거나 말만 다른 꼴은 한 번만 싣는다.
//  - 서술형(까닭 쓰기, 설명 고쳐 쓰기)과 그리기 문제는 싣지 않는다.
//  - 수집본에 3학년 심화로 실려 있다는 것은 3학년 내용이라는 근거가 아니다. 문제마다 「이것은 몇 학년 무슨 단원의 내용인가」를 따져 뺐다.
//  - 아래는 뺐다.
//      5학년 「다각형의 둘레와 넓이」에 해당하는 것: 정사각형을 이어 붙인 직사각형의 네 변의 길이의 합, 크기가 다른 정사각형을
//        이어 붙인 도형에서 선분의 길이 구하기, 네 변의 길이의 합(둘레)이 조건으로 나오는 문제 모두
//      중학교 2학년 「경우의 수」에 해당하는 것: 크고 작은 각·직각삼각형·직사각형·정사각형의 수, 점을 이어 그을 수 있는 선분의 수
//      (정사각형을 직사각형으로 세는 것은 4학년 것이 아니다. 「네 각이 모두 직각인 사각형」이라는 3학년의 뜻을 그대로 대면 된다.
//       다만 「조각 중 직사각형은 몇 개, 그중 정사각형은 몇 개」는 「그중」이 답을 흘려서 모눈종이 꼴 하나만 싣는다.)
//      5학년 「약수와 배수」 유형: 직사각형 종이로 만들 수 있는 가장 큰 정사각형
//      뒤 단원 것이 있어야 풀리는 것(나눗셈은 3단원): 네 변의 길이의 합으로 한 변 구하기, 네 변의 합이 같은 직사각형과 정사각형,
//        네 변의 합과 한 변으로 직사각형의 다른 변 구하기, 철사로 만들 수 있는 정사각형의 수, 종이에서 잘라 낼 수 있는 정사각형의 수
//      뒤 학년 것: 변에 직각인 선을 그어 나누기(4학년 수직), 직사각형·정사각형의 포함 관계를 따지는 말 가리기
//      도형의 뜻보다 경우 따지기·퍼즐이 어려움의 대부분인 것: 점 다섯 개로 그을 수 있는 선분·각의 수, 한 줄 위 세 점의 반직선,
//        점 종이에 그릴 수 있는 정사각형의 가짓수, 표시가 하나씩 들어가게 나누기, 여러 번 접어 자르기, 「~이 아닌 ~」 말 잇기,
//        글자·칠교 모양에서 직각 세기(획이 만나는 곳을 세는 기준이 자료마다 다르다)
// 실력 문항의 잣대(2026-10-12 사용자가 보여 준 두 문제): 어려움은 이 단원에서 배운 뜻을 정확히 아는가에서 나와야 한다.
//   반직선은 시작점부터 읽는다, 각은 두 반직선으로 이루어진다 → 한 변 위에 점을 하나 더 찍어도 같은 각(그림에 함정을 넣는다), 네 각이 직각이면 직사각형이다 → 정사각형과 비스듬한 도형까지 세기.
//   계산 단계를 늘리거나 뒤 학년 내용을 끌어와 어렵게 만들지 않는다.
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
      H('h-sides', '한 변 위에 점이 둘 있는 각', '각 그림에 붙은 설명 가리기(기본 자료 9문서) — 한 변 위에 점을 하나 더 찍어, 점의 자리와 각을 가리게', (d) => {
        // 각은 꼭짓점에서 시작하는 두 반직선으로 이루어진다. 한 변 위에 점이 둘(가까운 점, 먼 점) 있어도 각은 하나다.
        // 함정: 멀리 찍힌 점으로 읽은 각이 더 커 보인다. 변의 이름을 끝 점부터 읽은 것도 섞는다.
        const [near, far] = d.shuffle(['ㄷ', 'ㄹ']), flip = d.bool(), Y = (y) => (flip ? 4 - y : y);
        const V = [0.7, Y(2.3)], A = [0.7 + 3 * 0.8, Y(2.3 - 1.9 * 0.8)], N1 = [0.7 + 4.6 * 0.42, Y(2.3 + 1.1 * 0.42)], F = [0.7 + 4.6, Y(2.3 + 1.1)];
        // 함정 둘: ① 점이 다르면 다른 각이라고 여기면 「똑같은 도형이다」를 틀렸다고 고른다(「같은 각」이라고 쓰지 않는다 — 사용자 지시).
        //          ② 변을 각의 이름을 읽는 차례대로(ㄱㄴ, ㄴㄷ) 적어 놓아 맞는 말처럼 보인다(반직선 ㄱㄴ은 점 ㄱ에서 시작한다).
        const read = d.pick([near, far]);
        const rows = d.shuffle([
          { text: `점 ㄴ은 각 ㄱㄴ${near}의 꼭짓점이다.`, claim: ['vertex', `ㄱㄴ${near}`, 'ㄴ'] },
          { text: `각 ㄱㄴ${near}과 각 ㄱㄴ${far}은 똑같은 도형이다.`, claim: ['sameAngle', `ㄱㄴ${near}`, `ㄱㄴ${far}`] },
          { text: `각 ㄱㄴ${read}의 두 변은 반직선 ㄱㄴ, 반직선 ㄴ${read}이다.`, claim: ['sides', `ㄱㄴ${read}`, ['ㄱㄴ', 'ㄴ' + read]] },
          { text: `반직선 ㄴ${near}과 반직선 ㄴ${far}은 같다.`, claim: ['sameRay', 'ㄴ' + near, 'ㄴ' + far] }
        ]);
        const wrong = rows.findIndex((row) => row.claim[0] === 'sides');
        return C('그림에 대한 설명으로 옳지 않은 것은?', rows.map((row) => row.text), wrong, {
          figure: G.board(6, 4, [G.rays(V, [A, F], ['ㄴ', 'ㄱ', far]), G.point(N1), G.text([N1[0] - 0.1, N1[1] + (flip ? -0.55 : 0.55)], near)], { grid: false, scale: 1.25 }),
          explain: `각의 변은 각의 꼭짓점에서 시작하는 반직선이다. 반직선 ㄱㄴ은 점 ㄱ에서 시작하므로 각의 변이 아니다. 각 ㄱㄴ${read}의 두 변은 반직선 ㄴㄱ, 반직선 ㄴ${read}이다. 점 ${near}과 점 ${far}은 점 ㄴ에서 시작하는 한 반직선 위에 있으므로 반직선 ㄴ${near}과 반직선 ㄴ${far}은 같고, 각 ㄱㄴ${near}과 각 ㄱㄴ${far}도 똑같은 도형이다.`,
          facts: { angleTalk: { vertex: 'ㄴ', sides: [['ㄱ'], [near, far]], claims: rows.map((row) => row.claim) } }
        });
      }, { standard: ANGLE }),
      H('h-drawn', '길게 그린 선분과 짧게 그린 직선', '선의 뜻·성질을 말한 문장 가리기(심화·기본 자료) — 그려진 길이에 속지 않고 뜻으로 가리게', (d) => {
        // 그림은 선분을 길게, 직선을 짧게 그린다. 보기마다 걸리는 오개념이 다르다.
        const [seg, lin] = d.pick([[['ㄱ', 'ㄴ'], ['ㄷ', 'ㄹ']], [['ㄷ', 'ㄹ'], ['ㄱ', 'ㄴ']]]), top = d.bool();
        const rows = d.shuffle([
          { text: `선분 ${seg.join('')}은 직선 ${lin.join('')}보다 길다.`, ok: false },                                         // 그려진 길이로 판단
          { text: `직선 ${lin.join('')}은 점 ${lin[0]}에서 시작하여 점 ${lin[1]}에서 끝난다.`, ok: false },                     // 직선과 선분을 구별하지 못함
          { text: `직선 ${lin.join('')}은 선분 ${lin.join('')}을 양쪽으로 끝없이 늘인 곧은 선이다.`, ok: true },
          { text: `선분 ${seg.join('')}을 더 길게 그리면 직선 ${seg.join('')}이 된다.`, ok: false }                             // 길면 직선
        ]);
        const ySeg = top ? 0.8 : 2.4, yLin = top ? 2.4 : 0.8;
        return C('그림에 대한 설명으로 옳은 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
          figure: G.board(9, 3, [G.straight('segment', [0.6, ySeg], [8.4, ySeg], seg), G.straight('line', [3.4, yLin], [5.4, yLin], lin)], { grid: false }),
          explain: `직선은 양쪽으로 끝없이 늘인 곧은 선이므로 시작하는 점과 끝나는 점이 없고, 그림에 그려진 길이로 선분과 비교할 수 없다. 선분은 두 점을 곧게 이은 선이므로 길게 그려도 선분이다.`,
          facts: { truth: rows.map((row) => row.ok), want: true, drawn: { segment: [0.6, 8.4], line: [3.4, 5.4] } }
        });
      }, { standard: LINE }),
      H('h-corner', '한 꼭짓점에 모인 각 가운데 직각 가리기', '도형의 성질을 말한 문장 가리기(심화 자료 여러 출판사) — 각을 정확히 읽어야 가릴 수 있게', (d) => {
        // 직사각형 ㄱㄴㄷㄹ에 선분 ㄱㄷ을 그었다. 각 ㄴㄱㄹ은 직각이지만 각 ㄴㄱㄷ은 직각이 아니다.
        const w = d.pick([5, 6]), points = { ㄱ: [0.5, 0.5], ㄴ: [0.5, 3.5], ㄷ: [0.5 + w, 3.5], ㄹ: [0.5 + w, 0.5] };
        const rows = d.shuffle([{ kind: 'triangle', names: d.pick(['ㄱㄴㄷ', 'ㄱㄷㄹ']) }, { kind: 'angle', names: d.pick(['ㄱㄴㄷ', 'ㄱㄹㄷ']) }, { kind: 'angle', names: d.pick(['ㄴㄱㄹ', 'ㄴㄷㄹ']) }, { kind: 'angle', names: d.pick(['ㄴㄱㄷ', 'ㄱㄷㄴ', 'ㄹㄱㄷ', 'ㄱㄷㄹ']), bad: true }]);
        const say = (row) => (row.kind === 'triangle' ? `삼각형 ${row.names}은 직각삼각형이다.` : `각 ${row.names}은 직각이다.`), bad = rows.find((row) => row.bad);
        return C('직사각형 ㄱㄴㄷㄹ에 선분 ㄱㄷ을 그었다. 그림에 대한 설명으로 옳지 않은 것은?', rows.map(say), rows.indexOf(bad), {
          figure: G.board(w + 1, 4, [G.polygon(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'].map((n) => points[n]), 'mb-poly is-plain'), G.line(points.ㄱ, points.ㄷ),
            G.text([0.1, 0.2], 'ㄱ'), G.text([0.1, 3.8], 'ㄴ'), G.text([w + 0.9, 3.8], 'ㄷ'), G.text([w + 0.9, 0.2], 'ㄹ')], { grid: false, scale: 1.3 }),
          explain: `각 ${bad.names}은 선분 ㄱㄷ이 직사각형의 한 각을 둘로 나눈 것 가운데 하나이므로 직각이 아니다. 직각인 것은 직사각형의 네 각 ㄴㄱㄹ, ㄱㄴㄷ, ㄴㄷㄹ, ㄱㄹㄷ이다.`,
          facts: { cornerClaims: { points, rows: rows.map((row) => [row.kind, row.names]) } }
        });
      }, { standard: RTRI }),
      H('h-rect-count', '모눈종이에 그린 도형 가운데 직사각형 세기', '직사각형 찾기(기본 자료 모든 출판사) — 정사각형과 비스듬히 놓인 도형까지 뜻으로 가려야 하게', (d) => {
        // 정사각형, 세로로 긴 것, 가로로 긴 것, 비스듬한 정사각형, 비스듬한 직사각형 / 평행사변형 모양, 사다리꼴 모양, 네 변이 같지만 직각이 아닌 것
        const RECT = [[[0, 1], [2, 1], [2, 3], [0, 3]], [[0, 0], [1, 0], [1, 4], [0, 4]], [[0, 1], [3, 1], [3, 3], [0, 3]], [[0, 2], [2, 0], [4, 2], [2, 4]], [[1, 0], [4, 3], [3, 4], [0, 1]]];
        const OTHER = [[[0, 1], [3, 1], [4, 3], [1, 3]], [[1, 1], [3, 1], [4, 3], [0, 3]], [[0, 2], [2, 1], [4, 2], [2, 3]]];
        const count = d.int(2, 4);
        const picks = d.until(() => d.shuffle(d.shuffle(RECT).slice(0, count).concat(d.shuffle(OTHER).slice(0, 4 - count))), (list) => list.includes(RECT[0]) || list.includes(RECT[3]));
        // 휴대폰에서도 모눈이 또렷하게 두 줄로 놓는다(한 줄에 두 개).
        const placed = picks.map((shape, i) => shape.map(([px, py]) => [px + (i % 2) * 5, py + Math.floor(i / 2) * 5]));
        return N('모눈종이에 그린 사각형 4개 중 직사각형은 모두 몇 개인가?', count, {
          unit: '개', figure: G.board(9, 9, placed.map((shape) => G.polygon(shape, 'mb-poly is-plain')), { grid: 'lines' }),
          explain: `네 각이 모두 직각인 사각형이 직사각형이다. 정사각형도 네 각이 모두 직각이므로 직사각형이고, 비스듬히 놓여 있어도 네 각이 모두 직각이면 직사각형이다. 직사각형은 ${count}개이다.`,
          facts: { rectCount: placed }
        });
      }, { standard: QUAD }),
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

    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
