// 2학년 1학기 3단원 덧셈과 뺄셈 — 기본 문항(계산 결과 비교하기 · 세 수의 계산 · 덧셈과 뺄셈의 관계 · □가 사용된 식 · 문장제).
// 꼴 번호: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번. 싣는 기준은 2-1-3a.js 머리에 적었다.
//
// 뺀 것과 까닭(이 파일이 맡은 꼴 묶음 마·사·아·자·차에서)
//  - ①32(두 식 가운데 더 큰 것), ①36(두 계산 가운데 바른 것): ①30·①35와 하는 일이 같다(식 둘을 계산해 비교, 식=값을 따져 고르기).
//  - ①51의 세로셈 둘로 나누어 쓰기, ①52·심7의 빼고 더하는 화살표: 같은 계산을 다르게 그려 놓은 것이다(three-steps, three-chain 과 같은 일).
//  - ①57: 계산 결과 차례로 글자를 늘어놓아 낱말 만들기(글자 답).
//  - ①60·심31(덧셈식을 뺄셈식으로 나타낸 것 고르기), ①54(계산 순서), ①56(결과가 가장 큰 □+□−□), ①65(□의 값이 가장 큰 식), ①75(더 어리다 → □−4),
//    ①78(□가 든 덧셈식의 크기 비교), 심20, 심52: 실력 문항으로 옮겼다(2-1-3c.js).
//  - ①72·심42(전체와 한 부분으로 다른 부분): 「전체에서 한 부분」 문장제(word-part)와 같은 일이다. 심41(모자란 수)은 box-story-more 와 얼개가 같다.
//  - ①89(두 조건으로 나이 구하기): 조건 둘을 이어 풀어야 한다. ①76·심45(잘못 계산한 「어떤 수」)는 실력에 실었다(2-1-3c.js h-wrong-any).
//  - ①90·심46: 모르는 수가 둘이거나 거꾸로 두 번 풀어야 한다. 심44(수 카드로 수를 만든 뒤 □ 구하기)는 두 꼴을 이어 붙인 것이라 싣지 않았다.
//  - ①79·심38: 범위가 주어진 □에 들어갈 수를 「모두」 구하기. 심35·심37: □를 여럿 구해 비교하는 일은 실력 문항(h-box-max)에 한 번만 실었다. 심36: 두 □의 값을 다시 더하는 뜻 없는 셈.
//  - ①66·①68의 그림은 수집본에서 알 수 없어 띠 그림(전체와 두 부분)으로 새로 그렸다. ①69의 /으로 지우기, 심40의 방법 말하기는 그리기·서술형이다.
//  - 문장제는 얼개마다 하나씩 실었다: 합치기, 늘어나기, 덜어 내기, 전체에서 한 부분, 몇 더 많은가, 더 적은 쪽의 수,
//    세 수(줄었다가 늘어남, 늘었다가 줄어듦, 두 번 덜어 냄, 세 가지를 모두).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, cards, chain, lines, tagged, numbers, N, M, C, E, shown } = B.kit;
  const { tens, ones, upOnes, addTwo, addOne, subTwo, subRound, subOne, beads, band } = B.kit.g213;
  const CALC = '2수01-06', REL = '2수01-07', THREE = '2수01-08', BOX = '2수01-09', WORD = '2수01-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  // 두 계산 결과의 크기 비교
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const SIGNS = ['&gt;', '=', '&lt;'];
  const signOf = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const given = (html) => numbers([html]);   // 주어진 식을 띠로 묶어 보인다.
  // 주어진 식 아래에 빈칸이 있는 식을 쌓는다(넓은 화면에서도 옆으로 늘어서지 않게).
  const under = (top, rows) => '<div style="display:grid;gap:10px;justify-items:start">' + given(top) + lines(rows) + '</div>';
  // 합이 v 인 (몇십몇)+(몇십몇). test 로 조건을 더 건다.
  const withSum = (d, v, test) => d.until(() => { const x = d.int(Math.max(12, v - 98), Math.min(98, v - 12)); return [x, v - x]; }, ([x, y]) => x !== y && ones(x) > 0 && ones(y) > 0 && (!test || test(x, y)));
  // 차가 r 인 (몇십몇)−(몇십몇): 십의 자리에서 10을 가져온다(r 의 일의 자리 숫자는 2 이상).
  const withDiff = (d, r) => d.until(() => { const y = d.int(12, 98 - r); return [r + y, y]; }, ([x, y]) => ones(x) > 0 && ones(x) < ones(y));
  // 차가 r 인 (몇십)−(몇십몇)
  const roundDiff = (d, r) => { const a = d.pick([4, 5, 6, 7, 8, 9].filter((t) => t * 10 - r >= 11)) * 10; return [a, a - r]; };
  const labeled = (rows, op) => rows.map(([x, y], i) => `${LABELS[i]} ${shown(x, op, y)}`).join(', ');
  const word = (text, unit, a, op, b) => N(text, op === '+' ? a + b : a - b, { unit, explain: shown(a, op, b), facts: { calc: [[E(a, op, b), 0]] } });

  B.addGroup('2-1-3', {
    id: 'compare', title: '계산 결과 비교하기', standard: CALC,
    types: [
      T('cmp-match-add', '덧셈식과 계산 결과 짝 짓기', '①28 심18', (d) => {
        // 68+47, 59+52, 54+49 → 115, 111, 103. 일의 자리만 보아서는 짝이 정해지지 않게 두 합의 일의 자리 숫자를 같게 한다.
        const base = d.int(102, 150), offs = d.until(() => d.shuffle([0, 3, 4, 6, 7, 10, 13, 14, 16, 17, 20]).slice(0, 3), (o) => new Set(o.map((k) => (base + k) % 10)).size === 2);
        const pairs = d.until(() => offs.map((k) => withSum(d, base + k)), (list) => new Set(list.map(([x]) => x)).size === 3);
        const values = pairs.map(([x, y]) => x + y);
        const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
        return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
          figure: tagged(pairs.map(([x, y]) => expr(x, '+', y))), explain: labeled(pairs, '+'),
          facts: { match: { exprs: pairs.map(([x, y]) => E(x, '+', y)), options: list.map((o) => o.map((k) => values[k])) } }
        });
      }),
      T('cmp-match-sub', '뺄셈식과 계산 결과 짝 짓기', '①28 심18', (d) => {
        const base = d.int(12, 40), offs = d.until(() => d.shuffle([0, 2, 3, 5, 6, 10, 12, 13, 15, 16]).slice(0, 3), (o) => new Set(o.map((k) => (base + k) % 10)).size === 2 && o.every((k) => (base + k) % 10 >= 2));
        const pairs = d.until(() => offs.map((k) => (d.bool() ? withDiff(d, base + k) : roundDiff(d, base + k))), (list) => new Set(list.map(([x]) => x)).size >= 2);
        const values = pairs.map(([x, y]) => x - y);
        const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
        return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
          figure: tagged(pairs.map(([x, y]) => expr(x, '-', y))), explain: labeled(pairs, '-'),
          facts: { match: { exprs: pairs.map(([x, y]) => E(x, '-', y)), options: list.map((o) => o.map((k) => values[k])) } }
        });
      }),
      T('cmp-same', '계산 결과가 같은 두 식 찾기', '①29', (d) => {
        // 26+15, 15+28, 27+16, 14+27 가운데 합이 같은 것은 한 쌍뿐이다.
        const carry = (x, y) => upOnes(x, y);
        const rows = d.until(() => {
          const s = d.until(() => d.int(43, 92), (v) => ones(v) >= 2 && ones(v) <= 6), others = d.shuffle([-2, -1, 1, 2]).slice(0, 2);
          return d.shuffle([withSum(d, s, carry), withSum(d, s, carry), withSum(d, s + others[0], carry), withSum(d, s + others[1], carry)]);
        }, (list) => new Set(list.map(([x, y]) => Math.min(x, y))).size === 4);
        const values = rows.map(([x, y]) => x + y);
        const right = [0, 1, 2, 3].filter((i) => values.filter((v) => v === values[i]).length === 2);
        const all = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
        const list = d.shuffle(d.shuffle(all.filter((p) => p.join() !== right.join())).slice(0, 3).concat([right]));
        return C('계산 결과가 같은 두 식은?', list.map((p) => p.map((i) => LABELS[i]).join(', ')), list.findIndex((p) => p.join() === right.join()), {
          figure: tagged(rows.map(([x, y]) => expr(x, '+', y))), explain: labeled(rows, '+'),
          facts: { choose: { exprs: rows.map(([x, y]) => E(x, '+', y)), rule: 'same', pairsShown: list } }
        });
      }),
      T('cmp-two-sub', '두 뺄셈식의 계산 결과 비교', '①30 ①32', (d) => {
        const [a, b] = subTwo(d);
        const [c, e] = d.until(() => (d.bool() ? subTwo(d) : subRound(d)), ([x, y]) => x !== a && y !== b && x - y !== a - b && Math.abs(x - y - (a - b)) <= 8);
        const k = signOf(a - b, c - e);
        return C('계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, k, {
          figure: versus(expr(a, '-', b), expr(c, '-', e)), explain: `${shown(a, '-', b)}, ${shown(c, '-', e)}이고 ${a - b} ${SIGNS[k]} ${c - e}이다.`,
          facts: { choose: { exprs: [E(a, '-', b), E(c, '-', e)], rule: 'compare' } }
        });
      }),
      T('cmp-two-add', '두 덧셈식의 계산 결과 비교', '①30 심19', (d) => {
        // 9 + 52 ○ 3 + 59: 한 자리 수가 앞에 놓인 덧셈끼리
        const [a, b] = addOne(d);
        const [c, e] = d.until(() => addOne(d), ([x, y]) => x !== a && y !== b && x + y !== a + b && Math.abs(x + y - a - b) <= 6);
        const k = signOf(a + b, c + e);
        return C('계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, k, {
          figure: versus(expr(b, '+', a), expr(e, '+', c)), explain: `${shown(b, '+', a)}, ${shown(e, '+', c)}이고 ${a + b} ${SIGNS[k]} ${c + e}이다.`,
          facts: { choose: { exprs: [E(b, '+', a), E(e, '+', c)], rule: 'compare' } }
        });
      }),
      T('cmp-num-add', '덧셈식과 수의 크기 비교', '①31', (d) => {
        // 36 + 55 ○ 90, 63 + 38 ○ 100
        const over = d.bool();   // 합이 몇십보다 조금 큰가, 조금 작은가
        const [a, b] = addTwo(d, d.pick(['up', 'tens']), (x, y) => { const r = (x + y) % 10; return over ? r >= 1 && r <= 3 : r >= 7; }), s = a + b, other = Math.round(s / 10) * 10, k = signOf(s, other);
        return C('계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, k, {
          figure: versus(expr(a, '+', b), `<span class="mb-expr">${other}</span>`), explain: `${shown(a, '+', b)}이고 ${s} ${SIGNS[k]} ${other}이다.`,
          facts: { choose: { exprs: [E(a, '+', b), String(other)], rule: 'compare' } }
        });
      }),
      T('cmp-num-sub', '뺄셈식과 수의 크기 비교', '①31', (d) => {
        // 87 − 38 ○ 50
        const over = d.bool();   // 차가 몇십보다 조금 큰가, 조금 작은가
        const [a, b] = (d.bool() ? subRound : subTwo)(d, (x, y) => { const r = (x - y) % 10; return over ? r >= 1 && r <= 3 : r >= 7; }), c = a - b, other = Math.round(c / 10) * 10, k = signOf(c, other);
        return C('계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, k, {
          figure: versus(expr(a, '-', b), `<span class="mb-expr">${other}</span>`), explain: `${shown(a, '-', b)}이고 ${c} ${SIGNS[k]} ${other}이다.`,
          facts: { choose: { exprs: [E(a, '-', b), String(other)], rule: 'compare' } }
        });
      }),
      T('cmp-max-add', '계산 결과가 가장 큰 덧셈식', '①33 심19', (d) => {
        // 합이 모두 세 자리 수이고 서로 가깝다.
        const base = d.int(102, 150), offs = d.shuffle([0, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18]).slice(0, 4);
        const pairs = d.until(() => offs.map((k) => withSum(d, base + k)), (list) => new Set(list.map(([x]) => x)).size === 4);
        const values = pairs.map(([x, y]) => x + y);
        return C('계산 결과가 가장 큰 것은?', LABELS.slice(0, 4), values.indexOf(Math.max(...values)), {
          figure: tagged(pairs.map(([x, y]) => expr(x, '+', y))), explain: labeled(pairs, '+'),
          facts: { choose: { exprs: pairs.map(([x, y]) => E(x, '+', y)), rule: 'max' } }
        });
      }),
      T('cmp-min-sub', '계산 결과가 가장 작은 뺄셈식', '①33 심19', (d) => {
        // (몇십)−(몇십몇) 넷. 빼어지는 수가 둘 넘게 섞여 있다.
        const pairs = d.until(() => { const base = d.int(13, 36); return d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 4).map((k) => roundDiff(d, base + k)); },
          (list) => list.every(([, y]) => ones(y) > 0) && new Set(list.map(([x]) => x)).size >= 2 && new Set(list.map(([x, y]) => x + '-' + y)).size === 4);
        const values = pairs.map(([x, y]) => x - y);
        return C('계산 결과가 가장 작은 것은?', LABELS.slice(0, 4), values.indexOf(Math.min(...values)), {
          figure: tagged(pairs.map(([x, y]) => expr(x, '-', y))), explain: labeled(pairs, '-'),
          facts: { choose: { exprs: pairs.map(([x, y]) => E(x, '-', y)), rule: 'min' } }
        });
      }),
      T('cmp-above', '계산 결과가 기준 수보다 큰 식', '①33', (d) => {
        // 25보다 큰 것: ㉠ 60−35 ㉡ 80−56 ㉢ 90−64
        const target = d.pick([25, 35, 45]);
        const results = d.shuffle([target + d.int(1, 4), target - d.int(1, 2), target - d.int(3, 4)]);
        const pairs = d.until(() => results.map((r) => roundDiff(d, r)), (list) => new Set(list.map(([x]) => x)).size >= 2);
        return C(`계산 결과가 ${target}보다 큰 것은?`, LABELS.slice(0, 3), results.findIndex((r) => r > target), {
          figure: tagged(pairs.map(([x, y]) => expr(x, '-', y))), explain: labeled(pairs, '-'),
          facts: { choose: { exprs: pairs.map(([x, y]) => E(x, '-', y)), rule: 'onlyAbove', target } }
        });
      }),
      T('cmp-order', '계산 결과가 큰 것부터 차례로', '①34', (d) => {
        // ㉠ 51−26 ㉡ 72−48 ㉢ 63−29
        const results = d.until(() => { const base = d.int(13, 45); return d.shuffle([0, 2, 3, 5, 6, 8, 9, 11, 12, 14]).slice(0, 3).map((k) => base + k); }, (rs) => rs.every((r) => ones(r) >= 2) && rs.every((r, i) => rs.every((q, j) => i === j || Math.abs(r - q) >= 2)));
        const pairs = d.until(() => results.map((r) => withDiff(d, r)), (list) => new Set(list.map(([x]) => x)).size === 3);
        const right = [0, 1, 2].sort((p, q) => results[q] - results[p]);
        const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
        return C('계산 결과가 큰 것부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
          figure: tagged(pairs.map(([x, y]) => expr(x, '-', y))), explain: labeled(pairs, '-'),
          facts: { choose: { exprs: pairs.map(([x, y]) => E(x, '-', y)), rule: 'descending', orders: list } }
        });
      }),
      T('cmp-right-add', '바르게 계산한 덧셈식', '①35 ①36 심16', (d) => {
        // ① 57+62=109 ② 64+49=113 ③ 72+38=100 ④ 75+38=115: 하나만 맞다. 틀린 값은 올린 1을 빠뜨렸거나 한 번 더 더한 값이다.
        const rows = d.until(() => [addTwo(d, 'up'), addTwo(d, 'up'), addTwo(d, 'up'), addTwo(d, 'up')], (list) => new Set(list.map(([x]) => x)).size === 4);
        const good = d.int(0, 3), slips = d.shuffle([-10, -10, 10]);
        const said = rows.map(([x, y], i) => x + y + (i === good ? 0 : slips[i < good ? i : i - 1]));
        return C('바르게 계산한 것은?', LABELS.slice(0, 4), good, {
          figure: tagged(rows.map(([x, y], i) => expr(x, '+', y, '=', said[i]))), explain: labeled(rows, '+'),
          facts: { claimed: rows.map(([x, y], i) => [E(x, '+', y), said[i]]), claimedWant: true }
        });
      }),
      T('cmp-right-sub', '바르게 계산한 뺄셈식', '①35 ①36 심16', (d) => {
        // 틀린 값은 십의 자리 수를 1 줄이지 않았거나 일의 자리 수를 거꾸로 뺀 값이다.
        const rows = d.until(() => [subTwo(d), subTwo(d), subTwo(d), subTwo(d)], (list) => new Set(list.map(([x]) => x)).size === 4);
        const good = d.int(0, 3), slips = d.shuffle(['keep', 'keep', 'back']);
        const wrong = ([x, y], slip) => (slip === 'keep' ? x - y + 10 : (tens(x) - tens(y)) * 10 + ones(y) - ones(x));
        const said = rows.map((r, i) => (i === good ? r[0] - r[1] : wrong(r, slips[i < good ? i : i - 1])));
        return C('바르게 계산한 것은?', LABELS.slice(0, 4), good, {
          figure: tagged(rows.map(([x, y], i) => expr(x, '-', y, '=', said[i]))), explain: labeled(rows, '-'),
          facts: { claimed: rows.map(([x, y], i) => [E(x, '-', y), said[i]]), claimedWant: true }
        });
      }),
      T('cmp-bigger', '계산 결과보다 큰(작은) 수 고르기', '①77', (d) => {
        // 18 + 23 < □ 또는 18 + 23 > □. 보기에는 계산 결과와 같은 수도 들어 있다.
        const [a, b] = addTwo(d, 'ones'), s = a + b, less = d.bool();
        const options = less ? [s - 2, s - 1, s, s + 1] : [s - 1, s, s + 1, s + 2], right = less ? s + 1 : s - 1;
        return C('□ 안에 들어갈 수 있는 수는?', options.map(String), options.indexOf(right), {
          figure: expr(a, '+', b, less ? '<i>&lt;</i>' : '<i>&gt;</i>', box()), explain: `${shown(a, '+', b)}이므로 □ 안에는 ${s}보다 ${less ? '큰' : '작은'} 수가 들어간다.`,
          facts: { only: { values: options, test: less ? 'atLeast' : 'atMost', target: right } }
        });
      })
    ]
  });

  B.addGroup('2-1-3', {
    id: 'three', title: '세 수의 계산', standard: THREE,
    types: [
      T('three-add-sub', '더하고 빼기', '①49', (d) => {
        // 29 + 42 − 12
        const [a, b] = addTwo(d, 'ones'), s = a + b, c = d.until(() => d.int(12, s - 6), (v) => ones(v) > ones(s));
        return N('다음을 계산하시오.', s - c, {
          figure: expr(a, '+', b, '-', c, '=', box()), explain: `앞에서부터 차례로 계산한다. ${shown(a, '+', b)}, ${shown(s, '-', c)}`,
          facts: { calc: [[`${a}+${b}-${c}`, 0]] }
        });
      }),
      T('three-sub-add', '빼고 더하기', '①50', (d) => {
        // 54 − 16 + 28
        const [a, b] = subTwo(d), m = a - b, c = d.until(() => d.int(4, 99 - m), (v) => ones(v) > 0 && upOnes(m, v));
        return N('다음을 계산하시오.', m + c, {
          figure: expr(a, '-', b, '+', c, '=', box()), explain: `앞에서부터 차례로 계산한다. ${shown(a, '-', b)}, ${shown(m, '+', c)}`,
          facts: { calc: [[`${a}-${b}+${c}`, 0]] }
        });
      }),
      T('three-sum', '세 수의 합', '①53', (d) => {
        // 37, 17, 48 → 102. 어느 두 수를 먼저 더해도 두 자리 수가 된다.
        const [a, b, c] = d.until(() => [d.int(12, 49), d.int(12, 49), d.int(12, 49)], ([x, y, z]) => new Set([x, y, z]).size === 3 && [x, y, z].every((v) => ones(v) > 0) && upOnes(x, y) && upOnes(x + y, z));
        return N('세 수의 합은?', a + b + c, {
          figure: numbers([a, b, c]), explain: `${shown(a, '+', b)}, ${shown(a + b, '+', c)}`,
          facts: { calc: [[`${a}+${b}+${c}`, 0]] }
        });
      }),
      T('three-steps', '계산 순서에 따라 가운데 결과와 답 구하기', '①51 심7', (d) => {
        // 45 − 19 + 15 → 26, 41
        const [a, b] = subTwo(d, (x, y) => x - y <= 70), m = a - b, c = d.until(() => d.int(12, 99 - m), (v) => ones(v) > 0 && upOnes(m, v));
        return M('앞에서부터 차례로 계산한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: m }, { label: LABELS[1], answer: m + c }], {
          figure: under(expr(a, '-', b, '+', c), [expr(a, '-', b, '=', box(LABELS[0])), expr(box(LABELS[0]), '+', c, '=', box(LABELS[1]))]),
          explain: `${shown(a, '-', b)}, ${shown(m, '+', c)}`,
          facts: { calc: [[E(a, '-', b), 0], [`${a}-${b}+${c}`, 1]] }
        });
      }),
      T('three-chain', '화살표를 따라 더하고 빼기', '①52', (d) => {
        // 49 → +8 → −35
        const [a, b] = addOne(d), s = a + b, c = d.until(() => d.int(12, s - 5), (v) => ones(v) > 0);
        return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: s }, { label: LABELS[1], answer: s - c }], {
          figure: chain([a, '+' + b, box(LABELS[0]), '-' + c, box(LABELS[1])]), explain: `${shown(a, '+', b)}, ${shown(s, '-', c)}`,
          facts: { calc: [[`${a}+${b}`, 0], [`${a}+${b}-${c}`, 1]] }
        });
      }),
      T('three-chain-sub', '화살표를 따라 두 번 빼기', '①52 심7', (d) => {
        // 80 → −25 → −19
        const [a, b] = (d.bool() ? subRound : subTwo)(d, (x, y) => x - y >= 15 && ones(x - y) <= 8), m = a - b, c = d.until(() => d.int(4, m - 3), (v) => ones(v) > ones(m));
        return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: m }, { label: LABELS[1], answer: m - c }], {
          figure: chain([a, '-' + b, box(LABELS[0]), '-' + c, box(LABELS[1])]), explain: `${shown(a, '-', b)}, ${shown(m, '-', c)}`,
          facts: { calc: [[`${a}-${b}`, 0], [`${a}-${b}-${c}`, 1]] }
        });
      }),
      T('three-ends', '가장 큰 수와 가장 작은 수의 합에서 나머지 수 빼기', '①55', (d) => {
        // 60, 34, 49 → 60 + 34 − 49
        const xs = d.until(() => [d.int(12, 80), d.int(12, 80), d.int(12, 80)], (list) => { const s = list.slice().sort((p, q) => p - q); return s[1] - s[0] >= 5 && s[2] - s[1] >= 5 && s[2] + s[0] <= 99 && upOnes(s[2], s[0]) && ones(s[2] + s[0]) < ones(s[1]); });
        const s = xs.slice().sort((p, q) => p - q);
        return N('가장 큰 수와 가장 작은 수를 더한다. 그 합에서 나머지 수를 뺀 값은?', s[2] + s[0] - s[1], {
          figure: numbers(xs), explain: `${shown(s[2], '+', s[0])}, ${shown(s[2] + s[0], '-', s[1])}`,
          facts: { ends3: xs }
        });
      })
    ]
  });

  B.addGroup('2-1-3', {
    id: 'relation', title: '덧셈과 뺄셈의 관계', standard: REL,
    types: [
      T('rel-add-sub', '덧셈식을 뺄셈식 2개로 나타내기', '①58 심29', (d) => {
        // 68 + 19 = 87 → 87 − 68 = ㉠, ㉡ − 19 = ㉢
        const [a, b] = addTwo(d, 'ones'), s = a + b;
        return M('덧셈식을 뺄셈식으로 나타낸다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: s }, { label: LABELS[2], answer: a }], {
          figure: under(expr(a, '+', b, '=', s), [expr(s, '-', a, '=', box(LABELS[0])), expr(box(LABELS[1]), '-', b, '=', box(LABELS[2]))]),
          explain: `두 수의 합 ${s}에서 한 수를 빼면 다른 수가 된다. ${shown(s, '-', a)}, ${shown(s, '-', b)}`,
          facts: { calc: [[`${s}-${a}`, 0], [`${a}+${b}`, 1], [`${s}-${b}`, 2]] }
        });
      }),
      T('rel-sub-add', '뺄셈식을 덧셈식 2개로 나타내기', '①59 심30', (d) => {
        // 52 − 16 = 36 → 36 + ㉠ = 52, 16 + ㉡ = ㉢
        const [a, b] = subTwo(d, (x, y) => x - y !== y), c = a - b;
        return M('뺄셈식을 덧셈식으로 나타낸다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: c }, { label: LABELS[2], answer: a }], {
          figure: under(expr(a, '-', b, '=', c), [expr(c, '+', box(LABELS[0]), '=', a), expr(b, '+', box(LABELS[1]), '=', box(LABELS[2]))]),
          explain: `빼고 남은 수 ${c}에 뺀 수 ${josa(b, '을/를')} 더하면 처음 수 ${josa(a, '이/가')} 된다. ${shown(c, '+', b)}, ${shown(b, '+', c)}`,
          facts: { calc: [[`${a}-${c}`, 0], [`${a}-${b}`, 1], [`${c}+${b}`, 2]] }
        });
      }),
      T('rel-pick-add', '뺄셈식을 덧셈식으로 나타낸 것 고르기', '①61', (d) => {
        // 41 − 28 = 13 → 13 + 28 = 41
        const [a, b] = subTwo(d, (x, y) => x - y !== y), c = a - b;
        const right = d.bool() ? [c, b, a] : [b, c, a];
        const list = d.shuffle([right].concat(d.shuffle([[a, b, c], [a, c, b], [b, a, c], [c, a, b]]).slice(0, 3)));
        return C('뺄셈식을 덧셈식으로 바르게 나타낸 것은?', list.map(([x, y, z]) => expr(x, '+', y, '=', z)), list.indexOf(right), {
          figure: given(expr(a, '-', b, '=', c)),
          explain: `빼고 남은 수 ${c}에 뺀 수 ${josa(b, '을/를')} 더하면 처음 수 ${josa(a, '이/가')} 된다. ${shown(right[0], '+', right[1])}`,
          facts: { claimed: list.map(([x, y, z]) => [E(x, '+', y), z]), claimedWant: true }
        });
      }),
      T('rel-picture', '그림을 보고 덧셈식과 뺄셈식으로 나타내기', '①62', (d) => {
        // 검은 돌 9개, 흰 돌 7개 → 9 + ㉠ = ㉡, ㉡ − ㉠ = ㉢
        const a = d.int(6, 9), b = d.until(() => d.int(5, 9), (v) => v !== a && a + v >= 11);
        return M('바둑돌을 보고 덧셈식과 뺄셈식으로 나타낸다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a + b }, { label: LABELS[2], answer: a }], {
          figure: beads(a + b, { dark: a, label: `검은 바둑돌 ${a}개, 흰 바둑돌 ${b}개` }) + lines([expr(a, '+', box(LABELS[0]), '=', box(LABELS[1])), expr(box(LABELS[1]), '-', box(LABELS[0]), '=', box(LABELS[2]))]),
          explain: `검은 바둑돌은 ${a}개, 흰 바둑돌은 ${b}개이다. ${shown(a, '+', b)}, ${shown(a + b, '-', b)}`,
          facts: { calc: [[String(b), 0], [`${a}+${b}`, 1], [String(a), 2]] }
        });
      }),
      T('rel-cards', '수 카드 3장으로 덧셈식과 뺄셈식 만들기', '①63 심32', (d) => {
        // 37, 56, 19 → 37 + ㉠ = ㉡, ㉢ − 19 = ㉣
        const [a, b] = addTwo(d, 'ones'), s = a + b;
        return M('수 카드 3장을 모두 사용하여 덧셈식과 뺄셈식을 만든다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: s }, { label: LABELS[2], answer: s }, { label: LABELS[3], answer: a }], {
          figure: cards(d.shuffle([a, b, s])) + lines([expr(a, '+', box(LABELS[0]), '=', box(LABELS[1])), expr(box(LABELS[2]), '-', b, '=', box(LABELS[3]))]),
          explain: `가장 큰 수 ${josa(s, '이/가')} 나머지 두 수의 합이다. ${shown(a, '+', b)}, ${shown(s, '-', b)}`,
          facts: { calc: [[String(b), 0], [`${a}+${b}`, 1], [String(s), 2], [`${s}-${b}`, 3]] }
        });
      })
    ]
  });

  B.addGroup('2-1-3', {
    id: 'box', title: '□가 사용된 식', standard: BOX,
    types: [
      T('box-add-back', '덧셈식에서 더하는 수 구하기', '①64 심35', (d) => {
        // 28 + □ = 42
        const [c, a] = subTwo(d);
        return N('□ 안에 알맞은 수는?', c - a, {
          figure: expr(a, '+', box(), '=', c), explain: `${a}에 □를 더하면 ${c}이므로 □는 ${c}에서 ${josa(a, '을/를')} 뺀 수이다. ${shown(c, '-', a)}`,
          facts: { inverse: ['b+x=a', c, a, 0], calc: [[E(c, '-', a), 0]] }
        });
      }),
      T('box-add-front', '덧셈식에서 더해지는 수 구하기', '①64', (d) => {
        // □ + 8 = 15
        const b = d.int(4, 9), x = d.until(() => d.int(3, 9), (v) => v + b >= 11 && v !== b), c = x + b;
        return N('□ 안에 알맞은 수는?', x, {
          figure: expr(box(), '+', b, '=', c), explain: `□에 ${josa(b, '을/를')} 더하면 ${c}이므로 □는 ${c}에서 ${josa(b, '을/를')} 뺀 수이다. ${shown(c, '-', b)}`,
          facts: { inverse: ['x+b=a', c, b, 0], calc: [[E(c, '-', b), 0]] }
        });
      }),
      T('box-sub-back', '뺄셈식에서 빼는 수 구하기', '①64', (d) => {
        // 16 − □ = 8
        const a = d.int(11, 18), c = d.until(() => d.int(3, 9), (v) => v > ones(a) && a - v >= 2), x = a - c;
        return N('□ 안에 알맞은 수는?', x, {
          figure: expr(a, '-', box(), '=', c), explain: `${a}에서 □를 빼면 ${c}이므로 □는 ${a}에서 ${josa(c, '을/를')} 뺀 수이다. ${shown(a, '-', c)}`,
          facts: { inverse: ['a-x=c', a, 0, c], calc: [[E(a, '-', c), 0]] }
        });
      }),
      T('box-sub-front', '뺄셈식에서 처음 수 구하기', '①64 심33', (d) => {
        // □ − 59 = 35
        const [b, c] = addTwo(d, 'ones');
        return N('□ 안에 알맞은 수는?', b + c, {
          figure: expr(box(), '-', b, '=', c), explain: `□에서 ${josa(b, '을/를')} 빼면 ${c}이므로 □는 ${josa(c, '과/와')} ${b}의 합이다. ${shown(c, '+', b)}`,
          facts: { inverse: ['x-b=c', 0, b, c], calc: [[E(c, '+', b), 0]] }
        });
      }),
      T('box-band-pick', '그림에 알맞은 □ 식 고르기', '①66 ①67', (d) => {
        // 전체 □가 10과 8로 나뉜 그림 → □ − 10 = 8
        const [a, b] = d.until(() => [d.int(6, 28), d.int(6, 28)], ([x, y]) => Math.abs(x - y) >= 3);
        const rows = d.shuffle([
          { html: expr(box(), '-', a, '=', b), ok: true },
          { html: expr(a, '-', box(), '=', b), ok: false },   // 전체와 부분의 자리를 바꾼 식
          { html: expr(box(), '+', a, '=', b), ok: false },   // 한 부분을 전체로 본 식
          { html: expr(a, '+', box(), '=', b), ok: false }
        ]);
        return C('그림에 알맞은 식은?', rows.map((r) => r.html), rows.findIndex((r) => r.ok), {
          figure: band('□', a, b), explain: `전체 □에서 한 부분 ${josa(a, '을/를')} 빼면 다른 부분 ${josa(b, '이/가')} 남는다.`,
          facts: { truth: rows.map((r) => r.ok), want: true }
        });
      }),
      T('box-band', '그림에서 □의 값 구하기', '①67 ①68 심34', (d) => {
        // 29와 □를 이어 52가 되는 그림
        const [total, a] = subTwo(d);
        return N('그림에서 □ 안에 알맞은 수는?', total - a, {
          figure: d.bool() ? band(total, a, '□') : band(total, '□', a), explain: `전체 ${total}에서 한 부분 ${josa(a, '을/를')} 빼면 다른 부분이다. ${shown(total, '-', a)}`,
          facts: { calc: [[E(total, '-', a), 0]] }
        });
      }),
      T('box-story-pick', '문장에 알맞은 □ 식 고르기', '①69', (d) => {
        // 귤 15개 중 몇 개를 먹었더니 7개가 남음 → 15 − □ = 7
        const a = d.int(11, 17), c = d.until(() => d.int(3, 9), (v) => a - v >= 2 && a - v <= 9 && v !== a - v);
        const rows = d.shuffle([
          { html: expr(a, '-', box(), '=', c), ok: true },
          { html: expr(box(), '-', c, '=', a), ok: false },   // 먹은 수를 처음 수 자리에 놓은 식
          { html: expr(a, '+', box(), '=', c), ok: false },   // 줄어든 것을 덧셈으로 쓴 식
          { html: expr(box(), '-', a, '=', c), ok: false }
        ]);
        return C(`귤이 ${a}개 있었다. 몇 개를 먹었더니 ${c}개가 남았다. 먹은 귤의 수를 □로 하여 만든 식은?`, rows.map((r) => r.html), rows.findIndex((r) => r.ok), {
          explain: `처음에 있던 ${a}개에서 먹은 □개를 빼면 ${c}개가 남는다.`,
          facts: { truth: rows.map((r) => r.ok), want: true }
        });
      }),
      T('box-story-more', '늘어난 수 구하기', '①70 심40 심41', (d) => {
        // 18장을 모았고 몇 장을 더 모아 50장
        const who = d.pick(NAMES), [c, a] = (d.bool() ? subRound : subTwo)(d);
        return N(`${name(who, '은/는')} 붙임딱지를 ${a}장 모았다. 몇 장을 더 모았더니 ${c}장이 되었다. 더 모은 붙임딱지는 몇 장인가?`, c - a, {
          unit: '장', explain: `더 모은 수를 □로 하면 ${expr(a, '+', box(), '=', c)}이다. ${shown(c, '-', a)}`,
          facts: { calc: [[E(c, '-', a), 0]] }
        });
      }),
      T('box-story-less', '줄어든 수 구하기', '①71 심43', (d) => {
        // 색종이 45장 중 몇 장을 썼더니 28장
        const [a, b] = subTwo(d), c = a - b;
        return N(`색종이가 ${a}장 있었다. 몇 장을 사용했더니 ${c}장이 남았다. 사용한 색종이는 몇 장인가?`, b, {
          unit: '장', explain: `사용한 수를 □로 하면 ${expr(a, '-', box(), '=', c)}이다. ${shown(a, '-', c)}`,
          facts: { calc: [[E(a, '-', c), 0]] }
        });
      }),
      T('box-story-first', '더 받기 전의 처음 수 구하기', '①73', (d) => {
        // 몇 장에 8장을 더 받아 48장
        const who = d.pick(NAMES), [c, b] = (d.bool() ? subOne : subTwo)(d);
        return N(`${name(who, '은/는')} 스티커를 몇 장 가지고 있었다. ${b}장을 더 받았더니 ${c}장이 되었다. 처음에 가지고 있던 스티커는 몇 장인가?`, c - b, {
          unit: '장', explain: `처음 수를 □로 하면 ${expr(box(), '+', b, '=', c)}이다. ${shown(c, '-', b)}`,
          facts: { calc: [[E(c, '-', b), 0]] }
        });
      }),
      T('box-what', '어떤 수 구하기', '①74 심39', (d) => {
        // 어떤 수에 56을 더하였더니 70
        const [c, b] = (d.bool() ? subRound : subTwo)(d);
        return N(`어떤 수에 ${josa(b, '을/를')} 더하였더니 ${josa(c, '이/가')} 되었다. 어떤 수는?`, c - b, {
          explain: `어떤 수를 □로 하면 ${expr(box(), '+', b, '=', c)}이다. ${shown(c, '-', b)}`,
          facts: { calc: [[E(c, '-', b), 0]] }
        });
      }),
      T('box-diff', '차가 주어진 수가 되는 수 고르기', '심22', (d) => {
        // 83과의 차가 68인 수(보기는 모두 83보다 작다)
        const [a, x] = subTwo(d), c = a - x;
        // 정답이 보기의 어느 자리에나 고르게 오도록 정답보다 작은 보기의 수부터 정한다.
        const below = d.shuffle([x - 10, x - 8, x - 2].filter((v) => v >= 10)), above = d.shuffle([x + 2, x + 8, x + 10]), low = d.int(0, below.length);
        const options = [x].concat(below.slice(0, low), above.slice(0, 3 - low)).sort((p, q) => p - q);
        return C(`${josa(a, '과/와')}의 차가 ${c}인 수는?`, options.map(String), options.indexOf(x), {
          explain: `보기의 수는 모두 ${a}보다 작으므로 ${a}에서 ${josa(c, '을/를')} 뺀다. ${shown(a, '-', c)}`,
          facts: { pick: { expr: E(a, '-', c), options } }
        });
      })
    ]
  });

  B.addGroup('2-1-3', {
    id: 'word', title: '문장제', standard: WORD,
    types: [
      T('word-join', '합치기', '①80 심47', (d) => {
        const [a, b] = addTwo(d, 'big');
        return word(`과수원에서 사과를 어제 ${a}개, 오늘 ${b}개 땄다. 어제와 오늘 딴 사과는 모두 몇 개인가?`, '개', a, '+', b);
      }),
      T('word-grow', '늘어나기', '①81', (d) => {
        const who = d.pick(NAMES), [a, b] = addTwo(d, 'ones');
        return word(`${who}의 사진첩에 사진이 ${a}장 있다. 사진 ${b}장을 더 넣었다. 사진첩에 있는 사진은 모두 몇 장인가?`, '장', a, '+', b);
      }),
      T('word-take', '덜어 내고 남은 것', '①82 심48', (d) => {
        const [a, b] = subRound(d);
        return word(`바구니에 밤이 ${a}개 있었다. 그중 ${b}개를 먹었다. 남은 밤은 몇 개인가?`, '개', a, '-', b);
      }),
      T('word-part', '전체에서 한 부분', '①82 ①72 심42 심48', (d) => {
        const [a, b] = subTwo(d);
        return word(`체험 학습에 간 학생은 모두 ${a}명이다. 그중 남학생은 ${b}명이다. 여학생은 몇 명인가?`, '명', a, '-', b);
      }),
      T('word-compare', '몇 더 많은가', '①83 심49', (d) => {
        const [one, two] = d.shuffle(NAMES).slice(0, 2), [a, b] = subTwo(d);
        return word(`딱지를 ${name(one, '은/는')} ${a}장, ${name(two, '은/는')} ${b}장 가지고 있다. ${name(one, '은/는')} ${nick(two)}보다 딱지를 몇 장 더 많이 가지고 있는가?`, '장', a, '-', b);
      }),
      T('word-fewer', '더 적은 쪽의 수', '①84', (d) => {
        const [a, b] = subOne(d);
        return word(`과일 가게에 귤이 ${a}개 있다. 사과는 귤보다 ${b}개 더 적다. 사과는 몇 개인가?`, '개', a, '-', b);
      }),
      T('word-off-on', '세 수: 줄었다가 늘어남', '①85 심50', (d) => {
        // 버스에 45명, 18명이 내리고 14명이 탐
        const [a, b] = subTwo(d, (x) => x <= 48), m = a - b, c = d.until(() => d.int(5, 29), (v) => ones(v) > 0 && upOnes(m, v) && m + v <= 60);
        return N(`버스에 ${a}명이 타고 있었다. 정류장에서 ${b}명이 내리고 ${c}명이 탔다. 지금 버스에 타고 있는 사람은 몇 명인가?`, m + c, {
          unit: '명', explain: `${shown(a, '-', b)}, ${shown(m, '+', c)}`, facts: { calc: [[`${a}-${b}+${c}`, 0]] }
        });
      }),
      T('word-on-off', '세 수: 늘었다가 줄어듦', '①86', (d) => {
        // 24명, 17명이 더 오고 14명이 감
        const [a, b] = addTwo(d, 'ones', (x, y) => x + y <= 80), s = a + b, c = d.until(() => d.int(12, s - 5), (v) => ones(v) > ones(s));
        return N(`운동장에 학생이 ${a}명 있었다. 학생 ${b}명이 더 왔다. 잠시 뒤 ${c}명이 교실로 들어갔다. 운동장에 남은 학생은 몇 명인가?`, s - c, {
          unit: '명', explain: `${shown(a, '+', b)}, ${shown(s, '-', c)}`, facts: { calc: [[`${a}+${b}-${c}`, 0]] }
        });
      }),
      T('word-twice', '세 수: 두 번 덜어 냄', '①87 심51', (d) => {
        // 91쪽짜리 책을 어제 37쪽, 오늘 35쪽 읽음
        const who = d.pick(NAMES), [a, b] = subTwo(d, (x, y) => x - y >= 20 && ones(x - y) <= 8), m = a - b, c = d.until(() => d.int(12, m - 3), (v) => ones(v) > ones(m));
        return N(`${name(who, '은/는')} ${a}쪽짜리 동화책을 읽는다. 어제 ${b}쪽을 읽고 오늘 ${c}쪽을 읽었다. 아직 읽지 않은 쪽은 몇 쪽인가?`, m - c, {
          unit: '쪽', explain: `${shown(a, '-', b)}, ${shown(m, '-', c)}`, facts: { calc: [[`${a}-${b}-${c}`, 0]] }
        });
      }),
      T('word-all', '세 수: 세 가지를 모두', '①88', (d) => {
        // 백합 12송이, 장미 26송이, 튤립 17송이
        const [a, b, c] = d.until(() => [d.int(12, 39), d.int(12, 39), d.int(12, 39)], ([x, y, z]) => new Set([x, y, z]).size === 3 && [x, y, z].every((v) => ones(v) > 0) && upOnes(x, y) && upOnes(x + y, z));
        return N(`꽃집에 백합이 ${a}송이, 장미가 ${b}송이, 튤립이 ${c}송이 있다. 꽃은 모두 몇 송이인가?`, a + b + c, {
          unit: '송이', explain: `${shown(a, '+', b)}, ${shown(a + b, '+', c)}`, facts: { calc: [[`${a}+${b}+${c}`, 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
