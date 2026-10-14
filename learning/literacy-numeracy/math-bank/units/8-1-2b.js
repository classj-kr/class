// 중학교 2학년 1학기 2단원 식의 계산 — 뒤쪽 묶음(다항식의 덧셈과 뺄셈, 단항식과 다항식의 곱셈, 다항식과 단항식의 나눗셈·섞인 계산, 식의 값과 식의 대입).
// 단원 틀과 도구(식 글), 싣는 기준, 뺀 것과 까닭은 8-1-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 계산 문항은 식의 구조가 다른 것만 따로 싣고(차례마다 facts.rule 의 이름이 다르다), 답은 그림 자리에 적은 식 글을 코드가 셈한 것이다.
// 답이 다항식(정수 계수)이면 항마다 「[±][ ]문자」 칸으로 받고(한 유형 안에서는 항의 구성이 같다), 계수가 분수이면 고르기로 바꾸었다.
// 「이차식」은 자료가 쓰는 자리(이차식의 덧셈과 뺄셈, 이차식 고르기)에서만, 「전개」는 (단항식) × (다항식)에서만 쓴다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, NAMES, box, frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, fit, tag, proc, nz, pm, co, fr, okKind, ansV, claimQ, asQ } = B.kit.mid;
  const K = B.kit.m812;
  const { STD1, STD2, STD3, UNIT, T, X, keyOf, mk, pAdd, pNeg, pMul, pDiv, same, valX, coefS, letters, degOf, ordered, fpart, termH, ph, pt, htmlX, xh, xe, xex, eqx, xtagged, xv, xsame, magS, vs, ms, pa, pn, kp, srcOf, told, CALC, CALC_PICK, UNSEEN, monoOK, polyOK, monoQ, polyQ, pickQ, eqQ, slots, eqLabel, coefs, pair, one, sjs, ej, xj, pj, xlines, eqh, plugH, given, BOX_EXPR, flip, named } = K;

  // ── 식 글을 짓는 도구 ──
  const RULE_ADD = '괄호를 풀고 동류항끼리 모아서 계산한다.', RULE_SUB = '빼는 식은 각 항의 부호를 바꾸어 더한다.', RULE_DIST = '분배법칙을 이용하여 단항식을 다항식의 각 항에 곱한다.', RULE_PDIV = '다항식의 각 항을 단항식으로 나눈다.';
  const lin = (ts, a, b) => pn([[ts[0], a], [ts[1], b]]);                              // c1 a + c2 b
  const lin3 = (ts, a, b) => pn([[ts[0], a], [ts[1], b], [ts[2], '']]);                // c1 a + c2 b + c3
  const quad = (ts, v) => pn([[ts[0], v + '^2'], [ts[1], v], [ts[2], '']]);            // c1 v² + c2 v + c3
  // 앞에 식이 있을 때 덧붙이는 항: sg(-3, 'x') → -3x, sg(1, 'x') → +x
  const sg = (c, v) => (c < 0 ? '-' : '+') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + v;
  const P2 = (a, b, ca, cb) => pAdd(mk(ca, { [a]: 1 }), mk(cb, { [b]: 1 }));
  const many = (d, n, lo, hi) => coefs(d, n, lo, hi);
  // 다항식의 차수(문자의 지수가 음수인 항이 있으면 다항식이 아니다 → null)
  const degP = (P) => (P.some((t) => Object.values(t.e).some((e) => e < 0)) ? null : P.reduce((m, t) => Math.max(m, degOf(t)), 0));

  // ── 다항식의 덧셈과 뺄셈 ──
  B.addGroup(UNIT, {
    id: 'addsub', title: '다항식의 덧셈과 뺄셈', standard: STD2,
    types: [
      T('add-linear', '문자가 2개인 일차식의 덧셈과 뺄셈', '①54 ②49', (d, n) => {
        const [a, b] = pair(d), parts = [a, b];
        if (n === 0) {
          const src = d.until(() => `(${lin(many(d, 2, -9, 9), a, b)})+(${lin(many(d, 2, -9, 9), a, b)})`, (s) => polyOK(s, parts));
          return polyQ(CALC, src, parts, { rule: 'add-linear-plus', explain: `${RULE_ADD} ${told(src)}이다.` });
        }
        if (n === 1) {
          const [src] = d.until(() => { const q = many(d, 2, -9, 9); return [`(${lin(many(d, 2, -9, 9), a, b)})-(${lin(q, a, b)})`, q]; }, ([s, q]) => polyOK(s, parts) && (q[0] < 0 || q[1] < 0));
          return polyQ(CALC, src, parts, { rule: 'add-linear-minus', explain: `${RULE_SUB} ${told(src)}이다.` });
        }
        // 괄호가 둘인 뺄셈: c1 a − (c2 b − c3 a) − (c4 a + c5 b)
        const src = d.until(() => { const [c1, c2, c3, c4, c5] = [d.int(4, 9), d.int(1, 6), d.int(1, 5), d.int(1, 5), d.int(1, 6)]; return `${pn([[c1, a]])}-(${pn([[c2, b], [-c3, a]])})-(${pn([[c4, a], [c5, b]])})`; }, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { rule: 'add-linear-two-minus', explain: `${RULE_SUB} ${told(src)}이다.` });
      }, { count: 3 }),
      T('add-linear-const', '상수항이 있는 일차식의 덧셈과 뺄셈', '①54 ②49·50', (d, n) => {
        const [a, b] = pair(d), parts = [a, b, ''];
        if (n === 0) {
          const minus = d.bool(), src = d.until(() => `(${lin3(many(d, 3, -8, 8), a, b)})${minus ? '-' : '+'}(${lin3(many(d, 3, -8, 8), a, b)})`, (s) => polyOK(s, parts));
          return polyQ(CALC, src, parts, { rule: 'add-const', explain: `${minus ? RULE_SUB : RULE_ADD} ${told(src)}이다.` });
        }
        const src = d.until(() => `${kp(d.int(2, 4), lin3(many(d, 3, -5, 5), a, b))}-(${lin3(many(d, 3, -8, 8), a, b)})`, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { rule: 'add-const-scaled', explain: `수를 괄호 안의 모든 항에 곱한다. ${RULE_SUB} ${told(src)}이다.` });
      }, { count: 2 }),
      T('add-scaled', '수를 곱한 일차식의 덧셈과 뺄셈', '①54 ②50', (d, n) => {
        const [a, b] = pair(d), parts = [a, b];
        if (n === 0) {
          const src = d.until(() => `(${lin(many(d, 2, -7, 7), a, b)})+${kp(d.int(2, 4), lin(many(d, 2, -6, 6), a, b))}`, (s) => polyOK(s, parts));
          return polyQ(CALC, src, parts, { rule: 'add-scaled-one', explain: `수를 괄호 안의 모든 항에 곱한 다음 동류항끼리 모은다. ${told(src)}이다.` });
        }
        const src = d.until(() => { const [k1, k2] = [d.int(2, 5), d.int(2, 5)]; return k1 === k2 ? '' : `${kp(k1, lin(many(d, 2, -7, 7), a, b))}-${kp(k2, lin(many(d, 2, -7, 7), a, b))}`; }, (s) => s && polyOK(s, parts));
        return polyQ(CALC, src, parts, { rule: 'add-scaled-two', explain: `수를 괄호 안의 모든 항에 곱한다. 빼는 식에서는 부호가 바뀐다. ${told(src)}이다.` });
      }, { count: 2 }),
      T('add-form-abc', '계산한 식을 주어진 꼴과 견주어 수 구하기', '①55 심43', (d) => {
        // k1(…) − k2(…) = Ax − By + C: y 의 항 앞에 −가 적혀 있으므로 B 는 y 의 계수의 부호를 바꾼 수이다.
        const [k1, k2] = [d.int(2, 3), d.int(2, 4)], [p, q] = d.until(() => [many(d, 3, -5, 5), many(d, 3, -5, 5)], ([x, y]) => x.every((c, i) => k1 * c - k2 * y[i] !== 0) && Math.abs(k1 * x[1] - k2 * y[1]) > 1);
        const src = `${kp(k1, lin3(p, 'x', 'y'))}-${kp(k2, lin3(q, 'x', 'y'))}`, [A, Bc, Cc] = p.map((c, i) => k1 * c - k2 * q[i]), ex1 = (i) => `${k1}*${sjs(p[i])}-${k2}*${sjs(q[i])}`;
        return slots(`다음 식을 만족시키는 수 ${V('A')}, ${V('B')}, ${V('C')}의 값은?`, [[eqLabel('A'), A, ex1(0), true], [eqLabel('B'), -Bc, `-(${ex1(1)})`, true], [eqLabel('C'), Cc, ex1(2), true]], {
          figure: eqx(src, 'Ax-By+C'), unseen: [1],
          explain: `좌변을 계산하면 ${told(src)}이다. ${V('y')}의 계수가 ${tx(Q(Bc))}이므로 ${nb(`−${V('B')} = ${tx(Q(Bc))}`)}에서 ${V('B')} = ${tx(Q(-Bc))}이다. ${V('A')} = ${tx(Q(A))}, ${V('C')} = ${tx(Q(Cc))}이다.`
        });
      }),
      T('add-find-ab', '덧셈·뺄셈의 등식에서 계수 구하기', '①56 심48', (d, n) => {
        if (n === 0) {
          // (c1 x + c2 y) − (a x + c4 y) = R x + b y
          const [c1, c2, c4, a] = d.until(() => many(d, 4, -7, 7), ([p, q, r, s]) => p !== s && Math.abs(r) > 1 && q !== r), R = c1 - a, b = c2 - c4;
          return slots(`다음 식을 만족시키는 수 ${V('a')}, ${V('b')}의 값은?`, [[eqLabel('a'), a, `${sjs(c1)}-${sjs(R)}`, true], [eqLabel('b'), b, `${sjs(c2)}-${sjs(c4)}`, true]], {
            figure: eqx(`(${lin([c1, c2], 'x', 'y')})-(ax${sg(c4, 'y')})`, `${pn([[R, 'x']])}+by`), rule: 'add-find-linear', unseen: [1],
            explain: `좌변을 정리하면 ${nb(`(${tx(Q(c1))} − ${V('a')})${V('x')} ${b < 0 ? MINUS : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${V('y')}`)}이다. ${V('x')}의 계수에서 ${tx(Q(c1))} − ${V('a')} = ${tx(Q(R))}이므로 ${V('a')} = ${tx(Q(a))}이고, ${V('y')}의 계수에서 ${V('b')} = ${tx(Q(b))}이다.`
          });
        }
        // a x² + c1 x + c2 − (c3 x² + b x + c4) = R2 x² + R1 x + c
        const [c1, c2, c3, c4, a, b] = d.until(() => many(d, 6, -7, 7), ([p, q, r, s, t, u]) => t !== r && p !== u && q !== s && Math.abs(r) > 1), R2 = a - c3, R1 = c1 - b, c = c2 - c4;
        return slots(`다음 식을 만족시키는 수 ${V('a')}, ${V('b')}, ${V('c')}의 값은?`, [[eqLabel('a'), a, `${sjs(R2)}+${sjs(c3)}`, true], [eqLabel('b'), b, `${sjs(c1)}-${sjs(R1)}`, true], [eqLabel('c'), c, `${sjs(c2)}-${sjs(c4)}`, true]], {
          figure: eqx(`ax^2${sg(c1, 'x')}${sg(c2, '')}-(${pn([[c3, 'x^2']])}+bx${sg(c4, '')})`, `${pn([[R2, 'x^2'], [R1, 'x']])}+c`), rule: 'add-find-quad', unseen: [1],
          explain: `좌변을 정리하면 ${nb(`(${V('a')} − ${c3 < 0 ? '(' + tx(Q(c3)) + ')' : c3})${V('x')}${sup(2)} + (${tx(Q(c1))} − ${V('b')})${V('x')} + ${c2 - c4 < 0 ? '(' + tx(Q(c)) + ')' : c}`)}이다. 계수를 견주면 ${V('a')} = ${tx(Q(a))}, ${V('b')} = ${tx(Q(b))}, ${V('c')} = ${tx(Q(c))}이다.`
        });
      }, { count: 2 }),
      T('add-frac-coef', '계수가 분수인 일차식의 덧셈과 뺄셈', '①57 심44', (d) => {
        // (q1 a + q2 b) − (q3 a + q4 b). 틀린 보기: 빼는 식의 둘째 항의 부호를 바꾸지 않음 / 두 식을 더함 / 둘째 항의 계산 결과의 부호를 뒤집음 / 첫째 항만 더함
        const [a, b] = pair(d), f = () => { const x = fr(d, [2, 3, 4, 6], 1); return pm(d) < 0 ? qneg(x) : x; };
        const [q1, q2, q3, q4] = d.until(() => [f(), f(), f(), f()], (qs) => [qsub(qs[0], qs[2]), qsub(qs[1], qs[3]), qadd(qs[1], qs[3]), qadd(qs[0], qs[2])].every((v) => v.p !== 0 && v.q <= 12) && qs[0].q !== qs[2].q && qs[1].q !== qs[3].q);
        const src = `(${lin([q1, q2], a, b)})-(${lin([q3, q4], a, b)})`, R = xv(src);
        return pickQ(d, CALC_PICK, R, [P2(a, b, qsub(q1, q3), qadd(q2, q4)), P2(a, b, qadd(q1, q3), qadd(q2, q4)), P2(a, b, qsub(q1, q3), qneg(qsub(q2, q4))), P2(a, b, qadd(q1, q3), qsub(q2, q4))], {
          figure: xex(src), explain: `${RULE_SUB} 계수끼리는 통분하여 계산한다. ${told(src)}이다.`
        });
      }),
      T('add-fracform', '분수 꼴 다항식의 덧셈과 뺄셈', '①58·62 심44', (d, n) => {
        // (P1)/m − (P2)/k: 통분하여 분자끼리 계산한다. 틀린 보기: 분수 앞의 −를 분자의 첫 항에만 / 분자에 수를 곱하지 않고 통분 / 더함 / 분모를 없앰
        const [m, k] = d.until(() => [d.pick([2, 3, 4, 5, 6]), d.pick([2, 3, 4, 5, 6])], ([x, y]) => x !== y && lcm(x, y) <= 12), L = lcm(m, k), [a, b] = pair(d);
        const make = n === 0 ? () => [lin(many(d, 2, -6, 6), a, b), lin(many(d, 2, -6, 6), a, b)] : () => [quad(many(d, 3, -5, 5), 'x'), quad(many(d, 3, -5, 5), 'x')];
        const [p1, p2] = d.until(make, ([x, y]) => { const R = xv(`[${x}|${m}]-[${y}|${k}]`); return R.length === (n === 0 ? 2 : 3) && R.some((t) => t.q.q > 1); });
        const src = `[${p1}|${m}]-[${p2}|${k}]`, R = xv(src), T2 = ordered(xv(p2)), firstOnly = pAdd(xv(`[${p1}|${m}]`), pDiv(pAdd(pNeg([T2[0]]), T2.slice(1)), xv(String(k))));
        const numer = srcOf(xv(`${kp(L / m, p1)}-${kp(L / k, p2)}`));
        return pickQ(d, CALC_PICK, R, [firstOnly, xv(`[(${p1})-(${p2})|${L}]`), xv(`[${p1}|${m}]+[${p2}|${k}]`), xv(`${kp(L / m, p1)}-${kp(L / k, p2)}`)], {
          figure: xex(src), rule: n === 0 ? 'add-fracform-linear' : 'add-fracform-quad',
          explain: `분모의 최소공배수 ${L}${tail(L, '으로/로')} 통분한다. 빼는 분수는 분자 전체에 −가 걸린다. ${xh(src)} = ${xh(`[${kp(L / m, p1)}-${kp(L / k, p2)}|${L}]`)} = ${xh(`[${numer}|${L}]`)} = ${pt(R)}이다.`
        });
      }, { count: 2 }),
      T('add-claims', '다항식의 덧셈과 뺄셈이 옳은 것과 옳지 않은 것', '①59 ②57', (d) => {
        const [a, b] = pair(d), [p, q, r] = [d.int(4, 7), d.int(2, 5), d.int(2, 4)], [s, t] = d.until(() => [d.int(2, 3), d.int(2, 5)], ([x, y]) => x !== y);
        return eqQ(d, '다음 중 옳지 않은 것은?', [
          [`(${p}${a}+4${b}-2)-(2${a}-${q}${b}+1)`, pAdd(P2(a, b, p - 2, 4 - q), mk(-3, {})), `빼는 식의 각 항의 부호를 바꾸므로 ${V(b)}의 계수는 4 + ${q} = ${4 + q}이다.`],
          [`(6${a}+${r}${b}-2)-(2${a}-${b}+1)`, pAdd(P2(a, b, 4, r - 1), mk(-1, {})), `빼는 식의 각 항의 부호를 바꾸므로 상수항은 −2 − 1 = −3, ${V(b)}의 계수는 ${r} + 1 = ${r + 1}이다.`],
          [`${s}(${t}${a}-${b})+(${a}+5${b})`, P2(a, b, s * t + 1, 4), `${s}${tail(s, '을/를')} 괄호 안의 모든 항에 곱하므로 ${V(b)}의 계수는 −${s} + 5 = ${5 - s}이다.`],
          [`(${p}${a}^2-3${a})-(2${a}^2+3${a})`, mk(p - 2, { [a]: 2 }), `${V(a)}의 계수는 −3 − 3 = −6이다.`],
          [`(${a}^2-2${a}+3)+(${q}${a}^2+${a}-5)`, pAdd(pAdd(mk(q + 1, { [a]: 4 }), mk(-1, { [a]: 1 })), mk(-2, {})), '동류항끼리 더할 때 문자와 지수는 그대로 둔다.'],
          [`3(${a}-${t}${b})-2(${a}-${b})`, P2(a, b, 1, -3 * t - 2), `−2를 괄호 안의 모든 항에 곱하므로 ${V(b)}의 계수는 −${3 * t} + 2 = ${tx(Q(2 - 3 * t))}이다.`]
        ], false, { rule: 'add-claims' });
      }),
      T('add-quad-pick', '이차식 고르기', '①60', (d) => {
        // 차수가 2인 다항식 하나와 그렇지 않은 식 셋(일차식, 문자가 2개인 일차식, 삼차식, 분모에 문자가 있는 식)
        const v = d.pick(['x', 'a', 'y']), w = v === 'y' ? 'x' : 'y', [c1, c2, c3] = many(d, 3, -7, 7), k = d.int(2, 6);
        const good = d.pick([pn([[c2, v], [c1, v + '^2'], [c3, '']]), pn([[c1, v + '^2'], [c3, '']]), pn([[c3, ''], [c2, v], [c1, v + '^2']])]);
        const others = d.shuffle([pn([[c3, ''], [c2, v]]), lin3([c1, c2, c3], v, w), pn([[c1, v + '^3'], [c2, v], [c3, '']]), `[${k}|${v}^2]${sg(c3, '')}`, pn([[c1, v + '^2' + w], [c3, '']])]).slice(0, 3), rows = d.shuffle([good].concat(others));
        return C('다음 중 이차식인 것은?', rows.map(xh), rows.indexOf(good), {
          explain: `차수가 가장 큰 항의 차수가 2인 다항식이 이차식이다. ${xh(good)}에서 차수가 가장 큰 항은 ${pt(ordered(xv(good)).slice(0, 1))}이다.`,
          facts: { truth: rows.map((s) => degP(xv(s)) === 2), want: true }
        });
      }),
      T('add-quad', '이차식의 덧셈과 뺄셈', '①61 ②51', (d, n) => {
        const v = d.pick(['x', 'a']), parts = [v + '^2', v, ''];
        if (n === 0) {
          const src = d.until(() => `(${quad(many(d, 3, -7, 7), v)})+(${quad(many(d, 3, -7, 7), v)})`, (s) => polyOK(s, parts));
          return polyQ(CALC, src, parts, { rule: 'add-quad-plus', explain: `${RULE_ADD} ${told(src)}이다.` });
        }
        // 빼는 식에 일차항이 없다.
        const src = d.until(() => { const [c4, c6] = many(d, 2, -6, 6); return `(${quad(many(d, 3, -7, 7), v)})-(${pn([[c4, v + '^2'], [c6, '']])})`; }, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { rule: 'add-quad-minus', explain: `${RULE_SUB} ${told(src)}이다.` });
      }, { count: 2 }),
      T('add-quad-scaled', '수를 곱한 이차식의 덧셈과 뺄셈', '①61 ②52', (d) => {
        const v = d.pick(['x', 'a']), parts = [v + '^2', v, ''];
        const src = d.until(() => { const [k1, k2] = [d.int(2, 4), d.int(2, 5)], [c1, c2] = many(d, 2, -5, 5); return `${kp(k1, pn([[c1, v + '^2'], [c2, v]]))}-${kp(k2, quad(many(d, 3, -5, 5), v))}`; }, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { explain: `수를 괄호 안의 모든 항에 곱한다. 빼는 식에서는 부호가 바뀐다. ${told(src)}이다.` });
      }),
      T('add-nested', '괄호가 여러 겹인 일차식의 계산', '①63 ②54 심45', (d, n) => {
        const [a, b] = pair(d), parts = [a, b];
        if (n === 0) {
          // c1 a − {c2 b + (c3 a − c4 b)}
          const src = d.until(() => { const [c1, c2, c3, c4] = [d.int(2, 9), d.int(1, 6), d.int(1, 7), d.int(1, 8)], inner = d.bool(); return `${pn([[c1, a]])}-{${pn([[c2, b]])}${inner ? '+' : '-'}(${lin([c3, -c4], a, b)})}`; }, (s) => polyOK(s, parts));
          return polyQ(CALC, src, parts, { rule: 'add-nested-two', explain: `안쪽 괄호부터 차례로 푼다. ${told(src)}이다.` });
        }
        // c1 x − [c2 x − y − {c3 x − c4 y − k(x − y)}]
        const src = d.until(() => { const [c1, c2, c3, c4, k] = [d.int(3, 9), d.int(2, 6), d.int(2, 8), d.int(1, 6), d.int(2, 4)]; return `${pn([[c1, a]])}-<${lin([c2, -1], a, b)}-{${lin([c3, -c4], a, b)}-${k}(${a}-${b})}>`; }, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { rule: 'add-nested-three', explain: `소괄호, 중괄호, 대괄호의 차례로 안쪽부터 푼다. ${told(src)}이다.` });
      }, { count: 2 }),
      T('add-nested-quad', '괄호가 여러 겹인 이차식의 계산', '①64 ②55', (d) => {
        const v = d.pick(['x', 'a']), parts = [v + '^2', v, ''];
        const src = d.until(() => {
          if (d.bool()) { const [c1, c2, c3, c4, c5] = [d.int(1, 5), d.int(2, 6), d.int(1, 6), d.int(2, 8), d.int(1, 7)]; return `${pn([[c1, v + '^2']])}-{${pn([[c2, v + '^2'], [c3, v]])}-(${pn([[c4, v], [c5, '']])})}`; }
          const [c1, k, c2, c3, m, c4, c5] = [d.int(2, 6), d.int(2, 3), d.int(1, 5), d.int(1, 4), d.int(2, 4), d.int(1, 4), d.int(1, 4)];
          return `${pn([[c1, v + '^2']])}-${k}{${c2}+${pn([[c3, v + '^2']])}-${m}(${c4}-${pn([[c5, v]])})}`;
        }, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { explain: `안쪽 괄호부터 차례로 푼다. ${told(src)}이다.` });
      }),
      T('add-result-claims', '계산한 식에 대한 설명의 옳고 그름', '②56', (d) => {
        // P − k(Q)를 계산한 식 A x² + B x + C 에 대한 설명. 틀린 설명은 부호를 놓치거나 k를 한 항에만 곱한 값이다.
        const [c1, c2, c3, c4, c5, c6, k] = d.until(() => many(d, 6, -6, 6).concat([d.int(2, 4)]), (t) => { const [A, Bc, Cc] = [t[0] - t[6] * t[3], t[1] - t[6] * t[4], t[2] - t[6] * t[5]]; return A !== 0 && Bc !== 0 && Cc !== 0 && Math.abs(A) !== 1 && t[1] + t[6] * t[4] !== Bc && t[2] - t[5] !== Cc && Math.abs(A) !== Math.abs(Bc); });
        const src = `${quad([c1, c2, c3], 'x')}-${kp(k, quad([c4, c5, c6], 'x'))}`, [A, Bc, Cc] = [c1 - k * c4, c2 - k * c5, c3 - k * c6], X2 = nb(V('x') + sup(2));
        const yes = ['이차식이다.', `${X2}의 계수는 ${tx(Q(A))}이다.`, `${V('x')}의 계수는 ${tx(Q(Bc))}이다.`, `상수항은 ${tx(Q(Cc))}이다.`, '항은 모두 3개이다.'];
        const no = [
          [`${X2}의 계수는 ${tx(Q(-A))}이다.`, `${X2}의 계수는 ${tx(Q(c1))} − ${k} × ${c4 < 0 ? '(' + tx(Q(c4)) + ')' : c4} = ${tx(Q(A))}이다.`, yes[1]],
          [`${V('x')}의 계수는 ${tx(Q(c2 + k * c5))}이다.`, `빼는 식의 부호가 바뀌므로 ${V('x')}의 계수는 ${tx(Q(c2))} − ${k} × ${c5 < 0 ? '(' + tx(Q(c5)) + ')' : c5} = ${tx(Q(Bc))}이다.`, yes[2]],
          [`상수항은 ${tx(Q(c3 - c6))}이다.`, `${k}${tail(k, '을/를')} 괄호 안의 모든 항에 곱하므로 상수항은 ${tx(Q(c3))} − ${k} × ${c6 < 0 ? '(' + tx(Q(c6)) + ')' : c6} = ${tx(Q(Cc))}이다.`, yes[3]],
          ['일차식이다.', `${X2}의 계수가 ${tx(Q(A))}이므로 이차식이다.`, yes[0]]
        ];
        const item = claimQ(d, `${xj(src, '을/를')} 계산한 식에 대한 설명으로 옳지 않은 것은?`, yes, no, false);
        return Object.assign(item, { explain: `계산하면 ${pt(xv(src))}이다. ${item.explain}` });
      }),
      T('add-box', '덧셈·뺄셈의 등식에서 알맞은 다항식 구하기', '①65·67 ②60 심47', (d, n) => {
        const v = d.pick(['x', 'a']), parts = [v + '^2', v, ''];
        const [p, xs] = d.until(() => [many(d, 3, -7, 7), many(d, 3, -7, 7)], ([q, r]) => q.every((c, i) => c + r[i] !== 0 && c - r[i] !== 0)), P = quad(p, v);
        if (n === 0) {
          // P + □ = R
          const R = quad(p.map((c, i) => c + xs[i]), v), src = `(${R})-(${P})`;
          return polyQ(BOX_EXPR, src, parts, { figure: eqx(`(${P})+?`, R), rule: 'add-box-plus', explain: `□ = ${told(src)}이다.` });
        }
        // P 에서 어떤 식을 뺐더니 R → 어떤 식 = P − R
        const R = quad(p.map((c, i) => c - xs[i]), v), src = `(${P})-(${R})`;
        return polyQ(`${xh(P)}에서 어떤 식을 뺐더니 ${xj(R, '이/가')} 되었다. 어떤 식을 구하시오.`, src, parts, { figure: null, rule: 'add-box-minus', explain: `${xh(P)} − (어떤 식) = ${xh(R)}이므로 어떤 식은 ${told(src)}이다.` });
      }, { count: 2 }),
      T('add-box-scaled', '수가 곱해진 □ 안의 다항식 구하기', '①66·67 ②60 심47', (d) => {
        // P − k(□) = R → k(□) = P − R
        const [a, b] = pair(d), parts = [a, b, ''], k = d.int(2, 4), [p, xs] = d.until(() => [many(d, 3, -8, 8), many(d, 3, -5, 5)], ([q, r]) => q.every((c, i) => c - k * r[i] !== 0));
        const P = lin3(p, a, b), R = lin3(p.map((c, i) => c - k * xs[i]), a, b), src = `[(${P})-(${R})|${k}]`, diff = srcOf(xv(`(${P})-(${R})`));
        return polyQ(BOX_EXPR, src, parts, { figure: eqx(`${P}-${k}(?)`, R), explain: `${k}(□) = ${xh(`(${P})-(${R})`)} = ${xh(diff)}이므로 □ = ${pt(xv(src))}이다.` });
      }),
      T('add-perimeter', '변의 길이가 다항식인 도형의 둘레의 길이', '①70 ②64', (d, n) => {
        const [a, b] = pair(d), parts = [a, b];
        if (n === 0) {
          const [W, L] = d.until(() => [lin([d.int(2, 6), d.int(1, 5)], a, b), lin([d.int(1, 5), pm(d) * d.int(1, 4)], a, b)], ([x, y]) => polyOK(`2{(${x})+(${y})}`, parts)), src = `2{(${W})+(${L})}`;
          return polyQ(`가로의 길이가 ${xh(W)}, 세로의 길이가 ${xh(L)}인 직사각형의 둘레의 길이를 구하시오.`, src, parts, { figure: K.rectFig(W, L), rule: 'add-perimeter-rect', unseen: [2], explain: `(직사각형의 둘레의 길이) = 2 × {(가로의 길이) + (세로의 길이)}이므로 ${told(src)}이다.` });
        }
        const [Bs, S] = d.until(() => [lin([d.int(2, 6), pm(d) * d.int(1, 5)], a, b), lin([d.int(2, 5), pm(d) * d.int(1, 4)], a, b)], ([x, y]) => polyOK(`(${x})+2(${y})`, parts)), src = `(${Bs})+2(${S})`;
        return polyQ(`밑변의 길이가 ${xh(Bs)}이고 나머지 두 변의 길이가 모두 ${xh(S)}인 이등변삼각형의 둘레의 길이를 구하시오.`, src, parts, { figure: K.isoFig(Bs, S), rule: 'add-perimeter-tri', unseen: [2], explain: `길이가 같은 두 변이 있으므로 둘레의 길이는 ${told(src)}이다.` });
      }, { count: 2 }),
      T('add-swap-cost', '개수를 바꾸어 샀을 때 더 낸 돈을 식으로 나타내기', '심52', (d) => {
        const p1 = 100 * d.int(5, 15), p2 = p1 + 100 * d.int(2, 8), [f1, f2] = d.pick([['사과', '배'], ['자두', '복숭아'], ['귤', '감']]);
        const src = `(${p1}y+${p2}x)-(${p1}x+${p2}y)`;
        return polyQ(`한 개에 ${p1}원인 ${f1} ${V('x')}개와 한 개에 ${p2}원인 ${f2} ${V('y')}개를 사려다가 잘못하여 ${josa(f1, '을/를')} ${V('y')}개, ${josa(f2, '을/를')} ${V('x')}개 샀더니 돈을 더 많이 냈다. 더 낸 돈을 ${V('x')}, ${V('y')}를 사용한 식으로 나타내시오.`, src, ['x', 'y'], {
          figure: null, unit: '원',
          explain: `사려던 값은 ${nb(`(${htmlX(`${p1}x+${p2}y`)})원`)}, 실제로 낸 값은 ${nb(`(${htmlX(`${p1}y+${p2}x`)})원`)}이다. 더 낸 돈은 ${told(src)}(원)이다.`
        });
      }),
      T('add-two-boxes', '두 직육면체의 겉넓이의 합을 식으로 나타내기', '심54', (d) => {
        const [h1, h2] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y), src = `(2a^2+4*${h1}a)+(2a^2+4*${h2}a)`;
        return polyQ(`밑면이 한 변의 길이가 ${V('a')} cm인 정사각형이고 높이가 각각 ${h1} cm, ${h2} cm인 직육면체 모양의 상자가 2개 있다. 두 상자의 겉넓이의 합을 ${V('a')}를 사용한 식으로 나타내시오.`, src, ['a^2', 'a'], {
          figure: null, unit: 'cm²', unseen: [2, 4],
          explain: `밑면의 넓이는 ${nb(V('a') + sup(2))} cm²이고 옆면 하나의 넓이는 (높이) × ${V('a')}이다. 높이가 ${h1} cm인 상자의 겉넓이는 ${nb(`(${htmlX(`2a^2+${4 * h1}a`)}) cm²`)}, 높이가 ${h2} cm인 상자의 겉넓이는 ${nb(`(${htmlX(`2a^2+${4 * h2}a`)}) cm²`)}이므로 합은 ${nb(`(${ph(xv(src))}) cm²`)}이다.`
        });
      }),
      T('add-two-conds', '조건 둘로 두 다항식을 구하여 더하기', '②60 심49', (d) => {
        const v = d.pick(['x', 'a']), parts = [v + '^2', v, ''];
        const [p1, as, p2, bs] = d.until(() => [many(d, 3, -6, 6), many(d, 3, -6, 6), many(d, 3, -6, 6), many(d, 3, -6, 6)], ([q1, x, q2, y]) => x.every((c, i) => c + y[i] !== 0 && q1[i] + c !== 0 && q2[i] - y[i] !== 0));
        const P1 = quad(p1, v), R1 = quad(p1.map((c, i) => c + as[i]), v), Pb = quad(p2, v), R2 = quad(p2.map((c, i) => c - bs[i]), v), A = quad(as, v), Bq = quad(bs, v), src = `(${R1})-(${P1})+(${Pb})-(${R2})`;
        return polyQ(`${xh(P1)}에 다항식 ${V('A')}를 더하면 ${xj(R1, '이/가')} 되고, ${xh(Pb)}에서 다항식 ${V('B')}를 빼면 ${xj(R2, '이/가')} 된다. ${nb(`${V('A')} + ${V('B')}`)}를 계산하시오.`, src, parts, {
          figure: null, explain: `${V('A')} = ${xh(`(${R1})-(${P1})`)} = ${xh(A)}, ${V('B')} = ${xh(`(${Pb})-(${R2})`)} = ${xh(Bq)}이다. ${nb(`${V('A')} + ${V('B')}`)} = ${xh(`(${A})+(${Bq})`)} = ${pt(xv(src))}이다.`
        });
      })
    ]
  });

  // ── 단항식과 다항식의 곱셈 ──
  B.addGroup(UNIT, {
    id: 'dist', title: '단항식과 다항식의 곱셈', standard: STD3,
    types: [
      T('dist-two', '단항식과 항이 2개인 다항식의 곱셈', '①71 ②65', (d, n) => {
        const [a, b] = pair(d), parts = [a + '^2', a + b];
        if (n === 0) {
          const k = nz(d, -6, 6), [c1, c2] = d.until(() => many(d, 2, -7, 7), ([x, y]) => Math.abs(k * x) > 1 || Math.abs(k * y) > 1), src = `${ms(k, [[a, 1]])}(${lin([c1, c2], a, b)})`;
          return polyQ('다음 식을 전개하시오.', src, parts, { rule: 'dist-two-front', explain: `${RULE_DIST} ${xh(src)} = ${xh(`${ms(k, [[a, 1]])}*${pa(ms(c1, [[a, 1]]))}`)} + ${xh(`${pa(ms(k, [[a, 1]]))}*${pa(ms(c2, [[b, 1]]))}`)} = ${pt(xv(src))}이다.` });
        }
        if (n === 1) {
          // 뒤에서 음수인 단항식을 곱한다.
          const k = -d.int(2, 6), [c1, c2] = many(d, 2, -7, 7), src = `(${lin([c1, c2], a, b)})*(${ms(k, [[a, 1]])})`;
          return polyQ('다음 식을 전개하시오.', src, parts, { rule: 'dist-two-back', explain: `${RULE_DIST} 음수를 곱하면 각 항의 부호가 바뀐다. ${xh(src)} = ${pt(xv(src))}이다.` });
        }
        // 계수가 분수인 단항식을 곱한다.
        const m = d.pick([2, 3, 4, 5]), kq = Q(pm(d) * co(d, m, 1, 4), m), [c1, c2] = [m * nz(d, -3, 3), m * nz(d, -3, 3)], src = `${ms(kq, [[a, 1]])}(${lin([c1, c2], a, b)})`;
        return polyQ('다음 식을 전개하시오.', src, parts, { rule: 'dist-two-frac', explain: `${RULE_DIST} ${xh(src)} = ${pt(xv(src))}이다.` });
      }, { count: 3 }),
      T('dist-three', '단항식과 항이 3개인 다항식의 곱셈', '①71 ②66', (d) => {
        const [a, b] = pair(d), parts = [a + '^2', a + b, a], k = d.int(2, 6) * pm(d), cs = many(d, 3, -7, 7), back = d.bool();
        const src = back ? `(${lin3(cs, a, b)})*${pa(ms(k, [[a, 1]]))}` : `${ms(k, [[a, 1]])}(${lin3(cs, a, b)})`;
        return polyQ('다음 식을 전개하시오.', src, parts, { rule: 'dist-three', explain: `${RULE_DIST} ${xh(src)} = ${pt(xv(src))}이다.` });
      }),
      T('dist-three-xy', '문자가 2개인 단항식과 다항식의 곱셈', '①71 ②66', (d) => {
        const [a, b] = pair(d), parts = [a + '^2' + b, a + b + '^2', a + b], k = d.int(2, 5) * pm(d), cs = many(d, 3, -6, 6);
        const src = `(${lin3(cs, a, b)})*${pa(ms(k, [[a, 1], [b, 1]]))}`;
        return polyQ('다음 식을 전개하시오.', src, parts, { rule: 'dist-three-xy', explain: `${RULE_DIST} ${xh(src)} = ${pt(xv(src))}이다.` });
      }),
      T('dist-coef-pick', '전개한 식에서 한 항의 계수 구하기', '①72 심60', (d) => {
        // (c1 x² + c2 xy + c3 y²) × (k/m) x 를 전개한 식의 x²y 나 xy² 의 계수
        const m = d.pick([2, 3, 4]), k = co(d, m, 1, 5) * pm(d), cs = d.until(() => [m * nz(d, -4, 4), m * nz(d, -4, 4), m * nz(d, -4, 4)], (t) => new Set(t.map(Math.abs)).size === 3);
        const src = `(${pn([[cs[0], 'x^2'], [cs[1], 'xy'], [cs[2], 'y^2']])})*${pa(ms(Q(k, m), [['x', 1]]))}`, P = xv(src), which = d.pick(['x^2y', 'xy^2']), t = P.find((u) => keyOf(u.e) === keyOf(xv(which)[0].e));
        return N(`${xj(src, '을/를')} 전개한 식에서 ${xh(which)}의 계수는?`, t.q.p, {
          signed: true, explain: `전개하면 ${pt(P)}이다. ${xh(which)}의 계수는 ${tx(t.q)}이다.`, facts: { calc: [[coefS(t), 0]], unseen: UNSEEN }
        });
      }),
      T('dist-sum', '전개한 두 식의 합과 차', '①73 ②67', (d, n) => {
        const [a, b] = pair(d), parts = [a + '^2', a + b];
        if (n === 0) {
          const src = d.until(() => { const [k1, k2] = [nz(d, -5, 5), d.int(2, 5)], [c1, c2, c3, c4] = many(d, 4, -5, 5); return `${ms(k1, [[a, 1]])}(${lin([c1, c2], a, b)})-${ms(k2, [[a, 1]])}(${lin([c3, c4], b, a)})`; }, (s) => polyOK(s, parts));
          return polyQ(CALC, src, parts, { rule: 'dist-sum-int', explain: `각각 전개한 다음 동류항끼리 모은다. ${told(src)}이다.` });
        }
        // 계수가 분수인 단항식
        const m = d.pick([2, 3]), src = d.until(() => { const [k1, k2] = [co(d, m, 1, 5), co(d, m, 1, 5)], [c1, c2, c3, c4] = many(d, 4, -6, 6); return `${ms(Q(k1, m), [[a, 1]])}(${lin([c1, c2], a, b)})+${ms(Q(k2, m), [[a, 1]])}(${lin([c3, c4], a, b)})`; }, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { rule: 'dist-sum-frac', explain: `각각 전개한 다음 동류항끼리 모은다. ${told(src)}이다.` });
      }, { count: 2 }),
      T('dist-sum-three', '항이 3개인 다항식과의 곱을 전개한 두 식의 차', '①73 ②67', (d) => {
        const [a, b] = pair(d), parts = [a + '^2', a + b, a];
        const src = d.until(() => `${ms(d.int(2, 5), [[a, 1]])}(${lin3(many(d, 3, -5, 5), a, b)})-${ms(d.int(2, 5), [[a, 1]])}(${lin3(many(d, 3, -5, 5), a, b)})`, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { rule: 'dist-sum-three', explain: `각각 전개한 다음 동류항끼리 모은다. 빼는 식에서는 부호가 바뀐다. ${told(src)}이다.` });
      }),
      T('dist-sum-num', '수를 곱한 식과 단항식을 곱한 식의 합과 차', '①73 ②67', (d) => {
        const v = d.pick(['x', 'a']), parts = [v + '^2', v, ''];
        const src = d.until(() => { const [p, q] = d.until(() => [many(d, 2, -5, 5), many(d, 2, -5, 5)], ([x, y]) => x[0] !== y[0] || x[1] !== y[1]); return d.bool() ? `${kp(d.int(2, 5), quad(many(d, 3, -4, 4), v))}-${ms(d.int(2, 5), [[v, 1]])}(${pn([[p[0], v], [p[1], '']])})` : `${ms(d.int(2, 5), [[v, 1]])}(${pn([[p[0], v], [p[1], '']])})+${kp(d.int(2, 4), pn([[q[0], v], [q[1], '']]))}`; }, (s) => polyOK(s, parts));
        return polyQ(CALC, src, parts, { rule: 'dist-sum-num', explain: `각각 전개한 다음 동류항끼리 모은다. ${told(src)}이다.` });
      }),
      T('dist-box-sub', '전개가 있는 뺄셈의 등식에서 알맞은 다항식 구하기', '①79', (d) => {
        // M1(P1) − □ = M2(P2) → □ = M1(P1) − M2(P2)
        const [a, b] = pair(d), parts = [a + '^2', a + b, a];
        const [L, R] = d.until(() => [`${ms(nz(d, -4, 4), [[a, 1]])}(${lin3(many(d, 3, -5, 5), a, b)})`, `${ms(d.int(2, 4), [[a, 1]])}(${lin3(many(d, 3, -5, 5), a, b)})`], ([x, y]) => polyOK(`${x}-${y}`, parts));
        const src = `${L}-${R}`;
        return polyQ(BOX_EXPR, src, parts, { figure: eqx(`${L}-?`, R), explain: `□ = ${told(src)}이다.` });
      }),
      T('dist-shaded', '큰 직사각형에서 작은 직사각형을 뺀 부분의 넓이', '①88', (d) => {
        // 큰 직사각형: 가로 c1 x + c2, 세로 k x / 작은 직사각형: 가로 c3 x − c4, 세로 m x (m < k, c3 ≤ c1)
        const v = d.pick(['x', 'a']), parts = [v + '^2', v];
        const [k, m, c1, c2, c3, c4] = d.until(() => [d.int(3, 6), d.int(1, 4), d.int(2, 5), d.int(2, 6), d.int(1, 4), d.int(1, 4)], (t) => t[1] < t[0] && t[4] < t[2] && t[0] * t[2] !== t[1] * t[4] && t[0] * t[3] + t[1] * t[5] !== 0);
        const BW = pn([[c1, v], [c2, '']]), BH = ms(k, [[v, 1]]), SW = pn([[c3, v], [-c4, '']]), SH = ms(m, [[v, 1]]), src = `${BH}(${BW})-${SH}(${SW})`;
        return polyQ(`다음 그림과 같이 가로의 길이가 ${xh(BW)}, 세로의 길이가 ${xh(BH)}인 직사각형에서 가로의 길이가 ${xh(SW)}, 세로의 길이가 ${xh(SH)}인 직사각형을 잘라 냈다. 색칠한 부분의 넓이를 구하시오.`, src, parts, {
          figure: K.cornerFig([BW, BH], [SW, SH]),
          explain: `큰 직사각형의 넓이에서 작은 직사각형의 넓이를 뺀다. ${told(src)}이다.`
        });
      }),
      T('dist-two-boxes', '두 직육면체의 부피의 합', '①87', (d) => {
        // 밑면의 가로 k1 a, 세로 w, 높이 a + c1 b 인 것과 밑면의 가로 k2 a, 세로 w, 높이 a − c2 b 인 것
        const [a, b] = pair(d), parts = [a + '^2', a + b], w = d.int(2, 4), [k1, k2, c1, c2] = d.until(() => [d.int(2, 4), d.int(1, 3), d.int(1, 4), d.int(1, 4)], (t) => t[0] !== t[1] && t[0] * t[2] !== t[1] * t[3]);
        const W1 = ms(k1, [[a, 1]]), H1 = lin([1, c1], a, b), W2 = ms(k2, [[a, 1]]), H2 = lin([1, -c2], a, b), src = `${w}*${W1}(${H1})+${w}*${W2}(${H2})`;
        return polyQ(`밑면의 가로의 길이가 ${xh(W1)}, 세로의 길이가 ${w}, 높이가 ${xh(H1)}인 직육면체 A와 밑면의 가로의 길이가 ${xh(W2)}, 세로의 길이가 ${w}, 높이가 ${xh(H2)}인 직육면체 B가 있다. 두 직육면체의 부피의 합을 구하시오.`, src, parts, {
          figure: null,
          explain: `직육면체 A의 부피는 ${xh(`${w}*${W1}(${H1})`)} = ${pt(xv(`${w}*${W1}(${H1})`))}, 직육면체 B의 부피는 ${xh(`${w}*${W2}(${H2})`)} = ${pt(xv(`${w}*${W2}(${H2})`))}이다. 합은 ${pt(xv(src))}이다.`
        });
      })
    ]
  });

  // ── 다항식과 단항식의 나눗셈, 섞인 계산 ──
  // 나누어떨어지는 (다항식) ÷ (단항식)을 짓는다: 몫의 항 [계수, 문자 지수들]에 나누는 단항식을 곱해 나누어지는 식을 만든다.
  const times = (terms, mono) => srcOf(xv(`(${terms})*${pa(mono)}`));
  B.addGroup(UNIT, {
    id: 'div', title: '다항식과 단항식의 나눗셈, 섞인 계산', standard: STD3,
    types: [
      T('div-int', '다항식을 단항식으로 나누기', '①75 ②68', (d, n) => {
        const [a, b] = pair(d), parts = [a, b], q = lin(d.until(() => many(d, 2, -7, 7), ([x, y]) => Math.abs(x) !== Math.abs(y)), a, b);
        if (n === 0) {
          const M0 = ms(d.int(2, 6), [[a, 1]]), src = `(${times(q, M0)}):${M0}`;
          const [u1, u2] = ordered(xv(times(q, M0)));
          return polyQ(CALC, src, parts, { rule: 'div-int-pos', explain: `${RULE_PDIV} ${xh(src)} = ${u1.q.p < 0 ? MINUS : ''}${frac(fpart(termH(u1)), fpart(htmlX(M0)))} ${u2.q.p < 0 ? MINUS : '+'} ${frac(fpart(termH(u2)), fpart(htmlX(M0)))} = ${pt(xv(src))}이다.` });
        }
        // 문자가 2개인 음수 단항식으로 나눈다.
        const M0 = ms(-d.int(2, 6), [[a, 1], [b, 1]]), src = `(${times(q, M0)}):(${M0})`;
        return polyQ(CALC, src, parts, { rule: 'div-int-neg', explain: `${RULE_PDIV} 음수로 나누면 각 항의 부호가 바뀐다. ${xh(src)} = ${pt(xv(src))}이다.` });
      }, { count: 2 }),
      T('div-three', '항이 3개인 다항식을 단항식으로 나누기', '①75 ②68', (d) => {
        const [a, b] = pair(d), parts = [a + '^2', a + b, ''], q = pn([[nz(d, -5, 5), a + '^2'], [nz(d, -5, 5), a + b], [nz(d, -6, 6), '']]), M0 = ms(d.int(2, 7) * pm(d), [[a, d.int(1, 2)]]), src = `(${times(q, M0)}):${pa(M0)}`;
        return polyQ(CALC, src, parts, { rule: 'div-three', explain: `${RULE_PDIV} ${xh(src)} = ${pt(xv(src))}이다.` });
      }),
      T('div-fraccoef', '다항식을 계수가 분수인 단항식으로 나누기', '①75 ②69', (d) => {
        // (c1 a²b + c2 a b³) ÷ (±(k/m) a b) → 정수 계수의 a, b² 항
        const [a, b] = pair(d), parts = [b + '^2', a], m = d.pick([2, 3, 4, 5]), k = co(d, m, 1, 4), sgn = pm(d), [x1, x2] = d.until(() => many(d, 2, -4, 4), ([x, y]) => Math.abs(x) !== Math.abs(y));
        const M0 = ms(Q(sgn * k, m), [[a, 1], [b, 1]]), top = pn([[sgn * k * x1, a + '^2' + b], [sgn * k * x2, a + b + '^3']]), src = `(${top}):${pa(M0)}`, rec = xv(`1:${pa(M0)}`);
        return polyQ(CALC, src, parts, { rule: 'div-fraccoef', explain: `나누는 식의 역수를 곱한다. ${xh(M0)}의 역수는 ${pt(rec)}이므로 ${xh(src)} = (${xh(top)}) × ${sgn < 0 ? '(' + pt(rec) + ')' : pt(rec)} = ${pt(xv(src))}이다.` });
      }),
      T('div-claims', '단항식과 다항식의 곱셈·나눗셈이 옳은 것과 옳지 않은 것', '①77 ②72 심59', (d, n) => {
        const [a, b] = pair(d), [p, q] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y);
        if (n === 0) {
          return eqQ(d, '다음 중 옳은 것은?', [
            [`3${a}(${p}${a}+2)`, pAdd(mk(3 * p, { [a]: 2 }), mk(6, {}))], [`(3${a}^2-${a}):[1|4]${a}`, pAdd(mk(12, { [a]: 3 }), mk(-4, { [a]: 2 }))],
            [`-${b}(${p}${a}-3${b}+2)`, pAdd(pAdd(mk(-p, { [a]: 1, [b]: 1 }), mk(-3, { [b]: 2 })), mk(-2, { [b]: 1 }))], [`(${2 * q}${a}^2${b}-${4 * q}${a}${b}):2${a}${b}`, pAdd(mk(q, { [a]: 1 }), mk(-4 * q, { [a]: 1, [b]: 1 }))],
            [`(${a}-2${b})*(-${q}${a})`, pAdd(mk(-q, { [a]: 2 }), mk(-2 * q, { [a]: 1, [b]: 1 }))], [`(6${a}^2-4${a}):(-2${a})`, pAdd(mk(-3, { [a]: 1 }), mk(-2, {}))]
          ], true, { rule: 'div-claims-true' });
        }
        return eqQ(d, '다음 중 옳지 않은 것은?', [
          [`(${3 * p}${a}^2-${2 * p}${a}):${p}${a}`, pAdd(mk(3, { [a]: 1 }), mk(-2 * p, { [a]: 1 })), '다항식의 모든 항을 나누어야 한다.'],
          [`(4${a}${b}^2-8${a}${b}):(-4${a}${b})`, pAdd(mk(-1, { [b]: 1 }), mk(-2, {})), '음수로 나누면 각 항의 부호가 바뀐다.'],
          [`(8${a}^3-4${a}^2):[2|3]${a}^2`, pAdd(mk(Q(16, 3), { [a]: 1 }), mk(Q(-8, 3), {})), `${xh(`[2|3]${a}^2`)}의 역수 ${pj(mk(Q(3, 2), { [a]: -2 }), '을/를')} 곱한다.`],
          [`(${2 * q}${a}^2${b}+${3 * q}${a}${b}^2):${q}${a}${b}`, pAdd(mk(2, { [a]: 2 }), mk(3, { [b]: 2 })), '나눗셈에서 지수는 뺀다.'],
          [`(9${a}^2-6${a}${b}):3${a}`, pAdd(mk(3, { [a]: 1 }), mk(-2, { [a]: 1, [b]: 1 })), `${V(a)}로 나누면 ${xh(`6${a}${b}`)}의 ${V(a)}는 약분되어 사라진다.`]
        ], false, { rule: 'div-claims-false' });
      }, { count: 2 }),
      T('div-match', '계산 결과가 같은 식끼리 짝 짓기', '②73', (d) => {
        // 전개 둘, 나눗셈 둘 가운데 결과가 같은 것은 한 쌍뿐이다. 나머지는 부호나 계수 하나가 다르다.
        const v = d.pick(['x', 'a']), [k, c] = [d.int(2, 4), d.int(2, 6)], sgn = pm(d);
        // 같은 쌍: sgn·k v (v − c) 와 (sgn·k v³ − sgn·k c v²) ÷ v
        const g1 = `${ms(sgn * k, [[v, 1]])}(${v}-${c})`, g2 = `(${pn([[sgn * k, v + '^3'], [-sgn * k * c, v + '^2']])}):${v}`;
        const o1 = `${ms(-sgn * k, [[v, 1]])}(${v}+${c})`, o2 = `(${pn([[sgn * k, v + '^3'], [sgn * k * c, v + '^2']])}):${v}`, o3 = `${ms(sgn * k, [[v, 1]])}(${c}-${v})`;
        const rows = d.shuffle([g1, g2].concat(d.shuffle([o1, o2, o3]).slice(0, 2))), names = LAB.slice(0, 4), pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
        const good = pairs.filter(([i, j]) => xsame(rows[i], rows[j]));
        if (good.length !== 1) throw new Error('결과가 같은 쌍이 하나가 아니다');
        const shown = d.shuffle([good[0]].concat(d.shuffle(pairs.filter((p) => p !== good[0])).slice(0, 3)));
        return C('다음 식 가운데 계산 결과가 같은 것끼리 짝 지은 것은?', shown.map(([i, j]) => `${names[i]}, ${names[j]}`), shown.indexOf(good[0]), {
          figure: xtagged(rows), explain: `계산 결과는 차례로 ${rows.map((s) => pt(xv(s))).join(', ')}이다.`, facts: { truth: shown.map(([i, j]) => xsame(rows[i], rows[j])), want: true }
        });
      }),
      T('div-box-mul', '나누었더니 다항식이 되는 처음 식 구하기', '①78 ②74 심64', (d) => {
        // 어떤 다항식 ÷ M = P → 어떤 다항식 = P × M
        const [a, b] = pair(d), parts = [a + '^3' + b + '^2', a + '^2' + b, a + b], M0 = ms(d.int(2, 5) * pm(d), [[a, 1], [b, 1]]), P = pn([[nz(d, -5, 5), a + '^2' + b], [nz(d, -5, 5), a], [nz(d, -5, 5), '']]), src = `(${P})*${pa(M0)}`;
        return polyQ(`어떤 다항식을 ${xj(M0, '으로/로')} 나누었더니 ${xj(P, '이/가')} 되었다. 어떤 다항식을 구하시오.`, src, parts, { figure: null, explain: `(어떤 다항식) ÷ ${M0.startsWith('-') ? '(' + xh(M0) + ')' : xh(M0)} = ${xh(P)}이므로 어떤 다항식은 ${xh(src)} = ${pt(xv(src))}이다.` });
      }),
      T('div-box-div', '곱했더니 다항식이 되는 식 구하기', '①78 ②74', (d) => {
        // □ × (k/m)ab = R → □ = R ÷ (k/m)ab
        const [a, b] = pair(d), parts = [a, b], m = d.pick([2, 3]), k = co(d, m, 1, 4), [x1, x2] = d.until(() => many(d, 2, -6, 6), ([x, y]) => Math.abs(x) !== Math.abs(y));
        const M0 = ms(Q(k, m), [[a, 1], [b, 1]]), R = pn([[k * x1, a + '^2' + b], [k * x2, a + b + '^2']]), src = `(${R}):${M0}`;
        return polyQ(BOX_EXPR, src, parts, { figure: eqx(`?*${M0}`, R), explain: `□ = ${xh(src)}이다. ${xh(M0)}의 역수 ${pj(xv(`1:${M0}`), '을/를')} 곱하면 ${pt(xv(src))}이다.` });
      }),
      T('div-two-sum', '다항식을 단항식으로 나눈 두 식의 합과 차', '①82 ②76·77 심61', (d, n) => {
        const [a, b] = pair(d), parts = [a, b];
        const [q1, q2, M1, M2, minus] = d.until(() => [lin(many(d, 2, -6, 6), a, b), lin(many(d, 2, -6, 6), a, b), ms(d.int(2, 5) * (n === 0 ? pm(d) : 1), [[a, 1]]), ms(d.int(2, 5), n === 0 ? [[b, 1]] : [[a, 1], [b, 1]]), d.bool()], ([x, y, , , neg]) => polyOK(`(${x})${neg ? '-' : '+'}(${y})`, parts));
        const t1 = times(q1, M1), t2 = times(q2, M2);
        if (n === 0) {
          const src = `(${t1}):${pa(M1)}${minus ? '-' : '+'}(${t2}):${M2}`;
          return polyQ(CALC, src, parts, { rule: 'div-two-sum', explain: `나눗셈을 각각 계산한 다음 동류항끼리 모은다. ${told(src)}이다.` });
        }
        // 분수 꼴로 적은 나눗셈
        const src = `[${t1}|${M1}]${minus ? '-' : '+'}[${t2}|${M2}]`;
        return polyQ(CALC, src, parts, { rule: 'div-two-bar', explain: `분수 꼴은 분자의 각 항을 분모로 나눈다. ${told(src)}이다.` });
      }, { count: 2 }),
      T('mix-dist-div', '전개와 나눗셈이 섞인 계산', '①83 ②76 심61', (d, n) => {
        const [a, b] = pair(d), parts = [a + '^2', a + b];
        // 나누어지는 식은 정수 계수의 식에 나누는 단항식(n = 0)이나 그 문자 부분(n = 1)을 곱해 짓는다.
        const [front, top, M0, minus] = d.until(() => {
          const base = ms(n === 0 ? d.int(2, 5) : 1, [[a, 1], [b, 1]]), q = pn([[nz(d, -6, 6), a + '^2'], [nz(d, -6, 6), a + b]]);
          return [`${ms(d.int(2, 5) * pm(d), [[a, 1]])}(${lin(many(d, 2, -5, 5), a, b)})`, times(q, base), n === 0 ? base : ms(Q(1, d.pick([2, 3, 4])), [[a, 1], [b, 1]]), d.bool()];
        }, ([f, x, mm, neg]) => polyOK(`${f}${neg ? '-' : '+'}(${x}):${mm}`, parts));
        const src = `${front}${minus ? '-' : '+'}(${top}):${M0}`;
        return polyQ(CALC, src, parts, { rule: n === 0 ? 'mix-int' : 'mix-frac', explain: `곱셈과 나눗셈을 먼저 계산한 다음 동류항끼리 모은다.${n === 1 ? ` ${xh(M0)}로 나눌 때는 역수를 곱한다.` : ''} ${told(src)}이다.` });
      }, { count: 2 }),
      T('div-side', '넓이·부피가 다항식인 도형의 변의 길이와 높이', '①86 ②81 심71', (d, n) => {
        const [a, b] = pair(d), parts = [a, b], hq = d.until(() => [d.int(1, 5), nz(d, -5, 5)], ([x, y]) => x !== Math.abs(y)), H = lin(hq, a, b);
        if (n === 0) {
          const W = ms(d.int(2, 6), [[a, 1], [b, 1]]), S = times(H, W), src = `(${S}):${W}`;
          return polyQ(`가로의 길이가 ${xh(W)}이고 넓이가 ${xh(S)}인 직사각형의 세로의 길이를 구하시오.`, src, parts, { figure: K.rectFig(W, null, S), rule: 'div-side-rect', explain: `(세로의 길이) = (넓이) ÷ (가로의 길이)이므로 ${xh(src)} = ${pt(xv(src))}이다.` });
        }
        if (n === 1) {
          // 삼각형: 넓이 × 2 ÷ 밑변
          const k = d.int(1, 4), W = ms(2 * k, [[a, 1], [b, 1]]), S = times(H, ms(k, [[a, 1], [b, 1]])), src = `2(${S}):${W}`;
          return polyQ(`밑변의 길이가 ${xh(W)}이고 넓이가 ${xh(S)}인 삼각형의 높이를 구하시오.`, src, parts, { figure: K.triFig(W), rule: 'div-side-tri', unseen: [2], explain: `${frac(1, 2)} × ${xh(W)} × (높이) = ${xh(S)}이므로 (높이) = ${xh(src)} = ${xh(`(${times(H, W)}):${W}`)} = ${pt(xv(src))}이다.` });
        }
        // 원기둥: 부피 ÷ (π × 반지름²)
        const r = d.int(2, 4), R = ms(r, [[a, 1]]), base = `${r * r}π${a}^2`, Vs = srcOf(xv(`(${H})*${base}`)), src = `(${Vs}):(π*(${R})^2)`;
        return polyQ(`밑면의 반지름의 길이가 ${xh(R)}이고 부피가 ${xh(Vs)}인 원기둥의 높이를 구하시오.`, src, parts, { figure: K.cylFig(R), rule: 'div-side-cyl', unseen: [2], explain: `밑넓이는 π × ${xh(`(${R})^2`)} = ${xh(base)}이다. (높이) = (부피) ÷ (밑넓이)이므로 ${xh(`(${Vs}):${base}`)} = ${pt(xv(src))}이다.` });
      }, { count: 3 }),
      T('div-side-perimeter', '넓이와 가로의 길이로 세로의 길이를 구하여 둘레의 길이 구하기', '심71', (d) => {
        const [a, b] = pair(d), parts = [a, b], k = d.int(2, 5), [c1, c2] = [d.int(1, 5), d.int(1, 5)], W = ms(k, [[a, 1]]), L = lin([c1, c2], a, b), S = times(L, W), src = `2{${W}+(${S}):${W}}`;
        return polyQ(`가로의 길이가 ${xh(W)}이고 넓이가 ${xh(S)}인 직사각형의 둘레의 길이를 구하시오.`, src, parts, {
          figure: null, unseen: [2], explain: `세로의 길이는 ${xh(`(${S}):${W}`)} = ${xh(L)}이다. 둘레의 길이는 ${xh(`2{${W}+(${L})}`)} = ${pt(xv(src))}이다.`
        });
      }),
      T('div-stack', '쌓아 올린 두 직육면체의 전체 높이', '심73', (d) => {
        const [a, b] = pair(d), parts = [a, b], w = d.int(2, 4), [k1, k2] = [d.int(1, 3), d.int(1, 3)];
        const [h1, h2] = d.until(() => [[d.int(1, 4), d.int(1, 4)], [d.int(1, 4), -d.int(1, 4)]], ([x, y]) => x[0] + y[0] !== 0 && x[1] + y[1] !== 0);
        const W1 = ms(k1, [[a, 1]]), W2 = ms(k2, [[b, 1]]), H1 = lin(h1, a, b), H2 = lin(h2, a, b), V1 = srcOf(xv(`${w}*${W1}(${H1})`)), V2 = srcOf(xv(`${w}*${W2}(${H2})`)), src = `(${V1}):(${w}*${W1})+(${V2}):(${w}*${W2})`;
        return polyQ(`밑면의 가로의 길이가 ${xh(W1)}, 세로의 길이가 ${w}이고 부피가 ${xh(V1)}인 직육면체 A 위에 밑면의 가로의 길이가 ${xh(W2)}, 세로의 길이가 ${w}이고 부피가 ${xh(V2)}인 직육면체 B를 올려놓았다. 두 직육면체를 쌓은 전체 높이를 구하시오.`, src, parts, {
          figure: null,
          explain: `직육면체 A의 높이는 ${xh(`(${V1}):${srcOf(xv(`${w}*${W1}`))}`)} = ${xh(H1)}, 직육면체 B의 높이는 ${xh(`(${V2}):${srcOf(xv(`${w}*${W2}`))}`)} = ${xh(H2)}이다. 전체 높이는 ${xh(`(${H1})+(${H2})`)} = ${pt(xv(src))}이다.`
        });
      }),
      T('div-stack-volume', '전체 높이와 아래 직육면체의 부피로 위 직육면체의 부피 구하기', '심73', (d) => {
        // 아래 직육면체의 높이를 구한다 → 전체 높이에서 빼어 위 직육면체의 높이를 구한다 → 위 직육면체의 부피를 구한다.
        const [a, b] = pair(d), parts = [a + '^2', a + b], w = d.int(2, 4), [k1, k2] = d.until(() => [d.int(1, 3), d.int(1, 4)], ([x, y]) => x !== y);
        const [h1, h2] = d.until(() => [[d.int(1, 4), d.int(1, 4)], [d.int(1, 5), pm(d) * d.int(1, 4)]], ([x, y]) => x[1] + y[1] !== 0);
        const W1 = ms(k1, [[a, 1]]), W2 = ms(k2, [[a, 1]]), H1 = lin(h1, a, b), H2 = lin(h2, a, b), Hall = lin([h1[0] + h2[0], h1[1] + h2[1]], a, b), V1 = srcOf(xv(`${w}*${W1}(${H1})`)), base1 = srcOf(xv(`${w}*${W1}`)), base2 = srcOf(xv(`${w}*${W2}`));
        const src = `${w}*${W2}{(${Hall})-(${V1}):(${w}*${W1})}`;
        return polyQ(`밑면의 가로의 길이가 ${xh(W1)}, 세로의 길이가 ${w}이고 부피가 ${xh(V1)}인 직육면체 A 위에 밑면의 가로의 길이가 ${xh(W2)}, 세로의 길이가 ${w}인 직육면체 B를 올려놓았더니 전체 높이가 ${xj(Hall, '이/가')} 되었다. 직육면체 B의 부피를 구하시오.`, src, parts, {
          figure: null,
          explain: `직육면체 A의 높이는 ${xh(`(${V1}):${base1}`)} = ${xh(H1)}이므로 직육면체 B의 높이는 ${xh(`(${Hall})-(${H1})`)} = ${xh(H2)}이다. 직육면체 B의 부피는 ${xh(`${base2}(${H2})`)} = ${pt(xv(src))}이다.`
        });
      })
    ]
  });

  // ── 식의 값과 식의 대입 ──
  const intVal = (P) => (P.length === 0 ? Q(0) : P.length === 1 && letters(P[0]).length === 0 ? P[0].q : null);
  // 식을 간단히 한 다음 문자에 수를 넣어 값을 구하는 문항. kind: 'int'
  function valueQ(src, env, o) {
    const S = xv(src), P = xv(src, env), v = intVal(P), t = P[0];
    return ansV(`${given(env)}일 때, 다음 식의 값은?`, v, 'int', {
      figure: xex(src), explain: `${o.lead || '식을 먼저 간단히 한다.'} ${told(src)}이다. ${given(env)}${tail(lastOf(qabs(asQ(env[Object.keys(env).pop()]))), '을/를')} 대입하면 ${nb(plugH(S, env))} = ${tx(v)}이다.`,
      facts: Object.assign({ value: coefS(t), unseen: UNSEEN }, o.rule ? { rule: o.rule } : {})
    });
  }
  const valueOK = (src, env) => { try { const v = intVal(xv(src, env)); return Boolean(v) && v.p !== 0 && isInt(v) && Math.abs(v.p) <= 99 && xv(src).length >= 1; } catch (_) { return false; } };
  const envOf = (d, a, b, frac0) => ({ [a]: frac0 ? Q(pm(d) * d.pick([1, 3]), 2) : nz(d, -4, 4), [b]: d.until(() => nz(d, -4, 4), (y) => Math.abs(y) > 1) });
  B.addGroup(UNIT, {
    id: 'value', title: '식의 값과 식의 대입', standard: STD3,
    types: [
      T('value-mono', '단항식의 계산을 간단히 한 다음 식의 값 구하기', '①91', (d) => {
        const [a, b] = ['x', 'y'];
        const [src, env] = d.until(() => {
          const [c1, c2, c3] = [d.pick([2, 3, 4, 5, 6]), d.pick([2, 3, 4, 6]) * pm(d), d.pick([2, 3, 4, 6, 12, 15])], [p, q, r, s, t, u] = [d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(0, 2), d.int(1, 3), d.int(1, 3)];
          return [`${ms(c1, [[a, p], [b, q]])}*${pa(ms(c2, [[a, r], [b, s]]))}:${ms(c3, [[a, t], [b, u]])}`, envOf(d, a, b)];
        }, ([s, e]) => monoOK(s, [a, b]) && degOf(xv(s)[0]) <= 3 && Math.abs(xv(s)[0].q.p) <= 9 && valueOK(s, e) && Math.abs(e[a]) > 1 && (e[a] < 0 || e[b] < 0));
        return valueQ(src, env, { rule: 'value-mono' });
      }, { standard: STD1 }),
      T('value-poly', '다항식의 계산을 간단히 한 다음 식의 값 구하기', '①92 ②83 심63', (d, n) => {
        const [a, b] = ['x', 'y'];
        if (n === 0) {
          // (다항식) ÷ (단항식) − 전개
          const [src, env] = d.until(() => { const q = lin(many(d, 2, -4, 4), a, b), M0 = ms(d.int(2, 4), [[a, 1], [b, 1]]); return [`(${times(q, M0)}):${M0}-${ms(d.int(1, 3), [[a, 1]])}(${pn([[nz(d, -3, 3), b], [nz(d, -4, 4), '']])})`, envOf(d, a, b)]; }, ([s, e]) => valueOK(s, e) && xv(s).length === 3 && (e[a] < 0 || e[b] < 0));
          return valueQ(src, env, { rule: 'value-poly-div' });
        }
        if (n === 1) {
          // 문자의 값이 분수: (다항식) ÷ (단항식) 둘의 합
          const [src, env] = d.until(() => { const [q1, q2] = [lin([2 * nz(d, -3, 3), nz(d, -5, 5)], a, b), lin([2 * nz(d, -3, 3), nz(d, -5, 5)], a, b)], [M1, M2] = [ms(d.int(2, 5) * pm(d), [[a, 1]]), ms(d.int(2, 4), [[b, 1]])]; return [`(${times(q1, M1)}):${pa(M1)}+(${times(q2, M2)}):${M2}`, envOf(d, a, b, true)]; }, ([s, e]) => valueOK(s, e) && xv(s).length === 2);
          return valueQ(src, env, { rule: 'value-poly-frac' });
        }
        // 괄호가 여러 겹인 식
        const [src, env] = d.until(() => { const [c1, c2, c3, c4, c5, c6] = [d.int(3, 8), d.int(2, 5), d.int(1, 4), d.int(1, 5), d.int(2, 6), d.int(1, 4)]; return [`${pn([[c1, a]])}-<${lin([c2, -1], a, b)}+{${lin([-c3, c4], a, b)}-(${lin([c5, c6], a, b)})}>`, envOf(d, a, b)]; }, ([s, e]) => valueOK(s, e) && xv(s).length === 2 && (e[a] < 0 || e[b] < 0));
        return valueQ(src, env, { rule: 'value-poly-nested', lead: '괄호를 안쪽부터 풀어 식을 먼저 간단히 한다.' });
      }, { count: 3 }),
      T('subst-linear', '한 문자에 일차식을 대입하기', '②85', (d) => {
        // y = p x + q 일 때 c1 x + c2 y 를 x 에 대한 식으로
        const [a, b] = d.bool() ? ['x', 'y'] : ['y', 'x'], [p, q, c1, c2, c3] = d.until(() => many(d, 5, -6, 6), (t) => t[2] + t[3] * t[0] !== 0 && t[3] * t[1] + t[4] !== 0 && Math.abs(t[3]) <= 5), sub = pn([[p, a], [q, '']]), src = lin3([c1, c2, c3], a, b), env = { [b]: xv(sub) }, plugged = `${pn([[c1, a]])}${c2 < 0 ? '-' : '+'}${kp(Math.abs(c2), sub)}${sg(c3, '')}`;
        return polyQ(`${nb(`${V(b)} = ${htmlX(sub)}`)}일 때, ${xj(src, '을/를')} ${V(a)}에 대한 식으로 나타내시오.`, src, [a, ''], {
          env, figure: null, explain: `${V(b)}에 ${xj(sub, '을/를')} 대입한다. 대입하는 식은 괄호에 넣는다. ${xh(src)} = ${told(plugged)}이다.`
        });
      }, { standard: STD2 }),
      T('subst-product', '곱이 있는 식의 한 문자에 일차식을 대입하기', '②86', (d) => {
        // b = p a + q 일 때 c1 a² + c2 a b
        const [a, b] = pair(d), [p, q, c1, c2] = d.until(() => many(d, 4, -4, 4), (t) => t[2] + t[3] * t[0] !== 0 && Math.abs(t[3]) > 1), sub = pn([[p, a], [q, '']]), src = pn([[c1, a + '^2'], [c2, a + b]]), plugged = `${pn([[c1, a + '^2']])}${c2 < 0 ? '-' : '+'}${Math.abs(c2)}${a}(${sub})`;
        return polyQ(`${nb(`${V(b)} = ${htmlX(sub)}`)}일 때, ${xj(src, '을/를')} ${V(a)}에 대한 식으로 나타내시오.`, src, [a + '^2', a], {
          env: { [b]: xv(sub) }, figure: null, explain: `${V(b)}에 ${xj(sub, '을/를')} 대입하여 전개한다. ${xh(src)} = ${told(plugged)}이다.`
        });
      }),
      T('subst-ab', '두 문자에 다항식을 대입하여 계산하기', '①69 ②87 심46', (d, n) => {
        const [a, b] = ['x', 'y'], parts = [a, b];
        if (n === 2) {
          // 분수 꼴 A, B: 먼저 간단히 하면 2A·4B 꼴이 되어 분모가 사라진다.
          const [pa1, pb1, k1, k2] = d.until(() => [many(d, 2, -5, 5), many(d, 2, -5, 5), d.int(1, 2), d.int(1, 2)], ([x, y, u, w]) => polyOK(`${3 * u}(${lin(x, a, b)})+${w}(${lin(y, a, b)})`, parts));
          const As = `[${lin(pa1, a, b)}|2]`, Bs = `[${lin(pb1, a, b)}|4]`, form = `3(${2 * k1}A-B)+${4 * k2 + 3}B`;
          const env = { A: xv(As), B: xv(Bs) };
          return polyQ(`다음 두 식 ${V('A')}, ${V('B')}에 대하여 ${xj(form, '을/를')} 계산하시오.`, form, parts, {
            env, figure: named([['A', As], ['B', Bs]]), rule: 'subst-ab-frac',
            explain: `먼저 식을 간단히 하면 ${xh(form)} = ${pt(xv(form, {}))}이다. ${V('A')}, ${V('B')}에 식을 대입하면 ${xh(`${6 * k1}*${As}+${4 * k2}*${Bs}`)} = ${xh(`${3 * k1}(${lin(pa1, a, b)})+${k2}(${lin(pb1, a, b)})`)} = ${pt(xv(form, env))}이다.`
          });
        }
        const [pa1, pb1] = d.until(() => [many(d, 2, -5, 5), many(d, 2, -5, 5)], ([x, y]) => x[0] * y[1] !== x[1] * y[0]), As = lin(pa1, a, b), Bs = lin(pb1, a, b), env = { A: xv(As), B: xv(Bs) };
        if (n === 0) {
          const [k1, k2] = d.until(() => [d.int(1, 4), d.int(2, 4)], ([u, w]) => polyOK(`${u}(${As})-${w}(${Bs})`, parts)), form = `${k1 === 1 ? '' : k1}A-${k2}B`;
          return polyQ(`다음 두 식 ${V('A')}, ${V('B')}에 대하여 ${xj(form, '을/를')} 계산하시오.`, form, parts, {
            env, figure: named([['A', As], ['B', Bs]]), rule: 'subst-ab-direct',
            explain: `대입하는 식은 괄호에 넣는다. ${xh(form)} = ${told(`${kp(k1, As)}-${kp(k2, Bs)}`)}이다.`
          });
        }
        // 먼저 A, B 의 식을 간단히 한다: (k1 A − B) − k2(A − k3 B)
        const [k1, k2, k3] = d.until(() => [d.int(2, 5), d.int(2, 4), d.int(2, 3)], ([u, w, z]) => u - w !== 0 && polyOK(`${u - w}(${As})+${w * z - 1}(${Bs})`, parts)), form = `(${k1}A-B)-${k2}(A-${k3}B)`, simple = srcOf(xv(form, {}));
        return polyQ(`다음 두 식 ${V('A')}, ${V('B')}에 대하여 ${xj(form, '을/를')} 계산하시오.`, form, parts, {
          env, figure: named([['A', As], ['B', Bs]]), rule: 'subst-ab-simplify',
          explain: `먼저 식을 간단히 하면 ${xh(form)} = ${xh(simple)}이다. ${V('A')}, ${V('B')}에 식을 대입하면 ${told(simple.replace(/A/, `(${As})`).replace(/B/, `(${Bs})`))}이다.`
        });
      }, { count: 3, standard: STD2 })
    ]
  });

  Object.assign(B.kit.m812, { RULE_ADD, RULE_SUB, RULE_DIST, RULE_PDIV, lin, lin3, quad, sg, P2, many, degP, times, intVal, valueQ, valueOK, envOf });
})(typeof window !== 'undefined' ? window : globalThis);
