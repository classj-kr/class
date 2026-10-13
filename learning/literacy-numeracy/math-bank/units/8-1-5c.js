// 중학교 2학년 1학기 5단원 일차함수와 그 그래프 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 함수는 「x의 값 하나에 y의 값이 하나씩」 정해지는 관계라는 뜻을 놓친다. 「자연수 x의 약수 y」는 함수가 아니지만 「약수의 개수 y」는 함수이다.
//    서로 다른 x가 같은 y로 가도 함수이다(절댓값, 나머지). 식으로 적을 수 없으면 함수가 아니라고 여기기도 한다.
//  - x가 보이는 식이면 일차함수라고 여긴다. 정리하면 x의 항이 사라지는 식(y = 2x − 2(x + 3))과 x²이 남는 식(y = x(3 − x))은 일차함수가 아니다.
//    거꾸로 y = (몇) 꼴로 적혀 있지 않은 식(y + 4x = −4x + 3)을 일차함수에서 뺀다.
//  - 괄호가 있는 식의 기울기를 괄호 앞의 수나 괄호 안의 x의 계수로 읽는다. y = 2(1 − x)의 기울기는 −2이다. 평행이동하여도 기울기는 그대로이다.
//  - 기울기를 (x의 값의 증가량) ÷ (y의 값의 증가량)으로 거꾸로 나누거나, 감소를 음수의 증가로 바꾸지 못한다. x의 값이 감소하면 x의 값의 증가량이 음수이다.
//  - 기울기가 같으면 모두 평행하다고 여긴다. y절편까지 같으면 일치하므로 「만나지 않는」 것이 아니다.
//  - 기울기가 큰 직선이 y축에 가깝다고 여긴다. y축에 가까운 것은 기울기의 절댓값이 큰 직선이다.
//  - 선분의 길이를 절편 그대로 적는다. 길이는 절편의 절댓값이고, 넓이·길이에서 거꾸로 구한 수의 부호는 문제의 조건으로 정한다.
//
// 실력에는 ① 문제의 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(세 점이 한 직선 위 ①36 ②40, 두 그래프가 x축 위에서 만날 때 ②31, 그래프로 준 활용 ②77, 기울기와 한 점·두 점으로 식 구하기)은 기본 묶음에 두고,
// 같은 얼개에 한 겹이 더 있는 것(세 점으로 미지수를 구해 x절편까지 심26, 두 축 위에서 만나는 조건 둘 심17)을 실력에 두었다.
// 과제 글이 실력에 한 유형씩만 두라고 한 것: 넓이로 수 구하기(hard-area-coef), 선분과 만나는 기울기의 범위(hard-slope-range), 다른 그래프에서 읽은 부호로 사분면 가리기(hard-signs-other-graph).
//
// 다시 실은 꼴(2026-10-13, 실력 묶음 끝의 hard-lap-ahead 부터 hard-letter-point-xint 까지)
//  처음 지을 때 「지나치게 복잡한 활용」「경우 나누기·요령·조건 풀이」「한 유형만」이라는 까닭으로 뺀 꼴을 다시 보아, 이 단원에서 배운 것만으로 풀리는 것은 모두 실었다.
//  - 복잡한 활용: 늦게 출발하여 한 바퀴 앞서기(①73), 따로 움직이는 두 점(심64), 꼭짓점을 돌아 움직이는 점(심65 — 변마다 식이 다르다. 두 식을 따로 답한다).
//  - 경우 나누기: x축 위의 두 점 사이의 거리(①52 심20 — 조건으로 하나를 고르는 것과 둘 다 구하는 것), y절편이 같은 두 그래프와 x축의 삼각형(①55),
//    사분면을 지나지 않게 하는 정수 기울기의 개수(심39 — 「일차함수」로 물어 a = 0은 세지 않는다), 사다리꼴의 넓이를 이등분하는 원점을 지나는 그래프(심56 — 어느 변과 만나는지 먼저 가린다).
//  - 요령(이 단원의 성질에서 나오는 것): a + b는 x = 1일 때의 y의 값(심30), a로 묶으면 늘 지나는 점이 보인다(심38), 두 절편의 비에서 기울기(심46), 그래프 위의 점을 문자로 놓기(심54),
//    두 절편을 한 문자로 놓고 합의 조건 풀기(심15), 곱의 부호에서 몫의 부호(심34), 부호 조건 둘에 맞는 값(심36 — 범위로 답하는 원문을 「될 수 있는 값」 고르기로 바꾸었다).
//  - 「한 유형만」이라서 뺐으나 하는 일이 다른 것: 분수 꼴 계수의 부호를 차례로(심35), 넓이로 x절편을 정해 다른 점(심50), 선분과 만나는 y절편의 범위(심57 — 돌리는 것이 아니라 민다),
//    그림의 식이 y = ax − b 꼴이고 보기의 식 넷을 거꾸로 가리는 것(①44·②52의 변형), 문자로 준 점에서 한 단계 더(심45), 정사각형을 가로지르는 그래프가 나눈 넓이의 비(심53).
//  그대로 뺀 것: 함수를 함수에 넣는 것(심10 — 고등), 반비례 관계의 그래프(심8 — 중1), 교점을 연립방정식으로 구해야 하는 넓이 등분(심55 — 8-1-6에 실려 있다), 뜻 없는 새 식(심18·44), 그림을 알 수 없는 것.
//  그림 설명: 공용 좌표평면은 직선의 기울기와 점의 자리를 숫자로 말한다. 그것이 답을 흘리는 그림(정사각형·사다리꼴·선분·a + b의 부호)은 relabel 로 설명을 바꾸어 그림에서 읽을 수 있는 것만 적었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C } = B.kit;
  const { LAB, MINUS, GT, LT, Q, qsub, qmul, qneg, qcmp, fl, nb, tail, js, V, nz, pm } = B.kit.mid;
  const { Board, TINT } = B.kit.mgeo;
  const { S14, S15, S16, X, Y, FN, A, BB, K, XA, YA, XI, YI, TAG6, iq, jn, par, sgn, tm, lt, ex, eqT, fxT, eq, fv, is, cmp, pt, ptj, vals, rows1, QN, missQ, xcut, FORM, pl, plOk, RATIO, signFig, SIGN_FORMS, signWord, sideWord, partWord } = B.kit.m815;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①48' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : /①|②/.test(ref) ? '수집본 기본·심화 자료(' + ref + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const HALF = frac(1, 2);
  const tagsOf = (flags, tags) => flags.map((f, i) => (f ? (tags || TAG6)[i] : '')).filter(Boolean).join(', ');
  // 함수인 것과 아닌 것의 짝: 말이 비슷하지만 하나는 y의 값이 하나로 정해지고 하나는 정해지지 않는다.
  const FUNC_PAIRS = [
    [() => `자연수 ${X}의 약수의 개수 ${Y}`, () => `자연수 ${X}의 약수 ${Y}`],
    [() => `수 ${X}의 절댓값 ${Y}`, () => `절댓값이 ${X}인 수 ${Y}`],
    [() => `자연수 ${X}보다 작은 소수의 개수 ${Y}`, () => `자연수 ${X}보다 작은 소수 ${Y}`],
    [(d) => { const k = d.pick([3, 4, 5]); return `자연수 ${X}를 ${k}${tail(k, '으로/로')} 나눈 나머지 ${Y}`; }, () => `자연수 ${X}의 배수 ${Y}`],
    [(d) => `자연수 ${X}와 ${d.pick([6, 10, 12])}의 최대공약수 ${Y}`, () => `자연수 ${X}와 서로소인 자연수 ${Y}`]
  ];
  // 직사각형 ABCD 와 변 BC 위의 점 P, 색칠한 삼각형 APC. 가로와 세로의 길이를 적는다.
  function rectFig(w, h) {
    const k = Math.min(190 / w, 110 / h), W = w * k, Hh = h * k, pA = [0, 0], pB = [0, Hh], pC = [W, Hh], pD = [W, 0], pP = [W * 0.38, Hh], b = Board();
    b.poly([pA, pB, pC, pD], 'fill:#fff').poly([pA, pP, pC], TINT).dot(pP).name(pA, 'A', 135).name(pB, 'B', 225).name(pC, 'C', 315).name(pD, 'D', 45).name(pP, 'P', 270);
    b.beside(pA, pD, `${w} cm`, pB).beside(pD, pC, `${h} cm`, pA);
    return b.svg(`직사각형 ABCD: 변 AD의 길이는 ${w} cm, 변 DC의 길이는 ${h} cm이다. 변 BC 위에 점 P가 있고, 삼각형 APC를 색칠하였다.`);
  }

  // ── 다시 실은 꼴의 도구(처음 지을 때 뺐다가 실력 묶음 끝에 덧붙인 유형들이 쓴다) ──
  const { inline, NAMES, name } = B.kit;
  const { gcd, qadd, qdiv, ansV, lastOf } = B.kit.mid;
  const { eqAB, eqAns, mulA, quadText } = B.kit.m815;
  const CC = V('c'), TT = V('t'), PP = V('p'), NN = V('n');
  const ASK = '직선을 그래프로 하는 일차함수의 식을 구하시오.';
  const times = (n, v) => (Math.abs(n) === 1 ? '' : Math.abs(n)) + v;   // 문자의 배수의 크기 부분: 2k, k
  const rel = (s) => (s > 0 ? GT : LT);
  const FOUR = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  // 공용 좌표평면의 그림 설명은 직선의 기울기와 점의 자리를 숫자로 말한다. 그것이 답을 흘리는 그림은 설명을 통째로 바꾼다.
  const relabel = (svg, label) => svg.replace(/aria-label="[^"]*"/, 'aria-label="' + label + '"');
  // 눈금 없는 좌표평면(pl 에 넘긴 o)의 x축 위 xs 인 곳에 짧은 눈금을 긋는다.
  const xTicks = (o, svg, xs) => { const u = Math.min(24, 260 / (o.x[1] - o.x[0])), py = 24 + o.y[1] * u; return svg.replace('</svg>', xs.map((x) => { const px = 16 + (x - o.x[0]) * u; return `<line x1="${px.toFixed(1)}" y1="${(py - 3.5).toFixed(1)}" x2="${px.toFixed(1)}" y2="${(py + 3.5).toFixed(1)}" style="stroke:#1f2933;stroke-width:1.3"/>`; }).join('') + '</svg>'); };
  // a, b 의 부호로 기울기와 y절편의 부호가 정해지는 식 여덟 가지(공용 일곱 가지에 y = −bx − a 를 더했다)
  const SIGN_ALL = SIGN_FORMS.concat([{ h: eqT(lt(BB + X, true), lt(A, true)), sl: MINUS + BB, ic: MINUS + A, a: (sa, sb) => -sb, b: (sa) => -sa }]);
  // 직사각형 ABCD 와 변 AD 위의 점 P, 변 BC 위의 점 Q, 색칠한 사각형 AQCP
  function twoPointFig(w, h) {
    const k = Math.min(190 / w, 110 / h), W = w * k, Hh = h * k, pA = [0, 0], pB = [0, Hh], pC = [W, Hh], pD = [W, 0], pP = [W * 0.24, 0], pQ = [W * 0.6, Hh], b = Board();
    b.poly([pA, pB, pC, pD], 'fill:#fff').poly([pA, pQ, pC, pP], TINT).dot(pP).dot(pQ).name(pA, 'A', 135).name(pB, 'B', 225).name(pC, 'C', 315).name(pD, 'D', 45).name(pP, 'P', 90).name(pQ, 'Q', 270);
    b.beside(pA, pD, `${w} cm`, pB, { t: 0.66 }).beside(pD, pC, `${h} cm`, pA);
    return b.svg(`직사각형 ABCD: 변 AD의 길이는 ${w} cm, 변 DC의 길이는 ${h} cm이다. 변 AD 위에 점 P가, 변 BC 위에 점 Q가 있고, 사각형 AQCP를 색칠하였다.`);
  }
  // 각 C가 직각인 직각삼각형 ABC 와 변 BC 위의 점 P, 색칠한 삼각형 ABP. 두 변 BC, CA 의 길이를 적는다.
  function turnFig(a, b) {
    const k = Math.min(170 / a, 120 / b), W = a * k, Hh = b * k, pB = [0, Hh], pC = [W, Hh], pA = [W, 0], pP = [W * 0.45, Hh], bd = Board();
    bd.poly([pA, pB, pC], 'fill:#fff').poly([pA, pB, pP], TINT).corner(pC, pB, pA).dot(pP).name(pA, 'A', 60).name(pB, 'B', 200).name(pC, 'C', 335).name(pP, 'P', 270);
    bd.dim(pB, pC, `${a} cm`, pA, 25).beside(pC, pA, `${b} cm`, pB);
    return bd.svg(`직각삼각형 ABC: 각 C가 직각이고, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm이다. 변 BC 위에 점 P가 있고, 삼각형 ABP를 색칠하였다.`);
  }
  // 두 그래프 사이에 놓인 정사각형: [y = mx 의 m, y = −nx + c 의 n, 점 A의 x좌표]. 한 변의 길이 mt 와 c = t(m + n + mn)이 정수이고, 그림이 휴대폰 너비에서 줄어들지 않게 오른쪽 직선의 x절편이 8 이하인 것만 골랐다.
  const SQUARES = [[Q(2), Q(1), 1], [Q(1), Q(1), 2], [Q(1), Q(1, 2), 2], [Q(3), Q(1), 1], [Q(3, 2), Q(1), 2], [Q(1, 2), Q(1), 4], [Q(2), Q(2), 1], [Q(3), Q(3, 2), 1], [Q(1), Q(2), 2], [Q(2), Q(2), 2], [Q(3), Q(2), 1], [Q(1), Q(2), 3]];

  B.addGroup('8-1-5', {
    id: 'hard', title: '실력 문제', standard: S16,
    types: [
      // ── ① 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-func-count', '말이 비슷한 대응 가운데 함수인 것 세기', '①5 심1·2', (d) => {
        // 함정: 「약수」와 「약수의 개수」, 「절댓값이 x인 수」와 「x의 절댓값」을 가리지 못하는 아이. 두 짝은 둘 다 싣고, 나머지 짝에서는 한쪽씩만 싣는다.
        const order = d.shuffle([0, 1, 2, 3, 4]), sides = [d.bool(), d.bool()];
        const rows = d.shuffle([[order[0], true], [order[0], false], [order[1], true], [order[1], false], [order[2], sides[0]], [order[3], sides[1]]].map(([k, yes]) => ({ h: FUNC_PAIRS[k][yes ? 0 : 1](d), yes })));
        const flags = rows.map((r) => r.yes), n = flags.filter(Boolean).length;
        return N(`다음 중 ${Y}가 ${X}의 함수인 것은 모두 몇 개인가?`, n, { unit: '개', standard: S14,
          figure: rows1(rows.map((r) => r.h)),
          explain: `${X}의 값 하나에 ${Y}의 값이 하나씩 정해지면 함수이다. 개수, 절댓값, 나머지, 최대공약수는 ${X}의 값마다 하나로 정해진다. 약수, 배수, 소수, 서로소인 수, 절댓값이 ${X}인 수는 여러 개이거나 없을 수 있다. 함수인 것은 ${tagsOf(flags)}의 ${n}개이다.`,
          facts: { count: flags }
        });
      }, { standard: S14 }),
      H('hard-linear-count', '정리해야 보이는 식 가운데 일차함수인 것 세기', '기본 ①14·16 ②14·15', (d) => {
        // 함정: x가 보이면 일차함수로 세는 아이(x의 항이 사라지는 식, x²이 남는 식), y = (몇) 꼴이 아니라고 빼는 아이(옮겨 적어야 하는 식).
        const rows = d.shuffle([FORM.vanish, FORM.prod, FORM.move].concat(d.shuffle([FORM.over, FORM.negParen, FORM.sum, FORM.konst, FORM.invPlus]).slice(0, 3)).map((f) => f(d)));
        const flags = rows.map((r) => r.lin), n = flags.filter(Boolean).length;
        return N(`다음 중 ${Y}가 ${X}에 대한 일차함수인 것은 모두 몇 개인가?`, n, { unit: '개',
          figure: rows1(rows.map((r) => r.h)),
          explain: `${rows.map((r, i) => (r.as ? `${TAG6[i]}은 정리하면 ${r.as}이다.` : '')).filter(Boolean).join(' ')} ${Y}가 ${X}에 대한 일차식으로 나타나는 것은 ${tagsOf(flags)}의 ${n}개이다. ${X}의 항이 사라지거나 ${X}${'<sup>2</sup>'}의 항이 남는 식, ${X}가 분모에 있는 식은 일차함수가 아니다.`,
          facts: { count: flags }
        });
      }, { standard: S15 }),
      H('hard-shift-overlap', '정리해야 기울기가 보이는 식 가운데 평행이동하면 겹쳐지는 것 세기', '심11', (d) => {
        // 함정: 괄호 앞의 수나 괄호 안의 x의 계수를 기울기로 읽는 아이. 평행이동하여도 기울기는 그대로이므로 기울기가 a인 것만 겹쳐진다.
        const a = pm(d) * d.int(2, 3), n = Math.abs(a), s = a > 0 ? 1 : -1, k = () => d.int(1, 4), c = () => nz(d, -7, 7), k1 = k(), k2 = k(), k3 = k(), swap = d.bool(), plain = d.bool();
        const rows = d.shuffle([
          { h: nb(`${Y} = ${iq(-a)}(${k1} ${MINUS} ${X})`), ok: true, as: eq(a, -a * k1) },                                    // 괄호 안의 x의 계수가 −1
          { h: nb(`${Y} = ${iq(2 * a)}(${X} ${MINUS} ${k2}) ${s > 0 ? MINUS : '+'} ${n}${X}`), ok: true, as: eq(a, -2 * a * k2) },   // 동류항을 모아야 한다
          { h: nb(`${Y} = ${iq(-a)}(${X} + ${k3})`), ok: false, as: eq(-a, -a * k3) },                                          // 기울기의 부호가 다르다
          { h: eq(Q(s, n), c()), ok: false },                                                                                   // 기울기가 역수
          swap ? { h: eqT(tm(c()), tm(a, X)), ok: true } : { h: eqT(tm(c()), tm(-a, X)), ok: false },                           // 상수항을 앞에 적은 식
          plain ? { h: eq(a, c()), ok: true } : { h: eq(-a, c()), ok: false }
        ]);
        const flags = rows.map((r) => r.ok), cnt = flags.filter(Boolean).length;
        return N(`다음 일차함수 중 그 그래프가 일차함수 ${eq(a, 0)}의 그래프를 평행이동하였을 때 겹쳐지는 것은 모두 몇 개인가?`, cnt, { unit: '개',
          figure: rows1(rows.map((r) => r.h)),
          explain: `평행이동하여도 기울기는 변하지 않으므로 기울기가 ${iq(a)}인 것만 겹쳐진다. ${rows.map((r, i) => (r.as ? `${TAG6[i]}은 정리하면 ${r.as}이다.` : '')).filter(Boolean).join(' ')} 기울기가 ${iq(a)}인 것은 ${tagsOf(flags)}의 ${cnt}개이다.`,
          facts: { count: flags }
        });
      }, { standard: S15 }),
      H('hard-slope-decrease', 'x의 값이 감소할 때 y의 값의 증가량', '심22·23', (d) => {
        // 함정: x의 값이 감소하면 x의 값의 증가량이 음수이다. 부호를 놓치면 답의 부호가 뒤집힌다.
        const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), [x1, x2] = d.until(() => [d.int(-3, 5), d.int(-5, 3)], ([u, v]) => u - v >= 2 && u - v <= 5), dy = a * (x2 - x1);
        return N(`일차함수 ${eq(a, b)}에서 ${X}의 값이 ${iq(x1)}에서 ${iq(x2)}까지 감소할 때, ${Y}의 값의 증가량은?`, dy, { signed: true, standard: S15,
          explain: `${X}의 값의 증가량은 ${iq(x2)} ${MINUS} ${par(x1)} = ${iq(x2 - x1)}이다. ${RATIO} = ${iq(a)}이므로 (${Y}의 값의 증가량) = ${iq(a)} × ${par(x2 - x1)} = ${iq(dy)}이다.`,
          facts: { value: `${jn(a)}*(${jn(x2)}-${jn(x1)})` }
        });
      }, { standard: S15 }),
      H('hard-parallel-not-same', '일치하는 것을 가려 만나지 않는 그래프 고르기', '기본 ②58·60', (d) => {
        // 함정: 기울기만 보고 고르는 아이(기울기도 y절편도 같은 식은 일치하므로 만난다), 괄호 안의 수를 그대로 기울기·y절편으로 읽는 아이.
        const k = d.pick([2, 3]), m = d.pick([2, 3]), c = d.int(1, 4), neg = d.bool(), a = neg ? -k * m : k * m, b = neg ? k * c : -k * c;
        const h = nb(`${Y} = ${k}(${neg ? `${c} ${MINUS} ${m}${X}` : `${m}${X} ${MINUS} ${c}`})`), off = d.until(() => nz(d, -3, 3), (v) => b + v !== 0);
        const rows = d.shuffle([[eq(a, b), a, b], [eq(a, b + off), a, b + off], [eq(neg ? -m : m, neg ? c : -c), neg ? -m : m, neg ? c : -c], [eq(-a, b), -a, b]]), ok = (r) => r[1] === a && r[2] !== b;
        return C(`다음 일차함수 중 그 그래프가 일차함수 ${h}의 그래프와 만나지 않는 것은?`, rows.map((r) => r[0]), rows.findIndex(ok), {
          explain: `${h}에서 ${eq(a, b)}이다. 두 그래프가 만나지 않으려면 서로 평행해야 하므로 기울기는 같고 ${YI}은 달라야 한다. ${eq(a, b)}의 그래프는 기울기도 ${YI}도 같아 일치하고, ${eq(a, b + off)}의 그래프가 평행하다.`,
          facts: { truth: rows.map(ok), want: true }
        });
      }),
      H('hard-intercept-length', '축과 만나는 점까지의 길이로 기울기 구하기', '심19', (d) => {
        // 함정: 선분의 길이를 x절편 그대로 놓는 아이. 길이는 절편의 절댓값이고, a의 부호는 문제의 조건으로 정한다.
        const k = d.pick([2, 3, 4]), b = pm(d) * k * d.int(1, 3), s = pm(d), a = s * k, h = eqT(lt(A + X), tm(b));
        return N(`일차함수 ${h}의 그래프가 ${XA}, ${YA}과 만나는 점을 각각 A, B라 하자. 선분 OB의 길이가 선분 OA의 길이의 ${k}배일 때, 수 ${A}의 값은? (단, O는 원점이고 ${cmp(A, s > 0 ? GT : LT)}이다.)`, a, { signed: true, standard: S15,
          explain: `${YI}이 ${iq(b)}이므로 선분 OB의 길이는 ${Math.abs(b)}이고, 선분 OA의 길이는 ${Math.abs(b)} ÷ ${k} = ${Math.abs(b) / k}이다. ${XI}은 ${Math.abs(b) / k} 또는 ${iq(-Math.abs(b) / k)}이다. ${cmp(A, s > 0 ? GT : LT)}이고 ${YI}이 ${signWord(b)}이므로 ${XI}은 ${iq(-b / a)}이다. ${h}에 ${is(X, -b / a)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(A, a)}이다.`,
          facts: { value: s > 0 ? `${Math.abs(b)}/(${Math.abs(b)}/${k})` : `0-${Math.abs(b)}/(${Math.abs(b)}/${k})`, unseen: [0] }
        });
      }, { standard: S15 }),
      H('hard-slope-ratios', '삼각형의 내부의 점과 세 기울기의 크기 비교', '심27', (d) => {
        // 세 분수는 직선 OA, OC, CA의 기울기이다. 점 C가 삼각형 AOB의 내부에 있으므로 (OC의 기울기) < (OA의 기울기) < (CA의 기울기)이다.
        const P = V('p'), Qv = V('q'), sOA = frac(BB, A), sOC = frac(Qv, P), sCA = frac(`${BB} ${MINUS} ${Qv}`, `${A} ${MINUS} ${P}`), [ax, ay, cx, cy] = d.pick([[4, 5, 3, 2], [5, 4, 3, 1], [4, 4, 3, 2], [5, 5, 4, 2]]);
        // 세 견주기: [작은 쪽, 큰 쪽]. 문장마다 부등호의 방향을 따로 정한다.
        const pairs = [[sOC, sOA], [sOA, sCA], [sOC, sCA]], mk = ([lo, hi]) => { const ok = d.bool(), gt = d.bool(), flip = ok === gt; return { h: nb(`${flip ? hi : lo} ${gt ? GT : LT} ${flip ? lo : hi}`), ok }; };
        const rows = d.until(() => d.shuffle(pairs).map(mk), (list) => { const n = list.filter((r) => r.ok).length; return n === 1 || n === 2; });
        const flags = rows.map((r) => r.ok), sets = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]], right = sets.findIndex((set) => set.length === flags.filter(Boolean).length && set.every((i) => flags[i]));
        const others = d.shuffle(sets.map((_, i) => i).filter((i) => i !== right)).slice(0, 3), opts = d.shuffle([right].concat(others));
        return C(`그림과 같이 제1사분면 위의 점 A${nb(`(${A}, ${BB})`)}에서 ${XA}에 내린 수선이 ${XA}과 만나는 점을 B라 하고, 삼각형 AOB의 내부의 한 점을 C${nb(`(${P}, ${Qv})`)}라 할 때, 다음 중 옳은 것을 모두 고른 것은? (단, O는 원점이다.)`, opts.map((i) => sets[i].map((j) => LAB[j]).join(', ')), opts.indexOf(right), {
          figure: pl({ x: [-1, ax + 1], y: [-1, ay + 1], grid: false, ticks: 'none', poly: [[0, 0], [ax, 0], [ax, ay]], points: [{ x: ax, y: ay, name: 'A', side: 'ur' }, { x: ax, y: 0, name: 'B', side: 'dr' }, { x: cx, y: cy, name: 'C', side: 'dr' }] }) + rows1(rows.map((r) => r.h), LAB),
          explain: `${sOA}, ${sOC}, ${sCA}는 차례로 직선 OA, OC, CA의 기울기이다. 점 C가 삼각형 AOB의 내부에 있으므로 직선 OC는 직선 OA보다 덜 기울어져 있고, 직선 CA는 직선 OA보다 더 기울어져 있다. 따라서 ${nb(`${sOC} ${LT} ${sOA} ${LT} ${sCA}`)}이고, 옳은 것은 ${tagsOf(flags, LAB)}이다.`,
          facts: { truth: opts.map((i) => i === right), want: true }
        });
      }, { standard: S15 }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-value-chain', '식의 수를 구하고 함숫값의 셈이 다시 함숫값이 되는 x의 값 구하기', '심7', (d) => {
        // a 구하기 → 함숫값 둘 → 셈 → 그 값이 되는 x의 값
        const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), p = nz(d, -3, 3), v = a * p + b, [c1, c2] = d.pick([[2, 1], [3, 2]]), [x1, x2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([u, w]) => u !== w), f = (x) => a * x + b, t = c1 * f(x1) - c2 * f(x2), kv = c1 * x1 - c2 * x2;
        const av = `(${jn(v)}-${jn(b)})/${jn(p)}`, fx1 = `(${av}*${jn(x1)}+${jn(b)})`, fx2 = `(${av}*${jn(x2)}+${jn(b)})`, sec = c2 === 1 ? fv(x2) : c2 + fv(x2);
        return N(`함수 ${fxT(lt(A + X), tm(b))}에 대하여 ${is(fv(p), v)}일 때, ${nb(`${c1}${fv(x1)} ${MINUS} ${sec} = ${fv(K)}`)}를 만족시키는 ${K}의 값은? (단, ${A}는 수이다.)`, kv, { signed: true, standard: S14,
          explain: `${fv(p)} = ${ex(lt(Math.abs(p) === 1 ? A : Math.abs(p) + A, p < 0), tm(b))} = ${iq(v)}에서 ${is(A, a)}이다. ${is(fv(x1), f(x1))}, ${is(fv(x2), f(x2))}이므로 ${c1}${fv(x1)} ${MINUS} ${sec} = ${iq(t)}이다. ${fv(K)} = ${ex(lt(Math.abs(a) + K, a < 0), tm(b))} = ${iq(t)}에서 ${is(K, kv)}이다.`,
          facts: { value: `(${c1}*${fx1}-${c2 === 1 ? '' : c2 + '*'}${fx2}-${jn(b)})/(${av})` }
        });
      }, { standard: S14 }),
      H('hard-two-points-shift', '두 점을 지나는 그래프를 평행이동한 그래프가 지나는 점', '심16', (d) => {
        // 기울기 → 식 → 평행이동 → 대입
        const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), s = d.until(() => nz(d, -6, 6), (v) => v + b !== 0), [x1, x2, x3] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3), nz(d, -4, 4)], ([u, v, w]) => u !== v && w !== u && w !== v), y1 = a * x1 + b, y2 = a * x2 + b, kv = a * x3 + b + s;
        return N(`두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지나는 일차함수의 그래프를 ${YA}의 방향으로 ${iq(s)}만큼 평행이동하면 점 ${pt(x3, K)}를 지난다. ${K}의 값은?`, kv, { signed: true,
          explain: `두 점을 지나는 직선의 기울기는 ${frac(`${iq(y2)} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${iq(a)}이고, 점 ${ptj(x1, y1, '을/를')} 지나므로 식은 ${eq(a, b)}이다. 평행이동한 그래프의 식은 ${eq(a, b + s)}이고, ${is(X, x3)}${tail(Math.abs(x3), '을/를')} 대입하면 ${is(K, kv)}이다.`,
          facts: { value: `${jn(y1)}+(${jn(y2)}-${jn(y1)})*(${jn(x3)}-${jn(x1)})/(${jn(x2)}-${jn(x1)})+${jn(s)}` }
        });
      }),
      H('hard-diff-slope', '함숫값의 차로 기울기를 알아 x절편 구하기', '심24', (d) => {
        // 함숫값의 차를 x의 값의 차로 나누면 기울기이다 → y축 위에서 만나므로 y절편 → x절편
        const a = pm(d) * d.int(2, 4), p = nz(d, -4, 4), q = -a * p, [x1, x2] = d.until(() => [d.int(-4, 3), d.int(-3, 5)], ([u, v]) => v - u >= 2 && v - u <= 6), D = a * (x2 - x1), a2 = d.until(() => pm(d) * d.int(2, 6), (v) => v !== a);
        return N(`일차함수 ${nb(`${Y} = ${FN}(${X})`)}에 대하여 ${nb(`${fv(x2)} ${MINUS} ${fv(x1)} = ${iq(D)}`)}이고, 이 함수의 그래프가 일차함수 ${eq(a2, q)}의 그래프와 ${YA} 위에서 만난다. 일차함수 ${nb(`${Y} = ${FN}(${X})`)}의 그래프의 ${XI}은?`, p, { signed: true,
          explain: `${X}의 값이 ${iq(x1)}에서 ${iq(x2)}까지 ${x2 - x1}만큼 증가할 때 함숫값이 ${iq(D)}만큼 증가하므로 기울기는 ${frac(iq(D), x2 - x1)} = ${iq(a)}이다. ${YA} 위에서 만나므로 ${YI}은 ${iq(q)}이고, ${fxT(tm(a, X), tm(q))}이다. ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${XI}은 ${iq(p)}이다.`,
          facts: { value: `(0-${jn(q)})*(${jn(x2)}-${jn(x1)})/${jn(D)}`, unseen: [0] }
        });
      }),
      H('hard-collinear-xint', '세 점이 한 직선 위에 있을 조건으로 미지수를 구해 x절편 구하기', '심26', (d) => {
        // 두 기울기가 같다는 식으로 k → 기울기 → 식 → x절편
        const c = d.until(() => {
          const a = pm(d) * d.int(2, 3), p = nz(d, -4, 4), b = -a * p, [x1, x2, x3] = d.shuffle([-3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3), kv = nz(d, -4, 4), j = d.pick([2, 3]);
          return { a, p, b, x1, x2, x3, kv, j, y1: a * x1 + b, c2: a * x2 + b - kv, c3: a * x3 + b - j * kv };
        }, (v) => v.x1 !== v.p && v.x2 !== v.p && v.x3 !== v.p && v.c2 !== 0 && v.c3 !== 0 && (v.x3 - v.x1) !== v.j * (v.x2 - v.x1) && Math.abs(v.c2) <= 12 && Math.abs(v.c3) <= 15 && Math.abs(v.y1) <= 15);
        const { a, p, b, x1, x2, x3, kv, j, y1, c2, c3 } = c, yB = ex(lt(K), tm(c2)), yC = ex(lt(j + K), tm(c3));
        const kx = `((${jn(c3)}-${jn(y1)})*(${jn(x2)}-${jn(x1)})-(${jn(c2)}-${jn(y1)})*(${jn(x3)}-${jn(x1)}))/((${jn(x3)}-${jn(x1)})-${j}*(${jn(x2)}-${jn(x1)}))`, sl = `((${kx})+${jn(c2)}-${jn(y1)})/(${jn(x2)}-${jn(x1)})`;
        return N(`세 점 ${pt(x1, y1)}, ${pt(x2, yB)}, ${pt(x3, yC)}${tail(Math.abs(c3), '을/를')} 지나는 일차함수의 그래프의 ${XI}은?`, p, { signed: true,
          explain: `한 직선 위의 점은 어느 두 점으로 구해도 기울기가 같으므로 ${frac(`${yB} ${MINUS} ${par(y1)}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${frac(`${yC} ${MINUS} ${par(y1)}`, `${iq(x3)} ${MINUS} ${par(x1)}`)}에서 ${is(K, kv)}이다. 그래프는 두 점 ${pt(x1, y1)}, ${ptj(x2, kv + c2, '을/를')} 지나므로 기울기는 ${iq(a)}이고 식은 ${eq(a, b)}이다. ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${XI}은 ${iq(p)}이다.`,
          facts: { value: `${jn(x1)}-${jn(y1)}/(${sl})` }
        });
      }),
      H('hard-signs-other-graph', '그래프에서 읽은 a, b의 부호로 다른 일차함수의 그래프가 지나지 않는 사분면 구하기', '기본 ①44 ②52', (d) => {
        // 그림에서 a, b의 부호 → 다른 식의 기울기와 y절편의 부호 → 지나지 않는 사분면. 묻는 식은 a와 b의 자리가 바뀌어 있다.
        const ga = pm(d), gb = pm(d), f = d.pick([SIGN_FORMS[3], SIGN_FORMS[4], SIGN_FORMS[5]]), ra = f.a(ga, gb), rb = f.b(ga, gb), miss = missQ(ra, rb);
        return C(`일차함수 ${SIGN_FORMS[0].h}의 그래프가 그림과 같을 때, 일차함수 ${f.h}의 그래프가 지나지 않는 사분면은?`, QN, miss, {
          figure: signFig(d, ga, gb),
          explain: `그림의 그래프가 오른쪽 ${sideWord(ga)}로 향하고 ${YA}과 ${partWord(gb)}의 부분에서 만나므로 ${cmp(A, ga > 0 ? GT : LT)}, ${cmp(BB, gb > 0 ? GT : LT)}이다. ${f.h}의 그래프는 기울기 ${f.sl}${tail(2, '이/가')} ${signWord(ra)}, ${YI} ${f.ic}${tail(2, '이/가')} ${signWord(rb)}이므로 ${QN[miss]}을 지나지 않는다.`,
          facts: { truth: QN.map((_, i) => i === miss), want: true }
        });
      }),
      H('hard-slope-range', '선분과 만나도록 하는 기울기의 범위', '①38 ②41 심58', (d) => {
        // 그래프는 늘 y축 위의 한 점을 지난다. 선분의 두 끝 점을 지날 때의 기울기가 범위의 두 끝이다. 틀린 범위: y절편을 놓치고 구한 끝 값을 섞은 것.
        const fig = (v) => ({ x: [-1, v.x2 + 1], y: [Math.min(v.c, 0) - 1, Math.max(v.y1, v.y2) + 1], grid: false, ticks: 'none', lines: [{ a: Q(v.s1.p * v.s2.q + v.s2.p * v.s1.q, 2 * v.s1.q * v.s2.q), b: v.c }], segs: [[v.x1, v.y1, v.x2, v.y2]],
          points: [{ x: v.x1, y: v.y1, name: 'A', side: v.y1 > v.y2 ? 'ur' : 'ul', guide: true }, { x: v.x2, y: v.y2, name: 'B', side: v.y1 > v.y2 ? 'ur' : 'dr', guide: true }], xnums: [{ v: v.x1 }, { v: v.x2 }], ynums: [{ v: v.y1 }, { v: v.y2 }, { v: v.c }] });
        const c = d.until(() => { const cc = pm(d) * d.int(1, 2), x1 = d.int(1, 2), x2 = d.int(3, 5), y1 = d.int(1, 5), y2 = d.int(1, 5); return { c: cc, x1, x2, y1, y2, s1: Q(y1 - cc, x1), s2: Q(y2 - cc, x2), w1: Q(y1, x1), w2: Q(y2, x2) }; },
          (v) => v.y1 !== v.y2 && v.s1.p > 0 && v.s2.p > 0 && v.s1.q <= 4 && v.s2.q <= 4 && qcmp(v.s1, v.s2) !== 0 && new Set([v.s1, v.s2, v.w1, v.w2].map(fl)).size === 4 && plOk(fig(v)));
        const lo = qcmp(c.s1, c.s2) < 0 ? c.s1 : c.s2, hi = qcmp(c.s1, c.s2) < 0 ? c.s2 : c.s1, wLo = qcmp(c.w1, c.w2) < 0 ? c.w1 : c.w2, wHi = qcmp(c.w1, c.w2) < 0 ? c.w2 : c.w1, h = eqT(lt(A + X), tm(c.c));
        const span = (u, v) => (qcmp(u, v) < 0 ? [u, v] : [v, u]), cands = [[lo, hi], span(lo, wHi), span(wLo, hi), [wLo, wHi]], rows = d.shuffle(cands), same = (r) => qcmp(r[0], lo) === 0 && qcmp(r[1], hi) === 0;
        return C(`그림과 같이 좌표평면 위에 두 점 A${pt(c.x1, c.y1)}, B${pt(c.x2, c.y2)}${tail(c.y2, '이/가')} 있다. 일차함수 ${h}의 그래프가 선분 AB와 만나도록 하는 수 ${A}의 값의 범위는?`, rows.map((r) => nb(`${iq(r[0])} ≤ ${A} ≤ ${iq(r[1])}`)), rows.findIndex(same), {
          figure: pl(fig(c)),
          explain: `${h}의 그래프는 ${A}의 값에 관계없이 점 ${ptj(0, c.c, '을/를')} 지난다. 점 A를 지날 때 ${A} = ${frac(`${c.y1} ${MINUS} ${par(c.c)}`, c.x1)} = ${iq(c.s1)}, 점 B를 지날 때 ${A} = ${frac(`${c.y2} ${MINUS} ${par(c.c)}`, c.x2)} = ${iq(c.s2)}이다. 그래프가 선분 AB와 만나려면 기울기가 이 두 값 사이에 있어야 하므로 ${nb(`${iq(lo)} ≤ ${A} ≤ ${iq(hi)}`)}이다.`,
          facts: { truth: rows.map(same), want: true }
        });
      }),
      H('hard-area-two-graphs', '두 그래프와 y축으로 둘러싸인 도형의 넓이', '심51', (d) => {
        // 두 그래프의 x절편이 같아 x축 위에서 만난다는 것을 알아채야 한다: 밑변은 두 y절편 사이의 선분, 높이는 x절편의 절댓값.
        const c = d.until(() => { const p = pm(d) * d.int(2, 4), a1 = d.int(2, 4), a2 = -d.int(2, 4); return { p, a1, a2, b1: -a1 * p, b2: -a2 * p }; }, (v) => (Math.abs(v.b1 - v.b2) * Math.abs(v.p)) % 2 === 0 && v.a1 !== -v.a2);
        const { p, a1, a2, b1, b2 } = c, base = Math.abs(b1 - b2), area = base * Math.abs(p) / 2, hiB = Math.max(b1, b2), loB = Math.min(b1, b2), first = hiB === b1 ? [b1, a1] : [b2, a2];
        return N(`두 일차함수 ${eq(a1, b1)}, ${eq(a2, b2)}의 그래프와 ${YA}으로 둘러싸인 도형의 넓이는?`, area, {
          explain: `두 그래프의 ${XI}은 모두 ${iq(p)}이므로 두 그래프는 점 ${pt(p, 0)}에서 만난다. 두 그래프의 ${YI}은 ${iq(b1)}, ${iq(b2)}이므로 둘러싸인 도형은 밑변의 길이가 ${iq(hiB)} ${MINUS} ${par(loB)} = ${base}, 높이가 ${Math.abs(p)}인 삼각형이다. 넓이는 ${HALF} × ${base} × ${Math.abs(p)} = ${area}이다.`,
          facts: { value: `(${jn(hiB)}-${jn(loB)})*${Math.abs(first[0])}/${Math.abs(first[1])}/2`, unseen: [2] }
        });
      }),
      H('hard-area-shift', '평행이동한 두 그래프와 두 축으로 둘러싸인 도형의 넓이', '심52', (d) => {
        // 두 그래프의 절편 넷 → 큰 삼각형의 넓이에서 작은 삼각형의 넓이를 뺀다.
        const [ap, aq, b, s] = d.pick([[1, 2, 4, 2], [1, 2, 3, 2], [1, 2, 4, 3], [2, 1, 6, 2], [2, 1, 6, 4], [2, 1, 8, 4], [2, 3, 4, 2], [3, 2, 6, 3]]), sg = pm(d), a = Q(sg * ap, aq), nbv = b - s;
        const x1 = -sg * b * aq / ap, x2 = -sg * nbv * aq / ap, big = b * b * aq / ap / 2, small = nbv * nbv * aq / ap / 2, area = big - small, lo = Math.min(x1, 0), hi = Math.max(x1, 0);
        return N(`그림과 같이 일차함수 ${eq(a, b)}의 그래프와 이 그래프를 ${YA}의 방향으로 ${iq(-s)}만큼 평행이동한 그래프가 있다. 두 그래프와 ${XA}, ${YA}으로 둘러싸인 색칠한 부분의 넓이는?`, area, {
          figure: pl({ x: [Math.floor(lo) - 1, Math.ceil(hi) + 1], y: [-1, b + 1], grid: false, ticks: 'none', poly: [[x1, 0], [x2, 0], [0, nbv], [0, b]], lines: [{ a, b }, { a, b: nbv }], say: '두 직선과 두 축 사이의 부분을 색칠하였다.' }),
          explain: `평행이동한 그래프의 식은 ${eq(a, nbv)}이다. ${eq(a, b)}의 그래프의 ${XI}은 ${iq(x1)}, ${YI}은 ${b}이고, ${eq(a, nbv)}의 그래프의 ${XI}은 ${iq(x2)}, ${YI}은 ${nbv}이다. 색칠한 부분의 넓이는 큰 삼각형의 넓이에서 작은 삼각형의 넓이를 뺀 ${HALF} × ${Math.abs(x1)} × ${b} ${MINUS} ${HALF} × ${Math.abs(x2)} × ${nbv} = ${area}이다.`,
          facts: { value: `(${b}*${b}-(${b}-${s})*(${b}-${s}))${aq === 1 ? '' : '*' + aq}/${ap}/2`, unseen: [2] }
        });
      }),
      H('hard-parallel-two-points', '미지수가 든 두 점을 지나는 그래프가 평행할 때 y절편 구하기', '심42', (d) => {
        // 두 점의 기울기를 k로 나타내어 평행한 그래프의 기울기와 같게 놓는다 → k → 한 점 → y절편
        const c = d.until(() => { const a = pm(d) * d.int(2, 3), j = d.pick([2, 3]), kv = nz(d, -4, 4), x1 = nz(d, -3, 3), x2 = nz(d, -3, 4); return { a, j, kv, x1, x2, cc: (j + 1) * kv + a * (x2 - x1), yi: kv - a * x1 }; }, (v) => v.x1 < v.x2 && v.cc !== 0 && v.yi !== 0 && Math.abs(v.cc) <= 20);
        const { a, j, kv, x1, x2, cc, yi } = c, y2 = ex(tm(cc), lt(j + K, true)), other = d.until(() => nz(d, -7, 7), (v) => v !== yi), kx = `(${jn(cc)}-${jn(a)}*(${jn(x2)}-${jn(x1)}))/(${j}+1)`;
        return N(`두 점 ${pt(x1, K)}, ${pt(x2, y2)}를 지나는 일차함수의 그래프가 일차함수 ${eq(a, other)}의 그래프와 평행할 때, 이 그래프의 ${YI}은?`, yi, { signed: true,
          explain: `두 점을 지나는 직선의 기울기는 ${frac(`${y2} ${MINUS} ${K}`, `${iq(x2)} ${MINUS} ${par(x1)}`)} = ${frac(ex(tm(cc), lt((j + 1) + K, true)), x2 - x1)}이다. 평행한 두 그래프는 기울기가 같으므로 이 값이 ${iq(a)}이고, ${is(K, kv)}이다. ${eqT(tm(a, X), lt(BB))}에 ${is(X, x1)}, ${is(Y, kv)}${tail(Math.abs(kv), '을/를')} 대입하면 ${is(BB, yi)}이므로 ${YI}은 ${iq(yi)}이다.`,
          facts: { value: `${kx}-${jn(a)}*${jn(x1)}`, unseen: [1] }
        });
      }),
      H('hard-use-equal', '두 양이 같아지는 때 구하기', '심62', (d) => {
        // 식 둘을 세우고(몇 분마다의 변화를 1분마다로), 두 식의 값이 같아지는 x의 값을 구한다.
        const c = d.until(() => { const m = d.pick([3, 4, 5]), ra = d.int(2, 4), rb = ra + d.int(1, 2), LA = d.pick([40, 50, 60]), LB = LA + d.pick([10, 20, 30]); return { m, ra, rb, LA, LB, t: (LB - LA) * m / (rb - ra) }; }, (v) => Number.isInteger(v.t) && v.LA - v.ra * v.t / v.m > 0);
        const { m, ra, rb, LA, LB, t } = c;
        return N(`물통 A에는 ${LA} L, 물통 B에는 ${LB} L의 물이 들어 있다. 두 물통에서 동시에 물이 빠져나가기 시작하여 A에서는 ${m}분마다 ${ra} L씩, B에서는 ${m}분마다 ${rb} L씩 일정하게 물이 빠져나간다. 두 물통에 남아 있는 물의 양이 같아지는 것은 물이 빠져나가기 시작한 지 몇 분 후인가?`, t, { unit: '분',
          explain: `물이 빠져나가기 시작한 지 ${X}분 후에 남아 있는 물의 양을 ${Y} L라 하면 A는 ${eq(Q(-ra, m), LA)}, B는 ${eq(Q(-rb, m), LB)}이다. ${ex(tm(Q(-ra, m), X), tm(LA))} = ${ex(tm(Q(-rb, m), X), tm(LB))}에서 ${ex(tm(Q(rb - ra, m), X))} = ${LB - LA}이므로 ${is(X, t)}이다.`,
          facts: { value: `(${LB}-${LA})*${m}/(${rb}-${ra})` }
        });
      }),
      H('hard-use-clock', '처음 양이 따로 있는 상황에서 시각 구하기', '기본 ②78', (d) => {
        // 몇 분마다의 양을 식으로 옮기고, 걸린 시간을 구한 뒤 시각으로 바꾼다.
        const m = d.pick([20, 30]), r = d.pick([100, 150, 200]), W0 = d.pick([600, 900, 1200]), hh = d.int(2, 8), mi = m === 20 ? d.pick([20, 40]) : 30, T = 60 * hh + mi, W = W0 + r * T / m, tx = `(${W}-${W0})*${m}/${r}`;
        return M(`어느 저수지에서 오전에 ${W0} t의 물을 흘려보내고 수문을 닫았다가, 낮 12시부터 다시 수문을 열어 ${m}분마다 ${r} t씩 일정하게 물을 흘려보낸다. 이날 흘려보낸 물의 양이 모두 ${W} t이 되는 시각은 오후 몇 시 몇 분인가?`, [{ lead: '오후', answer: hh, unit: '시' }, { answer: mi, unit: '분' }], {
          shown: `오후 ${hh}시 ${mi}분`,
          explain: `낮 12시부터 ${X}분 동안 흘려보낸 뒤의 물의 양을 ${Y} t이라 하면 ${eq(Q(r, m), W0)}이다. ${is(Y, W)}${tail(W, '을/를')} 대입하면 ${is(X, T)}이다. ${T}분은 ${hh}시간 ${mi}분이므로 오후 ${hh}시 ${mi}분이다.`,
          facts: { calc: [[`(${tx}-${tx}%60)/60`, 0], [`${tx}%60`, 1]], unseen: [60] }
        });
      }),
      H('hard-moving-point', '직사각형의 변 위를 움직이는 점이 만드는 삼각형의 넓이', '②79 심63', (d) => {
        // 밑변 PC의 길이를 x의 식으로 나타내야 한다(넓이가 줄어든다). 식 → 넓이가 주어진 값이 되는 때
        const v = d.pick([1, 2]), h = d.pick([6, 8, 10, 12]), w = d.pick([12, 16, 18, 20]), t = d.until(() => d.int(2, 8), (u) => v * u < w), S = (w - v * t) * h / 2;
        return N(`그림과 같이 가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형 ABCD에서 점 P가 꼭짓점 B를 출발하여 변 BC를 따라 꼭짓점 C까지 매초 ${v} cm의 빠르기로 움직인다. 삼각형 APC의 넓이가 ${S} cm²가 되는 것은 점 P가 출발한 지 몇 초 후인가?`, t, { unit: '초',
          figure: rectFig(w, h),
          explain: `출발한 지 ${X}초 후 선분 BP의 길이는 ${v === 1 ? '' : v}${X} cm이므로 선분 PC의 길이는 (${w} ${MINUS} ${v === 1 ? '' : v}${X}) cm이다. 삼각형 APC의 넓이를 ${Y} cm²라 하면 ${Y} = ${HALF} × (${w} ${MINUS} ${v === 1 ? '' : v}${X}) × ${h}, 곧 ${eqT(tm(-v * h / 2, X), tm(w * h / 2))}이다. ${is(Y, S)}${tail(S, '을/를')} 대입하면 ${is(X, t)}이다.`,
          facts: { value: `(${w}-2*${S}/${h})/${v}`, unseen: [2] }
        });
      }),
      // ── 다시 실은 꼴 ── 처음 지을 때 「복잡한 활용」「경우 나누기·요령」「한 유형만」이라는 까닭으로 뺐다가 덧붙였다(2026-10-13). 까닭은 파일 머리에 적었다.
      H('hard-lap-ahead', '늦게 출발한 사람이 트랙을 한 바퀴 앞서는 때 구하기', '기본 ①73', (d) => {
        // ② 두 사람이 간 거리를 저마다 식으로 → 늦게 출발한 사람이 간 시간은 (x − t0)분 → 간 거리의 차가 트랙의 둘레 → 늦게 출발한 사람의 시간으로 고친다.
        const c = d.until(() => { const v1 = d.pick([40, 50, 60, 80]), v2 = v1 + d.pick([60, 80, 100, 120]), t0 = d.int(1, 3), P = d.pick([240, 300, 360, 400, 480]); return { v1, v2, t0, P, t: (P + v1 * t0) / (v2 - v1) }; }, (v) => Number.isInteger(v.t) && v.t >= 2 && v.t <= 12 && 2 * v.v1 * v.t0 < v.P);
        const { v1, v2, t0, P, t } = c, [n1, n2] = d.shuffle(NAMES).slice(0, 2);
        return N(`${name(n1, '이/가')} 둘레의 길이가 ${P} m인 트랙을 분속 ${v1} m로 걷기 시작하였다. ${t0}분 후 ${name(n2, '이/가')} 같은 곳에서 출발하여 같은 방향으로 분속 ${v2} m로 달리기 시작하였다. ${name(n2, '이/가')} ${name(n1, '을/를')} 정확히 한 바퀴 앞서게 되는 것은 ${name(n2, '이/가')} 출발한 지 몇 분 후인가? (단, 두 사람의 속력은 각각 일정하다.)`, t, { unit: '분',
          explain: `${name(n1, '이/가')} 출발한 지 ${X}분 후에 두 사람이 간 거리를 ${Y} m라 하면 ${name(n1, '은/는')} ${eq(v1, 0)}, ${name(n2, '은/는')} ${nb(`${Y} = ${v2}(${X} ${MINUS} ${t0})`)}이다. 한 바퀴 앞서면 간 거리의 차가 ${P} m이므로 ${nb(`${v2}(${X} ${MINUS} ${t0}) ${MINUS} ${v1}${X} = ${P}`)}에서 ${is(X, t + t0)}이다. ${name(n2, '은/는')} ${t0}분 늦게 출발하였으므로 ${name(n2, '이/가')} 출발한 지 ${t}분 후이다.`,
          facts: { value: `(${P}+${v1}*${t0})/(${v2}-${v1})` }
        });
      }),
      H('hard-two-moving-points', '따로 움직이는 두 점이 만드는 사각형의 넓이', '심64', (d) => {
        // ② 두 선분 AP, QC의 길이를 x의 식으로 → 사다리꼴의 넓이의 식 → 넓이가 주어진 때 → 그때의 선분 QC의 길이
        const c = d.until(() => { const h = d.pick([6, 8, 10, 12]), w = d.pick([16, 18, 20, 24]), p = d.int(1, 2), q = d.int(3, 5), t = d.int(2, 5); return { h, w, p, q, t, S: h * (w - (q - p) * t) / 2, qc: w - q * t }; }, (v) => v.qc >= 2);
        const { h, w, p, q, t, S, qc } = c, px = times(p, X), qx = times(q, X);
        return N(`그림과 같이 가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형 ABCD에서 점 P는 꼭짓점 A를 출발하여 변 AD를 따라 꼭짓점 D까지 매초 ${p} cm의 빠르기로 움직이고, 점 Q는 꼭짓점 B를 출발하여 변 BC를 따라 꼭짓점 C까지 매초 ${q} cm의 빠르기로 움직인다. 두 점 P, Q가 동시에 출발하였을 때, 사각형 AQCP의 넓이가 ${S} cm²가 되는 순간의 선분 QC의 길이는 몇 cm인가?`, qc, { unit: 'cm',
          figure: twoPointFig(w, h),
          explain: `출발한 지 ${X}초 후 선분 AP의 길이는 ${px} cm, 선분 BQ의 길이는 ${qx} cm이므로 선분 QC의 길이는 (${w} ${MINUS} ${qx}) cm이다. 사각형 AQCP는 두 변 AP, QC가 평행한 사다리꼴이므로 넓이를 ${Y} cm²라 하면 ${Y} = ${HALF} × {${px} + (${w} ${MINUS} ${qx})} × ${h}, 곧 ${eqT(tm(-h * (q - p) / 2, X), tm(w * h / 2))}이다. ${is(Y, S)}${tail(S, '을/를')} 대입하면 ${is(X, t)}이므로 선분 QC의 길이는 ${w} ${MINUS} ${q} × ${t} = ${qc}(cm)이다.`,
          facts: { value: `${w}-${q}*(${w}-2*${S}/${h})/(${q}-${p})`, unseen: [2] }
        });
      }),
      H('hard-moving-point-turn', '꼭짓점을 돌아 움직이는 점이 만드는 삼각형의 넓이', '심65', (d) => {
        // ② 점 P가 어느 변 위에 있는가에 따라 밑변과 높이가 달라진다. 변 CA 위에서는 밑변 AP의 길이가 (a + b − x) cm이다.
        const [a, b] = d.pick([[6, 8], [8, 6], [4, 6], [6, 4], [4, 8], [8, 4], [6, 10], [10, 6], [8, 10], [10, 8], [4, 10], [10, 4]]), m1 = b / 2, m2 = -a / 2, c2 = a * (a + b) / 2;
        return inline(`그림과 같이 ∠C = 90°이고 변 BC의 길이가 ${a} cm, 변 CA의 길이가 ${b} cm인 직각삼각형 ABC가 있다. 점 P가 꼭짓점 B를 출발하여 꼭짓점 C를 거쳐 꼭짓점 A까지 변을 따라 움직인다. 점 P가 움직인 거리를 ${X} cm, 삼각형 ABP의 넓이를 ${Y} cm²라 할 때, 점 P가 ㉠ 변 BC 위에 있을 때와 ㉡ 변 CA 위에 있을 때로 나누어 ${Y}를 ${X}에 대한 식으로 나타내시오. (단, 점 P가 꼭짓점 위에 있을 때는 생각하지 않는다.)`,
          `㉠ 변 BC 위에 있을 때<br>${Y} = {0}${X}<br>㉡ 변 CA 위에 있을 때<br>${Y} = {1}${X} {2}`, [{ answer: m1, signed: true }, { answer: m2, signed: true }, { answer: c2, signed: true }], {
            shown: `㉠ ${eq(m1, 0)}, ㉡ ${eq(m2, c2)}`,
            figure: turnFig(a, b),
            explain: `㉠ 점 P가 변 BC 위에 있으면 밑변 BP의 길이가 ${X} cm, 높이가 변 CA의 길이 ${b} cm이므로 ${Y} = ${HALF} × ${X} × ${b}, 곧 ${eq(m1, 0)}이다. ㉡ 점 P가 변 CA 위에 있으면 밑변 AP의 길이가 (${a + b} ${MINUS} ${X}) cm, 높이가 변 BC의 길이 ${a} cm이므로 ${Y} = ${HALF} × (${a + b} ${MINUS} ${X}) × ${a}, 곧 ${eq(m2, c2)}이다.`,
            facts: { calc: [[`${b}/2`, 0], [`0-${a}/2`, 1], [`${a}*(${a}+${b})/2`, 2]], unseen: [0, 2] }
          });
      }),
      H('hard-xgap', 'x축과 만나는 두 점 사이의 거리로 수 구하기', '①52 심20', (d, n) => {
        if (n === 0) {
          // ② 평행 → 기울기, 한 그래프의 x절편 → 거리가 주어진 점은 양쪽에 하나씩 → 조건으로 하나를 고른다.
          const c = d.until(() => { const [mp, mq] = d.pick([[2, 1], [3, 1], [1, 2], [3, 2], [2, 3]]), m = Q(pm(d) * mp, mq), j = nz(d, -3, 3), l = Math.abs(j) + d.int(1, 3), e = pm(d); return { m, p: mq * j, c1: -m.p * j, L: mq * l, e, b: -m.p * (j + e * l) }; }, (v) => Math.abs(v.b) <= 20);
          const { m, p, c1, L, e, b } = c, bOf = (x) => -m.p * x / m.q;
          return N(`두 일차함수 ${eq(m, c1)}, ${eqAB}의 그래프가 서로 평행하고, 두 그래프가 ${XA}과 만나는 점을 각각 P, Q라 하자. 선분 PQ의 길이가 ${L}일 때, 수 ${BB}의 값은? (단, ${cmp(BB, rel(b))}이다.)`, b, { signed: true,
            explain: `두 그래프가 서로 평행하므로 ${is(A, m)}이다. ${eq(m, c1)}의 그래프의 ${XI}은 ${iq(p)}이므로 P${pt(p, 0)}이다. 선분 PQ의 길이가 ${L}이므로 점 Q의 ${X}좌표는 ${iq(p)} + ${L} = ${iq(p + L)} 또는 ${iq(p)} ${MINUS} ${L} = ${iq(p - L)}이다. ${eqT(tm(m, X), lt(BB))}에 대입하면 ${is(BB, bOf(p + L))} 또는 ${is(BB, bOf(p - L))}이고, ${cmp(BB, rel(b))}이므로 ${is(BB, b)}이다.`,
            facts: { value: `${jn(c1)}${e > 0 ? '-' : '+'}${mulA(m, L)}` }
          });
        }
        // ② 거리가 주어진 점이 양쪽에 있어 답이 둘이다. 보기를 고르는 아이: 한쪽만 구한 아이(둘), 부호를 놓친 아이.
        const c = d.until(() => { const pq = nz(d, -4, 4), L = d.int(1, 6), k = nz(d, -12, 12), m2 = pq % 2 === 0 && d.bool() ? Q(pm(d) * d.pick([1, 3]), 2) : Q(pm(d) * d.int(2, 3)); return { pq, L, k, m2, u: pq - L, v: pq + L }; }, (w) => w.u !== 0 && w.v !== 0 && w.k % w.u === 0 && w.k % w.v === 0);
        const { pq, L, k, m2, u, v } = c, a1 = -k / u, a2 = -k / v, c2 = -m2.p * pq / m2.q, h1 = eqT(lt(A + X), tm(k)), show = (list) => list.slice().sort((s, t) => s - t).map(iq).join(', ');
        const rows = d.shuffle([[a1, a2], [a1], [a2], [-a1, -a2]]), ok = (r) => r.length === 2 && r.includes(a1) && r.includes(a2);
        return C(`두 일차함수 ${h1}, ${eq(m2, c2)}의 그래프가 ${XA}과 만나는 점을 각각 P, Q라 하자. 선분 PQ의 길이가 ${L}일 때, 수 ${A}의 값을 모두 구한 것은?`, rows.map(show), rows.findIndex(ok), {
          explain: `${eq(m2, c2)}의 그래프의 ${XI}은 ${iq(pq)}이므로 Q${pt(pq, 0)}이다. 선분 PQ의 길이가 ${L}이므로 점 P의 ${X}좌표는 ${iq(pq)} ${MINUS} ${L} = ${iq(u)} 또는 ${iq(pq)} + ${L} = ${iq(v)}이다. ${h1}에 ${is(X, u)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(A, a1)}이고, ${is(X, v)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(A, a2)}이다.`,
          facts: { truth: rows.map(ok), want: true }
        });
      }, { count: 2, standard: S15 }),
      H('hard-intercept-sum', '평행이동한 그래프의 두 절편의 합으로 수 구하기', '심15', (d) => {
        // ② 평행이동한 그래프의 식 → 두 절편을 같은 문자로 → 합이 주어진 값 → 처음 식의 수
        const a = pm(d) * d.int(2, 4), j = nz(d, -3, 3), n0 = a * j, T = n0 - j, s = d.until(() => nz(d, -6, 6), (v) => n0 - v !== 0), kv = n0 - s, h = eqT(tm(a, X), lt(K));
        const xi = a > 0 ? nb(`${MINUS}${frac(NN, a)}`) : frac(NN, -a);
        return N(`일차함수 ${h}의 그래프를 ${YA}의 방향으로 ${iq(s)}만큼 평행이동한 그래프의 ${XI}과 ${YI}의 합이 ${iq(T)}일 때, 수 ${K}의 값은?`, kv, { signed: true,
          explain: `평행이동한 그래프의 ${YI}을 ${NN}이라 하면 식은 ${eqT(tm(a, X), lt(NN))}이고, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${XI}은 ${xi}이다. 두 절편의 합이 ${iq(T)}이므로 ${nb(`${xi} + ${NN} = ${iq(T)}`)}에서 ${is(NN, n0)}이다. 평행이동한 그래프의 ${YI}은 ${ex(lt(K), tm(s))}이므로 ${nb(`${ex(lt(K), tm(s))} = ${iq(n0)}`)}에서 ${is(K, kv)}이다.`,
          facts: { value: `${jn(T)}*${jn(a)}/(${jn(a)}-1)-${jn(s)}`, unseen: [1] }
        });
      }, { standard: S15 }),
      H('hard-signs-at-one', '그래프에서 a + b와 −a + b의 부호 읽기', '심30', (d) => {
        // ① a + b는 x = 1일 때의 y의 값, −a + b는 x = −1일 때의 y의 값이다. 그래프가 x축과 만나는 곳이 1(−1)의 안쪽인지 바깥쪽인지를 그림에서 읽는다.
        // 답을 가르는 보기는 a, b의 부호만으로는 정해지지 않는 쪽이다(a와 b의 부호가 다르면 a + b, 같으면 −a + b).
        const fig = (v) => ({ x: [-3, 3], y: [-4, 4], grid: false, ticks: 'none', lines: [{ a: v.a, b: v.b }], xnums: [{ v: -1 }, { v: 1 }] });
        const c = d.until(() => { const sa = pm(d), sb = pm(d), near = d.bool(); return { sa, sb, near, a: Q(sa * (near ? 4 : 1)), b: sb * 2 }; }, (v) => plOk(fig(v)));
        const { sa, sb, near } = c, av = fl(c.a), s1 = av + c.b > 0 ? 1 : -1, s2 = -av + c.b > 0 ? 1 : -1, want = d.bool(), key = sa !== sb ? 2 : 3, xs = -sa * sb;
        const forms = [A, BB, `${A} + ${BB}`, `${MINUS}${A} + ${BB}`], signs = [sa, sb, s1, s2];
        const rows = d.shuffle([0, 1, 2, 3].map((i) => { const ok = i === key ? want : !want; return { h: nb(`${forms[i]} ${rel(ok ? signs[i] : -signs[i])} 0`), ok }; }));
        const meet = near ? (xs > 0 ? '0과 1 사이' : '−1과 0 사이') : (xs > 0 ? '1보다 오른쪽' : '−1보다 왼쪽');
        return C(`일차함수 ${eqAB}의 그래프가 그림과 같을 때, 다음 중 ${want ? '옳은' : '옳지 않은'} 것은?`, rows.map((r) => r.h), rows.findIndex((r) => r.ok === want), {
          figure: relabel(xTicks(fig(c), pl(fig(c)), [-1, 1]), `좌표평면: 눈금 없는 그림. x축에 −1과 1이 적혀 있다. 직선이 오른쪽 ${sideWord(sa)}로 향하고, y축과는 원점의 ${sideWord(sb)}쪽에서, x축과는 ${meet}에서 만난다.`),
          explain: `그래프가 오른쪽 ${sideWord(sa)}로 향하므로 ${cmp(A, rel(sa))}이고, ${YA}과 ${partWord(sb)}의 부분에서 만나므로 ${cmp(BB, rel(sb))}이다. ${is(X, 1)}일 때의 ${Y}의 값은 ${nb(`${A} + ${BB}`)}이고, 그림에서 ${is(X, 1)}일 때 그래프가 ${XA}보다 ${sideWord(s1)}쪽에 있으므로 ${nb(`${A} + ${BB} ${rel(s1)} 0`)}이다. ${is(X, -1)}일 때의 ${Y}의 값은 ${nb(`${MINUS}${A} + ${BB}`)}이고, 그림에서 ${is(X, -1)}일 때 그래프가 ${XA}보다 ${sideWord(s2)}쪽에 있으므로 ${nb(`${MINUS}${A} + ${BB} ${rel(s2)} 0`)}이다.`,
          facts: { truth: rows.map((r) => r.ok), want }
        });
      }),
      H('hard-signs-frac-coef', '그래프에서 분수 꼴 계수의 부호를 차례로 구하기', '심35', (d) => {
        // ② 그림에서 기울기와 y절편의 부호 → y절편 ±1/a에서 a의 부호 → 그 부호를 써서 기울기 ±b/a에서 b의 부호.
        // 보기를 고르는 아이: b의 부호를 기울기의 부호 그대로 적는 아이, y절편 앞의 −를 놓치는 아이.
        const ga = pm(d), gb = pm(d), [e1, e2] = d.pick([[1, -1], [-1, -1], [-1, 1], [1, 1]]), sa = e2 * gb, sb = e1 * ga * sa, at = FOUR.findIndex(([u, v]) => u === sa && v === sb);
        const sl = `${e1 < 0 ? MINUS : ''}${frac(BB, A)}`, ic = `${e2 < 0 ? MINUS : ''}${frac(1, A)}`, h = nb(`${Y} = ${sl}${X} ${e2 < 0 ? MINUS : '+'} ${frac(1, A)}`);
        return C(`일차함수 ${h}의 그래프가 그림과 같을 때, 수 ${A}, ${BB}의 부호로 옳은 것은?`, FOUR.map(([u, v]) => `${cmp(A, rel(u))}, ${cmp(BB, rel(v))}`), at, {
          figure: signFig(d, ga, gb),
          explain: `그래프가 ${YA}과 ${partWord(gb)}의 부분에서 만나므로 ${YI} ${nb(ic)}은 ${signWord(gb)}이고, ${cmp(A, rel(sa))}이다. 그래프가 오른쪽 ${sideWord(ga)}로 향하므로 기울기 ${nb(sl)}는 ${signWord(ga)}이고, ${cmp(A, rel(sa))}이므로 ${cmp(BB, rel(sb))}이다.`,
          facts: { truth: FOUR.map((_, i) => i === at), want: true }
        });
      }),
      H('hard-quadrant-k', '그래프가 지나는 사분면으로 수의 조건을 찾아 알맞은 값 고르기', '심36', (d) => {
        // ② 지나는 사분면 → 기울기와 y절편의 부호 → 수 k에 대한 두 조건 → 둘 다 맞는 값.
        // 보기를 고르는 아이: 한 조건만 본 아이(둘), 기울기나 y절편이 0이 되는 경계의 값을 넣은 아이. (범위로 답하는 원문을 「될 수 있는 값」 고르기로 바꾸었다.)
        const c = d.until(() => ({ r1: nz(d, -3, 3), r2: d.int(-3, 3), al: pm(d) * d.int(1, 3), ga: pm(d) * d.int(1, 3), ss: pm(d), si: pm(d) }),
          (v) => Math.abs(v.r1 - v.r2) >= 2 && Math.abs(v.r1 - v.r2) <= 4 && (v.r1 < v.r2 ? v.al * v.ss > 0 && v.ga * v.si < 0 : v.al * v.ss < 0 && v.ga * v.si > 0));
        const { r1, r2, al, ga, ss, si } = c, lo = Math.min(r1, r2), hi = Math.max(r1, r2), inside = d.int(lo + 1, hi - 1), sign = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
        const slx = ex(lt(times(al, K), al < 0), tm(-al * r1)), icx = ex(lt(times(ga, K), ga < 0), tm(-ga * r2)), h = eqT(lt(`(${slx})${X}`), lt(times(ga, K), ga < 0), tm(-ga * r2));
        const rows = d.shuffle([inside, lo - d.int(1, 2), hi + d.int(1, 2), d.pick([r1, r2])]), ok = (v) => sign(al * (v - r1)) === ss && sign(ga * (v - r2)) === si;
        return C(`일차함수 ${h}의 그래프가 ${quadText(ss, si)}을 지날 때, 다음 중 수 ${K}의 값이 될 수 있는 것은?`, rows.map((v) => iq(v)), rows.findIndex(ok), {
          explain: `${quadText(ss, si)}을 지나는 직선은 오른쪽 ${sideWord(ss)}로 향하고 ${YA}과 ${partWord(si)}의 부분에서 만나므로 기울기는 ${signWord(ss)}, ${YI}은 ${signWord(si)}이다. ${nb(`${slx} ${rel(ss)} 0`)}에서 ${cmp(K, rel(al * ss), iq(r1))}이고, ${nb(`${icx} ${rel(si)} 0`)}에서 ${cmp(K, rel(ga * si), iq(r2))}이다. 보기 가운데 두 조건에 모두 맞는 것은 ${iq(inside)}이다.`,
          facts: { truth: rows.map(ok), want: true }
        });
      }),
      H('hard-fixed-point', 'a의 값에 관계없이 그래프가 항상 지나는 점', '심38', (d) => {
        // ① 식에 a가 두 번 들어 있다. a로 묶으면 y = a(x − p) + q이므로 x = p일 때 a가 사라진다.
        // 보기를 고르는 아이: 상수항 q를 y절편으로 읽는 아이, 부호를 놓친 아이, a > 0이라고 여기거나 특별한 a의 값만 넣어 본 아이.
        const p = nz(d, -3, 3), q = nz(d, -5, 5), h = eqT(lt(A + X), lt(times(p, A), p > 0), tm(q)), hp = nb(`${Y} = ${A}(${X} ${sgn(-p)}) ${sgn(q)}`);
        const rows = d.shuffle([[`점 ${ptj(p, q, '을/를')} 지난다.`, true], [`점 ${ptj(0, q, '을/를')} 지난다.`, false], [`점 ${ptj(-p, q, '을/를')} 지난다.`, false], d.bool() ? [`${X}의 값이 증가하면 ${Y}의 값도 증가한다.`, false] : ['원점을 지난다.', false]]);
        return C(`일차함수 ${h}의 그래프에 대한 설명으로 수 ${A}의 값에 관계없이 항상 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          explain: `${h}에서 ${hp}이므로 ${is(X, p)}일 때 ${A}의 값에 관계없이 ${is(Y, q)}이다. 따라서 그래프는 항상 점 ${ptj(p, q, '을/를')} 지난다. ${is(X, 0)}일 때의 ${Y}의 값과 그래프의 방향은 ${A}의 값에 따라 달라진다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }),
      H('hard-intercept-ratio', '두 절편의 비와 미지수가 든 두 점으로 식 구하기', '심46', (d) => {
        // ② 절편의 비 → 기울기(x절편이 p이면 y절편은 rp이고 두 점 (p, 0), (0, rp)를 지난다) → 두 점의 기울기 식에서 k → 한 점을 넣어 y절편
        // 원점을 지나는 직선은 두 절편이 모두 0이어서 ㈎에 맞으므로(0 = r × 0) 원점을 지나지 않는다고 못 박는다.
        const c = d.until(() => { const r = d.int(2, 4), a = -r, kv = nz(d, -4, 4), x1 = nz(d, -3, 3), j = d.pick([2, 3]), b = kv - a * x1; return { r, a, kv, x1, j, b, y2: a * j * kv + b }; }, (v) => v.b !== 0 && v.j * v.kv !== v.x1 && v.y2 !== 0 && Math.abs(v.y2) <= 20 && Math.abs(v.b) <= 15);
        const { r, a, kv, x1, j, b, y2 } = c, jk = j + K;
        return eqAns(`다음 조건을 모두 만족시키는 ${ASK} (단, 그래프는 원점을 지나지 않는다.)`, a, b, {
          figure: lines([`㈎ ${YI}은 ${XI}의 ${r}배이다.`, `㈏ 그래프가 두 점 ${pt(x1, K)}, ${ptj(jk, y2, '을/를')} 지난다.`]),
          explain: `${XI}을 ${PP}라 하면 ${YI}은 ${r}${PP}이므로 그래프는 두 점 ${pt(PP, 0)}, ${nb(`(0, ${r}${PP})`)}를 지나고, 기울기는 ${frac(`${r}${PP} ${MINUS} 0`, `0 ${MINUS} ${PP}`)} = ${iq(a)}이다. ㈏의 두 점을 지나는 직선의 기울기도 ${iq(a)}이므로 ${nb(`${frac(`${iq(y2)} ${MINUS} ${K}`, `${jk} ${MINUS} ${par(x1)}`)} = ${iq(a)}`)}에서 ${is(K, kv)}이다. ${eqT(tm(a, X), lt(BB))}에 ${is(X, x1)}, ${is(Y, kv)}${tail(Math.abs(kv), '을/를')} 대입하면 ${is(BB, b)}이므로 ${eq(a, b)}이다.`,
          facts: { calc: [[`0-${r}`, 0], [`(${jn(y2)}-${r}*${jn(x1)})/(1-${r}*${j})+${r}*${jn(x1)}`, 1]], unseen: [0, 1] }
        });
      }),
      H('hard-square-between', '두 그래프 사이에 놓인 정사각형의 넓이', '심54', (d) => {
        // ② 그래프 위의 점 A의 좌표를 문자로 → 한 변의 길이 → 점 D의 좌표 → 점 D가 다른 그래프 위에 있다는 식 → 넓이
        const spec = ([m, n, t]) => { const s = fl(m) * t, cq = qmul(Q(t), qadd(qadd(m, n), qmul(m, n))); return { m, n, t, s, c: cq.p / cq.q, xi: fl(qdiv(cq, n)), top: fl(m) * fl(cq) / (fl(m) + fl(n)) }; };
        const fig = (v) => ({ x: [-1, Math.ceil(v.xi) + 1], y: [-1, Math.ceil(v.top) + 1], grid: false, ticks: 'none', lines: [{ a: v.m }, { a: qneg(v.n), b: v.c }], poly: [[v.t, 0], [v.t + v.s, 0], [v.t + v.s, v.s], [v.t, v.s]],
          points: [{ x: v.t, y: v.s, name: 'A', side: 'ul' }, { x: v.t, y: 0, name: 'B', side: 'dl' }, { x: v.t + v.s, y: 0, name: 'C', side: 'dr' }, { x: v.t + v.s, y: v.s, name: 'D', side: 'ur' }] });
        const c = d.until(() => spec(d.pick(SQUARES)), (v) => plOk(fig(v))), { m, n, t, s } = c, m1 = qadd(Q(1), m), side = `${js(m)}*${c.c}/(${js(m)}+${js(n)}+${js(m)}*${js(n)})`;
        return N(`그림과 같이 정사각형 ABCD의 두 꼭짓점 A, D는 각각 두 일차함수 ${eq(m, 0)}, ${eq(qneg(n), c.c)}의 그래프 위에 있고, 두 꼭짓점 B, C는 ${XA} 위에 있다. 정사각형 ABCD의 넓이는?`, s * s, {
          figure: relabel(pl(fig(c)), '좌표평면: 눈금 없는 그림. 원점을 지나 오른쪽 위로 향하는 직선과 오른쪽 아래로 향하는 직선이 있다. 정사각형 ABCD의 변 BC는 x축 위에 있고, 꼭짓점 A는 오른쪽 위로 향하는 직선 위에, 꼭짓점 D는 오른쪽 아래로 향하는 직선 위에 있다.'),
          explain: `점 A의 ${X}좌표를 ${TT}라 하면 A${pt(TT, ex(tm(m, TT)))}이고 정사각형의 한 변의 길이는 ${ex(tm(m, TT))}이다. 점 D의 좌표는 ${pt(ex(tm(m1, TT)), ex(tm(m, TT)))}이고, 점 D가 ${eq(qneg(n), c.c)}의 그래프 위에 있으므로 ${nb(`${ex(tm(m, TT))} = ${ex(tm(qneg(qmul(n, m1)), TT), tm(c.c))}`)}에서 ${is(TT, t)}이다. 한 변의 길이가 ${s}이므로 넓이는 ${s} × ${s} = ${s * s}이다.`,
          facts: { value: `(${side})*(${side})`, unseen: [1] }
        });
      }),
      H('hard-shift-range', '선분과 만나도록 평행이동한 그래프의 y절편의 범위', '심57', (d) => {
        // ② 평행이동한 그래프는 기울기가 같은 채로 위아래로 움직인다. 선분의 두 끝 점을 지날 때의 b의 값이 범위의 두 끝이다.
        // 틀린 범위: 두 끝 점의 y좌표를 그대로 적은 것, b = y + ax로 셈한 것, 바른 끝 값과 틀린 끝 값을 섞은 것.
        const span = (u, v) => (u < v ? [u, v] : [v, u]), same = (r, s) => r[0] === s[0] && r[1] === s[1];
        const fig = (v) => ({ x: [-1, v.x2 + 1], y: [Math.min(Math.floor(v.mid), 0) - 1, Math.max(v.y1, v.y2, Math.ceil(v.mid)) + 1], grid: false, ticks: 'none', lines: [{ a: v.a, b: Q(v.b1 + v.b2, 2) }], segs: [[v.x1, v.y1, v.x2, v.y2]],
          points: [{ x: v.x1, y: v.y1, name: 'A', side: v.a.p > 0 ? 'ul' : 'ur', guide: true }, { x: v.x2, y: v.y2, name: 'B', side: v.a.p > 0 ? 'dr' : 'ur', guide: true }], xnums: [{ v: v.x1 }, { v: v.x2 }], ynums: [{ v: v.y1 }, { v: v.y2 }] });
        const c = d.until(() => {
          const a = d.pick([Q(2), Q(-2), Q(1, 2), Q(-1, 2), Q(3), Q(-1), Q(1), Q(3, 2)]), x1 = a.q * d.int(1, 2), x2 = x1 + a.q * d.int(1, 3), y1 = d.int(1, 6), y2 = d.int(1, 6), ax1 = a.p * x1 / a.q, ax2 = a.p * x2 / a.q, b1 = y1 - ax1, b2 = y2 - ax2;
          const good = span(b1, b2), ys = span(y1, y2), plus = span(y1 + ax1, y2 + ax2), mix = [[good[0], ys[1]], [ys[0], good[1]], [good[0], plus[1]], [plus[0], good[1]]].find((r) => r[0] < r[1] && ![good, ys, plus].some((s) => same(r, s)));
          return { a, x1, x2, y1, y2, ax1, ax2, b1, b2, mid: (b1 + b2) / 2, good, ys, plus, mix };
        }, (v) => v.x2 <= 6 && v.y1 !== v.y2 && v.b1 !== v.b2 && v.mix && !same(v.good, v.ys) && !same(v.good, v.plus) && !same(v.ys, v.plus) && v.mid >= -2.5 && v.mid <= 6 && plOk(fig(v)));
        const { a, x1, x2, y1, y2, good } = c, rows = d.shuffle([c.good, c.ys, c.plus, c.mix]), say = (r) => nb(`${iq(r[0])} ≤ ${BB} ≤ ${iq(r[1])}`);
        return C(`그림과 같이 좌표평면 위에 두 점 A${pt(x1, y1)}, B${pt(x2, y2)}${tail(y2, '이/가')} 있다. 일차함수 ${eq(a, 0)}의 그래프를 ${YA}의 방향으로 ${BB}만큼 평행이동한 그래프가 선분 AB와 만나도록 하는 수 ${BB}의 값의 범위는?`, rows.map(say), rows.findIndex((r) => same(r, good)), {
          figure: relabel(pl(fig(c)), `좌표평면: 눈금 없는 그림. 두 점 A, B를 이은 선분이 있고, 두 점에서 두 축에 내린 점선이 x축의 ${x1}, ${x2}${tail(x2, '과/와')} y축의 ${y1}, ${y2}에 닿는다. 오른쪽 ${sideWord(a.p)}로 향하는 직선이 선분 AB와 만난다.`),
          explain: `평행이동한 그래프의 식은 ${eqT(tm(a, X), lt(BB))}이다. 이 그래프가 점 A를 지날 때 ${nb(`${y1} = ${iq(c.ax1)} + ${BB}`)}에서 ${is(BB, c.b1)}, 점 B를 지날 때 ${nb(`${y2} = ${iq(c.ax2)} + ${BB}`)}에서 ${is(BB, c.b2)}이다. 그래프가 선분 AB와 만나려면 ${BB}의 값이 이 두 값 사이에 있어야 하므로 ${say(good)}이다.`,
          facts: { truth: rows.map((r) => same(r, good)), want: true }
        });
      }),
      H('hard-area-then-point', '넓이로 x절편을 정하고 그래프 위의 다른 점의 좌표 구하기', '심50', (d) => {
        // ② 세 점에서 y절편과 x절편 → 넓이에서 x절편의 절댓값 → 조건으로 부호 → 식 → 그래프 위의 다른 점
        const c = d.until(() => { const [P, Qm] = d.pick([[6, 4], [4, 6], [6, 3], [4, 8], [8, 4], [3, 6], [6, 8], [8, 6], [2, 6], [2, 8], [6, 2], [8, 2]]), g = gcd(P, Qm), i = d.int(-2, g + 2), sp = pm(d), sq = pm(d); return { P, Qm, g, i, p: sp * P, q: sq * Qm, bv: sp * (P / g) * i, y3: sq * (Qm / g) * (g - i) }; },
          (v) => v.i !== 0 && v.i !== v.g && Math.abs(v.bv) <= 12 && Math.abs(v.y3) <= 12);
        const { P, Qm, p, q, bv, y3 } = c, S = P * Qm / 2, sl = Q(-q, p), aE = p > 0 ? `2*${S}/${Qm}` : `(0-2*${S}/${Qm})`;
        return vals(`세 점 ${pt(0, q)}, ${pt(A, 0)}, ${nb(`(${BB}, ${iq(y3)})`)}${tail(Math.abs(y3), '을/를')} 지나는 일차함수의 그래프와 ${XA}, ${YA}으로 둘러싸인 도형의 넓이가 ${S}일 때, 수 ${A}, ${BB}의 값은? (단, ${cmp(A, rel(p))}이다.)`, [[A, p], [BB, bv]], {
          explain: `그래프의 ${YI}은 ${iq(q)}, ${XI}은 ${A}이므로 둘러싸인 도형은 높이가 ${Qm}인 직각삼각형이다. ${HALF} × (밑변의 길이) × ${Qm} = ${S}에서 밑변의 길이는 ${P}이고, ${cmp(A, rel(p))}이므로 ${is(A, p)}이다. 두 점 ${pt(0, q)}, ${ptj(p, 0, '을/를')} 지나는 직선의 기울기는 ${iq(sl)}이므로 식은 ${eq(sl, q)}이다. ${is(Y, y3)}${tail(Math.abs(y3), '을/를')} 대입하면 ${is(X, bv)}이므로 ${is(BB, bv)}이다.`,
          facts: { calc: [[aE, 0], [`${aE}*(${jn(q)}-${jn(y3)})/${jn(q)}`, 1]], unseen: [0, 2] }
        });
      }),
      H('hard-area-ratio-rect', '정사각형을 가로지르는 그래프가 나눈 두 사각형의 넓이의 비로 기울기 구하기', '심53', (d) => {
        // ② y절편에서 점 D → 넓이의 비에서 아래쪽 사다리꼴의 넓이 → 점 E의 y좌표 → 기울기
        const fig = (v) => ({ x: [-1, v.L + 1], y: [-1, v.L + 1], grid: false, ticks: 'none', poly: [[0, 0], [v.L, 0], [v.L, v.L], [0, v.L]], lines: [{ a: Q(v.k - v.c, v.L), b: v.c }],
          points: [{ x: 0, y: v.L, name: 'A', side: 'ul' }, { x: v.L, y: 0, name: 'B', side: 'dr' }, { x: v.L, y: v.L, name: 'C', side: 'ur' }, { x: 0, y: v.c, name: 'D', side: v.k > v.c ? 'ul' : 'dl' }, { x: v.L, y: v.k, name: 'E', side: v.k > v.c ? 'dr' : 'ur' }] });
        const c = d.until(() => { const L = d.pick([6, 8]), r = d.int(2, 3), up = d.bool(), cc = d.int(1, L - 1), sum = up ? 2 * L / (r + 1) : 2 * L * r / (r + 1); return { L, r, up, c: cc, k: sum - cc }; },
          (v) => Number.isInteger(v.k) && v.k > 0 && v.k < v.L && v.k !== v.c && plOk(fig(v)));
        const { L, r, up, k } = c, cc = c.c, a = Q(k - cc, L), lower = (cc + k) * L / 2, big = up ? 'ADEC' : 'DOBE', small = up ? 'DOBE' : 'ADEC', h = eqT(lt(A + X), tm(cc));
        return ansV(`그림과 같이 일차함수 ${h}의 그래프가 한 변의 길이가 ${L}인 정사각형 AOBC의 두 변 AO, BC와 만나는 점을 각각 D, E라 하자. 사각형 ${big}의 넓이가 사각형 ${small}의 넓이의 ${r}배일 때, 수 ${A}의 값은? (단, O는 원점이다.)`, a, 'frac', {
          figure: relabel(pl(fig(c)), `좌표평면: 눈금 없는 그림. 정사각형 AOBC의 꼭짓점 O는 원점, 꼭짓점 A는 y축 위, 꼭짓점 B는 x축 위에 있다. 오른쪽 ${sideWord(k - cc)}로 향하는 직선이 변 AO와 점 D에서, 변 BC와 점 E에서 만난다.`),
          explain: `정사각형 AOBC의 넓이는 ${L} × ${L} = ${L * L}이고 사각형 ${big}의 넓이가 사각형 ${small}의 넓이의 ${r}배이므로, 사각형 DOBE의 넓이는 ${L * L} × ${frac(up ? 1 : r, r + 1)} = ${lower}이다. ${YI}이 ${cc}이므로 D${pt(0, cc)}이다. 점 E의 ${Y}좌표를 ${K}라 하면 사다리꼴 DOBE의 넓이는 ${HALF} × (${cc} + ${K}) × ${L} = ${lower}이므로 ${is(K, k)}이다. 그래프가 점 E${ptj(L, k, '을/를')} 지나므로 ${nb(`${k} = ${L}${A} + ${cc}`)}에서 ${is(A, a)}이다.`,
          facts: { value: `(2*${L}${up ? '' : '*' + r}/(${r}+1)-2*${cc})/${L}`, unseen: [1, 2] }
        });
      }),
      H('hard-bisect-trapezoid', '원점을 지나는 그래프가 사다리꼴의 넓이를 이등분할 때 기울기 구하기', '심56', (d) => {
        // ② 사다리꼴의 넓이 → 그래프가 어느 변과 만나는가(삼각형 OAB의 넓이와 견준다) → 넓이에서 만나는 점의 y좌표 → 두 점 A, B를 지나는 직선의 식에서 x좌표 → 기울기
        const spec = ([w, e, h]) => ({ w, e, h, yp: Q((w - e) * h, w), xp: Q(w * w - e * (w - e), w), a: Q((w - e) * h, w * w - e * (w - e)) });
        const fig = (v) => ({ x: [-1, v.w + 1], y: [-1, v.h + 1], grid: false, ticks: 'none', poly: [[0, 0], [v.w, 0], [v.w - v.e, v.h], [v.e, v.h]], lines: [{ a: v.a }], points: [{ x: v.w, y: 0, name: 'A', side: 'dr' }, { x: v.w - v.e, y: v.h, name: 'B', side: 'ur' }, { x: v.e, y: v.h, name: 'C', side: 'ul' }] });
        const c = d.until(() => spec(d.pick([[6, 2, 3], [6, 2, 6], [4, 1, 4], [4, 1, 2], [8, 2, 8], [8, 2, 2], [8, 2, 6], [6, 1, 6], [5, 1, 5]])), (v) => plOk(fig(v)));
        const { w, e, h, yp, xp, a } = c, b1 = w - e, half = b1 * h / 2, ypE = `((${w}+${b1}-${e})*${h}/(2*${w}))`, xpE = `(${w}-(${w}-${b1})*${ypE}/${h})`, ab = eq(Q(-h, e), Q(w * h, e)), yj = tail(lastOf(yp), '을/를');
        return ansV(`그림과 같이 네 점 O${pt(0, 0)}, A${pt(w, 0)}, B${pt(b1, h)}, C${ptj(e, h, '을/를')} 꼭짓점으로 하는 사다리꼴 OABC가 있다. 일차함수 ${eqT(lt(A + X))}의 그래프가 사다리꼴 OABC의 넓이를 이등분할 때, 수 ${A}의 값은?`, a, 'frac', {
          figure: relabel(pl(fig(c)), '좌표평면: 눈금 없는 그림. 사다리꼴 OABC의 꼭짓점 O는 원점, 꼭짓점 A는 x축 위에 있고, 변 CB는 x축에 평행하다. 원점을 지나는 직선이 변 AB와 만난다.'),
          explain: `사다리꼴 OABC의 넓이는 ${HALF} × (${w} + ${b1 - e}) × ${h} = ${2 * half}이므로 그래프가 나눈 한쪽의 넓이는 ${half}이다. 삼각형 OAB의 넓이는 ${HALF} × ${w} × ${h} = ${iq(Q(w * h, 2))}${tail(lastOf(Q(w * h, 2)), '으로/로')} ${half}보다 크므로 그래프는 변 AB와 만난다. 만나는 점을 P라 하면 삼각형 OAP의 넓이가 ${half}이므로 ${HALF} × ${w} × (점 P의 ${Y}좌표) = ${half}에서 점 P의 ${Y}좌표는 ${iq(yp)}이다. 두 점 A, B를 지나는 직선을 그래프로 하는 일차함수의 식은 ${ab}이고, ${is(Y, yp)}${yj} 대입하면 ${is(X, xp)}이다. ${eqT(lt(A + X))}에 ${is(X, xp)}, ${is(Y, yp)}${yj} 대입하면 ${is(A, a)}이다.`,
          facts: { value: `${ypE}/${xpE}`, unseen: [2] }
        });
      }),
      H('hard-letter-point-xint', '문자로 나타낸 그래프 위의 점과 x절편으로 식 구하기', '심45', (d) => {
        // ② 그래프 위의 점 → 대입하여 a → 점의 좌표 → x절편이 p이면 점 (p, 0)을 지난다 → 두 점으로 식
        const c = d.until(() => { const tv = nz(d, -4, 4), j = d.pick([2, 3]), [cx0, cy0] = d.bool() ? [1, j] : [j, 1], a2 = pm(d) * d.int(2, 4), m = nz(d, -3, 3), x0 = cx0 * tv, y0 = cy0 * tv; return { tv, cx0, cy0, a2, m, x0, y0, k: tv * (cy0 - m * cx0), p: x0 - y0 / a2 }; },
          (v) => v.k !== 0 && Math.abs(v.k) <= 12 && Number.isInteger(v.p) && v.p !== 0 && Math.abs(v.p) <= 9 && v.m !== v.a2 && Math.abs(v.a2 * v.p) <= 24);
        const { tv, cx0, cy0, a2, m, x0, y0, k, p } = c, b2 = -a2 * p, px0 = times(cx0, A), py0 = times(cy0, A), tE = `(${jn(k)}/(${cy0}-${jn(m)}*${cx0}))`, aE = `(${cy0}*${tE}/(${cx0}*${tE}-${jn(p)}))`;
        return eqAns(`점 ${pt(px0, py0)}가 일차함수 ${eq(m, k)}의 그래프 위에 있다. 이 점을 지나고 ${XI}이 ${iq(p)}인 ${ASK}`, a2, b2, {
          explain: `${eq(m, k)}에 ${is(X, px0)}, ${is(Y, py0)}를 대입하면 ${nb(`${py0} = ${ex(lt(times(m * cx0, A), m * cx0 < 0), tm(k))}`)}에서 ${is(A, tv)}이므로 이 점의 좌표는 ${pt(x0, y0)}이다. ${XI}이 ${iq(p)}이므로 구하는 직선은 점 ${pt(p, 0)}도 지난다. 기울기는 ${frac(`${iq(y0)} ${MINUS} 0`, `${iq(x0)} ${MINUS} ${par(p)}`)} = ${iq(a2)}이고, ${eqT(tm(a2, X), lt(BB))}에 ${is(X, p)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(BB, b2)}이다. 따라서 ${eq(a2, b2)}이다.`,
          facts: { calc: [[aE, 0], [`0-${aE}*${jn(p)}`, 1]], unseen: [0, 1] }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-1-5', 'slope', [
    TB('slope-meaning', '기울기의 뜻에 맞는 증가량 고르기', '심21·28', (d) => {
      // 보기는 모두 「x의 값이 얼마만큼 증가하면 y의 값이 얼마만큼 증가(감소)한다」이다. 함정: 거꾸로 나눈 것 둘, 증가와 감소를 바꾼 것.
      const [p, q] = d.pick([[3, 2], [2, 3], [5, 2], [4, 3], [3, 4], [5, 3]]), s = pm(d), a = Q(s * p, q), b = nz(d, -6, 6), word = (v) => (v > 0 ? '증가' : '감소'), one = d.bool();
      const say = (dx, dy, dir) => `${X}의 값이 ${dx}만큼 증가하면 ${Y}의 값은 ${dy}만큼 ${word(dir)}한다.`;
      const rows = d.shuffle([
        one ? [say(1, frac(p, q), s), true] : [say(2 * q, 2 * p, s), true],
        [say(1, frac(q, p), s), false],      // 거꾸로 나눈 값
        [say(p, q, s), false],               // x와 y의 증가량을 바꾼 것
        [say(q, p, -s), false]               // 증가와 감소를 바꾼 것
      ]);
      return C(`일차함수 ${eq(a, b)}의 그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: `기울기는 ${RATIO} = ${iq(a)}이다. ${X}의 값이 ${q}만큼 증가하면 ${Y}의 값은 ${p}만큼 ${word(s)}하고, ${X}의 값이 1만큼 증가하면 ${Y}의 값은 ${frac(p, q)}만큼 ${word(s)}한다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { standard: S15 })
  ]);
  B.addTypes('8-1-5', 'nature', [
    TB('nature-near-axis', '그래프의 방향과 축에 가까운 정도로 식 고르기', '①48 심37', (d) => {
      // 함정: 기울기의 크기만 견주는 아이. 축에 가까운 정도는 기울기의 절댓값으로 정해진다(음수끼리는 수가 작을수록 y축에 가깝다).
      const [rp, rq] = d.pick([[3, 2], [6, 5], [4, 3], [5, 4]]), rs = pm(d), ref = Q(rs * rp, rq), down = d.bool(), toY = d.bool(), c = nz(d, -5, 5), big = d.pick([Q(2), Q(5, 2), Q(3)]), small = d.pick([Q(1, 3), Q(1, 2), Q(2, 3)]);
      const mk = (sign, mag) => Q(sign * mag.p, mag.q), rows = d.shuffle([[mk(-1, big), true, true], [mk(1, big), false, true], [mk(-1, small), true, false], [mk(1, small), false, false]]), ok = (r) => r[1] === down && r[2] === toY;
      return C(`다음 조건을 모두 만족시키는 일차함수의 식은?`, rows.map((r) => eq(r[0], c)), rows.findIndex(ok), {
        figure: lines([`㈎ 그래프가 오른쪽 ${down ? '아래' : '위'}로 향한다.`, `㈏ 그래프가 일차함수 ${eq(ref, nz(d, -5, 5))}의 그래프보다 ${toY ? YA : XA}에 가깝다.`]),
        explain: `㈎에서 기울기는 ${down ? '음수' : '양수'}이다. 기울기의 절댓값이 클수록 그래프는 ${YA}에 가깝고, 작을수록 ${XA}에 가깝다. ㈏에서 기울기의 절댓값은 ${frac(rp, rq)}보다 ${toY ? '크다' : '작다'}. 두 조건에 맞는 것은 ${eq(rows.find(ok)[0], c)}이다.`,
        facts: { truth: rows.map(ok), want: true }
      });
    })
  ]);
  B.addTypes('8-1-5', 'intercept', [
    TB('intercept-area-coef', '그래프와 두 축으로 둘러싸인 도형의 넓이로 기울기 구하기', '①54 심49', (d) => {
      // 넓이 → 밑변의 길이(x절편의 절댓값) → 조건으로 x절편의 부호 → 기울기
      const [bm, k] = d.pick([[4, 2], [6, 2], [6, 3], [8, 2], [8, 4], [12, 3], [12, 2], [10, 5], [12, 4], [12, 6]]), b = pm(d) * bm, s = pm(d), a = s * k, S = bm * bm / (2 * k), h = eqT(lt(A + X), tm(b));
      return N(`일차함수 ${h}의 그래프와 ${XA}, ${YA}으로 둘러싸인 도형의 넓이가 ${S}일 때, 수 ${A}의 값은? (단, ${cmp(A, s > 0 ? GT : LT)}이다.)`, a, { signed: true,
        explain: `둘러싸인 도형은 직각삼각형이고 높이는 ${YI}의 절댓값 ${bm}이다. ${HALF} × (밑변의 길이) × ${bm} = ${S}에서 밑변의 길이는 ${2 * S / bm}이므로 ${XI}은 ${2 * S / bm} 또는 ${iq(-2 * S / bm)}이다. ${cmp(A, s > 0 ? GT : LT)}이고 ${YI}이 ${signWord(b)}이므로 ${XI}은 ${iq(-b / a)}이고, ${h}에 ${is(X, -b / a)}, ${is(Y, 0)}${tail(0, '을/를')} 대입하면 ${is(A, a)}이다.`,
        facts: { value: `${s > 0 ? '' : '0-'}${bm}*${bm}/(2*${S})`, unseen: [0, 2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
