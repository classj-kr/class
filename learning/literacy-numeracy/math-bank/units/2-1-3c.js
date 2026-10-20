// 2학년 1학기 3단원 덧셈과 뺄셈 — 실력 문항.
// 꼴 번호: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 수를 몇십으로 바꾸어 계산한 뒤 고치는 쪽을 거꾸로 안다: 더 더했으면 빼고, 더 뺐으면 더해야 한다(63 − 19 = 63 − 20 − 1 로 쓰는 아이).
//  - 세로셈에서 십의 자리로 올린 1을 더하지 않는다(65 + 58 = 113). 십의 자리에서 10을 가져오고도 십의 자리 수를 그대로 둔다(83 − 37 = 56).
//  - (몇십)−(몇십몇)에서 0에서 뺄 수 없으니 일의 자리 수를 거꾸로 뺀다(50 − 27 = 37).
//  - 빼고 더하는 세 수의 계산에서 쉬워 보이는 뒤의 덧셈부터 한다(52 − 17 + 3 = 52 − 20).
//  - 덧셈식을 뺄셈식으로 나타낼 때 +를 −로만 바꾼다(35 + 37 = 72 → 37 − 35 = 2). 합이 빼어지는 수 자리에 와야 한다.
//  - 「더 적다」「남았다」라는 말이 있으면 무조건 뺀다(더 적게 한 쪽을 알 때 더 많이 한 쪽, 주고 남은 수를 알 때 처음 수는 더해서 구한다).
//  - 차가 가장 크려면 가장 큰 수에서 가장 작은 수를 빼야 한다는 것을 놓친다.
//
// 실력에 둔 잣대: ① 문제의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제, ② 두 번 넘게 생각해야 풀리는 문제.
// 기본에서 하는 일(계산 한 번)을 고르기로 바꾼 것은 싣지 않았다. 고르기 문항의 보기는 값이 아니라 계산 과정이고, 보기마다 어떤 아이가 고르는지 주석으로 적었다.
//
// 뺀 것과 까닭
//  - 심25(수 카드로 만든 수를 93에서 빼어 결과가 가장 크게): h-cards-diff 와 같은 생각(가장 작은 수를 뺀다)이다.
//  - 심35·심37(□의 값이 같은 식끼리 잇기, □가 5보다 작은 식 모두 찾기): h-box-max 와 하는 일이 같다(□를 여럿 구해 비교).
//  - 심44·심46, ①89·①90: 두 꼴을 이어 붙였거나 거꾸로 두 번 풀거나 모르는 수가 둘이다(2-1-3b.js 머리 참고). 잘못 계산한 「어떤 수」(①76·심45)는 h-wrong-any 로 실었다 — □ 구하기는 기본(box-sub-front)에 있는 일이고 계산을 한 번 더 할 뿐이다.
//  - 심23·심24·심27·심28·심38, ①43·①48·①79: 경우를 따져 수를 찾는 문제(조건 풀이).
//  - 심52는 묻는 것을 「크림빵의 수」까지로 줄였다(원문은 그 수와 식빵의 차까지 물어 계산이 네 번이다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, chars, cards, tagged, numbers, N, C, E, shown } = B.kit;
  const { tens, ones, upOnes, addTwo, addOne, subTwo, subRound, side, col } = B.kit.g213;
  const CALC = '2수01-06', REL = '2수01-07', THREE = '2수01-08', BOX = '2수01-09', WORD = '2수01-05';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const SIGNS = ['&gt;', '=', '&lt;'];
  const signOf = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const given = (html) => numbers([html]);

  B.addGroup('2-1-3', {
    id: 'hard', title: '단원 종합', standard: CALC,
    types: [
      // ── ① 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('h-round-add', '몇십으로 보고 더한 계산 바로잡기', '심9 ①27', (d) => {
        // 78 + 14 = 80 + 14 − 2: 78을 80으로 보면 2만큼 더 더한 것이므로 2를 뺀다.
        const [a, b] = d.until(() => [d.int(17, 79), d.int(12, 68)], ([x, y]) => ones(x) >= 7 && ones(y) > 0 && upOnes(x, y) && (tens(x) + 1) * 10 + y <= 96);
        const round = (tens(a) + 1) * 10, over = round - a;
        const rows = d.shuffle([
          { text: `${round} + ${b} − ${over} = ${round + b} − ${over} = ${a + b}`, value: a + b },                    // 더 더한 만큼 뺀다(바른 계산)
          { text: `${round} + ${b} + ${over} = ${round + b} + ${over} = ${round + b + over}`, value: round + b + over }, // 몇십으로 올린 만큼을 한 번 더 더하는 아이
          { text: `${round} + ${b} = ${round + b}`, value: round + b }                                                 // 몇십으로 바꾸고 고치지 않는 아이
        ]);
        return C(`${josa(a, '을/를')} ${josa(round, '으로/로')} 보고 ${a} + ${josa(b, '을/를')} 계산한다. 바르게 계산한 것은?`, rows.map((r) => r.text), rows.findIndex((r) => r.value === a + b), {
          explain: `${josa(a, '을/를')} ${josa(round, '으로/로')} 보고 더하면 ${over}만큼 더 더한 것이다. 더 더한 ${josa(over, '을/를')} 빼야 한다. ${shown(round + b, '-', over)}`,
          facts: { claimed: rows.map((r) => [E(a, '+', b), r.value]), claimedWant: true }
        });
      }),
      H('h-round-sub', '몇십으로 보고 뺀 계산에서 틀린 것 찾기', '①26 심14 심10', (d) => {
        // 63 − 19: 63 − 20 + 1(바름), 63 − 10 − 9(바름), 63 − 20 − 1(틀림)
        const [a, b] = subTwo(d, (x, y) => ones(y) >= 7 && x - (tens(y) + 1) * 10 >= 11), round = (tens(b) + 1) * 10, over = round - b, ten = tens(b) * 10;
        const rows = d.shuffle([
          { text: `${a} − ${round} + ${over} = ${a - round} + ${over} = ${a - b}`, value: a - b },                      // 몇십으로 보고 뺀 뒤 더 뺀 만큼 더한다(바른 계산)
          { text: `${a} − ${ten} − ${ones(b)} = ${a - ten} − ${ones(b)} = ${a - b}`, value: a - b },                    // 빼는 수를 몇십과 몇으로 갈라 뺀다(바른 계산)
          { text: `${a} − ${round} − ${over} = ${a - round} − ${over} = ${a - round - over}`, value: a - round - over }  // 「빼는 계산이니까 또 뺀다」고 생각하는 아이
        ]);
        return C(`${a} − ${josa(b, '을/를')} 세 가지 방법으로 계산하였다. 잘못 계산한 것은?`, rows.map((r) => r.text), rows.findIndex((r) => r.value !== a - b), {
          explain: `${josa(b, '을/를')} ${josa(round, '으로/로')} 보고 빼면 ${over}만큼 더 뺀 것이다. 더 뺀 ${josa(over, '을/를')} 더해야 한다. ${shown(a - round, '+', over)}`,
          facts: { claimed: rows.map((r) => [E(a, '-', b), r.value]), claimedWant: false }
        });
      }),
      H('h-find-add', '세로셈 셋 가운데 틀린 덧셈 바로잡기', '심15 심16 심17', (d) => {
        // 세 계산 모두 일의 자리에서 십의 자리로 1을 올린다. 하나만 올린 1을 더하지 않았다.
        const rows = d.until(() => [addTwo(d, 'ones'), addTwo(d, 'ones'), addTwo(d, 'ones')], (list) => new Set(list.map(([x]) => x)).size === 3 && list.every(([x, y]) => ones(x) + ones(y) >= 11));
        const bad = d.int(0, 2), said = rows.map(([x, y], i) => x + y - (i === bad ? 10 : 0)), [a, b] = rows[bad];
        return N('세 계산 가운데 하나가 틀렸다. 틀린 계산을 바르게 계산한 값은?', a + b, {
          figure: side(rows.map(([x, y], i) => col(x, '+', y, chars(said[i])))),
          explain: `${LABELS[bad]}은 일의 자리에서 십의 자리로 올린 1을 십의 자리 계산에 더하지 않았다. 바르게 계산하면 ${shown(a, '+', b)}이다.`,
          facts: { calc: [[E(a, '+', b), 0]], unseen: [b] }
        });
      }),
      H('h-find-sub', '세로셈 셋 가운데 틀린 뺄셈 바로잡기', '심15 심16', (d, n) => {
        // 첫째 문제: 십의 자리에서 10을 가져오고도 십의 자리 수를 그대로 둔 계산(83 − 37 = 56)
        // 둘째 문제: (몇십)−(몇십몇)에서 일의 자리 수를 거꾸로 뺀 계산(50 − 27 = 37)
        const pick = n === 1 ? subRound : subTwo;
        const rows = d.until(() => [pick(d), pick(d), pick(d)], (list) => new Set(list.map(([x, y]) => x + '-' + y)).size === 3 && new Set(list.map(([, y]) => y)).size === 3);
        const bad = d.int(0, 2), [a, b] = rows[bad], wrong = n === 1 ? (tens(a) - tens(b)) * 10 + ones(b) : a - b + 10;
        const said = rows.map(([x, y], i) => (i === bad ? wrong : x - y));
        return N('세 계산 가운데 하나가 틀렸다. 틀린 계산을 바르게 계산한 값은?', a - b, {
          figure: side(rows.map(([x, y], i) => col(x, '-', y, chars(said[i])))),
          explain: (n === 1
            ? `${LABELS[bad]}은 일의 자리 수 0에서 ${josa(ones(b), '을/를')} 뺄 수 없는데 ${ones(b)}에서 0을 뺐다. 십의 자리에서 10을 가져와 계산해야 한다. `
            : `${LABELS[bad]}은 십의 자리에서 10을 가져오고도 십의 자리 수를 1 줄이지 않았다. `) + `바르게 계산하면 ${shown(a, '-', b)}이다.`,
          facts: { calc: [[E(a, '-', b), 0]], unseen: [b], rule: n === 1 ? 'onesBack' : 'tensKept' }
        });
      }, { count: 2 }),
      H('h-order', '빼고 더하는 계산의 순서', '①54 심20 심50', (d) => {
        // 52 − 17 + 3: 뒤의 17 + 3 = 20 이 쉬워 보여도 앞에서부터 차례로 계산한다.
        const [a, b] = subTwo(d, (x, y) => ones(y) >= 5 && x - (tens(y) + 1) * 10 >= 5), c = 10 - ones(b), m = a - b;
        const rows = d.shuffle([
          { text: `${a} − ${b} = ${m}, ${m} + ${c} = ${m + c}`, value: m + c },                       // 앞에서부터 차례로(바른 계산)
          { text: `${b} + ${c} = ${b + c}, ${a} − ${b + c} = ${a - b - c}`, value: a - b - c },       // 몇십이 되어 쉬워 보이는 뒤의 덧셈부터 하는 아이
          { text: `${a} − ${b} = ${m + 10}, ${m + 10} + ${c} = ${m + 10 + c}`, value: m + 10 + c }    // 순서는 맞지만 십의 자리 수를 1 줄이지 않는 아이
        ]);
        return C(`${a} − ${b} + ${josa(c, '을/를')} 바르게 계산한 것은?`, rows.map((r) => r.text), rows.findIndex((r) => r.value === m + c), {
          explain: `세 수의 계산은 앞에서부터 차례로 한다. ${shown(a, '-', b)}, ${shown(m, '+', c)}`,
          facts: { claimed: rows.map((r) => [`${a}-${b}+${c}`, r.value]), claimedWant: true }
        });
      }, { standard: THREE }),
      H('h-relation', '덧셈식을 뺄셈식으로 나타낸 것 가리기', '①60 심31', (d) => {
        // 35 + 37 = 72. 계산이 맞는 식이 둘이지만 주어진 덧셈식을 나타낸 것은 하나뿐이다.
        const [p, q] = addTwo(d, 'ones', (x, y) => Math.abs(x - y) >= 3), a = Math.max(p, q), b = Math.min(p, q), s = a + b;
        const rows = d.shuffle([
          { t: d.bool() ? [s, a, b] : [s, b, a], ok: true },   // 합에서 한 수를 빼면 다른 수(바른 식)
          { t: [a, b, a - b], ok: false },                     // +를 −로만 바꾸어 계산한 아이: 계산은 맞지만 합이 없다
          { t: [b, s, a], ok: false },                         // 수의 자리만 바꾼 아이: 작은 수에서 큰 수를 뺄 수 없다
          { t: [s, a, a], ok: false }                          // 합에서 한 수를 빼고 그 수를 다시 쓴 아이
        ]);
        return C('덧셈식을 뺄셈식으로 바르게 나타낸 것은?', rows.map(({ t: [x, y, z] }) => expr(x, '-', y, '=', z)), rows.findIndex((r) => r.ok), {
          figure: given(expr(p, '+', q, '=', s)),
          explain: `합 ${s}에서 한 수를 빼면 다른 수가 된다. ${a} − ${b} = ${josa(a - b, '은/는')} 계산은 맞지만 주어진 덧셈식을 나타낸 식이 아니다.`,
          facts: { truth: rows.map((r) => r.ok), want: true }
        });
      }, { standard: REL }),
      H('h-first', '주고 남은 수로 처음 수 구하기', '①73 ①71', (d) => {
        // 「남았다」가 있지만 더해서 구한다(□ − 17 = 26).
        const who = d.pick(NAMES), [b, c] = addTwo(d, 'ones');
        return N(`${name(who, '은/는')} 사탕을 몇 개 가지고 있었다. 동생에게 ${b}개를 주었더니 ${c}개가 남았다. 처음에 가지고 있던 사탕은 몇 개인가?`, b + c, {
          unit: '개', explain: `처음 수를 □로 하면 ${expr(box(), '-', b, '=', c)}이다. 처음 수는 남은 사탕과 준 사탕을 더한 수이다. ${shown(c, '+', b)}`,
          facts: { calc: [[E(c, '+', b), 0]] }
        });
      }, { standard: WORD }),
      H('h-reverse', '더 적게 한 쪽을 알 때 더 많이 한 쪽 구하기', '①75', (d) => {
        // 「더 적게」가 있지만 더해서 구한다(□ − 18 = 37).
        const [one, two] = d.shuffle(NAMES).slice(0, 2), [a, k] = addTwo(d, 'ones');
        return N(`${name(one, '은/는')} 줄넘기를 ${a}번 했다. ${name(one, '은/는')} ${nick(two)}보다 ${k}번 더 적게 했다. ${name(two, '은/는')} 줄넘기를 몇 번 했는가?`, a + k, {
          unit: '번', explain: `${name(one, '이/가')} ${k}번 더 적게 했으므로 ${name(two, '은/는')} ${nick(one)}보다 ${k}번 더 많이 했다. ${shown(a, '+', k)}`,
          facts: { calc: [[E(a, '+', k), 0]] }
        });
      }, { standard: WORD }),
      H('h-wrong-any', '잘못 계산한 어떤 수', '①76 심45', (d) => {
        // 어떤 수에서 a를 빼야 하는데 더했다: □ + a = s → □ = s − a, 바른 값은 □ − a. 어떤 수(s − a)를 구하고 멈추는 아이, 잘못 계산한 값을 어떤 수로 보는 아이가 틀린다.
        const [a, r] = d.until(() => [d.int(13, 28), d.int(6, 45)], ([x, y]) => ones(x) > 0 && x !== y && x + x + y <= 98 && y + x !== x + x);
        const x = r + a, s = x + a;
        return N(`어떤 수에서 ${josa(a, '을/를')} 빼야 할 것을 잘못하여 더하였더니 ${josa(s, '이/가')} 되었다. 바르게 계산한 값은?`, r, {
          explain: `어떤 수를 □로 하면 ${expr(box(), '+', a, '=', s)}이므로 어떤 수는 ${shown(s, '-', a)}이다. 바르게 계산하면 ${shown(x, '-', a)}이다.`,
          facts: { calc: [[`(${s}-${a})-${a}`, 0]] }
        });
      }, { standard: BOX }),
      H('h-compare-two', '더 적은 쪽의 수를 구해 다시 비교하기', '①83 ①84 심49', (d) => {
        // 「18개 더 적다」는 파란 구슬의 수를 알려 주는 말이고, 묻는 것은 노란 구슬과의 차이다.
        const [a, k] = subTwo(d, (x, y) => x - y >= 14 && ones(x - y) >= 2), blue = a - k;
        const c = d.until(() => d.int(blue + 4, Math.min(98, blue + 45)), (v) => ones(v) > 0 && ones(v) < ones(blue) && v !== a);
        return N(`빨간 구슬은 ${a}개이다. 파란 구슬은 빨간 구슬보다 ${k}개 더 적다. 노란 구슬은 ${c}개이다. 노란 구슬은 파란 구슬보다 몇 개 더 많은가?`, c - blue, {
          unit: '개', explain: `파란 구슬은 ${shown(a, '-', k)}(개)이다. 노란 구슬은 파란 구슬보다 ${shown(c, '-', blue)}(개) 더 많다.`,
          facts: { calc: [[`${c}-(${a}-${k})`, 0]] }
        });
      }, { standard: WORD }),
      H('h-cards-diff', '수 카드 4장으로 차가 가장 큰 뺄셈식 만들기', '①46 심26', (d) => {
        // 2, 5, 7, 9 → 97 − 25
        const list = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), s = list.slice().sort((p, q) => q - p), big = s[0] * 10 + s[1], small = s[3] * 10 + s[2];
        return N('수 카드 4장을 한 번씩 모두 사용하여 두 자리 수를 2개 만든다. 두 수의 차가 가장 클 때, 그 차는?', big - small, {
          figure: cards(list),
          explain: `차가 가장 크려면 가장 큰 수에서 가장 작은 수를 뺀다. 가장 큰 수는 ${big}이고, 남은 카드로 만든 가장 작은 수는 ${small}이다. ${shown(big, '-', small)}`,
          facts: { calc: [[`(${s[0]}*10+${s[1]})-(${s[3]}*10+${s[2]})`, 0]], unseen: [10] }
        });
      }),
      H('h-three-max', '계산 결과가 가장 큰 세 수의 식 만들기', '①56', (d) => {
        // 28, 12, 33 → 28 + 33 − 12: 가장 작은 수를 빼야 한다.
        const xs = d.until(() => [d.int(12, 60), d.int(12, 60), d.int(12, 60)], (list) => { const s = list.slice().sort((p, q) => p - q); return list.every((v) => ones(v) > 0) && s[1] - s[0] >= 3 && s[2] - s[1] >= 3 && s[2] + s[1] <= 99 && upOnes(s[2], s[1]); });
        const s = xs.slice().sort((p, q) => p - q);
        return N('세 수를 한 번씩 모두 써넣어 식을 만든다. 계산 결과가 가장 클 때의 값은?', s[2] + s[1] - s[0], {
          figure: numbers(xs) + expr(box(), '+', box(), '-', box()),
          explain: `계산 결과가 가장 크려면 큰 두 수를 더하고 가장 작은 수를 뺀다. ${shown(s[2], '+', s[1])}, ${shown(s[2] + s[1], '-', s[0])}`,
          facts: { calc: [[`${s[2]}+${s[1]}-${s[0]}`, 0]] }
        });
      }, { standard: THREE }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('h-box-max', '□의 값이 가장 큰 식', '①65 심35 심37', (d) => {
        // ㉠ 28 + □ = 45 ㉡ 28 + □ = 51 ㉢ □ + 35 = 51 ㉣ □ + 17 = 33
        // 더하는 수가 같은 두 식, 합이 같은 두 식은 계산하지 않고도 □의 크기를 비교할 수 있다.
        const rows = d.until(() => {
          const p = d.int(15, 48), v1 = d.int(12, 30), v2 = v1 + d.int(2, 9), q = p + d.pick([-1, 1]) * d.int(2, 8), s2 = p + v2, v4 = Math.max(v2, s2 - q) + d.pick([-3, -2, -1, 1, 2, 3]), r = d.int(14, 48);
          return d.shuffle([[p, p + v1, 'back'], [p, s2, 'back'], [q, s2, 'front'], [r, r + v4, 'front']]);
        }, (list) => {
          const v = list.map(([k, s]) => s - k);
          return list.every(([k, s]) => k >= 12 && s <= 98 && s - k >= 11 && ones(s) < ones(k)) && new Set(v).size === 4 && new Set(list.map(([k]) => k)).size === 3 && new Set(list.map(([, s]) => s)).size === 3;
        });
        const values = rows.map(([k, s]) => s - k);
        return C('□ 안에 알맞은 수가 가장 큰 것은?', LABELS.slice(0, 4), values.indexOf(Math.max(...values)), {
          figure: tagged(rows.map(([k, s, form]) => (form === 'back' ? expr(k, '+', box(), '=', s) : expr(box(), '+', k, '=', s)))),
          explain: '□는 합에서 다른 한 수를 뺀 수이다. ' + rows.map(([k, s], i) => `${LABELS[i]} ${shown(s, '-', k)}`).join(', '),
          facts: { choose: { exprs: rows.map(([k, s]) => `${s}-${k}`), rule: 'max' } }
        });
      }, { standard: BOX }),
      H('h-box-ineq', '□가 든 덧셈식의 크기 비교에 맞는 수', '①78', (d) => {
        // 29 + □ < 43 — 12, 13, 14, 15 가운데
        const [c, a] = subTwo(d, (x, y) => x - y >= 13 && x - y <= 30), edge = c - a, less = d.bool();
        const options = less ? [edge - 1, edge, edge + 1, edge + 2] : [edge - 2, edge - 1, edge, edge + 1], right = less ? edge - 1 : edge + 1;
        return C('□ 안에 들어갈 수 있는 수는?', options.map(String), options.indexOf(right), {
          figure: expr(a, '+', box(), less ? '<i>&lt;</i>' : '<i>&gt;</i>', c),
          explain: `${shown(a, '+', edge)}이므로 □ 안에는 ${edge}보다 ${less ? '작은' : '큰'} 수가 들어간다. ${shown(a, '+', right)}`,
          facts: { only: { values: options.map((v) => a + v), test: less ? 'atMost' : 'atLeast', target: less ? c - 1 : c + 1 } }
        });
      }, { standard: BOX }),
      H('h-three-compare', '세 수의 계산 둘의 크기 비교', '심20', (d) => {
        // 50 − 13 + 8 ○ 48 + 7 − 12
        const [a, b] = (d.bool() ? subRound : subTwo)(d, (x, y) => x - y <= 48), m = a - b, c = d.until(() => d.int(4, 28), (v) => ones(v) > 0 && upOnes(m, v)), left = m + c;
        const [e, f, g] = d.until(() => { const [x, y] = d.bool() ? addOne(d) : addTwo(d, 'ones'); return [x, y, x + y - left - d.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6])]; },
          ([x, y, z]) => x !== a && z >= 4 && z !== c && ones(z) > ones(x + y) && x + y <= 99);
        const s = e + f, right = s - g, k = signOf(left, right);
        return C('계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, k, {
          figure: versus(expr(a, '-', b, '+', c), expr(e, '+', f, '-', g)),
          explain: `왼쪽은 ${shown(a, '-', b)}, ${shown(m, '+', c)}이다. 오른쪽은 ${shown(e, '+', f)}, ${shown(s, '-', g)}이다. ${left} ${SIGNS[k]} ${right}이다.`,
          facts: { choose: { exprs: [`${a}-${b}+${c}`, `${e}+${f}-${g}`], rule: 'compare' } }
        });
      }, { standard: THREE }),
      H('h-bread', '여러 단계: 더 많은 쪽을 구한 뒤 나머지 구하기', '심52', (d) => {
        // 모두 85개, 식빵 13개, 단팥빵은 식빵보다 9개 더 많다 → 크림빵
        const [a, k, c] = d.until(() => [d.int(13, 28), d.int(5, 14), d.int(14, 45)], ([x, y, z]) => upOnes(x, y) && x + x + y + z <= 98 && ones(x + x + y + z) < ones(x + x + y) && z !== x && z !== x + y && ones(x + x + y) > 0);
        const b = a + k, total = a + b + c;
        return N(`빵집에 식빵, 단팥빵, 크림빵이 모두 ${total}개 있다. 식빵은 ${a}개이다. 단팥빵은 식빵보다 ${k}개 더 많다. 크림빵은 몇 개인가?`, c, {
          unit: '개', explain: `단팥빵은 ${shown(a, '+', k)}(개)이다. 식빵과 단팥빵은 모두 ${shown(a, '+', b)}(개)이다. 크림빵은 ${shown(total, '-', a + b)}(개)이다.`,
          facts: { calc: [[`${total}-${a}-(${a}+${k})`, 0]] }
        });
      }, { standard: WORD })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
