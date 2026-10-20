// 2학년 1학기 5단원 분류하기 — 기본 문항(분류하여 세어 보기, 분류한 결과 말하기)과 실력 문항.
// 단원 틀과 그림 도구(B.kit.g215)는 2-1-5a.js 에 있다. 대조표는 수집본의 _분석/2-1-5/싣기_대조표.md.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「색깔·모양·크기」는 언제나 좋은 기준이라고 외운다. 그 묶음에 서로 다른 것이 있어야 기준이 된다는 것을 놓친다(모두 구멍이 4개인 단추를 구멍의 수로 가르려 한다).
//  - 「큰 것과 작은 것」은 언제나 분명한 기준이라고 본다. 크기가 조금씩 다른 묶음에서는 어디까지가 큰 것인지 사람마다 다르다는 것을 놓친다.
//  - 눈에 먼저 띄는 성질(색깔)로만 가른다. 이미 색깔별로 모아 놓은 그림에서 구멍의 수를 물어도 색깔 칸의 수를 답한다.
//  - 한 번 분류하여 센 수를 다른 기준의 물음에도 그대로 쓴다. 기준이 바뀌면 갈래와 수가 달라진다는 것을 놓친다.
//  - 한 묶음에 여러 가지가 들어 있으면 그 가운데 하나만 보고 기준을 댄다(원 묶음과 삼각형·사각형 묶음을 「원과 삼각형」으로 나누었다고 본다).
//  - 잘못 분류된 것을 찾고도 어디로 옮길지는 그것의 성질이 아니라 가까운 칸으로 정한다.
//  - 두 가지에 모두 알맞은 것을 셀 때 한 가지만 맞는 것까지 센다.
//
// 싣는 기준: 실력에는 두 가지만 둔다. 2학년 단원이라 수는 적다.
//  ① 그림·상황에 장치가 있어 배운 뜻(분명한 기준, 서로 달라야 기준이 된다, 기준이 바뀌면 결과가 달라진다)을 정확히 대야 풀리는 문제
//  ② 두 번 넘게 생각해야 풀리는 문제(기준을 알아낸 뒤 틀린 것을 찾아 옮기기, 분류하여 센 뒤 견주어 빼기, 두 가지에 모두 알맞은 것 세기)
//  기본에서 하는 일을 고르기로 바꾼 것은 싣지 않는다. 그림에서 세고 고르는 문항은 대상을 섞어 놓아 정답이 한눈에 드러나지 않게 한다.
//
// 뺀 것과 까닭(심화꼴): 2-1-5a.js 머리의 「뺀 것」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, NAMES, N, M, C, lines } = B.kit;
  const { STD, CIRC, TAGS, zip, deal, mixOf, tj, COLOR, RBY, RBYG, SHAPE, FORMS, AX, varies, countOf, tally, buttons, pieces, cups, shirts, spread, boxes, grid } = B.kit.g215;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const sum = (list) => list.reduce((x, y) => x + y, 0);
  const top = (list) => Math.max.apply(null, list), low = (list) => Math.min.apply(null, list);
  // 서로 다른 세 수(합 12~14): 가장 많은 것·가장 적은 것이 하나씩이다.
  const THREE = [[6, 4, 3], [5, 4, 3], [6, 5, 2], [7, 4, 2], [6, 4, 2], [7, 3, 2], [6, 5, 3], [7, 4, 3]];
  const three = (d) => d.shuffle(d.pick(THREE));
  // 수 카드를 줄지어 놓은 것
  const numCards = (list) => '<span class="mb-cards">' + list.map((v) => '<span class="mb-card" style="font-size:1.05rem;width:2.9em;height:2.2em">' + v + '</span>').join('') + '</span>';

  // ── 분류하여 세어 보기 ───────────────────────────────────────
  B.addTypes('2-1-5', 'count', [
    T('count-two', '두 갈래로 분류하여 세기', '①27·31 심26', (d) => {
      const [x, y] = d.shuffle(RBY), [a, b] = d.shuffle(d.pick([[7, 4], [8, 5], [6, 5], [9, 5], [8, 6], [7, 6], [9, 4]])), colors = deal(d, [[x, a], [y, b]]);
      const list = buttons(colors, zip(a + b, () => d.pick([2, 4])));
      return M('단추를 색깔에 따라 분류하여 세어 보시오.', [{ label: COLOR[x].name, answer: a, unit: '개' }, { label: COLOR[y].name, answer: b, unit: '개' }], {
        figure: spread(list, { per: 5, sum: tally(list, 'color', [x, y]) }), explain: `하나씩 표시하며 세면 ${tally(list, 'color', [x, y])}이다.`, facts: { tallyOf: { list: colors, target: x }, calc: [[String(b), 1]] }
      });
    }),
    // 세 갈래(컵의 손잡이 수), 네 갈래(색종이 조각의 색깔)
    T('count-three', '세 갈래·네 갈래로 분류하여 세기', '①25·28 심25', (d, n) => {
      if (n === 0) {
        const c = d.shuffle(d.pick([[2, 5, 3], [1, 6, 3], [3, 5, 2], [2, 6, 2], [1, 5, 4], [2, 4, 4]])), [x, y] = d.shuffle(RBY), handles = deal(d, [[0, c[0]], [1, c[1]], [2, c[2]]]);
        const list = cups(zip(handles.length, () => (d.bool() ? x : y)), handles);
        return M('컵을 손잡이의 수에 따라 분류하여 세어 보시오.', [0, 1, 2].map((h) => ({ label: AX.handles.word(h), answer: c[h], unit: '개' })), {
          figure: spread(list, { per: 5, sum: tally(list, 'handles', [0, 1, 2]) }), explain: `하나씩 표시하며 세면 ${tally(list, 'handles', [0, 1, 2])}이다.`,
          facts: { tallyOf: { list: handles, target: 0 }, calc: [[String(c[1]), 1], [String(c[2]), 2]] }
        });
      }
      const c = d.shuffle(d.pick([[3, 5, 2, 4], [4, 5, 2, 3], [2, 6, 3, 3], [5, 4, 3, 2], [4, 4, 3, 3]])), colors = deal(d, RBYG.map((k, i) => [k, c[i]]));
      const list = pieces(colors, zip(colors.length, () => d.pick(FORMS)));
      return M('색종이 조각을 색깔에 따라 분류하여 세어 보시오.', RBYG.map((k, i) => ({ label: COLOR[k].name, answer: c[i], unit: '개' })), {
        figure: spread(list, { per: 5, sum: tally(list, 'color', RBYG) }), explain: `하나씩 표시하며 세면 ${tally(list, 'color', RBYG)}이다.`,
        facts: { tallyOf: { list: colors, target: 'red' }, calc: [[String(c[1]), 1], [String(c[2]), 2], [String(c[3]), 3]] }
      });
    }, { count: 2 }),
    T('count-words', '낱말로 적은 자료를 분류하여 세기', '①29 심28', (d) => {
      const kinds = d.shuffle(['사과', '포도', '딸기', '수박', '참외']).slice(0, 3), c = d.shuffle(d.pick([[6, 5, 4], [7, 5, 3], [6, 5, 3], [7, 4, 3], [5, 5, 4], [6, 4, 4]])), list = deal(d, kinds.map((k, i) => [k, c[i]]));
      return M('학생들이 좋아하는 과일을 한 가지씩 적은 것이다. 과일의 종류에 따라 분류하여 세어 보시오.', kinds.map((k, i) => ({ label: k, answer: c[i], unit: '명' })), {
        figure: grid(list), explain: `${kinds.map((k, i) => `${k} ${c[i]}명`).join(', ')}이다. 센 것에 표시하며 세면 빠뜨리지 않는다.`,
        facts: { tallyOf: { list, target: kinds[0] }, calc: [[String(c[1]), 1], [String(c[2]), 2]], unseen: [c[1], c[2]] }
      });
    }),
    // 틀린 보기: 두 수의 차례를 바꾼 것, 하나를 다른 갈래로 센 것, 하나를 빠뜨린 것
    T('count-pair', '센 수를 바르게 짝 지은 것', '①32', (d) => {
      const [a, b] = d.shuffle(d.pick([[8, 5], [9, 6], [8, 6], [9, 5], [7, 6], [8, 7]])), list = buttons(zip(a + b, () => d.pick(RBY)), Array(a + b).fill(4), deal(d, [['round', a], ['square', b]]));
      const key = (p) => p.join(), wrongs = d.shuffle([[b, a], [a - 1, b + 1], [a + 1, b - 1], [a - 1, b], [a, b - 1]]).filter((p, i, all) => key(p) !== key([a, b]) && all.findIndex((q) => key(q) === key(p)) === i).slice(0, 3);
      const rows = d.shuffle([[a, b]].concat(wrongs)), right = (p) => p[0] === countOf(list, 'shape', 'round') && p[1] === countOf(list, 'shape', 'square');
      return C('단추를 모양에 따라 분류하여 세었다. 원 모양 단추의 수와 사각형 모양 단추의 수를 차례로 쓴 것은?', rows.map((p) => `${p[0]}개, ${p[1]}개`), rows.findIndex(right), {
        figure: spread(list, { per: 5, sum: tally(list, 'shape', ['round', 'square']) }), explain: `하나씩 표시하며 세면 ${tally(list, 'shape', ['round', 'square'])}이다.`, facts: { truth: rows.map(right), want: true }
      });
    }),
    T('count-total', '분류하여 센 수로 전체 수 구하기', '①33', (d) => {
      const [a, b] = d.shuffle(d.pick([[7, 8], [6, 9], [5, 8], [7, 9], [6, 7], [4, 9], [5, 7]]));
      return N(`단추를 구멍의 수에 따라 분류하였더니 구멍이 2개인 단추가 ${a}개, 구멍이 4개인 단추가 ${b}개였다. 단추는 모두 몇 개인가?`, a + b, {
        unit: '개', explain: `${a} + ${b} = ${a + b}이므로 단추는 모두 ${a + b}개이다.`, facts: { calc: [[`${a}+${b}`, 0]] }
      });
    }),
    // 분류할 대상이 수: 자리 수(몇십·몇백처럼 0이 낀 수를 섞는다), 20까지의 홀수와 짝수
    T('count-numbers', '수 카드를 분류하여 세기', '심13·14', (d, n) => {
      if (n === 0) {
        const a = d.int(2, 3), b = d.int(4, 5), c = 12 - a - b, fresh = (l) => new Set(l).size === l.length;
        const ones = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, a), twos = d.until(() => [d.int(1, 9) * 10].concat(zip(b - 1, () => d.int(11, 99))), fresh);
        const threes = d.until(() => [d.int(1, 9) * 100, d.int(1, 9) * 100 + d.int(1, 9)].concat(zip(c - 2, () => d.int(111, 999))), fresh), list = d.shuffle(ones.concat(twos, threes));
        return M('수 카드를 한 자리 수, 두 자리 수, 세 자리 수로 분류하여 세어 보시오.', [['한 자리 수', a], ['두 자리 수', b], ['세 자리 수', c]].map(([label, answer]) => ({ label, answer, unit: '장' })), {
          figure: numCards(list), explain: `숫자가 1개이면 한 자리 수, 2개이면 두 자리 수, 3개이면 세 자리 수이다. 한 자리 수 ${a}장, 두 자리 수 ${b}장, 세 자리 수 ${c}장이다.`,
          facts: { tallyOf: { list: list.map((v) => String(v).length), target: 1 }, calc: [[String(b), 1], [String(c), 2]], unseen: [b, c] }
        });
      }
      const a = d.pick([3, 4, 6, 7]), list = d.shuffle(d.shuffle([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]).slice(0, a).concat(d.shuffle([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).slice(0, 10 - a)));
      return M('수 카드를 홀수와 짝수로 분류하여 세어 보시오.', [{ label: '홀수', answer: a, unit: '장' }, { label: '짝수', answer: 10 - a, unit: '장' }], {
        figure: numCards(list), explain: `홀수는 ${list.filter((v) => v % 2 === 1).join(', ')}의 ${a}장이고, 짝수는 ${list.filter((v) => v % 2 === 0).join(', ')}의 ${10 - a}장이다.`,
        facts: { tallyOf: { list: list.map((v) => v % 2), target: 1 }, calc: [[String(10 - a), 1]], unseen: [10 - a] }
      });
    }, { count: 2 }),
    // 10원·100원·500원짜리를 모아 「동전」 한 갈래로 센다.
    T('count-money', '돈을 동전과 지폐로 분류하여 세기', '심27', (d) => {
      const [a, b, c, e] = d.pick([[3, 4, 2, 3], [2, 4, 3, 4], [4, 3, 2, 4], [3, 3, 2, 5], [2, 5, 2, 3], [4, 4, 2, 3]]), coins = a + b + c;
      const list = d.shuffle(Array(a).fill(10).concat(Array(b).fill(100), Array(c).fill(500)).map((won) => ({ k: 'coin', won })).concat(zip(e, () => ({ k: 'bill', won: 1000 }))));
      return M('돈을 동전과 지폐로 분류하여 세어 보시오.', [{ label: '동전', answer: coins, unit: '개' }, { label: '지폐', answer: e, unit: '장' }], {
        figure: spread(list, { per: 5, head: '돈', sum: `동전 ${coins}개, 지폐 ${e}장` }), explain: `10원, 100원, 500원짜리는 모두 동전이다. 동전은 ${coins}개, 지폐는 ${e}장이다.`,
        facts: { tallyOf: { list: list.map((t) => t.k), target: 'coin' }, calc: [[String(e), 1]] }
      });
    })
  ]);

  // ── 분류한 결과 말하기 ───────────────────────────────────────
  B.addTypes('2-1-5', 'tell', [
    // 가장 많은 색깔(색종이 조각), 가장 적은 구멍 수(단추)
    T('tell-most', '가장 많은 것, 가장 적은 것', '①34·46 심29', (d, n) => {
      const c = three(d);
      if (n === 0) {
        const cs = d.shuffle(RBY), colors = deal(d, cs.map((k, i) => [k, c[i]])), list = pieces(colors, zip(colors.length, () => d.pick(FORMS)));
        return C('색종이 조각을 색깔에 따라 분류하였을 때, 가장 많은 색깔은?', cs.map((k) => COLOR[k].name), c.indexOf(top(c)), {
          figure: spread(list, { per: 5, sum: tally(list, 'color', cs) }), explain: `${tally(list, 'color', cs)}이다. ${josa(COLOR[cs[c.indexOf(top(c))]].name, '이/가')} 가장 많다.`, facts: { choose: { exprs: c.map(String), rule: 'max' } }
        });
      }
      const [x, y] = d.shuffle(RBY), holes = deal(d, [2, 3, 4].map((h, i) => [h, c[i]])), list = buttons(zip(holes.length, () => (d.bool() ? x : y)), holes);
      return C('단추를 구멍의 수에 따라 분류하였을 때, 가장 적은 것은?', [2, 3, 4].map((h) => AX.holes.thing(h)), c.indexOf(low(c)), {
        figure: spread(list, { per: 5, sum: tally(list, 'holes', [2, 3, 4]) }), explain: `${tally(list, 'holes', [2, 3, 4])}이다. ${AX.holes.thing([2, 3, 4][c.indexOf(low(c))])}가 가장 적다.`, facts: { choose: { exprs: c.map(String), rule: 'min' } }
      });
    }, { count: 2 }),
    T('tell-most-n', '가장 많은 것의 수', '①35', (d) => {
      const c = three(d), cs = d.shuffle(RBY), colors = deal(d, cs.map((k, i) => [k, c[i]])), list = cups(colors, zip(colors.length, () => d.pick([0, 1]))), best = cs[c.indexOf(top(c))];
      return N('컵을 색깔에 따라 분류하였을 때, 가장 많은 색깔의 컵은 몇 개인가?', top(c), {
        unit: '개', figure: spread(list, { per: 5, sum: tally(list, 'color', cs) }), explain: `${tally(list, 'color', cs)}이다. 가장 많은 색깔은 ${COLOR[best].name}이고 ${top(c)}개이다.`, facts: { calc: [[String(countOf(list, 'color', best)), 0]] }
      });
    }),
    T('tell-order', '많은 것부터 차례로', '①36 심31', (d) => {
      const c = d.shuffle(d.pick([[5, 4, 3], [6, 4, 2], [7, 3, 2]])), cs = d.shuffle(RBY), colors = deal(d, cs.map((k, i) => [k, c[i]])), list = shirts(colors, zip(12, () => d.pick(['long', 'short'])));
      const right = [0, 1, 2].sort((p, q) => c[q] - c[p]), rest = d.shuffle([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].filter((o) => o.join() !== right.join())).slice(0, 3), orders = d.shuffle([right].concat(rest));
      return C('옷을 색깔에 따라 분류하였다. 수가 많은 색깔부터 차례로 쓴 것은?', orders.map((o) => o.map((i) => COLOR[cs[i]].name).join(', ')), orders.indexOf(right), {
        figure: spread(list, { per: 5, sum: tally(list, 'color', cs) }), explain: `${tally(list, 'color', cs)}이다. 수가 많은 것부터 쓰면 ${right.map((i) => COLOR[cs[i]].name).join(', ')}이다.`,
        facts: { choose: { exprs: c.map(String), rule: 'descending', orders } }
      });
    }),
    T('tell-second', '두 번째로 많은 것', '①36', (d) => {
      const kinds = d.shuffle(['축구', '야구', '농구', '피구', '수영']).slice(0, 4), c = d.shuffle(d.pick([[6, 5, 4, 3], [7, 5, 4, 2], [6, 5, 3, 2], [7, 4, 3, 2], [6, 4, 3, 2], [7, 5, 3, 2]])), list = deal(d, kinds.map((k, i) => [k, c[i]]));
      const sorted = c.slice().sort((p, q) => q - p), second = c.indexOf(sorted[1]);
      return C('학생들이 좋아하는 운동을 한 가지씩 적은 것이다. 두 번째로 많은 학생이 좋아하는 운동은?', kinds, second, {
        figure: grid(list), explain: `${kinds.map((k, i) => `${k} ${c[i]}명`).join(', ')}이다. 가장 많은 것은 ${kinds[c.indexOf(sorted[0])]}, 두 번째로 많은 것은 ${kinds[second]}이다.`, facts: { rank: { values: c, nth: 2 } }
      });
    }),
    // 세 가지 색 가운데 두 가지만 묻는다(묻지 않는 갈래가 섞여 있다).
    T('tell-diff', '두 갈래의 차', '①37 심32', (d) => {
      const c = three(d), cs = d.shuffle(RBY), colors = deal(d, cs.map((k, i) => [k, c[i]])), list = buttons(colors, zip(colors.length, () => d.pick([2, 4])));
      const [i, j] = d.pick([[0, 1], [0, 2], [1, 2]]), more = c[i] > c[j] ? i : j, less = more === i ? j : i;
      return N(`${COLOR[cs[more]].name} 단추는 ${COLOR[cs[less]].name} 단추보다 몇 개 더 많은가?`, c[more] - c[less], {
        unit: '개', figure: spread(list, { per: 5, sum: tally(list, 'color', cs) }),
        explain: `${COLOR[cs[more]].name} 단추는 ${c[more]}개, ${COLOR[cs[less]].name} 단추는 ${c[less]}개이다. ${c[more]} − ${c[less]} = ${c[more] - c[less]}이므로 ${c[more] - c[less]}개 더 많다.`,
        facts: { calc: [[`${countOf(list, 'color', cs[more])}-${countOf(list, 'color', cs[less])}`, 0]] }
      });
    }),
    // 틀린 보기: 많은 쪽을 더 준비한다고 본 것, 차가 아니라 적은 쪽의 수·많은 쪽의 수를 그대로 쓴 것
    T('tell-equal', '수가 같아지려면', '①39', (d) => {
      const [a, b] = d.pick([[7, 4], [7, 5], [8, 5], [6, 4], [8, 3], [9, 4]]), [x, y] = d.shuffle(RBY), colors = deal(d, [[x, a], [y, b]]), list = cups(colors, zip(a + b, () => d.pick([0, 1]))), shown = d.shuffle([x, y]);
      const rows = d.shuffle([[y, a - b], [x, a - b], [y, b], [x, a]]), right = (r) => r[0] === y && countOf(list, 'color', y) + r[1] === countOf(list, 'color', x);
      return C(`${COLOR[shown[0]].name} 컵과 ${COLOR[shown[1]].name} 컵의 수가 같아지려면 어떤 컵이 몇 개 더 있어야 하는가?`, rows.map((r) => `${COLOR[r[0]].name} 컵 ${r[1]}개`), rows.findIndex(right), {
        figure: spread(list, { per: 5, sum: tally(list, 'color', shown) }),
        explain: `${COLOR[x].name} 컵은 ${a}개, ${COLOR[y].name} 컵은 ${b}개이다. ${a} − ${b} = ${a - b}이므로 ${COLOR[y].name} 컵이 ${a - b}개 더 있어야 한다.`, facts: { truth: rows.map(right), want: true }
      });
    }),
    T('tell-who', '갈래가 사람과 짝 지어진 것', '①40', (d) => {
      const [a, b] = d.shuffle(d.pick([[9, 7], [10, 6], [8, 6], [9, 5], [9, 6], [8, 7]])), [x, y] = d.shuffle(RBY), names = d.shuffle(NAMES).slice(0, 2), colors = deal(d, [[x, a], [y, b]]);
      const list = colors.map((color) => ({ k: 'card', color })), told = `${COLOR[x].name} 카드 ${a}장, ${COLOR[y].name} 카드 ${b}장`;
      return C(`카드 뒤집기 놀이를 하였다. ${COLOR[x].name} 카드는 ${names[0]}의 것이고, ${COLOR[y].name} 카드는 ${names[1]}의 것이다. 카드가 더 많은 사람은?`, [names[0], '두 사람이 같다', names[1]], a > b ? 0 : 2, {
        figure: spread(list, { per: 5, head: '카드 ' + (a + b) + '장', sum: told }), explain: `${told}이다. ${COLOR[a > b ? x : y].name} 카드가 더 많으므로 ${names[a > b ? 0 : 1]}의 카드가 더 많다.`,
        facts: { choose: { exprs: [String(countOf(list, 'color', x)), String(countOf(list, 'color', y))], rule: 'compare' } }
      });
    }),
    T('tell-prepare', '많이 준비할 것 정하기', '①41 심33', (d) => {
      const kinds = d.shuffle(['사과', '포도', '딸기', '수박', '당근']).slice(0, 3), c = three(d), list = deal(d, kinds.map((k, i) => [k, c[i]])), best = kinds[c.indexOf(top(c))];
      return C('가게에서 오늘 팔린 주스를 하나씩 적은 것이다. 내일 가장 많이 준비해야 할 주스는?', kinds.map((k) => k + ' 주스'), c.indexOf(top(c)), {
        figure: grid(list), explain: `${kinds.map((k, i) => `${k} 주스 ${c[i]}개`).join(', ')}가 팔렸다. 가장 많이 팔린 ${best} 주스를 가장 많이 준비한다.`, facts: { rank: { values: c, nth: 1 } }
      });
    }),
    T('tell-even', '고르게 하려면 더 준비할 것', '①42', (d) => {
      const cs = d.shuffle(RBY), c = d.shuffle(d.pick([[5, 2, 5], [6, 3, 5], [5, 2, 4], [6, 2, 6], [4, 1, 4], [6, 3, 6], [5, 3, 6]])), least = COLOR[cs[c.indexOf(low(c))]].name;
      return C(`풍선을 색깔에 따라 분류하여 세었더니 ${cs.map((k, i) => `${COLOR[k].name} ${c[i]}개`).join(', ')}였다. 색깔별 수를 비슷하게 맞추려면 어떤 색깔 풍선을 더 준비해야 하는가?`, cs.map((k) => COLOR[k].name), c.indexOf(low(c)), {
        explain: `${josa(least, '이/가')} ${low(c)}개로 가장 적다. 가장 적은 ${least} 풍선을 더 준비한다.`, facts: { choose: { exprs: c.map(String), rule: 'min' } }
      });
    }),
    // 색깔로 분류하여 센 결과로는 색깔별 수·가장 많은 색깔·전체 수를 알 수 있다. 구멍의 수는 다시 분류해야 안다.
    T('tell-know', '센 결과만 보고 알 수 있는 것', '①47', (d) => {
      const cs = d.shuffle(RBY), c = three(d), holes = d.pick([2, 4]);
      const rows = d.shuffle([['가장 많은 색깔', true], [`${COLOR[d.pick(cs)].name} 단추의 수`, true], ['단추 전체의 수', true], [`구멍이 ${holes}개인 단추의 수`, false]]);
      return C(`단추를 색깔에 따라 분류하여 세었더니 ${cs.map((k, i) => `${COLOR[k].name} ${c[i]}개`).join(', ')}였다. 이 결과만 보고 알 수 없는 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: '색깔에 따라 분류하여 세면 색깔별 수, 가장 많은 색깔, 전체 수를 알 수 있다. 구멍의 수는 구멍의 수에 따라 다시 분류해야 알 수 있다.', facts: { truth: rows.map((r) => r[1]), want: false }
      });
    })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addGroup('2-1-5', {
    id: 'hard', title: '단원 종합', standard: STD, types: [
      // ── ① 그림·상황의 장치 ──
      // 장치: 세 묶음 모두 「큰 구슬과 작은 구슬」이라는 같은 말을 기준으로 삼는다. 그림을 보아야 그 말이 분명한 기준인지 가릴 수 있다.
      // 보기: 크기가 조금씩 다른 묶음(크기가 서로 다르기만 하면 된다고 보는 아이), 크기가 모두 같은 묶음(색깔이 달라 분류할 수 있다고 보거나 크기를 보지 않은 아이)
      // 「누가 분류해도 결과가 같은 묶음」이라고 묻지 않는다: 크기가 모두 같은 묶음도 「누구나 못 나눈다」는 뜻으로 읽힐 수 있다.
      H('hard-clear', '그 묶음에서 분명한 기준인가', '1·2·5', (d) => {
        const kinds = d.shuffle(['two', 'many', 'same']), radii = { two: () => deal(d, [[13, 3], [6.5, 3]]), many: () => d.until(() => d.shuffle([6, 7.5, 9, 10.5, 12, 13.5]), (l) => [l.slice(0, 3), l.slice(3)].every((row) => row.some((r) => r < 10) && row.some((r) => r > 10))), same: () => Array(6).fill(10) };
        const said = { two: '큰 구슬 3개와 작은 구슬 3개', many: '크기가 조금씩 다른 구슬 6개', same: '크기가 같은 구슬 6개' }, at = (k) => TAGS[kinds.indexOf(k)];
        const groups = kinds.map((k, i) => ({ cap: TAGS[i], items: radii[k]().map((r) => ({ k: 'ball', color: d.pick(RBY), r })), label: `${TAGS[i]} 묶음: ${said[k]}` }));
        return C('구슬을 「큰 구슬」과 「작은 구슬」로 분류하려고 한다. 이것이 분명한 분류 기준이 되는 묶음은?', TAGS, kinds.indexOf('two'), {
          figure: boxes(groups, { per: 3, cw: 34 }),
          explain: `${at('two')}는 구슬의 크기가 두 가지뿐이라 누가 분류해도 결과가 같다. ${at('many')}는 크기가 조금씩 달라 어디까지가 큰 구슬인지 사람마다 다르다. ${at('same')}는 크기가 모두 같아 나눌 수 없다.`,
          facts: { truth: groups.map((g) => new Set(g.items.map((t) => t.r)).size === 2), want: true }
        });
      }),
      // 장치: 보기 셋이 모두 흔히 쓰는 분명한 기준이다. 「예쁜 것」 같은 뻔한 오답이 없어, 서로 다른 것이 있어야 기준이 된다는 것으로 풀어야 한다.
      // 색깔과 모양은 한눈에 갈리지만 구멍의 수는 단추마다 들여다보아야 모두 같다는 것을 안다(앞의 문제들에서 구멍의 수를 기준으로 써 온 터라 기준이 된다고 여기기 쉽다).
      // 보기: 「색깔」「모양」(색깔·모양·구멍의 수는 언제나 좋은 기준이라고 외운 아이는 가릴 수 없어 아무것이나 고른다), 답은 모두 같아서 나눌 수 없는 「구멍의 수」다.
      H('hard-useless', '이 묶음에서는 기준이 될 수 없는 것', '7', (d) => {
        const axes = d.shuffle(['color', 'shape', 'holes']), h = d.pick([2, 3, 4]), a = d.int(3, 5);
        const list = buttons(mixOf(d, 8, d.shuffle(RBY).slice(0, d.int(2, 3))), Array(8).fill(h), deal(d, [['round', a], ['square', 8 - a]]));
        return C('이 단추를 분류하려고 한다. 분류 기준이 될 수 없는 것은?', axes.map((ax) => AX[ax].name), axes.indexOf('holes'), {
          figure: spread(list), explain: `구멍은 모두 ${h}개이다. 모두 같으면 나눌 수 없어 구멍의 수는 분류 기준이 될 수 없다. 색깔과 모양은 서로 다른 것이 있다.`,
          facts: { truth: axes.map((ax) => varies(list, ax)), want: false }
        });
      }),
      // 장치: 한 묶음에 삼각형과 사각형이 함께 들어 있다. 두 묶음을 모두 덮는 기준을 대야 한다.
      // 보기: 「원과 삼각형」「원과 사각형」(섞인 묶음에서 한 가지 도형만 본 아이), 「~이 3개인 도형과 4개인 도형」(섞인 묶음 안의 다른 점을 기준으로 본 아이), 「큰 도형과 작은 도형」(크기가 묶음마다 섞여 있는 것을 보지 않은 아이)
      H('hard-cover', '두 묶음을 모두 덮는 분류 기준', '18', (d) => {
        const part = d.pick(['변', '꼭짓점']), round = d.int(0, 1), tint = () => d.pick(RBY);
        const circles = d.shuffle([true, true, false, false]).map((big) => ({ k: 'piece', color: tint(), shape: 'circle', big }));
        const sided = d.shuffle([['triangle', true], ['triangle', false], ['square', true], ['square', false]]).map(([shape, big]) => ({ k: 'piece', color: tint(), shape, big }));
        const groups = round === 0 ? [circles, sided] : [sided, circles];
        const rows = d.shuffle([[`${part}이 없는 도형과 ${part}이 있는 도형`, true], ['원과 삼각형', false], ['원과 사각형', false], [`${part}이 3개인 도형과 ${part}이 4개인 도형`, false], ['큰 도형과 작은 도형', false]]);
        return C('도형을 두 묶음으로 분류하였다. 분류 기준은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: boxes(groups.map((items, g) => ({ cap: TAGS[g], items }))),
          explain: `${TAGS[round]} 묶음의 원은 ${part}이 없고, ${TAGS[1 - round]} 묶음의 삼각형과 사각형은 ${part}이 있다. 삼각형과 사각형이 한 묶음에 있으므로 ${part}의 수로 나눈 것이 아니다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }),
      // 장치: 그림이 이미 색깔별로 나뉘어 있다. 물음은 구멍의 수라는 다른 기준이라, 칸을 넘나들며 다시 분류해야 한다.
      H('hard-hidden', '이미 분류된 그림에서 다른 기준으로 세기', '30', (d) => {
        const cs = d.shuffle(RBY), target = d.pick([2, 4]), k = d.shuffle(d.pick([[1, 2, 3], [2, 2, 3], [1, 3, 3], [1, 2, 2], [1, 1, 3]]));
        const groups = cs.map((c, i) => ({ cap: COLOR[c].name, items: buttons(Array(4).fill(c), deal(d, [[target, k[i]], [6 - target, 4 - k[i]]])) })), all = groups.reduce((list, g) => list.concat(g.items), []);
        return N(`단추를 색깔에 따라 분류해 놓았다. 구멍이 ${target}개인 단추는 모두 몇 개인가?`, sum(k), {
          unit: '개', figure: boxes(groups),
          explain: `구멍의 수에 따라 다시 분류한다. 구멍이 ${target}개인 단추는 ${groups.map((g, i) => `${g.cap} 칸에 ${k[i]}개`).join(', ')}이므로 모두 ${sum(k)}개이다.`, facts: { count: all.map((t) => t.holes === target) }
        });
      }),
      // ── ② 두 번 넘게 생각하기 ──
      // 세 사람의 결과는 7개·5개, 8개·4개, 9개·3개로 아슬아슬하게 다르다. 묻는 기준으로 직접 분류하여 세어야 가릴 수 있다(한 묶음도 기준이 바뀌면 수가 달라진다).
      // 보기(사람): 다른 기준으로 센 두 사람. 눈대중으로는 가릴 수 없고, 가장 먼저 눈에 띄는 색깔로 센 사람을 고르기 쉽다.
      H('hard-who', '기준이 다르면 결과도 다르다', '23', (d) => {
        const [x, y] = d.shuffle(RBY), names = d.shuffle(NAMES).slice(0, 3), big = d.shuffle([7, 8, 9]), axes = d.shuffle(['color', 'holes', 'shape']), asked = d.pick(axes);
        const list = buttons(deal(d, [[x, big[0]], [y, 12 - big[0]]]), deal(d, [[4, big[1]], [2, 12 - big[1]]]), deal(d, [['round', big[2]], ['square', 12 - big[2]]]));
        const order = { color: [x, y], holes: [4, 2], shape: ['round', 'square'] }, pairOf = (ax) => order[ax].map((v) => countOf(list, ax, v)), told = (ax) => pairOf(ax).map((v) => v + '개').join(', ');
        return C(`단추 12개를 세 사람이 서로 다른 기준으로 분류하여 세었다. ${AX[asked].name}에 따라 분류한 사람은?`, names, axes.indexOf(asked), {
          figure: spread(list, { per: 5 }) + lines(axes.map((ax, i) => `${names[i]}: ${told(ax)}`)),
          explain: `${tally(list, asked, order[asked])}이다. ${told(asked)}로 센 사람은 ${names[axes.indexOf(asked)]}이다.`, facts: { truth: axes.map((ax) => told(ax) === told(asked)), want: true }
        });
      }),
      // 기준을 알려 주지 않는다: 묶음마다 모인 것을 보고 기준을 알아낸 뒤, 다른 것 하나를 찾아 그것의 성질에 맞는 묶음으로 옮긴다.
      // 보기: 잘못 놓인 것을 다른 틀린 묶음으로 옮긴 것, 제자리에 있는 것을 옮긴 것 둘
      H('hard-move', '잘못 분류된 것을 찾아 옮기기', '20, 기본 ①23', (d) => {
        const axis = d.pick(['shape', 'color']), other = axis === 'shape' ? 'color' : 'shape', vals = { shape: d.shuffle(FORMS), color: d.shuffle(RBY) }, tags = CIRC.slice(0, 9);
        const from = d.int(0, 2), to = d.pick([0, 1, 2].filter((g) => g !== from)), third = 3 - from - to, sizes = [0, 1, 2].map((g) => (g === from ? 2 : g === to ? 4 : 3)), odd = d.int(0, 3);
        let no = 0;
        const groups = sizes.map((size, g) => {
          const mine = zip(size, (i) => vals[axis][g === to && i === odd ? from : g]), rest = mixOf(d, size, vals[other]);
          const items = axis === 'shape' ? pieces(rest, mine) : pieces(mine, rest), mark = tags.slice(no, no + size); no += size;
          return { cap: TAGS[g], items, tags: mark };
        });
        const bad = groups[to].tags[odd], stay = d.pick(groups[to].tags.filter((t) => t !== bad)), far = d.pick(groups[third].tags);
        const rows = d.shuffle([[bad, from], [bad, third], [stay, from], [far, to]]), kindOf = (g) => vals[axis][g], itemOf = (tag) => { const g = groups.find((x) => x.tags.includes(tag)); return { box: groups.indexOf(g), value: AX[axis].of(g.items[g.tags.indexOf(tag)]) }; };
        const right = (r) => itemOf(r[0]).value !== kindOf(itemOf(r[0]).box) && itemOf(r[0]).value === kindOf(r[1]);
        return C('색종이 조각을 세 묶음으로 분류하였다. 잘못 분류된 것을 바르게 옮긴 것은?', rows.map((r) => `${tj(r[0], '을/를')} ${TAGS[r[1]]} 묶음으로`), rows.findIndex(right), {
          figure: boxes(groups),
          explain: `${[0, 1, 2].map((g) => `${TAGS[g]}는 ${AX[axis].word(kindOf(g))}`).join(', ')}끼리 모은 것이다. ${tj(bad, '은/는')} ${AX[axis].thing(kindOf(from), '조각')}이므로 ${TAGS[from]} 묶음으로 옮긴다.`,
          facts: { truth: rows.map(right), want: true }
        });
      }),
      // 네 갈래로 분류하여 센 뒤 가장 많은 것과 가장 적은 것을 골라 뺀다.
      H('hard-gap', '가장 많은 것과 가장 적은 것의 차', '기본 ①38', (d) => {
        const c = d.shuffle(d.pick([[6, 4, 3, 1], [6, 5, 3, 2], [7, 4, 3, 2], [5, 4, 3, 2], [6, 4, 3, 2], [7, 4, 2, 1], [6, 5, 2, 1]])), colors = deal(d, RBYG.map((k, i) => [k, c[i]])), list = pieces(colors, zip(colors.length, () => d.pick(FORMS)));
        const most = RBYG[c.indexOf(top(c))], least = RBYG[c.indexOf(low(c))];
        return N('색종이 조각을 색깔에 따라 분류하였을 때, 가장 많은 색깔은 가장 적은 색깔보다 몇 개 더 많은가?', top(c) - low(c), {
          unit: '개', figure: spread(list, { per: 5, sum: tally(list, 'color', RBYG) }),
          explain: `${tally(list, 'color', RBYG)}이다. 가장 많은 ${COLOR[most].name}은 가장 적은 ${COLOR[least].name}보다 ${top(c)} − ${low(c)} = ${top(c) - low(c)}(개) 더 많다.`,
          facts: { calc: [[`${countOf(list, 'color', most)}-${countOf(list, 'color', least)}`, 0]] }
        });
      }),
      // 색깔만 맞는 것, 구멍의 수만 맞는 것이 섞여 있다. 답은 그 색깔 단추의 수와도, 그 구멍 수인 단추의 수와도 다르다.
      H('hard-both', '두 가지에 모두 알맞은 것의 수', '37, 기본 ①45', (d) => {
        const cs = d.shuffle(RBY), th = d.pick([2, 4]), joint = d.pick([[[2, 3], [3, 2], [2, 2]], [[3, 2], [2, 2], [1, 3]], [[2, 2], [3, 1], [2, 3]], [[3, 3], [2, 2], [2, 1]], [[2, 3], [2, 1], [3, 2]], [[4, 2], [1, 3], [2, 2]]]);
        const list = d.shuffle(cs.reduce((all, c, i) => all.concat(buttons(Array(joint[i][0] + joint[i][1]).fill(c), Array(joint[i][0]).fill(th).concat(Array(joint[i][1]).fill(6 - th)))), []));
        const hit = list.map((t) => t.color === cs[0] && t.holes === th), reds = countOf(list, 'color', cs[0]);
        return N(`${COLOR[cs[0]].name}이면서 구멍이 ${th}개인 단추는 몇 개인가?`, joint[0][0], {
          unit: '개', figure: spread(list, { per: 5 }), explain: `${COLOR[cs[0]].name} 단추는 ${reds}개이다. 이 가운데 구멍이 ${th}개인 단추를 세면 ${joint[0][0]}개이다.`, facts: { count: hit }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
