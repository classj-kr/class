// 중학교 1학년 1학기 2단원 정수와 유리수 — 뒤쪽 묶음(뺄셈과 덧셈·뺄셈의 혼합 계산, 곱셈·거듭제곱·분배법칙, 나눗셈과 역수, 사칙의 혼합 계산).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 계산 문항은 구조가 다른 것만 따로 싣고(차례마다 facts.rule 의 이름이 다르다) 답의 꼴(정수 / 분수 / 소수 한 자리)은 차례마다 정해져 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, table, N, M, C } = B.kit;
  const K = B.kit.m712;
  const { LAB, MINUS, GT, LT, gcd, lcm, Q, dc, dc2, plainQ, qadd, qsub, qmul, qdiv, qneg, qabs, qpow, qcmp, isInt, fl, mag, tx, sx, px, nb, plain, tail, lastOf, tj, pj, js, V, sup,
    P, U, S, G, W, WN, MN, A, val, valT, html, htmlT, OPS, BR, inl, jsx, chainOf, intsOnly, biggest, fit, emOf, ex, show, taggedEx, proc, flow, nline, nz, pm, co, fr, distinct, okKind, ansV, valueFacts, CALC, calcQ, pickEx,
    SAME_MUL, DIFF_MUL, SAME_DIV, DIFF_DIV, TO_ADD, BY_RECIP, uniq, addTold, subTold, mulTold, divTold, commonTold } = K;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const UNIT = '7-1-2';
  // 뺄셈을 덧셈으로 고친 식(괄호 꼴)
  const toAdd = (list) => list.map((t, i) => (t === '-' ? '+' : typeof t !== 'string' && list[i - 1] === '-' ? P(qneg(t.x)) : t));
  // 부호가 생략된 식에 양의 부호와 괄호를 되살린 덧셈식
  const withSigns = (list) => list.map((t, i) => (typeof t === 'string' ? '+' : P(list[i - 1] === '-' ? qneg(t.x) : t.x)));
  // 곱셈·나눗셈만 있는 식을 역수의 곱셈으로 고쳐 계산한 과정
  function recipTold(list) {
    const conv = list.map((t, i) => (t === '/' ? '*' : typeof t === 'string' ? t : Object.assign({}, t, { x: list[i - 1] === '/' ? qdiv(Q(1), plainQ(t.x)) : plainQ(t.x) })));
    const v = val(list), mags = conv.filter((t) => typeof t !== 'string').map((t) => mag(t.x));
    return uniq([inl(list), inl(conv), `${v.p < 0 ? MINUS : '+'}(${mags.join(' × ')})`, tx(v)]).join(' = ');
  }
  const tenths = (d, lo, hi) => d.until(() => d.int(lo, hi), (t) => t % 10 !== 0);
  // 분수로 고치기 쉬운 소수와, 함께 쓰기 좋은 분모
  const DECS = [[dc(5), [2, 4, 6]], [dc(15), [2, 4]], [dc(25), [2, 4]], [dc(2), [5, 10]], [dc(4), [5, 10]], [dc(6), [5]], [dc(8), [5, 10]], [dc(12), [5]], [dc2(25), [2, 4, 8]], [dc2(75), [2, 4, 8]]];
  const signedQ = (s, x) => (s < 0 ? qneg(x) : x);
  const rel = (v) => (v.p > 0 ? '양수' : '음수');
  // 연산 기호 아래에 이름표(㉠㉡…)를 단 식. 이름표는 적힌 차례대로 붙는다. 그림 설명 대신 글로 읽히게 기호와 이름표를 나란히 적는다.
  function marked(list) {
    let k = 0;
    const walk = (items) => items.map((t, i) => {
      if (typeof t === 'string') { const label = LAB[k]; k += 1; return `<span style="display:inline-flex;flex-direction:column;align-items:center;margin:0 0.14em;line-height:1.25"><span>${OPS[t]}</span><span style="font-size:0.86em;font-weight:700;color:#1d4ed8">${label}</span></span>`; }
      return t.k === 'g' ? BR[t.br][0] + walk(t.list) + BR[t.br][1] : htmlT(t, i === 0, true);
    }).join(' ');
    const body = walk(list);
    return '<span class="mb-expr"' + fit(emOf(html(list)) + 0.5 * k) + '>' + body + '</span>';
  }
  const arrow = (order) => order.map((i) => LAB[i]).join(' → ');

  B.addTypes(UNIT, 'sub', [
    T('sub-int', '정수의 뺄셈', '①36 ②39', (d, n) => {
      // 차례마다 구조가 다르다: 작은 양수에서 큰 양수를 뺀다, 음수를 뺀다, 음수에서 양수를 뺀다, 0에서 뺀다.
      const a = d.int(2, 15), b = d.until(() => d.int(2, 15), (v) => v !== a), s = pm(d);
      const [x, y] = n === 0 ? [Q(Math.min(a, b)), Q(Math.max(a, b))] : n === 1 ? [Q(s * a), Q(-b)] : n === 2 ? [Q(-a), Q(b)] : [Q(0), Q(s * a)];
      return calcQ([P(x), '-', P(y)], 'int', { rule: 'sub-int-' + n, explain: TO_ADD + subTold(x, y) + '이다.' });
    }, { count: 4 }),
    T('sub-pick-target', '계산 결과가 정해진 수인 식 고르기', '①36 ②48', (d) => {
      const t = d.int(3, 14), a = d.int(1, t - 1), b = t - a, c = d.int(2, 9), e = c + t, q = (v) => P(Q(v));
      // 값이 −t 인 식과, 부호를 잘못 다루면 −t 로 보이는 식
      const right = d.pick([[q(-a), '-', q(b)], [q(-a), '+', q(-b)], [q(c), '-', q(e)], [q(-e), '-', q(-c)], [q(c), '+', q(-e)]]);
      const wrong = d.shuffle([[q(-a), '-', q(-b)], [q(a), '-', q(-b)], [q(-c), '-', q(-e)], [q(-c), '+', q(e)], [q(e), '-', q(c)]]).slice(0, 3), rows = d.shuffle([right].concat(wrong));
      return C(`계산 결과가 ${tx(Q(-t))}인 것은?`, rows.map(inl), rows.indexOf(right), {
        explain: `${rows.map((r) => `${inl(r)} = ${tx(val(r))}`).join(', ')}이다. 뺄셈은 빼는 수의 부호를 바꾸어 더한다.`,
        facts: { claimed: rows.map((r) => [jsx(r), -t]), claimedWant: true }
      });
    }),
    T('sub-frac', '분수의 뺄셈', '①37 ②40', (d, n) => {
      // 차례마다 구조가 다르다: 분모가 같다, 통분, 정수와 분수.
      const list = pickEx(d, () => {
        if (n === 0) { const q = d.int(3, 9); return [P(Q(pm(d) * co(d, q, 1, 2 * q), q)), '-', P(Q(pm(d) * co(d, q, 1, 2 * q), q))]; }
        if (n === 2) { const f = signedQ(pm(d), fr(d, [2, 3, 4, 5, 6], 2)), k = Q(pm(d) * d.int(1, 6)); return d.bool() ? [P(k), '-', P(f)] : [P(f), '-', P(k)]; }
        return [P(signedQ(pm(d), fr(d, [2, 3, 4, 5, 6, 8], 2))), '-', P(signedQ(pm(d), fr(d, [2, 3, 4, 5, 6, 8], 2)))];
      }, 'frac', (e) => (n !== 1 || e[0].x.q !== e[2].x.q) && lcm(e[0].x.q, e[2].x.q) <= 24 && (e[0].x.p < 0 || e[2].x.p < 0) && Math.abs(val(e).p) <= 40);
      return calcQ(list, 'frac', { rule: 'sub-frac-' + n, explain: TO_ADD + subTold(list[0].x, list[2].x) + '이다.' });
    }, { count: 3 }),
    T('sub-dec', '소수의 뺄셈, 분수와 소수의 뺄셈', '②41', (d, n) => {
      if (n === 0) {
        const list = pickEx(d, () => [P(dc(pm(d) * tenths(d, 11, 79))), '-', P(dc(pm(d) * tenths(d, 11, 79)))], 'dec', (e) => e[0].x.p < 0 || e[2].x.p < 0);
        return calcQ(list, 'dec', { rule: 'sub-dec', explain: TO_ADD + subTold(list[0].x, list[2].x) + '이다.' });
      }
      const list = pickEx(d, () => { const [x, dens] = d.pick(DECS), a = P(signedQ(pm(d), fr(d, dens, 2))), b = P(signedQ(pm(d), x)); return d.bool() ? [a, '-', b] : [b, '-', a]; }, 'frac', (e) => val(e).q <= 20 && (e[0].x.p < 0 || e[2].x.p < 0));
      return calcQ(list, 'frac', { rule: 'sub-frac-dec', explain: '소수를 분수로 고친 다음, 빼는 수의 부호를 바꾸어 더한다. ' + subTold(list[0].x, list[2].x) + '이다.' });
    }, { count: 2 }),
    T('sub-to-add-wrong', '뺄셈을 덧셈으로 고친 것이 옳지 않은 것 찾기', '①38', (d) => {
      // 줄마다 [뺄셈식, 바르게 고친 덧셈식, 부호를 바꾸지 않고 고친 덧셈식]
      const a = () => Q(d.int(2, 12));
      const makers = [
        () => { const x = qneg(a()), y = a(); return [[P(x), '-', U(y)], [P(x), '+', P(qneg(y))], [P(x), '+', U(y)]]; },
        () => { const x = qneg(a()), y = qneg(a()); return [[U(x), '-', P(y)], [U(x), '+', U(qneg(y))], [U(x), '+', P(y)]]; },
        () => { const x = a(), y = a(); return [[U(x), '-', U(y)], [U(x), '+', P(qneg(y))], [U(x), '+', P(y)]]; },
        () => { const x = qneg(a()), y = a(); return [[P(x), '-', P(y)], [P(x), '+', P(qneg(y))], [P(x), '+', P(y)]]; },
        () => { const x = a(), y = qneg(a()); return [[P(x), '-', P(y)], [P(x), '+', P(qneg(y))], [P(x), '+', P(y)]]; }
      ];
      const rows = d.shuffle(makers).slice(0, 4).map((make) => make()), wrongAt = d.int(0, 3), shown = rows.map((r, i) => [r[0], i === wrongAt ? r[2] : r[1]]);
      return C('뺄셈을 덧셈으로 고친 것이 옳지 않은 것은?', shown.map(([l, r]) => `${inl(l)} = ${inl(r)}`), wrongAt, {
        explain: `뺄셈은 빼는 수의 부호를 바꾸어 더한다. 부호가 생략된 수는 양수이다. ${inl(rows[wrongAt][0])} = ${inl(rows[wrongAt][1])}이다.`,
        facts: { claimed: shown.map(([l, r]) => [jsx(l), val(r).p]), claimedWant: false }
      });
    }),
    T('sub-smaller-by', '어떤 수보다 얼마만큼 작은 수', '①48 ②42', (d, n) => {
      const [x, y] = n === 0 ? d.until(() => [Q(nz(d, -12, 12)), Q(nz(d, -12, 12))], ([p, q]) => q.p < 0 || p.p < 0)
        : d.until(() => [signedQ(pm(d), fr(d, [2, 3, 4, 5, 9], 2)), d.bool() ? Q(nz(d, -4, 4)) : signedQ(pm(d), fr(d, [2, 3, 4, 6], 2))], ([p, q]) => (q.p < 0 || p.p < 0) && qsub(p, q).q > 1 && lcm(p.q, q.q) <= 18);
      return ansV(`${tx(x)}보다 ${tx(y)}만큼 작은 수는?`, qsub(x, y), n === 0 ? 'int' : 'frac', {
        explain: `${tx(x)}보다 ${tx(y)}만큼 작은 수는 ${tx(x)}에서 ${tj(y, '을/를')} 뺀 수이다. ${subTold(x, y)}이다.` + (y.p < 0 ? ` 음수 ${tx(y)}만큼 작은 수는 ${mag(y)}만큼 큰 수이다.` : ''),
        facts: { value: `${js(x)}-${js(y)}`, rule: 'smaller-by-' + n }
      });
    }, { count: 2 }),
    T('sub-by-max', '「~보다 ~만큼 큰(작은) 수」 가운데 가장 큰(작은) 수 고르기', '①49', (d) => {
      const rows = d.until(() => Array.from({ length: 4 }, () => { const x = nz(d, -9, 9), y = nz(d, -9, 9), up = d.bool(); return { x, y, up, v: up ? x + y : x - y }; }),
        (list) => new Set(list.map((r) => r.v)).size === 4 && list.filter((r) => r.y < 0).length >= 2 && list.some((r) => r.up) && list.some((r) => !r.up));
      const big = d.bool(), values = rows.map((r) => r.v), at = values.indexOf(big ? Math.max(...values) : Math.min(...values));
      return C(`다음 수 가운데 가장 ${big ? '큰' : '작은'} 수는?`, rows.map((r) => `${tx(Q(r.x))}보다 ${tx(Q(r.y))}만큼 ${r.up ? '큰' : '작은'} 수`), at, {
        explain: `「~만큼 큰 수」는 더하고 「~만큼 작은 수」는 뺀다. 차례로 ${rows.map((r) => `${px(Q(r.x))} ${r.up ? '+' : MINUS} ${px(Q(r.y))} = ${tx(Q(r.v))}`).join(', ')}이다.`,
        facts: { rank: { values, nth: big ? 1 : 4 } }
      });
    }),
    T('sub-table-diff', '표에서 가장 높은 기온과 가장 낮은 기온의 차', '①54 ②43', (d) => {
      const temps = d.until(() => [0, 6, 12, 18].map(() => d.int(-12, 9)), (list) => new Set(list).size === 4 && list.filter((v) => v < 0).length >= 2 && Math.max(...list) > 0 && list[2] === Math.max(...list));
      const hi = Math.max(...temps), lo = Math.min(...temps);
      return N('어느 날 시각별 기온을 나타낸 표이다. 가장 높은 기온과 가장 낮은 기온의 차는 몇 °C인가?', hi - lo, {
        unit: '°C', signed: true, figure: table(['시각', '기온(°C)'], temps.map((v, i) => [i * 6 + '시', sx(Q(v))])),
        explain: `가장 높은 기온은 ${sx(Q(hi))} °C, 가장 낮은 기온은 ${sx(Q(lo))} °C이다. 두 기온의 차는 ${subTold(Q(hi), Q(lo))} (°C)이다.`,
        facts: { value: `${js(Q(hi))}-${js(Q(lo))}` }
      });
    }),
    T('sub-range-max', '표에서 두 값의 차가 가장 큰 것 고르기', '심25', (d) => {
      const names = ['가', '나', '다', '라'];
      const rows = d.until(() => names.map(() => { const hi = d.int(-4, 11), lo = hi - d.int(5, 10); return [hi, lo]; }), (list) => new Set(list.map(([h, l]) => h - l)).size === 4 && list.filter(([, l]) => l < 0).length >= 3 && list.some(([h]) => h < 0) && list.some(([h, l]) => h > 0 && l < 0));
      const gaps = rows.map(([h, l]) => h - l), at = gaps.indexOf(Math.max(...gaps));
      return C('네 도시의 어느 날 최고 기온과 최저 기온을 나타낸 표이다. 최고 기온과 최저 기온의 차가 가장 큰 도시는?', names, at, {
        figure: table(['도시', '최고(°C)', '최저(°C)'], rows.map(([h, l], i) => [names[i], sx(Q(h)), sx(Q(l))])),
        explain: `최고 기온에서 최저 기온을 뺀다. 음수를 빼는 것은 그 절댓값을 더하는 것과 같다. 차례로 ${rows.map(([h, l]) => `${px(Q(h))} − ${px(Q(l))} = ${h - l}`).join(', ')}이므로 차가 가장 큰 도시는 ${names[at]}이다.`,
        facts: { rank: { values: gaps, nth: 1 } }
      });
    }, { source: '수집본 심화 자료(심25)' }),
    T('sub-mix-int', '괄호가 있는 정수의 덧셈과 뺄셈의 혼합 계산', '①41 ②44', (d, n) => {
      const list = pickEx(d, () => { const out = [P(Q(nz(d, -15, 15)))]; for (let i = 0; i < n + 2; i += 1) out.push(d.pick(['+', '-']), P(Q(nz(d, -15, 15)))); return out; }, 'int',
        (e) => e.includes('-') && e.includes('+') && e.some((t, i) => e[i - 1] === '-' && t.x.p < 0) && distinct(e.filter((t) => typeof t !== 'string').map((t) => qabs(t.x))) && Math.abs(val(e).p) <= 40);
      return calcQ(list, 'int', { rule: 'sub-mix-int-' + n, explain: `${TO_ADD}${inl(list)} = ${chainOf(toAdd(list))}이다.` });
    }, { count: 2 }),
    T('sub-mix-frac', '괄호가 있는 분수·소수의 덧셈과 뺄셈의 혼합 계산', '①41·42 ②45', (d, n) => {
      if (n === 0) {
        const one = () => P(signedQ(pm(d), fr(d, [2, 3, 4, 5, 6], 2)));
        const list = pickEx(d, () => [one(), d.pick(['+', '-']), one(), '-', one()], 'frac', (e) => { const qs = [e[0].x.q, e[2].x.q, e[4].x.q]; return new Set(qs).size >= 2 && qs.reduce(lcm) <= 24 && e.some((t) => typeof t !== 'string' && t.x.p < 0) && distinct([e[0].x, e[2].x, e[4].x].map(qabs)); });
        return calcQ(list, 'frac', { rule: 'sub-mix-frac', explain: `${TO_ADD}분모가 다르면 통분한다. ${inl(list)} = ${commonTold(toAdd(list))}이다.` });
      }
      if (n === 1) {
        const one = () => P(dc(pm(d) * tenths(d, 11, 69)));
        const list = pickEx(d, () => [one(), '-', one(), d.pick(['+', '-']), one()], 'dec', (e) => e.some((t, i) => e[i - 1] === '-' && t.x.p < 0) && distinct([e[0].x, e[2].x, e[4].x].map(qabs)));
        return calcQ(list, 'dec', { rule: 'sub-mix-dec', explain: `${TO_ADD}${inl(list)} = ${chainOf(toAdd(list))}이다.` });
      }
      // 분모가 같은 분수끼리, 소수끼리 계산하면 저마다 정수가 된다.
      const q = d.pick([3, 5, 7]), a = co(d, q, 1, 2 * q - 1), k1 = d.int(1, 2), s = pm(d), f1 = Q(s * a, q), f2 = Q(s * (a - k1 * q), q), t = tenths(d, 11, 29), k2 = d.int(2, 3), d1 = dc(t), d2 = dc(t - 10 * k2);
      const list = [P(f1), '-', P(d1), '+', P(d2), '-', P(f2)];
      return calcQ(list, 'int', { rule: 'sub-mix-four', explain: `${TO_ADD}분수는 분수끼리, 소수는 소수끼리 모아서 계산한다. ${inl(list)} = ${inl(toAdd(list))} = {${px(f1)} + ${px(qneg(f2))}} + {${px(qneg(d1))} + ${px(d2)}} = ${px(qsub(f1, f2))} + ${px(qsub(d2, d1))} = ${tx(val(list))}이다.` });
    }, { count: 3 }),
    T('sub-terms', '부호가 생략된 식을 괄호가 있는 덧셈식으로 고치기', '①43', (d) => {
      const list = d.until(() => [U(Q(nz(d, -9, 9))), d.pick(['+', '-']), U(Q(d.int(2, 9))), d.pick(['+', '-']), U(Q(d.int(2, 9)))], (e) => e.includes('-') && new Set([e[0].x.p, e[2].x.p, e[4].x.p].map(Math.abs)).size === 3);
      const terms = withSigns(list).filter((t) => typeof t !== 'string').map((t) => t.x);
      return M('다음 식을 덧셈만 있는 식으로 고칠 때, ㉠, ㉡, ㉢에 알맞은 수는?', terms.map((x, i) => ({ label: LAB[i], answer: x.p, signed: true })), {
        figure: ex(`${html(list)} <i>=</i> (${box(LAB[0])}) <i>+</i> (${box(LAB[1])}) <i>+</i> (${box(LAB[2])})`),
        explain: `부호가 생략된 수는 양수이고, 빼는 수는 부호를 바꾸어 더한다. ${inl(list)} = ${inl(withSigns(list))}이다.`,
        facts: { calc: terms.map((x, i) => [x.p < 0 ? '-' + -x.p : String(x.p), i]) }
      });
    }),
    T('sub-bare-int', '부호가 생략된 정수의 덧셈과 뺄셈', '①44 ②46', (d, n) => {
      // 첫째는 양수로 시작하는 세 항, 둘째는 음수로 시작하는 네 항
      const list = pickEx(d, () => { const out = [U(Q((n === 0 ? 1 : -1) * d.int(2, 15)))]; for (let i = 0; i < n + 2; i += 1) out.push(d.pick(['+', '-']), U(Q(d.int(2, 15)))); return out; }, 'int',
        (e) => e.includes('-') && (n === 0 ? val(e).p < 0 : e.includes('+')) && distinct(e.filter((t) => typeof t !== 'string').map((t) => qabs(t.x))));
      return calcQ(list, 'int', { rule: 'sub-bare-int-' + n, explain: `양의 부호 +와 괄호를 되살려 덧셈으로 고친 다음 계산한다. ${inl(list)} = ${chainOf(withSigns(list))}이다.` });
    }, { count: 2 }),
    T('sub-bare-frac', '부호가 생략된 분수의 덧셈과 뺄셈', '①45 ②47', (d, n) => {
      const f = (dens) => U(fr(d, dens, 1.6));
      const list = pickEx(d, () => (n === 0 ? [U(signedQ(pm(d), fr(d, [2, 3, 4, 6], 1.6))), d.pick(['+', '-']), f([2, 3, 4, 6, 8]), '-', f([2, 3, 4, 6, 8])]
        : [U(Q(d.int(1, 4))), '-', f([2, 3, 6]), d.pick(['+', '-']), f([2, 3, 6]), d.pick(['+', '-']), f([2, 3, 6])]), 'frac',
      (e) => { const xs = e.filter((t) => typeof t !== 'string').map((t) => t.x), qs = xs.filter((x) => x.q > 1).map((x) => x.q); return new Set(qs).size >= 2 && qs.reduce(lcm) <= 24 && distinct(xs.map(qabs)) && val(e).p < 0; });
      return calcQ(list, 'frac', { rule: 'sub-bare-frac-' + n, explain: `통분하여 계산한다. ${commonTold(list)}이다.` });
    }, { count: 2 }),
    T('sub-mixed-form', '괄호가 있는 수와 부호가 생략된 수가 섞인 식', '①46', (d) => {
      const f = () => fr(d, [2, 3, 4, 6], 2.5);
      const build = () => { const [a, b, c, e] = [f(), f(), f(), f()], first = d.bool(); return { list: first ? [U(a), '-', P(qneg(b)), '+', P(qneg(c)), '-', U(e)] : [U(a), '+', P(qneg(b)), '-', P(qneg(c)), '-', U(e)], flat: first ? [U(a), '+', U(b), '-', U(c), '-', U(e)] : [U(a), '-', U(b), '+', U(c), '-', U(e)] }; };
      const made = d.until(build, (m) => { const xs = m.flat.filter((t) => typeof t !== 'string').map((t) => t.x); return okKind(val(m.list), 'frac') && distinct(xs) && new Set(xs.map((x) => x.q)).size >= 3 && xs.map((x) => x.q).reduce(lcm) <= 12; });
      return calcQ(made.list, 'frac', { rule: 'sub-mixed-form', explain: `괄호를 풀어 부호가 생략된 식으로 고친 다음 통분한다. ${inl(made.list)} = ${commonTold(made.flat)}이다.` });
    }),
    T('sub-rank', '덧셈·뺄셈 식 가운데 계산 결과가 가장 작은(큰) 것 고르기', '②48 심22', (d) => {
      const makers = [
        () => [P(Q(d.int(2, 6))), '-', P(Q(-d.int(1, 4)))],
        () => [P(dc(-tenths(d, 11, 29))), '+', P(dc(-tenths(d, 3, 19)))],
        () => [P(dc(tenths(d, 11, 39))), '+', P(dc(-tenths(d, 11, 39)))],
        () => [P(qneg(fr(d, [2, 3, 6], 1))), '-', P(fr(d, [2, 3, 6, 9], 1))],
        () => [P(fr(d, [2, 5, 10], 1)), '-', P(qneg(fr(d, [2, 5, 10], 1)))],
        () => [U(Q(d.int(1, 3))), '-', U(fr(d, [2, 4], 1.8)), '-', U(fr(d, [2, 4], 1.8))],
        () => [P(Q(-d.int(1, 6))), '-', P(Q(d.int(1, 6))), '+', P(Q(d.int(2, 9)))]
      ];
      const rows = d.until(() => d.shuffle(makers).slice(0, 4).map((make) => make()), (list) => { const vs = list.map(val); return distinct(vs) && vs.filter((v) => v.p < 0).length >= 2 && vs.every((v) => v.q <= 20); });
      const small = d.bool(), values = rows.map((r) => fl(val(r))), at = values.indexOf(small ? Math.min(...values) : Math.max(...values));
      return C(`계산 결과가 가장 ${small ? '작은' : '큰'} 것은?`, LAB.slice(0, 4), at, {
        figure: taggedEx(rows.map((r) => html(r))),
        explain: `계산 결과는 차례로 ${rows.map((r) => tx(K.asDec(val(r)))).join(', ')}이다. 가장 ${small ? '작은' : '큰'} 것은 ${LAB[at]}이다.`,
        facts: { rank: { values, nth: small ? 4 : 1 } }
      });
    }),
    T('sub-box', '□가 있는 덧셈·뺄셈 식', '①51', (d, n) => {
      // □ + a = b, □ − a = b, a − □ = b 가운데 하나. 첫째는 정수, 둘째는 분수가 답이다.
      const form = d.pick(['x+a', 'x-a', 'a-x']);
      const [a, b, x] = d.until(() => {
        const p = n === 0 ? Q(-d.int(2, 12)) : signedQ(pm(d), fr(d, [2, 3, 4, 5], 2)), q = n === 0 ? Q(nz(d, -12, 12)) : d.bool() ? Q(nz(d, -5, 5)) : signedQ(pm(d), fr(d, [2, 3, 4, 6], 2));
        return [p, q, form === 'x+a' ? qsub(q, p) : form === 'x-a' ? qadd(q, p) : qsub(p, q)];
      }, (v) => okKind(v[2], n === 0 ? 'int' : 'frac') && v[2].p !== 0 && v[2].q <= 20 && qcmp(v[0], v[1]) !== 0);
      const fig = form === 'x+a' ? `${box()} <i>+</i> ${px(a)} <i>=</i> ${tx(b)}` : form === 'x-a' ? `${box()} <i>−</i> ${px(a)} <i>=</i> ${tx(b)}` : `${px(a)} <i>−</i> ${box()} <i>=</i> ${tx(b)}`;
      const how = form === 'x+a' ? `더한 수 ${tj(a, '을/를')} 빼면 □ = ${subTold(b, a)}` : form === 'x-a' ? `뺀 수 ${tj(a, '을/를')} 더하면 □ = ${addTold(b, a)}` : `${tx(a)}에서 ${tj(b, '을/를')} 빼면 □ = ${subTold(a, b)}`;
      return ansV('□ 안에 알맞은 수는?', x, n === 0 ? 'int' : 'frac', { figure: ex(fig), explain: `${how}이다.`, facts: { value: form === 'x+a' ? `${js(b)}-${js(a)}` : form === 'x-a' ? `${js(b)}+${js(a)}` : `${js(a)}-${js(b)}`, rule: 'sub-box-' + n } });
    }, { count: 2 }),
    T('sub-abs', '절댓값이 있는 덧셈과 뺄셈', '①47', (d) => {
      const list = pickEx(d, () => [A([U(Q(-d.int(2, 9))), '-', U(Q(d.int(2, 9)))]), '-', A([U(Q(-d.int(3, 12))), '+', U(Q(d.int(2, 9)))])], 'int', (e) => val(e[2].list).p !== 0 && val(e).p !== 0);
      return calcQ(list, 'int', { rule: 'sub-abs', explain: `절댓값 기호 안을 먼저 계산한 다음 절댓값을 구한다. ${chainOf(list)}이다.` });
    }),
    T('sub-line-move', '수직선 위에서 움직인 점이 나타내는 수', '①55', (d) => {
      const leftFirst = d.bool();
      const [s, a, b, v] = d.until(() => { const start = Q(nz(d, -2, 3)), x = fr(d, [2, 3, 4], 5), y = fr(d, [2, 3, 4], 5); return [start, x, y, leftFirst ? qadd(qsub(start, x), y) : qsub(qadd(start, x), y)]; },
        (r) => okKind(r[3], 'frac') && r[1].q !== r[2].q && Math.abs(fl(r[3])) <= 4.6 && Math.abs(fl(leftFirst ? qsub(r[0], r[1]) : qadd(r[0], r[1]))) <= 4.8 && fl(r[1]) >= 1.5 && fl(r[2]) >= 1.5 && Math.abs(fl(r[1]) - fl(r[2])) >= 0.4);
      const mid = leftFirst ? qsub(s, a) : qadd(s, a), sides = leftFirst ? ['왼쪽', '오른쪽'] : ['오른쪽', '왼쪽'], list = [U(s), leftFirst ? '-' : '+', U(a), leftFirst ? '+' : '-', U(b)];
      return ansV(`수직선에서 ${tj(s, '을/를')} 나타내는 점에서 ${sides[0]}으로 ${mag(a)}만큼 간 다음, 다시 ${sides[1]}으로 ${mag(b)}만큼 간 점이 나타내는 수는?`, v, 'frac', {
        figure: nline(-5, 5, { moves: [{ from: s, to: mid, label: plain(a) }, { from: mid, to: v, label: plain(b) }] }),
        explain: `수직선에서 오른쪽으로 가면 더하고 왼쪽으로 가면 뺀다. ${commonTold(list)}이다.`,
        facts: { value: jsx(list) }
      });
    })
  ]);

  B.addTypes(UNIT, 'mul', [
    T('mul-int', '정수의 곱셈', '①58 ②53', (d, n) => {
      // 차례마다 구조가 다르다: 부호가 같은 두 음수, 부호가 다른 두 수, 0과의 곱.
      const a = d.int(2, 12), b = d.until(() => d.int(2, 12), (v) => v !== a), s = pm(d);
      const [x, y] = n === 0 ? [Q(-a), Q(-b)] : n === 1 ? [Q(s * a), Q(-s * b)] : d.bool() ? [Q(-a), Q(0)] : [Q(0), Q(-a)];
      return calcQ([P(x), '*', P(y)], 'int', { rule: 'mul-int-' + n, explain: (n === 0 ? SAME_MUL : n === 1 ? DIFF_MUL : '어떤 수와 0의 곱은 항상 0이다. ') + mulTold(x, y) + '이다.' });
    }, { count: 3 }),
    T('mul-frac', '분수의 곱셈', '①59 ②54', (d, n) => {
      // 첫째는 분수끼리(약분이 있다), 둘째는 정수와 분수
      const list = pickEx(d, () => {
        if (n === 1) { const f = P(signedQ(pm(d), fr(d, [3, 4, 5, 6, 8, 9], 1.5))), k = P(Q(pm(d) * d.int(2, 9))); return d.bool() ? [f, '*', k] : [k, '*', f]; }
        return [P(signedQ(pm(d), fr(d, [3, 4, 5, 6, 7, 8, 9], 1.5))), '*', P(signedQ(pm(d), fr(d, [3, 4, 5, 6, 7, 8, 9], 1.5)))];
      }, 'frac', (e) => { const x = e[0].x, y = e[2].x; return (x.p < 0 || y.p < 0) && val(e).q <= 30 && (gcd(x.p, y.q) > 1 || gcd(y.p, x.q) > 1) && qcmp(qabs(x), qabs(y)) !== 0; });
      const x = list[0].x, y = list[2].x;
      return calcQ(list, 'frac', { rule: 'mul-frac-' + n, explain: (x.p * y.p > 0 ? SAME_MUL : DIFF_MUL) + mulTold(x, y) + '이다.' });
    }, { count: 2 }),
    T('mul-dec', '소수의 곱셈, 분수와 소수의 곱셈', '②55', (d, n) => {
      if (n === 0) {
        const list = pickEx(d, () => { const k = P(Q(pm(d) * d.int(2, 9))), x = P(dc(pm(d) * tenths(d, 11, 49))); return d.bool() ? [k, '*', x] : [x, '*', k]; }, 'dec', (e) => e[0].x.p < 0 || e[2].x.p < 0);
        return calcQ(list, 'dec', { rule: 'mul-dec', explain: (list[0].x.p * list[2].x.p > 0 ? SAME_MUL : DIFF_MUL) + mulTold(list[0].x, list[2].x, true) + '이다.' });
      }
      const list = pickEx(d, () => { const [x, dens] = d.pick(DECS), a = P(signedQ(pm(d), fr(d, dens.concat([3]), 2))), b = P(signedQ(pm(d), x)); return d.bool() ? [a, '*', b] : [b, '*', a]; }, 'frac', (e) => val(e).q <= 20 && (e[0].x.p < 0 || e[2].x.p < 0));
      return calcQ(list, 'frac', { rule: 'mul-frac-dec', explain: '소수를 분수로 고쳐서 계산한다. ' + mulTold(list[0].x, list[2].x) + '이다.' });
    }, { count: 2 }),
    T('mul-three', '세 수 이상의 곱셈', '①61 ②56', (d, n) => {
      if (n === 1) {
        // 작은 정수 넷: 부호는 음수의 개수로 정한다.
        const xs = d.until(() => d.shuffle([1, 2, 3, 4, 5]).slice(0, 4).map((v) => Q(pm(d) * v)), (list) => { const neg = list.filter((x) => x.p < 0).length; return neg >= 2 && neg <= 3; });
        const list = [P(xs[0]), '*', P(xs[1]), '*', P(xs[2]), '*', P(xs[3])], neg = xs.filter((x) => x.p < 0).length, v = val(list);
        return calcQ(list, 'int', { rule: 'mul-four', explain: `음수가 ${neg}개(${neg % 2 ? '홀수' : '짝수'} 개)이므로 곱의 부호는 ${neg % 2 ? MINUS : '+'}이다. ${inl(list)} = ${neg % 2 ? MINUS : '+'}(${xs.map(mag).join(' × ')}) = ${tx(v)}이다.` });
      }
      // 곱하면 10, 100, 1이 되는 두 수가 떨어져 있다(교환법칙과 결합법칙).
      const [p, q] = n === 0 ? d.pick([[Q(2), Q(5)], [Q(5), Q(2)], [Q(4), Q(25)], [Q(25), Q(4)], [Q(5), Q(20)], [Q(4), Q(5)]]) : d.pick([[dc(2), Q(5)], [Q(5), dc(2)], [dc(5), Q(2)], [dc2(25), Q(4)], [Q(4), dc2(25)], [dc(4), Q(5)]]);
      const m = Q(d.until(() => d.int(11, 49), (v) => v % 10 !== 0 && v % 5 !== 0)), signs = d.until(() => [pm(d), pm(d), pm(d)], (s) => s.some((v) => v < 0));
      const x = signedQ(signs[0], p), y = signedQ(signs[1], m), z = signedQ(signs[2], q), list = [P(x), '*', P(y), '*', P(z)], xz = qmul(x, z);
      return calcQ(list, 'int', { rule: 'mul-three-' + n, explain: `곱셈의 교환법칙과 결합법칙을 이용하여 ${px(x)}${tail(lastOf(x), '과/와')} ${pj(z, '을/를')} 먼저 곱한다. ${inl(list)} = {${px(x)} × ${px(z)}} × ${px(y)} = ${px(xz)} × ${px(y)} = ${tx(val(list))}이다.` });
    }, { count: 3 }),
    T('mul-law-where', '계산 과정에서 곱셈의 계산 법칙이 이용된 곳 찾기', '①60 ②57', (d) => {
      // ㉠ 자리를 바꾼다(교환법칙), ㉡ 먼저 곱할 두 수를 묶는다(결합법칙), ㉢ 묶은 두 수를 곱한다.
      const [x, y, z] = d.bool() ? (() => { const s = d.until(() => [pm(d), pm(d), pm(d)], (v) => v.some((k) => k < 0)); return [Q(s[0] * 4), Q(s[1] * d.until(() => d.int(3, 19), (v) => v % 5 !== 0 && v % 2 !== 0)), Q(s[2] * 25)]; })()
        : (() => { const q = d.pick([2, 3, 4, 5]), k = d.int(1, 3); return [Q(-q * k * d.int(1, 2)), signedQ(pm(d), fr(d, [2, 3, 5, 7].filter((v) => v !== q), 3)), Q(-1, q)]; })();
      const law = d.pick(['교환법칙', '결합법칙']), yz = qmul(x, z);
      return C(`다음 계산 과정에서 곱셈의 ${law}이 이용된 곳은?`, LAB.slice(0, 3), law === '교환법칙' ? 0 : 1, {
        figure: proc([{ h: html([P(x), '*', P(y), '*', P(z)]) }, { h: html([P(y), '*', P(x), '*', P(z)]), mark: LAB[0] }, { h: html([P(y), '*', G([P(x), '*', P(z)], '{')]), mark: LAB[1] }, { h: html([P(y), '*', P(yz)]), mark: LAB[2] }, { h: tx(qmul(y, yz)) }]),
        explain: `㉠은 ${px(x)}${tail(lastOf(x), '과/와')} ${px(y)}의 자리를 바꾸었으므로 곱셈의 교환법칙, ㉡은 뒤의 두 수를 먼저 곱하도록 묶었으므로 곱셈의 결합법칙을 이용하였다. ㉢은 묶은 두 수를 곱한 것이다.`,
        facts: { truth: [law === '교환법칙', law === '결합법칙', false], want: true }
      });
    }),
    T('mul-law-name', '설명에 알맞은 계산 법칙의 이름 고르기', '②33', (d) => {
      const LAWS = [
        ['두 수의 덧셈에서 두 수의 순서를 바꾸어 더하여도 그 결과는 같다.', '덧셈의 교환법칙'], ['세 수의 덧셈에서 앞의 두 수를 먼저 더한 결과와 뒤의 두 수를 먼저 더한 결과는 같다.', '덧셈의 결합법칙'],
        ['두 수의 곱셈에서 두 수의 순서를 바꾸어 곱하여도 그 결과는 같다.', '곱셈의 교환법칙'], ['세 수의 곱셈에서 앞의 두 수를 먼저 곱한 결과와 뒤의 두 수를 먼저 곱한 결과는 같다.', '곱셈의 결합법칙'],
        ['어떤 수에 두 수의 합을 곱한 결과는 어떤 수에 두 수를 각각 곱하여 더한 결과와 같다.', '분배법칙']
      ];
      const [said, right] = d.pick(LAWS), rows = d.shuffle([right].concat(d.shuffle(LAWS.map((r) => r[1]).filter((v) => v !== right)).slice(0, 3)));
      return C(`「${said}」 이 설명에 알맞은 계산 법칙은?`, rows, rows.indexOf(right), {
        explain: `순서를 바꾸어도 결과가 같다는 것은 교환법칙, 어느 두 수를 먼저 계산하여도 결과가 같다는 것은 결합법칙, 합에 곱한 것을 각각 곱하여 더한 것으로 고칠 수 있다는 것은 분배법칙이다. 설명에 알맞은 것은 ${right}이다.`,
        facts: { truth: rows.map((r) => r === right), want: true }
      });
    }),
    T('mul-pow-value', '음수의 거듭제곱 계산하기', '①62', (d, n) => {
      // 차례마다 구조가 다르다: 음수의 짝수 제곱, 음수의 홀수 제곱, 괄호가 없는 −a², 음의 분수의 거듭제곱.
      if (n === 3) {
        const x = d.until(() => Q(-d.int(1, 3), d.pick([2, 3, 4, 5])), (v) => v.q > 1), k = x.q <= 3 ? d.int(2, 3) : 2, list = [W(x, k)];
        return calcQ(list, 'frac', { rule: 'pow-frac', explain: `${inl(list)} = ${Array(k).fill(px(x)).join(' × ')} = ${tx(val(list))}이다. 음수를 ${k % 2 ? '홀수' : '짝수'} 번 곱하면 ${k % 2 ? '음수' : '양수'}이다.` });
      }
      const a = n === 1 ? d.int(2, 5) : d.int(2, 9), k = n === 1 ? (a === 2 ? d.pick([3, 5]) : 3) : a <= 3 ? d.pick([2, 4]) : 2, x = Q(-a);
      const list = n === 2 ? [WN(Q(a), k)] : [W(x, k)];
      const why = n === 2 ? `${inl(list)}은 ${a}${sup(k)}에 −를 붙인 수이다. ${inl(list)} = −(${Array(k).fill(a).join(' × ')}) = ${tx(val(list))}이다.`
        : `${inl(list)} = ${Array(k).fill(px(x)).join(' × ')} = ${tx(val(list))}이다. 음수를 ${k % 2 ? '홀수' : '짝수'} 번 곱하면 ${k % 2 ? '음수' : '양수'}이다.`;
      return calcQ(list, 'int', { rule: 'pow-' + n, explain: why });
    }, { count: 4 }),
    T('mul-pow-claims', '거듭제곱의 계산이 옳지 않은 것 찾기', '①63 ②58', (d) => {
      const base = () => d.int(2, 5);
      // [식, 흔히 틀리는 값]
      const makers = [
        () => { const a = base(); return [W(Q(-a), 2), -a * a]; }, () => { const a = base(); return [WN(Q(a), 2), a * a]; }, () => { const a = d.int(2, 4); return [W(Q(-a), 3), a ** 3]; },
        () => { const a = base(); return [MN(W(Q(-a), 2)), a * a]; }, () => { const a = d.int(2, 3); return [MN(W(Q(-a), 3)), -(a ** 3)]; }, () => { const k = d.int(4, 9); return [W(Q(-1), k), k % 2 ? 1 : -1]; }
      ];
      const rows = d.shuffle(makers).slice(0, 4).map((make) => make()), wrongAt = d.int(0, 3), said = rows.map(([t, slip], i) => (i === wrongAt ? slip : valT(t).p));
      return C('거듭제곱의 계산이 옳지 않은 것은?', rows.map(([t], i) => `${inl([t])} = ${tx(Q(said[i]))}`), wrongAt, {
        explain: `${inl([rows[wrongAt][0]])} = ${tx(valT(rows[wrongAt][0]))}이다. 괄호가 있으면 음수를 거듭 곱하고, 괄호가 없으면 양수를 거듭 곱한 다음 −를 붙인다. 음수를 짝수 번 곱하면 양수, 홀수 번 곱하면 음수이다.`,
        facts: { claimed: rows.map(([t], i) => [jsx([t]), said[i]]), claimedWant: false }
      });
    }),
    T('mul-pow-mul', '거듭제곱이 있는 곱셈', '①64 ②59', (d, n) => {
      const list = n === 0 ? pickEx(d, () => d.pick([
        () => [W(Q(-d.int(1, 2)), 3), '*', W(Q(-d.int(2, 5)), 2)], () => [WN(Q(d.int(2, 4)), 2), '*', W(Q(-d.int(2, 4)), 2)], () => [W(Q(-1), d.int(5, 9)), '*', WN(Q(d.int(2, 5)), 2), '*', S(Q(-d.int(2, 5)))]
      ])(), 'int', (e) => Math.abs(val(e).p) <= 400 && new Set(e.filter((t) => typeof t !== 'string').map((t) => Math.abs(t.x.p))).size >= 2)
        : pickEx(d, () => d.pick([
          () => [W(Q(-d.int(1, 3), d.pick([2, 3, 5])), 2), '*', S(signedQ(-1, fr(d, [2, 3, 4, 9], 2)))], () => [W(Q(-1, d.int(2, 3)), 3), '*', W(Q(-1), 3), '*', S(Q(-d.int(2, 9)))], () => [WN(Q(d.int(2, 3)), 2), '*', W(Q(-d.int(1, 3), d.pick([2, 4, 5])), 2)]
        ])(), 'frac', (e) => val(e).q <= 30 && Math.abs(val(e).p) <= 40 && e.filter((t) => t.k === 'w' && t.n === 2).every((t) => t.x.q > 1));
      return calcQ(list, n === 0 ? 'int' : 'frac', { rule: 'pow-mul-' + n, explain: `거듭제곱을 먼저 계산한다. ${chainOf(list)}이다.` });
    }, { count: 2 }),
    T('mul-minus-one', '−1의 거듭제곱이 있는 계산', '②60', (d) => {
      const odd = () => 2 * d.int(5, 49) + 1, even = () => 2 * d.int(5, 50), ns = d.shuffle([odd(), even(), d.bool() ? odd() : even()]);
      const list = pickEx(d, () => [W(Q(-1), ns[0]), '*', U(Q(d.int(2, 5))), d.pick(['+', '-']), W(Q(-1), ns[1]), d.pick(['+', '-']), W(Q(-1), ns[2])], 'int', (e) => e.includes('-'));
      return calcQ(list, 'int', { rule: 'pow-minus-one', explain: `−1을 짝수 번 곱하면 1, 홀수 번 곱하면 −1이다. ${chainOf(list)}이다.` });
    }),
    T('mul-dist-open', '분배법칙으로 괄호 풀어 계산하기', '①66 ②62', (d) => {
      const [a, f1, f2, op, front] = d.until(() => { const x = fr(d, [2, 3, 4, 5, 6, 8], 2), y = fr(d, [3, 4, 5, 6, 8, 12], 2), L = lcm(x.q, y.q); return [Q(pm(d) * L * d.int(1, 3)), x, y, d.pick(['+', '-']), d.bool()]; },
        (r) => { const v = qmul(r[0], r[3] === '+' ? qadd(r[1], r[2]) : qsub(r[1], r[2])); return r[1].q !== r[2].q && Math.abs(r[0].p) <= 60 && (r[0].p < 0 || v.p < 0) && v.p !== 0 && Math.abs(v.p) <= 99; });
      const inner = G([U(f1), op, U(f2)]), list = front ? [S(a), '*', inner] : [inner, '*', S(a)], p1 = qmul(a, f1), p2 = qmul(a, f2), o = OPS[op];
      const spread = front ? `${inl([S(a), '*', U(f1)])} ${o} ${inl([S(a), '*', U(f2)])}` : `${inl([U(f1), '*', S(a)])} ${o} ${inl([U(f2), '*', S(a)])}`;
      return calcQ(list, 'int', { rule: 'dist-open', explain: `분배법칙을 이용하여 괄호 안의 두 수에 ${tj(a, '을/를')} 각각 곱한다. ${inl(list)} = ${spread} = ${inl([S(p1), op, S(p2)])} = ${tx(val(list))}이다.` });
    }),
    T('mul-dist-factor', '분배법칙으로 공통으로 곱해진 수를 묶어 계산하기', '①67 ②63', (d, n) => {
      const total = d.pick([100, 100, 10]), c = n === 0 ? Q(-d.int(2, 9)) : d.bool() ? Q(-d.until(() => d.int(11, 19), (v) => v % 10 !== 0)) : dc(-tenths(d, 11, 49));
      const a = total === 100 ? (n === 0 && d.bool() ? d.int(101, 139) : d.until(() => d.int(13, 87), (v) => v !== 50 && v % 10 !== 0)) : d.int(11, 19), b = total - a;
      const first = [U(Q(a)), '*', S(c)], second = [S(Q(b)), '*', S(c)], list = first.concat(['+'], second), v = val(list);
      if (n === 0) return calcQ(list, 'int', { rule: 'dist-factor', explain: `두 곱에 공통으로 곱해진 수 ${tj(c, '으로/로')} 묶는다. ${inl(list)} = {${a} + ${b < 0 ? '(' + tx(Q(b)) + ')' : b}} × ${px(c)} = ${total} × ${px(c)} = ${tx(v)}이다.` });
      const flip = [S(c), '*', U(Q(a)), '+', S(c), '*', S(Q(b))];
      return M('다음은 분배법칙을 이용하여 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: total, signed: true }, { label: LAB[1], answer: v.p, signed: true }], {
        figure: proc([{ h: html(flip) }, { h: `${px(c)} <i>×</i> ${box(LAB[0])}` }, { h: box(LAB[1]) }]),
        explain: `공통으로 곱해진 수 ${tj(c, '으로/로')} 묶으면 ${inl(flip)} = ${px(c)} × {${a} + ${b < 0 ? '(' + tx(Q(b)) + ')' : b}} = ${px(c)} × ${total} = ${tx(v)}이다.`,
        // 소수는 10배 한 정수로 셈한다(소수의 곱은 컴퓨터 셈에서 끝자리가 어긋난다).
        facts: c.d ? { calc: [[`${a}+${js(Q(b))}`, 0], [`(${c.p * 10 / c.q})*(${a}+${js(Q(b))})/10`, 1]], unseen: [Math.abs(c.p * 10 / c.q), 10] } : { calc: [[`${a}+${js(Q(b))}`, 0], [`${js(c)}*(${a}+${js(Q(b))})`, 1]] }
      });
    }, { count: 2 }),
    T('mul-dist-near', '분배법칙으로 100에 가까운 수 곱하기', '①68 ②64', (d) => {
      const a = d.until(() => d.int(12, 39), (v) => v % 10 !== 0), k = d.int(1, 5), under = d.bool(), n = under ? 100 - k : 100 + k, v = -a * n;
      return M('다음은 분배법칙을 이용하여 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LAB[0], answer: k, signed: true }, { label: LAB[1], answer: a * k, signed: true }, { label: LAB[2], answer: v, signed: true }], {
        figure: proc([{ h: `(−${a}) <i>×</i> ${n}` }, { h: `(−${a}) <i>×</i> (100 <i>${under ? MINUS : '+'}</i> ${box(LAB[0])})` }, { h: `−${a * 100} <i>${under ? '+' : MINUS}</i> ${box(LAB[1])}` }, { h: box(LAB[2]) }]),
        explain: `${n} = 100 ${under ? MINUS : '+'} ${k}이므로 (−${a}) × ${n} = (−${a}) × 100 ${under ? MINUS : '+'} (−${a}) × ${k} = −${a * 100} ${under ? '+' : MINUS} ${a * k} = ${tx(Q(v))}이다.`,
        facts: { calc: [[under ? `100-${n}` : `${n}-100`, 0], [under ? `${a}*(100-${n})` : `${a}*(${n}-100)`, 1], [`(-${a})*${n}`, 2]] }
      });
    }),
    T('mul-dist-letters', '분배법칙으로 문자가 나타내는 수의 식의 값 구하기', '①69', (d) => {
      const [p, q] = d.until(() => [nz(d, -12, 12), nz(d, -12, 12)], ([x, y]) => (x < 0 || y < 0) && x + y !== 0), a = V('a'), b = V('b'), c = V('c');
      return N(`세 수 ${a}, ${b}, ${c}에 대하여 ${nb(`${a} × ${b} = ${tx(Q(p))}`)}, ${nb(`${a} × ${c} = ${tx(Q(q))}`)}일 때, ${nb(`${a} × (${b} + ${c})`)}의 값은?`, p + q, {
        signed: true, explain: `분배법칙에 의하여 ${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c} = ${addTold(Q(p), Q(q))}이다.`, facts: { value: `${js(Q(p))}+${js(Q(q))}` }
      });
    }),
    T('mul-box-opposite', '합이 0인 수가 마주 보는 상자에서 세 수의 곱', '①74', (d) => {
      const xs = d.until(() => d.shuffle([Q(pm(d) * d.int(2, 5)), Q(pm(d) * d.int(2, 5)), signedQ(pm(d), fr(d, [2, 3, 4, 5], 1.5))]), (list) => { const v = list.reduce(qmul); return v.q > 1 && distinct(list.map(qabs)) && list.filter((x) => x.p < 0).length >= 1 && list.filter((x) => x.p < 0).length <= 2; });
      const ys = xs.map(qneg), list = [S(ys[0]), '*', S(ys[1]), '*', S(ys[2])];
      return ansV(`상자의 여섯 면에 수가 하나씩 적혀 있고, 마주 보는 면에 적힌 두 수의 합은 0이다. 서로 마주 보지 않는 세 면에 적힌 수가 ${xs.map(tx).join(', ')}일 때, 나머지 세 면에 적힌 수의 곱은?`, val(list), 'frac', {
        explain: `합이 0인 두 수는 절댓값이 같고 부호가 반대이다. 나머지 세 면에 적힌 수는 ${ys.map(tx).join(', ')}이다. 음수가 ${ys.filter((y) => y.p < 0).length}개이므로 ${chainOf(list)}이다.`,
        facts: { value: jsx(list) }
      });
    }),
    T('mul-claims', '곱셈의 계산이 옳지 않은 것 찾기', '②66', (d) => {
      // [식, 흔히 틀리는 값(없으면 null)]
      const makers = [
        () => { const a = d.int(2, 9), b = d.int(2, 9); return [[P(Q(-a)), '*', P(Q(b))], Q(a * b)]; },
        () => { const q = d.pick([7, 11, 13, 17]), k = d.int(2, 4); return [[P(Q(1, q)), '*', P(Q(q * k))], null]; },
        () => { const a = d.int(1, 3), b = d.int(2, 4); return [[P(Q(-a)), '*', W(Q(-b), 2)], Q(a * b * b)]; },
        () => { const a = d.int(11, 19), s = pm(d); return [[P(Q(s * a)), '*', U(Q(0))], Q(s * a)]; },
        () => { const [a, b, c] = d.shuffle([2, 3, 4, 5]); return [[P(Q(-a)), '*', P(Q(-b)), '*', P(Q(-c))], Q(a * b * c)]; },
        () => { const q = d.pick([3, 5, 7]), p = d.pick([2, 4]); return [[P(Q(-p, q)), '*', P(Q(-q * d.int(1, 2), p * 2))], null]; }
      ];
      const rows = d.until(() => d.shuffle(makers).slice(0, 4).map((make) => make()), (list) => list.filter((r) => r[1]).length >= 2), can = rows.map((r, i) => (r[1] ? i : -1)).filter((i) => i >= 0), wrongAt = d.pick(can);
      const said = rows.map(([list, slip], i) => (i === wrongAt ? slip : val(list)));
      return C('곱셈의 계산이 옳지 않은 것은?', rows.map(([list], i) => `${inl(list)} = ${said[i].p === 0 ? '0' : sx(said[i])}`), wrongAt, {
        explain: `${chainOf(rows[wrongAt][0])}이다. 곱의 부호는 음수가 짝수 개이면 +, 홀수 개이면 −이고, 어떤 수와 0의 곱은 0이다.`,
        facts: { truth: rows.map((r, i) => i !== wrongAt), want: false }
      });
    })
  ]);

  B.addTypes(UNIT, 'div', [
    T('div-int', '정수의 나눗셈', '①75 ②69', (d, n) => {
      // 차례마다 구조가 다르다: 부호가 같은 두 음수, 부호가 다른 두 수, 0을 나눈다.
      const b = d.int(2, 9), k = d.int(2, 9), s = pm(d);
      const [x, y] = n === 0 ? [Q(-b * k), Q(-b)] : n === 1 ? [Q(s * b * k), Q(-s * b)] : [Q(0), Q(-b)];
      return calcQ([P(x), '/', P(y)], 'int', { rule: 'div-int-' + n, explain: (n === 0 ? SAME_DIV : n === 1 ? DIFF_DIV : '0을 0이 아닌 수로 나눈 몫은 항상 0이다. ') + divTold(x, y) + '이다.' });
    }, { count: 3 }),
    T('div-dec', '소수의 나눗셈', '②70', (d, n) => {
      // 첫째는 소수끼리 나누어 몫이 정수, 둘째는 소수를 정수로 나누어 몫이 소수
      const list = n === 0 ? pickEx(d, () => { const t = tenths(d, 3, 24), k = d.int(2, 9), s = pm(d); return [P(dc(s * t * k)), '/', P(dc(-s * t))]; }, 'int', (e) => e[0].x.q !== 1 && Math.abs(fl(e[0].x)) < 20)
        : pickEx(d, () => { const k = d.int(2, 9), t = tenths(d, 2, 19), s = pm(d), u = pm(d); return [P(dc(s * t * k)), '/', P(Q(u * k))]; }, 'dec', (e) => e[0].x.q !== 1 && (e[0].x.p < 0 || e[2].x.p < 0));
      return calcQ(list, n === 0 ? 'int' : 'dec', { rule: 'div-dec-' + n, explain: (list[0].x.p * list[2].x.p > 0 ? SAME_DIV : DIFF_DIV) + divTold(list[0].x, list[2].x, true) + '이다.' });
    }, { count: 2 }),
    T('div-recip', '역수 구하기', '①76 ②71', (d, n) => {
      // 차례마다 수의 종류가 다르다: 음의 분수, 정수, 소수, 분자가 1인 분수(역수가 정수).
      const good = d.until(() => (n === 0 ? Q(-d.int(2, 12), d.pick([3, 5, 7, 11])) : n === 1 ? Q(pm(d) * d.int(2, 15)) : n === 2 ? dc(pm(d) * d.pick([3, 7, 9, 11, 13, 15, 25])) : Q(pm(d), d.int(2, 15))), (x) => n !== 0 || (x.q > 1 && Math.abs(x.p) > 1));
      const v = qdiv(Q(1), plainQ(good));
      const why = n === 2 ? `${tx(good)} = ${tx(plainQ(good))}이고 ${px(plainQ(good))} × ${px(v)} = 1이므로 ${tx(good)}의 역수는 ${tx(v)}이다.` : `${px(good)} × ${px(v)} = 1이므로 ${tx(good)}의 역수는 ${tx(v)}이다.`;
      return ansV(`${tx(good)}의 역수는?`, v, n === 3 ? 'int' : 'frac', { explain: `두 수의 곱이 1일 때 한 수를 다른 수의 역수라고 한다. 역수의 부호는 처음 수의 부호와 같다. ${why}`, facts: { value: `1/${js(good)}`, unseen: [1], rule: 'recip-' + n } });
    }, { count: 4 }),
    T('div-recip-pair', '서로 역수인 두 수의 짝 고르기', '①76 ②72', (d) => {
      const pair = (x, y) => `${tj(x, '과/와')} ${tx(y)}`;
      const f = fr(d, [3, 5, 7], 2), g = fr(d, [2, 3, 4, 5, 7], 2), k = d.int(2, 9), t = d.pick([3, 7, 9]);
      const right = d.pick([[qneg(f), qneg(qdiv(Q(1), f))], [dc(d.pick([6, 4, 8])), null], [Q(-k), Q(-1, k)]]);
      if (!right[1]) right[1] = qdiv(Q(1), plainQ(right[0]));
      // 틀린 짝: 부호를 바꾼 것, 소수의 숫자만 뒤집은 것, 부호만 반대인 수
      const wrong = d.shuffle([[g, qneg(qdiv(Q(1), g))], [Q(-(k + 1)), Q(1, k + 1)], [dc(t), Q(t)], [f, qneg(f)], [qneg(g), qdiv(Q(1), g)]]).slice(0, 3), rows = d.shuffle([right].concat(wrong));
      return C('서로 역수인 두 수를 짝 지은 것은?', rows.map(([x, y]) => pair(x, y)), rows.indexOf(right), {
        explain: `곱이 1인 두 수가 서로 역수이다. ${px(right[0])} × ${px(right[1])} = 1이다. 곱이 1이 되려면 두 수의 부호가 같아야 한다.`,
        facts: { truth: rows.map((r) => r === right), want: true }
      });
    }),
    T('div-recip-product', '곱이 1인 두 수에서 다른 한 수 구하기', '①78', (d) => {
      const m = d.int(2, 6), k = d.until(() => d.int(2, 6), (v) => v !== m), s = pm(d), x = Q(s, m), y = Q(-s, k), a = V('a'), b = V('b'), list = [S(x), '*', S(y)], v = qdiv(Q(1), val(list));
      return ansV(`두 수 ${a}, ${b}에 대하여 ${nb(`${a} = ${inl(list)}`)}이고 ${nb(`${a} × ${b} = 1`)}일 때, ${b}의 값은?`, v, 'int', {
        explain: `${a} = ${inl(list)} = ${tx(val(list))}이다. ${a} × ${b} = 1이므로 ${b}는 ${a}의 역수이고, ${tx(val(list))}의 역수는 ${tx(v)}이다.`,
        facts: { value: `1/(${jsx(list)})` }
      });
    }),
    T('div-frac', '분수가 있는 나눗셈', '①79 ②73', (d, n) => {
      // 차례마다 구조가 다르다: 분수끼리, 정수를 분수로(몫이 정수), 정수를 정수로(몫이 분수), 분수를 소수로.
      const kind = n === 1 ? 'int' : 'frac';
      const list = pickEx(d, () => {
        if (n === 0) return [P(signedQ(pm(d), fr(d, [2, 3, 4, 5, 6, 9], 1.5))), '/', P(signedQ(pm(d), fr(d, [2, 3, 4, 5, 6, 9], 1.5)))];
        if (n === 1) { const f = fr(d, [2, 3, 4, 5], 1.5); return [P(Q(pm(d) * f.p * d.int(1, 4))), '/', P(signedQ(pm(d), f))]; }
        if (n === 2) return [P(Q(pm(d) * d.int(2, 12))), '/', P(Q(pm(d) * d.int(2, 12)))];
        return [P(signedQ(pm(d), fr(d, [2, 3, 5], 2))), '/', P(dc(pm(d) * d.pick([3, 5, 6, 9, 12, 15, 18])))];
      }, kind, (e) => (e[0].x.p < 0 || e[2].x.p < 0) && val(e).q <= 30 && qcmp(qabs(e[0].x), qabs(e[2].x)) !== 0 && (n !== 1 || Math.abs(e[2].x.p) > 1));
      return calcQ(list, kind, { rule: 'div-frac-' + n, explain: BY_RECIP + divTold(list[0].x, list[2].x) + '이다.' });
    }, { count: 4 }),
    T('div-muldiv', '곱셈과 나눗셈의 혼합 계산', '①80 ②75', (d, n) => {
      if (n === 0) {
        // 정수: 앞에서부터 차례대로 계산한다(뒤의 곱셈을 먼저 하면 값이 달라진다).
        const list = pickEx(d, () => { const b = d.int(2, 6), k = d.int(2, 6), c = d.int(2, 6); return [P(Q(pm(d) * b * k)), '/', P(Q(pm(d) * b)), '*', P(Q(pm(d) * c))]; }, 'int', (e) => e.filter((t) => typeof t !== 'string' && t.x.p < 0).length >= 2);
        return calcQ(list, 'int', { rule: 'muldiv-int', explain: `곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례대로 계산한다. ${chainOf(list)}이다.` });
      }
      const f = () => signedQ(pm(d), fr(d, [2, 3, 4, 5, 6, 9], 1.5));
      const list = pickEx(d, () => (n === 1 ? [U(Q(-d.int(2, 9))), '/', U(f()), '*', U(f())] : [P(f()), '/', P(f()), '/', P(f())]), 'frac', (e) => { const xs = e.filter((t) => typeof t !== 'string').map((t) => t.x); return xs.filter((x) => x.p < 0).length >= 2 && val(e).q <= 15 && Math.abs(val(e).p) <= 40 && distinct(xs.map(qabs)); });
      return calcQ(list, 'frac', { rule: 'muldiv-frac-' + n, explain: `나눗셈을 역수의 곱셈으로 고친 다음, 음수의 개수로 부호를 정한다. ${recipTold(list)}이다.` });
    }, { count: 3 }),
    T('div-muldiv-pow', '거듭제곱이 있는 곱셈과 나눗셈의 혼합 계산', '①81 ②76', (d, n) => {
      const list = n === 0 ? pickEx(d, () => d.pick([
        () => [W(Q(-2), 3), '*', W(Q(-3), 2), '/', S(Q(pm(d) * d.pick([4, 6, 12, 18, 24])))], () => [WN(Q(3), 2), '*', W(Q(-d.pick([2, 4])), 2), '/', W(Q(-2), d.pick([2, 3]))], () => [W(Q(-d.pick([4, 6])), 2), '/', S(Q(-d.pick([2, 3, 4]))), '*', W(Q(-1), d.int(3, 7))]
      ])(), 'int', (e) => intsOnly(e) && Math.abs(val(e).p) <= 200)
        : pickEx(d, () => d.pick([
          () => [W(Q(-1, d.pick([2, 3])), 2), '/', S(fr(d, [5, 9, 15], 1)), '*', S(qneg(fr(d, [2, 3, 5], 1)))], () => [S(qneg(fr(d, [2, 4], 4))), '/', W(Q(-1, 2), 3), '*', S(fr(d, [4, 8, 9], 1))], () => [W(Q(-d.pick([2, 3])), 2), '*', S(qneg(fr(d, [4, 6, 9], 1))), '/', S(Q(pm(d) * d.pick([2, 5, 7])))]
        ])(), 'frac', (e) => val(e).q <= 30 && biggest(e) <= 99);
      return calcQ(list, n === 0 ? 'int' : 'frac', { rule: 'muldiv-pow-' + n, explain: `거듭제곱을 먼저 계산한 다음, 곱셈과 나눗셈을 앞에서부터 차례대로 계산한다. ${chainOf(list)}이다.` });
    }, { count: 2 }),
    T('div-claims', '나눗셈의 계산이 옳지 않은 것 찾기', '①82 ②66 심36', (d) => {
      const nice = (v) => v.q <= 12 && Math.abs(v.p) <= 60;
      // [식, 흔히 틀리는 값]: 역수로 고치지 않고 곱한 값, 부호를 잘못 정한 값, 뒤의 두 수를 먼저 나눈 값
      const makers = [
        () => { const f = fr(d, [3, 4, 5], 1), k = d.int(2, 4) * f.p, list = [P(Q(k)), '/', P(qneg(f))]; return [list, qmul(Q(k), qneg(f))]; },
        () => { const f = fr(d, [3, 5, 7, 9], 1), g = fr(d, [3, 5, 7, 9], 1), list = [P(qneg(f)), '/', P(qneg(g))]; return [list, qneg(val(list))]; },
        () => { const f = fr(d, [2, 5], 1), g = Q(1, d.pick([4, 10])), k = d.int(2, 3), list = [P(f), '/', P(qneg(g)), '/', P(Q(-k))]; return [list, qneg(val(list))]; },
        () => { const a = d.int(2, 9), b = d.until(() => d.int(2, 9), (v) => gcd(v, a) === 1), list = [P(Q(-a)), '/', P(Q(b))]; return [list, Q(-b, a)]; },
        () => { const f = fr(d, [5, 7], 3), k = d.pick([2, 7]), g = fr(d, [3, 15], 1), list = [P(qneg(f)), '/', P(Q(-k)), '/', P(qneg(g))]; return [list, qdiv(qneg(f), qdiv(Q(-k), qneg(g)))]; }
      ];
      const rows = d.until(() => d.shuffle(makers).slice(0, 4).map((make) => make()), (list) => list.every(([e, slip]) => nice(val(e)) && nice(slip) && qcmp(val(e), slip) !== 0 && val(e).p !== 0)), wrongAt = d.int(0, 3);
      const said = rows.map(([e, slip], i) => (i === wrongAt ? slip : val(e)));
      return C('나눗셈의 계산이 옳지 않은 것은?', rows.map(([e], i) => `${inl(e)} = ${sx(said[i])}`), wrongAt, {
        explain: `나눗셈은 나누는 수의 역수를 곱하여 앞에서부터 차례대로 계산하고, 부호는 음수의 개수로 정한다. ${recipTold(rows[wrongAt][0])}이다.`,
        facts: { truth: rows.map((r, i) => i !== wrongAt), want: false }
      });
    }),
    T('div-box', '□가 있는 곱셈·나눗셈 식', '①83', (d, n) => {
      // 첫째: a × □ = b (□는 정수), 둘째: □ ÷ a = b (□는 분수)
      if (n === 0) {
        const a = signedQ(pm(d), fr(d, [2, 3, 4, 5, 8], 1.5)), x = Q(d.until(() => nz(d, -9, 9), (v) => Math.abs(v) > 1)), b = qmul(a, x), front = d.bool();
        return ansV('□ 안에 알맞은 수는?', x, 'int', { figure: ex(front ? `${px(a)} <i>×</i> ${box()} <i>=</i> ${tx(b)}` : `${box()} <i>×</i> ${px(a)} <i>=</i> ${tx(b)}`), explain: `곱한 수 ${tj(a, '으로/로')} 나누면 □ = ${divTold(b, a)}이다.`, facts: { value: `${js(b)}/${js(a)}`, rule: 'div-box-0' } });
      }
      const [a, b, x] = d.until(() => { const p = signedQ(-1, fr(d, [2, 3, 4, 5], 1.5)), q = d.bool() ? Q(nz(d, -6, 6)) : signedQ(pm(d), fr(d, [2, 3, 5, 7], 1.5)); return [p, q, qmul(q, p)]; }, (v) => okKind(v[2], 'frac') && v[2].q <= 30);
      return ansV('□ 안에 알맞은 수는?', x, 'frac', { figure: ex(`${box()} <i>÷</i> ${px(a)} <i>=</i> ${tx(b)}`), explain: `나눈 수 ${tj(a, '을/를')} 곱하면 □ = ${mulTold(b, a)}이다.`, facts: { value: `${js(b)}*${js(a)}`, rule: 'div-box-1' } });
    }, { count: 2 }),
    T('div-dist-expr', '합을 나눈 식과 계산 결과가 항상 같은 식 고르기', '①70', (d) => {
      const [a, b, c] = d.pick([['a', 'b', 'c'], ['x', 'y', 'z']]).map(V), right = `${a} ÷ ${c} + ${b} ÷ ${c}`;
      const rows = d.shuffle([right, `${a} + ${b} ÷ ${c}`, `${a} ÷ ${c} + ${b}`, `${c} ÷ ${a} + ${c} ÷ ${b}`]);
      return C(`0이 아닌 세 수 ${a}, ${b}, ${c}에 대하여 ${nb(`(${a} + ${b}) ÷ ${c}`)}와 계산 결과가 항상 같은 식은?`, rows, rows.indexOf(right), {
        explain: `${c}로 나누는 것은 ${c}의 역수 ${frac(1, c)}을 곱하는 것과 같다. 분배법칙에 의하여 (${a} + ${b}) × ${frac(1, c)} = ${a} × ${frac(1, c)} + ${b} × ${frac(1, c)} = ${right}이다.`,
        facts: { truth: rows.map((r) => r === right), want: true }
      });
    })
  ]);

  B.addTypes(UNIT, 'mix', [
    T('mix-plain', '괄호가 없거나 소괄호만 있는 혼합 계산', '①85 ②81', (d, n) => {
      const int = (lo, hi) => Q(d.int(lo, hi)), neg = (lo, hi) => Q(-d.int(lo, hi));
      const list = n === 0 ? pickEx(d, () => d.pick([
        () => { const c = d.int(2, 6); return [P(neg(2, 9)), '-', P(Q(-c * d.int(2, 5))), '/', P(Q(c))]; },
        () => [U(neg(2, 9)), '-', U(int(2, 6)), '*', U(neg(2, 6))],
        () => { const e = d.int(2, 7); return [U(int(2, 6)), '*', U(neg(2, 9)), '+', U(Q(e * d.int(2, 6))), '/', U(Q(e))]; },
        () => { const b = d.int(2, 5); return [P(Q(-b * d.int(2, 6))), '/', P(Q(-b)), '-', U(int(2, 5)), '*', P(int(2, 6))]; }
      ])(), 'int', (e) => intsOnly(e) && Math.abs(val(e).p) <= 60)
        : pickEx(d, () => d.pick([
          () => [U(fr(d, [2, 3, 4], 2)), '-', G([U(int(1, 3)), '+', U(fr(d, [3, 5, 7], 1))]), '/', U(fr(d, [3, 5, 7], 1))],
          () => [U(fr(d, [2, 3, 6], 1)), '/', S(qneg(fr(d, [2, 3, 4], 1))), '-', U(fr(d, [2, 4, 5], 2)), '*', U(int(2, 4))],
          () => [S(qneg(fr(d, [2, 3, 4], 2))), '+', U(fr(d, [3, 4, 6], 1)), '*', G([U(int(1, 3)), '-', U(fr(d, [2, 3], 3))])]
        ])(), 'frac', (e) => val(e).q <= 12 && Math.abs(val(e).p) <= 40 && biggest(e) <= 60 && val(e).p < 0);
      return calcQ(list, n === 0 ? 'int' : 'frac', { rule: 'mix-plain-' + n, explain: `${list.some((t) => t.k === 'g') ? '괄호 안을 먼저 계산한다. ' : ''}곱셈과 나눗셈을 먼저 계산한 다음 덧셈과 뺄셈을 계산한다. ${chainOf(list)}이다.` });
    }, { count: 2 }),
    T('mix-pow-int', '거듭제곱이 있는 정수의 혼합 계산', '②82', (d) => {
      const list = pickEx(d, () => d.pick([
        () => { const e = d.int(2, 5); return [W(Q(-d.int(2, 3)), 3), '+', G([U(Q(d.int(6, 15))), '-', U(Q(d.int(1, 9)))]), '/', U(Q(e))]; },
        () => { const e = d.pick([2, 4]); return [W(Q(d.pick([4, 6])), 2), '*', G([U(Q(1)), '-', U(Q(d.int(3, 6)))]), '/', S(Q(-e))]; },
        () => [U(Q(d.int(2, 9))), '-', W(Q(d.int(2, 4)), 2), '*', S(Q(-d.int(2, 4)))],
        () => { const b = d.pick([2, 4, 6]); return [S(Q(-d.int(2, 9))), '+', W(Q(-b), 2), '/', S(Q(-d.pick([2, 4])))]; }
      ])(), 'int', (e) => intsOnly(e) && Math.abs(val(e).p) <= 99 && val(e).p !== 0);
      return calcQ(list, 'int', { rule: 'mix-pow-int', explain: `거듭제곱을 먼저 계산하고, 괄호 안, 곱셈과 나눗셈, 덧셈과 뺄셈의 차례로 계산한다. ${chainOf(list)}이다.` });
    }),
    T('mix-brace', '중괄호가 있는 혼합 계산', '①86 ②83', (d, n) => {
      const int = (lo, hi) => Q(d.int(lo, hi)), neg = (lo, hi) => Q(-d.int(lo, hi));
      const list = n === 0 ? pickEx(d, () => d.pick([
        () => { const c = d.int(2, 6); return [U(int(5, 19)), '-', G([U(Q(c * d.int(2, 6))), '/', U(Q(-c)), '+', U(int(2, 9))], '{')]; },
        () => { const f = d.int(2, 6); return [G([U(int(5, 19)), '-', G([U(int(3, 12)), '-', U(int(13, 25))]), '*', U(int(2, 4))], '{'), '/', U(Q(-f))]; },
        () => { const f = d.int(2, 5); return [U(neg(2, 9)), '+', G([U(int(2, 12)), '-', U(int(2, 5)), '*', U(neg(2, 5))], '{'), '/', U(Q(f))]; }
      ])(), 'int', (e) => intsOnly(e) && Math.abs(val(e).p) <= 60 && val(e).p !== 0)
        : pickEx(d, () => d.pick([
          () => [G([U(int(5, 15)), '-', U(int(2, 8)), '/', S(qneg(fr(d, [3, 5], 1)))], '{'), '*', U(Q(1, d.pick([4, 6, 8, 9])))],
          () => [U(fr(d, [2, 3, 4], 2)), '-', G([U(int(1, 3)), '-', U(fr(d, [2, 3, 6], 2)), '*', U(fr(d, [2, 3, 4], 1))], '{')],
          () => [G([U(fr(d, [2, 3], 2)), '-', U(int(1, 3))], '{'), '/', S(qneg(fr(d, [2, 4, 6], 1))), '+', U(fr(d, [2, 3, 6], 1))]
        ])(), 'frac', (e) => val(e).q <= 12 && Math.abs(val(e).p) <= 40 && biggest(e) <= 60);
      return calcQ(list, n === 0 ? 'int' : 'frac', { rule: 'mix-brace-' + n, explain: `소괄호 ( ), 중괄호 { }의 차례로 괄호 안을 먼저 계산한다. ${chainOf(list)}이다.` });
    }, { count: 2 }),
    T('mix-brace-pow', '중괄호와 거듭제곱이 있는 혼합 계산', '①87 ②83', (d, n) => {
      const int = (lo, hi) => Q(d.int(lo, hi));
      const list = n === 0 ? pickEx(d, () => d.pick([
        () => [U(int(2, 9)), '+', S(Q(-d.int(2, 4))), '*', G([W(Q(-d.int(2, 4)), 2), '+', S(Q(-d.int(2, 9)))], '{')],
        () => [G([MN(W(Q(-2), 3)), '+', U(int(4, 20))], '{'), '/', S(Q(-d.pick([2, 4, 7])))],
        () => { const c = d.pick([2, 3, 4]); return [U(int(2, 12)), '-', G([W(Q(-c * d.int(1, 2)), 2), '/', S(Q(-c)), '+', U(int(2, 9))], '{')]; }
      ])(), 'int', (e) => intsOnly(e) && Math.abs(val(e).p) <= 99 && val(e).p !== 0)
        : pickEx(d, () => d.pick([
          () => [G([MN(W(Q(-2), 3)), '+', U(int(4, 20))], '{'), '/', S(qneg(fr(d, [3, 5], 3))), '*', U(Q(1, 2))],
          () => [W(Q(-1, d.pick([2, 3])), 2), '/', G([U(Q(1)), '-', G([U(fr(d, [2], 2)), '-', U(fr(d, [3, 4], 1))])], '{'), '+', U(fr(d, [2, 3, 6], 1))],
          () => [U(fr(d, [2, 4], 1)), '-', G([U(int(1, 2)), '+', W(Q(-d.pick([1, 3]), 2), 2), '*', S(Q(-d.pick([2, 4])))], '{')]
        ])(), 'frac', (e) => val(e).q <= 12 && Math.abs(val(e).p) <= 40 && biggest(e) <= 60);
      return calcQ(list, n === 0 ? 'int' : 'frac', { rule: 'mix-brace-pow-' + n, explain: `거듭제곱을 먼저 계산하고, ( ), { }의 차례로 괄호 안을 계산한다. ${chainOf(list)}이다.` });
    }, { count: 2 }),
    T('mix-bracket', '대괄호까지 있는 혼합 계산', '①88 ②84', (d) => {
      const int = (lo, hi) => Q(d.int(lo, hi));
      const list = pickEx(d, () => d.pick([
        () => [U(int(5, 15)), '-', G([U(int(1, 9)), '-', G([U(int(2, 9)), '-', W(Q(-d.int(2, 3)), 2), '*', U(int(2, 3))], '{')], '[')],
        () => { const c = d.pick([2, 4]); return [U(int(2, 9)), '+', G([U(int(2, 9)), '-', G([W(Q(-c), 2), '/', G([U(int(1, 3)), '-', U(int(5, 7))])], '{')], '['), '*', S(Q(-d.int(2, 3)))]; },
        () => [S(Q(-d.int(2, 4))), '*', G([U(int(1, 5)), '-', U(int(2, 3)), '*', G([W(Q(-1), d.int(2, 5)), '+', U(int(2, 4))], '{')], '[')]
      ])(), 'int', (e) => intsOnly(e) && Math.abs(val(e).p) <= 99 && val(e).p !== 0);
      return calcQ(list, 'int', { rule: 'mix-bracket', explain: `거듭제곱을 먼저 계산하고, 소괄호 ( ), 중괄호 { }, 대괄호 [ ]의 차례로 괄호 안을 계산한다. ${chainOf(list)}이다.` });
    }),
    T('mix-order', '혼합 계산의 계산 순서', '①89 ②79', (d, n) => {
      // 괄호가 겹쳐 있어 계산하는 차례가 하나로 정해지는 식. order: 연산 기호(적힌 차례의 번호)를 계산하는 차례대로.
      const u = () => U(Q(d.int(2, 9))), m = () => U(Q(-d.int(2, 9)));
      const forms = [
        () => ({ list: [u(), '-', G([m(), '+', u(), '/', m()], '{'), '*', u()], order: [2, 1, 3, 0] }),
        () => ({ list: [u(), '+', m(), '*', G([u(), '-', u(), '/', m()], '{')], order: [3, 2, 1, 0] }),
        () => ({ list: [G([m(), '+', u(), '*', G([u(), '-', u()])], '{'), '/', m()], order: [2, 1, 0, 3] }),
        () => ({ list: [u(), '/', G([u(), '-', G([m(), '+', u(), '*', m()], '{')], '[')], order: [3, 2, 1, 0] })
      ];
      const { list, order } = d.pick(forms)(), ops = order.length, ids = Array.from({ length: ops }, (_, i) => i), HOW = '( ), { }, [ ]의 차례로 괄호 안을 먼저 계산하고, 곱셈과 나눗셈을 덧셈과 뺄셈보다 먼저 계산한다.';
      if (n === 1) {
        const k = d.pick([1, 2, ops - 1]), word = k === ops - 1 ? '가장 마지막으로' : ['첫', '두', '세', '네'][k] + ' 번째로';
        return C(`다음 식을 계산할 때, ${word} 계산해야 하는 곳은?`, LAB.slice(0, ops), order[k], { figure: marked(list), explain: `${HOW} ${arrow(order)}의 차례로 계산한다.`, facts: { truth: ids.map((i) => i === order[k]), want: true, rule: 'order-where' } });
      }
      // 틀린 보기: 앞에서부터 차례대로, 뒤에서부터 차례대로, 괄호를 살피지 않고 곱셈·나눗셈부터
      const flat = (items) => items.reduce((all, t) => (typeof t === 'string' ? all.concat([t]) : t.k === 'g' ? all.concat(flat(t.list)) : all), []), signs = flat(list);
      const mulFirst = ids.filter((i) => signs[i] === '*' || signs[i] === '/').concat(ids.filter((i) => signs[i] === '+' || signs[i] === '-'));
      const options = d.until(() => d.shuffle([order, ids, ids.slice().reverse(), mulFirst, d.shuffle(ids)]).filter((o, i, all) => all.findIndex((p) => p.join() === o.join()) === i).slice(0, 4), (rows) => rows.length === 4 && rows.some((o) => o.join() === order.join()));
      return C('다음 식을 계산하는 순서를 차례대로 쓴 것은?', options.map(arrow), options.findIndex((o) => o.join() === order.join()), {
        figure: marked(list), explain: `${HOW} ${arrow(order)}의 차례로 계산한다.`,
        facts: { sequence: { ranks: ids.map((i) => order.indexOf(i)), options }, rule: 'order-seq' }
      });
    }, { count: 2 }),
    T('mix-steps', '혼합 계산 과정의 빈칸', '②80', (d) => {
      const [b, c] = d.pick([[4, 8], [4, 2], [6, 9], [6, 4], [6, 12], [3, 9], [2, 4], [4, 16], [6, 18], [6, 3]]), a = d.int(2, 9), sq = b * b, quo = sq / -c, v = -a - quo;
      return M('다음은 식을 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [sq, quo, v].map((x, i) => ({ label: LAB[i], answer: x, signed: true })), {
        figure: proc([{ h: html([U(Q(-a)), '-', W(Q(-b), 2), '/', U(Q(-c))]) }, { h: `−${a} <i>−</i> ${box(LAB[0])} <i>÷</i> (−${c})` }, { h: `−${a} <i>−</i> (${box(LAB[1])})` }, { h: box(LAB[2]) }]),
        explain: `거듭제곱 (−${b})${sup(2)} = ${sq}${tail(sq, '을/를')} 먼저 계산하고, 나눗셈 ${sq} ÷ (−${c}) = ${tx(Q(quo))}${tail(Math.abs(quo), '을/를')} 계산한 다음 뺄셈을 한다. −${a} − (${tx(Q(quo))}) = ${tx(Q(v))}이다.`,
        facts: { calc: [[`(-${b})**2`, 0], [`(-${b})**2/(-${c})`, 1], [`(-${a})-(-${b})**2/(-${c})`, 2]] }
      });
    }),
    T('mix-machine', '정해진 차례대로 이어서 계산하기', '①91 ②86', (d) => {
      const [x, a, b, c, sub] = d.until(() => [nz(d, -9, 9), -d.int(2, 5), d.int(2, 9), -d.int(2, 6), d.bool()], (r) => { const mid = r[0] * r[1] + (r[4] ? -r[2] : r[2]); return mid % r[3] === 0 && mid !== 0 && Math.abs(mid / r[3]) > 1; });
      const m1 = x * a, m2 = sub ? m1 - b : m1 + b, v = m2 / c;
      return N('다음과 같이 왼쪽의 수부터 차례대로 계산할 때, ㉠에 알맞은 수는?', v, {
        signed: true, figure: flow([tx(Q(x)), { step: `× (−${-a})` }, box(''), { step: `${sub ? MINUS : '+'} ${b}` }, box(''), { step: `÷ (−${-c})` }, box(LAB[0])]),
        explain: `${px(Q(x))} × (−${-a}) = ${tx(Q(m1))}, ${px(Q(m1))} ${sub ? MINUS : '+'} ${b} = ${tx(Q(m2))}, ${px(Q(m2))} ÷ (−${-c}) = ${tx(Q(v))}이다.`,
        facts: { value: `(${js(Q(x))}*(${a})${sub ? '-' : '+'}${b})/(${c})` }
      });
    }),
    T('mix-letter-sign', '부호가 정해진 두 문자로 된 식의 부호 판단', '①92', (d) => {
      // a 는 양수, b 는 음수(이름은 바꿔 낸다). [식, 부호, 까닭]
      const swap = d.bool(), a = V(swap ? 'b' : 'a'), b = V(swap ? 'a' : 'b');
      const POS = [[`${a} − ${b}`, '음수를 빼는 것은 양수를 더하는 것과 같으므로'], [`(−${a}) × ${b}`, '음수와 음수의 곱이므로'], [`${b} × ${b}`, '음수와 음수의 곱이므로'], [`${a} ÷ (−${b})`, '양수를 양수로 나눈 것이므로']];
      const NEG = [[`${b} − ${a}`, '음수에서 양수를 빼는 것은 음수에 음수를 더하는 것과 같으므로'], [`${a} × ${b}`, '양수와 음수의 곱이므로'], [`${a} ÷ ${b}`, '양수를 음수로 나눈 것이므로'], [`(−${a}) × (−${b})`, '음수와 양수의 곱이므로'], [`−${a}`, '양수의 부호를 바꾼 수이므로']];
      const wantPos = d.bool(), right = d.pick(wantPos ? POS : NEG), rows = d.shuffle([right].concat(d.shuffle(wantPos ? NEG : POS).slice(0, 3)));
      return C(`${swap ? `${nb(`${b} ${LT} 0`)}, ${nb(`${a} ${GT} 0`)}` : `${nb(`${a} ${GT} 0`)}, ${nb(`${b} ${LT} 0`)}`}일 때, 다음 중 항상 ${wantPos ? '양수' : '음수'}인 것은?`, rows.map((r) => r[0]), rows.indexOf(right), {
        explain: `${a}는 양수, ${b}는 음수이므로 −${a}는 음수, −${b}는 양수이다. ${right[1]} ${right[0]}의 값은 항상 ${wantPos ? '양수' : '음수'}이다.`,
        facts: { truth: rows.map((r) => r === right), want: true }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
