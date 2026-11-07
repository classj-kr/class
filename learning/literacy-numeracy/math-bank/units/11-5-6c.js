// 고등학교 미적분Ⅱ Ⅲ-1 여러 가지 적분법 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - 이어 붙인 함수에서 연속 조건으로 상수를 정하지 않고 조각마다 따로 적분하거나, ln kx 를 ln k + ln x 로 나누지 못한다.
//  - f(x + 2) = f(x) + k 꼴에서 옮겨 간 구간의 정적분에 더해지는 상수(구간의 길이 × k)를 빠뜨린다.
//  - 치환한 뒤 dx 를 t 의 식으로 바꾸지 않거나(√(x + 3) = t 이면 dx = 2t dt) 위끝·아래끝을 그대로 둔다.
//  - 되돌아오는 부분적분에서 두 번째에 미분하는 쪽을 바꾸어 항등식을 만들거나, 이항한 뒤 계수로 나누지 않는다.
//  - 절댓값이 든 정적분에서 피적분함수의 부호가 바뀌는 자리를 찾지 않고 그대로 적분한다.
//  - 극솟값만 주었을 때 극대·극소의 자리를 f′ 의 부호로 가르지 않는다.
//  - 그래프와 직선이 두 점에서 만나는 경우를 「접하는 경우」로 가르지 못하고 하나만 찾는다.
//  - 정적분을 상수 k 로 놓은 뒤 피적분함수에 가중치(eᵗ, t²)가 곱해져 있으면 k 에도 그 정적분이 곱해진다는 것을 놓친다.
//  - x² f′(x) + 2x f(x) 를 {x² f(x)}′ 로 보지 못한다.
// 실력에 둔 것: ① 뜻을 정확히 대야 풀리는 것(①16 옮겨 간 구간에 더해지는 상수, ②18 절댓값의 부호가 바뀌는 자리, ②23 접하는 두 경우,
//  ②30 곱의 미분을 거꾸로) ② 세 단계 넘게 잇는 것(①15 연속 조건 → 조각 적분, ②3 근호 치환 → 부분분수, ②4 두 번 치환해 구간 나누기, ②6 삼각치환,
//  ②17 되돌아오는 부분적분 정적분, ②22 극솟값에서 극댓값, ②24 근과 계수, ②25 교점13, ②26 가중치가 곱해진 함수 방정식, ②29 f′/f 로 정리, ②32 접선).
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, M } = B.kit;
  const { MINUS, Q, V, sup, rt, sys, nb } = B.kit.mid;
  const { ms, jh, ln, evl, lim } = B.kit.hs;
  const {
    S1, S2, S3, H, q, qadd, qn, J, iq, nzi, LN, EE, PI, SQ, simpson, close,
    X, Tt, Cc, EV, plusC, ind, dfi, fx, fp, FX, FCX, is, sn, cs, tn, lnAbs, ePow, pi, sumH, pf, sg, num, pos, chooseV
  } = B.kit.u56x;
  const K1 = (k) => (k === 1 ? '' : k === -1 ? MINUS : iq(k));
  const lin = (a, b, v) => sumH([[a, v || X], [b, '']]);

  const hard = [
    H('hard-piece', '연속 조건으로 상수를 정한 조각 함수의 정적분', '①15', (d) => {
      // f(x) = −c cos πx (x < 1), ln kx (x ≥ 1) 가 연속 → ln k = c → ∫(−1/2 ~ m) f = −c/π + c(m − 1) + m ln m − m + 1
      const c = d.int(1, 2), m = d.pick([2, 3]), kk = EE ** c, cm = c * (m - 1) - m + 1;
      const f = (x) => (x < 1 ? -c * Math.cos(PI * x) : LN(kk * x)), check = simpson(f, -0.5, 1) + simpson(f, 1, m);
      const opt = (k0, kp, kl) => sumH([[k0, ''], [kp, 'π', true], [kl, ln(m)]]);
      const def = sys([`${MINUS}${K1(c)}${cs('πx')} ${nb(`(${X} &lt; 1)`)}`, `${ln(V('k') + X)} ${nb(`(${X} ≥ 1)`)}`]);
      return chooseV(d, `실수 전체의 집합에서 연속인 함수 ${is(FX, def)}에 대하여 ${jh(dfi(MINUS + frac(1, 2), m, FX), '의/의')} 값은? (단, ${jh(V('k'), '은/는')} 양수이다.)`, [opt(cm, -c, m), cm - c / PI + m * LN(m)], [
        [opt(cm, c, m), cm + c / PI + m * LN(m)], [opt(1 - m, -c, m), 1 - m - c / PI + m * LN(m)], [opt(c * (m - 1), -c, m), c * (m - 1) - c / PI + m * LN(m)], [opt(cm, -2 * c, m), cm - 2 * c / PI + m * LN(m)]
      ], check, {
        explain: `${is(X, 1)}에서 연속이므로 ${MINUS}${K1(c)}${cs('π')} = ${ln(V('k'))}, 곧 ${is(ln(V('k')), c)}이고 ${X} ≥ 1에서 ${is(FX, `${c} + ${ln('x')}`)}이다. ${is(dfi(MINUS + frac(1, 2), 1, `(${MINUS}${K1(c)}${cs('πx')})`), MINUS + frac(c, 'π'))}, ${jh(is(dfi(1, m, `(${c} + ${ln('x')})`), `${c * (m - 1)} + ${evl(`${X}${ln('x')} ${MINUS} ${X}`, 1, m)}`), '을/를')} 더한다.` });
    }, { standard: S1 }),
    H('hard-period', 'f(x + 2) = f(x) + k 규칙이 붙은 조각 함수의 정적분', '①16', (d) => {
      const Jn = d.int(1, 3), m = d.until(() => d.int(1, 3), (v) => v % 2 === 0 || Jn % 2 === 0), N = 2 * Jn + 1, k = m + 1;
      const pA = 2 * (Jn + 1), qA = Jn * (m / 2 + 1) + k * Jn * Jn;
      const base = (x) => (x <= 1 ? Math.sin(PI * x / 2) : m * x + 1 - m), f = (x) => { const j = Math.floor(x / 2); return base(x - 2 * j) + j * k; };
      let check = 0; for (let i = 0; i < N; i += 1) check += simpson(f, i + 1e-12, i + 1 - 1e-12);
      if (!close(check, pA / PI + qA) || !Number.isInteger(qA)) throw new Error('hard-period 셈');
      return M(`실수 전체의 집합에서 연속인 함수 ${jh(FX, '이/가')} 다음 조건을 만족시킨다.${lines([`㈎ 모든 실수 ${jh(X, '에/에')} 대하여 ${is(fx('f', `${X} + 2`), `${FX} + ${V('k')}`)}이다. (단, ${jh(V('k'), '은/는')} 상수이다.)`, `㈏ ${ms('0 <= x <= 1')}일 때 ${is(FX, sn(frac('π', 2) + X))}이다.`, `㈐ ${ms('1 < x < 2')}일 때 ${jh(FX, '은/는')} 미분가능하고 ${is(fp('f'), m)}이다.`])}${is(dfi(0, N, FX), `${frac(V('p'), 'π')} + ${V('q')}`)}일 때, 자연수 ${V('p')}, ${jh(V('q'), '의/의')} 값을 각각 구하시오.`, [
        { lead: V('p') + ' =', answer: pA }, { lead: V('q') + ' =', answer: qA }
      ], { shown: `${V('p')} = ${pA}, ${V('q')} = ${qA}`,
        explain: `㈐에서 ${is(FX, `${K1(m)}${X} + ${V('b')}`)}이고 ${is(X, 1)}에서 이어지므로 ${is(FX, lin(m, 1 - m))}(1 &lt; ${X} &lt; 2)이다. ${is(fx('f', 2), fx('f', 0) + ' + ' + V('k'))}에서 ${is(V('k'), k)}이다. [0, 2]의 정적분은 ${frac(2, 'π')} + ${iq(Q(m + 2, 2))}이고 [2${V('j')}, 2${V('j')} + 2]에서는 여기에 ${2 * k}${jh(V('j'), '이/가')} 더해진다. 마지막 [${N - 1}, ${N}]은 ${frac(2, 'π')} + ${Jn * k}이므로 모두 더하면 ${frac(pA, 'π')} + ${qA}이다.`,
        facts: { calc: [[`2*(${Jn}+1)`, 0], [`${Jn}*(${m}/2+1)+(${m}+1)*${Jn}**2`, 1]] } });
    }, { standard: S1 }),
    H('hard-rootpart', '근호를 t로 놓은 뒤 부분분수로 정적분', '②3', (d) => {
      const [c, s, nm] = d.pick([[3, 2, 2], [8, 3, 3]]), t1 = d.int(s + 1, s + 2), t2 = d.int(t1 + 1, t1 + 2), a = t1 * t1 - c, b = t2 * t2 - c;
      const kq = Q((t2 - s) * (t1 + s), (t2 + s) * (t1 - s));
      if (kq.p === kq.q) return null;
      if (!close(LN(qn(kq)), simpson((x) => nm / ((x - 1) * SQ(x + c)), a, b))) throw new Error('hard-rootpart 셈');
      return pos(`${is(dfi(a, b, frac(nm, `(${X} ${MINUS} 1)${rt(`${X} + ${c}`)}`)), ln(V('k')))}일 때, 상수 ${jh(V('k'), '의/의')} 값은?`, kq, {
        explain: `${rt(`${X} + ${c}`)} = ${jh(Tt, '으로/로')} 놓으면 ${X} ${MINUS} 1 = ${Tt}${sup(2)} ${MINUS} ${s * s}, ${is(V('d') + X, `2${Tt} ${V('d')}${Tt}`)}이고 ${jh(Tt, '은/는')} ${t1}부터 ${t2}까지이므로 ${dfi(t1, t2, frac(2 * nm, `${Tt}${sup(2)} ${MINUS} ${s * s}`), 't')} = ${dfi(t1, t2, `(${frac(1, `${Tt} ${MINUS} ${s}`)} ${MINUS} ${frac(1, `${Tt} + ${s}`)})`, 't')} = ${ln(iq(kq))}이다.`,
        facts: { value: `(${t2}-${s})*(${t1}+${s})/((${t2}+${s})*(${t1}-${s}))` } });
    }, { standard: S2 }),
    H('hard-relation', '합성 꼴 정적분 사이의 관계', '②4', (d) => {
      const p = d.pick([2, 4]), top = 2 ** p, A = nzi(d, -20, 40), Bv = nzi(d, -6, 9), v = Q(A - p * Bv, 3);
      const inner = p === 2 ? X : X + sup(p - 1), arg = X + sup(p);
      return num(`${ms('x >= 0')}에서 연속인 함수 ${jh(FX, '이/가')} ${is(dfi(0, top, FX), A)}, ${jh(is(dfi(1, 2, `${inner}${fx('f', arg)}`), Bv), '을/를')} 만족시킬 때, ${jh(dfi(0, 1, `${X}${sup(2)}${fx('f', X + sup(3))}`), '의/의')} 값은?`, v, {
        explain: `${arg} = ${jh(Tt, '으로/로')} 놓으면 ${is(dfi(1, 2, `${inner}${fx('f', arg)}`), `${frac(1, p)}${dfi(1, top, fx('f', Tt), 't')}`)}이므로 ${is(dfi(1, top, FX), p * Bv)}, ${is(dfi(0, 1, FX), A - p * Bv)}이다. ${X}${sup(3)} = ${jh(V('s'), '으로/로')} 놓으면 구하는 값은 ${frac(1, 3)}${dfi(0, 1, fx('f', V('s')), 's')} = ${iq(v)}이다.`,
        facts: { value: `(${J(A)}-${p}*${J(Bv)})/3` } });
    }, { standard: S2 }),
    H('hard-trigsub', '삼각치환 x = a sin θ, x = a tan θ로 정적분', '②6', (d, n) => {
      const a = d.int(1, 3), A = K1(a), TH = V('θ');
      if (n === 0) {
        const half = d.bool(), lo = half ? 0 : -a, v = PI * a * a / (half ? 4 : 2), check = simpson((th) => a * a * Math.cos(th) ** 2, half ? 0 : -PI / 2, PI / 2);
        const val = (pq) => [pi(pq[0], pq[1]), PI * pq[0] / pq[1]];
        const right = val([a * a, half ? 4 : 2]);
        return chooseV(d, `${is(X, `${A}${sn(TH)}`)} (${MINUS}${frac('π', 2)} ≤ ${TH} ≤ ${frac('π', 2)})로 놓아 ${jh(dfi(lo, a, rt(`${a * a} ${MINUS} ${X}${sup(2)}`)), '의/의')} 값을 구하면?`, right,
          [[a * a, 1], [a * a, 2], [a * a, 4], [a * a, 8], [2 * a * a, 1], [a, 2]].map(val).concat([[String(a * a), a * a]]), check, {
            explain: `${is(V('d') + X, `${A}${cs(TH)} ${V('d')}${TH}`)}, ${is(rt(`${a * a} ${MINUS} ${X}${sup(2)}`), `${A}${cs(TH)}`)}이고 ${jh(TH, '은/는')} ${half ? '0' : MINUS + frac('π', 2)}부터 ${jh(frac('π', 2), '까지이므로/까지이므로')} ${dfi(half ? 0 : MINUS + frac('π', 2), frac('π', 2), `${a * a === 1 ? '' : a * a}${cs(TH, 2)}`, 'θ')}이다. ${jh(is(cs(TH, 2), frac(`1 + ${cs('2θ')}`, 2)), '으로/로')} 셈하면 ${right[0]}이다.` });
      }
      const k = d.pick([1, 2, 4]), v = k * PI / (4 * a), check = simpson((x) => k / (x * x + a * a), 0, a);
      const val = (p, qq) => [pi(p, qq), PI * p / qq];
      const right = val(k, 4 * a);
      return chooseV(d, `${is(X, `${A}${tn(TH)}`)} (${MINUS}${frac('π', 2)} &lt; ${TH} &lt; ${frac('π', 2)})로 놓아 ${jh(dfi(0, a, frac(k, `${X}${sup(2)} + ${a * a}`)), '의/의')} 값을 구하면?`, right,
        [val(k, 2 * a), val(k, a), val(k, 4), val(k, 3 * a), val(k, 8 * a), val(k * a, 4)], check, {
          explain: `${is(V('d') + X, `${A}${B.kit.u56x.sc(TH, 2)} ${V('d')}${TH}`)}, ${X}${sup(2)} + ${a * a} = ${a * a === 1 ? '' : a * a}${B.kit.u56x.sc(TH, 2)}이고 ${jh(TH, '은/는')} 0부터 ${jh(frac('π', 4), '까지이므로/까지이므로')} ${dfi(0, frac('π', 4), iq(Q(k, a)), 'θ')} = ${right[0]}이다.` });
    }, { count: 2, standard: S2 }),
    H('hard-cycledef', '되돌아오는 부분적분으로 구한 정적분', '②17', (d) => {
      const k = d.int(1, 3), useSin = d.bool(), D = 1 + k * k, ck = k % 2 ? -1 : 1, ex = EV + sup('π');
      // ∫(0~π) eˣcos kx dx = (e^π cos kπ − 1)/(1 + k²), ∫(0~π) eˣ sin kx dx = k(1 − e^π cos kπ)/(1 + k²)
      const v = useSin ? k * (1 - EE ** PI * ck) / D : (EE ** PI * ck - 1) / D;
      const form = (ce, c0, den) => frac(sumH([[ce, ex], [c0, '']]), den);
      const right = useSin ? [form(-k * ck, k, D), v] : [form(ck, -1, D), v];
      const wr = useSin ? [[form(k * ck, -k, D), -v], [form(-k * ck, k, D + 1), k * (1 - EE ** PI * ck) / (D + 1)], [form(-ck, 1, D), (1 - EE ** PI * ck) / D], [form(-k * ck, -k, D), (-k * ck * EE ** PI - k) / D]]
        : [[form(-ck, 1, D), -v], [form(ck, -1, D + 1), (EE ** PI * ck - 1) / (D + 1)], [form(ck, 1, D), (EE ** PI * ck + 1) / D], [form(k * ck, -k, D), k * (EE ** PI * ck - 1) / D]];
      const arg = k === 1 ? 'x' : k + 'x';
      return chooseV(d, `${jh(dfi(0, 'π', ePow('x') + (useSin ? sn(arg) : cs(arg))), '의/의')} 값은?`, right, wr, simpson((x) => EE ** x * (useSin ? Math.sin(k * x) : Math.cos(k * x)), 0, PI), {
        explain: `${jh(is(V('I'), dfi(0, 'π', ePow('x') + (useSin ? sn(arg) : cs(arg)))), '으로/로')} 놓고 두 번 모두 ${jh(ePow('x'), '을/를')} 적분하는 쪽으로 부분적분하면 ${V('I')} = (끝값) ${MINUS} ${k * k === 1 ? '' : k * k}${jh(V('I'), '이/가')} 된다. 이항하여 ${jh(D, '으로/로')} 나누면 ${right[0]}이다.` });
    }, { standard: S3 }),
    H('hard-absparts', '절댓값이 든 함수의 부분적분 정적분', '②18', (d) => {
      const s = d.pick([-1, 1]), g = (x) => x * (1 + 2 * s * Math.cos(x)), z = s < 0 ? PI / 3 : 2 * PI / 3;
      const F = (x) => x * x / 2 + 2 * s * (x * Math.sin(x) + Math.cos(x)), v = s < 0 ? F(PI) + F(0) - 2 * F(z) : 2 * F(z) - F(0) - F(PI);
      // s = −1: 7π²/18 + (2√3/3)π + 2,  s = 1: −π²/18 + (4√3/3)π − 2
      const r3p = rt('3') + 'π', opt = (a2, a1, a0) => sumH([[a2, 'π' + sup(2)], [a1, r3p], [a0, '']]);
      const val = (a2, a1, a0) => qn(q(a2)) * PI * PI + qn(q(a1)) * SQ(3) * PI + a0;
      const right = s < 0 ? [opt(Q(7, 18), Q(2, 3), 2), val(Q(7, 18), Q(2, 3), 2)] : [opt(Q(-1, 18), Q(4, 3), -2), val(Q(-1, 18), Q(4, 3), -2)];
      const wr = s < 0 ? [[opt(Q(7, 18), Q(-2, 3), 2), val(Q(7, 18), Q(-2, 3), 2)], [opt(Q(-7, 18), Q(2, 3), -2), val(Q(-7, 18), Q(2, 3), -2)], [opt(Q(7, 18), Q(2, 3), -2), val(Q(7, 18), Q(2, 3), -2)], [opt(Q(1, 2), 0, 4), val(Q(1, 2), 0, 4)]]
        : [[opt(Q(-1, 18), Q(-4, 3), -2), val(Q(-1, 18), Q(-4, 3), -2)], [opt(Q(1, 18), Q(4, 3), 2), val(Q(1, 18), Q(4, 3), 2)], [opt(Q(-1, 18), Q(4, 3), 2), val(Q(-1, 18), Q(4, 3), 2)], [opt(Q(1, 2), 0, -4), val(Q(1, 2), 0, -4)]];
      const body = `|${X} ${s < 0 ? MINUS : '+'} 2${X}${cs()}|`;
      return chooseV(d, `${jh(dfi(0, 'π', body), '의/의')} 값은?`, right, wr, simpson((x) => Math.abs(g(x)), 0, z) + simpson((x) => Math.abs(g(x)), z, PI), {
        explain: `${X}(1 ${s < 0 ? MINUS : '+'} 2${cs()})는 ${is(X, s < 0 ? frac('π', 3) : frac('2π', 3))}에서 부호가 바뀐다. ${is(ind(`${X}${cs()}`), plusC(`${X}${sn()} + ${cs()}`))}(부분적분)이므로 ${jh(is(fx('F'), `${frac(1, 2)}${X}${sup(2)} ${s < 0 ? MINUS : '+'} 2(${X}${sn()} + ${cs()})`), '으로/로')} 놓고 두 구간에서 부호를 맞추어 더하면 ${right[0]}이다.` });
    }, { standard: S3 }),
    H('hard-maxfrommin', '극솟값에서 극댓값 구하기', '②22', (d, n) => {
      if (n === 0) {
        // f′(x) = x ln(x + a) (x > −a), 극솟값 c − (a²/2)ln a → 극댓값 f(1 − a) = c − {(a − 1)²/4 + a(a − 1)/2}
        const a = d.pick([2, 3]), c = nzi(d, -4, 5), Dv = Q((a - 1) ** 2 + 2 * a * (a - 1), 4), v = qadd(c, Q(-Dv.p, Dv.q));
        const mn = sumH([[c, ''], [Q(-a * a, 2), ln(a)]]);
        if (!close(qn(v), (c - a * a / 2 * LN(a)) - simpson((x) => x * LN(x + a), 1 - a, 0))) throw new Error('hard-maxfrommin 셈');
        return num(`${ms('x > -' + a)}에서 미분가능한 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), `${X}${ln(`(${X} + ${a})`)}`)}이다. 함수 ${jh(FX, '의/의')} 극솟값이 ${jh(mn, '일/일')} 때, 극댓값은?`, v, {
          explain: `${is(fp('f'), 0)}에서 ${is(X, 0)} 또는 ${is(X, 1 - a)}이다. ${jh(ln(`(${X} + ${a})`), '은/는')} ${is(X, 1 - a)}에서, ${jh(X, '은/는')} ${is(X, 0)}에서 부호가 바뀌어 ${is(X, 1 - a)}에서 극대, ${is(X, 0)}에서 극소이다. 부분적분하면 ${is(FX, plusC(`${frac(`${X}${sup(2)} ${MINUS} ${a * a}`, 2)}${ln(`(${X} + ${a})`)} ${MINUS} ${frac(X + sup(2), 4)} + ${frac(a, 2)}${X}`))}이고 ${is(fx('f', 0), mn)}에서 ${is(Cc, c)}, 극댓값은 ${is(fx('f', 1 - a), v)}이다.`,
          facts: { value: `${J(c)}-((${a}-1)**2/4+${a}*(${a}-1)/2)` } });
      }
      // f′(x) = a sin 2x − tan x (−π/2 < x < π/2), 극솟값 m → 극댓값 m + a − 1/2 − (1/2)ln 2a
      const a = d.pick([1, 2]), m = nzi(d, -4, 6), xs = Math.acos(1 / SQ(2 * a)), v = m + a - 0.5 - 0.5 * LN(2 * a);
      const cl = a === 2 ? -1 : Q(-1, 2), c0 = Q(2 * m + 2 * a - 1, 2), opt = (k0, kl) => sumH([[k0, ''], [kl, ln(2)]]);
      return chooseV(d, `${MINUS}${frac('π', 2)} &lt; ${X} &lt; ${frac('π', 2)}에서 정의된 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), `${K1(a)}${sn('2x')} ${MINUS} ${tn()}`)}이고 ${jh(FX, '의/의')} 극솟값이 ${jh(iq(m), '일/일')} 때, ${jh(FX, '의/의')} 극댓값은?`, [opt(c0, cl), v], [
        [opt(c0, a === 2 ? 1 : Q(1, 2)), m + a - 0.5 + 0.5 * LN(2 * a)], [opt(m + a, cl), m + a - 0.5 * LN(2 * a)], [opt(Q(2 * m + 2 * a - 3, 2), cl), m + a - 1.5 - 0.5 * LN(2 * a)], [opt(c0, a === 2 ? -2 : -1), m + a - 0.5 - LN(2 * a)]
      ], m + simpson((x) => a * Math.sin(2 * x) - Math.tan(x), 0, xs), {
        explain: `${is(fp('f'), `${frac(sn(), cs())}(${2 * a}${cs(null, 2)} ${MINUS} 1)`)}이므로 ${is(X, 0)}에서 극소, ${is(cs(null, 2), frac(1, 2 * a))}인 두 점에서 극대이다. ${is(FX, plusC(`${MINUS}${frac(a, 2)}${cs('2x')} + ${lnAbs(cs())}`))}(${tn()}의 부정적분은 ${MINUS}${lnAbs(cs())})이므로 극솟값 ${jh(is(fx('f', 0), `${MINUS}${frac(a, 2)} + ${Cc}`), '으로/로')} ${jh(Cc, '을/를')} 정해 극댓값을 셈한다.` });
    }, { count: 2, standard: S3 }),
    H('hard-cross', '그래프와 직선이 두 점에서 만날 조건으로 적분상수 정하기', '②23', (d) => {
      const k = d.int(1, 3), up = d.bool(), L = k * PI;
      const cands = [k - 1, k, k + 1, k + 2, 2 * k + 1].filter((v, i, all) => all.indexOf(v) === i);
      // 수치로 판정: f(x) = C + ∫₀ˣ t sin t dt 의 그래프가 [−2π, 2π]에서 y = L 과 만나는 점의 수
      const steps = 4000, xs = Array.from({ length: steps + 1 }, (_, i) => -2 * PI + 4 * PI * i / steps);
      const mid = steps / 2, base = new Array(steps + 1).fill(0), ts = (t) => t * Math.sin(t);       // 0 에서 양쪽으로 한 칸씩 누적한 수치 적분
      for (let i = mid + 1; i <= steps; i += 1) base[i] = base[i - 1] + simpson(ts, xs[i - 1], xs[i], 4);
      for (let i = mid - 1; i >= 0; i -= 1) base[i] = base[i + 1] - simpson(ts, xs[i], xs[i + 1], 4);
      const meets = (C) => {
        const gv = base.map((b) => b + C - L); let cnt = 0, last = 0;
        for (let i = 0; i < gv.length; i += 1) {
          const sgn = Math.abs(gv[i]) < 1e-6 ? 0 : Math.sign(gv[i]);
          if (sgn === 0) { if (last !== 0 || i === 0) cnt += 1; last = 0; continue; }
          if (last !== 0 && sgn !== last) cnt += 1;
          last = sgn;
        }
        return cnt;
      };
      const ok = (C) => meets(C * PI) === 2 && (up ? C * PI > L : C * PI < L);
      const rows = cands.map((c) => [c === 0 ? '0' : pi(c, 1), c]);
      const right = rows.find((r) => ok(r[1]));
      if (!right) throw new Error('hard-cross 판정');
      return chooseV(d, `미분가능한 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), `${X}${sn()}`)}이고 닫힌구간 [${MINUS}2π, 2π]에서 직선 ${jh(is(V('y'), pi(k, 1)), '과/와')} 함수 ${is(V('y'), FX)}의 그래프가 서로 다른 두 점에서 만날 때, ${jh(fx('f', 0), '의/의')} 값은? (단, ${fx('f', 0)} ${up ? '&gt;' : '&lt;'} ${pi(k, 1)})`, [right[0], right[1] * PI], rows.filter((r) => r !== right).map((r) => [r[0], r[1] * PI]), right[1] * PI, {
        explain: `${is(FX, plusC(`${MINUS}${X}${cs()} + ${sn()}`))}이고 ${fx('f', -2 * PI === 0 ? 0 : MINUS + '2π')} = 2π + ${Cc}, 극솟값 ${is(fx('f', MINUS + 'π'), `${MINUS}π + ${Cc}`)}, 극댓값 ${is(fx('f', 'π'), `π + ${Cc}`)}, ${is(fx('f', '2π'), `${MINUS}2π + ${Cc}`)}이다. 직선이 두 점에서 만나는 것은 극솟값이나 극댓값이 ${jh(pi(k, 1), '과/와')} 같을 때뿐이므로 ${is(Cc, pi(k + 1, 1))} 또는 ${is(Cc, k - 1 === 0 ? '0' : pi(k - 1, 1))}이고, 조건에 맞는 것은 ${jh(right[0], '이다/이다')}.` });
    }, { standard: S3 }),
    H('hard-roots', '부분적분으로 만든 함수와 근과 계수의 관계', '②24', (d) => {
      const r1 = d.int(-3, 2), r2 = d.until(() => d.int(-2, 4), (v) => v > r1), s = r1 + r2, p = r1 * r2, a = 2 - s, b = p - s;
      if (a === 0 || b === 0) return null;
      const F = (x) => 2 + simpson((t) => (t * t + a * t + b) * EE ** t, 0, x);
      if (![r1, r2].every((r) => close(F(r), a - b))) throw new Error('hard-roots 셈');
      return M(`상수 ${V('a')}, ${jh(V('b'), '에/에')} 대하여 함수 ${jh(FX, '이/가')} ${is(FX, ind(`(${X}${sup(2)} + ${V('a')}${X} + ${V('b')})${ePow('x')}`))}, ${jh(is(fx('f', 0), 2), '을/를')} 만족시킨다. 방정식 ${is(FX, `${V('a')} ${MINUS} ${V('b')}`)}의 서로 다른 두 실근의 합이 ${iq(s)}이고 곱이 ${jh(iq(p), '일/일')} 때, ${V('a')}, ${jh(V('b'), '의/의')} 값을 각각 구하시오.`, [
        { lead: V('a') + ' =', answer: a, signed: true }, { lead: V('b') + ' =', answer: b, signed: true }
      ], { shown: `${V('a')} = ${iq(a)}, ${V('b')} = ${iq(b)}`,
        explain: `부분적분을 두 번 하면 ${is(FX, `{${X}${sup(2)} + (${V('a')} ${MINUS} 2)${X} ${MINUS} ${V('a')} + ${V('b')} + 2}${ePow('x')} + ${Cc}`)}이고 ${is(fx('f', 0), 2)}에서 ${is(Cc, `${V('a')} ${MINUS} ${V('b')}`)}이다. ${jh(is(FX, `${V('a')} ${MINUS} ${V('b')}`), '은/는')} ${X}${sup(2)} + (${V('a')} ${MINUS} 2)${X} ${MINUS} ${V('a')} + ${V('b')} + 2 = 0이므로 근과 계수의 관계에서 2 ${MINUS} ${is(V('a'), s)}, ${MINUS}${V('a')} + ${V('b')} + 2 = ${iq(p)}이다.`,
        facts: { calc: [[`2-${J(s)}`, 0], [`${J(p)}-${J(s)}`, 1]] } });
    }, { standard: S3 }),
    H('hard-const2', '∫₀^π f(t)dt가 든 함수 방정식 — 부분적분 두 번', '②25', (d) => {
      const p = d.int(1, 3), atPi = d.bool(), I = simpson((t) => t * t * Math.cos(t), 0, PI), kv = p * I / (1 - PI), v = atPi ? -p * PI * PI + kv : kv;
      const kh = frac(`${2 * p}π`, 'π ' + MINUS + ' 1'), right = [atPi ? `${kh} ${MINUS} ${K1(p)}π${sup(2)}` : kh, v];
      const alt = (h, val) => [atPi ? `${h} ${MINUS} ${K1(p)}π${sup(2)}` : h, atPi ? val - p * PI * PI : val];
      return chooseV(d, `모든 실수 ${jh(X, '에서/에서')} 연속인 함수 ${jh(FX, '이/가')} ${jh(is(FX, `${K1(p)}${X}${sup(2)}${cs()} + ${dfi(0, 'π', fx('f', Tt), 't')}`), '을/를')} 만족시킬 때, ${jh(fx('f', atPi ? 'π' : frac('π', 2)), '의/의')} 값은?`, right, [
        alt(frac(`${2 * p}π`, `1 ${MINUS} π`), -kv), alt(frac(`${p === 1 ? '' : p}π`, 'π ' + MINUS + ' 1'), kv / 2), alt(frac(`${2 * p}π`, 'π + 1'), 2 * p * PI / (PI + 1)), alt(`${MINUS}${2 * p}π`, -2 * p * PI)
      ], v, {
        explain: `${jh(is(dfi(0, 'π', fx('f', Tt), 't'), V('k')), '으로/로')} 놓으면 ${is(V('k'), `${K1(p)}${dfi(0, 'π', `${Tt}${sup(2)}${cs('t')}`, 't')} + ${V('k')}π`)}이다. 부분적분을 두 번 하면 ${is(dfi(0, 'π', `${Tt}${sup(2)}${cs('t')}`, 't'), MINUS + '2π')}이므로 ${is(V('k'), kh)}이다.` });
    }, { standard: S3 }),
    H('hard-wconst', '가중치가 곱해진 정적분이 든 함수 방정식', '②26', (d, n) => {
      if (n === 0) {
        // f(x) = mx + ∫(0~1) eᵗ f(t)dt → a = m + a(e − 1) → f(2) = 2m − m/(e − 2)
        const m = d.int(1, 3), Ie = simpson((t) => t * EE ** t, 0, 1), I0 = simpson((t) => EE ** t, 0, 1), av = m * Ie / (1 - I0), v = 2 * m + av;
        const fr = (top, bot) => frac(top, bot);
        return chooseV(d, `모든 실수 ${jh(X, '에서/에서')} 연속인 함수 ${jh(FX, '이/가')} ${jh(is(FX, `${K1(m)}${X} + ${dfi(0, 1, ePow('t') + fx('f', Tt), 't')}`), '을/를')} 만족시킬 때, ${jh(fx('f', 2), '의/의')} 값은?`, [fr(`${K1(m)}(2${EV} ${MINUS} 5)`, `${EV} ${MINUS} 2`), v], [
          [fr(`${K1(m)}(2${EV} ${MINUS} 3)`, `${EV} ${MINUS} 2`), 2 * m + m / (EE - 2)], [MINUS + fr(m, `${EV} ${MINUS} 2`), -m / (EE - 2)], [fr(`${K1(m)}(2${EV} ${MINUS} 3)`, `${EV} ${MINUS} 1`), 2 * m - m / (EE - 1)], [fr(`${K1(m)}(2${EV} ${MINUS} 5)`, `${EV} ${MINUS} 3`), m * (2 * EE - 5) / (EE - 3)]
        ], v, {
          explain: `${is(dfi(0, 1, ePow('t') + fx('f', Tt), 't'), V('a'))}(상수)로 놓으면 ${is(FX, `${K1(m)}${X} + ${V('a')}`)}이고 ${is(V('a'), dfi(0, 1, `(${K1(m)}${Tt} + ${V('a')})${ePow('t')}`, 't'))} = ${m} + ${V('a')}(${EV} ${MINUS} 1)이다(부분적분). 따라서 ${is(V('a'), MINUS + frac(m, `${EV} ${MINUS} 2`))}이고 ${fx('f', 2)} = ${2 * m} ${MINUS} ${frac(m, `${EV} ${MINUS} 2`)}이다.` });
      }
      // f(x) = p cos x + ∫(0~π) t² f(t)dt → k = −2pπ + kπ³/3 → k = 6pπ/(π³ − 3)
      const p = d.int(1, 3), I2 = simpson((t) => t * t * Math.cos(t), 0, PI), I3 = simpson((t) => t * t, 0, PI), kv = p * I2 / (1 - I3), den = `π${sup(3)} ${MINUS} 3`;
      return chooseV(d, `모든 실수 ${jh(X, '에서/에서')} 연속인 함수 ${jh(FX, '이/가')} ${jh(is(FX, `${K1(p)}${cs()} + ${dfi(0, 'π', `${Tt}${sup(2)}${fx('f', Tt)}`, 't')}`), '을/를')} 만족시킬 때, ${jh(fx('f', frac('π', 2)), '의/의')} 값은?`, [frac(`${6 * p}π`, den), kv], [
        [frac(`${6 * p}π`, `3 ${MINUS} π${sup(3)}`), -kv], [frac(`${2 * p}π`, den), kv / 3], [frac(`${6 * p}π`, `π${sup(3)} + 3`), 6 * p * PI / (PI ** 3 + 3)], [frac(`${2 * p}π`, `π ${MINUS} 1`), 2 * p * PI / (PI - 1)]
      ], kv, {
        explain: `${jh(is(dfi(0, 'π', `${Tt}${sup(2)}${fx('f', Tt)}`, 't'), V('k')), '으로/로')} 놓으면 ${is(V('k'), `${K1(p)}${dfi(0, 'π', `${Tt}${sup(2)}${cs('t')}`, 't')} + ${V('k')}${dfi(0, 'π', Tt + sup(2), 't')}`)} = ${MINUS}${2 * p}π + ${frac('π' + sup(3), 3)}${V('k')}이다. ${V('k')}에도 ${jh(frac('π' + sup(3), 3), '이/가')} 곱해진다는 것에 주의하면 ${is(V('k'), frac(`${6 * p}π`, den))}이다.` });
    }, { count: 2, standard: S3 }),
    H('hard-xfint', 'x f(x) = ∫g(x)f′(x)dx에서 f′/f로 정리해 f 구하기', '②29', (d) => {
      const [c, x0] = d.pick([[2, 2], [2, 3], [3, 2]]), check = Math.exp(simpson((x) => x / ((c - 1) * x * x + 1), 0, x0));
      const cand = [[rt('2'), SQ(2)], [rt('3'), SQ(3)], [rt('5'), SQ(5)], [rt('6'), SQ(6)], [rt('10'), SQ(10)], ['2', 2], ['3', 3]];
      const right = cand.find((r) => close(r[1], check));
      if (!right) throw new Error('hard-xfint 답');
      return chooseV(d, `${ms('x > 0')}에서 정의된 미분가능한 함수 ${jh(FX, '은/는')} ${ms('f(x) > 0')}이고, ${is(fx('g'), `${c}${X} + ${frac(1, X)}`)}에 대하여 ${is(`${X}${FX}`, ind(`${fx('g')}${fp('f')}`))}, ${is(lim('x→0+', FX), 1)}일 때, ${jh(fx('f', x0), '의/의')} 값은?`, right, cand.filter((r) => r !== right), check, {
        explain: `양변을 미분하면 ${FX} + ${X}${is(fp('f'), `${fx('g')}${fp('f')}`)}이므로 ${is(frac(fp('f'), FX), frac(1, `${fx('g')} ${MINUS} ${X}`))} = ${frac(X, `${c - 1 === 1 ? '' : c - 1}${X}${sup(2)} + 1`)}이다. 양변을 적분하면 ${is(ln(FX), `${frac(1, 2 * (c - 1))}${ln(`(${c - 1 === 1 ? '' : c - 1}${X}${sup(2)} + 1)`)} + ${Cc}`)}이고 ${X} → 0+일 때 ${ln(FX)} → 0이므로 ${is(Cc, 0)}이다. 따라서 ${is(fx('f', x0), right[0])}이다.` });
    }, { standard: S2 }),
    H('hard-prodrule', '곱의 미분을 거꾸로 — {x² f(x)}′', '②30', (d) => {
      const a = d.pick([4, 8]), b = d.int(1, 4), c = d.int(2, 8), C0 = c - a / 4 - b;
      if (C0 === 0) return null;
      const f = (x) => a * x * x / 4 + b / x + C0 / (x * x), v = simpson(f, 1, 2), k0 = qadd(Q(7 * a, 12), Q(C0, 2)), opt = (kk, kl) => sumH([[kk, ''], [kl, ln(2)]]);
      return chooseV(d, `${ms('x > 0')}에서 미분가능한 함수 ${jh(FX, '이/가')} 모든 양수 ${jh(X, '에/에')} 대하여 ${jh(is(`${X}${sup(2)}${fp('f')} + 2${X}${FX}`, `${a}${X}${sup(3)} + ${b}`), '을/를')} 만족시킨다. ${is(fx('f', 1), c)}일 때, ${jh(dfi(1, 2, FX), '의/의')} 값은?`, [opt(k0, b), v], [
        [opt(Q(7 * a, 12), b), 7 * a / 12 + b * LN(2)], [opt(k0, -b), qn(k0) - b * LN(2)], [opt(qadd(Q(7 * a, 12), C0), b), 7 * a / 12 + C0 + b * LN(2)], [opt(k0, 2 * b), qn(k0) + 2 * b * LN(2)]
      ], v, {
        explain: `좌변은 {${X}${sup(2)}${FX}}′이므로 ${is(`${X}${sup(2)}${FX}`, `${frac(a, 4)}${X}${sup(4)} + ${b}${X} + ${Cc}`)}이고 ${is(fx('f', 1), c)}에서 ${is(Cc, C0)}이다. ${jh(is(FX, `${a / 4}${X}${sup(2)} + ${frac(b, X)} ${sg(C0)} ${frac(Math.abs(C0), X + sup(2))}`), '을/를')} 1부터 2까지 적분한다.` });
    }, { standard: S1 }),
    H('hard-tangent', '∫₁ˣ로 정의된 함수의 접선', '②32', (d) => {
      const m = d.pick([2, 4, 6]), bx = d.int(1, 4), g = (t) => m / (1 + EE ** -t), f0 = -simpson(g, 0, 1), v = f0 + g(0) * bx;
      const L = ln(frac(2, `${EV} + 1`)), opt = (k0, kl, arg) => sumH([[k0, ''], [kl, arg]]);
      return chooseV(d, `함수 ${is(FX, dfi(1, 'x', frac(m, `1 + ${ePow('-t')}`), 't'))}에 대하여 곡선 ${is(V('y'), FX)} 위의 점 (0, ${fx('f', 0)})에서의 접선이 점 (${bx}, ${V('k')})를 지날 때, ${jh(V('k'), '의/의')} 값은?`, [opt(m * bx / 2, m, L), v], [
        [opt(m * bx / 2, -m, L), m * bx / 2 - m * LN(2 / (EE + 1))], [opt(m * bx, m, L), m * bx + m * LN(2 / (EE + 1))], [opt(m * bx / 2, m, ln(frac(`${EV} + 1`, 2))), m * bx / 2 + m * LN((EE + 1) / 2)], [opt(m * bx / 2, m / 2, L), m * bx / 2 + m / 2 * LN(2 / (EE + 1))]
      ], v, {
        explain: `${is(fp('f'), frac(m, `1 + ${ePow('-x')}`))}이므로 ${is(fp('f', 0), m / 2)}이다. 분자·분모에 ${jh(ePow('t'), '을/를')} 곱하면 ${frac(`${m}${ePow('t')}`, `${ePow('t')} + 1`)}이므로 ${is(fx('f', 0), `${MINUS}${dfi(0, 1, frac(`${m}${ePow('t')}`, `${ePow('t')} + 1`), 't')}`)} = ${m}${L}이다. 접선 ${is(V('y'), `${m / 2}${X} + ${fx('f', 0)}`)}에 ${jh(is(X, bx), '을/를')} 넣는다.` });
    }, { standard: S2 })
  ];

  B.addGroup('11-5-6', { id: 'hard', title: '실력 문제', standard: S3, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
