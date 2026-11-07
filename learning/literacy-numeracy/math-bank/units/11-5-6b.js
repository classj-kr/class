// 고등학교 미적분Ⅱ Ⅲ-1 여러 가지 적분법 — 뒤쪽 묶음(치환적분법, f′/f 꼴과 유리함수, 치환적분법·부분적분법을 이용한 정적분, 부분적분법, 여러 적분법으로 함수 구하기).
// 단원 틀·도구·싣는 기준·뺀 것과 까닭은 11-5-6a.js 머리에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, M } = B.kit;
  const { MINUS, Q, V, sup, rt, claimQ } = B.kit.mid;
  const { ms, jh, pw, ln, sum, evl } = B.kit.hs;
  const {
    S2, S3, T, q, qadd, qsub, qmul, qn, J, iq, nzi, LN, EE, PI, SQ, sec, simpson, close,
    X, Tt, Cc, EV, plusC, CN, ind, dfi, fx, fp, FX, FCX, is, sn, cs, tn, sc, ct, lnAbs, ePow, pi, sumH, pf, sg, num, pos, chooseV, chooseF
  } = B.kit.u56x;
  const lin = (a, b, v) => sumH([[a, v || X], [b, '']]);                              // ax + b
  const par = (h) => '(' + h + ')';
  const powH = (h, k) => par(h) + sup(k);
  const indT = (body) => B.kit.hs.intg(null, null, body, 't');                       // ∫ … dt
  const K1 = (k) => (k === 1 ? '' : k === -1 ? MINUS : iq(k));                       // 문자 앞 계수(1은 적지 않는다)

  // ════════════════════════════════════════════════════════════════
  // 치환적분법(부정적분)
  // ════════════════════════════════════════════════════════════════
  const subst = [
    T('sub-poly', '속 함수의 도함수가 곁에 있는 다항식의 치환적분', '①21', (d, n) => {
      if (n === 0) {
        // f(x) = ∫2x(x² − p)ᵏdx = (x² − p)ᵏ⁺¹/(k + 1) + C → f(2) − f(1)
        const p = d.pick([2, 3, 5]), k = d.int(3, 5), g = (x) => x * x - p, v = Q((g(2)) ** (k + 1) - (g(1)) ** (k + 1), k + 1);
        if (!close(qn(v), simpson((x) => 2 * x * g(x) ** k, 1, 2))) throw new Error('sub-poly 셈');
        return num(`함수 ${is(FX, ind(`2${X}${powH(`${X}${sup(2)} ${MINUS} ${p}`, k)}`))}에 대하여 ${fx('f', 2)} ${MINUS} ${jh(fx('f', 1), '의/의')} 값은?`, v, {
          explain: `${X}${sup(2)} ${MINUS} ${p} = ${jh(Tt, '으로/로')} 놓으면 2${X} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${is(FX, plusC(frac(powH(`${X}${sup(2)} ${MINUS} ${p}`, k + 1), k + 1)))}이다. 적분상수는 빼면 없어지고 ${frac(`${pf(g(2))}${sup(k + 1)} ${MINUS} ${pf(g(1))}${sup(k + 1)}`, k + 1)} = ${iq(v)}이다.`,
          facts: { value: `((2**2-${p})**${k + 1}-(1-${p})**${k + 1})/${k + 1}` } });
      }
      if (n === 1) {
        // f(x) = ∫(x² − m)(x³ − 3mx)ᵏdx = (x³ − 3mx)ᵏ⁺¹/(3(k + 1)) + C → f(2) − f(1)
        const m = d.pick([1, 2]), k = d.int(2, 4), g = (x) => x ** 3 - 3 * m * x, v = Q(g(2) ** (k + 1) - g(1) ** (k + 1), 3 * (k + 1));
        if (!close(qn(v), simpson((x) => (x * x - m) * g(x) ** k, 1, 2))) throw new Error('sub-poly 셈 2');
        return num(`함수 ${is(FX, ind(`${par(`${X}${sup(2)} ${MINUS} ${m}`)}${powH(`${X}${sup(3)} ${MINUS} ${3 * m}${X}`, k)}`))}에 대하여 ${fx('f', 2)} ${MINUS} ${jh(fx('f', 1), '의/의')} 값은?`, v, {
          explain: `${X}${sup(3)} ${MINUS} ${3 * m}${X} = ${jh(Tt, '으로/로')} 놓으면 3(${X}${sup(2)} ${MINUS} ${m}) = ${frac(V('d') + Tt, V('d') + X)}이므로 ${is(FX, plusC(frac(powH(`${X}${sup(3)} ${MINUS} ${3 * m}${X}`, k + 1), 3 * (k + 1))))}이다. ${frac(`${pf(g(2))}${sup(k + 1)} ${MINUS} ${pf(g(1))}${sup(k + 1)}`, 3 * (k + 1))} = ${iq(v)}이다.`,
          facts: { value: `((2**3-3*${m}*2)**${k + 1}-(1-3*${m})**${k + 1})/(3*${k + 1})` } });
      }
      const p = nzi(d, -4, 5), k = d.int(3, 6), inner = `${X}${sup(3)} ${sg(p)} ${Math.abs(p)}`, h = (x) => x ** 3 + p;
      return chooseF(d, `${jh(ind(`3${X}${sup(2)}${powH(inner, k)}`), '은/는')}? ${CN}`, (x) => 3 * x * x * h(x) ** k, [plusC(frac(powH(inner, k + 1), k + 1)), (x) => h(x) ** (k + 1) / (k + 1)], [
        [plusC(frac(powH(inner, k + 1), 3 * (k + 1))), (x) => h(x) ** (k + 1) / (3 * (k + 1))],
        [plusC(frac(`3${X}${sup(2)}${powH(inner, k + 1)}`, k + 1)), (x) => 3 * x * x * h(x) ** (k + 1) / (k + 1)],
        [plusC(powH(inner, k + 1)), (x) => h(x) ** (k + 1)],
        [plusC(frac(powH(inner, k + 1), k)), (x) => h(x) ** (k + 1) / k]
      ], [[0, 1], [-1, 0.5]], { explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 3${X}${sup(2)} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${is(indT(Tt + sup(k)), plusC(frac(Tt + sup(k + 1), k + 1)))}에서 ${plusC(frac(powH(inner, k + 1), k + 1))}이다.` });
    }, { count: 3, standard: S2 }),
    T('sub-linpoly', '일차식 꼴 (ax + b)ⁿ의 부정적분', '①22', (d, n) => {
      const a = d.int(2, 5), b = nzi(d, -7, 7), k = d.int(4, 7), neg = n === 1;
      const inner = neg ? `${Math.abs(b)} ${MINUS} ${a}${X}` : lin(a, b), s = neg ? -a : a, c0 = neg ? Math.abs(b) : b, h = (x) => s * x + c0;
      const term = (cf) => plusC(sumH([[cf, powH(inner, k + 1)]]));
      return chooseF(d, `부정적분 ${jh(ind(powH(inner, k)), '을/를')} 구한 것은? ${CN}`, (x) => h(x) ** k, [term(Q(1, s * (k + 1))), (x) => h(x) ** (k + 1) / (s * (k + 1))], [
        [term(Q(1, k + 1)), (x) => h(x) ** (k + 1) / (k + 1)],
        [term(Q(s, k + 1)), (x) => s * h(x) ** (k + 1) / (k + 1)],
        [term(Q(-1, s * (k + 1))), (x) => -(h(x) ** (k + 1)) / (s * (k + 1))],
        [term(Q(1, s * k)), (x) => h(x) ** (k + 1) / (s * k)]
      ], [[0, 0.5], [0.5, 1]], { explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 ${iq(s)} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${iq(Q(1, s))}${indT(Tt + sup(k))}에서 ${term(Q(1, s * (k + 1)))}이다.` });
    }, { count: 2, standard: S2 }),
    T('sub-lintrans', '일차식 꼴 e^(ax+b)·sin(ax+b)·cos(ax+b)의 부정적분', '①23', (d, n) => {
      const a = d.int(2, 5), b = nzi(d, -5, 5);
      if (n === 0) {
        const kind = d.int(0, 1), inner = lin(a, b), h = (x) => a * x + b;
        if (kind === 0) {
          const E = ePow(inner);
          return chooseF(d, `${jh(ind(E), '은/는')}? ${CN}`, (x) => EE ** h(x), [plusC(frac(1, a) + E), (x) => EE ** h(x) / a], [
            [plusC(E), (x) => EE ** h(x)], [plusC(a + E), (x) => a * EE ** h(x)], [plusC(frac(E, lin(a, b + 1))), (x) => EE ** h(x) / (a * x + b + 1)], [plusC(MINUS + frac(1, a) + E), (x) => -(EE ** h(x)) / a]
          ], [[0, 0.5], [-0.5, 0.5]], { explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 ${a} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${frac(1, a)}${indT(ePow('t'))}에서 ${plusC(frac(1, a) + E)}이다.` });
        }
        return chooseF(d, `${jh(ind(sn(`(${inner})`)), '은/는')}? ${CN}`, (x) => Math.sin(h(x)), [plusC(MINUS + frac(1, a) + cs(`(${inner})`)), (x) => -Math.cos(h(x)) / a], [
          [plusC(frac(1, a) + cs(`(${inner})`)), (x) => Math.cos(h(x)) / a], [plusC(MINUS + a + cs(`(${inner})`)), (x) => -a * Math.cos(h(x))], [plusC(MINUS + cs(`(${inner})`)), (x) => -Math.cos(h(x))], [plusC(frac(1, a) + sn(`(${inner})`)), (x) => Math.sin(h(x)) / a]
        ], [[0, 0.5], [0.5, 1]], { explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 ${frac(1, a)}${indT(sn('t'))} = ${frac(1, a)}(${MINUS}${cs('t')}) + ${Cc}이다.` });
      }
      // 계수가 음수인 일차식: cos(c − ax), e^(c − ax)
      const c = Math.abs(b), inner = `${c} ${MINUS} ${a}${X}`, h = (x) => c - a * x, kind = d.int(0, 1);
      if (kind === 0) {
        return chooseF(d, `${jh(ind(cs(`(${inner})`)), '은/는')}? ${CN}`, (x) => Math.cos(h(x)), [plusC(MINUS + frac(1, a) + sn(`(${inner})`)), (x) => -Math.sin(h(x)) / a], [
          [plusC(frac(1, a) + sn(`(${inner})`)), (x) => Math.sin(h(x)) / a], [plusC(MINUS + a + sn(`(${inner})`)), (x) => -a * Math.sin(h(x))], [plusC(sn(`(${inner})`)), (x) => Math.sin(h(x))], [plusC(frac(1, a) + cs(`(${inner})`)), (x) => Math.cos(h(x)) / a]
        ], [[0, 0.5], [0.5, 1]], { explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 ${MINUS}${a} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${MINUS}${frac(1, a)}${indT(cs('t'))}에서 ${plusC(MINUS + frac(1, a) + sn(`(${inner})`))}이다.` });
      }
      const E = ePow(inner);
      return chooseF(d, `${jh(ind(E), '은/는')}? ${CN}`, (x) => EE ** h(x), [plusC(MINUS + frac(1, a) + E), (x) => -(EE ** h(x)) / a], [
        [plusC(frac(1, a) + E), (x) => EE ** h(x) / a], [plusC(MINUS + a + E), (x) => -a * EE ** h(x)], [plusC(E), (x) => EE ** h(x)], [plusC(MINUS + E), (x) => -(EE ** h(x))]
      ], [[0, 0.5], [0.5, 1]], { explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 ${MINUS}${a} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${MINUS}${frac(1, a)}${indT(ePow('t'))}에서 ${plusC(MINUS + frac(1, a) + E)}이다.` });
    }, { count: 2, standard: S2 }),
    T('sub-outer', '바깥 함수가 지수·근호인 f(g(x))g′(x) 꼴', '①25', (d, n) => {
      if (n === 0) {
        const m = d.int(1, 3), k = d.pick([1, 2, 3, 4, 6]), E = ePow(m === 1 ? 'x^2' : m + 'x^2'), c = Q(k, 2 * m), h = (x) => EE ** (m * x * x);
        return chooseF(d, `${jh(ind(K1(k) + X + E), '은/는')}? ${CN}`, (x) => k * x * h(x), [plusC(sumH([[c, E]])), (x) => qn(c) * h(x)], [
          [plusC(sumH([[k, E]])), (x) => k * h(x)], [plusC(sumH([[Q(k, m), E]])), (x) => k / m * h(x)], [plusC(sumH([[c, X + sup(2) + E]])), (x) => qn(c) * x * x * h(x)], [plusC(sumH([[c, X + E]])), (x) => qn(c) * x * h(x)]
        ], [[0, 0.7], [-0.5, 0.8]], { explain: `${m === 1 ? '' : m}${X}${sup(2)} = ${jh(Tt, '으로/로')} 놓으면 ${2 * m}${X} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${sumH([[c, indT(ePow('t'))]])}에서 ${plusC(sumH([[c, E]]))}이다.` });
      }
      const c = d.pick([1, 2, 3, 4, 5]), k = d.pick([1, 3]), inner = `${X}${sup(2)} + ${c}`, R = par(inner) + rt(inner), h = (x) => (x * x + c) ** 1.5;
      return chooseF(d, `${jh(ind(K1(k) + X + rt(inner)), '은/는')}? ${CN}`, (x) => k * x * SQ(x * x + c), [plusC(sumH([[Q(k, 3), R]])), (x) => k / 3 * h(x)], [
        [plusC(sumH([[Q(2 * k, 3), R]])), (x) => 2 * k / 3 * h(x)], [plusC(sumH([[Q(k, 2), R]])), (x) => k / 2 * h(x)], [plusC(sumH([[Q(k, 3), X + sup(2) + R]])), (x) => k / 3 * x * x * h(x)], [plusC(sumH([[k, R]])), (x) => k * h(x)]
      ], [[0, 1], [1, 2]], { explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 2${X} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${frac(k, 2)}${indT(pw('t', [1, 2]))} = ${frac(k, 3)}${pw('t', [3, 2])} + ${Cc}이다.` });
    }, { count: 2, standard: S2 }),
    T('sub-inner', '속 함수가 sin x·cos x·tan x·ln x인 치환적분', '①26', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 5), useSin = d.bool();
        if (useSin) {
          return chooseF(d, `${jh(ind(sn(null, k) + cs()), '은/는')}? ${CN}`, (x) => Math.sin(x) ** k * Math.cos(x), [plusC(frac(1, k + 1) + sn(null, k + 1)), (x) => Math.sin(x) ** (k + 1) / (k + 1)], [
            [plusC(MINUS + frac(1, k + 1) + sn(null, k + 1)), (x) => -(Math.sin(x) ** (k + 1)) / (k + 1)], [plusC(frac(1, k + 1) + cs(null, k + 1)), (x) => Math.cos(x) ** (k + 1) / (k + 1)],
            [plusC(k + sn(null, k - 1) + cs(null, 2)), (x) => k * Math.sin(x) ** (k - 1) * Math.cos(x) ** 2], [plusC(frac(1, k) + sn(null, k + 1)), (x) => Math.sin(x) ** (k + 1) / k]
          ], [[0, 1], [0.5, 2]], { explain: `${sn()} = ${jh(Tt, '으로/로')} 놓으면 ${cs()} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${is(indT(Tt + sup(k)), plusC(frac(1, k + 1) + Tt + sup(k + 1)))}에서 ${plusC(frac(1, k + 1) + sn(null, k + 1))}이다.` });
        }
        // ∫sin x(1 + cos²x)dx = −cos x − cos³x/3 + C
        const a = d.int(1, 4), body = `${sn()}(${a} + ${cs(null, 2)})`;
        return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => Math.sin(x) * (a + Math.cos(x) ** 2), [plusC(`${MINUS}${K1(a)}${cs()} ${MINUS} ${frac(1, 3)}${cs(null, 3)}`), (x) => -a * Math.cos(x) - Math.cos(x) ** 3 / 3], [
          [plusC(`${K1(a)}${cs()} + ${frac(1, 3)}${cs(null, 3)}`), (x) => a * Math.cos(x) + Math.cos(x) ** 3 / 3], [plusC(`${MINUS}${K1(a)}${cs()} + ${frac(1, 3)}${cs(null, 3)}`), (x) => -a * Math.cos(x) + Math.cos(x) ** 3 / 3],
          [plusC(`${MINUS}${K1(a)}${cs()} ${MINUS} ${frac(1, 3)}${sn(null, 3)}`), (x) => -a * Math.cos(x) - Math.sin(x) ** 3 / 3], [plusC(`${K1(a)}${sn()} ${MINUS} ${frac(1, 3)}${cs(null, 3)}`), (x) => a * Math.sin(x) - Math.cos(x) ** 3 / 3]
        ], [[0, 1], [0.5, 2]], { explain: `${cs()} = ${jh(Tt, '으로/로')} 놓으면 ${MINUS}${sn()} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${MINUS}${indT(`(${a} + ${Tt}${sup(2)})`)} = ${MINUS}${a === 1 ? '' : a}${Tt} ${MINUS} ${frac(1, 3)}${Tt}${sup(3)} + ${Cc}이다.` });
      }
      if (n === 1) {
        const k = d.int(1, 4), a = d.int(0, 3), arg = a === 0 ? X : `(${X} + ${a})`, L = a === 0 ? ln('x') : ln(arg), lg = (x) => LN(x + a);
        const body = frac((k === 1 ? L : `${par(L)}${sup(k)}`), a === 0 ? X : `${X} + ${a}`), Lp = (j) => (j === 1 ? L : `${par(L)}${sup(j)}`);
        return chooseF(d, `${jh(ind(body), '은/는')}? (단, ${ms('x > 0')}이고 ${jh(Cc, '은/는')} 적분상수이다.)`, (x) => lg(x) ** k / (x + a), [plusC(frac(1, k + 1) + Lp(k + 1)), (x) => lg(x) ** (k + 1) / (k + 1)], [
          [plusC(Lp(k + 1)), (x) => lg(x) ** (k + 1)], [plusC((k === 1 ? '' : frac(1, k)) + Lp(k + 1)), (x) => lg(x) ** (k + 1) / k], [plusC(frac(1, k + 1) + Lp(k + 1) + ' ' + MINUS + ' ' + Lp(1)), (x) => lg(x) ** (k + 1) / (k + 1) - lg(x)],
          [plusC(frac(Lp(k + 1), (a === 0 ? '' : '') + (k + 1) + (a === 0 ? X : `(${X} + ${a})`))), (x) => lg(x) ** (k + 1) / ((k + 1) * (x + a))]
        ], [[1, 2], [1.5, 3]], { explain: `${L} = ${jh(Tt, '으로/로')} 놓으면 ${frac(1, a === 0 ? X : `${X} + ${a}`)} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${is(indT(Tt + (k === 1 ? '' : sup(k))), plusC(frac(1, k + 1) + Tt + sup(k + 1)))}이다.` });
      }
      if (n === 2) {
        // f(x) = ∫(a + sin x)³cos x dx → f(π/2) − f(π/6) = {(a + 1)⁴ − (a + 1/2)⁴}/4
        const a = d.int(1, 3), v = qmul(Q(1, 4), qsub(Q((a + 1) ** 4), qmul(Q(2 * a + 1, 2), qmul(Q(2 * a + 1, 2), qmul(Q(2 * a + 1, 2), Q(2 * a + 1, 2))))));
        if (!close(qn(v), simpson((x) => (a + Math.sin(x)) ** 3 * Math.cos(x), PI / 6, PI / 2))) throw new Error('sub-inner 셈');
        return pos(`함수 ${is(FX, ind(`${powH(`${a} + ${sn()}`, 3)}${cs()}`))}에 대하여 ${fx('f', frac('π', 2))} ${MINUS} ${jh(fx('f', frac('π', 6)), '의/의')} 값은?`, v, {
          explain: `${a} + ${sn()} = ${jh(Tt, '으로/로')} 놓으면 ${is(FX, plusC(`${frac(1, 4)}${powH(`${a} + ${sn()}`, 4)}`))}이다. ${frac(1, 4)}{${a + 1}${sup(4)} ${MINUS} (${a} + ${frac(1, 2)})${sup(4)}} = ${iq(v)}이다.`,
          facts: { value: `((${a}+1)**4-(${a}+1/2)**4)/4` } });
      }
      // f′(x) = tan x sec²x, 한 구간 (−π/2, π/2) 안의 한 점의 함숫값 → 다른 점의 함숫값
      const c = nzi(d, -5, 5), [p0, p1] = d.pick([[[1, 4], [1, 3]], [[0, 1], [1, 4]], [[0, 1], [1, 3]], [[1, 3], [1, 4]]]);
      const t2 = (pq) => (pq[0] === 0 ? 0 : pq[1] === 4 ? 1 : 3), v = qadd(c, Q(t2(p1) - t2(p0), 2)), at = (pq) => (pq[0] === 0 ? '0' : frac('π', pq[1]));
      if (!close(qn(v), c + simpson((x) => Math.tan(x) * sec(x) ** 2, pq2(p0), pq2(p1)))) throw new Error('sub-inner 셈 4');
      return num(`열린구간 (${MINUS}${frac('π', 2)}, ${frac('π', 2)})에서 정의된 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), tn() + sc(null, 2))}이고 ${is(fx('f', at(p0)), c)}일 때, ${jh(fx('f', at(p1)), '의/의')} 값은?`, v, {
        explain: `${tn()} = ${jh(Tt, '으로/로')} 놓으면 ${sc(null, 2)} = ${frac(V('d') + Tt, V('d') + X)}이므로 ${is(FX, plusC(frac(1, 2) + tn(null, 2)))}이다. ${is(fx('f', at(p0)), c)}에서 ${is(Cc, qsub(c, Q(t2(p0), 2)))}이므로 ${is(fx('f', at(p1)), v)}이다.`,
        facts: { value: `${J(c)}+(${t2(p1)}-${t2(p0)})/2` } });
    }, { count: 4, standard: S2 }),
    T('sub-cube', '삼각함수 사이의 관계로 고친 뒤 치환 — cos³x, sin³x', '①27', (d) => {
      const useCos = d.bool(), k = d.int(1, 3), K = K1(k);
      if (useCos) {
        return chooseF(d, `${jh(ind(K + cs(null, 3)), '은/는')}? ${CN}`, (x) => k * Math.cos(x) ** 3, [plusC(sumH([[k, sn()], [Q(-k, 3), sn(null, 3)]])), (x) => k * (Math.sin(x) - Math.sin(x) ** 3 / 3)], [
          [plusC(sumH([[Q(k, 4), cs(null, 4)]])), (x) => k * Math.cos(x) ** 4 / 4], [plusC(sumH([[k, sn()], [Q(k, 3), sn(null, 3)]])), (x) => k * (Math.sin(x) + Math.sin(x) ** 3 / 3)],
          [plusC(sumH([[Q(k, 3), sn(null, 3)]])), (x) => k * Math.sin(x) ** 3 / 3], [plusC(sumH([[k, cs()], [Q(-k, 3), cs(null, 3)]])), (x) => k * (Math.cos(x) - Math.cos(x) ** 3 / 3)]
        ], [[0, 1], [0.5, 2]], { explain: `${is(cs(null, 3), `(1 ${MINUS} ${sn(null, 2)})${cs()}`)}이므로 ${sn()} = ${jh(Tt, '으로/로')} 놓으면 ${K}${indT(`(1 ${MINUS} ${Tt}${sup(2)})`)}이고 ${plusC(sumH([[k, sn()], [Q(-k, 3), sn(null, 3)]]))}이다.` });
      }
      return chooseF(d, `${jh(ind(K + sn(null, 3)), '은/는')}? ${CN}`, (x) => k * Math.sin(x) ** 3, [plusC(sumH([[-k, cs()], [Q(k, 3), cs(null, 3)]])), (x) => k * (-Math.cos(x) + Math.cos(x) ** 3 / 3)], [
        [plusC(sumH([[Q(-k, 4), cs(null, 4)]])), (x) => -k * Math.cos(x) ** 4 / 4], [plusC(sumH([[k, cs()], [Q(-k, 3), cs(null, 3)]])), (x) => k * (Math.cos(x) - Math.cos(x) ** 3 / 3)],
        [plusC(sumH([[Q(k, 4), sn(null, 4)]])), (x) => k * Math.sin(x) ** 4 / 4], [plusC(sumH([[-k, cs()], [Q(-k, 3), cs(null, 3)]])), (x) => -k * (Math.cos(x) + Math.cos(x) ** 3 / 3)]
      ], [[0, 1], [0.5, 2]], { explain: `${is(sn(null, 3), `(1 ${MINUS} ${cs(null, 2)})${sn()}`)}이므로 ${cs()} = ${jh(Tt, '으로/로')} 놓으면 ${MINUS}${K}${indT(`(1 ${MINUS} ${Tt}${sup(2)})`)}이고 ${plusC(sumH([[-k, cs()], [Q(k, 3), cs(null, 3)]]))}이다.` });
    }, { standard: S2 }),
    T('sub-xroot', 'x√(x − a)·x/√(x + a) — 안쪽을 t로 놓고 x도 t로 바꾸기', '①28', (d, n) => {
      if (n === 0) {
        const a = nzi(d, -3, 3), inner = lin(1, -a), R = (h, j) => (j === 1 ? par(h) + rt(h) : par(h) + sup(j) + rt(h)), u = (x) => x - a;
        const F = (x) => 0.4 * u(x) ** 2.5 + 2 * a / 3 * u(x) ** 1.5;
        return chooseF(d, `${jh(ind(X + rt(inner)), '은/는')}? ${CN}`, (x) => x * SQ(u(x)), [plusC(sumH([[Q(2, 5), R(inner, 2)], [Q(2 * a, 3), R(inner, 1)]])), F], [
          [plusC(sumH([[Q(2, 5), R(inner, 2)], [Q(-2 * a, 3), R(inner, 1)]])), (x) => 0.4 * u(x) ** 2.5 - 2 * a / 3 * u(x) ** 1.5],
          [plusC(sumH([[Q(2, 3), X + R(inner, 1)]])), (x) => 2 / 3 * x * u(x) ** 1.5],
          [plusC(sumH([[Q(2, 5), R(inner, 2)], [2 * a, R(inner, 1)]])), (x) => 0.4 * u(x) ** 2.5 + 2 * a * u(x) ** 1.5],
          [plusC(sumH([[Q(1, 2), X + sup(2)], [Q(2, 3), R(inner, 1)]])), (x) => x * x / 2 + 2 / 3 * u(x) ** 1.5]
        ], [[a + 1, a + 2], [a + 1, a + 4]], { explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 ${is(X, lin(1, a, Tt))}이고 1 = ${frac(V('d') + Tt, V('d') + X)}이므로 ${indT(`(${lin(1, a, Tt)})${rt(Tt)}`)} = ${frac(2, 5)}${pw('t', [5, 2])} ${sg(a)} ${frac(Math.abs(2 * a), 3)}${pw('t', [3, 2])} + ${Cc}이다.` });
      }
      if (n === 1) {
        // ∫(a ~ a + m²) x√(x − a)dx = ∫(0 ~ m²)(t + a)√t dt = 2m⁵/5 + 2am³/3
        const a = d.int(1, 3), m = d.int(1, 2), top = a + m * m, v = qadd(Q(2 * m ** 5, 5), Q(2 * a * m ** 3, 3));
        if (!close(qn(v), simpson((u) => (a + u * u) * u * 2 * u, 0, m))) throw new Error('sub-xroot 셈');               // x = a + u² 로 매끄럽게 바꾸어 수치 적분
        return pos(`${jh(dfi(a, top, X + rt(lin(1, -a))), '의/의')} 값은?`, v, {
          explain: `${X} ${MINUS} ${a} = ${jh(Tt, '으로/로')} 놓으면 ${is(X, a)}일 때 ${is(Tt, 0)}, ${is(X, top)}일 때 ${is(Tt, m * m)}이므로 ${dfi(0, m * m, `(${Tt} + ${a})${rt(Tt)}`, 't')} = ${evl(sumH([[Q(2, 5), pw('t', [5, 2])], [Q(2 * a, 3), pw('t', [3, 2])]]), 0, m * m)} = ${iq(v)}이다.`,
          facts: { value: `2/5*${m}**5+2*${a}/3*${m}**3` } });
      }
      // ∫(0 ~ s² − 1) kx/√(x + 1)dx, √(x + 1) = t → 2k[t³/3 − t](1~s)
      const s = d.pick([2, 3]), k = d.pick([3, 6]), top = s * s - 1, v = qmul(2 * k, qsub(Q(s ** 3 - 1, 3), s - 1));
      if (!close(qn(v), simpson((x) => k * x / SQ(x + 1), 0, top))) throw new Error('sub-xroot 셈 3');
      return pos(`${jh(dfi(0, top, frac(k + X, rt(`${X} + 1`))), '의/의')} 값은?`, v, {
        explain: `${rt(`${X} + 1`)} = ${jh(Tt, '으로/로')} 놓으면 ${is(X, `${Tt}${sup(2)} ${MINUS} 1`)}, ${frac(1, '2' + rt(`${X} + 1`))} = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} 1부터 ${s}까지이므로 ${dfi(1, s, `${2 * k}(${Tt}${sup(2)} ${MINUS} 1)`, 't')} = ${iq(v)}이다.`,
        facts: { value: `2*${k}*((${s}**3-1)/3-(${s}-1))` } });
    }, { count: 3, standard: S2 })
  ];
  function pq2(pq) { return pq[0] === 0 ? 0 : PI * pq[0] / pq[1]; }

  // ════════════════════════════════════════════════════════════════
  // f′(x)/f(x) 꼴과 유리함수의 적분
  // ════════════════════════════════════════════════════════════════
  const ratfn = [
    T('rat-fpf-poly', 'f′(x)/f(x) 꼴 — 분모가 다항식', '①29', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 3), b = nzi(d, -5, 5), c = nzi(d, -6, 6), den = MQ2([[a, X + sup(2)], [b, X], [c, '']]), nm = MQ2([[2 * a, X], [b, '']]), g = (x) => a * x * x + b * x + c;
        const disc = b * b - 4 * a * c;
        if (disc <= 0) return null;                                                     // 분모가 음수가 되는 구간이 있어야 절댓값이 뜻을 갖는다
        const r1 = (-b - SQ(disc)) / (2 * a), r2 = (-b + SQ(disc)) / (2 * a), mid = (r1 + r2) / 2, wid = (r2 - r1) / 2;
        const spans = [[r2 + 0.5, r2 + 1.5], [mid - wid / 3, mid + wid / 3]];
        return chooseF(d, `${jh(ind(frac(nm, den)), '은/는')}? ${CN}`, (x) => (2 * a * x + b) / g(x), [plusC(lnAbs(den)), (x) => LN(Math.abs(g(x)))], [
          [plusC(ln(par(den))), (x) => LN(g(x))], [plusC(MINUS + frac(1, den)), (x) => -1 / g(x)], [plusC(lnAbs(nm)), (x) => LN(Math.abs(2 * a * x + b))], [plusC(frac(1, 2 * a) + lnAbs(den)), (x) => LN(Math.abs(g(x))) / (2 * a)]
        ], spans, { explain: `(${den})′ = ${nm}이므로 ${is(ind(frac(fp('f'), FX)), plusC(lnAbs(FX)))}에서 ${plusC(lnAbs(den))}이다. 분모가 음수인 구간도 있으므로 절댓값을 붙인다.` });
      }
      const e = d.pick([1, 2, -1, -2]), den = MQ2([[1, X + sup(3)], [3 * e, X]]), nm = MQ2([[1, X + sup(2)], [e, '']]), g = (x) => x ** 3 + 3 * e * x;
      return chooseF(d, `${jh(ind(frac(nm, den)), '은/는')}? ${CN}`, (x) => (x * x + e) / g(x), [plusC(frac(1, 3) + lnAbs(den)), (x) => LN(Math.abs(g(x))) / 3], [
        [plusC(lnAbs(den)), (x) => LN(Math.abs(g(x)))], [plusC('3' + lnAbs(den)), (x) => 3 * LN(Math.abs(g(x)))], [plusC(frac(1, 3) + lnAbs(nm)), (x) => LN(Math.abs(x * x + e)) / 3], [plusC(frac(1, 2) + lnAbs(den)), (x) => LN(Math.abs(g(x))) / 2]
      ], [[3, 4], [4, 5]], { explain: `(${den})′ = 3(${nm})이므로 ${frac(1, 3)}${ind(frac(`(${den})′`, den))} = ${plusC(frac(1, 3) + lnAbs(den))}이다.` });
    }, { count: 2, standard: S2 }),
    T('rat-fpf-trans', 'f′(x)/f(x) 꼴 — 분모에 삼각·지수·로그함수', '①30', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 2), k = d.int(1, 4), K = K1(k);
        if (kind === 0) return chooseF(d, `${jh(ind(K + tn()), '은/는')}? ${CN}`, (x) => k * Math.tan(x), [plusC(MINUS + K + lnAbs(cs())), (x) => -k * LN(Math.abs(Math.cos(x)))], [
          [plusC(K + lnAbs(cs())), (x) => k * LN(Math.abs(Math.cos(x)))], [plusC(K + lnAbs(sn())), (x) => k * LN(Math.abs(Math.sin(x)))], [plusC(K + sc(null, 2)), (x) => k * sec(x) ** 2], [plusC(MINUS + K + lnAbs(sn())), (x) => -k * LN(Math.abs(Math.sin(x)))]
        ], [[0.2, 1], [2, 3]], { explain: `${is(tn(), frac(sn(), cs()))}이고 (${cs()})′ = ${MINUS}${sn()}이므로 ${MINUS}${K}${ind(frac(`(${cs()})′`, cs()))} = ${plusC(MINUS + K + lnAbs(cs()))}이다.` });
        if (kind === 1) return chooseF(d, `${jh(ind(K + ct()), '은/는')}? ${CN}`, (x) => k / Math.tan(x), [plusC(K + lnAbs(sn())), (x) => k * LN(Math.abs(Math.sin(x)))], [
          [plusC(MINUS + K + lnAbs(sn())), (x) => -k * LN(Math.abs(Math.sin(x)))], [plusC(K + lnAbs(cs())), (x) => k * LN(Math.abs(Math.cos(x)))], [plusC(MINUS + K + B.kit.u56x.cc(null, 2)), (x) => -k / Math.sin(x) ** 2], [plusC(MINUS + K + lnAbs(cs())), (x) => -k * LN(Math.abs(Math.cos(x)))]
        ], [[0.2, 1], [2, 3]], { explain: `${is(ct(), frac(cs(), sn()))}이고 (${sn()})′ = ${jh(cs(), '이므로/이므로')} ${plusC(K + lnAbs(sn()))}이다.` });
        const c = d.int(2, 5);
        return chooseF(d, `${jh(ind(frac(K + sn(), `${c} ${MINUS} ${cs()}`)), '은/는')}? ${CN}`, (x) => k * Math.sin(x) / (c - Math.cos(x)), [plusC(K + ln(par(`${c} ${MINUS} ${cs()}`))), (x) => k * LN(c - Math.cos(x))], [
          [plusC(MINUS + K + ln(par(`${c} ${MINUS} ${cs()}`))), (x) => -k * LN(c - Math.cos(x))], [plusC(K + ln(par(`${c} + ${sn()}`))), (x) => k * LN(c + Math.sin(x))], [plusC(MINUS + K + lnAbs(cs())), (x) => -k * LN(Math.abs(Math.cos(x)))], [plusC(K + ln(par(`${c} ${MINUS} ${sn()}`))), (x) => k * LN(c - Math.sin(x))]
        ], [[0, 1], [1, 3]], { explain: `(${c} ${MINUS} ${cs()})′ = ${jh(sn(), '이므로/이므로')} ${plusC(K + ln(par(`${c} ${MINUS} ${cs()}`)))}이다(${c} ${MINUS} ${cs()} &gt; 0).` });
      }
      if (n === 1) {
        const kind = d.int(0, 2), ex = ePow('x'), em = ePow('-x');
        if (kind === 0) return chooseF(d, `${jh(ind(frac(`${ex} + ${em}`, `${ex} ${MINUS} ${em}`)), '은/는')}? ${CN}`, (x) => (EE ** x + EE ** -x) / (EE ** x - EE ** -x), [plusC(lnAbs(`${ex} ${MINUS} ${em}`)), (x) => LN(Math.abs(EE ** x - EE ** -x))], [
          [plusC(ln(par(`${ex} + ${em}`))), (x) => LN(EE ** x + EE ** -x)], [plusC(ln(par(`${ex} ${MINUS} ${em}`))), (x) => LN(EE ** x - EE ** -x)], [plusC(MINUS + lnAbs(`${ex} ${MINUS} ${em}`)), (x) => -LN(Math.abs(EE ** x - EE ** -x))], [plusC(`${ex} ${MINUS} ${em}`), (x) => EE ** x - EE ** -x]
        ], [[0.5, 1.5], [-2, -0.5]], { explain: `(${ex} ${MINUS} ${em})′ = ${ex} + ${jh(em, '이므로/이므로')} ${plusC(lnAbs(`${ex} ${MINUS} ${em}`))}이다(${X} &lt; 0이면 분모가 음수).` });
        if (kind === 1) return chooseF(d, `${jh(ind(frac(`${ex} ${MINUS} ${em}`, `${ex} + ${em}`)), '은/는')}? ${CN}`, (x) => (EE ** x - EE ** -x) / (EE ** x + EE ** -x), [plusC(ln(par(`${ex} + ${em}`))), (x) => LN(EE ** x + EE ** -x)], [
          [plusC(lnAbs(`${ex} ${MINUS} ${em}`)), (x) => LN(Math.abs(EE ** x - EE ** -x))], [plusC(MINUS + ln(par(`${ex} + ${em}`))), (x) => -LN(EE ** x + EE ** -x)], [plusC(`${ex} + ${em}`), (x) => EE ** x + EE ** -x], [plusC(ln(par(`${ex} ${MINUS} ${em}`)) + ' ' + MINUS + ' ' + X), (x) => LN(Math.abs(EE ** x - EE ** -x)) - x]
        ], [[0, 1], [-1, 1]], { explain: `(${ex} + ${em})′ = ${ex} ${MINUS} ${jh(em, '이므로/이므로')} ${plusC(ln(par(`${ex} + ${em}`)))}이다.` });
        const c = d.int(1, 3), den = `${em} + ${c === 1 ? '' : c}${X}${sup(2)}`, nmr = `${em} ${MINUS} ${2 * c}${X}`;
        return chooseF(d, `${jh(ind(frac(nmr, den)), '은/는')}? ${CN}`, (x) => (EE ** -x - 2 * c * x) / (EE ** -x + c * x * x), [plusC(MINUS + ln(par(den))), (x) => -LN(EE ** -x + c * x * x)], [
          [plusC(ln(par(den))), (x) => LN(EE ** -x + c * x * x)], [plusC(lnAbs(nmr)), (x) => LN(Math.abs(EE ** -x - 2 * c * x))], [plusC(MINUS + frac(1, den)), (x) => -1 / (EE ** -x + c * x * x)], [plusC(`${MINUS}${em} ${MINUS} ${c === 1 ? '' : c}${X}${sup(2)}`), (x) => -(EE ** -x) - c * x * x]
        ], [[0, 1], [-1, 0.5]], { explain: `(${den})′ = ${MINUS}${em} + ${2 * c}${X} = ${MINUS}(${nmr})이므로 ${MINUS}${ind(frac(`(${den})′`, den))} = ${plusC(MINUS + ln(par(den)))}이다.` });
      }
      // f(x) = ∫(x + k)/(x² + kx ln x)dx → f(e) − f(1) = ln(e + k)
      const k = d.int(1, 3), fn2 = (x) => (x + k) / (x * x + k * x * LN(x)), v = LN(EE + k);
      return chooseV(d, `${ms('x > 0')}에서 정의된 함수 ${is(FX, ind(frac(`${X} + ${k}`, `${X}${sup(2)} + ${K1(k)}${X}${ln('x')}`)))}에 대하여 ${fx('f', EV)} ${MINUS} ${jh(fx('f', 1), '의/의')} 값은?`, [ln(par(`${EV} + ${k}`)), v], [
        [ln(par(`${EV} + ${k}`)) + ' ' + MINUS + ' 1', v - 1], [ln(par(`${k}${EV}`)), LN(k * EE)], [ln(par(`${EV}${sup(2)} + ${K1(k)}${EV}`)), LN(EE * EE + k * EE)], [ln(par(`${EV} + ${k}`)) + ' ' + MINUS + ' ' + ln(k), v - LN(k)], [ln(k + 1), LN(k + 1)]
      ], simpson(fn2, 1, EE), {
        explain: `분자·분모를 ${jh(X, '으로/로')} 나누면 ${frac(`1 + ${frac(k, X)}`, `${X} + ${K1(k)}${ln('x')}`)}이고 (${X} + ${K1(k)}${ln('x')})′ = 1 + ${frac(k, X)}이므로 ${is(FX, plusC(lnAbs(`${X} + ${K1(k)}${ln('x')}`)))}, ${fx('f', EV)} ${MINUS} ${is(fx('f', 1), ln(par(`${EV} + ${k}`)))} ${MINUS} ${ln(1)} = ${ln(par(`${EV} + ${k}`))}이다.` });
    }, { count: 3, standard: S2 }),
    T('rat-sec', '∫sec x dx 구하는 과정의 빈칸', '①31', (d) => {
      const gs = [[`${sc()}${tn()}`, (x) => sec(x) * Math.tan(x)], [`${MINUS}${sc()}${tn()}`, (x) => -sec(x) * Math.tan(x)], [sc(null, 2), (x) => sec(x) ** 2]];
      const hs = [[`|${sc()} + ${tn()}|`, (x) => Math.abs(sec(x) + Math.tan(x))], [`|${sc()} ${MINUS} ${tn()}|`, (x) => Math.abs(sec(x) - Math.tan(x))], [`|${sc()}${tn()}|`, (x) => Math.abs(sec(x) * Math.tan(x))]];
      const okG = (g) => [0.3, 0.7, 1.1].every((x) => close((sec(x + 1e-5) + Math.tan(x + 1e-5) - sec(x - 1e-5) - Math.tan(x - 1e-5)) / 2e-5, g(x) + sec(x) ** 2) || Math.abs((sec(x + 1e-5) + Math.tan(x + 1e-5) - sec(x - 1e-5) - Math.tan(x - 1e-5)) / 2e-5 - g(x) - sec(x) ** 2) < 1e-4);
      const okH = (h) => [[0.2, 0.9], [-1, 0.5]].every(([a, b]) => close(LN(h(b)) - LN(h(a)), simpson(sec, a, b)));
      const pairs = [];
      for (const g of gs) for (const h of hs) pairs.push([`㈎ ${g[0]}, ㈏ ${h[0]}`, okG(g[1]) && okH(h[1])]);
      const pick = d.shuffle(pairs.filter((p) => !p[1])).slice(0, 4).concat(pairs.filter((p) => p[1]));
      const list = d.shuffle(pick), truth = list.map((p) => p[1]);
      if (truth.filter(Boolean).length !== 1) return null;
      const steps = lines([
        `${ind(sc())} = ${ind(frac(`${sc()}(${sc()} + ${tn()})`, `${sc()} + ${tn()}`))}`,
        `${jh(is(FX, `${sc()} + ${tn()}`), '으로/로')} 놓으면 ${is(fp('f'), `㈎ + ${sc(null, 2)}`)}`,
        `따라서 ${ind(sc())} = ${ind(frac(fp('f'), FX))} = ${ln('(㈏)')} + ${Cc}`
      ]);
      return B.kit.C(`다음은 부정적분 ${jh(ind(sc()), '을/를')} 구하는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, list.map((p) => p[0]), truth.indexOf(true), {
        figure: steps,
        explain: `(${sc()})′ = ${sc()}${tn()}, (${tn()})′ = ${jh(sc(null, 2), '이므로/이므로')} 분자는 분모의 도함수이고 ${is(ind(sc()), plusC(lnAbs(`${sc()} + ${tn()}`)))}이다.`,
        facts: { truth, want: true } });
    }, { standard: S2 }),
    T('rat-divide', '유리함수 — 나눗셈으로 (몫) + (나머지)/(일차식)', '①32', (d, n) => {
      if (n === 0) {
        const r = nzi(d, -3, 3), qv = nzi(d, -4, 4), rem = nzi(d, -5, 5);                 // x² + px + q = (x + r)(x + qv) + rem
        const p = r + qv, qq = r * qv + rem, nm = MQ2([[1, X + sup(2)], [p, X], [qq, '']]), den = lin(1, r), g = (x) => (x * x + p * x + qq) / (x + r);
        const ans = (c1, c2) => plusC(sumH([[Q(1, 2), X + sup(2)], [c1, X], [c2, lnAbs(den)]]));
        return chooseF(d, `${jh(ind(frac(nm, den)), '은/는')}? ${CN}`, g, [ans(qv, rem), (x) => x * x / 2 + qv * x + rem * LN(Math.abs(x + r))], [
          [ans(qv, -rem), (x) => x * x / 2 + qv * x - rem * LN(Math.abs(x + r))], [ans(p, rem), (x) => x * x / 2 + p * x + rem * LN(Math.abs(x + r))], [ans(qv, 0) + '', (x) => x * x / 2 + qv * x],
          [plusC(sumH([[Q(1, 2), X + sup(2)], [qv, X], [rem, ln(par(den))]])), (x) => x * x / 2 + qv * x + rem * LN(x + r)]
        ], [[-r + 1, -r + 2], [-r - 3, -r - 1]], { explain: `${nm} = (${den})(${lin(1, qv)}) ${sg(rem)} ${Math.abs(rem)}이므로 ${frac(nm, den)} = ${lin(1, qv)} ${sg(rem)} ${frac(Math.abs(rem), den)}이고 ${ans(qv, rem)}이다.` });
      }
      // (x + 1)f′(x) = x² + px (x > −1) → f(b) − f(a)
      const pp = d.pick([-2, -3, 1, 2]), a = d.int(1, 2), b = a + d.int(1, 3), qv = pp - 1, rem = 1 - pp;  // x² + px = (x + 1)(x + p − 1) + (1 − p)
      const poly = (x) => x * x / 2 + qv * x, v = poly(b) - poly(a) + rem * LN((b + 1) / (a + 1)), P = poly(b) - poly(a);
      const pv = Q(b * b - a * a, 2), polyQ = qadd(pv, qv * (b - a)), lnq = Q(b + 1, a + 1), opt = (c0, cl, arg) => sumH([[c0, ''], [cl, ln(arg)]]);
      return chooseV(d, `${ms('x > -1')}에서 미분가능한 함수 ${jh(FX, '이/가')} ${jh(is(`(${X} + 1)${fp('f')}`, MQ2([[1, X + sup(2)], [pp, X]])), '을/를')} 만족시킬 때, ${fx('f', b)} ${MINUS} ${jh(fx('f', a), '의/의')} 값은?`, [opt(polyQ, rem, iq(lnq)), v], [
        [opt(polyQ, -rem, iq(lnq)), P - rem * LN((b + 1) / (a + 1))], [opt(polyQ, rem, iq(Q(b, a))), P + rem * LN(b / a)], [opt(qadd(polyQ, 1), rem, iq(lnq)), P + 1 + rem * LN((b + 1) / (a + 1))], [opt(polyQ, 1, iq(lnq)), P + LN((b + 1) / (a + 1))]
      ], simpson((x) => (x * x + pp * x) / (x + 1), a, b), {
        explain: `${is(fp('f'), frac(MQ2([[1, X + sup(2)], [pp, X]]), `${X} + 1`))} = ${lin(1, qv)} ${sg(rem)} ${frac(Math.abs(rem), `${X} + 1`)}이므로 ${is(FX, plusC(sumH([[Q(1, 2), X + sup(2)], [qv, X], [rem, ln(`(${X} + 1)`)]])))}이다.` });
    }, { count: 2, standard: S2 }),
    T('rat-partial', '유리함수 — 부분분수로 나누기', '①33', (d, n) => {
      if (n === 0) {
        const kind = d.bool(), c = d.int(1, 3), k = d.pick([2, 4, 6]);
        if (kind) {
          // ∫k/(x² − c²)dx = (k/2c) ln|(x − c)/(x + c)|
          const co = Q(k, 2 * c), den = MQ2([[1, X + sup(2)], [-c * c, '']]), arg = frac(lin(1, -c), lin(1, c));
          return chooseF(d, `${jh(ind(frac(k, den)), '은/는')}? ${CN}`, (x) => k / (x * x - c * c), [plusC(sumH([[co, lnAbs(arg)]])), (x) => qn(co) * LN(Math.abs((x - c) / (x + c)))], [
            [plusC(sumH([[co, lnAbs(frac(lin(1, c), lin(1, -c)))]])), (x) => qn(co) * LN(Math.abs((x + c) / (x - c)))], [plusC(sumH([[k, lnAbs(arg)]])), (x) => k * LN(Math.abs((x - c) / (x + c)))],
            [plusC(sumH([[k, lnAbs(den)]])), (x) => k * LN(Math.abs(x * x - c * c))], [plusC(sumH([[Q(k, 2), lnAbs(den)]])), (x) => k / 2 * LN(Math.abs(x * x - c * c))]
          ], [[c + 1, c + 2], [-c / 2, c / 2]], { explain: `${frac(k, den)} = ${iq(Q(k, 2 * c))}(${frac(1, lin(1, -c))} ${MINUS} ${frac(1, lin(1, c))})이므로 ${plusC(sumH([[co, lnAbs(arg)]]))}이다.` });
        }
        // ∫k/(x(x + c))dx = (k/c) ln|x/(x + c)|
        const co = Q(k, c), arg = frac(X, lin(1, c)), den = `${X}(${lin(1, c)})`;
        return chooseF(d, `${jh(ind(frac(k, den)), '은/는')}? ${CN}`, (x) => k / (x * (x + c)), [plusC(sumH([[co, lnAbs(arg)]])), (x) => qn(co) * LN(Math.abs(x / (x + c)))], [
          [plusC(sumH([[co, lnAbs(frac(lin(1, c), X))]])), (x) => qn(co) * LN(Math.abs((x + c) / x))], [plusC(sumH([[k, lnAbs(arg)]])), (x) => k * LN(Math.abs(x / (x + c)))],
          [plusC(sumH([[k, lnAbs(den)]])), (x) => k * LN(Math.abs(x * (x + c)))], [plusC(sumH([[co, lnAbs(den)]])), (x) => qn(co) * LN(Math.abs(x * (x + c)))]
        ], [[1, 2], [-c - 2, -c - 1]], { explain: `${frac(k, den)} = ${frac(k, c)}(${frac(1, X)} ${MINUS} ${frac(1, lin(1, c))})이므로 ${plusC(sumH([[co, lnAbs(arg)]]))}이다.` });
      }
      if (n === 1) {
        // f(x) = ∫4/((x − p)(x − p − 2))dx → f(b) − f(a), (p + 2 < a < b)
        const p = d.int(1, 4), m = d.int(1, 3), a = p + 2 + m, b = a + d.int(1, 3), den = MQ2([[1, X + sup(2)], [-(2 * p + 2), X], [p * (p + 2), '']]);
        const g = (x) => 4 / ((x - p) * (x - p - 2)), lnq = qmul(Q(b - p - 2, b - p), Q(a - p, a - p - 2)), v = 2 * LN(qn(lnq));
        return chooseV(d, `함수 ${is(FX, ind(frac(4, den)))}에 대하여 ${fx('f', b)} ${MINUS} ${jh(fx('f', a), '의/의')} 값은?`, ['2' + ln(iq(lnq)), v], [
          ['4' + ln(iq(lnq)), 2 * v], [ln(iq(lnq)), v / 2], [MINUS + '2' + ln(iq(lnq)), -v], ['2' + ln(iq(Q(b - p, a - p))), 2 * LN((b - p) / (a - p))]
        ], simpson(g, a, b), {
          explain: `${den} = (${lin(1, -p)})(${lin(1, -p - 2)})이므로 ${frac(4, den)} = 2(${frac(1, lin(1, -p - 2))} ${MINUS} ${frac(1, lin(1, -p))})이고 ${is(FX, plusC('2' + lnAbs(frac(lin(1, -p - 2), lin(1, -p)))))}이다.` });
      }
      // x > p, f(x) = ∫(x + s)/((x − p)(x + r))dx, f(t1) = 0 → f(t2)
      const p = d.int(1, 3), r = d.int(1, 2), A = nzi(d, -2, 3), Bc = d.until(() => nzi(d, -2, 2), (v) => v !== -A);
      const sNum = A * r - Bc * p, num1 = A + Bc;                                            // (x + s)/((x − p)(x + r)) = A/(x − p) + B/(x + r) → 분자 (A + B)x + (Ar − Bp)
      if (num1 === 0) return null;
      const nm = MQ2([[num1, X], [sNum, '']]), den = MQ2([[1, X + sup(2)], [r - p, X], [-p * r, '']]);
      const t1 = p + d.int(1, 4), t2 = d.until(() => p + d.int(1, 5), (v) => v !== t1);
      const G = (x) => A * LN(x - p) + Bc * LN(x + r), v = G(t2) - G(t1), g = (x) => (num1 * x + sNum) / ((x - p) * (x + r));
      const opt = (ca, cb) => sumH([[ca, ln(iq(Q(t2 - p, t1 - p)))], [cb, ln(iq(Q(t2 + r, t1 + r)))]]);
      const right = [opt(A, Bc), v];
      if (!Number.isFinite(v) || Math.abs(v) < 1e-9 || (t2 - p) === (t1 - p)) return null;
      return chooseV(d, `${ms('x > ' + p)}에서 정의된 함수 ${jh(is(FX, ind(frac(nm, den))), '이/가')} ${jh(is(fx('f', t1), 0), '을/를')} 만족시킬 때, ${jh(fx('f', t2), '의/의')} 값은?`, right, [
        [opt(Bc, A), Bc * LN((t2 - p) / (t1 - p)) + A * LN((t2 + r) / (t1 + r))], [opt(-A, -Bc), -v], [opt(A, -Bc), A * LN((t2 - p) / (t1 - p)) - Bc * LN((t2 + r) / (t1 + r))], [opt(-A, Bc), -A * LN((t2 - p) / (t1 - p)) + Bc * LN((t2 + r) / (t1 + r))]
      ], simpson(g, t1, t2), {
        explain: `${frac(nm, den)} = ${frac(A, lin(1, -p))} ${sg(Bc)} ${frac(Math.abs(Bc), lin(1, r))}(분자를 견주어 미정계수를 정한다)이므로 ${is(FX, plusC(sumH([[A, ln(par(lin(1, -p)))], [Bc, ln(par(lin(1, r)))]])))}이고 ${jh(is(fx('f', t1), 0), '으로/로')} ${jh(Cc, '을/를')} 정한다.` });
    }, { count: 3, standard: S2 })
  ];
  // 다항식 글(공용 poly — 계수 1 생략, 0인 항 생략)
  function MQ2(terms) { return B.kit.mid.poly(terms); }

  // ════════════════════════════════════════════════════════════════
  // 치환적분법을 이용한 정적분
  // ════════════════════════════════════════════════════════════════
  const subdef = [
    T('sdef-basic', '치환한 정적분 — 위끝·아래끝을 t의 값으로 바꾸기', '②1', (d, n) => {
      if (n === 0) {
        // ∫(lo~hi)(cx + e)ᵏ dx
        const c = d.int(1, 3), e = d.int(-2, 2), k = d.int(3, 5), lo = d.int(-1, 0), hi = lo + 1, t1 = c * lo + e, t2 = c * hi + e;
        if (e === 0 || Math.abs(t2) > 4 || Math.abs(t1) > 4) return null;
        const v = Q(t2 ** (k + 1) - t1 ** (k + 1), c * (k + 1));
        if (!close(qn(v), simpson((x) => (c * x + e) ** k, lo, hi))) throw new Error('sdef-basic 셈');
        return num(`${jh(dfi(lo, hi, powH(lin(c, e), k)), '의/의')} 값은?`, v, {
          explain: `${lin(c, e)} = ${jh(Tt, '으로/로')} 놓으면 ${c} = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} ${iq(t1)}부터 ${iq(t2)}까지이므로 ${frac(1, c)}${dfi(t1, t2, Tt + sup(k), 't')} = ${iq(v)}이다.`,
          facts: { value: `((${c}*${hi}+${J(e)})**${k + 1}-(${c}*${J(lo)}+${J(e)})**${k + 1})/(${c}*${k + 1})` } });
      }
      if (n === 1) {
        const k = d.int(2, 6), useLn = d.bool(), v = Q(1, k + 1);
        if (useLn) return pos(`${jh(dfi(1, ms('e'), frac(`(${ln('x')})${sup(k)}`, X)), '의/의')} 값은?`, v, {
          explain: `${ln('x')} = ${jh(Tt, '으로/로')} 놓으면 ${frac(1, X)} = ${frac(V('d') + Tt, V('d') + X)}이고 ${is(X, 1)}일 때 ${is(Tt, 0)}, ${is(X, EV)}일 때 ${is(Tt, 1)}이므로 ${dfi(0, 1, Tt + sup(k), 't')} = ${iq(v)}이다.`,
          facts: { value: `1/(${k}+1)` } });
        return pos(`${jh(dfi(0, frac('π', 2), sn(null, k) + cs()), '의/의')} 값은?`, v, {
          explain: `${sn()} = ${jh(Tt, '으로/로')} 놓으면 ${cs()} = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} 0부터 1까지이므로 ${dfi(0, 1, Tt + sup(k), 't')} = ${iq(v)}이다.`,
          facts: { value: `1/(${k}+1)` } });
      }
      if (n === 2) {
        const kind = d.int(0, 3);
        if (kind === 0) {
          const v = Q(52, 9);
          if (!close(qn(v), simpson((x) => x * x * SQ(x ** 3 + 1), 0, 2))) throw new Error('sdef 셈');
          return pos(`${jh(dfi(0, 2, X + sup(2) + rt(`${X}${sup(3)} + 1`)), '의/의')} 값은?`, v, {
            explain: `${X}${sup(3)} + 1 = ${jh(Tt, '으로/로')} 놓으면 3${X}${sup(2)} = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} 1부터 9까지이므로 ${frac(1, 3)}${dfi(1, 9, rt(Tt), 't')} = ${frac(2, 9)}(27 ${MINUS} 1) = ${iq(v)}이다.`,
            facts: { value: `2/9*((2**3+1)**(3/2)-1)` } });
        }
        const [c, s] = [[9, 4], [16, 3], [36, 8], [64, 6]][kind - 1 + (d.bool() ? 0 : 0)], top = s * s + c, v = Q(SQ(top) ** 3 - SQ(c) ** 3, 3);
        if (!close(qn(v), simpson((x) => x * SQ(x * x + c), 0, s))) throw new Error('sdef 셈 2');
        return pos(`${jh(dfi(0, s, X + rt(`${X}${sup(2)} + ${c}`)), '의/의')} 값은?`, v, {
          explain: `${X}${sup(2)} + ${c} = ${jh(Tt, '으로/로')} 놓으면 2${X} = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} ${c}부터 ${top}까지이므로 ${frac(1, 2)}${dfi(c, top, rt(Tt), 't')} = ${frac(1, 3)}(${top ** 1.5} ${MINUS} ${c ** 1.5}) = ${iq(v)}이다.`,
          facts: { value: `((${s}**2+${c})**(3/2)-${c}**(3/2))/3` } });
      }
      if (n === 3) {
        const a = d.int(1, 3), k = d.int(2, 3), v = Q((a + 1) ** (k + 1) - a ** (k + 1), k + 1);
        if (!close(qn(v), simpson((x) => (LN(x) + a) ** k / x, 1, EE))) throw new Error('sdef 셈 3');
        return pos(`${jh(dfi(1, ms('e'), frac(`(${ln('x')} + ${a})${sup(k)}`, X)), '의/의')} 값은?`, v, {
          explain: `${ln('x')} + ${a} = ${jh(Tt, '으로/로')} 놓으면 ${frac(1, X)} = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} ${a}부터 ${a + 1}까지이므로 ${dfi(a, a + 1, Tt + sup(k), 't')} = ${iq(v)}이다.`,
          facts: { value: `((${a}+1)**(${k}+1)-${a}**(${k}+1))/(${k}+1)` } });
      }
      if (n === 5) {
        // ∫(0 ~ 2p + 1)(x − p)e^(x² − 2px)dx = (e^(2p + 1) − 1)/2  (교 152쪽 문7⑵)
        const p = d.int(1, 2), b = 2 * p + 1, w = b, ex = ePow(String(w)), v = (EE ** w - 1) / 2, inner = `${X}${sup(2)} ${MINUS} ${2 * p === 1 ? '' : 2 * p}${X}`;
        return chooseV(d, `${jh(dfi(0, b, `(${lin(1, -p)})${ePow(inner)}`), '의/의')} 값은?`, [frac(`${ex} ${MINUS} 1`, 2), v], [
          [`${ex} ${MINUS} 1`, EE ** w - 1], [frac(`${ex} + 1`, 2), (EE ** w + 1) / 2], [frac(ex, 2), EE ** w / 2], [frac(`${ex} ${MINUS} 1`, 4), (EE ** w - 1) / 4]
        ], simpson((x) => (x - p) * EE ** (x * x - 2 * p * x), 0, b), {
          explain: `${inner} = ${jh(Tt, '으로/로')} 놓으면 2(${lin(1, -p)}) = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} 0부터 ${jh(w, '까지이므로/까지이므로')} ${frac(1, 2)}${dfi(0, w, ePow('t'), 't')} = ${frac(`${ex} ${MINUS} 1`, 2)}이다.` });
      }
      // 과정 빈칸: ax − b = t, ∫(p~q) a(k + 1)(ax − b)ᵏ dx = ∫(㉠~㉡)(k + 1)tᵏ dt = ㉢
      const a = d.int(2, 3), b = d.int(1, 3), k = d.pick([2, 3, 4]), lo = 0, hi = d.int(1, 2), t1 = -b, t2 = a * hi - b, m = a * (k + 1), v = t2 ** (k + 1) - t1 ** (k + 1);
      if (!close(v, simpson((x) => m * (a * x - b) ** k, lo, hi))) throw new Error('sdef 셈 4');
      return M(`다음은 정적분 ${jh(dfi(lo, hi, `${m}${powH(lin(a, -b), k)}`), '의/의')} 값을 구하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수를 차례로 구하시오.`, [
        { label: '㉠', answer: t1, signed: true }, { label: '㉡', answer: t2, signed: true }, { label: '㉢', answer: v, signed: true }
      ], {
        figure: lines([`${lin(a, -b)} = ${jh(Tt, '으로/로')} 놓으면 ${a} = ${frac(V('d') + Tt, V('d') + X)}이고`, `${is(X, lo)}일 때 ${is(Tt, '㉠')}, ${is(X, hi)}일 때 ${is(Tt, '㉡')}이므로`, `${dfi(lo, hi, `${m}${powH(lin(a, -b), k)}`)} = ${dfi('㉠', '㉡', (k + 1) + Tt + sup(k), 't')} = ㉢`]),
        shown: `${iq(t1)}, ${iq(t2)}, ${iq(v)}`,
        explain: `${is(X, lo)}이면 ${is(Tt, t1)}, ${is(X, hi)}이면 ${is(Tt, t2)}이고 ${evl(Tt + sup(k + 1), t1, t2)} = ${iq(v)}이다.`,
        facts: { calc: [[`${a}*${lo}-${b}`, 0], [`${a}*${hi}-${b}`, 1], [`(${a}*${hi}-${b})**(${k}+1)-(-${b})**(${k}+1)`, 2]] } });
    }, { count: 6, standard: S2 }),
    T('sdef-log', 'f′/f 꼴의 정적분 — ln 값', '②2', (d, n) => {
      if (n === 0) {
        const c = d.int(1, 4), m = d.int(2, 5), val = Q(m + c, 1 + c), v = LN(qn(val));
        return chooseV(d, `${jh(dfi(0, ln(m), frac(ePow('x'), `${ePow('x')} + ${c}`)), '의/의')} 값은?`, [ln(iq(val)), v], [
          [ln(m + c), LN(m + c)], [ln(iq(Q(m, 1 + c))), LN(m / (1 + c))], [MINUS + ln(iq(val)), -v], [ln(m), LN(m)]
        ], simpson((x) => EE ** x / (EE ** x + c), 0, LN(m)), {
          explain: `(${ePow('x')} + ${c})′ = ${jh(ePow('x'), '이므로/이므로')} ${evl(ln(par(`${ePow('x')} + ${c}`)), 0, ln(m))} = ${ln(m + c)} ${MINUS} ${ln(1 + c)} = ${ln(iq(val))}이다.` });
      }
      const k = d.int(1, 3), c = d.int(2, 4), val = Q(c + 1, c), v = k * LN(qn(val));
      return chooseV(d, `${jh(dfi(0, frac('π', 2), frac(K1(k) + sn(), `${c} + ${cs()}`)), '의/의')} 값은?`, [K1(k) + ln(iq(val)), v], [
        [MINUS + K1(k) + ln(iq(val)), -v], [K1(k) + ln(iq(Q(c, c - 1))), k * LN(c / (c - 1))], [K1(k) + ln(c + 1), k * LN(c + 1)], [K1(2 * k) + ln(iq(val)), 2 * v]
      ], simpson((x) => k * Math.sin(x) / (c + Math.cos(x)), 0, PI / 2), {
        explain: `${c} + ${cs()} = ${jh(Tt, '으로/로')} 놓으면 ${MINUS}${sn()} = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} ${c + 1}에서 ${jh(c, '으로/로')} 가므로 ${MINUS}${K1(k)}${dfi(c + 1, c, frac(1, Tt), 't')} = ${K1(k)}${dfi(c, c + 1, frac(1, Tt), 't')} = ${K1(k)}${ln(iq(val))}이다.` });
    }, { count: 2, standard: S2 }),
    T('sdef-seq', '치환 정적분으로 만든 수열의 합', '②5', (d) => {
      const Nn = d.int(5, 12), v = qadd(Nn - 1, Q(1, Nn + 1));
      const an = dfi(1, ms('e'), frac(`(${ln('x')})${sup(V('n'))}`, X)), bn = dfi(1, V('n'), frac(1, X + sup(2)));
      return pos(`두 수열 {${V('a')}${B.kit.hs.sub(V('n'))}}, {${V('b')}${B.kit.hs.sub(V('n'))}}의 일반항이 각각 ${V('a')}${B.kit.hs.sub(V('n'))} = ${an}, ${V('b')}${B.kit.hs.sub(V('n'))} = ${jh(bn, '일/일')} 때, ${jh(sum('n=1', Nn, '(a_n + b_n)'), '의/의')} 값은?`, v, {
        explain: `${ln('x')} = ${jh(Tt, '으로/로')} 놓으면 ${V('a')}${B.kit.hs.sub(V('n'))} = ${dfi(0, 1, Tt + sup(V('n')), 't')} = ${frac(1, ms('n + 1'))}, ${V('b')}${B.kit.hs.sub(V('n'))} = ${evl(MINUS + frac(1, X), 1, 'n')} = 1 ${MINUS} ${frac(1, V('n'))}이다. ${frac(1, ms('n+1'))} ${MINUS} ${frac(1, V('n'))}의 합은 서로 지워져 ${frac(1, Nn + 1)} ${MINUS} 1이 남고, 1을 ${Nn}번 더하므로 ${iq(v)}이다.`,
        facts: { value: `${Nn}+1/(${Nn}+1)-1` } });
    }, { standard: S2 }),
    T('sdef-sec', 'sec x = t로 치환한 정적분', '②7', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 3), b = d.int(1, 4), v = qadd(Q(7 * a, 3), Q(3 * b, 2));
        if (!close(qn(v), simpson((x) => (a * sec(x) ** 3 + b * sec(x) ** 2) * Math.tan(x), 0, PI / 3))) throw new Error('sdef-sec 셈');
        return pos(`${jh(dfi(0, frac('π', 3), `(${K1(a)}${sc(null, 3)} + ${K1(b)}${sc(null, 2)})${tn()}`), '의/의')} 값은?`, v, {
          explain: `(${K1(a)}${sc(null, 2)} + ${K1(b)}${sc()})${sc()}${jh(tn(), '으로/로')} 보고 ${sc()} = ${jh(Tt, '으로/로')} 놓으면 ${sc()}${tn()} = ${frac(V('d') + Tt, V('d') + X)}이고 ${jh(Tt, '은/는')} 1부터 2까지이므로 ${dfi(1, 2, `(${K1(a)}${Tt}${sup(2)} + ${K1(b)}${Tt})`, 't')} = ${iq(v)}이다.`,
          facts: { value: `${a}*(2**3-1)/3+${b}*(2**2-1)/2` } });
      }
      const k = d.int(1, 6), v = Q(4 * k, 3);
      if (!close(qn(v), simpson((x) => k * sec(x) * Math.tan(x) ** 3, 0, PI / 3))) throw new Error('sdef-sec 셈 2');
      return pos(`${jh(dfi(0, frac('π', 3), K1(k) + sc() + tn(null, 3)), '의/의')} 값은?`, v, {
        explain: `${is(tn(null, 2), `${sc(null, 2)} ${MINUS} 1`)}이므로 ${K1(k)}${sc()}${tn()}(${sc(null, 2)} ${MINUS} 1)로 보고 ${sc()} = ${jh(Tt, '으로/로')} 놓으면 ${K1(k)}${dfi(1, 2, `(${Tt}${sup(2)} ${MINUS} 1)`, 't')} = ${iq(v)}이다.`,
        facts: { value: `${k}*((2**3-1)/3-(2-1))` } });
    }, { count: 2, standard: S2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 부분적분법
  // ════════════════════════════════════════════════════════════════
  const parts = [
    T('part-exp', '다항식×지수함수의 부분적분', '②8', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 3), p = nzi(d, -4, 4), E = a === 1 ? ePow('x') : ePow(a + 'x'), F = (x) => ((x + p) / a - 1 / (a * a)) * EE ** (a * x);
        const form = (c, inner) => plusC(sumH([[c, `(${inner})${E}`]]));
        const right = form(Q(1, a * a), lin(a, a * p - 1));
        return chooseF(d, `${jh(ind(`(${lin(1, p)})${E}`), '은/는')}? ${CN}`, (x) => (x + p) * EE ** (a * x), [right, F], [
          [form(Q(1, a * a), lin(a, a * p + 1)), (x) => (a * x + a * p + 1) / (a * a) * EE ** (a * x)], [form(Q(1, a), lin(1, p)), (x) => (x + p) / a * EE ** (a * x)],
          [form(1, lin(1, p - 1)), (x) => (x + p - 1) * EE ** (a * x)], [form(Q(1, a * a), lin(a, a * p - a)), (x) => (a * x + a * p - a) / (a * a) * EE ** (a * x)]
        ], [[0, 0.5], [-1, 0.5]], { explain: `${is(FX, lin(1, p))}, ${jh(is(V('g') + '′(' + X + ')', E), '으로/로')} 놓으면 ${frac(1, a)}(${lin(1, p)})${E} ${MINUS} ${frac(1, a)}${ind(E)}이고 정리하면 ${right}이다.` });
      }
      // 접선의 기울기 x e^{ax}, 점 (1/a, c) → f(0) = c − 1/a²
      const a = d.int(2, 3), c = nzi(d, -5, 5), v = qsub(c, Q(1, a * a));
      if (!close(qn(v), c - simpson((x) => x * EE ** (a * x), 0, 1 / a))) throw new Error('part-exp 셈');
      return num(`곡선 ${is(V('y'), FX)} 위의 점 (${X}, ${V('y')})에서의 접선의 기울기가 ${X}${ePow(a + 'x')}이고 이 곡선이 점 (${frac(1, a)}, ${iq(c)})를 지날 때, ${jh(fx('f', 0), '의/의')} 값은?`, v, {
        explain: `${is(FX, plusC(`${frac(1, a)}${X}${ePow(a + 'x')} ${MINUS} ${frac(1, a * a)}${ePow(a + 'x')}`))}이다. ${is(X, frac(1, a))}이면 두 항이 지워져 ${is(Cc, c)}이므로 ${fx('f', 0)} = ${MINUS}${frac(1, a * a)} + ${pf(c)} = ${iq(v)}이다.`,
        facts: { value: `${J(c)}-1/${a}**2` } });
    }, { count: 2, standard: S3 }),
    T('part-param', '문자 계수가 든 부분적분과 조건 둘로 상수 구하기', '②9', (d) => {
      const m = d.int(2, 4), A = nzi(d, -6, 8), Bv = A - m * m;
      return pos(`함수 ${is(FX, ind(X + ePow(V('a') + X)))}에 대하여 ${is(fx('f', frac(1, V('a'))), A)}, ${is(fx('f', 0), Bv)}일 때, 양수 ${jh(V('a'), '의/의')} 값은?`, Q(1, m), {
        explain: `${is(FX, plusC(`${frac(1, V('a'))}(${X} ${MINUS} ${frac(1, V('a'))})${ePow(V('a') + X)}`))}이다. ${is(fx('f', frac(1, V('a'))), Cc)} = ${iq(A)}이고 ${is(fx('f', 0), `${MINUS}${frac(1, V('a') + sup(2))} + ${pf(A)}`)} = ${iq(Bv)}이므로 ${is(V('a') + sup(2), frac(1, m * m))}, ${is(V('a'), frac(1, m))}이다.`,
        facts: { value: `1/(${J(A)}-${J(Bv)})**(1/2)` } });
    }, { standard: S3 }),
    T('part-trig', '다항식×삼각함수의 부분적분', '②10', (d, n) => {
      const p = nzi(d, -4, 4), k = n === 0 ? 1 : d.int(2, 4), arg = k === 1 ? 'x' : k + 'x', useSin = n === 0 ? d.bool() : false;
      const S = (x) => Math.sin(k * x), Cn = (x) => Math.cos(k * x), P = lin(1, p);
      if (useSin) {
        return chooseF(d, `${jh(ind(`(${P})${sn(arg)}`), '은/는')}? ${CN}`, (x) => (x + p) * S(x), [plusC(`${MINUS}(${P})${cs(arg)} + ${sn(arg)}`), (x) => -(x + p) * Cn(x) + S(x)], [
          [plusC(`(${P})${cs(arg)} + ${sn(arg)}`), (x) => (x + p) * Cn(x) + S(x)], [plusC(`${MINUS}(${P})${cs(arg)} ${MINUS} ${sn(arg)}`), (x) => -(x + p) * Cn(x) - S(x)],
          [plusC(`${MINUS}(${P})${cs(arg)}`), (x) => -(x + p) * Cn(x)], [plusC(`(${P})${sn(arg)} + ${cs(arg)}`), (x) => (x + p) * S(x) + Cn(x)]
        ], [[0, 1], [1, 2.5]], { explain: `${is(FX, P)}, ${jh(is(V('g') + '′(' + X + ')', sn()), '으로/로')} 놓으면 ${MINUS}(${P})${cs()} + ${ind(cs())}이므로 ${plusC(`${MINUS}(${P})${cs()} + ${sn()}`)}이다.` });
      }
      const right = plusC(`${frac(1, k)}(${P})${sn(arg)} + ${frac(1, k * k)}${cs(arg)}`);
      return chooseF(d, `${jh(ind(`(${P})${cs(arg)}`), '은/는')}? ${CN}`, (x) => (x + p) * Cn(x), [k === 1 ? plusC(`(${P})${sn()} + ${cs()}`) : right, (x) => (x + p) * S(x) / k + Cn(x) / (k * k)], [
        [k === 1 ? plusC(`(${P})${sn()} ${MINUS} ${cs()}`) : plusC(`${frac(1, k)}(${P})${sn(arg)} ${MINUS} ${frac(1, k * k)}${cs(arg)}`), (x) => (x + p) * S(x) / k - Cn(x) / (k * k)],
        [k === 1 ? plusC(`(${P})${sn()}`) : plusC(`${frac(1, k)}(${P})${sn(arg)} + ${frac(1, k)}${cs(arg)}`), (x) => (x + p) * S(x) / k + (k === 1 ? 0 : Cn(x) / k)],
        [k === 1 ? plusC(`${MINUS}(${P})${sn()} + ${cs()}`) : plusC(`${k}(${P})${sn(arg)} + ${k * k}${cs(arg)}`), (x) => (k === 1 ? -(x + p) * S(x) + Cn(x) : k * (x + p) * S(x) + k * k * Cn(x))],
        [k === 1 ? plusC(`(${P})${cs()} + ${sn()}`) : plusC(`${frac(1, k)}(${P})${cs(arg)} + ${frac(1, k * k)}${sn(arg)}`), (x) => (k === 1 ? (x + p) * Cn(x) + S(x) : (x + p) * Cn(x) / k + S(x) / (k * k))]
      ], [[0, 1], [1, 2.5]], { explain: `${is(FX, P)}, ${jh(is(V('g') + '′(' + X + ')', cs(arg)), '으로/로')} 놓으면 ${is(V('g') + '(' + X + ')', (k === 1 ? '' : frac(1, k)) + sn(arg))}이므로 ${k === 1 ? `(${P})${sn()} ${MINUS} ${ind(sn())}` : `${frac(1, k)}(${P})${sn(arg)} ${MINUS} ${frac(1, k)}${ind(sn(arg))}`}에서 ${k === 1 ? plusC(`(${P})${sn()} + ${cs()}`) : right}이다.` });
    }, { count: 2, standard: S3 }),
    T('part-log', '로그함수가 든 부분적분 — ln을 미분하는 쪽으로', '②11', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 3);
        if (kind === 3) {
          // ∫√x ln x dx = (2/3)x√x ln x − (4/9)x√x
          const xr = X + rt(X);
          return chooseF(d, `${jh(ind(rt(X) + ln('x')), '은/는')}? ${CN}`, (x) => SQ(x) * LN(x), [plusC(sumH([[Q(2, 3), xr + ln('x')], [Q(-4, 9), xr]])), (x) => 2 / 3 * x ** 1.5 * LN(x) - 4 / 9 * x ** 1.5], [
            [plusC(sumH([[Q(2, 3), xr + ln('x')], [Q(-2, 3), xr]])), (x) => 2 / 3 * x ** 1.5 * (LN(x) - 1)], [plusC(sumH([[Q(2, 3), xr + ln('x')], [Q(4, 9), xr]])), (x) => 2 / 3 * x ** 1.5 * LN(x) + 4 / 9 * x ** 1.5],
            [plusC(sumH([[Q(3, 2), xr + ln('x')], [Q(-9, 4), xr]])), (x) => 1.5 * x ** 1.5 * LN(x) - 2.25 * x ** 1.5], [plusC(sumH([[Q(1, 2), frac(ln('x'), rt(X))]])), (x) => LN(x) / (2 * SQ(x))]
          ], [[1, 2], [0.5, 3]], { explain: `${is(FX, ln('x'))}, ${jh(is(V('g') + '′(' + X + ')', rt(X)), '으로/로')} 놓으면 ${is(V('g') + '(' + X + ')', frac(2, 3) + xr)}이므로 ${frac(2, 3)}${xr}${ln('x')} ${MINUS} ${frac(2, 3)}${ind(rt(X))}에서 정답이다.` });
        }
        const k = kind;                                                                     // ∫xᵏ ln x dx (k = 0, 1, 2)
        const xk = k === 0 ? '' : k === 1 ? X : X + sup(k), xk1 = k === 0 ? X : X + sup(k + 1), F = (x) => x ** (k + 1) * LN(x) / (k + 1) - x ** (k + 1) / (k + 1) ** 2;
        const c1 = Q(1, k + 1), c2 = Q(-1, (k + 1) ** 2);
        return chooseF(d, `${jh(ind(xk + ln('x')), '은/는')}? ${CN}`, (x) => x ** k * LN(x), [plusC(sumH([[c1, xk1 + ln('x')], [c2, xk1]])), F], [
          [plusC(sumH([[c1, xk1 + ln('x')], [qmul(c2, -1), xk1]])), (x) => x ** (k + 1) * LN(x) / (k + 1) + x ** (k + 1) / (k + 1) ** 2],
          [plusC(sumH([[c1, xk1 + ln('x')], [Q(-1, k + 1), xk1]])), (x) => x ** (k + 1) * (LN(x) - 1) / (k + 1)],
          [plusC(sumH([[c1, xk1 + ln('x')]])), (x) => x ** (k + 1) * LN(x) / (k + 1)],
          [plusC(sumH([[k === 0 ? 1 : k, (k <= 1 ? '' : k === 2 ? X : X + sup(k - 1)) + ln('x')], [1, xk]])), (x) => (k === 0 ? LN(x) + 1 : k * x ** (k - 1) * LN(x) + x ** k)]
        ], [[1, 2], [0.5, 3]], { explain: `${is(FX, ln('x'))}, ${jh(is(V('g') + '′(' + X + ')', xk || '1'), '으로/로')} 놓으면 ${is(V('g') + '(' + X + ')', (k === 0 ? '' : frac(1, k + 1)) + xk1)}이므로 ${(k === 0 ? '' : frac(1, k + 1))}${xk1}${ln('x')} ${MINUS} ${ind(k === 0 ? '1' : frac(1, k + 1) + (k === 1 ? X : X + sup(k)))}이다.` });
      }
      if (n === 1) {
        const kind = d.bool(), a = d.int(1, 3);
        if (kind) {
          const arg = `(${X} + ${a})`, L = ln(arg);
          return chooseF(d, `${jh(ind(L), '은/는')}? ${CN}`, (x) => LN(x + a), [plusC(`${arg}${L} ${MINUS} ${X}`), (x) => (x + a) * LN(x + a) - x], [
            [plusC(`${X}${L} ${MINUS} ${X}`), (x) => x * LN(x + a) - x], [plusC(`${arg}${L} + ${X}`), (x) => (x + a) * LN(x + a) + x], [plusC(frac(1, arg)), (x) => 1 / (x + a)], [plusC(`${arg}${L}`), (x) => (x + a) * LN(x + a)]
          ], [[0, 1], [1, 3]], { explain: `${is(FX, L)}, ${jh(is(V('g') + '′(' + X + ')', 1), '으로/로')} 놓으면 ${X}${L} ${MINUS} ${ind(frac(X, `${X} + ${a}`))}이고 ${frac(X, `${X} + ${a}`)} = 1 ${MINUS} ${frac(a, `${X} + ${a}`)}이므로 ${plusC(`${arg}${L} ${MINUS} ${X}`)}이다.` });
        }
        const P = lin(1, a), F = (x) => (x * x / 2 + a * x) * LN(x) - x * x / 4 - a * x, G = `(${sumH([[Q(1, 2), X + sup(2)], [a, X]])})`;
        return chooseF(d, `${jh(ind(`(${P})${ln('x')}`), '은/는')}? ${CN}`, (x) => (x + a) * LN(x), [plusC(`${G}${ln('x')} ${MINUS} ${sumH([[Q(1, 4), X + sup(2)], [a, X]])}`), F], [
          [plusC(`${G}${ln('x')} + ${sumH([[Q(1, 4), X + sup(2)], [a, X]])}`), (x) => (x * x / 2 + a * x) * LN(x) + x * x / 4 + a * x], [plusC(`${G}${ln('x')} ${MINUS} ${sumH([[Q(1, 2), X + sup(2)], [a, X]])}`), (x) => (x * x / 2 + a * x) * (LN(x) - 1)],
          [plusC(`${G}${ln('x')}`), (x) => (x * x / 2 + a * x) * LN(x)], [plusC(`(${P})(${X}${ln('x')} ${MINUS} ${X})`), (x) => (x + a) * (x * LN(x) - x)]
        ], [[1, 2], [0.5, 3]], { explain: `${is(FX, ln('x'))}, ${jh(is(V('g') + '′(' + X + ')', P), '으로/로')} 놓으면 ${G}${ln('x')} ${MINUS} ${ind(`(${frac(1, 2)}${X} + ${a})`)}이므로 정답이다.` });
      }
      // f(x) = ∫ln(x + a)dx, f(1 − a) = c → f(e − a) = c + 1 (a 는 문자 그대로 — 값과 상관없다. 수치 확인은 a 를 몇 개 넣어 본다)
      const c = nzi(d, -6, 6), v = c + 1, A = V('a'), arg = `(${X} + ${A})`;
      for (const a of [-1, 2, 3.5]) if (!close(v, c + simpson((x) => LN(x + a), 1 - a, EE - a))) throw new Error('part-log 셈');
      return num(`상수 ${jh(A, '에/에')} 대하여 ${is(FX, ind(ln(arg)))}이고 ${is(fx('f', `1 ${MINUS} ${A}`), c)}일 때, ${jh(fx('f', `${EV} ${MINUS} ${A}`), '의/의')} 값은?`, v, {
        explain: `${is(FX, plusC(`${arg}${ln(arg)} ${MINUS} ${X}`))}이다. ${fx('f', `1 ${MINUS} ${A}`)} = 1 × ${ln(1)} ${MINUS} (1 ${MINUS} ${A}) + ${Cc} = ${jh(iq(c), '이고/이고')} ${fx('f', `${EV} ${MINUS} ${A}`)} = ${EV} × ${ln(EV)} ${MINUS} (${EV} ${MINUS} ${A}) + ${Cc} = ${A} + ${Cc}이므로 ${iq(c)} + 1 = ${iq(v)}이다.`,
        facts: { value: `${J(c)}+1` } });
    }, { count: 3, standard: S3 }),
    T('part-twice', '부분적분을 두 번 하기', '②12', (d, n) => {
      if (n === 0) {
        const useSin = d.bool(), k = d.int(1, 3), K = K1(k);
        if (useSin) return chooseF(d, `${jh(ind(K + X + sup(2) + sn()), '은/는')}? ${CN}`, (x) => k * x * x * Math.sin(x), [plusC(sumH([[-k, X + sup(2) + cs()], [2 * k, X + sn()], [2 * k, cs()]])), (x) => k * (-x * x * Math.cos(x) + 2 * x * Math.sin(x) + 2 * Math.cos(x))], [
          [plusC(sumH([[-k, X + sup(2) + cs()], [2 * k, X + sn()], [-2 * k, cs()]])), (x) => k * (-x * x * Math.cos(x) + 2 * x * Math.sin(x) - 2 * Math.cos(x))], [plusC(sumH([[-k, X + sup(2) + cs()], [2 * k, X + sn()]])), (x) => k * (-x * x * Math.cos(x) + 2 * x * Math.sin(x))],
          [plusC(sumH([[k, X + sup(2) + cs()], [-2 * k, X + sn()], [-2 * k, cs()]])), (x) => k * (x * x * Math.cos(x) - 2 * x * Math.sin(x) - 2 * Math.cos(x))], [plusC(sumH([[-k, X + sup(2) + cs()], [-2 * k, X + sn()], [2 * k, cs()]])), (x) => k * (-x * x * Math.cos(x) - 2 * x * Math.sin(x) + 2 * Math.cos(x))]
        ], [[0, 1], [1, 2.5]], { explain: `${is(FX, X + sup(2))}, ${jh(is(V('g') + '′(' + X + ')', sn()), '으로/로')} 놓으면 ${MINUS}${X}${sup(2)}${cs()} + 2${ind(X + cs())}이고, ${jh(is(ind(X + cs()), plusC(`${X}${sn()} + ${cs()}`)), '을/를')} 넣으면 정답이다.` });
        return chooseF(d, `${jh(ind(K + X + sup(2) + cs()), '은/는')}? ${CN}`, (x) => k * x * x * Math.cos(x), [plusC(sumH([[k, X + sup(2) + sn()], [2 * k, X + cs()], [-2 * k, sn()]])), (x) => k * (x * x * Math.sin(x) + 2 * x * Math.cos(x) - 2 * Math.sin(x))], [
          [plusC(sumH([[k, X + sup(2) + sn()], [2 * k, X + cs()], [2 * k, sn()]])), (x) => k * (x * x * Math.sin(x) + 2 * x * Math.cos(x) + 2 * Math.sin(x))], [plusC(sumH([[k, X + sup(2) + sn()], [-2 * k, X + cs()], [-2 * k, sn()]])), (x) => k * (x * x * Math.sin(x) - 2 * x * Math.cos(x) - 2 * Math.sin(x))],
          [plusC(sumH([[k, X + sup(2) + sn()], [2 * k, X + cs()]])), (x) => k * (x * x * Math.sin(x) + 2 * x * Math.cos(x))], [plusC(sumH([[-k, X + sup(2) + sn()], [2 * k, X + cs()], [-2 * k, sn()]])), (x) => k * (-x * x * Math.sin(x) + 2 * x * Math.cos(x) - 2 * Math.sin(x))]
        ], [[0, 1], [1, 2.5]], { explain: `${is(FX, X + sup(2))}, ${jh(is(V('g') + '′(' + X + ')', cs()), '으로/로')} 놓으면 ${X}${sup(2)}${sn()} ${MINUS} 2${ind(X + sn())}이고, ${jh(is(ind(X + sn()), plusC(`${MINUS}${X}${cs()} + ${sn()}`)), '을/를')} 넣으면 정답이다.` });
      }
      if (n === 1) {
        if (d.bool()) {
          const k = d.int(1, 3), K = K1(k), E = ePow('x');
          return chooseF(d, `${jh(ind(K + X + sup(2) + E), '은/는')}? ${CN}`, (x) => k * x * x * EE ** x, [plusC(K + `(${MQ2([[1, X + sup(2)], [-2, X], [2, '']])})${E}`), (x) => k * (x * x - 2 * x + 2) * EE ** x], [
            [plusC(K + `(${MQ2([[1, X + sup(2)], [2, X], [2, '']])})${E}`), (x) => k * (x * x + 2 * x + 2) * EE ** x], [plusC(K + `(${MQ2([[1, X + sup(2)], [-2, X]])})${E}`), (x) => k * (x * x - 2 * x) * EE ** x],
            [plusC(K + `(${MQ2([[1, X + sup(2)], [-2, X], [-2, '']])})${E}`), (x) => k * (x * x - 2 * x - 2) * EE ** x], [plusC(frac(k, 3) + X + sup(3) + E), (x) => k * x ** 3 * EE ** x / 3]
          ], [[0, 1], [-1, 0.5]], { explain: `${is(FX, X + sup(2))}, ${jh(is(V('g') + '′(' + X + ')', E), '으로/로')} 놓으면 ${X}${sup(2)}${E} ${MINUS} 2${ind(X + E)}이고 ${is(ind(X + E), plusC(`(${X} ${MINUS} 1)${E}`))}이므로 정답이다.` });
        }
        const L = ln('x'), L2 = `(${L})${sup(2)}`;
        return chooseF(d, `${jh(ind(L2), '은/는')}? (단, ${ms('x > 0')}이고 ${jh(Cc, '은/는')} 적분상수이다.)`, (x) => LN(x) ** 2, [plusC(`${X}{${L2} ${MINUS} 2${L} + 2}`), (x) => x * (LN(x) ** 2 - 2 * LN(x) + 2)], [
          [plusC(`${X}{${L2} + 2${L} + 2}`), (x) => x * (LN(x) ** 2 + 2 * LN(x) + 2)], [plusC(`${X}{${L2} ${MINUS} 2${L}}`), (x) => x * (LN(x) ** 2 - 2 * LN(x))], [plusC(frac(1, 3) + `(${L})${sup(3)}`), (x) => LN(x) ** 3 / 3], [plusC(`${X}${L2} ${MINUS} 2${X}`), (x) => x * LN(x) ** 2 - 2 * x]
        ], [[1, 2], [0.5, 3]], { explain: `${is(FX, L2)}, ${jh(is(V('g') + '′(' + X + ')', 1), '으로/로')} 놓으면 ${X}${L2} ${MINUS} 2${ind(L)}이고 ${is(ind(L), plusC(`${X}${L} ${MINUS} ${X}`))}이므로 정답이다.` });
      }
      // 원점을 지나는 곡선, 기울기 x²cos x(또는 x²sin x), 점 (π, a)
      const useSin = d.bool(), g = useSin ? (x) => x * x * Math.sin(x) : (x) => x * x * Math.cos(x), v = simpson(g, 0, PI);
      const right = useSin ? [sumH([[1, 'π' + sup(2)], [-4, '']]), PI * PI - 4] : [MINUS + '2π', -2 * PI];
      const wr = [[MINUS + '2π', -2 * PI], ['2π', 2 * PI], [sumH([[1, 'π' + sup(2)], [-4, '']]), PI * PI - 4], [sumH([[1, 'π' + sup(2)], [4, '']]), PI * PI + 4], ['π' + sup(2), PI * PI], [MINUS + 'π', -PI]];
      return chooseV(d, `원점을 지나는 곡선 ${is(V('y'), FX)} 위의 점 (${X}, ${V('y')})에서의 접선의 기울기가 ${X}${sup(2)}${useSin ? sn() : cs()}이다. 이 곡선이 점 (π, ${V('a')})를 지날 때, 실수 ${jh(V('a'), '의/의')} 값은?`, right, wr, v, {
        explain: useSin ? `${is(FX, `${MINUS}${X}${sup(2)}${cs()} + 2${X}${sn()} + 2${cs()} + ${Cc}`)}이고 ${is(fx('f', 0), `2 + ${Cc}`)} = 0에서 ${is(Cc, MINUS + '2')}이므로 ${is(fx('f', 'π'), right[0])}이다.`
          : `${is(FX, `${X}${sup(2)}${sn()} + 2${X}${cs()} ${MINUS} 2${sn()} + ${Cc}`)}이고 원점을 지나므로 ${is(Cc, 0)}이다. ${is(fx('f', 'π'), MINUS + '2π')}이다.` });
    }, { count: 3, standard: S3 }),
    T('part-cycle', '같은 적분이 되돌아오는 부분적분 — eˣsin x, eˣcos x', '②13', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, -1, 2]), useSin = d.bool(), E = a === 1 ? ePow('x') : ePow(a === -1 ? '-x' : '2x'), den = a * a + 1;
        const F = useSin ? (x) => EE ** (a * x) * (a * Math.sin(x) - Math.cos(x)) / den : (x) => EE ** (a * x) * (Math.sin(x) + a * Math.cos(x)) / den;
        const body = useSin ? E + sn() : E + cs();
        const fm = (c1, s1, c2, s2) => plusC(`${frac(1, den)}${E}(${sumH([[c1, s1], [c2, s2]])})`);
        const right = useSin ? fm(a, sn(), -1, cs()) : fm(1, sn(), a, cs());
        const G = (s1, s2, c) => (x) => EE ** (a * x) * (s1 * Math.sin(x) + s2 * Math.cos(x)) / c;
        const wr = useSin ? [[fm(a, sn(), 1, cs()), G(a, 1, den)], [fm(-a, sn(), -1, cs()), G(-a, -1, den)], [plusC(`${E}(${sumH([[a, sn()], [-1, cs()]])})`), G(a, -1, 1)], [fm(1, sn(), -a, cs()), G(1, -a, den)]]
          : [[fm(1, sn(), -a, cs()), G(1, -a, den)], [fm(-1, sn(), a, cs()), G(-1, a, den)], [plusC(`${E}(${sumH([[1, sn()], [a, cs()]])})`), G(1, a, 1)], [fm(a, sn(), 1, cs()), G(a, 1, den)]];
        return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => EE ** (a * x) * (useSin ? Math.sin(x) : Math.cos(x)), [right, F], wr, [[0, 1], [1, 2]], {
          explain: `부분적분을 두 번 하되 두 번 모두 지수함수 쪽을 적분하는 쪽으로 놓으면 처음 적분이 다시 나온다. 그것을 이항하여 ${jh(den, '으로/로')} 나누면 ${right}이다.` });
      }
      return claimQ(d, `다음은 부정적분 ${jh(ind(ePow('x') + cs()), '을/를')} 부분적분법으로 구하는 과정에 대한 설명이다. 옳은 것은?`, [
        `${is(FX, ePow('x'))}, ${jh(is(V('g') + '′(' + X + ')', cs()), '으로/로')} 놓으면 ${ePow('x')}${sn()} ${MINUS} ${jh(ind(ePow('x') + sn()), '이/가')} 된다.`,
        `두 번째 부분적분에서도 ${jh(ePow('x'), '을/를')} 미분하는 쪽으로 놓으면 처음 적분이 다시 나와 이항하여 구할 수 있다.`,
        `${is(ind(ePow('x') + cs()), plusC(`${frac(1, 2)}${ePow('x')}(${sn()} + ${cs()})`))}이다.`
      ], [
        [`두 번째 부분적분에서 ${jh(sn(), '을/를')} 미분하는 쪽으로 바꾸어 놓아도 구할 수 있다.`, `바꾸어 놓으면 ${jh(is(ind(ePow('x') + cs()), ind(ePow('x') + cs())), '이/가')} 되어 구할 수 없다.`, `두 번째 부분적분에서도 ${jh(ePow('x'), '을/를')} 미분하는 쪽으로 놓으면 처음 적분이 다시 나와 이항하여 구할 수 있다.`],
        [`${is(ind(ePow('x') + cs()), plusC(`${ePow('x')}(${sn()} + ${cs()})`))}이다.`, `이항하면 2${ind(ePow('x') + cs())} = ${ePow('x')}(${sn()} + ${cs()})이므로 ${jh(frac(1, 2), '을/를')} 곱해야 한다.`, `${is(ind(ePow('x') + cs()), plusC(`${frac(1, 2)}${ePow('x')}(${sn()} + ${cs()})`))}이다.`],
        [`부분적분을 한 번만 하면 구할 수 있다.`, `한 번 하면 ${jh(ind(ePow('x') + sn()), '이/가')} 남아 한 번 더 해야 한다.`, ''],
        [`${is(ind(ePow('x') + cs()), plusC(`${frac(1, 2)}${ePow('x')}(${sn()} ${MINUS} ${cs()})`))}이다.`, `${frac(1, 2)}${ePow('x')}(${sn()} ${MINUS} ${cs()})는 ${jh(ind(ePow('x') + sn()), '이다/이다')}.`, `${is(ind(ePow('x') + cs()), plusC(`${frac(1, 2)}${ePow('x')}(${sn()} + ${cs()})`))}이다.`]
      ], true);
    }, { count: 2, standard: S3 }),
    T('part-twoways', '부분적분에서 같은 적분이 상수배로 되돌아올 때 이항하기', '②14', (d) => {
      const k = d.int(2, 4), L = ln('x'), body = frac(`(${L})${sup(k)}`, X), F = (x) => LN(x) ** (k + 1) / (k + 1);
      return chooseF(d, `${is(FX, `(${L})${sup(k)}`)}, ${jh(is(V('g') + '′(' + X + ')', frac(1, X)), '으로/로')} 놓고 부분적분법을 쓰면 ${is(ind(body), `(${L})${sup(k + 1)} ${MINUS} ${k}${ind(body)}`)}이다. 이를 이용하여 구한 ${jh(ind(body), '은/는')}? (단, ${ms('x > 0')}이고 ${jh(Cc, '은/는')} 적분상수이다.)`,
        (x) => LN(x) ** k / x, [plusC(frac(1, k + 1) + `(${L})${sup(k + 1)}`), F], [
          [plusC(frac(1, k) + `(${L})${sup(k + 1)}`), (x) => LN(x) ** (k + 1) / k], [plusC(`(${L})${sup(k + 1)}`), (x) => LN(x) ** (k + 1)], [plusC((k === 2 ? '' : frac(1, k - 1)) + `(${L})${sup(k + 1)}`), (x) => LN(x) ** (k + 1) / (k - 1)], [plusC(frac(k, k + 1) + `(${L})${sup(k + 1)}`), (x) => k * LN(x) ** (k + 1) / (k + 1)]
        ], [[1, 2], [1.5, 3]], { explain: `오른쪽의 ${jh(ind(body), '을/를')} 왼쪽으로 옮기면 ${k + 1}${ind(body)} = (${L})${sup(k + 1)}이므로 ${plusC(frac(1, k + 1) + `(${L})${sup(k + 1)}`)}이다(${L} = ${jh(Tt, '으로/로')} 치환한 결과와 같다).` });
    }, { standard: S3 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 부분적분법을 이용한 정적분
  // ════════════════════════════════════════════════════════════════
  const partdef = [
    T('pdef-once', '부분적분 정적분(한 번)', '②15', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          const p = d.int(-2, 3), v = PI / 2 + p - 1;
          return chooseV(d, `${jh(dfi(0, frac('π', 2), `(${lin(1, p)})${cs()}`), '의/의')} 값은?`, [sumH([[Q(1, 2), 'π'], [p - 1, '']]), v], [
            [sumH([[Q(1, 2), 'π'], [p + 1, '']]), v + 2], [sumH([[Q(1, 2), 'π'], [p, '']]), v + 1], [sumH([[Q(-1, 2), 'π'], [1 - p, '']]), -v], [sumH([[1, 'π'], [p - 1, '']]), PI + p - 1]
          ], simpson((x) => (x + p) * Math.cos(x), 0, PI / 2), { explain: `${evl(`(${lin(1, p)})${sn()} + ${cs()}`, 0, frac('π', 2))} = (${frac('π', 2)} ${sg(p)} ${Math.abs(p)}) ${MINUS} 1이다.` });
        }
        const k = d.int(2, 4), v = PI / (k * k);
        return chooseV(d, `${jh(dfi(0, frac('π', k), X + sn(k + 'x')), '의/의')} 값은?`, [frac('π', k * k), v], [
          [frac('π', k), PI / k], [MINUS + frac('π', k * k), -v], [sumH([[Q(1, k * k), 'π'], [Q(2, k * k), '']]), (PI + 2) / (k * k)], [frac('2π', k * k), 2 * v]
        ], simpson((x) => x * Math.sin(k * x), 0, PI / k), { explain: `${evl(`${MINUS}${frac(1, k)}${X}${cs(k + 'x')} + ${frac(1, k * k)}${sn(k + 'x')}`, 0, frac('π', k))} = ${frac('π', k * k)}이다.` });
      }
      if (n === 1) {
        const k = d.int(1, 3), v = (k * EE ** (k + 1) + 1) / (k + 1) ** 2, E = (j) => (j === 1 ? EV : EV + sup(j));
        const opt = (ce, c0) => sumH([[ce, E(k + 1)], [c0, '']]);
        return chooseV(d, `${jh(dfi(1, ms('e'), (k === 1 ? X : X + sup(k)) + ln('x')), '의/의')} 값은?`, [opt(Q(k, (k + 1) ** 2), Q(1, (k + 1) ** 2)), v], [
          [opt(Q(k, (k + 1) ** 2), Q(-1, (k + 1) ** 2)), (k * EE ** (k + 1) - 1) / (k + 1) ** 2], [opt(Q(1, k + 1), 0), EE ** (k + 1) / (k + 1)], [opt(Q(k + 2, (k + 1) ** 2), Q(-1, (k + 1) ** 2)), ((k + 2) * EE ** (k + 1) - 1) / (k + 1) ** 2], [opt(Q(1, (k + 1) ** 2), Q(1, (k + 1) ** 2)), (EE ** (k + 1) + 1) / (k + 1) ** 2]
        ], simpson((x) => x ** k * LN(x), 1, EE), { explain: `${evl(`${frac(1, k + 1)}${X}${sup(k + 1)}${ln('x')} ${MINUS} ${frac(1, (k + 1) ** 2)}${X}${sup(k + 1)}`, 1, ms('e'))} = ${frac(1, k + 1)}${E(k + 1)} ${MINUS} ${frac(1, (k + 1) ** 2)}${E(k + 1)} + ${frac(1, (k + 1) ** 2)}이다.` });
      }
      if (n === 2) {
        const p = d.pick([-1, 1, 2]), v = -(p + 2) / EE + (p + 1), opt = (ce, c0) => sumH([[ce, EV, true], [c0, '']]);
        return chooseV(d, `${jh(dfi(0, 1, `(${lin(1, p)})${ePow('-x')}`), '의/의')} 값은?`, [opt(-(p + 2), p + 1), v], [
          [opt(p + 2, p + 1), (p + 2) / EE + p + 1], [opt(-(p + 1), p + 1), -(p + 1) / EE + p + 1], [opt(-(p + 2), p), -(p + 2) / EE + p], [opt(-(p + 2), p + 2), -(p + 2) / EE + p + 2]
        ], simpson((x) => (x + p) * EE ** -x, 0, 1), { explain: `${is(ind(`(${lin(1, p)})${ePow('-x')}`), plusC(`${MINUS}(${lin(1, p + 1)})${ePow('-x')}`))}이므로 ${jh(evl(`${MINUS}(${lin(1, p + 1)})${ePow('-x')}`, 0, 1), '을/를')} 셈한다.` });
      }
      // ∫(e ~ e^k) ln x/x^m dx
      const m = d.pick([2, 3]), k = d.int(2, 3), Fv = (x) => (m === 2 ? -(LN(x) + 1) / x : -(2 * LN(x) + 1) / (4 * x * x)), v = Fv(EE ** k) - Fv(EE);
      const ex = (j) => EV + (j === 1 ? '' : sup(j));
      const right = m === 2 ? [sumH([[2, ex(1), true], [-(k + 1), ex(k), true]]), v] : [sumH([[Q(3, 4), ex(2), true], [Q(-(2 * k + 1), 4), ex(2 * k), true]]), v];
      const wr = m === 2 ? [[sumH([[2, ex(1), true], [k + 1, ex(k), true]]), 2 / EE + (k + 1) / EE ** k], [sumH([[1, ex(1), true], [-k, ex(k), true]]), 1 / EE - k / EE ** k], [sumH([[-2, ex(1), true], [k + 1, ex(k), true]]), -v], [sumH([[2, ex(1), true], [-k, ex(k), true]]), 2 / EE - k / EE ** k]]
        : [[sumH([[Q(3, 4), ex(2), true], [Q(2 * k + 1, 4), ex(2 * k), true]]), 0.75 / EE ** 2 + (2 * k + 1) / (4 * EE ** (2 * k))], [sumH([[Q(1, 2), ex(2), true], [Q(-k, 2), ex(2 * k), true]]), 0.5 / EE ** 2 - k / (2 * EE ** (2 * k))], [sumH([[Q(-3, 4), ex(2), true], [Q(2 * k + 1, 4), ex(2 * k), true]]), -v], [sumH([[Q(3, 4), ex(2), true], [Q(-k, 4), ex(2 * k), true]]), 0.75 / EE ** 2 - k / (4 * EE ** (2 * k))]];
      return chooseV(d, `${jh(dfi(ms('e'), ms('e^' + k), frac(ln('x'), X + sup(m))), '의/의')} 값은?`, right, wr, simpson((x) => LN(x) / x ** m, EE, EE ** k), {
        explain: `${is(FX, ln('x'))}, ${jh(is(V('g') + '′(' + X + ')', frac(1, X + sup(m))), '으로/로')} 놓으면 ${is(V('g') + '(' + X + ')', MINUS + frac(1, (m === 2 ? '' : '2') + X + (m === 2 ? '' : sup(m - 1))))}이므로 ${jh(evl(m === 2 ? MINUS + frac(`${ln('x')} + 1`, X) : MINUS + frac(`2${ln('x')} + 1`, '4' + X + sup(2)), ms('e'), ms('e^' + k)), '을/를')} 셈한다.` });
    }, { count: 4, standard: S3 }),
    T('pdef-twice', '부분적분 정적분(두 번)', '②16', (d, n) => {
      if (n === 0) {
        const useSin = d.bool();
        if (useSin) return chooseV(d, `${jh(dfi(0, frac('π', 2), X + sup(2) + sn()), '의/의')} 값은?`, ['π ' + MINUS + ' 2', PI - 2], [
          ['π + 2', PI + 2], ['π', PI], [sumH([[Q(1, 4), 'π' + sup(2)], [-2, '']]), PI * PI / 4 - 2], ['2 ' + MINUS + ' π', 2 - PI]
        ], simpson((x) => x * x * Math.sin(x), 0, PI / 2), { explain: `${evl(`${MINUS}${X}${sup(2)}${cs()} + 2${X}${sn()} + 2${cs()}`, 0, frac('π', 2))} = π ${MINUS} 2이다.` });
        return chooseV(d, `${jh(dfi(0, frac('π', 2), X + sup(2) + cs()), '의/의')} 값은?`, [sumH([[Q(1, 4), 'π' + sup(2)], [-2, '']]), PI * PI / 4 - 2], [
          [sumH([[Q(1, 4), 'π' + sup(2)], [2, '']]), PI * PI / 4 + 2], ['π ' + MINUS + ' 2', PI - 2], [sumH([[Q(1, 4), 'π' + sup(2)]]), PI * PI / 4], [sumH([[Q(1, 4), 'π' + sup(2)], [-1, 'π']]), PI * PI / 4 - PI]
        ], simpson((x) => x * x * Math.cos(x), 0, PI / 2), { explain: `${evl(`${X}${sup(2)}${sn()} + 2${X}${cs()} ${MINUS} 2${sn()}`, 0, frac('π', 2))} = ${frac('π' + sup(2), 4)} ${MINUS} 2이다.` });
      }
      if (d.bool()) {
        const a = d.int(1, 2), b = a + 1, F = (x) => (x * x - 2 * x + 2) * EE ** x, v = F(b) - F(a);
        const ex = (j) => (j === 1 ? EV : EV + sup(j)), opt = (cb, ca) => sumH([[cb, ex(b)], [ca, ex(a)]]);
        return chooseV(d, `${jh(dfi(a, b, X + sup(2) + ePow('x')), '의/의')} 값은?`, [opt(b * b - 2 * b + 2, -(a * a - 2 * a + 2)), v], [
          [opt(b * b, -(a * a)), (b * b) * EE ** b - a * a * EE ** a], [opt(b * b - 2 * b, -(a * a - 2 * a)), (b * b - 2 * b) * EE ** b - (a * a - 2 * a) * EE ** a], [opt(b * b + 2 * b + 2, -(a * a + 2 * a + 2)), (b * b + 2 * b + 2) * EE ** b - (a * a + 2 * a + 2) * EE ** a], [opt(b * b - 2 * b + 2, a * a - 2 * a + 2), F(b) + F(a)]
        ], simpson((x) => x * x * EE ** x, a, b), { explain: `${is(ind(X + sup(2) + ePow('x')), plusC(`(${MQ2([[1, X + sup(2)], [-2, X], [2, '']])})${ePow('x')}`))}이므로 ${jh(evl(`(${MQ2([[1, X + sup(2)], [-2, X], [2, '']])})${ePow('x')}`, a, b), '을/를')} 셈한다.` });
      }
      const v = (5 * EE ** 3 - 2) / 27, opt = (c3, c0) => sumH([[c3, EV + sup(3)], [c0, '']]);
      return chooseV(d, `${jh(dfi(1, ms('e'), `(${X}${ln('x')})${sup(2)}`), '의/의')} 값은?`, [opt(Q(5, 27), Q(-2, 27)), v], [
        [opt(Q(5, 27), Q(2, 27)), (5 * EE ** 3 + 2) / 27], [opt(Q(1, 3), 0), EE ** 3 / 3], [opt(Q(2, 9), Q(1, 9)), (2 * EE ** 3 + 1) / 9], [opt(Q(1, 9), Q(-2, 27)), EE ** 3 / 9 - 2 / 27]
      ], simpson((x) => (x * LN(x)) ** 2, 1, EE), { explain: `${is(FX, `(${ln('x')})${sup(2)}`)}, ${jh(is(V('g') + '′(' + X + ')', X + sup(2)), '으로/로')} 놓으면 ${frac(1, 3)}${EV}${sup(3)} ${MINUS} ${frac(2, 3)}${dfi(1, ms('e'), X + sup(2) + ln('x'))}이고 ${is(dfi(1, ms('e'), X + sup(2) + ln('x')), opt(Q(2, 9), Q(1, 9)))}이므로 정답이다.` });
    }, { count: 2, standard: S3 }),
    T('pdef-limit', '적분으로 정의된 함수의 극한과 부분적분', '②19', (d) => {
      const b = d.int(1, 3), k = d.int(1, 4), useSq = d.bool(), c0 = k * (b - 1);
      const integ = c0 === 0 ? `${k === 1 ? '' : k}${Tt}${ePow('t')}` : `(${k === 1 ? '' : k}${Tt} ${MINUS} ${c0})${ePow('t')}`;
      const fb = k * b, v = useSq ? Q(k, 2) : Q(fb, 1);                                      // f(b) = kb, 극한 = f(b)/(2b) 또는 f(b)
      if (!close(fb, simpson((t) => (k * t - c0) * EE ** t, 0, b))) throw new Error('pdef-limit 셈');
      const den = useSq ? `${X}${sup(2)} ${MINUS} ${b * b}` : `${X} ${MINUS} ${b}`;
      return pos(`함수 ${is(FX, B.kit.u56x.dfi(0, 'x', integ, 't'))}에 대하여 ${jh(B.kit.hs.lim('x→' + b, `${frac(1, den)}${dfi(b, 'x', fx('f', Tt), 't')}`), '의/의')} 값은?`, v, {
        explain: `${fx('f', Tt)}의 한 부정적분을 ${jh(fx('F', Tt), '이라/라')} 하면 극한은 ${useSq ? `${frac(1, 2 * b)}${fp('F', b)} = ${frac(fx('f', b), 2 * b)}` : `${fp('F', b)} = ${fx('f', b)}`}이다. ${fx('f', b)} = ${evl(`(${k === 1 ? '' : k}${Tt} ${MINUS} ${k * b})${ePow('t')}`, 0, b)} = ${fb}이므로 ${iq(v)}이다.`,
        facts: { value: useSq ? `${k}*${b}/(2*${b})` : `${k}*${b}` } });
    }, { standard: S3 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 여러 적분법으로 함수 구하기(기본)
  // ════════════════════════════════════════════════════════════════
  const apply = [
    T('app-ext', '극값·최솟값으로 적분상수 정하기 — 기본 적분·치환', '②20', (d, n) => {
      if (n === 0) {
        const k = d.int(1, 3), c = d.int(-3, 4), K = K1(k), given = c === 0 ? `${MINUS}${K}${rt('2')}` : `${iq(c)} ${MINUS} ${K}${rt('2')}`;
        if (!close(c - k, (c - k * SQ(2)) + simpson((x) => k * (Math.sin(x) - Math.cos(x)), PI / 4, PI / 2))) throw new Error('app-ext 셈');
        return num(`${ms('0 < x < π')}에서 정의된 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), `${K}(${sn()} ${MINUS} ${cs()})`)}이고 ${jh(FX, '의/의')} 극솟값이 ${jh(given, '일/일')} 때, ${jh(fx('f', frac('π', 2)), '의/의')} 값은?`, c - k, {
          explain: `${is(FX, plusC(`${MINUS}${K}(${cs()} + ${sn()})`))}이고 ${is(fp('f'), 0)}인 ${is(X, frac('π', 4))}에서 부호가 음에서 양으로 바뀌어 극소이다. ${is(fx('f', frac('π', 4)), `${MINUS}${K}${rt('2')} + ${Cc}`)}에서 ${is(Cc, c)}이므로 ${fx('f', frac('π', 2))} = ${MINUS}${k} + ${pf(c)} = ${iq(c - k)}이다.`,
          facts: { value: `${J(c)}-${k}` } });
      }
      if (n === 1) {
        const Mv = nzi(d, -3, 4), at = d.pick([[1, 3], [2, 3], [1, 2]]), cv = at[1] === 2 ? 0 : at[0] === 1 ? 0.5 : -0.5;
        const v = qadd(Mv, at[1] === 2 ? Q(-2, 3) : at[0] === 1 ? Q(-9, 8) : Q(-5, 24));
        if (!close(qn(v), Mv + simpson((x) => Math.sin(x) ** 3, PI, PI * at[0] / at[1]))) throw new Error('app-ext 셈 2');
        return num(`${ms('0 < x < 2')}π에서 정의된 함수 ${is(FX, ind(sn(null, 3)))}의 극댓값이 ${jh(iq(Mv), '일/일')} 때, ${jh(fx('f', pi(at[0], at[1])), '의/의')} 값은?`, v, {
          explain: `${is(sn(null, 3), `(1 ${MINUS} ${cs(null, 2)})${sn()}`)}이므로 ${is(FX, plusC(`${MINUS}${cs()} + ${frac(1, 3)}${cs(null, 3)}`))}이다. ${jh(is(fp('f'), sn(null, 3)), '은/는')} ${is(X, 'π')}에서 양에서 음으로 바뀌므로 ${is(fx('f', 'π'), `${frac(2, 3)} + ${Cc}`)} = ${jh(iq(Mv), '이고/이고')} ${jh(fx('f', pi(at[0], at[1])), '은/는')} ${iq(v)}이다.`,
          facts: { value: `${J(Mv)}${at[1] === 2 ? '-2/3' : at[0] === 1 ? '-9/8' : '-5/(3*8)'}` } });
      }
      // F(x) = ∫kx/√(x + c)dx 의 최솟값 m → F(x1)
      const [c, rc] = d.pick([[1, 1], [4, 2], [9, 3]]), k = d.pick([3, 6]), m = nzi(d, -40, 40), s = d.until(() => d.int(2, 5), (v) => v * v > c && v !== rc), x1 = s * s - c;
      const C0 = m + 4 * k / 3 * c * rc, v = 2 * k / 3 * s * (s * s - 3 * c) + C0;
      if (!Number.isInteger(v) || Math.abs(v) > 999 || !close(v, m + simpson((x) => k * x / SQ(x + c), 0, x1))) return null;
      return num(`함수 ${frac(k + X, rt(`${X} + ${c}`))}의 한 부정적분 ${jh(FCX, '의/의')} 최솟값이 ${jh(iq(m), '일/일')} 때, ${jh(fx('F', x1), '의/의')} 값은?`, v, {
        explain: `${X} + ${c} = ${jh(Tt, '으로/로')} 놓으면 ${is(FCX, plusC(`${iq(Q(2 * k, 3))}${rt(`${X} + ${c}`)}(${X} ${MINUS} ${2 * c})`))}이다. ${is(fp('F'), 0)}인 ${is(X, 0)}에서 최소이고 ${is(fx('F', 0), `${MINUS}${4 * k / 3 * c * rc} + ${Cc}`)}이므로 ${is(Cc, C0)}, ${is(fx('F', x1), v)}이다.`,
        facts: { value: `2*${k}/3*${s}*(${s}**2-3*${c})+${J(m)}+4*${k}/3*${c}*${rc}` } });
    }, { count: 3, standard: S2 }),
    T('app-minpart', '최솟값으로 적분상수 정하기 — 부분적분', '②21', (d) => {
      const k = d.int(1, 2), m = nzi(d, -4, 5), xk = k === 1 ? X : X + sup(k), v = m + simpson((x) => x ** k * LN(x), 1, EE);
      const c1 = Q(k, (k + 1) ** 2), c0 = qadd(m, Q(1, (k + 1) ** 2)), ek = EV + sup(k + 1), opt = (ce, cc0) => sumH([[ce, ek], [cc0, '']]);
      return chooseV(d, `${ms('x > 0')}에서 정의된 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), xk + ln('x'))}이고 ${jh(FX, '의/의')} 최솟값이 ${jh(iq(m), '일/일')} 때, ${jh(fx('f', EV), '의/의')} 값은?`, [opt(c1, c0), v], [
        [opt(c1, m), qn(c1) * EE ** (k + 1) + m], [opt(Q(1, k + 1), c0), EE ** (k + 1) / (k + 1) + qn(c0)], [opt(c1, qsub(m, Q(1, (k + 1) ** 2))), qn(c1) * EE ** (k + 1) + m - 1 / (k + 1) ** 2], [opt(Q(1, (k + 1) ** 2), c0), EE ** (k + 1) / (k + 1) ** 2 + qn(c0)]
      ], v, {
        explain: `${is(FX, plusC(`${frac(1, k + 1)}${X}${sup(k + 1)}${ln('x')} ${MINUS} ${frac(1, (k + 1) ** 2)}${X}${sup(k + 1)}`))}이다. ${is(fp('f'), 0)}인 ${is(X, 1)}에서 부호가 음에서 양으로 바뀌므로 최솟값은 ${is(fx('f', 1), `${MINUS}${frac(1, (k + 1) ** 2)} + ${Cc}`)}이고, 이로부터 ${jh(fx('f', EV), '을/를')} 셈한다.` });
    }, { standard: S3 }),
    T('app-const', '∫ₐᵇ f(t)dt가 든 함수 방정식 — 상수로 놓기', '②25', (d) => {
      const c = d.pick([1, 4, 9]), b = d.pick([2, 3]), I = simpson((t) => t / (t * t + c), 0, b), kval = I / (1 - b), v = b / (b * b + c) + kval;
      const lq = Q(b * b + c, c), co = Q(-1, 2 * (b - 1)), lead = Q(b, b * b + c), opt = (c0, cl) => sumH([[c0, ''], [cl, ln(iq(lq))]]);
      return chooseV(d, `실수 전체의 집합에서 연속인 함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${jh(is(FX, `${frac(X, `${X}${sup(2)} + ${c}`)} + ${dfi(0, b, fx('f', Tt), 't')}`), '을/를')} 만족시킬 때, ${jh(fx('f', b), '의/의')} 값은?`, [opt(lead, co), v], [
        [opt(lead, qmul(co, -1)), qn(lead) - qn(co) * LN(qn(lq))], [opt(lead, Q(-1, 2)), qn(lead) - 0.5 * LN(qn(lq))], [opt(0, co), qn(co) * LN(qn(lq))], [opt(lead, qmul(co, 2)), qn(lead) + 2 * qn(co) * LN(qn(lq))]
      ], v, {
        explain: `${is(dfi(0, b, fx('f', Tt), 't'), V('k'))}(상수)로 놓으면 ${is(FX, `${frac(X, `${X}${sup(2)} + ${c}`)} + ${V('k')}`)}이고 ${is(V('k'), `${dfi(0, b, frac(Tt, `${Tt}${sup(2)} + ${c}`), 't')} + ${b}${V('k')}`)} = ${frac(1, 2)}${ln(iq(lq))} + ${b}${V('k')}이다. 따라서 ${is(V('k'), sumH([[co, ln(iq(lq))]]))}이다.` });
    }, { standard: S2 }),
    T('app-xf', 'x f(x)와 적분이 섞인 등식을 미분해 f′ 구하기', '②27', (d, n) => {
      if (n === 0) {
        // ∫f(x)dx = x f(x) − a x ln x, f(1) = c → f(eᵏ) = a(k²/2 + k) + c
        const a = d.int(1, 3), c = nzi(d, -4, 4), k = d.int(1, 3), v = qadd(qmul(a, qadd(Q(k * k, 2), k)), c);
        if (!close(qn(v), c + simpson((x) => a * (LN(x) + 1) / x, 1, EE ** k))) throw new Error('app-xf 셈');
        return num(`${ms('x > 0')}에서 미분가능한 함수 ${jh(FX, '이/가')} ${is(ind(FX), `${X}${FX} ${MINUS} ${K1(a)}${X}${ln('x')}`)}, ${jh(is(fx('f', 1), c), '을/를')} 만족시킬 때, ${jh(fx('f', k === 1 ? EV : EV + sup(k)), '의/의')} 값은?`, v, {
          explain: `양변을 미분하면 ${is(FX, `${FX} + ${X}${fp('f')} ${MINUS} ${K1(a)}${ln('x')} ${MINUS} ${a}`)}이므로 ${is(fp('f'), frac(`${K1(a)}(${ln('x')} + 1)`, X))}이다. ${ln('x')} = ${jh(Tt, '으로/로')} 놓으면 ${is(FX, `${K1(a)}{${frac(1, 2)}(${ln('x')})${sup(2)} + ${ln('x')}} + ${Cc}`)}이고 ${is(Cc, c)}이므로 ${iq(v)}이다.`,
          facts: { value: `${a}*(${k}**2/2+${k})+${J(c)}` } });
      }
      if (n === 1) {
        // x f(x) = a x² ln x + ∫(1~x) f(t)dt → f(e) = a e + a
        const a = d.int(1, 3), v = a * EE + a, opt = (ce, c0) => sumH([[ce, EV], [c0, '']]);
        return chooseV(d, `${ms('x > 0')}에서 미분가능한 함수 ${jh(FX, '이/가')} ${jh(is(`${X}${FX}`, `${K1(a)}${X}${sup(2)}${ln('x')} + ${dfi(1, 'x', fx('f', Tt), 't')}`), '을/를')} 만족시킬 때, ${jh(fx('f', EV), '의/의')} 값은?`, [opt(a, a), v], [
          [opt(2 * a, a), 2 * a * EE + a], [opt(a, -a), a * EE - a], [opt(2 * a, -a), 2 * a * EE - a], [opt(a, 0), a * EE]
        ], simpson((x) => 2 * a * LN(x) + a, 1, EE), {
          explain: `양변을 미분하면 ${FX} + ${X}${fp('f')} = ${2 * a}${X}${ln('x')} + ${K1(a)}${X} + ${FX}이므로 ${is(fp('f'), `${2 * a}${ln('x')} + ${a}`)}이고 ${is(FX, `${2 * a}${X}${ln('x')} ${MINUS} ${K1(a)}${X} + ${Cc}`)}이다. 처음 식에 ${jh(is(X, 1), '을/를')} 넣으면 ${is(fx('f', 1), 0)}이므로 ${is(Cc, a)}이다.` });
      }
      // F(x) = x f(x) + a x² eˣ (F 는 f 의 한 부정적분), f(0) = c → f(−1) = a + c
      const a = d.int(1, 3), c = nzi(d, -4, 4), v = a + c;
      if (!close(v, c + simpson((x) => -a * (x + 2) * EE ** x, 0, -1))) throw new Error('app-xf 셈 3');
      return num(`모든 실수 ${jh(X, '에서/에서')} 미분가능한 함수 ${jh(FX, '의/의')} 한 부정적분 ${jh(FCX, '이/가')} ${jh(is(FCX, `${X}${FX} + ${K1(a)}${X}${sup(2)}${ePow('x')}`), '을/를')} 만족시킨다. ${is(fx('f', 0), c)}일 때, ${jh(fx('f', -1), '의/의')} 값은?`, v, {
        explain: `양변을 미분하면 ${is(FX, `${FX} + ${X}${fp('f')} + ${K1(2 * a)}${X}${ePow('x')} + ${K1(a)}${X}${sup(2)}${ePow('x')}`)}이므로 ${is(fp('f'), `${MINUS}${K1(a)}(${X} + 2)${ePow('x')}`)}이다. 부분적분하면 ${is(FX, `${MINUS}${K1(a)}(${X} + 1)${ePow('x')} + ${Cc}`)}이고 ${is(fx('f', 0), c)}에서 ${is(Cc, a + c)}이므로 ${is(fx('f', -1), v)}이다.`,
        facts: { value: `${a}+${J(c)}` } });
    }, { count: 3, standard: S3 }),
    T('app-fpf', 'f′(x)/f(x) = g(x)에서 f 구하기', '②28', (d) => {
      const k = d.pick([2, 4, 6]), c = d.int(2, 5), a = d.int(1, 2), ex = k * a * a / 2, v = c * EE ** ex;
      return chooseV(d, `미분가능한 함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${ms('f(x) > 0')}이고 ${is(frac(fp('f'), FX), k + X)}, ${jh(is(fx('f', 0), c), '을/를')} 만족시킬 때, ${jh(fx('f', a), '의/의')} 값은?`, [c + ePow(String(ex)), v], [
        [c + ePow(String(2 * ex)), c * EE ** (2 * ex)], [ePow(String(ex)) + ' + ' + c, EE ** ex + c], [ePow(String(ex)), EE ** ex], [c + ePow(String(ex / 2)), c * EE ** (ex / 2)]
      ], c * Math.exp(simpson((x) => k * x, 0, a)), {
        explain: `양변을 적분하면 ${ln(FX)} = ${iq(Q(k, 2))}${X}${sup(2)} + ${Cc}(${FX} &gt; 0)이고 ${is(fx('f', 0), c)}에서 ${is(Cc, ln(c))}이므로 ${is(FX, c + ePow(`${k / 2 === 1 ? '' : k / 2}x^2`))}, ${is(fx('f', a), c + ePow(String(ex)))}이다.` });
    }, { standard: S2 }),
    T('app-series', '부정적분과 급수 — 수렴하도록 적분상수 정하기', '②31', (d) => {
      const [a, k] = d.pick([[2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3], [5, 1]]), v = Q(-1, k * (a ** k - 1));
      return num(`함수 ${is(FX, ind(pw(a, MINUS + (k === 1 ? '' : k) + X)))}에 대하여 급수 ${jh(sum('n=1', '∞', 'f(n)'), '이/가')} 수렴하고 그 합이 ${jh(frac(V('p'), lnT(a)), '일/일')} 때, 상수 ${jh(V('p'), '의/의')} 값은?`, v, {
        explain: `${is(FX, plusC(`${MINUS}${frac(pw(a, MINUS + (k === 1 ? '' : k) + X), `${k === 1 ? '' : k} ${lnT(a)}`)}`))}이다. 급수가 수렴하려면 ${is(fx('f', V('n')), 0)}에 수렴해야 하므로 ${is(Cc, 0)}이다. 공비가 ${frac(1, a ** k)}인 등비급수의 합 ${frac(1, a ** k - 1)}에 ${MINUS}${jh(frac(1, `${k === 1 ? '' : k} ${lnT(a)}`), '을/를')} 곱하면 ${is(V('p'), v)}이다.`,
        facts: { value: `-1/(${k}*(${a}**${k}-1))` } });
    }, { standard: S2 })
  ];
  function lnT(a) { return ln(a); }

  B.addTypes('11-5-6', 'subst', subst);
  B.addTypes('11-5-6', 'ratfn', ratfn);
  B.addTypes('11-5-6', 'subdef', subdef);
  B.addTypes('11-5-6', 'parts', parts);
  B.addTypes('11-5-6', 'partdef', partdef);
  B.addTypes('11-5-6', 'apply', apply);
})(typeof window !== 'undefined' ? window : globalThis);
