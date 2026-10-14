// 3학년 1학기 1단원 덧셈과 뺄셈 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 10종의 평가 자료(단원평가·형성평가·수학익힘·수행평가 228개 문서)에 나온 문제 꼴을 모아 합친
// 통합 목록(119꼴)에서 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다. 유형마다 통합 목록의 번호를 적어 둔다.
//
// 고른 기준
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다.
//      가로셈·세로셈과 한 번 계산하는 문장제는 묶음마다 둔다(받아올림·받아내림 조건이 묶음이 배우는 내용이다).
//      문장제는 묶음마다 얼개가 다르다: 합치기, 더 많은 쪽, 같은 수 두 번, 처음 양 / 남은 것, 누가 더, 나머지 구간, 더 필요한 양, 더 적은 쪽.
//      그 밖의 꼴은 덧셈판 하나, 뺄셈판 하나를 넘기지 않는다.
//  - 서술형(식 쓰기, 까닭 쓰기, 설명하기)과 놀이 꼴(색칠, 속담 맞추기, 길 찾기)은 싣지 않는다.
//  - 계산 한 번을 다르게 그려 놓았을 뿐인 꼴(화살표 한 단계, 계산 표, 보기처럼 계산, 세 단계로 채우는 세로셈)은 가로셈·세로셈과 같은 문제로 본다.
//  - 여러 단계이거나 거꾸로 생각해야 하는 꼴은 실력 문항으로 보냈다(3-1-1b.js).
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다. "~세요/~습니다"는 쓰지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { carryPlaces, borrowPlaces, count, plain, josa, name, nick, NAMES, LABELS, box, expr, column, columnSteps, chars, blocks, cards, chain, route, bar, shapes, lines, tagged, numbers, N, M, C, E, addPair, subPair, pairNear, ADD, SUB, result, shown } = B.kit;
  const CALC = '4수01-03', EST = '4수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(통합 목록 ' + ref + '번)', make }, more || {});
  const three = (d, lo, hi) => d.until(() => d.int(lo, hi), plain);
  const apart = (d, howMany, lo, hi, gap) => d.until(() => Array.from({ length: howMany }, () => d.int(lo, hi)), (xs) => xs.every(plain) && xs.every((x, i) => xs.every((y, j) => i === j || Math.abs(x - y) >= gap)));
  const digits = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
  const pairOf = (op) => (op === '+' ? addPair : subPair);
  const calcFacts = (a, op, b) => ({ calc: [[E(a, op, b), 0]], pair: [a, op, b], rule: true });
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

  // ── 묶음마다 두는 가로셈·세로셈 ───────────────────────────────
  const rowType = (g, op, rule) => T(g + '-row', '가로셈', '2', (d) => {
    const [a, b] = pairOf(op)(d, rule);
    return N('다음을 계산하시오.', result(a, op, b), { figure: expr(a, op, b, '=', box()), explain: shown(a, op, b), facts: calcFacts(a, op, b) });
  });
  const colType = (g, op, rule) => T(g + '-col', '세로셈', '1', (d) => {
    const [a, b] = pairOf(op)(d, rule);
    return N('다음을 계산하시오.', result(a, op, b), { figure: column(chars(a), op, chars(b)), explain: shown(a, op, b), facts: calcFacts(a, op, b) });
  });
  // 한 번 계산하는 문장제
  const word = (text, unit, a, op, b) => N(text, result(a, op, b), { unit, explain: shown(a, op, b), facts: calcFacts(a, op, b) });

  // 세로셈에서 줄마다 한 자리씩 숫자를 가린다(2□7+34□=□85). 자리마다 모르는 숫자가 하나뿐이라 답이 하나로 정해진다.
  function hidden(d, a, op, b) {
    const rows = [chars(a), chars(b), chars(result(a, op, b))];
    const places = d.shuffle([0, 1, 2]);   // 줄마다 가릴 자리(0 = 일의 자리)
    const inputs = [], masks = [];
    places.forEach((place, row) => {
      const at = rows[row].length - 1 - place;
      inputs.push({ label: LABELS[row], answer: Number(rows[row][at]) });
      masks.push({ row, place });
      rows[row][at] = box(LABELS[row]);
    });
    return M('㉠, ㉡, ㉢에 알맞은 숫자는?', inputs, { figure: column(rows[0], op, rows[1], rows[2]), explain: shown(a, op, b), facts: { masks, pair: [a, op, b], rule: true } });
  }
  // 두 계산 결과의 크기 비교
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const SIGNS = ['&gt;', '=', '&lt;'];
  const signOf = (x, y) => (x > y ? 0 : x === y ? 1 : 2);

  // ── 어림셈에 쓰는 수 ─────────────────────────────────────────
  const toHundred = (n) => Math.round(n / 100) * 100;
  // 몇백에 가까운 세 자리 수(몇백에서 2~12 떨어진 수). 100은 아래로 내려가지 않는다.
  const nearHundred = (d, lo, hi) => { const h = d.int(lo, hi) * 100; return h + (h === 100 ? 1 : d.pick([-1, 1])) * d.int(2, 12); };
  // 몇백으로 어림할 수 있는 세 자리 수(몇백에서 45까지 떨어진 수)
  const roundish = (d, lo, hi) => d.until(() => d.int(lo, hi) * 100 + d.int(-45, 45), (v) => v >= 105 && plain(v) && Math.abs(v - toHundred(v)) >= 8);

  B.addUnit({
    id: '3-1-1', grade: 3, semester: 1, no: 1, title: '덧셈과 뺄셈', version: 6,
    groups: [
      {
        id: 'add0', title: '받아올림이 없는 덧셈', standard: CALC,
        types: [
          rowType('add0', '+', ADD.none),
          colType('add0', '+', ADD.none),
          T('add0-blocks', '수 모형을 보고 계산하기', '13', (d) => {
            const [a, b] = addPair(d, (c, x, y) => ADD.none(c) && x < 500 && y < 500);
            return N('수 모형을 보고 계산하시오.', a + b, { figure: blocks(a) + blocks(b) + expr(a, '+', b, '=', box()), explain: shown(a, '+', b), facts: calcFacts(a, '+', b) });
          }),
          T('add0-split', '자리별로 나누어 더하기', '18', (d) => {
            const [a, b] = addPair(d, (c, x, y) => ADD.none(c) && digits(x).every((v) => v > 0) && digits(y).every((v) => v > 0));
            const [ah, at, ao] = digits(a), [bh, bt, bo] = digits(b);
            return M(`${a} + ${josa(b, '을/를')} 자리별로 나누어 계산한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, [0, 1, 2, 3].map((i) => ({ label: LABELS[i], answer: [ah * 100 + bh * 100, at * 10 + bt * 10, ao + bo, a + b][i] })), {
              figure: lines([expr(ah * 100, '+', bh * 100, '=', box(LABELS[0])), expr(at * 10, '+', bt * 10, '=', box(LABELS[1])), expr(ao, '+', bo, '=', box(LABELS[2])), expr(a, '+', b, '=', box(LABELS[3]))]),
              explain: `백의 자리끼리 ${shown(ah * 100, '+', bh * 100)}, 십의 자리끼리 ${shown(at * 10, '+', bt * 10)}, 일의 자리끼리 ${shown(ao, '+', bo)}이다. 세 값을 모으면 ${a + b}이다.`,
              facts: { calc: [[`${ah}*100+${bh}*100`, 0], [`${at}*10+${bt}*10`, 1], [`${ao}+${bo}`, 2], [E(a, '+', b), 3]], pair: [a, '+', b], rule: true }
            });
          }),
          T('add0-match', '식과 계산 결과 짝 짓기', '27', (d) => {
            const pairs = d.until(() => [addPair(d, ADD.none), addPair(d, ADD.none), addPair(d, ADD.none)], (list) => new Set(list.map(([x, y]) => x + y)).size === 3);
            const values = pairs.map(([x, y]) => x + y);
            const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(pairs.map(([x, y]) => expr(x, '+', y))), explain: pairs.map(([x, y], i) => `${LABELS[i]} ${shown(x, '+', y)}`).join(', '),
              facts: { match: { exprs: pairs.map(([x, y]) => E(x, '+', y)), options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('add0-word', '문장제: 두 양을 합치기', '78', (d) => {
            const [a, b] = addPair(d, ADD.none);
            return word(`어느 빵집에서 빵을 오전에 ${a}개, 오후에 ${b}개 팔았다. 이 빵집에서 하루 동안 판 빵은 모두 몇 개인가?`, '개', a, '+', b);
          })
        ]
      },
      {
        id: 'add1', title: '받아올림이 한 번 있는 덧셈', standard: CALC,
        types: [
          rowType('add1', '+', ADD.ones),
          colType('add1', '+', ADD.tens),
          T('add1-blocks', '수 모형이 나타내는 수보다 더 큰 수', '15', (d) => {
            const [a, b] = addPair(d, (c, x, y) => ADD.once(c) && x < 600);
            return N(`수 모형이 나타내는 수보다 ${b}만큼 더 큰 수는?`, a + b, { figure: blocks(a), explain: `수 모형이 나타내는 수는 ${a}이다. ` + shown(a, '+', b), facts: calcFacts(a, '+', b) });
          }),
          T('add1-carry', '받아올림한 수가 나타내는 값', '16', (d) => {
            const [a, b] = addPair(d, ADD.ones);
            return N('덧셈식에서 □ 안의 수 1이 실제로 나타내는 값은?', 10, {
              figure: column(chars(a), '+', chars(b), chars(a + b), [box(1), '']),
              explain: '일의 자리에서 십의 자리로 받아올림한 수이므로 10을 나타낸다.', facts: { carryValue: 10, pair: [a, '+', b], rule: true }
            });
          }),
          T('add1-hide', '세로셈의 빈 숫자 채우기', '45', (d) => { const [a, b] = addPair(d, ADD.once); return hidden(d, a, '+', b); }),
          T('add1-pick', '합이 정해진 두 수 고르기', '60', (d) => {
            // 135, 127, 234, 216 가운데 골라 □+□=351. 일의 자리만 보아서는 짝이 하나로 좁혀지지 않게 한다.
            const pairsOf = (list) => { const out = []; list.forEach((x, i) => list.forEach((y, j) => { if (i < j) out.push([x, y]); })); return out; };
            const list = d.until(() => apart(d, 4, 115, 480, 8), (xs) => {
              const sums = pairsOf(xs).map(([x, y]) => x + y), target = xs[0] + xs[1];
              return new Set(sums).size === 6 && sums.filter((s) => s % 10 === target % 10).length >= 2 && ADD.once(carryPlaces(xs[0], xs[1]));
            });
            const target = list[0] + list[1];
            return M(`네 수 중 두 수를 골라 합이 ${target}인 덧셈식을 만들려고 한다. 두 수는?`, [{ answer: list[0] }, { answer: list[1] }], {
              unordered: true, figure: numbers(d.shuffle(list)) + expr(box(), '+', box(), '=', target), explain: shown(list[0], '+', list[1]),
              facts: { pairs: { numbers: list, want: 'sum', target } }
            });
          }),
          T('add1-versus', '계산 결과와 수의 크기 비교', '29', (d) => {
            const [a, b] = addPair(d, ADD.once), other = a + b + d.pick([-2, -1, 1, 2]);
            return C('○ 안에 알맞은 것은?', SIGNS, signOf(a + b, other), {
              figure: versus(expr(a, '+', b), `<span class="mb-expr">${other}</span>`), explain: `${shown(a, '+', b)}이므로 ${a + b} ${SIGNS[signOf(a + b, other)]} ${other}이다.`,
              facts: { choose: { exprs: [E(a, '+', b), String(other)], rule: 'compare' }, pair: [a, '+', b], rule: true }
            });
          }),
          T('add1-word', '문장제: 더 많은 쪽 구하기', '80', (d) => {
            const [a, b] = addPair(d, ADD.once);
            return word(`꽃집에 장미가 ${a}송이 있고, 튤립은 장미보다 ${b}송이 더 많다. 꽃집에 있는 튤립은 몇 송이인가?`, '송이', a, '+', b);
          }),
          T('add1-twice', '문장제: 같은 수를 두 번 더하기', '85', (d) => {
            const a = d.until(() => three(d, 210, 480), (v) => ADD.once(carryPlaces(v, v)));
            return N(`공원 산책로는 한 바퀴가 ${a} m이다. 산책로를 두 바퀴 걸었을 때, 걸은 거리는 모두 몇 m인가?`, a + a, { unit: 'm', explain: shown(a, '+', a), facts: { calc: [[E(a, '+', a), 0]] } });
          })
        ]
      },
      {
        id: 'add2', title: '받아올림이 여러 번 있는 덧셈', standard: CALC,
        types: [
          rowType('add2', '+', ADD.twice),
          colType('add2', '+', ADD.thrice),
          T('add2-step', '몇만큼 더 큰 수', '6', (d) => {
            const [a, b] = addPair(d, ADD.many);
            return N(`${a}보다 ${b}만큼 더 큰 수는?`, a + b, { explain: shown(a, '+', b), facts: calcFacts(a, '+', b) });
          }),
          T('add2-shift', '한 수를 줄이고 다른 수를 늘린 덧셈', '25', (d) => {
            // 562+374 와 552+384 는 합이 같다.
            const [a, b] = addPair(d, (c, x, y) => ADD.twice(c) && x % 10 !== 0 && y % 10 !== 0 && digits(x)[1] >= 1 && digits(y)[1] <= 8 && digits(y)[1] >= 1 && digits(x)[1] <= 8);
            const list = d.shuffle([[a - 10, b + 10], [a - 10, b - 10], [a + 10, b + 10], [a - 10, b]]);
            return C(`${a} + ${josa(b, '과/와')} 계산 결과가 같은 것은?`, list.map(([x, y]) => expr(x, '+', y)), list.findIndex(([x, y]) => x + y === a + b), {
              explain: `한 수를 10만큼 줄이고 다른 수를 10만큼 늘리면 합은 같다. ${shown(a, '+', b)}, ${shown(a - 10, '+', b + 10)}`,
              facts: { choose: { exprs: list.map(([x, y]) => E(x, '+', y)), rule: 'equals', target: a + b }, pair: [a, '+', b], rule: true }
            });
          }),
          T('add2-partial', '자리별 합을 줄마다 적는 세로셈', '22', (d) => {
            // 467+258: 15, 110, 600 을 차례로 적고 더한다
            const [a, b] = addPair(d, ADD.twice), A = digits(a), Bd = digits(b), ones = A[2] + Bd[2], tens = (A[1] + Bd[1]) * 10, hundreds = (A[0] + Bd[0]) * 100;
            return M(`${a} + ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: tens }, { label: LABELS[1], answer: hundreds }, { label: LABELS[2], answer: a + b }], {
              figure: columnSteps(chars(a), '+', chars(b), [chars(ones), box(LABELS[0]), box(LABELS[1])], box(LABELS[2]), [`← ${A[2]} + ${Bd[2]}`, `← ${A[1] * 10} + ${Bd[1] * 10}`, `← ${A[0] * 100} + ${Bd[0] * 100}`]),
              explain: `일의 자리끼리 ${shown(A[2], '+', Bd[2])}, 십의 자리끼리 ${shown(A[1] * 10, '+', Bd[1] * 10)}, 백의 자리끼리 ${shown(A[0] * 100, '+', Bd[0] * 100)}이다. 세 값을 더하면 ${a + b}이다.`,
              facts: { calc: [[`${A[1] * 10}+${Bd[1] * 10}`, 0], [`${A[0] * 100}+${Bd[0] * 100}`, 1], [E(a, '+', b), 2]], pair: [a, '+', b] }
            });
          }),
          T('add2-fix', '잘못 계산한 덧셈 바로잡기', '40', (d) => {
            // 437+258=685: 받아올림한 수를 더하지 않았다.
            const [a, b] = addPair(d, ADD.twice), A = digits(a), Bd = digits(b);
            const wrong = (A[0] + Bd[0]) * 100 + ((A[1] + Bd[1]) % 10) * 10 + ((A[2] + Bd[2]) % 10);
            return N('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', a + b, {
              figure: column(chars(a), '+', chars(b), chars(wrong)), explain: `받아올림한 수를 더하지 않았다. 바르게 계산하면 ${shown(a, '+', b)}이다.`,
              facts: Object.assign(calcFacts(a, '+', b), { wrong })
            });
          }),
          T('add2-cards', '수 카드로 만든 가장 큰 수와 가장 작은 수의 합', '62', (d) => {
            const list = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), (xs) => { const s = xs.slice().sort((p, q) => q - p); return ADD.many(carryPlaces(s[0] * 100 + s[1] * 10 + s[2], s[2] * 100 + s[1] * 10 + s[0])); });
            const s = list.slice().sort((p, q) => q - p), big = s[0] * 100 + s[1] * 10 + s[2], small = s[2] * 100 + s[1] * 10 + s[0];
            return N('수 카드 3장을 한 번씩 모두 사용하여 세 자리 수를 만든다. 만들 수 있는 가장 큰 수와 가장 작은 수의 합은?', big + small, {
              figure: cards(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, '+', small),
              facts: { cardSpec: { digits: list, which: 'max+min' } }
            });
          }),
          T('add2-shapes', '정해 준 도형 안의 수의 합', '66', (d) => {
            // 원 안의 수 648, 367 → 1015
            const [a, b] = addPair(d, ADD.many), others = apart(d, 2, 110, 980, 20);
            const list = d.shuffle([['circle', a], ['circle', b], ['triangle', others[0]], ['square', others[1]]]);
            return N('원 안에 있는 수의 합은?', a + b, { figure: shapes(list), explain: `원 안에 있는 수는 ${a}, ${b}이다. ` + shown(a, '+', b), facts: { inside: { kind: 'circle', list }, pair: [a, '+', b], rule: true } });
          }),
          T('add2-compare', '두 식의 계산 결과 비교', '26', (d) => {
            const [a, b] = addPair(d, ADD.many);
            const [c, e] = d.until(() => addPair(d, ADD.many), ([x, y]) => Math.abs(x + y - a - b) <= 30 && x + y !== a + b && x !== a && x !== b);
            return C('두 식의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, signOf(a + b, c + e), {
              figure: versus(expr(a, '+', b), expr(c, '+', e)), explain: `${shown(a, '+', b)}, ${shown(c, '+', e)}`,
              facts: { choose: { exprs: [E(a, '+', b), E(c, '+', e)], rule: 'compare' } }
            });
          }),
          T('add2-route', '문장제: 길 그림에서 두 구간 더하기', '95', (d) => {
            const [a, b] = addPair(d, (c, x, y) => ADD.many(c) && x + y <= 999);
            return N('집에서 공원을 지나 도서관까지 가는 거리는 몇 m인가?', a + b, {
              unit: 'm', figure: route([['집', 0, 50], ['공원', 48, 50], ['도서관', 100, 50]], [[0, 1, a + ' m'], [1, 2, b + ' m']], 40), explain: shown(a, '+', b), facts: calcFacts(a, '+', b)
            });
          }),
          T('add2-first', '문장제: 쓴 것과 남은 것으로 처음 양 구하기', '86', (d) => {
            // 485 cm를 쓰고 2 m 35 cm가 남음 → 처음 길이
            const [used, left] = d.until(() => [three(d, 310, 680), d.int(1, 3) * 100 + d.int(12, 88)], ([x, y]) => plain(y) && x + y <= 999 && ADD.many(carryPlaces(x, y)));
            const m = Math.floor(left / 100), cm = left % 100;
            return N(`색 테이프를 ${used} cm 사용하였더니 ${m} m ${cm} cm가 남았다. 처음에 있던 색 테이프의 길이는 몇 cm인가?`, used + left, {
              unit: 'cm', explain: `${m} m ${cm} cm는 ${left} cm이다. ` + shown(used, '+', left), facts: { calc: [[`${used}+${m}*100+${cm}`, 0]], pair: [used, '+', left], rule: true }
            });
          })
        ]
      },
      {
        id: 'sub0', title: '받아내림이 없는 뺄셈', standard: CALC,
        types: [
          rowType('sub0', '-', (bw, x, y) => SUB.none(bw) && x - y >= 100),
          colType('sub0', '-', SUB.none),
          T('sub0-blocks', '수 모형이 나타내는 뺄셈식', '19', (d) => {
            const [a, b] = subPair(d, (bw, x, y) => SUB.none(bw) && x < 700 && digits(y).every((v) => v >= 1));
            return M('수 모형에서 ×표 한 것을 덜어 내었다. 수 모형이 나타내는 뺄셈식에서 ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }, { label: LABELS[2], answer: a - b }], {
              figure: blocks(a, '', b) + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', box(LABELS[2])),
              explain: `전체는 ${a}, 덜어 낸 것은 ${b}이다. ` + shown(a, '-', b),
              facts: { calc: [[String(a), 0], [String(b), 1], [E(a, '-', b), 2]], pair: [a, '-', b], rule: true }
            });
          }),
          T('sub0-step', '몇만큼 더 작은 수', '6', (d) => {
            const [a, b] = subPair(d, (bw, x, y) => SUB.none(bw) && x - y >= 100);
            return N(`${a}보다 ${b}만큼 더 작은 수는?`, a - b, { explain: shown(a, '-', b), facts: calcFacts(a, '-', b) });
          }),
          T('sub0-same', '계산 결과가 같은 식 찾기', '32', (d) => {
            // 뺄셈식 넷 가운데 결과가 같은 것은 한 쌍뿐이다.
            const none = (bw, x, y) => SUB.none(bw) && x - y >= 100;
            const rows = d.until(() => {
              const first = subPair(d, none), shift = d.pick([-1, 1]) * d.int(11, 180), twin = [first[0] + shift, first[1] + shift];   // 두 수를 같은 만큼 옮기면 차가 같다
              const value = first[0] - first[1], close = () => { const y = d.int(100, 899 - value), x = y + value + d.pick([-1, 1]) * d.int(3, 30); return [x, y]; };
              return d.shuffle([first, twin, close(), close()]);
            }, (list) => { const v = list.map(([x, y]) => x - y); return list.every(([x, y]) => x <= 999 && y >= 100 && plain(x) && plain(y) && none(borrowPlaces(x, y), x, y)) && new Set(list.map(([x]) => x)).size === 4 && new Set(v).size === 3; });
            const values = rows.map(([x, y]) => x - y);
            const right = [0, 1, 2, 3].filter((i) => values.filter((v) => v === values[i]).length === 2);
            const all = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
            const list = d.shuffle(d.shuffle(all.filter((p) => p.join() !== right.join())).slice(0, 3).concat([right]));
            return C('계산 결과가 같은 두 식은?', list.map((p) => p.map((i) => LABELS[i]).join(', ')), list.findIndex((p) => p.join() === right.join()), {
              figure: tagged(rows.map(([x, y]) => expr(x, '-', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${shown(x, '-', y)}`).join(', '),
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '-', y)), rule: 'same', pairsShown: list } }
            });
          }),
          T('sub0-word', '문장제: 덜어 내고 남은 것', '81', (d) => {
            const [a, b] = subPair(d, (bw, x, y) => SUB.none(bw) && x - y >= 100 && x <= 480);
            return word(`도서관에 책이 ${a}권 있다. 그중 ${b}권을 빌려주었을 때, 도서관에 남은 책은 몇 권인가?`, '권', a, '-', b);
          })
        ]
      },
      {
        id: 'sub1', title: '받아내림이 한 번 있는 뺄셈', standard: CALC,
        types: [
          rowType('sub1', '-', (bw, x, y) => SUB.ones(bw) && x - y >= 100),
          colType('sub1', '-', SUB.tens),
          T('sub1-marks', '받아내림한 것을 적어 가며 계산하기', '17', (d) => {
            // 453-327: 십의 자리 위에 4, 일의 자리 위에 10
            const [a, b] = subPair(d, (bw, x, y) => SUB.ones(bw) && x - y >= 100), t = digits(a)[1];
            return M('뺄셈식에서 ㉠, ㉡에 알맞은 수와 계산 결과는?', [{ label: LABELS[0], answer: t - 1 }, { label: LABELS[1], answer: 10 }, { label: '계산 결과', answer: a - b }], {
              figure: column(chars(a), '-', chars(b), null, ['', box(LABELS[0]), box(LABELS[1])]),
              explain: `십의 자리에서 10을 받아내림하면 십의 자리 수는 ${josa(t - 1, '이/가')} 되고 일의 자리에 10이 더해진다. ` + shown(a, '-', b),
              facts: { marks: [a, b], pair: [a, '-', b], rule: true }
            });
          }),
          T('sub1-hide', '세로셈의 빈 숫자 채우기', '45', (d) => { const [a, b] = subPair(d, (bw, x, y) => SUB.once(bw) && x - y >= 100); return hidden(d, a, '-', b); }),
          T('sub1-places', '묶음의 수로 말한 수보다 더 작은 수', '61', (d) => {
            // 100이 3개, 10이 7개, 1이 2개인 수보다 135만큼 더 작은 수
            const [a, b] = subPair(d, (bw, x, y) => SUB.once(bw) && digits(x).every((v) => v >= 1) && x - y >= 100), [h, t, o] = digits(a);
            return N(`100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수보다 ${b}만큼 더 작은 수는?`, a - b, { explain: `100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수는 ${a}이다. ` + shown(a, '-', b), facts: { places: [[h, t, o], '-', b], pair: [a, '-', b], rule: true } });
          }),
          T('sub1-who', '문장제: 누가 얼마나 더', '83', (d) => {
            const [one, two] = d.shuffle(NAMES).slice(0, 2);
            const [big, small] = subPair(d, (bw, x, y) => SUB.once(bw) && x - y >= 40 && x <= 480), gap = big - small;
            const values = d.bool() ? [big, small] : [small, big], winner = values[0] > values[1] ? 0 : 1;
            const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 10], [1 - winner, gap - 10]]);
            return C(`훌라후프를 ${name(one, '은/는')} ${values[0]}번, ${name(two, '은/는')} ${values[1]}번 돌렸다. 누가 몇 번 더 많이 돌렸는가?`, list.map(([who, n]) => `${[one, two][who]}, ${n}번`), list.findIndex(([who, n]) => who === winner && n === gap), {
              explain: `${name([one, two][winner], '이/가')} 더 많이 돌렸다. ` + shown(big, '-', small),
              facts: { who: { values, options: list }, pair: [big, '-', small], rule: true }
            });
          }),
          T('sub1-route', '문장제: 전체 거리에서 한 구간 빼기', '101', (d) => {
            const [a, b] = subPair(d, (bw, x, y) => SUB.once(bw) && x - y >= 110 && y >= 150);
            return N(`집에서 은행을 지나 시장까지 가는 거리는 ${a} m이다. 집에서 은행까지의 거리는 몇 m인가?`, a - b, {
              unit: 'm', figure: route([['집', 0, 50], ['은행', 52, 50], ['시장', 100, 50]], [[0, 1, '?'], [1, 2, b + ' m']], 40), explain: shown(a, '-', b), facts: calcFacts(a, '-', b)
            });
          })
        ]
      },
      {
        id: 'sub2', title: '받아내림이 두 번 있는 뺄셈', standard: CALC,
        types: [
          rowType('sub2', '-', (bw, x) => SUB.twice(bw) && digits(x)[1] >= 1),
          colType('sub2', '-', SUB.zeroTens),
          T('sub2-above', '받아내림하고 고쳐 적은 수가 나타내는 값', '16', (d) => {
            // 563-184의 세로셈 위에 4, 15, 10 을 적고 15 에 □. 답은 150.
            const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && digits(x)[1] >= 1 && x - y >= 100);
            const [h, t] = digits(a), mid = t - 1 + 10;
            return N('뺄셈식에서 □ 안의 수가 실제로 나타내는 값은?', mid * 10, {
              figure: column(chars(a), '-', chars(b), chars(a - b), [String(h - 1), box(mid), '10']),
              explain: `십의 자리 수 ${t}에서 일의 자리로 10을 받아내림하여 ${josa(t - 1, '이/가')} 되었고, 백의 자리에서 받아내림한 100은 십의 자리에서 10이 10개이다. 십의 자리에는 10이 ${mid}개 있으므로 ${josa(mid * 10, '을/를')} 나타낸다.`,
              facts: { aboveValue: [a, b], pair: [a, '-', b], rule: true }
            });
          }),
          T('sub2-fix', '잘못 계산한 뺄셈 바로잡기', '40', (d) => {
            // 631-387=354: 받아내림한 수를 빼지 않았다.
            const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && digits(x)[1] < digits(y)[1] && x - y >= 100), A = digits(a), Bd = digits(b);
            const wrong = (A[0] - Bd[0]) * 100 + (A[1] + 10 - Bd[1]) * 10 + (A[2] + 10 - Bd[2]);
            return N('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', a - b, {
              figure: column(chars(a), '-', chars(b), chars(wrong)), explain: `받아내림한 수를 빼지 않았다. 바르게 계산하면 ${shown(a, '-', b)}이다.`,
              facts: Object.assign(calcFacts(a, '-', b), { wrong })
            });
          }),
          T('sub2-best', '계산 결과가 가장 큰 것', '28', (d) => {
            const pairs = d.until(() => [subPair(d, SUB.twice), subPair(d, SUB.twice), subPair(d, SUB.twice)], (list) => { const v = list.map(([x, y]) => x - y); return new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 60 && Math.min(...v) >= 100; });
            const values = pairs.map(([x, y]) => x - y);
            return C('계산 결과가 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
              figure: tagged(pairs.map(([x, y]) => expr(x, '-', y))), explain: pairs.map(([x, y], i) => `${LABELS[i]} ${shown(x, '-', y)}`).join(', '),
              facts: { choose: { exprs: pairs.map(([x, y]) => E(x, '-', y)), rule: 'max' } }
            });
          }),
          T('sub2-inverse', '뺄셈식에서 빼는 수 구하기', '47', (d) => {
            // 869-□=381
            const [a, c] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 100), b = a - c;
            return N('□ 안에 알맞은 수는?', b, { figure: expr(a, '-', box(), '=', c), explain: shown(a, '-', c), facts: { calc: [[E(a, '-', c), 0]], inverse: ['a-x=c', a, b, c], pair: [a, '-', c], rule: true } });
          }),
          T('sub2-need', '문장제: 더 채워야 하는 양', '82', (d) => {
            const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && x <= 480 && x - y >= 60);
            return word(`종이학 ${a}마리를 접으려고 한다. 지금까지 ${b}마리를 접었을 때, 몇 마리를 더 접어야 하는가?`, '마리', a, '-', b);
          }),
          T('sub2-unit', '문장제: 단위를 바꾼 뒤 빼기', '84', (d) => {
            // 3 m 리본에서 158 cm
            const m = d.int(3, 8), used = d.until(() => three(d, 125, m * 100 - 110), (v) => v % 10 !== 0);
            return N(`길이가 ${m} m인 철사 중에서 ${used} cm를 잘라 사용하였다. 남은 철사의 길이는 몇 cm인가?`, m * 100 - used, {
              unit: 'cm', explain: `${m} m는 ${m * 100} cm이다. ` + shown(m * 100, '-', used), facts: { calc: [[`${m}*100-${used}`, 0]] }
            });
          }),
          T('sub2-less', '문장제: 더 적은 쪽 구하기', '80', (d) => {
            const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 100 && y <= 390);
            return word(`문구점에 연필이 ${a}자루 있고, 볼펜은 연필보다 ${b}자루 더 적게 있다. 문구점에 있는 볼펜은 몇 자루인가?`, '자루', a, '-', b);
          })
        ]
      },
      {
        id: 'est', title: '어림셈', standard: EST,
        types: [
          T('est-fill', '몇백으로 어림하여 더하기', '110', (d) => {
            const a = nearHundred(d, 2, 6), b = d.until(() => nearHundred(d, 1, 4), (x) => toHundred(x) !== toHundred(a)), ra = toHundred(a), rb = toHundred(b);
            return M(`${a} + ${josa(b, '이/가')} 약 얼마인지 어림셈으로 구하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: ra }, { label: LABELS[1], answer: rb }, { label: LABELS[2], answer: ra + rb }], {
              figure: lines([`${josa(a, '은/는')} 약 ${box(LABELS[0])}`, `${josa(b, '은/는')} 약 ${box(LABELS[1])}`, `${a} + ${josa(b, '은/는')} 약 ${box(LABELS[2])}`]),
              explain: `${josa(a, '은/는')} ${ra}에, ${josa(b, '은/는')} ${rb}에 가깝다. ` + shown(ra, '+', rb), facts: { estimate: [a, '+', b] }
            });
          }),
          T('est-pick', '어림셈으로 구한 값 고르기', '109', (d) => {
            const a = nearHundred(d, 6, 9), b = nearHundred(d, 1, 3), right = toHundred(a) - toHundred(b), shift = d.int(0, 2);
            const options = [0, 1, 2].map((i) => right + (i - shift) * 100);
            return C('다음 식을 어림셈으로 계산한 값은?', options.map((v) => '약 ' + v), shift, {
              figure: expr(a, '-', b), explain: `${josa(a, '은/는')} 약 ${toHundred(a)}, ${josa(b, '은/는')} 약 ${toHundred(b)}이다. ` + shown(toHundred(a), '-', toHundred(b)), facts: { estimate: [a, '-', b], options }
            });
          }),
          T('est-expr', '어림셈을 하기 위한 식', '113', (d) => {
            const a = d.int(3, 5) * 100 + d.int(8, 25), b = d.int(2, 3) * 100 - d.int(5, 15), ra = toHundred(a), rb = toHundred(b);
            const options = d.shuffle([[ra, rb], [ra, rb - 100], [ra + 100, rb]]);
            return C('다음 식을 어림셈으로 계산하려고 한다. 어림셈을 하기 위한 식으로 알맞은 것은?', options.map(([x, y]) => expr(x, '+', y)), options.findIndex(([x, y]) => x === ra && y === rb), {
              figure: expr(a, '+', b), explain: `${josa(a, '은/는')} 약 ${ra}, ${josa(b, '은/는')} 약 ${rb}이다.`, facts: { estimateExpr: [a, '+', b], options }
            });
          }),
          T('est-word', '문장제: 어림셈으로 약 얼마', '112', (d) => {
            const a = nearHundred(d, 2, 4), b = d.until(() => nearHundred(d, 2, 4), (x) => x !== a), sum = toHundred(a) + toHundred(b);
            return N(`도서관에 동화책이 ${a}권, 과학책이 ${b}권 있다. 어림셈으로 구하면 동화책과 과학책은 모두 약 몇 권인가?`, sum, {
              unit: '권', lead: '약', explain: `${josa(a, '은/는')} 약 ${toHundred(a)}, ${josa(b, '은/는')} 약 ${toHundred(b)}이다. ` + shown(toHundred(a), '+', toHundred(b)), facts: { estimate: [a, '+', b] }
            });
          }),
          T('est-both', '어림한 값과 계산한 값', '114', (d) => {
            const a = nearHundred(d, 4, 7), b = nearHundred(d, 2, 3), est = toHundred(a) + toHundred(b);
            return M('다음 식의 계산 결과를 어림한 값과 실제로 계산한 값은?', [{ label: '어림한 값', lead: '약', answer: est }, { label: '계산한 값', answer: a + b }], {
              figure: expr(a, '+', b), explain: `어림셈: ${shown(toHundred(a), '+', toHundred(b))}, 계산: ${shown(a, '+', b)}`, facts: { estimate: [a, '+', b], calc: [[E(a, '+', b), 1]] }
            });
          }),
          T('est-tens', '몇백몇십으로 어림하여 계산하기', '116', (d) => {
            // 563-149 → 560-150=410
            const near = (lo, hi) => d.until(() => d.int(lo, hi), (v) => plain(v) && [1, 2, 3, 7, 8, 9].includes(v % 10));
            const a = near(410, 890), b = near(120, 290), ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10;
            return N(`${a} − ${josa(b, '을/를')} 몇백몇십으로 어림하여 계산한 값은?`, ra - rb, {
              lead: '약', explain: `${josa(a, '은/는')} 약 ${ra}, ${josa(b, '은/는')} 약 ${rb}이다. ` + shown(ra, '-', rb), facts: { estimateTens: [a, '-', b] }
            });
          }),
          T('est-over', '어림한 결과가 기준보다 작은 식', '117', (d) => {
            // 600보다 작은 것: ㉠ 357+284 ㉡ 469+151 ㉢ 743-158 ㉣ 915-230
            const target = d.pick([500, 600, 700]);
            const make = (op) => (op === '+' ? [roundish(d, 2, 5), '+', roundish(d, 1, 4)] : [roundish(d, 6, 9), '-', roundish(d, 1, 3)]);
            const value = ([a, op, b]) => result(toHundred(a), op, toHundred(b));
            const rows = d.until(() => d.shuffle([make('+'), make('+'), make('-'), make('-')]), (list) => { const v = list.map(value); return v.filter((x) => x < target).length === 1 && v.every((x) => x !== target && x > 0 && Math.abs(x - target) <= 300); });
            return C(`각 수를 몇백으로 어림하여 계산할 때, 어림한 결과가 ${target}보다 작은 것은?`, LABELS.slice(0, 4), rows.findIndex((row) => value(row) < target), {
              figure: tagged(rows.map(([a, op, b]) => expr(a, op, b))), explain: rows.map(([a, op, b], i) => `${LABELS[i]} ${shown(toHundred(a), op, toHundred(b))}`).join(', '),
              facts: { estimateChoose: { rows, target, want: 'below' } }
            });
          }),
          T('est-closer', '실제 값에 더 가까운 어림', '118', (d) => {
            // 798-306: 700-400=300쯤 / 800-300=500쯤
            const a = nearHundred(d, 6, 9), b = nearHundred(d, 2, 4), ra = toHundred(a), rb = toHundred(b);
            const list = d.shuffle([[ra, rb], [ra - 100, rb + 100]]);
            return C(`${a} − ${josa(b, '을/를')} 두 가지로 어림하였다. 실제 계산 결과에 더 가깝게 어림한 것은?`, list.map(([x, y]) => `${expr(x, '-', y, '=', x - y)}쯤`), list.findIndex(([x, y]) => x === ra && y === rb), {
              explain: `${josa(a, '은/는')} ${ra}에, ${josa(b, '은/는')} ${rb}에 가깝다. 실제 계산 결과는 ${shown(a, '-', b)}이다.`, facts: { closer: { expr: E(a, '-', b), estimates: list.map(([x, y]) => x - y) } }
            });
          }),
          T('est-judge', '어림셈으로 살 수 있는지 판단하기', '111', (d) => {
            // 두 물건의 값 594원, 813원, 가진 돈 1300원 → 600+800=1400, 살 수 없다
            const a = d.int(4, 7) * 100 - d.int(4, 15), b = d.int(6, 9) * 100 + d.int(4, 15), est = toHundred(a) + toHundred(b), can = d.bool(), money = est + (can ? 100 : -100);
            const say = (value, ok) => `약 ${value}원이므로 살 수 ${ok ? '있다' : '없다'}.`;
            const list = d.shuffle([[est, true], [est, false], [est - 200, true], [est + 200, false]]);
            return C(`공책 한 권은 ${a}원, 필통 한 개는 ${b}원이다. ${money}원으로 공책 한 권과 필통 한 개를 살 수 있는지 어림셈으로 알아본 것으로 옳은 것은?`, list.map(([value, ok]) => say(value, ok)), list.findIndex(([value, ok]) => value === est && ok === can), {
              explain: `${josa(a, '은/는')} 약 ${toHundred(a)}, ${josa(b, '은/는')} 약 ${toHundred(b)}이므로 두 물건의 값은 약 ${shown(toHundred(a), '+', toHundred(b))}(원)이다. 실제 값은 ${shown(a, '+', b)}(원)이다.`,
              facts: { judge: { need: `${a}+${b}`, have: String(money), shown: est, options: list } }
            });
          }),
          T('est-budget', '정해진 돈으로 살 수 있는 두 가지', '119', (d) => {
            // 1000원, 480·670·490·710원
            const goods = d.shuffle(['가위', '풀', '자', '색연필', '지우개', '수첩']).slice(0, 4);
            const price = (lo, hi) => d.int(lo, hi) * 10;
            const cheap = d.until(() => [price(41, 49), price(41, 49)], ([x, y]) => x !== y), dear = d.until(() => [price(61, 79), price(61, 79)], ([x, y]) => x !== y);
            const prices = [cheap[0], cheap[1], dear[0], dear[1]], order = d.shuffle([0, 1, 2, 3]);
            const list = order.map((k, i) => ({ name: goods[i], price: prices[k], kind: k })), of = (kind) => list.find((row) => row.kind === kind);
            const pairs = d.shuffle([[0, 1], [0, 2], [1, 3], [2, 3]]);
            return C('문구점에서 1000원으로 학용품을 두 가지 사려고 한다. 살 수 있는 것은?', pairs.map(([x, y]) => `${of(x).name}, ${of(y).name}`), pairs.findIndex(([x, y]) => x === 0 && y === 1), {
              figure: '<div class="mb-prices">' + list.map((row) => `<span><b>${row.name}</b>${row.price}원</span>`).join('') + '</div>',
              explain: `두 학용품의 값의 합이 1000원을 넘지 않아야 한다. ${josa(of(0).name, '과/와')} ${of(1).name}의 값의 합은 ${shown(of(0).price, '+', of(1).price)}(원)이다.`,
              facts: { budget: 1000, prices: list.map((row) => row.price), pairs2: pairs.map(([x, y]) => [of(x).price, of(y).price]) }
            });
          })
        ]
      },
      {
        id: 'mix', title: '덧셈과 뺄셈', standard: CALC,
        types: [
          T('mix-bar', '띠 그림의 빈칸', '9', (d) => {
            // 전체 652 가운데 한 부분이 285일 때 나머지 부분
            const [a, b] = subPair(d, SUB.any);
            return N('띠 그림에서 □ 안에 알맞은 수는?', a - b, {
              figure: bar(a, b, '□', Math.min(0.7, Math.max(0.3, b / a))), explain: `전체에서 한 부분을 빼면 나머지 부분이다. ${shown(a, '-', b)}`, facts: { calc: [[E(a, '-', b), 0]], pair: [a, '-', b] }
            });
          }),
          T('mix-chain', '이어서 계산하기', '5', (d) => {
            // 358 → +276 → -188
            const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 999 && x + y >= 340), c = d.until(() => three(d, 120, a + b - 105), (v) => SUB.any(borrowPlaces(a + b, v)));
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: a + b - c }], {
              figure: chain([a, '+' + b, box(LABELS[0]), '-' + c, box(LABELS[1])]), explain: `${shown(a, '+', b)}, ${shown(a + b, '-', c)}`,
              facts: { calc: [[`${a}+${b}`, 0], [`${a}+${b}-${c}`, 1]] }
            });
          }),
          T('mix-ends', '가장 큰 수와 가장 작은 수의 합과 차', '59', (d) => {
            // 352, 214, 175, 289 → 527, 177
            const list = d.until(() => apart(d, 4, 110, 890, 15), (xs) => { const big = Math.max(...xs), small = Math.min(...xs); return ADD.any(carryPlaces(big, small)) && SUB.any(borrowPlaces(big, small)); });
            const big = Math.max(...list), small = Math.min(...list);
            return M('네 수 중 가장 큰 수와 가장 작은 수의 합과 차는?', [{ label: '합', answer: big + small }, { label: '차', answer: big - small }], {
              figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${shown(big, '+', small)}, ${shown(big, '-', small)}`,
              facts: { ends: list, calc: [[E(big, '+', small), 0], [E(big, '-', small), 1]] }
            });
          }),
          T('mix-order', '계산 결과가 큰 것부터 차례대로', '30', (d) => {
            // ㉠ 147+149 ㉡ 453-269 ㉢ 685-498
            const rows = d.until(() => d.shuffle([['+', addPair(d, (c, x, y) => ADD.any(c) && x + y <= 990)], ['-', subPair(d, SUB.any)], ['-', subPair(d, SUB.any)]]), (list) => { const v = list.map(([op, [a, b]]) => result(a, op, b)).sort((p, q) => p - q); return v[1] - v[0] >= 3 && v[2] - v[1] >= 3 && v[2] - v[0] <= 150; });
            const values = rows.map(([op, [a, b]]) => result(a, op, b));
            const right = [0, 1, 2].sort((p, q) => values[q] - values[p]);
            const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C('계산 결과가 큰 것부터 차례대로 나열한 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: tagged(rows.map(([op, [a, b]]) => expr(a, op, b))), explain: rows.map(([op, [a, b]], i) => `${LABELS[i]} ${shown(a, op, b)}`).join(', '),
              facts: { choose: { exprs: rows.map(([op, [a, b]]) => E(a, op, b)), rule: 'descending', orders: list } }
            });
          }),
          T('mix-count', '기준 수보다 큰 계산 결과', '31', (d) => {
            // 500보다 큰 것: ㉠ 345+181 ㉡ 259+237 ㉢ 173+319 ㉣ 264+275
            const target = d.pick([400, 500, 600]);
            const rows = d.until(() => d.shuffle(['+', '+', '-', '-'].map((op) => [op, pairNear(d, op, target - 60, target + 60)])), (list) => { const v = list.map(([op, [a, b]]) => result(a, op, b)); const hit = v.filter((x) => x > target).length; return hit >= 1 && hit <= 3 && v.every((x) => x !== target) && new Set(v).size === 4; });
            const hit = rows.filter(([op, [a, b]]) => result(a, op, b) > target).length;
            return N(`계산 결과가 ${target}보다 큰 것은 모두 몇 개인가?`, hit, {
              unit: '개', figure: tagged(rows.map(([op, [a, b]]) => expr(a, op, b))), explain: rows.map(([op, [a, b]], i) => `${LABELS[i]} ${shown(a, op, b)}`).join(', '),
              facts: { choose: { exprs: rows.map(([op, [a, b]]) => E(a, op, b)), rule: 'countAbove', target } }
            });
          }),
          T('mix-wrong', '잘못 계산한 것 고르기', '39', (d) => {
            // ㉠ 216+453=669 ㉡ 584+397=971 — 받아올림·받아내림을 빠뜨린 답 하나
            const rows = d.shuffle([['+', addPair(d, (c, x, y) => ADD.any(c) && x + y <= 999)], ['-', subPair(d, SUB.any)], ['+', addPair(d, ADD.none)]]);
            const bad = d.int(0, 2);
            const said = rows.map(([op, [a, b]], i) => result(a, op, b) + (i === bad ? (op === '+' ? -10 : 10) : 0));
            return C('잘못 계산한 것은?', LABELS.slice(0, 3), bad, {
              figure: tagged(rows.map(([op, [a, b]], i) => expr(a, op, b, '=', said[i]))), explain: `${LABELS[bad]}을 바르게 계산하면 ${shown(rows[bad][1][0], rows[bad][0], rows[bad][1][1])}이다.`,
              facts: { claimed: rows.map(([op, [a, b]], i) => [E(a, op, b), said[i]]), claimedWant: false }
            });
          }),
          T('mix-what', '어떤 수 구하기', '46', (d) => {
            // 어떤 수에 367을 더하였더니 789
            const [a, b] = subPair(d, (bw, x, y) => SUB.any(bw) && x - y >= 100);
            return N(`어떤 수에 ${josa(b, '을/를')} 더하였더니 ${josa(a, '이/가')} 되었다. 어떤 수는?`, a - b, { explain: `어떤 수는 ${a}에서 ${josa(b, '을/를')} 뺀 수이다. ` + shown(a, '-', b), facts: { calc: [[E(a, '-', b), 0]] } });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
