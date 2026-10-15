// 중학교 1학년 1학기 2단원 정수와 유리수 — 단원 틀·도구와 앞쪽 묶음(양수와 음수·정수와 유리수, 수직선과 절댓값, 대소 관계와 부등호, 덧셈).
// 수집해 둔 교과서 3종(미래엔 황선욱, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 93·90꼴, 심화꼴 67꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-1-2/싣기_대조표.md 에 있다.
// (뺄셈·곱셈·나눗셈·혼합 계산은 7-1-2b.js 에, 실력 문항은 7-1-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 수와 연산. 성취기준은 9수01-03(양수와 음수, 정수와 유리수의 개념), 9수01-04(정수와 유리수의 대소 관계), 9수01-05(정수와 유리수의 사칙계산)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·수직선·표·문장·계산 과정), 묻는 것(값·개수·고르기·빈칸), 계산의 구조가 다르면 따로 싣는다.
//    계산 문항은 구조가 다를 때만 따로 싣고 facts.rule 에 이름을 단다: 수의 종류(정수끼리 / 분수·소수가 낌 / 통분이 필요), 부호의 짝(같은 부호 / 다른 부호),
//    괄호와 양의 부호가 생략되었는가, 항의 수, 거듭제곱이 끼는가, 나타내는 방법(식, 수직선, 계산 과정의 빈칸, 법칙을 쓴 자리).
//  - 답: 수를 적는 칸에는 모두 부호 단추를 단다(단추가 있고 없음이 답의 부호를 알려 주지 않게). 개수를 묻는 답만 단추 없이 받는다.
//    분수 답은 원문대로 기약분수·가분수로 적어 두고 크기가 같은 분수를 모두 받는다(anyForm). 대분수 답은 쓰지 않는다. 한 유형(차례)의 답은 늘 같은 꼴(정수 / 분수 / 소수 한 자리)이다.
//    부등호를 쓴 식·법칙 이름·기호의 차례·짝 짓기가 답인 꼴은 고르기로, 「모두 구하시오」는 개수나 작은 수·큰 수 두 칸으로 바꾸었다.
//  - 교육과정의 금: 「정수, 유리수와 관련하여 지나치게 복잡한 계산을 포함하는 문제는 다루지 않는다」「사칙계산 이외의 이항연산 문제는 다루지 않는다」.
//    혼합 계산은 수집본 기본 문서의 수준(괄호 두세 겹, 거듭제곱 하나둘)을 넘기지 않았고, 새로 약속한 기호 문제는 싣지 않았다.
//  - 용어는 교육과정의 것(양수, 음수, 양의 정수, 음의 정수, 정수, 수직선, 양의 유리수, 음의 유리수, 유리수, 절댓값, 교환법칙, 결합법칙, 분배법칙, 역수)만 쓴다.
//    「원점」은 이 영역의 용어가 아니므로 「0을 나타내는 점」으로 적는다.
//  - 문자가 수를 대신할 뿐인 판단 문제는 싣는다. 곱셈 기호를 생략한 표기(ab, 2a)는 다음 단원에서 배우므로 a × b 로 풀어 쓴다.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-1-2b.js, 7-1-2c.js 의 것까지 여기에 모아 적는다)
//  - 사칙계산 이외의 이항연산(교육과정의 금): 새로 약속한 기호(심56·57·58·59).
//  - 뒤 학년·다음 단원: 지수법칙(심42 — 중2), 분수 꼴 문자식에 수 넣기·분수 안의 분수(심59 — 문자와 식), 절댓값이 든 방정식(심64),
//    부등식 풀이 꼴(①33 심21 — 「1만큼 큰 수는 양수」를 x + 1 > 0 으로 푸는 일), 문자의 거듭제곱·분수 꼴 문자식의 부호(심54), 거꾸로 두 번 푸는 □(①90 심48 — 방정식 꼴).
//  - 조건 여럿을 풀어 수를 찾는 것·퍼즐·요령이 필요한 긴 셈: 절댓값 조건 셋·넷(①24 ②22 심20·55), 비와 거리로 두 수 찾기(심13·14), 범위·분모·기약 세 조건(①18 심18),
//    마방진과 수 놓기(①56·57·73 ②51·52 심60·61·62), 카드 놀이(②38), 곱·합 조건으로 세 정수 찾기(②89 심43·63),
//    규칙을 찾아 지워 가는 긴 합·곱(②37·68·90 ①72 심65·66·67).
//  - 뜻 없는 셈: 따로 구한 두 값을 다시 더하고 빼고 곱하기(①50 ②65 심12·29·35·37·45, ①77 ②74 심33의 역수끼리 셈, ①16·17·48·51·83·87 ②10·16·21·35·42의 a + b·a − b·합·곱 부분).
//    하나하나 구하는 일은 실었다. 역수 둘을 구해 다시 셈하는 일은 「곱이 1인 수가 마주 보는 상자」(실력)로 바꾸어 실었다.
//  - 음수가 한 번도 나오지 않는 초등 문제: 할인과 나누어 내기(②88), 큰 수·작은 수 이어 구하기(심23), 계산 상자(심49), 나눗셈을 묶는 분배법칙(①67의 변형).
//  - 지나치게 복잡한 계산(교육과정의 금)·수만 키운 것: 분수 안의 거듭제곱·대분수·소수가 겹친 혼합 계산(심44의 변형·45), 다섯·여섯 항의 덧셈·뺄셈(②31·47의 변형),
//    다섯 번 이어 나누기(②75의 변형), −1의 거듭제곱 여섯 항(②60의 변형), 복잡한 혼합 계산 뒤에 정수의 개수·약수의 개수를 붙인 것(②85 심46·47 — 정수의 개수를 세는 부분만 실력에 실었다).
//  - 약속이 수직선과 어긋나는 것(심3 — 오전을 음수로 적되 두 수의 차가 시간이 아니다), 전개도에서 마주 보는 면 찾기가 일의 대부분인 것(심27 — 초등 도형), 경우를 모두 따지는 주사위(심28).
//  - 작도·서술형: 수직선 위에 나타내기(①12 ②7), 법칙을 글로 쓰기(②34), 까닭·과정 쓰기(①67·68의 서술 부분). 고르기와 빈칸으로 바꾸어 실었다.
//  - 같은 일이어서 한 번만 실은 것: 세 문장의 빈칸 조합 고르기(①2의 변형), 부호 +의 수와 부호를 따로 묻기(②69의 변형), 곱셈 과정의 법칙 이름과 빈칸(①60 ②57 — 덧셈 과정에서 이름과 빈칸을,
//    곱셈 과정에서 법칙이 쓰인 자리를 묻는다), 곱셈·나눗셈 식 다섯 가운데 가장 큰 것(①82 ②66의 변형 — 덧셈·뺄셈에서 견주고, 곱셈·나눗셈은 옳지 않은 등식 찾기로 실었다),
//    더할 것을 나눈 계산 바로잡기(①84 — 나눌 것을 곱한 계산 바로잡기와 같다).
//  - 그림이 필요해 미룬 것은 없다. 수직선·분류 그림·덧셈 피라미드·연산 기호에 이름표를 단 식은 이 파일과 7-1-2b.js 의 그림 함수로 그렸다.
//  - 2026-10-13 다시 싣기: 위에 「조건 여럿을 풀어 수를 찾는 것·퍼즐·요령이 필요한 긴 셈」「거꾸로 두 번 푸는 □」「지나치게 복잡한 계산」「경우를 모두 따지는 주사위」
//    「전개도」라고 적어 뺀 꼴은 다시 보고 실었다(사용자: 「수학실력에 필요해보이는문제는 다 넣어」). 실력은 7-1-2c.js 의 실력 묶음 끝(hard-abs-cond-pair 부터),
//    기본 셋(sub-ends-between · sub-net-opposite · div-recip-back)은 7-1-2c.js 끝에 있다. 지금도 빼 두는 것은 상위 학년(부등식 풀이 꼴 ①33 심21, 지수법칙 심42,
//    절댓값이 든 방정식 심64), 교육과정의 금(새로 약속한 이항연산 심57·58·59), 뜻 없는 셈, 하위 학년 문제(음수가 나오지 않는 것, 시각의 차 심3),
//    같은 일(삼각형의 변에 놓인 수의 합 ①57 — 표의 빈칸과 같다, 문자의 거듭제곱의 부호 심54), 그림을 알 수 없는 것(②51 심61·62), 작도·서술형이다.
//    꼴마다의 판정은 대조표의 「2026-10-13 다시 싣기」에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, N, M, C, F, D } = B.kit;
  const STD3 = '9수01-03', STD4 = '9수01-04', STD5 = '9수01-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 유리수·식·수직선·문항 도구는 공용 파일(middle.js 의 B.kit.mid)에 있다.
  const {
    LAB, MINUS, GT, LT, GE, LE, range, gcd, lcm, Q, dc, dc2, plainQ, qadd, qsub, qmul, qdiv, keepD, qneg, qabs, qpow, qcmp, isInt, fl, asDec, U, mag, tx,
    sx, px, digits, nb, isFrac, glue, plain, tail, lastOf, tj, sj, pj, js, V, sup, P, G, W, WN, MN, A, isNum, valT, val, OPS, BR, htmlT, html, inl, jsT,
    jsx, hasP, S, isPow, step, trace, chainOf, flatNums, intsOnly, biggest, emOf, FIT, fit, ex, show, tag, tagged, taggedEx, proc, flow, f1, nline, nz, pm,
    co, fr, distinct, okKind, ansV, valueFacts, CALC, calcQ, pickEx, SAME_ADD, DIFF_ADD, TO_ADD, SAME_MUL, DIFF_MUL, SAME_DIV, DIFF_DIV, BY_RECIP, rawMag,
    uniq, addTold, subTold, mulTold, divTold, commonTold, un, sv, claimQ
  } = B.kit.mid;

  // 유리수를 분류한 그림. ㉠은 정수가 아닌 유리수의 자리이다.
  function treeFig() {
    const cell = (x, y, w, label) => `<rect x="${x}" y="${y - 13}" width="${w}" height="26" rx="6" style="fill:#fff;stroke:#1f2933;stroke-width:1.2"/><text x="${x + w / 2}" y="${y + 4.6}" text-anchor="middle" style="font-size:13px;font-weight:600;fill:#1f2933">${label}</text>`;
    const wire = (path) => `<path d="${path}" style="fill:none;stroke:#5b6770;stroke-width:1.2"/>`;
    return '<svg class="mb-geo" viewBox="0 0 300 122" width="300" role="img" aria-label="유리수를 분류한 그림: 유리수는 정수와 ㉠으로 나뉘고, 정수는 양의 정수(자연수), 0, 음의 정수로 나뉜다">'
      + wire('M60 75H74M74 44V106M74 44H88M74 106H88') + wire('M140 44H154M154 15V73M154 15H168M154 44H168M154 73H168')
      + cell(4, 75, 56, '유리수') + cell(88, 44, 52, '정수') + cell(88, 106, 52, '㉠') + cell(168, 15, 128, '양의 정수(자연수)') + cell(168, 44, 128, '0') + cell(168, 73, 128, '음의 정수') + '</svg>';
  }
  // 위 칸의 수가 바로 아래 두 칸의 수의 합인 그림(세 층). 칸에 적는 글을 받는다.
  function pyramid(bottom, mid, top) {
    const cell = (x, y, label) => `<rect x="${x}" y="${y}" width="68" height="30" style="fill:#fff;stroke:#1f2933;stroke-width:1.2"/><text x="${x + 34}" y="${y + 20.5}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:#1f2933">${label}</text>`;
    return `<svg class="mb-geo" viewBox="0 0 210 98" width="210" role="img" aria-label="칸을 세 층으로 쌓은 그림: 맨 아래 층은 왼쪽부터 ${bottom.join(', ')}, 가운데 층은 ${mid.join(', ')}, 맨 위 층은 ${top}">`
      + cell(71, 2, top) + cell(37, 33, mid[0]) + cell(105, 33, mid[1]) + cell(3, 64, bottom[0]) + cell(71, 64, bottom[1]) + cell(139, 64, bottom[2]) + '</svg>';
  }

  // ── 상황과 수 목록 ──
  // 서로 반대인 뜻을 가진 두 양. rule: 부호를 정하는 약속, as: 수와 단위 뒤에 붙는 「(으)로」.
  const SITS = [
    { rule: '증가하는 것을 +, 감소하는 것을 −', pos: (v) => `${v} kg 증가`, neg: (v) => `${v} kg 감소`, unit: 'kg', as: '으로', lo: 2, hi: 9 },
    { rule: '이익을 +, 손해를 −', pos: (v) => `${v}원 이익`, neg: (v) => `${v}원 손해`, unit: '원', as: '으로', lo: 5, hi: 40, by: 100 },
    { rule: '영상을 +, 영하를 −', pos: (v) => `영상 ${v} °C`, neg: (v) => `영하 ${v} °C`, unit: '°C', as: '로', lo: 2, hi: 15 },
    { rule: '해발을 +, 해저를 −', pos: (v) => `해발 ${v} m`, neg: (v) => `해저 ${v} m`, unit: 'm', as: '로', lo: 2, hi: 30, by: 100 },
    { rule: '지상을 +, 지하를 −', pos: (v) => `지상 ${v}층`, neg: (v) => `지하 ${v}층`, unit: '층', as: '으로', lo: 2, hi: 9 },
    { rule: '며칠 후를 +, 며칠 전을 −', pos: (v) => `${v}일 후`, neg: (v) => `${v}일 전`, unit: '일', as: '로', lo: 2, hi: 9 },
    { rule: '수입을 +, 지출을 −', pos: (v) => `${v}원 수입`, neg: (v) => `${v}원 지출`, unit: '원', as: '으로', lo: 5, hi: 40, by: 100 },
    { rule: '득점을 +, 실점을 −', pos: (v) => `${v}점 득점`, neg: (v) => `${v}점 실점`, unit: '점', as: '으로', lo: 2, hi: 9 }
  ];
  // 수 목록의 한 칸: 값과 적는 글. plus 이면 양수 앞에 +를 적는다.
  const cell = (v, plus) => ({ v, show: plus ? sx(v) : tx(v) });
  // 약분하면 정수가 되는 분수(6/2, −9/3)
  const fake = (d) => { const q = d.int(2, 5), k = d.int(1, 4), s = pm(d); return { v: Q(s * k), show: (s < 0 ? MINUS : d.bool() ? '+' : '') + frac(q * k, q), fake: true }; };
  // 여러 종류가 섞인 수 목록. spec: pi 양의 정수, ni 음의 정수, zero 0, pf 양의 분수, nf 음의 분수, pd 양의 소수, nd 음의 소수, fk 약분하면 정수가 되는 분수의 개수
  function listOf(d, spec) {
    return d.until(() => {
      const out = [], many = (n, make) => { for (let i = 0; i < (n || 0); i += 1) out.push(make()); };
      many(spec.pi, () => cell(Q(d.int(1, 12)), d.bool())); many(spec.ni, () => cell(Q(-d.int(1, 12))));
      if (spec.zero) out.push(cell(Q(0)));
      many(spec.pf, () => cell(fr(d, [2, 3, 4, 5, 7], 3), d.bool())); many(spec.nf, () => cell(qneg(fr(d, [2, 3, 4, 5, 7], 3))));
      const tenths = () => d.until(() => d.int(1, 59), (t) => t % 10 !== 0);
      many(spec.pd, () => cell(dc(tenths()), d.bool())); many(spec.nd, () => cell(dc(-tenths())));
      many(spec.fk, () => fake(d));
      return d.shuffle(out);
    }, (list) => distinct(list.map((c) => c.v)));
  }
  const named = (list, flags) => list.filter((c, i) => flags[i]).map((c) => c.show).join(', ');

  const KIND_TRUE = ['자연수는 모두 정수이다.', '정수는 모두 유리수이다.', '0은 정수이다.', '0은 양수도 음수도 아니다.', '유리수는 양의 유리수, 0, 음의 유리수로 이루어진다.', '음의 정수는 모두 음의 유리수이다.', '정수는 양의 정수, 0, 음의 정수로 이루어진다.', '양의 정수는 자연수이다.'];
  const KIND_FALSE = [
    ['0은 양의 정수이다.', '0은 양의 정수도 음의 정수도 아닌 정수이다.', '0은 양수도 음수도 아니다.'], ['유리수는 양의 유리수와 음의 유리수로만 이루어진다.', '유리수에는 0도 있다.', '유리수는 양의 유리수, 0, 음의 유리수로 이루어진다.'], ['정수는 양의 정수와 음의 정수로만 이루어진다.', '정수에는 0도 있다.', '정수는 양의 정수, 0, 음의 정수로 이루어진다.'],
    ['양수는 모두 자연수이다.', `${frac(1, 2)}이나 0.3은 양수이지만 자연수가 아니다.`], ['0은 정수가 아닌 유리수이다.', '0은 정수이다.', '0은 정수이다.'], ['유리수는 모두 정수이다.', `${frac(1, 2)}은 유리수이지만 정수가 아니다.`],
    ['0은 유리수가 아니다.', '0은 정수이고, 정수는 모두 유리수이다.'], ['음의 유리수는 모두 음의 정수이다.', `${MINUS}${frac(1, 2)}은 음의 유리수이지만 정수가 아니다.`], ['분수 꼴로 적힌 수는 모두 정수가 아니다.', `${frac(6, 2)} = 3은 정수이다.`]
  ];
  const KIND_TRUE2 = ['서로 다른 두 유리수 사이에는 무수히 많은 유리수가 있다.', '음의 정수 가운데 가장 큰 수는 −1이다.', '양의 정수 가운데 가장 작은 수는 1이다.', '0은 음수가 아닌 정수이다.', '모든 자연수는 유리수이다.', '음수는 0보다 작은 수이다.'];
  const KIND_FALSE2 = [
    ['가장 작은 정수는 0이다.', '0보다 작은 음의 정수가 끝없이 있으므로 가장 작은 정수는 없다.'], ['서로 다른 두 정수 사이에는 항상 다른 정수가 있다.', '1과 2 사이에는 정수가 없다.'],
    ['가장 큰 음의 유리수는 −1이다.', `−1보다 큰 ${MINUS}${frac(1, 2)}도 음의 유리수이다.`], ['0과 1 사이에는 유리수가 없다.', `0과 1 사이에는 ${frac(1, 2)}, ${frac(1, 3)} 같은 유리수가 무수히 많다.`],
    ['음수가 아닌 정수는 모두 자연수이다.', '0은 음수가 아닌 정수이지만 자연수가 아니다.', '0은 음수가 아닌 정수이다.']
  ];
  const ABS_TRUE = ['절댓값은 수직선에서 0을 나타내는 점과 그 수를 나타내는 점 사이의 거리이다.', '0의 절댓값은 0이다.', '절댓값이 5인 수는 +5와 −5의 2개이다.', '절댓값이 클수록 수직선에서 0을 나타내는 점으로부터 멀리 떨어져 있다.', '음수의 절댓값은 양수이다.', '절댓값이 가장 작은 수는 0이다.', '+4와 −4의 절댓값은 같다.'];
  const ABS_FALSE = [
    ['모든 수의 절댓값은 양수이다.', '0의 절댓값은 0이고, 0은 양수가 아니다.', '0의 절댓값은 0이다.'], ['절댓값이 3인 수는 +3 하나뿐이다.', '절댓값이 3인 수는 +3과 −3의 2개이다.', '절댓값이 5인 수는 +5와 −5의 2개이다.'], ['절댓값이 가장 작은 정수는 −1과 1이다.', '절댓값이 가장 작은 정수는 0이다.', '절댓값이 가장 작은 수는 0이다.'],
    ['수가 클수록 그 수의 절댓값도 크다.', '−5는 2보다 작지만 절댓값은 더 크다.'], ['음수의 절댓값은 음수이다.', '절댓값은 거리이므로 음수가 될 수 없다.', '음수의 절댓값은 양수이다.'], ['절댓값이 같은 두 수는 서로 같은 수이다.', '+2와 −2는 절댓값이 같지만 서로 다른 수이다.'],
    ['모든 수는 절댓값이 같은 수가 2개씩 있다.', '절댓값이 0인 수는 0 하나뿐이다.']
  ];
  const ORDER_TRUE = ['수직선에서 오른쪽에 있는 수가 왼쪽에 있는 수보다 크다.', '양수는 음수보다 크다.', '음수는 0보다 작다.', '양수끼리는 절댓값이 큰 수가 크다.', '음수끼리는 절댓값이 큰 수가 작다.', '0은 음수보다 크고 양수보다 작다.'];
  const ORDER_FALSE = [
    ['음수끼리는 절댓값이 큰 수가 크다.', '음수끼리는 절댓값이 큰 수가 작다. −5는 −2보다 작다.', '음수끼리는 절댓값이 큰 수가 작다.'], ['절댓값이 큰 수가 항상 크다.', '−5는 2보다 절댓값이 크지만 2보다 작다.'],
    ['양수끼리는 절댓값이 큰 수가 작다.', '양수끼리는 절댓값이 큰 수가 크다.', '양수끼리는 절댓값이 큰 수가 크다.'], ['수직선에서 0을 나타내는 점에 가까운 수가 항상 작다.', '−1은 −4보다 0을 나타내는 점에 가깝지만 −4보다 크다.'], ['0은 모든 정수 가운데 가장 작다.', '음의 정수는 0보다 작다.', '음수는 0보다 작다.']
  ];

  B.addUnit({
    id: '7-1-2', grade: 7, semester: 1, no: 2, title: '정수와 유리수', version: 3,
    groups: [
      {
        id: 'kinds', title: '양수와 음수, 정수와 유리수', standard: STD3,
        types: [
          T('kinds-two', '서로 반대인 두 양을 부호로 나타내기', '①1', (d) => {
            const s = d.pick(SITS), k = s.by || 1, [a, b] = d.until(() => [d.int(s.lo, s.hi) * k, d.int(s.lo, s.hi) * k], ([x, y]) => x !== y), posFirst = d.bool();
            const rows = posFirst ? [s.pos(a), s.neg(b)] : [s.neg(b), s.pos(a)], ans = posFirst ? [a, -b] : [-b, a];
            return M(`${s.rule}로 나타낼 때, ㉠, ㉡을 부호 +, −를 사용하여 나타내시오.`, ans.map((v, i) => ({ label: LAB[i], answer: v, unit: s.unit, signed: true })), {
              figure: tagged(rows),
              explain: `${s.rule}로 나타내므로 ㉠은 ${sv(ans[0])}${un(s.unit)}, ㉡은 ${sv(ans[1])}${un(s.unit)}이다.`,
              facts: { calc: ans.map((v, i) => [v < 0 ? '-' + -v : String(v), i]) }
            });
          }),
          T('kinds-opposite', '한쪽의 부호가 정해졌을 때 반대쪽 양 나타내기', '①2 ②1', (d) => {
            const s = d.pick(SITS), k = s.by || 1, [a, b] = d.until(() => [d.int(s.lo, s.hi) * k, d.int(s.lo, s.hi) * k], ([x, y]) => x !== y), givenPos = d.bool();
            const given = givenPos ? s.pos(a) : s.neg(a), ask = givenPos ? s.neg(b) : s.pos(b), ans = givenPos ? -b : b;
            return N(`${josa(given, '을/를')} ${sv(givenPos ? a : -a)}${un(s.unit)}${s.as} 나타낼 때, ${josa(ask, '을/를')} 부호 +, −를 사용하여 나타내면?`, ans, {
              unit: s.unit, signed: true,
              explain: `${josa(given, '과/와')} ${josa(ask, '은/는')} 서로 반대인 양이다. ${josa(given, '을/를')} ${givenPos ? '+' : MINUS}로 나타내었으므로 ${josa(ask, '은/는')} ${sv(ans)}${un(s.unit)}이다.`,
              facts: { value: ans < 0 ? '(-' + b + ')' : String(b) }
            });
          }),
          T('kinds-from-zero', '0보다 얼마만큼 크거나 작은 수를 부호로 나타내기', '①2', (d, n) => {
            const small = d.bool(), x = n === 0 ? Q(d.int(2, 15)) : fr(d, [2, 3, 4, 5, 7], 2), v = small ? qneg(x) : x;
            return ansV(`0보다 ${mag(x)}만큼 ${small ? '작은' : '큰'} 수를 부호 +, −를 사용하여 나타내면?`, v, n === 0 ? 'int' : 'frac', {
              explain: `0보다 큰 수는 양의 부호 +를, 0보다 작은 수는 음의 부호 −를 붙여 나타낸다. 0보다 ${mag(x)}만큼 ${small ? '작은' : '큰'} 수는 ${sx(v)}이다.`,
              facts: { value: `0${small ? '-' : '+'}${js(x)}`, rule: 'from-zero-' + n }
            });
          }, { count: 2 }),
          T('kinds-odd', '부호가 나머지와 다른 것 찾기', '①3 심1', (d) => {
            const POS = ['5일 후', '지상 7층', '2000원 이익', '해발 500 m', '8점 득점', '영상 6 °C', '3 kg 증가', '4000원 수입', '10분 후'], NEG = ['20분 전', '15점 실점', '지하 3층', '200 g 감소', '영하 5 °C', '3000원 손해', '해저 120 m', '5000원 지출', '2일 전'];
            const oddNeg = d.bool(), many = d.shuffle(oddNeg ? POS : NEG).slice(0, 3), odd = d.pick(oddNeg ? NEG : POS), rows = d.shuffle(many.concat([odd]));
            return C('다음을 부호 +, −를 사용하여 나타낼 때, 부호가 나머지 셋과 다른 것은?', rows, rows.indexOf(odd), {
              explain: `증가, 이익, 수입, 득점, 영상, 해발, 지상, 「~ 후」는 +로, 감소, 손해, 지출, 실점, 영하, 해저, 지하, 「~ 전」은 −로 나타낸다. 「${odd}」만 ${oddNeg ? MINUS : '+'}이고 나머지는 ${oddNeg ? '+' : MINUS}이다.`,
              facts: { truth: rows.map((r) => r === odd), want: true }
            });
          }),
          T('kinds-count-posneg', '수 목록에서 양수와 음수의 개수 세기', '①4 ②2', (d) => {
            const list = listOf(d, { pi: d.int(1, 2), ni: d.int(1, 2), zero: 1, pf: 1, nf: d.int(1, 2), pd: 1, nd: d.int(0, 1) }), pos = list.map((c) => c.v.p > 0), neg = list.map((c) => c.v.p < 0);
            return M('다음 수 가운데 양수와 음수는 각각 몇 개인가?', [{ label: '양수', answer: pos.filter(Boolean).length, unit: '개' }, { label: '음수', answer: neg.filter(Boolean).length, unit: '개' }], {
              figure: numbers(list.map((c) => c.show)),
              explain: `양수는 0보다 큰 수이고 음수는 0보다 작은 수이다. 0은 양수도 음수도 아니다. 양수는 ${named(list, pos)}의 ${pos.filter(Boolean).length}개, 음수는 ${named(list, neg)}의 ${neg.filter(Boolean).length}개이다.`,
              facts: { count: pos, big: { countIf: { values: list.filter((c) => c.v.p !== 0).map((c) => fl(c.v)), test: 'below', target: 0, i: 1 } } }
            });
          }),
          T('kinds-count', '수 목록에서 종류별로 개수 세기', '①5 ②3·4', (d, n) => {
            const spec = [{ pi: 2, ni: d.int(1, 2), zero: 1, pf: 1, nf: 1, pd: 1, nd: 1 }, { pi: 1, ni: d.int(1, 2), zero: 1, pf: 1, nf: d.int(1, 2), pd: 1, nd: 1 }, { pi: 1, ni: 1, zero: 1, pf: d.int(1, 2), nf: 1, pd: 1, nd: d.int(0, 1) }][n];
            const list = listOf(d, spec), flags = list.map((c) => [isInt(c.v), c.v.p < 0, !isInt(c.v)][n]), k = flags.filter(Boolean).length;
            const word = ['정수', '음의 유리수', '정수가 아닌 유리수'][n];
            const why = ['정수는 양의 정수, 0, 음의 정수이다.', '음의 유리수는 음의 부호 −가 붙은 유리수이다. 음의 정수도 음의 유리수이다.', '정수가 아닌 유리수는 분수나 소수로만 나타낼 수 있는 유리수이다.'][n];
            return N(`다음 수 가운데 ${josa(word, '은/는')} 모두 몇 개인가?`, k, { unit: '개', figure: numbers(list.map((c) => c.show)), explain: `${why} ${josa(word, '은/는')} ${named(list, flags)}의 ${k}개이다.`, facts: { count: flags } });
          }, { count: 3 }),
          T('kinds-tree', '유리수를 분류한 그림에서 빈 자리에 드는 수 찾기', '①8', (d) => {
            const nonInt = d.bool() ? cell(d.bool() ? fr(d, [2, 3, 4, 5, 7], 3) : qneg(fr(d, [2, 3, 4, 5, 7], 3))) : cell(dc(pm(d) * d.until(() => d.int(1, 39), (t) => t % 10 !== 0)));
            const f = fake(d), others = d.shuffle([cell(Q(-d.int(1, 9))), cell(Q(0)), cell(Q(d.int(1, 9)), true)]).slice(0, 2), rows = d.shuffle([nonInt, f].concat(others));
            return C('유리수를 다음과 같이 분류할 때, ㉠에 해당하는 수는?', rows.map((c) => c.show), rows.indexOf(nonInt), {
              figure: treeFig(),
              explain: `유리수는 정수와 정수가 아닌 유리수로 나뉘므로 ㉠은 정수가 아닌 유리수이다. ${f.show} = ${tx(f.v)}${tail(Math.abs(f.v.p), '은/는')} 정수이다. 정수가 아닌 유리수는 ${nonInt.show}이다.`,
              facts: { truth: rows.map((c) => c === nonInt), want: true }
            });
          }),
          T('kinds-facts', '정수와 유리수에 대한 설명의 참·거짓', '①9 ②5 심6', (d, n) => {
            // 첫째는 수의 갈래(0과 정수·유리수의 포함), 둘째는 크기와 개수(가장 작은 정수, 두 수 사이의 수)를 묻는다.
            const wantTrue = n === 0;
            return claimQ(d, `정수와 유리수에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, n === 0 ? KIND_TRUE : KIND_TRUE2, n === 0 ? KIND_FALSE : KIND_FALSE2, wantTrue);
          }, { count: 2 })
        ]
      },
      {
        id: 'line', title: '수직선과 절댓값', standard: STD4,
        types: [
          T('line-read-int', '수직선 위의 점이 나타내는 정수 읽기', '①10 ②6', (d) => {
            const a = -d.int(2, 5), b = d.int(2, 5);
            return M('수직선 위의 두 점 A, B가 나타내는 수는?', [{ label: 'A', answer: a, signed: true }, { label: 'B', answer: b, signed: true }], {
              figure: nline(-6, 6, { labels: [0, 1], points: [{ at: Q(a), name: 'A' }, { at: Q(b), name: 'B' }] }),
              explain: `0을 나타내는 점의 왼쪽에 있는 점은 음수를, 오른쪽에 있는 점은 양수를 나타낸다. 점 A는 0에서 왼쪽으로 ${-a}칸 간 곳에 있으므로 −${-a}, 점 B는 0에서 오른쪽으로 ${b}칸 간 곳에 있으므로 +${b}이다.`,
              facts: { calc: [['-' + -a, 0], [String(b), 1]] }
            });
          }, { standard: STD3 }),
          T('line-read-frac', '수직선 위의 점이 나타내는 음의 유리수 읽기', '①10 ②6', (d) => {
            const parts = d.pick([2, 3, 4]), k = d.until(() => d.int(1, 4 * parts - 1), (v) => gcd(v, parts) === 1), v = Q(-k, parts);
            return ansV('수직선 위의 점 A가 나타내는 수는?', v, 'frac', {
              figure: nline(-4, 2, { parts, points: [{ at: v, name: 'A' }] }),
              explain: `작은 눈금 한 칸은 ${frac(1, parts)}이다. 점 A는 0에서 왼쪽으로 작은 눈금 ${k}칸 간 곳에 있으므로 ${tj(v, '을/를')} 나타낸다.`,
              facts: { value: js(v) }
            });
          }, { standard: STD3 }),
          T('line-match-wrong', '수직선 위의 점과 수의 짝이 옳지 않은 것 찾기', '①11 ②6 심7', (d) => {
            // 음수 쪽의 점을 왼쪽 정수에서부터 세어 읽은 값(−1과 −2 사이의 점을 −2 3/4으로 읽는 잘못)을 하나 섞는다.
            const parts = d.pick([2, 3, 4]), free = (lo, hi) => d.until(() => d.int(lo, hi), (v) => v % parts !== 0);
            const ks = d.until(() => [-free(2 * parts + 1, 4 * parts - 1), -free(1, 2 * parts - 1), d.int(1, 2 * parts - 1), d.int(2 * parts + 1, 4 * parts - 1)], (list) => list.every((v, i) => i === 0 || v - list[i - 1] >= Math.max(2, parts - 1)));
            const wrongAt = d.int(0, 1), K = -ks[wrongAt], m = Math.floor(K / parts), r = K % parts, slip = Q(-((m + 1) * parts + parts - r), parts);
            const names = ['A', 'B', 'C', 'D'], real = ks.map((k) => Q(k, parts)), said = real.map((v, i) => (i === wrongAt ? slip : v));
            return C('수직선 위의 네 점 A, B, C, D가 나타내는 수로 옳지 않은 것은?', names.map((name, i) => `${name}: ${tx(said[i])}`), wrongAt, {
              figure: nline(-4, 4, { parts, points: real.map((v, i) => ({ at: v, name: names[i] })) }),
              explain: `작은 눈금 한 칸은 ${frac(1, parts)}이다. 점 ${names[wrongAt]}는 0에서 왼쪽으로 작은 눈금 ${K}칸 간 곳에 있으므로 ${tj(real[wrongAt], '을/를')} 나타낸다. ${tj(slip, '은/는')} −${m + 1}보다 왼쪽에 있는 수이다.`,
              facts: { truth: names.map((name, i) => i !== wrongAt), want: false }
            });
          }, { standard: STD3 }),
          T('line-claims', '수직선 위의 점들에 대한 설명의 참·거짓', '①11 ②8', (d) => {
            const parts = d.pick([2, 3, 4]), names = ['A', 'B', 'C', 'D', 'E'];
            const ks = d.until(() => [-d.int(2 * parts + 1, 4 * parts - 1), -d.int(1, 2 * parts), 0, d.int(1, 2 * parts), d.int(2 * parts + 1, 4 * parts)],
              (list) => list.every((v, i) => i === 0 || v - list[i - 1] >= Math.max(2, parts - 1)) && list.slice(0, 2).some((v) => v % parts !== 0) && list.some((v) => v !== 0 && v % parts === 0));
            const vs = ks.map((k) => Q(k, parts)), ints = vs.filter(isInt).length, at = d.pick([0, 1].filter((i) => ks[i] % parts !== 0)), K = -ks[at], slip = Q(-((Math.floor(K / parts) + 1) * parts + parts - K % parts), parts);
            const lie = d.pick(['point', 'neg', 'int']);
            const rows = d.shuffle([
              [`점 ${names[at]}가 나타내는 수는 ${tx(lie === 'point' ? slip : vs[at])}이다.`, lie !== 'point'],
              [`음수를 나타내는 점은 ${lie === 'neg' ? 3 : 2}개이다.`, lie !== 'neg'],
              [`정수를 나타내는 점은 ${lie === 'int' ? ints - 1 : ints}개이다.`, lie !== 'int'],
              [`정수가 아닌 유리수를 나타내는 점은 ${5 - ints}개이다.`, true]
            ]);
            return C('수직선 위의 다섯 점 A, B, C, D, E에 대한 설명으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
              figure: nline(-4, 4, { parts, points: vs.map((v, i) => ({ at: v, name: names[i] })) }),
              explain: `다섯 점이 나타내는 수는 차례로 ${vs.map(tx).join(', ')}이다. 음수는 ${tx(vs[0])}, ${tx(vs[1])}의 2개이고 0은 음수가 아니다. 정수는 ${vs.filter(isInt).map(tx).join(', ')}의 ${ints}개, 정수가 아닌 유리수는 ${vs.filter((v) => !isInt(v)).map(tx).join(', ')}의 ${5 - ints}개이다.`,
              facts: { truth: rows.map((r) => r[1]), want: false }
            });
          }, { standard: STD3 }),
          T('line-mirror', '0을 나타내는 점에서 같은 거리에 있는 다른 점이 나타내는 수', '①13', (d) => {
            const x = d.bool() ? fr(d, [2, 3, 4, 5], 4) : qneg(fr(d, [2, 3, 4, 5], 4)), v = qneg(x);
            return ansV(`수직선에서 ${tj(x, '을/를')} 나타내는 점을 A라 할 때, 0을 나타내는 점까지의 거리가 점 A와 같고 점 A가 아닌 점이 나타내는 수는?`, v, 'frac', {
              explain: `${tj(x, '을/를')} 나타내는 점은 0을 나타내는 점에서 ${x.p > 0 ? '오른쪽' : '왼쪽'}으로 ${mag(x)}만큼 떨어져 있다. 0을 나타내는 점에서 ${x.p > 0 ? '왼쪽' : '오른쪽'}으로 ${mag(x)}만큼 떨어진 점이 나타내는 수는 ${sx(v)}이다.`,
              facts: { value: '(-' + js(x) + ')' }
            });
          }),
          T('line-dist-two', '한 점에서 거리가 정해진 두 점이 나타내는 수', '①14', (d) => {
            const c = Q(d.until(() => d.int(-6, 4), (v) => v !== 0)), k = d.int(2, 7);
            return M(`수직선에서 ${tj(c, '을/를')} 나타내는 점으로부터의 거리가 ${k}인 점은 두 개이다. 두 점이 나타내는 수 가운데 작은 수와 큰 수는?`, [{ label: '작은 수', answer: c.p - k, signed: true }, { label: '큰 수', answer: c.p + k, signed: true }], {
              explain: `${tj(c, '을/를')} 나타내는 점에서 왼쪽으로 ${k}만큼 간 점은 ${px(c)} − ${k} = ${tx(Q(c.p - k))}, 오른쪽으로 ${k}만큼 간 점은 ${px(c)} + ${k} = ${tj(Q(c.p + k), '을/를')} 나타낸다.`,
              facts: { calc: [[`${js(c)}-${k}`, 0], [`${js(c)}+${k}`, 1]] }
            });
          }),
          T('line-nearest', '분수에 가장 가까운 정수', '①16 ②9 심8', (d) => {
            const one = (s) => d.until(() => Q(s * d.int(4, 23), d.pick([3, 4, 5])), (x) => x.q > 2 && Math.abs(fl(x)) > 1), neg = one(-1), pos = one(1), near = (x) => Math.round(fl(x));
            const proof = (x) => { const n = Math.abs(x.p), s = `(2*${n}+${x.q}-(2*${n}+${x.q})%(2*${x.q}))/(2*${x.q})`; return x.p < 0 ? '-' + s : s; };
            const told = (x) => { const lo = Math.floor(fl(x)), hi = lo + 1; return `${tj(x, '은/는')} ${tj(Q(lo), '과/와')} ${tx(Q(hi))} 사이의 수이고 ${tx(Q(near(x)))}에 더 가깝다.`; };
            return M(`수직선에서 ${tx(neg)}에 가장 가까운 정수를 ㉠, ${tx(pos)}에 가장 가까운 정수를 ㉡이라 할 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: near(neg), signed: true }, { label: LAB[1], answer: near(pos), signed: true }], {
              explain: `${told(neg)} ${told(pos)}`,
              facts: { calc: [[proof(neg), 0], [proof(pos), 1]], unseen: [2] }
            });
          }),
          T('line-between-count', '두 유리수 사이에 있는 정수의 개수', '①17 ②10 심17', (d) => {
            const lo = d.until(() => Q(-d.int(5, 23), d.pick([2, 3, 4, 5])), (x) => x.q > 1);
            const hi = d.until(() => Q(pm(d) * d.int(3, 19), d.pick([2, 3, 4, 5])), (x) => { const n = Math.ceil(fl(x)) - Math.floor(fl(lo)) - 1; return x.q > 1 && qcmp(x, lo) > 0 && n >= 2 && n <= 8; });
            const first = Math.floor(fl(lo)) + 1, last = Math.ceil(fl(hi)) - 1, count = last - first + 1;
            return N(`${tj(lo, '과/와')} ${tx(hi)} 사이에 있는 정수는 모두 몇 개인가?`, count, {
              unit: '개',
              explain: `${tx(lo)}보다 큰 정수 가운데 가장 작은 수는 ${tx(Q(first))}이고, ${tx(hi)}보다 작은 정수 가운데 가장 큰 수는 ${tx(Q(last))}이다. 두 수 사이에 있는 정수는 ${range(first, last).map((v) => tx(Q(v))).join(', ')}의 ${count}개이다.`,
              facts: { digit: { template: `(${lo.p})*${hi.q}<□*${lo.q}*${hi.q}<${hi.p < 0 ? '(' + hi.p + ')' : hi.p}*${lo.q}`, lo: -15, hi: 15, ask: 'count' } }
            });
          }),
          T('line-between-ends', '두 유리수 사이에 있는 정수 가운데 가장 작은(큰) 수', '①17 ②10', (d) => {
            // 묻는 쪽 끝이 음의 분수가 되게 한다(−8/3보다 큰 첫 정수는 −2, −5/2보다 작은 첫 정수는 −3).
            const small = d.bool(), lo = d.until(() => Q(-d.int(9, 27), d.pick([2, 3, 4, 5])), (x) => x.q > 1 && (small || fl(x) < -4));
            const hi = d.until(() => Q((small ? pm(d) : -1) * d.int(3, 17), d.pick([2, 3, 4, 5])), (x) => { const n = Math.ceil(fl(x)) - Math.floor(fl(lo)) - 1; return x.q > 1 && qcmp(x, lo) > 0 && n >= 2 && n <= 9; });
            const first = Math.floor(fl(lo)) + 1, last = Math.ceil(fl(hi)) - 1, v = small ? first : last, end = small ? lo : hi;
            return N(`${tj(lo, '과/와')} ${tx(hi)} 사이에 있는 정수 가운데 가장 ${small ? '작은' : '큰'} 수는?`, v, {
              signed: true,
              explain: `${tj(end, '은/는')} ${tj(Q(Math.floor(fl(end))), '과/와')} ${tx(Q(Math.floor(fl(end)) + 1))} 사이의 수이다. ${tx(end)}보다 ${small ? '큰' : '작은'} 정수 가운데 가장 ${small ? '작은' : '큰'} 수는 ${tx(Q(v))}이다.`,
              facts: { digit: { template: `(${lo.p})*${hi.q}<□*${lo.q}*${hi.q}<${hi.p < 0 ? '(' + hi.p + ')' : hi.p}*${lo.q}`, lo: -20, hi: 20, ask: small ? 'min' : 'max' } }
            });
          }),
          T('line-abs-value', '절댓값 구하기', '①19 ②11', (d, n) => {
            const x = n === 0 ? Q(pm(d) * d.int(2, 19)) : qneg(fr(d, [2, 3, 4, 5, 7, 9, 12], 3)), v = qabs(x);
            return ansV(n === 0 ? `${sx(x)}의 절댓값은?` : `|${tx(x)}|의 값은?`, v, n === 0 ? 'int' : 'frac', {
              explain: `절댓값은 수직선에서 0을 나타내는 점과 그 수를 나타내는 점 사이의 거리이다. ${sj(x, '을/를')} 나타내는 점은 0을 나타내는 점에서 ${mag(x)}만큼 떨어져 있으므로 |${sx(x)}| = ${mag(x)}이다.`,
              facts: { value: js(v), rule: 'abs-' + n }
            });
          }, { count: 2 }),
          T('line-abs-two', '절댓값이 정해진 두 수', '①20 ②12', (d) => {
            const k = d.int(2, 19);
            return M(`절댓값이 ${k}인 수는 두 개이다. 두 수 가운데 작은 수와 큰 수는?`, [{ label: '작은 수', answer: -k, signed: true }, { label: '큰 수', answer: k, signed: true }], {
              explain: `수직선에서 0을 나타내는 점으로부터의 거리가 ${k}인 점은 0을 나타내는 점의 왼쪽과 오른쪽에 하나씩 있다. 절댓값이 ${k}인 수는 −${k}${tail(k, '과/와')} +${k}이다.`,
              facts: { calc: [['-' + k, 0], [String(k), 1]] }
            });
          }),
          T('line-abs-list-count', '수 목록에서 절댓값이 어떤 수보다 작은 수 세기', '②14', (d) => {
            const k = d.int(3, 5);
            const list = d.until(() => d.shuffle([cell(Q(-k)), cell(Q(-d.int(k + 1, k + 4))), cell(Q(d.int(1, k - 1)), true), cell(qneg(fr(d, [2, 3, 4], k + 1))), cell(fr(d, [2, 3, 4], k + 1), true), cell(dc(-d.until(() => d.int(11, 10 * k + 25), (t) => t % 10 !== 0))), cell(Q(d.int(k + 1, k + 4)), true)]), (rows) => distinct(rows.map((c) => qabs(c.v))));
            const flags = list.map((c) => qcmp(qabs(c.v), Q(k)) < 0), hit = flags.filter(Boolean).length;
            return N(`다음 수 가운데 절댓값이 ${k}보다 작은 수는 모두 몇 개인가?`, hit, {
              unit: '개', figure: numbers(list.map((c) => c.show)),
              explain: `절댓값은 차례로 ${list.map((c) => mag(c.v)).join(', ')}이다. 절댓값이 ${k}보다 작은 수는 ${named(list, flags)}의 ${hit}개이다. −${k}의 절댓값은 ${k}이므로 ${k}보다 작지 않다.`,
              facts: { count: flags }
            });
          }),
          T('line-abs-max', '절댓값이 가장 큰 수, 0을 나타내는 점에 가장 가까운 수 고르기', '①22 ②16 심11', (d, n) => {
            // 첫째: 절댓값이 가장 큰 수는 음수이고 가장 큰 수와 다르다. 둘째: 0을 나타내는 점에 가장 가까운 수는 가장 작은 수도 가장 큰 수도 아니다.
            const list = d.until(() => d.shuffle([Q(-d.int(2, 9)), qneg(fr(d, [2, 3, 4, 5], 6)), fr(d, [2, 3, 4, 5], 6), Q(d.int(1, 8)), dc(pm(d) * d.until(() => d.int(3, 69), (t) => t % 10 !== 0))]), (rows) => {
              const abs = rows.map((x) => Math.abs(fl(x))), vals = rows.map(fl), top = abs.indexOf(Math.max(...abs)), low = abs.indexOf(Math.min(...abs));
              if (new Set(abs.map((v) => v.toFixed(5))).size < 5) return false;
              const sorted = abs.slice().sort((p, q) => p - q);
              return n === 0 ? vals[top] < 0 && sorted[4] - sorted[3] < 1.2 : vals[low] !== Math.min(...vals) && vals[low] !== Math.max(...vals) && sorted[1] - sorted[0] < 0.8;
            });
            const abs = list.map((x) => Math.abs(fl(x))), at = abs.indexOf(n === 0 ? Math.max(...abs) : Math.min(...abs));
            return C(n === 0 ? '다음 수 가운데 절댓값이 가장 큰 수는?' : '다음 수를 수직선 위에 점으로 나타낼 때, 0을 나타내는 점에 가장 가까운 점이 나타내는 수는?', list.map(tx), at, {
              explain: `${n === 0 ? '' : '0을 나타내는 점에 가까울수록 절댓값이 작다. '}절댓값은 차례로 ${list.map(mag).join(', ')}이다. 절댓값이 가장 ${n === 0 ? '큰' : '작은'} 수는 ${tx(list[at])}이다.`,
              facts: { rank: { values: abs, nth: n === 0 ? 1 : 5 } }
            });
          }, { count: 2 }),
          T('line-abs-facts', '절댓값에 대한 설명의 참·거짓', '②15', (d) => {
            const wantTrue = d.bool();
            return claimQ(d, `절댓값에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, ABS_TRUE, ABS_FALSE, wantTrue);
          })
        ]
      },
      {
        id: 'order', title: '대소 관계와 부등호', standard: STD4,
        types: [
          T('order-sign', '두 수의 크기를 비교하여 부등호 고르기', '①25 ②17', (d, n) => {
            // 차례마다 견주는 수가 다르다: 음의 정수끼리, 음의 분수끼리(통분), 음의 소수와 음의 분수, 절댓값끼리.
            const close = (x, y, gap) => qcmp(x, y) !== 0 && Math.abs(fl(x) - fl(y)) < gap;
            const [x, y] = n === 0 ? d.until(() => [Q(-d.int(1, 15)), Q(-d.int(1, 15))], ([p, q]) => qcmp(p, q) !== 0)
              : n === 1 ? d.until(() => [qneg(fr(d, [2, 3, 4, 5, 6], 2)), qneg(fr(d, [3, 4, 5, 7, 8], 2))], ([p, q]) => p.q !== q.q && close(p, q, 0.4))
                : n === 2 ? d.until(() => [dc(-d.until(() => d.int(3, 39), (t) => t % 10 !== 0)), qneg(fr(d, [2, 3, 4], 4))], ([p, q]) => close(p, q, 0.5))
                  : d.until(() => [qneg(fr(d, [2, 3, 4, 5], 5)), (d.bool() ? qneg : (v) => v)(fr(d, [3, 4, 5, 7], 5))], ([p, q]) => p.q !== q.q && close(qabs(p), qabs(q), 0.6));
            const swap = n !== 3 && d.bool(), a = swap ? y : x, b = swap ? x : y, L = n === 3 ? `|${sx(a)}|` : tx(a), R = n === 3 ? `|${sx(b)}|` : tx(b), cmp = n === 3 ? qcmp(qabs(a), qabs(b)) : qcmp(a, b);
            const both = (p, q) => { const m = lcm(p.q, q.q); return `${frac(Math.abs(p.p) * m / p.q, m)}, ${frac(Math.abs(q.p) * m / q.q, m)}`; };
            const why = n === 0 ? `음수끼리는 절댓값이 큰 수가 작다. 절댓값은 ${mag(a)}, ${mag(b)}이므로 ${L} ${cmp > 0 ? GT : LT} ${R}이다.`
              : n === 3 ? `|${sx(a)}| = ${mag(a)}, |${sx(b)}| = ${mag(b)}이다. 통분하면 ${both(a, b)}이므로 ${L} ${cmp > 0 ? GT : LT} ${R}이다.`
                : `음수끼리는 절댓값이 큰 수가 작다. 절댓값 ${mag(a)}, ${mag(b)}${tail(lastOf(b), '을/를')} 통분하면 ${both(a, b)}이므로 ${L} ${cmp > 0 ? GT : LT} ${R}이다.`;
            return C('□ 안에 알맞은 부등호는?', [GT, '=', LT], cmp > 0 ? 0 : 2, { figure: ex(`${L} ${box()} ${R}`), explain: why, facts: { truth: [cmp > 0, false, cmp < 0], want: true, rule: 'order-sign-' + n } });
          }, { count: 4 }),
          T('order-odd', '부등호의 방향이 나머지와 다른 것 찾기', '①26', (d) => {
            const kinds = [
              () => [Q(-d.int(1, 12)), Q(-d.int(1, 12))], () => [qneg(fr(d, [2, 3, 4], 2)), qneg(fr(d, [3, 4, 5, 6], 2))], () => [Q(0), d.bool() ? Q(-d.int(1, 9)) : qneg(fr(d, [2, 3, 4], 2))],
              () => [qneg(fr(d, [2, 3, 4], 2)), fr(d, [2, 3, 4, 5], 2)], () => [dc(-d.until(() => d.int(3, 49), (t) => t % 10 !== 0)), Q(-d.int(1, 5))], () => [Q(-d.int(1, 9)), Q(d.int(1, 9))]
            ];
            const pairs = d.until(() => d.shuffle(kinds).slice(0, 4).map((make) => make()), (rows) => rows.every(([p, q]) => qcmp(p, q) !== 0));
            const oddAt = d.int(0, 3), bigFirst = d.bool(), rows = pairs.map(([p, q], i) => { const lowFirst = (i === oddAt) === bigFirst, lo = qcmp(p, q) < 0 ? p : q, hi = lo === p ? q : p; return lowFirst ? [lo, hi] : [hi, lo]; });
            const signOf = ([p, q]) => (qcmp(p, q) > 0 ? GT : LT);
            return C('□ 안에 알맞은 부등호의 방향이 나머지 셋과 다른 것은?', LAB.slice(0, 4), oddAt, {
              figure: taggedEx(rows.map(([p, q]) => `${tx(p)} ${box()} ${tx(q)}`)),
              explain: `${rows.map((r, i) => `${LAB[i]} ${tx(r[0])} ${signOf(r)} ${tx(r[1])}`).join(', ')}이다. 음수는 0보다 작고, 음수끼리는 절댓값이 큰 수가 작다.`,
              facts: { truth: rows.map((r, i) => i === oddAt), want: true }
            });
          }),
          T('order-claims', '절댓값이 섞인 대소 관계가 옳지 않은 것 찾기', '①27 ②18 심15', (d) => {
            const REL = { '<': LT, '>': GT, '=': '=' }, rel = (p, q) => (qcmp(p, q) < 0 ? '<' : qcmp(p, q) > 0 ? '>' : '=');
            const a = Q(d.int(2, 9)), b = Q(d.int(2, 9));
            const makers = [
              () => ({ L: `|${tx(qneg(a))}|`, R: `|${sx(a)}|`, lv: a, rv: a }),
              () => ({ L: `${MINUS}|${tx(qneg(b))}|`, R: tx(qneg(b)), lv: qneg(b), rv: qneg(b) }),
              () => { const [p, q] = d.until(() => [Q(-d.int(1, 12)), Q(-d.int(1, 12))], ([m, k]) => qcmp(m, k) !== 0); return { L: tx(p), R: tx(q), lv: p, rv: q }; },
              () => { const p = fr(d, [3, 4, 5], 2), q = fr(d, [2, 3, 5, 7], 2); return { L: `|${tx(qneg(p))}|`, R: tx(q), lv: p, rv: q }; },
              () => { const [p, q] = d.until(() => [qneg(fr(d, [2, 3, 4], 2)), qneg(fr(d, [3, 5, 7], 2))], ([m, k]) => qcmp(m, k) !== 0); return { L: tx(p), R: tx(q), lv: p, rv: q }; },
              () => { const [p, q] = d.until(() => [Q(d.int(2, 9)), Q(d.int(2, 9))], ([m, k]) => qcmp(m, k) !== 0); return { L: `|${sx(p)}|`, R: `|${tx(qneg(q))}|`, lv: p, rv: q }; },
              () => { const p = qneg(fr(d, [2, 3, 4, 5], 1)); return { L: '0', R: tx(p), lv: Q(0), rv: p }; }
            ];
            const rows = d.until(() => d.shuffle(makers).slice(0, 4).map((make) => make()), (list) => list.filter((r) => qcmp(r.lv, r.rv) === 0).length <= 1 && list.every((r) => r.lv.q * r.rv.q <= 40));
            const wrongAt = d.int(0, 3), flip = (r) => (r === '<' ? '>' : r === '>' ? '<' : '<');
            const shown = rows.map((r, i) => { const right = rel(r.lv, r.rv); return { text: `${r.L} ${REL[i === wrongAt ? flip(right) : right]} ${r.R}`, fix: `${r.L} ${REL[right]} ${r.R}` }; });
            return C('두 수의 대소 관계가 옳지 않은 것은?', shown.map((s) => s.text), wrongAt, {
              explain: `바르게 나타내면 ${shown[wrongAt].fix}이다. 절댓값은 부호를 뗀 수이고, 음수끼리는 절댓값이 큰 수가 작다.`,
              facts: { truth: rows.map((r, i) => i !== wrongAt), want: false }
            });
          }),
          T('order-facts', '수의 대소 관계에 대한 설명의 참·거짓', '①28', (d) => claimQ(d, '수의 대소 관계에 대한 설명으로 옳지 않은 것은?', ORDER_TRUE, ORDER_FALSE, false)),
          T('order-nth', '여러 수를 크기 차례로 놓을 때 몇 번째 수', '①29 ②19', (d) => {
            const list = d.until(() => d.shuffle([Q(-d.int(1, 9)), qneg(fr(d, [2, 3, 4, 5], 3)), dc(pm(d) * d.until(() => d.int(2, 39), (t) => t % 10 !== 0)), fr(d, [2, 3, 4, 5], 3), d.bool() ? Q(0) : Q(d.int(1, 5))]), (rows) => distinct(rows));
            const big = d.bool(), k = d.int(2, 4), sorted = list.slice().sort((p, q) => (big ? qcmp(q, p) : qcmp(p, q))), ORD = ['', '첫', '두', '세', '네', '다섯'];
            return C(`다음 수를 ${big ? '큰' : '작은'} 수부터 차례대로 놓을 때, ${ORD[k]} 번째에 오는 수는?`, list.map(tx), list.indexOf(sorted[k - 1]), {
              explain: `양수는 0보다 크고 음수는 0보다 작다. 음수끼리는 절댓값이 큰 수가 작다. ${big ? '큰' : '작은'} 수부터 차례대로 놓으면 ${sorted.map(tx).join(', ')}이다.`,
              facts: { rank: { values: list.map(fl), nth: big ? k : 6 - k } }
            });
          }),
          T('order-right-count', '수직선에서 어떤 수보다 오른쪽에 있는 수의 개수', '①30', (d) => {
            const base = qneg(fr(d, [2, 3, 4], 3));
            const list = d.until(() => d.shuffle([qneg(fr(d, [2, 3, 4, 5], 4)), qneg(fr(d, [3, 4, 5], 4)), dc(-d.until(() => d.int(3, 39), (t) => t % 10 !== 0)), Q(-d.int(1, 4)), Q(0), fr(d, [2, 3], 2)]), (rows) => distinct(rows.concat([base])) && rows.some((x) => qcmp(x, base) < 0) && rows.filter((x) => x.p < 0 && qcmp(x, base) > 0).length >= 1);
            const flags = list.map((x) => qcmp(x, base) > 0), hit = flags.filter(Boolean).length;
            return N(`다음 수를 수직선 위에 점으로 나타낼 때, ${tj(base, '을/를')} 나타내는 점보다 오른쪽에 있는 점은 모두 몇 개인가?`, hit, {
              unit: '개', figure: numbers(list.map(tx)),
              explain: `수직선에서 오른쪽에 있는 수가 더 크므로 ${tx(base)}보다 큰 수를 센다. ${tx(base)}보다 큰 수는 ${list.filter((x, i) => flags[i]).map(tx).join(', ')}의 ${hit}개이다.`,
              facts: { count: flags }
            });
          }),
          T('order-to-ineq', '문장을 부등호를 사용한 식으로 나타내기', '①31 ②20', (d) => {
            const a = d.bool() ? Q(-d.int(1, 9)) : qneg(fr(d, [2, 3, 4, 5], 3)), b = d.bool() ? Q(d.int(1, 9)) : fr(d, [2, 3, 4, 5], 3), name = d.pick(['x', 'a']);
            const LOW = [[(t) => `${t}보다 크고`, LT], [(t) => `${t}보다 크거나 같고`, LE], [(t) => `${t} 이상이고`, LE], [(t) => `${t} 초과이고`, LT]], UP = [[(t) => `${t}보다 작다`, LT], [(t) => `${t}보다 작거나 같다`, LE], [(t) => `${t} 이하이다`, LE], [(t) => `${t} 미만이다`, LT]];
            const lo = d.pick(LOW), up = d.pick(UP), combos = d.shuffle([[LT, LT], [LE, LT], [LT, LE], [LE, LE]]);
            return C(`「${V(name)}는 ${lo[0](tx(a))} ${up[0](tx(b))}.」를 부등호를 사용하여 나타낸 것은?`, combos.map(([s1, s2]) => `${tx(a)} ${s1} ${V(name)} ${s2} ${tx(b)}`), combos.findIndex(([s1, s2]) => s1 === lo[1] && s2 === up[1]), {
              explain: `「크다」「초과」는 ${GT}, 「작다」「미만」은 ${LT}, 「크거나 같다」「이상」은 ${GE}, 「작거나 같다」「이하」는 ${LE}로 나타낸다. ${tx(a)} ${lo[1]} ${V(name)} ${up[1]} ${tx(b)}이다.`,
              facts: { truth: combos.map(([s1, s2]) => s1 === lo[1] && s2 === up[1]), want: true }
            });
          }),
          T('order-from-ineq', '부등호를 사용한 식이 나타내는 문장 고르기', '①32', (d) => {
            const a = d.bool() ? Q(-d.int(1, 9)) : qneg(fr(d, [2, 3, 4, 5], 3)), b = Q(d.int(1, 9)), name = d.pick(['x', 'a']);
            const LOW = { [LT]: [(t) => `${t}보다 크고`, (t) => `${t} 초과이고`], [LE]: [(t) => `${t}보다 크거나 같고`, (t) => `${t} 이상이고`] }, UP = { [LT]: [(t) => `${t}보다 작다`, (t) => `${t} 미만이다`], [LE]: [(t) => `${t}보다 작거나 같다`, (t) => `${t} 이하이다`] };
            const combos = d.shuffle([[LT, LT], [LE, LT], [LT, LE], [LE, LE]]), right = d.pick(combos);
            return C(`${tx(a)} ${right[0]} ${V(name)} ${right[1]} ${tx(b)}${tail(lastOf(b), '을/를')} 문장으로 바르게 나타낸 것은?`, combos.map(([s1, s2]) => `${V(name)}는 ${d.pick(LOW[s1])(tx(a))} ${d.pick(UP[s2])(tx(b))}.`), combos.indexOf(right), {
              explain: `${LT}는 「크다(작다)」「초과」「미만」, ${LE}는 「크거나 같다(작거나 같다)」「이상」「이하」를 나타낸다. ${tx(a)} ${right[0]} ${V(name)}는 ${V(name)}가 ${tx(a)}${right[0] === LT ? '보다 크다' : '보다 크거나 같다'}는 뜻이고, ${V(name)} ${right[1]} ${tx(b)}${tail(lastOf(b), '은/는')} ${V(name)}가 ${tx(b)}${right[1] === LT ? '보다 작다' : '보다 작거나 같다'}는 뜻이다.`,
              facts: { truth: combos.map((c) => c === right), want: true }
            });
          })
        ]
      },
      {
        id: 'add', title: '정수와 유리수의 덧셈', standard: STD5,
        types: [
          T('add-line-expr', '수직선의 화살표가 나타내는 덧셈식 고르기', '②23', (d) => {
            const [a, b] = d.until(() => [nz(d, -5, 5), nz(d, -8, 8)], ([p, q]) => p * q < 0 && Math.abs(p) !== Math.abs(q) && Math.abs(p + q) <= 5 && Math.abs(p) >= 2), r = a + b;
            const line = (x, op, y, v) => `${px(Q(x))} ${op} ${px(Q(y))} = ${sx(Q(v))}`;
            const right = line(a, '+', b, r), rows = d.shuffle([right, line(-a, '+', -b, -r), line(a, '+', r, a + r), line(a, MINUS, b, a - b)]);
            return C('수직선의 두 화살표로 나타낸 계산을 덧셈식으로 바르게 쓴 것은?', rows, rows.indexOf(right), {
              figure: nline(-5, 5, { moves: [{ from: Q(0), to: Q(a) }, { from: Q(a), to: Q(r) }] }),
              explain: `0에서 ${a > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(a)}칸 간 것은 ${sx(Q(a))}, 이어서 ${b > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(b)}칸 간 것은 ${sx(Q(b))}${tail(Math.abs(b), '을/를')} 더한 것이다. 도착한 곳이 ${sx(Q(r))}이므로 ${right}이다.`,
              facts: { truth: rows.map((s) => s === right), want: true }
            });
          }),
          T('add-int', '정수의 덧셈', '①34 ②24·25', (d, n) => {
            // 차례마다 구조가 다르다: 부호가 같은 두 음수, 부호가 다른 두 수, 절댓값이 같고 부호가 다른 두 수.
            const a = d.int(2, 19), b = d.until(() => d.int(2, 19), (v) => v !== a), s = pm(d);
            const [x, y] = n === 0 ? [Q(-a), Q(-b)] : n === 1 ? [Q(s * a), Q(-s * b)] : [Q(s * a), Q(-s * a)];
            return calcQ([P(x), '+', P(y)], 'int', { rule: 'add-int-' + n, explain: (n === 0 ? SAME_ADD : n === 1 ? DIFF_ADD : '절댓값이 같고 부호가 다른 두 수의 합은 0이다. ') + addTold(x, y) + '이다.' });
          }, { count: 3 }),
          T('add-frac', '분수의 덧셈', '①35 ②26·27', (d, n) => {
            // 차례마다 구조가 다르다: 분모가 같다(부호 다름), 통분(부호 같음), 통분(부호 다름), 정수와 분수.
            const s = pm(d);
            const list = pickEx(d, () => {
              if (n === 0) { const q = d.int(3, 9); return [P(Q(s * co(d, q, 1, 2 * q), q)), '+', P(Q(-s * co(d, q, 1, 2 * q), q))]; }
              if (n === 3) { const f = fr(d, [2, 3, 4, 5, 6], 2), k = Q(d.int(1, 6)), t = pm(d); return d.bool() ? [P(qmul(f, Q(s))), '+', P(qmul(k, Q(t)))] : [P(qmul(k, Q(t))), '+', P(qmul(f, Q(s)))]; }
              const x = fr(d, [2, 3, 4, 5, 6, 8], 2), y = fr(d, [2, 3, 4, 5, 6, 8], 2);
              return [P(qmul(x, Q(n === 1 ? -1 : s))), '+', P(qmul(y, Q(n === 1 ? -1 : -s)))];
            }, 'frac', (e) => (n === 0 || n === 3 || e[0].x.q !== e[2].x.q) && lcm(e[0].x.q, e[2].x.q) <= 24 && (n !== 3 || e[0].x.p < 0 || e[2].x.p < 0) && Math.abs(val(e).p) <= 40);
            const x = list[0].x, y = list[2].x;
            return calcQ(list, 'frac', { rule: 'add-frac-' + n, explain: (x.p * y.p > 0 ? SAME_ADD : DIFF_ADD) + (n === 0 ? '' : '분모가 다르면 통분하여 계산한다. ') + addTold(x, y) + '이다.' });
          }, { count: 4 }),
          T('add-dec', '소수의 덧셈', '②28', (d, n) => {
            const t = () => d.until(() => d.int(11, 79), (v) => v % 10 !== 0), s = pm(d);
            const list = pickEx(d, () => (n === 0 ? [P(dc(-t())), '+', P(dc(-t()))] : [P(dc(s * t())), '+', P(dc(-s * t()))]), 'dec');
            return calcQ(list, 'dec', { rule: 'add-dec-' + n, explain: (n === 0 ? SAME_ADD : DIFF_ADD) + addTold(list[0].x, list[2].x) + '이다.' });
          }, { count: 2 }),
          T('add-frac-dec', '분수와 소수가 섞인 덧셈', '②29', (d) => {
            const DECS = [[dc(5), [2, 4, 6]], [dc(15), [2, 4]], [dc(25), [2, 4]], [dc(2), [5, 10]], [dc(4), [5, 10]], [dc(6), [5]], [dc(8), [5, 10]], [dc(12), [5]], [dc2(25), [2, 4, 8]], [dc2(75), [2, 4, 8]], [dc2(125), [2, 4]]];
            const list = pickEx(d, () => { const [x, dens] = d.pick(DECS), f = fr(d, dens, 2), s = pm(d), t = s > 0 ? -1 : pm(d), a = P(qmul(Q(s), f)), b = P(t < 0 ? qneg(x) : x); return d.bool() ? [a, '+', b] : [b, '+', a]; }, 'frac', (e) => val(e).q <= 20);
            const x = list[0].x, y = list[2].x;
            return calcQ(list, 'frac', { rule: 'add-frac-dec', explain: '소수를 분수로 고쳐서 계산한다. ' + addTold(x, y) + '이다.' });
          }),
          T('add-three-int', '세 수 이상의 정수의 덧셈', '①40 ②30', (d, n) => {
            if (n === 0) {
              // 합이 0인 두 수가 떨어져 있다.
              const a = d.int(3, 15), b = d.until(() => d.int(2, 15), (v) => v !== a), s = pm(d), t = pm(d), x = Q(s * a), y = Q(t * b), z = Q(-s * a);
              return calcQ([P(x), '+', P(y), '+', P(z)], 'int', { rule: 'add-three-zero', explain: `덧셈의 교환법칙과 결합법칙을 이용하여 합이 0인 두 수를 먼저 더한다. ${px(x)} + ${px(y)} + ${px(z)} = {${px(x)} + ${px(z)}} + ${px(y)} = 0 + ${px(y)} = ${tx(y)}이다.` });
            }
            const [p1, p2, n1, n2] = d.until(() => [d.int(2, 15), d.int(2, 15), d.int(2, 15), d.int(2, 15)], (v) => new Set(v).size === 4 && v[0] + v[1] !== v[2] + v[3]);
            const xs = d.pick([[p1, -n1, -n2, p2], [-n1, p1, p2, -n2], [p1, -n1, p2, -n2], [-n1, p1, -n2, p2]]).map((v) => Q(v)), list = [P(xs[0]), '+', P(xs[1]), '+', P(xs[2]), '+', P(xs[3])];
            return calcQ(list, 'int', { rule: 'add-four', explain: `덧셈의 교환법칙과 결합법칙을 이용하여 양수는 양수끼리, 음수는 음수끼리 모아서 더한다. ${inl(list)} = {${px(Q(p1))} + ${px(Q(p2))}} + {${px(Q(-n1))} + ${px(Q(-n2))}} = ${px(Q(p1 + p2))} + ${px(Q(-n1 - n2))} = ${tx(val(list))}이다.` });
          }, { count: 2 }),
          T('add-three-frac', '세 수 이상의 분수·소수의 덧셈', '②31', (d, n) => {
            if (n === 0) {
              // 분모가 같은 두 분수의 합이 정수가 된다.
              const [x, y, z] = d.until(() => { const q2 = d.pick([2, 3, 4, 5]), b = co(d, q2, 1, 2 * q2 - 1), k = d.int(1, 2), s = pm(d); return [qmul(Q(pm(d)), fr(d, [2, 3, 4, 5, 6].filter((q) => q !== q2), 2)), Q(s * b, q2), Q(s * (k * q2 - b), q2)]; }, (v) => v[2].p !== 0 && v[0].q !== v[1].q && v.some((t) => t.p < 0));
              const sum = qadd(y, z), first = d.bool(), list = first ? [P(x), '+', P(y), '+', P(z)] : [P(y), '+', P(x), '+', P(z)];
              return calcQ(list, 'frac', { rule: 'add-three-frac', explain: `덧셈의 교환법칙과 결합법칙을 이용하여 분모가 같은 두 수를 먼저 더한다. ${inl(list)} = ${px(x)} + {${px(y)} + ${px(z)}} = ${px(x)} + ${px(sum)} = ${tx(val(list))}이다.` });
            }
            // 소수끼리, 분모가 같은 분수끼리 더하면 저마다 정수가 된다.
            const [a, b, f, g] = d.until(() => { const t = d.until(() => d.int(11, 69), (v) => v % 10 !== 0), k1 = d.int(1, 3), q = d.pick([3, 4, 5, 6, 7]), m = co(d, q, 1, 2 * q - 1), k2 = d.int(1, 2), s = pm(d), u = pm(d); return [dc(s * t), dc(-s * (t - 10 * k1)), Q(u * m, q), Q(-u * (m + k2 * q), q)]; }, (v) => v[1].p !== 0 && Math.abs(fl(v[1])) > 0.05);
            const list = [P(a), '+', P(f), '+', P(b), '+', P(g)], s1 = qadd(a, b), s2 = qadd(f, g);
            return calcQ(list, 'int', { rule: 'add-four-mixed', explain: `덧셈의 교환법칙과 결합법칙을 이용하여 소수는 소수끼리, 분수는 분수끼리 더한다. ${inl(list)} = {${px(a)} + ${px(b)}} + {${px(f)} + ${px(g)}} = ${px(s1)} + ${px(s2)} = ${tx(val(list))}이다.` });
          }, { count: 2 }),
          T('add-laws', '계산 과정에 이용된 덧셈의 계산 법칙', '①39 ②32', (d) => {
            // 둘째 줄은 두 수의 자리를 바꾸었고(교환법칙), 셋째 줄은 먼저 더할 두 수를 묶었다(결합법칙).
            const [x, y, z] = d.bool() ? (() => { const a = d.int(2, 9), c = 10 * d.int(1, 2) - a, s = pm(d); return [Q(s * a), Q(-s * d.int(11, 29)), Q(s * c)]; })()
              : (() => { const q = d.pick([3, 4, 5]), a = co(d, q, 1, q - 1), s = pm(d); return [Q(s * a, q), Q(-s * d.int(2, 9)), Q(s * (d.int(1, 2) * q - a), q)]; })();
            const sum = qadd(x, z), v = qadd(sum, y), right = '교환법칙, 결합법칙', rows = d.shuffle([right, '결합법칙, 교환법칙', '교환법칙, 교환법칙', '결합법칙, 결합법칙']);
            return C('다음 계산 과정에서 ㉠, ㉡에 이용된 덧셈의 계산 법칙을 차례대로 쓴 것은?', rows, rows.indexOf(right), {
              figure: proc([{ h: html([P(x), '+', P(y), '+', P(z)]) }, { h: html([P(x), '+', P(z), '+', P(y)]), mark: LAB[0] }, { h: html([G([P(x), '+', P(z)], '{'), '+', P(y)]), mark: LAB[1] }, { h: html([P(sum), '+', P(y)]) }, { h: tx(v) }]),
              explain: `㉠은 ${px(y)}${tail(lastOf(y), '과/와')} ${px(z)}의 자리를 바꾸었으므로 덧셈의 교환법칙, ㉡은 앞의 두 수를 먼저 더하도록 묶었으므로 덧셈의 결합법칙을 이용하였다.`,
              facts: { truth: rows.map((r) => r === right), want: true }
            });
          }),
          T('add-law-blanks', '덧셈의 계산 법칙을 이용한 계산 과정의 빈칸', '②32', (d) => {
            const a = d.int(12, 48), c = d.until(() => 10 * d.int(3, 9) - a, (v) => v >= 11 && v !== a), b = d.until(() => d.int(13, 89), (v) => v % 10 !== 0 && v !== a + c), s = pm(d);
            const x = Q(s * a), y = Q(-s * b), z = Q(s * c), sum = qadd(x, z), v = qadd(sum, y);
            return M('다음은 덧셈의 교환법칙과 결합법칙을 이용하여 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: sum.p, signed: true }, { label: LAB[1], answer: v.p, signed: true }], {
              figure: proc([{ h: html([P(x), '+', P(y), '+', P(z)]) }, { h: html([P(x), '+', P(z), '+', P(y)]) }, { h: html([G([P(x), '+', P(z)], '{'), '+', P(y)]) }, { h: `(${box(LAB[0])}) <i>+</i> ${px(y)}` }, { h: box(LAB[1]) }]),
              explain: `${px(x)} + ${px(z)} = ${tx(sum)}이므로 ㉠은 ${sx(sum)}이다. ${addTold(sum, y)}이므로 ㉡은 ${tx(v)}이다.`,
              facts: { calc: [[`${js(x)}+${js(z)}`, 0], [`${js(x)}+${js(z)}+${js(y)}`, 1]] }
            });
          }),
          T('add-bigger-by', '어떤 수보다 얼마만큼 큰 수', '①48 ②35', (d) => {
            const [x, y] = d.until(() => [Q(nz(d, -12, 12)), Q(nz(d, -12, 12))], ([p, q]) => (p.p < 0 || q.p < 0) && p.p + q.p !== 0), v = qadd(x, y);
            return ansV(`${tx(x)}보다 ${tx(y)}만큼 큰 수는?`, v, 'int', {
              explain: `${tx(x)}보다 ${tx(y)}만큼 큰 수는 ${tj(x, '과/와')} ${tx(y)}의 합이다. ${addTold(x, y)}이다.` + (y.p < 0 ? ` 음수 ${tx(y)}만큼 큰 수는 ${mag(y)}만큼 작은 수이다.` : ''),
              facts: { value: `${js(x)}+${js(y)}` }
            });
          }),
          T('add-pyramid', '위 칸이 아래 두 칸의 합인 그림의 빈칸', '②36', (d) => {
            const [a, b, c] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9), nz(d, -9, 9)], (v) => v.some((k) => k < 0) && v.some((k) => k > 0) && v[0] + v[1] !== 0 && v[1] + v[2] !== 0 && v[0] !== v[2] && v[0] + 2 * v[1] + v[2] !== 0);
            const xs = [a, b, c].map((k) => Q(k)), m1 = a + b, m2 = b + c, top = m1 + m2;
            return M('위 칸의 수는 바로 아래 두 칸에 적힌 수의 합이다. ㉠, ㉡, ㉢에 알맞은 수는?', [m1, m2, top].map((v, i) => ({ label: LAB[i], answer: v, signed: true })), {
              figure: pyramid(xs.map((x) => plain(x, true)), [LAB[0], LAB[1]], LAB[2]),
              explain: `㉠은 ${addTold(xs[0], xs[1])}, ㉡은 ${addTold(xs[1], xs[2])}이다. ㉢은 ㉠과 ㉡의 합이므로 ${addTold(Q(m1), Q(m2))}이다.`,
              facts: { calc: [[`${js(xs[0])}+${js(xs[1])}`, 0], [`${js(xs[1])}+${js(xs[2])}`, 1], [`${js(xs[0])}+${js(xs[1])}+${js(xs[1])}+${js(xs[2])}`, 2]] }
            });
          })
        ]
      },
      { id: 'sub', title: '뺄셈, 덧셈과 뺄셈의 혼합 계산', standard: STD5, types: [] },
      { id: 'mul', title: '곱셈(거듭제곱, 분배법칙)', standard: STD5, types: [] },
      { id: 'div', title: '나눗셈과 역수', standard: STD5, types: [] },
      { id: 'mix', title: '덧셈, 뺄셈, 곱셈, 나눗셈의 혼합 계산', standard: STD5, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(7-1-2b.js, 7-1-2c.js)이 함께 쓰는 도구
  B.kit.m712 = {
    STD3, STD4, STD5, LAB, MINUS, GT, LT, GE, LE, range, gcd, lcm, Q, dc, dc2, plainQ, qadd, qsub, qmul, qdiv, keepD, qneg, qabs, qpow, qcmp, isInt, fl, asDec,
    mag, tx, sx, px, nb, plain, tail, lastOf, tj, sj, pj, js, V, sup, P, U, S, G, W, WN, MN, A, isNum, val, valT, html, htmlT, OPS, BR, inl, jsx, step, trace, chainOf, intsOnly, biggest, flatNums,
    emOf, fit, ex, show, tag, tagged, taggedEx, proc, flow, nline, f1, nz, pm, co, fr, distinct, okKind, ansV, valueFacts, CALC, calcQ, pickEx,
    SAME_ADD, DIFF_ADD, TO_ADD, SAME_MUL, DIFF_MUL, SAME_DIV, DIFF_DIV, BY_RECIP, rawMag, uniq, addTold, subTold, mulTold, divTold, commonTold, SITS, un, sv, cell, fake, listOf, named, claimQ
  };
})(typeof window !== 'undefined' ? window : globalThis);
