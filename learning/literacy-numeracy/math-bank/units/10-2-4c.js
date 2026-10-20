// 고등학교 1학년 2학기(공통수학2) Ⅱ-1 집합 — 실력 문항.
// 단원 틀과 도구(B.kit.m1024)는 10-2-4a.js 에 있다. 실력은 ① 배운 뜻을 정확히 대야 풀리는 함정 문제 ② 세 단계 넘게 잇는 문제만 싣는다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 원소와 부분집합: {a}가 원소로 든 집합에서는 {a} ∈ A이면서 {a} ⊂ A일 수도 있다. ∅은 모든 집합의 부분집합이지만, 원소인지는 그 집합에 따라 다르다.
//  - 공집합: 원소가 없는 모임도 집합이다(∅). {0}과 {∅}은 원소가 하나인 집합이다(n = 1).
//  - 배수의 집합 A_k: 큰 수의 배수의 집합이 작은 수의 배수의 집합에 포함된다(A_12 ⊂ A_3). 크기가 거꾸로다.
//  - 여집합을 씌우면 포함 관계가 뒤집힌다(A ⊂ B이면 B^C ⊂ A^C). B^C − A^C = A − B.
//  - 차집합의 원소의 개수는 n(A) − n(B)가 아니라 n(A) − n(A∩B)이다.
//  - 「적어도 하나」는 전체에서 「하나도 없는 것」을 뺀다. 교집합의 개수가 가장 클 때·작을 때의 포함 관계를 바로 댄다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, lines, N, M, C } = B.kit;
  const { MINUS, gcd, lcm, range, nb, V, tag, rt } = B.kit.mid;
  const K = B.kit.m1024;
  const { UNIT, S2, S3, S1, HAN, CIR, X, va, vb, sT, rng, odd, even, SUP_C, H, jo, wj, S, cup, cap, sub, same, inside, keyOf, divisors, isPrime, primesTo, subsetsOf,
    sum, elH, listH, setH, bset, nOf, comp, choose, combo, setChoice, exH, exN, exVal, regionsOf, sameEx, pickN, someNums, linH, solveS, valsQ } = K;
  const pow2 = (k) => (k === 0 ? '1' : Array(k).fill('2').join('*'));
  const CU = comp('A'), CB = comp('B');
  const U3 = [1, 2, 3], PAIRS = (() => { const subs = subsetsOf(U3), out = []; for (const a of subs) for (const b of subs) out.push({ U: U3, A: a, B: b }); return out; })();

  // ── 집합이 원소인 집합: 원소는 수·영문자(낱말) 또는 집합 { s: [원소…] } ──
  const tkey = (t) => (t && t.s ? '{' + [...new Set(t.s.map(tkey))].sort().join(',') + '}' : typeof t === 'number' ? 'n' + t : 'l' + t);
  const tH = (t) => (t && t.s ? (t.s.length ? '{' + t.s.map(tH).join(', ') + '}' : '∅') : elH(t));
  const set = (...xs) => ({ s: xs }), EMPTY = set();
  const isIn = (x, A) => A.s.some((y) => tkey(y) === tkey(x));
  const isSub = (Xs, A) => Xs.s.every((y) => isIn(y, A));
  const card = (A) => new Set(A.s.map(tkey)).size;

  const hardTypes = [
    H('hard-elemset', '집합을 원소로 갖는 집합', '①5', (d) => {
      const a = 'a', bb = 'b';
      const TEMPL = [[EMPTY, a, set(a)], [1, set(1), set(1, 2)], [EMPTY, 0, set(0)], [a, bb, set(a, bb)], [1, 2, set(1, 2)], [EMPTY, set(EMPTY), 1]];
      const A = set(...d.pick(TEMPL));
      const atoms = [...new Set(A.s.filter((t) => !t.s).concat(A.s.flatMap((t) => (t.s ? t.s.filter((u) => !u.s) : []))))];
      const cands = [EMPTY, set(EMPTY)].concat(atoms, atoms.map((t) => set(t)), A.s.filter((t) => t.s).map((t) => set(t)));
      const rows = [];
      for (const x of cands) {
        rows.push([nb(`${tH(x)} ∈ A`), isIn(x, A)]);
        if (x.s) rows.push([nb(`${tH(x)} ⊂ A`), isSub(x, A)]);
      }
      rows.push([nb(`${nOf('A')} = ${card(A)}`), true], [nb(`${nOf('A')} = ${card(A) + 1}`), false]);
      // 「옳지 않은 것」을 물으면 옳은 문장 넷과 옳지 않은 문장 하나, 「옳은 것」을 물으면 그 거꾸로
      const uniq = [...new Map(rows.map((r) => [r[0], r])).values()], wantFalse = d.bool();
      const pick = d.shuffle(uniq.filter((r) => r[1] === wantFalse)), lone = d.pick(uniq.filter((r) => r[1] !== wantFalse));
      if (pick.length < 4 || !lone) return null;
      const opts = pick.slice(0, 4).map((r) => [r[0], false]).concat([[lone[0], true]]);
      return choose(d, `집합 A = ${tH(A)}에 대하여 다음 중 ${wantFalse ? '옳지 않은' : '옳은'} 것은?`, opts, {
        explain: `A의 원소는 ${A.s.map(tH).join(', ')}의 ${card(A)}개이다. 원소인지는 A 안에 그대로 적혀 있는지로, 부분집합인지는 그 집합의 원소가 모두 A의 원소인지로 가린다. 따라서 ${wantFalse ? '옳지 않은' : '옳은'} 것은 ${lone[0]}이다.`,
        facts: { rule: wantFalse ? 'elemset-false' : 'elemset-true' }
      });
    }, { standard: S1 }),
    H('hard-empty', '공집합과 {0}, {∅}에 대한 문장', '①12', (d) => {
      const POOL = [
        [`${nOf('∅')} = 0`, card(EMPTY) === 0], [`${nOf('{0}')} = 1`, card(set(0)) === 1], [`${nOf('{0}')} = 0`, card(set(0)) === 0], [`${nOf('{∅}')} = 1`, card(set(EMPTY)) === 1],
        [`${nOf('{∅}')} = 0`, card(set(EMPTY)) === 0], ['∅ ∈ {∅}', isIn(EMPTY, set(EMPTY))], ['∅ ⊂ {∅}', isSub(EMPTY, set(EMPTY))], ['{0} = ∅', tkey(set(0)) === tkey(EMPTY)], ['0 ∈ ∅', isIn(0, EMPTY)],
        [`${nOf('{∅, {∅}}')} = 2`, card(set(EMPTY, set(EMPTY))) === 2], [`${nOf('{{1, 2}}')} = 2`, card(set(set(1, 2))) === 2], ['{∅} = ∅', tkey(set(EMPTY)) === tkey(EMPTY)],
        [`${bset(`${X}<sup>2</sup> = 2, ${X}는 유리수`)} = ∅`, true], [`${nOf(bset(`${X}<sup>2</sup> = 0`))} = 1`, true]
      ].map(([h, v]) => [nb(h), v]);
      const rows = d.shuffle(POOL).slice(0, 4);
      if (rows.every((r) => r[1]) || rows.every((r) => !r[1])) return null;
      return combo(d, '다음 보기에서 옳은 것을 모두 고른 것은?', rows, {
        explain: `∅은 원소가 하나도 없는 집합이다. {0}, {∅}은 각각 0, ∅이라는 원소 하나를 갖는 집합이므로 공집합이 아니고 원소의 개수는 1이다. 제곱하여 2가 되는 유리수는 없으므로 그 모임은 공집합(집합)이다. 옳은 것은 ${HAN.slice(0, 4).filter((_, i) => rows[i][1]).join(', ')}이다.`
      });
    }, { standard: S1 }),
    H('hard-mfun', '새 기호 m(X) = n(X^C)의 성질', '①21', (d) => {
      const m = (s) => V('m') + '(' + s + ')';
      const nm = (env, s) => env.U.length - s.length;
      const POOL = [
        [`${m('U')} = 0`, (v) => nm(v, v.U) === 0], [`${m('∅')} = ${nOf('U')}`, (v) => nm(v, []) === v.U.length], [`${m('A')} ≤ ${m('A∩B')}`, (v) => nm(v, v.A) <= nm(v, cap(v.A, v.B))],
        [`${m('A∪B')} ≤ ${m('A')}`, (v) => nm(v, cup(v.A, v.B)) <= nm(v, v.A)], [`${m('A∪B')} = ${m('A')} + ${m('B')} ${MINUS} ${m('A∩B')}`, (v) => nm(v, cup(v.A, v.B)) === nm(v, v.A) + nm(v, v.B) - nm(v, cap(v.A, v.B))],
        [`${m('A')} + ${nOf('A')} = ${nOf('U')}`, (v) => nm(v, v.A) + v.A.length === v.U.length], [`${m('A')} ≤ ${m('A∪B')}`, (v) => nm(v, v.A) <= nm(v, cup(v.A, v.B))],
        [`${m('A∩B')} ≤ ${m('A')}`, (v) => nm(v, cap(v.A, v.B)) <= nm(v, v.A)], [`${m('A∪B')} = ${m('A')} + ${m('B')}`, (v) => nm(v, cup(v.A, v.B)) === nm(v, v.A) + nm(v, v.B)],
        [`${m('A∩B')} = ${m('A')} + ${m('B')} ${MINUS} ${m('A∪B')}`, (v) => nm(v, cap(v.A, v.B)) === nm(v, v.A) + nm(v, v.B) - nm(v, cup(v.A, v.B))]
      ].map(([h, f]) => [nb(h), PAIRS.every(f)]);
      const rows = d.shuffle(POOL).slice(0, 3);
      if (rows.every((r) => !r[1])) return null;
      return combo(d, `전체집합 U = {1, 2, 3, 4, 5, 6}의 부분집합 X에 대하여 ${m('X')}를 ${comp('X')}의 원소의 개수라 하자. 전체집합 U의 두 부분집합 A, B에 대하여 다음 보기에서 항상 옳은 것을 모두 고른 것은?`, rows, {
        explain: `${m('X')} = ${nOf('U')} ${MINUS} ${nOf('X')}이므로 X가 클수록 ${m('X')}는 작다. A∩B ⊂ A ⊂ A∪B이므로 ${m('A∪B')} ≤ ${m('A')} ≤ ${m('A∩B')}이다. 또 (A∪B)${SUP_C} = ${CU}∩${CB}, (A∩B)${SUP_C} = ${CU}∪${CB}이므로 여집합의 원소의 개수에도 합집합의 원소의 개수의 식이 그대로 성립한다. 옳은 것은 ${HAN.slice(0, 3).filter((_, i) => rows[i][1]).join(', ')}이다.`
      });
    }),
    H('hard-chain', '절댓값 범위의 집합의 포함 사슬', '①35', (d) => {
      const p = d.int(-3, 0), q = d.int(1, 4), c = d.pick([-2, -1, 1, 2, 3].filter((x) => x !== 0)), m1 = Math.max(-p, q), m2 = m1 + Math.abs(c);
      if (p === -q) return null;
      const cH = c > 0 ? `|${X} ${MINUS} ${c}|` : `|${X} + ${-c}|`;
      return M(`세 집합 A = {${sT(p)}, ${q}}, B = ${bset(`|${X}| ≤ ${va}`)}, C = ${wj(bset(`${cH} ≤ ${vb}`), '에/에')} 대하여 A ⊂ B ⊂ C가 성립하도록 하는 양수 ${va}의 최솟값을 ${V('m')}<sub>1</sub>, ${va} = ${V('m')}<sub>1</sub>일 때 양수 ${vb}의 최솟값을 ${V('m')}<sub>2</sub>라 하자. ${V('m')}<sub>1</sub>, ${V('m')}<sub>2</sub>의 값은?`,
        [{ answer: m1, lead: V('m') + '<sub>1</sub> =' }, { answer: m2, lead: V('m') + '<sub>2</sub> =' }], {
          shown: `${V('m')}<sub>1</sub> = ${m1}, ${V('m')}<sub>2</sub> = ${m2}`,
          explain: `B = ${bset(`${MINUS}${va} ≤ ${X} ≤ ${va}`)}가 ${sT(p)}, ${josa(q, '을/를')} 모두 가지려면 ${va} ≥ ${m1}이므로 ${V('m')}<sub>1</sub> = ${m1}이다. 이때 B = ${bset(`${MINUS}${m1} ≤ ${X} ≤ ${m1}`)}이고 C = ${wj(bset(`${sT(c)} ${MINUS} ${vb} ≤ ${X} ≤ ${sT(c)} + ${vb}`), '이므로/이므로')} B ⊂ C이려면 ${sT(c)} ${MINUS} ${vb} ≤ ${MINUS}${m1}, ${sT(c)} + ${vb} ≥ ${m1}이다. 곧 ${vb} ≥ ${m2}이므로 ${V('m')}<sub>2</sub> = ${m2}이다.`,
          facts: { calc: [[String(m1), 0], [`${m1}+${Math.abs(c)}`, 1]], derived: [m1, m2] }
        });
    }, { standard: S2 }),
    H('hard-eqop', '연산 조건에서 A = B를 끌어내 미지수 구하기', '①32', (d) => {
      const k = d.int(2, 5), s = d.int(-3, 3), t = d.int(-3, 4), x0 = s - k, v = x0 * x0 + x0 + 1, y0 = v - t;
      if ([k, -k].includes(v) || y0 === 0 || t === 0 || s === 0) return null;
      const eH = (str, c) => (c === 0 ? str : str + (c > 0 ? ' + ' + c : ' ' + MINUS + ' ' + -c));
      const sx = (s > 0 ? String(s) : MINUS + -s) + ' ' + MINUS + ' ' + X;
      return valsQ(`실수 전체의 집합의 두 부분집합 A = {${MINUS}${k}, ${sx}, ${eH(V('y'), t)}}, B = {${k}, ${eH(X, -s)}, ${X}<sup>2</sup> + ${X} + 1}에 대하여 A∪B = A, A∩${CB} = ∅이 성립할 때, 상수 ${X}, ${V('y')}의 값은?`, [['x', x0], ['y', y0]], {
        explain: `A∪B = A에서 B ⊂ A, A∩${CB} = A−B = ∅에서 A ⊂ B이므로 A = B이다. ${MINUS}${k} ∈ B인데 ${X}<sup>2</sup> + ${X} + 1 = (${X} + ${frac2()})<sup>2</sup> + ${frac34()} &gt; 0이므로 ${eH(X, -s)} = ${MINUS}${k}, 곧 ${X} = ${sT(x0)}이다. 그러면 A = {${MINUS}${k}, ${k}, ${eH(V('y'), t)}}, B = {${k}, ${MINUS}${k}, ${v}}이므로 ${eH(V('y'), t)} = ${v}, 곧 ${V('y')} = ${sT(y0)}이다.`,
        facts: { calc: [[`${s < 0 ? '(' + s + ')' : s}-${k}`, 0], [`(${s < 0 ? '(' + s + ')' : s}-${k})*(${s < 0 ? '(' + s + ')' : s}-${k})+(${s < 0 ? '(' + s + ')' : s}-${k})+1-(${t})`, 1]] }
      });
    }),
    H('hard-ident', '세 집합의 연산 등식 — 참·거짓', '②17', (d) => {
      const NM = ['A', 'B', 'C'];
      const POOL = [
        [['i', 'A', ['c', ['i', 'A', 'B']]], ['d', 'A', 'B']], [['u', ['d', 'A', 'C'], ['d', 'B', 'C']], ['d', ['u', 'A', 'B'], 'C']], [['u', ['d', 'A', 'B'], ['d', 'A', 'C']], ['d', 'A', ['i', 'B', 'C']]],
        [['d', 'A', ['u', 'B', 'C']], ['i', ['d', 'A', 'B'], ['d', 'A', 'C']]], [['d', ['d', 'A', 'B'], 'C'], ['d', 'A', ['u', 'B', 'C']]], [['u', 'A', ['i', ['c', 'A'], 'B']], ['u', 'A', 'B']],
        [['d', ['d', 'A', 'B'], 'C'], ['d', 'A', ['d', 'B', 'C']]], [['d', 'A', ['i', 'B', 'C']], ['i', ['d', 'A', 'B'], ['d', 'A', 'C']]], [['d', ['u', 'A', 'B'], 'C'], ['u', 'A', ['d', 'B', 'C']]],
        [['u', ['d', 'A', 'B'], 'B'], 'A'], [['d', 'A', ['d', 'A', 'B']], 'B'], [['i', 'A', ['d', 'B', 'C']], ['d', ['i', 'A', 'B'], ['i', 'A', 'C']]]
      ].map(([l, r]) => [nb(exH(l) + ' = ' + exH(r)), sameEx(l, r, NM), l, r]);
      const rows = d.shuffle(POOL).slice(0, 3);
      if (rows.every((r) => r[1]) || rows.every((r) => !r[1])) return null;
      return combo(d, '전체집합 U의 세 부분집합 A, B, C에 대하여 다음 보기에서 항상 옳은 것을 모두 고른 것은?', rows.map((r) => [r[0], r[1]]), {
        explain: `차집합 X−Y를 X∩Y${SUP_C} 꼴로 고쳐 분배법칙·드모르간의 법칙으로 정리하거나, 벤 다이어그램의 칸마다 두 식에 드는지를 견주어 본다. ${rows.map((r, i) => `${HAN[i]}${r[1] ? '은 두 식이 같은 칸을 나타내므로 옳다' : '은 ' + (diffRegion(r[2], r[3], NM)) + '에서 두 식이 다르므로 옳지 않다'}`).join('. ')}.`
      });
    }),
    H('hard-bcac', 'B^C − A^C = A − B로 바꾸어 B의 개수 세기', '②18', (d) => {
      const m = d.int(6, 8), U = rng(1, m), A = someNums(d, d.int(3, 4), 1, m), P = S(pickN(d, A, A.length - d.int(1, 2))), free = m - A.length;
      if (!P.length || P.length === A.length) return null;
      return N(`전체집합 U = ${setH(U)}의 두 부분집합 A, B에 대하여 (A∩B)∪A = ${setH(A)}, ${CB} ${MINUS} ${CU} = ${wj(setH(P), '일/일')} 때, 집합 B의 개수는?`, 2 ** free, {
        explain: `A∩B ⊂ A이므로 (A∩B)∪A = A = ${setH(A)}이다. ${CB} ${MINUS} ${CU} = ${CB}∩(${CU})${SUP_C} = A∩${CB} = A−B = ${wj(setH(P), '이므로/이므로')} B는 ${wj(listH(sub(A, P)), '을/를')} 갖고 ${wj(listH(P), '은/는')} 갖지 않는다. A 밖의 원소 ${free}개는 들어도 안 들어도 되므로 2<sup>${free}</sup> = ${2 ** free}개이다.`,
        facts: { calc: [[pow2(free), 0]], derived: [2] }
      });
    }),
    H('hard-divisor', '연산식을 간단히 하여 약수의 집합 세기', '②21', (d) => {
      const nn = d.pick([12, 18, 20, 24, 30, 36, 40]), FORMS = [
        [`{(A∩B)∪(A−B)}∪B = A`, 'A∪B = A', 'B ⊂ A'], [`{(A∪B)∩(A∪${CB})}∪B = A`, 'A∪B = A', 'B ⊂ A'], [`{(A∩B)∪(A−B)}∩B = B`, 'A∩B = B', 'B ⊂ A']
      ];
      const [hh, simp, rel] = d.pick(FORMS), cnt = divisors(nn).length;
      return N(`두 집합 A = ${bset(`${X}는 ${nn}의 양의 약수`)}, B = ${wj(bset(`${V('y')}는 ${va}의 양의 약수`, V('y')), '에/에')} 대하여 ${hh}가 성립하도록 하는 자연수 ${va}의 개수는?`, cnt, {
        explain: `(A∩B)∪(A−B) = (A∩B)∪(A∩${CB}) = A∩(B∪${CB}) = A이다(둘째 식도 분배법칙으로 A). 따라서 주어진 식은 ${simp}, 곧 ${rel}이다. ${va}의 양의 약수가 모두 ${nn}의 양의 약수이려면 ${va}가 ${nn}의 약수이면 되므로 ${va}의 개수는 ${nn}의 약수의 개수 ${cnt}이다.`,
        facts: { rule: 'divisor-count' }
      });
    }),
    H('hard-prod', '원소의 곱이 p의 배수이지만 p²의 배수는 아닌 부분집합', '②29', (d) => {
      const [n, p] = d.pick([[6, 3], [8, 3], [6, 2], [10, 5], [7, 2], [9, 2]]), A = rng(1, n);
      let cnt = 0;
      for (const s of subsetsOf(A)) { if (s.length < 2) continue; const pr = s.reduce((x, y) => x * y, 1); if (pr % p === 0 && pr % (p * p) !== 0) cnt += 1; }
      const once = A.filter((x) => x % p === 0 && x % (p * p) !== 0), twice = A.filter((x) => x % (p * p) === 0), free = A.filter((x) => x % p !== 0);
      return N(`집합 A = ${setH(A)}의 부분집합 가운데 원소가 2개 이상이고, 모든 원소의 곱이 ${p}의 배수이지만 ${p * p}의 배수는 아닌 집합의 개수는?`, cnt, {
        explain: `곱이 ${p}의 배수이지만 ${p * p}의 배수가 아니려면 ${josa(p, '을/를')} 꼭 한 번만 인수로 가져야 한다. 그러므로 ${listH(once)} 가운데 하나만 갖고${twice.length ? ', ' + wj(listH(twice), '은/는') + ' 갖지 않으며' : ''}, ${p}의 배수가 아닌 ${wj(listH(free), '을/를')} 적어도 하나 더 가져야 한다(원소가 2개 이상). 따라서 ${once.length} × (2<sup>${free.length}</sup> ${MINUS} 1) = ${cnt}개이다.`,
        facts: { calc: [[`${once.length}*(${pow2(free.length)}-1)`, 0]], derived: [once.length, 2] }
      });
    }),
    H('hard-minel', '가장 작은 원소가 정해진 부분집합의 개수에서 거꾸로', '②30', (d) => {
      const s = d.pick([4, 6, 8]), j = d.int(3, 5), nA = s / 2 + j, kmax = 2 * nA + 1, cnt = 2 ** j;
      return N(`집합 A = ${bset(`${X}는 ${V('k')} 이하의 짝수`)}의 부분집합 가운데 가장 작은 원소가 ${s}인 것의 개수가 ${cnt}일 때, 자연수 ${V('k')}의 최댓값은? (단, ${V('k')} ≥ ${s})`, kmax, {
        explain: `가장 작은 원소가 ${s}이려면 ${wj(listH(rng(1, s - 1).filter(even)), '은/는')} 갖지 않고 ${josa(s, '은/는')} 갖는다. 나머지 원소로 만드는 부분집합이 ${cnt} = 2<sup>${j}</sup>개이므로 A의 원소는 ${s / 2 - 1} + 1 + ${j} = ${nA}개이다. ${V('k')} 이하의 짝수가 ${nA}개인 자연수 ${V('k')}는 ${2 * nA}, ${kmax}이므로 최댓값은 ${kmax}이다.`,
        facts: { rule: 'min-element' }
      });
    }, { standard: S2 }),
    H('hard-pair', '「n ∈ A이면 m/n ∈ A」인 집합의 개수', '②31', (d) => {
      const m = d.pick([15, 16, 12, 18, 36, 20, 9, 25]), dv = divisors(m), classes = new Set(dv.map((x) => Math.min(x, m / x))), cnt = 2 ** classes.size - 1;
      return N(`다음 조건을 만족시키는 공집합이 아닌 집합 A의 개수는?`, cnt, {
        figure: lines([tag('㈎') + '집합 A의 모든 원소는 자연수이다.', tag('㈏') + nb(`${V('n')} ∈ A이면 ${fracH(m)} ∈ A이다.`)]),
        explain: `${fracH(m)}${jo(fracH(m), '이/가')} 자연수이려면 ${V('n')}은 ${m}의 약수 ${wj(listH(dv), '이어야/이어야')} 한다. ${V('n')}과 ${fracH(m)}${jo(fracH(m), '은/는')} 짝으로 함께 들어야 하므로 묶음은 ${[...classes].map((c) => '{' + S([c, m / c]).join(', ') + '}').join(', ')}의 ${classes.size}개이다. 묶음마다 넣거나 빼고 공집합을 빼면 2<sup>${classes.size}</sup> ${MINUS} 1 = ${cnt}개이다.`,
        facts: { rule: 'pairs' }
      });
    }, { standard: S2 }),
    H('hard-choose', 'n(A∩B) = k인 집합 B의 개수', '②32', (d) => {
      const m = d.int(6, 8), U = rng(1, m), A = S(pickN(d, U, d.int(3, 4))), k = d.int(1, A.length - 1);
      let cnt = 0;
      for (const s of subsetsOf(U)) if (cap(s, A).length === k) cnt += 1;
      const ways = subsetsOf(A).filter((s) => s.length === k).length;
      return N(`전체집합 U = ${bset(`${X}는 ${m} 이하의 자연수`)}의 두 부분집합 A, B에 대하여 A = ${wj(setH(A), '일/일')} 때, ${nOf('A∩B')} = ${josa(k, '을/를')} 만족시키는 집합 B의 개수는?`, cnt, {
        explain: `B는 A의 원소 가운데 꼭 ${k}개를 가져야 한다. A의 원소 ${A.length}개에서 ${k}개를 고르는 가짓수는 ${ways}이고, A 밖의 원소 ${m - A.length}개는 들어도 안 들어도 되므로 2<sup>${m - A.length}</sup>가지이다. 따라서 ${ways} × ${2 ** (m - A.length)} = ${cnt}개이다.`,
        facts: { rule: 'choose-k' }
      });
    }, { standard: S2 }),
    H('hard-max', '「둘 다 아닌」·한 집합의 원소의 개수의 최댓값과 최솟값', '②43', (d, n) => {
      if (n === 0) {
        const nU = d.int(40, 60), nA = d.int(15, 30), nB = d.int(12, 25);
        if (nA + nB >= nU || nA === nB) return null;
        const mx = nU - Math.max(nA, nB), mn = nU - (nA + nB);
        return M(`${nU}명을 대상으로 두 제품 A, B를 좋아하는지 조사하였더니 A를 좋아하는 사람은 ${nA}명, B를 좋아하는 사람은 ${nB}명이었다. 두 제품을 모두 좋아하지 않는 사람 수의 최댓값과 최솟값은?`, [{ answer: mx, lead: '최댓값', unit: '명' }, { answer: mn, lead: '최솟값', unit: '명' }], {
          shown: `최댓값 ${mx}명, 최솟값 ${mn}명`,
          explain: `두 제품을 모두 좋아하지 않는 사람은 ${nU} ${MINUS} ${nOf('A∪B')}명이다. ${nOf('A∪B')}는 한쪽이 다른 쪽에 포함될 때 가장 작아 ${Math.max(nA, nB)}, 서로소일 때 가장 커 ${nA} + ${nB} = ${nA + nB}이다. 따라서 최댓값은 ${nU} ${MINUS} ${Math.max(nA, nB)} = ${mx}, 최솟값은 ${nU} ${MINUS} ${nA + nB} = ${mn}이다.`,
          facts: { calc: [[`${nU}-${Math.max(nA, nB)}`, 0], [`${nU}-${nA}-${nB}`, 1]], rule: 'none-range' }
        });
      }
      const nU = d.int(40, 60), nA = d.int(25, nU - 6), g = d.int(nU - nA + 3, nU - 5), onlyA = nU - g, both = nA - onlyA, mx = g, mn = both;
      if (both <= 0 || mx === mn) return null;
      return M(`학생 ${nU}명 가운데 지하철로 통학하는 학생은 ${nA}명, 「지하철로 통학하지 않거나 버스로 통학하는」 학생은 ${g}명이다. 버스로 통학하는 학생 수의 최댓값과 최솟값은?`, [{ answer: mx, lead: '최댓값', unit: '명' }, { answer: mn, lead: '최솟값', unit: '명' }], {
        shown: `최댓값 ${mx}명, 최솟값 ${mn}명`,
        explain: `지하철·버스로 통학하는 학생의 집합을 A, B라 하면 ${nOf(CU + '∪B')} = ${g}이고 (${CU}∪B)${SUP_C} = A∩${CB}이므로 ${nOf('A−B')} = ${nU} ${MINUS} ${g} = ${onlyA}, ${nOf('A∩B')} = ${nA} ${MINUS} ${onlyA} = ${both}이다. B는 A∩B를 꼭 포함하고 A 밖의 ${nU - nA}명 가운데 몇 명을 더 가질 수 있으므로 최솟값은 ${both}, 최댓값은 ${both} + ${nU - nA} = ${mx}이다.`,
        facts: { calc: [[`${nA}-(${nU}-${g})+(${nU}-${nA})`, 0], [`${nA}-(${nU}-${g})`, 1]], rule: 'bus-range' }
      });
    }, { count: 2 }),
    H('hard-prodsum', '두 집합의 원소의 합의 곱의 최댓값', '②44', (d) => {
      const m = d.int(5, 6), U = rng(1, m), I = S(pickN(d, U, m - 2)), R = sub(U, I);
      let best = -1;
      for (let mask = 0; mask < 4; mask += 1) { const A = cup(I, R.filter((_, i) => mask & (1 << i))), Bv = cup(I, R.filter((_, i) => !(mask & (1 << i)))); best = Math.max(best, sum(A) * sum(Bv)); }
      const cases = [0, 1, 2, 3].map((mask) => { const A = cup(I, R.filter((_, i) => mask & (1 << i))), Bv = cup(I, R.filter((_, i) => !(mask & (1 << i)))); return `${sum(A)} × ${sum(Bv)} = ${sum(A) * sum(Bv)}`; });
      return N(`전체집합 U = ${setH(U)}의 두 부분집합 A, B가 A∪B = U, A∩B = ${wj(setH(I), '을/를')} 만족시킨다. 집합 A의 모든 원소의 합을 ${va}, 집합 B의 모든 원소의 합을 ${vb}라 할 때, ${va}${vb}의 최댓값은?`, best, {
        explain: `A∩B = ${wj(setH(I), '이므로/이므로')} 나머지 원소 ${wj(listH(R), '은/는')} A와 B 가운데 한쪽에만 든다. 네 경우의 ${va}${vb}는 ${cases.join(', ')}이므로 최댓값은 ${best}이다.`,
        facts: { rule: 'prod-max' }
      });
    }),
    H('hard-maxA', 'A의 원소가 가장 많을 때 B', '②45', (d) => {
      const m = d.int(8, 10), U = rng(1, m), [p, q] = S(pickN(d, rng(2, m), 2)), k = d.pick([6, 8, 9, 10, 12].filter((x) => x <= m && !divisors(x).includes(p) && !divisors(x).includes(q)));
      if (!k) return null;
      const S1 = [p, q], S2 = divisors(k).filter((x) => x <= m), R = sub(sub(U, S1), S2), Bs = cup(S1, R);
      if (cap(S1, S2).length || !R.length) return null;
      return setChoice(d, `전체집합 U = ${bset(`${X}는 ${m} 이하의 자연수`)}의 두 부분집합 A, B에 대하여 ${CU}∩(A∪B) = ${bset(`${K.rootsH(p, q)} = 0`)}, A − (A∩B) = ${wj(bset(`${X}는 ${k}의 약수`), '이다/이다')}. 집합 A의 원소의 개수가 가장 클 때, 집합 B는?`, Bs, [S1, cup(S1, S2), sub(U, S2), R, cup(R, S2)], {
        explain: `${CU}∩(A∪B) = B−A = ${setH(S1)}, A − (A∩B) = A−B = ${wj(setH(S2), '이다/이다')}. 남은 원소 ${wj(listH(R), '은/는')} A∩B에 들거나 두 집합 밖에 있다. A의 원소가 가장 많으려면 모두 A∩B에 들어야 하므로 B = (B−A)∪(A∩B) = ${setH(Bs)}이다.`
      });
    }),
    H('hard-three', '세 집합 — 한 가지만 해당하는 원소의 개수', '②41', (d) => {
      const x = d.int(8, 20), y = d.int(5, 15), only = d.int(3, 12), T0 = x + y + only;
      return N(`어느 모임의 회원 ${T0}명은 세 나라 A, B, C 가운데 적어도 한 나라를 여행하였다. A와 B를 모두 여행한 회원은 ${x}명, B와 C를 모두 여행한 회원은 ${y}명이고, C와 A를 모두 여행한 회원은 없다. 세 나라 가운데 한 나라만 여행한 회원은 몇 명인가?`, only, {
        unit: '명',
        explain: `C와 A를 모두 여행한 회원이 없으므로 세 나라를 모두 여행한 회원도 없다. 그러므로 두 나라를 여행한 회원은 A와 B만 ${x}명, B와 C만 ${y}명이고, 나머지는 한 나라만 여행하였다. 따라서 ${T0} ${MINUS} ${x} ${MINUS} ${y} = ${only}명이다.`,
        facts: { calc: [[`${T0}-${x}-${y}`, 0]] }
      });
    }),
    H('hard-quad', '방정식의 해의 집합이 부분집합일 때 양수 a', '심2', (d) => {
      const p = d.int(2, 9), q = -d.int(1, 6);
      const ok = (a) => S([p, a]).every((x) => [q, p].includes(x));
      const sols = [p, q, -p, -q, 0].filter((a) => a > 0 && ok(a));
      if (sols.length !== 1) return null;
      return N(`두 집합 A = ${bset(`(${X} ${MINUS} ${p})(${X} ${MINUS} ${va}) = 0`)}, B = {${sT(q)}, ${p}}에 대하여 A ⊂ B를 만족시키는 양수 ${va}의 값은?`, p, {
        explain: `${va} ∈ A이므로 ${va} ∈ B, 곧 ${va} = ${sT(q)} 또는 ${va} = ${p}이다. ${va}는 양수이므로 ${va} = ${p}이고, 이때 A = {${p}}(같은 해는 한 번만 쓴다)이므로 A ⊂ B이다.`,
        facts: { calc: [[String(p), 0]] }
      });
    }, { standard: S2 }),
    H('hard-sqrt', '제곱근으로 정한 집합들의 포함 관계', '심3', (d) => {
      const s = d.pick([3, 4, 5, 6, 7]), NN = s * s, top = s % 2 === 1 ? s : s - 1, next = top + 2, ans = next * next - 1;
      return N(`자연수 ${V('n')}에 대하여 자연수 전체의 집합의 부분집합 A<sub>${V('n')}</sub>을 A<sub>${V('n')}</sub> = ${wj(bset(`${X}는 ${rt(V('n'))} 이하의 홀수`), '이라/라')} 하자. A<sub>${V('n')}</sub> ⊂ A<sub>${NN}</sub>${jo(String(NN), '을/를')} 만족시키는 ${V('n')}의 최댓값은?`, ans, {
        explain: `${rt(NN)} = ${s}이므로 A<sub>${NN}</sub> = ${wj(setH(rng(1, top).filter(odd)), '이다/이다')}. A<sub>${V('n')}</sub> ⊂ A<sub>${NN}</sub>이려면 A<sub>${V('n')}</sub>에 ${josa(next, '이/가')} 들면 안 되므로 ${rt(V('n'))} &lt; ${next}, 곧 ${V('n')} &lt; ${next * next}이다. 따라서 ${V('n')}의 최댓값은 ${ans}이다.`,
        facts: { rule: 'sqrt-odd' }
      });
    }, { standard: S2 }),
    H('hard-meet2', '두 집합과 모두 만나는 부분집합의 개수', '심6', (d) => {
      const m = d.int(5, 6), U = rng(1, m), A = S(pickN(d, U, 2)), Bs = S([d.pick(A)].concat(pickN(d, sub(U, A), 2)));
      let cnt = 0;
      for (const s of subsetsOf(U)) if (cap(s, A).length && cap(s, Bs).length) cnt += 1;
      const n0 = 2 ** m, nA = 2 ** (m - A.length), nB = 2 ** (m - Bs.length), nAB = 2 ** (m - cup(A, Bs).length);
      return N(`전체집합 U = ${bset(`${X}는 ${m} 이하의 자연수`)}의 두 부분집합 A = ${setH(A)}, B = ${wj(setH(Bs), '에/에')} 대하여 X∩A ≠ ∅, X∩B ≠ ∅을 만족시키는 U의 부분집합 X의 개수는?`, cnt, {
        explain: `U의 부분집합 ${n0}개에서 A와 만나지 않는 것 ${nA}개, B와 만나지 않는 것 ${wj(String(nB), '개를/개를')} 빼고, 둘 다 만나지 않아 두 번 뺀 것 ${wj(String(nAB), '개를/개를')} 다시 더한다. ${n0} ${MINUS} ${nA} ${MINUS} ${nB} + ${nAB} = ${cnt}개이다.`,
        facts: { rule: 'meet-two' }
      });
    }),
    H('hard-cond3', '차집합 조건 셋을 만족시키는 집합의 원소의 합의 최솟값', '심7', (d) => {
      const m = 10, U = rng(1, m), a = d.int(1, 2), A = rng(a, a + 4), Bs = rng(a + 2, a + 6), k = 6;
      const ok = (Xs) => Xs.length === k && same(sub(A, Xs), sub(Bs, Xs)) && cap(sub(Xs, A), sub(Xs, Bs)).length > 0;
      let best = Infinity, bestX = null;
      for (const s of subsetsOf(U)) if (s.length === k && ok(s) && sum(s) < best) { best = sum(s); bestX = s; }
      if (!bestX) return null;
      const must = cup(sub(A, Bs), sub(Bs, A));
      return N(`전체집합 U = ${bset(`${X}는 ${m} 이하의 자연수`)}의 두 부분집합 A = ${setH(A)}, B = ${wj(setH(Bs), '에/에')} 대하여 U의 부분집합 X가 다음 조건을 만족시킬 때, X의 모든 원소의 합의 최솟값은?`, best, {
        figure: lines([tag('㈎') + nb(`${nOf('X')} = ${k}`), tag('㈏') + nb('A − X = B − X'), tag('㈐') + nb('(X − A)∩(X − B) ≠ ∅')]),
        explain: `㈏에서 A−X = B−X는 A와 B에 함께 있는 원소로만 이루어지므로 A와 B 가운데 한쪽에만 있는 ${wj(listH(must), '은/는')} 모두 X에 든다. ㈐는 X∩(A∪B)${SUP_C} ≠ ∅이므로 ${listH(sub(U, cup(A, Bs)))} 가운데 적어도 하나가 X에 든다. 남은 자리를 가장 작은 수로 채우면 X = ${wj(setH(bestX), '이고/이고')} 원소의 합의 최솟값은 ${best}이다.`,
        facts: { rule: 'cond-three' }
      });
    })
  ];
  // 두 식이 다른 칸(풀이 글)
  function diffRegion(l, r, NM) {
    const a = regionsOf(l, NM), b = regionsOf(r, NM), k = a.filter((x) => !b.includes(x)).concat(b.filter((x) => !a.includes(x)))[0];
    return K.regionWord3(k);
  }
  const fracH = (m) => B.kit.frac(m, V('n'));
  const frac2 = () => B.kit.frac(1, 2), frac34 = () => B.kit.frac(3, 4);

  B.addGroup(UNIT, { id: 'hard', title: '단원 종합', standard: S3, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
