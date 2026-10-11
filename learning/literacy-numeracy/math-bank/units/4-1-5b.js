// 4학년 1학기 5단원 막대그래프 — 알 수 있는 것, 빠진 막대, 눈금 한 칸의 크기 알아내기, 두 그래프의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3의 「해석하고 판단하기」「빠진 막대」「조건으로 눈금 알아내기」「두 막대그래프」 묶음, 심화꼴 76꼴)을 꼴마다 따져서 실었다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 눈금 한 칸을 언제나 1로 읽는다(큰 눈금 위의 칸을 1씩 센다).
//   ② 막대의 칸 수를 그대로 수로 읽는다(막대가 3칸 더 길면 3명 더 많다고 한다).
//   ③ 막대가 길면 언제나 수가 많다고 여겨, 눈금 한 칸의 크기가 다른 두 그래프를 길이로만 비교한다.
//   ④ 표에서 잘 보이는 것(정확한 수·합계)과 막대그래프에서 잘 보이는 것(많고 적음)을 뒤바꾼다. 막대그래프에서는 수를 알 수 없다고 여긴다.
//   ⑤ 「가는 나의 2배」에서 어느 쪽이 기준인지 가리지 않고 보이는 수에 2를 곱한다.
//   ⑥ 기록(걸린 시간)에서도 「더 빠르다」를 더 큰 수로 여긴다.
//   ⑦ 눈금 한 칸이 2일 때 홀수를 나타낼 자리(반 칸)를 모른다.
// 그다음에 두 번 넘게 계산해야 하는 문제를 실었다(합계·몇 배 조건으로 빠진 막대의 칸 수 구하기, 한 항목의 수로 눈금 한 칸을 알아내어 다른 항목 구하기,
// 두 그래프·두 막대를 함께 읽어 더하고 비교하기).
//
// 뺀 것과 까닭(꼴 번호는 싣기_대조표.md에 모두 적었다)
//  - 방정식 꼴·조건 풀이가 어려움의 대부분인 것: 합과 차로 빈 항목 둘(③46 심36), 합과 배로 빈 항목 둘(②62 심37), 조건을 이어 풀어야 정해지는 것(②63 심35 심38 심39),
//    이야기 속 조건으로 그래프 완성하기(②64), 두 그래프의 합을 비교하기 전에 한 막대를 조건으로 구해야 하는 부분(①55)
//  - 중학교 내용: 두 그래프 사이의 관계 쓰기(심66)
//  - 서술형: 알 수 있는 내용·까닭·의견 쓰기(①43 ②78 ③69 심70·71 가운데 고르기로 바꿀 수 없는 것), 틀린 문장을 고쳐 쓰기(③40)
//  - 작도: 두 자료를 한 그래프에 그리기(②72), 두 그래프를 더해 새 그래프 그리기(심56의 그리는 부분)
//  - 점수를 문제 수로 되돌리는 꼴(②30의 변형)은 곱하고 빼고 다시 나누는 셈이 어려움의 대부분이라 뺐다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, table, lines, barChart, N, M, C } = B.kit;
  const DRAW = '4수04-01', READ = '4수04-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const sum = (list) => list.reduce((x, y) => x + y, 0);
  const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const MAJOR = { 5: 2, 50: 2 };
  // 조사한 것(4-1-5a.js와 같은 틀). all: 항목, unit: 수 뒤의 낱말, title: 그래프에 적는 항목 쪽 이름, kind: 항목을 가리키는 말(없으면 title),
  // axis: 수 쪽이 나타내는 것, intro: 머리말, noun: 항목마다의 수를 가리키는 말, whole: 네 항목을 통틀어 가리키는 말, one(n): 한 항목의 수, tag(n): 글에 적는 항목 이름, fixed: 항목의 차례를 섞지 않는다.
  const liked = (title, all) => ({ all, unit: '명', title, axis: '학생 수', intro: `학생들이 좋아하는 ${josa(title, '을/를')}`, noun: '좋아하는 학생 수', one: (n) => `${josa(n, '을/를')} 좋아하는 학생 수` });
  const GANA = ['가', '나', '다', '라', '마'];
  const SETS = {
    sport: liked('운동', ['축구', '야구', '농구', '피구', '수영']),
    fruit: liked('과일', ['사과', '포도', '딸기', '수박', '참외']),
    snack: liked('간식', ['김밥', '떡볶이', '피자', '치킨', '만두']),
    place: { all: ['과학관', '미술관', '박물관', '동물원', '수목원'], unit: '명', title: '장소', axis: '학생 수', intro: '학생들이 체험 학습으로 가고 싶어 하는 장소를', noun: '가고 싶어 하는 학생 수', one: (n) => `${n}에 가고 싶어 하는 학생 수` },
    town: { all: GANA, fixed: true, unit: '명', title: '마을', axis: '학생 수', intro: '마을별 초등학생 수를', noun: '초등학생 수', whole: '네 마을의 초등학생 수', one: (n) => `${n} 마을의 초등학생 수`, tag: (n) => `${n} 마을` },
    tree: { all: GANA, fixed: true, unit: '그루', title: '마을', axis: '나무 수', intro: '마을별 심은 나무 수를', noun: '심은 나무 수', whole: '네 마을에서 심은 나무 수', one: (n) => `${n} 마을에서 심은 나무 수`, tag: (n) => `${n} 마을` },
    farm: { all: GANA, fixed: true, unit: '상자', title: '과수원', axis: '생산량', intro: '과수원별 사과 생산량을', noun: '사과 생산량', whole: '네 과수원의 사과 생산량', one: (n) => `${n} 과수원의 사과 생산량`, tag: (n) => `${n} 과수원` },
    jump: { all: ['월', '화', '수', '목', '금'], fixed: true, unit: '회', title: '요일', axis: '횟수', intro: '하린이가 요일별로 넘은 줄넘기 횟수를', noun: '줄넘기 횟수', one: (n) => `${n}요일의 줄넘기 횟수`, tag: (n) => `${n}요일` },
    can: { all: ['1반', '2반', '3반', '4반', '5반'], fixed: true, unit: '개', title: '반', axis: '빈 병의 수', intro: '반별로 모은 빈 병의 수를', noun: '모은 빈 병의 수', whole: '네 반에서 모은 빈 병의 수', one: (n) => `${n}에서 모은 빈 병의 수` },
    team: { all: ['1모둠', '2모둠', '3모둠', '4모둠'], fixed: true, unit: '개', title: '모둠', axis: '귤의 수', intro: '모둠별로 딴 귤의 수를', noun: '딴 귤의 수', one: (n) => `${n}에서 딴 귤의 수` },
    glass: { all: ['1반', '2반', '3반', '4반'], fixed: true, unit: '명', title: '반', axis: '학생 수', intro: '반별 안경을 쓴 학생 수를', noun: '안경을 쓴 학생 수', one: (n) => `${n}의 안경을 쓴 학생 수` },
    shelf: { all: ['동화책', '위인전', '만화책', '과학책', '시집'], unit: '권', title: '종류', kind: '책', axis: '책 수', intro: '학급 문고에 있는 책의 수를 종류별로', noun: '책 수', one: (n) => `${n}의 수` },
    run: { all: NAMES.slice(0, 5), unit: '초', title: '이름', kind: '학생', axis: '기록', intro: '학생별 50 m 달리기 기록을', noun: '달리기 기록', one: (n) => `${nick(n)}의 달리기 기록` },
    weather: { all: ['맑음', '흐림', '비', '눈'], fixed: true, unit: '일', title: '날씨', axis: '날수', intro: '어느 달의 날씨를', noun: '날수', one: (n) => `${n}인 날수` },
    buy: { all: ['연필', '지우개', '공책', '풀', '가위'], unit: '개', title: '학용품', axis: '산 수', intro: '지우가 문구점에서 산 학용품의 수를', noun: '산 수', one: (n) => `산 ${n}의 수` }
  };
  const pick = (d, key, n) => { const s = SETS[key]; return Object.assign({ kind: s.title, tag: (x) => x }, s, { names: s.fixed ? s.all.slice(0, n) : d.shuffle(s.all).slice(0, n) }); };
  const lead = (c, as) => `${c.intro} 조사하여 나타낸 ${as || '막대그래프'}이다.`;
  const chart = (c, v, o) => barChart(c.names, v, Object.assign({ unit: c.unit, title: c.title, major: MAJOR[(o || {}).step] || 5 }, o || {}));
  const tab = (c, v, extra) => table([c.kind, `${c.axis}(${c.unit})`], c.names.map((n, i) => [c.tag(n), v[i]]).concat(extra || []));
  const nums = (d, n, lo, hi, step, ok) => d.until(() => Array.from({ length: n }, () => d.int(lo, hi) * (step || 1)), (v) => new Set(v).size === n && (!ok || ok(v)));
  const U = (c, n, pair) => (pair ? josa(n + c.unit, pair) : n + c.unit);
  const told = (c, v, i) => `${josa(c.tag(c.names[i]), '은/는')} ${U(c, v[i])}`;
  const top = (v) => Math.max(...v), low = (v) => Math.min(...v);
  // 맨 끝 눈금의 값: 막대가 빠진 그래프도 빠진 막대까지 그릴 수 있는 높이로 그린다.
  const roof = (v, step) => { const unit = (step || 1) * (MAJOR[step] || 5); return Math.ceil(top(v.filter((x) => x != null)) / unit) * unit; };
  const hide = (v, ...at) => v.map((x, i) => (at.includes(i) ? null : x));
  // 그래프 위에 이름을 붙인다(두 그래프를 함께 놓을 때).
  const cap = (label, html) => `<div style="display:grid;gap:2px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${label}</div>${html}</div>`;
  // 같은 눈금으로 그린 두 막대그래프
  const both = (c, labels, v1, v2, step) => { const o = { step: step || 1, top: roof(v1.concat(v2), step) }; return cap(labels[0], chart(c, v1, o)) + cap(labels[1], chart(c, v2, o)); };
  const WEEKS = ['지난주', '이번 주'], ROOMS = ['가 반', '나 반'];
  const WEEK = '하린이가 지난주와 이번 주에 요일별로 넘은 줄넘기 횟수를 조사하여 나타낸 막대그래프이다.';
  const roomLead = (c) => `가 반과 나 반 ${c.intro} 조사하여 나타낸 막대그래프이다.`;
  // 한 항목에 남학생·여학생 두 막대를 나란히 그린 그래프
  const pairBars = (c, boys, girls) => chart(c, boys, { second: girls, legend: ['남학생', '여학생'], top: roof(boys.concat(girls), 1) });
  const pairLead = (c) => `${c.intro} 남학생과 여학생으로 나누어 조사하여 나타낸 막대그래프이다.`;
  // 눈금에 수를 적지 않은 막대그래프(한 항목의 수로 눈금 한 칸의 크기를 알아내는 문제). cells: 막대의 칸 수, marks: { 5: '㉠' } 처럼 그 칸째 눈금에 기호를 적는다.
  // 엔진의 막대그래프에서 눈금의 수만 지운다. 그림 설명에는 눈금 한 칸의 크기 대신 막대마다 칸 수를 적는다.
  function bare(c, cells, marks) {
    const m = marks || {}, floor = marks ? 15 : 10, said = c.names.map((n, i) => `${n} ${cells[i]}칸`).join(', ') + Object.keys(m).map((t) => `, ${m[t]}은 ${t}칸째 눈금`).join('');
    return barChart(c.names, cells, { unit: c.unit, title: c.title, top: Math.max(floor, roof(cells, 1)) })
      .replace(/(<text class="mb-axis-label"[^>]*>)(\d+)(<\/text>)/g, (all, head, n, tail) => (m[n] ? head.replace('font-size:11px', 'font-size:14px') + m[n] + tail : ''))
      .replace(/aria-label="[^"]*"/, `aria-label="막대그래프: 세로 눈금에 수를 적지 않았다. ${said}"`);
  }
  const BARE = '세로 눈금에는 수가 적혀 있지 않다.';

  B.addTypes('4-1-5', 'judge', [
    T('judge-wrong', '막대그래프를 보고 잘못 말한 것 찾기', '①42 ②73 ③39', (d) => {
      const c = pick(d, d.pick(['sport', 'snack']), 4), v = nums(d, 4, 3, 13), order = [0, 1, 2, 3].sort((p, q) => v[q] - v[p]), t = d.int(0, 3), n = c.names;
      const [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => v[q] - v[p]), k = d.int(0, 3);
      const most = order[t === 0 ? 1 : 0], least = order[t === 1 ? 2 : 3], [hi, lo] = t === 2 ? [b, a] : [a, b], said = v[k] + (t === 3 ? d.pick([-1, 1]) : 0);
      const rows = [
        [`${josa(c.noun, '이/가')} 가장 많은 ${josa(c.kind, '은/는')} ${n[most]}이다.`, ['most', most]],
        [`${josa(c.noun, '이/가')} 가장 적은 ${josa(c.kind, '은/는')} ${n[least]}이다.`, ['least', least]],
        [`${josa(c.one(n[hi]), '은/는')} ${c.one(n[lo])}보다 많다.`, ['more', hi, lo]],
        [`${josa(c.one(n[k]), '은/는')} ${U(c, said)}이다.`, ['value', k, said]]
      ];
      return C(`${lead(c)} 막대그래프에 대한 설명으로 옳지 않은 것은?`, rows.map((r) => r[0]), t, {
        figure: chart(c, v), explain: `막대가 긴 것부터 차례로 쓰면 ${order.map((i) => `${n[i]} ${U(c, v[i])}`).join(', ')}이다.`,
        facts: { truth: rows.map((_, i) => i !== t), want: false, pictoTalk: { values: v, claims: rows.map((r) => r[1]) } }
      });
    }),
    T('judge-right', '막대그래프를 보고 알 수 있는 내용', '①43 ②74 ②78 ③37·38 ③69 심67 심71', (d) => {
      const c = pick(d, d.pick(['fruit', 'snack']), 4), t = d.int(0, 3), n = c.names, [b, m] = d.until(() => [d.int(2, 4), d.int(2, 3)], ([x, y]) => x * y <= 12), a = b * m;
      const [p, q] = d.until(() => [d.int(3, 13), d.int(3, 13)], (r) => new Set(r.concat([a, b])).size === 4 && r[0] > r[1]), v = d.shuffle([a, b, p, q]), at = (x) => n[v.indexOf(x)], k = d.int(0, 3);
      const gap = p - q + (t === 0 ? 0 : 1), times = m + (t === 1 ? 0 : 1), total = sum(v) - (t === 2 ? 0 : b), one = v[k] + (t === 3 ? 0 : 1);
      const rows = [
        [`${josa(c.one(at(p)), '은/는')} ${c.one(at(q))}보다 ${gap}명 더 많다.`, [`${p}-${q}`, gap]],
        [`${josa(c.one(at(a)), '은/는')} ${c.one(at(b))}의 ${times}배이다.`, [`${a}/${b}`, times]],
        [`조사한 학생은 모두 ${total}명이다.`, [v.join('+'), total]],
        [`${josa(c.one(n[k]), '은/는')} ${one}명이다.`, [String(v[k]), one]]
      ];
      return C(`${lead(c)} 막대그래프를 보고 알 수 있는 내용으로 옳은 것은?`, rows.map((r) => r[0]), t, {
        figure: chart(c, v), explain: `${n.map((x, i) => `${x} ${v[i]}명`).join(', ')}이다. ${p} - ${q} = ${p - q}, ${a} ÷ ${b} = ${m}이고, 조사한 학생은 모두 ${v.join(' + ')} = ${sum(v)}(명)이다.`,
        facts: { claimed: rows.map((r) => r[1]), claimedWant: true }
      });
    }),
    T('judge-unknown', '막대그래프를 보고 알 수 없는 것', '①44 ②75 ②80 ③41', (d) => {
      const c = pick(d, d.pick(['sport', 'fruit']), 4), v = nums(d, 4, 3, 12), [k, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2), hidden = `${josa(c.names[j], '을/를')} 좋아하는 여학생 수`;
      const rows = d.shuffle([[c.one(c.names[k]), true], [`${josa(c.noun, '이/가')} 가장 많은 ${c.kind}`, true], ['조사한 학생 수', true], [hidden, false]]);
      return C(`${lead(c)} 이 막대그래프를 보고 알 수 없는 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        figure: chart(c, v), explain: `막대그래프에는 ${c.kind}별 ${josa(c.noun, '이/가')} 나타나 있다. 남학생과 여학생으로 나누어 조사하지 않았으므로 ${josa(hidden, '은/는')} 알 수 없다.`, facts: { truth: rows.map((r) => r[1]), want: false }
      });
    }),
    T('judge-most', '가장 많은 것으로 정하기', '①45 ②76 ③70·71 심69·70', (d) => {
      const c = pick(d, 'snack', 5), v = nums(d, 5, 3, 14, 1, (x) => { const s = x.slice().sort((p, q) => q - p); return s[0] - s[1] <= 2; }), hi = v.indexOf(top(v));
      return C(`${lead(c)} 학급 잔치에 간식을 한 가지만 준비하려고 한다. 좋아하는 간식을 먹게 되는 학생이 가장 많도록 하려면 어떤 간식을 준비해야 하는가?`, c.names, hi, {
        figure: chart(c, v), explain: `가장 많은 학생이 좋아하는 간식을 준비한다. 막대가 가장 긴 ${josa(c.names[hi], '을/를')} ${v[hi]}명이 좋아한다.`, facts: { choose: { exprs: v.map(String), rule: 'max' } }
      });
    }),
    T('judge-least', '가장 적은 것으로 정하기', '②77 ③72 심69', (d) => {
      const c = pick(d, 'shelf', 5), v = nums(d, 5, 3, 14, 2, (x) => { const s = x.slice().sort((p, q) => p - q); return s[1] - s[0] <= 4; }), lo = v.indexOf(low(v));
      return C(`${lead(c)} 여러 종류의 책을 고르게 갖추려고 한다. 책을 한 종류만 더 산다면 어떤 책을 사야 하는가?`, c.names, lo, {
        figure: chart(c, v, { step: 2 }), explain: `책 수가 가장 적은 종류를 더 산다. 막대가 가장 짧은 ${josa(c.names[lo], '이/가')} ${v[lo]}권으로 가장 적다.`, facts: { choose: { exprs: v.map(String), rule: 'min' } }
      });
    }),
    T('judge-top2', '많은 것부터 둘 정하기', '②76 심69', (d) => {
      const c = pick(d, 'place', 4), v = nums(d, 4, 3, 13), order = [0, 1, 2, 3].sort((p, q) => v[q] - v[p]), right = PAIRS.find((p) => p.includes(order[0]) && p.includes(order[1]));
      const shown = d.shuffle(d.shuffle(PAIRS.filter((p) => p !== right)).slice(0, 3).concat([right]));
      return C(`${lead(c)} 가고 싶어 하는 학생이 많은 곳부터 두 곳을 골라 체험 학습을 가려고 한다. 체험 학습을 갈 두 곳은?`, shown.map(([i, j]) => `${c.names[i]}, ${c.names[j]}`), shown.indexOf(right), {
        figure: chart(c, v), explain: `막대가 긴 것부터 차례로 쓰면 ${order.map((i) => `${c.names[i]} ${v[i]}명`).join(', ')}이다. 앞의 두 곳을 고른다.`,
        facts: { choose: { exprs: shown.map(([i, j]) => `${v[i]}+${v[j]}`), rule: 'max' } }
      });
    }),
    T('judge-fast', '값이 작을수록 좋은 기록에서 가장 빠른 것', '②18 ③73 심17 심69', (d) => {
      const c = pick(d, 'run', 5), v = nums(d, 5, 8, 14, 1, (x) => { const s = x.slice().sort((p, q) => p - q); return s[1] - s[0] === 1; }), lo = v.indexOf(low(v));
      return C(`${lead(c)} 가장 빨리 달린 학생은?`, c.names, lo, {
        figure: chart(c, v), explain: `걸린 시간이 짧을수록 빨리 달린 것이다. 막대가 가장 짧은 ${name(c.names[lo], '이/가')} ${v[lo]}초로 가장 빨리 달렸다.`, facts: { choose: { exprs: v.map(String), rule: 'min' } }
      });
    }),
    T('judge-faster', '기록이 더 좋은 사람의 수', '②18 심17', (d) => {
      const c = pick(d, 'run', 5), [v, k] = d.until(() => [nums(d, 5, 8, 14), d.int(0, 4)], ([x, i]) => { const hit = x.filter((y) => y < x[i]).length; return hit >= 1 && hit <= 3; });
      const hits = c.names.filter((_, i) => v[i] < v[k]);
      return N(`${lead(c)} ${nick(c.names[k])}보다 더 빨리 달린 학생은 모두 몇 명인가?`, hits.length, {
        unit: '명', figure: chart(c, v), explain: `걸린 시간이 짧을수록 빨리 달린 것이다. ${nick(c.names[k])}(${v[k]}초)보다 막대가 짧은 학생은 ${hits.join(', ')}의 ${hits.length}명이다.`,
        facts: { choose: { exprs: v.filter((_, i) => i !== k).map(String), rule: 'countBelow', target: v[k] } }
      });
    }),
    T('judge-life', '물음에 맞는 항목을 골라 더하기', '①46 ②29', (d) => {
      const c = pick(d, 'weather', 4), v = d.until(() => { const x = [d.int(9, 14), d.int(5, 9), d.int(3, 8)]; return x.concat([30 - sum(x)]); }, (x) => x[3] >= 1 && x[3] <= 6 && new Set(x).size === 4);
      return N('어느 달의 날씨를 조사하여 나타낸 막대그래프이다. 비나 눈이 오지 않은 날은 모두 며칠인가?', v[0] + v[1], {
        unit: '일', figure: chart(c, v), explain: `비나 눈이 오지 않은 날은 맑은 날과 흐린 날이다. ${v[0]} + ${v[1]} = ${v[0] + v[1]}`, facts: { calc: [[`${v[0]}+${v[1]}`, 0]] }
      });
    })
  ]);

  B.addTypes('4-1-5', 'miss', [
    T('miss-total', '전체 수로 빠진 항목 구하기', '①38 ②57 ③44 심30', (d) => {
      const c = pick(d, d.pick(['place', 'fruit']), 4), v = nums(d, 4, 3, 12), k = d.int(0, 3), total = sum(v), rest = v.filter((_, i) => i !== k);
      return N(`${lead(c)} 조사한 학생이 모두 ${total}명일 때, ${josa(c.one(c.names[k]), '은/는')} 몇 명인가?`, v[k], {
        unit: '명', figure: chart(c, hide(v, k), { top: roof(v) }), explain: `전체에서 나머지 세 막대의 수를 뺀다. ${total} - ${rest.join(' - ')} = ${v[k]}`, facts: { calc: [[`${total}-${rest.join('-')}`, 0]] }
      });
    }),
    T('miss-times', '「몇 배」로 빠진 항목 구하기', '①36 ②59 심33', (d) => {
      const c = pick(d, 'tree', 4), [b, m] = d.until(() => [d.int(2, 5), d.int(2, 3)], ([x, y]) => x * y <= 13);
      const v = d.until(() => d.shuffle([b, b * m, d.int(2, 13), d.int(2, 13)]), (x) => new Set(x).size === 4).map((x) => x * 2), k = v.indexOf(b * m * 2), j = v.indexOf(b * 2);
      return N(`${lead(c)} ${josa(c.one(c.names[k]), '이/가')} ${c.one(c.names[j])}의 ${m}배일 때, ${josa(c.one(c.names[k]), '은/는')} 몇 그루인가?`, v[k], {
        unit: '그루', figure: chart(c, hide(v, k), { step: 2, top: roof(v, 2) }), explain: `${told(c, v, j)}이다. ${v[j]} × ${m} = ${v[k]}`, facts: { calc: [[`${v[j]}*${m}`, 0]] }
      });
    }),
    T('miss-gap', '「몇 더 많다(적다)」로 빠진 항목 구하기', '①37 ②59 심32', (d) => {
      const c = pick(d, 'jump', 5), v = nums(d, 5, 3, 14, 10), [k, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2), more = v[k] > v[j], g = Math.abs(v[k] - v[j]);
      return N(`${lead(c)} ${josa(c.one(c.names[k]), '이/가')} ${c.one(c.names[j])}보다 ${g}회 더 ${more ? '많을' : '적을'} 때, ${josa(c.one(c.names[k]), '은/는')} 몇 회인가?`, v[k], {
        unit: '회', figure: chart(c, hide(v, k), { step: 10, top: roof(v, 10) }), explain: `${told(c, v, j)}이다. ${v[j]} ${more ? '+' : '-'} ${g} = ${v[k]}`, facts: { calc: [[`${v[j]}${more ? '+' : '-'}${g}`, 0]] }
      });
    }),
    T('miss-cells', '수가 주어진 항목의 막대를 몇 칸으로 그리는가', '③45 심52', (d) => {
      const [step, key] = d.pick([[2, 'tree'], [5, 'can'], [10, 'jump'], [20, 'farm']]), c = pick(d, key, 4), v = nums(d, 4, 3, 13, step), k = d.int(0, 3);
      return N(`${lead(c)} ${josa(c.one(c.names[k]), '이/가')} ${U(c, v[k])}일 때, ${c.tag(c.names[k])}의 막대는 몇 칸으로 그려야 하는가?`, v[k] / step, {
        unit: '칸', figure: chart(c, hide(v, k), { step, top: roof(v, step) }), explain: `세로 눈금 ${MAJOR[step] || 5}칸이 ${U(c, (MAJOR[step] || 5) * step)}이므로 한 칸은 ${U(c, step)}이다. ${v[k]} ÷ ${step} = ${v[k] / step}`,
        facts: { calc: [[`${v[k]}/${step}`, 0]] }
      });
    }, { standard: DRAW })
  ]);

  B.addTypes('4-1-5', 'scale', [
    T('scale-given', '눈금 한 칸의 크기를 알려 줄 때 한 항목의 수', '①19', (d) => {
      const [step, key] = d.pick([[2, 'tree'], [5, 'can'], [10, 'town'], [20, 'farm']]), c = pick(d, key, 4), cells = nums(d, 4, 2, 12), k = d.int(0, 3);
      return N(`${lead(c)} ${BARE} 세로 눈금 한 칸이 ${U(c, step, '을/를')} 나타낼 때, ${josa(c.one(c.names[k]), '은/는')} 몇 ${c.unit}인가?`, step * cells[k], {
        unit: c.unit, figure: bare(c, cells), explain: `${c.tag(c.names[k])}의 막대는 ${cells[k]}칸이다. ${step} × ${cells[k]} = ${step * cells[k]}`, facts: { calc: [[`${step}*${cells[k]}`, 0]] }
      });
    }),
    T('scale-step', '한 항목의 수로 눈금 한 칸의 크기 알아내기', '②54 ③11 심40', (d) => {
      const [step, key] = d.pick([[2, 'tree'], [4, 'can'], [5, 'can'], [10, 'town'], [20, 'farm']]), c = pick(d, key, 4), cells = nums(d, 4, 2, 12, 1, (x) => x.some((y) => y >= 3 && y <= 9)), k = d.until(() => d.int(0, 3), (i) => cells[i] >= 3 && cells[i] <= 9);
      return N(`${lead(c)} ${BARE} ${josa(c.one(c.names[k]), '이/가')} ${U(c, step * cells[k])}일 때, 세로 눈금 한 칸은 몇 ${josa(c.unit, '을/를')} 나타내는가?`, step, {
        unit: c.unit, figure: bare(c, cells), explain: `${c.tag(c.names[k])}의 막대는 ${cells[k]}칸이고 ${U(c, step * cells[k], '을/를')} 나타낸다. ${step * cells[k]} ÷ ${cells[k]} = ${step}`, facts: { calc: [[`${step * cells[k]}/${cells[k]}`, 0]] }
      });
    }),
    T('scale-times', '눈금의 수 없이 칸 수로 몇 배인 항목 찾기', '심25', (d) => {
      const c = pick(d, d.pick(['sport', 'place']), 4), [a, m] = d.until(() => [d.int(2, 5), d.int(2, 3)], ([x, y]) => x * y <= 12);
      const cells = d.until(() => d.shuffle([a, a * m, a * m + d.pick([-1, 1]), d.int(2, 12)]), (x) => new Set(x).size === 4), k = cells.indexOf(a);
      return C(`${lead(c)} ${BARE} ${josa(c.noun, '이/가')} ${c.names[k]}의 ${m}배인 ${josa(c.kind, '은/는')}?`, c.names, cells.indexOf(a * m), {
        figure: bare(c, cells), explain: `눈금 한 칸의 크기를 몰라도, 막대의 칸 수가 ${m}배이면 수도 ${m}배이다. ${c.names[k]}의 막대는 ${a}칸이고 ${a} × ${m} = ${a * m}(칸)인 막대는 ${c.names[cells.indexOf(a * m)]}이다.`,
        facts: { choose: { exprs: cells.map(String), rule: 'equals', target: a * m } }
      });
    }),
    T('scale-fill', '한 항목의 수로 눈금에 알맞은 수 구하기', '①10 ③11', (d) => {
      const [step, key] = d.pick([[2, 'tree'], [4, 'can'], [10, 'town'], [20, 'farm']]), c = pick(d, key, 4), cells = nums(d, 4, 2, 12, 1, (x) => top(x) > 5 && x.some((y) => y % 5 !== 0 && y <= 9)), k = d.until(() => d.int(0, 3), (i) => cells[i] % 5 !== 0 && cells[i] <= 9);
      return M(`${lead(c)} 세로 눈금에 적을 수 가운데 두 곳을 ㉠, ㉡으로 나타내었다. ${josa(c.one(c.names[k]), '이/가')} ${U(c, step * cells[k])}일 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: 5 * step }, { label: LABELS[1], answer: 10 * step }], {
        figure: bare(c, cells, { 5: LABELS[0], 10: LABELS[1] }), explain: `${c.tag(c.names[k])}의 막대 ${cells[k]}칸이 ${U(c, step * cells[k])}이므로 한 칸은 ${step * cells[k]} ÷ ${cells[k]} = ${step}(${c.unit})이다. ㉠은 5칸째 눈금이므로 ${step} × 5 = ${5 * step}, ㉡은 10칸째 눈금이므로 ${step} × 10 = ${10 * step}이다.`,
        facts: { calc: [[`${step * cells[k]}/${cells[k]}*5`, 0], [`${step * cells[k]}/${cells[k]}*10`, 1]] }
      });
    })
  ]);

  B.addTypes('4-1-5', 'two', [
    T('two-read', '두 막대그래프에서 같은 항목 읽기', '①47', (d) => {
      const c = pick(d, 'jump', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 14, 10), nums(d, 4, 3, 14, 10)], ([x, y]) => x.every((p, i) => p !== y[i])), k = d.int(0, 3), day = c.tag(c.names[k]);
      return M(`${WEEK} 지난주 ${day}과 이번 주 ${day}의 줄넘기 횟수는 각각 몇 회인가?`, [{ label: '지난주', answer: v1[k], unit: '회' }, { label: '이번 주', answer: v2[k], unit: '회' }], {
        figure: both(c, WEEKS, v1, v2, 10), explain: `그래프마다 ${day}의 막대를 찾아 읽는다. 지난주는 ${v1[k]}회, 이번 주는 ${v2[k]}회이다.`, facts: { calc: [[String(v1[k]), 0], [String(v2[k]), 1]] }
      });
    }),
    T('two-most', '두 막대그래프에서 각각 가장 많은 항목', '①48 ②71 심61', (d) => {
      const c = pick(d, 'place', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 13), nums(d, 4, 3, 13)], ([x, y]) => x.indexOf(top(x)) !== y.indexOf(top(y))), m1 = v1.indexOf(top(v1)), m2 = v2.indexOf(top(v2));
      const rows = d.shuffle([[m1, m2], [m2, m1], [m1, m1], [m2, m2]]);
      return C(`${roomLead(c)} 두 반에서 ${josa(c.noun, '이/가')} 가장 많은 ${josa(c.kind, '을/를')} 바르게 쓴 것은?`, rows.map(([p, q]) => `가 반: ${c.names[p]}, 나 반: ${c.names[q]}`), rows.findIndex(([p, q]) => p === m1 && q === m2), {
        figure: both(c, ROOMS, v1, v2), explain: `그래프마다 가장 긴 막대를 찾는다. 가 반은 ${c.names[m1]}(${v1[m1]}명), 나 반은 ${c.names[m2]}(${v2[m2]}명)이다.`,
        // 가 반과 나 반에서 고른 두 막대의 수를 더한 값은 바르게 고른 보기에서 가장 크다.
        facts: { choose: { exprs: rows.map(([p, q]) => `${v1[p]}+${v2[q]}`), rule: 'max' } }
      });
    }),
    T('two-gap', '두 막대그래프에서 같은 항목의 차', '①49 ②69 심61', (d) => {
      const c = pick(d, 'jump', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 14, 10), nums(d, 4, 3, 14, 10)], ([x, y]) => x.every((p, i) => p !== y[i])), k = d.int(0, 3), day = c.tag(c.names[k]), up = v2[k] > v1[k];
      return N(`${WEEK} 이번 주 ${day}에는 지난주 ${day}보다 줄넘기를 몇 회 더 ${up ? '많이' : '적게'} 넘었는가?`, Math.abs(v2[k] - v1[k]), {
        unit: '회', figure: both(c, WEEKS, v1, v2, 10), explain: `${day}의 줄넘기 횟수는 지난주 ${v1[k]}회, 이번 주 ${v2[k]}회이다. ${Math.max(v1[k], v2[k])} - ${Math.min(v1[k], v2[k])} = ${Math.abs(v2[k] - v1[k])}`,
        facts: { calc: [[`${Math.max(v1[k], v2[k])}-${Math.min(v1[k], v2[k])}`, 0]] }
      });
    }),
    T('two-times', '두 막대그래프에서 같은 항목의 몇 배', '①50 ②69', (d) => {
      const c = pick(d, 'sport', 4), k = d.int(0, 3), [b, m] = d.until(() => [d.int(2, 5), d.int(2, 4)], ([x, y]) => x * y <= 14);
      const fill = (keep) => d.until(() => { const x = nums(d, 4, 2, 13); x[k] = keep; return x; }, (x) => new Set(x).size === 4), v1 = fill(b), v2 = fill(b * m), n = c.names[k];
      return N(`${roomLead(c)} 나 반에서 ${josa(n, '을/를')} 좋아하는 학생 수는 가 반에서 ${josa(n, '을/를')} 좋아하는 학생 수의 몇 배인가?`, m, {
        unit: '배', figure: both(c, ROOMS, v1, v2), explain: `${josa(n, '을/를')} 좋아하는 학생은 가 반 ${b}명, 나 반 ${b * m}명이다. ${b * m} ÷ ${b} = ${m}`, facts: { calc: [[`${b * m}/${b}`, 0]] }
      });
    }),
    T('two-cross', '한 그래프에서 고른 항목을 다른 그래프에서 읽기', '①54', (d) => {
      const c = pick(d, 'fruit', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 13), nums(d, 4, 3, 13)], ([x, y]) => x.indexOf(top(x)) !== y.indexOf(top(y)) && y[x.indexOf(top(x))] !== top(x)), m1 = v1.indexOf(top(v1));
      return N(`${roomLead(c)} 가 반에서 가장 많은 학생이 좋아하는 ${josa(c.kind, '을/를')} 나 반에서는 몇 명이 좋아하는가?`, v2[m1], {
        unit: '명', figure: both(c, ROOMS, v1, v2), explain: `가 반에서 막대가 가장 긴 것은 ${c.names[m1]}이다. 나 반의 그래프에서 ${josa(c.names[m1], '은/는')} ${v2[m1]}명이다.`, facts: { calc: [[String(v2[m1]), 0]] }
      });
    }),
    T('two-sum', '두 막대그래프에서 같은 항목의 합', '심56 심62', (d) => {
      const c = pick(d, 'jump', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 14, 10), nums(d, 4, 3, 14, 10)], ([x, y]) => x.every((p, i) => p !== y[i])), k = d.int(0, 3), day = c.tag(c.names[k]);
      return N(`${WEEK} 지난주 ${day}과 이번 주 ${day}에 넘은 줄넘기는 모두 몇 회인가?`, v1[k] + v2[k], {
        unit: '회', figure: both(c, WEEKS, v1, v2, 10), explain: `${day}의 줄넘기 횟수는 지난주 ${v1[k]}회, 이번 주 ${v2[k]}회이다. ${v1[k]} + ${v2[k]} = ${v1[k] + v2[k]}`, facts: { calc: [[`${v1[k]}+${v2[k]}`, 0]] }
      });
    }),
    T('two-both-above', '두 그래프 모두 기준 수를 넘는 항목', '①56', (d) => {
      const c = pick(d, 'jump', 4), t = d.pick([80, 100]);
      const [v1, v2] = d.until(() => [nums(d, 4, 4, 14, 10), nums(d, 4, 4, 14, 10)], ([x, y]) => !x.includes(t) && !y.includes(t) && x.filter((p, i) => p > t && y[i] > t).length === 1 && x.filter((p, i) => (p > t) !== (y[i] > t)).length >= 2);
      const hit = v1.findIndex((p, i) => p > t && v2[i] > t);
      return C(`${WEEK} 지난주와 이번 주 모두 줄넘기를 ${t}회보다 많이 넘은 요일은?`, c.names.map(c.tag), hit, {
        figure: both(c, WEEKS, v1, v2, 10), explain: `${t}회보다 많이 넘은 요일은 지난주에 ${c.names.filter((_, i) => v1[i] > t).map(c.tag).join(', ')}, 이번 주에 ${c.names.filter((_, i) => v2[i] > t).map(c.tag).join(', ')}이다. 두 주에 모두 든 요일은 ${c.tag(c.names[hit])}이다.`,
        facts: { only: { values: v1.map((p, i) => Math.min(p, v2[i])), test: 'atLeast', target: t + 10 } }
      });
    }),
    T('two-same', '두 막대그래프에서 수가 같은 항목', '심61', (d) => {
      const c = pick(d, 'snack', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 13), nums(d, 4, 3, 13)], ([x, y]) => x.filter((p, i) => p === y[i]).length === 1), hit = v1.findIndex((p, i) => p === v2[i]);
      return C(`${roomLead(c)} 두 반에서 ${josa(c.noun, '이/가')} 서로 같은 ${josa(c.kind, '은/는')}?`, c.names, hit, {
        figure: both(c, ROOMS, v1, v2), explain: `${c.kind}마다 두 그래프의 막대를 비교한다. ${josa(c.names[hit], '은/는')} 두 반 모두 ${v1[hit]}명이다.`, facts: { claimed: v1.map((p, i) => [String(p), v2[i]]), claimedWant: true }
      });
    }),
    T('two-pair-cross', '막대가 둘인 그래프에서 서로 다른 항목의 두 막대 비교하기', '심57', (d) => {
      const c = pick(d, 'glass', 4), [boys, girls, i, j] = d.until(() => [nums(d, 4, 2, 11), nums(d, 4, 2, 11), d.int(0, 3), d.int(0, 3)], ([x, y, p, q]) => p !== q && y[p] > x[q] && x.every((u, n) => u !== y[n]));
      return N(`${pairLead(c)} ${c.names[i]}의 안경을 쓴 여학생은 ${c.names[j]}의 안경을 쓴 남학생보다 몇 명 더 많은가?`, girls[i] - boys[j], {
        unit: '명', figure: pairBars(c, boys, girls), explain: `막대의 색을 보고 남학생과 여학생을 가려 읽는다. ${c.names[i]}의 여학생은 ${girls[i]}명, ${c.names[j]}의 남학생은 ${boys[j]}명이다. ${girls[i]} - ${boys[j]} = ${girls[i] - boys[j]}`,
        facts: { calc: [[`${girls[i]}-${boys[j]}`, 0]] }
      });
    }),
    T('two-pair-most-other', '한 막대가 가장 긴 항목의 다른 막대 읽기', '심57', (d) => {
      const c = pick(d, 'glass', 4), [boys, girls] = d.until(() => [nums(d, 4, 2, 11), nums(d, 4, 2, 11)], ([x, y]) => { const m = x.indexOf(top(x)); return y[m] !== top(y) && y[m] !== x[m]; }), m = boys.indexOf(top(boys));
      return N(`${pairLead(c)} 안경을 쓴 남학생이 가장 많은 반에서 안경을 쓴 여학생은 몇 명인가?`, girls[m], {
        unit: '명', figure: pairBars(c, boys, girls), explain: `남학생의 막대가 가장 긴 반은 ${c.names[m]}(${boys[m]}명)이다. ${c.names[m]}의 여학생은 ${girls[m]}명이다.`, facts: { calc: [[String(girls[m]), 0]] }
      });
    }),
    T('two-pair-same', '두 막대의 길이가 같은 항목', '②65 심58', (d) => {
      const c = pick(d, 'sport', 4), [boys, girls] = d.until(() => [nums(d, 4, 2, 11), nums(d, 4, 2, 11)], ([x, y]) => x.filter((p, i) => p === y[i]).length === 1), hit = boys.findIndex((p, i) => p === girls[i]);
      return C(`${pairLead(c)} 좋아하는 남학생 수와 여학생 수가 같은 ${josa(c.kind, '은/는')}?`, c.names, hit, {
        figure: pairBars(c, boys, girls), explain: `두 막대의 길이가 같은 것을 찾는다. ${josa(c.names[hit], '은/는')} 남학생과 여학생이 모두 ${boys[hit]}명이다.`, facts: { claimed: boys.map((p, i) => [String(p), girls[i]]), claimedWant: true }
      });
    }),
    T('two-pair-gap-most', '두 막대의 차가 가장 큰 항목', '②65 심58', (d) => {
      const c = pick(d, 'fruit', 4), [boys, girls] = d.until(() => [nums(d, 4, 2, 11), nums(d, 4, 2, 11)], ([x, y]) => { const g = x.map((p, i) => Math.abs(p - y[i])); return low(g) >= 1 && g.filter((u) => u === top(g)).length === 1; });
      const gaps = boys.map((p, i) => Math.abs(p - girls[i])), hit = gaps.indexOf(top(gaps));
      return C(`${pairLead(c)} 좋아하는 남학생 수와 여학생 수의 차가 가장 큰 ${josa(c.kind, '은/는')}?`, c.names, hit, {
        figure: pairBars(c, boys, girls), explain: `${c.kind}마다 두 막대의 차를 구하면 ${c.names.map((n, i) => `${n} ${gaps[i]}명`).join(', ')}이다. ${josa(c.names[hit], '이/가')} ${gaps[hit]}명으로 가장 크다.`,
        facts: { choose: { exprs: boys.map((p, i) => `${Math.max(p, girls[i])}-${Math.min(p, girls[i])}`), rule: 'max' } }
      });
    }),
    T('two-pair-sum', '두 막대를 더해 한 항목의 전체 수 구하기', '②66 심59', (d) => {
      const c = pick(d, 'snack', 4), boys = nums(d, 4, 2, 11), girls = nums(d, 4, 2, 11), k = d.int(0, 3);
      return N(`${pairLead(c)} ${josa(c.names[k], '을/를')} 좋아하는 학생은 모두 몇 명인가?`, boys[k] + girls[k], {
        unit: '명', figure: pairBars(c, boys, girls), explain: `${josa(c.names[k], '을/를')} 좋아하는 남학생은 ${boys[k]}명, 여학생은 ${girls[k]}명이다. ${boys[k]} + ${girls[k]} = ${boys[k] + girls[k]}`, facts: { calc: [[`${boys[k]}+${girls[k]}`, 0]] }
      });
    }),
    T('two-pair-series', '한 종류의 막대만 모두 더하기', '②67', (d) => {
      const c = pick(d, 'place', 4), boys = nums(d, 4, 2, 11), girls = nums(d, 4, 2, 11), girl = d.bool(), list = girl ? girls : boys;
      return N(`${pairLead(c)} 조사한 ${girl ? '여학생' : '남학생'}은 모두 몇 명인가?`, sum(list), {
        unit: '명', figure: pairBars(c, boys, girls), explain: `${girl ? '여학생' : '남학생'}을 나타내는 막대만 모두 읽어 더한다. ${list.join(' + ')} = ${sum(list)}`, facts: { calc: [[list.join('+'), 0]] }
      });
    })
  ]);

  B.addGroup('4-1-5', {
    id: 'hard', title: '실력 문제', standard: READ,
    types: [
      H('h-misread', '눈금 한 칸의 크기를 따져 읽기', '8, 기본 ①18 ②9', (d) => {
        // 틀린 보기: 큰 눈금 위의 칸을 1씩 센 것(한 칸을 언제나 1로 읽는 아이), 막대의 칸 수를 그대로 읽은 것, 바로 아래 큰 눈금의 수만 읽은 것
        const [step, major, key] = d.pick([[2, 5, 'tree'], [4, 5, 'can'], [5, 2, 'can']]), c = pick(d, key, 4);
        const cells = nums(d, 4, 2, major === 5 ? 14 : 11, 1, (x) => x.some((y) => y > major && y % major !== 0)), k = d.until(() => d.int(0, 3), (i) => cells[i] > major && cells[i] % major !== 0), v = cells.map((x) => x * step);
        const base = Math.floor(cells[k] / major) * major * step, list = d.shuffle([v[k], base + (cells[k] % major), cells[k], base]);
        return C(`${lead(c)} ${josa(c.one(c.names[k]), '을/를')} 바르게 읽은 것은?`, list.map((x) => U(c, x)), list.indexOf(v[k]), {
          figure: chart(c, v, { step, major }), explain: `세로 눈금 ${major}칸이 ${U(c, major * step)}이므로 한 칸은 ${U(c, step)}이다. ${c.tag(c.names[k])}의 막대는 ${cells[k]}칸이므로 ${step} × ${cells[k]} = ${v[k]}(${c.unit})이다.`,
          facts: { pick: { expr: `${step}*${cells[k]}`, options: list }, unseen: [cells[k]] }
        });
      }),
      H('h-cells-talk', '막대의 칸 수와 나타내는 수', '68, 기본 ①35 ②70', (d) => {
        // 잘못 말한 사람: 막대의 칸 수의 차를 그대로 수의 차로 읽는다(한 칸을 1로 여기는 아이)
        const step = d.pick([2, 5]), c = pick(d, d.pick(['sport', 'fruit']), 4), cells = nums(d, 4, 2, step === 2 ? 14 : 9), v = cells.map((x) => x * step), who = d.shuffle(NAMES).slice(0, 3);
        const [i, j, z] = d.until(() => d.shuffle([0, 1, 2, 3]), (x) => cells[x[0]] - cells[x[1]] >= 2), dc = cells[i] - cells[j], n = c.names;
        const says = d.shuffle([
          [`${n[i]}의 막대는 ${n[j]}의 막대보다 ${dc}칸 더 길어.`, [`(${v[i]}-${v[j]})/${step}`, dc]],
          [`막대가 ${dc}칸 더 기니까 ${josa(n[i], '을/를')} 좋아하는 학생은 ${josa(n[j], '을/를')} 좋아하는 학생보다 ${dc}명 더 많아.`, [`${v[i]}-${v[j]}`, dc]],
          [`${josa(n[z], '을/를')} 좋아하는 학생은 ${v[z]}명이야.`, [String(v[z]), v[z]]]
        ]);
        return C(`${lead(c)} 막대그래프를 보고 잘못 말한 사람은?`, who, says.findIndex((s) => s[1][0] === `${v[i]}-${v[j]}`), {
          figure: chart(c, v, { step }) + lines(says.map((s, at) => `${who[at]}: 「${s[0]}」`)),
          explain: `세로 눈금 한 칸은 ${step}명이다. 막대가 ${dc}칸 더 길면 ${step} × ${dc} = ${step * dc}(명) 더 많다. ${josa(n[i], '은/는')} ${v[i]}명, ${josa(n[j], '은/는')} ${v[j]}명이다.`,
          facts: { claimed: says.map((s) => s[1]), claimedWant: false }
        });
      }),
      H('h-two-scales', '눈금 한 칸의 크기가 다른 두 막대그래프 비교하기', '61, 기본 ①35 ②69', (d) => {
        // 막대의 길이만 보는 아이는 막대가 더 긴 반을 고른다. 눈금 한 칸의 크기가 달라, 막대가 짧은 쪽의 수가 더 많다.
        const c = pick(d, d.pick(['sport', 'fruit']), 4), k = d.int(0, 3), wide = d.int(0, 1), [a, cb] = d.until(() => [d.int(6, 13), d.int(4, 12)], ([x, y]) => y < x && 2 * y > x);
        const fill = (keep) => d.until(() => { const x = nums(d, 4, 3, 14); x[k] = keep; return x; }, (x) => new Set(x).size === 4), one = fill(a), two = fill(cb).map((x) => x * 2);
        const vs = wide === 0 ? [two, one] : [one, two], steps = wide === 0 ? [2, 1] : [1, 2], n = c.names[k];
        return C(`${roomLead(c)} 두 반에서 ${josa(n, '을/를')} 좋아하는 학생 수를 바르게 비교한 것은?`, ['가 반이 더 많다.', '두 반이 같다.', '나 반이 더 많다.'], wide === 0 ? 0 : 2, {
          figure: cap('가 반', chart(c, vs[0], { step: steps[0], top: 15 * steps[0] })) + cap('나 반', chart(c, vs[1], { step: steps[1], top: 15 * steps[1] })),
          explain: `두 그래프는 세로 눈금 한 칸의 크기가 다르다. 가 반은 한 칸이 ${steps[0]}명이므로 ${vs[0][k]}명, 나 반은 한 칸이 ${steps[1]}명이므로 ${vs[1][k]}명이다. 막대의 길이가 아니라 나타내는 수를 비교한다.`,
          facts: { choose: { exprs: [String(vs[0][k]), String(vs[1][k])], rule: 'compare' } }
        });
      }),
      H('h-cmp-who', '표와 막대그래프의 쓰임', '72·73, 기본 ①14 ②33', (d) => {
        // 잘못 말한 사람의 생각: 막대그래프에서는 수를 알 수 없다 / 많고 적음은 표에서 더 잘 보인다 / 전체 수는 가장 긴 막대가 알려 준다
        const c = pick(d, d.pick(['sport', 'fruit']), 4), v = nums(d, 4, 3, 12), who = d.shuffle(NAMES).slice(0, 3);
        const bad = d.pick([`막대그래프에는 수가 적혀 있지 않으니까 ${c.kind}별 학생 수는 표에서만 알 수 있어.`, `어떤 ${josa(c.kind, '을/를')} 좋아하는 학생이 많은지 한눈에 비교하기에는 막대그래프보다 표가 편리해.`, '조사한 학생이 모두 몇 명인지는 막대그래프에서 가장 긴 막대를 보면 바로 알 수 있어.']);
        const says = d.shuffle([['조사한 학생이 모두 몇 명인지는 표의 합계를 보면 바로 알 수 있어.', true], [`가장 많은 학생이 좋아하는 ${josa(c.kind, '은/는')} 막대그래프에서 가장 긴 막대를 찾으면 돼.`, true], [bad, false]]);
        return C(`${lead(c, '표와 막대그래프')} 표와 막대그래프를 보고 잘못 말한 사람은?`, who, says.findIndex((s) => !s[1]), {
          figure: tab(c, v, [['합계', sum(v)]]) + chart(c, v) + lines(says.map((s, at) => `${who[at]}: 「${s[0]}」`)),
          explain: '표는 조사한 수와 합계를 바로 알 수 있고, 막대그래프는 수의 많고 적음을 한눈에 비교할 수 있다. 막대그래프에서도 막대 끝의 눈금을 읽으면 수를 알 수 있다.', facts: { truth: says.map((s) => s[1]), want: false }
        });
      }),
      H('h-miss-half', '「2배」에서 기준이 되는 쪽 가리기', '24·33, 기본 ②59', (d) => {
        // 보이는 막대의 수에 2를 곱하는 아이(어느 쪽이 기준인지 가리지 않는다), 2를 빼거나 더하는 아이
        const c = pick(d, d.pick(['fruit', 'snack']), 4), h = d.int(4, 7), v = d.until(() => d.shuffle([h, 2 * h, d.int(3, 14), d.int(3, 14)]), (x) => new Set(x).size === 4), k = v.indexOf(h), j = v.indexOf(2 * h);
        const list = d.shuffle([h, 4 * h, 2 * h - 2, 2 * h + 2]);
        return C(`${lead(c)} ${josa(c.one(c.names[j]), '이/가')} ${c.one(c.names[k])}의 2배일 때, ${josa(c.one(c.names[k]), '은/는')} 몇 명인가?`, list.map((x) => x + '명'), list.indexOf(h), {
          figure: chart(c, hide(v, k), { top: roof(v) }), explain: `${told(c, v, j)}이다. ${josa(c.names[j], '이/가')} ${c.names[k]}의 2배이므로 ${josa(c.names[k], '은/는')} ${2 * h} ÷ 2 = ${h}(명)이다.`,
          facts: { pick: { expr: `${2 * h}/2`, options: list } }
        });
      }),
      H('h-record-miss', '기록에서 「더 빠르다」의 뜻', '32, 기본 ②18', (d) => {
        // 「더 빠르다」를 더 큰 수로 여겨 더하는 아이, 차만 답하는 아이, 견준 사람의 기록을 그대로 답하는 아이
        const c = pick(d, 'run', 4), v = nums(d, 4, 9, 14), g = d.int(1, 3), j = d.int(0, 3), k = d.until(() => d.int(0, 3), (i) => i !== j), fast = v[j] - g, list = d.shuffle([fast, v[j] + g, g, v[j]]);
        v[k] = fast;
        return C(`${lead(c)} ${name(c.names[k], '은/는')} ${nick(c.names[j])}보다 ${g}초 더 빨리 달렸다. ${nick(c.names[k])}의 달리기 기록은 몇 초인가?`, list.map((x) => x + '초'), list.indexOf(fast), {
          figure: chart(c, hide(v, k), { top: 15 }), explain: `빨리 달릴수록 걸린 시간이 짧다. ${nick(c.names[j])}의 기록은 ${v[j]}초이므로 ${nick(c.names[k])}의 기록은 ${v[j]} - ${g} = ${fast}(초)이다.`,
          facts: { pick: { expr: `${v[j]}-${g}`, options: list } }
        });
      }),
      H('h-half', '눈금 사이의 수를 나타내는 자리', '53', (d) => {
        // 가까운 칸으로 올리거나 내리는 아이, 수를 그대로 칸 수로 여기는 아이
        const v = d.pick([11, 13, 15, 17, 19]), h = (v - 1) / 2, rows = d.shuffle([[`${h}칸`, `${h}*2`], [`${h}칸 반`, `${h}*2+1`], [`${h + 1}칸`, `${h + 1}*2`], [`${v}칸`, `${v}*2`]]);
        return C(`세로 눈금 한 칸이 2권을 나타내는 막대그래프에 책 ${v}권을 나타내려고 한다. 막대를 몇 칸으로 그려야 하는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[0] === `${h}칸 반`), {
          explain: `${h}칸은 ${h * 2}권, ${h + 1}칸은 ${(h + 1) * 2}권을 나타낸다. ${josa(v, '은/는')} ${h * 2}보다 1 큰 수이고 1권은 반 칸이므로 ${h}칸 반으로 그린다.`,
          facts: { claimed: rows.map((r) => [r[1], v]), claimedWant: true }
        });
      }, { standard: DRAW }),
      H('h-miss-total-cells', '전체 수로 빠진 막대의 칸 수 구하기', '30, 기본 ①38 ②58 ③44', (d) => {
        const [step, key] = d.pick([[2, 'tree'], [10, 'town'], [20, 'farm']]), c = pick(d, key, 4), v = nums(d, 4, 3, 12, step), k = d.int(0, 3), total = sum(v), rest = v.filter((_, i) => i !== k);
        return N(`${lead(c)} ${josa(c.whole, '이/가')} 모두 ${U(c, total)}일 때, ${c.tag(c.names[k])}의 막대는 몇 칸으로 그려야 하는가?`, v[k] / step, {
          unit: '칸', figure: chart(c, hide(v, k), { step, top: roof(v, step) }), explain: `${josa(c.tag(c.names[k]), '은/는')} ${total} - ${rest.join(' - ')} = ${v[k]}(${c.unit})이다. 세로 눈금 한 칸이 ${U(c, step)}이므로 ${v[k]} ÷ ${step} = ${v[k] / step}(칸)이다.`,
          facts: { calc: [[`(${total}-${rest.join('-')})/${step}`, 0]] }
        });
      }),
      H('h-miss-times-cells', '몇 배 조건으로 빠진 막대의 칸 수 구하기', '33·34, 기본 ①36', (d) => {
        const [step, key] = d.pick([[2, 'tree'], [5, 'can'], [10, 'jump']]), c = pick(d, key, 4), [b, m] = d.until(() => [d.int(2, 4), d.int(2, 3)], ([x, y]) => x * y <= 11);
        const v = d.until(() => d.shuffle([b, b * m, d.int(2, 11), d.int(2, 11)]), (x) => new Set(x).size === 4).map((x) => x * step), k = v.indexOf(b * m * step), j = v.indexOf(b * step);
        return N(`${lead(c)} ${josa(c.one(c.names[k]), '이/가')} ${c.one(c.names[j])}의 ${m}배일 때, ${c.tag(c.names[k])}의 막대는 몇 칸으로 그려야 하는가?`, b * m, {
          unit: '칸', figure: chart(c, hide(v, k), { step, top: roof(v, step) }), explain: `${told(c, v, j)}이므로 ${josa(c.tag(c.names[k]), '은/는')} ${v[j]} × ${m} = ${v[k]}(${c.unit})이다. 세로 눈금 한 칸이 ${U(c, step)}이므로 ${v[k]} ÷ ${step} = ${b * m}(칸)이다.`,
          facts: { calc: [[`${v[j]}*${m}/${step}`, 0]] }
        });
      }),
      H('h-miss-most', '빠진 막대를 구한 뒤 가장 많은 항목 찾기', '30, 기본 ③44', (d) => {
        // 그려진 막대만 보고 가장 긴 것을 고르는 아이: 빠진 막대가 가장 길 수도, 아닐 수도 있다
        const c = pick(d, d.pick(['sport', 'place']), 4), v = nums(d, 4, 3, 13, 1, (x) => { const s = x.slice().sort((p, q) => q - p); return s[0] - s[1] <= 3; }), s = v.slice().sort((p, q) => q - p);
        const k = v.indexOf(d.pick([s[0], s[1]])), total = sum(v), rest = v.filter((_, i) => i !== k), hi = v.indexOf(top(v));
        return C(`${lead(c)} 조사한 학생이 모두 ${total}명일 때, ${josa(c.noun, '이/가')} 가장 많은 ${josa(c.kind, '은/는')}?`, c.names, hi, {
          figure: chart(c, hide(v, k), { top: roof(v) }), explain: `${josa(c.names[k], '은/는')} ${total} - ${rest.join(' - ')} = ${v[k]}(명)이다. 가장 많은 것은 ${v[hi]}명인 ${c.names[hi]}이다.`,
          facts: { choose: { exprs: v.map((x, i) => (i === k ? `${total}-${rest.join('-')}` : String(x))), rule: 'max' } }
        });
      }),
      H('h-miss-then-total', '조건으로 빠진 막대를 구한 뒤 전체 수 구하기', '32·33, 기본 ①39 ②60', (d) => {
        const [step, key] = d.pick([[2, 'tree'], [5, 'can']]), c = pick(d, key, 4), [b, m] = d.until(() => [d.int(2, 5), d.int(2, 3)], ([x, y]) => x * y <= 12);
        const v = d.until(() => d.shuffle([b, b * m, d.int(2, 12), d.int(2, 12)]), (x) => new Set(x).size === 4).map((x) => x * step), k = v.indexOf(b * m * step), j = v.indexOf(b * step), rest = v.filter((_, i) => i !== k);
        return N(`${lead(c)} ${josa(c.one(c.names[k]), '이/가')} ${c.one(c.names[j])}의 ${m}배일 때, ${josa(c.whole, '은/는')} 모두 몇 ${c.unit}인가?`, sum(v), {
          unit: c.unit, figure: chart(c, hide(v, k), { step, top: roof(v, step) }), explain: `${told(c, v, j)}이므로 ${josa(c.tag(c.names[k]), '은/는')} ${v[j]} × ${m} = ${v[k]}(${c.unit})이다. ${v.join(' + ')} = ${sum(v)}`,
          facts: { calc: [[`${rest.join('+')}+${v[j]}*${m}`, 0]] }
        });
      }),
      H('h-miss-two', '조건 둘로 빠진 두 막대의 칸 수 구하기', '34', (d) => {
        const c = pick(d, 'team', 4), n = c.names, m = d.int(2, 3), [p, q] = d.shuffle([0, 1]);
        const [v, g] = d.until(() => { const x = [d.int(2, 5) * 2, d.int(3, 9) * 2], more = d.int(1, 4) * 2; return [x.concat([x[p] * m, x[q] + more]), more]; }, ([x]) => new Set(x).size === 4 && top(x) <= 28);
        return M(`${lead(c)} ${n[2]}에서 딴 귤의 수는 ${n[p]}의 ${m}배이고, ${n[3]}에서 딴 귤의 수는 ${n[q]}보다 ${g}개 더 많다. ${josa(n[2], '과/와')} ${n[3]}의 막대는 각각 몇 칸으로 그려야 하는가?`, [{ label: n[2], answer: v[2] / 2, unit: '칸' }, { label: n[3], answer: v[3] / 2, unit: '칸' }], {
          figure: chart(c, hide(v, 2, 3), { step: 2, top: roof(v, 2) }),
          explain: `세로 눈금 한 칸은 2개이다. ${josa(n[2], '은/는')} ${v[p]} × ${m} = ${v[2]}(개)이므로 ${v[2] / 2}칸, ${josa(n[3], '은/는')} ${v[q]} + ${g} = ${v[3]}(개)이므로 ${v[3] / 2}칸이다.`,
          facts: { calc: [[`${v[p]}*${m}/2`, 0], [`(${v[q]}+${g})/2`, 1]] }
        });
      }),
      H('h-blank-times', '표의 빈칸을 구한 뒤 몇 배인지 구하기', '29, 기본 ①40', (d) => {
        const c = pick(d, d.pick(['fruit', 'snack']), 4), [b, m] = d.until(() => [d.int(3, 6), d.int(2, 4)], ([x, y]) => x * y <= 18);
        const v = d.until(() => d.shuffle([b, b * m, d.int(3, 14), d.int(3, 14)]), (x) => new Set(x).size === 4), k = v.indexOf(b * m), j = v.indexOf(b), total = sum(v), rest = v.filter((_, i) => i !== k);
        return N(`${lead(c, '표')} ${josa(c.one(c.names[k]), '은/는')} ${c.one(c.names[j])}의 몇 배인가?`, m, {
          unit: '배', figure: tab(c, v.map((x, i) => (i === k ? box() : x)), [['합계', total]]), explain: `${josa(c.names[k], '은/는')} ${total} - ${rest.join(' - ')} = ${v[k]}(명)이다. ${v[k]} ÷ ${b} = ${m}`,
          facts: { calc: [[`(${total}-${rest.join('-')})/${b}`, 0]] }
        });
      }),
      H('h-scale-other', '한 항목의 수로 눈금을 알아내어 다른 항목 구하기', '40, 기본 ②54', (d) => {
        const [step, key] = d.pick([[2, 'tree'], [3, 'can'], [4, 'can'], [10, 'town'], [20, 'farm']]), c = pick(d, key, 4), cells = nums(d, 4, 2, 11);
        const [k, j] = d.until(() => d.shuffle([0, 1, 2, 3]), (x) => cells[x[0]] >= 3 && cells[x[0]] <= 9);
        return N(`${lead(c)} ${BARE} ${josa(c.one(c.names[k]), '이/가')} ${U(c, step * cells[k])}일 때, ${josa(c.one(c.names[j]), '은/는')} 몇 ${c.unit}인가?`, step * cells[j], {
          unit: c.unit, figure: bare(c, cells), explain: `${c.tag(c.names[k])}의 막대 ${cells[k]}칸이 ${U(c, step * cells[k])}이므로 한 칸은 ${step * cells[k]} ÷ ${cells[k]} = ${step}(${c.unit})이다. ${c.tag(c.names[j])}의 막대는 ${cells[j]}칸이므로 ${step} × ${cells[j]} = ${step * cells[j]}(${c.unit})이다.`,
          facts: { calc: [[`${step * cells[k]}/${cells[k]}*${cells[j]}`, 0]] }
        });
      }),
      H('h-scale-total', '한 항목의 수로 눈금을 알아내어 전체 수 구하기', '40, 기본 ②55', (d) => {
        const step = d.pick([2, 3, 4, 5]), c = pick(d, d.pick(['sport', 'place']), 4), cells = nums(d, 4, 2, 10), k = d.until(() => d.int(0, 3), (i) => cells[i] >= 3);
        return N(`${lead(c)} ${BARE} ${josa(c.one(c.names[k]), '이/가')} ${step * cells[k]}명일 때, 조사한 학생은 모두 몇 명인가?`, step * sum(cells), {
          unit: '명', figure: bare(c, cells), explain: `${c.names[k]}의 막대 ${cells[k]}칸이 ${step * cells[k]}명이므로 한 칸은 ${step}명이다. 막대는 모두 ${cells.join(' + ')} = ${sum(cells)}(칸)이므로 ${step} × ${sum(cells)} = ${step * sum(cells)}(명)이다.`,
          facts: { calc: [[`${step * cells[k]}/${cells[k]}*(${cells.join('+')})`, 0]] }
        });
      }),
      H('h-scale-sum', '전체 수와 칸 수의 합으로 눈금을 알아내기', '41', (d) => {
        const step = d.pick([2, 3, 4, 5, 10]), c = pick(d, d.pick(['fruit', 'snack']), 4), cells = nums(d, 4, 2, 10, 1, (x) => sum(x) % 5 === 0), k = d.int(0, 3), total = step * sum(cells);
        return N(`${lead(c)} ${BARE} 조사한 학생이 모두 ${total}명일 때, ${josa(c.one(c.names[k]), '은/는')} 몇 명인가?`, step * cells[k], {
          unit: '명', figure: bare(c, cells), explain: `막대는 모두 ${cells.join(' + ')} = ${sum(cells)}(칸)이고 ${total}명을 나타내므로 한 칸은 ${total} ÷ ${sum(cells)} = ${step}(명)이다. ${c.names[k]}의 막대는 ${cells[k]}칸이므로 ${step} × ${cells[k]} = ${step * cells[k]}(명)이다.`,
          facts: { calc: [[`${total}/(${cells.join('+')})*${cells[k]}`, 0]] }
        });
      }),
      H('h-scale-gap', '두 항목의 차로 눈금을 알아내기', '기본 ②56', (d) => {
        const [step, key] = d.pick([[2, 'tree'], [5, 'can'], [10, 'town']]), c = pick(d, key, 4), cells = nums(d, 4, 2, 11, 1, (x) => x.some((p) => x.some((q) => p - q >= 2 && p - q <= 6)));
        const [i, j, k] = d.until(() => d.shuffle([0, 1, 2, 3]), (x) => cells[x[0]] - cells[x[1]] >= 2 && cells[x[0]] - cells[x[1]] <= 6), dc = cells[i] - cells[j];
        return N(`${lead(c)} ${BARE} ${josa(c.one(c.names[i]), '이/가')} ${c.one(c.names[j])}보다 ${U(c, step * dc)} 더 많을 때, ${josa(c.one(c.names[k]), '은/는')} 몇 ${c.unit}인가?`, step * cells[k], {
          unit: c.unit, figure: bare(c, cells), explain: `${c.tag(c.names[i])}의 막대는 ${c.tag(c.names[j])}의 막대보다 ${cells[i]} - ${cells[j]} = ${dc}(칸) 더 길다. ${dc}칸이 ${U(c, step * dc)}이므로 한 칸은 ${U(c, step)}이다. ${c.tag(c.names[k])}의 막대는 ${cells[k]}칸이므로 ${step} × ${cells[k]} = ${step * cells[k]}(${c.unit})이다.`,
          facts: { calc: [[`${step * dc}/(${cells[i]}-${cells[j]})*${cells[k]}`, 0]] }
        });
      }),
      H('h-two-sum-most', '두 막대그래프를 합하여 가장 많은 항목 찾기', '63, 기본 ①53 ①57 ②71', (d) => {
        // 한 반에서 가장 많은 것을 그대로 고르는 아이: 한 반의 으뜸이 두 반을 합한 으뜸은 아니다
        const c = pick(d, 'place', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 13), nums(d, 4, 3, 13)], ([x, y]) => { const t = x.map((p, i) => p + y[i]); return t.filter((u) => u === top(t)).length === 1 && x.indexOf(top(x)) !== t.indexOf(top(t)) && y.indexOf(top(y)) !== t.indexOf(top(t)); });
        const totals = v1.map((p, i) => p + v2[i]), hi = totals.indexOf(top(totals));
        return C(`${roomLead(c)} 두 반이 함께 체험 학습을 가려고 한다. 두 반을 합하여 가고 싶어 하는 학생이 가장 많은 장소는?`, c.names, hi, {
          figure: both(c, ROOMS, v1, v2), explain: `장소마다 두 반의 학생 수를 더한다. ${c.names.map((n, i) => `${n} ${v1[i]} + ${v2[i]} = ${totals[i]}`).join(', ')}이므로 ${josa(c.names[hi], '이/가')} 가장 많다.`,
          facts: { choose: { exprs: v1.map((p, i) => `${p}+${v2[i]}`), rule: 'max' } }
        });
      }),
      H('h-two-totals', '두 막대그래프의 전체 수 비교하기', '64, 기본 ①55', (d) => {
        // 가장 긴 막대가 있는 반을 고르는 아이: 막대 하나가 아니라 모두 더한 수를 비교한다
        const c = pick(d, 'sport', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 13), nums(d, 4, 3, 13)], ([x, y]) => sum(x) !== sum(y) && top(x) !== top(y) && (sum(x) > sum(y)) === (top(x) < top(y)) && Math.abs(sum(x) - sum(y)) <= 6);
        const s = [sum(v1), sum(v2)], win = s[0] > s[1] ? 0 : 1, gap = Math.abs(s[0] - s[1]), alt = Math.abs(top(v1) - top(v2)) === gap ? gap + 2 : Math.abs(top(v1) - top(v2)), options = d.shuffle([[win, gap], [1 - win, gap], [win, alt], [1 - win, alt]]);
        return C(`${roomLead(c)} 조사한 학생이 더 많은 반과, 두 반의 조사한 학생 수의 차를 바르게 쓴 것은?`, options.map(([w, g]) => `${ROOMS[w]}, ${g}명`), options.findIndex(([w, g]) => w === win && g === gap), {
          figure: both(c, ROOMS, v1, v2), explain: `가 반은 ${v1.join(' + ')} = ${s[0]}(명), 나 반은 ${v2.join(' + ')} = ${s[1]}(명)이다. ${josa(ROOMS[win], '이/가')} ${Math.max(...s)} - ${Math.min(...s)} = ${gap}(명) 더 많다.`,
          facts: { who: { exprs: [v1.join('+'), v2.join('+')], values: s, options } }
        });
      }),
      H('h-two-gap-least', '두 막대그래프의 차가 가장 작은 항목 찾기', '61, 기본 ①51', (d) => {
        const c = pick(d, 'jump', 4), [v1, v2] = d.until(() => [nums(d, 4, 3, 14, 10), nums(d, 4, 3, 14, 10)], ([x, y]) => { const g = x.map((p, i) => Math.abs(p - y[i])); return low(g) >= 10 && g.filter((u) => u === low(g)).length === 1; });
        const gaps = v1.map((p, i) => Math.abs(p - v2[i])), hit = gaps.indexOf(low(gaps));
        return C(`${WEEK} 지난주와 이번 주의 줄넘기 횟수의 차가 가장 작은 요일은?`, c.names.map(c.tag), hit, {
          figure: both(c, WEEKS, v1, v2, 10), explain: `요일마다 두 그래프의 차를 구하면 ${c.names.map((n, i) => `${c.tag(n)} ${gaps[i]}회`).join(', ')}이다. ${josa(c.tag(c.names[hit]), '이/가')} ${gaps[hit]}회로 가장 작다.`,
          facts: { choose: { exprs: v1.map((p, i) => `${Math.max(p, v2[i])}-${Math.min(p, v2[i])}`), rule: 'min' } }
        });
      }),
      H('h-two-product', '수를 나타낸 그래프와 값을 나타낸 그래프를 함께 읽기', '65', (d) => {
        const c = pick(d, 'buy', 4), counts = nums(d, 4, 2, 9), prices = nums(d, 4, 3, 9, 100), k = d.int(0, 3);
        return N(`지우가 문구점에서 산 학용품의 수와 학용품 한 개의 값을 나타낸 막대그래프이다. ${josa(c.names[k], '을/를')} 사는 데 쓴 돈은 얼마인가?`, counts[k] * prices[k], {
          unit: '원', figure: cap('산 학용품의 수', chart(c, counts)) + cap('학용품 한 개의 값', chart(Object.assign({}, c, { unit: '원' }), prices, { step: 100 })),
          explain: `${josa(c.names[k], '은/는')} ${counts[k]}개를 샀고, 한 개의 값은 ${prices[k]}원이다. ${prices[k]} × ${counts[k]} = ${counts[k] * prices[k]}`, facts: { calc: [[`${prices[k]}*${counts[k]}`, 0]] }
        });
      }),
      H('h-pair-sum-most', '두 막대를 합하여 가장 많은 항목 찾기', '59, 기본 ②66', (d) => {
        // 남학생 막대나 여학생 막대 하나만 보고 가장 긴 것을 고르는 아이
        const c = pick(d, 'sport', 4), [boys, girls] = d.until(() => [nums(d, 4, 2, 11), nums(d, 4, 2, 11)], ([x, y]) => { const t = x.map((p, i) => p + y[i]); return t.filter((u) => u === top(t)).length === 1 && x.indexOf(top(x)) !== t.indexOf(top(t)) && y.indexOf(top(y)) !== t.indexOf(top(t)); });
        const totals = boys.map((p, i) => p + girls[i]), hi = totals.indexOf(top(totals));
        return C(`${pairLead(c)} 남학생과 여학생을 합하여 가장 많은 학생이 좋아하는 ${josa(c.kind, '은/는')}?`, c.names, hi, {
          figure: pairBars(c, boys, girls), explain: `${c.kind}마다 남학생 수와 여학생 수를 더한다. ${c.names.map((n, i) => `${n} ${boys[i]} + ${girls[i]} = ${totals[i]}`).join(', ')}이므로 ${josa(c.names[hi], '이/가')} 가장 많다.`,
          facts: { choose: { exprs: boys.map((p, i) => `${p}+${girls[i]}`), rule: 'max' } }
        });
      }),
      H('h-pair-series-gap', '남학생 전체와 여학생 전체 비교하기', '59, 기본 ②67', (d) => {
        const c = pick(d, 'glass', 4), [boys, girls] = d.until(() => [nums(d, 4, 2, 11), nums(d, 4, 2, 11)], ([x, y]) => sum(x) !== sum(y) && top(x) !== top(y) && Math.abs(sum(x) - sum(y)) <= 6 && (sum(x) > sum(y)) === (top(x) < top(y)));
        const s = [sum(boys), sum(girls)], win = s[0] > s[1] ? 0 : 1, gap = Math.abs(s[0] - s[1]), alt = Math.abs(top(boys) - top(girls)) === gap ? gap + 2 : Math.abs(top(boys) - top(girls)), kinds = ['남학생', '여학생'];
        const options = d.shuffle([[win, gap], [1 - win, gap], [win, alt], [1 - win, alt]]);
        return C(`${pairLead(c)} 안경을 쓴 남학생과 여학생 가운데 어느 쪽이 몇 명 더 많은가?`, options.map(([w, g]) => `${kinds[w]}, ${g}명`), options.findIndex(([w, g]) => w === win && g === gap), {
          figure: pairBars(c, boys, girls), explain: `남학생은 ${boys.join(' + ')} = ${s[0]}(명), 여학생은 ${girls.join(' + ')} = ${s[1]}(명)이다. ${josa(kinds[win], '이/가')} ${Math.max(...s)} - ${Math.min(...s)} = ${gap}(명) 더 많다.`,
          facts: { who: { exprs: [boys.join('+'), girls.join('+')], values: s, options } }
        });
      }),
      H('h-pair-gap-sum', '두 막대의 차가 가장 큰 항목의 전체 수', '61, 기본 ②68', (d) => {
        const c = pick(d, 'snack', 4), [boys, girls] = d.until(() => [nums(d, 4, 2, 11), nums(d, 4, 2, 11)], ([x, y]) => { const g = x.map((p, i) => Math.abs(p - y[i])), t = x.map((p, i) => p + y[i]); return g.filter((u) => u === top(g)).length === 1 && t.indexOf(top(t)) !== g.indexOf(top(g)); });
        const gaps = boys.map((p, i) => Math.abs(p - girls[i])), hit = gaps.indexOf(top(gaps));
        return N(`${pairLead(c)} 좋아하는 남학생 수와 여학생 수의 차가 가장 큰 ${josa(c.kind, '을/를')} 좋아하는 학생은 모두 몇 명인가?`, boys[hit] + girls[hit], {
          unit: '명', figure: pairBars(c, boys, girls), explain: `${c.kind}마다 두 막대의 차를 구하면 ${c.names.map((n, i) => `${n} ${gaps[i]}명`).join(', ')}이다. 차가 가장 큰 ${josa(c.names[hit], '을/를')} 좋아하는 학생은 ${boys[hit]} + ${girls[hit]} = ${boys[hit] + girls[hit]}(명)이다.`,
          facts: { calc: [[`${boys[hit]}+${girls[hit]}`, 0]] }
        });
      }),
      H('h-pair-missing', '합이 같다는 조건으로 빠진 막대 구하기', '60', (d) => {
        const c = pick(d, 'town', 4), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2);
        const [boys, girls] = d.until(() => { const x = nums(d, 4, 3, 11), y = nums(d, 4, 3, 11); y[j] = x[i] + y[i] - x[j]; return [x, y]; }, ([x, y]) => y[j] >= 2 && y[j] <= 13 && y[j] !== y[i] && x[j] !== x[i]);
        return N(`${pairLead(c)} ${josa(c.tag(c.names[i]), '과/와')} ${c.tag(c.names[j])}의 초등학생 수가 같을 때, ${c.tag(c.names[j])}의 여학생은 몇 명인가?`, girls[j], {
          unit: '명', figure: chart(c, boys, { second: hide(girls, j), legend: ['남학생', '여학생'], top: 15 }),
          explain: `${c.tag(c.names[i])}의 초등학생은 ${boys[i]} + ${girls[i]} = ${boys[i] + girls[i]}(명)이다. ${c.tag(c.names[j])}의 남학생이 ${boys[j]}명이므로 여학생은 ${boys[i] + girls[i]} - ${boys[j]} = ${girls[j]}(명)이다.`,
          facts: { calc: [[`${boys[i]}+${girls[i]}-${boys[j]}`, 0]] }
        });
      }),
      H('h-pack', '전체 수를 구한 뒤 똑같이 나누어 담기', '28', (d) => {
        const c = pick(d, 'farm', 4), [v, each] = d.until(() => [nums(d, 4, 3, 14, 10), d.pick([20, 30, 40, 50, 60])], ([x, y]) => sum(x) % y === 0 && sum(x) / y <= 9);
        return N(`${lead(c)} 네 과수원에서 생산한 사과를 모두 모아 트럭 한 대에 ${each}상자씩 실으려고 한다. 트럭은 몇 대 필요한가?`, sum(v) / each, {
          unit: '대', figure: chart(c, v, { step: 10 }), explain: `네 과수원의 사과는 모두 ${v.join(' + ')} = ${sum(v)}(상자)이다. ${sum(v)} ÷ ${each} = ${sum(v) / each}`, facts: { calc: [[`(${v.join('+')})/${each}`, 0]] }
        });
      }),
      H('h-adjust-cells', '수를 고친 뒤 막대의 칸 수 구하기', '51', (d) => {
        const c = pick(d, 'team', 4), eat = d.pick([3, 5]), v = nums(d, 4, 3, 11).map((x) => x * 2 + eat), k = d.int(0, 3);
        return N(`${lead(c, '표')} 모둠마다 귤을 ${eat}개씩 먹고, 남은 귤의 수를 세로 눈금 한 칸이 2개인 막대그래프로 나타내려고 한다. ${c.names[k]}의 막대는 몇 칸으로 그려야 하는가?`, (v[k] - eat) / 2, {
          unit: '칸', figure: tab(c, v), explain: `${c.names[k]}에 남은 귤은 ${v[k]} - ${eat} = ${v[k] - eat}(개)이다. 한 칸이 2개이므로 ${v[k] - eat} ÷ 2 = ${(v[k] - eat) / 2}(칸)이다.`, facts: { calc: [[`(${v[k]}-${eat})/2`, 0]] }
        });
      }, { standard: DRAW })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
