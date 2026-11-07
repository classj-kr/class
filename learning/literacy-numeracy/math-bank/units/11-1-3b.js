// 고등학교 대수 Ⅱ-1 삼각함수 — 뒤쪽 묶음(사인함수와 코사인함수의 그래프, 삼각함수의 성질, 탄젠트함수의 그래프, 삼각함수를 포함한 방정식과 부등식).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-1-3a.js 머리에 적었다. 도구는 a 파일의 B.kit.u13 을 쓰고, 방정식·부등식의 해를 셈하는 도구는 B.kit.u13b 로 내보낸다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 방정식·부등식의 해: 해의 끝이 π/24 의 배수가 되게 수를 고르고(특수한 각), 그 격자 위에서 식의 값을 셈해 해의 집합을 짓는다(solveSet). 격자 사이에서
// 부호가 바뀌면(특수하지 않은 끝) 그 수는 버린다. 보기의 틀린 집합도 같은 도구로 다른 식(부호를 바꾼 값, 다른 함수, 반대 부등호)의 해를 셈해 짓는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, isInt, fl, nb, V, sup, rt, ex } = B.kit.mid;
  const { trig, jh, qAns, piAns, plot } = B.kit.hs;
  const K = B.kit.u13;
  const { S2, stripH, T, H, TH, X, Y, Nn, AL, BE, Av, Bv, Cv, Kv, LT, GT, PI, asQ, rad, fa, deg, num, jn, eq, sin, cos, tan, TF, FV, QN, SGN, exact, SVALS, pickH, ev, pickV, pickFixed, TRIPLES, tripleIn, qh, radFrac } = K;
  const R2 = Math.SQRT2, R3 = Math.sqrt(3);
  const fx = (n) => nb(`${V('f')}(${n})`);                                     // f(x), f(π)

  // ── 식의 글 ──
  // 계수: 1 은 적지 않고 −1 은 −만
  const co = (a) => (a === 1 ? '' : a === -1 ? MINUS : num(a));
  const plusTerm = (v) => (v === 0 ? '' : v > 0 ? ` + ${num(v)}` : ` ${MINUS} ${num(-v)}`);
  // 각 bx + p 의 글: b 는 { h 글, q 수(유리수 배) | pi: 유리수 — bπ 꼴 }, p 는 π 의 몇 배(유리수)
  const B_INT = (k) => ({ h: k === 1 ? '' : String(k), v: k, txt: (x) => (k === 1 ? x : k + x) });
  function argText(b, p) {
    const bx = b.h + X, inside = p && p.p ? `${bx} ${p.p > 0 ? '+' : MINUS} ${rad(Q(Math.abs(p.p), p.q))}` : bx;
    return p && p.p ? `(${inside})` : inside;
  }
  // b 의 모양들: 정수, 분수(x/2 → frac), π 가 붙은 것
  const BS = [
    { h: '', v: 1 }, { h: '2', v: 2 }, { h: '3', v: 3 }, { h: '4', v: 4 },
    { h: '', v: 0.5, x: () => frac(X, 2) }, { h: '', v: 1 / 3, x: () => frac(X, 3) }, { h: '', v: 2 / 3, x: () => frac(`2${X}`, 3) },
    { h: 'π', v: Math.PI, pi: Q(1) }, { h: '', v: Math.PI / 2, pi: Q(1, 2), x: () => frac(`π${X}`, 2) }, { h: '2π', v: 2 * Math.PI, pi: Q(2) }
  ];
  const bxText = (b) => (b.x ? b.x() : b.h + X);
  function argOf(b, p) {
    const bx = bxText(b);
    if (!p || p.p === 0) return bx;
    return `(${bx} ${p.p > 0 ? '+' : MINUS} ${rad(Q(Math.abs(p.p), p.q))})`;
  }
  // 주기: { h 글, v 값 }
  // b 의 유리수 부분(π 를 뺀 값)
  const bQ = (b) => (b.pi ? b.pi : Math.abs(b.v - Math.round(b.v)) < 1e-9 ? Q(Math.round(b.v)) : b.v === 0.5 ? Q(1, 2) : b.v === 2 / 3 ? Q(2, 3) : Q(1, 3));
  // 주기 { h 글, v 값, q 계수, pi π 가 붙는가 }. scale 배 한 주기도 같은 꼴로
  const perOf = (q, pi) => ({ h: pi ? rad(q) : num(q), v: pi ? fl(q) * Math.PI : fl(q), q, pi });
  function periodOf(b, kind, scale) {
    const base = qmul(Q(kind === 'tan' ? 1 : 2), scale || Q(1));                     // π 의 몇 배
    return perOf(qdiv(base, bQ(b)), !b.pi);
  }

  // ── 방정식·부등식의 해(격자 π/24) ──
  const U = Math.PI / 24, EPS = 1e-9;
  // g(x) rel 0 을 [L·U, R·U) 에서 푼다. o.openL: 왼쪽 끝을 빼고, o.closedR: 오른쪽 끝을 넣는다. 끝이 격자 밖이면 null.
  function solveSet(g, L, R, rel, o) {
    const opt = o || {};
    const val = (m) => { const v = g(m * U); return Number.isFinite(v) && Math.abs(v) < 1e7 ? v : NaN; };
    const good = (v) => (rel === '<' ? v < -EPS : rel === '<=' ? v <= EPS : rel === '>' ? v > EPS : rel === '>=' ? v >= -EPS : Math.abs(v) <= EPS);
    const inDom = (m) => (m > L || (m === L && !opt.openL)) && (m < R || (m === R && opt.closedR));
    const els = [];
    for (let m = L; m <= R; m += 1) {
      if (inDom(m)) { const v = val(m); els.push({ pt: true, m, ok: !Number.isNaN(v) && good(v) }); }
      if (m < R) {
        const smp = [0.08, 0.25, 0.4, 0.5, 0.6, 0.75, 0.92].map((t) => val(m + t));
        if (smp.some(Number.isNaN)) return null;
        const sg = smp.map((v) => (v > EPS ? 1 : v < -EPS ? -1 : 0));
        if (sg.some((s) => s === 0 || s !== sg[0])) return null;
        els.push({ pt: false, m, ok: rel !== '=' && good(smp[3]) });
      }
    }
    const dom = { L, R, openL: Boolean(opt.openL), closedR: Boolean(opt.closedR) }, tag = (res) => Object.defineProperty(res, 'dom', { value: dom });
    if (rel === '=') return tag({ pts: els.filter((e) => e.pt && e.ok).map((e) => e.m) });
    const ivs = [];
    let cur = null;
    for (const e of els) {
      if (e.ok) { if (!cur) cur = { first: e, last: e }; else cur.last = e; }
      else if (cur) { ivs.push(cur); cur = null; }
    }
    if (cur) ivs.push(cur);
    return tag({ ivs: ivs.map(({ first, last }) => (first === last && first.pt ? { single: first.m } : { a: first.m, ai: first.pt, b: last.pt ? last.m : last.m + 1, bi: last.pt })) });
  }
  // 해의 집합이 격자 점 x(π/24 의 몇 배, 반 칸도)를 품는가
  function member(res, x) {
    if (res.pts) return res.pts.some((m) => Math.abs(m - x) < 1e-9);
    return res.ivs.some((I) => (I.single != null ? Math.abs(I.single - x) < 1e-9 : (I.ai ? x >= I.a - 1e-9 : x > I.a + 1e-9) && (I.bi ? x <= I.b + 1e-9 : x < I.b - 1e-9)));
  }
  // 주어진 범위 안에서 두 해의 집합이 같은가(범위 밖의 끝을 넣고 빼는 것만 다른 보기는 같은 답이다 — 「x ≤ 2π」와 「x < 2π」)
  function sameIn(a, b, dom) {
    for (let x = dom.L; x <= dom.R + 1e-9; x += 0.5) {
      if ((x === dom.L && dom.openL) || (x === dom.R && !dom.closedR)) continue;
      if (member(a, x) !== member(b, x)) return false;
    }
    return true;
  }
  const xr = (m) => rad(Q(m, 24));
  function setText(res, v) {
    const w = v || X;
    if (res.pts) return res.pts.length ? res.pts.map((m) => eq(w, xr(m))).join(' 또는 ') : '해가 없다';
    if (!res.ivs.length) return '해가 없다';
    return res.ivs.map((I) => (I.single != null ? eq(w, xr(I.single)) : nb(`${xr(I.a)} ${I.ai ? '≤' : LT} ${w} ${I.bi ? '≤' : LT} ${xr(I.b)}`))).join(' 또는 ');
  }
  const keyOf = (res) => JSON.stringify(res);
  // 해 집합의 틀린 꼴: 끝 하나를 빼거나 넣기, 해 하나 빼기
  function slips(res) {
    const out = [];
    if (res.pts) { if (res.pts.length > 1) res.pts.forEach((_, i) => out.push({ pts: res.pts.filter((__, j) => j !== i) })); return out; }
    res.ivs.forEach((I, i) => {
      if (I.single != null) return;
      out.push({ ivs: res.ivs.map((J, j) => (j === i ? Object.assign({}, J, { ai: !J.ai }) : J)) });
      out.push({ ivs: res.ivs.map((J, j) => (j === i ? Object.assign({}, J, { bi: !J.bi }) : J)) });
      if (res.ivs.length > 1) out.push({ ivs: res.ivs.filter((_, j) => j !== i) });
    });
    return out;
  }
  // 해의 집합 고르기: right(해), alts(다른 식의 해들) → 보기 다섯
  function pickSet(d, text, right, alts, o) {
    const opt = o || {}, v = opt.v || X, rk = keyOf(right), seen = new Set([rk]), pool = [], dom = right.dom || { L: 0, R: 48, openL: false, closedR: false };
    for (const a of d.shuffle(alts.filter(Boolean).concat(slips(right)))) {
      const k = keyOf(a);
      if (seen.has(k) || setText(a, v) === '해가 없다' || sameIn(a, right, dom) || pool.some((p) => sameIn(a, p, dom))) continue;
      seen.add(k); pool.push(a);
    }
    if (pool.length < 4) return null;
    return pickH(d, text, setText(right, v), pool.slice(0, 4).map((a) => setText(a, v)), opt);
  }
  // 해의 합(격자 m 의 합 → π 의 몇 배)
  const sumOf = (res) => Q(res.pts.reduce((s, m) => s + m, 0), 24);

  // ── 특수한 값을 a·f(x) + b = 0 꼴로 적기 ──
  const LIN = [{ v: 0.5, a: '2', b: '1' }, { v: R2 / 2, a: rt(2), b: '1' }, { v: R2 / 2, a: '2', b: rt(2) }, { v: R3 / 2, a: '2', b: rt(3) }, { v: 1, a: '', b: '1' }, { v: R3, a: '', b: rt(3) }, { v: R3 / 3, a: rt(3), b: '1' }, { v: R3 / 3, a: '3', b: rt(3) }];
  // f(arg) = k 를 글로: 그대로(f(arg) = k) 또는 a·f(arg) ± b = 0
  function eqText(d, f, k, arg, rel) {
    const r = rel || '=', sym = { '=': '=', '<': LT, '<=': '≤', '>': GT, '>=': '≥' }[r];
    if (k === 0 || d.bool()) return nb(`${TF[f](arg)} ${sym} ${exact(k)}`);
    const L = d.pick(LIN.filter((l) => Math.abs(l.v - Math.abs(k)) < 1e-9));
    return nb(`${L.a}${TF[f](arg)} ${k > 0 ? MINUS : '+'} ${L.b} ${sym} 0`);
  }
  const DOM = { full: [0, 48, '0 ≤ x &lt; 2π'], half: [-12, 12, '−π/2 &lt; x &lt; π/2'] };
  const domText = (lo, hi, openL, closedR) => nb(`${xr(lo)} ${openL ? LT : '≤'} ${X} ${closedR ? '≤' : LT} ${xr(hi)}`);

  B.kit.u13b = { fx, co, plusTerm, BS, bxText, argOf, periodOf, U, solveSet, xr, setText, keyOf, slips, pickSet, sumOf, LIN, eqText, domText };

  // ── 그래프 ──
  const piT = (q) => { const qq = asQ(q), n = Math.abs(qq.p), head = (qq.p < 0 ? MINUS : '') + (n === 1 ? '' : n) + 'π'; return { v: fl(qq) * Math.PI, t: qq.q === 1 ? head : head + '/' + qq.q }; };
  // y 칸이 너무 길거나 짧지 않게 세로 배율을 맞춘다(그림 높이 약 150px)
  const ysFor = (x, y, w) => { const ux = Math.min(44, ((w || 270) - 46) / (x[1] - x[0])); return Math.max(0.25, Math.min(1.6, 150 / ((y[1] - y[0]) * ux))); };

  // ════════════════════════════════════════════════════════════════
  // 사인함수와 코사인함수의 그래프
  // ════════════════════════════════════════════════════════════════
  // y = a f(bx + p) + d 의 글과 값
  function sinusoid(d, o) {
    const opt = o || {}, f = opt.f || d.pick(['sin', 'cos']), a = opt.a != null ? opt.a : d.pick([1, 2, 3, 4, 5, -1, -2, -3, Q(1, 2), Q(-1, 2), Q(3, 2)]);
    const b = opt.b || d.pick(BS), p = opt.p != null ? opt.p : d.pick([Q(0), Q(0), Q(1, 2), Q(1, 3), Q(-1, 3), Q(1, 6), Q(-1, 4), Q(1)]), dd = opt.d != null ? opt.d : d.int(-4, 4);
    const aq = asQ(a);
    const h = `${co(aq.q === 1 ? aq.p : aq)}${aq.q === 1 ? '' : ' '}${TF[f](argOf(b, p))}${plusTerm(dd)}`;
    return { f, a: aq, b, p, d: dd, h, max: qadd(Q(Math.abs(aq.p), aq.q), Q(dd)), min: qsub(Q(dd), Q(Math.abs(aq.p), aq.q)) };
  }
  const sincos = [
    T('sc-maxmin', '사인함수·코사인함수의 최댓값과 최솟값', '②1', (d) => {
      const s = sinusoid(d, { a: d.pick([1, 2, 3, 4, 5, -1, -2, -3, -4]) });
      return M(`함수 ${eq(Y, s.h)}의 최댓값과 최솟값을 각각 구하시오.`, [{ label: '최댓값', answer: s.max.p, signed: true }, { label: '최솟값', answer: s.min.p, signed: true }], {
        explain: `${nb(`${MINUS}1 ≤ ${TF[s.f](argOf(s.b, s.p))} ≤ 1`)}이므로 ${nb(`${MINUS}${Math.abs(s.a.p)} ≤ ${co(s.a.p)}${TF[s.f](argOf(s.b, s.p))} ≤ ${Math.abs(s.a.p)}`)}이다. 따라서 최댓값은 ${num(s.max)}, 최솟값은 ${num(s.min)}이다.`,
        facts: { calc: [[`${Math.abs(s.a.p)}+(${s.d})`, 0], [`(${s.d})-${Math.abs(s.a.p)}`, 1]] } });
    }, { standard: S2 }),
    T('sc-period', '사인함수·코사인함수의 주기', '②1', (d) => {
      const s = sinusoid(d), per = periodOf(s.b, s.f), alt = (b2) => periodOf(b2, s.f);
      const wrongs = [periodOf(s.b, 'tan'), periodOf(s.b, s.f, Q(2)), perOf(qmul(Q(2), bQ(s.b)), true), perOf(Q(2), !s.b.pi), perOf(Q(1), !s.b.pi)].concat(BS.filter((b2) => b2 !== s.b && Boolean(b2.pi) === Boolean(s.b.pi)).map(alt), s.b.pi ? [] : [{ h: 'π', v: Math.PI }, { h: '2π', v: 2 * Math.PI }]);
      return pickH(d, `함수 ${eq(Y, s.h)}의 주기는?`, per, wrongs, {
        explain: `${nb(`${Y} = ${Av} ${TF[s.f](`(${Bv}${X} + ${Cv})`)} + ${V('d')}`)}의 주기는 ${frac('2π', `|${Bv}|`)}이다. 따라서 주기는 ${per.h}이다.` });
    }, { standard: S2 }),
    T('sc-period-odd', '주기가 다른 삼각함수 고르기', '②2', (d) => {
      const k = d.pick([1, 2, 3]), T0 = Q(1, k);   // 맞출 주기 π/k
      const same = [`${trig('sin', `${k * 2 === 1 ? '' : 2 * k}${X}`)} ${MINUS} ${d.int(1, 3)}`, trig('sin', `(${2 * k}${X} + ${rad(Q(1, 2))})`), `${d.int(2, 4)}${trig('cos', `${2 * k}${X}`)}`, trig('tan', `${k === 1 ? '' : k}${X}`), `|${trig('cos', `${k === 1 ? '' : k}${X}`)}|`, `|${trig('sin', `${k === 1 ? '' : k}${X}`)}|`, `${MINUS}${trig('cos', `(${2 * k}${X} ${MINUS} ${rad(Q(1, 3))})`)}`];
      const diff = [`${d.int(2, 3)}${trig('cos', `${k === 1 ? '' : k}${X}`)} + π`, trig('sin', `${k === 1 ? '' : k}${X}`), trig('tan', `${2 * k}${X}`), trig('cos', `${4 * k}${X}`)];
      const ref = `${trig('cos', `${2 * k}${X}`)} + ${d.int(1, 5)}`, odd = d.pick(diff), pool = d.shuffle(same).slice(0, 4), rows = d.shuffle(pool.concat([odd]));
      return C(`다음 함수 가운데 함수 ${jh(eq(Y, ref), '과/와')} 주기가 다른 것은?`, rows.map((h) => eq(Y, h)), rows.indexOf(odd), {
        explain: `함수 ${eq(Y, ref)}의 주기는 ${rad(T0)}이다. ${eq(Y, odd)}의 주기는 ${jh(rad(T0), '이/가')} 아니고, 나머지는 모두 주기가 ${rad(T0)}이다(절댓값을 씌운 사인·코사인함수와 탄젠트함수는 주기가 반이다).`,
        facts: { truth: rows.map((h) => h === odd), want: true } });
    }, { standard: S2 }),
    T('sc-coef-cond', '최댓값·최솟값·주기로 사인·코사인함수의 계수 구하기', '②3', (d) => {
      const f = d.pick(['sin', 'cos']), a = d.int(1, 5), b = d.int(1, 6), c = d.until(() => d.int(-4, 4), (v) => v !== 0), Mx = a + c, mn = c - a, per = Q(2, b);
      return M(`함수 ${eq(Y, `${Av} ${trig(f, Bv + X)} + ${Cv}`)}의 최댓값이 ${num(Mx)}, 최솟값이 ${num(mn)}이고 주기가 ${rad(per)}일 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 각각 구하시오. (단, ${nb(`${Av} ${GT} 0`)}, ${nb(`${Bv} ${GT} 0`)})`,
        [{ label: `${Av} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }, { label: `${Cv} =`, answer: c, signed: true }], {
          explain: `${nb(`${Av} ${GT} 0`)}이므로 ${nb(`${Av} + ${Cv} = ${num(Mx)}`)}, ${nb(`${MINUS}${Av} + ${Cv} = ${num(mn)}`)}에서 ${eq(Av, a)}, ${eq(Cv, num(c))}이다. 주기가 ${nb(`${frac('2π', Bv)} = ${rad(per)}`)}이므로 ${eq(Bv, b)}이다.`,
          facts: { calc: [[`(${Mx}-(${mn}))/2`, 0], [`2/(${per.p}/${per.q})`, 1], [`(${Mx}+(${mn}))/2`, 2]] } });
    }, { standard: S2 }),
    T('sc-period-value', '주기로 계수를 정해 함숫값 구하기', '심3', (d) => {
      const f = d.pick(['sin', 'cos']), kk = d.pick([2, 3, 4, 6, 8]), a = Q(2, kk), p = d.pick([Q(1, 6), Q(1, 3), Q(1, 4), Q(-1, 6), Q(1, 2)]), x0 = d.pick([Q(1), Q(1, 2), Q(2), Q(1, 3), Q(3, 2)]);
      const arg = qadd(qmul(a, x0), p), v = FV[f](Math.PI * fl(arg));
      if (exact(v) == null) return null;
      const argH = `(${Av}${X} ${p.p > 0 ? '+' : MINUS} ${rad(Q(Math.abs(p.p), p.q))})`;
      return pickV(d, `양수 ${Av}에 대하여 함수 ${eq(fx(X), TF[f](argH))}의 주기가 ${rad(Q(kk))}일 때, ${fx(rad(x0))}의 값은?`, v, [-v, FV[f === 'sin' ? 'cos' : 'sin'](Math.PI * fl(arg)), FV[f](Math.PI * fl(qadd(qmul(Q(1, kk), x0), p))), FV[f](Math.PI * fl(qadd(qmul(Q(kk, 2), x0), p)))].concat(d.shuffle(SVALS)), {
        explain: `주기가 ${nb(`${frac('2π', Av)} = ${rad(Q(kk))}`)}이므로 ${eq(Av, num(a))}이다. ${eq(fx(rad(x0)), TF[f](`(${rad(qmul(a, x0))} ${p.p > 0 ? '+' : MINUS} ${rad(Q(Math.abs(p.p), p.q))})`))} = ${TF[f](rad(arg))} = ${exact(v)}이다.` });
    }, { standard: S2 }),
    T('sc-satellite', '사인함수로 나타낸 실생활 — 인공위성의 위치', '②3', (d) => {
      const A = 200 * d.int(2, 20), Tm = d.pick([60, 90, 120, 180]), j = d.pick([1, 5, 7, 11, 3, 9]), t = Tm * j / 12;
      if (!Number.isInteger(t)) return null;
      const val = Math.round(A * Math.sin(Math.PI * j / 6));
      return N(`어느 인공위성이 적도를 지난 지 ${X}분 후의 위치를 ${Y}라 할 때, ${eq(Y, `${Av} ${trig('sin', Bv + X)}`)}가 성립한다고 한다. ${Y}의 최댓값이 ${A}, 최솟값이 ${MINUS}${A}이고 주기가 ${Tm}일 때, 적도를 지난 지 ${t}분 후 인공위성의 위치는? (단, ${nb(`${Av} ${GT} 0`)}, ${nb(`${Bv} ${GT} 0`)}이고, 적도의 위치는 0이다.)`, val, { signed: true,
        explain: `${eq(Av, A)}이고 ${nb(`${frac('2π', Bv)} = ${Tm}`)}에서 ${eq(Bv, frac('π', Tm / 2))}이다. ${eq(X, t)}이면 ${nb(`${Y} = ${A} ${trig('sin', rad(Q(j, 6)))} = ${num(val)}`)}이다.`,
        facts: { value: `${A}*${val < 0 ? '(-1)' : '1'}*${Math.abs(val) === A ? '1' : '1/2'}` } });
    }, { standard: S2 }),
    T('sc-coef-value', '주기·최댓값과 함숫값 하나로 계수 구하기', '②4', (d, n) => {
      const b = d.int(1, 4), p = d.pick([Q(1, 6), Q(5, 6), Q(7, 6), Q(11, 6)]), s = Math.round(2 * Math.sin(Math.PI * fl(p))) / 2, a = (n === 0 ? 1 : -1) * 2 * d.int(1, 3), c = d.int(-5, 5);
      const Mx = Math.abs(a) + c, j = d.int(1, 2), per = Q(2, b), x0 = qmul(per, Q(j)), v = a * s + c;
      return M(`함수 ${eq(fx(X), `${Av} ${trig('sin', `(${Bv}${X} + ${rad(p)})`)} + ${Cv}`)}의 주기는 ${rad(per)}이고 최댓값은 ${num(Mx)}이다. ${eq(fx(rad(x0)), num(v))}일 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 각각 구하시오. (단, ${nb(`${Av} ${n === 0 ? GT : LT} 0`)}, ${nb(`${Bv} ${GT} 0`)})`,
        [{ label: `${Av} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }, { label: `${Cv} =`, answer: c, signed: true }], {
          explain: `주기가 ${nb(`${frac('2π', Bv)} = ${rad(per)}`)}이므로 ${eq(Bv, b)}이다. ${nb(`${Av} ${n === 0 ? GT : LT} 0`)}이므로 최댓값은 ${nb(`${n === 0 ? '' : MINUS}${Av} + ${Cv} = ${num(Mx)}`)}이다. ${nb(`${fx(rad(x0))} = ${Av} ${trig('sin', rad(p))} + ${Cv} = ${s > 0 ? frac(Av, 2) : MINUS + frac(Av, 2)} + ${Cv} = ${num(v)}`)}이다. 두 식에서 ${eq(Av, num(a))}, ${eq(Cv, num(c))}이다.`,
          facts: { calc: [[n === 0 ? `(${Mx}-(${v}))/(1-(${s}))` : `((${v})-(${Mx}))/(1+(${s}))`, 0], [`2/(${per.p}/${per.q})`, 1], [n === 0 ? `(${Mx})-(${Mx}-(${v}))/(1-(${s}))` : `(${Mx})+((${v})-(${Mx}))/(1+(${s}))`, 2]] } });
    }, { count: 2, standard: S2 }),
    T('sc-coef-then-value', '최댓값과 함숫값으로 식을 정해 다른 함숫값 구하기', '②4', (d) => {
      const p = d.pick([Q(1, 3), Q(1, 6), Q(2, 3)]), x0 = qsub(Q(1, 2), p), use = x0.p > 0 ? x0 : qsub(Q(3, 2), p), a = 2 * d.int(0, 3) + 1, k = d.int(-3, 4), Mx = a + k;
      const targets = [Q(2, 3), Q(4, 3), Q(1, 3), Q(5, 3)].map((t) => qsub(t, p)).filter((x) => x.p > 0 && fl(x) < 2), x1 = d.pick(targets), cv = Math.round(2 * Math.cos(Math.PI * fl(qadd(x1, p)))) / 2, val = Q(a * cv * 2 + 2 * k, 2);
      return qAns(`함수 ${eq(fx(X), `${Av} ${trig('cos', `(${X} + ${rad(p)})`)} + ${Kv}`)}의 최댓값이 ${num(Mx)}이고 ${eq(fx(rad(use)), num(k))}일 때, ${fx(rad(x1))}의 값은? (단, ${nb(`${Av} ${GT} 0`)}이고, ${jh(Kv, '은/는')} 상수이다.)`, val, { signed: true,
        explain: `${eq(fx(rad(use)), `${Av} ${trig('cos', rad(qadd(use, p)))} + ${Kv} = ${Kv}`)}이므로 ${eq(Kv, num(k))}이고, 최댓값 ${nb(`${Av} + ${Kv} = ${num(Mx)}`)}에서 ${eq(Av, a)}이다. ${nb(`${fx(rad(x1))} = ${co(a)}${trig('cos', rad(qadd(x1, p)))}${plusTerm(k)} = ${num(val)}`)}이다.`,
        facts: { value: `(${Mx}-(${k}))*(${cv})+(${k})` } });
    }, { standard: S2 }),
    T('sc-graph-coef', '그래프를 보고 사인·코사인함수의 계수 구하기', '②5', (d, n) => {
      const f = n === 0 ? 'cos' : 'sin', a = d.int(1, 3), b = d.int(1, 3), c = n === 0 ? d.until(() => d.int(-2, 3), (v) => v !== 0) : d.int(-2, 2), Mx = a + c, mn = c - a, Tp = 2 * Math.PI / b;
      const xlo = -0.18 * Tp, xhi = 1.18 * Tp, ylo = Math.min(0, mn) - 0.7, yhi = Math.max(0, Mx) + 0.7;
      const xt = n === 0 ? [piT(Q(1, b)), piT(Q(2, b))] : [piT(Q(1, 2 * b)), piT(Q(3, 2 * b)), piT(Q(2, b))];
      const yt = [Mx, mn].filter((v) => v !== 0);
      const figure = plot({ x: [xlo, xhi], y: [ylo, yhi], ys: ysFor([xlo, xhi], [ylo, yhi]), xt, yt, curves: [{ f: (x) => a * Math.cos(b * x - (n === 0 ? 0 : Math.PI / 2)) + c }],   // 곡선이 하나라 이름을 붙이지 않는다(긴 이름이 축·눈금에 걸린다)
        lines: [{ y: Mx, dash: true, said: '최댓값을 나타내는 점선' }, { y: mn, dash: true, said: '최솟값을 나타내는 점선' }].filter((l) => l.y !== 0),
        say: n === 0 ? `곡선은 x = 0에서 가장 높고, x = ${xt[0].t}에서 가장 낮으며, x = ${xt[1].t}에서 다시 가장 높다.` : `곡선은 x = ${xt[0].t}에서 가장 높고, x = ${xt[1].t}에서 가장 낮으며, x = ${xt[2].t}에서 한 번의 모양이 끝난다(원점 쪽에서 시작해 올라간다).` });
      return M(`함수 ${eq(Y, `${Av} ${trig(f, Bv + X)} + ${Cv}`)}의 그래프가 그림과 같을 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 각각 구하시오. (단, ${nb(`${Av} ${GT} 0`)}, ${nb(`${Bv} ${GT} 0`)})`,
        [{ label: `${Av} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }, { label: `${Cv} =`, answer: c, signed: true }], { figure,
          explain: `그래프에서 최댓값은 ${num(Mx)}, 최솟값은 ${num(mn)}이므로 ${nb(`${Av} + ${Cv} = ${num(Mx)}`)}, ${nb(`${MINUS}${Av} + ${Cv} = ${num(mn)}`)}에서 ${eq(Av, a)}, ${eq(Cv, num(c))}이다. 주기가 ${rad(Q(2, b))}이므로 ${nb(`${frac('2π', Bv)} = ${rad(Q(2, b))}`)}, ${eq(Bv, b)}이다.`,
          facts: { calc: [[`(${Mx}-(${mn}))/2`, 0], [`${b}`, 1], [`(${Mx}+(${mn}))/2`, 2]] } });
    }, { count: 2, standard: S2 }),
    T('sc-graph-shift', '그래프를 보고 평행이동한 양 구하기', '②5', (d) => {
      const a = d.int(2, 4), cq = d.pick([Q(1, 6), Q(1, 4), Q(1, 3), Q(1, 2), Q(2, 3), Q(3, 4), Q(5, 6)]), c = Math.PI * fl(cq), z = qadd(cq, Q(1, 2));
      const figure = plot({ x: [-0.4, 2 * Math.PI + 0.3], y: [-a - 0.7, a + 0.7], ys: ysFor([-0.4, 2 * Math.PI + 0.3], [-a - 0.7, a + 0.7]), xt: [piT(z)], yt: [a, -a],
        curves: [{ f: (x) => a * Math.cos(x - c), from: 0 }],   // 곡선이 하나라 이름을 붙이지 않는다. 만나는 자리는 눈금으로만 보인다(점을 찍으면 눈금 글이 곡선 위로 밀린다)
        say: `곡선이 x축과 만나는 점 가운데 x = ${piT(z).t}에서 곡선은 내려가며 x축을 지난다.` });
      return piAns(`함수 ${eq(Y, `${a} ${trig('cos', `(${X} ${MINUS} ${Cv})`)}`)}의 그래프가 그림과 같을 때, ${eq(Cv, '□π')}이다. □ 안에 알맞은 수는? (단, ${nb(`0 ${LT} ${Cv} ${LT} π`)})`, cq.p, cq.q, { signed: false, figure,
        explain: `${nb(`${Y} = ${a} ${trig('cos', `(${X} ${MINUS} ${Cv})`)}`)}는 ${eq(X, Cv)}에서 최대이고, 그 뒤 ${nb(`${X} = ${Cv} + ${rad(Q(1, 2))}`)}에서 내려가며 ${X}축을 지난다. ${nb(`${Cv} + ${rad(Q(1, 2))} = ${rad(z)}`)}이므로 ${eq(Cv, rad(cq))}이다.`,
        facts: { value: `${z.p}/${z.q}-1/2` } });
    }, { standard: S2 }),
    T('sc-rect', '사인함수의 그래프에 내접한 직사각형의 넓이', '②6', (d) => {
      const L = d.pick([2, 3, 4, 6]), A = d.pick([1, 2, 3]), t = d.pick([Q(1, 6), Q(1, 4), Q(1, 3)]), w = qmul(Q(L), qsub(Q(1), qmul(Q(2), t))), h = Math.sin(Math.PI * fl(t));
      const m = t.q === 6 ? 1 : t.q === 4 ? 2 : 3, coef = qmul(qmul(w, Q(A)), Q(1, 2));   // 넓이 = A·w·h, h = 1/2, √2/2, √3/2
      const area = (q, mm) => (mm === 1 ? { h: num(q), v: fl(q) } : radFrac(1, q.p, mm, q.q));
      const right = area(coef, m), wrongs = [1, 2, 3].filter((mm) => mm !== m).map((mm) => area(coef, mm)).concat([area(qmul(w, Q(A)), 1), area(qmul(qmul(w, Q(A)), Q(1, 2)), 1), area(qmul(w, Q(A)), m), area(qmul(Q(L * A), Q(1, 2)), m)]);
      const x1 = fl(qmul(Q(L), t)), x2 = L - x1, yv = A * h;
      const figure = plot({ x: [-0.3, L + 0.5], y: [-0.4, A + 0.5], ys: ysFor([-0.3, L + 0.5], [-0.4, A + 0.5]), xt: [L], yt: [A], curves: [{ f: (x) => A * Math.sin(Math.PI * x / L), from: 0, to: L, name: 'y=f(x)', at: L * 0.92, side: 'r' }],
        segs: [{ p: [x1, 0], q: [x1, yv] }, { p: [x1, yv], q: [x2, yv] }, { p: [x2, yv], q: [x2, 0] }],
        dots: [{ x: x1, y: yv, name: 'A', said: '곡선 위의 점' }, { x: x1, y: 0, name: 'B', side: 'd', said: 'x축 위의 점' }, { x: x2, y: 0, name: 'C', side: 'd', said: 'x축 위의 점' }, { x: x2, y: yv, name: 'D', said: '곡선 위의 점' }],
        say: `직사각형 ABCD의 두 꼭짓점 B, C는 x축 위에, A, D는 곡선 위에 있다.` });
      return pickH(d, `그림과 같이 함수 ${eq(fx(X), `${A === 1 ? '' : A}${trig('sin', `${frac('π', L)}${X}`)}`)} ${nb(`(0 ≤ ${X} ≤ ${L})`)}의 그래프와 ${X}축으로 둘러싸인 도형에 직사각형 ABCD가 내접한다. ${nb(`BC = ${num(w)}`)}일 때, 직사각형 ABCD의 넓이는?`, right, wrongs, { figure,
        explain: `그래프는 직선 ${eq(X, num(Q(L, 2)))}에 대하여 대칭이므로 점 B의 ${X}좌표는 ${nb(`${num(Q(L, 2))} ${MINUS} ${num(qmul(w, Q(1, 2)))} = ${num(qmul(Q(L), t))}`)}이다. ${nb(`AB = ${fx(num(qmul(Q(L), t)))} = ${A === 1 ? '' : A}${trig('sin', rad(t))} = ${exact(yv) || radFrac(1, A, m === 1 ? 1 : m === 2 ? 2 : 3, 2).h}`)}이므로 넓이는 ${right.h}이다.` });
    }, { standard: S2 }),
    T('sc-chord-coef', '그래프와 직선의 교점 사이의 거리로 계수 구하기', '②6 심5', (d, n) => {
      if (n === 0) {
        const w = d.pick([Q(1), Q(1, 2), Q(2), Q(3, 2)]), hq = d.pick([[0.5, Q(1, 3)], [R2 / 2, Q(1, 4)], [R3 / 2, Q(1, 6)]]), [hv, ang] = hq, kq = qdiv(qmul(Q(2), ang), w);
        if (fl(kq) >= 1) return null;
        const k = Math.PI * fl(kq), half = fl(w) / 2, area = exact(hv * fl(w)) || (hv === R2 / 2 ? radFrac(1, w.p, 2, 2 * w.q).h : radFrac(1, w.p, 3, 2 * w.q).h);
        const lim = Math.PI / (2 * k);
        const figure = plot({ x: [-lim - 0.3, lim + 0.3], y: [-0.3, 1.4], ys: ysFor([-lim - 0.3, lim + 0.3], [-0.3, 1.4]), yt: [1], curves: [{ f: (x) => Math.cos(k * x), from: -lim, to: lim, name: 'y=cos kx', at: lim * 0.7 }],
          segs: [{ p: [-half, hv], q: [half, hv] }, { p: [-half, 0], q: [-half, hv], dash: true }, { p: [half, 0], q: [half, hv], dash: true }],
          dots: [{ x: -half, y: hv, name: 'A', side: 'ul', said: '곡선 위의 점' }, { x: half, y: hv, name: 'B', side: 'ur', said: '곡선 위의 점' }, { x: -half, y: 0, name: 'C', side: 'd', said: 'x축 위의 점' }, { x: half, y: 0, name: 'D', side: 'd', said: 'x축 위의 점' }],
          say: '곡선과 x축에 평행한 직선이 만나는 두 점 A, B와 x축에 내린 수선의 발 C, D.' });
        const wrongs = [qmul(kq, Q(2)), qmul(kq, Q(1, 2)), qdiv(ang, w), qdiv(qmul(Q(2), Q(1, 4)), w), qdiv(qmul(Q(2), Q(1, 6)), w), qdiv(qmul(Q(2), Q(1, 3)), w)].filter((q) => q.p > 0).map((q) => ({ h: rad(q), v: fl(q) }));
        return pickH(d, `그림과 같이 함수 ${nb(`${eq(Y, trig('cos', Kv + X))} (${MINUS}${frac('π', `2${Kv}`)} ≤ ${X} ≤ ${frac('π', `2${Kv}`)})`)}의 그래프와 ${X}축에 평행한 직선이 만나는 두 점을 A, B라 하고, 두 점 A, B에서 ${X}축에 내린 수선의 발을 각각 C, D라 하자. ${nb(`CD = ${num(w)}`)}이고 사각형 ACDB의 넓이가 ${area}일 때, 상수 ${Kv}의 값은? (단, ${nb(`0 ${LT} ${Kv} ${LT} π`)})`, { h: rad(kq), v: fl(kq) }, wrongs, { figure,
          explain: `그래프는 ${Y}축에 대하여 대칭이므로 점 B의 ${X}좌표는 ${num(qmul(w, Q(1, 2)))}이고 ${nb(`BD = ${trig('cos', `${co(qmul(w, Q(1, 2)).q === 1 ? qmul(w, Q(1, 2)).p : qmul(w, Q(1, 2)))}${Kv}`)}`)}이다. 넓이에서 ${nb(`BD = ${exact(hv)}`)}이므로 ${nb(`${Kv} × ${num(qmul(w, Q(1, 2)))} = ${rad(ang)}`)}, ${eq(Kv, rad(kq))}이다.` });
      }
      const A = d.int(2, 4), [cv, gap] = d.pick([[0.5, Q(4, 3)], [-0.5, Q(2, 3)], [0, Q(1)]]), hv = A * cv, Lq = d.pick([Q(1), Q(2), Q(4, 3), Q(8, 3), Q(2, 3), Q(4), Q(3)]), aq = qdiv(gap, Lq);
      const a = Math.PI * fl(aq), x1 = (Math.PI * (cv === 0.5 ? 1 / 3 : cv === -0.5 ? 2 / 3 : 0.5)) / a, x2 = 2 * Math.PI / a - x1;
      const ht = (hv < 0 ? '−' : '') + (Number.isInteger(hv) ? Math.abs(hv) : Math.abs(2 * hv) + '/2');   // 그림의 눈금 글(3/2 는 분수로)
      const figure = plot({ x: [-0.4, 2 * Math.PI / a + 0.4], y: [-A - 0.6, A + 0.6], ys: ysFor([-0.4, 2 * Math.PI / a + 0.4], [-A - 0.6, A + 0.6]), yt: [A, -A].concat(hv === 0 ? [] : [{ v: hv, t: ht }]), curves: [{ f: (x) => A * Math.cos(a * x), from: 0, to: 2 * Math.PI / a }],   // 이름을 오른쪽 끝에 달면 그림이 휴대폰 칸보다 넓어진다(곡선이 하나라 이름 없이)
        lines: hv === 0 ? [] : [{ y: hv, said: `직선 y = ${ht}` }], dots: [{ x: x1, y: hv, name: 'A', said: hv === 0 ? '곡선과 x축의 교점' : '곡선과 직선의 교점' }, { x: x2, y: hv, name: 'B', said: hv === 0 ? '곡선과 x축의 교점' : '곡선과 직선의 교점' }], say: `곡선은 x = 0부터 한 주기만큼 그렸다.` });
      const wrongs = [qmul(aq, Q(2)), qmul(aq, Q(1, 2)), qdiv(Q(4, 3), Lq), qdiv(Q(2, 3), Lq), qdiv(Q(1), Lq), qdiv(Q(2), Lq), qdiv(Q(1, 3), Lq)].filter((q) => q.p > 0).map((q) => ({ h: rad(q), v: fl(q) }));
      return pickH(d, `그림과 같이 양수 ${Av}에 대하여 곡선 ${nb(`${eq(Y, `${A}${trig('cos', Av + X)}`)} ${nb(`(0 ≤ ${X} ≤ ${frac('2π', Av)})`)}`)}와 ${hv === 0 ? `${X}축이` : `직선 ${jh(eq(Y, num(hv)), '이/가')}`} 만나는 두 점을 각각 A, B라 하자. ${nb(`AB = ${num(Lq)}`)}일 때, ${Av}의 값은?`, { h: rad(aq), v: fl(aq) }, wrongs, { figure,
        explain: `${nb(`${A}${trig('cos', Av + X)} = ${num(hv)}`)}에서 ${eq(trig('cos', Av + X), exact(cv))}이고 ${nb(`0 ≤ ${Av}${X} ≤ 2π`)}이므로 두 점의 ${Av}${X}의 값의 차는 ${rad(gap)}이다. ${nb(`${Av} × ${num(Lq)} = ${rad(gap)}`)}에서 ${eq(Av, rad(aq))}이다.` });
    }, { count: 2, standard: S2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 삼각함수의 성질
  // ════════════════════════════════════════════════════════════════
  // θ 를 옮긴 꼴과 그 값([sin 의 계수, cos 의 계수]) — sin(π/2 + θ) = cos θ …
  const P2 = rad(Q(1, 2));
  const SHIFT = [
    [() => sin(`(${P2} + ${TH})`), [0, 1]], [() => sin(`(${P2} ${MINUS} ${TH})`), [0, 1]], [() => cos(`(${P2} + ${TH})`), [-1, 0]], [() => cos(`(${P2} ${MINUS} ${TH})`), [1, 0]],
    [() => sin(`(π + ${TH})`), [-1, 0]], [() => sin(`(π ${MINUS} ${TH})`), [1, 0]], [() => cos(`(π + ${TH})`), [0, -1]], [() => cos(`(π ${MINUS} ${TH})`), [0, -1]],
    [() => sin(`(${TH} ${MINUS} π)`), [-1, 0]], [() => cos(`(${TH} ${MINUS} π)`), [0, -1]], [() => sin(`(${MINUS}${TH})`), [-1, 0]], [() => cos(`(${MINUS}${TH})`), [0, 1]],
    [() => sin(`(2π + ${TH})`), [1, 0]], [() => cos(`(2π ${MINUS} ${TH})`), [0, 1]]
  ];
  const lc2 = (v) => { let out = ''; [[v[0], sin(TH)], [v[1], cos(TH)]].forEach(([c, h]) => { if (!c) return; const m = Math.abs(c) === 1 ? '' : Math.abs(c); out += (out ? (c > 0 ? ' + ' : ` ${MINUS} `) : c < 0 ? MINUS : '') + m + h; }); return out || '0'; };
  const prop = [
    T('prop-value', '삼각함수의 성질로 옮긴 각의 삼각함수의 값', '②8', (d, n) => {
      const k = d.int(1, 4), { x, y, r } = tripleIn(d, k), s = Q(y, r), c = Q(x, r);
      if (n === 0) {
        const pick = d.pick(SHIFT.concat([[() => tan(`(π + ${TH})`), 't'], [() => tan(`(π ${MINUS} ${TH})`), '-t']]));
        const val = pick[1] === 't' ? Q(y, x) : pick[1] === '-t' ? Q(-y, x) : qadd(qmul(Q(pick[1][0]), s), qmul(Q(pick[1][1]), c));
        return qAns(`${eq(sin(TH), qh(s))}, ${eq(cos(TH), qh(c))}일 때, ${pick[0]()}의 값은?`, val, { signed: true,
          explain: `${eq(pick[0](), pick[1] === 't' ? tan(TH) : pick[1] === '-t' ? `${MINUS}${tan(TH)}` : lc2(pick[1]))}이므로 값은 ${qh(val)}이다.`,
          facts: { value: pick[1] === 't' ? `${jn(y)}/${jn(x)}` : pick[1] === '-t' ? `(-1)*${jn(y)}/${jn(x)}` : `${pick[1][0]}*${jn(y)}/${r}+${pick[1][1]}*${jn(x)}/${r}` } });
      }
      if (n === 1) {
        const a = d.int(2, 9), b = d.until(() => d.int(2, 12), (v) => v !== a && ((v - a) * y) % r !== 0), val = Q((b - a) * y, r);
        return qAns(`${eq(sin(TH), qh(s))}일 때, ${nb(`${a}${sin(`(π + ${TH})`)} + ${b}${cos(`(${P2} ${MINUS} ${TH})`)}`)}의 값은?`, val, { signed: true,
          explain: `${nb(`${sin(`(π + ${TH})`)} = ${MINUS}${sin(TH)}`)}, ${nb(`${cos(`(${P2} ${MINUS} ${TH})`)} = ${sin(TH)}`)}이므로 주어진 식은 ${nb(`${MINUS}${a}${sin(TH)} + ${b}${sin(TH)} = ${b - a === 1 ? '' : b - a === -1 ? MINUS : num(b - a)}${sin(TH)} = ${qh(val)}`)}이다.`,
          facts: { value: `(${b}-${a})*${jn(y)}/${r}` } });
      }
      const sgSC = d.pick([1, -1]), kk = [1, 2, 3, 4].find((q) => SGN.cos[q] === Math.sign(x) && SGN.sin[q] * SGN.cos[q] === sgSC), sv = Q(SGN.sin[kk] * Math.abs(y), r);
      return qAns(`${eq(sin(`(${P2} + ${TH})`), qh(c))}이고 ${nb(`${sin(TH)}${cos(TH)} ${sgSC > 0 ? GT : LT} 0`)}일 때, ${sin(TH)}의 값은?`, sv, { signed: true,
        explain: `${nb(`${sin(`(${P2} + ${TH})`)} = ${cos(TH)}`)}이므로 ${eq(cos(TH), qh(c))}이다. ${nb(`${trig('sin', TH, 2)} = 1 ${MINUS} ${trig('cos', TH, 2)} = ${num(Q(y * y, r * r))}`)}이고, ${nb(`${sin(TH)}${cos(TH)} ${sgSC > 0 ? GT : LT} 0`)}에서 ${sin(TH)}의 부호는 ${SGN.sin[kk] > 0 ? '+' : MINUS}이므로 ${eq(sin(TH), qh(sv))}이다.`,
        facts: { value: `${SGN.sin[kk] < 0 ? '(-1)*' : ''}${Math.abs(y)}/${r}` } });
    }, { count: 3, standard: S2 }),
    T('prop-simplify', '삼각함수의 성질로 식 간단히 하기', '②9', (d, n) => {
      if (n === 0) {
        const picks = d.shuffle(SHIFT).slice(0, d.int(3, 4)), sg = picks.map((_, i) => (i === 0 ? 1 : d.pick([1, -1]))), v = [0, 0];
        picks.forEach((p, i) => { v[0] += sg[i] * p[1][0]; v[1] += sg[i] * p[1][1]; });
        const h = picks.map((p, i) => (i === 0 ? '' : sg[i] > 0 ? ' + ' : ` ${MINUS} `) + p[0]()).join('');
        const right = lc2(v), wrongs = [];
        for (let t = 0; t < 40; t += 1) { const w = [v[0] + d.pick([0, 1, -1, 2, -2]), v[1] + d.pick([0, 1, -1, 2, -2])]; if (w.join() !== v.join()) wrongs.push(lc2(w)); }
        return pickH(d, '다음 식을 간단히 하면?', right, wrongs, { figure: ex(h),
          explain: `${picks.map((p) => eq(p[0](), lc2(p[1]))).join(', ')}이므로 정리하면 ${right}이다.` });
      }
      // 곱의 합: A·B ± C·D, 각 인수는 ±sinθ 또는 ±cosθ
      const one = SHIFT.filter((p) => p[1][0] === 0 || p[1][1] === 0), prod = () => { const [p, q] = [d.pick(one), d.pick(one)]; const a = p[1][0] || p[1][1], b = q[1][0] || q[1][1], fa2 = p[1][0] ? 's' : 'c', fb2 = q[1][0] ? 's' : 'c'; return { h: p[0]() + q[0](), k: a * b, key: [fa2, fb2].sort().join('') }; };
      const P = prod(), Qd = prod(), op = d.pick([1, -1]), vec = { ss: 0, cc: 0, cs: 0 };
      vec[P.key] += P.k; vec[Qd.key] += op * Qd.k;
      const show = (w) => { if (w.ss === w.cc && w.cs === 0) return num(w.ss); let out = ''; [[w.ss, trig('sin', TH, 2)], [w.cc, trig('cos', TH, 2)], [w.cs, `${sin(TH)}${cos(TH)}`]].forEach(([c0, h]) => { if (!c0) return; const m = Math.abs(c0) === 1 ? '' : Math.abs(c0); out += (out ? (c0 > 0 ? ' + ' : ` ${MINUS} `) : c0 < 0 ? MINUS : '') + m + h; }); return out || '0'; };
      if (vec.ss === 0 && vec.cc === 0 && vec.cs === 0) return null;
      const right = show(vec), wrongs = [];
      for (let t = 0; t < 40; t += 1) { const w = { ss: vec.ss + d.pick([0, 0, 1, -1, 2, -2]), cc: vec.cc + d.pick([0, 0, 1, -1, 2, -2]), cs: vec.cs + d.pick([0, 0, 0, 1, -1]) }; if (JSON.stringify(w) !== JSON.stringify(vec)) wrongs.push(show(w)); }
      return pickH(d, '다음 식을 간단히 하면?', right, wrongs, { figure: ex(`${P.h} ${op > 0 ? '+' : MINUS} ${Qd.h}`),
        explain: `성질로 바꾸어 곱하면 ${right === '1' || right === MINUS + '1' ? `${trig('sin', TH, 2)} + ${trig('cos', TH, 2)} = 1을 써서 ` : ''}정리한 값은 ${right}이다.` });
    }, { count: 2, standard: S2 }),
    T('prop-cancel-sum', '짝을 맞추면 지워지는 삼각함수 값들의 합', '②10', (d, n) => {
      const a1 = d.until(() => d.int(11, 79), (v) => v % 15 !== 0 && v % 10 !== 0), a2 = d.until(() => d.int(11, 79), (v) => v % 15 !== 0 && v !== a1);
      const S = [];
      if (n === 0) {
        // 작은 각: sin a + sin(180 + a) 꼴의 짝 둘과 특수한 각 하나
        const F_ = (f) => `<span class="mb-fn">${f}</span>`;
        const pairs = [(a) => [[`sin ${a}°`, 0], [`sin ${180 + a}°`, 0], `${F_('sin')} ${180 + a}° = ${F_('sin')} (180° + ${a}°) = ${MINUS}${F_('sin')} ${a}°`],
          (a) => [[`cos ${a}°`, 0], [`cos ${180 - a}°`, 0], `${F_('cos')} ${180 - a}° = ${F_('cos')} (180° ${MINUS} ${a}°) = ${MINUS}${F_('cos')} ${a}°`],
          (a) => [[`sin ${a}°`, 0], [`sin ${360 - a}°`, 0], `${F_('sin')} ${360 - a}° = ${F_('sin')} (${MINUS}${a}°) = ${MINUS}${F_('sin')} ${a}°`],
          (a) => [[`cos ${a}°`, 0], [`cos ${180 + a}°`, 0], `${F_('cos')} ${180 + a}° = ${F_('cos')} (180° + ${a}°) = ${MINUS}${F_('cos')} ${a}°`]];
        const P1 = d.pick(pairs)(a1), P2_ = d.pick(pairs)(a2);
        S.push(P1[0], P1[1], P2_[0], P2_[1]);
        const sp = d.pick([['sin', 150], ['sin', 210], ['cos', 120], ['cos', 300], ['sin', 330], ['cos', 240], ['sin', 135], ['cos', 315], ['sin', 120], ['cos', 210]]);
        const v = FV[sp[0]](sp[1] * Math.PI / 180);
        S.push([`${sp[0]} ${sp[1]}°`, v]);
        const order = d.shuffle(S);
        const h = order.map((t, i) => (i === 0 ? '' : ' + ') + t[0].replace(/^(sin|cos) /, (m0, f) => `${F_(f)} `)).join('');
        return pickV(d, '다음 식의 값은?', v, [-v, 0, 2 * v, v + 1].concat(d.shuffle(SVALS)), { figure: ex(h),
          explain: `${nb(P1[2])}, ${nb(P2_[2])}이므로 짝을 이룬 두 항씩 지워진다. 남는 것은 ${nb(`${F_(sp[0])} ${sp[1]}° = ${exact(v)}`)}이다.` });
      }
      // 큰 각: sin(360k + a) + sin(360m − a) 처럼 지워지는 짝 하나와 같은 값이 되는 특수한 각 둘
      const k1 = d.int(1, 2), base = d.pick([30, 45, 60]), f2 = d.pick(['sin', 'cos']);
      const big1 = 360 * d.int(1, 2) - base, big2 = 360 * d.int(2, 3) - base;
      if (big1 === big2) return null;
      const v1 = FV[f2](big1 * Math.PI / 180), v2 = FV[f2](big2 * Math.PI / 180), total = v1 + v2;
      const terms = [`sin ${360 * k1 + a1}°`, `sin ${360 * (k1 + 1) - a1}°`, `${f2} ${big1}°`, `${f2} ${big2}°`];
      if (exact(total) == null) return null;
      const h = terms.map((t, i) => (i === 0 ? '' : ' + ') + t.replace(/^(sin|cos) /, (m0, f) => `<span class="mb-fn">${f}</span> `)).join('');
      return pickV(d, '다음 식의 값은?', total, [-total, total / 2, 0, -total / 2, 1, -1].concat(d.shuffle(SVALS)), { figure: ex(h),
        explain: `${nb(`sin ${360 * k1 + a1}° = sin ${a1}°`)}, ${nb(`sin ${360 * (k1 + 1) - a1}° = ${MINUS}sin ${a1}°`)}이므로 두 항은 지워진다. ${nb(`${f2} ${big1}° = ${f2} (${MINUS}${base}°) = ${exact(v1)}`)}, ${nb(`${f2} ${big2}° = ${exact(v2)}`)}이므로 값은 ${exact(total)}이다.` });
    }, { count: 2, standard: S2 }),
    T('prop-table', '삼각함수표의 값으로 일반각의 삼각함수의 값 구하기', '②12', (d) => {
      const a = d.until(() => d.int(11, 79), (v) => v % 15 !== 0), b2 = d.until(() => d.int(11, 79), (v) => v % 15 !== 0 && v !== a && v !== 90 - a), r4 = (v) => Math.round(v * 10000) / 10000;
      const tab = [['sin', a], ['cos', a], ['sin', b2], ['cos', b2]].map(([f, t]) => ({ f, t, v: r4(FV[f](t * Math.PI / 180)) }));
      const forms = [[(t) => `sin ${180 + t}°`, (t) => -r4(Math.sin(t * Math.PI / 180))], [(t) => `cos ${180 - t}°`, (t) => -r4(Math.cos(t * Math.PI / 180))], [(t) => `cos ${90 + t}°`, (t) => -r4(Math.sin(t * Math.PI / 180))], [(t) => `sin ${90 + t}°`, (t) => r4(Math.cos(t * Math.PI / 180))], [(t) => `sin ${360 - t}°`, (t) => -r4(Math.sin(t * Math.PI / 180))]];
      const [fh, fv] = d.pick(forms), t0 = d.pick([a, b2]), val = fv(t0), dec = (v) => (v < 0 ? MINUS : '') + Math.abs(v).toFixed(4);
      const wrongs = tab.flatMap((e) => [e.v, -e.v]).filter((v) => Math.abs(v - val) > 1e-9).map((v) => ({ h: dec(v), v }));
      const h = fh(t0).replace(/^(sin|cos) /, (m0, f) => `<span class="mb-fn">${f}</span> `);
      return pickH(d, `${jh(tab.map((e) => nb(`<span class="mb-fn">${e.f}</span> ${e.t}° = ${e.v.toFixed(4)}`)).join(', '), '으로/로')} 계산할 때, ${h}의 값은?`, { h: dec(val), v: val }, wrongs, {
        explain: `삼각함수의 성질로 ${h}를 크기가 0°에서 90°까지인 각의 삼각함수로 바꾸면 ${dec(val)}이다.` });
    }, { standard: S2 }),
    T('prop-maxmin', 'sin²x와 cos x가 섞인 함수의 최댓값·최솟값(치환)', '②13', (d, n) => {
      const p = d.int(1, 4), q = d.until(() => d.int(-8, 8), (v) => v !== 0), r = d.int(-4, 4);
      // y = −p t² + q t + c0 (t ∈ [−1, 1])
      const pattern = n === 0 ? d.pick(['A', 'C']) : d.pick(['B', 'D']), c0 = pattern === 'A' || pattern === 'C' ? p + r : r, t0 = q / (2 * p);
      const mx = Math.abs(t0) <= 1 ? c0 + (q * q) / (4 * p) : c0 + Math.abs(q) - p, mn = c0 - p - Math.abs(q);
      if (!Number.isInteger(mx) || !Number.isInteger(mn) || Math.abs(t0) === 0) return null;
      const varT = pattern === 'A' || pattern === 'B' ? cos(X) : sin(X), T2 = (f) => trig(f, X, 2);
      const qt = (h) => `${q === 1 ? '+ ' : q === -1 ? MINUS + ' ' : q > 0 ? '+ ' + q : MINUS + ' ' + -q}${h}`;
      const h = pattern === 'A' ? `${co(p)}${T2('sin')} ${qt(cos(X))}${plusTerm(r)}` : pattern === 'C' ? `${co(p)}${trig('sin', `(${X} + ${P2})`, 2)} ${qt(sin(X))}${plusTerm(r)}`
        : pattern === 'B' ? `${co(q)}${sin(`(${X} + ${P2})`)} ${MINUS} ${p === 1 ? '' : p}${trig('cos', `(${X} + π)`, 2)}${plusTerm(r)}` : `${co(q)}${cos(`(${X} ${MINUS} 2π)`)} ${MINUS} ${p === 1 ? '' : p}${trig('sin', `(${X} + ${P2})`, 2)}${plusTerm(r)}`;
      const into = pattern === 'A' ? `${T2('sin')} = 1 ${MINUS} ${T2('cos')}` : `${trig('sin', `(${X} + ${P2})`, 2)} = ${T2('cos')} = 1 ${MINUS} ${T2('sin')}`;
      return M(`${nb(`0 ≤ ${X} ${LT} 2π`)}일 때, 함수 ${eq(Y, h)}의 최댓값과 최솟값을 각각 구하시오.`, [{ label: '최댓값', answer: mx, signed: true }, { label: '최솟값', answer: mn, signed: true }], {
        explain: `${pattern === 'A' || pattern === 'C' ? `${into}를 쓰고` : '삼각함수의 성질로 바꾸고'} ${eq(varT, V('t'))}로 놓으면 ${nb(`${MINUS}1 ≤ ${V('t')} ≤ 1`)}이고 ${nb(`${Y} = ${co(-p)}${V('t')}${sup(2)} ${q > 0 ? '+' : MINUS} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${V('t')}${plusTerm(c0)}`)}이다. 이 이차함수의 꼭짓점과 양 끝을 살펴 최댓값은 ${num(mx)}, 최솟값은 ${num(mn)}이다.`,
        facts: { calc: [[Math.abs(t0) <= 1 ? `(${c0})+(${q})*(${q})/(4*${p})` : `(${c0})+${Math.abs(q)}-${p}`, 0], [`(${c0})-${p}-${Math.abs(q)}`, 1]] } });
    }, { count: 2, standard: S2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 탄젠트함수의 그래프
  // ════════════════════════════════════════════════════════════════
  const TB = [Q(1), Q(2), Q(3), Q(4), Q(1, 2), Q(1, 3)];
  // 점근선 x = (π/b)n + off 의 글
  function asymText(bq, off) {
    const P = qdiv(Q(1), bq), nPart = P.q === 1 ? `${P.p === 1 ? '' : P.p}${Nn}π` : `${frac(P.p === 1 ? Nn : P.p + Nn, P.q)}π`;
    return nb(`${eq(X, `${nPart}${off.p ? ` + ${rad(off)}` : ''}`)}`) + ` (${jh(Nn, '은/는')} 정수)`;
  }
  const tanq = [
    T('tan-period-asym', '탄젠트함수의 주기와 점근선', '②15', (d, n) => {
      const bq = d.pick(TB), a = d.pick([1, 2, 3, -1, Q(1, 2), Q(1, 3)]), p = n === 0 ? d.pick([Q(0), Q(1, 2), Q(1, 4)]) : d.pick([Q(0), Q(0), Q(1, 2), Q(1, 3), Q(-1, 4)]), dd = d.int(-3, 3);
      const bx = bq.q === 1 ? (bq.p === 1 ? X : bq.p + X) : frac(bq.p === 1 ? X : bq.p + X, bq.q), argH = p.p ? `(${bx} ${p.p > 0 ? '+' : MINUS} ${rad(Q(Math.abs(p.p), p.q))})` : bx;
      const aq = asQ(a), h = `${aq.q === 1 ? co(aq.p) : num(aq) + ' '}${tan(argH)}${plusTerm(dd)}`;
      if (n === 0) {
        const per = qdiv(Q(1), bq), right = { h: rad(per), v: fl(per) }, wrongs = [qmul(per, Q(2)), qmul(per, Q(1, 2)), qdiv(Q(2), bq), Q(1), Q(2), bq].map((q) => ({ h: rad(q), v: fl(q) }));
        return pickH(d, `함수 ${eq(Y, h)}의 주기는?`, right, wrongs, { explain: `${nb(`${Y} = ${Av} ${tan(`(${Bv}${X} + ${Cv})`)} + ${V('d')}`)}의 주기는 ${frac('π', `|${Bv}|`)}이므로 ${rad(per)}이다.` });
      }
      // bx + p = nπ + π/2 → x = (π/b)n + (π/2 − p)/b, off 는 [0, π/b) 로 맞춘다
      const per = qdiv(Q(1), bq), raw = qdiv(qsub(Q(1, 2), p), bq), off = Q(((raw.p * per.q) % (per.p * raw.q) + per.p * raw.q) % (per.p * raw.q), raw.q * per.q);
      const right = asymText(bq, off), alt = (o2, b2) => asymText(b2 || bq, Q(((o2.p * per.q) % (per.p * o2.q) + per.p * o2.q) % (per.p * o2.q), o2.q * per.q));
      const wrongs = [alt(qdiv(Q(1, 2), bq)), alt(qdiv(qadd(Q(1, 2), p), bq)), alt(qsub(Q(1, 2), p)), asymText(qmul(bq, Q(2)), Q(0)), asymText(qdiv(bq, Q(2)), qdiv(Q(1, 2), bq)), alt(Q(0)), alt(qdiv(Q(1, 4), bq))];
      return pickH(d, `함수 ${eq(Y, h)}의 그래프의 점근선의 방정식은?`, right, wrongs, {
        explain: `${nb(`${argH.replace(/^\(|\)$/g, '')} = ${Nn}π + ${rad(Q(1, 2))}`)}일 때 탄젠트의 값이 정의되지 않으므로 점근선은 ${right}이다.` });
    }, { count: 2, standard: S2 }),
    T('tan-coef', '주기와 지나는 두 점으로 탄젠트함수의 계수 구하기', '②16', (d) => {
      const b = d.int(1, 4), a = d.until(() => d.int(-4, 4), (v) => v !== 0), c = d.int(-3, 4), x1 = Q(1, 4 * b), y1 = a + c;
      return M(`함수 ${eq(Y, `${Av} ${tan(Bv + X)} + ${Cv}`)}가 다음 조건을 모두 만족시킬 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 각각 구하시오. (단, ${nb(`${Bv} ${GT} 0`)})<br>(가) 주기가 ${rad(Q(1, b))}이다.<br>(나) 그래프가 두 점 ${nb(`(0, ${num(c)})`)}, ${jh(nb(`(${rad(x1)}, ${num(y1)})`), '을/를')} 지난다.`,
        [{ label: `${Av} =`, answer: a, signed: true }, { label: `${Bv} =`, answer: b, signed: true }, { label: `${Cv} =`, answer: c, signed: true }], {
          explain: `주기가 ${nb(`${frac('π', Bv)} = ${rad(Q(1, b))}`)}이므로 ${eq(Bv, b)}이다. 점 ${nb(`(0, ${num(c)})`)}에서 ${eq(Cv, num(c))}, 점 ${nb(`(${rad(x1)}, ${num(y1)})`)}에서 ${nb(`${Av} ${tan(rad(Q(1, 4)))} + ${Cv} = ${Av} + ${Cv} = ${num(y1)}`)}이므로 ${eq(Av, num(a))}이다.`,
          facts: { calc: [[`(${y1})-(${c})`, 0], [`1/(4*${x1.p}/${x1.q})`, 1], [`${jn(c)}`, 2]] } });
    }, { standard: S2 }),
    T('tan-root-gap', '탄젠트함수의 주기로 두 해의 차 구하기', '②17', (d) => {
      const bq = d.pick([Q(1), Q(2), Q(1, 2), Q(3)]), k = d.pick([2, 3, 4, 5, -2, -3]), per = qdiv(Q(1), bq), hi = qmul(per, Q(2));
      const bx = bq.q === 1 ? (bq.p === 1 ? X : bq.p + X) : frac(X, bq.q);
      const right = { h: rad(per), v: fl(per) }, wrongs = [qmul(per, Q(2)), qmul(per, Q(1, 2)), Q(1), Q(2), Q(1, 2), qmul(per, Q(3, 2))].map((q) => ({ h: rad(q), v: fl(q) }));
      return pickH(d, `${nb(`0 ≤ ${X} ${LT} ${rad(hi)}`)}일 때, 방정식 ${eq(tan(bx), num(k))}의 해가 ${eq(X, AL)} 또는 ${eq(X, BE)}이다. ${nb(`${BE} ${MINUS} ${AL}`)}의 값은? (단, ${nb(`${AL} ${LT} ${BE}`)})`, right, wrongs, {
        explain: `${nb(`${Y} = ${tan(bx)}`)}의 주기는 ${rad(per)}이고, 주어진 범위는 두 주기이다. 두 해는 한 주기만큼 떨어져 있으므로 ${nb(`${BE} ${MINUS} ${AL} = ${rad(per)}`)}이다.` });
    }, { standard: S2 }),
    T('tan-four-points', '탄젠트함수의 그래프의 대칭과 주기로 함숫값 구하기', '②17', (d) => {
      const k = d.int(2, 4), forms = [['b + c − d', -1], ['a + d − c', 1], ['a + b + c', -1]], [ex2, sg] = d.pick(forms), val = sg * k;   // k = 1 이면 두 직선이 x축에 붙어 점 이름이 눈금 글과 겹친다
      const xa = Math.atan(-k), xb = -xa, xc = Math.PI + xa, xdd = Math.PI - xa;
      const figure = plot({ x: [-Math.PI / 2 - 0.3, 3 * Math.PI / 2 + 0.3], y: [-k - 1.8, k + 1.8], ys: ysFor([-Math.PI / 2 - 0.3, 3 * Math.PI / 2 + 0.3], [-k - 1.8, k + 1.8]), xt: [piT(Q(-1, 2)), piT(Q(1, 2)), piT(Q(3, 2))], yt: [k, -k],
        curves: [{ f: Math.tan, from: -Math.PI / 2 + 1e-3, to: Math.PI / 2 - 1e-3, name: 'y=f(x)', color: '#1d4ed8' }, { f: Math.tan, from: Math.PI / 2 + 1e-3, to: 3 * Math.PI / 2 - 1e-3, color: '#1d4ed8' }],   // 한 함수의 두 가지라 같은 색
        lines: [{ y: k, color: '#15803d', said: `직선 y = ${k}` }, { y: -k, color: '#7c3aed', said: `직선 y = −${k}` }, { x: -Math.PI / 2, dash: true, said: '점근선 x = −π/2' }, { x: Math.PI / 2, dash: true, said: '점근선 x = π/2' }, { x: 3 * Math.PI / 2, dash: true, said: '점근선 x = 3π/2' }],
        dots: [{ x: xa, y: -k, name: 'a', side: 'dr', said: '교점(y = −' + k + ')' }, { x: xb, y: k, name: 'b', side: 'ul', said: '교점(y = ' + k + ')' }, { x: xc, y: -k, name: 'c', side: 'dr', said: '교점(y = −' + k + ')' }, { x: xdd, y: k, name: 'd', side: 'ul', said: '교점(y = ' + k + ')' }] });   // 이름은 x축의 눈금 글에서 먼 쪽에
      const exh = ex2.replace(/[abcd]/g, (m0) => V(m0)).replace(/−/g, MINUS);
      return N(`함수 ${eq(fx(X), tan(X))} (${nb(`${MINUS}${P2} ${LT} ${X} ${LT} ${P2}`)}, ${nb(`${P2} ${LT} ${X} ${LT} ${rad(Q(3, 2))}`)})에 대하여 그림과 같이 ${nb(`${Y} = ${fx(X)}`)}의 그래프와 직선 ${eq(Y, `${MINUS}${k}`)}의 교점의 ${X}좌표가 각각 ${Av}, ${Cv}이고, 직선 ${jh(eq(Y, k), '과/와')}의 교점의 ${X}좌표가 각각 ${Bv}, ${V('d')}이다. ${fx(exh)}의 값은? (단, ${nb(`${Av} ${LT} ${Bv} ${LT} ${Cv} ${LT} ${V('d')}`)})`, val, { signed: true, figure,
        explain: `그래프는 원점에 대하여 대칭이고 주기가 π이므로 ${eq(Bv, `${MINUS}${Av}`)}, ${eq(Cv, `π + ${Av}`)}, ${eq(V('d'), `π ${MINUS} ${Av}`)}이다. ${nb(`${exh} = ${sg < 0 ? (ex2.startsWith('a + b') ? `π + ${Av}` : Av) : `${MINUS}${Av}`}`)}이므로 함숫값은 ${num(val)}이다.`,
        facts: { value: `${sg < 0 ? '(-1)*' : ''}${k}` } });
    }, { standard: S2 }),
    T('tan-compare', '구간에서 sin x, cos x, tan x의 크기 비교', '②18', (d) => {
      const [lo, hi] = d.pick([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]]).map((v) => v / 4), fs = ['sin', 'cos', 'tan'];
      if ((lo < 0.5 && hi > 0.5) || (lo < 1.5 && hi > 1.5)) return null;
      const pairs = d.shuffle([['sin', 'cos'], ['cos', 'sin'], ['cos', 'tan'], ['tan', 'cos'], ['sin', 'tan'], ['tan', 'sin']]);
      const used = [], claims = [];
      for (const p of pairs) { const key = [p[0], p[1]].sort().join(); if (used.includes(key)) continue; used.push(key); claims.push(p); if (claims.length === 3) break; }
      const truth = claims.map(([f, g]) => [0.1, 0.3, 0.5, 0.7, 0.9].every((t) => { const x = Math.PI * (lo + (hi - lo) * t); return FV[f](x) < FV[g](x); }));
      const allFalse = claims.map(([f, g]) => [0.1, 0.3, 0.5, 0.7, 0.9].every((t) => { const x = Math.PI * (lo + (hi - lo) * t); return FV[f](x) > FV[g](x); }));
      if (truth.some((t, i) => !t && !allFalse[i]) || !truth.some(Boolean)) return null;
      const L = ['ㄱ', 'ㄴ', 'ㄷ'], sets = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]], right = sets.findIndex((s) => s.length === truth.filter(Boolean).length && s.every((i) => truth[i]));
      const txt = (s) => s.map((i) => L[i]).join(', ');
      return pickH(d, `${nb(`${rad(Q(Math.round(lo * 4), 4))} ${LT} ${X} ${LT} ${rad(Q(Math.round(hi * 4), 4))}`)}일 때, 다음에서 옳은 것만을 있는 대로 고른 것은?`, txt(sets[right]), sets.filter((_, i) => i !== right).map(txt), {
        figure: B.kit.lines(claims.map(([f, g], i) => `${L[i]}. ${nb(`${TF[f](X)} ${LT} ${TF[g](X)}`)}`)),
        explain: `주어진 범위에서 세 함수의 그래프를 보면 ${claims.map(([f, g], i) => `${L[i]}은 ${truth[i] ? '참' : '거짓'}`).join(', ')}이다.` });
    }, { standard: S2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 삼각함수를 포함한 방정식과 부등식
  // ════════════════════════════════════════════════════════════════
  const REL = { '<': LT, '<=': '≤', '>': GT, '>=': '≥' }, FLIP = { '<': '>=', '<=': '>', '>': '<=', '>=': '<' }, STRICT = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' };
  // f(x) = k 의 k(특수한 값)
  const kFor = (d, f) => (f === 'tan' ? d.pick([1, -1, R3, -R3, R3 / 3, -R3 / 3]) : d.pick([0.5, -0.5, R2 / 2, -R2 / 2, R3 / 2, -R3 / 2]));
  const eqs = [
    T('eq-basic', '삼각함수를 포함한 기본 방정식', '②19', (d, n) => {
      const f = d.pick(['sin', 'cos', 'tan']), k = kFor(d, f), [L, R, oL, cR] = n === 0 ? [0, 48, false, false] : d.pick([[-12, 12, true, true], [0, 24, false, false], [-24, 24, false, false]]);
      const g = (x) => FV[f](x) - k, res = solveSet(g, L, R, '=', { openL: oL, closedR: cR && false });
      if (!res || !res.pts.length) return null;
      const alt = (f2, k2) => solveSet((x) => FV[f2](x) - k2, L, R, '=', { openL: oL });
      const alts = [alt(f, -k), alt(f === 'sin' ? 'cos' : 'sin', k), alt(f === 'tan' ? 'sin' : 'tan', k), alt(f, k === 0.5 ? R3 / 2 : 0.5)];
      return pickSet(d, `${domText(L, R, oL, false)}일 때, 방정식 ${eqText(d, f, k, X)}의 해는?`, res, alts, {
        explain: `방정식을 정리하면 ${eq(TF[f](X), exact(k))}이다. 해는 함수 ${nb(`${Y} = ${TF[f](X)}`)}의 그래프와 직선 ${eq(Y, exact(k))}의 교점의 ${X}좌표이므로 ${setText(res)}이다.` });
    }, { count: 2, standard: S2 }),
    T('eq-ineq', '삼각함수를 포함한 기본 부등식', '②20', (d) => {
      const f = d.pick(['sin', 'cos', 'tan']), k = kFor(d, f), rel = d.pick(['<', '<=', '>', '>=']), g = (x) => FV[f](x) - k;
      const res = solveSet(g, 0, 48, rel);
      if (!res || !res.ivs.length) return null;
      const alt = (f2, k2, r2) => solveSet((x) => FV[f2](x) - k2, 0, 48, r2);
      const alts = [alt(f, k, FLIP[rel]), alt(f, -k, rel), alt(f === 'sin' ? 'cos' : 'sin', k, rel), alt(f, k, STRICT[rel])];
      return pickSet(d, `${domText(0, 48)}일 때, 부등식 ${eqText(d, f, k, X, rel)}의 해는?`, res, alts, {
        explain: `부등식을 정리하면 ${nb(`${TF[f](X)} ${REL[rel]} ${exact(k)}`)}이다. 함수 ${nb(`${Y} = ${TF[f](X)}`)}의 그래프가 직선 ${eq(Y, exact(k))}보다 ${rel[0] === '<' ? '아래' : '위'}쪽에 있는${rel.length === 2 ? '(만나는 점을 포함한)' : ''} ${X}의 값의 범위이므로 ${setText(res)}이다.${f === 'tan' ? ' 탄젠트함수는 점근선에서 값이 없다.' : ''}` });
    }, { standard: S2 }),
    T('eq-linear-arg', '각이 ax + b 꼴인 방정식·부등식', '②21', (d, n) => {
      if (n === 1) {
        const f = d.pick(['tan', 'sin', 'cos']), b = d.pick([2, 3]), k = f === 'tan' ? d.pick([1, -1, R3, R3 / 3]) : d.pick([0.5, -0.5, R2 / 2, R3 / 2]);
        const res = solveSet((x) => FV[f](b * x) - k, 0, 48, '=');
        if (!res || !res.pts.length) return null;
        const sum = sumOf(res), alt = (r) => r && r.pts.length ? sumOf(r) : null;
        const cands = [alt(solveSet((x) => FV[f](x) - k, 0, 48, '=')), alt(solveSet((x) => FV[f](b * x) - k, 0, 24, '=')), alt(solveSet((x) => FV[f](b * x) + k, 0, 48, '=')), qmul(sum, Q(1, 2)), qadd(sum, Q(1)), qsub(sum, Q(1))].filter(Boolean).filter((q) => q.p > 0);
        return pickH(d, `${domText(0, 48)}일 때, 방정식 ${eqText(d, f, k, b + X)}의 모든 해의 합은?`, { h: rad(sum), v: fl(sum) }, cands.map((q) => ({ h: rad(q), v: fl(q) })), {
          explain: `${eq(`${b}${X}`, V('t'))}로 놓으면 ${nb(`0 ≤ ${V('t')} ${LT} ${b * 2}π`)}에서 ${eq(TF[f](V('t')), exact(k))}의 해를 모두 구해 ${B.kit.josa(b, '으로/로')} 나누면 ${setText(res)}이다. 그 합은 ${rad(sum)}이다.` });
      }
      const f = d.pick(['sin', 'cos', 'tan']), k = kFor(d, f), shift = d.pick([Q(1, 3), Q(1, 4), Q(1, 6), Q(-1, 3), Q(-1, 4), Q(-1, 6)]), half = d.int(0, 2) === 0 && f !== 'tan';
      const argF = (x) => (half ? x / 2 : x - Math.PI * fl(shift)), argH = half ? frac(X, 2) : `(${X} ${shift.p > 0 ? MINUS : '+'} ${rad(Q(Math.abs(shift.p), shift.q))})`;
      if (n === 0) {
        const res = solveSet((x) => FV[f](argF(x)) - k, 0, 48, '=');
        if (!res || !res.pts.length) return null;
        const alts = [solveSet((x) => FV[f](x) - k, 0, 48, '='), solveSet((x) => FV[f](half ? 2 * x : x + Math.PI * fl(shift)) - k, 0, 48, '='), solveSet((x) => FV[f](argF(x)) + k, 0, 48, '=')];
        return pickSet(d, `${domText(0, 48)}일 때, 방정식 ${eqText(d, f, k, argH)}의 해는?`, res, alts, {
          explain: `${eq(half ? frac(X, 2) : argH.replace(/^\(|\)$/g, ''), V('t'))}로 놓고 ${V('t')}의 범위를 바꾸어 ${jh(eq(TF[f](V('t')), exact(k)), '을/를')} 풀면 ${setText(res)}이다.` });
      }
      const rel = d.pick(['<', '<=', '>', '>=']), res = solveSet((x) => FV[f](argF(x)) - k, 0, 48, rel);
      if (!res || !res.ivs.length) return null;
      const alts = [solveSet((x) => FV[f](x) - k, 0, 48, rel), solveSet((x) => FV[f](half ? 2 * x : x + Math.PI * fl(shift)) - k, 0, 48, rel), solveSet((x) => FV[f](argF(x)) - k, 0, 48, FLIP[rel])];
      return pickSet(d, `${domText(0, 48)}일 때, 부등식 ${nb(`${TF[f](argH)} ${REL[rel]} ${exact(k)}`)}의 해는?`, res, alts, {
        explain: `${eq(half ? frac(X, 2) : argH.replace(/^\(|\)$/g, ''), V('t'))}로 놓고 ${V('t')}의 범위를 바꾸어 ${jh(nb(`${TF[f](V('t'))} ${REL[rel]} ${exact(k)}`), '을/를')} 풀면 ${setText(res)}이다.` });
    }, { count: 3, standard: S2 }),
    T('eq-sin-cos', 'sin x와 cos x를 비교하거나 나누는 방정식·부등식', '②22', (d, n) => {
      if (n === 0) {
        const rel = d.pick(['<', '<=', '>', '>=']), res = solveSet((x) => Math.sin(x) - Math.cos(x), 0, 48, rel);
        const alts = [solveSet((x) => Math.sin(x) - Math.cos(x), 0, 48, FLIP[rel]), solveSet((x) => Math.sin(x) + Math.cos(x), 0, 48, rel), solveSet((x) => Math.sin(x) - Math.cos(x), 0, 48, STRICT[rel]), solveSet((x) => Math.tan(x) - 1, 0, 48, rel)];
        return pickSet(d, `${domText(0, 48)}일 때, 부등식 ${nb(`${sin(X)} ${REL[rel]} ${cos(X)}`)}의 해는?`, res, alts, {
          explain: `두 그래프는 ${eq(X, rad(Q(1, 4)))}, ${eq(X, rad(Q(5, 4)))}에서 만나고, 그 사이에서 ${nb(`${sin(X)} ${GT} ${cos(X)}`)}이다. 따라서 해는 ${setText(res)}이다.` });
      }
      if (n === 1) {
        const m = d.pick([R3, -R3, 1, -1, R3 / 3, -R3 / 3]), res = solveSet((x) => Math.sin(x) - m * Math.cos(x), -12, 12, '=', { openL: true });
        if (!res || res.pts.length !== 1) return null;
        const lhs = Math.abs(m) === R3 / 3 ? `${rt(3)}${sin(X)} = ${m < 0 ? MINUS : ''}${cos(X)}` : `${sin(X)} = ${m < 0 ? MINUS : ''}${Math.abs(m) === 1 ? '' : rt(3)}${cos(X)}`;
        const alts = [solveSet((x) => Math.sin(x) + m * Math.cos(x), -12, 12, '=', { openL: true }), solveSet((x) => Math.cos(x) - m * Math.sin(x), -12, 12, '=', { openL: true }), { pts: [res.pts[0] + 24] }, { pts: [-res.pts[0]] }].concat([12 - res.pts[0], res.pts[0] - 12, res.pts[0] + 12].filter((v) => v > -12 && v < 12).map((v) => ({ pts: [v] })));
        return pickSet(d, `${domText(-12, 12, true)}일 때, 방정식 ${nb(lhs)}의 해는?`, res, alts, {
          explain: `주어진 범위에서 ${nb(`${cos(X)} ≠ 0`)}이므로 양변을 ${jh(cos(X), '으로/로')} 나누면 ${eq(tan(X), exact(m))}이고, 해는 ${setText(res)}이다.` });
      }
      const form = d.pick([0, 1, 2]), g = [(x) => Math.cos(x) ** 2 - Math.sin(x) * Math.cos(x), (x) => Math.sin(x) ** 2 - Math.sin(x) * Math.cos(x), (x) => Math.cos(x) ** 2 + Math.sin(x) * Math.cos(x)][form];
      const h = [`${trig('cos', X, 2)} ${MINUS} ${sin(X)}${cos(X)}`, `${trig('sin', X, 2)} ${MINUS} ${sin(X)}${cos(X)}`, `${trig('cos', X, 2)} + ${sin(X)}${cos(X)}`][form];
      const res = solveSet(g, 0, 48, '='), sum = sumOf(res), part = form === 1 ? solveSet((x) => Math.sin(x), 0, 48, '=') : solveSet((x) => Math.cos(x), 0, 48, '=');
      const cands = [qsub(sum, sumOf(part)), sumOf(part), qadd(sum, Q(1)), qsub(sum, Q(1)), qmul(sum, Q(1, 2)), Q(2), Q(3)].filter((q) => q.p > 0);
      return pickH(d, `${domText(0, 48)}일 때, 방정식 ${nb(`${h} = 0`)}의 모든 해의 합은?`, { h: rad(sum), v: fl(sum) }, cands.map((q) => ({ h: rad(q), v: fl(q) })), {
        explain: `좌변을 묶으면 ${form === 1 ? `${nb(`${sin(X)}(${sin(X)} ${MINUS} ${cos(X)}) = 0`)}이므로 ${eq(sin(X), 0)} 또는 ${eq(sin(X), cos(X))}` : form === 0 ? `${nb(`${cos(X)}(${cos(X)} ${MINUS} ${sin(X)}) = 0`)}이므로 ${eq(cos(X), 0)} 또는 ${eq(cos(X), sin(X))}` : `${nb(`${cos(X)}(${cos(X)} + ${sin(X)}) = 0`)}이므로 ${eq(cos(X), 0)} 또는 ${eq(sin(X), `${MINUS}${cos(X)}`)}`}이다. ${jh(cos(X), '으로/로')} 나누기 전에 ${jh(form === 1 ? sin(X) : cos(X), '이/가')} 0인 해를 따로 챙기면 해는 ${setText(res)}이고, 합은 ${rad(sum)}이다.` });
    }, { count: 3, standard: S2 }),
    T('eq-quadratic', '이차식 꼴의 삼각방정식', '②23 심7', (d, n) => {
      // t = sin x (또는 cos x) 의 이차방정식: 근 하나는 특수한 값, 다른 하나는 범위 밖이거나 특수한 값
      const useSin = d.bool(), t1 = d.pick([0.5, -0.5, 1, -1, 0]), t2 = d.pick([2, -2, 1.5, -1.5, 3, 0.5, -0.5, -1].filter((v) => v !== t1));
      // (p t − q)(r t − s) 꼴의 정수 계수
      const fr = (v) => (Number.isInteger(v) ? [1, v] : [2, v * 2]), [p1, q1] = fr(t1), [p2, q2] = fr(t2), A = p1 * p2, Bc = -(p1 * q2 + p2 * q1), Cc = q1 * q2;
      const F = useSin ? 'sin' : 'cos', G = useSin ? 'cos' : 'sin', tv = (x) => FV[F](x);
      const g = (x) => A * tv(x) ** 2 + Bc * tv(x) + Cc;
      // 이차항은 sin² ↔ 1 − cos² 로 바꿔 적고(A t² = A − A·(G)²), 일차항은 n = 1 이면 성질로 바꿔 적는다
      const linH = n === 1 ? (useSin ? d.pick([[`${cos(`(${P2} ${MINUS} ${X})`)}`, 1], [`${cos(`(${P2} + ${X})`)}`, -1], [`${sin(`(π ${MINUS} ${X})`)}`, 1]]) : d.pick([[`${sin(`(${P2} + ${X})`)}`, 1], [`${cos(`(π + ${X})`)}`, -1], [`${cos(`(${MINUS}${X})`)}`, 1]])) : [TF[F](X), 1];
      const bTerm = Bc * linH[1], quadBy = d.bool();
      const h = quadBy ? `${co(-A)}${trig(G, X, 2)}${bTerm ? (bTerm > 0 ? ' + ' : ` ${MINUS} `) + (Math.abs(bTerm) === 1 ? '' : Math.abs(bTerm)) + linH[0] : ''}${plusTerm(A + Cc)} = 0` : `${co(A)}${trig(F, X, 2)}${bTerm ? (bTerm > 0 ? ' + ' : ` ${MINUS} `) + (Math.abs(bTerm) === 1 ? '' : Math.abs(bTerm)) + linH[0] : ''}${plusTerm(Cc)} = 0`;
      const R = n === 1 ? d.pick([48, 96]) : 48, res = solveSet(g, 0, R, '=');
      if (!res || !res.pts.length || (A + Cc === 0 && quadBy) || Bc === 0) return null;
      const dom = domText(0, R);
      if (n === 1) {
        const sum = sumOf(res), cands = [solveSet(g, 0, R === 48 ? 96 : 48, '='), solveSet((x) => A * tv(x) ** 2 - Bc * tv(x) + Cc, 0, R, '=')].filter((r) => r && r.pts.length).map(sumOf).concat([qadd(sum, Q(1)), qsub(sum, Q(1)), qmul(sum, Q(1, 2)), qmul(sum, Q(2))]).filter((q) => q.p > 0);
        return pickH(d, `${dom}일 때, 방정식 ${nb(h)}의 모든 해의 합은?`, { h: rad(sum), v: fl(sum) }, cands.map((q) => ({ h: rad(q), v: fl(q) })), {
          explain: `삼각함수의 성질과 ${nb(`${trig('sin', X, 2)} + ${trig('cos', X, 2)} = 1`)}로 ${TF[F](X)}만의 식으로 바꾸면 ${nb(`${co(A)}${trig(F, X, 2)} ${Bc > 0 ? '+' : MINUS} ${Math.abs(Bc) === 1 ? '' : Math.abs(Bc)}${TF[F](X)}${plusTerm(Cc)} = 0`)}이다. ${nb(`${MINUS}1 ≤ ${TF[F](X)} ≤ 1`)}인 근만 남기면 해는 ${setText(res)}이고, 합은 ${rad(sum)}이다.` });
      }
      const alts = [solveSet((x) => A * tv(x) ** 2 - Bc * tv(x) + Cc, 0, 48, '='), solveSet((x) => A * FV[G](x) ** 2 + Bc * FV[G](x) + Cc, 0, 48, '='), solveSet((x) => tv(x) - t2, 0, 48, '=')];
      return pickSet(d, `${dom}일 때, 방정식 ${nb(h)}의 해는?`, res, alts, {
        explain: `${nb(`${trig('sin', X, 2)} + ${trig('cos', X, 2)} = 1`)}로 ${TF[F](X)}만의 식으로 바꾸면 ${nb(`(${p1 === 1 ? '' : p1}${TF[F](X)} ${q1 > 0 ? MINUS : '+'} ${Math.abs(q1)})(${p2 === 1 ? '' : p2}${TF[F](X)} ${q2 > 0 ? MINUS : '+'} ${Math.abs(q2)}) = 0`).replace(/ [−+] 0\)/g, ')')}이다. ${nb(`${MINUS}1 ≤ ${TF[F](X)} ≤ 1`)}인 근만 남기면 해는 ${setText(res)}이다.` });
    }, { count: 2, standard: S2 }),
    T('eq-quad-ineq', '이차식 꼴의 삼각부등식', '②24', (d) => {
      const useSin = d.bool(), kind = d.int(0, 1), F = useSin ? 'sin' : 'cos', G = useSin ? 'cos' : 'sin', tv = (x) => FV[F](x), rel = d.pick(['<', '<=', '>', '>=']);
      let g, h;
      if (kind === 0) {
        // (2t − ε)(t − big) 꼴: 한 근은 ±1/2, 다른 근은 범위 밖
        const t1 = d.pick([0.5, -0.5]), big = d.pick([2, 3, -2, -3]), A = 2, Bc = -(2 * big + 2 * t1), Cc = 2 * t1 * big;
        g = (x) => A * tv(x) ** 2 + Bc * tv(x) + Cc;
        h = `${co(-A)}${trig(G, X, 2)}${Bc ? (Bc > 0 ? ' + ' : ` ${MINUS} `) + (Math.abs(Bc) === 1 ? '' : Math.abs(Bc)) + TF[F](X) : ''}${plusTerm(A + Cc)}`;
      } else {
        // a·t² − c 꼴(두 근 ±k)
        const [a, c] = d.pick([[4, 1], [2, 1], [4, 3]]);
        g = (x) => a * tv(x) ** 2 - c;
        h = `${co(a)}${trig(F, X, 2)} ${MINUS} ${c}`;
      }
      const res = solveSet(g, 0, 48, rel);
      if (!res || !res.ivs.length) return null;
      const alts = [solveSet(g, 0, 48, FLIP[rel]), solveSet(g, 0, 48, STRICT[rel]), solveSet((x) => g(x + Math.PI / 2), 0, 48, rel)];
      return pickSet(d, `${domText(0, 48)}일 때, 부등식 ${nb(`${h} ${REL[rel]} 0`)}의 해는?`, res, alts, {
        explain: `${TF[F](X)}만의 식으로 정리해 인수분해하고, ${nb(`${MINUS}1 ≤ ${TF[F](X)} ≤ 1`)}에서 늘 부호가 정해지는 인수를 지우면 ${TF[F](X)}의 범위가 나온다. 그 범위를 그래프로 읽으면 ${setText(res)}이다.` });
    }, { standard: S2 }),
    T('eq-discriminant', '이차방정식의 판별식과 이은 각의 조건', '②25', (d, n) => {
      if (n === 0) {
        const f = d.pick(['sin', 'cos']), val = d.pick([0.5, R2 / 2, R3 / 2]), k = d.int(1, 3), m = Math.round(k * k * val * val * 4) / 4;
        const [L, R] = f === 'sin' ? d.pick([[0, 24], [0, 48]]) : d.pick([[0, 24], [0, 48]]), oL = f === 'sin' && L === 0 && R === 24;
        const res = solveSet((x) => FV[f](x) ** 2 - val * val, L, R, '=', { openL: oL });
        if (!res || !res.pts.length || !Number.isInteger(4 * m)) return null;
        const mh = num(Q(Math.round(4 * m), 4));
        const sum = sumOf(res), cands = [solveSet((x) => FV[f](x) - val, L, R, '=', { openL: oL }), solveSet((x) => FV[f === 'sin' ? 'cos' : 'sin'](x) ** 2 - val * val, L, R, '=', { openL: oL })].filter((r) => r && r.pts.length).map(sumOf).concat([qadd(sum, Q(1)), qmul(sum, Q(1, 2)), qmul(sum, Q(2)), Q(1), Q(2)]).filter((q) => q.p > 0);
        return pickH(d, `${X}에 대한 이차방정식 ${nb(`${X}${sup(2)} ${MINUS} ${2 * k === 1 ? '' : 2 * k}${X} ${TF[f](TH)} + ${mh} = 0`)}이 중근을 갖도록 하는 모든 ${TH}의 값의 합은? (단, ${nb(`${xr(L)} ${oL ? LT : '≤'} ${TH} ${LT} ${xr(R)}`)})`, { h: rad(sum), v: fl(sum) }, cands.map((q) => ({ h: rad(q), v: fl(q) })), {
          explain: `판별식을 ${V('D')}라 하면 ${nb(`${frac(V('D'), 4)} = ${k === 1 ? '' : k * k}${trig(f, TH, 2)} ${MINUS} ${mh} = 0`)}이므로 ${eq(trig(f, TH, 2), exact(val * val) || num(Q(Math.round(4 * val * val), 4)))}이다. 범위에서 이를 만족시키는 ${TH}는 ${setText(res, TH)}이고, 합은 ${rad(sum)}이다.` });
      }
      // y = x² + 2bx − c·cosθ 가 x축과 만나지 않는다 → b² + c cosθ < 0
      const [b, b2, c] = d.pick([[1, 1, 2], [rt(2), 2, 4], [rt(3), 3, 6]]);
      const f = d.pick(['sin', 'cos']), sg = d.pick([1, -1]), thr = sg * b2 / c;   // 상수항이 sg·c·f(θ) 이면 D/4 = b² − sg·c·f(θ) < 0
      if (exact(thr) == null || Math.abs(thr) >= 1) return null;
      const res = solveSet((x) => b2 - sg * c * FV[f](x), 0, 48, '<');
      if (!res || !res.ivs.length) return null;
      const alts = [solveSet((x) => b2 - sg * c * FV[f](x), 0, 48, '>'), solveSet((x) => b2 - sg * c * FV[f](x), 0, 48, '<='), solveSet((x) => b2 + sg * c * FV[f](x), 0, 48, '<'), solveSet((x) => b2 - sg * c * FV[f === 'sin' ? 'cos' : 'sin'](x), 0, 48, '<')];
      return pickSet(d, `${X}에 대한 이차함수 ${nb(`${Y} = ${X}${sup(2)} + ${b === 1 ? 2 : '2' + b}${X} ${sg > 0 ? '+' : MINUS} ${c}${TF[f](TH)}`)}의 그래프가 ${X}축과 만나지 않을 때, ${TH}의 값의 범위는? (단, ${nb(`0 ≤ ${TH} ${LT} 2π`)})`, res, alts, { v: TH,
        explain: `이차방정식 ${nb(`${X}${sup(2)} + ${b === 1 ? 2 : '2' + b}${X} ${sg > 0 ? '+' : MINUS} ${c}${TF[f](TH)} = 0`)}이 실근을 갖지 않아야 하므로 ${nb(`${frac(V('D'), 4)} = ${b2} ${sg > 0 ? MINUS : '+'} ${c}${TF[f](TH)} ${LT} 0`)}, 곧 ${nb(`${TF[f](TH)} ${sg > 0 ? GT : LT} ${exact(thr)}`)}이다. 따라서 ${setText(res, TH)}이다.` });
    }, { count: 2, standard: S2 }),
    T('eq-sea', '삼각함수로 나타낸 실생활 — 해수면의 높이', '②29', (d) => {
      const A = d.int(2, 4), Bh = A + d.int(2, 5), per = 12, hk = d.pick([[-0.5, 7, Q(7, 6)], [0.5, 1, Q(1, 6)], [1, 3, Q(1, 2)], [-1, 9, Q(3, 2)]]), [sv, first, tq] = hk;
      const h = Bh + A * sv, fml = eq(Y, `${A}${trig('sin', `${frac('π', 6)}${X}`)} + ${Bh}`), pj = jh(fml, '이/가').slice(fml.length);   // 토씨는 괄호 앞 식에 맞춘다
      return N(`어느 해안에서 관측을 시작한 지 ${X}시간 후의 해수면의 높이를 ${Y} m라 하면 ${nb(`${fml} (0 ${LT} ${X} ${LT} 24)`)}${pj} 성립한다고 한다. 이 해안의 해수면의 높이가 처음으로 ${h} m가 되는 것은 관측을 시작한 지 몇 시간 후인가?`, first, {
        unit: '시간 후', explain: `${nb(`${A}${trig('sin', `${frac('π', 6)}${X}`)} + ${Bh} = ${h}`)}에서 ${eq(trig('sin', `${frac('π', 6)}${X}`), exact(sv))}이다. ${eq(`${frac('π', 6)}${X}`, V('t'))}로 놓으면 ${nb(`0 ${LT} ${V('t')} ${LT} 4π`)}이고, 처음 해는 ${eq(V('t'), rad(tq))}이므로 ${eq(X, first)}이다.`,
        facts: { value: `6*${tq.p}/${tq.q}` } });
    }, { standard: S2 })
  ];

  B.addTypes('11-1-3', 'sincos', sincos);
  B.addTypes('11-1-3', 'prop', prop);
  B.addTypes('11-1-3', 'tan', tanq);
  B.addTypes('11-1-3', 'eq', eqs);
})(typeof window !== 'undefined' ? window : globalThis);
