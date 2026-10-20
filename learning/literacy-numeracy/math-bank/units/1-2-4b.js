// 1학년 2학기 4단원 덧셈과 뺄셈(2) — 뺄셈 문항과 실력 문항(단원 틀, 그림 도구, 덧셈 문항은 1-2-4a.js).
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 문항은 여기서 나온다)
//  - 10을 만들 때 가르는 수와 가르는 크기는 식마다 다르다: 7 + 5는 5를 3과 2로, 6 + 8은 6을 4와 2로 가른다. 아무렇게나 가르면 10이 만들어지지 않는다.
//  - 15 − 7에서 7을 5와 2로 가르면 15 − 5 = 10, 10 − 2 = 8이다. 5를 빼고 나서 7을 통째로 또 빼는 아이가 있다.
//    15를 10과 5로 가르면 10 − 7 = 3, 3 + 5 = 8이다. 남겨 둔 5를 더하지 않고 빼는 아이가 있다.
//  - 합이 같으려면 한 수가 1 커질 때 다른 수는 1 작아져야 하고, 차가 같으려면 두 수가 함께 1씩 커져야 한다. 둘을 뒤섞는다.
//  - 「더 많다」가 있으면 더하고 「남았다」가 있으면 뺀다고 낱말만 보고 셈을 고른다.
//    (「~보다 몇 개 더 많은가」는 뺄셈, 「먹었더니 몇 개가 남았다. 처음에는?」은 덧셈이다.)
//
// 뺀 것과 까닭
//  - 수의 범위 밖(차가 10 — 받아내림이 없는 뺄셈): 낱개를 모두 빼어 10 남기기(①35 심26), 차가 10이 되게 빼는 수 채우기(심27), 끝 식의 차가 10이 되는 뺄셈 줄(①46 변형).
//    낱개를 먼저 빼어 10을 만드는 일은 「뒤의 수를 갈라 빼기」의 과정(15 − 5 = 10)으로 묻는다.
//  - 2-1-3 「덧셈과 뺄셈」의 것: 잘못 계산한 어떤 수(①65 심48 — 어떤 수를 □로 놓고 덧셈과 뺄셈의 관계로 푼다), 더한 뒤 빼는 두 단계 문장제(심50),
//    한 줄에 덧셈과 뺄셈을 섞어 쓴 식으로 고치기(①39의 원문 15 + 5 − 2 — 과정이 틀린 것을 고르는 실력 문항으로 바꾸어 실음)
//  - 뜻 없는 셈: 두 뺄셈의 차를 더하기(①45 심36), 짝수만 골라 빼기(①29 변형), 기호가 세 번 이어지는 식(①23 변형)
//  - 조건 풀이: □가 든 부등식에 맞는 수 모두 찾기(심40), 카드를 한 번씩만 써서 두 식을 함께 완성하기(①57 변형)
//  - 그리기·글자: /표를 직접 긋기(①31 심22 — 그어 놓은 그림을 읽는 문항으로 실음), 칠한 칸이 글자가 되는 문제(①52 — 차가 같은 식 세기와 같다)
//  - 같은 일: 화살표 한 단계(①41), 두 수의 차(심28 — 가장 큰 수와 가장 작은 수의 차에 들어 있다), 고른 두 카드의 차 견주기(심42 — 차가 가장 작은 식 고르기와 같다),
//    뺄셈표의 빈칸에 식 쓰기(①49 변형 — 덧셈표에서 한 번 실음), 차가 같은 두 식(①53 변형 — 덧셈에서 한 번 실음)
//  - 만들 수 없는 것: 계산 결과가 같은 덧셈식과 뺄셈식의 짝 — 이 단원의 덧셈 결과는 11~18, 뺄셈 결과는 2~9라서 겹치지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, lines, tagged, numbers, cards, chain, N, M, C, E, shown } = B.kit;
  const { ADDS, SUBS, isAdd, isSub, addOf, subOf, sumOf, difOf, say, ORDERS, crossed, twoRows, tray, tree, blank, strip, grid, way, MEAN, CALC } = B.kit.g124;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});

  B.addTypes('1-2-4', 'subsee', [
    T('see-back', '거꾸로 세기로 뺄셈하기', '①30', (d) => {
      // 13개에서 5개: 13 → 12, 11, 10, ㉠, ㉡
      const [m, s] = subOf(d, (p) => p[1] >= 3 && p[1] <= 5), left = m - s;
      const cells = [m]; for (let v = m - 1; v >= left; v -= 1) cells.push(v === left + 1 ? LABELS[0] : v === left ? LABELS[1] : v);
      const counted = Array.from({ length: s }, (_, i) => m - 1 - i).join(', ');
      return M(`남은 구슬이 몇 개인지 ${m}에서부터 거꾸로 세었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: left + 1 }, { label: LABELS[1], answer: left }], {
        figure: crossed(m, s, 'dot', 'red', `구슬 ${m}개 가운데 ${s}개에 /표`) + strip(cells),
        explain: `${m}에서부터 ${s}개를 거꾸로 세면 ${counted}이다. 남은 구슬은 ${left}개이다.`,
        facts: { calc: [[`${m}-${s}+1`, 0], [`${m}-${s}`, 1]], unseen: [1] }
      });
    }),
    T('see-cross', '덜어 낸 그림을 보고 뺄셈식의 빈칸 채우기', '①31 ①32 심22', (d) => {
      // 14개 가운데 /표 한 6개: 14 − ㉠ = ㉡
      const [m, s] = subOf(d, (p) => p[0] !== 2 * p[1]);
      return M(`사탕 ${m}개 중에서 /표 한 만큼 먹었다. 남은 사탕의 수를 뺄셈식으로 나타내었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: s }, { label: LABELS[1], answer: m - s }], {
        figure: crossed(m, s, 'box', 'yellow', `사탕 ${m}개 가운데 ${s}개에 /표`) + expr(m, '-', box(LABELS[0]), '=', box(LABELS[1])),
        explain: `/표 한 사탕은 ${s}개이다. ${say(m, '-', s, m - s)}`,
        facts: { calc: [[String(s), 0], [E(m, '-', s), 1]] }
      });
    }),
    T('see-match', '하나씩 짝 지어 몇 개 더 많은지 구하기', '①34 ①32 심24', (d) => {
      // 윗줄 ○ 13개, 아랫줄 △ 8개
      const [m, s] = subOf(d), more = d.bool();
      return N(more ? '○는 △보다 몇 개 더 많은가?' : '△는 ○보다 몇 개 더 적은가?', m - s, {
        unit: '개', figure: twoRows({ n: m, kind: 'dot', color: 'red' }, { n: s, kind: 'tri', color: 'blue' }, `윗줄에 ○ ${m}개, 아랫줄에 △ ${s}개. 위아래로 하나씩 짝 지어 선으로 이음`, { link: true }),
        explain: `○ ${m}개와 △ ${s}개를 하나씩 짝 지으면 ○가 ${m - s}개 남는다. ${say(m, '-', s, m - s)}`,
        facts: { calc: [[E(m, '-', s), 0]] }
      });
    }),
    T('see-subpick', '그림에 알맞은 뺄셈식 고르기', '①33 심23', (d) => {
      // 13개 가운데 6개에 /표 → 13 − 6 = 7
      const [m, s] = subOf(d, (p) => Math.abs(p[0] - 2 * p[1]) >= 2 && (isSub(p[0], p[1] + 1) || isSub(p[0], p[1] - 1))), left = m - s;
      const off = d.until(() => d.pick([-1, 1]), (k) => isSub(m, s + k)), slip = d.until(() => d.pick([-1, 1]), (k) => left + k >= 2 && left + k <= 9);
      // 틀린 보기: 계산이 틀린 식(그림은 맞게 읽었으나 잘못 뺀 아이), 남은 수를 빼는 수 자리에 적은 식(/표 한 것과 남은 것을 바꾼 아이), /표를 하나 잘못 센 식
      const list = d.shuffle([[m, s, left], [m, s, left + slip], [m, left, s], [m, s + off, left - off]]);
      return C('그림에 알맞은 뺄셈식은?', list.map((p) => say(p[0], '-', p[1], p[2])), list.findIndex((p) => p[1] === s && p[2] === left), {
        figure: crossed(m, s, 'dot', 'green', `구슬 ${m}개 가운데 ${s}개에 /표`),
        explain: `구슬 ${m}개 가운데 ${s}개에 /표를 하였다. ${say(m, '-', s, left)}`,
        facts: { truth: list.map((p) => p[0] === m && p[1] === s && p[2] === m - s), want: true }
      });
    })
  ]);

  B.addTypes('1-2-4', 'subten', [
    T('sub-back', '뒤의 수를 갈라 빼기', '①36 ①35 심25', (d) => {
      // 13 − 9: 9를 3과 ㉠으로 → 13 − 3 = 10, 10 − 6 = 4
      const [m, s] = subOf(d), ones = m - 10, rest = s - ones;
      return M('뒤의 수를 갈라 10을 만들어 뺀다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: rest }, { label: LABELS[1], answer: m - s }], {
        figure: tree([m, '−', s, '=', blank(LABELS[1])], 2, [ones, blank(LABELS[0])], `가르기 그림: ${m} − ${s} = □에서 ${josa(s, '을/를')} ${josa(ones, '과/와')} □로 가름`),
        explain: `${say(m, '-', ones, 10)}이므로 ${josa(s, '을/를')} ${josa(ones, '과/와')} ${josa(rest, '으로/로')} 가른다. ${say(10, '-', rest, m - s)}`,
        facts: { calc: [[`${s}-${ones}`, 0], [E(m, '-', s), 1]], rule: 'split-back' }
      });
    }),
    T('sub-backpic', '달걀판을 보고 10을 만들어 빼기', '심22 ①35 ①36', (d) => {
      // 달걀 13개(판에 10개, 밖에 3개)에서 5개: 13 − ㉠ = 10, 10 − ㉡ = ㉢
      const [m, s] = subOf(d), ones = m - 10, rest = s - ones;
      return M(`달걀 ${m}개 중에서 /표 한 ${s}개를 덜어 낸다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: ones }, { label: LABELS[1], answer: rest }, { label: LABELS[2], answer: m - s }], {
        figure: tray(m, s) + lines([expr(m, '-', box(LABELS[0]), '=', 10), expr(10, '-', box(LABELS[1]), '=', box(LABELS[2]))]),
        explain: `달걀판 밖의 ${ones}개를 먼저 덜어 내면 10개가 남고, 달걀판에서 ${rest}개를 더 덜어 낸다. ${say(m, '-', ones, 10)}, ${say(10, '-', rest, m - s)}`,
        facts: { calc: [[`${m}-10`, 0], [`${s}-(${m}-10)`, 1], [E(m, '-', s), 2]] }
      });
    }),
    T('sub-front', '앞의 수를 10과 몇으로 갈라 빼기', '①37', (d) => {
      // 15 − 8: 15를 10과 ㉠으로 → 10 − 8 = 2, 2 + 5 = 7
      const [m, s] = subOf(d), ones = m - 10;
      return M('앞의 수를 10과 몇으로 갈라 뺀다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: ones }, { label: LABELS[1], answer: m - s }], {
        figure: tree([m, '−', s, '=', blank(LABELS[1])], 0, [10, blank(LABELS[0])], `가르기 그림: ${m} − ${s} = □에서 ${josa(m, '을/를')} 10과 □로 가름`),
        explain: `${josa(m, '을/를')} 10과 ${josa(ones, '으로/로')} 가른다. ${say(10, '-', s, 10 - s)}, ${say(10 - s, '+', ones, m - s)}`,
        facts: { calc: [[`${m}-10`, 0], [E(m, '-', s), 1]], rule: 'split-front' }
      });
    }),
    T('sub-two', '한 뺄셈을 두 가지 방법으로 계산하기', '①38', (d) => {
      // 14 − 8: 8을 4와 ㉠으로 / 14를 10과 ㉡으로
      const [m, s] = subOf(d), ones = m - 10, rest = s - ones;
      return M(`${m} − ${josa(s, '을/를')} 두 가지 방법으로 계산한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: rest }, { label: LABELS[1], answer: ones }, { label: LABELS[2], answer: m - s }], {
        figure: way('방법 1', tree([m, '−', s], 2, [ones, blank(LABELS[0])], `방법 1: ${m} − ${s}에서 ${josa(s, '을/를')} ${josa(ones, '과/와')} □로 가름`))
          + way('방법 2', tree([m, '−', s], 0, [10, blank(LABELS[1])], `방법 2: ${m} − ${s}에서 ${josa(m, '을/를')} 10과 □로 가름`))
          + expr(m, '-', s, '=', box(LABELS[2])),
        explain: `방법 1: ${say(m, '-', ones, 10)}, ${say(10, '-', rest, m - s)}. 방법 2: ${say(10, '-', s, 10 - s)}, ${say(10 - s, '+', ones, m - s)}.`,
        facts: { calc: [[`${s}-${ones}`, 0], [`${m}-10`, 1], [E(m, '-', s), 2]] }
      });
    })
  ]);

  // 차가 같도록 두 수를 함께 옮긴 식, 한 수만 옮긴 식
  const shifted = (p, dm, ds) => [p[0] + dm, p[1] + ds];

  B.addTypes('1-2-4', 'subrule', [
    T('sub-row', '가로셈', '①40 ①41 심28', (d) => {
      const [m, s] = subOf(d);
      return N('다음을 계산하시오.', m - s, { figure: expr(m, '-', s, '=', box()), explain: shown(m, '-', s), facts: { calc: [[E(m, '-', s), 0]] } });
    }),
    T('sub-match', '뺄셈식과 계산 결과 짝 짓기', '①42 심30', (d) => {
      const rows = d.until(() => d.shuffle(SUBS).slice(0, 3), (list) => { const v = list.map(difOf); return new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 4 && new Set(list.map((p) => p[0])).size === 3; });
      const values = rows.map(difOf);
      const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map((p) => expr(p[0], '-', p[1]))), explain: rows.map((p, i) => `${LABELS[i]} ${say(p[0], '-', p[1], difOf(p))}`).join(', '),
        facts: { match: { exprs: rows.map((p) => E(p[0], '-', p[1])), options: list.map((o) => o.map((k) => values[k])) } }
      });
    }),
    T('sub-ends', '가장 큰 수와 가장 작은 수의 차', '①43 심35 심28', (d) => {
      // 16, 7, 11, 8 → 16 − 7
      const [big, small] = subOf(d, (p) => p[0] - p[1] >= 4);
      const mid = d.until(() => [d.int(small + 1, big - 1), d.int(small + 1, big - 1)], (v) => v[0] !== v[1]);
      const list = d.shuffle([big, small, mid[0], mid[1]]);
      return N('네 수 중 가장 큰 수와 가장 작은 수의 차는?', big - small, {
        figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${say(big, '-', small, big - small)}`,
        facts: { pairs: { numbers: list, want: 'maxDiff' } }
      });
    }),
    T('srule-down', '1씩 작아지는 수에서 같은 수를 빼는 뺄셈', '①46 심29', (d) => {
      // 15 − 8, 14 − 8, 13 − 8
      const [m, s] = subOf(d, (p) => isSub(p[0] - 2, p[1]));
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [0, 1, 2].map((i) => ({ label: LABELS[i], answer: m - i - s })), {
        figure: lines([0, 1, 2].map((i) => expr(m - i, '-', s, '=', box(LABELS[i])))),
        explain: `1씩 작아지는 수에서 같은 수를 빼면 차도 1씩 작아진다. 차례로 ${m - s}, ${m - s - 1}, ${m - s - 2}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [E(m - i, '-', s), i]), rule: 'row-one' }
      });
    }),
    T('srule-say', '뺄셈식의 규칙 말하기', '①46', (d) => {
      // 11 − 7 = 4, 11 − 8 = 3, 11 − 9 = 2 (빼는 수가 1씩 커진다) 또는 13 − 6 = 7, 14 − 6 = 8, 15 − 6 = 9 (앞의 수가 1씩 커진다)
      const back = d.bool(), [m, s] = subOf(d, (p) => (back ? isSub(p[0], p[1] + 2) : isSub(p[0] + 2, p[1])));
      const rows = [0, 1, 2].map((i) => (back ? [m, s + i] : [m + i, s])), difs = rows.map(difOf), step = difs[1] - difs[0];
      const head = back ? '같은 수에서 1씩 커지는 수를 빼면' : '1씩 커지는 수에서 같은 수를 빼면';
      const list = d.shuffle([[`${head} 차는 1씩 작아진다.`, -1], [`${head} 차는 1씩 커진다.`, 1], [`${head} 차는 변하지 않는다.`, 0]]);
      return C('뺄셈식을 보고 바르게 말한 것은?', list.map((row) => row[0]), list.findIndex((row) => row[1] === step), {
        figure: lines(rows.map((p) => expr(p[0], '-', p[1], '=', difOf(p)))),
        explain: `차가 ${difs.join(', ')}${josa(difs[2], '으로/로').slice(String(difs[2]).length)} 1씩 ${step > 0 ? '커진다' : '작아진다'}.`,
        facts: { truth: list.map((row) => difs.every((v, i) => i === 0 || v - difs[i - 1] === row[1])), want: true }
      });
    }),
    T('srule-both', '두 수가 함께 1씩 커지는 뺄셈', '①47', (d) => {
      // 15 − 7, 16 − 8, 17 − 9
      const [m, s] = subOf(d, (p) => isSub(p[0] + 2, p[1] + 2));
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [0, 1, 2].map((i) => ({ label: LABELS[i], answer: m - s })), {
        figure: lines([0, 1, 2].map((i) => expr(m + i, '-', s + i, '=', box(LABELS[i])))),
        explain: `두 수가 함께 1씩 커지면 차는 같다. 세 식의 차는 모두 ${m - s}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [E(m + i, '-', s + i), i]), rule: 'row-both' }
      });
    }),
    T('srule-twin', '빼는 수와 차를 바꾼 뺄셈', '①48 ①55', (d) => {
      // 12 − 4 = ㉠, 12 − 8 = ㉡
      const [m, s] = subOf(d, (p) => p[0] !== 2 * p[1]), left = m - s;
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: left }, { label: LABELS[1], answer: s }], {
        figure: lines([expr(m, '-', s, '=', box(LABELS[0])), expr(m, '-', left, '=', box(LABELS[1]))]),
        explain: `${say(m, '-', s, left)}이므로 ${say(m, '-', left, s)}이다.`,
        facts: { calc: [[E(m, '-', s), 0], [E(m, '-', left), 1]] }
      });
    }),
    T('srule-table', '뺄셈식이 놓인 표의 빈칸', '①49', (d) => {
      // 가로줄은 앞의 수가, 세로줄은 뒤의 수가 같은 표(3줄 3칸)
      const [m, s] = subOf(d, (p) => isSub(p[0] + 2, p[1]) && isSub(p[0], p[1] + 2));
      const hidden = d.until(() => d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3).sort((x, y) => x - y), (list) => new Set(list.map((k) => Math.floor(k / 3))).size >= 2 && new Set(list.map((k) => k % 3)).size >= 2);
      const at = (k) => [m + Math.floor(k / 3), s + (k % 3)];
      const rows = [0, 1, 2].map((i) => [0, 1, 2].map((j) => { const k = i * 3 + j, h = hidden.indexOf(k); return [say(m + i, '-', s + j), h < 0 ? m + i - s - j : box(LABELS[h])]; }));
      return M('표의 ㉠, ㉡, ㉢에 알맞은 수는?', hidden.map((k, i) => ({ label: LABELS[i], answer: difOf(at(k)) })), {
        figure: grid(rows),
        explain: hidden.map((k, i) => `${LABELS[i]} ${say(at(k)[0], '-', at(k)[1], difOf(at(k)))}`).join(', ') + '. 오른쪽으로 한 칸 가면 차가 1 작아지고, 아래로 한 칸 가면 차가 1 커진다.',
        facts: { calc: hidden.map((k, i) => [E(at(k)[0], '-', at(k)[1]), i]) }
      });
    }),
    T('srule-talk', '뺄셈식이 놓인 표를 보고 잘못 말한 것', '①50', (d) => {
      // 두 줄 세 칸: 13 − 5, 13 − 6, 13 − 7 / 14 − 5, 14 − 6, 14 − 7
      const [m, s] = subOf(d, (p) => isSub(p[0] + 1, p[1]) && isSub(p[0], p[1] + 2)), bad = d.int(0, 2), least = m - s - 2;
      const [i, j] = d.pick([[0, 0], [0, 1], [1, 1], [1, 2]]), x = m + i, y = s + j, slip = d.pick([-1, 1]);
      const saidDif = x - y + (bad === 0 ? slip : 0), saidLeast = least + (bad === 2 ? slip : 0), saidStep = bad === 1 ? 1 : -1;
      const list = d.shuffle([
        { text: `${say(x, '-', y, saidDif)}이다.`, ok: x - y === saidDif },
        { text: `오른쪽으로 한 칸 갈 때마다 차가 1씩 ${saidStep === 1 ? '커진다' : '작아진다'}.`, ok: (m - (s + 1)) - (m - s) === saidStep },
        { text: `가장 작은 차는 ${saidLeast}이다.`, ok: saidLeast === Math.min(m - s - 2, m + 1 - s - 2) }
      ]);
      return C('표를 보고 잘못 말한 것은?', list.map((row) => row.text), list.findIndex((row) => !row.ok), {
        figure: grid([0, 1].map((p) => [0, 1, 2].map((q) => [say(m + p, '-', s + q)]))),
        explain: bad === 0 ? `${say(x, '-', y, x - y)}이다.` : bad === 1 ? '빼는 수가 1씩 커지므로 차는 1씩 작아진다.' : `가장 작은 차는 ${say(m, '-', s + 2, least)}이다.`,
        facts: { truth: list.map((row) => row.ok), want: false }
      });
    }),
    T('srule-count', '차가 같은 뺄셈식 세기', '①51 ①52 ①53 심31', (d) => {
      // 여섯 식 가운데 차가 6인 식의 수. 나머지는 차가 1 다르다.
      const t = d.int(5, 8), hit = d.int(2, 4);
      const yes = d.shuffle(SUBS.filter((p) => difOf(p) === t)).slice(0, hit), no = d.shuffle(SUBS.filter((p) => Math.abs(difOf(p) - t) === 1)).slice(0, 6 - hit);
      const list = d.shuffle(yes.concat(no));
      return N(`차가 ${t}인 식은 모두 몇 개인가?`, hit, {
        unit: '개', figure: grid([0, 1].map((p) => [0, 1, 2].map((q) => [say(list[p * 3 + q][0], '-', list[p * 3 + q][1])]))),
        explain: `차가 ${t}인 식은 ${list.filter((p) => difOf(p) === t).map((p) => say(p[0], '-', p[1])).join(', ')}이다.`,
        facts: { count: list.map((p) => difOf(p) === t) }
      });
    }),
    T('srule-same', '차가 같은 뺄셈식 고르기', '①53 ①47', (d) => {
      // 11 − 3과 차가 같은 식: 12 − 4(두 수가 함께 1씩 커졌다). 틀린 보기는 한 수만 1 달라진 식이다.
      const [m, s] = subOf(d, (p) => (isSub(p[0] + 1, p[1] + 1) || isSub(p[0] - 1, p[1] - 1)) && [[1, 0], [0, 1], [-1, 0], [0, -1]].filter((k) => isSub(p[0] + k[0], p[1] + k[1])).length >= 3);
      const right = d.pick([[1, 1], [-1, -1]].map((k) => shifted([m, s], k[0], k[1])).filter((p) => isSub(p[0], p[1])));
      const wrong = d.shuffle([[1, 0], [0, 1], [-1, 0], [0, -1]].map((k) => shifted([m, s], k[0], k[1])).filter((p) => isSub(p[0], p[1]))).slice(0, 3);
      const list = d.shuffle(wrong.concat([right]));
      return C(`${m} − ${josa(s, '과/와')} 차가 같은 식은?`, list.map((p) => expr(p[0], '-', p[1])), list.indexOf(right), {
        explain: `${say(m, '-', s, m - s)}, ${say(right[0], '-', right[1], m - s)}`,
        facts: { choose: { exprs: list.map((p) => E(p[0], '-', p[1])), rule: 'equals', target: m - s } }
      });
    }),
    T('srule-odd', '차가 나머지와 다른 뺄셈식', '①54', (d) => {
      const t = d.int(5, 8), three = d.shuffle(SUBS.filter((p) => difOf(p) === t)).slice(0, 3), lone = d.pick(SUBS.filter((p) => Math.abs(difOf(p) - t) === 1));
      const list = d.shuffle(three.concat([lone]));
      return C('차가 나머지와 다른 식은?', list.map((p) => expr(p[0], '-', p[1])), list.indexOf(lone), {
        explain: list.map((p) => say(p[0], '-', p[1], difOf(p))).join(', '),
        facts: { choose: { exprs: list.map((p) => E(p[0], '-', p[1])), rule: 'odd' } }
      });
    }),
    T('srule-min', '차가 가장 작은 뺄셈식', '①44 심33', (d) => {
      // 앞의 수가 가장 작은 식도, 빼는 수가 가장 큰 식도 답이 아니게 하여 계산해야 알 수 있게 한다.
      const rows = d.until(() => d.shuffle(SUBS).slice(0, 4), (list) => {
        const v = list.map(difOf), best = v.indexOf(Math.min(...v));
        return v.filter((x) => x === Math.min(...v)).length === 1 && Math.max(...v) - Math.min(...v) <= 4 && new Set(v).size >= 3 && new Set(list.map((p) => p[0])).size === 4
          && list[best][0] !== Math.min(...list.map((p) => p[0])) && list[best][1] !== Math.max(...list.map((p) => p[1]));
      });
      const values = rows.map(difOf);
      return C('차가 가장 작은 식은?', LABELS.slice(0, 4), values.indexOf(Math.min(...values)), {
        figure: tagged(rows.map((p) => expr(p[0], '-', p[1]))), explain: rows.map((p, i) => `${LABELS[i]} ${say(p[0], '-', p[1], difOf(p))}`).join(', '),
        facts: { choose: { exprs: rows.map((p) => E(p[0], '-', p[1])), rule: 'min' } }
      });
    }),
    T('srule-order', '차가 큰 식부터 차례로 쓰기', '심34 심33', (d) => {
      const rows = d.until(() => d.shuffle(SUBS).slice(0, 3), (list) => { const v = list.map(difOf); return new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 4 && new Set(list.map((p) => p[0])).size === 3; });
      const values = rows.map(difOf), right = [0, 1, 2].sort((x, y) => values[y] - values[x]);
      const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('차가 큰 식부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map((p) => expr(p[0], '-', p[1]))), explain: rows.map((p, i) => `${LABELS[i]} ${say(p[0], '-', p[1], difOf(p))}`).join(', '),
        facts: { choose: { exprs: rows.map((p) => E(p[0], '-', p[1])), rule: 'descending', orders: list } }
      });
    }),
    T('srule-box', '뺄셈식의 □', '①55 심38', (d) => {
      // 13 − □ = 9
      const [m, s] = subOf(d);
      return N('□ 안에 알맞은 수는?', s, {
        figure: expr(m, '-', box(), '=', m - s), explain: `${m}에서 ${josa(s, '을/를')} 빼면 ${josa(m - s, '이/가')} 된다. ${say(m, '-', s, m - s)}`,
        facts: { inverse: ['a-x=c', m, s, m - s], calc: [[E(m, '-', m - s), 0]] }
      });
    }),
    T('srule-cards', '수 카드로 뺄셈식 완성하기', '①57 심41', (d) => {
      // 3, 5, 9 가운데 두 장으로 14 − □ = □ → 5, 9
      const list = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y), (xs) => { const v = [xs[0] + xs[1], xs[0] + xs[2], xs[1] + xs[2]]; return new Set(v).size === 3 && Math.min(...v) >= 9 && v.some((x) => x >= 11 && x <= 17); });
      const all = [[list[0], list[1]], [list[0], list[2]], [list[1], list[2]]], right = d.pick(all.filter((p) => sumOf(p) >= 11 && sumOf(p) <= 17)), m = sumOf(right);
      const options = d.shuffle(all);
      return C('수 카드 3장 중 2장을 골라 뺄셈식을 완성한다. 고른 두 수는?', options.map((p) => p.join(', ')), options.indexOf(right), {
        figure: cards(d.shuffle(list)) + expr(m, '-', box(), '=', box()), explain: `${say(m, '-', right[0], right[1])}, ${say(m, '-', right[1], right[0])}`,
        facts: { choose: { exprs: options.map((p) => E(p[0], '+', p[1])), rule: 'equals', target: m } }
      });
    }),
    T('srule-carddiff', '수 카드로 차가 정해진 뺄셈식 만들기', '①58', (d) => {
      // 12, 8, 15, 5 가운데 두 장으로 ㉠ − ㉡ = 4 → 12, 8
      const [big, small] = subOf(d), t = big - small;
      const list = d.until(() => d.shuffle([big, small, d.int(11, 18), d.int(2, 9)]), (xs) => new Set(xs).size === 4 && xs.reduce((n, x, i) => n + xs.filter((y, k) => k > i && Math.abs(x - y) === t).length, 0) === 1);
      return M(`수 카드 2장을 골라 차가 ${t}인 뺄셈식을 만든다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: big }, { label: LABELS[1], answer: small }], {
        figure: cards(list) + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', t), explain: say(big, '-', small, t),
        facts: { pairs: { numbers: list, want: 'diff', target: t } }
      });
    }),
    T('mix-chain', '화살표를 따라 이어서 계산하기', '심37', (d) => {
      // 7 → +4 → ㉠ → −9 → ㉡. 칸마다 한 번씩 계산한다.
      const [a, b] = addOf(d), c = d.until(() => d.int(2, 9), (v) => isSub(a + b, v));
      return M('화살표를 따라 계산한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: a + b - c }], {
        figure: chain([a, '+' + b, box(LABELS[0]), '-' + c, box(LABELS[1])]), explain: `${say(a, '+', b, a + b)}, ${say(a + b, '-', c, a + b - c)}`,
        facts: { calc: [[`${a}+${b}`, 0], [`${a}+${b}-${c}`, 1]] }
      });
    })
  ]);

  B.addTypes('1-2-4', 'subword', [
    T('sword-left', '문장제: 덜어 내고 남은 것', '①59 심43', (d) => {
      const [m, s] = subOf(d);
      return N(`연필이 ${m}자루 있었다. 그중에서 ${s}자루를 친구에게 주었다. 남은 연필은 몇 자루인가?`, m - s, { unit: '자루', explain: shown(m, '-', s), facts: { calc: [[E(m, '-', s), 0]] } });
    }),
    T('sword-who', '문장제: 누가 몇 개 더 많은지', '①60 ①34 심44', (d) => {
      const [one, two] = d.shuffle(NAMES).slice(0, 2), [m, s] = subOf(d), gap = m - s;
      const values = d.bool() ? [m, s] : [s, m], winner = values[0] > values[1] ? 0 : 1, other = gap + (gap >= 9 ? -1 : gap <= 2 ? 1 : d.pick([-1, 1]));
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
      return C(`${name(one, '은/는')} 딱지를 ${values[0]}장, ${name(two, '은/는')} ${values[1]}장 모았다. 누가 몇 장 더 많이 모았는가?`, list.map((row) => `${[one, two][row[0]]}, ${row[1]}장`), list.findIndex((row) => row[0] === winner && row[1] === gap), {
        explain: `${name([one, two][winner], '이/가')} 더 많이 모았다. ${say(m, '-', s, gap)}`,
        facts: { who: { values, options: list } }
      });
    }),
    T('sword-less', '문장제: 더 적은 쪽의 수', '①61 심45', (d) => {
      const [m, s] = subOf(d);
      return N(`그림책이 ${m}권 있다. 동화책은 그림책보다 ${s}권 더 적다. 동화책은 몇 권인가?`, m - s, { unit: '권', explain: shown(m, '-', s), facts: { calc: [[E(m, '-', s), 0]] } });
    }),
    T('sword-need', '문장제: 더 있어야 하는 수', '①62', (d) => {
      const [m, s] = subOf(d);
      return N(`어린이 ${m}명에게 풍선을 한 개씩 주려고 한다. 풍선이 ${s}개 있다. 풍선은 몇 개 더 있어야 하는가?`, m - s, { unit: '개', explain: `${m}개가 있어야 하는데 ${s}개가 있다. ${say(m, '-', s, m - s)}`, facts: { calc: [[E(m, '-', s), 0]] } });
    }),
    T('sword-gone', '문장제: 덜어 낸 수', '①64 심46 심38', (d) => {
      // 12개에서 몇 개를 먹었더니 9개
      const [m, left] = subOf(d);
      return N(`초콜릿이 ${m}개 있었다. 몇 개를 먹었더니 ${left}개가 남았다. 먹은 초콜릿은 몇 개인가?`, m - left, { unit: '개', explain: `처음에 있던 수에서 남은 수를 뺀다. ${say(m, '-', left, m - left)}`, facts: { calc: [[E(m, '-', left), 0]] } });
    })
  ]);

  // ── 실력 ─────────────────────────────────────────────────────
  // ① 배운 뜻을 정확히 대야 풀리는 문제: h-addsplit, h-sumsame, h-subways, h-diffsame, h-whichadd, h-start, h-compare
  // ② 두 번 넘게 생각해야 풀리는 문제: h-twolines, h-moreall, h-boxmax, h-twice
  B.addGroup('1-2-4', {
    id: 'hard', title: '단원 종합', standard: CALC,
    types: [
      H('h-addsplit', '10을 만들려고 가른 수가 틀린 것', '심4 심5 심6 ①9', (d) => {
        // 가르는 수와 가르는 크기는 식마다 다르다. 뒤의 수를 가른 것 둘과 앞의 수를 가른 것 하나는 옳고, 하나는 가르기는 했으나 10이 만들어지지 않는다.
        // 옳은 보기를 고르는 아이: 앞의 수를 가른 것 — 뒤의 수만 가를 수 있다고 아는 아이. 뒤의 수를 가른 것 — 가른 두 수의 합만 맞춰 보고 넘어가는 아이는 틀린 보기도 옳다고 본다.
        const badBack = d.bool();
        const picks = d.until(() => d.shuffle(ADDS).slice(0, 4), (list) => list.every((p) => p[0] !== p[1] && p[0] >= 4 && p[1] >= 4) && new Set(list.map((p) => Math.min(p[0], p[1]) + ',' + Math.max(p[0], p[1]))).size === 4 && list.some((p) => (badBack ? p[1] : p[0]) >= 5));
        const rowOf = (p, back, wrong) => {
          const cut = back ? p[1] : p[0], other = back ? p[0] : p[1], fill = 10 - other;
          let first = fill;   // 다른 수와 더해 10이 되는 수
          if (wrong) first = d.until(() => d.int(1, cut - 1), (v) => v !== fill && v !== cut - fill);
          const parts = back ? [first, cut - first] : [cut - first, first];
          return { p, back, cut, other, parts, ok: parts[0] + other === 10 || parts[1] + other === 10 };
        };
        // 틀리게 가를 수 있으려면 가르는 수가 넉넉히 커야 한다(가르는 방법이 셋 넘게).
        const order = d.until(() => d.shuffle([0, 1, 2, 3]), (o) => { const p = picks[o[3]], cut = badBack ? p[1] : p[0]; return cut >= 5; });
        const rows = d.shuffle([rowOf(picks[order[0]], true, false), rowOf(picks[order[1]], true, false), rowOf(picks[order[2]], false, false), rowOf(picks[order[3]], badBack, true)]);
        const bad = rows.find((row) => !row.ok);
        return C('10을 만들어 더하려고 한 수를 두 수로 갈랐다. 잘못 가른 것은?', rows.map((row) => `${say(row.p[0], '+', row.p[1])}: ${josa(row.cut, '을/를')} ${josa(row.parts[0], '과/와')} ${josa(row.parts[1], '으로/로')} 가른다.`), rows.indexOf(bad), {
          explain: `${say(bad.p[0], '+', bad.p[1])}에서 ${josa(bad.cut, '을/를')} 가르려면 ${josa(bad.other, '과/와')} 더하여 10이 되는 ${josa(10 - bad.other, '과/와')} ${josa(bad.cut - (10 - bad.other), '으로/로')} 갈라야 한다.`,
          facts: { truth: rows.map((row) => row.parts[0] + row.parts[1] === row.cut && (row.parts[0] + row.other === 10 || row.parts[1] + row.other === 10)), want: false }
        });
      }),
      H('h-sumsame', '합이 같은 덧셈식의 빈칸', '심10 ①15 ①18', (d) => {
        // 9 + 5 = 14, 8 + ㉠ = 14, 7 + ㉡ = 14: 한 수가 1 작아지면 다른 수는 1 커져야 합이 같다(계산하지 않고도 안다).
        // 차가 같은 뺄셈식(두 수가 함께 커진다)과 뒤섞는 아이는 ㉠에 4를 적는다.
        const [a, b] = addOf(d, (p) => p[0] >= 4 && p[1] <= 7 && p[0] !== p[1] + 1 && p[0] !== p[1] + 2), s = a + b;
        return M('세 식의 합이 모두 같다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b + 1 }, { label: LABELS[1], answer: b + 2 }], {
          figure: lines([expr(a, '+', b, '=', s), expr(a - 1, '+', box(LABELS[0]), '=', s), expr(a - 2, '+', box(LABELS[1]), '=', s)]),
          explain: `앞의 수가 1씩 작아지므로 뒤의 수는 1씩 커져야 합이 같다. ${say(a - 1, '+', b + 1, s)}, ${say(a - 2, '+', b + 2, s)}`,
          facts: { calc: [[`${s}-${a - 1}`, 0], [`${s}-${a - 2}`, 1]] }
        });
      }),
      H('h-twolines', '같은 기호가 든 두 덧셈식', '심16 ①23', (d) => {
        // 8 + ㉠ = 13, ㉠ + 7 = ㉡ → 5, 12
        const [a, x] = addOf(d, (p) => p[1] >= 3 && p[1] <= 8), c = d.until(() => d.int(2, 9), (v) => isAdd(x, v) && v !== a);
        return M('같은 기호는 같은 수를 나타낸다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: x }, { label: LABELS[1], answer: x + c }], {
          figure: lines([expr(a, '+', box(LABELS[0]), '=', a + x), expr(box(LABELS[0]), '+', c, '=', box(LABELS[1]))]),
          explain: `${say(a, '+', x, a + x)}이므로 ㉠은 ${x}이다. ${say(x, '+', c, x + c)}`,
          facts: { calc: [[`${a + x}-${a}`, 0], [`${a + x}-${a}+${c}`, 1]] }
        });
      }),
      H('h-moreall', '더 많은 쪽을 구해 모두 더하기', '심18 ①25', (d) => {
        // 5개, 4개 더 많다 → 9개, 모두 14개. 5 + 4에서 멈추는 아이가 많다.
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [a, k] = d.until(() => [d.int(3, 7), d.int(1, 5)], (v) => v[0] + v[1] <= 9 && isAdd(v[0], v[0] + v[1]));
        return N(`${name(one, '은/는')} 딱지를 ${a}장 가지고 있다. ${name(two, '은/는')} ${nick(one)}보다 ${k}장 더 많이 가지고 있다. 두 사람이 가진 딱지는 모두 몇 장인가?`, a + a + k, {
          unit: '장', explain: `${name(two, '이/가')} 가진 딱지는 ${say(a, '+', k, a + k)}(장)이다. 두 사람이 가진 딱지는 ${say(a, '+', a + k, a + a + k)}(장)이다.`,
          facts: { calc: [[`${a}+(${a}+${k})`, 0]] }
        });
      }, { standard: MEAN }),
      H('h-subways', '10을 만들어 빼는 과정이 틀린 것', '①39 ①38 심25', (d) => {
        // 15 − 7: 「15 − 5 = 10, 10 − 2 = 8」과 「10 − 7 = 3, 3 + 5 = 8」은 옳다.
        // 틀린 과정 — 5를 빼고 나서 7을 통째로 또 뺀다(가른 두 수를 빼야 한다) / 10에서 7을 빼고 남겨 둔 5를 더하지 않고 뺀다.
        // 옳은 보기를 고르는 아이: 한 가지 방법만 아는 아이는 다른 방법을 틀렸다고 본다.
        const [m, s] = subOf(d, (p) => p[1] - (p[0] - 10) >= 1), ones = m - 10, rest = s - ones, dif = m - s;
        const lost = 10 - s - ones >= 1 && d.bool();
        const rows = d.shuffle([
          { text: `${say(m, '-', ones, 10)}, ${say(10, '-', rest, dif)}`, end: dif },
          { text: `${say(10, '-', s, 10 - s)}, ${say(10 - s, '+', ones, dif)}`, end: dif },
          lost ? { text: `${say(10, '-', s, 10 - s)}, ${say(10 - s, '-', ones, 10 - s - ones)}`, end: 10 - s - ones } : { text: `${say(m, '-', ones, 10)}, ${say(10, '-', s, 10 - s)}`, end: 10 - s }
        ]);
        return C(`${m} − ${josa(s, '을/를')} 10을 만들어 계산하였다. 잘못 계산한 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.end !== dif), {
          explain: lost ? `${josa(m, '을/를')} 10과 ${josa(ones, '으로/로')} 갈랐으므로 10에서 ${josa(s, '을/를')} 빼고 남은 수에 ${josa(ones, '을/를')} 더해야 한다. ${say(10 - s, '+', ones, dif)}` : `${josa(s, '을/를')} ${josa(ones, '과/와')} ${josa(rest, '으로/로')} 갈랐으므로 ${josa(ones, '을/를')} 빼고 나서 ${josa(rest, '을/를')} 빼야 한다. ${say(10, '-', rest, dif)}`,
          facts: { truth: rows.map((row) => row.end === m - s), want: false }
        });
      }),
      H('h-diffsame', '차가 같은 뺄셈식의 빈칸', '심32 ①47', (d) => {
        // 12 − 4 = 8, 13 − ㉠ = 8, 14 − ㉡ = 8: 앞의 수가 1 커지면 뒤의 수도 1 커져야 차가 같다.
        // 합이 같은 덧셈식(한 수가 커지면 다른 수는 작아진다)과 뒤섞는 아이는 ㉠에 3을 적는다.
        const [m, s] = subOf(d, (p) => isSub(p[0] + 2, p[1] + 2)), dif = m - s;
        return M('세 식의 차가 모두 같다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: s + 1 }, { label: LABELS[1], answer: s + 2 }], {
          figure: lines([expr(m, '-', s, '=', dif), expr(m + 1, '-', box(LABELS[0]), '=', dif), expr(m + 2, '-', box(LABELS[1]), '=', dif)]),
          explain: `앞의 수가 1씩 커지므로 뒤의 수도 1씩 커져야 차가 같다. ${say(m + 1, '-', s + 1, dif)}, ${say(m + 2, '-', s + 2, dif)}`,
          facts: { calc: [[`${m + 1}-${dif}`, 0], [`${m + 2}-${dif}`, 1]] }
        });
      }),
      H('h-boxmax', '□ 안의 수가 가장 큰 뺄셈식', '심39 ①56', (d) => {
        // ㉠ 14 − □ = 9 ㉡ 11 − □ = 2 ㉢ 13 − □ = 6 → □는 5, 9, 7. 앞의 수가 가장 큰 식도, 차가 가장 작은 식도 답이 아니게 한다.
        const rows = d.until(() => d.shuffle(SUBS).slice(0, 3), (list) => {
          const v = list.map((p) => p[1]), best = v.indexOf(Math.max(...v)), tops = list.map((p) => p[0]), difs = list.map(difOf);
          return new Set(v).size === 3 && new Set(tops).size === 3 && new Set(difs).size === 3 && tops[best] !== Math.max(...tops) && difs[best] !== Math.min(...difs);
        });
        const values = rows.map((p) => p[1]);
        return C('□ 안의 수가 가장 큰 것은?', LABELS.slice(0, 3), values.indexOf(Math.max(...values)), {
          figure: tagged(rows.map((p) => expr(p[0], '-', box(), '=', difOf(p)))),
          explain: `□ 안의 수는 차례로 ${values.join(', ')}이다. ` + rows.map((p, i) => `${LABELS[i]} ${say(p[0], '-', p[1], difOf(p))}`).join(', '),
          facts: { choose: { exprs: rows.map((p) => E(p[0], '-', difOf(p))), rule: 'max' } }
        });
      }),
      H('h-twice', '두 번 덜어 내고 남은 것', '심49', (d) => {
        // 쿠키 11개에서 3개, 2개를 먹음 → 11 − 3 = 8, 8 − 2 = 6
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [m, p] = subOf(d, (v) => v[0] - v[1] >= 4), q = d.until(() => d.int(2, m - p - 2), (v) => v !== p);
        return N(`쿠키가 ${m}개 있었다. ${name(one, '이/가')} ${p}개를 먹고, ${name(two, '이/가')} ${q}개를 먹었다. 남은 쿠키는 몇 개인가?`, m - p - q, {
          unit: '개', explain: `${name(one, '이/가')} 먹고 남은 쿠키는 ${say(m, '-', p, m - p)}(개)이다. ${name(two, '이/가')} 먹고 남은 쿠키는 ${say(m - p, '-', q, m - p - q)}(개)이다.`,
          facts: { calc: [[`${m}-${p}-${q}`, 0]] }
        });
      }, { standard: MEAN }),
      H('h-whichadd', '덧셈으로 구하는 상황 고르기', '①60 ①61 심18 심44 심45', (d) => {
        // 세 문장 모두 「더 많다·더 적다」가 들어 있다. 덧셈은 「~보다 몇 개 더 많다 → 몇 개인가」 하나뿐이다.
        // 틀린 보기를 고르는 아이: 「더 많은가」 — 「더 많」이라는 말만 보고 더하는 아이. 「더 적다」 — 수가 둘 나오면 더하는 아이.
        const [a, b] = addOf(d, (p) => p[0] !== p[1]), t = a + b;
        const rows = d.shuffle([
          { text: `귤이 ${t}개, 감이 ${a}개 있다. 귤은 감보다 몇 개 더 많은가?`, add: false },
          { text: `귤이 ${a}개 있다. 감은 귤보다 ${b}개 더 많다. 감은 몇 개인가?`, add: true },
          { text: `귤이 ${t}개 있다. 감은 귤보다 ${b}개 더 적다. 감은 몇 개인가?`, add: false }
        ]);
        return C('덧셈으로 구하는 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.add), {
          explain: `감이 귤보다 ${b}개 더 많으면 감의 수는 ${say(a, '+', b, t)}(개)이다. 나머지 둘은 ${say(t, '-', a, b)}, ${say(t, '-', b, a)}${josa(a, '으로/로').slice(String(a).length)} 구한다.`,
          facts: { truth: rows.map((row) => row.add), want: true }
        });
      }, { standard: MEAN }),
      H('h-start', '처음에 있던 수 구하기', '①63 심47', (d, n) => {
        // n = 0: 「남았다」가 있지만 덧셈(먹은 수와 남은 수를 더한다). n = 1: 「더 샀더니」가 있지만 뺄셈.
        if (n === 0) {
          const [a, b] = addOf(d, (p) => p[0] !== p[1]);
          return N(`사탕을 ${a}개 먹었더니 ${b}개가 남았다. 처음에 있던 사탕은 몇 개인가?`, a + b, {
            unit: '개', explain: `처음에 있던 사탕은 먹은 사탕과 남은 사탕을 더한 것이다. ${say(a, '+', b, a + b)}`, facts: { calc: [[E(a, '+', b), 0]] }
          });
        }
        const [t, b] = subOf(d);
        return N(`구슬을 ${b}개 더 샀더니 모두 ${t}개가 되었다. 처음에 있던 구슬은 몇 개인가?`, t - b, {
          unit: '개', explain: `처음에 있던 구슬은 모두 ${t}개에서 더 산 ${b}개를 뺀 것이다. ${say(t, '-', b, t - b)}`, facts: { calc: [[E(t, '-', b), 0]] }
        });
      }, { count: 2, standard: MEAN }),
      H('h-compare', '「더 많다」가 있는 뺄셈 상황', '①61 심45 심18', (d) => {
        // 빨간 구슬 13개. 빨간 구슬은 파란 구슬보다 5개 더 많다 → 파란 구슬은 13 − 5. 「더 많다」만 보고 13 + 5를 하는 아이가 많다.
        const [t, s] = subOf(d);
        return N(`빨간 구슬은 ${t}개이다. 빨간 구슬은 파란 구슬보다 ${s}개 더 많다. 파란 구슬은 몇 개인가?`, t - s, {
          unit: '개', explain: `빨간 구슬이 더 많으므로 파란 구슬은 빨간 구슬보다 ${s}개 더 적다. ${say(t, '-', s, t - s)}`, facts: { calc: [[E(t, '-', s), 0]] }
        });
      }, { standard: MEAN })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
