// 4학년 2학기 5단원 꺾은선그래프 — 표를 그래프로 나타내기, 자료 정리, 빠진 값, 두 꺾은선, 알맞은 그래프 고르기의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3의 「표를 꺾은선그래프로」「자료를 정리하여」「꺾은선그래프 둘」「알맞은 그래프 고르기」 묶음, 심화꼴 81꼴)을 꼴마다 따져서 실었다.
//
// 실력 문항의 잣대: 기본에서 이미 하는 일(값 하나 읽기, 눈금 한 칸, 두 값의 차 한 번)을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 실력이 아니다.
// 실력 묶음에는 둘만 싣는다.
//   ① 상황·그림 자체에 장치가 있어 뜻을 정확히 대야 풀리는 문제(어려움이 보기가 아니라 문제의 장치에서 나온다)
//      - 물결선이 있는 그래프에서 「몇 배인가」: 점의 높이(칸 수)는 값에 비례하지 않는다(h-wave-times)
//      - 물결선이 있는 그래프를 물결선 없이 다시 그릴 때 점의 자리: 센 칸 수는 값이 아니다(h-wave-unfold)
//      - 눈금 한 칸의 크기가 다른 두 그래프에서 「더 많이 늘어난 사람」: 선분이 기울어진 정도로는 비교할 수 없다(h-two-scales)
//      - 남은 양을 나타낸 그래프에서 「가장 많이 쓴 날」: 가장 낮은 점이 아니라 가장 많이 내려간 선분이다(h-used-most)
//      - 조사한 때가 글에만 적힌 그래프에서 사이의 값: 가운데 때를 스스로 알아내야 한다(h-mid-when)
//   ② 심화꼴 목록에 있는, 두 번 넘게 따져야 풀리는 문제(사이의 값으로 한 번 더 계산하기, 두 때의 값을 더해 곱하기, 조건으로 빠진 값을 구해 점의 자리·합·변한 양 구하기,
//      눈금의 수가 지워진 그래프, 두 꺾은선에서 더 많이 늘어난 쪽과 그 차, 두 꺾은선·두 그래프를 함께 읽기, 달별 자료를 묶기)
// 오개념을 틀린 보기·틀린 말로 넣은 고르기 문항(잘못 말한 사람 찾기, 그래프가 알맞은지 판단하기)은 기본 묶음에 있다(wave-two-talk, mid-talk, kind-judge, chg-who).
//
// 그리는 꼴(작도)을 바꾸어 실은 법: 「점을 세로 눈금 0(물결선 위 첫 눈금)에서 몇 칸 위에 찍는가」「㉠·㉡·㉢ 가운데 점을 찍을 자리」「표와 다르게 찍은 점」
// 「잘못 그린 까닭」「세로 눈금 한 칸을 얼마로 해야 하는가」「물결선으로 줄이기에 알맞은 부분」으로 물었다.
// 「눈금 한 칸을 얼마로」「물결선을 어디에」는 원문의 답이 「예시」라 여럿이다. 모눈의 칸 수와 「점이 모두 눈금 선 위에 놓이게」라는 조건을 달거나, 값이 잘리는 보기를 넣은 고르기로 내어 답이 하나가 되게 했다.
//
// 뺀 것과 까닭(꼴 번호는 싣기_대조표.md에 모두 적었다)
//  - 조건을 이어 풀어야 점의 자리가 정해지는 것(꼬임): 조건 둘을 이어 두 점 구하기(심49), 빠진 점 → 차례 → 다른 선 → 곱하기로 이어지는 것(심64)
//  - 비례로 셈하는 것(6학년): 같은 빠르기로 늘리고 줄이기(심34)
//  - 중학교 내용: 두 자료 사이의 관계 말하기(①68 ②58 심65·68)
//  - 답이 하나로 정해지지 않는 것: 목표 값에 닿는 때·다음 값을 수로 예상하고 까닭 쓰기(심35·36)
//  - 작도·활동으로만 할 수 있는 것: 두 자료를 한 그래프에 그리기(②61), 알맞은 그래프를 골라 그리기(①75 ②65 심80), 스스로 조사하기(①62 ②53 ③49 심81)
//  - 같은 문제: 세로 눈금의 시작 값(①52)은 물결선을 넣을 곳 정하기와, 조사 주제 고르기(②53 심81의 고르기)는 꺾은선그래프로 나타내기에 알맞은 자료 고르기와 하는 일이 같다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, table, lines, tagged, barChart, lineChart, N, M, C } = B.kit;
  const READ = '4수04-03', DRAW = '4수04-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
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
  const yr = (n) => n + '년', pm = (n) => '오후 ' + n;
  const roofOf = (v, step) => { const unit = step * (MAJOR[step] || 5); return Math.ceil(top(v.filter((x) => x != null)) / unit) * unit; };
  const hide = (v, ...at) => v.map((x, i) => (at.includes(i) ? null : x));
  const words = (list) => '<div class="mb-numbers">' + list.map((word) => '<span>' + word + '</span>').join('') + '</div>';
  // 그래프에 적힌 글자 하나를 기호로 바꾸고 조금 키운다(세로 단위 자리의 ㉠, 가로 이름 자리의 ㉡).
  const swapLabel = (html, from, to) => { const at = html.indexOf('>' + from + '</text>'), head = html.lastIndexOf('<text', at); return html.slice(0, head) + html.slice(head, at).replace('font-size:11px', 'font-size:14px') + '>' + to + html.slice(at + from.length + 1); };
  // 잘못 그린 그래프: 점만 찍고 잇지 않은 것, 점을 차례대로 잇지 않은 것
  const noLine = (html) => html.replace(/<path d="[^"]*" style="fill:none;stroke:#1d4ed8[^"]*"\/>/, '');
  const reorder = (html, order) => { const pts = [...html.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"/g)].map((m) => m[1] + ' ' + m[2]); return html.replace(/(<path d=")[^"]*(" style="fill:none;stroke:#1d4ed8)/, (all, head, end) => head + order.map((i, n) => (n ? 'L' : 'M') + pts[i]).join(' ') + end); };
  // 점을 찍을 자리 고르기: k번째 때의 세로줄에 후보 점 셋을 속이 빈 점으로 그리고 위에서부터 ㉠, ㉡, ㉢을 단다. 앞의 때까지는 꺾은선을 그려 둔다.
  function spots(c, v, k, cands, o) {
    const opts = Object.assign({ unit: c.unit, title: c.title, major: MAJOR[o.step] || 5 }, o);
    const at = (value) => { const m = lineChart(c.names, c.names.map((_, i) => (i === k ? value : null)), opts).match(/<circle cx="([\d.]+)" cy="([\d.]+)"/); return [Number(m[1]), Number(m[2])]; };
    const marks = cands.map((value, i) => { const [x, y] = at(value); return `<circle cx="${x}" cy="${y}" r="3.4" style="fill:#fff;stroke:#c2410c;stroke-width:1.6"/><text class="mb-axis-label" style="font-size:13px;font-weight:700;fill:#c2410c" x="${x + 7}" y="${y + 4.5}">${LABELS[i]}</text>`; }).join('');
    return chart(c, v.map((x, i) => (i < k ? x : null)), o).replace('</svg>', marks + '</svg>').replace(`${c.names[k]} 점 없음`, `${c.names[k]} ` + cands.map((value, i) => `${LABELS[i]} ${U(c, value)}`).join(' '));
  }
  // 세로 눈금에 0만 적은 그래프(칸 수로 눈금 한 칸의 크기를 알아내는 문제). 그림 설명에는 점마다 0에서 몇 칸 위인지를 적는다.
  const bare = (c, cells) => chart(c, cells, { top: Math.max(10, Math.ceil(top(cells) / 5) * 5) }).replace(/(<text class="mb-axis-label"[^>]*>)(\d+)(<\/text>)/g, (all, head, n) => (n === '0' ? all : '')).replace(/aria-label="[^"]*"/, `aria-label="꺾은선그래프: 세로 눈금에는 0만 적혀 있다. ${c.names.map((n, i) => `${n} ${cells[i]}칸`).join(', ')}"`);
  // 한 틀에 그린 두 꺾은선. legend: [실선의 이름, 점선의 이름]
  const TWO = {
    plants: { names: ['1일', '3일', '5일', '7일', '9일'], title: '날짜', time: '날', tag: as, unit: 'cm', noun: '키', legend: ['가 식물', '나 식물'], intro: '가 식물과 나 식물의 키를 이틀마다' },
    grads: { names: ['2020', '2021', '2022', '2023', '2024'], title: '연도', time: '해', tag: yr, unit: '명', noun: '졸업생 수', legend: ['남학생', '여학생'], intro: '가 초등학교의 졸업생 수를 남학생과 여학생으로 나누어 연도별로' },
    rooms: { names: ['1시', '2시', '3시', '4시', '5시'], title: '시각', time: '시각', tag: pm, unit: '°C', noun: '온도', legend: ['교실 안', '교실 밖'], intro: '어느 날 오후 교실 안과 교실 밖의 온도를 한 시간마다' },
    bikes: { names: MONTHS.slice(0, 5), title: '월', time: '달', tag: as, unit: '대', noun: '판매량', legend: ['두발자전거', '세발자전거'], intro: '어느 가게의 두발자전거와 세발자전거의 판매량을 월별로' },
    pets: { names: MONTHS.slice(0, 5), title: '월', time: '달', tag: as, unit: 'kg', noun: '몸무게', legend: ['강아지', '고양이'], intro: '강아지와 고양이의 몸무게를 매달 1일에' }
  };
  const chart2 = (c, a, b, o) => fixUnit(lineChart(c.names, a, Object.assign({ unit: c.unit, title: c.title, second: b, legend: c.legend, major: MAJOR[(o || {}).step] || 5 }, o || {})));
  // 한 번에 lo~hi 칸씩 오르내리는 칸 수(두 꺾은선의 자료)
  const stroll = (d, n, first, swing, lo, hi) => d.until(() => { const x = [d.int(first[0], first[1])]; for (let i = 1; i < n; i += 1) x.push(x[i - 1] + d.int(-swing, swing)); return x; }, (x) => low(x) >= lo && top(x) <= hi);
  // 따로 그린 두 그래프(기온과 음료 판매량)
  const HEAT = { names: DATES.slice(0, 5), title: '날짜', tag: as, unit: '°C', noun: '기온' }, CUPS = { names: DATES.slice(0, 5), title: '날짜', tag: as, unit: '잔', noun: '판매량' };
  const DUO = '어느 가게에서 닷새 동안 낮 기온과 차가운 음료의 판매량을 조사하여 나타낸 꺾은선그래프이다.';
  const duo = (heat, cups) => cap('날짜별 낮 기온', chart(HEAT, heat, { step: 2 })) + cap('날짜별 차가운 음료 판매량', chart(CUPS, cups, { step: 10 }));
  // 점수 그래프(물결선으로 0과 50 사이를 줄이고 한 칸이 5점)
  const scoreChart = (c, v) => chart(c, v, { step: 5, major: 2, from: 50, top: 100 });
  // 시간에 따라 변하는 양을 조사한 자료와, 항목별 수량을 조사한 자료(뒤의 둘은 때를 이르는 낱말이 들어 있어도 항목을 비교하는 자료이다).
  const TIME_TOPICS = ['월별 강수량', '연도별 나무의 키', '요일별 줄넘기 횟수', '시각별 운동장의 온도', '날짜별 강낭콩의 키', '학년별 나의 몸무게', '월별 전기 사용량', '연도별 마을의 인구'];
  const ITEM_TOPICS = ['반별 학생 수', '좋아하는 간식별 학생 수', '마을별 가구 수', '혈액형별 학생 수', '모둠별 모은 빈 병의 수', '과수원별 사과 생산량', '오후 2시의 지역별 기온', '5월의 반별 빌린 책 수'];
  const PAIRS4 = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

  B.addTypes('4-2-5', 'draw', [
    T('draw-axis', '가로에 때를 나타낼 때 세로에 나타낼 것', '①47 ②39 ③38 심2', (d) => {
      const c = pick(d, d.pick(['jump', 'book', 'rain']), 5), v = vals(d, c, 5, distinct), rows = d.shuffle([[c.noun, true], [c.title, false], ['조사한 사람', false], ['눈금 한 칸의 크기', false]]);
      return C(`${lead(c, '표')} 이 표를 꺾은선그래프로 나타낼 때, 가로에 ${josa(c.title, '을/를')} 나타낸다면 세로에는 무엇을 나타내어야 하는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: tab(c, v), explain: `가로에 ${josa(c.title, '을/를')} 나타내면 세로에는 조사한 수량인 ${josa(c.noun, '을/를')} 나타낸다.`, facts: truthOf(rows, true)
      });
    }),
    T('draw-title', '꺾은선그래프의 제목 정하기', '②45 심72', (d) => {
      const [key, wrong] = d.pick([['temp', ['교실별 온도', '시각별 교실의 학생 수', '온도별 교실의 수']], ['visit', ['도서관별 방문자 수', '날짜별 도서관의 책 수', '방문자별 방문한 횟수']]]), c = pick(d, key, 5), v = vals(d, c, 5, distinct);
      const rows = d.shuffle([[c.what, true]].concat(wrong.map((w) => [w, false])));
      return C(`${lead(c, '표')} 이 표를 꺾은선그래프로 나타낼 때, 그래프의 제목으로 알맞은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: tab(c, v), explain: `${c.title}에 따라 ${josa(c.noun, '이/가')} 변하는 것을 조사하였으므로 제목은 「${c.what}」${tail(c.what, '이/가')} 알맞다.`, facts: truthOf(rows, true)
      });
    }),
    T('draw-step', '알맞은 세로 눈금 한 칸의 크기 정하기', '①48 ②40 ③39 심39', (d) => {
      const best = d.pick([2, 5, 10]), c = pick(d, best === 2 ? 'book' : best === 5 ? 'visit' : 'jump', 5), grid = d.pick([12, 14, 15]), sizes = [1, 2, 5, 10];
      const fits = (s, x) => x.every((y) => y % s === 0) && top(x) <= s * grid;
      const v = d.until(() => cellsOf(d, 5, 3, grid, distinct).map((x) => x * best), (x) => sizes.filter((s) => fits(s, x)).length === 1), big = top(v);
      return C(`${lead(c, '표')} 이 표를 세로 눈금이 0부터 시작하고 모두 ${grid}칸인 모눈종이에 꺾은선그래프로 나타내려고 한다. 점이 모두 눈금 선 위에 놓이게 하려면 세로 눈금 한 칸의 크기를 얼마로 해야 하는가?`, sizes.map((s) => U(c, s)), sizes.indexOf(best), {
        figure: tab(c, v), explain: `가장 큰 값인 ${U(c, big, '을/를')} ${grid}칸 안에 나타낼 수 있어야 하고, 모든 값이 한 칸의 크기로 나누어떨어져야 한다. 한 칸을 ${U(c, best, '으로/로')} 하면 가장 높은 점이 0에서 ${big / best}칸 위에 놓인다.`,
        // 보기마다 (나머지의 합) + (가장 높은 점이 모눈을 넘는가) 를 셈한다. 0 이면 그릴 수 있다.
        facts: { claimed: sizes.map((s) => [`${v.map((x) => `${x}%${s}`).join('+')}+(${big - 1}-${big - 1}%${s * grid})/${s * grid}`, 0]), claimedWant: true }
      });
    }),
    T('draw-wave-step', '물결선을 넣을 때 세로 눈금 한 칸의 크기 정하기', '②44 ③41 심39', (d) => {
      const [key, from, best] = d.pick([['weight', 30, 1], ['tall', 110, 2], ['type', 200, 5]]), c = pick(d, key, 5), grid = d.pick([10, 12]), sizes = [1, 2, 5, 10];
      const fits = (s, x) => x.every((y) => (y - from) % s === 0) && top(x) - from <= s * grid;
      const cells = () => (key === 'tall' ? climb(d, 5, [1, 3], 1, 3, grid) : key === 'weight' ? cellsOf(d, 5, 1, grid, (x) => gaps(x).every((g) => Math.abs(g) <= 2) && new Set(x).size >= 3) : cellsOf(d, 5, 1, grid, distinct));
      const v = d.until(() => cells().map((x) => from + x * best), (x) => sizes.filter((s) => fits(s, x)).length === 1), room = top(v) - from;
      return C(`${lead(c, '표')} 이 표를 0과 ${from} 사이를 물결선으로 줄인 꺾은선그래프로 나타내려고 한다. 물결선 위에 세로 눈금이 ${grid}칸 있을 때, 점이 모두 눈금 선 위에 놓이게 하려면 세로 눈금 한 칸의 크기를 얼마로 해야 하는가?`, sizes.map((s) => U(c, s)), sizes.indexOf(best), {
        figure: tab(c, v), explain: `물결선 위에는 ${from}부터 가장 큰 값 ${top(v)}까지 ${room}만큼을 ${grid}칸 안에 나타내어야 하고, 모든 값이 눈금 선 위에 놓여야 한다. 한 칸을 ${U(c, best, '으로/로')} 하면 가장 높은 점이 눈금 ${from}에서 ${room / best}칸 위에 놓인다.`,
        facts: { claimed: sizes.map((s) => [`${v.map((x) => `(${x}-${from})%${s}`).join('+')}+(${room - 1}-${room - 1}%${s * grid})/${s * grid}`, 0]), claimedWant: true }
      });
    }),
    T('draw-need', '세로 눈금에 꼭 나타내어야 하는 부분', '①50 ②41·42 ③42 심37', (d) => {
      const [key, from, step] = d.pick([['pop', 300, 5], ['type', 200, 10]]), c = pick(d, key, 5), v = cellsOf(d, 5, 1, 14, (x) => distinct(x) && !(x.indexOf(low(x)) === 0 && x.indexOf(top(x)) === 4)).map((x) => from + x * step);
      return M(`${lead(c, '표')} 이 표를 꺾은선그래프로 나타낼 때, 세로 눈금에 꼭 나타내어야 하는 부분은 ${U(c, LABELS[0])}부터 ${U(c, LABELS[1])}까지이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: low(v) }, { label: LABELS[1], answer: top(v) }], {
        figure: tab(c, v), explain: `가장 작은 값부터 가장 큰 값까지는 꼭 나타내어야 한다. 가장 작은 값은 ${c.tag(c.names[v.indexOf(low(v))])}의 ${U(c, low(v))}, 가장 큰 값은 ${c.tag(c.names[v.indexOf(top(v))])}의 ${U(c, top(v))}이다.`,
        facts: { calc: [[String(low(v)), 0], [String(top(v)), 1]] }
      });
    }),
    T('draw-wave', '물결선으로 줄이기에 알맞은 부분', '①51 ①52 ②43 ③40 심38', (d) => {
      const [key, base, step, round] = d.pick([['pop', 300, 5, 20], ['type', 200, 10, 50], ['tall', 110, 2, 10], ['weight', 30, 1, 5]]), c = pick(d, key, 5);
      const v = d.until(() => (key === 'tall' ? climb(d, 5, [1, 3], 1, 4, 14) : cellsOf(d, 5, 1, 14, (x) => new Set(x).size >= 4)).map((x) => base + x * step), (x) => low(x) < base + round && top(x) > base + round);
      const end = base + round * (Math.floor((top(v) - base) / round) + 1), spans = d.shuffle([[0, base], [0, base + round], [base, end], [base + round, end]]);
      return C(`${lead(c, '표')} 이 표를 물결선을 사용한 꺾은선그래프로 나타내려고 한다. 물결선으로 줄이기에 알맞은 부분은?`, spans.map(([lo, hi]) => `${josa(lo, '과/와')} ${hi} 사이`), spans.findIndex(([lo, hi]) => lo === 0 && hi === base), {
        figure: tab(c, v), explain: `값이 하나도 없는 부분만 줄일 수 있다. 가장 작은 값이 ${U(c, low(v))}이므로 0과 ${base} 사이에는 값이 없다. 나머지는 줄이려는 부분에 나타내어야 할 값이 들어 있다.`,
        facts: { truth: spans.map(([lo, hi]) => v.every((x) => x <= lo || x >= hi)), want: true }
      });
    }),
    T('draw-steps', '꺾은선그래프로 나타내는 차례', '①53 ②45 ③43 심72', (d) => {
      const steps = ['가로와 세로에 무엇을 나타낼지 정한다.', '세로 눈금 한 칸의 크기를 정하고 눈금의 수를 쓴다.', '가로 눈금과 세로 눈금이 만나는 자리에 점을 찍는다.', '점들을 선분으로 잇는다.'];
      const shown = d.until(() => d.shuffle([0, 1, 2, 3]), (s) => s.join() !== '0,1,2,3'), right = [0, 1, 2, 3].map((step) => shown.indexOf(step));
      const options = d.shuffle([right, right.slice().reverse(), [right[1], right[0], right[2], right[3]], [right[0], right[1], right[3], right[2]]]);
      return C('표를 꺾은선그래프로 나타내는 차례대로 기호를 쓴 것은?', options.map((o) => o.map((i) => LABELS[i]).join(', ')), options.indexOf(right), {
        figure: tagged(shown.map((step) => steps[step])), explain: '가로와 세로에 무엇을 나타낼지 정하고, 세로 눈금 한 칸의 크기를 정한 다음, 점을 찍고, 점들을 선분으로 잇는다.', facts: { sequence: { ranks: shown, options } }
      });
    }),
    T('draw-how', '꺾은선그래프로 나타내는 방법', '①57 ②45 심72', (d) => {
      const rows = d.shuffle([['세로 눈금 한 칸의 크기는 조사한 값을 모두 나타낼 수 있게 정한다.', true], ['가로 눈금과 세로 눈금이 만나는 자리에 점을 찍는다.', true], ['맨 왼쪽의 점은 세로 눈금 0의 자리와 선분으로 잇는다.', false], ['점들을 왼쪽부터 차례대로 선분으로 잇는다.', true]]);
      return C('표를 꺾은선그래프로 나타내는 방법으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: '선분은 조사한 값을 나타내는 점과 점 사이에만 긋는다. 맨 왼쪽의 점을 0의 자리와 이으면 조사하지 않은 값을 나타내게 된다.', facts: truthOf(rows, false)
      });
    }),
    T('draw-frame', '그래프의 빈 곳에 알맞은 것', '①54', (d) => {
      const c = pick(d, d.pick(['dog', 'rain', 'bean']), 5), v = vals(d, c, 5, distinct);
      const rows = d.shuffle([[`㉠ ${c.unit}, ㉡ ${c.title}`, true], [`㉠ ${c.title}, ㉡ ${c.unit}`, false], [`㉠ ${c.unit}, ㉡ ${c.noun}`, false], [`㉠ ${c.noun}, ㉡ ${c.title}`, false]]);
      return C(`${lead(c, '표')} 이 표를 꺾은선그래프로 나타내었다. 그래프의 ㉠, ㉡에 알맞은 것을 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: tab(c, v) + swapLabel(swapLabel(chart(c, v, { step: c.s[0] }), `(${c.unit})`, '(㉠)'), c.title, '㉡'),
        explain: `세로 눈금 위의 ( ) 안에는 세로가 나타내는 ${c.noun}의 단위인 ${UT(c, '을/를')}, 가로 눈금의 끝에는 가로가 나타내는 ${josa(c.title, '을/를')} 쓴다.`, facts: truthOf(rows, true)
      });
    }),
    T('draw-cell-one', '점을 몇 칸 위에 찍는가(눈금 한 칸이 1)', '①55 ①57 ②47 ③44 심70', (d) => {
      const c = pick(d, d.pick(['book', 'dog']), 5), v = vals(d, c, 5, distinct, 1), k = d.int(0, 4);
      return N(`${lead(c, '표')} 이 표를 세로 눈금 한 칸이 ${U(c, 1, '을/를')} 나타내는 꺾은선그래프로 나타낼 때, ${c.tag(c.names[k])}의 점은 세로 눈금 0에서 몇 칸 위에 찍어야 하는가?`, v[k], {
        unit: '칸', figure: tab(c, v), explain: `${said(c, v, k)}이다. 한 칸이 ${U(c, 1)}이므로 0에서 ${v[k]}칸 위에 찍는다.`, facts: { calc: [[`${v[k]}/1`, 0]], rule: 'one' }
      });
    }),
    T('draw-cells', '점을 몇 칸 위에 찍는가(눈금 한 칸이 1이 아님)', '①57 ②47 ③44 심70', (d) => {
      const [step, key] = d.pick([[2, 'ice'], [5, 'visit'], [10, 'jump'], [20, 'rain']]), c = pick(d, key, 5), v = vals(d, c, 5, distinct, step), k = d.int(0, 4);
      return N(`${lead(c, '표')} 이 표를 세로 눈금 한 칸이 ${U(c, step, '을/를')} 나타내는 꺾은선그래프로 나타낼 때, ${c.tag(c.names[k])}의 점은 세로 눈금 0에서 몇 칸 위에 찍어야 하는가?`, v[k] / step, {
        unit: '칸', figure: tab(c, v), explain: `${said(c, v, k)}이다. 한 칸이 ${U(c, step)}이므로 ${v[k]} ÷ ${step} = ${v[k] / step}(칸) 위에 찍는다.`, facts: { calc: [[`${v[k]}/${step}`, 0]], rule: 'many' }
      });
    }),
    T('draw-wave-cells', '물결선이 있는 그래프에서 점을 몇 칸 위에 찍는가', '①58 ②48 ③37 ③45 심71', (d) => {
      const w = wave(d, 5, distinct), c = w.c, k = d.int(0, 4);
      return N(`${lead(c, '표')} 이 표를 0과 ${w.from} 사이를 물결선으로 줄이고 세로 눈금 한 칸이 ${U(c, w.step, '을/를')} 나타내는 꺾은선그래프로 나타낼 때, ${c.tag(c.names[k])}의 점은 세로 눈금 ${w.from}에서 몇 칸 위에 찍어야 하는가?`, w.cells[k], {
        unit: '칸', figure: tab(c, w.v), explain: `${said(c, w.v, k)}이다. 눈금 ${w.from}보다 ${w.v[k]} - ${w.from} = ${w.v[k] - w.from}만큼 크고 한 칸이 ${U(c, w.step)}이므로 ${w.v[k] - w.from} ÷ ${w.step} = ${w.cells[k]}(칸) 위에 찍는다.`,
        facts: { calc: [[`(${w.v[k]}-${w.from})/${w.step}`, 0]] }
      });
    }),
    T('draw-wrong', '표와 다르게 찍은 점 찾기', '②7 ②47 ③46 심73', (d) => {
      const [step, key] = d.pick([[2, 'ice'], [10, 'jump']]), c = pick(d, key, 5), v = vals(d, c, 5, distinct, step), k = d.int(0, 4), wrong = v.slice();
      wrong[k] = v[k] + (d.bool() ? step : -step);      // 점을 한 칸 위(아래)에 찍은 때
      return C(`표를 보고 꺾은선그래프로 나타내었다. 표와 다르게 점을 찍은 ${josa(c.time, '은/는')}?`, c.names.map(c.tag), k, {
        figure: tab(c, v) + chart(c, wrong, { step }), explain: `세로 눈금 한 칸은 ${U(c, step)}이다. ${josa(c.tag(c.names[k]), '은/는')} 표에서 ${U(c, v[k])}인데 그래프에는 ${U(c, wrong[k])}의 자리에 점을 찍었다.`,
        facts: { mismatch: { table: v, drawn: wrong } }
      });
    }),
    T('draw-bad', '잘못 그린 꺾은선그래프', '②7 심73', (d) => {
      const c = pick(d, 'book', 5), v = vals(d, c, 5, (x) => distinct(x) && gaps(x).every((g) => Math.abs(g) >= 2)), kind = d.int(0, 1), at = d.int(1, 2), order = [0, 1, 2, 3, 4];
      order[at] = at + 1; order[at + 1] = at;
      const base = chart(c, v), figure = (kind === 0 ? noLine(base) : reorder(base, order)).replace('꺾은선그래프: ', kind === 0 ? '점만 찍고 잇지 않은 그래프: ' : `점을 ${order.map((i) => c.names[i]).join(', ')}의 차례로 이은 그래프: `);
      const rows = d.shuffle([['점들을 선분으로 잇지 않았다.', kind === 0], ['점들을 왼쪽부터 차례대로 잇지 않았다.', kind === 1], ['점을 표의 값과 다른 높이에 찍었다.', false], ['세로 눈금의 간격이 일정하지 않다.', false]]);
      return C(`${lead(c, '표')} 이 표를 꺾은선그래프로 나타내었는데 잘못된 곳이 있다. 잘못된 점은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: tab(c, v) + figure, explain: kind === 0 ? '점은 표의 값대로 찍었지만 점들을 선분으로 잇지 않았다. 꺾은선그래프는 점들을 선분으로 이어야 한다.' : `점은 표의 값대로 찍었지만 ${c.names[at - 1]}의 점을 ${c.names[at + 1]}의 점과 먼저 이었다. 점들은 왼쪽부터 차례대로 이어야 한다.`,
        facts: truthOf(rows, true)
      });
    }),
    T('draw-point', '점을 찍을 자리 고르기', '②46 ②47', (d) => {
      const [step, key] = d.pick([[1, 'book'], [2, 'ice'], [10, 'jump']]), c = pick(d, key, 5), k = d.int(2, 4), shift = d.pick([0, 1, 2]);
      const v = vals(d, c, 5, (x) => distinct(x) && x[k] - 2 * (2 - shift) >= 1 && x[k] + 2 * shift <= 14, step), roof = Math.max(roofOf(v, step), 15 * step);
      const cands = [0, 1, 2].map((i) => v[k] + 2 * step * (shift - i));      // 위에서부터 ㉠, ㉡, ㉢. 바른 자리는 shift 번째
      return C(`${lead(c, '표')} 이 표를 꺾은선그래프로 나타내고 있다. ${c.tag(c.names[k])}의 점을 찍어야 하는 자리는?`, LABELS.slice(0, 3), shift, {
        figure: tab(c, v) + spots(c, v, k, cands, { step, top: roof }), explain: `${said(c, v, k)}이다. 세로 눈금 한 칸이 ${U(c, step)}이므로 0에서 ${v[k] / step}칸 위인 ${LABELS[shift]}에 찍는다. ㉠, ㉡, ㉢은 차례로 ${cands.map((x) => U(c, x)).join(', ')}의 자리이다.`,
        facts: { claimed: cands.map((x) => [String(x), v[k]]), claimedWant: true }
      });
    }),
    T('draw-rescale-gap', '눈금 한 칸의 크기를 바꾸면 몇 칸 차이인가', '①45 ②18 심43', (d) => {
      const [step, next, key] = d.pick([[10, 5, 'jump'], [20, 10, 'pop'], [10, 20, 'jump'], [2, 1, 'ice'], [2, 4, 'ice']]), c = pick(d, key, 5), v = vals(d, c, 5, (x) => distinct(x) && x.some((p) => x.some((q) => p > q && ((p - q) * step) % next === 0)), step);
      const [i, j] = d.until(() => d.shuffle([0, 1, 2, 3, 4]).slice(0, 2), ([p, q]) => v[p] > v[q] && (v[p] - v[q]) % next === 0), gap = v[i] - v[j];
      return N(`${lead(c)} 세로 눈금 한 칸이 ${U(c, next, '을/를')} 나타내도록 다시 그리면, ${c.tag(c.names[i])}의 점과 ${c.tag(c.names[j])}의 점의 높이는 몇 칸 차이가 나는가?`, gap / next, {
        unit: '칸', figure: chart(c, v, { step }), explain: `${said(c, v, i)}, ${said(c, v, j)}이므로 차는 ${U(c, gap)}이다. 한 칸이 ${U(c, next)}이면 ${gap} ÷ ${next} = ${gap / next}(칸) 차이가 난다. 눈금 한 칸의 크기가 ${next < step ? '작아지면 칸 수는 늘어난다' : '커지면 칸 수는 줄어든다'}.`,
        facts: { calc: [[`(${v[i]}-${v[j]})/${next}`, 0]] }
      });
    })
  ]);

  B.addTypes('4-2-5', 'gather', [
    T('col-text', '글을 읽고 표로 정리하기', '①59 ②51 ③47 심51', (d) => {
      const c = pick(d, d.pick(['ice', 'book']), 5), v = vals(d, c, 5, distinct), [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((p, q) => p - q), order = d.until(() => d.shuffle([0, 1, 2, 3, 4]), (o) => o.join() !== '0,1,2,3,4');
      return M(`${c.intro} 조사하여 쪽지에 적었다. 쪽지를 보고 표로 정리할 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: v[i] }, { label: LABELS[1], answer: v[j] }], {
        figure: lines([`「${order.map((n) => `${c.tag(c.names[n])} ${U(c, v[n])}`).join(', ')}」`]) + tab(c, v.map((x, n) => (n === i ? box(LABELS[0]) : n === j ? box(LABELS[1]) : x))),
        explain: `쪽지에는 ${c.title}의 차례가 섞여 있다. ${josa(c.tag(c.names[i]), '과/와')} ${c.tag(c.names[j])}의 값을 찾아 쓴다. ${said(c, v, i)}, ${said(c, v, j)}이다.`, facts: { calc: [[String(v[i]), 0], [String(v[j]), 1]] }
      });
    }),
    T('col-convert', '단위를 고쳐 표로 정리하기', '①61 ②51', (d) => {
      const names = DAYS.slice(0, 5), mins = cellsOf(d, 5, 9, 26, (x) => distinct(x) && x.filter((y) => y > 12 && y % 12 !== 0).length >= 2).map((x) => x * 5);
      const [i, j] = d.shuffle([0, 1, 2, 3, 4].filter((n) => mins[n] > 60 && mins[n] % 60 !== 0)).slice(0, 2).sort((p, q) => p - q);
      const clock = (m) => (m < 60 ? `${m}분` : m % 60 === 0 ? `${m / 60}시간` : `${Math.floor(m / 60)}시간 ${m % 60}분`), parts = (m) => [Math.floor(m / 60), m % 60];
      return M('지우가 요일별로 피아노를 연습한 시간을 조사한 표이다. 연습한 시간을 모두 분으로 고쳐 꺾은선그래프로 나타내려고 한다. 표의 ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: mins[i] }, { label: LABELS[1], answer: mins[j] }], {
        figure: table(['요일', '연습한 시간', '시간(분)'], names.map((n, k) => [day(n), clock(mins[k]), k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : mins[k]])),
        explain: '1시간은 60분이다. ' + [mins[i], mins[j]].map((m) => (parts(m)[0] === 1 ? `${clock(m)}은 60 + ${parts(m)[1]} = ${m}(분)이다.` : `${parts(m)[0]}시간은 60 × ${parts(m)[0]} = ${60 * parts(m)[0]}(분)이므로 ${clock(m)}은 ${60 * parts(m)[0]} + ${parts(m)[1]} = ${m}(분)이다.`)).join(' '),
        facts: { calc: [[`60*${parts(mins[i])[0]}+${parts(mins[i])[1]}`, 0], [`60*${parts(mins[j])[0]}+${parts(mins[j])[1]}`, 1]], unseen: [60] }
      });
    }),
    T('col-add', '두 수를 더해 표로 정리하기', '①61', (d) => {
      const at = d.int(0, 2), names = MONTHS.slice(at, at + 5), boys = cellsOf(d, 5, 1, 7), girls = cellsOf(d, 5, 1, 7), [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((p, q) => p - q);
      return M('어느 학교에 전학 온 학생 수를 월별로 남학생과 여학생으로 나누어 조사한 표이다(단위: 명). 월별로 전학 온 전체 학생 수를 꺾은선그래프로 나타내려고 할 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: boys[i] + girls[i] }, { label: LABELS[1], answer: boys[j] + girls[j] }], {
        figure: table(['월', '남학생', '여학생', '전체'], names.map((n, k) => [n, boys[k], girls[k], k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : boys[k] + girls[k]])),
        explain: `달마다 남학생 수와 여학생 수를 더한다. ${names[i]}은 ${boys[i]} + ${girls[i]} = ${boys[i] + girls[i]}(명), ${names[j]}은 ${boys[j]} + ${girls[j]} = ${boys[j] + girls[j]}(명)이다.`,
        facts: { calc: [[`${boys[i]}+${girls[i]}`, 0], [`${boys[j]}+${girls[j]}`, 1]] }
      });
    }),
    T('col-tally', '낱낱의 자료를 세어 표로 정리하기', '①60 ②51', (d) => {
      const names = DAYS.slice(0, 5), counts = d.until(() => Array.from({ length: 5 }, () => d.int(2, 6)), (x) => new Set(x).size >= 3 && sum(x) >= 17 && sum(x) <= 21), k = d.int(0, 4);
      const list = d.shuffle(names.flatMap((n, i) => Array(counts[i]).fill(n)));
      return N('학급 문고에서 책을 한 권 빌려 갈 때마다 빌려 간 요일을 쪽지에 적어 모았다. 요일별 빌려 간 책 수를 표로 정리할 때, ㉠에 알맞은 수는?', counts[k], {
        figure: words(list) + table(['요일', '빌려 간 책 수(권)'], names.map((n, i) => [day(n), i === k ? box(LABELS[0]) : counts[i]])),
        explain: `빠뜨리거나 두 번 세지 않도록 표시하면서 센다. 「${names[k]}」이라고 적힌 쪽지는 ${counts[k]}장이다.`, facts: { tallyOf: { list, target: names[k] } }
      });
    }),
    T('col-period', '큰 표에서 필요한 기간만 골라 나타내기', '②52', (d) => {
      const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], at = d.int(0, 3), inside = (x) => x.slice(at, at + 5);
      const v = cellsOf(d, 8, 1, 14, (x) => distinct(x) && low(inside(x)) !== low(x) && top(inside(x)) !== top(x)).map((x) => 500 + x * 10), part = inside(v);
      return M(`가 마을의 인구를 연도별로 조사하여 나타낸 표이다. 이 가운데 ${years[at]}년부터 ${years[at + 4]}년까지의 인구의 변화만 꺾은선그래프로 나타내려고 한다. 세로 눈금에 꼭 나타내어야 하는 부분은 ㉠명부터 ㉡명까지이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: low(part) }, { label: LABELS[1], answer: top(part) }], {
        figure: table(['연도', '인구(명)'], years.map((y, i) => [y + '년', v[i]])),
        explain: `${years[at]}년부터 ${years[at + 4]}년까지의 값만 본다. 이 가운데 가장 작은 값은 ${low(part)}명, 가장 큰 값은 ${top(part)}명이다. 나타내지 않는 해의 값은 따지지 않는다.`,
        facts: { calc: [[String(low(part)), 0], [String(top(part)), 1]] }
      });
    }),
    T('col-steps', '자료를 조사하여 꺾은선그래프로 나타내는 차례', '②53 ③48', (d) => {
      const steps = ['조사할 주제를 정한다.', '주제에 맞게 자료를 모은다.', '모은 자료를 표와 꺾은선그래프로 나타낸다.', '꺾은선그래프를 보고 알게 된 것을 이야기한다.'];
      const shown = d.until(() => d.shuffle([0, 1, 2, 3]), (s) => s.join() !== '0,1,2,3'), right = [0, 1, 2, 3].map((step) => shown.indexOf(step));
      const options = d.shuffle([right, right.slice().reverse(), [right[1], right[0], right[2], right[3]], [right[0], right[1], right[3], right[2]]]);
      return C('자료를 조사하여 꺾은선그래프로 나타내고 알아보는 차례대로 기호를 쓴 것은?', options.map((o) => o.map((i) => LABELS[i]).join(', ')), options.indexOf(right), {
        figure: tagged(shown.map((step) => steps[step])), explain: '주제를 정하고, 자료를 모은 다음, 모은 자료를 표와 꺾은선그래프로 나타내고, 그래프를 보고 알게 된 것을 이야기한다.', facts: { sequence: { ranks: shown, options } }
      });
    })
  ]);

  B.addTypes('4-2-5', 'miss', [
    T('miss-both', '표와 꺾은선그래프를 서로 보고 완성하기', '②50 심45', (d) => {
      const [step, key] = d.pick([[2, 'ice'], [10, 'jump'], [5, 'visit']]), c = pick(d, key, 5), v = vals(d, c, 5, distinct, step), [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
      return M(`${lead(c, '표와 꺾은선그래프')} 표의 ㉠에 알맞은 수와, 꺾은선그래프에서 ${c.tag(c.names[j])}의 점을 세로 눈금 0에서 몇 칸 위에 찍어야 하는지를 차례로 구하시오.`, [{ label: LABELS[0], answer: v[i] }, { label: '점의 자리', answer: v[j] / step, unit: '칸' }], {
        figure: tab(c, v.map((x, n) => (n === i ? box(LABELS[0]) : x))) + chart(c, hide(v, j), { step, top: roofOf(v, step) }),
        explain: `꺾은선그래프에서 ${said(c, v, i)}이므로 ㉠은 ${v[i]}이다. 표에서 ${said(c, v, j)}이고 세로 눈금 한 칸이 ${U(c, step)}이므로 점은 0에서 ${v[j]} ÷ ${step} = ${v[j] / step}(칸) 위에 찍는다.`,
        facts: { calc: [[String(v[i]), 0], [`${v[j]}/${step}`, 1]] }
      });
    }),
    T('miss-total', '모두 더한 값으로 빠진 값 구하기', '②17 심46', (d) => {
      const c = pick(d, 'book', 5), v = vals(d, c, 5, distinct), k = d.int(0, 4), total = sum(v), rest = v.filter((_, i) => i !== k);
      return N(`${lead(c)} ${c.names[0]}부터 ${c.names[4]}까지 빌린 책이 모두 ${total}권일 때, 점을 찍지 않은 ${c.names[k]}에 빌린 책은 몇 권인가?`, v[k], {
        unit: '권', figure: chart(c, hide(v, k), { top: roofOf(v, 1) }), explain: `모두 더한 값에서 나머지 네 달의 값을 뺀다. ${total} - ${rest.join(' - ')} = ${v[k]}`, facts: { calc: [[`${total}-${rest.join('-')}`, 0]] }
      });
    }),
    T('miss-gap', '「몇 더 많다(적다)」로 빠진 값 구하기', '②16 심48', (d) => {
      const c = pick(d, 'jump', 6, 0), g = d.pick([10, 20, 30]), more = d.bool(), v = vals(d, c, 5, (x) => distinct(x) && x[4] * 10 - g >= 20 && x[4] * 10 + g <= 150), sat = more ? v[4] + g : v[4] - g;
      return N(`${lead(c)} 토요일의 줄넘기 횟수는 금요일보다 ${g}회 더 ${more ? '많다' : '적다'}. 토요일의 줄넘기 횟수는 몇 회인가?`, sat, {
        unit: '회', figure: chart(c, v.concat([null]), { step: 10, top: 150 }), explain: `금요일의 줄넘기 횟수는 ${v[4]}회이다. ${v[4]} ${more ? '+' : '-'} ${g} = ${sat}`, facts: { calc: [[`${v[4]}${more ? '+' : '-'}${g}`, 0]] }
      });
    })
  ]);

  B.addTypes('4-2-5', 'two', [
    T('two-read', '같은 때의 두 값 읽기', '①63 ②57', (d) => {
      const c = TWO.plants, [a, b] = d.until(() => [climb(d, 5, [1, 3], 1, 3, 14), climb(d, 5, [1, 3], 1, 3, 14)], ([x, y]) => x.every((p, i) => p !== y[i])), k = d.int(1, 4);
      return M(`${lead(c)} ${c.names[k]}에 가 식물과 나 식물의 키는 각각 몇 cm인가?`, [{ label: '가 식물', answer: a[k], unit: 'cm' }, { label: '나 식물', answer: b[k], unit: 'cm' }], {
        figure: chart2(c, a, b), explain: `실선은 가 식물, 점선은 나 식물을 나타낸다. ${c.names[k]}에 가 식물은 ${a[k]} cm, 나 식물은 ${b[k]} cm이다.`, facts: { calc: [[String(a[k]), 0], [String(b[k]), 1]] }
      });
    }),
    T('two-gap', '같은 때의 두 값의 차', '①64 ②60 심56', (d) => {
      const c = TWO.rooms, [a, b] = d.until(() => [stroll(d, 5, [7, 10], 1, 6, 12), stroll(d, 5, [6, 12], 2, 5, 14)], ([x, y]) => x.every((p, i) => p !== y[i])).map((x) => x.map((y) => y * 2)), k = d.int(0, 4);
      return N(`${lead(c)} ${c.tag(c.names[k])}에 교실 안과 교실 밖의 온도의 차는 몇 °C인가?`, Math.abs(a[k] - b[k]), {
        unit: '°C', figure: chart2(c, a, b, { step: 2 }), explain: `${c.tag(c.names[k])}에 교실 안은 ${a[k]} °C, 교실 밖은 ${b[k]} °C이다. ${Math.max(a[k], b[k])} - ${Math.min(a[k], b[k])} = ${Math.abs(a[k] - b[k])}`,
        facts: { calc: [[`${Math.max(a[k], b[k])}-${Math.min(a[k], b[k])}`, 0]] }
      });
    }),
    T('two-more', '한쪽이 더 많은 때 찾기', '①65 심60', (d) => {
      const c = TWO.bikes, [a, b] = d.until(() => [stroll(d, 5, [6, 11], 3, 2, 14), stroll(d, 5, [3, 9], 3, 2, 14)], ([x, y]) => x.every((p, i) => p !== y[i]) && x.filter((p, i) => y[i] > p).length === 1), hit = a.findIndex((p, i) => b[i] > p);
      return C(`${lead(c)} 세발자전거가 두발자전거보다 더 많이 팔린 달은?`, c.names, hit, {
        figure: chart2(c, a, b), explain: `점선(세발자전거)이 실선(두발자전거)보다 위에 있는 달을 찾는다. ${c.names[hit]}에 두발자전거는 ${a[hit]}대, 세발자전거는 ${b[hit]}대가 팔렸다.`,
        facts: { only: { values: b.map((q, i) => q - a[i]), test: 'atLeast', target: 1 } }
      });
    }),
    T('two-shape', '두 꺾은선이 변하는 모습', '①66', (d) => {
      const c = TWO.grads, ups = [d.bool(), d.bool()], make = (up) => d.until(() => { const x = [up ? d.int(2, 5) : d.int(10, 13)]; for (let i = 1; i < 5; i += 1) x.push(x[i - 1] + (up ? 1 : -1) * d.int(1, 2)); return x; }, (x) => low(x) >= 1 && top(x) <= 14);
      const [a, b] = d.until(() => [make(ups[0]), make(ups[1])], ([x, y]) => x.every((p, i) => p !== y[i])).map((x) => x.map((y) => y * 10)), rising = (x) => gaps(x).every((g) => g > 0), falling = (x) => gaps(x).every((g) => g < 0);
      const rows = d.shuffle([[true, true], [true, false], [false, true], [false, false]].map(([p, q]) => [`남학생은 계속 ${p ? '늘었고' : '줄었고'}, 여학생은 계속 ${q ? '늘었다' : '줄었다'}.`, (p ? rising(a) : falling(a)) && (q ? rising(b) : falling(b))]));
      return C(`${lead(c)} 남학생과 여학생의 졸업생 수가 변한 모습을 바르게 말한 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: chart2(c, a, b, { step: 10 }), explain: `실선(남학생)은 오른쪽 ${ups[0] ? '위로 올라가므로 계속 늘었고' : '아래로 내려가므로 계속 줄었고'}, 점선(여학생)은 오른쪽 ${ups[1] ? '위로 올라가므로 계속 늘었다' : '아래로 내려가므로 계속 줄었다'}.`, facts: truthOf(rows, true)
      });
    }),
    T('two-faster', '변하는 양이 점점 커지는 쪽 찾기', '①67 ②57', (d) => {
      const c = TWO.plants, fast = [1, 2, 3, 4], slow = d.pick([[4, 3, 2, 1], [3, 3, 2, 2], [2, 2, 2, 2]]), grown = (start, steps) => steps.reduce((x, s) => x.concat([x[x.length - 1] + s]), [start]), swap = d.bool();
      const lines2 = [grown(d.int(1, 3), fast), grown(d.int(1, 3), slow)], [a, b] = swap ? [lines2[1], lines2[0]] : lines2, more = (x) => gaps(gaps(x)).every((g) => g > 0);
      return C(`${lead(c)} 날이 갈수록 이틀 동안 자라는 키가 점점 커지는 식물은?`, c.legend, swap ? 1 : 0, {
        figure: chart2(c, a, b), explain: `이틀 동안 자란 키는 차례로 가 식물이 ${gaps(a).join(', ')} cm, 나 식물이 ${gaps(b).join(', ')} cm이다. 선분이 뒤로 갈수록 더 많이 기울어지는 ${c.legend[swap ? 1 : 0]}의 자라는 키가 점점 커진다.`,
        facts: { truth: [more(a), more(b)], want: true }
      });
    }),
    T('two-gap-most', '두 값의 차가 가장 큰 때 찾기', '심57', (d) => {
      const c = TWO.rooms, [a, b] = d.until(() => [stroll(d, 5, [7, 10], 1, 6, 12), stroll(d, 5, [6, 12], 2, 4, 14)], ([x, y]) => { const g = x.map((p, i) => Math.abs(p - y[i])); return low(g) >= 1 && lone(g, top(g)) && top(g) - g.slice().sort((p, q) => q - p)[1] === 1; }).map((x) => x.map((y) => y * 2));
      const g = a.map((p, i) => Math.abs(p - b[i])), hit = g.indexOf(top(g));
      return C(`${lead(c)} 교실 안과 교실 밖의 온도의 차가 가장 큰 시각은?`, c.names.map(c.tag), hit, {
        figure: chart2(c, a, b, { step: 2 }), explain: `두 꺾은선이 세로로 가장 많이 벌어진 때를 찾는다. 시각마다 두 온도의 차는 ${c.names.map((n, i) => `${n} ${g[i]} °C`).join(', ')}이다.`,
        facts: { choose: { exprs: a.map((p, i) => `${Math.max(p, b[i])}-${Math.min(p, b[i])}`), rule: 'max' } }
      });
    }),
    T('two-gap-least', '두 값의 차가 가장 작은 때 찾기', '심58', (d) => {
      const c = TWO.pets, [a, b] = d.until(() => [climb(d, 5, [2, 4], 0, 2, 13), climb(d, 5, [2, 4], 0, 2, 13)], ([x, y]) => { const g = x.map((p, i) => Math.abs(p - y[i])); return low(g) >= 1 && lone(g, low(g)) && top(x) > x[0] && top(y) > y[0]; });
      const g = a.map((p, i) => Math.abs(p - b[i])), hit = g.indexOf(low(g));
      return C(`${lead(c)} 강아지와 고양이의 몸무게의 차가 가장 작은 달은?`, c.names, hit, {
        figure: chart2(c, a, b), explain: `두 꺾은선이 세로로 가장 가까운 때를 찾는다. 달마다 두 몸무게의 차는 ${c.names.map((n, i) => `${n} ${g[i]} kg`).join(', ')}이다.`,
        facts: { choose: { exprs: a.map((p, i) => `${Math.max(p, b[i])}-${Math.min(p, b[i])}`), rule: 'min' } }
      });
    }),
    T('two-meet', '두 값이 같은 때 찾기', '심59', (d) => {
      const c = TWO.grads, [a, b] = d.until(() => [stroll(d, 5, [6, 10], 2, 4, 13), stroll(d, 5, [6, 10], 2, 4, 13)], ([x, y]) => x.filter((p, i) => p === y[i]).length === 1 && distinct(x) && distinct(y) && [0, 1, 2, 3].every((i) => (x[i] - y[i]) * (x[i + 1] - y[i + 1]) >= 0)).map((x) => x.map((y) => y * 10)), hit = a.findIndex((p, i) => p === b[i]);
      return C(`${lead(c)} 남학생과 여학생의 졸업생 수가 같은 해는?`, c.names.map(yr), hit, {
        figure: chart2(c, a, b, { step: 10 }), explain: `두 꺾은선의 점이 겹치는 때를 찾는다. ${yr(c.names[hit])}에는 남학생과 여학생이 모두 ${a[hit]}명이다.`, facts: { claimed: a.map((p, i) => [String(p), b[i]]), claimedWant: true }
      });
    }),
    T('two-whole', '두 꺾은선에서 조사한 동안 늘어난 양', '③50', (d) => {
      const c = TWO.pets, [a, b] = d.until(() => [climb(d, 5, [2, 4], 0, 3, 13), climb(d, 5, [2, 4], 0, 2, 13)], ([x, y]) => x[4] - x[0] !== y[4] - y[0] && y[4] > y[0] && x.every((p, i) => p !== y[i]));
      return M(`${lead(c)} ${c.names[0]}부터 ${c.names[4]}까지 강아지와 고양이의 몸무게는 각각 몇 kg 늘었는가?`, [{ label: '강아지', answer: a[4] - a[0], unit: 'kg' }, { label: '고양이', answer: b[4] - b[0], unit: 'kg' }], {
        figure: chart2(c, a, b), explain: `꺾은선마다 처음과 끝의 값을 읽어 뺀다. 강아지는 ${a[4]} - ${a[0]} = ${a[4] - a[0]}(kg), 고양이는 ${b[4]} - ${b[0]} = ${b[4] - b[0]}(kg) 늘었다.`,
        facts: { calc: [[`${a[4]}-${a[0]}`, 0], [`${b[4]}-${b[0]}`, 1]] }
      });
    }),
    T('two-flat-each', '두 꺾은선 각각의 변화가 가장 작은 때', '심63', (d) => {
      const c = TWO.bikes, [a, b] = d.until(() => [stroll(d, 5, [4, 12], 4, 2, 14), stroll(d, 5, [4, 12], 4, 2, 14)], ([x, y]) => { const p = mags(x), q = mags(y); return low(p) >= 1 && low(q) >= 1 && lone(p, low(p)) && lone(q, low(q)) && p.indexOf(low(p)) !== q.indexOf(low(q)) && x.every((u, i) => u !== y[i]); });
      const ia = mags(a).indexOf(low(mags(a))), ib = mags(b).indexOf(low(mags(b))), rows = d.shuffle([[ia, ib], [ib, ia], [ia, ia], [ib, ib]]), span = (v, i) => `${Math.max(v[i], v[i + 1])}-${Math.min(v[i], v[i + 1])}`;
      return C(`${lead(c)} 두발자전거와 세발자전거의 판매량의 변화가 가장 작은 때를 각각 바르게 쓴 것은?`, rows.map(([p, q]) => `두발자전거: ${between(c, p)}, 세발자전거: ${between(c, q)}`), rows.findIndex(([p, q]) => p === ia && q === ib), {
        figure: chart2(c, a, b), explain: `꺾은선마다 가장 적게 기울어진 선분을 따로 찾는다. 실선(두발자전거)은 ${between(c, ia)}에 ${mags(a)[ia]}대, 점선(세발자전거)은 ${between(c, ib)}에 ${mags(b)[ib]}대 변하여 가장 적게 변하였다.`,
        // 고른 두 구간에서 변한 양을 더한 값은 바르게 고른 보기에서 가장 작다.
        facts: { choose: { exprs: rows.map(([p, q]) => `${span(a, p)}+${span(b, q)}`), rule: 'min' } }
      });
    }),
    T('two-cross', '한 꺾은선에서 찾은 때를 다른 꺾은선에서 읽기', '심64', (d) => {
      const c = TWO.grads, [a, b] = d.until(() => [stroll(d, 5, [6, 10], 2, 4, 13), stroll(d, 5, [6, 10], 2, 4, 13)], ([x, y]) => { const m = x.indexOf(top(x)); return lone(x, top(x)) && y[m] !== top(y) && y[m] !== x[m]; }).map((x) => x.map((y) => y * 10)), m = a.indexOf(top(a));
      return N(`${lead(c)} 남학생 졸업생이 가장 많은 해에 여학생 졸업생은 몇 명인가?`, b[m], {
        unit: '명', figure: chart2(c, a, b, { step: 10 }), explain: `실선(남학생)에서 가장 높은 점은 ${yr(c.names[m])}의 ${a[m]}명이다. 그해에 점선(여학생)은 ${b[m]}명을 나타낸다.`, facts: { calc: [[String(b[m]), 0]] }
      });
    }),
    T('duo-cross', '한 그래프에서 찾은 때를 다른 그래프에서 읽기', '②59 심66', (d) => {
      const [heat, cups] = d.until(() => [stroll(d, 5, [9, 13], 2, 8, 15).map((x) => x * 2), cellsOf(d, 5, 3, 14, distinct).map((x) => x * 10)], ([x, y]) => lone(x, top(x)) && gaps(x).every((g) => g !== 0) && y[x.indexOf(top(x))] !== top(y)), m = heat.indexOf(top(heat));
      return N(`${DUO} 낮 기온이 가장 높은 날의 음료 판매량은 몇 잔인가?`, cups[m], {
        unit: '잔', figure: duo(heat, cups), explain: `기온 그래프에서 가장 높은 점은 ${HEAT.names[m]}의 ${heat[m]} °C이다. 판매량 그래프에서 ${HEAT.names[m]}의 판매량은 ${cups[m]}잔이다.`, facts: { calc: [[String(cups[m]), 0]] }
      });
    })
  ]);

  B.addTypes('4-2-5', 'kind', [
    T('kind-use', '막대그래프와 꺾은선그래프의 쓰임', '①70 ②62 ③54', (d) => {
      const rows = d.shuffle([['㉠ 막대그래프, ㉡ 꺾은선그래프', true], ['㉠ 꺾은선그래프, ㉡ 막대그래프', false], ['㉠ 막대그래프, ㉡ 그림그래프', false], ['㉠ 꺾은선그래프, ㉡ 그림그래프', false]]);
      return C('( ㉠ )는 항목별 수량의 많고 적음을 비교하기에 편리하고, ( ㉡ )는 시간에 따른 수량의 변화를 알아보기에 편리하다. ㉠, ㉡에 알맞은 그래프를 바르게 짝 지은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: '막대그래프는 막대의 길이로 항목별 수량을 비교하기 쉽고, 꺾은선그래프는 선분이 기울어진 모양으로 시간에 따른 변화를 알아보기 쉽다.', facts: truthOf(rows, true)
      });
    }),
    T('kind-fit', '꺾은선그래프로 나타내기에 알맞은 자료 고르기', '①71 ②63 ③58 심75', (d) => {
      const right = d.pick(TIME_TOPICS), rows = d.shuffle([[right, true]].concat(d.shuffle(ITEM_TOPICS).slice(0, 3).map((t) => [t, false])));
      return C('꺾은선그래프로 나타내기에 가장 알맞은 자료는?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: `「${right}」는 시간에 따라 변하는 양을 조사한 자료이므로 꺾은선그래프로 나타내면 변화를 알아보기 쉽다. 나머지는 항목별 수량을 비교하는 자료이므로 막대그래프가 알맞다.`, facts: truthOf(rows, true)
      });
    }),
    T('kind-count', '꺾은선그래프로 나타내기에 알맞은 자료의 수', '①71 ③58 심75', (d) => {
      const n = d.int(1, 3), rows = d.shuffle(d.shuffle(TIME_TOPICS).slice(0, n).map((t) => [t, true]).concat(d.shuffle(ITEM_TOPICS).slice(0, 4 - n).map((t) => [t, false])));
      return N('조사한 자료 가운데 꺾은선그래프로 나타내기에 알맞은 것은 모두 몇 개인가?', n, {
        unit: '개', figure: tagged(rows.map((r) => r[0])), explain: `시간에 따라 변하는 양을 조사한 자료를 찾는다. ${rows.map((r, i) => (r[1] ? LABELS[i] : '')).filter(Boolean).join(', ')}의 ${n}개이다. 나머지는 항목별 수량을 비교하는 자료이므로 막대그래프가 알맞다.`,
        facts: { count: rows.map((r) => r[1]) }
      });
    }),
    T('kind-split', '자료를 알맞은 그래프끼리 가르기', '①71 ③59 심76', (d) => {
      const rows = d.shuffle(d.shuffle(TIME_TOPICS).slice(0, 2).map((t) => [t, true]).concat(d.shuffle(ITEM_TOPICS).slice(0, 2).map((t) => [t, false])));
      const right = PAIRS4.find(([i, j]) => rows[i][1] && rows[j][1]), shown = d.shuffle(d.shuffle(PAIRS4.filter((p) => p !== right)).slice(0, 3).concat([right]));
      return C('조사한 자료 넷을 막대그래프로 나타낼 것과 꺾은선그래프로 나타낼 것으로 나누려고 한다. 꺾은선그래프로 나타내기에 알맞은 것끼리 짝 지은 것은?', shown.map(([i, j]) => `${LABELS[i]}, ${LABELS[j]}`), shown.indexOf(right), {
        figure: tagged(rows.map((r) => r[0])), explain: `시간에 따라 변하는 양을 조사한 ${LABELS[right[0]]}, ${LABELS[right[1]]}은 꺾은선그래프가 알맞고, 항목별 수량을 비교하는 나머지 둘은 막대그래프가 알맞다.`,
        facts: { truth: shown.map(([i, j]) => rows[i][1] && rows[j][1]), want: true }
      });
    }),
    T('kind-table', '표를 보고 알맞은 그래프 고르기', '①72 ②62 ③57', (d) => {
      const c = pick(d, d.pick(['type', 'rain']), 5), v = vals(d, c, 5, distinct);
      const rows = d.shuffle([['꺾은선그래프 — 변하는 모습이 선분으로 이어져 한눈에 보인다.', true], ['그림그래프 — 그림의 수가 많을수록 많이 변한 것이다.', false], ['막대그래프 — 가장 긴 막대가 가장 많이 변한 때이다.', false], ['꺾은선그래프 — 조사한 수의 합계가 적혀 있다.', false]]);
      return C(`${lead(c, '표')} ${c.title}에 따라 ${josa(c.noun, '이/가')} 어떻게 변하는지 한눈에 알아보려고 한다. 알맞은 그래프와 그 까닭을 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: tab(c, v), explain: '시간에 따른 변화를 알아보려면 꺾은선그래프가 알맞다. 선분이 기울어진 방향과 정도로 늘고 준 것과 변한 크기를 한눈에 알 수 있다.', facts: truthOf(rows, true)
      });
    }),
    T('kind-two-tables', '두 표 가운데 꺾은선그래프로 나타내기에 알맞은 표', '①72 ③60 심75', (d) => {
      const fruits = d.shuffle(['사과', '포도', '딸기', '수박', '참외']).slice(0, 4), liked = cellsOf(d, 4, 3, 12, distinct), crop = cellsOf(d, 4, 3, 12, distinct), timeFirst = d.bool();
      const item = table(['과일', '학생 수(명)'], fruits.map((n, i) => [n, liked[i]])), time = table(['요일', '딸기 수확량(상자)'], DAYS.slice(0, 4).map((n, i) => [day(n), crop[i]])), [timeAt, itemAt] = timeFirst ? ['(가)', '(나)'] : ['(나)', '(가)'];
      const rows = d.shuffle([[`${timeAt} — 시간에 따라 변하는 양을 조사한 자료이다.`, true], [`${itemAt} — 여러 항목의 수량을 조사한 자료이다.`, false], [`${timeAt} — 조사한 수가 더 크다.`, false], [`${itemAt} — 항목의 이름이 낱말로 적혀 있다.`, false]]);
      return C('좋아하는 과일별 학생 수와 요일별 딸기 수확량을 조사하여 나타낸 표이다. 두 표 가운데 꺾은선그래프로 나타내기에 더 알맞은 표와 그 까닭을 바르게 짝 지은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: cap('(가)', timeFirst ? time : item) + cap('(나)', timeFirst ? item : time), explain: `요일별 딸기 수확량은 시간에 따라 변하는 양이므로 꺾은선그래프로 나타내면 변화를 알아보기 쉽다. 좋아하는 과일별 학생 수는 항목별 수량을 비교하는 자료이므로 막대그래프가 알맞다.`, facts: truthOf(rows, true)
      });
    }),
    T('kind-want', '알고 싶은 것에 맞는 자료 고르기', '②64', (d) => {
      const tastes = ['딸기 맛', '초콜릿 맛', '바닐라 맛', '녹차 맛'], sold = cellsOf(d, 4, 12, 30, distinct), at = d.int(0, 3), months = MONTHS.slice(at, at + 4), monthly = cellsOf(d, 4, 12, 30, distinct), timeFirst = d.bool();
      const item = table(['맛', '판매량(개)'], tastes.map((n, i) => [n, sold[i]])), time = table(['월', '판매량(개)'], months.map((n, i) => [n, monthly[i]])), [timeAt, itemAt] = timeFirst ? ['(가)', '(나)'] : ['(나)', '(가)'];
      const rows = d.shuffle([[`㉠ ${itemAt}, ㉡ ${timeAt}`, true], [`㉠ ${timeAt}, ㉡ ${itemAt}`, false], [`㉠ ${itemAt}, ㉡ ${itemAt}`, false], [`㉠ ${timeAt}, ㉡ ${timeAt}`, false]]);
      return C(`어느 가게의 아이스크림 판매량을 두 가지로 조사하여 나타낸 표이다. ㉠ 가장 많이 팔린 맛, ㉡ ${months[0]}부터 ${months[3]}까지 판매량의 변화를 알아보려고 한다. 각각 살펴보아야 하는 표를 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: cap('(가)', timeFirst ? time : item) + cap('(나)', timeFirst ? item : time), explain: `가장 많이 팔린 맛은 맛별 판매량을 조사한 ${itemAt}에서, 달이 지나면서 판매량이 변한 모습은 월별 판매량을 조사한 ${timeAt}에서 알 수 있다.`, facts: truthOf(rows, true)
      });
    }),
    T('kind-who', '알맞지 않은 그래프를 고른 사람', '①74 ②66 ③59 심79', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), times = d.shuffle(TIME_TOPICS), items = d.shuffle(ITEM_TOPICS);
      const says = d.shuffle([
        [`「${times[0]}」${tail(times[0], '은/는')} 시간에 따라 변하는 모습을 보려고 꺾은선그래프로 나타낼 거야.`, true],
        [`「${items[0]}」${tail(items[0], '은/는')} 많고 적음을 비교하려고 막대그래프로 나타낼 거야.`, true],
        [`「${items[1]}」${tail(items[1], '은/는')} 선분으로 이어 보려고 꺾은선그래프로 나타낼 거야.`, false]
      ]);
      return C('세 사람이 조사한 자료를 그래프로 나타내려고 한다. 알맞지 않은 그래프를 고른 사람은?', who, says.findIndex((s) => !s[1]), {
        figure: lines(says.map((s, at) => `${who[at]}: ${s[0]}`)), explain: `「${items[1]}」${tail(items[1], '은/는')} 시간에 따라 변하는 양이 아니라 항목별 수량이다. 항목과 항목을 선분으로 이어도 변화를 나타내지 못하므로 막대그래프가 알맞다.`,
        facts: { truth: says.map((s) => s[1]), want: false }
      });
    }),
    T('kind-mid', '사이의 값을 짐작하기에 편리한 그래프', '심31', (d) => {
      const c = pick(d, 'bean', 5, 0), v = vals(d, c, 5), date = 2 * d.int(1, 4);
      const rows = d.shuffle([['꺾은선그래프 — 두 점을 이은 선분에서 사이의 값을 읽을 수 있다.', true], ['막대그래프 — 막대와 막대 사이가 비어 있다.', false], ['막대그래프 — 막대의 길이가 가장 긴 것을 찾으면 된다.', false], ['꺾은선그래프 — 점의 수가 막대의 수보다 많다.', false]]);
      return C(`${c.intro} 조사하여 막대그래프와 꺾은선그래프로 나타내었다. 키를 재지 않은 ${date}일의 키를 짐작하려고 한다. 더 편리한 그래프와 그 까닭을 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: bars(c, v) + chart(c, v), explain: `꺾은선그래프는 점과 점을 선분으로 이었으므로 ${date - 1}일과 ${date + 1}일 사이의 선분에서 ${date}일의 값을 짐작할 수 있다. 막대그래프에는 막대 사이의 값을 알려 주는 것이 없다.`, facts: truthOf(rows, true)
      });
    }),
    T('kind-judge', '항목을 꺾은선으로 이은 그래프가 알맞은지 판단하기', '②66 심79', (d) => {
      // 틀린 보기: 항목과 항목을 이은 선분에서 「변화」나 「사이의 값」을 읽는 아이
      const fruits = d.shuffle(['사과', '포도', '딸기', '수박', '참외']).slice(0, 4), c = { names: fruits, title: '과일', unit: '명' }, v = cellsOf(d, 4, 3, 13, (x) => distinct(x) && x[1] > x[0]);
      const rows = d.shuffle([
        ['과일의 종류는 시간에 따라 변하는 것이 아니므로 막대그래프로 나타내는 것이 더 알맞다.', true],
        [`선분이 오른쪽 위로 기울어져 있으므로 ${fruits[0]}에서 ${josa(fruits[1], '으로/로')} 가면서 학생 수가 늘어났다고 말할 수 있다.`, false],
        [`${josa(fruits[0], '과/와')} ${fruits[1]} 사이의 선분에서 두 과일의 가운데에 있는 과일의 학생 수를 짐작할 수 있다.`, false],
        ['꺾은선그래프로 나타내었으므로 과일별 학생 수는 읽을 수 없다.', false]
      ]);
      return C('좋아하는 과일별 학생 수를 조사하여 꺾은선그래프로 나타내었다. 이 그래프에 대한 설명으로 옳은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: chart(c, v), explain: '꺾은선그래프의 선분은 시간이 지나면서 값이 변하는 모습을 나타낸다. 과일의 종류는 시간의 차례가 아니므로 과일과 과일을 이은 선분에는 뜻이 없다. 항목별 수량을 비교할 때에는 막대그래프가 알맞다.',
        facts: truthOf(rows, true)
      });
    })
  ]);
  B.addGroup('4-2-5', {
    id: 'hard', title: '단원 종합', standard: READ,
    types: [
      H('h-wave-times', '물결선이 있는 그래프에서 몇 배인지 구하기', '9, 기본 ①39 ②35', (d) => {
        // 장치: 물결선으로 아래를 줄인 그래프에서는 점의 높이(칸 수)가 값에 비례하지 않는다. 점의 높이로 어림하면 틀리고, 두 값을 읽어 나누어야 한다.
        const [key, from, step, times, under] = d.pick([['ice', 20, 2, 2, 1], ['ice', 20, 2, 2, 2], ['ice', 10, 2, 2, 2], ['ice', 10, 2, 2, 3], ['ice', 10, 2, 3, 1], ['visit', 30, 5, 2, 1], ['visit', 30, 5, 2, 2], ['visit', 30, 5, 2, 3]]), c = pick(d, key, 5);
        const small = from + under * step, big = small * times, high = (big - from) / step, [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
        const v = d.until(() => Array.from({ length: 5 }, (_, n) => (n === i ? under : n === j ? high : d.int(1, high))), distinct).map((x) => from + x * step);
        return N(`${lead(c)} ${josa(one(c, c.names[j]), '은/는')} ${one(c, c.names[i])}의 몇 배인가?`, times, {
          unit: '배', figure: chart(c, v, { step, from }),
          explain: `물결선 위의 첫 눈금은 ${from}이고 세로 눈금 한 칸은 ${U(c, step)}이다. ${said(c, v, j)}, ${said(c, v, i)}이므로 ${big} ÷ ${small} = ${times}(배)이다. 두 점은 눈금 ${from}에서 ${high}칸과 ${under}칸 위에 있지만, 0과 ${from} 사이를 줄였으므로 점의 높이로는 몇 배인지 알 수 없다.`,
          facts: { calc: [[`${big}/${small}`, 0]] }
        });
      }),
      H('h-wave-unfold', '물결선을 없애고 다시 그릴 때 점의 자리', '43, 기본 ①45 ③37', (d) => {
        // 장치: 물결선이 있는 그래프에서 센 칸 수는 값이 아니다. 값을 읽은 다음 새 눈금 한 칸의 크기로 나누어야 한다(센 칸 수를 그대로 옮기면 틀린다).
        const next = { weight: 2, tall: 10, type: 20, pop: 20 }, w = wave(d, 5, (x, s) => x.some((y) => (s.from + y * s.step) % next[s.key] === 0)), c = w.c, to = next[w.key], k = d.until(() => d.int(0, 4), (i) => w.v[i] % to === 0);
        return N(`${lead(c)} 이 그래프를 물결선 없이 세로 눈금 한 칸이 ${U(c, to, '을/를')} 나타내도록 다시 그리면, ${c.tag(c.names[k])}의 점은 세로 눈금 0에서 몇 칸 위에 찍히는가?`, w.v[k] / to, {
          unit: '칸', figure: waved(w),
          explain: `세로 눈금 한 칸은 ${U(c, w.step)}이고 ${c.tag(c.names[k])}의 점은 눈금 ${w.from}에서 ${w.cells[k]}칸 위에 있다. ${w.step} × ${w.cells[k]} = ${w.step * w.cells[k]}이므로 ${w.from} + ${w.step * w.cells[k]} = ${w.v[k]}(${c.unit})이다. 물결선 없이 한 칸이 ${U(c, to)}이면 0에서 ${w.v[k]} ÷ ${to} = ${w.v[k] / to}(칸) 위에 찍힌다. 물결선이 있는 그래프에서 센 ${w.cells[k]}칸으로 셈하면 안 된다.`,
          facts: { calc: [[`(${w.from}+${w.step}*${w.cells[k]})/${to}`, 0]], unseen: [w.cells[k]] }
        });
      }, { standard: DRAW }),
      H('h-two-scales', '눈금이 다른 두 그래프에서 더 많이 늘어난 쪽 찾기', '42, 기본 ③52', (d) => {
        // 장치: 두 그래프의 눈금 한 칸의 크기가 다르다. 물결선이 있는 그래프는 한 칸이 작아 선분이 가파르게 보이지만 늘어난 횟수는 더 적다. 기울기가 아니라 값을 읽어야 한다.
        const [p, q] = d.shuffle(NAMES).slice(0, 2), c = { names: DAYS.slice(0, 5), title: '요일', unit: '회' }, waveFirst = d.bool();
        const split = (total) => d.until(() => [d.int(1, 4), d.int(1, 4), d.int(1, 4), d.int(1, 4)], (x) => sum(x) === total).reduce((x, s) => x.concat([x[x.length - 1] + s]), [0]);
        const ra = d.int(5, 8), rb = d.int(9, 12), lowA = d.int(2, 4), lowB = d.int(1, 3), a = split(ra).map((x) => (lowA + x) * 20), b = split(rb).map((x) => 100 + (lowB + x) * 5);
        const figA = chart(c, a, { step: 20, top: 300 }), figB = chart(c, b, { step: 5, major: 2, from: 100, top: 180 }), rise = [a[4] - a[0], b[4] - b[0]];
        const values = waveFirst ? [rise[1], rise[0]] : rise, win = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]), alt = Math.abs(ra - rb) * 20 === gap ? gap + 20 : Math.abs(ra - rb) * 20, people = [p, q];
        const options = d.shuffle([[win, gap], [1 - win, gap], [win, alt], [1 - win, alt]]);
        return C(`${name(p, '과/와')} ${name(q, '의/의')} 줄넘기 횟수를 요일별로 조사하여 나타낸 꺾은선그래프이다. 월요일부터 금요일까지 줄넘기 횟수가 더 많이 늘어난 사람과, 두 사람의 늘어난 횟수의 차를 바르게 쓴 것은?`, options.map(([w, g]) => `${people[w]}, ${g}회`), options.findIndex(([w, g]) => w === win && g === gap), {
          figure: cap(p, waveFirst ? figB : figA) + cap(q, waveFirst ? figA : figB),
          explain: `두 그래프는 세로 눈금 한 칸의 크기가 다르므로 선분이 기울어진 정도로 비교할 수 없다. 값을 읽어 비교한다. ${name(p, '은/는')} ${waveFirst ? `${b[4]} - ${b[0]}` : `${a[4]} - ${a[0]}`} = ${values[0]}(회), ${name(q, '은/는')} ${waveFirst ? `${a[4]} - ${a[0]}` : `${b[4]} - ${b[0]}`} = ${values[1]}(회) 늘었다. ${name(people[win], '이/가')} ${gap}회 더 많이 늘었다.`,
          facts: { who: { exprs: waveFirst ? [`${b[4]}-${b[0]}`, `${a[4]}-${a[0]}`] : [`${a[4]}-${a[0]}`, `${b[4]}-${b[0]}`], values, options } }
        });
      }),
      H('h-used-most', '남은 양의 그래프에서 가장 많이 쓴 날 쓴 양', '55, 23', (d) => {
        // 장치: 그래프가 나타내는 것은 쓴 양이 아니라 남은 양이다. 가장 낮은 점(가장 적게 남은 날)의 값을 읽으면 틀리고, 가장 많이 내려간 선분의 두 끝 값을 빼야 한다.
        const c = pick(d, 'tank', 5, 0), v = d.until(() => { const x = [d.int(13, 15)]; for (let i = 1; i < 5; i += 1) x.push(x[i - 1] - d.int(1, 5)); return x; }, (x) => { const g = gaps(x).map((y) => -y); return low(x) >= 1 && lone(g, top(g)) && g.indexOf(top(g)) !== 3 && new Set(g).size >= 3 && top(g) - g.slice().sort((p, q) => q - p)[1] === 1; }).map((x) => x * 2);
        const g = gaps(v).map((y) => -y), at = g.indexOf(top(g));
        return N(`${lead(c)} 화요일부터 금요일까지 가운데 하루 동안 물을 가장 많이 쓴 날에 쓴 물은 몇 L인가? (물통에 물을 더 넣지는 않았다.)`, g[at], {
          unit: 'L', figure: chart(c, v, { step: 2 }),
          explain: `하루 동안 쓴 물은 전날 저녁에 남은 양에서 그날 저녁에 남은 양을 뺀 것이다. 쓴 물은 화요일부터 차례로 ${g.join(', ')} L이므로 가장 많이 쓴 날은 ${day(c.names[at + 1])}이고, ${v[at]} - ${v[at + 1]} = ${g[at]}(L)를 썼다. 가장 낮은 점은 물이 가장 적게 남은 날을 나타낸다.`,
          facts: { calc: [[`${v[at]}-${v[at + 1]}`, 0]] }
        });
      }),
      H('h-mid-when', '가운데 때를 스스로 알아내어 값 짐작하기', '기본 ①33 ②29, 28', (d) => {
        const daily = d.bool();
        if (daily) {
          const c = { names: DAYS.slice(0, 5), title: '요일', tag: day, unit: 'cm', noun: '키' }, v = d.until(() => climb(d, 5, [1, 3], 1, 4, 14), (x) => gaps(x).some((g) => g === 2 || g === 4)), i = d.until(() => d.int(0, 3), (n) => gaps(v)[n] % 2 === 0), mid = (v[i] + v[i + 1]) / 2;
          return N(`강낭콩의 키를 날마다 오전 8시에 재어 나타낸 꺾은선그래프이다. 그래프에서 읽을 때, ${day(c.names[i])} 오후 8시의 키는 약 몇 cm인가?`, mid, {
            unit: 'cm', figure: chart(c, v), explain: `${day(c.names[i])} 오전 8시부터 ${day(c.names[i + 1])} 오전 8시까지는 24시간이고, ${day(c.names[i])} 오후 8시는 그 가운데(12시간 뒤)이다. 두 점을 이은 선분의 가운데는 세로 눈금 ${mid}에 있으므로 약 ${mid} cm이다.`,
            facts: { calc: [[`(${v[i]}+${v[i + 1]})/2`, 0]], unseen: [2] }
          });
        }
        const c = pick(d, 'tall', 5), cells = d.until(() => climb(d, 5, [1, 3], 1, 4, 14), (x) => gaps(x).some((g) => g === 2 || g === 4)), v = cells.map((x) => 110 + x * 2), i = d.until(() => d.int(0, 3), (n) => gaps(cells)[n] % 2 === 0), mid = (v[i] + v[i + 1]) / 2;
        return N(`민재의 키를 해마다 3월 1일에 재어 나타낸 꺾은선그래프이다. 그래프에서 읽을 때, ${c.names[i]} 9월 1일의 키는 약 몇 cm인가?`, mid, {
          unit: 'cm', figure: chart(c, v, { step: 2, from: 110 }), explain: `${c.names[i]} 3월 1일부터 ${c.names[i + 1]} 3월 1일까지는 1년(12개월)이고, ${c.names[i]} 9월 1일은 그 가운데(6개월 뒤)이다. 두 점을 이은 선분의 가운데는 세로 눈금 ${mid}에 있으므로 약 ${mid} cm이다.`,
          facts: { calc: [[`(${v[i]}+${v[i + 1]})/2`, 0]], unseen: [2] }
        });
      }),
      H('h-mid-then', '사이의 값을 짐작하여 한 번 더 계산하기', '30', (d) => {
        const c = { names: ['2018', '2020', '2022', '2024'], title: '연도', tag: yr, unit: '명', noun: '학생 수' }, cells = d.until(() => stroll(d, 4, [4, 10], 4, 1, 14), (x) => gaps(x).some((g) => g !== 0 && g % 2 === 0)), v = cells.map((x) => 300 + x * 10);
        const i = d.until(() => d.int(0, 2), (n) => gaps(cells)[n] !== 0 && gaps(cells)[n] % 2 === 0), year = 2019 + 2 * i, mid = (v[i] + v[i + 1]) / 2, boys = Math.round(mid / 2) + d.int(-12, 12);
        return N(`나 초등학교의 학생 수를 2년마다 조사하여 나타낸 꺾은선그래프이다. 그래프에서 읽은 ${year}년의 학생 수 가운데 남학생이 ${boys}명이라고 할 때, ${year}년의 여학생은 약 몇 명인가?`, mid - boys, {
          unit: '명', figure: chart(c, v, { step: 10, from: 300 }), explain: `${year}년은 ${year - 1}년과 ${year + 1}년의 가운데이다. 두 점을 이은 선분의 가운데는 세로 눈금 ${mid}에 있으므로 ${year}년의 학생 수는 약 ${mid}명이다. ${mid} - ${boys} = ${mid - boys}`,
          facts: { calc: [[`(${v[i]}+${v[i + 1]})/2-${boys}`, 0]], unseen: [2] }
        });
      }),
      H('h-two-sum-each', '두 때의 값을 더해 값 곱하기', '54', (d) => {
        const c = pick(d, 'book', 5), v = vals(d, c, 5, distinct), [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((p, q) => p - q), each = d.pick([2, 3, 4]);
        return N(`${lead(c)} 책을 한 권 빌려 갈 때마다 독서 나무에 붙임딱지를 ${each}장씩 붙였다. ${c.names[i]}과 ${c.names[j]}에 붙인 붙임딱지는 모두 몇 장인가?`, (v[i] + v[j]) * each, {
          unit: '장', figure: chart(c, v), explain: `${said(c, v, i)}, ${said(c, v, j)}이므로 두 달에 빌린 책은 ${v[i]} + ${v[j]} = ${v[i] + v[j]}(권)이다. ${v[i] + v[j]} × ${each} = ${(v[i] + v[j]) * each}`,
          facts: { calc: [[`(${v[i]}+${v[j]})*${each}`, 0]] }
        });
      }),
      H('h-miss-cells', '조건으로 빠진 값을 구해 점을 찍을 자리 구하기', '48, 기본 ②16', (d) => {
        const c = pick(d, 'visit', 6, 0), g = d.pick([10, 15, 20]), more = d.bool(), v = vals(d, c, 5, (x) => distinct(x) && x[4] * 5 - g >= 10 && x[4] * 5 + g <= 70), last = more ? v[4] + g : v[4] - g;
        return N(`${lead(c)} 6일의 방문자 수는 5일보다 ${g}명 더 ${more ? '많다' : '적다'}. 6일의 점은 세로 눈금 0에서 몇 칸 위에 찍어야 하는가?`, last / 5, {
          unit: '칸', figure: chart(c, v.concat([null]), { step: 5, top: 70 }), explain: `5일의 방문자 수는 ${v[4]}명이므로 6일은 ${v[4]} ${more ? '+' : '-'} ${g} = ${last}(명)이다. 세로 눈금 2칸이 10명이므로 한 칸은 5명이고, ${last} ÷ 5 = ${last / 5}(칸) 위에 찍는다.`,
          facts: { calc: [[`(${v[4]}${more ? '+' : '-'}${g})/5`, 0]] }
        });
      }, { standard: DRAW }),
      H('h-miss-two-sum', '조건 둘로 그래프에 없는 두 값을 구해 더하기', '50', (d) => {
        const c = Object.assign({}, SETS.jump, { names: DAYS.concat(['일']) }), g = d.pick([20, 30, 40]), m = d.pick([2, 3]), v = vals(d, c, 5, (x) => distinct(x) && x[0] <= 6);
        return N(`${lead(c)} 토요일에는 금요일보다 ${g}회 더 많이 넘고, 일요일에는 월요일의 ${m}배만큼 넘으려고 한다. 토요일과 일요일에 넘을 줄넘기는 모두 몇 회인가?`, v[4] + g + v[0] * m, {
          unit: '회', figure: chart(c, v.concat([null, null]), { step: 10 }), explain: `금요일은 ${v[4]}회이므로 토요일은 ${v[4]} + ${g} = ${v[4] + g}(회), 월요일은 ${v[0]}회이므로 일요일은 ${v[0]} × ${m} = ${v[0] * m}(회)이다. ${v[4] + g} + ${v[0] * m} = ${v[4] + g + v[0] * m}`,
          facts: { calc: [[`${v[4]}+${g}+${v[0]}*${m}`, 0]] }
        });
      }),
      H('h-miss-same-total', '합이 같다는 조건으로 빠진 값 구하기', '47', (d) => {
        const at = d.int(0, 3), c = { names: MONTHS.slice(at, at + 4), title: '월', tag: as, unit: '점', noun: '점수' }, k = d.int(0, 3);
        const [mine, yours] = d.until(() => [cellsOf(d, 4, 1, 10, distinct), cellsOf(d, 4, 1, 10, distinct)], ([x, y]) => sum(x) === sum(y) && x.every((p, i) => p !== y[i])).map((x) => x.map((y) => 50 + y * 5)), rest = yours.filter((_, i) => i !== k);
        return N(`지우와 서연이의 월별 수학 점수를 조사하여 지우의 점수는 표로, 서연이의 점수는 꺾은선그래프로 나타내었다. 네 달 동안 받은 점수의 합이 두 사람이 서로 같을 때, 점을 찍지 않은 ${c.names[k]}의 서연이의 점수는 몇 점인가?`, yours[k], {
          unit: '점', figure: table(['월', '지우의 점수(점)'], c.names.map((n, i) => [n, mine[i]])) + cap('서연이의 점수', scoreChart(c, hide(yours, k))),
          explain: `지우의 점수의 합은 ${mine.join(' + ')} = ${sum(mine)}(점)이다. 서연이의 점수의 합도 ${sum(mine)}점이므로 ${c.names[k]}의 점수는 ${sum(mine)} - ${rest.join(' - ')} = ${yours[k]}(점)이다.`,
          facts: { calc: [[`${mine.join('+')}-${rest.join('-')}`, 0]] }
        });
      }),
      H('h-miss-change', '빠진 값을 구한 뒤 변한 양 구하기', '46, 기본 ②17', (d) => {
        const c = pick(d, 'ice', 5, 0), k = d.int(1, 4), v = vals(d, c, 5, (x) => distinct(x) && x[k] > x[k - 1]), total = sum(v), rest = v.filter((_, i) => i !== k);
        return N(`${lead(c)} 월요일부터 금요일까지 판매량의 합이 ${total}개일 때, 점을 찍지 않은 ${day(c.names[k])}의 판매량은 ${day(c.names[k - 1])}보다 몇 개 더 많은가?`, v[k] - v[k - 1], {
          unit: '개', figure: chart(c, hide(v, k), { step: 2, top: roofOf(v, 2) }), explain: `${day(c.names[k])}의 판매량은 ${total} - ${rest.join(' - ')} = ${v[k]}(개)이다. ${day(c.names[k - 1])}의 판매량이 ${v[k - 1]}개이므로 ${v[k]} - ${v[k - 1]} = ${v[k] - v[k - 1]}(개) 더 많다.`,
          facts: { calc: [[`${total}-${rest.join('-')}-${v[k - 1]}`, 0]] }
        });
      }),
      H('h-two-grow', '두 꺾은선에서 더 많이 늘어난 쪽과 그 차', '61', (d) => {
        // 끝 값이 큰 쪽을 고르는 아이: 처음 값이 다르므로 끝 값이 아니라 늘어난 양을 비교한다
        const c = TWO.plants, [a, b] = d.until(() => [climb(d, 5, [1, 6], 1, 3, 14), climb(d, 5, [1, 6], 1, 3, 14)], ([x, y]) => { const p = x[4] - x[0], q = y[4] - y[0]; return p !== q && x[4] !== y[4] && (p > q) !== (x[4] > y[4]) && x[0] !== y[0]; });
        const values = [a[4] - a[0], b[4] - b[0]], win = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]), ends = Math.abs(a[4] - b[4]), alt = ends === gap ? gap + 1 : ends, options = d.shuffle([[win, gap], [1 - win, gap], [win, alt], [1 - win, alt]]);
        return C(`${lead(c)} 1일부터 9일까지 키가 더 많이 자란 식물과, 두 식물이 자란 키의 차를 바르게 쓴 것은?`, options.map(([w, g]) => `${c.legend[w]}, ${g} cm`), options.findIndex(([w, g]) => w === win && g === gap), {
          figure: chart2(c, a, b), explain: `가 식물은 ${a[4]} - ${a[0]} = ${values[0]}(cm), 나 식물은 ${b[4]} - ${b[0]} = ${values[1]}(cm) 자랐다. ${josa(c.legend[win], '이/가')} ${Math.max(...values)} - ${Math.min(...values)} = ${gap}(cm) 더 많이 자랐다. 9일의 키가 더 큰 식물이 더 많이 자란 것은 아니다.`,
          facts: { who: { exprs: [`${a[4]}-${a[0]}`, `${b[4]}-${b[0]}`], values, options } }
        });
      }),
      H('h-two-sum-gap', '두 꺾은선의 값을 더해 비교하기', '62', (d) => {
        const c = TWO.grads, [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
        const [a, b] = d.until(() => [stroll(d, 5, [6, 10], 2, 4, 13), stroll(d, 5, [6, 10], 2, 4, 13)], ([x, y]) => x[i] + y[i] > x[j] + y[j] && x.every((p, n) => p !== y[n]) && (x[i] < x[j] || y[i] < y[j])).map((x) => x.map((y) => y * 10));
        return N(`${lead(c)} ${yr(c.names[i])}의 전체 졸업생 수는 ${yr(c.names[j])}의 전체 졸업생 수보다 몇 명 더 많은가?`, a[i] + b[i] - a[j] - b[j], {
          unit: '명', figure: chart2(c, a, b, { step: 10 }), explain: `전체 졸업생 수는 남학생 수와 여학생 수의 합이다. ${yr(c.names[i])}은 ${a[i]} + ${b[i]} = ${a[i] + b[i]}(명), ${yr(c.names[j])}은 ${a[j]} + ${b[j]} = ${a[j] + b[j]}(명)이다. ${a[i] + b[i]} - ${a[j] + b[j]} = ${a[i] + b[i] - a[j] - b[j]}`,
          facts: { calc: [[`${a[i]}+${b[i]}-${a[j]}-${b[j]}`, 0]] }
        });
      }),
      H('h-two-cross-change', '한 꺾은선이 가장 많이 변한 때 다른 꺾은선이 변한 양', '67, 기본 ③51', (d) => {
        const c = TWO.pets, [a, b] = d.until(() => [climb(d, 5, [2, 4], 0, 3, 13), climb(d, 5, [2, 4], 0, 2, 13)], ([x, y]) => { const p = gaps(x), q = gaps(y), at = p.indexOf(top(p)); return lone(p, top(p)) && q[at] >= 1 && q[at] !== p[at] && q.indexOf(top(q)) !== at && x.every((u, n) => u !== y[n]); });
        const at = gaps(a).indexOf(top(gaps(a)));
        return N(`${lead(c)} 강아지의 몸무게가 가장 많이 늘어난 한 달 동안 고양이의 몸무게는 몇 kg 늘었는가?`, b[at + 1] - b[at], {
          unit: 'kg', figure: chart2(c, a, b), explain: `실선(강아지)이 오른쪽 위로 가장 많이 기울어진 때는 ${between(c, at)}이다. 그동안 점선(고양이)은 ${b[at]} kg에서 ${b[at + 1]} kg으로 ${b[at + 1]} - ${b[at]} = ${b[at + 1] - b[at]}(kg) 늘었다.`,
          facts: { calc: [[`${b[at + 1]}-${b[at]}`, 0]] }
        });
      }),
      H('h-duo-cross-change', '한 그래프의 변화로 때를 찾아 다른 그래프 읽기', '67', (d) => {
        // 기온이 가장 높은 날의 판매량을 읽는 아이: 「가장 많이 오른 날」은 가장 많이 기운 선분의 오른쪽 끝이다
        const [heat, cups] = d.until(() => [stroll(d, 5, [9, 12], 3, 8, 15).map((x) => x * 2), cellsOf(d, 5, 3, 14, distinct).map((x) => x * 10)], ([x, y]) => { const g = gaps(x), at = g.indexOf(top(g)); return lone(g, top(g)) && top(g) >= 4 && g.every((u) => u !== 0) && lone(x, top(x)) && x.indexOf(top(x)) !== at + 1 && y[at + 1] !== top(y); }), at = gaps(heat).indexOf(top(gaps(heat)));
        return N(`${DUO} 낮 기온이 전날보다 가장 많이 오른 날의 음료 판매량은 몇 잔인가?`, cups[at + 1], {
          unit: '잔', figure: duo(heat, cups), explain: `기온 그래프에서 오른쪽 위로 가장 많이 기울어진 선분은 ${between(HEAT, at)}의 선분이므로 전날보다 가장 많이 오른 날은 ${HEAT.names[at + 1]}이다. 판매량 그래프에서 ${HEAT.names[at + 1]}의 판매량은 ${cups[at + 1]}잔이다.`,
          facts: { calc: [[String(cups[at + 1]), 0]] }
        });
      }),
      H('h-duo-sum-most', '두 그래프의 값을 더해 가장 큰 때 찾기', '69', (d) => {
        // 한 과목의 점수가 가장 높은 달을 그대로 고르는 아이: 한 그래프의 으뜸이 두 값을 더한 으뜸은 아니다
        const at = d.int(0, 3), names = MONTHS.slice(at, at + 4), c1 = { names, title: '월', unit: '점' };
        const [a, b] = d.until(() => [cellsOf(d, 4, 2, 10, distinct), cellsOf(d, 4, 2, 10, distinct)], ([x, y]) => { const t = x.map((p, i) => p + y[i]), m = t.indexOf(top(t)); return lone(t, top(t)) && x.indexOf(top(x)) !== m && y.indexOf(top(y)) !== m; }).map((x) => x.map((y) => 50 + y * 5));
        const totals = a.map((p, i) => p + b[i]), hi = totals.indexOf(top(totals));
        return C('서연이의 월별 국어 점수와 수학 점수를 조사하여 나타낸 꺾은선그래프이다. 국어 점수와 수학 점수의 합이 가장 높은 달은?', names, hi, {
          figure: cap('국어 점수', scoreChart(c1, a)) + cap('수학 점수', scoreChart(c1, b)), explain: `달마다 두 점수를 더한다. ${names.map((n, i) => `${n} ${a[i]} + ${b[i]} = ${totals[i]}`).join(', ')}이므로 ${names[hi]}의 합이 가장 높다.`,
          facts: { choose: { exprs: a.map((p, i) => `${p}+${b[i]}`), rule: 'max' } }
        });
      }),
      H('h-two-missing', '두 꺾은선의 합이 같다는 조건으로 빠진 값 구하기', '47', (d) => {
        const c = TWO.bikes, [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
        const [a, b] = d.until(() => { const x = stroll(d, 5, [4, 10], 3, 2, 14), y = stroll(d, 5, [4, 10], 3, 2, 14); y[j] = x[i] + y[i] - x[j]; return [x, y]; }, ([x, y]) => y[j] >= 2 && y[j] <= 14 && y[j] !== y[i] && x[j] !== x[i] && x.every((p, n) => p !== y[n]));
        return N(`${lead(c)} 두발자전거와 세발자전거를 합하여 ${c.names[i]}과 ${c.names[j]}에 팔린 자전거 수가 같을 때, 점을 찍지 않은 ${c.names[j]}의 세발자전거 판매량은 몇 대인가?`, b[j], {
          unit: '대', figure: chart2(c, a, hide(b, j), { top: 15 }), explain: `${c.names[i]}에 팔린 자전거는 ${a[i]} + ${b[i]} = ${a[i] + b[i]}(대)이다. ${c.names[j]}에 두발자전거가 ${a[j]}대 팔렸으므로 세발자전거는 ${a[i] + b[i]} - ${a[j]} = ${b[j]}(대)이다.`,
          facts: { calc: [[`${a[i]}+${b[i]}-${a[j]}`, 0]] }
        });
      }),
      H('h-season', '달별 자료를 묶어 새 표 만들기', '52', (d) => {
        const v = cellsOf(d, 12, 3, 12, (x) => x[5] + x[6] + x[7] !== x[11] + x[0] + x[1]), month = (i) => `${i + 1}월`;
        return M('가 지역에서 지난해에 비가 온 날수를 월별로 조사하여 나타낸 표이다(단위: 일). 이 자료를 계절별 비가 온 날수로 묶어 꺾은선그래프로 나타내려고 한다. 여름은 6월·7월·8월, 겨울은 12월·1월·2월로 묶을 때, 여름과 겨울에 비가 온 날수는 각각 며칠인가?', [{ label: '여름', answer: v[5] + v[6] + v[7], unit: '일' }, { label: '겨울', answer: v[11] + v[0] + v[1], unit: '일' }], {
          figure: table(['월', '날수', '월', '날수'], [0, 1, 2, 3, 4, 5].map((i) => [month(i), v[i], month(i + 6), v[i + 6]])),
          explain: `여름은 6월·7월·8월의 날수를 더하여 ${v[5]} + ${v[6]} + ${v[7]} = ${v[5] + v[6] + v[7]}(일)이다. 겨울은 표의 맨 끝에 있는 12월과 맨 앞에 있는 1월·2월의 날수를 더하여 ${v[11]} + ${v[0]} + ${v[1]} = ${v[11] + v[0] + v[1]}(일)이다.`,
          facts: { calc: [[`${v[5]}+${v[6]}+${v[7]}`, 0], [`${v[11]}+${v[0]}+${v[1]}`, 1]] }
        });
      }, { standard: DRAW })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
