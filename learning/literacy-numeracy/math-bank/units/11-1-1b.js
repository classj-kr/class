// 고등학교 대수 Ⅰ-1 지수와 로그(11-1-1) — 뒤쪽 묶음
// (로그의 뜻, 로그의 성질, 로그를 문자로 나타내기와 조건식, 상용로그).
// 싣는 기준과 뺀 것은 11-1-1a.js 머리에 모아 적었다. ref: ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//  - 로그는 「밑은 1이 아닌 양수, 진수는 양수」를 지킨다. 밑이나 진수를 구하는 문항은 그 조건으로 값을 거른다.
//  - 상용로그표의 값은 소수 넷째 자리까지라 답 칸(소수 첫째 자리까지)으로 받지 못한다 — 고르기로 내고, 참·거짓은 만분의 일 단위 정수로 셈한다.
//    「log 2 = 0.3으로 계산한다」처럼 어림한 값을 주는 문항은 그 값으로 셈한 답을 정답으로 한다.
//  - 상용로그를 쓰는 실생활(소리의 크기·지진의 규모·pH·별의 밝기 등 — 공식에 넣어 몇 배인지·차를 구하는 꼴)은 11-1-2 에서 빼기로 해 이 단원에 모두 둔다(조율 결정, ②36·②37).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, D, F, inline } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qneg, isInt, gcd, lcm, tx, V, sup, nb } = B.kit.mid;
  const { lg, jh, hx, qAns } = B.kit.hs;
  // 글 속의 짧은 식(a − a⁻¹, a² + a⁻²)은 줄이 식 가운데서 갈리지 않게 한 덩어리로 묶는다.
  const ms = (s, c) => (/\s/.test(String(s)) ? '<span style="white-space:nowrap">' + B.kit.hs.ms(s, c) + '</span>' : B.kit.hs.ms(s, c));
  const K = B.kit.u1111;
  const { UNIT, S4, S5, HAN, CIR, stripH, T, num, jn, qh, qp, va, vb, vc, vx, vy, vk, vn, vm, eq, R, PW, pv, L, NOTE1, ipow, iroot, rootAns, valsQ, rowsFig, choose, pickSets, ex1, VAL, SIMP } = K;

  // ── 유리수 거듭제곱과 로그 참·거짓(정확한 셈) ──
  const qpowZ = (q, n) => (n >= 0 ? Q(ipow(q.p, n), ipow(q.q, n)) : Q(ipow(q.q, -n), ipow(q.p, -n)));
  const qeq = (x, y) => x.p === y.p && x.q === y.q;
  // X^Y = Z 인가(X, Z 는 유리수, Y 는 유리수 지수 — X 는 양수)
  const powIs = (X, Y, Z) => X.p > 0 && Z.p > 0 && qeq(qpowZ(X, Y.p), qpowZ(Z, Y.q));
  // 「c = log_b x」가 참인가: 밑 b 는 1이 아닌 양수, 진수 x 는 양수, b^c = x
  const logIs = (c, b, x) => b.p > 0 && !qeq(b, Q(1)) && x.p > 0 && powIs(b, c, x);
  // 수 글: 정수는 그대로, 분수는 세로 분수
  const QH = (q) => (q.q === 1 ? num(q.p) : (q.p < 0 ? MINUS : '') + frac(Math.abs(q.p), q.q));
  const QB = (q) => (q.q === 1 && q.p > 0 ? String(q.p) : '(' + QH(q) + ')');      // 거듭제곱의 밑
  const QJ = (q) => (q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')');           // 검사 식
  // 만분의 일 단위 정수 → 소수 넷째 자리 글: 7193 → 0.7193, −12807 → −1.2807
  const f4 = (v) => { const s = v < 0 ? MINUS : '', a = Math.abs(v); return s + Math.floor(a / 10000) + '.' + String(a % 10000).padStart(4, '0'); };
  const r4 = (x) => Math.round(Math.log10(x) * 10000);                              // 상용로그를 만분의 일 단위로 반올림
  const d2 = (h) => (h / 100).toFixed(2);                                         // 백분의 일 단위 정수 → 1.00~9.99 글
  // 문자 a, b 의 일차식 글: [a 의 계수, b 의 계수, 상수항]
  function linH(t, names) {
    const [na, nb2] = names || [va, vb], parts = [];
    [[t[0], na], [t[1], nb2], [t[2], '']].forEach(([c, v]) => { if (!c) return; const a = Math.abs(c); parts.push((parts.length ? (c < 0 ? ' ' + MINUS + ' ' : ' + ') : c < 0 ? MINUS : '') + (v && a === 1 ? '' : a) + v); });
    return parts.join('') || '0';
  }
  // 두 일차식의 비가 같은가(분수식 n/d 와 n2/d2 가 a, b 에 관계없이 같은가): n·d2 = n2·d 를 다항식으로 견준다.
  const prod2 = (x, y) => [x[0] * y[0], x[0] * y[1] + x[1] * y[0], x[1] * y[1], x[0] * y[2] + x[2] * y[0], x[1] * y[2] + x[2] * y[1], x[2] * y[2]];
  const sameRatio = (n1, d1, n2, d2v) => prod2(n1, d2v).every((v, i) => v === prod2(n2, d1)[i]);
  const ratioH = (n, dd) => (dd[0] === 0 && dd[1] === 0 && dd[2] === 1 ? linH(n) : frac(linH(n), linH(dd)));
  // 수를 소수·정수·분수 가운데 알맞은 글로(로그의 진수)
  function numText(q) {
    if (q.q === 1) return String(q.p);
    let den = q.q, k = 0; while (den % 10 === 0) { den /= 10; k += 1; }
    let t = q.q, twos = 0, fives = 0; while (t % 2 === 0) { t /= 2; twos += 1; } while (t % 5 === 0) { t /= 5; fives += 1; }
    if (t === 1 && Math.max(twos, fives) <= 3) return (q.p / q.q).toFixed(Math.max(twos, fives));
    return frac(q.p, q.q);
  }
  const NOTE01 = ' <span style="white-space:nowrap">(단, 0이나 1도 칸에 적는다.)</span>';
  const coefH = (q) => (isInt(q) ? (q.p === 1 ? '' : num(q.p)) : qh(q));       // 로그 앞의 계수(1은 적지 않는다)

  // ── 로그의 뜻 ──
  // 등식 b^c = x 의 재료: [밑 b, 지수 c, 진수 x](모두 유리수)
  function powFact(d) {
    const kind = d.int(0, 4);
    if (kind === 0) { const b = d.pick([2, 3, 5, 10]), c = d.int(2, 5), x = ipow(b, c); return x > 2000 ? null : [Q(b), Q(c), Q(x)]; }
    if (kind === 1) { const m = d.int(2, 5), c = -d.int(2, 5), x = ipow(m, -c); return x > 1000 ? null : [Q(1, m), Q(c), Q(x)]; }
    if (kind === 2) { const m = d.int(2, 5), q = d.pick([2, 3]); return ipow(m, q) > 500 ? null : [Q(ipow(m, q)), Q(1, q), Q(m)]; }
    if (kind === 3) { const m = d.int(2, 5), c = d.int(2, 4), x = ipow(m, c); return x > 1000 ? null : [Q(1, m), Q(c), Q(1, x)]; }
    const m = d.int(2, 5); return [Q(1, m * m), Q(-1, 2), Q(m)];
  }
  const powH = (b, c, x) => eq(PW(QB(b), c), QH(x));
  const logH = (c, b, x) => eq(QH(c), L(QH(b), QH(x)));
  B.addTypes(UNIT, 'logdef', [
    T('logdef-to-log', '지수 꼴 등식을 로그 꼴로', '②1', (d) => {
      const f = powFact(d);
      if (!f) return null;
      const [b, c, x] = f, cands = [[c, b, x], [c, x, b], [qneg(c), b, x]];
      if (c.p > 0 && !qeq(c, Q(1))) cands.push([b, c, x]);
      if (c.p > 0 && !qeq(c, Q(1))) cands.push([x, b, c]);
      cands.push([c, x, Q(b.q, b.p)]);
      const rows = cands.map(([l, bb, xx]) => [logH(l, bb, xx), logIs(l, bb, xx)]);
      return choose(d, `등식 ${jh(powH(b, c, x), '을/를')} ${ms('x = log_a N', 'N')} 꼴로 나타낸 것은?`, rows, true, {
        explain: `${va} &gt; 0, ${va} ≠ 1, ${V('N')} &gt; 0일 때 ${eq(ms('a^x'), V('N'))}이면 ${eq(vx, ms('log_a N', 'N'))}이므로 ${jh(powH(b, c, x), '은/는')} ${logH(c, b, x)}이다.`
      });
    }),
    T('logdef-to-exp', '로그 꼴 등식을 지수 꼴로', '②2', (d) => {
      const f = powFact(d);
      if (!f) return null;
      const [b, c, x] = f;
      const cand = [[b, c, x], [c, b, x], [x, c, b], [b, qneg(c), x]];
      if (x.q === 1 && x.p <= 6) cand.push([b, x, c]);
      const rows = cand.filter(([X]) => X.p > 0).map(([X, Y, Z]) => [eq(PW(QB(X), Y), QH(Z)), powIs(X, Y, Z)]);
      if (rows.length < 4) return null;
      return choose(d, `등식 ${jh(logH(c, b, x), '을/를')} ${eq(ms('a^x'), V('N'))} 꼴로 나타낸 것은?`, rows, true, {
        explain: `${eq(vx, ms('log_a N', 'N'))}이면 ${eq(ms('a^x'), V('N'))}이므로 ${jh(logH(c, b, x), '은/는')} ${powH(b, c, x)}이다.`
      });
    }),
    T('logdef-val', '로그의 값', '②3', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 3);
        let bH, bJ, xH, xJ, k;
        if (kind === 0) { const b = d.pick([2, 3, 5, 6, 7]); k = d.pick([-4, -3, -2, 2, 3, 4, 5, 6]); const x = qpowZ(Q(b), k); if (x.p > 1000 || x.q > 1000) return null; bH = String(b); bJ = String(b); xH = QH(x); xJ = QJ(x); }
        else if (kind === 1) { const m = d.int(2, 5); k = d.pick([-5, -4, -3, -2, 2, 3]); const x = qpowZ(Q(1, m), k); if (x.p > 1000 || x.q > 1000) return null; bH = frac(1, m); bJ = `(1/${m})`; xH = QH(x); xJ = QJ(x); }
        else if (kind === 2) { const m = d.pick([2, 3, 5]); k = d.pick([-4, 2, 4, 6]); const x = qpowZ(Q(m), k / 2); if (x.p > 1000 || x.q > 1000) return null; bH = R(2, m); bJ = `${m}**(1/2)`; xH = QH(x); xJ = QJ(x); }
        else { k = d.pick([-4, -3, -2, 2, 3, 4]); bH = '10'; bJ = '10'; xH = k > 0 ? String(ipow(10, k)) : (1 / ipow(10, -k)).toFixed(-k); xJ = k > 0 ? String(ipow(10, k)) : xH; }
        return qAns(`${L(bH, xH)}의 값은?`, k, { signed: true, explain: `${jh(eq(L(bH, xH), vx), '으로/로')} 놓으면 ${eq(PW(kind === 1 ? '(' + bH + ')' : bH, vx), xH)}이고 ${eq(xH, PW(kind === 1 ? '(' + bH + ')' : bH, k))}이므로 ${eq(vx, num(k))}이다.`, facts: { value: `(${bJ})**(${k})/(${xJ})*(${k})`, derived: [Math.abs(k), 2] } });
      }
      // 진수가 근호 꼴: x = g^(r/s), 밑 = g^t → 값 r/(s t)
      const g = d.pick([2, 3, 5, 10]), s = d.pick([2, 3]), r = d.pick([-5, -4, -2, -1, 1, 2, 4, 5, 7]), t = g === 10 ? 1 : d.pick([1, 1, 2, -1]);
      if (gcd(Math.abs(r), s) !== 1) return null;
      const v = Q(r, s * t), whole = Math.floor(Math.abs(r) / s), rem = Math.abs(r) % s, W = ipow(g, whole);
      if (isInt(v) || W > 1000 || ipow(g, rem) > 100) return null;
      const body = (whole ? String(W) : '') + (rem ? R(s, rem === 1 ? g : ipow(g, rem)) : ''), xH = r > 0 ? body : frac(1, body);
      const bH = t === 1 ? String(g) : t === 2 ? String(g * g) : frac(1, g), bJ = t === 1 ? String(g) : t === 2 ? String(g * g) : `(1/${g})`;
      const xJ = `${r > 0 ? '' : '1/'}(${whole ? W + '*' : ''}${g}**(${rem}/${s}))`;
      return qAns(`${L(bH, xH)}의 값은?`, v, {
        signed: true, explain: `${eq(xH, PW(g, Q(r, s)))}${t === 1 ? '' : ', ' + eq(bH, PW(g, t))}이므로 ${eq(L(bH, xH), qh(Q(r, s)) + (t === 1 ? '' : ' ÷ ' + (t < 0 ? '(' + num(t) + ')' : t)))}${t === 1 ? '' : ' = ' + qh(v)}이다.`,
        facts: { value: `(${bJ})**(${v.p}/${v.q})/(${xJ})*(${v.p}/${v.q})`, derived: [v.p < 0 ? -v.p : v.p, v.q, s, rem, whole, W, g] }
      });
    }, { count: 2 }),
    T('logdef-back', '로그의 값에서 진수나 밑 구하기', '②4', (d, n) => {
      if (n === 0 || n === 1) {
        const inv = d.bool(), m = d.pick([2, 3, 5, 7]), e = d.int(2, 4), b = inv ? Q(1, m) : Q(m), k = (n === 0) === inv ? -e : e, x = qpowZ(b, k);
        if (Math.max(x.p, x.q) > 2500) return null;
        const bH = QH(b);
        return qAns(`등식 ${jh(eq(L(bH, V('N')), num(k)), '을/를')} 만족시키는 양수 ${V('N')}의 값은?`, x, {
          explain: `로그의 정의에 의하여 ${eq(V('N'), PW(b.q === 1 ? bH : '(' + bH + ')', k))} = ${QH(x)}이다.`,
          facts: { value: `(${QJ(b)})**(${k})` }
        });
      }
      if (n === 2) {
        const x0 = d.int(2, 9), k = d.pick([2, 3, 4, -2, -1]), Nq = qpowZ(Q(x0), k);
        if (Math.max(Nq.p, Nq.q) > 1000 || (k === -1 && x0 > 5)) return null;
        return qAns(`등식 ${jh(eq(L(vx, QH(Nq)), num(k)), '을/를')} 만족시키는 실수 ${vx}의 값은?`, x0, {
          explain: `밑의 조건에서 ${vx} &gt; 0, ${vx} ≠ 1이다. 로그의 정의에 의하여 ${eq(PW(vx, k), QH(Nq))}이고 ${vx} &gt; 0이므로 ${eq(vx, x0)}이다.`,
          facts: { value: `(${QJ(Nq)})**(1/(${k}))` }
        });
      }
      const c = d.pick([2, 3, 5]), m = d.int(1, 4), s = d.pick([1, 2]), j = d.pick([1, 2, 3]);
      if ((m * j) % s !== 0 || ipow(c, 2 * s) > 1000 || ipow(c, m) > 1000) return null;
      const ans = m * j / s;
      return qAns(`1이 아닌 두 양수 ${va}, ${vb}에 대하여 ${eq(L(R(2, c), va), 2 * m)}, ${eq(L(vb, ipow(c, 2 * s)), 2)}일 때, ${L(vb, pv(va, j))}의 값은?`, ans, {
        explain: `${eq(va, PW('(' + R(2, c) + ')', 2 * m))} = ${ipow(c, m)}이고, ${eq(ms('b^2'), ipow(c, 2 * s))}에서 ${vb} &gt; 0이므로 ${eq(vb, ipow(c, s))}이다. 따라서 ${eq(L(vb, pv(va, j)), L(ipow(c, s), pv(ipow(c, m), j)))} = ${ans}이다.`,
        facts: { value: `${m}*${j}/${s}`, derived: [m, j, s] }
      });
    }, { count: 4 }),
    T('logdef-cond1', '진수의 조건을 만족시키는 정수의 개수', '②5', (d) => {
      const r1 = d.int(-6, 3), r2 = r1 + d.int(3, 9), b = d.pick([2, 3, 4, 5, 10]), S0 = r1 + r2, P0 = -r1 * r2;
      if (S0 === 0 || P0 === 0) return null;
      const poly = `${MINUS}${ms('a^2')}${S0 > 0 ? ' + ' : ' ' + MINUS + ' '}${Math.abs(S0) === 1 ? '' : Math.abs(S0)}${va}${P0 > 0 ? ' + ' : ' ' + MINUS + ' '}${Math.abs(P0)}`;
      const cnt = r2 - r1 - 1;
      return N(`${jh(L(b === 10 ? null : b, '(' + poly + ')'), '이/가')} 정의되도록 하는 정수 ${va}의 개수는?`, cnt, {
        unit: '개', explain: `진수의 조건에서 ${poly} &gt; 0, 곧 (${va} ${r1 < 0 ? '+ ' + -r1 : MINUS + ' ' + r1})(${va} ${r2 < 0 ? '+ ' + -r2 : MINUS + ' ' + r2}) &lt; 0이므로 ${num(r1)} &lt; ${va} &lt; ${num(r2)}이다. 정수 ${jh(va, '은/는')} ${cnt}개이다.`,
        facts: { value: `${r2}-(${r1})-1`, derived: [Math.abs(r1), Math.abs(r2)] }
      });
    }),
    T('logdef-cond2', '밑과 진수의 조건을 만족시키는 정수의 개수', '②6', (d) => {
      const c = d.int(1, 3), lin = d.bool(), hi = c + d.int(3, 8), lo = lin ? null : d.int(c - 3, c);
      const baseH = `(${vx} ${MINUS} ${c})`;
      let argH, why;
      if (lin) { argH = `(${hi} ${MINUS} ${vx})`; why = `진수의 조건에서 ${hi} ${MINUS} ${vx} &gt; 0, 곧 ${vx} &lt; ${hi}`; }
      else { const S0 = lo + hi, P0 = -lo * hi; if (S0 === 0) return null; argH = `(${MINUS}${ms('x^2')}${S0 > 0 ? ' + ' : ' ' + MINUS + ' '}${Math.abs(S0) === 1 ? '' : Math.abs(S0)}${vx}${P0 === 0 ? '' : P0 > 0 ? ' + ' + P0 : ' ' + MINUS + ' ' + -P0})`; why = `진수의 조건에서 ${num(lo)} &lt; ${vx} &lt; ${hi}`; }
      const cnt = hi - c - 2;
      return N(`${jh(lg(baseH, argH), '이/가')} 정의되도록 하는 정수 ${vx}의 개수는?`, cnt, {
        unit: '개', explain: `밑의 조건에서 ${vx} ${MINUS} ${c} &gt; 0, ${vx} ${MINUS} ${c} ≠ 1이므로 ${vx} &gt; ${c}, ${vx} ≠ ${c + 1}이다. ${why}이다. 두 조건을 함께 만족시키는 정수는 ${c + 2}부터 ${hi - 1}까지의 ${cnt}개이다(${josa(c + 1, '은/는')} 밑이 1이 되어 뺀다).`,
        facts: { value: `${hi}-${c}-2`, derived: [hi, 2] }
      });
    })
  ]);

  // ── 로그의 성질 ──
  B.addTypes(UNIT, 'logprop', [
    T('logp-same', '같은 밑의 로그를 성질로 계산하기', '②7', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3, 5, 6]), e = d.int(1, 4), cnt = d.pick([2, 3]);
        // 항: { h 글, r 진수가 곱에 들어가는 값(유리수), s 부호(+1 곱, −1 나눗셈), js 검사 식 }
        const terms = [];
        for (let i = 0; i < cnt - 1; i += 1) {
          if (i === 1 || (cnt === 2 && d.bool())) { const w = d.pick([3, 5, 6, 7, 10, 12, 24]); terms.push({ h: '2' + L(b, R(2, w)), r: Q(w), s: 1, js: `(${w}**(1/2))**2` }); }
          else { const p = d.int(2, 20), q = d.pick([1, 1, 3, 5, 7]); if (gcd(p, q) !== 1) return null; const r = Q(p, q), s = d.pick([1, -1]); terms.push({ h: L(b, QH(r)), r, s, js: QJ(r) }); }
        }
        let prod = Q(1);
        terms.forEach((t) => { prod = t.s > 0 ? qmul(prod, t.r) : qdiv(prod, t.r); });
        const last = qdiv(qpowZ(Q(b), e), prod), sl = d.pick([1, -1]), lastR = sl > 0 ? last : qdiv(Q(1), last);
        if (lastR.p <= 0 || Math.max(lastR.p, lastR.q) > 300 || qeq(lastR, Q(1))) return null;
        terms.push({ h: L(b, QH(lastR)), r: lastR, s: sl, js: QJ(lastR) });
        const order = d.shuffle(terms);
        if (order[0].s < 0) return null;
        const h = order.map((t, i) => (i === 0 ? '' : t.s < 0 ? ' ' + MINUS + ' ' : ' + ') + t.h).join('');
        if (new Set(order.map((t) => stripH(t.h))).size !== order.length) return null;
        const pj = order.map((t, i) => (i === 0 ? '' : t.s < 0 ? '/' : '*') + t.js).join('');
        return qAns(VAL, e, { signed: true, figure: ex1(h), explain: `로그의 성질로 진수를 하나로 묶으면 ${eq(L(b, PW(b, e)), e)}이다.`, facts: { value: `(${b})**(${e})/(${pj})*(${e})`, derived: [e, 2] } });
      }
      if (d.bool()) {
        // (1/m) log_b X − log_b ᵐ√Y = (1/m) log_b (X/Y)
        const b = d.pick([2, 3, 5]), m = d.pick([2, 3]), j = d.pick([-2, -1, 1, 2, 4]), Y = d.pick([2, 3, 5, 6, 7].filter((y) => y !== b)), X = Y * ipow(b, Math.max(j, 0)), Yd = Y * ipow(b, Math.max(-j, 0));
        if (j % m === 0 || X > 500 || Yd > 500) return null;
        const h = `${frac(1, m)}${L(b, X)} ${MINUS} ${L(b, R(m, Yd))}`, v = Q(j, m);
        return qAns(VAL, v, { signed: true, figure: ex1(h), explain: `${eq(L(b, R(m, Yd)), frac(1, m) + L(b, Yd))}이므로 ${eq(h, frac(1, m) + L(b, frac(X, Yd)))} = ${frac(1, m)}${eq(L(b, QH(qpowZ(Q(b), j))), qh(v))}이다.`, facts: { value: `(${b})**(${j}/${m})/((${X}/${Yd})**(1/${m}))*(${j}/${m})`, derived: [Math.abs(j), m] } });
      }
      // log_b P − log_b (Q√R) + log_b S, R = t²·b
      const b = d.pick([2, 3, 5, 7]), j = d.pick([-1, 1, 3]), Qv = d.int(2, 6), t = d.int(2, 3), P0 = Qv * t * ipow(b, (j + 1) / 2);
      const P1 = d.pick([2, 3, 4, 5, 6].filter((x) => P0 % x === 0 && x !== P0)), S0 = P1 ? P0 / P1 : 0, Rv = t * t * b;
      if (!P1 || S0 < 2 || P1 === S0 || Rv > 200) return null;
      const h = `${L(b, P1)} ${MINUS} ${L(b, Qv + R(2, Rv))} + ${L(b, S0)}`, v = Q(j, 2);
      return qAns(VAL, v, { signed: true, figure: ex1(h), explain: `${eq(Qv + R(2, Rv), Qv * t + R(2, b))}이므로 진수를 묶으면 ${eq(L(b, frac(P1 + ' × ' + S0, Qv * t + R(2, b))), L(b, PW(b, v)))} = ${qh(v)}이다.`, facts: { value: `(${b})**(${j}/2)/(${P1}*${S0}/(${Qv}*${Rv}**(1/2)))*(${j}/2)`, derived: [Math.abs(j), 2] } });
    }, { count: 2 }),
    T('logp-change', '밑의 변환 — 이어진 곱과 몫', '②8', (d, n) => {
      // 이어진 곱: log_(g0^a0) g1^b0 × log_(g1^a1) g2^b1 [× log_(g2^a2) g0^b2] = Πb/Πa
      if (d.int(0, 3) === 0) {
        if (n === 0) {
          const b = d.pick([2, 3]), p = d.pick([5, 7].filter((x) => x !== b)), q = d.pick([3, 5, 7].filter((x) => x !== b && x !== p)), e = d.int(2, 4), c = b * p;
          if (ipow(b, e) > 128) return null;
          const h = `${L(b, c)} ${MINUS} ${L(b, p)} + ${L(b, q)} × ${L(q, ipow(b, e))}`;
          return qAns(VAL, 1 + e, { figure: ex1(h), explain: `${L(b, c)} ${MINUS} ${eq(L(b, p), L(b, b))} = 1이고 ${L(b, q)} × ${eq(L(q, ipow(b, e)), L(b, ipow(b, e)))} = ${e}이므로 값은 ${1 + e}이다.`, facts: { value: `1+${e}`, derived: [e] } });
        }
        const g = d.pick([2, 3, 5, 7]), a = d.int(2, 4), c = d.int(2, 4), bse = d.pick([3, 5, 7, 2].filter((x) => x !== g));
        if (a === c || ipow(g, Math.max(a, c)) > 2500) return null;
        const v = Q(a, c);
        return qAns(VAL, v, { figure: ex1(frac(L(bse, ipow(g, a)), L(bse, ipow(g, c)))), explain: `${eq(frac(L(bse, ipow(g, a)), L(bse, ipow(g, c))), frac(a + L(bse, g), c + L(bse, g)))} = ${qh(v)}이다.`, facts: { value: `${a}/${c}`, derived: [a, c] } });
      }
      const len = d.pick([2, 3]), gs = d.shuffle([2, 3, 5, 7]).slice(0, len), as = gs.map(() => d.pick([1, 1, 2, 3])), bs = gs.map(() => d.pick([1, 2, 3, 4, 5]));
      let num0 = 1, den0 = 1;
      as.forEach((x) => { den0 *= x; }); bs.forEach((x) => { num0 *= x; });
      const v = Q(num0, den0);
      if ((n === 0) !== isInt(v) || gs.some((g, i) => ipow(g, as[i]) > 100 || ipow(gs[(i + 1) % len], bs[i]) > 600) || num0 === den0) return null;
      const h = gs.map((g, i) => L(ipow(g, as[i]), ipow(gs[(i + 1) % len], bs[i]))).join(' × ');
      return qAns(VAL, v, {
        figure: ex1(h),
        explain: `밑을 같게 바꾸면 ${gs.map((g, i) => frac(cl(bs[i], gs[(i + 1) % len]), cl(as[i], g))).join(' × ')}이고 약분하면 ${qh(v)}이다.`,
        facts: { value: `${num0}/${den0}`, derived: [num0, den0] }
      });
    }, { count: 2 }),
    T('logp-powbase', '밑이 거듭제곱인 로그 정리하기', '②9', (d, n) => {
      const [p, q] = d.shuffle([2, 3, 5]).slice(0, 2);
      if (n === 0) {
        const a = d.pick([2, 3]), b = d.pick([2, 3, 4, 6]), c = d.pick([2, 3]), e = d.pick([2, 3, 4, 6]), v = qmul(qadd(Q(1), Q(b, a)), qadd(Q(1), Q(e, c)));
        if (!isInt(v) || ipow(p, a) > 125 || ipow(q, b) > 800 || ipow(q, c) > 125 || ipow(p, e) > 800) return null;
        const h = `(${L(p, q)} + ${L(ipow(p, a), ipow(q, b))})(${L(q, p)} + ${L(ipow(q, c), ipow(p, e))})`;
        return qAns(VAL, v.p, { figure: ex1(h), explain: `${eq(L(ipow(p, a), ipow(q, b)), coefH(Q(b, a)) + L(p, q))}, ${eq(L(ipow(q, c), ipow(p, e)), coefH(Q(e, c)) + L(q, p))}이므로 값은 ${qh(qadd(Q(1), Q(b, a)))}${L(p, q)} × ${qh(qadd(Q(1), Q(e, c)))}${eq(L(q, p), v.p)}이다.`, facts: { value: `(1+${b}/${a})*(1+${e}/${c})`, derived: [a, b, c, e] } });
      }
      if (n === 1) {
        // Σ k·log_(p^s) q^t = A·log_p q
        const kinds = [[2, 1], [2, 2], [Q(1, 2), 1], [Q(1, 2), 2], [-1, -1], [-1, 1], [1, 2]];
        const ts = d.shuffle(kinds).slice(0, 3).map(([s, t]) => ({ s: typeof s === 'number' ? Q(s) : s, t, k: d.pick([1, 2, 3, 4]) * (d.bool() ? 1 : -1) }));
        ts[0].k = Math.abs(ts[0].k);
        const A = ts.reduce((acc, x) => qadd(acc, qdiv(Q(x.k * x.t), x.s)), Q(0));
        if (!isInt(A) || A.p === 0) return null;
        const baseH = (s) => (qeq(s, Q(1, 2)) ? R(2, p) : s.p === -1 ? frac(1, p) : String(ipow(p, s.p))), argH = (t) => (t === -1 ? frac(1, q) : String(ipow(q, t)));
        const h = ts.map((x, i) => (i === 0 ? '' : x.k < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(x.k) === 1 ? '' : Math.abs(x.k)) + L(baseH(x.s), argH(x.t))).join('');
        return qAns(`다음 등식을 만족시키는 상수 ${V('A')}의 값은?`, A.p, { signed: true, figure: lines([ex1(h), ex1('= ' + V('A') + L(p, q))]), explain: `${jh(eq(ms('log_{a^m} b^n'), frac(vn, vm) + ms('log_a b')), '을/를')} 쓰면 항마다 ${ts.map((x) => qh(qdiv(Q(x.k * x.t), x.s))).join(', ')}배의 ${L(p, q)}이므로 ${eq(V('A'), num(A.p))}이다.`, facts: { value: ts.map((x) => `+(${x.k})*(${x.t})/(${x.s.p}/${x.s.q})`).join('').slice(1), derived: ts.flatMap((x) => [Math.abs(x.k), Math.abs(x.t), Math.abs(x.s.p), x.s.q]) } });
      }
      const u = d.pick([1, 2]), v = u * d.int(2, 4);
      if (ipow(p, v) > 1000) return null;
      return qAns(`1이 아닌 두 양수 ${va}, ${vb}에 대하여 ${jh(eq(L(ipow(p, u), va), L(ipow(p, v), vb)), '이/가')} 성립할 때, ${L(va, vb)}의 값은?`, v / u, { explain: `${eq(L(ipow(p, v), vb), frac(1, v / u) + L(ipow(p, u), vb))}이므로 ${eq(L(ipow(p, u), vb), (v / u) + L(ipow(p, u), va))}, 곧 ${eq(L(va, vb), frac(L(ipow(p, u), vb), L(ipow(p, u), va)))} = ${v / u}이다.`, facts: { value: `${v}/${u}`, derived: [u, v] } });
    }, { count: 3 }),
    T('logp-recip', '역수 꼴이 섞인 로그 식', '②10 심2', (d, n) => {
      if (n === 0) {
        const a = d.pick([2, 3, 5]), b = d.pick([4, 8, 9, 25, 27].filter((x) => x % a !== 0)), c = d.pick([7, 11, 13]), k = d.pick([2, 3]);
        if (ipow(a, k) > 125) return null;
        const h = `(${L(a, b * c)} ${MINUS} ${frac(1, L(c, a))}) × ${L(b, ipow(a, k))}`;
        return qAns(VAL, k, { figure: ex1(h), explain: `${eq(frac(1, L(c, a)), L(a, c))}이므로 괄호 안은 ${eq(L(a, b * c) + ' ' + MINUS + ' ' + L(a, c), L(a, b))}이다. ${eq(L(b, ipow(a, k)), k + L(b, a))}이므로 값은 ${L(a, b)} × ${k}${eq(L(b, a), k)}이다.`, facts: { value: String(k), derived: [k] } });
      }
      const m = d.pick([6, 10, 12, 15]), v = d.pick([2, 3, 5].filter((x) => m % x === 0)), c = d.pick([1, 2]), e = d.pick([2, 3]), u = ipow(m, e) / ipow(v, c);
      if (!Number.isInteger(u) || u < 2 || u > 600) return null;
      const h = `${L(m, u)} + ${frac(c, L(v, m))}`;
      return qAns(VAL, e, { figure: ex1(h), explain: `${eq(frac(c, L(v, m)), (c === 1 ? '' : c) + L(m, v))}${c === 1 ? '' : ' = ' + L(m, pv(v, c))}이므로 ${eq(h, L(m, u + ' × ' + pv(v, c)))} = ${eq(L(m, ipow(m, e)), e)}이다.`, facts: { value: `(${m})**(${e})/(${u}*${v}**${c})*(${e})`, derived: [e] } });
    }, { count: 2 }),
    T('logp-claim', '로그의 성질 가운데 옳은 것', '②11', (d) => {
      const lgN = (b, x) => Math.log(x) / Math.log(b);
      const M0 = V('M'), N0 = V('N');
      // [글, (a, M, N, k) → [좌변, 우변]]
      const pool = [
        [eq(L(va, va), '1'), (a) => [lgN(a, a), 1]],
        [eq(L(va, '1'), '0'), (a) => [lgN(a, 1), 0]],
        [eq(L(va, M0 + N0), L(va, M0) + ' + ' + L(va, N0)), (a, m, nn) => [lgN(a, m * nn), lgN(a, m) + lgN(a, nn)]],
        [eq(L(va, M0) + ' × ' + L(va, N0), L(va, '(' + M0 + ' + ' + N0 + ')')), (a, m, nn) => [lgN(a, m) * lgN(a, nn), lgN(a, m + nn)]],
        [eq(L(va, frac(M0, N0)), L(va, M0) + ' ' + MINUS + ' ' + L(va, N0)), (a, m, nn) => [lgN(a, m / nn), lgN(a, m) - lgN(a, nn)]],
        [eq(frac(L(va, M0), L(va, N0)), L(va, '(' + M0 + ' ' + MINUS + ' ' + N0 + ')')), (a, m, nn) => [lgN(a, m) / lgN(a, nn), lgN(a, Math.abs(m - nn) + 0.5)]],
        [eq(L(va, PW(M0, vk)), vk + L(va, M0)), (a, m, nn, k) => [lgN(a, Math.pow(m, k)), k * lgN(a, m)]],
        [eq(PW('(' + L(va, M0) + ')', vk), vk + L(va, M0)), (a, m, nn, k) => [Math.pow(lgN(a, m), k), k * lgN(a, m)]],
        [eq(L(va, '(' + M0 + ' + ' + N0 + ')'), L(va, M0) + ' + ' + L(va, N0)), (a, m, nn) => [lgN(a, m + nn), lgN(a, m) + lgN(a, nn)]],
        [eq(L(va, M0), frac(1, L(M0, va))), (a, m) => [lgN(a, m), 1 / lgN(m, a)]]
      ];
      const holds = (f) => [[2.7, 5.3, 1.9, 2.4], [0.4, 7.1, 3.3, -1.5], [9, 2.2, 6.5, 0.5]].every(([a, m, nn, k]) => { const [l, r] = f(a, m, nn, k); return Math.abs(l - r) < 1e-9 * Math.max(1, Math.abs(l)); });
      const rows = d.shuffle(pool).slice(0, 3).map(([h, f]) => [h, holds(f)]);
      return pickSets(d, `${va} &gt; 0, ${va} ≠ 1이고 ${M0} &gt; 0, ${N0} &gt; 0일 때, 다음 보기 가운데 옳은 것만을 있는 대로 고른 것은? (단, ${jh(vk, '은/는')} 실수이고, 밑이 ${M0}인 로그에서는 ${M0} ≠ 1이다.)`, rows, {
        explain: `로그의 성질은 ${eq(ms('log_a 1'), '0')}, ${eq(ms('log_a a'), '1')}, ${eq(L(va, M0 + N0), L(va, M0) + ' + ' + L(va, N0))}, ${eq(L(va, frac(M0, N0)), L(va, M0) + ' ' + MINUS + ' ' + L(va, N0))}, ${eq(L(va, PW(M0, vk)), vk + L(va, M0))}이다. ` + rows.map((r, i) => HAN[i] + (r[1] ? '은 옳다' : '은 옳지 않다')).join(', ') + '.'
      });
    }),
    T('logp-telescope', '이어서 지워지는 로그의 합', '②12', (d, n) => {
      const b = d.pick([2, 3]), e = d.int(1, 3), s = d.int(2, 4);
      const term = (k, minus) => L(b, '(1 ' + (minus ? MINUS : '+') + ' ' + frac(1, k) + ')');
      if (n === 0) {
        const minus = d.bool();
        if (minus) {
          const s2 = s + 1, tt = (s2 - 1) * ipow(b, e);
          if (tt > 90 || tt < s2 + 4) return null;
          const h = [term(s2, true), term(s2 + 1, true), term(s2 + 2, true)].join(' + ') + ' + ⋯ + ' + term(tt, true);
          return qAns(VAL, -e, { signed: true, figure: ex1(h), explain: `${eq('1 ' + MINUS + ' ' + frac(1, vk), frac(ms('k-1'), vk))}이므로 진수를 곱하면 ${frac(s2 - 1, s2)} × ${frac(s2, s2 + 1)} × ⋯ × ${eq(frac(tt - 1, tt), frac(s2 - 1, tt))}이다. 값은 ${eq(L(b, frac(1, ipow(b, e))), MINUS)}${e}이다.`, facts: { value: `0-${e}`, derived: [e] } });
        }
        const tt = s * ipow(b, e) - 1;
        if (tt > 90 || tt < s + 4) return null;
        const h = [term(s, false), term(s + 1, false), term(s + 2, false)].join(' + ') + ' + ⋯ + ' + term(tt, false);
        return qAns(VAL, e, { signed: true, figure: ex1(h), explain: `${eq('1 + ' + frac(1, vk), frac(ms('k+1'), vk))}이므로 진수를 곱하면 ${frac(s + 1, s)} × ${frac(s + 2, s + 1)} × ⋯ × ${eq(frac(tt + 1, tt), frac(tt + 1, s))} = ${ipow(b, e)}이다. 값은 ${e}이다.`, facts: { value: String(e), derived: [e] } });
      }
      const nn = s * ipow(b, e) - 1;
      if (nn > 90 || nn < s + 4) return null;
      const h = [term(s, false), term(s + 1, false), term(s + 2, false)].join(' + ') + ' + ⋯ + ' + L(b, '(1 + ' + frac(1, vn) + ')');
      return qAns(`다음 등식을 만족시키는 자연수 ${vn}의 값은?`, nn, { figure: ex1(h + ' = ' + e), explain: `진수를 곱하면 ${frac(s + 1, s)} × ${frac(s + 2, s + 1)} × ⋯ × ${eq(frac(ms('n+1'), vn), frac(ms('n+1'), s))}이므로 ${eq(L(b, frac(ms('n+1'), s)), e)}, ${eq(ms('n+1'), s * ipow(b, e))}, ${eq(vn, nn)}이다.`, facts: { value: `${s}*${b}**${e}-1` } });
    }, { count: 2 }),
    T('logp-inverse', 'a^(log_a N) = N 을 쓰는 값', '②13', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3, 5, 7]), c = d.pick([2, 3, 5, 6, 7].filter((x) => x !== b));
        return rootAns(`${eq(va, L(b, c))}일 때, ${PW('(' + b + R(2, b) + ')', va)}의 값은?`, 2, c, c, {
          explain: `${eq(b + R(2, b), PW(b, Q(3, 2)))}이므로 ${eq(PW('(' + b + R(2, b) + ')', va), PW(b, B.kit.hs.sfrac(3, 2) + L(b, c)))} = ${PW('(' + PW(b, L(b, c)) + ')', Q(3, 2))} = ${PW(c, Q(3, 2))} = ${c}${R(2, c)}이다.`,
          facts: { calc: [[String(c), 0], [String(c), 1]] }
        });
      }
      const [m, r] = d.pick([[2, 3], [3, 8], [4, 15], [5, 24], [6, 35], [7, 48]]), b = d.pick([2, 3, 5]), [cc, tt] = K.nParts(r, 2);
      const inner = m + ' + ' + (cc === 1 ? '' : cc) + R(2, tt);
      return qAns(`${eq(vx, L(b, '(' + inner + ')'))}일 때, ${PW(b, vx)} + ${PW(b, ms('-x'))}의 값은?`, 2 * m, {
        explain: `${eq(PW(b, vx), inner)}이고 ${eq(PW(b, ms('-x')), frac(1, inner))} = ${m} ${MINUS} ${(cc === 1 ? '' : cc) + R(2, tt)}이므로 값은 ${2 * m}이다.`,
        facts: { value: `2*${m}`, derived: [2] }
      });
    }, { count: 2 })
  ]);
  const cl = (k, x) => (k === 1 ? '' : k) + lg(null, x);                       // k log x(1은 적지 않는다)

  // ── 로그를 문자로 나타내기와 조건식 ──
  B.addTypes(UNIT, 'logexpr', [
    T('logx-linear', '로그를 a, b의 일차식으로', '②16', (d) => {
      const common = d.bool();
      const [p, q, c] = common ? [2, 3, 10] : d.pick([[2, 3, 5], [2, 3, 7], [3, 5, 2], [2, 5, 7]]);
      const i = d.int(-3, 4), j = d.int(-3, 3), k = d.int(-2, 2);
      if ((i === 0 && j === 0) || (i === 0 && k === 0) || (j === 0 && k === 0)) return null;
      const Nq = qmul(qmul(qpowZ(Q(p), i), qpowZ(Q(q), j)), qpowZ(Q(c), k));
      if (Math.max(Nq.p, Nq.q) > 1000 || qeq(Nq, Q(1))) return null;
      const NH = numText(Nq), lead = common ? `${eq(L(null, p), va)}, ${eq(L(null, q), vb)}일 때,` : `${eq(L(c, p), va)}, ${eq(L(c, q), vb)}일 때,`;
      return inline(`${lead} ${jh(L(common ? null : c, NH), '을/를')} ${va}, ${jh(vb, '으로/로')} 나타내시오.${NOTE01}`, `{0}${va} {1}${vb} {2}`, [{ answer: i, signed: true }, { answer: j, signed: true }, { answer: k, signed: true }], {
        shown: linH([i, j, k]),
        explain: `${eq(NH, [i ? pv(p, i) : '', j ? pv(q, j) : '', k ? pv(c, k) : ''].filter(Boolean).join(' × '))}이므로 ${eq(L(common ? null : c, NH), linH([i, j, k]))}이다.`,
        facts: { calc: [[jn(i), 0], [jn(j), 1], [jn(k), 2]], derived: [Math.abs(i), Math.abs(j), Math.abs(k)] }
      });
    }),
    T('logx-frac', '밑을 바꾸어 a, b의 분수식으로', '②17', (d, n) => {
      // 일차식은 [a 의 계수, b 의 계수, 상수항]
      const opts = (right, num0, den0, more) => {
        const cands = [[num0, den0], [den0, num0], [num0.map((x, i) => (i === 2 ? x + 1 : x)), den0], [num0, den0.map((x, i) => (i === 2 ? x - 1 : x))], [[num0[1], num0[0], num0[2]], den0]].concat(more || []);
        const out = [];
        for (const [nn, dd] of cands) { if (dd.every((x) => x === 0)) continue; if (out.some(([a, b]) => sameRatio(a, b, nn, dd))) continue; out.push([nn, dd]); }
        return out.slice(0, 5).map(([nn, dd]) => [ratioH(nn, dd), sameRatio(nn, dd, right[0], right[1])]);
      };
      if (n === 0) {
        const [p, q, c] = d.pick([[2, 3, 7], [2, 3, 5], [2, 3, 10], [2, 5, 3]]);
        const pw3 = () => [d.int(0, 3), d.int(0, 2), d.int(0, 1)], m = pw3(), x = pw3();
        const val = (e) => ipow(p, e[0]) * ipow(q, e[1]) * ipow(c, e[2]);
        if (val(m) < 2 || val(x) < 2 || val(m) > 200 || val(x) > 500 || val(m) === val(x) || m.every((v, i) => v === x[i])) return null;
        if (m.filter(Boolean).length + x.filter(Boolean).length < 3) return null;
        const rows = opts([x, m], x, m);
        const lead = c === 10 ? `${eq(L(null, p), va)}, ${eq(L(null, q), vb)}일 때,` : `${eq(L(c, p), va)}, ${eq(L(c, q), vb)}일 때,`;
        return choose(d, `${lead} ${jh(L(val(m), val(x)), '을/를')} ${va}, ${jh(vb, '으로/로')} 나타낸 것은?`, rows, true, {
          explain: `밑을 ${jh(c, '으로/로')} 바꾸면 ${eq(L(val(m), val(x)), frac(L(c === 10 ? null : c, val(x)), L(c === 10 ? null : c, val(m))))} = ${ratioH(x, m)}이다.`
        });
      }
      // log 2 = a, log 3 = b, log 5 = 1 − a 를 써야 하는 것
      const [M0, half] = d.pick([[5, true], [5, false], [25, false], [20, false], [15, false]]), e2 = d.int(0, 3), e3 = d.int(0, 2), e5 = d.int(0, 2);
      const Nv = ipow(2, e2) * ipow(3, e3) * ipow(5, e5);
      if (Nv < 6 || Nv > 300 || (e2 === 0 && e3 === 0)) return null;
      const lin = (a2, a3, a5) => [a2 - a5, a3, a5];       // log N = a2·a + a3·b + a5·(1 − a)
      const fac = { 5: [0, 0, 1], 25: [0, 0, 2], 20: [2, 0, 1], 15: [0, 1, 1] }[M0], top = lin(e2, e3, e5), bot0 = lin(...fac);
      const top2 = half ? top.map((x) => 2 * x) : top;
      const rows = opts([top2, bot0], top2, bot0, [[top, bot0]]);
      const baseH = half ? R(2, M0) : String(M0);
      return choose(d, `${eq(L(null, 2), va)}, ${eq(L(null, 3), vb)}일 때, ${jh(L(baseH, Nv), '을/를')} ${va}, ${jh(vb, '으로/로')} 나타낸 것은?`, rows, true, {
        explain: `${eq(L(null, 5), L(null, frac(10, 2)))} = 1 ${MINUS} ${va}이다. ${eq(L(baseH, Nv), frac(L(null, Nv), L(null, baseH)))}${half ? '이고 ' + eq(L(null, R(2, 5)), frac(1, 2) + L(null, 5)) : ''}이므로 ${ratioH(top2, bot0)}이다.`
      });
    }, { count: 2 }),
    T('logx-exp', '지수 조건을 로그로 바꾸어 나타내기', '②18', (d) => {
      const c = d.pick([2, 3]), [p, q] = c === 2 ? [3, 5] : [2, 5], common = c === 2 && d.bool();
      const opts = (right) => {
        const [nn, dd] = right, cands = [[nn, dd], [dd, nn], [nn.map((x, i) => (i === 2 ? x - 1 : x)), dd], [[nn[1], nn[0], nn[2]], dd], [nn, dd.map((x, i) => (i === 2 ? x + 1 : x))]], out = [];
        for (const [a, b] of cands) { if (b.every((x) => x === 0) || out.some(([x, y]) => sameRatio(x, y, a, b))) continue; out.push([a, b]); }
        return out.map(([a, b]) => [ratioH(a, b), sameRatio(a, b, nn, dd)]);
      };
      if (common) {
        const e1 = d.int(0, 2), e3 = d.int(1, 2), e5 = d.int(1, 2), Nv = ipow(2, e1) * ipow(3, e3) * ipow(5, e5);
        if (Nv > 300) return null;
        const rows = opts([[e3, e5, e1], [0, 1, 1]]);
        if (rows.length < 4) return null;
        return choose(d, `${eq(PW(2, va), 3)}, ${eq(PW(2, vb), 5)}일 때, ${jh(L(null, Nv), '을/를')} ${va}, ${jh(vb, '으로/로')} 나타낸 것은?`, rows, true, {
          explain: `${eq(va, L(2, 3))}, ${eq(vb, L(2, 5))}이므로 ${eq(L(null, Nv), frac(L(2, Nv), L(2, 10)))} = ${ratioH([e3, e5, e1], [0, 1, 1])}이다.`
        });
      }
      const ei = d.int(1, 2), ep = d.int(0, 2), eq5 = d.int(1, 2), Nv = ipow(c, ei) * ipow(p, ep) * ipow(q, eq5);
      if (Nv > 600) return null;
      const right = [[ep, eq5, ei], [1, 0, 0]], rows = opts(right);
      if (rows.length < 4) return null;
      return choose(d, `${eq(PW(c, va), p)}, ${eq(PW(c, vb), q)}일 때, ${jh(L(p, Nv), '을/를')} ${va}, ${jh(vb, '으로/로')} 나타낸 것은?`, rows, true, {
        explain: `${eq(va, L(c, p))}, ${eq(vb, L(c, q))}이므로 ${eq(L(p, Nv), frac(L(c, Nv), L(c, p)))} = ${ratioH(right[0], right[1])}이다.`
      });
    }),
    T('logx-sym', '로그 조건 두 개에서 대칭식의 값', '②19', (d) => {
      const c = d.pick([2, 3]), s = d.int(2, 4), t = d.int(1, 2 * s - 2), S0 = ipow(c, s), P0 = ipow(c, t), kind = d.int(0, 2);
      if (S0 * S0 < 4 * P0 || S0 * S0 === 4 * P0) return null;
      const [askH, v, js] = [[ms('x^2 + y^2'), S0 * S0 - 2 * P0, `${c}**(2*${s})-2*${c}**${t}`], [ms('(x - y)^2'), S0 * S0 - 4 * P0, `${c}**(2*${s})-4*${c}**${t}`], [ms('x^3 + y^3'), S0 * S0 * S0 - 3 * P0 * S0, `${c}**(3*${s})-3*${c}**(${t}+${s})`]][kind];
      if (v > 9999) return null;
      return qAns(`두 양수 ${vx}, ${jh(vy, '이/가')} ${eq(L(c, '(' + vx + ' + ' + vy + ')'), s)}, ${jh(eq(L(c, vx) + ' + ' + L(c, vy), t), '을/를')} 만족시킬 때, ${askH}의 값은?`, v, {
        explain: `${eq(vx + ' + ' + vy, PW(c, s))} = ${S0}, ${eq(vx + vy, PW(c, t))}${t === 1 ? '' : ' = ' + P0}이므로 ${askH} = ${v}이다.`,
        facts: { value: js, derived: [2, 3, 4] }
      });
    }),
    T('logx-sys', 'log x, log y 를 미지수로 연립하기', '②20', (d) => {
      const c = d.pick([2, 3, 5, 7]), s = d.int(2, 7), dd = d.int(1, 5), al = d.int(1, 6), be = d.int(1, 6) * d.pick([1, -1]);
      if ((s + dd) % 2 || ipow(c, s) > 2500 || ipow(c, dd) > 500) return null;
      const u = (s + dd) / 2, w = (s - dd) / 2, v = al * u + be * w;
      return qAns(`두 양수 ${vx}, ${vy}에 대하여 ${eq(vx + vy, ipow(c, s))}, ${eq(frac(vx, vy), ipow(c, dd))}일 때, ${(al === 1 ? '' : al) + L(c, vx)} ${be < 0 ? MINUS : '+'} ${(Math.abs(be) === 1 ? '' : Math.abs(be)) + L(c, vy)}의 값은?`, v, {
        signed: true, explain: `${eq(L(c, vx) + ' + ' + L(c, vy), s)}, ${eq(L(c, vx) + ' ' + MINUS + ' ' + L(c, vy), dd)}이므로 ${eq(L(c, vx), qh(Q(s + dd, 2)))}, ${eq(L(c, vy), qh(Q(s - dd, 2)))}이다. 값은 ${num(v)}이다.`,
        facts: { value: `${al}*(${s}+${dd})/2+(${be})*(${s}-${dd})/2`, derived: [s, dd, 2] }
      });
    }),
    T('logx-vieta', '이차방정식의 두 근이 로그일 때', '②21', (d) => {
      const S0 = d.int(-6, 6), P0 = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), common = d.bool(), sq = d.bool();
      if (S0 === 0 || S0 * S0 < 4 * P0) return null;
      const v = Q((sq ? 2 : 1) * (S0 * S0 - 2 * P0), P0);
      if (isInt(v)) return null;
      const r1 = common ? L(null, va) : L(2, va), r2 = common ? L(null, vb) : L(2, vb);
      const eqH = `${ms('x^2')} ${S0 > 0 ? MINUS : '+'} ${Math.abs(S0) === 1 ? '' : Math.abs(S0)}${vx} ${P0 < 0 ? MINUS : '+'} ${Math.abs(P0)} = 0`;
      const ask = sq ? `${L(va, ms('b^2'))} + ${L(vb, ms('a^2'))}` : `${L(va, vb)} + ${L(vb, va)}`;
      return qAns(`이차방정식 ${eqH}의 두 근이 ${r1}, ${r2}일 때, ${ask}의 값은?`, v, {
        signed: true, explain: `${eq(r1 + ' + ' + r2, num(S0))}, ${eq(r1 + ' × ' + r2, num(P0))}이다. ${eq(ask, (sq ? '2' : '') + '(' + frac(r2, r1) + ' + ' + frac(r1, r2) + ')')} = ${sq ? '2 × ' : ''}${frac('(' + num(S0) + ')' + sup(2) + ' ' + MINUS + ' 2 × (' + num(P0) + ')', num(P0))} = ${qh(v)}이다.`,
        facts: { value: `${sq ? 2 : 1}*((${S0})*(${S0})-2*(${P0}))/(${P0})`, derived: [2] }
      });
    }),
    T('logx-ratio', 'log_a c : log_b c 의 비에서', '②22', (d) => {
      const m = d.int(1, 6), n0 = d.int(2, 7);
      if (gcd(m, n0) !== 1 || m === n0) return null;
      const v = Q(m * m + n0 * n0, m * n0);
      return qAns(`1보다 큰 세 실수 ${va}, ${vb}, ${vc}에 대하여 ${L(va, vc)} : ${eq(L(vb, vc), m + ' : ' + n0)}일 때, ${L(va, vb)} + ${L(vb, va)}의 값은?`, v, {
        explain: `${eq(frac(L(va, vc), L(vb, vc)), frac(L(null, vb), L(null, va)))} = ${frac(m, n0)}이므로 ${eq(L(va, vb), frac(m, n0))}, ${eq(L(vb, va), frac(n0, m))}이다. 합은 ${qh(v)}이다.`,
        facts: { value: `${m}/${n0}+${n0}/${m}` }
      });
    }),
    T('logx-mn', 'log_(aⁿ) bᵐ 조건 두 개에서', '②23', (d) => {
      const P0 = d.pick([2, 3, 4, 6]), j = d.pick([1, 3, -1]), R0 = j > 0 ? P0 * ipow(2, j) : P0 / 2;
      if (!Number.isInteger(R0) || R0 > 64) return null;
      const v = Q(j, 2);
      return qAns(`1보다 큰 네 실수 ${va}, ${vb}, ${vm}, ${vn}에 대하여 ${eq(L(PW(va, vn), PW(vb, vm)), P0)}, ${eq(L(PW(va, vm), PW(vb, vn)), R0)}일 때, ${L(2, frac(vn, vm))}의 값은?`, v, {
        signed: true, explain: `${eq(frac(vm, vn) + ms('log_a b'), P0)}, ${eq(frac(vn, vm) + ms('log_a b'), R0)}이므로 둘째 식을 첫째 식으로 나누면 ${eq(PW('(' + frac(vn, vm) + ')', 2), frac(R0, P0))} = ${pv(2, j)}이다. ${frac(vn, vm)} &gt; 0이므로 ${eq(L(2, frac(vn, vm)), qh(v))}이다.`,
        facts: { value: `${j}/2`, derived: [Math.abs(j), 2] }
      });
    })
  ]);

  // ── 상용로그 ──
  // 상용로그표 한 줄: 1.00 ~ 9.99 의 수 x(백분의 일 단위 정수)의 상용로그(만분의 일 단위)
  const tbl = (h) => r4(h / 100);
  B.addTypes(UNIT, 'common', [
    T('clog-pow10', '10의 거듭제곱 꼴 수의 상용로그', '②24', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 3), k = d.pick([-4, -3, -2, 2, 3, 4]);
        let xH, xJ, v = k;
        if (kind === 0) { xH = k > 0 ? String(ipow(10, k)) : (1 / ipow(10, -k)).toFixed(-k); xJ = xH; }
        else if (kind === 1) { if (k > 0) return null; xH = frac(1, ipow(10, -k)); xJ = `(1/${ipow(10, -k)})`; }
        else if (kind === 2) { const m = d.pick([2, 3]), e = m * d.int(1, 2); xH = R(m, ipow(10, e)); xJ = `${ipow(10, e)}**(1/${m})`; v = e / m; }
        else { xH = frac(1, R(2, 100)); xJ = '(1/100**(1/2))'; v = -1; }
        return qAns(`${L(null, xH)}의 값은?`, v, { signed: true, explain: `${eq(xH, PW(10, v))}이므로 ${eq(L(null, xH), num(v))}이다.`, facts: { value: `10**(${v})/(${xJ})*(${v})`, derived: [Math.abs(v), 2, 3, 10, 100] } });
      }
      const kind = d.int(0, 2);
      let xH, xJ, v;
      if (kind === 0) { const s = d.pick([2, 3]), r = d.pick([1, 2, 4, 5].filter((x) => x % s !== 0)); xH = R(s, r === 1 ? 10 : ipow(10, r)); xJ = `${ipow(10, r)}**(1/${s})`; v = Q(r, s); }
      else if (kind === 1) { const w = d.int(1, 2), s = d.pick([2, 3]), r = d.int(1, s - 1); xH = ipow(10, w) + R(s, ipow(10, r)); xJ = `${ipow(10, w)}*${ipow(10, r)}**(1/${s})`; v = Q(w * s + r, s); }
      else { const s = d.pick([2, 3]), r = d.int(1, s - 1); xH = frac(1, R(s, ipow(10, r))); xJ = `(1/${ipow(10, r)}**(1/${s}))`; v = Q(-r, s); }
      return qAns(`${L(null, xH)}의 값은?`, v, { signed: true, explain: `${eq(xH, PW(10, v))}이므로 ${eq(L(null, xH), qh(v))}이다.`, facts: { value: `10**(${v.p}/${v.q})/(${xJ})*(${v.p}/${v.q})`, derived: [Math.abs(v.p), v.q, 2, 3, 10] } });
    }, { count: 2 }),
    T('clog-table', '상용로그표 읽기', '②25', (d) => {
      const row0 = d.int(10, 97), cols = [0, 1, 2], rows = [row0, row0 + 1, row0 + 2];
      const cell = (r, c) => tbl(r * 10 + c);
      const head = '<tr><th>수</th> ' + cols.map((c) => '<th>' + c + '</th>').join(' ') + '</tr>';
      const body = rows.map((r) => '<tr><th>' + (r / 10).toFixed(1) + '</th> ' + cols.map((c) => '<td>.' + String(cell(r, c)).padStart(4, '0') + '</td>').join(' ') + '</tr>').join(' ');
      const said = '상용로그표: ' + rows.map((r) => cols.map((c) => `log ${((r * 10 + c) / 100).toFixed(2)} = ${f4(cell(r, c))}`).join(', ')).join(', ');
      const fig = `<table class="mb-table" style="font-size:0.9rem" aria-label="${said}"><tbody>${head} ${body}</tbody></table>`;
      const rr = d.pick(rows), cc = d.int(1, 2), right = cell(rr, cc);
      const cands = [[rr, cc], [rr, 3 - cc], [rows[(rows.indexOf(rr) + 1) % 3], cc], [rows[(rows.indexOf(rr) + 2) % 3], cc], [rr, 0]];
      const vals = [...new Set(cands.map(([r, c]) => cell(r, c)))];
      if (vals.length < 4) return null;
      const opts = d.shuffle(vals.slice(0, 5));
      return C(`다음 상용로그표를 이용하여 구한 ${L(null, ((rr * 10 + cc) / 100).toFixed(2))}의 값은?`, opts.map(f4), opts.indexOf(right), {
        figure: fig, explain: `${((rr / 10)).toFixed(1)}의 가로줄과 ${cc}의 세로줄이 만나는 곳의 수를 읽으면 ${f4(right)}이다.`,
        facts: { pick: { expr: f4(right), options: opts.map((v) => v / 10000) } }
      });
    }),
    T('clog-shift', '자릿수만 다른 수의 상용로그', '②26', (d, n) => {
      const h = d.int(101, 998), v = tbl(h), mt0 = d2(h);
      if (h % 10 === 0) return null;
      const given = `${eq(L(null, mt0), f4(v))}`;
      let ask, right, wrong;
      if (n === 0) {
        const kind = d.int(0, 2);
        if (kind === 0) { const k = d.int(1, 3); ask = L(null, (h * ipow(10, k) / 100).toFixed(Math.max(0, 2 - k))); right = v + 10000 * k; wrong = [v + 10000 * (k - 1), v + 10000 * (k + 1), v, 10000 * k - v]; }
        else if (kind === 1) { if (v % 2) return null; const j = d.int(1, 2); ask = L(null, R(2, String(h * ipow(10, 2 * j) / 100).replace(/\.0+$/, ''))); right = (v + 20000 * j) / 2; wrong = [v + 20000 * j, (v + 10000 * j) / 2, (v + 20000 * j) / 2 + 10000, v / 2 + 10000 * j * 2].map(Math.round); }
        else { const h2 = d.int(101, 998), k = d.int(1, 2), v2 = tbl(h2); if (h2 % 10 === 0 || h2 === h) return null; ask = L(null, '(' + (h * 10 ** k / 100).toFixed(2 - k) + ' × ' + d2(h2) + ')'); right = v + v2 + 10000 * k; wrong = [v + v2 + 10000 * (k - 1), v + v2 + 10000 * (k + 1), Math.abs(v - v2) + 10000 * k]; return clogPick(d, `${given}, ${eq(L(null, d2(h2)), f4(v2))}일 때, ${ask}의 값은?`, right, wrong, `${eq(ask, L(null, PW(10, k)) + ' + ' + L(null, mt0) + ' + ' + L(null, d2(h2)))} = ${k} + ${f4(v)} + ${f4(v2)} = ${f4(right)}이다.`); }
      } else {
        if (d.bool()) { const k = d.int(1, 3); ask = L(null, (h / 100 / ipow(10, k)).toFixed(2 + k)); right = v - 10000 * k; wrong = [-(v + 10000 * k), v - 10000 * (k - 1), v - 10000 * (k + 1), -(v + 10000 * (k - 1))]; }
        else { ask = L(null, frac(1, mt0)); right = -v; wrong = [v, 10000 - v, -(10000 - v), -v - 10000]; }
      }
      return clogPick(d, `${given}일 때, ${ask}의 값은?`, right, wrong, `${jh(ask, '을/를')} ${jh(L(null, mt0), '과/와')} 10의 거듭제곱의 상용로그로 나누어 셈하면 ${f4(right)}이다.`);
    }, { count: 2 }),
    T('clog-23', 'log 2, log 3 의 값으로 상용로그 구하기', '②27', (d, n) => {
      const L2 = 3010, L3 = 4771, L5 = 10000 - L2;
      const i = d.int(0, 3), j = d.int(0, 2), k = d.int(-3, 1), l = n === 1 ? d.int(1, 2) : 0;
      if (i + j + l < 2) return null;
      const Nq = qmul(qmul(qmul(qpowZ(Q(2), i), qpowZ(Q(3), j)), qpowZ(Q(5), l)), qpowZ(Q(10), k));
      if (Math.max(Nq.p, Nq.q) > 1000 || (Nq.q !== 1 && !/^\d+\.\d+$/.test(numText(Nq)))) return null;
      const right = i * L2 + j * L3 + l * L5 + 10000 * k;
      const wrong = [right + 10000, right - 10000, j * L2 + i * L3 + l * L5 + 10000 * k, i * L2 + j * L3 + l * (L2 + L3) + 10000 * k, right + l * (L2 - L5)];
      return clogPick(d, `${eq(L(null, 2), '0.3010')}, ${eq(L(null, 3), '0.4771')}일 때, ${L(null, numText(Nq))}의 값은?`, right, wrong.filter((w) => w !== right), 'clog-23#' + n, `${eq(numText(Nq), [i ? pv(2, i) : '', j ? pv(3, j) : '', l ? pv(5, l) : '', k ? PW(10, k) : ''].filter(Boolean).join(' × '))}${l ? '이고 ' + eq(L(null, 5), '1 ' + MINUS + ' ' + L(null, 2)) : ''}이므로 값은 ${f4(right)}이다.`);
    }, { count: 2 }),
    T('clog-back', '상용로그의 값에서 진수 구하기', '②28', (d) => {
      const h = d.int(101, 998), v = tbl(h), k = d.pick([2, 3]), Nv = h * ipow(10, k) / 100;
      if (h % 10 === 0 || Nv > 9999) return null;
      return qAns(`${eq(L(null, d2(h)), f4(v))}일 때, ${eq(L(null, V('N')), jh(f4(v + 10000 * k), '을/를'))} 만족시키는 ${V('N')}의 값은?`, Nv, {
        explain: `${eq(L(null, V('N')), k)} + ${f4(v)} = ${L(null, PW(10, k))} + ${eq(L(null, d2(h)), L(null, '(' + PW(10, k) + ' × ' + d2(h) + ')'))}이므로 ${eq(V('N'), Nv)}이다.`,
        facts: { value: `${d2(h)}*10**${k}`, derived: [10] }
      });
    }),
    T('clog-back-neg', '음수인 상용로그의 값에서 진수 구하기', '②29', (d) => {
      const h = d.int(101, 998), v = tbl(h), k = d.int(1, 3);
      if (h % 10 === 0) return null;
      const right = -k, shownV = v - 10000 * k, nt = (e) => (h / 100 * Math.pow(10, e)).toFixed(Math.max(0, 2 - e));
      const exps = [-k, -k + 1, -k - 1, k];
      const opts = d.shuffle(exps), texts = opts.map(nt);
      if (new Set(texts).size !== 4) return null;
      return C(`${eq(L(null, d2(h)), f4(v))}일 때, ${eq(L(null, vx), jh(f4(shownV), '을/를'))} 만족시키는 ${vx}의 값은?`, texts, opts.indexOf(right), {
        explain: `${f4(shownV)} = ${MINUS}${k} + ${f4(v)}이므로 ${eq(L(null, vx), L(null, '(' + PW(10, -k) + ' × ' + d2(h) + ')'))}, ${eq(vx, nt(-k))}이다.`,
        facts: { truth: opts.map((e) => e === right), want: true }
      });
    }),
    T('clog-power', '상용로그로 거듭제곱·거듭제곱근의 값 구하기', '②30', (d, n) => {
      if (n === 0) {
        const [h1, deg, h2, kk, v1, v2] = d.until(() => {
          const a = d.int(101, 998), dg = d.pick([3, 4, 5]), Mv = Math.pow(a / 100, dg), k0 = Math.floor(Math.log10(Mv)), b = Math.round(Mv / Math.pow(10, k0) * 100);
          return [a, dg, b, k0, tbl(a), b >= 100 && b <= 999 ? tbl(b) : -1];
        }, ([a, dg, b, k0, x1, x2]) => x2 >= 0 && a % 10 !== 0 && b % 10 !== 0 && dg * x1 === k0 * 10000 + x2 && k0 >= 2 && b * ipow(10, k0) / 100 <= 99999);
        const inner = String(h2 * ipow(10, kk) / 100).replace(/\.0+$/, '');
        const opts = d.shuffle([0, 1, -1, 'm']).map((e) => (e === 'm' ? d2(h2) : (h1 / 100 * Math.pow(10, e)).toFixed(Math.max(0, 2 - e))));
        if (new Set(opts).size !== 4) return null;
        return C(`${eq(L(null, d2(h1)), f4(v1))}, ${eq(L(null, d2(h2)), f4(v2))}일 때, ${R(deg, inner)}의 값은?`, opts, opts.indexOf(d2(h1)), {
          explain: `${eq(L(null, R(deg, inner)), frac(1, deg) + L(null, inner))} = ${frac(1, deg)}(${kk} + ${f4(v2)}) = ${f4(v1)} = ${L(null, d2(h1))}이므로 값은 ${d2(h1)}이다.`,
          facts: { truth: opts.map((t) => t === d2(h1)), want: true }
        });
      }
      const [h1, j, p, E, w, c] = d.until(() => {
        const a = d.int(101, 998), jj = d.pick([0, 1]), pp = d.int(5, 12), total = pp * (tbl(a) + 10000 * jj), e = Math.floor(total / 10000), ww = total - 10000 * e;
        let cc = -1; for (let x = 100; x <= 999; x += 1) if (tbl(x) === ww) { cc = x; break; }
        return [a, jj, pp, e, ww, cc];
      }, ([a, , , , , cc]) => cc > 0 && a % 10 !== 0 && cc % 10 !== 0);
      const base = (h1 / 100 * Math.pow(10, j)).toFixed(2 - j), sci = (m, e) => `${m} × ${PW(10, e)}`;
      const cands = [[d2(c), E], [d2(c), E - 1], [d2(c), E + 1], [d2(h1), E]];
      const opts = d.shuffle(cands);
      if (new Set(opts.map((x) => x.join())).size !== 4) return null;
      return C(`${eq(L(null, d2(h1)), f4(tbl(h1)))}, ${eq(L(null, d2(c)), f4(w))}일 때, ${PW(base, p)}의 값은?`, opts.map(([m, e]) => sci(m, e)), opts.findIndex(([m, e]) => m === d2(c) && e === E), {
        explain: `${eq(L(null, PW(base, p)), p + ' × ' + f4(tbl(h1) + 10000 * j))} = ${f4(p * (tbl(h1) + 10000 * j))} = ${E} + ${f4(w)}이므로 값은 ${sci(d2(c), E)}이다.`,
        facts: { truth: opts.map(([m, e]) => m === d2(c) && e === E), want: true }
      });
    }, { count: 2 }),
    T('clog-intcond', 'log x 의 범위와 정수 조건', '②31', (d) => {
      const kind = d.bool();
      // c·log x : kind → p·log x − log ᵠ√x(= (p − 1/q)log x), 아니면 log x^p − log (1/x)(= (p + 1)log x)
      const p = d.int(2, 3), q = d.pick([2, 3]), c = kind ? qsub(Q(p), Q(1, q)) : Q(p + 1), lo = d.int(0, 1), hi = lo + d.int(1, 2), incl = !kind && d.bool();
      const lowN = qmul(c, Q(lo)), highN = qmul(c, Q(hi)), ns = [];
      for (let t = Math.floor(lowN.p / lowN.q) - 1; t <= Math.ceil(highN.p / highN.q) + 1; t += 1) { const okLo = incl ? qsub(Q(t), lowN).p >= 0 : qsub(Q(t), lowN).p > 0; if (okLo && qsub(Q(t), highN).p < 0 && t !== 0) ns.push(t); }
      if (ns.length < 2 || ns.length > 6) return null;
      const sumq = ns.reduce((acc, t) => qadd(acc, qdiv(Q(t), c)), Q(0));
      if (!isInt(sumq)) return null;
      const expr = kind ? `${p}${L(null, vx)} ${MINUS} ${L(null, R(q, vx))}` : `${L(null, PW(vx, p))} ${MINUS} ${L(null, frac(1, vx))}`;
      return qAns(`${expr}의 값이 정수가 되도록 하는 모든 실수 ${vx}의 값의 곱을 ${vk}라 할 때, ${L(null, vk)}의 값은? (단, ${lo} ${incl ? '≤' : '&lt;'} ${L(null, vx)} &lt; ${hi})`, sumq.p, {
        signed: true, explain: `${eq(expr, qh(c) + L(null, vx))}이고 ${qh(qmul(c, Q(lo)))} ${incl ? '≤' : '&lt;'} ${qh(c)}${L(null, vx)} &lt; ${qh(qmul(c, Q(hi)))}이므로 ${qh(c)}${jh(L(null, vx), '은/는')} ${ns.join(', ')}이다. ${jh(L(null, vk), '은/는')} ${L(null, vx)}의 값의 합 ${ns.map((t) => qh(qdiv(Q(t), c))).join(' + ')} = ${num(sumq.p)}이다.`,
        facts: { value: ns.map((t) => `${t}/(${c.p}/${c.q})`).join('+'), derived: ns.concat([c.p, c.q]) }
      });
    }),
    T('clog-formula', '상용로그 공식에 넣어 값 구하기', '②33', (d) => {
      const k = d.int(1, 3), Mv = d.int(-6, 4), m = Mv + 5 * k - 5;
      return qAns(`지구로부터의 거리가 ${vx}광년인 별의 겉보기 등급을 ${vm}, 절대 등급을 ${V('M')}이라 하면 ${jh(eq(vm + ' ' + MINUS + ' ' + V('M'), '5' + L(null, vx) + ' ' + MINUS + ' 5'), '이/가')} 성립한다. 지구로부터의 거리가 ${ipow(10, k)}광년인 별의 절대 등급이 ${num(Mv)}일 때, 이 별의 겉보기 등급은?`, m, {
        signed: true, explain: `${eq(vm + ' ' + MINUS + ' ' + (Mv < 0 ? '(' + num(Mv) + ')' : Mv), '5' + L(null, ipow(10, k)) + ' ' + MINUS + ' 5')} = ${5 * k - 5}이므로 ${eq(vm, num(m))}이다.`,
        facts: { value: `(${Mv})+5*${k}-5`, derived: [k] }
      });
    }),
    T('clog-db', '소리의 크기와 지진의 규모', '②34 ②37', (d, n) => {
      if (n === 0) {
        const D2 = 10 * d.int(3, 8), D1 = D2 + 10 * d.int(1, 3), v = ipow(10, (D1 - D2) / 10);
        return qAns(`소리의 세기가 ${V('I')} W/m²일 때 소리의 크기 ${V('D')} dB은 ${eq(V('D'), '10' + L(null, frac(V('I'), PW(10, -12))))}이라 한다. 소리의 크기가 ${D1} dB인 소리의 세기는 ${D2} dB인 소리의 세기의 몇 배인가?`, v, {
          unit: '배', explain: `두 소리의 세기를 ${ms('I_1')}, ${ms('I_2')}라 하면 ${eq('10' + L(null, frac(ms('I_1'), PW(10, -12))) + ' ' + MINUS + ' 10' + L(null, frac(ms('I_2'), PW(10, -12))), '10' + L(null, frac(ms('I_1'), ms('I_2'))))} = ${D1 - D2}이므로 ${eq(frac(ms('I_1'), ms('I_2')), PW(10, (D1 - D2) / 10))}${D1 - D2 === 10 ? '' : ' = ' + v}이다.`,
          facts: { value: `10**((${D1}-${D2})/10)` }
        });
      }
      const dm = d.pick([1, 3]), M2 = d.int(30, 55) / 10, M1 = Math.round((M2 + dm) * 10) / 10;
      return inline(`지진이 일어난 곳에서 100 km 떨어진 곳에서 잰 지진파의 최대 진폭이 ${V('I')} μm일 때 지진의 규모 ${jh(V('M'), '은/는')} ${eq(V('M'), L(null, V('I')))}이고, 규모가 ${V('M')}인 지진의 에너지 ${jh(V('E'), '은/는')} ${jh(eq(L(null, V('E')), '11.8 + 1.5' + V('M')), '을/를')} 만족시킨다. 규모 ${M1.toFixed(1)}인 지진은 규모 ${M2.toFixed(1)}인 지진보다 최대 진폭이 몇 배이고, 에너지는 10의 몇 제곱 배인지 차례로 구하시오.`, `최대 진폭 {0}배, 에너지 ${nb('10<sup>{1}</sup>배')}`, [{ answer: ipow(10, dm) }, { answer: 1.5 * dm, decimal: true }], {
        shown: `최대 진폭 ${ipow(10, dm)}배, 에너지 ${PW(10, String(1.5 * dm))}배`,
        explain: `규모의 차가 ${dm}이므로 최대 진폭의 비는 ${dm === 1 ? '10' : PW(10, dm) + ' = ' + ipow(10, dm)}이다. ${L(null, ms('E_1')) + ' ' + MINUS + ' ' + L(null, ms('E_2'))} = 1.5 × ${dm} = ${1.5 * dm}이므로 에너지의 비는 ${PW(10, String(1.5 * dm))}이다.`,
        facts: { calc: [[`10**${dm}`, 0], [`1.5*${dm}`, 1]], derived: [dm, 10] }
      });
    }, { count: 2 }),
    T('clog-star', '별의 밝기와 등급', '②34', (d) => {
      const j = d.int(1, 3), k = d.int(0, 2), m1 = d.int(-150, 150) / 100, diff = 2.5 * k + 0.75 * j, m2 = Math.round((m1 + diff) * 100) / 100, v = ipow(2, j) * ipow(10, k);
      const t = (x) => (x < 0 ? MINUS : '') + Math.abs(x).toFixed(2);
      return qAns(`밝기가 ${ms('l_1')}, 겉보기 등급이 ${ms('m_1')}인 별과 밝기가 ${ms('l_2')}, 겉보기 등급이 ${ms('m_2')}인 별에 대하여 ${jh(eq(ms('m_2 - m_1'), '2.5' + L(null, frac(ms('l_1'), ms('l_2')))), '이/가')} 성립한다. 겉보기 등급이 ${t(m1)}인 별의 밝기는 겉보기 등급이 ${t(m2)}인 별의 밝기의 몇 배인가? (단, ${jh(eq(L(null, 2), '0.3'), '으로/로')} 계산한다.)`, v, {
        unit: '배', explain: `${eq('2.5' + L(null, frac(ms('l_1'), ms('l_2'))), t(m2) + ' ' + MINUS + ' ' + (m1 < 0 ? '(' + t(m1) + ')' : t(m1)))} = ${diff.toFixed(2)}이므로 ${eq(L(null, frac(ms('l_1'), ms('l_2'))), (k + 0.3 * j).toFixed(1))}${k ? ' = ' + k + ' + ' + (0.3 * j).toFixed(1) + ' = ' + L(null, pv(10, k)) + ' + ' + L(null, ipow(2, j)) : ' = ' + L(null, ipow(2, j))}이다. 따라서 ${v}배이다.`,
        facts: { value: `2**${j}*10**${k}`, derived: [j, k, 10] }
      });
    }),
    T('clog-dist', '거리의 제곱이 든 공식', '②34', (d) => {
      const P2 = d.int(5, 20) / 10, t = d.int(1, 2), P1 = Math.round((P2 + 2 * t) * 10) / 10;
      return qAns(`어느 광원에서 ${V('d')} m 떨어진 곳에서 사람이 느끼는 감각 강도를 ${V('P')}라 하면 ${eq(V('P'), L(null, frac(V('h'), ms('d^2'))))}(${jh(V('h'), '은/는')} 양의 상수)가 성립한다. 감각 강도가 ${P1.toFixed(1)}일 때의 광원과의 거리는 감각 강도가 ${P2.toFixed(1)}일 때의 광원과의 거리의 몇 배인가?`, Q(1, ipow(10, t)), {
        unit: '배', explain: `두 거리를 ${ms('d_1')}, ${ms('d_2')}라 하면 ${eq(L(null, frac(ms('d_2^2'), ms('d_1^2'))), P1.toFixed(1) + ' ' + MINUS + ' ' + P2.toFixed(1))} = ${2 * t}이므로 ${eq(frac(ms('d_1'), ms('d_2')), frac(1, pv(10, t)))}이다.`,
        facts: { value: `1/10**((${P1.toFixed(1)}-${P2.toFixed(1)})/2)`, derived: [10, 2] }
      });
    }),
    T('clog-ph', 'pH와 감각의 양 — 상용로그의 차', '②36 ②34', (d, n) => {
      if (n === 0) {
        const [c, lc] = d.pick([[2, 3], [4, 6], [5, 7], [8, 9]]), p1 = d.int(25, 60) / 10, more = d.bool(), p2 = Math.round((more ? p1 - lc / 10 : p1 + lc / 10) * 10) / 10;
        if (Number.isInteger(p2)) return null;
        return D(`용액의 수소 이온 농도가 ${V('x')} mol/L일 때 ${eq('pH', MINUS + L(null, vx))}이다. pH가 ${p1.toFixed(1)}인 용액 A가 있고, 용액 B의 수소 이온 농도는 A의 ${more ? c + '배' : frac(1, c) + '배'}일 때, 용액 B의 pH는? (단, ${jh(eq(L(null, 2), '0.3'), '으로/로')} 계산한다.)`, p2, {
          explain: `A의 수소 이온 농도를 ${vx}라 하면 B의 pH는 ${MINUS}${eq(L(null, '(' + (more ? c : frac(1, c)) + vx + ')'), p1.toFixed(1))} ${more ? MINUS : '+'} ${L(null, c)}이다. ${eq(L(null, c), (lc / 10).toFixed(1))}이므로 ${p2.toFixed(1)}이다.`,
          facts: { value: `${p1.toFixed(1)}${more ? '-' : '+'}0.${lc}`, derived: [lc / 10] }
        });
      }
      const k = d.int(1, 4), Sk = d.pick([5, 2, 3, 4].filter((x) => k % x !== 0));
      return qAns(`어떤 자극의 양 ${jh(V('I'), '과/와')} 감각의 양 ${V('S')} 사이에 ${eq(Sk + V('S'), L(null, V('I')))}인 관계가 있다고 한다. 자극의 양이 ${ipow(10, k)}배가 되면 감각의 양은 얼마만큼 늘어나는가?`, Q(k, Sk), {
        explain: `${eq(Sk + ms("S'"), L(null, ipow(10, k) + V('I')))} = ${k} + ${L(null, V('I'))}이므로 ${eq(Sk + '(' + ms("S' - S") + ')', k)}, 곧 ${qh(Q(k, Sk))}만큼 늘어난다.`,
        facts: { value: `${k}/${Sk}`, derived: [k] }
      });
    }, { count: 2 }),
    T('clog-growth', '일정한 비율로 늘거나 줄 때', '②35', (d, n) => {
      if (n === 0) {
        const [steps, factor] = d.pick([[7, Q(1, 5)], [4, Q(2, 5)], [3, Q(1, 2)], [10, Q(1, 10)], [13, Q(1, 20)]]), B0 = d.pick([1000, 2000, 4000, 5000]), v = qmul(Q(B0), factor);
        if (!isInt(v)) return null;
        return qAns(`빛이 어떤 유리판을 한 장 지날 때마다 밝기가 20 %씩 줄어든다고 한다. 밝기가 ${B0} lx인 빛이 이 유리판을 ${steps}장 지났을 때의 밝기는? (단, ${jh(eq(L(null, 2), '0.3'), '으로/로')} 계산한다.)`, v.p, {
          unit: 'lx', explain: `밝기는 ${B0} × ${PW('0.8', steps)}이다. ${eq(L(null, '0.8'), '3' + L(null, 2) + ' ' + MINUS + ' 1')} = ${MINUS}0.1이므로 ${eq(L(null, PW('0.8', steps)), MINUS + (steps / 10).toFixed(1))}이고, ${eq(PW('0.8', steps), qh(factor))}이다. 따라서 ${v.p} lx이다.`,
          facts: { value: `${B0}*${factor.p}/${factor.q}`, derived: [factor.p, factor.q] }
        });
      }
      const [g, steps, w, c] = d.until(() => {
        const gg = d.pick([11, 12, 13, 15]), st = d.int(5, 12), total = st * tbl(gg * 10), e = Math.floor(total / 10000), ww = total - 10000 * e;
        let cc = -1; for (let x = 100; x <= 999; x += 1) if (tbl(x) === ww) { cc = x; break; }
        return [gg, st, ww, e === 0 ? cc : -1];
      }, ([, , , cc]) => cc > 0 && cc % 10 !== 0);
      const rate = Math.round((g - 10) * 10);
      const opts = d.shuffle([0, 1, -1, 'g']).map((e) => (e === 'g' ? (g / 10 * steps).toFixed(1) : (c / 100 * Math.pow(10, e)).toFixed(Math.max(0, 2 - e))));
      if (new Set(opts).size !== 4) return null;
      return C(`어느 미생물의 수가 매시간 ${rate} %씩 일정하게 늘어난다고 한다. ${steps}시간 뒤 미생물의 수는 처음의 몇 배인가? (단, ${eq(L(null, (g / 10).toFixed(1)), f4(tbl(g * 10)))}, ${eq(L(null, d2(c)), jh(f4(w), '으로/로'))} 계산한다.)`, opts.map((t) => t + '배'), opts.indexOf(d2(c)), {
        explain: `${steps}시간 뒤에는 처음의 ${PW((g / 10).toFixed(1), steps)}배이다. ${eq(L(null, PW((g / 10).toFixed(1), steps)), steps + ' × ' + f4(tbl(g * 10)))} = ${f4(w)} = ${L(null, d2(c))}이므로 ${d2(c)}배이다.`,
        facts: { truth: opts.map((t) => t === d2(c)), want: true }
      });
    }, { count: 2 })
  ]);
  // 상용로그의 값을 고르는 문항: 정답과 틀린 값들(만분의 일 단위 정수)로 보기를 만든다.
  function clogPick(d, text, right, wrong, rule, explain) {
    if (explain === undefined) { explain = rule; rule = undefined; }
    const vals = [right].concat([...new Set(wrong)].filter((w) => w !== right && Number.isInteger(w))).slice(0, 5);
    if (vals.length < 4 || new Set(vals.map(f4)).size !== vals.length) return null;
    const opts = d.shuffle(vals);
    return C(text, opts.map(f4), opts.indexOf(right), { explain, facts: Object.assign({ truth: opts.map((v) => v === right), want: true }, rule ? { rule } : {}) });
  }
  K.f4 = f4; K.tbl = tbl; K.d2 = d2; K.qpowZ = qpowZ; K.QH = QH; K.QJ = QJ; K.linH = linH;
})(typeof window !== 'undefined' ? window : globalThis);
