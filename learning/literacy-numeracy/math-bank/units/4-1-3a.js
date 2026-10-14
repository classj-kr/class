// 4학년 1학기 3단원 곱셈과 나눗셈 — 단원 틀과 계산 문항(곱셈 두 묶음, 나눗셈 세 묶음).
// 수집해 둔 교과서 10종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 98·95·105꼴, 심화꼴 75꼴)과 꼴 목록을 만들 때 빠졌던
// 문서 뒷부분(덧문서)을 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (곱의 크기 비교·어림·문장제, 나눗셈의 확인·비교·어림·문장제와 실력 문항은 4-1-3b.js 에 있다. 꼴마다의 대조는 수집본 분석 폴더의 싣기_대조표.md 에 있다.)
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다. 계산은 구조마다 따로 싣고 facts.rule 에 그 이름을 단다.
//      곱셈: 곱하는 수가 몇십인가 두 자리 수인가, 올림이 있는가, 곱이 네 자리인가 다섯 자리인가, 곱해지는 수의 가운데·끝에 0이 있는가,
//            곱에 0이 더 생기는가(250×40, 500×80)
//      나눗셈: 나누는 수가 몇십인가 두 자리 수인가, 나누어지는 수가 두 자리인가 세 자리인가, 몫이 한 자리인가 두 자리인가, 나머지가 있는가,
//              어림한 몫을 고쳐야 하는가(148÷25), 십의 자리를 계산하고 남는 수가 한 자리인가 두 자리인가, 몫의 일의 자리가 0인가(624÷31)
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다. 화살표·빈칸에 곱이나 몫을 써넣는 것(기본 ①4 ③12·63 심4의 일부)은 가로셈과 같은 문제이고,
//    곱셈표는 한 번만 실었다(mt-table).
//  - 구조 조건은 수를 뽑을 때 코드로 지키고, 검사는 식(몫 (a-a%b)/b, 나머지 a%b)으로 답을 다시 셈한다.
// 뺀 것과 까닭(꼴 번호는 기본꼴 ①②③, 심화꼴 「심」)
//  - 경우 따지기가 어려움의 대부분: 숫자가 군데군데 빈 세로셈(①15·56 ②20·54 ③14·75 심17·49·50), 수 배열판에서 식 찾기(③17)
//  - 그림이 없어 미룬 것: 같은 수를 몇십 개 놓은 묶음 그림을 보고 곱하기(①3 ②12) — 뽑은 글에 그림이 없어 모양을 알 수 없다.
//    십 모형만 열 개 넘게 늘어놓고 묶는 (몇백몇십)÷(몇십)의 수 모형(①28 ③24의 일부)은 그릴 도구가 없어, 두 자리 수의 수 모형(dt-model)과
//    10원짜리 동전으로 같은 생각을 묻는 문항(dt-coins)으로 실었다.
//  - 서술형: 다른 방법으로 곱하기·나누기(②13·55), 계산이 틀린 까닭 쓰기
//  - 같은 문제: 몫을 보기에서 고르기(①38)는 계산과, 몫의 십의 자리 숫자 고르기(①46 대표)는 몫의 범위 알기와,
//    두 세로셈 가운데 바른 것 고르기(②19 변형)는 잘못 계산한 세로셈 바로잡기와 같다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다. 나머지가 있을 때는 몫과 나머지를 따로 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, LABELS, box, expr, column, columnSteps, chars, lines, tagged, numbers, cards, table, blocks, divColumn, divSteps, longDivision, N, M, C, E } = B.kit;
  const MUL = '4수01-04', DIV = '4수01-07';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const FIVE = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const labelled = (answers) => answers.map((answer, i) => ({ label: LABELS[i], answer }));
  const apart = (list) => new Set(list.map(String)).size === list.length;
  const times = (a, b) => expr(a, '*', b, '=', a * b);

  // ── 곱셈: 수 고르기 ──────────────────────────────────────────
  // (세 자리 수)×(한 자리 수)에서 올림이 일어나는 횟수(일·십·백의 자리 계산)
  const ups = (a, k) => { let carry = 0, n = 0; for (const digit of [a % 10, Math.floor(a / 10) % 10, Math.floor(a / 100)]) { carry = Math.floor((digit * k + carry) / 10); if (carry) n += 1; } return n; };
  // 0이 없고 세 숫자가 모두 같지는 않은 세 자리 수
  const full = (a) => a % 10 !== 0 && Math.floor(a / 10) % 10 !== 0 && !/^(\d)\1\1$/.test(String(a));
  // (세 자리 수)×(몇십): [곱해지는 수, 몇십]. ok 는 (곱해지는 수, 몇, 올림 횟수)를 받는다.
  const byTens = (d, ok) => { const [a, k] = d.until(() => [d.int(112, 987), d.int(2, 9)], ([x, y]) => full(x) && ok(x, y, ups(x, y))); return [a, k * 10]; };
  const midZero = (d) => d.int(1, 9) * 100 + d.int(2, 9), endZero = (d) => d.int(1, 9) * 100 + d.int(1, 9) * 10;
  const TEN = {
    plain: (d) => byTens(d, (a, k, n) => n === 0),                         // 올림이 없다(곱은 네 자리)
    carry: (d) => byTens(d, (a, k, n) => n >= 1 && a * k < 1000),          // 올림이 있고 곱은 네 자리
    five: (d) => byTens(d, (a, k) => a * k >= 1000),                       // 곱이 다섯 자리
    midZero: (d) => [midZero(d), d.int(2, 9) * 10],                        // 가운데 0
    endZero: (d) => d.until(() => [endZero(d), d.int(2, 9) * 10], ([a, b]) => ((a / 10) * (b / 10)) % 10 !== 0),      // (몇백몇십)×(몇십)
    extraZero: (d) => d.until(() => [endZero(d), d.int(2, 9) * 10], ([a, b]) => ((a / 10) * (b / 10)) % 10 === 0),    // 곱에 0이 더 생긴다(250×40)
    hundreds: (d) => d.until(() => [d.int(2, 9) * 100, d.int(2, 9) * 10], ([a, b]) => ((a / 100) * (b / 10)) % 10 !== 0),
    hundredsZero: (d) => d.until(() => [d.int(2, 9) * 100, d.int(2, 9) * 10], ([a, b]) => ((a / 100) * (b / 10)) % 10 === 0)   // 500×80
  };
  // (세 자리 수)×(두 자리 수): 곱하는 수는 몇십이 아니고 일의 자리가 2 이상이며 두 숫자가 다르다. ok 는 (a, b, 올림 횟수)를 받는다.
  const byTwo = (d, ok) => d.until(() => [d.int(112, 987), d.int(12, 98)], ([a, b]) => full(a) && b % 10 >= 2 && b % 10 !== Math.floor(b / 10) && (!ok || ok(a, b, ups(a, b % 10) + ups(a, Math.floor(b / 10)))));
  const TWO = {
    plain: (d) => byTwo(d, (a, b, n) => n === 0 && a * b < 10000),
    four: (d) => byTwo(d, (a, b, n) => n >= 1 && a * b < 10000),
    five: (d) => byTwo(d, (a, b, n) => n >= 2 && a * b >= 10000),
    midZero: (d) => d.until(() => [midZero(d), d.int(12, 98)], ([, b]) => b % 10 >= 2 && b % 10 !== Math.floor(b / 10)),
    endZero: (d) => d.until(() => [endZero(d), d.int(12, 98)], ([, b]) => b % 10 >= 2 && b % 10 !== Math.floor(b / 10))
  };
  const within = (d, lo, hi) => d.until(() => byTwo(d), ([a, b]) => a * b >= lo && a * b <= hi);
  const whyTens = (a, b) => `${times(a, b / 10)}이고, ${a} × ${josa(b, '은/는')} 그 10배인 ${a * b}이다.`;
  const whyZeros = (a, b) => { const z = String(a).length - String(a).replace(/0+$/, '').length + 1; return `${times(a / 10 ** (z - 1), b / 10)}에 0을 ${z}개 붙이면 ${a * b}이다.`; };
  const whyTwo = (a, b) => `${times(a, b % 10)}, ${times(a, b - b % 10)}이고, 두 곱을 더하면 ${a * b}이다.`;
  const across = (pick, rule, why) => (d) => { const [a, b] = pick(d); return N('다음을 계산하시오.', a * b, { figure: expr(a, '*', b, '=', box()), explain: why(a, b), facts: { calc: [[E(a, '*', b), 0]], rule } }); };
  const down = (pick, rule, why) => (d) => { const [a, b] = pick(d); return N('다음을 계산하시오.', a * b, { figure: column(chars(a), '*', chars(b)), explain: why(a, b), facts: { calc: [[E(a, '*', b), 0]], rule } }); };

  // ── 나눗셈: 수 고르기 ────────────────────────────────────────
  const quot = (a, b) => Math.floor(a / b);
  const QX = (a, b) => `(${a}-${a}%${b})/${b}`, RX = (a, b) => `${a}%${b}`;      // 검사가 몫과 나머지를 다시 셈하는 식
  const both = (a, b) => [{ label: '몫', answer: quot(a, b) }, { label: '나머지', answer: a % b }];
  const shown = (a, b) => (a % b === 0 ? expr(a, '/', b, '=', a / b) : `${expr(a, '/', b, '=', quot(a, b))} … ${a % b}`);
  const said = (rows) => rows.map(([a, b], i) => `${LABELS[i]} ${shown(a, b)}`).join(', ');
  const flat = (a, b) => expr(a, '/', b), tall = (a, b) => divColumn(b, a);
  const one = (pick, figure, rule) => (d) => { const [a, b] = pick(d); return N('다음을 계산하시오.', a / b, { figure: figure(a, b), explain: shown(a, b), facts: { calc: [[E(a, '/', b), 0]], rule } }); };
  const two = (pick, figure, rule) => (d) => { const [a, b] = pick(d); return M('다음을 계산하여 몫과 나머지를 구하시오.', both(a, b), { figure: figure(a, b), explain: shown(a, b), facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]], rule } }); };
  // 몇십으로 나누기. ok 는 (a, b, 몫, 나머지)를 받는다.
  const byTen = (d, alo, ahi, ok, klo, khi) => d.until(() => [d.int(alo, ahi), d.int(klo || 2, khi || 9) * 10], ([a, b]) => ok(a, b, quot(a, b), a % b));
  const TD = {
    exact: (d) => d.until(() => { const b = d.int(2, 9) * 10; return [b * d.int(2, 9), b]; }, ([a]) => a >= 120),            // (몇백몇십)÷(몇십)
    small: (d) => d.pick([[60, 20], [80, 20], [60, 30], [90, 30], [80, 40]]),                                                 // (몇십)÷(몇십)
    rest2: (d) => byTen(d, 41, 99, (a, b, q, r) => a % 10 !== 0 && q >= 2 && r !== 0, 2, 4),                                  // (두 자리 수)÷(몇십)
    round: (d) => d.until(() => [d.int(11, 89) * 10, d.int(2, 9) * 10], ([a, b]) => quot(a, b) >= 2 && quot(a, b) <= 9 && a % b !== 0),   // 370÷40
    rest3: (d) => byTen(d, 101, 889, (a, b, q, r) => a % 10 !== 0 && q >= 2 && q <= 9 && r !== 0),
    quot2: (d) => byTen(d, 201, 987, (a, b, q, r) => a % 10 !== 0 && q >= 11 && q % 10 !== 0 && r !== 0, 2, 6)                // 몫이 두 자리
  };
  // 두 자리 수(몇십이 아닌 수)로 나누기
  const byTwoDigits = (d, alo, ahi, ok, blo, bhi) => d.until(() => [d.int(alo, ahi), d.int(blo || 12, bhi || 98)], ([a, b]) => b % 10 !== 0 && ok(a, b, quot(a, b), a % b));
  // 나누어지는 수의 앞 두 자리와 나누는 수의 십의 자리 숫자만 보고 어림한 몫. 실제 몫보다 크면 몫을 줄여 가며 고쳐야 한다.
  const guess = (a, b) => Math.min(9, Math.floor(Math.floor(a / 10) / Math.floor(b / 10)));
  const D1 = {
    exact22: (d) => d.until(() => { const b = d.int(12, 48); return [b * d.int(2, 8), b]; }, ([a, b]) => b % 10 !== 0 && a <= 98 && a % 10 !== 0),
    rest22: (d) => byTwoDigits(d, 31, 99, (a, b, q, r) => q >= 2 && r >= 1 && r <= 9, 12, 45),
    rest22b: (d) => byTwoDigits(d, 41, 99, (a, b, q, r) => q >= 2 && r >= 10, 13, 45),                                         // 나머지가 두 자리 수
    exact32: (d) => d.until(() => { const b = d.int(13, 98); return [b * d.int(3, 9), b]; }, ([a, b]) => b % 10 !== 0 && a >= 104 && full(a)),
    rest32: (d) => byTwoDigits(d, 112, 899, (a, b, q, r) => a < b * 10 && q >= 2 && r !== 0 && full(a) && guess(a, b) === q, 13),
    adjust32: (d) => byTwoDigits(d, 112, 899, (a, b, q, r) => a < b * 10 && q >= 2 && r !== 0 && full(a) && guess(a, b) > q, 13),   // 어림한 몫을 고쳐야 한다
    zero32: (d) => d.until(() => [d.int(1, 8) * 100 + d.int(1, 9), d.int(13, 98)], ([a, b]) => b % 10 !== 0 && a < b * 10 && quot(a, b) >= 2 && a % b !== 0)   // 502÷78
  };
  // 몫이 두 자리인 나눗셈의 두 단계: 십의 자리 몫(q1), 십의 자리를 계산하고 남는 수(left), 일의 자리 몫(q0)
  const stage = (a, b) => { const t = Math.floor(a / 10), q1 = Math.floor(t / b), left = t - q1 * b; return { q1, left, q0: Math.floor((left * 10 + a % 10) / b) }; };
  const byQuot2 = (d, ok) => d.until(() => [d.int(132, 987), d.int(12, 79)], ([a, b]) => b % 10 !== 0 && a >= b * 10 && ok(a % b, stage(a, b), a, b));
  const D2 = {
    exactA: (d) => byQuot2(d, (r, s) => r === 0 && s.q0 >= 1 && s.left <= 9),
    exactB: (d) => byQuot2(d, (r, s) => r === 0 && s.q0 >= 1 && s.left >= 10),
    restA: (d) => byQuot2(d, (r, s) => r !== 0 && s.q0 >= 1 && s.left <= 9),
    restB: (d) => byQuot2(d, (r, s) => r !== 0 && s.q0 >= 1 && s.left >= 10),
    zero: (d) => byQuot2(d, (r, s) => r !== 0 && s.q0 === 0),                                                                  // 몫의 일의 자리가 0
    zeroExact: (d) => d.until(() => { const b = d.int(12, 49); return [b * d.int(2, 7) * 10, b]; }, ([a, b]) => b % 10 !== 0 && a <= 980),
    any: (d) => byQuot2(d, (r, s) => r !== 0 && s.q0 >= 1)
  };
  // 곱셈식 세 개에 곱하는 수: 몫이 꼭 들어 있게 이어진 세 수
  const around = (d, q) => { const from = Math.max(2, q - d.int(0, 2)); return [from, from + 1, from + 2]; };
  const whyMults = (a, b) => { const q = quot(a, b); return `${b} × ${q} = ${josa(b * q, '은/는')} ${a}보다 크지 않고 ${b} × ${q + 1} = ${josa(b * (q + 1), '은/는')} ${a}보다 크므로 몫은 ${q}이다. ${a} − ${b * q} = ${a % b}`; };

  // ── 그림 ─────────────────────────────────────────────────────
  // 나눗셈 세로셈의 줄 옆에 곁말(← 34 × □)을 붙여 그린다. quotient 가 수가 아니면(빈칸) 일의 자리 위에 그대로 적는다.
  // rows: [{ value, sub(빼는 수인가), note }]. 빼는 수는 자릿값대로 일의 자리까지 적는다(43 × 10 = 430).
  function divNoted(divisor, dividend, quotient, rows) {
    const digits = String(dividend).split(''), n = digits.length, hidden = typeof quotient !== 'number';
    const note = (text) => (text ? `<td style="width:auto;padding-left:0.7em;font-size:0.7em;text-align:left;white-space:nowrap;border:0">${text}</td>` : '');
    const line = (value, cls, text) => {
      const s = String(value), from = n - s.length;
      return `<tr${cls ? ` class="${cls}"` : ''}><td></td><td></td>` + digits.map((_, c) => `<td>${c < from ? '' : s[c - from]}</td>`).join('') + note(text) + '</tr>';
    };
    const top = hidden ? `<tr class="mb-ld-quot"><td></td><td></td>${'<td></td>'.repeat(n - 1)}<td class="mb-ld-blank">${quotient}</td></tr>` : line(quotient, 'mb-ld-quot');
    return `<table class="mb-longdiv" role="img" aria-label="나눗셈 세로셈 ${dividend} 나누기 ${divisor}, 몫 ${hidden ? '□' : quotient}, 계산 과정: ${rows.map((row) => row.value).join(', ')}">`
      + top + `<tr class="mb-ld-top"><td>${divisor}</td><td class="mb-ld-hook"></td>${digits.map((x) => `<td>${x}</td>`).join('')}</tr>`
      + rows.map((row) => line(row.value, row.sub ? 'mb-ld-sub' : '', row.note)).join('') + '</table>';
  }

  B.addUnit({
    id: '4-1-3', grade: 4, semester: 1, no: 3, title: '곱셈과 나눗셈', version: 3,
    groups: [
      {
        id: 'mt', title: '(세 자리 수)×(몇십)', standard: MUL,
        types: [
          T('mt-basic', '(몇)×(몇)으로 (몇백)×(몇십) 계산하기', '①1 ②5 ③2', (d) => {
            // 7×3=21 → 700×3=2100 → 700×30=21000
            const [h, k] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => (x * y) % 10 !== 0 && x !== y);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([h * k, h * k * 100, h * k * 1000]), {
              figure: lines([expr(h, '*', k, '=', box(LABELS[0])), expr(h * 100, '*', k, '=', box(LABELS[1])), expr(h * 100, '*', k * 10, '=', box(LABELS[2]))]),
              explain: `${times(h, k)}이다. 곱해지는 수가 100배가 되면 곱도 100배가 되어 ${h * k * 100}이고, 곱하는 수까지 10배가 되면 곱은 1000배가 되어 ${h * k * 1000}이다.`,
              facts: { calc: [[E(h, '*', k), 0], [E(h * 100, '*', k), 1], [E(h * 100, '*', k * 10), 2]] }
            });
          }),
          T('mt-hundreds', '(몇백)×(몇십)', '①6 ②1 ③3', across(TEN.hundreds, 'hundreds', whyZeros)),
          T('mt-hundreds-zero', '곱에 0이 더 생기는 (몇백)×(몇십)', '②1·7', across(TEN.hundredsZero, 'hundredsZero', whyZeros)),
          T('mt-zeros', '곱의 끝에 이어지는 0의 개수', '②7 ③2', (d) => {
            // 640×50=32000: 64×5=320 에 0을 2개 붙인다. 320의 0까지 세면 3개.
            const [a, b] = d.pick([TEN.endZero, TEN.extraZero, TEN.hundreds, TEN.hundredsZero])(d), p = a * b, z = String(p).length - String(p).replace(/0+$/, '').length, m = p / 10 ** z;
            return C(`${a} × ${josa(b, '을/를')} 계산하면 곱의 끝에 0이 몇 개 이어지는가?`, [2, 3, 4, 5].map((k) => k + '개'), z - 2, {
              explain: `${times(a, b)}이다. 곱의 끝에 0이 ${z}개 이어진다.`, facts: { pick: { expr: E(a, '*', b), options: [2, 3, 4, 5].map((k) => m * 10 ** k) } }
            });
          }),
          T('mt-relate', '(몇)을 곱한 값과 (몇십)을 곱한 값', '①2 ②4 ③1 심3', (d) => {
            const [a, b] = byTens(d, (x, y, n) => n >= 1), k = b / 10;
            return M('㉠, ㉡에 알맞은 수는?', labelled([a * k, a * b]), {
              figure: lines([expr(a, '*', k, '=', box(LABELS[0])), expr(a, '*', b, '=', box(LABELS[1]))]), explain: whyTens(a, b), facts: { calc: [[E(a, '*', k), 0], [E(a, '*', b), 1]] }
            });
          }),
          T('mt-times', '곱이 몇 배인지', '②4 ③1', (d) => {
            const [a, b] = byTens(d, (x, y, n) => n >= 1), k = b / 10;
            return N(`${a} × ${b}의 곱은 ${a} × ${k}의 곱의 몇 배인가?`, 10, { unit: '배', explain: `${josa(b, '은/는')} ${k}의 10배이다. 곱하는 수가 10배가 되면 곱도 10배가 된다. ${times(a, k)}, ${times(a, b)}`, facts: { calc: [[`(${a}*${b})/(${a}*${k})`, 0]] } });
          }),
          T('mt-split10', '(몇)을 곱한 뒤 10배 하기', '①2', (d) => {
            // 132×40 = 132×4×10 = 528×10 = 5280
            const [a, b] = TEN.carry(d), k = b / 10;
            return M(`${a} × ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡에 알맞은 수는?`, labelled([a * k, a * b]), {
              figure: lines([expr(a, '*', b, '=', a, '*', k, '*', 10), expr('=', box(LABELS[0]), '*', 10), expr('=', box(LABELS[1]))]),
              explain: `${times(a, k)}이다. ${a * k} × 10 = ${a * b}`, facts: { calc: [[E(a, '*', k), 0], [`${a}*${k}*10`, 1]] }
            });
          }),
          T('mt-plain', '올림이 없는 (세 자리 수)×(몇십)', '①4 ②3 ③4', across(TEN.plain, 'tensPlain', whyTens)),
          T('mt-carry', '올림이 있고 곱이 네 자리 수인 (세 자리 수)×(몇십)', '①4 ②3 ③4', down(TEN.carry, 'tensCarry', whyTens)),
          T('mt-five', '곱이 다섯 자리 수인 (세 자리 수)×(몇십)', '①5 ②3 ③4 심1', across(TEN.five, 'tensFive', whyTens)),
          T('mt-zero-mid', '가운데에 0이 있는 수×(몇십)', '①6 ②3 ③4', down(TEN.midZero, 'tensZeroMid', whyTens)),
          T('mt-zero-end', '(몇백몇십)×(몇십)', '①6 ②2 ③3', across(TEN.endZero, 'tensZeroEnd', whyZeros)),
          T('mt-zero-extra', '곱에 0이 더 생기는 (몇백몇십)×(몇십)', '②2·7', down(TEN.extraZero, 'tensExtraZero', whyZeros)),
          T('mt-of', '어떤 수의 몇십 배', '①5', (d) => {
            const [a, b] = TEN.five(d);
            return N(`${a}의 ${b}배는?`, a * b, { explain: `${a}의 ${b}배는 ${a} × ${b}이다. ${whyTens(a, b)}`, facts: { calc: [[E(a, '*', b), 0]] } });
          }),
          T('mt-place-split', '자릿값으로 갈라 곱하기', '②6', (d) => {
            // 156×20: 100×20, 50×20, 6×20
            const [a, b] = TEN.carry(d), h = Math.floor(a / 100) * 100, t = (Math.floor(a / 10) % 10) * 10, o = a % 10;
            return M(`${josa(a, '을/를')} ${h}, ${t}, ${josa(o, '으로/로')} 갈라 ${a} × ${josa(b, '을/를')} 계산하려고 한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([h * b, t * b, o * b, a * b]), {
              figure: lines([expr(h, '*', b, '=', box(LABELS[0])), expr(t, '*', b, '=', box(LABELS[1])), expr(o, '*', b, '=', box(LABELS[2])), expr(a, '*', b, '=', box(LABELS[3]))]),
              explain: `${times(h, b)}, ${times(t, b)}, ${times(o, b)}이고, 세 곱을 더하면 ${a * b}이다.`, facts: { calc: [[E(h, '*', b), 0], [E(t, '*', b), 1], [E(o, '*', b), 2], [E(a, '*', b), 3]] }
            });
          }),
          T('mt-place', '자릿값으로 말한 수의 몇십 배', '심6', (d) => {
            const [a, b] = byTens(d, (x, y, n) => n >= 1), h = Math.floor(a / 100), t = Math.floor(a / 10) % 10, o = a % 10;
            return N(`100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수의 ${b}배는?`, a * b, { explain: `100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수는 ${a}이다. ${times(a, b)}`, facts: { calc: [[`(100*${h}+10*${t}+${o})*${b}`, 0]] } });
          }),
          T('mt-same', '곱이 같은 식 찾기', '②8 ③20 심8', (d) => {
            // 600×30 = 60×300: 0의 자리만 옮긴 식
            const [h, k] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y);
            const rows = d.shuffle([[h * 10, k * 100], [h * 10, k * 10], [h * 100, k], [h, k * 100]]);
            return C(`계산 결과가 ${h * 100} × ${josa(k * 10, '과/와')} 같은 것은?`, rows.map(([x, y]) => `${x} × ${y}`), rows.findIndex(([x, y]) => x * y === h * k * 1000), {
              explain: `${times(h * 100, k * 10)}이다. ${times(h * 10, k * 100)}이므로 두 곱이 같다. ${h} × ${k} = ${h * k}에 붙이는 0의 개수가 3개로 같다.`,
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: h * k * 1000 } }
            });
          }),
          T('mt-diff', '계산 결과가 다른 곱셈 찾기', '①7 ②8', (d) => {
            // 200×90, 600×30 은 18000, 300×70 은 21000
            const [x1, y1, x2, y2] = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(2, 9), d.int(2, 9)], ([p, q, r, s]) => p * q === r * s && p !== r && p !== s);
            const [x3, y3] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p * q !== x1 * y1 && Math.abs(p * q - x1 * y1) <= 6 && p !== x1 && p !== x2);
            const rows = d.shuffle([[x1, y1], [x2, y2], [x3, y3]].map(([x, y]) => [x * 100, y * 10]));
            return C('계산 결과가 나머지 둘과 다른 것은?', rows.map(([x, y]) => `${x} × ${y}`), rows.findIndex(([x, y]) => x * y === x3 * y3 * 1000), {
              explain: rows.map(([x, y]) => times(x, y)).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'odd' } }
            });
          }),
          T('mt-table', '곱셈표 채우기', '②9 심4', (d) => {
            const b = d.int(3, 8) * 10, list = [TEN.carry(d)[0], endZero(d), d.int(2, 9) * 100];
            return M(`왼쪽 수에 ${josa(b, '을/를')} 곱한 값을 표에 써넣으려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled(list.map((a) => a * b)), {
              figure: table(['수', `× ${b}`], list.map((a, i) => [a, box(LABELS[i])])), explain: list.map((a) => times(a, b)).join(', '), facts: { calc: list.map((a, i) => [E(a, '*', b), i]) }
            });
          }),
          T('mt-inverse', '곱을 보고 곱한 몇십 찾기', '②10 ③5', (d) => {
            const h = d.int(2, 9) * 100, b = d.int(2, 9) * 10;
            return N('□ 안에 알맞은 수는?', b, { figure: expr(h, '*', box(), '=', h * b), explain: `${h / 100} × ${b / 10} = ${(h / 100) * (b / 10)}이고 ${times(h, b)}이다.`, facts: { calc: [[`${h * b}/${h}`, 0]] } });
          }),
          T('mt-fix', '0을 빠뜨린 세로셈 바로잡기', '③6', (d) => {
            // 286×80 을 2288 로 계산한 것
            const [a, b] = TEN.carry(d), k = b / 10;
            return N(`${a} × ${josa(b, '을/를')} 다음과 같이 잘못 계산하였다. 바르게 계산한 값은?`, a * b, {
              figure: column(chars(a), '*', chars(b), chars(a * k)), explain: `${josa(b, '은/는')} ${k}의 10배이므로 곱은 ${a} × ${k} = ${a * k}의 10배이다. 곱의 일의 자리에 0을 써서 ${josa(a * b, '으로/로')} 고친다.`, facts: { calc: [[E(a, '*', b), 0]] }
            });
          }),
          T('mt-where', '(몇)을 곱한 값을 쓰는 자리', '③2 심3', (d) => {
            // 527×7=3689. 527×70 을 세로로 계산할 때 9를 쓰는 칸
            const [a, b] = byTens(d, (x, y, n) => n >= 1 && (x * y) % 10 !== 0), k = b / 10, len = String(a * b).length, tags = FIVE.slice(0, len);
            return C(`${a} × ${k} = ${a * k}이다. ${a} × ${josa(b, '을/를')} 세로로 계산할 때, ${a * k}의 일의 자리 숫자 ${josa((a * k) % 10, '을/를')} 써야 하는 칸은?`, tags, len - 2, {
              figure: column(chars(a), '*', chars(b), tags.map((tag) => box(tag))),
              explain: `${a} × ${josa(b, '은/는')} ${a} × ${k}의 10배이다. ${josa(a * k, '을/를')} 한 자리씩 왼쪽으로 옮겨 쓰고 일의 자리에 0을 쓰므로, ${a * k}의 일의 자리 숫자는 십의 자리 칸에 쓴다.`,
              facts: { truth: tags.map((tag, i) => i === len - 2), want: true }
            });
          }),
          T('mt-wrong-eq', '0의 개수가 틀린 식 고르기', '②22 ③101 심7', (d) => {
            const rows = d.until(() => [TEN.endZero(d), TEN.extraZero(d), TEN.carry(d), TEN.hundreds(d)], (list) => apart(list.map(([a]) => a))), bad = d.int(0, 3);
            const told = rows.map(([a, b], i) => (i !== bad ? a * b : d.bool() ? a * b / 10 : a * b * 10)), order = d.shuffle([0, 1, 2, 3]);
            return C('계산이 잘못된 것은?', order.map((i) => `${rows[i][0]} × ${rows[i][1]} = ${told[i]}`), order.indexOf(bad), {
              explain: `${times(rows[bad][0], rows[bad][1])}이다. (몇십)을 곱할 때에는 (몇)을 곱한 값에 0을 하나 더 붙인다.`,
              facts: { claimed: order.map((i) => [E(rows[i][0], '*', rows[i][1]), told[i]]), claimedWant: false, rule: 'wrongTens' }
            });
          })
        ]
      },
      {
        id: 'mm', title: '(세 자리 수)×(두 자리 수)', standard: MUL,
        types: [
          T('mm-split', '몇십과 몇으로 갈라 곱하고 더하기', '①8 ②18 ③7 심5', (d) => {
            const [a, b] = TWO.four(d), ones = b % 10, tens = b - ones;
            return M(`${a} × ${josa(b, '을/를')} 몇십과 몇으로 갈라 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([a * tens, a * ones, a * b]), {
              figure: lines([expr(a, '*', tens, '=', box(LABELS[0])), expr(a, '*', ones, '=', box(LABELS[1])), expr(a, '*', b, '=', box(LABELS[2]))]),
              explain: `${times(a, tens)}, ${times(a, ones)}이다. ${josa(b, '은/는')} ${josa(tens, '과/와')} ${ones}의 합이므로 두 곱을 더하면 ${a * b}이다.`, facts: { calc: [[E(a, '*', tens), 0], [E(a, '*', ones), 1], [E(a, '*', b), 2]] }
            });
          }),
          T('mm-use', '주어진 곱을 이용하여 계산하기', '심5', (d) => {
            // 549×4=2196 → 549×44 = 21960 + 2196
            const k = d.int(2, 8), a = d.until(() => d.int(112, 987), (x) => full(x) && ups(x, k) >= 1), b = k * 11;
            return N(`${a} × ${k} = ${josa(a * k, '을/를')} 이용하여 ${a} × ${josa(b, '을/를')} 계산하면?`, a * b, { explain: `${a} × ${k * 10} = ${a * k * 10}이다. ${a * k * 10} + ${a * k} = ${a * b}`, facts: { calc: [[E(a, '*', b), 0]] } });
          }),
          T('mm-steps', '자리별 곱을 두 줄로 적는 세로셈', '①9 ②17 ③8', (d) => {
            // 164×28 → 1312, 3280, 4592
            const [a, b] = TWO.four(d), ones = b % 10, tens = b - ones;
            return M(`${a} × ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([a * ones, a * tens, a * b]), {
              figure: columnSteps(chars(a), '*', chars(b), [box(LABELS[0]), box(LABELS[1])], box(LABELS[2]), [`← ${a} × ${ones}`, `← ${a} × ${tens}`]),
              explain: whyTwo(a, b), facts: { calc: [[E(a, '*', ones), 0], [E(a, '*', tens), 1], [E(a, '*', b), 2]] }
            });
          }),
          T('mm-steps-which', '세로셈의 한 줄이 어떤 두 수의 곱인지', '①9 ②17', (d) => {
            const [a, b] = TWO.four(d), ones = b % 10, digit = Math.floor(b / 10), tens = digit * 10;
            const list = d.shuffle([[a, tens], [a, digit], [a, ones], [a, ones * 10]]);
            return C(`${a} × ${josa(b, '을/를')} 세로로 계산한 것이다. 계산 과정에 적힌 ${josa(a * tens, '은/는')} 어떤 두 수의 곱인가?`, list.map(([x, y]) => `${x} × ${y}`), list.findIndex(([, y]) => y === tens), {
              figure: columnSteps(chars(a), '*', chars(b), [chars(a * ones), chars(a * tens)], chars(a * b)),
              explain: `${b}의 십의 자리 숫자 ${josa(digit, '은/는')} ${josa(tens, '을/를')} 나타낸다. ${times(a, tens)}`, facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: a * tens } }
            });
          }),
          T('mm-means', '세로셈의 둘째 줄이 실제로 나타내는 값', '①10', (d) => {
            // 807×35 의 둘째 줄 2421 은 24210
            const [a, b] = d.until(() => TWO.five(d), ([, y]) => y >= 20), ones = b % 10, digit = Math.floor(b / 10);
            return N(`${a} × ${josa(b, '을/를')} 세로로 계산한 것이다. 계산 과정의 둘째 줄에 적힌 ${josa(a * digit, '이/가')} 실제로 나타내는 값은?`, a * digit * 10, {
              figure: columnSteps(chars(a), '*', chars(b), [chars(a * ones), chars(a * digit).concat([''])], chars(a * b)),
              explain: `둘째 줄은 ${a} × ${digit * 10}의 값이다. 일의 자리의 0을 쓰지 않은 것이므로 실제로는 ${josa(a * digit * 10, '을/를')} 나타낸다.`, facts: { calc: [[`${a}*(${b}-${b}%10)`, 0]], unseen: [10] }
            });
          }),
          T('mm-plain', '올림이 없는 (세 자리 수)×(두 자리 수)', '①11 ③9', across(TWO.plain, 'twoPlain', whyTwo)),
          T('mm-four', '올림이 있고 곱이 네 자리 수인 계산', '①11 ②14 ③9', down(TWO.four, 'twoFour', whyTwo)),
          T('mm-five', '곱이 다섯 자리 수인 계산', '①12 ②15 ③10 심2', down(TWO.five, 'twoFive', whyTwo)),
          T('mm-zero-mid', '가운데에 0이 있는 수×(두 자리 수)', '①13 ②16 ③11', across(TWO.midZero, 'twoZeroMid', whyTwo)),
          T('mm-zero-end', '(몇백몇십)×(두 자리 수)', '①13 ②16 ③11', down(TWO.endZero, 'twoZeroEnd', whyTwo)),
          T('mm-product', '두 수의 곱', '①12 ②14 ③12', (d) => {
            const [a, b] = TWO.four(d);
            return N(`${josa(a, '과/와')} ${b}의 곱은?`, a * b, { explain: `두 수의 곱은 두 수를 곱한 값이다. ${whyTwo(a, b)}`, facts: { calc: [[E(a, '*', b), 0]] } });
          }),
          T('mm-fix', '자리를 잘못 맞춘 세로셈 바로잡기', '①14 ②19 ③13 심9', (d) => {
            // 317×24 를 1268+634=1902 로 계산한 것(십의 자리 곱을 일의 자리에 맞춰 적음)
            const [a, b] = d.until(() => byTwo(d), ([, y]) => y >= 20), ones = b % 10, digit = Math.floor(b / 10), wrong = a * ones + a * digit;
            return N(`다음은 ${a} × ${josa(b, '을/를')} 잘못 계산한 것이다. 바르게 계산한 값은?`, a * b, {
              figure: columnSteps(chars(a), '*', chars(b), [chars(a * ones), chars(a * digit)], chars(wrong)),
              explain: `${a} × ${digit}의 값 ${josa(a * digit, '은/는')} 실제로 ${a} × ${digit * 10} = ${a * digit * 10}이므로 한 자리 왼쪽으로 옮겨 써야 한다. ${a * ones} + ${a * digit * 10} = ${a * b}`, facts: { calc: [[E(a, '*', b), 0]] }
            });
          }),
          T('mm-match', '식과 계산 결과 짝 짓기', '①16 ②21 ③20 심8', (d) => {
            const first = within(d, 11000, 40000), base = first[0] * first[1];
            const pairs = [first].concat(d.until(() => [within(d, base - 1500, base + 1500), within(d, base - 1500, base + 1500)], (list) => new Set(list.concat([first]).map(([x, y]) => x * y)).size === 3 && apart(list.concat([first]).map(([x]) => x))));
            const values = pairs.map(([x, y]) => x * y), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(pairs.map(([x, y]) => expr(x, '*', y))), explain: pairs.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { match: { exprs: pairs.map(([x, y]) => E(x, '*', y)), options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('mm-wrong-eq', '계산이 잘못된 식 고르기', '②22', (d) => {
            const rows = d.until(() => [TWO.four(d), TWO.four(d), TWO.five(d), TWO.endZero(d)], (list) => apart(list.map(([a]) => a))), bad = d.int(0, 3);
            const told = rows.map(([a, b], i) => a * b + (i === bad ? d.pick([-100, 100, -80, 80]) : 0)), order = d.shuffle([0, 1, 2, 3]);
            return C('계산이 잘못된 것은?', order.map((i) => `${rows[i][0]} × ${rows[i][1]} = ${told[i]}`), order.indexOf(bad), {
              explain: `${whyTwo(rows[bad][0], rows[bad][1])} 나머지 식은 바르게 계산하였다.`,
              facts: { claimed: order.map((i) => [E(rows[i][0], '*', rows[i][1]), told[i]]), claimedWant: false, rule: 'wrongTwo' }
            });
          }),
          T('mm-five-digit', '곱이 다섯 자리 수인 곱셈 고르기', '②24 심12', (d) => {
            const hit = within(d, 10000, 13000);
            const rows = d.shuffle([hit].concat(d.until(() => [within(d, 7000, 9990), within(d, 7000, 9990), within(d, 7000, 9990)], (list) => apart(list.concat([hit]).map(([a]) => a)))));
            return C('곱이 다섯 자리 수인 것은?', LABELS, rows.indexOf(hit), {
              figure: tagged(rows.map(([a, b]) => expr(a, '*', b))), explain: `${rows.map(([a, b], i) => `${LABELS[i]} ${times(a, b)}`).join(', ')}. 곱이 10000이거나 10000보다 크면 다섯 자리 수이다.`,
              facts: { choose: { exprs: rows.map(([a, b]) => E(a, '*', b)), rule: 'onlyAbove', target: 9999 } }
            });
          }),
          T('mm-ends', '가장 큰 수와 가장 작은 수의 곱', '①19 ②25 ③15 심22', (d) => {
            const list = d.until(() => [d.int(112, 987), d.int(112, 987), d.int(12, 98), d.int(12, 98)], ([p, q, r, s]) => full(p) && full(q) && r % 10 !== 0 && s % 10 !== 0 && Math.abs(p - q) >= 20 && Math.abs(r - s) >= 3);
            const big = Math.max(...list), small = Math.min(...list);
            return N('가장 큰 수와 가장 작은 수의 곱은?', big * small, { figure: numbers(d.shuffle(list)), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${times(big, small)}`, facts: { calc: [[E(big, '*', small), 0]] } });
          }),
          T('mm-cards', '수 카드로 만든 두 수의 곱', '①27 ②26 ③16 심21', (d) => {
            // 3, 7, 2, 8, 9 → 987×23
            const [x, y, z, w, v] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5).sort((p, q) => q - p), big = x * 100 + y * 10 + z, small = v * 10 + w;
            return N('수 카드 5장을 한 번씩 모두 사용하여 가장 큰 세 자리 수와 가장 작은 두 자리 수를 만들었다. 만든 두 수의 곱은?', big * small, {
              figure: cards(d.shuffle([x, y, z, w, v])), explain: `가장 큰 세 자리 수는 ${big}이고, 남은 두 장으로 만든 가장 작은 두 자리 수는 ${small}이다. ${times(big, small)}`,
              facts: { calc: [[`(${x}*100+${y}*10+${z})*(${v}*10+${w})`, 0]], unseen: [100, 10] }
            });
          }),
          T('mm-cards-zero', '0이 있는 수 카드로 만든 두 수의 곱', '②26 심21', (d) => {
            // 7, 0, 5, 1, 6 → 105×76
            const [p, q, y, x] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((s, t) => s - t), small = p * 100 + q, big = x * 10 + y;
            return N('수 카드 5장을 한 번씩 모두 사용하여 가장 작은 세 자리 수와 가장 큰 두 자리 수를 만들었다. 만든 두 수의 곱은?', small * big, {
              figure: cards(d.shuffle([0, p, q, y, x])), explain: `0은 백의 자리에 올 수 없으므로 가장 작은 세 자리 수는 ${small}이다. 남은 두 장으로 만든 가장 큰 두 자리 수는 ${big}이다. ${times(small, big)}`,
              facts: { calc: [[`(${p}*100+${q})*(${x}*10+${y})`, 0]], unseen: [100, 10] }
            });
          })
        ]
      },
      { id: 'mc', title: '곱의 크기 비교', standard: MUL, types: [] },
      { id: 'me', title: '곱셈의 어림', standard: MUL, types: [] },
      { id: 'mw', title: '곱셈 문장제', standard: MUL, types: [] },
      {
        id: 'dt', title: '몇십으로 나누기', standard: DIV,
        types: [
          T('dt-drop', '0을 하나씩 지운 나눗셈', '①29 ②48 ③25', (d) => {
            // 56÷8=7 → 560÷80=7
            const k = d.int(2, 9), q = d.until(() => d.int(2, 9), (v) => v * k >= 12 && v !== k);
            return M('㉠, ㉡에 알맞은 수는?', labelled([q, q]), {
              figure: lines([expr(q * k, '/', k, '=', box(LABELS[0])), expr(q * k * 10, '/', k * 10, '=', box(LABELS[1]))]),
              explain: `${josa(q * k * 10, '과/와')} ${josa(k * 10, '은/는')} 각각 ${josa(q * k, '과/와')} ${k}의 10배이다. 나누어지는 수와 나누는 수가 모두 10배가 되면 몫은 같다.`,
              facts: { calc: [[E(q * k, '/', k), 0], [E(q * k * 10, '/', k * 10), 1]] }
            });
          }),
          T('dt-same', '0을 지워 몫이 같은 나눗셈 찾기', '②48', (d) => {
            // 63÷9 와 몫이 같은 것: 630÷90 (630÷9 는 70)
            const k = d.int(3, 9), [q, other] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y);
            const rows = d.shuffle([[q * k * 10, k * 10], [q * k * 10, k], [other * k * 10, k * 10], [other * k, k]]);
            return C(`${q * k} ÷ ${josa(k, '과/와')} 몫이 같은 것은?`, rows.map(([x, y]) => `${x} ÷ ${y}`), rows.findIndex(([x, y]) => x === q * k * 10 && y === k * 10), {
              explain: `${shown(q * k, k)}이다. 나누어지는 수와 나누는 수가 모두 10배가 된 ${q * k * 10} ÷ ${k * 10}의 몫도 ${q}이다. ${shown(q * k * 10, k)}`,
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '/', y)), rule: 'equals', target: q } }
            });
          }),
          T('dt-coins', '10원짜리 동전으로 알아보기', '①28', (d) => {
            // 160원은 10원짜리 16개, 20원씩 묶으면 8묶음
            const [a, b] = TD.exact(d);
            return M(`10원짜리 동전으로 ${a}원을 만들면 동전은 ${box(LABELS[0])}개이다. 이 동전을 ${b}원씩 묶으면 ${box(LABELS[1])}묶음이 된다. ㉠, ㉡에 알맞은 수는?`, labelled([a / 10, a / b]), {
              explain: `${josa(a, '은/는')} 10이 ${a / 10}개인 수이다. 동전을 ${b / 10}개씩 묶으면 ${a / 10} ÷ ${b / 10} = ${a / b}(묶음)이므로 ${shown(a, b)}이다.`, facts: { calc: [[`${a}/10`, 0], [E(a, '/', b), 1]] }
            });
          }),
          T('dt-model', '수 모형을 몇십씩 묶기', '①28 ②47 ③24', (d) => {
            // 82÷20: 십 모형을 2개씩 묶으면 4묶음, 2가 남는다
            const [a, b] = TD.rest2(d), t = Math.floor(a / 10), o = a % 10, A = `(${t}*10+${o})`;
            return M(`수 모형이 나타내는 수를 ${b}씩 묶으려고 한다. 몇 묶음이 되고, 얼마가 남는가?`, [{ answer: quot(a, b), unit: '묶음' }, { label: '남는 수', answer: a % b }], {
              figure: blocks(a), explain: `수 모형이 나타내는 수는 ${a}이다. 십 모형을 ${b / 10}개씩 묶으면 ${quot(a, b)}묶음이 되고 ${josa(a % b, '이/가')} 남는다. ${shown(a, b)}`,
              facts: { calc: [[`(${A}-${A}%${b})/${b}`, 0], [`${A}%${b}`, 1]], unseen: [10] }
            });
          }),
          T('dt-table', '곱셈표로 몫 구하기', '①30 ③26', (d) => {
            const [a, b] = d.until(() => TD.exact(d), ([x, y]) => x / y >= 3), q = a / b;
            return M(`표를 완성하고 ${a} ÷ ${b}의 몫을 구하려고 한다. ㉠에 알맞은 수와 ${a} ÷ ${b}의 몫은?`, [{ label: LABELS[0], answer: b * (q + 1) }, { label: '몫', answer: q }], {
              figure: table(['곱셈식', '곱'], [[`${b} × ${q - 1}`, b * (q - 1)], [`${b} × ${q}`, a], [`${b} × ${q + 1}`, box(LABELS[0])]]),
              explain: `${times(b, q + 1)}이다. ${times(b, q)}이므로 ${shown(a, b)}이다.`, facts: { calc: [[E(b, '*', q + 1), 0], [E(a, '/', b), 1]] }
            });
          }),
          T('dt-exact', '(몇백몇십)÷(몇십)', '①31 ②37 ③27 심25', one(TD.exact, flat, 'tensExact')),
          T('dt-small', '(몇십)÷(몇십)', '①31 ②37', one(TD.small, flat, 'tensSmall')),
          T('dt-rest2', '(두 자리 수)÷(몇십)', '①33 ②38 ③30', two(TD.rest2, flat, 'tensRest2')),
          T('dt-round', '나머지가 있는 (몇백몇십)÷(몇십)', '②39 ③28', two(TD.round, tall, 'tensRound')),
          T('dt-rest3', '몫이 한 자리 수인 (세 자리 수)÷(몇십)', '①33 ②39 ③29 심25', two(TD.rest3, tall, 'tensRest3')),
          T('dt-quot2', '몫이 두 자리 수인 (세 자리 수)÷(몇십)', '①34 ③29', two(TD.quot2, flat, 'tensQuot2')),
          T('dt-mults', '곱셈식을 보고 몫과 나머지 구하기(몇십으로 나누기)', '①32', (d) => {
            // 50×6=300, 50×7=350, 50×8=400 을 보고 372÷50
            const [a, b] = TD.rest3(d);
            return M(`곱셈식을 보고 ${a} ÷ ${b}의 몫과 나머지를 구하시오.`, both(a, b), { figure: lines(around(d, quot(a, b)).map((v) => times(b, v))), explain: whyMults(a, b), facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]], rule: 'multsTens' } });
          }),
          T('dt-digit', '나누는 수의 빈 숫자', '③31', (d) => {
            // 160÷□0=2
            const [a, b] = TD.exact(d), q = a / b;
            return N('□ 안에 알맞은 숫자는?', b / 10, { figure: `<span class="mb-expr">${a} <i>÷</i> ${box()}0 <i>=</i> ${q}</span>`, explain: `${a / 10} ÷ ${q} = ${b / 10}이므로 ${shown(a, b)}이다.`, facts: { calc: [[`${a}/${q}/10`, 0]], unseen: [10] } });
          }),
          T('dt-fix', '몫을 크게 어림한 세로셈 바로잡기', '③32', (d) => {
            // 580÷70 의 몫을 9로 쓰고 630 을 빼려고 한 것
            const [a, b] = d.pick([TD.round, TD.rest3])(d), q = quot(a, b);
            return M(`${a} ÷ ${josa(b, '을/를')} 계산하면서 몫을 ${josa(q + 1, '으로/로')} 어림하였더니 뺄 수 없었다. 바르게 계산한 몫과 나머지는?`, both(a, b), {
              figure: divSteps(b, a, { steps: true, given: { quot: q + 1, rows: [{ value: b * (q + 1), end: 2, sub: true }] } }),
              explain: `${b} × ${q + 1} = ${josa(b * (q + 1), '은/는')} ${a}보다 커서 뺄 수 없으므로 몫을 1 작게 한다. ${shown(a, b)}`, facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]] }
            });
          }),
          T('dt-wrong-eq', '몫의 자리가 틀린 식 고르기', '②37', (d) => {
            // 720÷80=90 처럼 0을 지우지 않고 몫에 붙인 것
            const rows = d.until(() => [TD.exact(d), TD.exact(d), TD.exact(d), TD.exact(d)], (list) => apart(list.map(([a, b]) => a + '÷' + b))), bad = d.int(0, 3);
            return C('계산이 잘못된 것은?', rows.map(([a, b], i) => `${a} ÷ ${b} = ${i === bad ? a / b * 10 : a / b}`), bad, {
              explain: `${shown(rows[bad][0], rows[bad][1])}이다. 나누어지는 수와 나누는 수의 0을 하나씩 지우고 나눈 몫과 같다.`,
              facts: { claimed: rows.map(([a, b], i) => [E(a, '/', b), i === bad ? a / b * 10 : a / b]), claimedWant: false, rule: 'wrongDivTens' }
            });
          })
        ]
      },
      {
        id: 'd1', title: '몫이 한 자리 수인 나눗셈', standard: DIV,
        types: [
          T('d1-mults22', '곱셈식을 보고 몫과 나머지 구하기(두 자리 수로 나누기)', '①35 ②49 ③33', (d) => {
            // 13×5=65, 13×6=78, 13×7=91 을 보고 80÷13
            const [a, b] = d.pick([D1.rest22, D1.rest22b])(d);
            return M(`곱셈식을 보고 ${a} ÷ ${b}의 몫과 나머지를 구하시오.`, both(a, b), { figure: lines(around(d, quot(a, b)).map((v) => times(b, v))), explain: whyMults(a, b), facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]], rule: 'mults22' } });
          }),
          T('d1-which', '몫을 정하는 곱셈식 고르기', '①40 ②49 ③33·34 심28', (d) => {
            // 371÷43 → 43×8=344
            const [a, b] = D1.rest32(d), q = quot(a, b), from = Math.min(6, Math.max(2, q - d.int(0, 3))), qs = [from, from + 1, from + 2, from + 3];
            return C(`${a} ÷ ${b}의 몫을 구할 때 이용할 곱셈식으로 알맞은 것은?`, qs.map((v) => `${b} × ${v} = ${b * v}`), qs.indexOf(q), { explain: whyMults(a, b), facts: { pick: { expr: QX(a, b), options: qs } } });
          }),
          T('d1-22-exact', '나누어떨어지는 (두 자리 수)÷(두 자리 수)', '①36 ②40 ③36', one(D1.exact22, flat, 'd22exact')),
          T('d1-22-rest', '나머지가 있는 (두 자리 수)÷(두 자리 수)', '①37 ②41 ③37 심26', two(D1.rest22, tall, 'd22rest')),
          T('d1-22-rest2', '나머지가 두 자리 수인 (두 자리 수)÷(두 자리 수)', '①37 ②41', two(D1.rest22b, flat, 'd22rest2')),
          T('d1-32-exact', '나누어떨어지고 몫이 한 자리 수인 (세 자리 수)÷(두 자리 수)', '①41 ②42 ③41', one(D1.exact32, tall, 'd32exact')),
          T('d1-32-rest', '나머지가 있고 몫이 한 자리 수인 (세 자리 수)÷(두 자리 수)', '①42 ②43 ③42 심26', two(D1.rest32, flat, 'd32rest')),
          T('d1-32-adjust', '어림한 몫을 고쳐야 하는 (세 자리 수)÷(두 자리 수)', '①43 ②43 ③39·42', two(D1.adjust32, tall, 'd32adjust')),
          T('d1-32-zero', '가운데에 0이 있는 수÷(두 자리 수)', '①42', two(D1.zero32, flat, 'd32zero')),
          T('d1-col-pick', '몫을 바르게 구한 세로셈 고르기', '①39', (d) => {
            // 65÷12 를 몫 4(나머지 17), 5(나머지 5), 6(72를 뺌)으로 한 세 계산
            const [a, b] = byTwoDigits(d, 41, 99, (x, y, q, r) => q >= 3 && r >= 1 && y * (q + 1) <= 99, 12, 29), q = quot(a, b), r = a % b;
            const forms = d.shuffle([
              { told: [q, r] },
              { told: [q - 1, r + b], given: { quot: q - 1, rows: [{ value: b * (q - 1), end: 1, sub: true }, { value: r + b, end: 1, sub: false }] } },   // 나머지가 나누는 수보다 큰데 멈춘 계산
              { told: [q + 1, a - b * (q + 1)], given: { quot: q + 1, rows: [{ value: b * (q + 1), end: 1, sub: true }] } }                              // 뺄 수 없는 수를 적은 계산
            ]);
            return C(`${a} ÷ ${josa(b, '을/를')} 세 가지로 계산하였다. 몫을 바르게 구한 것은?`, LABELS.slice(0, 3), forms.findIndex((form) => !form.given), {
              figure: tagged(forms.map((form) => divSteps(b, a, form.given ? { steps: true, given: form.given } : { steps: true }))),
              explain: `${b} × ${q + 1} = ${josa(b * (q + 1), '은/는')} ${a}보다 커서 뺄 수 없고, 몫을 ${josa(q - 1, '으로/로')} 하면 남는 수 ${josa(r + b, '이/가')} ${b}보다 커서 더 나눌 수 있다. ${shown(a, b)}`,
              facts: { remainders: forms.map(() => [a, b]), said: forms.map((form) => form.told), want: 'right' }
            });
          }),
          T('d1-steps22', '세로셈의 계산 과정(몫이 한 자리 수)', '②50 ③35', (d) => {
            // 98÷46 → 몫 2, 빼는 수 92, 나머지 6
            const [a, b] = d.pick([D1.rest22, D1.rest22b])(d), q = quot(a, b);
            return M('나눗셈을 세로로 계산한 것이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([q, b * q, a % b]), {
              figure: divSteps(b, a, { steps: true, quot: LABELS[0], rows: { 0: LABELS[1], 1: LABELS[2] } }),
              explain: `${times(b, q)}이므로 몫은 ${q}이고, ${a}에서 ${josa(b * q, '을/를')} 빼면 ${josa(a % b, '이/가')} 남는다.`, facts: { calc: [[QX(a, b), 0], [`${a}-${a}%${b}`, 1], [RX(a, b), 2]] }
            });
          }),
          T('d1-notes', '세로셈의 줄이 나타내는 식', '①44 ②50 ③43', (d) => {
            // 245÷34: 238 ← 34×7, 7 ← 245−238
            const [a, b] = D1.rest32(d), q = quot(a, b);
            return M('나눗셈을 세로로 계산한 것이다. ㉠, ㉡에 알맞은 수는?', labelled([q, b * q]), {
              figure: divNoted(b, a, box(LABELS[0]), [{ value: b * q, sub: true, note: `← ${b} × ${box(LABELS[0])}` }, { value: a % b, note: `← ${a} − ${box(LABELS[1])}` }]),
              explain: `${times(b, q)}이므로 몫은 ${q}이다. ${a}에서 ${josa(b * q, '을/를')} 빼면 ${josa(a % b, '이/가')} 남는다.`, facts: { calc: [[QX(a, b), 0], [`${a}-${a}%${b}`, 1]] }
            });
          }),
          T('d1-fix-small', '나머지가 나누는 수보다 큰 세로셈 바로잡기', '①43 ②81 ③44 심33', (d) => {
            // 279÷29 를 몫 8, 나머지 47 로 계산한 것
            const [a, b] = byTwoDigits(d, 112, 899, (x, y, q, r) => x < y * 10 && q >= 3 && r !== 0 && full(x), 13), q = quot(a, b), r = a % b;
            return M('나눗셈을 잘못 계산한 것이다. 바르게 계산한 몫과 나머지는?', both(a, b), {
              figure: divSteps(b, a, { steps: true, given: { quot: q - 1, rows: [{ value: b * (q - 1), end: 2, sub: true }, { value: r + b, end: 2, sub: false }] } }),
              explain: `나머지 ${josa(r + b, '이/가')} 나누는 수 ${b}보다 크므로 한 번 더 뺄 수 있다. 몫을 1 크게 하면 ${shown(a, b)}이다.`,
              facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]], restTalk: { a, b, saidQ: q - 1, saidR: r + b } }
            });
          }),
          T('d1-adjust', '어림한 몫을 고치는 방법', '①43 ②81·82 ③38 덧문서', (d) => {
            // 몫을 1 작게 잡아 나머지가 나누는 수보다 큰 계산과, 몫을 1 크게 잡아 뺄 수 없는 계산
            const small = d.bool(), [a, b] = byTwoDigits(d, 112, 899, (x, y, q, r) => x < y * 10 && q >= 3 && q <= 8 && r !== 0 && full(x), 13), q = quot(a, b), r = a % b;
            const given = small ? { quot: q - 1, rows: [{ value: b * (q - 1), end: 2, sub: true }, { value: r + b, end: 2, sub: false }] } : { quot: q + 1, rows: [{ value: b * (q + 1), end: 2, sub: true }] };
            const rows = d.shuffle([['나머지가 나누는 수보다 크므로 몫을 1 크게 한다.', small], ['나머지가 나누는 수보다 크므로 몫을 1 작게 한다.', false], ['나누어지는 수에서 뺄 수 없으므로 몫을 1 크게 한다.', false], ['나누어지는 수에서 뺄 수 없으므로 몫을 1 작게 한다.', !small]]);
            return C(`${a} ÷ ${josa(b, '을/를')} 다음과 같이 계산하다가 멈추었다. 이 계산을 바르게 고치는 방법으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: divSteps(b, a, { steps: true, given }),
              explain: small ? `남은 수 ${josa(r + b, '이/가')} 나누는 수 ${b}보다 크므로 한 번 더 뺄 수 있다. 몫을 1 크게 하면 ${shown(a, b)}이다.` : `${b} × ${q + 1} = ${josa(b * (q + 1), '은/는')} ${a}보다 커서 뺄 수 없다. 몫을 1 작게 하면 ${shown(a, b)}이다.`,
              facts: Object.assign({ truth: rows.map((row) => row[1]), want: true }, small ? { restTalk: { a, b, saidQ: q - 1, saidR: r + b } } : {})
            });
          }),
          T('d1-right', '몫과 나머지를 바르게 구한 식 고르기', '②74 ③45', (d) => {
            const rows = d.until(() => [D1.rest32(d), D1.adjust32(d), D1.rest32(d)], (list) => apart(list.map(([a]) => a)) && list.every(([a, b]) => quot(a, b) >= 3)), good = d.int(0, 2);
            const told = rows.map(([a, b], i) => { const q = quot(a, b), r = a % b; return i === good ? [q, r] : i === (good + 1) % 3 ? [q - 1, r + b] : [q, r + 10 < b ? r + 10 : r - 1]; });
            return C('몫과 나머지를 바르게 구한 것은?', LABELS.slice(0, 3), good, {
              figure: tagged(rows.map(([a, b], i) => `${expr(a, '/', b, '=', told[i][0])} … ${told[i][1]}`)),
              explain: `${said(rows)}. 나누는 수와 몫의 곱에 나머지를 더하면 나누어지는 수가 되어야 하고, 나머지는 나누는 수보다 작아야 한다.`, facts: { remainders: rows, said: told, want: 'right' }
            });
          }),
          T('d1-make-exact', '나누어떨어지는 나눗셈 만들기', '②71 ③40·99', (d) => {
            // 80÷□ 에 12, 16, 18 가운데 하나를 넣기
            const [a, b] = d.pick([D1.exact22, D1.exact32])(d);
            const list = d.until(() => d.shuffle([b, b + d.pick([-2, -1, 1, 2]), b + d.pick([-4, -3, 3, 4])]), (xs) => xs.every((x) => x >= 11 && x < a) && xs.filter((x) => a % x === 0).length === 1);
            return C(`□ 안에 다음 수를 넣어 ${a} ÷ □를 계산할 때, 나누어떨어지는 것은?`, list.map(String), list.indexOf(b), {
              explain: `${list.map((x) => shown(a, x)).join(', ')}. 나머지가 0일 때 나누어떨어진다고 한다.`, facts: { remainders: list.map((x) => [a, x]), want: 'zero' }
            });
          }),
          T('d1-place', '자릿값으로 말한 두 수의 나눗셈', '③46 심6', (d) => {
            const [a, b] = D1.zero32(d), h = Math.floor(a / 100), o = a % 10, t = Math.floor(b / 10), u = b % 10, A = `(100*${h}+${o})`, Bx = `(10*${t}+${u})`;
            return M(`㉠은 100이 ${h}개, 1이 ${o}개인 수이고, ㉡은 10이 ${t}개, 1이 ${u}개인 수이다. ㉠ ÷ ㉡의 몫과 나머지는?`, both(a, b), {
              explain: `㉠은 ${a}, ㉡은 ${b}이다. ${shown(a, b)}`, facts: { calc: [[`(${A}-${A}%${Bx})/${Bx}`, 0], [`${A}%${Bx}`, 1]] }
            });
          })
        ]
      },
      {
        id: 'd2', title: '몫이 두 자리 수인 나눗셈', standard: DIV,
        types: [
          T('d2-range', '곱셈식으로 몫의 범위 알기', '①45·46 ②79 ③26·47·81', (d) => {
            // 28×10=280, 28×20=560, 28×30=840 → 625÷28 의 몫은 20보다 크고 30보다 작다
            const [a, b] = D2.any(d), s = stage(a, b), from = Math.max(1, s.q1 - d.int(0, 1)), Q = QX(a, b);
            return M(`곱셈식을 보고 ${a} ÷ ${b}의 몫이 몇십과 몇십 사이에 있는지 알아보려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([s.q1 * 10, s.q1 * 10 + 10]), {
              figure: lines([from, from + 1, from + 2].map((v) => times(b, v * 10)).concat([`${a} ÷ ${b}의 몫은 ${box(LABELS[0])}보다 크고 ${box(LABELS[1])}보다 작다.`])),
              explain: `${josa(a, '은/는')} ${b} × ${s.q1 * 10} = ${b * s.q1 * 10}보다 크고 ${b} × ${s.q1 * 10 + 10} = ${b * (s.q1 * 10 + 10)}보다 작다. 몫은 ${s.q1 * 10}보다 크고 ${s.q1 * 10 + 10}보다 작다.`,
              facts: { calc: [[`${Q}-(${Q})%10`, 0], [`${Q}-(${Q})%10+10`, 1]], unseen: [10] }
            });
          }),
          T('d2-tens-mult', '몫의 십의 자리를 구하는 곱셈식 고르기', '①46 덧문서', (d) => {
            // 504÷18 → 18×20=360
            const [a, b] = D2.any(d), s = stage(a, b), from = Math.min(6, Math.max(1, s.q1 - d.int(0, 3))), vs = [from, from + 1, from + 2, from + 3].map((v) => v * 10), Q = QX(a, b);
            return C(`${a} ÷ ${b}의 몫의 십의 자리 숫자를 구할 때 이용할 곱셈식으로 알맞은 것은?`, vs.map((v) => `${b} × ${v} = ${b * v}`), vs.indexOf(s.q1 * 10), {
              explain: `${b} × ${s.q1 * 10} = ${josa(b * s.q1 * 10, '은/는')} ${a}보다 작고 ${b} × ${s.q1 * 10 + 10} = ${josa(b * (s.q1 * 10 + 10), '은/는')} ${a}보다 크므로 몫의 십의 자리 숫자는 ${s.q1}이다.`,
              facts: { pick: { expr: `${Q}-(${Q})%10`, options: vs }, unseen: [10] }
            });
          }),
          T('d2-steps', '세로셈의 계산 과정(몫이 두 자리 수)', '①47 ②51 ③49', (d) => {
            // 752÷23: 69, 62, 46, 16
            const [a, b] = D2.restB(d), rows = longDivision(b, a).rows.map((row) => row.value), Q = QX(a, b), s = stage(a, b);
            return M('나눗셈을 세로로 계산한 것이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([quot(a, b), rows[1], rows[2]]), {
              figure: divSteps(b, a, { steps: true, quot: LABELS[0], rows: { 1: LABELS[1], 2: LABELS[2] } }),
              explain: `십의 자리 몫은 ${s.q1}이고 ${a}에서 ${b} × ${s.q1 * 10} = ${josa(b * s.q1 * 10, '을/를')} 빼면 ${josa(rows[1], '이/가')} 남는다. 일의 자리 몫은 ${s.q0}이고 ${times(b, s.q0)}이다. ${shown(a, b)}`,
              facts: { calc: [[Q, 0], [`${a}-${b}*(${Q}-(${Q})%10)`, 1], [`${b}*((${Q})%10)`, 2]], unseen: [10] }
            });
          }),
          T('d2-means', '세로셈에서 처음에 뺀 수가 나타내는 수', '①48 ③49', (d) => {
            // 752÷23 에서 75 아래에 쓴 69 는 690
            const [a, b] = D2.restA(d), s = stage(a, b), sub = b * s.q1;
            return N(`${a} ÷ ${josa(b, '을/를')} 세로로 계산한 것이다. 계산 과정에서 처음에 뺀 ${josa(sub, '이/가')} 실제로 나타내는 수는?`, sub * 10, {
              figure: divSteps(b, a, { steps: true }), explain: `몫의 십의 자리 숫자 ${josa(s.q1, '은/는')} ${josa(s.q1 * 10, '을/를')} 나타낸다. ${times(b, s.q1 * 10)}`, facts: { calc: [[`${sub}*10`, 0]], unseen: [10] }
            });
          }),
          T('d2-notes-match', '세로셈의 줄마다 알맞은 식 짝 짓기', '①48 ②52 ③48', (d) => {
            // 526÷43: 430 ← 43×10, 96 ← 526−430, 86 ← 43×2
            const [a, b] = D2.restB(d), s = stage(a, b), top = b * s.q1 * 10, mid = a - top, low = b * s.q0;
            const names = [`${b} × ${s.q1 * 10}`, `${a} − ${top}`, `${b} × ${s.q0}`], values = [top, mid, low];
            const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('나눗셈을 세로로 계산한 것이다. ㉠, ㉡, ㉢에 알맞은 식을 바르게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${names[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: divNoted(b, a, quot(a, b), [{ value: top, sub: true, note: `← ${LABELS[0]}` }, { value: mid, note: `← ${LABELS[1]}` }, { value: low, sub: true, note: `← ${LABELS[2]}` }, { value: a % b }]),
              explain: `${times(b, s.q1 * 10)}, ${a} − ${top} = ${mid}, ${times(b, s.q0)}`,
              facts: { match: { exprs: [`${b}*${s.q1 * 10}`, `${a}-${top}`, `${b}*${s.q0}`], options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('d2-notes', '몫의 각 자리 숫자가 나타내는 수', '③49', (d) => {
            // 258÷12: 240 ← 12×20, 12 ← 12×1
            const [a, b] = D2.restA(d), s = stage(a, b), top = b * s.q1 * 10, low = b * s.q0;
            return M('나눗셈을 세로로 계산한 것이다. ㉠, ㉡에 알맞은 수는?', labelled([s.q1 * 10, s.q0]), {
              figure: divNoted(b, a, quot(a, b), [{ value: top, sub: true, note: `← ${b} × ${box(LABELS[0])}` }, { value: a - top }, { value: low, sub: true, note: `← ${b} × ${box(LABELS[1])}` }, { value: a % b }]),
              explain: `몫 ${quot(a, b)}의 십의 자리 숫자 ${josa(s.q1, '은/는')} ${josa(s.q1 * 10, '을/를')} 나타낸다. ${times(b, s.q1 * 10)}, ${times(b, s.q0)}`, facts: { calc: [[`${top}/${b}`, 0], [`${low}/${b}`, 1]] }
            });
          }),
          T('d2-exact-a', '나누어떨어지고 십의 자리에서 남는 수가 한 자리 수인 계산', '①49 ②44 ③50 심27', one(D2.exactA, tall, 'q2exactA')),
          T('d2-exact-b', '나누어떨어지고 십의 자리에서 남는 수가 두 자리 수인 계산', '①50 ②44 ③50', one(D2.exactB, flat, 'q2exactB')),
          T('d2-rest-a', '나머지가 있고 십의 자리에서 남는 수가 한 자리 수인 계산', '①51 ②45 ③51 심27', two(D2.restA, tall, 'q2restA')),
          T('d2-rest-b', '나머지가 있고 십의 자리에서 남는 수가 두 자리 수인 계산', '①52 ②45 ③51', two(D2.restB, flat, 'q2restB')),
          T('d2-zero', '몫의 일의 자리가 0이고 나머지가 있는 계산', '①53 ②46 ③52', two(D2.zero, tall, 'q2zero')),
          T('d2-zero-exact', '몫이 몇십인 계산', '③52', one(D2.zeroExact, flat, 'q2zeroExact')),
          T('d2-is-two', '몫이 두 자리 수인 나눗셈 찾기', '①54 ②68 ③58 심39', (d) => {
            // 앞의 두 자리 수가 나누는 수보다 조금 작은 식(628÷63)을 섞는다
            const hit = D2.any(d), close = () => byTwoDigits(d, 201, 987, (a, b, q) => a < b * 10 && Math.floor(a / 10) >= b - 9 && q >= 2, 23);
            const rows = d.shuffle([hit].concat(d.until(() => [close(), close(), close()], (list) => apart(list.concat([hit]).map(([a]) => a)))));
            return C('몫이 두 자리 수인 나눗셈은?', LABELS, rows.indexOf(hit), {
              figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: `나누어지는 수의 앞의 두 자리 수가 나누는 수와 같거나 그보다 크면 몫은 두 자리 수이다. ${said(rows)}`,
              facts: { choose: { exprs: rows.map(([a, b]) => QX(a, b)), rule: 'onlyAbove', target: 9.5 } }
            });
          }),
          T('d2-fix-rem', '나머지가 나누는 수보다 큰 세로셈 바로잡기(몫이 두 자리 수)', '①55 ③44', (d) => {
            // 530÷11 을 47…13 으로 끝낸 것
            const [a, b] = byQuot2(d, (r, s) => r !== 0 && s.q0 >= 2), s = stage(a, b), q = quot(a, b), r = a % b;
            const given = { quot: q - 1, rows: [{ value: b * s.q1, end: 1, sub: true }, { value: s.left * 10 + a % 10, end: 2, sub: false }, { value: b * (s.q0 - 1), end: 2, sub: true }, { value: r + b, end: 2, sub: false }] };
            return M('나눗셈을 잘못 계산한 것이다. 바르게 계산한 몫과 나머지는?', both(a, b), {
              figure: divSteps(b, a, { steps: true, given }), explain: `나머지 ${josa(r + b, '이/가')} 나누는 수 ${b}보다 크므로 한 번 더 뺄 수 있다. ${shown(a, b)}`,
              facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]], restTalk: { a, b, saidQ: q - 1, saidR: r + b } }
            });
          }),
          T('d2-fix-zero', '몫의 일의 자리에 0을 쓰지 않은 세로셈 바로잡기', '①55 ③53 심33', (d) => {
            // 988÷49 의 몫을 2 라고 한 것(98을 빼고 남은 8은 더 나눌 수 없다)
            const [a, b] = D2.zero(d), s = stage(a, b);
            return M(`${a} ÷ ${josa(b, '을/를')} 다음과 같이 계산하여 몫을 ${josa(s.q1, '이라고/라고')} 하였다. 바르게 계산한 몫과 나머지는?`, both(a, b), {
              figure: divSteps(b, a, { steps: true, given: { quot: s.q1, rows: [{ value: b * s.q1, end: 1, sub: true }, { value: a % b, end: 2, sub: false }] } }),
              explain: `${b} × ${josa(s.q1, '은/는')} 십의 자리의 계산이므로 ${josa(s.q1, '은/는')} 몫의 십의 자리에 쓴다. 남은 수는 ${b}보다 작아 더 나눌 수 없으므로 몫의 일의 자리에 0을 쓴다. ${shown(a, b)}`,
              facts: { calc: [[QX(a, b), 0], [RX(a, b), 1]] }
            });
          }),
          T('d2-split', '나누어지는 수를 갈라 나누기', '②53', (d) => {
            // 300÷25: 250÷25=10, 50÷25=2
            const [b, t, k] = d.until(() => [d.int(12, 45), d.pick([10, 20]), d.int(2, 8)], ([x, y, z]) => x % 10 !== 0 && x * (y + z) <= 987), a = b * (t + k);
            return M(`${josa(a, '을/를')} ${josa(b * t, '과/와')} ${josa(b * k, '으로/로')} 갈라 ${a} ÷ ${josa(b, '을/를')} 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([t, k, t + k]), {
              figure: lines([expr(b * t, '/', b, '=', box(LABELS[0])), expr(b * k, '/', b, '=', box(LABELS[1])), expr(a, '/', b, '=', box(LABELS[2]))]),
              explain: `${shown(b * t, b)}, ${shown(b * k, b)}이고, 두 몫을 더하면 ${t + k}이다.`, facts: { calc: [[E(b * t, '/', b), 0], [E(b * k, '/', b), 1], [E(a, '/', b), 2]] }
            });
          })
        ]
      },
      { id: 'ck', title: '나머지와 확인하는 식', standard: DIV, types: [] },
      { id: 'dq', title: '몫과 나머지의 비교', standard: DIV, types: [] },
      { id: 'de', title: '나눗셈의 어림', standard: DIV, types: [] },
      { id: 'dw', title: '나눗셈 문장제', standard: DIV, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
