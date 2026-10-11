// 3학년 2학기 6단원 그림그래프 — 꼴 목록(기본꼴 1~3, 심화꼴)과 덧문서 모음을 번호마다 다시 대조해 더 보탠 문항.
// 3-2-6a.js·3-2-6b.js·3-2-6c.js 의 유형이 묻지 않는 꼴과 「변형」을 옮겼다. 꼴(무엇을 주고 무엇을 묻는가)만 따르고 수와 상황은 새로 썼다.
// ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번, 덧은 덧문서 모음이다.
//
// 싣는 기준
//  - 주는 것(낱낱의 자료, 표, 남학생·여학생 두 줄 표, 그림그래프, 표와 그림그래프, 서로 다른 곳이 빈 표와 그림그래프, 그림그래프 둘)과
//    묻는 것(수, 가장 많은·적은 것, 차·합·몇 배, 전체, 순위, 기준보다 많은·적은 항목의 수, 빈칸, 그릴 그림의 수, 그림이 나타내는 수, 설명 가려내기, 정하기)이 다르면 따로 실었다.
//  - 그림이 나타내는 수가 다른 그림그래프(5·1, 50·10, 100·10, 100·50·10, 100·10·1)에는 10·1 그림그래프에서 묻지 않은 것을 맡겼다. 수만 키운 같은 물음은 싣지 않았다.
//  - 그림그래프를 그리는 꼴은 그려야 하는 그림의 수를 묻는 문항으로 바꾸어 실었다.
//  - 실력: ① 이 단원에서 흔히 잘못 아는 것(그림의 수가 많으면 수도 많다, 큰 그림은 언제나 10이다, 낱낱으로 가장 많은 것이 묶어도 가장 많다,
//    「2배」라는 말이 보이면 곱한다)을 가진 아이가 고를 보기를 넣은 문항, ② 읽은 수로 두 번 넘게 셈하는 문항.
//
// 뺀 것과 까닭(번호마다 가른 것은 채우기_대조표.md)
//  - 작도: 그림그래프를 그려 완성하는 꼴(그릴 그림의 수로 바꿀 수 있는 것은 바꾸어 실었다), ○를 쌓는 그래프
//  - 서술형·활동·놀이: 알 수 있는 내용·좋은 점·까닭·비교하는 방법 쓰기, 고르고 이유 쓰기, 자신만의 기준으로 분류하기, 조사 계획·신문 만들기, 놀이
//  - 조건 풀이: 합과 차·합과 배로 빈 항목 둘, 수가 같은 빈 항목 둘, 배 조건 뒤에 합계로 빈 항목 둘, 순서 조건으로 수 좁히기, 글 속 조건으로 표 채우기,
//    범례 없이 그림 세 가지가 나타내는 수를 맞히기
//  - 상위 학년·다른 단원: 두·세 자리 수로 나누어야 하는 「몇 배」(4학년), 합계가 네 자리 수를 넘는 표와 1000·100 그림그래프(4학년), 분수만큼·분수의 종류(분수 단원)
//  - 뜻 없는 셈: 가장 많은 것과 가장 적은 것의 합
//  - 묻는 틀만 다른 것: 문장 빈칸으로 묻기, 둘 가운데 더 많은 것(가장 많은 것 찾기와 같은 비교), 적은 것부터 차례,
//    줄여야 하는 양(목표까지 모자란 수의 거꾸로), 표·그림그래프 가운데 편리한 것 둘 중 고르기, 표의 제목을 그림그래프의 제목으로 옮기기
//  - 그림이 필요해 미룬 꼴: 바꾸어 그리지 않은 줄(1 그림 12개, 10 그림을 쓰지 않은 줄)을 찾는 꼴 — 그림그래프 도구가 언제나 큰 그림으로 바꾸어 그린다
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, table, pictograph, lines, numbers, N, M, C } = B.kit;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: (ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) : '수집본 심화 자료(' + ref) + ')', make }, more || {});
  const four = (word) => ['가', '나', '다', '라'].map((x) => x + ' ' + word);
  const ROOMS = ['1반', '2반', '3반', '4반'], GRADES = ['3학년', '4학년', '5학년', '6학년'];
  // 조사한 것: 그림그래프의 머리말, 줄 이름, 수 뒤에 붙는 낱말
  const TOWN = { head: ['마을', '학생 수'], names: four('마을'), each: '명', intro: '마을별 학생 수를' };
  const TREE = { head: ['마을', '심은 나무의 수'], names: four('마을'), each: '그루', intro: '마을별 심은 나무의 수를' };
  const FARM = { head: ['농장', '닭의 수'], names: four('농장'), each: '마리', intro: '농장별 기르는 닭의 수를' };
  const SHOP = { head: ['가게', '팔린 우산의 수'], names: four('가게'), each: '개', intro: '가게별 팔린 우산의 수를' };
  const ROLL = { head: ['가게', '팔린 김밥의 수'], names: four('가게'), each: '줄', intro: '가게별 팔린 김밥의 수를' };
  const CAFE = { head: ['가게', '팔린 음료의 수'], names: four('가게'), each: '잔', intro: '가게별 팔린 음료의 수를' };
  const TEAM = { head: ['모둠', '붙임딱지의 수'], names: four('모둠'), each: '장', intro: '모둠별 모은 칭찬 붙임딱지의 수를' };
  const APPLE = { head: ['과수원', '사과 생산량'], names: four('과수원'), each: '상자', intro: '과수원별 사과 생산량을' };
  const MILK = { head: ['목장', '우유 생산량'], names: four('목장'), each: '병', intro: '목장별 하루 우유 생산량을' };
  const BOOK = { head: ['반', '읽은 책의 수'], names: ROOMS, each: '권', intro: '반별 읽은 책의 수를' };
  const CANS = { head: ['반', '모은 빈 병의 수'], names: ROOMS, each: '개', intro: '반별 모은 빈 병의 수를' };
  const ROOM = { head: ['반', '학생 수'], names: ROOMS, each: '명', intro: '반별 학생 수를' };
  const GRADE = { head: ['학년', '학생 수'], names: GRADES, each: '명', intro: '학년별 학생 수를' };
  const graph = (s, values, units, options) => pictograph(s.head, s.names.slice(0, values.length).map((label, i) => [label, values[i]]), units, s.each, options);
  const lead = (s) => `${s.intro} 조사하여 나타낸 그림그래프이다.`;
  const sum = (list) => list.reduce((x, y) => x + y, 0);
  const distinct = (list) => new Set(list).size === list.length;
  const desc = (list) => list.slice().sort((x, y) => y - x);
  const ranked = (list) => list.map((_, i) => i).sort((p, q) => list[q] - list[p]);      // 많은 것부터 줄 번호
  const tensOf = (x) => Math.floor(x / 10) % 10;
  // 서로 다른 수. 10·1 그림그래프에 쓰는 두 자리 수, 100·10 그림그래프에 쓰는 몇백몇십
  const tens = (d, ok, n) => d.until(() => Array.from({ length: n || 4 }, () => d.int(1, 5) * 10 + d.int(0, 8)), (v) => distinct(v) && (!ok || ok(v)));
  const hund = (d, ok) => d.until(() => [0, 1, 2, 3].map(() => d.int(1, 4) * 100 + d.int(0, 8) * 10), (v) => distinct(v) && (!ok || ok(v)));
  const borrow = (hi, lo) => hi > lo && hi % 10 < lo % 10;                                // 일의 자리에서 받아내림이 있는 뺄셈
  const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const borrowPairs = (v, unit) => PAIRS.flatMap(([i, j]) => (borrow(v[i] / unit, v[j] / unit) ? [[i, j]] : borrow(v[j] / unit, v[i] / unit) ? [[j, i]] : []));
  // 그림그래프 문항의 근거: 그림으로 읽은 수(그림 속 수는 글에 숫자로 적히지 않는다)
  const facts = (values, more) => Object.assign({ picto: { shown: values } }, more || {}, { unseen: values.filter((v) => v !== null).concat((more && more.unseen) || []) });
  const FRUITS = ['사과', '포도', '딸기', '수박'], SPORTS = ['축구', '농구', '수영', '줄넘기'], SEASONS = ['봄', '여름', '가을', '겨울'];
  const BREADS = ['크림빵', '단팥빵', '식빵', '소금빵'], DRINKS = ['우유', '사과주스', '코코아', '식혜'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const big = (x, unit) => Math.floor(x / unit), small = (x, unit) => x % unit;

  // ── 자료를 표로 정리하고 표 읽기 ─────────────────────────────
  B.addTypes('3-2-6', 'table', [
    T('tab-plan', '조사한 것과 조사한 대상', '①54·55·56 ②1·2 심5', (d) => {
      const who = d.pick(NAMES), room = `3학년 ${d.int(1, 4)}반`, topic = d.pick(['동물', '간식', '계절', '운동']), [how, by] = d.pick([['붙임딱지 붙이기', '붙임딱지를 붙이는'], ['손 들기', '손을 드는'], ['종이에 적어 내기', '종이에 적어 내는']]);
      const rows = d.shuffle([[`좋아하는 ${topic}, ${room} 학생`, true], [`${room} 학생, 좋아하는 ${topic}`, false], [`좋아하는 ${topic}, ${how}`, false], [`${how}, ${room} 학생`, false]]);
      return C(`${name(who, '은/는')} ${room} 학생들이 좋아하는 ${josa(topic, '을/를')} 조사하였다. 자료는 ${by} 방법으로 모았다. 조사한 것과 조사한 대상을 차례대로 쓴 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: `조사한 것은 좋아하는 ${topic}이고, 조사한 대상은 ${room} 학생이다. ${josa(how, '은/는')} 자료를 모은 방법이다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('raw-total', '낱낱의 자료에서 조사한 전체 수', '①58 ②6 심1', (d) => {
      const counts = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 5), d.int(2, 5)], (v) => new Set(v).size >= 3 && sum(v) >= 13 && sum(v) <= 18);
      const list = d.shuffle(SEASONS.flatMap((word, i) => Array(counts[i]).fill(word)));
      return N('학생들이 좋아하는 계절을 한 사람이 하나씩 말한 것이다. 조사한 학생은 모두 몇 명인가?', list.length, {
        unit: '명', figure: numbers(list), explain: `계절별로 세면 ${SEASONS.map((word, i) => `${word} ${counts[i]}명`).join(', ')}이다. ${counts.join(' + ')} = ${list.length}`, facts: { calc: [[counts.join('+'), 0]], unseen: counts }
      });
    }),
    T('raw-most', '낱낱의 자료에서 가장 많은 항목', '①59', (d) => {
      const PETS = ['강아지', '고양이', '토끼', '햄스터'];
      const counts = d.until(() => PETS.map(() => d.int(2, 6)), (v) => desc(v)[0] - desc(v)[1] === 1 && sum(v) >= 13 && sum(v) <= 17), top = counts.indexOf(Math.max(...counts));
      const list = d.shuffle(PETS.flatMap((word, i) => Array(counts[i]).fill(word)));
      return C('학생들이 기르고 싶은 동물을 한 사람이 하나씩 적은 것이다. 가장 많은 학생이 기르고 싶어 하는 동물은?', PETS, top, {
        figure: numbers(list), explain: `동물별로 세면 ${PETS.map((word, i) => `${word} ${counts[i]}명`).join(', ')}이다. ${josa(PETS[top], '이/가')} ${counts[top]}명으로 가장 많다.`, facts: { choose: { exprs: counts.map(String), rule: 'max' }, unseen: counts }
      });
    }),
    T('raw-two', '남학생과 여학생으로 나누어 세기', '②8', (d) => {
      const GAMES = ['축구', '피구', '수영'];
      const [boys, girls] = d.until(() => [GAMES.map(() => d.int(1, 4)), GAMES.map(() => d.int(1, 4))], ([b, g]) => sum(b) + sum(g) >= 13 && sum(b) + sum(g) <= 16 && b.every((x, i) => x !== g[i]));
      const k = d.int(0, 2), girl = d.bool(), target = `${GAMES[k]}(${girl ? '여' : '남'})`, n = (girl ? girls : boys)[k];
      const list = d.shuffle(GAMES.flatMap((word, i) => Array(boys[i]).fill(`${word}(남)`).concat(Array(girls[i]).fill(`${word}(여)`))));
      return N(`학생들이 좋아하는 운동을 조사하여 남학생은 (남), 여학생은 (여)라고 적은 것이다. 남학생과 여학생으로 나누어 표로 정리할 때, ${josa(GAMES[k], '을/를')} 좋아하는 ${girl ? '여학생' : '남학생'}은 몇 명인가?`, n, {
        unit: '명', figure: numbers(list), explain: `${GAMES[k]} 가운데 ${girl ? '(여)라고' : '(남)이라고'} 적은 것만 센다. 모두 ${n}번 나온다.`, facts: { tallyOf: { list, target } }
      });
    }),
    T('tab-text-total', '수가 섞인 글에서 표의 합계 구하기', '③7', (d) => {
      const ACTS = ['연 만들기', '탈 만들기', '떡 만들기', '활쏘기'];
      const v = d.until(() => ACTS.map(() => d.int(4, 19) * 10), (x) => distinct(x) && sum(x.map(tensOf)) >= 10), days = d.int(2, 5);
      return N(`어느 마을 축제에서 ${days}일 동안 체험별로 참가한 사람의 수를 조사하였더니 ${ACTS.map((word, i) => `${josa(word, '은/는')} ${v[i]}명`).join(', ')}이었다. 이 수를 표로 나타낼 때, ㉠에 알맞은 수는?`, sum(v), {
        figure: table(['체험', '사람 수(명)'], ACTS.map((word) => [word, box()]).concat([['합계', box(LABELS[0])]])),
        explain: `합계에는 체험별로 참가한 사람의 수를 모두 더한 수를 쓴다. ${v.join(' + ')} = ${sum(v)}. ${days}일은 조사한 날수이므로 더하지 않는다.`, facts: { calc: [[v.join('+'), 0]] }
      });
    }),
    T('tab-two-diff', '두 줄 표에서 같은 항목의 남학생과 여학생의 차', '②10 ③12 심14', (d) => {
      const [boys, girls, k] = d.until(() => [SPORTS.map(() => d.int(12, 58)), SPORTS.map(() => d.int(12, 58)), d.int(0, 3)], ([b, g, i]) => b.every((x, n) => x !== g[n]) && (borrow(b[i], g[i]) || borrow(g[i], b[i])));
      const boyMore = boys[k] > girls[k], hi = Math.max(boys[k], girls[k]), lo = Math.min(boys[k], girls[k]);
      return N(`학생들이 좋아하는 운동을 남학생과 여학생으로 나누어 조사한 표이다. ${josa(SPORTS[k], '을/를')} 좋아하는 ${boyMore ? '남학생' : '여학생'}은 ${boyMore ? '여학생' : '남학생'}보다 몇 명 더 많은가?`, hi - lo, {
        unit: '명', figure: table(['운동', '남학생(명)', '여학생(명)'], SPORTS.map((word, i) => [word, boys[i], girls[i]])),
        explain: `${josa(SPORTS[k], '을/를')} 좋아하는 남학생은 ${boys[k]}명, 여학생은 ${girls[k]}명이다. ${hi} - ${lo} = ${hi - lo}`, facts: { calc: [[`${hi}-${lo}`, 0]] }
      });
    }),
    T('tab-two-blank', '두 줄 표에서 합계로 빈칸 구하기', '심15', (d) => {
      const [boys, girls] = d.until(() => [FRUITS.map(() => d.int(5, 24)), FRUITS.map(() => d.int(5, 24))], ([b, g]) => sum(b) !== sum(g) && b.every((x, i) => x !== g[i]));
      const k = d.int(0, 3), girl = d.bool(), col = girl ? girls : boys, rest = col.filter((_, i) => i !== k), who = girl ? '여학생' : '남학생';
      return N('학생들이 좋아하는 과일을 남학생과 여학생으로 나누어 조사한 표이다. □ 안에 알맞은 수는?', col[k], {
        figure: table(['과일', '남학생(명)', '여학생(명)'], FRUITS.map((word, i) => [word, i === k && !girl ? box() : boys[i], i === k && girl ? box() : girls[i]]).concat([['합계', sum(boys), sum(girls)]])),
        explain: `빈칸은 ${who} 수이므로 ${who}의 합계에서 나머지 ${who} 수를 뺀다. ${sum(col)} - ${rest.join(' - ')} = ${col[k]}`, facts: { calc: [[`${sum(col)}-${rest.join('-')}`, 0]] }
      });
    }),
    T('tab-two-total', '두 줄 표에서 조사한 전체 수', '②9 심16, 덧', (d) => {
      const SPOTS = ['동물원', '박물관', '과학관', '놀이공원'];
      const [boys, girls] = d.until(() => [SPOTS.map(() => d.int(5, 19)), SPOTS.map(() => d.int(5, 19))], ([b, g]) => sum(b) !== sum(g) && (sum(b) % 10) + (sum(g) % 10) >= 10);
      return N('학생들이 가고 싶은 곳을 남학생과 여학생으로 나누어 조사한 표이다. 조사한 학생은 모두 몇 명인가?', sum(boys) + sum(girls), {
        unit: '명', figure: table(['장소', '남학생(명)', '여학생(명)'], SPOTS.map((word, i) => [word, boys[i], girls[i]]).concat([['합계', sum(boys), sum(girls)]])),
        explain: `남학생의 합계와 여학생의 합계를 더한다. ${sum(boys)} + ${sum(girls)} = ${sum(boys) + sum(girls)}`, facts: { calc: [[`${sum(boys)}+${sum(girls)}`, 0]] }
      });
    }),
    T('tab-ends', '표에서 가장 많은 것과 가장 적은 것', '①61 ②13 ③13', (d) => {
      const v = d.until(() => DRINKS.map(() => d.int(11, 88)), (x) => distinct(x) && desc(x)[0] - desc(x)[1] <= 9 && desc(x)[2] - desc(x)[3] <= 9), order = ranked(v);
      const rows = d.shuffle([[[order[0], order[3]], true], [[order[3], order[0]], false], [[order[1], order[3]], false], [[order[0], order[2]], false]]);
      return C('어느 가게에서 하루 동안 팔린 음료의 수를 나타낸 표이다. 가장 많이 팔린 음료와 가장 적게 팔린 음료를 차례대로 쓴 것은?', rows.map(([[i, j]]) => `${DRINKS[i]}, ${DRINKS[j]}`), rows.findIndex(([, ok]) => ok), {
        figure: table(['음료', '팔린 수(잔)'], DRINKS.map((word, i) => [word, v[i]])),
        explain: `가장 많이 팔린 음료는 ${v[order[0]]}잔이 팔린 ${DRINKS[order[0]]}이고, 가장 적게 팔린 음료는 ${v[order[3]]}잔이 팔린 ${DRINKS[order[3]]}이다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('tab-rank', '표에서 두 번째로 적은 것 찾기', '③14, 덧', (d) => {
      const v = hund(d), s = desc(v), names = four('마을');
      return C('마을별 심은 나무의 수를 나타낸 표이다. 심은 나무의 수가 두 번째로 적은 마을은?', names, v.indexOf(s[2]), {
        figure: table(['마을', '나무의 수(그루)'], names.map((word, i) => [word, v[i]])),
        explain: `적은 것부터 차례로 쓰면 ${s.slice().reverse().map((x) => `${names[v.indexOf(x)]} ${x}그루`).join(', ')}이다.`, facts: { rank: { values: v, nth: 3 } }
      });
    }),
    T('tab-below-item', '표에서 기준 항목보다 적은 항목의 수', '②15', (d) => {
      const names = four('모둠');
      const [v, k] = d.until(() => [names.map(() => d.int(12, 48)), d.int(0, 3)], ([x, i]) => distinct(x) && [1, 2].includes(x.filter((y) => y < x[i]).length));
      const below = names.filter((_, i) => v[i] < v[k]);
      return N(`모둠별 모은 우유갑의 수를 나타낸 표이다. ${names[k]}보다 우유갑을 적게 모은 모둠은 모두 몇 모둠인가?`, below.length, {
        unit: '모둠', figure: table(['모둠', '우유갑의 수(개)'], names.map((word, i) => [word, v[i]])),
        explain: `${josa(names[k], '은/는')} ${v[k]}개를 모았다. ${v[k]}개보다 적게 모은 모둠은 ${below.join(', ')}이다.`, facts: { choose: { exprs: v.filter((_, i) => i !== k).map(String), rule: 'countBelow', target: v[k] } }
      });
    }),
    T('tab-diff', '표에서 두 항목의 차', '①63 ②17 ③15 심11', (d) => {
      const v = d.until(() => BREADS.map(() => d.int(21, 58)), (x) => distinct(x) && borrowPairs(x, 1).length > 0), [a, b] = d.pick(borrowPairs(v, 1));
      return N(`어느 가게에서 하루 동안 팔린 빵의 수를 나타낸 표이다. ${josa(BREADS[a], '은/는')} ${BREADS[b]}보다 몇 개 더 많이 팔렸는가?`, v[a] - v[b], {
        unit: '개', figure: table(['빵', '팔린 수(개)'], BREADS.map((word, i) => [word, v[i]])), explain: `${josa(BREADS[a], '은/는')} ${v[a]}개, ${josa(BREADS[b], '은/는')} ${v[b]}개 팔렸다. ${v[a]} - ${v[b]} = ${v[a] - v[b]}`, facts: { calc: [[`${v[a]}-${v[b]}`, 0]] }
      });
    }),
    T('tab-times', '표에서 몇 배인지 구하기', '③16', (d) => {
      const GREENS = ['오이', '당근', '양배추', '피망'];
      const [v, a, b] = d.until(() => { const base = d.int(4, 9), k = d.int(2, 5), list = d.shuffle([base, base * k, d.int(11, 48), d.int(11, 48)]); return [list, list.indexOf(base * k), list.indexOf(base)]; }, ([x]) => distinct(x));
      return N(`어느 가게에서 하루 동안 팔린 채소의 수를 나타낸 표이다. 팔린 ${GREENS[a]}의 수는 팔린 ${GREENS[b]}의 수의 몇 배인가?`, v[a] / v[b], {
        unit: '배', figure: table(['채소', '팔린 수(개)'], GREENS.map((word, i) => [word, v[i]])),
        explain: `${josa(GREENS[a], '은/는')} ${v[a]}개, ${josa(GREENS[b], '은/는')} ${v[b]}개 팔렸다. ${v[b]} × ${v[a] / v[b]} = ${v[a]}이므로 ${v[a] / v[b]}배이다.`, facts: { calc: [[`${v[a]}/${v[b]}`, 0]] }
      });
    }),
    T('tab-decide', '표를 보고 정하기', '②74 심51', (d) => {
      const CAKES = ['꿀떡', '인절미', '절편', '백설기'];
      const v = d.until(() => CAKES.map(() => d.int(12, 58)), (x) => distinct(x) && desc(x)[2] - desc(x)[3] <= 5), low = v.indexOf(Math.min(...v));
      return C('어느 가게에서 일주일 동안 팔린 떡의 수를 나타낸 표이다. 가장 적게 팔린 떡은 다음 주부터 만들지 않기로 하였다. 다음 주부터 만들지 않는 떡은?', CAKES, low, {
        figure: table(['떡', '팔린 수(상자)'], CAKES.map((word, i) => [word, v[i]])), explain: `팔린 수가 가장 작은 떡을 찾는다. ${josa(CAKES[low], '이/가')} ${v[low]}상자로 가장 적게 팔렸다.`, facts: { choose: { exprs: v.map(String), rule: 'min' } }
      });
    })
  ]);

  // ── 그림그래프 읽기 ──────────────────────────────────────────
  B.addTypes('3-2-6', 'read', [
    T('read-marks', '표시 하나가 10을 나타내는 기록 읽기', '심7', (d) => {
      const n = d.until(() => GRADES.map(() => d.int(3, 9)), distinct), k = d.int(0, 3);
      return N(`학년별로 빈 병을 10개 모을 때마다 ○를 하나씩 그려 나타낸 것이다. ${josa(GRADES[k], '이/가')} 모은 빈 병은 몇 개인가?`, n[k] * 10, {
        unit: '개', figure: table(['학년', '모은 빈 병'], GRADES.map((word, i) => [word, '○'.repeat(n[i])])),
        explain: `${josa(GRADES[k], '은/는')} ○가 ${n[k]}개이다. ○ 하나가 빈 병 10개를 나타내므로 10 × ${n[k]} = ${n[k] * 10}(개)이다.`, facts: { calc: [[`10*${n[k]}`, 0]], unseen: [n[k]] }
      });
    }),
    T('read-topic', '무엇을 조사한 그림그래프인지 알기', '①2·41 ②23 ③10·18 심20', (d) => {
      const v = tens(d), rows = d.shuffle([['농장별 기르는 닭의 수', true], ['농장별 일하는 사람의 수', false], ['마을별 농장의 수', false], ['닭 한 마리가 낳은 달걀의 수', false]]);
      return C('다음 그림그래프는 무엇을 조사하여 나타낸 것인가?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: graph(FARM, v, [10, 1]), explain: '왼쪽 칸에는 농장이, 오른쪽 칸에는 닭의 수가 적혀 있다. 농장별 기르는 닭의 수를 조사하여 나타낸 그림그래프이다.', facts: facts(v, { truth: rows.map(([, ok]) => ok), want: true })
      });
    }),
    T('read-frame', '그림그래프 틀의 칸 이름', '①6 ②23 ③19', (d) => {
      const v = tens(d), rows = d.shuffle([['운동, 학생 수', true], ['학생 수, 운동', false], ['운동, 운동의 수', false], ['학생, 운동의 수', false]]);
      return C('학생들이 좋아하는 운동을 조사하여 그림그래프로 나타내었다. ㉠, ㉡에 알맞은 말을 차례대로 쓴 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: pictograph([box(LABELS[0]), box(LABELS[1])], SPORTS.map((word, i) => [word, v[i]]), [10, 1], '명'),
        explain: '왼쪽 칸에는 조사한 항목인 운동을, 오른쪽 칸에는 그림으로 나타낸 학생 수를 쓴다.', facts: facts(v, { truth: rows.map(([, ok]) => ok), want: true })
      });
    }),
    T('read-ratio', '큰 그림 한 개와 작은 그림의 관계', '①4 심23', (d) => {
      const s = APPLE, v = d.until(() => [0, 1, 2, 3].map(() => d.int(1, 5) * 50 + d.int(0, 4) * 10), (x) => distinct(x) && x.some((y) => y % 50 !== 0));
      return N(`${lead(s)} 큰 그림 한 개는 작은 그림 몇 개와 같은 수를 나타내는가?`, 5, {
        unit: '개', figure: graph(s, v, [50, 10]), explain: '큰 그림은 50상자, 작은 그림은 10상자를 나타낸다. 10상자씩 5묶음이 50상자이므로 큰 그림 한 개는 작은 그림 5개와 같은 수를 나타낸다.', facts: facts(v, { calc: [['50/10', 0]] })
      });
    }),
    T('read-legend-say', '그림이 나타내는 수에 대한 설명', '①7 ②30 ③21', (d) => {
      const s = SHOP, v = d.until(() => [0, 1, 2, 3].map(() => d.int(1, 3) * 100 + d.int(0, 1) * 50 + d.int(0, 4) * 10), (x) => distinct(x) && x.some((y) => y % 100 >= 50) && x.some((y) => y % 50 !== 0)), k = d.until(() => d.int(0, 3), (i) => v[i] % 100 >= 50);
      const rows = d.shuffle([['그림은 세 가지이다.', true], ['가장 큰 그림은 100개를 나타낸다.', true], ['중간 크기의 그림은 10개를 나타낸다.', false], [`${s.names[k]}에서 팔린 우산은 ${v[k]}개이다.`, true]]);
      return C(`${lead(s)} 이 그림그래프에 대한 설명으로 옳지 않은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        figure: graph(s, v, [100, 50, 10]), explain: '그림이 나타내는 수는 그림그래프 아래에 적혀 있다. 중간 크기의 그림은 50개를 나타낸다.', facts: facts(v, { truth: rows.map(([, ok]) => ok), want: false })
      });
    }),
    T('read-five-one', '5와 1을 나타내는 그림으로 된 그림그래프 읽기', '①10 ②30 ③24', (d) => {
      const s = TEAM, [v, k] = d.until(() => [[0, 1, 2, 3].map(() => d.int(1, 6) * 5 + d.int(0, 4)), d.int(0, 3)], ([x, i]) => distinct(x) && x[i] >= 15 && x[i] % 5 >= 1), a = big(v[k], 5), b = small(v[k], 5);
      return N(`${lead(s)} ${josa(s.names[k], '이/가')} 모은 붙임딱지는 몇 장인가?`, v[k], {
        unit: '장', figure: graph(s, v, [5, 1]), explain: `큰 그림은 5장, 작은 그림은 1장을 나타낸다. 큰 그림 ${a}개는 5 × ${a} = ${5 * a}(장)이고 작은 그림 ${b}개는 ${b}장이므로 ${5 * a} + ${b} = ${v[k]}(장)이다.`, facts: facts(v, { calc: [[`5*${a}+${b}`, 0]], unseen: [a, b] })
      });
    }),
    T('read-most-value', '가장 많은 항목의 수 읽기', '①13 ②34 ③26 심30, 덧', (d) => {
      const s = MILK, v = hund(d, (x) => x.filter((y) => big(y, 100) === big(Math.max(...x), 100)).length >= 2), top = v.indexOf(Math.max(...v));
      return N(`${lead(s)} 우유 생산량이 가장 많은 목장의 우유 생산량은 몇 병인가?`, v[top], {
        unit: '병', figure: graph(s, v, [100, 10]), explain: `큰 그림의 수가 가장 많은 목장끼리 작은 그림의 수를 비교한다. 큰 그림 ${big(v[top], 100)}개, 작은 그림 ${small(v[top], 100) / 10}개인 ${josa(s.names[top], '이/가')} 가장 많고, 그 수는 ${v[top]}병이다.`, facts: facts(v, { calc: [[String(v[top]), 0]] })
      });
    }),
    T('read-above-item', '기준 항목보다 많은 항목의 수', '①18 ③30 심34', (d) => {
      const s = FARM, [v, k] = d.until(() => [tens(d), d.int(0, 3)], ([x, i]) => [1, 2].includes(x.filter((y) => y > x[i]).length) && x.some((y) => y > x[i] && big(y, 10) === big(x[i], 10)));
      const above = s.names.filter((_, i) => v[i] > v[k]);
      return N(`${lead(s)} ${s.names[k]}보다 닭을 많이 기르는 농장은 모두 몇 곳인가?`, above.length, {
        unit: '곳', figure: graph(s, v, [10, 1]), explain: `${josa(s.names[k], '은/는')} ${v[k]}마리를 기른다. ${v[k]}마리보다 많이 기르는 농장은 ${s.names.map((word, i) => (v[i] > v[k] ? `${word}(${v[i]}마리)` : '')).filter(Boolean).join(', ')}이다.`,
        facts: facts(v, { choose: { exprs: v.filter((_, i) => i !== k).map(String), rule: 'countAbove', target: v[k] } })
      });
    }),
    T('read-below-num', '기준 수보다 적은 항목의 수', '①19', (d) => {
      const s = SHOP, [v, limit] = d.until(() => [hund(d), d.pick([150, 250, 350])], ([x, y]) => !x.includes(y) && [1, 2, 3].includes(x.filter((z) => z < y).length) && x.some((z) => z < y && big(z, 100) === big(y, 100)));
      return N(`${lead(s)} 팔린 우산의 수가 ${limit}개보다 적은 가게는 모두 몇 곳인가?`, v.filter((x) => x < limit).length, {
        unit: '곳', figure: graph(s, v, [100, 10]), explain: `가게별 팔린 우산의 수는 ${s.names.map((word, i) => `${word} ${v[i]}개`).join(', ')}이다. ${limit}개보다 적은 가게는 ${s.names.filter((_, i) => v[i] < limit).join(', ')}이다.`,
        facts: facts(v, { choose: { exprs: v.map(String), rule: 'countBelow', target: limit } })
      });
    }),
    T('read-diff', '두 항목의 차', '①20 ②43 ③31 심39, 덧', (d) => {
      const s = BOOK, v = tens(d, (x) => borrowPairs(x, 1).length > 0), [a, b] = d.pick(borrowPairs(v, 1));
      return N(`${lead(s)} ${josa(s.names[a], '은/는')} ${s.names[b]}보다 책을 몇 권 더 많이 읽었는가?`, v[a] - v[b], {
        unit: '권', figure: graph(s, v, [10, 1]), explain: `${josa(s.names[a], '은/는')} ${v[a]}권, ${josa(s.names[b], '은/는')} ${v[b]}권을 읽었다. ${v[a]} - ${v[b]} = ${v[a] - v[b]}`, facts: facts(v, { calc: [[`${v[a]}-${v[b]}`, 0]] })
      });
    }),
    T('read-equal', '같아지려면 더 있어야 하는 수', '①20 심41', (d) => {
      const s = TREE, v = hund(d, (x) => borrowPairs(x, 10).length > 0), [b, a] = d.pick(borrowPairs(v, 10));
      return N(`${lead(s)} ${s.names[a]}에 심은 나무의 수가 ${s.names[b]}에 심은 나무의 수와 같아지려면 ${s.names[a]}에 나무를 몇 그루 더 심어야 하는가?`, v[b] - v[a], {
        unit: '그루', figure: graph(s, v, [100, 10]), explain: `${s.names[a]}에는 ${v[a]}그루, ${s.names[b]}에는 ${v[b]}그루를 심었다. ${v[b]} - ${v[a]} = ${v[b] - v[a]}`, facts: facts(v, { calc: [[`${v[b]}-${v[a]}`, 0]] })
      });
    }),
    T('read-times-how', '몇 배인지 구하기', '①25 ②47 ③35 심43, 덧', (d) => {
      const s = CANS, [v, a, b] = d.until(() => { const base = d.int(4, 9), k = d.int(2, 5), list = d.shuffle([base, base * k, d.int(1, 5) * 10 + d.int(0, 8), d.int(1, 5) * 10 + d.int(0, 8)]); return [list, list.indexOf(base * k), list.indexOf(base)]; }, ([x]) => distinct(x));
      return N(`${lead(s)} ${josa(s.names[a], '이/가')} 모은 빈 병의 수는 ${josa(s.names[b], '이/가')} 모은 빈 병의 수의 몇 배인가?`, v[a] / v[b], {
        unit: '배', figure: graph(s, v, [10, 1]), explain: `${josa(s.names[a], '은/는')} ${v[a]}개, ${josa(s.names[b], '은/는')} ${v[b]}개를 모았다. ${v[b]} × ${v[a] / v[b]} = ${v[a]}이므로 ${v[a] / v[b]}배이다.`, facts: facts(v, { calc: [[`${v[a]}/${v[b]}`, 0]] })
      });
    }),
    T('read-least-add', '가장 적은 항목에 더한 뒤의 수', '②50 심51', (d) => {
      const s = TREE, v = tens(d, (x) => big(desc(x)[2], 10) === big(desc(x)[3], 10) && Math.min(...x) % 10 >= 2), low = v.indexOf(Math.min(...v)), more = d.until(() => d.int(6, 19), (x) => x % 10 !== 0 && (x % 10) + (v[low] % 10) >= 10);
      return N(`${lead(s)} 나무를 가장 적게 심은 마을에 나무를 ${more}그루 더 심으면, 그 마을에 심은 나무는 모두 몇 그루가 되는가?`, v[low] + more, {
        unit: '그루', figure: graph(s, v, [10, 1]), explain: `나무를 가장 적게 심은 마을은 ${v[low]}그루를 심은 ${s.names[low]}이다. ${v[low]} + ${more} = ${v[low] + more}`, facts: facts(v, { calc: [[`${v[low]}+${more}`, 0]] })
      });
    }),
    T('read-left', '읽은 수에서 덜어 낸 나머지', '③40', (d) => {
      const s = APPLE, v = hund(d), k = d.int(0, 3), rest = d.until(() => d.int(15, 95), (x) => x % 10 !== 0), sold = v[k] - rest;
      return N(`${lead(s)} ${s.names[k]}에서 생산한 사과 가운데 ${sold}상자를 팔았다. ${s.names[k]}에 남은 사과는 몇 상자인가?`, rest, {
        unit: '상자', figure: graph(s, v, [100, 10]), explain: `${josa(s.names[k], '은/는')} 사과를 ${v[k]}상자 생산하였다. ${v[k]} - ${sold} = ${rest}`, facts: facts(v, { calc: [[`${v[k]}-${sold}`, 0]] })
      });
    }),
    T('read-total3', '그림이 세 가지인 그림그래프에서 전체 수', '①24 ②44 ③34 심42, 덧', (d) => {
      const s = GRADE, v = d.until(() => [0, 1, 2, 3].map(() => 100 + d.int(0, 8) * 10 + d.int(1, 8)), (x) => distinct(x) && sum(x.map((y) => y % 10)) >= 10);
      return N(`${lead(s)} 3학년부터 6학년까지의 학생은 모두 몇 명인가?`, sum(v), {
        unit: '명', figure: graph(s, v, [100, 10, 1]), explain: `학년별 학생 수는 ${s.names.map((word, i) => `${word} ${v[i]}명`).join(', ')}이다. ${v.join(' + ')} = ${sum(v)}`, facts: facts(v, { calc: [[v.join('+'), 0]] })
      });
    }),
    T('read-hidden', '이름이 가려진 항목 맞히기', '심37', (d) => {
      const v = tens(d, (x) => big(desc(x)[0], 10) === big(desc(x)[1], 10) || big(desc(x)[2], 10) === big(desc(x)[3], 10)), order = ranked(v);
      const rows = d.shuffle([[[order[0], order[3]], true], [[order[3], order[0]], false], [[order[1], order[3]], false], [[order[0], order[2]], false]]);
      return C('학생들이 좋아하는 계절을 조사하여 나타낸 그림그래프인데 계절의 이름이 가려져 있다. 가장 많은 학생이 좋아하는 계절은 여름이고, 가장 적은 학생이 좋아하는 계절은 겨울이다. 여름과 겨울을 나타낸 줄을 차례대로 쓴 것은?', rows.map(([[i, j]]) => `${LABELS[i]}, ${LABELS[j]}`), rows.findIndex(([, ok]) => ok), {
        figure: pictograph(['계절', '학생 수'], LABELS.map((label, i) => [label, v[i]]), [10, 1], '명'),
        explain: `줄마다 읽으면 ${LABELS.map((label, i) => `${label} ${v[i]}명`).join(', ')}이다. 가장 많은 ${LABELS[order[0]]}이 여름이고, 가장 적은 ${LABELS[order[3]]}이 겨울이다.`, facts: facts(v, { truth: rows.map(([, ok]) => ok), want: true })
      });
    }),
    T('read-decide', '그림그래프를 보고 정하기', '①40 ②74 ③45 심51, 덧', (d) => {
      const SPOTS = ['동물원', '박물관', '미술관', '과학관'];
      // 100 그림과 10 그림의 수가 같은 두 곳은 1 그림으로 갈린다
      const v = d.until(() => { const h = d.int(1, 2), t = d.int(2, 7); return d.shuffle([h * 100 + t * 10 + d.int(5, 8), h * 100 + t * 10 + d.int(1, 4), h * 100 + d.int(0, t - 1) * 10 + d.int(6, 8), h * 100 - d.int(12, 58)]); }, distinct), top = v.indexOf(Math.max(...v));
      return C('학생들이 체험 학습으로 가고 싶은 곳을 조사하여 나타낸 그림그래프이다. 가장 많은 학생이 가고 싶어 하는 곳으로 체험 학습을 가려고 한다. 체험 학습을 가는 곳은?', SPOTS, top, {
        figure: pictograph(['장소', '학생 수'], SPOTS.map((word, i) => [word, v[i]]), [100, 10, 1], '명'),
        explain: `가장 큰 그림의 수부터 차례로 비교한다. 장소별 학생 수는 ${SPOTS.map((word, i) => `${word} ${v[i]}명`).join(', ')}이므로 ${josa(SPOTS[top], '으로/로')} 간다.`, facts: facts(v, { choose: { exprs: v.map(String), rule: 'max' } })
      });
    })
  ]);

  // ── 그림그래프로 나타내기 ────────────────────────────────────
  B.addTypes('3-2-6', 'draw', [
    T('draw-steps', '그림그래프로 나타내는 차례', '②58 ③47·48', (d) => {
      const steps = ['조사한 수를 어떤 그림으로 나타낼지 정한다.', '그림을 몇 가지로 할지, 그림 하나가 얼마를 나타낼지 정한다.', '조사한 수에 맞게 그림을 그리고 제목을 쓴다.'];
      const shown = d.shuffle([0, 1, 2]), right = [0, 1, 2].map((step) => shown.indexOf(step));
      const options = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('표를 보고 그림그래프로 나타내는 차례대로 나열한 것은?', options.map((o) => o.map((i) => LABELS[i]).join(', ')), options.findIndex((o) => o.join() === right.join()), {
        figure: lines(shown.map((step, i) => `${LABELS[i]} ${steps[step]}`)), explain: '어떤 그림으로 나타낼지 정하고, 그림의 가짓수와 그림이 나타내는 수를 정한 다음, 조사한 수에 맞게 그림을 그리고 제목을 쓴다.', facts: { sequence: { ranks: shown, options } }
      });
    }),
    T('draw-unit3', '세 자리 수를 나타낼 그림 정하기', '①42 ②55·56 ③49 심57, 덧', (d) => {
      const v = d.until(() => GRADES.map(() => d.int(1, 4) * 100 + d.int(0, 9) * 10 + d.int(1, 9)), distinct);
      const rows = d.shuffle([['세 가지: 100권, 10권, 1권', true], ['두 가지: 100권, 10권', false], ['두 가지: 10권, 1권', false], ['세 가지: 1000권, 100권, 10권', false]]);
      return C('학년별 빌린 책의 수를 나타낸 표를 그림그래프로 나타내려고 한다. 그림의 가짓수와 그림이 나타내는 수를 가장 알맞게 정한 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: table(['학년', '빌린 책의 수(권)'], GRADES.map((word, i) => [word, v[i]])),
        explain: `표의 수는 ${josa(100, '이/가')} 몇 개, ${josa(10, '이/가')} 몇 개, ${josa(1, '이/가')} 몇 개인 세 자리 수이다. 100권, 10권, 1권을 나타내는 그림 세 가지로 나타내면 일의 자리 수까지 나타낼 수 있고 그림의 수도 알맞다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('draw-add-unit', '그림의 수를 줄이려고 더 쓸 그림', '①44', (d) => {
      const names = four('농장'), v = d.until(() => names.map(() => d.int(1, 4) * 10 + d.int(6, 9)), distinct);
      const rows = d.shuffle([['5마리', true], ['50마리', false], ['100마리', false], ['500마리', false]]);
      return C('표의 수를 10마리를 나타내는 그림과 1마리를 나타내는 그림으로 나타내면 1마리를 나타내는 그림을 많이 그려야 한다. 그림을 한 가지 더 써서 그림의 수를 줄이려고 할 때, 더 쓸 그림이 나타내는 수로 알맞은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: table(['농장', '닭의 수(마리)'], names.map((word, i) => [word, v[i]])),
        explain: `1마리를 나타내는 그림 5개를 5마리를 나타내는 그림 1개로 바꾸면 그림의 수가 줄어든다. ${v[0]}마리는 10마리 그림 ${big(v[0], 10)}개, 5마리 그림 1개, 1마리 그림 ${small(v[0], 10) - 5}개로 나타낸다. 표의 수는 모두 50보다 작으므로 나머지 그림은 쓸 수 없다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('draw-five-one', '5와 1을 나타내는 그림으로 나타내기', '①46·51 ③55, 덧', (d) => {
      const COLORS = ['빨간색', '노란색', '파란색', '초록색'];
      const [v, k] = d.until(() => [COLORS.map(() => d.int(4, 14)), d.int(0, 3)], ([x, i]) => distinct(x) && x[i] >= 6 && x[i] % 5 >= 1 && big(x[i], 5) !== small(x[i], 5));
      return M(`학생들이 좋아하는 색깔을 조사하여 나타낸 표이다. 5명을 나타내는 큰 그림과 1명을 나타내는 작은 그림으로 그림그래프를 그릴 때, ${COLORS[k]}에 그려야 하는 큰 그림과 작은 그림은 각각 몇 개인가?`, [{ label: '큰 그림', answer: big(v[k], 5), unit: '개' }, { label: '작은 그림', answer: small(v[k], 5), unit: '개' }], {
        figure: table(['색깔', '학생 수(명)'], COLORS.map((word, i) => [word, v[i]])),
        explain: `${josa(COLORS[k], '을/를')} 좋아하는 학생은 ${v[k]}명이다. ${v[k]} = 5 × ${big(v[k], 5)} + ${small(v[k], 5)}이므로 큰 그림 ${big(v[k], 5)}개와 작은 그림 ${small(v[k], 5)}개를 그린다.`, facts: { calc: [[`(${v[k]}-${v[k]}%5)/5`, 0], [`${v[k]}%5`, 1]] }
      });
    }),
    T('draw-hundreds', '몇백몇십을 나타내는 데 필요한 그림의 수', '①48 ②60 ③52 심62', (d) => {
      const names = four('마을'), [v, k] = d.until(() => [hund(d), d.int(0, 3)], ([x, i]) => x[i] % 100 !== 0 && big(x[i], 100) !== small(x[i], 100) / 10);
      return M(`마을별 귤 생산량을 나타낸 표이다. 100상자를 나타내는 큰 그림과 10상자를 나타내는 작은 그림으로 그림그래프를 그릴 때, ${names[k]}에 그려야 하는 큰 그림과 작은 그림은 각각 몇 개인가?`, [{ label: '큰 그림', answer: big(v[k], 100), unit: '개' }, { label: '작은 그림', answer: small(v[k], 100) / 10, unit: '개' }], {
        figure: table(['마을', '귤 생산량(상자)'], names.map((word, i) => [word, v[i]])),
        explain: `${josa(names[k], '은/는')} ${v[k]}상자이다. ${josa(v[k], '은/는')} ${josa(100, '이/가')} ${big(v[k], 100)}개, ${josa(10, '이/가')} ${small(v[k], 100) / 10}개인 수이므로 큰 그림 ${big(v[k], 100)}개와 작은 그림 ${small(v[k], 100) / 10}개를 그린다.`, facts: { calc: [[`(${v[k]}-${v[k]}%100)/100`, 0], [`${v[k]}%100/10`, 1]] }
      });
    }),
    T('draw-three', '세 가지 그림으로 나타내는 데 필요한 그림의 수', '①49 ②61 ③53 심63', (d) => {
      // 십의 자리 숫자가 0인 수: 10을 나타내는 그림은 그리지 않는다
      const h = d.int(1, 4), o = d.until(() => d.int(1, 8), (x) => x !== h), v = h * 100 + o;
      return M(`100그루, 10그루, 1그루를 나타내는 세 가지 그림으로 나무 ${v}그루를 나타내려고 한다. 세 가지 그림은 각각 몇 개 필요한가?`, [{ label: '100그루 그림', answer: h, unit: '개' }, { label: '10그루 그림', answer: 0, unit: '개' }, { label: '1그루 그림', answer: o, unit: '개' }], {
        explain: `${v} = ${h * 100} + ${o}이다. 십의 자리 숫자가 0이므로 10그루 그림은 그리지 않는다. 100그루 그림 ${h}개와 1그루 그림 ${o}개가 필요하다.`, facts: { parts: [[`(${v}-${v}%100)/100`, 0], [`(${v}%100-${v}%10)/10`, 1], [`${v}%10`, 2]] }
      });
    })
  ]);

  // ── 그림이 빠진 항목 구하기 ──────────────────────────────────
  B.addTypes('3-2-6', 'fill', [
    T('fill-pair', '두 항목의 합으로 빠진 항목 구하기', '①31', (d) => {
      const s = MILK, up = (x) => PAIRS.filter(([p, q]) => tensOf(x[p]) + tensOf(x[q]) >= 10), v = hund(d, (x) => up(x).length > 0), [k, j] = d.shuffle(d.pick(up(v))), shown = v.map((x, i) => (i === k ? null : x));
      return N(`${lead(s)} ${josa(s.names[k], '과/와')} ${s.names[j]}의 우유 생산량의 합이 ${v[k] + v[j]}병일 때, ${s.names[k]}의 우유 생산량은 몇 병인가?`, v[k], {
        unit: '병', figure: graph(s, shown, [100, 10]), explain: `${s.names[j]}의 우유 생산량은 ${v[j]}병이다. 합에서 ${s.names[j]}의 우유 생산량을 뺀다. ${v[k] + v[j]} - ${v[j]} = ${v[k]}`, facts: facts(shown, { calc: [[`${v[k] + v[j]}-${v[j]}`, 0]] })
      });
    }),
    T('fill-double', '몇 배 조건으로 빠진 항목 구하기', '심73', (d) => {
      const s = CAFE, [v, k, j, times] = d.until(() => { const t = d.int(2, 3), base = d.int(11, 19) * 10, list = d.shuffle([base, base * t, d.int(1, 4) * 100 + d.int(0, 8) * 10, d.int(1, 4) * 100 + d.int(0, 8) * 10]); return [list, list.indexOf(base * t), list.indexOf(base), t]; }, ([x]) => distinct(x));
      const shown = v.map((x, i) => (i === k ? null : x));
      return N(`${lead(s)} ${s.names[k]}에서 팔린 음료의 수가 ${s.names[j]}에서 팔린 음료의 수의 ${times}배일 때, ${s.names[k]}에서 팔린 음료는 몇 잔인가?`, v[k], {
        unit: '잔', figure: graph(s, shown, [100, 10]), explain: `${s.names[j]}에서 팔린 음료는 ${v[j]}잔이다. ${v[j]} × ${times} = ${v[k]}`, facts: facts(shown, { calc: [[`${v[j]}*${times}`, 0]] })
      });
    }),
    T('fill-draw', '전체 수로 빠진 항목에 그릴 그림의 수 구하기', '①30·33 ②63 ③43 심61·62·70', (d) => {
      const s = FARM, [v, k] = d.until(() => [tens(d, (x) => sum(x) <= 150), d.int(0, 3)], ([x, i]) => x[i] % 10 >= 1 && x[i] % 10 !== big(x[i], 10));
      const shown = v.map((x, i) => (i === k ? null : x)), rest = v.filter((_, i) => i !== k), blank = `(${sum(v)}-${rest.join('-')})`;
      return M(`${lead(s)} 네 농장에서 기르는 닭이 모두 ${sum(v)}마리일 때, 그림그래프의 ${s.names[k]}에 그려야 하는 큰 그림과 작은 그림은 각각 몇 개인가?`, [{ label: '큰 그림', answer: big(v[k], 10), unit: '개' }, { label: '작은 그림', answer: small(v[k], 10), unit: '개' }], {
        figure: graph(s, shown, [10, 1]), explain: `${s.names[k]}에서 기르는 닭은 ${sum(v)} - ${rest.join(' - ')} = ${v[k]}(마리)이다. ${josa(v[k], '은/는')} ${josa(10, '이/가')} ${big(v[k], 10)}개, ${josa(1, '이/가')} ${small(v[k], 10)}개인 수이므로 큰 그림 ${big(v[k], 10)}개와 작은 그림 ${small(v[k], 10)}개를 그린다.`,
        facts: facts(shown, { calc: [[`(${blank}-${blank}%10)/10`, 0], [`${blank}%10`, 1]] })
      });
    }),
    T('fill-gather', '표와 그림그래프에 나뉜 수를 모아 전체 수 구하기', '심68·69, 덧', (d) => {
      const names = four('모둠'), v = tens(d, (x) => x.every((y) => y % 10 >= 1) && sum(x) <= 170), inTable = d.shuffle([0, 1, 2, 3]).slice(0, 2), drawn = v.map((x, i) => (inTable.includes(i) ? null : x));
      return N('네 모둠이 모은 빈 병의 수를 나타낸 표와 그림그래프인데, 서로 다른 모둠이 두 군데씩 비어 있다. 네 모둠이 모은 빈 병은 모두 몇 개인가?', sum(v), {
        unit: '개', figure: table(['모둠', '빈 병의 수(개)'], names.map((word, i) => [word, inTable.includes(i) ? v[i] : box()])) + pictograph(['모둠', '빈 병의 수'], names.map((word, i) => [word, drawn[i]]), [10, 1], '개'),
        explain: `표에서 ${names.map((word, i) => (inTable.includes(i) ? `${word} ${v[i]}개` : '')).filter(Boolean).join(', ')}이고, 그림그래프에서 ${names.map((word, i) => (inTable.includes(i) ? '' : `${word} ${v[i]}개`)).filter(Boolean).join(', ')}이다. ${v.join(' + ')} = ${sum(v)}`,
        facts: facts(drawn, { calc: [[v.join('+'), 0]] })
      });
    })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addTypes('3-2-6', 'hard', [
    H('h-skip', '가운데 그림이 없는 수 읽기', '심25, 기본 ①9', (d) => {
      // 100 그림 3개와 1 그림 4개(304). 340: 가장 작은 그림을 10으로 읽는 아이, 34: 큰 그림은 10·작은 그림은 1이라고 읽는 아이, 7: 그림의 수를 세는 아이
      const s = TREE, h = d.int(1, 4), o = d.until(() => d.int(1, 7), (x) => x !== h), right = h * 100 + o;
      const rest = d.until(() => [0, 1, 2].map(() => d.int(1, 4) * 100 + d.int(1, 6) * 10 + d.int(0, 5)), (x) => distinct(x.concat([right]))), k = d.int(0, 3), v = rest.slice(0, k).concat([right], rest.slice(k));
      const list = d.shuffle([right, h * 100 + o * 10, h * 10 + o, h + o]);
      return C(`${lead(s)} ${s.names[k]}에 심은 나무의 수를 바르게 읽은 것은?`, list.map((x) => x + '그루'), list.indexOf(right), {
        figure: graph(s, v, [100, 10, 1]), explain: `${s.names[k]}에는 100그루를 나타내는 그림 ${h}개와 1그루를 나타내는 그림 ${o}개가 있고, 10그루를 나타내는 그림은 없다. ${h * 100} + ${o} = ${right}(그루)이다.`,
        facts: facts(v, { pick: { expr: String(right), options: list } })
      });
    }),
    H('h-fewest', '그림의 수가 적다고 수가 적은 것은 아니다', '심31', (d) => {
      // 큰 그림 2개와 작은 그림 1개(210, 그림 3개)가 큰 그림 1개와 작은 그림 8개(180, 그림 9개)보다 많다.
      // 그림의 수가 가장 적은 줄을 고르는 아이는 틀린다.
      const s = ROLL, h = d.int(2, 4), v = d.shuffle([h * 100 + d.int(0, 1) * 10, (h - 1) * 100 + d.int(7, 9) * 10, h * 100 + d.int(3, 5) * 10, (h + 1) * 100 + d.int(1, 3) * 10]);
      const symbols = v.map((x) => big(x, 100) + small(x, 100) / 10), low = v.indexOf(Math.min(...v));
      return C(`${lead(s)} 팔린 김밥의 수가 가장 적은 가게는?`, s.names, low, {
        figure: graph(s, v, [100, 10]), explain: `그림의 수가 아니라 그림이 나타내는 수를 비교한다. 큰 그림의 수가 가장 적은 ${josa(s.names[low], '이/가')} ${v[low]}줄로 가장 적다.`,
        facts: facts(v, { choose: { exprs: v.map(String), rule: 'min' }, symbolTrap: { values: v, symbols } })
      });
    }),
    H('h-bigunit', '작은 그림이 나타내는 수로 큰 그림이 나타내는 수 구하기', '기본 ②27, 심22', (d) => {
      // 큰 그림은 언제나 10이라고 여기는 아이는 10마리라고 답한다
      const s = FARM, [v, k] = d.until(() => [[0, 1, 2, 3].map(() => d.int(1, 6) * 5 + d.int(0, 4)), d.int(0, 3)], ([x, i]) => distinct(x) && x[i] >= 11 && x[i] % 5 >= 1 && big(x[i], 5) !== small(x[i], 5)), a = big(v[k], 5), b = small(v[k], 5);
      return N(`농장별 기르는 닭의 수를 나타낸 그림그래프이다. 작은 그림은 1마리를 나타내고, ${s.names[k]}에서 기르는 닭은 ${v[k]}마리이다. 큰 그림은 몇 마리를 나타내는가?`, 5, {
        unit: '마리', figure: graph(s, v, [5, 1], { legend: false }), explain: `${s.names[k]}에는 큰 그림 ${a}개와 작은 그림 ${b}개가 있다. 작은 그림 ${b}개는 ${b}마리이므로 큰 그림 ${a}개는 ${v[k]} - ${b} = ${5 * a}(마리)를 나타낸다. ${5 * a} ÷ ${a} = 5`,
        facts: facts(v, { calc: [[`(${v[k]}-${b}*1)/${a}`, 0]], unseen: [a, b] })
      });
    }),
    H('h-rank-sum', '순위로 고른 두 항목의 합', '기본 ①23', (d) => {
      const v = tens(d, (x) => (desc(x)[1] % 10) + (desc(x)[2] % 10) >= 10), s = desc(v);
      return N('어느 가게에서 하루 동안 팔린 빵의 수를 조사하여 나타낸 그림그래프이다. 두 번째로 많이 팔린 빵과 세 번째로 많이 팔린 빵은 모두 몇 개 팔렸는가?', s[1] + s[2], {
        unit: '개', figure: pictograph(['빵', '팔린 수'], BREADS.map((word, i) => [word, v[i]]), [10, 1], '개'),
        explain: `많이 팔린 것부터 차례로 쓰면 ${s.map((x) => `${BREADS[v.indexOf(x)]} ${x}개`).join(', ')}이다. ${s[1]} + ${s[2]} = ${s[1] + s[2]}`, facts: facts(v, { calc: [[`${s[1]}+${s[2]}`, 0]] })
      });
    }),
    H('h-rank-gap', '가장 많은 것과 두 번째로 적은 것의 차', '심40, 기본 ①21', (d) => {
      const s = APPLE, v = hund(d, (x) => tensOf(desc(x)[0]) < tensOf(desc(x)[2])), r = desc(v);
      return N(`${lead(s)} 사과 생산량이 가장 많은 과수원은 두 번째로 적은 과수원보다 사과를 몇 상자 더 많이 생산하였는가?`, r[0] - r[2], {
        unit: '상자', figure: graph(s, v, [100, 10]), explain: `적은 것부터 차례로 쓰면 ${r.slice().reverse().map((x) => `${s.names[v.indexOf(x)]} ${x}상자`).join(', ')}이다. ${r[0]} - ${r[2]} = ${r[0] - r[2]}`, facts: facts(v, { calc: [[`${r[0]}-${r[2]}`, 0]] })
      });
    }),
    H('h-pack-all', '전체 수를 똑같이 묶기', '심80, 기본 ①29 ②52, 덧', (d) => {
      const KINDS = ['감', '배', '귤', '복숭아'];
      const [v, n] = d.until(() => [KINDS.map(() => d.int(5, 29)), d.int(4, 8)], ([x, m]) => distinct(x) && sum(x) % m === 0 && sum(x) >= 48 && sum(x) <= 96);
      return N(`과일 가게에 있는 과일의 수를 종류별로 조사하여 나타낸 그림그래프이다. 이 과일을 모두 한 상자에 ${n}개씩 담으려고 한다. 필요한 상자는 몇 개인가?`, sum(v) / n, {
        unit: '개', figure: pictograph(['과일', '과일의 수'], KINDS.map((word, i) => [word, v[i]]), [10, 1], '개'),
        explain: `과일은 모두 ${v.join(' + ')} = ${sum(v)}(개)이다. ${sum(v)} ÷ ${n} = ${sum(v) / n}`, facts: facts(v, { calc: [[`(${v.join('+')})/${n}`, 0]] })
      });
    }),
    H('h-times-all', '전체 수의 몇 배 구하기', '심81, 기본 ②53', (d) => {
      const s = ROOM, v = d.until(() => [0, 1, 2, 3].map(() => d.int(18, 32)), distinct), each = d.int(2, 4);
      return N(`${lead(s)} 네 반의 학생 모두에게 연필을 ${each}자루씩 나누어 주려고 한다. 필요한 연필은 모두 몇 자루인가?`, sum(v) * each, {
        unit: '자루', figure: graph(s, v, [10, 1]), explain: `네 반의 학생은 모두 ${v.join(' + ')} = ${sum(v)}(명)이다. ${sum(v)} × ${each} = ${sum(v) * each}`, facts: facts(v, { calc: [[`(${v.join('+')})*${each}`, 0]] })
      });
    }),
    H('h-leftover', '10씩 바꾸고 남는 수 비교하기', '기본 ②54', (d) => {
      // 큰 그림은 모두 바꾸고 작은 그림만 남는다. 붙임딱지가 가장 적은 모둠을 고르는 아이는 틀린다.
      const s = TEAM, ones = (x) => x.map((y) => y % 10), v = tens(d, (x) => ones(x).every((y) => y >= 1) && distinct(ones(x)) && ones(x).indexOf(Math.min(...ones(x))) !== x.indexOf(Math.min(...x))), low = ones(v).indexOf(Math.min(...ones(v)));
      return C(`${lead(s)} 붙임딱지 10장을 공책 1권으로 바꾸어 준다. 모둠마다 바꿀 수 있는 만큼 공책으로 바꿀 때, 남는 붙임딱지가 가장 적은 모둠은?`, s.names, low, {
        figure: graph(s, v, [10, 1]), explain: `큰 그림 1개가 붙임딱지 10장이므로 큰 그림은 모두 공책으로 바꾸고 작은 그림만큼 남는다. 작은 그림이 ${v[low] % 10}개로 가장 적은 ${josa(s.names[low], '이/가')} 남는 붙임딱지가 가장 적다.`,
        facts: facts(v, { choose: { exprs: v.map((x) => `${x}%10`), rule: 'min' } })
      });
    }),
    H('h-say-calc', '셈이 필요한 설명 가려내기', '심49, 기본 ①37 ②40 ③37', (d) => {
      // 틀린 설명은 받아내림을 하지 않고 일의 자리끼리 큰 수에서 작은 수를 뺀 차(52 - 25를 33으로)를 적은 것
      const s = TOWN, v = tens(d, (x) => borrow(Math.max(...x), Math.min(...x)) && x.every((y) => y % 10 >= 1) && sum(x) <= 170), [top, p, q, low] = ranked(v), hi = v[top], lo = v[low];
      const slip = (big(hi, 10) - big(lo, 10)) * 10 + (lo % 10 - hi % 10);
      const rows = d.shuffle([
        [`${s.names[p]}의 학생 수는 ${v[p]}명이다.`, String(v[p]), v[p]],
        [`${josa(s.names[p], '과/와')} ${s.names[q]}의 학생 수의 합은 ${v[p] + v[q]}명이다.`, `${v[p]}+${v[q]}`, v[p] + v[q]],
        [`학생 수가 가장 많은 마을은 가장 적은 마을보다 ${slip}명 더 많다.`, `${hi}-${lo}`, slip],
        [`네 마을의 학생 수는 모두 ${sum(v)}명이다.`, v.join('+'), sum(v)]
      ]);
      return C(`${lead(s)} 설명이 옳지 않은 것은?`, rows.map(([text]) => text), rows.findIndex(([, text, said]) => text === hi + '-' + lo && said === slip), {
        figure: graph(s, v, [10, 1]), explain: `학생 수가 가장 많은 마을은 ${hi}명, 가장 적은 마을은 ${lo}명이다. ${hi} - ${lo} = ${hi - lo}이므로 ${hi - lo}명 더 많다.`,
        facts: facts(v, { claimed: rows.map(([, text, said]) => [text, said]), claimedWant: false })
      });
    }),
    H('h-fill-two', '그림그래프에서 읽고 합계로 구하는 표의 두 빈칸', '기본 ①34 ②71', (d) => {
      const v = tens(d, (x) => x.every((y) => y % 10 >= 1) && sum(x) <= 170), [x, y] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => p - q), gone = d.pick([x, y]), read = gone === x ? y : x;
      const rest = v.filter((_, i) => i !== gone), drawn = v.map((n, i) => (i === gone ? null : n)), expr = (i) => (i === gone ? `${sum(v)}-${rest.join('-')}` : String(v[i]));
      return M(`학생들이 태어난 계절을 조사하여 나타낸 표와 그림그래프이다. 그림그래프에는 ${SEASONS[gone]}에 태어난 학생 수를 아직 그리지 않았다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: v[x] }, { label: LABELS[1], answer: v[y] }], {
        figure: table(['계절', '학생 수(명)'], SEASONS.map((word, i) => [word, i === x ? box(LABELS[0]) : i === y ? box(LABELS[1]) : v[i]]).concat([['합계', sum(v)]])) + pictograph(['계절', '학생 수'], SEASONS.map((word, i) => [word, drawn[i]]), [10, 1], '명'),
        explain: `${SEASONS[read]}에 태어난 학생은 그림그래프에서 큰 그림 ${big(v[read], 10)}개, 작은 그림 ${small(v[read], 10)}개이므로 ${v[read]}명이다. ${SEASONS[gone]}에 태어난 학생 수는 합계에서 나머지를 뺀다. ${sum(v)} - ${rest.join(' - ')} = ${v[gone]}`,
        facts: facts(drawn, { calc: [[expr(x), 0], [expr(y), 1]] })
      });
    }),
    H('h-tab-blank-gap', '표의 빈칸을 구한 뒤 가장 많은 것과 가장 적은 것의 차', '심12, 기본 ②18', (d) => {
      const BLOOMS = ['장미', '튤립', '백합', '국화'];
      const v = d.until(() => BLOOMS.map(() => d.int(21, 68)), (x) => distinct(x) && borrow(Math.max(...x), Math.min(...x))), hi = Math.max(...v), lo = Math.min(...v), k = d.pick([v.indexOf(hi), v.indexOf(lo)]);
      const rest = v.filter((_, i) => i !== k), blank = `(${sum(v)}-${rest.join('-')})`;
      return N('어느 꽃 가게에서 하루 동안 팔린 꽃의 수를 나타낸 표이다. 가장 많이 팔린 꽃은 가장 적게 팔린 꽃보다 몇 송이 더 많이 팔렸는가?', hi - lo, {
        unit: '송이', figure: table(['꽃', '팔린 수(송이)'], BLOOMS.map((word, i) => [word, i === k ? box() : v[i]]).concat([['합계', sum(v)]])),
        explain: `${josa(BLOOMS[k], '은/는')} ${sum(v)} - ${rest.join(' - ')} = ${v[k]}(송이) 팔렸다. 가장 많이 팔린 꽃은 ${hi}송이, 가장 적게 팔린 꽃은 ${lo}송이이므로 ${hi} - ${lo} = ${hi - lo}`,
        facts: { calc: [[v[k] === hi ? `${blank}-${lo}` : `${hi}-${blank}`, 0]] }
      });
    }),
    H('h-more-gap', '빠진 항목을 구한 뒤 가장 많은 것과 가장 적은 것의 차', '기본 ②64·65, 심71·72', (d) => {
      const s = BOOK, k = d.int(0, 3), more = d.bool(), gap = d.int(3, 9), w = tens(d, (x) => Math.min(...x) - gap >= 6, 3);
      const base = more ? Math.max(...w) : Math.min(...w), blank = more ? base + gap : base - gap, v = w.slice(0, k).concat([blank], w.slice(k)), j = v.indexOf(base), shown = v.map((x, i) => (i === k ? null : x));
      const hi = Math.max(...v), lo = Math.min(...v);
      return N(`${lead(s)} ${josa(s.names[k], '이/가')} ${s.names[j]}보다 책을 ${gap}권 더 ${more ? '많이' : '적게'} 읽었을 때, 책을 가장 많이 읽은 반은 가장 적게 읽은 반보다 책을 몇 권 더 많이 읽었는가?`, hi - lo, {
        unit: '권', figure: graph(s, shown, [10, 1]), explain: `${josa(s.names[j], '은/는')} ${base}권을 읽었으므로 ${josa(s.names[k], '은/는')} ${base} ${more ? '+' : '-'} ${gap} = ${blank}(권)을 읽었다. 가장 많이 읽은 반은 ${hi}권, 가장 적게 읽은 반은 ${lo}권이므로 ${hi} - ${lo} = ${hi - lo}`,
        facts: facts(shown, { calc: [[more ? `${base}+${gap}-${lo}` : `${hi}-(${base}-${gap})`, 0]] })
      });
    }),
    H('h-regroup-most', '묶어서 다시 분류하면 달라지는 가장 많은 것', '심4, 기본 ③4·5', (d) => {
      // 낱낱으로는 떡볶이나 김밥이 가장 많지만 묶으면 빵이나 주스가 가장 많다. 처음 표에서 가장 큰 수를 고르는 아이는 틀린다.
      const SNACKS = ['크림빵', '단팥빵', '떡볶이', '사과주스', '포도주스', '김밥'], KINDS = ['빵', '떡볶이', '주스', '김밥'];
      const v = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(5, 9), d.int(2, 6), d.int(2, 6), d.int(5, 9)], (x) => {
        const grouped = [x[0] + x[1], x[2], x[3] + x[4], x[5]], top = Math.max(...grouped);
        return x[2] !== x[5] && Math.max(x[2], x[5]) > Math.max(x[0], x[1], x[3], x[4]) && grouped.filter((y) => y === top).length === 1 && (grouped[0] === top || grouped[2] === top);
      });
      const grouped = [v[0] + v[1], v[2], v[3] + v[4], v[5]], top = grouped.indexOf(Math.max(...grouped));
      return C('학생들이 좋아하는 간식을 조사하여 나타낸 표이다. 크림빵과 단팥빵을 빵으로, 사과주스와 포도주스를 주스로 묶어 다시 분류할 때, 가장 많은 학생이 좋아하는 간식은?', KINDS, top, {
        figure: table(['간식', '학생 수(명)'], SNACKS.map((word, i) => [word, v[i]])),
        explain: `빵은 ${v[0]} + ${v[1]} = ${grouped[0]}(명), 주스는 ${v[3]} + ${v[4]} = ${grouped[2]}(명)이다. 다시 분류하면 ${KINDS.map((word, i) => `${word} ${grouped[i]}명`).join(', ')}이므로 ${josa(KINDS[top], '이/가')} 가장 많다.`,
        facts: { choose: { exprs: [`${v[0]}+${v[1]}`, String(v[2]), `${v[3]}+${v[4]}`, String(v[5])], rule: 'max' } }
      });
    }),
    H('h-split', '그림그래프의 수를 남학생과 여학생으로 가르기', '심46·47', (d) => {
      const s = TOWN, v = tens(d, (x) => x.every((y) => y >= 14)), boys = v.map((x) => d.int(5, x - 5)), girls = v.map((x, i) => x - boys[i]);
      const [r1, r2] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((p, q) => p - q), boyFirst = d.bool();      // ㉠은 r1 줄, ㉡은 r2 줄. 한쪽은 남학생 칸, 다른 쪽은 여학생 칸
      const hidden = [(boyFirst ? boys : girls)[r1], (boyFirst ? girls : boys)[r2]], known = [(boyFirst ? girls : boys)[r1], (boyFirst ? boys : girls)[r2]];
      const cell = (i, isBoy) => (i === r1 && isBoy === boyFirst ? box(LABELS[0]) : i === r2 && isBoy !== boyFirst ? box(LABELS[1]) : (isBoy ? boys : girls)[i]);
      return M('마을별 학생 수를 나타낸 그림그래프와, 그 학생을 남학생과 여학생으로 나누어 나타낸 표이다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: hidden[0] }, { label: LABELS[1], answer: hidden[1] }], {
        figure: graph(s, v, [10, 1]) + table(['마을', '남학생(명)', '여학생(명)'], s.names.map((word, i) => [word, cell(i, true), cell(i, false)])),
        explain: `${s.names[r1]}의 학생은 ${v[r1]}명이고 ${boyFirst ? '여학생' : '남학생'}이 ${known[0]}명이므로 ${LABELS[0]}은 ${v[r1]} - ${known[0]} = ${hidden[0]}이다. ${s.names[r2]}의 학생은 ${v[r2]}명이고 ${boyFirst ? '남학생' : '여학생'}이 ${known[1]}명이므로 ${LABELS[1]}은 ${v[r2]} - ${known[1]} = ${hidden[1]}이다.`,
        facts: facts(v, { calc: [[`${v[r1]}-${known[0]}`, 0], [`${v[r2]}-${known[1]}`, 1]] })
      });
    }),
    H('h-half', '2배인 쪽을 알고 반 구하기', '심74, 기본 ②48', (d) => {
      // 48명의 반 24명. 96명: 「2배」라는 말만 보고 곱하는 아이, 46명·50명: 2를 빼거나 더하는 아이
      const s = TOWN, [v, k, j] = d.until(() => { const whole = d.int(12, 29) * 2, list = d.shuffle([whole, whole / 2, d.int(1, 5) * 10 + d.int(0, 8), d.int(1, 5) * 10 + d.int(0, 8)]); return [list, list.indexOf(whole / 2), list.indexOf(whole)]; }, ([x]) => distinct(x));
      const shown = v.map((x, i) => (i === k ? null : x)), list = d.shuffle([v[j] / 2, v[j] * 2, v[j] - 2, v[j] + 2]);
      return C(`${lead(s)} ${s.names[j]}의 학생 수가 ${s.names[k]}의 학생 수의 2배일 때, ${s.names[k]}의 학생 수는?`, list.map((x) => x + '명'), list.indexOf(v[j] / 2), {
        figure: graph(s, shown, [10, 1]), explain: `${s.names[j]}의 학생 수는 ${v[j]}명이다. ${s.names[k]}의 학생 수의 2배가 ${v[j]}명이므로 ${s.names[k]}의 학생 수는 ${v[j]} ÷ 2 = ${v[j] / 2}(명)이다.`,
        facts: facts(shown, { pick: { expr: `${v[j]}/2`, options: list } })
      });
    }),
    H('h-two-decide', '두 그림그래프를 함께 보고 정하기', '기본 ②76', (d) => {
      // 두 주를 합하여 가장 많이 팔린 빵은 어느 한 주에 가장 많이 팔린 빵이 아니다
      const KINDS = ['크림빵', '단팥빵', '소금빵'];
      const [a, b] = d.until(() => [tens(d, null, 3), tens(d, null, 3)], ([x, y]) => { const t = x.map((p, i) => p + y[i]), top = Math.max(...t); return t.filter((p) => p === top).length === 1 && t.indexOf(top) !== x.indexOf(Math.max(...x)) && t.indexOf(top) !== y.indexOf(Math.max(...y)); });
      const total = a.map((x, i) => x + b[i]), top = total.indexOf(Math.max(...total));
      return C('어느 가게에서 지난주와 이번 주에 팔린 빵의 수를 조사하여 나타낸 두 그림그래프이다. 두 주 동안 가장 많이 팔린 빵을 다음 주에 더 많이 만들려고 한다. 더 많이 만들 빵은?', KINDS, top, {
        figure: pictograph(['빵', '지난주에 팔린 수'], KINDS.map((word, i) => [word, a[i]]), [10, 1], '개', { legend: false }) + pictograph(['빵', '이번 주에 팔린 수'], KINDS.map((word, i) => [word, b[i]]), [10, 1], '개'),
        explain: `빵마다 두 주 동안 팔린 수를 더한다. ${KINDS.map((word, i) => `${word} ${a[i]} + ${b[i]} = ${total[i]}`).join(', ')}이므로 ${josa(KINDS[top], '이/가')} 가장 많이 팔렸다.`,
        facts: { picto: { shown: a }, choose: { exprs: a.map((x, i) => `${x}+${b[i]}`), rule: 'max' }, unseen: a.concat(b) }
      });
    }),
    H('h-draw-gap', '차를 그림으로 나타내는 데 필요한 그림의 수', '기본 ③32, 덧', (d) => {
      const v = tens(d, (x) => borrow(Math.max(...x), Math.min(...x)) && Math.max(...x) - Math.min(...x) >= 11), hi = Math.max(...v), lo = Math.min(...v), gap = hi - lo;
      return M('학생들이 좋아하는 운동을 조사하여 나타낸 그림그래프이다. 가장 많은 학생이 좋아하는 운동과 가장 적은 학생이 좋아하는 운동의 학생 수의 차를 이 그림그래프의 큰 그림과 작은 그림으로 나타내려고 한다. 큰 그림과 작은 그림은 각각 몇 개 필요한가?', [{ label: '큰 그림', answer: big(gap, 10), unit: '개' }, { label: '작은 그림', answer: small(gap, 10), unit: '개' }], {
        figure: pictograph(['운동', '학생 수'], SPORTS.map((word, i) => [word, v[i]]), [10, 1], '명'),
        explain: `가장 많은 운동은 ${hi}명, 가장 적은 운동은 ${lo}명이므로 차는 ${hi} - ${lo} = ${gap}(명)이다. ${josa(gap, '은/는')} ${josa(10, '이/가')} ${big(gap, 10)}개, ${josa(1, '이/가')} ${small(gap, 10)}개인 수이므로 큰 그림 ${big(gap, 10)}개와 작은 그림 ${small(gap, 10)}개가 필요하다.`,
        facts: facts(v, { calc: [[`(${hi}-${lo}-(${hi}-${lo})%10)/10`, 0], [`(${hi}-${lo})%10`, 1]] })
      });
    }),
    H('h-draw-all', '표 전체를 나타내는 데 필요한 그림의 수', '심60', (d) => {
      const v = d.until(() => DRINKS.map(() => d.int(12, 38)), (x) => distinct(x) && x.every((y) => y % 10 >= 1) && sum(x.map((y) => y % 10)) >= 10), each = v.map((x) => big(x, 10) + small(x, 10));
      return N('어느 가게에서 하루 동안 팔린 음료의 수를 나타낸 표이다. 10잔을 나타내는 큰 그림과 1잔을 나타내는 작은 그림으로 그림그래프를 그리려면 그림을 모두 몇 개 그려야 하는가?', sum(each), {
        unit: '개', figure: table(['음료', '팔린 수(잔)'], DRINKS.map((word, i) => [word, v[i]])),
        explain: `음료마다 큰 그림과 작은 그림의 수를 더하면 ${DRINKS.map((word, i) => `${word} ${big(v[i], 10)} + ${small(v[i], 10)} = ${each[i]}`).join(', ')}이다. ${each.join(' + ')} = ${sum(each)}`,
        facts: { calc: [[v.map((x) => `(${x}-${x}%10)/10+${x}%10`).join('+'), 0]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
