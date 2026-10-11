// 3학년 2학기 6단원 그림그래프(자료의 정리) — 단원 틀과 기본 문항.
// 수집해 둔 교과서 9종의 평가 자료(단원평가·형성평가·수학익힘·수행평가)에서 뽑은 문제 꼴 목록(기본꼴 1~3, 모두 210꼴)을
// 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다(표인가 그림그래프인가, 그림의 단위가 몇 가지인가, 읽는가·견주는가·셈하는가·빈 곳을 구하는가).
//    조사한 것(마을·과수원·목장)만 다른 것은 한 번만 싣는다.
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      4학년 「곱셈과 나눗셈」: 두 자리 수로 나누어야 하는 「몇 배인가」(52÷26), 네 자리 수를 나누는 꼴
//      4학년 「큰 수」·네 자리 수의 덧셈과 뺄셈: 합계가 네 자리 수를 넘겨 받아올림·받아내림을 하는 꼴
//  - 그림그래프 그리기(작도), 알 수 있는 내용·좋은 점·까닭 쓰기(서술형), 조사 계획 세우기·신문 만들기(활동)는 싣지 않는다.
//  - 합과 차로 빈 항목 둘을 맞추기, 순서 조건으로 수 좁히기처럼 조건 풀이가 어려움의 대부분인 것은 싣지 않는다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, LABELS, box, table, pictograph, N, M, C } = B.kit;
  const DATA = '4수04-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 조사한 것: 그림그래프의 머리말, 줄 이름, 수 뒤에 붙는 낱말
  const SETS = [
    { head: ['마을', '학생 수'], names: ['가 마을', '나 마을', '다 마을', '라 마을'], each: '명', intro: '마을별 학생 수를', noun: '학생 수', place: '마을' },
    { head: ['과수원', '사과 생산량'], names: ['가 과수원', '나 과수원', '다 과수원', '라 과수원'], each: '상자', intro: '과수원별 사과 생산량을', noun: '사과 생산량', place: '과수원' },
    { head: ['목장', '우유 생산량'], names: ['가 목장', '나 목장', '다 목장', '라 목장'], each: '병', intro: '목장별 하루 우유 생산량을', noun: '우유 생산량', place: '목장' }
  ];
  const graphOf = (s, values, units) => pictograph(s.head, s.names.map((name, i) => [name, values[i]]), units, s.each);
  const lead = (s) => `${s.intro} 조사하여 나타낸 그림그래프이다.`;
  const of = (s, i) => `${s.names[i]}의 ${s.noun}`;
  const sum = (list) => list.reduce((x, y) => x + y, 0);
  // 서로 다른 수 넷. 10·1 단위(작은 그림은 9개까지), 100·10·1 단위, 10·5·1 단위
  const tens = (d, ok) => d.until(() => [0, 1, 2, 3].map(() => d.int(1, 5) * 10 + d.int(0, 8)), (v) => new Set(v).size === 4 && (!ok || ok(v)));
  const hundreds = (d) => d.until(() => [0, 1, 2, 3].map(() => d.int(1, 3) * 100 + d.int(0, 4) * 10 + d.int(0, 4)), (v) => new Set(v).size === 4 && v.every((x) => x % 100 !== 0));
  const fives = (d) => d.until(() => [0, 1, 2, 3].map(() => d.int(1, 3) * 10 + d.int(0, 1) * 5 + d.int(0, 4)), (v) => new Set(v).size === 4 && v.some((x) => x % 10 >= 5));
  const facts = (values, more) => Object.assign({ picto: { shown: values }, unseen: values.filter((v) => v !== null) }, more || {});
  const FRUITS = ['사과', '포도', '딸기', '수박'], SPORTS = ['축구', '농구', '수영', '줄넘기'];

  B.addUnit({
    id: '3-2-6', grade: 3, semester: 2, no: 6, title: '그림그래프', version: 2,
    groups: [
      {
        id: 'table', title: '자료를 표로 정리하고 표 읽기', standard: DATA,
        types: [
          T('tab-count', '자료를 세어 표로 정리하기', '①54 ②5·6 ③1 심1', (d) => {
            const counts = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 5), d.int(2, 5)], (v) => new Set(v).size >= 3 && sum(v) >= 12 && sum(v) <= 16);
            const list = d.shuffle(FRUITS.flatMap((fruit, i) => Array(counts[i]).fill(fruit))), k = d.int(0, 3);
            return N(`학생들이 좋아하는 과일을 조사한 것이다. 표로 정리할 때, ${josa(FRUITS[k], '을/를')} 좋아하는 학생은 몇 명인가?`, counts[k], {
              unit: '명', figure: '<div class="mb-numbers">' + list.map((word) => '<span>' + word + '</span>').join('') + '</div>',
              explain: `빠뜨리거나 두 번 세지 않도록 표시하면서 센다. ${FRUITS[k]}는 ${counts[k]}번 나온다.`.replace(`${FRUITS[k]}는`, josa(FRUITS[k], '은/는')), facts: { tallyOf: { list, target: FRUITS[k] } }
            });
          }),
          T('tab-blank', '합계로 표의 빈칸 구하기', '②21 ③11 심8', (d) => {
            const v = d.until(() => [d.int(4, 12), d.int(4, 12), d.int(4, 12), d.int(4, 12)], (x) => new Set(x).size === 4), k = d.int(0, 3), total = sum(v);
            return N('학생들이 좋아하는 운동을 조사하여 나타낸 표이다. □ 안에 알맞은 수는?', v[k], {
              figure: table(['운동', '학생 수(명)'], SPORTS.map((name, i) => [name, i === k ? box() : v[i]]).concat([['합계', total]])),
              explain: `합계에서 나머지 학생 수를 뺀다. ${total} - ${v.filter((_, i) => i !== k).join(' - ')} = ${v[k]}`, facts: { calc: [[`${total}-${v.filter((_, i) => i !== k).join('-')}`, 0]] }
            });
          }),
          T('tab-most', '표에서 가장 많은 것 찾기', '①61 ②13 ③13 심10', (d) => {
            const v = d.until(() => [d.int(4, 13), d.int(4, 13), d.int(4, 13), d.int(4, 13)], (x) => new Set(x).size === 4 && Math.max(...x) - x.slice().sort((p, q) => q - p)[1] <= 2);
            return C('학생들이 좋아하는 운동을 조사하여 나타낸 표이다. 가장 많은 학생이 좋아하는 운동은?', SPORTS, v.indexOf(Math.max(...v)), {
              figure: table(['운동', '학생 수(명)'], SPORTS.map((name, i) => [name, v[i]])), explain: `학생 수가 가장 큰 운동을 찾는다. ${SPORTS[v.indexOf(Math.max(...v))]}가 ${Math.max(...v)}명으로 가장 많다.`.replace(`${SPORTS[v.indexOf(Math.max(...v))]}가`, josa(SPORTS[v.indexOf(Math.max(...v))], '이/가')),
              facts: { choose: { exprs: v.map(String), rule: 'max' } }
            });
          }),
          T('tab-gap', '표에서 가장 많은 것과 가장 적은 것의 차', '①62 ②18 ③15 심11', (d) => {
            const v = d.until(() => [d.int(12, 48), d.int(12, 48), d.int(12, 48), d.int(12, 48)], (x) => new Set(x).size === 4 && (Math.max(...x) % 10) < (Math.min(...x) % 10));
            return N('학생들이 좋아하는 과일을 조사하여 나타낸 표이다. 가장 많은 학생이 좋아하는 과일과 가장 적은 학생이 좋아하는 과일의 학생 수의 차는 몇 명인가?', Math.max(...v) - Math.min(...v), {
              unit: '명', figure: table(['과일', '학생 수(명)'], FRUITS.map((name, i) => [name, v[i]])), explain: `가장 많은 것은 ${Math.max(...v)}명, 가장 적은 것은 ${Math.min(...v)}명이다. ${Math.max(...v)} - ${Math.min(...v)} = ${Math.max(...v) - Math.min(...v)}`,
              facts: { calc: [[`${Math.max(...v)}-${Math.min(...v)}`, 0]] }
            });
          }),
          T('tab-two', '남학생과 여학생으로 나눈 표 읽기', '①60 ②8·9 심14·16', (d) => {
            const [boys, girls] = d.until(() => [[0, 1, 2, 3].map(() => d.int(3, 9)), [0, 1, 2, 3].map(() => d.int(3, 9))], ([x, y]) => { const t = x.map((v, i) => v + y[i]); return new Set(t).size === 4 && x.indexOf(Math.max(...x)) !== t.indexOf(Math.max(...t)) && y.indexOf(Math.max(...y)) !== t.indexOf(Math.max(...t)); });
            const totals = boys.map((v, i) => v + girls[i]);
            return C('학생들이 좋아하는 운동을 남학생과 여학생으로 나누어 조사한 표이다. 남학생과 여학생을 합하여 가장 많은 학생이 좋아하는 운동은?', SPORTS, totals.indexOf(Math.max(...totals)), {
              figure: table(['운동', '남학생(명)', '여학생(명)'], SPORTS.map((name, i) => [name, boys[i], girls[i]])),
              explain: `운동마다 남학생 수와 여학생 수를 더한다. ${SPORTS.map((name, i) => `${name} ${boys[i]} + ${girls[i]} = ${totals[i]}`).join(', ')}`, facts: { choose: { exprs: boys.map((v, i) => `${v}+${girls[i]}`), rule: 'max' } }
            });
          }),
          T('tab-regroup', '비슷한 것끼리 묶어 다시 분류하기', '③2·3 심3·17', (d) => {
            const v = d.until(() => [d.int(3, 9), d.int(3, 9), d.int(3, 9), d.int(3, 9)], (x) => new Set(x).size === 4 && x[0] + x[1] !== x[2] + x[3]);
            return M('학생들이 좋아하는 것을 조사한 표를 과일과 운동으로 묶어 다시 정리하였다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: v[0] + v[1] }, { label: LABELS[1], answer: v[2] + v[3] }], {
              figure: table(['좋아하는 것', '학생 수(명)'], ['사과', '포도', '축구', '수영'].map((name, i) => [name, v[i]])) + table(['종류', '학생 수(명)'], [['과일', box(LABELS[0])], ['운동', box(LABELS[1])]]),
              explain: `사과와 포도는 과일이므로 ${v[0]} + ${v[1]} = ${v[0] + v[1]}, 축구와 수영은 운동이므로 ${v[2]} + ${v[3]} = ${v[2] + v[3]}이다.`, facts: { calc: [[`${v[0]}+${v[1]}`, 0], [`${v[2]}+${v[3]}`, 1]] }
            });
          })
        ]
      },
      {
        id: 'read', title: '그림그래프 읽기', standard: DATA,
        types: [
          T('read-one', '한 항목의 수 읽기', '①8 ②29 ③23 심24', (d) => {
            const s = d.pick(SETS), v = tens(d, (x) => x.every((y) => y % 10 !== 0)), k = d.int(0, 3);
            return N(`${lead(s)} ${josa(of(s, k), '은/는')} 몇 ${s.each}인가?`, v[k], {
              unit: s.each, figure: graphOf(s, v, [10, 1]), explain: `큰 그림은 10${s.each}, 작은 그림은 1${s.each}을 나타낸다. ${s.names[k]}에는 큰 그림이 ${Math.floor(v[k] / 10)}개, 작은 그림이 ${v[k] % 10}개이므로 ${v[k]}${s.each}이다.`.replace(`1${s.each}을`, josa('1' + s.each, '을/를')),
              facts: facts(v, { calc: [[String(v[k]), 0]] })
            });
          }),
          T('read-three', '그림이 세 가지인 그림그래프 읽기', '②31 ③53 심25', (d) => {
            const s = SETS[1], v = hundreds(d), k = d.int(0, 3);
            return N(`${lead(s)} ${josa(of(s, k), '은/는')} 몇 ${s.each}인가?`, v[k], {
              unit: s.each, figure: graphOf(s, v, [100, 10, 1]), explain: `그림은 큰 것부터 100${s.each}, 10${s.each}, 1${s.each}를 나타낸다. ${s.names[k]}은 ${v[k]}${s.each}이다.`.replace(`1${s.each}를`, josa('1' + s.each, '을/를')).replace(`${s.names[k]}은`, josa(s.names[k], '은/는')),
              facts: facts(v, { calc: [[String(v[k]), 0]] })
            });
          }),
          T('read-five', '5를 나타내는 그림이 있는 그림그래프 읽기', '②30 ③24·54 심26', (d) => {
            const s = SETS[0], v = fives(d), k = d.until(() => d.int(0, 3), (i) => v[i] % 10 >= 5);
            return N(`${lead(s)} ${josa(of(s, k), '은/는')} 몇 ${s.each}인가?`, v[k], {
              unit: s.each, figure: graphOf(s, v, [10, 5, 1]), explain: `그림은 큰 것부터 10${s.each}, 5${s.each}, 1${s.each}을 나타낸다. ${s.names[k]}은 ${Math.floor(v[k] / 10) * 10} + 5 + ${v[k] % 5} = ${v[k]}(${s.each})이다.`.replace(`${s.names[k]}은`, josa(s.names[k], '은/는')),
              facts: facts(v, { calc: [[String(v[k]), 0]] })
            });
          }),
          T('read-find', '수가 주어진 항목 찾기', '①9 ②32 심27', (d) => {
            const s = d.pick(SETS), v = tens(d, (x) => new Set(x.map((y) => Math.floor(y / 10))).size <= 3), k = d.int(0, 3);
            return C(`${lead(s)} ${s.noun}이 ${v[k]}${s.each}인 ${josa(s.place, '은/는')}?`.replace(`${s.noun}이`, josa(s.noun, '이/가')), s.names, k, {
              figure: graphOf(s, v, [10, 1]), explain: `큰 그림이 ${Math.floor(v[k] / 10)}개, 작은 그림이 ${v[k] % 10}개인 ${josa(s.place, '을/를')} 찾는다.`, facts: facts(v, { choose: { exprs: v.map(String), rule: 'equals', target: v[k] } })
            });
          }),
          T('read-most', '가장 많은 항목 찾기', '①11 ②33 ③25 심29', (d) => {
            const s = d.pick(SETS), v = tens(d, (x) => x.filter((y) => Math.floor(y / 10) === Math.floor(Math.max(...x) / 10)).length >= 2);
            return C(`${lead(s)} ${josa(s.noun, '이/가')} 가장 많은 ${josa(s.place, '은/는')}?`, s.names, v.indexOf(Math.max(...v)), {
              figure: graphOf(s, v, [10, 1]), explain: `큰 그림의 수가 많은 곳부터 살펴보고, 큰 그림의 수가 같으면 작은 그림의 수를 비교한다. ${s.names[v.indexOf(Math.max(...v))]}이 ${Math.max(...v)}${s.each}으로 가장 많다.`.replace(`${s.names[v.indexOf(Math.max(...v))]}이`, josa(s.names[v.indexOf(Math.max(...v))], '이/가')).replace(`${Math.max(...v)}${s.each}으로`, josa(Math.max(...v) + s.each, '으로/로')),
              facts: facts(v, { choose: { exprs: v.map(String), rule: 'max' } })
            });
          }),
          T('read-second', '두 번째로 많은 항목 찾기', '①14 ②37 ③27 심33', (d) => {
            const s = d.pick(SETS), v = tens(d), second = v.slice().sort((x, y) => y - x)[1];
            return C(`${lead(s)} ${josa(s.noun, '이/가')} 두 번째로 많은 ${josa(s.place, '은/는')}?`, s.names, v.indexOf(second), {
              figure: graphOf(s, v, [10, 1]), explain: `많은 것부터 차례로 쓰면 ${v.slice().sort((x, y) => y - x).map((x) => `${s.names[v.indexOf(x)]} ${x}${s.each}`).join(', ')}이다.`, facts: facts(v, { rank: { values: v, nth: 2 } })
            });
          }),
          T('read-total', '전체 수 구하기', '①22 ②44 ③34 심42', (d) => {
            const s = d.pick(SETS), v = tens(d, (x) => sum(x) <= 150 && sum(x.map((y) => y % 10)) >= 10);
            return N(`${lead(s)} 네 ${s.place}의 ${josa(s.noun, '은/는')} 모두 몇 ${s.each}인가?`, sum(v), {
              unit: s.each, figure: graphOf(s, v, [10, 1]), explain: `${v.join(' + ')} = ${sum(v)}`, facts: facts(v, { calc: [[v.join('+'), 0]] })
            });
          }),
          T('read-gap', '가장 많은 것과 가장 적은 것의 차', '①21 ②45 ③32 심40', (d) => {
            const s = d.pick(SETS), v = tens(d, (x) => (Math.max(...x) % 10) < (Math.min(...x) % 10));
            return N(`${lead(s)} ${josa(s.noun, '이/가')} 가장 많은 ${josa(s.place, '과/와')} 가장 적은 ${s.place}의 ${s.noun}의 차는 몇 ${s.each}인가?`, Math.max(...v) - Math.min(...v), {
              unit: s.each, figure: graphOf(s, v, [10, 1]), explain: `가장 많은 곳은 ${Math.max(...v)}${s.each}, 가장 적은 곳은 ${Math.min(...v)}${s.each}이다. ${Math.max(...v)} - ${Math.min(...v)} = ${Math.max(...v) - Math.min(...v)}`,
              facts: facts(v, { calc: [[`${Math.max(...v)}-${Math.min(...v)}`, 0]] })
            });
          }),
          T('read-twice', '2배인 항목 찾기', '②48 심44', (d) => {
            const s = d.pick(SETS), [v, k] = d.until(() => { const a = d.int(1, 2) * 10 + d.int(1, 4); return [d.shuffle([a, a * 2, a * 2 + d.pick([-3, 3, 5]), a + d.pick([7, 9, 12])]), a]; }, ([x, a]) => new Set(x).size === 4 && x.filter((y) => y === a * 2).length === 1 && x.every((y) => y % 10 <= 8 && y < 60));
            return C(`${lead(s)} ${josa(s.noun, '이/가')} ${s.names[v.indexOf(k)]}의 2배인 ${josa(s.place, '은/는')}?`, s.names, v.indexOf(k * 2), {
              figure: graphOf(s, v, [10, 1]), explain: `${josa(s.names[v.indexOf(k)], '은/는')} ${k}${s.each}이다. ${k} × 2 = ${k * 2}이므로 ${k * 2}${s.each}인 ${josa(s.place, '을/를')} 찾는다.`,
              facts: facts(v, { choose: { exprs: v.map(String), rule: 'equals', target: k * 2 } })
            });
          }),
          T('read-say', '그림그래프에 대한 설명', '①37 ②40 ③37 심49', (d) => {
            const s = d.pick(SETS), v = tens(d), order = v.map((_, i) => i).sort((x, y) => v[y] - v[x]), [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2), hi = v[a] > v[b] ? a : b, lo = hi === a ? b : a;
            const rows = d.shuffle([
              { text: `${josa(of(s, hi), '은/는')} ${of(s, lo)}보다 많다.`, claim: ['more', hi, lo] },
              { text: `${josa(s.noun, '이/가')} 가장 적은 ${josa(s.place, '은/는')} ${s.names[order[2]]}이다.`, claim: ['least', order[2]] },
              { text: `${josa(of(s, order[1]), '은/는')} ${v[order[1]] + 10}${s.each}이다.`, claim: ['value', order[1], v[order[1]] + 10] },
              { text: `${josa(s.noun, '이/가')} 가장 많은 ${josa(s.place, '은/는')} ${s.names[order[1]]}이다.`, claim: ['most', order[1]] }
            ]);
            return C(`${lead(s)} 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.claim[0] === 'more'), {
              figure: graphOf(s, v, [10, 1]), explain: `많은 것부터 차례로 쓰면 ${order.map((i) => `${s.names[i]} ${v[i]}${s.each}`).join(', ')}이다.`,
              facts: facts(v, { truth: rows.map((row) => row.claim[0] === 'more'), want: true, pictoTalk: { values: v, claims: rows.map((row) => row.claim) } })
            });
          }),
          T('read-table', '그림그래프를 표로 나타내기', '①65 ②70 ③36 심28', (d) => {
            const s = d.pick(SETS), v = tens(d), [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort();
            return M(`${lead(s)} 그림그래프를 표로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: v[a] }, { label: LABELS[1], answer: v[b] }], {
              figure: graphOf(s, v, [10, 1]) + table([s.head[0], `${s.noun}(${s.each})`], s.names.map((name, i) => [name, i === a ? box(LABELS[0]) : i === b ? box(LABELS[1]) : v[i]])),
              explain: `${josa(s.names[a], '은/는')} ${v[a]}${s.each}, ${josa(s.names[b], '은/는')} ${v[b]}${s.each}이다.`, facts: facts(v, { calc: [[String(v[a]), 0], [String(v[b]), 1]] })
            });
          })
        ]
      },
      {
        id: 'draw', title: '그림그래프로 나타내기', standard: DATA,
        types: [
          T('draw-count', '한 항목을 나타내는 데 필요한 그림의 수', '①44 ②57 ③51 심59', (d) => {
            const v = d.until(() => d.int(21, 68), (x) => x % 10 >= 2);
            return M(`10명을 나타내는 큰 그림과 1명을 나타내는 작은 그림으로 학생 ${v}명을 나타내려고 한다. 큰 그림과 작은 그림은 각각 몇 개 필요한가?`, [{ label: '큰 그림', answer: Math.floor(v / 10), unit: '개' }, { label: '작은 그림', answer: v % 10, unit: '개' }], {
              explain: `${josa(v, '은/는')} 10이 ${Math.floor(v / 10)}개, 1이 ${v % 10}개인 수이다.`, facts: { calc: [[`(${v}-${v}%10)/10`, 0], [`${v}%10`, 1]] }
            });
          }),
          T('draw-five', '5를 나타내는 그림을 써서 나타내기', '①48 ②62 ③54·55 심64', (d) => {
            const v = d.until(() => d.int(16, 49), (x) => x % 10 >= 6 && x % 10 <= 9);
            return M(`10명, 5명, 1명을 나타내는 세 가지 그림으로 학생 ${v}명을 나타내려고 한다. 그림의 수를 가장 적게 하려면 세 가지 그림은 각각 몇 개 필요한가?`, [{ label: '10명 그림', answer: Math.floor(v / 10), unit: '개' }, { label: '5명 그림', answer: 1, unit: '개' }, { label: '1명 그림', answer: v % 5, unit: '개' }], {
              explain: `${v} = ${Math.floor(v / 10) * 10} + 5 + ${v % 5}이므로 10명 그림 ${Math.floor(v / 10)}개, 5명 그림 1개, 1명 그림 ${v % 5}개로 나타낸다.`,
              facts: { calc: [[`(${v}-${v}%10)/10`, 0], [`(${v}%10-${v}%10%5)/5`, 1], [`${v}%10%5`, 2]], unseen: [10, 5] }
            });
          }),
          T('draw-unit', '그림의 단위 정하기', '①42 ②55·56 ③49·50 심57·58', (d) => {
            const scale = d.pick([10, 100]), v = d.until(() => [0, 1, 2, 3].map(() => d.int(12, 48) * scale / 10), (x) => new Set(x).size === 4 && x.some((y) => (y / (scale / 10)) % 10 !== 0)), each = scale === 10 ? '명' : '상자';
            const options = d.shuffle([[scale, scale / 10], [scale * 10, scale], [scale / 10, scale / 100 >= 1 ? scale / 100 : null], [scale * 10, scale / 10]]);
            const say = ([big, low]) => (low === null ? `${big}${each}을 나타내는 그림 한 가지` : `${big}${each}, ${low}${each}을 나타내는 그림 두 가지`).replace(/(\d+)(명|상자)을/g, (m, n, w) => josa(n + w, '을/를'));
            return C('표의 수를 그림그래프로 나타내려고 한다. 그림의 단위로 가장 알맞은 것은?', options.map(say), options.findIndex(([big, low]) => big === scale && low === scale / 10), {
              figure: table(['마을', scale === 10 ? '학생 수(명)' : '사과 생산량(상자)'], ['가 마을', '나 마을', '다 마을', '라 마을'].map((name, i) => [name, v[i]])),
              explain: `표의 수는 ${scale}이 몇 개, ${scale / 10}이 몇 개인 수이다. ${scale}${each}과 ${scale / 10}${each}을 나타내는 그림으로 나타내면 그림의 수가 알맞다.`.replace(`${scale}이`, josa(scale, '이/가')).replace(`${scale / 10}이`, josa(scale / 10, '이/가')).replace(`${scale}${each}과`, josa(scale + each, '과/와')).replace(`${scale / 10}${each}을`, josa(scale / 10 + each, '을/를')),
              facts: { scale: { values: v, options } }
            });
          }),
          T('draw-wrong', '표와 다르게 나타낸 항목 찾기', '③57 심66', (d) => {
            const s = d.pick(SETS), v = tens(d), k = d.int(0, 3), wrong = v.slice();
            wrong[k] = v[k] + (v[k] >= 50 ? -10 : 10);      // 큰 그림을 하나 더(덜) 그린 줄
            return C(`표를 보고 그림그래프로 나타내었다. 표와 다르게 나타낸 ${josa(s.place, '은/는')}?`, s.names, k, {
              figure: table([s.head[0], `${s.noun}(${s.each})`], s.names.map((name, i) => [name, v[i]])) + graphOf(s, wrong, [10, 1]),
              explain: `${josa(s.names[k], '은/는')} 표에서 ${v[k]}${s.each}인데 그림그래프에는 ${wrong[k]}${s.each}으로 나타내었다.`.replace(`${wrong[k]}${s.each}으로`, josa(wrong[k] + s.each, '으로/로')),
              facts: { picto: { shown: wrong }, mismatch: { table: v, drawn: wrong } }
            });
          })
        ]
      },
      {
        id: 'fill', title: '그림이 빠진 항목 구하기', standard: DATA,
        types: [
          T('fill-total', '전체 수로 빠진 항목 구하기', '①30 ②63 ③43 심70', (d) => {
            const s = d.pick(SETS), v = tens(d, (x) => sum(x) <= 150), k = d.int(0, 3), shown = v.map((x, i) => (i === k ? null : x));
            return N(`${lead(s)} 네 ${s.place}의 ${josa(s.noun, '이/가')} 모두 ${sum(v)}${s.each}일 때, ${josa(of(s, k), '은/는')} 몇 ${s.each}인가?`, v[k], {
              unit: s.each, figure: graphOf(s, shown, [10, 1]), explain: `전체에서 나머지 세 곳의 수를 뺀다. ${sum(v)} - ${v.filter((_, i) => i !== k).join(' - ')} = ${v[k]}`,
              facts: facts(shown, { calc: [[`${sum(v)}-${v.filter((_, i) => i !== k).join('-')}`, 0]] })
            });
          }),
          T('fill-more', '「몇 더 많다」로 빠진 항목 구하기', '①32 ②65 심72', (d) => {
            const s = d.pick(SETS), v = tens(d), [k, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2), shown = v.map((x, i) => (i === k ? null : x)), gap = Math.abs(v[k] - v[j]), more = v[k] > v[j];
            return N(`${lead(s)} ${josa(of(s, k), '이/가')} ${of(s, j)}보다 ${gap}${s.each} 더 ${more ? '많을' : '적을'} 때, ${josa(of(s, k), '은/는')} 몇 ${s.each}인가?`, v[k], {
              unit: s.each, figure: graphOf(s, shown, [10, 1]), explain: `${josa(of(s, j), '은/는')} ${v[j]}${s.each}이다. ${v[j]} ${more ? '+' : '-'} ${gap} = ${v[k]}`, facts: facts(shown, { calc: [[`${v[j]}${more ? '+' : '-'}${gap}`, 0]] })
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
