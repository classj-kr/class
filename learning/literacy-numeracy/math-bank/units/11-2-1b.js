// 고등학교 미적분Ⅰ Ⅰ-1 함수의 극한 — 뒤쪽 묶음(0/0 꼴, ∞/∞·∞ − ∞ 꼴, 미정계수, 극한 조건으로 다항함수 정하기, 대소 관계, 도형과 극한).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-1a.js 머리에 적었다. 도구는 B.kit.u1121(a 파일)을 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, inline } = B.kit;
  const { MINUS, gcd, Q, nb, V, sup, nz, poly, rt, SG } = B.kit.mid;
  const { hx, jh, plot, lim } = B.kit.hs;
  const K = B.kit.u1121;
  const { T, X, Av, Bv, Nv, Tv, iq, jn, jq, pn, fx, is, pval, fromRoots, ptext, L, den, par, LIM, lt, gt, numA, vals, polyJs, rt2, F0, BLUE } = K;
  const FRAC_ONLY = (q) => q.q !== 1;        // 분수 답 유형: 정수가 아닌 값만
  const lead = (c, v) => (c === 1 ? v : c === -1 ? MINUS + v : iq(c) + v);   // 계수를 붙인 항(1, −1은 적지 않는다)

  // ══ 라. 0/0 꼴과 ∞×0 꼴 ══
  const zero = [
    // ①23 0/0 꼴 — 인수분해해 약분(차례 1: 이차식, 차례 2: 삼차식 — 조립제법)
    T('zero-factor', '0/0 꼴의 극한값 — 인수분해', '①23', (d, n) => {
      const a = nz(d, -4, 4);
      if (n === 0) {
        const r = d.until(() => d.int(-5, 5), (t) => t !== a), m = d.pick([1, 1, 2]), P = fromRoots([a, r], m), v = m * (a - r);
        return numA('다음 극한값은?', v, { figure: hx(LIM(a, frac(ptext(P), den(a)))),
          explain: `분자를 인수분해하면 ${nb(`${m === 1 ? '' : m}(${den(a)})(${den(r)})`)}이므로 약분하면 ${LIM(a, nb(`${m === 1 ? '' : m}(${den(r)})`))} = ${iq(v)}이다.`,
          facts: { value: `2*${m}*(${jn(a)})+(${jn(P[1])})`, derived: [2] } });
      }
      const e = d.int(-4, 4), f = d.int(-5, 5), Q2 = [f, e, 1], v = a * a + e * a + f;
      if (v === 0 || pval(Q2, a) === 0) return null;
      const P = [-a * f, f - a * e, e - a, 1];
      if (P[0] === 0 || P.some((c) => Math.abs(c) > 20)) return null;
      return numA('다음 극한값은?', v, { figure: hx(LIM(a, frac(ptext(P), den(a)))),
        explain: `분자는 ${X} = ${jq(a, '을/를')} 넣으면 0이므로 ${jh(den(a), '으로/로')} 나누어떨어진다. ${jh(nb(`(${den(a)})(${ptext(Q2)})`), '으로/로')} 인수분해하여 약분하면 극한값은 ${ptext(Q2)}에 ${is(X, a)}를 넣은 값 ${iq(v)}이다.`.replace(`${is(X, a)}를`, jh(is(X, a), '을/를')),
        facts: { value: `3*(${jn(a)})*(${jn(a)})+2*(${jn(P[2])})*(${jn(a)})+(${jn(P[1])})`, derived: [2, 3] } });
    }, { count: 2 }),

    // ①24 0/0 꼴 — 분자의 근호를 유리화(답은 늘 정수가 아닌 분수)
    T('zero-root-top', '0/0 꼴의 극한값 — 분자의 유리화', '①24', (d) => {
      const c = d.int(2, 4), k = d.int(-2, 4), p = d.int(1, 3), m = c * c - p * k, v = Q(p, 2 * c);
      if (m === 0 || !FRAC_ONLY(v)) return null;
      const inner = L(p, m);
      return numA('다음 극한값은?', v, { figure: hx(LIM(k, frac(`${rt(inner)} ${MINUS} ${c}`, k === 0 ? X : den(k)))),
        explain: `분모와 분자에 ${jh(nb(`${rt(inner)} + ${c}`), '을/를')} 곱하면 분자는 ${nb(`${inner} ${MINUS} ${c * c}`)} = ${p === 1 ? '' : p}${k === 0 ? X : par(den(k))}이므로 약분하여 ${frac(p, `${rt(inner)} + ${c}`)}의 극한값 ${frac(p, `${c} + ${c}`)} = ${iq(v)}이다.`,
        facts: { value: `${p}/(2*${c})`, derived: [2] } });
    }),

    // ①25 0/0 꼴 — 분모의 근호를 유리화
    T('zero-root-bottom', '0/0 꼴의 극한값 — 분모의 유리화', '①25', (d) => {
      const c = d.int(1, 3), k = d.int(0, 5), m = c * c - k, r = d.until(() => d.int(-5, 5), (t) => t !== k), P = fromRoots([k, r]), v = (k - r) * 2 * c;
      if (m < 0 || (k === 0 && r === 0)) return null;
      const denH = `${rt(m === 0 ? X : L(1, m))} ${MINUS} ${c}`;
      return numA('다음 극한값은?', v, { figure: hx(LIM(k, frac(ptext(P), denH))),
        explain: `분모와 분자에 ${jh(nb(`${rt(m === 0 ? X : L(1, m))} + ${c}`), '을/를')} 곱하면 분모는 ${jh(k === 0 ? X : den(k), '이/가')} 되어 분자의 인수 ${jh(k === 0 ? X : par(den(k)), '과/와')} 약분된다. 남은 식은 ${nb(`(${den(r)})(${rt(m === 0 ? X : L(1, m))} + ${c})`)}이므로 극한값은 ${nb(`${pn(k - r)} × ${2 * c}`)} = ${iq(v)}이다.`,
        facts: { value: `(2*(${jn(k)})+(${jn(P[1])}))*2*${c}`, derived: [2] } });
    }),

    // ①26 ∞ × 0 꼴 — 괄호 안을 통분해 약분(답은 늘 정수가 아닌 분수)
    T('zero-times', '∞ × 0 꼴의 극한값 — 통분', '①26', (d) => {
      const kind = d.int(0, 1), a = nz(d, -3, 4);
      if (kind === 0) {
        // (1/(x − a))(1 − m/(x + dd)), a + dd = m → 1/m
        const m = d.int(2, 6), dd = m - a;
        if (dd === 0) return null;
        const v = Q(1, m);
        return numA('다음 극한값은?', v, { figure: hx(LIM(a, `${frac(1, den(a))}(1 ${MINUS} ${frac(m, L(1, dd))})`)),
          explain: `괄호 안을 통분하면 ${frac(`${L(1, dd)} ${MINUS} ${m}`, L(1, dd))} = ${frac(den(a), L(1, dd))}이므로 ${jh(frac(1, den(a)), '과/와')} 곱하여 약분하면 ${frac(1, L(1, dd))}이고, 극한값은 ${frac(1, `${pn(a)} + ${pn(dd)}`)} = ${iq(v)}이다.`,
          facts: { value: `1/${m}` } });
      }
      // (1/(x − a))(1/u − 1/(x − w)), a − w = u → 1/u²
      const u = d.int(2, 4), w = a - u, v = Q(1, u * u);
      return numA('다음 극한값은?', v, { figure: hx(LIM(a, `${frac(1, den(a))}(${frac(1, u)} ${MINUS} ${frac(1, den(w))})`)),
        explain: `괄호 안을 통분하면 ${frac(`${den(w)} ${MINUS} ${u}`, `${u}(${den(w)})`)} = ${frac(den(a), `${u}(${den(w)})`)}이므로 약분하면 ${frac(1, `${u}(${den(w)})`)}이고, 극한값은 ${frac(1, `${u} × ${u}`)} = ${iq(v)}이다.`,
        facts: { value: `1/(${u}*${u})` } });
    }),

    // ①26 ∞ × 0 꼴 — 통분한 뒤 근호까지 약분
    T('zero-times-root', '∞ × 0 꼴의 극한값 — 통분과 유리화', '①26', (d) => {
      const c = d.int(2, 3), t = nz(d, -3, 3), p = 2 * c * t;
      return numA('다음 극한값은?', t, { figure: hx(LIM(c * c, `(${rt(X)} ${MINUS} ${c})(1 ${p < 0 ? MINUS : '+'} ${frac(Math.abs(p), den(c * c))})`)),
        explain: `괄호 안을 통분하면 ${frac(L(1, p - c * c), den(c * c))}이고, ${nb(`${den(c * c)} = (${rt(X)} ${MINUS} ${c})(${rt(X)} + ${c})`)}이므로 약분하면 ${frac(L(1, p - c * c), `${rt(X)} + ${c}`)}이다. 극한값은 ${frac(iq(p), `${c} + ${c}`)} = ${iq(t)}이다.`,
        facts: { value: `(${jn(p)})/(2*${c})`, derived: [2] } });
    })
  ];

  // ══ 마. ∞/∞ 꼴과 ∞ − ∞ 꼴 ══
  const inf = [
    // ①27 ∞/∞ 꼴 — 분모의 최고차항으로 나누기(차례 1: 차수가 같다, 차례 2: 분모의 차수가 크다, 차례 3: 곱의 꼴)
    T('inf-ratio', '∞/∞ 꼴의 극한값', '①27', (d, n) => {
      if (n === 0) {
        const dd = d.int(1, 3), t = nz(d, -4, 4), top = [d.int(-6, 6), d.int(-5, 5), t * dd], bot = [nz(d, -5, 5), d.int(-4, 4), dd];
        return numA('다음 극한값은?', t, { figure: hx(LIM('∞', frac(ptext(top), ptext(bot)))),
          explain: `분모와 분자를 ${X}${sup(2)}으로 나누면 ${X} → ∞일 때 ${X}${sup(2)}이 아닌 항은 모두 0에 가까워지므로 최고차항의 계수의 비 ${dd === 1 ? '' : `${frac(iq(t * dd), dd)} = `}${iq(t)}이다.`,
          facts: { value: `(${jn(t * dd)})/${dd}` } });
      }
      if (n === 1) {
        const hi = d.pick([2, 3]), top = hi === 2 ? [d.int(-6, 6), nz(d, -5, 5)] : [d.int(-6, 6), d.int(-3, 3), nz(d, -4, 4)];
        const bot = hi === 2 ? [d.int(1, 6), 0, d.int(1, 5)] : [d.int(-5, 5), 0, d.int(-3, 3), d.int(1, 4)];
        return numA('다음 극한값은?', 0, { figure: hx(LIM('∞', frac(ptext(top), ptext(bot)))),
          explain: `분모의 차수가 분자의 차수보다 크므로 분모와 분자를 ${X}${sup(hi)}으로 나누면 분자는 0에, 분모는 ${bot[hi]}에 가까워진다. 따라서 극한값은 0이다.`,
          facts: { value: '0' } });
      }
      const p = nz(d, -3, 3), q = d.int(-5, 5), r = d.int(1, 4), s = nz(d, -5, 5), u = d.pick([1, 2, 3]), v = p * r / u;
      if (!Number.isInteger(v)) return null;
      const bot = [d.int(-4, 6), d.int(-3, 3), u];
      return numA('다음 극한값은?', v, { figure: hx(LIM('∞', frac(`(${L(p, q)})(${L(r, s)})`, ptext(bot)))),
        explain: `분자를 전개하면 최고차항이 ${lead(p * r, X + sup(2))}이므로 분모와 분자를 ${X}${sup(2)}으로 나누면 극한값은 ${u === 1 ? '' : `${frac(iq(p * r), u)} = `}${iq(v)}이다.`,
        facts: { value: `(${jn(p)})*(${r})/${u}` } });
    }, { count: 3 }),

    // ①28 ∞ − ∞ 꼴 — 근호를 유리화(차례 1: √(p²x² + bx + c) − px, 차례 2: 두 근호의 차, 차례 3: 역수 꼴). 답은 늘 정수가 아닌 분수.
    T('inf-root', '∞ − ∞ 꼴의 극한값', '①28', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 3), b = nz(d, -9, 9), c = d.int(-6, 6), v = Q(b, 2 * p);
        if (!FRAC_ONLY(v)) return null;
        const inner = ptext([c, b, p * p]), sgn = d.bool();
        const body = sgn ? par(`${rt(inner)} ${MINUS} ${lead(p, X)}`) : par(`${MINUS}${rt(inner)} + ${lead(p, X)}`);
        const val = sgn ? v : Q(-b, 2 * p);
        return numA('다음 극한값은?', val, { figure: hx(LIM('∞', body)),
          explain: `${jh(nb(`${rt(inner)} + ${lead(p, X)}`), '을/를')} 분모와 분자에 곱하면 분자는 ${jh(nb(`${lead(b, X)}${c ? ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : ''}`), '이/가')} 된다. 분모와 분자를 ${X}로 나누면 ${frac(iq(b), `${p} + ${p}`)} = ${iq(v)}${sgn ? '' : `이고, 주어진 식은 그 부호를 바꾼 것이므로 ${iq(val)}`}이다.`,
          facts: { value: sgn ? `(${jn(b)})/(2*${p})` : `(0-(${jn(b)}))/(2*${p})`, derived: [2] } });
      }
      if (n === 1) {
        const b = d.int(-8, 8), c = d.until(() => d.int(-8, 8), (t) => (b - t) % 2 !== 0), v = Q(b - c, 2);
        if (b === 0 || c === 0) return null;
        return numA('다음 극한값은?', v, { figure: hx(LIM('∞', par(`${rt(ptext([0, b, 1]))} ${MINUS} ${rt(ptext([0, c, 1]))}`))),
          explain: `두 근호의 합을 분모와 분자에 곱하면 분자는 ${nb(`(${ptext([0, b, 1])}) ${MINUS} (${ptext([0, c, 1])})`)} = ${lead(b - c, X)}이다. 분모와 분자를 ${X}로 나누면 ${frac(iq(b - c), '1 + 1')} = ${iq(v)}이다.`,
          facts: { value: `((${jn(b)})-(${jn(c)}))/2`, derived: [2] } });
      }
      const p = d.int(1, 3), b = nz(d, -9, 9), c = d.int(1, 9), v = Q(-2 * p, b);
      if (!FRAC_ONLY(v)) return null;
      const inner = ptext([c, b, p * p]);
      return numA('다음 극한값은?', v, { figure: hx(LIM('∞', frac(1, `${lead(p, X)} ${MINUS} ${rt(inner)}`))),
        explain: `분모를 유리화하면 ${frac(`${lead(p, X)} + ${rt(inner)}`, `${lead(-b, X)} ${MINUS} ${c}`)}이다. 분모와 분자를 ${X}로 나누면 ${frac(`${p} + ${p}`, iq(-b))} = ${iq(v)}이다.`,
        facts: { value: `(0-2*${p})/(${jn(b)})`, derived: [2] } });
    }, { count: 3 }),

    // ①29 x → −∞ 에서 근호가 든 극한(√(x²) = −x). 답은 늘 정수가 아닌 분수.
    T('inf-neg', 'x → −∞일 때 근호가 든 극한값', '①29', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 4), b = d.int(2, 5), c = d.int(1, 9), v = Q(-a, b);
        if (!FRAC_ONLY(v)) return null;
        return numA('다음 극한값은?', v, { figure: hx(LIM('-∞', frac(rt(ptext([c, 0, a * a])), `${b}${X}`))),
          explain: `${nb(`${X} = ${MINUS}${Tv}`)}로 두면 ${Tv} → ∞이고 ${frac(rt(ptext([c, 0, a * a], Tv)), `${MINUS}${b}${Tv}`)}이다. 분모와 분자를 ${Tv}로 나누면 ${frac(a, `${MINUS}${b}`)} = ${iq(v)}이다. ${X} &lt; 0이면 ${nb(`${rt(X + sup(2))} = ${MINUS}${X}`)}임에 주의한다.`,
          facts: { value: `0-${a}/${b}`, derived: [a] } });
      }
      const p = d.int(1, 2), b = nz(d, -9, 9), v = Q(-b, 2 * p);
      if (!FRAC_ONLY(v)) return null;
      return numA('다음 극한값은?', v, { figure: hx(LIM('-∞', par(`${rt(ptext([0, b, p * p]))} + ${lead(p, X)}`))),
        explain: `${nb(`${X} = ${MINUS}${Tv}`)}로 두면 식은 ${nb(`${rt(ptext([0, -b, p * p], Tv))} ${MINUS} ${lead(p, Tv)}`)}이고 ${Tv} → ∞이다. 유리화하면 ${frac(lead(-b, Tv), `${rt(ptext([0, -b, p * p], Tv))} + ${lead(p, Tv)}`)}이므로 극한값은 ${frac(iq(-b), `${p} + ${p}`)} = ${iq(v)}이다.`,
        facts: { value: `(0-(${jn(b)}))/(2*${p})`, derived: [2] } });
    }, { count: 2 })
  ];

  // ══ 바. 미정계수 ══
  const ab2 = (text, a, b, o) => vals(text, [[Av, a], [Bv, b]], o);
  const coef = [
    // ②1 분모 → 0인 유리식의 미정계수(차례 1: 분자가 이차식, 차례 2: 분자가 일차식)
    T('coef-rat', '극한값이 주어진 유리식의 미정계수', '②1', (d, n) => {
      const k = nz(d, -4, 4);
      if (n === 0) {
        const c = nz(d, -6, 6), r = k - c, a = -(k + r), b = k * r;
        if (a === 0 || b === 0) return null;
        return ab2('다음 등식이 성립하도록 하는 상수 ' + `${Av}, ${Bv}의 값을 구하시오.`, a, b, {
          figure: hx(`${LIM(k, frac(`${X}${sup(2)} + ${Av}${X} + ${Bv}`, den(k)))} = ${iq(c)}`),
          explain: `${X} → ${iq(k)}일 때 분모 → 0이고 극한값이 있으므로 분자 → 0이다. 분자는 ${jh(den(k), '을/를')} 인수로 가지므로 ${nb(`(${den(k)})(${X} + ${Tv})`)}로 두면 극한값은 ${nb(`${pn(k)} + ${Tv}`)} = ${iq(c)}, 곧 ${is(Tv, -r)}이다. 전개하면 ${is(Av, a)}, ${is(Bv, b)}이다.`,
          facts: { calc: [[`(${jn(c)})-2*(${jn(k)})`, 0], [`(${jn(k)})*((${jn(k)})-(${jn(c)}))`, 1]], derived: [2] } });
      }
      const p = d.int(1, 3), b = nz(d, -4, 4), a = b * p, m = -a * k;
      return ab2(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, a, b, {
        figure: hx(`${LIM(k, frac(`${Av}${X} ${m < 0 ? MINUS : '+'} ${Math.abs(m)}`, L(p, -p * k)))} = ${Bv}`),
        explain: `분모 → 0이므로 분자 → 0이어야 하고 ${nb(`${pn(k)}${Av} ${m < 0 ? MINUS : '+'} ${Math.abs(m)} = 0`)}에서 ${is(Av, a)}이다. 그러면 분자는 ${iq(a)}(${den(k)}), 분모는 ${p === 1 ? '' : p}(${den(k)})이므로 ${is(Bv, nb(`${frac(iq(a), p)} = ${iq(b)}`))}이다.`,
        facts: { calc: [[`(0-(${jn(m)}))/(${jn(k)})`, 0], [`(0-(${jn(m)}))/((${jn(k)})*${p})`, 1]] } });
    }, { count: 2 }),

    // ②2 분모 → 0인 무리식의 미정계수(차례 1: 근호 밖 계수, 차례 2: 근호 안 상수, 차례 3: 극한값만 주어진 두 상수)
    T('coef-root', '극한값이 주어진 무리식의 미정계수', '②2', (d, n) => {
      if (n === 0) {
        const k = d.int(1, 4), c = nz(d, -3, 3), a = 2 * k * c, b = -2 * k * k * c;
        return ab2(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, a, b, {
          figure: hx(`${LIM(k * k, frac(`${Av}${rt(X)} + ${Bv}`, den(k * k)))} = ${iq(c)}`),
          explain: `분모 → 0이므로 분자 → 0: ${nb(`${k}${Av} + ${Bv} = 0`)}. 분자는 ${nb(`${Av}(${rt(X)} ${MINUS} ${k})`)}, 분모는 ${nb(`(${rt(X)} ${MINUS} ${k})(${rt(X)} + ${k})`)}이므로 극한값은 ${frac(Av, `${2 * k}`)} = ${iq(c)}이다. 따라서 ${is(Av, a)}, ${is(Bv, b)}이다.`,
          facts: { calc: [[`2*${k}*(${jn(c)})`, 0], [`0-2*${k}*${k}*(${jn(c)})`, 1]], derived: [2, k] } });
      }
      if (n === 1) {
        const m = d.int(2, 4), t = nz(d, -2, 3), p = 2 * m * t, k = d.int(-2, 3), a = m * m - p * k;
        if (a === 0 || p <= 0) return null;
        return ab2(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, a, t, {
          figure: hx(`${LIM(k, frac(`${rt(`${p}${X} + ${Av}`)} ${MINUS} ${m}`, k === 0 ? X : den(k)))} = ${Bv}`),
          explain: `분모 → 0이므로 분자 → 0: ${nb(`${rt(`${iq(p * k)} + ${Av}`)} = ${m}`)}에서 ${is(Av, a)}이다. 유리화하면 ${frac(`${p}${k === 0 ? X : par(den(k))}`, `${k === 0 ? X : par(den(k))}(${rt(L(p, a))} + ${m})`)}이므로 극한값은 ${frac(p, `${m} + ${m}`)} = ${iq(t)}, 곧 ${is(Bv, t)}이다.`,
          facts: { calc: [[`${m}*${m}-${p}*(${jn(k)})`, 0], [`${p}/(2*${m})`, 1]], derived: [2] } });
      }
      const b = d.int(2, 4), k = d.int(-3, 5), a = b * b - k;
      if (a === 0) return null;
      return ab2(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, a, b, {
        figure: hx(`${LIM(k, frac(`${rt(`${X} + ${Av}`)} ${MINUS} ${Bv}`, k === 0 ? X : den(k)))} = ${frac(1, 2 * b)}`),
        explain: `분모 → 0이므로 분자 → 0: ${nb(`${rt(`${iq(k)} + ${Av}`)} = ${Bv}`)}. 유리화하면 극한값은 ${frac(1, `${rt(`${iq(k)} + ${Av}`)} + ${Bv}`)} = ${frac(1, `2${Bv}`)}이므로 ${frac(1, `2${Bv}`)} = ${frac(1, 2 * b)}에서 ${is(Bv, b)}이고, ${is(Av, nb(`${b * b} ${MINUS} ${pn(k)}`))} = ${iq(a)}이다.`,
        facts: { calc: [[`(${2 * b}/2)*(${2 * b}/2)-(${jn(k)})`, 0], [`${2 * b}/2`, 1]], derived: [2] } });
    }, { count: 3 }),

    // ②3 분자 → 0이고 0이 아닌 극한값이면 분모 → 0(유리식). 차례 1: 분모에 미정계수, 차례 2: 분자·분모 모두에.
    T('coef-den0', '분자가 0으로 가는 유리식의 미정계수', '②3', (d, n) => {
      if (n === 0) {
        const m = nz(d, -4, 4), q = nz(d, -5, 5), a = q + 2 * m, b = m * (q + m);
        if (a === 0 || b === 0) return null;
        return ab2(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, a, b, {
          figure: hx(`${LIM(-m, frac(L(1, m), `${X}${sup(2)} + ${Av}${X} + ${Bv}`))} = ${iq(Q(1, q))}`),
          explain: `분자 → 0이고 극한값이 0이 아니므로 분모 → 0이다. 분모를 ${nb(`(${L(1, m)})(${X} + ${Tv})`)}로 두면 극한값은 ${frac(1, `${pn(-m)} + ${Tv}`)} = ${iq(Q(1, q))}이므로 ${is(Tv, q + m)}이다. 전개하면 ${is(Av, a)}, ${is(Bv, b)}이다.`,
          facts: { calc: [[`(${jn(q)})+2*(${jn(m)})`, 0], [`(${jn(m)})*((${jn(q)})+(${jn(m)}))`, 1]], derived: [2] } });
      }
      const k = d.int(1, 4), Lv = nz(d, -5, 5), a = k - 2 * k * Lv, b = k * k;
      if (a === 0 || a === k) return null;
      return ab2(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, a, b, {
        figure: hx(`${LIM(k, frac(`${X}${sup(2)} ${MINUS} (${Av} + ${k})${X} + ${lead(k, Av)}`, `${X}${sup(2)} ${MINUS} ${Bv}`))} = ${iq(Lv)}`),
        explain: `분자는 ${nb(`(${den(k)})(${X} ${MINUS} ${Av})`)}이므로 ${X} → ${k}일 때 0으로 간다. 극한값이 0이 아니므로 분모 → 0: ${is(Bv, b)}. 약분하면 ${frac(`${X} ${MINUS} ${Av}`, L(1, k))}이므로 ${is(frac(`${k} ${MINUS} ${Av}`, 2 * k), Lv)}에서 ${is(Av, a)}이다.`,
        facts: { calc: [[`${k}-2*${k}*(${jn(Lv)})`, 0], [`${k}*${k}`, 1]], derived: [2] } });
    }, { count: 2 }),

    // ②4 분자 → 0이고 0이 아닌 극한값이면 분모 → 0(분자에 근호, 분모에 미정계수)
    T('coef-den0-root', '분자에 근호가 있는 식의 분모의 미정계수', '②4', (d) => {
      const k = d.int(1, 4), c = d.int(k + 1, k + 3), m = c * c - k * k, a = nz(d, -3, 3), Lq = Q(k, c * a), b = -a * k;
      return ab2(`다음 등식이 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, a, b, {
        figure: hx(`${LIM(k, frac(`${rt(`${X}${sup(2)} + ${m}`)} ${MINUS} ${c}`, `${Av}${X} + ${Bv}`))} = ${iq(Lq)}`),
        explain: `분자 → 0이고 극한값이 0이 아니므로 분모 → 0: ${nb(`${k}${Av} + ${Bv} = 0`)}. 분자를 유리화하면 ${frac(`(${den(k)})(${L(1, k)})`, `${Av}(${den(k)})(${rt(`${X}${sup(2)} + ${m}`)} + ${c})`)}이므로 극한값은 ${frac(2 * k, `${2 * c}${Av}`)} = ${iq(Lq)}이다. 따라서 ${is(Av, a)}, ${is(Bv, b)}이다.`,
        facts: { calc: [[`${k}*${Lq.q}/(${c}*(${Lq.p < 0 ? `(${Lq.p})` : Lq.p}))`, 0], [`0-${k}*${Lq.q}/(${c}*(${Lq.p < 0 ? `(${Lq.p})` : Lq.p}))*${k}`, 1]] } });
    }),

    // ②6 xⁿ 이 든 0/0 극한에서 자연수 n(xⁿ − 1 = (x − 1)(xⁿ⁻¹ + … + 1))
    T('coef-pow', 'xⁿ이 든 극한에서 자연수 n', '②6', (d) => {
      const n = d.int(2, 9), p = d.int(1, 4), q = d.int(-3, 5), r = 1 + p + q, Lv = n + 2 * p + q;
      if (r <= 0 || q === 0) return null;
      const num = `${X}<sup>${Nv}</sup> + ${lead(p, X + sup(2))} ${q < 0 ? MINUS : '+'} ${lead(Math.abs(q), X)} ${MINUS} ${r}`;
      return N(`다음 등식이 성립하도록 하는 자연수 ${Nv}의 값은?`, n, { figure: hx(`${LIM(1, frac(num, den(1)))} = ${Lv}`),
        explain: `분자를 ${nb(`(${X}<sup>${Nv}</sup> ${MINUS} 1) + (${ptext([-(r - 1), q, p])})`)}의 합으로 보면 ${nb(`${X}<sup>${Nv}</sup> ${MINUS} 1 = (${X} ${MINUS} 1)(${X}<sup>${Nv}${MINUS}1</sup> + ${X}<sup>${Nv}${MINUS}2</sup> + … + 1)`)}이고, 남은 이차식도 ${jh(den(1), '으로/로')} 나누어떨어진다. 약분한 뒤 ${jh(is(X, 1), '을/를')} 넣으면 ${nb(`${Nv} + ${2 * p + q}`)}이므로 ${is(nb(`${Nv} + ${2 * p + q}`), Lv)}, ${is(Nv, n)}이다.`,
        facts: { value: `${Lv}-2*${p}-(${jn(q)})`, derived: [2] } });
    })
  ];

  // ══ 사. 극한 조건으로 다항함수 정하기 ══
  const polyf = [
    // ②11 앞의 두 항이 정해지는 다항함수(차례 1: x → 0 조건, 차례 2: x → a 의 0/0 조건)
    T('polyf-two', '극한 조건으로 삼차함수 정하기', '②11', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 3), q = nz(d, -4, 4), m = d.int(1, 3), r = nz(d, -4, 4), s = nz(d, -2, 3), a1 = m * r, v = p * s ** 3 + q * s * s + a1 * s;
        return numA(`다항함수 ${F0}가 ${is(LIM('∞', frac(`${F0} ${MINUS} ${lead(p, X + sup(3))}`, X + sup(2))), q)}, ${jh(is(LIM(0, frac(F0, lead(m, X))), r), '을/를')} 만족시킬 때, ${fx(null, s)}의 값은?`, v, {
          explain: `첫째 조건에서 ${F0} ${MINUS} ${lead(p, X + sup(3))}은 ${X}${sup(2)}의 계수가 ${iq(q)}인 이차식이므로 ${is(F0, `${lead(p, X + sup(3))} ${q < 0 ? MINUS : '+'} ${lead(Math.abs(q), X + sup(2))} + ${Av}${X} + ${Bv}`)}로 둔다. 둘째 조건에서 분모 → 0이므로 ${is(fx(null, 0), 0)}, 곧 ${is(Bv, 0)}이고 ${m === 1 ? is(Av, r) : `${is(frac(Av, m), r)}에서 ${is(Av, a1)}`}이다. 따라서 ${is(fx(null, s), v)}이다.`,
          facts: { value: `${p}*(${jn(s)})*(${jn(s)})*(${jn(s)})+(${jn(q)})*(${jn(s)})*(${jn(s)})+${m}*(${jn(r)})*(${jn(s)})` } });
      }
      const m = d.int(1, 2), q = nz(d, -3, 3), M2 = m * q, k = nz(d, -3, 3), r = nz(d, -6, 6), a1 = r - 3 * k * k - 2 * M2 * k, b1 = -(k ** 3 + M2 * k * k + a1 * k);
      const F = [b1, a1, M2, 1], s = d.until(() => d.int(-2, 3), (t) => t !== k), v = pval(F, s);
      if (Math.abs(a1) > 30 || Math.abs(b1) > 60 || Math.abs(v) > 200) return null;
      return numA(`다항함수 ${F0}가 ${is(LIM('∞', frac(`${F0} ${MINUS} ${X}${sup(3)}`, lead(m, X + sup(2)))), q)}, ${jh(is(LIM(k, frac(F0, den(k))), r), '을/를')} 만족시킬 때, ${fx(null, s)}의 값은?`, v, {
        explain: `첫째 조건에서 ${is(F0, `${X}${sup(3)} ${M2 < 0 ? MINUS : '+'} ${lead(Math.abs(M2), X + sup(2))} + ${Av}${X} + ${Bv}`)}로 둔다. 둘째 조건에서 ${is(fx(null, k), 0)}이고, ${F0}를 ${jh(den(k), '으로/로')} 나눈 몫에 ${jh(is(X, k), '을/를')} 넣은 값이 ${iq(r)}이다. 이 두 식에서 ${is(Av, a1)}, ${is(Bv, b1)}이므로 ${is(fx(null, s), v)}이다.`,
        facts: { value: valueOfCubic(m, q, k, r, s), derived: [2, 3] } });
    }, { count: 2 }),

    // ②13 일차함수와 극한 조건 둘
    T('polyf-linear', '극한 조건으로 일차함수 정하기', '②13', (d) => {
      const slope = nz(d, -3, 3), c0 = d.int(-6, 6), a = nz(d, -3, 3), w = d.until(() => d.int(-4, 4), (t) => t !== a), f = (x) => slope * x + c0;
      const fa = f(a), Lq = Q(fa, a - w), dd = d.until(() => d.int(-3, 4), (t) => t !== a), e = f(dd), s = d.until(() => d.int(-2, 6), (t) => t !== a && t !== dd), v = f(s);
      if (fa === 0 || Lq.q !== 1 || w === 0) return null;
      const den2 = fromRoots([a, w]);
      return numA(`일차함수 ${F0}가 ${is(LIM(a, frac(`(${den(a)})${F0}`, ptext(den2))), Lq)}, ${jh(is(LIM(dd, F0), e), '을/를')} 만족시킬 때, ${fx(null, s)}의 값은?`, v, {
        explain: `${nb(`${ptext(den2)} = (${den(a)})(${den(w)})`)}이므로 약분하면 ${is(frac(fx(null, a), `${pn(a)} ${MINUS} ${pn(w)}`), Lq)}, 곧 ${is(fx(null, a), fa)}이다. 일차함수는 그 점의 값이 극한값이므로 ${is(fx(null, dd), e)}이다. 두 점을 지나는 일차함수는 ${is(F0, L(slope, c0))}이므로 ${is(fx(null, s), v)}이다.`,
        facts: { value: linValue(Lq.p, a, den2[1], dd, e, s), derived: [2] } });
    })
  ];
  // polyf-two 차례 2의 답을 문제에 적힌 수로 다시 셈하는 식(M = m·q, a = r − 3k² − 2Mk, b = −(k³ + Mk² + ak), f(s) = s³ + Ms² + as + b)
  function valueOfCubic(m, q, k, r, s) {
    const M = `(${m}*(${jn(q)}))`, kk = `(${jn(k)})`, A = `((${jn(r)})-3*${kk}*${kk}-2*${M}*${kk})`, Bq = `(0-(${kk}*${kk}*${kk}+${M}*${kk}*${kk}+${A}*${kk}))`, ss = `(${jn(s)})`;
    return `${ss}*${ss}*${ss}+${M}*${ss}*${ss}+${A}*${ss}+${Bq}`;
  }
  // polyf-linear 의 답: f(a) = L(2a + c1)(c1 은 분모의 x의 계수), 기울기 (e − f(a))/(dd − a), f(s) = e + 기울기·(s − dd)
  function linValue(Lp, a, c1, dd, e, s) {
    const fa = `(${jn(Lp)})*(2*(${jn(a)})+(${jn(c1)}))`;
    return `(${jn(e)})+((${jn(e)})-${fa})/((${jn(dd)})-(${jn(a)}))*((${jn(s)})-(${jn(dd)}))`;
  }

  // ══ 아. 함수의 극한의 대소 관계 ══
  const squeeze = [
    // ②15 두 다항식 사이에 낀 함수의 x → a 극한(차례 1: 모든 실수에서 이차식 둘, 차례 2: 모든 양수에서 일차식과 삼차식)
    T('sq-poly', '두 다항식 사이에 낀 함수의 극한', '②15', (d, n) => {
      const a = n === 0 ? nz(d, -3, 3) : d.int(1, 3), V0 = d.int(-4, 9);
      if (n === 0) {
        const u = d.int(1, 2), w = d.int(1, 2), lo = [V0 - u * a * a, 2 * u * a, -u], hi = [V0 + w * a * a, -2 * w * a, w];
        return numA(`함수 ${F0}가 모든 실수 ${X}에 대하여 ${jh(nb(`${ptext(lo)} ${K.LE} ${F0} ${K.LE} ${ptext(hi)}`), '을/를')} 만족시킬 때, ${LIM(a, F0)}의 값은?`, V0, {
          explain: `${LIM(a, par(ptext(lo)))} = ${iq(V0)}, ${LIM(a, par(ptext(hi)))} = ${iq(V0)}이므로 함수의 극한의 대소 관계에 의하여 ${is(LIM(a, F0), V0)}이다.`,
          facts: { value: polyJs(lo, a) } });
      }
      const p = nz(d, -3, 3), q = V0 - p * a, s = d.int(0, 3), lo = [q, p], hi = K.padd([q, p], K.pmul(fromRoots([a, a]), [s, 1]));
      return numA(`함수 ${F0}가 모든 양수 ${X}에 대하여 ${jh(nb(`${ptext(lo)} ${K.LE} ${F0} ${K.LE} ${ptext(hi)}`), '을/를')} 만족시킬 때, ${LIM(a, F0)}의 값은?`, V0, {
        explain: `${LIM(a, par(ptext(lo)))} = ${iq(V0)}, ${LIM(a, par(ptext(hi)))} = ${iq(V0)}이므로 함수의 극한의 대소 관계에 의하여 ${is(LIM(a, F0), V0)}이다.`,
        facts: { value: polyJs(lo, a) } });
    }, { count: 2 }),

    // ②16 두 유리식 사이에 낀 함수의 x → ∞ 극한(차례 1: (Vx + u)/x 꼴, 차례 2: 이차식의 비)
    T('sq-inf', '두 유리식 사이에 낀 함수의 x → ∞ 극한', '②16', (d, n) => {
      const V0 = nz(d, -4, 6);
      if (n === 0) {
        const u = d.int(1, 7), w = d.int(1, 7), form = d.bool();
        const ineq = form ? nb(`${frac(L(V0, -u), X)} ${K.LE} ${F0} ${K.LE} ${frac(L(V0, w), X)}`) : nb(`${iq(V0)} ${MINUS} ${frac(u, X)} &lt; ${F0} &lt; ${iq(V0)} + ${frac(w, X)}`);
        return numA(`함수 ${F0}가 모든 양수 ${X}에 대하여 ${jh(ineq, '을/를')} 만족시킬 때, ${LIM('∞', F0)}의 값은?`, V0, {
          explain: `${X} → ∞일 때 양쪽 식은 모두 ${jq(V0, '으로/로')} 가까워지므로 함수의 극한의 대소 관계에 의하여 ${is(LIM('∞', F0), V0)}이다.`,
          facts: { value: jn(V0) } });
      }
      const C1 = d.int(1, 3), C2 = d.int(1, 3), D1 = d.int(1, 5), D2 = d.int(1, 5), B1 = V0 * D1 - d.int(1, 6), B2 = V0 * D2 + d.int(1, 6);
      const lo = frac(ptext([B1, 0, V0 * C1]), ptext([D1, 0, C1])), hi = frac(ptext([B2, 0, V0 * C2]), ptext([D2, 0, C2]));
      return numA(`함수 ${F0}가 모든 실수 ${X}에 대하여 ${jh(nb(`${lo} ${K.LE} ${F0} ${K.LE} ${hi}`), '을/를')} 만족시킬 때, ${LIM('∞', F0)}의 값은?`, V0, {
        explain: `양쪽 식의 분모와 분자를 ${X}${sup(2)}으로 나누면 ${X} → ∞일 때 모두 최고차항의 계수의 비 ${jq(V0, '으로/로')} 가까워진다. 함수의 극한의 대소 관계에 의하여 ${is(LIM('∞', F0), V0)}이다.`,
        facts: { value: `(${jn(V0 * C1)})/${C1}` } });
    }, { count: 2 }),

    // ②17 부등식을 나눈 뒤 대소 관계 — x → ∞(차례 1: 각 변을 x로, 차례 2: 이차식으로)
    T('sq-divide', '부등식을 나누어 쓰는 대소 관계', '②17', (d, n) => {
      if (n === 0) {
        const A = d.int(1, 4), C0 = d.int(2, 5), C1 = d.int(0, C0 - 1), B1 = d.int(-3, 3), B2 = d.int(-3, 3), K2 = d.int(2, 3);
        const lo = (x) => (A * x * x + B1) / (x + C0), hi = (x) => (K2 * A * x * x + B2) / (K2 * (x + C1));
        let ok = true; for (let i = 0; i <= 400; i += 1) { const x = 1 + 1e-6 + 10 ** (i / 100) - 1; if (!(lo(x) <= hi(x) + 1e-12)) { ok = false; break; } }
        if (!ok || B1 === 0 || B2 === 0) return null;
        const loH = frac(ptext([B1, 0, A]), L(1, C0)), hiH = frac(ptext([B2, 0, K2 * A]), L(K2, K2 * C1));
        return numA(`함수 ${F0}가 ${nb(`${X} &gt; 1`)}인 모든 실수 ${X}에 대하여 ${jh(nb(`${loH} ${K.LE} ${F0} ${K.LE} ${hiH}`), '을/를')} 만족시킬 때, ${LIM('∞', frac(F0, X))}의 값은?`, A, {
          explain: `${X} &gt; 0이므로 각 변을 ${X}로 나누어도 부등호의 방향은 그대로이다. ${X} → ∞일 때 ${jh(frac(loH, X), '과/와')} ${jh(frac(hiH, X), '은/는')} 모두 ${jq(A, '으로/로')} 가까워지므로 ${is(LIM('∞', frac(F0, X)), A)}이다.`,
          facts: { value: `${A}/1` } });
      }
      const p = d.int(2, 5), q = d.int(1, 4), r = q + d.int(1, 3), a = d.pick([1, 1, 2]), b = d.int(1, 3), c = d.int(1, 5), v = Q(p * p, a);
      if (v.q !== 1) return null;
      const denH = ptext([c, b, a]);
      return numA(`함수 ${F0}가 모든 양수 ${X}에 대하여 ${jh(nb(`(${L(p, q)})${sup(2)} ${K.LE} ${F0} ${K.LE} (${L(p, r)})${sup(2)}`), '을/를')} 만족시킬 때, ${LIM('∞', frac(F0, denH))}의 값은?`, v.p, {
        explain: `${denH} &gt; 0이므로 각 변을 ${jh(denH, '으로/로')} 나눈다. ${X} → ∞일 때 양쪽은 모두 ${a === 1 ? '' : `${frac(p * p, a)} = `}${jq(v.p, '으로/로')} 가까워지므로 극한값은 ${iq(v.p)}이다.`,
        facts: { value: `${p}*${p}/${a}` } });
    }, { count: 2 }),

    // ②18 부등식을 나눈 뒤 대소 관계 — x → a+ 의 0/0
    T('sq-oneside', '부등식을 나누어 구하는 우극한', '②18', (d) => {
      const a = nz(d, -4, 3), Lv = nz(d, -6, 6), m = d.pick([2, 3]), u = Lv - a, v = Lv - m * a;
      const lo = K.pmul([-a, 1], [u, 1]), hi = K.pmul([-a, 1], [v, m]);
      if (lo[0] === 0 || hi[0] === 0) return null;
      return numA(`함수 ${F0}가 ${nb(`${X} &gt; ${iq(a)}`)}인 모든 실수 ${X}에 대하여 ${jh(nb(`${ptext(lo)} ${K.LE} ${F0} ${K.LE} ${ptext(hi)}`), '을/를')} 만족시킬 때, ${LIM(a, frac(F0, den(a)), '+')}의 값은?`, Lv, {
        explain: `${X} &gt; ${iq(a)}이면 ${den(a)} &gt; 0이므로 각 변을 ${jh(den(a), '으로/로')} 나누어도 부등호의 방향은 그대로이다. ${frac(ptext(lo), den(a))} = ${L(1, u)}, ${frac(ptext(hi), den(a))} = ${L(m, v)}이고 ${X} → ${iq(a)}+일 때 둘 다 ${jq(Lv, '으로/로')} 가까워지므로 극한값은 ${iq(Lv)}이다.`,
        facts: { value: `(${jn(lo[1])})+2*(${jn(a)})`, derived: [2] } });
    })
  ];

  // ══ 자. 도형과 극한 ══
  const shape = [
    // ②20 곡선 위의 점과 선분 길이의 비(t → 0+)
    T('shape-curve', '곡선 위의 점과 선분 길이의 비의 극한', '②20', (d) => {
      const c = d.int(1, 2), m = d.int(1, 2), p = 2 * c * m, c2 = c * c, t0 = 1.4;
      const f = (x) => Math.sqrt(p * x + c2);
      const figure = plot({ x: [-c2 / p - 0.6, 3.2], y: [-0.6, f(3.2) + 0.6], w: 260, curves: [{ f, from: -c2 / p + 1e-9, to: 3.2, color: BLUE }],
        lines: [{ x: t0, said: 'x = t인 직선' }, { y: c, said: `점 Q를 지나고 x축에 평행한 직선` }],
        dots: [{ x: t0, y: f(t0), name: 'P', side: 'ul', said: '곡선과 직선 x = t의 교점' }, { x: 0, y: c, name: 'Q', side: 'ul', said: `(0, ${c})` }, { x: t0, y: c, name: 'R', side: 'dr', said: '(t, ' + c + ')' }],
        xt: [{ v: t0, t: 't' }], yt: [c], oSide: 'r' });
      return N(`그림과 같이 곡선 ${jh(nb(`${V('y')} = ${rt(L(p, c2))}`), '과/와')} 직선 ${is(X, Tv)}가 만나는 점을 P라 하자. 점 ${jh(`Q(0, ${c})`, '을/를')} 지나고 ${X}축에 평행한 직선이 직선 ${is(X, Tv)}와 만나는 점을 R라 할 때, ${lim('t→0+', frac(SG('PR'), SG('QR')))}의 값은? ${nb(`(단, ${Tv} &gt; 0)`)}`, m, {
        figure, explain: `${nb(`${SG('PR')} = ${rt(L(p, c2, Tv))} ${MINUS} ${c}`)}, ${is(SG('QR'), Tv)}이므로 분자를 유리화하면 ${frac(`${p}${Tv}`, `${Tv}(${rt(L(p, c2, Tv))} + ${c})`)}이다. ${Tv} → 0+일 때 ${frac(p, `${c} + ${c}`)} = ${m}이다.`,
        facts: { value: `${p}/(2*${c})`, derived: [2] } });
    }),

    // ②21 원의 중심과 선분 길이의 비(t → ∞). 곡선 y = kx² 위의 점과 원점을 지나는 원.
    T('shape-circle', '원의 중심과 선분 길이의 비의 극한', '②21', (d) => {
      const k = d.int(1, 3), t0 = k === 1 ? 1.3 : k === 2 ? 0.95 : 0.8, r0 = (1 + k * k * t0 * t0) / (2 * k), P0 = [t0, k * t0 * t0];
      const xr = Math.max(r0, t0) + 0.6;
      const figure = plot({ x: [-xr, xr], y: [-0.4, 2 * r0 + 0.5], w: 240, curves: [{ f: (x) => k * x * x, color: BLUE, name: `y=${k === 1 ? '' : k}x^2` }],
        params: [{ x: (s) => r0 * Math.cos(s), y: (s) => r0 + r0 * Math.sin(s), color: '#b42318' }],
        dots: [{ x: P0[0], y: P0[1], name: 'P', side: 'r', said: '곡선 위의 점' }, { x: 0, y: r0, name: 'C', side: 'l', said: 'y축 위의 원의 중심' }] });
      return N(`그림과 같이 곡선 ${nb(`${V('y')} = ${k === 1 ? '' : k}${X}${sup(2)}`)} 위의 점 ${nb(`P(${Tv}, ${k === 1 ? '' : k}${Tv}${sup(2)})`)}${jh(nb(`(${Tv} &gt; 0)`), '이/가')} 있다. ${V('y')}축 위의 점 C를 중심으로 하고 두 점 O, P를 지나는 원에 대하여 ${lim('t→∞', frac(SG('OP'), SG('OC')))}의 값은? (단, O는 원점)`, 2, {
        figure, explain: `원의 반지름의 길이를 ${V('r')}라 하면 ${nb(`C(0, ${V('r')})`)}이고 ${is(SG('CP'), V('r'))}에서 ${nb(`${Tv}${sup(2)} + (${k === 1 ? '' : k}${Tv}${sup(2)} ${MINUS} ${V('r')})${sup(2)} = ${V('r')}${sup(2)}`)}이므로 ${is(V('r'), frac(`${k * k === 1 ? '' : k * k}${Tv}${sup(2)} + 1`, 2 * k))}이다. ${is(SG('OP'), rt(`${Tv}${sup(2)} + ${k * k === 1 ? '' : k * k}${Tv}<sup>4</sup>`))}이므로 분모와 분자를 ${Tv}${sup(2)}으로 나누면 ${SG('OP')}는 ${k === 1 ? '' : k}${Tv}${sup(2)}에, ${SG('OC')}는 그 절반에 가까운 크기로 커진다. 따라서 극한값은 2이다.`,
        facts: { value: '2', derived: [2] } });
    }),

    // ②24 반원 위의 점과 삼각형 넓이의 극한(답은 늘 정수가 아닌 분수)
    T('shape-semi', '반원 위의 점과 삼각형의 넓이의 극한', '②24', (d) => {
      const q = d.pick([1, 3, 5]), v = Q(q * q, 2), a0 = 0.55, b0 = Math.sqrt(1 - a0 * a0);
      const figure = plot({ x: [-1.3, q + 0.4], y: [-0.3, 1.3], w: q === 1 ? 230 : 270, xt: [-1, 1].concat(q > 1 ? [q] : []), yt: [1],
        params: [{ x: (s) => Math.cos(s), y: (s) => Math.sin(s), from: 0, to: Math.PI, color: BLUE }],
        segs: [{ p: [0, 0], q: [a0, b0] }, { p: [a0, b0], q: [q, 0] }],
        dots: [{ x: a0, y: b0, name: 'P', side: 'ur', said: '반원 위의 점 (a, b)' }, { x: q, y: 0, name: 'Q', side: q === 1 ? 'ur' : 'u', said: `(${q}, 0)` }] });
      return numA(`그림과 같이 중심이 원점 O이고 반지름의 길이가 1인 반원 위를 움직이는 제1사분면 위의 점 ${nb(`P(${Av}, ${Bv})`)}와 점 Q(${q}, 0)에 대하여 삼각형 OQP의 넓이를 ${V('S')}(${Av})라 할 때, ${lim('a→1-', frac(`{${V('S')}(${Av})}${sup(2)}`, `1 ${MINUS} ${Av}`))}의 값은?`, v, {
        figure, explain: `${nb(`${Av}${sup(2)} + ${Bv}${sup(2)} = 1`)}이므로 ${is(Bv, rt(`1 ${MINUS} ${Av}${sup(2)}`))}이고 ${is(`${V('S')}(${Av})`, `${frac(1, 2)} × ${q === 1 ? '' : `${q} × `}${rt(`1 ${MINUS} ${Av}${sup(2)}`)}`)}이다. ${nb(`{${V('S')}(${Av})}${sup(2)} = ${frac(`${q === 1 ? '' : q * q}(1 ${MINUS} ${Av})(1 + ${Av})`, 4)}`)}이므로 약분하면 ${frac(`${q === 1 ? '' : q * q}(1 + ${Av})`, 4)}이고, ${Av} → 1−일 때 ${iq(v)}이다.`,
        facts: { value: `${q}*${q}/2`, derived: [2] } });
    })
  ];

  B.addTypes('11-2-1', 'zero', zero);
  B.addTypes('11-2-1', 'inf', inf);
  B.addTypes('11-2-1', 'coef', coef);
  B.addTypes('11-2-1', 'polyf', polyf);
  B.addTypes('11-2-1', 'squeeze', squeeze);
  B.addTypes('11-2-1', 'shape', shape);
})(typeof window !== 'undefined' ? window : globalThis);
