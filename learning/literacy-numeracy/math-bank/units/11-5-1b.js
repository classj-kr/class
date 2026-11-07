// 고등학교 미적분Ⅱ Ⅰ-1 수열의 극한 — 뒤쪽 묶음(∞/∞·∞ − ∞ 꼴, 대소 관계, 도형과 수열의 극한, 등비수열의 수렴과 발산, 등비수열이 든 극한값).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-1a.js 머리에 적었다. 도구는 B.kit.u1151(a 파일)을 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, C, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qcmp, isInt, nb, V, sup, nz, rt } = B.kit.mid;
  const { ms, pw, trig, hx, plot, jh } = B.kit.hs;
  const K = B.kit.u1151;
  const { S2, S3, T, NV, RV, XV, Av, Bv, Kv, AL, AN, BN, iq, jn, jq, pn, is, par, seq, LN, LE, ptext, lead, MO, convTo, PINF, NINF, OSC, numA, vals, cells, pickOne, judge, JUDGE } = K;
  const YV = V('y'), LNn = ms('l_n'), A1 = ms('a_1'), A2 = ms('a_2'), An1 = ms('a_{n+1}');
  const sq2 = (h) => h + sup(2);
  // 근호 안 다항식: √(4n² + 3n)
  const R = (a) => rt(ptext(a));
  // 거듭제곱 항 coef × base^(n + e) 를 앞 항 뒤에 이어 붙인다(first 면 맨 앞)
  const ex = (e, tw) => (e === 0 ? (tw ? '2n' : 'n') : e > 0 ? `${tw ? '2n' : 'n'}+${e}` : `${tw ? '2n' : 'n'}-${-e}`);
  const term = (c, base, e, first, tw) => { const body = pw(base, ex(e, tw)); const mag = Math.abs(c) === 1 ? body : `${Math.abs(c)} × ${body}`; return first ? (c < 0 ? MINUS + mag : mag) : (c < 0 ? ` ${MINUS} ` : ' + ') + mag; };
  const terms = (list) => list.map(([c, base, e, tw], i) => term(c, base, e, i === 0, tw)).join('');
  const rep = (base, times) => (times <= 0 ? '1' : Array(times).fill(String(base)).join('*'));

  // ══ 다. ∞/∞ 꼴과 ∞ − ∞ 꼴의 극한 ══
  const calc = [
    // ①16 ∞/∞ 꼴 유리식(차례 1: 차수가 같다, 차례 2: 분모의 차수가 크다, 차례 3: 분자가 곱의 꼴)
    T('calc-ratio', '∞/∞ 꼴의 극한값 — 분모의 최고차항으로 나누기', '①16', (d, n) => {
      if (n === 0) {
        const D = d.int(1, 4), t = nz(d, -5, 5), top = [d.int(-6, 6), d.int(-6, 6), t * D], bot = [nz(d, -6, 6), d.int(-5, 5), D];
        return numA('다음 극한값은?', t, { figure: hx(LN(frac(ptext(top), ptext(bot)))),
          explain: `분모와 분자를 ${sq2(NV)}으로 나누면 ${NV} → ∞일 때 ${sq2(NV)}이 아닌 항은 0에 한없이 가까워지므로 최고차항의 계수의 비 ${D === 1 ? '' : `${frac(iq(t * D), D)} = `}${iq(t)}이다.`,
          facts: { value: `(${jn(t * D)})/${D}` } });
      }
      if (n === 1) {
        const hi = d.pick([2, 3]), top = hi === 2 ? [d.int(-6, 6), nz(d, -5, 5)] : [d.int(-6, 6), d.int(-3, 3), nz(d, -4, 4)];
        const bot = hi === 2 ? [nz(d, -6, 6), d.int(-5, 5), d.int(1, 5)] : [nz(d, -5, 5), 0, d.int(-3, 3), d.int(1, 4)];
        return numA('다음 극한값은?', 0, { figure: hx(LN(frac(ptext(top), ptext(bot)))),
          explain: `분모의 차수가 분자의 차수보다 크므로 분모와 분자를 ${NV}${sup(hi)}으로 나누면 분자는 0에, 분모는 ${iq(bot[hi])}에 한없이 가까워진다. 따라서 극한값은 0이다.`,
          facts: { value: '0' } });
      }
      const p = nz(d, -4, 4), q = nz(d, -5, 5), r = d.int(1, 4), s = nz(d, -5, 5), u = d.pick([1, 2, 3]);
      if ((p * r) % u !== 0) return null;
      const v = p * r / u, bot = [d.int(-4, 6), nz(d, -5, 5), u];
      return numA('다음 극한값은?', v, { figure: hx(LN(frac(`(${ptext([q, p])})(${ptext([s, r])})`, ptext(bot)))),
        explain: `분자를 전개하면 최고차항이 ${lead(p * r, sq2(NV))}이므로 분모와 분자를 ${sq2(NV)}으로 나누면 극한값은 ${u === 1 ? '' : `${frac(iq(p * r), u)} = `}${iq(v)}이다.`,
        facts: { value: `(${jn(p)})*${r}/${u}` } });
    }, { count: 3 }),

    // ①17 다항식·분수식이 ±∞로 발산하는가 — 최고차항으로 묶어 판정
    T('calc-div', '최고차항으로 묶어 발산하는 쪽 가리기', '①17', (d) => {
      const s = d.pick([1, -1]), a = d.int(1, 4), b = d.int(2, 5), c = nz(d, -6, 6), e = d.int(1, 6);
      const pool = [
        () => ({ h: ptext([c, -s * b, s * a]), k: s > 0 ? '+' : '-', others: [0, s * a], why: `${sq2(NV)}으로 묶으면 ${sq2(NV)} → ∞이고 괄호 안은 ${iq(s * a)}에 수렴한다` }),
        () => ({ h: frac(ptext([0, e, c, s * a]), ptext([1, 0, 1])), k: s > 0 ? '+' : '-', others: [s * a, 0], why: `분모와 분자를 ${sq2(NV)}으로 나누면 분자에 ${lead(s * a, NV)}이 남아 ${s > 0 ? '양의' : '음의'} 무한대로 간다` }),
        () => ({ h: frac(ptext([0, 1, s * a]), ptext([1, b])), k: s > 0 ? '+' : '-', others: [Q(s * a, b), 0], why: `분모와 분자를 ${NV}으로 나누면 분자에 ${lead(s * a, NV)}이 남고 분모는 ${iq(b)}에 가까워진다` }),
        () => ({ h: frac(ptext([0, 1, 0, s * a]), ptext([e, 1])), k: s > 0 ? '+' : '-', others: [s * a, 0], why: `분모와 분자를 ${NV}으로 나누면 분자에 ${lead(s * a, sq2(NV))}이 남아 ${s > 0 ? '양의' : '음의'} 무한대로 간다` })
      ];
      const e0 = d.pick(pool)();
      return judge(d, JUDGE, hx(seq(e0.h)), { k: e0.k }, e0.others, `${e0.why}. 따라서 ${e0.k === '+' ? '양의' : '음의'} 무한대로 발산한다.`);
    }),

    // ①18 합의 공식이 든 ∞/∞(차례 1: 1² + 2² + ⋯ + n², 차례 2: 1 × 3 + 2 × 4 + ⋯, 차례 3: 등차수열의 합)
    T('calc-sum', '합의 공식이 든 극한값', '①18', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 3), top = a === 1 ? NV + sup(3) : `(${a}${NV})${sup(3)}`;
        return numA('다음 극한값은?', 3 * a ** 3, { figure: hx(LN(frac(top, `1${sup(2)} + 2${sup(2)} + 3${sup(2)} + ⋯ + ${sq2(NV)}`))),
          explain: `${nb(`1${sup(2)} + 2${sup(2)} + ⋯ + ${sq2(NV)} = ${frac(`${NV}(${NV} + 1)(2${NV} + 1)`, 6)}`)}이므로 주어진 식은 ${frac(`${6 * a ** 3}${NV}${sup(3)}`, `${NV}(${NV} + 1)(2${NV} + 1)`)}이고, 분모와 분자를 ${NV}${sup(3)}으로 나누면 ${frac(6 * a ** 3, 2)} = ${3 * a ** 3}이다.`,
          facts: { value: `3*${rep(a, 3)}` } });
      }
      if (n === 1) {
        const c = d.int(1, 3), p = d.int(1, 2), q = d.int(1, 3);
        const den = `1 × ${1 + c} + 2 × ${2 + c} + ⋯ + ${NV}(${NV} + ${c})`;
        return numA('다음 극한값은?', 3 * p ** 3, { figure: hx(LN(frac(`(${ptext([q, p])})${sup(3)}`, den))),
          explain: `분모는 ${nb(`${frac(`${NV}(${NV} + 1)(2${NV} + 1)`, 6)} + ${c === 1 ? '' : `${c} × `}${frac(`${NV}(${NV} + 1)`, 2)}`)}이라 최고차항이 ${frac(NV + sup(3), 3)}이다. 분자의 최고차항은 ${lead(p ** 3, NV + sup(3))}이므로 극한값은 ${p ** 3} × 3 = ${3 * p ** 3}이다.`,
          facts: { value: `3*${rep(p, 3)}` } });
      }
      const m = d.int(1, 2), t = nz(d, -3, 3), D = 2 * m * t, A = nz(d, -5, 9), r = d.int(1, 5);
      const denH = m === 1 ? sq2(NV) : `${m}${sq2(NV)} + ${r}`;
      return numA(`첫째항이 ${iq(A)}이고 공차가 ${iq(D)}인 등차수열 ${seq(AN)}에 대하여 ${LN(frac(`${A1} + ${A2} + ⋯ + ${AN}`, denH))}의 값은?`, t, {
        explain: `${nb(`${A1} + ⋯ + ${AN} = ${frac(`${NV}{2 × ${pn(A)} + (${NV} ${MINUS} 1) × ${pn(D)}}`, 2)}`)}이므로 최고차항은 ${lead(Q(D, 2), sq2(NV))}이다. 따라서 극한값은 ${frac(iq(D), 2 * m)} = ${iq(t)}이다.`,
        facts: { value: `(${jn(D)})/(2*${m})`, derived: [2, m] } });
    }, { count: 3 }),

    // ①19 약분되는 곱이 이어진 식(원문은 답이 늘 1 — 앞에 곱하는 식을 (pn + q)ᵐ으로 바꿨다)
    T('calc-prod', '약분되는 곱이 이어진 식의 극한값', '①19', (d) => {
      const m = d.int(1, 2), p = d.int(2, 5), q = nz(d, -3, 3);
      const prodH = `(1 ${MINUS} ${frac(1, 2)})(1 ${MINUS} ${frac(1, 3)}) × ⋯ × (1 ${MINUS} ${frac(1, NV)})`;
      const body = m === 1 ? `(${ptext([q, p])})${AN}` : `(${ptext([q, p])})${sup(2)}${AN}${sup(2)}`;
      return numA(`2 이상의 자연수 ${NV}에 대하여 수열 ${jh(seq(AN), '이/가')} 다음과 같을 때, ${LN(body)}의 값은?`, p ** m, { figure: hx(is(AN, prodH)),
        explain: `${is(AN, nb(`${frac(1, 2)} × ${frac(2, 3)} × ⋯ × ${frac(`${NV} ${MINUS} 1`, NV)}`))} = ${frac(1, NV)}이므로 주어진 식은 ${m === 1 ? frac(ptext([q, p]), NV) : `(${frac(ptext([q, p]), NV)})${sup(2)}`}이고 극한값은 ${m === 1 ? p : `${p}${sup(2)} = ${p * p}`}이다.`,
        facts: { value: rep(p, m) } });
    }),

    // ①20 근호가 든 ∞/∞ — 근호 안까지 n으로 나누기(차례 1: 답에 근호가 남는 것은 고르기, 차례 2: 정수 답)
    T('calc-rootdiv', '근호가 든 ∞/∞ 꼴의 극한값', '①20', (d, n) => {
      if (n === 0) {
        const p = d.pick([2, 3, 5, 6, 7]), t = d.int(1, 2), k = t * (p - 1), a = d.int(1, 4), b = nz(d, -4, 4);
        const h = frac(`${k === 1 ? '' : k}${NV}`, `${R([0, -a, p])} + ${R([b, 0, 1])}`);
        const opt = (tt, sgn) => (tt === 1 ? `${rt(p)} ${sgn} 1` : `${tt}${rt(p)} ${sgn} ${tt}`);
        const rows = [{ h: opt(t, MINUS), ok: true }, { h: opt(t, '+'), ok: false }, { h: iq(Q(k, p + 1)), ok: false }, { h: `${t === 1 ? '' : t}${rt(p)}`, ok: false }, { h: iq(Q(k, 2)), ok: false }];
        return pickOne(d, '다음 극한값은?', rows, { figure: hx(LN(h)),
          explain: `분모와 분자를 ${NV}으로 나누면(근호 안은 ${sq2(NV)}으로 나눈다) ${frac(k, `${rt(`${p} ${MINUS} ${frac(a, NV)}`)} + ${rt(`1 ${b < 0 ? MINUS : '+'} ${frac(Math.abs(b), sq2(NV))}`)}`)} → ${frac(k, `${rt(p)} + 1`)}이다. 분모를 유리화하면 ${frac(`${k}(${rt(p)} ${MINUS} 1)`, p - 1)} = ${opt(t, MINUS)}이다.` });
      }
      const a = d.int(1, 4), c = nz(d, -4, 4), dd = d.int(1, 4), b = nz(d, -6, 6), e = d.int(1, 6);
      if (a + c === 0 || (a + c) % dd !== 0) return null;
      const v = (a + c) / dd;
      return numA('다음 극한값은?', v, { figure: hx(LN(frac(`${R([0, b, a * a])} ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${NV}`, ptext([e, dd])))),
        explain: `분모와 분자를 ${NV}으로 나누면 ${frac(`${rt(`${a * a} ${b < 0 ? MINUS : '+'} ${frac(Math.abs(b), NV)}`)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`, `${dd} + ${frac(e, NV)}`)} → ${frac(`${a} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`, dd)} = ${iq(v)}이다.`,
        facts: { value: `(${a}+(${jn(c)}))/${dd}`, derived: [a] } });
    }, { count: 2 }),

    // ①21 ∞ − ∞ 꼴 — 분자의 근호를 유리화(차례 1: √(a²n² + bn + c) − an, 차례 2: 근호 둘의 차, 차례 3: √n을 곱한 꼴). 답은 늘 정수가 아닌 분수.
    T('calc-root', '∞ − ∞ 꼴의 극한값 — 근호를 유리화', '①21', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 3), b = nz(d, -7, 9), c = nz(d, -6, 6);
        if (b % (2 * a) === 0 || a * a + b + c <= 0 || 4 * a * a + 2 * b + c <= 0) return null;
        const v = Q(b, 2 * a);
        return numA('다음 극한값은?', v, { figure: hx(LN(`(${R([c, b, a * a])} ${MINUS} ${lead(a, NV)})`)),
          explain: `분모를 1로 보고 분자를 유리화하면 ${frac(ptext([c, b]), `${R([c, b, a * a])} + ${lead(a, NV)}`)}이고, 분모와 분자를 ${NV}으로 나누면 ${frac(iq(b), `${a} + ${a}`)} = ${iq(v)}이다.`,
          facts: { value: `(${jn(b)})/(2*${a})`, derived: [2, a] } });
      }
      if (n === 1) {
        const a = d.int(1, 2), p = d.int(1, 7), s = d.until(() => d.int(-a * a, 6), (x) => x !== 0 && x !== p);
        if ((p - s) % (2 * a) === 0) return null;
        const v = Q(p - s, 2 * a);
        return numA('다음 극한값은?', v, { figure: hx(LN(`(${R([0, p, a * a])} ${MINUS} ${R([0, s, a * a])})`)),
          explain: `유리화하면 ${frac(lead(p - s, NV), `${R([0, p, a * a])} + ${R([0, s, a * a])}`)}이고, 분모와 분자를 ${NV}으로 나누면 ${frac(iq(p - s), `${a} + ${a}`)} = ${iq(v)}이다.`,
          facts: { value: `(${p}-(${jn(s)}))/(2*${a})`, derived: [2, a] } });
      }
      const p = d.pick([-1, 1, 3, 5, 7]), k = d.pick([1, 3]), v = Q(k * p, 2);
      const inner = p < 0 ? `${NV} ${MINUS} ${-p}` : `${NV} + ${p}`;
      return numA('다음 극한값은?', v, { figure: hx(LN(`${k === 1 ? '' : k}${rt(NV)}(${rt(inner)} ${MINUS} ${rt(NV)})`)),
        explain: `유리화하면 ${frac(`${iq(k * p)}${rt(NV)}`, `${rt(inner)} + ${rt(NV)}`)}이고, 분모와 분자를 ${rt(NV)}으로 나누면 ${frac(iq(k * p), '1 + 1')} = ${iq(v)}이다.`,
        facts: { value: `${k}*(${jn(p)})/2`, derived: [2] } });
    }, { count: 3 }),

    // ①22 분모에 근호의 차 — 분모를 유리화(차례 1: 수렴하는 값, 정수가 아닌 분수 / 차례 2: 수렴·발산 가리기)
    T('calc-rootden', '분모에 근호의 차가 있는 극한', '①22', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 2), k = d.int(1, 3), p = d.pick([3, 5, 7, 9]);
        if ((2 * a * k) % p === 0) return null;
        const v = Q(2 * a * k, p);
        return numA('다음 극한값은?', v, { figure: hx(LN(frac(k, `${R([0, p, a * a])} ${MINUS} ${lead(a, NV)}`))),
          explain: `분모를 유리화하면 ${frac(`${k === 1 ? '' : k}(${R([0, p, a * a])} + ${lead(a, NV)})`, `${p}${NV}`)}이고, 분모와 분자를 ${NV}으로 나누면 ${frac(`${k === 1 ? '' : k}(${a} + ${a})`, p)} = ${iq(v)}이다.`,
          facts: { value: `2*${a}*${k}/${p}`, derived: [2, a] } });
      }
      const p = d.int(2, 7), k = d.int(1, 3);
      const pool = [
        () => ({ h: frac(1, `${rt(`${NV} + ${p}`)} ${MINUS} ${rt(NV)}`), res: { k: '+' }, others: [Q(1, p), 0], why: `분모를 유리화하면 ${frac(`${rt(`${NV} + ${p}`)} + ${rt(NV)}`, p)}이고 분자가 한없이 커지므로 양의 무한대로 발산한다` }),
        () => ({ h: `${MINUS}${frac(k, `${rt(`${NV} + ${p}`)} ${MINUS} ${rt(NV)}`)}`, res: { k: '-' }, others: [Q(-k, p), 0], why: `분모를 유리화하면 ${MINUS}${frac(`${k}(${rt(`${NV} + ${p}`)} + ${rt(NV)})`, p)}이므로 음의 무한대로 발산한다` }),
        () => ({ h: frac(k, `${R([0, p, 1])} ${MINUS} ${NV}`), res: { k: 'v', v: Q(2 * k, p) }, others: [Q(k, p), 0], why: `분모를 유리화하면 ${frac(`${k}(${R([0, p, 1])} + ${NV})`, `${p}${NV}`)} → ${iq(Q(2 * k, p))}이다` }),
        () => ({ h: frac(1, `${R([p, 0, 1])} ${MINUS} ${NV}`), res: { k: '+' }, others: [0, Q(1, p)], why: `분모를 유리화하면 ${frac(`${R([p, 0, 1])} + ${NV}`, p)}이므로 양의 무한대로 발산한다` })
      ];
      const e = d.pick(pool)();
      return judge(d, JUDGE, hx(seq(e.h)), e.res, e.others, `${e.why}.`);
    }, { count: 2 }),

    // ①23 유리식 극한값이 주어질 때 계수 — 분자의 이차항 계수가 0이어야 한다
    T('calc-coef', '극한값이 주어진 유리식의 계수', '①23', (d) => {
      const p = d.int(2, 5), Lv = nz(d, -6, 7), c = nz(d, -5, 5), q = d.int(1, 5), b = p * Lv;
      return vals(`${jh(is(LN(frac(`${Av}${sq2(NV)} + ${Bv}${NV} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`, ptext([q, p]))), Lv), '이/가')} 성립하도록 하는 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, 0], [Bv, b]], {
        explain: `${Av} ${'≠'} 0이면 분자의 차수가 분모보다 커서 발산하므로 ${is(Av, 0)}이다. 이때 ${LN(frac(`${Bv}${NV} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`, ptext([q, p])))} = ${frac(Bv, p)}이므로 ${is(frac(Bv, p), Lv)}에서 ${is(Bv, b)}이다.`,
        facts: { calc: [['0', 0], [`${p}*(${jn(Lv)})`, 1]] } });
    }),

    // ①24 근호가 든 극한값이 주어질 때 상수(차례 1: √(m²n² + an + c) − mn, 차례 2: 분모에 근호의 차)
    T('calc-rootcoef', '극한값이 주어진 무리식의 상수', '①24', (d, n) => {
      if (n === 0) {
        const m = d.int(1, 3), a = nz(d, -9, 9), c = nz(d, -5, 5);
        for (let k = 1; k <= 30; k += 1) if (m * m * k * k + a * k + c < 0) return null;
        const Lv = Q(a, 2 * m);
        return numA(`${is(LN(`(${rt(`${ptext([0, 0, m * m])} + ${Av}${NV} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)} ${MINUS} ${lead(m, NV)})`), Lv)}일 때, 상수 ${Av}의 값은?`, a, {
          explain: `유리화하면 ${frac(`${Av}${NV} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`, `${rt(`${ptext([0, 0, m * m])} + ${Av}${NV} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)} + ${lead(m, NV)}`)}이고, 분모와 분자를 ${NV}으로 나누면 ${frac(Av, 2 * m)}에 수렴한다. ${is(frac(Av, 2 * m), Lv)}에서 ${is(Av, a)}이다.`,
          facts: { value: `2*${m}*(${jn(Lv)})`, derived: [2, m] } });
      }
      const [u, v] = d.pick([[1, -1], [2, 0], [3, 1], [4, 0]]), Lv = d.int(2, 5), w = (u - v) / 2, kk = (Lv * w) ** 2;
      const sq = (s) => (s === 0 ? rt(NV) : rt(s > 0 ? `${NV} + ${s}` : `${NV} ${MINUS} ${-s}`));
      return numA(`${is(LN(frac(rt(`${Kv}${NV} + 1`), `${NV}(${sq(u)} ${MINUS} ${sq(v)})`)), Lv)}일 때, 상수 ${Kv}의 값은?`, kk, {
        explain: `분모를 유리화하면 ${frac(`${rt(`${Kv}${NV} + 1`)}(${sq(u)} + ${sq(v)})`, `${u - v}${NV}`)}이고, 분모와 분자를 ${NV}으로 나누면 ${frac(`${rt(Kv)} × 2`, u - v)}에 수렴한다. ${is(frac(`2${rt(Kv)}`, u - v), Lv)}에서 ${is(rt(Kv), Lv * w)}, ${is(Kv, kk)}이다.`,
        facts: { value: `(${Lv}*(${u}-(${jn(v)}))/2)*(${Lv}*(${u}-(${jn(v)}))/2)`, derived: [2] } });
    }, { count: 2 })
  ];

  // ══ 라. 수열의 극한의 대소 관계 ══
  const squeeze = [
    // ①25 sin nθ·cos nθ가 든 수열(원문 sin nθ/n 은 늘 0 — (pn + k sin nθ)/(n + c)로 바꿨다)
    T('sq-trig', '삼각함수가 든 수열의 극한 — 대소 관계', '①25', (d) => {
      const p = nz(d, -5, 6), k = d.int(1, 5), c = d.int(1, 5), f = d.pick(['sin', 'cos']), TH = V('θ');
      const tr = `${k === 1 ? '' : k}${trig(f, NV + TH)}`;
      return numA(`${LN(frac(`${lead(p, NV)} + ${tr}`, `${NV} + ${c}`))}의 값은? (단, ${TH}는 상수이다.)`, p, {
        explain: `${nb(`${MINUS}${k} ${LE} ${tr} ${LE} ${k}`)}이므로 ${nb(`${frac(`${lead(p, NV)} ${MINUS} ${k}`, `${NV} + ${c}`)} ${LE} ${frac(`${lead(p, NV)} + ${tr}`, `${NV} + ${c}`)} ${LE} ${frac(`${lead(p, NV)} + ${k}`, `${NV} + ${c}`)}`)}이다. 양쪽 끝의 극한값이 모두 ${iq(p)}이므로 수열의 극한의 대소 관계에 의하여 극한값은 ${iq(p)}이다.`,
        facts: { value: jn(p) } });
    }),

    // ①26 다항식 사이에 낀 수열(차례 1: n²aₙ이 끼어 lim aₙ, 차례 2: aₙ이 끼어 aₙ/(다항식)의 극한)
    T('sq-poly', '다항식 사이에 낀 수열의 극한', '①26', (d, n) => {
      const p = nz(d, -4, 6), u = d.int(1, 5), v = d.int(1, 5), w = d.int(u, u + 4);
      if (n === 0) {
        return numA(`수열 ${jh(seq(AN), '이/가')} 모든 자연수 ${NV}에 대하여 ${jh(nb(`${ptext([u, 0, p])} &lt; ${sq2(NV)}${AN} &lt; ${ptext([w, v, p])}`), '을/를')} 만족시킬 때, ${LN(AN)}의 값은?`, p, {
          explain: `각 변을 ${sq2(NV)}으로 나누면 ${nb(`${frac(ptext([u, 0, p]), sq2(NV))} &lt; ${AN} &lt; ${frac(ptext([w, v, p]), sq2(NV))}`)}이고 양쪽 끝의 극한값이 모두 ${iq(p)}이므로 수열의 극한의 대소 관계에 의하여 ${is(LN(AN), p)}이다.`,
          facts: { value: jn(p) } });
      }
      const s = d.int(1, 4), t = d.int(1, 5), z = d.int(1, 5);
      return numA(`수열 ${jh(seq(AN), '이/가')} 모든 자연수 ${NV}에 대하여 ${jh(nb(`${ptext([-w, -u, p])} &lt; ${AN} &lt; ${ptext([z, v, p])}`), '을/를')} 만족시킬 때, ${LN(frac(AN, ptext([t, s, 1])))}의 값은?`, p, {
        explain: `${nb(`${ptext([t, s, 1])} &gt; 0`)}이므로 각 변을 ${jh(ptext([t, s, 1]), '으로/로')} 나누어도 부등호의 방향은 그대로이다. 양쪽 끝의 극한값이 모두 ${iq(p)}이므로 수열의 극한의 대소 관계에 의하여 극한값은 ${iq(p)}이다.`,
        facts: { value: jn(p) } });
    }, { count: 2 }),

    // ①27 근호가 든 부등식 — 제곱해 대소 관계
    T('sq-root', '근호가 든 부등식과 대소 관계', '①27', (d) => {
      const p = d.int(2, 4), v = d.int(1, 5), u = d.int(1, 9);
      if (u >= 2 * p * v + v * v) return null;
      return numA(`모든 항이 양수인 수열 ${jh(seq(AN), '이/가')} 모든 자연수 ${NV}에 대하여 ${jh(nb(`${R([u, 0, p * p])} &lt; ${rt(NV + AN)} &lt; ${ptext([v, p])}`), '을/를')} 만족시킬 때, ${LN(frac(AN, NV))}의 값은?`, p * p, {
        explain: `각 변을 제곱하면 ${nb(`${ptext([u, 0, p * p])} &lt; ${NV}${AN} &lt; ${ptext([v * v, 2 * p * v, p * p])}`)}이고, 각 변을 ${sq2(NV)}으로 나누면 양쪽 끝의 극한값이 모두 ${p * p}이다. 따라서 극한값은 ${p * p}이다.`,
        facts: { value: `${p}*${p}` } });
    })
  ];

  // ══ 마. 도형과 수열의 극한 ══
  const shape = [
    // ②1 직선에 수직인 직선의 x절편
    T('shape-perp', '수직인 직선의 x절편과 수열의 극한', '②1', (d) => {
      const k = d.int(2, 4), P = nb(`P(${NV}, ${k}${sq2(NV)})`);
      return numA(`자연수 ${NV}에 대하여 직선 ${nb(`${YV} = ${k}${NV}${XV}`)} 위의 점 ${jh(P, '을/를')} 지나고 이 직선에 수직인 직선이 ${XV}축과 만나는 점을 Q라 하자. 선분 OQ의 길이를 ${jh(LNn, '이라/라')} 할 때, ${LN(frac(LNn, NV + sup(3)))}의 값은? (단, O는 원점이다.)`, k * k, {
        explain: `수직인 직선의 기울기는 ${MINUS}${frac(1, `${k}${NV}`)}이므로 ${nb(`${YV} = ${MINUS}${frac(1, `${k}${NV}`)}(${XV} ${MINUS} ${NV}) + ${k}${sq2(NV)}`)}이다. ${is(YV, 0)}을 넣으면 ${is(XV, nb(`${NV} + ${k * k}${NV}${sup(3)}`))}이므로 ${is(LNn, nb(`${k * k}${NV}${sup(3)} + ${NV}`))}이고 극한값은 ${k * k}이다.`,
        facts: { value: `${k}*${k}` } });
    }),

    // ②2 곡선과 직선의 두 교점 사이 거리(답에 근호가 남아 고르기)
    T('shape-chord', '곡선과 직선의 두 교점 사이의 거리의 극한', '②2', (d) => {
      const m = d.int(1, 2), c = d.int(2, 5), k = d.int(1, 4 / m);
      // 답: c√(1 + m²)/m
      const r2 = 1 + m * m;
      const show = (top, rad, den) => { const g = gcd(top, den), tt = top / g, dd = den / g; const h = `${tt === 1 ? '' : tt}${rad ? rt(rad) : ''}` || '1'; return dd === 1 ? h : frac(h, dd); };
      const rows = [
        { h: show(c, r2, m), ok: true }, { h: show(c, 0, 1), ok: false }, { h: show(2 * c, r2, m), ok: false }, { h: show(c, r2, 2 * m), ok: false }, { h: m === 1 ? show(c, 3, 1) : show(c, 2, 1), ok: false }
      ];
      const lineH = nb(`${YV} = ${MINUS}${m === 1 ? '' : m}${XV} + ${c}${NV}`);
      return pickOne(d, `2 이상의 자연수 ${NV}에 대하여 곡선 ${jh(nb(`${YV} = ${frac(k, XV)}`), '과/와')} 직선 ${jh(lineH, '이/가')} 만나는 두 점 사이의 거리를 ${jh(LNn, '이라/라')} 할 때, ${LN(frac(LNn, NV))}의 값은?`, rows, {
        explain: `${nb(`${m === 1 ? '' : m}${sq2(XV)} ${MINUS} ${c}${NV}${XV} + ${k} = 0`)}의 두 근의 차는 ${m === 1 ? rt(`${c * c}${sq2(NV)} ${MINUS} ${4 * m * k}`) : frac(rt(`${c * c}${sq2(NV)} ${MINUS} ${4 * m * k}`), m)}이고, 직선의 기울기가 ${MINUS}${m}이므로 두 점 사이의 거리는 그 ${rt(r2)}배이다. ${NV}으로 나누면 ${show(c, r2, m)}에 수렴한다.` });
    }),

    // ②3 원 위의 점과 고정점 사이 거리의 최솟값
    T('shape-circle', '원 위의 점까지의 최소 거리의 극한', '②3', (d) => {
      const q = d.int(1, 6), p = nz(d, -5, 5), A = nb(`A(${iq(p)}, ${MINUS}${q})`);
      return numA(`자연수 ${NV}에 대하여 원 ${nb(`${sq2(XV)} + (${YV} ${MINUS} ${NV})${sup(2)} = ${sq2(NV)}`)} 위를 움직이는 점 ${ms('P_n')}과 점 ${jh(A, '이/가')} 있다. 선분 ${ms('AP_n')}의 길이의 최솟값을 ${jh(AN, '이라/라')} 할 때, ${LN(AN)}의 값은?`, q, {
        explain: `원의 중심 ${nb(`C(0, ${NV})`)}에서 ${is('AC', nb(rt(`${p * p} + (${NV} + ${q})${sup(2)}`)))}이므로 최솟값은 ${is(AN, nb(`${rt(`${sq2(NV)} + ${2 * q}${NV} + ${p * p + q * q}`)} ${MINUS} ${NV}`))}이다. 유리화하면 ${frac(`${2 * q}${NV} + ${p * p + q * q}`, `${rt(`${sq2(NV)} + ${2 * q}${NV} + ${p * p + q * q}`)} + ${NV}`)} → ${frac(2 * q, 2)} = ${q}이다.`,
        facts: { value: String(q) } });
    })
  ];

  // ══ 바. 등비수열의 수렴과 발산 ══
  const geo = [
    // ②4 공비로 판정하는 등비수열의 수렴·발산
    T('geo-judge', '등비수열의 수렴과 발산', '②4', (d) => {
      const u = d.int(1, 6), w = d.until(() => d.int(2, 7), (x) => x !== u && gcd(x, u) === 1), c = d.int(2, 5), kk = d.pick([2, 3, 5, 7]), dg = d.int(1, 9);
      const rn = (h) => `(${h})${sup(NV)}`;
      const pool = [
        () => ({ h: rn(frac(u, w)), res: u < w ? { k: 'v', v: 0 } : { k: '+' }, why: `공비 ${jh(frac(u, w), u < w ? '은/는' : '이/가')} ${u < w ? '−1보다 크고 1보다 작으므로 0에 수렴한다' : '1보다 크므로 양의 무한대로 발산한다'}` }),
        () => ({ h: rn(`${MINUS}${frac(u, w)}`), res: u < w ? { k: 'v', v: 0 } : { k: 'o' }, why: `공비 ${jh(`${MINUS}${frac(u, w)}`, u < w ? '은/는' : '이/가')} ${u < w ? '−1보다 크고 1보다 작으므로 0에 수렴한다' : '−1보다 작으므로 진동한다'}` }),
        () => ({ h: rn(rt(kk)), res: { k: '+' }, why: `공비 ${jh(rt(kk), '이/가')} 1보다 크므로 양의 무한대로 발산한다` }),
        () => ({ h: `${c} × ${MO}`, res: { k: 'o' }, why: '공비가 −1이므로 진동한다' }),
        () => ({ h: rn(`${MINUS}0.${dg}`), res: { k: 'v', v: 0 }, why: `공비 ${jh(`${MINUS}0.${dg}`, '은/는')} −1보다 크고 1보다 작으므로 0에 수렴한다` }),
        () => ({ h: rn(`1.0${dg}`), res: { k: '+' }, why: `공비 ${jh(`1.0${dg}`, '이/가')} 1보다 크므로 양의 무한대로 발산한다` }),
        () => ({ h: pw(c, '2-n'), res: { k: 'v', v: 0 }, why: `${is(pw(c, '2-n'), nb(`${c * c} × (${frac(1, c)})${sup(NV)}`))}이고 공비 ${jh(frac(1, c), '이/가')} 1보다 작은 양수이므로 0에 수렴한다` }),
        () => ({ h: rn(`${MINUS}${c}`), res: { k: 'o' }, why: `공비 ${jh(`${MINUS}${c}`, '이/가')} −1보다 작으므로 진동한다` })
      ];
      const e = d.pick(pool)();
      const others = e.res.k === 'v' ? [1, -1] : [0, 1];
      return judge(d, '다음 등비수열의 수렴, 발산을 조사한 결과로 옳은 것은?', hx(seq(e.h)), e.res, others, `${e.why}.`);
    }),

    // ②5 등비수열이 수렴하는 x의 범위(−1 &lt; 공비 ≤ 1 — r = 1은 들어가고 r = −1은 빠진다)
    T('geo-range', '등비수열이 수렴하는 x의 범위', '②5', (d) => {
      const a = d.pick([2, 3, -2, -3]), c = d.int(1, 5), b = nz(d, -6, 6);
      if ((c - b) % a !== 0 || (c + b) % a !== 0) return null;
      const lo = a > 0 ? (-c - b) / a : (c - b) / a, hi = a > 0 ? (c - b) / a : (-c - b) / a, lc = a < 0, hc = a > 0;
      if (Math.abs(lo) > 9 || Math.abs(hi) > 9) return null;
      const ratio = c === 1 ? ptext([b, a], XV) : frac(ptext([b, a], XV), c);
      const shown = nb(`${iq(lo)} ${lc ? LE : '&lt;'} ${XV} ${hc ? LE : '&lt;'} ${iq(hi)}`);
      const loE = a > 0 ? `(0-${c}-(${jn(b)}))/${a}` : `(${c}-(${jn(b)}))/(${jn(a)})`, hiE = a > 0 ? `(${c}-(${jn(b)}))/${a}` : `(0-${c}-(${jn(b)}))/(${jn(a)})`;
      return inline(`등비수열 ${seq(`(${ratio})${sup(NV)}`)}이 수렴하도록 하는 실수 ${XV}의 값의 범위를 구하시오.`, `{0} {1} ${XV} {2} {3}`,
        [{ answer: lo, signed: true }, { rel: true, answer: lc ? '<=' : '<' }, { rel: true, answer: hc ? '<=' : '<' }, { answer: hi, signed: true }], {
          shown, explain: `공비가 ${ratio}이므로 수렴할 조건은 ${nb(`${MINUS}1 &lt; ${ratio} ${LE} 1`)}이다(공비가 1이면 1에 수렴하고 −1이면 진동한다). ${a < 0 ? `${XV}의 계수가 음수라 부등호의 방향이 바뀌어 ` : ''}${shown}이다.`,
          facts: { calc: [[loE, 0], [hiE, 3]] } });
    })
  ];

  // ══ 사. 등비수열이 든 극한값 ══
  const geocalc = [
    // ②8 지수 꼴 분수식(차례 1: 밑이 가장 큰 항으로 나누기, 차례 2: 2²ⁿ = 4ⁿ 처럼 밑을 맞추기, 차례 3: 수렴·발산 가리기)
    T('gc-ratio', '지수 꼴 분수식의 극한값', '②8', (d, n) => {
      if (n === 0) {
        const [p, q] = d.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [2, 7], [5, 7]]), s = nz(d, -3, 3), e = d.int(0, 1), t = nz(d, -3, 3), r = nz(d, -3, 3);
        const top = d.bool() ? terms([[s, p, e], [t, q, 1]]) : terms([[t, q, 1], [s, p, e]]);
        const v = t * q;
        return numA('다음 극한값은?', v, { figure: hx(LN(frac(top, terms([[1, q, 0], [r, p, 0]])))),
          explain: `분모와 분자를 ${jh(pw(q, 'n'), '으로/로')} 나누면 ${nb(`(${frac(p, q)})${sup(NV)} → 0`)}이므로 분자는 ${iq(t * q)}에, 분모는 1에 한없이 가까워진다. 따라서 극한값은 ${iq(v)}이다.`,
          facts: { value: `(${jn(t)})*${q}` } });
      }
      if (n === 1) {
        const s = d.pick([2, 3]), S = s * s, m = d.until(() => d.int(2, S - 1), (x) => x !== s), c = nz(d, -5, 5);
        const useA = d.bool(), a = useA ? d.int(0, 2) : d.int(1, 2), b = d.int(0, 2), denS = d.bool();
        const top = useA ? `${pw(s, a ? `2n+${a}` : '2n')} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : `${pw(S, `n+${a}`)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
        const bottom = denS && b === 0 ? `${pw(m, 'n')} + ${pw(S, 'n')}` : `${pw(m, 'n')} + ${pw(s, b ? `2n-${b}` : '2n')}`;
        const numC = useA ? s ** a : S ** a, bb = denS && b === 0 ? 0 : b, v = numC * s ** bb;
        return numA('다음 극한값은?', v, { figure: hx(LN(frac(top, bottom))),
          explain: `${is(pw(s, '2n'), pw(S, 'n'))}이므로 분자는 ${nb(`${numC} × ${pw(S, 'n')}`)}, 분모의 ${S}${sup(NV)} 항은 ${bb ? frac(pw(S, 'n'), s ** bb) : pw(S, 'n')}이다. 분모와 분자를 ${jh(pw(S, 'n'), '으로/로')} 나누면 극한값은 ${bb ? `${numC} × ${s ** bb} = ` : ''}${v}이다.`,
          facts: { value: `${useA ? rep(s, a) : rep(S, a)}*${rep(s, bb)}` } });
      }
      // 수렴·발산 가리기: 분자와 분모에서 밑이 가장 큰 항을 견준다
      const bs = d.shuffle([2, 3, 4, 5, 6]).slice(0, 4), [t1, t2] = bs.slice(0, 2), [b1, b2] = bs.slice(2, 4), ct = nz(d, -3, 3), cb = d.int(1, 3);
      const kind = d.int(0, 2), T1 = Math.max(t1, t2), B1 = Math.max(b1, b2);
      let top, bot, res, others, why;
      if (kind === 0) {
        // 분자에 가장 큰 밑
        const big = Math.max(...bs), small = bs.find((x) => x !== big);
        top = terms([[ct, big, 0], [1, small, 0]]); const o = bs.filter((x) => x !== big && x !== small); bot = terms([[cb, o[0], 0], [1, o[1], 0]]);
        res = { k: ct > 0 ? '+' : '-' }; others = [Q(ct, cb), 0]; why = `분자에 밑이 가장 큰 ${jh(pw(big, 'n'), '이/가')} 있어 분모와 분자를 분모의 가장 큰 항으로 나누어도 분자가 한없이 커지므로 ${ct > 0 ? '양의' : '음의'} 무한대로 발산한다`;
      } else if (kind === 1) {
        const big = Math.max(...bs), o = bs.filter((x) => x !== big);
        top = terms([[ct, o[0], 0], [1, o[1], 0]]); bot = terms([[cb, big, 0], [1, o[2], 0]]);
        res = { k: 'v', v: 0 }; others = [Q(ct, cb), 1]; why = `분모에 밑이 가장 큰 ${jh(pw(big, 'n'), '이/가')} 있어 분모와 분자를 그것으로 나누면 분자는 0에 가까워지므로 0에 수렴한다`;
      } else {
        const big = Math.max(...bs), o = bs.filter((x) => x !== big);
        top = terms([[ct, big, 0], [1, o[0], 0]]); bot = terms([[cb, big, 1], [-1, o[1], 0]]);
        const v = Q(ct, cb * big);
        res = { k: 'v', v }; others = [Q(ct, cb), 0]; why = `분모와 분자를 ${jh(pw(big, 'n'), '으로/로')} 나누면 ${frac(iq(ct), `${cb} × ${big}`)} = ${iq(v)}에 수렴한다`;
      }
      return judge(d, JUDGE, hx(seq(frac(top, bot))), res, others, `${why}.`);
    }, { count: 3 }),

    // ②9 등비수열의 일반항을 구해 넣은 극한(차례 1: 첫째항이 자연수, 차례 2: 첫째항이 분수)
    T('gc-term', '등비수열의 일반항을 넣은 극한', '②9', (d, n) => {
      const q = d.int(2, 4);
      if (n === 0) {
        const p = d.int(1, 5), k = d.int(2, 6), c = d.int(1, 9);
        return numA(`첫째항이 ${p}이고 공비가 ${q}인 등비수열 ${seq(AN)}에 대하여 ${LN(frac(`${k}${An1}`, `${c} + ${AN}`))}의 값은?`, k * q, {
          explain: `${is(AN, nb(`${p === 1 ? '' : `${p} × `}${pw(q, 'n-1')}`))}이므로 분모와 분자를 ${jh(pw(q, 'n-1'), '으로/로')} 나누면 ${frac(`${k} × ${p} × ${q}`, p)} = ${k * q}이다.`,
          facts: { value: `${k}*${q}` } });
      }
      const j = d.int(1, 2), a1 = Q(1, q ** j), c = d.int(1, 9);
      return numA(`첫째항이 ${iq(a1)}이고 공비가 ${q}인 등비수열 ${seq(AN)}에 대하여 ${LN(frac(`${pw(q, 'n+1')} + ${c}`, AN))}의 값은?`, q ** (2 + j), {
        explain: `${is(AN, nb(`${iq(a1)} × ${pw(q, 'n-1')}`))} = ${pw(q, `n-${1 + j}`)}이므로 분모와 분자를 ${jh(pw(q, 'n'), '으로/로')} 나누면 ${frac(q, frac(1, q ** (1 + j)))} = ${q ** (2 + j)}이다.`,
        facts: { value: `${q}*${q}/(${jn(a1)})` } });
    }, { count: 2 }),

    // ②11 나머지정리로 얻은 aₙ, bₙ의 비
    T('gc-rem', '나머지정리로 얻은 두 수열의 극한', '②11', (d) => {
      const u = d.int(2, 3), v = d.int(1, 2), t = d.int(1, 3), e = nz(d, -3, 3), Pn = ms('P_n(x)');
      const Lv = Q(v * v + t, u * u + t);
      if (isInt(Lv)) return null;
      const poly2 = `${pw(4, 'n')}${sq2(XV)} ${e < 0 ? MINUS : '+'} ${Math.abs(e) === 1 ? '' : `${Math.abs(e)} × `}${pw(3, 'n')}${XV} + ${t === 1 ? '' : `${t} × `}${pw(2, '2n')}`;
      return numA(`자연수 ${NV}에 대하여 이차다항식 ${is(Pn, poly2)}이 있다. ${jh(Pn, '을/를')} ${XV} ${MINUS} ${u}, ${jh(nb(`${XV} + ${v}`), '으로/로')} 나누었을 때의 나머지를 각각 ${AN}, ${jh(BN, '이라/라')} 할 때, ${LN(frac(BN, AN))}의 값은?`, Lv, {
        explain: `나머지정리에 의하여 ${is(AN, nb(`${ms('P_n')}(${u}) = ${u * u + t} × ${pw(4, 'n')} ${e * u < 0 ? MINUS : '+'} ${Math.abs(e * u)} × ${pw(3, 'n')}`))}, ${is(BN, nb(`${ms('P_n')}(${MINUS}${v}) = ${v * v + t} × ${pw(4, 'n')} ${-e * v < 0 ? MINUS : '+'} ${Math.abs(e * v)} × ${pw(3, 'n')}`))}이다. 분모와 분자를 ${jh(pw(4, 'n'), '으로/로')} 나누면 ${iq(Lv)}이다.`,
        facts: { value: `(${v}*${v}+${t})/(${u}*${u}+${t})` } });
    }),

    // ②12 연립방정식의 해 (aₙ, bₙ)의 비
    T('gc-sys', '두 직선의 교점의 좌표로 만든 수열의 극한', '②12', (d) => {
      const [p, q] = d.pick([[5, 2], [4, 3], [3, 2], [5, 3], [5, 4]]), a = nz(d, -5, 5), b = nz(d, -5, 5), c = nz(d, -5, 5), dd = nz(d, -5, 5);
      if (a * dd - b * c === 0) return null;
      const askY = d.bool(), Lv = askY ? Q(-c, dd) : Q(-dd, c);
      if (isInt(Lv)) return null;
      const line = (x, y, r) => nb(`${lead(x, XV)} ${y < 0 ? MINUS : '+'} ${Math.abs(y) === 1 ? '' : Math.abs(y)}${YV} = ${pw(r, 'n')}`);
      return numA(`자연수 ${NV}에 대하여 두 직선 ${line(a, b, p)}, ${line(c, dd, q)}이 만나는 점의 좌표를 ${nb(`(${AN}, ${BN})`)}이라 할 때, ${LN(askY ? frac(BN, AN) : frac(AN, BN))}의 값은?`, Lv, {
        explain: `연립하여 풀면 ${is(AN, frac(`${iq(dd)} × ${pw(p, 'n')} ${-b < 0 ? MINUS : '+'} ${Math.abs(b)} × ${pw(q, 'n')}`, iq(a * dd - b * c)))}, ${is(BN, frac(`${iq(a)} × ${pw(q, 'n')} ${-c < 0 ? MINUS : '+'} ${Math.abs(c)} × ${pw(p, 'n')}`, iq(a * dd - b * c)))}이다. 분모와 분자를 ${jh(pw(p, 'n'), '으로/로')} 나누면 극한값은 ${iq(Lv)}이다.`,
        facts: { value: askY ? `0-(${jn(c)})/(${jn(dd)})` : `0-(${jn(dd)})/(${jn(c)})` } });
    }),

    // ②13 밑의 크기가 주어진 지수 꼴 극한값 → 미지수
    T('gc-given', '극한값이 주어진 지수 꼴 식의 밑', '②13', (d) => {
      const u = d.int(2, 9), v = d.until(() => d.int(2, 7), (x) => gcd(x, u) === 1), m = d.int(2, 9), k = d.int(1, 4), bq = Q(u, v), Lv = Q(m * v, u);
      return numA(`${nb(`0 &lt; ${Av} &lt; ${Bv}`)}인 두 실수 ${Av}, ${Bv}에 대하여 ${is(LN(frac(`${k === 1 ? '' : k}${Av}${sup(`${NV}+1`)} + ${m}${Bv}${sup(NV)}`, `${Av}${sup(NV)} + ${Bv}${sup(`${NV}+1`)}`)), Lv)}일 때, ${Bv}의 값은?`, bq, {
        explain: `분모와 분자를 ${Bv}${sup(NV)}으로 나누면 ${nb(`(${frac(Av, Bv)})${sup(NV)} → 0`)}이므로 극한값은 ${frac(m, Bv)}이다. ${is(frac(m, Bv), Lv)}에서 ${is(Bv, bq)}이다.`,
        facts: { value: `${m}/(${jn(Lv)})` } });
    }),

    // ②17 r &gt; 0일 때 0 &lt; r &lt; 1, r = 1, r &gt; 1로 나누기
    T('gc-pos', 'r의 값의 범위에 따라 나누어 구하는 극한 — r &gt; 0', '②17', (d) => {
      const s = d.int(1, 4), t = d.int(1, 4), v1 = nz(d, -5, 5), v3 = nz(d, -5, 5), p = v1 * s, q = v3 * t;
      if (v1 === v3 || (p + q) % (s + t) !== 0) return null;
      const v2 = (p + q) / (s + t), rn = `${RV}${sup(NV)}`;
      const body = frac(`${iq(p)} ${q < 0 ? MINUS : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${rn}`, `${s} + ${t === 1 ? '' : t}${rn}`);
      return inline(`${nb(`${RV} &gt; 0`)}일 때, 다음 극한값을 ${RV}의 값의 범위에 따라 구하시오.`,
        `${nb(`0 &lt; ${RV} &lt; 1일 때 {0}`)}, ${nb(`${RV} = 1일 때 {1}`)}, ${nb(`${RV} &gt; 1일 때 {2}`)}`, [v1, v2, v3].map((x) => ({ answer: x, signed: true })), {
          figure: hx(LN(body)), shown: `${iq(v1)}, ${iq(v2)}, ${iq(v3)}`,
          explain: `${nb(`0 &lt; ${RV} &lt; 1`)}이면 ${rn} → 0이므로 ${frac(iq(p), s)} = ${iq(v1)}, ${nb(`${RV} = 1`)}이면 ${frac(`${iq(p)} + ${pn(q)}`, `${s} + ${t}`)} = ${iq(v2)}, ${nb(`${RV} &gt; 1`)}이면 분모와 분자를 ${jh(rn, '으로/로')} 나누어 ${frac(iq(q), t)} = ${iq(v3)}이다.`,
          facts: { calc: [[`(${jn(p)})/${s}`, 0], [`((${jn(p)})+(${jn(q)}))/(${s}+${t})`, 1], [`(${jn(q)})/${t}`, 2]] } });
    }),

    // ②18 r²ⁿ만 든 식 — |r| &lt; 1, |r| = 1, |r| &gt; 1(r = −1에서도 r²ⁿ = 1)
    T('gc-sq', 'r의 값의 범위에 따라 나누어 구하는 극한 — r²ⁿ', '②18', (d) => {
      const s = d.int(1, 4), t = d.int(1, 4), v1 = nz(d, -5, 5), v3 = nz(d, -5, 5), p = v1 * t, q = v3 * s;
      if (v1 === v3 || (p + q) % (s + t) !== 0) return null;
      const v2 = (p + q) / (s + t), r2 = `${RV}${sup(`2${NV}`)}`;
      const body = frac(`${iq(p)} ${q < 0 ? MINUS : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${r2}`, `${s === 1 ? '' : s}${r2} + ${t}`);
      return inline(`다음 극한값을 실수 ${RV}의 값의 범위에 따라 구하시오.`,
        `${nb(`|${RV}| &lt; 1일 때 {0}`)}, ${nb(`|${RV}| = 1일 때 {1}`)}, ${nb(`|${RV}| &gt; 1일 때 {2}`)}`, [v1, v2, v3].map((x) => ({ answer: x, signed: true })), {
          figure: hx(LN(body)), shown: `${iq(v1)}, ${iq(v2)}, ${iq(v3)}`,
          explain: `${nb(`|${RV}| &lt; 1`)}이면 ${r2} → 0이므로 ${frac(iq(p), t)} = ${iq(v1)}, ${nb(`|${RV}| = 1`)}이면 ${is(r2, 1)}(${is(RV, nb(`${MINUS}1`))}이어도 같다)이므로 ${frac(`${iq(p)} + ${pn(q)}`, `${s} + ${t}`)} = ${iq(v2)}, ${nb(`|${RV}| &gt; 1`)}이면 분모와 분자를 ${jh(r2, '으로/로')} 나누어 ${frac(iq(q), s)} = ${iq(v3)}이다.`,
          facts: { calc: [[`(${jn(p)})/${t}`, 0], [`((${jn(p)})+(${jn(q)}))/(${s}+${t})`, 1], [`(${jn(q)})/${s}`, 2]] } });
    }),

    // ②20 수열의 극한으로 정의된 함수(차례 1: 함숫값 셋, 차례 2: 그래프 고르기)
    T('gc-func', '수열의 극한으로 정의된 함수', '②20', (d, n) => {
      const F = (a) => `${V('f')}(${a})`;
      if (n === 0) {
        const e = d.int(1, 2), c = d.int(1, 4), g = d.int(1, 4), a = nz(d, -4, 4), v1 = nz(d, -4, 4), b = v1 * g, h = d.int(2, 3), w = d.int(2, 4);
        if ((a + b) % (c + g) !== 0 || (a * w ** e) % c !== 0) return null;
        const v2 = (a + b) / (c + g), v3 = a * w ** e / c;
        if (Math.abs(v3) > 40) return null;
        const body = frac(`${lead(a, XV)}${sup(`${NV}+${e}`)} ${b < 0 ? MINUS : '+'} ${Math.abs(b)}`, `${c === 1 ? '' : c}${XV}${sup(NV)} + ${g}`);
        return inline(`${NV}이 자연수일 때, 함수 ${nb(`${F(XV)} = ${LN(body)}`)} ${nb(`(${XV} ${'≥'} 0)`)}에 대하여 ${F(frac(1, h))}, ${F(1)}, ${F(w)}의 값을 차례로 구하시오.`,
          `${nb(`${F(frac(1, h))} = {0}`)}, ${nb(`${F(1)} = {1}`)}, ${nb(`${F(w)} = {2}`)}`, [v1, v2, v3].map((x) => ({ answer: x, signed: true })), {
            shown: `${nb(`${F(frac(1, h))} = ${iq(v1)}`)}, ${nb(`${F(1)} = ${iq(v2)}`)}, ${nb(`${F(w)} = ${iq(v3)}`)}`,
            explain: `${nb(`0 ${LE} ${XV} &lt; 1`)}이면 ${XV}${sup(NV)} → 0이므로 ${is(F(XV), frac(iq(b), g))} = ${iq(v1)}, ${is(XV, 1)}이면 ${frac(`${iq(a)} + ${pn(b)}`, `${c} + ${g}`)} = ${iq(v2)}, ${nb(`${XV} &gt; 1`)}이면 분모와 분자를 ${XV}${sup(NV)}으로 나누어 ${is(F(XV), frac(lead(a, XV) + (e === 2 ? sup(2) : ''), c))}이다. 따라서 ${is(F(w), v3)}이다.`,
            facts: { calc: [[`(${jn(b)})/${g}`, 0], [`((${jn(a)})+(${jn(b)}))/(${c}+${g})`, 1], [`(${jn(a)})*${rep(w, e)}/${c}`, 2]] } });
      }
      // 그래프 고르기: f(x) = lim (a x²ⁿ + b)/(x²ⁿ + c), |x| &lt; 1 → b/c = k, |x| = 1 → (a + b)/(1 + c), |x| &gt; 1 → a
      const c = d.int(1, 3), k = d.int(1, 3), a = d.until(() => d.int(1, 3), (x) => x !== k), b = k * c, mid = (a + b) / (1 + c);
      const g = (inner, outer, dotY) => plot({ x: [-2.6, 2.6], y: [-0.7, 3.8], w: 132, xt: [-1, 1], yt: [1, 2, 3].map((v) => (v === inner ? { v, t: '' } : v)), grid: 'ticks',
        curves: [{ f: () => outer, from: -2.6, to: -1, color: '#1d4ed8' }, { f: () => inner, from: -1, to: 1, color: '#1d4ed8' }, { f: () => outer, from: 1, to: 2.6, color: '#1d4ed8' }],
        dots: [{ x: -1, y: inner, open: true }, { x: 1, y: inner, open: true }, { x: -1, y: outer, open: true }, { x: 1, y: outer, open: true }, { x: -1, y: dotY }, { x: 1, y: dotY }],
        say: `그래프: x < −1과 x > 1에서 y = ${outer}, −1 < x < 1에서 y = ${inner}, x = −1과 x = 1에서의 함숫값은 ${Number(dotY.toFixed(2))}.` });
      const kinds = d.shuffle(['ok', 'swap', 'atIn', 'atOut']);
      const figs = kinds.map((kd) => (kd === 'ok' ? g(k, a, mid) : kd === 'swap' ? g(a, k, mid) : kd === 'atIn' ? g(k, a, k) : g(k, a, a)));
      const names = LAB.slice(0, 4);
      const grid = '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;justify-content:center">' + figs.map((f, i) => `<div style="text-align:center"><div style="font-weight:700">${names[i]}</div>${f.replace('aria-label="', `aria-label="${names[i]}: `)}</div>`).join('') + '</div>';
      const body = frac(`${a === 1 ? '' : a}${XV}${sup(`2${NV}`)} + ${b}`, `${XV}${sup(`2${NV}`)} + ${c}`);
      return pickOne(d, `${NV}이 자연수일 때, 함수 ${nb(`${F(XV)} = ${LN(body)}`)}의 그래프로 알맞은 것은?`, names.map((nm, i) => ({ h: nm, ok: kinds[i] === 'ok' })), {
        keep: true, figure: grid,
        explain: `${nb(`|${XV}| &lt; 1`)}이면 ${XV}${sup(`2${NV}`)} → 0이므로 ${is(F(XV), frac(b, c))} = ${k}, ${nb(`|${XV}| &gt; 1`)}이면 분모와 분자를 ${XV}${sup(`2${NV}`)}으로 나누어 ${is(F(XV), a)}, ${nb(`|${XV}| = 1`)}이면 ${is(F(XV), frac(`${a} + ${b}`, `1 + ${c}`))}${Number.isInteger(mid) ? ` = ${mid}` : ''}이다.` });
    }, { count: 2 }),

    // ②21 원의 접선이 만드는 삼각형 넓이의 비
    T('gc-tangent', '원의 접선이 만드는 삼각형의 넓이의 극한', '②21', (d) => {
      const k = d.int(2, 3), c = d.int(1, 2), RR = Math.sqrt(k * k + c * c), Qx = (k * k + c * c) / k;
      const tangent = (x) => (k * k + c * c - k * x) / c;
      const figure = plot({ x: [-RR - 0.4, Qx + 0.6], y: [-RR - 0.4, RR + 0.4], w: 230, xt: [], yt: [],
        params: [{ x: (t) => RR * Math.cos(t), y: (t) => RR * Math.sin(t), color: '#1f2933', said: '원점이 중심인 원' }],
        lines: [{ a: -k / c, b: (k * k + c * c) / c, color: '#b42318', said: '점 Pₙ에서 원에 그은 접선' }],
        fill: [{ f: (x) => (x <= k ? (c / k) * x : tangent(x)), from: 0, to: Qx }],
        segs: [{ p: [0, 0], q: [k, c] }],
        dots: [{ x: k, y: c, name: 'P_n', side: 'ur', said: '원 위의 점' }, { x: Qx, y: 0, name: 'Q_n', side: 'ur', said: '접선과 x축이 만나는 점' }] });
      const P = nb(`${ms('P_n')}(${pw(k, 'n')}, ${c})`);
      return numA(`그림과 같이 자연수 ${NV}에 대하여 원 ${nb(`${sq2(XV)} + ${sq2(YV)} = ${pw(k * k, 'n')} + ${c * c}`)} 위의 점 ${P}에서의 접선이 ${XV}축과 만나는 점을 ${ms('Q_n')}이라 하자. 삼각형 ${ms('OP_nQ_n')}의 넓이를 ${jh(AN, '이라/라')} 할 때, ${LN(frac(An1, AN))}의 값은? (단, O는 원점이다.)`, k, {
        figure, explain: `원 위의 점 ${P}에서의 접선은 ${nb(`${pw(k, 'n')}${XV} + ${c === 1 ? '' : c}${YV} = ${pw(k * k, 'n')} + ${c * c}`)}이므로 ${ms('Q_n')}의 ${XV}좌표는 ${frac(`${pw(k * k, 'n')} + ${c * c}`, pw(k, 'n'))}이다. ${is(AN, frac(`${c === 1 ? '' : c}(${pw(k * k, 'n')} + ${c * c})`, `2 × ${pw(k, 'n')}`))}이므로 ${frac(An1, AN)}의 분모와 분자를 ${jh(pw(k * k, 'n'), '으로/로')} 나누면 극한값은 ${k * k} ÷ ${k} = ${k}이다.`,
        facts: { value: `${k * k}/${k}` } });
    })
  ];

  B.addTypes('11-5-1', 'calc', calc);
  B.addTypes('11-5-1', 'squeeze', squeeze);
  B.addTypes('11-5-1', 'shape', shape);
  B.addTypes('11-5-1', 'geo', geo);
  B.addTypes('11-5-1', 'geocalc', geocalc);
  B.kit.u1151b = { term, terms, rep, R };
})(typeof window !== 'undefined' ? window : globalThis);
