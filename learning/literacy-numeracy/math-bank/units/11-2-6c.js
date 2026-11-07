// 고등학교 2학년 미적분Ⅰ Ⅲ-1 부정적분과 정적분 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - 구간마다 식이 다른 도함수를 적분할 때 적분상수를 하나로 두거나, 이음매에서 함수가 이어진다는 조건을 쓰지 않는다.
//  - ∫ₐˣ (x − t)f(t)dt 를 그대로 미분하여 (x − x)f(x) = 0 으로 만든다(적분 변수는 t 이므로 x 를 적분 밖으로 꺼낸 뒤 곱의 미분을 해야 한다).
//  - ∫₀¹ (2x − t)f(t)dt 처럼 x 가 섞인 정적분을 상수 하나로 놓는다(x 를 밖으로 꺼내면 상수가 둘이다).
//  - 위끝·아래끝이 모두 x 의 식인 정적분을 미분할 때 아래끝 쪽을 빼먹는다.
//  - f(x − 1)의 범위 조건(x − 1 ≤ 2)을 x ≤ 2 로 그대로 둔다.
//  - 대칭·주기 조건에서 같은 넓이의 구간을 옮기지 못하고 정적분을 직접 셈하려 한다.
// 실력에 둔 것: ① 뜻을 정확히 대야 풀리는 것(①9 분수 꼴을 합쳐야 다항함수, ①48 원점 대칭인 곱의 정적분은 0, ①49 주기와 대칭으로 구간 옮기기,
//  ①24 x 를 적분 밖으로, ①26 아래끝도 움직인다, ①46 조건의 범위가 옮겨 간다) ② 세 단계 넘게 잇는 것(①14 조각 도함수의 적분상수 잇기,
//  ①15 F와 f의 관계식, ①16 차수 판단과 계수 비교, ①28 상수 둘의 연립).
// ref: ①n = 기본꼴_1의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, M } = B.kit;
  const { MINUS, Q, V, sup, sys, nb } = B.kit.mid;
  const { intg, jh, plot, hx } = B.kit.hs;
  const {
    S2, S3, S4, H, q, qadd, qsub, qmul, qdiv, qn, isI, J, iq, padd, pscale, pmul, pder, pint, pval, pdef, coef,
    X, Tt, Cc, ptx, pp, lin, plusC, fx, FX, GX, FCX, fp, is, DDX, ind, dfi, pvalJ, pdefJ, evlTold, num, vals, pAns, nzi, sg, fitYs, cf, P2
  } = B.kit.u26x;
  const ft = (name) => V(name || 'f') + '(' + Tt + ')';

  const hard = [
    H('hard-rational', '분수 꼴의 두 부정적분을 합쳐 다항함수로 바꾸기', '①9', (d, n) => {
      const p = d.pick([1, 2, 3, -1, -2]), c = nzi(d, -6, 6), p3 = p ** 3;
      if (n === 0) {
        // ∫x³/(x + p)dx + ∫p³/(x + p)dx = ∫(x² − px + p²)dx  (x ≠ −p)
        const k = d.until(() => d.pick([1, 2, 3, -1, -2, -3]), (x) => x !== -p), g = [p * p, -p, 1], ans = qadd(pdef(g, 0, k), c);
        const den = ptx([p, 1]);
        return num(`${X} ≠ ${iq(-p)}인 모든 실수 ${jh(X, '에서/에서')} 정의된 함수 ${jh(FX, '이/가')} 다음과 같다. ${is(fx('f', 0), c)}일 때, ${jh(fx('f', k), '의/의')} 값은?`, ans, {
          figure: hx(is(FX, `${ind(frac(X + sup(3), den))} ${p3 < 0 ? MINUS : '+'} ${ind(frac(Math.abs(p3), den))}`)),
          explain: `두 부정적분을 합치면 ${ind(frac(`${X}${sup(3)} ${p3 < 0 ? MINUS : '+'} ${Math.abs(p3)}`, den))} = ${ind(pp(g))} = ${plusC(ptx(pint(g)))}이다(${X}${sup(3)} ${p3 < 0 ? MINUS : '+'} ${Math.abs(p3)} = (${den})(${ptx(g)})). ${is(fx('f', 0), c)}에서 ${is(Cc, c)}이므로 ${is(fx('f', k), ans)}이다.`,
          facts: { value: `${J(k)}**3/3-${J(p)}*${J(k)}**2/2+${J(p)}**2*${J(k)}+${J(c)}` } });
      }
      // ∫x³/(x² + px + p²)dx − ∫p³/(x² + px + p²)dx = ∫(x − p)dx
      const k = nzi(d, -4, 4), den = ptx([p * p, p, 1]), ans = qadd(pdef([-p, 1], 0, k), c);
      return num(`함수 ${jh(FX, '이/가')} 다음과 같다. ${is(fx('f', 0), c)}일 때, ${jh(fx('f', k), '의/의')} 값은?`, ans, {
        figure: hx(is(FX, `${ind(frac(X + sup(3), den))} ${p3 < 0 ? '+' : MINUS} ${ind(frac(Math.abs(p3), den))}`)),
        explain: `두 부정적분을 합치면 ${ind(frac(`${X}${sup(3)} ${p3 < 0 ? '+' : MINUS} ${Math.abs(p3)}`, den))}이고 ${X}${sup(3)} ${p3 < 0 ? '+' : MINUS} ${Math.abs(p3)} = (${ptx([-p, 1])})(${den})이므로 ${is(FX, ind(pp([-p, 1])))} = ${plusC(ptx(pint([-p, 1])))}이다. ${is(Cc, c)}이므로 ${is(fx('f', k), ans)}이다.`,
        facts: { value: `${J(k)}**2/2-${J(p)}*${J(k)}+${J(c)}` } });
    }, { count: 2, standard: S2 }),
    H('hard-piecewise-deriv', '구간마다 다른 도함수 — 연속 조건으로 적분상수 잇기', '①14', (d, n) => {
      if (n === 0) {
        // f′(x) = ux (x ≥ s), vx² + wx (x < s), 모든 실수에서 미분가능
        const s = d.pick([1, 2, -1]), v = d.pick([3, -3, 6]), w = nzi(d, -4, 4), u = v * s + w, a = s - d.int(1, 2), b = s + d.int(1, 2);
        if (u === 0) return null;
        const ans = qadd(pdef([0, w, v], a, s), pdef([0, u], s, b));
        return num(`모든 실수 ${jh(X, '에서/에서')} 미분가능한 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), sys([`${ptx([0, u])} (${X} ≥ ${iq(s)})`, `${ptx([0, w, v])} (${X} &lt; ${iq(s)})`]))}일 때, ${fx('f', b)} ${MINUS} ${jh(fx('f', a), '의/의')} 값은?`, ans, {
          explain: `${X} ≥ ${iq(s)}에서 ${is(FX, plusC(ptx(pint([0, u]))).replace(Cc, V('C') + '<sub>1</sub>'))}, ${X} &lt; ${iq(s)}에서 ${is(FX, plusC(ptx(pint([0, w, v]))).replace(Cc, V('C') + '<sub>2</sub>'))}이다. ${is(X, s)}에서 연속이므로 두 식의 값이 같다는 조건으로 두 적분상수의 차를 정하면 ${fx('f', b)} ${MINUS} ${is(fx('f', a), `${dfi(a, s, pp([0, w, v]))} + ${dfi(s, b, pp([0, u]))}`)} = ${iq(ans)}이다.`,
          facts: { value: `(${pdefJ([0, w, v], a, s)})+(${pdefJ([0, u], s, b)})` } });
      }
      if (n === 1) {
        // f′(x) = α (x < −1), βx (−1 < x < 1), γ (x > 1), f(0) = c → f(P), f(Q)
        const al = d.pick([1, 2, 3, -1, -2]), be = d.pick([2, 4, -2, -4]), ga = d.pick([1, 2, 3, -1, -2, -3]), c = d.int(2, 8), P = d.int(3, 8), Qx = -d.int(3, 6);
        if (al === -be || ga === be || al === ga) return null;
        const fP = ga * (P - 1) + be / 2 + c, fQ = al * (Qx + 1) + be / 2 + c, top = Math.max(al, ga, Math.abs(be)) + 0.8, bot = Math.min(al, ga, -Math.abs(be)) - 0.8;
        const figure = plot({ x: [-3, 3], y: [Math.min(bot, -0.8), Math.max(top, 0.8)], ys: fitYs(6, Math.max(top, 0.8) - Math.min(bot, -0.8), 170), xt: [-1, 1], yt: [...new Set([al, ga, be, -be])].sort((x, y) => x - y),
          segs: [{ p: [-3, al], q: [-1, al], color: '#1d4ed8' }, { p: [-1, -be], q: [1, be], color: '#1d4ed8' }, { p: [1, ga], q: [3, ga], color: '#1d4ed8' }],
          dots: [{ x: -1, y: al, open: true }, { x: -1, y: -be, open: true }, { x: 1, y: be, open: true }, { x: 1, y: ga, open: true }],
          texts: [{ x: 2.2, y: ga, t: "y=f'(x)", side: ga > 0 ? 'u' : 'd' }],
          say: `y=f′(x)의 그래프: x < −1에서 y = ${al < 0 ? MINUS + Math.abs(al) : al}, −1 < x < 1에서 y = ${be < 0 ? MINUS + Math.abs(be) : be}x, x > 1에서 y = ${ga < 0 ? MINUS + Math.abs(ga) : ga}인 선분과 반직선.` });
        return M(`모든 실수 ${jh(X, '에서/에서')} 연속인 함수 ${jh(FX, '의/의')} 도함수 ${is(V('y'), fp('f'))}의 그래프가 그림과 같다. ${is(fx('f', 0), c)}일 때, ${jh(fx('f', P), '과/와')} ${jh(fx('f', Qx), '의/의')} 값은?`, [
          { lead: fx('f', P) + ' =', answer: fP, signed: true }, { lead: fx('f', Qx) + ' =', answer: fQ, signed: true }
        ], { figure, shown: `${is(fx('f', P), fP)}, ${is(fx('f', Qx), fQ)}`,
          explain: `${is(fx('f', 0), c)}이므로 ${MINUS}1 ≤ ${X} &lt; 1에서 ${is(FX, `${cf(Q(be, 2))}${X}${sup(2)} + ${c}`)}이고 ${is(fx('f', 1), be / 2 + c)}, ${is(fx('f', -1), be / 2 + c)}이다. 연속이므로 ${X} ≥ 1에서 ${is(FX, `${cf(ga)}(${X} ${MINUS} 1)${be / 2 + c === 0 ? '' : ' + ' + (be / 2 + c)}`)}, ${X} &lt; ${MINUS}1에서 ${is(FX, `${cf(al)}(${X} + 1)${be / 2 + c === 0 ? '' : ' + ' + (be / 2 + c)}`)}이다. 따라서 ${is(fx('f', P), fP)}, ${is(fx('f', Qx), fQ)}이다.`,
          facts: { calc: [[`${J(ga)}*(${P}-1)+${J(be)}/2+${c}`, 0], [`${J(al)}*(${J(Qx)}+1)+${J(be)}/2+${c}`, 1]] } });
      }
      // f′(x) = −kx (x ≥ 0), ux² + wx (x < 0), f(−a) = f(b)
      const a = d.pick([1, 2]), b = d.pick([1, 2]), u = d.pick([3, 6, -3]), w = nzi(d, -4, 4), I = qsub(Q(u * a ** 3, 3), Q(w * a * a, 2)), k = qdiv(qmul(2, I), b * b), val = nzi(d, -5, 5);
      if (!isI(k) || k.p === 0) return null;
      return num(`미분가능한 함수 ${jh(FX, '의/의')} 도함수 ${jh(fp('f'), '이/가')} ${is(fp('f'), sys([`${MINUS}${V('k')}${X} (${X} ≥ 0)`, `${ptx([0, w, u])} (${X} &lt; 0)`]))}이고 ${is(fx('f', -a), is(fx('f', b), val))}일 때, 상수 ${jh(V('k'), '의/의')} 값은?`, k, {
        explain: `${fx('f', b)} ${MINUS} ${is(fx('f', 0), dfi(0, b, `(${MINUS}${V('k')}${X})`))} = ${MINUS}${cf(Q(b * b, 2))}${V('k')}, ${fx('f', 0)} ${MINUS} ${is(fx('f', -a), dfi(-a, 0, pp([0, w, u])))} = ${iq(I)}이다. 두 식을 더하면 ${fx('f', b)} ${MINUS} ${is(fx('f', -a), 0)}이므로 ${is(V('k'), k)}이다.`,
        facts: { value: `2*(${J(u)}*${a}**3/3-${J(w)}*${a}**2/2)/${b}**2` } });
    }, { count: 3, standard: S2 }),
    H('hard-relation', 'F와 f 사이의 관계식에서 f 구하기', '①15', (d) => {
      const lam = d.pick([3, 6, -3, -6]), r = d.pick([1, 2, -1]), t0 = d.pick([1, -1]), al = d.int(-1, 1), be = al + d.int(1, 2);
      if ((lam * r) % 2 !== 0) return null;
      const f0 = [0, 0, Q(-3 * lam * r, 2), Q(4 * lam, 3)], C0 = qmul(-1, pval(f0, t0)), f = padd(f0, [C0]), ans = pdef(f, al, be);
      const h = `${lam < 0 ? '+' : MINUS} ${Math.abs(lam)}${X}${sup(3)}(${ptx([-r, 1])})`;
      return num(`${is(fx('f', t0), 0)}인 삼차함수 ${jh(FX, '와/와')} 그 부정적분 ${FCX} 사이에 ${is(FCX, `${X}${FX} ${h}`)}인 관계가 성립할 때, ${fx('F', be)} ${MINUS} ${jh(fx('F', al), '의/의')} 값은?`, ans, {
        explain: `양변을 미분하면 ${is(FX, `${FX} + ${X}${fp('f')} ${lam < 0 ? '+' : MINUS} ${Math.abs(4 * lam)}${X}${sup(3)} ${lam * r < 0 ? MINUS : '+'} ${Math.abs(3 * lam * r)}${X}${sup(2)}`)}이므로 ${is(fp('f'), ptx(pder(f0)))}이다. ${is(FX, plusC(ptx(f0)))}에서 ${is(fx('f', t0), 0)}이므로 ${is(Cc, C0)}이고, ${fx('F', be)} ${MINUS} ${is(fx('F', al), dfi(al, be, FX))} = ${iq(ans)}이다.`,
        facts: { value: `(4*${J(lam)}/3*(${J(be)}**4-${J(al)}**4)/4-3*${J(lam)}*${J(r)}/2*(${J(be)}**3-${J(al)}**3)/3)-(4*${J(lam)}/3*${J(t0)}**3-3*${J(lam)}*${J(r)}/2*${J(t0)}**2)*(${J(be)}-${J(al)})` } });
    }, { standard: S2 }),
    H('hard-degree', '차수를 따져 계수 비교로 함수 구하기', '①16', (d, n) => {
      if (n === 0) {
        // g(x) = ∫xf(x)dx, {f + g}′ = f′ + xf
        const a = nzi(d, -2, 2), b = nzi(d, -3, 3), c = nzi(d, -4, 4), e = nzi(d, -5, 5), f = [e, c, b, a], R = padd(pder(f), pmul([0, 1], f));
        if (R.some((x) => x.p === 0)) return null;
        return pAns(`다항함수 ${FX}에 대하여 ${is(GX, ind(X + FX))}이고 ${DDX}{${FX} + ${GX}} = ${ptx(R)}일 때, ${jh(FX, '을/를')} 구하시오.`, FX + ' =', f, [3, 2, 1, 0], false, {
          explain: `${is(V('g') + '′(' + X + ')', X + FX)}이므로 ${fp('f')} + ${X}${FX} = ${ptx(R)}이다. 우변이 사차식이므로 ${jh(FX, '은/는')} 삼차식이고, ${is(FX, `${V('a')}${X}${sup(3)} + ${V('b')}${X}${sup(2)} + ${V('c')}${X} + ${V('d')}`)}로 놓아 계수를 비교하면 ${is(FX, ptx(f))}이다.`,
          facts: { calc: [[J(coef(R, 4)), 0], [J(coef(R, 3)), 1], [J(coef(R, 0)), 2], [`${J(coef(R, 1))}-2*${J(coef(R, 3))}`, 3]] } });
      }
      // f = kx³ + ux + w, f + g 의 도함수가 f − g 의 부정적분 중 하나 → g = kx³ + (u − 12k)x + w
      const k = d.pick([1, 2]), u = nzi(d, -6, 6), w = nzi(d, -6, 6), g = [w, u - 12 * k, 0, k];
      if (u - 12 * k === 0) return null;
      return pAns(`함수 ${jh(is(FX, ptx([w, u, 0, k])), '과/와')} 최고차항의 계수가 ${jh(iq(-k), '이/가')} 아닌 삼차함수 ${GX}에 대하여 ${FX} + ${GX}의 도함수가 ${FX} ${MINUS} ${GX}의 부정적분 중 하나일 때, ${jh(GX, '을/를')} 구하시오.`, GX + ' =', g, [3, 1, 0], false, {
        explain: `${FX} ${MINUS} ${GX}는 ${FX} + ${GX}를 두 번 미분한 식이므로 일차 이하이다. 따라서 ${GX}의 삼차항은 ${ptx([0, 0, 0, k])}, 이차항은 없다. ${FX} + ${GX}를 두 번 미분하면 ${12 * k}${X}이므로 ${FX} ${MINUS} ${is(GX, `${12 * k}${X}`)}에서 ${is(GX, ptx(g))}이다.`,
        facts: { calc: [[J(k), 0], [`${J(u)}-12*${J(k)}`, 1], [J(w), 2]], derived: [12] } });
    }, { count: 2, standard: S2 }),
    H('hard-xt', '∫ₐˣ (x − t)f(t)dt = g(x) — x를 적분 밖으로 꺼내기', '①24', (d, n) => {
      const p = d.pick([1, 2, -1]);
      if (n === 0) {
        const c = d.pick([1, 2, -1]), a = -3 * c * p * p, b = 2 * c * p ** 3;
        return vals(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${dfi(p, 'x', `(${X} ${MINUS} ${Tt})${ft()}`, 't')} = ${c === 1 ? '' : c === -1 ? MINUS : c}${X}${sup(3)} + ${V('a')}${X} + ${jh(V('b'), '을/를')} 만족시킬 때, 상수 ${V('a')}, ${jh(V('b'), '의/의')} 값은?`, [[V('a'), a], [V('b'), b]], {
          explain: `좌변은 ${X}${dfi(p, 'x', ft(), 't')} ${MINUS} ${dfi(p, 'x', Tt + ft(), 't')}이다. ${jh(is(X, p), '을/를')} 대입하면 0 = ${iq(c * p ** 3)} ${sg(p)} ${cf(Math.abs(p))}${V('a')} + ${V('b')}이다. 양변을 미분하면 ${dfi(p, 'x', ft(), 't')} + ${X}${FX} ${MINUS} ${X}${is(FX, `${iq(3 * c)}${X}${sup(2)} + ${V('a')}`)}이므로 ${jh(is(X, p), '을/를')} 대입하면 ${is(V('a'), a)}, ${is(V('b'), b)}이다.`,
          facts: { calc: [[`-3*${J(c)}*${J(p)}**2`, 0], [`-${J(c)}*${J(p)}**3+3*${J(c)}*${J(p)}**3`, 1]] } });
      }
      const al = d.pick([1, 2, -1]), beta = nzi(d, -4, 4), G = pmul(pmul([-p, 1], [-p, 1]), [beta, al]), k = nzi(d, -3, 3), f = pder(pder(G));
      if (G.some((x) => x.p === 0)) return null;
      return num(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${dfi(p, 'x', `(${X} ${MINUS} ${Tt})${ft()}`, 't')} = ${jh(ptx(G), '을/를')} 만족시킬 때, ${jh(fx('f', k), '의/의')} 값은?`, pval(f, k), {
        explain: `좌변은 ${X}${dfi(p, 'x', ft(), 't')} ${MINUS} ${dfi(p, 'x', Tt + ft(), 't')}이고 양변을 미분하면 ${dfi(p, 'x', ft(), 't')} = ${ptx(pder(G))}이다. 한 번 더 미분하면 ${is(FX, ptx(f))}이므로 ${is(fx('f', k), pval(f, k))}이다.`,
        facts: { value: `6*${J(coef(G, 3))}*${J(k)}+2*${J(coef(G, 2))}` } });
    }, { count: 2, standard: S4 }),
    H('hard-moving', '위끝·아래끝이 모두 x의 식인 정적분으로 정의된 함수의 극값', '①26', (d) => {
      const al = d.pick([4, 8, -4, -8]), s = d.int(-1, 2), g = pscale(padd(pmul(pmul([-s, 1], [-s, 1]), [-s, 1]), [s, -1]), al);
      const a = al > 0 ? s : s + 1, b = Math.abs(al) / 4;
      return vals(`함수 ${is(FX, dfi('x-1', 'x', pp(g, Tt), 't'))}가 ${is(X, V('a'))}에서 극댓값 ${jh(V('b'), '을/를')} 가질 때, ${V('a')}, ${jh(V('b'), '의/의')} 값은?`, [[V('a'), a], [V('b'), b]], {
        explain: `${is(ft('g'), ptx(g, Tt))}라 하면 ${is(fp('f'), `${V('g')}(${X}) ${MINUS} ${V('g')}(${X} ${MINUS} 1)`)} = ${ptx([3 * al * s * (s + 1), -3 * al * (2 * s + 1), 3 * al])}이다(정적분을 먼저 셈하여 ${X}의 다항식으로 만든 뒤 미분해도 같다). ${is(fp('f'), 0)}인 ${is(X, s)}, ${is(X, s + 1)} 가운데 부호가 양에서 음으로 바뀌는 ${is(X, a)}에서 극대이고, 극댓값은 ${dfi(a - 1, a, pp(g, Tt), 't')} = ${b}이다.`,
        facts: { calc: [[`-(${J(coef(g, 2))})/(3*${J(coef(g, 3))})${al > 0 ? '' : '+1'}`, 0], [`${al > 0 ? '' : '-'}${J(coef(g, 3))}/4`, 1]] } });
    }, { standard: S4 }),
    H('hard-two-const', 'x가 섞인 정적분을 상수 둘로 놓아 함수 구하기', '①28', (d) => {
      const p = d.pick([3, 6, -6]), qq = d.pick([1, 2, 3, -2]), m = d.pick([1, 2, -1]);
      // A = ∫₀¹ f, B = ∫₀¹ t f:  (1 − q/2)A + B = p/3,  −(q/3)A + (3/2)B = p/4
      const a11 = qsub(1, Q(qq, 2)), a21 = Q(-qq, 3), det = qsub(qmul(a11, Q(3, 2)), qmul(1, a21));
      if (det.p === 0) return null;
      const A = qdiv(qsub(qmul(Q(p, 3), Q(3, 2)), Q(p, 4)), det), Bv = qdiv(qsub(qmul(a11, Q(p, 4)), qmul(a21, Q(p, 3))), det), ans = qsub(qadd(p * m * m, qmul(qq * m, A)), Bv);
      const Aj = `((${J(p)}/3*3/2-${J(p)}/4)/((1-${J(qq)}/2)*3/2+${J(qq)}/3))`, Bj = `(((1-${J(qq)}/2)*${J(p)}/4+${J(qq)}/3*${J(p)}/3)/((1-${J(qq)}/2)*3/2+${J(qq)}/3))`;
      return num(`다항함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${is(FX, `${iq(p)}${X}${sup(2)} + ${dfi(0, 1, `(${qq === 1 ? '' : qq === -1 ? MINUS : iq(qq)}${X} ${MINUS} ${Tt})${ft()}`, 't')}`)}를 만족시킬 때, ${jh(fx('f', m), '의/의')} 값은?`, ans, {
        explain: `${is(dfi(0, 1, ft(), 't'), V('a'))}, ${is(dfi(0, 1, Tt + ft(), 't'), V('b'))}로 놓으면 ${is(FX, `${iq(p)}${X}${sup(2)} ${sg(qq)} ${cf(Math.abs(qq))}${V('a')}${X} ${MINUS} ${V('b')}`)}이다. 이것을 두 정적분에 넣어 ${V('a')}, ${jh(V('b'), '에/에')} 대한 연립방정식을 풀면 ${is(V('a'), A)}, ${is(V('b'), Bv)}이므로 ${is(fx('f', m), ans)}이다.`,
        facts: { value: `${J(p)}*${J(m)}**2+${J(qq)}*${J(m)}*${Aj}-${Bj}` } });
    }, { standard: S4 }),
    H('hard-shift-piece', 'f(x − 1)을 식으로 바꾸어 xf(x − 1)의 정적분 구하기', '①46', (d) => {
      const s = d.pick([1, 2]), c = d.int(2, 6), e = s - s * s + c, K = d.pick([1, 2, 6]), al = d.int(0, s), be = s + d.int(2, 3);
      // f(x − 1) = −(x − 1)² + c (x ≤ s + 1), −(x − 1) + e (x > s + 1)
      const g1 = pmul([0, 1], [c - 1, 2, -1]), g2 = pmul([0, 1], [1 + e, -1]), I = qadd(pdef(g1, al, s + 1), pdef(g2, s + 1, be)), ans = qmul(K, I);
      return num(`함수 ${is(FX, sys([`${ptx([c, 0, -1])} (${X} ≤ ${s})`, `${ptx([e, -1])} (${X} &gt; ${s})`]))}에 대하여 ${jh(`${K === 1 ? '' : K}${dfi(al, be, X + fx('f', `${X} ${MINUS} 1`))}`, '의/의')} 값은?`, ans, {
        explain: `${X} ${MINUS} 1 ≤ ${s}, 곧 ${X} ≤ ${s + 1}일 때 ${is(fx('f', `${X} ${MINUS} 1`), ptx([c - 1, 2, -1]))}, ${X} &gt; ${s + 1}일 때 ${is(fx('f', `${X} ${MINUS} 1`), ptx([1 + e, -1]))}이다. ${jh(is(X, s + 1), '에서/에서')} 나누어 적분하면 ${dfi(al, s + 1, pp(g1))} + ${dfi(s + 1, be, pp(g2))} = ${iq(I)}이므로 구하는 값은 ${iq(ans)}이다.`,
        facts: { value: `${K}*((${pdefJ(g1, al, s + 1)})+(${pdefJ(g2, s + 1, be)}))` } });
    }, { standard: S4 }),
    H('hard-even', '우함수와의 곱의 정적분 — 원점 대칭인 부분은 0', '①48', (d) => {
      const a = d.pick([1, 2, 3]), u = nzi(d, -3, 3), w = nzi(d, -4, 4), z = d.pick([2, 3, -2, 4]), v = nzi(d, -5, 6), ans = 2 * z * v;
      const body = `(${ptx([z, w, 0, u])})${FX}`;
      return num(`다항함수 ${jh(FX, '이/가')} 다음 조건을 만족시킬 때, ${jh(dfi(-a, a, body), '의/의')} 값은?${lines([`㈎ 모든 실수 ${jh(X, '에/에')} 대하여 ${is(fx('f', MINUS + X), FX)}이다.`, `㈏ ${is(dfi(0, a, FX), v)}`])}`, ans, {
        explain: `${is(fx('f', MINUS + X), FX)}이므로 ${X}${sup(3)}${FX}, ${X}${FX}의 그래프는 원점에 대하여 대칭이고 ${MINUS}${a}부터 ${a}까지의 정적분은 0이다. 따라서 구하는 값은 ${iq(z)}${dfi(-a, a, FX)} = ${iq(2 * z)}${dfi(0, a, FX)} = ${iq(ans)}이다.`,
        facts: { value: `2*${J(z)}*${J(v)}` } });
    }, { standard: S3 }),
    H('hard-period', '주기·대칭 조건이 있는 연속함수의 정적분', '①49', (d, n) => {
      if (n === 0) {
        // f(x + 3) = f(x), ∫(t−2 ~ t+4) f = A, ∫(t+1 ~ t+5) f = B → ∫(t+2 ~ t+7) f = 3A/2 − B
        const t = d.int(-1, 2), A = 2 * nzi(d, -4, 6), Bv = d.until(() => nzi(d, -6, 9), (v) => v !== A), ans = 3 * A / 2 - Bv;
        return num(`실수 전체의 집합에서 연속인 함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 ${is(fx('f', `${X} + 3`), FX)}를 만족시킨다. ${is(dfi(t - 2, t + 4, FX), A)}, ${is(dfi(t + 1, t + 5, FX), Bv)}일 때, ${jh(dfi(t + 2, t + 7, FX), '의/의')} 값은?`, ans, {
          explain: `길이가 3인 구간의 정적분은 모두 ${iq(Q(A, 2))}이다. ${is(dfi(t + 1, t + 5, FX), `${iq(Q(A, 2))} + ${dfi(t + 4, t + 5, FX)}`)}에서 ${is(dfi(t + 1, t + 2, FX), Bv - A / 2)}이고, ${is(dfi(t + 2, t + 7, FX), `${dfi(t + 2, t + 5, FX)} + ${dfi(t + 5, t + 7, FX)}`)} = ${iq(Q(A, 2))} + (${iq(Q(A, 2))} ${MINUS} ${P2(Bv - A / 2)}) = ${iq(ans)}이다.`,
          facts: { value: `3*${J(A)}/2-${J(Bv)}` } });
      }
      const c = d.pick([1, 2, 3]), [m1, m2] = d.pick([[1, 3], [2, 2], [1, 5], [3, 1], [2, 4]]), v = nzi(d, -5, 6), ans = (m1 + m2) / 2 * v;
      return num(`연속함수 ${jh(FX, '이/가')} 모든 실수 ${jh(X, '에/에')} 대하여 다음 조건을 모두 만족시킨다. ${is(dfi(0, 2 * c, FX), v)}일 때, ${jh(dfi(-m1 * c, m2 * c, FX), '의/의')} 값은?${lines([`㈎ ${is(fx('f', MINUS + X), FX)}`, `㈏ ${fx('f', `${c} + ${X}`)} ${MINUS} ${is(fx('f', `${c} ${MINUS} ${X}`), 0)}`])}`, ans, {
        explain: `㈏에서 ${is(fx('f', `${c} + ${X}`), fx('f', `${c} ${MINUS} ${X}`))}이고 ㈎에서 ${is(fx('f', `${c} ${MINUS} ${X}`), fx('f', `${X} ${MINUS} ${c}`))}이므로 ${is(fx('f', `${X} + ${2 * c}`), FX)}이다. 길이가 ${2 * c}인 구간의 정적분은 모두 ${iq(v)}이고 구간의 길이가 ${(m1 + m2) * c}이므로 구하는 값은 ${iq(ans)}이다.`,
        facts: { value: `(${m1 * c}+${m2 * c})/(2*${c})*${J(v)}` } });
    }, { count: 2, standard: S3 })
  ];

  B.addGroup('11-2-6', { id: 'hard', title: '실력 문제', standard: S4, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
