// 2학년 2학기 5단원 표와 그래프 — 표와 그래프의 내용 알기, 표와 그래프의 편리한 점의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴_1의 「마. 표와 그래프의 내용 알기」「바. 표와 그래프의 편리한 점」, 심화꼴 34꼴)을 꼴마다 따져서 실었다.
// 그림 도구와 조사한 것의 틀은 2-2-5a.js 에 있다(B.kit.g225).
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그렇게 아는 아이가 고를 보기(적을 답)가 생기도록 문제를 냈다.
//   ① 「5명보다 많은」에 꼭 5명인 것도 넣는다.
//   ② 그래프는 언제나 가로에 이름, 세로에 수가 있다고 여긴다. 가로에 수를 나타낸 그래프에서 「3명」을 찾으라고 하면 이름에 3이 든 「3반」을 고른다.
//   ③ 표시(○, ×)가 많으면 언제나 「더 많이 한 것」이라고 여긴다. 틀린 수를 나타낸 그래프에서 줄이 가장 긴 학생을 가장 잘한 학생으로 고른다.
//   ④ 가로에 적힌 수(주사위 눈)와 그 위에 그린 ○의 수(나온 횟수)를 가리지 않는다. 「4보다 큰 눈」을 물으면 ○가 4개보다 많은 줄을 찾거나 5 + 6을 한다.
//   ⑤ 조사한 학생 수와 조사한 것의 가짓수를 가리지 않는다. 「모두 몇 명」에 가로의 칸 수를 답한다.
//   ⑥ 표와 그래프로 나타내면 「누가 무엇을 골랐는지」가 사라진다는 것을 모른다.
// 그다음에 두 번 넘게 생각해야 하는 문제를 실었다(합계에서 빼고 똑같이 가르기, 조건으로 빈칸을 구해 모두 더하기, 표에 없는 수를 만들어 빼기,
// 빈 줄을 구한 뒤 비교하기, 표와 그래프를 오가며 채우기, 두 번 읽어야 참인지 알 수 있는 말).
// 그래프에서 고르는 실력 문항은 가장 높은 줄이 곧 답이 되지 않게 했다.
//
// 뺀 것과 까닭은 2-2-5a.js 의 머리와 싣기_대조표.md 에 적었다.
// 묻는 말: 수나 값을 물으면 「~은?/~는?」, 양을 물으면 「몇 ~인가?」. 풀이는 「~이다.」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, N, M, C } = B.kit;
  const { sum, top, low, range, distinct, KIDS, pick, books, WEATHER, leadTab, leadGr, tab, nums, dataOf, countIn, setChoices, cardsFig, graph, graphOf } = B.kit.g225;
  const TAB = '2수04-02', GRAPH = '2수04-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  // 네 가지를 늘어놓은 차례 넷: 바른 차례, 거꾸로 쓴 것, 표에 놓인 차례, 가운데 둘을 바꾼 것. 넷이 서로 다르게 되는 수만 쓴다.
  const orderable = (x) => !['0123', '3210', '0213', '3120'].includes([0, 1, 2, 3].sort((p, q) => x[q] - x[p]).join(''));
  const orderOptions = (d, v) => { const right = [0, 1, 2, 3].sort((p, q) => v[q] - v[p]); return { right, list: d.shuffle([right, right.slice().reverse(), [0, 1, 2, 3], [right[0], right[2], right[1], right[3]]]) }; };
  const withCount = (c, v, list) => list.map((i) => `${c.names[i]} ${v[i]}${c.unit}`).join(', ');

  B.addTypes('2-2-5', 'know', [
    T('know-tab-most', '표에서 가장 많은 것 찾기', '①25 심19', (d) => {
      const c = pick(d, d.pick(['animal', 'snack']), 5), v = nums(d, 5, 2, 8, (x) => { const s = x.slice().sort((p, q) => q - p); return s[0] - s[1] >= 1 && s[0] - s[1] <= 2 && sum(x) <= 25; }), hi = v.indexOf(top(v));
      return C(`${leadTab(c)} 가장 많은 학생이 좋아하는 ${josa(c.kind, '은/는')}?`, c.names, hi, {
        figure: tab(c, v, [['합계', sum(v)]]), explain: `학생 수가 가장 큰 것을 찾는다. ${c.who(c.names[hi])}이 ${v[hi]}명으로 가장 많다. 합계는 고르지 않는다.`, facts: { choose: { exprs: v.map(String), rule: 'max' } }
      });
    }, { standard: TAB }),
    T('know-gr-least', '그래프에서 가장 적은 것 찾기', '①26 심19', (d) => {
      const c = pick(d, d.pick(['fruit', 'color']), 4), v = nums(d, 4, 2, 7, (x) => { const s = x.slice().sort((p, q) => p - q); return s[1] - s[0] === 1; }), lo = v.indexOf(low(v));
      return C(`${leadGr(c)} 가장 적은 학생이 좋아하는 ${josa(c.kind, '은/는')}?`, c.names, lo, {
        figure: graphOf(c, v, { top: 7 }), explain: `○의 수가 가장 적은 것을 찾는다. ${c.who(c.names[lo])}이 ${v[lo]}명으로 가장 적다.`, facts: { choose: { exprs: v.map(String), rule: 'min' } }
      });
    }),
    T('know-flip-most', '가로에 수를 나타낸 그래프에서 가장 많은 것 찾기', '①26 심19', (d) => {
      const c = books(d, 4), v = nums(d, 4, 3, 8, (x) => { const s = x.slice().sort((p, q) => q - p); return s[0] - s[1] === 1; }), hi = v.indexOf(top(v));
      return C(`${c.topic} 조사하여 /를 이용한 그래프로 나타내었다. 책을 가장 많이 읽은 학생은?`, c.names, hi, {
        figure: graphOf(c, v, { mark: 's', flip: true, top: 8 }), explain: `/를 가장 오른쪽 칸까지 그린 줄을 찾는다. ${name(c.names[hi], '이/가')} ${v[hi]}권으로 가장 많이 읽었다.`, facts: { choose: { exprs: v.map(String), rule: 'max' } }
      });
    }),
    T('know-gr-one', '그래프에서 한 가지의 수 읽기', '①34', (d) => {
      const c = pick(d, d.pick(['sport', 'animal']), 4), v = nums(d, 4, 2, 8, distinct), k = d.int(0, 3);
      return N(`${leadGr(c)} ${c.who(c.names[k])}은 몇 명인가?`, v[k], {
        unit: '명', figure: graphOf(c, v, { top: 8 }), explain: `${c.names[k]}에 그린 ○의 수를 센다. ○가 ${v[k]}개이므로 ${v[k]}명이다.`, facts: { calc: [[String(v[k]), 0]] }
      });
    }),
    T('know-range', '가장 많은 것과 가장 적은 것의 차', '①27 심21', (d) => {
      const c = pick(d, d.pick(['sport', 'fruit']), 4), v = nums(d, 4, 2, 9, (x) => distinct(x) && sum(x) <= 24), hi = v.indexOf(top(v)), lo = v.indexOf(low(v));
      return N(`${leadTab(c)} 가장 많은 학생 수와 가장 적은 학생 수의 차는 몇 명인가?`, top(v) - low(v), {
        unit: '명', figure: tab(c, v, [['합계', sum(v)]]), explain: `가장 많은 것은 ${c.names[hi]}의 ${top(v)}명, 가장 적은 것은 ${c.names[lo]}의 ${low(v)}명이다. ${top(v)} - ${low(v)} = ${top(v) - low(v)}`,
        facts: { calc: [[`${top(v)}-${low(v)}`, 0]], tableRank: { values: v, a: 0, b: 3 } }
      });
    }, { standard: TAB }),
    T('know-gap', '그래프에서 두 가지의 수의 차', '①28 심23', (d) => {
      const c = pick(d, d.pick(['snack', 'color']), 4), v = nums(d, 4, 2, 8, distinct), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => v[q] - v[p]);
      return N(`${c.topic} 조사하여 ×를 이용한 그래프로 나타내었다. ${c.who(c.names[i])}은 ${c.who(c.names[j])}보다 몇 명 더 많은가?`, v[i] - v[j], {
        unit: '명', figure: graphOf(c, v, { mark: 'x', top: 8 }), explain: `${withCount(c, v, [i, j])}이다. ${v[i]} - ${v[j]} = ${v[i] - v[j]}`, facts: { calc: [[`${v[i]}-${v[j]}`, 0]] }
      });
    }),
    T('know-top2', '가장 많은 것과 두 번째로 많은 것의 차', '①29 심22', (d) => {
      const c = books(d, 4), v = nums(d, 4, 3, 9, distinct), o = range(4).sort((p, q) => v[q] - v[p]);
      return N(`${leadTab(c)} 책을 가장 많이 읽은 학생은 두 번째로 많이 읽은 학생보다 몇 권 더 읽었는가?`, v[o[0]] - v[o[1]], {
        unit: '권', figure: tab(c, v), explain: `가장 많이 읽은 ${name(c.names[o[0]], '은/는')} ${v[o[0]]}권, 두 번째로 많이 읽은 ${name(c.names[o[1]], '은/는')} ${v[o[1]]}권을 읽었다. ${v[o[0]]} - ${v[o[1]]} = ${v[o[0]] - v[o[1]]}`,
        facts: { calc: [[`${v[o[0]]}-${v[o[1]]}`, 0]], tableRank: { values: v, a: 0, b: 1 } }
      });
    }, { standard: TAB }),
    T('know-second', '두 번째로 많은 것 찾기', '심20', (d) => {
      const c = pick(d, d.pick(['sport', 'animal']), 5), v = nums(d, 5, 1, 8, distinct), o = range(5).sort((p, q) => v[q] - v[p]);
      return C(`${leadGr(c)} 두 번째로 많은 학생이 좋아하는 ${josa(c.kind, '은/는')}?`, c.names, o[1], {
        figure: graphOf(c, v, { top: 8 }), explain: `학생 수가 많은 것부터 차례로 쓰면 ${withCount(c, v, o)}이다.`, facts: { rank: { values: v, nth: 2 } }
      });
    }),
    T('know-sum2', '그래프에서 두 가지의 수의 합', '심24', (d) => {
      const c = WEATHER, v = nums(d, 4, 1, 7, (x) => sum(x) === 14 && distinct(x)), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => p - q), a = c.day[c.names[i]], b = c.day[c.names[j]];
      return N(`2주일 동안의 날씨를 조사하여 나타낸 그래프이다. ${josa(a, '과/와')} ${josa(b, '은/는')} 모두 며칠인가?`, v[i] + v[j], {
        unit: '일', figure: graphOf(c, v, { top: 7 }), explain: `${a} ${v[i]}일, ${b} ${v[j]}일이다. ${v[i]} + ${v[j]} = ${v[i] + v[j]}`, facts: { calc: [[`${v[i]}+${v[j]}`, 0]] }
      });
    }),
    T('know-above', '기준 수보다 많은(적은) 것 모두 찾기', '①30', (d) => {
      const c = pick(d, d.pick(['snack', 'fruit']), 5), more = d.bool(), t = d.pick([4, 5]), hit = (y) => (more ? y > t : y < t);
      const v = nums(d, 5, 2, 8, (x) => !x.includes(t) && [2, 3].includes(x.filter(hit).length) && sum(x) <= 25), picked = setChoices(d, c.names, v.map(hit));
      return C(`${leadTab(c)} ${t}명보다 ${more ? '많은' : '적은'} 학생이 좋아하는 ${josa(c.kind, '을/를')} 모두 고른 것은?`, picked.options, picked.answer, {
        figure: tab(c, v), explain: `학생 수가 ${t}보다 ${more ? '큰' : '작은'} 것을 모두 찾는다. ${withCount(c, v, range(5).filter((i) => hit(v[i])))}이다.`, facts: { truth: picked.truth, want: true }
      });
    }, { standard: TAB }),
    T('know-than-one', '한 학생보다 많이 읽은 학생 수', '①30', (d) => {
      const c = books(d, 5), [v, k] = d.until(() => [nums(d, 5, 2, 8, distinct), d.int(0, 4)], ([x, i]) => { const n = x.filter((y) => y > x[i]).length; return n >= 1 && n <= 3; });
      const hits = c.names.filter((_, i) => v[i] > v[k]);
      return N(`${leadGr(c)} ${nick(c.names[k])}보다 책을 많이 읽은 학생은 모두 몇 명인가?`, hits.length, {
        unit: '명', figure: graphOf(c, v, { top: 8 }), explain: `${name(c.names[k], '은/는')} ${v[k]}권을 읽었다. ○가 ${v[k]}개보다 많은 학생은 ${hits.join(', ')}이다. 모두 ${hits.length}명이다.`,
        facts: { choose: { exprs: v.filter((_, i) => i !== k).map(String), rule: 'countAbove', target: v[k] } }
      });
    }),
    T('know-same', '수가 같은 두 가지 찾기', '①31 심25', (d) => {
      const c = pick(d, d.pick(['color', 'animal']), 4), [a, b, e] = nums(d, 3, 2, 8, (x) => distinct(x) && 2 * x[0] + x[1] + x[2] <= 24), v = d.shuffle([a, a, b, e]);
      const right = PAIRS.find(([i, j]) => v[i] === v[j]), shown = d.shuffle(d.shuffle(PAIRS.filter((p) => p !== right)).slice(0, 3).concat([right]));
      return C(`${leadTab(c)} 좋아하는 학생 수가 같은 두 ${josa(c.kind, '은/는')}?`, shown.map(([i, j]) => `${c.names[i]}, ${c.names[j]}`), shown.indexOf(right), {
        figure: tab(c, v, [['합계', sum(v)]]), explain: `표에서 수가 같은 것을 찾는다. ${josa(c.names[right[0]], '과/와')} ${josa(c.names[right[1]], '은/는')} ${a}명으로 같다.`,
        facts: { choose: { exprs: v.map(String), rule: 'same', pairsShown: shown } }
      });
    }, { standard: TAB }),
    T('know-order', '많은 것부터 차례로 쓰기', '①32', (d) => {
      const c = pick(d, d.pick(['fruit', 'sport']), 4), v = nums(d, 4, 2, 8, (x) => distinct(x) && orderable(x)), { right, list } = orderOptions(d, v);
      return C(`${leadTab(c)} 학생 수가 많은 ${c.kind}부터 차례로 쓴 것은?`, list.map((o) => o.map((i) => c.names[i]).join(', ')), list.indexOf(right), {
        figure: tab(c, v), explain: `표에 적힌 차례가 아니라 수가 큰 것부터 쓴다. ${withCount(c, v, right)}이다.`, facts: { choose: { exprs: v.map(String), rule: 'descending', orders: list } }
      });
    }, { standard: TAB }),
    T('know-top-two', '가장 많은 두 가지 고르기', '①33', (d) => {
      const c = pick(d, 'snack', 5), v = nums(d, 5, 2, 8, (x) => distinct(x) && sum(x) <= 25), o = range(5).sort((p, q) => v[q] - v[p]);
      const sets = [[o[0], o[1]], [o[0], o[2]], [o[1], o[2]], [o[0], o[4]]].map((s) => s.slice().sort((p, q) => p - q)), list = d.shuffle(sets);
      return C(`${leadTab(c)} 많은 학생이 좋아하는 간식부터 두 가지를 준비하려고 한다. 준비할 간식을 바르게 고른 것은?`, list.map((s) => s.map((i) => c.names[i]).join(', ')), list.indexOf(sets[0]), {
        figure: tab(c, v), explain: `학생 수가 가장 많은 것과 그다음으로 많은 것을 고른다. ${withCount(c, v, [o[0], o[1]])}이다.`, facts: { truth: list.map((s) => s.every((i) => v[i] >= v[o[1]])), want: true }
      });
    }, { standard: TAB }),
    T('know-gr-total', '그래프에서 조사한 학생 수 구하기', '①35', (d) => {
      const c = pick(d, d.pick(['color', 'season']), 4), v = nums(d, 4, 2, 7, (x) => sum(x) >= 14 && sum(x) <= 22);
      return N(`${leadGr(c)} 조사한 학생은 모두 몇 명인가?`, sum(v), {
        unit: '명', figure: graphOf(c, v, { top: 7 }), explain: `${c.kind}마다 ○의 수를 세어 모두 더한다. ${v.join(' + ')} = ${sum(v)}`, facts: { calc: [[v.join('+'), 0]] }
      });
    }),
    T('know-gr-missing', '조사한 학생 수로 그래프의 빈 줄 구하기', '①36 심27', (d) => {
      const c = pick(d, d.pick(['fruit', 'animal']), 4), v = nums(d, 4, 2, 7, (x) => sum(x) >= 14 && sum(x) <= 22), k = d.int(0, 3), all = sum(v), rest = v.filter((_, i) => i !== k);
      return N(`${leadGr(c)} 조사한 학생이 모두 ${all}명일 때, ${c.who(c.names[k])}은 몇 명인가?`, v[k], {
        unit: '명', figure: graphOf(c, v.map((x, i) => (i === k ? null : x)), { top: 7 }), explain: `조사한 학생 수에서 나머지 학생 수를 모두 뺀다. ${all} - ${rest.join(' - ')} = ${v[k]}`, facts: { calc: [[`${all}-${rest.join('-')}`, 0]] }
      });
    }),
    T('know-double', '학생 수가 2배인 것 찾기', '①37', (d) => {
      const c = pick(d, d.pick(['fruit', 'sport']), 4), a = d.int(2, 4);
      const v = d.until(() => d.shuffle([a, a * 2, a * 2 + d.pick([-1, 1]), d.int(1, 8)]), (x) => distinct(x) && top(x) <= 8), k = v.indexOf(a);
      return C(`${leadGr(c)} 좋아하는 학생 수가 ${c.names[k]}의 2배인 ${josa(c.kind, '은/는')}?`, c.names, v.indexOf(a * 2), {
        figure: graphOf(c, v, { top: 8 }), explain: `${c.who(c.names[k])}은 ${a}명이다. ${a}의 2배는 ${a * 2}이므로 ○가 ${a * 2}개인 것을 찾는다.`, facts: { choose: { exprs: v.map(String), rule: 'equals', target: a * 2 } }
      });
    }),
    T('know-wrong-say', '그래프를 보고 잘못 말한 학생 찾기', '①38', (d) => {
      const c = books(d, 4), v = nums(d, 4, 2, 8, distinct), wrong = d.int(0, 2), o = range(4).sort((p, q) => v[p] - v[q]), e = o[d.pick([1, 2])];
      const [a, b] = d.shuffle(o.filter((i) => i !== e)).slice(0, 2).sort((p, q) => v[p] - v[q]);      // a가 b보다 적게 읽었다. e는 가장 많이도 가장 적게도 읽지 않았다.
      const fewer = v.filter((y) => y < v[e]).length, more = v.filter((y) => y > v[e]).length;
      const said = [v[a] + (wrong === 0 ? d.pick([-1, 1]) : 0), v[b] - v[a] + (wrong === 1 ? 1 : 0), wrong === 2 ? more : fewer], who = [c.names[a], c.names[b], c.names[e]];
      const ok = [said[0] === v[a], said[1] === v[b] - v[a], said[2] === fewer];
      const why = [`${name(who[0], '은/는')} 책을 ${v[a]}권 읽었다.`, `${name(who[1], '은/는')} ${nick(who[0])}보다 ${v[b]} - ${v[a]} = ${v[b] - v[a]}(권) 더 읽었다.`, `${nick(who[2])}보다 책을 적게 읽은 학생은 ${fewer}명이다.`];
      return C(`${leadGr(c)} 그래프를 보고 잘못 말한 학생은?`, who, ok.indexOf(false), {
        figure: graphOf(c, v, { top: 8 }) + lines([`${who[0]}: 나는 책을 ${said[0]}권 읽었다.`, `${who[1]}: 나는 ${nick(who[0])}보다 책을 ${said[1]}권 더 읽었다.`, `${who[2]}: 나보다 책을 적게 읽은 학생은 ${said[2]}명이다.`]),
        explain: `말마다 그래프와 맞추어 본다. ${why[wrong]}`, facts: { truth: ok, want: false }
      });
    }),
    T('know-decide', '조사한 것으로 정하기', '①39 심32', (d) => {
      const c = Object.assign(pick(d, 'snack', 4), { topic: '학생들이 먹고 싶은 간식을' }), v = nums(d, 4, 2, 8, (x) => { const s = x.slice().sort((p, q) => q - p); return s[0] - s[1] === 1; }), hi = v.indexOf(top(v));
      return C(`${c.topic} 조사하여 ×를 이용한 그래프로 나타내었다. 가장 많은 학생이 먹고 싶어 하는 간식을 준비하려고 한다. 준비할 간식은?`, c.names, hi, {
        figure: graphOf(c, v, { mark: 'x', top: 8 }), explain: `×가 가장 높이 올라간 것을 찾는다. ${josa(c.names[hi], '이/가')} ${v[hi]}명으로 가장 많다.`, facts: { choose: { exprs: v.map(String), rule: 'max' } }
      });
    }),
    T('know-diary', '표와 그래프를 보고 글 완성하기', '①40', (d) => {
      const c = pick(d, 'season', 4), v = nums(d, 4, 2, 7, distinct), o = range(4).sort((p, q) => v[q] - v[p]), pairs = d.shuffle([[o[0], o[3]], [o[3], o[0]], [o[0], o[2]], [o[1], o[3]]]);
      return C(`${c.topic} 조사하여 나타낸 표와 그래프이다. 가장 많은 학생이 좋아하는 계절은 ㉠이다. 가장 적은 학생이 좋아하는 계절은 ㉡이다. ㉠, ㉡에 알맞은 계절을 차례로 쓴 것은?`, pairs.map(([p, q]) => `${c.names[p]}, ${c.names[q]}`), pairs.findIndex(([p, q]) => p === o[0] && q === o[3]), {
        figure: tab(c, v, [['합계', sum(v)]]) + graphOf(c, v, { top: 7 }), explain: `가장 많은 것은 ${c.names[o[0]]}의 ${v[o[0]]}명, 가장 적은 것은 ${c.names[o[3]]}의 ${v[o[3]]}명이다.`,
        facts: { truth: pairs.map(([p, q]) => v[p] === top(v) && v[q] === low(v)), want: true }
      });
    }),
    T('know-true', '표를 보고 알 수 있는 내용', '①41', (d) => {
      const c = pick(d, d.pick(['animal', 'color']), 4), v = nums(d, 4, 2, 8, (x) => distinct(x) && sum(x) <= 24), t = d.int(0, 3), o = range(4).sort((p, q) => v[q] - v[p]), all = sum(v);
      const k = d.int(0, 3), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => v[q] - v[p]);      // i가 j보다 많다
      const claims = d.shuffle([
        { text: `${c.who(c.names[k])}은 ${t === 0 ? v[k] : v[k] + 1}명이다.`, claim: ['value', k, t === 0 ? v[k] : v[k] + 1] },
        { text: `가장 많은 학생이 좋아하는 ${josa(c.kind, '은/는')} ${c.names[t === 1 ? o[0] : o[1]]}이다.`, claim: ['most', t === 1 ? o[0] : o[1]] },
        { text: `조사한 학생은 모두 ${t === 2 ? all : 4}명이다.`, claim: ['total', t === 2 ? all : 4] },
        { text: `${c.who(c.names[t === 3 ? i : j])}은 ${c.who(c.names[t === 3 ? j : i])}보다 많다.`, claim: ['more', t === 3 ? i : j, t === 3 ? j : i] }
      ]);
      const holds = ([what, p, q]) => ({ value: () => v[p] === q, most: () => v[p] === top(v), total: () => all === p, more: () => v[p] > v[q] }[what]()), truth = claims.map((row) => holds(row.claim));
      return C(`${leadTab(c)} 표를 보고 알 수 있는 내용으로 옳은 것은?`, claims.map((row) => row.text), truth.indexOf(true), {
        figure: tab(c, v, [['합계', all]]), explain: `표에서 ${withCount(c, v, [0, 1, 2, 3])}이고, 합계는 ${all}명이다. 가장 많은 것은 ${c.names[o[0]]}이다.`,
        facts: { truth, want: true, pictoTalk: { values: v, claims: claims.map((row) => row.claim) } }
      });
    }, { standard: TAB })
  ]);

  B.addTypes('2-2-5', 'good', [
    T('good-data-tab', '자료와 표 가운데 수를 알기 쉬운 것', '①42', (d) => {
      const c = pick(d, d.pick(['fruit', 'sport']), 4), rows = dataOf(d, c, nums(d, 4, 2, 4, (v) => sum(v) === 12 && new Set(v).size >= 2)), cnt = c.names.map((n) => countIn(rows, n));
      const list = d.shuffle([['조사한 자료', false], ['표', true]]);
      return C(`${c.topic} 조사한 자료와 표이다. ${c.kind}별 학생 수를 알아보기 쉬운 것은?`, list.map((r) => r[0]), list.findIndex((r) => r[1]), {
        figure: cardsFig(rows) + tab(c, cnt, [['합계', 12]]), explain: `자료에서는 하나씩 세어야 한다. 표에는 ${c.kind}별 학생 수가 수로 적혀 있어 알아보기 쉽다.`, facts: truthOf(list, true)
      });
    }, { standard: TAB }),
    T('good-glance', '많고 적음을 한눈에 알아보기 쉬운 것', '①43 심33', (d) => {
      const c = pick(d, d.pick(['animal', 'color']), 4), v = nums(d, 4, 2, 7, distinct), list = d.shuffle([['표', false], ['그래프', true]]);
      return C(`${c.topic} 조사하여 나타낸 표와 그래프이다. 가장 많은 학생이 좋아하는 ${josa(c.kind, '을/를')} 한눈에 알아보기 쉬운 것은?`, list.map((r) => r[0]), list.findIndex((r) => r[1]), {
        figure: tab(c, v, [['합계', sum(v)]]) + graphOf(c, v, { top: 7 }), explain: '그래프는 ○의 높이로 많고 적음을 한눈에 비교할 수 있다. 표에서는 수를 하나씩 읽어 비교해야 한다.', facts: truthOf(list, true)
      });
    }),
    T('good-tab-total', '조사한 학생 수를 바로 알 수 있는 것', '①44', (d) => {
      const c = pick(d, d.pick(['fruit', 'snack']), 4), v = nums(d, 4, 2, 7, distinct), list = d.shuffle([['표', true], ['그래프', false]]);
      return C(`${c.topic} 조사하여 나타낸 표와 그래프이다. 조사한 학생이 모두 몇 명인지 바로 알 수 있는 것은?`, list.map((r) => r[0]), list.findIndex((r) => r[1]), {
        figure: tab(c, v, [['합계', sum(v)]]) + graphOf(c, v, { top: 7 }), explain: '표에는 합계가 적혀 있어 조사한 학생 수를 바로 알 수 있다. 그래프에서는 ○를 모두 세어야 한다.', facts: truthOf(list, true)
      });
    }, { standard: TAB }),
    T('good-who', '누가 무엇을 골랐는지 알 수 있는 것', '①45', (d) => {
      const c = pick(d, d.pick(['fruit', 'snack', 'sport']), 4), who = d.pick(KIDS), list = d.shuffle([['조사한 자료', true], ['표', false], ['그래프', false]]);
      return C(`${c.topic} 조사한 자료를 표와 그래프로 나타내었다. ${name(who, '이/가')} 좋아하는 ${josa(c.kind, '을/를')} 알 수 있는 것은?`, list.map((r) => r[0]), list.findIndex((r) => r[1]), {
        explain: `표와 그래프에는 ${c.kind}별 학생 수만 나타난다. 누가 무엇을 좋아하는지는 조사한 자료에서 알 수 있다.`, facts: truthOf(list, true)
      });
    }, { standard: TAB }),
    T('good-tab-true', '표로 나타내면 편리한 점', '①46 심34', (d) => {
      const c = pick(d, d.pick(['fruit', 'sport', 'animal']), 4);
      const list = d.shuffle([[`${c.kind}별 학생 수를 쉽게 알 수 있다.`, true], [`누가 어떤 ${josa(c.kind, '을/를')} 좋아하는지 알 수 있다.`, false], ['○의 높이로 많고 적음을 한눈에 비교할 수 있다.', false], [`${josa(c.kind, '을/를')} 좋아하는 까닭을 알 수 있다.`, false]]);
      return C(`${c.topic} 조사한 자료를 표로 나타내었다. 표로 나타내면 편리한 점은?`, list.map((r) => r[0]), list.findIndex((r) => r[1]), {
        explain: `표에는 ${c.kind}별 학생 수와 합계가 수로 적혀 있어 쉽게 알 수 있다. 누가 무엇을 좋아하는지는 자료에서, ○의 높이는 그래프에서 볼 수 있다.`, facts: truthOf(list, true)
      });
    }, { standard: TAB }),
    T('good-graph-true', '그래프로 나타내면 편리한 점', '①46 심34', (d) => {
      const c = pick(d, d.pick(['color', 'snack', 'season']), 4);
      const list = d.shuffle([['가장 많은 것과 가장 적은 것을 한눈에 알 수 있다.', true], ['합계가 적혀 있어 조사한 학생 수를 바로 알 수 있다.', false], [`누가 어떤 ${josa(c.kind, '을/를')} 좋아하는지 알 수 있다.`, false], ['조사한 학생의 이름을 알 수 있다.', false]]);
      return C(`${c.topic} 조사한 자료를 그래프로 나타내었다. 그래프로 나타내면 편리한 점은?`, list.map((r) => r[0]), list.findIndex((r) => r[1]), {
        explain: '그래프는 ○, ×, /의 수로 나타내므로 가장 많은 것과 가장 적은 것을 한눈에 알 수 있다. 합계가 적혀 있는 것은 표이고, 이름이 적혀 있는 것은 조사한 자료이다.', facts: truthOf(list, true)
      });
    })
  ]);

  B.addGroup('2-2-5', {
    id: 'hard', title: '실력 문제', standard: GRAPH,
    types: [
      // ① 배운 뜻을 정확히 대야 풀리는 문제
      H('h-more-than', '「~보다 많은」에 같은 수는 들지 않는다', '①30 심28', (d) => {
        const c = pick(d, d.pick(['sport', 'animal']), 5), t = d.pick([4, 5]);
        const v = d.until(() => d.shuffle([t, d.int(t + 1, 8), d.int(t + 1, 8), d.int(1, t - 1), d.int(1, t - 1)]), distinct);
        const at = (ok) => c.names.filter((_, i) => ok(v[i])), key = (list) => list.join(', '), right = at((y) => y > t), same = c.names[v.indexOf(t)];
        const options = d.shuffle([
          right,                      // t명보다 많은 것만 고른다
          at((y) => y >= t),          // 꼭 t명인 것도 「t명보다 많은」에 넣는 아이
          at((y) => y === top(v)),    // 가장 많은 것 하나만 고르는 아이
          at((y) => y < t)            // 「적은」으로 읽은 아이
        ]);
        return C(`${leadGr(c)} ${t}명보다 많은 학생이 좋아하는 ${josa(c.kind, '을/를')} 모두 고른 것은?`, options.map(key), options.indexOf(right), {
          figure: graphOf(c, v, { top: 8 }), explain: `○가 ${t}개보다 많은 것을 찾는다. ${withCount(c, v, range(5).filter((i) => v[i] > t))}이다. ${josa(same, '은/는')} 꼭 ${t}명이므로 ${t}명보다 많은 것이 아니다.`,
          facts: { truth: options.map((o) => key(o) === key(c.names.filter((_, i) => v[i] > t))), want: true }
        });
      }),
      H('h-flip-class', '가로에 수를 나타낸 그래프에서 수가 주어진 반 찾기', '심17 심19', (d) => {
        const names = ['1반', '2반', '3반', '4반'], x = d.int(1, 4);
        const v = nums(d, 4, 1, 6, (y) => distinct(y) && y.includes(x) && y[x - 1] !== x), k = v.indexOf(x);
        // 「x명」을 찾으라는데 이름에 x가 든 「x반」을 고르는 아이가 있다. 가로가 학생 수임을 대야 ○가 x개인 줄을 찾는다.
        return C(`반별로 안경을 쓴 학생 수를 조사하여 ○를 이용한 그래프로 나타내었다. 안경을 쓴 학생이 ${x}명인 반은?`, names, k, {
          figure: graph(names, v, { flip: true, top: 6, kind: '반', axis: '학생 수', unit: '명' }),
          explain: `가로에 학생 수를, 세로에 반을 나타낸 그래프이다. ○가 ${x}개인 줄은 ${names[k]}이다. ${x}반은 ○가 ${v[x - 1]}개이다.`, facts: { choose: { exprs: v.map(String), rule: 'equals', target: x } }
        });
      }),
      H('h-wrong-marks', '틀린 수를 나타낸 그래프에서 가장 많이 맞힌 학생', '심31', (d) => {
        const kids = d.shuffle(NAMES).slice(0, 4), v = nums(d, 4, 1, 5, distinct), lo = v.indexOf(low(v));
        // ×가 가장 많은 학생을 고르는 아이: 표시가 많으면 더 잘한 것이라고 여긴다. 이 그래프의 × 하나는 틀린 문제 하나다.
        return C('네 학생이 문제를 6개씩 풀었다. 학생별 틀린 문제 수를 ×를 이용한 그래프로 나타내었다. 문제를 가장 많이 맞힌 학생은?', kids, lo, {
          figure: graph(kids, v, { mark: 'x', top: 6, kind: '이름', axis: '틀린 수', unit: '개' }),
          explain: `×는 틀린 문제의 수이다. ×가 적을수록 많이 맞혔다. ×가 ${v[lo]}개로 가장 적은 ${name(kids[lo], '이/가')} ${6 - v[lo]}문제를 맞혀 가장 많이 맞혔다.`, facts: { choose: { exprs: v.map(String), rule: 'min' } }
        });
      }),
      H('h-dice-above', '가로가 주사위 눈인 그래프에서 큰 눈이 나온 횟수', '심24 심29', (d) => {
        const names = ['1', '2', '3', '4', '5', '6'], t = d.pick([3, 4]), eyes = range(6).map((i) => i + 1).filter((e) => e > t);
        // 답과 겹치면 안 되는 틀린 답: ○가 t개보다 많은 줄의 수, 그런 줄의 ○를 더한 수, 눈의 수를 더한 수(5 + 6)
        const v = nums(d, 6, 1, 5, (x) => { const ans = sum(x.slice(t)), tall = x.filter((y) => y > t); return sum(x) >= 15 && sum(x) <= 22 && tall.length >= 1 && ![tall.length, sum(tall), sum(eyes)].includes(ans); });
        return N(`주사위를 여러 번 던져서 나온 눈을 조사하여 나타낸 그래프이다. ${t}보다 큰 눈이 나온 횟수는 모두 몇 번인가?`, sum(v.slice(t)), {
          unit: '번', figure: graph(names, v, { top: 5, kind: '눈', axis: '횟수', unit: '번', say: (e) => e + '의 눈' }),
          explain: `가로는 주사위 눈을, 세로는 나온 횟수를 나타낸다. ${t}보다 큰 눈은 ${eyes.join(', ')}이다. ${eyes.map((e) => `${e}의 눈은 ${v[e - 1]}번`).join(', ')} 나왔으므로 ${v.slice(t).join(' + ')} = ${sum(v.slice(t))}(번)이다.`,
          facts: { calc: [[v.slice(t).join('+'), 0]] }
        });
      }),
      // ② 두 번 넘게 생각해야 풀리는 문제
      H('h-true', '그래프에 대한 설명으로 옳은 것', '심26', (d) => {
        const c = books(d, 4), n = c.names, v = nums(d, 4, 2, 8, distinct), o = range(4).sort((p, q) => v[q] - v[p]), t = d.int(0, 3), all = sum(v), gap = top(v) - low(v);
        const [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => p - q);
        const [p, q] = d.until(() => d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((x, y) => v[y] - v[x]), ([x, y]) => !(x === o[0] && y === o[3]));      // p가 q보다 많이 읽었다(가장 많은 학생과 가장 적은 학생의 짝은 빼고)
        // 틀린 말에 적는 수: 가장 적은 학생을 잘못 고른 차, 하나 더 센 합, 한 명을 빠뜨린 합, 차가 아니라 읽은 수
        const said = [t === 0 ? gap : top(v) - v[o[2]], v[a] + v[b] + (t === 1 ? 0 : 1), t === 2 ? all : all - low(v), t === 3 ? v[p] - v[q] : v[p]];
        const rows = d.shuffle([
          [0, `책을 가장 많이 읽은 학생은 가장 적게 읽은 학생보다 ${said[0]}권 더 읽었다.`, `${top(v)}-${low(v)}`],
          [1, `${name(n[a], '과/와')} ${name(n[b], '이/가')} 읽은 책은 모두 ${said[1]}권이다.`, `${v[a]}+${v[b]}`],
          [2, `네 학생이 읽은 책은 모두 ${said[2]}권이다.`, v.join('+')],
          [3, `${name(n[p], '은/는')} ${nick(n[q])}보다 책을 ${said[3]}권 더 읽었다.`, `${v[p]}-${v[q]}`]
        ]);
        const why = [`가장 많이 읽은 학생은 ${top(v)}권, 가장 적게 읽은 학생은 ${low(v)}권을 읽었으므로 ${top(v)} - ${low(v)} = ${gap}(권) 더 읽었다.`, `${n[a]} ${v[a]}권, ${n[b]} ${v[b]}권이므로 모두 ${v[a]} + ${v[b]} = ${v[a] + v[b]}(권)이다.`,
          `네 학생이 읽은 책은 ${v.join(' + ')} = ${all}(권)이다.`, `${n[p]} ${v[p]}권, ${n[q]} ${v[q]}권이므로 ${v[p]} - ${v[q]} = ${v[p] - v[q]}(권) 더 읽었다.`];
        return C(`${leadGr(c)} 그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => r[1]), rows.findIndex((r) => r[0] === t), {
          figure: graphOf(c, v, { top: 8 }), explain: `말마다 그래프에서 수를 읽어 셈해 본다. ${why[t]}`, facts: { claimed: rows.map((r) => [r[2], said[r[0]]]), claimedWant: true }
        });
      }),
      H('h-twin', '수가 같은 두 빈칸 구하기', '심13', (d) => {
        const c = pick(d, d.pick(['sport', 'snack']), 5), x = d.int(2, 5), [a, b] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((p, q) => p - q);
        const rest = nums(d, 3, 3, 8, (r) => distinct(r) && !r.includes(x) && sum(r) + 2 * x <= 28), v = range(5).map((i) => (i === a || i === b ? x : rest[[0, 1, 2, 3, 4].filter((j) => j !== a && j !== b).indexOf(i)])), all = sum(v);
        return N(`${leadTab(c)} ${c.who(c.names[a])}과 ${c.who(c.names[b])}의 수는 같다. □ 안에 알맞은 수는?`, x, {
          figure: tab(c, v.map((y, i) => (i === a || i === b ? box() : y)), [['합계', all]]),
          explain: `합계에서 나머지 수를 모두 빼면 ${all} - ${rest.join(' - ')} = ${2 * x}이다. 같은 수를 두 번 더하여 ${josa(2 * x, '이/가')} 되는 수는 ${x}이다.`,
          facts: { calc: [[`(${all}-${rest.join('-')})/2`, 0]], unseen: [2] }
        });
      }, { standard: TAB }),
      H('h-cond-total', '조건으로 빈칸을 구하여 조사한 학생 수 구하기', '심14', (d) => {
        const c = pick(d, d.pick(['fruit', 'color']), 4), g = d.int(2, 3), [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2);      // b가 빈칸이다. a는 b보다 g명 적다.
        const v = d.until(() => { const x = range(4).map(() => d.int(2, 8)); x[a] = d.int(2, 5); x[b] = x[a] + g; return x; }, (x) => sum(x) <= 25 && distinct(x)), all = sum(v), known = v.filter((_, i) => i !== b);
        return N(`${leadTab(c)} ${c.who(c.names[a])}은 ${c.who(c.names[b])}보다 ${g}명 더 적다. 조사한 학생은 모두 몇 명인가?`, all, {
          unit: '명', figure: tab(c, v.map((y, i) => (i === b ? box() : y))),
          explain: `${c.who(c.names[b])}은 ${c.who(c.names[a])}보다 ${g}명 더 많으므로 ${v[a]} + ${g} = ${v[b]}(명)이다. 모두 더하면 ${v.join(' + ')} = ${all}(명)이다.`,
          facts: { calc: [[`${known.join('+')}+${v[a]}+${g}`, 0]] }
        });
      }, { standard: TAB }),
      H('h-rest-gap', '그 날씨가 아닌 날과의 차', '심30', (d) => {
        const c = WEATHER, all = d.pick([30, 31]), k = d.pick([2, 3]);
        const v = d.until(() => { const x = [d.int(10, 14), d.int(6, 9), d.int(4, 8)]; return x.concat([all - sum(x)]); }, (x) => x[3] >= 2 && x[3] <= 8 && distinct(x)), r = v[k];
        const word = k === 2 ? ['비가 오지 않은 날', '비가 온 날'] : ['눈이 오지 않은 날', '눈이 온 날'];
        return N(`어느 달의 날씨를 조사하여 나타낸 표이다. ${josa(word[0], '은/는')} ${word[1]}보다 며칠 더 많은가?`, all - r - r, {
          unit: '일', figure: tab(c, v, [['합계', all]]), explain: `${josa(word[0], '은/는')} 합계에서 ${josa(word[1], '을/를')} 뺀 ${all} - ${r} = ${all - r}(일)이다. ${all - r} - ${r} = ${all - 2 * r}이므로 ${all - 2 * r}일 더 많다.`,
          facts: { calc: [[`${all}-${r}-${r}`, 0]] }
        });
      }, { standard: TAB }),
      H('h-missing-then', '빈 줄을 구한 뒤 그보다 많은 것 세기', '심27 심28 심29', (d) => {
        const c = pick(d, d.pick(['fruit', 'sport']), 5), k = d.int(0, 4);
        const v = nums(d, 5, 2, 8, (x) => { const n = x.filter((y, i) => i !== k && y > x[k]).length; return n >= 1 && n <= 3 && x.every((y, i) => i === k || y !== x[k]) && sum(x) <= 25; });
        const all = sum(v), rest = v.filter((_, i) => i !== k), hits = c.names.filter((_, i) => i !== k && v[i] > v[k]);
        return N(`${leadGr(c)} 조사한 학생은 모두 ${all}명이다. ${c.names[k]}보다 많은 학생이 좋아하는 ${josa(c.kind, '은/는')} 모두 몇 가지인가?`, hits.length, {
          unit: '가지', figure: graphOf(c, v.map((y, i) => (i === k ? null : y)), { top: 8 }),
          explain: `${c.who(c.names[k])}은 ${all} - ${rest.join(' - ')} = ${v[k]}(명)이다. ○가 ${v[k]}개보다 많은 것은 ${hits.join(', ')}의 ${hits.length}가지이다.`,
          facts: { choose: { exprs: rest.map(String), rule: 'countAbove', target: v[k] } }
        });
      }),
      H('h-both', '표와 그래프를 맞대어 빈 곳 채우기', '①20 심18', (d) => {
        const c = pick(d, d.pick(['snack', 'animal']), 4), v = nums(d, 4, 2, 7, distinct), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2), all = sum(v);      // i는 그래프에만 있고, j는 표에도 그래프에도 없다.
        const [p, q] = [i, j].sort((x, y) => x - y), rest = v.filter((_, n) => n !== j), minus = `${all}-${rest.join('-')}`;
        return M(`${c.topic} 조사하여 나타낸 표와 그래프이다. 표에는 두 칸이, 그래프에는 한 줄이 비어 있다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: v[p] }, { label: LABELS[1], answer: v[q] }], {
          figure: tab(c, v.map((y, n) => (n === p ? box(LABELS[0]) : n === q ? box(LABELS[1]) : y)), [['합계', all]]) + graphOf(c, v.map((y, n) => (n === j ? null : y)), { top: 7 }),
          explain: `그래프에서 ${josa(c.names[i], '은/는')} ○가 ${v[i]}개이므로 ${v[i]}명이다. ${josa(c.names[j], '은/는')} 합계에서 나머지를 모두 빼어 구한다. ${minus.replace(/-/g, ' - ')} = ${v[j]}`,
          facts: { calc: [[p === j ? minus : String(v[p]), 0], [q === j ? minus : String(v[q]), 1]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
