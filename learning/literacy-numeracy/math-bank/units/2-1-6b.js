// 2학년 1학기 6단원 곱셈 — 나머지 기본 문항(덧셈식과 곱셈식, 그림을 곱셈식으로, 문장제)과 실력 문항.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 문항은 여기서 나온다)
//  - 「4씩 3묶음」의 두 수를 가리지 않는다. 한 묶음의 수와 묶음 수를 바꿔 묶은 그림도 같은 것으로 본다.
//  - 「~의 수는 ~의 수의 몇 배」에서 어느 쪽이 한 묶음인지 보지 않고, 그림에 보이는 줄 수나 한 줄의 수를 답한다.
//  - 5의 3배를 3 + 3 + 3 + 3 + 3이라고 쓴다(값은 같지만 3의 5배다).
//  - 8 + 8 + 8 + 8을 8 × 3이라고 쓴다(8이 아니라 + 기호를 센다). 「8에 8을 3번 더한 수」(8이 모두 4번)를 8 × 3이라고 한다.
//  - 한 묶음을 더 놓으면 곱하는 수가 1 커진다는 것을 모르고 처음부터 다시 센다.
//  - 가려진 그림에서 보이는 것만 센다(한 줄의 수와 줄 수를 읽어 「몇 개씩 몇 줄」로 보지 못한다).
//  - 문장에 나온 수를 차례로 곱한다(쓰지 않는 수를 가리지 못한다). 낱개가 따로 있어도 묶음으로 센다.
//
// 실력에 실은 것은 두 갈래다.
//  ① 문제의 상황·그림에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것: h-bundle-order, h-base, h-add-order, h-plus-count, h-one-more, h-covered, h-extra
//  ② 두 번 넘게 생각해야 풀리는 것(풀이는 두 번에 나누어 적는다): h-loose, h-both-have, h-minus, h-add-then, h-who, h-sum2, h-many-ways
// 기본에서 하는 일을 고르기로만 바꾼 것은 실력에 두지 않았다(읽은 말 고르기, 맞는 곱셈식 고르기, 나타내는 수가 다른 하나는 모두 기본이다).
// 싣지 않은 꼴과 까닭은 2-1-6a.js 머리에 적었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, lines, tagged, N, M, C, E } = B.kit;
  const { UNIT, MEAN, T, pair, plus, plusExpr, adds, why, WAYS, BOARD, THINGS, anyThing, array, groups, twoSets, covered, flowers, grow, tiles, versus, SIGNS } = B.kit.g216;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 ' + (/^심/.test(ref) ? '심화' : '기본') + ' 자료(' + ref + ')', make }, more || {});
  // 묶음 수를 하나 늘리거나 줄인다(2~9를 벗어나지 않고 곱이 40을 넘지 않게).
  const slip = (d, x, k) => (k >= 9 || x * (k + 1) > 40 ? k - 1 : k <= 2 ? k + 1 : d.bool() ? k + 1 : k - 1);

  B.addGroup(UNIT, {
    id: 'expr', title: '덧셈식과 곱셈식', standard: MEAN,
    types: [
      T('expr-add', '「몇의 몇 배」를 덧셈으로 구하기', '①35 심17', (d) => {
        const [a, n] = pair(d, (x, y) => x !== y && y <= 6);
        return M(`${a}의 ${n}배를 덧셈으로 구하려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: a * n }], {
          figure: lines([`${a}의 ${n}배는 ${josa(a, '을/를')} ${box(LABELS[0])}번 더한 수이다.`, `${a}의 ${n}배는 ${box(LABELS[1])}이다.`]),
          explain: `${a}의 ${n}배는 ${adds(a, n)}이다.`, facts: { calc: [[String(n), 0], [E(a, '*', n), 1]] }
        });
      }),
      T('expr-write', '「몇의 몇 배」를 곱셈식으로', '①36 ①37 심12 심20', (d) => {
        // 4의 3배는 4 × 3. 앞뒤 차례를 지켜 적는다.
        const [a, n] = pair(d, (x, y) => x !== y, 40);
        return M(`${a}의 ${n}배는 ${a * n}이다. 이것을 곱셈식으로 나타낼 때, ㉠, ㉡, ㉢에 알맞은 수는?`, [a, n, a * n].map((v, i) => ({ label: LABELS[i], answer: v })), {
          figure: expr(box(LABELS[0]), '*', box(LABELS[1]), '=', box(LABELS[2])),
          explain: `${a}의 ${n}배는 ${a} × ${josa(n, '이라고/라고')} 쓴다. ${a} × ${n} = ${a * n}이다.`, facts: { calc: [[String(a), 0], [String(n), 1], [E(a, '*', n), 2]] }
        });
      }),
      T('expr-say', '읽은 말을 곱셈식으로', '①38', (d) => {
        const [a, n] = pair(d, (x, y) => x !== y, 40), p = a * n;
        return M(`「${a} 곱하기 ${josa(n, '은/는')} ${josa(p, '과/와')} 같다.」를 곱셈식으로 나타낼 때, ㉠, ㉡, ㉢에 알맞은 수는?`, [a, n, p].map((v, i) => ({ label: LABELS[i], answer: v })), {
          figure: expr(box(LABELS[0]), '*', box(LABELS[1]), '=', box(LABELS[2])),
          explain: `곱하기는 ×, 같다는 =로 쓴다. ${a} × ${n} = ${p}이다.`, facts: { calc: [[String(a), 0], [String(n), 1], [E(a, '*', n), 2]] }
        });
      }),
      T('expr-read', '곱셈식 읽기', '①39', (d) => {
        // 틀린 보기: 두 수의 차례를 바꿔 읽은 것, ×를 더하기로 읽은 것, ×를 빼기로 읽은 것
        const [a, n] = pair(d, (x, y) => x !== y, 40), p = a * n;
        const rows = d.shuffle([
          [`${a} 곱하기 ${josa(n, '은/는')} ${josa(p, '과/와')} 같다.`, true],
          [`${n} 곱하기 ${josa(a, '은/는')} ${josa(p, '과/와')} 같다.`, false],
          [`${a} 더하기 ${josa(n, '은/는')} ${josa(p, '과/와')} 같다.`, false],
          [`${a} 빼기 ${josa(n, '은/는')} ${josa(p, '과/와')} 같다.`, false]
        ]);
        return C(`${a} × ${n} = ${josa(p, '을/를')} 바르게 읽은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
          explain: `×는 곱하기, =는 같다고 읽는다. 앞의 수부터 차례로 읽으면 「${a} 곱하기 ${josa(n, '은/는')} ${josa(p, '과/와')} 같다.」이다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
        });
      }),
      T('expr-talk', '곱셈식에 대한 설명', '①40', (d) => {
        const [a, n] = pair(d, (x, y) => x !== y && y >= 3 && y <= 5), p = a * n;
        const good = d.shuffle([
          `${plus(a, n - 1)} + ${josa(a, '과/와')} 같다.`,
          `${a}의 ${n}배이다.`,
          `${a} 곱하기 ${josa(n, '은/는')} ${josa(p, '과/와')} 같다고 읽는다.`,
          `${a}씩 ${n}묶음의 수이다.`
        ]).slice(0, 3);
        const bad = d.pick([
          `${n} 곱하기 ${josa(a, '은/는')} ${josa(p, '과/와')} 같다고 읽는다.`,   // 읽는 차례를 바꿈
          `${josa(a, '을/를')} ${n - 1}번 더한 것과 같다.`,                       // 더한 횟수를 하나 적게 셈
          `${a} + ${josa(n, '과/와')} 같다.`                                       // 곱셈과 덧셈을 헷갈림
        ]);
        const list = d.shuffle(good.concat([bad]));
        return C(`${a} × ${n} = ${p}에 대한 설명으로 틀린 것은?`, list, list.indexOf(bad), {
          explain: `${a} × ${josa(n, '은/는')} ${a}의 ${n}배이고, ${adds(a, n)}이다. 「${a} 곱하기 ${josa(n, '은/는')} ${josa(p, '과/와')} 같다.」라고 읽는다.`,
          facts: { truth: list.map((o) => o !== bad), want: false }
        });
      }),
      T('expr-sum', '덧셈식을 곱셈식으로', '①41 ①42 ①43 심21', (d) => {
        // 8 + 8 + 8 + 8 + 8 = 8 × □ = □ : 더한 횟수가 곱하는 수다.
        const [a, n] = pair(d, (x, y) => y >= 3 && y <= 6, 40);
        return M('덧셈식을 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: a * n }], {
          figure: lines(['<span class="mb-expr">' + Array.from({ length: n }, () => a).join(' <i>+</i> ') + '</span>', expr('=', a, '*', box(LABELS[0]), '=', box(LABELS[1]))]),
          explain: `${josa(a, '을/를')} ${n}번 더했으므로 ${a} × ${n}이다. ${adds(a, n)}이다.`, facts: { repeatAdd: { a, n } }
        });
      }),
      T('expr-wrong', '덧셈식을 곱셈식으로 잘못 나타낸 것', '①44', (d) => {
        // 틀린 줄은 더한 횟수보다 하나 적거나(+ 기호를 센 것) 하나 많은 수를 곱한다.
        const rows = d.until(() => [0, 1, 2].map(() => pair(d, (x, y) => y >= 3 && y <= 5)), (list) => new Set(list.map(([x]) => x)).size === 3);
        const bad = d.int(0, 2), said = rows.map(([a, n], i) => (i === bad ? (d.int(0, 2) || a * (n + 1) > 40 ? n - 1 : n + 1) : n));
        return C('덧셈식을 곱셈식으로 잘못 나타낸 것은?', LABELS.slice(0, 3), bad, {
          figure: tagged(rows.map(([a, n], i) => `${plus(a, n)} → ${a} × ${said[i]}`)),
          explain: `${LABELS[bad]}은 ${josa(rows[bad][0], '을/를')} ${rows[bad][1]}번 더했으므로 ${rows[bad][0]} × ${rows[bad][1]}이다.`,
          facts: { claimed: rows.map(([a, n], i) => [E(a, '*', said[i]), a * n]), claimedWant: false }
        });
      }),
      T('expr-odd', '나타내는 수가 다른 하나', '①45 심25', (d) => {
        // 묶음·배·거듭 더하기·곱셈식은 같은 수를 나타낸다. 다른 하나는 묶음 수가 다르거나 두 수를 더한 것이다.
        const [a, n] = pair(d, (x, y) => x !== y && y >= 3 && y <= 5 && x * (y + 1) <= 40);
        const same = d.shuffle([[plus(a, n), plusExpr(a, n)], [`${a}씩 ${n}묶음`, E(a, '*', n)], [`${a}의 ${n}배`, E(a, '*', n)], [`${a} × ${n}`, E(a, '*', n)], [`${a} 곱하기 ${n}`, E(a, '*', n)]]).slice(0, 3);
        const odd = d.pick([[`${a}의 ${n - 1}배`, E(a, '*', n - 1), a * (n - 1)], [`${a}의 ${n + 1}배`, E(a, '*', n + 1), a * (n + 1)], [`${a} + ${n}`, `${a}+${n}`, a + n], [plus(a, n + 1), plusExpr(a, n + 1), a * (n + 1)]]);
        const list = d.shuffle(same.concat([odd]));
        return C('나타내는 수가 나머지와 다른 것은?', list.map(([said]) => said), list.indexOf(odd), {
          explain: `${a}씩 ${n}묶음, ${a}의 ${n}배, ${plus(a, n)}, ${a} × ${josa(n, '은/는')} 모두 ${a * n}이다. ${odd[0]}만 ${odd[2]}이다.`,
          facts: { choose: { exprs: list.map(([, text]) => text), rule: 'odd' } }
        });
      }),
      T('expr-max', '나타내는 수가 가장 큰 것', '①46 심28', (d) => {
        // 셋을 저마다 거듭 더해 구한다. 두 수가 모두 가장 큰 것이 답이 되지 않게 고른다.
        const rows = d.until(() => [0, 1, 2].map(() => pair(d, (x, y) => y <= 6, 40)), (list) => {
          const v = list.map(([x, y]) => x * y), top = v.indexOf(Math.max.apply(null, v));
          return new Set(v).size === 3 && Math.max.apply(null, v) - Math.min.apply(null, v) <= 12 && new Set(list.map(([x]) => x)).size === 3 && list.every(([x, y], i) => i === top || !(list[top][0] >= x && list[top][1] >= y));
        });
        const forms = d.shuffle([(x, y) => `${x}의 ${y}배`, (x, y) => `${x} × ${y}`, (x, y) => `${x}씩 ${y}묶음`]), values = rows.map(([x, y]) => x * y);
        return C('나타내는 수가 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max.apply(null, values)), {
          figure: tagged(rows.map(([x, y], i) => forms[i](x, y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${adds(x, y)}`).join(', ') + '이다.',
          facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'max' } }
        });
      }),
      T('expr-compare', '곱셈식과 수의 크기 비교', '심27', (d) => {
        const [a, n] = pair(d, (x, y) => y <= 6, 40), p = a * n, v = p + d.pick([-3, -2, -1, 0, 1, 2, 3]), first = d.bool();
        const sides = [expr(a, '*', n), `<span class="mb-expr">${v}</span>`], values = first ? [p, v] : [v, p];
        return C('○ 안에 &gt;, =, &lt; 중 알맞은 것은?', SIGNS, values[0] > values[1] ? 0 : values[0] === values[1] ? 1 : 2, {
          figure: first ? versus(sides[0], sides[1]) : versus(sides[1], sides[0]),
          explain: `${why(a, n)}이다. ` + (p === v ? '두 수는 같다.' : `${josa(p, '은/는')} ${v}보다 ${p > v ? '크다' : '작다'}.`),
          facts: { choose: { exprs: first ? [E(a, '*', n), String(v)] : [String(v), E(a, '*', n)], rule: 'compare' } }
        });
      })
    ]
  });

  B.addGroup(UNIT, {
    id: 'picture', title: '그림을 곱셈식으로', standard: MEAN,
    types: [
      T('pic-both', '그림을 덧셈식과 곱셈식으로', '①47 심17 심22', (d) => {
        // ㉠ + ㉠ + ㉠ = ㉡, ㉠ × ㉢ = ㉡ : 한 묶음의 수, 전체, 묶음 수를 그림에서 읽는다.
        const thing = anyThing(d), [a, n] = pair(d, (x, y) => y >= 3 && y <= 4);
        const sum = '<span class="mb-expr">' + Array.from({ length: n }, () => box(LABELS[0])).join(' <i>+</i> ') + ' <i>=</i> ' + box(LABELS[1]) + '</span>';
        return M(`${thing.word}의 수를 덧셈식과 곱셈식으로 나타내려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: a * n }, { label: LABELS[2], answer: n }], {
          figure: groups(a, n, thing, d.bool()) + lines([sum, expr(box(LABELS[0]), '*', box(LABELS[2]), '=', box(LABELS[1]))]),
          explain: `${a}개씩 ${n}묶음이다. 덧셈식은 ${adds(a, n)}, 곱셈식은 ${a} × ${n} = ${a * n}이다.`,
          facts: { calc: [[String(a), 0], [E(a, '*', n), 1], [String(n), 2]] }
        });
      }),
      T('pic-mul', '그림을 곱셈식으로', '①48', (d) => {
        const thing = anyThing(d), [a, n] = pair(d, (x, y) => x !== y);
        return M(`${thing.word}의 수를 곱셈식으로 나타내려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: a * n }], {
          figure: groups(a, n, thing, d.bool()) + expr(a, '*', box(LABELS[0]), '=', box(LABELS[1])),
          explain: `${a}개씩 ${n}묶음이므로 ${a}의 ${n}배이다. ${why(a, n)}이다.`, facts: { calc: [[String(n), 0], [E(a, '*', n), 1]] }
        });
      }),
      T('pic-petal', '한 묶음의 수를 그림에서 읽기', '심23', (d) => {
        // 꽃 한 송이의 꽃잎 수가 한 묶음이다.
        const [a, n] = d.until(() => [d.int(4, 6), d.int(3, 6)], ([x, y]) => x !== y && x * y <= 36);
        return N('꽃잎은 모두 몇 장인가?', a * n, {
          unit: '장', figure: flowers(a, n), explain: `꽃 한 송이에 꽃잎이 ${a}장씩 있고, 꽃은 ${n}송이이다. ${why(a, n)}(장)이다.`, facts: { calc: [[E(a, '*', n), 0]] }
        });
      }),
      T('pic-pick', '그림의 수를 나타낸 곱셈식 고르기', '①49 심24', (d) => {
        const thing = anyThing(d), [a, n] = pair(d, (x, y) => x !== y && y >= 3 && x <= 8 && y <= 8 && (x + 1) * (y + 1) <= 40);
        const list = d.shuffle([[a, n], [a, n - 1], [a + 1, n], [a + 1, n + 1]]);
        return C(`${thing.word}의 수를 곱셈식으로 바르게 나타낸 것은?`, list.map(([x, y]) => `${x} × ${y}`), list.findIndex(([x, y]) => x === a && y === n), {
          figure: groups(a, n, thing, d.bool()), explain: `${a}개씩 ${n}묶음이므로 ${a}의 ${n}배이다. ${a}의 ${n}배는 ${a} × ${josa(n, '이라고/라고')} 쓴다.`,
          facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: a * n } }
        });
      }),
      T('pic-wrong', '그림의 수를 잘못 나타낸 것', '①50', (d) => {
        // 틀린 보기: 한 번 더(덜) 더한 식, 묶음 수가 하나 많은 배, 한 묶음의 수가 하나 많은 묶음
        const thing = anyThing(d), [a, n] = pair(d, (x, y) => x !== y && y >= 3 && y <= 5 && x * (y + 1) <= 40 && (x + 1) * y <= 40 && x <= 8);
        const good = d.shuffle([[`${a}씩 ${n}묶음`, E(a, '*', n)], [plus(a, n), plusExpr(a, n)], [`${a}의 ${n}배`, E(a, '*', n)], [`${a} × ${n}`, E(a, '*', n)]]).slice(0, 3);
        const bad = d.pick([[plus(a, n + 1), plusExpr(a, n + 1)], [plus(a, n - 1), plusExpr(a, n - 1)], [`${a}의 ${n + 1}배`, E(a, '*', n + 1)], [`${a + 1}씩 ${n}묶음`, E(a + 1, '*', n)]]);
        const list = d.shuffle(good.concat([bad]));
        return C(`${thing.word}의 수를 잘못 나타낸 것은?`, list.map(([said]) => said), list.indexOf(bad), {
          figure: groups(a, n, thing, d.bool()), explain: `${a}개씩 ${n}묶음이므로 모두 ${a * n}개이다. ${bad[0]}만 수가 다르다.`,
          facts: { choose: { exprs: list.map(([, text]) => text), rule: 'odd' } }
        });
      }),
      T('pic-grow', '한 묶음씩 늘어나는 그림과 곱셈식', '①51', (d) => {
        // 1의 곱은 싣지 않으므로 2묶음부터 놓는다. 그림 셋의 물건이 36개를 넘지 않게 한 묶음은 4개까지.
        const thing = anyThing(d), a = d.int(2, 4);
        return M(`${josa(thing.word, '이/가')} 한 묶음씩 늘어난다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a * 3 }, { label: LABELS[1], answer: a * 4 }], {
          figure: grow(a, [2, 3, 4], thing) + lines([expr(a, '*', 2, '=', a * 2), expr(a, '*', 3, '=', box(LABELS[0])), expr(a, '*', 4, '=', box(LABELS[1]))]),
          explain: `한 묶음이 늘 때마다 ${a}씩 커진다. ${a * 2} + ${a} = ${a * 3}, ${a * 3} + ${a} = ${a * 4}이다.`, facts: { calc: [[E(a, '*', 3), 0], [E(a, '*', 4), 1]] }
        });
      }),
      T('pic-two', '한 그림을 두 가지 곱셈식으로', '①52', (d) => {
        const thing = anyThing(d), [cols, rows] = pair(d, (x, y) => x !== y && x >= 3 && y <= 5 && x * y >= 12), total = rows * cols;
        return M(`${thing.word}의 수를 두 가지 곱셈식으로 나타내려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: rows }, { label: LABELS[1], answer: total }, { label: LABELS[2], answer: cols }], {
          figure: array(rows, cols, thing) + lines([expr(cols, '*', box(LABELS[0]), '=', box(LABELS[1])), expr(rows, '*', box(LABELS[2]), '=', box(LABELS[1]))]),
          explain: `가로로 ${cols}개씩 묶으면 ${rows}묶음이므로 ${why(cols, rows)}이다. 세로로 ${rows}개씩 묶으면 ${cols}묶음이고 전체 수는 같으므로 ${rows} × ${cols} = ${total}이다.`,
          facts: { calc: [[String(rows), 0], [E(rows, '*', cols), 1], [String(cols), 2]] }
        });
      }),
      T('pic-three', '한 수를 여러 가지 곱셈식으로', '심30', (d) => {
        // 16개: 2 × □ = 16, 4 × □ = 16, 8 × □ = 16 — 묶는 수를 바꿔 가며 그림을 다시 묶는다.
        const thing = anyThing(d), total = d.pick([12, 16, 18, 24]), [rows, cols] = BOARD[total];
        const xs = d.shuffle(WAYS[total].map(([x]) => x)).slice(0, 3).sort((p, q) => p - q);
        return M(`${thing.word} ${total}개를 여러 가지 곱셈식으로 나타내려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, xs.map((x, i) => ({ label: LABELS[i], answer: total / x })), {
          figure: array(rows, cols, thing) + lines(xs.map((x, i) => expr(x, '*', box(LABELS[i]), '=', total))),
          explain: xs.map((x) => `${x}개씩 묶으면 ${total / x}묶음`).join(', ') + '이다.', facts: { calc: xs.map((x, i) => [E(total, '/', x), i]) }
        });
      }),
      T('pic-cannot', '그림으로 나타낼 수 없는 곱셈식', '①53 ①54 심31', (d) => {
        // 값을 적지 않아 보기마다 묶음을 그림에서 찾거나 거듭 더해 보아야 한다.
        const thing = anyThing(d), total = d.pick([12, 16, 18, 24]), [rows, cols] = BOARD[total];
        const good = d.shuffle(WAYS[total]).slice(0, 3), [bx, by] = d.pick(good), bad = [bx, slip(d, bx, by)];
        const list = d.shuffle(good.concat([bad]));
        return C(`${thing.word}의 수를 나타낼 수 없는 곱셈식은?`, list.map(([x, y]) => `${x} × ${y}`), list.indexOf(bad), {
          figure: array(rows, cols, thing), explain: `${josa(thing.word, '은/는')} 모두 ${total}개이다. ${why(bad[0], bad[1])}이므로 ${total}개를 나타낼 수 없다.`,
          facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'odd' } }
        });
      })
    ]
  });

  const HIDDEN = [
    { a: 3, ask: (n) => `세발자전거 ${n}대의 바퀴는 모두 몇 개인가?`, why: '세발자전거 한 대의 바퀴는 3개이다.' },
    { a: 3, ask: (n) => `삼각형 ${n}개의 변은 모두 몇 개인가?`, why: '삼각형 한 개의 변은 3개이다.' },
    { a: 4, ask: (n) => `사각형 ${n}개의 꼭짓점은 모두 몇 개인가?`, why: '사각형 한 개의 꼭짓점은 4개이다.' }
  ];
  B.addGroup(UNIT, {
    id: 'word', title: '문장제', standard: MEAN,
    types: [
      T('word-bundle', '문장제: 몇 개씩 몇 묶음', '①55 ①56 심34', (d) => {
        const [a, n] = pair(d, (x, y) => y >= 3);
        return N(`사탕이 한 봉지에 ${a}개씩 들어 있다. ${n}봉지에 들어 있는 사탕은 모두 몇 개인가?`, a * n, {
          unit: '개', explain: `${a}개씩 ${n}봉지이므로 ${why(a, n)}(개)이다.`, facts: { calc: [[E(a, '*', n), 0]] }
        });
      }),
      T('word-pick', '문장에 맞는 식 고르기', '①57', (d) => {
        // 틀린 보기: 두 수를 더한 식, 한 개 덜 쌓은 식, 높이를 1 cm 크게 본 식(식은 모두 계산이 맞다)
        const [a, n] = pair(d, (x, y) => x !== y && y >= 3 && x <= 8 && (x + 1) * y <= 40);
        const list = d.shuffle([[`${a} × ${n} = ${a * n}`, E(a, '*', n)], [`${a} + ${n} = ${a + n}`, `${a}+${n}`], [`${a} × ${n - 1} = ${a * (n - 1)}`, E(a, '*', n - 1)], [`${a + 1} × ${n} = ${(a + 1) * n}`, E(a + 1, '*', n)]]);
        return C(`높이가 ${a} cm인 쌓기나무를 ${n}개 쌓았다. 쌓은 높이를 구하는 식은?`, list.map(([said]) => said), list.findIndex(([, text]) => text === E(a, '*', n)), {
          explain: `${a} cm씩 ${n}개이므로 ${a}의 ${n}배이다. ${why(a, n)}이다.`, facts: { choose: { exprs: list.map(([, text]) => text), rule: 'equals', target: a * n } }
        });
      }),
      T('word-times', '문장제: 몇의 몇 배', '①58 ①33 심18', (d) => {
        const [a, n] = pair(d, (x, y) => y <= 6), [one, two] = d.shuffle(NAMES).slice(0, 2);
        return N(`${name(one, '은/는')} 딱지를 ${a}장 가지고 있다. ${name(two, '은/는')} ${nick(one)}의 ${n}배만큼 가지고 있다. ${name(two, '이/가')} 가진 딱지는 몇 장인가?`, a * n, {
          unit: '장', explain: `${a}의 ${n}배는 ${why(a, n)}(장)이다.`, facts: { calc: [[E(a, '*', n), 0]] }
        });
      }),
      T('word-hidden', '문장제: 한 묶음의 수가 글에 숨어 있는 경우', '심35', (d) => {
        const kind = d.pick(HIDDEN), n = d.int(3, 9);
        return N(kind.ask(n), kind.a * n, { unit: '개', explain: `${kind.why} ${why(kind.a, n)}(개)이다.`, facts: { calc: [[E(kind.a, '*', n), 0]], unseen: [kind.a] } });
      }),
      T('word-each', '문장제: 두 가지를 저마다 구하기', '①60', (d) => {
        const [[a, n], [c, m]] = d.until(() => [pair(d), pair(d)], ([p, q]) => p[0] !== q[0] && p[1] !== q[1] && p[0] * p[1] !== q[0] * q[1]);
        return M(`사과는 한 봉지에 ${a}개씩 ${n}봉지 있다. 귤은 한 봉지에 ${c}개씩 ${m}봉지 있다. 사과와 귤은 각각 몇 개인가?`, [{ label: '사과', answer: a * n, unit: '개' }, { label: '귤', answer: c * m, unit: '개' }], {
          explain: `사과는 ${why(a, n)}(개), 귤은 ${why(c, m)}(개)이다.`, facts: { calc: [[E(a, '*', n), 0], [E(c, '*', m), 1]] }
        });
      }),
      T('word-compare', '문장제: 줄지어 든 것과 낱개로 든 것의 비교', '①61', (d) => {
        const [a, n] = pair(d, (x, y) => y <= 6 && x * y >= 12), p = a * n, v = p + d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), more = p > v ? 0 : 1;
        return C(`가 상자에는 공이 ${a}개씩 ${n}줄 들어 있다. 나 상자에는 공이 ${v}개 들어 있다. 공이 더 많은 상자는?`, ['가 상자', '나 상자'], more, {
          explain: `가 상자의 공은 ${why(a, n)}(개)이다. ${josa(Math.max(p, v), '이/가')} ${Math.min(p, v)}보다 크므로 ${more ? '나' : '가'} 상자의 공이 더 많다.`,
          facts: { choose: { exprs: [E(a, '*', n), String(v)], rule: 'max' } }
        });
      })
    ]
  });

  // 「~의 수는 ~의 수의 몇 배」 그림: [적은 쪽의 수, 배, 많은 쪽을 놓은 줄 수, 한 줄의 수] — 줄 수도 한 줄의 수도 답(배)과 다르다.
  const BASES = [[3, 4, 2, 6], [2, 6, 3, 4], [4, 3, 2, 6], [3, 6, 2, 9], [2, 9, 3, 6], [4, 4, 2, 8], [2, 8, 4, 4], [6, 3, 2, 9], [4, 6, 3, 8], [3, 8, 4, 6], [6, 4, 3, 8], [8, 3, 4, 6]];
  B.addGroup(UNIT, {
    id: 'hard', title: '단원 종합', standard: MEAN,
    types: [
      H('h-bundle-order', '묶는 수와 묶음 수 가리기', '심6 심7 ①15 ①26', (d) => {
        // 「3개씩 4묶음」으로 묶은 그림 고르기. 세 그림 모두 3과 4가 보인다.
        //  - 4개씩 3묶음: 수는 같지만 한 묶음의 수와 묶음 수를 바꿔 본 아이가 고른다.
        //  - 3개씩 3묶음(또는 4개씩 4묶음): 두 수 가운데 하나만 맞춰 본 아이가 고른다.
        const thing = anyThing(d), [a, n] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y && x * y >= 6);
        const list = d.shuffle([[a, n], [n, a], d.pick([[a, a], [n, n]])]);
        return C(`${josa(thing.word, '을/를')} 「${a}개씩 ${n}묶음」으로 묶은 그림은?`, LABELS.slice(0, 3), list.findIndex(([x, y]) => x === a && y === n), {
          figure: tiles(list.map(([x, y], i) => [LABELS[i], groups(x, y, thing, false, 0.9)])),
          explain: `「${a}개씩 ${n}묶음」은 한 묶음에 ${a}개씩 들어 있고 묶음이 ${n}개이다. ${list.map(([x, y], i) => `${LABELS[i]}은 ${x}개씩 ${y}묶음`).join(', ')}이다.`,
          facts: { truth: list.map(([x, y]) => x === a && y === n), want: true }
        });
      }),
      H('h-base', '기준이 되는 쪽을 한 묶음으로 삼기', '심14 심15 ①29', (d) => {
        // 많은 쪽을 먼저, 적은 쪽의 수와 다른 수씩 줄지어 놓았다. 줄 수나 한 줄의 수를 답하면 틀린다.
        const [k, m, , per] = d.pick(BASES), small = THINGS.blue, big = THINGS.red;
        return N(`${big.word}의 수는 ${small.word}의 수의 몇 배인가?`, m, {
          unit: '배', figure: twoSets([{ thing: big, n: k * m, per }, { thing: small, n: k, per: k }]),
          explain: `${josa(small.word, '은/는')} ${k}개, ${josa(big.word, '은/는')} ${k * m}개이다. ${josa(big.word, '을/를')} ${k}개씩 묶으면 ${m}묶음이다. ${adds(k, m)}이므로 ${m}배이다.`,
          facts: { calc: [[E(k * m, '/', k), 0]] }
        });
      }),
      H('h-add-order', '「몇의 몇 배」와 덧셈식의 차례', '심12 ①45', (d) => {
        // 5의 3배 = 5 + 5 + 5
        //  - 3 + 3 + 3 + 3 + 3: 값은 같지만 3의 5배다. 두 수의 자리를 가리지 않는 아이가 고른다.
        //  - 5 + 3: 「배」를 더하기로 본 아이가 고른다.
        //  - 5를 한 번 덜(더) 더한 식: 더하는 횟수를 잘못 센 아이가 고른다.
        const [a, n] = d.until(() => [d.int(2, 6), d.int(2, 5)], ([x, y]) => x !== y && x * y >= 6);
        const list = d.shuffle([[plus(a, n), true], [plus(n, a), false], [`${a} + ${n}`, false], [n >= 3 ? plus(a, n - 1) : plus(a, n + 1), false]]);
        return C(`${a}의 ${n}배를 덧셈식으로 바르게 나타낸 것은?`, list.map(([said]) => said), list.findIndex(([, ok]) => ok), {
          explain: `${a}의 ${n}배는 ${josa(a, '을/를')} ${n}번 더한 수이다. ${a > 1 ? plus(n, a - 1) + ' + ' : ''}${josa(n, '은/는')} ${n}의 ${a}배이다.`,
          facts: { truth: list.map(([, ok]) => ok), want: true }
        });
      }),
      H('h-one-more', '한 묶음을 더 놓을 때', '①51', (d) => {
        const thing = anyThing(d), [a, n] = d.until(() => [d.int(2, 5), d.int(3, 6)], ([x, y]) => x * (y + 1) <= 36 && x !== y + 1);
        return M(`${josa(thing.word, '을/를')} ${a}개씩 묶었다. 한 묶음을 더 놓으면 ${thing.word}의 수는 ${a}의 ${box(LABELS[0])}배가 되고, 모두 ${box(LABELS[1])}개가 된다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: n + 1 }, { label: LABELS[1], answer: a * (n + 1) }], {
          figure: groups(a, n, thing, false),
          explain: `지금은 ${a}개씩 ${n}묶음이므로 ${a * n}개이다. 한 묶음을 더 놓으면 ${n + 1}묶음이므로 ${a}의 ${n + 1}배이고, ${a * n} + ${a} = ${a * (n + 1)}(개)이다.`,
          facts: { calc: [[`${n}+1`, 0], [`${a}*${n}+${a}`, 1]], unseen: [1] }
        });
      }),
      H('h-covered', '일부가 가려진 그림의 전체 수', '심32', (d) => {
        // 첫 줄과 양 끝 줄만 보인다. 한 줄의 수와 줄 수를 읽어 「몇 개씩 몇 줄」로 보아야 한다.
        const thing = anyThing(d), [cols, rows] = d.until(() => [d.int(5, 8), d.int(3, 5)], ([x, y]) => x * y <= 36 && x !== y);
        return N(`${josa(thing.word, '을/를')} 줄을 맞추어 놓고, 종이로 일부를 가렸다. ${josa(thing.word, '은/는')} 모두 몇 개인가?`, rows * cols, {
          unit: '개', figure: covered(rows, cols, thing), explain: `한 줄에 ${cols}개씩 ${rows}줄이다. ${why(cols, rows)}(개)이다.`, facts: { calc: [[E(cols, '*', rows), 0]] }
        });
      }),
      H('h-extra', '쓰지 않는 수가 섞인 문장제', '①59', (d) => {
        // 바퀴의 수 4는 사람의 수를 구할 때 쓰지 않는다.
        const [p, n] = d.until(() => [d.pick([2, 3, 5, 6]), d.int(3, 7)], ([x, y]) => x * y <= 36 && x !== y && y !== 4);
        return N(`바퀴가 4개인 자동차가 ${n}대 있다. 자동차 한 대에 ${p}명씩 탔다. 자동차에 탄 사람은 모두 몇 명인가?`, p * n, {
          unit: '명', explain: `한 대에 ${p}명씩 ${n}대이므로 ${why(p, n)}(명)이다. 바퀴의 수 4는 사람의 수를 구할 때 쓰지 않는다.`, facts: { calc: [[E(p, '*', n), 0]] }
        });
      }),
      H('h-loose', '묶음과 낱개가 함께 있는 문장제', '①65', (d) => {
        const [a, n] = pair(d, (x) => x >= 3), r = d.int(1, a - 1);
        return N(`사탕이 한 상자에 ${a}개씩 ${n}상자 있다. 낱개로 ${r}개가 더 있다. 사탕은 모두 몇 개인가?`, a * n + r, {
          unit: '개', explain: `상자에 든 사탕은 ${why(a, n)}(개)이다. 낱개를 더하면 ${a * n} + ${r} = ${a * n + r}(개)이다.`, facts: { calc: [[`${a}*${n}+${r}`, 0]] }
        });
      }),
      H('h-both-have', '몇 배를 구해 처음 수와 더하기', '①64', (d) => {
        const [a, n] = pair(d, (x, y) => y <= 4 && x !== y, 32), [one, two] = d.shuffle(NAMES).slice(0, 2);
        return N(`${name(one, '은/는')} 구슬을 ${a}개 가지고 있다. ${name(two, '은/는')} ${nick(one)}의 ${n}배만큼 가지고 있다. 두 사람이 가진 구슬은 모두 몇 개인가?`, a * n + a, {
          unit: '개', explain: `${name(two, '이/가')} 가진 구슬은 ${why(a, n)}(개)이다. 두 사람의 구슬을 더하면 ${a} + ${a * n} = ${a * n + a}(개)이다.`, facts: { calc: [[`${a}*${n}+${a}`, 0]] }
        });
      }),
      H('h-minus', '곱을 구한 뒤 빼기', '①67', (d) => {
        const [a, n] = pair(d, (x, y) => x * y >= 12), b = d.int(3, a * n - 3);
        return N(`귤이 한 봉지에 ${a}개씩 ${n}봉지 있다. 그중 ${b}개를 먹었다. 남은 귤은 몇 개인가?`, a * n - b, {
          unit: '개', explain: `귤은 ${why(a, n)}(개)이다. 먹고 남은 귤은 ${a * n} − ${b} = ${a * n - b}(개)이다.`, facts: { calc: [[`${a}*${n}-${b}`, 0]] }
        });
      }),
      H('h-add-then', '수를 더한 뒤 곱하기', '①66', (d) => {
        const [p, q, a] = d.until(() => [d.int(2, 5), d.int(2, 5), d.int(2, 6)], ([x, y, z]) => x !== y && x + y <= 9 && z * (x + y) <= 40 && z !== x + y && z !== x && z !== y);
        return N(`빨간 상자가 ${p}개, 파란 상자가 ${q}개 있다. 상자마다 공이 ${a}개씩 들어 있다. 공은 모두 몇 개인가?`, a * (p + q), {
          unit: '개', explain: `상자는 ${p} + ${q} = ${p + q}(개)이다. 공은 ${why(a, p + q)}(개)이다.`, facts: { calc: [[`${a}*(${p}+${q})`, 0]] }
        });
      }),
      H('h-who', '두 곱을 비교하여 누가 얼마나 더', '①62', (d) => {
        // 하루에 읽은 쪽수가 적은 쪽이 더 많이 읽게 고른다(쪽수만 보고 고르지 못하게).
        //  - 이름이 바뀐 보기: 하루에 읽은 쪽수가 많은 쪽을 고른 아이가 고른다.
        //  - 쪽수가 다른 보기: 두 곱을 구하지 않고 하루에 읽은 쪽수끼리 뺀 아이가 고른다.
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [[a, n], [c, m]] = d.until(() => [pair(d, null, 40), pair(d, null, 40)], ([p, q]) => {
          const gap = Math.abs(p[0] * p[1] - q[0] * q[1]);
          return gap >= 1 && gap <= 9 && p[0] !== q[0] && p[1] !== q[1] && (p[0] > q[0]) !== (p[0] * p[1] > q[0] * q[1]);
        });
        const values = [a * n, c * m], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]), other = Math.abs(a - c) !== gap ? Math.abs(a - c) : gap >= 4 ? gap - 2 : gap + 2;
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
        return C(`${name(one, '은/는')} 책을 하루에 ${a}쪽씩 ${n}일 읽었다. ${name(two, '은/는')} 하루에 ${c}쪽씩 ${m}일 읽었다. 누가 몇 쪽 더 많이 읽었는가?`, list.map(([who, k]) => `${[one, two][who]}, ${k}쪽`), list.findIndex(([who, k]) => who === winner && k === gap), {
          explain: `${name(one, '은/는')} ${why(a, n)}(쪽), ${name(two, '은/는')} ${why(c, m)}(쪽)을 읽었다. ${name([one, two][winner], '이/가')} ${Math.max(values[0], values[1])} − ${Math.min(values[0], values[1])} = ${gap}(쪽) 더 많이 읽었다.`,
          facts: { who: { values, options: list, exprs: [E(a, '*', n), E(c, '*', m)] } }
        });
      }),
      H('h-sum2', '한 묶음의 수가 숨은 두 곱의 합', '①63 심36 심37', (d) => {
        // 강아지의 다리 4개, 닭의 다리 2개는 글에 적혀 있지 않다.
        const [p, q] = d.until(() => [d.int(2, 6), d.int(2, 9)], ([x, y]) => x !== y && 4 * x >= 12 && 2 * y >= 6);
        return N(`강아지 ${p}마리와 닭 ${q}마리가 있다. 다리는 모두 몇 개인가?`, 4 * p + 2 * q, {
          unit: '개', explain: `강아지의 다리는 4개씩이므로 ${why(4, p)}(개), 닭의 다리는 2개씩이므로 ${why(2, q)}(개)이다. ${4 * p} + ${2 * q} = ${4 * p + 2 * q}(개)이다.`,
          facts: { calc: [[`4*${p}+2*${q}`, 0]], unseen: [4, 2] }
        });
      }),
      H('h-many-ways', '여러 가지로 나타낸 수 가운데 다른 하나', '심26', (d) => {
        // 묶는 수가 서로 다른 표현 넷을 저마다 구해 그림의 수와 견준다(테두리 없는 그림).
        // 답이 되는 표현은 맞는 표현에서 묶음 수(더한 횟수)만 하나 다르다. 눈에 보이는 줄 수·한 줄의 수와 다른 수로 묶은 표현을 틀렸다고 여기는 아이는 다른 것을 고른다.
        const thing = anyThing(d), total = d.pick([12, 16, 18, 24]), [rows, cols] = BOARD[total];
        const forms = [(x, y) => [`${x}씩 ${y}묶음`, E(x, '*', y)], (x, y) => [`${x}의 ${y}배`, E(x, '*', y)], (x, y) => [`${x} × ${y}`, E(x, '*', y)], (x, y) => [plus(x, y), plusExpr(x, y)]];
        // 덧셈식으로 적는 짝은 다섯 번까지만 더한다.
        const [pairs, order] = d.until(() => {
          const good = d.shuffle(WAYS[total]).slice(0, 3), [bx, by] = d.pick(WAYS[total]);
          return [good.concat([[bx, slip(d, bx, by)]]), d.shuffle([0, 1, 2, 3])];
        }, ([list, turn]) => list[turn.indexOf(3)][1] <= 5);
        const made = pairs.map(([x, y], i) => forms[order[i]](x, y).concat([x * y])), bad = made[3], list = d.shuffle(made);
        return C(`${thing.word}의 수와 다른 수를 나타낸 것은?`, list.map(([said]) => said), list.indexOf(bad), {
          figure: array(rows, cols, thing), explain: `${josa(thing.word, '은/는')} 한 줄에 ${cols}개씩 ${rows}줄이므로 모두 ${total}개이다. ${bad[0]}만 ${bad[2]}이고, 나머지는 모두 ${total}이다.`,
          facts: { choose: { exprs: list.map(([, text]) => text), rule: 'odd' } }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
