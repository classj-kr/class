// 3학년 2학기 1단원 곱셈 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(39개 문서)의 문제 꼴 66개와
// 기본 자료의 꼴을 참고하되, 그대로 옮기지 않고 꼴마다 따져서 냈다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 먼저 이 단원에서 아이들이 흔히 잘못 아는 것을 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다(보기 옆에 어떤 아이가 고르는지 적어 둔다).
//   ① (몇십몇)×(몇십몇)의 둘째 줄: 십의 자리 숫자와의 곱을 그냥 한 자리 수와의 곱으로 안다(640을 32×2의 값이라고 한다).
//   ② (몇십)×(몇십): 0을 하나만 붙이거나, 붙인 0의 개수와 곱에 있는 0의 개수를 같은 것으로 안다.
//   ③ 갈라서 곱하기: 십의 자리끼리, 일의 자리끼리만 곱해 더한다(26×34를 20×30과 6×4의 합으로).
//   ④ 가운데 0이 있는 수: 0과의 곱을 적지 않고 건너뛴다(304×2를 68로).
// 그다음에 계산을 두 번 해야 하는 문장제를 실었다(잘못 계산한 어떤 수, 두 곱의 차, 전체에서 곱을 빼기, □에 들어갈 수).
//
// 뺀 것과 까닭
//  - 5학년 「다각형의 둘레와 넓이」: 정사각형을 이어 붙인 직사각형의 둘레, 변의 길이가 같은 도형의 변의 길이의 합
//  - 4학년 2학기 「관계와 규칙」의 등식: 곱이 같아지는 □
//  - 중학교 「경우의 수」에 가까운 것: 수 카드 4장으로 곱이 가장 큰 식 만들기(후보를 모두 견주어야 한다), 곱이 주어진 수에 가까운 두 수 찾기
//  - 조건 풀이가 어려움의 대부분: 간격·자르기, 약속셈, 두 값 사이의 □, 두 곱 사이의 수
//  - 덧셈·뺄셈이 네 자리 수가 되는 것: 거스름돈, 값이 큰 두 곱의 합(세 자리 수 안에서 되는 것만 실었다)
//  - 벌레 먹은 셈(세로셈의 □ 여러 칸): 곱셈의 뜻보다 숫자 맞추기에 가깝다고 보아 이 단원에서는 싣지 않았다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, expr, columnSteps, chars, N, C, E } = B.kit;
  const CALC = '4수01-04', SOLVE = '4수01-08';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const times = (a, b) => expr(a, '*', b, '=', a * b);
  const pair22 = (d, ok) => d.until(() => [d.int(12, 89), d.int(12, 89)], ([a, b]) => a % 10 !== 0 && b % 10 !== 0 && a !== b && (!ok || ok(a, b)));

  B.addGroup('3-2-1', {
    id: 'hard', title: '단원 종합', standard: CALC,
    types: [
      H('h-rows', '세로셈의 둘째 줄이 나타내는 값', '세로셈의 부분곱이 나타내는 식(미래엔·동아·아이스크림), 십의 자리 곱을 그렇게 쓰는 까닭(YBM)', (d) => {
        // 32×26: 첫째 줄 192는 32×6, 둘째 줄 64는 32×20=640 을 나타낸다.
        const [a, b] = pair22(d, (x, y) => x * (y % 10) >= 100 && x * Math.floor(y / 10) < 100 && y % 10 !== Math.floor(y / 10)), ones = b % 10, tens = Math.floor(b / 10);
        const first = a * ones, second = a * tens * 10;
        const rows = d.shuffle([
          { text: `${josa(first, '은/는')} ${a} × ${ones}의 값이다.`, ok: true, claim: [E(a, '*', ones), first] },
          { text: `${josa(second, '은/는')} ${a} × ${tens}의 값이다.`, ok: false, claim: [E(a, '*', tens), second] },                 // 십의 자리 숫자를 한 자리 수로 읽는 아이
          { text: `${josa(second, '은/는')} ${a} × ${tens * 10}의 값이다.`, ok: true, claim: [E(a, '*', tens * 10), second] },
          { text: `${josa(a * b, '은/는')} ${josa(first, '과/와')} ${second}의 합이다.`, ok: true, claim: [`${first}+${second}`, a * b] }
        ]);
        return C(`${a} × ${josa(b, '을/를')} 세로로 계산하였다. 계산에 대한 설명으로 옳지 않은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
          figure: columnSteps(chars(a), '*', chars(b), [chars(first), chars(second)], chars(a * b)),
          explain: `${b}의 십의 자리 숫자 ${josa(tens, '은/는')} ${tens * 10}을 나타내므로 둘째 줄은 ${times(a, tens * 10)}이다.`,
          facts: { claimed: rows.map((row) => row.claim), claimedWant: false, mulAny: [a, b] }
        });
      }),
      H('h-split', '곱하는 수를 갈라 계산하기', '곱하는 수를 갈라 더하기(비상·천재), 모눈으로 나누어 계산(YBM·미래엔·천재)', (d) => {
        // 26×34 = 26×30 + 26×4
        const [a, b] = pair22(d), a10 = a - a % 10, b10 = b - b % 10;
        const list = d.shuffle([
          [`${a10} × ${josa(b10, '과/와')} ${a % 10} × ${b % 10}의 합`, `${a10}*${b10}+${a % 10}*${b % 10}`],          // 십의 자리끼리, 일의 자리끼리만 곱하는 아이
          [`${a} × ${josa(b10, '과/와')} ${a} × ${b % 10}의 합`, `${a}*${b10}+${a}*${b % 10}`],
          [`${a} × ${josa(b10 / 10, '과/와')} ${a} × ${b % 10}의 합`, `${a}*${b10 / 10}+${a}*${b % 10}`],                // 십의 자리 숫자를 한 자리 수로 보는 아이
          [`${a} × ${josa(b10, '과/와')} ${b} × ${b % 10}의 합`, `${a}*${b10}+${b}*${b % 10}`]                          // 갈라 놓은 수를 섞는 아이
        ]);
        return C(`${a} × ${josa(b, '과/와')} 계산 결과가 같은 것은?`, list.map(([said]) => said), list.findIndex(([, text]) => text === `${a}*${b10}+${a}*${b % 10}`), {
          explain: `${josa(b, '은/는')} ${josa(b10, '과/와')} ${b % 10}의 합이므로 ${a} × ${josa(b, '은/는')} ${a} × ${josa(b10, '과/와')} ${a} × ${b % 10}의 합이다.`,
          facts: { choose: { exprs: list.map(([, text]) => text), rule: 'equals', target: a * b }, mulAny: [a, b] }
        });
      }),
      H('h-wrong', '잘못 계산한 어떤 수', '한대희·지학사·미래엔·동아·YBM·디딤돌·비상·아이스크림(여덟 종)', (d) => {
        // 어떤 수에 19를 곱해야 할 것을 더했더니 74 → 55×19
        const [x, b] = pair22(d, (p, q) => p + q <= 99 && q <= 38);
        return N(`어떤 수에 ${josa(b, '을/를')} 곱해야 할 것을 잘못하여 ${josa(b, '을/를')} 더하였더니 ${josa(x + b, '이/가')} 되었다. 바르게 계산한 값은?`, x * b, {
          explain: `어떤 수는 ${expr(x + b, '-', b, '=', x)}이다. 바르게 계산하면 ${times(x, b)}이다.`, facts: { calc: [[`(${x + b}-${b})*${b}`, 0]] }
        });
      }, { standard: SOLVE }),
      H('h-fits', '□ 안에 들어갈 수 있는 가장 큰 수', 'YBM·천재·아이스크림 단원평가 심화', (d) => {
        // □×74<300 → 4
        const a = d.until(() => d.int(34, 89), (v) => v % 10 !== 0), k = d.int(3, 7), limit = a * k + d.int(5, a - 5);
        return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 가장 큰 수는?', k, {
          figure: expr(box(), '*', a, '<i>&lt;</i>', limit), explain: `${times(k, a)}, ${times(k + 1, a)}이므로 □ 안에 들어갈 수 있는 가장 큰 수는 ${k}이다.`,
          facts: { digit: { template: `□*${a}<${limit}`, lo: 1, hi: 9, ask: 'max' } }
        });
      }),
      H('h-who', '두 곱을 구해 누가 얼마나 더', '비상·아이스크림·천재·지학사 단원평가 심화 · 디딤돌 서술형', (d) => {
        // 하루 19쪽씩 14일과 13쪽씩 21일 → 뒤쪽이 7쪽 더
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [[a, b], [c, e]] = d.until(() => [pair22(d, (x, y) => x * y <= 950 && y <= 31), pair22(d, (x, y) => x * y <= 950 && y <= 31)], ([p, q]) => { const gap = Math.abs(p[0] * p[1] - q[0] * q[1]); return gap >= 3 && gap <= 60 && p[0] !== q[0] && p[1] !== q[1] && (p[0] > q[0]) !== (p[0] * p[1] > q[0] * q[1]); });
        const values = [a * b, c * e], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 10], [1 - winner, gap + 10]]);
        return C(`${name(one, '은/는')} 책을 하루에 ${a}쪽씩 ${b}일 동안 읽었고, ${name(two, '은/는')} 하루에 ${c}쪽씩 ${e}일 동안 읽었다. 누가 몇 쪽 더 많이 읽었는가?`, list.map(([who, n]) => `${[one, two][who]}, ${n}쪽`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${name(one, '은/는')} ${times(a, b)}(쪽), ${name(two, '은/는')} ${times(c, e)}(쪽)을 읽었다. ${name([one, two][winner], '이/가')} ${gap}쪽 더 많이 읽었다.`,
          facts: { who: { values, options: list, exprs: [E(a, '*', b), E(c, '*', e)] } }
        });
      }, { standard: SOLVE }),
      H('h-left', '전체에서 쓴 만큼을 뺀 나머지', '디딤돌 서술형 · 지학사 단원평가 실력·서술형', (d) => {
        // 귤 900개를 436명에게 2개씩 → 28개
        const [a, b] = d.until(() => [d.int(112, 289), d.int(2, 4)], ([x, y]) => x % 10 !== 0 && x * y <= 940), rest = d.int(12, 58);
        return N(`공책 ${a * b + rest}권을 학생 ${a}명에게 ${b}권씩 나누어 주었다. 남은 공책은 몇 권인가?`, rest, {
          unit: '권', explain: `나누어 준 공책은 ${times(a, b)}(권)이다. ${expr(a * b + rest, '-', a * b, '=', rest)}`, facts: { calc: [[`${a * b + rest}-${a}*${b}`, 0]] }
        });
      }, { standard: SOLVE }),
      H('h-sum', '문장제: 두 곱의 합', '두 곱의 합(기본 ①58 ②72 ③61, 심화 단원평가 여러 출판사)', (d) => {
        // 12개씩 24상자와 15개씩 16상자
        const [[a, b], [c, e]] = d.until(() => [pair22(d, (x, y) => x <= 29 && y <= 39), pair22(d, (x, y) => x <= 29 && y <= 39)], ([p, q]) => p[0] !== q[0] && p[1] !== q[1] && p[0] * p[1] + q[0] * q[1] <= 990);
        return N(`사과는 한 상자에 ${a}개씩 ${b}상자 있고, 배는 한 상자에 ${c}개씩 ${e}상자 있다. 사과와 배는 모두 몇 개인가?`, a * b + c * e, {
          unit: '개', explain: `사과는 ${times(a, b)}(개), 배는 ${times(c, e)}(개)이다. ${expr(a * b, '+', c * e, '=', a * b + c * e)}`, facts: { calc: [[`${a}*${b}+${c}*${e}`, 0]] }
        });
      }, { standard: SOLVE }),
      H('h-addmul', '문장제: 더한 뒤 곱하기', '더한 뒤 곱하기(기본 ①59 ②75)', (d) => {
        const [m, w, each] = d.until(() => [d.int(11, 19), d.int(11, 19), d.int(12, 28)], ([x, y, z]) => x !== y && z % 10 !== 0 && (x + y) % 10 !== 0 && (x + y) * z <= 990);
        return N(`남학생 ${m}명과 여학생 ${w}명에게 색종이를 ${each}장씩 나누어 주려고 한다. 필요한 색종이는 모두 몇 장인가?`, (m + w) * each, {
          unit: '장', explain: `학생은 모두 ${expr(m, '+', w, '=', m + w)}(명)이다. ${times(m + w, each)}`, facts: { calc: [[`(${m}+${w})*${each}`, 0]] }
        });
      }, { standard: SOLVE }),
      H('h-keep', '문장제: 나누어 주고 남은 수로 처음 수 구하기', '곱하고 남은 것 더하기(기본 ①62 ②70)', (d) => {
        const [n, each, rest] = d.until(() => [d.int(13, 29), d.int(12, 26), d.int(3, 11)], ([x, y, z]) => x % 10 !== 0 && y % 10 !== 0 && z < y && x * y + z <= 990);
        return N(`구슬을 ${n}명에게 ${each}개씩 나누어 주었더니 ${rest}개가 남았다. 처음에 있던 구슬은 몇 개인가?`, n * each + rest, {
          unit: '개', explain: `나누어 준 구슬은 ${times(n, each)}(개)이다. ${expr(n * each, '+', rest, '=', n * each + rest)}`, facts: { calc: [[`${n}*${each}+${rest}`, 0]] }
        });
      }, { standard: SOLVE })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
