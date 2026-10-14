// 2학년 2학기 6단원 규칙 찾기 — 덧셈표·곱셈표·생활에서 규칙 찾기의 기본 문항.
// 꼴 목록(기본꼴_1 61꼴, 심화꼴 47꼴)을 꼴마다 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, 심n. 그림 도구는 2-2-6a.js가 B.kit.g226으로 내보낸 것을 쓴다.
//
// 싣는 기준
//  - 덧셈표·곱셈표는 가장 윗줄과 가장 왼쪽 줄의 수가 1씩 커지는 표, 2씩·3씩 커지는 표, 두 줄의 수가 서로 다른 표를 섞어 쓴다. 한 줄은 대여섯 칸(휴대폰 너비).
//    덧셈표의 합은 24까지, 곱셈표의 곱은 81까지다(곱셈구구의 범위).
//  - 표의 규칙은 「오른쪽으로 갈수록」「아래로 내려갈수록」과 화살표(↘, ↙)로 말한다. 규칙을 문장으로 쓰는 꼴(①41·48·54·59·61)은 「몇씩」을 수로 묻거나 바르게 말한 것을 고르게 했다.
//  - 달력은 「어느 달의 달력」으로 하고 달을 넘기는 셈은 하지 않는다. 버스 시간표는 시마다 같은 분에 출발하는 표만 쓴다(시를 넘겨 셈하지 않는다).
//
// 뺀 것과 까닭(이 파일에 드는 꼴)
//  - 20을 넘는 수의 짝수·홀수: 「덧셈표의 수는 모두 짝수」(①40 변형), 「곱셈표의 수는 모두 홀수·짝수」(①52 심35) — 짝수와 홀수는 20 이하의 수에서만 다룬다.
//  - 조건을 엮어 푸는 표: 가장 윗줄·왼쪽 줄의 수가 여럿 가려진 덧셈표(심24), 같은 두 수의 곱에서 줄의 수를 거꾸로 찾는 곱셈표(①51 심36)
//  - 뜻 없는 셈: 표의 세 칸에 들어갈 수를 더하고 빼기(①43 변형), 두 칸의 합(①45 변형)
//  - 곱셈구구를 외워 견주는 일: 곱셈표의 기호 칸 가운데 가장 큰 수(심32) — 곱 셋을 구해 비교하는 일은 2-2 「곱셈구구」의 일이고, 같은 물음은 덧셈표(ad-big)에 있다.
//  - 답이 열린 것·작도: 줄의 수를 정해 덧셈표·곱셈표를 만들고 규칙 쓰기(①42·52 심37), 건반에 색칠하기(심44 — 반복되는 부분이 일곱이기도 하다)
//  - 시를 넘기는 시각 셈(심46 — 3-1 「시간의 덧셈」), 자리마다 규칙이 다른 네 자리 수(심47 — 복잡한 배열)
//  - 그림에 없는 줄을 두 줄 넘게 이어 세는 자리 번호(①58 변형의 D열) — 한 줄 뒤까지만 실었다.
// 묻는 말: 「~은?/~는?」, 「몇 ~인가?」. 풀이는 「~이다.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, lines, table, josa, N, M, C } = B.kit;
  const { ORD, MARKS, range, truthOf, distinct, row, BL, clock, handsApart, timeText, stack, sheet, piece, WEEK, weeksOf, calendar, board, stepAlong, claim, oneTrue, headsOf } = B.kit.g226;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 표의 칸 몇 개를 읽는 차례(위 줄부터, 왼쪽부터)로 늘어놓는다.
  const inOrder = (spots) => spots.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const marksOf = (spots, names) => { const out = {}; spots.forEach(([r, c], i) => { out[r + ',' + c] = (names || MARKS)[i]; }); return out; };
  // 서로 다른 칸 n개를 고른다.
  const someCells = (d, nRows, nCols, n) => inOrder(d.shuffle(range(nRows * nCols)).slice(0, n).map((k) => [Math.floor(k / nCols), k % nCols]));

  B.addTypes('2-2-6', 'add', [
    T('ad-fill', '덧셈표의 빈칸', '①33·34 심22', (d) => {
      // 가장 윗줄과 왼쪽 줄의 수: 1씩 커지는 같은 수, 2씩 커지는 같은 수, 서로 다른 수(위는 2씩, 왼쪽은 1씩)
      const kind = d.pick(['one', 'two', 'mixed']), top = kind === 'one' ? headsOf(d.int(0, 7), 1, 5) : headsOf(d.pick([1, 2]), 2, 5), side = kind === 'mixed' ? headsOf(d.int(1, 5), 1, 5) : top, cell = (r, c) => side[r] + top[c];
      const spots = d.until(() => { const rs = d.shuffle(range(5)).slice(0, 3), cs = d.shuffle(range(5)).slice(0, 3); return inOrder(rs.map((r, i) => [r, cs[i]])); }, (list) => list.every(([r, c]) => cell(r, c) > 0) && new Set(list.map(([r, c]) => cell(r, c))).size === 3);
      return M('덧셈표의 빈칸 ㉠, ㉡, ㉢에 알맞은 수는?', spots.map(([r, c], i) => ({ label: MARKS[i], answer: cell(r, c) })), {
        figure: sheet('+', top, side, cell, marksOf(spots)), explain: spots.map(([r, c], i) => `${MARKS[i]}에 알맞은 수는 ${side[r]} + ${top[c]} = ${cell(r, c)}`).join(', ') + '이다.', facts: { calc: spots.map(([r, c], i) => [`${side[r]}+${top[c]}`, i]) }
      });
    }),
    T('ad-big', '기호 칸 가운데 가장 큰 수', '①34 심30', (d) => {
      const step = d.pick([1, 2]), top = headsOf(d.int(1, 4), step, 5), side = headsOf(d.int(1, 4), step, 5), cell = (r, c) => side[r] + top[c], big = d.bool();
      const spots = d.until(() => someCells(d, 5, 5, 3), (list) => new Set(list.map(([r, c]) => cell(r, c))).size === 3 && new Set(list.map((p) => p[0])).size === 3 && new Set(list.map((p) => p[1])).size === 3);
      const values = spots.map(([r, c]) => cell(r, c)), best = big ? Math.max.apply(null, values) : Math.min.apply(null, values);
      return C(`덧셈표에서 ㉠, ㉡, ㉢ 가운데 가장 ${big ? '큰' : '작은'} 수가 들어가는 칸은?`, MARKS.slice(0, 3), values.indexOf(best), {
        figure: sheet('+', top, side, cell, marksOf(spots)), explain: `${spots.map(([r, c], i) => `${MARKS[i]}에 알맞은 수는 ${side[r]} + ${top[c]} = ${cell(r, c)}`).join(', ')}이다. 가장 ${big ? '큰' : '작은'} 수는 ${best}이다.`,
        facts: { choose: { exprs: spots.map(([r, c]) => `${side[r]}+${top[c]}`), rule: big ? 'max' : 'min' } }
      });
    }),
    T('ad-not', '빈칸에 들어갈 수가 아닌 것', '①35', (d) => {
      // 색칠한 빈칸 넷에는 세 가지 수가 들어간다. 틀린 보기는 그 수들과 이웃한 수이다.
      const top = headsOf(d.int(2, 6), 1, 4), side = headsOf(d.int(2, 6), 1, 4), cell = (r, c) => side[r] + top[c];
      const spots = d.until(() => someCells(d, 4, 4, 4), (list) => new Set(list.map(([r, c]) => cell(r, c))).size === 3), values = [...new Set(spots.map(([r, c]) => cell(r, c)))].sort((x, y) => x - y);
      const odd = d.pick(range(values[2] - values[0] + 3, values[0] - 1).filter((v) => !values.includes(v))), options = d.shuffle(values.concat([odd])), marks = {};
      spots.forEach(([r, c]) => { marks[r + ',' + c] = 'tint'; });
      const truth = options.map((v) => spots.some(([r, c]) => side[r] + top[c] === v));
      return C('덧셈표의 색칠한 칸에 들어갈 수가 아닌 것은?', options.map(String), truth.indexOf(false), {
        figure: sheet('+', top, side, cell, marks), explain: `색칠한 칸에 들어갈 수는 위 줄부터 차례로 ${spots.map(([r, c]) => cell(r, c)).join(', ')}이다. ${josa(odd, '은/는')} 들어가지 않는다.`, facts: { truth, want: false }
      });
    }),
    T('ad-step', '오른쪽·아래로 몇씩 커지는가', '①36 심27', (d) => {
      const [p, q] = d.pick([[1, 1], [2, 2], [1, 2], [2, 1], [3, 3], [2, 3], [1, 3]]), top = headsOf(d.int(1, 3), p, p === 3 ? 4 : 5), side = headsOf(d.int(1, 3), q, 4), cell = (r, c) => side[r] + top[c];
      return M('덧셈표에서 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: p }, { label: '㉡', answer: q }], {
        figure: stack([sheet('+', top, side, cell), lines([`오른쪽으로 갈수록 ${box('㉠')}씩 커진다.`, `아래로 내려갈수록 ${box('㉡')}씩 커진다.`])]),
        explain: `오른쪽으로 ${cell(0, 0)}, ${cell(0, 1)}, ${josa(cell(0, 2), '과/와')} 같이 ${p}씩 커진다. 아래로 ${cell(0, 0)}, ${cell(1, 0)}, ${josa(cell(2, 0), '과/와')} 같이 ${q}씩 커진다.`,
        facts: { calc: [[`${cell(0, 1)}-${cell(0, 0)}`, 0], [`${cell(1, 0)}-${cell(0, 0)}`, 1]] }
      });
    }),
    T('ad-say', '덧셈표의 규칙을 바르게 말한 것', '①37·40·41', (d) => {
      // 틀린 말: 커지는 쪽과 작아지는 쪽을 거꾸로 말한 것, 몇씩을 잘못 센 것, 가로와 세로를 바꾸어 말한 것
      const [p, q] = d.pick([[1, 1], [2, 2], [1, 2], [2, 1]]), top = headsOf(d.int(1, 3), p, 5), side = headsOf(d.int(1, 3), q, 4), cell = (r, c) => side[r] + top[c], say = (way, amount, grows) => claim(cell, 4, 5, way, amount, grows);
      const said = oneTrue(d, [say('right', p, true), say('left', p, false), say('down', q, true), say('up', q, false), say('left', p, true), say('right', p, false), say('up', q, true), say('down', q, false), say('right', p + 1, true), say('down', q + 1, true), say('right', q, true), say('down', p, true)]);
      return C('덧셈표의 규칙을 바르게 말한 것은?', said.map((s) => s[0]), said.findIndex((s) => s[1]), {
        figure: sheet('+', top, side, cell), explain: `오른쪽으로 갈수록 ${p}씩 커지고 왼쪽으로 갈수록 ${p}씩 작아진다. 아래로 내려갈수록 ${q}씩 커지고 위로 올라갈수록 ${q}씩 작아진다.`, facts: truthOf(said, true)
      });
    }),
    T('ad-diag', '↘ 방향으로 몇씩 커지는가', '①38·41 심28', (d) => {
      const [p, q] = d.pick([[1, 1], [2, 2], [1, 2], [2, 1]]), top = headsOf(d.int(0, 3), p, 5), side = headsOf(d.int(1, 3), q, 5), cell = (r, c) => side[r] + top[c], marks = {};
      range(5).forEach((i) => { marks[i + ',' + i] = 'on'; });
      return N('덧셈표에서 색칠한 수는 ↘ 방향으로 갈수록 몇씩 커지는가?', p + q, {
        figure: sheet('+', top, side, cell, marks), explain: `색칠한 수는 ${range(5).map((i) => cell(i, i)).join(', ')}이다. ↘ 방향으로 갈수록 ${p + q}씩 커진다.`, facts: { calc: [[`${cell(1, 1)}-${cell(0, 0)}`, 0]] }
      });
    }),
    T('ad-same', '같은 수가 놓인 방향', '①39 심26', (d) => {
      // 가장 윗줄과 왼쪽 줄의 수가 같은 수만큼 커지는 표에서만 ↙ 방향으로 같은 수가 놓인다. 참·거짓은 표의 수로 따진다.
      const s = d.pick([1, 2, 3]), top = headsOf(s === 3 ? 0 : d.int(0, 3), s, 5), side = headsOf(s === 3 ? 0 : d.int(0, 3), s, 5), cell = (r, c) => side[r] + top[c];
      const said = d.shuffle([['→', 'right'], ['↓', 'down'], ['↘', 'se'], ['↙', 'sw']]).map(([sign, way]) => [sign + ' 방향', stepAlong(cell, 5, 5, way) === 0]);
      return C('덧셈표에서 같은 수가 놓인 방향은?', said.map((row) => row[0]), said.findIndex((row) => row[1]), {
        figure: sheet('+', top, side, cell), explain: `↙ 방향으로 ${cell(0, 2)}, ${cell(1, 1)}, ${josa(cell(2, 0), '과/와')} 같이 같은 수가 놓여 있다. 오른쪽으로 갈수록 ${s}씩 커지고 아래로 내려갈수록 ${s}씩 커지기 때문이다.`, facts: truthOf(said, true)
      });
    }),
    T('ad-swap', '두 수를 바꾸어 더한 칸', '심28', (d) => {
      // ㉠과 합이 같은 칸은 더하는 두 수의 차례만 바꾼 칸 하나뿐이게 고른다.
      const top = headsOf(d.int(1, 4), d.pick([1, 2]), 5), cell = (r, c) => top[r] + top[c];
      const [r0, c0] = d.until(() => [d.int(0, 4), d.int(0, 4)], ([r, c]) => r !== c), sumOf = cell(r0, c0);
      const others = d.until(() => someCells(d, 5, 5, 3), (list) => list.every(([r, c]) => cell(r, c) !== sumOf && !(r === r0 && c === c0)));
      const picks = inOrder(others.concat([[c0, r0]])), marks = marksOf(picks, MARKS.slice(1));
      marks[r0 + ',' + c0] = '㉠';
      for (let r = 0; r < 5; r += 1) for (let c = 0; c < 5; c += 1) if (!marks[r + ',' + c]) marks[r + ',' + c] = 'none';
      const at = picks.findIndex(([r, c]) => r === c0 && c === r0);
      return C('덧셈표에서 ㉠과 같은 수가 들어가는 칸은?', MARKS.slice(1, 5), at, {
        figure: sheet('+', top, top, cell, marks), explain: `㉠에 알맞은 수는 ${top[r0]} + ${top[c0]}이고, ${MARKS[at + 1]}에 알맞은 수는 ${top[c0]} + ${top[r0]}이다. 더하는 두 수의 차례를 바꾸어도 합은 ${josa(sumOf, '으로/로')} 같다.`,
        facts: { choose: { exprs: picks.map(([r, c]) => `${top[r]}+${top[c]}`), rule: 'equals', target: sumOf } }
      });
    }),
    T('ad-piece', '덧셈표 조각의 빈칸', '심25', (d) => {
      // ㄱ자 조각: 윗줄 세 칸과 오른쪽 끝에서 내려가는 두 칸. ㉠은 왼쪽으로 한 칸(작아진다), ㉡은 아래로 한 칸 간 자리다.
      const [p, q] = d.pick([[1, 1], [2, 2], [1, 2], [2, 1], [3, 3]]), base = d.int(4, 12), v = (r, c) => base + c * p + r * q;
      return M('덧셈표의 일부이다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: v(0, 0) }, { label: '㉡', answer: v(2, 2) }], {
        figure: piece([['㉠', v(0, 1), v(0, 2)], [undefined, undefined, v(1, 2)], [undefined, undefined, '㉡']], '덧셈표에서 떼어 낸 조각'),
        explain: `오른쪽으로 갈수록 ${p}씩 커지므로 ㉠에 알맞은 수는 ${v(0, 1)}보다 ${p} 작은 ${v(0, 0)}이다. 아래로 내려갈수록 ${q}씩 커지므로 ㉡에 알맞은 수는 ${v(1, 2)}보다 ${q} 큰 ${v(2, 2)}이다.`,
        facts: { calc: [[`${v(0, 1)}-(${v(0, 2)}-${v(0, 1)})`, 0], [`${v(1, 2)}+(${v(1, 2)}-${v(0, 2)})`, 1]] }
      });
    })
  ]);

  // 곱셈표의 가장 윗줄(왼쪽 줄)에 쓰는 수: 1씩 커지는 다섯 수
  const tableHeads = (d) => headsOf(d.int(2, 5), 1, 5);

  B.addTypes('2-2-6', 'mul', [
    T('mu-fill', '곱셈표의 빈칸', '①44·45 심31', (d) => {
      const kind = d.pick(['one', 'odd', 'even', 'mixed']), top = kind === 'one' ? tableHeads(d) : kind === 'odd' ? [1, 3, 5, 7, 9] : [2, 4, 6, 8], side = kind === 'mixed' ? d.pick([[1, 3, 5, 7], headsOf(d.int(3, 6), 1, 4)]) : top, cell = (r, c) => side[r] * top[c];
      const spots = d.until(() => { const rs = d.shuffle(range(side.length)).slice(0, 3), cs = d.shuffle(range(top.length)).slice(0, 3); return inOrder(rs.map((r, i) => [r, cs[i]])); }, (list) => new Set(list.map(([r, c]) => cell(r, c))).size === 3);
      return M('곱셈표의 빈칸 ㉠, ㉡, ㉢에 알맞은 수는?', spots.map(([r, c], i) => ({ label: MARKS[i], answer: cell(r, c) })), {
        figure: sheet('×', top, side, cell, marksOf(spots)), explain: spots.map(([r, c], i) => `${MARKS[i]}에 알맞은 수는 ${side[r]} × ${top[c]} = ${cell(r, c)}`).join(', ') + '이다.', facts: { calc: spots.map(([r, c], i) => [`${side[r]}*${top[c]}`, i]) }
      });
    }),
    T('mu-swap', '곱이 같은 칸', '①46', (d) => {
      // ㉠과 곱이 같은 칸은 곱하는 두 수의 차례만 바꾼 칸 하나뿐이게 고른다(3 × 4와 2 × 6처럼 곱이 같은 다른 칸은 보기에 넣지 않는다).
      const top = tableHeads(d), cell = (r, c) => top[r] * top[c];
      const [r0, c0] = d.until(() => [d.int(0, 4), d.int(0, 4)], ([r, c]) => r !== c), product = cell(r0, c0);
      const others = d.until(() => someCells(d, 5, 5, 3), (list) => list.every(([r, c]) => cell(r, c) !== product && !(r === r0 && c === c0)));
      const picks = inOrder(others.concat([[c0, r0]])), marks = marksOf(picks, MARKS.slice(1));
      marks[r0 + ',' + c0] = '㉠';
      for (let r = 0; r < 5; r += 1) for (let c = 0; c < 5; c += 1) if (!marks[r + ',' + c]) marks[r + ',' + c] = 'none';
      const at = picks.findIndex(([r, c]) => r === c0 && c === r0);
      return C('곱셈표에서 ㉠과 같은 수가 들어가는 칸은?', MARKS.slice(1, 5), at, {
        figure: sheet('×', top, top, cell, marks), explain: `㉠에 알맞은 수는 ${top[r0]} × ${top[c0]}이고, ${MARKS[at + 1]}에 알맞은 수는 ${top[c0]} × ${top[r0]}이다. 곱하는 두 수의 차례를 바꾸어도 곱은 ${josa(product, '으로/로')} 같다.`,
        facts: { choose: { exprs: picks.map(([r, c]) => `${top[r]}*${top[c]}`), rule: 'equals', target: product } }
      });
    }),
    T('mu-fold', '접었을 때 만나는 수', '①47 심33', (d) => {
      const top = tableHeads(d), cell = (r, c) => top[r] * top[c], [r0, c0] = d.until(() => [d.int(0, 4), d.int(0, 4)], ([r, c]) => r !== c), marks = {};
      range(5).forEach((i) => { marks[i + ',' + i] = 'on'; });
      marks[r0 + ',' + c0] = '㉠';
      return N('곱셈표를 색칠한 칸을 따라 접었을 때 ㉠과 만나는 칸의 수는?', cell(c0, r0), {
        figure: sheet('×', top, top, cell, marks), explain: `㉠은 왼쪽 수가 ${top[r0]}인 줄의 ${ORD[c0]} 칸이다. 색칠한 칸을 따라 접으면 왼쪽 수가 ${top[c0]}인 줄의 ${ORD[r0]} 칸과 만난다. 그 칸의 수는 ${top[c0]} × ${top[r0]} = ${cell(c0, r0)}이다.`,
        facts: { calc: [[`${top[c0]}*${top[r0]}`, 0]] }
      });
    }),
    T('mu-say', '곱셈표의 규칙을 바르게 말한 것', '①47·52', (d) => {
      // 참·거짓은 표의 수로 따진다. 틀린 말: 모든 줄이 같은 수만큼 커진다고 본 것, 색칠한 수가 같은 수만큼 커진다고 본 것, 접었을 때 만나는 수를 잘못 말한 것
      const top = tableHeads(d), cell = (r, c) => top[r] * top[c], k = d.int(0, 4), a = top[k], marks = {}, folds = range(5).every((r) => range(5).every((c) => cell(r, c) === cell(c, r)));
      range(5).forEach((i) => { marks[i + ',' + i] = 'on'; });
      const rowStep = (r) => { const gaps = new Set(range(4).map((c) => cell(r, c + 1) - cell(r, c))); return gaps.size === 1 ? [...gaps][0] : undefined; };
      const diag = new Set(range(4).map((i) => cell(i + 1, i + 1) - cell(i, i))), first = cell(1, 1) - cell(0, 0), mode = d.bool();
      const said = d.shuffle([
        mode ? ['색칠한 칸을 따라 접었을 때 만나는 두 수는 서로 같다.', folds] : [`${a}단 곱셈구구의 수가 놓인 줄은 오른쪽으로 갈수록 ${a}씩 커진다.`, rowStep(k) === a],
        mode ? [`어느 줄에서나 오른쪽으로 갈수록 ${a}씩 커진다.`, range(5).every((r) => rowStep(r) === a)] : ['색칠한 칸을 따라 접었을 때 만나는 두 수는 서로 다르다.', !folds],
        [`색칠한 수는 ↘ 방향으로 갈수록 ${first}씩 커진다.`, diag.size === 1 && diag.has(first)],
        ['아래로 내려갈수록 수가 작아진다.', range(5).every((c) => cell(1, c) < cell(0, c))]
      ]);
      return C('곱셈표의 규칙을 바르게 말한 것은?', said.map((row) => row[0]), said.findIndex((row) => row[1]), {
        figure: sheet('×', top, top, cell, marks),
        explain: mode ? `색칠한 칸을 따라 접으면 ${top[0]} × ${top[1]}의 칸과 ${top[1]} × ${top[0]}의 칸처럼 곱하는 두 수의 차례만 다른 칸이 만난다. 만나는 두 수는 서로 같다.` : `${a}단 곱셈구구의 수가 놓인 줄은 ${cell(k, 0)}, ${cell(k, 1)}, ${josa(cell(k, 2), '과/와')} 같이 ${a}씩 커진다.`, facts: truthOf(said, true)
      });
    }),
    T('mu-line', '색칠한 줄은 몇씩 커지는가', '①48 심34', (d) => {
      const top = tableHeads(d), cell = (r, c) => top[r] * top[c], k = d.int(0, 4), across = d.bool(), marks = {}, vals = range(5).map((i) => (across ? cell(k, i) : cell(i, k)));
      range(5).forEach((i) => { marks[across ? k + ',' + i : i + ',' + k] = 'on'; });
      return N(`곱셈표에서 색칠한 수는 ${across ? '오른쪽으로 갈수록' : '아래로 내려갈수록'} 몇씩 커지는가?`, top[k], {
        figure: sheet('×', top, top, cell, marks), explain: `색칠한 수는 ${vals.join(', ')}이다. ${top[k]}단 곱셈구구의 수이므로 ${top[k]}씩 커진다.`, facts: { calc: [[`${vals[1]}-${vals[0]}`, 0]] }
      });
    }),
    T('mu-same', '색칠한 세로줄과 수가 같은 가로줄', '①49 심34', (d) => {
      // 가장 왼쪽 줄의 수 대신 줄의 이름(㉠~㉤)을 적는다. 수를 줄끼리 맞대어 보아야 한다.
      const top = tableHeads(d), cell = (r, c) => top[r] * top[c], k = d.int(0, 4), marks = {}, col = range(5).map((r) => cell(r, k));
      range(5).forEach((r) => { marks[r + ',' + k] = 'on'; });
      const truth = range(5).map((r) => range(5).every((c) => cell(r, c) === col[c]));
      return C('곱셈표에서 색칠한 세로줄과 같은 수가 놓인 가로줄은?', MARKS, truth.indexOf(true), {
        figure: sheet('×', top, MARKS, cell, marks), explain: `색칠한 세로줄의 수는 위에서부터 ${col.join(', ')}이다. 가로줄 ${MARKS[k]}의 수도 왼쪽에서부터 ${col.join(', ')}이다. 둘 다 ${top[k]}단 곱셈구구의 수이다.`, facts: { truth, want: true }
      });
    }),
    T('mu-piece', '곱셈표 조각의 빈칸', '①50', (d) => {
      // 두 줄짜리 조각. 줄마다 몇씩 커지는지(몇 단인지)를 찾아 끝의 빈칸을 채운다.
      const r = d.int(3, 8), c = d.int(2, 7), v = (i, j) => (r + i) * (c + j);
      return M('곱셈표의 일부이다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: v(0, 2) }, { label: '㉡', answer: v(1, 2) }], {
        figure: piece([[v(0, 0), v(0, 1), '㉠'], [v(1, 0), v(1, 1), '㉡']], '곱셈표에서 떼어 낸 조각'),
        explain: `윗줄은 ${v(0, 0)}, ${josa(v(0, 1), '으로/로')} ${r}씩 커지므로 ㉠에 알맞은 수는 ${v(0, 1)} + ${r} = ${v(0, 2)}이다. 아랫줄은 ${v(1, 0)}, ${josa(v(1, 1), '으로/로')} ${r + 1}씩 커지므로 ㉡에 알맞은 수는 ${v(1, 1)} + ${r + 1} = ${v(1, 2)}이다.`,
        facts: { calc: [[`${v(0, 1)}+(${v(0, 1)}-${v(0, 0)})`, 0], [`${v(1, 1)}+(${v(1, 1)}-${v(1, 0)})`, 1]] }
      });
    })
  ]);

  B.addTypes('2-2-6', 'life', [
    T('lf-week', '같은 요일은 며칠마다', '①53', (d) => {
      const first = d.int(0, 6), days = d.pick([30, 31]), w = d.int(0, 6), list = weeksOf(first, days).map((line) => line[w]).filter((day) => day > 0);
      return N(`어느 달의 달력이다. ${WEEK[w]}요일인 날은 며칠마다 반복되는가?`, 7, {
        unit: '일', figure: calendar(first, days), explain: `${WEEK[w]}요일인 날은 ${list.map((day) => day + '일').join(', ')}이다. 날짜가 7씩 커지므로 7일마다 반복된다.`, facts: { calc: [[`${list[1]}-${list[0]}`, 0]] }
      });
    }),
    T('lf-cal-diag', '달력의 ↘·↙ 방향 규칙', '①54', (d) => {
      const first = d.int(0, 6), days = d.pick([30, 31]), weeks = weeksOf(first, days), x = weeks[1][d.int(0, 3)], y = weeks[1][d.int(3, 6)];
      return M('어느 달의 달력에서 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: 8 }, { label: '㉡', answer: 6 }], {
        figure: stack([calendar(first, days), lines([`↘ 방향으로 갈수록 ${box('㉠')}씩 커진다.`, `↙ 방향으로 갈수록 ${box('㉡')}씩 커진다.`])]),
        explain: `↘ 방향으로 ${x}, ${x + 8}, ${josa(x + 16, '과/와')} 같이 8씩 커진다. ↙ 방향으로 ${y}, ${y + 6}, ${josa(y + 12, '과/와')} 같이 6씩 커진다.`, facts: { calc: [[`${x + 8}-${x}`, 0], [`${y + 6}-${y}`, 1]] }
      });
    }),
    T('lf-cal-say', '달력의 규칙으로 옳지 않은 것', '①54 심38', (d) => {
      // 틀린 말은 하나: 아래로 7씩과 ↘ 방향 8씩, ↙ 방향 6씩을 서로 바꾸어 말한 것. 참·거짓은 달력의 수로 따진다.
      const first = d.int(0, 6), days = d.pick([30, 31]), weeks = weeksOf(first, days), cell = (r, c) => weeks[r][c], has = (r, c) => weeks[r][c] > 0, say = (way, amount) => claim(cell, weeks.length, 7, way, amount, true, has);
      const bad = d.pick([['se', 7], ['down', 8], ['sw', 7]]), goods = d.shuffle([['right', 1], ['down', 7], ['se', 8], ['sw', 6]].filter((g) => g[0] !== bad[0])).slice(0, 2);
      const said = d.shuffle([['같은 요일은 7일마다 반복된다.', stepAlong(cell, weeks.length, 7, 'down', has) === 7], say(bad[0], bad[1])].concat(goods.map((g) => say(g[0], g[1]))));
      return C('어느 달의 달력에서 찾은 규칙으로 옳지 않은 것은?', said.map((s) => s[0]), said.findIndex((s) => !s[1]), {
        figure: calendar(first, days), explain: `달력의 수는 오른쪽으로 갈수록 1씩, 아래로 내려갈수록 7씩 커진다. ↘ 방향으로는 7 + 1 = 8씩, ↙ 방향으로는 7 − 1 = 6씩 커진다.`, facts: truthOf(said, false)
      });
    }),
    T('lf-seat-step', '줄이 바뀔 때 번호가 몇씩', '①57·61', (d) => {
      const what = d.pick(['사물함', '신발장', '우편함']), n = d.int(4, 6), cell = (r, c) => r * n + c + 1;
      return N(`${what}에 번호를 규칙에 따라 붙였다. 아래로 한 칸 내려갈 때마다 번호는 몇씩 커지는가?`, n, {
        figure: board(cell, 3, n, {}, { label: what + '의 번호' }), explain: `아래로 ${cell(0, 0)}, ${cell(1, 0)}, ${josa(cell(2, 0), '과/와')} 같이 ${n}씩 커진다. 한 줄에 ${n}칸씩 있기 때문이다.`, facts: { calc: [[`${cell(1, 0)}-${cell(0, 0)}`, 0]] }
      });
    }),
    T('lf-seat-find', '자리 번호 찾기', '①58 심41', (d) => {
      // 셋째 줄에는 번호를 적지 않는다. ㉠은 둘째 줄의 번호에서 한 줄 내려간 자리다.
      const n = d.int(6, 8), cell = (r, c) => r * n + c + 1, k = d.int(1, n - 2), marks = {};
      range(n).forEach((c) => { marks['2,' + c] = c === k ? '㉠' : 'empty'; });
      return N('공연장의 자리에 번호를 규칙에 따라 붙였다. ㉠ 자리의 번호는?', cell(2, k), {
        unit: '번', figure: board(cell, 3, n, marks, { label: '자리 번호' }), explain: `아래로 한 줄 내려갈 때마다 번호가 ${n}씩 커진다. ㉠은 ${cell(1, k)}번의 바로 아래이므로 ${cell(1, k)} + ${n} = ${cell(2, k)}(번)이다.`,
        facts: { calc: [[`${cell(1, k)}+(${cell(1, 0)}-${cell(0, 0)})`, 0]] }
      });
    }),
    T('lf-lift', '승강기 단추의 규칙', '①56', (d) => {
      // 수가 아래에서 위로 커진다. 맞는 말은 위·아래 방향의 규칙이다. 틀린 말: 아래로 갈수록 커진다고 본 것, 몇씩을 잘못 센 것, 왼쪽·오른쪽을 거꾸로 말한 것
      const n = d.int(2, 4), nRows = n === 4 ? 4 : 5, cell = (r, c) => (nRows - 1 - r) * n + c + 1, say = (way, amount, grows) => claim(cell, nRows, n, way, amount, grows);
      const said = d.shuffle([d.pick([say('up', n, true), say('down', n, false)])].concat(d.shuffle([say('down', n, true), say('up', n, false), say('up', 1, true), say('right', n, true), say('left', 1, true), say('right', 1, false)]).slice(0, 3)));
      return C('승강기 단추의 수가 규칙에 따라 놓여 있다. 규칙을 바르게 말한 것은?', said.map((s) => s[0]), said.findIndex((s) => s[1]), {
        figure: board(cell, nRows, n, {}, { round: true, cw: 36, label: '승강기 단추' }), explain: `오른쪽으로 갈수록 1씩 커진다. 위로 올라갈수록 ${cell(nRows - 1, 0)}, ${cell(nRows - 2, 0)}, ${josa(cell(nRows - 3, 0), '과/와')} 같이 ${n}씩 커지고, 아래로 내려갈수록 ${n}씩 작아진다.`, facts: truthOf(said, true)
      });
    }),
    T('lf-bus', '버스 시간표의 규칙', '①59', (d) => {
      // 시마다 같은 분에 출발한다. 한 시 안에서만 셈한다.
      const gap = d.pick([10, 15, 20]), from = d.pick(gap === 10 ? [5] : gap === 15 ? [5, 10] : [5, 10, 15]), mins = range(60 / gap).map((i) => from + i * gap), hour = d.int(7, 9), at = d.int(2, mins.length - 1);
      const line = (hide) => mins.map((m, i) => (hide && i === at ? box('㉡') : m)).join(', ');
      return M(`버스가 출발하는 시각을 나타낸 표이다. 버스는 ㉠분마다 출발한다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: gap, unit: '분' }, { label: '㉡', answer: mins[at] }], {
        figure: table(['시', '분'], [[hour, line(false)], [hour + 1, line(true)]]), explain: `${hour}시에 ${mins[0]}분, ${mins[1]}분, ${mins[2]}분으로 ${gap}분마다 출발한다. ㉡에 알맞은 수는 ${mins[at - 1]} + ${gap} = ${mins[at]}이다.`,
        facts: { calc: [[`${mins[1]}-${mins[0]}`, 0], [`${mins[at - 1]}+(${mins[1]}-${mins[0]})`, 1]] }
      });
    }),
    T('lf-clock', '시계가 놓인 규칙', '①59·60', (d) => {
      // 30분씩, 1시간씩, 2시간씩 지난 시각. 틀린 보기: 30분·1시간을 더 가거나 덜 간 시각
      const gap = d.pick([30, 60, 120]), times = d.until(() => { const t0 = gap === 120 ? d.int(1, 5) * 60 : d.int(2, 16) * 30; return range(4).map((i) => t0 + i * gap); }, (list) => list.slice(0, 3).every((t) => handsApart(t) >= 20)), right = times[3];
      const options = d.shuffle(distinct([right, right + 30, right - 30, right + 60, right - 60], String).filter((t) => t >= 60 && t <= 750).slice(0, 4));
      return C('시계가 규칙에 따라 놓여 있다. 빈칸에 알맞은 시계가 나타내는 시각은?', options.map(timeText), options.indexOf(right), {
        figure: row(times.slice(0, 3).map((t) => clock(t, true)).concat([BL()]), { w: 70, label: '시계' }),
        explain: `시계가 나타내는 시각은 ${times.slice(0, 3).map(timeText).join(', ')}이다. ${gap === 30 ? '30분' : gap / 60 + '시간'}씩 지난 시각이므로 빈칸에 알맞은 시각은 ${timeText(right)}이다.`,
        facts: { kindPick: { kinds: options.map(timeText), target: timeText(times[2] + (times[2] - times[1])) } }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
