// 2학년 1학기 4단원 길이 재기 — 기본 문항(자로 재기 · 약 몇 cm · 어림하기)과 실력 문항.
// 꼴 목록과 싣는 기준, 뺀 것과 까닭은 2-1-4a.js 머리에 적었다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 문항의 장치)
//  - 물건의 길이를 오른쪽 끝의 눈금으로 읽는다(눈금 3에서 10까지인 물건을 10 cm라고 한다). 길이는 두 끝 사이에 1 cm가 몇 번 들어가는가이다.
//  - 끝이 더 오른쪽에 있는 것, 양 끝이 더 멀리 떨어진 것이 더 길다고 여긴다(시작한 눈금이 다른 막대, 구부러진 선).
//  - 「약 6 cm」는 6을 지난 것만이라고(또는 6에 못 미친 것만이라고) 여긴다. 가까운 쪽 눈금이므로 6의 양쪽에 다 있다.
//    그래서 「약」이 같아도 길이는 다를 수 있다.
//  - 잰 횟수가 많으면 길다고 여긴다. 단위가 다르면 횟수만으로는 견줄 수 없고, 같은 길이를 재면 긴 단위일수록 횟수가 적다.
//  - 가깝게 어림했다는 것을 길게(또는 짧게) 어림한 것과 헷갈린다. 실제 길이와의 차이가 작은 것이 가깝게 어림한 것이다.
// 실력의 잣대: ① 그림·상황의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제 ② 두 번 넘게 생각해야 풀리는 문제.
// 보기마다 「어떤 아이가 고르는가」를 유형 위에 적었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, tagged, table, N, C } = B.kit;
  const G = B.kit.geo;
  const { MEASURE, GUESS, some, TAGS, ruler, place, chains, grid, pathLength, orderOptions } = B.kit.g214;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 두 수의 차이를 다시 셈할 식: 큰 수에서 작은 수를 뺀다.
  const gapExpr = (x, y) => (x > y ? `${x}-${y}` : `${y}-${x}`);
  const gapOf = (x, y) => Math.abs(x - y);

  B.addTypes('2-1-4', 'ruler', [
    T('ruler-right', '자로 바르게 잰 것 고르기', '①31 심26', (d) => {
      const n = d.int(3, 5), kinds = d.shuffle(['right', 'edge', 'tilt']), at = kinds.indexOf('right');
      const draw = (kind) => (kind === 'right' ? ruler([{ from: 0, to: n * 10 }], { last: 6, u: 24 })
        : kind === 'edge' ? ruler([{ from: -4, to: n * 10 - 4, said: '왼쪽 끝이 눈금 0보다 왼쪽에 있는 자의 끝에 놓였다' }], { last: 6, u: 24 })
          : ruler([{ from: 0, to: n * 10, tilt: 11, said: '왼쪽 끝은 눈금 0, 자와 나란하지 않고 비스듬히 놓였다' }], { last: 6, u: 24, room: 22 }));
      return C('색 테이프의 길이를 자로 바르게 잰 것은?', TAGS.slice(0, 3), at, {
        figure: G.tiles(kinds.map((kind, i) => [TAGS[i], draw(kind)])),
        explain: `색 테이프의 한쪽 끝을 자의 눈금 0에 맞추고, 자와 나란히 놓아야 한다. 바르게 잰 것은 ${TAGS[at]}이다.`, facts: { truth: kinds.map((kind) => kind === 'right'), want: true }
      });
    }),
    T('ruler-zero', '한쪽 끝을 눈금 0에 맞추어 길이 재기', '①33·39 심25', (d) => {
      const n = d.int(3, 10);
      return N('한쪽 끝을 자의 눈금 0에 맞춘 연필의 길이는 몇 cm인가?', n, {
        unit: 'cm', figure: ruler([{ from: 0, to: n * 10, kind: 'pencil', color: '#fde68a' }], { last: n + 1 }),
        explain: `연필의 오른쪽 끝이 눈금 ${n}에 있다. 눈금 0에서 눈금 ${n}까지 1 cm가 ${n}번이므로 ${n} cm이다.`, facts: { calc: [[`${n}-0`, 0]] }
      });
    }),
    T('ruler-from', '0이 아닌 눈금에서 시작한 물건의 길이', '①34 심16·27', (d) => {
      const a = d.int(1, 4), n = d.int(3, 7), b = a + n;
      return N('자 위에 놓인 못의 길이는 몇 cm인가?', n, {
        unit: 'cm', figure: ruler([{ from: a * 10, to: b * 10, kind: 'nail' }], { last: b + 1 }),
        explain: `못은 눈금 ${a}에서 눈금 ${b}까지 놓여 있다. 그 사이에 1 cm가 ${n}번 들어가므로 ${n} cm이다.`, facts: { calc: [[`${b}-${a}`, 0]] }
      });
    }),
    T('ruler-words', '두 끝의 눈금을 듣고 길이 구하기', '①35', (d) => {
      const what = d.pick(['열쇠', '머리핀', '지우개', '크레파스']), a = d.int(3, 12), n = d.int(4, 8), b = a + n;
      return N(`${what}의 한쪽 끝을 자의 눈금 ${a}에 맞추었더니 다른 쪽 끝이 눈금 ${b}에 왔다. ${what}의 길이는 몇 cm인가?`, n, {
        unit: 'cm', explain: `눈금 ${a}에서 눈금 ${b}까지 1 cm가 ${n}번 들어간다. ${what}의 길이는 ${n} cm이다.`, facts: { calc: [[`${b}-${a}`, 0]] }
      });
    }),
    T('ruler-talk', '바르게 잰 사람 고르기', '①36·32', (d) => {
      const a = d.int(1, 3), n = d.int(3, 6), b = a + n, who = some(d, NAMES, 2), good = d.int(0, 1);
      const talk = (ok) => (ok ? `1 cm가 ${n}번이므로 ${n} cm이다.` : `오른쪽 끝이 눈금 ${b}에 있으므로 ${b} cm이다.`);
      return C('머리핀의 길이를 두 사람이 재었다. 바르게 잰 사람은?', who, good, {
        figure: ruler([{ from: a * 10, to: b * 10, color: '#f9a8d4' }], { last: b + 1 }) + lines(who.map((w, i) => `${w}: ${talk(i === good)}`)),
        explain: `머리핀은 눈금 ${a}에서 눈금 ${b}까지 놓여 있다. 그 사이에 1 cm가 ${n}번 들어가므로 ${n} cm이다. 왼쪽 끝이 눈금 0에 있지 않으므로 오른쪽 끝의 눈금이 길이가 아니다.`,
        facts: { claimed: who.map((_, i) => [`${b}-${a}`, i === good ? n : b]), claimedWant: true }
      });
    }),
    T('ruler-find', '길이가 주어진 수인 막대 찾기', '①37', (d) => {
      // 맞는 막대는 0이 아닌 눈금에서 시작한다. 틀린 막대 하나는 오른쪽 끝의 눈금이 묻는 수와 같다(끝 눈금만 읽으면 고른다).
      const k = d.int(4, 6), s1 = d.int(1, 3), s2 = d.int(1, 2), bars = d.shuffle([{ from: s1, to: s1 + k }, { from: s2, to: k }, { from: 0, to: k + d.pick([-1, 1]) }]);
      const lens = bars.map((b) => b.to - b.from), at = lens.indexOf(k), last = Math.max(...bars.map((b) => b.to)) + 1;
      return C(`길이가 ${k} cm인 막대는?`, TAGS.slice(0, 3), at, {
        figure: ruler(bars.map((b, i) => ({ name: TAGS[i], from: b.from * 10, to: b.to * 10 })), { last }),
        explain: bars.map((b, i) => `${TAGS[i]}는 눈금 ${b.from}에서 ${b.to}까지 ${lens[i]} cm`).join(', ') + `이다. ${k} cm인 막대는 ${TAGS[at]}이다.`,
        facts: { choose: { exprs: bars.map((b) => `${b.to}-${b.from}`), rule: 'equals', target: k } }
      });
    })
  ]);

  B.addTypes('2-1-4', 'about', [
    T('about-read', '눈금 사이에서 끝나는 물건의 길이', '①40·39 심34', (d) => {
      const n = d.int(3, 9), over = d.bool(), to = n * 10 + (over ? 3 : -3);
      return N('한쪽 끝을 자의 눈금 0에 맞춘 색연필의 길이는 약 몇 cm인가?', n, {
        unit: 'cm', lead: '약', figure: ruler([{ from: 0, to, kind: 'pencil', color: '#86efac' }], { last: n + 1 }),
        explain: `색연필의 오른쪽 끝이 눈금 ${josa(over ? n : n - 1, '과/와')} ${over ? n + 1 : n} 사이에 있고 눈금 ${n}에 더 가깝다. 약 ${n} cm이다.`, facts: { calc: [[`${n}-0`, 0]] }
      });
    }),
    T('about-say', '「약」을 붙여 길이 나타내기', '①42', (d) => {
      const what = d.pick(['빨대', '볼펜', '숟가락', '칫솔']), n = d.int(5, 12), up = d.bool(), near = up ? n + 1 : n;
      const rows = d.shuffle([[`${n} cm`, false], [`약 ${n} cm`, !up], [`${n + 1} cm`, false], [`약 ${n + 1} cm`, up]]);
      return C(`${what}의 한쪽 끝을 자의 눈금 0에 맞추었다. 다른 쪽 끝은 눈금 ${josa(n, '과/와')} ${n + 1} 사이에 있고 눈금 ${near}에 더 가깝다. ${what}의 길이를 바르게 나타낸 것은?`, rows.map(([v]) => v), rows.findIndex(([, ok]) => ok), {
        explain: `끝이 눈금 사이에 있으면 가까운 쪽 눈금의 수를 읽고 앞에 「약」을 붙인다. 눈금 ${near}에 더 가까우므로 약 ${near} cm이다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('about-talk', '「약 몇 cm」를 바르게 말한 사람 고르기', '①44 심35', (d) => {
      const n = d.int(4, 9), over = d.bool(), to = n * 10 + (over ? 3 : 7), near = over ? n : n + 1, who = some(d, NAMES, 2), said = d.shuffle([n, n + 1]);
      return C('두 사람이 형광펜의 길이를 재어 말하였다. 바르게 말한 사람은?', who, said.indexOf(near), {
        figure: ruler([{ from: 0, to, color: '#fde68a' }], { last: n + 2 }) + lines(who.map((w, i) => `${w}: 약 ${said[i]} cm`)),
        explain: `형광펜의 오른쪽 끝이 눈금 ${josa(n, '과/와')} ${n + 1} 사이에 있고 눈금 ${near}에 더 가깝다. 약 ${near} cm이다.`, facts: { closer: { expr: String(to / 10), estimates: said } }
      });
    }),
    T('about-find', '길이가 약 몇 cm인 것 찾기', '①43', (d) => {
      // 맞는 것 하나(묻는 눈금의 바로 앞이나 바로 뒤), 묻는 눈금을 지나 다음 눈금에 가까운 것, 묻는 눈금에 한참 못 미친 것
      const k = d.int(4, 8), ends = d.shuffle([k * 10 + d.pick([-3, 3]), k * 10 + 7, k * 10 - 7]), abouts = ends.map((t) => Math.round(t / 10)), at = abouts.indexOf(k);
      return C(`한쪽 끝을 눈금 0에 맞춘 색 테이프이다. 길이가 약 ${k} cm인 것은?`, TAGS.slice(0, 3), at, {
        figure: ruler(ends.map((to, i) => ({ name: TAGS[i], from: 0, to })), { last: k + 2 }),
        explain: ends.map((to, i) => `${TAGS[i]}의 오른쪽 끝은 ${place(to)}이므로 약 ${abouts[i]} cm`).join(', ') + '이다.', facts: { truth: abouts.map((v) => v === k), want: true }
      });
    })
  ]);

  // 겪어 보아 아는 길이: [물건, 가장 가까운 길이(cm)]. 보기는 1, 5, 20, 90 cm로 서로 멀리 떨어져 있다.
  const SIZES = [['공깃돌의 너비', 1], ['지우개의 길이', 5], ['필통의 길이', 20], ['젓가락의 길이', 20], ['긴 우산의 길이', 90]];
  B.addTypes('2-1-4', 'guess', [
    T('guess-size', '물건의 길이에 대한 양감', '①46 심39·40', (d, n) => {
      if (n === 0) {
        const [what, cm] = d.pick(SIZES), list = [1, 5, 20, 90];
        return C(`${what}에 가장 가까운 것은?`, list.map((v) => `${v} cm`), list.indexOf(cm), {
          explain: `${josa(what, '은/는')} ${cm} cm쯤이다.`, facts: { truth: list.map((v) => v === cm), want: true }
        });
      }
      if (n === 1) {
        // 길이 → 물건: 길이가 서로 멀리 떨어진 물건 넷 가운데 고른다.
        const rows = d.shuffle([SIZES[0], SIZES[1], d.pick([SIZES[2], SIZES[3]]), SIZES[4]]), cm = d.pick([5, 20, 90]), at = rows.findIndex(([, v]) => v === cm);
        return C(`길이가 약 ${cm} cm인 것은?`, rows.map(([v]) => v), at, {
          explain: `${josa(rows[at][0], '은/는')} ${cm} cm쯤이다.`, facts: { truth: rows.map(([, v]) => v === cm), want: true }
        });
      }
      const list = d.shuffle(some(d, ['뼘', '걸음', '양팔을 벌린 길이', '발의 길이'], 3).concat(['엄지손톱의 너비']));
      return C('몸으로 길이를 어림하려고 한다. 길이가 약 1 cm인 것은?', list, list.indexOf('엄지손톱의 너비'), {
        explain: '엄지손톱의 너비는 약 1 cm이다. 1 cm를 어림할 때 쓸 수 있다.', facts: { truth: list.map((v) => v === '엄지손톱의 너비'), want: true }
      });
    }, { count: 3 }),
    T('guess-two', '두 사람 가운데 더 가깝게 어림한 사람', '①48 심41', (d) => {
      const what = d.pick(['리본', '끈', '나무 막대', '색 테이프']), real = d.int(12, 38), [p, q] = d.until(() => [d.int(1, 6), d.int(1, 6)], ([x, y]) => x !== y), who = some(d, NAMES, 2), est = d.shuffle([real - p, real + q]);
      const gaps = est.map((v) => gapOf(v, real)), at = gaps.indexOf(Math.min(...gaps));
      return C(`${what}의 실제 길이는 ${real} cm이다. ${name(who[0], '은/는')} 약 ${est[0]} cm, ${name(who[1], '은/는')} 약 ${est[1]} cm로 어림하였다. 실제 길이에 더 가깝게 어림한 사람은?`, who, at, {
        explain: `실제 길이와의 차이는 ${who[0]} ${gaps[0]} cm, ${who[1]} ${gaps[1]} cm이다. 차이가 더 작은 ${name(who[at], '이/가')} 더 가깝게 어림하였다.`, facts: { closer: { expr: String(real), estimates: est } }
      });
    }),
    T('guess-many', '여러 사람 가운데 가장 가깝게 어림한 사람', '①49 심42', (d) => {
      // 어림한 길이는 5 cm 단위로 적고 실제 길이는 5의 배수가 아니게 하면 차이가 모두 다르다.
      const what = d.pick(['털실', '밧줄', '리본', '나무 막대']), real = d.until(() => d.int(31, 78), (v) => v % 5 !== 0), who = some(d, NAMES, 4), near = [];
      for (let v = 15; v <= 95; v += 5) if (Math.abs(v - real) <= 22) near.push(v);
      const est = d.until(() => some(d, near, 4), (list) => list.some((v) => v < real) && list.some((v) => v > real)), gaps = est.map((v) => gapOf(v, real)), at = gaps.indexOf(Math.min(...gaps));
      return C(`${what}의 실제 길이는 ${real} cm이다. 네 사람이 어림한 길이가 표와 같을 때, 가장 가깝게 어림한 사람은?`, who, at, {
        figure: table(['이름', '어림한 길이'], who.map((w, i) => [w, `약 ${est[i]} cm`])),
        explain: `실제 길이와의 차이는 ${who.map((w, i) => `${w} ${gaps[i]} cm`).join(', ')}이다. 차이가 가장 작은 ${name(who[at], '이/가')} 가장 가깝게 어림하였다.`, facts: { closer: { expr: String(real), estimates: est } }
      });
    }),
    T('guess-measure', '자로 잰 길이와 어림한 길이 비교하기', '①51 심44', (d) => {
      const real = d.int(5, 9), who = some(d, NAMES, 3), flip = d.bool(), est = d.shuffle([1, 2, 3].map((g) => real + ((g === 2) === flip ? g : -g)));
      const gaps = est.map((v) => gapOf(v, real)), at = gaps.indexOf(3);
      return C('세 사람이 고무줄의 길이를 어림한 다음 자로 재었다. 실제 길이와 차이가 가장 크게 어림한 사람은?', who, at, {
        figure: ruler([{ from: 0, to: real * 10, color: '#fdba74' }], { last: real + 1 }) + lines(who.map((w, i) => `${w}: 약 ${est[i]} cm`)),
        explain: `고무줄의 길이는 ${real} cm이다. 실제 길이와의 차이는 ${who.map((w, i) => `${w} ${gaps[i]} cm`).join(', ')}이다. 차이가 가장 큰 사람은 ${who[at]}이다.`,
        facts: { choose: { exprs: est.map((v) => gapExpr(v, real)), rule: 'max' } }
      });
    }),
    T('guess-cut', '어림하여 자른 길이 비교하기', '①52 심45', (d) => {
      const aim = d.int(4, 7), [p, q] = d.until(() => [d.int(1, 2), d.int(1, 3)], ([x, y]) => x !== y), who = some(d, NAMES, 2), lens = d.shuffle([aim - p, aim + q]);
      const gaps = lens.map((v) => gapOf(v, aim)), at = gaps.indexOf(Math.min(...gaps));
      return C(`두 사람이 ${aim} cm를 어림하여 색 테이프를 자른 다음 자로 재었다. ${aim} cm에 더 가깝게 어림한 사람은?`, who, at, {
        figure: ruler(who.map((w, i) => ({ name: w, from: 0, to: lens[i] * 10 })), { last: Math.max(...lens) + 1 }),
        explain: `색 테이프의 길이는 ${who[0]} ${lens[0]} cm, ${who[1]} ${lens[1]} cm이다. ${aim} cm와의 차이는 ${who[0]} ${gaps[0]} cm, ${who[1]} ${gaps[1]} cm이므로 ${name(who[at], '이/가')} 더 가깝게 어림하였다.`,
        facts: { closer: { expr: String(aim), estimates: lens } }
      });
    }),
    T('guess-word', '어림한 길이와 잰 길이를 비교하는 말', '①53', (d) => {
      const who = d.pick(NAMES), real = d.int(4, 9), est = real + d.pick([-2, -1, 1, 2]);
      return C(`${name(who, '은/는')} 막대의 길이를 약 ${est} cm로 어림한 다음 자로 재었다. ${box()} 안에 알맞은 말은?`, ['길다', '짧다'], est > real ? 0 : 1, {
        figure: ruler([{ from: 0, to: real * 10, color: '#c4b5fd' }], { last: real + 1 }) + lines([`어림한 길이는 자로 잰 길이보다 더 ${box()}.`]),
        explain: `자로 잰 길이는 ${real} cm이다. 어림한 길이 약 ${est} cm는 ${real} cm보다 더 ${est > real ? '길다' : '짧다'}.`, facts: { choose: { exprs: [String(est), String(real)], rule: 'max' } }
      });
    })
  ]);

  B.addGroup('2-1-4', {
    id: 'hard', title: '실력 문제', standard: MEASURE,
    types: [
      // ① 끝이 가장 오른쪽에 있는 막대는 가장 긴 막대가 아니다. 끝 눈금만 읽는 아이는 그 막대를 고른다.
      H('h-longest', '시작한 눈금이 다른 막대의 길이 비교', '심29 ①38', (d) => {
        const bars = d.until(() => [0, 1, 2].map(() => { const from = d.int(0, 6); return { from, to: from + d.int(2, 6) }; }), (list) => {
          const lens = list.map((b) => b.to - b.from), ends = list.map((b) => b.to), top = lens.indexOf(Math.max(...lens));
          return new Set(lens).size === 3 && new Set(ends).size === 3 && Math.max(...ends) <= 10 && ends[top] !== Math.max(...ends) && Math.max(...lens) - Math.min(...lens) <= 3 && list.filter((b) => b.from === 0).length <= 1;
        });
        const lens = bars.map((b) => b.to - b.from), at = lens.indexOf(Math.max(...lens));
        return C('가장 긴 색 테이프는?', TAGS.slice(0, 3), at, {
          figure: ruler(bars.map((b, i) => ({ name: TAGS[i], from: b.from * 10, to: b.to * 10 })), { last: Math.max(...bars.map((b) => b.to)) + 1 }),
          explain: bars.map((b, i) => `${TAGS[i]}는 눈금 ${b.from}에서 ${b.to}까지 ${lens[i]} cm`).join(', ') + `이다. 가장 긴 것은 ${TAGS[at]}이다. 오른쪽 끝의 눈금이 아니라 두 끝 사이에 1 cm가 몇 번 들어가는지를 센다.`,
          facts: { choose: { exprs: bars.map((b) => `${b.to}-${b.from}`), rule: 'max' } }
        });
      }),
      // ① 끝 눈금이 같은 두 색 테이프의 길이가 다르고, 끝 눈금이 다른 두 색 테이프의 길이가 같다. 끝 눈금만 읽는 아이는 끝 눈금이 혼자 다른 것(길이는 같은 것)을 고른다.
      H('h-odd', '길이가 다른 하나 찾기', '심28', (d) => {
        const n = d.int(4, 6), s = d.int(2, 4), cut = d.int(1, 2), bars = d.shuffle([{ from: 0, to: n }, { from: s, to: s + n }, { from: cut, to: n }]);
        const lens = bars.map((b) => b.to - b.from), at = lens.indexOf(n - cut);
        return C('길이가 나머지와 다른 색 테이프는?', TAGS.slice(0, 3), at, {
          figure: ruler(bars.map((b, i) => ({ name: TAGS[i], from: b.from * 10, to: b.to * 10 })), { last: s + n + 1 }),
          explain: bars.map((b, i) => `${TAGS[i]}는 눈금 ${b.from}에서 ${b.to}까지 ${lens[i]} cm`).join(', ') + `이다. 길이가 다른 것은 ${TAGS[at]}이다.`,
          facts: { choose: { exprs: bars.map((b) => `${b.to}-${b.from}`), rule: 'odd' } }
        });
      }),
      // ① 선은 눈금 a에서 b까지. 보기: 바른 답 / 끝 눈금 b를 길이로 읽은 아이(b보다 짧은 것 셋) / 시작 눈금 a를 길이로 읽은 아이(a보다 짧은 것 하나) / 선보다 긴 것을 고른 아이
      H('h-shorter-all', '잰 선보다 짧은 길이 모두 고르기', '심30', (d) => {
        const a = d.int(3, 4), n = d.int(a + 2, a === 3 ? 7 : 6), b = a + n;
        const rows = d.shuffle([['s1', d.int(2, a - 1)], ['s2', d.int(a, n - 1)], ['mid', d.int(n + 1, b - 1)], ['big', b + d.int(1, 3)]]), tag = (keys) => LABELS.filter((_, i) => keys.includes(rows[i][0]));
        const sets = d.shuffle([tag(['s1', 's2']), tag(['s1', 's2', 'mid']), tag(['s1']), tag(['mid', 'big'])]), right = tag(['s1', 's2']);
        return C('자 위에 그은 선보다 짧은 길이를 모두 고른 것은?', sets.map((p) => p.join(', ')), sets.findIndex((p) => p.join() === right.join()), {
          figure: ruler([{ from: a * 10, to: b * 10, kind: 'line', color: '#b42318' }], { last: b + 1 }) + tagged(rows.map(([, v]) => `${v} cm`)),
          explain: `선은 눈금 ${a}에서 눈금 ${b}까지이므로 ${n} cm이다. ${n} cm보다 짧은 것은 ${rows.filter(([, v]) => v < n).map(([, v]) => `${v} cm`).join(', ')}이다.`,
          facts: { sets: { labels: LABELS.slice(), flags: rows.map(([, v]) => v < n), options: sets } }
        });
      }),
      // ② 길이와 시작 눈금을 알고 끝 눈금을 거꾸로 구한다(눈금 0이 없어 길이를 그대로 읽을 수 없다).
      H('h-broken', '끊어진 자로 길이 재기', '끊어진 자(심27의 변형)', (d) => {
        const a = d.int(3, 6), n = d.int(4, 7);
        return N(`앞쪽이 끊어진 자이다. 길이가 ${n} cm인 색 테이프의 왼쪽 끝을 눈금 ${a}에 맞추면 오른쪽 끝은 눈금 몇에 오는가?`, a + n, {
          lead: '눈금', figure: ruler([], { first: a - 1, last: a + n + 1, label: `앞쪽이 끊어진 자: 눈금 ${a - 1}부터 눈금 ${a + n + 1}까지 있다` }),
          explain: `눈금 ${a}에서 오른쪽으로 1 cm씩 ${n}번 가면 눈금 ${a + n}이다.`, facts: { calc: [[`${a}+${n}`, 0]] }
        });
      }),
      // ② 0이 아닌 눈금에서 시작하고 끝은 눈금 사이: 가까운 눈금을 정한 다음 1 cm가 몇 번인지 센다.
      H('h-about-from', '0이 아닌 눈금에서 시작한 물건의 「약 몇 cm」', '①41', (d) => {
        const a = d.int(1, 3), n = d.int(4, 7), b = a + n, over = d.bool(), to = b * 10 + (over ? 3 : -3);
        return N('자 위에 놓인 풀의 길이는 약 몇 cm인가?', n, {
          unit: 'cm', lead: '약', figure: ruler([{ from: a * 10, to, color: '#fde68a' }], { last: b + 1 }),
          explain: `풀의 왼쪽 끝은 눈금 ${a}에 있고, 오른쪽 끝은 눈금 ${b}에 가깝다. 눈금 ${a}에서 눈금 ${b}까지 1 cm가 ${n}번 들어가므로 약 ${n} cm이다.`, facts: { calc: [[`${b}-${a}`, 0]] }
        });
      }),
      // ① 「약 k cm」는 k의 양쪽에 다 있다. 보기: 바른 답 / k를 지난 것 둘(지나간 눈금을 읽는 아이) / k에 못 미친 것 둘(다음 눈금으로 올려 읽는 아이) / k를 조금 지난 것 하나만(못 미치면 k가 아니라고 여기는 아이)
      H('h-about-all', '길이가 「약 몇 cm」인 것 모두 고르기', '심36 ①43', (d) => {
        const k = d.int(4, 7), rows = d.shuffle([['under', k * 10 - 3], ['over', k * 10 + 3], ['next', k * 10 + 7], ['before', k * 10 - 7]]), names = TAGS.slice(), tag = (keys) => names.filter((_, i) => keys.includes(rows[i][0]));
        const sets = d.shuffle([tag(['under', 'over']), tag(['over', 'next']), tag(['under', 'before']), tag(['over'])]), right = tag(['under', 'over']);
        return C(`한쪽 끝을 눈금 0에 맞춘 색 테이프이다. 길이가 약 ${k} cm인 것을 모두 고른 것은?`, sets.map((p) => p.join(', ')), sets.findIndex((p) => p.join() === right.join()), {
          figure: ruler(rows.map(([, to], i) => ({ name: names[i], from: 0, to })), { last: k + 2 }),
          explain: rows.map(([, to], i) => `${names[i]}의 오른쪽 끝은 ${place(to)}이므로 약 ${Math.round(to / 10)} cm`).join(', ') + `이다. 눈금 ${k}에 조금 못 미친 것도, 조금 지난 것도 약 ${k} cm이다.`,
          facts: { sets: { labels: names, flags: rows.map(([, to]) => Math.round(to / 10) === k), options: sets } }
        });
      }),
      // ① 「약」이 같아도 길이는 다를 수 있다. 보기: 바른 답 / 끝이 더 오른쪽에 있는 것을 고르는 아이(더 짧은 쪽) / 「약」이 같으면 길이도 같다고 여기는 아이
      H('h-about-same', '「약」이 같은 두 물건의 길이 비교', '심36의 변형', (d) => {
        const k = d.int(4, 6), s = d.int(1, 3), long = d.int(0, 1), bars = [0, 1].map((i) => (i === long ? { from: s * 10, to: (s + k) * 10 + 3 } : { from: (s + 1) * 10, to: (s + 1 + k) * 10 - 3 })), list = ['가', '나', '길이가 같다'];
        return C(`두 색 테이프의 길이는 모두 약 ${k} cm이다. 더 긴 색 테이프는?`, list, long, {
          figure: ruler(bars.map((b, i) => ({ name: TAGS[i], from: b.from, to: b.to })), { last: s + k + 2 }),
          explain: `${TAGS[long]}는 눈금 ${s}에서 ${place(bars[long].to)}까지이므로 ${k} cm보다 조금 길다. ${TAGS[1 - long]}는 눈금 ${s + 1}에서 ${place(bars[1 - long].to)}까지이므로 ${k} cm보다 조금 짧다. ${TAGS[long]}가 더 길다.`,
          facts: { truth: list.map((_, i) => i === long), want: true }
        });
      }),
      // ① 양 끝의 자리가 같은 곧은 선과 구부러진 선. 보기: 바른 답(구부러진 선) / 끝이 가장 오른쪽에 있는 곧은 선을 고르는 아이 / 곧은 선과 구부러진 선의 양 끝이 같아 헷갈린 아이
      H('h-bent', '구부러진 선과 곧은 선의 길이 비교', '심20의 변형', (d) => {
        const s = d.int(5, 6), kinds = d.shuffle(['flat', 'bent', 'far']), p = d.int(1, 2), q = d.int(1, s - p - 1);
        const paths = kinds.map((kind, i) => {
          const y = 2 * i + 1;
          return kind === 'flat' ? [[1, y], [1 + s, y]] : kind === 'far' ? [[1, y], [2 + s, y]] : [[1, y], [1 + p, y], [1 + p, y - 1], [1 + p + q, y - 1], [1 + p + q, y], [1 + s, y]];
        });
        const lens = paths.map(pathLength), at = kinds.indexOf('bent');
        return C('그림에서 한 칸의 길이는 1 cm이다. 가장 긴 선은?', TAGS.slice(0, 3), at, {
          figure: grid(paths.map((points, i) => ({ name: TAGS[i], points })), { cols: s + 3, rows: 6, label: '한 칸이 1 cm인 모눈 위에 그은 선: ' + lens.map((n, i) => `${TAGS[i]} ${n}칸`).join(', ') }),
          explain: `선을 따라 1 cm인 칸을 세면 ${lens.map((n, i) => `${TAGS[i]} ${n} cm`).join(', ')}이다. 구부러진 ${TAGS[at]}가 가장 길다.`,
          facts: { choose: { exprs: lens.map(String), rule: 'max' } }
        });
      }),
      // ② 잰 횟수가 적은 사람의 뼘이 더 길다 → 같은 횟수만큼 재면 뼘이 긴 사람의 끈이 더 길다. 횟수가 많은 사람을 고르면 틀린다.
      H('h-span', '뼘의 길이와 잰 횟수', '심9·8 ①16·17', (d) => {
        const who = some(d, NAMES, 2), counts = d.until(() => [d.int(5, 9), d.int(5, 9)], ([x, y]) => x !== y), n = d.int(3, 4), at = counts.indexOf(Math.min(...counts));
        return C(`같은 책상의 긴 쪽을 ${name(who[0], '은/는')} 뼘으로 ${counts[0]}번, ${name(who[1], '은/는')} 뼘으로 ${counts[1]}번 재었다. 두 사람이 각자의 뼘으로 ${n}번씩 재어 끈을 잘랐다. 더 긴 끈을 가진 사람은?`, who, at, {
          explain: `같은 길이를 잴 때 잰 횟수가 적을수록 뼘이 길다. ${nick(who[at])}의 뼘이 더 길다. 똑같이 ${n}번씩 재면 뼘이 긴 ${nick(who[at])}의 끈이 더 길다.`,
          facts: { choose: { exprs: counts.map(String), rule: 'min' } }
        });
      }),
      // ② 단위가 다르면 횟수만으로 견줄 수 없다. 크레파스로 잰 횟수를 클립으로 바꾼다(같은 수를 두세 번 더한다). 횟수가 많은 쪽을 고르는 아이, 긴 단위로 잰 쪽을 무조건 고르는 아이가 틀리게 수를 정한다.
      H('h-link', '단위가 다른 두 길이 비교', '심13·8', (d) => {
        const m = d.int(2, 3), p = d.int(2, 3), total = m * p, q = total + d.pick([-1, 0, 1]), list = ['가 끈', '길이가 같다', '나 끈'], adds = Array.from({ length: p }, () => m).join(' + ');
        return C(`가 끈의 길이는 크레파스로 ${p}번이고, 나 끈의 길이는 클립으로 ${q}번이다. 더 긴 끈은?`, list, total > q ? 0 : total === q ? 1 : 2, {
          figure: chains([{ name: '크레파스', len: m * 34, color: '#fdba74', rows: [{ name: '클립', kind: 'clip', w: 34, n: m }] }], `크레파스 밑에 클립 ${m}개를 빈틈없이 이어 놓았다. 두 끝이 꼭 맞는다`),
          explain: `크레파스의 길이는 클립으로 ${m}번이다. 가 끈은 크레파스로 ${p}번이므로 클립으로 재면 ${adds} = ${total}, ${total}번이다. 나 끈은 클립으로 ${q}번이므로 ${total > q ? '가 끈이 더 길다' : total === q ? '두 끈의 길이는 같다' : '나 끈이 더 길다'}.`,
          facts: { choose: { exprs: [`${m}*${p}`, String(q)], rule: 'compare' } }
        });
      }),
      // ② 그림에서 잰 횟수(3번)를 읽고, 단위의 길이를 그 횟수만큼 더한다(같은 수를 세 번, 합이 20 안쪽).
      H('h-unit-cm', '길이를 아는 단위로 잰 물건의 길이', '심22·21', (d) => {
        const c = d.int(2, 6), k = 3, adds = Array.from({ length: k }, () => c).join(' + ');
        return N(`길이가 ${c} cm인 지우개로 색 테이프의 길이를 재었다. 색 테이프의 길이는 몇 cm인가?`, c * k, {
          unit: 'cm', figure: chains([{ name: '색 테이프', len: k * 44, color: '#f9a8d4', rows: [{ name: '지우개', kind: 'eraser', w: 44, n: k }] }], `색 테이프 밑에 지우개 ${k}개를 빈틈없이 이어 놓았다. 두 끝이 꼭 맞는다`),
          explain: `색 테이프의 길이는 지우개로 ${k}번이다. ${c} cm씩 ${k}번이므로 ${adds} = ${c * k}, ${c * k} cm이다.`, facts: { calc: [[Array.from({ length: k }, () => c).join('+'), 0]] }
        });
      }),
      // ② 한 사람의 어림값을 먼저 구한 다음 실제 길이와의 차이를 비교한다.
      H('h-guess-step', '어림한 길이를 구해 비교하기', '①50', (d) => {
        const who = some(d, NAMES, 2), first = d.int(4, 8) * 10, shorter = d.bool(), second = first + (shorter ? -10 : 10);
        const real = d.until(() => d.int(Math.min(first, second) - 4, Math.max(first, second) + 4), (v) => v % 10 !== 0 && v % 10 !== 5), est = [first, second], gaps = est.map((v) => gapOf(v, real)), at = gaps.indexOf(Math.min(...gaps));
        return C(`끈의 실제 길이는 ${real} cm이다. ${name(who[0], '은/는')} 약 ${first} cm로 어림하였고, ${name(who[1], '은/는')} ${nick(who[0])}보다 10 cm 더 ${shorter ? '짧게' : '길게'} 어림하였다. 실제 길이에 더 가깝게 어림한 사람은?`, who, at, {
          explain: `${name(who[1], '이/가')} 어림한 길이는 약 ${second} cm이다. 실제 길이와의 차이는 ${who[0]} ${gaps[0]} cm, ${who[1]} ${gaps[1]} cm이므로 ${name(who[at], '이/가')} 더 가깝게 어림하였다.`,
          facts: { closer: { expr: String(real), estimates: est } }
        });
      }, { standard: GUESS }),
      // ① 가깝게 어림한 차례는 길이의 차례가 아니다. 보기: 바른 답 / 짧은 것부터 쓴 아이 / 긴 것부터 쓴 아이 / 그 밖의 차례
      H('h-guess-order', '가깝게 어림한 차례', '심46', (d) => {
        const aim = d.int(5, 7), who = some(d, NAMES, 3), flip = d.bool(), lens = d.shuffle([1, 2, 3].map((g) => aim + ((g === 2) === flip ? g : -g))), gaps = lens.map((v) => gapOf(v, aim));
        const by = (score) => [0, 1, 2].sort((x, y) => score(x) - score(y)), right = by((i) => gaps[i]), opt = orderOptions(d, right, [by((i) => lens[i]), by((i) => -lens[i])]);
        return C(`세 사람이 ${aim} cm를 어림하여 색 테이프를 자른 다음 자로 재었다. ${aim} cm에 가깝게 어림한 사람부터 차례로 쓴 것은?`, opt.list.map((o) => o.map((i) => who[i]).join(', ')), opt.answer, {
          figure: ruler(who.map((w, i) => ({ name: w, from: 0, to: lens[i] * 10 })), { last: Math.max(...lens) + 1 }),
          explain: `색 테이프의 길이는 ${who.map((w, i) => `${w} ${lens[i]} cm`).join(', ')}이다. ${aim} cm와의 차이는 ${who.map((w, i) => `${w} ${gaps[i]} cm`).join(', ')}이다. 차이가 작은 사람부터 쓰면 ${right.map((i) => who[i]).join(', ')}이다.`,
          facts: { choose: { exprs: lens.map((v) => gapExpr(v, aim)), rule: 'ascending', orders: opt.list } }
        });
      }, { standard: GUESS })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
