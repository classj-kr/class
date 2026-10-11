// 3학년 1학기 4단원 곱셈 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록 넷(기본꼴 1~3, 심화꼴)과 덧문서 모음을 처음부터 끝까지 다시 읽고, 3-1-4a.js·3-1-4b.js 의 유형이 묻지 않는 꼴을 옮겼다.
// 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다. ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번, 덧은 덧문서 모음이다.
// 꼴마다의 판정(이미 있음 / 새로 실음 / 뺌)은 references/textbooks/수학/_분석/3-1-4/채우기_대조표.md 에 적었다.
//
// 곱셈은 모두 (두 자리 수)×(한 자리 수)까지다. 이어 곱하는 문항도 앞의 곱이 두 자리 수일 때만 다시 곱한다.
// 지난번에 「하는 일이 같다」며 한 문항으로 합쳤던 것 가운데 주는 것·묻는 것·계산 구조·문장제 얼개가 다른 것은 따로 실었다:
//   올림 구조마다의 그림(10짜리·1짜리)·자리별 곱·올림한 수 적기, 잘못 계산한 세로셈의 세 가지 틀린 꼴, 곱과 수의 비교, 가장 큰 곱 고르기,
//   곱이 같은 식 찾기, 가려진 숫자 하나, 가장 작은 곱(수 카드), 양쪽이 곱인 □, 묶음에서 일부 덜기, 뺀 뒤 곱하기, 더한 뒤 몇 배, 세 묶음 비교.
//
// 뺀 것과 까닭
//  - 5학년 「다각형의 둘레와 넓이」: 정사각형·삼각형의 변의 길이의 합(①56 ②52 심37, ②53·심40의 철사 변형), 이어 붙인 정사각형의 굵은 선(②55)
//  - 4학년 2학기 「관계와 규칙」의 등식: 곱이 같아지는 □(②43 ③8, 덧문서의 45×4=90×□)
//  - 곱에서 거꾸로 수를 찾는 것(3학년 2학기·4학년 나눗셈): (몇십)×□=(몇십)·어떤 수×(몇)=(몇십)(①6 ②5), 곱하는 수 □ 구하기(③49 심20의 식 빈칸, ②40의 곱하는 수 빈칸),
//    ●÷2=10(①7 심28), 곱이 정해진 두 수 찾기(②7 ②48), 자리를 바꾼 수(심30), 몇 배의 합에서 처음 수(②65), 고장 난 계산기(③82), 「적어도 몇 묶음」(심56),
//    어떤 수에서 뺀 값이 몇 배와 같다(덧문서 — 방정식 꼴)
//  - 4학년 「규칙 찾기」: 같은 수를 곱해 가는 수의 줄(심33)
//  - 조건 풀이·경우 따지기가 어려움의 대부분: 곱과 견준 끝 수(①50 심24), 두 곱 사이의 수(①51 ②42 ③54 심25), 양쪽 부등식(③53 심26), 약속한 기호(②50 심31),
//    합·차 조건으로 수 찾기(심32), 간격·자르는 횟수·겹쳐 이은 길이(①67 ②56 심57~59), 달 수·요일 세기(①64 심42), 몇 년 뒤 나이(심50),
//    남은 것끼리의 차(①65 심60), 수 카드 네다섯 장에서 골라 만들기(③58 심63), 곱이 기준에 가까운 두 수 고르기(심19), 「두 번째로 큰」 두 자리 수(②46의 변형)
//  - 뜻 없는 셈: 식으로만 준 두 곱의 합·차(②45 ③46 심16), 가장 큰 곱과 가장 작은 곱의 합·차(③47 심64), 두 식의 □ 더하기(①8), 빈칸 수끼리의 차(③51의 변형)
//  - 서술형·문제 만들기·놀이·앞 학년 되짚기: ①33 ①54 ①69 ②66 ②67 ②68 ③10 ③45 ③69 ③70 ③74 ③76~81 심11 심67~69
//  - 그림의 수를 알 수 없는 꼴: ①68 ③75
//  - 수만·상황만·방향만 다른 것(이미 있는 유형과 같은 문제): 큰 것부터↔작은 것부터, 바르게 계산한 것↔틀린 것, 더했더니↔뺐더니, 다리 수의 합↔차,
//    화살표 한 번·「두 수의 곱」 빈칸·선 잇기 같은 틀, 도형 안의 수의 곱(③44)
// 그림이 필요해 미룬 꼴: 과녁 점수(②8 — 과녁과 화살 그림). 점수별로 맞힌 횟수를 표로 준 문항(h-score)은 실었다.
// 검사 때문에 싣지 못한 꼴: (몇십)×(몇) 세로셈(①1 ②1 ③5의 세로 꼴). 세로셈 칸의 「2 0 × 3」에서 검사가 「0 × 3」을 범위 밖 곱셈으로 읽는다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, column, columnSteps, chars, counters, numberLine, cards, lines, tagged, numbers, table, N, M, C, E, mulPair, mulCarries, MUL } = B.kit;
  const CALC = '4수01-04', EST = '4수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 기본 자료(와 덧문서)에만 나오지만 뜻을 정확히 알아야 하거나 세 번 넘게 계산해야 하는 문항
  const HB = (id, title, ref, make, more) => T(id, title, ref, make, Object.assign({ level: '실력' }, more || {}));
  const SIGNS = ['&gt;', '=', '&lt;'];
  const DIGITS = [2, 3, 4, 5, 6, 7, 8, 9];
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const times = (a, b) => expr(a, '*', b, '=', a * b);
  const product = ([x, y]) => x * y;
  // 수 뒤에 붙는 토씨만: tail(240, '을/를') → '을'
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  // 같은 수를 n번 더한 식
  const plus = (list) => list.reduce((out, v, i) => out.concat(i ? ['+', v] : [v]), []);
  const repeated = (a, n, ...more) => expr(...plus(Array.from({ length: n }, () => a)), ...more);
  // 곱이 p 인 (두 자리 수)×(한 자리 수)
  const factorings = (p) => DIGITS.filter((b) => p % b === 0 && p / b >= 11 && p / b <= 99).map((b) => [p / b, b]);
  // 곱이 정한 수 가까이에 오는 (몇십몇)×(몇). 견주는 문항은 곱이 몰려 있어야 계산해야 풀린다.
  const near = (d, center, spread) => d.until(() => { const list = factorings(center + d.int(-spread, spread)).filter(([x]) => x % 10 !== 0); return list.length ? d.pick(list) : null; }, Boolean);
  // 곱이 서로 다르고 곱해지는 수도 서로 다른 식 k개
  const nearSet = (d, center, spread, k, ok) => d.until(() => Array.from({ length: k }, () => near(d, center, spread)),
    (list) => new Set(list.map(product)).size === k && new Set(list.map(([x]) => x)).size === k && (!ok || ok(list)));
  // 곱이 같은 (몇십몇)×(몇)이 둘 넘게 있는 수
  const plainFactorings = (p) => factorings(p).filter(([x]) => x % 10 !== 0);
  const TWICE = []; for (let p = 40; p <= 420; p += 1) if (plainFactorings(p).length >= 2) TWICE.push(p);
  // 곱이 같은 (몇십)×(몇)
  const TENS = {}; for (let t = 2; t <= 9; t += 1) for (let b = 2; b <= 9; b += 1) (TENS[t * 10 * b] = TENS[t * 10 * b] || []).push([t * 10, b]);
  const TENS_TWICE = Object.keys(TENS).map(Number).filter((p) => TENS[p].length >= 2);

  // ── (몇십)×(몇) ────────────────────────────────────────────────
  B.addTypes('3-1-4', 'tens', [
    T('tens-model', '그림을 보고 10의 개수로 곱 구하기', '①2 ①4 ②2 ③1', (d) => {
      // 30씩 3줄: 10이 9개 → 90
      const t = d.int(2, 4), b = d.int(2, 4), a = t * 10;
      return M(`그림은 ${a}씩 ${b}줄을 나타낸 것이다. 10은 모두 ${box(LABELS[0])}개이므로 ${a} × ${b}의 값은 ${box(LABELS[1])}이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: t * b }, { label: LABELS[1], answer: a * b }], {
        figure: counters(a, b), explain: `10이 한 줄에 ${t}개씩 ${b}줄이므로 ${times(t, b)}(개)이다. 10이 ${t * b}개이면 ${a * b}이므로 ${times(a, b)}이다.`,
        facts: { calc: [[E(t, '*', b), 0], [E(a, '*', b), 1]], mul: [a, b] }
      });
    }),
    T('tens-talk', '(몇십)×(몇)과 (몇)×(몇)의 관계 고르기', '②6 ①38', (d) => {
      const t = d.int(2, 9), b = d.int(2, 9), a = t * 10, right = `${t}*${b}*10`;
      const rows = d.shuffle([
        // 0을 떼고 곱한 값을 그대로 답하는 아이가 고른다.
        [`${t} × ${b}의 값과 같다.`, `${t}*${b}`],
        [`${t} × ${b}의 값의 10배이다.`, right],
        // 10배인 수와 10만큼 더 큰 수를 같은 것으로 아는 아이가 고른다.
        [`${t} × ${b}의 값보다 10만큼 더 크다.`, `${t}*${b}+10`],
        // 곱셈과 덧셈을 가리지 못하는 아이가 고른다.
        [`${a} + ${b}의 값과 같다.`, `${a}+${b}`]
      ]);
      return C(`${a} × ${b}의 값에 대한 설명으로 옳은 것은?`, rows.map(([said]) => said), rows.findIndex(([, text]) => text === right), {
        explain: `${josa(a, '은/는')} ${t}의 10배이므로 ${a} × ${b}의 값은 ${t} × ${b}의 값의 10배이다. ${times(t, b)}이므로 ${times(a, b)}이다.`,
        facts: { choose: { exprs: rows.map(([, text]) => text), rule: 'equals', target: a * b }, mul: [a, b] }
      });
    }),
    T('tens-odd', '계산 결과가 다른 (몇십)×(몇)', '②35 ③39', (d) => {
      // ㉠ 20×6 ㉡ 30×4 ㉢ 40×4
      const p = d.pick(TENS_TWICE), same = d.shuffle(TENS[p]).slice(0, 2);
      // 다른 하나는 곱이 가까운 식에서 고른다(곱해지는 수가 같은 식은 되도록 피한다).
      const all = Object.keys(TENS).map(Number).filter((v) => v !== p && Math.abs(v - p) <= 120).reduce((out, v) => out.concat(TENS[v]), []);
      const fresh = all.filter(([x]) => same.every(([sx]) => sx !== x)), other = d.pick(fresh.length ? fresh : all);
      const at = d.int(0, 2), rows = same.slice(0, at).concat([other], same.slice(at));
      return C('계산 결과가 나머지 둘과 다른 것은?', LABELS.slice(0, 3), at, {
        figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'odd' } }
      });
    })
  ]);

  // ── 올림이 없는 (몇십몇)×(몇) ──────────────────────────────────
  B.addTypes('3-1-4', 'plain', [
    T('plain-places', '그림을 보고 10과 1의 개수로 곱 구하기', '①10 ②11', (d) => {
      // 21씩 3줄: 10이 6개, 1이 3개 → 63
      const [a, b] = mulPair(d, (c, x, y) => MUL.none(c, x) && x <= 44 && x % 10 <= 4 && y <= 4 && x % 10 !== Math.floor(x / 10)), t = Math.floor(a / 10), o = a % 10;
      return M(`그림은 ${a}씩 ${b}줄을 나타낸 것이다. 10은 모두 ${box(LABELS[0])}개, 1은 모두 ${box(LABELS[1])}개이므로 ${a} × ${b}의 값은 ${box(LABELS[2])}이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: t * b }, { label: LABELS[1], answer: o * b }, { label: LABELS[2], answer: a * b }], {
        figure: counters(a, b), explain: `10은 ${times(t, b)}(개), 1은 ${times(o, b)}(개)이다. 10이 ${t * b}개, 1이 ${o * b}개인 수는 ${a * b}이므로 ${times(a, b)}이다.`,
        facts: { calc: [[E(t, '*', b), 0], [E(o, '*', b), 1], [E(a, '*', b), 2]], mul: [a, b] }
      });
    }),
    T('plain-both', '그림을 덧셈식과 곱셈식으로 나타내기', '②12 심4', (d) => {
      // 23+23+23=□, 23×□=□
      const [a, b] = mulPair(d, (c, x, y) => MUL.none(c, x) && x <= 44 && x % 10 <= 4 && y >= 3 && y <= 4);
      return M('그림을 보고 덧셈식과 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a * b }, { label: LABELS[1], answer: b }], {
        figure: counters(a, b) + lines([repeated(a, b, '=', box(LABELS[0])), expr(a, '*', box(LABELS[1]), '=', box(LABELS[0]))]),
        explain: `${josa(a, '을/를')} ${b}번 더한 것이므로 곱셈식으로 나타내면 ${times(a, b)}이다.`,
        facts: { calc: [[Array.from({ length: b }, () => a).join('+'), 0], [String(b), 1]], mul: [a, b] }
      });
    })
  ]);

  // ── 십의 자리에서 올림이 있는 (몇십몇)×(몇) ───────────────────
  B.addTypes('3-1-4', 'upper', [
    T('upper-model', '그림으로 십의 자리에서의 올림 알아보기', '①14 ②11 ③17', (d) => {
      // 42씩 3줄: 10이 12개 → 120, 42×3=126
      const [a, b] = mulPair(d, (c, x, y) => MUL.upper(c, x) && y <= 4 && Math.floor(x / 10) + (x % 10) <= 9), t = Math.floor(a / 10), o = a % 10;
      return M(`그림은 ${a}씩 ${b}줄을 나타낸 것이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: t * b }, { label: LABELS[1], answer: t * b * 10 }, { label: LABELS[2], answer: a * b }], {
        figure: counters(a, b) + lines([`10은 모두 ${box(LABELS[0])}개이다.`, `10이 ${box(LABELS[0])}개이면 ${box(LABELS[1])}이다.`, expr(a, '*', b, '=', box(LABELS[2]))]),
        explain: `10은 한 줄에 ${t}개씩 ${b}줄이므로 ${times(t, b)}(개)이고, 10이 ${t * b}개이면 ${t * b * 10}이다. 1은 ${times(o, b)}(개)이므로 ${expr(t * b * 10, '+', o * b, '=', a * b)}이다.`,
        facts: { calc: [[E(t, '*', b), 0], [`${t}*${b}*10`, 1], [E(a, '*', b), 2]], mul: [a, b] }
      });
    }),
    T('upper-frame', '문장을 곱셈식으로 나타내기', '①5 ②17 ②19 ③16', (d) => {
      const [a, b] = mulPair(d, MUL.upper);
      return M(`구슬이 한 봉지에 ${a}개씩 들어 있다. ${b}봉지에 들어 있는 구슬의 수를 구하는 곱셈식을 만들 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a * b }], {
        figure: expr(a, '*', box(LABELS[0]), '=', box(LABELS[1])), explain: `${a}개씩 ${b}봉지이므로 ${times(a, b)}이다.`,
        facts: { calc: [[String(b), 0], [E(a, '*', b), 1]], mul: [a, b] }
      });
    }),
    T('upper-fix', '자리를 잘못 맞춘 세로셈 바로잡기', '①39 ②39 ③30 심66', (d) => {
      // 62×4 를 8 과 24 로 적어 32 라고 한 것(십의 자리 곱 240 을 24 로 적음)
      const [a, b] = mulPair(d, (c, x) => MUL.upper(c, x) && x % 10 >= 2), o = a % 10, t = Math.floor(a / 10), wrong = o * b + t * b;
      return N(`${a} × ${josa(b, '을/를')} 다음과 같이 잘못 계산하였다. 바르게 계산한 값은?`, a * b, {
        figure: columnSteps(chars(a), '*', [String(b)], [chars(o * b), chars(t * b)], chars(wrong)),
        explain: `십의 자리 계산 ${times(t * 10, b)}${tail(t * 10 * b, '을/를')} ${t * b}${tail(t * b, '으로/로')} 잘못 적었다. 바르게 계산하면 ${expr(o * b, '+', t * 10 * b, '=', a * b)}이다.`,
        facts: { calc: [[E(a, '*', b), 0]], mul: [a, b], wrongValue: wrong }
      });
    })
  ]);

  // ── 일의 자리에서 올림이 있는 (몇십몇)×(몇) ───────────────────
  B.addTypes('3-1-4', 'ones', [
    T('ones-split', '한 식으로 갈라 계산하기', '①19 ②11 ②13 ③12', (d) => {
      // 16×6 = 10×6 + 6×6 = 60 + 36 = 96
      const [a, b] = mulPair(d, (c, x) => MUL.ones(c, x) && x % 10 !== Math.floor(x / 10)), o = a % 10, t = a - o;
      return M(`${a} × ${josa(b, '을/를')} 다음과 같이 계산할 때, ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: t * b }, { label: LABELS[1], answer: o * b }, { label: LABELS[2], answer: a * b }], {
        figure: lines([expr(a, '*', b, '=', t, '*', b, '+', o, '*', b), expr('=', box(LABELS[0]), '+', box(LABELS[1])), expr('=', box(LABELS[2]))]),
        explain: `${times(t, b)}, ${times(o, b)}이고, 두 곱을 더하면 ${expr(t * b, '+', o * b, '=', a * b)}이다.`,
        facts: { calc: [[E(t, '*', b), 0], [E(o, '*', b), 1], [E(a, '*', b), 2]], mul: [a, b] }
      });
    }),
    T('ones-line', '수직선으로 (몇십몇)×(몇) 구하기', '②49 ③4', (d) => {
      // 14씩 5번 뛰어 70. 끝 수는 적지 않는다.
      const [a, n] = mulPair(d, (c, x, y) => MUL.ones(c, x) && y >= 3 && y <= 5 && x <= 28);
      return M('수직선에서 뛰어 센 것을 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: a * n }], {
        figure: numberLine(a * n, a, { tick: a, hideEnd: true, length: 230 }) + expr(a, '*', box(LABELS[0]), '=', box(LABELS[1])),
        explain: `0부터 ${a}씩 ${n}번 뛰었다. ` + times(a, n), facts: { calc: [[String(n), 0], [E(a, '*', n), 1]], mul: [a, n] }
      });
    }),
    T('ones-part', '세로셈의 한 줄이 어떤 두 수의 곱인지 고르기', '②15 ①15 ①22', (d) => {
      // 26×3 의 둘째 줄 60 은 20×3 이다.
      const [a, b] = mulPair(d, (c, x) => MUL.ones(c, x) && x % 10 !== Math.floor(x / 10)), o = a % 10, t = Math.floor(a / 10);
      const rows = d.shuffle([
        [t * 10, b],
        // 십의 자리 숫자를 그대로 한 자리 수로 보는 아이가 고른다(자릿값을 놓침).
        [t, b],
        // 윗줄(일의 자리 곱)과 헷갈린 아이가 고른다.
        [o, b],
        // 맨 아랫줄(전체 곱)과 헷갈린 아이가 고른다.
        [a, b]
      ]);
      return C(`${a} × ${josa(b, '을/를')} 계산한 세로셈이다. ㉠이 가리키는 수는 어떤 두 수의 곱인가?`, rows.map(([x, y]) => expr(x, '*', y)), rows.findIndex(([x]) => x === t * 10), {
        figure: columnSteps(chars(a), '*', [String(b)], [chars(o * b), chars(t * 10 * b)], chars(a * b), ['', '← ' + LABELS[0]]),
        explain: `${a}의 십의 자리 숫자 ${josa(t, '은/는')} ${josa(t * 10, '을/를')} 나타낸다. ㉠이 가리키는 수는 ${times(t * 10, b)}이다.`,
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: t * 10 * b }, mul: [a, b] }
      });
    }),
    T('ones-fix', '올림한 수를 그대로 적은 세로셈 바로잡기', '②39 ③30 심66', (d) => {
      // 37×2 를 614 라고 한 것(일의 자리 곱 14 를 올림하지 않고 그대로 적음)
      const [a, b] = mulPair(d, MUL.ones), o = a % 10, t = Math.floor(a / 10), wrong = Number(String(t * b) + String(o * b));
      return N('다음 세로셈은 잘못 계산한 것이다. 바르게 계산한 값은?', a * b, {
        figure: column(chars(a), '*', [String(b)], chars(wrong)),
        explain: `일의 자리 계산 ${times(o, b)}에서 ${josa(Math.floor((o * b) / 10) * 10, '을/를')} 십의 자리로 올림하지 않고 그대로 적었다. 바르게 계산하면 ${times(a, b)}이다.`,
        facts: { calc: [[E(a, '*', b), 0]], mul: [a, b], wrongValue: wrong }
      });
    })
  ]);

  // ── 올림이 두 번 있는 (몇십몇)×(몇) ───────────────────────────
  B.addTypes('3-1-4', 'both', [
    T('both-model', '그림을 보고 자리별로 곱하여 더하기', '①25 ③26 덧', (d) => {
      // 46씩 3줄: 40×3=120, 6×3=18, 46×3=138
      const [a, b] = mulPair(d, (c, x, y) => MUL.both(c) && y <= 4 && Math.floor(x / 10) + (x % 10) <= 10 && (x * y) % 100 !== 0), o = a % 10, t = a - o;
      return M(`그림은 ${a}씩 ${b}줄을 나타낸 것이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: t * b }, { label: LABELS[1], answer: o * b }, { label: LABELS[2], answer: a * b }], {
        figure: counters(a, b) + lines([`10이 나타내는 수: ${expr(t, '*', b, '=', box(LABELS[0]))}`, `1이 나타내는 수: ${expr(o, '*', b, '=', box(LABELS[1]))}`, expr(a, '*', b, '=', box(LABELS[2]))]),
        explain: `${times(t, b)}, ${times(o, b)}이고, 두 곱을 더하면 ${expr(t * b, '+', o * b, '=', a * b)}이다.`,
        facts: { calc: [[E(t, '*', b), 0], [E(o, '*', b), 1], [E(a, '*', b), 2]], mul: [a, b] }
      });
    }),
    T('both-steps', '자리별 곱을 차례로 적는 세로셈', '①26 ②14 ③13 심5', (d) => {
      // 38×5 → 40, 150, 190
      const [a, b] = mulPair(d, (c, x) => MUL.both(c) && x % 10 !== Math.floor(x / 10)), o = a % 10, t = a - o;
      return M(`${a} × ${josa(b, '을/를')} 일의 자리, 십의 자리의 차례로 곱하여 적은 세로셈이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: o * b }, { label: LABELS[1], answer: t * b }, { label: LABELS[2], answer: a * b }], {
        figure: columnSteps(chars(a), '*', [String(b)], [box(LABELS[0]), box(LABELS[1])], box(LABELS[2])),
        explain: `${times(o, b)}, ${times(t, b)}이고, 두 곱을 더하면 ${expr(o * b, '+', t * b, '=', a * b)}이다.`,
        facts: { calc: [[E(o, '*', b), 0], [`${t / 10}*10*${b}`, 1], [E(a, '*', b), 2]], unseen: [10], mul: [a, b] }
      });
    }),
    T('both-carry', '올림한 수를 적는 세로셈', '①27 ②21 ③13', (d) => {
      // 36×7=252: 일의 자리에서 올림한 4, 곱의 십의 자리 숫자 5
      const [a, b] = mulPair(d, (c, x, y) => MUL.both(c) && Math.floor((x * y) / 10) % 10 !== 0), o = a % 10, t = Math.floor(a / 10), p = a * b, up = Math.floor((o * b) / 10);
      return M(`${a} × ${josa(b, '을/를')} 계산한 세로셈이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: up }, { label: LABELS[1], answer: Math.floor(p / 10) % 10 }], {
        figure: column(chars(a), '*', [String(b)], [String(Math.floor(p / 100)), box(LABELS[1]), String(p % 10)], [box(LABELS[0]), '']),
        explain: `일의 자리 계산 ${times(o, b)}에서 ${josa(up, '을/를')} 십의 자리 위에 적는다. 십의 자리 계산 ${times(t, b)}에 올림한 ${josa(up, '을/를')} 더하면 ${t * b + up}이므로 ㉡은 ${(t * b + up) % 10}이다.`,
        facts: { calc: [[`(${o}*${b}-(${o}*${b})%10)/10`, 0], [`(${a}*${b}-(${a}*${b})%10)/10%10`, 1]], unseen: [10], mul: [a, b] }
      });
    })
  ]);

  // ── 여러 가지 곱셈 ─────────────────────────────────────────────
  B.addTypes('3-1-4', 'mix', [
    T('mix-product', '말로 나타낸 곱', '①41 ②37 ②4 심1', (d) => {
      const [[a, b], [c, e]] = d.until(() => [mulPair(d, MUL.any), mulPair(d, MUL.any)], ([p, q]) => p[0] !== q[0] && p[1] !== q[1] && (mulCarries(p[0], p[1])[0] || mulCarries(q[0], q[1])[0]));
      return M('㉠, ㉡이 나타내는 수는?', [{ label: LABELS[0], answer: a * b }, { label: LABELS[1], answer: c * e }], {
        figure: tagged([`${josa(a, '과/와')} ${b}의 곱`, `${c}의 ${e}배`]), explain: `${LABELS[0]} ${times(a, b)}, ${LABELS[1]} ${times(c, e)}`,
        facts: { calc: [[E(a, '*', b), 0], [E(c, '*', e), 1]] }
      });
    }),
    T('mix-table', '한 수에 여러 수 곱하기', '①9 ①20 ②26 심2', (d) => {
      // 26 에 ×3, ×4, ×5
      const a = d.until(() => d.int(12, 48), (v) => v % 10 !== 0), start = d.int(2, 6), bs = [start, start + 1, start + 2];
      return M('빈칸 ㉠, ㉡, ㉢에 알맞은 수는?', bs.map((b, i) => ({ label: LABELS[i], answer: a * b })), {
        figure: table(['×', String(a)], bs.map((b, i) => [b, box(LABELS[i])])), explain: bs.map((b) => times(a, b)).join(', '),
        facts: { calc: bs.map((b, i) => [E(a, '*', b), i]) }
      });
    }),
    T('mix-add', '같은 수를 여러 번 더한 식을 곱셈식으로 고르기', '①3 ③2 심4', (d) => {
      const a = d.until(() => d.int(13, 78), (v) => v % 10 !== 0), n = d.int(3, 5);
      const rows = d.shuffle([
        [expr(a, '*', n), E(a, '*', n)],
        // 더하기 기호의 수를 세는 아이가 고른다.
        [expr(a, '*', n - 1), E(a, '*', n - 1)],
        // 하나 더 세는 아이가 고른다.
        [expr(a, '*', n + 1), E(a, '*', n + 1)],
        // 더한 횟수를 곱하지 않고 더하는 아이가 고른다.
        [expr(a, '+', n), E(a, '+', n)]
      ]);
      return C('덧셈식을 곱셈식으로 바르게 나타낸 것은?', rows.map(([html]) => html), rows.findIndex(([, text]) => text === E(a, '*', n)), {
        figure: repeated(a, n), explain: `${josa(a, '을/를')} ${n}번 더한 것이므로 ${times(a, n)}이다.`,
        facts: { choose: { exprs: rows.map(([, text]) => text), rule: 'equals', target: a * n } }
      });
    }),
    T('mix-compare-num', '곱과 수의 크기 비교', '①30 ②30 ③34 심9', (d) => {
      // 41×6 ○ 250. 올림한 수를 빠뜨리면 부등호가 뒤집히는 수와 견준다.
      const [a, b] = mulPair(d, (c, x) => MUL.any(c, x) && c[0]), p = a * b, up = Math.floor(((a % 10) * b) / 10) * 10;
      // 올림한 수를 빠뜨린 값(=라고 답하게 된다), 곱과 같은 수, 곱보다 조금 큰 수 가운데 하나와 견준다.
      const n = d.pick([p - up, p, p + d.int(2, 8)]);
      return C('계산 결과와 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, p > n ? 0 : p === n ? 1 : 2, {
        figure: versus(expr(a, '*', b), expr(n)), explain: `${times(a, b)}이다.`, facts: { choose: { exprs: [E(a, '*', b), String(n)], rule: 'compare' } }
      });
    }),
    T('mix-max', '계산 결과가 가장 큰(작은) 식', '①31 ②31 ③37 심10', (d) => {
      // 곱해지는 수가 가장 큰(작은) 식이 답이 되지 않게 한다.
      const big = d.bool(), best = (values) => (big ? Math.max(...values) : Math.min(...values));
      const rows = nearSet(d, d.int(90, 420), 22, 4, (list) => list.map(([x]) => x)[list.map(product).indexOf(best(list.map(product)))] !== best(list.map(([x]) => x)));
      const values = rows.map(product);
      return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, rows.map(([x, y]) => expr(x, '*', y)), values.indexOf(best(values)), {
        explain: rows.map(([x, y]) => times(x, y)).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: big ? 'max' : 'min' } }
      });
    }),
    T('mix-equal', '계산 결과가 주어진 수인 식', '①35 ②34 심13', (d) => {
      // 계산 결과가 84인 것: ㉠ 23×4 ㉡ 12×7 ㉢ 46×2
      const [a, b] = mulPair(d, (c, x, y) => MUL.any(c, x) && c[0] && x * y <= 600), p = a * b;
      // 일의 자리 숫자만 보고 고르지 못하게, 곱의 일의 자리 숫자가 같은 식(곱이 10이나 20 차이)을 하나 넣는다.
      const twins = [p - 10, p + 10, p - 20, p + 20].reduce((out, v) => out.concat(plainFactorings(v)), []).filter(([x]) => x !== a);
      const others = d.until(() => [twins.length ? d.pick(twins) : near(d, p, 16), near(d, p, 16)], ([q, r]) => product(q) !== p && product(r) !== p && product(q) !== product(r) && new Set([a, q[0], r[0]]).size === 3);
      const rows = d.shuffle([[a, b]].concat(others));
      return C(`계산 결과가 ${p}인 것은?`, LABELS.slice(0, 3), rows.findIndex((row) => product(row) === p), {
        figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: p } }
      });
    }),
    T('mix-same', '계산 결과가 같은 두 식', '①37 ②29 ③40 심14', (d) => {
      // 16×3, 36×2, 24×2, 13×4 → 16×3 과 24×2
      const p = d.pick(TWICE), same = d.shuffle(plainFactorings(p)).slice(0, 2);
      const others = d.until(() => [near(d, p, 14), near(d, p, 14)], ([q, r]) => product(q) !== p && product(r) !== p && product(q) !== product(r) && new Set([same[0][0], same[1][0], q[0], r[0]]).size === 4);
      const rows = d.shuffle(same.concat(others));
      const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], hit = pairs.find(([i, j]) => product(rows[i]) === product(rows[j]));
      const shown = d.shuffle([hit].concat(d.shuffle(pairs.filter((pair) => pair !== hit)).slice(0, 3)));
      return C('계산 결과가 같은 두 식을 찾아 기호를 쓴 것은?', shown.map(([i, j]) => `${LABELS[i]}, ${LABELS[j]}`), shown.indexOf(hit), {
        figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'same', pairsShown: shown } }
      });
    }),
    T('mix-between', '두 수 사이에 있는 곱', '심13', (d) => {
      // 200보다 크고 250보다 작은 것: 하나는 200보다 작고 하나는 250보다 크다.
      const low = d.pick([100, 150, 200, 250, 300]), high = low + 50;
      const picked = d.until(() => [near(d, low - 20, 18), near(d, low + 25, 22), near(d, high + 20, 18)], (list) => new Set(list.map(([x]) => x)).size === 3);
      const order = d.shuffle([0, 1, 2]), rows = order.map((i) => picked[i]);
      return C(`계산 결과가 ${low}보다 크고 ${high}보다 작은 것은?`, LABELS.slice(0, 3), order.indexOf(1), {
        figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
        facts: { between: { low: String(low), high: String(high), exprs: rows.map(([x, y]) => E(x, '*', y)) } }
      });
    }),
    T('mix-count', '기준 수보다 작은 곱의 수', '②33 ②38 심15', (d) => {
      // 300보다 작은 것 모두: ① 45×3 ② 53×6 ③ 64×5 ④ 73×4
      const target = d.pick([100, 150, 200, 250, 300]), hits = (list) => list.filter((row) => product(row) < target).length;
      const rows = nearSet(d, target, 40, 4, (list) => list.every((row) => product(row) !== target) && hits(list) >= 2 && hits(list) <= 3);
      return N(`계산 결과가 ${target}보다 작은 것은 모두 몇 개인가?`, hits(rows), {
        unit: '개', figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'countBelow', target } }
      });
    }),
    T('mix-who-wrong', '잘못 계산한 식을 찾아 바르게 계산하기', '①40 ②38 ③31', (d) => {
      // 지우 26×3=68, 서연 46×2=92 → 26×3=78. 틀린 값은 일의 자리에서 올림한 수를 더하지 않은 값이다.
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const rows = d.until(() => [mulPair(d, (c) => c[0]), mulPair(d, (c) => c[0])], ([p, q]) => p[0] !== q[0] && p[1] !== q[1]);
      const at = d.int(0, 1), said = rows.map(([x, y], i) => (i === at ? x * y - Math.floor(((x % 10) * y) / 10) * 10 : x * y)), [a, b] = rows[at];
      return N('두 사람 중 한 사람이 잘못 계산하였다. 잘못 계산한 식을 바르게 계산한 값은?', a * b, {
        figure: lines(rows.map(([x, y], i) => `${[one, two][i]}: ${expr(x, '*', y, '=', said[i])}`)),
        explain: `${rows.map(([x, y]) => times(x, y)).join(', ')}이므로 ${name([one, two][at], '이/가')} 잘못 계산하였다. 일의 자리에서 올림한 수를 더하지 않았다.`,
        facts: { calc: [[E(a, '*', b), 0]], mul: [a, b], wrongValue: said[at] }
      });
    }),
    T('mix-said-max', '여러 가지로 나타낸 수의 크기 비교', '①43 ②31 심16', (d) => {
      // ㉠ 48 × 2 ㉡ 17을 5번 더한 수 ㉢ 33의 3배 ㉣ 19씩 4묶음
      const big = d.bool(), best = (values) => (big ? Math.max(...values) : Math.min(...values));
      const rows = nearSet(d, d.int(80, 300), 20, 4, (list) => list.map(([x]) => x)[list.map(product).indexOf(best(list.map(product)))] !== best(list.map(([x]) => x)));
      const forms = d.shuffle([([x, y]) => `${x} × ${y}`, ([x, y]) => `${josa(x, '을/를')} ${y}번 더한 수`, ([x, y]) => `${x}의 ${y}배`, ([x, y]) => `${x}씩 ${y}묶음`]);
      const values = rows.map(product);
      return C(`나타내는 수가 가장 ${big ? '큰' : '작은'} 것은?`, rows.map((row, i) => forms[i](row)), values.indexOf(best(values)), {
        explain: rows.map(([x, y]) => times(x, y)).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: big ? 'max' : 'min' } }
      });
    }),
    T('mix-cards', '수 카드로 만든 두 자리 수와 남은 수의 곱', '①53 ②46 ③59 심65', (d) => {
      // 3, 5, 9 → 가장 큰 두 자리 수 95 와 남은 수 3 의 곱
      const big = d.bool(), list = d.shuffle(d.shuffle(DIGITS).slice(0, 3)), [low, mid, high] = list.slice().sort((p, q) => p - q);
      const [x, y, z] = big ? [high, mid, low] : [low, mid, high], two = x * 10 + y;
      return N(`수 카드 3장 중에서 2장을 골라 가장 ${big ? '큰' : '작은'} 두 자리 수를 만들고, 이 수에 남은 수 카드의 수를 곱하였다. 곱은?`, two * z, {
        figure: cards(list), explain: `가장 ${big ? '큰' : '작은'} 두 자리 수는 ${two}이고 남은 수는 ${z}이다. ${times(two, z)}`,
        facts: { calc: [[`(${x}*10+${y})*${z}`, 0]], unseen: [10], mul: [two, z] }
      });
    }),
    T('mix-bigsmall', '골라서 만든 가장 큰 곱과 가장 작은 곱', '심18', (d) => {
      // 43, 5, 8, 32, 61, 4 → 61×8, 32×4
      const twos = d.until(() => [d.int(12, 89), d.int(12, 89), d.int(12, 89)], (list) => new Set(list).size === 3 && list.every((v) => v % 10 !== 0));
      const ones = d.shuffle(DIGITS).slice(0, 3), list = d.shuffle(twos.concat(ones));
      const [bigTwo, bigOne, smallTwo, smallOne] = [Math.max(...twos), Math.max(...ones), Math.min(...twos), Math.min(...ones)];
      return M('두 자리 수 하나와 한 자리 수 하나를 골라 곱하려고 한다. 만들 수 있는 가장 큰 곱과 가장 작은 곱은?', [{ label: '가장 큰 곱', answer: bigTwo * bigOne }, { label: '가장 작은 곱', answer: smallTwo * smallOne }], {
        figure: numbers(list), explain: `가장 큰 곱은 큰 수끼리 곱한 ${times(bigTwo, bigOne)}이고, 가장 작은 곱은 작은 수끼리 곱한 ${times(smallTwo, smallOne)}이다.`,
        facts: { calc: [[E(bigTwo, '*', bigOne), 0], [E(smallTwo, '*', smallOne), 1]] }
      });
    }),
    T('mix-place', '10과 1의 개수로 말한 수의 몇 배', '심1', (d) => {
      // 10이 2개, 1이 9개인 수의 2배
      const [a, b] = mulPair(d, (c, x) => MUL.any(c, x) && (c[0] || c[1])), t = Math.floor(a / 10), o = a % 10;
      return N(`10이 ${t}개, 1이 ${o}개인 수의 ${b}배는?`, a * b, {
        explain: `10이 ${t}개, 1이 ${o}개인 수는 ${a}이다. ${times(a, b)}`, facts: { calc: [[`(10*${t}+1*${o})*${b}`, 0]], mul: [a, b] }
      });
    }),
    T('mix-two', '한 상황에서 두 가지 곱 구하기', '②62 ③29 ③68 덧', (d) => {
      // 한 꾸러미에 색종이 22장과 구슬 12개씩 4꾸러미
      const k = d.int(3, 8), [x, y] = d.until(() => [d.int(12, 48), d.int(12, 48)], ([p, q]) => p !== q && p % 10 !== 0 && q % 10 !== 0 && (mulCarries(p, k)[0] || mulCarries(q, k)[0]));
      return M(`만들기 꾸러미 한 개에 색종이 ${x}장과 구슬 ${y}개를 넣는다. 꾸러미 ${k}개를 만드는 데 필요한 색종이와 구슬은 각각 몇 장, 몇 개인가?`, [{ label: '색종이', answer: x * k, unit: '장' }, { label: '구슬', answer: y * k, unit: '개' }], {
        explain: `색종이는 ${times(x, k)}(장), 구슬은 ${times(y, k)}(개)이다.`, facts: { calc: [[E(x, '*', k), 0], [E(y, '*', k), 1]] }
      });
    }),
    T('mix-est-word', '문장제: 어림한 값과 실제 값', '①72 ②22 ③71 심8', (d) => {
      const a = d.until(() => d.int(18, 92), (v) => [1, 2, 8, 9].includes(v % 10)), b = d.int(3, 8), about = Math.round(a / 10) * 10;
      return M(`도서관 책꽂이 한 칸에 책이 ${a}권씩 꽂혀 있다. 책꽂이 ${b}칸에 꽂혀 있는 책의 수를 구할 때, ${josa(a, '을/를')} 가장 가까운 몇십으로 어림하여 구한 수와 실제 책의 수는 각각 몇 권인가?`, [{ label: '어림한 수', answer: about * b, unit: '권' }, { label: '실제 수', answer: a * b, unit: '권' }], {
        explain: `${josa(a, '은/는')} ${about}에 가까우므로 어림한 수는 ${times(about, b)}(권)이고, 실제 수는 ${times(a, b)}(권)이다.`,
        facts: { calc: [[E(about, '*', b), 0], [E(a, '*', b), 1]], unseen: [about], mul: [a, b] }
      });
    }, { standard: EST }),
    T('mix-est-closer', '실제 값에 더 가깝게 어림한 사람', '③72', (d) => {
      // 27×3 을 20×3=60, 30×3=90 으로 어림 → 90 이 더 가깝다.
      const a = d.until(() => d.int(13, 88), (v) => [2, 3, 7, 8].includes(v % 10)), b = d.int(3, 7), low = Math.floor(a / 10) * 10, p = a * b;
      const [one, two] = d.shuffle(NAMES).slice(0, 2), tens = d.shuffle([low, low + 10]), estimates = tens.map((v) => v * b), gaps = estimates.map((v) => Math.abs(v - p));
      const winner = gaps[0] < gaps[1] ? 0 : 1;
      return C(`공책이 한 묶음에 ${a}권씩 ${b}묶음 있다. 공책의 수를 두 사람이 다음과 같이 어림하였다. 실제 공책의 수에 더 가깝게 어림한 사람은?`, [one, two, '두 사람이 어림한 값이 똑같이 가깝다.'], winner, {
        figure: lines(tens.map((v, i) => `${[one, two][i]}: ${josa(a, '을/를')} ${josa(v, '으로/로')} 어림하면 ${times(v, b)}`)),
        explain: `실제 공책의 수는 ${times(a, b)}(권)이다. ${josa(estimates[0], '과/와')}의 차는 ${gaps[0]}, ${josa(estimates[1], '과/와')}의 차는 ${gaps[1]}이므로 ${name([one, two][winner], '이/가')} 더 가깝게 어림하였다.`,
        facts: { closer: { expr: E(a, '*', b), estimates }, mul: [a, b] }
      });
    }, { standard: EST }),
    T('mix-meter', '문장제: 곱한 길이를 몇 m 몇 cm로', '덧(수학익힘)', (d) => {
      const who = d.pick(NAMES), [a, b] = mulPair(d, (c, x, y) => MUL.any(c, x) && x >= 35 && x <= 65 && x * y > 100 && (x * y) % 100 !== 0), p = a * b;
      return M(`${name(who, '은/는')} 한 걸음에 ${a} cm씩 걷는다. ${name(who, '이/가')} ${b}걸음을 걸었을 때 간 거리는 몇 m 몇 cm인가?`, [{ answer: Math.floor(p / 100), unit: 'm' }, { answer: p % 100, unit: 'cm' }], {
        explain: `${times(a, b)}(cm)이다. 100 cm는 1 m이므로 ${p} cm는 ${Math.floor(p / 100)} m ${p % 100} cm이다.`,
        facts: { calc: [[`(${a}*${b}-(${a}*${b})%100)/100`, 0], [`(${a}*${b})%100`, 1]], unseen: [100], mul: [a, b] }
      });
    })
  ]);

  // ── 실력 문제 ──────────────────────────────────────────────────
  B.addTypes('3-1-4', 'hard', [
    HB('h-est-talk', '어림한 값과 실제 값의 크기', '①71', (d) => {
      // 69×5 를 70×5=350 으로 어림했다면 실제 값은 350보다 작다.
      const a = d.until(() => d.int(27, 89), (v) => v % 10 >= 7), b = d.int(3, 8), up = (Math.floor(a / 10) + 1) * 10, down = up - 10;
      const rows = d.shuffle([
        { text: `${josa(a, '은/는')} ${up}보다 작으므로 ${a} × ${josa(b, '은/는')} ${up} × ${b} = ${up * b}보다 작다.`, ok: true },
        // 가깝게 어림했으니 실제 값이 그보다 클 수도 있다고 여기는 아이가 고른다(올려 어림한 값과 실제 값의 크기를 따지지 않는다).
        { text: `${josa(a, '은/는')} ${up}에 가까우므로 ${a} × ${josa(b, '은/는')} ${up} × ${b} = ${up * b}보다 크다.`, ok: false },
        // 어림한 값을 실제 값으로 아는 아이가 고른다.
        { text: `${josa(a, '은/는')} ${up}에 가까우므로 ${a} × ${josa(b, '은/는')} ${up} × ${b} = ${josa(up * b, '과/와')} 같다.`, ok: false },
        // 내려 어림한 값과 실제 값의 크기를 거꾸로 아는 아이가 고른다.
        { text: `${josa(a, '은/는')} ${down}보다 크므로 ${a} × ${josa(b, '은/는')} ${down} × ${b} = ${down * b}보다 작다.`, ok: false }
      ]);
      return C(`${a} × ${b}의 값을 어림하여 말한 것으로 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        explain: `${josa(a, '은/는')} ${down}보다 크고 ${up}보다 작다. 따라서 ${a} × ${b}의 값은 ${times(down, b)}보다 크고 ${times(up, b)}보다 작다. 실제 값은 ${times(a, b)}이다.`,
        facts: { truth: rows.map((row) => row.ok), want: true, mul: [a, b] }
      });
    }, { standard: EST }),
    H('h-count', '□에 들어갈 수 있는 수의 개수', '①49 ②41 ③52 심22', (d) => {
      // 47×□>300 → 7, 8, 9 의 3개
      const a = d.until(() => d.int(13, 48), (v) => v % 10 !== 0), k = d.int(4, 7), limit = a * k + d.int(2, a - 2);
      return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', 9 - k, {
        unit: '개', figure: expr(a, '*', box(), '<i>&gt;</i>', limit),
        explain: `${times(a, k)}, ${times(a, k + 1)}이므로 □ 안에 들어갈 수 있는 수는 ${DIGITS.filter((v) => v > k).join(', ')}이다. 모두 ${9 - k}개이다.`,
        facts: { digit: { template: `${a}*□>${limit}`, lo: 1, hi: 9, ask: 'count' } }
      });
    }),
    H('h-twoside', '두 곱을 비교하는 식의 □', '①49 ②41 ③52 심23 덧', (d) => {
      // 32×2<16×□ → 5
      const [c, k, a, b] = d.until(() => {
        const x = d.int(12, 38), q = d.int(3, 8), list = plainFactorings(d.int(x * (q - 1) + 1, x * q - 1)).filter(([m]) => m !== x);
        return x % 10 !== 0 && list.length ? [x, q].concat(d.pick(list)) : null;
      }, Boolean);
      return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 가장 작은 수는?', k, {
        figure: expr(a, '*', b, '<i>&lt;</i>', c, '*', box()),
        explain: `${times(a, b)}이다. ${times(c, k - 1)}, ${times(c, k)}이므로 □ 안에 들어갈 수 있는 가장 작은 수는 ${k}이다.`,
        facts: { digit: { template: `${a}*${b}<${c}*□`, lo: 1, hi: 9, ask: 'min' } }
      });
    }),
    H('h-near-box', '곱이 기준 수에 가장 가까워지는 □', '③55 심27', (d) => {
      // 61×□ 가 500 에 가장 가깝게 → 61×8=488(차 12), 61×9=549(차 49).
      // 기준 수를 넘지 않는 곱만 찾는 아이는 언제나 작은 쪽을, 넘는 곱만 찾는 아이는 큰 쪽을 고른다. 두 곱의 차를 견주어야 맞는다.
      const [a, target, k] = d.until(() => { const x = d.int(23, 86), t = d.pick([200, 300, 400, 500]); return [x, t, Math.floor(t / x)]; },
        ([x, t, q]) => x % 10 !== 0 && t % x !== 0 && q >= 3 && q <= 7 && t - x * q !== x * (q + 1) - t);
      const list = d.shuffle([k - 1, k, k + 1, k + 2]), gaps = list.map((v) => Math.abs(a * v - target));
      return C(`${a} × □의 값이 ${target}에 가장 가깝게 되는 □ 안의 수는?`, list.map(String), gaps.indexOf(Math.min(...gaps)), {
        explain: `${times(a, k)}, ${times(a, k + 1)}이다. ${josa(target, '과/와')}의 차가 각각 ${target - a * k}, ${a * (k + 1) - target}이므로 □ 안의 수는 ${list[gaps.indexOf(Math.min(...gaps))]}이다.`,
        facts: { choose: { exprs: list.map((v) => E(a, '*', v)), rule: 'nearest', target } }
      });
    }),
    H('h-cards-min', '수 카드로 만드는 가장 작은 곱', '①52 ②47 ③57 심62', (d) => {
      // 2, 5, 8 → 58×2=116
      const list = d.shuffle(d.shuffle(DIGITS).slice(0, 3)), [low, mid, high] = list.slice().sort((p, q) => p - q), two = mid * 10 + high;
      return N('수 카드 3장을 한 번씩만 사용하여 (몇십몇) × (몇)의 곱셈식을 만들려고 한다. 만들 수 있는 가장 작은 곱은?', two * low, {
        figure: cards(list), explain: `가장 작은 수 ${josa(low, '을/를')} 곱하는 수로 하고, 남은 두 수로 더 작은 두 자리 수 ${josa(two, '을/를')} 만든다. ${times(two, low)}`,
        facts: { calc: [[`(${mid}*10+${high})*${low}`, 0]], unseen: [10], mul: [two, low] }
      });
    }),
    H('h-wrong-div', '곱해야 할 것을 나눈 어떤 수', '②64 심29', (d) => {
      // 어떤 수에 4를 곱할 것을 4로 나누었더니 7 → 28×4=112
      const [b, q] = d.until(() => [d.int(3, 9), d.int(2, 9)], ([x, y]) => x !== y && x * y >= 12 && (x * y) % 10 !== 0), x = b * q;
      return N(`어떤 수에 ${josa(b, '을/를')} 곱해야 할 것을 잘못하여 ${josa(b, '으로/로')} 나누었더니 ${josa(q, '이/가')} 되었다. 바르게 계산한 값은?`, x * b, {
        explain: `어떤 수는 ${times(q, b)}이다. 바르게 계산하면 ${times(x, b)}이다.`, facts: { calc: [[`${q}*${b}*${b}`, 0]], mul: [x, b] }
      });
    }),
    H('h-sum', '문장제: 두 묶음의 합', '①60 ②60 ③65 심40 덧', (d) => {
      const [[a, b], [c, e]] = d.until(() => [mulPair(d, MUL.any), mulPair(d, MUL.any)], ([p, q]) => p[0] !== q[0] && p[1] !== q[1] && product(p) + product(q) <= 900 && mulCarries(p[0], p[1])[0] && (mulCarries(q[0], q[1])[0] || mulCarries(q[0], q[1])[1]));
      return N(`체육 창고에 탁구공이 한 상자에 ${a}개씩 ${b}상자, 테니스공이 한 상자에 ${c}개씩 ${e}상자 있다. 탁구공과 테니스공은 모두 몇 개인가?`, a * b + c * e, {
        unit: '개', explain: `탁구공은 ${times(a, b)}(개), 테니스공은 ${times(c, e)}(개)이다. ${expr(a * b, '+', c * e, '=', a * b + c * e)}`, facts: { calc: [[`${a}*${b}+${c}*${e}`, 0]] }
      });
    }),
    HB('h-table', '표를 보고 세 묶음의 합 구하기', '덧(서술형 평가)', (d) => {
      // 빨강 14장씩 2묶음, 노랑 18장씩 3묶음, 파랑 12장씩 3묶음
      const rows = d.until(() => [0, 1, 2].map(() => [d.int(12, 28), d.int(2, 5)]), (list) => new Set(list.map(([x]) => x)).size === 3 && list.every(([x]) => x % 10 !== 0) && list.some(([x, y]) => mulCarries(x, y)[0]) && new Set(list.map(([, y]) => y)).size >= 2);
      const colors = ['빨강', '노랑', '파랑'], total = rows.reduce((sum, row) => sum + product(row), 0);
      return N('색종이를 표와 같이 샀다. 산 색종이는 모두 몇 장인가?', total, {
        unit: '장', figure: table(['색', '한 묶음', '묶음 수'], rows.map(([x, y], i) => [colors[i], `${x}장`, `${y}묶음`])),
        explain: rows.map(([x, y], i) => `${colors[i]} ${times(x, y)}(장)`).join(', ') + `이다. ${expr(...plus(rows.map(product)), '=', total)}`,
        facts: { calc: [[rows.map(([x, y]) => `${x}*${y}`).join('+'), 0]] }
      });
    }),
    H('h-spare', '문장제: 한 개씩 나누어 주고 남는 수', '①59 심43 덧', (d) => {
      // 공책 32권씩 4묶음을 25명씩 5개 반 학생에게 한 권씩 → 3권
      // 한 반의 학생 수는 18~32명으로 둔다.
      const [[a, b], [c, e]] = d.until(() => [mulPair(d, MUL.any), [d.int(18, 32), d.int(2, 9)]], ([p, q]) => q[0] % 10 !== 0 && product(p) - product(q) >= 3 && product(p) - product(q) <= 40 && p[0] !== q[0] && p[1] !== q[1] && (mulCarries(p[0], p[1])[0] || mulCarries(q[0], q[1])[0]));
      return N(`공책이 한 묶음에 ${a}권씩 ${b}묶음 있다. 한 반에 ${c}명씩 ${e}개 반 학생에게 공책을 한 권씩 나누어 주면 남는 공책은 몇 권인가?`, a * b - c * e, {
        unit: '권', explain: `공책은 ${times(a, b)}(권), 학생은 ${times(c, e)}(명)이다. ${expr(a * b, '-', c * e, '=', a * b - c * e)}`, facts: { calc: [[`${a}*${b}-${c}*${e}`, 0]] }
      });
    }),
    H('h-three', '문장제: 세 묶음을 비교하여 고르기', '②58 심44', (d) => {
      // 하루에 접은 수가 가장 많은(적은) 사람이 답이 되지 않게 한다.
      const most = d.bool(), best = (values) => (most ? Math.max(...values) : Math.min(...values)), who = d.shuffle(NAMES).slice(0, 3);
      const rows = nearSet(d, d.int(100, 320), 18, 3, (list) => new Set(list.map(([, y]) => y)).size === 3 && list.map(([x]) => x)[list.map(product).indexOf(best(list.map(product)))] !== best(list.map(([x]) => x)));
      const values = rows.map(product);
      return C(`세 사람이 종이학을 다음과 같이 접었다. 종이학을 가장 ${most ? '많이' : '적게'} 접은 사람은?`, who, values.indexOf(best(values)), {
        figure: lines(rows.map(([x, y], i) => `${who[i]}: 하루에 ${x}개씩 ${y}일`)), explain: rows.map(([x, y], i) => `${who[i]} ${times(x, y)}(개)`).join(', '),
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: most ? 'max' : 'min' } }
      });
    }),
    H('h-score', '점수의 합을 비교하여 누가 얼마나 더', '①61 심45 ②8', (d) => {
      // 16점짜리와 7점짜리 과녁. 과녁을 더 많이 맞힌 사람이 점수는 더 낮다.
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [p, q, x1, y1, x2, y2] = d.until(() => [d.int(12, 25), d.int(5, 9), d.int(2, 6), d.int(2, 6), d.int(2, 6), d.int(2, 6)], ([big, small, a1, b1, a2, b2]) => {
        const t1 = big * a1 + small * b1, t2 = big * a2 + small * b2;
        return big % 10 !== 0 && a1 !== a2 && b1 !== b2 && a1 + b1 !== a2 + b2 && t1 !== t2 && Math.abs(t1 - t2) <= 20 && (a1 + b1 > a2 + b2) !== (t1 > t2);
      });
      const values = [p * x1 + q * y1, p * x2 + q * y2], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 10], [1 - winner, gap + 10]]);
      return C('과녁 맞히기 놀이에서 두 사람이 점수별로 과녁을 맞힌 횟수를 나타낸 표이다. 누가 몇 점 더 많이 얻었는가?', list.map(([who, n]) => `${[one, two][who]}, ${n}점`), list.findIndex(([who, n]) => who === winner && n === gap), {
        figure: table(['이름', `${p}점`, `${q}점`], [[one, `${x1}번`, `${y1}번`], [two, `${x2}번`, `${y2}번`]]),
        explain: `${name(one, '은/는')} ${times(p, x1)}, ${times(q, y1)}이므로 ${values[0]}점, ${name(two, '은/는')} ${times(p, x2)}, ${times(q, y2)}이므로 ${values[1]}점을 얻었다. ${name([one, two][winner], '이/가')} ${expr(Math.max(...values), '-', Math.min(...values), '=', gap)}(점) 더 많이 얻었다.`,
        facts: { who: { values, options: list, exprs: [`${p}*${x1}+${q}*${y1}`, `${p}*${x2}+${q}*${y2}`] } }
      });
    }),
    H('h-used', '문장제: 묶음 전체에서 일부를 덜어 낸 나머지', '②57 ③66 심47', (d) => {
      const [a, b] = mulPair(d, (c, x) => MUL.any(c, x) && c[0] && x <= 48), used = d.until(() => d.int(a + 3, a * b - 5), (v) => v % a !== 0 && v % 10 !== 0);
      return N(`빵집에서 빵을 한 판에 ${a}개씩 ${b}판 구웠다. 그중 ${used}개를 팔았다면 남은 빵은 몇 개인가?`, a * b - used, {
        unit: '개', explain: `구운 빵은 ${times(a, b)}(개)이다. ${expr(a * b, '-', used, '=', a * b - used)}`, facts: { calc: [[`${a}*${b}-${used}`, 0]] }
      });
    }),
    H('h-times-more', '문장제: 몇 배보다 몇 많은 수', '심38 덧', (d) => {
      const [a, b] = mulPair(d, (c, x, y) => MUL.any(c, x) && (c[0] || c[1]) && y <= 7), more = d.until(() => d.int(4, 38), (v) => v !== a && v % 10 !== 0);
      return N(`농장에 염소가 ${a}마리 있고, 닭은 염소 수의 ${b}배보다 ${more}마리 더 많다. 닭은 몇 마리인가?`, a * b + more, {
        unit: '마리', explain: `염소 수의 ${b}배는 ${times(a, b)}(마리)이다. ${expr(a * b, '+', more, '=', a * b + more)}`, facts: { calc: [[`${a}*${b}+${more}`, 0]] }
      });
    }),
    H('h-more-times', '문장제: 몇 많은(적은) 수의 몇 배', '①62 ③61 심54 덧', (d) => {
      // 40장, 5장 더 적게 → 35장, 그 3배
      const [one, two, three] = d.shuffle(NAMES).slice(0, 3), more = d.bool();
      const [a, gap, b] = d.until(() => [d.int(15, 60), d.int(3, 14), d.int(3, 8)], ([x, y, z]) => { const mid = more ? x + y : x - y; return mid >= 12 && mid <= 79 && mid % 10 !== 0 && mulCarries(mid, z)[0]; });
      const mid = more ? a + gap : a - gap;
      return N(`${name(one, '은/는')} 우표를 ${a}장 모았다. ${name(two, '은/는')} ${nick(one)}보다 ${gap}장 더 ${more ? '많이' : '적게'} 모았고, ${name(three, '은/는')} ${nick(two)}의 ${b}배만큼 모았다. ${name(three, '이/가')} 모은 우표는 몇 장인가?`, mid * b, {
        unit: '장', explain: `${name(two, '이/가')} 모은 우표는 ${expr(a, more ? '+' : '-', gap, '=', mid)}(장)이다. ${times(mid, b)}`, facts: { calc: [[`(${a}${more ? '+' : '-'}${gap})*${b}`, 0]] }
      });
    }),
    H('h-minus-times', '문장제: 남은 묶음에 든 낱개의 수', '심49', (d) => {
      // 70묶음 중 58묶음을 팔고 남은 12묶음, 한 묶음에 7개
      const [rest, k] = mulPair(d, (c, x) => MUL.any(c, x) && x <= 38 && c[0]), sold = d.until(() => d.int(13, 58), (v) => v % 10 !== 0 && (rest + v) <= 96), all = rest + sold;
      return N(`가게에 지우개가 ${all}묶음 있었는데 그중 ${sold}묶음을 팔았다. 한 묶음에 지우개가 ${k}개씩 들어 있다면 남은 지우개는 몇 개인가?`, rest * k, {
        unit: '개', explain: `남은 지우개는 ${expr(all, '-', sold, '=', rest)}(묶음)이다. ${times(rest, k)}`, facts: { calc: [[`(${all}-${sold})*${k}`, 0]] }
      });
    }),
    H('h-chain-sum', '문장제: 이어진 몇 배의 합', '①63 ③67 심52', (d) => {
      // 13개, 그 3배 39개, 다시 그 4배 156개 → 모두 208개
      const [one, two, three] = d.shuffle(NAMES).slice(0, 3);
      const [a, b, c] = d.until(() => [d.int(11, 32), d.int(2, 4), d.int(2, 5)], ([x, y, z]) => x % 10 !== 0 && x * y <= 98 && (x * y) % 10 !== 0 && y !== z && mulCarries(x * y, z)[0]);
      const total = a + a * b + a * b * c;
      return N(`${name(one, '은/는')} 종이별을 ${a}개 접었다. ${name(two, '은/는')} ${nick(one)}의 ${b}배만큼 접었고, ${name(three, '은/는')} ${nick(two)}의 ${c}배만큼 접었다. 세 사람이 접은 종이별은 모두 몇 개인가?`, total, {
        unit: '개', explain: `${name(two, '은/는')} ${times(a, b)}(개), ${name(three, '은/는')} ${times(a * b, c)}(개)를 접었다. ${expr(a, '+', a * b, '+', a * b * c, '=', total)}`,
        facts: { calc: [[`${a}+${a}*${b}+${a}*${b}*${c}`, 0]] }
      });
    }),
    H('h-age', '문장제: 몇 배보다 몇 많은 수의 몇 배', '심53 덧', (d) => {
      // 빨간 구슬 11개, 파란 구슬은 그 3배보다 5개 많은 38개, 노란 구슬은 파란 구슬의 2배
      const [a, b, more, k] = d.until(() => [d.int(11, 24), d.int(2, 4), d.int(2, 9), d.int(2, 7)], ([x, y, z, w]) => { const mid = x * y + z; return x % 10 !== 0 && mid <= 98 && mid % 10 !== 0 && y !== w && mulCarries(mid, w)[0]; });
      const mid = a * b + more;
      return N(`빨간 구슬이 ${a}개 있다. 파란 구슬은 빨간 구슬 수의 ${b}배보다 ${more}개 더 많고, 노란 구슬은 파란 구슬 수의 ${k}배이다. 노란 구슬은 몇 개인가?`, mid * k, {
        unit: '개', explain: `파란 구슬은 ${times(a, b)}, ${expr(a * b, '+', more, '=', mid)}(개)이다. 노란 구슬은 ${times(mid, k)}(개)이다.`, facts: { calc: [[`(${a}*${b}+${more})*${k}`, 0]] }
      });
    }),
    H('h-enough', '문장제: 모두 앉을 수 있는 곳', '심55', (d) => {
      // 200명: 22개씩 9줄(198), 37개씩 5줄(185), 26개씩 8줄(208). 한 줄의 의자 수가 가장 많은 곳이 답이 되지 않게 한다.
      const n = d.pick([150, 180, 200, 240, 250, 300]), PLACES = ['강당', '체육관', '시청각실'];
      const picked = d.until(() => [near(d, n - 14, 12), near(d, n - 14, 12), near(d, n + 14, 12)], (list) => new Set(list.map(product)).size === 3 && new Set(list.map(([x]) => x)).size === 3 && list[2][0] !== Math.max(...list.map(([x]) => x)));
      const order = d.shuffle([0, 1, 2]), rows = order.map((i) => picked[i]);
      return C(`학생 ${n}명이 한 명씩 의자에 앉으려고 한다. 의자가 다음과 같이 놓여 있을 때, 학생이 모두 앉을 수 있는 곳은?`, PLACES, order.indexOf(2), {
        figure: lines(rows.map(([x, y], i) => `${PLACES[i]}: 한 줄에 ${x}개씩 ${y}줄`)),
        explain: rows.map(([x, y], i) => `${PLACES[i]} ${times(x, y)}(개)`).join(', ') + `이다. 의자가 ${n}개보다 많은 곳을 고른다.`,
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'onlyAbove', target: n } }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
