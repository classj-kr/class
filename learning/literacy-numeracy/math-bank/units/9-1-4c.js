// 중학교 3학년 1학기 4단원 이차방정식 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 근을 넣은 식은 참이 된다는 것을 쓰지 않고 근호가 든 근을 그대로 넣어 셈하다 길을 잃는다(근을 넣으면 x² + px = −q 같은 덩어리가 생긴다).
//  - 이차방정식이 되는 조건(x²의 계수 ≠ 0)을 잊고 구한 값을 모두 답으로 적는다.
//  - 양변을 같은 일차식으로 나누어 근을 하나 잃는다. 덩어리를 한 문자로 놓은 뒤 문제의 조건(부호·범위)으로 고르지 않는다.
//  - (x − p)² = k 에서 k 가 0이 아니어도 중근이라고 여긴다. 중근이면 좌변이 (x − m)²과 같다는 것을 계수 맞대기로 쓰지 못한다.
//  - 「사방으로 1 cm씩 남는다」를 한 변의 차 1 cm로, 닮은 직사각형의 대응하는 변을 엇갈리게 짝짓는다.
//  - 활용에서 두 근이 모두 조건에 맞는데 하나만 고르거나, 맞지 않는 근(음수·범위 밖)을 버리지 않는다.
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 그림·상황의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. 근과 계수의 관계는 쓰지 않는다 — 두 근의 합·곱·역수의 합은 해를 구해 셈하고, 두 근으로 이차방정식을 만들 때는 (x − α)(x − β)를 전개한다.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline, tagged } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qneg, qcmp, isInt, fl, tx, nb, tail, V, sup, nz, ansV, asQ, poly, rt, grp, sqParts, SG } = B.kit.mid;
  const { Board, TINT, CLEAR, at, dist, mid, meet, regPts, dirOf, awayFrom, sv } = B.kit.mgeo;
  const { name } = B.kit;
  const K = B.kit.m914;
  const { STD, HAN, X, X2, va, vb, vc, vk, vm, vp, vq, iq, isSq, squarefree, retry, P, padd, psub, pmul, pk, pval, L1, polyH, linH, kH, moreH, endJ, ej,
    prodH, prodP, sqH, sqP, eqH, exq, tagEq, keep, abc, solve2, formOf, radH, solH, radRootAns, valsQ, choose, setH, sameSet, ratRoots, twoInts, monic, dress } = K;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make: retry(make) }, more || {});
  const near = (x, y) => Math.abs(x - y) < 1e-9;
  const al = 'α', be = 'β';
  // 근호가 든 길이 p + k√q 를 받는 칸(p, k 는 양수)
  function plusRadAns(text, p, k, q, o) {
    return inline(text, grp('{0} +') + ' ' + grp(`{1}${rt('{2}')}` + (o.unit ? ' ' + o.unit : '')), [{ answer: p }, { answer: k }, { answer: q }], Object.assign({}, o, { shown: nb(`${p} + ${k}${rt(q)}` + (o.unit ? ' ' + o.unit : '')) }));
  }
  const rect = (b, x, y, w, h, css) => b.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], css);

  B.addGroup('9-1-4', {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      // ① 근의 뜻: 근을 넣으면 등식이 되므로 덩어리 α² + pα 의 값이 정해진다.
      H('hard-plug', '근을 넣으면 생기는 덩어리로 식의 값 구하기', '심1', (d, n) => {
        if (n === 0) {
          const p = nz(d, -6, 6), q = nz(d, -9, 9), D = p * p - 4 * q, u = nz(d, -6, 6), w = d.until(() => nz(d, -6, 6), (t) => t !== u);
          if (D <= 0 || isSq(D)) return null;
          const val = (u - q) * (w - q);
          if (val === 0) return null;
          const blk = (r) => nb('(' + r + sup(2) + moreH([[p, r], [u, '']]) + ')');
          const blk2 = (r) => nb('(' + r + sup(2) + moreH([[p, r], [w, '']]) + ')');
          return N(`이차방정식 ${nb(polyH(P(q, p, 1)) + ' = 0')}의 두 근을 ${al}, ${be}라 할 때, ${blk(al)}${blk2(be)}의 값은?`, val, {
            signed: true,
            explain: `${al}는 근이므로 ${nb(al + sup(2) + moreH([[p, al], [q, '']]) + ' = 0')}, 곧 ${nb(al + sup(2) + moreH([[p, al]]) + ' = ' + iq(-q))}이다. ${be}도 같다. 따라서 (주어진 식) = ${nb('(' + iq(-q) + moreH([[u, '']]) + ')(' + iq(-q) + moreH([[w, '']]) + ') = ' + iq(val))}이다.`,
            facts: { value: `((${u})-(${q}))*((${w})-(${q}))` }
          });
        }
        const p1 = nz(d, -6, 6), q1 = nz(d, -9, 9), p2 = nz(d, -6, 6), q2 = nz(d, -9, 9);
        if (p1 * p1 - 4 * q1 <= 0 || p2 * p2 - 4 * q2 <= 0 || isSq(p1 * p1 - 4 * q1) || q1 + q2 === 0) return null;
        return N(`다음 조건을 모두 만족시키는 ${va}, ${vb}에 대하여 ${nb(va + sup(2) + moreH([[p1, va]]) + ' + ' + vb + sup(2) + moreH([[p2, vb]]))}의 값은?`, -(q1 + q2), {
          signed: true,
          figure: tagged([`${va}는 이차방정식 ${nb(polyH(P(q1, p1, 1)) + ' = 0')}의 한 근이다.`, `${vb}는 이차방정식 ${nb(polyH(P(q2, p2, 1)) + ' = 0')}의 한 근이다.`], ['㈎', '㈏']),
          explain: `${va}는 근이므로 ${nb(va + sup(2) + moreH([[p1, va]]) + ' = ' + iq(-q1))}, ${vb}도 근이므로 ${nb(vb + sup(2) + moreH([[p2, vb]]) + ' = ' + iq(-q2))}이다. 따라서 (주어진 식) = ${nb(iq(-q1) + moreH([[-q2, '']]) + ' = ' + iq(-(q1 + q2)))}이다.`,
          facts: { value: `-(${q1})-(${q2})` }
        });
      }, { count: 2 }),
      // ② 근 m 에 대하여 m ± 1/m 을 얻고 제곱한다(네 단계).
      H('hard-recip', '근 m에 대하여 m² + 1/m²의 값 구하기', '심2', (d) => {
        const s = d.pick([1, -1]), p = nz(d, -6, 6);
        if (s === 1 && Math.abs(p) <= 2) return null;
        const val = p * p - 2 * s;
        return N(`이차방정식 ${nb(polyH(P(s, p, 1)) + ' = 0')}의 한 근을 ${vm}이라 할 때, ${nb(vm + sup(2) + ' + ')}${frac(1, vm + sup(2))}의 값은?`, val, {
          signed: true,
          explain: `${vm}은 근이므로 ${nb(vm + sup(2) + moreH([[p, vm], [s, '']]) + ' = 0')}이고 ${nb(vm + ' ≠ 0')}이다. 양변을 ${vm}으로 나누면 ${nb(vm + moreH([[p, '']]) + ' ' + (s > 0 ? '+' : MINUS) + ' ')}${frac(1, vm)} = 0, 곧 ${nb(vm + ' ' + (s > 0 ? '+' : MINUS) + ' ')}${frac(1, vm)} = ${iq(-p)}이다. 양변을 제곱하면 ${nb(vm + sup(2) + ' ' + (s > 0 ? '+' : MINUS) + ' 2 + ')}${frac(1, vm + sup(2))} = ${p * p}이므로 구하는 값은 ${iq(val)}이다.`,
          facts: { value: `(${p})*(${p})-2*(${s})`, derived: [2] }
        });
      }),
      // ① 이차방정식의 뜻: 정리한 x²의 계수(a 의 이차식)가 0이 아니어야 한다.
      H('hard-quad-cond', '계수가 문자의 이차식일 때 이차방정식이 되는 조건', '심3', (d) => {
        const a1 = d.int(2, 6), a2 = 1 - a1, s = a1 * (a1 - 1), pc = nz(d, -6, 6), qc = nz(d, -6, 6), t = nz(d, -4, 4), u = nz(d, -4, 4);
        const L = nb('(' + va + sup(2) + ' ' + MINUS + ' ' + s + ')' + X2 + moreH([[pc, X], [qc, '']])), R = nb('(' + va + X + moreH([[t, '']]) + ')(' + linH(1, -u) + ')');
        const bad = (a) => a * a - s - a === 0;
        const setT = (list) => list.map((v) => nb(va + ' = ' + iq(v))).join(', ');
        const sets = [[a2, a1], [a1], [a2], [-a1, -a2], [a1, -a2]];
        const rows = sets.map((list) => [setT(list), sameSet(list, [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(bad))]);
        return choose(d, `등식 ${keep(eqH(L, R))}이 ${X}에 대한 이차방정식일 때, 수 ${va}의 값이 될 수 없는 것을 모두 고른 것은?`, rows, {
          explain: `우변을 전개하면 ${X2}의 계수는 ${va}이므로 이항하여 정리하면 좌변의 ${X2}의 계수는 ${nb(va + sup(2) + ' ' + MINUS + ' ' + va + ' ' + MINUS + ' ' + s)}이다. 이차방정식이 되려면 ${nb(va + sup(2) + ' ' + MINUS + ' ' + va + ' ' + MINUS + ' ' + s + ' ≠ 0')}, ${nb('(' + va + ' ' + MINUS + ' ' + a1 + ')(' + va + ' + ' + (-a2) + ') ≠ 0')}이므로 ${setT([a2, a1])}일 수 없다.`,
          facts: { rule: 'quad-cond' }
        });
      }),
      // ①② 이차방정식이라는 조건으로 a 하나를 버리고, 약수의 개수로 이어 간다.
      H('hard-divisors', '이차방정식이라는 조건으로 근 하나를 버리고 이어 가기', '심4', (d) => {
        const t = d.pick([2, 3]), s = d.until(() => d.int(1, 5), (v) => v !== t), Nn = t === 2 ? d.pick([20, 30, 40]) : d.pick([30, 50, 100, 130]);
        // (a − s)x² + (a² − 1)x − (s + t + 1)a + (st + s + 1) = 0 의 한 근이 1 이면 (a − s)(a − t) = 0
        const cA = -(s + t + 1), cB = s * t + s + 1;
        const divs = (n) => { let c = 0; for (let i = 1; i <= n; i += 1) if (n % i === 0) c += 1; return c; };
        const flags = Array.from({ length: Nn - 1 }, (_, i) => divs(i + 1) === t);
        const cnt = flags.filter(Boolean).length;
        return N(`이차방정식 ${nb('(' + va + ' ' + MINUS + ' ' + s + ')' + X2 + ' + (' + va + sup(2) + ' ' + MINUS + ' 1)' + X + moreH([[cA, va], [cB, '']]) + ' = 0')}의 한 근이 1일 때, 약수의 개수가 ${va}인 ${Nn}보다 작은 자연수는 모두 몇 개인가? (단, ${va}는 수이다.)`, cnt, {
          unit: '개',
          explain: `${nb(X + ' = 1')}을 대입하면 ${nb(va + sup(2) + moreH([[-(s + t), va], [s * t, '']]) + ' = 0')}, ${nb('(' + va + ' ' + MINUS + ' ' + s + ')(' + va + ' ' + MINUS + ' ' + t + ') = 0')}이다. ${nb(va + ' = ' + s)}이면 ${X2}의 계수가 0이 되어 이차방정식이 아니므로 ${nb(va + ' = ' + t)}이다. 약수가 ${t}개인 자연수는 ${t === 2 ? '소수' : '소수의 제곱인 수'}이므로 ${Nn}보다 작은 것은 ${flags.map((f, i) => (f ? i + 1 : null)).filter(Boolean).join(', ')}의 ${cnt}개이다.`,
          facts: { count: flags }
        });
      }),
      // ① 직선의 기울기의 부호(제4사분면을 지나지 않는다)로 근 하나를 버린다.
      H('hard-line', '직선이 점을 지나는 조건과 사분면 조건', '심6', (d) => {
        const n2 = d.pick([1, 2]), k = d.pick([1, 2]), A = 1 + 2 * n2, m = A * k - 2 / k, R = Math.sqrt(m * m + 8 * A);
        const pt = nb('(' + va + ' + ' + m + ', ' + (n2 === 1 ? '' : n2) + va + sup(2) + ')');
        return N(`직선 ${nb(va + X + ' + 2' + V('y') + ' = 2')}가 좌표평면 위의 점 ${pt}을 지나고 제4사분면을 지나지 않을 때, 수 ${va}의 값은?`, -k, {
          signed: true,
          explain: `점의 좌표를 대입하면 ${nb(va + '(' + va + ' + ' + m + ') + ' + 2 * n2 + va + sup(2) + ' = 2')}, ${nb(poly([[A, va + sup(2)], [m, va], [-2, '']]) + ' = 0')}이므로 ${nb(va + ' = ' + iq(-k))} 또는 ${nb(va + ' = ')}${tx(Q(2, A * k))}이다. 직선은 ${nb(V('y') + ' = ')}${MINUS}${frac(va, 2)}${X} + 1이고 ${V('y')}절편이 1이므로, 제4사분면을 지나지 않으려면 기울기가 0 이상이어야 한다. 따라서 ${nb(va + ' ≤ 0')}인 ${nb(va + ' = ' + iq(-k))}이다.`,
          facts: { value: `(-${m}-${R})/(2*${A})`, derived: [R, A, 2] }
        });
      }),
      // ①② 약속한 연산을 식으로 옮기고, 정수가 아닌 근을 버린다.
      H('hard-op', '약속한 연산과 정수인 해', '심7', (d) => {
        const p = nz(d, -3, 3), q = nz(d, -3, 3), m = d.int(2, 3), r = nz(d, -4, 4), z = nz(d, -5, 5), e = (z + p) * (m * z + r + q);
        const f = psub(prodP(1, [[1, p], [m, r + q]]), P(e)), roots = ratRoots(f);
        if (e === 0 || roots.length !== 2 || roots.filter(isInt).length !== 1) return null;
        const S = solve2(f), sq = Math.sqrt(S.D), sgn = near((-S.b + sq) / (2 * S.a), z) ? '+' : '-';
        const op = '∗';
        return N(`두 수 ${va}, ${vb}에 대하여 연산 ${op}를 ${nb(va + ' ' + op + ' ' + vb + ' = (' + va + moreH([[p, '']]) + ')(' + vb + moreH([[q, '']]) + ')')}로 약속할 때, ${ej(nb(X + ' ' + op + ' (' + linH(m, r) + ') = ' + iq(e)), '을/를')} 만족시키는 정수 ${X}의 값은?`, z, {
          signed: true,
          explain: `약속에 따라 ${nb('(' + linH(1, p) + ')(' + linH(m, r + q) + ') = ' + iq(e))}이다. 정리하면 ${nb(polyH(f) + ' = 0')}이고, 풀면 ${setH(roots)}이다. ${X}는 정수이므로 ${nb(X + ' = ' + iq(z))}이다.`,
          facts: { value: `(-(${S.b})${sgn}${sq})/(2*${S.a})`, derived: [sq, 2, S.a, Math.abs(S.b)] }
        });
      }),
      // ① 덩어리를 한 문자로 놓고 문제의 부등식 조건으로 부호를 정해 하나를 고른다.
      H('hard-sub-sign', '공통부분을 한 문자로 놓고 부호 조건으로 고르기', '심8', (d) => {
        const X1 = d.int(1, 12), X2v = -d.until(() => d.int(1, 12), (t) => t !== X1), mm = X1 + X2v, nn = -X1 * X2v, kind = d.int(0, 1), negWant = d.bool();
        const blk = kind === 0 ? '2' + X + ' ' + MINUS + ' ' + V('y') : X + ' ' + MINUS + ' ' + V('y'), cond = kind === 0 ? (negWant ? nb(V('y') + ' &gt; 2' + X) : nb(V('y') + ' &lt; 2' + X)) : (negWant ? nb(X + ' &lt; ' + V('y')) : nb(X + ' &gt; ' + V('y')));
        const want = negWant ? X2v : X1, R = X1 - X2v;
        if (mm === 0) return null;
        return N(`${nb('(' + blk + ')(' + blk + moreH([[-mm, '']]) + ') ' + MINUS + ' ' + nn + ' = 0')}일 때, ${nb(blk)}의 값은? (단, ${cond})`, want, {
          signed: true,
          explain: `${nb(blk + ' = ' + V('A'))}로 놓으면 ${nb(V('A') + '(' + V('A') + moreH([[-mm, '']]) + ') ' + MINUS + ' ' + nn + ' = 0')}, ${nb(poly([[1, V('A') + sup(2)], [-mm, V('A')], [-nn, '']]) + ' = 0')}, ${nb('(' + V('A') + ' ' + MINUS + ' ' + X1 + ')(' + V('A') + ' + ' + (-X2v) + ') = 0')}이다. 조건에서 ${nb(blk)}${endJ(blk, '은/는')} ${negWant ? '음수' : '양수'}이므로 ${iq(want)}이다.`,
          facts: { value: `((${mm})${negWant ? '-' : '+'}${R})/2`, derived: [R, 2] }
        });
      }),
      // ② 덩어리 a − b 를 구하고 a² + b² = (a − b)² + 2ab 로 잇는다.
      H('hard-sub-sum', '덩어리의 값으로 a² + b²의 값 구하기', '심9', (d) => {
        const X1 = d.int(1, 9), X2v = -d.until(() => d.int(1, 9), (t) => t !== X1), r = d.int(1, 12), mm = X1 + X2v, nn = -X1 * X2v;
        if (mm === 0) return null;
        const blk = va + ' ' + MINUS + ' ' + vb, val = X2v * X2v + 2 * r;
        return N(`${nb('(' + blk + ')' + sup(2) + moreH([[-mm, '(' + blk + ')'], [-nn, '']]) + ' = 0')}이고 ${nb(va + vb + ' = ' + r)}일 때, ${nb(va + sup(2) + ' + ' + vb + sup(2))}의 값은? (단, ${nb(va + ' &lt; ' + vb)})`, val, {
          explain: `${nb(blk + ' = ' + V('A'))}로 놓으면 ${nb(poly([[1, V('A') + sup(2)], [-mm, V('A')], [-nn, '']]) + ' = 0')}이므로 ${nb(V('A') + ' = ' + X1)} 또는 ${nb(V('A') + ' = ' + iq(X2v))}이다. ${nb(va + ' &lt; ' + vb)}이므로 ${nb(blk + ' = ' + iq(X2v))}이고, ${nb(va + sup(2) + ' + ' + vb + sup(2) + ' = (' + blk + ')' + sup(2) + ' + 2' + va + vb + ' = ' + X2v * X2v + ' + ' + 2 * r + ' = ' + val)}이다.`,
          facts: { value: `(${mm}-${X1 - X2v})*(${mm}-${X1 - X2v})/4+2*${r}`, derived: [X1 - X2v, 2, 4] }
        });
      }),
      // ② 같은 방정식을 두 가지 완전제곱식 꼴로 고치고, 첫 꼴에서는 A 부터 정해야 한다.
      H('hard-two-forms', '같은 방정식을 두 가지 완전제곱식 꼴로 고치기', '심11', (d) => {
        const m = d.pick([2, 4, 6]), B0 = m / 2, c = nz(d, -5, 5), Bv = B0 * B0 - c, Dv = m * m * m * m / 4 - m * m * c;
        if (Bv === 0 || Dv === 0) return null;
        const vA = V('A'), vB = V('B'), vC = V('C'), vD = V('D');
        return M(`이차방정식 ${nb(polyH(P(c, -1, Q(1, m * m))) + ' = 0')}을 지연이는 ${nb('(' + vA + X + ' ' + MINUS + ' ' + B0 + ')' + sup(2) + ' = ' + vB)}의 꼴로, 준혁이는 ${nb('(' + X + ' ' + MINUS + ' ' + vC + ')' + sup(2) + ' = ' + vD)}의 꼴로 바꾸어 풀었다. ${vB}, ${vD}의 값을 구하시오. (단, ${vA}, ${vB}, ${vC}, ${vD}는 수이다.)`, [{ answer: Bv, signed: true, lead: vB + ' =' }, { answer: Dv, signed: true, lead: vD + ' =' }], {
          shown: `${nb(vB + ' = ' + iq(Bv))}, ${nb(vD + ' = ' + iq(Dv))}`,
          explain: `${nb('(' + vA + X + ' ' + MINUS + ' ' + B0 + ')' + sup(2) + ' = ' + vA + sup(2) + X2 + ' ' + MINUS + ' ' + 2 * B0 + vA + X + ' + ' + B0 * B0)}에서 ${X}의 계수가 ${MINUS}1이 되려면 ${nb(vA + ' = ')}${frac(1, m)}이다. 이때 ${nb('(')}${frac(1, m)}${nb(X + ' ' + MINUS + ' ' + B0 + ')' + sup(2) + ' = ' + iq(-c) + ' + ' + B0 * B0)}이므로 ${nb(vB + ' = ' + iq(Bv))}이다. 또 양변에 ${m * m}${tail(m * m, '을/를')} 곱하면 ${nb(polyH(P(m * m * c, -m * m, 1)) + ' = 0')}, ${nb('(' + X + ' ' + MINUS + ' ' + m * m / 2 + ')' + sup(2) + ' = ' + iq(Dv))}이므로 ${nb(vD + ' = ' + iq(Dv))}이다.`,
          facts: { calc: [[`${B0}*${B0}-(${c})`, 0], [`${m * m}*${m * m}/4-${m * m}*(${c})`, 1]], derived: [4] }
        });
      }),
      // ② 제곱근으로 푼 두 근의 역수를 더한다(분모의 유리화까지 네 단계).
      H('hard-recip-sum', '두 근의 역수의 합', '심12', (d) => {
        const k = d.int(1, 3), a = d.int(2, 5), b = nz(d, -5, 5), t = d.until(() => d.int(2, 15), squarefree), c = k * t;
        if (b * b === t) return null;
        const v = Q(-2 * a * b, b * b - t);
        if (v.q === 1 || v.p === 0) return null;
        return ansV(`이차방정식 ${nb(sqH(k, a, b) + ' = ' + c)}의 두 근을 ${vm}, ${V('n')}이라 할 때, ${frac(1, vm)} + ${frac(1, V('n'))}의 값은?`, v, 'frac', {
          explain: `${nb(sqH(1, a, b) + ' = ' + t)}이므로 ${nb(linH(a, b) + ' = ±' + rt(t))}, ${X} = ${frac(iq(-b) + ' ± ' + rt(t), a)}이다. ${frac(1, vm)} + ${frac(1, V('n'))} = ${frac(a, iq(-b) + ' + ' + rt(t))} + ${frac(a, iq(-b) + ' ' + MINUS + ' ' + rt(t))}이고, 통분하면 분모는 ${nb((-b < 0 ? '(' + iq(-b) + ')' : -b) + sup(2) + ' ' + MINUS + ' ' + t + ' = ' + iq(b * b - t))}, 분자는 ${nb(iq(-2 * a * b))}이므로 ${tx(v)}이다.`,
          facts: { value: `-2*${a}*(${b})/((${b})*(${b})-${t})`, derived: [t] }
        });
      }),
      // ② 제곱근으로 푼 두 근을 곱해(합차 꼴) 상수를 구한다.
      H('hard-prod-k', '제곱근을 이용해 푼 두 근의 곱으로 상수 구하기', '심13', (d) => {
        const m = d.int(2, 9), p = nz(d, -6, 6), Pp = d.until(() => nz(d, -20, 30), (v) => v < p * p), k = m * (p * p - Pp);
        return N(`이차방정식 ${nb(sqH(m, 1, -p) + ' = ' + vk)}의 두 근의 곱이 ${iq(Pp)}일 때, 수 ${vk}의 값은?`, k, {
          signed: true,
          explain: `${nb(sqH(1, 1, -p) + ' = ')}${frac(vk, m)}이므로 ${nb(X + ' = ' + iq(p) + ' ± ')}${rt(frac(vk, m))}이다. 두 근의 곱은 ${nb((p < 0 ? '(' + iq(p) + ')' : p) + sup(2) + ' ' + MINUS + ' ')}${frac(vk, m)} = ${iq(Pp)}이므로 ${frac(vk, m)} = ${p * p - Pp}, ${nb(vk + ' = ' + k)}이다.`,
          facts: { value: `${m}*((${p})*(${p})-(${Pp}))` }
        });
      }),
      // ① 중근이 −3이면 정리한 좌변이 (x + 3)²과 같다(계수 맞대기).
      H('hard-dbl-bracket', '중근이 주어질 때 괄호 꼴 방정식의 상수', '심16', (d) => {
        const m = nz(d, -6, 6), p = nz(d, -6, 6), a = -2 * m - p, b = a * p - m * m;
        if (a === 0 || a === p) return null;
        return valsQ(`이차방정식 ${nb('(' + X + ' + ' + va + ')(' + linH(1, p) + ') = ' + vb)}가 중근 ${nb(X + ' = ' + iq(m))}${tail(Math.abs(m), '을/를')} 가질 때, 수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `중근이 ${iq(m)}이므로 ${nb('(' + X + ' + ' + va + ')(' + linH(1, p) + ') ' + MINUS + ' ' + vb + ' = ' + sqH(1, 1, -m))}이다. 전개하면 ${nb(X2 + ' + (' + va + moreH([[p, '']]) + ')' + X + moreH([[p, va]]) + ' ' + MINUS + ' ' + vb + ' = ' + polyH(P(m * m, -2 * m, 1)))}이므로 ${nb(va + moreH([[p, '']]) + ' = ' + iq(-2 * m))}에서 ${nb(va + ' = ' + iq(a))}, ${nb(kH(p) + va + ' ' + MINUS + ' ' + vb + ' = ' + m * m)}에서 ${nb(vb + ' = ' + iq(b))}이다.`,
          facts: { calc: [[`-2*(${m})-(${p})`, 0], [`(-2*(${m})-(${p}))*(${p})-(${m})*(${m})`, 1]], derived: [2] }
        });
      }),
      // ① 근의 개수 조건 둘을 함께: 서로 다른 두 근(범위), 중근(m 의 이차방정식).
      H('hard-count-two', '근의 개수 조건 둘을 함께 만족시키는 상수', '심17', (d) => {
        const [m1, m2] = d.until(() => [nz(d, -7, 4), nz(d, -6, 6)], ([x, y]) => x < y), e = -(m1 + m2), cc = (2 * m1 * m2 + e * e) / 3;
        if (!Number.isInteger(cc) || cc <= 0 || e === 0) return null;
        const u = nz(d, -4, 4), v = nz(d, -9, 9), Tt = (u * u - v) / 2;
        if (!(m1 < Tt && m2 >= Tt)) return null;
        const R = 2 * (m2 - m1);
        const eq1 = nb(polyH(P(0, 2 * u, 1)) + ' + (2' + vm + moreH([[v, '']]) + ') = 0'), eq2 = nb('(' + vm + sup(2) + ' + ' + cc + ')' + X2 + ' ' + MINUS + ' 2(' + vm + moreH([[-e, '']]) + ')' + X + ' + 3 = 0');
        return N(`이차방정식 ${eq1}은 서로 다른 두 근을 갖고, 이차방정식 ${eq2}은 중근을 갖는다. 이때 수 ${vm}의 값은?`, m1, {
          signed: true,
          explain: `첫째 방정식의 근의 공식에서 근호 안의 수의 ${frac(1, 4)}은 ${nb(u * u + ' ' + MINUS + ' (2' + vm + moreH([[v, '']]) + ')')}이고 이것이 양수이므로 ${nb(vm + ' &lt; ')}${tx(Q(u * u - v, 2))}이다. 둘째 방정식이 중근을 가지려면 ${nb('(' + vm + moreH([[-e, '']]) + ')' + sup(2) + ' ' + MINUS + ' 3(' + vm + sup(2) + ' + ' + cc + ') = 0')}, 정리하면 ${nb(poly([[1, vm + sup(2)], [e, vm], [m1 * m2, '']]) + ' = 0')}이므로 ${nb(vm + ' = ' + iq(m1))} 또는 ${nb(vm + ' = ' + iq(m2))}이다. 두 조건을 함께 만족시키는 것은 ${nb(vm + ' = ' + iq(m1))}이다.`,
          facts: { value: `(-2*(${e})-${R})/4`, derived: [R, 2, 4, Math.abs(e)] }
        });
      }),
      // ①② 공통인 근으로 첫 방정식의 다른 근을 찾고, 남은 근이 둘째 방정식의 근임을 가린다.
      H('hard-common-all', '공통인 근과 모든 근으로 두 방정식의 계수 구하기', '심18', (d) => {
        const r = nz(d, -6, 6), pp = nz(d, -6, 6), s = -pp - r, tt = d.until(() => nz(d, -7, 7), (v) => v !== r && v !== s && v !== -r);
        if (s === r || s === 0) return null;
        const a = r * s, b = -(r + tt), c = r * tt, all = [r, s, tt].sort((x, y) => x - y);
        return M(`두 이차방정식 ${nb(polyH(P(0, pp, 1)) + ' + ' + va + ' = 0')}, ${nb(X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}의 공통인 근이 ${iq(r)}이고, 두 방정식의 모든 근이 ${all.map(iq).join(', ')}일 때, 수 ${va}, ${vb}, ${vc}의 값을 구하시오.`, [{ answer: a, signed: true, lead: va + ' =' }, { answer: b, signed: true, lead: vb + ' =' }, { answer: c, signed: true, lead: vc + ' =' }], {
          shown: `${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}, ${nb(vc + ' = ' + iq(c))}`,
          explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 첫째 방정식에 대입하면 ${nb(va + ' = ' + iq(a))}이고, ${nb(polyH(P(a, pp, 1)) + ' = 0')}의 해는 ${setH([r, s])}이다. 모든 근 가운데 남은 ${iq(tt)}${tail(Math.abs(tt), '은/는')} 둘째 방정식의 근이므로 둘째 방정식의 두 근은 ${iq(r)}, ${iq(tt)}이고 ${nb(prodH(1, [[1, -r], [1, -tt]]) + ' = 0')}, 곧 ${nb(polyH(monic(r, tt)) + ' = 0')}이다. 따라서 ${nb(vb + ' = ' + iq(b))}, ${nb(vc + ' = ' + iq(c))}이다.`,
          facts: { calc: [[`-((${r})*(${r})+(${pp})*(${r}))`, 0], [`-((${r})+(${tt}))`, 1], [`(${r})*(${tt})`, 2]] }
        });
      }),
      // ② 두 근을 α, 2α 로 놓고 대입하거나 이차방정식을 만들어 견준다(경우를 나누는 꼴은 둘째 차례).
      H('hard-ratio', '두 근의 비가 주어진 이차방정식', '①62 심19', (d, n) => {
        if (n === 0) {
          const mm = nz(d, -6, 6), S = 3 * mm, a = 2 * mm * mm;
          return N(`이차방정식 ${nb(polyH(P(0, -S, 1)) + ' + ' + va + ' = 0')}의 한 근이 다른 한 근의 2배일 때, 수 ${va}의 값은?`, a, {
            signed: true,
            explain: `두 근을 ${al}, 2${al}라 하면 ${nb(al + sup(2) + moreH([[-S, al]]) + ' + ' + va + ' = 0')}, ${nb('4' + al + sup(2) + moreH([[-2 * S, al]]) + ' + ' + va + ' = 0')}이다. 두 식을 빼면 ${nb('3' + al + sup(2) + moreH([[-S, al]]) + ' = 0')}이다. ${nb(al + ' = 0')}이면 ${nb(va + ' = 0')}이고 두 근이 0, ${iq(S)}${tail(Math.abs(S), '이/가')} 되어 맞지 않으므로 ${nb(al + ' = ' + iq(mm))}, ${nb(va + ' = ' + a)}이다.`,
            facts: { value: `2*(${S}/3)*(${S}/3)`, derived: [3] }
          });
        }
        const dd = d.int(1, 6), A1 = 3 * dd;
        const sets = [[-A1, A1], [A1], [-A1], [-dd, dd], [-2 * dd * dd, 2 * dd * dd]];
        const setT = (list) => list.map((v) => nb(va + ' = ' + iq(v))).join(' 또는 ');
        const ok = (list) => sameSet(list, [-A1, A1]);
        return choose(d, `이차방정식 ${nb(X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}의 두 근의 차가 ${dd}이고 두 근의 비가 1 : 2일 때, 수 ${va}의 값을 모두 구한 것은?`, sets.map((s) => [setT(s), ok(s)]), {
          explain: `두 근을 ${al}, 2${al}라 하면 두 근의 차는 ${nb('|' + al + '| = ' + dd)}이므로 ${nb(al + ' = ' + dd)} 또는 ${nb(al + ' = ' + iq(-dd))}이다. 두 근이 ${dd}, ${2 * dd}이면 ${nb(prodH(1, [[1, -dd], [1, -2 * dd]]) + ' = ' + polyH(P(2 * dd * dd, -A1, 1)))}이고, 두 근이 ${iq(-dd)}, ${iq(-2 * dd)}이면 ${nb(polyH(P(2 * dd * dd, A1, 1)))}이므로 ${setT([-A1, A1])}이다.`,
          facts: { rule: 'ratio-two' }
        });
      }, { count: 2 }),
      // ② 근의 공식으로 근호 안의 수 1 + 4a 가 홀수의 제곱이 되는 a 를 센다.
      H('hard-int-roots', '정수인 두 근을 갖게 하는 정수의 개수', '심20', (d) => {
        const s = d.pick([1, -1]), Nn = d.pick([20, 30, 40, 50, 60]);
        const flags = []; for (let a = 2; a < Nn; a += 1) flags.push(isSq(1 + 4 * a));
        const cnt = flags.filter(Boolean).length, list = flags.map((f, i) => (f ? i + 2 : null)).filter((v) => v !== null);
        return N(`이차방정식 ${nb(X2 + moreH([[-s, X]]) + ' ' + MINUS + ' ' + va + ' = 0')}이 정수인 두 근을 갖도록 하는 정수 ${va}는 모두 몇 개인가? (단, ${nb('1 &lt; ' + va + ' &lt; ' + Nn)})`, cnt, {
          unit: '개',
          explain: `근의 공식으로 풀면 ${nb(X + ' = ')}${frac(iq(s) + ' ± ' + rt('1 + 4' + va), 2)}이다. 두 근이 정수이려면 ${nb('1 + 4' + va)}가 제곱수여야 하고, 이 수는 홀수이므로 홀수의 제곱이다. ${nb('1 + 4' + va + ' = 9, 25, 49, 81, …')}에서 ${va}는 ${list.join(', ')}의 ${cnt}개이다.`,
          facts: { count: flags }
        });
      }),
      // ② 두 근의 합(해를 구해 더함) → 대입 → 다시 풀어 다른 근(네 단계).
      H('hard-sum-other', '두 근의 합으로 이은 다른 방정식의 다른 근', '심21', (d) => {
        const p = nz(d, -5, 5), q = nz(d, -6, 6), D = p * p - 4 * q;
        if (D <= 0 || isSq(D)) return null;
        const s = -p, A = d.int(2, 4), u = d.until(() => nz(d, -9, 9), (t) => Q(t, A).q !== 1), o = Q(u, A), Bc = -(A * s + u);
        if (Bc === 0 || qcmp(o, Q(s)) === 0) return null;
        return ansV(`이차방정식 ${nb(polyH(P(q, p, 1)) + ' = 0')}의 두 근의 합이 이차방정식 ${nb(polyH(P(0, Bc, A)) + ' + ' + va + ' = 0')}의 한 근일 때, 이 방정식의 다른 한 근은? (단, ${va}는 수이다.)`, o, 'frac', {
          explain: `근의 공식으로 풀면 ${nb(X + ' = ')}${frac(iq(-p) + ' ± ' + rt(D), 2)}이므로 두 근의 합은 ${iq(s)}이다. ${nb(X + ' = ' + iq(s))}${tail(Math.abs(s), '을/를')} 대입하면 ${nb(va + ' = ' + iq(s * u))}이고, ${nb(polyH(P(s * u, Bc, A)) + ' = 0')}을 인수분해하면 ${nb(prodH(1, [[1, -s], [A, -u]]) + ' = 0')}이므로 다른 한 근은 ${tx(o)}이다.`,
          facts: { value: `-(${Bc})/${A}+(${p})` }
        });
      }),
      // ① 두 근이 모두 움직이는 동안의 시간이라 둘 다 답이다.
      H('hard-moving', '움직이는 두 점이 만드는 삼각형의 넓이', '심22', (d) => {
        const t1 = d.int(1, 8), t2 = d.until(() => d.int(2, 10), (v) => v > t1), h = t1 + t2, S = t1 * t2, w = 2 * t2 + d.int(0, 6);
        const g = Board(), u = 150 / Math.max(w, h), A = [0, 0], Bq = [0, h * u], Cq = [w * u, h * u], Dq = [w * u, 0], Pp = [0, t1 * u], Qq = [2 * t1 * u, h * u];
        g.poly([A, Bq, Cq, Dq]); g.poly([Pp, Bq, Qq], TINT); g.dot(Pp); g.dot(Qq);
        g.name(A, 'A', 135); g.name(Bq, 'B', 225); g.name(Cq, 'C', 315); g.name(Dq, 'D', 45); g.name(Pp, 'P', 180); g.name(Qq, 'Q', 270);
        g.dim(A, Dq, w + ' cm', [w * u / 2, 40], 10); g.dim(Dq, Cq, h + ' cm', [w * u / 2, h * u / 2], 10);
        const fits = (t) => near(t * (h - t), S) && t > 0 && t <= h && 2 * t <= w;
        const opts = [[t1], [t2], [t1, t2], [h], [t2 - t1 === t1 || t2 - t1 === t2 ? h + 1 : t2 - t1]];
        const setT = (list) => list.map((v) => v + '초 후').join(' 또는 ');
        return choose(d, `그림과 같이 ${nb(SG('AD') + ' = ' + w + ' cm')}, ${nb(SG('CD') + ' = ' + h + ' cm')}인 직사각형 ABCD에서 점 P는 꼭짓점 A를 출발하여 변 AB를 따라 B까지 초속 1 cm로, 점 Q는 꼭짓점 B를 출발하여 변 BC를 따라 C까지 초속 2 cm로 움직인다. 두 점 P, Q가 동시에 출발할 때, 삼각형 PBQ의 넓이가 ${S} cm²가 되는 것은 출발한 지 몇 초 후인가?`, opts.map((list) => [setT(list), sameSet(list, [t1, t2].filter(fits))]), {
          figure: g.svg(`직사각형 ABCD: 가로 AD는 ${w} cm, 세로 CD는 ${h} cm이다. 점 P는 변 AB 위에, 점 Q는 변 BC 위에 있고 삼각형 PBQ를 색칠했다.`),
          explain: `${V('t')}초 후 ${nb(SG('BP') + ' = (' + h + ' ' + MINUS + ' ' + V('t') + ') cm')}, ${nb(SG('BQ') + ' = 2' + V('t') + ' cm')}이므로 ${nb(frac(1, 2) + ' × (' + h + ' ' + MINUS + ' ' + V('t') + ') × 2' + V('t') + ' = ' + S)}, ${nb(poly([[1, V('t') + sup(2)], [-h, V('t')], [S, '']]) + ' = 0')}이다. ${nb(V('t') + ' = ' + t1)} 또는 ${nb(V('t') + ' = ' + t2)}이고, 두 값 모두 P가 변 AB 위에(${V('t')} ≤ ${h}), Q가 변 BC 위에(2${V('t')} ≤ ${w}) 있는 동안이므로 둘 다 답이다.`,
          facts: { rule: 'moving' }
        });
      }),
      // ① 사방으로 w cm씩 남으면 두 한 변의 차는 2w cm 이다.
      H('hard-center', '큰 색종이 가운데에 놓은 작은 색종이', '심23', (d) => {
        const w = d.int(1, 2), s = d.int(2, 4), t = d.until(() => d.int(2, 15), squarefree), S = 2 * s * s * t + 2 * w * w;
        return plusRadAns(`크기가 다른 두 정사각형 모양의 색종이가 있다. 작은 색종이를 큰 색종이의 가운데에 놓았더니 사방으로 ${w} cm씩 남았다. 두 색종이의 넓이의 합이 ${S} cm²일 때, 큰 색종이의 한 변의 길이는 몇 cm인가?`, w, s, t, {
          unit: 'cm',
          explain: `작은 색종이의 한 변을 ${X} cm라 하면 큰 색종이의 한 변은 양쪽으로 ${w} cm씩 더 길어 ${nb('(' + X + ' + ' + 2 * w + ') cm')}이다. ${nb(X2 + ' + (' + X + ' + ' + 2 * w + ')' + sup(2) + ' = ' + S)}, ${nb(polyH(P((4 * w * w - S) / 2, 2 * w, 1)) + ' = 0')}이므로 ${nb(X + ' = ' + iq(-w) + ' ± ' + s + rt(t))}이고 ${X} &gt; 0이므로 ${nb(X + ' = ' + iq(-w) + ' + ' + s + rt(t))}이다. 큰 색종이의 한 변은 ${nb('(' + w + ' + ' + s + rt(t) + ') cm')}이다.`,
          facts: { calc: [[`${w}`, 0], [`${s}`, 1], [`(${S}-2*${w}*${w})/(2*${s}*${s})`, 2]], derived: [s, 2] }
        });
      }),
      // ① 닮은 두 직사각형에서 대응하는 변의 짝(긴 변끼리, 짧은 변끼리)을 바르게 맞춘다.
      H('hard-sim-rect', '정사각형을 떼어 낸 닮은 직사각형', '심24', (d) => {
        const k = d.int(2, 6), ab = 2 * k;
        const g = Board(), U = 100, Wd = U * 1.618, A = [0, 0], Bq = [0, U], E = [U, 0], F = [U, U], Cq = [Wd, U], Dq = [Wd, 0];
        g.poly([A, Bq, Cq, Dq]); g.seg(E, F); g.poly([E, F, Cq, Dq], TINT);
        for (const [p, nm, an] of [[A, 'A', 135], [Bq, 'B', 225], [Cq, 'C', 315], [Dq, 'D', 45], [E, 'E', 90], [F, 'F', 270]]) g.name(p, nm, an);
        g.dim(A, Bq, ab + ' cm', [50, 50], 12);
        return plusRadAns(`그림과 같이 직사각형 ABCD에서 □ABFE는 정사각형이고, 두 직사각형 ABCD와 DEFC는 서로 닮은 도형이다. ${nb(SG('AB') + ' = ' + ab + ' cm')}일 때, ${SG('AD')}의 길이는 몇 cm인가?`, k, k, 5, {
          unit: 'cm',
          figure: g.svg(`직사각형 ABCD 안에 선분 EF를 그어 왼쪽은 정사각형 ABFE, 오른쪽은 직사각형 DEFC(색칠)이다. 변 AB의 길이는 ${ab} cm이다.`),
          explain: `${nb(SG('AD') + ' = ' + X + ' cm')}라 하면 ${nb(SG('DE') + ' = (' + X + ' ' + MINUS + ' ' + ab + ') cm')}이다. □ABCD∽□DEFC에서 짧은 변끼리, 긴 변끼리 대응하므로 ${nb(SG('AB') + ' : ' + SG('DE') + ' = ' + SG('AD') + ' : ' + SG('DC'))}, ${nb(ab + ' : (' + X + ' ' + MINUS + ' ' + ab + ') = ' + X + ' : ' + ab)}이다. ${nb(polyH(P(-ab * ab, -ab, 1)) + ' = 0')}을 풀면 ${nb(X + ' = ' + k + ' ± ' + k + rt(5))}이고 ${X} &gt; 0이므로 ${nb('(' + k + ' + ' + k + rt(5) + ') cm')}이다.`,
          facts: { calc: [[`${ab}/2`, 0], [`${ab}/2`, 1], [`(${ab}*${ab}+4*${ab}*${ab})/(${ab}*${ab})`, 2]], derived: [2, 4] }
        });
      }),
      // ①② 정오각형의 각(36°, 72°)으로 닮은 이등변삼각형을 찾는다(보조선 두 대각선).
      H('hard-pentagon', '정오각형의 대각선의 길이', '심25', (d) => {
        const k = d.int(1, 4), side = 2 * k;
        const g = Board(), raw = regPts(5, 90), cx = raw.reduce((s, p) => s + p[0], 0) / 5;
        // 꼭짓점 A 가 맨 위, 시계 반대쪽으로 B, C, D, E
        const top = raw.reduce((best, p, i) => (p[1] < raw[best][1] ? i : best), 0), order = [0, 1, 2, 3, 4].map((i) => raw[(top + i) % 5]);
        const [A, Bq, Cq, Dq, E] = order;
        g.poly([A, Bq, Cq, Dq, E]); g.seg(A, Dq, 'thin'); g.seg(Cq, E, 'thin');
        const F = meet(A, Dq, Cq, E); g.dot(F);
        for (const [p, nm] of [[A, 'A'], [Bq, 'B'], [Cq, 'C'], [Dq, 'D'], [E, 'E']]) g.name(p, nm, awayFrom(p, order.filter((q) => q !== p)), 12);
        g.nameFree(F, 'F', [A, Dq, Cq, E].map((q) => dirOf(F, q)));
        g.beside(Bq, Cq, String(side), [cx, raw.reduce((s, q) => s + q[1], 0) / 5]);
        return plusRadAns(`그림과 같이 한 변의 길이가 ${side}인 정오각형 ABCDE에서 두 대각선 AD, CE의 교점을 F라 할 때, 대각선 AD의 길이는?`, k, k, 5, {
          figure: g.svg(`정오각형 ABCDE(꼭짓점 A가 맨 위, 시계 반대쪽으로 B, C, D, E)에 대각선 AD와 CE를 긋고 그 교점을 F라 했다. 한 변의 길이는 ${side}이다.`),
          explain: `정오각형의 한 내각은 108°이므로 ∠CDE = 108°, ∠DCE = ∠DEC = 36°, ∠ADC = 72°이다. △DCF에서 ∠CFD = 72°이므로 ${nb(SG('CF') + ' = ' + SG('CD') + ' = ' + side)}, 또 ∠FCA = 36° = ∠CAD이므로 ${nb(SG('AF') + ' = ' + SG('CF') + ' = ' + side)}이다. △ACD∽△CDF(AA 닮음)에서 ${nb(SG('AD') + ' = ' + X)}라 하면 ${nb(X + ' : ' + side + ' = ' + side + ' : (' + X + ' ' + MINUS + ' ' + side + ')')}, ${nb(polyH(P(-side * side, -side, 1)) + ' = 0')}이므로 ${nb(X + ' = ' + k + ' + ' + (k === 1 ? '' : k) + rt(5))}이다.`,
          facts: { calc: [[`${side}/2`, 0], [`${side}/2`, 1], [`(${side}*${side}+4*${side}*${side})/(${side}*${side})`, 2]], derived: [2, 4] }
        });
      }),
      // ① ∠B = 45°이고 높이를 내린 직각삼각형이 직각이등변삼각형이라 높이 = 밑변 조각이다.
      H('hard-trapezoid', '직각이등변삼각형을 품은 사다리꼴', '심27', (d) => {
        const x = 2 * d.int(1, 6), a = d.int(1, Math.min(9, Math.floor(1.8 * x))), S = x * x / 2 + a * x; // 너무 납작하면 45° 글씨가 선에 걸린다
        const g = Board(), u = 150 / (x + a), A = [x * u, 0], Dq = [(x + a) * u, 0], Bq = [0, x * u], Cq = [(x + a) * u, x * u], E = [x * u, x * u];
        g.poly([A, Bq, Cq, Dq]); g.seg(A, E, 'cut');
        g.corner(Cq, Bq, Dq); g.corner(Dq, Cq, A); g.angle(Bq, 0, 45, '45°');
        for (const [p, nm, an] of [[A, 'A', 155], [Bq, 'B', 225], [Cq, 'C', 315], [Dq, 'D', 30], [E, 'E', 270]]) g.name(p, nm, an);
        g.dim(A, Dq, a + ' cm', [((2 * x + a) / 2) * u, 40], 22);
        return N(`그림과 같이 ${nb(SG('AD') + ' = ' + a + ' cm')}, ∠B = 45°, ∠C = ∠D = 90°인 사다리꼴 ABCD의 넓이가 ${S} cm²일 때, ${SG('BC')}의 길이는 몇 cm인가?`, x + a, {
          unit: 'cm',
          figure: g.svg(`사다리꼴 ABCD: 윗변 AD는 ${a} cm, ∠B = 45°, ∠C와 ∠D는 직각이다. 점 A에서 변 BC에 내린 수선의 발은 E이다.`),
          explain: `점 A에서 ${SG('BC')}에 내린 수선의 발을 E라 하면 △ABE는 ∠B = 45°인 직각이등변삼각형이므로 ${nb(SG('BE') + ' = ' + SG('AE') + ' = ' + X + ' cm')}라 할 수 있다. ${nb(SG('EC') + ' = ' + a + ' cm')}이므로 넓이는 ${nb(frac(1, 2) + X2 + ' + ' + (a === 1 ? '' : a) + X + ' = ' + S)}, ${nb(polyH(P(-2 * S, 2 * a, 1)) + ' = 0')}이다. ${X} &gt; 0인 해는 ${x}이므로 ${nb(SG('BC') + ' = ' + x + ' + ' + a + ' = ' + (x + a) + ' cm')}이다.`,
          facts: { value: `${a}+(-2*${a}+${2 * x + 2 * a})/2`, derived: [2 * x + 2 * a, 2] }
        });
      }),
      // ① 넓이의 비가 1 : k² 이면 한 변의 길이의 비는 1 : k 이다.
      H('hard-split-square', '넓이의 비가 정해진 두 정사각형으로 나누기', '심28', (d) => {
        const kk = d.pick([2, 3]), L = d.until(() => d.int(10, 40), (v) => v % (kk + 1) !== 0), xq = Q(L, kk + 1);
        const g = Board(), U = 150, sx = U / (kk + 1);
        g.poly([[0, 0], [U, 0], [U, U], [0, U]]); g.poly([[0, 0], [sx, 0], [sx, sx], [0, sx]], TINT); g.poly([[sx, sx], [U, sx], [U, U], [sx, U]], 'fill:rgba(37,99,235,0.14)');
        g.seg([sx, 0], [sx, U], 'thin'); g.seg([0, sx], [U, sx], 'thin');
        g.text([sx / 2, sx / 2], sv('x')); g.dim([0, U], [U, U], L + ' m', [U / 2, 0], 10);
        return ansV(`그림과 같이 한 변의 길이가 ${L} m인 정사각형 모양의 땅을 두 정사각형 모양의 땅(색칠한 부분)과 두 직사각형 모양의 땅으로 나누었다. 두 정사각형 모양의 땅의 넓이의 비가 1 : ${kk * kk}일 때, 작은 정사각형의 한 변의 길이 ${X}는?`, xq, 'frac', {
          figure: g.svg(`한 변이 ${L} m인 정사각형을 가로선과 세로선으로 나누어 왼쪽 위에 한 변이 x인 작은 정사각형, 오른쪽 아래에 한 변이 ${L} − x인 큰 정사각형을 만들었다.`),
          explain: `큰 정사각형의 한 변은 ${nb('(' + L + ' ' + MINUS + ' ' + X + ') m')}이므로 ${nb(X2 + ' : (' + L + ' ' + MINUS + ' ' + X + ')' + sup(2) + ' = 1 : ' + kk * kk)}, ${nb(kk * kk + X2 + ' = (' + L + ' ' + MINUS + ' ' + X + ')' + sup(2))}이다. 정리하면 ${nb(polyH(P(-L * L, 2 * L, kk * kk - 1)) + ' = 0')}이고 ${nb('0 &lt; ' + X + ' &lt; ' + L)}인 해는 ${tx(xq)}이다(넓이의 비가 1 : ${kk * kk}이면 한 변의 비는 1 : ${kk}이다).`,
          facts: { value: `${L}/(${kk}+1)`, derived: [kk] }
        });
      }),
      // ② 미지수 셋을 길이의 합과 넓이가 같은 조건으로 하나로 줄인다.
      H('hard-segments', '선분을 나누어 만든 직사각형', '심29', (d) => {
        const [x1, x2] = d.until(() => [d.int(2, 12), d.int(3, 14)], ([p, q]) => p < q && (p * q) % 8 === 0), Tt = 3 * (x1 + x2), Ar = 9 * x1 * x2 / 8;
        const g = Board(), W = 180, Hh = 100, ye = W / 3, A = [0, 0], Bq = [0, Hh], Cq = [W, Hh], Dq = [W, 0], E = [ye, 0], F = [ye, Hh];
        g.poly([A, Bq, Cq, Dq]); g.seg(E, F); g.seg([ye, Hh / 2], [W, Hh / 2]);
        for (const [p, nm, an] of [[A, 'A', 135], [Bq, 'B', 225], [Cq, 'C', 315], [Dq, 'D', 45], [E, 'E', 90], [F, 'F', 270]]) g.name(p, nm, an);
        const fits = (x) => { const y = (Tt - 3 * x) / 8; return y > 0 && near(3 * x * y, Ar); };
        const sets = [[x1, x2], [x1], [x2], [x1, x2, x1 + x2], [x2 - x1 === x1 ? x2 + 1 : x2 - x1]];
        const setT = (list) => list.map((v) => nb(SG('AB') + ' = ' + v)).join(' 또는 ');
        return choose(d, `길이가 ${Tt}인 선분을 여섯 조각으로 나누어, 네 조각으로 직사각형 ABCD를 만들고 남은 두 조각으로 그림과 같이 직사각형 ABCD 안을 넓이가 같은 세 직사각형으로 나누었다. 직사각형 ABCD의 넓이가 ${Ar}일 때, ${SG('AB')}의 길이를 모두 구한 것은?`, sets.map((list) => [setT(list), sameSet(list, [x1, x2].filter(fits))]), {
          figure: g.svg(`직사각형 ABCD 안에 변 AB와 평행한 선분 EF를 긋고, 오른쪽 직사각형 EFCD를 가로로 반씩 나누는 선분을 그었다. 세 직사각형 ABFE와 위·아래의 두 직사각형의 넓이는 같다.`),
          explain: `${nb(SG('AB') + ' = ' + X)}, ${nb(SG('AE') + ' = ' + V('y'))}, ${nb(SG('ED') + ' = ' + V('z'))}라 하면 길이의 합에서 ${nb('3' + X + ' + 2' + V('y') + ' + 3' + V('z') + ' = ' + Tt)}, 넓이가 같으므로 ${nb(X + V('y') + ' = ' + frac(1, 2) + X + V('z'))}, 곧 ${nb(V('z') + ' = 2' + V('y'))}이다. ${nb(V('y') + ' = ')}${frac(Tt + ' ' + MINUS + ' 3' + X, 8)}이고 넓이 ${nb('3' + X + V('y') + ' = ' + Ar)}에서 ${nb(polyH(P(8 * Ar / 3, -Tt, 3)) + ' = 0')}, 곧 ${nb(polyH(P(x1 * x2, -(x1 + x2), 1)) + ' = 0')}이다. 따라서 ${nb(SG('AB') + ' = ' + x1)} 또는 ${nb(SG('AB') + ' = ' + x2)}이고 두 경우 모두 ${V('y')} &gt; 0이다.`,
          facts: { rule: 'segments' }
        });
      }),
      // ② 중근 조건으로 p 가 둘 → 경우마다 다른 방정식을 푼다 / 두 방정식의 상수로 최솟값을 고른다.
      H('hard-dbl-chain', '중근 조건으로 구한 값을 이어 쓰기', '①27', (d, n) => {
        if (n === 0) {
          const qv = d.int(1, 4), e = nz(d, -4, 4), B1 = 2 * qv - e, B2 = -2 * qv - e;
          if (Math.abs(B1) < 2 || Math.abs(B2) < 2) return null;
          // 경우마다의 해: { h 글, v 값들, flip 부호를 바꾼 것 }
          const rootsOf = (Bv) => {
            const S = solve2(P(1, Bv, 1));
            if (S.kind === 'irr') { const one = (sol) => ({ h: radH(sol), v: [(sol.p - sol.k * Math.sqrt(sol.q)) / sol.r, (sol.p + sol.k * Math.sqrt(sol.q)) / sol.r], flip: () => one({ p: -sol.p, k: sol.k, q: sol.q, r: sol.r }) }); return [one(S.sol)]; }
            const list = S.kind === 'double' ? [S.root] : S.roots, one = (r) => ({ h: tx(r), v: [fl(r)], flip: () => one(qneg(r)) });
            return list.map(one);
          };
          const c1 = rootsOf(B1), c2 = rootsOf(B2), allVals = c1.concat(c2).flatMap((r) => r.v);
          const txt = (list) => list.map((r) => nb(X + ' = ' + r.h)).join(' 또는 ');
          const flip = (list) => list.map((r) => r.flip());
          const cands = [c1.concat(c2), c1, c2, flip(c1).concat(c2), c1.concat(flip(c2))];
          const same = (list) => { const vs = list.flatMap((r) => r.v).sort((a, b) => a - b), ws = allVals.slice().sort((a, b) => a - b); return vs.length === ws.length && vs.every((v, i) => near(v, ws[i])); };
          const rows = [];
          for (const list of cands) if (!rows.some((r) => r[0] === txt(list))) rows.push([txt(list), same(list)]);
          if (rows.length < 4) return null;
          return choose(d, `이차방정식 ${nb(X2 + ' + ' + vp + X + ' + ' + qv * qv + ' = 0')}이 중근을 가질 때, 이차방정식 ${nb(X2 + ' + (' + vp + moreH([[-e, '']]) + ')' + X + ' + 1 = 0')}의 해를 모두 구한 것은? (단, ${vp}는 수이다.)`, rows, {
            explain: `중근을 가지려면 ${nb('(' + frac(vp, 2) + ')' + sup(2) + ' = ' + qv * qv)}이므로 ${nb(vp + ' = ' + 2 * qv)} 또는 ${nb(vp + ' = ' + iq(-2 * qv))}이다. ${nb(vp + ' = ' + 2 * qv)}이면 ${nb(polyH(P(1, B1, 1)) + ' = 0')}에서 ${txt(c1)}, ${nb(vp + ' = ' + iq(-2 * qv))}이면 ${nb(polyH(P(1, B2, 1)) + ' = 0')}에서 ${txt(c2)}이다.`,
            facts: { rule: 'dbl-chain' }
          });
        }
        const m = d.int(2, 4), nn = nz(d, -5, 5), c = d.int(2, 9), A = nn * nn;
        return N(`두 이차방정식 ${nb(polyH(P(0, -2 * m * nn, m * m)) + ' + ' + V('A') + ' = 0')}, ${nb(X2 + ' + ' + V('B') + X + ' + ' + c * c + ' = 0')}이 모두 중근을 가질 때, ${nb(V('A') + ' + ' + V('B'))}의 값 가운데 가장 작은 것은? (단, ${V('A')}, ${V('B')}는 수이다.)`, A - 2 * c, {
          signed: true,
          explain: `첫째 방정식은 ${nb(sqH(1, m, -nn) + ' = ' + polyH(P(nn * nn, -2 * m * nn, m * m)))}이므로 ${nb(V('A') + ' = ' + A)}이다. 둘째 방정식은 좌변이 ${nb(sqH(1, 1, c))} 또는 ${nb(sqH(1, 1, -c))}이어야 하므로 ${nb(V('B') + ' = ' + 2 * c)} 또는 ${nb(V('B') + ' = ' + iq(-2 * c))}이다. ${nb(V('A') + ' + ' + V('B'))}가 가장 작은 것은 ${nb(A + ' + (' + iq(-2 * c) + ') = ' + iq(A - 2 * c))}이다.`,
          facts: { value: `(${2 * m * nn})*(${2 * m * nn})/(4*${m * m})-2*${c}`, derived: [c, 2, 4] }
        });
      }, { count: 2 }),
      // ② 해(근호)로 두 계수를 구하고 다른 방정식을 푼다(네 단계).
      H('hard-qf-chain', '해로 계수 둘을 구해 다른 방정식 풀기', '①43', (d) => {
        const A1 = d.int(2, 6), f = d.until(() => P(nz(d, -9, 9), nz(d, -12, 12), A1), (g) => { const S = solve2(g); return S.kind === 'irr' && S.a === A1 && formOf(S.sol) === 'P1R'; });
        const S1 = solve2(f), b = f[1].p, c = f[0].p, A2 = d.until(() => d.int(1, 7), (v) => v !== A1), g = P(-c, b, A2), S2 = solve2(g);
        if (S2.kind !== 'irr' || formOf(S2.sol) !== 'P1R') return null;
        return radRootAns(`이차방정식 ${nb(A1 + X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}의 해가 ${solH(S1.sol)}일 때, 이차방정식 ${nb(A2 === 1 ? X2 : A2 + X2)} + ${nb(vb + X + ' ' + MINUS + ' ' + vc + ' = 0')}을 푸시오. (단, ${vb}, ${vc}는 수이다.)`, S2, 'P1R', {
          explain: `근의 공식으로 풀면 ${nb(X + ' = ')}${frac(MINUS + vb + ' ± ' + rt(vb + sup(2) + ' ' + MINUS + ' ' + 4 * A1 + vc), 2 * A1)}이다. 주어진 해와 견주면 ${nb(vb + ' = ' + iq(b))}, ${nb(vc + ' = ' + iq(c))}이다. ${nb(polyH(g) + ' = 0')}을 근의 공식으로 풀면 ${solH(S2.sol)}이다.`,
          facts: { rule: 'qf-chain' }
        });
      }),
      // ② 처음 방정식을 풀고 → 근을 옮기고 → 두 근으로 방정식을 만들어 계수를 읽는다.
      H('hard-shift', '근을 옮긴 이차방정식의 계수', '①58', (d) => {
        const A = d.int(2, 4), r1 = nz(d, -5, 5), up = d.until(() => nz(d, -9, 9), (t) => gcd(Math.abs(t), A) === 1), hh = nz(d, -3, 3), f = pmul(P(-r1, 1), P(-up, A)), Bc = f[1].p, Cc = f[0].p;
        const g = pmul(P(-(r1 + hh), 1), P(-(up + A * hh), A)), a = g[1].p, b = g[0].p;
        if (a === 0 || b === 0 || Bc === 0) return null;
        return valsQ(`이차방정식 ${nb(polyH(f) + ' = 0')}의 두 근을 ${al}, ${be}라 할 때, 이차방정식 ${nb(A + X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}의 두 근은 ${nb(al + moreH([[hh, '']]))}, ${nb(be + moreH([[hh, '']]))}이다. 수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `${nb(polyH(f) + ' = 0')}을 인수분해하면 ${nb(prodH(1, [[1, -r1], [A, -up]]) + ' = 0')}이므로 두 근은 ${iq(r1)}, ${tx(Q(up, A))}이다. 새 방정식의 두 근은 ${iq(r1 + hh)}, ${tx(Q(up + A * hh, A))}이고 ${X2}의 계수가 ${A}이므로 ${nb(prodH(1, [[1, -(r1 + hh)], [A, -(up + A * hh)]]) + ' = 0')}, 곧 ${nb(polyH(g) + ' = 0')}이다. 따라서 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
          facts: { calc: [[`(${Bc})-2*${A}*(${hh})`, 0], [`(${Cc})-(${Bc})*(${hh})+${A}*(${hh})*(${hh})`, 1]], derived: [2] }
        });
      }),
      // ①② 누가 무엇을 바르게 보았는지 가려 두 계수를 모은다.
      H('hard-wrong', '계수를 잘못 보고 푼 해로 바른 해 구하기', '①61', (d) => {
        const [names1, names2] = d.pick([['정아', '건호'], ['지우', '민재'], ['서연', '도현'], ['하린', '은호']]);
        const [w1, w2] = twoInts(d, -9, 9), Cc = w1 * w2, h = nz(d, -5, 5), q = h * h - Cc, Bc = -2 * h, u1 = nz(d, -9, 9), u2 = 2 * h - u1;
        if (Math.abs(Cc) > 30 || Math.abs(u2) > 12 || q < 2 || !squarefree(q) || w1 + w2 === 2 * h || u2 === 0 || u1 === u2 || u1 * u2 === Cc) return null;
        const S = solve2(P(Cc, Bc, 1));
        return radRootAns(`${X2}의 계수가 1인 이차방정식이 있다. ${name(names1, '은/는')} 상수항을 잘못 보고 풀어서 ${nb(X + ' = ' + iq(u1))} 또는 ${ej(nb(X + ' = ' + iq(u2)), '을/를')} 해로 얻었고, ${name(names2, '은/는')} ${X}의 계수를 잘못 보고 풀어서 ${nb(X + ' = ' + iq(w1))} 또는 ${ej(nb(X + ' = ' + iq(w2)), '을/를')} 해로 얻었다. 이 이차방정식의 해를 바르게 구하시오.`, S, 'P1', {
          explain: `${name(names1, '은/는')} ${X}의 계수를 바르게 보았으므로 ${nb(prodH(1, [[1, -u1], [1, -u2]]) + ' = ' + polyH(monic(u1, u2)))}에서 ${X}의 계수는 ${iq(Bc)}이다. ${name(names2, '은/는')} 상수항을 바르게 보았으므로 ${nb(prodH(1, [[1, -w1], [1, -w2]]) + ' = ' + polyH(monic(w1, w2)))}에서 상수항은 ${iq(Cc)}이다. 바른 이차방정식 ${nb(polyH(P(Cc, Bc, 1)) + ' = 0')}을 풀면 ${solH(S.sol)}이다.`,
          facts: { rule: 'wrong' }
        });
      }),
      // ② 무리수인 근을 넣고 유리수 부분과 무리수 부분이 각각 0임을 쓴다(소수 부분을 구하는 꼴은 둘째 차례).
      H('hard-irr', '무리수인 근이 주어질 때 유리수 계수 구하기', '①63', (d, n) => {
        if (n === 0) {
          const A = d.int(1, 3), p = nz(d, -5, 5), t = d.until(() => d.int(2, 11), squarefree), a = -2 * A * p, b = A * (p * p - t);
          if (b === 0) return null;
          const root = nb(iq(p) + ' ' + MINUS + ' ' + rt(t));
          return valsQ(`이차방정식 ${nb(polyH(P(0, 0, A)) + ' + ' + va + X + ' + ' + vb + ' = 0')}의 한 근이 ${root}일 때, 유리수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
            explain: `${nb(X + ' = ')}${root}${tail(t, '을/를')} 대입하여 유리수 부분과 ${rt(t)}${tail(t, '이/가')} 붙은 부분으로 나누면 ${nb('(' + A * (p * p + t) + moreH([[p, va]]) + ' + ' + vb + ') ' + MINUS + ' (' + 2 * A * p + ' + ' + va + ')')}${rt(t)} = 0이다. ${va}, ${vb}가 유리수이므로 두 괄호가 모두 0이어야 한다. 따라서 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
            facts: { calc: [[`-2*${A}*(${p})`, 0], [`${A}*((${p})*(${p})-${t})`, 1]], derived: [2] }
          });
        }
        const t = d.until(() => d.int(2, 40), (v) => squarefree(v)), m = Math.floor(Math.sqrt(t)), c = d.int(1, 9), a = 2 * m, b = m * m - t;
        return valsQ(`${nb(c + ' + ' + rt(t))}의 소수 부분이 이차방정식 ${nb(X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}의 한 근일 때, 유리수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `${nb(m + ' &lt; ' + rt(t) + ' &lt; ' + (m + 1))}이므로 ${nb(c + ' + ' + rt(t))}의 정수 부분은 ${c + m}, 소수 부분은 ${nb(rt(t) + ' ' + MINUS + ' ' + m)}이다. 이것을 대입하여 유리수 부분과 ${rt(t)}${tail(t, '이/가')} 붙은 부분으로 나누면 ${nb('(' + (m * m + t) + ' ' + MINUS + ' ' + (m === 1 ? '' : m) + va + ' + ' + vb + ') + (' + va + ' ' + MINUS + ' ' + 2 * m + ')')}${rt(t)} = 0이다. ${va}, ${vb}가 유리수이므로 ${nb(va + ' = ' + a)}, ${nb(vb + ' = ' + iq(b))}이다.`,
          facts: { calc: [[`2*${m}`, 0], [`${m}*${m}-${t}`, 1]], derived: [m, 2] }
        });
      }, { count: 2 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
