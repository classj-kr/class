// 고등학교 대수 수열의 합(11-1-6) — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 상수의 Σ를 상수 하나로 둔다(Σ_{k=1}^{n} c = c). 상수는 항의 개수만큼 더해져 cn 이다.
//  - Σa_kb_k = (Σa_k)(Σb_k), Σa_k² = (Σa_k)² 처럼 곱·제곱에도 Σ를 나누어 쓴다.
//  - 분수 꼴을 갈라 쓸 때 앞의 계수 1/d(두 인수의 차)를 빠뜨리고, 한 칸 건너 지워지는 합에서 남는 항이 넷인 것을 놓친다.
//  - S_n 에서 a_n = S_n − S_{n−1} 을 쓸 때 n ≥ 2 에서만 성립함을 잊는다(첫째항 a_1 = S_1 을 따로 본다, S_1 − a_1 = 0).
//  - a_{k+1} + a_{k+2} = S_{k+2} − S_k 처럼 항의 합을 합의 차로 바꾸어 읽지 못한다.
//  - Σ 안의 x, a 처럼 k와 관계없는 문자를 k처럼 다룬다(Σx² 을 x² 으로 둔다 — n x² 이다).
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 상황·식의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, isInt, V, sup, nb, nz, rt } = B.kit.mid;
  const { ms, sum, lg, rtn, jh, hx, qAns } = B.kit.hs;
  const U = B.kit.u116;
  const { UNIT, STD4, STD5, H, jn, tq, sT, par, K, VN, VM, kp, pk, nk, A_, AK, AN, SEQA, SK, s1, s2, e1, e2, powSum, powExpr, powTold, range, val, given, frac } = U;
  const VX = V('x'), SN = ms('S_n');
  const fracOnly = (q) => !isInt(q) && Math.abs(q.p) <= 9999 && q.q <= 9999;

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD5,
    types: [
      // ② 1/(a_k a_{k+1}) = (1/d)(1/a_k − 1/a_{k+1}) 로 갈라 합을 a_{m+1} 의 식으로 → a_{m+1} → 공차 → a_t(네 단계)
      H('hard-ad-frac', '등차수열의 분수 꼴 합에서 공차 구하기', '①38', (d) => {
        const a = d.int(2, 6), dd = d.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(1), Q(3, 2), Q(2)]), m = d.int(8, 20), t = d.int(8, 15);
        const am1 = qadd(Q(a), qmul(Q(m), dd)), Vv = qdiv(Q(m), qmul(Q(a), am1)), at = qadd(Q(a), qmul(Q(t - 1), dd));
        if (!fracOnly(at) || Vv.q > 9999 || t === m + 1) return null;
        return qAns(`첫째항이 ${a}이고 공차가 양수인 등차수열 ${SEQA}에 대하여 ${SK(m, frac(1, ms('a_ka_{k+1}')))} = ${tq(Vv)}일 때, ${A_(t)}의 값은?`, at, {
          signed: true,
          explain: `공차를 ${V('d')}라 하면 ${nb(frac(1, ms('a_ka_{k+1}')) + ' = ' + frac(1, V('d')) + par(frac(1, AK) + ' ' + MINUS + ' ' + frac(1, ms('a_{k+1}'))))}이므로 합은 ${nb(frac(1, V('d')) + par(frac(1, a) + ' ' + MINUS + ' ' + frac(1, A_(m + 1))) + ' = ' + frac(m, a + A_(m + 1)))}이다. ${nb(frac(m, a + A_(m + 1)) + ' = ' + tq(Vv))}에서 ${nb(A_(m + 1) + ' = ' + tq(am1))}, ${nb(V('d') + ' = ' + tq(dd))}이므로 ${nb(A_(t) + ' = ' + a + ' + ' + (t - 1) + ' × ' + tq(dd) + ' = ' + tq(at))}이다.`,
          facts: { value: `${a}+(${t}-1)*(${m}*${Vv.q}/(${a}*${Vv.p})-${a})/${m}` }
        });
      }),
      // ① a_{k+1} + a_{k+2} = S_{k+2} − S_k 로 읽어야 1/S_k − 1/S_{k+2} 로 갈라진다. 한 칸 건너 지워져 넷이 남는다.
      H('hard-sk-frac', '합 S_k로 만든 분수의 합', '①39', (d) => {
        const x = d.int(1, 3), y = d.int(1, 4), m = d.int(8, 14), P = d.int(x + y + m, x + y + 4 * m), R = P + d.int(1, 6);
        const v = qsub(qadd(Q(1, x), Q(1, x + y)), qadd(Q(1, P), Q(1, R)));
        if (!fracOnly(v)) return null;
        return val(`모든 항이 양수인 수열 ${SEQA}의 첫째항부터 제${VN}항까지의 합을 ${SN}이라 하자. ${nb(A_(1) + ' = ' + x)}, ${nb(A_(2) + ' = ' + y)}, ${nb(ms('S_{' + (m + 1) + '}') + ' = ' + P)}, ${nb(ms('S_{' + (m + 2) + '}') + ' = ' + R)}일 때, ${SK(m, frac(ms('a_{k+1} + a_{k+2}'), ms('S_kS_{k+2}')))}의 값은?`, v, {
          explain: `${nb(ms('a_{k+1} + a_{k+2}') + ' = ' + ms('S_{k+2} - S_k'))}이므로 ${nb(frac(ms('a_{k+1} + a_{k+2}'), ms('S_kS_{k+2}')) + ' = ' + frac(1, ms('S_k')) + ' ' + MINUS + ' ' + frac(1, ms('S_{k+2}')))}이다. 풀어 쓰면 한 칸 건너 지워져 ${nb(frac(1, ms('S_1')) + ' + ' + frac(1, ms('S_2')) + ' ' + MINUS + ' ' + frac(1, ms('S_{' + (m + 1) + '}')) + ' ' + MINUS + ' ' + frac(1, ms('S_{' + (m + 2) + '}')))}만 남는다. ${nb(ms('S_1') + ' = ' + x)}, ${nb(ms('S_2') + ' = ' + (x + y))}이므로 ${nb(frac(1, x) + ' + ' + frac(1, x + y) + ' ' + MINUS + ' ' + frac(1, P) + ' ' + MINUS + ' ' + frac(1, R) + ' = ' + tq(v))}이다.`.replace(frac(1, 1), '1'),
          facts: { value: `1/${x}+1/(${x}+${y})-1/${P}-1/${R}` }
        });
      }),
      // ① S_1 − a_1 = 0 이고 k ≥ 2 에서 S_k − a_k = S_{k−1} — 위끝이 하나 줄어든다.
      H('hard-sk-minus', 'S_k − a_k = S_{k−1}로 바꾼 합', '①40', (d) => {
        const kind = d.int(0, 1), c = d.int(1, 5), m = d.int(8, 20);
        const v = kind === 0 ? qmul(Q(c), Q(m - 1, m)) : qmul(Q(c, 2), qsub(Q(3, 2), qadd(Q(1, m), Q(1, m + 1))));
        if (!fracOnly(v)) return null;
        const Sform = frac(c, kind === 0 ? ms('n(n+1)') : ms('n(n+2)'));
        return val(`수열 ${SEQA}의 첫째항부터 제${VN}항까지의 합 ${SN}이 ${nb(SN + ' = ' + Sform)}일 때, ${SK(m, ms('(S_k - a_k)'))}의 값은?`, v, {
          explain: `${nb(VN + ' = 1')}이면 ${nb(ms('S_1 - a_1') + ' = 0')}이고, ${nb(VN + ' ≥ 2')}이면 ${nb(AN + ' = ' + SN + ' ' + MINUS + ' ' + ms('S_{n-1}'))}이므로 ${nb(SN + ' ' + MINUS + ' ' + AN + ' = ' + ms('S_{n-1}'))}이다. 따라서 ${nb(SK(m, ms('(S_k - a_k)')) + ' = ' + SK(m - 1, ms('S_k')) + ' = ' + SK(m - 1, frac(c, kind === 0 ? ms('k(k+1)') : ms('k(k+2)'))))} = ${tq(v)}이다.`,
          facts: { value: kind === 0 ? `${c}*(1-1/${m})` : `(${c}/2)*(1+1/2-1/${m}-1/(${m}+1))` }
        });
      }),
      // ① Σ 안의 x 는 k와 관계없다 — Σx² = nx², Σ(2x·c/(k(k+1))) = 2x·Σ… 를 써야 꼭짓점이 보인다.
      H('hard-sq-min', 'Σ로 정의한 이차함수가 최소가 되는 x', '①42', (d) => {
        const kind = d.int(0, 1), c = d.int(1, 3), m = d.int(10, 200);
        const den = kind === 0 ? ms('k(k+1)') : ms('(2k-1)(2k+1)'), v = kind === 0 ? Q(c, m + 1) : Q(c, 2 * m + 1);
        const inner = ms('{x - ') + frac(c, den) + '}' + sup(2);
        return val(`자연수 ${VN}에 대하여 이차함수 ${jh(nb(ms('f(x)') + ' = ' + SK('n', inner)), '이/가')} ${nb(VX + ' = ' + ms('g(n)'))}에서 최솟값을 가질 때, ${ms('g(' + m + ')')}의 값은?`, v, {
          explain: `${VX}는 ${K}에 관계없으므로 ${nb(ms('f(x)') + ' = ' + VN + VX + sup(2) + ' ' + MINUS + ' 2' + VX + SK('n', frac(c, den)) + ' + ' + SK('n', par(frac(c, den)) + sup(2)))}이다. ${nb(SK('n', frac(c, den)) + ' = ' + (kind === 0 ? frac(c === 1 ? VN : c + VN, ms('n+1')) : frac(c === 1 ? VN : c + VN, ms('2n+1'))))}이므로 꼭짓점의 ${VX}좌표는 ${nb(ms('g(n)') + ' = ' + frac(1, VN) + ' × ' + (kind === 0 ? frac(c === 1 ? VN : c + VN, ms('n+1')) : frac(c === 1 ? VN : c + VN, ms('2n+1'))) + ' = ' + (kind === 0 ? frac(c, ms('n+1')) : frac(c, ms('2n+1'))))}이다. 따라서 ${nb(ms('g(' + m + ')') + ' = ' + tq(v))}이다.`,
          facts: { value: kind === 0 ? `${c}/(${m}+1)` : `${c}/(2*${m}+1)` }
        });
      }),
      // ② a_n = dn → √d 로 묶어 근호 꼴 합을 지운다 → d → 분수 꼴 합을 갈라 지운다(네 단계)
      H('hard-ad-root', '첫째항과 공차가 같은 등차수열 — 근호 꼴로 공차, 분수 꼴로 값', '①47', (d) => {
        const sd = d.pick([Q(1, 2), Q(1, 3), Q(2)]), t = d.int(4, 7), L = t * t - 1, m = d.int(8, 15);
        const Vv = qdiv(Q(t - 1), sd), dv = qmul(sd, sd), v = qdiv(Q(m, m + 1), qmul(dv, dv));
        if (v.p > 9999 || v.q > 9999) return null;
        return val(`모든 항이 양수이고 첫째항과 공차가 같은 등차수열 ${SEQA}이 다음을 만족시킬 때, ${SK(m, frac(1, ms('a_ka_{k+1}')))}의 값은?`, v, {
          figure: given([`${SK(L, frac(1, rt(AK) + ' + ' + rt(ms('a_{k+1}'))))} = ${tq(Vv)}`]),
          explain: `첫째항과 공차를 ${V('d')}라 하면 ${nb(AN + ' = ' + V('d') + VN)}이므로 ${nb(frac(1, rt(AK) + ' + ' + rt(ms('a_{k+1}'))) + ' = ' + frac(1, rt(V('d'))) + '(' + rt(ms('k+1')) + ' ' + MINUS + ' ' + rt(K) + ')')}이다. 첫째 합은 ${nb(frac(1, rt(V('d'))) + '(' + rt(L + 1) + ' ' + MINUS + ' 1) = ' + frac(t - 1, rt(V('d'))))}이므로 ${nb(rt(V('d')) + ' = ' + tq(sd))}, ${nb(V('d') + ' = ' + tq(dv))}이다. ${nb(frac(1, ms('a_ka_{k+1}')) + ' = ' + frac(1, V('d') + sup(2)) + par(frac(1, K) + ' ' + MINUS + ' ' + frac(1, ms('k+1'))))}이므로 둘째 합은 ${nb(frac(1, V('d') + sup(2)) + ' × ' + frac(m, m + 1) + ' = ' + tq(v))}이다.`,
          facts: { value: `(${Vv.q === 1 ? Vv.p : Vv.p + '/' + Vv.q}/((${L}+1)**0.5-1))**4*${m}/(${m}+1)`, derived: [4, 0.5] }
        });
      }),
      // ② ka_k·a_kb_k 를 한 수열로 보고 n번째 합에서 n − 1번째 합을 뺀다 → 일반항 → 나누기 → Σ
      H('hard-sn-ab', '합으로 준 조건에서 일반항을 구해 Σ 구하기', '①54', (d, n) => {
        if (n === 0) {
          const [al, ga] = d.pick([[1, 1], [1, 2], [3, 1], [3, 2], [2, 2]]), be = 3 * ga / al, m = d.int(8, 15), v = be * s1(m);
          const S1 = nk([[al, 2], [al, 1]], VN), S2 = nk([[2 * ga, 3], [3 * ga, 2], [ga, 1]], VN);
          return val(`두 수열 ${SEQA}, ${nb('{' + ms('b_n') + '}')}이 모든 자연수 ${VN}에 대하여 다음을 만족시킬 때, ${SK(m, ms('b_k'))}의 값은?`, v, {
            figure: given([`${SK('n', AK)} = ${S1}`, `${SK('n', ms('a_kb_k'))} = ${S2}`]),
            explain: `${nb(AN + ' = ' + SK('n', AK) + ' ' + MINUS + ' ' + SK('n-1', AK) + ' = ' + nk([[2 * al, 1]], VN))}(${nb(VN + ' = 1')}일 때도 맞다)이고, 같은 방법으로 ${nb(ms('a_nb_n') + ' = ' + nk([[6 * ga, 2]], VN))}이다. 따라서 ${nb(ms('b_n') + ' = ' + nk([[be, 1]], VN))}이고 ${nb(SK(m, ms('b_k')) + ' = ' + be + ' × ' + s1(m) + ' = ' + v)}이다.`,
            facts: { value: `3*${ga}/${al}*${e1(m)}`, derived: [3, al, ga] }
          });
        }
        const kind = d.int(0, 1), c = d.pick([1, 2, 4]), m = d.int(7, 15);   // c 가 3의 배수이면 분수가 약분되어 꼴이 어색하다
        const Tform = frac((c === 1 ? '' : c) + (kind === 0 ? ms('n(n-1)(n+1)') : ms('n(n+1)(n+2)')), 3), v = kind === 0 ? c * m * (m - 1) / 2 : c * (s1(m) + m);
        return val(`수열 ${SEQA}이 모든 자연수 ${VN}에 대하여 다음을 만족시킬 때, ${SK(m, AK)}의 값은?`, v, {
          figure: given([`${SK('n', ms('ka_k'))} = ${Tform}`]),
          explain: `${nb(ms('b_k') + ' = ' + ms('ka_k'))}라 하면 ${nb(ms('b_n') + ' = ' + SK('n', ms('b_k')) + ' ' + MINUS + ' ' + SK('n-1', ms('b_k')) + ' = ' + (c === 1 ? '' : c) + (kind === 0 ? ms('n(n-1)') : ms('n(n+1)')))}(${nb(VN + ' = 1')}일 때도 맞다)이다. ${nb(VN + AN + ' = ' + (c === 1 ? '' : c) + (kind === 0 ? ms('n(n-1)') : ms('n(n+1)')))}에서 ${nb(AN + ' = ' + (kind === 0 ? nk([[c, 1], [-c, 0]], VN) : nk([[c, 1], [c, 0]], VN)))}이므로 ${nb(SK(m, AK) + ' = ' + sT(v))}이다.`,
          facts: { value: kind === 0 ? `${c}*${m}*(${m}-1)/2` : `${c}*(${e1(m)}+${m})`, derived: [c] }
        });
      }, { count: 2 }),
      // ② 심06(2022년 11월 고2 26번): S_n 에서 a_1 과 a_n(n ≥ 2)을 따로 구해 같은 식임을 보고 → 1/a_k 를 전개해 → 거듭제곱의 합(세 단계 + a_1 확인)
      H('hard-sn-recip', 'S_n에서 일반항을 구해 1/a_k의 Σ 구하기', '심2', (d) => {
        const p = d.pick([2, 3]), m = d.int(5, 10), c = [1 - p, 2 * p - p * p, p * p, 0], v = powSum(c, m);
        return val(`수열 ${SEQA}의 첫째항부터 제${VN}항까지의 합 ${SN}이 ${nb(SN + ' = ' + frac(VN, nk([[p, 1], [1, 0]], VN)))}일 때, ${SK(m, frac(1, AK))}의 값은?`, v, {
          explain: `${nb(A_(1) + ' = ' + ms('S_1') + ' = ' + frac(1, p + 1))}이고, ${nb(VN + ' ≥ 2')}이면 ${nb(AN + ' = ' + frac(VN, nk([[p, 1], [1, 0]], VN)) + ' ' + MINUS + ' ' + frac(ms('n-1'), nk([[p, 1], [1 - p, 0]], VN)) + ' = ' + frac(1, par(nk([[p, 1], [1, 0]], VN)) + par(nk([[p, 1], [1 - p, 0]], VN))))}이다. 이 식은 ${nb(VN + ' = 1')}일 때도 맞으므로 ${nb(frac(1, AK) + ' = ' + par(pk([[p, 1], [1, 0]])) + par(pk([[p, 1], [1 - p, 0]])) + ' = ' + pk([[c[2], 2], [c[1], 1], [c[0], 0]]))}이다. 따라서 ${powTold(c, m)}이다.`,
          facts: { value: powExpr(c, m), derived: [6].concat(c.map(Math.abs)) }
        });
      }),
      // ② 심07(2021학년도 6월 평가원 가형 21번): 로그의 합을 곱으로 모아 지우고 → 자연수 조건을 2의 거듭제곱으로 바꾸고 → 경우마다 따져 → m의 합
      H('hard-log-nat', '로그의 Σ가 자연수가 되는 m의 합', '심3', (d) => {
        const r = d.pick([2, 3]), Bd = r === 2 ? d.pick([50, 100, 300]) : d.pick([30, 50, 100]);
        const js = range(2, 12).filter((j) => (2 ** j - 1 - j) % r === 0 && (2 ** j - 1 - j) / r >= 1 && (2 ** j - 1 - j) / r <= Bd);
        const ms_ = js.map((j) => 2 ** j - 2), v = ms_.reduce((s, x) => s + x, 0);
        if (!js.length) return null;
        const root_ = r === 2 ? rt(frac(ms('2(n+1)'), ms('n+2'))) : rtn(3, frac(ms('2(n+1)'), ms('n+2')));
        return N(`수열 ${SEQA}의 일반항이 ${nb(AN + ' = ' + lg(2, root_))}이다. ${jh(SK('m', AK), '이/가')} ${Bd} 이하의 자연수가 되도록 하는 모든 자연수 ${VM}의 값의 합은?`, v, {
          explain: `${nb(SK('m', AK) + ' = ' + frac(1, r) + lg(2, '(' + frac('2 × 2', 3) + ' × ' + frac('2 × 3', 4) + ' × ⋯ × ' + frac(ms('2(m+1)'), ms('m+2')) + ')') + ' = ' + frac(1, r) + lg(2, frac(ms('2^{m+1}'), ms('m+2'))))}이다. 이 값을 자연수 ${ms('N')}이라 하면 ${nb(ms('2^{m+1}') + ' = ' + ms('2^{' + r + 'N}') + '(' + VM + ' + 2)')}이므로 ${nb(VM + ' + 2')}는 2의 거듭제곱이어야 한다. ${nb(VM + ' + 2 = ' + ms('2^j'))}라 하면 ${nb(ms('N') + ' = ' + frac(ms('2^j - 1 - j'), r))}이고, 이것이 ${Bd} 이하의 자연수가 되는 것은 ${js.map((j) => nb(ms('j = ' + j) + '(' + ms('m = ' + (2 ** j - 2)) + ')')).join(', ')}뿐이다. 따라서 ${nb(ms_.join(' + ') + ' = ' + v)}이다.`,
          facts: { value: js.map((j) => `(2**${j}-2)`).join('+'), derived: js.concat([r]) }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
