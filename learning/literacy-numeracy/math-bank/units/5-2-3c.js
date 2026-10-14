// 5학년 2학기 3단원 합동과 대칭 — 실력 문항.
// 단원 틀과 판정·그림 도구(B.kit.sym523)는 5-2-3a.js, 5-2-3b.js 에 있다. 대조표는 수집본의 _분석/5-2-3/싣기_대조표.md.
// ref: 숫자만 적은 것은 심화꼴의 번호, 「기본 ①n」은 기본꼴_1의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 모양이 같으면 합동이라고 여긴다(크기가 다른 도형). 넓이나 둘레가 같으면 합동이라고 여긴다. 뒤집어야 겹치는 도형은 합동이 아니라고 여긴다.
//  - 놓인 자리가 같은 변끼리 대응변이라고 여긴다(돌려 놓거나 겹쳐 놓은 도형에서 아래쪽 변끼리, 왼쪽 변끼리 짝을 짓는다).
//  - 똑같은 두 조각으로 나누는 선이면 대칭축이라고 여긴다(직사각형·평행사변형의 대각선). 평행사변형을 선대칭도형이라고 여긴다.
//  - 대칭축은 세로나 가로로만 놓인다고 여겨 비스듬한 대칭축을 놓친다. 직사각형과 마름모의 대칭축을 4개로 센다.
//  - 접어서 겹치는 것(선대칭)과 180° 돌려서 겹치는 것(점대칭)을 섞는다: 이등변삼각형·정오각형을 점대칭도형으로, N·S·Z 꼴을 선대칭도형으로 본다.
//  - 반쪽을 완성한 도형의 둘레에 대칭축 위의 선분까지 더한다. 점대칭도형을 완성할 때 맞닿아 안쪽이 되는 부분을 둘레에 넣는다.
//
// 실력 문항의 잣대: 두 가지만 둔다. 어느 쪽이든 도형 영역의 금 안에 있다(각도를 이어 셈하는 문제는 싣지 않는다).
//  ① 문제의 상황·그림에 함정이 있어 뜻을 정확히 대야 풀리는 문제(되도록 보기 없이 수로 답한다. 어려움은 보기가 아니라 그림에서 나온다)
//     - 크기만 다른 도형·뒤집어야 겹치는 도형을 섞어 놓고 합동인 도형 세기, 넓이는 같지만 합동이 아닌 조각, 「항상 합동인가」
//     - 겹쳐 놓은 두 합동 삼각형에서 대응변 찾기(자리가 같은 변이 대응변이 아니다)
//     - 비스듬한 대칭축을 가진 도형과 평행사변형을 섞어 놓고 선대칭도형 세기, 대칭축이 2개인 도형 세기(직사각형·마름모는 2개, 마름모처럼 세워 놓은 정사각형은 4개)
//     - 점대칭도형이지만 선대칭도형은 아닌 것 세기(도형, 글자), 점대칭 모양인 숫자만 골라 가장 큰 수 만들기, 도형의 이름만 보고 가르기
//     - 대칭축이 둘이고 점대칭이기도 한 도형에서 대응변이 될 수 없는 변
//  ② 두 번 넘게 생각해야 풀리는 문제(길이를 대응변·대칭축·대칭의 중심으로 두 번 넘게 옮기거나, 옮긴 뒤 거꾸로 구한다)
//     - 둘레를 알 때 대칭축이 나눈 선분, 둘레를 알 때 점대칭도형의 한 변, 두 대각선의 길이의 합에서 대칭의 중심까지의 거리
//     - 반쪽만 준 선대칭도형의 둘레(대칭축 위의 선분은 둘레가 아니다)·넓이, 삼각형을 180° 돌려 붙인 점대칭도형의 둘레(맞닿은 부분은 둘레가 아니다)
//     - 한 직선 위에 맞닿은 두 합동 삼각형으로 된 사각형의 둘레, 접은 직사각형 종이의 둘레
// 기본에서 이미 하는 일(대응변 한 번 읽기, 선대칭도형 고르기)을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 실력이 아니므로 싣지 않았다.
//
// 뺀 것과 까닭(실력 쪽)
//  - 각도를 이어 셈하는 것(49~53·56·59·60): 한 변을 함께 쓰는 합동 삼각형의 각, 이등변삼각형인 합동 삼각형의 밑각, 이어지거나 겹친 합동 삼각형의 사이 각, 접은 종이의 각,
//    선대칭·점대칭에서 직선 위의 각이나 이등변삼각형을 거쳐 구하는 각 — 측정(각도)의 셈이고 중학교 꼴이다. 대응각을 한 번 옮기고 세 각(네 각)의 합을 한 번 쓰는 것(47·48·54·55·57·58)은 기본에 실었다.
//  - 넓이 셈이 대부분인 것(34의 사다리꼴 넓이, 40·41·45의 사다리꼴·삼각형 넓이를 구해 2배 하기, 46 넓이에서 거꾸로 모눈 한 칸의 길이): 모눈 칸을 세어 2배 하는 것 하나만 실었다.
//  - 조건에 맞는 점대칭 수를 모두 세기(31): 경우 따지기. 숨은 식을 찾아 계산하기(32의 13 + 80): 뜻 없는 셈
//  - 도형 하나에 대한 설명 가운데 틀린 것 고르기(22): 「대칭축이 2개인 도형 세기」와 기본의 「도형 하나를 선대칭·점대칭으로 가르기」가 같은 판단을 한다. 같은 일을 설명 고르기로 바꾼 것이라 싣지 않았다.
//  - 중심까지의 거리와 대응변을 이어 구하는 꼴(44), 겹치거나 맞붙은 합동 삼각형의 변의 차(35의 변형): 수집본에 그림이 없어 얼개를 알 수 없다. 길이를 두 번 옮기는 일은 다른 유형이 묻는다.
//  - 그리기(61~66): 기본에서 고르기로 바꾸어 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N } = B.kit;
  const G = B.kit.geo;
  const K = B.kit.sym523;
  const { TAGS, JA, RAD, TOL, cm, calc, dist, area2, samePt, tidy, sidesOf, mirror, halfTurn, axesOf, congruent, slideFit, kindOf, kindOfPoly, toCorner, scaled, oneItem, say, tagList,
    paint, tiles, gridTiles, Sheet, nameSpot, triBySides, anglesOf, convex, SIZED, someImages, anyImage, cutTile, halvesFit, cutBy, from, LINE_ONLY, TURN_ONLY, BOTH, NEITHER, POOL, regular,
    LETTERS, LETTER_KIND, letterTiles, DIGITS, DIGIT_KIND, digitCard, plainRow, lineShape, turnShape, centerSheet, someTurnHex, HALVES, HX, HY, openPath, shift, axisLine, sideOf } = K;
  const SYM = '6수03-02', CONG = '6수03-01';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const drawn = (d, make) => d.until(make, (x) => !x.clash);
  const close = (a, b) => Math.abs(a - b) < 1e-6;
  const rect = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
  const perimeter = (pts) => pts.reduce((s, p, i) => s + dist(p, pts[(i + 1) % pts.length]), 0);

  // 한 꼭짓점을 모눈 한 칸 옮겨 만든, 합동이 아닌 도형들(모눈 4×4칸 안)
  function nudged(base) {
    const out = [];
    base.forEach((v, i) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([x, y]) => {
      const p = base.map((q, j) => (j === i ? [q[0] + x, q[1] + y] : q));
      if (p[i][0] < 0 || p[i][0] > 4 || p[i][1] < 0 || p[i][1] > 4 || tidy(p).length !== base.length) return;
      if (Math.sign(area2(p)) !== Math.sign(area2(base)) || Math.abs(area2(p)) < Math.abs(area2(base)) * 0.6 || (base.length > 3 && !convex(p))) return;
      if (!congruent(base, p) && !out.some((q) => congruent(p, q))) out.push(toCorner(p));
    }));
    return out;
  }
  // 항상 합동인가. 틀린 말마다 조건은 같지만 합동이 아닌 두 도형(반례)을 붙여 두고, 조건이 정말 같은지와 합동이 아닌지를 좌표로 확인한다.
  const ALWAYS = ['한 변의 길이가 같은 두 정사각형', '한 변의 길이가 같은 두 정삼각형', '둘레가 같은 두 정삼각형', '둘레가 같은 두 정사각형', '넓이가 같은 두 정사각형', '반지름이 같은 두 원'];
  const sameArea = (a, b) => close(Math.abs(area2(a)), Math.abs(area2(b))), samePeri = (a, b) => close(perimeter(a), perimeter(b));
  const sameAngles = (a, b) => { const x = anglesOf(a).map((v) => Math.round(v * 1000)).sort(), y = anglesOf(b).map((v) => Math.round(v * 1000)).sort(); return x.join() === y.join(); };
  const oneSide = (len) => (a, b) => sidesOf(a).some(([p, q]) => close(dist(p, q), len)) && sidesOf(b).some(([p, q]) => close(dist(p, q), len));
  const NOT_ALWAYS = [
    ['넓이가 같은 두 직사각형', rect(6, 2), rect(4, 3), sameArea], ['둘레가 같은 두 직사각형', rect(5, 1), rect(4, 2), samePeri],
    ['한 변의 길이가 같은 두 마름모', [[0, 0], [5, 0], [8, 4], [3, 4]], rect(5, 5), oneSide(5)], ['둘레가 같은 두 이등변삼각형', triBySides(5, 5, 6), triBySides(6, 6, 4), samePeri],
    ['세 각의 크기가 각각 같은 두 삼각형', [[0, 0], [4, 0], [1, 3]], [[0, 0], [8, 0], [2, 6]], sameAngles], ['네 각의 크기가 모두 같은 두 사각형', rect(3, 2), rect(4, 1), sameAngles],
    ['넓이가 같은 두 삼각형', [[0, 0], [4, 0], [0, 3]], [[0, 0], [6, 0], [0, 2]], sameArea], ['한 변의 길이가 같은 두 직사각형', rect(5, 2), rect(5, 3), oneSide(5)]
  ];
  if (NOT_ALWAYS.some(([, a, b, same]) => !same(a, b) || congruent(a, b))) throw new Error('항상 합동이 아닌 예가 반례가 되지 못한다');
  // 넓이를 똑같이 둘로 나누는 선: [도형, 선의 두 끝]. 두 조각의 넓이가 같은지와 합동인지를 좌표로 가린다.
  const EQUAL_CUTS = [
    [[[0, 0], [4, 0], [4, 2], [0, 2]], [0, 0], [4, 2]], [[[0, 0], [4, 0], [4, 2], [0, 2]], [1, 0], [3, 2]], [[[1, 0], [4, 0], [3, 2], [0, 2]], [4, 0], [0, 2]], [[[1, 0], [4, 0], [3, 2], [0, 2]], [2, 0], [2, 2]],
    [[[1, 0], [3, 0], [4, 3], [0, 3]], [2, 0], [2, 3]], [[[2, 0], [4, 2], [2, 4], [0, 2]], [2, 0], [2, 4]],
    [[[0, 0], [0, 3], [4, 3]], [0, 3], [2, 1.5]], [[[0, 0], [0, 4], [2, 4]], [0, 4], [1, 2]], [[[0, 0], [4, 2], [1, 2]], [0, 0], [2.5, 2]], [[[0, 0], [2, 0], [4, 3], [0, 3]], [1.5, 0], [1.5, 3]]
  ].map(([pts, p, q]) => { const [a, b] = cutBy(pts, p, q); if (!sameArea(a, b)) throw new Error('넓이를 똑같이 나누지 않는 선'); return { pts, p, q, fit: halvesFit(pts, p, q) }; });
  if (EQUAL_CUTS.map((c) => (c.fit ? 'o' : 'x')).join('') !== 'ooooooxxxx') throw new Error('넓이가 같은 조각의 합동 판정이 생각과 다르다');
  // 비스듬한 직선으로만 접히는 선대칭도형
  const tiltedOnly = (s) => { const axes = axesOf(sidesOf(s.pts)); return axes.length > 0 && axes.every(([a, b]) => Math.abs(a[0] - b[0]) > TOL && Math.abs(a[1] - b[1]) > TOL); };
  if (POOL.filter(tiltedOnly).length < 3) throw new Error('비스듬한 대칭축을 가진 도형 감이 모자란다');
  // 이름만으로 가르는 도형: 갈래는 대표 도형의 좌표로 판정한다(원은 대칭축이 셀 수 없이 많고 점대칭이다).
  const NAMED = [['정삼각형', regular(3, 1)], ['정사각형', regular(4, 1)], ['정오각형', regular(5, 1)], ['정육각형', regular(6, 1)], ['직사각형', rect(4, 2)], ['마름모', [[2, 0], [4, 1], [2, 2], [0, 1]]],
    ['평행사변형', [[1, 0], [4, 0], [3, 2], [0, 2]]], ['이등변삼각형', [[1, 0], [2, 4], [0, 4]]]].map(([name, pts]) => { const k = kindOfPoly(pts); return { name, line: k.axes > 0, turn: k.turn }; }).concat([{ name: '원', line: true, turn: true }]);
  // 대칭축이 둘이고 점대칭이기도 한 육각형 ㄱㄴㄷㄹㅁㅂ(ㄱ, ㄹ이 세로 대칭축 위)
  const twoAxisHex = (w, a, h) => [[0, 0], [-w, a], [-w, h - a], [0, h], [w, h - a], [w, a]];
  // 직각을 낀 두 변이 p, q 인 직각삼각형 둘을 한 직선 위에 맞닿게 놓았을 때, 두 삼각형의 남은 꼭짓점 사이의 거리가 자연수(c)가 되는 수
  const JOINED = [[7, 17, 26], [14, 34, 52], [17, 31, 50], [7, 23, 34], [31, 49, 82], [23, 47, 74]];
  // 직사각형(가로 w, 세로 h)을 대각선으로 접었을 때 생기는 직각삼각형의 세 변이 자연수가 되는 수: [w, h, 짧은 변, 빗변]
  const FOLDS = [[8, 4, 3, 5], [16, 8, 6, 10], [18, 12, 5, 13], [25, 15, 8, 17], [32, 24, 7, 25]];

  B.addGroup('5-2-3', {
    id: 'hard', title: '실력 문제', standard: SYM,
    types: [
      H('hard-cong-count', '크기만 다른 도형·뒤집은 도형이 섞인 합동 세기', '2, 기본 ①3·4 ②3', (d) => {
        // 가와 합동인 것: 돌린 것과 뒤집은 것. 합동이 아닌 것: 모양은 같고 크기가 절반인 것(누가 고르는가: 모양만 보는 아이), 한 꼭짓점이 한 칸 다른 것(대충 보는 아이)
        const small = d.pick(SIZED.slice(0, 3)), base = scaled(small, 2), shown = anyImage(d, base), k = d.int(2, 3);
        const same = d.until(() => someImages(d, base, k, [shown]), (list) => list.some((p) => !slideFit(shown, p)) && list.some((p) => slideFit(shown, p)));
        const list = d.shuffle(same.concat([anyImage(d, small)], d.shuffle(nudged(base)).slice(0, 5 - k).map((p) => anyImage(d, p)))), flags = list.map((p) => congruent(shown, p)), labels = TAGS.slice(1, 7), count = flags.filter(Boolean).length;
        if (list.length !== 6 || count !== k) throw new Error('보기 도형이 생각과 다르다');
        return N('도형 나~사 가운데 도형 가와 서로 합동인 도형은 모두 몇 개인가?', count, {
          unit: '개', figure: gridTiles([shown].concat(list)),
          explain: `돌리거나 뒤집어서 포개었을 때 완전히 겹치는 도형은 ${tagList(labels, flags)}이다. 뒤집어야 겹치는 도형도 합동이다. 모양이 같아도 크기가 다르거나 변의 길이가 한 칸이라도 다르면 합동이 아니다.`, facts: { count: flags, again: { kind: 'congruent', base: shown, polys: list, flags } }
        });
      }, { standard: CONG }),
      H('hard-always', '항상 합동이 되는 두 도형', '19, 기본 ①14 ②10', (d) => say(d, '다음과 같은 두 도형 가운데 항상 서로 합동이 되는 것은?', ALWAYS, NOT_ALWAYS.map((r) => r[0]), true,
        '정사각형·정삼각형·원은 한 변의 길이(반지름)가 정해지면 모양과 크기가 하나로 정해진다. 둘레나 넓이가 같으면 한 변의 길이도 같아진다. 직사각형·마름모·이등변삼각형·삼각형은 넓이나 둘레, 각의 크기가 같아도 모양이나 크기가 다른 것을 그릴 수 있다(넓이가 12 cm²인 직사각형에는 가로 6 cm, 세로 2 cm인 것도 있고 가로 4 cm, 세로 3 cm인 것도 있다).'), { standard: CONG }),
      H('hard-match-shared', '겹쳐 놓은 두 합동 삼각형의 대응변', '6·35', (d) => {
        // 사다리꼴 ㄱㄴㄷㄹ의 두 대각선. 삼각형 ㄱㄴㄷ과 삼각형 ㄹㄷㄴ은 변 ㄴㄷ을 함께 쓴다. 함정: 자리가 같아 보이는 변 ㄱㄴ(왼쪽 변)의 길이를 답한다.
        const made = drawn(d, () => {
          const a = d.int(5, 8), c = a + d.int(3, 6), e = c - d.int(1, 2), x = (a * a - e * e + c * c) / (2 * c), h = Math.sqrt(Math.max(0, a * a - x * x));
          if (x < 1 || c - 2 * x < 2 || e - a < 2 || h < 2) return { clash: true };
          const k = Math.min(6 / c, 3.8 / h), P = [[x, 0], [0, h], [c, h], [c - x, 0]].map(([u, v]) => [u * k, v * k]);
          if (!congruent([P[0], P[1], P[2]], [P[3], P[2], P[1]]) || !close(dist(P[1], P[3]) / k, e)) throw new Error('겹친 두 삼각형이 생각과 다르다');
          // 두 선분이 엇갈려 있어 길이 글을 선분 옆에 겹치지 않게 적을 자리가 없다. 길이는 문제 글에 적고 그림은 길이의 비율대로만 그린다.
          const sheet = new Sheet().poly(P).line(P[0], P[2]).line(P[1], P[3]).names(P, JA.slice(0, 4));
          return { a, e, sheet, clash: sheet.clash() };
        });
        return N(`사각형 ㄱㄴㄷㄹ에 선분 ㄱㄷ과 선분 ㄴㄹ을 그었더니 삼각형 ㄱㄴㄷ과 삼각형 ㄹㄷㄴ이 서로 합동이 되었다. 변 ㄱㄴ이 ${cm(made.a)}이고 선분 ㄱㄷ이 ${cm(made.e)}일 때, 선분 ㄴㄹ은 몇 cm인가?`, made.e, {
          unit: 'cm', figure: made.sheet.svg('사각형 ㄱㄴㄷㄹ과 두 선분 ㄱㄷ, ㄴㄹ. 삼각형 ㄱㄴㄷ과 삼각형 ㄹㄷㄴ은 변 ㄴㄷ을 함께 쓴다.'),
          explain: `두 삼각형을 포개면 점 ㄱ은 점 ㄹ과, 점 ㄴ은 점 ㄷ과, 점 ㄷ은 점 ㄴ과 겹친다. 선분 ㄴㄹ의 대응변은 선분 ㄱㄷ이므로 ${cm(made.e)}이다. 변 ㄱㄴ의 대응변은 변 ㄹㄷ이다.`, facts: calc(String(made.e))
        });
      }, { standard: CONG }),
      H('hard-cut-equal', '넓이는 같지만 합동이 아닌 조각', '4, 기본 ①7 ②5', (d) => {
        const k = d.int(1, 3), list = d.shuffle(d.shuffle(EQUAL_CUTS.filter((c) => !c.fit)).slice(0, k).concat(d.shuffle(EQUAL_CUTS.filter((c) => c.fit)).slice(0, 4 - k))), flags = list.map((c) => !halvesFit(c.pts, c.p, c.q)), labels = TAGS.slice(0, 4);
        return N('점선은 모두 도형의 넓이를 똑같이 둘로 나눈다. 점선을 따라 잘랐을 때 만들어지는 두 도형이 서로 합동이 아닌 것은 모두 몇 개인가?', k, {
          unit: '개', figure: tiles(list.map(cutTile)),
          explain: `넓이가 같아도 모양이 다르면 포개었을 때 완전히 겹치지 않는다. 두 조각을 돌리거나 뒤집어서 포개어 보면 ${tagList(labels, flags)}의 두 조각은 모양이 달라서 합동이 아니다.`, facts: { count: flags }
        });
      }, { standard: CONG }),
      H('hard-line-count', '비스듬한 대칭축과 평행사변형이 섞인 선대칭도형 세기', '10·14, 기본 ①32 ②28', (d) => {
        // 함정 둘: 비스듬한 직선으로 접어야 겹치는 도형(선대칭이다), 180° 돌려야 겹치는 도형(선대칭이 아니다)
        const tilted = d.shuffle(POOL.filter(tiltedOnly)).slice(0, d.int(1, 2)), upright = from(d, (s) => s.line && !tiltedOnly(s), 1), turns = from(d, TURN_ONLY, d.int(2, 3));
        const list = d.shuffle(tilted.concat(upright, turns, from(d, NEITHER, 6 - tilted.length - 1 - turns.length))), labels = TAGS.slice(0, 6), flags = list.map((s) => kindOfPoly(s.pts).axes > 0), count = flags.filter(Boolean).length;
        return N('도형 가~바 가운데 선대칭도형은 모두 몇 개인가?', count, {
          unit: '개', figure: gridTiles(list.map((s) => s.pts)),
          explain: `선대칭도형은 ${tagList(labels, flags)}이다. 대칭축이 비스듬히 놓이는 도형도 그 직선을 따라 접으면 완전히 겹치므로 선대칭도형이다. 180° 돌려야 겹치는 도형은 어느 직선으로 접어도 겹치지 않으므로 선대칭도형이 아니다.`, facts: { count: flags, again: { kind: 'line', polys: list.map((s) => s.pts), flags } }
        });
      }),
      H('hard-axis-two', '대칭축이 2개인 도형 세기', '20·21, 기본 ①38 ②35', (d) => {
        // 직사각형과 마름모는 2개(대각선·변의 가운데를 이은 선까지 세면 4개로 틀린다), 마름모처럼 세워 놓은 정사각형은 4개, 평행사변형은 0개
        const two = from(d, (s) => s.axes === 2, d.int(2, 3)), list = d.shuffle(two.concat(from(d, (s) => s.axes === 4, 1), from(d, TURN_ONLY, 1), from(d, (s) => s.axes === 1, 4 - two.length)));
        const labels = TAGS.slice(0, 6), counts = list.map((s) => kindOfPoly(s.pts).axes), flags = counts.map((c) => c === 2);
        return N('도형 가~바 가운데 대칭축이 2개인 도형은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: gridTiles(list.map((s) => s.pts)),
          explain: `대칭축의 수를 세면 ${labels.map((t, i) => `${t} ${counts[i]}개`).join(', ')}이다. 대칭축이 2개인 도형은 ${tagList(labels, flags)}이다. 도형을 똑같은 두 조각으로 나누는 직선이라도 접었을 때 겹치지 않으면 대칭축이 아니다.`, facts: { count: flags, again: { kind: 'axes', want: 2, polys: list.map((s) => s.pts), flags } }
        });
      }),
      H('hard-turn-only', '점대칭도형이지만 선대칭도형은 아닌 것 세기', '14·24, 기본 ①84 ②74', (d) => {
        const turns = from(d, TURN_ONLY, d.int(2, 3)), list = d.shuffle(turns.concat(from(d, BOTH, 2), from(d, LINE_ONLY, 1), from(d, NEITHER, 3 - turns.length))), labels = TAGS.slice(0, 6), kinds = list.map((s) => kindOfPoly(s.pts)), flags = kinds.map((k) => k.turn && k.axes === 0);
        return N('도형 가~바 가운데 점대칭도형이지만 선대칭도형은 아닌 것은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: gridTiles(list.map((s) => s.pts)),
          explain: `점대칭도형은 ${tagList(labels, kinds.map((k) => k.turn))}이다. 이 가운데 ${tagList(labels, kinds.map((k) => k.turn && k.axes > 0))}는 접어도 완전히 겹치므로 선대칭도형이기도 하다. 점대칭도형이지만 선대칭도형은 아닌 것은 ${tagList(labels, flags)}이다.`, facts: { count: flags, again: { kind: 'turnOnly', polys: list.map((s) => s.pts), flags } }
        });
      }),
      H('hard-letter-turn-only', '돌리면 겹치지만 접으면 겹치지 않는 글자', '29, 기본 ②75', (d) => {
        const names = Object.keys(LETTERS), pick = (test, n) => d.shuffle(names.filter((ch) => test(LETTER_KIND[ch]))).slice(0, n), turns = pick((k) => k.turn && !k.line, d.int(2, 3));
        const list = turns.concat(pick((k) => k.turn && k.line, 2), pick((k) => !k.turn && k.line, 4 - turns.length)).sort(), flags = list.map((ch) => { const k = kindOf(LETTERS[ch]); return k.turn && k.axes === 0; });
        return N('선분으로 그린 알파벳 카드이다. 카드를 180° 돌리면 처음과 완전히 겹치지만, 어떤 직선을 따라 접어도 완전히 겹치지 않는 글자는 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: letterTiles(LETTERS, list, list),
          explain: `180° 돌렸을 때 처음과 완전히 겹치는 글자는 ${list.filter((ch) => LETTER_KIND[ch].turn).join(', ')}이다. 이 가운데 ${list.filter((ch) => LETTER_KIND[ch].turn && LETTER_KIND[ch].line).join(', ')}는 접어도 완전히 겹친다. 돌려야만 겹치는 글자는 ${tagList(list, flags)}이다.`, facts: { count: flags }
        });
      }),
      H('hard-digit-make', '점대칭 모양인 숫자만 골라 가장 큰 수 만들기', '30, 기본 ②56 ③57', (d) => {
        // 3은 접으면 겹치지만 돌리면 겹치지 않고, 6과 9는 돌리면 서로 바뀐다(자기 자신과 겹치지 않는다).
        const turn = d.shuffle(DIGITS.filter((x) => DIGIT_KIND[x].turn)).slice(0, 3), list = turn.concat([3], d.shuffle([4, 6, 7, 9]).slice(0, 2)).sort((x, y) => x - y);
        const chosen = list.filter((x) => DIGIT_KIND[x].turn).sort((x, y) => y - x), text = chosen.join('');
        if (chosen.length !== 3 || text[0] === '0') throw new Error('고른 숫자가 생각과 다르다');
        return N('디지털 숫자 카드 가운데 점대칭도형 모양인 카드만 모두 골라 한 번씩 늘어놓아 수를 만들려고 한다. 만들 수 있는 가장 큰 수는?', Number(text), {
          figure: plainRow(list.map((x) => digitCard(x))),
          explain: `180° 돌렸을 때 처음과 완전히 겹치는 숫자 카드는 ${chosen.slice().sort((x, y) => x - y).join(', ')} 세 장이다. 나머지 카드는 180° 돌리면 처음과 다른 모양이 된다(3은 접으면 겹치지만 돌리면 겹치지 않는다). 고른 숫자를 큰 것부터 늘어놓은 수가 가장 크다.`, facts: calc(text, [Number(text)])
        });
      }),
      H('hard-not-partner', '대칭축이 둘인 점대칭도형에서 대응변이 될 수 없는 변', '28', (d) => {
        const w = d.pick([2.2, 2.6]), a = d.pick([1.1, 1.3]), h = 4.4, P = twoAxisHex(w, a, h), nm = JA.slice(0, 6), O = [0, h / 2], i = d.pick([0, 2]);
        // 변 i 가 옮겨 갈 수 있는 변: 세로 대칭축으로 접을 때, 가로 대칭축으로 접을 때, 대칭의 중심으로 180° 돌릴 때
        const moves = [(p) => mirror(p, [0, 0], [0, 1]), (p) => mirror(p, [0, h / 2], [1, h / 2]), (p) => halfTurn(p, O)], at = (p) => P.findIndex((q) => samePt(q, p));
        const can = moves.map((move) => [at(move(P[i])), at(move(P[i + 1]))].sort().join()), key = (j) => [j, (j + 1) % 6].sort().join(), canBe = (j) => can.includes(key(j));
        const yes = [0, 1, 2, 3, 4, 5].filter((j) => j !== i && canBe(j)), no = [0, 1, 2, 3, 4, 5].filter((j) => j !== i && !canBe(j)), options = d.shuffle(yes.concat([d.pick(no)]));
        if (yes.length !== 3 || no.length !== 2) throw new Error('대응변이 될 수 있는 변의 수가 생각과 다르다');
        const sheet = new Sheet().poly(P).line([0, -0.8], [0, h + 0.8], 'axis').line([-w - 0.9, h / 2], [w + 0.9, h / 2], 'axis').dot(O, true).text([0.42, -0.7], '가').text([w + 0.85, h / 2 - 0.36], '나').text([0.4, h / 2 + 0.4], 'ㅇ');
        P.forEach((p, j) => sheet.text(j === 0 ? [-0.4, -0.3] : j === 3 ? [-0.4, h + 0.32] : nameSpot(P, j, 0.46), nm[j]));
        return oneItem(`직선 가와 직선 나를 대칭축으로 하는 선대칭도형이면서 점 ㅇ을 대칭의 중심으로 하는 점대칭도형이다. ${sideOf(nm, i)}의 대응변이 될 수 없는 것은?`, options.map((j) => sideOf(nm, j)), options.map((j) => !canBe(j)), {
          figure: sheet.svg('대칭축이 직선 가(세로)와 직선 나(가로)이고 대칭의 중심이 점 ㅇ인 도형 ㄱㄴㄷㄹㅁㅂ'),
          explain: `${sideOf(nm, i)}의 대응변은 직선 가를 대칭축으로 하면 ${sideOf(nm, yes.find((j) => key(j) === can[0]))}, 직선 나를 대칭축으로 하면 ${sideOf(nm, yes.find((j) => key(j) === can[1]))}, 점 ㅇ을 대칭의 중심으로 하면 ${sideOf(nm, yes.find((j) => key(j) === can[2]))}이다. 나머지 변은 어느 경우에도 ${sideOf(nm, i)}과 겹치지 않는다.`
        });
      }),
      H('hard-names', '도형의 이름만 보고 선대칭·점대칭 가리기', '23, 기본 ①85 ②54', (d) => {
        const [text, test, why] = d.pick([
          ['선대칭도형이지만 점대칭도형은 아닌 것은?', (x) => x.line && !x.turn, '정삼각형·정오각형·이등변삼각형은 접으면 완전히 겹치지만 180° 돌리면 뒤집힌 모양이 되어 겹치지 않는다.'],
          ['점대칭도형이지만 선대칭도형은 아닌 것은?', (x) => !x.line && x.turn, '평행사변형은 180° 돌리면 완전히 겹치지만 어느 직선으로 접어도 완전히 겹치지 않는다.'],
          ['선대칭도형이면서 점대칭도형인 것은?', (x) => x.line && x.turn, '직사각형·마름모·정사각형·정육각형·원은 접어도, 180° 돌려도 완전히 겹친다. 정삼각형·정오각형·이등변삼각형은 선대칭도형일 뿐이고, 평행사변형은 점대칭도형일 뿐이다.']
        ]);
        const list = d.shuffle(d.shuffle(NAMED.filter(test)).slice(0, 1).concat(d.shuffle(NAMED.filter((x) => !test(x))).slice(0, 3)));
        return oneItem(`다음 도형 가운데 ${text}`, list.map((x) => x.name), list.map(test), { explain: why + ` 답은 ${list.find(test).name}이다.` });
      }),
      H('hard-psym-peri-back', '둘레를 알 때 점대칭도형의 한 변', '43, 기본 ①71 ②68', (d) => {
        const made = drawn(d, () => { const hex = someTurnHex(d), shape = turnShape(hex.raw, 5, 4.2), sheet = centerSheet(shape).side(shape.P, 0, cm(hex.lens[0])).side(shape.P, 1, cm(hex.lens[1])); return { hex, sheet, clash: sheet.clash() }; });
        const [a, b, w] = made.hex.lens, total = (a + b + w) * 2;
        return N(`점 ㅇ을 대칭의 중심으로 하는 점대칭도형의 둘레가 ${cm(total)}이다. 변 ㄷㄹ은 몇 cm인가?`, w, {
          unit: 'cm', figure: made.sheet.svg(`점 ㅇ을 대칭의 중심으로 하는 점대칭도형 ㄱㄴㄷㄹㅁㅂ. 변 ㄱㄴ ${cm(a)}, 변 ㄴㄷ ${cm(b)}`),
          explain: `대응변의 길이는 서로 같으므로 변 ㄹㅁ은 ${cm(a)}, 변 ㅁㅂ은 ${cm(b)}이다. 남은 두 변 ㄷㄹ과 ㄱㅂ의 길이의 합은 ${total} − ${a} × 2 − ${b} × 2 = ${w * 2}(cm)이고, 두 변은 대응변이라 길이가 같으므로 변 ㄷㄹ은 ${w * 2} ÷ 2 = ${w}(cm)`,
          facts: calc(`(${total}-${a}*2-${b}*2)/2`, [2])
        });
      }),
      H('hard-lsym-half-peri', '반쪽만 준 선대칭도형의 둘레', '39, 기본 ①56 ②45', (d) => {
        // 반쪽은 사각형 ㄱㄴㄷㄹ(변 ㄱㄹ이 대칭축 위). 함정: 대칭축 위의 선분 ㄱㄹ의 길이까지 더한다.
        const made = drawn(d, () => {
          const [run, h, slant] = d.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]), t = d.int(4, 9), b = t + run, k = Math.min(5 / b, 4 / h), P = [[0, 0], [-t * k, 0], [-b * k, h * k], [0, h * k]];
          const sheet = new Sheet().add(P, (m) => paint(G.polygon(P.map(m)), 'stroke:none')).line(P[0], P[1]).line(P[1], P[2]).line(P[2], P[3]).line([0, -0.8], [0, h * k + 0.8], 'axis')
            .text([0.4, -0.05], 'ㄱ').text(nameSpot(P, 1, 0.46), 'ㄴ').text(nameSpot(P, 2, 0.46), 'ㄷ').text([0.4, h * k + 0.05], 'ㄹ')
            .beside(P[0], P[1], cm(t), [P[1][0], -5]).beside(P[1], P[2], cm(slant), [-50, 0]).beside(P[2], P[3], cm(b), [P[2][0], 50]).beside(P[3], P[0], cm(h), [5, 0]);
          return { t, b, h, slant, sheet, clash: sheet.clash() };
        }), { t, b, h, slant } = made, total = (t + slant + b) * 2;
        return N('직선 ㄱㄹ을 대칭축으로 하는 선대칭도형의 반쪽이다. 나머지 반쪽을 그려 완성한 선대칭도형의 둘레는 몇 cm인가?', total, {
          unit: 'cm', figure: made.sheet.svg(`대칭축인 직선 ㄱㄹ의 왼쪽에 그려진 반쪽 도형 ㄱㄴㄷㄹ. 변 ㄱㄴ ${cm(t)}, 변 ㄴㄷ ${cm(slant)}, 변 ㄷㄹ ${cm(b)}, 대칭축 위의 선분 ㄱㄹ ${cm(h)}`),
          explain: `완성한 도형의 변은 반쪽의 변 ㄱㄴ, ㄴㄷ, ㄷㄹ과 그 대응변들이다. 선분 ㄱㄹ은 대칭축 위에 있어 완성한 도형의 안쪽에 놓이므로 둘레가 아니다. 둘레는 (${t} + ${slant} + ${b}) × 2 = ${total}(cm)`,
          facts: calc(`(${t}+${slant}+${b})*2`, [2])
        });
      }),
      H('hard-half-area', '반쪽만 준 선대칭도형의 넓이', '40, 기본 ①57 ②51 ③42', (d) => {
        const half = d.pick(HALVES), area = Math.abs(area2(half)) / 2, closed = half.map(shift);
        return N('모눈 한 칸의 넓이는 1 cm²이다. 대칭축의 왼쪽에 색칠한 반쪽에 나머지 반쪽을 그려 선대칭도형을 완성하였다. 완성한 선대칭도형의 넓이는 몇 cm²인가?', area * 2, {
          unit: 'cm²', figure: G.board(HX * 2 + 2, HY, [paint(G.polygon(closed), 'fill:rgba(251,191,36,0.3);stroke:none'), openPath(half), axisLine([HX + 1, -0.45], [HX + 1, HY + 0.45])], { grid: 'lines', scale: 1.12, label: '모눈종이에 선대칭도형의 반쪽이 색칠되어 있고 그 오른쪽에 대칭축이 그려져 있다.' }),
          explain: `색칠한 반쪽의 넓이는 모눈 칸을 세면 ${area} cm²이다. 나머지 반쪽은 색칠한 반쪽과 합동이므로 넓이가 같다. 완성한 도형의 넓이는 ${area} × 2 = ${area * 2}(cm²)`, facts: calc(`${area}*2`, [area, 2])
        });
      }),
      H('hard-joined-peri', '맞닿은 두 합동 삼각형으로 된 사각형의 둘레', '34, 기본 ②26', (d) => {
        // 직각삼각형 ㄱㄴㄷ과 ㄷㄹㅁ이 한 직선 위에 맞닿아 있다. 변 ㄴㄷ과 변 ㄷㄹ의 길이는 다른 삼각형의 대응변에서 옮겨 와야 한다.
        const made = drawn(d, () => {
          const [x, y, c] = d.pick(JOINED), [p, q] = d.shuffle([x, y]), k = Math.min(8.4 / (p + q), 3.8 / Math.max(p, q)), at = (u, v) => [u * k, v * k], n1 = at(0, -q), n2 = at(0, 0), n3 = at(p, 0), n4 = at(p + q, 0), n5 = at(p + q, -p);
          if (!close(dist(n1, n5) / k, c) || !congruent([n1, n2, n3], [n3, n4, n5])) throw new Error('맞닿은 두 삼각형이 생각과 다르다');
          const sheet = new Sheet().poly([n1, n2, n4, n5]).line(n1, n3).line(n3, n5).corner([n1, n2, n3], 1).corner([n3, n4, n5], 1)
            .text([n1[0] - 0.1, n1[1] - 0.42], 'ㄱ').text([n2[0] - 0.1, n2[1] + 0.45], 'ㄴ').text([n3[0], n3[1] + 0.45], 'ㄷ').text([n4[0] + 0.1, n4[1] + 0.45], 'ㄹ').text([n5[0] + 0.1, n5[1] - 0.42], 'ㅁ')
            .beside(n1, n2, cm(q), [n1[0] - 2, n1[1]]).beside(n4, n5, cm(p), [n4[0] + 2, n4[1]]).beside(n1, n5, cm(c), [n1[0], n1[1] - 50]);
          return { p, q, c, sheet, clash: sheet.clash() };
        }), { p, q, c } = made, total = q + p + q + p + c;
        return N('삼각형 ㄱㄴㄷ과 삼각형 ㄷㄹㅁ은 서로 합동이고, 세 점 ㄴ, ㄷ, ㄹ은 한 직선 위에 있다. 사각형 ㄱㄴㄹㅁ의 둘레는 몇 cm인가?', total, {
          unit: 'cm', figure: made.sheet.svg(`한 직선 위에 맞닿아 놓인 직각삼각형 ㄱㄴㄷ과 직각삼각형 ㄷㄹㅁ, 그리고 선분 ㄱㅁ. 변 ㄱㄴ ${cm(q)}, 변 ㄹㅁ ${cm(p)}, 선분 ㄱㅁ ${cm(c)}. 각 ㄱㄴㄷ과 각 ㄷㄹㅁ은 직각이다.`),
          explain: `직각인 각끼리 대응각이다. 변 ㄴㄷ의 대응변은 변 ㄹㅁ이므로 ${cm(p)}, 변 ㄷㄹ의 대응변은 변 ㄱㄴ이므로 ${cm(q)}이다. 사각형 ㄱㄴㄹㅁ의 둘레는 ${q} + ${p} + ${q} + ${p} + ${c} = ${total}(cm)`,
          facts: calc(`${q}+${p}+${q}+${p}+${c}`)
        });
      }, { standard: CONG })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
