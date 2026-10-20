// 1학년 2학기 1단원 100까지의 수 — 수의 크기 비교, 짝수와 홀수의 기본 문항과 실력 문항.
// 단원 틀·그림 도구·싣는 기준·뺀 꼴은 1-2-1a.js 머리에 적었다. 꼴 번호: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//   ㉮ 낱개가 10개를 넘어도 묶음의 수와 낱개의 수를 그대로 이어 쓴다(10개씩 묶음 6개와 낱개 13개를 613, 또는 63으로).
//   ㉯ 모형 조각이 많이 보이는 쪽, 낱개의 수가 큰 쪽(59와 61에서 59)을 더 큰 수로 여긴다.
//   ㉰ 몇십에서 1만큼 더 작은 수를 구할 때 10개씩 묶음의 수는 그대로 두거나(80 → 81·89), 묶음째 하나를 줄인다(80 → 70).
//   ㉱ 「1만큼 더 큰 수」라는 말이 보이면 거꾸로 구해야 할 때도 1을 더 센다.
//   ㉲ 「사이에 있는 수」「~보다 크고 ~보다 작은 수」에 두 끝의 수를 넣어 센다.
//   ㉳ 가려진 숫자가 있으면 무조건 비교할 수 없다고 여기거나, 보이는 숫자끼리만 견준다.
//   ㉴ 칠십셋·일흔삼처럼 두 가지 읽는 방법을 섞어도 수만 맞으면 바른 읽기라고 여긴다.
//   ㉵ 둘씩 묶은 그림에서 물건이 아니라 묶음을 센다.
// 실력 문항은 이 오개념에 걸리는 장치를 둔 것(①)과 두 번 넘게 생각해야 하는 것(②)만 실었다. 이 학년은 실력 문항이 적어도 된다.
//
// 짝수와 홀수의 수는 모두 20 이하이다(교육과정: 「짝수와 홀수는 20 이하의 수의 범위에서 다루고 … 둘씩 묶어 보는 활동을 통하여 … 직관적으로 이해하게 한다」).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, tagged, numbers, cards, table, josa, N, M, C } = B.kit, G = B.kit.geo;
  const { SINO_TENS, SINO_ONES, NAT_TENS, NAT_ONES, tenOf, sino, nat, either, readWord, wordValue, valueOfText, quoted, kindWord, readBoth, rods, trays, things, pairs, grid, versus } = B.kit.g121;
  const COUNT = '2수01-01', PLACE = '2수01-02', ORDER = '2수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SIGNS = ['&gt;', '&lt;'], TAGS = ['가', '나', '다'];
  const sign = (a, b) => (a > b ? '&gt;' : '&lt;');
  const ONES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const twoTens = (d) => d.shuffle([5, 6, 7, 8, 9]).slice(0, 2).sort((x, y) => x - y);
  const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const isOdd = (v) => v % 2 === 1;

  B.addTypes('1-2-1', 'compare', [
    T('cmp-how', '두 수의 크기를 비교하는 방법', '①38', (d) => {
      const rows = d.shuffle([['10개씩 묶음의 수가 다르면 10개씩 묶음의 수가 큰 수가 더 크다.', true], ['10개씩 묶음의 수가 다르면 낱개의 수가 큰 수가 더 크다.', false], ['10개씩 묶음의 수가 같으면 낱개의 수가 작은 수가 더 크다.', false], ['10개씩 묶음의 수가 같으면 두 수의 크기는 같다.', false]]);
      return C('두 수의 크기를 비교하는 방법으로 바른 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: '10개씩 묶음의 수가 큰 수가 더 크다. 10개씩 묶음의 수가 같으면 낱개의 수가 큰 수가 더 크다.', facts: { truth: rows.map((row) => row[1]), want: true } });
    }),
    T('cmp-sign', '두 수의 크기를 >, <로 나타내기', '①34 심20', (d, i) => {
      // 차례: 10개씩 묶음의 수가 다른 두 수(작은 쪽의 낱개가 더 많다) / 10개씩 묶음의 수가 같은 두 수
      let a, b;
      if (i === 0) { const [lo, hi] = twoTens(d); [a, b] = d.shuffle([lo * 10 + d.int(6, 9), hi * 10 + d.int(0, 4)]); } else { const t = d.int(5, 9), [o1, o2] = d.shuffle(ONES); a = t * 10 + o1; b = t * 10 + o2; }
      const big = Math.max(a, b), small = Math.min(a, b);
      return C('두 수의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, a > b ? 0 : 1, {
        figure: versus(a, b), explain: (i === 0 ? `10개씩 묶음이 ${josa(big, '은/는')} ${tenOf(big)}개, ${josa(small, '은/는')} ${tenOf(small)}개이다. 10개씩 묶음이 많은 ${josa(big, '이/가')} 더 크다.` : `10개씩 묶음의 수가 같으므로 낱개의 수를 비교한다. 낱개가 많은 ${josa(big, '이/가')} 더 크다.`) + ` ${a} ${sign(a, b)} ${b}`,
        facts: { rule: ['tensDiffer', 'tensSame'][i], choose: { exprs: [String(a), String(b)], rule: 'max' } }
      });
    }, { count: 2 }),
    T('cmp-read-sign', '>, <를 읽은 말 고르기', '①35 심20', (d) => {
      const [lo, hi] = twoTens(d), small = lo * 10 + d.int(1, 9), big = hi * 10 + d.int(1, 9), less = d.bool(), [x, y] = less ? [small, big] : [big, small], word = less ? '작다' : '크다';
      const rows = d.shuffle([[x, y, word], [x, y, less ? '크다' : '작다'], [y, x, word]]), truth = rows.map(([p, q, w]) => (w === '크다' ? p > q : p < q));
      return C(`${x} ${sign(x, y)} ${josa(y, '을/를')} 바르게 읽은 것은?`, rows.map(([p, q, w]) => `${josa(p, '은/는')} ${q}보다 ${w}.`), truth.indexOf(true), {
        explain: `${x} ${sign(x, y)} ${josa(y, '은/는')} ${quoted(`${josa(x, '은/는')} ${y}보다 ${word}`, '이라고/라고')} 읽는다.`, facts: { truth, want: true }
      });
    }),
    T('cmp-blocks', '연결 모형을 세어 두 수 비교하기', '①36', (d) => {
      // 10개씩 묶음의 수가 같은 두 수, 또는 묶음이 하나 차이 나고 낱개는 비슷한 두 수(낱개가 훨씬 많아 보이는 쪽이 더 작은 그림은 실력에 있다)
      let p, q;
      if (d.bool()) { const t = d.int(5, 9), [o1, o2] = d.shuffle(ONES); p = [t, o1]; q = [t, o2]; } else { const t = d.int(5, 8), o = d.int(2, 6); [p, q] = d.shuffle([[t, o], [t + 1, o + d.pick([-1, 0, 1])]]); }
      const a = p[0] * 10 + p[1], b = q[0] * 10 + q[1];
      return C('더 큰 수를 나타내는 것은?', TAGS.slice(0, 2), a > b ? 0 : 1, {
        figure: G.tiles([['가', rods(p[0], p[1], 1.2)], ['나', rods(q[0], q[1], 1.2)]]), explain: `가는 ${a}, 나는 ${b}이다. ${p[0] === q[0] ? '10개씩 묶음의 수가 같으므로 낱개가 많은' : '10개씩 묶음이 많은'} ${a > b ? '가' : '나'}가 더 크다.`,
        facts: { choose: { exprs: [p, q].map(([t, o]) => `10*${t}+${o}`), rule: 'max' } }
      });
    }),
    T('cmp-true', '바르게 비교한 것 고르기', '①37 심20', (d) => {
      // 틀린 보기: 두 숫자가 뒤바뀐 짝(78 > 87), 묶음의 수가 같은 짝(97 > 99), 낱개가 큰 쪽을 크다고 한 것(81 < 79)
      const rows = d.until(() => {
        const [lo, hi] = twoTens(d), [t, o] = twoTens(d), s = d.int(5, 9), [o1, o2] = d.shuffle(ONES).slice(0, 2).sort((x, y) => x - y), [lo2, hi2] = twoTens(d);
        const good = d.bool() ? [lo * 10 + d.int(5, 9), '<', hi * 10 + d.int(1, 4)] : [hi * 10 + d.int(1, 4), '>', lo * 10 + d.int(5, 9)];
        return d.shuffle([good, [t * 10 + o, '>', o * 10 + t], [s * 10 + o1, '>', s * 10 + o2], [hi2 * 10 + d.int(1, 4), '<', lo2 * 10 + d.int(6, 9)]]);
      }, (list) => new Set(list.map((row) => row.join(' '))).size === 4);
      const truth = rows.map(([l, s, r]) => (s === '>' ? l > r : l < r)), [l, s, r] = rows[truth.indexOf(true)];
      return C('두 수의 크기를 바르게 비교한 것은?', rows.map((row) => `${row[0]} ${row[1] === '>' ? '&gt;' : '&lt;'} ${row[2]}`), truth.indexOf(true), {
        explain: `10개씩 묶음이 ${josa(l, '은/는')} ${tenOf(l)}개, ${josa(r, '은/는')} ${tenOf(r)}개이므로 ${l} ${s === '>' ? '&gt;' : '&lt;'} ${josa(r, '이/가')} 바르다.`, facts: { truth, want: true }
      });
    }),
    T('cmp-max', '세 수 가운데 가장 큰 수', '①38 심21', (d) => {
      // 낱개가 9인 수(10개씩 묶음은 하나 적다)를 섞는다
      const t = d.int(6, 9), [a, b] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]), vals = d.shuffle([t * 10 + a, t * 10 + b, (t - 1) * 10 + 9]), top = Math.max(...vals);
      return C('가장 큰 수는?', vals.map(String), vals.indexOf(top), { explain: `10개씩 묶음이 ${t}개인 ${josa(t * 10 + a, '과/와')} ${t * 10 + b} 가운데 낱개가 많은 ${josa(top, '이/가')} 가장 크다.`, facts: { choose: { exprs: vals.map(String), rule: 'max' } } });
    }),
    T('cmp-min', '다섯 수 가운데 가장 작은 수', '①38', (d) => {
      // 10개씩 묶음이 가장 적은 수는 낱개가 많고(59), 바로 위 묶음의 수는 낱개가 적다(61)
      const t = d.int(5, 6), low = t * 10 + d.int(7, 9), near = (t + 1) * 10 + d.int(0, 3);
      const rest = d.until(() => [0, 1, 2].map(() => d.int(t + 1, 9) * 10 + d.int(0, 9)), (v) => new Set(v.concat([near])).size === 4), vals = d.shuffle([low, near].concat(rest));
      return C('가장 작은 수는?', vals.map(String), vals.indexOf(low), { explain: `10개씩 묶음이 ${t}개인 수는 ${low}뿐이다. 10개씩 묶음이 가장 적은 ${josa(low, '이/가')} 가장 작다.`, facts: { choose: { exprs: vals.map(String), rule: 'min' } } });
    }),
    T('cmp-order3', '세 수를 차례로 늘어놓기', '①39', (d, i) => {
      // 차례: 작은 수부터 / 큰 수부터
      const t = d.int(6, 8), [a, b] = d.shuffle(ONES), vals = d.shuffle([t * 10 + a, t * 10 + b, (t + d.pick([-1, 1])) * 10 + d.int(1, 9)]);
      const right = [0, 1, 2].sort((p, q) => (i === 0 ? vals[p] - vals[q] : vals[q] - vals[p])), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C(`${i === 0 ? '작은' : '큰'} 수부터 차례로 기호를 쓴 것은?`, list.map((o) => o.map((k) => LABELS[k]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(vals.map(String)), explain: `10개씩 묶음의 수를 먼저 비교하고, 같으면 낱개의 수를 비교한다. ${i === 0 ? '작은' : '큰'} 수부터 차례로 쓰면 ${right.map((k) => vals[k]).join(', ')}이다.`,
        facts: { choose: { exprs: vals.map(String), rule: i === 0 ? 'ascending' : 'descending', orders: list } }
      });
    }, { count: 2 }),
    T('cmp-order5', '다섯 수를 큰 수부터 늘어놓기', '심22', (d) => {
      const t = d.int(5, 9), vals = d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5).map((o) => t * 10 + o), nth = d.int(2, 4), sorted = vals.slice().sort((x, y) => y - x);
      return C(`다섯 수를 큰 수부터 차례로 쓸 때 ${['', '첫째', '둘째', '셋째', '넷째'][nth]}에 쓰는 수는?`, vals.map(String), vals.indexOf(sorted[nth - 1]), {
        figure: numbers(vals), explain: `10개씩 묶음의 수가 모두 같으므로 낱개의 수를 비교한다. 큰 수부터 차례로 쓰면 ${sorted.join(', ')}이다.`, facts: { rank: { values: vals, nth } }
      });
    }),
    T('cmp-above-pick', '읽는 말이 섞인 보기에서 기준보다 큰 수', '①40', (d) => {
      // 맞는 수는 읽는 말로 적는다. 틀린 보기: 묶음의 수가 같고 낱개가 적은 수, 묶음이 하나 적고 낱개가 많은 수
      const t = d.int(6, 8), o = d.int(3, 6), target = t * 10 + o, right = t * 10 + d.int(o + 1, 9);
      const vals = d.shuffle([right, t * 10 + d.int(1, o - 1), (t - 1) * 10 + d.int(7, 9), (t - 1) * 10 + d.int(1, 6)]), styles = d.shuffle(['수', '말', '말']), at = vals.indexOf(right);
      const opts = vals.map((v, k) => (k === at || styles[k > at ? k - 1 : k] === '말' ? either(d, v) : String(v))), values = opts.map(valueOfText);
      return C(`${target}보다 큰 수는?`, opts, at, { explain: `수로 쓰면 차례로 ${values.join(', ')}이다. ${target}보다 큰 수는 ${right}이다.`, facts: { only: { values, test: 'atLeast', target: target + 1 } } });
    }),
    T('cmp-count', '기준 수보다 큰(작은) 수의 개수', '①40·41', (d) => {
      const t = d.int(6, 8), target = t * 10 + d.int(3, 6), above = d.bool(), hit = (x) => (above ? x > target : x < target);
      const vals = d.until(() => d.shuffle([t * 10 + d.int(0, 9), t * 10 + d.int(0, 9), (t - 1) * 10 + d.int(6, 9), (t + 1) * 10 + d.int(0, 4), d.int(5, 9) * 10 + d.int(0, 9), d.int(5, 9) * 10 + d.int(0, 9)]),
        (v) => new Set(v).size === 6 && !v.includes(target) && v.filter(hit).length >= 2 && v.filter(hit).length <= 4 && v.some((x) => tenOf(x) === t && x > target) && v.some((x) => tenOf(x) === t && x < target));
      return N(`${target}보다 ${above ? '큰' : '작은'} 수는 모두 몇 개인가?`, vals.filter(hit).length, {
        unit: '개', figure: numbers(vals), explain: `${target}보다 ${above ? '큰' : '작은'} 수는 ${vals.filter(hit).join(', ')}이다.`, facts: { big: { countIf: { values: vals, test: above ? 'above' : 'below', target, i: 0 } } }
      });
    }),
    T('cmp-word2', '두 수를 비교하는 문장제', '①42 심23', (d) => {
      const [x, y, unit] = d.pick([['동화책', '위인전', '권'], ['빨간 구슬', '파란 구슬', '개'], ['사과', '배', '개']]);
      let a, b;
      if (d.bool()) { const t = d.int(5, 9), [o1, o2] = d.shuffle(ONES); a = t * 10 + o1; b = t * 10 + o2; } else { const [lo, hi] = twoTens(d); [a, b] = d.shuffle([lo * 10 + d.int(6, 9), hi * 10 + d.int(0, 4)]); }
      return C(`${josa(x, '이/가')} ${a}${unit}, ${josa(y, '이/가')} ${b}${unit} 있다. 더 많은 것은?`, [x, y], a > b ? 0 : 1, {
        explain: `${a} ${sign(a, b)} ${b}이므로 ${josa(a > b ? x : y, '이/가')} 더 많다.`, facts: { choose: { exprs: [String(a), String(b)], rule: 'max' } }
      });
    }),
    T('cmp-word3', '세 수를 비교하는 문장제', '①43 심23', (d) => {
      const names = d.shuffle(NAMES).slice(0, 3), most = d.bool(), t = d.int(6, 8), [a, b] = d.shuffle(ONES), vals = d.shuffle([t * 10 + a, t * 10 + b, (t + d.pick([-1, 1])) * 10 + d.int(1, 9)]);
      const best = most ? Math.max(...vals) : Math.min(...vals);
      return C(`세 사람이 줄넘기를 넘은 수이다. 줄넘기를 가장 ${most ? '많이' : '적게'} 넘은 사람은?`, names, vals.indexOf(best), {
        figure: lines(names.map((who, k) => `${who} ${vals[k]}번`)), explain: `${most ? '큰' : '작은'} 수부터 차례로 쓰면 ${vals.slice().sort((p, q) => (most ? q - p : p - q)).join(', ')}이다. ${josa(best, '이/가')} 가장 ${most ? '크다' : '작다'}.`,
        facts: { choose: { exprs: vals.map(String), rule: most ? 'max' : 'min' } }
      });
    })
  ]);

  B.addTypes('1-2-1', 'evenodd', [
    T('eo-meaning', '짝수와 홀수의 뜻', '①47', (d) => {
      const even = d.bool(), opts = ['짝수', '홀수'];
      return C(`둘씩 짝을 지을 때 ${even ? '남는 것이 없는' : '하나가 남는'} 수를 무엇이라고 하는가?`, opts, even ? 0 : 1, { explain: '둘씩 짝을 지을 때 남는 것이 없는 수를 짝수, 하나가 남는 수를 홀수라고 한다.', facts: { truth: opts.map((o) => o === (even ? '짝수' : '홀수')), want: true } });
    }),
    T('eo-count-picture', '그림을 세어 짝수인지 홀수인지 알기', '①48 심29', (d) => {
      // 틀린 보기: 수는 맞게 세고 짝수·홀수를 바꾼 것, 하나 더 세거나 덜 센 것
      const n = d.int(8, 15), figure = things(n, '구슬'), shown = Number(figure.match(/구슬 (\d+)개/)[1]);
      const rows = d.shuffle([[n, kindWord(n)], [n, kindWord(n + 1)], [n + 1, kindWord(n + 1)], [n - 1, kindWord(n - 1)]]), truth = rows.map(([v, w]) => v === shown && w === (isOdd(v) ? '홀수' : '짝수'));
      return C('구슬의 수를 세어 바르게 말한 것은?', rows.map(([v, w]) => `${v}, ${w}`), truth.indexOf(true), {
        figure, explain: `구슬은 ${n}개이다. 둘씩 짝을 지으면 ${isOdd(n) ? '하나가 남으므로 홀수' : '남는 것이 없으므로 짝수'}이다.`, facts: { truth, want: true }
      });
    }),
    T('eo-pairs-picture', '둘씩 짝 지은 그림으로 짝수와 홀수 가르기', '①49', (d) => {
      const n = d.int(7, 19);
      return C(`구슬 ${n}개를 둘씩 짝 지었다. ${josa(n, '은/는')} 짝수인가, 홀수인가?`, ['짝수', '홀수'], n % 2, {
        figure: pairs(n, '구슬'), explain: `둘씩 짝을 지으면 ${isOdd(n) ? '하나가 남는다' : '남는 것이 없다'}. ${josa(n, '은/는')} ${kindWord(n)}이다.`, facts: { pick: { expr: `${n}%2+1`, options: [1, 2] }, unseen: [1, 2] }
      });
    }),
    T('eo-statements', '짝수와 홀수를 바르게 말한 것', '①50', (d) => {
      const vals = d.shuffle(range(6, 20)).slice(0, 4), at = d.int(0, 3), rows = vals.map((v, k) => [v, k === at ? kindWord(v) : kindWord(v + 1)]), [v, w] = rows[at];
      return C('바르게 말한 것은?', rows.map((row) => `${josa(row[0], '은/는')} ${row[1]}이다.`), at, {
        explain: `${josa(v, '은/는')} 둘씩 짝을 지으면 ${isOdd(v) ? '하나가 남으므로' : '남는 것이 없으므로'} ${w}이다.`, facts: { claimed: rows.map((row) => [`${row[0]}%2`, row[1] === '홀수' ? 1 : 0]), claimedWant: true }
      });
    }),
    T('eo-pick', '여러 수에서 홀수(짝수) 고르기', '①51 심30', (d, i) => {
      // 차례: 홀수 하나 고르기 / 짝수 하나 고르기
      const odd = i === 0, evens = d.shuffle([6, 8, 10, 12, 14, 16, 18, 20]), odds = d.shuffle([7, 9, 11, 13, 15, 17, 19]);
      const vals = d.shuffle(odd ? evens.slice(0, 3).concat([odds[0]]) : odds.slice(0, 3).concat([evens[0]])), at = vals.findIndex((v) => isOdd(v) === odd);
      return C(`${odd ? '홀수' : '짝수'}는 어느 것인가?`, vals.map(String), at, {
        explain: `${josa(vals[at], '은/는')} 둘씩 짝을 지으면 ${odd ? '하나가 남는다' : '남는 것이 없다'}. 나머지는 모두 ${odd ? '짝수' : '홀수'}이다.`, facts: { choose: { exprs: vals.map((v) => `${v}%2+1`), rule: 'equals', target: odd ? 2 : 1 }, unseen: [1, 2] }
      });
    }, { count: 2 }),
    T('eo-count', '홀수(짝수)의 개수', '①52 심30', (d) => {
      const odd = d.bool(), hit = (v) => isOdd(v) === odd, vals = d.until(() => d.shuffle(range(3, 20)).slice(0, 5), (v) => v.filter(hit).length >= 2 && v.filter(hit).length <= 3);
      return N(`${odd ? '홀수' : '짝수'}는 모두 몇 개인가?`, vals.filter(hit).length, {
        unit: '개', figure: numbers(vals), explain: `${odd ? '홀수' : '짝수'}는 ${vals.filter(hit).join(', ')}이다.`, facts: { calc: [[vals.map((v) => (odd ? `${v}%2` : `(1-${v}%2)`)).join('+'), 0]], unseen: [1, 2] }
      });
    }),
    T('eo-groups', '짝수끼리(홀수끼리) 모인 것 고르기', '①53', (d) => {
      // 틀린 보기: 하나만 다른 것, 둘이 다른 것, 모두 다른 것
      const even = d.bool(), E = d.shuffle([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]), O = d.shuffle([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]), same = even ? E : O, diff = even ? O : E;
      const rows = d.shuffle([[same[0], same[1], same[2]], d.shuffle([same[3], same[4], diff[0]]), d.shuffle([same[5], diff[1], diff[2]]), [diff[3], diff[4], diff[5]]]), at = rows.findIndex((row) => row.every((v) => isOdd(v) !== even));
      return C(`${even ? '짝수' : '홀수'}만 모여 있는 것은?`, rows.map((row) => row.join(', ')), at, {
        explain: `${rows[at].join(', ')}${josa(rows[at][2], '은/는').slice(String(rows[at][2]).length)} 모두 ${even ? '짝수' : '홀수'}이다. 나머지에는 ${even ? '홀수' : '짝수'}가 섞여 있다.`,
        facts: { choose: { exprs: rows.map((row) => row.map((v) => (even ? `(1-${v}%2)` : `(${v}%2)`)).join('*') + '+1'), rule: 'equals', target: 2 }, unseen: [1, 2] }
      });
    }),
    T('eo-picture-groups', '개수가 홀수(짝수)인 그림 고르기', '①54', (d) => {
      const odd = d.bool(), E = d.shuffle([4, 6, 8]), O = d.shuffle([5, 7, 9]), ks = d.shuffle(odd ? [O[0], E[0], E[1]] : [E[0], O[0], O[1]]), at = ks.findIndex((k) => isOdd(k) === odd);
      return C(`사과의 수가 ${odd ? '홀수' : '짝수'}인 접시는?`, TAGS, at, {
        figure: G.tiles(ks.map((k, j) => [TAGS[j], things(k, '사과', { pitch: 12, scale: 1 })])), explain: `사과는 차례로 ${ks.join('개, ')}개이다. ${josa(ks[at], '은/는')} 둘씩 짝을 지으면 ${odd ? '하나가 남으므로 홀수' : '남는 것이 없으므로 짝수'}이다.`,
        facts: { choose: { exprs: ks.map((k) => `${k}%2+1`), rule: 'equals', target: odd ? 2 : 1 }, unseen: [1, 2] }
      });
    }),
    T('eo-one-less', '하나가 줄면 짝수와 홀수가 바뀐다', '①55', (d) => {
      const n = d.int(9, 16);
      return C('풍선이 그림과 같이 있다. 풍선 1개가 터지면 남는 풍선의 수는 짝수인가, 홀수인가?', ['짝수', '홀수'], (n - 1) % 2, {
        figure: things(n, '풍선'), explain: `풍선은 ${n}개이다. 1개가 터지면 ${n - 1}개가 남는다. ${josa(n - 1, '은/는')} ${kindWord(n - 1)}이다.`, facts: { pick: { expr: `(${n}-1)%2+1`, options: [1, 2] }, unseen: [2] }
      });
    })
  ]);

  B.addGroup('1-2-1', {
    id: 'hard', title: '단원 종합', standard: PLACE,
    types: [
      H('h-over-ten-picture', '낱개가 10개를 넘는 그림의 수', '기본 ①19', (d) => {
        // ① 묶음의 수와 낱개의 수를 이어 쓰거나(613), 낱개의 일부만 세는 아이가 틀린다(㉮)
        const t = d.int(5, 8), o = d.int(11, 19), n = t * 10 + o;
        return N('연결 모형을 10개씩 묶은 것과 낱개가 있다. 연결 모형은 모두 몇 개인가?', n, {
          unit: '개', figure: rods(t, o), explain: `낱개 ${o}개는 10개씩 묶음 1개와 낱개 ${o - 10}개이다. 10개씩 묶음 ${t + 1}개와 낱개 ${o - 10}개이므로 ${n}이다.`, facts: { calc: [[`10*${t}+${o}`, 0]] }
        });
      }),
      H('h-over-ten-word', '낱개가 20개를 넘는 문장제', '기본 ①19', (d) => {
        // ① 낱개 20개를 10개씩 묶음 2개로 바꾸어야 한다(㉮)
        const t = d.int(5, 7), o = 20 + d.int(1, 9), n = t * 10 + o;
        return N(`딱지가 10장씩 ${t}묶음과 낱개 ${o}장 있다. 딱지는 모두 몇 장인가?`, n, {
          unit: '장', explain: `낱개 ${o}장은 10장씩 묶음 2개와 낱개 ${o - 20}장이다. 10장씩 묶음 ${t + 2}개와 낱개 ${o - 20}장이므로 ${n}이다.`, facts: { calc: [[`10*${t}+${o}`, 0]] }
        });
      }),
      H('h-take-bundles', '묶음째 덜어 내고 남은 수', '10, 기본 ①20', (d) => {
        // ② 묶음의 수만 줄이고 낱개는 그대로 둔 다음 다시 수로 쓴다
        const t = d.int(6, 9), o = d.int(1, 9), k = d.int(2, 3), left = (t - k) * 10 + o;
        return N(`사탕이 10개씩 ${t}봉지와 낱개 ${o}개 있다. 그중 ${k}봉지를 먹었다. 남은 사탕은 몇 개인가?`, left, {
          unit: '개', explain: `${k}봉지를 먹으면 10개씩 ${t - k}봉지와 낱개 ${o}개가 남는다. 10개씩 묶음 ${t - k}개와 낱개 ${o}개는 ${left}이다.`, facts: { calc: [[`10*(${t}-${k})+${o}`, 0]] }
        });
      }),
      H('h-more-bundles', '몇십이 되려면 더 있어야 하는 묶음의 수', '11', (d) => {
        // ② 그림과 몇십을 모두 10개씩 묶음의 수로 바꾸어 비교한다
        const a = d.int(5, 7), b = a + d.int(2, 3);
        return N(`달걀이 그림과 같이 있다. 달걀이 ${b * 10}개가 되려면 10개씩 묶음이 몇 개 더 있어야 하는가?`, b - a, {
          unit: '개', figure: trays(a, 0), explain: `그림의 달걀은 10개씩 묶음 ${a}개이다. ${josa(b * 10, '은/는')} 10개씩 묶음 ${b}개이므로 묶음이 ${b - a}개 더 있어야 한다.`, facts: { calc: [[`${b * 10}/10-${a}`, 0]] }
        });
      }),
      H('h-read-mixed', '두 가지 읽는 방법을 섞어 읽은 것', '5', (d) => {
        // ① 수는 맞게 나타냈지만 칠십셋·일흔삼처럼 두 읽기를 섞은 것(㉴). 맞는 보기에는 쉰·예순처럼 낯선 우리말 읽기가 섞여 있어, 낯선 말을 틀렸다고 여기는 아이가 그것을 고른다.
        const tens = d.shuffle([5, 6, 7, 8, 9]), at = d.int(0, 3);
        const rows = [0, 1, 2, 3].map((k) => { const t = tens[k], o = d.until(() => d.int(1, 9), (v) => v !== t), x = t * 10 + o; return [x, k === at ? (d.bool() ? SINO_TENS[t] + NAT_ONES[o] : NAT_TENS[t] + SINO_ONES[o]) : k % 2 ? nat(x) : sino(x)]; });
        const truth = rows.map(([x, w]) => readWord(w).kind !== 'mixed' && wordValue(w) === x), [x, w] = rows[truth.indexOf(false)];
        return C('수를 읽는 방법이 잘못된 것은?', rows.map((row) => `${row[0]} — ${row[1]}`), truth.indexOf(false), { explain: `${quoted(w, '은/는')} 두 가지 읽는 방법을 섞은 말이다. ${readBoth(x)}`, facts: { truth, want: false } });
      }, { standard: COUNT }),
      H('h-unknown-next-prev', '어떤 수를 구해 1만큼 더 작은 수 구하기', '18', (d) => {
        // ② 거꾸로 한 번, 바로 한 번
        const m = d.int(6, 9) * 10 + d.int(0, 1);
        return N(`어떤 수보다 1만큼 더 큰 수는 ${m}이다. 어떤 수보다 1만큼 더 작은 수는?`, m - 2, { explain: `어떤 수는 ${m}보다 1만큼 더 작은 ${m - 1}이다. ${m - 1}보다 1만큼 더 작은 수는 ${m - 2}이다.`, facts: { calc: [[`${m}-1-1`, 0]] } });
      }, { standard: ORDER }),
      H('h-between-count', '~보다 크고 ~보다 작은 수의 개수', '24', (d) => {
        // ① 두 끝의 수(75, 83)와 바로 바깥의 수를 섞는다. 끝의 수까지 세는 아이가 틀린다(㉲)
        const a = d.int(5, 8) * 10 + d.int(4, 7), b = a + d.int(5, 8), inside = d.shuffle(range(a + 1, b - 1)).slice(0, d.int(2, 3));
        const vals = d.shuffle(inside.concat(inside.length === 2 ? [a, b, a - 1, b + 1] : [a, b, d.bool() ? a - 1 : b + 1])), flags = vals.map((v) => v > a && v < b);
        return N(`${a}보다 크고 ${b}보다 작은 수는 모두 몇 개인가?`, inside.length, {
          unit: '개', figure: numbers(vals), explain: `${a}보다 크고 ${b}보다 작은 수는 ${vals.filter((v, k) => flags[k]).join(', ')}이다. ${josa(a, '과/와')} ${josa(b, '은/는')} 들지 않는다.`, facts: { count: flags }
        });
      }, { standard: ORDER }),
      H('h-three-forms', '다르게 나타낸 세 수 가운데 가장 큰 수', '25', (d) => {
        // ② 묶음과 낱개, 1만큼 더 작은 수, 읽는 말로 준 수를 모두 수로 바꾼 뒤 비교한다
        const t = d.int(6, 8), [v0, v1, v2] = d.shuffle([-3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3).map((k) => t * 10 + k), w = nat(v2 - 1);
        const rows = d.shuffle([[`10개씩 묶음 ${tenOf(v0)}개와 낱개 ${v0 % 10}개인 수`, `10*${tenOf(v0)}+${v0 % 10}`, v0], [`${v1 + 1}보다 1만큼 더 작은 수`, `${v1 + 1}-1`, v1], [`${w}보다 1만큼 더 큰 수`, `${wordValue(w)}+1`, v2]]);
        const top = Math.max(v0, v1, v2);
        return C('가장 큰 수는?', LABELS.slice(0, 3), rows.findIndex((row) => row[2] === top), {
          figure: tagged(rows.map((row) => row[0])), explain: `수로 쓰면 ㉠은 ${rows[0][2]}, ㉡은 ${rows[1][2]}, ㉢은 ${rows[2][2]}이다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'max' }, unseen: [wordValue(w)] }
        });
      }, { standard: ORDER }),
      H('h-cards', '수 카드 두 장으로 만드는 가장 큰(작은) 몇십몇', '26', (d, i) => {
        // ② 차례: 가장 큰 수 / 가장 작은 수. 10개씩 묶음의 수가 크기를 정하므로 가장 큰(작은) 수를 묶음의 수로, 그다음 수를 낱개의 수로 놓는다
        const digits = d.shuffle([5, 6, 7, 8, 9]).slice(0, 3), s = digits.slice().sort((x, y) => x - y), [first, second] = i === 0 ? [s[2], s[1]] : [s[0], s[1]];
        return N(`수 카드 3장 가운데 2장을 골라 몇십몇을 만든다. 만들 수 있는 가장 ${i === 0 ? '큰' : '작은'} 수는?`, first * 10 + second, {
          figure: cards(digits), explain: `10개씩 묶음의 수가 ${i === 0 ? '클수록 큰' : '작을수록 작은'} 수이다. 가장 ${i === 0 ? '큰' : '작은'} ${josa(first, '을/를')} 10개씩 묶음의 수로, 그다음으로 ${i === 0 ? '큰' : '작은'} ${josa(second, '을/를')} 낱개의 수로 하면 ${first * 10 + second}이다.`,
          facts: { calc: [[`10*${first}+${second}`, 0]], unseen: [10] }
        });
      }, { count: 2, standard: ORDER }),
      H('h-hidden-ones', '낱개의 수가 가려진 수와 크기 비교', '27', (d, i) => {
        // ① 차례: 묶음의 수만으로 정해지는 경우 / 정해지지 않는 경우(㉳)
        //   앞: 가려져 있으니 알 수 없다고 하는 아이, 낱개 9가 보이는 수를 고르는 아이가 틀린다.  뒤: 보이는 숫자만 보고 한쪽을 고르는 아이가 틀린다.
        const t = d.int(6, 9), known = String(i === 0 ? (t - 1) * 10 + d.int(7, 9) : t * 10 + d.int(3, 6)), hidden = `${t}□`, flip = d.bool(), [left, right] = flip ? [known, hidden] : [hidden, known];
        const show = (text) => text.replace('□', box()), mine = flip ? '㉡' : '㉠', other = flip ? '㉠' : '㉡';
        return C('□ 안에는 0부터 9까지의 수가 들어갈 수 있다. ㉠과 ㉡ 가운데 더 큰 수는?', ['㉠', '㉡', '알 수 없다.'], i === 1 ? 2 : flip ? 1 : 0, {
          figure: tagged([show(left), show(right)]),
          explain: i === 0 ? `10개씩 묶음이 ${mine}은 ${t}개, ${other}은 ${t - 1}개이다. 10개씩 묶음의 수가 다르므로 낱개의 수를 몰라도 ${mine}이 더 크다.` : `두 수 모두 10개씩 묶음이 ${t}개이다. 낱개의 수를 비교해야 하는데 □ 안의 수를 모르므로 알 수 없다.`,
          facts: { rule: ['decided', 'open'][i], big: { boxedPair: { left, right, signs: ['>', '<', '?'] } } }
        });
      }, { count: 2, standard: ORDER }),
      H('h-hidden-table', '낱개의 수가 가려진 수가 섞인 표에서 가장 적은 사람', '27', (d) => {
        // ① 가려진 수를 찾으려 들지 않고 10개씩 묶음의 수만 본다(㉳). 바로 위 묶음의 수는 낱개를 0~2로 적어 낱개만 보는 아이가 그것을 고른다.
        const names = d.shuffle(NAMES).slice(0, 4), tens = d.shuffle([5, 6, 7, 8, 9]).slice(0, 4), low = Math.min(...tens), hide = d.shuffle([true, true, false, false]);
        const cells = tens.map((t, k) => (hide[k] ? `${t}□` : String(t * 10 + (t === low ? d.int(6, 9) : t === low + 1 ? d.int(0, 2) : d.int(1, 9)))));
        // 가려진 수는 낱개가 0일 때부터 9일 때까지이다. 가장 클 때에도 다른 사람의 가장 작을 때보다 작으면 가장 적다.
        const least = cells.map((c) => Number(c.replace('□', '0'))), most = cells.map((c) => Number(c.replace('□', '9'))), truth = cells.map((_, k) => cells.every((__, j) => j === k || most[k] < least[j]));
        return C('네 사람이 가진 구슬의 수이다. □ 안의 수는 보이지 않는다. 구슬이 가장 적은 사람은?', names, truth.indexOf(true), {
          figure: table(['이름', '구슬의 수(개)'], names.map((who, k) => [who, cells[k].replace('□', box())])), explain: `10개씩 묶음의 수는 차례로 ${tens.join('개, ')}개이다. 10개씩 묶음이 ${low}개로 가장 적은 ${names[tens.indexOf(low)]}의 구슬이 가장 적다.`, facts: { truth, want: true }
        });
      }, { standard: ORDER }),
      H('h-box-count', '□ 안에 들어갈 수 있는 수의 개수', '기본 ①45', (d) => {
        // ② 묶음의 수가 같음을 보고 → 낱개의 수를 비교하고 → 들어갈 수 있는 수를 센다
        const t = d.int(5, 9), o = d.int(3, 6), n = t * 10 + o, less = d.bool(), fits = less ? range(o + 1, 9) : range(0, o - 1);
        return N('0부터 9까지의 수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', fits.length, {
          unit: '개', figure: lines([`${n} ${less ? '&lt;' : '&gt;'} ${t}${box()}`]),
          explain: `두 수는 10개씩 묶음이 ${t}개로 같다. 낱개의 수가 ${o}보다 ${less ? '커야' : '작아야'} 하므로 □ 안에는 ${fits.join(', ')}${josa(fits[fits.length - 1], '이/가').slice(1)} 들어갈 수 있다.`,
          facts: { digit: { template: `${n}${less ? '<' : '>'}${t}□`, lo: 0, hi: 9, ask: 'count' } }
        });
      }, { standard: ORDER }),
      H('h-cmp-looks', '낱개가 많아 보이지만 더 작은 수', '기본 ①36', (d) => {
        // ① 모형 조각이 많은 그림, 낱개가 많은 그림을 고르는 아이가 틀린다(㉯). 가장 큰 수는 낱개가 한두 개뿐이다.
        const t = d.int(5, 7), top = [t + 1, d.int(1, 2)], list = d.shuffle([top, [t, 9], [t, d.int(6, 8)]]), at = list.indexOf(top), vals = list.map(([a, b]) => a * 10 + b);
        return C('가장 큰 수를 나타내는 것은?', TAGS, at, {
          figure: G.tiles(list.map(([a, b], k) => [TAGS[k], rods(a, b, 1.15)])), explain: `가는 ${vals[0]}, 나는 ${vals[1]}, 다는 ${vals[2]}이다. 낱개가 적어도 10개씩 묶음이 가장 많은 ${TAGS[at]}가 가장 크다.`,
          facts: { choose: { exprs: list.map(([a, b]) => `10*${a}+${b}`), rule: 'max' } }
        });
      }, { standard: ORDER }),
      H('h-chart-sparse', '수가 조금만 적힌 수 배열표', '기본 ①28', (d) => {
        // ② 적힌 수에서 여러 칸을 건너 센다: ㉠은 적힌 수의 바로 아래 칸, ㉡은 끝 칸에서 거꾸로 센다
        const s = d.pick([51, 61, 71]), p = d.int(2, 6), r = d.int(5, 7), tags = {};
        tags[10 + p] = LABELS[0]; tags[20 + r] = LABELS[1];
        return M('수 배열표에 수가 조금만 적혀 있다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: s + 10 + p }, { label: LABELS[1], answer: s + 20 + r }], {
          figure: grid(s, 30, 10, [p, p + 1, 29], tags),
          explain: `한 줄에 10칸이므로 ${s + p}에서 순서대로 10칸을 세면 바로 아래 칸이다. ㉠은 ${s + p + 10}이다. ㉡은 ${s + 29}에서 거꾸로 ${9 - r}칸을 세어 ${s + 20 + r}이다.`,
          facts: { calc: [[`${s}+${10 + p}`, 0], [`${s}+${20 + r}`, 1]] }
        });
      }, { standard: ORDER }),
      H('h-pairs-left', '둘씩 묶은 그림에서 하나가 남는 수', '기본 ①49', (d) => {
        // ① 구슬이 아니라 묶음과 남는 것을 하나씩 세는 아이는 6·8·10(짝수)이라고 한다(㉵). 남는 하나를 빼고 세는 아이, 수는 맞게 세고 짝수라 하는 아이의 보기도 둔다.
        const p = d.pick([5, 7, 9]), n = p * 2 + 1, figure = pairs(n, '구슬'), m = figure.match(/묶음 (\d+)개, 남는 것 (\d+)개/), shown = Number(m[1]) + Number(m[1]) + Number(m[2]);
        const rows = d.shuffle([[n, '홀수'], [n, '짝수'], [p + 1, kindWord(p + 1)], [n - 1, '짝수']]), truth = rows.map(([v, w]) => v === shown && w === (isOdd(v) ? '홀수' : '짝수'));
        return C('구슬을 둘씩 묶었다. 구슬의 수를 바르게 말한 것은?', rows.map(([v, w]) => `${v}, ${w}`), truth.indexOf(true), {
          figure, explain: `둘씩 세면 ${range(1, p).map((k) => k * 2).join(', ')}이고 1개가 남으므로 구슬은 ${n}개이다. 하나가 남으므로 홀수이다.`, facts: { truth, want: true }
        });
      }, { standard: COUNT }),
      H('h-between-even', '두 수 사이에 있는 짝수(홀수)의 개수', '32', (d) => {
        // ② 사이의 수를 늘어놓고 → 짝수·홀수를 가르고 → 센다. 두 끝의 수도 짝수(홀수)라서 끝의 수까지 세는 아이가 틀린다(㉲). 수는 20 이하이다.
        const odd = d.bool(), gap = d.pick([6, 8, 10]), a = d.until(() => d.int(4, 20 - gap), (v) => isOdd(v) === odd), b = a + gap, between = range(a + 1, b - 1), flags = between.map((v) => isOdd(v) === odd);
        return N(`${josa(a, '과/와')} ${b} 사이에 있는 수 가운데 ${odd ? '홀수' : '짝수'}는 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', explain: `${josa(a, '과/와')} ${b} 사이에 있는 수는 ${a + 1}부터 ${b - 1}까지이다. 이 가운데 ${odd ? '홀수' : '짝수'}는 ${between.filter((v, k) => flags[k]).join(', ')}이다.`, facts: { count: flags }
        });
      }, { standard: COUNT })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
