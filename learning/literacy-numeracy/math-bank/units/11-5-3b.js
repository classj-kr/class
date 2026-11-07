// 미적분Ⅱ Ⅱ-1 여러 가지 함수의 미분 — 뒤쪽 묶음(삼각함수의 덧셈정리, 삼각함수의 극한, 사인함수와 코사인함수의 도함수).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-3a.js 머리에 적었다. 도구는 11-5-3a.js 가 내보낸 B.kit.u53x 를 쓰고, 근호가 든 수의 셈(Rad)은 여기서 지어 B.kit.u53b 로 내보낸다.
// ref: ①n = 기본꼴_1의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, box } = B.kit;
  const { MINUS, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, fl, V, rt, sqParts } = B.kit.mid;
  const { ms, lim, trig, ln, jh, hx, signed } = B.kit.hs;
  const K = B.kit.u53x, nb = K.nb;
  const { S2, S3, T, X, Tt, Hh, Av, Bv, Kv, Ee, sT, pp, jn, qT, cf, cond, fIs, yIs, lf, ax, onePlus, yp, val, slots, close, near, nd, valQ, derivQ, okQ, tripleQ } = K;

  // ── 근호가 든 수(Rad): { r: 유리수 } — 값 = Σ q·√r (r 은 제곱 인수가 없는 자연수, r = 1 은 유리수 부분) ──
  const Rd = (obj) => { const out = {}; for (const [r, q] of Object.entries(obj)) if (q.p !== 0) out[r] = q; return out; };
  const toQ = (q) => (typeof q === 'number' ? Q(q) : q);
  const rq = (q) => Rd({ 1: toQ(q) });                                                   // 유리수
  const rr = (q, r) => { const [a, b] = sqParts(r); return Rd({ [b]: qmul(toQ(q), Q(a)) }); };   // q√r
  const radd = (x, y) => { const out = Object.assign({}, x); for (const [r, q] of Object.entries(y)) out[r] = out[r] ? qadd(out[r], q) : q; return Rd(out); };
  const rneg = (x) => Rd(Object.fromEntries(Object.entries(x).map(([r, q]) => [r, qneg(q)])));
  const rsub = (x, y) => radd(x, rneg(y));
  const rmul = (x, y) => { let out = {}; for (const [r1, q1] of Object.entries(x)) for (const [r2, q2] of Object.entries(y)) { const [a, b] = sqParts(Number(r1) * Number(r2)); out = radd(out, { [b]: qmul(qmul(q1, q2), Q(a)) }); } return out; };
  // 역수: 항이 하나면 √r 을 곱하고, 둘이면 켤레를 곱해 분모를 유리수로 만든다(셋 이상은 null).
  function rinv(x) {
    const ks = Object.keys(x);
    if (ks.length === 1) { const r = Number(ks[0]), q = x[ks[0]]; return Rd({ [r]: Q(q.q, q.p * r) }); }
    if (ks.length !== 2) return null;
    const conj = Rd({ [ks[0]]: x[ks[0]], [ks[1]]: qneg(x[ks[1]]) }), den = rmul(x, conj), dk = Object.keys(den);
    if (dk.length !== 1 || dk[0] !== '1') return null;
    return rmul(conj, rq(Q(den[1].q, den[1].p)));
  }
  const rdiv = (x, y) => { const v = rinv(y); return v ? rmul(x, v) : null; };
  const rval = (x) => Object.entries(x).reduce((s, [r, q]) => s + fl(q) * Math.sqrt(Number(r)), 0);
  const nTerms = (x) => Object.keys(x).length;
  // 글: 분모를 하나로 모아 (a + b√c)/d 꼴로. 앞 항은 양수로 두고, 분모가 있고 모든 항이 음수이면 −를 앞으로 뺀다.
  function rH(x) {
    const ent = Object.entries(x).map(([r, q]) => [Number(r), q]).sort((a, b) => a[0] - b[0]);
    if (!ent.length) return '0';
    const D = ent.reduce((m, [, q]) => lcm(m, q.q), 1);
    let ts = ent.map(([r, q]) => [r, (q.p * D) / q.q]), neg = false;
    if (D > 1 && ts.every(([, c]) => c < 0)) { neg = true; ts = ts.map(([r, c]) => [r, -c]); }
    else if (ts[0][1] < 0 && ts.some(([, c]) => c > 0)) { const i = ts.findIndex(([, c]) => c > 0); ts = [ts[i]].concat(ts.filter((_, j) => j !== i)); }
    const term = (r, c) => (r === 1 ? String(Math.abs(c)) : (Math.abs(c) === 1 ? '' : Math.abs(c)) + rt(r));
    const num = ts.map(([r, c], i) => (i === 0 ? (c < 0 ? MINUS : '') : c < 0 ? ' − ' : ' + ') + term(r, c)).join('');
    return nb((neg ? MINUS : '') + (D === 1 ? num : frac(num, D)));
  }
  const rOpt = (x) => ({ h: rH(x), v: rval(x) });

  // ── 특수각의 삼각함수(도) ──
  const SIN = { 0: rq(0), 30: rq(Q(1, 2)), 45: rr(Q(1, 2), 2), 60: rr(Q(1, 2), 3), 90: rq(1) };
  function sinD(deg) {
    let t = ((deg % 360) + 360) % 360, sg = 1;
    if (t > 180) { t -= 180; sg = -1; }
    if (t > 90) t = 180 - t;
    if (!(t in SIN)) throw new Error('특수각이 아니다: ' + deg);
    return sg < 0 ? rneg(SIN[t]) : SIN[t];
  }
  const cosD = (deg) => sinD(90 - deg);
  const tanD = (deg) => rdiv(sinD(deg), cosD(deg));
  // 각의 글: 도(°) 또는 호도(π/12 꼴)
  const piQ = (q) => { const n = Math.abs(q.p), head = (n === 1 ? '' : n) + 'π', sg = q.p < 0 ? MINUS : ''; return q.q === 1 ? sg + head : nb(sg + frac(head, q.q)); };
  const angH = (deg, rad) => (rad ? piQ(Q(deg, 180)) : nb(sT(deg) + '°'));
  const angS = (deg) => { const q = Q(deg, 180), n = Math.abs(q.p); return (q.p < 0 ? '-' : '') + (n === 1 ? '' : n) + 'π' + (q.q === 1 ? '' : '/' + q.q); };   // lim 아래 글(π/6)
  const QUAD = [null, [0, 1, 2], [1, 2, 1], [2, 3, 2], [3, 4, 2]];   // 사분면 n 의 범위 (lo·π/2 < θ < hi·π/2)
  const range = (name, n) => { const [lo, hi] = QUAD[n]; const e = (k) => (k === 0 ? '0' : piQ(Q(k, 2))); return nb(e(lo) + ' &lt; ' + V(name) + ' &lt; ' + e(hi)); };
  const AL = V('α'), BE = V('β');

  // ════════════════════════════════════════════════════════════════
  // ── 삼각함수의 덧셈정리 ──
  // 여섯 식: [이름, 옳은 식(α, β → 값), 글]. 틀린 식은 부호·짝을 바꾼 것.
  const sA = trig('sin', 'α'), cA = trig('cos', 'α'), tA = trig('tan', 'α'), sB = trig('sin', 'β'), cB = trig('cos', 'β'), tB = trig('tan', 'β');
  const LHS = { sp: trig('sin', '(α + β)'), sm: trig('sin', '(α - β)'), cp: trig('cos', '(α + β)'), cm: trig('cos', '(α - β)'), tp: trig('tan', '(α + β)'), tm: trig('tan', '(α - β)') };
  const addf = [
    // 덧셈정리 식의 참·거짓: 식마다 여러 (α, β)에서 양쪽 값을 셈해 가린다.
    T('add-identity', '덧셈정리 식의 참·거짓', '①29', (d) => {
      const S = Math.sin, Cc = Math.cos, Tn = Math.tan;
      const rows = [
        [LHS.sp, `${sA}${cB} + ${cA}${sB}`, (a, b) => S(a) * Cc(b) + Cc(a) * S(b), (a, b) => S(a + b)],
        [LHS.sp, `${sA} + ${sB}`, (a, b) => S(a) + S(b), (a, b) => S(a + b)],
        [LHS.sp, `${sA}${cB} − ${cA}${sB}`, (a, b) => S(a) * Cc(b) - Cc(a) * S(b), (a, b) => S(a + b)],
        [LHS.sm, `${sA}${cB} − ${cA}${sB}`, (a, b) => S(a) * Cc(b) - Cc(a) * S(b), (a, b) => S(a - b)],
        [LHS.sm, `${sA}${cB} + ${cA}${sB}`, (a, b) => S(a) * Cc(b) + Cc(a) * S(b), (a, b) => S(a - b)],
        [LHS.cp, `${cA}${cB} − ${sA}${sB}`, (a, b) => Cc(a) * Cc(b) - S(a) * S(b), (a, b) => Cc(a + b)],
        [LHS.cp, `${cA}${cB} + ${sA}${sB}`, (a, b) => Cc(a) * Cc(b) + S(a) * S(b), (a, b) => Cc(a + b)],
        [LHS.cm, `${cA}${cB} + ${sA}${sB}`, (a, b) => Cc(a) * Cc(b) + S(a) * S(b), (a, b) => Cc(a - b)],
        [LHS.cm, `${cA}${cB} − ${sA}${sB}`, (a, b) => Cc(a) * Cc(b) - S(a) * S(b), (a, b) => Cc(a - b)],
        [LHS.cm, `${cA} − ${cB}`, (a, b) => Cc(a) - Cc(b), (a, b) => Cc(a - b)],
        [LHS.tp, frac(`${tA} + ${tB}`, `1 − ${tA}${tB}`), (a, b) => (Tn(a) + Tn(b)) / (1 - Tn(a) * Tn(b)), (a, b) => Tn(a + b)],
        [LHS.tp, frac(`${tA} + ${tB}`, `1 + ${tA}${tB}`), (a, b) => (Tn(a) + Tn(b)) / (1 + Tn(a) * Tn(b)), (a, b) => Tn(a + b)],
        [LHS.tm, frac(`${tA} − ${tB}`, `1 + ${tA}${tB}`), (a, b) => (Tn(a) - Tn(b)) / (1 + Tn(a) * Tn(b)), (a, b) => Tn(a - b)],
        [LHS.tm, frac(`${tA} − ${tB}`, `1 − ${tA}${tB}`), (a, b) => (Tn(a) - Tn(b)) / (1 - Tn(a) * Tn(b)), (a, b) => Tn(a - b)]
      ];
      const pairs = [[0.3, 0.5], [1.1, -0.4], [-0.7, 0.2]], holds = (r) => pairs.every(([a, b]) => near(r[2](a, b), r[3](a, b)));
      const want = d.bool(), pickOk = d.shuffle(rows.filter((r) => holds(r) === want)), pickNo = d.shuffle(rows.filter((r) => holds(r) !== want));
      const list = [pickOk[0]].concat(pickNo.slice(0, 4)).map((r) => ({ h: nb(r[0] + ' = ' + r[1]), ok: holds(r) === want }));
      return okQ(d, `다음 중 모든 실수 ${AL}, ${BE}에 대하여 성립${want ? '하는' : '하지 않는'} 것은? (단, 탄젠트가 든 식은 값이 정의되는 ${AL}, ${BE}만 생각한다.)`, list, {
        explain: `삼각함수의 덧셈정리는 ${nb(LHS.sp + ' = ' + sA + cB + ' + ' + cA + sB)}, ${nb(LHS.cp + ' = ' + cA + cB + ' − ' + sA + sB)}, ${nb(LHS.tp + ' = ' + frac(tA + ' + ' + tB, '1 − ' + tA + tB))}이고, ${BE} 대신 ${MINUS}${BE}를 넣으면 차의 공식이 된다. 합의 삼각함수는 삼각함수의 합이 아니다.`
      });
    }, { standard: S2 }),

    // n = 0: sin·cos(답 (√6 ± √2)/4 꼴), n = 1: tan(답 2 ± √3 꼴). 각은 도 또는 호도로 적는다.
    T('add-special', '특수각의 합·차로 나타낸 각의 삼각함수 값', '①30', (d, n) => {
      const [deg, a1, a2, op] = d.pick([[15, 45, 30, -1], [75, 45, 30, 1], [105, 60, 45, 1], [165, 120, 45, 1], [195, 150, 45, 1], [255, 210, 45, 1]]), rad = d.bool();
      const fname = n === 0 ? d.pick(['sin', 'cos']) : 'tan';
      const s1 = sinD(a1), c1 = cosD(a1), s2 = sinD(a2), c2 = cosD(a2);
      let v, how;
      if (fname === 'sin') { v = op > 0 ? radd(rmul(s1, c2), rmul(c1, s2)) : rsub(rmul(s1, c2), rmul(c1, s2)); how = `${trig('sin', angH(a1, rad))}${trig('cos', angH(a2, rad))} ${op > 0 ? '+' : '−'} ${trig('cos', angH(a1, rad))}${trig('sin', angH(a2, rad))}`; }
      else if (fname === 'cos') { v = op > 0 ? rsub(rmul(c1, c2), rmul(s1, s2)) : radd(rmul(c1, c2), rmul(s1, s2)); how = `${trig('cos', angH(a1, rad))}${trig('cos', angH(a2, rad))} ${op > 0 ? '−' : '+'} ${trig('sin', angH(a1, rad))}${trig('sin', angH(a2, rad))}`; }
      else { const t1 = tanD(a1), t2 = tanD(a2); v = op > 0 ? rdiv(radd(t1, t2), rsub(rq(1), rmul(t1, t2))) : rdiv(rsub(t1, t2), radd(rq(1), rmul(t1, t2))); how = frac(`${trig('tan', angH(a1, rad))} ${op > 0 ? '+' : '−'} ${trig('tan', angH(a2, rad))}`, `1 ${op > 0 ? '−' : '+'} ${trig('tan', angH(a1, rad))}${trig('tan', angH(a2, rad))}`); }
      const target = (fname === 'sin' ? Math.sin : fname === 'cos' ? Math.cos : Math.tan)((deg * Math.PI) / 180);
      const p62 = radd(rr(Q(1, 4), 6), rr(Q(1, 4), 2)), m62 = rsub(rr(Q(1, 4), 6), rr(Q(1, 4), 2)), t23 = radd(rq(2), rr(1, 3)), u23 = rsub(rq(2), rr(1, 3));
      const fam = n === 0 ? [p62, m62, rneg(p62), rneg(m62), radd(rr(Q(1, 4), 3), rq(Q(1, 4))), radd(rr(Q(1, 2), 3), rq(Q(1, 2))), rr(Q(1, 2), 2), rr(Q(1, 2), 3)]
        : [t23, u23, rneg(t23), rneg(u23), rsub(rr(1, 3), rq(1)), radd(rr(Q(1, 3), 3), rq(1)), rr(1, 3), rr(Q(1, 3), 3)];
      return valQ(d, `${trig(fname, angH(deg, rad))}의 값은?`, target, rOpt(v), fam.map(rOpt), {
        explain: `${nb(angH(deg, rad) + ' = ' + angH(a1, rad) + (op > 0 ? ' + ' : ' − ') + angH(a2, rad))}이므로 덧셈정리에 의하여 ${trig(fname, angH(deg, rad))} = ${how} = ${rH(v)}이다.`
      });
    }, { count: 2, standard: S2 }),

    // 한 각의 삼각함수 값과 사분면으로 나머지 값을 구해 합·차의 삼각함수 값. n = 0: 피타고라스 수(답은 늘 분수), n = 1: 근호가 든 값(고르기)
    T('add-quad', '사분면과 삼각함수 값으로 합·차의 삼각함수 값', '①31', (d, n) => {
      const quadSign = (qd) => [null, [1, 1], [1, -1], [-1, -1], [-1, 1]][qd];   // [sin 의 부호, cos 의 부호]
      const ask = d.pick(['sp', 'sm', 'cp', 'cm', 'tp', 'tm']);
      if (n === 0) {
        const tri = () => d.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
        const make = (name) => {
          const [a, b, c] = d.shuffle(tri()).sort((x, y) => x - y), qd = d.pick([1, 2, 3, 4]), [ss, cs] = quadSign(qd), giveSin = d.bool(), pickA = d.bool();
          const s = Q(ss * (pickA ? a : b), c), co = Q(cs * (pickA ? b : a), c);
          return { s, c: co, qd, giveSin, name, said: giveSin ? nb(trig('sin', name) + ' = ' + qT(s)) : nb(trig('cos', name) + ' = ' + qT(co)) };
        };
        const P = make('α'), R = make('β');
        const t = (x) => (x.c.p === 0 ? null : qdiv(x.s, x.c)), tp = t(P), tr = t(R);
        if (!tp || !tr) return null;
        const F = {
          sp: () => qadd(qmul(P.s, R.c), qmul(P.c, R.s)), sm: () => qsub(qmul(P.s, R.c), qmul(P.c, R.s)), cp: () => qsub(qmul(P.c, R.c), qmul(P.s, R.s)), cm: () => qadd(qmul(P.c, R.c), qmul(P.s, R.s)),
          tp: () => { const dd = qsub(Q(1), qmul(tp, tr)); return dd.p === 0 ? null : qdiv(qadd(tp, tr), dd); }, tm: () => { const dd = qadd(Q(1), qmul(tp, tr)); return dd.p === 0 ? null : qdiv(qsub(tp, tr), dd); }
        };
        const v = F[ask]();
        if (!v || v.q === 1) return null;
        const A0 = Math.atan2(fl(P.s), fl(P.c)), B0 = Math.atan2(fl(R.s), fl(R.c)), target = { sp: Math.sin(A0 + B0), sm: Math.sin(A0 - B0), cp: Math.cos(A0 + B0), cm: Math.cos(A0 - B0), tp: Math.tan(A0 + B0), tm: Math.tan(A0 - B0) }[ask];
        if (!close(fl(v), target)) throw new Error('덧셈정리 셈이 각의 값과 다르다');
        const other = (x) => (x.giveSin ? nb(trig('cos', x.name) + ' = ' + qT(x.c)) : nb(trig('sin', x.name) + ' = ' + qT(x.s)));
        const fJ = (q) => '(' + q.p + '/' + q.q + ')', sJ = (x) => fJ(x.s), cJ = (x) => fJ(x.c);
        const value = { sp: `${sJ(P)}*${cJ(R)}+${cJ(P)}*${sJ(R)}`, sm: `${sJ(P)}*${cJ(R)}-${cJ(P)}*${sJ(R)}`, cp: `${cJ(P)}*${cJ(R)}-${sJ(P)}*${sJ(R)}`, cm: `${cJ(P)}*${cJ(R)}+${sJ(P)}*${sJ(R)}`,
          tp: `(${sJ(P)}/${cJ(P)}+${sJ(R)}/${cJ(R)})/(1-${sJ(P)}/${cJ(P)}*${sJ(R)}/${cJ(R)})`, tm: `(${sJ(P)}/${cJ(P)}-${sJ(R)}/${cJ(R)})/(1+${sJ(P)}/${cJ(P)}*${sJ(R)}/${cJ(R)})` }[ask];
        const hid = [P, R].map((x) => Math.abs(x.giveSin ? x.c.p : x.s.p));
        return val(`${P.said}, ${R.said}일 때, ${LHS[ask]}의 값은? (단, ${range('α', P.qd)}, ${range('β', R.qd)})`, v, {
          explain: `${range('α', P.qd)}, ${range('β', R.qd)}에서 부호를 따지면 ${other(P)}, ${other(R)}이다${ask[0] === 't' ? `. 따라서 ${nb(tA + ' = ' + qT(tp))}, ${nb(tB + ' = ' + qT(tr))}이다` : ''}. 덧셈정리에 의하여 ${nb(LHS[ask] + ' = ' + qT(v))}이다.`,
          value, derived: hid
        });
      }
      // 근호가 든 값: 주는 값은 분수, 나머지 값은 근호. 한쪽이 특수각인 꼴도 섞는다(기초력 02-3).
      const give = () => d.pick([Q(1, 3), Q(2, 3), Q(1, 4), Q(3, 4), Q(1, 2), Q(2, 5)]);
      const rad = (g, sg) => { const s2 = qsub(Q(1), qmul(g, g)), [a, b] = sqParts(s2.p * s2.q); return rr(Q(sg * a, s2.q), b); };   // √(1 − g²) 에 부호
      const make = (name, special) => {
        if (special) { const deg = d.pick([30, 45, 60]); return { s: sinD(deg), c: cosD(deg), special: deg, name }; }
        const qd = d.pick([1, 2, 3, 4]), [ss, cs] = quadSign(qd), g = give(), giveSin = d.bool();
        return giveSin ? { s: rq(qmul(g, Q(ss))), c: rad(g, cs), qd, giveSin, g: qmul(g, Q(ss)), name } : { c: rq(qmul(g, Q(cs))), s: rad(g, ss), qd, giveSin, g: qmul(g, Q(cs)), name };
      };
      const sp = d.bool() && ask !== 'tp' && ask !== 'tm', P = make('α', false), R = make('β', sp);
      const vals = (x, flip) => ({ s: x.giveSin === false && flip ? rneg(x.s) : x.s, c: x.giveSin && flip ? rneg(x.c) : x.c });
      const calc = (p, r) => {
        const tp = rdiv(p.s, p.c), tr = rdiv(r.s, r.c);
        return {
          sp: radd(rmul(p.s, r.c), rmul(p.c, r.s)), sm: rsub(rmul(p.s, r.c), rmul(p.c, r.s)), cp: rsub(rmul(p.c, r.c), rmul(p.s, r.s)), cm: radd(rmul(p.c, r.c), rmul(p.s, r.s)),
          tp: tp && tr ? rdiv(radd(tp, tr), rsub(rq(1), rmul(tp, tr))) : null, tm: tp && tr ? rdiv(rsub(tp, tr), radd(rq(1), rmul(tp, tr))) : null
        };
      };
      const right = calc(P, R)[ask];
      if (!right || nTerms(right) > 2 || Object.values(right).some((q) => q.q > 60 || Math.abs(q.p) > 60)) return null;
      const A0 = Math.atan2(rval(P.s), rval(P.c)), B0 = Math.atan2(rval(R.s), rval(R.c)), target = { sp: Math.sin(A0 + B0), sm: Math.sin(A0 - B0), cp: Math.cos(A0 + B0), cm: Math.cos(A0 - B0), tp: Math.tan(A0 + B0), tm: Math.tan(A0 - B0) }[ask];
      const pair = { sp: 'sm', sm: 'sp', cp: 'cm', cm: 'cp', tp: 'tm', tm: 'tp' }[ask], cross = { sp: 'cp', sm: 'cm', cp: 'sp', cm: 'sm', tp: 'sp', tm: 'sm' }[ask];
      const all = calc(P, R), flipA = calc(vals(P, true), R), flipB = R.special ? null : calc(P, vals(R, true));
      const wr = [all[pair], all[cross], rneg(right), flipA[ask], flipB && flipB[ask], flipA[pair]].filter((x) => x && nTerms(x) <= 3).map(rOpt);
      const qs = (x) => (x.special ? '' : range(x.name, x.qd)), said = (x) => (x.giveSin ? nb(trig('sin', x.name) + ' = ' + qT(x.g)) : nb(trig('cos', x.name) + ' = ' + qT(x.g)));
      const other = (x) => (x.giveSin ? nb(trig('cos', x.name) + ' = ' + rH(x.c)) : nb(trig('sin', x.name) + ' = ' + rH(x.s)));
      const bAng = R.special ? piQ(Q(R.special, 180)) : null, lhs = R.special ? trig(ask[0] === 's' ? 'sin' : 'cos', nb('(' + AL + (ask[1] === 'p' ? ' + ' : ' − ') + bAng + ')')) : LHS[ask];
      return valQ(d, `${said(P)}${R.special ? '' : ', ' + said(R)}일 때, ${lhs}의 값은? (단, ${[qs(P), qs(R)].filter(Boolean).join(', ')})`, target, rOpt(right), wr, {
        explain: `${qs(P)}에서 ${other(P)}${R.special ? '' : '이고, ' + qs(R) + '에서 ' + other(R)}이다. 덧셈정리에 의하여 ${nb(lhs + ' = ' + rH(right))}이다.`
      });
    }, { count: 2, standard: S2 }),

    // tan(α ± π/4) = k 에서 tan α 를 거꾸로 — 답은 늘 분수
    T('add-tanback', 'tan(α ± π/4)의 값으로 tan α 구하기', '①32', (d) => {
      const plus = d.bool(), k = d.pick([2, 3, 4, 5, -4, -5, -6, -2, -3]), v = plus ? Q(k - 1, k + 1) : Q(1 + k, 1 - k);
      if (v.q === 1 || k + 1 === 0 || 1 - k === 0) return null;
      const lhs = trig('tan', nb('(' + AL + (plus ? ' + ' : ' − ') + frac('π', 4) + ')'));
      return val(`${nb(lhs + ' = ' + sT(k))}일 때, ${tA}의 값은?`, v, {
        explain: `${nb(trig('tan', frac('π', 4)) + ' = 1')}이므로 ${nb(lhs + ' = ' + frac(tA + (plus ? ' + ' : ' − ') + '1', '1 ' + (plus ? '−' : '+') + ' ' + tA))}이다. ${jh(nb(frac(tA + (plus ? ' + ' : ' − ') + '1', '1 ' + (plus ? '−' : '+') + ' ' + tA) + ' = ' + sT(k)), '을/를')} 풀면 ${nb(tA + ' = ' + qT(v))}이다.`,
        value: plus ? `(${jn(k)}-1)/(${jn(k)}+1)` : `(1+${jn(k)})/(1-${jn(k)})`
      });
    }, { standard: S2 }),

    // ax² + bx + c = 0 의 두 근이 tan α, tan β → tan(α + β) = −b/(a − c) — 답은 늘 정수
    T('add-roots', '이차방정식의 두 근으로 tan(α + β) 구하기', '①33', (d) => {
      const a = d.pick([1, 2, 3]), b = d.pick([-9, -8, -6, -5, -4, -3, 3, 4, 5, 6, 8]), c = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      if (a === c || b * b - 4 * a * c <= 0 || (-b) % (a - c) !== 0) return null;
      const ans = -b / (a - c), eq = ms((a === 1 ? '' : a) + 'x^2 ' + (b < 0 ? '- ' + (b === -1 ? '' : -b) : '+ ' + (b === 1 ? '' : b)) + 'x ' + (c < 0 ? '- ' + -c : '+ ' + c) + ' = 0');
      return val(`이차방정식 ${nb(eq)}의 두 실근이 ${tA}, ${tB}일 때, ${LHS.tp}의 값은?`, ans, {
        explain: `근과 계수의 관계에 의하여 ${nb(tA + ' + ' + tB + ' = ' + qT(Q(-b, a)))}, ${nb(tA + tB + ' = ' + qT(Q(c, a)))}이므로 ${nb(LHS.tp + ' = ' + frac(qT(Q(-b, a)), '1 − ' + (c * a < 0 ? '(' + qT(Q(c, a)) + ')' : qT(Q(c, a)))) + ' = ' + sT(ans))}이다.`,
        value: `(0-${jn(b)})/${a}/(1-${jn(c)}/${a})`
      });
    }, { standard: S2 }),

    // 두 직선이 이루는 예각 θ 의 tan θ — 답은 늘 분수
    T('add-lines', '두 직선이 이루는 예각의 tan 값', '①35', (d) => {
      const M = [Q(1), Q(2), Q(3), Q(-1), Q(-2), Q(1, 2), Q(1, 3), Q(-1, 2), Q(-1, 3), Q(4), Q(-3)];
      const m1 = d.pick(M), m2 = d.pick(M), k1 = d.pick([0, 1, -1, 2, -2]), k2 = d.pick([0, 1, -1, 3, -3]);
      if (m1.p * m2.q === m2.p * m1.q) return null;
      const den = qadd(Q(1), qmul(m1, m2));
      if (den.p === 0) return null;
      const t0 = qdiv(qsub(m1, m2), den), t = Q(Math.abs(t0.p), t0.q);
      if (t.q === 1) return null;
      const lineS = (m, k) => { const mh = m.q === 1 ? (m.p === 1 ? '' : m.p === -1 ? MINUS : sT(m.p)) : (m.p < 0 ? MINUS : '') + frac(Math.abs(m.p), m.q); return nb(ms('y = ') + mh + X + (k === 0 ? '' : k < 0 ? ' − ' + -k : ' + ' + k)); };
      const target = Math.abs(Math.tan(Math.atan(fl(m1)) - Math.atan(fl(m2))));
      const tt = Math.min(target, Math.abs(Math.tan(Math.PI - Math.abs(Math.atan(fl(m1)) - Math.atan(fl(m2))))));
      if (!close(fl(t), tt)) throw new Error('예각의 탄젠트가 다르다');
      return val(`두 직선 ${lineS(m1, k1)}, ${jh(lineS(m2, k2), '이/가')} 이루는 예각의 크기를 ${V('θ')}라 할 때, ${trig('tan', 'θ')}의 값은?`, t, {
        explain: `두 직선이 ${X}축의 양의 방향과 이루는 각의 크기를 ${AL}, ${BE}라 하면 ${nb(tA + ' = ' + qT(m1))}, ${nb(tB + ' = ' + qT(m2))}이다. ${nb(LHS.tm + ' = ' + frac(qT(m1) + ' − ' + (m2.p < 0 ? '(' + qT(m2) + ')' : qT(m2)), '1 + ' + (m1.p < 0 ? '(' + qT(m1) + ')' : qT(m1)) + ' × ' + (m2.p < 0 ? '(' + qT(m2) + ')' : qT(m2))) + ' = ' + qT(t0))}이고, 예각의 탄젠트는 양수이므로 ${nb(trig('tan', 'θ') + ' = ' + qT(t))}이다.`,
        value: `(${m1.p}/${m1.q}-(${m2.p}/${m2.q}))/(1+(${m1.p}/${m1.q})*(${m2.p}/${m2.q}))*${t0.p < 0 ? '(-1)' : '1'}`, derived: [m1.q, m2.q, Math.abs(m1.p), Math.abs(m2.p)]
      });
    }, { standard: S2 }),

    // 내려본각 θ, 올려본각 θ + π/4 로 나무의 높이 — 답은 소수 한 자리
    T('add-height', '올려본각·내려본각과 높이', '①36', (d) => {
      const [dist, eye] = d.pick([[4.5, 1.5], [6, 1.5], [3.2, 1.6], [4.8, 1.6], [8, 1.6], [5.4, 1.8], [7.2, 1.8], [9, 1.8], [3.6, 1.8]]);
      const t = eye / dist, top = (dist * (1 + t)) / (1 - t), H = Math.round((top + eye) * 10) / 10;
      if (Math.abs(top + eye - H) > 1e-9) return null;
      const target = dist * Math.tan(Math.atan(t) + Math.PI / 4) + eye;
      if (!close(target, H)) throw new Error('높이가 다르다');
      // 그림: 땅, 사람(눈높이), 나무, 눈에서 그은 가로 점선과 두 선
      const sy = 120 / H, gx0 = 58, gx1 = gx0 + 190, gy = 150, ey = gy - Math.max(eye * sy, 30), ty = gy - H * sy, W = gx1 + 24;
      const arcAt = (r, a0, a1) => `M${f(gx0 + r * Math.cos(a0))} ${f(ey - r * Math.sin(a0))} A${r} ${r} 0 0 ${a1 > a0 ? 0 : 1} ${f(gx0 + r * Math.cos(a1))} ${f(ey - r * Math.sin(a1))}`;
      const down = Math.atan2(gy - ey, gx1 - gx0), up = Math.atan2(ey - ty, gx1 - gx0);
      const f = (n) => Math.round(n * 10) / 10, yDown = (x) => ey + ((x - gx0) * (gy - ey)) / (gx1 - gx0);
      const svg = `<svg role="img" aria-label="그림: 나무에서 ${dist} m 떨어진 곳에 눈높이가 ${eye} m인 사람이 서 있다. 눈에서 나무의 밑부분을 내려본각이 θ, 꼭대기를 올려본각이 θ + π/4이다." viewBox="0 0 ${W} 172" width="${W}" height="172">`
        + `<line x1="${gx0 - 20}" y1="${gy}" x2="${gx1 + 18}" y2="${gy}" stroke="#5b6770" stroke-width="1.5"/>`
        + `<line x1="${gx0}" y1="${gy}" x2="${gx0}" y2="${f(ey)}" stroke="#1f2933" stroke-width="3"/><circle cx="${gx0}" cy="${f(ey)}" r="3" fill="#1f2933"/>`
        + `<line x1="${gx1}" y1="${gy}" x2="${gx1}" y2="${f(ty)}" stroke="#15803d" stroke-width="4"/>`
        + `<line x1="${gx0}" y1="${f(ey)}" x2="${gx1}" y2="${f(ey)}" stroke="#5b6770" stroke-dasharray="4 3"/>`
        + `<line x1="${gx0}" y1="${f(ey)}" x2="${gx1}" y2="${gy}" stroke="#1d4ed8" stroke-width="1.5"/><line x1="${gx0}" y1="${f(ey)}" x2="${gx1}" y2="${f(ty)}" stroke="#1d4ed8" stroke-width="1.5"/>`
        + `<path d="${arcAt(104, 0, -down)}" fill="none" stroke="#b42318"/><path d="${arcAt(40, 0, up)}" fill="none" stroke="#b42318"/>`
        + `<text x="${f(gx0 + 110 * Math.cos(down / 2))}" y="${f(ey + 110 * Math.sin(down / 2) + 5)}" style="font-size:13px;font-style:italic">θ</text>`
        + `<text x="${f(gx0 + 56 * Math.cos(up / 2))}" y="${f(ey - 56 * Math.sin(up / 2) + 4)}" style="font-size:13px"><tspan style="font-style:italic">θ</tspan> + π/4</text>`
        + `<text x="${gx0 - 8}" y="${f((gy + ey) / 2 + 4)}" text-anchor="end" style="font-size:12px">${eye} m</text>`
        + `<text x="${f((gx0 + gx1) / 2)}" y="${gy + 16}" text-anchor="middle" style="font-size:12px">${dist} m</text></svg>`;
      return B.kit.D(`그림과 같이 나무에서 ${dist} m 떨어진 곳에 서 있는 사람의 눈높이가 ${eye} m이다. 이 사람이 나무의 밑부분을 내려본각의 크기가 ${V('θ')}이고, 나무의 꼭대기를 올려본각의 크기가 ${nb(V('θ') + ' + ' + frac('π', 4))}일 때, 나무의 높이는 몇 m인가?`, H, {
        figure: svg, unit: 'm',
        explain: `${nb(trig('tan', 'θ') + ' = ' + frac(eye, dist) + ' = ' + qT(Q(Math.round(eye * 10), Math.round(dist * 10))))}이므로 ${nb(trig('tan', nb('(' + V('θ') + ' + ' + frac('π', 4) + ')')) + ' = ' + frac('1 + ' + trig('tan', 'θ'), '1 − ' + trig('tan', 'θ')) + ' = ' + qT(Q(Math.round((dist + eye) * 10), Math.round((dist - eye) * 10))))}이다. 눈높이 위의 나무 부분은 ${nb(dist + ' × ' + qT(Q(Math.round((dist + eye) * 10), Math.round((dist - eye) * 10))) + ' = ' + f(top))} m이므로 나무의 높이는 ${nb(f(top) + ' + ' + eye + ' = ' + H)} m이다.`,
        facts: { value: `${dist}*(1+${eye}/${dist})/(1-${eye}/${dist})+${eye}` }
      });
    }, { standard: S2 }),

    // 예각삼각형에서 sin B, cos C 로 sin A = sin(B + C) — 답은 늘 분수
    T('add-triangle', '삼각형의 두 각으로 나머지 각의 사인값', '①37', (d) => {
      const tris = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]], [a1, b1, c1] = d.pick(tris), [a2, b2, c2] = d.pick(tris), sw1 = d.bool(), sw2 = d.bool();
      const sB = Q(sw1 ? a1 : b1, c1), cBv = Q(sw1 ? b1 : a1, c1), cC = Q(sw2 ? a2 : b2, c2), sC = Q(sw2 ? b2 : a2, c2);
      const sinA = qadd(qmul(sB, cC), qmul(cBv, sC)), cosA = qsub(qmul(sB, sC), qmul(cBv, cC));
      if (cosA.p <= 0 || sinA.q === 1) return null;
      const Bang = Math.asin(fl(sB)), Cang = Math.acos(fl(cC)), target = Math.sin(Math.PI - Bang - Cang);
      if (!close(target, fl(sinA))) throw new Error('sin A 가 다르다');
      const A_ = 'A', name = (h) => h;
      return val(`예각삼각형 ABC에서 ${nb('∠A, ∠B, ∠C')}의 크기를 각각 ${name(A_)}, B, C라 하자. ${nb(trig('sin', 'B') + ' = ' + qT(sB))}, ${nb(trig('cos', 'C') + ' = ' + qT(cC))}일 때, ${trig('sin', 'A')}의 값은?`, sinA, {
        explain: `B, C가 예각이므로 ${nb(trig('cos', 'B') + ' = ' + qT(cBv))}, ${nb(trig('sin', 'C') + ' = ' + qT(sC))}이다. ${nb('A = π − (B + C)')}이므로 ${nb(trig('sin', 'A') + ' = ' + trig('sin', '(B + C)') + ' = ' + trig('sin', 'B') + trig('cos', 'C') + ' + ' + trig('cos', 'B') + trig('sin', 'C') + ' = ' + qT(sinA))}이다.`,
        value: `(${sB.p}/${sB.q})*(${cC.p}/${cC.q})+(${cBv.p}/${cBv.q})*(${sC.p}/${sC.q})`, derived: [cBv.p, sC.p]
      });
    }, { standard: S2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 삼각함수의 극한 ──
  const fnOf = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  const trigR = (f, deg) => (f === 'sin' ? sinD(deg) : f === 'cos' ? cosD(deg) : tanD(deg));
  const tlim = [
    // n = 0: 연속인 삼각함수에 대입(값 고르기), n = 1: 극한이 존재하지 않는 것 고르기
    T('tl-cont', '연속인 삼각함수의 극한', '①41', (d, n) => {
      if (n === 0) {
        const f = d.pick(['sin', 'cos', 'tan']), m = d.pick([1, 2, 3]), k = d.pick([1, 2, 3, 4]), deg = d.pick([30, 45, 60, 120, 135, 150, -30, -45, -60]);
        if (deg % m !== 0 && (deg / m) % 15 !== 0) return null;
        const c = deg / m;
        if (!Number.isInteger(c * 4) || Math.abs(c) < 10) return null;
        if (f === 'tan' && Math.abs(Math.cos((deg * Math.PI) / 180)) < 1e-9) return null;
        const v = rmul(rq(k), trigR(f, deg)), target = k * fnOf[f]((deg * Math.PI) / 180);
        const cq = Q(Math.round(c * 4), 720), arg = (m === 1 ? '' : m) + 'x', to = 'x→' + (cq.p < 0 ? '-' : '') + (Math.abs(cq.p) === 1 ? '' : Math.abs(cq.p)) + 'π' + (cq.q === 1 ? '' : '/' + cq.q);
        const body = nb((k === 1 ? '' : k) + trig(f, arg));
        const others = ['sin', 'cos', 'tan'].filter((g) => g !== f && !(g === 'tan' && Math.abs(Math.cos((deg * Math.PI) / 180)) < 1e-9));
        const safe = (g) => { try { const t = g(); return t && Number.isFinite(rval(t)) ? t : null; } catch (e) { return null; } };
        const wr = others.map((g) => rmul(rq(k), trigR(g, deg))).concat([rneg(v), trigR(f, deg), safe(() => rmul(rq(k), trigR(f, c))), safe(() => rmul(rq(k), trigR(f, 2 * deg)))]).filter((x) => x).map(rOpt);
        return valQ(d, `${lim(to, body)}의 값은?`, target, rOpt(v), wr.concat([rOpt(rq(0)), rOpt(rq(k))]), {
          explain: `${f === 'tan' ? '탄젠트함수는 정의되는 곳에서' : f === 'sin' ? '사인함수는 실수 전체의 집합에서' : '코사인함수는 실수 전체의 집합에서'} 연속이므로 ${X}에 ${piQ(cq)}를 넣으면 ${nb((k === 1 ? '' : k) + trig(f, angH(deg, true)) + ' = ' + rH(v))}이다.`
        });
      }
      const cand = [
        { to: 'x→∞', f: 'sin' }, { to: 'x→∞', f: 'cos' }, { to: 'x→π/2', f: 'tan', deg: 90 }, { to: 'x→3π/2', f: 'tan', deg: 270 },
        { to: 'x→0', f: 'cos', deg: 0 }, { to: 'x→π', f: 'sin', deg: 180 }, { to: 'x→π/4', f: 'tan', deg: 45 }, { to: 'x→π', f: 'tan', deg: 180 }, { to: 'x→π/2', f: 'sin', deg: 90 }, { to: 'x→π/3', f: 'cos', deg: 60 }
      ];
      // 극한이 없는 것: x → ∞ 일 때 사인·코사인(−1과 1 사이를 오간다), x 가 nπ + π/2 로 갈 때 탄젠트(양쪽에서 ±∞)
      const none = (c) => c.to === 'x→∞' || (c.f === 'tan' && Math.abs(Math.cos((c.deg * Math.PI) / 180)) < 1e-9);
      const bad = d.pick(cand.filter(none)), good = d.shuffle(cand.filter((c) => !none(c))).slice(0, 4);
      const list = [bad].concat(good).map((c) => ({ h: lim(c.to, trig(c.f, 'x')), ok: none(c) }));
      return okQ(d, '다음 중 극한값이 존재하지 않는 것은?', list, {
        explain: bad.to === 'x→∞' ? `${X}의 값이 한없이 커질 때 ${trig(bad.f, 'x')}의 값은 −1과 1 사이를 끝없이 오가므로 극한값이 없다. 나머지는 연속인 함수에 대입한 값이 극한값이다.` : `${X}가 ${angH(bad.deg, true)}로 갈 때 ${trig('tan', 'x')}는 한쪽에서 양의 무한대, 다른 쪽에서 음의 무한대로 발산하므로 극한값이 없다. 나머지는 연속인 함수에 대입한 값이 극한값이다.`
      });
    }, { count: 2, standard: S3 }),

    // n = 0: sin 이 든 꼴, n = 1: tan 이 든 꼴 — 답은 늘 분수
    T('tl-basic', 'sin ax·tan ax가 든 기본 극한', '①42', (d, n) => {
      const a = d.pick([1, 2, 3, 4, 5, 6]), b = d.pick([2, 3, 4, 5, 6, 7]);
      if (a % b === 0 || a === b) return null;
      const form = d.pick([0, 1, 2]), f = n === 0 ? 'sin' : 'tan', A = trig(f, ax(a)), Bx = trig(f, ax(b));
      let body, v, how;
      if (form === 0) { body = frac(A, ms(b + 'x')); v = Q(a, b); how = `${nb(frac(A, ms(ax(a))) + ' × ' + frac(a, b))}`; }
      else if (form === 1) { body = frac(ms(b + 'x'), A); v = Q(b, a); how = `${nb(frac(ms(ax(a)), A) + ' × ' + frac(b, a))}`; }
      else { body = frac(A, Bx); v = Q(a, b); how = `${nb(frac(A, ms(ax(a))) + ' × ' + frac(ms(ax(b)), Bx) + ' × ' + frac(a, b))}`; }
      if (v.q === 1) return null;
      return val('다음 극한값은?', v, {
        figure: lf('x→0', body),
        explain: `(주어진 식) = ${lim('x→0', '(' + how + ')')}이고 ${nb(lim('t→0', frac(trig(f, 't'), Tt)) + ' = 1')}이므로 극한값은 ${qT(v)}이다.`,
        value: form === 1 ? `${b}/${a}` : `${a}/${b}`
      });
    }, { count: 2, standard: S3 }),

    // lim tan x/(kx) 를 구하는 과정의 빈칸 ㈎·㈏·㈐(칸마다 맞고 틀림을 셈한다)
    T('tl-blank', 'tan x/x 극한을 구하는 과정의 빈칸', '①43', (d) => {
      const k = d.pick([2, 3, 4, 5]), xs = [0.3, 0.7, 1.1];
      const eqF = (g, h) => xs.every((x) => near(g(x), h(x)));
      const c1 = [[frac(1, k), 1 / k], [String(k), k], ['1', 1]].map(([h, v]) => [h, close(v, 1 / k)]);
      const c2 = [[trig('sin', 'x'), Math.sin], [trig('cos', 'x'), Math.cos], [trig('tan', 'x'), Math.tan]].map(([h, g]) => [h, eqF(g, Math.sin)]);
      const c3 = [[trig('cos', 'x'), Math.cos], [trig('sin', 'x'), Math.sin], [trig('tan', 'x'), Math.tan]].map(([h, g]) => [h, eqF(g, Math.cos)]);
      const proof = hx(lim('x→0', frac(trig('tan', 'x'), ms(k + 'x'))) + ' = ' + box('㈎') + ' × ' + lim('x→0', frac(trig('tan', 'x'), X)) + ' = ' + box('㈎') + ' × ' + lim('x→0', '(' + frac(box('㈏'), X) + ' × ' + frac(1, box('㈐')) + ')') + ' = ' + box('㈎') + ' × 1 × 1');
      return tripleQ(d, `다음은 ${nb(lim('x→0', frac(trig('tan', 'x'), ms(k + 'x'))))}의 값을 구하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`, [c1, c2, c3], {
        figure: proof,
        explain: `${nb(frac(1, ms(k + 'x')) + ' = ' + frac(1, k) + ' × ' + frac(1, X))}이고 ${nb(trig('tan', 'x') + ' = ' + frac(trig('sin', 'x'), trig('cos', 'x')))}이므로 ${nb(frac(trig('tan', 'x'), X) + ' = ' + frac(trig('sin', 'x'), X) + ' × ' + frac(1, trig('cos', 'x')))}이다. 따라서 극한값은 ${frac(1, k)}이다.`
      });
    }, { standard: S3 }),

    // 1 − cos x 가 든 극한(1 + cos x 를 곱해 sin² x 로) — 답은 늘 분수. n = 0: (1 − cos ax)/(bx²), n = 1: 다른 꼴
    T('tl-cos', '1 − cos x가 든 극한', '①44', (d, n) => {
      const a = d.pick([1, 2, 3, 4]), b = d.pick([1, 2, 3, 5]);
      let body, v, how, vexpr = '';
      const cosA = trig('cos', ax(a)), one = ms('1 - ') + cosA;
      if (n === 0) { body = frac(one, ms(ax(b, 'x^2'))); v = Q(a * a, 2 * b); how = `${frac(trig('sin', ax(a), 2), ms(ax(b, 'x^2') ))} × ${frac(1, ms('1 + ') + cosA)}`; }
      else {
        const form = d.pick([0, 1, 2]);
        if (form === 0) { body = frac(one, X + trig('sin', ax(b))); v = Q(a * a, 2 * b); vexpr = `${a}*${a}/(2*${b})`; how = `${frac(trig('sin', ax(a), 2), X + trig('sin', ax(b)))} × ${frac(1, ms('1 + ') + cosA)}`; }
        else if (form === 1) { body = frac(ms(ax(b, 'x^2')), one); v = Q(2 * b, a * a); vexpr = `2*${b}/(${a}*${a})`; how = `${frac(ms(ax(b, 'x^2')) + '(' + ms('1 + ') + cosA + ')', trig('sin', ax(a), 2))}`; }
        else { body = frac(trig('sin', ax(a)) + '(' + ms('1 - ') + trig('cos', 'x') + ')', ms(ax(b, 'x^3'))); v = Q(a, 2 * b); vexpr = `${a}/(2*${b})`; how = `${frac(trig('sin', ax(a)) + trig('sin', 'x', 2), ms(ax(b, 'x^3')))} × ${frac(1, ms('1 + ') + trig('cos', 'x'))}`; }
      }
      if (v.q === 1) return null;
      return val('다음 극한값은?', v, {
        figure: lf('x→0', body),
        explain: `분모·분자에 ${nb('1 + ' + (n === 1 && body.includes('x<sup>3') ? trig('cos', 'x') : cosA))}를 곱하면 ${nb('1 − ' + trig('cos', 'θ', 2) + ' = ' + trig('sin', 'θ', 2))}이므로 (주어진 식) = ${lim('x→0', '(' + how + ')')}이다. ${nb(lim('x→0', frac(trig('sin', ax(a)), ms(ax(a)))) + ' = 1')}을 쓰면 극한값은 ${qT(v)}이다.`,
        value: n === 0 ? `${a}*${a}/(2*${b})` : vexpr, derived: [2]
      });
    }, { count: 2, standard: S3 }),

    // x → a(a ≠ 0)에서 x − a = t 로 놓는 극한 — 답은 늘 정수. n = 0: a = π, n = 1: a = π/2·π/m
    T('tl-shift', 'x → a에서 치환하는 삼각함수의 극한', '①46', (d, n) => {
      let to, body, ans, how, vexpr;
      if (n === 0) {
        const k = d.pick([2, 3, 4, 5]), f = d.pick(['sin', 'tan']);
        to = 'x→π'; body = frac(trig(f, ax(k)), ms('x - π'));
        ans = f === 'tan' ? k : (k % 2 === 0 ? k : -k); vexpr = f === 'tan' || k % 2 === 0 ? String(k) : `0-${k}`;
        how = `${nb(ms('x - π') + ' = ' + Tt)}로 놓으면 ${nb(trig(f, ax(k)) + ' = ' + trig(f, ms('(' + k + 'π + ' + k + 't)')) + ' = ' + (ans < 0 ? MINUS : '') + trig(f, ax(k, 't')))}이므로 (주어진 식) = ${nb(lim('t→0', frac((ans < 0 ? MINUS : '') + trig(f, ax(k, 't')), Tt)) + ' = ' + sT(ans))}`;
      } else if (d.bool()) {
        const k = d.pick([2, 4, 6]);
        to = 'x→π/2'; body = frac(trig('tan', ax(k)), nb(frac('π', 2) + ' − ' + X)); ans = -k; vexpr = `0-${k}`;
        how = `${nb(frac('π', 2) + ' − ' + X + ' = ' + Tt)}로 놓으면 ${nb(trig('tan', ax(k)) + ' = ' + trig('tan', ms('(' + (k / 2 === 1 ? '' : k / 2) + 'π - ' + k + 't)')) + ' = ' + MINUS + trig('tan', ax(k, 't')))}이므로 (주어진 식) = ${nb(lim('t→0', frac(MINUS + trig('tan', ax(k, 't')), Tt)) + ' = ' + sT(ans))}`;
      } else {
        const m = d.pick([2, 3, 4, 6]);
        to = 'x→π/' + m; body = frac(ms(m + 'x - π'), trig('tan', nb('(' + frac('π', m) + ' − ' + X + ')'))); ans = -m; vexpr = `0-${m}`;
        how = `${nb(frac('π', m) + ' − ' + X + ' = ' + Tt)}로 놓으면 ${nb(ms(m + 'x - π') + ' = ' + MINUS + m + Tt)}이므로 (주어진 식) = ${nb(lim('t→0', frac(MINUS + m + Tt, trig('tan', 't'))) + ' = ' + sT(ans))}`;
      }
      return val('다음 극한값은?', ans, {
        figure: lf(to, body),
        explain: `${how}이다.`,
        value: vexpr
      });
    }, { count: 2, standard: S3 }),

    // (sin ax + px)/(qx) = k 에서 a(거꾸로 한 번)
    T('tl-coef', '극한값이 주어질 때 미정계수(삼각함수)', '①47', (d) => {
      const p = d.pick([1, 2, 3, 4, -1, -2]), q = d.pick([1, 2, 3]), a = d.pick([1, 2, 3, 4, 5, -1, -2, -3]), k = Q(a + p, q);
      if (k.p === 0 || k.q !== 1) return null;
      const top = ms(ax(p) + ' + ') + trig('sin', 'ax');
      return val(`다음 등식이 성립하도록 하는 상수 ${Av}의 값은?`, a, {
        figure: hx(lim('x→0', frac(top, ms(ax(q)))) + ' = ' + sT(k.p)),
        explain: q === 1
          ? `(좌변) = ${nb(lim('x→0', '(' + sT(p) + ' + ' + frac(trig('sin', 'ax'), ms('ax')) + ' × ' + Av + ')') + ' = ' + ms(p + ' + a'))}이므로 ${nb(ms(p + ' + a') + ' = ' + sT(k.p))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다.`
          : `(좌변) = ${nb(lim('x→0', '(' + qT(Q(p, q)) + ' + ' + frac(trig('sin', 'ax'), ms('ax')) + ' × ' + frac(Av, q) + ')') + ' = ' + frac(ms(p + ' + a'), q))}이므로 ${nb(frac(ms(p + ' + a'), q) + ' = ' + sT(k.p))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다.`,
        value: `${q}*${jn(k.p)}-${jn(p)}`
      });
    }, { standard: S3 }),

    // sin ax/(bx)(x > 0) 와 다항식(x ≤ 0)이 x = 0 에서 연속인 양수 a
    T('tl-piece', '연속이 되도록 상수 정하기', '①48', (d) => {
      const b = d.pick([1, 2, 3]), c = d.pick([1, 2, 3, 4]), f = d.pick(['sin', 'tan']), m = d.pick([1, 2, -1, 3]), a = b * c;
      const pieces = (rows) => nb(ms('f(x)') + ' =') + ' ' + B.kit.mid.sys(rows.map(([h, cc]) => h + ' ' + cc));
      const left = ms(ax(m) + ' + ' + c);
      return val(`함수 ${pieces([[frac(trig(f, 'ax'), ms(ax(b))), cond('x > 0')], [left, cond('x <= 0')]])}가 ${nb(ms('x = 0'))}에서 연속이 되도록 하는 양수 ${Av}의 값은?`, a, {
        explain: `${nb(ms('f(0)') + ' = ' + c)}이고 ${nb(lim('x→0+', frac(trig(f, 'ax'), ms(ax(b)))) + ' = ' + frac(Av, b))}이다. 연속이려면 ${nb(frac(Av, b) + ' = ' + c)}이므로 ${nb(ms('a') + ' = ' + a)}이다.`,
        value: `${b}*${c}`
      });
    }, { standard: S3 }),

    // 반지름이 r 인 원에 내접(n = 0)·외접(n = 1)하는 정n각형의 둘레 → 2πr (π 가 든 값이라 고르기)
    T('tl-polygon', '원에 내접·외접하는 정n각형의 둘레의 극한', '①49', (d, kind) => {
      const r = d.pick([1, 2, 3, 4, 5]), N0 = 1e7, f = kind === 0 ? (n) => 2 * n * r * Math.sin(Math.PI / n) : (n) => 2 * n * r * Math.tan(Math.PI / n), target = f(N0);
      const o = (h, v) => ({ h, v }), pr = (k) => o(ms((k === 1 ? '' : k) + 'π'), k * Math.PI);
      const wr = [pr(r), pr(4 * r), o(ms(r * r === 1 ? 'π' : r * r + 'π'), r * r * Math.PI), o(String(2 * r), 2 * r), pr(r * 2 + 1), o(String(2 * r * 3), 6 * r)];
      const nn = 6, cx = 90, cy = 86, R0 = 62, pts = [], angle = (i) => -Math.PI / 2 + (2 * Math.PI * i) / nn;
      const Rp = kind === 0 ? R0 : R0 / Math.cos(Math.PI / nn), shift = kind === 0 ? 0 : Math.PI / nn;
      for (let i = 0; i < nn; i += 1) pts.push([cx + Rp * Math.cos(angle(i) + shift), cy + Rp * Math.sin(angle(i) + shift)]);
      const ff = (v) => Math.round(v * 10) / 10, tip = kind === 0 ? pts[1] : [cx + R0 * Math.cos(angle(1)), cy + R0 * Math.sin(angle(1))];
      const svg = `<svg role="img" aria-label="그림: 반지름의 길이가 r인 원에 ${kind === 0 ? '내접' : '외접'}하는 정다각형(정육각형으로 그렸다). 중심 O에서 ${kind === 0 ? '한 꼭짓점' : '한 변과 원이 닿는 점'}까지 반지름 r을 그었다." viewBox="0 0 180 ${kind === 0 ? 172 : 180}" width="180" height="${kind === 0 ? 172 : 180}">`
        + `<circle cx="${cx}" cy="${cy}" r="${R0}" fill="none" stroke="#1f2933" stroke-width="1.5"/>`
        + `<polygon points="${pts.map(([x, y]) => ff(x) + ',' + ff(y)).join(' ')}" fill="none" stroke="#1d4ed8" stroke-width="1.8"/>`
        + `<line x1="${cx}" y1="${cy}" x2="${ff(tip[0])}" y2="${ff(tip[1])}" stroke="#b42318" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="#1f2933"/>`
        + `<text x="${cx - 4}" y="${cy + 16}" style="font-size:13px">O</text><text x="${ff((cx + tip[0]) / 2 + 2)}" y="${ff((cy + tip[1]) / 2 - 5)}" style="font-size:14px;font-style:italic">r</text></svg>`;
      const fx = kind === 0 ? nb(ms('2nr') + trig('sin', frac('π', V('n')))) : nb(ms('2nr') + trig('tan', frac('π', V('n'))));
      return valQ(d, `그림과 같이 반지름의 길이가 ${r}인 원에 ${kind === 0 ? '내접' : '외접'}하는 정${V('n')}각형의 둘레의 길이를 ${ms('f(n)')}이라 할 때, ${lim('n→∞', 'f(n)')}의 값은?`, target, pr(2 * r), wr, {
        figure: svg,
        explain: `중심각을 ${V('n')}등분하면 한 변의 길이는 ${kind === 0 ? nb('2' + ms('r') + trig('sin', frac('π', V('n')))) : nb('2' + ms('r') + trig('tan', frac('π', V('n'))))}이므로 ${nb(ms('f(n)') + ' = ' + fx)}이다(${nb(ms('r') + ' = ' + r)}). ${nb(frac('π', V('n')) + ' = ' + Tt)}로 놓으면 ${V('n')} → ∞일 때 ${Tt} → 0+이고 ${nb(ms('f(n)') + ' = 2π' + ms('r') + ' × ' + frac(trig(kind === 0 ? 'sin' : 'tan', 't'), Tt))}이므로 극한값은 ${nb('2π × ' + r + ' = ' + ms((2 * r) + 'π'))}이다. 원의 둘레의 길이와 같다.`
      });
    }, { count: 2, standard: S3 }),

    // 지수·로그와 삼각함수가 섞인 분수 — 답은 늘 분수
    T('tl-mixed', '지수·로그와 삼각함수가 섞인 극한', '①14', (d) => {
      const form = d.pick([0, 1, 2, 3]), a = d.pick([1, 2, 3, 4, 5]), b = d.pick([2, 3, 4, 5, 6]);
      if (a % b === 0) return null;
      const bodies = [
        [frac(ms('1 - e^{' + ax(a) + '}'), trig('sin', ax(b))), Q(-a, b), '1 − e 의 극한이 −1'],
        [frac(ms('e^{' + ax(a) + '} - 1'), trig('tan', ax(b))), Q(a, b), ''],
        [frac(ln(ms(onePlus(a))), trig('sin', ax(b))), Q(a, b), ''],
        [frac(trig('tan', ax(a)), ln(ms(onePlus(b)))), Q(a, b), '']
      ];
      const [body, v] = bodies[form];
      if (v.q === 1) return null;
      const firstL = [frac(ms('e^{' + ax(a) + '} - 1'), ms(ax(a))), frac(ms('e^{' + ax(a) + '} - 1'), ms(ax(a))), frac(ln(ms(onePlus(a))), ms(ax(a))), frac(trig('tan', ax(a)), ms(ax(a)))][form];
      const secondL = [frac(ms(ax(b)), trig('sin', ax(b))), frac(ms(ax(b)), trig('tan', ax(b))), frac(ms(ax(b)), trig('sin', ax(b))), frac(ms(ax(b)), ln(ms(onePlus(b))))][form];
      return val('다음 극한값은?', v, {
        figure: lf('x→0', body),
        explain: `(주어진 식) = ${lim('x→0', '(' + (form === 0 ? MINUS : '') + firstL + ' × ' + secondL + ' × ' + frac(a, b) + ')')}이고 두 분수의 극한은 모두 1이므로 극한값은 ${qT(v)}이다.`,
        value: form === 0 ? `0-${a}/${b}` : `${a}/${b}`
      });
    }, { standard: S3 })
  ];

  // ════════════════════════════════════════════════════════════════
  // ── 사인함수와 코사인함수의 도함수 ──
  const SPECIAL = [30, 45, 60, 90, 120, 135, 150, 180];
  const tdiff = [
    // 정의로 구하는 미분계수: lim {sin(c + h) − sin c}/h = cos c, lim {cos(c + h) − cos c}/h = −sin c(근호가 든 값 — 고르기)
    T('td-def', '정의로 구하는 사인·코사인함수의 미분계수', '①52', (d) => {
      const deg = d.pick(SPECIAL), f = d.pick(['sin', 'cos']), cH = angH(deg, true);
      const v = f === 'sin' ? cosD(deg) : rneg(sinD(deg)), target = nd(fnOf[f], (deg * Math.PI) / 180);
      const body = frac(trig(f, nb('(' + cH + ' + ' + Hh + ')')) + ' − ' + trig(f, cH), Hh);
      const wr = [sinD(deg), rneg(cosD(deg)), cosD(deg), rneg(sinD(deg)), rq(1), rq(0), rq(-1)].map(rOpt);
      return valQ(d, '다음 극한값은?', target, rOpt(v), wr, {
        figure: lf('h→0', body),
        explain: `(주어진 식)은 함수 ${nb(ms('y = ') + trig(f, 'x'))}의 ${nb(X + ' = ' + cH)}에서의 미분계수이다. ${nb('(' + trig(f, 'x') + ')′ = ' + (f === 'sin' ? trig('cos', 'x') : MINUS + trig('sin', 'x')))}이므로 극한값은 ${nb((f === 'sin' ? trig('cos', cH) : MINUS + trig('sin', cH)) + ' = ' + rH(v))}이다.`
      });
    }, { standard: S3 }),

    // a sin x + b cos x (+ 다른 함수)의 도함수 고르기
    T('td-lin', 'sin x·cos x의 일차결합의 도함수', '①53', (d) => {
      const a = d.pick([1, 2, 3, -1, -2]), b = d.pick([1, 2, 3, -1, -3]), extra = d.pick(['', 'ln', 'e', 'x']), k = d.pick([1, 2, 5]);
      const co = (c, first) => (c === 1 ? (first ? '' : ' + ') : c === -1 ? (first ? '-' : ' - ') : first ? String(c) : c < 0 ? ' - ' + -c : ' + ' + c);
      const ext = extra === 'ln' ? [' + ' + (k === 1 ? '' : k) + 'ln x', (x) => k * Math.log(x), (x) => k / x, frac(k, X)] : extra === 'e' ? [' + ' + (k === 1 ? '' : k) + 'e^x', (x) => k * Math.exp(x), (x) => k * Math.exp(x), ms((k === 1 ? '' : k) + 'e^x')] : extra === 'x' ? [' + ' + (k === 1 ? '' : k) + 'x', (x) => k * x, () => k, String(k)] : ['', () => 0, () => 0, ''];
      const F = (x) => a * Math.sin(x) + b * Math.cos(x) + ext[1](x);
      const fS = co(a, true) + 'sin x' + co(b, false) + 'cos x' + ext[0];
      const opt = (p, q, sw, extH, extF) => {   // p cos x + q sin x (sw 이면 sin·cos 를 바꾼다) + 덧붙인 항
        const t1 = sw ? 'sin x' : 'cos x', t2 = sw ? 'cos x' : 'sin x', f1 = sw ? Math.sin : Math.cos, f2 = sw ? Math.cos : Math.sin;
        return { h: yp + nb(ms(co(p, true) + t1 + co(q, false) + t2) + (extH ? ' + ' + extH : '')), f: (x) => p * f1(x) + q * f2(x) + (extF ? extF(x) : 0) };
      };
      const right = opt(a, -b, false, ext[3], ext[2]);
      const wr = [opt(a, b, false, ext[3], ext[2]), opt(-a, b, false, ext[3], ext[2]), opt(-a, -b, false, ext[3], ext[2]), opt(a, -b, true, ext[3], ext[2]), opt(b, a, false, ext[3], ext[2]), opt(a, -b, false, extra === 'ln' ? ln(X) : '', extra === 'ln' ? (x) => k * Math.log(x) : null)].concat(extra ? [opt(a, -b, false, '', null)] : []);
      return derivQ(d, `함수 ${yIs(ms(fS))}의 도함수는?`, F, right, wr, {
        explain: `${nb('(' + trig('sin', 'x') + ')′ = ' + trig('cos', 'x'))}, ${nb('(' + trig('cos', 'x') + ')′ = ' + MINUS + trig('sin', 'x'))}이므로 ${nb(right.h)}이다.`
      });
    }, { standard: S3 }),

    // 삼각함수를 곱한 함수의 도함수 고르기(곱의 미분법)
    T('td-prod', '삼각함수를 곱한 함수의 도함수', '①54', (d) => {
      const S = Math.sin, Cc = Math.cos, E = Math.exp, L = Math.log, o = (s, f) => ({ h: yp + (typeof s === 'string' ? ms(s) : s), f });
      const forms = [
        () => { const m = d.pick([1, 2, 3]), xm = m === 1 ? 'x' : 'x^' + m, xm1 = m === 1 ? '' : m === 2 ? '2x' : '3x^2', cm = m === 1 ? '' : m;
          return [xm + 'sin x', (x) => x ** m * S(x), o(xm1 + (m === 1 ? '' : '') + (m === 1 ? 'sin x + x cos x' : 'sin x + ' + xm + 'cos x'), (x) => m * x ** (m - 1) * S(x) + x ** m * Cc(x)),
            [o(m === 1 ? 'cos x' : cm + (m === 3 ? 'x^2' : 'x') + 'cos x', (x) => m * x ** (m - 1) * Cc(x)), o(m === 1 ? 'sin x - x cos x' : xm1 + 'sin x - ' + xm + 'cos x', (x) => m * x ** (m - 1) * S(x) - x ** m * Cc(x)), o(xm + 'cos x', (x) => x ** m * Cc(x)), o(m === 1 ? 'cos x + x sin x' : xm1 + 'cos x + ' + xm + 'sin x', (x) => m * x ** (m - 1) * Cc(x) + x ** m * S(x)), o(m === 1 ? 'x sin x + cos x' : xm1 + 'sin x + ' + xm1 + 'cos x', (x) => (m === 1 ? x * S(x) + Cc(x) : m * x ** (m - 1) * (S(x) + Cc(x))))]]; },
        () => { const m = d.pick([1, 2]), xm = m === 1 ? 'x' : 'x^2', xm1 = m === 1 ? '' : '2x';
          return [xm + 'cos x', (x) => x ** m * Cc(x), o(m === 1 ? 'cos x - x sin x' : '2x cos x - x^2 sin x', (x) => m * x ** (m - 1) * Cc(x) - x ** m * S(x)),
            [o(m === 1 ? '-sin x' : '-2x sin x', (x) => -m * x ** (m - 1) * S(x)), o(m === 1 ? 'cos x + x sin x' : '2x cos x + x^2 sin x', (x) => m * x ** (m - 1) * Cc(x) + x ** m * S(x)), o(m === 1 ? '-x sin x' : '-x^2 sin x', (x) => -(x ** m) * S(x)), o(m === 1 ? 'sin x - x cos x' : '2x sin x - x^2 cos x', (x) => m * x ** (m - 1) * S(x) - x ** m * Cc(x)), o(m === 1 ? 'x cos x - sin x' : '2x cos x - 2x sin x', (x) => (m === 1 ? x * Cc(x) - S(x) : 2 * x * Cc(x) - 2 * x * S(x)))]]; },
        () => { const f = d.pick(['sin', 'cos']), g = f === 'sin' ? S : Cc;
          return [f === 'sin' ? 'e^x sin x' : 'e^x cos x', (x) => E(x) * g(x), o(f === 'sin' ? 'e^x(sin x + cos x)' : 'e^x(cos x - sin x)', (x) => (f === 'sin' ? E(x) * (S(x) + Cc(x)) : E(x) * (Cc(x) - S(x)))),
            [o(f === 'sin' ? 'e^x cos x' : '-e^x sin x', (x) => (f === 'sin' ? E(x) * Cc(x) : -E(x) * S(x))), o(f === 'sin' ? 'e^x(sin x - cos x)' : 'e^x(cos x + sin x)', (x) => (f === 'sin' ? E(x) * (S(x) - Cc(x)) : E(x) * (Cc(x) + S(x)))), o(f === 'sin' ? 'e^x sin x' : 'e^x cos x', (x) => E(x) * g(x)), o(f === 'sin' ? '-e^x(sin x + cos x)' : '-e^x(cos x + sin x)', (x) => (f === 'sin' ? -E(x) * (S(x) + Cc(x)) : -E(x) * (Cc(x) + S(x)))), o(f === 'sin' ? 'e^x(cos x - sin x)' : 'e^x(sin x - cos x)', (x) => (f === 'sin' ? E(x) * (Cc(x) - S(x)) : E(x) * (S(x) - Cc(x))))]]; },
        () => ['sin x cos x', (x) => S(x) * Cc(x), o('cos^2 x - sin^2 x', (x) => Cc(x) ** 2 - S(x) ** 2),
          [o('-sin x cos x', (x) => -S(x) * Cc(x)), o('cos^2 x + sin^2 x', () => 1), o('sin^2 x - cos^2 x', (x) => S(x) ** 2 - Cc(x) ** 2), o('2sin x cos x', (x) => 2 * S(x) * Cc(x)), o('cos x - sin x', (x) => Cc(x) - S(x))]],
        () => { const c = d.pick([1, 2]);
          return [nb(ms('(' + c + ' + ') + ln(X) + ')' + trig('cos', 'x')), (x) => (c + L(x)) * Cc(x), o(nb(frac(trig('cos', 'x'), X) + ' − (' + ms(c + ' + ') + ln(X) + ')' + trig('sin', 'x')), (x) => Cc(x) / x - (c + L(x)) * S(x)),
            [o(nb(MINUS + frac(trig('sin', 'x'), X)), (x) => -S(x) / x), o(nb(frac(trig('cos', 'x'), X) + ' + (' + ms(c + ' + ') + ln(X) + ')' + trig('sin', 'x')), (x) => Cc(x) / x + (c + L(x)) * S(x)), o(nb(frac(trig('sin', 'x'), X) + ' − (' + ms(c + ' + ') + ln(X) + ')' + trig('cos', 'x')), (x) => S(x) / x - (c + L(x)) * Cc(x)), o(nb(MINUS + '(' + ms(c + ' + ') + ln(X) + ')' + trig('sin', 'x')), (x) => -(c + L(x)) * S(x)), o(nb(frac(trig('cos', 'x'), X) + ' − ' + ln(X) + trig('sin', 'x')), (x) => Cc(x) / x - L(x) * S(x))]]; }
      ];
      const [fS, F, right, wr] = d.pick(forms)();
      return derivQ(d, `함수 ${yIs(typeof fS === 'string' ? ms(fS) : fS)}의 도함수는?`, F, right, wr, {
        explain: `곱의 미분법 ${nb('{' + ms('f(x)g(x)') + "}′ = " + ms("f'(x)g(x) + f(x)g'(x)"))}과 ${nb('(' + trig('sin', 'x') + ')′ = ' + trig('cos', 'x'))}, ${nb('(' + trig('cos', 'x') + ')′ = ' + MINUS + trig('sin', 'x'))}을 쓰면 ${nb(right.h)}이다.`
      });
    }, { standard: S3 }),

    // n = 0: {f(c + x) − f(c − x)}/x = 2f′(c)(f = x cos x, x sin x — π·근호가 든 값이라 고르기), n = 1: lim n{f(k/n) − f(0)} = k f′(0)(정수)
    T('td-limdef', '미분계수의 정의로 바꾸는 극한(삼각함수)', '①26 ①55', (d, n) => {
      if (n === 0) {
        const deg = d.pick([30, 45, 60, 90]), f = d.pick(['cos', 'sin']), c = (deg * Math.PI) / 180, cq = Q(deg, 180), cH = piQ(cq);
        const F = f === 'cos' ? (x) => x * Math.cos(x) : (x) => x * Math.sin(x), target = 2 * nd(F, c);
        // 2f′(c) = A + Bπ: f = x cos x → 2cos c − 2c sin c, f = x sin x → 2sin c + 2c cos c
        const A = f === 'cos' ? rmul(rq(2), cosD(deg)) : rmul(rq(2), sinD(deg)), Bc = f === 'cos' ? rmul(rq(qmul(Q(-2), cq)), sinD(deg)) : rmul(rq(qmul(Q(2), cq)), cosD(deg));
        const piT = (b) => { const ent = Object.entries(b); if (!ent.length) return null; const [r, q] = ent[0], top = (Math.abs(q.p) === 1 && r !== '1' ? '' : Math.abs(q.p) === 1 ? '' : Math.abs(q.p)) + (r === '1' ? '' : rt(Number(r))) + 'π'; return { neg: q.p < 0, h: q.q === 1 ? top : frac(top, q.q) }; };
        const show = (a, b) => { const pb = piT(b), ah = Object.keys(a).length ? rH(a) : ''; if (!pb) return ah || '0'; return nb((ah ? ah + (pb.neg ? ' − ' : ' + ') : pb.neg ? MINUS : '') + pb.h); };
        const vOf = (a, b) => rval(a) + rval(b) * Math.PI, opt = (a, b) => ({ h: show(a, b), v: vOf(a, b) });
        const half = (x) => rmul(rq(Q(1, 2)), x);
        const wr = [opt(half(A), half(Bc)), opt(A, rneg(Bc)), opt(A, rq(0)), opt(rneg(A), Bc), opt(rq(0), Bc), opt(rmul(rq(2), A), rmul(rq(2), Bc))];
        const fS = f === 'cos' ? nb(X + trig('cos', 'x')) : nb(X + trig('sin', 'x'));
        return valQ(d, `함수 ${fIs(fS)}에 대하여 다음 극한값은?`, target, opt(A, Bc), wr, {
          figure: lf('x→0', frac(nb(ms('f') + '(' + cH + ' + ' + X + ') − ' + ms('f') + '(' + cH + ' − ' + X + ')'), X)),
          explain: `분자에서 ${ms('f') + '(' + cH + ')'}를 빼고 더하면 (주어진 식) = ${nb('2' + ms("f'") + '(' + cH + ')')}이다. ${nb(ms("f'(x)") + ' = ' + (f === 'cos' ? trig('cos', 'x') + ' − ' + X + trig('sin', 'x') : trig('sin', 'x') + ' + ' + X + trig('cos', 'x')))}이므로 극한값은 ${opt(A, Bc).h}이다.`
        });
      }
      const a = d.pick([1, 2, 3, -1, -2]), b = d.pick([1, 2, 3, -1, -2, 4]), k = d.pick([2, 3, 4, 5]);
      const fS = ms((a === 1 ? '' : a === -1 ? '-' : a) + 'cos x ' + (b < 0 ? '- ' : '+ ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'sin x');
      return val(`함수 ${fIs(fS)}에 대하여 다음 극한값은?`, k * b, {
        figure: lf('n→∞', V('n') + '{' + ms('f') + '(' + frac(k, V('n')) + ') − ' + ms('f(0)') + '}'),
        explain: `${nb(frac(k, V('n')) + ' = ' + Hh)}로 놓으면 ${V('n')} → ∞일 때 ${Hh} → 0+이고 (주어진 식) = ${nb(lim('h→0+', frac(k, Hh) + '{' + ms('f(h) - f(0)') + '}') + ' = ' + k + ms("f'(0)"))}이다. ${nb(ms("f'(x)") + ' = ' + ms((a === 1 ? '-' : a === -1 ? '' : -a) + 'sin x ' + (b < 0 ? '- ' : '+ ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'cos x'))}에서 ${nb(ms("f'(0)") + ' = ' + sT(b))}이므로 극한값은 ${sT(k * b)}이다.`,
        value: `${k}*${jn(b)}`
      });
    }, { count: 2, standard: S3 }),

    // 상수가 f(a)임을 알아보고 미분계수로: lim {f(c + x) − K}/x(답은 정수)
    T('td-const', '상수가 f(a)임을 알아보고 미분계수로 구하기', '①55', (d) => {
      const a = d.pick([1, 2, 3, -1, -2]), b = d.pick([1, 2, -1, 3, -2]), form = d.pick([0, 1, 2]);
      let fS, cH, Kc, ans, fp;
      const lin = (p, q) => ms((p === 1 ? '' : p === -1 ? '-' : p) + 'sin x ' + (q < 0 ? '- ' : '+ ') + (Math.abs(q) === 1 ? '' : Math.abs(q)) + 'cos x');
      if (form === 0) { fS = nb(rt(2) + '(' + lin(a, b) + ')'); cH = frac('π', 4); Kc = a + b; ans = a - b; fp = '√2(a cos − b sin)'; }
      else if (form === 1) { fS = lin(a, b); cH = frac('π', 2); Kc = a; ans = -b; }
      else { fS = lin(a, b); cH = 'π'; Kc = -b; ans = -a; }
      if (Kc === 0) return null;
      const deriv = nb(ms("f'(x)") + ' = ' + (form === 0 ? rt(2) + '(' : '') + ms((a === 1 ? '' : a === -1 ? '-' : a) + 'cos x ' + (b < 0 ? '+ ' : '- ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'sin x') + (form === 0 ? ')' : ''));
      return val(`함수 ${fIs(fS)}에 대하여 다음 극한값은?`, ans, {
        figure: lf('x→0', frac(nb(ms('f') + '(' + cH + ' + ' + X + ') − ' + (Kc < 0 ? '(' + sT(Kc) + ')' : Kc)), X)),
        explain: `${nb(ms('f') + '(' + cH + ') = ' + sT(Kc))}이므로 (주어진 식) = ${nb(lim('x→0', frac(ms('f') + '(' + cH + ' + ' + X + ') − ' + ms('f') + '(' + cH + ')', X)) + ' = ' + ms("f'") + '(' + cH + ')')}이다. ${deriv}이므로 극한값은 ${sT(ans)}이다.`,
        value: form === 0 ? `${jn(a)}-${jn(b)}` : form === 1 ? `0-${jn(b)}` : `0-${jn(a)}`
      });
    }, { standard: S3 }),

    // 용수철 f(t) = A cos t 또는 A sin t: 늘어나는 속도의 절댓값이 처음으로 가장 커지는(작아지는) 시각
    T('td-spring', '삼각함수로 나타낸 위치의 변화율', '①57', (d) => {
      const A = d.pick([3, 4, 5, 6]), f = d.pick(['cos', 'sin']), most = d.bool();
      const fp = f === 'cos' ? (t) => -A * Math.sin(t) : (t) => A * Math.cos(t), sp = (t) => Math.abs(nd(f === 'cos' ? (x) => A * Math.cos(x) : (x) => A * Math.sin(x), t));
      // 0 < t ≤ 2π 를 잘게 나누어 |f′(t)| 가 처음으로 가장 큰(작은) 시각을 찾는다
      let best = null;
      for (let i = 1; i <= 4800; i += 1) { const t = (i / 4800) * 2 * Math.PI, v = sp(t); if (best === null || (most ? v > best.v + 1e-9 : v < best.v - 1e-9)) best = { t, v }; }
      const cands = [[Q(1, 4), Math.PI / 4], [Q(1, 2), Math.PI / 2], [Q(1), Math.PI], [Q(3, 2), (3 * Math.PI) / 2], [Q(2), 2 * Math.PI]];
      const list = cands.map(([q, t]) => ({ h: piQ(q), ok: Math.abs(t - best.t) < 2e-3 }));
      const deriv = f === 'cos' ? nb(MINUS + A + trig('sin', 't')) : nb(A + trig('cos', 't'));
      return okQ(d, `용수철에 매단 추를 잡아당겼다가 놓은 지 ${Tt}초 후 용수철이 늘어난 길이를 ${ms('f(t)')} cm라 하면 ${fIs(nb(A + trig(f, 't')), 'f', 't')} ${nb('(' + ms('t > 0') + ')')}이다. 용수철의 길이가 변하는 속도 ${ms("f'(t)")}의 절댓값이 처음으로 가장 ${most ? '커지는' : '작아지는'} 시각 ${Tt}는?`, list, {
        keep: true,
        explain: `${nb(ms("f'(t)") + ' = ' + deriv)}이므로 그 절댓값은 ${f === 'cos' ? trig('sin', 't') : trig('cos', 't')}의 절댓값이 1일 때 가장 크고 0일 때 가장 작다. ${nb(ms('t > 0'))}에서 처음으로 가장 ${most ? '커지는' : '작아지는'} 시각은 ${list.find((x) => x.ok).h}이다.`
      });
    }, { standard: S3 })
  ];

  B.addTypes('11-5-3', 'addf', addf);
  B.addTypes('11-5-3', 'tlim', tlim);
  B.addTypes('11-5-3', 'tdiff', tdiff);
  B.kit.u53b = { Rd, rq, rr, radd, rneg, rsub, rmul, rinv, rdiv, rval, rH, rOpt, nTerms, sinD, cosD, tanD, piQ, angH, angS, range, AL, BE, sA, cA, tA, sB, cB, tB, LHS };
})(typeof window !== 'undefined' ? window : globalThis);
