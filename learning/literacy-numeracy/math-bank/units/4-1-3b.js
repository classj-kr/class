// 4학년 1학기 3단원 곱셈과 나눗셈 — 곱의 크기 비교·어림·문장제, 나눗셈의 확인·비교·어림·문장제의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3, 심화꼴 75꼴)과 덧문서를 꼴마다 따져서 실었다. 계산 묶음(곱셈 둘, 나눗셈 셋)은 4-1-3a.js 에 있다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 곱하는 수가 몇십일 때 0을 빠뜨리거나, (몇)끼리의 곱에 이미 있는 0을 붙인 0으로 친다(450×20을 900으로).
//   ② 세로셈에서 십의 자리 숫자를 곱한 값을 (몇)을 곱한 값으로 읽는다(둘째 줄을 한 자리 밀어 쓰는 까닭을 모른다).
//   ③ 나머지가 나누는 수보다 큰데 그대로 둔다. 확인하는 식만 맞으면 바른 계산이라고 여긴다.
//   ④ 몫의 일의 자리에 0을 쓰지 않는다(624÷31을 2…4로). 몫의 십의 자리 숫자가 나타내는 수를 그 숫자로 읽는다.
//   ⑤ 확인하는 식에서 나머지를 더하지 않거나 몫과 나머지의 자리를 바꾼다.
//   ⑥ 나머지를 올려야 하는 상황(모두 담으려면 상자가 하나 더 필요하다)과 버려야 하는 상황(가득 찬 상자만 판다)을 가리지 못한다.
//   ⑦ 0을 하나씩 지우고 나눈 나머지를 그대로 답한다(370÷40을 37÷4=9…1로 계산하고 나머지를 1로).
//   ⑧ 나머지가 될 수 있는 가장 큰 수는 나누는 수보다 1 작은 수이다(나누는 수와 같다고, 한 자리 수라고 여긴다).
// 그다음에 두 번 넘게 계산해야 하는 문장제를 실었다(두 곱의 합, 더한 뒤 곱하기, 거스름돈, 두 곱의 비교, 세 수의 곱, 더한 뒤·곱한 뒤·뺀 뒤 나누기,
// 나눈 뒤 곱하기, 두 몫의 비교, 두 나눗셈에서 남는 수 모으기, 남김없이 나누려면 더 필요한 수, 잘못 계산한 어떤 수, 어림한 값과 실제로 필요한 수). 식을 쓰게 하지 않고 답만 묻는다.
//
// 뺀 것과 까닭(꼴 번호는 기본꼴 ①②③, 심화꼴 「심」)
//  - 상위 학년: 비례로 늘리는 것(②92, 6학년 「비례식과 비례배분」), 일의 양(심74, 반비례), 두 단계를 한 식(혼합 계산, 5학년)으로 쓰게 하는 것
//  - 조건 풀이·경우 따지기가 어려움의 대부분: 큰 차례가 되게 하는 □(①26 심19), 조건이 둘인 □(③22), 곱이 어떤 수에 가장 가깝게 되는 □(③23),
//    자리 숫자 □(심18의 변형, ③73 심47), 나눗셈이 든 부등식(③74), 범위 안에서 나머지 조건에 맞는 수 찾기(①62 ③70·72 심45),
//    몫의 빈 숫자로 나누어지는 수 정하기(①61), 수 카드를 식에 맞게 놓기(③77), 수 카드를 어느 자리에 놓을지 견주기(심20),
//    간격·나무 심기(①95 ②93 ③100 심69), 덤 주기(①85 심59), 겹쳐 이어 붙이기(심60), 날마다 2배(①86), 네 단계 문장제(심73의 변형)
//  - 뜻 없는 셈: 몫과 나머지의 합·차·곱(①63 ②72 ③62 심32), 나머지를 다시 나누는 수로 쓰기(①65), 두 식의 어떤 수 더하기(③68),
//    두 곱의 차·사이의 수(심14), 두 몫 사이의 수(②75 심48)
//  - 서술형·문제 만들기·답이 열린 문제: ①98 ②35·36·95 ③102~105 심75, 어림한 방법 쓰기
//  - 앞 학년 되짚기: 수직선에서 가까운 몇백 찾기(①21·72의 변형)
//  - 이 단원 내용이 아닌 실수를 찾는 것: 세로셈 과정 속의 뺄셈을 틀린 계산(②83) — 바른 몫과 나머지를 구하는 계산과 같다.
//  - 같은 문제: 남지 않게 살 가게 고르기(③99)는 나누어떨어지는 나눗셈 만들기와, 대화 속 틀린 계산(③101)은 0의 개수가 틀린 식 고르기와,
//    어떤 수를 구해 다른 수로 나누기(②60)·나누는 수가 어떤 수인 잘못된 계산(②62)은 잘못 나눈 수 바로잡기와 얼개가 같다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, columnSteps, chars, chain, lines, tagged, numbers, cards, divSteps, N, M, C, E } = B.kit;
  const MUL = '4수01-04', DIV = '4수01-07';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const labelled = (answers) => answers.map((answer, i) => ({ label: LABELS[i], answer }));
  const apart = (list) => new Set(list.map(String)).size === list.length;
  const times = (a, b) => expr(a, '*', b, '=', a * b);
  const quot = (a, b) => Math.floor(a / b);
  const QX = (a, b) => `(${a}-${a}%${b})/${b}`, RX = (a, b) => `${a}%${b}`;      // 검사가 몫과 나머지를 다시 셈하는 식
  const both = (a, b) => [{ label: '몫', answer: quot(a, b) }, { label: '나머지', answer: a % b }];
  const shown = (a, b) => (a % b === 0 ? expr(a, '/', b, '=', a / b) : `${expr(a, '/', b, '=', quot(a, b))} … ${a % b}`);
  const said = (rows) => rows.map(([a, b], i) => `${LABELS[i]} ${shown(a, b)}`).join(', ');
  const orderList = (d, right) => d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
  // 가까운 몇백, 가까운 몇십으로 어림한 수를 검사가 다시 셈하는 식
  const RH = (a) => `(${a}+50-(${a}+50)%100)`, RT = (b) => `(${b}+5-(${b}+5)%10)`;

  // ── 수 고르기 ────────────────────────────────────────────────
  const full = (a) => a % 10 !== 0 && Math.floor(a / 10) % 10 !== 0 && !/^(\d)\1\1$/.test(String(a));
  const three = (d, ok) => d.until(() => d.int(112, 987), (a) => full(a) && (!ok || ok(a)));
  const tensOf = (d) => d.int(2, 9) * 10;
  const two = (d) => d.until(() => d.int(12, 98), (b) => b % 10 >= 2 && b % 10 !== Math.floor(b / 10));      // 곱하는 두 자리 수(몇십이 아니다)
  const byTwo = (d, ok) => d.until(() => [three(d), two(d)], ([a, b]) => !ok || ok(a, b));
  const within = (d, lo, hi) => byTwo(d, (a, b) => a * b >= lo && a * b <= hi);
  const divisor = (d, lo, hi) => d.until(() => d.int(lo || 12, hi || 98), (b) => b % 10 !== 0);              // 나누는 두 자리 수(몇십이 아니다)
  // 나눗셈 [나누어지는 수, 나누는 수]. ok 는 (a, b, 몫, 나머지)를 받는다.
  const division = (d, alo, ahi, ok, blo, bhi) => d.until(() => [d.int(alo, ahi), divisor(d, blo, bhi)], ([a, b]) => ok(a, b, quot(a, b), a % b));
  const oneDigit = (d, ok) => division(d, 112, 899, (a, b, q, r) => a < b * 10 && q >= 2 && r !== 0 && full(a) && (!ok || ok(a, b, q, r)), 13);          // 몫이 한 자리 수, 나머지가 있다
  const twoDigit = (d, ok) => division(d, 132, 987, (a, b, q, r) => a >= b * 10 && q % 10 !== 0 && r !== 0 && (!ok || ok(a, b, q, r)), 12, 79);            // 몫이 두 자리 수, 나머지가 있다
  const tensDiv = (d, ok) => d.until(() => [d.int(101, 987), tensOf(d)], ([a, b]) => a % 10 !== 0 && quot(a, b) >= 2 && a % b !== 0 && (!ok || ok(a, b, quot(a, b), a % b)));
  const exactTwo = (d, ok) => d.until(() => { const b = divisor(d, 12, 79); return [b * d.int(11, 49), b]; }, ([a, b]) => a <= 987 && (a / b) % 10 !== 0 && (!ok || ok(a, b)));   // 나누어떨어지고 몫이 두 자리 수
  const exactOne = (d) => d.until(() => { const b = divisor(d, 13, 98); return [b * d.int(3, 9), b]; }, ([a]) => a >= 104 && full(a));                      // 나누어떨어지고 몫이 한 자리 수
  const withQuot = (d, q) => d.until(() => { const b = divisor(d, 13, 98); return [b * q + d.int(1, b - 1), b]; }, ([a]) => a >= 104 && a <= 987 && full(a));   // 몫이 q 인 (세 자리 수)÷(두 자리 수)

  // ── 곱의 크기 비교 ───────────────────────────────────────────
  B.addTypes('4-1-3', 'mc', [
    T('mc-compare', '두 곱의 크기 비교', '①17 ②23 ③18 심10', (d) => {
      // 한쪽은 곱해지는 수가, 다른 쪽은 곱하는 수가 커서 계산해야 알 수 있다
      const [a, b] = byTwo(d), [c, e] = byTwo(d, (x, y) => x * y !== a * b && Math.abs(x * y - a * b) <= 2500 && (x - a) * (y - b) < 0);
      return C('두 곱의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, a * b > c * e ? 0 : 2, {
        figure: versus(expr(a, '*', b), expr(c, '*', e)), explain: `${times(a, b)}, ${times(c, e)}`, facts: { choose: { exprs: [E(a, '*', b), E(c, '*', e)], rule: 'compare' }, rule: 'compareTwo' }
      });
    }),
    T('mc-compare-tens', '(몇백)×(몇십)인 두 곱의 크기 비교', '①17 ②11 ③18', (d) => {
      // 600×70 과 700×60 은 같다. 210×80 과 560×30 처럼 0을 뺀 수의 곱이 같은 것과 조금 다른 것을 섞는다.
      const same = d.bool(), [h1, k1, h2, k2] = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(2, 9), d.int(2, 9)], ([p, q, r, s]) => p !== r && (same ? p * q === r * s : p * q !== r * s && Math.abs(p * q - r * s) <= 6 && (p - r) * (q - s) < 0));
      const left = [h1 * 100, k1 * 10], right = [h2 * 100, k2 * 10], x = left[0] * left[1], y = right[0] * right[1];
      return C('두 곱의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : x === y ? 1 : 2, {
        figure: versus(expr(left[0], '*', left[1]), expr(right[0], '*', right[1])), explain: `${times(left[0], left[1])}, ${times(right[0], right[1])}`,
        facts: { choose: { exprs: [E(left[0], '*', left[1]), E(right[0], '*', right[1])], rule: 'compare' }, rule: 'compareTens' }
      });
    }),
    T('mc-compare-num', '곱과 수의 크기 비교', '①17 ③18', (d) => {
      const [a, b] = byTwo(d), p = a * b, n = Math.round(p / 100) * 100 + d.pick([-300, -200, -100, 100, 200, 300]);
      return C('곱과 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, p > n ? 0 : 2, {
        figure: versus(expr(a, '*', b), `<span class="mb-expr">${n}</span>`), explain: `${times(a, b)}이고 ${josa(p, '은/는')} ${n}보다 ${p > n ? '크다' : '작다'}.`, facts: { choose: { exprs: [E(a, '*', b), String(n)], rule: 'compare' } }
      });
    }),
    T('mc-nocalc', '계산하지 않고 곱의 크기 비교', '②11', (d) => {
      // 355×90 과 350×90: 곱하는 수가 같으면 곱해지는 수가 큰 쪽의 곱이 크다
      const a = three(d), b = tensOf(d), same = d.bool(), other = same ? [a + d.pick([-7, -5, -3, 3, 5, 7]), b] : [a, b === 90 || (b > 20 && d.bool()) ? b - 10 : b + 10];
      const [left, right] = d.shuffle([[a, b], other]);
      return C('계산하지 않고 두 곱의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, left[0] * left[1] > right[0] * right[1] ? 0 : 2, {
        figure: versus(expr(left[0], '*', left[1]), expr(right[0], '*', right[1])),
        explain: same ? `곱하는 수가 ${josa(b, '으로/로')} 같으므로 곱해지는 수가 큰 쪽의 곱이 크다.` : `곱해지는 수가 ${josa(a, '으로/로')} 같으므로 곱하는 수가 큰 쪽의 곱이 크다.`,
        facts: { choose: { exprs: [E(left[0], '*', left[1]), E(right[0], '*', right[1])], rule: 'compare' } }
      });
    }),
    T('mc-order', '곱이 큰 것부터 차례대로', '①18 ②23 ③19 심11', (d) => {
      const first = within(d, 9000, 40000), base = first[0] * first[1];
      const rows = d.shuffle([first].concat(d.until(() => [within(d, base - 3000, base + 3000), within(d, base - 3000, base + 3000)], (list) => new Set(list.concat([first]).map(([x, y]) => x * y)).size === 3 && apart(list.concat([first]).map(([x]) => x)))));
      const values = rows.map(([x, y]) => x * y), right = [0, 1, 2].sort((p, q) => values[q] - values[p]), list = orderList(d, right);
      return C('곱이 큰 것부터 차례대로 기호를 쓴 것은?', list.map((o) => o.map((k) => LABELS[k]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'descending', orders: list } }
      });
    }),
    T('mc-max', '곱이 가장 큰 것', '②11', (d) => {
      // 246×40, 432×20, 329×30: 곱해지는 수가 가장 큰 식이 답이 되지 않게 낸다
      const rows = d.until(() => { const base = d.int(8, 17) * 1000; return d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).map((k) => [Math.floor(base / (k * 10)) + d.int(-15, 15), k * 10]); },
        (list) => { const v = list.map(([x, y]) => x * y); return list.every(([x]) => x >= 112 && x <= 987 && full(x)) && new Set(v).size === 3 && v.indexOf(Math.max(...v)) !== list.map(([x]) => x).indexOf(Math.max(...list.map(([x]) => x))); });
      const values = rows.map(([x, y]) => x * y);
      return C('곱이 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
        figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'max' } }
      });
    }),
    T('mc-near', '어떤 수에 가장 가까운 곱', '심13', (d) => {
      // 7000에 가장 가까운 것: 곱한 뒤 7000과의 차를 구한다
      const target = d.int(6, 20) * 1000;
      const rows = d.until(() => [within(d, target - 1500, target + 1500), within(d, target - 1500, target + 1500), within(d, target - 1500, target + 1500)], (list) => {
        const gaps = list.map(([x, y]) => Math.abs(x * y - target)).sort((p, q) => p - q);
        return gaps[0] >= 20 && gaps[1] - gaps[0] >= 50 && apart(list.map(([x]) => x)) && list.some(([x, y]) => x * y > target) && list.some(([x, y]) => x * y < target);
      });
      const gaps = rows.map(([x, y]) => Math.abs(x * y - target));
      return C(`계산 결과가 ${target}에 가장 가까운 것은?`, LABELS.slice(0, 3), gaps.indexOf(Math.min(...gaps)), {
        figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: `${rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', ')}. ${josa(target, '과/와')}의 차는 차례로 ${gaps.join(', ')}이다.`,
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'nearest', target } }
      });
    }),
    T('mc-range-min', '□ 안에 들어갈 수 있는 가장 작은 수(곱셈)', '①25', (d) => {
      // 300×□>3500 → 12
      const h = d.int(3, 9), A = h * 100, x = d.int(11, 28), limit = A * (x - 1) + d.int(1, h - 1) * 100;
      return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 작은 수는?', x, {
        figure: `<span class="mb-expr">${A} <i>×</i> ${box()} <i>&gt;</i> ${limit}</span>`,
        explain: `${times(A, x - 1)}, ${times(A, x)}이다. ${josa(limit, '은/는')} 두 곱 사이의 수이므로 □ 안에 들어갈 수 있는 가장 작은 수는 ${x}이다.`, facts: { range: { ineq: `${A}*x>${limit}`, lo: 1, hi: 99, want: 'min' } }
      });
    }),
    T('mc-range-max', '□ 안에 들어갈 수 있는 가장 큰 수(곱셈)', '③21 심18', (d) => {
      // 21×□<546 → 546÷21=26 이므로 25
      const [p, b] = exactTwo(d), n = p / b;
      return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 큰 수는?', n - 1, {
        figure: `<span class="mb-expr">${b} <i>×</i> ${box()} <i>&lt;</i> ${p}</span>`,
        explain: `${shown(p, b)}이므로 ${times(b, n)}이다. □ 안에는 ${n}보다 작은 수가 들어갈 수 있으므로 가장 큰 수는 ${n - 1}이다.`, facts: { range: { ineq: `${b}*x<${p}`, lo: 1, hi: 99, want: 'max' } }
      });
    }),
    T('mc-box-min', '곱보다 큰 수 가운데 가장 작은 수', '심18', (d) => {
      // 865×40<□ → 34601
      const a = three(d), b = tensOf(d);
      return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 작은 수는?', a * b + 1, {
        figure: `<span class="mb-expr">${a} <i>×</i> ${b} <i>&lt;</i> ${box()}</span>`, explain: `${times(a, b)}이다. □ 안에는 ${a * b}보다 큰 수가 들어갈 수 있으므로 가장 작은 수는 ${a * b + 1}이다.`, facts: { calc: [[`${a}*${b}+1`, 0]], unseen: [1] }
      });
    })
  ]);

  // ── 곱셈의 어림 ──────────────────────────────────────────────
  // [곱해지는 수, 곱하는 수, 가까운 몇백, 가까운 몇십]. side: 1 이면 둘 다 조금 크게, -1 이면 둘 다 조금 작게, 0 이면 아무 쪽.
  const nearPair = (d, side) => {
    const h = d.int(2, 9) * 100, k = d.int(2, 9) * 10, sa = side || d.pick([-1, 1]), sb = side || d.pick([-1, 1]);
    return [h + sa * d.int(3, 12), k + sb * d.int(1, 2), h, k];
  };
  B.addTypes('4-1-3', 'me', [
    T('me-pick', '어림한 값 고르기(곱셈)', '①20', (d) => {
      // 306×50 → 150, 1500, 15000, 150000
      const [a, b, h, k] = nearPair(d, 0), est = h * k, list = d.shuffle([est / 100, est / 10, est, est * 10]);
      return C(`${a} × ${josa(b, '을/를')} 어림셈으로 구한 값으로 가장 알맞은 것은?`, list.map(String), list.indexOf(est), {
        explain: `${josa(a, '은/는')} 약 ${h}, ${josa(b, '은/는')} 약 ${k}이므로 ${a} × ${josa(b, '은/는')} 약 ${h} × ${k} = ${est}이다.`, facts: { choose: { exprs: list.map(String), rule: 'nearest', target: a * b } }
      });
    }),
    T('me-round', '어림셈 식 세우기(곱셈)', '①21 ②33 심15', (d) => {
      // 691 은 약 700, 29 는 약 30 → 700×30=21000
      const [a, b, h, k] = nearPair(d, 0);
      return M(`${a} × ${josa(b, '을/를')} 어림셈으로 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([h, k, h * k]), {
        figure: lines([`${josa(a, '을/를')} 몇백으로 어림한 수: ${box(LABELS[0])}`, `${josa(b, '을/를')} 몇십으로 어림한 수: ${box(LABELS[1])}`, `어림셈으로 구한 곱: ${box(LABELS[0])} × ${box(LABELS[1])} = ${box(LABELS[2])}`]),
        explain: `${josa(a, '은/는')} ${h}에 가깝고 ${josa(b, '은/는')} ${k}에 가깝다. ${times(h, k)}`, facts: { calc: [[RH(a), 0], [RT(b), 1], [`${RH(a)}*${RT(b)}`, 2]], unseen: [50, 100, 5, 10] }
      });
    }),
    T('me-both', '어림한 값과 실제로 계산한 값', '①21·24 ②33', (d) => {
      // 297×19 → 약 6000, 실제 5643
      const [a, b, h, k] = nearPair(d, 0);
      return M(`${josa(a, '을/를')} 몇백으로, ${josa(b, '을/를')} 몇십으로 어림하여 ${a} × ${josa(b, '을/를')} 계산한 값과 실제로 계산한 값은?`, [{ label: '어림한 값', answer: h * k }, { label: '실제 값', answer: a * b }], {
        explain: `어림하면 ${times(h, k)}이고, 실제로 계산하면 ${times(a, b)}이다.`, facts: { calc: [[`${RH(a)}*${RT(b)}`, 0], [E(a, '*', b), 1]], unseen: [50, 100, 5, 10] }
      });
    }),
    T('me-judge', '어림한 값과 실제 곱의 크기', '①22 ③78 심15', (d) => {
      // 304×42 를 300×40=12000 으로 어림하면 실제 곱은 더 크다
      const up = d.bool(), [a, b, h, k] = nearPair(d, up ? 1 : -1);
      return C(`${a} × ${josa(b, '을/를')} ${h} × ${k} = ${josa(h * k, '으로/로')} 어림하였다. 실제 곱은 어림한 값과 비교하여 어떠한가?`, ['어림한 값보다 크다.', '어림한 값과 같다.', '어림한 값보다 작다.'], up ? 0 : 2, {
        explain: `${josa(a, '은/는')} ${h}보다 ${up ? '크고' : '작고'} ${josa(b, '은/는')} ${k}보다 ${up ? '크므로' : '작으므로'} 실제 곱은 ${h * k}보다 ${up ? '크다' : '작다'}. 실제 곱은 ${a * b}이다.`,
        facts: { choose: { exprs: [E(a, '*', b), E(h, '*', k)], rule: 'compare' } }
      });
    }),
    T('me-detect', '어림셈으로 잘못된 계산 알아보기', '③79', (d) => {
      // 825×61=46325 라고 하였다: 800×60=48000 보다 커야 한다
      const h = d.int(3, 8) * 100, k = d.int(3, 8) * 10, a = h + d.int(11, 45), b = k + d.int(1, 4), est = h * k, wrong = a * b - Math.ceil((a * b - est + 1) / 1000) * 1000;
      const rows = d.shuffle([
        [`${h} × ${k} = ${est}보다 커야 하므로 잘못 계산하였다.`, true],
        [`${h} × ${k} = ${est}보다 작아야 하므로 바르게 계산하였다.`, false],                                              // 크게 어림했는지 작게 어림했는지를 거꾸로 아는 아이
        [`${h + 100} × ${k + 10} = ${(h + 100) * (k + 10)}보다 작으므로 바르게 계산하였다.`, false],                        // 위쪽 어림만 보고 판단하는 아이
        ['어림한 값과 실제 곱은 다르므로 어림셈으로는 알 수 없다.', false]
      ]);
      return C(`${a} × ${josa(b, '을/를')} 계산하여 ${josa(wrong, '을/를')} 얻었다. 어림셈으로 이 계산을 살펴본 것으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${josa(a, '은/는')} ${h}보다 크고 ${josa(b, '은/는')} ${k}보다 크므로 곱은 ${times(h, k)}보다 커야 한다. ${josa(wrong, '은/는')} ${est}보다 작으므로 잘못 계산한 것이다. 바르게 계산하면 ${times(a, b)}이다.`,
        facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('me-compare', '어림셈으로 두 곱의 크기 비교', '①23', (d) => {
      // 405×21 과 195×29 → 400×20=8000, 200×30=6000
      const [[a, b, h1, k1], [c, e, h2, k2]] = d.until(() => [nearPair(d, 0), nearPair(d, 0)], ([p, q]) => Math.abs(p[2] * p[3] - q[2] * q[3]) >= 2000 && Math.abs(p[2] * p[3] - q[2] * q[3]) <= 9000 && (p[2] - q[2]) * (p[3] - q[3]) < 0 && (p[0] * p[1] > q[0] * q[1]) === (p[2] * p[3] > q[2] * q[3]));
      return C('어림셈으로 두 곱의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, h1 * k1 > h2 * k2 ? 0 : 2, {
        figure: versus(expr(a, '*', b), expr(c, '*', e)), explain: `${a} × ${josa(b, '은/는')} 약 ${times(h1, k1)}, ${c} × ${josa(e, '은/는')} 약 ${times(h2, k2)}이다.`,
        facts: { choose: { exprs: [`${RH(a)}*${RT(b)}`, `${RH(c)}*${RT(e)}`], rule: 'compare' }, unseen: [50, 100, 5, 10] }
      });
    }),
    T('me-word', '문장제: 어림하여 약 몇(곱셈)', '①24 ②33 ③82 심15', (d) => {
      // 의자가 한 줄에 102개씩 51줄 → 100×50=5000
      const [a, b, h, k] = d.until(() => nearPair(d, 0), (list) => list[2] <= 400);
      return N(`강당에 의자를 한 줄에 ${a}개씩 ${b}줄로 놓았다. ${josa(a, '을/를')} 몇백으로, ${josa(b, '을/를')} 몇십으로 어림하여 계산하면 의자는 약 몇 개인가?`, h * k, {
        unit: '개', lead: '약', explain: `${josa(a, '은/는')} 약 ${h}, ${josa(b, '은/는')} 약 ${k}이다. ${times(h, k)}`, facts: { calc: [[`${RH(a)}*${RT(b)}`, 0]], unseen: [50, 100, 5, 10] }
      });
    }),
    T('me-enough', '어림셈으로 넘는지 판단하기', '②34 심16 덧문서', (d) => {
      // 293 g짜리 19개와 6000 g: 300×20=6000 이고 실제 무게는 이보다 가볍다
      const up = d.bool(), h = d.int(2, 5) * 100, k = d.int(2, 4) * 10, a = h + (up ? -1 : 1) * d.int(4, 9), b = k + (up ? -1 : 1) * d.int(1, 2), est = h * k, lighter = a * b < est;
      const head = `${h} × ${k} = ${est}이고 `;
      const rows = d.shuffle([
        [true, true, `${head}실제 무게는 이보다 가벼우므로 모두 담을 수 있다.`],
        [false, false, `${head}실제 무게는 이보다 무거우므로 모두 담을 수 없다.`],
        [null, true, `${head}실제 무게도 ${est} g이므로 모두 담을 수 있다.`],                       // 어림한 값을 실제 값으로 여기는 아이
        [null, false, `${head}어림한 값이 ${est} g과 같으므로 모두 담을 수 없다.`]                   // 기준과 같으면 넘는다고 여기는 아이
      ]);
      return C(`한 개의 무게가 ${a} g인 통조림 ${b}개를 상자에 담으려고 한다. 이 상자에는 ${est} g까지 담을 수 있다. 어림셈으로 알아본 것으로 옳은 것은?`, rows.map((row) => row[2]), rows.findIndex((row) => row[0] === lighter && row[1] === lighter), {
        explain: `${josa(a, '은/는')} ${h}보다 ${up ? '작고' : '크고'} ${josa(b, '은/는')} ${k}보다 ${up ? '작으므로' : '크므로'} 실제 무게는 ${times(h, k)}(g)보다 ${up ? '가볍다' : '무겁다'}. 실제 무게는 ${times(a, b)}(g)이다.`,
        facts: { judge: { need: E(a, '*', b), have: String(est), shown: lighter, options: rows.map((row) => [row[0], row[1]]) } }
      });
    })
  ]);

  // ── 곱셈 문장제 ──────────────────────────────────────────────
  B.addTypes('4-1-3', 'mw', [
    T('mw-tens', '문장제: 한 상자에 든 수와 상자의 수', '①76 ②27 ③83 심54', (d) => {
      const a = three(d), b = tensOf(d);
      return N(`구슬이 한 상자에 ${a}개씩 들어 있다. ${b}상자에 들어 있는 구슬은 모두 몇 개인가?`, a * b, { unit: '개', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
    }),
    T('mw-two', '문장제: 날마다 같은 횟수', '①77 ②27 ③83 심54', (d) => {
      const who = d.pick(NAMES), [a, b] = byTwo(d, (x) => x <= 480);
      return N(`${name(who, '은/는')} 줄넘기를 매일 ${a}번씩 ${b}일 동안 하였다. ${name(who, '이/가')} 한 줄넘기는 모두 몇 번인가?`, a * b, { unit: '번', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
    }),
    T('mw-small-first', '문장제: 작은 수가 먼저 나오는 곱셈', '①78 덧문서', (d) => {
      // 한 개가 52 g인 지우개 115개
      const [a, b] = byTwo(d, (x) => x <= 480);
      return N(`한 개의 무게가 ${b} g인 지우개가 ${a}개 있다. 지우개의 무게는 모두 몇 g인가?`, a * b, { unit: 'g', explain: `${b} × ${josa(a, '은/는')} ${a} × ${josa(b, '과/와')} 같다. ${times(a, b)}`, facts: { calc: [[E(a, '*', b), 0]] } });
    }),
    T('mw-times', '문장제: 몇 배', '②27', (d) => {
      const [a, b] = byTwo(d);
      return N(`파란 끈의 길이는 ${a} cm이고, 빨간 끈의 길이는 파란 끈의 길이의 ${b}배이다. 빨간 끈의 길이는 몇 cm인가?`, a * b, { unit: 'cm', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
    }),
    T('mw-month', '문장제: 한 달의 날수를 찾아 곱하기', '①79 ②28 심55', (d) => {
      // 매일 270회씩 5월 한 달 → 270×31
      const who = d.pick(NAMES), [month, days] = d.pick([['3월', 31], ['4월', 30], ['5월', 31], ['6월', 30], ['7월', 31], ['9월', 30], ['10월', 31], ['11월', 30]]), a = three(d, (x) => x <= 480);
      return N(`${name(who, '은/는')} ${month} 한 달 동안 하루도 빠짐없이 매일 물을 ${a} mL씩 마셨다. ${name(who, '이/가')} ${month} 한 달 동안 마신 물은 모두 몇 mL인가?`, a * days, {
        unit: 'mL', explain: `${month}은 ${days}일까지 있다. ${times(a, days)}`, facts: { calc: [[E(a, '*', days), 0]], unseen: [days] }
      });
    }),
    T('mw-weeks', '문장제: 몇 주를 날수로 바꾸어 곱하기', '①79 심55', (d) => {
      // 하루 145대씩 10주 → 145×70
      const a = three(d, (x) => x <= 480), w = d.int(2, 9);
      return N(`어느 공장에서 장난감을 하루에 ${a}개씩 만든다. 이 공장에서 하루도 쉬지 않고 ${w}주 동안 만드는 장난감은 모두 몇 개인가?`, a * 7 * w, {
        unit: '개', explain: `1주일은 7일이므로 ${w}주는 ${times(7, w)}(일)이다. ${times(a, 7 * w)}`, facts: { calc: [[`${a}*(7*${w})`, 0]], unseen: [7] }
      });
    }),
    T('mw-minutes', '문장제: 시간을 분으로 바꾸어 곱하기', '②28 심55', (d) => {
      // 1분에 108 m씩 1시간 15분 → 108×75
      const a = three(d, (x) => x <= 298), m = d.pick([5, 12, 15, 18, 24, 25, 32]);
      return N(`자전거를 타고 1분에 ${a} m씩 1시간 ${m}분 동안 달렸다. 자전거를 타고 달린 거리는 몇 m인가?`, a * (60 + m), {
        unit: 'm', explain: `1시간 ${m}분은 ${60 + m}분이다. ${times(a, 60 + m)}`, facts: { calc: [[`${a}*(60+${m})`, 0]], unseen: [60] }
      });
    }),
    T('mw-two-asks', '문장제: 몇 인분과 몇십 인분', '①80', (d) => {
      // 1인분에 145 g → 5인분, 50인분
      const k = d.int(3, 8), a = three(d, (x) => x <= 298);
      return M(`떡 1인분을 만드는 데 쌀가루가 ${a} g 필요하다. ${k}인분과 ${k * 10}인분을 만드는 데 필요한 쌀가루는 각각 몇 g인가?`, [{ label: `${k}인분`, answer: a * k, unit: 'g' }, { label: `${k * 10}인분`, answer: a * k * 10, unit: 'g' }], {
        explain: `${times(a, k)}이고, ${k * 10}인분은 ${k}인분의 10배이므로 ${a * k * 10} g이다.`, facts: { calc: [[E(a, '*', k), 0], [E(a, '*', k * 10), 1]] }
      });
    })
  ]);

  // ── 나머지와 확인하는 식 ─────────────────────────────────────
  B.addTypes('4-1-3', 'ck', [
    T('ck-fill', '확인하는 식 완성하기', '①57 ②56 ③66 심29', (d) => {
      // 386÷18=21…8 → 18×21=378, 378+8=386
      const [a, b] = twoDigit(d), q = quot(a, b), r = a % b;
      return M(`${a} ÷ ${b} = ${q} … ${josa(r, '이/가')} 맞는지 확인하려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([b * q, a]), {
        figure: lines([expr(b, '*', q, '=', box(LABELS[0])), expr(box(LABELS[0]), '+', r, '=', box(LABELS[1]))]),
        explain: `나누는 수와 몫의 곱에 나머지를 더하면 나누어지는 수가 된다. ${times(b, q)}, ${expr(b * q, '+', r, '=', a)}`, facts: { calc: [[E(b, '*', q), 0], [`${b}*${q}+${r}`, 1]] }
      });
    }),
    T('ck-do', '계산하고 확인하는 식 쓰기', '①57 ②56 ③66 덧문서', (d) => {
      // 663÷70 → 9…33, 70×9=630, 630+33=663
      const [a, b] = d.bool() ? oneDigit(d) : tensDiv(d, (x, y, q) => q <= 9), q = quot(a, b), r = a % b;
      return M('나눗셈을 계산하고 계산이 맞는지 확인하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([q, r, b * q]), {
        figure: lines([`<span class="mb-expr">${a} <i>÷</i> ${b} <i>=</i> ${box(LABELS[0])} … ${box(LABELS[1])}</span>`, `확인: ${expr(b, '*', box(LABELS[0]), '=', box(LABELS[2]))}, ${expr(box(LABELS[2]), '+', box(LABELS[1]), '=', a)}`]),
        explain: `${shown(a, b)}이다. 확인하면 ${times(b, q)}, ${expr(b * q, '+', r, '=', a)}`, facts: { calc: [[QX(a, b), 0], [RX(a, b), 1], [`${a}-${a}%${b}`, 2]] }
      });
    }),
    T('ck-back', '확인한 식을 보고 나누는 수 찾기', '②57', (d) => {
      // 87÷□=5…7, 확인: 16×5=80, 80+7=87
      const [a, b] = division(d, 61, 99, (x, y, q, r) => q >= 3 && r !== 0 && q !== r, 12, 29), q = quot(a, b), r = a % b;
      return N('나눗셈을 계산하고 계산이 맞는지 확인한 것이다. □ 안에 알맞은 수는?', b, {
        figure: lines([`계산: <span class="mb-expr">${a} <i>÷</i> ${box()} <i>=</i> ${q} … ${r}</span>`, `확인: ${times(b, q)}, ${expr(b * q, '+', r, '=', a)}`]),
        explain: `확인하는 식은 나누는 수와 몫의 곱에 나머지를 더한 것이다. 몫이 ${q}이므로 나누는 수는 ${b}이다.`, facts: { calc: [[`(${a}-${r})/${q}`, 0]] }
      });
    }),
    T('ck-dividend', '나누어지는 수 구하기', '①58 ②58 ③67 심42', (d) => {
      // □÷43=12…11
      const [a, b] = twoDigit(d), q = quot(a, b), r = a % b;
      return N('□ 안에 알맞은 수는?', a, {
        figure: `<span class="mb-expr">${box()} <i>÷</i> ${b} <i>=</i> ${q} … ${r}</span>`, explain: `나누는 수와 몫의 곱에 나머지를 더한다. ${times(b, q)}, ${expr(b * q, '+', r, '=', a)}`, facts: { calc: [[`${b}*${q}+${r}`, 0]] }
      });
    }),
    T('ck-dividend-word', '문장제: 나눈 결과로 처음 수 구하기', '①58 ②58 ③67 심42 덧문서', (d) => {
      const [a, b] = twoDigit(d, (x, y) => y <= 36), q = quot(a, b), r = a % b;
      return N(`상자에 들어 있던 사탕을 한 봉지에 ${b}개씩 담았더니 ${q}봉지가 되고 ${r}개가 남았다. 처음 상자에 들어 있던 사탕은 모두 몇 개인가?`, a, {
        unit: '개', explain: `${times(b, q)}, ${expr(b * q, '+', r, '=', a)}`, facts: { calc: [[`${b}*${q}+${r}`, 0]] }
      });
    }),
    T('ck-unknown', '곱셈식의 어떤 수 구하기', '심23', (d) => {
      // 어떤 수에 42를 곱했더니 756
      const [p, b] = exactTwo(d);
      return N(`어떤 수에 ${josa(b, '을/를')} 곱하였더니 ${josa(p, '이/가')} 되었다. 어떤 수는?`, p / b, { explain: `어떤 수는 ${josa(p, '을/를')} ${josa(b, '으로/로')} 나눈 몫이다. ${shown(p, b)}`, facts: { calc: [[E(p, '/', b), 0]] } });
    }),
    T('ck-cannot', '나머지가 될 수 없는 수', '①59 ②63 ③64 심41', (d) => {
      const b = divisor(d, 13, 59), list = d.shuffle([0, d.int(2, b - 3), b - 1, b + d.pick([0, 0, 1, 5])]);
      return C(`어떤 수를 ${josa(b, '으로/로')} 나눌 때, 나머지가 될 수 없는 수는?`, list.map(String), list.findIndex((v) => v >= b), {
        explain: `나머지는 나누는 수 ${b}보다 작아야 한다. 나머지가 될 수 있는 수는 0부터 ${b - 1}까지이다.`, facts: { only: { values: list, test: 'atLeast', target: b } }
      });
    }),
    T('ck-max-rest', '나올 수 있는 가장 큰 나머지', '①59 ②63 ③65 심41', (d) => {
      const b = divisor(d, 13, 98);
      return N(`어떤 자연수를 ${josa(b, '으로/로')} 나눌 때, 나올 수 있는 나머지 중에서 가장 큰 수는?`, b - 1, { explain: `나머지는 나누는 수보다 작아야 하므로 가장 큰 나머지는 ${b}보다 1 작은 ${b - 1}이다.`, facts: { calc: [[`${b}-1`, 0]], unseen: [1] } });
    }),
    T('ck-known', '아는 나눗셈으로 나머지 구하기', '③71 심46', (d) => {
      // 864÷27=32 → 870÷27 의 나머지는 6
      const [a, b] = exactTwo(d, (x) => x <= 970), k = d.int(2, 9);
      return N(`${a} ÷ ${b} = ${a / b}이다. 이를 이용하여 ${a + k} ÷ ${b}의 나머지를 구하면?`, k, {
        explain: `${josa(a + k, '은/는')} ${a}보다 ${k} 큰 수이다. ${josa(a, '은/는')} ${josa(b, '으로/로')} 나누어떨어지므로 ${a + k} ÷ ${b}의 나머지는 ${k}이다.`, facts: { calc: [[RX(a + k, b), 0]] }
      });
    })
  ]);

  // ── 몫과 나머지의 비교 ───────────────────────────────────────
  B.addTypes('4-1-3', 'dq', [
    T('dq-compare', '두 나눗셈의 몫의 크기 비교', '①66 ②67 ③55', (d) => {
      // 나누어지는 수가 큰 쪽의 몫이 더 작게 낸다(306÷43 과 219÷23)
      const [[a, b], [c, e]] = d.until(() => [oneDigit(d), oneDigit(d)], ([p, q]) => quot(p[0], p[1]) !== quot(q[0], q[1]) && Math.abs(quot(p[0], p[1]) - quot(q[0], q[1])) <= 2 && (p[0] - q[0]) * (quot(p[0], p[1]) - quot(q[0], q[1])) < 0);
      return C('두 나눗셈의 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, quot(a, b) > quot(c, e) ? 0 : 2, {
        figure: versus(expr(a, '/', b), expr(c, '/', e)), explain: `${shown(a, b)}, ${shown(c, e)}`, facts: { choose: { exprs: [QX(a, b), QX(c, e)], rule: 'compare' } }
      });
    }),
    T('dq-order', '몫이 큰 것부터 차례대로', '①66 ②67 심36', (d) => {
      const rows = d.shuffle(d.until(() => [twoDigit(d), twoDigit(d), exactTwo(d)], (list) => { const v = list.map(([x, y]) => quot(x, y)); return new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 9 && apart(list.map(([x]) => x)) && apart(list.map(([, y]) => y)); }));
      const values = rows.map(([x, y]) => quot(x, y)), right = [0, 1, 2].sort((p, q) => values[q] - values[p]), list = orderList(d, right);
      return C('몫이 큰 것부터 차례대로 기호를 쓴 것은?', list.map((o) => o.map((k) => LABELS[k]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map(([x, y]) => expr(x, '/', y))), explain: said(rows), facts: { choose: { exprs: rows.map(([x, y]) => QX(x, y)), rule: 'descending', orders: list } }
      });
    }),
    T('dq-max', '몫이 가장 큰 것', '③56 심36', (d) => {
      // 나누어지는 수가 가장 큰 식이 답이 되지 않게 낸다
      const rows = d.until(() => [oneDigit(d), oneDigit(d), oneDigit(d)], (list) => { const v = list.map(([x, y]) => quot(x, y)); return new Set(v).size === 3 && apart(list.map(([, y]) => y)) && v.indexOf(Math.max(...v)) !== list.map(([x]) => x).indexOf(Math.max(...list.map(([x]) => x))); });
      const values = rows.map(([x, y]) => quot(x, y));
      return C('몫이 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
        figure: tagged(rows.map(([x, y]) => expr(x, '/', y))), explain: said(rows), facts: { choose: { exprs: rows.map(([x, y]) => QX(x, y)), rule: 'max' } }
      });
    }),
    T('dq-same', '몫이 같은 나눗셈 찾기', '①67 ②65 심34·35', (d) => {
      const [q, x, y] = d.until(() => [d.int(3, 9), d.int(3, 9), d.int(3, 9)], ([p, s, t]) => p !== s && p !== t), [a, b] = withQuot(d, q);
      const rows = d.until(() => d.shuffle([withQuot(d, q), withQuot(d, x), withQuot(d, y)]), (list) => apart(list.concat([[a, b]]).map(([m]) => m)) && apart(list.concat([[a, b]]).map(([, n]) => n)));
      return C(`${a} ÷ ${josa(b, '과/와')} 몫이 같은 것은?`, LABELS.slice(0, 3), rows.findIndex(([m, n]) => quot(m, n) === q), {
        figure: tagged(rows.map(([m, n]) => expr(m, '/', n))), explain: `${shown(a, b)}이다. ${said(rows)}`, facts: { choose: { exprs: rows.map(([m, n]) => QX(m, n)), rule: 'equals', target: q } }
      });
    }),
    T('dq-odd', '몫이 다른 하나 찾기', '①67 ②66 ③56 심35', (d) => {
      const q = d.int(3, 8), other = q + d.pick([-1, 1]);
      const rows = d.until(() => d.shuffle([withQuot(d, q), withQuot(d, q), withQuot(d, q), withQuot(d, other)]), (list) => apart(list.map(([m]) => m)) && apart(list.map(([, n]) => n)));
      return C('몫이 나머지 셋과 다른 것은?', LABELS, rows.findIndex(([m, n]) => quot(m, n) === other), {
        figure: tagged(rows.map(([m, n]) => expr(m, '/', n))), explain: said(rows), facts: { choose: { exprs: rows.map(([m, n]) => QX(m, n)), rule: 'odd' } }
      });
    }),
    T('dq-match', '나눗셈과 몫 짝 짓기', '①67 ③57·60', (d) => {
      const qs = d.shuffle([3, 4, 5, 6, 7, 8, 9]).slice(0, 3), rows = d.until(() => qs.map((q) => withQuot(d, q)), (list) => apart(list.map(([, n]) => n)));
      const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('나눗셈과 그 몫을 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${qs[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(([m, n]) => expr(m, '/', n))), explain: said(rows), facts: { match: { exprs: rows.map(([m, n]) => QX(m, n)), options: list.map((o) => o.map((k) => qs[k])) } }
      });
    }),
    T('dq-ends', '가장 큰 수를 가장 작은 수로 나누기', '①64 ②73 ③61 심30', (d) => {
      const list = d.until(() => [d.int(112, 987), d.int(112, 987), divisor(d, 13, 98), divisor(d, 13, 98)], ([p, q, r, s]) => full(p) && full(q) && Math.abs(p - q) >= 20 && Math.abs(r - s) >= 3 && Math.max(p, q) % Math.min(r, s) !== 0);
      const big = Math.max(...list), small = Math.min(...list);
      return M('가장 큰 수를 가장 작은 수로 나눈 몫과 나머지는?', both(big, small), {
        figure: numbers(d.shuffle(list)), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${shown(big, small)}`, facts: { calc: [[QX(big, small), 0], [RX(big, small), 1]] }
      });
    }),
    T('dq-cards', '수 카드로 만든 두 수의 나눗셈', '①97 ②77 ③76 심51 덧문서', (d) => {
      // 2, 4, 5, 6, 8 → 865÷24
      const [x, y, z, w, v] = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5).sort((p, q) => q - p), ([p, q, r, s, t]) => (p * 100 + q * 10 + r) % (t * 10 + s) !== 0);
      const big = x * 100 + y * 10 + z, small = v * 10 + w, A = `(${x}*100+${y}*10+${z})`, Bx = `(${v}*10+${w})`;
      return M('수 카드 5장을 한 번씩 모두 사용하여 가장 큰 세 자리 수와 가장 작은 두 자리 수를 만들었다. 가장 큰 세 자리 수를 가장 작은 두 자리 수로 나눈 몫과 나머지는?', both(big, small), {
        figure: cards(d.shuffle([x, y, z, w, v])), explain: `가장 큰 세 자리 수는 ${big}이고, 남은 두 장으로 만든 가장 작은 두 자리 수는 ${small}이다. ${shown(big, small)}`,
        facts: { calc: [[`(${A}-${A}%${Bx})/${Bx}`, 0], [`${A}%${Bx}`, 1]], unseen: [100, 10] }
      });
    }),
    T('dq-cards-min', '수 카드로 만든 가장 작은 수와 가장 큰 수의 나눗셈', '심52 덧문서', (d) => {
      // 5, 8, 1, 6, 7 → 156÷87
      const [p, q, r, y, x] = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5).sort((s, t) => s - t), ([s, t, u, v, w]) => (s * 100 + t * 10 + u) % (w * 10 + v) !== 0), small = p * 100 + q * 10 + r, big = x * 10 + y, A = `(${p}*100+${q}*10+${r})`, Bx = `(${x}*10+${y})`;
      return M('수 카드 5장을 한 번씩 모두 사용하여 가장 작은 세 자리 수와 가장 큰 두 자리 수를 만들었다. 가장 작은 세 자리 수를 가장 큰 두 자리 수로 나눈 몫과 나머지는?', both(small, big), {
        figure: cards(d.shuffle([p, q, r, y, x])), explain: `가장 작은 세 자리 수는 ${small}이고, 남은 두 장으로 만든 가장 큰 두 자리 수는 ${big}이다. ${shown(small, big)}`,
        facts: { calc: [[`(${A}-${A}%${Bx})/${Bx}`, 0], [`${A}%${Bx}`, 1]], unseen: [100, 10] }
      });
    }),
    T('dq-talk', '나눗셈에 대하여 바르게 말한 것', '②74', (d) => {
      // 516÷24=21…12: 「나머지는 22이다」「몫은 두 자리 수이다」「몫은 24보다 크다」 가운데 하나만 옳다
      const [a, b] = d.bool() ? twoDigit(d) : oneDigit(d, (x, y, q) => q >= 5), q = quot(a, b), r = a % b, right = d.int(0, 2), isTwo = q >= 10;
      const size = (right === 0) === isTwo ? '두' : '한', toldR = right === 1 ? r : r + d.pick([1, 2, 10]), than = right === 2 ? q - d.int(1, 3) : q + d.int(1, 3);
      const rows = d.shuffle([[`몫은 ${size} 자리 수이다.`, right === 0], [`나머지는 ${toldR}이다.`, right === 1], [`몫은 ${than}보다 크다.`, right === 2]]);
      return C(`${a} ÷ ${b}에 대한 설명으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${shown(a, b)}이다. 몫은 ${q}, 나머지는 ${r}이다.`, facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('dq-exact', '나누어떨어지는 나눗셈 찾기', '②71 심38', (d) => {
      // 끝자리가 0이어도 나누어떨어지지 않는 식(280÷30)을 섞는다
      const hit = d.pick([exactOne, exactTwo])(d), round = d.until(() => [d.int(11, 89) * 10, tensOf(d)], ([x, y]) => x > y * 2 && x % y !== 0);
      const rows = d.shuffle([hit, round].concat(d.until(() => [oneDigit(d), twoDigit(d)], (list) => apart(list.concat([hit, round]).map(([m]) => m)))));
      return C('나누어떨어지는 나눗셈은?', LABELS, rows.indexOf(hit), {
        figure: tagged(rows.map(([m, n]) => expr(m, '/', n))), explain: `${said(rows)}. 나머지가 0인 나눗셈이 나누어떨어지는 나눗셈이다.`, facts: { remainders: rows, want: 'zero' }
      });
    }),
    T('dr-max', '나머지가 가장 큰 것', '①68 ②70 ③59 심37', (d) => {
      const rows = d.shuffle(d.until(() => [oneDigit(d), twoDigit(d), oneDigit(d)], (list) => new Set(list.map(([x, y]) => x % y)).size === 3 && apart(list.map(([, y]) => y))));
      const values = rows.map(([x, y]) => x % y);
      return C('나머지가 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
        figure: tagged(rows.map(([x, y]) => expr(x, '/', y))), explain: said(rows), facts: { choose: { exprs: rows.map(([x, y]) => RX(x, y)), rule: 'max' } }
      });
    }),
    T('dr-same', '나머지가 같은 나눗셈 찾기', '①68 ②69', (d) => {
      // 53÷12 와 나머지가 같은 것: 41÷12
      const b = divisor(d, 12, 29), r = d.int(2, b - 2), qs = d.shuffle([2, 3, 4, 5, 6, 7]).slice(0, 4), a = b * qs[0] + r;
      const rows = d.until(() => d.shuffle([[b * qs[1] + r, b], [b * qs[2] + d.int(1, b - 1), b], [b * qs[3] + d.int(1, b - 1), b]]), (list) => list.filter(([x, y]) => x % y === r).length === 1);
      return C(`${a} ÷ ${josa(b, '과/와')} 나머지가 같은 것은?`, LABELS.slice(0, 3), rows.findIndex(([x, y]) => x % y === r), {
        figure: tagged(rows.map(([x, y]) => expr(x, '/', y))), explain: `${shown(a, b)}이다. ${said(rows)}`, facts: { choose: { exprs: rows.map(([x, y]) => RX(x, y)), rule: 'equals', target: r } }
      });
    }),
    T('dq-range', '□ 안에 들어갈 수 있는 가장 큰 수(나눗셈)', '①69 ②76', (d) => {
      // □ < 784÷56 → 13
      const [a, b] = exactTwo(d);
      return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 큰 수는?', a / b - 1, {
        figure: `<span class="mb-expr">${box()} <i>&lt;</i> ${a} <i>÷</i> ${b}</span>`, explain: `${shown(a, b)}이다. □ 안에는 ${a / b}보다 작은 수가 들어갈 수 있으므로 가장 큰 수는 ${a / b - 1}이다.`, facts: { calc: [[`${a}/${b}-1`, 0]], unseen: [1] }
      });
    }),
    T('dq-chain', '곱하고 나누기를 이어서 하기', '심31', (d) => {
      // 105 ×4 → 420 ÷21 → 20
      const [a, k, b] = d.until(() => [d.int(102, 298), d.int(2, 4), divisor(d, 12, 48)], ([x, y, z]) => x % 10 !== 0 && x * y <= 987 && (x * y) % z === 0 && x * y / z >= 11);
      return M('㉠, ㉡에 알맞은 수는?', labelled([a * k, a * k / b]), {
        figure: chain([a, '×' + k, box(LABELS[0]), '÷' + b, box(LABELS[1])]), explain: `${times(a, k)}, ${shown(a * k, b)}`, facts: { calc: [[E(a, '*', k), 0], [`${a}*${k}/${b}`, 1]] }
      });
    }),
    T('dq-chain2', '이어서 두 번 나누기', '①70', (d) => {
      // 768 ÷16 → 48 ÷12 → 4
      const [b, c, m] = d.until(() => [divisor(d, 12, 32), divisor(d, 11, 24), d.int(2, 6)], ([x, y, z]) => x !== y && x * y * z <= 987), a = b * c * m;
      return M('㉠, ㉡에 알맞은 수는?', labelled([c * m, m]), {
        figure: chain([a, '÷' + b, box(LABELS[0]), '÷' + c, box(LABELS[1])]), explain: `${shown(a, b)}, ${shown(c * m, c)}`, facts: { calc: [[E(a, '/', b), 0], [`${a}/${b}/${c}`, 1]] }
      });
    })
  ]);

  // ── 나눗셈의 어림 ────────────────────────────────────────────
  B.addTypes('4-1-3', 'de', [
    T('de-pick', '어림한 몫 고르기', '①71 ②78 ③80 심40', (d) => {
      // 805÷23 → 800÷20=40 (4, 6, 40, 60 가운데)
      const [a, b, k, e] = d.until(() => { const tens = d.int(2, 9) * 10, est = d.pick([3, 4, 5, 6, 7, 8, 20, 30, 40]); return [tens * est + d.int(-9, 9), tens + d.pick([-3, -2, -1, 1, 2, 3]), tens, est]; },
        ([x, y, , est]) => x >= 81 && x <= 987 && x % 10 !== 0 && Math.abs(x / y - est) < (est >= 10 ? 6 : 1));
      const alt = e >= 10 ? e + (e >= 40 ? -20 : 20) : e + (e >= 6 ? -2 : 2), list = (e >= 10 ? [e / 10, alt / 10, e, alt] : [e, alt, e * 10, alt * 10]).sort((p, q) => p - q);
      return C(`${a} ÷ ${b}의 몫을 어림한 값으로 가장 알맞은 것은?`, list.map(String), list.indexOf(e), {
        explain: `${josa(a, '은/는')} 약 ${k * e}, ${josa(b, '은/는')} 약 ${k}이므로 ${shown(k * e, k)}에 가깝다. 실제로 계산하면 ${shown(a, b)}이다.`, facts: { choose: { exprs: list.map(String), rule: 'nearest', target: a / b } }
      });
    }),
    T('de-round', '어림셈 식 세우기(나눗셈)', '①72 ②80', (d) => {
      // 267 은 약 270 → 270÷30=9
      const [b, q] = d.until(() => [tensOf(d), d.int(3, 9)], ([x, y]) => x * y >= 110 && (x * y) % 100 !== 0), near = b * q, a = near + d.pick([-4, -3, -2, 2, 3, 4]);
      return M(`${a} ÷ ${b}의 몫을 어림셈으로 구하려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([near, q]), {
        figure: lines([`${josa(a, '을/를')} 몇백몇십으로 어림한 수: ${box(LABELS[0])}`, `어림셈으로 구한 몫: ${box(LABELS[0])} ÷ ${b} = ${box(LABELS[1])}`]),
        explain: `${josa(a, '은/는')} ${near}에 가깝다. ${shown(near, b)}`, facts: { calc: [[RT(a), 0], [`${RT(a)}/${b}`, 1]], unseen: [5, 10] }
      });
    }),
    T('de-judge', '어림한 몫과 실제 몫의 크기', '①73', (d) => {
      // 598÷60 을 600÷60=10 으로 어림하면 실제 몫은 9 이다
      const [b, e] = d.until(() => [tensOf(d), d.int(4, 12)], ([x, y]) => x * y >= 120 && x * y <= 960), h = b * e, below = d.bool(), a = h + (below ? -1 : 1) * d.int(2, 8);
      return C(`${a} ÷ ${josa(b, '을/를')} ${h} ÷ ${b} = ${josa(e, '으로/로')} 어림하였다. 실제로 계산한 몫은 어림한 몫과 비교하여 어떠한가?`, ['어림한 몫보다 크다.', '어림한 몫과 같다.', '어림한 몫보다 작다.'], below ? 2 : 1, {
        explain: below ? `${josa(a, '은/는')} ${h}보다 작으므로 ${josa(b, '을/를')} ${e}번 덜어 낼 수 없다. ${shown(a, b)}` : `${josa(a, '은/는')} ${h}보다 크지만 ${b}만큼 크지는 않으므로 몫은 그대로 ${e}이다. ${shown(a, b)}`,
        facts: { choose: { exprs: [QX(a, b), E(h, '/', b)], rule: 'compare' } }
      });
    }),
    T('de-compare', '어림셈으로 두 몫의 크기 비교', '①74', (d) => {
      // 802÷20 과 897÷30 → 800÷20=40, 900÷30=30
      const make = () => { const b = d.int(2, 6) * 10, h = d.until(() => d.int(2, 9) * 100, (v) => v % b === 0); return [h + d.pick([-7, -5, -3, -2, 2, 3, 5, 7]), b, h]; };
      const [[a, b, h1], [c, e, h2]] = d.until(() => [make(), make()], ([p, q]) => p[1] !== q[1] && p[2] / p[1] !== q[2] / q[1] && (p[2] - q[2]) * (p[2] / p[1] - q[2] / q[1]) <= 0 && quot(p[0], p[1]) !== quot(q[0], q[1]) && (quot(p[0], p[1]) > quot(q[0], q[1])) === (p[2] / p[1] > q[2] / q[1]));
      return C('어림셈으로 두 나눗셈의 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, h1 / b > h2 / e ? 0 : 2, {
        figure: versus(expr(a, '/', b), expr(c, '/', e)), explain: `${a} ÷ ${b}의 몫은 약 ${shown(h1, b)}, ${c} ÷ ${e}의 몫은 약 ${shown(h2, e)}이다.`,
        facts: { choose: { exprs: [`${RH(a)}/${b}`, `${RH(c)}/${e}`], rule: 'compare' }, unseen: [50, 100] }
      });
    }),
    T('de-word', '문장제: 어림하여 약 몇(나눗셈)', '①75 ②80 ③82 심40', (d) => {
      // 나무 297그루를 28명이 → 300÷30=10
      const [h, k] = d.until(() => [d.int(2, 9) * 100, d.int(2, 6) * 10], ([x, y]) => x % y === 0), a = h + d.pick([-8, -6, -5, -3, 3, 5, 6, 8]), b = k + d.pick([-2, -1, 1, 2]);
      return N(`나무 ${a}그루를 ${b}명이 똑같이 나누어 심으려고 한다. ${josa(a, '을/를')} 몇백으로, ${josa(b, '을/를')} 몇십으로 어림하여 계산하면 한 명이 약 몇 그루씩 심게 되는가?`, h / k, {
        unit: '그루', lead: '약', explain: `${josa(a, '은/는')} 약 ${h}, ${josa(b, '은/는')} 약 ${k}이다. ${shown(h, k)}`, facts: { calc: [[`${RH(a)}/${RT(b)}`, 0]], unseen: [50, 100, 5, 10] }
      });
    }),
    T('de-which', '상황에 알맞은 어림셈 식 고르기', '③82', (d) => {
      // 496쪽을 하루 19쪽씩 → 500÷20. 틀린 보기: 곱셈으로 여김, 몇백을 반대쪽으로 어림, 몇십을 반대쪽으로 어림
      const wrongs = (h, k, a, b) => [a < h ? h - 100 : h + 100, b < k ? k - 10 : k + 10];
      const [h, k, a, b] = d.until(() => { const x = d.int(3, 9) * 100, y = d.int(2, 5) * 10; return [x, y, x + d.pick([-9, -7, -4, 4, 7, 9]), y + d.pick([-2, -1, 1, 2])]; },
        ([x, y, p, q]) => { const [x2, y2] = wrongs(x, y, p, q), gap = Math.abs(x / y - p / q); return x % y === 0 && gap + 1 < Math.abs(x2 / y - p / q) && gap + 1 < Math.abs(x / y2 - p / q); });
      const [h2, k2] = wrongs(h, k, a, b);
      const rows = d.shuffle([[`${h} ÷ ${k}`, `${h}/${k}`], [`${h} × ${k}`, `${h}*${k}`], [`${h2} ÷ ${k}`, `${h2}/${k}`], [`${h} ÷ ${k2}`, `${h}/${k2}`]]);
      return C(`${a}쪽인 책을 하루에 ${b}쪽씩 읽으려고 한다. 책을 다 읽는 데 며칠쯤 걸리는지 어림셈으로 알아볼 때, 가장 알맞은 식은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${h}/${k}`), {
        explain: `전체 쪽수를 하루에 읽는 쪽수로 나눈다. ${josa(a, '은/는')} 약 ${h}, ${josa(b, '은/는')} 약 ${k}이므로 ${shown(h, k)}에서 약 ${h / k}일이 걸린다.`,
        facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'nearest', target: a / b } }
      });
    }),
    T('de-enough', '어림셈으로 판단하기(나눗셈)', '②94 심16 덧문서', (d) => {
      // 118명이 33명씩 타는 놀이 기구를 3번 운행: 120÷30=4 → 모두 탈 수 없다
      const [h, k, a, b, n] = d.until(() => { const tens = d.int(2, 5) * 10, e = d.int(4, 12); return [tens * e, tens, tens * e + d.pick([-3, -2, 2, 3]), tens + d.pick([-2, -1, 1, 2]), e + d.pick([-2, 2])]; },
        ([x, y, p, q, m]) => x >= 120 && x <= 600 && p % q !== 0 && (quot(p, q) + 1 <= m) === (x / y <= m));
      const e = h / k, can = e <= n, need = quot(a, b) + 1, head = `${h} ÷ ${k} = ${e}이고 ${josa(n, '은/는')} ${e}보다 ${can ? '크므로' : '작으므로'} `;
      const rows = d.shuffle([[`${head}${n}번 만에 모두 탈 수 있다.`, can], [`${head}${n}번 만에 모두 탈 수 없다.`, !can], [`${josa(a, '은/는')} ${josa(h, '과/와')} 다르므로 어림셈으로는 알 수 없다.`, false]]);
      return C(`학생 ${a}명이 한 번에 ${b}명씩 탈 수 있는 놀이 기구를 타려고 한다. 놀이 기구를 ${n}번 운행하여 모두 탈 수 있는지 어림셈으로 알아본 것으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${josa(a, '은/는')} 약 ${h}, ${josa(b, '은/는')} 약 ${k}이므로 ${shown(h, k)}에서 약 ${e}번 운행해야 한다. 실제로는 ${shown(a, b)}이므로 ${need}번 운행해야 한다.`,
        facts: { truth: rows.map((row) => row[1]), want: true }
      });
    })
  ]);

  // ── 나눗셈 문장제 ────────────────────────────────────────────
  B.addTypes('4-1-3', 'dw', [
    T('dw-share', '문장제: 똑같이 나누기', '①87 ②84 ③84 심61', (d) => {
      const [a, b] = exactTwo(d, (x, y) => y <= 38);
      return N(`초콜릿 ${a}개를 ${b}명이 똑같이 나누어 가지려고 한다. 한 명이 가지는 초콜릿은 몇 개인가?`, a / b, { unit: '개', explain: shown(a, b), facts: { calc: [[E(a, '/', b), 0]] } });
    }),
    T('dw-groups', '문장제: 묶음의 수', '①87 ②85 ③84 심61 덧문서', (d) => {
      const [a, b] = exactOne(d);
      return N(`구슬 ${a}개를 한 봉지에 ${b}개씩 담았더니 남는 구슬이 없었다. 구슬을 담은 봉지는 몇 개인가?`, a / b, { unit: '개', explain: shown(a, b), facts: { calc: [[E(a, '/', b), 0]] } });
    }),
    T('dw-both', '문장제: 몇 도막과 남는 길이', '①88 ②86 ③85 심62', (d) => {
      // 627 cm를 40 cm씩 → 15도막, 27 cm
      const [a, b] = tensDiv(d, (x, y, q) => q >= 11 && q % 10 !== 0 && y <= 60);
      return M(`길이가 ${a} cm인 끈을 ${b} cm씩 자르려고 한다. ${b} cm인 끈은 몇 도막이 되고, 남는 끈은 몇 cm인가?`, [{ answer: quot(a, b), unit: '도막' }, { answer: a % b, unit: 'cm' }], { explain: shown(a, b), facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]] } });
    }),
    T('dw-both-share', '문장제: 똑같이 나누어 주고 남는 수', '①88 ②86 ③85 심62', (d) => {
      const [a, b] = twoDigit(d, (x, y) => y <= 38);
      return M(`연필 ${a}자루를 ${b}명에게 똑같이 나누어 주려고 한다. 한 명에게 몇 자루씩 줄 수 있고, 몇 자루가 남는가?`, [{ answer: quot(a, b), unit: '자루' }, { answer: a % b, unit: '자루' }], { explain: shown(a, b), facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]] } });
    }),
    T('dw-drop', '문장제: 가득 채운 묶음의 수', '①89 ②87 ③86 심64', (d) => {
      // 94개를 한 상자에 15개씩 → 6상자까지
      const [a, b] = twoDigit(d, (x, y) => y <= 36);
      return N(`쿠키 ${a}개를 한 상자에 ${b}개씩 담아 팔려고 한다. 가득 채운 상자만 팔 수 있을 때, 팔 수 있는 쿠키는 몇 상자인가?`, quot(a, b), {
        unit: '상자', explain: `${shown(a, b)}이다. 남은 ${a % b}개로는 한 상자를 채울 수 없으므로 ${quot(a, b)}상자를 팔 수 있다.`, facts: { calc: [[QX(a, b), 0]] }
      });
    }),
    T('dw-up', '문장제: 모두 타려면 적어도 몇 번', '①90 ②88 ③88 심65 덧문서', (d) => {
      // 198명이 22명씩 → 나머지가 있으면 한 번 더
      const [a, b] = d.bool() ? twoDigit(d, (x, y) => y <= 45) : oneDigit(d, (x, y) => y <= 48), q = quot(a, b);
      return N(`학생 ${a}명이 한 번에 ${b}명씩 탈 수 있는 케이블카를 타고 산에 오르려고 한다. 학생들이 모두 산에 오르려면 케이블카는 적어도 몇 번 운행해야 하는가?`, q + 1, {
        unit: '번', explain: `${shown(a, b)}이다. ${q}번 운행하면 ${a % b}명이 남으므로 한 번 더 운행해야 한다. ${q} + 1 = ${q + 1}`, facts: { calc: [[`${QX(a, b)}+1`, 0]], unseen: [1] }
      });
    }),
    T('dw-left', '문장제: 남는 수', '①91 ②86 ③87 덧문서', (d) => {
      const [a, b] = twoDigit(d, (x, y) => y <= 36);
      return N(`곶감 ${a}개를 한 상자에 ${b}개씩 담아 포장하려고 한다. 포장하고 남는 곶감은 몇 개인가?`, a % b, { unit: '개', explain: `${shown(a, b)}이다. 상자에 담고 남는 곶감은 나머지와 같다.`, facts: { calc: [[RX(a, b), 0]] } });
    }),
    T('dw-last', '문장제: 며칠 읽고 마지막 날 몇 쪽', '①91 ③89 덧문서', (d) => {
      // 415쪽을 매일 45쪽씩 → 9일, 마지막 날 10쪽
      const [a, b] = oneDigit(d, (x, y, q) => y >= 24 && y <= 65 && q >= 4), q = quot(a, b), r = a % b;
      return M(`${a}쪽인 책을 매일 ${b}쪽씩 읽고, 마지막 날에는 남은 쪽을 모두 읽으려고 한다. ${b}쪽씩 읽는 날은 며칠이고, 마지막 날에 읽는 쪽수는 몇 쪽인가?`, [{ answer: q, unit: '일' }, { answer: r, unit: '쪽' }], {
        explain: `${shown(a, b)}이다. ${b}쪽씩 ${q}일 동안 읽고 마지막 날에 남은 ${r}쪽을 읽는다.`, facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]] }
      });
    }),
    T('dw-unit-m', '문장제: m를 cm로 바꾸어 나누기', '①93 ②89 심63', (d) => {
      // 5 m 철사를 48 cm씩 → 10개, 20 cm
      const [m, b] = d.until(() => [d.int(3, 9), divisor(d, 24, 78)], ([x, y]) => (x * 100) % y !== 0), a = m * 100;
      return M(`길이가 ${m} m인 철사를 ${b} cm씩 잘라 고리를 만들려고 한다. 고리를 몇 개까지 만들 수 있고, 남는 철사는 몇 cm인가?`, [{ answer: quot(a, b), unit: '개' }, { answer: a % b, unit: 'cm' }], {
        explain: `${m} m는 ${a} cm이다. ${shown(a, b)}`, facts: { calc: [[`(${m}*100-${m}*100%${b})/${b}`, 0], [`${m}*100%${b}`, 1]], unseen: [100] }
      });
    }),
    T('dw-unit-time', '문장제: 분을 시간과 분으로', '①93 ③98 심63 덧문서', (d) => {
      // 199분 → 3시간 19분
      const a = d.until(() => d.int(131, 589), (v) => v % 60 !== 0 && v % 10 !== 0);
      return M(`1시간은 60분이다. ${a}분은 몇 시간 몇 분인가?`, [{ answer: quot(a, 60), unit: '시간' }, { answer: a % 60, unit: '분' }], { explain: `${shown(a, 60)}이므로 ${quot(a, 60)}시간 ${a % 60}분이다.`, facts: { calc: [[QX(a, 60), 0], [RX(a, 60), 1]] } });
    }),
    T('dw-weeks', '문장제: 몇 주를 날수로 바꾸어 나누기', '①93 ②89', (d) => {
      // 2주 동안 910 mL → 하루에 65 mL
      const who = d.pick(NAMES), w = d.int(2, 4), q = d.until(() => d.int(12, 46), (v) => v * 7 * w <= 987 && v % 10 !== 0), a = 7 * w * q;
      return N(`${name(who, '은/는')} ${w}주 동안 매일 같은 쪽수씩 책을 읽어 모두 ${a}쪽을 읽었다. ${name(who, '이/가')} 하루에 읽은 책은 몇 쪽인가?`, q, {
        unit: '쪽', explain: `1주일은 7일이므로 ${w}주는 ${times(7, w)}(일)이다. ${shown(a, 7 * w)}`, facts: { calc: [[`${a}/(7*${w})`, 0]], unseen: [7] }
      });
    }),
    T('dw-extra', '문장제: 필요 없는 수가 낀 나눗셈', '①94 덧문서', (d) => {
      // 한 봉지의 무게는 쓰지 않는다
      const [a, b] = exactTwo(d, (x, y) => y <= 36), g = d.int(12, 45) * 10;
      return N(`한 봉지의 무게가 ${g} g인 과자를 한 상자에 ${b}봉지씩 담으려고 한다. 과자 ${a}봉지를 모두 담으면 몇 상자가 되는가?`, a / b, {
        unit: '상자', explain: `봉지의 수를 한 상자에 담는 봉지의 수로 나눈다. 한 봉지의 무게는 쓰지 않는다. ${shown(a, b)}`, facts: { calc: [[E(a, '/', b), 0]] }
      });
    })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addGroup('4-1-3', {
    id: 'hard', title: '실력 문제', standard: DIV,
    types: [
      H('h-zero', '곱에 0이 더 생기는 곱셈', '7, 기본 ②7 ③6', (d) => {
        // 450×20: 45×2=90 에 0을 2개 더 붙여 9000.
        // 틀린 보기: 0을 붙이지 않은 아이(90), 90의 0을 붙인 0으로 친 아이(900), 0을 하나 더 붙인 아이(90000)
        const [a, b] = d.until(() => [d.int(12, 98) * 10, d.int(2, 9) * 10], ([x, y]) => x % 100 !== 0 && ((x / 10) * (y / 10)) % 10 === 0 && ((x / 10) * (y / 10)) % 100 !== 0), m = (a / 10) * (b / 10);
        const list = d.shuffle([m, m * 10, m * 100, m * 1000]);
        return C(`${a} × ${b}의 곱은?`, list.map(String), list.indexOf(m * 100), {
          explain: `${times(a / 10, b / 10)}이다. 곱해지는 수와 곱하는 수에 0이 하나씩 있으므로 ${m} 뒤에 0을 2개 더 붙인다. ${times(a, b)}`, facts: { pick: { expr: E(a, '*', b), options: list } }
        });
      }, { standard: MUL }),
      H('h-rows', '곱셈 세로셈의 둘째 줄이 나타내는 값', '5·9, 기본 ①10 ②17', (d) => {
        const [a, b] = byTwo(d, (x, y) => y >= 20), ones = b % 10, digit = Math.floor(b / 10), first = a * ones, second = a * digit * 10;
        const rows = d.shuffle([
          { text: `${josa(first, '은/는')} ${a} × ${ones}의 값이다.`, claim: [E(a, '*', ones), first] },
          { text: `${josa(second, '은/는')} ${a} × ${digit}의 값이다.`, claim: [E(a, '*', digit), second], bad: true },          // 십의 자리 숫자를 한 자리 수로 읽는 아이는 이 말을 옳다고 여긴다
          { text: `${josa(second, '은/는')} ${a} × ${digit * 10}의 값이다.`, claim: [E(a, '*', digit * 10), second] },
          { text: `${josa(a * b, '은/는')} ${josa(first, '과/와')} ${second}의 합이다.`, claim: [`${first}+${second}`, a * b] }
        ]);
        return C(`${a} × ${josa(b, '을/를')} 세로로 계산하였다. 계산에 대한 설명으로 옳지 않은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.bad), {
          figure: columnSteps(chars(a), '*', chars(b), [chars(first), chars(second)], chars(a * b)),
          explain: `${b}의 십의 자리 숫자 ${josa(digit, '은/는')} ${josa(digit * 10, '을/를')} 나타내므로 둘째 줄은 ${times(a, digit * 10)}이다.`, facts: { claimed: rows.map((row) => row.claim), claimedWant: false }
        });
      }, { standard: MUL }),
      H('h-rest', '나머지가 나누는 수보다 큰 계산', '33, 기본 ②81 ③44', (d) => {
        // 279÷29 = 8 … 47 이라고 한 계산
        const [a, b] = oneDigit(d, (x, y, q) => q >= 4), q = quot(a, b), r = a % b;
        const rows = d.shuffle([
          { text: `${b} × ${q - 1}에 ${josa(r + b, '을/를')} 더하면 ${josa(a, '이/가')} 되므로 바르게 계산하였다.`, ok: false },      // 확인하는 식만 맞으면 된다는 아이
          { text: `나머지 ${josa(r + b, '이/가')} 나누는 수 ${b}보다 크므로 더 나눌 수 있다.`, ok: true },
          { text: `나머지 ${josa(r + b, '이/가')} 몫 ${q - 1}보다 크므로 잘못 계산하였다.`, ok: false },                               // 나머지를 몫과 비교하는 아이
          { text: '나머지가 0이 아니므로 잘못 계산하였다.', ok: false }                                                              // 나머지가 있으면 틀린 계산이라는 아이
        ]);
        return C(`${a} ÷ ${josa(b, '을/를')} 계산하여 몫을 ${q - 1}, 나머지를 ${josa(r + b, '이라고/라고')} 하였다. 이 계산에 대한 설명으로 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
          explain: `나머지는 나누는 수보다 작아야 한다. 나머지 ${r + b}에서 ${josa(b, '을/를')} 한 번 더 뺄 수 있으므로 몫은 ${q}, 나머지는 ${r}이다.`,
          facts: { truth: rows.map((row) => row.ok), want: true, restTalk: { a, b, saidQ: q - 1, saidR: r + b } }
        });
      }),
      H('h-quot-zero', '몫의 일의 자리에 0을 써야 하는 나눗셈', '33, 기본 ①53 ③53', (d) => {
        // 624÷31: 62÷31=2, 남은 4는 31보다 작다 → 몫 20, 나머지 4
        // 틀린 보기: 몫의 0을 빠뜨린 아이, 0을 하나 더 쓴 아이, 나머지가 나누는 수보다 큰데 멈춘 아이
        const [a, b] = division(d, 132, 987, (x, y, q, r) => x >= y * 10 && q % 10 === 0 && r !== 0, 12, 79), q = quot(a, b), r = a % b;
        const rows = d.shuffle([[q, r], [q / 10, r], [q * 10, r], [q - 1, r + b]]);
        return C(`${a} ÷ ${b}의 몫과 나머지를 바르게 구한 것은?`, rows.map(([x, y]) => `몫 ${x}, 나머지 ${y}`), rows.findIndex(([x, y]) => x === q && y === r), {
          explain: `${Math.floor(a / 10)} ÷ ${b}의 몫 ${josa(q / 10, '을/를')} 몫의 십의 자리에 쓴다. 남은 ${josa(r, '은/는')} ${b}보다 작아 더 나눌 수 없으므로 몫의 일의 자리에 0을 쓴다. ${shown(a, b)}`,
          facts: { remainders: rows.map(() => [a, b]), said: rows, want: 'right' }
        });
      }),
      H('h-check', '계산이 맞는지 확인하는 식', '29, 기본 ①57', (d) => {
        const [a, b] = twoDigit(d, (x, y, q, r) => y * r + q !== x && q * r + y !== x && q !== r && q !== y && r >= 2), q = quot(a, b), r = a % b;
        const list = d.shuffle([
          [`${b} × ${q}에 ${josa(r, '을/를')} 더한 값이 ${a}인지 본다.`, `${b}*${q}+${r}`],
          [`${b} × ${q}의 값이 ${a}인지 본다.`, `${b}*${q}`],                                   // 나머지를 더하지 않는 아이
          [`${b} × ${r}에 ${josa(q, '을/를')} 더한 값이 ${a}인지 본다.`, `${b}*${r}+${q}`],      // 몫과 나머지의 자리를 바꾸는 아이
          [`${q} × ${r}에 ${josa(b, '을/를')} 더한 값이 ${a}인지 본다.`, `${q}*${r}+${b}`]       // 세 수를 아무렇게나 엮는 아이
        ]);
        return C(`${a} ÷ ${b} = ${q} … ${josa(r, '이/가')} 맞는지 확인하는 방법으로 옳은 것은?`, list.map((row) => row[0]), list.findIndex((row) => row[1] === `${b}*${q}+${r}`), {
          explain: `나누는 수와 몫의 곱에 나머지를 더하면 나누어지는 수가 되어야 한다. ${times(b, q)}, ${expr(b * q, '+', r, '=', a)}`, facts: { choose: { exprs: list.map((row) => row[1]), rule: 'equals', target: a } }
        });
      }),
      H('h-updown', '나머지를 올리는 경우와 버리는 경우', '64·65, 기본 ①89·90', (d) => {
        const [a, b] = twoDigit(d, (x, y, q, r) => r !== q + 1 && y <= 45), q = quot(a, b), r = a % b, Q = QX(a, b);
        const rows = d.shuffle([
          [`사과 ${a}개를 한 상자에 ${b}개씩 담아 가득 찬 상자만 팔 때, 팔 수 있는 상자의 수`, Q],                 // 남은 사과도 한 상자로 세는 아이가 고른다
          [`사과 ${a}개를 한 상자에 ${b}개씩 남김없이 모두 담을 때, 필요한 상자의 수`, `${Q}+1`],
          [`사과 ${a}개를 ${b}명이 똑같이 나누어 가질 때, 한 명이 가지는 사과의 수`, Q],
          [`사과 ${a}개를 한 상자에 ${b}개씩 담을 때, 상자에 담지 못하고 남는 사과의 수`, RX(a, b)]
        ]);
        return C(`${a} ÷ ${b} = ${q} … ${r}이다. 다음 중 답이 ${josa(q + 1, '이/가')} 되는 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${Q}+1`), {
          explain: `남김없이 모두 담으려면 남은 ${r}개를 담을 상자가 하나 더 있어야 하므로 ${q} + 1 = ${q + 1}(상자)이다. 가득 찬 상자의 수와 한 명이 가지는 수는 ${q}, 남는 수는 ${r}이다.`,
          facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: q + 1 }, unseen: [1] }
        });
      }),
      H('h-tens-rest', '0을 지우고 나눈 나머지', '25, 기본 ②39 ③28', (d) => {
        // 370÷40 을 37÷4=9…1 로 계산: 나머지 1은 10이 1개 남았다는 뜻이다
        const [a, b] = d.until(() => [d.int(11, 89) * 10, tensOf(d)], ([x, y]) => quot(x, y) >= 2 && quot(x, y) <= 9 && x % y !== 0), q = quot(a, b), r = a % b;
        // 틀린 보기: 0을 지우고 나눈 나머지를 그대로 답하는 아이, 몫에 0을 붙이는 아이, 몫에만 0을 붙이는 아이
        const rows = d.shuffle([[q, r], [q, r / 10], [q * 10, r], [q * 10, r / 10]]);
        return C(`${a} ÷ ${josa(b, '을/를')} 계산하려고 두 수의 0을 하나씩 지우고 ${a / 10} ÷ ${josa(b / 10, '을/를')} 계산하였더니 몫은 ${q}, 나머지는 ${josa(r / 10, '으로/로')} 나왔다. ${a} ÷ ${b}의 몫과 나머지를 바르게 구한 것은?`, rows.map(([x, y]) => `몫 ${x}, 나머지 ${y}`), rows.findIndex(([x, y]) => x === q && y === r), {
          explain: `${a / 10} ÷ ${b / 10}의 나머지 ${josa(r / 10, '은/는')} 10이 ${r / 10}개 남았다는 뜻이다. 몫은 그대로 ${q}이고 나머지는 ${r}이다. ${times(b, q)}, ${expr(b * q, '+', r, '=', a)}`,
          facts: { remainders: rows.map(() => [a, b]), said: rows, want: 'right' }
        });
      }),
      H('h-max', '나머지가 가장 클 때의 나누어지는 수', '44, 기본 ①60 ②64', (d) => {
        // □÷25=35…★ 에서 □가 가장 클 때 ★은 24
        // 틀린 보기: 나머지가 나누는 수와 같아도 된다는 아이, 나머지는 한 자리 수라는 아이, 나머지를 몫보다 작은 수로 여기는 아이
        const [b, q] = d.until(() => [divisor(d, 12, 45), d.int(12, 35)], ([x, y]) => x * y + x <= 987 && x !== y && y !== x + 1), base = b * q;
        const list = d.shuffle([base + b - 1, base + b, base + 9, base + q - 1]);
        return C(`□ ÷ ${b} = ${q} … ★에서 □ 안에 들어갈 수 있는 자연수 중 가장 큰 수는? (★은 나머지이다.)`, list.map(String), list.indexOf(base + b - 1), {
          explain: `나머지는 나누는 수 ${b}보다 작아야 하므로 가장 큰 나머지는 ${b - 1}이다. ${times(b, q)}, ${expr(base, '+', b - 1, '=', base + b - 1)}`,
          facts: { pick: { expr: `${b}*${q}+${b}-1`, options: list }, unseen: [1] }
        });
      }),
      H('h-more-quot', '나머지를 더 나누어 몫 바로잡기', '33, 기본 ③54', (d) => {
        // 714÷17 을 몫 39, 나머지 51 로 계산 → 51÷17=3 이므로 몫은 42
        const [a, b] = twoDigit(d, (x, y, q) => q >= 14), q = quot(a, b), r = a % b, k = d.int(2, 3), left = r + k * b;
        return M(`${a} ÷ ${josa(b, '을/를')} 계산하여 몫 ${q - k}, 나머지 ${josa(left, '을/를')} 얻었다. 나머지가 나누는 수보다 크므로 더 나눌 수 있다. 처음부터 다시 계산하지 않고 바르게 구한 몫과 나머지는?`, both(a, b), {
          explain: `나머지 ${josa(left, '을/를')} ${josa(b, '으로/로')} 더 나누면 ${shown(left, b)}이다. 몫은 ${q - k} + ${k} = ${q}, 나머지는 ${r}이다.`,
          facts: { calc: [[`${q - k}+(${left}-${left}%${b})/${b}`, 0], [`${left}%${b}`, 1]], restTalk: { a, b, saidQ: q - k, saidR: left } }
        });
      }),
      H('h-div-rows', '나눗셈 세로셈의 줄이 나타내는 수', '33, 기본 ①48 ③49', (d) => {
        const [a, b] = twoDigit(d, (x, y, q) => q % 10 >= 2 && Math.floor(q / 10) !== q % 10), q = quot(a, b), q1 = Math.floor(q / 10), q0 = q % 10, sub = b * q1, mid = a - sub * 10, low = b * q0;
        const rows = d.shuffle([
          { text: `처음에 뺀 ${josa(sub, '은/는')} 실제로 ${b} × ${q1 * 10} = ${josa(sub * 10, '을/를')} 나타낸다.`, claim: [`${b}*${q1 * 10}`, sub * 10] },
          { text: `${josa(mid, '은/는')} ${a}에서 ${josa(sub * 10, '을/를')} 뺀 값이다.`, claim: [`${a}-${sub * 10}`, mid] },
          { text: `${josa(low, '은/는')} ${b} × ${q0}의 값이다.`, claim: [`${b}*${q0}`, low] },
          { text: `몫 ${q}에서 숫자 ${josa(q1, '이/가')} 나타내는 수는 ${q1}이다.`, claim: [`${q}-${q}%10`, q1], bad: true }          // 자리 숫자를 그대로 값으로 읽는 아이는 이 말을 옳다고 여긴다
        ]);
        return C(`${a} ÷ ${josa(b, '을/를')} 세로로 계산하였다. 계산에 대한 설명으로 옳지 않은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.bad), {
          figure: divSteps(b, a, { steps: true }), explain: `몫 ${q}에서 숫자 ${josa(q1, '은/는')} 십의 자리 숫자이므로 ${josa(q1 * 10, '을/를')} 나타낸다. 그래서 처음에 뺀 수는 ${times(b, q1 * 10)}이다.`,
          facts: { claimed: rows.map((row) => row.claim), claimedWant: false }
        });
      }),
      H('h-sum', '문장제: 두 곱의 합', '56, 기본 ①81 ②29 ③91 덧문서', (d) => {
        const p1 = d.int(31, 98) * 10, n1 = d.int(2, 5) * 10, p2 = d.until(() => d.int(21, 95) * 10, (v) => v !== p1), n2 = two(d);
        return N(`한 권에 ${p1}원인 공책 ${n1}권과 한 자루에 ${p2}원인 연필 ${n2}자루를 샀다. 내야 할 돈은 모두 얼마인가?`, p1 * n1 + p2 * n2, {
          unit: '원', explain: `공책의 값은 ${times(p1, n1)}(원), 연필의 값은 ${times(p2, n2)}(원)이다. ${expr(p1 * n1, '+', p2 * n2, '=', p1 * n1 + p2 * n2)}`, facts: { calc: [[`${p1}*${n1}+${p2}*${n2}`, 0]] }
        });
      }, { standard: MUL }),
      H('h-add-mul', '문장제: 날수를 더한 뒤 곱하기', '56, 기본 ①79 ②29 ③93', (d) => {
        // 매일 170 mL씩 3월(31일)과 4월(30일)
        const who = d.pick(NAMES), [m1, d1, m2, d2] = d.pick([['3월', 31, '4월', 30], ['5월', 31, '6월', 30], ['7월', 31, '8월', 31], ['9월', 30, '10월', 31], ['10월', 31, '11월', 30]]), a = three(d, (x) => x <= 480);
        return N(`${name(who, '은/는')} ${m1}과 ${m2} 두 달 동안 하루도 빠짐없이 매일 우유를 ${a} mL씩 마셨다. ${m1}은 ${d1}일, ${m2}은 ${d2}일까지 있다. 두 달 동안 마신 우유는 모두 몇 mL인가?`, a * (d1 + d2), {
          unit: 'mL', explain: `두 달의 날수는 ${expr(d1, '+', d2, '=', d1 + d2)}(일)이다. ${times(a, d1 + d2)}`, facts: { calc: [[`${a}*(${d1}+${d2})`, 0]] }
        });
      }, { standard: MUL }),
      H('h-change', '문장제: 물건값을 내고 받는 거스름돈', '58, 기본 ①83 ②30 덧문서', (d) => {
        const [p, n] = d.until(() => [d.int(31, 98) * 10, d.int(12, 28)], ([x, y]) => x * y >= 5500 && x * y <= 9700 && y % 10 !== 0);
        return N(`한 개에 ${p}원인 사탕 ${n}개를 사고 10000원을 냈다. 받아야 할 거스름돈은 얼마인가?`, 10000 - p * n, {
          unit: '원', explain: `사탕의 값은 ${times(p, n)}(원)이다. ${expr(10000, '-', p * n, '=', 10000 - p * n)}`, facts: { calc: [[`10000-${p}*${n}`, 0]] }
        });
      }, { standard: MUL }),
      H('h-who', '문장제: 두 곱을 구해 누가 얼마나 더', '57, 기본 ①82 ②31 ③92', (d) => {
        // 하루에 한 횟수가 많은 사람이 날수는 적어서 계산해야 알 수 있다
        const [one, other] = d.shuffle(NAMES).slice(0, 2);
        const [a, m, c, n] = d.until(() => [three(d, (x) => x <= 480), d.int(12, 29), three(d, (x) => x <= 480), d.int(21, 45)], ([x, y, z, w]) => x > z + 20 && y < w && y % 10 !== 0 && w % 10 !== 0 && Math.abs(x * y - z * w) >= 100 && Math.abs(x * y - z * w) <= 1500);
        const values = [a * m, c * n], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
        // 틀린 보기: 하루에 한 횟수가 많은(날수가 많은) 사람을 고르는 아이, 뺄셈에서 받아내림을 잊어 100 크게 답하는 아이
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 100], [1 - winner, gap + 100]]);
        return C(`${name(one, '은/는')} 줄넘기를 매일 ${a}번씩 ${m}일 동안 하였고, ${name(other, '은/는')} 매일 ${c}번씩 ${n}일 동안 하였다. 줄넘기를 누가 몇 번 더 많이 하였는가?`, list.map(([who, k]) => `${[one, other][who]}, ${k}번`), list.findIndex(([who, k]) => who === winner && k === gap), {
          explain: `${name(one, '은/는')} ${times(a, m)}(번), ${name(other, '은/는')} ${times(c, n)}(번) 하였다. ${name([one, other][winner], '이/가')} ${expr(Math.max(...values), '-', Math.min(...values), '=', gap)}(번) 더 많이 하였다.`,
          facts: { who: { values, options: list, exprs: [E(a, '*', m), E(c, '*', n)] } }
        });
      }, { standard: MUL }),
      H('h-three', '문장제: 세 수의 곱', '55, 기본 ①84 ③94', (d) => {
        // 빵 1개에 밀가루 120 g, 한 사람이 3개씩 25명
        const [g, k, n] = d.until(() => [d.int(11, 48) * 10, d.int(2, 4), d.int(12, 32)], ([x, y, z]) => y * z <= 96 && z % 10 !== 0 && (y * z) % 10 !== 0);
        return N(`빵 한 개를 만드는 데 밀가루가 ${g} g 필요하다. 한 사람에게 빵을 ${k}개씩 ${n}명에게 주려고 할 때, 필요한 밀가루는 모두 몇 g인가?`, g * k * n, {
          unit: 'g', explain: `만들어야 하는 빵은 ${times(k, n)}(개)이다. ${times(g, k * n)}`, facts: { calc: [[`${g}*${k}*${n}`, 0]] }
        });
      }, { standard: MUL }),
      H('h-add-div', '문장제: 더한 뒤 나누기', '72, 기본 ②90', (d) => {
        const [x, y, b] = d.until(() => [d.int(121, 489), d.int(121, 489), divisor(d, 13, 48)], ([p, q, z]) => p % 10 !== 0 && q % 10 !== 0 && p !== q && (p + q) % z !== 0), sum = x + y;
        return M(`빨간 구슬 ${x}개와 파란 구슬 ${y}개를 섞어 한 봉지에 ${b}개씩 담으려고 한다. 몇 봉지가 되고, 몇 개가 남는가?`, [{ answer: quot(sum, b), unit: '봉지' }, { answer: sum % b, unit: '개' }], {
          explain: `구슬은 모두 ${expr(x, '+', y, '=', sum)}(개)이다. ${shown(sum, b)}`, facts: { calc: [[`((${x}+${y})-(${x}+${y})%${b})/${b}`, 0], [`(${x}+${y})%${b}`, 1]] }
        });
      }),
      H('h-mul-div', '문장제: 곱한 뒤 똑같이 나누기', '70, 기본 ③95 덧문서', (d) => {
        // 버스 8대에 45명씩 탄 학생을 30모둠으로
        const [k, m, b] = d.until(() => [d.int(4, 9), d.int(24, 48), divisor(d, 12, 36)], ([x, y, z]) => y % 10 !== 0 && z !== y && (x * y) % z === 0 && x * y / z >= 6 && x * y / z !== x);
        return N(`학생들이 버스 ${k}대에 ${m}명씩 나누어 타고 왔다. 이 학생들을 ${b}모둠으로 똑같이 나누면 한 모둠은 몇 명인가?`, k * m / b, {
          unit: '명', explain: `학생은 모두 ${times(m, k)}(명)이다. ${shown(k * m, b)}`, facts: { calc: [[`${m}*${k}/${b}`, 0]] }
        });
      }),
      H('h-mul-div-rest', '문장제: 곱한 뒤 묶어 담기', '71, 기본 ②91', (d) => {
        // 24개씩 28봉지인 초콜릿을 한 상자에 18개씩
        const [m, k, b] = d.until(() => [d.int(12, 28), d.int(12, 36), divisor(d, 13, 29)], ([x, y, z]) => x % 10 !== 0 && y % 10 !== 0 && z !== x && x * y <= 987 && (x * y) % z !== 0), total = m * k;
        return M(`한 봉지에 ${m}개씩 들어 있는 초콜릿이 ${k}봉지 있다. 이 초콜릿을 모두 꺼내 한 상자에 ${b}개씩 담으면 몇 상자가 되고, 몇 개가 남는가?`, [{ answer: quot(total, b), unit: '상자' }, { answer: total % b, unit: '개' }], {
          explain: `초콜릿은 모두 ${times(m, k)}(개)이다. ${shown(total, b)}`, facts: { calc: [[`(${m}*${k}-${m}*${k}%${b})/${b}`, 0], [`${m}*${k}%${b}`, 1]] }
        });
      }),
      H('h-div-mul', '문장제: 나눈 뒤 곱하기', '기본 ③96', (d) => {
        // 초콜릿 748개를 34개씩 포장해 한 봉지 850원에 팔면
        const [a, b] = exactTwo(d, (x, y) => y <= 38), n = a / b, p = d.int(4, 9) * 100 + d.pick([0, 50]);
        return N(`사탕 ${a}개를 한 봉지에 ${b}개씩 모두 담아 한 봉지에 ${p}원씩 받고 팔았다. 사탕을 판 돈은 모두 얼마인가?`, n * p, {
          unit: '원', explain: `사탕을 담은 봉지는 ${shown(a, b)}(봉지)이다. ${times(p, n)}`, facts: { calc: [[`${a}/${b}*${p}`, 0]] }
        });
      }),
      H('h-sub-div', '문장제: 덜어 낸 뒤 나누기', '73, 기본 ③97 덧문서', (d) => {
        // 공이 든 바구니 208 g, 빈 바구니 40 g, 공 한 개 14 g
        const [w, n, basket] = d.until(() => [divisor(d, 14, 58), d.int(11, 24), d.int(8, 25) * 10], ([x, y, z]) => y % 10 !== 0 && x * y + z <= 990), total = w * n + basket;
        return N(`무게가 같은 공이 여러 개 담긴 바구니의 무게를 재었더니 ${total} g이었다. 빈 바구니의 무게는 ${basket} g이고 공 한 개의 무게는 ${w} g이다. 바구니에 담긴 공은 몇 개인가?`, n, {
          unit: '개', explain: `공만의 무게는 ${expr(total, '-', basket, '=', total - basket)}(g)이다. ${shown(total - basket, w)}`, facts: { calc: [[`(${total}-${basket})/${w}`, 0]] }
        });
      }),
      H('h-two-quots', '문장제: 두 몫을 구해 비교하기', '68', (d) => {
        // 만든 수가 적은 기계가 1분 동안에는 더 많이 만든다
        const [m, x, n, y] = d.until(() => [divisor(d, 12, 28), d.int(13, 38), divisor(d, 12, 28), d.int(13, 38)], ([p, q, r, s]) => p < r && q > s && q - s <= 6 && r * s <= 987 && p * q < r * s && r * s - p * q !== q - s);
        const sides = d.shuffle([[m, m * x], [n, n * y]]), values = sides.map(([mins, total]) => total / mins), winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]), far = Math.abs(sides[0][1] - sides[1][1]);
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, far], [1 - winner, far]]);      // 만든 수의 차를 답하는 아이, 만든 수가 많은 쪽을 고르는 아이
        return C(`가 기계는 ${sides[0][0]}분 동안 장난감을 ${sides[0][1]}개 만들고, 나 기계는 ${sides[1][0]}분 동안 ${sides[1][1]}개 만든다. 두 기계는 각각 1분마다 같은 수만큼 만든다. 1분 동안 어느 기계가 몇 개 더 많이 만드는가?`, list.map(([who, k]) => `${['가', '나'][who]} 기계, ${k}개`), list.findIndex(([who, k]) => who === winner && k === gap), {
          explain: `가 기계는 1분에 ${shown(sides[0][1], sides[0][0])}(개), 나 기계는 1분에 ${shown(sides[1][1], sides[1][0])}(개) 만든다. ${['가', '나'][winner]} 기계가 ${expr(Math.max(...values), '-', Math.min(...values), '=', gap)}(개) 더 많이 만든다.`,
          facts: { who: { values, options: list, exprs: sides.map(([mins, total]) => E(total, '/', mins)) } }
        });
      }),
      H('h-two-rests', '문장제: 두 나눗셈에서 남는 수 모으기', '67', (d) => {
        // 흰 공 85개를 14상자에, 노란 공 93개를 15상자에 똑같이 나누어 담고 남은 공
        const [[x, m], [y, n]] = d.until(() => [division(d, 61, 99, (p, q, s, t) => s >= 3 && t !== 0, 12, 24), division(d, 61, 99, (p, q, s, t) => s >= 3 && t !== 0, 12, 24)], ([p, q]) => p[0] !== q[0] && p[1] !== q[1]);
        return N(`흰 공 ${x}개를 상자 ${m}개에, 노란 공 ${y}개를 상자 ${n}개에 각각 똑같이 나누어 담으려고 한다. 한 상자에 될 수 있는 대로 많이 담을 때, 상자에 담지 못하고 남는 공은 모두 몇 개인가?`, x % m + y % n, {
          unit: '개', explain: `${shown(x, m)}, ${shown(y, n)}이다. 남는 공은 ${expr(x % m, '+', y % n, '=', x % m + y % n)}(개)이다.`, facts: { calc: [[`${x}%${m}+${y}%${n}`, 0]] }
        });
      }),
      H('h-more', '문장제: 남김없이 나누려면 더 필요한 수', '66, 기본 ①92 ③90 덧문서', (d) => {
        // 틀린 보기: 나머지를 답하는 아이, 몫을 하나 올려 답하는 아이, 나누는 수를 답하는 아이
        const [a, b] = twoDigit(d, (x, y, q, r) => y <= 48 && y - r >= 2 && y - r !== r && y - r !== q + 1 && r !== q + 1 && y !== q + 1), q = quot(a, b), r = a % b;
        const list = d.shuffle([b - r, r, q + 1, b]);
        return C(`공책 ${a}권을 ${b}명에게 남김없이 똑같이 나누어 주려고 한다. 공책은 적어도 몇 권 더 필요한가?`, list.map((v) => v + '권'), list.indexOf(b - r), {
          explain: `${shown(a, b)}이다. 남은 ${r}권으로는 ${b}명에게 한 권씩 더 줄 수 없다. ${expr(b, '-', r, '=', b - r)}(권)이 더 있으면 한 권씩 더 줄 수 있다.`, facts: { pick: { expr: `${b}-${a}%${b}`, options: list } }
        });
      }),
      H('h-wrong-mul', '곱할 것을 나눈 계산 바로잡기', '24, 기본 ①96 ③69 덧문서', (d) => {
        // 어떤 수에 28을 곱할 것을 28로 나누었더니 몫 15, 나머지 7 → 427×28
        const [b, q, r] = d.until(() => [divisor(d, 12, 39), d.int(4, 24), d.int(1, 30)], ([x, y, z]) => z < x && x * y + z >= 112 && x * y + z <= 498 && (x * y + z) % 10 !== 0), x = b * q + r;
        return N(`어떤 수에 ${josa(b, '을/를')} 곱해야 할 것을 잘못하여 ${josa(b, '으로/로')} 나누었더니 몫이 ${q}, 나머지가 ${josa(r, '이/가')} 되었다. 바르게 계산한 값은?`, x * b, {
          explain: `어떤 수는 ${times(b, q)}, ${expr(b * q, '+', r, '=', x)}에서 ${x}이다. 바르게 계산하면 ${times(x, b)}이다.`, facts: { calc: [[`(${b}*${q}+${r})*${b}`, 0]] }
        });
      }),
      H('h-wrong-div', '잘못 나눈 수 바로잡기', '53, 기본 ②60·61 덧문서', (d) => {
        // 23으로 나눌 것을 32로 나누어 몫 25, 나머지 8 → 808÷23
        const [c, w] = d.shuffle(d.pick([[23, 32], [24, 42], [13, 31], [14, 41], [25, 52], [34, 43], [12, 21], [15, 51], [35, 53], [45, 54], [27, 72], [36, 63]]));
        const [q, r] = d.until(() => [d.int(3, 28), d.int(1, w - 1)], ([x, y]) => w * x + y >= 150 && w * x + y <= 987 && (w * x + y) % c !== 0), X = `(${w}*${q}+${r})`, x = w * q + r;
        return M(`어떤 수를 ${josa(c, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(w, '으로/로')} 나누었더니 몫이 ${q}, 나머지가 ${josa(r, '이/가')} 되었다. 바르게 계산한 몫과 나머지는?`, both(x, c), {
          explain: `어떤 수는 ${times(w, q)}, ${expr(w * q, '+', r, '=', x)}에서 ${x}이다. 바르게 계산하면 ${shown(x, c)}이다.`, facts: { calc: [[`(${X}-${X}%${c})/${c}`, 0], [`${X}%${c}`, 1]] }
        });
      }),
      H('h-wrong-add', '곱할 것을 더한 계산 바로잡기', '24, 기본 ①96 ②32', (d) => {
        // 어떤 수에 32를 곱할 것을 더했더니 455 → 423×32
        const b = two(d), x = three(d), sum = x + b;
        return N(`어떤 수에 ${josa(b, '을/를')} 곱해야 할 것을 잘못하여 더하였더니 ${josa(sum, '이/가')} 되었다. 바르게 계산한 값은?`, x * b, {
          explain: `어떤 수는 ${expr(sum, '-', b, '=', x)}이다. 바르게 계산하면 ${times(x, b)}이다.`, facts: { calc: [[`(${sum}-${b})*${b}`, 0]] }
        });
      }, { standard: MUL }),
      H('h-divisor', '나누는 수 구하기', '43, 기본 ②59 덧문서', (d) => {
        // 910÷□=36…10 → 900÷36=25
        const [a, b] = twoDigit(d, (x, y, q) => q !== y && q >= 12), q = quot(a, b), r = a % b;
        return N('□ 안에 알맞은 수는?', b, {
          figure: `<span class="mb-expr">${a} <i>÷</i> ${box()} <i>=</i> ${q} … ${r}</span>`, explain: `□와 ${q}의 곱에 ${josa(r, '을/를')} 더하면 ${josa(a, '이/가')} 된다. ${expr(a, '-', r, '=', a - r)}, ${shown(a - r, q)}`, facts: { calc: [[`(${a}-${r})/${q}`, 0]] }
        });
      }),
      H('h-est-gap', '문장제: 어림한 값과 실제로 필요한 수', '16, 기본 ②94 덧문서', (d) => {
        // 간장 304 L를 18 L씩: 어림하면 300÷20=15(개)이지만 실제로는 17개
        // 틀린 보기: 어림한 값을 그대로 답하는 아이, 남은 것을 담을 병을 세지 않는 아이
        const [a, b, k, e] = d.until(() => { const tens = d.int(2, 4) * 10, est = d.int(8, 24); return [tens * est + d.pick([2, 3, 4, 6]), tens - d.int(1, 3), tens, est]; }, ([x, y, , est]) => x <= 987 && x % y !== 0 && quot(x, y) >= est + 1);
        const q = quot(a, b), list = d.shuffle([e, q, q + 1, q + 2]);
        return C(`간장 ${a} L를 병 한 개에 ${b} L씩 남김없이 모두 담으려고 한다. ${josa(a, '을/를')} 약 ${k * e}, ${josa(b, '을/를')} 약 ${josa(k, '으로/로')} 어림하면 병은 약 ${e}개이다. 실제로 필요한 병은 적어도 몇 개인가?`, list.map((v) => v + '개'), list.indexOf(q + 1), {
          explain: `${josa(b, '은/는')} ${k}보다 작으므로 병은 어림한 것보다 더 많이 필요하다. ${shown(a, b)}이고 남은 ${a % b} L도 담아야 하므로 ${q} + 1 = ${q + 1}(개)이다.`,
          facts: { pick: { expr: `${QX(a, b)}+1`, options: list }, unseen: [1] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
