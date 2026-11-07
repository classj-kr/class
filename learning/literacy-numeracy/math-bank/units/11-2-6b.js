// 고등학교 2학년 미적분Ⅰ Ⅲ-1 부정적분과 정적분 — 뒤쪽 묶음(정적분으로 정의된 함수, 정적분의 계산).
// 단원 틀·도구·싣는 기준·뺀 것과 까닭은 11-2-6a.js 머리에 있다. ref: ①n = 기본꼴_1의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, C } = B.kit;
  const { MINUS, Q, nb, V, sup, sys } = B.kit.mid;
  const { intg, evl, lim, jh, hx } = B.kit.hs;
  const {
    S3, S4, T, q, qadd, qsub, qmul, qdiv, qn, isI, J, iq, ptrim, padd, pscale, pmul, pder, pint, pval, pdef, coef,
    X, Tt, Cc, ptx, pp, lin, fx, FX, GX, fp, is, DDX, dfi, pvalJ, pdefJ, evlTold, num, vals, pAns, GA, comboPick, nzi, sg, cf, P2
  } = B.kit.u26x;
  const ppT = (a) => pp(a, Tt);
  const ft = (name) => V(name || 'f') + '(' + Tt + ')';

  // ════════════════════════════════════════════════════════════════
  // 정적분으로 정의된 함수
  // ════════════════════════════════════════════════════════════════
  const fdef = [
    T('fdef-deriv', 'd/dx∫ₐˣ f(t)dt 구하기', '①21', (d, n) => {
      if (n === 0) {
        const s = d.pick([1, 2, 3, -1, -2]), p = nzi(d, -5, 5), qq = d.pick([1, 2, 3, -1]), r = nzi(d, -5, 5), a = d.int(-3, 3), f = pmul([p, s], [r, qq]);
        if (f.some((c) => c.p === 0)) return null;
        return pAns(`${jh(DDX + dfi(a, 'x', pp([p, s], Tt) + pp([r, qq], Tt), 't'), '을/를')} 구하시오.`, '', f, [2, 1, 0], false, {
          explain: `${is(DDX + dfi(a, 'x', ft('g'), 't'), V('g') + '(' + X + ')')}이므로 ${pp([p, s])}${pp([r, qq])} = ${ptx(f)}이다. 아래끝의 수는 결과와 상관없다.`,
          facts: { calc: [[`${J(s)}*${J(qq)}`, 0], [`${J(s)}*${J(r)}+${J(p)}*${J(qq)}`, 1], [`${J(p)}*${J(r)}`, 2]] } });
      }
      const u = nzi(d, -3, 3), v = nzi(d, -5, 5), c = nzi(d, -2, 2), w = nzi(d, -9, 12), e = d.until(() => nzi(d, -3, 3), (x) => x !== c), a = w - u * c * c - v * c, ans = u * e * e + v * e + a;
      if (a === 0) return null;
      return num(`함수 ${is(FX, DDX + dfi(1, 'x', `(${ptx([0, v, u], Tt)} + ${V('a')})`, 't'))}에 대하여 ${is(fx('f', c), w)}일 때, ${jh(fx('f', e), '의/의')} 값은? (단, ${jh(V('a'), '은/는')} 상수이다.)`, ans, {
        explain: `${is(FX, `${ptx([0, v, u])} + ${V('a')}`)}이고 ${is(fx('f', c), w)}에서 ${is(V('a'), a)}이므로 ${is(fx('f', e), ans)}이다.`,
        facts: { value: `${J(w)}-${J(u)}*${J(c)}**2-${J(v)}*${J(c)}+${J(u)}*${J(e)}**2+${J(v)}*${J(e)}` } });
    }, { count: 2 }),
    T('fdef-find', '∫ₐˣ f(t)dt = g(x)에서 f 구하기', '①22', (d, n) => {
      const a = d.int(-2, 2);
      if (n === 0) {
        const f = [nzi(d, -7, 7), 2 * nzi(d, -4, 4), 3 * nzi(d, -2, 2)], G = pint(f), g = padd(G, [qmul(-1, pval(G, a))]), k = nzi(d, -3, 3);
        return num(`함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${dfi(a, 'x', ft(), 't')} = ${jh(ptx(g), '을/를')} 만족시킬 때, ${jh(fx('f', k), '의/의')} 값은?`, pval(f, k), {
          explain: `양변을 ${jh(X, '에/에')} 대하여 미분하면 ${is(FX, ptx(f))}이므로 ${is(fx('f', k), pval(f, k))}이다.`,
          facts: { value: `3*${J(coef(g, 3))}*${J(k)}**2+2*${J(coef(g, 2))}*${J(k)}+${J(coef(g, 1))}` } });
      }
      if (n === 1) {
        // ∫ₐˣ t f(t)dt = g(x), f(x) = αx + β
        const al = 3 * nzi(d, -2, 2), be = 2 * nzi(d, -3, 3), G = pint([0, be, al]), g = padd(G, [qmul(-1, pval(G, a))]);
        return pAns(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${dfi(a, 'x', Tt + ft(), 't')} = ${jh(ptx(g), '을/를')} 만족시킬 때, ${jh(FX, '을/를')} 구하시오.`, FX + ' =', [be, al], [1, 0], false, {
          explain: `양변을 미분하면 ${X}${FX} = ${ptx(pder(g))} = ${X}${pp([be, al])}이므로 ${is(FX, lin(al, be))}이다.`,
          facts: { calc: [[`3*${J(coef(g, 3))}`, 0], [`2*${J(coef(g, 2))}`, 1]] } });
      }
      // ∫ₐˣ {f(t) + kt}dt = g(x)
      const k = nzi(d, -4, 4), al = nzi(d, -6, 6), be = nzi(d, -7, 7);
      if ((al + k) % 2 !== 0 || al + k === 0) return null;
      const G = pint([be, al + k]), g = padd(G, [qmul(-1, pval(G, a))]);
      return pAns(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${dfi(a, 'x', `{${ft()} ${sg(k)} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${Tt}}`, 't')} = ${jh(ptx(g), '을/를')} 만족시킬 때, ${jh(FX, '을/를')} 구하시오.`, FX + ' =', [be, al], [1, 0], false, {
        explain: `양변을 미분하면 ${FX} ${sg(k)} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${X} = ${ptx(pder(g))}이므로 ${is(FX, lin(al, be))}이다.`,
        facts: { calc: [[`2*${J(coef(g, 2))}-${J(k)}`, 0], [J(coef(g, 1)), 1]] } });
    }, { count: 3 }),
    T('fdef-const', '∫ₐˣ f(t)dt = g(x)의 미지 상수 — 아래끝을 대입하기', '①23', (d, n) => {
      if (n === 0) {
        const s = nzi(d, -4, 5), p = nzi(d, -6, 6), c = -(s * s + p * s), k = d.until(() => nzi(d, -4, 4), (x) => x !== s), fk = 2 * k + p;
        if (c === 0) return null;
        return vals(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${dfi(s, 'x', ft(), 't')} = ${ptx([0, p, 1])} + ${jh(V('a'), '을/를')} 만족시킬 때, 상수 ${jh(V('a'), '의/의')} 값과 ${jh(fx('f', k), '의/의')} 값은?`, [[V('a'), c], [fx('f', k), fk]], {
          explain: `양변에 ${jh(is(X, s), '을/를')} 대입하면 좌변은 0이므로 ${is(V('a'), c)}이다. 양변을 미분하면 ${is(FX, lin(2, p))}이므로 ${is(fx('f', k), fk)}이다.`,
          facts: { calc: [[`-(${J(s)}**2+${J(p)}*${J(s)})`, 0], [`2*${J(k)}+${J(p)}`, 1]] } });
      }
      const s = nzi(d, -2, 2), u = nzi(d, -3, 3), a = nzi(d, -6, 6), w = -(u * s ** 3 + a * s), k = nzi(d, -3, 3), fk = 3 * u * k * k + a;
      if (w === 0) return null;
      return vals(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${dfi(s, 'x', ft(), 't')} = ${u === 1 ? '' : u === -1 ? MINUS : iq(u)}${X}${sup(3)} + ${V('a')}${X} ${sg(w)} ${jh(String(Math.abs(w)), '을/를')} 만족시킬 때, 상수 ${jh(V('a'), '의/의')} 값과 ${jh(fx('f', k), '의/의')} 값은?`, [[V('a'), a], [fx('f', k), fk]], {
        explain: `양변에 ${jh(is(X, s), '을/를')} 대입하면 0 = ${iq(u * s ** 3)} ${sg(s)} ${cf(Math.abs(s))}${V('a')} ${sg(w)} ${Math.abs(w)}이므로 ${is(V('a'), a)}이다. 양변을 미분하면 ${is(FX, ptx([a, 0, 3 * u]))}이므로 ${is(fx('f', k), fk)}이다.`,
        facts: { calc: [[`-(${J(u)}*${J(s)}**3+${J(w)})/${J(s)}`, 0], [`3*${J(u)}*${J(k)}**2-(${J(u)}*${J(s)}**3+${J(w)})/${J(s)}`, 1]] } });
    }, { count: 2 }),
    T('fdef-limit', '정적분으로 정의된 함수의 극한 — F(x) − F(a)로 바꾸기', '①25', (d, n) => {
      if (n === 0) {
        const f = [nzi(d, -6, 6), nzi(d, -4, 4), nzi(d, -3, 3), nzi(d, -2, 2)], a = nzi(d, -2, 2);
        return num(`함수 ${is(FX, ptx(f))}에 대하여 ${lim('x→' + a, frac(1, ptx([-a, 1])) + dfi(a, 'x', ft(), 't'))}의 값은?`, pval(f, a), {
          explain: `${FX}의 한 부정적분을 ${V('F')}(${X})라 하면 주어진 식은 ${frac(`${V('F')}(${X}) ${MINUS} ${V('F')}(${iq(a)})`, ptx([-a, 1]))}의 극한이므로 ${V('F')}′(${iq(a)}) = ${is(fx('f', a), pval(f, a))}이다.`,
          facts: { value: pvalJ(f, J(a)) } });
      }
      if (n === 1) {
        const a = d.pick([1, 2, 3, -1, -2]), u = d.pick([1, 2, 3]), v = nzi(d, -4, 4), w = d.pick([1, 2, 3]), z = nzi(d, -4, 4);
        const val = qdiv((u * a + v) * (w * a + z), 2 * a);
        if ((u * a + v) * (w * a + z) === 0) return null;
        return num(`${lim('x→' + a, frac(1, `${X}${sup(2)} ${MINUS} ${a * a}`) + dfi(a, 'x', ppT([v, u]) + ppT([z, w]), 't'))}의 값은?`, val, {
          explain: `${is(ft(), `${pp([v, u], Tt)}${pp([z, w], Tt)}`)}의 한 부정적분을 ${V('F')}(${Tt})라 하면 ${frac(`${V('F')}(${X}) ${MINUS} ${V('F')}(${iq(a)})`, ptx([-a, 1]))} × ${jh(frac(1, ptx([a, 1])), '의/의')} 극한이므로 ${frac(fx('f', a), `2 × ${P2(a)}`)} = ${iq(val)}이다.`,
          facts: { value: `(${J(u)}*${J(a)}+${J(v)})*(${J(w)}*${J(a)}+${J(z)})/(2*${J(a)})` } });
      }
      // 극한 조건과 정적분 조건: f(x) = x² + ax + b
      const a = nzi(d, -6, 6), b = nzi(d, -6, 6), k = Q(1 + a + b, 2), m = qadd(Q(1, 3), qadd(Q(a, 2), b));
      if (k.p === 0 || m.p === 0) return null;
      return vals(`함수 ${is(FX, `${X}${sup(2)} + ${V('a')}${X} + ${V('b')}`)}가 다음 조건을 만족시킬 때, 상수 ${V('a')}, ${jh(V('b'), '의/의')} 값은?${lines([`㈎ ${lim('x→1', frac(1, `${X}${sup(2)} ${MINUS} 1`) + dfi(1, 'x', ft(), 't'))} = ${iq(k)}`, `㈏ ${dfi(0, 1, FX)} = ${iq(m)}`])}`,
        [[V('a'), a], [V('b'), b]], {
          explain: `㈎에서 ${frac(fx('f', 1), 2)} = ${iq(k)}이므로 ${V('a')} + ${V('b')} = ${iq(qadd(qmul(2, k), -1))}이다. ㈏에서 ${frac(1, 3)} + ${frac(V('a'), 2)} + ${is(V('b'), m)}이다. 연립하면 ${is(V('a'), a)}, ${is(V('b'), b)}이다.`,
          facts: { calc: [[`(12*${J(k.p)}*${m.q}-6*${J(m.p)}*${k.q}-4*${k.q}*${m.q})/(3*${k.q}*${m.q})`, 0], [`2*${J(k.p)}/${k.q}-1-(12*${J(k.p)}*${m.q}-6*${J(m.p)}*${k.q}-4*${k.q}*${m.q})/(3*${k.q}*${m.q})`, 1]], derived: [12] } });
    }, { count: 3 }),
    T('fdef-const1', '정적분을 상수로 놓아 함수 구하기', '①27', (d, n) => {
      if (n === 0) {
        // f(x) = ux³ + px + ∫₀ᵇ f(t)dt
        const b = d.pick([2, 3]), u = b === 3 ? 4 * nzi(d, -1, 1) : nzi(d, -3, 3), p = b === 3 ? 2 * nzi(d, -3, 3) : nzi(d, -5, 5), I = qadd(qmul(u, Q(b ** 4, 4)), qmul(p, Q(b * b, 2))), k = qdiv(I, 1 - b), m = nzi(d, -2, 2);
        const ans = qadd(u * m ** 3 + p * m, k);
        return num(`다항함수 ${jh(FX, '에/에')} 대하여 ${is(FX, `${ptx([0, p, 0, u])} + ${dfi(0, b, ft(), 't')}`)}가 성립할 때, ${jh(fx('f', m), '의/의')} 값은?`, ans, {
          explain: `${is(dfi(0, b, ft(), 't'), V('k'))}(상수)로 놓으면 ${is(FX, `${ptx([0, p, 0, u])} + ${V('k')}`)}이고 ${is(V('k'), `${dfi(0, b, `(${ptx([0, p, 0, u], Tt)} + ${V('k')})`, 't')}`)} = ${iq(I)} + ${b}${V('k')}에서 ${is(V('k'), k)}이다. 따라서 ${is(fx('f', m), ans)}이다.`,
          facts: { value: `${J(u)}*${J(m)}**3+${J(p)}*${J(m)}+(${J(u)}*${b}**4/4+${J(p)}*${b}**2/2)/(1-${b})` } });
      }
      // f(x) = ux² + r·x∫₀¹ f(t)dt + c
      const u = 3 * nzi(d, -2, 2), r = d.pick([1, -1, 3, -3]), c = d.int(-6, 6), k = qdiv(qadd(Q(u, 3), c), qsub(1, Q(r, 2))), m = d.pick([2, 3, -2, 4]);
      const ans = qadd(qadd(u * m * m, qmul(qmul(r, k), m)), c);
      const rx = r === 1 ? X : r === -1 ? MINUS + X : (r < 0 ? MINUS : '') + Math.abs(r) + X, joinR = r < 0 ? ` ${MINUS} ${rx.replace(MINUS, '')}` : ` + ${rx}`;
      return num(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${jh(is(FX, `${ptx([0, 0, u])}${joinR}${dfi(0, 1, ft(), 't')}${c === 0 ? '' : ` ${sg(c)} ${Math.abs(c)}`}`), '을/를')} 만족시킬 때, ${fx('f', m)}의 값은?`, ans, {
        explain: `${is(dfi(0, 1, ft(), 't'), V('k'))}(상수)로 놓으면 ${is(FX, `${ptx([0, 0, u])} ${r < 0 ? MINUS : '+'} ${Math.abs(r) === 1 ? '' : Math.abs(r)}${V('k')}${X}${c === 0 ? '' : ` ${sg(c)} ${Math.abs(c)}`}`)}이다. 양변을 0부터 1까지 적분하면 ${V('k')} = ${iq(Q(u, 3))} ${r < 0 ? MINUS : '+'} ${frac(Math.abs(r), 2)}${V('k')}${c === 0 ? '' : ` ${sg(c)} ${Math.abs(c)}`}에서 ${is(V('k'), k)}이다. 따라서 ${is(fx('f', m), ans)}이다.`,
        facts: { value: `${J(u)}*${J(m)}**2+${J(r)}*(${J(u)}/3+${J(c)})/(1-${J(r)}/2)*${J(m)}+${J(c)}` } });
    }, { count: 2 }),
    T('fdef-param', '문자 a의 함수로 정의된 정적분', '①29', (d) => {
      const p3 = 3 * nzi(d, -2, 2), q2 = 2 * nzi(d, -3, 3), e = d.pick([1, 2]), c = p3 / 3 + q2 / 2;
      if (c === 0) return null;
      const ans = qadd(Q(1, e + 2), Q(c, e + 1));
      return num(`모든 실수 ${jh(V('a'), '에/에')} 대하여 ${is(fx('f', V('a')), dfi(0, 1, `(${ptx([0, q2, p3])} + ${V('a')})`))}일 때, ${jh(dfi(0, 1, (e === 1 ? X : X + sup(2)) + FX), '의/의')} 값은?`, ans, {
        explain: `적분하는 변수는 ${X}이므로 ${V('a')}는 상수로 본다. ${is(fx('f', V('a')), `${V('a')} ${sg(c)} ${Math.abs(c)}`)}이므로 ${is(FX, lin(1, c))}이고 ${dfi(0, 1, pp(e === 1 ? [0, c, 1] : [0, 0, c, 1]))} = ${iq(ans)}이다.`,
        facts: { value: `1/(${e}+2)+(${J(p3)}/3+${J(q2)}/2)/(${e}+1)` } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 정적분의 계산
  // ════════════════════════════════════════════════════════════════
  const calc = [
    T('calc-merge', '같은 구간의 정적분을 합쳐서 계산', '①38', (d, n) => {
      const a = d.int(-2, 1), b = a + d.int(1, 3);
      if (n === 0) {
        const c1 = nzi(d, -6, 6), c2 = nzi(d, -6, 6), v = nzi(d, -5, 5), u = 3 * nzi(d, -2, 2), w = 3 * nzi(d, -2, 2);
        if (c1 + c2 === 0 || u + w === 0) return null;
        const f1 = [c1, v, u], f2 = [c2, -v, w], s = padd(f1, f2);
        return num(`${dfi(a, b, pp(f1))} + ${jh(dfi(a, b, pp(f2)), '의/의')} 값은?`, pdef(s, a, b), {
          explain: `적분 구간이 같으므로 한 정적분으로 묶으면 ${evlTold(s, a, b)}이다.`,
          facts: { value: `(${J(c1)}+${J(c2)})*(${J(b)}-${J(a)})+(${J(u)}+${J(w)})*(${J(b)}**3-${J(a)}**3)/3`, rule: 'merge-sum' } });
      }
      const p = d.int(1, 4);
      return num(`${dfi(a, b, `(${X} ${MINUS} ${p})${sup(2)}`)} ${MINUS} ${jh(dfi(a, b, `(${X} + ${p})${sup(2)}`), '의/의')} 값은?`, -2 * p * (b * b - a * a), {
        explain: `한 정적분으로 묶으면 (${X} ${MINUS} ${p})${sup(2)} ${MINUS} (${X} + ${p})${sup(2)} = ${MINUS}${4 * p}${X}이므로 ${evlTold([0, -4 * p], a, b)}이다.`,
        facts: { value: `-4*${p}*(${J(b)}**2-${J(a)}**2)/2`, rule: 'merge-sq' } });
    }, { count: 2, standard: S3 }),
    T('calc-unknown', '정적분 등식에서 미지 상수 구하기', '①39·①18', (d, n) => {
      if (n === 0) {
        const b = d.pick([1, 2, 3]), u = 3 * nzi(d, -2, 2), a = nzi(d, -5, 5), v = qadd(qmul(u, Q(b ** 3, 3)), a * b * b);
        return num(`${dfi(0, b, `(${ptx([0, 0, u])} + 2${V('a')}${X})`)} = ${jh(iq(v), '을/를')} 만족시키는 상수 ${jh(V('a'), '의/의')} 값은?`, a, {
          explain: `${is(dfi(0, b, `(${ptx([0, 0, u])} + 2${V('a')}${X})`), evl(`${ptx([0, 0, 0, u / 3])} + ${V('a')}${X}${sup(2)}`, 0, b))} = ${iq(qmul(u, Q(b ** 3, 3)))} + ${cf(b * b)}${V('a')}이므로 ${is(V('a'), a)}이다.`,
          facts: { value: `(${J(v)}-${J(u)}*${b}**3/3)/${b}**2` } });
      }
      if (n === 1) {
        const a = d.int(-1, 1), b = a + d.int(2, 3), u = d.pick([3, 6, -3]), k = nzi(d, -6, 6), I = qsub(qmul(u, Q(b ** 3 - a ** 3, 3)), qmul(k, Q(b * b - a * a, 2))), v = qmul(2, I);
        if (b * b === a * a) return null;
        const body = `(${ptx([0, 0, u])} ${MINUS} ${V('k')}${X})`;
        return num(`${dfi(a, b, body)} ${MINUS} ${dfi(b, a, body)} = ${jh(iq(v), '을/를')} 만족시키는 상수 ${jh(V('k'), '의/의')} 값은?`, k, {
          explain: `${is(dfi(b, a, FX), MINUS + dfi(a, b, FX))}이므로 좌변은 2${dfi(a, b, body)}이다. 이것을 셈하면 ${iq(qmul(2, qmul(u, Q(b ** 3 - a ** 3, 3))))} ${MINUS} ${b * b - a * a === 1 ? '' : b * b - a * a}${V('k')}이고, 이 값이 ${iq(v)}이므로 ${is(V('k'), k)}이다.`,
          facts: { value: `(2*${J(u)}*(${J(b)}**3-${J(a)}**3)/3-${J(v)})/(${J(b)}**2-${J(a)}**2)` } });
      }
      // f(x) = x³ + px + a, ∫c^e f − v = ∫c^g f
      const p = nzi(d, -5, 5), a = nzi(d, -6, 6), c = d.int(-4, -2), g = d.int(-1, 1), e = g + d.int(1, 2), I = pdef([a, p, 0, 1], g, e);
      if (!isI(I)) return null;
      return num(`함수 ${is(FX, `${ptx([0, p, 0, 1])} + ${V('a')}`)}에 대하여 ${dfi(c, e, FX)} ${I.p < 0 ? '+' : MINUS} ${iq(I.p < 0 ? qmul(-1, I) : I)} = ${dfi(c, g, FX)}일 때, 상수 ${V('a')}의 값은?`, a, {
        explain: `${dfi(c, e, FX)} ${MINUS} ${is(dfi(c, g, FX), dfi(g, e, FX))}이므로 ${is(dfi(g, e, FX), I)}이다. 이것을 셈한 ${V('a')}의 일차식과 같게 놓으면 ${is(V('a'), a)}이다.`,
        facts: { value: `(${J(I)}-((${J(e)}**4-${J(g)}**4)/4+${J(p)}*(${J(e)}**2-${J(g)}**2)/2))/(${J(e)}-${J(g)})` } });
    }, { count: 3, standard: S4 }),
    T('calc-join', '적분 구간을 잇거나 뒤집어 하나로 계산', '①40', (d, n) => {
      const f = [nzi(d, -5, 5), nzi(d, -4, 4), 3 * nzi(d, -2, 2)];
      if (n === 0) {
        const a = d.int(-3, 0), c = a + d.int(1, 2), b = c + d.int(1, 2);
        return num(`${dfi(a, c, pp(f))} + ${jh(dfi(c, b, pp(f)), '의/의')} 값은?`, pdef(f, a, b), {
          explain: `${dfi(a, c, FX)} + ${is(dfi(c, b, FX), dfi(a, b, FX))}이므로 ${evlTold(f, a, b)}이다.`,
          facts: { value: pdefJ(f, a, b), rule: 'join-add' } });
      }
      if (n === 1) {
        const a = d.int(-3, 0), b = a + d.int(3, 4), c = a + d.int(1, b - a - 1);
        return num(`함수 ${is(FX, ptx(f))}에 대하여 ${dfi(a, c, FX)} ${MINUS} ${jh(dfi(b, c, FX), '의/의')} 값은?`, pdef(f, a, b), {
          explain: `${MINUS}${is(dfi(b, c, FX), dfi(c, b, FX))}이므로 주어진 식은 ${dfi(a, c, FX)} + ${is(dfi(c, b, FX), dfi(a, b, FX))}이다. ${evlTold(f, a, b)}이다.`,
          facts: { value: pdefJ(f, a, b), rule: 'join-flip' } });
      }
      const a = d.int(-2, 1), c = a + d.int(1, 2), b = c + d.int(1, 2);
      return num(`${dfi(a, b, pp(f))} ${MINUS} ${jh(dfi(c, b, pp(f, Tt), 't'), '의/의')} 값은?`, pdef(f, a, c), {
        explain: `정적분의 값은 변수의 문자와 상관없으므로 ${dfi(a, b, FX)} ${MINUS} ${is(dfi(c, b, FX), dfi(a, c, FX))}이다. ${evlTold(f, a, c)}이다.`,
        facts: { value: pdefJ(f, a, c), rule: 'join-letter' } });
    }, { count: 3, standard: S3 }),
    T('calc-pieces', '몇 구간의 정적분 값으로 다른 구간의 정적분 구하기', '①41', (d, n) => {
      const p0 = d.int(-2, 0), p1 = p0 + d.int(1, 2), p2 = p1 + d.int(1, 2), p3 = p2 + d.int(1, 2), A = nzi(d, -6, 9), Bv = nzi(d, -6, 9), Cv = d.until(() => nzi(d, -5, 5), (v) => v !== A && v !== Bv);
      const head = `모든 실수 ${jh(X, '에서/에서')} 연속인 함수 ${jh(FX, '에/에')} 대하여`;
      if (n === 0) {
        const ans = A + Bv - Cv;
        return num(`${head}${lines([`${is(dfi(p0, p2, FX), A)}, ${is(dfi(p1, p3, FX), Bv)}, ${is(dfi(p1, p2, FX), Cv)}`])}일 때, ${jh(dfi(p0, p3, FX), '의/의')} 값은?`, ans, {
          explain: `${is(dfi(p0, p3, FX), `${dfi(p0, p2, FX)} + ${dfi(p1, p3, FX)} ${MINUS} ${dfi(p1, p2, FX)}`)}(겹친 구간을 한 번 뺀다) = ${iq(ans)}이다.`,
          facts: { value: `${J(A)}+${J(Bv)}-${J(Cv)}` } });
      }
      const ans = A - Bv + Cv;
      return num(`${head}${lines([`${is(dfi(p0, p3, FX), A)}, ${is(dfi(p0, p2, FX), Bv)}, ${is(dfi(p1, p2, FX), Cv)}`])}일 때, ${jh(dfi(p1, p3, FX), '의/의')} 값은?`, ans, {
        explain: `${is(dfi(p1, p3, FX), `${dfi(p0, p3, FX)} ${MINUS} ${dfi(p0, p2, FX)} + ${dfi(p1, p2, FX)}`)} = ${iq(ans)}이다.`,
        facts: { value: `${J(A)}-${J(Bv)}+${J(Cv)}` } });
    }, { count: 2, standard: S3 }),
    T('calc-fg', '∫(f + g)와 ∫(f − g)로 다른 결합의 정적분 구하기', '①42', (d) => {
      const a = d.int(-3, 0), b = a + d.int(1, 3), P = nzi(d, -6, 8), R = d.until(() => nzi(d, -6, 8), (v) => v !== P), al = d.pick([2, 3, 4]), be = d.pick([3, 4, -3, -2]);
      const ans = qadd(Q(al * (P + R), 2), Q(be * (P - R), 2)), G = `${GX}`;
      return num(`모든 실수 ${jh(X, '에서/에서')} 연속인 두 함수 ${FX}, ${jh(G, '이/가')}${lines([`${is(dfi(a, b, `{${FX} + ${G}}`), P)}, ${is(dfi(a, b, `{${FX} ${MINUS} ${G}}`), R)}`])}을 만족시킬 때, ${jh(dfi(a, b, `{${al}${FX} ${sg(be)} ${Math.abs(be)}${G}}`), '의/의')} 값은?`, ans, {
        explain: `두 식을 더하고 빼면 ${is(dfi(a, b, FX), Q(P + R, 2))}, ${is(dfi(a, b, G), Q(P - R, 2))}이다. 따라서 구하는 값은 ${al} × ${P2(Q(P + R, 2))} ${sg(be)} ${Math.abs(be)} × ${P2(Q(P - R, 2))} = ${iq(ans)}이다.`,
        facts: { value: `${al}*(${J(P)}+${J(R)})/2+${J(be)}*(${J(P)}-${J(R)})/2` } });
    }, { standard: S3 }),
    T('calc-abs1', '일차식의 절댓값의 정적분', '①43', (d, n) => {
      const u = d.pick([1, 2, 3, -1, -2]), r = d.int(-2, 3), v = -u * r, body = `|${lin(u, v)}|`;
      if (n === 0) {
        const a = r - d.int(1, 3), b = r + d.int(1, 3), ans = Q(Math.abs(u) * ((r - a) ** 2 + (b - r) ** 2), 2);
        if (v === 0 && u === 1) return null;
        return num(`${jh(dfi(a, b, body), '의/의')} 값은?`, ans, {
          explain: `${lin(u, v)} = 0인 ${jh(is(X, r), '이/가')} 구간 안에 있으므로 ${is(X, r)}에서 나누어 셈하면 ${iq(Q(Math.abs(u) * (r - a) ** 2, 2))} + ${iq(Q(Math.abs(u) * (b - r) ** 2, 2))} = ${iq(ans)}이다.`,
          facts: { value: `${Math.abs(u)}*((-(${J(v)})/${J(u)}-${J(a)})**2+(${J(b)}+(${J(v)})/${J(u)})**2)/2`, rule: 'abs-split' } });
      }
      // 구간 안에서 부호가 그대로인 것
      const left = d.bool(), a = left ? r - d.int(3, 5) : r + d.int(0, 1), b = left ? r - d.int(0, 1) : r + d.int(3, 5), I = pdef([v, u], a, b), ans = I.p < 0 ? qmul(-1, I) : I;
      if (a >= b || I.p === 0) return null;
      return num(`${jh(dfi(a, b, body), '의/의')} 값은?`, ans, {
        explain: `${is(lin(u, v), 0)}인 ${jh(is(X, r), '이/가')} 구간 안에 없으므로 구간에서 ${lin(u, v)} ${I.p < 0 ? '≤' : '≥'} 0이다. 따라서 ${I.p < 0 ? MINUS : ''}${dfi(a, b, pp([v, u]))} = ${iq(ans)}이다.`,
        facts: { value: `${I.p < 0 ? '-' : ''}(${J(u)}*(${J(b)}**2-${J(a)}**2)/2+${J(v)}*(${J(b)}-${J(a)}))`, rule: 'abs-whole' } });
    }, { count: 2, standard: S4 }),
    T('calc-abs2', '이차식의 절댓값의 정적분', '①44', (d) => {
      const r1 = d.int(-2, 2), r2 = r1 + d.int(1, 4), p = pmul([-r1, 1], [-r2, 1]), inner = d.pick([r1, r2]);
      const a = inner === r1 ? d.int(Math.max(r1 - 3, r1 - 2), r1 - 1) : d.int(r1, r2 - 1), b = inner === r1 ? d.int(r1 + 1, r2) : d.int(r2 + 1, r2 + 2);
      if (!(a < inner && inner < b)) return null;
      const s1 = pdef(p, a, inner), s2 = pdef(p, inner, b), ans = qadd(s1.p < 0 ? qmul(-1, s1) : s1, s2.p < 0 ? qmul(-1, s2) : s2);
      const expanded = d.bool(), body = expanded ? `|${ptx(p)}|` : `|${r1 === 0 ? X : '(' + ptx([-r1, 1]) + ')'}${r2 === 0 ? X : '(' + ptx([-r2, 1]) + ')'}|`;
      // 검사 식: 펼친 식이면 계수로, 곱으로 적었으면 두 근으로 셈한다(글에 보이는 수로).
      const byRoots = (lo, hi) => `(${J(hi)}**3-${J(lo)}**3)/3-(${J(r1)}+${J(r2)})*(${J(hi)}**2-${J(lo)}**2)/2+${J(r1)}*${J(r2)}*(${J(hi)}-${J(lo)})`;
      const part = (lo, hi, s) => `${s.p < 0 ? '-' : ''}(${expanded ? pdefJ(p, lo, hi) : byRoots(lo, hi)})`;
      return num(`${jh(dfi(a, b, body), '의/의')} 값은?`, ans, {
        explain: `${ptx(p)} = ${pp([-r1, 1])}${pp([-r2, 1])}이므로 ${is(X, inner)}에서 부호가 바뀐다. ${is(X, inner)}에서 나누어 각각의 정적분의 절댓값을 더하면 ${iq(s1.p < 0 ? qmul(-1, s1) : s1)} + ${iq(s2.p < 0 ? qmul(-1, s2) : s2)} = ${iq(ans)}이다.`,
        facts: { value: `${part(a, inner, s1)}+${part(inner, b, s2)}` } });
    }, { standard: S4 }),
    T('calc-piece', '구간마다 다른 식으로 정의된 함수의 정적분', '①45', (d, n) => {
      if (n === 0) {
        // f(x) = x² + c (x ≥ s), mx (x < s), 이어진 함수. ∫a^b f = v (a < s) → a
        const s = d.pick([1, 2]), m = d.pick([-1, -2, 1, 2]), c = m * s - s * s, b = s + d.int(1, 2), A = d.int(s + 1, s + 4), a = -A;
        const v = qadd(Q(m * (s * s - a * a), 2), pdef([c, 0, 1], s, b));
        return num(`함수 ${is(FX, sys([`${ptx([c, 0, 1])} (${X} ≥ ${s})`, `${ptx([0, m])} (${X} &lt; ${s})`]))}에 대하여 ${dfi(V('a'), b, FX)} = ${jh(iq(v), '을/를')} 만족시키는 상수 ${jh(V('a'), '의/의')} 값은? (단, ${V('a')} &lt; ${s})`, a, {
          explain: `${is(dfi(V('a'), b, FX), `${dfi(V('a'), s, m === 1 ? X : pp([0, m]))} + ${dfi(s, b, pp([c, 0, 1]))}`)} = ${cf(Q(m, 2))}(${s * s} ${MINUS} ${V('a')}${sup(2)}) ${sg(qn(pdef([c, 0, 1], s, b)))} ${iq(qn(pdef([c, 0, 1], s, b)) < 0 ? qmul(-1, pdef([c, 0, 1], s, b)) : pdef([c, 0, 1], s, b))}이다. 이 값이 ${iq(v)}이므로 ${V('a')}${sup(2)} = ${a * a}이고, ${V('a')} &lt; ${s}이므로 ${is(V('a'), a)}이다.`,
          facts: { value: `-(((${s}**2-2*(${J(v)}-((${J(b)}**3-${s}**3)/3+${J(c)}*(${J(b)}-${s})))/${J(m)}))**0.5)`, rule: 'piece-a' } });
      }
      // f(x) = −nx + e (x ≥ s), mx (x < s), x축과 만나는 두 점 사이의 정적분
      const s = d.pick([1, 2]), m = d.pick([1, 2, 3]), nn = d.pick([1, 2, 3]), e = (m + nn) * s, root = e / nn;
      if (!Number.isInteger(root)) return null;
      const ans = Q(root * m * s, 2);
      return num(`함수 ${is(FX, sys([`${ptx([e, -nn])} (${X} ≥ ${s})`, `${ptx([0, m])} (${X} &lt; ${s})`]))}에 대하여 함수 ${is(V('y'), FX)}의 그래프와 ${X}축이 만나는 두 점의 ${X}좌표를 ${V('a')}, ${V('b')} (${V('a')} &lt; ${V('b')})라 할 때, ${jh(dfi(V('a'), V('b'), FX), '의/의')} 값은?`, ans, {
        explain: `${is(V('a'), 0)}, ${is(V('b'), root)}이고 구간에서 ${FX} ≥ 0이므로 정적분은 밑변 ${root}, 높이 ${is(fx('f', s), m * s)}인 삼각형의 넓이 ${jh(iq(ans), '과/와')} 같다.`,
        facts: { value: `${J(e)}/${J(nn)}*${J(m)}*${s}/2`, rule: 'piece-root' } });
    }, { count: 2, standard: S4 }),
    T('calc-sym', '대칭 구간의 정적분 — 홀수 차 항은 0, 짝수 차 항은 두 배', '①47', (d, n) => {
      const a = d.pick([1, 2, 3]);
      if (n === 0) {
        const f = [nzi(d, -6, 6), nzi(d, -6, 6), 3 * nzi(d, -2, 2), nzi(d, -4, 4)];
        return num(`${jh(dfi(-a, a, pp(f)), '의/의')} 값은?`, pdef(f, -a, a), {
          explain: `홀수 차 항의 정적분은 0이므로 ${is(dfi(-a, a, pp(f)), `2${dfi(0, a, pp([f[0], 0, f[2]]))}`)} = ${iq(pdef(f, -a, a))}이다.`,
          facts: { value: `2*(${J(f[2])}*${a}**3/3+${J(f[0])}*${a})`, rule: 'sym-one' } });
      }
      if (n === 1) {
        // ∫(px − q)² − ∫(x − r)(sx − t)
        const p = d.pick([2, 3]), qq = nzi(d, -3, 3), r = nzi(d, -3, 3), s = d.pick([2, 3, 4, 5, 6]), t = nzi(d, -4, 4);
        const g = padd(pmul([-qq, p], [-qq, p]), pscale(pmul([-r, 1], [-t, s]), -1));
        if (coef(g, 2).p === 0 || coef(g, 1).p === 0 || coef(g, 0).p === 0) return null;
        const ans = pdef(g, -a, a);
        return num(`${dfi(-a, a, `(${ptx([-qq, p])})${sup(2)}`)} ${MINUS} ${jh(dfi(-a, a, pp([-r, 1]) + pp([-t, s])), '의/의')} 값은?`, ans, {
          explain: `한 정적분으로 묶으면 ${is(dfi(-a, a, pp(g)), `2${dfi(0, a, pp([coef(g, 0), 0, coef(g, 2)]))}`)} = ${iq(ans)}이다(홀수 차 항은 0).`,
          facts: { value: `2*((${p}**2-${s})*${a}**3/3+(${J(qq)}**2-${J(r)}*${J(t)})*${a})`, rule: 'sym-two' } });
      }
      // 참·거짓 고르기
      const odd = d.pick([3, 5, 7]), even = d.pick([2, 4, 6]), cc = d.int(2, 5), b = d.pick([1, 2, 3]);
      const xp = (k) => X + sup(k);
      const pool = [
        [`${is(dfi(-b, b, xp(odd)), 0)}`, qn(pdef(Array(odd).fill(0).concat([1]), -b, b)) === 0],
        [`${is(dfi(-b, b, xp(even)), 0)}`, qn(pdef(Array(even).fill(0).concat([1]), -b, b)) === 0],
        [`${is(dfi(-b, b, xp(even)), `2${dfi(0, b, xp(even))}`)}`, qn(pdef(Array(even).fill(0).concat([1]), -b, b)) === 2 * qn(pdef(Array(even).fill(0).concat([1]), 0, b))],
        [`${is(dfi(-b, b, xp(odd)), `2${dfi(0, b, xp(odd))}`)}`, qn(pdef(Array(odd).fill(0).concat([1]), -b, b)) === 2 * qn(pdef(Array(odd).fill(0).concat([1]), 0, b))],
        [`${is(dfi(-b, b, `(${xp(odd)} + ${cc})`), 2 * cc * b)}`, qn(pdef([cc].concat(Array(odd - 1).fill(0), [1]), -b, b)) === 2 * cc * b],
        [`${is(dfi(-b, b, `(${xp(odd)} + ${cc})`), 0)}`, qn(pdef([cc].concat(Array(odd - 1).fill(0), [1]), -b, b)) === 0]
      ];
      const list = d.shuffle(pool).slice(0, 3);
      if (!list.some((r) => r[1])) return null;
      return comboPick(d, '옳은 것만을 있는 대로 고른 것은?', list.map((r) => r[0]), list.map((r) => r[1]),
        `${V('n')}이 홀수이면 ${is(dfi(MINUS + V('a'), V('a'), X + sup(V('n'))), 0)}, 짝수이면 ${is(dfi(MINUS + V('a'), V('a'), X + sup(V('n'))), `2${dfi(0, V('a'), X + sup(V('n')))}`)}이다. 상수항 ${jh(String(cc), '의/의')} 정적분은 ${2 * cc * b}이다.`);
    }, { count: 3, standard: S4 }),
    T('calc-product', 'f(x) + xf′(x)의 정적분', '①50', (d) => {
      const u = d.pick([2, 3, -2]), v = nzi(d, -4, 4), a = nzi(d, -9, 9), al = d.int(-2, 0), be = al + d.int(1, 3);
      const f = [a, v, 0, 0, u], F = (x) => qmul(x, pval(f, x)), val = qsub(F(be), F(al));
      return num(`함수 ${is(FX, `${ptx([0, v, 0, 0, u])} + ${V('a')}`)}가 ${dfi(al, be, `{${FX} + ${X}${fp('f')}}`)} = ${jh(iq(val), '을/를')} 만족시킬 때, 상수 ${jh(V('a'), '의/의')} 값은?`, a, {
        explain: `{${X}${FX}}′ = ${FX} + ${X}${fp('f')}이므로 ${is(dfi(al, be, `{${FX} + ${X}${fp('f')}}`), evl(X + FX, al, be))} = ${iq(be)} × ${fx('f', be)} ${MINUS} ${P2(al)} × ${fx('f', al)}이다. 이 값을 ${V('a')}의 식으로 나타내어 ${jh(iq(val), '과/와')} 같게 놓으면 ${is(V('a'), a)}이다.`,
        facts: { value: `(${J(val)}-(${J(be)}*(${J(u)}*${J(be)}**4+${J(v)}*${J(be)})-${J(al)}*(${J(u)}*${J(al)}**4+${J(v)}*${J(al)})))/(${J(be)}-${J(al)})` } });
    }, { standard: S4 })
  ];

  B.addTypes('11-2-6', 'fdef', fdef);
  B.addTypes('11-2-6', 'calc', calc);
})(typeof window !== 'undefined' ? window : globalThis);
