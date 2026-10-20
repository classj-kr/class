// 1학년 1학기 1단원 9까지의 수 — 1만큼 더 큰 수와 1만큼 더 작은 수, 0, 수의 크기 비교의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴_1의 「라·마·바」 묶음, 심화꼴 48꼴)을 꼴마다 따져서 실었다. 그림 도우미는 1-1-1a.js가 B.kit.g111 로 내보낸 것을 쓴다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 뜻을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적는다.
//   ① 「넷」(개수)과 「넷째」(순서)를 같은 것으로 여긴다. 하나만 색칠한 것을 넷째로 읽지 못하고, 흩어져 있는 넷을 넷으로 세지 못한다.
//   ② 어느 쪽에서 세는지 보지 않고 늘 왼쪽에서부터 센다(「앞」이 오른쪽에 있는 줄, 오른쪽에서 몇째, 위에서 몇째인 층).
//   ③ 순서와 개수를 그대로 바꾼다(앞에 5명이 있으면 다섯째, 일곱째이면 앞에 7명).
//   ④ 「■는 □보다 1만큼 더 큰 수」에서 □를 ■보다 큰 수로 읽는다. 「더 많다」는 말이 나오면 무조건 큰 쪽을 답한다.
//   ⑤ 물건이 크면 수도 많다고 여긴다. 아무것도 없는 것은 수로 나타낼 수 없다고 여긴다.
//   ⑥ 「□보다 큰 수」에 □ 자신을, 「□와 □ 사이의 수」에 두 끝의 수를 넣어 센다.
// 그다음에 두 번 넘게 생각해야 하는 문제를 실었다(1만큼 더 큰 수를 거듭 구하기, 가려진 자리까지 이어 세기, 수로 바꾼 뒤 비교하기).
// 실력 문항도 그림을 주고 세어서 답하게 한다. 덧셈식·뺄셈식으로 풀어야 하는 꼴은 싣지 않는다.
//
// 뺀 것과 까닭(이 파일이 맡은 묶음)
//  - 조건 여럿에 맞는 수 찾기: 조건 둘을 겹쳐 고르기(기본 70, 심화 47), □가 문장의 앞뒤로 옮겨 다니는 두 문장(심화 48).
//    「□보다 크고 □보다 작은 수」(기본 69)는 「□와 □ 사이의 수」 한 가지로 고쳐 실었다.
//  - 작도: 수만큼 ○를 그려 비교하기(기본 55)의 그리기. 말 고르기는 「많다·적다와 크다·작다」가 같은 일을 한다.
//  - 같은 문제: 1만큼 더 작은 수와 더 큰 수의 짝 고르기(기본 45)는 양옆 빈칸 쓰기와 답 꼴만 다르다. 1만큼 더 큰(작은) 수로 나타낸 셋 중 가장 큰 수(기본 65)는
//    둘을 비교하는 기본 문항, 셋을 차례로 놓는 실력 문항과 같은 일이다. 층·눈금으로 바꾼 1만큼 더 큰 수 문장제(심화 32의 변형)는 상황만 다르다.
//  - 한글 쓰기: 0을 쓰고 읽기(기본 50, 심화 35)의 「영」 쓰기는 고르기로 바꾸었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, tagged, numbers, table, josa, name, nick, N, M, C } = B.kit;
  const { NATIVE, SINO, NTH, KIND, KEYS, range, some, q, spots, things, strip, queue, building, plates, steps, numrow, tiles } = B.kit.g111;
  const NUM = '2수01-01', ORDER = '2수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const SEQ = { standard: ORDER };   // 실력 묶음에서 수의 계열·크기 비교([2수01-03])를 묻는 유형
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const LESS = ['1만큼', '더 작은 수'], MORE = ['1만큼', '더 큰 수'];
  // 가운데 수의 왼쪽에 1만큼 더 작은 수, 오른쪽에 1만큼 더 큰 수를 적는 틀
  const frame = (n) => steps([LABELS[0], n, LABELS[1]], [LESS, MORE], ['left', 'right'], `가운데 칸의 수는 ${n}. 왼쪽 칸 ㉠은 ${n}보다 1만큼 더 작은 수, 오른쪽 칸 ㉡은 ${n}보다 1만큼 더 큰 수`);
  const plain = (n) => range(1, n).map(() => ({ said: '사람' }));

  B.addTypes('1-1-1', 'one', [
    T('one-more', '1만큼 더 큰 수', '①37', (d) => {
      const n = d.int(2, 8);
      return N(`${n}보다 1만큼 더 큰 수는?`, n + 1, { explain: `수를 순서대로 쓸 때 ${n} 바로 뒤의 수가 ${n}보다 1만큼 더 큰 수이다. ${n + 1}이다.`, facts: { calc: [[`${n}+1`, 0]] } });
    }),
    T('one-less', '1만큼 더 작은 수', '①37', (d) => {
      const n = d.int(3, 9);
      return N(`${n}보다 1만큼 더 작은 수는?`, n - 1, { explain: `수를 순서대로 쓸 때 ${n} 바로 앞의 수가 ${n}보다 1만큼 더 작은 수이다. ${n - 1}이다.`, facts: { rule: 'less', calc: [[`${n}-1`, 0]] } });
    }),
    T('one-both', '수의 양옆에 1만큼 더 작은 수와 더 큰 수 쓰기', '①38·45 심25', (d) => {
      const n = d.int(2, 8);
      return M('빈칸 ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n - 1 }, { label: LABELS[1], answer: n + 1 }], {
        figure: frame(n), explain: `${n}보다 1만큼 더 작은 수는 ${n - 1}, 1만큼 더 큰 수는 ${n + 1}이다.`, facts: { calc: [[`${n}-1`, 0], [`${n}+1`, 1]] }
      });
    }),
    T('one-pic', '그림의 수보다 1만큼 더 작은 수', '①40 심26', (d) => {
      const kind = d.pick(KEYS), what = KIND[kind].name, n = d.int(3, 8);
      return N(`${what}의 수보다 1만큼 더 작은 수는?`, n - 1, { figure: things(kind, n), explain: `${josa(what, '은/는')} ${n}개이다. ${n}보다 1만큼 더 작은 수는 ${n - 1}이다.`, facts: { rule: 'pic', calc: [[`${n}-1`, 0]] } });
    }),
    T('one-pick', '1만큼 더 큰(작은) 수만큼 있는 그림 고르기', '①41', (d, n) => {
      const kind = d.pick(KEYS), what = KIND[kind].name;
      if (n === 0) {
        // 수로 준 것: 주어진 수만큼 있는 그림, 하나 적은 그림이 섞여 있다.
        const m = d.int(4, 6), counts = d.shuffle([m - 1, m, m + 1, m + 2]);
        return C(`${m}보다 1만큼 더 큰 수만큼 있는 것은?`, LABELS, counts.indexOf(m + 1), {
          figure: tiles(counts.map((c, i) => [LABELS[i], things(kind, c)])), explain: `${m}보다 1만큼 더 큰 수는 ${m + 1}이다. ${LABELS[counts.indexOf(m + 1)]}의 ${josa(what, '이/가')} ${m + 1}개이다.`,
          facts: { pick: { expr: `${m}+1`, options: counts } }
        });
      }
      // 그림으로 준 것: 먼저 세고, 1만큼 더 작은 수만큼 색칠한 줄을 찾는다.
      const m = d.int(5, 7), counts = d.shuffle([m - 2, m - 1, m, m + 1]);
      return C(`${what}의 수보다 1만큼 더 작은 수만큼 색칠한 것은?`, LABELS, counts.indexOf(m - 1), {
        figure: things(kind, m) + tagged(counts.map((c) => strip(9, range(0, c - 1)))), explain: `${josa(what, '은/는')} ${m}개이다. ${m}보다 1만큼 더 작은 수는 ${m - 1}이다. ${LABELS[counts.indexOf(m - 1)]}이 ${m - 1}개를 색칠한 것이다.`,
        facts: { pick: { expr: `${m}-1`, options: counts } }
      });
    }, { count: 2 }),
    T('one-word-less', '읽는 말로 준 수보다 1만큼 더 작은 수', '①42', (d) => {
      const n = d.int(3, 9);
      return N(`${q(NATIVE[n])}보다 1만큼 더 작은 수는?`, n - 1, { explain: `${q(NATIVE[n], '은/는')} ${n}이다. ${n}보다 1만큼 더 작은 수는 ${n - 1}이다.`, facts: { calc: [[`${n}-1`, 0]], unseen: [n] } });
    }),
    T('one-two-words', '두 말이 가리키는 한 수', '①44 심28', (d) => {
      const a = d.int(2, 6);
      return N(`${box()}는 ${a}보다 1만큼 더 큰 수이고, ${a + 2}보다 1만큼 더 작은 수이다. ${box()} 안에 알맞은 수는?`, a + 1, {
        explain: `${a}보다 1만큼 더 큰 수는 ${a + 1}이다. ${a + 2}보다 1만큼 더 작은 수도 ${a + 1}이다.`, facts: { calc: [[`${a}+1`, 0], [`${a + 2}-1`, 0]] }
      });
    }),
    T('one-same', '같은 수를 나타내는 두 가지', '①46', (d) => {
      const v = d.int(3, 7);
      const rows = d.shuffle([[`${v + 1}보다 1만큼 더 작은 수`, `${v + 1}-1`, v], [`${v - 1}보다 1만큼 더 큰 수`, `${v - 1}+1`, v], [`${v + 1}보다 1만큼 더 큰 수`, `${v + 1}+1`, v + 2], [`${v - 1}보다 1만큼 더 작은 수`, `${v - 1}-1`, v - 2]]);
      const hit = [0, 1, 2, 3].filter((i) => rows[i][2] === v), all = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
      const shown = d.shuffle(d.shuffle(all.filter((p) => p.join() !== hit.join())).slice(0, 3).concat([hit]));
      return C('같은 수를 나타내는 두 가지는?', shown.map((p) => p.map((i) => LABELS[i]).join(', ')), shown.findIndex((p) => p.join() === hit.join()), {
        figure: tagged(rows.map((row) => row[0])), explain: `㉠부터 차례로 ${rows.map((row) => row[2]).join(', ')}${josa(rows[3][2], '을/를').slice(1)} 나타낸다. ${LABELS[hit[0]]}과 ${LABELS[hit[1]]}이 ${josa(v, '으로/로')} 같다.`,
        facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'same', pairsShown: shown } }
      });
    }),
    T('one-odd', '1만큼 더 큰 수를 나타내지 않는 것', '①47 심31', (d) => {
      // 한 번 더 센 수를 고르지 못하는 아이, 처음 수를 그대로 두는 아이
      const v = d.int(3, 8), w = d.pick([v + 1, v - 1]), odd = d.bool() ? SINO[w] : String(w);
      const rows = d.shuffle([[NATIVE[v], v], [String(v), v], [`${v + 1}보다 1만큼 더 작은 수`, v], [odd, w]]);
      return C(`${v - 1}보다 1만큼 더 큰 수를 나타내지 않는 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] !== v), {
        explain: `${v - 1}보다 1만큼 더 큰 수는 ${v}이다. ${q(odd, '은/는')} ${josa(w, '을/를')} 나타낸다.`, facts: { truth: rows.map((row) => row[1] === v), want: false }
      });
    }),
    T('one-story-less', '1개 더 적게 가진 수', '①48', (d) => {
      const [a, b] = some(d, NAMES, 2), n = d.int(4, 9);
      return N(`${name(a, '은/는')} 딸기를 ${n}개 먹었다. ${name(b, '은/는')} ${nick(a)}보다 1개 더 적게 먹었다. ${name(b, '이/가')} 먹은 딸기는 몇 개인가?`, n - 1, {
        unit: '개', explain: `${n}보다 1만큼 더 작은 수는 ${n - 1}이다.`, facts: { rule: 'story', calc: [[`${n}-1`, 0]] }
      });
    }),
    T('one-story-more', '한 명이 더 왔을 때의 수', '①48 심32', (d) => {
      const n = d.int(3, 8);
      return N(`놀이터에 어린이가 ${n}명 있다. 1명이 더 왔다. 놀이터에 있는 어린이는 몇 명이 되었는가?`, n + 1, {
        unit: '명', explain: `${n}보다 1만큼 더 큰 수는 ${n + 1}이다.`, facts: { calc: [[`${n}+1`, 0]] }
      });
    })
  ]);

  B.addTypes('1-1-1', 'zero', [
    T('zero-write-read', '0을 쓰고 읽기', '①50 심35', (d) => {
      const rows = d.shuffle([['0, 영', true], ['0, 일', false], ['1, 영', false], ['1, 일', false]]);
      return C('접시에 있는 사과의 수를 쓰고 바르게 읽은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        figure: plates([0], 'apple'), explain: '접시에 사과가 하나도 없다. 아무것도 없는 것을 0이라 쓰고 「영」이라고 읽는다.', facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('zero-pic-less', '하나 있는 것보다 1만큼 더 작은 수', '①38·40·50 심26', (d) => {
      const kind = d.pick(KEYS), what = KIND[kind].name;
      return N(`${what}의 수보다 1만큼 더 작은 수는?`, 0, {
        figure: things(kind, 1), explain: `${josa(what, '은/는')} 1개이다. 1보다 1만큼 더 작은 수는 0이다.`, facts: { rule: 'toZero', inverse: ['x+b=a', 1, 1] }
      });
    }),
    T('zero-count', '빈 접시가 있는 그림의 수 세기', '①51 심36', (d) => {
      const counts = d.shuffle([0].concat(some(d, range(1, 4), 2))), tags = LABELS.slice(0, 3);
      return M('접시 ㉠, ㉡, ㉢에 있는 사과는 각각 몇 개인가?', counts.map((c, i) => ({ label: tags[i], answer: c, unit: '개' })), {
        figure: plates(counts, 'apple', tags), explain: `${tags[counts.indexOf(0)]} 접시에는 사과가 하나도 없다. 아무것도 없는 것은 0으로 나타낸다.`,
        facts: { calc: counts.map((c, i) => [String(c), i]).filter((row) => row[0] !== '0') }
      });
    }),
    T('zero-left', '모두 먹고 남은 수', '①52 심37', (d) => {
      const who = d.pick(NAMES), n = d.int(2, 5);
      return N(`접시에 딸기가 ${n}개 있었다. ${name(who, '이/가')} ${n}개를 모두 먹었다. 남은 딸기는 몇 개인가?`, 0, {
        unit: '개', explain: '딸기가 하나도 남지 않았다. 아무것도 없는 것은 0으로 나타낸다.', facts: { inverse: ['x+b=a', n, n] }
      });
    })
  ]);

  B.addTypes('1-1-1', 'compare', [
    T('cmp-two', '두 수 중 더 작은 수', '①53 심39', (d) => {
      const a = d.int(1, 9), b = d.until(() => d.int(1, 9), (v) => v !== a && Math.abs(v - a) <= 3), small = Math.min(a, b), big = Math.max(a, b);
      return N(`${josa(a, '과/와')} ${b} 중에서 더 작은 수는?`, small, { explain: `수를 순서대로 쓸 때 ${josa(small, '이/가')} ${big}보다 앞에 있다. 앞에 있는 수가 더 작은 수이다.`, facts: { minOf: [a, b] } });
    }),
    T('cmp-words', '많다·적다와 크다·작다', '①54·55 심40', (d) => {
      // 물건의 수는 「많다·적다」, 수의 크기는 「크다·작다」로 말한다.
      const [ka, kb] = some(d, KEYS, 2), A = KIND[ka].name, Bn = KIND[kb].name, a = d.int(3, 9), b = d.until(() => d.int(3, 9), (v) => v !== a && Math.abs(v - a) <= 3), less = a < b;
      const rows = d.shuffle([[less ? '적다, 작다' : '많다, 크다', true], [less ? '작다, 적다' : '크다, 많다', false], [less ? '많다, 크다' : '적다, 작다', false], [less ? '크다, 많다' : '작다, 적다', false]]);
      return C('㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        figure: tiles([[A, things(ka, a)], [Bn, things(kb, b)]]) + lines([`${josa(A, '은/는')} ${Bn}보다 ${box(LABELS[0])}.`, `${josa(a, '은/는')} ${b}보다 ${box(LABELS[1])}.`]),
        explain: `${A} ${a}개, ${Bn} ${b}개이다. 물건의 수는 「많다, 적다」로, 수의 크기는 「크다, 작다」로 말한다.`, facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('cmp-pic-less', '그림에서 수가 더 적은 것', '①56 심41', (d) => {
      const [ka, kb] = some(d, KEYS, 2), A = KIND[ka].name, Bn = KIND[kb].name, a = d.int(5, 9), b = d.until(() => d.int(5, 9), (v) => v !== a && Math.abs(v - a) <= 2);
      return C('수가 더 적은 것은?', [A, Bn], a < b ? 0 : 1, {
        figure: tiles([[A, things(ka, a)], [Bn, things(kb, b)]]), explain: `${A} ${a}개, ${Bn} ${b}개이다. ${josa(Math.min(a, b), '은/는')} ${Math.max(a, b)}보다 작으므로 ${josa(a < b ? A : Bn, '이/가')} 더 적다.`,
        facts: { choose: { exprs: [String(a), String(b)], rule: 'min' } }
      });
    }),
    T('cmp-story', '더 많이(적게) 한 사람', '①57 심41', (d, n) => {
      const [p, r] = some(d, NAMES, 2);
      if (n === 0) {
        const a = d.int(3, 9), b = d.until(() => d.int(3, 9), (v) => v !== a);
        return C(`${name(p, '은/는')} 책을 ${a}권, ${name(r, '은/는')} ${b}권 읽었다. 책을 더 많이 읽은 사람은?`, [p, r], a > b ? 0 : 1, {
          explain: `${josa(Math.max(a, b), '은/는')} ${Math.min(a, b)}보다 크다. ${name(a > b ? p : r, '이/가')} 더 많이 읽었다.`, facts: { choose: { exprs: [String(a), String(b)], rule: 'max' } }
        });
      }
      // 수를 읽는 말로 준 것
      const a = d.int(5, 9), b = d.until(() => d.int(5, 9), (v) => v !== a);
      return C(`줄넘기를 ${name(p, '은/는')} ${NATIVE[a]} 번, ${name(r, '은/는')} ${NATIVE[b]} 번 넘었다. 더 적게 넘은 사람은?`, [p, r], a < b ? 0 : 1, {
        explain: `${q(NATIVE[a], '은/는')} ${a}, ${q(NATIVE[b], '은/는')} ${b}이다. ${josa(Math.min(a, b), '은/는')} ${Math.max(a, b)}보다 작으므로 ${name(a < b ? p : r, '이/가')} 더 적게 넘었다.`,
        facts: { choose: { exprs: [String(a), String(b)], rule: 'min' }, unseen: [a, b] }
      });
    }, { count: 2 }),
    T('cmp-story-three', '셋 가운데 가장 많은 것', '①58 심42', (d) => {
      const fruits = ['사과', '귤', '감'], counts = some(d, range(4, 9), 3), top = Math.max(...counts);
      return C(`사과가 ${counts[0]}개, 귤이 ${counts[1]}개, 감이 ${counts[2]}개 있다. 가장 많은 과일은?`, fruits, counts.indexOf(top), {
        explain: `${counts.join(', ')} 중에서 가장 큰 수는 ${top}이다. ${josa(fruits[counts.indexOf(top)], '이/가')} 가장 많다.`, facts: { choose: { exprs: counts.map(String), rule: 'max' } }
      });
    }),
    T('cmp-max-min', '0이 있는 여러 수 중 가장 작은 수와 가장 큰 수', '①59 심42', (d) => {
      const list = d.shuffle([0].concat(some(d, range(1, 9), 4))), sorted = list.slice().sort((x, y) => x - y);
      return M('다음 수 중에서 가장 작은 수와 가장 큰 수는?', [{ label: '가장 작은 수', answer: sorted[0] }, { label: '가장 큰 수', answer: sorted[4] }], {
        figure: numbers(list), explain: `수를 순서대로 쓰면 ${sorted.join(', ')}이다. 가장 작은 수는 0, 가장 큰 수는 ${sorted[4]}이다.`, facts: { minOf: list }
      });
    }),
    T('cmp-pic-three', '그림 셋 가운데 수가 가장 적은 것', '①60 심42', (d) => {
      const kinds = some(d, KEYS, 3), lo = d.int(4, 6), counts = d.shuffle([lo, lo + 1, lo + 2 + d.int(0, 1)]), low = Math.min(...counts);
      return C('수가 가장 적은 것은?', kinds.map((kd) => KIND[kd].name), counts.indexOf(low), {
        figure: tiles(kinds.map((kd, i) => [KIND[kd].name, things(kd, counts[i])])), explain: `${kinds.map((kd, i) => KIND[kd].name + ' ' + counts[i] + '개').join(', ')}이다. 가장 작은 수는 ${low}이다.`,
        facts: { choose: { exprs: counts.map(String), rule: 'min' } }
      });
    }),
    T('cmp-only-above', '어떤 수보다 큰 수 고르기', '①61', (d) => {
      // 기준이 되는 수 자신을 고르는 아이가 있다.
      const t = d.int(3, 7), above = d.int(t + 1, Math.min(9, t + 2)), list = d.shuffle([t, above].concat(some(d, range(0, t - 1), 2)));
      return C(`${t}보다 큰 수는?`, list.map(String), list.indexOf(above), {
        explain: `수를 순서대로 쓸 때 ${t}보다 뒤에 있는 수가 ${t}보다 큰 수이다. ${josa(t, '은/는')} ${t}보다 큰 수가 아니다.`, facts: { only: { values: list, test: 'atLeast', target: t + 1 } }
      });
    }),
    T('cmp-count-below', '어떤 수보다 작은 수의 개수', '①61 심44', (d) => {
      const t = d.int(4, 7), list = d.until(() => some(d, range(1, 9).filter((v) => v !== t), 5), (vs) => { const k = vs.filter((v) => v < t).length; return k >= 2 && k <= 4; }), below = list.filter((v) => v < t);
      return N(`다음 수 중에서 ${t}보다 작은 수는 모두 몇 개인가?`, below.length, {
        unit: '개', figure: numbers(list), explain: `${t}보다 작은 수는 ${below.join(', ')}이다.`, facts: { big: { countIf: { values: list, test: 'below', target: t, i: 0 } } }
      });
    }),
    T('cmp-pairs-above', '어떤 수보다 큰 수끼리 짝 지은 것', '①62', (d) => {
      // 수와 읽는 말이 섞여 있다. 틀린 보기: 기준이 되는 수 자신이 든 것, 작은 수가 하나 든 것 둘
      const t = d.int(5, 7), up = range(t + 1, 9), down = range(1, t - 1), say = (v) => (d.bool() ? NATIVE : SINO)[v];
      const [x, y] = some(d, up, 2), make = () => d.shuffle([[`${say(x)}, ${y}`, true], [`${t}, ${say(d.pick(up))}`, false], [`${say(d.pick(down))}, ${d.pick(up)}`, false], [`${d.pick(up)}, ${say(d.pick(down))}`, false]]);
      const rows = d.until(make, (list) => new Set(list.map((row) => row[0])).size === 4);
      return C(`${t}보다 큰 수끼리 짝 지은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${t}보다 큰 수는 ${up.join(', ')}이다. ${josa(t, '은/는')} ${t}보다 큰 수가 아니다.`, facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('cmp-true', '수의 크기를 바르게 말한 것', '①63', (d) => {
      // 한 수를 두 수와 비교한 말이 섞여 있다. 앞쪽만 맞는 말, 0보다 작다고 한 말이 틀린 보기이다.
      const m = d.int(3, 7), lo = d.int(1, m - 1), hi = d.int(m + 1, 9), x = d.int(3, 9), p = d.int(1, 7), z = d.int(6, 9);
      const rows = d.shuffle([[`${josa(m, '은/는')} ${hi}보다 작고 ${lo}보다 크다.`, true], [`${josa(x, '은/는')} ${x - d.int(1, 2)}보다 작다.`, false], [`${josa(p, '은/는')} ${p + 1}보다 작고 ${p + 2}보다 크다.`, false], [`${josa(z, '은/는')} ${z - 1}보다 크고 0보다 작다.`, false]]);
      return C('수의 크기를 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `수를 순서대로 쓰면 ${lo}, ${m}, ${hi}의 차례이다. ${josa(m, '은/는')} ${lo}보다 크고 ${hi}보다 작다.`, facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('cmp-one-two', '1만큼 더 큰(작은) 수로 나타낸 두 수의 비교', '①64', (d) => {
      // 앞에 적힌 수만 보고 비교하면 틀리는 짝(5보다 1만큼 더 큰 수와 6보다 1만큼 더 작은 수)이 나온다.
      const a = d.int(2, 6), b = a + d.pick([1, 3]), rows = d.shuffle([[`${a}보다 1만큼 더 큰 수`, `${a}+1`, a + 1], [`${b}보다 1만큼 더 작은 수`, `${b}-1`, b - 1]]);
      return C('더 작은 수는?', LABELS.slice(0, 2), rows[0][2] < rows[1][2] ? 0 : 1, {
        figure: tagged(rows.map((row) => row[0])), explain: `㉠은 ${rows[0][2]}, ㉡은 ${rows[1][2]}이다. ${josa(Math.min(rows[0][2], rows[1][2]), '은/는')} ${Math.max(rows[0][2], rows[1][2])}보다 작다.`,
        facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'min' } }
      });
    }),
    T('cmp-order', '작은 수부터 차례로 쓰기', '①66', (d) => {
      const vals = some(d, range(1, 9), 4), right = [0, 1, 2, 3].sort((x, y) => vals[x] - vals[y]), back = right.slice().reverse();
      const list = d.shuffle([right, back, [right[1], right[0], right[2], right[3]], [right[0], right[1], right[3], right[2]]]);
      return C('작은 수부터 차례로 쓴 것은?', list.map((o) => o.map((i) => vals[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: numbers(vals), explain: `가장 작은 수는 ${vals[right[0]]}, 가장 큰 수는 ${vals[right[3]]}이다. 작은 수부터 쓰면 ${right.map((i) => vals[i]).join(', ')}이다.`,
        facts: { choose: { exprs: vals.map(String), rule: 'ascending', orders: list } }
      });
    }),
    T('cmp-order-names', '많이 가진 사람부터 차례로 쓰기', '심43', (d) => {
      const who = some(d, NAMES, 3), counts = some(d, range(3, 9), 3), right = [0, 1, 2].sort((x, y) => counts[y] - counts[x]);
      const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('색종이를 많이 가진 사람부터 차례로 쓴 것은?', list.map((o) => o.map((i) => who[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: table(['이름', '색종이의 수'], who.map((w, i) => [w, counts[i] + '장'])), explain: `큰 수부터 차례로 쓰면 ${right.map((i) => counts[i]).join(', ')}이다.`,
        facts: { choose: { exprs: counts.map(String), rule: 'descending', orders: list } }
      });
    }),
    T('cmp-second', '두 번째로 큰 수', '①67', (d) => {
      const vals = some(d, range(1, 9), 5), s = vals.slice().sort((x, y) => y - x), list = d.shuffle([s[0], s[1], s[2], s[4]]);
      return C('다음 수 중에서 두 번째로 큰 수는?', list.map(String), list.indexOf(s[1]), {
        figure: numbers(vals), explain: `큰 수부터 차례로 쓰면 ${s.join(', ')}이다. 두 번째로 큰 수는 ${s[1]}이다.`, facts: { rank: { values: list, nth: 2 } }
      });
    }),
    T('cmp-max-where', '가장 큰 수가 놓인 자리', '①68', (d) => {
      const row = some(d, range(1, 9), 7), top = Math.max(...row), p = row.indexOf(top) + 1, list = spots(d, 7, p);
      return C('가장 큰 수는 왼쪽에서 몇째에 있는가?', list.map((v) => NTH[v]), list.indexOf(p), {
        figure: numrow(row), explain: `가장 큰 수는 ${top}이다. ${josa(top, '은/는')} 왼쪽에서 ${NTH[p]}에 있다.`, facts: { truth: list.map((v) => v === p), want: true }
      });
    })
  ]);

  B.addGroup('1-1-1', {
    id: 'hard', title: '단원 종합', standard: NUM,
    types: [
      H('h-four-vs-fourth', '흩어져 있는 넷과 넷째', '12, 기본 ①17', (d) => {
        // ① 넷째 하나만 색칠한 줄을 고르는 아이(넷과 넷째), 붙어 있는 것만 세는 아이. 정답은 색칠한 것이 흩어져 있다.
        const k = d.int(3, 5), scattered = d.until(() => some(d, range(0, 8), k).sort((x, y) => x - y), (s) => s[0] > 0 && s[k - 1] - s[0] > k);
        const rows = d.shuffle([[scattered, k], [[k - 1], 1], [range(0, k - 2), k - 1], [range(0, k), k + 1]]);
        return C(`${q(NATIVE[k])}만큼 색칠한 것은?`, LABELS, rows.findIndex((row) => row[0] === scattered), {
          figure: tagged(rows.map((row) => strip(9, row[0]))), explain: `색칠한 것을 세면 ㉠부터 차례로 ${rows.map((row) => row[1]).join('개, ')}개이다. ${NTH[k]} 하나만 색칠한 것은 ${q(NATIVE[k])}이 아니라 ${q(NTH[k])}이다.`,
          facts: { choose: { exprs: rows.map((row) => String(row[1])), rule: 'equals', target: k } }
        });
      }),
      H('h-front-back', '앞에서 센 순서를 뒤에서 센 순서로', '기본 ①27', (d) => {
        // ② 같은 말을 그대로 고르는 아이, ③ 뒤에 남은 사람 수를 순서로 답하는 아이
        const n = d.int(7, 9), p = d.until(() => d.int(2, n - 1), (v) => v !== n + 1 - v), back = n + 1 - p, list = [];
        for (const v of [back, p, back - 1, back + 1, back - 2, back + 2]) if (v >= 1 && v <= n && !list.includes(v) && list.length < 4) list.push(v);
        const shown = d.shuffle(list);
        return C(`한 줄로 서 있다. 앞에서 ${NTH[p]}에 선 사람은 뒤에서 몇째인가?`, shown.map((v) => NTH[v]), shown.indexOf(back), {
          figure: queue(plain(n), { left: '앞', right: '뒤', what: `${n}명이 한 줄로 서 있다` }), explain: `그림에서 앞에서 ${NTH[p]}에 선 사람을 찾는다. 그 사람을 「뒤」에서부터 세면 ${NTH[back]}이다.`,
          facts: { truth: shown.map((v) => v === back), want: true }
        });
      }),
      H('h-facing', '앞이 오른쪽에 있는 줄', '17', (d) => {
        // ② 「앞」「뒤」를 보지 않고 왼쪽에서부터 세는 아이. 이 줄은 오른쪽 끝이 앞이다.
        const n = d.int(6, 7), who = some(d, NAMES, n), side = d.pick(['앞', '뒤']), k = d.int(2, 3), at = side === '뒤' ? k : n + 1 - k, list = spots(d, n, at);
        return C(`${side}에서 ${NTH[k]}로 서 있는 사람은 누구인가?`, list.map((v) => who[v - 1]), list.indexOf(at), {
          figure: queue(who.map((w, i) => ({ name: w, fill: '#e2e8f0' })), { left: '뒤', right: '앞', what: `${n}명이 한 줄로 서 있다` }),
          explain: `이 줄은 오른쪽 끝이 「앞」이다. 「${side}」에서부터 세면 ${NTH[k]}는 ${who[at - 1]}이다.`, facts: { truth: list.map((v) => v === at), want: true }
        });
      }),
      H('h-ahead', '순서와 앞에 선 사람의 수', '19, 기본 ①30', (d, n) => {
        // ③ 앞에 5명이 있으면 다섯째라고 답하는 아이, 일곱째이면 앞에 7명이라고 답하는 아이
        if (n === 0) {
          const who = d.pick(NAMES), k = d.int(3, 6), list = d.shuffle([k + 1, k, k - 1, k + 2]);
          return C(`9명이 한 줄로 서 있다. ${nick(who)} 앞에 ${k}명이 서 있다. ${name(who, '은/는')} 앞에서 몇째인가?`, list.map((v) => NTH[v]), list.indexOf(k + 1), {
            figure: queue(plain(9), { left: '앞', right: '뒤', what: '9명이 한 줄로 서 있다' }), explain: `앞에서부터 ${k}명을 세면 그다음 사람이 ${who}이다. ${NTH[k]} 다음은 ${NTH[k + 1]}이다.`,
            facts: { truth: list.map((v) => v === k + 1), want: true }
          });
        }
        const p = d.int(4, 8);
        return N(`9명이 한 줄로 서 있다. 앞에서 ${NTH[p]}에 선 사람 앞에는 몇 명이 서 있는가?`, p - 1, {
          unit: '명', figure: queue(plain(9), { left: '앞', right: '뒤', what: '9명이 한 줄로 서 있다' }), explain: `앞에서 ${NTH[p]}에 선 사람의 앞에는 첫째부터 ${NTH[p - 1]}까지 ${p - 1}명이 서 있다.`,
          facts: { inverse: ['x+b=a', p, 1] }
        });
      }, { count: 2 }),
      H('h-floor', '위에서 센 층', '기본 ①31', (d) => {
        // ② 층은 아래에서부터 센다. 위에서 셋째 층을 3층이라고 답하는 아이
        const n = d.int(5, 7), k = d.until(() => d.int(2, n - 1), (v) => v !== n + 1 - v);
        return N(`${n}층 건물이다. 위에서 ${NTH[k]} 층은 몇 층인가?`, n + 1 - k, {
          unit: '층', figure: building(n), explain: `층은 아래에서부터 1층, 2층, …으로 센다. 위에서 ${NTH[k]} 층은 아래에서 ${NTH[n + 1 - k]} 층이므로 ${n + 1 - k}층이다.`,
          facts: { calc: [[`${n}+1-${k}`, 0]], unseen: [1, k] }
        });
      }),
      H('h-between-count', '두 사람 사이에 선 사람의 수', '20, 기본 ①28', (d) => {
        // ② 한 사람은 앞에서, 한 사람은 뒤에서 센다. 그림에서 두 사람을 찾아 사이의 사람만 센다.
        const [p, r] = some(d, NAMES, 2), a = d.int(2, 4), b = d.int(2, 4), between = 10 - b - a - 1;
        return N(`9명이 한 줄로 서 있다. ${name(p, '은/는')} 앞에서 ${NTH[a]}, ${name(r, '은/는')} 뒤에서 ${NTH[b]}이다. 두 사람 사이에 서 있는 사람은 몇 명인가?`, between, {
          unit: '명', figure: queue(plain(9), { left: '앞', right: '뒤', what: '9명이 한 줄로 서 있다' }),
          explain: `${name(r, '은/는')} 뒤에서 ${NTH[b]}이므로 앞에서 세면 ${NTH[10 - b]}이다. ${NTH[a]}와 ${NTH[10 - b]} 사이에는 ${between}명이 서 있다.`,
          facts: { calc: [[`9+1-${b}-${a}-1`, 0]], unseen: [1, a, b] }
        });
      }),
      H('h-nth-read', '오른쪽에서 몇째에 있는 수 읽기', '18', (d) => {
        // ② 왼쪽에서 센 수를 읽은 말, 옆 칸의 수를 읽은 말이 틀린 보기이다.
        const k = d.pick([2, 3, 6, 7]), row = some(d, range(1, 9), 8), values = d.shuffle([row[8 - k], row[k - 1], row[8 - k - 1], row[8 - k + 1]]), form = values.map(() => d.bool());
        return C(`오른쪽에서 ${NTH[k]}에 있는 수를 바르게 읽은 것은?`, values.map((v, i) => (form[i] ? NATIVE : SINO)[v]), values.indexOf(row[8 - k]), {
          figure: numrow(row), explain: `「오른쪽」에서부터 세면 ${NTH[k]}에 있는 수는 ${row[8 - k]}이다. ${josa(row[8 - k], '은/는')} ${q(NATIVE[row[8 - k]])} 또는 ${q(SINO[row[8 - k]], '이라고/라고')} 읽는다.`,
          facts: { truth: values.map((v) => v === row[8 - k]), want: true }
        });
      }),
      H('h-sorted-nth', '순서대로 놓은 수를 오른쪽에서 세기', '21', (d) => {
        // 수를 스스로 늘어놓은 뒤 반대쪽에서 센다.
        const m = d.int(7, 9), k = d.int(2, 4);
        return N(`1부터 ${m}까지의 수를 왼쪽부터 순서대로 놓았다. 오른쪽에서 ${NTH[k]}에 놓인 수는?`, m + 1 - k, {
          explain: `왼쪽부터 ${range(1, m).join(', ')}${josa(m, '을/를').slice(1)} 놓는다. 오른쪽에서부터 세면 ${range(0, k - 1).map((i) => m - i).join(', ')}이므로 ${NTH[k]}에 놓인 수는 ${m + 1 - k}이다.`,
          facts: { calc: [[`${m}+1-${k}`, 0]], unseen: [k] }
        });
      }, SEQ),
      H('h-chain', '1만큼 더 큰(작은) 수를 거듭 구하기', '27, 기본 ①39', (d, n) => {
        if (n === 0) {
          const a = d.int(2, 7);
          return M('화살표를 따라 ㉠, ㉡에 알맞은 수를 쓰시오.', [{ label: LABELS[0], answer: a + 1 }, { label: LABELS[1], answer: a + 2 }], {
            figure: steps([a, LABELS[0], LABELS[1]], [MORE, MORE], ['right', 'right'], `${a}에서 화살표를 따라간다. ㉠은 ${a}보다 1만큼 더 큰 수, ㉡은 ㉠보다 1만큼 더 큰 수`),
            explain: `${a}보다 1만큼 더 큰 수는 ${a + 1}이다. ${a + 1}보다 1만큼 더 큰 수는 ${a + 2}이다.`, facts: { rule: 'up', calc: [[`${a}+1`, 0], [`${a}+1+1`, 1]] }
          });
        }
        // 0까지 내려간다.
        return M('화살표를 따라 ㉠, ㉡에 알맞은 수를 쓰시오.', [{ label: LABELS[0], answer: 1 }, { label: LABELS[1], answer: 0 }], {
          figure: steps([2, LABELS[0], LABELS[1]], [LESS, LESS], ['right', 'right'], '2에서 화살표를 따라간다. ㉠은 2보다 1만큼 더 작은 수, ㉡은 ㉠보다 1만큼 더 작은 수'),
          explain: '2보다 1만큼 더 작은 수는 1이다. 1보다 1만큼 더 작은 수는 0이다.', facts: { rule: 'down', calc: [['2-1', 0]] }
        });
      }, { count: 2, standard: ORDER }),
      H('h-reverse', '「■는 □보다 1만큼 더 큰 수」의 □', '29, 기본 ①43', (d) => {
        // ④ 「더 큰 수」라는 말만 보고 ㉠에 큰 수를, 「더 작은 수」라는 말만 보고 ㉡에 작은 수를 적는 아이
        const v = d.int(2, 8);
        return M(`${josa(v, '은/는')} ㉠보다 1만큼 더 큰 수이고, ㉡보다 1만큼 더 작은 수이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: v - 1 }, { label: LABELS[1], answer: v + 1 }], {
          explain: `${josa(v, '이/가')} ㉠보다 1만큼 더 큰 수이면 ㉠은 ${v}보다 1만큼 더 작은 수인 ${v - 1}이다. ${josa(v, '이/가')} ㉡보다 1만큼 더 작은 수이면 ㉡은 ${v}보다 1만큼 더 큰 수인 ${v + 1}이다.`,
          facts: { inverse: ['x+b=a', v, 1], calc: [[`${v}-1`, 0], [`${v}+1`, 1]] }
        });
      }, SEQ),
      H('h-right-more', '오른쪽 수가 1만큼 더 큰 짝', '30, 기본 ①45', (d) => {
        // ④ 어느 수가 기준인지 보지 않는 아이(왼쪽 수가 1만큼 더 큰 짝), 차례만 보는 아이(2만큼 벌어진 짝)
        const rows = d.until(() => { const x = d.int(1, 8), y = d.int(1, 8), z = d.int(1, 7), w = d.int(1, 7); return d.shuffle([[x, x + 1], [y + 1, y], [z, z + 2], [w + 2, w]]); }, (list) => new Set(list.map(String)).size === 4);
        return C('오른쪽 수가 왼쪽 수보다 1만큼 더 큰 것은?', rows.map((row) => row.join(', ')), rows.findIndex(([l, r]) => r === l + 1), {
          explain: `왼쪽 수보다 1만큼 더 큰 수가 오른쪽에 있어야 한다. ${rows.find(([l, r]) => r === l + 1)[0]}보다 1만큼 더 큰 수는 ${rows.find(([l, r]) => r === l + 1)[1]}이다.`,
          facts: { claimed: rows.map(([l, r]) => [`${r}-${l}`, 1]), claimedWant: true }
        });
      }, SEQ),
      H('h-story-reverse', '「1개 더 많다」로 말한 사람의 상대', '기본 ①49', (d) => {
        // ④ 「더 많다」는 말만 보고 1만큼 더 큰 수를 답하는 아이
        const [p, r] = some(d, NAMES, 2), n = d.int(4, 9);
        return N(`${name(p, '은/는')} ${nick(r)}보다 구슬이 1개 더 많다. ${name(p, '의/의')} 구슬은 ${n}개이다. ${name(r, '의/의')} 구슬은 몇 개인가?`, n - 1, {
          unit: '개', explain: `${name(p, '이/가')} 1개 더 많으므로 ${name(r, '은/는')} ${nick(p)}보다 1개 더 적다. ${n}보다 1만큼 더 작은 수는 ${n - 1}이다.`,
          facts: { inverse: ['x+b=a', n, 1], calc: [[`${n}-1`, 0]] }
        });
      }, SEQ),
      H('h-story-two', '1개 더 많고, 다시 1개 더 적은 수', '33', (d) => {
        const [p, r, s] = some(d, NAMES, 3), n = d.int(3, 8);
        return N(`${name(p, '은/는')} 딱지가 ${n}개 있다. ${name(r, '은/는')} ${nick(p)}보다 1개 더 많다. ${name(s, '은/는')} ${nick(r)}보다 1개 더 적다. ${name(s, '의/의')} 딱지는 몇 개인가?`, n, {
          unit: '개', explain: `${name(r, '은/는')} ${n}보다 1만큼 더 큰 수인 ${n + 1}개, ${name(s, '은/는')} ${n + 1}보다 1만큼 더 작은 수인 ${n}개이다.`, facts: { calc: [[`${n}+1-1`, 0]] }
        });
      }, SEQ),
      H('h-story-three', '세 사람 가운데 가장 많이 가진 사람', '34', (d) => {
        // 세 수를 차례로 구한 뒤 비교한다. 셋째 사람의 수는 둘째 사람의 수에 기댄다. 말에 적힌 수가 가장 큰 사람이 가장 많은 것은 아니다.
        const who = some(d, NAMES, 3), b = d.int(2, 5), a = b + d.pick([1, 4]), values = [a - 1, b + 1, b + 2];
        return C('사탕을 가장 많이 가진 사람은?', who, values.indexOf(Math.max(...values)), {
          figure: lines([`${name(who[0], '은/는')} ${a}개보다 1개 더 적게 가지고 있다.`, `${name(who[1], '은/는')} ${b}개보다 1개 더 많이 가지고 있다.`, `${name(who[2], '은/는')} ${nick(who[1])}보다 1개 더 많이 가지고 있다.`]),
          explain: `${name(who[0], '은/는')} ${values[0]}개, ${name(who[1], '은/는')} ${values[1]}개, ${name(who[2], '은/는')} ${values[2]}개를 가지고 있다. 가장 큰 수는 ${Math.max(...values)}이다.`,
          facts: { choose: { exprs: [`${a}-1`, `${b}+1`, `${b}+1+1`], rule: 'max' } }
        });
      }, SEQ),
      H('h-big-few', '큰 것 몇 개와 작은 것 몇 개', '40, 기본 ①56', (d) => {
        // ⑤ 자리를 많이 차지하는 쪽이 더 많다고 여기는 아이. 큰 공이 더 넓게 놓여 있지만 수는 작은 공이 더 많다.
        const a = d.int(2, 4), b = a + d.int(1, 2), bigFirst = d.bool();
        const big = things('ball', a, { r: 12, gap: 29, cols: a, label: `큰 공 ${a}개` }), small = things('ball', b, { r: 5, gap: 14, cols: b, pad: 7, label: `작은 공 ${b}개` });
        return C('공의 수가 더 많은 것은?', LABELS.slice(0, 2), bigFirst ? 1 : 0, {
          figure: tiles(bigFirst ? [[LABELS[0], big], [LABELS[1], small]] : [[LABELS[0], small], [LABELS[1], big]]),
          explain: `큰 공은 ${a}개, 작은 공은 ${b}개이다. ${josa(b, '은/는')} ${a}보다 크므로 작은 공이 더 많다. 공의 크기는 수와 상관없다.`,
          facts: { choose: { exprs: bigFirst ? [String(a), String(b)] : [String(b), String(a)], rule: 'max' } }
        });
      }, SEQ),
      H('h-order-three', '1만큼 더 큰(작은) 수로 나타낸 세 수의 차례', '46, 기본 ①65', (d) => {
        // 셋을 수로 바꾼 뒤 차례를 정한다. 앞에 적힌 수의 차례와 나타내는 수의 차례가 다를 수 있다.
        const make = () => some(d, range(2, 8), 3).map((v) => (d.bool() ? [`${v - 1}보다 1만큼 더 큰 수`, `${v - 1}+1`, v] : [`${v + 1}보다 1만큼 더 작은 수`, `${v + 1}-1`, v]));
        const rows = d.until(make, (list) => new Set(list.map((row) => row[1].slice(-2))).size === 2), right = [0, 1, 2].sort((x, y) => rows[x][2] - rows[y][2]);
        const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
        return C('㉠, ㉡, ㉢을 작은 수부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
          figure: tagged(rows.map((row) => row[0])), explain: `㉠은 ${rows[0][2]}, ㉡은 ${rows[1][2]}, ㉢은 ${rows[2][2]}이다. 작은 수부터 쓰면 ${right.map((i) => rows[i][2]).join(', ')}이다.`,
          facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'ascending', orders: list } }
        });
      }, SEQ),
      H('h-between-cards', '두 수 사이에 있는 수의 개수', '기본 ①69', (d) => {
        // ⑥ 두 끝의 수까지 넣어 세는 아이. 두 끝의 수도 카드에 들어 있다.
        const lo = d.int(2, 4), hi = lo + d.int(3, 4), inside = range(lo + 1, hi - 1), kept = some(d, inside, d.int(1, inside.length - 1)).sort((x, y) => x - y);
        const outside = some(d, range(0, 9).filter((v) => v < lo || v > hi), 4 - kept.length), cards = d.shuffle([lo, hi].concat(kept, outside));
        return N(`다음 수 중에서 ${josa(lo, '과/와')} ${hi} 사이에 있는 수는 모두 몇 개인가?`, kept.length, {
          unit: '개', figure: numbers(cards), explain: `${josa(lo, '과/와')} ${hi} 사이에 있는 수는 ${inside.join(', ')}이다. 이 가운데 적혀 있는 수는 ${kept.join(', ')}이다. ${josa(lo, '과/와')} ${josa(hi, '은/는')} 사이에 있는 수가 아니다.`,
          facts: { tallyOf: { list: cards.map((v) => (v > lo && v < hi ? '사이' : '밖')), target: '사이' } }
        });
      }, SEQ),
      H('h-hidden', '가려진 자리까지 이어 세기', '22, 기본 ①32', (d) => {
        // 보이는 수 하나에서 가려진 칸을 지나 ㉠까지 이어 센다(㉠이 왼쪽에 있으면 거꾸로 센다).
        const s = d.int(1, 3), values = range(s, s + 6), i = d.int(0, 6), j = d.until(() => d.int(0, 6), (v) => Math.abs(v - i) >= 2 && Math.abs(v - i) <= 3), gap = Math.abs(j - i);
        const path = range(0, gap).map((step) => values[i] + (j > i ? step : -step));
        return N('수를 순서대로 놓고 몇 칸을 가렸다. ㉠에 알맞은 수는?', values[j], {
          figure: numrow(values.map((v, at) => (at === i ? v : at === j ? LABELS[0] : null)), '수를 순서대로 놓고 몇 칸을 가렸다'),
          explain: `${values[i]}에서 ${j > i ? '오른쪽으로 순서대로' : '왼쪽으로 순서를 거꾸로 하여'} 세면 ${path.join(', ')}이다. ㉠은 ${values[j]}이다.`,
          facts: { calc: [[`${values[i]}${j > i ? '+' : '-'}${gap}`, 0]], unseen: [gap] }
        });
      }, SEQ)
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
