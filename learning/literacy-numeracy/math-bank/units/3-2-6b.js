// 3학년 2학기 6단원 그림그래프(자료의 정리) — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(32개 문서)의 문제 꼴 81개와
// 기본 자료의 꼴을 참고하되, 그대로 옮기지 않고 꼴마다 따져서 냈다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 그림의 수가 많으면 수도 많다고 여긴다(큰 그림 3개보다 큰 그림 1개와 작은 그림 9개가 더 많다고 본다).
//   ② 그림이 나타내는 수를 보지 않고 큰 그림은 10, 작은 그림은 1이라고 읽는다.
// 그다음에 그림그래프에서 읽은 수로 한 번 더 셈해야 하는 문제를 실었다(2배 조건으로 빠진 항목을 구해 전체 합, 읽은 수를 똑같이 묶기, 읽은 수의 몇 배).
//
// 뺀 것과 까닭
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      4학년 1학기 「곱셈과 나눗셈」: 두·세 자리 수로 나누어야 하는 「몇 배인가」, 네 자리 수를 나누는 꼴
//      4학년 「큰 수」에 기대는 것: 합계가 네 자리 수를 넘어 받아올림·받아내림을 하는 표, 1000·100 단위 그림그래프의 합
//  - 조건 풀이가 어려움의 대부분: 합과 차로 빈 항목 둘, 합과 배로 빈 항목 둘, 순서 조건으로 수 좁히기, 그림 수에서 단위 셋을 거꾸로 맞히기, 글 속 조건으로 표 채우기
//  - 작도·서술형: 그림그래프 그리기, 알 수 있는 내용·좋은 점·까닭 쓰기, 무엇을 고르면 좋은지 이유 쓰기
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, pictograph, N, C } = B.kit;
  const DATA = '4수04-01';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const SETS = [
    { head: ['마을', '학생 수'], names: ['가 마을', '나 마을', '다 마을', '라 마을'], each: '명', intro: '마을별 학생 수를', noun: '학생 수', place: '마을' },
    { head: ['과수원', '사과 생산량'], names: ['가 과수원', '나 과수원', '다 과수원', '라 과수원'], each: '상자', intro: '과수원별 사과 생산량을', noun: '사과 생산량', place: '과수원' }
  ];
  const graphOf = (s, values, units) => pictograph(s.head, s.names.map((name, i) => [name, values[i]]), units, s.each);
  const lead = (s) => `${s.intro} 조사하여 나타낸 그림그래프이다.`;
  const of = (s, i) => `${s.names[i]}의 ${s.noun}`;
  const sum = (list) => list.reduce((x, y) => x + y, 0);
  const facts = (values, more) => Object.assign({ picto: { shown: values }, unseen: values.filter((v) => v !== null) }, more || {});

  B.addGroup('3-2-6', {
    id: 'hard', title: '단원 종합', standard: DATA,
    types: [
      H('h-symbols', '그림의 수와 나타내는 수', '그림 개수에 속지 않고 견주기(심화 31)', (d) => {
        // 큰 그림 3개(30)가 큰 그림 1개와 작은 그림 9개(19)보다 많다
        const s = d.pick(SETS), top = d.int(3, 5);
        const v = d.shuffle([top * 10 + d.int(0, 1), (top - 2) * 10 + 9, (top - 1) * 10 + d.int(6, 7), (top - 1) * 10 + d.int(2, 4)]), symbols = v.map((x) => Math.floor(x / 10) + (x % 10));
        return C(`${lead(s)} ${josa(s.noun, '이/가')} 가장 많은 ${josa(s.place, '은/는')}?`, s.names, v.indexOf(Math.max(...v)), {
          figure: graphOf(s, v, [10, 1]), explain: `그림의 수가 아니라 그림이 나타내는 수를 비교한다. 큰 그림의 수가 가장 많은 ${josa(s.names[v.indexOf(Math.max(...v))], '이/가')} ${Math.max(...v)}${s.each}으로 가장 많다.`.replace(`${Math.max(...v)}${s.each}으로`, josa(Math.max(...v) + s.each, '으로/로')),
          facts: facts(v, { choose: { exprs: v.map(String), rule: 'max' }, symbolTrap: { values: v, symbols } })
        });
      }),
      H('h-double', '2배 조건으로 빠진 항목을 구해 전체 수 구하기', '「2배」로 빈 항목 구하기(심화 73, 기본 ②66)', (d) => {
        const s = d.pick(SETS), [a, b, e] = d.until(() => [d.int(1, 2) * 10 + d.int(1, 4), d.int(2, 5) * 10 + d.int(0, 8), d.int(2, 5) * 10 + d.int(0, 8)], ([x, y, z]) => new Set([x, x * 2, y, z]).size === 4 && x + x * 2 + y + z <= 160);
        const v = [a, b, a * 2, e], shown = [a, b, null, e];
        return N(`${lead(s)} ${josa(of(s, 2), '이/가')} ${of(s, 0)}의 2배일 때, 네 ${s.place}의 ${josa(s.noun, '은/는')} 모두 몇 ${s.each}인가?`, sum(v), {
          unit: s.each, figure: graphOf(s, shown, [10, 1]), explain: `${josa(s.names[0], '은/는')} ${a}${s.each}이므로 ${josa(s.names[2], '은/는')} ${a} × 2 = ${a * 2}(${s.each})이다. ${v.join(' + ')} = ${sum(v)}`,
          facts: facts(shown, { calc: [[`${a}+${b}+${a}*2+${e}`, 0]] })
        });
      }),
      H('h-pack', '읽은 수를 똑같이 묶기', '몇씩 담기(심화 80, 기본 ②51 ③42)', (d) => {
        const s = SETS[1], [v, k, by] = d.until(() => { const list = [0, 1, 2, 3].map(() => d.int(2, 5) * 10 + d.int(0, 8)); return [list, d.int(0, 3), d.int(3, 8)]; }, ([list, i, n]) => new Set(list).size === 4 && list[i] % n === 0 && list.filter((x) => x % n === 0).length === 1);
        return N(`${lead(s)} ${s.names[k]}에서 생산한 사과를 가게 한 곳에 ${by}상자씩 똑같이 나누어 보내려고 한다. 가게 몇 곳에 보낼 수 있는가?`, v[k] / by, {
          unit: '곳', figure: graphOf(s, v, [10, 1]), explain: `${josa(s.names[k], '은/는')} ${v[k]}상자이다. ${v[k]} ÷ ${by} = ${v[k] / by}`, facts: facts(v, { calc: [[`${v[k]}/${by}`, 0]] })
        });
      }),
      H('h-times', '읽은 수의 몇 배 구하기', '하나에 몇씩(심화 81, 기본 ③41)', (d) => {
        const s = SETS[0], v = d.until(() => [0, 1, 2, 3].map(() => d.int(1, 4) * 10 + d.int(1, 8)), (x) => new Set(x).size === 4), k = d.int(0, 3), each = d.int(3, 6);
        return N(`${lead(s)} ${s.names[k]}의 학생 모두에게 공책을 ${each}권씩 나누어 주려고 한다. 필요한 공책은 모두 몇 권인가?`, v[k] * each, {
          unit: '권', figure: graphOf(s, v, [10, 1]), explain: `${josa(s.names[k], '은/는')} ${v[k]}명이다. ${v[k]} × ${each} = ${v[k] * each}`, facts: facts(v, { calc: [[`${v[k]}*${each}`, 0]] })
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
