// 고등학교 미적분Ⅰ Ⅰ-2 함수의 연속 — 뒤쪽 묶음(연속함수의 성질, 최대·최소 정리, 사잇값 정리).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-2a.js 머리에 적었다. 도구는 B.kit.u22(a 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline, josa, table } = B.kit;
  const { MINUS, LE, GE, gcd, Q, fl, tx, nb, V, sup, nz, pm, poly, rt, grp } = B.kit.mid;
  const { ms, qAns } = B.kit.hs;
  const U = B.kit.u22;
  const { S4, T, stripH, X, Av, Bv, Kv, X2, iq, jn, jq, sT, FX, GX, fAt, fIs, LIM, ge, lt, eq, cases, iv, NINF, INF, sgnT,
    pmul, pval, fromRoots, ptext, den, par, GA, comboPick, pickOne, vals, segGraph, gridOf } = U;
  const { jh } = B.kit.hs;

  // ── 도움 ──
  const near0 = (v) => Math.abs(v) < 1e-9;
  const ri = (lo, hi) => { const out = []; for (let v = lo; v <= hi; v += 1) out.push(v); return out; };
  const realRoots = (P) => (P.length === 3 ? P[1] * P[1] - 4 * P[2] * P[0] >= 0 : P.length === 2);   // 일차·이차식이 실근을 갖는가
  const rootsIn = (P, a, b) => { const n = 400; for (let i = 0; i <= n; i += 1) { const x = a + (b - a) * i / n; if (near0(pval(P, x))) return true; } for (let i = 0; i < n; i += 1) { const x0 = a + (b - a) * i / n, x1 = a + (b - a) * (i + 1) / n; if (pval(P, x0) * pval(P, x1) < 0) return true; } return false; };
  const gfx = (name) => ms(name + '(x)');
  const quo = (top, bottom) => frac(top, bottom);

  // ════════════════════════════════════════════════════════════════
  // 마. 연속함수의 성질
  // ════════════════════════════════════════════════════════════════
  const prop = [
    // ①20 분모가 0이 되는 x 에서만 불연속(교 문제1, 기2-1, 교점3, 최1, 중3 — 원문 곱은 칸마다)
    T('prop-where', '유리함수가 불연속인 x의 값 구하기', '①20', (d) => {
      const r1 = nz(d, -5, 5), r2 = d.until(() => nz(d, -5, 5), (v) => v !== r1 && v !== -r1), D = fromRoots([r1, r2]), num = [nz(d, -7, 7), d.int(0, 3)];
      if (near0(pval(num, r1)) || near0(pval(num, r2))) return null;
      const two = d.bool();
      const text = two ? `두 함수 ${fIs(ptext(num))}, ${fIs(ptext(D), 'g')}에 대하여 함수 ${frac(FX, GX)}가 불연속인 ${X}의 값을 모두 구하시오.`
        : `함수 ${jh(fIs(frac(ptext(num), ptext(D))), '이/가')} 불연속인 ${X}의 값을 모두 구하시오.`;
      return M(text, [{ lead: `${X} =`, answer: Math.min(r1, r2), signed: true }, { lead: `${X} =`, answer: Math.max(r1, r2), signed: true }], { unordered: true,
        shown: `${X} = ${iq(Math.min(r1, r2))}, ${X} = ${iq(Math.max(r1, r2))}`,
        explain: `다항함수의 몫인 유리함수는 분모가 0이 아닌 모든 실수 ${X}에서 연속이다. 분모 ${jh(nb(`${ptext(D)} = (${den(r1)})(${den(r2)})`), '이/가')} 0이 되는 ${X} = ${jq(Math.min(r1, r2), '과/와')} ${X} = ${iq(Math.max(r1, r2))}에서는 정의되지 않으므로 불연속이다.`,
        facts: { calc: [[jn(Math.min(r1, r2)), 0], [jn(Math.max(r1, r2)), 1]], derived: [Math.abs(r1), Math.abs(r2)] } });
    }),

    // ①21 두 함수의 합·차·곱·몫 가운데 연속인 것: 차례 1 모든 실수에서 연속인 것 모두, 차례 2 닫힌구간에서 연속이 아닌 것 하나
    T('prop-combine', '두 함수의 합·차·곱·몫의 연속 가리기', '①21', (d, n) => {
      const noRoot = () => { const h = d.int(-3, 3), k = d.int(1, 5); return [h * h + k, -2 * h, 1]; };
      const twoRoots = () => { const r = nz(d, -4, 4), s = d.until(() => d.int(-4, 4), (v) => v !== r); return fromRoots([r, s]); };
      if (n === 0) {
        const fHas = d.bool(), gHas = d.pick([!fHas, !fHas, d.bool()]), f = fHas ? twoRoots() : noRoot(), g = gHas ? twoRoots() : noRoot();
        if (ptext(f) === ptext(g)) return null;
        const c1 = d.int(1, 3), c2 = nz(d, -3, 3), first = d.pick(['sum', 'mul']);
        const s1 = first === 'sum' ? nb(`${c1 === 1 ? '' : c1}${FX} ${c2 < 0 ? MINUS : '+'} ${Math.abs(c2) === 1 ? '' : Math.abs(c2)}${GX}`) : nb(`${FX}${GX}`);
        const list = [s1, frac(GX, FX), frac(FX, GX)], flags = [true, !fHas, !gHas];
        const why = [`${first === 'sum' ? '두 다항함수의 합·차는' : '두 다항함수의 곱은'} 다항함수이므로 연속이다`, fHas ? `분모 ${FX} = 0의 실근이 있어 그곳에서 불연속이다` : `분모 ${FX}는 항상 양수이므로 연속이다`, gHas ? `분모 ${GX} = 0의 실근이 있어 그곳에서 불연속이다` : `분모 ${GX}는 항상 양수이므로 연속이다`];
        return comboPick(d, `두 함수 ${fIs(ptext(f))}, ${fIs(ptext(g), 'g')}에 대하여 모든 실수 ${X}에서 연속인 함수만을 보기에서 있는 대로 고른 것은?`, list, flags,
          GA.map((t, i) => `${t}. ${why[i]}.`).join(' '));
      }
      const a = d.int(-2, 2), b = a + d.int(2, 3), r = d.int(a, b), s = d.until(() => d.int(-5, 6), (v) => v !== r);
      const h1 = fromRoots([r, s]), t = d.until(() => d.int(-5, 5), (v) => -v < a || -v > b), h2 = [t * t, 2 * t, 1];   // h2 = (x + t)², 근 −t 는 구간 밖
      const fIsH1 = d.bool(), F1 = fIsH1 ? FX : GX, F2 = fIsH1 ? GX : FX, c = d.int(2, 4);
      const opts = [nb(`{${F1}}${sup(2)}`), nb(`${F1} ${MINUS} ${c}${F2}`), frac(1, F1), frac(1, F2), frac(F1, F2)];
      const rows = d.shuffle(opts.map((h, i) => ({ h, bad: i === 2 })));
      const fgText = fIsH1 ? `${fIs(ptext(h1))}, ${fIs(par(den(-t)) + sup(2), 'g')}` : `${fIs(par(den(-t)) + sup(2))}, ${fIs(ptext(h1), 'g')}`;
      return C(`두 함수 ${fgText}에 대하여 다음 중 닫힌구간 ${iv('[', a, b, ']')}에서 연속이 아닌 함수는?`,
        rows.map((x) => x.h), rows.findIndex((x) => x.bad), {
          explain: `${jh(nb(`${F1} = ${r === 0 ? X + `(${den(s)})` : s === 0 ? X + `(${den(r)})` : `(${den(r)})(${den(s)})`}`), '은/는')} ${X} = ${iq(r)}에서 0이 되고 ${jh(iq(r), '은/는')} 구간 ${iv('[', a, b, ']')} 안에 있으므로 ${frac(1, F1)}은 그곳에서 정의되지 않는다. ${jh(nb(`${F2} = ${par(den(-t)) + sup(2)}`), '은/는')} 구간에서 0이 되지 않으므로 나머지는 모두 연속이다.`,
          facts: { truth: rows.map((x) => x.bad), want: true } });
    }, { count: 2 }),

    // ①22 연속함수의 성질에 대한 문장의 참·거짓: 차례 1 ㄱ·ㄴ·ㄷ 가운데 옳은 것, 차례 2 x = a 에서 연속이라고 할 수 없는 함수
    T('prop-claim', '연속함수의 성질에 대한 참·거짓', '①22', (d, n) => {
      const xa = nb(`${X} = ${Av}`);
      if (n === 0) {
        const c1 = d.int(2, 5), c2 = d.int(2, 5);
        const both = `두 함수 ${FX}, ${jh(GX, '이/가')} ${xa}에서 연속이면`;
        const pool = [
          [`${both} 함수 ${nb(`${c1}${FX} ${MINUS} ${c2}${GX}`)}도 ${xa}에서 연속이다.`, true, '연속함수의 실수배와 차는 연속이다'],
          [`${both} 함수 ${FX}${GX}도 ${xa}에서 연속이다.`, true, '연속함수의 곱은 연속이다'],
          [`두 함수 ${FX}, ${jh(GX, '이/가')} ${xa}에서 연속이고 ${nb(`${ms('g(a)')} ≠ 0`)}이면 함수 ${frac(FX, GX)}도 ${xa}에서 연속이다.`, true, '분모가 0이 아닌 연속함수의 몫은 연속이다'],
          [`함수 ${jh(FX, '이/가')} ${xa}에서 연속이면 함수 ${frac(1, FX)}도 ${xa}에서 연속이다.`, false, `${FX} = ${ms('x - a')}이면 ${jh(frac(1, FX), '은/는')} ${xa}에서 정의되지 않는다`],
          [`함수 ${FX}${jh(GX, '이/가')} ${xa}에서 연속이면 두 함수 ${FX}, ${GX}도 ${xa}에서 연속이다.`, false, `${FX}가 ${xa}에서 끊어진 함수(${X} ${GE} ${Av}에서 1, ${X} &lt; ${Av}에서 −1)이고 ${GX} = ${ms('x - a')}이면 곱은 연속이지만 ${FX}는 불연속이다`],
          [`함수 ${FX} + ${jh(GX, '이/가')} ${xa}에서 연속이면 두 함수 ${FX}, ${GX}도 ${xa}에서 연속이다.`, false, `${FX}가 ${xa}에서 끊어진 함수이고 ${GX} = ${MINUS}${FX}이면 합은 0으로 연속이지만 두 함수는 불연속이다`],
          [`함수 ${nb(`{${FX}}${sup(2)}`)}이 ${xa}에서 연속이면 함수 ${FX}도 ${xa}에서 연속이다.`, false, `${FX}가 ${X} ${GE} ${Av}에서 1, ${X} &lt; ${Av}에서 −1이면 제곱은 1로 연속이지만 ${FX}는 불연속이다`]
        ];
        const pick = d.shuffle(pool).slice(0, 3);
        if (!pick.some((p) => p[1])) return null;
        return comboPick(d, '두 함수 ' + FX + ', ' + GX + '에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?', pick.map((p) => p[0]), pick.map((p) => p[1]),
          pick.map((p, i) => `${GA[i]}. ${p[1] ? '참' : '거짓'} — ${p[2]}.`).join(' '));
      }
      const c = d.int(2, 4), k = d.int(2, 5);
      const ok = [nb(`{${FX}}${sup(2)} + {${GX}}${sup(2)}`), nb(`${X2}${FX} ${MINUS} ${c}${GX}`), nb(`{${FX}}${sup(2)}${GX}`), frac(FX, nb(`|${GX}| + ${k}`)), frac(GX, nb(`{${FX}}${sup(2)} + 1`)), nb(`${k}${FX} + ${GX}`)];
      const bad = d.pick([frac(GX, FX), frac(FX, GX), frac(1, nb(`${FX} ${MINUS} ${GX}`)), frac(k, GX)]);
      return pickOne(d, `두 함수 ${FX}, ${jh(GX, '이/가')} 모두 ${xa}에서 연속일 때, 다음 중 ${xa}에서 연속이라고 할 수 없는 것은?`, bad, ok, {
        explain: `연속함수의 합·차·실수배·곱은 연속이고, 몫은 분모가 0이 아닐 때만 연속이다. ${bad}의 분모는 ${xa}에서 0이 될 수 있다(예를 들어 분모의 함수가 ${ms('x - a')}이면 ${xa}에서 정의되지 않는다). 나머지는 분모가 늘 양수이거나 분모가 없다.` });
    }, { count: 2 }),

    // ①23 분모가 이차식인 유리함수가 모든 실수에서 연속이 되는 정수의 개수(판별식 &lt; 0)
    T('prop-count', '모든 실수에서 연속이 되는 정수의 개수(분모의 판별식)', '①23', (d) => {
      const al = d.pick([1, 2, 3, 6]), be = d.pick([1, 2]), ga = d.int(1, 4), cnt = ri(-60, 60).filter((t) => t !== 0 && be * be * t * t - 4 * al * ga * t < 0);
      if (cnt.length < 2 || cnt.length > 15 || cnt.some((t) => t <= 0)) return null;
      const Dh = poly([[al, X2], [be, Kv + X], [ga, Kv]]), num = d.bool() ? ptext([nz(d, -5, 5), 1]) : ptext([-d.int(1, 6), 0, 1]);
      const bound = Q(4 * al * ga, be * be);
      return N(`함수 ${jh(fIs(frac(num, Dh)), '이/가')} 모든 실수 ${X}에서 연속이 되도록 하는 정수 ${Kv}의 개수는?`, cnt.length, {
        explain: `분모가 0이 되는 실수 ${X}가 없어야 하므로 이차방정식 ${Dh} = 0의 판별식이 음수여야 한다: ${nb(`${be === 1 ? '' : be * be}${Kv}${sup(2)} ${MINUS} ${4 * al * ga}${Kv} &lt; 0`)}, 0 &lt; ${Kv} &lt; ${iq(bound)}. 이를 만족시키는 정수 ${jh(Kv, '은/는')} ${cnt.length}개이다.`,
        facts: { value: String(cnt.length), derived: [cnt.length] } });
    }),

    // ①24 그래프로 준 두 함수의 차(합)·몫·곱의 연속(중8 — 그림 새로 지음)
    T('prop-graph', '그래프로 준 두 함수의 합·몫·곱의 연속', '①24', (d) => {
      const Ys = [-1, 0, 1, 2];
      const mk = () => { const v = { a: d.pick(Ys), L0: d.pick(Ys), R0: d.pick(Ys), V0: 0, L2: d.pick(Ys), R2: d.pick(Ys), V2: 0, e: d.pick(Ys) }; v.V0 = d.pick([v.L0, v.R0, d.pick(Ys)]); v.V2 = d.pick([v.L2, v.R2, d.pick(Ys)]); return v; };
      const f = mk(), g = mk();
      const jumps = (h) => [h.L0 !== h.R0 || h.V0 !== h.L0, h.L2 !== h.R2 || h.V2 !== h.L2];
      if (!jumps(f).some(Boolean) || !jumps(g).some(Boolean)) return null;
      const side = (h, p) => (p === 0 ? [h.L0, h.R0, h.V0] : [h.L2, h.R2, h.V2]);
      const p1 = d.pick([0, 2]), p2 = d.pick([0, 2]), p3 = d.pick([0, 2]), plus = d.bool();
      const [fl1, fr1, fv1] = side(f, p1), [gl1, gr1, gv1] = side(g, p1);
      const s1 = plus ? [fl1 + gl1, fr1 + gr1, fv1 + gv1] : [fl1 - gl1, fr1 - gr1, fv1 - gv1];
      const [fl2, fr2, fv2] = side(f, p2), [gl2, gr2, gv2] = side(g, p2);
      if (gv2 !== 0 && (gl2 === 0 || gr2 === 0)) return null;   // 몫의 극한이 무한대로 가는 꼴은 피한다
      const t2 = gv2 !== 0 && fl2 / gl2 === fr2 / gr2 && fr2 / gr2 === fv2 / gv2;
      const [fl3, fr3, fv3] = side(f, p3), [gl3, gr3, gv3] = side(g, p3);
      const t1 = s1[0] === s1[1] && s1[1] === s1[2], t3 = fl3 * gl3 === fr3 * gr3 && fr3 * gr3 === fv3 * gv3;
      const flags = [t1, t2, t3];
      if (flags.every(Boolean) || !flags.some(Boolean)) return null;
      const draw = (h, nm) => {
        const segs = [[-1, h.a, 0, h.L0], [0, h.R0, 2, h.L2], [2, h.R2, 3, h.e]], dots = [];
        for (const [x, L, R, Vv] of [[0, h.L0, h.R0, h.V0], [2, h.L2, h.R2, h.V2]]) {
          if (L === R && Vv === L) continue;
          for (const y of [...new Set([L, R])]) if (y !== Vv) dots.push({ x, y, open: true });
          dots.push({ x, y: Vv });
        }
        return segGraph({ x: [-1.5, 3.5], y: [-1.5, 2.5], w: 230, xt: [-1, 1, 2, 3], yt: [-1, 1, 2], segs, dots, grid: false, say: `${nm}의 그래프.` });
      };
      const st = [`함수 ${nb(`${FX} ${plus ? '+' : MINUS} ${GX}`)}는 ${X} = ${p1}에서 연속이다.`, `함수 ${frac(FX, GX)}는 ${X} = ${p2}에서 연속이다.`, `함수 ${FX}${GX}는 ${X} = ${p3}에서 연속이다.`];
      const why = [
        `${GA[0]}. 좌극한 ${iq(s1[0])}, 우극한 ${iq(s1[1])}, 함숫값 ${jq(s1[2], '으로/로')} ${t1 ? '모두 같아 연속이다' : '같지 않아 불연속이다'}.`,
        gv2 === 0 ? `${GA[1]}. ${jh(ms(`g(${p2})`), '이/가')} 0이라 ${X} = ${p2}에서 정의되지 않아 불연속이다.` : `${GA[1]}. 좌극한 ${iq(Q(fl2, gl2))}, 우극한 ${iq(Q(fr2, gr2))}, 함숫값 ${jq(Q(fv2, gv2), '으로/로')} ${t2 ? '모두 같아 연속이다' : '같지 않아 불연속이다'}.`,
        `${GA[2]}. 좌극한 ${iq(fl3 * gl3)}, 우극한 ${iq(fr3 * gr3)}, 함숫값 ${jq(fv3 * gv3, '으로/로')} ${t3 ? '모두 같아 연속이다' : '같지 않아 불연속이다'}.`
      ];
      return comboPick(d, `두 함수 ${nb(`y = ${FX}`)}, ${nb(`y = ${GX}`)}의 그래프가 그림과 같다. 보기에서 옳은 것만을 있는 대로 고른 것은?`, st, flags, why.join(' '),
        { figure: gridOf([draw(f, 'y = f(x)'), draw(g, 'y = g(x)')], [nb(`y = ${FX}`), nb(`y = ${GX}`)]) + lines(st.map((h, i) => `<b>${GA[i]}.</b> ${h}`)) });
    }),

    // ①25 끊어진 f 와 g 의 곱·몫이 연속: 차례 1 곱 f(x)g(x)(g 도 조각 함수), 차례 2 몫 g(x)/f(x)(g(c) = 0 이 되어야 한다 — 답은 분수)
    T('prop-mul', '끊어진 함수와의 곱·몫이 연속이 되는 상수 구하기', '①25', (d, n) => {
      const c = d.int(-1, 2);
      if (n === 0) {
        const p = d.pick([1, 2, 3, -1, -2]), q = d.until(() => d.pick([1, 2, 3, -1, -2, -3]), (v) => v !== p), m = nz(d, -3, 3), a = nz(d, -5, 5);
        const top = p * (c + a);
        if (top % q !== 0 || top === 0) return null;
        const e = top / q - m * c;
        if (e === 0) return null;
        const pc = `${p === 1 ? '' : p === -1 ? MINUS : iq(p)}(${poly([[c, ''], [1, Av]])})`;
        const f = cases([[iq(p), ge(c)], [iq(q), lt(c)]]), g = cases([[poly([[1, X], [1, Av]]), ge(c)], [ptext([e, m]), lt(c)]]);
        return qAns(`두 함수 ${fIs(f)}, ${fIs(g, 'g')}에 대하여 함수 ${jh(nb(FX + GX), '이/가')} 모든 실수 ${X}에서 연속일 때, 상수 ${Av}의 값은?`, a, { signed: true,
          explain: `${X} ≠ ${iq(c)}인 곳에서는 두 함수가 모두 연속이므로 ${X} = ${iq(c)}에서만 보면 된다. 우극한과 함숫값은 ${pc}, 좌극한은 ${iq(q)} × ${par(iq(m * c + e))} = ${iq(top)}이므로 ${pc} = ${iq(top)}, ${Av} = ${iq(a)}이다.`,
          facts: { value: `${jn(q)}*(${jn(m)}*${jn(c)}+${jn(e)})/${jn(p)}-${jn(c)}` } });
      }
      const cc = nz(d, -3, 3), u = d.int(1, 5), v = d.until(() => d.int(1, 7), (t) => t !== u), w = nz(d, -9, 9), aq = Q(w, cc);
      if (aq.q === 1) return null;
      const P = [cc * cc + u, -2 * cc, 1], gC = ms(`g(${cc < 0 ? '-' + Math.abs(cc) : cc})`);
      const f = cases([[ptext(P), ge(cc)], [iq(v), lt(cc)]]);
      return qAns(`두 함수 ${fIs(f)}, ${fIs(poly([[1, Av + X], [-w, '']]), 'g')}에 대하여 함수 ${frac(GX, FX)}가 모든 실수 ${X}에서 연속일 때, 상수 ${Av}의 값은?`, aq, { signed: true,
        explain: `${jh(FX, '은/는')} 늘 양수이므로 ${X} = ${iq(cc)}에서만 보면 된다. 이곳에서 우극한과 함숫값은 ${frac(gC, u)}, 좌극한은 ${frac(gC, v)}이다. ${u} ≠ ${v}이므로 셋이 같으려면 ${gC} = 0이어야 한다. ${iq(cc)}${Av} ${sgnT(-w)} = 0, ${Av} = ${iq(aq)}이다.`,
        facts: { value: `${jn(w)}/${jn(cc)}` } });
    }, { count: 2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 바. 최대·최소 정리
  // ════════════════════════════════════════════════════════════════
  const maxmin = [
    // ①29 닫힌구간에서 연속인 함수의 최댓값·최솟값: 차례 1 이차함수, 차례 2 유리함수, 차례 3 무리함수
    T('mm-value', '닫힌구간에서 연속인 함수의 최댓값과 최솟값', '①29', (d, n) => {
      let h, f, a, b, ev, why;
      if (n === 0) {
        const s = d.pick([1, -1, 2, -1]), hh = d.int(-3, 3), k = d.int(-5, 6); a = d.int(-4, 2); b = a + d.int(2, 5);
        const P = [s * hh * hh + k, -2 * s * hh, s]; h = ptext(P); f = (x) => pval(P, x);
        ev = (x) => `${jn(P[2])}*${jn(x)}*${jn(x)}+${jn(P[1])}*${jn(x)}+${jn(P[0])}`;
        const inside = hh > a && hh < b, xs = [a, b].concat(inside ? [hh] : []), vs = xs.map(f), mx = Math.max(...vs), mn = Math.min(...vs);
        if (mx === mn) return null;
        const at = (v) => xs[vs.indexOf(v)];
        why = `${FX} = ${ptext([k, 0, s], hh === 0 ? X : par(den(hh)))}이므로 ${inside ? `꼭짓점 ${X} = ${jq(hh, '이/가')} 구간 안에 있다. ` : `구간에서 한쪽으로만 변한다. `}${X} = ${iq(at(mx))}에서 최댓값 ${iq(mx)}, ${X} = ${iq(at(mn))}에서 최솟값 ${jq(mn, '을/를')} 갖는다.`;
        return vals(`함수 ${fIs(h)}의 닫힌구간 ${iv('[', a, b, ']')}에서의 최댓값과 최솟값은?`, [['최댓값', mx], ['최솟값', mn]], { explain: why, facts: { calc: [[ev(at(mx)), 0], [ev(at(mn)), 1]], derived: [Math.abs(hh)] } });
      }
      if (n === 1) {
        const p = nz(d, -3, 3), q = d.int(-3, 3), da = d.pick([1, 2, 3]), db = d.pick([2, 3, 4, 6]), right = d.bool();
        if (da >= db) return null;
        const k = nz(d, -12, 12);
        a = right ? p + da : p - db; b = right ? p + db : p - da;
        const fa = Q(k, a - p), fb = Q(k, b - p);
        if (fa.q !== 1 || fb.q !== 1) return null;
        const va = fa.p + q, vb = fb.p + q, mx = Math.max(va, vb), mn = Math.min(va, vb);
        const shape = d.bool();
        h = shape ? (k < 0 ? MINUS : '') + frac(Math.abs(k), den(p)) + (q ? ` ${sgnT(q)}` : '') : frac(ptext([k - q * p, q]), den(p));
        if (!shape && q === 0) return null;
        why = `${shape ? '' : `${FX} = ${(k < 0 ? MINUS : '') + frac(Math.abs(k), den(p))}${q ? ' ' + sgnT(q) : ''}이고 `}분모가 0이 되는 ${X} = ${jq(p, '이/가')} 구간 밖이므로 ${jh(FX, '은/는')} 닫힌구간에서 연속이고 한쪽으로만 변한다. ${fAt(a)} = ${jq(va, '과/와')} ${fAt(b)} = ${iq(vb)} 가운데 큰 값 ${jq(mx, '이/가')} 최댓값, 작은 값 ${jq(mn, '이/가')} 최솟값이다.`;
        const evq = (x) => `${jn(k)}/(${jn(x)}-${jn(p)})+${jn(q)}`;
        return vals(`함수 ${fIs(h)}의 닫힌구간 ${iv('[', a, b, ']')}에서의 최댓값과 최솟값은?`, [['최댓값', mx], ['최솟값', mn]], { explain: why, facts: { calc: [[evq(va === mx ? a : b), 0], [evq(va === mx ? b : a), 1]], derived: [Math.abs(k), Math.abs(q), Math.abs(p)] } });
      }
      const m = d.pick([1, 2, 3]), sg = pm(d), q = d.int(-4, 4), t1 = d.int(0, 2), t2 = t1 + d.int(1, 3), dir = pm(d);
      // 근호 안 dir·m x + c 가 두 끝에서 t1², t2² 이 되게 한다
      const c0 = d.int(-6, 6), x1 = (t1 * t1 - c0) / (dir * m), x2 = (t2 * t2 - c0) / (dir * m);
      if (!Number.isInteger(x1) || !Number.isInteger(x2) || Math.abs(x1) > 8 || Math.abs(x2) > 8) return null;
      a = Math.min(x1, x2); b = Math.max(x1, x2);
      const inner = ptext([c0, dir * m]), v1 = sg * t1 + q, v2 = sg * t2 + q, mx = Math.max(v1, v2), mn = Math.min(v1, v2);
      h = (sg < 0 ? MINUS : '') + rt(inner) + (q ? ` ${sgnT(q)}` : '');
      return vals(`함수 ${fIs(h)}의 닫힌구간 ${iv('[', a, b, ']')}에서의 최댓값과 최솟값은?`, [['최댓값', mx], ['최솟값', mn]], {
        explain: `근호 안 ${jh(inner, '은/는')} 구간에서 ${t1 * t1}부터 ${t2 * t2}까지 한쪽으로만 변하므로 ${jh(FX, '은/는')} 닫힌구간에서 연속이고 두 끝에서 최댓값·최솟값을 갖는다. 끝값은 ${iq(v1)}, ${iq(v2)}이므로 최댓값은 ${iq(mx)}, 최솟값은 ${iq(mn)}이다.`,
        facts: { calc: [[`${sg}*${mx === v1 ? t1 : t2}+${jn(q)}`.replace(/^-1\*/, '0-1*'), 0], [`${sg}*${mn === v1 ? t1 : t2}+${jn(q)}`.replace(/^-1\*/, '0-1*'), 1]], derived: [t1, t2] } });
    }, { count: 3 }),

    // ①30 닫힌구간·열린구간·반열린구간에서 이차함수의 최댓값·최솟값이 있는가
    T('mm-open', '구간의 모양에 따른 최댓값·최솟값의 존재', '①30', (d) => {
      const s = pm(d), hh = d.int(-2, 3), k = d.int(-4, 4), a = d.int(-3, 1), b = a + d.int(2, 5);
      if (hh === a || hh === b) return null;
      const P = [s * hh * hh + k, -2 * s * hh, s], f = (x) => pval(P, x), lb = d.pick(['[', '(']), rb = d.pick([']', ')']);
      const cand = [{ x: a, v: f(a), inc: lb === '[' }, { x: b, v: f(b), inc: rb === ']' }];
      if (hh > a && hh < b) cand.push({ x: hh, v: f(hh), inc: true });
      const mx = Math.max(...cand.map((c) => c.v)), mn = Math.min(...cand.map((c) => c.v));
      const hasMax = cand.some((c) => c.v === mx && c.inc), hasMin = cand.some((c) => c.v === mn && c.inc);
      const say = ['최댓값과 최솟값이 모두 있다.', '최댓값은 있고 최솟값은 없다.', '최댓값은 없고 최솟값은 있다.', '최댓값과 최솟값이 모두 없다.'];
      const at = hasMax ? (hasMin ? 0 : 1) : (hasMin ? 2 : 3);
      const word = (c) => `${X} = ${iq(c.x)}에서 ${iq(c.v)}${c.x === hh ? '(꼭짓점)' : c.inc ? '(구간에 들어 있음)' : '(구간에 들어 있지 않음)'}`;
      return C(`함수 ${fIs(ptext(P))}의 구간 ${iv(lb, a, b, rb)}에서의 최댓값과 최솟값에 대한 설명으로 옳은 것은?`, say, at, {
        explain: `${FX}의 값은 ${cand.map(word).join(', ')}이다. 가장 큰 값 ${jq(mx, '은/는')}${hasMax ? ' 구간 안에서 실제로 가지므로 최댓값이 있다' : ' 구간에 들어 있지 않은 끝에서만 다가가므로 최댓값이 없다'}. 가장 작은 값 ${jq(mn, '은/는')}${hasMin ? ' 실제로 가지므로 최솟값이 있다' : ' 구간에 들어 있지 않은 끝에서만 다가가므로 최솟값이 없다'}.`,
        facts: { truth: say.map((_, i) => i === at), want: true } });
    }),

    // ①31 유리함수가 닫힌구간에서 최댓값·최솟값을 모두 갖는 조건: 차례 1 a 의 범위(고르기), 차례 2 둘 다 갖지 않는 구간 고르기
    T('mm-asym', '유리함수가 닫힌구간에서 최댓값·최솟값을 갖는 조건', '①31', (d, n) => {
      const k = d.pick([1, 2, 3, 4, 5, -2, -3]);
      if (n === 0) {
        const p = d.int(-3, 2), q = p + d.int(2, 6), A = Av;
        const r = (s) => nb(s);
        const right = r(`${A} &lt; ${iq(p)} 또는 ${A} &gt; ${iq(q)}`);
        return pickOne(d, `함수 ${nb('y = ')}${jh(frac(k, nb(`${X} ${MINUS} ${A}`)), '이/가')} 닫힌구간 ${iv('[', p, q, ']')}에서 최댓값과 최솟값을 모두 갖도록 하는 실수 ${A}의 값의 범위는?`, right,
          [r(`${A} ${LE} ${iq(p)} 또는 ${A} ${GE} ${iq(q)}`), r(`${iq(p)} &lt; ${A} &lt; ${iq(q)}`), r(`${iq(p)} ${LE} ${A} ${LE} ${iq(q)}`), r(`${A} &lt; ${iq(p)}`), r(`${A} &gt; ${iq(q)}`)], {
            explain: `분모가 0이 되는 ${X} = ${jh(A, '이/가')} 닫힌구간 ${iv('[', p, q, ']')} 안에 있으면 그 근처에서 함숫값이 한없이 커지거나 작아져 최댓값·최솟값을 모두 가질 수 없다(끝점이어도 그 끝에서 정의되지 않는다). 구간 밖이면 닫힌구간에서 연속이므로 최대·최소 정리에 의하여 둘 다 갖는다. 따라서 ${right}이다.` });
      }
      const p = d.int(-3, 4), c = d.int(-2, 2), f = (k < 0 ? MINUS : '') + frac(Math.abs(k), den(p)) + (c ? ` ${sgnT(c)}` : '');
      const hit = iv('[', p - d.int(1, 2), p + d.int(1, 2), ']');
      const pool = [];
      for (const [l, len] of [[p + 1, 2], [p + 2, 1], [p - 3, 2], [p - 4, 3], [p + 1, 3], [p - 2, 1], [p + 3, 2]]) if (!(l <= p && l + len >= p)) pool.push(iv('[', l, l + len, ']'));
      return pickOne(d, `함수 ${fIs(f)}에 대하여 다음 중 ${jh(FX, '이/가')} 최댓값과 최솟값을 모두 갖지 않는 구간은?`, hit, pool, {
        explain: `${X} = ${jq(p, '이/가')} 안에 든 구간 ${hit}에서는 ${X}가 ${iq(p)}에 가까워질 때 함숫값이 한쪽에서는 한없이 커지고 다른 쪽에서는 한없이 작아지므로 최댓값과 최솟값이 모두 없다. 나머지 구간에서는 연속이므로 최대·최소 정리에 의하여 둘 다 있다.` });
    }, { count: 2 }),

    // ①32 곱·합성한 함수가 닫힌구간에서 최댓값·최솟값을 모두 갖는가
    T('mm-compose', '곱·합성한 함수가 닫힌구간에서 최댓값·최솟값을 갖는가', '①32', (d) => {
      const s = nz(d, -3, 3), t = d.int(-3, 3), k = d.pick([1, 2, 3]), a = d.int(-2, 1), b = a + d.int(2, 4);
      if (s === -t) return null;
      const pole1 = -t, pole2 = s - t;
      if ([pole1, pole2].some((v) => v === a || v === b)) return null;
      const inside = (v) => v > a && v < b;
      const items = [
        { h: nb(`${FX}${GX}`), ok: !inside(pole1), why: `${jh(nb(`${FX}${GX} = ${frac(k === 1 ? den(s) : `${k}(${den(s)})`, den(-t))}`), '은/는')} ${X} = ${iq(pole1)}에서 정의되지 않는다` },
        { h: nb(`(${V('f')} ∘ ${V('g')})(${X})`), ok: !inside(pole1), why: `${jh(nb(`(${V('f')} ∘ ${V('g')})(${X}) = ${frac(k, den(-t))} ${sgnT(-s)}`), '은/는')} ${X} = ${iq(pole1)}에서 정의되지 않는다` },
        { h: nb(`(${V('g')} ∘ ${V('f')})(${X})`), ok: !inside(pole2), why: `${jh(nb(`(${V('g')} ∘ ${V('f')})(${X}) = ${frac(k, den(pole2))}`), '은/는')} ${X} = ${iq(pole2)}에서 정의되지 않는다` }
      ];
      const rows = d.shuffle(items);
      if (!rows.some((r) => r.ok) || rows.every((r) => r.ok)) return null;   // 셋 다 옳은 답만 자주 나오지 않게(원문 중9도 하나가 거짓)
      return comboPick(d, `두 함수 ${fIs(den(s))}, ${fIs(frac(k, den(-t)), 'g')}에 대하여 닫힌구간 ${iv('[', a, b, ']')}에서 최댓값과 최솟값을 모두 갖는 함수만을 보기에서 있는 대로 고른 것은?`,
        rows.map((r) => r.h), rows.map((r) => r.ok),
        rows.map((r, i) => `${GA[i]}. ${r.why}. ${r.ok ? `그 점이 구간 밖이므로 닫힌구간에서 연속이고 최댓값과 최솟값을 모두 갖는다` : `그 점이 구간 안에 있어 함숫값이 한없이 커지고 작아지므로 최댓값과 최솟값을 모두 갖지 않는다`}.`).join(' '));
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 사. 사잇값 정리
  // ════════════════════════════════════════════════════════════════
  const polyEval = (P, x) => { const t = P.map((c, i) => (c === 0 ? null : i === 0 ? jn(c) : `${jn(c)}*${Array(i).fill(jn(x)).join('*')}`)).filter(Boolean); return t.length ? t.join('+') : '0'; };
  const ivt = [
    // ①33 f(c) = k 인 c 가 있음을 보이는 과정의 빈칸(끝값)
    T('ivt-k', 'f(c) = k인 c가 있음을 보이는 과정의 빈칸', '①33', (d) => {
      const P = [nz(d, -5, 5), nz(d, -4, 4), d.int(-2, 2), 1], a = d.int(-2, 1), b = a + d.int(1, 2), fa = pval(P, a), fb = pval(P, b);
      if (Math.abs(fb - fa) < 2 || Math.abs(fa) > 40 || Math.abs(fb) > 40) return null;
      const lo = Math.min(fa, fb), hi = Math.max(fa, fb), k = d.int(lo + 1, hi - 1);
      const proof = [`함수 ${jh(FX, '은/는')} 닫힌구간 ${iv('[', a, b, ']')}에서 연속이고`, `${fAt(a)} = (가), ${fAt(b)} = (나)`, `에서 ${fAt(a)} ≠ ${fAt(b)}이고 ${jq(k, '은/는')} 그 사이의 값이므로 사잇값 정리에 의하여 ${nb(`${ms('f(c)')} = ${iq(k)}`)}인 ${jh(ms('c'), '이/가')} 열린구간 ${iv('(', a, b, ')')}에 적어도 하나 존재한다.`];
      return M(`다음은 함수 ${fIs(ptext(P))}에 대하여 ${nb(`${ms('f(c)')} = ${iq(k)}`)}인 ${jh(ms('c'), '이/가')} 열린구간 ${iv('(', a, b, ')')}에 적어도 하나 존재함을 보이는 과정이다. (가), (나)에 알맞은 수는?`,
        [{ lead: '(가)', answer: fa, signed: true }, { lead: '(나)', answer: fb, signed: true }], { figure: lines(proof), shown: `(가) ${iq(fa)}, (나) ${iq(fb)}`,
          explain: `${fAt(a)} = ${iq(fa)}, ${fAt(b)} = ${iq(fb)}이고 ${jq(k, '은/는')} ${jq(lo, '과/와')} ${iq(hi)} 사이에 있다.`,
          facts: { calc: [[polyEval(P, a), 0], [polyEval(P, b), 1]] } });
    }),

    // ①34 방정식이 실근을 가짐을 사잇값 정리로 보일 수 있는 열린구간 고르기(나머지 구간에는 실근이 없다)
    T('ivt-root', '방정식의 실근이 있는 열린구간 고르기', '①34', (d) => {
      const P = [nz(d, -6, 6), d.int(-5, 5), d.int(-3, 3), 1].concat(d.bool() ? [] : []);
      const cands = [];
      for (let l = -4; l <= 3; l += 1) cands.push([l, l + 1]);
      for (const [l, r] of cands) if (pval(P, l) === 0 || pval(P, r) === 0) return null;
      const yes = cands.filter(([l, r]) => pval(P, l) * pval(P, r) < 0), no = cands.filter(([l, r]) => !rootsIn(P, l, r));
      if (yes.length < 1 || no.length < 4) return null;
      const [l0, r0] = d.pick(yes);
      return pickOne(d, `다음 중 사잇값 정리에 의하여 방정식 ${nb(`${ptext(P)} = 0`)}의 실근이 존재함을 보일 수 있는 열린구간은?`, iv('(', l0, r0, ')'), no.map(([l, r]) => iv('(', l, r, ')')), {
        explain: `${FX} = ${jh(ptext(P), '이라/라')} 하면 ${jh(FX, '은/는')} 연속이고 ${fAt(l0)} = ${iq(pval(P, l0))}, ${fAt(r0)} = ${jq(pval(P, r0), '으로/로')} 부호가 다르므로 열린구간 ${iv('(', l0, r0, ')')}에 실근이 적어도 하나 있다. 나머지 구간은 두 끝값의 부호가 같다.` });
    }),

    // ①35 몇 점의 함숫값으로 실근의 개수의 하한: 차례 1 함숫값, 차례 2 실생활 표(기온)
    T('ivt-signs', '함숫값의 부호로 실근의 개수 구하기', '①35', (d, n) => {
      if (n === 0) {
        const xs = d.pick([[-2, -1, 0, 1, 2], [-2, -1, 0, 2], [-1, 0, 1, 2, 3], [0, 1, 2, 3, 4]]);
        const vs = xs.map(() => (d.bool() ? Q(nz(d, -5, 5)) : Q(pm(d) * d.int(1, 3), 2)));
        const ch = vs.slice(1).filter((v, i) => v.p * vs[i].p < 0).length;
        if (ch < 1 || ch === xs.length - 1 && d.bool()) return null;
        const list = xs.map((x, i) => nb(`${fAt(x)} = ${iq(vs[i])}`)).join(', ');
        return N(`모든 실수 ${X}에서 연속인 함수 ${FX}에 대하여 ${list}일 때, 방정식 ${nb(`${FX} = 0`)}은 열린구간 ${iv('(', xs[0], xs[xs.length - 1], ')')}에서 적어도 몇 개의 실근을 갖는가?`, ch, {
          explain: `이웃한 두 점의 함숫값의 부호가 다른 구간마다 사잇값 정리에 의하여 실근이 적어도 하나 있다. 부호가 바뀌는 곳은 ${ch}군데이므로 적어도 ${ch}개이다.`,
          facts: { value: String(ch), derived: [ch] } });
      }
      const step = d.pick([3, 4]), times = ri(0, 24 / step).map((i) => i * step);
      const temps = times.map(() => (d.bool() ? 1 : -1) * d.int(1, 79) / 10);
      const ch = temps.slice(1).filter((v, i) => v * temps[i] < 0).length;
      if (ch < 2) return null;
      return N(`다음은 어느 지역의 하루 동안의 기온을 ${step}시간 간격으로 재어 나타낸 표이다. 기온이 시각에 따라 연속적으로 변한다고 할 때, 이날 이 지역의 기온이 0 °C인 시각은 적어도 몇 번 있었는가?`, ch, {
        figure: table(['시각(시)', '기온(°C)'], times.map((t, i) => [String(t), (temps[i] < 0 ? MINUS : '') + Math.abs(temps[i]).toFixed(1)])),
        explain: `시각 ${V('t')}에서의 기온을 ${ms('f(t)')}라 하면 ${ms('f(t)')}는 연속이다. 이웃한 두 시각의 기온의 부호가 다른 구간마다 사잇값 정리에 의하여 0 °C인 때가 적어도 한 번 있다. 그런 구간이 ${ch}군데이므로 적어도 ${ch}번이다.`,
        facts: { value: String(ch), derived: [ch] } });
    }, { count: 2 }),

    // ①37 이차방정식이 열린구간에서 실근을 갖도록 하는 상수의 범위: 차례 1 범위(부등호까지 칸), 차례 2 정수의 개수.
    //  꼭짓점이 구간 밖이면 f(p)f(q) < 0 이 곧 조건이고, 안이면 두 근이 다 구간에 드는 경우까지 들어가 범위의 한쪽 끝이 포함된다 — 코드가 셈한다.
    T('ivt-range', '이차방정식이 열린구간에서 실근을 갖는 상수의 범위', '①37', (d, n) => {
      const A = pm(d), B = 2 * d.int(-5, 5), sg = n === 0 ? pm(d) : d.pick([1, -1, 2, -2]), tau = d.int(-8, 8), p = d.int(-3, 2), q = p + d.int(2, 4);
      const phi = (x) => -(A * x * x + B * x), v = -B / (2 * A), inside = v > p && v < q;
      if (phi(p) === phi(q) && !inside) return null;
      // y = φ(x) (p < x < q)가 가지는 값: [아래 끝, 닫힘?, 위 끝, 닫힘?]
      let lo, loC, hi, hiC;
      if (inside) { const E = phi(v), other = A > 0 ? Math.min(phi(p), phi(q)) : Math.max(phi(p), phi(q)); if (A > 0) { lo = other; loC = false; hi = E; hiC = true; } else { lo = E; loC = true; hi = other; hiC = false; } }
      else { lo = Math.min(phi(p), phi(q)); hi = Math.max(phi(p), phi(q)); loC = false; hiC = false; }
      // σk + τ = y → k = (y − τ)/σ
      let kl = (lo - tau) / sg, kh = (hi - tau) / sg, klC = loC, khC = hiC;
      if (sg < 0) { [kl, kh] = [kh, kl]; [klC, khC] = [khC, klC]; }
      const eqh = nb(`${poly([[A, X2], [B, X], [sg, Kv], [tau, '']])} = 0`), Fh = poly([[A, X2], [B, X], [sg, Kv], [tau, '']]);
      const rangeT = `${iq(kl)} ${klC ? LE : '&lt;'} ${Kv} ${khC ? LE : '&lt;'} ${iq(kh)}`;
      const kTerm = (c) => poly([[sg, Kv], [c, '']]);
      const fullWhy = inside
        ? `꼭짓점의 ${X}좌표 ${jq(v, '이/가')} 구간 ${iv('(', p, q, ')')} 안에 있으므로, 두 끝값의 부호가 다른 경우 말고도 두 근이 모두 구간 안에 드는 경우가 있다. 방정식을 ${jh(nb(`${kTerm(tau)} = ${ptext([0, -B, -A])}`), '으로/로')} 고쳐 쓰고 ${nb(`${V('y')} = ${ptext([0, -B, -A])}`)} (${iq(p)} &lt; ${X} &lt; ${iq(q)})가 가지는 값을 구하면 ${iq(lo)} ${loC ? LE : '&lt;'} ${V('y')} ${hiC ? LE : '&lt;'} ${iq(hi)}이다. 따라서 ${rangeT}이다.`
        : `${FX} = ${jh(Fh, '이라/라')} 하면 꼭짓점의 ${X}좌표 ${jq(v, '이/가')} 구간 밖이라 ${jh(FX, '은/는')} ${iv('(', p, q, ')')}에서 한쪽으로만 변한다. 따라서 실근을 가질 조건은 ${fAt(p)}${fAt(q)} &lt; 0이다. ${fAt(p)} = ${kTerm(tau - phi(p))}, ${fAt(q)} = ${jh(kTerm(tau - phi(q)), '이므로/이므로').replace(/이므로\/이므로$/, '이므로')} ${rangeT}이다.`;
      const yAt = (x) => `(0-(${jn(A)}*${jn(x)}*${jn(x)}+${jn(B)}*${jn(x)}))`;
      const srcOf = (val) => (inside && val === phi(v) ? v : val === phi(p) ? p : q);
      const exprK = (yv) => `(${yAt(srcOf(yv))}-${jn(tau)})/${jn(sg)}`;
      const exLo = exprK(sg > 0 ? lo : hi), exHi = exprK(sg > 0 ? hi : lo);
      if (n === 0) {
        if (!Number.isInteger(kl) || !Number.isInteger(kh)) return null;
        return inline(`방정식 ${eqh}이 열린구간 ${iv('(', p, q, ')')}에서 적어도 하나의 실근을 갖도록 하는 실수 ${Kv}의 값의 범위를 구하시오.`, `{0} {1} ${Kv} {2} {3}`,
          [{ answer: kl, signed: true }, { rel: true, answer: klC ? '<=' : '<' }, { rel: true, answer: khC ? '<=' : '<' }, { answer: kh, signed: true }], {
            shown: rangeT, explain: fullWhy,
            facts: { calc: [[exLo, 0], [exHi, 3]], derived: [2, Math.abs(v)] } });
      }
      const ints2 = ri(-200, 200).filter((t) => (klC ? t >= kl : t > kl) && (khC ? t <= kh : t < kh));
      if (ints2.length < 2 || ints2.length > 40) return null;
      return N(`방정식 ${eqh}이 열린구간 ${iv('(', p, q, ')')}에서 적어도 하나의 실근을 갖도록 하는 정수 ${Kv}의 개수는?`, ints2.length, {
        explain: `${fullWhy} 이 범위의 정수는 ${ints2.length}개이다.`,
        facts: { value: String(ints2.length), derived: [ints2.length] } });
    }, { count: 2 }),

    // ①38 보조 함수 g 를 만들어 실근이 있음을 보이는 과정의 빈칸(끝값)
    T('ivt-aux', '보조 함수로 실근이 있음을 보이는 과정의 빈칸', '①38', (d) => {
      const p = d.int(-2, 0), q = p + d.int(1, 2), A = nz(d, -5, 5), Bq = nz(d, -5, 5), c = nz(d, -5, 5), form = d.int(0, 2);
      let eqT, gT, gp, gq, gpE, gqE;
      if (form === 0) { eqT = nb(`${X}${FX} = ${ptext([c, 1])}`); gT = poly([[1, X + FX], [-1, X], [-c, '']]); gp = p * A - p - c; gq = q * Bq - q - c; gpE = `${jn(p)}*${jn(A)}-${jn(p)}-${jn(c)}`; gqE = `${jn(q)}*${jn(Bq)}-${jn(q)}-${jn(c)}`; }
      else if (form === 1) { eqT = nb(`${FX} = ${ptext([c, 0, 1])}`); gT = `${FX} ${MINUS} ${X2}${c ? ' ' + sgnT(-c) : ''}`; gp = A - p * p - c; gq = Bq - q * q - c; gpE = `${jn(A)}-${jn(p)}*${jn(p)}-${jn(c)}`; gqE = `${jn(Bq)}-${jn(q)}*${jn(q)}-${jn(c)}`; }
      else { eqT = nb(`${FX} = ${ptext([c, 2])}`); gT = `${FX} ${MINUS} 2${X}${c ? ' ' + sgnT(-c) : ''}`; gp = A - 2 * p - c; gq = Bq - 2 * q - c; gpE = `${jn(A)}-2*${jn(p)}-${jn(c)}`; gqE = `${jn(Bq)}-2*${jn(q)}-${jn(c)}`; }
      if (gp * gq >= 0) return null;
      const gx = (v) => ms(`g(${v < 0 ? '-' + Math.abs(v) : v})`);
      const proof = [`${jh(nb(`${GX} = ${gT}`), '이라/라')} 하면 ${jh(GX, '은/는')} 닫힌구간 ${iv('[', p, q, ']')}에서 연속이고`, `${gx(p)} = (가), ${gx(q)} = (나)`, `이므로 사잇값 정리에 의하여 ${nb(`${GX} = 0`)}, 즉 방정식 ${jh(eqT, '은/는')} 열린구간 ${iv('(', p, q, ')')}에서 적어도 하나의 실근을 갖는다.`];
      return M(`모든 실수 ${X}에서 연속인 함수 ${FX}에 대하여 ${nb(`${fAt(p)} = ${iq(A)}`)}, ${nb(`${fAt(q)} = ${iq(Bq)}`)}이다. 다음은 방정식 ${jh(eqT, '이/가')} 열린구간 ${iv('(', p, q, ')')}에서 적어도 하나의 실근을 가짐을 보이는 과정이다. (가), (나)에 알맞은 수는?`,
        [{ lead: '(가)', answer: gp, signed: true }, { lead: '(나)', answer: gq, signed: true }], { figure: lines(proof), shown: `(가) ${iq(gp)}, (나) ${iq(gq)}`,
          explain: `${gx(p)} = ${iq(gp)}, ${gx(q)} = ${jq(gq, '으로/로')} 부호가 다르다. 방정식을 한쪽으로 모은 ${jh(GX, '은/는')} 연속함수끼리의 곱·차라 연속이다.`,
          facts: { calc: [[gpE, 0], [gqE, 1]], derived: [2] } });
    }),

    // ①42 이분법(공학 도구): 함숫값을 표로 주고 세 번 반으로 줄인 뒤 실근이 있는 구간 고르기
    T('ivt-bisect', '이분법으로 실근이 있는 구간 좁히기', '①42', (d) => {
      const P = [nz(d, -6, 6), d.int(-4, 4), d.int(-3, 3), 1], n0 = d.int(-2, 2), f = (x) => pval(P, x);
      if (f(n0) * f(n0 + 1) >= 0 || rootsIn(P, n0 + 0.0001, n0 + 0.9999) === false) return null;
      // 구간 안의 실근이 하나뿐이게(이분법이 하나를 좇는다)
      let flips = 0; for (let i = 0; i < 400; i += 1) if (f(n0 + i / 400) * f(n0 + (i + 1) / 400) < 0) flips += 1;
      if (flips !== 1) return null;
      let lo = n0, hi = n0 + 1; const rows = [];
      for (let s = 0; s < 3; s += 1) {
        const m = (lo + hi) / 2, v = f(m);
        if (Math.abs(v) < 0.002) return null;
        rows.push([String(m), (v < 0 ? MINUS : '') + Math.abs(v).toFixed(4)]);
        if (f(lo) * v < 0) hi = m; else lo = m;
      }
      const right = iv('(', String(lo), String(hi), ')'), all = [];
      for (let i = 0; i < 8; i += 1) { const l = n0 + i / 8, r = l + 1 / 8; if (l !== lo) all.push(iv('(', String(l), String(r), ')')); }
      return pickOne(d, `방정식 ${nb(`${ptext(P)} = 0`)}의 실근이 열린구간 ${iv('(', n0, n0 + 1, ')')}에 있다. ${FX} = ${jh(ptext(P), '이라/라')} 하면 ${nb(`${fAt(n0)} = ${iq(f(n0))}`)}, ${nb(`${fAt(n0 + 1)} = ${iq(f(n0 + 1))}`)}이다. 구간의 가운데 점에서 함숫값의 부호를 보고 실근이 있는 쪽 반을 고르는 일을 세 번 하였다. 표는 차례로 고른 가운데 점과 그 점에서의 함숫값(소수 넷째 자리까지)이다. 세 번 줄인 뒤 실근이 있는 구간은?`, right, all, {
        figure: table([`가운데 점 ${ms('c')}`, `${ms('f(c)')}`], rows),
        explain: `처음 구간 ${iv('(', n0, n0 + 1, ')')}의 두 끝값은 부호가 다르다. 가운데 점의 함숫값과 부호가 다른 끝 쪽 반을 차례로 고르면 ${right}이다(이분법).`, facts: {} }, 5);
    }),

    // ①43 넓이를 삼등분하는 직선의 존재(교과서 창의·연결): f(c₁), f(c₂) 의 값
    T('ivt-area', '넓이를 삼등분하는 직선이 있음을 보이는 과정의 빈칸', '①43', (d) => {
      const S = 3 * d.int(3, 20), c1 = ms('c_1'), c2 = ms('c_2');
      return M(`좌표평면 위의 ${nb(`${Av} ${LE} ${X} ${LE} ${Bv}`)}인 부분에 넓이가 ${S}인 도형이 놓여 있다. 두 직선 ${nb(`${X} = ${Av}`)}, ${nb(`${X} = ${ms('t')}`)} (${nb(`${Av} ${LE} ${ms('t')} ${LE} ${Bv}`)}) 사이에 있는 도형의 넓이를 ${ms('f(t)')}라 하면 ${ms('f(t)')}는 닫힌구간 ${iv('[', Av, Bv, ']')}에서 연속이고 ${nb(`${ms('f(a)')} = 0`)}, ${nb(`${ms('f(b)')} = ${S}`)}이다. 사잇값 정리에 의하여 ${nb(`${V('f')}(${c1}) = □`)}, ${nb(`${V('f')}(${c2}) = □`)}인 ${c1}, ${c2} (${nb(`${c1} &lt; ${c2}`)})가 열린구간 ${iv('(', Av, Bv, ')')}에 존재하므로 두 직선 ${nb(`${X} = ${c1}`)}, ${nb(`${X} = ${c2}`)}를 따라 자르면 도형의 넓이를 삼등분할 수 있다. □ 안에 알맞은 수를 차례로 구하시오.`,
        [{ lead: `${V('f')}(${c1}) =`, answer: S / 3 }, { lead: `${V('f')}(${c2}) =`, answer: 2 * S / 3 }], { shown: `${S / 3}, ${2 * S / 3}`,
          explain: `넓이를 삼등분하려면 왼쪽부터 넓이가 ${jq(S / 3, '과/와')} ${S / 3} × 2 = ${jq(2 * S / 3, '이/가')} 되는 곳에서 자르면 된다. ${S / 3}, ${jq(2 * S / 3, '은/는')} 0과 ${S} 사이의 값이므로 사잇값 정리에 의하여 그런 ${c1}, ${c2}가 있다.`,
          facts: { calc: [[`${S}/3`, 0], [`2*${S}/3`, 1]], derived: [3, 2] } });
    })
  ];

  B.addTypes('11-2-2', 'prop', prop);
  B.addTypes('11-2-2', 'maxmin', maxmin);
  B.addTypes('11-2-2', 'ivt', ivt);
})(typeof window !== 'undefined' ? window : globalThis);
