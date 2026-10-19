// 고등학교 1학년 2학기(공통수학2) Ⅱ-1 집합 — 뒤쪽 묶음(여집합과 차집합, 드모르간의 법칙, 집합의 연산과 포함 관계, 집합의 원소의 개수).
// 단원 틀과 도구(B.kit.m1024)는 10-2-4a.js 에 있다. 싣는 기준과 뺀 것도 거기 머리 주석에 모아 적었다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//  - 연산의 등식이 「항상」 성립하는가는 전체집합 {1, 2, 3}의 모든 부분집합 A, B(64쌍)를 넣어 보아 가린다(벤 다이어그램의 모든 칸을 따지는 것과 같다).
//  - 원소의 개수 문항은 문제에 적힌 수로 다시 셈하는 식(facts.calc)을 단다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, lines, N, M, C } = B.kit;
  const { MINUS, gcd, lcm, range, nb, V, tag } = B.kit.mid;
  const K = B.kit.m1024;
  const { UNIT, S3, HAN, CIR, X, va, vb, sT, rng, odd, even, SUP_C, T, jo, wj, S, cup, cap, sub, same, inside, keyOf, divisors, isPrime, primesTo, subsetsOf,
    sum, elH, listH, setH, sj, bset, nOf, comp, choose, combo, setChoice, exH, exN, exIn, exVal, regionsOf, sameEx, venn2, venn3, figOpt, regionWord3, PLACE2,
    pickN, someNums, linH, linV, solveS, r9, meetAll, sameR, valsQ } = K;
  const pow2 = (k) => (k === 0 ? '1' : Array(k).fill('2').join('*'));
  const CU = comp('A'), CB = comp('B');
  // 전체집합 {1, 2, 3}의 모든 부분집합 쌍(항상 성립하는가를 가릴 때)
  const U3 = [1, 2, 3], PAIRS = (() => { const subs = subsetsOf(U3), out = []; for (const a of subs) for (const b of subs) out.push({ U: U3, A: a, B: b }); return out; })();

  // ════════════════════════════════════════════════════════════════
  // 라. 여집합과 차집합
  // ════════════════════════════════════════════════════════════════
  // 전체집합과 그 부분집합 둘(원소나열·조건제시)
  function universe(d) {
    const kind = d.int(0, 1);
    if (kind === 0) { const m = d.int(7, 10); return { U: rng(1, m), h: bset(`${X}는 ${m} 이하의 자연수`) }; }
    const nn = d.pick([12, 18, 20, 24, 30]); return { U: divisors(nn), h: bset(`${X}는 ${nn}의 약수`) };
  }
  // U 의 부분집합을 조건(약수·배수·홀수·소수)이나 원소나열로 적는다.
  function subsetOf(d, U, avoid) {
    const conds = [];
    for (const k of [2, 3, 4, 5]) conds.push([bset(`${X}는 ${k}의 배수`), U.filter((x) => x % k === 0)]);
    for (const k of [4, 6, 8, 9, 10, 12]) conds.push([bset(`${X}는 ${k}의 약수`), U.filter((x) => k % x === 0)]);
    conds.push([bset(`${X}는 홀수`), U.filter(odd)], [bset(`${X}는 소수`), U.filter(isPrime)], [bset(`${X}는 짝수`), U.filter(even)]);
    const ok = conds.filter(([, s]) => s.length >= 2 && s.length < U.length && keyOf(s) !== avoid);
    if (d.bool() && ok.length) { const [h, s] = d.pick(ok); return { h, set: S(s) }; }
    const s = S(pickN(d, U, d.int(2, Math.min(5, U.length - 2)))); return { h: setH(s), set: s };
  }
  const diffTypes = [
    T('dif-compl', '여집합 구하기', '②2', (d) => {
      const u = universe(d), A = subsetOf(d, u.U), right = sub(u.U, A.set);
      return setChoice(d, `전체집합 U = ${u.h}의 부분집합 A = ${wj(A.h, '에/에')} 대하여 ${wj(CU, '은/는')}?`, right, [A.set, u.U, right.slice(1), cup(right, [A.set[0]]), right.slice(0, -1)], {
        explain: `U = ${setH(u.U)}, A = ${wj(setH(A.set), '이므로/이므로')} U의 원소 가운데 A에 속하지 않는 것을 모으면 ${CU} = ${setH(right)}이다.`
      });
    }),
    T('dif-minus', '차집합 구하기', '②3', (d) => {
      const pickC = () => d.pick(K.CAT.filter((c) => c.set.length >= 3 && c.set.length <= 6));
      for (let i = 0; i < 40; i += 1) {
        const c1 = pickC(), c2 = pickC();
        if (c1.key === c2.key || cap(c1.set, c2.set).length < 1 || !sub(c1.set, c2.set).length || !sub(c2.set, c1.set).length) continue;
        const A = c1.set, Bs = c2.set, ab = d.bool(), right = ab ? sub(A, Bs) : sub(Bs, A), name0 = ab ? 'A−B' : 'B−A';
        return setChoice(d, `두 집합 A = ${d.bool() ? setH(A) : c1.h}, B = ${wj(c2.h, '에/에')} 대하여 ${wj(name0, '은/는')}?`, right, [ab ? sub(Bs, A) : sub(A, Bs), cap(A, Bs), cup(A, Bs), ab ? A : Bs, cup(sub(A, Bs), sub(Bs, A))], {
          explain: `A = ${setH(A)}, B = ${wj(setH(Bs), '이다/이다')}. ${name0}${jo(name0, '은/는')} ${ab ? 'A에는 속하고 B에는 속하지 않는' : 'B에는 속하고 A에는 속하지 않는'} 원소의 집합이므로 ${setH(right)}이다.`
        });
      }
      return null;
    }),
    T('dif-check', '연산 결과가 옳지 않은 것 고르기', '②5', (d) => {
      const u = universe(d), A = subsetOf(d, u.U), Bs = subsetOf(d, u.U, A.set.join(',')), U = u.U, env = { U, A: A.set, B: Bs.set };
      const KINDS = [
        [['u', 'A', 'B'], (v) => cap(A.set, Bs.set)], [['i', 'A', 'B'], (v) => cup(A.set, Bs.set)], [['c', 'A'], (v) => cup(v, [A.set[0]])], [['c', 'B'], (v) => v.slice(1)],
        [['d', 'A', 'B'], () => sub(Bs.set, A.set)], [['d', 'B', 'A'], () => sub(A.set, Bs.set)], [['i', ['c', 'A'], ['c', 'B']], () => sub(U, cap(A.set, Bs.set))], [['i', ['c', 'A'], 'B'], () => sub(A.set, Bs.set)]
      ];
      const picks = d.shuffle(KINDS).slice(0, 5), bad = d.int(0, 4);
      const rows = picks.map(([e, wrong], i) => { const v = exVal(e, env); const shown = i === bad ? S(wrong(v)) : v; return [nb(exH(e) + ' = ' + setH(shown)), !same(shown, v), e, v]; });
      if (rows.filter((r) => r[1]).length !== 1) return null;
      const w = rows.find((r) => r[1]);
      return choose(d, `전체집합 U = ${u.h}의 두 부분집합 A = ${A.h}, B = ${wj(Bs.h, '에/에')} 대하여 다음 중 옳지 않은 것은?`, rows.map((r) => [r[0], r[1]]), {
        explain: `A = ${setH(A.set)}, B = ${wj(setH(Bs.set), '이다/이다')}. ${exN(w[2])} = ${wj(setH(w[3]), '이므로/이므로')} 옳지 않다. 나머지는 바르게 구하였다.`
      });
    }),
    T('dif-ccdiff', '여집합끼리의 차집합 B^C − A^C', '심5', (d) => {
      const m = d.int(8, 10), U = rng(1, m), A = someNums(d, d.int(3, 5), 1, m), Bs = someNums(d, d.int(3, 5), 1, m);
      if (!cap(A, Bs).length || !sub(A, Bs).length || !sub(Bs, A).length || cup(A, Bs).length === m) return null;
      const right = sub(A, Bs), ask = nb(CB + ' ' + MINUS + ' ' + CU);
      return setChoice(d, `전체집합 U = ${bset(`${X}는 ${m} 이하의 자연수`)}의 두 부분집합 A = ${setH(A)}, B = ${wj(setH(Bs), '에/에')} 대하여 집합 ${wj(ask, '은/는')}?`, right, [sub(Bs, A), cap(A, Bs), sub(U, cup(A, Bs)), sub(U, Bs), sub(U, A)], {
        explain: `${CB} ${MINUS} ${CU} = ${CB}∩(${CU})${SUP_C} = ${CB}∩A = A−B이다. 따라서 ${setH(right)}이다(${CB} = ${setH(sub(U, Bs))}, ${CU} = ${wj(setH(sub(U, A)), '으로/로')} 직접 빼도 같다).`
      });
    }),
    T('dif-err', '차집합의 원소의 개수 — 잘못 센 것 바로잡기', '②6', (d) => {
      const A = someNums(d, d.int(3, 5), 1, 12), Bs = someNums(d, d.int(3, 6), 1, 12), I = cap(A, Bs), ans = A.length - I.length;
      if (!I.length || inside(Bs, A) || inside(A, Bs) || Bs.length === A.length) return null;
      const who = d.pick(NAMES), wrong = A.length - Bs.length;
      return N(`두 집합 A = ${setH(A)}, B = ${wj(setH(Bs), '에/에')} 대하여 ${name(who, '은/는')} ${nOf('A−B')}를 다음과 같이 구하였다. ${nOf('A−B')}의 값을 바르게 구하면?`, ans, {
        figure: lines([nb(`${nOf('A−B')} = ${nOf('A')} ${MINUS} ${nOf('B')}`) + ' ' + nb(`= ${A.length} ${MINUS} ${Bs.length} = ${sT(wrong)}`)]),
        explain: `A−B는 A에서 B에 속하는 원소를 뺀 집합이므로 ${nOf('A−B')} = ${nOf('A')} ${MINUS} ${nOf('A∩B')}이다. A∩B = ${wj(setH(I), '이므로/이므로')} ${nOf('A−B')} = ${A.length} ${MINUS} ${I.length} = ${ans}이다(A−B = ${setH(sub(A, Bs))}).`,
        facts: { calc: [[`${A.length}-${I.length}`, 0]], derived: [I.length] }
      });
    }),
    T('dif-props', '여집합·차집합의 성질 — 참·거짓', '②7', (d) => {
      const POOL = [
        [['c', 'E'], 'U'], [['c', 'U'], 'E'], [['c', ['c', 'A']], 'A'], [['u', 'A', ['c', 'A']], 'U'], [['i', 'A', ['c', 'A']], 'E'], [['d', 'A', 'B'], ['i', 'A', ['c', 'B']]],
        [['c', 'A'], ['d', 'U', 'A']], [['d', 'A', 'U'], 'E'], [['c', ['c', 'A']], 'E'], [['u', 'A', ['c', 'A']], 'A'], [['i', 'A', ['c', 'A']], 'U'], [['d', 'A', 'B'], ['i', 'A', 'B']],
        [['d', 'A', 'B'], ['d', 'B', 'A']], [['c', 'U'], 'U'], [['d', 'A', 'B'], ['i', ['c', 'A'], 'B']], [['d', 'U', 'A'], 'A']
      ].map(([l, r]) => [nb(exH(l) + ' = ' + exH(r)), sameEx(l, r, ['A', 'B']), l, r]);
      const rows = d.shuffle(POOL).slice(0, 4);
      if (rows.every((r) => r[1]) || rows.every((r) => !r[1])) return null;
      return combo(d, `전체집합 U의 두 부분집합 A, B에 대하여 다음 보기에서 항상 옳은 것을 모두 고른 것은?`, rows.map((r) => [r[0], r[1]]), {
        explain: rows.map((r, i) => `${HAN[i]}. ${r[1] ? '옳다' : `${exN(r[2])} = ${exN(simple(r[2]))}이므로 옳지 않다`}.`).join(' ')
      });
    }),
    T('dif-var', '차집합이 주어질 때 미지수의 값', '②8', (d) => {
      // A = {p, q, r, f(a, b)}, B = {p, s, g(a, b)}, A − B = {r}, n(A) = 4 → g = q, f = s
      const [p, q, r, s] = d.shuffle(rng(1, 12)).slice(0, 4), a0 = d.int(-2, 6), b0 = d.int(-2, 6);
      const c1 = d.pick([2, 3, 1]), c2 = d.pick([-1, 1, -2]), c3 = d.pick([-1, 1, 2]), c4 = d.pick([2, 1, 3]);
      if (c1 * c4 - c2 * c3 === 0) return null;
      // f(a0, b0) = s, g(a0, b0) = q 가 되게 상수항을 붙인다.
      const e1 = s - (c1 * a0 + c2 * b0), e2 = q - (c3 * a0 + c4 * b0);
      if (Math.abs(e1) > 9 || Math.abs(e2) > 9) return null;
      const f = (a, b) => c1 * a + c2 * b + e1, g = (a, b) => c3 * a + c4 * b + e2;
      // 확인: 원소끼리 같아지는 두 식을 골라 푼 (a, b) 를 모두 넣어 본다.
      const vals = [p, q, r, s], sols = [];
      for (const t1 of vals) for (const t2 of vals) {
        const det = c1 * c4 - c2 * c3, a = ((t1 - e1) * c4 - c2 * (t2 - e2)) / det, b = (c1 * (t2 - e2) - c3 * (t1 - e1)) / det;
        const A = S([p, q, r, f(a, b)].map(r9)), Bv = S([p, s, g(a, b)].map(r9));
        if (A.length === 4 && same(sub(A, Bv), [r])) sols.push(r9(a) + ',' + r9(b));
      }
      if (new Set(sols).size !== 1 || sols[0] !== a0 + ',' + b0) return null;
      const two = (x, y, e) => { const t = [[x, va], [y, vb]].filter(([c]) => c !== 0).map(([c, v], i) => (i === 0 ? (c < 0 ? MINUS : '') : c < 0 ? ` ${MINUS} ` : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + v).join(''); return e === 0 ? t : t + (e > 0 ? ' + ' + e : ' ' + MINUS + ' ' + -e); };
      const fH = two(c1, c2, e1), gH = two(c3, c4, e2);
      return valsQ(`두 집합 A = {${p}, ${q}, ${r}, ${fH}}, B = {${p}, ${s}, ${gH}}에 대하여 A − B = {${r}}일 때, 상수 ${va}, ${vb}의 값은? (단, ${nOf('A')} = 4)`, [['a', a0], ['b', b0]], {
        explain: `A − B = {${r}}이므로 A의 원소 ${josa(q, '과/와')} ${wj(fH, '은/는')} B의 원소이다. ${q} ∈ B이므로 ${gH} = ${q}이고, ${nOf('A')} = 4이므로 ${wj(fH, '은/는')} ${wj(p + ', ' + q, '이/가')} 아니어서 ${fH} = ${s}이다. 두 식을 풀면 ${va} = ${sT(a0)}, ${vb} = ${sT(b0)}이다.`,
        facts: { calc: [[`((${s}-(${e1}))*(${c4})-(${c2})*(${q}-(${e2})))/((${c1})*(${c4})-(${c2})*(${c3}))`, 0], [`((${c1})*(${q}-(${e2}))-(${c3})*(${s}-(${e1})))/((${c1})*(${c4})-(${c2})*(${c3}))`, 1]], derived: [Math.abs(e1), Math.abs(e2), Math.abs(c1), Math.abs(c2), Math.abs(c3), Math.abs(c4)] }
      });
    }),
    T('dif-sym', '(A∪B)−(A∩B)가 주어질 때 미지수의 값', '②9', (d) => {
      // A = {p, q, a}, B = {q, f(a), a + r}: p 가 B 에 들어야 한다.
      const p = d.int(1, 6), q = d.pick(rng(1, 9).filter((x) => x !== p)), a0 = d.pick(rng(-3, 8).filter((x) => x !== p && x !== q)), c = d.pick([-1, 2, -2, 3]), e = p - c * a0, r = d.int(-4, 4);
      const g0 = a0 + r;
      if (r === 0 || Math.abs(e) > 12 || [p, q].includes(g0)) return null;
      const Aset = (a) => [p, q, a], Bset = (a) => [q, c * a + e, a + r], sd = (a) => { const A = S(Aset(a).map(r9)), Bv = S(Bset(a).map(r9)); return sub(cup(A, Bv), cap(A, Bv)); };
      const R = sd(a0);
      if (R.length !== 2 || R.some((x) => x <= 0)) return null;
      const sols = meetAll([[0, p], [0, q], [1, 0], [c, e], [1, r]].concat(R.map((t) => [0, t]))).filter((a) => sameR(sd(a), R));
      if (sols.length !== 1 || sols[0] !== a0) return null;
      const a1 = p - r, fail = a1 !== a0 && !sameR(sd(a1), R);
      if (!fail) return null;
      return N(`두 집합 A = {${p}, ${q}, ${va}}, B = {${q}, ${linH(c, e, va)}, ${linH(1, r, va)}}에 대하여 (A∪B)−(A∩B) = ${wj(setH(R), '일/일')} 때, 상수 ${va}의 값은?`, a0, {
        signed: true,
        explain: `${p} ∈ A이고 ${josa(p, '은/는')} (A∪B)−(A∩B)에 없으므로 ${p} ∈ A∩B, 곧 ${p} ∈ B이다. (i) ${linH(1, r, va)} = ${p}이면 ${va} = ${sT(a1)}이고 이때 (A∪B)−(A∩B) = ${wj(setH(sd(a1)), '이므로/이므로')} 맞지 않다. (ii) ${linH(c, e, va)} = ${p}이면 ${va} = ${sT(a0)}이고 (A∪B)−(A∩B) = ${setH(R)}이다.`,
        facts: { calc: [[solveS(c, e, p), 0]], derived: [Math.abs(c)] }
      });
    }),
    T('dif-symcalc', '(A∩B^C)∪(A^C∩B) 구하기', '②10', (d) => {
      const u = universe(d), A = subsetOf(d, u.U), Bs = subsetOf(d, u.U, A.set.join(',')), env = { U: u.U, A: A.set, B: Bs.set };
      const e = ['u', ['i', 'A', ['c', 'B']], ['i', ['c', 'A'], 'B']], right = exVal(e, env);
      if (!right.length || !cap(A.set, Bs.set).length) return null;
      return setChoice(d, `전체집합 U = ${u.h}의 두 부분집합 A = ${A.h}, B = ${wj(Bs.h, '에/에')} 대하여 집합 ${wj(exN(e), '은/는')}?`, right, [cap(A.set, Bs.set), cup(A.set, Bs.set), sub(A.set, Bs.set), sub(Bs.set, A.set), sub(u.U, cup(A.set, Bs.set))], {
        explain: `${exN(['i', 'A', ['c', 'B']])} = A−B = ${setH(sub(A.set, Bs.set))}, ${exN(['i', ['c', 'A'], 'B'])} = B−A = ${wj(setH(sub(Bs.set, A.set)), '이므로/이므로')} 구하는 집합은 ${setH(right)}이다.`
      });
    }),
    T('dif-symback', '(A∩B^C)∪(A^C∩B)에서 B 되짚기', '②11', (d) => {
      const m = d.int(5, 8), U = rng(1, m), A = someNums(d, d.int(2, 3), 1, m), Bs = someNums(d, d.int(2, 4), 1, m);
      const e = ['u', ['i', 'A', ['c', 'B']], ['i', ['c', 'A'], 'B']], Sd = exVal(e, { U, A, B: Bs });
      if (!cap(A, Bs).length || !sub(A, Bs).length || !sub(Bs, A).length) return null;
      return setChoice(d, `전체집합 U = ${setH(U)}의 두 부분집합 A, B에 대하여 A = ${setH(A)}, ${exN(e)} = ${wj(setH(Sd), '일/일')} 때, 집합 B는?`, Bs, [sub(Sd, A), cup(A, Sd), Sd, sub(A, Sd), cup(cap(A, Sd), sub(Sd, A))], {
        explain: `${exN(e)} = (A−B)∪(B−A)이다. A의 원소 가운데 이 집합에 있는 ${wj(listH(cap(A, Sd)) || '원소', '은/는')} A−B에, 없는 ${wj(listH(cap(A, Bs)), '은/는')} A∩B에 든다. A 밖의 원소 가운데 이 집합에 있는 ${wj(listH(sub(Sd, A)), '은/는')} B−A에 든다. 따라서 B = ${setH(Bs)}이다.`
      });
    })
  ];
  // 보기 등식의 왼쪽을 간단히 한 값(풀이 글)
  function simple(e) {
    const regs = regionsOf(e, ['A', 'B']);
    const CANDS = ['E', 'U', 'A', 'B', ['c', 'A'], ['c', 'B'], ['i', 'A', 'B'], ['u', 'A', 'B'], ['d', 'A', 'B'], ['d', 'B', 'A']];
    return CANDS.find((c) => keyOf(regionsOf(c, ['A', 'B'])) === keyOf(regs)) || e;
  }

  // ════════════════════════════════════════════════════════════════
  // 마. 드모르간의 법칙과 벤 다이어그램
  // ════════════════════════════════════════════════════════════════
  const WORDS = ['computer', 'triangle', 'dragonfly', 'education', 'platinum', 'blueprint'];
  const DM = [['u', ['c', 'A'], ['c', 'B']], ['i', ['c', 'A'], ['c', 'B']], ['c', ['u', ['c', 'A'], 'B']], ['c', ['u', 'A', ['c', 'B']]], ['c', ['i', 'A', 'B']], ['c', ['u', 'A', 'B']], ['i', 'A', ['c', 'B']], ['u', ['c', 'A'], 'B']];
  const VENN_EX = [['i', ['c', 'A'], ['c', 'B']], ['u', ['c', 'A'], ['c', 'B']], ['i', 'A', ['c', 'B']], ['c', ['u', 'A', ['c', 'B']]], ['d', 'B', 'A'], ['c', ['d', 'A', 'B']], ['u', 'A', ['c', 'B']], ['c', ['u', 'A', 'B']]];
  const SH3 = [['u', ['d', 'A', 'B'], 'C'], ['i', ['i', 'A', 'B'], ['c', 'C']], ['i', ['u', 'A', 'B'], ['c', 'C']], ['u', ['i', ['c', 'A'], 'B'], 'C'], ['i', 'A', ['u', 'B', 'C']], ['c', ['u', ['u', 'A', 'B'], 'C']],
    ['d', 'A', ['u', 'B', 'C']], ['u', ['i', 'A', 'B'], ['i', 'A', 'C']], ['i', ['d', 'A', 'B'], 'C'], ['u', ['i', 'A', 'B'], 'C'], ['d', ['u', 'B', 'C'], 'A'], ['i', ['u', 'A', 'B'], 'C'], ['u', ['d', 'A', 'C'], ['d', 'C', 'A']], ['d', 'C', ['i', 'A', 'B']]];
  const SH2 = [['d', 'A', 'B'], ['d', 'B', 'A'], ['c', ['u', 'A', 'B']], ['c', ['i', 'A', 'B']], ['u', 'A', ['c', 'B']], ['u', ['d', 'A', 'B'], ['d', 'B', 'A']], ['i', ['c', 'A'], 'B'], ['u', ['c', 'A'], 'B'], ['i', 'A', 'B'], ['c', 'A']];
  const NAMES3 = ['A', 'B', 'C'], NAMES2 = ['A', 'B'];
  const dmTypes = [
    T('dm-calc', '드모르간의 법칙으로 집합 구하기', '②12', (d) => {
      let U, A, Bs, Uh;
      if (d.bool()) { const w = d.pick(WORDS); U = w.split(''); A = S(pickN(d, U, d.int(3, 4))); Bs = S(pickN(d, U, d.int(3, 4))); Uh = setH(U); }
      else { const m = d.int(7, 9); U = rng(1, m); A = someNums(d, d.int(3, 4), 1, m); Bs = someNums(d, d.int(3, 4), 1, m); Uh = setH(U); }
      if (!cap(A, Bs).length || same(A, Bs)) return null;
      const env = { U, A, B: Bs }, e = d.pick(DM.slice(0, 6)), right = exVal(e, env);
      const wrongs = DM.filter((x) => x !== e).map((x) => exVal(x, env)).concat([cup(right, [d.pick(U)]), right.slice(1)]);
      const law = simpleDM(e);
      return setChoice(d, `전체집합 U = ${Uh}의 두 부분집합 A = ${setH(A)}, B = ${wj(setH(Bs), '에/에')} 대하여 집합 ${wj(exN(e), '은/는')}?`, right, wrongs, {
        explain: `드모르간의 법칙에 따라 ${exN(e)} = ${exN(law)}이다. A∩B = ${setH(cap(A, Bs))}, A∪B = ${wj(setH(cup(A, Bs)), '이므로/이므로')} 구하는 집합은 ${setH(right)}이다.`
      });
    }),
    T('dm-venn', '원소가 적힌 벤 다이어그램 읽기', '②13', (d) => {
      const m = d.int(8, 10), pool = d.shuffle(rng(1, m)), sizes = [d.int(1, 3), d.int(1, 3), d.int(1, 3)];
      const onlyA = S(pool.slice(0, sizes[0])), both = S(pool.slice(sizes[0], sizes[0] + sizes[1])), onlyB = S(pool.slice(sizes[0] + sizes[1], sizes[0] + sizes[1] + sizes[2])), out = S(pool.slice(sizes[0] + sizes[1] + sizes[2]));
      if (!out.length || out.length > 6) return null;
      const U = rng(1, m), A = cup(onlyA, both), Bs = cup(both, onlyB), env = { U, A, B: Bs };
      const e = d.pick(VENN_EX), right = exVal(e, env), wrongs = VENN_EX.filter((x) => x !== e).map((x) => exVal(x, env));
      const fig = venn2({ items: { 10: d.shuffle(onlyA), 11: d.shuffle(both), '01': d.shuffle(onlyB), '00': d.shuffle(out) } });
      return setChoice(d, `전체집합 U의 두 부분집합 A, B를 벤 다이어그램으로 나타낸 것이다. 집합 ${wj(exN(e), '은/는')}?`, right, wrongs, {
        figure: fig,
        explain: `그림에서 A = ${setH(A)}, B = ${setH(Bs)}, U = ${wj(setH(U), '이다/이다')}. ${exN(e)}${jo(exN(e), '은/는')} 벤 다이어그램에서 ${regionsOf(e, NAMES2).map((k) => PLACE2[k]).join(', ')}이므로 ${setH(right)}이다.`
      });
    }),
    T('dm-var', '드모르간의 법칙과 미지수의 값', '②14', (d) => {
      const m = d.int(5, 7), U = rng(1, m), Bs = someNums(d, d.int(2, 3), 1, m), t = d.pick(Bs), p = d.pick(rng(1, m).filter((x) => !Bs.includes(x)));
      const c = d.pick([2, 3]), a0 = d.int(2, 6), e = t - c * a0;
      if (e === 0 || Math.abs(e) > 12) return null;
      const G = sub(U, [t]), Aset = (a) => [p, c * a + e];
      const sols = meetAll([[0, p], [c, e]].concat(U.map((x) => [0, x]))).filter((a) => sameR(sub(U, cap(S(Aset(a).map(r9)), Bs)), G) && Aset(a).every((x) => U.includes(x)));
      if (sols.length !== 1 || sols[0] !== a0) return null;
      return N(`전체집합 U = ${setH(U)}의 두 부분집합 A = {${p}, ${linH(c, e, va)}}, B = ${wj(setH(Bs), '에/에')} 대하여 ${CU}∪${CB} = ${wj(setH(G), '일/일')} 때, 상수 ${va}의 값은?`, a0, {
        signed: true,
        explain: `드모르간의 법칙에 따라 ${CU}∪${CB} = (A∩B)${SUP_C} = ${wj(setH(G), '이므로/이므로')} A∩B = {${t}}이다. ${josa(p, '은/는')} B의 원소가 아니므로 ${linH(c, e, va)} = ${t}, 곧 ${va} = ${sT(a0)}이다.`,
        facts: { calc: [[solveS(c, e, t), 0]] }
      });
    }),
    T('dm-back', '연산 결과로 집합 되짚기', '②15', (d, n) => {
      const m = d.int(7, 10), U = rng(1, m), pool = d.shuffle(U), s = [d.int(1, 3), d.int(1, 2), d.int(1, 3)];
      const onlyA = S(pool.slice(0, s[0])), both = S(pool.slice(s[0], s[0] + s[1])), onlyB = S(pool.slice(s[0] + s[1], s[0] + s[1] + s[2])), out = S(pool.slice(s[0] + s[1] + s[2]));
      if (out.length < 1) return null;
      const A = cup(onlyA, both), Bs = cup(both, onlyB);
      if (n === 0) {
        const e1 = ['i', ['c', 'A'], ['c', 'B']], e2 = ['i', 'A', ['c', 'B']];
        return setChoice(d, `전체집합 U = ${setH(U)}의 두 부분집합 A, B에 대하여 ${exN(e1)} = ${setH(out)}, ${exN(e2)} = ${wj(setH(onlyA), '일/일')} 때, 집합 B는?`, Bs, [sub(U, out), onlyB, sub(U, onlyA), A, cup(onlyB, onlyA), both], {
          explain: `${exN(e1)} = (A∪B)${SUP_C}이므로 A∪B = ${setH(sub(U, out))}이다. ${exN(e2)} = A−B이므로 B = (A∪B)−(A−B) = ${setH(Bs)}이다.`,
          facts: { rule: 'back-b' }
        });
      }
      const e1 = ['d', 'A', ['d', 'A', 'B']], e2 = ['d', 'B', ['i', 'A', 'B']], right = sub(U, Bs);
      return setChoice(d, `전체집합 U = ${setH(U)}의 두 부분집합 A, B에 대하여 ${exN(e1)} = ${setH(both)}, ${exN(e2)} = ${wj(setH(onlyB), '일/일')} 때, ${wj(CB, '은/는')}?`, right, [Bs, sub(U, both), sub(U, onlyB), out, cup(out, onlyA).slice(1)], {
          explain: `${exN(e1)} = A∩B = ${setH(both)}, ${exN(e2)} = B−A = ${wj(setH(onlyB), '이므로/이므로')} B = (A∩B)∪(B−A) = ${setH(Bs)}이다. 따라서 ${CB} = ${setH(right)}이다.`,
          facts: { rule: 'back-bc' }
        });
    }, { count: 2 }),
    T('dm-shade', '색칠한 부분과 집합', '②16', (d, n) => {
      if (n === 0) {
        const pool = d.shuffle(SH3), target = pool[0], regs = keyOf(regionsOf(target, NAMES3));
        const others = pool.slice(1).filter((e) => keyOf(regionsOf(e, NAMES3)) !== regs);
        const seen = new Set([regs]), wrong = [];
        for (const e of others) { const k = keyOf(regionsOf(e, NAMES3)); if (!seen.has(k)) { seen.add(k); wrong.push(e); } if (wrong.length === 4) break; }
        if (wrong.length < 4) return null;
        return choose(d, '다음 중 벤 다이어그램에서 색칠한 부분을 나타내는 집합은?', wrong.map((e) => [exN(e), false]).concat([[exN(target), true]]), {
          figure: venn3({ shade: regionsOf(target, NAMES3) }),
          explain: `색칠한 부분은 ${regionsOf(target, NAMES3).map(regionWord3).join(', ')}이다. 이것을 나타내는 집합은 ${exN(target)}이다. 다른 보기는 색칠한 부분과 칸이 하나 이상 다르다.`,
          facts: { rule: 'shade-pick' }
        });
      }
      const three = d.bool(), pool = d.shuffle(three ? SH3 : SH2), names = three ? NAMES3 : NAMES2, target = pool[0], regs = keyOf(regionsOf(target, names));
      const seen = new Set([regs]), wrong = [];
      for (const e of pool.slice(1)) { const k = keyOf(regionsOf(e, names)); if (!seen.has(k) && regionsOf(e, names).length) { seen.add(k); wrong.push(e); } if (wrong.length === 3) break; }
      if (wrong.length < 3) return null;
      const pic = (e) => (three ? venn3({ shade: regionsOf(e, names), small: true }) : venn2({ shade: regionsOf(e, names), small: true }));
      const rows = d.shuffle(wrong.map((e) => [e, false]).concat([[target, true]]));
      return C(`다음 중 집합 ${wj(exN(target), '을/를')} 벤 다이어그램에 나타낸 것은?`, rows.map((r, i) => figOpt(CIR[i], pic(r[0]))), rows.findIndex((r) => r[1]), {
        explain: `${exN(target)}${jo(exN(target), '은/는')} ${regionsOf(target, names).map(three ? regionWord3 : (k) => PLACE2[k]).join(', ')}이다.`,
        facts: { truth: rows.map((r) => r[1]), want: true, rule: 'shade-draw' }
      });
    }, { count: 2 })
  ];
  // 드모르간의 법칙으로 고친 식(풀이 글)
  function simpleDM(e) {
    const regs = keyOf(regionsOf(e, NAMES2));
    const CANDS = [['c', ['i', 'A', 'B']], ['c', ['u', 'A', 'B']], ['i', 'A', ['c', 'B']], ['i', ['c', 'A'], 'B'], ['d', 'A', 'B'], ['d', 'B', 'A'], ['u', ['c', 'A'], 'B'], ['u', 'A', ['c', 'B']]];
    return CANDS.find((c) => keyOf(regionsOf(c, NAMES2)) === regs && JSON.stringify(c) !== JSON.stringify(e)) || e;
  }

  // ════════════════════════════════════════════════════════════════
  // 바. 집합의 연산과 포함 관계, 조건에 맞는 집합의 개수
  // ════════════════════════════════════════════════════════════════
  // 두 집합 사이의 관계 문장: [글, 성립하는가(env)]
  const REL = [
    ['A ⊂ B', (v) => inside(v.A, v.B)], ['B ⊂ A', (v) => inside(v.B, v.A)], ['A∩B = A', (v) => same(cap(v.A, v.B), v.A)], ['A∪B = B', (v) => same(cup(v.A, v.B), v.B)],
    ['A∪B = A', (v) => same(cup(v.A, v.B), v.A)], [`${CU} ⊂ ${CB}`, (v) => inside(sub(v.U, v.A), sub(v.U, v.B))], [`${CB} ⊂ ${CU}`, (v) => inside(sub(v.U, v.B), sub(v.U, v.A))],
    ['B−A = ∅', (v) => !sub(v.B, v.A).length], ['A−B = ∅', (v) => !sub(v.A, v.B).length], [`${CU}∩${CB} = ${CB}`, (v) => same(cap(sub(v.U, v.A), sub(v.U, v.B)), sub(v.U, v.B))],
    [`${CU}∩B = ∅`, (v) => !cap(sub(v.U, v.A), v.B).length], ['A = B', (v) => same(v.A, v.B)], ['A∩B = ∅', (v) => !cap(v.A, v.B).length], [`A∪${CB} = U`, (v) => same(cup(v.A, sub(v.U, v.B)), v.U)]
  ];
  const always = (cond, rel) => PAIRS.filter(cond).every(rel);
  const xTypes = [
    T('inc-always', '연산의 등식이 주는 포함 관계 — 항상 옳은 것', '②19', (d) => {
      const CONDS = [['A∪B = B', (v) => same(cup(v.A, v.B), v.B)], ['A∩B = A', (v) => same(cap(v.A, v.B), v.A)], ['A−B = ∅', (v) => !sub(v.A, v.B).length], ['B−A = ∅', (v) => !sub(v.B, v.A).length], ['A ⊂ B', (v) => inside(v.A, v.B)], [`${CB} ⊂ ${CU}`, (v) => inside(sub(v.U, v.B), sub(v.U, v.A))]];
      const [ch, cond] = d.pick(CONDS), rows = d.shuffle(REL.filter(([h]) => h !== ch)).slice(0, 4).map(([h, rel]) => [nb(h), always(cond, rel)]);
      if (rows.every((r) => r[1]) || rows.every((r) => !r[1])) return null;
      const meaning = always(cond, REL[0][1]) ? 'A ⊂ B' : 'B ⊂ A';
      return combo(d, `전체집합 U의 두 부분집합 A, B에 대하여 ${wj(nb(ch), '일/일')} 때, 다음 보기에서 항상 옳은 것을 모두 고른 것은?`, rows, {
        explain: `${nb(ch)}${jo(ch, '은/는')} ${meaning}와 같은 뜻이다. ${meaning}이면 ${meaning === 'A ⊂ B' ? `A∩B = A, A∪B = B, A−B = ∅, ${CB} ⊂ ${CU}` : `A∩B = B, A∪B = A, B−A = ∅, ${CU} ⊂ ${CB}`}이다. 이것과 맞는 것만 항상 옳다. 옳은 것은 ${HAN.slice(0, rows.length).filter((_, i) => rows[i][1]).join(', ')}이다.`
      });
    }),
    T('inc-simplify', '연산식을 간단히 하여 포함 관계 찾기', '②20', (d) => {
      const EXS = [[['i', ['u', 'A', 'B'], ['u', 'A', ['c', 'B']]], 'A'], [['u', ['i', 'A', 'B'], ['i', 'A', ['c', 'B']]], 'A'], [['i', ['u', 'A', 'B'], ['u', ['c', 'A'], 'B']], 'B'], [['u', ['i', 'A', 'B'], ['i', ['c', 'A'], 'B']], 'B']];
      const RHS = [['u', 'A', 'B'], ['i', 'A', 'B']];
      const [e, simp] = d.pick(EXS), rhs = d.pick(RHS), cond = (v) => same(exVal(e, v), exVal(rhs, v));
      const yes = REL.filter(([, rel]) => always(cond, rel)), no = REL.filter(([, rel]) => !always(cond, rel));
      if (!yes.length || no.length < 4 || PAIRS.filter(cond).every((v) => same(v.A, v.B))) return null;
      const pickYes = d.pick(yes.filter(([h]) => h !== 'A = B'));
      if (!pickYes) return null;
      const rows = [[nb(pickYes[0]), true]].concat(d.shuffle(no).slice(0, 4).map(([h]) => [nb(h), false]));
      return choose(d, `전체집합 U의 두 부분집합 A, B에 대하여 ${exN(e)} = ${wj(exN(rhs), '일/일')} 때, 다음 중 항상 옳은 것은?`, rows, {
        explain: `분배법칙으로 정리하면 ${exN(e)} = ${simp}이다. 따라서 ${simp} = ${exN(rhs)}이고, 이것은 ${always(cond, REL[0][1]) ? 'A ⊂ B' : 'B ⊂ A'}와 같은 뜻이다. 그러므로 항상 옳은 것은 ${pickYes[0]}이다.`
      });
    }),
    T('inc-between', '연산 조건을 포함 관계로 — X의 개수', '②22', (d) => {
      const m = d.int(8, 10), A = someNums(d, d.int(3, 4), 1, m), Bs = someNums(d, d.int(4, 5), 1, m), I = cap(A, Bs);
      const kind = d.int(0, 2);
      let lo, hi, conds, said;
      if (kind === 0) { if (!I.length) return null; lo = I; hi = Bs; conds = ['B∩X = X', '(A∩B)∪X = X']; said = 'A∩B ⊂ X ⊂ B'; }
      else if (kind === 1) { lo = sub(Bs, A); hi = Bs; if (!lo.length || !I.length) return null; conds = ['(B−A)∪X = X', 'B∩X = X']; said = 'B−A ⊂ X ⊂ B'; }
      else { const A2 = S(pickN(d, Bs, d.int(1, 3))); lo = A2; hi = Bs; conds = ['A∩X = A', 'B∪X = B']; said = 'A ⊂ X ⊂ B'; return N(`두 집합 A = ${setH(A2)}, B = ${wj(setH(Bs), '에/에')} 대하여 ${conds.join(', ')}를 만족시키는 집합 X의 개수는?`, 2 ** (hi.length - lo.length), {
        explain: `A∩X = A이면 A ⊂ X, B∪X = B이면 X ⊂ B이다. 곧 ${said}이므로 X는 A의 원소 ${wj(listH(lo), '을/를')} 모두 갖는 B의 부분집합이다. 따라서 2<sup>${hi.length - lo.length}</sup> = ${2 ** (hi.length - lo.length)}개이다.`,
        facts: { calc: [[pow2(hi.length - lo.length), 0]], derived: [2] }
      }); }
      const free = hi.length - lo.length;
      return N(`두 집합 A = ${setH(A)}, B = ${wj(setH(Bs), '에/에')} 대하여 ${conds.join(', ')}를 만족시키는 집합 X의 개수는?`, 2 ** free, {
        explain: `${kind === 0 ? 'B∩X = X이면 X ⊂ B, (A∩B)∪X = X이면 A∩B ⊂ X' : '(B−A)∪X = X이면 B−A ⊂ X, B∩X = X이면 X ⊂ B'}이다. 곧 ${said}이고 ${said.split(' ⊂ ')[0]} = ${wj(setH(lo), '이므로/이므로')} X는 ${wj(listH(lo), '을/를')} 모두 갖는 B의 부분집합이다. 따라서 2<sup>${free}</sup> = ${2 ** free}개이다.`,
        facts: { calc: [[pow2(free), 0]], derived: [2] }
      });
    }),
    T('inc-interval', '실수 범위의 집합에서 (A−B) ⊂ X ⊂ A', '②23', (d, n) => {
      if (n === 0) {
        const p = d.int(-3, 3), q = p + d.int(4, 7), r = d.int(p + 1, q - 1), s = q + d.int(1, 4);
        return M(`두 집합 A = ${bset(`${sT(p)} ≤ ${X} ≤ ${sT(q)}`)}, B = ${wj(bset(`${sT(r)} &lt; ${X} ≤ ${sT(s)}`), '에/에')} 대하여 집합 X = ${wj(bset(`${sT(p)} ≤ ${X} ≤ ${V('k')}`), '이/가')} A∩X = X, (A−B)∪X = X를 만족시킬 때, ${V('k')}의 최댓값과 최솟값은?`,
          [{ answer: q, signed: true, lead: '최댓값' }, { answer: r, signed: true, lead: '최솟값' }], {
            shown: `최댓값 ${sT(q)}, 최솟값 ${sT(r)}`,
            explain: `A∩X = X에서 X ⊂ A, (A−B)∪X = X에서 A−B ⊂ X이다. A−B = ${wj(bset(`${sT(p)} ≤ ${X} ≤ ${sT(r)}`), '이므로/이므로')} ${sT(r)} ≤ ${V('k')} ≤ ${sT(q)}이다. 따라서 최댓값은 ${sT(q)}, 최솟값은 ${sT(r)}이다.`,
            facts: { calc: [[q < 0 ? `0-${-q}` : String(q), 0], [r < 0 ? `0-${-r}` : String(r), 1]], rule: 'interval-k' }
          });
      }
      const a1 = d.int(0, 2), a2 = a1 + d.int(3, 5), w = d.int(a1 + 1, a2 - 1);
      if (w <= Math.abs(a1) || w >= a2) return null;
      const qa = a1 === 0 ? `${X}<sup>2</sup> ${MINUS} ${a2}${X} ≤ 0` : `${X}<sup>2</sup> ${MINUS} ${a1 + a2}${X} + ${a1 * a2} ≤ 0`;
      const cnt = w - a1 + 1;
      return N(`실수 전체의 집합의 두 부분집합 A = ${bset(qa)}, B = ${wj(bset(`${X}<sup>2</sup> ${MINUS} ${w * w} &lt; 0`), '에/에')} 대하여 집합 X = ${wj(bset(`${V('p')} ≤ ${X} ≤ ${V('q')}`), '이/가')} X − A = ∅, (A−B)∪X = X를 만족시킨다. 두 정수 ${V('p')}, ${V('q')}(${V('p')} &lt; ${V('q')})의 순서쌍 (${V('p')}, ${V('q')})의 개수는?`, cnt, {
        explain: `A = ${bset(`${a1} ≤ ${X} ≤ ${a2}`)}, B = ${wj(bset(`${MINUS}${w} &lt; ${X} &lt; ${w}`), '이므로/이므로')} A−B = ${bset(`${w} ≤ ${X} ≤ ${a2}`)}이다. X − A = ∅에서 X ⊂ A, (A−B)∪X = X에서 A−B ⊂ X이므로 ${V('q')} = ${a2}, ${a1} ≤ ${V('p')} ≤ ${w}이다. 따라서 순서쌍은 ${cnt}개이다.`,
        facts: { rule: 'interval-pairs' }
      });
    }, { count: 2 }),
    T('inc-unionX', 'A∪X = B, A∪X = B∪X를 만족시키는 X의 개수', '②24', (d, n) => {
      if (n === 0) {
        const m = d.int(6, 9), Bs = rng(1, m), A = someNums(d, d.int(2, 5), 1, m), need = sub(Bs, A);
        return N(`두 집합 A = ${setH(A)}, B = ${wj(setH(Bs), '에/에')} 대하여 A∪X = B를 만족시키는 집합 X의 개수는?`, 2 ** A.length, {
          explain: `A∪X = B이려면 X ⊂ B이고, A에 없는 ${wj(listH(need), '은/는')} X에 꼭 들어야 한다. A의 원소 ${A.length}개는 X에 들어도 안 들어도 되므로 2<sup>${A.length}</sup> = ${2 ** A.length}개이다.`,
          facts: { calc: [[pow2(A.length), 0]], derived: [2] }
        });
      }
      const u = universe(d), A = S(pickN(d, u.U, d.int(2, 4))), Bs = S(pickN(d, u.U, d.int(2, 4))), need = cup(sub(A, Bs), sub(Bs, A)), free = u.U.length - need.length;
      if (!cap(A, Bs).length || !need.length) return null;
      return N(`전체집합 U = ${u.h}의 세 부분집합 A, B, X에 대하여 A = ${setH(A)}, B = ${wj(setH(Bs), '일/일')} 때, A∪X = B∪X를 만족시키는 집합 X의 개수는?`, 2 ** free, {
        explain: `A∪X = B∪X이려면 A와 B 가운데 한쪽에만 있는 원소 ${wj(listH(need), '이/가')} 모두 X에 들어야 한다. U = ${setH(u.U)}의 나머지 원소 ${free}개는 들어도 안 들어도 되므로 2<sup>${free}</sup> = ${2 ** free}개이다.`,
        facts: { calc: [[pow2(free), 0]], derived: [2] }
      });
    }, { count: 2 }),
    T('inc-cap', 'A∩X = ∅, B∩X = {k}를 만족시키는 X의 개수', '②25', (d) => {
      const m = d.int(6, 9), U = rng(1, m), [p, q] = S(pickN(d, rng(1, m), 2)), A = [p, q], rest = rng(1, m).filter((x) => !A.includes(x)), Bs = S(pickN(d, rest, d.int(2, 3))), k = d.pick(Bs);
      const free = m - cup(A, Bs).length;
      return N(`전체집합 U = ${bset(`${X}는 ${m} 이하의 자연수`)}의 세 부분집합 A = ${bset(`${K.rootsH(p, q)} = 0`)}, B = ${setH(Bs)}, X에 대하여 A∩X = ∅, B∩X = {${k}}를 만족시키는 집합 X의 개수는?`, 2 ** free, {
        explain: `A = ${wj(setH(A), '이다/이다')}. X는 ${josa(k, '을/를')} 꼭 갖고, A의 원소와 B의 나머지 원소는 갖지 않는다. 남은 원소 ${free}개는 들어도 안 들어도 되므로 2<sup>${free}</sup> = ${2 ** free}개이다.`,
        facts: { calc: [[pow2(free), 0]], derived: [2] }
      });
    }),
    T('inc-atleast', '「적어도 하나」를 갖는 부분집합의 개수', '②26', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 1);
        if (kind === 0) {
          const nn = d.pick([12, 18, 20, 24, 30, 36]), A = divisors(nn), ev = A.filter(even);
          return N(`집합 A = ${bset(`${X}는 ${nn}의 약수`)}의 부분집합 가운데 홀수가 적어도 한 개 속하는 집합의 개수는?`, 2 ** A.length - 2 ** ev.length, {
            explain: `A = ${wj(setH(A), '이다/이다')}. 부분집합 ${2 ** A.length}개에서 짝수 ${wj(listH(ev), '으로/로')}만 이루어진 부분집합 ${2 ** ev.length}개(∅ 포함)를 빼면 ${2 ** A.length - 2 ** ev.length}개이다.`,
            facts: { rule: 'atleast-odd' }
          });
        }
        const L = 'abcdefg'.split('').slice(0, d.int(5, 7)), T0 = S(pickN(d, L, d.int(2, 3)));
        return N(`집합 A = ${setH(L)}에 대하여 ${setH(T0)}∩X ≠ ∅, X ⊂ A를 만족시키는 집합 X의 개수는?`, 2 ** L.length - 2 ** (L.length - T0.length), {
          explain: `X는 ${listH(T0)} 가운데 적어도 하나를 갖는 A의 부분집합이다. 부분집합 2<sup>${L.length}</sup>개에서 ${wj(listH(T0), '을/를')} 하나도 갖지 않는 것 2<sup>${L.length - T0.length}</sup>개를 빼면 ${2 ** L.length - 2 ** (L.length - T0.length)}개이다.`,
          facts: { rule: 'atleast-letters' }
        });
      }
      const m = d.int(7, 10), U = rng(1, m), A = someNums(d, 2, 1, m), Bs = someNums(d, d.int(2, 4), 1, m);
      if (cap(A, Bs).length) return null;
      const free = m - Bs.length, ans = 2 ** free - 2 ** (free - A.length);
      return N(`전체집합 U = ${bset(`${X}는 ${m} 이하의 자연수`)}의 세 부분집합 A = ${setH(A)}, B = ${setH(Bs)}, C에 대하여 A∩C ≠ ∅, B∩C = ∅을 만족시키는 집합 C의 개수는?`, ans, {
        explain: `B∩C = ∅이므로 C는 ${wj(listH(Bs), '을/를')} 갖지 않는다. 나머지 원소 ${free}개로 만든 부분집합 2<sup>${free}</sup>개에서 ${wj(listH(A), '을/를')} 모두 갖지 않는 것 2<sup>${free - A.length}</sup>개를 빼면 ${ans}개이다.`,
        facts: { rule: 'atleast-two' }
      });
    }, { count: 2 }),
    T('inc-oddsum', '원소의 합이 홀수인 부분집합의 개수', '②27', (d) => {
      const kind = d.int(0, 1), A = kind ? rng(1, d.int(4, 6)) : divisors(d.pick([8, 16, 12, 18, 20])), h = kind ? setH(A) : bset(`${X}는 ${A[A.length - 1]}의 약수`);
      let cnt = 0;
      for (const s of subsetsOf(A)) if (odd(sum(s))) cnt += 1;
      const od = A.filter(odd), ev = A.filter(even);
      return N(`집합 A = ${h}의 부분집합 가운데 모든 원소의 합이 홀수인 것의 개수는?`, cnt, {
        explain: `합이 홀수이려면 홀수인 원소(${listH(od)})가 홀수 개 들어야 한다. 홀수를 그렇게 고르는 가짓수 ${2 ** (od.length - 1)}에, 짝수인 원소 ${ev.length}개를 넣고 빼는 2<sup>${ev.length}</sup>가지를 곱하면 ${cnt}개이다.`,
        facts: { rule: 'odd-sum' }
      });
    }),
    T('inc-coprime', '서로소 조건 둘로 고르는 부분집합의 개수', '②28', (d) => {
      const top = d.pick([20, 15, 18, 24]), m = d.pick([12, 10, 6, 15]), A = rng(1, top), cop = A.filter((x) => gcd(x, m) === 1);
      const k = d.pick(cop.filter((x) => x > 1 && 2 * x <= top)), avoid = [k, 2 * k], pool = cop.filter((x) => !avoid.includes(x));
      if (!k) return null;
      const ans = 2 ** pool.length - 1;
      return N(`집합 A = ${bset(`${X}는 ${top} 이하의 자연수`)}의 공집합이 아닌 부분집합 X의 모든 원소는 ${josa(m, '과/와')} 서로소이고, X는 집합 ${wj(setH(avoid), '과/와')} 서로소이다. 이를 만족시키는 집합 X의 개수는?`, ans, {
        explain: `${top} 이하의 자연수 가운데 ${josa(m, '과/와')} 서로소인 수는 ${wj(listH(cop), '이다/이다')}. X는 ${josa(k, '을/를')} 갖지 않으므로 ${wj(listH(pool), '의/의')} 공집합이 아닌 부분집합이다. 따라서 2<sup>${pool.length}</sup> ${MINUS} 1 = ${ans}개이다.`,
        facts: { rule: 'coprime-sub' }
      });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 사. 집합의 원소의 개수
  // ════════════════════════════════════════════════════════════════
  // 실생활 두 집합의 말: x, y 와 「~하는」 꼴들
  const LIFE = [
    { x: '축구', y: '농구', vx: '축구를 좋아하는', vy: '농구를 좋아하는', both: '축구와 농구를 모두 좋아하는', either: '축구 또는 농구를 좋아하는', notx: '축구를 좋아하지 않는' },
    { x: '피아노', y: '바이올린', vx: '피아노를 배우는', vy: '바이올린을 배우는', both: '피아노와 바이올린을 모두 배우는', either: '피아노 또는 바이올린을 배우는', notx: '피아노를 배우지 않는' },
    { x: '수학 학원', y: '영어 학원', vx: '수학 학원에 다니는', vy: '영어 학원에 다니는', both: '수학 학원과 영어 학원에 모두 다니는', either: '수학 학원 또는 영어 학원에 다니는', notx: '수학 학원에 다니지 않는' },
    { x: '자전거', y: '킥보드', vx: '자전거를 탈 수 있는', vy: '킥보드를 탈 수 있는', both: '자전거와 킥보드를 모두 탈 수 있는', either: '자전거 또는 킥보드를 탈 수 있는', notx: '자전거를 탈 수 없는' },
    { x: '사과', y: '배', vx: '사과를 좋아하는', vy: '배를 좋아하는', both: '사과와 배를 모두 좋아하는', either: '사과 또는 배를 좋아하는', notx: '사과를 좋아하지 않는' },
    { x: '역사 체험', y: '과학 체험', vx: '역사 체험을 신청한', vy: '과학 체험을 신청한', both: '역사 체험과 과학 체험을 모두 신청한', either: '역사 체험 또는 과학 체험을 신청한', notx: '역사 체험을 신청하지 않은' }
  ];
  const lifeOf = (d) => d.pick(LIFE);
  const cntTypes = [
    T('cnt-formula', '합집합의 원소의 개수 — 셋 가운데 둘을 알 때', '①43', (d) => {
      const nI = d.int(2, 9), nA = nI + d.int(2, 12), nB = nI + d.int(2, 12), nU = nA + nB - nI, kind = d.int(0, 3);
      const all = { A: nA, B: nB, I: nI, U: nU }, label = { A: nOf('A'), B: nOf('B'), I: nOf('A∩B'), U: nOf('A∪B') };
      const ask = ['U', 'I', 'A', 'B'][kind], given = ['A', 'B', 'I', 'U'].filter((k) => k !== ask);
      const calc = { U: `${nA}+${nB}-${nI}`, I: `${nA}+${nB}-${nU}`, A: `${nU}-${nB}+${nI}`, B: `${nU}-${nA}+${nI}` }[ask];
      return N(`두 집합 A, B에 대하여 ${given.map((k) => `${label[k]} = ${all[k]}`).join(', ')}일 때, ${label[ask]}의 값은?`, all[ask], {
        explain: `${nOf('A∪B')} = ${nOf('A')} + ${nOf('B')} ${MINUS} ${nOf('A∩B')}에서 ${label[ask]} = ${all[ask]}이다.`,
        facts: { calc: [[calc, 0]] }
      });
    }),
    T('cnt-life2', '실생활 두 집합 — 공식 한 번', '①44', (d) => {
      const L = lifeOf(d), nI = d.int(2, 9), nA = nI + d.int(3, 12), nB = nI + d.int(3, 12), nU = nA + nB - nI;
      return N(`어느 반 학생 가운데 ${L.vx} 학생은 ${nA}명, ${L.vy} 학생은 ${nB}명, ${L.either} 학생은 ${nU}명이다. ${L.both} 학생은 몇 명인가?`, nI, {
        unit: '명',
        explain: `${L.vx} 학생의 집합을 A, ${L.vy} 학생의 집합을 B라 하면 ${nOf('A∩B')} = ${nOf('A')} + ${nOf('B')} ${MINUS} ${nOf('A∪B')} = ${nA} + ${nB} ${MINUS} ${nU} = ${nI}이다.`,
        facts: { calc: [[`${nA}+${nB}-${nU}`, 0]] }
      });
    }),
    T('cnt-dm', '드모르간의 법칙과 원소의 개수', '②33', (d, n) => {
      const nI = d.int(2, 9), nA = nI + d.int(3, 15), nB = nI + d.int(3, 15), nUn = nA + nB - nI, nU = nUn + d.int(3, 20);
      if (n === 0) return N(`전체집합 U의 두 부분집합 A, B에 대하여 ${nOf('U')} = ${nU}, ${nOf('A')} = ${nA}, ${nOf('B')} = ${nB}, ${nOf('A∩B')} = ${nI}일 때, ${nOf(CU + '∩' + CB)}의 값은?`, nU - nUn, {
        explain: `${CU}∩${CB} = (A∪B)${SUP_C}이고 ${nOf('A∪B')} = ${nA} + ${nB} ${MINUS} ${nI} = ${wj(String(nUn), '이므로/이므로')} ${nOf(CU + '∩' + CB)} = ${nU} ${MINUS} ${nUn} = ${nU - nUn}이다.`,
        facts: { calc: [[`${nU}-(${nA}+${nB}-${nI})`, 0]], rule: 'dm-cap' }
      });
      return N(`전체집합 U의 두 부분집합 A, B에 대하여 ${nOf('U')} = ${nU}, ${nOf('A')} = ${nA}, ${nOf('B')} = ${nB}, ${nOf('A∪B')} = ${nUn}일 때, ${nOf(CU + '∪' + CB)}의 값은?`, nU - nI, {
        explain: `${CU}∪${CB} = (A∩B)${SUP_C}이고 ${nOf('A∩B')} = ${nA} + ${nB} ${MINUS} ${nUn} = ${wj(String(nI), '이므로/이므로')} ${nOf(CU + '∪' + CB)} = ${nU} ${MINUS} ${nI} = ${nU - nI}이다.`,
        facts: { calc: [[`${nU}-(${nA}+${nB}-${nUn})`, 0]], rule: 'dm-cup' }
      });
    }, { count: 2 }),
    T('cnt-back', '여집합의 원소의 개수에서 거꾸로', '②34', (d) => {
      const nI = d.int(2, 12), nA = nI + d.int(3, 15), nB = nI + d.int(3, 15), nUn = nA + nB - nI, nO = d.int(2, 9), nU = nUn + nO, kind = d.int(0, 2);
      const head = `전체집합 U의 두 부분집합 A, B에 대하여 ${nOf('U')} = ${nU}, `, tailG = `${nOf(CU + '∩' + CB)} = ${nO}`;
      if (kind === 0) return N(head + `${nOf('A')} = ${nA}, ${nOf('B')} = ${nB}, ${tailG}일 때, ${nOf('A∩B')}의 값은?`, nI, {
        explain: `${CU}∩${CB} = (A∪B)${SUP_C}이므로 ${nOf('A∪B')} = ${nU} ${MINUS} ${nO} = ${nUn}이다. 따라서 ${nOf('A∩B')} = ${nA} + ${nB} ${MINUS} ${nUn} = ${nI}이다.`,
        facts: { calc: [[`${nA}+${nB}-(${nU}-${nO})`, 0]] }
      });
      if (kind === 1) return N(head + `${nOf('A')} = ${nA}, ${nOf('A∩B')} = ${nI}, ${tailG}일 때, ${nOf('B')}의 값은?`, nB, {
        explain: `${nOf('A∪B')} = ${nU} ${MINUS} ${nO} = ${nUn}이다. ${nUn} = ${nA} + ${nOf('B')} ${MINUS} ${nI}에서 ${nOf('B')} = ${nB}이다.`,
        facts: { calc: [[`${nU}-${nO}-${nA}+${nI}`, 0]] }
      });
      return N(head + `${nOf('A')} = ${nA}, ${nOf('B')} = ${nB}, ${tailG}일 때, ${nOf('A∩' + CB)}의 값은?`, nA - nI, {
        explain: `${nOf('A∪B')} = ${nU} ${MINUS} ${nO} = ${nUn}, ${nOf('A∩B')} = ${nA} + ${nB} ${MINUS} ${nUn} = ${wj(String(nI), '이다/이다')}. A∩${CB} = A−B이므로 ${nA} ${MINUS} ${nI} = ${nA - nI}이다.`,
        facts: { calc: [[`${nA}-(${nA}+${nB}-(${nU}-${nO}))`, 0]] }
      });
    }),
    T('cnt-diff', '차집합의 원소의 개수', '②35', (d, n) => {
      const nI = d.int(2, 12), nA = nI + d.int(3, 15), nB = nI + d.int(3, 15), nUn = nA + nB - nI;
      if (n === 0) return N(`두 집합 A, B에 대하여 ${nOf('A')} = ${nA}, ${nOf('B')} = ${nB}, ${nOf(CU + '∩B')} = ${nB - nI}일 때, ${nOf('A−B')}의 값은?`, nA - nI, {
        explain: `${CU}∩B = B−A이므로 ${nOf('A∩B')} = ${nB} ${MINUS} ${nB - nI} = ${nI}이다. 따라서 ${nOf('A−B')} = ${nA} ${MINUS} ${nI} = ${nA - nI}이다.`,
        facts: { calc: [[`${nA}-(${nB}-${nB - nI})`, 0]], rule: 'diff-ab' }
      });
      if (n === 1) return N(`두 집합 A, B에 대하여 ${nOf('A')} = ${nA}, ${nOf('A∪B')} = ${nUn}, ${nOf('A∩B')} = ${nI}일 때, ${nOf('B−A')}의 값은?`, nB - nI, {
        explain: `B−A의 원소는 A∪B의 원소 가운데 A에 없는 것이므로 ${nOf('B−A')} = ${nOf('A∪B')} ${MINUS} ${nOf('A')} = ${nUn} ${MINUS} ${nA} = ${nB - nI}이다.`,
        facts: { calc: [[`${nUn}-${nA}`, 0]], rule: 'diff-ba' }
      });
      const nO = d.int(1, 9), nU = nUn + nO;
      return N(`전체집합 U의 두 부분집합 A, B에 대하여 ${nOf('U')} = ${nU}, ${nOf('A')} = ${nA}, ${nOf('B')} = ${nB}, ${nOf(CU + '∩B')} = ${nB - nI}일 때, ${nOf(CU + '∩' + CB)}의 값은?`, nO, {
        explain: `${CU}∩B = B−A이므로 ${nOf('A∩B')} = ${nB} ${MINUS} ${nB - nI} = ${nI}, ${nOf('A∪B')} = ${nA} + ${nB} ${MINUS} ${nI} = ${nUn}이다. 따라서 ${nOf(CU + '∩' + CB)} = ${nU} ${MINUS} ${nUn} = ${nO}이다.`,
        facts: { calc: [[`${nU}-(${nA}+${nB}-(${nB}-${nB - nI}))`, 0]], rule: 'diff-out' }
      });
    }, { count: 3 }),
    T('cnt-shade', '벤 다이어그램에서 색칠한 부분의 원소의 개수', '②36', (d) => {
      const nI = d.int(3, 15), nA = nI + d.int(4, 20), nB = nI + d.int(4, 20), nUn = nA + nB - nI, nO = d.int(3, 15), nU = nUn + nO;
      const kind = d.pick(['00', '10', '01']), ans = { '00': nO, 10: nA - nI, '01': nB - nI }[kind];
      const calc = { '00': `${nU}-((${nU}-${nU - nA})+(${nU}-${nU - nB})-${nI})`, 10: `(${nU}-${nU - nA})-${nI}`, '01': `(${nU}-${nU - nB})-${nI}` }[kind];
      return N(`전체집합 U의 두 부분집합 A, B에 대하여 ${nOf('U')} = ${nU}, ${nOf(CU)} = ${nU - nA}, ${nOf(CB)} = ${nU - nB}, ${nOf('A∩B')} = ${nI}일 때, 다음 벤 다이어그램에서 색칠한 부분에 속하는 원소의 개수는?`, ans, {
        figure: venn2({ shade: [kind] }),
        explain: `${nOf('A')} = ${nU} ${MINUS} ${nU - nA} = ${nA}, ${nOf('B')} = ${nU} ${MINUS} ${nU - nB} = ${wj(String(nB), '이다/이다')}. 색칠한 부분은 ${kind === '00' ? `(A∪B)${SUP_C}이고 ${nOf('A∪B')} = ${nA} + ${nB} ${MINUS} ${nI} = ${wj(String(nUn), '이므로/이므로')} ${nU} ${MINUS} ${nUn} = ${nO}` : kind === '10' ? `A−B이므로 ${nA} ${MINUS} ${nI} = ${ans}` : `B−A이므로 ${nB} ${MINUS} ${nI} = ${ans}`}이다.`,
        facts: { calc: [[calc, 0]] }
      });
    }),
    T('cnt-notA', '「~이 아닌」 사람 수로 전체 구하기', '②37', (d) => {
      const L = lifeOf(d), nI = d.int(2, 9), nA = nI + d.int(5, 15), nB = nI + d.int(5, 12), nNotA = d.int(nB - nI + 2, nB - nI + 15), nU = nA + nNotA, ans = nU - (nA + nB - nI);
      return N(`어느 반 학생 가운데 ${L.vx} 학생은 ${nA}명, ${L.vy} 학생은 ${nB}명, ${L.both} 학생은 ${nI}명이고, ${L.notx} 학생은 ${nNotA}명이다. ${L.x}${jo(L.x, '과/와')} ${L.y} 가운데 어느 것에도 해당하지 않는 학생은 몇 명인가?`, ans, {
        unit: '명',
        explain: `반 학생은 ${nA} + ${nNotA} = ${nU}명이다. 두 가지 가운데 하나라도 해당하는 학생은 ${nA} + ${nB} ${MINUS} ${nI} = ${nA + nB - nI}명이므로 어느 것에도 해당하지 않는 학생은 ${nU} ${MINUS} ${nA + nB - nI} = ${ans}명이다.`,
        facts: { calc: [[`${nA}+${nNotA}-(${nA}+${nB}-${nI})`, 0]] }
      });
    }),
    T('cnt-life3', '실생활 두 집합 — 둘 다 아닌 것과 「~만」', '②38', (d) => {
      const L = lifeOf(d), nI = d.int(2, 9), nA = nI + d.int(4, 12), nB = nI + d.int(4, 12), nO = d.int(2, 8), nU = nA + nB - nI + nO, kind = d.int(0, 2);
      const head = `학생 ${nU}명 가운데 `;
      if (kind === 0) return N(head + `${L.vx} 학생은 ${nA}명, ${L.vy} 학생은 ${nB}명이고, 둘 다 해당하지 않는 학생은 ${nO}명이다. ${L.y}에만 해당하는 학생은 몇 명인가?`, nB - nI, {
        unit: '명',
        explain: `하나라도 해당하는 학생은 ${nU} ${MINUS} ${nO} = ${nA + nB - nI}명이다. ${L.y}에만 해당하는 학생은 그 가운데 ${L.x}에 해당하지 않는 학생이므로 ${nA + nB - nI} ${MINUS} ${nA} = ${nB - nI}명이다.`,
        facts: { calc: [[`${nU}-${nO}-${nA}`, 0]], rule: 'only' }
      });
      if (kind === 1) return N(head + `${L.vx} 학생은 ${nA}명, ${L.vy} 학생은 ${nB}명, 둘 다 해당하는 학생은 ${nI}명이다. 둘 다 해당하지 않는 학생은 몇 명인가?`, nO, {
        unit: '명',
        explain: `하나라도 해당하는 학생은 ${nA} + ${nB} ${MINUS} ${nI} = ${nA + nB - nI}명이므로 둘 다 해당하지 않는 학생은 ${nU} ${MINUS} ${nA + nB - nI} = ${nO}명이다.`,
        facts: { calc: [[`${nU}-(${nA}+${nB}-${nI})`, 0]], rule: 'none' }
      });
      return N(head + `${L.vx} 학생은 ${nA}명, ${L.vy} 학생은 ${nB}명이고, 둘 다 해당하지 않는 학생은 ${nO}명이다. 둘 다 해당하는 학생은 몇 명인가?`, nI, {
        unit: '명',
        explain: `하나라도 해당하는 학생은 ${nU} ${MINUS} ${nO} = ${nA + nB - nI}명이므로 둘 다 해당하는 학생은 ${nA} + ${nB} ${MINUS} ${nA + nB - nI} = ${nI}명이다.`,
        facts: { calc: [[`${nA}+${nB}-(${nU}-${nO})`, 0]], rule: 'both' }
      });
    }),
    T('cnt-times', '「몇 배」 조건에서 거꾸로', '②39', (d) => {
      const L = lifeOf(d), k = d.pick([2, 3]), nB = d.int(5, 12), nA = k * nB, nI = d.int(2, nB - 1), nO = d.int(1, 6), nU = nA + nB - nI + nO;
      return N(`학생 ${nU}명 가운데 ${L.x}${jo(L.x, '과/와')} ${L.y}에 모두 해당하는 학생은 ${nI}명, 둘 다 해당하지 않는 학생은 ${nO}명이다. ${L.vx} 학생 수가 ${L.vy} 학생 수의 ${k}배일 때, ${L.vy} 학생은 몇 명인가?`, nB, {
        unit: '명',
        explain: `${L.vy} 학생을 ${V('x')}명이라 하면 ${L.vx} 학생은 ${k}${V('x')}명이다. 하나라도 해당하는 학생은 ${nU} ${MINUS} ${nO} = ${nU - nO}명이므로 ${k}${V('x')} + ${V('x')} ${MINUS} ${nI} = ${nU - nO}, ${V('x')} = ${nB}이다.`,
        facts: { calc: [[`(${nU}-${nO}+${nI})/(${k}+1)`, 0]] }
      });
    }),
    T('cnt-coprime', '배수의 집합으로 세기 — 서로소와 합집합', '②40 심4', (d, n) => {
      const top = d.pick([50, 60, 100, 120]);
      if (n === 0) {
        const [p, q] = d.pick([[2, 5], [2, 3], [3, 5], [2, 7]]), m = p * q, f = (k) => Math.floor(top / k), ans = top - (f(p) + f(q) - f(m));
        return N(`1부터 ${top}까지의 자연수 가운데 ${josa(m, '과/와')} 서로소인 수의 개수는?`, ans, {
          explain: `${josa(m, '과/와')} 서로소인 수는 ${p}의 배수도 ${q}의 배수도 아닌 수이다. ${p}의 배수 ${f(p)}개, ${q}의 배수 ${f(q)}개, ${m}의 배수 ${wj(String(f(m)), '개이므로/개이므로')} ${p} 또는 ${q}의 배수는 ${f(p) + f(q) - f(m)}개이다. 따라서 ${top} ${MINUS} ${f(p) + f(q) - f(m)} = ${ans}개이다.`,
          facts: { calc: [[`${top}-((${top}-${top}%${p})/${p}+(${top}-${top}%${q})/${q}-(${top}-${top}%${m})/${m})`, 0]], derived: [m, p, q], rule: 'coprime' }
        });
      }
      const k = d.pick([3, 5, 7, 9]), odds = top / 2, mk = Math.floor(top / k), both = Math.ceil(mk / 2), ans = odds + mk - both;
      return N(`전체집합 U = ${bset(`${X}는 ${top} 이하의 자연수`)}의 두 부분집합 A = ${bset(`${X}는 홀수`)}, B = ${bset(`${X}는 ${k}의 배수`)}에 대하여 ${nOf('A∪B')}의 값은?`, ans, {
        explain: `${nOf('A')} = ${odds}, ${nOf('B')} = ${mk}이다. A∩B는 홀수인 ${k}의 배수(${k}, ${3 * k}, ${5 * k}, …)의 집합이므로 ${nOf('A∩B')} = ${both}이다. 따라서 ${nOf('A∪B')} = ${odds} + ${mk} ${MINUS} ${both} = ${ans}이다.`,
        facts: { calc: [[`${top}/2+(${top}-${top}%${k})/${k}-${both}`, 0]], derived: [2, both], rule: 'odd-mult' }
      });
    }, { count: 2 }),
    T('cnt-three', '실생활 세 집합 — 한 가지만', '②41', (d) => {
      const nAB = d.int(3, 10), nA = nAB + d.int(3, 10), nB = nAB + d.int(3, 10), none = d.int(1, 5), onlyC = d.int(2, 9), nU = nA + nB - nAB + onlyC + none;
      return N(`학생 ${nU}명에게 세 프로그램 A, B, C의 신청을 받았다. A를 신청한 학생은 ${nA}명, B를 신청한 학생은 ${nB}명, A와 B를 모두 신청한 학생은 ${nAB}명이고, 세 프로그램 가운데 어느 것도 신청하지 않은 학생은 ${none}명이다. C만 신청한 학생은 몇 명인가?`, onlyC, {
        unit: '명',
        explain: `A 또는 B를 신청한 학생은 ${nA} + ${nB} ${MINUS} ${nAB} = ${nA + nB - nAB}명, 적어도 하나를 신청한 학생은 ${nU} ${MINUS} ${none} = ${nU - none}명이다. C만 신청한 학생은 그 차이인 ${nU - none} ${MINUS} ${nA + nB - nAB} = ${onlyC}명이다.`,
        facts: { calc: [[`${nU}-${none}-(${nA}+${nB}-${nAB})`, 0]] }
      });
    }),
    T('cnt-maxmin', '교집합의 원소의 개수의 최댓값과 최솟값', '②42', (d) => {
      const L = lifeOf(d), nU = d.int(25, 40), nA = d.int(Math.floor(nU / 2), nU - 3), nB = d.int(Math.max(nU - nA + 2, 8), nU - 2);
      const mx = Math.min(nA, nB), mn = nA + nB - nU;
      if (mn <= 0 || mx === mn) return null;
      return M(`학생 ${nU}명 가운데 ${L.vx} 학생은 ${nA}명, ${L.vy} 학생은 ${nB}명이다. ${L.both} 학생 수의 최댓값과 최솟값은?`, [{ answer: mx, lead: '최댓값', unit: '명' }, { answer: mn, lead: '최솟값', unit: '명' }], {
        shown: `최댓값 ${mx}명, 최솟값 ${mn}명`,
        explain: `${nOf('A∩B')} = ${nA} + ${nB} ${MINUS} ${nOf('A∪B')}이다. A∪B = U일 때 가장 작아 ${nA} + ${nB} ${MINUS} ${nU} = ${mn}, 한쪽이 다른 쪽에 포함될 때 가장 커 ${mx}이다.`,
        facts: { calc: [[String(mx), 0], [`${nA}+${nB}-${nU}`, 1]] }
      });
    })
  ];

  B.addGroup(UNIT, { id: 'diff', title: '여집합과 차집합', standard: S3, types: diffTypes });
  B.addGroup(UNIT, { id: 'demorgan', title: '드모르간의 법칙', standard: S3, types: dmTypes });
  B.addGroup(UNIT, { id: 'cond', title: '집합의 연산과 포함 관계', standard: S3, types: xTypes });
  B.addGroup(UNIT, { id: 'count', title: '집합의 원소의 개수', standard: S3, types: cntTypes });
})(typeof window !== 'undefined' ? window : globalThis);
