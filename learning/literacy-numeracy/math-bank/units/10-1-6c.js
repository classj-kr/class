// 고등학교 1학년 1학기 6단원 여러 가지 부등식 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 정수인 해의 개수(합)로 상수의 범위를 정할 때 경계의 등호를 아무렇게나 붙인다(끝의 정수가 들어가는지를 직접 넣어 보지 않는다).
//  - 「이차부등식」이 아니라 「부등식」이라고 했을 때 이차항의 계수가 0인 경우를 따로 보지 않는다. 계수의 부호 조건 없이 판별식만 쓴다.
//  - 연립부등식의 해가 주어지면 열린 끝과 닫힌 끝이 어느 부등식에서 오는지 가리지 않는다. 문자가 끝에 닿는 경우(등호)를 빠뜨린다.
//  - f(x + 1) 꼴은 해를 옮기면 되는데 다시 전개하다 길을 잃거나, 이차항의 계수가 음수임을 잊고 부등호를 그대로 둔다.
//  - 「k 의 값에 관계없이」를 x 에 대한 판별식 하나로 끝낸다(k 에 대한 이차식이 늘 양수일 조건을 한 번 더 써야 한다).
//  - 「하나는 실근, 다른 하나는 허근」을 한 경우만 따진다.
//  - 문장제에서 비를 식으로 세우지 못하고 어림으로 맞춘다. 막대를 잘라 삼각형을 만들 때 가장 긴 변이 어느 것인지 경우를 나누지 않는다.
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 그림·상황의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. 상수의 범위를 묻는 유형은 상수를 0.5 간격(경계 둘레는 0.25 간격)으로 넣어 조건을 직접 따져 본 집합과 답을 맞춘다.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, GT, LT, GE, LE, Q, qadd, qsub, qmul, qdiv, qneg, qcmp, isInt, fl, tx, nb, tail, js, V, sup, nz, pm, asQ, sys, ansV } = B.kit.mid;
  const K = B.kit.m1016;
  const { UNIT, STD9, STD10, STD11, X, X2, VA, VK, iq, retry, sourceOf, RH, FLIP, cmpOk, closedR, upR, tm, tg, tq, ta, ts, lx, qx, sideH, ineqH, evS, envAt, holds, gl, gq,
    pc, ALL, norm, inter, uni, has, eqSet, flipC, comp, isAll, setH, linSet, solveLin, solvePL, quadSet, solveQ, verify, intsOf, windowOf, exq, sysF, keep, endJ, ej, lastJ, nj,
    solE, betweenAns, rayAns, orAns, setPick, valsQ, rayH } = K;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const sumE = (list) => list.map((v) => `(${js(Q(v))})`).join('+') + '+0';
  // 상수 a 의 조건 P(a)를 lo~hi 에서 0.5 간격으로 넣어 본 집합(경계는 정수라고 보고 짓는다). 0.25 간격에서 어긋나면 경계가 정수가 아닌 것이므로 null.
  function sampled(P, lo, hi) {
    const parts = [];
    for (let i = lo; i <= hi; i += 1) {
      if (P(Q(i))) parts.push(pc(i, true, i, true, String(i), String(i)));
      if (i < hi) {
        const h = P(Q(2 * i + 1, 2));
        if (h !== P(Q(4 * i + 1, 4)) || h !== P(Q(4 * i + 3, 4))) return null;
        if (h) parts.push(pc(i, false, i + 1, false, String(i), String(i + 1)));
      }
    }
    return norm(parts);
  }
  // 집합을 닫힌 경계·열린 경계 그대로 검사 식으로(수는 그 자체) 적는다.
  const plainE = (S) => S.map((p) => Object.assign({}, p, { le: p.lo && `(${js(p.lo)})`, he: p.hi && `(${js(p.hi)})` }));
  const nums = (S) => [].concat(...S.map((p) => [p.lo, p.hi].filter(Boolean).map((v) => Math.abs(v.p))));

  B.addGroup(UNIT, {
    id: 'hard', title: '단원 종합', standard: STD11,
    types: [
      // ① 정수인 해의 개수(합)가 정해지면 경계가 놓일 칸이 정해진다 — 끝의 등호를 직접 넣어 가린다.
      H('hard-int-sys1', '정수인 해의 개수·합으로 상수의 최댓값 구하기', '①9 심1', (d, n) => {
        if (n === 0) {
          // {kx − a ≥ cx + e, 일차부등식(x ≤ U)} 의 정수인 해가 cnt 개
          const kk = d.int(2, 5), c = d.int(-2, kk - 1), e = d.int(-6, 6), U = d.int(-3, 6), cnt = d.int(3, 6), Kd = kk - c;
          const second = K.linFor(d, '<=', U, d.pick(['c', 'b'])), L1 = [tm(kk, 'x'), tm(-1, 'a')], R1 = ts([c, 'x'], [e, '']);
          const ans = Kd * (U - cnt + 1) - e, top = e === 0 ? VA : `${VA} ${e < 0 ? MINUS : '+'} ${Math.abs(e)}`, low = Kd === 1 ? top : frac(top, Kd);
          const count = (av) => intsOf(U - 30, U + 2, (x) => holds(L1, '>=', R1, x, { a: asQ(av) }) && holds(second.L, second.rel, second.R, x)).length;
          if (count(ans) !== cnt || count(ans + 1) === cnt || count(qadd(Q(ans), Q(1, 2))) === cnt) throw new Error('최댓값 셈이 어긋났다');
          return N(`연립부등식 ${sys([ineqH(L1, '>=', R1), second.h])}을 만족시키는 정수 ${X}의 개수가 ${cnt}일 때, 실수 ${VA}의 최댓값은?`, ans, {
            signed: true,
            explain: `둘째 부등식의 해는 ${setH(second.S)}이고, 첫째 부등식에서 ${nb(`${X} ≥ ${low}`)}이다. 정수가 ${iq(U)}부터 내려가며 ${cnt}개이려면 가장 작은 정수가 ${iq(U - cnt + 1)}이어야 하므로 ${nb(`${iq(U - cnt)} &lt; ${low} ≤ ${iq(U - cnt + 1)}`)}이다(아래 끝이 ${iq(U - cnt + 1)}${lastJ(U - cnt + 1, '과/와')} 같아도 그 정수는 해에 든다). 따라서 ${VA}의 최댓값은 ${iq(ans)}이다.`,
            facts: { calc: [[`(${kk}-(${js(Q(c))}))*((${js(Q(U))})-${cnt}+1)-(${js(Q(e))})+0`, 0]], derived: second.nums.concat([U, Kd]), rule: 'hard-int-sys1-0' }
          });
        }
        // {x + p > q, kx < a + c} 의 정수인 해의 합이 S 일 때 자연수 a 의 최댓값
        const p0 = d.int(-2, 4), kk = d.int(2, 4), c = d.int(-3, 3), len = d.int(2, 4), first = p0 + 1, last = first + len - 1, S0 = (first + last) * len / 2;
        const ans = kk * (last + 1) - c;
        if (ans <= 0 || S0 === 0) return null;
        // 합이 S0 가 되는 정수의 모임이 하나뿐인가(앞에서부터 이어지는 정수의 합)
        const sums = []; let s = 0; for (let m = first; m <= first + 12; m += 1) { s += m; sums.push(s); }
        if (sums.filter((v) => v === S0).length !== 1) return null;
        const L1 = lx(1, d.int(-4, 4)), q = fl(evS(L1, envAt(p0))), L2 = [tm(kk, 'x')], R2 = [tm(1, 'a')].concat(c ? [tm(c, '')] : []);
        const check = (av) => intsOf(first - 2, first + 20, (x) => holds(L1, '>', ts([q, '']), x) && holds(L2, '<', R2, x, { a: Q(av) })).reduce((t, v) => t + v, 0);
        if (check(ans) !== S0 || check(ans + 1) === S0) throw new Error('합으로 정한 최댓값이 어긋났다');
        return N(`${X}에 대한 연립부등식 ${sys([ineqH(L1, '>', ts([q, ''])), ineqH(L2, '<', R2)])}을 만족시키는 모든 정수 ${X}의 값의 합이 ${iq(S0)}${lastJ(S0, '이/가')} 되도록 하는 자연수 ${VA}의 최댓값은?`, ans, {
          explain: `첫째 부등식에서 ${nb(`${X} &gt; ${iq(p0)}`)}이므로 정수는 ${iq(first)}부터이고, 합이 ${iq(S0)}${lastJ(S0, '이/가')} 되려면 ${Array.from({ length: len }, (_, i) => iq(first + i)).join(', ')}이어야 한다. 둘째 부등식에서 ${nb(`${X} &lt; ${frac(`${VA}${c ? ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : ''}`, kk)}`)}이므로 ${nb(`${iq(last)} &lt; ${frac(`${VA}${c ? ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : ''}`, kk)} ≤ ${iq(last + 1)}`)}이다(같으면 ${nj(last + 1, '은/는')} 들지 않는다). 따라서 자연수 ${VA}의 최댓값은 ${ans}이다.`,
          facts: { calc: [[`${kk}*((${js(Q(last))})+1)-(${js(Q(c))})+0`, 0]], derived: [last], rule: 'hard-int-sys1-1' }
        });
      }, { count: 2, standard: STD9 }),
      // ② 비례식 → 두 부등식 → 정수 — 네 단계를 잇는다.
      H('hard-ratio', '비와 인원수가 함께 있는 문제', '①12', (d) => {
        const pairs = [[5, 2], [4, 3], [5, 3], [7, 3], [3, 2], [7, 4], [8, 3]], [u, v] = d.pick(pairs), c = d.int(2, 8);
        // 작년 남 uc x, 여 vc x(x 는 올해 들어온 남녀 각각의 수). 올해 (uc + 1)x : (vc + 1)x
        const g = (A2, B2) => (B2 ? g(B2, A2 % B2) : A2), up = u * c + 1, vp = v * c + 1, gg = g(up, vp), U2 = up / gg, V2 = vp / gg, tot = (u + v) * c;
        const x0 = d.int(4, 15), Mm = d.until(() => 10 * d.int(Math.ceil((tot * x0 + 1) / 10), Math.floor(((tot + 2) * x0 - 1) / 10)), () => true);
        const ok = (x) => tot * x < Mm && (tot + 2) * x > Mm, list = intsOf(1, 200, (x) => ok(x.p));
        if (list.length !== 1 || list[0] !== x0) return null;
        return N(`어느 동아리의 작년 회원은 ${Mm}명보다 적었고 남녀 회원 수의 비는 ${u} : ${v}${tail(v, '이었/였')}다. 올해 남녀 회원이 같은 수만큼 새로 들어와 남녀 회원 수의 비가 ${U2} : ${V2}${tail(V2, '이/가')} 되었고, 전체 회원은 ${Mm}명보다 많아졌다. 올해 새로 들어온 회원은 모두 몇 명인가?`, 2 * x0, {
          unit: '명',
          explain: `작년 남녀 회원을 ${u}${VK}명, ${v}${VK}명, 올해 남녀 각각 ${X}명이 들어왔다고 하면 ${nb(`(${u}${VK} + ${X}) : (${v}${VK} + ${X}) = ${U2} : ${V2}`)}에서 ${nb(`${VK} = ${c}${X}`)}이다. 작년 회원은 ${nb(`${tot}${X} &lt; ${Mm}`)}, 올해 회원은 ${nb(`${tot + 2}${X} &gt; ${Mm}`)}이므로 ${nb(`${tx(Q(Mm, tot + 2))} &lt; ${X} &lt; ${tx(Q(Mm, tot))}`)}이고, 자연수 ${X}는 ${x0}뿐이다. 따라서 새로 들어온 회원은 ${2 * x0}명이다.`,
          facts: { calc: [[`2*(((${Mm}-1)-((${Mm}-1)%(${tot})))/(${tot}))`, 0]], derived: [tot, 2, 1], rule: 'hard-ratio' }
        });
      }, { standard: STD9 }),
      // ① 가장 긴 변이 어느 도막인지 경우를 나누어야 한다(모든 변이 둘레의 반보다 짧다).
      H('hard-straw', '막대를 잘라 만든 삼각형의 조건', '①13', (d) => {
        const k = d.int(2, 3), unit = 2 * k * (k + 1), Lc = unit * d.int(1, Math.floor(60 / unit)), lo = Lc / (2 * (k + 1)), hi = Lc / (2 * k);
        const S = norm([pc(lo, false, hi, false, `(${Lc})/(2*(${k}+1))`, `(${Lc})/(2*${k})`)]);
        verify(S, (x) => { const a = x, b = qmul(Q(k), x), c = qsub(Q(Lc), qmul(Q(k + 1), x)); if (c.p <= 0 || a.p <= 0) return false; return qcmp(qadd(a, b), c) > 0 && qcmp(qadd(b, c), a) > 0 && qcmp(qadd(a, c), b) > 0; });
        return betweenAns(`길이가 ${Lc} cm인 철사를 잘라 길이가 ${X} cm, ${k}${X} cm인 두 도막을 만들고, 남은 도막과 함께 세 도막을 세 변으로 하는 삼각형을 만들려고 한다. ${X}의 값의 범위를 구하시오. (단, 철사의 굵기는 생각하지 않는다.)`, S, {
          signed: false,
          explain: `남은 도막은 ${nb(`(${Lc} ${MINUS} ${k + 1}${X})`)} cm이다. 삼각형이 되려면 가장 긴 변이 나머지 두 변의 합보다 짧아야 하는데, 세 변의 합이 ${Lc}이므로 이는 세 변이 모두 ${Lc / 2}보다 짧다는 것과 같다. ${nb(`${k}${X} &lt; ${Lc / 2}`)}에서 ${nb(`${X} &lt; ${hi}`)}, ${nb(`${Lc} ${MINUS} ${k + 1}${X} &lt; ${Lc / 2}`)}에서 ${nb(`${X} &gt; ${lo}`)}이므로 ${setH(S)}이다.`,
          facts: { rule: 'hard-straw' }
        });
      }, { standard: STD9 }),
      // ① 정수의 개수가 홀수로 정해질 때 끝의 정수가 드는지(< 와 ≤)를 가려야 한다.
      H('hard-abs-int-range', '정수인 해의 개수로 양수 a 의 범위 정하기', '①22', (d) => {
        const c = nz(d, -8, 8), k = d.pick([2, 3, 4]), nn = d.int(2, 6), rel = d.pick(['<', '<=']), cnt = 2 * nn + 1;
        const P = (a) => intsOf(c - 40, c + 40, (x) => holds([ta(1, lx(1, -c))], rel, [tm(k, 'a')], x, { a })).length === cnt;
        const S = rel === '<' ? norm([pc(Q(nn, k), false, Q(nn + 1, k), true)]) : norm([pc(Q(nn, k), true, Q(nn + 1, k), false)]);
        for (let t = 0; t <= 4 * (nn + 2); t += 1) { const a = Q(t, 4 * k); if (a.p > 0 && P(a) !== has(S, a)) throw new Error('정수 개수의 범위가 어긋났다'); }
        const wrong = (lc, hc, sh) => norm([pc(Q(nn + sh, k), lc, Q(nn + 1 + sh, k), hc)]);
        return setPick(d, `부등식 ${nb(`|${X} ${c < 0 ? '+' : MINUS} ${Math.abs(c)}| ${RH[rel]} ${k}${VA}`)}를 만족시키는 정수 ${X}의 개수가 ${cnt}일 때, 양수 ${VA}의 값의 범위는?`, S, [flipC(S), wrong(false, false, 0), wrong(true, true, 0), wrong(rel === '<' ? false : true, rel === '<', -1), wrong(rel === '<' ? false : true, rel === '<', 1)], {
          name: VA,
          explain: `해는 ${nb(`${iq(c)} ${MINUS} ${k}${VA} ${RH[rel]} ${X} ${RH[rel]} ${iq(c)} + ${k}${VA}`)}이다. 정수 ${iq(c)}${lastJ(c, '을/를')} 가운데에 두고 양쪽으로 ${nn}개씩 들어야 ${cnt}개이므로 ${nb(`${k}${VA}`)}${rel === '<' ? `가 ${nn}보다 크고 ${nn + 1} 이하` : `가 ${nn} 이상 ${nn + 1} 미만`}이어야 한다(${rel === '<' ? `${k}${VA} = ${nn + 1}이어도 끝의 정수는 들지 않는다` : `${k}${VA} = ${nn}이면 끝의 정수까지 든다`}). 따라서 ${setH(S, VA)}이다.`,
          facts: { rule: 'hard-abs-int-range' }
        });
      }, { standard: STD10 }),
      // ① 이차항의 계수가 음수이므로 해가 「사이」이고, f(x + h) 의 해는 해를 옮긴 것이다.
      H('hard-shift', 'f(x + h) 꼴로 옮긴 이차부등식의 정수인 해의 합', '①35', (d) => {
        const p = d.int(-5, 3), q = d.int(p + 1, p + 5), h = d.pick([-2, -1, 1, 2]), neg = d.bool();
        // neg: ax² + bx + c > 0 의 해가 p < x < q (a < 0) → a(x + h)² + b(x + h) + c ≥ 0
        // 아니면: ax² + bx + c < 0 의 해가 x < p 또는 x > q (a < 0) → a(x + h)² + b(x + h) + c ≥ 0 도 같은 꼴
        const rel0 = neg ? '>' : '<', S0 = neg ? norm([pc(p, false, q, false)]) : norm([pc(null, false, p, false), pc(q, false, null)]);
        const S = norm([pc(p - h, true, q - h, true)]), list = intsOf(p - h, q - h, (x) => has(S, x)), sum = list.reduce((t, v) => t + v, 0);
        const a = -1, f = (x) => qmul(Q(a), qmul(qsub(x, Q(p)), qsub(x, Q(q))));
        verify(S, (x) => f(qadd(x, Q(h))).p >= 0);
        const hx = `(${X} ${h < 0 ? MINUS : '+'} ${Math.abs(h)})`;
        return N(`${X}에 대한 이차부등식 ${nb(`${VA}${X2} + ${V('b')}${X} + ${V('c')} ${RH[rel0]} 0`)}의 해가 ${setH(S0)}일 때, ${X}에 대한 부등식 ${nb(`${VA}${hx}${sup(2)} + ${V('b')}${hx} + ${V('c')} ≥ 0`)}을 만족시키는 모든 정수 ${X}의 값의 합은? (단, ${VA}, ${V('b')}, ${V('c')}는 실수)`, sum, {
          signed: true,
          explain: `해가 ${setH(S0)}이므로 ${VA} &lt; 0이고 ${nb(`${VA}${X2} + ${V('b')}${X} + ${V('c')} = ${VA}(${sideH(lx(1, -p))})(${sideH(lx(1, -q))})`)}이다. ${nb(`${VA}${X2} + ${V('b')}${X} + ${V('c')} ≥ 0`)}의 해는 ${nb(`${iq(p)} ≤ ${X} ≤ ${iq(q)}`)}이므로, ${X} 대신 ${hx}${tail(Math.abs(h), '을/를')} 넣은 부등식의 해는 ${nb(`${iq(p)} ≤ ${X} ${h < 0 ? MINUS : '+'} ${Math.abs(h)} ≤ ${iq(q)}`)}, 곧 ${setH(S)}이다. 정수는 ${list.map(iq).join(', ')}이고 합은 ${iq(sum)}이다.`,
          facts: { calc: [[sumE(list), 0]], derived: list, rule: 'hard-shift' }
        });
      }),
      // ① 「부등식」이라고 했으므로 이차항의 계수가 0인 경우를 따로 본다.
      H('hard-lead-zero', '이차항의 계수가 0일 수 있는 부등식이 늘 성립할 조건', '①38', (d) => {
        const p = d.int(-4, 4), q = d.pick([1, -1, 2, -2]), c = d.int(q * q + 1, q * q * 5 + 2);
        const T = ts([1, 'm'], [p, '']), L = [tg(1, T, 'X', true), tg(2 * q, T, 'x', true), tm(c, '')];
        const always = (m) => { const g = gq(L, { m: Q(m) }); if (g.a.p === 0) return g.b.p === 0 && g.c.p > 0; const D = qsub(qmul(g.b, g.b), qmul(Q(4), qmul(g.a, g.c))); return g.a.p > 0 && D.p < 0; };
        const flags = [], list = [];
        for (let m = -p - 6; m <= -p + Math.ceil(c / (q * q)) + 4; m += 1) { const t = always(m); flags.push(t); if (t) list.push(m); }
        if (list.length < 2 || !flags.some((t) => !t)) return null;
        return N(`모든 실수 ${X}에 대하여 부등식 ${nb(`${sideH(L)} &gt; 0`)}이 성립하도록 하는 정수 ${V('m')}의 개수는?`, list.length, {
          unit: '개',
          explain: `(ⅰ) ${nb(`${sideH(T)} = 0`)}이면 ${nb(`${c} &gt; 0`)}이므로 늘 성립한다. (ⅱ) ${nb(`${sideH(T)} ≠ 0`)}이면 이차부등식이므로 ${nb(`${sideH(T)} &gt; 0`)}이고 ${nb(`${frac(V('D'), 4)} = ${q * q === 1 ? '' : q * q}(${sideH(T)})${sup(2)} ${MINUS} ${c}(${sideH(T)}) &lt; 0`)}이어야 한다. 곧 ${nb(`0 &lt; ${sideH(T)} &lt; ${tx(Q(c, q * q))}`)}이다. (ⅰ), (ⅱ)에서 정수 ${V('m')}은 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
          facts: { count: flags, rule: 'hard-lead-zero' }
        });
      }),
      // ② x 에 대한 판별식 → k 에 대한 이차부등식 → 그 판별식(세 단계)
      H('hard-any-k', '다른 문자의 값에 관계없이 실근을 가질 조건', '①40', (d) => {
        const r = d.pick([1, 1, 2, -1]), s = d.int(-9, 9), strict = d.bool();
        if (s % r) return null;
        const m = -s / r, rel = r > 0 ? (strict ? '<' : '<=') : (strict ? '>' : '>=');
        const E = [tm(1, 'X'), tg(2, ts([1, 'a'], [1, 'k']), 'x', true), tm(r, 'a')].concat(s ? [tm(s, '')] : []);
        // a 를 넣어 k 에 대한 판별식으로 직접 확인
        for (const av of [m - 1, m, m + 1]) {
          const t = r * av + s, ok = strict ? t < 0 : t <= 0, want = cmpOk(av - m, rel);
          if (ok !== want) throw new Error('k 에 관계없는 조건이 어긋났다');
        }
        return rayAns(`${X}에 대한 이차방정식 ${nb(`${sideH(E)} = 0`)}이 실수 ${VK}의 값에 관계없이 항상 ${strict ? '서로 다른 두 실근' : '실근'}을 갖도록 하는 실수 ${VA}의 값의 범위를 구하시오.`, [rel === '<' || rel === '<=' ? pc(null, false, m, rel === '<=', null, `(0-(${js(Q(s))}))/(${r})`) : pc(m, rel === '>=', null, false, `(0-(${js(Q(s))}))/(${js(Q(r))})`, null)], {
          name: VA,
          explain: `${nb(`${frac(V('D'), 4)} = (${VA} + ${VK})${sup(2)} ${MINUS} (${sideH(ts([r, 'a'], [s, '']))}) ${strict ? '&gt;' : '≥'} 0`)}, 곧 ${nb(`${VK}${sup(2)} + 2${VA}${VK} + ${VA}${sup(2)} ${MINUS} (${sideH(ts([r, 'a'], [s, '']))}) ${strict ? '&gt;' : '≥'} 0`)}이 모든 실수 ${VK}에 대하여 성립해야 한다. 이는 ${VK}에 대한 이차부등식이므로 그 판별식이 ${strict ? '음수' : '0 이하'}이어야 한다: ${nb(`${VA}${sup(2)} ${MINUS} {${VA}${sup(2)} ${MINUS} (${sideH(ts([r, 'a'], [s, '']))})} = ${sideH(ts([r, 'a'], [s, '']))} ${strict ? '&lt;' : '≤'} 0`)}. 따라서 ${rayH(rel, m, VA)}이다.`,
          facts: { rule: 'hard-any-k' }
        });
      }),
      // ① 열린 끝과 닫힌 끝이 어느 부등식에서 오는지, 문자가 끝에 닿을 때의 등호(네 단계)
      H('hard-range-in', '연립이차부등식의 해로 상수의 범위 정하기 — 사이', '①46', (d) => {
        const p1 = d.int(-5, 1), p2 = d.int(p1 + 2, p1 + 6), hh = d.int(p2 + 1, p2 + 4);
        const L1 = qx(1, -(p1 + p2), p1 * p2), L2 = [tm(1, 'X'), tg(-1, ts([1, 'a'], [hh, '']), 'x', true), tm(hh, 'a')];
        const target = norm([pc(p2, false, hh, true)]);
        const solveFor = (a) => { const g = gq(L2, { a }); const s2 = quadSet(g.a, g.b, g.c, '<='); return s2 && norm(inter(quadSet(Q(1), Q(-(p1 + p2)), Q(p1 * p2), '>').S, s2.S)); };
        const S = sampled((a) => { const s = solveFor(a); return Boolean(s) && eqSet(s, target); }, p1 - 6, hh + 6);
        if (!S || S.length !== 1 || S[0].lo === null || S[0].hi === null) return null;
        return betweenAns(`연립부등식 ${sys([ineqH(L1, '>', ts([0, ''])), ineqH(L2, '<=', ts([0, '']))])}의 해가 ${nb(`${iq(p2)} &lt; ${X} ≤ ${iq(hh)}`)}일 때, 실수 ${VA}의 값의 범위를 구하시오.`, plainE(S), {
          name: VA,
          explain: `첫째 부등식의 해는 ${nb(`${X} &lt; ${iq(p1)}`)} 또는 ${nb(`${X} &gt; ${iq(p2)}`)}이고, 둘째 부등식은 ${nb(`(${X} ${MINUS} ${VA})(${sideH(lx(1, -hh))}) ≤ 0`)}이다. 닫힌 끝 ${iq(hh)}${lastJ(hh, '은/는')} 둘째 부등식에서 오므로 둘째 부등식의 해는 ${VA}와 ${iq(hh)} 사이이고, 열린 끝 ${iq(p2)}${lastJ(p2, '은/는')} 첫째 부등식에서 온다. 따라서 ${VA} ≤ ${iq(p2)}이어야 하고, ${nb(`${X} &lt; ${iq(p1)}`)} 쪽과 겹치지 않으려면 ${VA} ≥ ${iq(p1)}이어야 한다(${VA} = ${iq(p1)}이어도 ${nj(p1, '은/는')} 첫째 부등식의 해가 아니다). 따라서 ${setH(S, VA)}이다.`,
          facts: { rule: 'hard-range-in', derived: nums(S) }
        });
      }),
      H('hard-range-ray', '연립이차부등식의 해로 상수의 범위 정하기 — 한쪽', '①46', (d) => {
        const p1 = d.int(-3, 3), p2 = d.int(p1 + 3, p1 + 6), hh = d.int(p1 + 1, p2 - 1);
        const L1 = qx(1, -(p1 + p2), p1 * p2), L2 = [tm(1, 'X'), tg(-1, ts([1, 'a'], [hh, '']), 'x', true), tm(hh, 'a')];
        const target = norm([pc(hh, true, p2, false)]);
        const solveFor = (a) => { const g = gq(L2, { a }); const s2 = quadSet(g.a, g.b, g.c, '>='); return s2 && norm(inter(quadSet(Q(1), Q(-(p1 + p2)), Q(p1 * p2), '<').S, s2.S)); };
        const S = sampled((a) => { const s = solveFor(a); return Boolean(s) && eqSet(s, target); }, p1 - 8, p2 + 8);
        // 넣어 본 범위의 아래 끝(p1 − 8)부터 p1 까지 이어지면 한쪽 범위 a ≤ p1 이다.
        if (!S || S.length !== 1 || S[0].lo === null || qcmp(S[0].lo, Q(p1 - 8)) !== 0 || !S[0].lc || S[0].hi === null || qcmp(S[0].hi, Q(p1)) !== 0 || !S[0].hc) return null;
        const R = [pc(null, false, p1, true, null, `(${js(Q(p1))})`)];
        return rayAns(`연립부등식 ${sys([ineqH(L1, '<', ts([0, ''])), ineqH(L2, '>=', ts([0, '']))])}의 해가 ${nb(`${iq(hh)} ≤ ${X} &lt; ${iq(p2)}`)}일 때, 실수 ${VA}의 값의 범위를 구하시오.`, R, {
          name: VA,
          explain: `첫째 부등식의 해는 ${nb(`${iq(p1)} &lt; ${X} &lt; ${iq(p2)}`)}이고, 둘째 부등식은 ${nb(`(${X} ${MINUS} ${VA})(${sideH(lx(1, -hh))}) ≥ 0`)}이다. 닫힌 끝 ${iq(hh)}${lastJ(hh, '은/는')} 둘째 부등식에서 오므로 둘째 부등식의 해는 ${nb(`${X} ≤ ${VA}`)} 또는 ${nb(`${X} ≥ ${iq(hh)}`)}이고 ${VA} ≤ ${iq(hh)}이다. ${nb(`${iq(p1)} &lt; ${X} ≤ ${VA}`)} 쪽이 해에 섞이지 않으려면 ${VA} ≤ ${iq(p1)}이어야 한다(${VA} = ${iq(p1)}이면 그쪽은 비어 있다). 따라서 ${rayH('<=', p1, VA)}이다.`,
          facts: { rule: 'hard-range-ray', derived: [p1] }
        });
      }),
      // ② 정수의 개수 조건으로 경우를 나누어 상수를 모두 찾는다.
      H('hard-int-k-sum', '정수인 해의 개수로 정수 k 의 값 모두 찾기', '①47', (d, n) => {
        let rows, label, find;
        if (n === 0) {
          const p1 = d.int(-3, 1), p2 = d.int(p1 + 2, p1 + 5), hh = d.int(p2, p2 + 3), cnt = d.int(4, 7);
          const L1 = qx(1, -(p1 + p2), p1 * p2), L2 = [tm(1, 'X'), tg(-1, ts([hh, ''], [1, 'k']), 'x', true), tm(hh, 'k')];
          rows = [ineqH(L1, '>=', ts([0, ''])), ineqH(L2, '<=', ts([0, '']))];
          // 둘째 부등식의 해는 k 와 hh 사이이므로 그 밖의 정수는 볼 필요가 없다.
          find = (kv) => intsOf(Math.min(kv, hh) - 2, Math.max(kv, hh) + 2, (x) => holds(L1, '>=', ts([0, '']), x) && holds(L2, '<=', ts([0, '']), x, { k: Q(kv) })).length === cnt;
          label = cnt;
        } else {
          const cc = d.int(3, 9), p1 = d.int(Math.floor(cc / 2) - 3, Math.floor(cc / 2) - 1), p2 = d.int(Math.ceil(cc / 2) + 1, Math.ceil(cc / 2) + 3), cnt = d.int(3, 6);
          const L1 = [ta(1, lx(2, -cc))], L2 = qx(1, -(p1 + p2), p1 * p2);
          rows = [ineqH(L1, '<', [tm(1, 'k')]), ineqH(L2, '>=', ts([0, '']))];
          // 첫째 부등식의 해는 cc/2 에서 k/2 보다 덜 떨어진 범위이다.
          find = (kv) => kv > 0 && intsOf(Math.floor((cc - kv) / 2) - 2, Math.ceil((cc + kv) / 2) + 2, (x) => holds(L1, '<', [tm(1, 'k')], x, { k: Q(kv) }) && holds(L2, '>=', ts([0, '']), x)).length === cnt;
          label = cnt;
        }
        // 개수는 k 가 바깥으로 갈수록 늘기만 하므로 ±21 에서 개수를 넘으면 그 밖에는 답이 없다.
        const ks = intsOf(-20, 20, (kv) => find(kv.p));
        if (ks.length < 1 || ks.length > 4 || find(-21) || find(21)) return null;
        const sum = ks.reduce((t, v) => t + v, 0);
        return N(`${X}에 대한 연립부등식 ${sys(rows)}을 만족시키는 정수 ${X}의 개수가 ${label}이 되도록 하는 모든 정수 ${VK}의 값의 합은?`.replace(/(\d)이 되도록/, (m, g) => g + tail(Number(g), '이/가') + ' 되도록'), sum, {
          signed: true,
          explain: `${n === 0 ? `첫째 부등식의 해는 두 근의 바깥(끝 포함)이고, 둘째 부등식의 해는 ${VK}와 다른 한 근 사이(끝 포함)이다.` : `첫째 부등식의 해는 가운데 수에서 양쪽으로 ${frac(VK, 2)}보다 덜 떨어진 범위이고, 둘째 부등식의 해는 두 근의 바깥(끝 포함)이다.`} 두 해를 수직선 위에 놓고 ${VK}의 값을 하나씩 바꾸어 가며 공통인 정수의 개수를 세면 개수가 ${label}${tail(label, '이/가')} 되는 정수 ${VK}는 ${ks.map(iq).join(', ')}이다. 따라서 합은 ${iq(sum)}이다.`,
          facts: { calc: [[sumE(ks), 0]], derived: ks, rule: 'hard-int-k-sum-' + n }
        });
      }, { count: 2 }),
      H('hard-int-k-range', '자연수(정수)인 해의 조건으로 상수의 범위 정하기', '①47', (d, n) => {
        let rows, P, text;
        if (n === 0) {
          // {(x + 1)(2x − r2) > 0 꼴, (x − h)(x − a + c) < 0} 을 만족시키는 자연수가 단 하나
          const r1 = d.int(-3, -1), num = d.int(1, 7), h = d.int(1, 2), c = d.int(-3, 3);
          const L1 = qx(2, -(2 * r1 + num), r1 * num), L2 = [tm(1, 'X'), tg(-1, ts([1, 'a'], [h - c, '']), 'x', true), tm(h, 'a')].concat(c ? [tm(-h * c, '')] : []);
          rows = [ineqH(L1, '>', ts([0, ''])), ineqH(L2, '<', ts([0, '']))];
          P = (a) => intsOf(1, 24, (x) => holds(L1, '>', ts([0, '']), x) && holds(L2, '<', ts([0, '']), x, { a })).length === 1;
          text = '을 만족시키는 자연수 ' + X + '가 단 하나 존재하도록 하는 실수 ' + VA + '의 값의 범위를 구하시오.';
        } else {
          // {[u, v] 의 이차부등식, (x + w)(x − a) < 0} 을 만족시키는 정수의 합이 S
          const u = d.int(-3, 3), v = d.int(u + 2, u + 5), w = d.int(1, 3), take = d.int(1, v - u);
          const target = Array.from({ length: take }, (_, i) => u + i).reduce((t, x) => t + x, 0);
          const L1 = qx(1, -(u + v), u * v), L2 = [tm(1, 'X'), tg(1, ts([w, ''], [-1, 'a']), 'x', true), tm(-w, 'a')];
          rows = [ineqH(L1, '<=', ts([0, ''])), ineqH(L2, '<', ts([0, '']))];
          P = (a) => a.p > 0 && intsOf(u - 1, v + 1, (x) => holds(L1, '<=', ts([0, '']), x) && holds(L2, '<', ts([0, '']), x, { a })).reduce((t, x) => t + x, 0) === target && intsOf(u - 1, v + 1, (x) => holds(L1, '<=', ts([0, '']), x) && holds(L2, '<', ts([0, '']), x, { a })).length === take;
          text = `을 만족시키는 모든 정수 ${X}의 값의 합이 ${target}${tail(Math.abs(target), '이/가')} 되도록 하는 양수 ${VA}의 값의 범위를 구하시오.`;
        }
        const S = sampled(P, -12, 16);
        if (!S || S.length !== 1 || S[0].lo === null || S[0].hi === null || qcmp(S[0].lo, S[0].hi) === 0) return null;
        return betweenAns(`${X}에 대한 연립부등식 ${sys(rows)}${text}`, plainE(S), {
          name: VA,
          explain: `첫째 부등식의 해를 수직선 위에 나타내고, 둘째 부등식의 해의 한 끝 ${VA}를 움직이며 조건에 맞는 정수가 ${n === 0 ? '하나' : '정해진 것'}만 들어가는 범위를 찾는다. ${VA}가 끝 정수에 닿을 때 그 정수가 해에 드는지(등호)를 직접 넣어 가리면 ${setH(S, VA)}이다.`,
          facts: { rule: 'hard-int-k-range-' + n, derived: nums(S) }
        });
      }, { count: 2 }),
      // ① 두 구간 가운데 한쪽에는 늘 정수가 없음을 보고, 다른 쪽의 끝(무리수)을 가른다.
      H('hard-int-none', '정수인 해가 없을 조건으로 상수의 최댓값', '심4', (d) => {
        const s = d.int(2, 4), t = d.int(5, 12), a0 = s - 1;
        if (Math.sqrt(t + 1) <= a0 + 0.2) return null;
        const L1 = [tm(1, 'X'), tg(-1, ts([1, 'A'], [-s, '']), 'x', true), tm(-s, 'A')], L2 = [tm(1, 'X'), tg(1, ts([1, 'a'], [-t, '']), 'x', true), tm(-t, 'a')];
        const none = (av) => intsOf(-40, 200, (x) => holds(L1, '<', ts([0, '']), x, { a: av }) && holds(L2, '>', ts([0, '']), x, { a: av })).length === 0;
        for (const av of [Q(10 * a0 + 1, 10), Q(Math.floor(Math.sqrt(t + 1) * 100 - 1), 100)]) if (qcmp(av, Q(a0)) > 0 && !none(av)) throw new Error('정수가 없을 조건이 어긋났다');
        if (none(Q(Math.ceil(Math.sqrt(t + 1) * 100 + 1), 100))) throw new Error('최댓값 너머에서도 정수가 없다');
        return N(`${nb(`${VA} &gt; ${a0}`)}일 때, ${X}에 대한 연립부등식 ${sys([ineqH(L1, '<', ts([0, ''])), ineqH(L2, '>', ts([0, '']))])}을 만족시키는 정수 ${X}가 존재하지 않도록 하는 실수 ${VA}의 최댓값을 ${V('M')}이라 할 때, ${V('M')}${sup(2)}의 값은?`, t + 1, {
          explain: `첫째 부등식은 ${nb(`(${X} ${MINUS} ${VA}${sup(2)})(${X} + ${s}) &lt; 0`)}이므로 ${nb(`${MINUS}${s} &lt; ${X} &lt; ${VA}${sup(2)}`)}, 둘째 부등식은 ${nb(`(${X} + ${VA})(${X} ${MINUS} ${t}) &gt; 0`)}이므로 ${nb(`${X} &lt; ${MINUS}${VA}`)} 또는 ${nb(`${X} &gt; ${t}`)}이다. ${nb(`${MINUS}${s} &lt; ${X} &lt; ${MINUS}${VA}`)} 쪽에는 ${VA} &gt; ${a0}이므로 정수가 없다. ${nb(`${t} &lt; ${X} &lt; ${VA}${sup(2)}`)} 쪽에 정수 ${nj(t + 1, '이/가')} 들지 않으려면 ${nb(`${VA}${sup(2)} ≤ ${t + 1}`)}이어야 한다. 따라서 ${V('M')}${sup(2)} = ${t + 1}이다.`,
          facts: { calc: [[`${t}+1`, 0]], rule: 'hard-int-none' }
        });
      }),
      // ① 구간이 바깥 범위에 닿기만 하면(끝이 같으면) 해가 없다 — 등호를 가려야 한다.
      H('hard-has-sol', '연립부등식이 해를 가질 조건', '①48', (d) => {
        const p1 = d.int(-6, 2), r = d.int(1, 3), p2 = d.int(p1 + 2 * r + 1, p1 + 2 * r + 6), rel = d.pick(['<=', '<']);
        const L1 = qx(1, -(p1 + p2), p1 * p2), L2 = [ta(1, ts([1, 'x'], [-1, 'a']))];
        const s1 = quadSet(Q(1), Q(-(p1 + p2)), Q(p1 * p2), '>').S;
        const P = (a) => inter(s1, [pc(qsub(a, Q(r)), rel === '<=', qadd(a, Q(r)), rel === '<=')]).length > 0;
        const S = sampled(P, p1 - 10, p2 + 10);
        if (!S || S.length !== 2 || S[0].lo !== null && qcmp(S[0].lo, Q(p1 - 10)) !== 0 || S[1].hi !== null && qcmp(S[1].hi, Q(p2 + 10)) !== 0) return null;
        const R = norm([pc(null, false, S[0].hi, S[0].hc, null, `(${js(S[0].hi)})`), pc(S[1].lo, S[1].lc, null, false, `(${js(S[1].lo)})`, null)]);
        return orAns(`연립부등식 ${sys([ineqH(L1, '>', ts([0, ''])), ineqH(L2, rel, ts([r, '']))])}이 해를 갖도록 하는 실수 ${VA}의 값의 범위를 구하시오.`, R, {
          name: VA,
          explain: `첫째 부등식의 해는 ${nb(`${X} &lt; ${iq(p1)}`)} 또는 ${nb(`${X} &gt; ${iq(p2)}`)}이고, 둘째 부등식의 해는 ${nb(`${VA} ${MINUS} ${r} ${RH[rel]} ${X} ${RH[rel]} ${VA} + ${r}`)}이다. 이 구간이 ${nb(`${iq(p1)} ≤ ${X} ≤ ${iq(p2)}`)} 안에 갇히면 해가 없다(끝이 ${iq(p1)}${lastJ(p1, '이나/나')} ${iq(p2)}에 닿기만 해도 그 수는 첫째 부등식의 해가 아니다). 따라서 ${setH(R, VA)}이다.`,
          facts: { rule: 'hard-has-sol', derived: nums(R) }
        });
      }),
      // ② 두 경우(실근·허근, 허근·실근)를 각각 풀어 합친다.
      H('hard-one-real', '하나는 실근, 다른 하나는 허근을 가질 조건', '①56', (d) => {
        const mk = () => {
          const b1 = d.pick([1, 2]), b0 = d.int(-3, 3), c1 = d.int(-3, 3), c0 = d.int(-4, 6), half = d.bool();
          // x² + 2(b1 a + b0)x + c1 a + c0  또는  x² + (b1 a + b0)x + c1 a + c0
          const B1 = half ? 2 * b1 : b1, B0 = half ? 2 * b0 : b0, al = B1 * B1, be = 2 * B1 * B0 - 4 * c1, ga = B0 * B0 - 4 * c0;
          const pos = quadSet(Q(al), Q(be), Q(ga), '>'), neg = quadSet(Q(al), Q(be), Q(ga), '<');
          if (!pos || !neg || !neg.S.length || isAll(pos.S)) return null;
          const coefB = half ? [tg(2, ts([b1, 'a'], [b0, '']), 'x', true)] : b0 === 0 ? [tm(b1, 'ax')] : [tg(1, ts([b1, 'a'], [b0, '']), 'x', true)];
          return { E: [tm(1, 'X')].concat(coefB, ts([c1, 'a'], [c0, '']).filter((t) => t.c.p !== 0)), pos: norm(pos.S), neg: norm(neg.S), al, be, ga };
        };
        const e1 = mk(), e2 = mk();
        if (!e1 || !e2) return null;
        const S = uni(inter(e1.pos, e2.neg), inter(e1.neg, e2.pos));
        if (!S.length || S.some((p) => p.lo === null || p.hi === null) || S.length !== 2) return null;
        const [w0, w1] = windowOf(S), Dv = (e, av) => { const g = gq(e.E, { a: Q(av) }); return qsub(qmul(g.b, g.b), qmul(Q(4), qmul(g.a, g.c))).p; };
        const pred = (av) => (Dv(e1, av) > 0 && Dv(e2, av) < 0) || (Dv(e1, av) < 0 && Dv(e2, av) > 0);
        const flags = []; const list = [];
        for (let av = w0; av <= w1; av += 1) { flags.push(pred(av)); if (pred(av)) list.push(av); }
        if (list.length < 2 || list.length > 9 || list.some((v) => !has(S, Q(v)))) return null;
        return N(`${X}에 대한 두 이차방정식 ${nb(`${sideH(e1.E)} = 0`)}, ${nb(`${sideH(e2.E)} = 0`)} 가운데 하나는 서로 다른 두 실근을 갖고 다른 하나는 허근을 갖도록 하는 정수 ${VA}의 개수는?`, list.length, {
          unit: '개',
          explain: `두 판별식을 ${V('D')}₁, ${V('D')}₂라 하면 (ⅰ) ${nb(`${V('D')}₁ &gt; 0, ${V('D')}₂ &lt; 0`)}에서 ${setH(inter(e1.pos, e2.neg), VA)}, (ⅱ) ${nb(`${V('D')}₁ &lt; 0, ${V('D')}₂ &gt; 0`)}에서 ${setH(inter(e1.neg, e2.pos), VA)}이다. 둘을 합한 범위의 정수 ${VA}는 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
          facts: { count: flags, rule: 'hard-one-real' }
        });
      }),
      // ① 부등식의 해가 닫힌 구간이면 이차항의 계수가 음수, 중근은 접한다는 뜻(심화 기출)
      H('hard-tangent', '부등식의 해와 중근 조건으로 이차함수 정하기', '심2', (d) => {
        const u = d.int(-3, 2), v = d.int(u + 1, u + 3), m = d.int(-3, 3), nn = d.int(-4, 4), p = d.int(-4, 4), q = d.int(-4, 4);
        // f(x) = A(x − u)(x − v) − mx − nn (A < 0). f(x) − px − q 가 중근
        const c2 = (u - v) ** 2, c1 = 2 * (u + v) * (m + p) + 4 * (nn + q), c0 = (m + p) ** 2;
        const roots = quadSet(Q(c2), Q(c1), Q(c0), '<=');
        if (!roots || !roots.S.length) return null;
        const cand = [roots.S[0].lo, roots.S[0].hi].filter((v2, i, all) => v2 && v2.p < 0 && isInt(v2) && all.findIndex((w) => w && qcmp(w, v2) === 0) === i);
        const negs = [roots.S[0].lo, roots.S[0].hi].filter((v2) => v2 && v2.p < 0);
        if (cand.length !== 1 || new Set(negs.map((v2) => fl(v2))).size !== 1) return null;
        const A = cand[0].p, w = d.until(() => d.int(-3, 4), (t) => t !== u && t !== v), fw = A * (w - u) * (w - v) - m * w - nn;
        if (A < -4 || Math.abs(fw) > 60) return null;
        const fx = (x) => A * (x - u) * (x - v) - m * x - nn;
        // 확인: f(x) ≥ −mx − nn 의 해가 [u, v], f(x) − px − q 의 판별식 0
        const Bq = -A * (u + v) - m - p, Cq = A * u * v - nn - q;
        if (Bq * Bq - 4 * A * Cq !== 0 || !(fx(u) + m * u + nn === 0 && fx(v) + m * v + nn === 0)) throw new Error('이차함수 짓기가 어긋났다');
        const g1 = ts([-m, 'x'], [-nn, '']), g2 = ts([p, 'x'], [q, '']);
        return N(`이차함수 ${nb(`${V('f')}(${X})`)}가 다음 조건을 만족시킬 때, ${nb(`${V('f')}(${iq(w)})`)}의 값은?<br>㈎ 부등식 ${nb(`${V('f')}(${X}) ≥ ${sideH(g1)}`)}의 해는 ${nb(`${iq(u)} ≤ ${X} ≤ ${iq(v)}`)}이다.<br>㈏ 방정식 ${ej(nb(`${V('f')}(${X}) = ${sideH(g2)}`), '은/는')} 중근을 갖는다.`, fw, {
          signed: true,
          explain: `㈎에서 ${nb(`${V('f')}(${X}) ${MINUS} (${sideH(g1)}) ≥ 0`)}의 해가 ${nb(`${iq(u)} ≤ ${X} ≤ ${iq(v)}`)}이므로 ${nb(`${V('f')}(${X}) = ${V('k')}(${sideH(lx(1, -u))})(${sideH(lx(1, -v))}) + (${sideH(g1)})`)}, ${nb(`${V('k')} &lt; 0`)}이다. ㈏에서 ${nb(`${V('f')}(${X}) ${MINUS} (${sideH(g2)}) = 0`)}의 판별식이 0이므로 ${V('k')}에 대한 방정식을 풀면 ${nb(`${V('k')} = ${iq(A)}`)}이다. 따라서 ${nb(`${V('f')}(${iq(w)}) = ${iq(fw)}`)}이다.`,
          facts: { calc: [[`(${js(Q(A))})*((${js(Q(w))})-(${js(Q(u))}))*((${js(Q(w))})-(${js(Q(v))}))-(${js(Q(m))})*(${js(Q(w))})-(${js(Q(nn))})+0`, 0]], derived: [Math.abs(A), Math.abs(m), Math.abs(nn)], rule: 'hard-tangent' }
        });
      }),
      // ① a < 0 이므로 두 해의 끝의 차례가 정해진다(심화 기출).
      H('hard-neg-a', '음수 a 로 쓴 연립이차부등식의 해', '심3', (d) => {
        const c = nz(d, -3, 3), Lc = d.int(1, 3), a = c > 0 ? -Lc : c - Lc;
        const L1 = [tq(1, ts([1, 'x'], [-1, 'a']))], R1 = [tm(1, 'A')], L2 = [tm(1, 'X'), tm(c, 'a')], R2 = [tg(1, ts([1, 'a'], [c, '']), 'x', true)];
        const env = { a: Q(a) }, S1 = verify(norm(inter(quadSet(Q(1), Q(-2 * a), Q(0), '<').S, ALL())), (x) => holds(L1, '<', R1, x, env));
        const S2 = verify(norm(quadSet(Q(1), Q(-(a + c)), Q(a * c), '<').S), (x) => holds(L2, '<', R2, x, env)), S = norm(inter(S1, S2));
        if (S.length !== 1 || S[0].lo === null || S[0].hi === null || qcmp(qsub(S[0].hi, S[0].lo), Q(Lc)) !== 0) return null;
        const b = S[0].lo.p;
        return valsQ(`${nb(`${VA} &lt; 0`)}일 때, ${X}에 대한 연립부등식 ${sys([ineqH(L1, '<', R1), ineqH(L2, '<', R2)])}의 해가 ${nb(`${V('b')} &lt; ${X} &lt; ${V('b')} + ${Lc}`)}이다. 상수 ${VA}, ${V('b')}의 값은?`, [['a', a], ['b', b]], {
          explain: `첫째 부등식은 ${nb(`${X}(${X} ${MINUS} 2${VA}) &lt; 0`)}이고 ${VA} &lt; 0이므로 ${nb(`2${VA} &lt; ${X} &lt; 0`)}이다. 둘째 부등식은 ${nb(`(${X} ${MINUS} ${VA})(${sideH(lx(1, -c))}) &lt; 0`)}이므로 ${nb(`${VA} &lt; ${X} &lt; ${iq(c)}`)}이다. 2${VA} &lt; ${VA}이므로 공통부분은 ${nb(`${VA} &lt; ${X} &lt; ${c > 0 ? 0 : iq(c)}`)}이고, 그 길이가 ${Lc}이므로 ${nb(`${VA} = ${iq(a)}`)}, ${nb(`${V('b')} = ${iq(b)}`)}이다.`,
          facts: { calc: [[c > 0 ? `0-${Lc}+0` : `(${js(Q(c))})-${Lc}+0`, 0], [c > 0 ? `0-${Lc}+0` : `(${js(Q(c))})-${Lc}+0`, 1]], rule: 'hard-neg-a' }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
