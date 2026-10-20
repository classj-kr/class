// 5학년 1학기 1단원 자연수의 혼합 계산 — 계산 순서와 잘못된 계산, ( )가 있는 식과 없는 식, 계산 결과의 크기 비교, □가 있는 식, 말과 식의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3, 심화꼴 85꼴)을 꼴마다 따져서 실었다. 섞인 연산마다의 계산·순서·과정·문장제와 식 도구는 5-1-1a.js 에 있다(뺀 것과 까닭도 거기에 적었다).
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//   ① 곱셈·나눗셈이 있어도 앞에서부터 차례로만 계산한다(20 − 4 × 3 을 16 × 3 으로).
//   ② ( )를 무시하거나, ( ) 안의 한 수에만 곱하고 나눈다(13 × (2 + 4) 를 26 + 4 로).
//   ③ 덧셈을 뺄셈보다, 곱셈을 나눗셈보다 언제나 먼저 계산한다(24 ÷ 4 × 2 를 24 ÷ 8 로).
//   ④ ( ) 안에 곱셈과 덧셈이 함께 있을 때 ( ) 안에서도 순서가 있다는 것을 놓친다.
//   ⑤ 빼는 ( )·나누는 ( )를 그냥 지워도 값이 같다고 여긴다(50 − (20 + 5) 를 50 − 20 + 5 로). 더하는 ( )·곱하는 ( )만 지워도 값이 같다.
//   ⑥ 문장을 식으로 옮길 때 ( )를 빠뜨린다(남은 돈을 나누는 식에서 5000 − 800 × 3 ÷ 2).
//   ⑦ □를 거꾸로 구할 때 빼는 수·나누는 수 자리의 □도 더하고 곱해서 구한다(36 ÷ □ = 6 을 □ = 36 × 6 으로).
// 이런 오개념은 기본 묶음에서 잘못 계산한 과정 바로잡기·처음 틀린 줄·잘못된 까닭 고르기로 묻는다. 식 하나의 값을 보기에서 고르게 하고 틀린 보기에 실수한 값을 넣은 문항은
// 기본의 계산 문항과 하는 일이 같아 싣지 않는다.
// 실력 문항의 잣대(둘뿐이다)
//   ㉮ 상황 자체에 함정이 있어 뜻을 정확히 대야 풀리는 문제: ( )를 지워도 값이 변하지 않는 식의 수, ( ) 없이 옮긴 식이 상황에 맞지 않는 것의 수,
//      ( )를 풀 때 뒤집히는 기호
//   ㉯ 심화꼴 목록에 있는, 두 번 넘게 생각해야 풀리는 문제: 거꾸로 두 번 넘게 계산하는 □, □의 범위(두 식 사이·식 안의 □), 어떤 수, 어떤 수를 구해 바르게 계산하기,
//      여러 단계 문장제(빈 상자의 무게, 가격표, 겹쳐 이은 테이프 세 장, 쉬는 날이 있는 일주일)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, tagged, table, N, M, C } = B.kit;
  const { tiles } = B.kit.geo;
  const X = B.findUnit('5-1-1').tools;
  const { STD, SIGN, fmt, ex, show, lex, write, run, val, chain, unparen, numbersOf, ids, perms, sameBy, wrongOrders, soleFirst, parts, G, BIG, MD, each, pickTpl, tree, ruleOf, why, story, two, payFor, labelled } = X;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const GA = ['가', '나', '다'];
  const OPN = { '+': '덧셈', '-': '뺄셈', '*': '곱셈', '/': '나눗셈' };
  const with_ = (base, more) => Object.assign({}, base, more);
  // 토씨: 식 뒤의 토씨는 마지막 수를 읽는 소리에 맞춘다(34 − 19 + 8과).
  const tailOf = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (s, pair) => fmt(s) + tailOf(numbersOf(s).pop(), pair);
  // 자바스크립트처럼 그대로 셈한 값(나누어떨어지지 않아도, 0보다 작아도 셈한다). 보기끼리 값이 겹치지 않는지 볼 때 쓴다.
  const raw = (s) => { const t = String(s).match(/\d+|[-+*/()]/g); let i = 0; const atom = () => { if (t[i] === '(') { i += 1; const v = sum(); i += 1; return v; } return Number(t[i++]); }; const term = () => { let v = atom(); while (t[i] === '*' || t[i] === '/') { const op = t[i++], w = atom(); v = op === '*' ? v * w : v / w; } return v; }; const sum = () => { let v = term(); while (t[i] === '+' || t[i] === '-') { const op = t[i++], w = term(); v = op === '+' ? v + w : v - w; } return v; }; return sum(); };
  const differs = (s, v) => Math.abs(raw(s) - v) > 1e-9;
  // ( ) 없는 식에서 k번째 연산의 양옆 두 수를 ( )로 묶은 식
  const wrapAt = (base, k) => { const list = lex(base), at = list.findIndex((t) => t.op && t.id === k); return list.map((t, i) => (i === at - 1 ? '(' : '') + (t.op || t.n) + (i === at + 1 ? ')' : '')).join(''); };
  const wraps = (base) => ids(base).map((k) => wrapAt(base, k));
  const isLtr = (s) => run(s).order.join() === ids(s).join();
  const seqOf = (s) => run(s).steps.map((st) => OPN[st.op]).join(', ');
  // ( ) 안은 먼저 계산하고 그 밖은 앞에서부터 차례로만 계산하는 차례
  const parenThenLtr = (s) => { const inside = []; let depth = 0; lex(s).forEach((t) => { if (t.p === '(') depth += 1; else if (t.p === ')') depth -= 1; else if (t.op && depth) inside.push(t.id); }); return run(s).order.filter((id) => inside.includes(id)).concat(ids(s).filter((id) => !inside.includes(id))); };
  // 잘못 계산한 과정의 줄들: 첫 줄은 처음 식, 다음 줄부터는 from(주지 않으면 처음 식)을 order 차례로 계산해 간 줄
  const work = (s, order, from) => [fmt(s)].concat(run(from || s, order).steps.map((st) => '= ' + write(st.list)));
  const workBox = (rows, tags) => lines(rows.map((row, i) => ex(row) + (tags && i > 0 ? '<span style="margin-left:0.9em">' + tags[i - 1] + '</span>' : '')));
  // 그 차례로 계산할 수 있고 바른 값과 다른가
  const slips = (s, order, from) => { const w = run(from || s, order); return Boolean(w) && w.value !== val(s) && w.value <= 999; };
  const wrongValue = (s, order, from) => run(from || s, order).value;
  const versus = (left, right) => `<div class="mb-versus">${ex(left)}<span class="mb-ring"></span>${ex(right)}</div>`;
  const cmp = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const sayAll = (rows) => rows.map((s, i) => `${LABELS[i]} ${fmt(s)} = ${val(s)}`).join(', ');
  const three = (d) => d.shuffle(NAMES).slice(0, 3);
  // 차례 보기 넷: 바른 차례, 그 반대, 그 밖의 둘
  const orderOptions = (d, right) => d.shuffle([right, right.slice().reverse()].concat(d.shuffle(perms(right.slice().sort()).filter((p) => p.join() !== right.join() && p.join() !== right.slice().reverse().join())).slice(0, 2)));
  // 값이 v 인 곱셈·나눗셈 식(a ÷ b × c)을 짓는다. 지을 수 없으면 null.
  const mdHit = (d, v, avoid) => { const list = []; for (let c = 2; c <= 9; c += 1) if (v % c === 0 && v / c >= 2 && v / c <= 24) for (let b = 2; b <= 9; b += 1) { const s = `${(v / c) * b}/${b}*${c}`; if (b !== c && (v / c) * b <= 150 && new Set(numbersOf(s)).size === 3 && !(avoid || []).includes(s)) list.push(s); } return list.length ? d.pick(list) : null; };

  // ── 계산 순서와 잘못된 계산 ──────────────────────────────────
  // 잘못 계산한 과정을 보여 주고 바른 값을 묻는다. slip(식) → [차례, 처음 식 대신 계산한 식]
  const fixOf = (tpls, slip, o, build) => (d, n) => {
    const tpl = pickTpl(d, tpls, n), s = build && build[tpl] ? build[tpl](d) : G(d, tpl, with_(o, { test: (x) => slips(x, slip(x)[0], slip(x)[1]) })), [order, from] = slip(s);
    return N('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', val(s), { figure: workBox(work(s, order, from)), explain: why(s), facts: { calc: [[s, 0]], rule: 'fix:' + tpl } });
  };
  B.addTypes('5-1-1', 'order', [
    T('or-rule', '혼합 계산의 순서에 대한 설명', '①50 ②21 ③23', (d) => {
      const good = [['as', '덧셈과 뺄셈이 섞여 있는 식은 앞에서부터 차례로 계산한다.'], ['md', '곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례로 계산한다.'], ['am', '덧셈, 뺄셈, 곱셈이 섞여 있는 식은 곱셈을 먼저 계산한다.'], ['ad', '덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 나눗셈을 먼저 계산한다.'], ['paren', '( )가 있는 식은 ( ) 안을 가장 먼저 계산한다.']];
      const bad = d.pick([['as', '덧셈과 뺄셈이 섞여 있는 식은 덧셈을 먼저 계산한다.', '덧셈과 뺄셈이 섞여 있는 식은 앞에서부터 차례로 계산한다.'], ['md', '곱셈과 나눗셈이 섞여 있는 식은 곱셈을 먼저 계산한다.', '곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례로 계산한다.'], ['ad', '덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 앞에서부터 차례로 계산한다.', '덧셈, 뺄셈, 나눗셈이 섞여 있는 식은 나눗셈을 먼저 계산한다.'], ['paren', '( )가 있는 식은 곱셈과 나눗셈을 계산한 다음 ( ) 안을 계산한다.', '( )가 있는 식은 ( ) 안을 가장 먼저 계산한다.']]);
      const rows = d.shuffle(d.shuffle(good.filter((row) => row[0] !== bad[0])).slice(0, 3).map((row) => [row[1], true]).concat([[bad[1], false]]));
      return C('혼합 계산의 순서에 대한 설명으로 옳지 않은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), { explain: bad[2], facts: { truth: rows.map((row) => row[1]), want: false } });
    }),
    T('or-rule-op', '가장 먼저 해야 하는 계산', '①47 ③17·23', (d) => {
      const s = G(d, d.pick(['a-b/c*d+e', 'a-b*c/d+e']), { test: soleFirst }), list = ['덧셈', '뺄셈', '곱셈', '나눗셈'], first = OPN[run(s).steps[0].op];
      return C('다음 식을 계산할 때 가장 먼저 해야 하는 계산은?', list, list.indexOf(first), { figure: show(s), explain: `곱셈과 나눗셈을 덧셈, 뺄셈보다 먼저 계산하고, 곱셈과 나눗셈은 앞에서부터 차례로 계산한다. 앞에 있는 ${first}을 가장 먼저 계산한다. ${chain(s)}`, facts: { truth: list.map((word) => word === first), want: true } });
    }),
    T('or-ltr', '앞에서부터 차례로 계산하는 식', '①52 ②20 ③22 심4', (d) => {
      const yes = G(d, d.pick(['a/b+c-d', 'a*b-c+d', 'a/b*c-d', 'a*b/c+d'])), no = d.shuffle(['a-b/c+d', 'a+b*c-d', 'a-(b+c)/d', 'a/b-(c+d)', 'a+b-c/d', 'a-b*c']).slice(0, 3).map((tpl) => G(d, tpl)), rows = d.shuffle([yes].concat(no));
      return C('앞에서부터 차례로 계산하는 식은?', LABELS, rows.indexOf(yes), {
        figure: tagged(rows.map((s) => ex(fmt(s)))), explain: `${LABELS[rows.indexOf(yes)]}은 곱셈·나눗셈이 덧셈·뺄셈보다 앞에 있고 ( )가 없으므로 앞에서부터 차례로 계산한다. 나머지 식은 뒤에 있는 곱셈·나눗셈이나 ( ) 안을 먼저 계산한다.`, facts: { truth: rows.map(isLtr), want: true }
      });
    }),
    T('or-seq', '계산하는 차례에 맞는 식', '②20', (d) => {
      // 곱셈 하나와 덧셈·뺄셈이 하나씩 있는 식 넷. 계산하는 차례가 서로 다르다.
      const rows = d.shuffle([['a+b*c-d', 'a*b+c-d'], ['a-b*c+d', 'a*b-c+d', 'a-b+c*d'], ['(a+b)*c-d'], ['(a-b)*c+d', 'a+(b-c)*d']].map((list) => G(d, d.pick(list)))), hit = d.int(0, 3), want = seqOf(rows[hit]);
      return C(`${want}의 차례로 계산하는 식은?`, rows.map(fmt), hit, { explain: rows.map((s) => `${fmt(s)}: ${seqOf(s)}`).join(' / '), facts: { truth: rows.map((s) => seqOf(s) === want), want: true } });
    }),
    T('or-same-order', '( )로 묶어도 계산 순서가 같은 식', '①53', (d) => {
      const div = d.bool(), base = G(d, div ? 'a+b/c-d' : 'a+b*c-d', { test: (x) => wraps(x).every((w) => val(w) !== null) }), rows = d.shuffle(wraps(base)), same = (s) => run(s).order.join() === run(base).order.join();
      return C(`${fj(base, '과/와')} 계산 순서가 같은 식은?`, rows.map(fmt), rows.findIndex(same), {
        explain: `${fmt(base)}에서는 ${div ? '나눗셈' : '곱셈'}을 가장 먼저 계산한다. 가장 먼저 계산하는 ${div ? '나눗셈' : '곱셈'}을 ( )로 묶은 식은 계산 순서가 바뀌지 않는다.`, facts: { truth: rows.map(same), want: true }
      });
    }),
    T('or-marked', '계산 순서를 바르게 나타낸 그림', '①51 ②18 ③21 심3', (d) => {
      const tpl = d.pick(['a-b*c+d', 'a-b/c+d']), s = G(d, tpl, { test: (x) => wrongOrders(x).length >= 4 && !sameBy(x, ids(x)) }), right = run(s).order, flat = ids(s), other = d.pick(wrongOrders(s).filter((p) => p.join() !== flat.join())), rows = d.shuffle([right, flat, other]);
      return C('계산하는 순서를 바르게 나타낸 것은?', GA, rows.findIndex((p) => p.join() === right.join()), {
        figure: tiles(rows.map((p, i) => [GA[i], tree(s, p)])), explain: `${ruleOf(s)} ${chain(s)}`, facts: { sequence: { ranks: flat.map((id) => right.indexOf(id)), options: rows }, rule: 'marked:' + tpl }
      });
    }),
    T('or-marked-all', '네 가지 연산이 섞인 식의 계산 순서 그림', '②18 심3', (d) => {
      const tpl = d.pick(['a/b-c+d*e', 'a-b/c+d*e', 'a+b*c-d/e']), s = G(d, tpl, { test: (x) => wrongOrders(x).length >= 6 }), right = run(s).order, flat = ids(s), bad = wrongOrders(s), has = (p) => bad.some((w) => w.join() === p.join());
      const other = d.pick(bad.filter((p) => p.join() !== flat.join())), rows = d.shuffle([right, has(flat) ? flat : d.pick(bad.filter((p) => p.join() !== other.join())), other]);
      return C('계산하는 순서를 바르게 나타낸 것은?', GA, rows.findIndex((p) => p.join() === right.join()), {
        figure: tiles(rows.map((p, i) => [GA[i], tree(s, p)])), explain: `${ruleOf(s)} 곱셈과 나눗셈은 앞에서부터 차례로 계산한다. ${chain(s)}`, facts: { sequence: { ranks: flat.map((id) => right.indexOf(id)), options: rows }, rule: 'marked:' + tpl }
      });
    }),
    T('or-marked-wrong', '계산 순서를 잘못 나타낸 그림', '③21', (d) => {
      const rows = [G(d, 'a-(b+c)', BIG), G(d, d.pick(['a+b/c', 'a-b*c'])), G(d, d.pick(['a-b/c+d', 'a+b*c-d']), { test: (x) => !sameBy(x, ids(x)) })], bad = d.int(0, 2);
      const orders = rows.map((s, i) => (i !== bad ? run(s).order : i === 2 ? ids(s) : run(s).order.slice().reverse()));
      return C('계산하는 순서를 잘못 나타낸 것은?', GA, bad, {
        figure: tiles(rows.map((s, i) => [GA[i], tree(s, orders[i])])), explain: `${GA[bad]}의 바른 계산은 ${chain(rows[bad])}이다. ${ruleOf(rows[bad])}`, facts: { truth: rows.map((s, i) => i !== bad), want: false }
      });
    }),
    T('or-tree-blanks', '계산 순서 그림의 빈칸', '③28', (d) => {
      const tpl = d.pick(['a+(b-c)/d', 'a+b-c/d', 'a-b*c+d']), s = G(d, tpl), r = run(s);
      return M('계산하는 순서에 따라 두 수씩 묶어 계산한 그림이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled(r.steps.map((st) => st.v)), { figure: tree(s, r.order, { blanks: LABELS.slice(0, 3) }), explain: why(s), facts: { calc: r.steps.map((st, k) => [st.made.src, k]), rule: 'tree:' + tpl } });
    }),
    T('or-who', '계산 순서를 바르게 말한 사람', '①54·58 ②19 ③35', (d) => {
      // 한 사람은 앞에서부터, 한 사람은 뒤의 덧셈(곱셈)부터 계산한다고 말한다.
      const tpl = d.pick(['a/b*c', 'a-b+c']), s = G(d, tpl, with_(tpl === 'a-b+c' ? BIG : MD, { test: (x) => slips(x, [1, 0]) })), [p, q] = parts(s), [good, other] = two(d), v = val(s), w = wrongValue(s, [1, 0]), swap = d.bool();
      const rows = d.shuffle([[good, v], [good, w], [other, v], [other, w]]), told = (who, piece) => `${name(who, '은/는')} 「${piece.replace(/\d+$/, (n) => josa(Number(n), '을/를'))} 먼저 계산한다.」`;
      return C(`${fmt(s)}의 계산 순서를 ${swap ? told(other, q) : told(good, p)}고 하였고, ${swap ? told(good, p) : told(other, q)}고 하였다. 바르게 말한 사람과 계산 결과를 알맞게 짝 지은 것은?`, rows.map(([who, x]) => `${who}, ${x}`), rows.findIndex(([who, x]) => who === good && x === v), {
        explain: `${tpl === 'a-b+c' ? '덧셈과 뺄셈' : '곱셈과 나눗셈'}이 섞여 있는 식은 앞에서부터 차례로 계산한다. ${chain(s)}`, facts: { truth: rows.map(([who, x]) => who === good && x === v), want: true }
      });
    }),
    T('or-talk', '곱셈이 있는 식에 대한 설명', '③24', (d) => {
      // 참인 말은 하나: 먼저 계산하는 부분, ( )로 묶어도 값이 같은 식, 계산 결과 가운데 한 자리만 참으로 둔다.
      const s = G(d, 'a-b*c+d', { test: (x) => slips(x, [0, 1, 2]) }), [a, b, c, e] = numbersOf(s), v = val(s), slip = wrongValue(s, [0, 1, 2]), hit = d.int(0, 2);
      const rows = d.shuffle([
        hit === 0 ? [`${b} × ${josa(c, '을/를')} 가장 먼저 계산한다.`, true] : [`${a} − ${josa(b, '을/를')} 가장 먼저 계산한다.`, false],
        hit === 1 ? [`${a} − (${b} × ${c}) + ${josa(e, '과/와')} 계산 결과가 같다.`, true] : [`(${a} − ${b}) × ${c} + ${josa(e, '과/와')} 계산 결과가 같다.`, false],
        hit === 2 ? [`계산 결과는 ${v}이다.`, true] : [`계산 결과는 ${slip}이다.`, false],
        ['앞에서부터 차례로 계산한다.', false]
      ]);
      return C('다음 식에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        figure: show(s), explain: `곱셈을 덧셈, 뺄셈보다 먼저 계산한다. ${chain(s)}이다. 먼저 계산하는 곱셈을 ( )로 묶어도 계산 결과는 같다.`, facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('fx-wrong-one', '잘못 계산한 식 찾기', '①56 ②26 ③30 심21', (d) => {
      // 틀린 식의 값은 앞에서부터 차례로만 계산한 값이다.
      const tpls = d.shuffle(['a-b*c+d', 'a+b*c-d', 'a-b/c+d', 'a+b/c-d', 'a-b+c*d']).slice(0, 3), bad = d.int(0, 2);
      const rows = tpls.map((tpl, i) => G(d, tpl, i === bad ? { test: (x) => slips(x, ids(x)) } : {})), said = rows.map((s, i) => (i === bad ? wrongValue(s, ids(s)) : val(s)));
      return C('계산이 잘못된 것은?', rows.map((s, i) => `${fmt(s)} = ${said[i]}`), bad, { explain: `곱셈과 나눗셈을 덧셈, 뺄셈보다 먼저 계산해야 한다. 바르게 계산하면 ${chain(rows[bad])}이다.`, facts: { claimed: rows.map((s, i) => [s, said[i]]), claimedWant: false } });
    }),
    T('fx-right-one', '바르게 계산한 식 찾기(곱셈과 나눗셈)', '①56·57 ②26 ③30', (d) => {
      // 틀린 식: ( )를 무시한 값, 곱셈을 나눗셈보다 먼저 한 값, 뒤의 나눗셈부터 한 값
      const s1 = G(d, 'a/(b*c)', with_(MD, { mul: 6, test: (x) => slips(x, null, unparen(x)) })), s2 = G(d, 'a/b*c', with_(MD, { test: (x) => slips(x, [1, 0]) })), s3 = G(d, 'a/b/c', with_(MD, { test: (x) => slips(x, [1, 0]) })), s4 = G(d, d.pick(['a*b/c', 'a*(b/c)']), MD);
      const rows = d.shuffle([[s1, wrongValue(s1, null, unparen(s1))], [s2, wrongValue(s2, [1, 0])], [s3, wrongValue(s3, [1, 0])], [s4, val(s4)]]);
      return C('바르게 계산한 것은?', rows.map(([s, x]) => `${fmt(s)} = ${x}`), rows.findIndex(([s]) => s === s4), { explain: `( ) 안을 먼저 계산하고, 곱셈과 나눗셈은 앞에서부터 차례로 계산한다. ${rows.map(([s]) => `${fmt(s)} = ${val(s)}`).join(', ')}`, facts: { claimed: rows, claimedWant: true } });
    }),
    T('fx-two-work', '세 사람의 풀이 가운데 바른 것', '②26 ③29', (d) => {
      // 틀린 풀이: 앞에서부터 차례로만 계산한 것, 곱셈 다음에 덧셈을 뺄셈보다 먼저 한 것
      const s = G(d, 'a-b*c+d', { test: (x) => slips(x, [0, 1, 2]) && slips(x, [1, 2, 0]) }), who = three(d), rows = d.shuffle([run(s).order, [0, 1, 2], [1, 2, 0]]);
      return C('같은 식을 세 사람이 계산하였다. 바르게 계산한 사람은?', who, rows.findIndex((p) => p.join() === run(s).order.join()), {
        figure: tiles(rows.map((p, i) => [who[i], workBox(work(s, p))])), explain: `곱셈을 먼저 계산하고, 덧셈과 뺄셈은 앞에서부터 차례로 계산한다. ${chain(s)}`, facts: { truth: rows.map((p) => p.join() === run(s).order.join()), want: true }
      });
    }),
    T('fx-am', '앞에서부터 계산한 풀이 바로잡기(곱셈)', '①59 ②27 심22', fixOf(['a-b*c+d', 'a+b*c-d'], (s) => [ids(s)])),
    T('fx-ad', '앞에서부터 계산한 풀이 바로잡기(나눗셈)', '①60 ③33 심22', fixOf(['a-b/c+d', 'a+b/c-d'], (s) => [ids(s)])),
    T('fx-md', '곱셈을 나눗셈보다 먼저 계산한 풀이 바로잡기', '②27 ③33 심22', fixOf('a/b*c', () => [[1, 0]], MD)),
    T('fx-paren-two', '( )를 무시한 풀이 바로잡기', '③32 심22', fixOf(each(['a-(b+c)', 'a/(b*c)']), (s) => [null, unparen(s)], with_(MD, { mul: 6, lo: 11, hi: 40 })), { count: 2 }),
    T('fx-paren-drop', '( ) 안의 한 수에만 곱한 풀이 바로잡기', '①62 ②28 심22', fixOf(['a-b*(c+d)', 'a*(b+c)-d'], (s) => [null, unparen(s)])),
    T('fx-paren-ltr', '( ) 다음에 앞에서부터 계산한 풀이 바로잡기', '①59 ②28 심22', fixOf(each(['a-b/(c+d)', 'a-(b+c)*d']), (s) => [parenThenLtr(s)], {}, {
      // 72 − 48 ÷ (8 + 16) 을 24 ÷ 24 로: 빼어지는 수와 빼는 수의 차도 ( ) 안의 합으로 나누어떨어지게 짓는다.
      'a-b/(c+d)': (d) => { const [k, c, q, p] = d.until(() => [d.int(5, 12), d.int(2, 9), d.int(2, 8), d.int(2, 8)], ([sum, x, y, z]) => sum - x >= 2 && sum - x !== x && new Set([sum * y + sum * z, sum * y, x, sum - x]).size === 4 && sum * (y + z) <= 150 && sum * y + sum * z - y !== z); return `${k * q + k * p}-${k * q}/(${c}+${k - c})`; }
    }), { count: 2 }),
    T('fx-first-line', '처음으로 잘못된 줄', '①61 ②29 ③31', (d, n) => {
      // 잘못된 차례: ( ) 다음에 덧셈·뺄셈을 곱셈·나눗셈보다 먼저, 곱셈을 나눗셈보다 먼저, 처음부터 앞에서부터. 첫 문항은 연산이 넷, 둘째 문항은 셋이다.
      const [tpl, order] = d.pick(n ? [['a+(b-c)/d', [1, 0, 2]], ['a-b*c+d', [0, 1, 2]], ['a-(b+c)*d', [1, 0, 2]]] : [['a/b+(c-d)*e', [2, 0, 1, 3]], ['a+b/(c-d)*e', [2, 3, 1, 0]], ['a*b-(c+d)/e', [2, 0, 1, 3]]]);
      const s = G(d, tpl, { test: (x) => slips(x, order) }), right = run(s).order, at = order.findIndex((id, k) => id !== right[k]), tags = LABELS.slice(0, order.length);
      return C('다음 계산에서 처음으로 잘못된 곳의 기호는?', tags, at, { figure: workBox(work(s, order), tags), explain: `${ruleOf(s)} 바르게 계산하면 ${chain(s)}이다. ${LABELS[at]}에서 계산 순서가 틀렸다.`, facts: { truth: tags.map((_, k) => k === at), want: true, rule: 'line:' + tpl } });
    }, { count: 2 }),
    T('fx-word-line', '문장제 풀이에서 처음으로 잘못된 곳', '①63', (d) => {
      // 식을 잘못 세운 풀이(㉠)와 식은 맞지만 뒤의 뺄셈부터 계산한 풀이(㉡)
      const b = d.int(13, 28), c = d.until(() => d.int(6, b - 4), (v) => v !== b), a = b + c + d.int(21, 48), badExpr = d.bool();
      const rows = badExpr ? [`${a} − (${b} − ${c})`, `= ${a} − ${b - c}`, `= ${a - (b - c)}`] : [`${a} − ${b} − ${c}`, `= ${a} − ${b - c}`, `= ${a - (b - c)}`];
      return C(`체육관에 학생 ${a}명이 있었다. 먼저 ${b}명이 나가고, 조금 뒤에 ${c}명이 더 나갔다. 체육관에 남은 학생 수를 구하는 풀이에서 처음으로 잘못된 곳의 기호는?`, LABELS.slice(0, 3), badExpr ? 0 : 1, {
        figure: lines(rows.map((row, i) => ex(row) + '<span style="margin-left:0.9em">' + LABELS[i] + '</span>')),
        explain: badExpr ? `나간 학생을 차례로 빼는 식은 ${a} − ${b} − ${c}이고, ( )를 쓰려면 ${a} − (${b} + ${c})이다. ㉠의 식이 틀렸다. ${a} − ${b} − ${c} = ${a - b - c}` : `뺄셈이 이어진 식은 앞에서부터 차례로 계산한다. ${a} − ${b} − ${c} = ${a - b} − ${c} = ${a - b - c}이다. ㉡에서 뒤의 뺄셈을 먼저 계산하였다.`,
        facts: { truth: [badExpr, !badExpr, false], want: true }
      });
    }),
    T('fx-why', '잘못 계산한 까닭', '①59 ②27 ③34 심22', (d) => {
      const kind = d.int(0, 3), [tpl, slip, o] = [['a-b*c+d', (s) => [[0, 1, 2]], {}], ['a-(b+c)', (s) => [null, unparen(s)], BIG], ['a/b*c', () => [[1, 0]], MD], ['a-(b+c*d)', () => [[1, 2, 0]], {}]][kind];
      const s = G(d, tpl, with_(o, { test: (x) => slips(x, slip(x)[0], slip(x)[1]) })), [order, from] = slip(s), pick = d.shuffle([0, 1, 2, 3]);
      const why4 = ['곱셈을 가장 먼저 계산해야 하는데 앞의 뺄셈을 먼저 계산하였다.', '( ) 안을 가장 먼저 계산해야 하는데 ( ) 밖을 먼저 계산하였다.', '앞에서부터 차례로 계산해야 하는데 뒤의 곱셈을 먼저 계산하였다.', '( ) 안에서 곱셈을 먼저 계산해야 하는데 덧셈을 먼저 계산하였다.'];
      return C('다음은 잘못 계산한 것이다. 잘못 계산한 까닭을 바르게 말한 것은?', pick.map((k) => why4[k]), pick.indexOf(kind), { figure: workBox(work(s, order, from)), explain: `${why4[kind]} 바르게 계산하면 ${chain(s)}이다.`, facts: { truth: pick.map((k) => k === kind), want: true } });
    })
  ]);

  // ── ( )가 있는 식과 없는 식 ───────────────────────────────────
  // ( )가 있는 식과 그 ( )를 지운 식의 크기 비교. 어느 쪽을 왼쪽에 놓을지는 섞는다.
  const parenCompare = (tpls, o, rule) => (d, n) => {
    const tpl = pickTpl(d, tpls, n), s = G(d, tpl, with_(o, { test: (x) => val(unparen(x)) !== null })), t = unparen(s), [l, r] = d.bool() ? [s, t] : [t, s];
    return C('○ 안에 &gt;, =, &lt; 중 알맞은 것은?', SIGNS, cmp(val(l), val(r)), { figure: versus(fmt(l), fmt(r)), explain: `${fmt(l)} = ${val(l)}, ${fmt(r)} = ${val(r)}`, facts: { choose: { exprs: [l, r], rule: 'compare' }, rule: rule + ':' + tpl } });
  };
  // ( )가 없어도 계산 결과가 같은 식 고르기: keep 틀 하나와 change 틀 둘
  const keepOf = (keep, change, o, said) => (d) => {
    const ok = (x) => val(unparen(x)) !== null, rows = d.shuffle([G(d, pickTpl(d, keep), with_(o, { test: ok }))].concat(d.shuffle(change).slice(0, 2).map((tpl) => G(d, tpl, with_(o, { test: ok })))));
    const same = (s) => val(unparen(s)) === val(s);
    return C('( )가 없어도 계산 결과가 같은 식은?', LABELS.slice(0, 3), rows.findIndex(same), { figure: tagged(rows.map((s) => ex(fmt(s)))), explain: `${said} ${rows.map((s, i) => `${LABELS[i]} ${fmt(s)} = ${val(s)}, ${fmt(unparen(s))} = ${val(unparen(s))}`).join(' / ')}`, facts: { claimed: rows.map((s) => [unparen(s), val(s)]), claimedWant: true } });
  };
  // 등식이 성립하도록 ( )로 묶을 곳 고르기: 묶는 자리마다 값이 자연수로 계산되고, 꼭 한 자리만 등식을 성립시킨다.
  const putOf = (tpls, o) => (d) => {
    // loose: 연산이 넷인 식은 묶어 보면 나누어떨어지지 않는 자리가 있어도 된다(그 자리는 답이 될 수 없다).
    const tpl = pickTpl(d, tpls), fine = (w) => (o && o.loose ? raw(w) > 0 : val(w) !== null), fits = (x) => { const base = unparen(x), v = val(x), list = wraps(base); return val(base) !== null && val(base) !== v && list.every(fine) && list.filter((w) => !differs(w, v)).length === 1; };
    const s = G(d, tpl, with_(o, { test: fits })), base = unparen(s), v = val(s), list = wraps(base), at = list.findIndex((w) => !differs(w, v));
    return C('다음 식이 성립하도록 ( )로 묶어야 하는 부분은?', parts(base), at, { figure: lines([ex(fmt(base) + ' = ' + v)]), explain: `( )가 없으면 ${fmt(base)} = ${val(base)}이다. ${parts(base)[at]}${tailOf(numbersOf(parts(base)[at]).pop(), '을/를')} ( )로 묶으면 ${chain(list[at])}이다.`, facts: { choose: { exprs: list, rule: 'equals', target: v }, rule: 'put:' + tpl } });
  };
  B.addTypes('5-1-1', 'paren', [
    T('pa-compare-as', '( )가 있는 식과 없는 식의 크기 비교(덧셈과 뺄셈)', '①64 ②31 ③38·39', parenCompare(['a-(b+c)', 'a-(b-c)', 'a+(b-c)'], BIG, 'paren:as')),
    T('pa-keep-as', '( )가 없어도 계산 결과가 같은 식(덧셈과 뺄셈)', '①55 ②33 ③41 심23', keepOf(['a+(b-c)', '(a-b)+c'], ['a-(b+c)', 'a-(b-c)'], BIG, '더하는 수를 묶은 ( )와 맨 앞을 묶은 ( )는 없어도 계산 결과가 같고, 빼는 수를 묶은 ( )는 없으면 계산 결과가 달라진다.')),
    T('pa-compare-md', '( )가 있는 식과 없는 식의 크기 비교(곱셈과 나눗셈)', '①65·66 ③39', parenCompare(each(['a/(b*c)', 'a*(b/c)']), with_(MD, { mul: 6, quo: 9 }), 'paren:md'), { count: 2 }),
    T('pa-both-md', '( )가 있는 식과 없는 식을 각각 계산하기', '①66 심20', (d) => {
      const s = G(d, 'a/(b*c)', with_(MD, { mul: 6, quo: 9, test: (x) => val(unparen(x)) !== null })), t = unparen(s);
      return M('두 식의 계산 결과를 각각 구하시오.', labelled([val(t), val(s)]), { figure: tagged([ex(fmt(t)), ex(fmt(s))]), explain: `㉠은 앞에서부터 차례로 계산한다. ${chain(t)}. ㉡은 ( ) 안을 먼저 계산한다. ${chain(s)}. ( )가 있으면 계산 결과가 달라진다.`, facts: { calc: [[t, 0], [s, 1]] } });
    }),
    T('pa-keep-md', '( )가 없어도 계산 결과가 같은 식(곱셈과 나눗셈)', '③41 심23', keepOf(['a*(b/c)', '(a/b)*c'], ['a/(b*c)', 'a/(b/c)'], with_(MD, { mul: 6, quo: 9 }), '곱하는 수를 묶은 ( )와 맨 앞을 묶은 ( )는 없어도 계산 결과가 같고, 나누는 수를 묶은 ( )는 없으면 계산 결과가 달라진다.')),
    T('pa-compare-am', '( )가 있는 식과 없는 식의 크기 비교(곱셈이 섞인 식)', '①67 ②31 ③38', parenCompare(['a*(b-c)+d', '(a+b)*c-d', 'a-b*(c+d)', 'a+(b-c)*d'], {}, 'paren:am')),
    T('pa-match-am', '( )의 자리가 다른 세 식과 계산 결과', '①68 ②32 ③36', (d) => {
      const base = G(d, 'a+b*c-d', { test: (x) => { const list = wraps(x); return list.every((w) => val(w) !== null) && new Set([val(x), val(list[0]), val(list[2])]).size === 3; } }), rows = d.shuffle([base, wrapAt(base, 0), wrapAt(base, 2)]), values = rows.map(val);
      const options = orderOptions(d, [0, 1, 2]).map((p) => p.map((k) => values[k]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', options.map((list) => list.map((x, i) => `${LABELS[i]} ${x}`).join(', ')), options.findIndex((list) => list.join() === values.join()), { figure: tagged(rows.map((s) => ex(fmt(s)))), explain: sayAll(rows), facts: { match: { exprs: rows, options } } });
    }),
    T('pa-target-ad', '( )의 자리가 다른 세 식 가운데 계산 결과가 주어진 수인 식', '①68 ②32 ③36', (d) => {
      // a + b ÷ c − d, (a + b) ÷ c − d, a + b ÷ (c − d) 가 모두 나누어떨어지게: b 는 c 와 c − d 의 배수, a 는 c 의 배수
      const [a, b, c, e] = d.until(() => { const c0 = d.int(4, 9), e0 = d.int(1, c0 - 2), k = c0 - e0, m = (c0 * k) / [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((g) => c0 % g === 0 && k % g === 0).pop(); return [c0 * d.int(2, 9), m * d.int(1, 4), c0, e0]; }, ([p, q, r, s]) => new Set([p, q, r, s]).size === 4 && q <= 99 && (p + q) / r > s && s >= 2 && new Set([p + q / r - s, (p + q) / r - s, p + q / (r - s)]).size === 3);
      const rows = d.shuffle([`${a}+${b}/${c}-${e}`, `(${a}+${b})/${c}-${e}`, `${a}+${b}/(${c}-${e})`]), hit = d.int(0, 2);
      return C(`계산 결과가 ${val(rows[hit])}인 식은?`, rows.map(fmt), hit, { explain: rows.map((s) => `${fmt(s)} = ${val(s)}`).join(', '), facts: { choose: { exprs: rows, rule: 'equals', target: val(rows[hit]) }, rule: 'target:paren' } });
    }),
    T('pa-compare-ad', '( )가 있는 식과 없는 식의 크기 비교(나눗셈이 섞인 식)', '①69 ②31 ③39·40', parenCompare(['(a-b)/c+d', 'a/(b-c)', 'a+b/(c-d)', '(a+b)/c-d'], {}, 'paren:ad')),
    T('pa-compare-all', '( )가 있는 식과 없는 식의 크기 비교(네 가지 연산이 섞인 식)', '①70 ③40', parenCompare(['a-b/(c*d)+e', 'a*b/(c+d)', 'a+b/(c*d)-e'], { mul: 5 }, 'paren:all')),
    T('pa-keep-mixed', '( )가 없어도 계산 결과가 같은 식(섞인 식)', '①55 ②33 ③42 심23', (d) => {
      const div = d.bool(), base = G(d, div ? 'a+b/c-d' : 'a+b*c-d', { test: (x) => { const list = wraps(x); return list.every((w) => val(w) !== null) && val(list[0]) !== val(x) && val(list[2]) !== val(x); } }), rows = d.shuffle(wraps(base)), same = (s) => val(s) === val(base);
      return C('( )가 없어도 계산 결과가 같은 식은?', LABELS.slice(0, 3), rows.findIndex(same), { figure: tagged(rows.map((s) => ex(fmt(s)))), explain: `( )가 없으면 ${chain(base)}이다. 먼저 계산하는 ${div ? '나눗셈' : '곱셈'}을 묶은 ( )는 없어도 계산 결과가 같다. ${sayAll(rows)}`, facts: { claimed: rows.map((s) => [base, val(s)]), claimedWant: true, rule: 'keep:mixed' } });
    }),
    T('pa-same-pair', '( )의 자리만 다른 식 가운데 계산 결과가 같은 두 식', '심15', (d) => {
      // a + b × c − d, (a + b) × c − d, a + b × (c − d), a + (b × c − d): 첫째와 넷째만 같다.
      const base = G(d, 'a+b*c-d', { test: (x) => { const list = wraps(x), [, b, c, e] = numbersOf(x); return list.every((w) => val(w) !== null) && b * c > e && new Set([val(x), val(list[0]), val(list[2])]).size === 3; } }), [a, b, c, e] = numbersOf(base);
      const rows = d.shuffle([base, wrapAt(base, 0), wrapAt(base, 2), `${a}+(${b}*${c}-${e})`]), i = rows.indexOf(base), j = rows.indexOf(`${a}+(${b}*${c}-${e})`), right = [Math.min(i, j), Math.max(i, j)];
      const pairs = d.shuffle([right].concat(d.shuffle([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].filter((p) => p.join() !== right.join())).slice(0, 3)));
      return C('계산 결과가 같은 두 식을 찾아 기호를 쓴 것은?', pairs.map(([x, y]) => `${LABELS[x]}, ${LABELS[y]}`), pairs.findIndex((p) => p.join() === right.join()), { figure: tagged(rows.map((s) => ex(fmt(s)))), explain: `${sayAll(rows)}이다. 곱셈을 먼저 계산하므로 ${b} × ${c} − ${josa(e, '을/를')} ( )로 묶어도 계산 결과가 같다.`, facts: { choose: { exprs: rows, rule: 'same', pairsShown: pairs } } });
    }),
    T('pa-put-am', '등식이 성립하도록 ( )로 묶을 곳(곱셈이 섞인 식)', '①82 ②34 ③52 심24', putOf(['a+b*(c-d)', '(a+b)*c-d', 'a-b*(c+d)', '(a-b)*c+d'])),
    T('pa-put-ad', '등식이 성립하도록 ( )로 묶을 곳(나눗셈이 섞인 식)', '②34 ③52 심24', putOf(['a/(b+c)-d', '(a+b)/c-d', '(a-b)/c+d'])),
    T('pa-put-mul', '등식이 성립하도록 곱셈을 ( )로 묶기', '②35 ③51 심24', putOf(['a+b/(c*d)', 'a/(b*c)+d', 'a/(b*c)-d'], { mul: 5 })),
    T('pa-put-all', '등식이 성립하도록 ( )로 묶을 곳(네 가지 연산이 섞인 식)', '①83 ②34 ③53 심24', putOf(['a/(b+c)*d-e', 'a/b+c*(d-e)', 'a-b/(c+d)*e', 'a*(b-c)+d/e'], { mul: 6, loose: true }))
  ]);
  // ── 계산 결과의 크기 비교 ─────────────────────────────────────
  // 맨 바깥에 따로 놓인 수가 있어 계산 결과를 정해 놓고 지을 수 있는 틀
  const AM = ['a*b-c+d', 'a-b*c+d', 'a*(b-c)+d', 'a+(b-c)*d', 'a+b*(c-d)', '(a-b)*c+d'];
  const AD = ['a-b/c+d', 'a/b-c+d', '(a+b)/c+d', 'a+b/(c-d)', 'a/(b-c)+d', 'a+(b-c)/d'];
  const ALL = ['a/b*c-d+e', 'a-b/c*d+e', 'a+b*(c-d)/e', 'a*b-c/d+e', 'a*b/c-d+e', 'a/(b+c)*d+e'];
  const hitting = (d, tpls, v, o) => G(d, pickTpl(d, tpls), with_(o, { hit: v }));
  // 서로 다른 틀 n개
  const someOf = (d, list, n) => d.shuffle(list).slice(0, n);
  // v 에서 lo~hi 만큼 떨어진 수(같지 않다)
  const off = (d, v, lo, hi) => { const gap = d.int(lo, hi); return v - gap >= 6 && d.bool() ? v - gap : v + gap; };
  const compareOf = (rule, left, right) => (d) => {
    const l = left(d), v = val(l), w = d.int(0, 2) === 0 ? v : off(d, v, 1, 9), r = right(d, w, l);
    return C('○ 안에 &gt;, =, &lt; 중 알맞은 것은?', SIGNS, cmp(v, w), { figure: versus(fmt(l), fmt(r)), explain: `${fmt(l)} = ${v}, ${fmt(r)} = ${w}`, facts: { choose: { exprs: [l, r], rule: 'compare' }, rule } });
  };
  const tagAll = (rows) => tagged(rows.map((s) => ex(fmt(s))));
  const byLabel = (orders) => orders.map((p) => p.map((k) => LABELS[k]).join(', '));
  B.addTypes('5-1-1', 'compare', [
    T('cp-two-as', '서로 다른 두 식의 크기 비교(덧셈과 뺄셈)', '①71 ②37 ③43', compareOf('two:as', (d) => G(d, 'a-b+c', with_(BIG, { min: 12, max: 50 })), (d, w) => hitting(d, 'a-(b+c)', w, BIG))),
    T('cp-two-md', '서로 다른 두 식의 크기 비교(곱셈과 나눗셈)', '②37 심12', (d) => {
      const l = G(d, 'a*(b/c)', with_(MD, { min: 12, max: 120 })), v = val(l), w = d.until(() => (d.int(0, 2) === 0 ? v : off(d, v, 1, 12)), (x) => mdHit(d, x) !== null), r = mdHit(d, w);
      return C('○ 안에 &gt;, =, &lt; 중 알맞은 것은?', SIGNS, cmp(v, w), { figure: versus(fmt(l), fmt(r)), explain: `${fmt(l)} = ${v}, ${fmt(r)} = ${w}`, facts: { choose: { exprs: [l, r], rule: 'compare' }, rule: 'two:md' } });
    }),
    T('cp-two-mixed', '서로 다른 두 식의 크기 비교(곱셈 또는 나눗셈이 섞인 식)', '①71 ②37', compareOf('two:mixed', (d) => G(d, d.pick(AM), { min: 12, max: 90 }), (d, w) => hitting(d, AD, w))),
    T('cp-bigger-all', '계산 결과가 더 큰 식을 쓴 사람', '③43·45 심12', (d) => {
      const [who, other] = two(d), [first, second] = someOf(d, ALL, 2), l = G(d, first, { min: 12, max: 90 }), r = hitting(d, second, off(d, val(l), 1, 9)), rows = [l, r];
      return C(`${name(who, '과/와')} ${name(other, '이/가')} 쓴 식이다. 계산 결과가 더 큰 식을 쓴 사람은?`, [who, other], val(l) > val(r) ? 0 : 1, { figure: lines(rows.map((s, i) => `<span class="mb-tag mb-tag-short" style="min-width:3em">${[who, other][i]}</span>${ex(fmt(s))}`)), explain: `${who}: ${fmt(l)} = ${val(l)}, ${other}: ${fmt(r)} = ${val(r)}`, facts: { choose: { exprs: rows, rule: 'max' } } });
    }),
    T('cp-number', '식과 수의 크기 비교', '①79 ②37 ③44', (d) => {
      const s = G(d, d.pick(AM.concat(AD, ['a/(b*c)+d', 'a/b*(c+d)-e'])), { mul: 8, min: 8, max: 120 }), v = val(s), n = d.until(() => (d.int(0, 2) === 0 ? v : off(d, v, 1, 8)), (x) => !numbersOf(s).includes(x));
      return C('○ 안에 &gt;, =, &lt; 중 알맞은 것은?', SIGNS, cmp(v, n), { figure: versus(fmt(s), String(n)), explain: `${chain(s)}이다.`, facts: { choose: { exprs: [s, String(n)], rule: 'compare' }, rule: 'number' } });
    }),
    T('cp-order-as', '네 식을 계산 결과가 큰 것부터 차례로 쓰기', '①72', (d) => {
      const c = d.int(4, 15), b = c + d.int(3, 14), a = b + c + d.int(6, 30), rows = d.shuffle([`${a}+${b}-${c}`, `${a}-(${b}+${c})`, `${a}+${b}+${c}`, `${a}-(${b}-${c})`]);
      const right = [0, 1, 2, 3].sort((x, y) => val(rows[y]) - val(rows[x])), orders = orderOptions(d, right);
      return C('계산 결과가 큰 것부터 차례로 기호를 쓴 것은?', byLabel(orders), orders.findIndex((p) => p.join() === right.join()), { figure: tagAll(rows), explain: sayAll(rows), facts: { choose: { exprs: rows, rule: 'descending', orders } } });
    }),
    T('cp-order-md', '세 식을 계산 결과가 큰 것부터 차례로 쓰기(곱셈과 나눗셈)', '①73', (d) => {
      const rows = d.until(() => d.shuffle([G(d, 'a*b/c', MD), G(d, 'a/b*c', MD), G(d, 'a*(b/c)', MD)]), (list) => new Set(list.map(val)).size === 3 && Math.max.apply(null, list.map(val)) - Math.min.apply(null, list.map(val)) <= 60);
      const right = [0, 1, 2].sort((x, y) => val(rows[y]) - val(rows[x])), orders = orderOptions(d, right);
      return C('계산 결과가 큰 것부터 차례로 기호를 쓴 것은?', byLabel(orders), orders.findIndex((p) => p.join() === right.join()), { figure: tagAll(rows), explain: sayAll(rows), facts: { choose: { exprs: rows, rule: 'descending', orders }, rule: 'order:md' } });
    }),
    T('cp-order-mixed', '세 식을 계산 결과가 작은 것부터 차례로 쓰기', '①74 ②38 ③47 심13', (d) => {
      const v = d.int(15, 60), gaps = d.shuffle([0, d.int(2, 6), d.int(7, 12)]), tpls = someOf(d, AM, 2).concat(someOf(d, AD, 1)), rows = tpls.map((tpl, i) => hitting(d, tpl, v + gaps[i]));
      const right = [0, 1, 2].sort((x, y) => val(rows[x]) - val(rows[y])), orders = orderOptions(d, right);
      return C('계산 결과가 작은 것부터 차례로 기호를 쓴 것은?', byLabel(orders), orders.findIndex((p) => p.join() === right.join()), { figure: tagAll(rows), explain: sayAll(rows), facts: { choose: { exprs: rows, rule: 'ascending', orders } } });
    }),
    T('cp-order-all', '네 가지 연산이 섞인 세 식을 큰 것부터 차례로 쓰기', '①75 심13', (d) => {
      const v = d.int(15, 60), gaps = d.shuffle([0, d.int(2, 6), d.int(7, 12)]), rows = someOf(d, ALL, 3).map((tpl, i) => hitting(d, tpl, v + gaps[i]));
      const right = [0, 1, 2].sort((x, y) => val(rows[y]) - val(rows[x])), orders = orderOptions(d, right);
      return C('계산 결과가 큰 것부터 차례로 기호를 쓴 것은?', byLabel(orders), orders.findIndex((p) => p.join() === right.join()), { figure: tagAll(rows), explain: sayAll(rows), facts: { choose: { exprs: rows, rule: 'descending', orders }, rule: 'order:all' } });
    }),
    T('cp-max-md', '계산 결과가 가장 큰 식(곱셈과 나눗셈)', '③46 심14', (d) => {
      const rows = d.until(() => d.shuffle([G(d, 'a*b/c', MD), G(d, 'a/b*c', MD), G(d, 'a*(b/c)', MD), G(d, 'a/(b*c)', with_(MD, { mul: 6 }))]), (list) => { const values = list.map(val).sort((x, y) => y - x); return new Set(values).size === 4 && values[0] - values[1] <= 15; });
      return C('계산 결과가 가장 큰 식은?', LABELS, rows.map(val).indexOf(Math.max.apply(null, rows.map(val))), { figure: tagAll(rows), explain: sayAll(rows), facts: { choose: { exprs: rows, rule: 'max' } } });
    }),
    T('cp-min-mixed', '계산 결과가 가장 작은 식', '②38 ③46', (d) => {
      const v = d.int(12, 50), gaps = d.shuffle([0, d.int(1, 4), d.int(5, 9), d.int(10, 15)]), rows = someOf(d, AM, 2).concat(someOf(d, AD, 2)).map((tpl, i) => hitting(d, tpl, v + gaps[i]));
      return C('계산 결과가 가장 작은 식은?', LABELS, gaps.indexOf(0), { figure: tagAll(rows), explain: sayAll(rows), facts: { choose: { exprs: rows, rule: 'min' } } });
    }),
    T('cp-odd-as', '계산 결과가 다른 하나(덧셈과 뺄셈)', '②32 심16', (d) => {
      const s = G(d, 'a-(b+c)', BIG), [a, b, c] = numbersOf(s), rows = d.shuffle([`${a}-${b}+${c}`, `${a}+${c}-${b}`, s, `(${a}-${b})+${c}`]);
      return C('계산 결과가 나머지 셋과 다른 식은?', LABELS, rows.indexOf(s), { figure: tagAll(rows), explain: `${sayAll(rows)}이다. 빼는 수를 ( )로 묶으면 ${josa(b, '과/와')} ${josa(c, '을/를')} 모두 빼게 된다.`, facts: { choose: { exprs: rows, rule: 'odd' } } });
    }),
    T('cp-odd-md', '계산 결과가 다른 하나(곱셈과 나눗셈)', '①76 ③48', (d) => {
      const s = G(d, 'a/(b*c)', with_(MD, { mul: 6, cap: 99, test: (x) => val(unparen(x)) !== null })), [a, b, c] = numbersOf(s), rows = d.shuffle([`${a}/${b}*${c}`, `${a}*${c}/${b}`, s, `${c}*(${a}/${b})`]);
      return C('계산 결과가 나머지 셋과 다른 식은?', LABELS, rows.indexOf(s), { figure: tagAll(rows), explain: `${rows.map((x, i) => `${LABELS[i]} ${fmt(x)} = ${raw(x)}`).join(', ')}이다. 나누는 수를 ( )로 묶으면 ${josa(b, '과/와')} ${josa(c, '으로/로')} 모두 나누게 된다.`, facts: { choose: { exprs: rows, rule: 'odd' }, rule: 'odd:md' } });
    }),
    T('cp-odd-mixed', '서로 다른 세 식 가운데 계산 결과가 다른 하나', '①76 ②39', (d) => {
      const v = d.int(15, 60), w = off(d, v, 2, 10), rows = d.shuffle(someOf(d, AM, 3).map((tpl, i) => hitting(d, tpl, i === 0 ? w : v)));
      return C('계산 결과가 나머지 둘과 다른 식은?', LABELS.slice(0, 3), rows.findIndex((s) => val(s) === w), { figure: tagAll(rows), explain: sayAll(rows), facts: { choose: { exprs: rows, rule: 'odd' } } });
    }),
    T('cp-same-md', '계산 결과가 같은 두 식', '②39 심15', (d) => {
      const [first, v, twin] = d.until(() => { const s = G(d, d.pick(['a*(b/c)', 'a*b/c']), with_(MD, { min: 12, max: 120 })); return [s, val(s), mdHit(d, val(s))]; }, (row) => row[2] !== null);
      const others = d.until(() => [off(d, v, 2, 12), off(d, v, 2, 12)].map((x) => mdHit(d, x)), (list) => list.every(Boolean) && val(list[0]) !== val(list[1]));
      const rows = d.shuffle([first, twin].concat(others)), i = rows.indexOf(first), j = rows.indexOf(twin), right = [Math.min(i, j), Math.max(i, j)];
      const pairs = d.shuffle([right].concat(d.shuffle([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].filter((p) => p.join() !== right.join())).slice(0, 3)));
      return C('계산 결과가 같은 두 식을 찾아 기호를 쓴 것은?', pairs.map(([x, y]) => `${LABELS[x]}, ${LABELS[y]}`), pairs.findIndex((p) => p.join() === right.join()), { figure: tagAll(rows), explain: sayAll(rows), facts: { choose: { exprs: rows, rule: 'same', pairsShown: pairs }, rule: 'same:md' } });
    }),
    T('cp-match-as', '식과 계산 결과 짝 짓기', '①77 ②40', (d) => {
      const c = d.int(4, 15), b = c + d.int(3, 14), a = b + d.int(6, 30), rows = d.shuffle([`${a}+${b}-${c}`, `${a}-(${b}-${c})`, `${a}+${b}+${c}`]), values = rows.map(val);
      const options = orderOptions(d, [0, 1, 2]).map((p) => p.map((k) => values[k]));
      return C('식과 계산 결과를 알맞게 짝 지은 것은?', options.map((list) => list.map((x, i) => `${LABELS[i]} ${x}`).join(', ')), options.findIndex((list) => list.join() === values.join()), { figure: tagAll(rows), explain: sayAll(rows), facts: { match: { exprs: rows, options }, rule: 'match:as' } });
    }),
    T('cp-target', '계산 결과가 주어진 수인 식', '①78 ②41 심17', (d) => {
      const v = d.int(15, 60), others = d.until(() => [off(d, v, 1, 9), off(d, v, 1, 9)], ([x, y]) => x !== y), values = d.shuffle([v].concat(others)), tpls = someOf(d, AD, 2).concat(someOf(d, AM, 1)), rows = tpls.map((tpl, i) => hitting(d, tpl, values[i]));
      return C(`계산 결과가 ${v}인 식은?`, rows.map(fmt), values.indexOf(v), { explain: rows.map((s) => `${fmt(s)} = ${val(s)}`).join(', '), facts: { choose: { exprs: rows, rule: 'equals', target: v }, rule: 'target' } });
    }),
    T('cp-equal-md', '주어진 식과 계산 결과가 같은 식', '①78', (d) => {
      const [base, v, twin] = d.until(() => { const s = G(d, 'a*b/c', with_(MD, { min: 12, max: 120 })); return [s, val(s), mdHit(d, val(s))]; }, (row) => row[2] !== null);
      const others = d.until(() => [off(d, v, 2, 12), off(d, v, 2, 12)].map((x) => mdHit(d, x)), (list) => list.every(Boolean) && val(list[0]) !== val(list[1])), rows = d.shuffle([twin].concat(others));
      return C(`${fj(base, '과/와')} 계산 결과가 같은 식은?`, rows.map(fmt), rows.indexOf(twin), { explain: `${fmt(base)} = ${v}이다. ${rows.map((s) => `${fmt(s)} = ${val(s)}`).join(', ')}`, facts: { choose: { exprs: rows, rule: 'equals', target: v } } });
    }),
    T('cp-below', '계산 결과가 주어진 수보다 작은(큰) 식', '②41 ③46 심17', (d) => {
      const below = d.bool(), n = d.int(20, 50), values = d.shuffle([below ? n - d.int(1, 8) : n + d.int(1, 8)].concat(d.until(() => [d.int(1, 9), d.int(1, 9)], ([x, y]) => x !== y).map((gap) => (below ? n + gap : n - gap))));
      const rows = someOf(d, AM, 2).concat(someOf(d, AD, 1)).map((tpl, i) => hitting(d, tpl, values[i])), hit = values.findIndex((x) => (below ? x < n : x > n));
      return C(`계산 결과가 ${n}보다 ${below ? '작은' : '큰'} 식은?`, rows.map(fmt), hit, { explain: rows.map((s) => `${fmt(s)} = ${val(s)}`).join(', '), facts: { choose: { exprs: rows, rule: below ? 'onlyBelow' : 'onlyAbove', target: n } } });
    }),
    T('cp-nearest', '주어진 수에 가장 가까운 식', '①81 ②42', (d) => {
      const n = d.int(3, 7) * 10, gaps = [d.int(1, 4), d.int(5, 8), d.int(9, 13)], values = d.shuffle(gaps.map((gap) => (d.bool() ? n - gap : n + gap))), rows = someOf(d, AM, 2).concat(someOf(d, ALL, 1)).map((tpl, i) => hitting(d, tpl, values[i]));
      return C(`계산 결과가 ${n}에 가장 가까운 식은?`, rows.map(fmt), values.findIndex((x) => Math.abs(x - n) === gaps[0]), { explain: `${rows.map((s) => `${fmt(s)} = ${val(s)}`).join(', ')}이다. ${josa(n, '과/와')}의 차가 가장 작은 것을 찾는다.`, facts: { choose: { exprs: rows, rule: 'nearest', target: n } } });
    })
  ]);

  // ── □가 있는 식 ──────────────────────────────────────────────
  const eqBox = (html) => lines([ex(html)]);
  const SIGN4 = ['+', '−', '×', '÷'], OPS = ['+', '-', '*', '/'];
  // k번째 연산 기호를 바꾼 식, ○로 가린 식
  const swapOp = (s, k, op) => lex(s).map((t) => (t.p ? t.p : t.op ? (t.id === k ? op : t.op) : t.n)).join('');
  const holed = (s, k) => lex(s).map((t) => (t.p ? t.p : t.op ? ' ' + (t.id === k ? '○' : SIGN[t.op]) + ' ' : t.n)).join('');
  const signOf = (tpls, o) => (d) => {
    // 가린 자리에 네 기호를 넣어 보아 등식이 성립하는 것은 하나뿐이다.
    const tpl = pickTpl(d, tpls), [s, k] = d.until(() => { const x = G(d, tpl, o); return [x, d.pick(ids(x))]; }, ([x, at]) => OPS.filter((op) => !differs(swapOp(x, at, op), val(x))).length === 1), v = val(s), right = OPS.findIndex((op) => !differs(swapOp(s, k, op), v));
    return C('○ 안에 알맞은 연산 기호는?', SIGN4, right, { figure: eqBox(`${holed(s, k)} = ${v}`), explain: `○ 안에 ${SIGN4[right]}를 넣으면 ${chain(s)}이다.`, facts: { claimed: OPS.map((op) => [swapOp(s, k, op), v]), claimedWant: true } });
  };
  B.addTypes('5-1-1', 'box', [
    T('bx-end', '□가 맨 뒤에 있는 식', '①88 ②44 심29', (d) => {
      const s = G(d, d.pick(['a-b*c', 'a+b/c', 'a-b*c/d', 'a*b-c/d']), { min: 8, max: 90 }), k = val(s), plus = d.bool(), x = d.until(() => (plus ? d.int(4, 30) : d.int(2, k - 3)), (n) => !numbersOf(s).includes(n)), v = plus ? k + x : k - x;
      return N('□ 안에 알맞은 수는?', x, { figure: eqBox(`${fmt(s)} ${plus ? '+' : '−'} ${box()} = ${v}`), explain: `${fmt(s)} = ${k}이므로 ${k} ${plus ? '+' : '−'} □ = ${v}이다. □ = ${plus ? `${v} − ${k}` : `${k} − ${v}`} = ${x}`, facts: { calc: [[plus ? `${v}-(${s})` : `(${s})-${v}`, 0]] } });
    }),
    T('bx-front-add', '□가 맨 앞에 있는 식(나눗셈이 있는 식)', '③54 심29', (d) => {
      const tail = G(d, 'a/b'), [a, b] = numbersOf(tail), q = a / b, x = d.int(6, 40), c = d.until(() => d.int(2, x + q - 2), (n) => n !== a && n !== b && n !== q), v = x + q - c;
      return N('□ 안에 알맞은 수는?', x, { figure: eqBox(`${box()} + ${a} ÷ ${b} − ${c} = ${v}`), explain: `${a} ÷ ${b} = ${q}이므로 □ + ${q} − ${c} = ${v}이다. □ + ${q} = ${v + c}이므로 □ = ${v + c} − ${q} = ${x}`, facts: { calc: [[`${v}+${c}-${a}/${b}`, 0]] } });
    }),
    T('bx-front-sub', '□가 맨 앞에 있는 식(( )와 곱셈이 있는 식)', '③54', (d) => {
      const tail = G(d, 'a*(b-c)', { max: 90 }), k = val(tail), v = d.until(() => d.int(3, 40), (n) => !numbersOf(tail).includes(n));
      return N('□ 안에 알맞은 수는?', v + k, { figure: eqBox(`${box()} − ${fmt(tail)} = ${v}`), explain: `${fmt(tail)} = ${k}이므로 □ − ${k} = ${v}이다. □ = ${v} + ${k} = ${v + k}`, facts: { calc: [[`${v}+${tail}`, 0]] } });
    }),
    T('bx-mid', '□가 가운데에 있는 덧셈과 뺄셈', '②44', (d) => {
      const a = d.int(41, 90), x = d.int(11, a - 8), b = d.until(() => d.int(6, 30), (n) => n !== x), v = a - x + b;
      return N('□ 안에 알맞은 수는?', x, { figure: eqBox(`${a} − ${box()} + ${b} = ${v}`), explain: `${a} − □ = ${v} − ${b} = ${v - b}이므로 □ = ${a} − ${v - b} = ${x}`, facts: { calc: [[`${a}+${b}-${v}`, 0]] } });
    }),
    T('bx-md', '□가 있는 곱셈과 나눗셈', '②44 ③55', (d) => {
      const front = d.bool(), s = G(d, front ? 'a/b*c' : 'a*b/c', with_(MD, { test: (x) => new Set(numbersOf(x).concat([val(x)])).size === 4 })), [a, b, c] = numbersOf(s), v = val(s);
      return front
        ? N('□ 안에 알맞은 수는?', c, { figure: eqBox(`${a} ÷ ${b} × ${box()} = ${v}`), explain: `${a} ÷ ${b} = ${a / b}이므로 ${a / b} × □ = ${v}이다. □ = ${v} ÷ ${a / b} = ${c}`, facts: { calc: [[`${v}/(${a}/${b})`, 0]] } })
        : N('□ 안에 알맞은 수는?', c, { figure: eqBox(`${a} × ${b} ÷ ${box()} = ${v}`), explain: `${a} × ${b} = ${a * b}이므로 ${a * b} ÷ □ = ${v}이다. □ = ${a * b} ÷ ${v} = ${c}`, facts: { calc: [[`${a}*${b}/${v}`, 0]] } });
    }),
    T('bx-two-sides', '등호의 양쪽이 식인 □', '심30', (d) => {
      const fits = (x, k) => [2, 3, 4, 5, 6, 7, 8, 9].filter((e) => k % e === 0 && k / e >= 2 && !numbersOf(x).includes(e));
      const s = G(d, d.pick(['(a-b)/c+d', 'a-b*c+d', 'a/b+c*d']), { min: 8, max: 72, test: (x, r) => fits(x, r.value).length > 0 }), k = val(s), e = d.pick(fits(s, k));
      return N('□ 안에 알맞은 수는?', k / e, { figure: eqBox(`${fmt(s)} = ${e} × ${box()}`), explain: `${chain(s)}이므로 ${e} × □ = ${k}이다. □ = ${k} ÷ ${e} = ${k / e}`, facts: { calc: [[`(${s})/${e}`, 0]] } });
    }),
    T('bx-range-max', '□ 안에 들어갈 수 있는 가장 큰 자연수', '①90 ②48 ③57 심36', (d) => {
      const s = G(d, d.pick(['a+b/(c-d)*e', 'a*(b-c)+d', 'a-b/c*d+e', '(a+b)/c-d']), { min: 6, max: 80 }), k = val(s);
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', k - 1, { figure: eqBox(`${fmt(s)} &gt; ${box()}`), explain: `${chain(s)}이다. ${k} &gt; □이므로 □ 안에 들어갈 수 있는 가장 큰 자연수는 ${k - 1}이다.`, facts: { range: { ineq: `${s}>x`, lo: 1, hi: k + 10, want: 'max' } } });
    }),
    T('bx-range-min', '□ 안에 들어갈 수 있는 가장 작은 자연수', '①90 ②48 ③57 심36', (d) => {
      const s = G(d, d.pick(['a+(b+c)/d-e', 'a+b*(c-d)', 'a-(b+c)+d', 'a*(b-c)/d+e']), { min: 6, max: 80 }), k = val(s);
      return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 작은 수는?', k + 1, { figure: eqBox(`${fmt(s)} &lt; ${box()}`), explain: `${chain(s)}이다. ${k} &lt; □이므로 □ 안에 들어갈 수 있는 가장 작은 자연수는 ${k + 1}이다.`, facts: { range: { ineq: `${s}<x`, lo: 1, hi: k + 10, want: 'min' } } });
    }),
    T('bx-range-count', '□ 안에 들어갈 수 있는 자연수의 개수', '①91 ②49', (d) => {
      const s = G(d, d.pick(['a+(b-c)/d', 'a/b+c-d', 'a-b/c', 'a-(b+c)*d']), { min: 4, max: 12 }), k = val(s);
      return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', k - 1, { unit: '개', figure: eqBox(`${fmt(s)} &gt; ${box()}`), explain: `${chain(s)}이다. ${k} &gt; □이므로 □ 안에 들어갈 수 있는 자연수는 1부터 ${k - 1}까지 ${k - 1}개이다.`, facts: { digit: { template: `${s}>□`, lo: 1, hi: 30, ask: 'count' } } });
    }),
    T('bx-sign', '○ 안에 알맞은 연산 기호', '①85 ②53 ③59 심39', signOf(['a-b*c+d', 'a+b/c-d', 'a*b-c/d', 'a/b+c*d'])),
    T('bx-sign-paren', '( )가 있는 식의 ○ 안에 알맞은 연산 기호', '①85 ③59 심39', signOf(['a/(b-c)+d*e', 'a-(b+c)/d', 'a*(b/c)-d', 'a+(b-c)*d', 'a-b/(c+d)*e']))
  ]);

  // ── 말과 식 ──────────────────────────────────────────────────
  // 말이나 문제에 알맞은 식 고르기: 첫 식이 답이다. 나머지 식은 값이 달라야 한다(뜻이 같은 식이 보기에 둘 있지 않게).
  const pickExpr = (d, text, exprs, explain, figure) => { const v = val(exprs[0]), rows = d.shuffle(exprs); return C(text, rows.map(fmt), rows.indexOf(exprs[0]), { figure, explain, facts: { claimed: rows.map((s) => [s, v]), claimedWant: true } }); };
  const apartFrom = (exprs) => exprs.slice(1).every((s) => val(s) !== null && val(s) !== val(exprs[0]));
  // 문제를 보기로 낼 때: 참인 문제가 첫째
  const pickStory = (d, s, stories, explain) => { const rows = d.shuffle(stories.map((text, i) => [text, i === 0])); return C('다음 식으로 답을 구할 수 있는 문제는?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: show(s), explain, facts: { truth: rows.map((row) => row[1]), want: true } }); };
  B.addTypes('5-1-1', 'say', [
    T('sy-as-value', '말로 나타낸 수(덧셈과 뺄셈)', '①94 ②50 ③67', (d) => {
      const s = G(d, 'a-(b+c)', BIG), [a, b, c] = numbersOf(s);
      return N(`${a}에서 ${josa(b, '과/와')} ${c}의 합을 뺀 수는?`, val(s), { explain: `${josa(b, '과/와')} ${c}의 합을 먼저 구해야 하므로 ( )로 묶어 식으로 나타낸다. ${chain(s)}`, facts: { calc: [[s, 0]] } });
    }),
    T('sy-md-pick', '말에 알맞은 식(곱셈과 나눗셈)', '①95 ②51 ③68·70 심51', (d) => {
      const s = G(d, 'a/(b*c)', with_(MD, { mul: 6, test: (x) => val(unparen(x)) !== null })), [a, b, c] = numbersOf(s);
      return pickExpr(d, `${josa(a, '을/를')} ${josa(b, '과/와')} ${c}의 곱으로 나눈 몫을 식으로 바르게 나타낸 것은?`, [s, unparen(s), `${a}*${b}/${c}`, `(${a}/${b})*${c}`], `${josa(b, '과/와')} ${c}의 곱을 먼저 구해야 하므로 ${b} × ${josa(c, '을/를')} ( )로 묶는다. ${chain(s)}`);
    }),
    T('sy-am-plain-value', '말로 나타낸 수(( )가 필요 없는 식)', '①96 ②50 ③67', (d) => {
      const s = G(d, 'a+b*c-d'), [a, b, c, e] = numbersOf(s);
      return N(`${a}에 ${josa(b, '과/와')} ${c}의 곱을 더한 다음 ${josa(e, '을/를')} 뺀 수는?`, val(s), { explain: `곱셈은 덧셈보다 먼저 계산하므로 ( )가 없어도 된다. ${chain(s)}`, facts: { calc: [[s, 0]] } });
    }),
    T('sy-am-value', '말로 나타낸 수(합에 곱하기)', '①96 ②51 ③68 심51', (d) => {
      const s = G(d, '(a+b)*c-d'), [a, b, c, e] = numbersOf(s);
      return N(`${josa(a, '과/와')} ${b}의 합에 ${josa(c, '을/를')} 곱한 다음 ${josa(e, '을/를')} 뺀 수는?`, val(s), { explain: `합을 먼저 구해야 하므로 ${a} + ${josa(b, '을/를')} ( )로 묶어 식으로 나타낸다. ${chain(s)}`, facts: { calc: [[s, 0]] } });
    }),
    T('sy-am-pick', '말에 알맞은 식(곱을 빼고 더하기)', '①96 ②50', (d) => {
      const [s, list] = d.until(() => { const x = G(d, 'a-b*c+d'), [a, b, c, e] = numbersOf(x); return [x, [x, `(${a}-${b})*${c}+${e}`, `${a}-(${b}*${c}+${e})`]]; }, (row) => apartFrom(row[1])), [a, b, c, e] = numbersOf(s);
      return pickExpr(d, `${a}에서 ${josa(b, '과/와')} ${c}의 곱을 뺀 다음 ${josa(e, '을/를')} 더한 수를 식으로 바르게 나타낸 것은?`, list, `곱셈은 뺄셈보다 먼저 계산하므로 ( )가 없어도 된다. ${chain(s)}`);
    }),
    T('sy-ad-value', '말로 나타낸 수(합으로 나누기)', '②51 ③68 심51', (d) => {
      const s = G(d, 'a/(b+c)-d'), [a, b, c, e] = numbersOf(s);
      return N(`${josa(a, '을/를')} ${josa(b, '과/와')} ${c}의 합으로 나눈 몫에서 ${josa(e, '을/를')} 뺀 수는?`, val(s), { explain: `합을 먼저 구해야 하므로 ${b} + ${josa(c, '을/를')} ( )로 묶어 식으로 나타낸다. ${chain(s)}`, facts: { calc: [[s, 0]] } });
    }),
    T('sy-all-value', '말로 나타낸 수(네 가지 연산)', '①97 ③69 심51', (d) => {
      const s = G(d, 'a/(b-c)+d*e'), [a, b, c, e, f] = numbersOf(s);
      return N(`${josa(a, '을/를')} ${josa(b, '과/와')} ${c}의 차로 나눈 몫에 ${josa(e, '과/와')} ${f}의 곱을 더한 수는?`, val(s), { explain: `차를 먼저 구해야 하므로 ${b} − ${josa(c, '을/를')} ( )로 묶어 식으로 나타낸다. ${chain(s)}`, facts: { calc: [[s, 0]] } });
    }),
    T('sy-all-pick', '말에 알맞은 식(네 가지 연산)', '①97 ③69 심51', (d) => {
      const [s, list] = d.until(() => { const x = G(d, '(a-b)*c+d/e'), [a, b, c, e, f] = numbersOf(x); return [x, [x, unparen(x), `(${a}-${b})*(${c}+${e}/${f})`]]; }, (row) => apartFrom(row[1])), [a, b, c, e, f] = numbersOf(s);
      return pickExpr(d, `${josa(a, '과/와')} ${b}의 차에 ${josa(c, '을/를')} 곱한 수와, ${josa(e, '을/를')} ${josa(f, '으로/로')} 나눈 몫을 더한 수를 식으로 바르게 나타낸 것은?`, list, `차를 먼저 구해야 하므로 ${a} − ${josa(b, '을/를')} ( )로 묶는다. 곱셈과 나눗셈은 덧셈보다 먼저 계산하므로 ( )가 더 필요하지 않다. ${chain(s)}`);
    }),
    T('sy-join-paren', '두 식을 ( )를 써서 하나의 식으로 나타내기', '①99·101 ②52 ③72 심28', (d) => {
      // 뒤 식의 한 수가 앞 식의 계산 결과이다. ( )를 빼거나 다른 곳을 묶은 식은 값이 다르다.
      const [op, inner] = d.pick([['-', '+'], ['/', '*'], ['*', '-'], ['/', '+'], ['*', '+'], ['-', '-']]), big = op === '-';
      const s = G(d, `a${op}(b${inner}c)`, with_(big ? BIG : with_(MD, { mul: 6, hi: 20 }), { test: (x) => val(unparen(x)) !== null && val(unparen(x)) !== val(x) })), [a, b, c] = numbersOf(s), p = val(`${b}${inner}${c}`), q = val(s);
      const rows = d.shuffle([s, unparen(s), `(${a}${op}${b})${inner}${c}`]);
      return C('두 식을 하나의 식으로 바르게 나타낸 것은?', rows.map((x) => `${fmt(x)} = ${q}`), rows.indexOf(s), { figure: lines([ex(`${fmt(`${b}${inner}${c}`)} = ${p}`), ex(`${fmt(`${a}${op}${p}`)} = ${q}`)]), explain: `뒤 식의 ${josa(p, '은/는')} 앞 식의 계산 결과이다. ${p} 자리에 ${fmt(`${b}${inner}${c}`)}${tailOf(c, '을/를')} 넣고, 먼저 계산해야 하므로 ( )로 묶는다. ${chain(s)}`, facts: { claimed: rows.map((x) => [x, q]), claimedWant: true } });
    }),
    T('sy-join-mid', '가운데 수를 바꾸어 넣어 하나의 식으로 나타내기', '①100 ②52', (d) => {
      const div = d.bool(), [s, list] = d.until(() => { const x = G(d, div ? 'a+(b-c)/d' : 'a*(b+c)-d'), [a, b, c, e] = numbersOf(x); return [x, div ? [x, `${a}+${b}-${c}/${e}`, `(${a}+${b}-${c})/${e}`] : [x, `${a}*${b}+${c}-${e}`, `${a}*(${b}+${c}-${e})`]]; }, (row) => apartFrom(row[1])), [a, b, c, e] = numbersOf(s);
      const p = div ? b - c : b + c, q = val(s), rows = d.shuffle(list);
      return C('두 식을 하나의 식으로 바르게 나타낸 것은?', rows.map((x) => `${fmt(x)} = ${q}`), rows.indexOf(s), { figure: lines([ex(div ? `${b} − ${c} = ${p}` : `${b} + ${c} = ${p}`), ex(div ? `${a} + ${p} ÷ ${e} = ${q}` : `${a} × ${p} − ${e} = ${q}`)]), explain: `뒤 식의 ${p} 자리에 ${div ? `${b} − ${c}` : `${b} + ${c}`}${tailOf(c, '을/를')} 넣는다. ${div ? '나눗셈' : '곱셈'}보다 먼저 계산해야 하므로 ( )로 묶는다. ${chain(s)}`, facts: { claimed: rows.map((x) => [x, q]), claimedWant: true, rule: 'join:mid' } });
    }),
    T('sy-join-three', '세 식을 하나의 식으로 나타내기', '심28', (d) => {
      const [s, list] = d.until(() => { const x = G(d, '(a+b)*c-d'), [a, b, c, e] = numbersOf(x); return [x, [x, unparen(x), `(${a}+${b})*(${c}-${e})`, `${a}+${b}*(${c}-${e})`]]; }, (row) => apartFrom(row[1]) && new Set(row[1].map(val)).size === 4), [a, b, c, e] = numbersOf(s), q = val(s), rows = d.shuffle(list);
      return C('세 식을 하나의 식으로 바르게 나타낸 것은?', rows.map((x) => `${fmt(x)} = ${q}`), rows.indexOf(s), { figure: lines([ex(`${a} + ${b} = ${a + b}`), ex(`${a + b} × ${c} = ${(a + b) * c}`), ex(`${(a + b) * c} − ${e} = ${q}`)]), explain: `둘째 식의 ${a + b} 자리에 ${a} + ${josa(b, '을/를')} 넣고 ( )로 묶는다. 셋째 식의 ${(a + b) * c} 자리에는 곱셈식을 그대로 넣는다. ${chain(s)}`, facts: { claimed: rows.map((x) => [x, q]), claimedWant: true } });
    }),
    T('sy-story-as', '식에 알맞은 문제(덧셈과 뺄셈)', '①102 ②59 ③75 심52', (d) => {
      const s = G(d, 'a-(b+c)', BIG), [a, b, c] = numbersOf(s);
      return pickStory(d, s, [`초콜릿 ${a}개 가운데 어제 ${b}개, 오늘 ${c}개를 먹었다. 남은 초콜릿은 몇 개인가?`, `초콜릿 ${a}개 가운데 ${b}개를 먹고 ${c}개를 더 샀다. 지금 초콜릿은 몇 개인가?`, `초콜릿 ${a}개와 사탕 ${b}개 가운데 ${c}개를 먹었다. 남은 것은 모두 몇 개인가?`], `${b} + ${josa(c, '은/는')} 이틀 동안 먹은 초콜릿의 수이다. 전체에서 이 수를 뺀다. ${chain(s)}`);
    }),
    T('sy-story-am', '식에 알맞은 문제(값과 거스름돈)', '①102 심52', (d) => {
      const [p, q] = d.until(() => [d.int(4, 9) * 100, d.int(3, 8) * 100], ([x, y]) => x !== y), n = d.int(2, 4), pay = payFor((p + q) * n + 100), s = `${pay}-(${p}+${q})*${n}`;
      return pickStory(d, s, [`${p}원짜리 껌 ${n}개와 ${q}원짜리 사탕 ${n}개를 사고 ${pay}원을 냈다. 거스름돈은 얼마인가?`, `${p}원짜리 껌 한 개와 ${q}원짜리 사탕 ${n}개를 사고 ${pay}원을 냈다. 거스름돈은 얼마인가?`, `${pay}원으로 ${p}원짜리 껌 한 개와 ${q}원짜리 사탕 한 개를 사고 남은 돈의 ${n}배는 얼마인가?`], `${p} + ${josa(q, '은/는')} 껌 한 개와 사탕 한 개의 값이고, 여기에 ${josa(n, '을/를')} 곱하면 ${n}개씩 산 값이다. ${chain(s)}`);
    }),
    T('sy-story-md', '식에 알맞은 문제(곱셈과 나눗셈)', '③75 심52', (d) => {
      const [b, c] = d.until(() => [d.int(3, 8), d.int(2, 5)], ([x, y]) => x !== y && x * y <= 30), q = d.until(() => d.int(2, 6), (v) => v !== b && v !== c), a = b * c * q, s = `${a}/(${b}*${c})`;
      return pickStory(d, s, [`한 시간에 장난감을 ${b}개씩 만드는 기계 ${c}대로 장난감 ${a}개를 만들려고 한다. 몇 시간이 걸리는가?`, `장난감 ${a}개를 ${b}상자에 똑같이 나누어 담았다. ${c}상자에 담긴 장난감은 몇 개인가?`, `한 상자에 ${a}개씩 든 장난감 ${b}상자를 ${c}명이 똑같이 나누어 가졌다. 한 명이 가진 장난감은 몇 개인가?`], `${b} × ${josa(c, '은/는')} 기계 ${c}대가 한 시간에 만드는 장난감의 수이다. 전체를 이 수로 나눈다. ${chain(s)}`);
    }),
    T('sy-expr-bundle', '문제에 알맞은 식(한 묶음에 두 가지)', '①103 ②57', (d) => {
      const [a, b] = d.until(() => [d.int(3, 8), d.int(2, 7)], ([x, y]) => x !== y), c = d.until(() => d.int(5, 9), (v) => v !== a && v !== b), e = d.until(() => d.int(2, c - 1), (v) => v !== a && v !== b);
      return pickExpr(d, `사탕 ${a}개와 초콜릿 ${b}개를 한 봉지에 담아 ${c}봉지를 만들었다. 그 가운데 사탕 ${e}개를 동생에게 주었다. 남은 사탕과 초콜릿의 수를 구하는 식은?`, [`(${a}+${b})*${c}-${e}`, `${a}+${b}*${c}-${e}`, `${a}+${b}*(${c}-${e})`, `(${a}+${b})*(${c}-${e})`], `한 봉지에 담은 수 ${a} + ${josa(b, '을/를')} ( )로 묶어 먼저 계산한다. ${chain(`(${a}+${b})*${c}-${e}`)}`);
    }),
    T('sy-expr-share', '문제에 알맞은 식(나누어 받은 몫을 더하기)', '③97', (d) => {
      // (a + b) ÷ c − e 와 a + b ÷ (c − e) 도 계산되게: b 는 c 와 c − e 의 배수, a 는 c 의 배수
      const who = d.pick(NAMES), [a, b, c, e] = d.until(() => { const c0 = d.int(4, 6), e0 = d.int(2, c0 - 2); return [c0 * d.int(2, 5), c0 * (c0 - e0) * d.int(1, 2), c0, e0]; }, ([p, q, r, s]) => new Set([p, q, r, s]).size === 4 && (p + q) / r > s && q <= 60);
      return pickExpr(d, `${name(who, '은/는')} 구슬을 ${a}개 가지고 있었다. 선생님이 구슬 ${b}개를 ${nick(who)}네 모둠 ${c}명에게 똑같이 나누어 주었고, 그 뒤에 ${name(who, '은/는')} 구슬 ${e}개를 잃어버렸다. ${name(who, '이/가')} 지금 가진 구슬의 수를 구하는 식은?`, [`${a}+${b}/${c}-${e}`, `(${a}+${b})/${c}-${e}`, `${a}+${b}/(${c}-${e})`], `나누어 준 구슬은 ${b}개뿐이므로 ${josa(b, '을/를')} ${josa(c, '으로/로')} 나눈다. 나눗셈은 덧셈, 뺄셈보다 먼저 계산하므로 ( )가 없어도 된다. ${chain(`${a}+${b}/${c}-${e}`)}`);
    }),
    T('sy-expr-change', '문제에 알맞은 식(거스름돈)', '심53·54', (d) => {
      const p = d.int(3, 8) * 100, n = d.int(2, 4), q = d.until(() => d.int(10, 25) * 100, (v) => v !== p), pay = payFor(p * n + q + 100);
      return pickExpr(d, `${pay}원으로 ${p}원짜리 구슬 ${n}개와 ${q}원짜리 공 한 개를 샀다. 거스름돈을 구하는 식은?`, [`${pay}-(${p}*${n}+${q})`, `${pay}-${p}*${n}+${q}`, `(${pay}-${p})*${n}+${q}`], `산 물건의 값 ${p} × ${n} + ${josa(q, '을/를')} ( )로 묶어 낸 돈에서 뺀다. ${chain(`${pay}-(${p}*${n}+${q})`)}`);
    }),
    T('sy-expr-machine', '문제에 알맞은 식(한 시간에 만드는 수)', '②57', (d) => {
      const [b, c] = d.until(() => [d.int(6, 15), d.int(2, 5)], ([x, y]) => x !== y && x * y <= 30), q = d.until(() => d.int(2, 6), (v) => v !== b && v !== c), a = b * c * q;
      return pickExpr(d, `한 시간에 빵을 ${b}개씩 굽는 기계가 ${c}대 있다. 이 기계를 모두 써서 빵 ${a}개를 구우려면 몇 시간이 걸리는지 구하는 식은?`, [`${a}/(${b}*${c})`, `${a}/${b}*${c}`, `${a}*${b}/${c}`], `기계 ${c}대가 한 시간에 굽는 빵의 수 ${b} × ${josa(c, '을/를')} ( )로 묶어 전체를 나눈다. ${chain(`${a}/(${b}*${c})`)}`);
    }),
    T('sy-expr-give', '문제에 알맞은 식(나누어 주고 더 받기)', '②57 ③97', (d) => {
      const [s, list] = d.until(() => { const x = G(d, 'a-b*c+d', { mul: 9 }), [a, b, c, e] = numbersOf(x); return [x, [x, `(${a}-${b})*${c}+${e}`, `${a}-(${b}*${c}+${e})`]]; }, (row) => apartFrom(row[1])), [a, b, c, e] = numbersOf(s);
      return pickExpr(d, `젤리 ${a}개를 가지고 있었다. 친구 ${b}명에게 ${c}개씩 나누어 주고, 선생님께 ${e}개를 받았다. 지금 가진 젤리의 수를 구하는 식은?`, list, `나누어 준 젤리의 수 ${b} × ${josa(c, '은/는')} 곱셈이므로 ( )가 없어도 먼저 계산한다. ${chain(s)}`);
    }),
    T('sy-expr-rest-share', '문제에 알맞은 식(남은 돈을 똑같이 나누기)', '심53', (d) => {
      const [pay, p, n, k] = d.until(() => [d.pick([3000, 5000, 10000]), d.int(4, 9) * 100, d.int(2, 6), d.int(2, 4)], ([w, x, y, z]) => y !== z && w > x * y + 400 && (w - x * y) % (z * 100) === 0 && (x * y) % z === 0 && ((w - x) * y) % z === 0);
      return pickExpr(d, `${pay}원으로 ${p}원짜리 연필 ${n}자루를 사고, 남은 돈을 ${k}명이 똑같이 나누어 가졌다. 한 명이 가진 돈을 구하는 식은?`, [`(${pay}-${p}*${n})/${k}`, `${pay}-${p}*${n}/${k}`, `(${pay}-${p})*${n}/${k}`], `남은 돈 ${pay} − ${p} × ${josa(n, '을/를')} 먼저 구해야 하므로 ( )로 묶은 다음 ${josa(k, '으로/로')} 나눈다. ${chain(`(${pay}-${p}*${n})/${k}`)}`);
    })
  ]);
  // ── 실력 문제 ────────────────────────────────────────────────
  const boxAsk = (figure, x, calc, explain) => N('□ 안에 알맞은 수는?', x, { figure: eqBox(figure), explain, facts: { calc: [[calc, 0]] } });
  const wide = (html) => '<span style="white-space:nowrap">' + html + '</span>';
  B.addGroup('5-1-1', {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      // ㉮ 상황 자체에 함정이 있는 문제 ─────────────────────────────
      H('hd-keep-count', '( )를 지워도 계산 결과가 변하지 않는 식의 수', '23, 기본 ①55 ②33 ③42', (d) => {
        // 더하는 ( )·곱하는 ( )·맨 앞의 ( )·먼저 계산하는 곱셈(나눗셈)을 묶은 ( )는 지워도 같고,
        // 빼는 ( )·나누는 ( )·덧셈(뺄셈)을 묶어 곱하는 ( )는 지우면 달라진다. 「( )는 지우면 언제나 달라진다」「언제나 같다」고 여기면 틀린다.
        const KEEP = [['a+(b-c)', BIG], ['a*(b/c)', with_(MD, { quo: 12 })], ['a+(b*c)-d', {}], ['a-(b/c)+d', {}], ['(a-b)+c', BIG], ['(a/b)*c', MD]];
        const CHANGE = [['a-(b+c)', BIG], ['a-(b-c)', BIG], ['a/(b*c)', with_(MD, { mul: 6, quo: 9 })], ['(a+b)*c-d', {}], ['a-b*(c+d)', {}], ['a/(b/c)', with_(MD, { quo: 12 })]];
        const n = d.int(1, 3), picked = d.shuffle(d.shuffle(KEEP).slice(0, n).concat(d.shuffle(CHANGE).slice(0, 4 - n)));
        const rows = picked.map(([tpl, o]) => G(d, tpl, with_(o, { test: (x) => val(unparen(x)) !== null }))), same = rows.map((s) => val(unparen(s)) === val(s));
        return N('( )를 지워도 계산 결과가 변하지 않는 식은 모두 몇 개인가?', same.filter(Boolean).length, {
          unit: '개', figure: tagAll(rows), explain: `${rows.map((s, i) => `${LABELS[i]} ${fmt(s)} = ${val(s)}, ( )를 지우면 ${val(unparen(s))}`).join(' / ')}이다. 더하거나 곱하는 수를 묶은 ( ), 먼저 계산하는 부분을 묶은 ( )는 지워도 계산 결과가 같다.`, facts: { count: same }
        });
      }),
      H('hd-need-paren', '( ) 없이 쓴 식이 상황에 맞지 않는 것의 수', '53·56·63·66, 기본 ①103 ②57 ③97', (d) => {
        // ( )가 꼭 있어야 하는 상황(합을 나누기·합으로 나누기·남은 것을 나누기·합에 곱하기)과 없어도 되는 상황을 섞는다.
        // 「식에는 언제나 ( )가 있어야 한다」거나 「계산 순서는 문제에 적힌 차례대로」라고 여기면 틀린다.
        const NEED = [
          () => { const c = d.int(3, 6), a = c * d.int(3, 7), b = d.until(() => c * d.int(2, 6), (v) => v !== a); return [`구슬 ${a}개와 ${b}개를 모아 ${c}명이 똑같이 나누어 가질 때, 한 명이 갖는 구슬 수`, `(${a}+${b})/${c}`]; },
          () => { const [b, c, a] = d.until(() => { const x = d.int(2, 6), y = d.int(2, 6); return [x, y, x * (x + y) * d.int(1, 3)]; }, ([x, y, z]) => x !== y && z <= 96); return [`사탕 ${a}개를 남학생 ${b}명과 여학생 ${c}명에게 똑같이 나누어 줄 때, 한 명이 받는 사탕 수`, `${a}/(${b}+${c})`]; },
          () => { const [pay, p, n, k] = d.until(() => [d.pick([3000, 5000]), d.int(4, 8) * 100, d.int(2, 4), d.int(2, 4)], ([w, x, y, z]) => y !== z && w > x * y + 300 && (w - x * y) % (z * 100) === 0 && (x * y) % (z * 100) === 0); return [`${pay}원으로 ${p}원짜리 연필 ${n}자루를 사고 남은 돈을 ${k}명이 똑같이 나누어 가질 때, 한 명이 갖는 돈`, `(${pay}-${p}*${n})/${k}`]; },
          () => { const [a, b] = d.until(() => [d.int(3, 9), d.int(2, 8)], ([x, y]) => x !== y), c = d.until(() => d.int(3, 8), (v) => v !== a && v !== b); return [`한 묶음에 빨간 색종이 ${a}장과 노란 색종이 ${b}장이 들어 있을 때, ${c}묶음에 들어 있는 색종이 수`, `(${a}+${b})*${c}`]; }
        ];
        const FREE = [
          () => { const p = d.int(4, 8) * 100, n = d.int(2, 5), pay = payFor(p * n + 300); return [`${pay}원으로 ${p}원짜리 연필 ${n}자루를 사고 남은 돈`, `${pay}-(${p}*${n})`]; },
          () => { const [a, b, c] = d.until(() => [d.pick([12, 15, 16, 18, 20, 24]), d.int(2, 5), d.int(3, 8)], ([x, y, z]) => (x * y) % z === 0 && y !== z); return [`한 상자에 ${a}개씩 든 귤 ${b}상자를 ${c}명이 똑같이 나누어 가질 때, 한 명이 갖는 귤 수`, `(${a}*${b})/${c}`]; },
          () => { const c = d.int(3, 6), b = c * d.int(2, 6), a = d.until(() => d.int(5, 19), (v) => v !== b && v !== c); return [`연필 ${a}자루를 가진 사람이, 연필 ${b}자루를 ${c}명이 똑같이 나눈 것 가운데 한 몫을 더 받았을 때 가진 연필 수`, `${a}+(${b}/${c})`]; },
          () => { const b = d.int(12, 29), c = d.until(() => d.int(11, 27), (v) => v !== b), a = b + c + d.int(15, 40); return [`${a}쪽짜리 책을 어제 ${b}쪽 읽고 오늘 ${c}쪽 읽었을 때, 남은 쪽수`, `(${a}-${b})-${c}`]; }
        ];
        const n = d.int(1, 3), rows = d.shuffle(d.shuffle(NEED).slice(0, n).concat(d.shuffle(FREE).slice(0, 4 - n))).map((make) => make()), bad = rows.map(([, s]) => val(unparen(s)) !== val(s));
        return N('상황에 알맞은 식을 ( ) 없이 써 보았다. ( )가 없어서 상황에 맞지 않게 된 식은 모두 몇 개인가?', bad.filter(Boolean).length, {
          unit: '개', figure: tagged(rows.map(([text, s]) => `${text}<br>→ ${ex(fmt(unparen(s)))}`)),
          explain: `${rows.map(([, s], i) => (bad[i] ? `${LABELS[i]}은 ${fmt(s)} = ${val(s)}이어야 하는데 ( )가 없으면 ${val(unparen(s))}이 된다.`.replace(/(\d+)이 된다/, (m, x) => josa(Number(x), '이/가') + ' 된다') : `${LABELS[i]}은 곱셈·나눗셈을 먼저 계산하거나 앞에서부터 차례로 계산하면 되므로 ( )가 없어도 된다.`)).join(' ')}`, facts: { count: bad }
        });
      }),
      H('hd-unparen-minus', '( )를 풀어 쓸 때 바뀌는 기호(뺄셈)', '25', (d) => {
        // 빼는 ( ) 안의 덧셈은 뺄셈으로, 뺄셈은 덧셈으로 바뀐다. ( ) 안의 기호를 그대로 쓰는 아이가 고를 보기가 함께 있다.
        const one = (x, sign) => { const [p, q, r] = numbersOf(x); return OPS.filter((op) => !differs(`${p}${sign}${q}${op}${r}`, val(x))).length === 1; };
        const inner = d.pick(['+', '-']), s = G(d, `a-(b${inner}c)`, with_(BIG, { test: (x) => one(x, '-') })), [a, b, c] = numbersOf(s), v = val(s), right = OPS.findIndex((op) => !differs(`${a}-${b}${op}${c}`, v));
        return C('두 식의 계산 결과가 같아지도록 ○ 안에 알맞은 연산 기호는?', SIGN4, right, { figure: eqBox(`${fmt(s)} = ${a} − ${b} ○ ${c}`), explain: `${chain(s)}이다. ${a} − ${b} = ${a - b}이므로 ${a - b} ○ ${c} = ${v}에서 ○ 안에 알맞은 기호는 ${SIGN4[right]}이다. ${inner === '+' ? '두 수의 합을 빼는 것은 두 수를 차례로 빼는 것과 같다.' : '두 수의 차를 빼는 것은 앞의 수를 빼고 뒤의 수를 더하는 것과 같다.'}`, facts: { claimed: OPS.map((op) => [`${a}-${b}${op}${c}`, v]), claimedWant: true } });
      }),
      H('hd-unparen-div', '( )를 풀어 쓸 때 바뀌는 기호(나눗셈)', '25', (d) => {
        const one = (x) => { const [p, q, r] = numbersOf(x); return p % q === 0 && OPS.filter((op) => !differs(`${p}/${q}${op}${r}`, val(x))).length === 1; };
        const inner = d.pick(['*', '/']), s = G(d, `a/(b${inner}c)`, with_(MD, { mul: 6, quo: 12, test: one })), [a, b, c] = numbersOf(s), v = val(s), right = OPS.findIndex((op) => !differs(`${a}/${b}${op}${c}`, v));
        return C('두 식의 계산 결과가 같아지도록 ○ 안에 알맞은 연산 기호는?', SIGN4, right, { figure: eqBox(`${fmt(s)} = ${a} ÷ ${b} ○ ${c}`), explain: `${chain(s)}이다. ${a} ÷ ${b} = ${a / b}이므로 ${a / b} ○ ${c} = ${v}에서 ○ 안에 알맞은 기호는 ${SIGN4[right]}이다. ${inner === '*' ? '두 수의 곱으로 나누는 것은 두 수로 차례로 나누는 것과 같다.' : '두 수의 몫으로 나누는 것은 앞의 수로 나누고 뒤의 수를 곱하는 것과 같다.'}`, facts: { claimed: OPS.map((op) => [`${a}/${b}${op}${c}`, v]), claimedWant: true } });
      }),
      // ㉯ 두 번 넘게 생각해야 풀리는 문제: 거꾸로 두 번 넘게 계산하는 □ ───────────
      H('hd-box-mul-sub', '□에 곱하고 ( )를 뺀 식', '기본 ③55', (d) => {
        const x = d.int(3, 12), a = d.until(() => d.int(3, 9), (v) => v !== x), [b, c] = d.until(() => [d.int(4, 19), d.int(3, 15)], ([p, q]) => p !== q && p + q < x * a - 2 && ![p, q].includes(a)), v = x * a - (b + c);
        return boxAsk(`${box()} × ${a} − (${b} + ${c}) = ${v}`, x, `(${v}+(${b}+${c}))/${a}`, `${b} + ${c} = ${b + c}이므로 □ × ${a} − ${b + c} = ${v}이다. □ × ${a} = ${v} + ${b + c} = ${v + b + c}이고 □ = ${v + b + c} ÷ ${a} = ${x}`);
      }),
      H('hd-box-sub-mul', '빼는 수 자리에 □의 곱이 있는 식', '기본 ③55', (d) => {
        // 빼는 수 자리: 거꾸로 구할 때에도 뺀다(72 − ▲ = 2 → ▲ = 72 − 2). 더해서 구하면 틀린다.
        const x = d.int(3, 12), [b, c] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([p, q]) => p !== q && p + q !== x), v = d.until(() => d.int(2, 25), (n) => ![x, b, c].includes(n)), a = x * (b + c) + v;
        return boxAsk(`${a} − ${box()} × (${b} + ${c}) = ${v}`, x, `(${a}-${v})/(${b}+${c})`, `${b} + ${c} = ${b + c}이므로 ${a} − □ × ${b + c} = ${v}이다. □ × ${b + c} = ${a} − ${v} = ${a - v}이고 □ = ${a - v} ÷ ${b + c} = ${x}`);
      }),
      H('hd-box-div-front', '□를 나눈 다음 더하고 뺀 식', '기본 ①88', (d) => {
        const a = d.int(3, 9), q = d.int(3, 12), [b, c] = d.until(() => [d.int(3, 15), d.int(2, 14)], ([p, r]) => p !== r && q + p - r >= 2 && ![p, r].includes(a)), v = q + b - c;
        return boxAsk(`${box()} ÷ ${a} + ${b} − ${c} = ${v}`, a * q, `(${v}+${c}-${b})*${a}`, `□ ÷ ${a} + ${b} = ${v} + ${c} = ${v + c}이고 □ ÷ ${a} = ${v + c} − ${b} = ${q}이다. □ = ${q} × ${a} = ${a * q}`);
      }),
      H('hd-box-paren-as', '( ) 안에 □가 있는 덧셈과 뺄셈', '31, 기본 ②45', (d) => {
        const minus = d.bool(), b = d.int(12, 39), x = d.until(() => d.int(15, 60), (v) => v !== b && (minus || v > b + 3));
        if (minus) { const a = x + b + d.int(6, 40), v = a - (x + b); return boxAsk(`${a} − (${box()} + ${b}) = ${v}`, x, `${a}-${v}-${b}`, `( )를 한 덩어리로 보면 ${a} − (□ + ${b}) = ${v}에서 □ + ${b} = ${a} − ${v} = ${a - v}이다. □ = ${a - v} − ${b} = ${x}`); }
        const a = d.until(() => d.int(12, 45), (v) => v !== b && v !== x), v = a + (x - b);
        return boxAsk(`${a} + (${box()} − ${b}) = ${v}`, x, `${v}-${a}+${b}`, `( )를 한 덩어리로 보면 ${a} + (□ − ${b}) = ${v}에서 □ − ${b} = ${v} − ${a} = ${v - a}이다. □ = ${v - a} + ${b} = ${x}`);
      }),
      H('hd-box-paren-mixed', '( ) 안에 □가 있고 곱셈·나눗셈이 섞인 식', '31, 기본 ②45 ③56', (d) => {
        const mul = d.bool(), b = d.int(3, 8);
        if (mul) { const a = d.int(4, 15), x = d.until(() => d.int(2, 12), (v) => v !== a && v !== b), c = d.until(() => d.int(3, 25), (v) => ![a, b, x].includes(v) && v < (a + x) * b - 2), v = (a + x) * b - c; return boxAsk(`(${a} + ${box()}) × ${b} − ${c} = ${v}`, x, `(${v}+${c})/${b}-${a}`, `(${a} + □) × ${b} = ${v} + ${c} = ${v + c}이므로 ${a} + □ = ${v + c} ÷ ${b} = ${a + x}이다. □ = ${a + x} − ${a} = ${x}`); }
        const q = d.int(4, 12), a = d.until(() => d.int(6, b * q - 6), (v) => v !== b), x = b * q - a, c = d.until(() => d.int(2, q - 2), (v) => ![a, b, x].includes(v)), v = q - c;
        return boxAsk(`(${a} + ${box()}) ÷ ${b} − ${c} = ${v}`, x, `(${v}+${c})*${b}-${a}`, `(${a} + □) ÷ ${b} = ${v} + ${c} = ${q}이므로 ${a} + □ = ${q} × ${b} = ${b * q}이다. □ = ${b * q} − ${a} = ${x}`);
      }),
      // □의 범위 ────────────────────────────────────────────────
      H('hd-range-between', '두 식 사이에 들어갈 수 있는 자연수의 개수', '37', (d) => {
        const lo = d.int(10, 30), gap = d.int(3, 8), left = d.until(() => mdHit(d, lo) || hitting(d, AM, lo), Boolean), right = hitting(d, d.pick(AD.concat(AM)), lo + gap);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', gap - 1, { unit: '개', figure: lines([`${wide(fmt(left))} &lt; ${box()} &lt; ${wide(fmt(right))}`]), explain: `${fmt(left)} = ${lo}, ${fmt(right)} = ${lo + gap}이다. ${lo} &lt; □ &lt; ${lo + gap}이므로 □ 안에 들어갈 수 있는 자연수는 ${lo + 1}부터 ${lo + gap - 1}까지 ${gap - 1}개이다.`, facts: { digit: { template: `${left}<□<${right}`, lo: 1, hi: lo + gap + 10, ask: 'count' } } });
      }),
      H('hd-range-add', '□가 식 안에 있을 때 가장 큰 자연수', '38, 기본 ①91 ②49', (d) => {
        const right = G(d, d.pick(['a/b', 'a*b', 'a/b*c']), { min: 4, max: 40 }), m = val(right), left = hitting(d, d.pick(['(a-b)*c+d', 'a*(b-c)+d', 'a-b*c+d', 'a*b-c/d+e']), m + d.int(4, 12)), k = val(left);
        return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 큰 수는?', k - m - 1, { figure: lines([`${wide(fmt(left))} &gt; ${wide(`${fmt(right)} + ${box()}`)}`]), explain: `${fmt(left)} = ${k}, ${fmt(right)} = ${m}이다. ${k} &gt; ${m} + □에서 ${m} + □는 ${k}보다 작아야 하므로 □는 ${k - m}보다 작다. 가장 큰 자연수는 ${k - m - 1}이다.`, facts: { digit: { template: `${left}>${right}+□`, lo: 1, hi: k + 5, ask: 'max' } } });
      }),
      H('hd-range-mul', '□를 곱한 식이 있을 때 가장 작은 자연수', '38, 기본 ③58', (d) => {
        const [left, m] = d.until(() => { const s = G(d, 'a/b', { quo: 15 }); return [s, val(s)]; }, ([, q]) => q >= 4), right = G(d, d.pick(['a/b*c', 'a*b-c', 'a+b*c']), { min: m * 2 + 1, max: m * 9 - 1, test: (x, r) => r.value % m !== 0 }), k = val(right), least = Math.floor(k / m) + 1;
        return N('□ 안에 들어갈 수 있는 자연수 가운데 가장 작은 수는?', least, { figure: lines([`${wide(`${fmt(left)} × ${box()}`)} &gt; ${wide(fmt(right))}`]), explain: `${fmt(left)} = ${m}, ${fmt(right)} = ${k}이다. ${m} × □ &gt; ${k}에서 ${m} × ${least - 1} = ${m * (least - 1)}, ${m} × ${least} = ${m * least}이므로 가장 작은 자연수는 ${least}이다.`, facts: { digit: { template: `${left}*□>${right}`, lo: 1, hi: least + 8, ask: 'min' } } });
      }),
      // 어떤 수 ──────────────────────────────────────────────────
      H('hd-number-two', '어떤 수에 곱하고 뺀 결과로 어떤 수 구하기', '33, 기본 ②46', (d) => {
        const x = d.int(4, 15), a = d.until(() => d.int(3, 9), (v) => v !== x), b = d.until(() => d.int(5, 25), (v) => v !== a && v !== x && v < x * a - 3), v = x * a - b;
        return N(`어떤 수에 ${josa(a, '을/를')} 곱한 수에서 ${josa(b, '을/를')} 뺐더니 ${josa(v, '이/가')} 되었다. 어떤 수는?`, x, { explain: `어떤 수를 □라 하면 □ × ${a} − ${b} = ${v}이다. □ × ${a} = ${v} + ${b} = ${v + b}이므로 □ = ${v + b} ÷ ${a} = ${x}`, facts: { calc: [[`(${v}+${b})/${a}`, 0]] } });
      }),
      H('hd-number-paren', '( )가 필요한 말에서 어떤 수 구하기', '33, 기본 ③73', (d) => {
        // 「빼고 나눈 다음」은 (□ − a) ÷ b 이다. □ − a ÷ b 로 세우면 틀린다.
        const add = d.bool(), b = d.int(3, 8), q = d.int(4, 12), c = d.until(() => d.int(3, 15), (v) => v !== b && v !== q);
        if (add) { const a = d.until(() => d.int(3, 12), (v) => v !== b && v !== c), x = d.until(() => d.int(2, 15), (v) => ![a, b, c].includes(v) && (a + v) * b > c + 2), v = (x + a) * b - c; return N(`어떤 수에 ${josa(a, '을/를')} 더한 다음 ${josa(b, '을/를')} 곱하고 ${josa(c, '을/를')} 뺐더니 ${josa(v, '이/가')} 되었다. 어떤 수는?`, x, { explain: `어떤 수를 □라 하면 (□ + ${a}) × ${b} − ${c} = ${v}이다. (□ + ${a}) × ${b} = ${v + c}, □ + ${a} = ${v + c} ÷ ${b} = ${x + a}이므로 □ = ${x}`, facts: { calc: [[`(${v}+${c})/${b}-${a}`, 0]] } }); }
        const a = d.until(() => d.int(11, 40), (v) => v !== c), x = b * q + a, v = q + c;
        return N(`어떤 수에서 ${josa(a, '을/를')} 빼고 ${josa(b, '으로/로')} 나눈 다음 ${josa(c, '을/를')} 더했더니 ${josa(v, '이/가')} 되었다. 어떤 수는?`, x, { explain: `어떤 수를 □라 하면 (□ − ${a}) ÷ ${b} + ${c} = ${v}이다. (□ − ${a}) ÷ ${b} = ${v} − ${c} = ${q}, □ − ${a} = ${q} × ${b} = ${b * q}이므로 □ = ${b * q} + ${a} = ${x}`, facts: { calc: [[`(${v}-${c})*${b}+${a}`, 0]] } });
      }),
      H('hd-number-quot', '몫을 더한 말에서 어떤 수 구하기', '33, 기본 ①130', (d) => {
        // 「b를 c로 나눈 몫을 더했더니」: 나누는 것은 b뿐이다. (□ − a + b) ÷ c 로 세우면 틀린다.
        const c = d.int(3, 9), q = d.until(() => d.int(3, 9), (v) => v !== c), b = c * q, a = d.until(() => d.int(12, 40), (v) => v !== b), x = a + d.int(4, 30), v = x - a + q;
        return N(`어떤 수에서 ${josa(a, '을/를')} 뺀 다음, ${josa(b, '을/를')} ${josa(c, '으로/로')} 나눈 몫을 더했더니 ${josa(v, '이/가')} 되었다. 어떤 수는?`, x, { explain: `어떤 수를 □라 하면 □ − ${a} + ${b} ÷ ${c} = ${v}이다. ${b} ÷ ${c} = ${q}이므로 □ − ${a} + ${q} = ${v}, □ − ${a} = ${v - q}이고 □ = ${v - q} + ${a} = ${x}`, facts: { calc: [[`${v}-${b}/${c}+${a}`, 0]] } });
      }),
      // 어떤 수를 구해 바르게 계산하기 ─────────────────────────────
      H('hd-wrong-as', '더할 것을 빼고 뺄 것을 더한 계산 바로잡기', '34, 기본 ②47', (d) => {
        const a = d.int(40, 80), x = d.int(8, 25), b = d.until(() => d.int(9, 28), (v) => v !== x && a + x - v > 0), v = a - x + b;
        return N(`${a}에 어떤 수를 더하고 ${josa(b, '을/를')} 빼야 할 것을, 잘못하여 ${a}에서 어떤 수를 빼고 ${josa(b, '을/를')} 더했더니 ${josa(v, '이/가')} 되었다. 바르게 계산한 값은?`, a + x - b, { explain: `어떤 수를 □라 하면 ${a} − □ + ${b} = ${v}이다. ${a} − □ = ${v - b}이므로 □ = ${a} − ${v - b} = ${x}이다. 바르게 계산하면 ${a} + ${x} − ${b} = ${a + x - b}`, facts: { calc: [[`${a}+(${a}+${b}-${v})-${b}`, 0]] } });
      }),
      H('hd-wrong-mixed', '더한 다음 곱할 것을 곱한 다음 더한 계산 바로잡기', '34, 기본 ②47', (d) => {
        const x = d.int(3, 12), a = d.until(() => d.int(3, 9), (v) => v !== x), b = d.until(() => d.int(3, 8), (v) => v !== a && v !== x), v = x * b + a;
        return N(`어떤 수에 ${josa(a, '을/를')} 더한 다음 ${josa(b, '을/를')} 곱해야 할 것을, 잘못하여 어떤 수에 ${josa(b, '을/를')} 곱한 다음 ${josa(a, '을/를')} 더했더니 ${josa(v, '이/가')} 되었다. 바르게 계산한 값은?`, (x + a) * b, { explain: `어떤 수를 □라 하면 □ × ${b} + ${a} = ${v}이다. □ × ${b} = ${v - a}이므로 □ = ${x}이다. 바르게 계산하면 (${x} + ${a}) × ${b} = ${x + a} × ${b} = ${(x + a) * b}`, facts: { calc: [[`((${v}-${a})/${b}+${a})*${b}`, 0]] } });
      }),
      H('hd-wrong-md', '곱할 것을 나누고 나눌 것을 곱한 계산 바로잡기', '34', (d) => {
        const [a, b] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p !== q), k = d.int(1, 3), x = a * b * k, v = (x / a) * b;
        return N(`어떤 수에 ${josa(a, '을/를')} 곱하고 ${josa(b, '으로/로')} 나누어야 할 것을, 잘못하여 어떤 수를 ${josa(a, '으로/로')} 나누고 ${josa(b, '을/를')} 곱했더니 ${josa(v, '이/가')} 되었다. 바르게 계산한 값은?`, (x * a) / b, { explain: `어떤 수를 □라 하면 □ ÷ ${a} × ${b} = ${v}이다. □ ÷ ${a} = ${v} ÷ ${b} = ${v / b}이므로 □ = ${v / b} × ${a} = ${x}이다. 바르게 계산하면 ${x} × ${a} ÷ ${b} = ${x * a} ÷ ${b} = ${(x * a) / b}`, facts: { calc: [[`${v}/${b}*${a}*${a}/${b}`, 0]] } });
      }),
      // 여러 단계 문장제 ───────────────────────────────────────────
      H('hd-word-box-unit', '문장제: 낱개 무게를 구해 빈 상자의 무게 구하기', '75, 기본 ①129', (d) => {
        const a = d.int(30, 45) * 10, n = d.int(3, 4), u = d.until(() => d.int(25, 38) * 10, (v) => v !== a), k = d.until(() => d.int(2, 3), (v) => v !== n), empty = d.int(5, 15) * 10;
        return story(`배 한 개의 무게는 ${a} g이고, 무게가 같은 사과 ${n}개의 무게는 ${n * u} g이다. 빈 상자에 이 배 ${k}개와 사과 ${k}개를 담아 무게를 재었더니 ${(a + u) * k + empty} g이었다. 빈 상자의 무게는 몇 g인가?`, `${(a + u) * k + empty}-(${a}+${n * u}/${n})*${k}`, 'g', { lead: `사과 한 개의 무게는 ${n * u} ÷ ${n}이고, 배 한 개와 사과 한 개의 무게의 합에 ${josa(k, '을/를')} 곱한 것을 전체에서 뺀다.` });
      }),
      H('hd-word-box-more', '문장제: 늘어난 무게로 빈 상자의 무게 구하기', '83·84, 기본 ③96', (d) => {
        const n = d.int(5, 8), m = d.until(() => d.int(2, 4), (v) => v !== n), w = d.int(15, 45) * 10, empty = d.int(1, 4) * 100, first = n * w + empty, second = first + m * w;
        return story(`무게가 같은 주스 ${n}병이 들어 있는 상자의 무게를 재었더니 ${first} g이었다. 이 상자에 같은 주스 ${m}병을 더 넣었더니 ${second} g이 되었다. 빈 상자의 무게는 몇 g인가?`, `${first}-(${second}-${first})/${m}*${n}`, 'g', { lead: `늘어난 무게 ${second} − ${josa(first, '은/는')} 주스 ${m}병의 무게이다. 주스 한 병의 무게를 구하여 ${n}병의 무게를 처음 무게에서 뺀다.` });
      }),
      H('hd-word-menu', '문장제: 가격표에서 낱개 값을 구해 거스름돈 구하기', '78, 기본 ①127 ③91', (d) => {
        const main = d.int(25, 40) * 100, n = d.int(4, 6), u = d.int(4, 8) * 100, m = d.until(() => d.int(2, 4), (v) => v !== n), w = d.until(() => d.int(3, 6) * 100, (v) => v !== u), k = d.until(() => d.int(2, n - 1), (v) => v !== m), j = d.until(() => d.int(2, 5), (v) => v !== m && v !== k && v !== n);
        const cost = main + u * k + w * j, pay = cost < 9500 ? 10000 : 20000;
        return story(`분식집의 가격표이다. 떡볶이 1인분, 튀김 ${k}개, 어묵 ${j}개를 사고 ${pay}원을 냈다. 거스름돈은 얼마인가?`, `${pay}-(${main}+${n * u}/${n}*${k}+${m * w}/${m}*${j})`, '원', {
          figure: table(['음식', '값'], [['떡볶이 1인분', main + '원'], [`튀김 ${n}개`, n * u + '원'], [`어묵 ${m}개`, m * w + '원']]), lead: `튀김 한 개는 ${n * u} ÷ ${n}, 어묵 한 개는 ${m * w} ÷ ${m}으로 구하고, 산 것의 값을 ( )로 묶어 낸 돈에서 뺀다.`.replace(`${m}으로`, josa(m, '으로/로'))
        });
      }),
      H('hd-word-week', '문장제: 쉬는 날이 있는 일주일', '67, 기본 ①119 ②81', (d) => {
        const [who, other] = two(d), r = d.int(2, 3), a = d.int(3, 6) * 10, b = d.until(() => d.int(15, 45), (v) => v !== a && v % 5 === 0);
        return story(`${name(who, '은/는')} 일주일 가운데 ${r}일은 쉬고 나머지 날에는 줄넘기를 하루에 ${a}번씩 하였다. ${name(other, '은/는')} 일주일 동안 날마다 줄넘기를 ${b}번씩 하였다. 두 사람이 일주일 동안 한 줄넘기는 모두 몇 번인가?`, `(7-${r})*${a}+7*${b}`, '번', { unseen: [7], lead: `일주일은 7일이므로 ${name(who, '이/가')} 줄넘기를 한 날은 7 − ${r}일이다.` });
      }),
      H('hd-word-refund', '문장제: 돌려받는 돈을 뺀 값의 합', '68', (d) => {
        const back = d.int(1, 2) * 1000, [a, b] = d.until(() => [d.int(4, 6) * 1000, d.int(3, 5) * 1000], ([p, q]) => p > q && q > back), [n, m] = d.until(() => [d.int(2, 6), d.int(3, 8)], ([p, q]) => p !== q);
        return story(`구명조끼를 빌리는 값은 어른용이 ${a}원, 어린이용이 ${b}원이고, 다 쓴 구명조끼를 돌려주면 한 개에 ${back}원씩 돌려받는다. 어른용 ${n}개와 어린이용 ${m}개를 빌려 쓰고 모두 돌려주었다면, 구명조끼를 빌리는 데 든 돈은 얼마인가?`, `(${a}-${back})*${n}+(${b}-${back})*${m}`, '원', { lead: `한 개를 빌리는 데 실제로 드는 돈은 어른용이 ${a} − ${back}, 어린이용이 ${b} − ${back}이다.` });
      }),
      H('hd-word-tapes3', '문장제: 길이가 다른 색 테이프 세 장을 겹쳐 잇기', '59', (d) => {
        const [a, b, c] = d.until(() => [d.int(15, 35), d.int(15, 35), d.int(15, 35)], (list) => new Set(list).size === 3), k = d.int(3, 8);
        return story(`길이가 ${a} cm, ${b} cm, ${c} cm인 색 테이프 세 장을 ${k} cm씩 겹쳐서 한 줄로 길게 이어 붙였다. 이어 붙인 색 테이프의 전체 길이는 몇 cm인가?`, `${a}+${b}+${c}-${k}*2`, 'cm', { unseen: [2], lead: `세 장을 한 줄로 이으면 겹친 곳은 2곳이다. 세 장의 길이의 합에서 겹친 길이 ${k} × 2를 뺀다.` });
      }),
      H('hd-word-pieces', '문장제: 똑같이 자른 두 도막을 겹쳐 잇기', '70', (d) => {
        const [n, m] = d.until(() => [d.int(3, 6), d.int(3, 8)], ([p, q]) => p !== q), [u, w] = d.until(() => [d.int(6, 14), d.int(7, 15)], ([p, q]) => p !== q && n * p !== m * q), k = d.until(() => d.int(2, 5), (v) => v !== n && v !== m);
        return story(`길이가 ${n * u} cm인 끈을 똑같이 ${n}도막으로 자른 것 가운데 한 도막과, 길이가 ${m * w} cm인 끈을 똑같이 ${m}도막으로 자른 것 가운데 한 도막을 ${k} cm만큼 겹쳐서 이어 붙였다. 이어 붙인 끈의 길이는 몇 cm인가?`, `${n * u}/${n}+${m * w}/${m}-${k}`, 'cm', { lead: '두 도막의 길이를 각각 나눗셈으로 구하여 더하고, 겹친 길이를 한 번 뺀다.' });
      }),
      H('hd-word-bill', '문장제: 값을 모두 더해 깎고 똑같이 나누어 내기', '79, 기본 ①126', (d) => {
        const [p, n, q, r, m, e, f] = d.until(() => [d.int(3, 6) * 500, d.int(2, 4), d.int(5, 8) * 500, d.int(6, 10) * 500, d.int(2, 3), d.pick([500, 1000, 2000]), d.int(3, 6)], ([x, y, z, w, t, cut, by]) => new Set([x, z, w]).size === 3 && y !== t && by !== y && by !== t && (x * y + z + w * t - cut) % (by * 100) === 0 && x * y + z + w * t - cut >= by * 1500);
        return story(`${p}원짜리 김밥 ${n}줄, ${q}원짜리 라면 한 그릇, ${r}원짜리 떡볶이 ${m}인분을 먹었다. 음식값에서 ${e}원을 깎아 준 나머지를 ${f}명이 똑같이 나누어 냈다면, 한 명이 낸 돈은 얼마인가?`, `(${p}*${n}+${q}+${r}*${m}-${e})/${f}`, '원', { lead: '음식값을 모두 더하고 깎아 준 돈을 뺀 것을 ( )로 묶어 사람 수로 나눈다.' });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
