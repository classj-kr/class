// 3학년 2학기 1단원 곱셈 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록 넷(기본꼴 1~3, 심화꼴)과 덧문서 모음을 처음부터 끝까지 다시 읽고, 3-2-1a.js·3-2-1b.js 의 유형이 묻지 않는 꼴을 옮겼다.
// 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다. ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번, 「덧」은 덧문서 모음이다.
//
// 곱은 (세 자리 수)×(한 자리 수)와 (두 자리 수)×(두 자리 수)까지다. 문장제에 딸린 덧셈·뺄셈은 세 자리 수 안에서만 한다.
// 하는 일이 다르면 다른 문제로 보았다: 0이 낀 수의 곱, 올림이 일어나는 자리(일→십, 십→백, 두 번), 나타내는 방법(수 모형, 동그라미 줄, 모눈 둘·넷,
// 가로로 푼 식, 세로셈의 줄), 틀린 계산의 갈래(자리별 곱의 자리, 0을 빠뜨림), 묻는 것(자리, 0의 개수, 가까운 곱, 같은 곱, 넉넉한가),
// 문장제의 얼개(왕복, 한 달, 1시간, 같은 길 세 번, 표에서 고르기, 배를 구해 더하기, 곱과 수 합치기, 두 번 곱하기, 만든 것에서 준 것 빼기).
//
// 뺀 것과 까닭
//  - 위 학년: 변의 길이의 합(①54·55의 일부 ②68 ③57 심7 심65 — 둘레, 5학년), 곱이 같아지는 □(①50 ②23 ③25 심24 — 등식, 4학년 2학기),
//    (몇십)×□=(몇천몇백)에서 몇십인 □(③24의 본디 꼴 — □0 꼴로 바꾸어 곱셈구구 안에서만 실었다), 겹친 길이 거꾸로(②80 — 두 자리 수로 나누기),
//    통나무 자르는 시간(심64의 변형 — 분을 시간으로 바꾸기)
//  - 조건 풀이·경우 따지기: 수 카드로 곱이 가장 큰(작은) 식 만들기(①53 ②61~63 ③19 ③44 심31 심39 심54, 덧문서의 같은 꼴),
//    곱이 주어진 수가 되는 두 수(②65 심41), 두 곱 사이의 수·두 값 사이의 □(①51 심47 심50, 덧), 간격·겹쳐 잇기(②78 ②79 심64, 덧),
//    여러 칸이 가려진 세로셈(①38 ②56 ③45 심36, ①12·②54·심17·심29의 두 칸짜리 — 한 칸짜리만 실었다), 약속셈(심53), 값표에서 살 수 있는 개수(③63),
//    달력에서 요일을 세어 곱하기(③58의 끝 변형), 10분에 몇 개씩 몇 시간(덧 — 시간을 10분 묶음으로 세는 비례 꼴)
//  - 뜻 없는 셈·네 자리 수 덧셈과 뺄셈이 따르는 것: 두 곱의 합·차(①48 ②50 ③54 심14), 거스름돈(①61 ③62 심63, 덧), 값이 큰 두 곱의 합(①58 ②72 ③61 심58의 일부)
//  - 서술형·문제 만들기·열린 문제·놀이: ①31 ①36 ①64 ②39 ②53 ②77 ③32 ③41 ③66 ③68 ③69 심56, 덧문서의 읽을거리(선을 그어 곱하기)와 열린 문제
//  - 앞 학기 되짚기: ②81 ③67
//  - 이미 있는 유형과 수·상황만 다른 것: 한 번 계산 문장제의 다른 상황(값·빠르기·뼘·묶음 낱말·이어 붙인 길이), 일주일을 2주일·몇 주로 바꾼 것,
//    두 사람의 양을 더해 곱하기(심59 — h-addmul), 전체에서 곱을 빼는 문장제의 다른 상황(덧 — h-left), 기준 수와 견주는 말 고르기(심45의 변형 — mix-above),
//    수를 고르는 조건만 바꾼 것(②48·③53의 「두 번째로 큰 수」), 답이 여럿인 「모두 고르기」(①45 ②44 ③49 ③55 — 답이 하나인 꼴로 실었다)
// 그림이 필요해 미룬 꼴: 동전 그림을 보고 그 금액의 몇 배 구하기(심66 — 동전 그림 도구가 없다. 수집본에도 수가 그림에만 있다)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, column, columnSteps, chars, lines, tagged, numbers, blocks, counters, cards, splitGrid, table, shapes, route, N, M, C, E } = B.kit;
  const geo = B.kit.geo;
  const CALC = '4수01-04', SOLVE = '4수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 기본 자료에만 나오지만 두 번 넘게 계산해야 하는 문장제
  const HB = (id, title, ref, make, more) => T(id, title, ref, make, Object.assign({ level: '실력' }, more || {}));
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const times = (a, b) => expr(a, '*', b, '=', a * b);
  const D3 = (a) => [Math.floor(a / 100), Math.floor(a / 10) % 10, a % 10];
  // (세 자리 수)×(한 자리 수)에서 올림이 일어나는 횟수(일·십·백의 자리 계산)
  const ups3 = (a, b) => { let carry = 0, n = 0; for (const digit of [a % 10, Math.floor(a / 10) % 10, Math.floor(a / 100)]) { carry = Math.floor((digit * b + carry) / 10); if (carry) n += 1; } return n; };
  // 0이 없는 세 자리 수와 한 자리 수. ok(올림 횟수, a, b)
  const pair3 = (d, ok) => d.until(() => [d.int(101, 989), d.int(2, 9)], ([a, b]) => a % 10 !== 0 && Math.floor(a / 10) % 10 !== 0 && ok(ups3(a, b), a, b));
  const MANY = (n) => n >= 2;
  // 몇십이 아닌 두 자리 수 둘
  const pair22 = (d, ok) => d.until(() => [d.int(12, 89), d.int(12, 89)], ([a, b]) => a % 10 !== 0 && b % 10 !== 0 && a !== b && (!ok || ok(a, b)));
  const near = (d, center, spread, pick) => d.until(() => pick(d), ([a, b]) => Math.abs(a * b - center) <= spread);
  const anyPair = (d) => (d.bool() ? pair3(d, (n) => n >= 1) : pair22(d));
  const plain2 = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  const ten = (n) => Math.round(n / 10) * 10;

  // ── 올림이 없는 (세 자리 수)×(한 자리 수) ───────────────────────
  B.addTypes('3-2-1', 'h3a', [
    T('h3a-zero', '십의 자리가 0인 수의 곱', '②1 ③7 심1', (d) => {
      // 203×3 = 609: 십의 자리 계산 0×3=0 도 자리를 지켜 쓴다.
      const [h, o, b] = d.until(() => [d.int(1, 4), d.int(1, 4), d.int(2, 4)], ([x, y, z]) => x * z <= 9 && y * z <= 9 && x !== y), a = h * 100 + o;
      return N('다음을 계산하시오.', a * b, {
        figure: column(chars(a), '*', [String(b)]), explain: `십의 자리 계산 0 × ${b} = 0이므로 곱의 십의 자리에 0을 쓴다. ${times(a, b)}`,
        facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], zeroMiddle: [a, b], rule: 'zeroTens' }
      });
    }),
    T('h3a-model-count', '수 모형의 수를 세어 곱 구하기', '①3 ②2 ③2', (d) => {
      // 231이 3묶음: 백 모형 6개, 십 모형 9개, 일 모형 3개 → 693
      const [a, b] = pair3(d, (n, x) => n === 0 && x < 400), [h, t, o] = D3(a);
      return M(`그림과 같은 수 모형이 ${b}묶음 있다. 백 모형, 십 모형, 일 모형은 각각 모두 몇 개인가? 또, 수 모형 전체가 나타내는 수는?`,
        [{ label: '백 모형', answer: h * b, unit: '개' }, { label: '십 모형', answer: t * b, unit: '개' }, { label: '일 모형', answer: o * b, unit: '개' }, { label: '나타내는 수', answer: a * b }], {
          figure: blocks(a), explain: `백 모형 ${h} × ${b} = ${h * b}(개), 십 모형 ${t} × ${b} = ${t * b}(개), 일 모형 ${o} × ${b} = ${o * b}(개)이므로 ${times(a, b)}이다.`,
          facts: { calc: [[E(h, '*', b), 0], [E(t, '*', b), 1], [E(o, '*', b), 2], [`(${h}*100+${t}*10+${o})*${b}`, 3]], unseen: [100, 10], mulAny: [a, b] }
        });
    }),
    T('h3a-model-pick', '수 모형을 보고 곱셈식 고르기', '①2 심2', (d) => {
      // 213이 2묶음 → 213×2 (자리를 바꾸어 읽은 123×2, 231×2, 312×2 는 아니다)
      const [a, b] = pair3(d, (n, x, y) => n === 0 && x < 300 && y <= 3 && new Set(String(x)).size === 3), [h, t, o] = D3(a);
      const others = d.shuffle([[h, o, t], [t, h, o], [t, o, h], [o, h, t], [o, t, h]].map((v) => Number(v.join('')))).slice(0, 3);
      const list = d.shuffle([a].concat(others));
      return C('수 모형을 보고 만든 곱셈식으로 알맞은 것은?', list.map((x) => `${x} × ${b}`), list.indexOf(a), {
        figure: lines(Array.from({ length: b }, () => blocks(a))),
        explain: `수 모형 한 묶음은 백 모형 ${h}개, 십 모형 ${t}개, 일 모형 ${o}개이므로 ${josa(a, '을/를')} 나타낸다. ${b}묶음이므로 ${times(a, b)}이다.`,
        facts: { choose: { exprs: list.map((x) => E(x, '*', b)), rule: 'equals', target: a * b }, mulAny: [a, b] }
      });
    })
  ]);

  // ── 올림이 한 번 있는 (세 자리 수)×(한 자리 수) ─────────────────
  // 십의 자리 계산에서만 올림이 일어나는 수(141×7)
  const tensUp = (d) => pair3(d, (n, x, y) => n === 1 && (x % 10) * y < 10 && (Math.floor(x / 10) % 10) * y >= 10);
  B.addTypes('3-2-1', 'h3b', [
    T('h3b-zero', '십의 자리가 0인 수의 곱(올림)', '②6 ③11 심8', (d) => {
      // 206×4 = 824: 일의 자리에서 올림한 2를 비어 있는 십의 자리에 쓴다.
      const [h, o, b] = d.until(() => [d.int(1, 4), d.int(3, 9), d.int(2, 9)], ([x, y, z]) => x * z <= 9 && y * z >= 10), a = h * 100 + o, up = Math.floor((o * b) / 10);
      return N('다음을 계산하시오.', a * b, {
        figure: column(chars(a), '*', [String(b)]),
        explain: `일의 자리 계산 ${times(o, b)}에서 ${up * 10}을 올림한다. 십의 자리 계산 0 × ${b} = 0에 올림한 수를 더하여 십의 자리에 ${josa(up, '을/를')} 쓴다. ${times(a, b)}`,
        facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], zeroMiddle: [a, b], carry3: [a, b], rule: 'zeroTensCarry' }
      });
    }),
    T('h3b-end0', '(몇백몇십)×(몇)', '③7 ③11', (d) => {
      // 260×3 = 780
      const [a, b] = d.until(() => [d.int(11, 98) * 10, d.int(2, 9)], ([x, y]) => x % 100 !== 0 && ups3(x, y) === 1);
      return N('다음을 계산하시오.', a * b, {
        figure: expr(a, '*', b, '=', box()), explain: `${times(a / 10, b)}이므로 ${times(a, b)}이다.`, facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], rule: 'zeroOnes' }
      });
    }),
    T('h3b-model', '수 모형으로 올림이 있는 곱 알아보기', '①2 ②2', (d) => {
      // 217이 2묶음: 일 모형 14개 → 십 모형 1개와 일 모형 4개 → 434
      const [a, b] = pair3(d, (n, x, y) => n === 1 && (x % 10) * y >= 10 && x < 300), [h, t, o] = D3(a), up = Math.floor((o * b) / 10);
      return M(`그림과 같은 수 모형이 ${b}묶음 있다. 일 모형은 모두 몇 개인가? 또, 수 모형 전체가 나타내는 수는?`, [{ label: '일 모형', answer: o * b, unit: '개' }, { label: '나타내는 수', answer: a * b }], {
        figure: blocks(a), explain: `일 모형은 ${o} × ${b} = ${o * b}(개)이다. 일 모형 ${up * 10}개는 십 모형 ${up}개와 같으므로 ${times(a, b)}이다.`,
        facts: { calc: [[E(o, '*', b), 0], [`(${h}*100+${t}*10+${o})*${b}`, 1]], unseen: [100, 10], mulAny: [a, b], carry3: [a, b] }
      });
    }),
    T('h3b-fill', '올림한 수와 곱 써넣기', '①5 ③9', (d) => {
      // 141×7: 십의 자리 계산 40×7=280 → 백의 자리 위에 2
      const [a, b] = tensUp(d), t = D3(a)[1], up = Math.floor((t * b) / 10);
      return M(`${a} × ${josa(b, '을/를')} 세로로 계산하려고 한다. 백의 자리 위에 작게 쓰는 올림한 수와 곱은?`, [{ label: '올림한 수', answer: up }, { label: '곱', answer: a * b }], {
        figure: column(chars(a), '*', [String(b)], undefined, [box(), '', '']),
        explain: `십의 자리 계산은 ${times(t * 10, b)}이다. ${up * 100}을 백의 자리로 올림하므로 백의 자리 위에 ${josa(up, '을/를')} 작게 쓴다. ${times(a, b)}`,
        facts: { calc: [[`(${t}*${b}-(${t}*${b})%10)/10`, 0], [E(a, '*', b), 1]], unseen: [10], mulAny: [a, b] }
      });
    }),
    T('h3b-carry100', '백의 자리 위에 쓴 수가 나타내는 값', '①11 ③10', (d) => {
      // 162×3=486 에서 백의 자리 위에 쓴 1 은 100
      const [a, b] = tensUp(d), t = D3(a)[1], up = Math.floor((t * b) / 10);
      return N(`${a} × ${josa(b, '을/를')} 계산한 세로셈이다. 백의 자리 위에 작게 쓴 ${josa(up, '이/가')} 실제로 나타내는 값은?`, up * 100, {
        figure: column(chars(a), '*', [String(b)], chars(a * b), [String(up), '', '']), explain: `십의 자리 계산 ${times(t * 10, b)}에서 ${up * 100}을 백의 자리로 올림한 것이다.`,
        facts: { calc: [[`(${t}*${b}-(${t}*${b})%10)/10*100`, 0]], unseen: [10, 100], mulAny: [a, b] }
      });
    })
  ]);

  // ── 올림이 여러 번 있는 (세 자리 수)×(한 자리 수) ───────────────
  B.addTypes('3-2-1', 'h3c', [
    T('h3c-steps', '자리별 곱을 세 줄로 적는 세로셈(올림)', '①4 ③4 ③14', (d) => {
      // 287×9 → 63, 720, 1800, 2583
      const [a, b] = pair3(d, MANY), [h1, t1, o] = D3(a), h = h1 * 100, t = t1 * 10;
      return M(`${a} × ${josa(b, '을/를')} 자리별로 곱하여 세로로 계산하려고 한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, [o * b, t * b, h * b, a * b].map((answer, i) => ({ label: LABELS[i], answer })), {
        figure: columnSteps(chars(a), '*', [String(b)], [box(LABELS[0]), box(LABELS[1]), box(LABELS[2])], box(LABELS[3]), [`← ${o} × ${b}`, `← ${t} × ${b}`, `← ${h} × ${b}`]),
        explain: `${times(o, b)}, ${times(t, b)}, ${times(h, b)}이고, 세 곱을 더하면 ${a * b}이다.`,
        facts: { calc: [[E(o, '*', b), 0], [E(t, '*', b), 1], [E(h, '*', b), 2], [E(a, '*', b), 3]], mulAny: [a, b] }
      });
    }),
    T('h3c-carry2', '올림한 두 수가 나타내는 값', '심15', (d) => {
      // 249×6=1494: 십의 자리 위의 5 는 50, 백의 자리 위의 2 는 200
      const firstUp = (x, y) => Math.floor(((x % 10) * y) / 10), secondUp = (x, y) => Math.floor(((Math.floor(x / 10) % 10) * y + firstUp(x, y)) / 10);
      const [a, b] = pair3(d, (n, x, y) => firstUp(x, y) >= 1 && secondUp(x, y) >= 1 && firstUp(x, y) !== secondUp(x, y)), [, t, o] = D3(a), up1 = firstUp(a, b), up2 = secondUp(a, b);
      const one = `(${o}*${b}-(${o}*${b})%10)`, sum = `(${t}*${b}+${one}/10)`;
      return M(`${a} × ${josa(b, '을/를')} 계산한 세로셈이다. 십의 자리 위와 백의 자리 위에 작게 쓴 수가 실제로 나타내는 값은 각각 얼마인가?`, [{ label: '십의 자리 위의 수', answer: up1 * 10 }, { label: '백의 자리 위의 수', answer: up2 * 100 }], {
        figure: column(chars(a), '*', [String(b)], chars(a * b), [String(up2), String(up1), '']),
        explain: `일의 자리 계산 ${times(o, b)}에서 ${up1 * 10}을 올림한다. 십의 자리 계산 ${times(t * 10, b)}에 ${up1 * 10}을 더한 ${t * 10 * b + up1 * 10}에서 ${up2 * 100}을 올림한다.`,
        facts: { calc: [[one, 0], [`(${sum}-${sum}%10)*10`, 1]], unseen: [10], mulAny: [a, b], carry3: [a, b] }
      });
    }),
    T('h3c-means', '두 숫자의 곱이 실제로 나타내는 값(세 자리 수)', '②13', (d) => {
      // 735×8 에서 7과 8의 곱 56 은 5600
      const [a, b] = pair3(d, (n, x, y) => n >= 2 && new Set(String(x) + y).size === 4), [h1, t1] = D3(a), tens = d.bool(), digit = tens ? t1 : h1, unit = tens ? 10 : 100, place = tens ? '십' : '백';
      return N(`${a} × ${b}에서 ${a}의 ${place}의 자리 숫자 ${josa(digit, '과/와')} ${b}의 곱이 실제로 나타내는 값은?`, digit * b * unit, {
        explain: `${a}의 ${place}의 자리 숫자 ${josa(digit, '은/는')} ${josa(digit * unit, '을/를')} 나타낸다. ${times(digit * unit, b)}`,
        facts: { calc: [[`${digit}*${b}*${unit}`, 0]], unseen: [unit], mulAny: [a, b] }
      });
    }),
    T('h3c-fix-rows', '자리별 곱의 자리를 잘못 맞춘 세로셈 바로잡기', '①15 ②14 덧', (d) => {
      // 467×5 를 35, 30, 20 으로 적어 85 → 2335
      const [a, b] = pair3(d, MANY), [h1, t1, o] = D3(a), wrong = o * b + t1 * b + h1 * b;
      return N(`다음은 ${a} × ${josa(b, '을/를')} 잘못 계산한 것이다. 바르게 계산한 값은?`, a * b, {
        figure: columnSteps(chars(a), '*', [String(b)], [chars(o * b), chars(t1 * b), chars(h1 * b)], chars(wrong)),
        explain: `십의 자리 계산은 ${times(t1 * 10, b)}, 백의 자리 계산은 ${times(h1 * 100, b)}이므로 자리에 맞추어 써야 한다. 바르게 계산하면 ${times(a, b)}이다.`,
        facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], wrongProduct: wrong }
      });
    }),
    T('h3c-digit', '세로셈의 □ 안에 알맞은 수', '①12 ②54 ③13 심17', (d) => {
      // 4□3×5=2415 → 8
      const [a, b] = pair3(d, (n, x, y) => n >= 2 && (x % 10) * y >= 10), [h1, t1, o] = D3(a), up = Math.floor((o * b) / 10);
      return N('세로셈의 □ 안에 알맞은 수는?', t1, {
        figure: column([String(h1), box(), String(o)], '*', [String(b)], chars(a * b)),
        explain: `일의 자리 계산은 ${times(o, b)}이고 ${up * 10}을 올림한다. 십의 자리 계산 □ × ${b}에 올림한 수 ${josa(up, '을/를')} 더한 수의 일의 자리 숫자가 ${Math.floor((a * b) / 10) % 10}이어야 한다. □에 ${josa(t1, '을/를')} 넣어 계산하면 ${times(a, b)}이다.`,
        facts: { mulMasks: { a: `${h1}?${o}`, b: String(b), p: String(a * b) }, mulAny: [a, b] }
      });
    }),
    T('h3c-ends', '자리 수가 다른 수 가운데 가장 큰 수와 가장 작은 수의 곱', '①47 ②48 심37', (d) => {
      // 9, 457, 15, 8, 358 → 457×8
      const [big, small] = pair3(d, (n, x, y) => n >= 2 && x >= 300 && y <= 8);
      const list = d.shuffle([big, small, d.int(101, big - 20), plain2(d, 12, 89), d.int(small + 1, 9)]);
      return N('가장 큰 수와 가장 작은 수의 곱은?', big * small, {
        figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${times(big, small)}`, facts: { calc: [[E(big, '*', small), 0]], mulAny: [big, small] }
      });
    }),
    T('h3c-place', '10이 몇십몇 개인 수의 몇 배', '②49 심4', (d) => {
      // 10이 43개, 1이 7개인 수는 437
      const [tens, o, b] = d.until(() => [d.int(12, 48), d.int(2, 9), d.int(3, 9)], ([x, y, z]) => x % 10 !== 0 && ups3(x * 10 + y, z) >= 1), a = tens * 10 + o;
      return N(`10이 ${tens}개, 1이 ${o}개인 수의 ${b}배는?`, a * b, {
        explain: `10이 ${tens}개이면 ${tens * 10}이므로 10이 ${tens}개, 1이 ${o}개인 수는 ${a}이다. ${times(a, b)}`, facts: { calc: [[`(${tens}*10+${o})*${b}`, 0]], mulAny: [a, b] }
      });
    })
  ]);

  // ── (몇십)×(몇십), (몇십몇)×(몇십) ─────────────────────────────
  B.addTypes('3-2-1', 'tens', [
    T('tens-rows', '줄지어 놓은 그림을 보고 10을 곱하기', '①24', (d) => {
      // 한 줄에 23씩 10줄 → 23×10=230
      const a = d.until(() => d.int(12, 45), (v) => v % 10 >= 1 && v % 10 <= 5);
      return M('10과 1을 나타내는 동그라미를 줄지어 놓았다. 그림 전체가 나타내는 수를 구하는 곱셈식에서 ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 10 }, { label: LABELS[1], answer: a * 10 }], {
        figure: counters(a, 10) + expr(a, '*', box(LABELS[0]), '=', box(LABELS[1])), explain: `한 줄에 ${a}씩 10줄이다. ${times(a, 10)}`,
        facts: { calc: [['10', 0], [E(a, '*', 10), 1]], mulAny: [a, 10] }
      });
    }),
    T('tens-hundredfold', '(몇)×(몇)과 (몇십)×(몇십)의 관계', '①19 ②17', (d) => {
      // 4×2=8 → 40×20=800 (100배)
      const [x, y] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p !== q);
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [x * y, x * y * 100, 100].map((answer, i) => ({ label: LABELS[i], answer })), {
        figure: lines([expr(x, '*', y, '=', box(LABELS[0])), expr(x * 10, '*', y * 10, '=', box(LABELS[1])), `${x * 10} × ${y * 10}의 값은 ${x} × ${y}의 값의 ${box(LABELS[2])}배이다.`]),
        explain: `${josa(x * 10, '은/는')} ${x}의 10배이고 ${josa(y * 10, '은/는')} ${y}의 10배이므로 ${x * 10} × ${y * 10}의 값은 ${x} × ${y}의 값의 100배이다. ${times(x, y)}, ${times(x * 10, y * 10)}`,
        facts: { calc: [[E(x, '*', y), 0], [E(x * 10, '*', y * 10), 1], [`${x * 10}*${y * 10}/(${x}*${y})`, 2]] }
      });
    }),
    T('tens-twoways', '두 가지 차례로 계산하기', '①20 ②18 심20', (d) => {
      // 23×40 = 23×4×10 = 92×10 / 23×10×4 = 230×4
      const a = plain2(d, 12, 48), k = d.int(2, 9), b = k * 10;
      return M(`${a} × ${josa(b, '을/를')} 두 가지 방법으로 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [a * k, a * 10, a * b].map((answer, i) => ({ label: LABELS[i], answer })), {
        figure: lines([`방법 1: ${a} × ${k}의 값 ${box(LABELS[0])}에 10을 곱한다.`, `방법 2: ${a} × 10의 값 ${box(LABELS[1])}에 ${josa(k, '을/를')} 곱한다.`, `두 방법 모두 ${a} × ${b} = ${box(LABELS[2])}이다.`]),
        explain: `${times(a, k)}의 10배는 ${a * b}이고, ${times(a, 10)}의 ${k}배도 ${a * b}이다.`,
        facts: { calc: [[E(a, '*', k), 0], [E(a, '*', 10), 1], [E(a, '*', b), 2]], mulAny: [a, b] }
      });
    }),
    T('tens-front', '곱의 0 앞에 오는 수', '①21 ②19', (d) => {
      // 80×50=□00 → 40
      const x = d.int(2, 9), y = d.int(2, 9);
      return N('□ 안에 알맞은 수는?', x * y, {
        figure: expr(x * 10, '*', y * 10, '=', box() + '00'), explain: `${times(x, y)}이므로 ${times(x * 10, y * 10)}이다. □ 안에 알맞은 수는 ${x * y}이다.`,
        facts: { calc: [[`${x * 10}*${y * 10}/100`, 0]], unseen: [100] }
      });
    }),
    T('tens-zero-odd', '곱에 써넣을 0의 개수', '①21 덧', (d) => {
      // ㉠ 60×60=36□ ㉡ 50×40=2□ ㉢ 20×70=14□ → ㉡만 0을 3개 쓴다. (몇십)×(몇십)이면 0은 언제나 2개라고 여기는 아이는 가리지 못한다.
      const five = d.pick([[5, 2], [5, 4], [5, 6], [5, 8], [2, 5], [4, 5], [6, 5], [8, 5]]);
      const other = () => d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => (p * q) % 10 !== 0);
      const rows = d.until(() => d.shuffle([five, other(), other()]), (list) => new Set(list.map(([p, q]) => p * 10 + q)).size === 3);
      const lead = ([p, q]) => ((p * q) % 10 === 0 ? (p * q) / 10 : p * q), zeros = ([p, q]) => ((p * q) % 10 === 0 ? 3 : 2);
      return C('□ 안에 0을 알맞게 써넣으려고 한다. 써넣을 0의 개수가 나머지 둘과 다른 것은?', LABELS.slice(0, 3), rows.indexOf(five), {
        figure: tagged(rows.map((r) => expr(r[0] * 10, '*', r[1] * 10, '=', lead(r) + box()))),
        explain: rows.map((r, i) => `${LABELS[i]} ${times(r[0] * 10, r[1] * 10)}`).join(', ') + `이다. □ 안에 써넣을 0은 차례로 ${rows.map(zeros).join('개, ')}개이다.`,
        facts: { choose: { exprs: rows.map((r) => `${r[0] * 10}*${r[1] * 10}/${lead(r)}`), rule: 'odd' } }
      });
    }),
    T('tens-place', '곱의 숫자를 쓸 자리', '①22 ②20 심20', (d) => {
      // 48×90: 48×9=432 의 2 는 십의 자리(㉢)에 쓴다. 0을 붙이지 않는 아이는 한 칸 오른쪽을 고른다.
      const [a, k] = d.until(() => [d.int(12, 98), d.int(2, 9)], ([x, y]) => x % 10 !== 0 && x * y >= 100 && new Set(String(x * y)).size === 3 && !String(x * y).includes('0'));
      const p = a * k, at = d.int(0, 2), digit = Number(String(p)[at]);
      return C(`${a} × ${josa(k * 10, '을/를')} 세로로 계산하려고 한다. ${a} × ${k} = ${p}의 ${josa(digit, '을/를')} 써야 할 자리는?`, LABELS.slice(), at, {
        figure: column(chars(a), '*', chars(k * 10), LABELS.map((label) => box(label))),
        explain: `${a} × ${josa(k * 10, '은/는')} ${a} × ${k}의 10배이다. ${p}의 10배는 ${p * 10}이므로 ${josa(digit, '은/는')} ${['천', '백', '십'][at]}의 자리인 ${LABELS[at]}에 쓴다.`,
        facts: { pick: { expr: `${10 ** (2 - at)}*10`, options: [1000, 100, 10, 1] }, unseen: [1, 10, 100, 1000], mulAny: [a, k * 10] }
      });
    }),
    T('tens-fix', '0을 빠뜨린 세로셈 바로잡기', '②21 ③26', (d) => {
      // 24×50 을 120 으로 계산 → 1200
      const a = plain2(d, 12, 89), k = d.int(2, 9), b = k * 10;
      return N(`다음은 ${a} × ${josa(b, '을/를')} 잘못 계산한 것이다. 바르게 계산한 값은?`, a * b, {
        figure: column(chars(a), '*', chars(b), chars(a * k)), explain: `${a} × ${josa(b, '은/는')} ${a} × ${k}의 10배이므로 일의 자리에 0을 써야 한다. ${times(a, k)}이므로 ${times(a, b)}이다.`,
        facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], wrongProduct: a * k }
      });
    }),
    T('tens-digit', '(몇십)×(□0)에서 □ 구하기', '②22 ③24 덧', (d) => {
      // 80×□0=3200 → 4
      const [x, y] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p !== q);
      return N('1부터 9까지의 수 중 □ 안에 알맞은 수는?', y, {
        figure: expr(x * 10, '*', box() + '0', '=', x * y * 100), explain: `${times(x, y)}이므로 ${times(x * 10, y * 10)}이다. □ 안에 알맞은 수는 ${y}이다.`,
        facts: { mulMasks: { a: String(x * 10), b: '?0', p: String(x * y * 100) } }
      });
    }),
    T('tens-table', '곱셈표 채우기', '①18 ②52 심42', (d) => {
      // 36, 80 에 60, 70 을 곱한다
      const a1 = plain2(d, 12, 89), a2 = d.int(2, 9) * 10, [b1, b2] = d.until(() => [d.int(2, 9) * 10, d.int(2, 9) * 10], ([p, q]) => p !== q && p !== a2 && q !== a2);
      const cells = [[a1, b1], [a1, b2], [a2, b1], [a2, b2]];
      return M('표의 빈칸에 왼쪽의 수와 위쪽의 수의 곱을 써넣으려고 한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', cells.map(([x, y], i) => ({ label: LABELS[i], answer: x * y })), {
        figure: table(['×', b1, b2], [[a1, box(LABELS[0]), box(LABELS[1])], [a2, box(LABELS[2]), box(LABELS[3])]]), explain: cells.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
        facts: { calc: cells.map(([x, y], i) => [E(x, '*', y), i]) }
      });
    }),
    T('tens-enough', '곱이 넉넉한지 판단하기', '②25 ③64', (d) => {
      // 12개씩 40상자(480개)를 500명에게 → 모두에게 줄 수는 없다
      const [a, b] = d.until(() => [plain2(d, 12, 48), d.int(2, 6) * 10], ([x, y]) => x * y >= 300 && Math.abs(x * y - Math.round((x * y) / 100) * 100) >= 20);
      const have = a * b, people = Math.round(have / 100) * 100, can = people <= have;
      const say = (value, ok) => `도넛은 ${value}개이므로 모두에게 줄 수 ${ok ? '있다' : '없다'}.`;
      // 곱을 바르게 구하고 거꾸로 판단하는 아이, 0을 빠뜨리는 아이, 0을 하나 더 쓰는 아이
      const list = d.shuffle([[have, true], [have, false], [have / 10, false], [have * 10, true]]);
      return C(`도넛이 한 상자에 ${a}개씩 ${b}상자 있다. 이 도넛을 ${people}명에게 한 개씩 주려고 한다. 옳은 것은?`, list.map(([value, ok]) => say(value, ok)), list.findIndex(([value, ok]) => value === have && ok === can), {
        explain: `도넛은 ${times(a, b)}(개)이다. ${josa(have, '은/는')} ${people}보다 ${can ? '크므로 모두에게 줄 수 있다' : '작으므로 모두에게 줄 수는 없다'}.`,
        facts: { judge: { need: String(people), have: `${a}*${b}`, shown: have, options: list }, mulAny: [a, b] }
      });
    }, { standard: SOLVE }),
    T('tens-hour', '문장제: 1시간 동안', '①25 ③58', (d) => {
      // 1분에 65 m씩 1시간 → 65×60
      const a = plain2(d, 42, 86), who = d.pick(NAMES);
      return N(`${name(who, '은/는')} 1분에 ${a} m씩 걷는다. 같은 빠르기로 1시간 동안 걷는 거리는 몇 m인가?`, a * 60, {
        unit: 'm', explain: `1시간은 60분이다. ${times(a, 60)}`, facts: { calc: [[E(a, '*', 60), 0]], unseen: [60] }
      });
    }, { standard: SOLVE }),
    T('tens-cards0', '0이 있는 수 카드로 만든 두 수의 곱', '②64', (d) => {
      // 0, 2, 5, 7 → 75×20
      const list = d.shuffle([0].concat(d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3))), s = list.filter((v) => v !== 0).sort((x, y) => x - y), big = s[2] * 10 + s[1], small = s[0] * 10;
      return N('수 카드 4장 중에서 2장을 골라 만들 수 있는 가장 큰 두 자리 수와 가장 작은 두 자리 수의 곱은?', big * small, {
        figure: cards(list), explain: `가장 큰 두 자리 수는 ${big}이다. 0은 십의 자리에 올 수 없으므로 가장 작은 두 자리 수는 ${small}이다. ${times(big, small)}`, facts: { twoCards: list }
      });
    })
  ]);

  // ── (몇)×(몇십몇) ──────────────────────────────────────────────
  B.addTypes('3-2-1', 'one2', [
    T('one2-fix', '자리를 잘못 맞춘 세로셈 바로잡기', '①37 ②35 ③39 심28', (d) => {
      // 7×36 을 42+21=63 으로 계산 → 252
      const a = d.int(3, 9), b = d.until(() => d.int(23, 89), (v) => v % 10 >= 2), ones = b % 10, tensDigit = Math.floor(b / 10), wrong = a * ones + a * tensDigit;
      return N(`다음은 ${a} × ${josa(b, '을/를')} 잘못 계산한 것이다. 바르게 계산한 값은?`, a * b, {
        figure: columnSteps([String(a)], '*', chars(b), [chars(a * ones), chars(a * tensDigit)], chars(wrong)),
        explain: `${a} × ${tensDigit}의 값 ${josa(a * tensDigit, '은/는')} 실제로 ${times(a, tensDigit * 10)}이므로 한 자리 왼쪽에 적어야 한다. 바르게 계산하면 ${times(a, b)}이다.`,
        facts: { calc: [[E(a, '*', b), 0]], mulAny: [a, b], wrongProduct: wrong }
      });
    }),
    T('one2-digit', '곱셈식의 □ 안에 알맞은 수', '②55 심29 덧', (d) => {
      // 6×□5=390 → 6
      const a = d.int(3, 9), b = d.until(() => d.int(23, 98), (v) => v % 10 >= 2), ones = b % 10, t = Math.floor(b / 10);
      return N('곱셈식의 □ 안에 알맞은 수는?', t, {
        figure: expr(a, '*', box() + String(ones), '=', a * b),
        explain: `${times(a, ones)}이므로 ${a} × □0의 값은 ${expr(a * b, '-', a * ones, '=', a * b - a * ones)}이다. ${times(a, t * 10)}이므로 □ 안에 알맞은 수는 ${t}이다.`,
        facts: { mulMasks: { a: String(a), b: `?${ones}`, p: String(a * b) }, mulAny: [a, b] }
      });
    }),
    T('one2-near', '어떤 수에 가장 가까운 곱', '①46 심30', (d) => {
      // 200에 가장 가까운 것: 8×22=176, 4×46=184, 5×35=175
      const target = d.pick([200, 300, 400]);
      const one = () => d.until(() => [d.int(3, 9), plain2(d, 12, 89)], ([x, y]) => Math.abs(x * y - target) <= 36 && x * y !== target);
      const rows = d.until(() => [one(), one(), one()], (list) => {
        const values = list.map(([x, y]) => x * y);
        return new Set(values.map((v) => Math.abs(v - target))).size === 3 && new Set(list.map(([x]) => x)).size === 3 && values.some((v) => v > target) && values.some((v) => v < target);
      });
      const gaps = rows.map(([x, y]) => Math.abs(x * y - target));
      return C(`곱이 ${target}에 가장 가까운 것은?`, rows.map(([x, y]) => expr(x, '*', y)), gaps.indexOf(Math.min(...gaps)), {
        explain: rows.map(([x, y]) => times(x, y)).join(', ') + `이고, ${josa(target, '과/와')}의 차는 차례로 ${gaps.join(', ')}이다.`,
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'nearest', target } }
      });
    }),
    T('one2-equal', '곱이 같은 곱셈식 찾기', '①23 ②45 ③51 심46', (d) => {
      // 6×16 과 곱이 같은 것: 8×12 (5×19, 7×14, 9×11 은 가깝지만 다르다)
      const made = d.until(() => {
        const x = d.int(2, 9), y = plain2(d, 12, 48), product = x * y, same = [], close = [];
        for (let c = 2; c <= 9; c += 1) {
          const w = Math.round(product / c);
          if (c === x || w === y || w < 11 || w > 99 || w % 10 === 0) continue;
          (c * w === product ? same : close).push([c, w]);
        }
        return { x, y, product, same, close };
      }, (m) => m.same.length >= 1 && m.close.length >= 3);
      const right = d.pick(made.same), list = d.shuffle([right].concat(d.shuffle(made.close).slice(0, 3)));
      return C(`${made.x} × ${josa(made.y, '과/와')} 곱이 같은 곱셈식은?`, list.map(([p, q]) => expr(p, '*', q)), list.indexOf(right), {
        explain: `${times(made.x, made.y)}이다. ` + list.map(([p, q]) => times(p, q)).join(', '),
        facts: { choose: { exprs: list.map(([p, q]) => E(p, '*', q)), rule: 'equals', target: made.product }, mulAny: [made.x, made.y] }
      });
    }),
    T('one2-most', '표를 보고 수가 가장 많은 것 찾기', '①56 ②73 ③59 심60 덧', (d) => {
      // 멜론 4개씩 56상자, 사과 8개씩 38상자, 배 6개씩 45상자 → 사과. 한 상자에 든 수나 상자 수만 보고는 고를 수 없게 한다.
      const fruits = d.shuffle(['멜론', '사과', '배', '복숭아', '참외']).slice(0, 3);
      const rows = d.until(() => [0, 1, 2].map(() => [d.int(4, 9), plain2(d, 23, 68)]), (list) => {
        const values = list.map(([x, y]) => x * y), top = values.indexOf(Math.max(...values));
        return new Set(values).size === 3 && new Set(list.map(([x]) => x)).size === 3 && Math.max(...values) - Math.min(...values) <= 90
          && list[top][0] !== Math.max(...list.map(([x]) => x)) && list[top][1] !== Math.max(...list.map(([, y]) => y));
      });
      const values = rows.map(([x, y]) => x * y);
      return C('과일 가게에 있는 과일을 나타낸 표이다. 수가 가장 많은 과일은?', fruits, values.indexOf(Math.max(...values)), {
        figure: table(['과일', '한 상자에 든 수', '상자 수'], rows.map(([x, y], i) => [fruits[i], `${x}개`, `${y}상자`])),
        explain: rows.map(([x, y], i) => `${fruits[i]} ${times(x, y)}(개)`).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'max' } }
      });
    }, { standard: SOLVE })
  ]);

  // ── (몇십몇)×(몇십몇) ──────────────────────────────────────────
  B.addTypes('3-2-1', 'two2', [
    T('two2-grid', '모눈을 둘로 나누어 곱하기', '①33 ②28 ③33', (d) => {
      // 16×13: 16×10 과 16×3
      const a = d.int(12, 19), b = d.until(() => d.int(12, 19), (v) => v !== a), ones = b - 10;
      return M(`모눈을 색깔별로 나누어 세어 ${a} × ${josa(b, '을/를')} 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [a * 10, a * ones, a * b].map((answer, i) => ({ label: LABELS[i], answer })), {
        figure: splitGrid(a, 10, ones) + lines([expr(a, '*', 10, '=', box(LABELS[0])), expr(a, '*', ones, '=', box(LABELS[1])), expr(a, '*', b, '=', box(LABELS[2]))]),
        explain: `${times(a, 10)}, ${times(a, ones)}이고, 두 곱을 더하면 ${a * b}이다.`, facts: { calc: [[E(a, '*', 10), 0], [E(a, '*', ones), 1], [E(a, '*', b), 2]], mulAny: [a, b] }
      });
    }),
    T('two2-grid4', '모눈을 넷으로 나누어 곱하기', '③34', (d) => {
      // 13×12: 10×10, 10×2, 3×10, 3×2
      const [p, q] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x !== y), r = 10 + p, c = 10 + q, parts = [];
      // 칸 수를 적을 자리를 내려고 모눈을 오른쪽 아래로 한 칸 밀어 그린다.
      for (let y = 0; y < r; y += 1) for (let x = 0; x < c; x += 1) parts.push(geo.polygon([[x + 1, y + 1], [x + 2, y + 1], [x + 2, y + 2], [x + 1, y + 2]], (x < 10) === (y < 10) ? 'mb-tape-a' : 'mb-tape-b'));
      parts.push(geo.text([6, 0.45], '10'), geo.text([11 + q / 2, 0.45], String(q)), geo.text([0.4, 6], '10'), geo.text([0.4, 11 + p / 2], String(p)));
      const grid = geo.board(c + 1, r + 1, parts, { label: `모눈: 세로 ${r}칸, 가로 ${c}칸. 세로를 10칸과 ${p}칸으로, 가로를 10칸과 ${q}칸으로 나누어 네 부분을 다른 빛깔로 칠했다` });
      return M(`모눈을 네 부분으로 나누어 세어 ${r} × ${josa(c, '을/를')} 계산하려고 한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, [10 * q, p * 10, p * q, r * c].map((answer, i) => ({ label: LABELS[i], answer })), {
        figure: grid + lines([expr(10, '*', 10, '=', 100), expr(10, '*', q, '=', box(LABELS[0])), expr(p, '*', 10, '=', box(LABELS[1])), expr(p, '*', q, '=', box(LABELS[2])), expr(r, '*', c, '=', box(LABELS[3]))]),
        explain: `네 부분의 모눈의 수는 100, ${10 * q}, ${p * 10}, ${p * q}이다. 모두 더하면 ${r * c}이다.`,
        facts: { calc: [[E(10, '*', q), 0], [E(p, '*', 10), 1], [E(p, '*', q), 2], [E(r, '*', c), 3]], mulAny: [r, c] }
      });
    }),
    T('two2-rows', '세로셈의 두 줄이 나타내는 곱', '①35 심34', (d) => {
      // 32×12: 64 ← 32×2, 320 ← 32×10
      const [a, b] = pair22(d, (x, y) => y % 10 >= 2 && y % 10 !== Math.floor(y / 10)), ones = b % 10, tens = b - ones;
      return M(`${a} × ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: ones }, { label: LABELS[1], answer: tens }], {
        figure: columnSteps(chars(a), '*', chars(b), [chars(a * ones), chars(a * tens)], chars(a * b), [`← ${a} × ${LABELS[0]}`, `← ${a} × ${LABELS[1]}`]),
        explain: `${b}의 일의 자리 숫자 ${josa(ones, '은/는')} ${ones}, 십의 자리 숫자 ${josa(tens / 10, '은/는')} ${josa(tens, '을/를')} 나타낸다. 첫째 줄은 ${times(a, ones)}, 둘째 줄은 ${times(a, tens)}이다.`,
        facts: { calc: [[`${b}%10`, 0], [`${b}-${b}%10`, 1]], unseen: [10], mulAny: [a, b] }
      });
    }),
    T('two2-place', '자릿값으로 말한 두 수의 곱', '②49 ③42 심40', (d) => {
      // 10이 6개, 1이 3개인 수와 10이 2개, 1이 8개인 수의 곱 → 63×28
      const digits = (v) => [Math.floor(v / 10), v % 10];
      const [x, y] = pair22(d, (p, q) => { const all = digits(p).concat(digits(q)); return new Set(all).size === 4 && all.every((v) => v >= 2); }), [t1, o1] = digits(x), [t2, o2] = digits(y);
      return N(`10이 ${t1}개, 1이 ${o1}개인 수와 10이 ${t2}개, 1이 ${o2}개인 수의 곱은?`, x * y, {
        explain: `두 수는 ${x}, ${y}이다. ${times(x, y)}`, facts: { calc: [[`(${t1}*10+${o1})*(${t2}*10+${o2})`, 0]], mulAny: [x, y] }
      });
    }),
    T('two2-max', '곱이 가장 큰(작은) 것 찾기', '①42 ②42 ③47 심44', (d) => {
      // 27×45, 34×35, 24×49 처럼 곱이 서로 가까운 식. 가장 큰 수가 든 식이 답이 되지 않게 한다.
      const big = d.bool(), best = (values) => (big ? Math.max(...values) : Math.min(...values)), base = d.int(900, 2600);
      const rows = d.until(() => [0, 1, 2, 3].map(() => near(d, base, 110, (dd) => pair22(dd))), (list) => {
        const values = list.map(([x, y]) => x * y), top = list[values.indexOf(best(values))], all = list.reduce((s, v) => s.concat(v), []);
        return new Set(values).size === 4 && new Set(list.map(([x, y]) => Math.min(x, y) * 100 + Math.max(x, y))).size === 4 && !top.includes(best(all));
      });
      const values = rows.map(([x, y]) => x * y);
      return C(`곱이 가장 ${big ? '큰' : '작은'} 것은?`, rows.map(([x, y]) => expr(x, '*', y)), values.indexOf(best(values)), {
        explain: rows.map(([x, y]) => times(x, y)).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: big ? 'max' : 'min' } }
      });
    }),
    T('two2-est-closer', '여러 가지로 어림한 값과 실제 값', '②36', (d) => {
      // 29×13: 30×13=390, 29×10=290, 30×10=300 가운데 실제 값 377에 가장 가까운 것
      const gapsOf = (x, y) => [ten(x) * y, x * ten(y), ten(x) * ten(y)].map((v) => Math.abs(v - x * y));
      const [a, b] = pair22(d, (x, y) => { const g = gapsOf(x, y); return [x, y].every((v) => v % 10 !== 5 && v <= 59) && new Set(g).size === 3 && Math.min(...g) >= 1; }), ra = ten(a), rb = ten(b);
      const list = d.shuffle([
        { text: `${josa(a, '을/를')} ${josa(ra, '으로/로')} 바꾸어 ${ra} × ${b} = ${ra * b}`, value: ra * b },
        { text: `${josa(b, '을/를')} ${josa(rb, '으로/로')} 바꾸어 ${a} × ${rb} = ${a * rb}`, value: a * rb },
        { text: `두 수를 ${ra}, ${josa(rb, '으로/로')} 바꾸어 ${ra} × ${rb} = ${ra * rb}`, value: ra * rb }
      ]);
      const gaps = list.map((row) => Math.abs(row.value - a * b));
      return C(`${a} × ${josa(b, '을/를')} 세 가지 방법으로 어림하였다. 실제 계산 결과에 가장 가까운 것은?`, list.map((row) => row.text), gaps.indexOf(Math.min(...gaps)), {
        explain: `실제 계산 결과는 ${times(a, b)}이다. 어림한 값과 실제 계산 결과의 차는 차례로 ${gaps.join(', ')}이다.`,
        facts: { closer: { expr: E(a, '*', b), estimates: list.map((row) => row.value) }, mulAny: [a, b] }
      });
    }, { standard: SOLVE })
  ]);

  // ── 여러 가지 곱셈 ─────────────────────────────────────────────
  B.addTypes('3-2-1', 'mix', [
    T('mix-compare-num', '곱과 수의 크기 비교', '①41 ②41 ③46', (d) => {
      // 521×8 ○ 4200
      const [a, b] = anyPair(d), p = a * b, about = Math.round(p / 100) * 100;
      const n = d.int(0, 3) === 0 ? p : about !== p ? about : p + 50, flip = d.bool();
      const left = flip ? n : p, right = flip ? p : n, prod = expr(a, '*', b), num = `<span class="mb-expr">${n}</span>`;
      return C('곱과 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, left > right ? 0 : left === right ? 1 : 2, {
        figure: versus(flip ? num : prod, flip ? prod : num), explain: times(a, b) + (n === p ? '이므로 두 수는 같다.' : `이고, ${josa(p, '은/는')} ${n}보다 ${p > n ? '크다' : '작다'}.`),
        facts: { choose: { exprs: flip ? [String(n), E(a, '*', b)] : [E(a, '*', b), String(n)], rule: 'compare' } }
      });
    }),
    T('mix-words', '말로 나타낸 곱의 크기 비교', '①42 ②42 ③47 덧', (d) => {
      // ㉠ 37과 23의 곱 ㉡ 116의 7배인 수 ㉢ 224를 4번 더한 수
      const big = d.bool();
      const made = d.until(() => {
        const base = d.int(600, 2400);
        return [near(d, base, 160, (dd) => pair22(dd)), near(d, base, 160, (dd) => pair3(dd, (n) => n >= 1)), near(d, base, 160, (dd) => pair3(dd, (n, x, y) => n >= 1 && y <= 5))];
      }, (rows) => new Set(rows.map(([x, y]) => x * y)).size === 3);
      const say = [(x, y) => `${josa(x, '과/와')} ${y}의 곱`, (x, y) => `${x}의 ${y}배인 수`, (x, y) => `${josa(x, '을/를')} ${y}번 더한 수`];
      const rows = d.shuffle([0, 1, 2]).map((i) => ({ text: say[i](made[i][0], made[i][1]), pair: made[i] })), values = rows.map((row) => row.pair[0] * row.pair[1]);
      return C(`나타내는 수가 가장 ${big ? '큰' : '작은'} 것은?`, LABELS.slice(0, 3), values.indexOf(big ? Math.max(...values) : Math.min(...values)), {
        figure: tagged(rows.map((row) => row.text)), explain: rows.map((row, i) => `${LABELS[i]} ${times(row.pair[0], row.pair[1])}`).join(', '),
        facts: { choose: { exprs: rows.map((row) => E(row.pair[0], '*', row.pair[1])), rule: big ? 'max' : 'min' } }
      });
    }),
    T('mix-match', '식과 곱 짝 짓기', '②46 ③50 심11', (d) => {
      const base = d.int(800, 2600);
      const pairs = d.until(() => [near(d, base, 130, (dd) => pair3(dd, (n) => n >= 1)), near(d, base, 130, (dd) => pair22(dd)), near(d, base, 130, (dd) => [plain2(dd, 12, 89), dd.int(2, 9) * 10])], (list) => new Set(list.map(([x, y]) => x * y)).size === 3);
      const values = pairs.map(([x, y]) => x * y);
      const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(pairs.map(([x, y]) => expr(x, '*', y))), explain: pairs.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
        facts: { match: { exprs: pairs.map(([x, y]) => E(x, '*', y)), options: list.map((o) => o.map((k) => values[k])) } }
      });
    }),
    T('mix-wrong-fix', '잘못 계산한 사람의 식을 바르게 계산하기', '①16 ②8 ②47 ③18', (d) => {
      // 소희 392×4=1568, 은지 504×6=3240 → 은지, 3024
      const who = d.shuffle(NAMES).slice(0, 2), rows = d.shuffle([pair3(d, MANY), pair22(d)]), bad = d.int(0, 1), slip = d.pick([-100, -10, 10, 100]);
      const said = rows.map(([x, y], i) => x * y + (i === bad ? slip : 0)), [x, y] = rows[bad];
      return N('두 사람이 곱셈을 하였다. 잘못 계산한 사람의 식을 바르게 계산한 값은?', x * y, {
        figure: lines(rows.map(([p, q], i) => `${who[i]}: ${expr(p, '*', q, '=', said[i])}`)),
        explain: rows.map(([p, q]) => times(p, q)).join(', ') + `이므로 ${name(who[bad], '이/가')} 잘못 계산하였다. 바르게 계산한 값은 ${x * y}이다.`,
        facts: { calc: [[E(x, '*', y), 0]], mulAny: [x, y], wrongProduct: said[bad] }
      });
    }),
    T('mix-cards-min', '수 카드로 만든 가장 작은 세 자리 수의 곱', '②60 심55', (d) => {
      // 0, 4, 7 → 407×3
      const [x, y] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2).sort((p, q) => p - q), by = d.int(3, 9), small = x * 100 + y;
      return N(`수 카드 3장을 한 번씩 모두 사용하여 만들 수 있는 가장 작은 세 자리 수와 ${by}의 곱은?`, small * by, {
        figure: cards(d.shuffle([0, x, y])), explain: `0은 백의 자리에 올 수 없으므로 가장 작은 세 자리 수는 ${small}이다. ${times(small, by)}`,
        facts: { calc: [[E(small, '*', by), 0]], unseen: [small], mulAny: [small, by], zeroMiddle: [small, by] }
      });
    }),
    T('mix-shapes', '도형 안에 있는 수의 곱', '②66 심42', (d) => {
      const [target, one, two] = d.shuffle([['circle', '원'], ['triangle', '삼각형'], ['square', '사각형']]);
      const [x, y] = pair22(d, (p, q) => p <= 58 && q <= 58), others = d.until(() => [plain2(d, 12, 89), plain2(d, 12, 89)], (v) => new Set(v.concat([x, y])).size === 4);
      return N(`${target[1]} 안에 있는 두 수의 곱은?`, x * y, {
        figure: shapes(d.shuffle([[target[0], x], [target[0], y], [one[0], others[0]], [two[0], others[1]]])), explain: `${target[1]} 안에 있는 수는 ${x}, ${y}이다. ${times(x, y)}`,
        facts: { calc: [[E(x, '*', y), 0]], unseen: [x, y], mulAny: [x, y] }
      });
    }),
    T('mix-round', '문장제: 갔다가 돌아온 거리', '①54 ②67 ③56', (d) => {
      const a = d.until(() => d.int(215, 489), (v) => v % 10 !== 0 && ups3(v, 2) >= 1);
      return N(`집에서 도서관까지의 거리는 ${a} m이다. 집에서 도서관까지 걸어서 갔다가 같은 길로 걸어서 돌아왔다. 걸은 거리는 모두 몇 m인가?`, a * 2, {
        unit: 'm', explain: `갔다가 돌아왔으므로 ${a} m인 길을 2번 지났다. ${times(a, 2)}`, facts: { calc: [[E(a, '*', 2), 0]], unseen: [2] }
      });
    }, { standard: SOLVE }),
    T('mix-month', '문장제: 한 달 동안', '①54 ②69 ③58 심57', (d) => {
      // 매일 25분씩 8월 한 달 → 25×31
      const month = d.pick([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), days = [4, 6, 9, 11].includes(month) ? 30 : 31, a = plain2(d, 15, 58), who = d.pick(NAMES);
      return N(`${name(who, '은/는')} ${month}월 한 달 동안 매일 ${a}분씩 책을 읽었다. ${month}월에 책을 읽은 시간은 모두 몇 분인가?`, a * days, {
        unit: '분', explain: `${month}월은 ${days}일까지 있다. ${times(a, days)}`, facts: { calc: [[E(a, '*', days), 0]], unseen: [days] }
      });
    }, { standard: SOLVE }),
    T('mix-route', '문장제: 같은 거리를 여러 번', '①55', (d) => {
      // 집·학교·공원 사이가 모두 232 m, 한 바퀴 돌아 집으로 → 232×3
      const a = d.until(() => d.int(118, 298), (v) => v % 10 !== 0 && Math.floor(v / 10) % 10 !== 0 && ups3(v, 3) >= 1);
      return N(`집, 학교, 공원 사이의 거리는 모두 ${a} m로 같다. 집에서 출발하여 학교와 공원을 차례로 지나 집으로 걸어서 돌아왔다. 걸은 거리는 모두 몇 m인가?`, a * 3, {
        unit: 'm', figure: route([['집', 0, 100], ['학교', 50, 0, false], ['공원', 100, 100]], [[0, 1, a + ' m'], [1, 2, a + ' m'], [0, 2, a + ' m', 10]], 66),
        explain: `${a} m인 길을 3번 지났다. ${times(a, 3)}`, facts: { calc: [[E(a, '*', 3), 0]], unseen: [3] }
      });
    }, { standard: SOLVE }),
    T('mix-under', '곱보다 작은 수 중 가장 큰 수', '②57 ③55', (d) => {
      // 274×6 > □ → 1643
      const [a, b] = anyPair(d);
      return N('□ 안에 들어갈 수 있는 수 중 가장 큰 수는?', a * b - 1, {
        figure: expr(a, '*', b, '<i>&gt;</i>', box()), explain: `${times(a, b)}이다. ${a * b}보다 작은 수 중 가장 큰 수는 ${a * b - 1}이다.`, facts: { calc: [[`${a}*${b}-1`, 0]], unseen: [1], mulAny: [a, b] }
      });
    }),
    T('mix-est-real', '어림한 값과 계산한 값', '①67 ②10 ③40 심18', (d) => {
      // 592×5 → 어림 3000, 계산 2960
      const h = d.int(2, 8) * 100, a = h + d.pick([-1, 1]) * d.int(3, 12), b = d.int(3, 9);
      return M(`${a} × ${josa(b, '을/를')} 어림한 값과 실제로 계산한 값을 구하려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: h * b }, { label: LABELS[1], answer: a * b }], {
        figure: lines([`${josa(a, '을/를')} ${josa(h, '으로/로')} 어림하여 계산하면 약 ${box(LABELS[0])}이다.`, `실제로 계산하면 ${a} × ${b} = ${box(LABELS[1])}이다.`]),
        explain: `어림하여 계산하면 ${times(h, b)}, 실제로 계산하면 ${times(a, b)}이다.`, facts: { calc: [[E(h, '*', b), 0], [E(a, '*', b), 1]], mulAny: [a, b] }
      });
    }, { standard: SOLVE }),
    T('mix-est-word', '문장제: 어림셈', '①66 심18', (d) => {
      // 69개씩 81상자 → 약 70×80=5600
      const [a, b] = pair22(d, (x, y) => [x, y].every((v) => v >= 26 && v % 10 !== 5 && Math.abs(v - ten(v)) <= 3)), ra = ten(a), rb = ten(b);
      return N(`사과를 한 상자에 ${a}개씩 담았더니 ${b}상자가 되었다. ${josa(a, '과/와')} ${josa(b, '을/를')} 각각 가장 가까운 몇십으로 어림하여 계산하면 사과는 약 몇 개인가?`, ra * rb, {
        unit: '개', lead: '약', explain: `${josa(a, '은/는')} ${ra}에, ${josa(b, '은/는')} ${rb}에 가깝다. ${times(ra, rb)}`, facts: { calc: [[`${ra}*${rb}`, 0]], unseen: [ra, rb] }
      });
    }, { standard: SOLVE })
  ]);

  // ── 실력 문제 ──────────────────────────────────────────────────
  B.addTypes('3-2-1', 'hard', [
    H('h-fits-two', '양쪽이 곱인 식에서 □ 안에 들어갈 수 있는 수', '①49 ②58 심49', (d) => {
      // 3×67 > □×52 → 1, 2, 3
      const [x, y, c, k] = d.until(() => {
        const side = plain2(d, 23, 78), count = d.int(2, 6), first = d.int(3, 9);
        return [first, d.int(Math.floor((side * count) / first) + 1, Math.max(Math.floor((side * count) / first) + 1, Math.ceil((side * (count + 1)) / first) - 1)), side, count];
      }, ([p, q, r, s]) => q >= 12 && q <= 89 && q % 10 !== 0 && p * q > r * s + 2 && p * q < r * (s + 1) - 2);
      return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', k, {
        unit: '개', figure: expr(x, '*', y, '<i>&gt;</i>', box(), '*', c),
        explain: `${times(x, y)}이다. ${times(c, k)}, ${times(c, k + 1)}이므로 □ 안에 들어갈 수 있는 수는 1부터 ${k}까지 ${k}개이다.`,
        facts: { digit: { template: `${x}*${y}>□*${c}`, lo: 1, hi: 9, ask: 'count' } }
      });
    }),
    H('h-fits-tens', '(몇십몇)×(□0)이 어떤 수보다 클 때', '①49 ②58 심48', (d) => {
      // 42×□0 > 2500 → 6
      const a = plain2(d, 23, 78), k = d.int(3, 8), limit = a * (k - 1) * 10 + d.int(2, a - 2) * 10;
      return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 가장 작은 수는?', k, {
        figure: expr(a, '*', box() + '0', '<i>&gt;</i>', limit), explain: `${times(a, (k - 1) * 10)}, ${times(a, k * 10)}이므로 □ 안에 들어갈 수 있는 가장 작은 수는 ${k}이다.`,
        facts: { digit: { template: `${a}*□0>${limit}`, lo: 1, hi: 9, ask: 'min' } }
      });
    }),
    H('h-wrong-sub', '잘못 계산한 어떤 수(뺀 경우)', '①63 ②59 ③65 심51 덧', (d) => {
      // 어떤 수에 17을 곱해야 할 것을 뺐더니 27 → 44×17
      const [x, b] = pair22(d, (p, q) => q <= 38 && p - q >= 6);
      return N(`어떤 수에 ${josa(b, '을/를')} 곱해야 할 것을 잘못하여 ${josa(b, '을/를')} 뺐더니 ${josa(x - b, '이/가')} 되었다. 바르게 계산한 값은?`, x * b, {
        explain: `어떤 수는 ${expr(x - b, '+', b, '=', x)}이다. 바르게 계산하면 ${times(x, b)}이다.`, facts: { calc: [[`(${x - b}+${b})*${b}`, 0]] }
      });
    }, { standard: SOLVE }),
    H('h-minutes', '시간을 분으로 바꾸어 곱하기', '심57 덧', (d) => {
      // 1분에 48개씩 1시간 15분 → 48×75
      const a = plain2(d, 24, 68), m = d.pick([10, 15, 20, 25, 30]);
      return N(`어느 기계는 1분에 과자를 ${a}개씩 만든다. 이 기계가 1시간 ${m}분 동안 만드는 과자는 모두 몇 개인가?`, a * (60 + m), {
        unit: '개', explain: `1시간 ${m}분은 ${expr(60, '+', m, '=', 60 + m)}(분)이다. ${times(a, 60 + m)}`, facts: { calc: [[`${a}*(60+${m})`, 0]], unseen: [60] }
      });
    }, { standard: SOLVE }),
    H('h-made-left', '만든 것에서 나누어 준 것을 뺀 나머지', '심62 덧', (d) => {
      // 하루 30개씩 14일 접고 8개씩 12봉지를 줌 → 420−96
      const [a, b, c, e] = d.until(() => [plain2(d, 12, 38), plain2(d, 12, 28), d.int(6, 9), plain2(d, 12, 38)], ([p, q, r, s]) => p * q <= 950 && r * s >= 100 && p * q - r * s >= 60), who = d.pick(NAMES);
      return N(`${name(who, '은/는')} 종이학을 하루에 ${a}개씩 ${b}일 동안 접었다. 그중에서 한 봉지에 ${c}개씩 ${e}봉지를 친구들에게 주었다. 남은 종이학은 몇 개인가?`, a * b - c * e, {
        unit: '개', explain: `접은 종이학은 ${times(a, b)}(개), 친구들에게 준 종이학은 ${times(c, e)}(개)이다. ${expr(a * b, '-', c * e, '=', a * b - c * e)}`,
        facts: { calc: [[`${a}*${b}-${c}*${e}`, 0]] }
      });
    }, { standard: SOLVE }),
    H('h-times-join', '몇 배인 수를 구해 처음 수와 더하기', '덧', (d) => {
      // 자두 212개, 살구는 자두의 3배 → 212×3+212
      const [a, k] = d.until(() => [d.int(112, 289), d.int(2, 4)], ([x, y]) => x % 10 !== 0 && Math.floor(x / 10) % 10 !== 0 && x * (y + 1) <= 990 && ups3(x, y) >= 1);
      return N(`과일 가게에 자두가 ${a}개 있고, 살구의 수는 자두의 수의 ${k}배이다. 과일 가게에 있는 자두와 살구는 모두 몇 개인가?`, a * k + a, {
        unit: '개', explain: `살구는 ${times(a, k)}(개)이다. ${expr(a, '+', a * k, '=', a + a * k)}`, facts: { calc: [[`${a}*${k}+${a}`, 0]] }
      });
    }, { standard: SOLVE }),
    H('h-join', '곱으로 구한 수와 다른 수를 합치기', '덧', (d) => {
      // 14개씩 18봉지를 주운 사람과 238개를 주운 사람 → 252+238
      const [a, b] = pair22(d, (x, y) => x <= 29 && y <= 29), n = d.until(() => d.int(112, 289), (v) => v % 10 !== 0 && a * b + v <= 990 && (a * b + v) % 10 !== 0), [one, two] = d.shuffle(NAMES).slice(0, 2);
      return N(`${name(one, '은/는')} 밤을 한 봉지에 ${a}개씩 ${b}봉지 주웠고, ${name(two, '은/는')} ${n}개 주웠다. 두 사람이 주운 밤은 모두 몇 개인가?`, a * b + n, {
        unit: '개', explain: `${name(one, '이/가')} 주운 밤은 ${times(a, b)}(개)이다. ${expr(a * b, '+', n, '=', a * b + n)}`, facts: { calc: [[`${a}*${b}+${n}`, 0]] }
      });
    }, { standard: SOLVE }),
    H('h-chain-word', '두 번 곱하는 문장제', '심52 덧', (d) => {
      // 16명씩 28개 학교, 한 명에게 4권씩 → 448×4
      const [a, b] = pair22(d, (x, y) => x <= 29 && y <= 38 && x * y <= 989 && (x * y) % 10 !== 0), c = d.int(3, 6);
      return N(`줄넘기 대회에 한 학교에서 ${a}명씩 ${b}개 학교가 참가하였다. 참가한 학생 모두에게 공책을 ${c}권씩 주려고 한다. 필요한 공책은 모두 몇 권인가?`, a * b * c, {
        unit: '권', explain: `참가한 학생은 ${times(a, b)}(명)이다. ${times(a * b, c)}`, facts: { calc: [[`${a}*${b}*${c}`, 0]] }
      });
    }, { standard: SOLVE }),
    HB('h-table-sum', '표의 수를 모두 더한 뒤 곱하기', '①60 ②75 덧', (d) => {
      // 23, 27, 26, 25명에게 4자루씩 → 101×4
      const counts = d.until(() => [0, 1, 2, 3].map(() => d.int(22, 29)), (v) => { const s = v.reduce((p, q) => p + q, 0); return s >= 101 && s % 10 !== 0 && new Set(v).size >= 3; });
      const sum = counts.reduce((p, q) => p + q, 0), k = d.int(3, 8);
      return N(`3학년의 반별 학생 수를 나타낸 표이다. 3학년 학생 모두에게 연필을 ${k}자루씩 주려고 한다. 필요한 연필은 모두 몇 자루인가?`, sum * k, {
        unit: '자루', figure: table(['반', '학생 수(명)'], counts.map((n, i) => [`${i + 1}반`, n])),
        explain: `3학년 학생은 모두 ${counts.join(' + ')} = ${sum}(명)이다. ${times(sum, k)}`, facts: { calc: [[`(${counts.join('+')})*${k}`, 0]] }
      });
    }, { standard: SOLVE }),
    HB('h-more-times', '더 긴 길이를 구한 뒤 몇 배 하기', '①59 ②76', (d) => {
      // 453에 20을 더한 수의 4배
      const [a, m, k] = d.until(() => [d.int(112, 289), plain2(d, 12, 48), d.int(3, 6)], ([x, y]) => x % 10 !== 0 && (x + y) % 10 !== 0 && Math.floor((x + y) / 10) % 10 !== 0);
      return N(`빨간 끈의 길이는 ${a} cm이고, 파란 끈은 빨간 끈보다 ${m} cm 더 길다. 노란 끈의 길이는 파란 끈의 길이의 ${k}배이다. 노란 끈의 길이는 몇 cm인가?`, (a + m) * k, {
        unit: 'cm', explain: `파란 끈의 길이는 ${expr(a, '+', m, '=', a + m)}(cm)이다. ${times(a + m, k)}`, facts: { calc: [[`(${a}+${m})*${k}`, 0]] }
      });
    }, { standard: SOLVE }),
    H('h-wheels', '곱하는 수가 낱말에 숨어 있는 두 곱의 합', '심58', (d) => {
      // 두발자전거 124대와 세발자전거 132대의 바퀴 → 124×2+132×3
      const [a, b] = d.until(() => [d.int(105, 198), d.int(105, 198)], ([x, y]) => x !== y && x % 10 !== 0 && y % 10 !== 0 && x * 2 + y * 3 <= 990);
      return N(`자전거 가게에 두발자전거가 ${a}대, 세발자전거가 ${b}대 있다. 자전거의 바퀴는 모두 몇 개인가?`, a * 2 + b * 3, {
        unit: '개', explain: `두발자전거의 바퀴는 ${times(a, 2)}(개), 세발자전거의 바퀴는 ${times(b, 3)}(개)이다. ${expr(a * 2, '+', b * 3, '=', a * 2 + b * 3)}`,
        facts: { calc: [[`${a}*2+${b}*3`, 0]], unseen: [2, 3] }
      });
    }, { standard: SOLVE })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
