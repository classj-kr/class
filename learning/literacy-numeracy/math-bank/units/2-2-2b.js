// 2학년 2학기 2단원 곱셈구구 — 기본 문항 뒤쪽 네 묶음
// (1단 곱셈구구와 0의 곱 · 곱셈표 · 곱셈구구로 문제 해결하기 · 두 번 셈하는 문제).
// 싣는 기준과 뺀 것은 2-2-2a.js 머리에 적었다. 여기서 더 지킨 것:
//  - 1의 곱과 0의 곱은 생활 장면(한 개씩 담긴 접시, 빈 접시, 0점·1점짜리 과녁)과 이어 묻는다(교육과정: 실생활과 관련지어 다룬다).
//  - 곱이 0인 답은 검사가 「0보다 큰 식」으로 다시 셈하지 못하므로 facts.parts 에 적는다.
//  - 곱셈표는 휴대폰 너비에 들어가게 한 번에 다섯 단까지만 그린다.
//  - 두 번 셈하는 문제의 풀이는 곱셈과 덧셈·뺄셈을 두 번에 나누어 적는다(한 식에 섞어 쓰지 않는다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, lines, tagged, chain, table, N, M, C, E } = B.kit;
  const { UNIT, CALC, WORD, L5, SIGNS, FACTS, range, times, versus, labelled, product, pairOptions, packs, mtable, bars, stack } = B.kit.g222;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const sorted = (d, list, k) => d.shuffle(list).slice(0, k).sort((x, y) => x - y);
  // 한 개씩 담는 그림에 쓰는 물건과 그릇
  const ONES = [{ what: '참외', holder: '접시' }, { what: '사과', holder: '접시' }, { what: '빵', holder: '봉지' }, { what: '공', holder: '상자' }];
  // 답이 0일 수 있는 칸들의 근거: 0보다 큰 값은 calc 로, 0은 parts 로 적는다.
  // 줄은 [식 글, 답 칸 번호, 값]이다.
  const split = (list) => { const pick = (keep) => list.filter(([, , value]) => keep(value)).map(([text, i]) => [text, i]), calc = pick((v) => v > 0), parts = pick((v) => v === 0); return Object.assign({}, calc.length ? { calc } : {}, parts.length ? { parts } : {}); };

  B.addGroup(UNIT, {
    id: 'zero', title: '1단 곱셈구구와 0의 곱', standard: CALC,
    types: [
      T('zero-calc', '1단 곱셈구구와 0의 곱 계산', '①35', (d, n) => {
        // 네 가지: 1 × 몇, 몇 × 1, 0 × 몇, 몇 × 0
        const a = d.int(2, 9), [x, y, tag, why] = [[1, a, 'one-first', '1과 어떤 수의 곱은 그 수 그대로이다.'], [a, 1, 'one-last', '어떤 수와 1의 곱은 그 수 그대로이다.'], [0, a, 'zero-first', '0과 어떤 수의 곱은 항상 0이다.'], [a, 0, 'zero-last', '어떤 수와 0의 곱은 항상 0이다.']][n];
        return N('다음을 계산하시오.', x * y, { figure: expr(x, '*', y, '=', box()), explain: `${why} ${times(x, y)}`, facts: Object.assign(split([[E(x, '*', y), 0, x * y]]), { rule: tag }) });
      }, { count: 4 }),
      T('zero-one-pic', '한 개씩 담긴 그림을 1단 곱셈식으로', '①36', (d) => {
        const n = d.int(3, 9), thing = d.pick(ONES);
        return M(`${thing.holder}마다 ${josa(thing.what, '이/가')} 1개씩 있다. ${thing.what}의 수를 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([n, n]), {
          figure: packs(1, n, thing) + expr(1, '*', box(L5[0]), '=', box(L5[1])),
          explain: `1개씩 ${n}묶음이다. ${times(1, n)}`, facts: { calc: [[String(n), 0], [E(1, '*', n), 1]] }
        });
      }),
      T('zero-empty-pic', '빈 그릇 그림을 0의 곱셈식으로', '①37', (d) => {
        const n = d.int(3, 9), thing = d.pick(ONES);
        return M(`${josa(thing.holder, '이/가')} 모두 비어 있다. ${thing.what}의 수를 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([n, 0]), {
          figure: packs(0, n, thing) + expr(0, '*', box(L5[0]), '=', box(L5[1])),
          explain: `${thing.holder} ${n}개에 ${josa(thing.what, '이/가')} 0개씩 있다. ${times(0, n)}`, facts: { parts: [[String(n), 0], [E(0, '*', n), 1]] }
        });
      }),
      T('zero-box', '1이나 0이 들어가는 □ 찾기', '①38 심34', (d, n) => {
        const [a, b] = d.shuffle(range(2, 9)).slice(0, 2);
        if (n === 0) return N('□ 안에 공통으로 들어갈 수는?', 1, {
          figure: lines([expr(box(), '*', a, '=', a), expr(box(), '*', b, '=', b)]),
          explain: `곱이 곱하는 수와 같다. 1과 어떤 수의 곱은 그 수 그대로이므로 □ 안에 알맞은 수는 1이다. ${times(1, a)}, ${times(1, b)}`, facts: { calc: [[`${a}/${a}`, 0]] }
        });
        return N('□ 안에 공통으로 들어갈 수는?', 0, {
          figure: lines([expr(a, '*', box(), '=', 0), expr(box(), '*', b, '=', 0)]),
          explain: `곱이 0이다. 어떤 수와 0의 곱은 항상 0이므로 □ 안에 알맞은 수는 0이다. ${times(a, 0)}, ${times(0, b)}`, facts: { parts: [[`0*${a}*${b}`, 0]] }
        });
      }, { count: 2 }),
      T('zero-rule', '1의 곱과 0의 곱의 성질', '①39', (d) => {
        const any = '(어떤 수)', front = d.bool();
        return M('1의 곱과 0의 곱에서 알 수 있는 것이다. ㉠, ㉡에 알맞은 수는?', labelled([1, 0]), {
          figure: lines([front ? expr(box(L5[0]), '*', any, '=', any) : expr(any, '*', box(L5[0]), '=', any), front ? expr(0, '*', any, '=', box(L5[1])) : expr(any, '*', 0, '=', box(L5[1]))]),
          explain: '1과 어떤 수의 곱은 항상 그 수 그대로이고, 0과 어떤 수의 곱은 항상 0이다.', facts: { parts: [['1', 0], ['0', 1]] }
        });
      }),
      T('zero-same', '0의 곱과 곱이 같은 것 모두 고르기', '①40 심33', (d) => {
        const [b, c, e, f] = d.shuffle(range(2, 9)).slice(0, 4);
        const rows = d.shuffle([[0, b], [c, 0], [1, e], [f, 1]]), flags = rows.map((row) => product(row) === 0), made = pairOptions(d, LABELS, flags);
        return C('곱이 0인 것을 모두 고른 것은?', made.options, made.answer, {
          figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: '0과 어떤 수의 곱은 0이고, 1과 어떤 수의 곱은 그 수 그대로이다. ' + rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
          facts: { sets: { labels: LABELS, flags, options: made.sets } }
        });
      }),
      T('zero-compare', '0의 곱과 1의 곱의 크기 비교', '①40', (d) => {
        // 큰 수에 0을 곱한 쪽이 더 커 보이게 놓는다.
        const [small, big] = sorted(d, range(2, 9), 2);
        const [left, right] = d.pick([[[big, 0], [1, small]], [[1, small], [big, 0]], [[0, big], [small, 1]], [[big, 0], [0, small]]]);
        const x = product(left), y = product(right);
        return C('두 곱의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : x === y ? 1 : 2, {
          figure: versus(expr(left[0], '*', left[1]), expr(right[0], '*', right[1])), explain: `${times(left[0], left[1])}, ${times(right[0], right[1])}`,
          facts: { truth: [x > y, x === y, x < y], want: true, rule: 'compare-zero' }
        });
      }),
      T('zero-wrong', '1의 곱과 0의 곱을 잘못 구한 것 찾기', '①41', (d) => {
        // 틀린 식: 0 × 1 = 1, 1 × 0 = 1, 몇 × 0 = 몇, 0 × 몇 = 몇
        const [a, b, c] = d.shuffle(range(2, 9)).slice(0, 3);
        const bad = d.pick([[0, 1, 1], [1, 0, 1], [a, 0, a], [0, a, a]]), rows = d.shuffle([bad, [1, b, b], [c, 0, 0], [0, b, 0]]);
        return C('곱을 잘못 구한 것은?', LABELS, rows.indexOf(bad), {
          figure: tagged(rows.map(([x, y, v]) => expr(x, '*', y, '=', v))), explain: `0과 어떤 수의 곱은 항상 0이다. ${LABELS[rows.indexOf(bad)]} ${times(bad[0], bad[1])}`,
          facts: { claimed: rows.map(([x, y, v]) => [E(x, '*', y), v]), claimedWant: false }
        });
      }),
      T('zero-chain', '1과 0을 이어 곱하기', '심31', (d) => {
        const a = d.int(2, 9), first = d.bool();
        return M('빈칸 ㉠, ㉡에 알맞은 수는?', labelled([a, 0]), {
          figure: chain(first ? [1, '×' + a, box(L5[0]), '×0', box(L5[1])] : [a, '×1', box(L5[0]), '×0', box(L5[1])]),
          explain: `${first ? times(1, a) : times(a, 1)}, ${times(a, 0)}`, facts: { parts: [[first ? E(1, '*', a) : E(a, '*', 1), 0], [`${a}*1*0`, 1]] }
        });
      }),
      T('zero-stack', '위의 두 수를 곱해 아래 칸 채우기', '①42', (d) => {
        const a = d.int(2, 9), top = d.pick([[0, 1, a], [a, 1, 0], [1, a, 0], [0, a, 1], [1, 1, a], [a, 1, 1]]), m1 = top[0] * top[1], m2 = top[1] * top[2];
        return M('위의 두 수를 곱하여 바로 아래 칸에 쓴다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([m1, m2, m1 * m2]), {
          figure: stack(top, [box(L5[0]), box(L5[1])], box(L5[2])), explain: `${times(top[0], top[1])}, ${times(top[1], top[2])}, ${times(m1, m2)}`,
          facts: { parts: [[E(top[0], '*', top[1]), 0], [E(top[1], '*', top[2]), 1], [`${top[0]}*${top[1]}*${top[1]}*${top[2]}`, 2]] }
        });
      }),
      T('zero-score', '0점과 1점짜리 과녁에서 얻은 점수', '①43 심36', (d) => {
        // 0점짜리를 맞힌 횟수가 더 많다(0 × 5 를 5 로 보면 틀린다). 과녁마다 곱만 구한다 — 여러 과녁의 점수를 더하는 것은 「두 번 셈하는 문제」 묶음에 있다.
        const who = d.pick(NAMES), q = d.int(2, 7), p = d.int(q + 1, 9);
        return M(`${name(who, '이/가')} 과녁 맞히기를 하였다. 얻은 점수 ㉠, ㉡에 알맞은 수는?`, labelled([0, q]), {
          figure: table(['과녁', '0점', '1점'], [['맞힌 횟수(번)', p, q], ['얻은 점수(점)', L5[0], L5[1]]]),
          explain: `0점짜리는 ${times(0, p)}(점), 1점짜리는 ${times(1, q)}(점)이다.`, facts: split([[`0*${p}`, 0, 0], [`1*${q}`, 1, q]])
        });
      }),
      T('zero-word', '1단 곱셈구구 문장제', '심35 ①51', (d) => {
        const k = d.int(3, 9);
        return N(`상자 한 개에 케이크를 1개씩 담았다. 상자 ${k}개에 담은 케이크는 모두 몇 개인가?`, k, { unit: '개', explain: `1개씩 ${k}상자이다. ${times(1, k)}`, facts: { calc: [[E(1, '*', k), 0]] } });
      })
    ]
  });

  B.addGroup(UNIT, {
    id: 'table', title: '곱셈표 만들기와 규칙', standard: CALC,
    types: [
      T('table-fill', '곱셈표의 빈칸 채우기', '①44 ①47 심37', (d, n) => {
        // 첫째: 2~9단의 표. 둘째: 0과 1이 낀 표(가로에 1, 세로에 0) — 0의 줄과 1의 줄에 빈칸이 하나씩 든다.
        const cols = n === 0 ? sorted(d, range(2, 9), 4) : [1].concat(sorted(d, range(2, 9), 3)), rows = n === 0 ? sorted(d, range(2, 9), 3) : [0].concat(sorted(d, range(2, 9), 2));
        const all = []; rows.forEach((_, i) => cols.forEach((__, j) => all.push([i, j])));
        const blanks = (n === 0 ? d.shuffle(all).slice(0, 4) : [[0, d.int(1, 3)], [d.int(1, 2), 0]].concat(d.shuffle(all.filter(([i, j]) => i > 0 && j > 0)).slice(0, 2))).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
        const at = (i, j) => blanks.findIndex((cell) => cell[0] === i && cell[1] === j);
        return M('곱셈표의 빈칸 ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled(blanks.map(([i, j]) => rows[i] * cols[j])), {
          figure: mtable(cols, rows, (i, j) => (at(i, j) >= 0 ? L5[at(i, j)] : rows[i] * cols[j])),
          explain: blanks.map(([i, j], k) => `${L5[k]} ${times(rows[i], cols[j])}`).join(', '),
          facts: Object.assign(split(blanks.map(([i, j], k) => [E(rows[i], '*', cols[j]), k, rows[i] * cols[j]])), { rule: n === 0 ? 'table' : 'table-zero' })
        });
      }, { count: 2 }),
      T('table-swap', '두 수를 바꾸어 곱해도 곱이 같다', '①45', (d) => {
        const [a, b, c, e] = d.shuffle(range(2, 9)).slice(0, 4);
        return M('두 수를 바꾸어 곱해도 곱은 같다. ㉠, ㉡에 알맞은 수는?', labelled([a, e]), {
          figure: lines([expr(a, '*', b, '=', b, '*', box(L5[0])), expr(box(L5[1]), '*', c, '=', c, '*', e)]),
          explain: `${times(a, b)}, ${times(b, a)} / ${times(e, c)}, ${times(c, e)}`, facts: { calc: [[`${a}*${b}/${b}`, 0], [`${c}*${e}/${c}`, 1]] }
        });
      }),
      T('table-star', '곱셈표에서 곱이 같은 칸 찾기', '①45 ①47 심39', (d) => {
        // ★ 은 (r, c) 칸이고 답은 두 수를 바꾼 (c, r) 칸이다. 틀린 칸은 답과 붙어 있는 칸들에서 고른다.
        const s = d.int(2, 6), heads = range(s, s + 3), [r, c] = d.until(() => [d.int(0, 3), d.int(0, 3)], ([x, y]) => x !== y), star = heads[r] * heads[c];
        const pool = []; heads.forEach((_, i) => heads.forEach((__, j) => { if (!(i === r && j === c) && !(i === c && j === r) && heads[i] * heads[j] !== star) pool.push([i, j]); }));
        const near = pool.slice().sort((p, q) => Math.max(Math.abs(p[0] - c), Math.abs(p[1] - r)) - Math.max(Math.abs(q[0] - c), Math.abs(q[1] - r))).slice(0, 5);
        const marked = [[c, r]].concat(d.shuffle(near).slice(0, 3)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
        const at = (i, j) => marked.findIndex((cell) => cell[0] === i && cell[1] === j);
        return C('곱셈표에서 ★ 칸과 곱이 같은 칸은?', LABELS, at(c, r), {
          figure: mtable(heads, heads, (i, j) => (i === r && j === c ? { html: '★', on: true } : at(i, j) >= 0 ? LABELS[at(i, j)] : heads[i] * heads[j])),
          explain: `★ 칸은 ${heads[r]} × ${heads[c]}의 곱이다. 두 수를 바꾸어 곱한 ${heads[c]} × ${heads[r]}의 칸과 곱이 같다. ${times(heads[r], heads[c])}, ${times(heads[c], heads[r])}`,
          facts: { choose: { exprs: marked.map(([i, j]) => E(heads[i], '*', heads[j])), rule: 'equals', target: star } }
        });
      }),
      T('table-step', '한 단에서 곱이 커지는 수', '①48', (d) => {
        const a = d.int(3, 9), b = d.int(2, 5), heads = range(b, b + 4);
        return N('곱셈표의 한 줄이다. 곱은 얼마씩 커지는가?', a, {
          figure: mtable(heads, [a], (i, j) => a * heads[j]), explain: `${expr(a * (b + 1), '-', a * b, '=', a)}이다. ${a}단 곱셈구구에서는 곱이 ${a}씩 커진다.`,
          facts: { calc: [[`${a * (b + 1)}-${a * b}`, 0]] }
        });
      }),
      T('table-rules', '곱셈표에서 찾은 규칙', '심41', (d) => {
        // 규칙을 글로 쓰게 하지 않고, 곱셈표를 보고 한 말 넷 가운데 틀린 것을 고르게 한다. 참·거짓은 표의 수로 따진다.
        const heads = range(2, 6), a = d.pick([3, 4, 6]), [p, q] = d.shuffle([3, 4, 6]).slice(0, 2), wrongStep = d.bool();
        const stepped = (dan, by) => heads.slice(1).every((h, i) => dan * h - dan * heads[i] === by);
        const rows = d.shuffle([
          wrongStep ? [`${a}단은 곱이 ${a + 1}씩 커진다.`, stepped(a, a + 1)] : [`${a}단은 곱이 ${a}씩 커진다.`, stepped(a, a)],
          wrongStep ? [`${p} × ${josa(q, '과/와')} ${q} × ${p}의 곱은 같다.`, p * q === q * p] : [`${p} × ${q}의 곱과 ${q} × ${p}의 곱은 다르다.`, p * q !== q * p],
          ['5단의 곱은 일의 자리 숫자가 5 또는 0이다.', heads.every((h) => (5 * h) % 10 === 5 || (5 * h) % 10 === 0)],
          ['2단의 곱은 모두 짝수이다.', heads.every((h) => (2 * h) % 2 === 0)]
        ]);
        return C('곱셈표를 보고 한 말이다. 옳지 않은 것은?', rows.map(([said]) => said), rows.findIndex(([, ok]) => !ok), {
          figure: mtable(heads, heads, (i, j) => heads[i] * heads[j]),
          explain: wrongStep ? `${a}단의 곱은 ${heads.map((h) => a * h).join(', ')}이다. ${a}씩 커진다.` : `${times(p, q)}, ${times(q, p)}이다. 두 수를 바꾸어 곱해도 곱은 같다.`,
          facts: { truth: rows.map(([, ok]) => ok), want: false }
        });
      }),
      T('table-above', '곱이 어떤 수보다 큰 칸의 수', '①49', (d) => {
        // 색칠하기를 칸 세기로 바꾸었다. 빈 표라서 곱을 하나씩 구해야 한다.
        const [rows, cols, t] = d.until(() => { const a = d.int(3, 7), b = d.int(3, 7), rs = range(a, a + 2), cs = range(b, b + 2); return [rs, cs, d.int(rs[0] * cs[0] + 2, rs[2] * cs[2] - 2)]; }, ([rs, cs, v]) => {
          const values = rs.reduce((list, r) => list.concat(cs.map((c) => r * c)), []), over = values.filter((x) => x > v).length;
          return !values.includes(v) && over >= 2 && over <= 7;
        });
        const values = rows.reduce((list, r) => list.concat(cols.map((c) => r * c)), []);
        return N(`곱셈표의 빈칸을 모두 채울 때, 곱이 ${t}보다 큰 칸은 모두 몇 칸인가?`, values.filter((v) => v > t).length, {
          unit: '칸', figure: mtable(cols, rows, () => ''), explain: `곱은 ${rows.map((r) => cols.map((c) => r * c).join(', ')).join(' / ')}이다. ${t}보다 큰 곱은 ${values.filter((v) => v > t).join(', ')}이다.`,
          facts: { big: { countIf: { values, test: 'above', target: t, i: 0 } } }
        });
      })
    ]
  });

  B.addGroup(UNIT, {
    id: 'word', title: '곱셈구구로 문제 해결하기', standard: WORD,
    types: [
      T('word-pack', '문장제: 몇씩 몇 묶음', '①51 심42', (d) => {
        const [a, n] = d.pick(FACTS.filter(([x]) => x >= 3)), what = d.pick(['사탕', '구슬', '쿠키', '지우개']);
        return N(`한 봉지에 ${josa(what, '이/가')} ${a}개씩 들어 있다. ${n}봉지에 들어 있는 ${josa(what, '은/는')} 모두 몇 개인가?`, a * n, { unit: '개', explain: `${a}개씩 ${n}봉지이다. ${times(a, n)}`, facts: { calc: [[E(a, '*', n), 0]] } });
      }),
      T('word-daily', '문장제: 날마다 같은 양', '①51', (d) => {
        const [a, n] = d.pick(FACTS.filter(([x, y]) => x >= 3 && y >= 3)), who = d.pick(NAMES);
        return N(`${name(who, '은/는')} 동화책을 하루에 ${a}쪽씩 읽는다. ${n}일 동안 읽는 쪽수는 모두 몇 쪽인가?`, a * n, { unit: '쪽', explain: `${a}쪽씩 ${n}일이다. ${times(a, n)}`, facts: { calc: [[E(a, '*', n), 0]] } });
      }),
      T('word-times', '문장제: 몇의 몇 배', '①52', (d) => {
        const [a, n] = d.pick(FACTS.filter(([x, y]) => x >= 4 && y <= 7 && x !== y));
        return N(`빨간 구슬이 ${a}개 있다. 파란 구슬의 수는 빨간 구슬의 수의 ${n}배이다. 파란 구슬은 몇 개인가?`, a * n, { unit: '개', explain: `${a}의 ${n}배는 ${times(a, n)}이다.`, facts: { calc: [[E(a, '*', n), 0]] } });
      }),
      T('word-length', '문장제: 같은 길이 몇 개를 이은 길이', '①53', (d) => {
        const a = d.int(3, 9), n = d.int(3, 8);
        return N(`길이가 ${a} cm인 막대를 겹치지 않게 한 줄로 이었다. 이은 막대의 전체 길이는 몇 cm인가?`, a * n, {
          unit: 'cm', figure: bars(a, n), explain: `${a} cm인 막대가 ${n}개이다. ${times(a, n)}`, facts: { calc: [[E(a, '*', n), 0]] }
        });
      })
    ]
  });

  B.addGroup(UNIT, {
    id: 'two', title: '곱셈구구로 두 번 셈하는 문제', standard: WORD,
    types: [
      T('two-pack', '문장제: 곱한 뒤 더하거나 빼기', '①54 심44', (d, n) => {
        const [a, b] = d.pick(FACTS.filter(([x, y]) => x >= 3 && y >= 3)), k = d.int(2, 8), p = a * b;
        if (n === 0) return N(`귤을 한 봉지에 ${a}개씩 ${b}봉지 샀다. 가게에서 ${k}개를 더 주었다. 귤은 모두 몇 개인가?`, p + k, {
          unit: '개', explain: `산 귤은 ${times(a, b)}(개)이다. ${expr(p, '+', k, '=', p + k)}(개)`, facts: { calc: [[`${a}*${b}+${k}`, 0]] }
        });
        return N(`딸기가 한 접시에 ${a}개씩 ${b}접시 있다. 그 가운데 ${k}개를 먹었다. 남은 딸기는 몇 개인가?`, p - k, {
          unit: '개', explain: `딸기는 ${times(a, b)}(개) 있었다. ${expr(p, '-', k, '=', p - k)}(개)`, facts: { calc: [[`${a}*${b}-${k}`, 0]] }
        });
      }, { count: 2 }),
      T('two-more', '문장제: 몇 배보다 몇 큰 수', '①55', (d) => {
        const who = d.pick(NAMES), a = d.pick([8, 9]), b = d.pick([4, 5]), k = d.int(2, 7);
        return N(`${name(who, '은/는')} ${a}살이다. 선생님의 나이는 ${nick(who)} 나이의 ${b}배보다 ${k}살 더 많다. 선생님은 몇 살인가?`, a * b + k, {
          unit: '살', explain: `${a}의 ${b}배는 ${times(a, b)}이다. ${expr(a * b, '+', k, '=', a * b + k)}(살)`, facts: { calc: [[`${a}*${b}+${k}`, 0]] }
        });
      }),
      T('two-both', '문장제: 두 가지 묶음의 합', '①56 심46', (d) => {
        const [[a, b], [c, e]] = d.until(() => [d.pick(FACTS), d.pick(FACTS)], ([p, q]) => p[0] !== q[0] && p[1] !== q[1] && p[0] !== p[1] && q[0] !== q[1] && p[0] <= 6 && q[0] <= 6);
        return N(`1반 학생은 한 줄에 ${a}명씩 ${b}줄로 섰다. 2반 학생은 한 줄에 ${c}명씩 ${e}줄로 섰다. 두 반 학생은 모두 몇 명인가?`, a * b + c * e, {
          unit: '명', explain: `1반은 ${times(a, b)}(명), 2반은 ${times(c, e)}(명)이다. ${expr(a * b, '+', c * e, '=', a * b + c * e)}(명)`,
          facts: { calc: [[`${a}*${b}+${c}*${e}`, 0]] }
        });
      }),
      T('two-who', '문장제: 곱과 수를 비교하기', '①57', (d) => {
        // 보기: 맞는 답, 사람만 바꾼 것, 곱해야 할 두 수를 더해 견준 것(한 봉지의 수 + 봉지 수) 둘
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [a, b, x] = d.until(() => { const [p, q] = d.pick(FACTS.filter(([u, v]) => u >= 4 && v >= 4 && u !== v)); return [p, q, p * q + d.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6])]; }, ([p, q, v]) => v - (p + q) > 0 && v - (p + q) !== Math.abs(v - p * q));
        const values = [x, a * b], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]), alt = x - (a + b);
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [0, alt], [1, alt]]);
        return C(`${name(one, '은/는')} 구슬을 ${x}개 가지고 있다. ${name(two, '은/는')} 한 봉지에 ${a}개씩 ${b}봉지 가지고 있다. 누가 몇 개 더 많이 가지고 있는가?`, list.map(([who, n]) => `${[one, two][who]}, ${n}개`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${name(two, '은/는')} ${times(a, b)}(개)를 가지고 있다. ${name([one, two][winner], '이/가')} ${expr(Math.max(...values), '-', Math.min(...values), '=', gap)}(개) 더 많이 가지고 있다.`,
          facts: { who: { values, options: list, exprs: [String(x), E(a, '*', b)] } }
        });
      }),
      T('two-score', '문장제: 과녁마다 점수를 구해 더하기', '①43', (d) => {
        // 0점, 1점, 그리고 2·3·5점 가운데 두 가지. 과녁마다 곱을 따로 구한 뒤 더한다.
        const who = d.pick(NAMES), [s2, s3] = d.pick([[2, 3], [3, 5], [2, 5]]), counts = [d.int(2, 5), d.int(2, 6), d.int(2, 5), d.int(1, 4)], scores = [0, 1, s2, s3];
        const got = scores.map((s, i) => s * counts[i]), total = got.reduce((sum, v) => sum + v, 0);
        return N(`${name(who, '이/가')} 과녁 맞히기를 한 결과이다. 얻은 점수는 모두 몇 점인가?`, total, {
          unit: '점', figure: table(['점수(점)'].concat(scores), [['맞힌 횟수(번)'].concat(counts)]),
          explain: scores.map((s, i) => times(s, counts[i])).join(', ') + '이다. ' + expr.apply(null, got.reduce((list, v, i) => list.concat(i ? ['+', v] : [v]), []).concat(['=', total])) + '(점)',
          facts: { calc: [[scores.map((s, i) => `${s}*${counts[i]}`).join('+'), 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
