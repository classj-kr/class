// 1학년 1학기 3단원 덧셈과 뺄셈 — 기본 문항(뺄셈식 · 뺄셈하기 · 0이 있는 덧셈과 뺄셈 · 덧셈과 뺄셈)과 실력 문항.
// 꼴 번호: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번. 싣는 기준과 뺀 것은 1-1-3a.js 머리에 적었다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 문항은 여기서 나온다)
//  - 낱말만 보고 식을 세운다: 「모두」가 있으면 더하고 「남은」「더 적게」가 있으면 뺀다.
//  - 「~보다 몇 개 더 많은가」를 「더 많은」만 보고 더한다(비교하기는 뺄셈이다).
//  - 뺄셈식의 빼는 수가 덜어 낸 수라는 것을 모르고, 그림에 나오는 수로 된 옳은 식이면 다 그림에 맞는 식이라고 여긴다.
//  - 「차」를 「앞의 수 − 뒤의 수」로만 안다(차는 큰 수에서 작은 수를 뺀 것이다).
//  - 0을 더하거나 빼면 0이 된다고 여기고, 같은 수끼리 빼면 그 수가 남는다고 여긴다. 수 카드의 0을 수로 치지 않는다.
//  - 가르기는 두 쪽에 모두 무엇인가 있어야 한다고 여긴다(한쪽이 0일 수 있다).
// 실력 문항의 잣대: ① 상황·그림의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제, ② 두 번 넘게 생각해야 풀리는 문제.
// 이 단원의 실력 문항은 h-chain(②) 하나를 빼고 모두 ①이다. 세 수를 잇달아 셈하는 문장제는 1학년 2학기 것이라 싣지 않았다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, cards, chain, lines, tagged, numbers, N, M, C, E, shown } = B.kit;
  const G = B.kit.geo;
  const { T, ORDERS, upTo, two, gap, labelled, joinSay, splitSay, plusSay, sumSay, minusSay, diffSay, scene, PAIRS, GONE, group, duo, pairRows, taken, plain, dotBond, plates, MEAN } = B.kit.g113;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const value = ([x, op, y]) => (op === '+' ? x + y : x - y);
  const term = ([x, op, y]) => expr(x, op, y);
  // ○ 가 낀 식: a ○ b = c
  const ringed = (a, b, c) => `<span class="mb-expr">${a} <span class="mb-ring" style="width:1.25em;height:1.25em;vertical-align:-0.28em"></span> ${b} <i>=</i> ${c}</span>`;
  const orderChoice = (d) => d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));

  // ── 뺄셈식 쓰고 읽기 ─────────────────────────────────────────
  B.addTypes('1-1-3', 'minus', [
    T('minus-write', '덜어 내는 그림을 보고 뺄셈식 쓰기', '①31 ①32 심29', (d) => {
      const theme = d.pick(GONE), [t, k] = gap(d, (x) => x >= 4);
      return M('×표 한 것을 덜어 낸다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([t, k, t - k]), {
        figure: taken(theme, t, k) + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', box(LABELS[2])),
        explain: `${theme.name} ${t}개에서 ×표 한 ${k}개를 덜어 내면 ${t - k}개가 남는다. ${shown(t, '-', k)}`, facts: { calc: [[String(t), 0], [String(k), 1], [E(t, '-', k), 2]] }
      });
    }),
    T('minus-compare', '비교하는 그림을 보고 뺄셈식 쓰기', '①33 심33', (d) => {
      const theme = d.pick(PAIRS), [p, q] = gap(d), flip = d.bool(), a = flip ? q : p, b = flip ? p : q, more = a > b ? theme.a[0] : theme.b[0];
      return M('어느 쪽이 몇 개 더 많은지 구한다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([p, q, p - q]), {
        figure: pairRows(theme, a, b) + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', box(LABELS[2])),
        explain: `하나씩 짝 지으면 ${josa(more, '이/가')} ${p - q}개 남는다. ${shown(p, '-', q)}`, facts: { calc: [[String(p), 0], [String(q), 1], [E(p, '-', q), 2]] }
      });
    }),
    T('minus-pick', '그림에 알맞은 뺄셈식 고르기', '①34 심30', (d) => {
      // 보기는 모두 옳은 계산이다. 처음 수와 덜어 낸 수를 그림에서 읽어야 한다.
      const theme = d.pick(GONE), [t, k] = gap(d, (x, y) => x >= 5 && x <= 8 && y >= 2 && x - y >= 2 && x - y !== y + 1);
      const rows = d.shuffle([[t, k], [t, k + 1], [t + 1, k], [t - 1, k - 1]]);
      return C('×표 한 것을 덜어 낸다. 그림에 알맞은 뺄셈식은?', rows.map(([x, y]) => expr(x, '-', y, '=', x - y)), rows.findIndex(([x, y]) => x === t && y === k), {
        figure: taken(theme, t, k), explain: `${josa(theme.name, '은/는')} ${t}개이고 ×표 한 것은 ${k}개이다. ${shown(t, '-', k)}`, facts: { truth: rows.map(([x, y]) => x === t && y === k), want: true }
      });
    }),
    T('minus-story-pick', '이야기에 알맞은 뺄셈식 고르기', '①34', (d) => {
      // 틀린 보기: 덧셈으로 구한 식, 수가 다른 뺄셈식
      const [t, k] = gap(d, (x, y) => x >= 4 && x + y <= 9 && x - y >= 2);
      const [story, asked] = d.pick([[`버스에 ${t}명이 타고 있다. ${k}명이 내렸다.`, '남은 사람의 수'], [`접시에 과자가 ${t}개 있다. ${k}개를 먹었다.`, '남은 과자의 수'], [`나무에 새가 ${t}마리 앉아 있다. ${k}마리가 날아갔다.`, '남은 새의 수']]);
      const rows = d.shuffle([[t, '-', k], [t, '+', k], [t, '-', k + 1]]);
      return C(`${story} ${asked}를 구하는 식은?`, rows.map((row) => expr(row[0], row[1], row[2], '=', value(row))), rows.findIndex(([x, op, y]) => op === '-' && y === k), {
        explain: `있던 것에서 덜어 내므로 뺀다. ${shown(t, '-', k)}`, facts: { truth: rows.map(([x, op, y]) => op === '-' && x === t && y === k), want: true }
      });
    }),
    T('minus-unrelated', '그림에 알맞지 않은 식이나 말 고르기', '①35', (d) => {
      // 틀린 것도 계산은 옳고 그림에 나오는 수만 쓴다. 그림과 맞춰 보아야 가려진다.
      const theme = d.pick(GONE), [t, k] = gap(d, (x, y) => x >= 5 && y !== x - y), r = t - k, big = Math.max(k, r), small = Math.min(k, r);
      const rows = d.shuffle([[expr(t, '-', k, '=', r), true], [minusSay(t, k, r), true], [diffSay(t, k, r), true], [d.bool() ? expr(big, '-', small, '=', big - small) : minusSay(big, small, big - small), false]]);
      return C('×표 한 것을 덜어 낸다. 그림에 알맞지 않은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), {
        figure: taken(theme, t, k), explain: `${theme.name} ${t}개에서 ${k}개를 덜어 내는 그림이다. ${shown(t, '-', k)}`, facts: { truth: rows.map((row) => row[1]), want: false }
      });
    }),
    T('minus-read', '뺄셈식을 읽은 말 고르기', '①36 ①31', (d) => {
      const [t, k] = gap(d, (x, y) => y !== x - y), r = t - k, right = d.bool() ? minusSay(t, k, r) : diffSay(t, k, r);
      const rows = d.shuffle([right].concat(d.shuffle([plusSay(t, k, r), sumSay(t, k, r), minusSay(r, k, t), diffSay(k, r, t)]).slice(0, 3)));
      return C('뺄셈식을 바르게 읽은 것은?', rows, rows.indexOf(right), {
        figure: expr(t, '-', k, '=', r), explain: `「${minusSay(t, k, r)}」 또는 「${diffSay(t, k, r)}」로 읽는다.`, facts: { truth: rows.map((row) => row === right), want: true }
      });
    }),
    T('minus-say', '읽은 말을 뺄셈식으로 나타내기', '①36', (d) => {
      // 틀린 보기: 빼는 수와 차를 바꾼 식, 덧셈식, 더하기로 읽은 식
      const [t, k] = gap(d, (x, y) => y !== x - y), r = t - k;
      const rows = d.shuffle([[t, '-', k, r], [t, '-', r, k], [k, '+', r, t], [t, '+', k, r]]);
      const good = ([x, op, y, z]) => op === '-' && x === t && y === k && z === r;
      return C('다음을 뺄셈식으로 나타낸 것은?', rows.map(([x, op, y, z]) => expr(x, op, y, '=', z)), rows.findIndex(good), {
        figure: lines([d.bool() ? minusSay(t, k, r) : diffSay(t, k, r)]), explain: shown(t, '-', k), facts: { truth: rows.map(good), want: true }
      });
    }),
    T('minus-hidden', '그림에 보이지 않는 것을 말로 준 뺄셈', '심32', (d) => {
      // 처음 수는 그림에서 세고 빼는 수는 글에서 읽는다.
      const theme = d.pick(GONE), [t, k] = gap(d, (x) => x >= 5);
      return N(`그림의 ${theme.name} 가운데 ${k}${theme.past}. 남은 ${josa(theme.name, '은/는')} 몇 개인가?`, t - k, {
        unit: '개', figure: plain(theme, t), explain: `그림의 ${josa(theme.name, '은/는')} ${t}개이다. ${shown(t, '-', k)}`, facts: { calc: [[E(t, '-', k), 0]] }
      });
    })
  ]);

  // ── 뺄셈하기 ─────────────────────────────────────────────────
  B.addTypes('1-1-3', 'sub', [
    T('sub-row', '뺄셈식 계산', '①37 심37', (d) => {
      const [a, b] = gap(d);
      return N('다음을 계산하시오.', a - b, { figure: expr(a, '-', b, '=', box()), explain: shown(a, '-', b), facts: { calc: [[E(a, '-', b), 0]], rule: 'sub' } });
    }),
    T('sub-pic', '그림을 보고 뺄셈하기', '①38', (d) => {
      const theme = d.pick(GONE), [t, k] = gap(d, (x) => x >= 4);
      return N('그림을 보고 뺄셈을 하시오.', t - k, {
        figure: taken(theme, t, k) + expr(t, '-', k, '=', box()), explain: `${theme.name} ${t}개에서 ×표 한 ${k}개를 빼면 ${t - k}개가 남는다. ${shown(t, '-', k)}`, facts: { calc: [[E(t, '-', k), 0]] }
      });
    }),
    T('sub-arrow', '화살표를 따라 빼기', '심34', (d) => {
      const [a, b] = gap(d);
      return N('□ 안에 알맞은 수는?', a - b, { figure: chain([a, '-' + b, box()]), explain: shown(a, '-', b), facts: { calc: [[E(a, '-', b), 0]] } });
    }),
    T('sub-step', '빼는 수가 1씩 커지는 뺄셈', '심36 ①51', (d) => {
      const a = d.int(5, 9), k = d.int(1, a - 3), rows = [k, k + 1, k + 2];
      return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled(rows.map((v) => a - v)), {
        figure: lines(rows.map((v, i) => expr(a, '-', v, '=', box(LABELS[i])))), explain: `빼는 수가 1씩 커지면 차는 1씩 작아진다. ${rows.map((v) => shown(a, '-', v)).join(', ')}`,
        facts: { calc: rows.map((v, i) => [E(a, '-', v), i]) }
      });
    }),
    T('sub-chain', '화살표를 따라 두 번 빼기', '심35', (d) => {
      // 칸마다 따로 답한다(앞 칸의 답에서 다시 뺀다).
      const a = d.int(6, 9), b = d.int(1, a - 3), c = d.int(1, a - b - 1);
      return M('㉠, ㉡에 알맞은 수는?', labelled([a - b, a - b - c]), {
        figure: chain([a, '-' + b, box(LABELS[0]), '-' + c, box(LABELS[1])]), explain: `${shown(a, '-', b)}, ${shown(a - b, '-', c)}`, facts: { calc: [[`${a}-${b}`, 0], [`${a}-${b}-${c}`, 1]] }
      });
    }),
    T('sub-wrong', '계산이 잘못된 뺄셈식', '①39', (d) => {
      const rows = d.until(() => Array.from({ length: 4 }, () => gap(d)), (list) => new Set(list.map(String)).size === 4);
      const bad = d.int(0, 3), said = rows.map(([x, y], i) => x - y + (i === bad ? (x - y > 1 && d.bool() ? -1 : 1) : 0));
      return C('계산이 잘못된 것은?', rows.map(([x, y], i) => expr(x, '-', y, '=', said[i])), bad, {
        explain: `바르게 계산하면 ${shown(rows[bad][0], '-', rows[bad][1])}이다.`, facts: { claimed: rows.map(([x, y], i) => [E(x, '-', y), said[i]]), claimedWant: false }
      });
    }),
    T('sub-odd', '차가 나머지와 다른 식', '①40 심39', (d) => {
      const v = d.int(1, 5), w = v + (v > 1 && d.bool() ? -1 : 1), y = d.int(1, 9 - w);
      const rows = d.shuffle(d.shuffle(upTo(9 - v)).slice(0, 3).map((b) => [b + v, b]).concat([[y + w, y]]));
      return C('차가 나머지와 다른 것은?', rows.map(([p, q]) => expr(p, '-', q)), rows.findIndex(([p, q]) => p - q !== v), {
        explain: rows.map(([p, q]) => shown(p, '-', q)).join(', '), facts: { choose: { exprs: rows.map(([p, q]) => E(p, '-', q)), rule: 'odd' } }
      });
    }),
    T('sub-same', '차가 같은 두 식', '①41', (d) => {
      const rows = d.until(() => Array.from({ length: 4 }, () => gap(d)), (list) => new Set(list.map(String)).size === 4 && new Set(list.map(([x, y]) => x - y)).size === 3);
      const values = rows.map(([x, y]) => x - y), right = [0, 1, 2, 3].filter((i) => values.filter((v) => v === values[i]).length === 2);
      const all = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
      const list = d.shuffle(d.shuffle(all.filter((p) => p.join() !== right.join())).slice(0, 3).concat([right]));
      return C('차가 같은 두 식은?', list.map((p) => p.map((i) => LABELS[i]).join(', ')), list.findIndex((p) => p.join() === right.join()), {
        figure: tagged(rows.map(([x, y]) => expr(x, '-', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${shown(x, '-', y)}`).join(', '),
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '-', y)), rule: 'same', pairsShown: list } }
      });
    }),
    T('sub-min', '차가 가장 작은 식', '심38', (d) => {
      const rows = d.until(() => Array.from({ length: 4 }, () => gap(d)), (list) => { const v = list.map(([x, y]) => x - y).sort((p, q) => p - q); return v[0] < v[1] && v[3] - v[0] <= 3 && new Set(list.map(String)).size === 4; });
      const values = rows.map(([x, y]) => x - y);
      return C('차가 가장 작은 것은?', rows.map(([x, y]) => expr(x, '-', y)), values.indexOf(Math.min(...values)), {
        explain: rows.map(([x, y]) => shown(x, '-', y)).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '-', y)), rule: 'min' } }
      });
    }),
    T('sub-count', '계산 결과가 같은 식의 수', '심40', (d) => {
      const v = d.int(2, 4), hits = d.int(2, 4), right = d.shuffle(upTo(9 - v)).slice(0, hits).map((y) => [y + v, y]);
      const wrong = d.until(() => Array.from({ length: 6 - hits }, () => gap(d, (x, y) => x - y !== v && Math.abs(x - y - v) <= 2)), (list) => new Set(list.map(String)).size === list.length);
      const rows = d.shuffle(right.concat(wrong));
      return N(`계산 결과가 ${v}인 식은 모두 몇 개인가?`, hits, {
        unit: '개', figure: numbers(rows.map(([x, y]) => `${x} − ${y}`)), explain: `계산 결과가 ${v}인 식은 ${rows.filter(([x, y]) => x - y === v).map(([x, y]) => `${x} − ${y}`).join(', ')}이다.`,
        facts: { count: rows.map(([x, y]) => x - y === v) }
      });
    }),
    T('sub-pattern', '차가 같은 뺄셈식의 빈칸', '①42', (d) => {
      // (v+1)−1, (v+2)−2, (v+3)−3, (v+4)−4 — 둘째 줄부터 두 줄에 빈칸을 하나씩 둔다.
      const v = d.int(2, 5), holes = d.shuffle([1, 2, 3]).slice(0, 2).sort(), front = [d.bool(), d.bool()], rows = [0, 1, 2, 3].map((i) => [v + 1 + i, 1 + i]);
      return M(`차가 ${v}인 뺄셈식을 차례로 썼다. ㉠, ㉡에 알맞은 수는?`, labelled(holes.map((h, k) => rows[h][front[k] ? 0 : 1])), {
        figure: lines(rows.map(([x, y], i) => { const k = holes.indexOf(i); return k < 0 ? expr(x, '-', y, '=', v) : front[k] ? expr(box(LABELS[k]), '-', y, '=', v) : expr(x, '-', box(LABELS[k]), '=', v); })),
        explain: `앞의 수와 뒤의 수가 똑같이 1씩 커진다. ${holes.map((h) => shown(rows[h][0], '-', rows[h][1])).join(', ')}`,
        facts: { calc: holes.map((h, k) => [front[k] ? E(v, '+', rows[h][1]) : E(rows[h][0], '-', v), k]) }
      });
    }),
    T('sub-cards', '가장 큰 수와 가장 작은 수의 차', '①43 심41', (d) => {
      const list = d.until(() => d.shuffle(upTo(9)).slice(0, d.int(3, 4)), (xs) => Math.max(...xs) - Math.min(...xs) >= 3), big = Math.max(...list), small = Math.min(...list);
      return N('수 카드 가운데 가장 큰 수와 가장 작은 수의 차는?', big - small, {
        figure: cards(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${shown(big, '-', small)}`, facts: { pairs: { numbers: list, want: 'maxDiff' }, rule: 'cards' }
      });
    }),
    T('sub-word-take', '문장제: 덜어 내고 남은 것', '①60', (d) => {
      const [t, k] = gap(d, (x) => x >= 4);
      const [text, u] = d.pick([[`버스에 ${t}명이 타고 있었다. ${k}명이 내렸다. 버스에 남은 사람은 몇 명인가?`, '명'], [`풍선이 ${t}개 있었다. ${k}개가 터졌다. 남은 풍선은 몇 개인가?`, '개'], [`색종이가 ${t}장 있었다. ${k}장을 썼다. 남은 색종이는 몇 장인가?`, '장']]);
      return N(text, t - k, { unit: u, explain: `있던 것에서 덜어 내므로 뺀다. ${shown(t, '-', k)}`, facts: { calc: [[E(t, '-', k), 0]] } });
    }),
    T('sub-word-diff', '문장제: 두 양의 차', '①61 심49', (d) => {
      const [p, q] = gap(d), [x, y, u] = d.pick([['가지', '오이', '개'], ['연필', '볼펜', '자루'], ['강아지', '고양이', '마리']]);
      return N(`${josa(x, '이/가')} ${p}${u}, ${josa(y, '이/가')} ${q}${u} 있다. ${josa(x, '은/는')} ${y}보다 몇 ${u} 더 많은가?`, p - q, {
        unit: u, explain: `하나씩 짝 지으면 ${josa(x, '이/가')} 남는다. ${shown(p, '-', q)}`, facts: { calc: [[E(p, '-', q), 0]] }
      });
    })
  ]);

  // ── 0이 있는 덧셈과 뺄셈 ─────────────────────────────────────
  B.addTypes('1-1-3', 'zero', [
    T('zero-calc', '0이 있는 식 계산', '①44', (d, n) => {
      // 네 가지: 어떤 수 + 0, 0 + 어떤 수, 어떤 수 − 0, 같은 수끼리 빼기
      const a = d.int(2, 9), [x, op, y, tag, why] = [[a, '+', 0, 'plus-zero', '어떤 수에 0을 더하면 그 수 그대로이다.'], [0, '+', a, 'zero-plus', '0에 어떤 수를 더하면 그 수이다.'], [a, '-', 0, 'minus-zero', '어떤 수에서 0을 빼면 그 수 그대로이다.'], [a, '-', a, 'minus-same', '같은 수끼리 빼면 0이다.']][n];
      const v = value([x, op, y]);
      return N('다음을 계산하시오.', v, { figure: expr(x, op, y, '=', box()), explain: `${why} ${shown(x, op, y)}`, facts: Object.assign(v > 0 ? { calc: [[E(x, op, y), 0]] } : { parts: [[E(x, op, y), 0]] }, { rule: tag }) });
    }, { count: 4 }),
    T('zero-pic', '빈 접시가 있는 그림의 덧셈식', '①45', (d) => {
      const a = d.int(2, 8), what = d.pick(['과자', '사탕']), empty = d.bool();   // empty: 왼쪽 접시가 비었다
      return M(`두 접시의 ${what} 수를 더한다. ㉠, ㉡에 알맞은 수는?`, labelled([0, a]), {
        figure: plates(empty ? 0 : a, empty ? a : 0, what) + (empty ? expr(box(LABELS[0]), '+', a, '=', box(LABELS[1])) : expr(a, '+', box(LABELS[0]), '=', box(LABELS[1]))),
        explain: `빈 접시의 ${josa(what, '은/는')} 0개이다. ${empty ? shown(0, '+', a) : shown(a, '+', 0)}`, facts: { parts: [['0', 0], [empty ? E(0, '+', a) : E(a, '+', 0), 1]] }
      });
    }),
    T('zero-pic-sub', '모두 덜어 내거나 하나도 덜어 내지 않은 그림의 뺄셈식', '①45', (d, n) => {
      const theme = d.pick(GONE), t = d.int(3, 8), k = n === 0 ? t : 0;
      return M('×표 한 것을 덜어 낸다. ㉠, ㉡에 알맞은 수는?', labelled([k, t - k]), {
        figure: taken(theme, t, k) + expr(t, '-', box(LABELS[0]), '=', box(LABELS[1])),
        explain: n === 0 ? `${t}개에 모두 ×표를 하였다. ${shown(t, '-', t)}` : `×표 한 것이 하나도 없다. ${shown(t, '-', 0)}`, facts: { parts: [[String(k), 0], [E(t, '-', k), 1]], rule: n === 0 ? 'all' : 'none' }
      });
    }, { count: 2 }),
    T('zero-find', '계산 결과가 0인 식', '①46', (d) => {
      // 「어떤 수 − 0」과 「같은 수끼리 빼기」를 가려야 한다.
      const [a, b, c] = d.shuffle(upTo(9).slice(1)).slice(0, 3), e = d.int(3, 9);
      const rows = d.shuffle([[a, '-', a], [b, '-', 0], [0, '+', c], [e, '-', 1]]);
      return C('계산 결과가 0인 것은?', rows.map(term), rows.findIndex((row) => value(row) === 0), {
        explain: `같은 수끼리 빼면 0이다. ${shown(a, '-', a)}`, facts: { claimed: rows.map(([x, op, y]) => [E(x, op, y), 0]), claimedWant: true }
      });
    }),
    T('zero-max', '0이 있는 식 가운데 계산 결과가 가장 큰 것', '①47 심46', (d) => {
      // 0을 더하거나 뺀 식, 0에 더한 식, 같은 수끼리 뺀 식, 0이 없는 뺄셈식을 하나씩 섞는다.
      const rows = d.until(() => { const [p, q] = gap(d), c = d.int(6, 9); return d.shuffle([[d.int(3, 9), d.pick(['+', '-']), 0], [0, '+', d.int(3, 9)], [c, '-', c], [p, '-', q]]); },
        (list) => { const v = list.map(value).sort((x, y) => y - x); return new Set(v).size === 4 && v[0] - v[1] <= 2; });
      const values = rows.map(value);
      return C('계산 결과가 가장 큰 것은?', rows.map(term), values.indexOf(Math.max(...values)), {
        explain: rows.map(([x, op, y]) => shown(x, op, y)).join(', '), facts: { rank: { values, nth: 1 } }
      });
    }),
    T('zero-min', '0이 있는 식 가운데 계산 결과가 가장 작은 것', '①47', (d) => {
      // 같은 수끼리 뺀 식에 가장 큰 수를 쓴다(큰 수가 보인다고 결과가 큰 것이 아니다).
      const [a, b] = d.shuffle([2, 3, 4, 5]).slice(0, 2), c = d.int(6, 9);
      const rows = d.shuffle([[0, '+', a], [b, '-', 0], [c, '-', c]]), values = rows.map(value);
      return C('계산 결과가 가장 작은 것은?', rows.map(term), values.indexOf(0), {
        explain: rows.map(([x, op, y]) => shown(x, op, y)).join(', '), facts: { rank: { values, nth: 3 } }
      });
    }),
    T('zero-order', '0이 있는 식의 계산 결과를 큰 것부터 차례로', '심46', (d) => {
      const rows = d.until(() => { const [a, b] = two(d, (x, y) => x + y >= 4); return d.shuffle([[a, '+', b], [d.int(3, 9), '-', 0], d.bool() ? [d.int(3, 9), '+', 0] : [0, '+', d.int(3, 9)]]); }, (list) => { const v = list.map(value); return new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 4; });
      const values = rows.map(value), right = [0, 1, 2].sort((p, q) => values[q] - values[p]);
      const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('계산 결과가 큰 것부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map(term)), explain: rows.map(([x, op, y], i) => `${LABELS[i]} ${shown(x, op, y)}`).join(', '),
        facts: { choose: { exprs: rows.map(([x, op, y]) => E(x, op, y)), rule: 'descending', orders: list } }
      });
    }),
    T('zero-match', '0이 있는 식과 계산 결과 짝 짓기', '①48', (d) => {
      const [a, b, c] = d.shuffle(upTo(9).slice(1)).slice(0, 3), rows = d.shuffle([[a, '-', a], d.bool() ? [b, '+', 0] : [0, '+', b], [c, '-', 0]]);
      const values = rows.map(value), list = orderChoice(d);
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(term)), explain: rows.map(([x, op, y], i) => `${LABELS[i]} ${shown(x, op, y)}`).join(', '),
        facts: { match: { exprs: rows.map(([x, op, y]) => E(x, op, y)), options: list.map((o) => o.map((k) => values[k])) } }
      });
    }),
    T('zero-right', '0이 있는 식 가운데 바르게 계산한 것', '①49', (d) => {
      // 틀린 답은 「0을 더하면 0」「0에 더하면 1 커진다」「0을 빼면 0」「같은 수를 빼면 그 수」에서 나온 값이다.
      const [a, b, c, e] = d.shuffle(upTo(8).slice(1)).slice(0, 4), good = d.int(0, 3);
      const rows = d.shuffle([[a, '+', 0, 0], [0, '+', b, b + 1], [c, '-', 0, 0], [e, '-', e, e]].map(([x, op, y, slip], i) => [x, op, y, i === good ? value([x, op, y]) : slip]));
      const right = rows.findIndex((row) => value(row) === row[3]);
      return C('바르게 계산한 것은?', rows.map(([x, op, y, said]) => expr(x, op, y, '=', said)), right, {
        explain: `0을 더하거나 빼면 그 수 그대로이고, 같은 수끼리 빼면 0이다. ${shown(rows[right][0], rows[right][1], rows[right][2])}`, facts: { claimed: rows.map(([x, op, y, said]) => [E(x, op, y), said]), claimedWant: true }
      });
    }),
    T('zero-word-none', '문장제: 하나도 없는 것과 합치기', '①50 심43', (d) => {
      const a = d.int(3, 9), [here, there, what, u] = d.pick([['오른손', '왼손', '구슬', '개'], ['파란 상자', '빨간 상자', '공', '개'], ['큰 어항', '작은 어항', '물고기', '마리']]);
      return N(`${here}에 ${josa(what, '이/가')} ${a}${u} 있다. ${there}에는 하나도 없다. ${josa(what, '은/는')} 모두 몇 ${u}인가?`, a, {
        unit: u, explain: `하나도 없는 것은 0으로 나타낸다. ${shown(a, '+', 0)}`, facts: { calc: [[E(a, '+', 0), 0]], unseen: [0] }
      });
    }),
    T('zero-word-all', '문장제: 있던 것을 모두 덜어 내기', '①50 심43', (d) => {
      const a = d.int(3, 9);
      const [text, u] = d.pick([[`접시에 빵이 ${a}개 있었다. ${a}개를 모두 먹었다. 남은 빵은 몇 개인가?`, '개'], [`연못에 오리가 ${a}마리 있었다. ${a}마리가 모두 밖으로 나갔다. 연못에 남은 오리는 몇 마리인가?`, '마리'], [`색종이가 ${a}장 있었다. ${a}장을 모두 썼다. 남은 색종이는 몇 장인가?`, '장']]);
      return N(text, 0, { unit: u, explain: `같은 수끼리 빼면 0이다. ${shown(a, '-', a)}`, facts: { parts: [[E(a, '-', a), 0]] } });
    })
  ]);

  // ── 덧셈과 뺄셈 ──────────────────────────────────────────────
  B.addTypes('1-1-3', 'mix', [
    T('mix-rows', '규칙이 있는 계산 줄', '①51', (d, n) => {
      // 덧셈 줄: 앞의 수는 1씩 커지고 뒤의 수는 1씩 작아진다. 뺄셈 줄: 두 수가 똑같이 1씩 커진다.
      const add = n === 0, v = add ? d.int(4, 9) : d.int(3, 6), rows = [0, 1, 2, 3].map((i) => (add ? [i, '+', v - i] : [v + i, '-', i]));
      return M('㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled(rows.map(() => v)), {
        figure: lines(rows.map(([x, op, y], i) => expr(x, op, y, '=', box(LABELS[i])))), explain: add ? `앞의 수가 1씩 커지고 뒤의 수가 1씩 작아지면 합은 같다. 모두 ${v}이다.` : `두 수가 똑같이 1씩 커지면 차는 같다. 모두 ${v}이다.`,
        facts: { calc: rows.map(([x, op, y], i) => [E(x, op, y), i]) }
      });
    }, { count: 2 }),
    T('mix-sign', '○ 안에 +, − 넣기', '①52 심45', (d) => {
      const plus = d.bool(), [a, b] = plus ? two(d, (x, y) => x + y >= 4) : gap(d), c = plus ? a + b : a - b;
      return C('○ 안에 +, − 가운데 알맞은 것은?', ['+', '−'], plus ? 0 : 1, {
        figure: ringed(a, b, c), explain: plus ? `계산 결과가 ${a}보다 크므로 더한 것이다. ${shown(a, '+', b)}` : `계산 결과가 ${a}보다 작으므로 뺀 것이다. ${shown(a, '-', b)}`,
        facts: { claimed: [[E(a, '+', b), c], [E(a, '-', b), c]], claimedWant: true, rule: 'sign' }
      });
    }),
    T('mix-sign-zero', '0이 있는 식의 ○ 안에 +, − 넣기', '①52 심45', (d, n) => {
      const a = d.int(2, 9), [x, y, z] = n === 0 ? [0, a, a] : [a, a, 0];
      return C('○ 안에 +, − 가운데 알맞은 것은?', ['+', '−'], n, {
        figure: ringed(x, y, z), explain: n === 0 ? `0에 어떤 수를 더하면 그 수이다. ${shown(0, '+', a)}` : `같은 수끼리 빼면 0이다. ${shown(a, '-', a)}`,
        facts: { claimed: [[E(x, '+', y), z], [E(x, '-', y), z]], claimedWant: true, rule: n === 0 ? 'zero-plus' : 'same-minus' }
      });
    }, { count: 2 }),
    T('mix-sign-odd', '○ 안에 들어갈 것이 다른 식', '심45', (d) => {
      const major = d.bool();   // 셋 가운데 둘에 들어가는 것이 + 인가
      const make = (plus) => { const [a, b] = plus ? two(d, (x, y) => x + y >= 4) : gap(d); return [a, b, plus ? a + b : a - b, plus]; };
      const rows = d.until(() => d.shuffle([make(major), make(major), make(!major)]), (list) => new Set(list.map(String)).size === 3);
      return C('○ 안에 +, −를 알맞게 넣는다. 넣는 것이 나머지와 다른 식은?', LABELS.slice(0, 3), rows.findIndex((row) => row[3] !== major), {
        figure: tagged(rows.map(([a, b, c]) => ringed(a, b, c))), explain: rows.map(([a, b, , plus], i) => `${LABELS[i]} ${shown(a, plus ? '+' : '-', b)}`).join(', '),
        facts: { truth: rows.map((row) => row[3] !== major), want: true }
      });
    }),
    T('mix-same', '덧셈식과 계산 결과가 같은 뺄셈식', '①53', (d) => {
      const [a, b] = two(d, (x, y) => x + y >= 3 && x + y <= 7), s = a + b;
      const rows = d.until(() => Array.from({ length: 4 }, () => gap(d)), (list) => list.filter(([x, y]) => x - y === s).length === 1 && list.every(([x, y]) => Math.abs(x - y - s) <= 2) && new Set(list.map(String)).size === 4);
      return C(`${a} + ${josa(b, '과/와')} 계산 결과가 같은 것은?`, rows.map(([x, y]) => expr(x, '-', y)), rows.findIndex(([x, y]) => x - y === s), {
        explain: `${shown(a, '+', b)}이다. ${rows.map(([x, y]) => shown(x, '-', y)).join(', ')}`, facts: { choose: { exprs: rows.map(([x, y]) => E(x, '-', y)), rule: 'equals', target: s } }
      });
    }),
    T('mix-odd', '덧셈식과 뺄셈식 가운데 계산 결과가 다른 것', '①53 ①25', (d) => {
      // 값이 v 인 식: 0이 없는 덧셈식·뺄셈식, 0에 더한 식, 0을 더한 식, 0을 뺀 식
      const formsOf = (v) => { const x = d.int(1, v - 1), list = [[x, '+', v - x], [0, '+', v], [v, '+', 0], [v, '-', 0]]; if (v < 9) { const k = d.int(1, 9 - v); list.push([v + k, '-', k]); } return list; };
      const s = d.int(4, 8), same = d.until(() => d.shuffle(formsOf(s)).slice(0, 3), (list) => list.some(([x, , y]) => x !== 0 && y !== 0));
      const rows = d.shuffle(same.concat([d.pick(formsOf(s + d.pick([-1, 1])))]));
      return C('계산 결과가 나머지와 다른 것은?', rows.map(term), rows.findIndex((row) => value(row) !== s), {
        explain: rows.map(([x, op, y]) => shown(x, op, y)).join(', '), facts: { choose: { exprs: rows.map(([x, op, y]) => E(x, op, y)), rule: 'odd' } }
      });
    }),
    T('mix-sumdiff', '두 수의 합과 차', '심42', (d) => {
      const [p, q] = gap(d, (x, y) => x + y <= 9);
      return M('두 수의 합과 차는?', [{ label: '합', answer: p + q }, { label: '차', answer: p - q }], {
        figure: numbers([p, q]), explain: `합은 ${shown(p, '+', q)}, 차는 ${shown(p, '-', q)}이다.`, facts: { calc: [[E(p, '+', q), 0], [E(p, '-', q), 1]] }
      });
    }),
    T('mix-three-sub', '수 카드 세 장으로 뺄셈식 만들기', '①54 심48', (d) => {
      const [a, b] = two(d, (x, y) => x !== y && x + y >= 5), s = a + b;
      return M('수 카드 세 장을 한 번씩 모두 써서 뺄셈식을 만든다. ㉠, ㉡에 알맞은 수는?', labelled([s, b]), {
        figure: cards(d.shuffle([a, b, s])) + expr(box(LABELS[0]), '-', a, '=', box(LABELS[1])), explain: `가장 큰 수 ${s}에서 ${josa(a, '을/를')} 빼면 ${josa(b, '이/가')} 남는다. ${shown(s, '-', a)}`,
        facts: { calc: [[E(a, '+', b), 0], [E(s, '-', a), 1]] }
      });
    }),
    T('mix-three-pick', '세 수로 만들 수 있는 식 고르기', '심48', (d) => {
      // 세 수를 모두 쓴 식 넷 가운데 옳은 식은 하나뿐이다. 가장 큰 수가 합이고 빼어지는 수이다.
      const [a, b] = two(d, (x, y) => x !== y && x + y >= 5), s = a + b, big = Math.max(a, b), small = Math.min(a, b);
      const right = d.bool() ? [a, '+', b, s] : [s, '-', a, b];
      const rows = d.shuffle([right, [s, '+', a, b], [big, '-', small, s], [b, '+', s, a]]);
      return C(`세 수 ${small}, ${big}, ${josa(s, '을/를')} 한 번씩 모두 써서 만든 식으로 옳은 것은?`, rows.map(([x, op, y, z]) => expr(x, op, y, '=', z)), rows.indexOf(right), {
        explain: `가장 큰 수 ${josa(s, '이/가')} 두 수의 합이다. ${shown(a, '+', b)}, ${shown(s, '-', a)}`, facts: { claimed: rows.map(([x, op, y, z]) => [E(x, op, y), z]), claimedWant: true }
      });
    }),
    T('mix-word-more', '문장제: 더 많은 쪽 구하기', '①59', (d) => {
      const [one, other] = d.shuffle(NAMES).slice(0, 2), [a, b] = two(d, (x, y) => x + y >= 5), [what, u, did] = d.pick([['딸기', '개', '먹었'], ['종이배', '개', '접었'], ['동화책', '권', '읽었']]);
      return N(`${name(one, '은/는')} ${josa(what, '을/를')} ${a}${u} ${did}다. ${name(other, '은/는')} ${nick(one)}보다 ${b}${u} 더 많이 ${did}다. ${name(other, '은/는')} 몇 ${u} ${did}는가?`, a + b, {
        unit: u, explain: `${a}${u}보다 ${b}${u} 더 많으므로 더한다. ${shown(a, '+', b)}`, facts: { calc: [[E(a, '+', b), 0]] }
      });
    }),
    T('mix-word-less', '문장제: 더 적은 쪽 구하기', '①63', (d) => {
      const [one, other] = d.shuffle(NAMES).slice(0, 2), [p, q] = gap(d, (x) => x >= 4), [what, u] = d.pick([['구슬', '개'], ['붙임딱지', '장'], ['연필', '자루']]);
      return N(`${name(one, '은/는')} ${josa(what, '을/를')} ${p}${u} 가지고 있다. ${name(other, '은/는')} ${nick(one)}보다 ${q}${u} 더 적게 가지고 있다. ${nick(other)}의 ${josa(what, '은/는')} 몇 ${u}인가?`, p - q, {
        unit: u, explain: `${p}${u}보다 ${q}${u} 더 적으므로 뺀다. ${shown(p, '-', q)}`, facts: { calc: [[E(p, '-', q), 0]] }
      });
    }),
    T('mix-who', '문장제: 누가 몇 개 더 많은가', '①62 심50', (d) => {
      // 틀린 보기: 적은 쪽을 고른 것, 두 수를 더한 것
      const [one, other] = d.shuffle(NAMES).slice(0, 2), [p, q] = gap(d, (x, y) => x + y <= 9), values = d.bool() ? [q, p] : [p, q], winner = values[0] > values[1] ? 0 : 1;
      const [what, u, did] = d.pick([['붙임딱지', '장', '받았'], ['조개', '개', '주웠'], ['구슬', '개', '모았']]);
      const list = d.shuffle([[winner, p - q], [1 - winner, p - q], [winner, p + q], [1 - winner, p + q]]);
      return C(`${josa(what, '을/를')} ${name(one, '은/는')} ${values[0]}${u}, ${name(other, '은/는')} ${values[1]}${u} ${did}다. 누가 몇 ${u} 더 많이 ${did}는가?`, list.map(([who, n]) => `${[one, other][who]}, ${n}${u}`), list.findIndex(([who, n]) => who === winner && n === p - q), {
        explain: `${name([one, other][winner], '이/가')} 더 많다. ${shown(p, '-', q)}`, facts: { who: { values, options: list } }
      });
    }),
    T('mix-word-share', '문장제: 나누어 가진 나머지', '①64', (d) => {
      const [one, other] = d.shuffle(NAMES).slice(0, 2), [t, k] = gap(d, (x) => x >= 4), [what, u] = d.pick([['구슬', '개'], ['사탕', '개'], ['색종이', '장']]);
      return N(`${what} ${t}${josa(u, '을/를')} ${name(one, '과/와')} ${name(other, '이/가')} 나누어 가졌다. ${name(one, '이/가')} ${k}${josa(u, '을/를')} 가졌다. ${name(other, '은/는')} 몇 ${josa(u, '을/를')} 가졌는가?`, t - k, {
        unit: u, explain: `${josa(t, '은/는')} ${josa(k, '과/와')} ${josa(t - k, '으로/로')} 가른다. ${shown(t, '-', k)}`, facts: { calc: [[E(t, '-', k), 0]] }
      });
    }),
    T('mix-word-three', '문장제: 셋 가운데 가장 많은 것과 가장 적은 것의 차', '심51', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), list = d.until(() => d.shuffle(upTo(9).slice(1)).slice(0, 3), (xs) => Math.max(...xs) - Math.min(...xs) >= 2), big = Math.max(...list), small = Math.min(...list);
      const [what, u, did, how] = d.pick([['감', '개', '땄다', '딴'], ['조개', '개', '주웠다', '주운'], ['붙임딱지', '장', '모았다', '모은']]);
      return N(`${josa(what, '을/를')} ${who.map((w, i) => `${name(w, '은/는')} ${list[i]}${u}`).join(', ')} ${did}. 가장 많이 ${how} 사람은 가장 적게 ${how} 사람보다 몇 ${u} 더 많은가?`, big - small, {
        unit: u, explain: `가장 많은 수는 ${big}, 가장 적은 수는 ${small}이다. ${shown(big, '-', small)}`, facts: { pairs: { numbers: list, want: 'maxDiff' } }
      });
    }),
    T('mix-pic-three', '세 가지를 세어 가장 많은 것과 가장 적은 것의 차', '심51', (d) => {
      const kinds = [['빨간 구슬', 'bead', 'red'], ['파란 블록', 'block', 'blue'], ['노란 별', 'star', 'yellow']];
      const list = d.until(() => d.shuffle(upTo(9).slice(1)).slice(0, 3), (xs) => Math.max(...xs) - Math.min(...xs) >= 2 && xs[0] + xs[1] + xs[2] <= 18), big = Math.max(...list), small = Math.min(...list);
      return N('가장 많은 것은 가장 적은 것보다 몇 개 더 많은가?', big - small, {
        unit: '개', figure: scene(kinds.map((kind, i) => [group(kind, list[i])]), kinds.map((kind, i) => kind[0] + ' ' + list[i] + '개').join(', ')),
        explain: `${kinds.map((kind, i) => `${kind[0]} ${list[i]}개`).join(', ')}이다. ${shown(big, '-', small)}`, facts: { pairs: { numbers: list, want: 'maxDiff' } }
      });
    })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addGroup('1-1-3', {
    id: 'hard', title: '실력 문제', standard: MEAN,
    types: [
      // ① 가르기를 거꾸로: 가른 두 수를 모으면 처음 수가 된다는 것을 써야 한다.
      // ① 한쪽 칸에 전체가 다 놓여 있다. 두 칸에 다 무엇인가 놓아야 한다고 여기는 아이는 1을 적는다.
      H('h-split-zero', '한쪽에 모두 놓인 가르기', '①45 ①64', (d) => {
        const t = d.int(4, 9);
        return N('가르기를 하였다. 빈 곳에 놓아야 하는 ○는 몇 개인가?', 0, {
          unit: '개', figure: dotBond(t, t, '□'), explain: `위 칸의 ○는 ${t}개이고 아래 왼쪽 칸에도 ${t}개가 있다. 빈 곳에는 하나도 놓지 않는다. ${josa(t, '은/는')} ${josa(t, '과/와')} 0으로 가른다.`,
          facts: { parts: [[E(t, '-', t), 0]], rule: 'none' }
        });
      }, { standard: '2수01-04' }),
      // ① 「더 적다」는 적은 쪽을 앞에 세워야 맞는 말이 된다.
      H('h-less-story', '「더 적다」에 맞는 이야기', '심15', (d) => {
        const theme = d.pick(PAIRS), [p, q] = gap(d, (x, y) => x + y <= 9), flip = d.bool(), a = flip ? q : p, b = flip ? p : q;
        const names = [theme.a[0], theme.b[0]], few = a < b ? 0 : 1, g = p - q;
        // 보기 넷: 정답 / 「더 많다」에 익숙해 많은 쪽을 앞에 세운 아이 / 두 수를 더한 아이 / 짝 짓고 남은 것을 하나 더 센 아이
        const rows = d.shuffle([[few, g], [1 - few, g], [few, p + q], [few, g + 1]]);
        return C('그림을 보고 바르게 말한 것은?', rows.map(([who, v]) => `${josa(names[who], '은/는')} ${names[1 - who]}보다 ${v}개 더 적다.`), rows.findIndex(([who, v]) => who === few && v === g), {
          figure: pairRows(theme, a, b), explain: `하나씩 짝 지으면 ${josa(names[1 - few], '이/가')} ${g}개 남는다. ${josa(names[few], '은/는')} ${names[1 - few]}보다 ${g}개 더 적다.`,
          facts: { truth: rows.map(([who, v]) => who === few && v === g), want: true }
        });
      }),
      // ① 세 식 모두 계산은 옳다. 그림의 두 무리를 세어 식의 두 수와 맞춰 보아야 한다(계산만 확인하는 아이는 못 가린다).
      // ① 틀린 말에도 그림에 나오는 세 수가 모두 들어 있다. 「합」 자리에 무엇이 오는지 알아야 가려진다.
      // ① 보기 넷이 모두 옳은 계산이고 그림에서 나온 수이다. 같은 그림에서 무엇을 묻는가에 따라 식이 달라진다(남은 것 / 처음에 있던 것).
      H('h-which', '같은 그림에서 물음에 맞는 식', '심31', (d, n) => {
        const theme = d.pick(GONE), [t, k] = gap(d, (x, y) => x >= 5 && y >= 2 && x - y >= 2 && y !== x - y && y !== x - y + 1), r = t - k;
        // 남은 것: t−k=r(정답) / (t−1)−(k−1)=r 결과만 맞춰 보는 아이 / t−r=k 빼는 수와 차를 바꾼 아이 / r+k=t 그림의 수로 된 옳은 식이면 된다고 여기는 아이
        // 처음 것: r+k=t(정답) / (r+1)+(k−1)=t 결과만 맞춰 보는 아이 / t−k=r, t−r=k 그림의 수로 된 옳은 식이면 된다고 여기는 아이
        const rows = d.shuffle(n === 0 ? [[t, '-', k], [t - 1, '-', k - 1], [t, '-', r], [r, '+', k]] : [[r, '+', k], [r + 1, '+', k - 1], [t, '-', k], [t, '-', r]]);
        const good = ([x, op, y]) => (n === 0 ? op === '-' && x === t && y === k : op === '+' && x === r && y === k);
        return C(`×표 한 것은 ${theme.gone} ${theme.name}이다. ${n === 0 ? '남은' : '처음에 있던'} ${theme.name}의 수를 구하는 식은?`, rows.map((row) => expr(row[0], row[1], row[2], '=', value(row))), rows.findIndex(good), {
          figure: taken(theme, t, k), explain: n === 0 ? `처음 ${t}개에서 ${theme.gone} ${k}개를 뺀다. ${shown(t, '-', k)}` : `남은 ${r}개와 ${theme.gone} ${k}개를 더한다. ${shown(r, '+', k)}`,
          facts: { truth: rows.map(good), want: true }
        });
      }, { count: 2 }),
      // ① 차는 큰 수에서 작은 수를 뺀 것이다. 작은 수를 먼저 말해도 차는 같다.
      H('h-diff-order', '「합」과 「차」를 바르게 말한 것', '심42 ①36', (d) => {
        const [p, q] = gap(d, (x, y) => x + y <= 9 && x - y >= 2);
        // 보기 넷: 합(옳음) / 큰 수를 먼저 말한 차(옳음) / 작은 수를 먼저 말한 차(옳음 — 차를 「앞의 수 − 뒤의 수」로만 아는 아이가 틀렸다고 고른다) / 합과 차를 바꾸어 말한 것(틀림)
        const rows = d.shuffle([[sumSay(q, p, p + q), true], [diffSay(p, q, p - q), true], [diffSay(q, p, p - q), true], [sumSay(p, q, p - q), false]]);
        return C(`두 수 ${q}, ${josa(p, '을/를')} 보고 말하였다. 틀리게 말한 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), {
          explain: `합은 ${shown(q, '+', p)}이다. 차는 큰 수에서 작은 수를 뺀 것이므로 ${shown(p, '-', q)}이다.`, facts: { truth: rows.map((row) => row[1]), want: false }
        });
      }, { standard: '2수01-06' }),
      // ① 「더 많은」이 들어 있지만 비교하는 상황은 뺄셈이다.
      H('h-compare-expr', '비교하는 이야기에 알맞은 식', '①33 ①61', (d) => {
        const [p, q] = gap(d, (x, y) => x + y <= 9 && y !== x - y), [x, y, u] = d.pick([['빨간 구슬', '파란 구슬', '개'], ['연필', '지우개', '개'], ['강아지', '고양이', '마리']]);
        // 보기 셋: 정답 / 「더 많은」을 보고 더한 아이 / 모두를 구한 뒤 다시 뺀 아이(계산은 옳지만 묻는 수가 아니다)
        const rows = d.shuffle([[p, '-', q], [p, '+', q], [p + q, '-', q]]);
        return C(`${josa(x, '이/가')} ${p}${u}, ${josa(y, '이/가')} ${q}${u} 있다. ${josa(x, '은/는')} ${y}보다 몇 ${u} 더 많은지 구하는 식은?`, rows.map((row) => expr(row[0], row[1], row[2], '=', value(row))), rows.findIndex(([a, op]) => a === p && op === '-'), {
          explain: `하나씩 짝 짓고 남는 수를 구하므로 뺀다. ${shown(p, '-', q)}`, facts: { truth: rows.map(([a, op]) => a === p && op === '-'), want: true }
        });
      }),
      // ① 같은 수로 만든 네 식이라 겉모습으로는 못 가린다: 0을 더한 것, 0에 더한 것, 0을 뺀 것, 같은 수끼리 뺀 것.
      // ① 꼴이 같은 두 식이다: 같은 수를 빼야 0이 되고, 0을 빼야 그대로이다.
      H('h-zero-box', '0이 되는 뺄셈과 그대로인 뺄셈의 빈칸', '심47 ①44', (d) => {
        const a = d.int(3, 9), first = d.bool();   // first: 0이 되는 식이 위에 있다
        return M('㉠, ㉡에 알맞은 수는?', labelled(first ? [a, 0] : [0, a]), {
          figure: lines([expr(a, '-', box(LABELS[0]), '=', first ? 0 : a), expr(a, '-', box(LABELS[1]), '=', first ? a : 0)]),
          explain: `같은 수끼리 빼면 0이고, 0을 빼면 그 수 그대로이다. ${shown(a, '-', a)}, ${shown(a, '-', 0)}`,
          facts: { inverse: ['a-x=c', a, first ? a : 0, first ? 0 : a], parts: [[first ? E(a, '-', a) : E(a, '-', 0), 1]] }
        });
      }, { standard: '2수01-06' }),
      // ① 0도 수이다. 0을 빼놓고 가장 작은 수를 고르는 아이는 답이 달라진다.
      H('h-zero-card', '0이 든 수 카드에서 가장 큰 수와 가장 작은 수의 차', '심41', (d) => {
        const list = d.until(() => d.shuffle([0].concat(d.shuffle(upTo(9)).slice(0, 3))), (xs) => Math.min(...xs.filter((v) => v > 0)) >= 2), big = Math.max(...list);
        return N('수 카드 가운데 가장 큰 수와 가장 작은 수의 차는?', big, {
          figure: cards(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 0이다. ${shown(big, '-', 0)}`, facts: { pairs: { numbers: list, want: 'maxDiff' }, rule: 'zero-card' }
        });
      }, { standard: '2수01-06' }),
      // ① 「남았다」가 들어 있지만 덧셈 상황이다: 쓴 것과 남은 것을 모아야 처음 것이 된다. 「남았다」를 보고 빼는 아이는 틀린다.
      H('h-word-left', '「남았다」가 들어 있는 덧셈 상황', '①57 ①60', (d) => {
        const who = d.pick(NAMES), [a, b] = two(d, (x, y) => x !== y && x + y >= 5), [what, u, did] = d.pick([['사탕', '개', '먹었더니'], ['색종이', '장', '썼더니'], ['구슬', '개', '동생에게 주었더니']]);
        return N(`${name(who, '이/가')} ${josa(what, '을/를')} ${a}${u} ${did} ${b}${josa(u, '이/가')} 남았다. 처음에 있던 ${josa(what, '은/는')} 몇 ${u}인가?`, a + b, {
          unit: u, explain: `없어진 ${a}${josa(u, '과/와')} 남은 ${b}${josa(u, '을/를')} 모으면 처음에 있던 수가 된다. ${shown(a, '+', b)}`, facts: { calc: [[E(a, '+', b), 0]] }
        });
      }),
      // ① 「모두」가 들어 있지만 뺄셈 상황이다: 전체에서 한쪽을 빼야 나머지가 나온다. 「모두」를 보고 더하는 아이는 틀린다.
      // ① 「더 적게」가 들어 있지만 덧셈 상황이다: 한 사람이 다른 사람보다 적으면 다른 사람은 그만큼 더 많다. 「더 적게」를 보고 빼는 아이는 틀린다.
      H('h-word-fewer', '「더 적게」가 들어 있는 덧셈 상황', '①59 ①63', (d) => {
        const [one, other] = d.shuffle(NAMES).slice(0, 2), [a, b] = two(d, (x, y) => x + y >= 5 && x > y), [what, u] = d.pick([['구슬', '개'], ['붙임딱지', '장'], ['연필', '자루']]);
        return N(`${name(one, '은/는')} ${josa(what, '을/를')} ${a}${u} 가지고 있다. ${name(one, '은/는')} ${nick(other)}보다 ${b}${u} 더 적게 가지고 있다. ${nick(other)}의 ${josa(what, '은/는')} 몇 ${u}인가?`, a + b, {
          unit: u, explain: `${name(one, '이/가')} ${b}${u} 더 적으므로 ${name(other, '은/는')} ${nick(one)}보다 ${b}${u} 더 많다. ${shown(a, '+', b)}`, facts: { calc: [[E(a, '+', b), 0]] }
        });
      }),
      // ② 앞 식의 답을 뒤 식에 넣는다(거꾸로 구하는 칸은 없다).
      H('h-chain', '앞 식의 답을 뒤 식에 넣기', '①56', (d) => {
        const kind = d.int(0, 2);   // 0: 같은 수끼리 뺀 뒤 더하기, 1: 더한 뒤 빼기, 2: 뺀 뒤 더하기
        let a, b, c;
        if (kind === 0) { a = d.int(3, 9); b = a; c = d.int(2, 9); }
        else if (kind === 1) { [a, b] = two(d, (x, y) => x + y >= 4); c = d.int(1, a + b - 1); }
        else { [a, b] = gap(d); c = d.int(1, 9 - (a - b)); }
        const op = kind === 1 ? '+' : '-', op2 = kind === 1 ? '-' : '+', mid = value([a, op, b]), end = value([mid, op2, c]);
        return N('◆에 알맞은 수는?', end, {
          figure: lines([expr(a, op, b, '=', '★'), expr('★', op2, c, '=', '◆')]), explain: `★에 알맞은 수는 ${mid}이다. ${shown(a, op, b)}, ${shown(mid, op2, c)}`,
          facts: { calc: [[`${a}${op}${b}${op2}${c}`, 0]] }
        });
      }, { standard: '2수01-06' })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
