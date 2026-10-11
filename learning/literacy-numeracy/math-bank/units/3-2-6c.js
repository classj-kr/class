// 3학년 2학기 6단원 그림그래프 — 꼴 목록(기본꼴 1~3, 심화꼴)을 다시 대조해 보탠 문항.
// a.js·b.js가 싣지 않은 꼴 가운데 답을 수나 고르기로 받을 수 있는 것을 모두 실었다. 여기서도 뺀 것:
//  - 그림그래프를 직접 그리는 꼴(작도), 알 수 있는 내용·좋은 점·까닭 쓰기(서술형), 조사 계획·신문 만들기(활동)
//  - 「몇 배인가」 가운데 두 자리 수로 나누어야 하는 것, 네 자리 수의 덧셈·나눗셈이 끼는 것(4학년)
//  - 합과 차로 빈 항목 둘 맞추기, 순서 조건으로 수 좁히기, 범례 없이 단위 셋을 짐작하기(조건 풀이가 어려움의 대부분)
//  - 가장 많은 것과 가장 적은 것의 합(뜻 없는 셈)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, LABELS, box, table, pictograph, lines, N, M, C } = B.kit;
  const DATA = '4수04-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SETS = [
    { head: ['마을', '학생 수'], names: ['가 마을', '나 마을', '다 마을', '라 마을'], each: '명', intro: '마을별 학생 수를', noun: '학생 수', place: '마을', hidden: '가 마을의 남학생 수' },
    { head: ['과수원', '사과 생산량'], names: ['가 과수원', '나 과수원', '다 과수원', '라 과수원'], each: '상자', intro: '과수원별 사과 생산량을', noun: '사과 생산량', place: '과수원', hidden: '가 과수원의 사과나무 수' },
    { head: ['목장', '우유 생산량'], names: ['가 목장', '나 목장', '다 목장', '라 목장'], each: '병', intro: '목장별 하루 우유 생산량을', noun: '우유 생산량', place: '목장', hidden: '가 목장의 젖소 수' }
  ];
  const graphOf = (s, values, units, options) => pictograph(s.head, s.names.slice(0, values.length).map((name, i) => [name, values[i]]), units, s.each, options);
  const lead = (s) => `${s.intro} 조사하여 나타낸 그림그래프이다.`;
  const of = (s, i) => `${s.names[i]}의 ${s.noun}`;
  const sum = (list) => list.reduce((x, y) => x + y, 0);
  const tens = (d, ok, n) => d.until(() => Array.from({ length: n || 4 }, () => d.int(1, 5) * 10 + d.int(0, 8)), (v) => new Set(v).size === v.length && (!ok || ok(v)));
  const few = (d, ok) => d.until(() => [d.int(4, 13), d.int(4, 13), d.int(4, 13), d.int(4, 13)], (v) => new Set(v).size === 4 && (!ok || ok(v)));
  const facts = (values, more) => Object.assign({ picto: { shown: values }, unseen: values.filter((v) => v !== null) }, more || {});
  const FRUITS = ['사과', '포도', '딸기', '수박'], SPORTS = ['축구', '농구', '수영', '줄넘기'];
  const sports = (values, mark) => table(['운동', '학생 수(명)'], SPORTS.map((name, i) => [name, mark && mark[i] !== undefined ? mark[i] : values[i]]));
  const fruits = (values) => table(['과일', '학생 수(명)'], FRUITS.map((name, i) => [name, values[i]]));
  const orderChoice = (d, values, labels) => {
    const right = values.map((_, i) => i).sort((p, q) => values[q] - values[p]);
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };
  const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

  B.addTypes('3-2-6', 'table', [
    T('tab-method', '자료를 모으는 방법', '②3 ③9 심5', (d) => {
      const rows = d.shuffle([['한 사람씩 좋아하는 간식을 말한다.', true], ['좋아하는 간식에 손을 든다.', true], ['좋아하는 간식 이름 아래에 붙임딱지를 붙인다.', true], ['가장 친한 친구 한 명에게만 물어본다.', false]]);
      return C('우리 반 학생들이 좋아하는 간식을 조사하려고 한다. 자료를 모으는 방법으로 알맞지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        explain: '우리 반 학생 모두에게 물어보아야 한다. 한 명에게만 물어보면 우리 반 학생들이 좋아하는 간식을 알 수 없다.', facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('tab-steps', '자료를 조사하여 표로 나타내는 차례', '②4 ③47', (d) => {
      const steps = ['조사할 내용을 정한다.', '조사할 내용에 맞게 자료를 모은다.', '모은 자료를 세어 표로 정리한다.'];
      const shown = d.shuffle([0, 1, 2]), right = [0, 1, 2].map((step) => shown.indexOf(step));
      const options = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('자료를 조사하여 표로 나타내는 차례대로 나열한 것은?', options.map((o) => o.map((i) => LABELS[i]).join(', ')), options.findIndex((o) => o.join() === right.join()), {
        figure: lines(shown.map((step, i) => `${LABELS[i]} ${steps[step]}`)), explain: '조사할 내용을 정하고, 자료를 모은 다음, 모은 자료를 표로 정리한다.', facts: { sequence: { ranks: shown, options } }
      });
    }),
    T('tab-text', '글에 적힌 수를 표로 옮기기', '②7 ③7 심6', (d) => {
      const [a, b, k] = [d.int(5, 12), d.int(4, 9), d.int(2, 5)];
      return M(`학생들이 좋아하는 운동을 조사하였더니 축구는 ${a}명, 농구는 ${b}명이었고, 수영은 농구보다 ${k}명 더 많았다. 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: b + k }], {
        figure: table(['운동', '학생 수(명)'], [['축구', a], ['농구', box(LABELS[0])], ['수영', box(LABELS[1])]]), explain: `농구는 ${b}명이고, 수영은 ${b} + ${k} = ${b + k}(명)이다.`, facts: { calc: [[String(b), 0], [`${b}+${k}`, 1]] }
      });
    }),
    T('tab-rowsum', '남학생과 여학생으로 나눈 표에서 한 줄의 합', '②9 심14·16', (d) => {
      const boys = [0, 1, 2, 3].map(() => d.int(3, 9)), girls = [0, 1, 2, 3].map(() => d.int(3, 9));
      return N('학생들이 좋아하는 운동을 남학생과 여학생으로 나누어 조사한 표이다. 조사한 남학생은 모두 몇 명인가?', sum(boys), {
        unit: '명', figure: table(['운동', '남학생(명)', '여학생(명)'], SPORTS.map((name, i) => [name, boys[i], girls[i]])), explain: `남학생 수를 모두 더한다. ${boys.join(' + ')} = ${sum(boys)}`, facts: { calc: [[boys.join('+'), 0]] }
      });
    }),
    T('tab-find', '표에서 수가 주어진 항목 찾기', '②11 ③12', (d) => {
      const v = few(d), k = d.int(0, 3);
      return C(`학생들이 좋아하는 운동을 조사하여 나타낸 표이다. ${v[k]}명의 학생이 좋아하는 운동은?`, SPORTS, k, { figure: sports(v), explain: `표에서 학생 수가 ${v[k]}명인 운동을 찾는다.`, facts: { choose: { exprs: v.map(String), rule: 'equals', target: v[k] } } });
    }),
    T('tab-total', '표에서 조사한 전체 수 구하기', '①64 ②12 ③?', (d) => {
      const v = few(d);
      return N('학생들이 좋아하는 과일을 조사하여 나타낸 표이다. 조사한 학생은 모두 몇 명인가?', sum(v), { unit: '명', figure: fruits(v), explain: `${v.join(' + ')} = ${sum(v)}`, facts: { calc: [[v.join('+'), 0]] } });
    }),
    T('tab-order', '표에서 많은 것부터 차례대로 쓰기', '②14 ③14 심10', (d) => {
      const v = d.until(() => [d.int(4, 13), d.int(4, 13), d.int(4, 13)], (x) => new Set(x).size === 3), names = SPORTS.slice(0, 3), pick = orderChoice(d, v, names);
      return C('학생들이 좋아하는 운동을 조사하여 나타낸 표이다. 좋아하는 학생이 많은 운동부터 차례대로 나열한 것은?', pick.options, pick.answer, {
        figure: table(['운동', '학생 수(명)'], names.map((name, i) => [name, v[i]])), explain: `학생 수가 큰 것부터 쓰면 ${v.slice().sort((x, y) => y - x).join(', ')}이다.`,
        facts: { choose: { exprs: v.map(String), rule: 'descending', orders: pick.list } }
      });
    }),
    T('tab-above', '표에서 기준보다 많은 항목의 수', '②15 ③?', (d) => {
      const [v, limit] = d.until(() => [few(d), d.int(6, 10)], ([x, y]) => !x.includes(y) && x.filter((z) => z > y).length >= 1 && x.filter((z) => z > y).length <= 3);
      return N(`학생들이 좋아하는 과일을 조사하여 나타낸 표이다. 좋아하는 학생이 ${limit}명보다 많은 과일은 모두 몇 가지인가?`, v.filter((x) => x > limit).length, {
        unit: '가지', figure: fruits(v), explain: `학생 수가 ${limit}명보다 많은 과일은 ${FRUITS.filter((_, i) => v[i] > limit).join(', ')}이다.`, facts: { choose: { exprs: v.map(String), rule: 'countAbove', target: limit } }
      });
    }),
    T('tab-sum2', '표에서 두 항목의 합', '②16 심11', (d) => {
      const v = few(d), [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2);
      return N(`학생들이 좋아하는 과일을 조사하여 나타낸 표이다. ${josa(FRUITS[a], '을/를')} 좋아하는 학생과 ${josa(FRUITS[b], '을/를')} 좋아하는 학생은 모두 몇 명인가?`, v[a] + v[b], {
        unit: '명', figure: fruits(v), explain: `${v[a]} + ${v[b]} = ${v[a] + v[b]}`, facts: { calc: [[`${v[a]}+${v[b]}`, 0]] }
      });
    }),
    T('tab-goal', '표에서 목표까지 더 필요한 양', '②19 심?', (d) => {
      const v = d.until(() => [d.int(12, 28), d.int(12, 28), d.int(12, 28), d.int(12, 28)], (x) => new Set(x).size === 4 && sum(x) < 96 && sum(x) % 10 !== 0), goal = 100;
      return N(`모둠별로 모은 빈 병의 수를 나타낸 표이다. 네 모둠이 모은 빈 병이 모두 ${goal}개가 되려면 빈 병을 몇 개 더 모아야 하는가?`, goal - sum(v), {
        unit: '개', figure: table(['모둠', '빈 병의 수(개)'], ['가 모둠', '나 모둠', '다 모둠', '라 모둠'].map((name, i) => [name, v[i]])), explain: `지금까지 모은 빈 병은 ${v.join(' + ')} = ${sum(v)}(개)이다. ${goal} - ${sum(v)} = ${goal - sum(v)}`,
        facts: { calc: [[`${goal}-(${v.join('+')})`, 0]] }
      });
    }),
    T('tab-same', '표에서 수가 같은 두 항목 찾기', '②20', (d) => {
      const [a, b, c] = d.until(() => [d.int(4, 13), d.int(4, 13), d.int(4, 13)], (x) => new Set(x).size === 3), v = d.shuffle([a, a, b, c]);
      const right = PAIRS.find(([i, j]) => v[i] === v[j]), shown = d.shuffle(d.shuffle(PAIRS.filter((p) => p !== right)).slice(0, 3).concat([right]));
      return C('학생들이 좋아하는 운동을 조사하여 나타낸 표이다. 좋아하는 학생 수가 같은 두 운동은?', shown.map(([i, j]) => `${SPORTS[i]}, ${SPORTS[j]}`), shown.indexOf(right), {
        figure: sports(v), explain: `${josa(SPORTS[right[0]], '과/와')} ${josa(SPORTS[right[1]], '을/를')} 좋아하는 학생은 ${a}명으로 같다.`, facts: { choose: { exprs: v.map(String), rule: 'same', pairsShown: shown } }
      });
    })
  ]);

  B.addTypes('3-2-6', 'read', [
    T('read-name', '그림그래프의 뜻', '①1 ②22 ③17 심19', (d) => {
      const list = d.shuffle(['그림그래프', '표', '수직선']);
      return C('조사한 수를 그림으로 나타낸 그래프를 무엇이라고 하는가?', list, list.indexOf('그림그래프'), { explain: '조사한 수를 그림으로 나타낸 그래프를 그림그래프라고 한다.', facts: { truth: list.map((word) => word === '그림그래프'), want: true } });
    }),
    T('read-legend', '그림이 나타내는 수 읽기', '①3 ②24 ③20 심21', (d) => {
      const s = SETS[1], v = d.until(() => [0, 1, 2, 3].map(() => d.int(1, 4) * 100 + d.int(1, 7) * 10), (x) => new Set(x).size === 4);
      return M(`${lead(s)} 큰 그림과 작은 그림은 각각 몇 ${s.each}를 나타내는가?`, [{ label: '큰 그림', answer: 100, unit: s.each }, { label: '작은 그림', answer: 10, unit: s.each }], {
        figure: graphOf(s, v, [100, 10]), explain: `그림그래프 아래에 그림이 나타내는 수가 적혀 있다. 큰 그림은 100${s.each}, 작은 그림은 10${s.each}를 나타낸다.`, facts: facts(v, { calc: [['100', 0], ['10', 1]] })
      });
    }),
    T('read-unit', '표와 비교하여 그림이 나타내는 수 알아내기', '①4 ②25·26 ③22 심22', (d) => {
      // 그림이 나타내는 수를 적지 않은 그림그래프: 표의 수와 그림의 수를 맞추어 본다
      const s = SETS[1], v = d.until(() => [0, 1, 2, 3].map(() => d.int(1, 4) * 100 + d.int(1, 7) * 10), (x) => new Set(x).size === 4 && x.every((y) => Math.floor(y / 100) !== (y % 100) / 10));
      return M('표를 보고 그림그래프로 나타내었다. 큰 그림과 작은 그림은 각각 몇 상자를 나타내는가?', [{ label: '큰 그림', answer: 100, unit: '상자' }, { label: '작은 그림', answer: 10, unit: '상자' }], {
        figure: table([s.head[0], `${s.noun}(${s.each})`], s.names.map((name, i) => [name, v[i]])) + graphOf(s, v, [100, 10], { legend: false }),
        explain: `${josa(s.names[0], '은/는')} ${v[0]}상자인데 큰 그림 ${Math.floor(v[0] / 100)}개와 작은 그림 ${(v[0] % 100) / 10}개로 나타내었다. 큰 그림은 100상자, 작은 그림은 10상자를 나타낸다.`,
        facts: { picto: { shown: v }, calc: [[`(${v[0]}-${v[0]}%100)/${Math.floor(v[0] / 100)}`, 0], [`${v[0]}%100/${(v[0] % 100) / 10}`, 1]], unseen: [100] }
      });
    }),
    T('read-symbols', '한 항목을 나타낸 그림의 수 세기', '②28 ③21', (d) => {
      const s = d.pick(SETS), v = tens(d, (x) => x.every((y) => y % 10 !== 0 && y % 10 !== Math.floor(y / 10))), k = d.int(0, 3);
      return M(`${lead(s)} ${josa(s.names[k], '을/를')} 나타낸 큰 그림과 작은 그림은 각각 몇 개인가?`, [{ label: '큰 그림', answer: Math.floor(v[k] / 10), unit: '개' }, { label: '작은 그림', answer: v[k] % 10, unit: '개' }], {
        figure: graphOf(s, v, [10, 1]), explain: `${s.names[k]}에는 큰 그림 ${Math.floor(v[k] / 10)}개와 작은 그림 ${v[k] % 10}개가 그려져 있다.`, facts: facts(v, { calc: [[`(${v[k]}-${v[k]}%10)/10`, 0], [`${v[k]}%10`, 1]] })
      });
    }),
    T('read-order', '많은 것부터 차례대로 쓰기', '①13 ②36 ③28 심32', (d) => {
      const s = d.pick(SETS), v = tens(d, (x) => new Set(x.map((y) => Math.floor(y / 10))).size <= 2, 3), names = s.names.slice(0, 3), pick = orderChoice(d, v, names);
      return C(`${lead(s)} ${josa(s.noun, '이/가')} 많은 ${s.place}부터 차례대로 나열한 것은?`, pick.options, pick.answer, {
        figure: graphOf(s, v, [10, 1]), explain: `많은 것부터 차례로 쓰면 ${v.slice().sort((x, y) => y - x).map((x) => `${names[v.indexOf(x)]} ${x}${s.each}`).join(', ')}이다.`,
        facts: facts(v, { choose: { exprs: v.map(String), rule: 'descending', orders: pick.list } })
      });
    }),
    T('read-between', '두 항목 사이에 있는 항목 찾기', '②38 심35', (d) => {
      const s = d.pick(SETS), v = tens(d), order = v.map((_, i) => i).sort((x, y) => v[x] - v[y]), k = d.int(0, 1), low = order[k], mid = order[k + 1], high = order[k + 2];
      return C(`${lead(s)} ${josa(s.noun, '이/가')} ${s.names[low]}보다 많고 ${s.names[high]}보다 적은 ${josa(s.place, '은/는')}?`, s.names, mid, {
        figure: graphOf(s, v, [10, 1]), explain: `${josa(s.names[low], '은/는')} ${v[low]}${s.each}, ${josa(s.names[high], '은/는')} ${v[high]}${s.each}이다. 그 사이에 있는 것은 ${v[mid]}${s.each}인 ${s.names[mid]}이다.`,
        facts: facts(v, { between: { low: String(v[low]), high: String(v[high]), exprs: v.map(String) } })
      });
    }),
    T('read-same', '수가 같은 두 항목 찾기', '①16 ②39 심36', (d) => {
      const s = d.pick(SETS), [a, b, c] = tens(d, null, 3), v = d.shuffle([a, a, b, c]);
      const right = PAIRS.find(([i, j]) => v[i] === v[j]), shown = d.shuffle(d.shuffle(PAIRS.filter((p) => p !== right)).slice(0, 3).concat([right]));
      return C(`${lead(s)} ${josa(s.noun, '이/가')} 같은 두 ${josa(s.place, '은/는')}?`, shown.map(([i, j]) => `${s.names[i]}, ${s.names[j]}`), shown.indexOf(right), {
        figure: graphOf(s, v, [10, 1]), explain: `${josa(s.names[right[0]], '과/와')} ${josa(s.names[right[1]], '은/는')} 큰 그림과 작은 그림의 수가 각각 같으므로 ${a}${s.each}으로 같다.`.replace(`${a}${s.each}으로`, josa(a + s.each, '으로/로')),
        facts: Object.assign(facts(v), { unseen: [a, b, c], choose: { exprs: v.map(String), rule: 'same', pairsShown: shown } })
      });
    }),
    T('read-sum2', '두 항목의 합', '①20 ②42 ③33 심38', (d) => {
      const up = (x) => PAIRS.filter(([i, j]) => (x[i] % 10) + (x[j] % 10) >= 10), s = d.pick(SETS), v = tens(d, (x) => up(x).length > 0), [a, b] = d.pick(up(v));
      return N(`${lead(s)} ${josa(of(s, a), '과/와')} ${of(s, b)}의 합은 몇 ${s.each}인가?`, v[a] + v[b], {
        unit: s.each, figure: graphOf(s, v, [10, 1]), explain: `${josa(s.names[a], '은/는')} ${v[a]}${s.each}, ${josa(s.names[b], '은/는')} ${v[b]}${s.each}이다. ${v[a]} + ${v[b]} = ${v[a] + v[b]}`, facts: facts(v, { calc: [[`${v[a]}+${v[b]}`, 0]] })
      });
    }),
    T('read-goal', '목표까지 모자란 수', '②49 심41', (d) => {
      const s = d.pick(SETS), v = tens(d), k = v.indexOf(Math.min(...v)), goal = Math.max(...v) + d.pick([10, 20]) - (Math.max(...v) % 10);
      return N(`${lead(s)} ${josa(of(s, k), '이/가')} ${goal}${s.each}이 되려면 몇 ${s.each}이 더 있어야 하는가?`.replace(`${goal}${s.each}이`, josa(goal + s.each, '이/가')).replace(`몇 ${s.each}이`, `몇 ${josa(s.each, '이/가')}`), goal - v[k], {
        unit: s.each, figure: graphOf(s, v, [10, 1]), explain: `${josa(s.names[k], '은/는')} ${v[k]}${s.each}이다. ${goal} - ${v[k]} = ${goal - v[k]}`, facts: facts(v, { calc: [[`${goal}-${v[k]}`, 0]] })
      });
    }),
    T('read-unknown', '그림그래프를 보고 알 수 없는 것', '심50', (d) => {
      const s = d.pick(SETS), v = tens(d), k = d.int(1, 3);
      const rows = d.shuffle([[`${of(s, k)}`, true], [`${josa(s.noun, '이/가')} 가장 많은 ${s.place}`, true], [`네 ${s.place}의 ${s.noun}의 합`, true], [s.hidden, false]]);
      return C(`${lead(s)} 이 그림그래프를 보고 알 수 없는 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        figure: graphOf(s, v, [10, 1]), explain: `그림그래프에는 ${s.place}별 ${s.noun}만 나타나 있다. ${josa(s.hidden, '은/는')} 조사하지 않았으므로 알 수 없다.`, facts: facts(v, { truth: rows.map(([, ok]) => ok), want: false })
      });
    })
  ]);

  B.addTypes('3-2-6', 'draw', [
    T('draw-total', '한 항목을 나타내는 데 그릴 그림의 수', '심60', (d) => {
      const v = d.until(() => d.int(21, 68), (x) => x % 10 >= 2 && x % 10 !== Math.floor(x / 10));
      return N(`10명을 나타내는 큰 그림과 1명을 나타내는 작은 그림으로 학생 ${v}명을 나타내려고 한다. 그림은 모두 몇 개 그려야 하는가?`, Math.floor(v / 10) + (v % 10), {
        unit: '개', explain: `큰 그림 ${Math.floor(v / 10)}개와 작은 그림 ${v % 10}개를 그린다. ${Math.floor(v / 10)} + ${v % 10} = ${Math.floor(v / 10) + (v % 10)}`, facts: { calc: [[`(${v}-${v}%10)/10+${v}%10`, 0]], unseen: [10] }
      });
    }),
    T('draw-pick', '한 항목을 바르게 나타낸 그림 고르기', '심61', (d) => {
      // 34명: 34, 43(큰 그림과 작은 그림의 수를 바꿈), 30(작은 그림을 빠뜨림), 44(큰 그림을 하나 더)
      const v = d.until(() => d.int(2, 4) * 10 + d.int(2, 5), (x) => x % 10 !== Math.floor(x / 10)), swapped = (v % 10) * 10 + Math.floor(v / 10);
      const list = d.shuffle([v, swapped, v - (v % 10), v + 10]);
      return C(`10명을 나타내는 큰 그림과 1명을 나타내는 작은 그림으로 학생 ${v}명을 바르게 나타낸 것은?`, LABELS, list.indexOf(v), {
        figure: pictograph(['', '그림'], list.map((x, i) => [LABELS[i], x]), [10, 1], '명'), explain: `${josa(v, '은/는')} 10이 ${Math.floor(v / 10)}개, 1이 ${v % 10}개인 수이므로 큰 그림 ${Math.floor(v / 10)}개와 작은 그림 ${v % 10}개로 나타낸다.`,
        facts: { picto: { shown: list }, choose: { exprs: list.map(String), rule: 'equals', target: v }, unseen: list }
      });
    })
  ]);

  B.addTypes('3-2-6', 'fill', [
    T('fill-both', '표와 그림그래프를 서로 채우기', '①67 ②71 ③44 심68', (d) => {
      const s = d.pick(SETS), v = tens(d, (x) => x.every((y) => y % 10 !== 0)), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2), shown = v.map((x, k) => (k === j ? null : x));
      return M(`표와 그림그래프를 완성하려고 한다. ㉠에 알맞은 수와, 그림그래프의 ${s.names[j]}에 그려야 할 큰 그림의 수 ㉡, 작은 그림의 수 ㉢은?`, [{ label: LABELS[0], answer: v[i] }, { label: LABELS[1], answer: Math.floor(v[j] / 10) }, { label: LABELS[2], answer: v[j] % 10 }], {
        figure: table([s.head[0], `${s.noun}(${s.each})`], s.names.map((name, k) => [name, k === i ? box(LABELS[0]) : v[k]])) + graphOf(s, shown, [10, 1]),
        explain: `그림그래프에서 ${josa(s.names[i], '은/는')} ${v[i]}${s.each}이다. 표에서 ${josa(s.names[j], '은/는')} ${v[j]}${s.each}이므로 큰 그림 ${Math.floor(v[j] / 10)}개와 작은 그림 ${v[j] % 10}개를 그린다.`,
        facts: facts(shown, { calc: [[String(v[i]), 0], [`(${v[j]}-${v[j]}%10)/10`, 1], [`${v[j]}%10`, 2]] })
      });
    }),
    T('fill-which', '표와 그림그래프의 좋은 점', '②72 ③59 심54', (d) => {
      const rows = d.shuffle([['그림그래프는 항목별 수의 많고 적음을 한눈에 비교하기 쉽다.', true], ['표는 그림의 크기와 수로 조사한 수를 나타낸다.', false], ['그림그래프에서는 항목별 조사한 수를 알 수 없다.', false], ['표는 항목별 수의 많고 적음이 그림그래프보다 한눈에 잘 보인다.', false]]);
      return C('표와 그림그래프에 대한 설명으로 옳은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: '표는 조사한 수와 합계를 바로 알 수 있고, 그림그래프는 그림의 크기와 수로 나타내어 항목별 수의 많고 적음을 한눈에 비교하기 쉽다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    })
  ]);

  B.addTypes('3-2-6', 'hard', [
    H('h-fill-most', '빠진 항목을 구한 뒤 가장 많은 항목 찾기', '심71, 기본 ②64', (d) => {
      // 그림이 빠진 줄이 가장 많은 줄이 되기도 하고 아니기도 하다
      const s = d.pick(SETS), v = tens(d, (x) => sum(x) <= 150 && Math.max(...x) - x.slice().sort((p, q) => q - p)[1] <= 6), k = d.pick([v.indexOf(Math.max(...v)), v.indexOf(x2(v))]), shown = v.map((x, i) => (i === k ? null : x));
      return C(`${lead(s)} 네 ${s.place}의 ${josa(s.noun, '이/가')} 모두 ${sum(v)}${s.each}일 때, ${josa(s.noun, '이/가')} 가장 많은 ${josa(s.place, '은/는')}?`, s.names, v.indexOf(Math.max(...v)), {
        figure: graphOf(s, shown, [10, 1]), explain: `${josa(s.names[k], '은/는')} ${sum(v)} - ${v.filter((_, i) => i !== k).join(' - ')} = ${v[k]}(${s.each})이다. 가장 많은 ${josa(s.place, '은/는')} ${v.indexOf(Math.max(...v)) === k ? v[k] : Math.max(...v)}${s.each}인 ${s.names[v.indexOf(Math.max(...v))]}이다.`,
        facts: facts(shown, { choose: { exprs: v.map((x, i) => (i === k ? `${sum(v)}-${v.filter((_, n) => n !== k).join('-')}` : String(x))), rule: 'max' } })
      });
    })
  ]);
  function x2(v) { return v.slice().sort((p, q) => q - p)[1]; }
})(typeof window !== 'undefined' ? window : globalThis);
