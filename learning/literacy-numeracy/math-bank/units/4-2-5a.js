// 4학년 2학기 5단원 꺾은선그래프 — 단원 틀과 기본 문항(알아보기, 값 읽기와 계산하기, 변화 읽기, 사이의 값과 앞날 예상, 물결선).
// 수집해 둔 교과서 10종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 75·66·61꼴, 심화꼴 81꼴)을 처음부터 끝까지 대조하여,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 주고 무엇을 묻는가를 따져서 실었다. 뽑은 글에는 그래프 그림이 없어
// 그래프의 수와 상황은 모두 새로 정했다. (표를 그래프로 나타내기·자료 정리·빠진 값·두 꺾은선·알맞은 그래프 고르기의 기본 문항과 실력 문항은 4-2-5b.js에 있다.)
//
// 싣는 기준
//  - 주는 것(꺾은선그래프 하나, 막대그래프와 꺾은선그래프, 물결선이 있는 그래프, 물결선이 있는 것과 없는 것 두 그래프, 표만)과
//    묻는 것(가로·세로, 눈금 한 칸, 한 때의 값, 값이 얼마인 때, 가장 큰·작은 값, 차, 가장 많이 늘어난·줄어든 사이, 변화가 없는 사이,
//    전날보다 가장 많이 변한 때, 사이의 값, 앞날 예상 …)이 다르면 다른 문제다. 조사한 것(온도·키·판매량)만 다른 것, 숫자만 다른 것은 한 번만 싣는다.
//  - 값과 눈금은 모두 자연수이고, 점은 눈금 선 위에 꼭 맞게 놓인다. 원문의 소수 눈금(한 칸 0.1 kg, 0.2 cm)은 자연수 자료로 바꾸었다.
//  - 사이의 값은 두 점의 가운데가 눈금 선 위에 놓이게 정하고 「그래프에서 읽을 때 약 얼마인가」로 묻는다(두 값을 더해 2로 나누는 셈을 시키는 것이 아니다).
//  - 설명·까닭을 쓰는 꼴(서술형)은 옳은 설명 고르기로, 그래프를 그리는 꼴(작도)은 칸 수·자리 고르기로 바꾸어 실었다(4-2-5b.js).
//  - 실제 지명·사람 이름·통계 수치는 쓰지 않는다(가 초등학교, 가 지역, 엔진에 있는 지어낸 이름).
//  - 수와 단위 기호는 띄어 쓴다(32 kg, 14 °C). 온도의 단위는 「°C」로 적는다(엔진이 그림 설명에서 띄어 적는 글자). 엔진의 꺾은선그래프는 세로 단위 글자가 길면 왼쪽이 잘려, 단위 글자를 그림 왼쪽 끝에 맞추어 다시 놓았다(fixUnit).
//  - 자료는 그럴듯하게: 키·몸무게처럼 자라는 것은 줄곧 늘어나게, 학생 수·온도는 한 번에 크게 바뀌지 않게 뽑는다(vals의 grow·swing).
//  - 같은 자료를 물결선 없이 그린 그래프와 물결선을 넣어 그린 그래프를 함께 줄 때에도 두 그래프 모두에서 점이 눈금 선 위에 놓이게 값을 정했다(DUAL).
//
// 뺀 것과 까닭(꼴 번호마다의 판정은 references/textbooks/수학/_분석/4-2-5/싣기_대조표.md에 적었다)
//  - 소수의 나눗셈(6학년): 세로 눈금 한 칸이 0.2인 그래프에서 한 칸의 크기 구하기(①7 ②3의 변형 ③6 심5), 단위를 바꾸어 0.2 cm 눈금 정하기(심40)
//  - 뜻 없는 셈: 두 그래프의 눈금 한 칸의 크기의 차(①43 심41의 변형), 가장 많이 오른 때와 가장 적게 오른 때의 시각을 더하기(②24의 변형)
//  - 답이 하나로 정해지지 않는 것: 오르내리는 그래프에서 다음 값을 예상할 수 있는가(①35), 다음 값을 수로 예상하고 까닭 쓰기(②31의 변형 심35·36)
//  - 서술형으로만 할 수 있는 것: 알 수 있는 내용 쓰기(①31 ②28 ③27 심74)
//  - 그림이 필요해 미룬 것: 물결선을 넣은 자리가 서로 다른 그래프 셋에서 바르게 나타낸 것 고르기(③36)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, NAMES, LABELS, box, table, lines, tagged, barChart, lineChart, N, M, C } = B.kit;
  const READ = '4수04-03', DRAW = '4수04-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const sum = (list) => list.reduce((x, y) => x + y, 0), top = (v) => Math.max(...v), low = (v) => Math.min(...v);
  // 단위 기호를 읽는 소리(토씨를 붙일 때 쓴다). 여기에 있는 단위는 수와 띄어 쓴다.
  const SOUND = { cm: '센티미터', mm: '밀리미터', kg: '킬로그램', '°C': '도', L: '리터' };
  const tail = (word, pair) => josa(word, pair).slice(word.length);
  const U = (c, n, pair) => n + (SOUND[c.unit] ? ' ' : '') + c.unit + (pair ? tail(SOUND[c.unit] || c.unit, pair) : '');
  const UT = (c, pair) => c.unit + tail(SOUND[c.unit] || c.unit, pair);
  // 수를 적는 굵은 눈금 사이의 칸 수: 한 칸이 5·50이면 두 칸마다(0, 10, 20 …), 그 밖에는 다섯 칸마다 적는다.
  const MAJOR = { 5: 2, 50: 2 };
  const DAYS = ['월', '화', '수', '목', '금', '토'], MONTHS = ['3월', '4월', '5월', '6월', '7월', '8월', '9월'], DATES = ['1일', '2일', '3일', '4일', '5일', '6일', '7일'];
  const day = (n) => n + '요일', as = (n) => n;
  const COUNT = { big: '많은', small: '적은' };
  // 조사한 것. names: 가로에 적는 것, title: 가로의 이름, time: 가로의 한 때를 가리키는 말, tag(n): 글에 적는 때, row(n): 표에 적는 때(없으면 tag), unit: 단위, noun: 세로가 나타내는 것,
  // what: 그래프의 제목, intro: 머리말, s: [눈금 한 칸의 크기, 가장 작은 칸 수, 가장 큰 칸 수], swing: 한 번에 바뀌는 칸 수의 한도, grow: 줄곧 늘어나는 자료가 한 번에 느는 칸 수, big·small: 크기를 이르는 말.
  const SETS = {
    ice: Object.assign({ names: DAYS, title: '요일', time: '요일', tag: day, unit: '개', noun: '판매량', what: '요일별 아이스크림 판매량', intro: '어느 가게의 아이스크림 판매량을 요일별로', s: [2, 3, 14] }, COUNT),
    jump: Object.assign({ names: DAYS, title: '요일', time: '요일', tag: day, unit: '회', noun: '줄넘기 횟수', what: '요일별 줄넘기 횟수', intro: '하린이의 줄넘기 횟수를 요일별로', s: [10, 3, 14] }, COUNT),
    book: Object.assign({ names: MONTHS, title: '월', time: '달', tag: as, unit: '권', noun: '빌린 책 수', what: '월별 빌린 책 수', intro: '학급 문고에서 빌린 책 수를 월별로', s: [1, 3, 14] }, COUNT),
    visit: Object.assign({ names: DATES, title: '날짜', time: '날', tag: as, unit: '명', noun: '방문자 수', what: '날짜별 도서관 방문자 수', intro: '어느 도서관의 방문자 수를 날짜별로', s: [5, 3, 13] }, COUNT),
    pop: Object.assign({ names: ['2019', '2020', '2021', '2022', '2023', '2024'], title: '연도', time: '해', tag: (n) => n + '년', unit: '명', noun: '학생 수', what: '연도별 가 초등학교의 학생 수', intro: '가 초등학교의 학생 수를 연도별로', s: [20, 4, 14], swing: 3 }, COUNT),
    park: Object.assign({ names: DAYS, title: '요일', time: '요일', tag: day, unit: '명', noun: '입장객 수', what: '요일별 놀이공원 입장객 수', intro: '어느 놀이공원의 입장객 수를 요일별로', s: [100, 3, 14] }, COUNT),
    rain: Object.assign({ names: MONTHS.slice(1), title: '월', time: '달', tag: as, unit: 'mm', noun: '강수량', what: '월별 가 지역의 강수량', intro: '가 지역의 강수량을 월별로', s: [20, 2, 13] }, COUNT),
    temp: { names: ['1시', '2시', '3시', '4시', '5시', '6시'], title: '시각', time: '시각', tag: (n) => '오후 ' + n, unit: '°C', noun: '온도', what: '시각별 교실의 온도', intro: '어느 날 오후 교실의 온도를 한 시간마다', s: [2, 5, 13], swing: 2, big: '높은', small: '낮은' },
    bean: { names: ['1일', '3일', '5일', '7일', '9일', '11일'], title: '날짜', time: '날', tag: as, unit: 'cm', noun: '키', what: '날짜별 강낭콩의 키', intro: '강낭콩의 키를 이틀마다', s: [1, 1, 14], grow: [1, 4], big: '큰', small: '작은' },
    dog: Object.assign({ names: MONTHS, title: '월', time: '달', tag: as, unit: 'kg', noun: '몸무게', what: '월별 강아지의 몸무게', intro: '강아지의 몸무게를 매달 1일에', s: [1, 2, 13], grow: [1, 3] }, COUNT, { big: '무거운', small: '가벼운' }),
    weight: Object.assign({ names: MONTHS, title: '월', time: '달', tag: as, unit: 'kg', noun: '몸무게', what: '월별 서연이의 몸무게', intro: '서연이의 몸무게를 매달 1일에' }, COUNT, { big: '무거운', small: '가벼운' }),
    tall: { names: ['1학년', '2학년', '3학년', '4학년', '5학년', '6학년'], title: '학년', time: '학년', tag: (n) => n + ' 때', row: as, unit: 'cm', noun: '키', what: '학년별 민재의 키', intro: '민재의 키를 학년별로', big: '큰', small: '작은' },
    type: Object.assign({ names: DATES, title: '날짜', time: '날', tag: as, unit: '타', noun: '타자 수', what: '날짜별 지우의 타자 수', intro: '지우가 1분 동안 친 타자 수를 날짜별로', s: [10, 5, 14] }, COUNT),
    candle: { names: ['2분', '4분', '6분', '8분', '10분', '12분'], title: '시간', time: '때', tag: (n) => `불을 붙이고 ${n} 뒤`, unit: 'mm', noun: '길이', what: '시간별 양초의 길이', intro: '불을 붙인 양초의 길이를 2분마다' },
    run: { names: DATES, title: '날짜', time: '날', tag: as, unit: '초', noun: '달리기 기록', what: '날짜별 도현이의 달리기 기록', intro: '도현이의 50 m 달리기 기록을 날짜별로' },
    tank: { names: DAYS, title: '요일', time: '요일', tag: day, unit: 'L', noun: '남은 물의 양', what: '요일별 물통에 남은 물의 양', intro: '물통에 남은 물의 양을 날마다 저녁에' }
  };
  // 유형마다 조사한 것 하나를 골라 가로에 적을 것 n개를 잇달아 뽑는다(start 를 주면 그 자리부터).
  const pick = (d, key, n, start) => { const s = SETS[key], at = start == null ? d.int(0, s.names.length - n) : start; return Object.assign({}, s, { key, names: s.names.slice(at, at + n) }); };
  const lead = (c, as2) => `${c.intro} 조사하여 나타낸 ${as2 || '꺾은선그래프'}이다.`;
  const one = (c, n) => `${c.tag(n)}의 ${c.noun}`;
  const said = (c, v, i) => `${josa(c.tag(c.names[i]), '은/는')} ${U(c, v[i])}`;
  // 이웃한 두 때 사이: 「수요일과 목요일 사이」
  const between = (c, i) => `${josa(c.tag(c.names[i]), '과/와')} ${c.tag(c.names[i + 1])} 사이`;
  // 엔진의 꺾은선그래프는 세로 단위 글자((cm)·(mm))가 그림 왼쪽 밖으로 나가 잘린다. 단위 글자를 그림 왼쪽 끝에서 시작하게 옮긴다.
  const fixUnit = (html) => html.replace(/(<text class="mb-axis-label"[^>]*?) x="[\d.]+" (y="14\.0") text-anchor="end">(\([^<]*\))<\/text>/, '$1 x="2" $2 text-anchor="start">$3</text>');
  const chart = (c, v, o) => fixUnit(lineChart(c.names, v, Object.assign({ unit: c.unit, title: c.title, major: MAJOR[(o || {}).step] || 5 }, o || {})));
  const bars = (c, v, o) => barChart(c.names, v, Object.assign({ unit: c.unit, title: c.title, major: MAJOR[(o || {}).step] || 5 }, o || {}));
  // 표는 때를 세로로 놓는다(가로로 길면 휴대폰 너비를 넘는다).
  const tab = (c, v) => table([c.title, `${c.noun}(${c.unit})`], c.names.map((n, i) => [(c.row || c.tag)(n), v[i]]));
  // 그래프 위에 이름을 붙인다(두 그래프를 함께 놓을 때).
  const cap = (label, html) => `<div style="display:grid;gap:2px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${label}</div>${html}</div>`;
  // 칸 수 n개: lo~hi 에서 뽑고 ok(칸 수들)을 만족할 때까지 다시 뽑는다. 값은 칸 수에 눈금 한 칸의 크기를 곱한 것이다.
  const cellsOf = (d, n, lo, hi, ok) => d.until(() => Array.from({ length: n }, () => d.int(lo, hi)), (x) => !ok || ok(x));
  // 조사한 것에 맞는 값: 자라는 것(grow: [한 번에 느는 칸 수의 범위])은 줄곧 늘어나게, 한 번에 크게 바뀌지 않는 것(swing)은 그 칸 수 안에서만 바뀌게 뽑는다.
  const vals = (d, c, n, ok, step) => {
    const fine = (x) => (!c.swing || gaps(x).every((g) => Math.abs(g) <= c.swing)) && (!ok || ok(x));
    return (c.grow ? d.until(() => climb(d, n, [c.s[1], c.s[1] + 2], c.grow[0], c.grow[1], c.s[2]), fine) : cellsOf(d, n, c.s[1], c.s[2], fine)).map((x) => x * (step || c.s[0]));
  };
  const gaps = (v) => v.slice(1).map((x, i) => x - v[i]);
  const mags = (v) => gaps(v).map(Math.abs);
  const distinct = (x) => new Set(x).size === x.length;
  const lone = (list, x) => list.filter((y) => y === x).length === 1;
  // 줄곧 늘어나는(줄어드는) 칸 수: 처음 칸 수에서 lo~hi 칸씩 달라진다.
  const climb = (d, n, first, lo, hi, limit) => d.until(() => { const x = [d.int(first[0], first[1])]; for (let i = 1; i < n; i += 1) x.push(x[i - 1] + d.int(lo, hi)); return x; }, (x) => top(x) <= limit && low(x) >= 1);
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const PAIRS5 = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]];
  const axisRows = (c) => [[`가로: ${c.title}, 세로: ${c.noun}`, true], [`가로: ${c.noun}, 세로: ${c.title}`, false], [`가로: ${c.title}, 세로: 조사한 사람`, false], [`가로: 눈금 한 칸의 크기, 세로: ${c.noun}`, false]];
  // 네 구간(다섯 때)을 변화가 큰 것부터 늘어놓은 차례 넷: 바른 차례, 거꾸로, 그래프에 놓인 차례, 가운데 둘을 바꾼 것. 넷이 서로 다르게 되는 수만 쓴다.
  const orderable = (x) => !['0123', '3210', '0213', '3120'].includes([0, 1, 2, 3].sort((p, q) => x[q] - x[p]).join(''));
  // 꺾은선의 점 하나를 지운다(선분은 그대로 둔다). 그림 설명에서도 그 값을 지운다.
  const dropDot = (html, c, v, i) => { let n = -1; return html.replace(/<circle [^>]*\/>/g, (m) => { n += 1; return n === i ? '' : m; }).replace(`${c.names[i]} ${U(c, v[i])}`, `${c.names[i]} 점 없음`); };
  // 물결선이 있는 그래프의 자료. step: 눈금 한 칸, major: 굵은 눈금 사이의 칸 수, from: 물결선 위 첫 눈금, hi: 가장 높은 점의 칸 수.
  const WAVES = [{ key: 'weight', step: 1, major: 5, from: 30, hi: 9, swing: 2 }, { key: 'tall', step: 2, major: 5, from: 110, hi: 14, grow: true }, { key: 'type', step: 10, major: 5, from: 200, hi: 14, swing: 5 }, { key: 'pop', step: 5, major: 2, from: 300, hi: 13, swing: 4 }];
  const wave = (d, n, ok, among) => {
    const w = d.pick(among || WAVES), c = pick(d, w.key, n), fine = (x) => !ok || ok(x, w);
    const cells = w.grow ? d.until(() => climb(d, n, [1, 3], 1, 4, w.hi), fine) : cellsOf(d, n, 1, w.hi, (x) => gaps(x).every((g) => Math.abs(g) <= w.swing) && new Set(x).size >= n - 1 && fine(x));
    return Object.assign({ c, cells, v: cells.map((x) => w.from + x * w.step) }, w);
  };
  const waved = (w, v) => chart(w.c, v || w.v, { step: w.step, major: w.major, from: w.from });
  // 같은 자료를 물결선 없이(가) 그리고 물결선을 넣어(나) 그린 두 그래프. sa·sb: 두 그래프의 눈금 한 칸, ma·mb: 굵은 눈금 사이의 칸 수, levels: 값으로 쓸 수(두 그래프 모두에서 눈금 선 위에 놓인다).
  const DUAL = [{ key: 'visit', sa: 10, ma: 5, sb: 2, mb: 5, from: 100, levels: [110, 120, 130, 140], roof: 150 }, { key: 'type', sa: 20, ma: 5, sb: 5, mb: 4, from: 200, levels: [220, 240, 260, 280, 300], roof: 300 }];
  const dual = (d, key) => {
    const w = key ? DUAL.find((x) => x.key === key) : d.pick(DUAL), c = pick(d, w.key, 5), v = d.until(() => Array.from({ length: 5 }, () => d.pick(w.levels)), (x) => new Set(x).size >= 3 && gaps(x).every((g) => g !== 0) && low(x) === w.levels[0]);
    const plain = chart(c, v, { step: w.sa, major: w.ma, top: w.roof }), cut = chart(c, v, { step: w.sb, major: w.mb, from: w.from });
    return Object.assign({ c, v, plain, cut }, w);
  };
  // 눈금에 적힌 수를 기호로 바꾸거나 지운다(0은 남긴다). map: { 100: '㉠' }
  const relabel = (html, map) => html.replace(/(<text class="mb-axis-label"[^>]*>)(\d+)(<\/text>)/g, (all, head, n, end) => (map[n] ? head.replace('font-size:11px', 'font-size:14px') + map[n] + end : n === '0' ? all : ''));

  B.addUnit({
    id: '4-2-5', grade: 4, semester: 2, no: 5, title: '꺾은선그래프', version: 1,
    groups: [
      {
        id: 'know', title: '꺾은선그래프 알아보기', standard: READ,
        types: [
          T('know-name', '꺾은선그래프의 뜻', '①1 ②1 ③1 심1', (d) => {
            const list = d.shuffle(['꺾은선그래프', '막대그래프', '그림그래프', '표']);
            return C('수량을 점으로 표시하고, 그 점들을 선분으로 이어 그린 그래프를 무엇이라고 하는가?', list, list.indexOf('꺾은선그래프'), { explain: '수량을 점으로 표시하고, 그 점들을 선분으로 이어 그린 그래프를 꺾은선그래프라고 한다.', facts: { truth: list.map((w) => w === '꺾은선그래프'), want: true } });
          }),
          T('know-dots', '꺾은선그래프를 이루는 것', '①1 ②45 ③43', (d) => {
            const rows = d.shuffle([['㉠ 점, ㉡ 선분', true], ['㉠ 선분, ㉡ 점', false], ['㉠ 막대, ㉡ 선분', false], ['㉠ 점, ㉡ 막대', false]]);
            return C('꺾은선그래프는 가로 눈금과 세로 눈금이 만나는 자리에 ( ㉠ )을 찍고, 그 ( ㉠ )들을 ( ㉡ )으로 이어 그린다. ㉠, ㉡에 알맞은 말을 바르게 짝 지은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '가로 눈금과 세로 눈금이 만나는 자리에 점을 찍고, 그 점들을 선분으로 이어 그린다.', facts: truthOf(rows, true)
            });
          }),
          T('know-not', '꺾은선그래프의 설명이 아닌 것', '①2 ②6', (d) => {
            const rows = d.shuffle([['수량을 점으로 표시하고 그 점들을 선분으로 이어 그린다.', true], ['시간에 따라 변하는 모습을 한눈에 알아보기 쉽다.', true], ['자료의 수량을 막대의 길이로 나타낸다.', false], ['선분이 기울어진 정도로 변화의 크기를 알 수 있다.', true]]);
            return C('꺾은선그래프에 대한 설명으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
              explain: '수량을 막대의 길이로 나타내는 것은 막대그래프이다. 꺾은선그래프는 점을 찍고 선분으로 이어 변화를 나타낸다.', facts: truthOf(rows, false)
            });
          }),
          T('know-good', '꺾은선그래프로 나타내면 좋은 점', '①8 ③61', (d) => {
            const rows = d.shuffle([['시간에 따라 수량이 변하는 모습을 한눈에 알아보기 쉽다.', true], ['조사한 수의 합계가 적혀 있어 전체 수를 바로 알 수 있다.', false], ['그림의 크기와 수로 수량을 나타내어 재미있게 볼 수 있다.', false], ['항목의 이름이 가나다 차례로 놓여 찾기 쉽다.', false]]);
            return C('자료를 꺾은선그래프로 나타내면 좋은 점은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '꺾은선그래프는 선분이 기울어진 방향과 정도로 수량이 변하는 모습을 한눈에 알아볼 수 있다.', facts: truthOf(rows, true)
            });
          }),
          T('know-topic', '무엇을 조사한 꺾은선그래프인지 알기', '①3 ③2', (d) => {
            const [key, thing, other] = d.pick([['dog', '강아지', '키'], ['bean', '강낭콩', '무게']]), c = pick(d, key, 5, 0), v = climb(d, 5, [1, 3], 1, 3, 13);
            const rows = d.shuffle([[c.what, true], [`${c.title}별 ${thing}의 ${other}`, false], [`요일별 ${thing}의 ${c.noun}`, false], [`${c.noun}별 ${thing}의 수`, false]]);
            return C(`${josa(thing, '을/를')} 조사하여 나타낸 꺾은선그래프이다. 무엇을 조사하여 나타낸 것인가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: chart(c, v), explain: `가로에는 ${josa(c.title, '을/를')}, 세로에는 ${c.noun}(${c.unit})${tail(c.noun, '을/를')} 나타내었으므로 ${josa(c.what, '을/를')} 조사하여 나타낸 것이다.`, facts: truthOf(rows, true)
            });
          }),
          T('know-axes', '가로와 세로가 나타내는 것', '①4 ②2 ③3 심2', (d) => {
            const c = pick(d, d.pick(['temp', 'jump', 'rain']), 5), v = vals(d, c, 5, distinct), rows = d.shuffle(axisRows(c));
            return C(`${lead(c)} 가로와 세로는 각각 무엇을 나타내는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: chart(c, v, { step: c.s[0] }), explain: `가로에는 ${josa(c.title, '이/가')} 적혀 있고, 세로의 눈금은 ${josa(c.noun, '을/를')} 나타낸다.`, facts: truthOf(rows, true)
            });
          }),
          T('know-line', '꺾은선이 나타내는 것', '①5 ②4 ③4 심3', (d) => {
            const c = pick(d, d.pick(['ice', 'visit', 'dog']), 5), v = vals(d, c, 5, (x) => gaps(x).every((g) => g !== 0));
            const rows = d.shuffle([[`${c.noun}의 변화`, true], [`조사한 ${c.time}의 수`, false], ['세로 눈금 한 칸의 크기', false], [`${josa(c.noun, '을/를')} 조사한 사람의 수`, false]]);
            return C(`${lead(c)} 꺾은선은 무엇을 나타내는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: chart(c, v, { step: c.s[0] }), explain: `점들을 이은 꺾은선은 ${c.title}에 따라 ${josa(c.noun, '이/가')} 변하는 모습을 나타낸다.`, facts: truthOf(rows, true)
            });
          }),
          T('know-step-one', '세로 눈금 한 칸의 크기(한 칸이 1)', '①6 ②3 ③5 심4', (d) => {
            const c = pick(d, d.pick(['book', 'bean', 'dog']), 5), v = vals(d, c, 5, (x) => top(x) > 5 && distinct(x), 1);
            return N(`${lead(c)} 세로 눈금 한 칸은 몇 ${UT(c, '을/를')} 나타내는가?`, 1, {
              unit: c.unit, figure: chart(c, v), explain: `세로 눈금 5칸이 ${U(c, 5, '을/를')} 나타내므로 한 칸은 5 ÷ 5 = 1(${c.unit})${tail(SOUND[c.unit] || c.unit, '을/를')} 나타낸다.`, facts: { calc: [['5/5', 0]], unseen: [5], rule: 'one' }
            });
          }),
          T('know-step', '세로 눈금 한 칸의 크기(한 칸이 1이 아님)', '①6 ②3 ③5 심4', (d) => {
            const [step, major, key] = d.pick([[2, 5, 'ice'], [5, 2, 'visit'], [10, 5, 'jump'], [20, 5, 'pop'], [20, 5, 'rain'], [100, 5, 'park']]), c = pick(d, key, 5);
            const v = vals(d, c, 5, (x) => top(x) > major && distinct(x), step);
            return N(`${lead(c)} 세로 눈금 한 칸은 몇 ${UT(c, '을/를')} 나타내는가?`, step, {
              unit: c.unit, figure: chart(c, v, { step, major }), explain: `세로 눈금 ${major}칸이 ${U(c, major * step, '을/를')} 나타내므로 한 칸은 ${major * step} ÷ ${major} = ${step}(${c.unit})${tail(SOUND[c.unit] || c.unit, '을/를')} 나타낸다.`,
              facts: { calc: [[`${major * step}/${major}`, 0]], unseen: [major * step, major], rule: 'many' }
            });
          }),
          T('know-gap', '며칠마다 조사하였는지 알기', '②5 ③7 심6', (d) => {
            const gap = d.pick([2, 3, 5, 7]), first = d.int(1, 3), c = Object.assign({}, SETS.bean, { names: [0, 1, 2, 3, 4].map((i) => `${first + i * gap}일`) }), v = climb(d, 5, [1, 3], 1, 3, 13);
            return N('강낭콩의 키를 며칠에 한 번씩 조사하여 나타낸 꺾은선그래프이다. 며칠마다 조사하였는가?', gap, {
              unit: '일', figure: chart(c, v), explain: `가로에 적힌 날짜가 ${c.names.slice(0, 3).join(', ')} …로 ${gap}일씩 커진다. ${first + gap} - ${first} = ${gap}`, facts: { calc: [[`${first + gap}-${first}`, 0]] }
            });
          }),
          T('know-say', '꺾은선그래프의 생김새에 대한 설명', '③8 심7', (d) => {
            const [step, major, key] = d.pick([[2, 5, 'ice'], [5, 2, 'visit'], [10, 5, 'jump']]), c = pick(d, key, 5), v = cellsOf(d, 5, 2, major === 5 ? 13 : 11, (x) => top(x) > major && distinct(x)).map((x) => x * step), t = d.int(0, 3), k = d.int(0, 4);
            const rows = [
              [`가로는 ${josa(t === 0 ? c.noun : c.title, '을/를')} 나타낸다.`, t !== 0],
              [`세로 눈금 한 칸은 ${U(c, t === 1 ? major * step : step, '을/를')} 나타낸다.`, t !== 1],
              [`꺾은선은 ${t === 2 ? '세로 눈금 한 칸의 크기' : `${c.noun}의 변화`}를 나타낸다.`, t !== 2],
              [`${josa(one(c, c.names[k]), '은/는')} ${U(c, v[k] + (t === 3 ? step : 0))}이다.`, t !== 3]
            ];
            return C(`${lead(c)} 꺾은선그래프에 대한 설명으로 옳지 않은 것은?`, rows.map((r) => r[0]), t, {
              figure: chart(c, v, { step, major }), explain: `가로는 ${c.title}, 세로는 ${josa(c.noun, '을/를')} 나타내고, 꺾은선은 ${c.noun}의 변화를 나타낸다. 세로 눈금 ${major}칸이 ${U(c, major * step)}이므로 한 칸은 ${U(c, step)}이다. ${said(c, v, k)}이다.`, facts: truthOf(rows, false)
            });
          }),
          T('pair-name', '막대그래프와 꺾은선그래프의 이름', '①9 ③53', (d) => {
            const c = pick(d, d.pick(['ice', 'book']), 5), v = vals(d, c, 5, distinct), lineFirst = d.bool(), fig = [bars(c, v, { step: c.s[0] }), chart(c, v, { step: c.s[0] })];
            const rows = d.shuffle([['(가) 막대그래프, (나) 꺾은선그래프', !lineFirst], ['(가) 꺾은선그래프, (나) 막대그래프', lineFirst], ['(가) 막대그래프, (나) 그림그래프', false], ['(가) 그림그래프, (나) 꺾은선그래프', false]]);
            return C(`${c.intro} 조사하여 두 가지 그래프 (가), (나)로 나타내었다. (가), (나)는 각각 무슨 그래프인가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: cap('(가)', fig[lineFirst ? 1 : 0]) + cap('(나)', fig[lineFirst ? 0 : 1]), explain: `막대로 나타낸 ${lineFirst ? '(나)' : '(가)'}는 막대그래프이고, 점을 찍어 선분으로 이은 ${lineFirst ? '(가)' : '(나)'}는 꺾은선그래프이다.`, facts: truthOf(rows, true)
            });
          }),
          T('pair-change', '변화를 한눈에 알아보기 쉬운 그래프', '①10 ①73 ②55 ③55 심77', (d) => {
            const c = pick(d, d.pick(['jump', 'visit']), 5), v = vals(d, c, 5, (x) => gaps(x).every((g) => g !== 0));
            const rows = d.shuffle([['꺾은선그래프 — 선분이 기울어진 방향과 정도로 변화를 알 수 있다.', true], ['막대그래프 — 막대의 굵기로 변화를 알 수 있다.', false], ['막대그래프 — 막대의 수가 조사한 수와 같다.', false], ['꺾은선그래프 — 점의 수가 많을수록 많이 변한 것이다.', false]]);
            return C(`${c.intro} 조사하여 막대그래프와 꺾은선그래프로 나타내었다. ${c.noun}의 변화를 한눈에 알아보기 쉬운 그래프와 그 까닭을 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: bars(c, v, { step: c.s[0] }) + chart(c, v, { step: c.s[0] }), explain: '꺾은선그래프는 선분이 오른쪽 위로 기울면 늘어난 것, 오른쪽 아래로 기울면 줄어든 것이고, 많이 기울수록 많이 변한 것이어서 변화를 한눈에 알아보기 쉽다.', facts: truthOf(rows, true)
            });
          }),
          T('pair-same', '막대그래프와 꺾은선그래프의 같은 점', '①11 ①12 ②54 ③56 심78', (d) => {
            const c = pick(d, d.pick(['book', 'ice']), 5), v = vals(d, c, 5, distinct);
            const rows = d.shuffle([[`가로는 ${josa(c.title, '을/를')}, 세로는 ${josa(c.noun, '을/를')} 나타낸다.`, true], ['수량을 막대의 길이로 나타내었다.', false], ['수량을 점으로 찍고 그 점들을 선분으로 이었다.', false], ['세로 눈금 한 칸의 크기가 서로 다르다.', false]]);
            return C(`${c.intro} 조사하여 막대그래프와 꺾은선그래프로 나타내었다. 두 그래프의 같은 점은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: bars(c, v, { step: c.s[0] }) + chart(c, v, { step: c.s[0] }), explain: `두 그래프 모두 가로는 ${c.title}, 세로는 ${josa(c.noun, '을/를')} 나타내고 세로 눈금 한 칸의 크기도 같다. 막대로 나타낸 것은 막대그래프뿐이고, 점과 선분으로 나타낸 것은 꺾은선그래프뿐이다.`, facts: truthOf(rows, true)
            });
          }),
          T('pair-diff', '막대그래프와 꺾은선그래프의 다른 점', '①11 ②54 ③56 심78', (d) => {
            const c = pick(d, d.pick(['jump', 'visit']), 5), v = vals(d, c, 5, distinct), lineFirst = d.bool(), fig = [bars(c, v, { step: c.s[0] }), chart(c, v, { step: c.s[0] })], [bar, line] = lineFirst ? ['(나)', '(가)'] : ['(가)', '(나)'];
            const rows = d.shuffle([[`${josa(bar, '은/는')} 막대로, ${josa(line, '은/는')} 점과 선분으로 나타내었다.`, true], [`${josa(bar, '은/는')} 가로가 ${c.title}, ${josa(line, '은/는')} 가로가 ${c.noun}이다.`, false], [`${c.tag(c.names[0])}의 ${josa(c.noun, '이/가')} (가)와 (나)에서 서로 다르다.`, false], [`${josa(line, '은/는')} 세로 눈금이 0부터 시작하지 않는다.`, false]]);
            return C(`${c.intro} 조사하여 두 가지 그래프 (가), (나)로 나타내었다. 두 그래프의 다른 점을 바르게 말한 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: cap('(가)', fig[lineFirst ? 1 : 0]) + cap('(나)', fig[lineFirst ? 0 : 1]), explain: `같은 자료를 나타낸 것이므로 가로와 세로가 나타내는 것, 눈금, 나타낸 값은 모두 같다. 다른 점은 ${josa(bar, '은/는')} 막대로, ${josa(line, '은/는')} 점과 선분으로 나타낸 것이다.`, facts: truthOf(rows, true)
            });
          }),
          T('pair-fill', '꺾은선그래프를 보고 막대의 칸 수 구하기', '①13 ②54', (d) => {
            const [step, key] = d.pick([[2, 'ice'], [5, 'visit'], [10, 'jump']]), c = pick(d, key, 5), v = vals(d, c, 5, distinct, step), k = d.int(0, 4), roof = Math.ceil(top(v) / (step * (MAJOR[step] || 5))) * step * (MAJOR[step] || 5);
            return N(`${c.intro} 조사하여 막대그래프와 꺾은선그래프로 나타내고 있다. 막대그래프에 ${c.tag(c.names[k])}의 막대를 그리려고 한다. 막대는 몇 칸으로 그려야 하는가?`, v[k] / step, {
              unit: '칸', figure: bars(c, v.map((x, i) => (i === k ? null : x)), { step, top: roof }) + chart(c, v, { step }),
              explain: `꺾은선그래프에서 ${said(c, v, k)}이다. 세로 눈금 한 칸이 ${U(c, step)}이므로 ${v[k]} ÷ ${step} = ${v[k] / step}(칸)으로 그린다.`, facts: { calc: [[`${v[k]}/${step}`, 0]] }
            });
          })
        ]
      },
      {
        id: 'read', title: '꺾은선그래프에서 값 읽기와 계산하기', standard: READ,
        types: [
          T('read-one', '한 때의 값 읽기(눈금 한 칸이 1)', '①14 ②8 ③9 심9', (d) => {
            const c = pick(d, d.pick(['book', 'dog']), 5), v = vals(d, c, 5, (x) => distinct(x) && x.some((y) => y % 5 !== 0), 1), k = d.until(() => d.int(0, 4), (i) => v[i] % 5 !== 0);
            return N(`${lead(c)} ${josa(one(c, c.names[k]), '은/는')} 몇 ${c.unit}인가?`, v[k], {
              unit: c.unit, figure: chart(c, v), explain: `세로 눈금 한 칸은 ${U(c, 1, '을/를')} 나타낸다. ${c.tag(c.names[k])}의 점은 0에서 ${v[k]}칸 위에 있으므로 ${U(c, v[k])}이다.`, facts: { calc: [[String(v[k]), 0]], rule: 'one' }
            });
          }),
          T('read-step', '한 때의 값 읽기(눈금 한 칸이 1이 아님)', '①14 ②8 ③9 심9', (d) => {
            const [step, key] = d.pick([[2, 'ice'], [5, 'visit'], [10, 'jump'], [20, 'pop'], [20, 'rain']]), major = MAJOR[step] || 5, c = pick(d, key, 5);
            const v = vals(d, c, 5, (x) => distinct(x) && x.some((y) => y % major !== 0), step), cells = v.map((x) => x / step), k = d.until(() => d.int(0, 4), (i) => cells[i] % major !== 0);
            return N(`${lead(c)} ${josa(one(c, c.names[k]), '은/는')} 몇 ${c.unit}인가?`, v[k], {
              unit: c.unit, figure: chart(c, v, { step }), explain: `세로 눈금 ${major}칸이 ${U(c, major * step)}이므로 한 칸은 ${U(c, step, '을/를')} 나타낸다. ${c.tag(c.names[k])}의 점은 0에서 ${cells[k]}칸 위에 있으므로 ${step} × ${cells[k]} = ${v[k]}(${c.unit})이다.`,
              facts: { calc: [[`${step}*${cells[k]}`, 0]], unseen: [cells[k]], rule: 'many' }
            });
          }),
          T('read-find', '값을 보고 그때 찾기', '②9 ③10 심10', (d) => {
            const c = pick(d, d.pick(['jump', 'ice']), 5), v = vals(d, c, 5, distinct), k = d.int(0, 4);
            return C(`${lead(c)} ${josa(c.noun, '이/가')} ${U(c, v[k])}인 ${josa(c.time, '은/는')}?`, c.names.map(c.tag), k, {
              figure: chart(c, v, { step: c.s[0] }), explain: `세로 눈금 ${v[k]}에서 가로로 따라가 만나는 점을 찾고, 그 점의 아래에 적힌 ${josa(c.time, '을/를')} 읽는다. ${said(c, v, k)}이다.`, facts: { choose: { exprs: v.map(String), rule: 'equals', target: v[k] } }
            });
          }),
          T('read-most', '값이 가장 큰 때 찾기', '①16 ②10 ③11 심11', (d) => {
            const c = pick(d, d.pick(['rain', 'visit']), 5), v = vals(d, c, 5, (x) => { const s = x.slice().sort((p, q) => q - p); return distinct(x) && s[0] - s[1] <= 2; }), hi = v.indexOf(top(v));
            return C(`${lead(c)} ${josa(c.noun, '이/가')} 가장 ${c.big} ${josa(c.time, '은/는')}?`, c.names.map(c.tag), hi, {
              figure: chart(c, v, { step: c.s[0] }), explain: `가장 높은 곳에 있는 점을 찾는다. ${c.tag(c.names[hi])}의 점이 ${U(c, v[hi], '으로/로')} 가장 높다.`, facts: { choose: { exprs: v.map(String), rule: 'max' } }
            });
          }),
          T('read-least', '값이 가장 작은 때 찾기', '①16 ②10 ③11 심11', (d) => {
            const c = pick(d, 'pop', 5), v = vals(d, c, 5, (x) => { const s = x.slice().sort((p, q) => p - q); return distinct(x) && s[1] - s[0] <= 2; }), lo = v.indexOf(low(v));
            return C(`${lead(c)} ${josa(c.noun, '이/가')} 가장 ${c.small} ${josa(c.time, '은/는')}?`, c.names.map(c.tag), lo, {
              figure: chart(c, v, { step: 20 }), explain: `가장 낮은 곳에 있는 점을 찾는다. ${c.tag(c.names[lo])}의 점이 ${U(c, v[lo], '으로/로')} 가장 낮다.`, facts: { choose: { exprs: v.map(String), rule: 'min' } }
            });
          }),
          T('read-most-value', '값이 가장 클 때의 값', '②10 ③11 심11', (d) => {
            const c = pick(d, 'temp', 6, 0), v = vals(d, c, 6, (x) => lone(x, top(x)) && top(x) % 5 !== 0 && gaps(x).every((g) => Math.abs(g) <= 3));
            return N(`${lead(c)} 온도가 가장 높았을 때의 온도는 몇 °C인가?`, top(v), {
              unit: '°C', figure: chart(c, v, { step: 2 }), explain: `가장 높은 곳에 있는 점은 ${c.tag(c.names[v.indexOf(top(v))])}의 점이다. 세로 눈금 한 칸이 2 °C이고 점이 0에서 ${top(v) / 2}칸 위에 있으므로 ${top(v)} °C이다.`,
              facts: { calc: [[`2*${top(v) / 2}`, 0]], unseen: [top(v) / 2] }
            });
          }),
          T('read-same', '값이 같은 두 때 찾기', '②11', (d) => {
            const c = pick(d, 'type', 5), [a, b, e, f] = d.shuffle([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).slice(0, 4), v = d.until(() => d.shuffle([a, a, b, e, f]), (x) => gaps(x).every((g) => g !== 0)).map((x) => x * 10);
            const right = PAIRS5.find(([i, j]) => v[i] === v[j]), shown = d.shuffle(d.shuffle(PAIRS5.filter((p) => p !== right)).slice(0, 3).concat([right]));
            return C(`${lead(c)} ${josa(c.noun, '이/가')} 서로 같은 두 ${josa(c.time, '은/는')}?`, shown.map(([i, j]) => `${c.names[i]}, ${c.names[j]}`), shown.indexOf(right), {
              figure: chart(c, v, { step: 10 }), explain: `높이가 같은 두 점을 찾는다. ${josa(c.names[right[0]], '과/와')} ${c.names[right[1]]}의 점이 ${U(c, a * 10, '으로/로')} 같다.`, facts: { choose: { exprs: v.map(String), rule: 'same', pairsShown: shown } }
            });
          }),
          T('read-gap', '두 때의 값의 차', '①17 ②12 ③12 심13', (d) => {
            const c = pick(d, d.pick(['ice', 'rain']), 5), v = vals(d, c, 5, distinct), [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((p, q) => v[q] - v[p]);
            return N(`${lead(c)} ${josa(one(c, c.names[i]), '은/는')} ${one(c, c.names[j])}보다 몇 ${c.unit} 더 ${c.big}가?`, v[i] - v[j], {
              unit: c.unit, figure: chart(c, v, { step: c.s[0] }), explain: `${said(c, v, i)}, ${said(c, v, j)}이다. ${v[i]} - ${v[j]} = ${v[i] - v[j]}`, facts: { calc: [[`${v[i]}-${v[j]}`, 0]] }
            });
          }),
          T('read-range', '가장 큰 값과 가장 작은 값의 차', '①18 ②13 ③13 심15', (d) => {
            const c = pick(d, 'jump', 5), v = vals(d, c, 5, distinct);
            return N(`${lead(c)} 줄넘기를 가장 많이 한 요일과 가장 적게 한 요일의 줄넘기 횟수의 차는 몇 회인가?`, top(v) - low(v), {
              unit: '회', figure: chart(c, v, { step: 10 }), explain: `가장 높은 점은 ${c.tag(c.names[v.indexOf(top(v))])}의 ${top(v)}회, 가장 낮은 점은 ${c.tag(c.names[v.indexOf(low(v))])}의 ${low(v)}회이다. ${top(v)} - ${low(v)} = ${top(v) - low(v)}`,
              facts: { calc: [[`${top(v)}-${low(v)}`, 0]], tableRank: { values: v, a: 0, b: 4 } }
            });
          }),
          T('read-whole', '조사한 동안 늘어난 양', '③14 심14', (d) => {
            const c = pick(d, 'bean', 5, 0), v = climb(d, 5, [1, 3], 1, 4, 14);
            return N(`${lead(c)} 1일부터 9일까지 강낭콩의 키는 몇 cm 자랐는가?`, v[4] - v[0], {
              unit: 'cm', figure: chart(c, v), explain: `1일의 키는 ${v[0]} cm, 9일의 키는 ${v[4]} cm이다. 처음과 끝의 차를 구하면 ${v[4]} - ${v[0]} = ${v[4] - v[0]}(cm)이다.`, facts: { calc: [[`${v[4]}-${v[0]}`, 0]] }
            });
          }),
          T('read-sum', '값을 모두 더하기', '②14 심16', (d) => {
            const c = pick(d, 'book', 5), v = vals(d, c, 5, distinct);
            return N(`${lead(c)} ${c.names[0]}부터 ${c.names[4]}까지 다섯 달 동안 빌린 책은 모두 몇 권인가?`, sum(v), {
              unit: '권', figure: chart(c, v), explain: `점마다 값을 읽어 모두 더한다. ${v.join(' + ')} = ${sum(v)}`, facts: { calc: [[v.join('+'), 0]] }
            });
          }),
          T('read-above', '기준보다 값이 큰 때의 수', '심12', (d) => {
            const c = pick(d, 'visit', 6), [v, t] = d.until(() => [vals(d, c, 6, distinct), d.int(3, 5) * 10], ([x, y]) => !x.includes(y) && x.filter((z) => z > y).length >= 2 && x.filter((z) => z > y).length <= 4);
            const hits = c.names.filter((_, i) => v[i] > t);
            return N(`${lead(c)} 방문자 수가 ${t}명보다 많은 날은 모두 며칠인가?`, hits.length, {
              unit: '일', figure: chart(c, v, { step: 5 }), explain: `세로 눈금 ${t}보다 위에 있는 점을 모두 찾는다. ${hits.join(', ')}의 ${hits.length}일이다.`, facts: { choose: { exprs: v.map(String), rule: 'countAbove', target: t } }
            });
          }),
          T('read-table', '꺾은선그래프를 보고 표 완성하기', '①15 ②49', (d) => {
            const c = pick(d, 'ice', 5), v = vals(d, c, 5, distinct), [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((p, q) => p - q);
            return M(`${lead(c)} 꺾은선그래프를 보고 표로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: v[i] }, { label: LABELS[1], answer: v[j] }], {
              figure: chart(c, v, { step: 2 }) + tab(c, v.map((x, n) => (n === i ? box(LABELS[0]) : n === j ? box(LABELS[1]) : x))),
              explain: `세로 눈금 한 칸은 2개이다. ${said(c, v, i)}, ${said(c, v, j)}이다.`, facts: { calc: [[String(v[i]), 0], [String(v[j]), 1]] }
            });
          }),
          T('read-each', '읽은 값에 하나의 값을 곱하기', '①30 ②15', (d) => {
            const c = pick(d, 'ice', 5), v = cellsOf(d, 5, 4, 14, distinct), k = d.int(0, 4), price = d.pick([300, 500, 700]);
            return N(`${lead(c)} 아이스크림 한 개의 값이 ${price}원일 때, ${c.tag(c.names[k])}에 아이스크림을 판 돈은 얼마인가?`, v[k] * price, {
              unit: '원', figure: chart(c, v), explain: `${said(c, v, k)}이다. ${price} × ${v[k]} = ${v[k] * price}`, facts: { calc: [[`${price}*${v[k]}`, 0]] }
            });
          }),
          T('read-least-each', '값이 가장 작은 때를 찾아 값 곱하기', '심53', (d) => {
            const c = pick(d, 'ice', 5), v = cellsOf(d, 5, 4, 14, (x) => distinct(x) && x.slice().sort((p, q) => p - q)[1] - low(x) <= 2), price = d.pick([300, 500, 700]);
            return N(`${lead(c)} 아이스크림 한 개의 값이 ${price}원일 때, 판매량이 가장 적은 요일에 아이스크림을 판 돈은 얼마인가?`, low(v) * price, {
              unit: '원', figure: chart(c, v), explain: `가장 낮은 점은 ${c.tag(c.names[v.indexOf(low(v))])}의 ${low(v)}개이다. ${price} × ${low(v)} = ${low(v) * price}`, facts: { calc: [[`${price}*${low(v)}`, 0]] }
            });
          }),
          T('read-part', '읽은 값에서 한쪽을 빼기', '②15 심18', (d) => {
            const c = pick(d, 'visit', 5), v = vals(d, c, 5, (x) => distinct(x) && low(x) >= 4), k = d.int(0, 4), kids = d.int(8, v[k] - 6);
            return N(`${lead(c)} ${c.names[k]}의 방문자 가운데 어린이가 ${kids}명일 때, ${c.names[k]}에 방문한 어른은 몇 명인가?`, v[k] - kids, {
              unit: '명', figure: chart(c, v, { step: 5 }), explain: `${said(c, v, k)}이다. 어린이를 빼면 ${v[k]} - ${kids} = ${v[k] - kids}(명)이다.`, facts: { calc: [[`${v[k]}-${kids}`, 0]] }
            });
          }),
          T('read-cells-gap', '두 점의 높이는 몇 칸 차이인가', '심17', (d) => {
            const [step, key] = d.pick([[10, 'jump'], [20, 'pop'], [5, 'visit']]), c = pick(d, key, 5), v = vals(d, c, 5, distinct, step), [i, j] = d.until(() => d.shuffle([0, 1, 2, 3, 4]).slice(0, 2), ([p, q]) => v[p] - v[q] >= 2 * step);
            return N(`${lead(c)} ${c.tag(c.names[i])}의 점은 ${c.tag(c.names[j])}의 점보다 몇 칸 더 높은 곳에 있는가?`, (v[i] - v[j]) / step, {
              unit: '칸', figure: chart(c, v, { step }), explain: `${said(c, v, i)}, ${said(c, v, j)}이고 세로 눈금 한 칸은 ${U(c, step)}이다. (${v[i]} - ${v[j]}) ÷ ${step} = ${(v[i] - v[j]) / step}`,
              facts: { calc: [[`(${v[i]}-${v[j]})/${step}`, 0]] }
            });
          }),
          T('read-used', '남은 양의 그래프에서 쓴 양 구하기', '심55', (d) => {
            const c = pick(d, 'tank', 5, 0), v = d.until(() => { const x = [d.int(13, 15)]; for (let i = 1; i < 5; i += 1) x.push(x[i - 1] - d.int(1, 4)); return x; }, (x) => low(x) >= 1).map((x) => x * 2), k = d.int(1, 4);
            return N(`${lead(c)} ${c.tag(c.names[k])} 하루 동안 쓴 물은 몇 L인가? (물통에 물을 더 넣지는 않았다.)`, v[k - 1] - v[k], {
              unit: 'L', figure: chart(c, v, { step: 2 }), explain: `${c.tag(c.names[k - 1])} 저녁에 ${v[k - 1]} L가 남았고 ${c.tag(c.names[k])} 저녁에 ${v[k]} L가 남았다. 그 사이에 쓴 물은 ${v[k - 1]} - ${v[k]} = ${v[k - 1] - v[k]}(L)이다.`,
              facts: { calc: [[`${v[k - 1]}-${v[k]}`, 0]] }
            });
          }),
          T('read-life', '그래프를 보고 알맞은 때 정하기', '①16 ②32', (d) => {
            const c = pick(d, 'rain', 5), v = vals(d, c, 5, (x) => { const s = x.slice().sort((p, q) => p - q); return distinct(x) && s[1] - s[0] <= 2; }), lo = v.indexOf(low(v));
            return C(`가 지역의 지난해 강수량을 월별로 조사하여 나타낸 꺾은선그래프이다. 올해도 지난해와 비슷하게 비가 온다고 보고, 다섯 달 가운데 비가 가장 적게 오는 달에 마을 운동회를 열려고 한다. 운동회를 열 달은?`, c.names, lo, {
              figure: chart(c, v, { step: 20 }), explain: `강수량이 가장 적은 달을 찾는다. 가장 낮은 점은 ${c.names[lo]}의 ${v[lo]} mm이다.`, facts: { choose: { exprs: v.map(String), rule: 'min' } }
            });
          })
        ]
      },
      {
        id: 'change', title: '꺾은선그래프에서 변화 읽기', standard: READ,
        types: [
          T('chg-dir', '두 때 사이에 늘었는지 줄었는지 알기', '①19', (d) => {
            const c = pick(d, 'ice', 5), v = vals(d, c, 5, (x) => gaps(x).some((g) => g > 0) && gaps(x).some((g) => g < 0)), i = d.int(0, 3);
            return C(`${lead(c)} ${between(c, i)}에 판매량은 어떻게 변하였는가?`, ['줄었다.', '변하지 않았다.', '늘었다.'], v[i] > v[i + 1] ? 0 : v[i] === v[i + 1] ? 1 : 2, {
              figure: chart(c, v, { step: 2 }), explain: `${said(c, v, i)}, ${said(c, v, i + 1)}이다. ${v[i] === v[i + 1] ? '선분이 기울어지지 않았으므로 변하지 않았다.' : `선분이 오른쪽 ${v[i] < v[i + 1] ? '위로 기울어져 있으므로 늘었다.' : '아래로 기울어져 있으므로 줄었다.'}`}`,
              facts: { choose: { exprs: [String(v[i]), String(v[i + 1])], rule: 'compare' } }
            });
          }),
          T('chg-shape', '변화하는 모습 말하기', '①20 ②26 ③22 심25', (d) => {
            const c = pick(d, 'pop', 5), t = d.int(0, 3), p = d.int(1, 3);
            const cells = d.until(() => { const x = [t % 2 === 0 ? d.int(2, 5) : d.int(10, 13)]; for (let i = 1; i < 5; i += 1) { const up = t === 0 || (t === 2 && i <= p) || (t === 3 && i > p); x.push(x[i - 1] + (up ? 1 : -1) * d.int(1, 3)); } return x; }, (x) => low(x) >= 1 && top(x) <= 14);
            const v = cells.map((x) => x * 20), signs = gaps(v).map(Math.sign), turn = signs.findIndex((s) => s !== signs[0]);
            // 그래프의 모양을 값으로 다시 가른다: 0 줄곧 늘어남, 1 줄곧 줄어듦, 2 늘다가 줄어듦, 3 줄다가 늘어남
            const kind = turn < 0 ? (signs[0] > 0 ? 0 : 1) : signs.slice(turn).every((s) => s === signs[turn]) ? (signs[0] > 0 ? 2 : 3) : -1;
            const rows = d.shuffle([['계속 늘었다.', 0], ['계속 줄었다.', 1], ['늘다가 줄었다.', 2], ['줄다가 늘었다.', 3]]);
            return C(`${lead(c)} 학생 수가 변한 모습을 바르게 말한 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === kind), {
              figure: chart(c, v, { step: 20 }), explain: `선분이 오른쪽 위로 기울면 늘어난 것이고, 오른쪽 아래로 기울면 줄어든 것이다. 학생 수는 ${c.names.map((n, i) => `${v[i]}명`).join(' → ')}으로 변하였다.`,
              facts: { truth: rows.map((r) => r[1] === kind), want: true }
            });
          }),
          T('chg-drop', '앞의 때보다 줄어든 때 찾기', '①21 ②19 심22', (d) => {
            const c = pick(d, 'visit', 5), k = d.int(1, 4);
            const v = d.until(() => { const x = [d.int(3, 6)]; for (let i = 1; i < 5; i += 1) x.push(x[i - 1] + (i === k ? -d.int(1, 2) : d.int(1, 3))); return x; }, (x) => top(x) <= 13 && low(x) >= 2).map((x) => x * 5);
            return C(`${lead(c)} 방문자 수가 전날보다 줄어든 날은?`, c.names.slice(1), k - 1, {
              figure: chart(c, v, { step: 5 }), explain: `선분이 오른쪽 아래로 기울어진 곳을 찾는다. ${c.names[k - 1]} ${v[k - 1]}명에서 ${c.names[k]} ${v[k]}명으로 줄었다.`,
              facts: { only: { values: gaps(v), test: 'atMost', target: -1 } }
            });
          }),
          T('chg-ups-count', '앞의 때보다 늘어난 때의 수', '①21 ②19', (d) => {
            const c = pick(d, 'jump', 6, 0), v = vals(d, c, 6, (x) => { const up = gaps(x).filter((g) => g > 0).length; return gaps(x).every((g) => g !== 0) && up >= 2 && up <= 4; }), ups = c.names.slice(1).filter((_, i) => gaps(v)[i] > 0);
            return N(`${lead(c)} 줄넘기 횟수가 전날보다 늘어난 요일은 모두 며칠인가?`, ups.length, {
              unit: '일', figure: chart(c, v, { step: 10 }), explain: `선분이 오른쪽 위로 기울어진 곳의 오른쪽 끝에 있는 요일을 모두 찾는다. ${ups.map(day).join(', ')}의 ${ups.length}일이다.`, facts: { count: gaps(v).map((g) => g > 0) }
            });
          }),
          T('chg-turn', '줄어들기 시작한 때 찾기', '②20 심22', (d) => {
            const c = pick(d, 'temp', 6, 0), p = d.int(1, 3);
            const v = d.until(() => { const x = [d.int(5, 8)]; for (let i = 1; i < 6; i += 1) x.push(x[i - 1] + (i <= p ? d.int(1, 3) : -d.int(1, 2))); return x; }, (x) => top(x) <= 14 && low(x) >= 3).map((x) => x * 2), truth = gaps(v).map((g, i, all) => g < 0 && all.slice(0, i).every((h) => h > 0));
            return C(`${lead(c)} 올라가던 온도가 내려가기 시작한 때는?`, [0, 1, 2, 3, 4].map((i) => between(c, i)), p, {
              figure: chart(c, v, { step: 2 }), explain: `선분이 오른쪽 위로 기울다가 처음으로 오른쪽 아래로 기우는 곳을 찾는다. ${c.tag(c.names[p])} ${v[p]} °C에서 ${c.tag(c.names[p + 1])} ${v[p + 1]} °C로 내려갔다.`, facts: { truth, want: true }
            });
          }),
          T('chg-most-up', '가장 많이 늘어난 때 찾기', '①23 ②21 ③15 심20', (d) => {
            const c = pick(d, 'book', 5), v = vals(d, c, 5, (x) => { const g = gaps(x); return top(g) >= 2 && lone(g, top(g)) && g.filter((y) => y > 0).length >= 2 && x[g.indexOf(top(g)) + 1] !== top(x); }), g = gaps(v), at = g.indexOf(top(g));
            return C(`${lead(c)} 빌린 책 수가 가장 많이 늘어난 때는?`, [0, 1, 2, 3].map((i) => between(c, i)), at, {
              figure: chart(c, v), explain: `오른쪽 위로 가장 많이 기울어진 선분을 찾는다. ${c.names[at]} ${v[at]}권에서 ${c.names[at + 1]} ${v[at + 1]}권으로 ${g[at]}권 늘어 가장 많이 늘었다.`,
              facts: { only: { values: g, test: 'atLeast', target: top(g) } }
            });
          }),
          T('chg-most-down', '가장 많이 줄어든 때 찾기', '①23 ②22 ③16 심20', (d) => {
            const c = pick(d, 'rain', 5), v = vals(d, c, 5, (x) => { const g = gaps(x).map((y) => -y); return top(g) >= 2 && lone(g, top(g)) && g.filter((y) => y > 0).length >= 2; }), g = gaps(v).map((y) => -y), at = g.indexOf(top(g));
            return C(`${lead(c)} 강수량이 가장 많이 줄어든 때는?`, [0, 1, 2, 3].map((i) => between(c, i)), at, {
              figure: chart(c, v, { step: 20 }), explain: `오른쪽 아래로 가장 많이 기울어진 선분을 찾는다. ${c.names[at]} ${v[at]} mm에서 ${c.names[at + 1]} ${v[at + 1]} mm로 ${g[at]} mm 줄어 가장 많이 줄었다.`,
              facts: { only: { values: g, test: 'atLeast', target: top(g) } }
            });
          }),
          T('chg-most', '변화가 가장 큰 때 찾기', '①22 ②23 ③17 심19', (d) => {
            const c = pick(d, 'ice', 5), v = vals(d, c, 5, (x) => { const g = mags(x); return lone(g, top(g)) && gaps(x).some((y) => y > 0) && gaps(x).some((y) => y < 0) && low(g) >= 1; }), g = mags(v), at = g.indexOf(top(g));
            return C(`${lead(c)} 판매량의 변화가 가장 큰 때는?`, [0, 1, 2, 3].map((i) => between(c, i)), at, {
              figure: chart(c, v, { step: 2 }), explain: `늘어난 것과 줄어든 것을 가리지 않고 가장 많이 기울어진 선분을 찾는다. ${c.tag(c.names[at])} ${v[at]}개에서 ${c.tag(c.names[at + 1])} ${v[at + 1]}개로 ${g[at]}개 변하여 변화가 가장 크다.`,
              facts: { only: { values: g, test: 'atLeast', target: top(g) } }
            });
          }),
          T('chg-most-day', '앞의 때와 비교하여 가장 많이 변한 때', '①24 ②23 ③18 심19', (d) => {
            const c = pick(d, 'jump', 5), v = vals(d, c, 5, (x) => { const g = mags(x); return lone(g, top(g)) && low(g) >= 1; }), g = mags(v), at = g.indexOf(top(g));
            return C(`${lead(c)} 전날과 비교하여 줄넘기 횟수가 가장 많이 변한 요일은?`, c.names.slice(1).map(day), at, {
              figure: chart(c, v, { step: 10 }), explain: `가장 많이 기울어진 선분은 ${between(c, at)}의 선분이다. 전날과 비교한 것이므로 선분의 오른쪽 끝에 있는 ${c.tag(c.names[at + 1])}이 답이다.`,
              facts: { only: { values: g, test: 'atLeast', target: top(g) } }
            });
          }),
          T('chg-least', '변화가 가장 작은 때 찾기', '①25 ②24 심21', (d) => {
            const c = pick(d, 'pop', 5), v = vals(d, c, 5, (x) => { const g = mags(x); return lone(g, low(g)) && low(g) >= 1; }), g = mags(v), at = g.indexOf(low(g));
            return C(`${lead(c)} 학생 수의 변화가 가장 작은 때는?`, [0, 1, 2, 3].map((i) => between(c, i)), at, {
              figure: chart(c, v, { step: 20 }), explain: `가장 적게 기울어진 선분을 찾는다. ${c.tag(c.names[at])} ${v[at]}명에서 ${c.tag(c.names[at + 1])} ${v[at + 1]}명으로 ${g[at]}명 변하여 변화가 가장 작다.`,
              facts: { only: { values: g, test: 'atMost', target: low(g) } }
            });
          }),
          T('chg-flat', '변화가 없는 때 찾기', '①26 ③19', (d) => {
            const c = pick(d, 'dog', 5), v = cellsOf(d, 5, 2, 13, (x) => gaps(x).filter((g) => g === 0).length === 1 && gaps(x).every((g) => g >= 0 && g <= 3)), at = gaps(v).indexOf(0);
            return C(`${lead(c)} 강아지의 몸무게가 변하지 않은 때는?`, [0, 1, 2, 3].map((i) => between(c, i)), at, {
              figure: chart(c, v), explain: `선분이 기울어지지 않은 곳을 찾는다. ${c.names[at]}과 ${c.names[at + 1]}의 몸무게가 모두 ${v[at]} kg이다.`,
              facts: { only: { values: mags(v), test: 'atMost', target: 0 } }
            });
          }),
          T('chg-order', '변화가 큰 때부터 차례로 쓰기', '①27 심24', (d) => {
            const c = pick(d, 'book', 5), v = vals(d, c, 5, (x) => { const g = mags(x); return distinct(g) && low(g) >= 1 && orderable(g); }), g = mags(v);
            const right = [0, 1, 2, 3].sort((p, q) => g[q] - g[p]), list = d.shuffle([right, right.slice().reverse(), [0, 1, 2, 3], [right[0], right[2], right[1], right[3]]]);
            return C(`${lead(c)} 빌린 책 수의 변화가 큰 때부터 차례대로 기호를 쓴 것은?`, list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.indexOf(right), {
              figure: chart(c, v) + tagged([0, 1, 2, 3].map((i) => between(c, i))), explain: `선분이 많이 기울어진 것부터 차례로 쓴다. 변한 양은 ${[0, 1, 2, 3].map((i) => `${LABELS[i]} ${g[i]}권`).join(', ')}이다.`,
              facts: { choose: { exprs: [0, 1, 2, 3].map((i) => `${Math.max(v[i], v[i + 1])}-${Math.min(v[i], v[i + 1])}`), rule: 'descending', orders: list } }
            });
          }),
          T('chg-amount', '가장 많이 늘어난 때 늘어난 양', '①28 ②25 심23', (d) => {
            const c = pick(d, 'rain', 5), v = vals(d, c, 5, (x) => { const g = gaps(x); return top(g) >= 2 && lone(g, top(g)) && g.filter((y) => y > 0).length >= 2; }), g = gaps(v), at = g.indexOf(top(g));
            return N(`${lead(c)} 강수량이 전달보다 가장 많이 늘어난 달에는 전달보다 몇 mm 늘었는가?`, g[at], {
              unit: 'mm', figure: chart(c, v, { step: 20 }), explain: `오른쪽 위로 가장 많이 기울어진 선분은 ${between(c, at)}의 선분이다. ${v[at + 1]} - ${v[at]} = ${g[at]}(mm)`, facts: { calc: [[`${v[at + 1]}-${v[at]}`, 0]] }
            });
          }),
          T('chg-steady', '한결같이 변하는 그래프에서 한 번에 변하는 양', '심26', (d) => {
            const c = pick(d, 'pop', 5), k = d.int(1, 3), first = d.int(2, 14 - 4 * k), v = [0, 1, 2, 3, 4].map((i) => (first + i * k) * 20);
            return N(`${lead(c)} 학생 수는 해마다 몇 명씩 늘었는가?`, k * 20, {
              unit: '명', figure: chart(c, v, { step: 20 }), explain: `점이 해마다 ${k}칸씩 올라간다. 세로 눈금 한 칸이 20명이므로 20 × ${k} = ${k * 20}(명)씩 늘었다. ${v[1]} - ${v[0]} = ${k * 20}`, facts: { calc: [[`${v[1]}-${v[0]}`, 0]] }
            });
          }),
          T('chg-right', '변화에 대한 옳은 설명 고르기', '①29 ②27 ③25', (d) => {
            const c = pick(d, 'ice', 5), v = vals(d, c, 5, (x) => { const g = gaps(x); return distinct(x) && top(g) >= 2 && lone(g, top(g)) && [0, 1, 2].some((p) => x.slice(p + 2).some((y) => y > x[p])); }), g = gaps(v), up = g.indexOf(top(g)), t = d.int(0, 3), k = d.int(0, 4), off = (i) => (t === i ? 0 : 2);
            const [a, b] = d.until(() => d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((p, q) => p - q), ([p, q]) => v[q] > v[p] && q - p >= 2);
            const rows = [
              [`${c.tag(c.names[a])}부터 ${c.tag(c.names[b])}까지 판매량은 ${v[b] - v[a] + off(0)}개 늘었다.`, [`${v[b]}-${v[a]}`, v[b] - v[a] + off(0)]],
              [`판매량이 가장 많은 요일과 가장 적은 요일의 판매량의 차는 ${top(v) - low(v) + off(1)}개이다.`, [`${top(v)}-${low(v)}`, top(v) - low(v) + off(1)]],
              [`${c.tag(c.names[k])}의 판매량은 ${v[k] + off(2)}개이다.`, [String(v[k]), v[k] + off(2)]],
              [`판매량이 가장 많이 늘어난 때에는 ${g[up] + off(3)}개 늘었다.`, [`${v[up + 1]}-${v[up]}`, g[up] + off(3)]]
            ];
            return C(`${lead(c)} 꺾은선그래프를 보고 알 수 있는 내용으로 옳은 것은?`, rows.map((r) => r[0]), t, {
              figure: chart(c, v, { step: 2 }), explain: `세로 눈금 한 칸은 2개이다. 판매량은 ${c.names.map((n, i) => `${day(n)} ${v[i]}개`).join(', ')}이다. ${v[b]} - ${v[a]} = ${v[b] - v[a]}, ${top(v)} - ${low(v)} = ${top(v) - low(v)}이고, 가장 많이 늘어난 때에는 ${v[up + 1]} - ${v[up]} = ${g[up]}(개) 늘었다.`,
              facts: { claimed: rows.map((r) => r[1]), claimedWant: true }
            });
          }),
          T('chg-who', '변화를 잘못 말한 사람 찾기', '②27 ③26 심27', (d) => {
            const c = pick(d, 'visit', 5), t = d.int(0, 2), who = d.shuffle(NAMES).slice(0, 3);
            // t = 1 이면 한 번 줄어드는 자료, 아니면 줄곧 늘어나는 자료
            const cells = d.until(() => { const dip = t === 1 ? d.int(1, 3) : -1, x = [d.int(2, 5)]; for (let i = 1; i < 5; i += 1) x.push(x[i - 1] + (i === dip ? -d.int(1, 2) : d.int(1, 4))); return x; }, (x) => { const g = gaps(x); return top(x) <= 13 && low(x) >= 2 && lone(g, top(g)) && lone(x, top(x)) && g.filter((y) => y > 0 && y < top(g)).length >= 1; });
            const v = cells.map((x) => x * 5), g = gaps(v), up = g.indexOf(top(g)), other = d.pick([0, 1, 2, 3].filter((i) => g[i] > 0 && i !== up)), hi = v.indexOf(top(v)), second = v.indexOf(v.slice().sort((p, q) => q - p)[1]);
            const upSaid = t === 0 ? other : up, hiSaid = t === 2 ? second : hi;
            const says = d.shuffle([
              [`방문자 수가 가장 많이 늘어난 때는 ${between(c, upSaid)}야.`, upSaid === up],
              [`${c.names[0]}부터 ${c.names[4]}까지 방문자 수는 한 번도 줄지 않았어.`, g.every((y) => y >= 0)],
              [`방문자 수가 가장 많은 날은 ${c.names[hiSaid]}이야.`, hiSaid === hi]
            ]);
            return C(`${lead(c)} 꺾은선그래프를 보고 잘못 말한 사람은?`, who, says.findIndex((s) => !s[1]), {
              figure: chart(c, v, { step: 5 }) + lines(says.map((s, at) => `${who[at]}: 「${s[0]}」`)),
              explain: `방문자 수는 ${c.names.map((n, i) => `${n} ${v[i]}명`).join(', ')}이다. 가장 많이 늘어난 때는 ${between(c, up)}이고, 가장 많은 날은 ${c.names[hi]}이다.${t === 1 ? ` ${between(c, g.findIndex((y) => y < 0))}에는 줄었다.` : ''}`,
              facts: { truth: says.map((s) => s[1]), want: false }
            });
          }),
          T('chg-table', '표에서 가장 많이 변한 때 찾기', '①56 ③20', (d) => {
            const c = pick(d, 'jump', 5), v = vals(d, c, 5, (x) => { const g = mags(x); return lone(g, top(g)) && low(g) >= 1; }), g = mags(v), at = g.indexOf(top(g));
            return C(`${lead(c, '표')} 이 표를 꺾은선그래프로 나타낼 때, 선분이 가장 많이 기울어지는 때는?`, [0, 1, 2, 3].map((i) => between(c, i)), at, {
              figure: tab(c, v), explain: `이웃한 두 값의 차가 가장 큰 곳을 찾는다. 차는 차례로 ${g.join(', ')}이므로 ${between(c, at)}의 선분이 가장 많이 기울어진다.`,
              facts: { only: { values: g, test: 'atLeast', target: top(g) } }
            });
          }),
          T('chg-table-amount', '표에서 가장 많이 줄어든 때 줄어든 양', '①56 ③20', (d) => {
            const c = pick(d, 'pop', 5), v = vals(d, c, 5, (x) => { const g = gaps(x).map((y) => -y); return top(g) >= 2 && lone(g, top(g)) && g.filter((y) => y > 0).length >= 2; }), g = gaps(v).map((y) => -y), at = g.indexOf(top(g));
            return N(`${lead(c, '표')} 학생 수가 한 해 전보다 가장 많이 줄어든 해에는 한 해 전보다 몇 명 줄었는가?`, g[at], {
              unit: '명', figure: tab(c, v), explain: `이웃한 두 값을 차례로 비교한다. ${c.tag(c.names[at])} ${v[at]}명에서 ${c.tag(c.names[at + 1])} ${v[at + 1]}명으로 가장 많이 줄었다. ${v[at]} - ${v[at + 1]} = ${g[at]}`,
              facts: { calc: [[`${v[at]}-${v[at + 1]}`, 0]] }
            });
          }),
          T('chg-record', '기록이 가장 많이 좋아진 때 찾기', '②22', (d) => {
            const c = pick(d, 'run', 5, 0), v = d.until(() => { const x = [d.int(13, 15)]; for (let i = 1; i < 5; i += 1) x.push(x[i - 1] - d.int(0, 3)); return x; }, (x) => { const g = gaps(x).map((y) => -y); return low(x) >= 8 && lone(g, top(g)) && top(g) >= 2; }), g = gaps(v).map((y) => -y), at = g.indexOf(top(g));
            return C(`${lead(c)} 달리기 기록이 전날보다 가장 많이 빨라진 날은?`, c.names.slice(1), at, {
              figure: chart(c, v), explain: `걸린 시간이 많이 줄수록 많이 빨라진 것이다. 오른쪽 아래로 가장 많이 기울어진 선분은 ${between(c, at)}의 선분이고, ${v[at]}초에서 ${v[at + 1]}초로 ${g[at]}초 빨라졌다.`,
              facts: { only: { values: g, test: 'atLeast', target: top(g) } }
            });
          })
        ]
      },
      {
        id: 'guess', title: '조사하지 않은 때의 값과 앞으로의 변화', standard: READ,
        types: [
          T('mid-read', '조사하지 않은 가운데 때의 값', '①32 ②29 ③21 심28', (d) => {
            const c = pick(d, 'bean', 5, 0), v = d.until(() => climb(d, 5, [1, 3], 1, 4, 14), (x) => gaps(x).some((g) => g === 2 || g === 4)), i = d.until(() => d.int(0, 3), (k) => gaps(v)[k] % 2 === 0), date = 2 * i + 2, mid = (v[i] + v[i + 1]) / 2;
            return N(`${lead(c)} 그래프에서 읽을 때, ${date}일의 키는 약 몇 cm인가?`, mid, {
              unit: 'cm', figure: chart(c, v), explain: `${date}일은 ${c.names[i]}과 ${c.names[i + 1]}의 가운데이다. 두 점을 이은 선분의 가운데는 세로 눈금 ${mid}에 있으므로 약 ${mid} cm이다.`, facts: { calc: [[`(${v[i]}+${v[i + 1]})/2`, 0]], unseen: [2] }
            });
          }),
          T('mid-half', '30분 뒤의 값 짐작하기', '①32 ③21', (d) => {
            const c = pick(d, 'temp', 5, 0), v = d.until(() => vals(d, c, 5, (x) => gaps(x).every((g) => g !== 0 && Math.abs(g) <= 3)), (x) => gaps(x).some((g) => Math.abs(g) === 4)), i = d.until(() => d.int(0, 3), (k) => Math.abs(gaps(v)[k]) === 4), mid = (v[i] + v[i + 1]) / 2;
            return N(`${lead(c)} 그래프에서 읽을 때, ${c.tag(c.names[i])} 30분의 온도는 약 몇 °C인가?`, mid, {
              unit: '°C', figure: chart(c, v, { step: 2 }), explain: `${c.tag(c.names[i])} 30분은 ${between(c, i)}의 가운데이다. 두 점을 이은 선분의 가운데는 세로 눈금 ${mid}에 있으므로 약 ${mid} °C이다.`,
              facts: { calc: [[`(${v[i]}+${v[i + 1]})/2`, 0]], unseen: [2] }
            });
          }),
          T('mid-missing', '재지 못한 때의 값 짐작하기', '심29', (d) => {
            const c = pick(d, 'candle', 6, 0), k = d.int(1, 4), drop = d.int(1, 3);
            const cells = d.until(() => { const x = [d.int(13, 14)]; for (let i = 1; i < 6; i += 1) x.push(x[i - 1] - (i === k || i === k + 1 ? drop : d.int(1, 3))); return x; }, (x) => low(x) >= 1), v = cells.map((x) => x * 5);
            return N(`${c.intro} 조사하여 나타낸 꺾은선그래프이다. ${c.names[k]} 뒤에는 길이를 재지 못하여 점을 찍지 않고 선분만 이었다. 그래프에서 읽을 때, ${c.tag(c.names[k])}의 양초의 길이는 약 몇 mm인가?`, v[k], {
              unit: 'mm', figure: dropDot(chart(c, v, { step: 5 }), c, v, k), explain: `${c.names[k]}은 ${c.names[k - 1]}과 ${c.names[k + 1]}의 가운데이다. ${c.names[k - 1]}의 점(${v[k - 1]} mm)과 ${c.names[k + 1]}의 점(${v[k + 1]} mm)을 이은 선분의 가운데는 세로 눈금 ${v[k]}에 있다.`,
              facts: { calc: [[`(${v[k - 1]}+${v[k + 1]})/2`, 0]], unseen: [2] }
            });
          }),
          T('next-dir', '앞으로 늘어날지 줄어들지 예상하기', '①34 ②30 ③23 심32', (d) => {
            const [key, text] = d.pick([['pop', '학생 수가 이와 같이 변한다면 다음 해의 학생 수는 어떻게 될 것으로 예상할 수 있는가?'], ['dog', '몸무게가 이와 같이 변한다면 다음 달의 강아지의 몸무게는 어떻게 될 것으로 예상할 수 있는가?']]), c = pick(d, key, 5, 0), up = key === 'dog' || d.bool();
            const cells = d.until(() => { const x = [up ? d.int(2, 4) : d.int(11, 13)]; for (let i = 1; i < 5; i += 1) x.push(x[i - 1] + (up ? 1 : -1) * d.int(1, 2)); return x; }, (x) => low(x) >= 2 && top(x) <= 13), v = cells.map((x) => x * c.s[0]);
            return C(`${lead(c)} ${text}`, [`${U(c, v[4])}보다 줄어들 것이다.`, `${U(c, v[4], '과/와')} 같을 것이다.`, `${U(c, v[4])}보다 늘어날 것이다.`], up ? 2 : 0, {
              figure: chart(c, v, { step: c.s[0] }), explain: `꺾은선이 줄곧 오른쪽 ${up ? '위로 올라가고' : '아래로 내려가고'} 있으므로 다음에도 ${up ? '늘어날' : '줄어들'} 것으로 예상할 수 있다.`,
              facts: { choose: { exprs: [String(v[3]), String(v[4])], rule: 'compare' } }
            });
          }),
          T('next-value', '한결같이 변할 때 다음 값 예상하기', '②31 ③24 심33', (d) => {
            const c = pick(d, 'ice', 5, 0), k = d.int(1, 2), first = d.int(2, 5), v = [0, 1, 2, 3, 4].map((i) => (first + i * k) * 2);
            return N(`${lead(c)} 판매량이 이와 같이 늘어난다면 토요일의 판매량은 몇 개가 될 것으로 예상할 수 있는가?`, v[4] + 2 * k, {
              unit: '개', figure: chart(c, v, { step: 2 }), explain: `판매량이 날마다 ${v[1]} - ${v[0]} = ${2 * k}(개)씩 늘었다. 금요일이 ${v[4]}개이므로 토요일은 ${v[4]} + ${2 * k} = ${v[4] + 2 * k}(개)로 예상할 수 있다.`,
              facts: { calc: [[`${v[4]}+${v[4]}-${v[3]}`, 0]] }
            });
          }),
          T('mid-talk', '점을 찍지 않은 때의 값을 두고 잘못 말한 사람', '②27 ②56 ③26 심28', (d) => {
            // 잘못 말한 사람의 생각: 조사하지 않은 때의 값은 전혀 알 수 없다 / 사이의 값은 앞의 점의 값과 같다
            const c = pick(d, 'bean', 5, 0), v = vals(d, c, 5, (x) => gaps(x).some((y) => y === 2 || y === 4)), i = d.until(() => d.int(0, 3), (n) => gaps(v)[n] % 2 === 0), date = 2 * i + 2, mid = (v[i] + v[i + 1]) / 2, t = d.int(0, 1), who = d.shuffle(NAMES).slice(0, 3);
            const [p, q] = d.until(() => d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((x, y) => x - y), ([x, y]) => y - x >= 2);
            const says = d.shuffle([
              [`${c.names[p]}부터 ${c.names[q]}까지 키는 ${v[q] - v[p]} cm 자랐어.`, true],
              t === 0 ? [`꺾은선그래프에서 ${date}일의 키는 약 ${mid} cm라고 볼 수 있어.`, true] : ['두 그래프 모두 세로 눈금 한 칸은 1 cm야.', true],
              t === 0 ? [`${date}일에는 키를 재지 않았으니까 ${date}일의 키는 어느 그래프에서도 전혀 짐작할 수 없어.`, false] : [`${date}일에는 키를 재지 않았으니까 ${date}일의 키는 ${c.names[i]}과 같은 ${v[i]} cm라고 보아야 해.`, false]
            ]);
            return C(`${c.intro} 조사하여 막대그래프와 꺾은선그래프로 나타내었다. 두 그래프를 보고 잘못 말한 사람은?`, who, says.findIndex((s) => !s[1]), {
              figure: bars(c, v) + chart(c, v) + lines(says.map((s, n) => `${who[n]}: 「${s[0]}」`)),
              explain: `꺾은선그래프에서는 점과 점을 이은 선분으로 조사하지 않은 때의 값을 짐작할 수 있다. ${date}일은 ${c.names[i]}과 ${c.names[i + 1]}의 가운데이고, 선분의 가운데는 세로 눈금 ${mid}에 있으므로 약 ${mid} cm라고 볼 수 있다.`,
              facts: { truth: says.map((s) => s[1]), want: false }
            });
          })
        ]
      },
      {
        id: 'wave', title: '물결선이 있는 꺾은선그래프', standard: READ,
        types: [
          T('wave-name', '물결선 알기', '①36 ②33 ③28 심42', (d) => {
            const list = d.shuffle(['물결선', '점선', '눈금선', '꺾은선']);
            return C('꺾은선그래프에서 필요 없는 부분을 줄여서 나타낼 때, 줄인 자리에 그리는 물결 모양의 선을 무엇이라고 하는가?', list, list.indexOf('물결선'), { explain: '필요 없는 부분을 줄여서 나타낼 때 그리는 선을 물결선이라고 한다.', facts: { truth: list.map((w) => w === '물결선'), want: true } });
          }),
          T('wave-good', '물결선을 사용하면 좋은 점', '①40 ②33 ③35 심8', (d) => {
            const rows = d.shuffle([['필요 없는 부분을 줄여서 변화하는 모습을 더 뚜렷하게 나타낼 수 있다.', true], ['조사한 값이 실제보다 크게 나타난다.', false], ['조사하지 않은 때의 값도 정확하게 알 수 있다.', false], ['점을 찍지 않아도 값을 알 수 있다.', false]]);
            return C('꺾은선그래프를 그릴 때 물결선을 사용하면 좋은 점은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '값이 없는 아랫부분을 물결선으로 줄이면 세로 눈금 한 칸의 크기를 작게 할 수 있어 변화하는 모습이 더 뚜렷하게 보인다. 값은 달라지지 않는다.', facts: truthOf(rows, true)
            });
          }),
          T('wave-smaller', '눈금 한 칸의 크기와 변화의 뚜렷함', '③29 ②33', (d) => {
            const rows = d.shuffle([['작게 한다.', true], ['크게 한다.', false], ['0부터 시작하게 한다.', false]]);
            return C('꺾은선그래프에서 변화하는 모습을 더 뚜렷하게 나타내려고 한다. 물결선으로 필요 없는 부분을 줄이고, 세로 눈금 한 칸의 크기를 어떻게 해야 하는가?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '세로 눈금 한 칸의 크기가 작을수록 같은 변화에도 선분이 더 많이 기울어져 변화하는 모습이 뚜렷하게 보인다.', facts: truthOf(rows, true)
            });
          }),
          T('wave-where', '물결선으로 줄인 부분 읽기', '①37 ②34 심8', (d) => {
            const w = wave(d, 5, null, WAVES.filter((x) => x.key === 'type' || x.key === 'weight'));
            return N(`${lead(w.c)} 물결선으로 줄인 부분은 ${U(w.c, 0)}부터 몇 ${w.c.unit}까지인가?`, w.from, {
              unit: w.c.unit, figure: waved(w), explain: `물결선 바로 아래의 눈금은 0이고 바로 위의 눈금은 ${w.from}이다. 0부터 ${U(w.c, w.from)}까지를 줄였다.`, facts: { calc: [[String(w.from), 0]] }
            });
          }),
          T('wave-step', '물결선이 있는 그래프의 세로 눈금 한 칸', '①38 ②35 심4', (d) => {
            const w = wave(d, 5, null, WAVES.filter((x) => x.key === 'tall' || x.key === 'pop')), next = w.from + w.major * w.step;
            return N(`${lead(w.c)} 세로 눈금 한 칸은 몇 ${UT(w.c, '을/를')} 나타내는가?`, w.step, {
              unit: w.c.unit, figure: waved(w), explain: `물결선 위에서 수가 적힌 눈금 ${w.from}부터 ${next}까지가 ${w.major}칸이므로 한 칸은 (${next} - ${w.from}) ÷ ${w.major} = ${w.step}(${w.c.unit})${tail(SOUND[w.c.unit] || w.c.unit, '을/를')} 나타낸다. 0과 ${w.from} 사이는 줄인 부분이므로 칸으로 세지 않는다.`,
              facts: { calc: [[`(${next}-${w.from})/${w.major}`, 0]], unseen: [next, w.major], rule: 'wave' }
            });
          }),
          T('wave-read', '물결선이 있는 그래프에서 한 때의 값 읽기', '①39 ②35 ③30 심9', (d) => {
            const w = wave(d, 5, (x, spec) => x.some((y) => y % spec.major !== 0), WAVES.filter((x) => x.key === 'pop' || x.key === 'type')), c = w.c, k = d.until(() => d.int(0, 4), (i) => w.cells[i] % w.major !== 0);
            return N(`${lead(c)} ${josa(one(c, c.names[k]), '은/는')} 몇 ${c.unit}인가?`, w.v[k], {
              unit: c.unit, figure: waved(w), explain: `세로 눈금 한 칸은 ${U(c, w.step)}이다. ${c.tag(c.names[k])}의 점은 눈금 ${w.from}에서 ${w.cells[k]}칸 위에 있으므로 ${w.from} + ${w.step} × ${w.cells[k]} = ${w.v[k]}(${c.unit})이다.`,
              facts: { calc: [[`${w.from}+${w.step}*${w.cells[k]}`, 0]], unseen: [w.cells[k]], rule: 'wave' }
            });
          }),
          T('wave-gap', '물결선이 있는 그래프에서 두 때의 값의 차', '②35 ③30', (d) => {
            const w = wave(d, 5, distinct, WAVES.filter((x) => x.key === 'weight' || x.key === 'tall')), c = w.c, [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((p, q) => w.v[q] - w.v[p]);
            return N(`${lead(c)} ${josa(one(c, c.names[i]), '과/와')} ${one(c, c.names[j])}의 차는 몇 ${c.unit}인가?`, w.v[i] - w.v[j], {
              unit: c.unit, figure: waved(w), explain: `${said(c, w.v, i)}, ${said(c, w.v, j)}이다. ${w.v[i]} - ${w.v[j]} = ${w.v[i] - w.v[j]}`, facts: { calc: [[`${w.v[i]}-${w.v[j]}`, 0]] }
            });
          }),
          T('wave-two-step', '물결선이 없는 그래프와 있는 그래프의 눈금 한 칸', '①41 ②36 ③31 심41', (d) => {
            const w = dual(d, 'visit'), c = w.c;
            return M(`${c.intro} 조사하여 두 꺾은선그래프 (가), (나)로 나타내었다. (가)와 (나)의 세로 눈금 한 칸은 각각 몇 ${UT(c, '을/를')} 나타내는가?`, [{ label: '(가)', answer: w.sa, unit: c.unit }, { label: '(나)', answer: w.sb, unit: c.unit }], {
              figure: cap('(가)', w.plain) + cap('(나)', w.cut),
              explain: `(가)는 0부터 ${w.ma * w.sa}까지가 ${w.ma}칸이므로 한 칸은 ${w.ma * w.sa} ÷ ${w.ma} = ${w.sa}(${c.unit})이다. (나)는 ${w.from}부터 ${w.from + w.mb * w.sb}까지가 ${w.mb}칸이므로 한 칸은 ${w.mb * w.sb} ÷ ${w.mb} = ${w.sb}(${c.unit})이다.`,
              facts: { calc: [[`${w.ma * w.sa}/${w.ma}`, 0], [`(${w.from + w.mb * w.sb}-${w.from})/${w.mb}`, 1]], unseen: [w.ma * w.sa, w.ma, w.from + w.mb * w.sb, w.mb] }
            });
          }),
          T('wave-two-clear', '변화가 더 뚜렷하게 보이는 그래프', '①42 ②37 ③32 심42', (d) => {
            const w = dual(d, 'type'), c = w.c, cutFirst = d.bool(), [plain, cut] = cutFirst ? ['(나)', '(가)'] : ['(가)', '(나)'];
            const rows = d.shuffle([[`${cut} — 세로 눈금 한 칸의 크기가 작아서 선분이 더 많이 기울어져 보인다.`, true], [`${plain} — 세로 눈금이 0부터 끊기지 않고 이어진다.`, false], [`${plain} — 세로 눈금 한 칸의 크기가 더 크다.`, false], [`${cut} — 나타낸 ${josa(c.noun, '이/가')} 더 크다.`, false]]);
            return C(`${c.intro} 조사하여 두 꺾은선그래프 (가), (나)로 나타내었다. ${c.noun}의 변화가 더 뚜렷하게 보이는 그래프와 그 까닭을 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: cap('(가)', cutFirst ? w.cut : w.plain) + cap('(나)', cutFirst ? w.plain : w.cut),
              explain: `${josa(cut, '은/는')} 물결선으로 필요 없는 부분을 줄이고 세로 눈금 한 칸을 ${U(c, w.sb, '으로/로')} 작게 하여 변화가 더 뚜렷하게 보인다. 두 그래프가 나타낸 값은 같다.`, facts: truthOf(rows, true)
            });
          }),
          T('wave-two-same', '물결선이 없는 그래프와 있는 그래프 비교하기', '②38 ③33', (d) => {
            const w = dual(d, 'visit'), c = w.c, k = d.int(0, 4);
            const rows = d.shuffle([[`(가)와 (나)에서 ${josa(one(c, c.names[k]), '은/는')} 서로 같다.`, true], ['(가)와 (나)는 세로 눈금 한 칸의 크기가 서로 같다.', false], ['(가)에는 물결선이 있고 (나)에는 물결선이 없다.', false], ['(가)와 (나)는 가로가 나타내는 것이 서로 다르다.', false]]);
            return C(`${c.intro} 조사하여 두 꺾은선그래프 (가), (나)로 나타내었다. 두 그래프에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: cap('(가)', w.plain) + cap('(나)', w.cut),
              explain: `같은 자료를 나타낸 것이므로 가로와 세로가 나타내는 것, 나타낸 값은 같다. 물결선은 (나)에만 있고, 세로 눈금 한 칸은 (가) ${U(c, w.sa)}, (나) ${U(c, w.sb, '으로/로')} 서로 다르다.`, facts: truthOf(rows, true)
            });
          }),
          T('wave-ticks', '물결선이 있는 그래프의 세로 눈금에 알맞은 수', '①44', (d) => {
            const w = dual(d, 'type'), c = w.c, k = w.v.indexOf(low(w.v)), up = (w.v[k] - w.from) / w.sb, next = w.from + w.mb * w.sb;
            const marked = relabel(w.cut, { [w.from]: LABELS[0], [next]: LABELS[1] }).replace(/aria-label="[^"]*"/, `aria-label="꺾은선그래프: 물결선이 있고, 세로 눈금의 두 곳에 ㉠, ㉡을 적었다. ㉡은 ㉠에서 ${w.mb}칸 위에 있다. ${c.names.map((n, i) => `${n} ㉠에서 ${(w.v[i] - w.from) / w.sb}칸 위`).join(', ')}"`);
            return M(`${c.intro} 조사하여 두 꺾은선그래프 (가), (나)로 나타내었다. (나)의 세로 눈금 한 칸이 ${U(c, w.sb, '을/를')} 나타낼 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: w.from }, { label: LABELS[1], answer: next }], {
              figure: cap('(가)', w.plain) + cap('(나)', marked),
              explain: `(가)에서 ${said(c, w.v, k)}이다. (나)에서 ${c.tag(c.names[k])}의 점은 ㉠에서 ${up}칸 위에 있으므로 ㉠은 ${w.v[k]} - ${w.sb} × ${up} = ${w.from}이다. ㉡은 ㉠에서 ${w.mb}칸 위에 있으므로 ${w.from} + ${w.sb} × ${w.mb} = ${next}이다.`,
              facts: { calc: [[`${w.v[k]}-${w.sb}*${up}`, 0], [`${w.v[k]}-${w.sb}*${up}+${w.sb}*${w.mb}`, 1]] }
            });
          }),
          T('wave-redo', '변화가 더 뚜렷하게 보이도록 다시 그리는 방법', '①46', (d) => {
            const w = dual(d, 'visit'), c = w.c, cutAt = low(w.v) + w.sa;
            const rows = d.shuffle([
              [`세로 눈금 한 칸을 ${U(c, w.sb, '으로/로')} 하고, 0과 ${w.from} 사이를 물결선으로 줄인다.`, true],
              [`세로 눈금 한 칸을 ${U(c, w.sa * 2, '으로/로')} 하고, 물결선은 넣지 않는다.`, false],
              [`세로 눈금 한 칸을 ${U(c, w.sb, '으로/로')} 하고, 0과 ${cutAt} 사이를 물결선으로 줄인다.`, false],
              [`세로 눈금 한 칸을 ${U(c, w.sa, '으로/로')} 하고, 물결선은 넣지 않는다.`, false]
            ]);
            return C(`${lead(c, '표와 꺾은선그래프')} ${c.noun}의 변화가 지금보다 더 뚜렷하게 보이도록 다시 그리는 방법으로 알맞은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              figure: tab(c, w.v) + w.plain,
              explain: `가장 작은 값이 ${U(c, low(w.v))}이므로 0과 ${w.from} 사이에는 값이 없다. 이 부분을 물결선으로 줄이고 세로 눈금 한 칸을 지금(${U(c, w.sa)})보다 작게 하면 변화가 더 뚜렷하게 보인다. 0과 ${cutAt} 사이를 줄이면 ${U(c, low(w.v), '을/를')} 나타낼 수 없다.`,
              facts: truthOf(rows, true)
            });
          }, { standard: DRAW }),
          T('wave-two-talk', '물결선이 없는 그래프와 있는 그래프를 보고 잘못 말한 사람', '③34 심42', (d) => {
            // 잘못 말한 사람의 생각: 선분이 더 많이 기울어진 그래프의 자료가 더 많이 변했다(같은 자료인데도)
            const w = dual(d), c = w.c, who = d.shuffle(NAMES).slice(0, 3), k = d.int(0, 4), g = mags(w.v), at = g.indexOf(top(g));
            const says = d.shuffle([
              [`${c.noun}의 변화는 (나)에서 더 뚜렷하게 보여.`, true],
              [`(나)의 선분이 더 많이 기울어져 있으니까 (나)에 나타낸 ${josa(c.noun, '이/가')} (가)에 나타낸 ${c.noun}보다 더 많이 변했어.`, false],
              [`(가)에서도 (나)에서도 ${josa(one(c, c.names[k]), '은/는')} ${U(c, w.v[k], '이야/야')}.`, true]
            ]);
            return C(`${c.intro} 조사하여 두 꺾은선그래프 (가), (나)로 나타내었다. 두 그래프를 보고 잘못 말한 사람은?`, who, says.findIndex((s) => !s[1]), {
              figure: cap('(가)', w.plain) + cap('(나)', w.cut) + lines(says.map((s, i) => `${who[i]}: 「${s[0]}」`)),
              explain: `(가)와 (나)는 같은 자료를 나타낸 것이므로 변한 양도 같다. 예를 들어 ${between(c, at)}에 두 그래프 모두 ${U(c, g[at])} 변하였다. (나)는 세로 눈금 한 칸이 ${U(c, w.sb, '으로/로')} 작아서 선분이 더 많이 기울어져 보일 뿐이다.`,
              facts: { truth: says.map((s) => s[1]), want: false }
            });
          })
        ]
      },
      { id: 'draw', title: '표를 꺾은선그래프로 나타내기', standard: DRAW, types: [] },
      { id: 'gather', title: '자료를 정리하여 꺾은선그래프로 나타내기', standard: DRAW, types: [] },
      { id: 'miss', title: '빠진 값 구하기와 표·그래프 완성하기', standard: DRAW, types: [] },
      { id: 'two', title: '두 꺾은선과 두 그래프', standard: READ, types: [] },
      { id: 'kind', title: '알맞은 그래프 고르기', standard: READ, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
