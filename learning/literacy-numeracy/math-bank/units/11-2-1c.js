// 고등학교 미적분Ⅰ Ⅰ-1 함수의 극한 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-1a.js 머리에 적었다. 도구는 B.kit.u1121(a 파일)을 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번. 이 단원에는 심화 문서가 없어 실력 문항도 모두 기본 문서(학기 시험·대단원·중단원 평가·교과서 발전 문제)에서 왔다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「분모 → 0이면 분자 → 0」을 극한값이 있다는 조건 없이 쓰고, 거꾸로 「분자 → 0이고 극한값이 0이 아니면 분모 → 0」은 떠올리지 못한다.
//  - 0/0 꼴이 아닌 극한 조건(분모가 0이 아닌 점)에서도 분자를 0으로 둔다(그냥 대입하면 되는 조건이다).
//  - 분모가 x³ 인 극한이 존재하려면 분자의 x, x²의 계수가 모두 0이어야 한다는 것을 놓친다.
//  - ∞/∞ 꼴에서 분자·분모의 차수를 맞추어야 극한값이 0이 아닌 수가 된다는 것(지워져야 할 최고차항)을 따지지 않는다.
//  - |f(x) − px| &lt; m 같은 절댓값 부등식을 풀지 않고 바로 f(x)를 px로 바꾼다.
//  - lim f(x)/x² = 1 같은 조건에서 차수와 최고차항의 계수를 함께 읽지 못한다.
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines } = B.kit;
  const { MINUS, Q, nb, V, sup, nz, rt } = B.kit.mid;
  const { hx, jh } = B.kit.hs;
  const K = B.kit.u1121;
  const { S2, H, X, Av, Bv, Cv, Nv, iq, jn, jq, pn, fx, is, pval, fromRoots, ptext, L, den, par, LIM, numA, vals, F0 } = K;
  const NE = '≠';
  const lead = (c, v) => (c === 1 ? v : c === -1 ? MINUS + v : iq(c) + v);
  const cq = (A) => (A.q === 1 && Math.abs(A.p) === 1 ? (A.p < 0 ? MINUS : '') : iq(A));   // 곱해진 계수(1은 적지 않고 −1은 −만)
  const conds = (rows) => lines(rows.map((h, i) => `<b>${['㈎', '㈏', '㈐'][i]}</b> ${h}`));

  const hard = [
    // ② 분모 → 0을 끌어내고, 분모와 분자를 모두 유리화한 뒤 세제곱의 인수분해까지 네 단계를 잇는다.
    H('hard-xroot', 'x√x가 든 무리식의 미정계수', '②5', (d) => {
      const k = d.int(1, 3), m = d.until(() => d.int(1, 5), (t) => t !== k), a = m * m - k * k, b = 3 * k * m, k2 = k * k, k3 = k ** 3;
      return vals(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오. ${nb(`(단, ${Bv} ${NE} 0)`)}`, [[Av, a], [Bv, b]], {
        figure: hx(`${LIM(k2, frac(`${X}${rt(X)} ${MINUS} ${k3}`, `${rt(`${X} + ${Av}`)} ${MINUS} ${m}`))} = ${Bv}`),
        explain: `${X} → ${k2}일 때 분자 → 0이고 ${nb(`${Bv} ${NE} 0`)}이므로 분모 → 0이다. ${nb(`${rt(`${k2} + ${Av}`)} = ${m}`)}에서 ${is(Av, a)}이다. 분모와 분자에 ${jh(nb(`${rt(`${X} + ${Av}`)} + ${m}`), '과/와')} ${jh(nb(`${X}${rt(X)} + ${k3}`), '을/를')} 곱하면 ${frac(`(${X}${sup(3)} ${MINUS} ${k3 * k3})(${rt(L(1, a))} + ${m})`, `(${den(k2)})(${X}${rt(X)} + ${k3})`)}이고, ${nb(`${X}${sup(3)} ${MINUS} ${k3 * k3} = (${den(k2)})(${X}${sup(2)} + ${k2 === 1 ? '' : k2}${X} + ${k2 * k2})`)}이므로 약분하면 ${is(Bv, nb(`${frac(`${3 * k2 * k2} × ${2 * m}`, 2 * k3)} = ${b}`))}이다.`,
        facts: { calc: [[`${m}*${m}-${k2}`, 0], [`3*${k}*${m}`, 1]], derived: [3, k] } });
    }),

    // ① 지워져야 할 최고차항을 읽고(분모·분자의 차수 맞추기), 분모의 미정계수가 0인 경우를 가른다. 사용자 결정으로 실력.
    H('hard-inf-coef', '∞/∞ 꼴에서 차수와 계수 정하기', '②7', (d) => {
      const deg = d.pick([2, 3]), p = d.int(1, 3), s = nz(d, -3, 3), c = d.int(1, 4), b = nz(d, -6, 6), top = deg === 3 ? 3 * p * p * s : 2 * p * s;
      if (top % b !== 0) return null;
      const Lv = top / b, P = p ** deg;
      const numH = `(${Av}${X} ${s < 0 ? MINUS : '+'} ${Math.abs(s)})<sup>${Nv}</sup> ${MINUS} ${P === 1 ? '' : P}${X}${sup(deg)}`;
      const denH = deg === 3 ? `${Bv}${X}${sup(2)} + ${c === 1 ? '' : c}${X} + 1` : `${Bv}${X} + ${c}`;
      return vals(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}와 자연수 ${Nv}의 값을 구하시오.${deg === 2 ? ` ${nb(`(단, ${Av} &gt; 0)`)}` : ''}`, [[Av, p], [Bv, b], [Nv, deg, true]], {
        figure: hx(`${LIM('∞', frac(numH, denH))} = ${iq(Lv)}`),
        explain: `${is(Bv, 0)}이면 분모가 ${deg === 3 ? '일차식' : '상수'}이므로 분자도 ${deg === 3 ? '일차식' : '상수'}이어야 하는데, 그런 ${Av}, ${Nv}은 없다. 따라서 ${nb(`${Bv} ${NE} 0`)}이고 분자는 ${deg === 3 ? '이차식' : '일차식'}이어야 하므로 ${X}${sup(deg)}의 항이 지워져야 한다. 곧 ${is(Nv, deg)}, ${is(Av, p)}이고, 분자는 ${lead(top, X + (deg === 3 ? sup(2) : ''))} + …이므로 ${is(frac(iq(top), Bv), Lv)}에서 ${is(Bv, b)}이다.`,
        facts: { calc: [[`${p}`, 0], [deg === 3 ? `3*${p}*${p}*(${jn(s)})/(${jn(Lv)})` : `2*${p}*(${jn(s)})/(${jn(Lv)})`, 1], [`${deg}`, 2]], derived: [p, 2, 3] } });
    }),

    // ① |f(x)| → ∞ 이고 분자가 0이 아니면 분모 → 0(두 점), ∞ 의 극한으로 최고차항의 계수 — 세 조건을 이어 분모를 정한다(중단원 평가의 끝 문제).
    H('hard-abs-inf', '|f(x)|가 발산하는 유리함수의 미정계수', '②8', (d) => {
      const a = d.pick([2, 3, 4, -2, -3]), r1 = d.int(-3, 1), r2 = d.int(r1 + 1, 4), u = d.until(() => d.int(-2, 3), (t) => t !== r1 && t !== r2), Lq = Q(1, a);
      const b = -a * (r1 + r2), c = a * r1 * r2, num = fromRoots([u, u]);
      if (b === 0 || c === 0) return null;
      const f = frac(ptext(num), `${Av}${X}${sup(2)} + ${Bv}${X} + ${Cv}`);
      return vals(`함수 ${jh(nb(`${F0} = ${f}`), '이/가')} 다음 조건을 만족시킬 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, a], [Bv, b], [Cv, c]], {
        figure: conds([is(LIM('∞', F0), Lq), is(LIM(r1, `|${F0}|`), '∞'), is(LIM(r2, `|${F0}|`), '∞')]),
        explain: `㈎에서 분모와 분자의 차수가 같고 ${is(frac(1, Av), Lq)}이므로 ${is(Av, a)}이다. ㈏, ㈐에서 분자의 극한값은 ${iq(pval(num, r1))}, ${jq(pval(num, r2), '으로/로')} 0이 아닌데 |${F0}| → ∞이므로 분모 → 0이다. 곧 분모는 ${nb(`${iq(a)}(${den(r1)})(${den(r2)})`)}이고 전개하면 ${is(Bv, b)}, ${is(Cv, c)}이다.`,
        facts: { calc: [[`${Lq.q}/(${Lq.p})`, 0], [`0-${Lq.q}/(${Lq.p})*((${jn(r1)})+(${jn(r2)}))`, 1], [`${Lq.q}/(${Lq.p})*(${jn(r1)})*(${jn(r2)})`, 2]] } });
    }),

    // ① 분모가 x³ 이므로 분자의 x, x²의 계수가 모두 0이어야 한다는 것을 대야 풀리고, 통분·유리화·전개·연립까지 잇는다(중간고사 끝 문제).
    H('hard-cubic-den', '분모가 x³인 극한이 존재할 조건', '②9', (d) => {
      const c = d.pick([4, 8, 12]), a = 3 * c / 4, b = c / 4;
      const f = `${frac(1, X + sup(3))}(${rt(L(c, 1))} ${MINUS} ${frac(`${Av}${X} + 1`, `${Bv}${X} + 1`)})`;
      return vals(`함수 ${nb(`${F0} = ${f}`)}에 대하여 ${LIM(0, F0)}의 값이 존재하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
        explain: `통분하고 분자를 유리화하면 분자는 ${nb(`(${L(c, 1)})(${Bv}${X} + 1)${sup(2)} ${MINUS} (${Av}${X} + 1)${sup(2)}`)}이고, 전개하면 ${nb(`${c}${Bv}${sup(2)}${X}${sup(3)} + (${2 * c}${Bv} + ${Bv}${sup(2)} ${MINUS} ${Av}${sup(2)})${X}${sup(2)} + (${c} + 2${Bv} ${MINUS} 2${Av})${X}`)}이다. 분모에 ${X}${sup(3)}이 있으므로 극한값이 존재하려면 ${X}${sup(2)}, ${X}의 계수가 0이어야 한다. ${jh(nb(`${Av} = ${Bv} + ${c / 2}`), '을/를')} 넣으면 ${nb(`${c}${Bv} ${MINUS} ${c * c / 4} = 0`)}이므로 ${is(Bv, b)}, ${is(Av, a)}이다.`,
        facts: { calc: [[`3*${c}/4`, 0], [`${c}/4`, 1]], derived: [3, 4] } });
    }),

    // ② ∞ 의 극한으로 차수·최고차항의 계수를, 0/0 의 극한으로 인수를 정한 뒤 남은 계수를 구해 함숫값까지 — 네 단계(교과서 발전 문제·대단원 서술형).
    H('hard-poly-lead', '두 극한 조건으로 이차함수 정하기', '②10', (d, n) => {
      if (n === 0) {
        const A = d.pick([1, 2, -1]), k = nz(d, -3, 3), w = d.until(() => d.int(-4, 4), (t) => t !== k), m = A * (k - w), s = d.until(() => d.int(-2, 5), (t) => t !== k && t !== w), v = A * (s - k) * (s - w);
        return numA(`다항함수 ${F0}가 다음 조건을 만족시킬 때, ${fx(null, s)}의 값은?`, v, {
          figure: conds([is(LIM('∞', frac(F0, X + sup(2))), A), is(LIM(k, frac(F0, den(k))), m)]),
          explain: `㈎에서 ${F0}는 최고차항의 계수가 ${iq(A)}인 이차함수이다. ㈏에서 분모 → 0이므로 ${is(fx(null, k), 0)}이고 ${is(F0, `${lead(A, '')}(${den(k)})(${X} ${MINUS} ${V('p')})`)}로 두면 ${is(nb(`${lead(A, '')}(${pn(k)} ${MINUS} ${V('p')})`), m)}에서 ${is(V('p'), w)}이다. 따라서 ${is(fx(null, s), v)}이다.`,
          facts: { value: `(${jn(A)})*((${jn(s)})-(${jn(k)}))*((${jn(s)})-((${jn(k)})-(${jn(m)})/(${jn(A)})))` } });
      }
      const A = d.pick([Q(1, 2), Q(2), Q(-1), Q(3, 2)]), k = nz(d, -3, 3), z = d.until(() => d.int(-3, 3), (t) => t !== k && t !== 0), w = d.until(() => d.int(-4, 4), (t) => t !== k && t !== z);
      const Lq = Q(A.p * (k - w), A.q * (k - z)), u = d.int(-2, 3), v0 = d.int(1, 6), s = d.until(() => d.int(-3, 4), (t) => t !== k && t !== w && (A.p * (t - k) * (t - w)) % A.q === 0), v = A.p * (s - k) * (s - w) / A.q;
      if (Lq.p === 0 || Math.abs(Lq.p) > 12 || Lq.q > 8) return null;
      const den2 = fromRoots([k, z]);
      return numA(`다항함수 ${F0}가 다음 조건을 만족시킬 때, ${fx(null, s)}의 값은?`, v, {
        figure: conds([is(LIM('∞', frac(F0, ptext([v0, u, 1]))), A), is(LIM(k, frac(F0, ptext(den2))), Lq)]),
        explain: `㈎에서 ${F0}는 최고차항의 계수가 ${iq(A)}인 이차함수이다. ㈏에서 분모 → 0이므로 ${is(fx(null, k), 0)}이고 ${nb(`${ptext(den2)} = (${den(k)})(${den(z)})`)}이다. ${is(F0, `${cq(A)}(${den(k)})(${X} ${MINUS} ${V('p')})`)}로 두면 ${is(frac(`${cq(A)}(${pn(k)} ${MINUS} ${V('p')})`, `${pn(k)} ${MINUS} ${pn(z)}`), Lq)}에서 ${is(V('p'), w)}이다. 따라서 ${is(fx(null, s), v)}이다.`,
        facts: { value: `${jn(A)}*((${jn(s)})-(${jn(k)}))*((${jn(s)})-((${jn(k)})-${jn(Lq)}*(2*(${jn(k)})+(${jn(den2[1])}))/${jn(A)}))`, derived: [2] } });
    }, { count: 2 }),

    // ② 상수항과 일차항을 읽고, 0/0 조건으로 관계식, 약분한 극한값으로 둘째 식 — 연립해 함숫값까지 네 단계(대단원 서술형).
    H('hard-poly-cubic', '두 극한 조건으로 삼차함수 정하기', '②12', (d) => {
      const k = nz(d, -3, 3), t = nz(d, -3, 3), p = k * t, a = nz(d, -3, 3), q = a * k * k - p, b = -(a * k + t), s = d.until(() => d.int(-2, 3), (x) => x !== 0 && x !== k), v = a * s ** 3 + b * s * s + p * s;
      if (q === 0 || b === 0 || Math.abs(v) > 150) return null;
      return numA(`삼차함수 ${F0}가 ${is(LIM(0, frac(F0, X)), p)}, ${jh(is(LIM(k, frac(F0, den(k))), q), '을/를')} 만족시킬 때, ${fx(null, s)}의 값은?`, v, {
        explain: `첫째 조건에서 ${is(fx(null, 0), 0)}이고 일차항의 계수가 ${iq(p)}이므로 ${is(F0, `${Av}${X}${sup(3)} + ${Bv}${X}${sup(2)} ${p < 0 ? MINUS : '+'} ${lead(Math.abs(p), X)}`)}로 둔다. 둘째 조건에서 ${is(fx(null, k), 0)}이므로 ${nb(`${k * k}${Av} ${k < 0 ? MINUS : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${Bv} ${p < 0 ? MINUS : '+'} ${Math.abs(p)} = 0`)}이고, ${F0}를 ${jh(den(k), '으로/로')} 나눈 몫에 ${jh(is(X, k), '을/를')} 넣은 값이 ${iq(q)}이다. 두 식을 연립하면 ${is(Av, a)}, ${is(Bv, b)}이므로 ${is(fx(null, s), v)}이다.`,
        facts: { value: `((${jn(p)})+(${jn(q)}))/((${jn(k)})*(${jn(k)}))*(${jn(s)})*(${jn(s)})*(${jn(s)})+(0-(((${jn(p)})+(${jn(q)}))+(${jn(p)}))/(${jn(k)}))*(${jn(s)})*(${jn(s)})+(${jn(p)})*(${jn(s)})` } });
    }),

    // ① 두 조건 가운데 하나는 0/0 꼴(f(1) = 0)이고 다른 하나는 그냥 대입하는 조건(f(−1)의 값)이라는 것을 가려야 풀린다. 차례 2는 홀수 차수의 계수의 합.
    H('hard-shift', 'f(x − s) 꼴의 극한 조건과 계수의 합', '②14', (d, n) => {
      const s = d.pick([1, 2]), P0 = nz(d, -6, 6), q = nz(d, -6, 6), hi = 1 + s, loPt = s - 1, fm1 = q * (loPt - hi);
      const inner = `${V('f')}(${X} ${MINUS} ${s})`, expr = frac(inner, den(hi));
      const want = n === 0 ? (0 + fm1) / 2 : (0 - fm1) / 2, sumH = n === 0 ? nb(`${Av} + ${Cv} + ${V('e')}`) : nb(`${Bv} + ${V('d')}`);
      return numA(`함수 ${nb(`${F0} = ${Av}${X}<sup>4</sup> + ${Bv}${X}${sup(3)} + ${Cv}${X}${sup(2)} + ${V('d')}${X} + ${V('e')}`)}가 ${is(LIM(hi, expr), P0)}, ${jh(is(LIM(loPt, expr), q), '을/를')} 만족시킬 때, ${sumH}의 값은? (단, ${Av}, ${Bv}, ${Cv}, ${V('d')}, ${V('e')}는 상수)`, want, {
        explain: `첫째 조건은 분모 → 0이므로 분자 → 0이고 ${is(fx(null, 1), 0)}, 곧 ${nb(`${Av} + ${Bv} + ${Cv} + ${V('d')} + ${V('e')} = 0`)}이다. 둘째 조건은 분모가 ${iq(loPt - hi)}이므로 0/0 꼴이 아니라 그냥 대입한다: ${is(frac(fx(null, -1), iq(loPt - hi)), q)}, 곧 ${is(fx(null, -1), fm1)}이고 ${is(nb(`${Av} ${MINUS} ${Bv} + ${Cv} ${MINUS} ${V('d')} + ${V('e')}`), fm1)}이다. 두 식을 ${n === 0 ? '더하여' : '빼어'} 2로 나누면 ${is(sumH, want)}이다.`,
        facts: { value: n === 0 ? `(0+(${jn(q)})*((${jn(loPt)})-(${hi})))/2` : `(0-(${jn(q)})*((${jn(loPt)})-(${hi})))/2`, derived: [2] } });
    }, { count: 2 }),

    // ② 절댓값 부등식을 풀고, 각 변을 x로 나누어 대소 관계로 lim f(x)/x 를 구한 뒤, 다시 분모·분자를 x²으로 나누어 넣는 네 단계(대단원 평가의 끝 문제).
    H('hard-sq-abs', '절댓값 부등식으로 구하는 극한', '②19', (d) => {
      const p = d.int(2, 4), m = d.int(1, 5), a = d.pick([1, 2, 3, 4]), b = d.int(-6, 6), c = d.int(1, 9);
      if ((p * p) % a !== 0) return null;
      const v = p * p / a, denH = ptext([c, b, a]);
      return B.kit.N(`함수 ${F0}가 모든 실수 ${X}에 대하여 ${jh(nb(`|${F0} ${MINUS} ${p}${X}| &lt; ${m}`), '을/를')} 만족시킬 때, ${LIM('∞', frac(`{${F0}}${sup(2)}`, denH))}의 값은?`, v, {
        explain: `${nb(`${p}${X} ${MINUS} ${m} &lt; ${F0} &lt; ${p}${X} + ${m}`)}이고 ${X} &gt; 0일 때 각 변을 ${X}로 나누면 양쪽이 모두 ${jq(p, '으로/로')} 가까워지므로 ${is(LIM('∞', frac(F0, X)), p)}이다. 분모와 분자를 ${X}${sup(2)}으로 나누면 분자 ${nb(`{${frac(F0, X)}}${sup(2)}`)}은 ${p}${sup(2)}에, 분모는 ${a}에 가까워지므로 극한값은 ${frac(`${p}${sup(2)}`, a)} = ${v}이다.`,
        facts: { value: `${p}*${p}/${a}` } });
    })
  ];

  B.addGroup('11-2-1', { id: 'hard', title: '실력 문제', standard: S2, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
