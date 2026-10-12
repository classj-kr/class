// 4학년 1학기 5단원 막대그래프 — 단원 틀과 기본 문항(알아보기, 수 읽기와 비교하기, 읽은 수로 계산하기, 표와 막대그래프, 막대그래프로 나타내기, 자료 조사).
// 수집해 둔 교과서 10종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 74·82·75꼴, 심화꼴 76꼴)을 처음부터 끝까지 대조하여,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 주고 무엇을 묻는가를 따져서 실었다. 뽑은 글에는 그래프 그림이 없어
// 그래프의 수와 상황은 모두 새로 정했다. (알 수 있는 것·빠진 막대·눈금 알아내기·두 그래프의 기본 문항과 실력 문항은 4-1-5b.js에 있다.)
//
// 싣는 기준
//  - 주는 것(막대그래프 하나, 표, 표와 그래프, 가로 막대그래프, 눈금 한 칸이 1이 아닌 그래프)과 묻는 것(가로·세로, 눈금 한 칸의 크기,
//    한 항목의 수, 가장 많은 것, 차·합·몇 배, 전체, 차례, 기준보다 많은 것의 수, 칸 수 …)이 다르면 다른 문제다.
//    조사한 것(운동·과일·마을)만 다른 것, 숫자만 다른 것은 한 번만 싣는다.
//  - 막대를 그리는 꼴(작도)은 「막대를 몇 칸으로 그려야 하는가」「눈금 한 칸을 얼마로 해야 하는가」「눈금은 적어도 몇 칸인가」
//    「어느 쪽에 무엇을 나타내는가」「막대를 놓는 차례」로 바꾸어 실었다.
//    좋은 점·같은 점·다른 점을 쓰는 꼴(서술형)은 옳은 설명 고르기로 바꾸어 실었다.
//  - 값은 눈금에 꼭 맞는 수로만 정했다. 눈금 한 칸의 크기는 1, 2, 4, 5, 10, 20, 100을 쓴다.
//  - 단위는 우리말 단위(명·개·권·회·그루·상자·표)만 쓴다. 엔진의 막대그래프가 그림 설명에 수와 단위를 붙여 적어서, kg·cm 같은 단위 기호를 쓰면 띄어쓰기 검사에 걸린다.
//  - 실제 지명·사람 이름·통계 수치는 쓰지 않는다(가 마을, 나 과수원, 엔진에 있는 지어낸 이름).
//
// 뺀 것과 까닭(꼴 번호마다의 판정은 references/textbooks/수학/_분석/4-1-5/싣기_대조표.md에 적었다)
//  - 꺾은선그래프(4학년 2학기)의 내용: 해마다 느는지 주는지(②19), 앞으로 어떻게 될지 예상하기(②81 ③74)
//  - 그림그래프 복습(3학년 2학기): ②82 ③75
//  - 뜻 없는 셈: 가장 많은 것과 가장 적은 것의 합(②22)
//  - 활동·서술형으로만 할 수 있는 것: 주제를 정해 조사하기(①74 ②53 ③68), 질문 만들기(①44 ②80), 분류 기준을 스스로 정해 표 만들기(심49)
//  - 같은 문제: 달력·시간표에서 세기(③65)와 이름표 자료(②51)는 낱말 자료 세기와, 줄글의 수를 그래프로(③62)는 표의 수를 칸 수로 바꾸기와 주는 모양만 다르다.
//    축 이름 채우기(①9)는 가로·세로에 나타낼 것 정하기와, 조사한 주제 쓰기(①71)는 무엇을 조사한 그래프인지 알기와 하는 일이 같다.
//  - 미룬 것: 눈금의 수가 다섯 자리인 그래프(③9, 한 칸 10000명). 답이 네 자리를 넘고(검사의 BIG_NUMBER_UNITS), 엔진의 막대그래프 왼쪽 여백에 다섯 자리 수가 들어가지 않는다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, table, tagged, barChart, pictograph, N, M, C } = B.kit;
  const READ = '4수04-03', DRAW = '4수04-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const sum = (list) => list.reduce((x, y) => x + y, 0);
  const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  // 수를 적는 굵은 눈금 사이의 칸 수: 한 칸이 5·50이면 두 칸마다(0, 10, 20 …), 그 밖에는 다섯 칸마다 적는다.
  const MAJOR = { 5: 2, 50: 2 };
  // 가로 막대그래프는 끝 눈금의 수가 세 자리이면 그 옆의 단위 글과 겹친다. 한 칸이 10이면 두 칸마다 수를 적고 80까지만 쓴다.
  const FLAT = { 5: 2, 10: 2, 50: 2 };
  // 조사한 것. all: 항목(네 글자 안쪽), unit: 수 뒤의 낱말, title: 그래프에 적는 항목 쪽 이름, kind: 항목을 가리키는 말(없으면 title),
  // axis: 수 쪽이 나타내는 것, intro: 머리말, noun: 항목마다의 수를 가리키는 말, whole: 네 항목을 통틀어 가리키는 말(4-1-5b.js에서 쓴다), one(n): 한 항목의 수, tag(n): 글에 적는 항목 이름, fixed: 항목의 차례를 섞지 않는다.
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
    sold: { all: ['연필', '지우개', '공책', '가위', '풀'], unit: '개', title: '학용품', axis: '팔린 수', intro: '문구점에서 하루 동안 팔린 학용품의 수를', noun: '팔린 수', one: (n) => `팔린 ${n}의 수` },
    bread: { all: ['크림빵', '단팥빵', '소금빵', '도넛', '식빵'], unit: '개', title: '빵', axis: '팔린 수', intro: '오전에 팔린 빵의 수를', noun: '팔린 수', one: (n) => `팔린 ${n}의 수` },
    book: { all: NAMES.slice(0, 5), unit: '권', title: '이름', kind: '학생', axis: '책 수', intro: '학생별 한 달 동안 읽은 책 수를', noun: '읽은 책 수', one: (n) => `${name(n, '이/가')} 읽은 책 수` },
    quiz: { all: NAMES.slice(0, 5), unit: '문제', title: '이름', kind: '학생', axis: '문제 수', intro: '학생별 수학 퀴즈에서 맞힌 문제 수를', noun: '맞힌 문제 수', one: (n) => `${name(n, '이/가')} 맞힌 문제 수` },
    vote: { all: NAMES.slice(5), unit: '표', title: '후보', axis: '표의 수', intro: '학급 회장 선거에서 후보별로 얻은 표의 수를', noun: '얻은 표의 수', one: (n) => `${name(n, '이/가')} 얻은 표의 수` }
  };
  // 유형마다 조사한 것 하나를 골라 항목 n개를 정한다.
  const pick = (d, key, n) => { const s = SETS[key]; return Object.assign({ kind: s.title, tag: (x) => x }, s, { names: s.fixed ? s.all.slice(0, n) : d.shuffle(s.all).slice(0, n) }); };
  const lead = (c, as) => `${c.intro} 조사하여 나타낸 ${as || '막대그래프'}이다.`;
  const leadFlip = (c) => `${c.intro} 조사하여 막대가 가로인 막대그래프로 나타내었다.`;
  const chart = (c, v, o) => barChart(c.names, v, Object.assign({ unit: c.unit, title: c.title, major: MAJOR[(o || {}).step] || 5 }, o || {}));
  // 표는 항목을 세로로 놓는다(가로로 길면 휴대폰 너비를 넘는다).
  const tab = (c, v, extra) => table([c.kind, `${c.axis}(${c.unit})`], c.names.map((n, i) => [c.tag(n), v[i]]).concat(extra || []));
  // 서로 다른 수 n개: 칸 수 lo~hi 에 눈금 한 칸의 크기 step 을 곱한다.
  const nums = (d, n, lo, hi, step, ok) => d.until(() => Array.from({ length: n }, () => d.int(lo, hi) * (step || 1)), (v) => new Set(v).size === n && (!ok || ok(v)));
  const U = (c, n, pair) => (pair ? josa(n + c.unit, pair) : n + c.unit);
  // 식 뒤에 단위를 괄호로 적고 토씨를 붙인다: 5(개)를, 2(명)을
  const inUnit = (c, n, pair) => `${n}(${c.unit})${josa(c.unit, pair).slice(c.unit.length)}`;
  const told = (c, v, i) => `${josa(c.tag(c.names[i]), '은/는')} ${U(c, v[i])}`;
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const top = (v) => Math.max(...v), low = (v) => Math.min(...v);
  const axisRows = (c, flip) => { const [x, y] = flip ? [c.axis, c.kind] : [c.kind, c.axis]; return [[`가로: ${x}, 세로: ${y}`, true], [`가로: ${y}, 세로: ${x}`, false], [`가로: ${x}, 세로: 조사한 날짜`, false], [`가로: 조사한 날짜, 세로: ${y}`, false]]; };
  // 네 항목을 늘어놓은 차례 넷: 바른 차례, 거꾸로 쓴 것, 그래프(표)에 놓인 차례, 가운데 둘을 바꾼 것. 넷이 서로 다르게 되는 수만 쓴다.
  const orderable = (x) => !['0123', '3210', '0213', '3120'].includes([0, 1, 2, 3].sort((p, q) => x[q] - x[p]).join(''));
  const orderOptions = (d, v, desc) => { const right = [0, 1, 2, 3].sort((p, q) => (desc ? v[q] - v[p] : v[p] - v[q])); return { right, list: d.shuffle([right, right.slice().reverse(), [0, 1, 2, 3], [right[0], right[2], right[1], right[3]]]) }; };
  // 그래프 위에 이름을 붙인다(두 그래프를 함께 놓을 때).
  const cap = (label, html) => `<div style="display:grid;gap:2px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${label}</div>${html}</div>`;
  const words = (list) => '<div class="mb-numbers">' + list.map((word) => '<span>' + word + '</span>').join('') + '</div>';
  // 색종이 조각 그림: 삼각형·사각형·원을 한 줄에 여섯 개씩 놓는다. 그림 설명에 놓인 차례대로 모양 이름을 적는다.
  function scraps(list) {
    const cols = 6, size = 40, rows = Math.ceil(list.length / cols);
    const out = list.map((kind, i) => {
      const cx = 20 + (i % cols) * size, cy = 20 + Math.floor(i / cols) * size;
      if (kind === '원') return `<circle class="mb-shape" cx="${cx}" cy="${cy}" r="13"/>`;
      if (kind === '삼각형') return `<path class="mb-shape" d="M${cx} ${cy - 13}L${cx + 14} ${cy + 12}H${cx - 14}Z"/>`;
      return `<rect class="mb-shape" x="${cx - 12}" y="${cy - 12}" width="24" height="24"/>`;
    }).join('');
    return `<svg class="mb-numberline" viewBox="0 0 ${cols * size} ${rows * size}" width="${cols * size}" role="img" aria-label="색종이 조각: ${list.join(', ')}">${out}</svg>`;
  }

  B.addUnit({
    id: '4-1-5', grade: 4, semester: 1, no: 5, title: '막대그래프', version: 3,
    groups: [
      {
        id: 'know', title: '막대그래프 알아보기', standard: READ,
        types: [
          T('know-name', '막대그래프의 뜻', '①1 ②1 ③1 심1', (d) => {
            const list = d.shuffle(['막대그래프', '그림그래프', '표', '수직선']);
            return C('조사한 자료의 수량을 막대 모양으로 나타낸 그래프를 무엇이라고 하는가?', list, list.indexOf('막대그래프'), { explain: '조사한 자료의 수량을 막대 모양으로 나타낸 그래프를 막대그래프라고 한다.', facts: { truth: list.map((w) => w === '막대그래프'), want: true } });
          }),
          T('know-by-length', '수의 많고 적음을 나타내는 것', '①4 ③5', (d) => {
            const list = d.shuffle(['막대의 길이', '막대의 굵기', '막대의 색깔', '막대가 놓인 차례']);
            return C('막대그래프에서 조사한 수의 많고 적음은 무엇으로 나타내는가?', list, list.indexOf('막대의 길이'), { explain: '막대그래프는 조사한 수를 막대의 길이로 나타낸다. 수가 많을수록 막대가 길다.', facts: { truth: list.map((w) => w === '막대의 길이'), want: true } });
          }),
          T('know-axes', '가로와 세로가 나타내는 것', '①2 ②2 ③3 심2', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit', 'place']), 4), v = nums(d, 4, 3, 12), rows = d.shuffle(axisRows(c, false));
            return C(`${lead(c)} 가로와 세로는 각각 무엇을 나타내는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: chart(c, v), explain: `가로에는 ${c.kind}의 이름이 적혀 있고, 세로의 눈금은 ${josa(c.axis, '을/를')} 나타낸다.`, facts: truthOf(rows, true)
            });
          }),
          T('know-axes-flip', '가로 막대그래프의 가로와 세로', '①3 ②2 ③4 심2', (d) => {
            const c = pick(d, d.pick(['book', 'jump']), 4), step = c.unit === '회' ? 10 : 1, v = nums(d, 4, 3, step === 10 ? 8 : 12, step), rows = d.shuffle(axisRows(c, true));
            return C(`${leadFlip(c)} 가로와 세로는 각각 무엇을 나타내는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: chart(c, v, { step, major: FLAT[step] || 5, flip: true }), explain: `막대가 가로로 놓여 있다. 가로의 눈금은 ${josa(c.axis, '을/를')} 나타내고, 세로에는 ${c.kind}의 이름이 적혀 있다.`, facts: truthOf(rows, true)
            });
          }),
          T('know-length', '막대의 길이가 나타내는 것', '①4 ②3 ③5 심3', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit', 'snack']), 4), v = nums(d, 4, 3, 12);
            const rows = d.shuffle([[`${c.kind}별 ${c.noun}`, true], [`조사한 ${c.kind}의 가짓수`, false], [`${josa(c.kind, '을/를')} 조사한 날수`, false], [`${c.kind}의 이름`, false]]);
            return C(`${lead(c)} 막대의 길이는 무엇을 나타내는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: chart(c, v), explain: `막대의 길이는 ${c.kind}별 ${josa(c.noun, '을/를')} 나타낸다.`, facts: truthOf(rows, true)
            });
          }),
          T('know-step-one', '눈금 한 칸의 크기(한 칸이 1)', '①5 ②4 ③6 심4', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit', 'place']), 4), v = nums(d, 4, 3, 10, 1, (x) => top(x) > 5);
            return N(`${lead(c)} 세로 눈금 한 칸은 몇 ${josa(c.unit, '을/를')} 나타내는가?`, 1, {
              unit: c.unit, figure: chart(c, v), explain: `세로 눈금 5칸이 ${U(c, 5, '을/를')} 나타내므로 한 칸은 5 ÷ 5 = ${inUnit(c, 1, '을/를')} 나타낸다.`, facts: { calc: [['5/5', 0]], unseen: [5], rule: 'one' }
            });
          }),
          T('know-step', '눈금 한 칸의 크기(한 칸이 1이 아님)', '①6 ②5 ③7·8 심4', (d) => {
            const [step, major, key] = d.pick([[2, 5, 'tree'], [4, 5, 'can'], [5, 4, 'can'], [5, 2, 'can'], [10, 5, 'farm'], [20, 5, 'farm'], [100, 5, 'farm']]), c = pick(d, key, 4);
            const v = nums(d, 4, 2, major === 5 ? 11 : 9, step, (x) => top(x) > major * step);
            return N(`${lead(c)} 세로 눈금 한 칸은 몇 ${josa(c.unit, '을/를')} 나타내는가?`, step, {
              unit: c.unit, figure: chart(c, v, { step, major }), explain: `세로 눈금 ${major}칸이 ${U(c, major * step, '을/를')} 나타내므로 한 칸은 ${major * step} ÷ ${major} = ${inUnit(c, step, '을/를')} 나타낸다.`,
              facts: { calc: [[`${major * step}/${major}`, 0]], unseen: [major * step, major], rule: 'many' }
            });
          }),
          T('know-step-flip', '가로 눈금 한 칸의 크기', '①7 ②6 ③10', (d) => {
            const [step, major, key] = d.pick([[2, 5, 'book'], [5, 2, 'jump'], [10, 2, 'jump']]), c = pick(d, key, 4), v = nums(d, 4, 2, step === 10 ? 8 : major === 5 ? 11 : 9, step, (x) => top(x) > major * step);
            return N(`${leadFlip(c)} 가로 눈금 한 칸은 몇 ${josa(c.unit, '을/를')} 나타내는가?`, step, {
              unit: c.unit, figure: chart(c, v, { step, major, flip: true }), explain: `가로 눈금 ${major}칸이 ${U(c, major * step, '을/를')} 나타내므로 한 칸은 ${major * step} ÷ ${major} = ${inUnit(c, step, '을/를')} 나타낸다.`,
              facts: { calc: [[`${major * step}/${major}`, 0]], unseen: [major * step, major] }
            });
          }),
          T('know-topic', '무엇을 조사한 막대그래프인지 알기', '①8 ①71 ③2 심46', (d) => {
            const key = d.pick(['sport', 'fruit']), c = pick(d, key, 4), other = key === 'sport' ? '과일' : '운동', v = nums(d, 4, 3, 12);
            const rows = d.shuffle([[`좋아하는 ${c.kind}별 학생 수`, true], [`학생별 좋아하는 ${c.kind}의 수`, false], [`${c.kind}별 걸리는 시간`, false], [`좋아하는 ${other}별 학생 수`, false]]);
            return C('어느 반 학생들을 조사하여 나타낸 막대그래프이다. 무엇을 조사하여 나타낸 것인가?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: chart(c, v), explain: `가로에는 ${josa(c.kind, '을/를')}, 세로에는 학생 수(명)를 나타내었으므로 좋아하는 ${c.kind}별 학생 수를 조사하여 나타낸 것이다.`, facts: truthOf(rows, true)
            });
          }),
          T('know-longest', '가장 많은 것과 막대의 길이', '①11', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit', 'snack']), 4), v = nums(d, 4, 3, 12, 1, (x) => [1, 2].includes(x.indexOf(top(x))) && [1, 2].includes(x.indexOf(low(x)))), n = c.names;
            const rows = d.shuffle([[`막대의 길이가 가장 긴 ${n[v.indexOf(top(v))]}`, true], [`막대의 길이가 가장 짧은 ${n[v.indexOf(low(v))]}`, false], [`가장 왼쪽에 있는 ${n[0]}`, false], [`가장 오른쪽에 있는 ${n[3]}`, false]]);
            return C(`${lead(c)} 가장 많은 학생이 좋아하는 ${josa(c.kind, '을/를')} 바르게 찾은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: chart(c, v), explain: `학생 수가 많을수록 막대가 길다. 막대의 길이가 가장 긴 ${josa(n[v.indexOf(top(v))], '이/가')} 가장 많은 학생이 좋아하는 ${c.kind}이다.`, facts: truthOf(rows, true)
            });
          }),
          T('know-say', '막대그래프의 생김새에 대한 설명', '②7 ②73', (d) => {
            const step = d.pick([2, 5]), major = MAJOR[step] || 5, c = pick(d, d.pick(['sport', 'fruit', 'snack']), 4), v = nums(d, 4, 2, step === 2 ? 14 : 9, step), t = d.int(0, 3);
            const rows = [
              [`가로는 ${josa(t === 0 ? c.kind : c.axis, '을/를')} 나타낸다.`, t === 0],
              [`세로 눈금 한 칸은 ${U(c, t === 1 ? step : 1, '을/를')} 나타낸다.`, t === 1],
              [`조사한 ${josa(c.kind, '은/는')} 모두 ${t === 2 ? 4 : 5}가지이다.`, t === 2],
              [`막대의 길이는 ${josa(t === 3 ? c.axis : `${c.kind}의 이름`, '을/를')} 나타낸다.`, t === 3]
            ];
            return C(`${lead(c)} 막대그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), t, {
              figure: chart(c, v, { step }), explain: `가로는 ${c.kind}, 세로는 ${josa(c.axis, '을/를')} 나타내고, 막대의 길이는 ${josa(c.axis, '을/를')} 나타낸다. 세로 눈금 ${major}칸이 ${U(c, major * step)}이므로 한 칸은 ${U(c, step)}이다. 조사한 ${josa(c.kind, '은/는')} 4가지이다.`, facts: truthOf(rows, true)
            });
          })
        ]
      },
      {
        id: 'read', title: '막대그래프에서 수 읽기와 비교하기', standard: READ,
        types: [
          T('read-one', '한 항목의 수 읽기(눈금 한 칸이 1)', '①17 ②8 ③18 심7', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit', 'place']), 5), v = nums(d, 5, 2, 14), k = d.until(() => d.int(0, 4), (i) => v[i] % 5 !== 0);
            return N(`${lead(c)} ${josa(c.one(c.names[k]), '은/는')} 몇 ${c.unit}인가?`, v[k], {
              unit: c.unit, figure: chart(c, v), explain: `세로 눈금 한 칸은 ${U(c, 1, '을/를')} 나타낸다. ${c.names[k]}의 막대는 ${v[k]}칸이므로 ${U(c, v[k])}이다.`, facts: { calc: [[String(v[k]), 0]], rule: 'one' }
            });
          }),
          T('read-step', '한 항목의 수 읽기(눈금 한 칸이 1이 아님)', '①18 ②9 ③19 심7', (d) => {
            const [step, key] = d.pick([[2, 'tree'], [5, 'can'], [10, 'farm'], [20, 'farm'], [100, 'farm']]), major = MAJOR[step] || 5, c = pick(d, key, 4);
            const cells = nums(d, 4, 2, 14, 1, (x) => x.some((y) => y % major !== 0)), k = d.until(() => d.int(0, 3), (i) => cells[i] % major !== 0), v = cells.map((x) => x * step);
            return N(`${lead(c)} ${josa(c.one(c.names[k]), '은/는')} 몇 ${c.unit}인가?`, v[k], {
              unit: c.unit, figure: chart(c, v, { step }), explain: `세로 눈금 ${major}칸이 ${U(c, major * step)}이므로 한 칸은 ${U(c, step, '을/를')} 나타낸다. ${c.tag(c.names[k])}의 막대는 ${cells[k]}칸이므로 ${step} × ${cells[k]} = ${v[k]}(${c.unit})이다.`,
              facts: { calc: [[`${step}*${cells[k]}`, 0]], unseen: [cells[k]], rule: 'many' }
            });
          }),
          T('read-flip', '가로 막대그래프에서 한 항목의 수 읽기', '①18 ③20', (d) => {
            const [step, key] = d.pick([[1, 'book'], [2, 'book'], [10, 'jump']]), major = FLAT[step] || 5, c = pick(d, key, 4);
            const cells = nums(d, 4, 2, step === 10 ? 8 : 14, 1, (x) => x.some((y) => y % major !== 0)), k = d.until(() => d.int(0, 3), (i) => cells[i] % major !== 0), v = cells.map((x) => x * step);
            return N(`${leadFlip(c)} ${josa(c.one(c.names[k]), '은/는')} 몇 ${c.unit}인가?`, v[k], {
              unit: c.unit, figure: chart(c, v, { step, major, flip: true }), explain: `가로 눈금 한 칸은 ${U(c, step, '을/를')} 나타낸다. ${c.tag(c.names[k])}의 막대는 ${cells[k]}칸이므로 ${U(c, v[k])}이다.`, facts: { calc: [[`${step}*${cells[k]}`, 0]], unseen: [cells[k]] }
            });
          }),
          T('read-find', '수가 주어진 항목 찾기', '②10 ③21', (d) => {
            const step = d.pick([1, 2]), c = pick(d, step === 1 ? 'snack' : 'tree', 4), v = nums(d, 4, 2, 14, step), k = d.int(0, 3);
            return C(`${lead(c)} ${josa(c.noun, '이/가')} ${U(c, v[k])}인 ${josa(c.kind, '은/는')}?`, c.names.map(c.tag), k, {
              figure: chart(c, v, { step }), explain: `막대의 끝이 ${U(c, v[k], '을/를')} 나타내는 ${josa(c.kind, '을/를')} 찾는다. ${told(c, v, k)}이다.`, facts: { choose: { exprs: v.map(String), rule: 'equals', target: v[k] } }
            });
          }),
          T('read-most', '가장 많은 항목 찾기', '①20 ②11 ③22 심9', (d) => {
            const c = pick(d, d.pick(['sport', 'snack', 'place']), 5), v = nums(d, 5, 3, 14, 1, (x) => { const s = x.slice().sort((p, q) => q - p); return s[0] - s[1] <= 2; }), hi = v.indexOf(top(v));
            return C(`${lead(c)} ${josa(c.noun, '이/가')} 가장 많은 ${josa(c.kind, '은/는')}?`, c.names, hi, {
              figure: chart(c, v), explain: `막대의 길이가 가장 긴 것을 찾는다. ${c.names[hi]}의 막대가 ${U(c, v[hi], '으로/로')} 가장 길다.`, facts: { choose: { exprs: v.map(String), rule: 'max' } }
            });
          }),
          T('read-least', '가장 적은 항목 찾기', '①20 ③23 심9', (d) => {
            const c = pick(d, 'sold', 5), v = nums(d, 5, 3, 14, 2, (x) => { const s = x.slice().sort((p, q) => p - q); return s[1] - s[0] <= 4; }), lo = v.indexOf(low(v));
            return C(`${leadFlip(c)} ${josa(c.noun, '이/가')} 가장 적은 ${josa(c.kind, '은/는')}?`, c.names, lo, {
              figure: chart(c, v, { step: 2, flip: true }), explain: `막대의 길이가 가장 짧은 것을 찾는다. ${c.names[lo]}의 막대가 ${U(c, v[lo], '으로/로')} 가장 짧다.`, facts: { choose: { exprs: v.map(String), rule: 'min' } }
            });
          }),
          T('read-most-value', '가장 많은 항목의 수', '①21 ②12 ③24 심10', (d) => {
            const step = d.pick([10, 20]), c = pick(d, 'farm', 4), v = nums(d, 4, 3, 14, step, (x) => (top(x) / step) % 5 !== 0), hi = v.indexOf(top(v));
            return N(`${lead(c)} ${josa(c.noun, '이/가')} 가장 많은 ${c.kind}의 ${josa(c.noun, '은/는')} 몇 ${c.unit}인가?`, v[hi], {
              unit: c.unit, figure: chart(c, v, { step }), explain: `막대가 가장 긴 ${c.tag(c.names[hi])}의 수를 읽는다. 세로 눈금 한 칸이 ${U(c, step)}이고 막대가 ${v[hi] / step}칸이므로 ${U(c, v[hi])}이다.`, facts: { calc: [[`${step}*${v[hi] / step}`, 0]], unseen: [v[hi] / step] }
            });
          }),
          T('read-nth', '몇 번째로 많은 항목 찾기', '①22 ②13 ③25 심12', (d) => {
            const c = pick(d, 'town', 5), v = nums(d, 5, 3, 14, 10), nth = d.pick([2, 3]), sorted = v.slice().sort((p, q) => q - p);
            return C(`${lead(c)} ${josa(c.noun, '이/가')} ${nth === 2 ? '두' : '세'} 번째로 많은 ${josa(c.kind, '은/는')}?`, c.names.map(c.tag), v.indexOf(sorted[nth - 1]), {
              figure: chart(c, v, { step: 10 }), explain: `막대가 긴 것부터 차례로 쓰면 ${sorted.map((x) => `${c.tag(c.names[v.indexOf(x)])} ${U(c, x)}`).join(', ')}이다.`, facts: { rank: { values: v, nth } }
            });
          }),
          T('read-order', '많은(적은) 것부터 차례대로 쓰기', '①23 ②14 ③26 심11', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit']), 4), desc = d.bool(), v = nums(d, 4, 3, 13, 1, orderable), { right, list } = orderOptions(d, v, desc);
            return C(`${lead(c)} ${josa(c.noun, '이/가')} ${desc ? '많은' : '적은'} ${c.kind}부터 차례대로 쓴 것은?`, list.map((o) => o.map((i) => c.names[i]).join(', ')), list.indexOf(right), {
              figure: chart(c, v), explain: `그래프에 놓인 차례가 아니라 막대가 ${desc ? '긴' : '짧은'} 것부터 차례로 쓴다. ${right.map((i) => `${c.names[i]} ${U(c, v[i])}`).join(', ')}이다.`,
              facts: { choose: { exprs: v.map(String), rule: desc ? 'descending' : 'ascending', orders: list } }
            });
          }),
          T('read-same', '수가 같은 두 항목 찾기', '①24 ②15 ③27 심15', (d) => {
            const c = pick(d, 'place', 4), [a, b, e] = nums(d, 3, 3, 12), v = d.shuffle([a, a, b, e]);
            const right = PAIRS.find(([i, j]) => v[i] === v[j]), shown = d.shuffle(d.shuffle(PAIRS.filter((p) => p !== right)).slice(0, 3).concat([right]));
            return C(`${lead(c)} ${josa(c.noun, '이/가')} 같은 두 ${josa(c.kind, '은/는')}?`, shown.map(([i, j]) => `${c.names[i]}, ${c.names[j]}`), shown.indexOf(right), {
              figure: chart(c, v), explain: `막대의 길이가 같은 두 곳을 찾는다. ${josa(c.names[right[0]], '과/와')} ${josa(c.names[right[1]], '은/는')} ${U(c, a, '으로/로')} 같다.`, facts: { choose: { exprs: v.map(String), rule: 'same', pairsShown: shown } }
            });
          }),
          T('read-pair', '두 항목의 수 비교하기', '①25', (d) => {
            const c = pick(d, 'town', 5), v = nums(d, 5, 3, 14, 10), [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
            if (d.int(0, 3) === 0) v[j] = v[i];
            const ti = c.tag(c.names[i]), tj = c.tag(c.names[j]);
            return C(`${lead(c)} ${josa(ti, '과/와')} ${tj}의 ${josa(c.noun, '을/를')} 바르게 비교한 것은?`, [`${josa(ti, '이/가')} 더 많다.`, `두 ${josa(c.kind, '이/가')} 같다.`, `${josa(tj, '이/가')} 더 많다.`], v[i] > v[j] ? 0 : v[i] === v[j] ? 1 : 2, {
              figure: chart(c, v, { step: 10 }), explain: `${told(c, v, i)}, ${told(c, v, j)}이다. ${v[i] === v[j] ? '두 막대의 길이가 같으므로 수도 같다.' : `막대가 더 긴 ${josa(v[i] > v[j] ? ti : tj, '이/가')} 더 많다.`}`,
              facts: { choose: { exprs: [String(v[i]), String(v[j])], rule: 'compare' } }
            });
          }),
          T('read-than-item', '기준 항목보다 많은(적은) 항목의 수', '①26 ②16 ③28 심13', (d) => {
            const c = pick(d, 'sport', 5), more = d.bool();
            const [v, k] = d.until(() => [nums(d, 5, 3, 14), d.int(0, 4)], ([x, i]) => { const hit = x.filter((y) => (more ? y > x[i] : y < x[i])).length; return hit >= 1 && hit <= 3; });
            const hits = c.names.filter((_, i) => (more ? v[i] > v[k] : v[i] < v[k]));
            return N(`${lead(c)} ${c.names[k]}보다 ${josa(c.noun, '이/가')} 더 ${more ? '많은' : '적은'} ${josa(c.kind, '은/는')} 모두 몇 가지인가?`, hits.length, {
              unit: '가지', figure: chart(c, v), explain: `${c.names[k]}의 막대보다 ${more ? '긴' : '짧은'} 막대를 모두 찾는다. ${hits.join(', ')}의 ${hits.length}가지이다.`,
              facts: { choose: { exprs: v.filter((_, i) => i !== k).map(String), rule: more ? 'countAbove' : 'countBelow', target: v[k] } }
            });
          }),
          T('read-between', '두 항목 사이에 있는 항목 찾기', '①27 ③29 심14', (d) => {
            const c = pick(d, 'tree', 4), v = nums(d, 4, 2, 14, 2), order = [0, 1, 2, 3].sort((p, q) => v[p] - v[q]), k = d.int(0, 1), [lo, mid, hi] = [order[k], order[k + 1], order[k + 2]];
            return C(`${lead(c)} ${josa(c.noun, '이/가')} ${c.tag(c.names[lo])}보다 많고 ${c.tag(c.names[hi])}보다 적은 ${josa(c.kind, '은/는')}?`, c.names.map(c.tag), mid, {
              figure: chart(c, v, { step: 2 }), explain: `${told(c, v, lo)}, ${told(c, v, hi)}이다. 그 사이에 있는 것은 ${U(c, v[mid])}인 ${c.tag(c.names[mid])}이다.`,
              facts: { between: { low: String(v[lo]), high: String(v[hi]), exprs: v.map(String) } }
            });
          }),
          T('read-above', '기준 수보다 많은 항목의 수', '①28 ②17 심13', (d) => {
            const c = pick(d, 'place', 5), [v, t] = d.until(() => [nums(d, 5, 2, 14), d.pick([5, 6, 7, 8, 10])], ([x, y]) => !x.includes(y) && x.filter((z) => z > y).length >= 1 && x.filter((z) => z > y).length <= 4);
            const hits = c.names.filter((_, i) => v[i] > t);
            return N(`${lead(c)} ${josa(c.noun, '이/가')} ${U(c, t)}보다 많은 ${josa(c.kind, '은/는')} 모두 몇 곳인가?`, hits.length, {
              unit: '곳', figure: chart(c, v), explain: `막대의 끝이 눈금 ${t}보다 위에 있는 것을 모두 찾는다. ${hits.join(', ')}의 ${hits.length}곳이다.`, facts: { choose: { exprs: v.map(String), rule: 'countAbove', target: t } }
            });
          }),
          T('read-drop', '앞의 항목보다 줄어든 항목 찾기', '①52 심16', (d) => {
            const c = pick(d, 'jump', 5), k = d.int(1, 4);
            const v = d.until(() => { const x = [d.int(3, 8)]; for (let i = 1; i < 5; i += 1) x.push(x[i - 1] + (i === k ? -d.int(1, 2) : d.int(1, 3))); return x.map((y) => y * 10); }, (x) => top(x) <= 150 && low(x) >= 20);
            return C(`${lead(c)} 줄넘기 횟수가 전날보다 줄어든 요일은?`, c.names.slice(1).map(c.tag), k - 1, {
              figure: chart(c, v, { step: 10 }), explain: `이웃한 두 막대의 길이를 차례로 비교한다. ${c.tag(c.names[k - 1])} ${U(c, v[k - 1])}에서 ${c.tag(c.names[k])} ${U(c, v[k], '으로/로')} 줄었다.`,
              facts: { only: { values: [1, 2, 3, 4].map((i) => v[i] - v[i - 1]), test: 'atMost', target: -1 } }
            });
          })
        ]
      },
      {
        id: 'calc', title: '막대그래프의 수로 계산하기', standard: READ,
        types: [
          T('calc-gap', '두 항목의 차(눈금 한 칸이 1)', '①29 ②20 ③30 심18', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit', 'snack']), 4), v = nums(d, 4, 3, 14), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => v[q] - v[p]);
            return N(`${lead(c)} ${josa(c.one(c.names[i]), '은/는')} ${c.one(c.names[j])}보다 몇 ${c.unit} 더 많은가?`, v[i] - v[j], {
              unit: c.unit, figure: chart(c, v), explain: `${told(c, v, i)}, ${told(c, v, j)}이다. ${v[i]} - ${v[j]} = ${v[i] - v[j]}`, facts: { calc: [[`${v[i]}-${v[j]}`, 0]] }
            });
          }),
          T('calc-gap-step', '두 항목의 차(눈금 한 칸이 1이 아님)', '③31 심18', (d) => {
            const [step, key] = d.pick([[2, 'tree'], [10, 'town'], [20, 'farm'], [100, 'farm']]), c = pick(d, key, 4), v = nums(d, 4, 2, 14, step), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => v[q] - v[p]);
            return N(`${lead(c)} ${josa(c.one(c.names[j]), '은/는')} ${c.one(c.names[i])}보다 몇 ${c.unit} 더 적은가?`, v[i] - v[j], {
              unit: c.unit, figure: chart(c, v, { step }), explain: `세로 눈금 한 칸은 ${U(c, step)}이다. ${told(c, v, j)}, ${told(c, v, i)}이다. ${v[i]} - ${v[j]} = ${v[i] - v[j]}`, facts: { calc: [[`${v[i]}-${v[j]}`, 0]] }
            });
          }),
          T('calc-range', '가장 많은 것과 가장 적은 것의 차', '①30 ②21 ③32 심19', (d) => {
            const c = pick(d, 'jump', 5), v = nums(d, 5, 2, 14, 10);
            return N(`${lead(c)} ${josa(c.noun, '이/가')} 가장 많은 ${josa(c.kind, '과/와')} 가장 적은 ${c.kind}의 ${c.noun}의 차는 몇 ${c.unit}인가?`, top(v) - low(v), {
              unit: c.unit, figure: chart(c, v, { step: 10 }), explain: `막대가 가장 긴 ${told(c, v, v.indexOf(top(v)))}, 가장 짧은 ${told(c, v, v.indexOf(low(v)))}이다. ${top(v)} - ${low(v)} = ${top(v) - low(v)}`,
              facts: { calc: [[`${top(v)}-${low(v)}`, 0]], tableRank: { values: v, a: 0, b: 4 } }
            });
          }),
          T('calc-top2', '가장 많은 것과 두 번째로 많은 것의 차', '③69 심19', (d) => {
            const c = pick(d, 'vote', 4), v = nums(d, 4, 3, 14), s = v.slice().sort((p, q) => q - p);
            return N(`${lead(c)} 가장 많은 표를 얻은 후보는 두 번째로 많은 표를 얻은 후보보다 몇 표를 더 얻었는가?`, s[0] - s[1], {
              unit: '표', figure: chart(c, v), explain: `가장 많은 표를 얻은 ${told(c, v, v.indexOf(s[0]))}, 두 번째로 많은 표를 얻은 ${told(c, v, v.indexOf(s[1]))}이다. ${s[0]} - ${s[1]} = ${s[0] - s[1]}`,
              facts: { calc: [[`${s[0]}-${s[1]}`, 0]], tableRank: { values: v, a: 0, b: 1 } }
            });
          }),
          T('calc-sum2', '두 항목의 합', '심21', (d) => {
            const step = d.pick([10, 20]), c = pick(d, 'farm', 4), v = nums(d, 4, 2, 14, step), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2);
            return N(`${lead(c)} ${josa(c.one(c.names[i]), '과/와')} ${c.one(c.names[j])}의 합은 몇 ${c.unit}인가?`, v[i] + v[j], {
              unit: c.unit, figure: chart(c, v, { step }), explain: `${told(c, v, i)}, ${told(c, v, j)}이다. ${v[i]} + ${v[j]} = ${v[i] + v[j]}`, facts: { calc: [[`${v[i]}+${v[j]}`, 0]] }
            });
          }),
          T('calc-total', '조사한 전체 수 구하기', '①33 ②23 심22', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit']), 5), v = nums(d, 5, 2, 12);
            return N(`${lead(c)} 조사한 학생은 모두 몇 명인가?`, sum(v), {
              unit: '명', figure: chart(c, v), explain: `막대마다 수를 읽어 모두 더한다. ${v.join(' + ')} = ${sum(v)}`, facts: { calc: [[v.join('+'), 0]] }
            });
          }),
          T('calc-times', '몇 배인지 구하기', '①31 ②24 ③33 심23', (d) => {
            const c = pick(d, d.pick(['fruit', 'snack']), 4), [b, m] = d.until(() => [d.int(2, 5), d.int(2, 4)], ([x, y]) => x * y <= 15), a = b * m;
            const rest = d.until(() => [d.int(2, 14), d.int(2, 14)], (r) => new Set(r.concat([a, b])).size === 4), v = d.shuffle([a, b].concat(rest)), i = v.indexOf(a), j = v.indexOf(b);
            return N(`${lead(c)} ${josa(c.one(c.names[i]), '은/는')} ${c.one(c.names[j])}의 몇 배인가?`, m, {
              unit: '배', figure: chart(c, v), explain: `${told(c, v, i)}, ${told(c, v, j)}이다. ${a} ÷ ${b} = ${m}`, facts: { calc: [[`${a}/${b}`, 0]] }
            });
          }),
          T('calc-times-ends', '가장 많은 것은 가장 적은 것의 몇 배', '②25', (d) => {
            const c = pick(d, 'sold', 4), step = d.pick([1, 2]), [b, m] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x * y <= 14 && x * y - x >= 3), a = b * m;
            const rest = d.until(() => [d.int(b + 1, a - 1), d.int(b + 1, a - 1)], (r) => r[0] !== r[1]), v = d.shuffle([a, b].concat(rest)).map((x) => x * step);
            return N(`${lead(c)} 가장 많이 팔린 학용품의 수는 가장 적게 팔린 학용품의 수의 몇 배인가?`, m, {
              unit: '배', figure: chart(c, v, { step }), explain: `가장 많이 팔린 ${told(c, v, v.indexOf(top(v)))}, 가장 적게 팔린 ${told(c, v, v.indexOf(low(v)))}이다. ${top(v)} ÷ ${low(v)} = ${m}`, facts: { calc: [[`${top(v)}/${low(v)}`, 0]] }
            });
          }),
          T('calc-times-find', '몇 배인 항목 찾기', '①32 ②26 ③34 심24', (d) => {
            const step = d.pick([1, 2]), c = pick(d, step === 1 ? 'sport' : 'town', 4), [a, m] = d.until(() => [d.int(2, 6), d.int(2, 3)], ([x, y]) => x * y <= 13);
            const v = d.until(() => d.shuffle([a, a * m, a * m + d.pick([-1, 1]), d.int(2, 14)]), (x) => new Set(x).size === 4).map((x) => x * step), k = v.indexOf(a * step);
            return C(`${lead(c)} ${josa(c.noun, '이/가')} ${c.tag(c.names[k])}의 ${m}배인 ${josa(c.kind, '은/는')}?`, c.names.map(c.tag), v.indexOf(a * m * step), {
              figure: chart(c, v, { step }), explain: `${told(c, v, k)}이다. ${v[k]} × ${m} = ${v[k] * m}이므로 ${U(c, v[k] * m)}인 ${josa(c.kind, '을/를')} 찾는다.`,
              facts: { choose: { exprs: v.map(String), rule: 'equals', target: v[k] * m } }
            });
          }),
          T('calc-gap-find', '차가 주어진 항목 찾기', '②27', (d) => {
            const c = pick(d, 'tree', 4), g = d.pick([4, 6, 8]), a = d.int(2, 9) * 2;
            const v = d.until(() => d.shuffle([a, a + g, a + g + d.pick([-2, 2]), d.int(2, 14) * 2]), (x) => new Set(x).size === 4 && top(x) <= 28), k = v.indexOf(a);
            return C(`${lead(c)} ${josa(c.noun, '이/가')} ${c.tag(c.names[k])}보다 ${U(c, g)} 더 많은 ${josa(c.kind, '은/는')}?`, c.names.map(c.tag), v.indexOf(a + g), {
              figure: chart(c, v, { step: 2 }), explain: `${told(c, v, k)}이다. ${a} + ${g} = ${a + g}이므로 ${U(c, a + g)}인 ${josa(c.kind, '을/를')} 찾는다.`, facts: { choose: { exprs: v.map(String), rule: 'equals', target: a + g } }
            });
          }),
          T('calc-cells-gap', '두 막대의 칸 수의 차', '①34 심20', (d) => {
            const [step, key] = d.pick([[2, 'book'], [5, 'can'], [10, 'jump']]), c = pick(d, key, 4), v = nums(d, 4, 2, 13, step), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => v[q] - v[p]);
            return N(`${lead(c)} ${c.tag(c.names[i])}의 막대는 ${c.tag(c.names[j])}의 막대보다 몇 칸 더 긴가?`, (v[i] - v[j]) / step, {
              unit: '칸', figure: chart(c, v, { step }), explain: `${told(c, v, i)}, ${told(c, v, j)}이고 세로 눈금 한 칸은 ${U(c, step)}이다. (${v[i]} - ${v[j]}) ÷ ${step} = ${(v[i] - v[j]) / step}`,
              facts: { calc: [[`(${v[i]}-${v[j]})/${step}`, 0]] }
            });
          }),
          T('calc-even', '같아지려면 더 있어야 하는 수', '②28 심26', (d) => {
            const c = pick(d, 'can', 4), v = nums(d, 4, 3, 14, 5), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => v[q] - v[p]);
            return N(`${lead(c)} ${c.names[j]}에서 모은 빈 병의 수가 ${c.names[i]}에서 모은 빈 병의 수와 같아지려면 ${c.names[j]}에서 빈 병을 몇 개 더 모아야 하는가?`, v[i] - v[j], {
              unit: '개', figure: chart(c, v, { step: 5 }), explain: `${told(c, v, i)}, ${told(c, v, j)}이다. 두 수의 차만큼 더 모아야 한다. ${v[i]} - ${v[j]} = ${v[i] - v[j]}`, facts: { calc: [[`${v[i]}-${v[j]}`, 0]] }
            });
          }),
          T('calc-left', '전체에서 읽은 수를 빼기', '②29', (d) => {
            const c = pick(d, 'bread', 4), made = d.pick([30, 40]), v = nums(d, 4, 3, 14, 2), k = d.int(0, 3);
            return N(`빵집에서 빵을 종류마다 ${made}개씩 만들었다. ${lead(c)} 팔리지 않고 남은 ${josa(c.names[k], '은/는')} 몇 개인가?`, made - v[k], {
              unit: '개', figure: chart(c, v, { step: 2 }), explain: `팔린 ${told(c, v, k)}이다. ${made} - ${v[k]} = ${made - v[k]}`, facts: { calc: [[`${made}-${v[k]}`, 0]] }
            });
          }),
          T('calc-before', '바뀌기 전의 수 구하기', '②29 심27', (d) => {
            const c = pick(d, 'jump', 5), v = nums(d, 5, 5, 14, 10), k = d.int(0, 4), g = d.pick([20, 30, 40]), up = d.bool(), day = c.tag(c.names[k]);
            return N(`하린이가 이번 주에 요일별로 넘은 줄넘기 횟수를 조사하여 나타낸 막대그래프이다. 이번 주 ${day}의 줄넘기 횟수는 지난주 ${day}보다 ${g}회 ${up ? '늘었다' : '줄었다'}. 지난주 ${day}의 줄넘기 횟수는 몇 회인가?`, up ? v[k] - g : v[k] + g, {
              unit: '회', figure: chart(c, v, { step: 10 }), explain: `이번 주 ${told(c, v, k)}이다. 지난주보다 ${g}회 ${up ? '늘어난' : '줄어든'} 것이므로 지난주는 ${v[k]} ${up ? '-' : '+'} ${g} = ${up ? v[k] - g : v[k] + g}(회)이다.`,
              facts: { calc: [[`${v[k]}${up ? '-' : '+'}${g}`, 0]] }
            });
          }),
          T('calc-each', '읽은 수에 하나의 값을 곱하기', '②30 ③36', (d) => {
            const c = pick(d, 'quiz', 4), v = nums(d, 4, 6, 14), k = d.int(0, 3), each = d.pick([4, 5]);
            return N(`${lead(c)} 한 문제를 맞힐 때마다 ${each}점을 받는다면, ${name(c.names[k], '이/가')} 받은 점수는 몇 점인가?`, v[k] * each, {
              unit: '점', figure: chart(c, v), explain: `${name(c.names[k], '은/는')} ${v[k]}문제를 맞혔다. ${v[k]} × ${each} = ${v[k] * each}`, facts: { calc: [[`${v[k]}*${each}`, 0]] }
            });
          })
        ]
      },
      {
        id: 'table', title: '표와 막대그래프', standard: READ,
        types: [
          T('tab-for-total', '전체 수를 알아보기에 편리한 것', '①12 ②31 ③12 심72', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit']), 4), v = nums(d, 4, 3, 12, 1, (x) => x.indexOf(top(x)) !== 0);
            const rows = d.shuffle([['표 — 합계가 적혀 있다.', true], ['막대그래프 — 가장 긴 막대가 전체 학생 수를 나타낸다.', false], ['막대그래프 — 막대의 수가 전체 학생 수와 같다.', false], ['표 — 맨 위 칸의 수가 전체 학생 수이다.', false]]);
            return C(`${lead(c, '표와 막대그래프')} 조사한 학생이 모두 몇 명인지 알아보려고 한다. 더 편리한 것과 그 까닭을 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, v, [['합계', sum(v)]]) + chart(c, v), explain: '표에는 합계가 적혀 있어 조사한 전체 학생 수를 바로 알 수 있다. 막대그래프에서는 막대마다 수를 읽어 모두 더해야 한다.', facts: truthOf(rows, true)
            });
          }),
          T('tab-for-glance', '많고 적음을 한눈에 알아보기에 편리한 것', '①13 ②31 ③13 심72', (d) => {
            const c = pick(d, d.pick(['snack', 'place']), 4), v = nums(d, 4, 3, 12, 1, (x) => x.indexOf(top(x)) !== 0);
            const rows = d.shuffle([['막대그래프 — 가장 긴 막대를 찾으면 된다.', true], ['표 — 합계가 적혀 있다.', false], ['표 — 맨 위 칸에 적힌 것이 가장 많다.', false], ['막대그래프 — 가장 왼쪽에 있는 막대를 찾으면 된다.', false]]);
            return C(`${lead(c, '표와 막대그래프')} ${josa(c.noun, '이/가')} 가장 많은 ${josa(c.kind, '을/를')} 한눈에 알아보려고 한다. 더 편리한 것과 그 까닭을 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, v, [['합계', sum(v)]]) + chart(c, v), explain: '막대그래프는 막대의 길이로 수의 많고 적음을 한눈에 비교할 수 있다. 가장 긴 막대를 찾으면 가장 많은 것을 바로 알 수 있다.', facts: truthOf(rows, true)
            });
          }),
          T('tab-good', '막대그래프로 나타내면 좋은 점', '①15 ②32 ②79 ③15 심73', (d) => {
            const rows = d.shuffle([['항목별 수의 많고 적음을 한눈에 비교하기 쉽다.', true], ['합계가 적혀 있어 조사한 전체 수를 바로 알 수 있다.', false], ['항목마다 조사한 수가 숫자로 적혀 있다.', false], ['막대의 굵기로 수의 크기를 나타낸다.', false]]);
            return C('표를 막대그래프로 나타내면 좋은 점은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '막대그래프는 수를 막대의 길이로 나타내므로 많고 적음을 한눈에 비교하기 쉽다. 조사한 수와 합계가 숫자로 적혀 있는 것은 표이다.', facts: truthOf(rows, true)
            });
          }),
          T('tab-same', '표와 막대그래프의 같은 점', '①15 ③14', (d) => {
            const rows = d.shuffle([['항목별로 조사한 수를 알 수 있다.', true], ['조사한 수의 합계가 적혀 있다.', false], ['막대의 길이로 수를 나타낸다.', false], ['눈금을 읽어야 수를 알 수 있다.', false]]);
            return C('표와 막대그래프 모두에 알맞은 설명은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '표에서는 적힌 수로, 막대그래프에서는 막대의 길이와 눈금으로 항목별 수를 알 수 있다. 합계가 적혀 있는 것은 표뿐이고, 막대와 눈금이 있는 것은 막대그래프뿐이다.', facts: truthOf(rows, true)
            });
          }),
          T('tab-picto', '그림그래프와 막대그래프 비교하기', '①16 ②38 ③16 심73', (d) => {
            const c = pick(d, 'farm', 4), v = nums(d, 4, 5, 15, 10, (x) => x.some((y) => y > 100));
            const rows = d.shuffle([['그림그래프는 그림의 크기와 수로, 막대그래프는 막대의 길이로 수를 나타낸다.', true], ['두 그래프에 나타낸 과수원별 사과 생산량은 서로 다르다.', false], ['막대그래프는 막대의 수로 사과 생산량을 나타낸다.', false], ['그림그래프에서는 과수원별 사과 생산량을 알 수 없다.', false]]);
            return C('과수원별 사과 생산량을 조사하여 그림그래프와 막대그래프로 나타내었다. 옳은 설명은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: pictograph(['과수원', '사과 생산량'], c.names.map((n, i) => [c.tag(n), v[i]]), [100, 10], '상자') + chart(c, v, { step: 10 }),
              explain: '두 그래프는 같은 자료를 나타낸 것이다. 그림그래프는 그림의 크기와 수로, 막대그래프는 막대의 길이로 수를 나타낸다.', facts: truthOf(rows, true)
            });
          }),
          T('tab-flip', '세로 막대그래프와 가로 막대그래프 비교하기', '①70 ③17 심74', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit']), 4), v = nums(d, 4, 3, 10);
            const rows = d.shuffle([[`(가)와 (나)에 나타낸 ${c.kind}별 ${josa(c.axis, '은/는')} 서로 같다.`, true], [`(가)와 (나) 모두 가로가 ${josa(c.kind, '을/를')} 나타낸다.`, false], ['(가)와 (나)는 눈금 한 칸의 크기가 서로 다르다.', false], [`(나)에서 막대의 길이는 ${c.kind}의 이름을 나타낸다.`, false]]);
            return C(`${c.intro} 조사하여 두 가지 막대그래프 (가), (나)로 나타내었다. 옳은 설명은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: cap('(가)', chart(c, v)) + cap('(나)', chart(c, v, { flip: true })),
              explain: `두 그래프는 같은 자료를 나타내므로 ${c.kind}별 ${josa(c.axis, '은/는')} 같다. (가)는 가로가 ${c.kind}, 세로가 ${c.axis}이고, (나)는 가로가 ${c.axis}, 세로가 ${c.kind}이다. 눈금 한 칸은 둘 다 1명이다.`, facts: truthOf(rows, true)
            });
          }),
          T('tab-blank', '합계로 표의 빈칸 구하기', '①40 ②34 ③42 심29', (d) => {
            const c = pick(d, d.pick(['snack', 'place']), 5), v = nums(d, 5, 3, 14), k = d.int(0, 4), total = sum(v);
            return N(`${lead(c, '표')} □ 안에 알맞은 수는?`, v[k], {
              figure: tab(c, v.map((x, i) => (i === k ? box() : x)), [['합계', total]]), explain: `합계에서 나머지 수를 모두 뺀다. ${total} - ${v.filter((_, i) => i !== k).join(' - ')} = ${v[k]}`, facts: { calc: [[`${total}-${v.filter((_, i) => i !== k).join('-')}`, 0]] }
            });
          }),
          T('tab-total', '표의 합계 구하기', '②35 ③35', (d) => {
            const c = pick(d, 'tree', 5), v = nums(d, 5, 4, 14, 2);
            return N(`${lead(c, '표')} 다섯 마을에서 심은 나무는 모두 몇 그루인가?`, sum(v), {
              unit: '그루', figure: tab(c, v), explain: `표의 수를 모두 더한다. ${v.join(' + ')} = ${sum(v)}`, facts: { calc: [[v.join('+'), 0]] }
            });
          }),
          T('tab-from-graph', '막대그래프를 보고 표로 나타내기', '②36 심50', (d) => {
            const c = pick(d, 'town', 4), v = nums(d, 4, 3, 14, 2), k = d.int(0, 3);
            return M(`${lead(c)} 막대그래프를 보고 표로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: v[k] }, { label: LABELS[1], answer: sum(v) }], {
              figure: chart(c, v, { step: 2 }) + tab(c, v.map((x, i) => (i === k ? box(LABELS[0]) : x)), [['합계', box(LABELS[1])]]),
              explain: `세로 눈금 한 칸은 2명이다. ${told(c, v, k)}이다. 합계는 ${v.join(' + ')} = ${sum(v)}(명)이다.`, facts: { calc: [[String(v[k]), 0], [v.join('+'), 1]] }
            });
          }),
          T('tab-both', '표와 막대그래프를 서로 보고 채우기', '①41 ②37 ③43 심31', (d) => {
            const c = pick(d, d.pick(['fruit', 'sport']), 4), v = nums(d, 4, 3, 12), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => p - q), gone = d.pick([i, j]), seen = gone === i ? j : i, total = sum(v);
            const minus = `${total}-${v.filter((_, n) => n !== gone).join('-')}`;
            return M(`${lead(c, '표와 막대그래프')} 표와 막대그래프를 완성하려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: v[i] }, { label: LABELS[1], answer: v[j] }], {
              figure: tab(c, v.map((x, n) => (n === i ? box(LABELS[0]) : n === j ? box(LABELS[1]) : x)), [['합계', total]]) + chart(c, v.map((x, n) => (n === gone ? null : x))),
              explain: `막대그래프에서 ${told(c, v, seen)}이다. ${josa(c.names[gone], '은/는')} 합계에서 나머지를 빼어 구한다. ${minus.replace(/-/g, ' - ')} = ${v[gone]}`,
              facts: { calc: [[gone === i ? minus : String(v[i]), 0], [gone === j ? minus : String(v[j]), 1]] }
            });
          }),
          T('tab-cond', '글의 조건으로 표 완성하기', '②61 심48', (d) => {
            const [p, q, r] = d.shuffle(NAMES).slice(0, 3), a = d.int(5, 12), b = d.int(5, 9), k = d.int(2, 3), more = d.bool(), third = more ? b + k : b - k;
            return M(`학급 회장 선거에서 ${name(p, '은/는')} ${a}표, ${name(q, '은/는')} ${b}표를 얻었고, ${name(r, '은/는')} ${nick(q)}보다 ${k}표를 더 ${more ? '많이' : '적게'} 얻었다. 표의 ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: third }, { label: LABELS[1], answer: a + b + third }], {
              figure: table(['후보', '얻은 표의 수(표)'], [[p, a], [q, b], [r, box(LABELS[0])], ['합계', box(LABELS[1])]]),
              explain: `${name(r, '은/는')} ${b} ${more ? '+' : '-'} ${k} = ${third}(표)를 얻었다. 합계는 ${a} + ${b} + ${third} = ${a + b + third}(표)이다.`,
              facts: { calc: [[`${b}${more ? '+' : '-'}${k}`, 0], [`${a}+${b}+${b}${more ? '+' : '-'}${k}`, 1]] }
            });
          }, { standard: DRAW })
        ]
      },
      {
        id: 'draw', title: '표를 막대그래프로 나타내기', standard: DRAW,
        types: [
          T('draw-axis', '가로에 항목을 나타낼 때 세로에 나타낼 것', '①9 ①58 ②39 ③48 심6', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit', 'place']), 4), v = nums(d, 4, 3, 12), rows = d.shuffle([[c.axis, true], [c.kind, false], ['합계', false], ['조사한 날짜', false]]);
            return C(`${lead(c, '표')} 이 표를 막대그래프로 나타낼 때, 가로에 ${josa(c.kind, '을/를')} 나타낸다면 세로에는 무엇을 나타내어야 하는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, v, [['합계', sum(v)]]), explain: `가로에 ${josa(c.kind, '을/를')} 나타내면 세로에는 조사한 수인 ${josa(c.axis, '을/를')} 나타낸다. 합계는 막대로 나타내지 않는다.`, facts: truthOf(rows, true)
            });
          }),
          T('draw-axis-flip', '가로 막대그래프로 나타낼 때 세로에 나타낼 것', '①58 ①67 ②39 ②47 ③49 ③59 심6', (d) => {
            const c = pick(d, d.pick(['snack', 'town']), 4), v = nums(d, 4, 3, 12, c.fixed ? 10 : 1), rows = d.shuffle([[c.kind, true], [c.axis, false], ['합계', false], ['눈금 한 칸의 크기', false]]);
            return C(`${lead(c, '표')} 이 표를 막대가 가로인 막대그래프로 나타내려고 한다. 가로에 ${josa(c.axis, '을/를')} 나타낸다면 세로에는 무엇을 나타내어야 하는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, v, [['합계', sum(v)]]), explain: `막대가 가로인 막대그래프는 가로에 조사한 수인 ${josa(c.axis, '을/를')}, 세로에 ${josa(c.kind, '을/를')} 나타낸다.`, facts: truthOf(rows, true)
            });
          }),
          T('draw-title', '막대그래프의 제목 정하기', '①65 심5', (d) => {
            const c = pick(d, 'place', 4), v = nums(d, 4, 3, 12);
            const rows = d.shuffle([['가고 싶어 하는 장소별 학생 수', true], ['학생별 가고 싶어 하는 장소의 수', false], ['장소별 걸리는 시간', false], ['체험 학습을 가는 날짜', false]]);
            return C(`${lead(c, '표')} 이 표를 막대그래프로 나타낼 때, 막대그래프의 제목으로 알맞은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, v), explain: '장소마다 가고 싶어 하는 학생 수를 조사한 것이므로 제목은 「가고 싶어 하는 장소별 학생 수」가 알맞다.', facts: truthOf(rows, true)
            });
          }),
          T('draw-top', '눈금이 적어도 나타내어야 하는 수', '①59 ②40 ③50 심44', (d) => {
            const c = pick(d, d.pick(['sport', 'fruit']), 4), v = nums(d, 4, 3, 14, 1, (x) => top(x) % 5 !== 0);
            return N(`${lead(c, '표')} 이 표를 막대그래프로 나타낼 때, 세로 눈금은 적어도 몇 명까지 나타낼 수 있어야 하는가?`, top(v), {
              unit: '명', figure: tab(c, v, [['합계', sum(v)]]), explain: `조사한 수 가운데 가장 큰 수까지 나타낼 수 있어야 한다. 가장 큰 수는 ${c.names[v.indexOf(top(v))]}의 ${top(v)}명이다. 합계는 막대로 나타내지 않는다.`,
              facts: { calc: [[String(top(v)), 0]] }
            });
          }),
          T('draw-cells-top', '눈금이 적어도 몇 칸 있어야 하는가', '①60 ③51·52 심44', (d) => {
            const [step, key] = d.pick([[2, 'tree'], [5, 'can'], [10, 'town'], [20, 'farm']]), c = pick(d, key, 4), v = nums(d, 4, 3, 14, step);
            return N(`${lead(c, '표')} 이 표를 세로 눈금 한 칸이 ${U(c, step, '을/를')} 나타내는 막대그래프로 나타내려고 한다. 세로 눈금은 적어도 몇 칸 있어야 하는가?`, top(v) / step, {
              unit: '칸', figure: tab(c, v), explain: `가장 큰 수인 ${U(c, top(v), '을/를')} 나타낼 수 있어야 한다. ${top(v)} ÷ ${step} = ${top(v) / step}`, facts: { calc: [[`${top(v)}/${step}`, 0]] }
            });
          }),
          T('draw-cells-one', '막대를 몇 칸으로 그리는가(눈금 한 칸이 1)', '①61 ①66 ②42 ②45 ③53 ③56 심52', (d) => {
            const c = pick(d, d.pick(['snack', 'place']), 4), v = nums(d, 4, 3, 14), k = d.int(0, 3);
            return N(`${lead(c, '표')} 이 표를 세로 눈금 한 칸이 ${U(c, 1, '을/를')} 나타내는 막대그래프로 나타낼 때, ${c.names[k]}의 막대는 몇 칸으로 그려야 하는가?`, v[k], {
              unit: '칸', figure: tab(c, v), explain: `한 칸이 1명이므로 ${v[k]}명은 ${v[k]}칸으로 그린다.`, facts: { calc: [[`${v[k]}/1`, 0]], rule: 'one' }
            });
          }),
          T('draw-cells', '막대를 몇 칸으로 그리는가(눈금 한 칸이 1이 아님)', '①62 ①68 ②43 ②46 ③54 ③57·58 ③62 심42 심52', (d) => {
            const [step, key] = d.pick([[2, 'tree'], [5, 'can'], [10, 'town'], [20, 'farm']]), c = pick(d, key, 4), v = nums(d, 4, 3, 14, step), k = d.int(0, 3);
            return N(`${lead(c, '표')} 이 표를 세로 눈금 한 칸이 ${U(c, step, '을/를')} 나타내는 막대그래프로 나타낼 때, ${c.tag(c.names[k])}의 막대는 몇 칸으로 그려야 하는가?`, v[k] / step, {
              unit: '칸', figure: tab(c, v), explain: `${told(c, v, k)}이다. 한 칸이 ${U(c, step)}이므로 ${v[k]} ÷ ${step} = ${v[k] / step}(칸)으로 그린다.`, facts: { calc: [[`${v[k]}/${step}`, 0]], rule: 'many' }
            });
          }),
          T('draw-step', '알맞은 눈금 한 칸의 크기 정하기', '①64 ②41 ③55 심45', (d) => {
            const best = d.pick([2, 5, 10]), c = pick(d, best === 2 ? 'tree' : best === 5 ? 'can' : 'farm', 4), grid = d.pick([12, 14, 15]), sizes = [1, 2, 5, 10];
            const fits = (s, x) => x.every((y) => y % s === 0) && top(x) <= s * grid;
            const v = d.until(() => nums(d, 4, 3, grid, best), (x) => sizes.filter((s) => fits(s, x)).length === 1), big = top(v);
            return C(`${lead(c, '표')} 이 표를 세로 눈금이 ${grid}칸인 모눈종이에 막대그래프로 나타내려고 한다. 막대의 끝이 모두 눈금에 맞도록 그리려면 세로 눈금 한 칸의 크기를 얼마로 해야 하는가?`, sizes.map((s) => U(c, s)), sizes.indexOf(best), {
              figure: tab(c, v), explain: `가장 큰 수인 ${U(c, big, '을/를')} ${grid}칸 안에 나타낼 수 있어야 하고, 모든 수가 한 칸의 크기로 나누어떨어져야 한다. 한 칸을 ${U(c, best, '으로/로')} 하면 가장 긴 막대가 ${big / best}칸이다.`,
              // 보기마다 (나머지의 합) + (가장 긴 막대가 모눈을 넘는가) 를 셈한다. 0 이면 그릴 수 있다.
              facts: { claimed: sizes.map((s) => [`${v.map((x) => `${x}%${s}`).join('+')}+(${big - 1}-${big - 1}%${s * grid})/${s * grid}`, 0]), claimedWant: true }
            });
          }),
          T('draw-rescale', '눈금 한 칸의 크기를 바꾸면 몇 칸', '①63 ②44 심43', (d) => {
            const [step, next, key] = d.pick([[1, 2, 'sport'], [2, 4, 'tree'], [10, 20, 'farm']]), c = pick(d, key, 4);
            const v = nums(d, 4, 3, 14, step, (x) => x.some((y) => y % next === 0 && y / next >= 3)), k = d.until(() => d.int(0, 3), (i) => v[i] % next === 0 && v[i] / next >= 3);
            return N(`${lead(c)} 세로 눈금 한 칸이 ${U(c, next, '을/를')} 나타내도록 바꾸어 그린다면, ${c.tag(c.names[k])}의 막대는 몇 칸으로 그려야 하는가?`, v[k] / next, {
              unit: '칸', figure: chart(c, v, { step }), explain: `${told(c, v, k)}이다. 한 칸이 ${U(c, next)}이면 ${v[k]} ÷ ${next} = ${v[k] / next}(칸)이다. 눈금 한 칸의 크기가 커지면 막대의 칸 수는 줄어든다.`, facts: { calc: [[`${v[k]}/${next}`, 0]] }
            });
          }),
          T('draw-order', '막대를 놓는 차례 정하기', '①69 ②48 ③61 심55', (d) => {
            const c = pick(d, d.pick(['snack', 'fruit']), 4), desc = d.bool(), v = nums(d, 4, 3, 13, 1, orderable), { right, list } = orderOptions(d, v, desc);
            return C(`${lead(c, '표')} ${josa(c.noun, '이/가')} ${desc ? '많은' : '적은'} ${c.kind}부터 왼쪽에서 차례로 놓아 막대그래프로 나타내려고 한다. 왼쪽부터 놓는 차례로 옳은 것은?`, list.map((o) => o.map((i) => c.names[i]).join(', ')), list.indexOf(right), {
              figure: tab(c, v), explain: `표에 적힌 차례가 아니라 수가 ${desc ? '큰' : '작은'} 것부터 놓는다. ${right.map((i) => `${c.names[i]} ${U(c, v[i])}`).join(', ')}이다.`,
              facts: { choose: { exprs: v.map(String), rule: desc ? 'descending' : 'ascending', orders: list } }
            });
          }),
          T('draw-steps', '막대그래프로 나타내는 차례', '②49 ③47', (d) => {
            const steps = ['가로와 세로 가운데 어느 쪽에 조사한 수를 나타낼지 정한다.', '눈금 한 칸의 크기와 눈금의 수를 정한다.', '조사한 수에 맞게 막대를 그린다.'];
            const shown = d.until(() => d.shuffle([0, 1, 2]), (s) => s.join() !== '0,1,2'), right = [0, 1, 2].map((step) => shown.indexOf(step));
            const options = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C('표를 막대그래프로 나타내는 차례대로 쓴 것은?', options.map((o) => o.map((i) => LABELS[i]).join(', ')), options.findIndex((o) => o.join() === right.join()), {
              figure: tagged(shown.map((step) => steps[step])), explain: '가로와 세로에 무엇을 나타낼지 정하고, 눈금 한 칸의 크기와 눈금의 수를 정한 다음, 조사한 수에 맞게 막대를 그린다.', facts: { sequence: { ranks: shown, options } }
            });
          }),
          T('draw-how', '막대그래프로 나타내는 방법', '심75', (d) => {
            const rows = d.shuffle([['가로와 세로 가운데 어느 쪽에 조사한 수를 나타낼지 정한다.', true], ['조사한 수 가운데 가장 작은 수까지만 나타낼 수 있게 눈금의 수를 정한다.', false], ['조사한 수에 맞게 막대를 그린다.', true], ['막대그래프에 알맞은 제목을 붙인다.', true]]);
            return C('표를 막대그래프로 나타내는 방법으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
              explain: '눈금은 조사한 수 가운데 가장 큰 수까지 나타낼 수 있어야 한다. 가장 작은 수까지만 나타내면 긴 막대를 그릴 수 없다.', facts: truthOf(rows, false)
            });
          }),
          T('draw-wrong', '표와 다르게 나타낸 막대 찾기', '심76', (d) => {
            const c = pick(d, 'tree', 4), v = nums(d, 4, 3, 13, 2), k = d.int(0, 3), wrong = v.slice();
            wrong[k] = v[k] + (d.bool() ? 2 : -2);      // 막대를 한 칸 더(덜) 그린 항목
            return C(`표를 보고 막대그래프로 나타내었다. 표와 다르게 나타낸 ${josa(c.kind, '은/는')}?`, c.names.map(c.tag), k, {
              figure: tab(c, v) + chart(c, wrong, { step: 2 }), explain: `세로 눈금 한 칸은 2그루이다. ${josa(c.tag(c.names[k]), '은/는')} 표에서 ${v[k]}그루인데 막대그래프에는 ${wrong[k]}그루로 나타내었다.`,
              facts: { mismatch: { table: v, drawn: wrong } }
            });
          }),
          T('draw-fit', '모눈에 다 그릴 수 없는 막대 찾기', '심76', (d) => {
            const [step, key] = d.pick([[1, 'sport'], [2, 'tree'], [10, 'town']]), c = pick(d, key, 4), grid = d.pick([10, 12]);
            const v = nums(d, 4, 4, grid + 4, step, (x) => x.filter((y) => y > step * grid).length === 1 && x.filter((y) => y >= step * (grid - 2) && y <= step * grid).length >= 1);
            return C(`${lead(c, '표')} 이 표를 세로 눈금 한 칸이 ${U(c, step, '을/를')} 나타내고 세로 눈금이 모두 ${grid}칸인 모눈종이에 막대그래프로 나타내려고 한다. 막대를 끝까지 그릴 수 없는 ${josa(c.kind, '은/는')}?`, c.names.map(c.tag), v.findIndex((y) => y > step * grid), {
              figure: tab(c, v), explain: `눈금 ${grid}칸으로는 ${step} × ${grid} = ${step * grid}(${c.unit})까지 나타낼 수 있다. ${told(c, v, v.findIndex((y) => y > step * grid))}이므로 끝까지 그릴 수 없다.`,
              facts: { only: { values: v, test: 'atLeast', target: step * grid + 1 } }
            });
          })
        ]
      },
      {
        id: 'collect', title: '자료를 조사하여 표와 막대그래프로 나타내기', standard: DRAW,
        types: [
          T('col-table', '조사한 자료를 세어 표로 정리하기', '①73 ②50·51·52 ③63 ③65 심47', (d) => {
            const c = pick(d, d.pick(['snack', 'sport']), 4), counts = d.until(() => [d.int(2, 7), d.int(2, 7), d.int(2, 6), d.int(2, 6)], (x) => new Set(x).size >= 3 && sum(x) >= 16 && sum(x) <= 20);
            const list = d.shuffle(c.names.flatMap((n, i) => Array(counts[i]).fill(n))), k = d.int(0, 3);
            return M(`${c.intro} 조사한 것이다. 조사한 것을 표로 정리할 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: counts[k] }, { label: LABELS[1], answer: sum(counts) }], {
              figure: words(list) + tab(c, counts.map((x, i) => (i === k ? box(LABELS[0]) : x)), [['합계', box(LABELS[1])]]),
              explain: `빠뜨리거나 두 번 세지 않도록 표시하면서 센다. ${josa(c.names[k], '은/는')} ${counts[k]}번 나온다. 합계는 ${counts.join(' + ')} = ${sum(counts)}(명)이다.`,
              facts: { tallyOf: { list, target: c.names[k] }, calc: [[counts.join('+'), 1]], unseen: [counts[k]] }
            });
          }),
          T('col-kinds', '조사한 항목의 가짓수', '①72 ②52', (d) => {
            const pool = ['피아노', '기타', '드럼', '단소', '플루트', '리코더'], used = d.shuffle(pool).slice(0, d.int(3, 5)), list = d.shuffle(used.flatMap((n) => Array(d.int(2, 4)).fill(n)));
            return N('학생들이 배우고 싶은 악기를 조사한 것이다. 표로 정리할 때, 악기는 모두 몇 가지인가?', used.length, {
              unit: '가지', figure: words(list), explain: `같은 악기는 한 번만 센다. ${pool.filter((n) => used.includes(n)).join(', ')}의 ${used.length}가지이다.`, facts: { count: pool.map((n) => list.includes(n)) }
            });
          }),
          T('col-shapes', '그림 자료를 세어 막대의 칸 수 구하기', '③64 ③66 심47', (d) => {
            const kinds = ['삼각형', '사각형', '원'], counts = d.until(() => [d.int(3, 8), d.int(3, 8), d.int(3, 8)], (x) => new Set(x).size === 3 && sum(x) >= 14 && sum(x) <= 18);
            const list = d.shuffle(kinds.flatMap((n, i) => Array(counts[i]).fill(n))), k = d.int(0, 2);
            return N(`색종이를 오려서 만든 조각이다. 모양별 조각의 수를 세로 눈금 한 칸이 1개인 막대그래프로 나타낼 때, ${josa(kinds[k], '을/를')} 나타내는 막대는 몇 칸으로 그려야 하는가?`, counts[k], {
              unit: '칸', figure: scraps(list), explain: `${josa(kinds[k], '은/는')} 모두 ${counts[k]}개이다. 한 칸이 1개이므로 ${counts[k]}칸으로 그린다.`, facts: { tallyOf: { list, target: kinds[k] } }
            });
          }),
          T('col-longest', '자료를 막대그래프로 나타낼 때 가장 긴 막대', '①73 ②52', (d) => {
            const c = pick(d, d.pick(['fruit', 'place']), 4), counts = d.until(() => [d.int(2, 7), d.int(2, 7), d.int(2, 7), d.int(2, 7)], (x) => x.filter((y) => y === top(x)).length === 1 && sum(x) >= 14 && sum(x) <= 18);
            const list = d.shuffle(c.names.flatMap((n, i) => Array(counts[i]).fill(n)));
            return C(`${c.intro} 조사한 것이다. 조사한 것을 막대그래프로 나타낼 때, 막대가 가장 긴 ${josa(c.kind, '은/는')}?`, c.names, counts.indexOf(top(counts)), {
              figure: words(list), explain: `${c.names.map((n, i) => `${n} ${counts[i]}명`).join(', ')}이다. 수가 가장 많은 ${c.names[counts.indexOf(top(counts))]}의 막대가 가장 길다.`,
              facts: { choose: { exprs: counts.map(String), rule: 'max' }, unseen: counts }
            });
          }),
          T('col-steps', '자료를 조사하여 막대그래프로 나타내는 차례', '②49 ③67', (d) => {
            const steps = ['조사할 주제를 정한다.', '주제에 맞게 자료를 모은다.', '모은 자료를 표와 막대그래프로 나타낸다.', '막대그래프를 보고 알게 된 것을 이야기한다.'];
            const shown = d.until(() => d.shuffle([0, 1, 2, 3]), (s) => s.join() !== '0,1,2,3'), right = [0, 1, 2, 3].map((step) => shown.indexOf(step));
            const options = d.shuffle([right, right.slice().reverse(), [right[1], right[0], right[2], right[3]], [right[0], right[1], right[3], right[2]]]);
            return C('자료를 조사하여 막대그래프로 나타내고 알아보는 차례대로 쓴 것은?', options.map((o) => o.map((i) => LABELS[i]).join(', ')), options.indexOf(right), {
              figure: tagged(shown.map((step) => steps[step])), explain: '주제를 정하고, 자료를 모은 다음, 모은 자료를 표와 막대그래프로 나타내고, 그래프를 보고 알게 된 것을 이야기한다.', facts: { sequence: { ranks: shown, options } }
            });
          })
        ]
      },
      { id: 'judge', title: '막대그래프를 보고 알 수 있는 것', standard: READ, types: [] },
      { id: 'miss', title: '막대가 빠진 항목 구하기', standard: READ, types: [] },
      { id: 'scale', title: '눈금 한 칸의 크기 알아내기', standard: READ, types: [] },
      { id: 'two', title: '두 막대그래프와 막대가 둘인 그래프', standard: READ, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
