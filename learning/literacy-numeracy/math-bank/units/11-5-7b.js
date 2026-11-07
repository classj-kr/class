// 고등학교 미적분Ⅱ Ⅲ-2 정적분의 활용 — 뒤쪽 묶음(두 곡선 사이의 넓이, 접선·역함수가 낀 넓이와 넓이로 상수 구하기, 부피, 움직인 거리, 곡선의 길이).
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-7a.js 머리에 적었다. 도구는 B.kit.u57x(11-5-7a.js).
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, C } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, isInt, fl, nb, V, sup, rt, js } = B.kit.mid;
  const { ms, fn, intg, evl, trig, jh, qAns, plainOf } = B.kit.hs;
  const K = B.kit.u57x;
  const { S5, S6, S7, T, integ, close, dnum, L, ladd, lsc, lmul, lneg, lsub, lq, lnum, lm, eH, num, lnH, lH, pickC, X, YY, TT, yEq, xEq, piH, sinL, cosL, iv } = K;

  // 고르기(보기의 글과 수를 따로 짓는 것): list[0]이 정답 { h, v }. 수가 chk 와 같은 보기가 하나뿐이어야 한다.
  function pickRaw(d, text, list, o) {
    if (!close(list[0].v, o.chk)) throw new Error('닫힌 꼴과 수치 셈이 다르다: ' + plainOf(list[0].h) + ' = ' + list[0].v + ' / ' + o.chk);
    const keep = [];
    for (const it of list) if (Number.isFinite(it.v) && !keep.some((k) => plainOf(k.h) === plainOf(it.h) || Math.abs(k.v - it.v) <= 1e-4 * Math.max(1, Math.abs(k.v)))) keep.push(it);
    if (keep.length < 4) throw new Error('보기를 다 만들지 못했다: ' + plainOf(list[0].h));
    const order = d.shuffle(keep.slice(0, 5)), truth = order.map((it) => close(it.v, o.chk));
    if (truth.filter(Boolean).length !== 1) throw new Error('보기 가운데 답이 하나가 아니다');
    return C(text, order.map((it) => it.h), order.indexOf(list[0]), { figure: o.figure, explain: o.explain, facts: Object.assign({ truth, want: true, check: [o.chk] }, o.rule ? { rule: o.rule } : {}) });
  }
  const eX = (a) => V('e') + sup(a === 1 ? X : a === -1 ? MINUS + X : (a < 0 ? MINUS : '') + Math.abs(a) + X);   // e^(ax)
  // 구간 [lo, hi](π 의 유리수배)를 pts 에서 나눈 조각마다 ∫ = H(끝) − H(시작)를 셈해 절댓값을 더한다(조각의 부호는 수로 본다).
  function absPieces(H, pts) {
    let tot = L(), sgn = L();
    for (let i = 1; i < pts.length; i += 1) { const p = lsub(H(pts[i]), H(pts[i - 1])); sgn = ladd(sgn, p); tot = ladd(tot, lnum(p) < 0 ? lneg(p) : p); }
    return { tot, sgn };
  }

  // ═══ 다. 두 곡선 사이의 넓이 ═══
  const between = [
    T('btw-oneend', '두 곡선과 직선 하나로 둘러싸인 넓이 — 교점이 한 끝', '①21', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['exp', 'root', 'trig']);
        if (kind === 'exp') {
          const [a, c] = d.pick([[1, 1], [1, 2], [1, 3], [2, 1], [2, 2]]), right = lsc(L([1, ['e', a * c]], [1, ['e', -a * c]], [-2]), Q(1, a));
          const chk = integ((x) => Math.exp(a * x) - Math.exp(-a * x), 0, c);
          return pickC(d, `두 곡선 ${yEq(eX(a))}, ${yEq(eX(-a))} 및 직선 ${jh(xEq(c), '으로/로')} 둘러싸인 도형의 넓이는?`, right,
            [lsc(L([1, ['e', a * c]], [-1, ['e', -a * c]]), Q(1, a)), lsc(L([1, ['e', a * c]], [1, ['e', -a * c]]), Q(1, a)), L([1, ['e', a * c]], [1, ['e', -a * c]], [-2]), lsc(L([1, ['e', a * c]], [-1, ['e', -a * c]], [-2]), Q(1, a)), lsc(L([1, ['e', a * c]], [1, ['e', -a * c]], [-2]), a)], {
              chk, explain: `두 곡선은 ${xEq(0)}에서 만나고 ${iv(0, c, '에서')} ${nb(eX(a) + ' ≥ ' + eX(-a))}이므로 넓이는 ${intg(0, c, '(' + eX(a) + ' ' + MINUS + ' ' + eX(-a) + ')', 'x')} = ${lH(right)}이다.`, rule: 'one0' });
        }
        if (kind === 'root') {
          const m = d.pick([2, 3]), M0 = m * m, right = L([Q(2 * (m ** 3 - 1), 3)], [-2, ['ln', m]]), chk = integ((x) => Math.sqrt(x) - 1 / x, 1, M0);
          return pickC(d, `두 곡선 ${yEq(rt(X))}, ${yEq(frac(1, X))} 및 직선 ${jh(xEq(M0), '으로/로')} 둘러싸인 도형의 넓이는?`, right,
            [L([Q(2 * (m ** 3 - 1), 3)], [2, ['ln', m]]), L([Q(2 * (m ** 3 - 1), 3)], [-1, ['ln', m]]), L([Q(2 * m ** 3, 3)], [-2, ['ln', m]]), L([Q(3 * (m ** 3 - 1), 2)], [-2, ['ln', m]]), L([Q(2 * (m ** 3 - 1), 3)], [-4, ['ln', m]])], {
              chk, explain: `${nb(rt(X) + ' = ' + frac(1, X))}에서 ${xEq(1)}이고 ${iv(1, M0, '에서')} ${nb(rt(X) + ' ≥ ' + frac(1, X))}이므로 넓이는 ${intg(1, M0, '(' + rt(X) + ' ' + MINUS + ' ' + frac(1, X) + ')', 'x')} = ${evl(frac(2, 3) + X + rt(X) + ' ' + MINUS + ' ' + fn('ln') + ' ' + X, 1, M0)} = ${lH(right)}이다.`, rule: 'one0' });
        }
        const k = d.pick([1, 2, 3]), right = lq(1 + k), chk = integ((x) => Math.sin(2 * x) + k * Math.cos(x), 0, Math.PI / 2);
        return pickC(d, `닫힌구간 ${iv(0, piH(Q(1, 2)), '에서')} 두 곡선 ${yEq(trig('sin', '2' + X))}, ${jh(yEq(MINUS + (k === 1 ? '' : k) + trig('cos', X)), '과/와')} ${YY}축으로 둘러싸인 도형의 넓이는?`, right, [lq(k), lq(1 - k), lq(k - 1), lq(2 + k), lq(2 * k)], {
          chk, explain: `${nb(trig('sin', '2' + X) + ' = ' + MINUS + (k === 1 ? '' : k) + trig('cos', X))}에서 ${nb(trig('cos', X) + '(2' + trig('sin', X) + ' + ' + k + ') = 0')}, 구간 안의 교점은 ${xEq(piH(Q(1, 2)))}뿐이다. 넓이는 ${intg(0, piH(Q(1, 2)), '(' + trig('sin', '2' + X) + ' + ' + (k === 1 ? '' : k) + trig('cos', X) + ')', 'x')} = ${evl(MINUS + frac(1, 2) + trig('cos', '2' + X) + ' + ' + (k === 1 ? '' : k) + trig('sin', X), 0, piH(Q(1, 2)))} = ${1 + k}이다.`, rule: 'one0' });
      }
      const b = d.pick([3, 4, 6]), c = d.pick([1, 2]);
      const right = L([Q(1, 2), ['e', 2 * c]], [b - 1, ['e', c]], [qsub(Q(-1, 2), Q(b - 1 + b * c))]), chk = integ((x) => Math.exp(2 * x) + (b - 1) * Math.exp(x) - b, 0, c);
      const g = MINUS + (b - 1) + V('e') + sup(X) + ' + ' + b;
      return pickC(d, `두 곡선 ${yEq(V('e') + sup('2' + X))}, ${yEq(g)} 및 직선 ${jh(xEq(c), '으로/로')} 둘러싸인 도형의 넓이는?`, right,
        [L([1, ['e', 2 * c]], [b - 1, ['e', c]], [-(b + b * c)]), L([Q(1, 2), ['e', 2 * c]], [-(b - 1), ['e', c]], [qadd(Q(-1, 2), Q(b - 1 - b * c))]), L([Q(1, 2), ['e', 2 * c]], [b - 1, ['e', c]], [-b * c]), L([Q(1, 2), ['e', 2 * c]], [b - 1, ['e', c]], [qsub(Q(1, 2), Q(b - 1 + b * c))]), L([2, ['e', 2 * c]], [b - 1, ['e', c]], [-(2 + b - 1 + b * c)])], {
          chk, explain: `${nb(V('e') + sup('2' + X) + ' = ' + g)}에서 ${nb('(' + V('e') + sup(X) + ' ' + MINUS + ' 1)(' + V('e') + sup(X) + ' + ' + b + ') = 0')}이고 ${nb(V('e') + sup(X) + ' + ' + b + ' &gt; 0')}이므로 교점은 ${xEq(0)}이다. ${iv(0, c, '에서')} ${nb(V('e') + sup('2' + X) + ' ≥ ' + g)}이므로 넓이는 ${intg(0, c, '(' + V('e') + sup('2' + X) + ' + ' + (b - 1) + V('e') + sup(X) + ' ' + MINUS + ' ' + b + ')', 'x')} = ${lH(right)}이다.`, rule: 'one1' });
    }, { count: 2 }),
    T('btw-cross', '두 곡선과 두 직선으로 둘러싸인 넓이 — 구간 안에서 위아래가 바뀜', '①22', (d, n) => {
      if (n === 0) {
        const [Ak, Bk, x0] = d.pick([[1, 1, Q(1, 4)], [3, 1, Q(1, 6)], [1, 3, Q(1, 3)]]), E = d.pick([Q(1, 2), Q(1)]);
        const A = Ak === 1 ? L([1]) : L([1, ['rt', 3]]), Bv = Bk === 1 ? L([1]) : L([1, ['rt', 3]]);
        const G = (q) => ladd(lmul(Bv, sinL(q)), lmul(A, cosL(q)));                              // ∫(B cos x − A sin x)dx
        const { tot: right, sgn } = absPieces(G, [Q(0), x0, E]);
        const Ah = (Ak === 1 ? '' : rt(3) + ' ') + trig('sin', X), Bh = (Bk === 1 ? '' : rt(3) + ' ') + trig('cos', X), af = Math.sqrt(Ak), bf = Math.sqrt(Bk);
        const chk = integ((x) => Math.abs(af * Math.sin(x) - bf * Math.cos(x)), 0, fl(E) * Math.PI);
        return pickC(d, `두 곡선 ${yEq(Ah)}, ${yEq(Bh)} 및 두 직선 ${xEq(0)}, ${jh(xEq(piH(E)), '으로/로')} 둘러싸인 도형의 넓이는?`, right, [sgn, lneg(sgn), lsub(G(x0), G(Q(0))), lsc(lsub(G(x0), G(Q(0))), 2), lsc(right, Q(1, 2))], {
          chk, explain: `${nb(Ah + ' = ' + Bh)}에서 ${nb(trig('tan', X) + ' = ' + (Ak === Bk ? '1' : Bk === 3 ? rt(3) : frac(rt(3), 3)))}, 구간 안의 교점은 ${xEq(piH(x0))}이다. ${iv(0, piH(x0), '에서')} ${nb(Bh + ' ≥ ' + Ah)}, ${iv(piH(x0), piH(E), '에서')} ${nb(Ah + ' ≥ ' + Bh)}이므로 넓이는 두 조각의 합 ${lH(right)}이다.`, rule: 'cross0' });
      }
      if (n === 1) {
        const base = d.pick([2, 3, 'e']), p = d.pick([1, 2]), q = d.pick([1, 2]);
        const chk = integ((x) => Math.abs((base === 'e' ? Math.E : base) ** x - (base === 'e' ? Math.E : base) ** -x), -p, q);
        const bh = base === 'e' ? V('e') : String(base), cur1 = bh + sup(X), cur2 = bh + sup(MINUS + X), text = `두 곡선 ${yEq(cur1)}, ${yEq(cur2)} 및 두 직선 ${xEq(-p)}, ${jh(xEq(q), '으로/로')} 둘러싸인 도형의 넓이는?`;
        const explain = (ans) => `두 곡선은 ${xEq(0)}에서 만나고 ${iv(num(-p), 0, '에서')} ${nb(cur2 + ' ≥ ' + cur1)}, ${iv(0, q, '에서')} ${nb(cur1 + ' ≥ ' + cur2)}이므로 넓이는 ${intg(-p, 0, '(' + cur2 + ' ' + MINUS + ' ' + cur1 + ')', 'x')} + ${intg(0, q, '(' + cur1 + ' ' + MINUS + ' ' + cur2 + ')', 'x')} = ${ans}이다.`;
        if (base === 'e') {
          const right = L([1, ['e', p]], [1, ['e', -p]], [1, ['e', q]], [1, ['e', -q]], [-4]);
          return pickC(d, text, right, [L([1, ['e', p]], [-1, ['e', -p]], [1, ['e', q]], [-1, ['e', -q]]), L([1, ['e', q]], [1, ['e', -q]], [-2]), L([1, ['e', p]], [1, ['e', -p]], [1, ['e', q]], [1, ['e', -q]]), L([-1, ['e', p]], [-1, ['e', -p]], [1, ['e', q]], [1, ['e', -q]]), L([1, ['e', p]], [1, ['e', -p]], [1, ['e', q]], [1, ['e', -q]], [-2])], { chk, explain: explain(lH(L([1, ['e', p]], [1, ['e', -p]], [1, ['e', q]], [1, ['e', -q]], [-4]))), rule: 'cross1' });
        }
        const bb = base, R = Q(bb ** p + bb ** q - 4, 1), Rq = qadd(qadd(R, Q(1, bb ** p)), Q(1, bb ** q));   // 분자(유리수)
        const lnb = lnH(bb), overLn = (r) => ({ h: frac(r.p, (r.q === 1 ? '' : r.q + ' ') + lnb), v: fl(r) / Math.log(bb) });
        const list = [overLn(Rq), { h: num(Rq), v: fl(Rq) }, { h: nb(num(Rq) + ' ' + lnb), v: fl(Rq) * Math.log(bb) },
          overLn(qsub(Q(bb ** p + bb ** q), qadd(Q(1, bb ** p), Q(1, bb ** q)))), overLn(qadd(Rq, Q(2))), overLn(qadd(Rq, Q(4)))];
        return pickRaw(d, text, list, { chk, explain: explain(list[0].h), rule: 'cross1' });
      }
      if (n === 2) {
        const m = d.pick([2, 3, 4]), M0 = m * m, val = qmul(Q(2, 3), qadd(Q(m ** 3 - 2), Q(1, m ** 3)));
        return qAns(`두 곡선 ${yEq(frac(1, X))}, ${yEq(rt(X))} 및 두 직선 ${xEq(frac(1, M0))}, ${jh(xEq(M0), '으로/로')} 둘러싸인 도형의 넓이는?`, val, {
          explain: `두 곡선은 ${xEq(1)}에서 만나고 ${iv(frac(1, M0), 1, '에서')} ${nb(frac(1, X) + ' ≥ ' + rt(X))}, ${iv(1, M0, '에서')} ${nb(rt(X) + ' ≥ ' + frac(1, X))}이다. 넓이는 ${intg(frac(1, M0), 1, '(' + frac(1, X) + ' ' + MINUS + ' ' + rt(X) + ')', 'x')} + ${intg(1, M0, '(' + rt(X) + ' ' + MINUS + ' ' + frac(1, X) + ')', 'x')}이고 두 조각의 로그가 지워져 ${num(val)}이다.`,
          facts: { value: `2*(${M0}**(3/2)-2+${M0}**(-3/2))/3`, rule: 'cross2' } });
      }
      const pair = d.pick(['sc2', 'cs2']), E = pair === 'sc2' ? d.pick([Q(1, 2), Q(1)]) : d.pick([Q(1, 2), Q(1)]);
      let H, pts, f, g, fh, gh;
      if (pair === 'sc2') { H = (q) => ladd(lneg(cosL(q)), lsc(sinL(qmul(Q(2), q)), Q(-1, 2))); pts = [Q(0), Q(1, 6), Q(5, 6), Q(1)].filter((q) => fl(q) <= fl(E)); f = Math.sin; g = (x) => Math.cos(2 * x); fh = trig('sin', X); gh = trig('cos', '2' + X); }
      else { H = (q) => ladd(sinL(q), lsc(cosL(qmul(Q(2), q)), Q(1, 2))); pts = [Q(0), Q(1, 6), Q(1, 2), Q(5, 6), Q(1)].filter((q) => fl(q) <= fl(E)); f = Math.cos; g = (x) => Math.sin(2 * x); fh = trig('cos', X); gh = trig('sin', '2' + X); }
      if (fl(pts[pts.length - 1]) < fl(E)) pts.push(E);
      const { tot: right, sgn } = absPieces(H, pts), chk = integ((x) => Math.abs(f(x) - g(x)), 0, fl(E) * Math.PI);
      const first = lsub(H(pts[1]), H(pts[0]));
      return pickC(d, `닫힌구간 ${iv(0, piH(E), '에서')} 두 곡선 ${yEq(fh)}, ${yEq(gh)} 및 두 직선 ${xEq(0)}, ${jh(xEq(piH(E)), '으로/로')} 둘러싸인 도형의 넓이는?`, right, [sgn, lneg(sgn), lsc(right, 2), lnum(first) < 0 ? lneg(first) : first, lsc(right, Q(1, 2))], {
        chk, explain: `${nb(fh + ' = ' + gh)}에서 ${pair === 'sc2' ? nb('2' + trig('sin', X, 2) + ' + ' + trig('sin', X) + ' ' + MINUS + ' 1 = 0') + ', ' + nb(trig('sin', X) + ' = ' + frac(1, 2)) : nb(trig('cos', X) + '(1 ' + MINUS + ' 2' + trig('sin', X) + ') = 0')}이므로 구간 안의 교점은 ${pts.slice(1, -1).map((q) => xEq(piH(q))).join(', ')}이다. 교점마다 위아래가 바뀌므로 조각마다 (위 − 아래)를 적분해 더하면 넓이는 ${lH(right)}이다.`, rule: 'cross3' });
    }, { count: 4 }),
    T('btw-root-line', '무리함수의 그래프와 직선으로 둘러싸인 넓이', '①23', (d) => {
      const r1 = d.int(1, 3), r2 = r1 + d.int(1, 3), p = r1 + r2, q = r1 * r2, val = Q((r2 - r1) ** 3, 6 * p);
      if (isInt(val)) return null;
      return qAns(`곡선 ${jh(yEq(rt(ms(`${p}x - ${q}`))), '과/와')} 직선 ${jh(yEq(X), '으로/로')} 둘러싸인 도형의 넓이는?`, val, {
        explain: `${nb(rt(ms(`${p}x - ${q}`)) + ' = ' + X)}에서 ${nb(ms(`x^2 - ${p}x + ${q} = 0`))}, ${xEq(r1)} 또는 ${xEq(r2)}이다. 이 사이에서 곡선이 직선보다 위에 있으므로 넓이는 ${intg(r1, r2, '(' + rt(ms(`${p}x - ${q}`)) + ' ' + MINUS + ' ' + X + ')', 'x')} = ${evl(num(Q(2, 3 * p)) + '(' + ms(`${p}x - ${q}`) + ')' + rt(ms(`${p}x - ${q}`)) + ' ' + MINUS + ' ' + frac(X + sup(2), 2), r1, r2)} = ${num(val)}이다.`,
        facts: { value: `2*(${r2}**3-${r1}**3)/(3*${p})-(${r2}**2-${r1}**2)/2` } });
    })
  ];

  // ═══ 라. 접선·역함수가 낀 넓이와 넓이로 상수 구하기 ═══
  const special = [
    T('sp-tan-on', '곡선 위의 점에서의 접선과 곡선 및 직선으로 둘러싸인 넓이', '①24', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['ln', 'ln', 'exp']);
        if (kind === 'ln') {
          const m = d.pick([2, 3, 'e']), right = m === 'e' ? L([Q(1, 2), ['e', 2]], [-1, ['e', 1]], [Q(-1, 2)]) : L([Q((m - 1) ** 2, 2) + 0 === 0 ? 0 : qadd(Q((m - 1) ** 2, 2), Q(m - 1))], [-m, ['ln', m]]);
          const mv = m === 'e' ? Math.E : m, chk = integ((x) => x - 1 - Math.log(x), 1, mv), mh = m === 'e' ? V('e') : m;
          const wrongs = m === 'e' ? [L([Q(1, 2), ['e', 2]], [-1, ['e', 1]], [Q(1, 2)]), L([Q(1, 2), ['e', 2]], [-2, ['e', 1]], [Q(3, 2)]), L([Q(1, 2), ['e', 2]], [-1, ['e', 1]]), L([1, ['e', 2]], [-2, ['e', 1]], [-1])] : [L([Q((m - 1) ** 2, 2)], [-m, ['ln', m]]), L([qadd(Q((m - 1) ** 2, 2), Q(m - 1))], [-1, ['ln', m]]), L([qadd(Q((m - 1) ** 2, 2), Q(m))], [-m, ['ln', m]]), L([m, ['ln', m]], [-qadd(Q((m - 1) ** 2, 2), Q(m - 1))])];
          return pickC(d, `곡선 ${yEq(ms('ln x'))} 위의 점 ${nb('(1, 0)')}에서의 접선과 이 곡선 및 직선 ${jh(xEq(mh), '으로/로')} 둘러싸인 도형의 넓이는?`, right, wrongs, {
            chk, explain: `${nb(YY + '′ = ' + frac(1, X))}이므로 접선은 ${yEq(ms('x - 1'))}이다. 곡선 ${jh(yEq(ms('ln x')), '은/는')} 위로 볼록하여 접선이 곡선보다 위에 있으므로 넓이는 ${intg(1, mh, '(' + ms('x - 1 - ln x') + ')', 'x')} = ${evl(frac(X + sup(2), 2) + ' ' + MINUS + ' ' + X + ' ' + MINUS + ' (' + ms('x ln x - x') + ')', 1, mh)} = ${lH(right)}이다.`, rule: 'tan0' });
        }
        const c = d.pick([1, 2, 3]), right = L([1, ['e', c]], [qsub(Q(-c * c, 2), Q(c + 1))]), chk = integ((x) => Math.exp(x) - x - 1, 0, c);
        return pickC(d, `곡선 ${yEq(V('e') + sup(X))} 위의 점 ${nb('(0, 1)')}에서의 접선과 이 곡선 및 직선 ${jh(xEq(c), '으로/로')} 둘러싸인 도형의 넓이는?`, right,
          [L([1, ['e', c]], [qsub(Q(c * c, 2), Q(c + 1))]), L([1, ['e', c]], [qsub(Q(-c * c, 2), Q(c))]), L([1, ['e', c]], [qadd(Q(-c * c, 2), Q(c - 1))]), L([1, ['e', c]], [-c * c - c - 1])], {
            chk, explain: `${nb(YY + '′ = ' + V('e') + sup(X))}이므로 접선은 ${yEq(ms('x + 1'))}이다. 곡선은 아래로 볼록하여 접선보다 위에 있으므로 넓이는 ${intg(0, c, '(' + V('e') + sup(X) + ' ' + MINUS + ' ' + ms('x - 1').replace(MINUS + ' ', '') + ')', 'x')}의 꼴로 ${lH(right)}이다.`.replace('의 꼴로', ' ='), rule: 'tan0' });
      }
      const a = d.pick([0, 1, 2]), m = d.pick([3, 4, 5]);
      const right = L([1, ['ln', m]], [qadd(Q(m * m, 2), Q(3 - 4 * m, 2))]), chk = integ((t) => 1 / t + t - 2, 1, m);
      const cur = frac(1, a === 0 ? X : ms('x - ' + a)), px = a + 1, tanH = a + 2 === 0 ? MINUS + X : `${MINUS}${X} + ${a + 2}`;
      return pickC(d, `곡선 ${yEq(cur)} 위의 점 ${nb(`(${px}, 1)`)}에서의 접선과 이 곡선 및 직선 ${jh(xEq(a + m), '으로/로')} 둘러싸인 도형의 넓이는?`, right,
        [L([1, ['ln', m]], [qsub(Q(m * m, 2), Q(3 - 4 * m, 2))]).t.length ? L([-1, ['ln', m]], [qadd(Q(m * m, 2), Q(3 - 4 * m, 2))]) : null, L([1, ['ln', m]], [qadd(Q(m * m, 2), Q(-4 * m, 2))]), L([1, ['ln', m + 1]], [qadd(Q(m * m, 2), Q(3 - 4 * m, 2))]), L([2, ['ln', m]], [qadd(Q(m * m, 2), Q(3 - 4 * m, 2))]), L([1, ['ln', m]], [qadd(Q(m * m, 2), Q(1 - 4 * m, 2))])], {
          chk, explain: `${nb(YY + '′ = ' + MINUS + frac(1, (a === 0 ? X : '(' + ms('x - ' + a) + ')') + sup(2)))}이므로 접선의 기울기는 ${MINUS}1이고 접선은 ${yEq(tanH)}이다. 곡선이 접선보다 위에 있으므로 넓이는 ${intg(px, a + m, '(' + cur + ' + ' + X + ' ' + MINUS + ' ' + (a + 2) + ')', 'x')} = ${lH(right)}이다.`, rule: 'tan1' });
    }, { count: 2 }),
    T('sp-tan-from', '곡선 밖의 점에서 그은 접선과 곡선·좌표축으로 둘러싸인 넓이', '①25', (d) => {
      const c = d.pick([0, 1]), p = d.pick([1, 2, 3]), t = p + 1;
      const right = L([Q(1, 2), ['e', t - c]], [-1, ['e', -c]]), chk = integ((x) => Math.exp(x - c) - Math.max(0, Math.exp(t - c) * (x - p)), 0, t);
      const cur = V('e') + sup(c === 0 ? X : ms('x - 1'));
      return pickC(d, `점 ${nb(`(${p}, 0)`)}에서 곡선 ${yEq(cur)}에 그은 접선을 ${V('l')}이라 할 때, 곡선 ${jh(yEq(cur), '과/와')} ${X}축, ${YY}축 및 직선 ${jh(V('l'), '으로/로')} 둘러싸인 도형의 넓이는?`, right,
        [L([1, ['e', t - c]], [-1, ['e', -c]]), L([Q(1, 2), ['e', t - c]]), L([Q(1, 2), ['e', t - c]], [1, ['e', -c]]), L([Q(1, 2), ['e', t - 1 - c]], [-1, ['e', -c]]), L([Q(3, 2), ['e', t - c]], [-1, ['e', -c]])], {
          chk, explain: `접점을 ${jh(nb('(' + V('t') + ', ' + V('e') + sup(c === 0 ? V('t') : ms('t - 1')) + ')'), '이라/라')} 하면 접선 ${nb(YY + ' = ' + V('e') + sup(c === 0 ? V('t') : ms('t - 1')) + '(' + X + ' ' + MINUS + ' ' + V('t') + ') + ' + V('e') + sup(c === 0 ? V('t') : ms('t - 1')))}이 점 ${nb(`(${p}, 0)`)}을 지나므로 ${nb(V('t') + ' = ' + t)}이다. 넓이는 곡선 아래 넓이 ${intg(0, t, cur, 'x')}에서 밑변 1, 높이 ${eH(Q(t - c))}인 삼각형의 넓이를 뺀 ${lH(right)}이다.`, rule: 'from' });
    }),
    T('sp-bisect', '넓이를 이등분하는 직선·곡선 — 상수 구하기', '①29', (d, n) => {
      if (n === 0) {
        const c = d.pick([1, 2]), m = d.pick([2, 3, 4]), E = Math.exp(m);
        const S1 = c * ((m - 1) * E + 1), a = S1 / (E - 1) ** 2;
        if (!(a * (E - 1) < c * m)) return null;
        const chk = integ((x) => c * Math.log(x + 1), 0, E - 1) / (E - 1) ** 2;
        const den = '(' + eH(Q(m)) + ' ' + MINUS + ' 1)' + sup(2), topS = (k, j) => `${k === 1 ? '' : k}${j === 1 ? '' : j}${eH(Q(m))} + ${k}`;   // k((m−1)eᵐ + 1)
        const list = [{ h: frac(topS(c, m - 1).replace(/^(\d*)(\d)/, '$1$2'), den), v: a }, { h: frac(topS(2 * c, m - 1), den), v: 2 * a }, { h: frac(topS(c, m), den), v: c * (m * E + 1) / (E - 1) ** 2 }, { h: frac(topS(c, m - 1), eH(Q(m)) + ' ' + MINUS + ' 1'), v: a * (E - 1) }, { h: frac(topS(c, m - 1), '2' + den), v: a / 2 }];
        list[0].h = frac(`${c * (m - 1) === 1 ? '' : c * (m - 1)}${eH(Q(m))} + ${c}`, den); list[1].h = frac(`${2 * c * (m - 1)}${eH(Q(m))} + ${2 * c}`, den); list[2].h = frac(`${c * m}${eH(Q(m))} + ${c}`, den); list[3].h = frac(`${c * (m - 1) === 1 ? '' : c * (m - 1)}${eH(Q(m))} + ${c}`, eH(Q(m)) + ' ' + MINUS + ' 1'); list[4].h = frac(`${c * (m - 1) === 1 ? '' : c * (m - 1)}${eH(Q(m))} + ${c}`, '2' + den);
        const cur = (c === 1 ? '' : c) + fn('ln') + '(' + ms('x + 1') + ')', Xe = eH(Q(m)) + ' ' + MINUS + ' 1';
        return pickRaw(d, `곡선 ${jh(yEq(cur), '과/와')} ${X}축 및 직선 ${jh(xEq(Xe), '으로/로')} 둘러싸인 도형의 넓이를 직선 ${jh(yEq(V('a') + X), '이/가')} 이등분할 때, 상수 ${V('a')}의 값은?`, list, {
          chk, explain: `도형의 넓이는 ${intg(0, Xe, cur, 'x')} = ${(c === 1 ? '' : c + '{') + (m - 1 === 1 ? '' : m - 1) + eH(Q(m)) + ' + 1' + (c === 1 ? '' : '}')}이다(${intg(null, null, fn('ln') + '(' + ms('x + 1') + ')', 'x')} = ${nb('(' + ms('x + 1') + ')' + fn('ln') + '(' + ms('x + 1') + ')')} ${MINUS} ${X} + ${V('C')}). 직선 ${yEq(V('a') + X)} 아래 삼각형의 넓이 ${jh(nb(frac(1, 2) + V('a') + den), '이/가')} 그 반이므로 ${nb(V('a') + ' = ')}${list[0].h}이다.`, rule: 'bisect0' });
      }
      const c = d.pick([2, 3, 4]), b = d.pick([3, 8, 15, 24, 35]), s = Math.round(Math.sqrt(b + 1)), p = s + 1;
      return qAns(`곡선 ${jh(yEq(frac(c, ms('x + 1'))), '과/와')} ${X}축 및 두 직선 ${xEq(0)}, ${jh(xEq(b), '으로/로')} 둘러싸인 도형의 넓이를 곡선 ${jh(yEq(frac(c, X + ' + ' + V('p'))), '이/가')} 이등분할 때, 양수 ${V('p')}의 값은? ${nb('(단, ' + V('p') + ' &gt; 1)')}`, p, {
        explain: `큰 도형의 넓이는 ${intg(0, b, frac(c, ms('x + 1')), 'x')} = ${c}${lnH(b + 1)}이고, 곡선 ${yEq(frac(c, X + ' + ' + V('p')))} 아래의 넓이는 ${nb(c + fn('ln') + ' ' + frac(b + ' + ' + V('p'), V('p')))}이다. 이것이 반이므로 ${nb(frac(b + ' + ' + V('p'), V('p')) + ' = ' + rt(b + 1) + ' = ' + s)}, ${nb(V('p') + ' = ' + p)}이다.`,
        facts: { value: `${b}/((${b}+1)**(1/2)-1)`, rule: 'bisect1' } });
    }, { count: 2 })
  ];

  // ═══ 마. 단면의 넓이로 부피 구하기 ═══
  const solidOr = (d, h) => (d.bool() ? { pre: `높이가 ${h}인 입체도형을 밑면으로부터 높이가 ${X}인 지점에서 밑면에 평행한 평면으로 자른 단면은`, ask: '이 입체도형의 부피는?', u: '' } : { pre: `높이가 ${h} cm인 그릇에 물을 채울 때, 물의 높이가 ${X} cm이면 수면은`, ask: '물을 가득 채웠을 때 물의 부피는 몇 cm³인가?', u: ' cm' });
  const vol = [
    T('vol-area', '단면의 넓이를 식으로 준 입체의 부피', '②1', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['x2', 'root', 'lin']);
        let h, right, Sh, extra, chk;
        if (kind === 'x2') { h = d.pick([2, 3, 4]); right = L([1, ['e', h]], [h ** 3 - 1]); Sh = V('e') + sup(X) + ' + 3' + X + sup(2); extra = L([1, ['e', h]], [3 * h ** 3 - 1]); chk = integ((x) => Math.exp(x) + 3 * x * x, 0, h); }
        else if (kind === 'root') { h = d.pick([4, 9]); right = L([1, ['e', h]], [qsub(Q(2 * h * Math.sqrt(h), 3), Q(1))]); Sh = V('e') + sup(X) + ' + ' + rt(X); extra = L([1, ['e', h]], [qsub(Q(3 * h * Math.sqrt(h), 2), Q(1))]); chk = integ((x) => Math.exp(x) + Math.sqrt(x), 0, h); }
        else { h = d.pick([2, 3, 5]); right = L([1, ['e', h]], [h * h - 1]); Sh = V('e') + sup(X) + ' + 2' + X; extra = L([1, ['e', h]], [2 * h * h - 1]); chk = integ((x) => Math.exp(x) + 2 * x, 0, h); }
        const water = d.bool();
        const text = water ? `어떤 그릇에 물을 채울 때, 물의 높이가 ${X} cm이면 수면의 넓이는 ${nb('(' + Sh + ') cm²')}이다. 물의 높이가 ${h} cm일 때 그릇에 담긴 물의 부피는 몇 cm³인가?` : `어떤 입체도형을 밑면으로부터 높이가 ${X}인 지점에서 밑면에 평행한 평면으로 자른 단면의 넓이가 ${nb(Sh)}이다. 이 입체도형의 높이가 ${h}일 때, 부피는?`;
        return pickC(d, text, right, [ladd(right, lq(1)), extra, L([1, ['e', h]]), L([1, ['e', h - 1]], [right.t[1].c])], {
          chk, explain: `부피는 단면의 넓이를 0부터 ${h}까지 적분한 ${intg(0, h, '(' + Sh + ')', 'x')} = ${lH(right)}이다.`, rule: 'area0' });
      }
      const h = d.pick([3, 4, 5]), c = d.pick([1, 2, 3]), circ = d.bool(), inner = V('e') + sup(X) + ' + ' + c;
      const Vt = (circ ? Math.PI : 1) * integ((x) => Math.exp(x) + c, 0, h);
      const opts = [{ h: intg(0, h, '(' + inner + ')', 'x'), v: integ((x) => Math.exp(x) + c, 0, h) }, { h: 'π' + intg(0, h, '(' + inner + ')', 'x'), v: Math.PI * integ((x) => Math.exp(x) + c, 0, h) },
        { h: (circ ? 'π' : '') + intg(0, h, rt(inner), 'x'), v: (circ ? Math.PI : 1) * integ((x) => Math.sqrt(Math.exp(x) + c), 0, h) }, { h: (circ ? 'π' : '') + intg(0, h, '(' + inner + ')' + sup(2), 'x'), v: (circ ? Math.PI : 1) * integ((x) => (Math.exp(x) + c) ** 2, 0, h) },
        { h: nb(h + (circ ? 'π' : '') + '(' + V('e') + sup(h) + ' + ' + c + ')'), v: (circ ? Math.PI : 1) * h * (Math.exp(h) + c) }];
      const right = opts[circ ? 1 : 0], order = d.shuffle(opts), truth = order.map((o) => close(o.v, Vt));
      if (truth.filter(Boolean).length !== 1) return null;
      return C(`높이가 ${h}인 그릇에 물을 채울 때, 물의 높이가 ${X}이면 수면은 ${circ ? '반지름의 길이' : '한 변의 길이'}가 ${rt(inner)}인 ${circ ? '원' : '정사각형'}이다. 물을 가득 채웠을 때 물의 부피를 정적분으로 나타낸 것은?`, order.map((o) => o.h), order.indexOf(right), {
        explain: `수면의 넓이는 ${circ ? nb('π(' + rt(inner) + ')' + sup(2) + ' = π(' + inner + ')') : nb('(' + rt(inner) + ')' + sup(2) + ' = ' + inner)}이고, 부피는 수면의 넓이를 0부터 ${h}까지 적분한 ${right.h}이다.`,
        facts: { truth, want: true, check: [Vt], rule: 'area1' } });
    }, { count: 2 }),
    T('vol-side', '단면이 정사각형(한 변)·원(반지름)인 입체와 물그릇의 부피', '②2', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['lin', 'root']);
        if (kind === 'lin') {
          const p = d.pick([1, 2, 3, 4]), q = d.pick([2, 4, 6]), h = d.pick([3, 4, 5, 6]), w = solidOr(d, h), val = p * h + q * h * h / 2;
          return qAns(`${w.pre} 한 변의 길이가 ${nb(rt(ms(`${p} + ${q}x`)) + w.u)}인 정사각형이다. ${w.ask}`, val, {
            unit: w.u ? 'cm³' : undefined,
            explain: `단면의 넓이는 ${nb('(' + rt(ms(`${p} + ${q}x`)) + ')' + sup(2) + ' = ' + ms(`${p} + ${q}x`))}이므로 부피는 ${intg(0, h, '(' + ms(`${p} + ${q}x`) + ')', 'x')} = ${evl(ms(`${p}x + ${q / 2 === 1 ? '' : q / 2}x^2`), 0, h)} = ${val}이다.`,
            facts: { value: `${p}*${h}+${q}*${h}**2/2`, rule: 'side0' } });
        }
        const [a, h] = d.pick([[3, 4], [6, 4], [2, 9], [4, 9]]), w = solidOr(d, h), val = a * a * h * h / 2 + (4 * a / 3) * h * Math.sqrt(h) + h;
        return qAns(`${w.pre} 한 변의 길이가 ${nb('(' + a + rt(X) + ' + 1)' + w.u)}인 정사각형이다. ${w.ask}`, val, {
          unit: w.u ? 'cm³' : undefined,
          explain: `단면의 넓이는 ${nb('(' + a + rt(X) + ' + 1)' + sup(2) + ' = ' + (a * a) + X + ' + ' + 2 * a + rt(X) + ' + 1')}이므로 부피는 ${intg(0, h, '(' + (a * a) + X + ' + ' + 2 * a + rt(X) + ' + 1)', 'x')} = ${val}이다.`,
          facts: { value: `${a}**2*${h}**2/2+4*${a}*${h}**(3/2)/3+${h}`, rule: 'side0' } });
      }
      if (n === 1) {
        const kind = d.pick(['ln', 'sin', 'exp', 'cosh']);
        let h, right, rh, chk, wrongs, sq;
        if (kind === 'ln') { const c = d.pick([2, 3, 4]); h = d.pick([1, 2, 3]); rh = rt(c + ' + ' + fn('ln') + '(' + ms('x + 1') + ')'); sq = c + ' + ' + fn('ln') + '(' + ms('x + 1') + ')'; right = lm(L([(c - 1) * h], [h + 1, ['ln', h + 1]]), ['pi', 1], true); chk = Math.PI * integ((x) => c + Math.log(x + 1), 0, h); wrongs = [L([(c - 1) * h], [h + 1, ['ln', h + 1]]), lm(L([c * h], [h + 1, ['ln', h + 1]]), ['pi', 1], true), lm(L([(c - 1) * h], [1, ['ln', h + 1]]), ['pi', 1], true), lm(L([c * h], [h, ['ln', h + 1]]), ['pi', 1], true)]; }
        else if (kind === 'sin') { const c = d.pick([2, 3, 4]); h = d.pick([1, 3]); rh = rt(trig('sin', 'π' + X) + ' + ' + c); sq = trig('sin', 'π' + X) + ' + ' + c; right = L([2], [c * h, ['pi', 1]]); chk = Math.PI * integ((x) => Math.sin(Math.PI * x) + c, 0, h); wrongs = [L([c * h, ['pi', 1]]), L([2, ['pi', 1]], [c * h, ['pi', 1]]), L([1], [c * h, ['pi', 1]]), L([2, ['pi', -1]], [c * h])]; }
        else if (kind === 'exp') { const c = d.pick([1, 2, 3]); h = d.pick([2, 3, 4]); rh = rt(V('e') + sup(X) + ' + ' + c); sq = V('e') + sup(X) + ' + ' + c; right = lm(L([1, ['e', h]], [c * h - 1]), ['pi', 1]); chk = Math.PI * integ((x) => Math.exp(x) + c, 0, h); wrongs = [L([1, ['e', h]], [c * h - 1]), lm(L([1, ['e', h]], [c * h]), ['pi', 1]), lm(L([1, ['e', h]], [c * h + 1]), ['pi', 1]), lm(L([1, ['e', h]], [c - 1]), ['pi', 1])]; }
        else { h = d.pick([1, 2, 4]); rh = '(' + V('e') + sup(X) + ' + ' + V('e') + sup(MINUS + X) + ')'; sq = null; right = lm(L([Q(1, 2), ['e', 2 * h]], [Q(-1, 2), ['e', -2 * h]], [2 * h]), ['pi', 1]); chk = Math.PI * integ((x) => (Math.exp(x) + Math.exp(-x)) ** 2, 0, h); wrongs = [lm(L([1, ['e', h]], [-1, ['e', -h]]), ['pi', 1]), L([Q(1, 2), ['e', 2 * h]], [Q(-1, 2), ['e', -2 * h]], [2 * h]), lm(L([Q(1, 2), ['e', 2 * h]], [Q(-1, 2), ['e', -2 * h]]), ['pi', 1]), lm(L([Q(1, 2), ['e', 2 * h]], [Q(1, 2), ['e', -2 * h]], [2 * h]), ['pi', 1])]; }
        const w = solidOr(d, h);
        return pickC(d, `${w.pre} 반지름의 길이가 ${nb(rh + w.u)}인 원이다. ${w.ask}`, right, wrongs, {
          chk, explain: `단면의 넓이는 ${sq ? nb('π(' + rh + ')' + sup(2) + ' = π(' + sq + ')') : nb('π' + rh + sup(2) + ' = π(' + V('e') + sup('2' + X) + ' + ' + V('e') + sup(MINUS + '2' + X) + ' + 2)')}이므로 부피는 이것을 0부터 ${h}까지 적분한 ${lH(right)}이다.`, rule: 'side1' });
      }
      const kind = d.pick(['sq', 'circ']);
      if (kind === 'sq') {
        const a = d.pick([3, 5, 7]), h = d.pick([3, 4, 5]), right = L([h], [a - 1, ['ln', h + 1]]), chk = integ((x) => (x + a) / (x + 1), 0, h), w = solidOr(d, h);
        return pickC(d, `${w.pre} 한 변의 길이가 ${nb(rt(frac(ms('x + ' + a), ms('x + 1'))) + w.u)}인 정사각형이다. ${w.ask}`, right, [L([h], [a, ['ln', h + 1]]), L([a - 1, ['ln', h + 1]]), L([h], [a - 1, ['ln', h]]), L([h], [Q(a - 1, 2), ['ln', h + 1]]), L([2 * h], [a - 1, ['ln', h + 1]])], {
          chk, explain: `단면의 넓이는 ${nb(frac(ms('x + ' + a), ms('x + 1')) + ' = 1 + ' + frac(a - 1, ms('x + 1')))}이므로 부피는 ${intg(0, h, '(1 + ' + frac(a - 1, ms('x + 1')) + ')', 'x')} = ${lH(right)}이다.`, rule: 'side2' });
      }
      const h = d.pick([1, 2, 3]), u = 2 * h * h + 2 * h + 1, r0 = Math.round(Math.sqrt(u)), sq = r0 * r0 === u, w = solidOr(d, h);
      const right = sq ? L([1, ['pi', 1], ['ln', r0]]) : L([Q(1, 2), ['pi', 1], ['ln', u]]), chk = Math.PI * integ((x) => (2 * x + 1) / (2 * x * x + 2 * x + 1), 0, h);
      const lnU = (k) => (sq ? L([k, ['pi', 1], ['ln', r0]]) : L([qmul(Q(k), Q(1, 2)), ['pi', 1], ['ln', u]]));
      return pickC(d, `${w.pre} 반지름의 길이가 ${nb(rt(frac(ms('2x + 1'), ms('2x^2 + 2x + 1'))) + w.u)}인 원이다. ${w.ask}`, right, [lnU(2), lsc(right, Q(1, 2)), sq ? L([1, ['ln', r0]]) : L([Q(1, 2), ['ln', u]]), lnU(4), sq ? L([1, ['pi', 1], ['ln', u]]) : L([1, ['pi', 1], ['ln', u + 1]])], {
        chk, explain: `단면의 넓이는 ${nb('π × ' + frac(ms('2x + 1'), ms('2x^2 + 2x + 1')))}이고 분자는 분모를 미분한 식의 ${frac(1, 2)}배이므로 부피는 ${nb(frac('π', 2))}${evl(fn('ln') + '(' + ms('2x^2 + 2x + 1') + ')', 0, h)} = ${lH(right)}이다.`, rule: 'side2' });
    }, { count: 3 }),
    T('vol-height', '부피가 주어질 때 입체의 높이 구하기', '②3', (d) => {
      const kind = d.pick(['sc', 'sq', 'cosr']);
      let hq, Vh, Vv, Sh, S, expl;
      if (kind === 'sc') { hq = d.pick([Q(1, 2), Q(1, 3)]); const c = hq.q === 2 ? 0 : 0.5; Vv = (2 * Math.PI / 3) * (1 - c ** 3); Vh = hq.q === 2 ? frac('2π', 3) : frac('7π', 12); Sh = '반지름의 길이가 ' + rt(trig('sin', '2' + X) + ' ' + trig('cos', X)) + '인 원'; S = (x) => Math.PI * Math.sin(2 * x) * Math.cos(x); expl = `단면의 넓이는 ${nb('π ' + trig('sin', '2' + X) + ' ' + trig('cos', X) + ' = 2π ' + trig('sin', X) + ' ' + trig('cos', X, 2))}이므로 부피는 ${nb(frac('2π', 3) + '(1 ' + MINUS + ' ' + trig('cos', V('h'), 3) + ')')}이다.`; }
      else if (kind === 'sq') { hq = d.pick([Q(1, 3), Q(1, 2), Q(2, 3)]); Vv = 1 - Math.cos(fl(hq) * Math.PI); Vh = num(Q(Math.round(Vv * 2), 2)); Sh = '한 변의 길이가 ' + rt(trig('sin', X)) + '인 정사각형'; S = Math.sin; expl = `단면의 넓이는 ${trig('sin', X)}이므로 부피는 ${intg(0, V('h'), trig('sin', X), 'x')} = ${nb('1 ' + MINUS + ' ' + trig('cos', V('h')))}이다.`; }
      else { hq = d.pick([Q(1, 6), Q(1, 3), Q(1, 2)]); Vv = Math.PI * Math.sin(fl(hq) * Math.PI); Vh = hq.q === 6 ? frac('π', 2) : hq.q === 3 ? frac(rt(3) + 'π', 2) : 'π'; Sh = '반지름의 길이가 ' + rt(trig('cos', X)) + '인 원'; S = (x) => Math.PI * Math.cos(x); expl = `단면의 넓이는 ${nb('π ' + trig('cos', X))}이므로 부피는 ${nb('π ' + trig('sin', V('h')))}이다.`; }
      if (!close(integ(S, 0, fl(hq) * Math.PI), Vv)) throw new Error('부피 셈이 다르다');
      const right = L([hq, ['pi', 1]]), others = [Q(1, 6), Q(1, 4), Q(1, 3), Q(1, 2), Q(2, 3), Q(3, 4)].filter((q) => q.p !== hq.p || q.q !== hq.q).map((q) => L([q, ['pi', 1]]));
      return pickC(d, `높이가 ${V('h')}인 입체도형을 밑면으로부터 높이가 ${X}인 지점에서 밑면에 평행한 평면으로 자른 단면은 ${Sh}이다. 이 입체도형의 부피가 ${Vh}일 때, ${V('h')}의 값은? ${nb('(단, 0 &lt; ' + V('h') + ' ≤ ' + (kind === 'sq' ? frac('2π', 3) : frac('π', 2)) + ')')}`, right, d.shuffle(others), {
        chk: fl(hq) * Math.PI, explain: `${expl} 이것이 ${Vh}이므로 ${nb(V('h') + ' = ' + piH(hq))}이다.`, rule: 'height' });
    }),
    T('vol-cone', '뿔의 부피 — 단면은 밑면과 닮음', '②8', (d, n) => {
      if (n === 0) {
        const Sv = 5, hv = 3, xv = 2, want = Sv * (xv / hv) ** 2;
        const opts = [{ h: frac(V('S'), V('h') + sup(2)) + X + sup(2), v: Sv / hv ** 2 * xv ** 2 }, { h: frac(V('S'), V('h')) + X, v: Sv / hv * xv }, { h: frac(V('S'), V('h') + sup(2)) + X, v: Sv / hv ** 2 * xv }, { h: frac(V('S') + X + sup(2), V('h')), v: Sv * xv ** 2 / hv }, { h: frac(V('S'), V('h') + sup(3)) + X + sup(3), v: Sv / hv ** 3 * xv ** 3 }];
        const order = d.shuffle(opts), truth = order.map((o) => close(o.v, want));
        return C(`밑면의 넓이가 ${V('S')}이고 높이가 ${V('h')}인 사각뿔의 꼭짓점을 원점, 꼭짓점에서 밑면에 내린 수선을 ${X}축으로 잡았다. ${X}좌표가 ${X}인 점을 지나고 ${X}축에 수직인 평면으로 자른 단면의 넓이는? ${nb('(단, 0 ≤ ' + X + ' ≤ ' + V('h') + ')')}`, order.map((o) => o.h), order.indexOf(opts[0]), {
          explain: `단면은 밑면과 닮음이고 닮음비는 ${nb(X + ' : ' + V('h'))}이므로 넓이의 비는 ${nb(X + sup(2) + ' : ' + V('h') + sup(2))}이다. 단면의 넓이는 ${opts[0].h}이고, 이것을 0부터 ${V('h')}까지 적분하면 부피 ${nb(frac(1, 3) + V('S') + V('h'))}가 나온다.`,
          facts: { truth, want: true, check: [want], rule: 'cone0' } });
      }
      const r = d.pick([2, 3, 4, 6]), h = d.pick([3, 4, 5, 6]), A = r * r, right = L([Q(A * h, 3), ['pi', 1]]), chk = integ((x) => Math.PI * A * (x / h) ** 2, 0, h);
      return pickC(d, `정적분을 이용하여 구한, 밑면의 넓이가 ${nb(A + 'π')}이고 높이가 ${h}인 원뿔의 부피는?`, right, [L([A * h, ['pi', 1]]), L([Q(A * h, 2), ['pi', 1]]), L([Q(r * h, 3), ['pi', 1]]), lq(Q(A * h, 3)), L([Q(A * h * h, 3), ['pi', 1]])], {
        chk, explain: `꼭짓점에서 거리가 ${X}인 단면의 넓이는 ${nb(A + 'π × ' + frac(X + sup(2), h * h))}이므로 부피는 ${intg(0, h, frac(A + 'π', h * h) + X + sup(2), 'x')} = ${lH(right)}이다.`, rule: 'cone1' });
    }, { count: 2 }),
    T('vol-hemi', '반구의 부피 — 단면은 원', '②9', (d, n) => {
      if (n === 0) {
        const r = d.pick([3, 6, 9]), full = d.bool(), dd = full ? r : d.pick([3, 6].filter((x) => x < r).concat(r === 3 ? [] : []));
        if (!full && dd === undefined) return null;
        const depth = full ? r : dd, val = r * depth * depth - depth ** 3 / 3;
        const Sx = nb('π(' + 2 * r + X + ' ' + MINUS + ' ' + X + sup(2) + ') cm²');
        return qAns(`반지름의 길이가 ${r} cm인 반구 모양의 그릇에 물을 채울 때, 물의 깊이가 ${X} cm이면 수면의 넓이는 ${Sx}이다. ${full ? '이 그릇에 물을 가득 채웠을' : `물의 깊이가 ${depth} cm가 될 때까지 물을 넣었을`} 때 물의 부피가 ${nb(V('a') + 'π cm³')}이면 상수 ${V('a')}의 값은?`, val, {
          explain: `물의 부피는 ${intg(0, depth, 'π(' + 2 * r + X + ' ' + MINUS + ' ' + X + sup(2) + ')', 'x')} = ${nb('π')}${evl(r + X + sup(2) + ' ' + MINUS + ' ' + frac(X + sup(3), 3), 0, depth)} = ${nb(val + 'π')}이므로 ${nb(V('a') + ' = ' + val)}이다.${full ? ` 반구의 부피 ${nb(frac(2, 3) + 'π × ' + r + sup(3))}과 같다.` : ''}`,
          facts: { value: `${r}*${depth}**2-${depth}**3/3`, rule: full ? 'hemiFull' : 'hemiPart' } });
      }
      const rv = 3, xv = 1, want = Math.PI * (rv * rv - xv * xv), R = V('r');
      const opts = [{ h: nb('π(' + R + sup(2) + ' ' + MINUS + ' ' + X + sup(2) + ')'), v: want }, { h: nb('π(' + R + ' ' + MINUS + ' ' + X + ')' + sup(2)), v: Math.PI * (rv - xv) ** 2 }, { h: nb('π' + R + sup(2) + ' ' + MINUS + ' ' + X + sup(2)), v: Math.PI * rv * rv - xv * xv }, { h: nb('π(' + R + sup(2) + ' + ' + X + sup(2) + ')'), v: Math.PI * (rv * rv + xv * xv) }, { h: nb('π' + R + X), v: Math.PI * rv * xv }];
      const order = d.shuffle(opts), truth = order.map((o) => close(o.v, want));
      return C(`반지름의 길이가 ${R}인 반구를 밑면으로부터 높이가 ${X}인 곳에서 밑면에 평행한 평면으로 자른 단면의 넓이는? ${nb('(단, 0 ≤ ' + X + ' ≤ ' + R + ')')}`, order.map((o) => o.h), order.indexOf(opts[0]), {
        explain: `단면은 반지름의 길이가 ${nb(rt(R + sup(2) + ' ' + MINUS + ' ' + X + sup(2)))}인 원이므로 넓이는 ${opts[0].h}이다. 이것을 0부터 ${R}까지 적분하면 반구의 부피 ${nb(frac(2, 3) + 'π' + R + sup(3))}이 나온다.`,
        facts: { truth, want: true, check: [want], rule: 'hemi1' } });
    }, { count: 2 })
  ];

  // ═══ 바. 곡선 아래 도형을 밑면으로 하는 입체 ═══
  const baseText = (cur, tail, shape) => `곡선 ${jh(yEq(cur), '과/와')} ${tail} 둘러싸인 도형을 밑면으로 하고, ${X}축에 수직인 평면으로 자른 단면이 모두 ${shape}인 입체도형의 부피는?`;
  const vbase = [
    T('vbase-square', '곡선 아래 도형을 밑면으로, 단면이 정사각형인 입체의 부피', '②4', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['trig', 'q2', 'q3']);
        if (kind === 'trig') {
          const k = d.pick([2, 3, 4]), f = d.pick(['cos', 'sin']), E = f === 'cos' ? Q(1, 2) : Q(1), right = lq(f === 'cos' ? k : 2 * k), chk = integ((x) => k * (f === 'cos' ? Math.cos(x) : Math.sin(x)), 0, fl(E) * Math.PI);
          const cur = rt(k + trig(f, X)) + ' ' + nb('(0 ≤ ' + X + ' ≤ ' + piH(E) + ')');
          return pickC(d, baseText(cur, `${X}축으로`, '정사각형'), right, [lq(f === 'cos' ? 2 * k : k), lq(k * k), lq(f === 'cos' ? k * k : 2 * k * k), lq(1)], {
            chk, explain: `단면의 넓이는 ${nb('(' + rt(k + trig(f, X)) + ')' + sup(2) + ' = ' + k + trig(f, X))}이므로 부피는 ${intg(0, piH(E), k + trig(f, X), 'x')} = ${lH(right)}이다.`, rule: 'sq0' });
        }
        if (kind === 'q2') {
          const [a, b] = d.pick([[4, 3], [1, 2], [9, 4], [1, 3]]), right = L([1, ['ln', Q(b * b + a, a)]]), chk = integ((x) => 2 * x / (x * x + a), 0, b);
          return pickC(d, baseText(rt(frac('2' + X, X + sup(2) + ' + ' + a)), `${X}축 및 직선 ${jh(xEq(b), '으로/로')}`, '정사각형'), right, [L([2, ['ln', Q(b * b + a, a)]]), L([Q(1, 2), ['ln', Q(b * b + a, a)]]), L([1, ['ln', b * b + a]]), L([1, ['ln', Q(b + a, a)]]), L([1, ['ln', Q(b * b, a)]])], {
            chk, explain: `단면의 넓이는 ${frac('2' + X, X + sup(2) + ' + ' + a)}이고 분자는 분모의 도함수이므로 부피는 ${evl(fn('ln') + '(' + X + sup(2) + ' + ' + a + ')', 0, b)} = ${lH(right)}이다.`, rule: 'sq0' });
        }
        const [a, b] = d.pick([[3, 1], [1, 2], [8, 2], [1, 1]]), right = L([Q(4, 3), ['ln', Q(b ** 3 + a, a)]]), chk = integ((x) => 4 * x * x / (x ** 3 + a), 0, b);
        return pickC(d, baseText(frac('2' + X, rt(X + sup(3) + ' + ' + a)), `${X}축 및 직선 ${jh(xEq(b), '으로/로')}`, '정사각형'), right, [L([Q(2, 3), ['ln', Q(b ** 3 + a, a)]]), L([4, ['ln', Q(b ** 3 + a, a)]]), L([Q(4, 3), ['ln', b ** 3 + a]]), L([Q(1, 3), ['ln', Q(b ** 3 + a, a)]]), L([Q(4, 3), ['ln', Q(b * b + a, a)]])], {
          chk, explain: `단면의 넓이는 ${frac('4' + X + sup(2), X + sup(3) + ' + ' + a)}이고 ${nb(X + sup(3) + ' + ' + a + ' = ' + V('u'))}로 치환하면 부피는 ${frac(4, 3)}${evl(fn('ln') + '(' + X + sup(3) + ' + ' + a + ')', 0, b)} = ${lH(right)}이다.`, rule: 'sq0' });
      }
      const kind = d.pick(['lnroot', 'mix', 'trig']);
      if (kind === 'lnroot') {
        const c = d.pick([1, 2, 3]), right = lq(Q(c ** 3, 3)), chk = integ((x) => Math.log(x) ** 2 / x, 1, Math.exp(c));
        return pickC(d, baseText(frac(fn('ln') + ' ' + X, rt(X)), lineX(1, eH(Q(c))), '정사각형'), right, [lq(Q(c * c, 2)), lq(c ** 3), lq(Q(c ** 3, 2)), lq(Q(c, 3)), lq(Q(c ** 3, 9))], {
          chk, explain: `단면의 넓이는 ${frac('(' + fn('ln') + ' ' + X + ')' + sup(2), X)}이고 ${nb(fn('ln') + ' ' + X + ' = ' + V('u'))}로 치환하면 부피는 ${intg(0, c, V('u') + sup(2), 'u')} = ${lH(right)}이다.`, rule: 'sq1' });
      }
      if (kind === 'mix') {
        const a = d.pick([2, 4, 8]), right = L([qadd(Q(21 * a * a, 64), Q(7 * a, 6))], [2, ['ln', 2]]), chk = integ((x) => (a * x + 1 / Math.sqrt(x)) ** 2, 0.25, 1);
        return pickC(d, baseText(a + X + ' + ' + frac(1, rt(X)), lineX(frac(1, 4), 1), '정사각형'), right, [lq(qadd(Q(21 * a * a, 64), Q(7 * a, 6))), L([qadd(Q(21 * a * a, 64), Q(7 * a, 3))], [2, ['ln', 2]]), L([qadd(Q(21 * a * a, 64), Q(7 * a, 6))], [-2, ['ln', 2]]), L([qadd(Q(21 * a * a, 64), Q(7 * a, 6))], [1, ['ln', 2]]), L([qadd(Q(7 * a * a, 64), Q(7 * a, 6))], [2, ['ln', 2]])], {
          chk, explain: `단면의 넓이는 ${nb('(' + a + X + ' + ' + frac(1, rt(X)) + ')' + sup(2) + ' = ' + a * a + X + sup(2) + ' + ' + 2 * a + rt(X) + ' + ' + frac(1, X))}이므로 부피는 ${intg(frac(1, 4), 1, '(' + a * a + X + sup(2) + ' + ' + 2 * a + rt(X) + ' + ' + frac(1, X) + ')', 'x')} = ${lH(right)}이다.`, rule: 'sq1' });
      }
      const E = d.pick([Q(1, 3), Q(1, 4)]), right = ladd(lsub(lq(1), cosL(E)), E.q === 3 ? L([1, ['rt', 3]]) : lq(1)), chk = integ((x) => Math.sin(x) + 1 / Math.cos(x) ** 2, 0, fl(E) * Math.PI);
      const inner = trig('sin', X) + ' + ' + trig('sec', X, 2);
      return pickC(d, baseText(rt(inner) + ' ' + nb('(0 ≤ ' + X + ' ≤ ' + piH(E) + ')'), `${X}축, ${YY}축 및 직선 ${jh(xEq(piH(E)), '으로/로')}`, '정사각형'), right, [ladd(cosL(E), E.q === 3 ? L([1, ['rt', 3]]) : lq(1)), ladd(lsub(lq(1), cosL(E)), E.q === 3 ? L([Q(1, 3), ['rt', 3]]) : lq(Q(1, 2))), ladd(lsub(lq(1), cosL(E)), E.q === 3 ? lq(2) : L([1, ['rt', 2]])), lsub(lsub(lq(1), cosL(E)), E.q === 3 ? L([1, ['rt', 3]]) : lq(1))], {
        chk, explain: `단면의 넓이는 ${nb(inner)}이므로 부피는 ${intg(0, piH(E), '(' + inner + ')', 'x')} = ${evl(MINUS + trig('cos', X) + ' + ' + trig('tan', X), 0, piH(E))} = ${lH(right)}이다.`, rule: 'sq1' });
    }, { count: 2 }),
    T('vbase-tri', '곡선 아래 도형을 밑면으로, 단면이 정삼각형인 입체의 부피', '②5', (d) => {
      const kind = d.pick(['ln', 'exp']), R3 = L([Q(1, 4), ['rt', 3]]);
      if (kind === 'ln') {
        const a = d.pick([2, 3, 4]), c = d.pick([1, 2]), inner = L([c - 1 + a, ['e', c]], [1 - a]), right = lmul(R3, inner), chk = (Math.sqrt(3) / 4) * integ((x) => Math.log(x) + a, 1, Math.exp(c));
        return pickC(d, baseText(rt(fn('ln') + ' ' + X + ' + ' + a), lineX(1, eH(Q(c))), '정삼각형'), right, [inner, lmul(L([Q(1, 2), ['rt', 3]]), inner), lsc(inner, Q(1, 2)), lmul(R3, L([c + a, ['e', c]], [-a])), lmul(L([Q(1, 4)]), inner)], {
          chk, explain: `단면은 한 변의 길이가 ${rt(fn('ln') + ' ' + X + ' + ' + a)}인 정삼각형이므로 넓이는 ${nb(frac(rt(3), 4) + '(' + fn('ln') + ' ' + X + ' + ' + a + ')')}이다. 부피는 ${frac(rt(3), 4)}${evl(ms('x ln x - x') + ' + ' + a + X, 1, eH(Q(c)))} = ${lH(right)}이다.`, rule: 'tri' });
      }
      const b = d.pick([1, 2]), m = b === 2 ? d.pick([16, 7]) : d.pick([7, 3]), arg = Q(m + b, 1 + b), right = lmul(R3, L([1, ['ln', arg]])), chk = (Math.sqrt(3) / 4) * integ((x) => Math.exp(x) / (Math.exp(x) + b), 0, Math.log(m));
      const Xe = nb(fn('ln') + ' ' + m);
      return pickC(d, baseText(rt(frac(V('e') + sup(X), V('e') + sup(X) + ' + ' + b)), `${X}축, ${YY}축 및 직선 ${jh(xEq(Xe), '으로/로')}`, '정삼각형'), right, [L([1, ['ln', arg]]), lmul(L([Q(1, 2), ['rt', 3]]), L([1, ['ln', arg]])), lmul(R3, L([1, ['ln', m + b]])), L([Q(1, 4), ['ln', arg]]), lmul(R3, L([2, ['ln', arg]]))], {
        chk, explain: `단면은 한 변의 길이가 ${rt(frac(V('e') + sup(X), V('e') + sup(X) + ' + ' + b))}인 정삼각형이므로 넓이는 ${nb(frac(rt(3), 4) + ' × ' + frac(V('e') + sup(X), V('e') + sup(X) + ' + ' + b))}이다. 부피는 ${frac(rt(3), 4)}${evl(fn('ln') + '(' + V('e') + sup(X) + ' + ' + b + ')', 0, Xe)} = ${lH(right)}이다.`, rule: 'tri' });
    })
  ];
  function lineX(a, b) { return `${X}축 및 두 직선 ${xEq(a)}, ${jh(xEq(b), '으로/로')}`; }

  // ═══ 사. 좌표평면 위에서 점이 움직인 거리 ═══
  const askDist = (xh, yh, a, b) => `좌표평면 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${nb('(' + X + ', ' + YY + ')')}가 ${nb(X + ' = ' + xh)}, ${nb(YY + ' = ' + yh)}일 때, 시각 ${nb(TT + ' = ' + a)}에서 ${nb(TT + ' = ' + b)}까지 점 P가 움직인 거리는?`;
  const speedOf = (fx, fy) => (t) => Math.hypot(dnum(fx, t), dnum(fy, t));
  const integS = (f, a, b) => integ(f, a, b, 1e-10);
  const dist = [
    T('dist-const', '속력이 일정한 운동 — 원·직선', '②11', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, 2, 3, 4]), kind = d.pick(['t', 'pi', '2t']);
        let xh, yh, t1, t2, right, fx, fy;
        if (kind === 't') { t1 = 0; const e = d.pick([Q(1), Q(2), Q(1, 2)]); xh = (a === 1 ? '' : a) + trig('cos', TT); yh = (a === 1 ? '' : a) + trig('sin', TT); fx = (t) => a * Math.cos(t); fy = (t) => a * Math.sin(t); right = L([qmul(Q(a), e), ['pi', 1]]); t2 = { q: e, h: piH(e) }; }
        else if (kind === 'pi') { t1 = 1; t2 = { q: Q(d.pick([2, 3])), h: null }; t2.h = String(t2.q.p); xh = (a === 1 ? '' : a) + trig('cos', 'π' + TT); yh = (a === 1 ? '' : a) + trig('sin', 'π' + TT); fx = (t) => a * Math.cos(Math.PI * t); fy = (t) => a * Math.sin(Math.PI * t); right = L([a * (t2.q.p - 1), ['pi', 1]]); }
        else { t1 = 0; const e = d.pick([Q(1, 3), Q(1, 2)]); t2 = { q: e, h: piH(e) }; xh = (a === 1 ? '' : a) + trig('cos', '2' + TT); yh = (a === 1 ? '' : a) + trig('sin', '2' + TT); fx = (t) => a * Math.cos(2 * t); fy = (t) => a * Math.sin(2 * t); right = L([qmul(Q(2 * a), e), ['pi', 1]]); }
        const T1 = t1, T2 = kind === 'pi' ? t2.q.p : fl(t2.q) * Math.PI, chk = integS(speedOf(fx, fy), T1, T2);
        return pickC(d, askDist(xh, yh, T1, t2.h), right, [lsc(right, Q(1, 2)), lsc(right, 2), L([2 * a, ['pi', 1]]), lq(fl(right.t[0].c)), L([fl(right.t[0].c) * a, ['pi', 1]])], {
          chk, explain: `속력은 ${nb(rt('(' + frac(V('d') + X, V('d') + TT) + ')' + sup(2) + ' + (' + frac(V('d') + YY, V('d') + TT) + ')' + sup(2)))} = ${jh(String(kind === '2t' ? 2 * a : kind === 'pi' ? (a === 1 ? '' : a) + 'π' : a), '으로/로')} 일정하므로 움직인 거리는 ${lH(right)}이다.`, rule: 'const0' });
      }
      const kind = d.pick(['line', 'rot']), T2 = d.pick([1, 2, 3]);
      if (kind === 'line') {
        const [p, r] = d.pick([[1, 2], [3, 4], [2, 1], [1, 3], [4, 3]]), q = d.int(-3, 3), s = d.int(-3, 3), L2 = p * p + r * r, right = L([T2, ['rt', L2]]);
        const xh = ms(`${p === 1 ? '' : p}t ${q < 0 ? '- ' + -q : '+ ' + q}`), yh = ms(`${r === 1 ? '' : r}t ${s < 0 ? '- ' + -s : '+ ' + s}`), chk = integS(speedOf((t) => p * t + q, (t) => r * t + s), 0, T2);
        if (q === 0 || s === 0) return null;
        return pickC(d, askDist(xh, yh, 0, T2), right, [lq(T2 * (p + r)), L([1, ['rt', L2]]), lq(T2 * L2), L([2 * T2, ['rt', L2]]), lq(T2 * Math.abs(p - r) || T2 + 1)], {
          chk, explain: `${nb(frac(V('d') + X, V('d') + TT) + ' = ' + p)}, ${nb(frac(V('d') + YY, V('d') + TT) + ' = ' + r)}이므로 속력은 ${jh(nb(rt(p * p + ' + ' + r * r)), '으로/로')} 일정하고, 움직인 거리는 ${lH(right)}이다.`, rule: 'const1' });
      }
      const [A, Bv] = d.pick([[3, 4], [4, 3], [5, 12], [1, 1]]), L2 = A * A + Bv * Bv, right = L([T2, ['rt', L2]]);
      const xh = (A === 1 ? '' : A) + trig('sin', TT) + ' ' + MINUS + ' ' + (Bv === 1 ? '' : Bv) + trig('cos', TT), yh = (Bv === 1 ? '' : Bv) + trig('sin', TT) + ' + ' + (A === 1 ? '' : A) + trig('cos', TT);
      const chk = integS(speedOf((t) => A * Math.sin(t) - Bv * Math.cos(t), (t) => Bv * Math.sin(t) + A * Math.cos(t)), 0, T2);
      return pickC(d, askDist(xh, yh, 0, T2), right, [lq(T2 * (A + Bv)), lq(T2 * L2), L([1, ['rt', L2]]), lq(T2 * Math.abs(A - Bv) || 2 * T2)], {
        chk, explain: `${nb(frac(V('d') + X, V('d') + TT) + ' = ' + (A === 1 ? '' : A) + trig('cos', TT) + ' + ' + (Bv === 1 ? '' : Bv) + trig('sin', TT))}, ${nb(frac(V('d') + YY, V('d') + TT) + ' = ' + (Bv === 1 ? '' : Bv) + trig('cos', TT) + ' ' + MINUS + ' ' + (A === 1 ? '' : A) + trig('sin', TT))}이고 제곱해 더하면 ${nb((A * A + Bv * Bv) + '(' + trig('sin', TT, 2) + ' + ' + trig('cos', TT, 2) + ') = ' + L2)}이므로 속력은 ${jh(lH(L([1, ['rt', L2]])), '으로/로')} 일정하고, 움직인 거리는 ${lH(right)}이다.`, rule: 'const1' });
    }, { count: 2 }),
    T('dist-square', '속력의 제곱이 완전제곱식인 운동', '②12', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, 2, 4, 9]), T2 = d.pick([1, 2]), val = qadd(Q(T2 ** 3, 3), Q(a * T2));
        const yh = (a === 1 ? '' : a === 2 ? rt(2) : Math.sqrt(a)) + TT + sup(2), xh = frac(1, 3) + TT + sup(3) + ' ' + MINUS + ' ' + (a === 1 ? '' : a) + TT;
        return qAns(askDist(xh, yh, 0, T2), val, {
          explain: `${nb(frac(V('d') + X, V('d') + TT) + ' = ' + TT + sup(2) + ' ' + MINUS + ' ' + a)}, ${nb(frac(V('d') + YY, V('d') + TT) + ' = ' + (a === 1 ? '2' : a === 2 ? '2' + rt(2) : 2 * Math.sqrt(a)) + TT)}이므로 속력의 제곱은 ${nb('(' + TT + sup(2) + ' ' + MINUS + ' ' + a + ')' + sup(2) + ' + ' + 4 * a + TT + sup(2) + ' = (' + TT + sup(2) + ' + ' + a + ')' + sup(2))}이다. 움직인 거리는 ${intg(0, T2, '(' + TT + sup(2) + ' + ' + a + ')', 't')} = ${num(val)}이다.`,
          facts: { value: `${T2}**3/3+${a}*${T2}`, rule: 'sq0' } });
      }
      const kind = d.pick(['recip', 'quad', 'exp']);
      if (kind === 'recip') {
        const [a, b, c] = d.pick([[1, 1, 2], [4, 1, 4], [1, 4, 4], [9, 1, 6]]), T2 = d.pick([2, 3]), right = lq(qadd(Q(a * (T2 - 1)), Q(b * (T2 - 1), T2)));
        const xh = (a === 1 ? '' : a) + TT + ' + ' + frac(b, TT), yh = c + fn('ln') + ' ' + TT, chk = integS(speedOf((t) => a * t + b / t, (t) => c * Math.log(t)), 1, T2);
        return pickC(d, askDist(xh, yh, 1, T2), right, [lq(qsub(Q(a * (T2 - 1)), Q(b * (T2 - 1), T2))), lq(Q(a * (T2 - 1))), L([a * (T2 - 1)], [c, ['ln', T2]]), lq(qadd(Q(a * T2), Q(b, T2)))], {
          chk, explain: `속력의 제곱은 ${nb('(' + a + ' ' + MINUS + ' ' + frac(b, TT + sup(2)) + ')' + sup(2) + ' + ' + frac(c * c, TT + sup(2)) + ' = (' + a + ' + ' + frac(b, TT + sup(2)) + ')' + sup(2))}이므로 움직인 거리는 ${intg(1, T2, '(' + a + ' + ' + frac(b, TT + sup(2)) + ')', 't')} = ${lH(right)}이다.`, rule: 'sq1' });
      }
      if (kind === 'quad') {
        // x = at, y = t² − b ln t 에서 a² = 8b 이면 속력의 제곱이 (2t + b/t)²
        const [a, b] = d.pick([[4, 2], [8, 8], [2, Q(1, 2)]]), bq = typeof b === 'number' ? Q(b) : b, T2 = d.pick([2, 3, 'e']);
        const right = T2 === 'e' ? L([1, ['e', 2]], [qsub(bq, Q(1))]) : L([T2 * T2 - 1], [bq, ['ln', T2]]);
        const Tv = T2 === 'e' ? Math.E : T2, chk = integS(speedOf((t) => a * t, (t) => t * t - fl(bq) * Math.log(t)), 1, Tv), Th = T2 === 'e' ? V('e') : T2;
        const wr = T2 === 'e' ? [L([1, ['e', 2]], [qsub(Q(-1), bq)]), L([1, ['e', 2]], [bq]), L([1, ['e', 2]], [-1]), L([2, ['e', 2]], [qsub(bq, Q(2))])] : [L([T2 * T2 - 1], [qmul(bq, Q(-1)), ['ln', T2]]), L([T2 * T2], [bq, ['ln', T2]]), L([T2 * T2 - 1], [qmul(bq, Q(2)), ['ln', T2]]), lq(T2 * T2 - 1)];
        const bh = bq.q === 1 ? String(bq.p) : frac(bq.p, bq.q), bt = frac(bq.p, (bq.q === 1 ? '' : bq.q) + TT);
        return pickC(d, askDist(a + TT, TT + sup(2) + ' ' + MINUS + ' ' + bh + fn('ln') + ' ' + TT, 1, Th), right, wr, {
          chk, explain: `${nb(frac(V('d') + X, V('d') + TT) + ' = ' + a)}, ${nb(frac(V('d') + YY, V('d') + TT) + ' = 2' + TT + ' ' + MINUS + ' ' + bt)}이므로 속력의 제곱은 ${nb(a * a + ' + (2' + TT + ' ' + MINUS + ' ' + bt + ')' + sup(2) + ' = (2' + TT + ' + ' + bt + ')' + sup(2))}이다. 움직인 거리는 ${intg(1, Th, '(2' + TT + ' + ' + bt + ')', 't')} = ${lH(right)}이다.`, rule: 'sq1' });
      }
      const m = d.pick([2, 3]), right = L([m * m - 1], [1, ['ln', m]]), chk = integS(speedOf((t) => 2 * Math.SQRT2 * Math.exp(t), (t) => t - Math.exp(2 * t)), 0, Math.log(m));
      return pickC(d, askDist('2' + rt(2) + V('e') + sup(TT), TT + ' ' + MINUS + ' ' + V('e') + sup('2' + TT), 0, nb(fn('ln') + ' ' + m)), right, [L([m * m - 1], [-1, ['ln', m]]), L([m * m], [1, ['ln', m]]), lq(m * m - 1), L([2 * (m * m - 1)], [1, ['ln', m]])], {
        chk, explain: `속력의 제곱은 ${nb('8' + V('e') + sup('2' + TT) + ' + (1 ' + MINUS + ' 2' + V('e') + sup('2' + TT) + ')' + sup(2) + ' = (2' + V('e') + sup('2' + TT) + ' + 1)' + sup(2))}이므로 움직인 거리는 ${intg(0, fn('ln') + ' ' + m, '(2' + V('e') + sup('2' + TT) + ' + 1)', 't')} = ${lH(right)}이다.`, rule: 'sq1' });
    }, { count: 2 }),
    T('dist-tsqrt', '속력이 t√(1 + t²) 꼴인 운동 — 치환적분', '②13', (d) => {
      const kind = d.pick(['half', 'six', 'swap']), Tk = d.pick([[3, rt(3), 2], [4, '2', 5], [8, '2' + rt(2), 3], [1, '1', 2]]);
      const [T2sq, Th] = Tk, u = 1 + T2sq;
      const pw32 = L([u, ['rt', u]]);
      let c, xh, yh, fx, fy;
      if (kind === 'half') { c = 1; xh = frac(1, 2) + TT + sup(2); yh = frac(1, 3) + TT + sup(3); fx = (t) => t * t / 2; fy = (t) => t ** 3 / 3; }
      else if (kind === 'six') { c = 12; xh = ms('6t^2 + 4'); yh = ms('4t^3 + 2'); fx = (t) => 6 * t * t + 4; fy = (t) => 4 * t ** 3 + 2; }
      else { c = 6; xh = ms('1 - 2t^3'); yh = ms('3t^2'); fx = (t) => 1 - 2 * t ** 3; fy = (t) => 3 * t * t; }
      const right = lsc(ladd(pw32, lq(-1)), Q(c, 3)), chk = integS(speedOf(fx, fy), 0, Math.sqrt(T2sq));
      const text = d.bool() ? askDist(xh, yh, 0, Th) : `${nb('0 ≤ ' + TT + ' ≤ ' + Th)}일 때, 매개변수 ${TT}로 나타낸 곡선 ${nb(X + ' = ' + xh)}, ${nb(YY + ' = ' + yh)}의 길이는?`;
      return pickC(d, text, right, [lsc(pw32, Q(c, 3)), lsc(ladd(pw32, lq(-1)), Q(c, 2)), lsc(ladd(pw32, lq(-1)), Q(2 * c, 3)), lsc(ladd(L([1, ['rt', u]]), lq(-1)), Q(c, 3)), lsc(ladd(pw32, lq(-1)), Q(c, 6))], {
        chk, explain: `속력은 ${nb(rt('(' + frac(V('d') + X, V('d') + TT) + ')' + sup(2) + ' + (' + frac(V('d') + YY, V('d') + TT) + ')' + sup(2)) + ' = ' + (c === 1 ? '' : c) + TT + rt('1 + ' + TT + sup(2)))}이고 ${nb('1 + ' + TT + sup(2) + ' = ' + V('u'))}로 치환하면 ${intg(0, Th, (c === 1 ? '' : c) + TT + rt('1 + ' + TT + sup(2)), 't')} = ${num(Q(c, 3))}${evl(V('u') + rt(V('u')), 1, u)} = ${lH(right)}이다.`, rule: 'tsqrt' });
    }),
    T('dist-exptrig', '지수함수와 삼각함수의 곱으로 나타낸 운동', '②14', (d) => {
      const kind = d.pick(['pi', 'one', 'two', 'shift']), Tq = d.pick([1, 2, 3]);
      let xh, yh, fx, fy, T2 = Tq, k, kh, Th = String(Tq);
      if (kind === 'pi') { xh = V('e') + sup(TT) + trig('cos', 'π' + TT); yh = V('e') + sup(TT) + trig('sin', 'π' + TT); fx = (t) => Math.exp(t) * Math.cos(Math.PI * t); fy = (t) => Math.exp(t) * Math.sin(Math.PI * t); k = Math.sqrt(1 + Math.PI ** 2); kh = rt('1 + π' + sup(2)); }
      else if (kind === 'one') { xh = V('e') + sup(TT) + trig('cos', TT); yh = V('e') + sup(TT) + trig('sin', TT); fx = (t) => Math.exp(t) * Math.cos(t); fy = (t) => Math.exp(t) * Math.sin(t); k = Math.SQRT2; kh = rt(2); }
      else if (kind === 'two') { xh = V('e') + sup(TT) + trig('cos', '2' + TT); yh = V('e') + sup(TT) + trig('sin', '2' + TT); fx = (t) => Math.exp(t) * Math.cos(2 * t); fy = (t) => Math.exp(t) * Math.sin(2 * t); k = Math.sqrt(5); kh = rt(5); }
      else { xh = V('e') + sup(TT) + trig('sin', TT) + ' + 1'; yh = V('e') + sup(TT) + trig('cos', TT) + ' ' + MINUS + ' 1'; fx = (t) => Math.exp(t) * Math.sin(t) + 1; fy = (t) => Math.exp(t) * Math.cos(t) - 1; k = Math.SQRT2; kh = rt(2); T2 = d.pick([1, 'π']); Th = T2 === 'π' ? 'π' : '1'; }
      const Tv = T2 === 'π' ? Math.PI : T2, Eh = T2 === 'π' ? V('e') + sup('π') : eH(Q(T2)), E = Math.exp(Tv), chk = integS(speedOf(fx, fy), 0, Tv);
      const after = kind === 'pi', fmt = (inner, kk) => (after ? '(' + inner + ')' + kk : kk + '(' + inner + ')');
      const list = [{ h: fmt(Eh + ' ' + MINUS + ' 1', kh), v: k * (E - 1) }, { h: Eh + ' ' + MINUS + ' 1', v: E - 1 }, { h: nb(after ? Eh + kh : kh + Eh), v: k * E }, { h: fmt(Eh + ' + 1', kh), v: k * (E + 1) }, { h: fmt(Eh + ' ' + MINUS + ' 1', after ? '(1 + π)' : kind === 'two' ? '3' : '2'), v: (after ? 1 + Math.PI : kind === 'two' ? 3 : 2) * (E - 1) }];
      return pickRaw(d, askDist(xh, yh, 0, Th), list, {
        chk, explain: `곱의 미분으로 ${nb(frac(V('d') + X, V('d') + TT))}, ${nb(frac(V('d') + YY, V('d') + TT))}를 구해 제곱해 더하면 교차항이 지워져 속력은 ${nb(kh + V('e') + sup(TT))}이다. 움직인 거리는 ${intg(0, Th, kh + V('e') + sup(TT), 't')} = ${list[0].h}이다.`, rule: 'exptrig' });
    }),
    T('dist-astroid', '삼각함수의 세제곱으로 나타낸 운동', '②15', (d) => {
      const a = d.pick([1, 2, 3, 4, 5]), Tq = d.pick([Q(1, 6), Q(1, 4), Q(1, 3), Q(1, 2)]), s2 = Tq.q === 6 ? Q(1, 4) : Tq.q === 4 ? Q(1, 2) : Tq.q === 3 ? Q(3, 4) : Q(1);
      const val = qmul(Q(3 * a, 2), s2);
      if (isInt(val)) return null;
      const xh = (a === 1 ? '' : a) + trig('cos', TT, 3), yh = (a === 1 ? '' : a) + trig('sin', TT, 3);
      return qAns(askDist(xh, yh, 0, piH(Tq)), val, {
        explain: `${nb(frac(V('d') + X, V('d') + TT) + ' = ' + MINUS + 3 * a + trig('cos', TT, 2) + ' ' + trig('sin', TT))}, ${nb(frac(V('d') + YY, V('d') + TT) + ' = ' + 3 * a + trig('sin', TT, 2) + ' ' + trig('cos', TT))}이므로 속력은 ${nb(3 * a + '|' + trig('sin', TT) + ' ' + trig('cos', TT) + '|')}이고, 구간에서 ${nb(trig('sin', TT) + ' ' + trig('cos', TT) + ' ≥ 0')}이다. 움직인 거리는 ${intg(0, piH(Tq), 3 * a + trig('sin', TT) + ' ' + trig('cos', TT), 't')} = ${evl(frac(3 * a, 2) + trig('sin', TT, 2), 0, piH(Tq))} = ${num(val)}이다.`,
        facts: { value: `3*${a}/2*(${Math.sin(fl(Tq) * Math.PI) ** 2 > 0.9999 ? 1 : js(s2)})`, rule: 'astroid' } });
    }),
    T('dist-cycloid', '굴러가는 바퀴 위의 점이 움직인 거리 — 반각 공식', '②16', (d) => {
      const r = d.pick([1, 2, 3, 5]), full = d.bool(), val = full ? 8 * r : 4 * r;
      const xh = (r === 1 ? '' : r) + '(' + TT + ' ' + MINUS + ' ' + trig('sin', TT) + ')', yh = (r === 1 ? '' : r) + '(1 ' + MINUS + ' ' + trig('cos', TT) + ')';
      return qAns(`반지름의 길이가 ${r}인 바퀴 위의 점 P가 바퀴를 따라 움직인 자리가 ${nb(X + ' = ' + xh)}, ${nb(YY + ' = ' + yh)}이다. 시각 ${nb(TT + ' = 0')}에서 ${nb(TT + ' = ' + (full ? '2π' : 'π'))}까지 점 P가 움직인 거리는?`, val, {
        explain: `속력은 ${nb(rt('{' + r + '(1 ' + MINUS + ' ' + trig('cos', TT) + ')}' + sup(2) + ' + (' + r + trig('sin', TT) + ')' + sup(2)))} = ${nb(r + rt('2(1 ' + MINUS + ' ' + trig('cos', TT) + ')'))} = ${nb(2 * r + trig('sin', frac(TT, 2)))}이다(${nb('1 ' + MINUS + ' ' + trig('cos', TT) + ' = 2' + trig('sin', frac(TT, 2), 2))}). 움직인 거리는 ${intg(0, full ? '2π' : 'π', 2 * r + trig('sin', frac(TT, 2)), 't')} = ${val}이다.`,
        facts: { value: `${full ? 8 : 4}*${r}`, rule: full ? 'cycFull' : 'cycHalf' } });
    }),
    T('dist-k', '움직인 거리가 주어질 때 끝 시각 구하기', '②17', (d) => {
      const c = d.pick([1, 2]), k = d.pick([3, 5, 7]), mm = (k * k - 1) / 2;
      const xh = frac(1, 2) + TT + sup(2) + ' ' + MINUS + ' ' + (c === 1 ? '' : c * c) + fn('ln') + ' ' + TT, yh = 2 * c + TT, lnk = (c === 1 ? '' : c * c) + fn('ln') + ' ' + V('k');
      return qAns(`좌표평면 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${nb('(' + X + ', ' + YY + ')')}가 ${nb(X + ' = ' + xh)}, ${nb(YY + ' = ' + yh)}이다. 시각 ${nb(TT + ' = 1')}에서 ${nb(TT + ' = ' + V('k'))}까지 점 P가 움직인 거리가 ${nb(mm + ' + ' + lnk)}일 때, 자연수 ${V('k')}의 값은?`, k, {
        explain: `속력의 제곱은 ${nb('(' + TT + ' ' + MINUS + ' ' + frac(c * c, TT) + ')' + sup(2) + ' + ' + 4 * c * c + ' = (' + TT + ' + ' + frac(c * c, TT) + ')' + sup(2))}이므로 움직인 거리는 ${intg(1, 'k', '(' + TT + ' + ' + frac(c * c, TT) + ')', 't')} = ${nb(frac(V('k') + sup(2) + ' ' + MINUS + ' 1', 2) + ' + ' + lnk)}이다. ${nb(frac(V('k') + sup(2) + ' ' + MINUS + ' 1', 2) + ' = ' + mm)}에서 ${nb(V('k') + ' = ' + k)}이다.`,
        facts: { value: `(2*${mm}+1)**(1/2)`, rule: 'distk' } });
    }),
    T('dist-train', '속력이 줄어드는 열차가 움직인 거리(직선 위의 운동)', '②18', (d) => {
      const [a, c, b] = d.pick([[16, 4, 20], [20, 10, 25], [10, 5, 15], [14, 7, 21]]), Tt = (a * a - c * c) / b, val = Q(2 * (a ** 3 - c ** 3), 3 * b);
      if (!Number.isInteger(Tt) || isInt(val)) return null;
      return qAns(`${a} m/s의 속력으로 달리던 열차가 속력을 줄이기 시작한 지 ${TT}초 후의 속력은 ${nb(rt(a * a + ' ' + MINUS + ' ' + b + TT) + ' m/s')}라 한다. 이 열차의 속력이 ${c} m/s가 될 때까지 달린 거리는 몇 m인가?`, val, {
        unit: 'm',
        explain: `${nb(rt(a * a + ' ' + MINUS + ' ' + b + TT) + ' = ' + c)}에서 ${nb(TT + ' = ' + Tt)}이다. ${nb(a * a + ' ' + MINUS + ' ' + b + TT + ' = ' + V('u'))}로 치환하면 달린 거리는 ${intg(0, Tt, rt(a * a + ' ' + MINUS + ' ' + b + TT), 't')} = ${frac(1, b)}${intg(c * c, a * a, rt(V('u')), 'u')} = ${num(val)} (m)이다.`,
        facts: { value: `2*(${a * a}**(3/2)-${c}**3)/(3*${b})`, rule: 'train' } });
    })
  ];

  // ═══ 아. 곡선의 길이 ═══
  const askLen = (cur, lo, hi) => `곡선 ${nb(YY + ' = ' + cur)} ${nb('(' + lo + ' ≤ ' + X + ' ≤ ' + hi + ')')}의 길이는?`;
  // 끝점에서 정의역 밖을 건드리지 않게 도함수는 구간 안쪽으로 조금 옮겨 잰다.
  const arcLen = (f, a, b) => integ((x) => Math.sqrt(1 + dnum(f, Math.min(Math.max(x, a + 2e-6), b - 2e-6)) ** 2), a, b, 1e-10);
  const arc = [
    T('arc-pow', 'y = c(x + a)^(3/2) 꼴의 곡선의 길이', '②19', (d) => {
      const kind = d.pick(['k23', 'k43', 'k2', 'k13', 'shift']);
      let cur, m, x1, x2, f;
      if (kind === 'k23') { cur = frac(2, 3) + X + rt(X); m = Q(1); [x1, x2] = d.pick([[0, 3], [0, 8], [3, 8], [3, 15]]); f = (x) => (2 / 3) * x ** 1.5; }
      else if (kind === 'k43') { cur = frac(4, 3) + X + rt(X); m = Q(4); [x1, x2] = d.pick([[0, 2], [0, 6], [2, 6]]); f = (x) => (4 / 3) * x ** 1.5; }
      else if (kind === 'k2') { cur = '2' + X + rt(X); m = Q(9); [x1, x2] = d.pick([[0, 7]]); f = (x) => 2 * x ** 1.5; }
      else if (kind === 'k13') { cur = frac(1, 3) + X + rt(X); m = Q(1, 4); [x1, x2] = d.pick([[0, 12], [12, 32]]); f = (x) => x ** 1.5 / 3; }
      else { cur = frac(2, 3) + '(' + ms('x + 1') + ')' + rt(ms('x + 1')); m = Q(1); [x1, x2] = d.pick([[2, 7], [7, 14]]); f = (x) => (2 / 3) * (x + 1) ** 1.5; }
      const g = (x) => fl(m) * x + (kind === 'shift' ? 2 : 1), s1 = Math.sqrt(g(x1)), s2 = Math.sqrt(g(x2));
      if (!Number.isInteger(s1) || !Number.isInteger(s2)) return null;
      const val = qmul(Q(2 * m.q, 3 * m.p), Q(s2 ** 3 - s1 ** 3));
      if (isInt(val)) return null;
      if (!close(fl(val), arcLen(f, x1, x2))) throw new Error('곡선의 길이 셈이 다르다');
      return qAns(askLen(cur, x1, x2), val, {
        explain: `${nb(1 + ' + {' + V('f') + '′(' + X + ')}' + sup(2))}이 일차식 ${jh(kind === 'shift' ? ms('x + 2') : (fl(m) === 1 ? '' : num(m)) + X + ' + 1', '이/가')} 되므로 길이는 ${intg(x1, x2, rt(kind === 'shift' ? ms('x + 2') : (fl(m) === 1 ? '' : num(m)) + X + ' + 1'), 'x')} = ${num(val)}이다.`,
        facts: { value: `2/(3*${js(m)})*(${s2}**3-${s1}**3)`, rule: 'pow' } });
    }),
    T('arc-perfect', '1 + {f′(x)}²이 완전제곱식인 곡선의 길이', '②20', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['p2', 'p3', 'p2h', 'root']);
        let cur, f, a0, b0, val, dfH, sqH, antiH;
        if (kind === 'root') {
          // y = (1/3)(x − 3)√x: f′(x) = (1/2)(√x − 1/√x)
          const s = d.pick([2, 3, 4]); a0 = 1; b0 = s * s; cur = frac(1, 3) + '(' + ms('x - 3') + ')' + rt(X); f = (x) => (x - 3) * Math.sqrt(x) / 3; val = qsub(Q(s ** 3 + 3 * s, 3), Q(4, 3));
          dfH = frac(1, 2) + '(' + rt(X) + ' ' + MINUS + ' ' + frac(1, rt(X)) + ')'; sqH = frac(1, 2) + '(' + rt(X) + ' + ' + frac(1, rt(X)) + ')'; antiH = frac(1, 3) + X + rt(X) + ' + ' + rt(X);
        } else {
          // f′(x) = c·xᵃ − x⁻ᵃ/(4c) 이면 1 + {f′(x)}² = (c·xᵃ + x⁻ᵃ/(4c))²: y = c·xᵃ⁺¹/(a + 1) + x¹⁻ᵃ/(4c(a − 1))
          const [aa, c] = kind === 'p2' ? [2, Q(1)] : kind === 'p3' ? [3, Q(1, 2)] : [2, Q(1, 2)];
          b0 = d.pick([2, 3]); a0 = 1;
          const c1 = qmul(c, Q(1, aa + 1)), k2q = Q(c.q, 4 * c.p * (aa - 1)), k4 = Q(c.q, 4 * c.p);
          const xn = (p) => X + (p === 1 ? '' : sup(p)), cf = (q) => (q.p === q.q ? '' : num(q));
          cur = cf(c1) + xn(aa + 1) + ' + ' + frac(k2q.p, (k2q.q === 1 ? '' : k2q.q) + xn(aa - 1));
          f = (x) => fl(c1) * x ** (aa + 1) + fl(k2q) * x ** (1 - aa);
          val = qadd(qmul(c1, Q(b0 ** (aa + 1) - 1)), qmul(Q(k2q.p, k2q.q), qsub(Q(1), Q(1, b0 ** (aa - 1)))));
          dfH = cf(c) + xn(aa) + ' ' + MINUS + ' ' + frac(k4.p, (k4.q === 1 ? '' : k4.q) + xn(aa)); sqH = '(' + cf(c) + xn(aa) + ' + ' + frac(k4.p, (k4.q === 1 ? '' : k4.q) + xn(aa)) + ')';
          antiH = cf(c1) + xn(aa + 1) + ' ' + MINUS + ' ' + frac(k2q.p, (k2q.q === 1 ? '' : k2q.q) + xn(aa - 1));
        }
        if (!close(fl(val), arcLen(f, a0, b0)) || isInt(val)) return null;
        return qAns(askLen(cur, a0, b0), val, {
          explain: `${nb(V('f') + '′(' + X + ') = ' + dfH)}이므로 ${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = {' + sqH + '}' + sup(2))}이다. 길이는 ${intg(a0, b0, sqH, 'x')} = ${evl(antiH, a0, b0)} = ${num(val)}이다.`,
          facts: { value: `${val.p}/${val.q}`, rule: 'perf0' } });
      }
      if (n === 1) {
        const c = d.pick([Q(1, 8), Q(1, 4), Q(1, 2)]), b = d.pick([2, 3, 'e']), k = Q(c.q, 8 * c.p);
        const right = b === 'e' ? L([c, ['e', 2]], [qadd(qmul(c, Q(-1)), k)]) : L([qmul(c, Q(b * b - 1))], [k, ['ln', b]]);
        const bv = b === 'e' ? Math.E : b, f = (x) => fl(c) * x * x - fl(k) * Math.log(x), chk = arcLen(f, 1, bv), bh = b === 'e' ? V('e') : b;
        const cur = frac(X + sup(2), c.q) + ' ' + MINUS + ' ' + (fl(k) === 1 ? '' : num(k)) + fn('ln') + ' ' + X;
        const wr = b === 'e' ? [L([c, ['e', 2]], [qsub(qmul(c, Q(-1)), k)]), L([c, ['e', 2]], [qmul(c, Q(-1))]), L([c, ['e', 2]], [k]), L([qmul(c, Q(2)), ['e', 2]], [qadd(qmul(c, Q(-2)), k)])] : [L([qmul(c, Q(b * b - 1))], [qmul(k, Q(-1)), ['ln', b]]), lq(qmul(c, Q(b * b - 1))), L([qmul(c, Q(b * b))], [k, ['ln', b]]), L([qmul(c, Q(b * b - 1))], [qmul(k, Q(2)), ['ln', b]])];
        return pickC(d, askLen(cur, 1, bh), right, wr, {
          chk, explain: `${nb(V('f') + '′(' + X + ') = ' + num(qmul(c, Q(2))) + X + ' ' + MINUS + ' ' + frac(k.p, (k.q === 1 ? '' : k.q) + X))}이고 ${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = (' + num(qmul(c, Q(2))) + X + ' + ' + frac(k.p, (k.q === 1 ? '' : k.q) + X) + ')' + sup(2))}이므로 길이는 ${intg(1, bh, '(' + num(qmul(c, Q(2))) + X + ' + ' + frac(k.p, (k.q === 1 ? '' : k.q) + X) + ')', 'x')} = ${lH(right)}이다.`, rule: 'perf1' });
      }
      const kind = d.pick(['cosh', 'cosh0', 'e2']);
      if (kind === 'cosh') {
        const b = d.pick([1, 2]), right = L([1, ['e', b]], [-1, ['e', -b]]), chk = arcLen((x) => (Math.exp(x) + Math.exp(-x)) / 2, -b, b);
        return pickC(d, askLen(frac(V('e') + sup(X) + ' + ' + V('e') + sup(MINUS + X), 2), num(-b), b), right, [L([1, ['e', b]], [1, ['e', -b]]), L([Q(1, 2), ['e', b]], [Q(-1, 2), ['e', -b]]), L([1, ['e', b]], [1, ['e', -b]], [-2]), L([2, ['e', b]], [-2, ['e', -b]])], {
          chk, explain: `${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = ' + frac('(' + V('e') + sup(X) + ' + ' + V('e') + sup(MINUS + X) + ')' + sup(2), 4))}이므로 길이는 ${intg(-b, b, frac(V('e') + sup(X) + ' + ' + V('e') + sup(MINUS + X), 2), 'x')} = ${lH(right)}이다.`, rule: 'perf2' });
      }
      if (kind === 'cosh0') {
        const m = d.pick([2, 3, 4]), right = lq(Q(m * m - 1, 2 * m)), chk = arcLen((x) => (Math.exp(x) + Math.exp(-x) - 1) / 2, 0, Math.log(m));
        return pickC(d, askLen(frac(V('e') + sup(X) + ' + ' + V('e') + sup(MINUS + X) + ' ' + MINUS + ' 1', 2), 0, nb(fn('ln') + ' ' + m)), right, [lq(Q(m * m + 1, 2 * m)), lq(Q(m * m - 1, m)), lq(Q(m - 1, 2)), lq(Q(m * m - 1, 4 * m))], {
          chk, explain: `${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = ' + frac('(' + V('e') + sup(X) + ' + ' + V('e') + sup(MINUS + X) + ')' + sup(2), 4))}이므로 길이는 ${evl(frac(V('e') + sup(X) + ' ' + MINUS + ' ' + V('e') + sup(MINUS + X), 2), 0, nb(fn('ln') + ' ' + m))} = ${lH(right)}이다.`, rule: 'perf2' });
      }
      const b = d.pick([1, 2]), right = L([Q(1, 2), ['e', 2 * b]], [Q(-1, 8), ['e', -2 * b]], [Q(-3, 8)]), chk = arcLen((x) => Math.exp(2 * x) / 2 + Math.exp(-2 * x) / 8, 0, b);
      return pickC(d, askLen(frac(1, 2) + V('e') + sup('2' + X) + ' + ' + frac(1, 8) + V('e') + sup(MINUS + '2' + X), 0, b), right, [L([Q(1, 2), ['e', 2 * b]], [Q(1, 8), ['e', -2 * b]], [Q(-5, 8)]), L([Q(1, 2), ['e', 2 * b]], [Q(-1, 8), ['e', -2 * b]]), L([1, ['e', 2 * b]], [Q(-1, 4), ['e', -2 * b]], [Q(-3, 4)]), L([Q(1, 2), ['e', 2 * b]], [Q(-1, 8), ['e', -2 * b]], [Q(3, 8)])], {
        chk, explain: `${nb(V('f') + '′(' + X + ') = ' + V('e') + sup('2' + X) + ' ' + MINUS + ' ' + frac(1, 4) + V('e') + sup(MINUS + '2' + X))}이고 ${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = (' + V('e') + sup('2' + X) + ' + ' + frac(1, 4) + V('e') + sup(MINUS + '2' + X) + ')' + sup(2))}이므로 길이는 ${evl(frac(1, 2) + V('e') + sup('2' + X) + ' ' + MINUS + ' ' + frac(1, 8) + V('e') + sup(MINUS + '2' + X), 0, b)} = ${lH(right)}이다.`, rule: 'perf2' });
    }, { count: 3 }),
    T('arc-partial', '1 + {f′(x)}²이 유리식의 제곱인 곡선의 길이 — 부분분수', '②21', (d) => {
      const kind = d.pick(['big', 'small']);
      if (kind === 'big') {
        const [a, b] = d.pick([[2, 3], [3, 4], [3, 5], [2, 4]]), c = d.pick([1, 2, 3]), arg = Q((b - 1) * (a + 1), (b + 1) * (a - 1));
        const right = L([b - a], [1, ['ln', arg]]), chk = arcLen((x) => Math.log(x * x - 1) + c, a, b);
        return pickC(d, askLen(fn('ln') + '(' + X + sup(2) + ' ' + MINUS + ' 1) + ' + c, a, b), right, [L([b - a], [-1, ['ln', arg]]), L([1, ['ln', arg]]), L([b - a], [2, ['ln', arg]]), L([b - a], [1, ['ln', Q(b * b - 1, a * a - 1)]])], {
          chk, explain: `${nb(V('f') + '′(' + X + ') = ' + frac('2' + X, X + sup(2) + ' ' + MINUS + ' 1'))}이고 ${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = (' + frac(X + sup(2) + ' + 1', X + sup(2) + ' ' + MINUS + ' 1') + ')' + sup(2))}이다. ${nb(frac(X + sup(2) + ' + 1', X + sup(2) + ' ' + MINUS + ' 1') + ' = 1 + ' + frac(1, ms('x - 1')) + ' ' + MINUS + ' ' + frac(1, ms('x + 1')))}이므로 길이는 ${evl(X + ' + ' + fn('ln') + '|' + ms('x - 1') + '| ' + MINUS + ' ' + fn('ln') + '|' + ms('x + 1') + '|', a, b)} = ${lH(right)}이다.`, rule: 'part' });
      }
      const m = d.pick([2, 3]), arg = Q(m + 1, m - 1), right = L([Q(-1, m)], [1, ['ln', arg]]), chk = arcLen((x) => Math.log(1 - x * x), 0, 1 / m);
      return pickC(d, askLen(fn('ln') + '(1 ' + MINUS + ' ' + X + sup(2) + ')', 0, frac(1, m)), right, [L([Q(1, m)], [1, ['ln', arg]]), L([Q(-1, m)], [-1, ['ln', arg]]), L([1, ['ln', arg]]), L([Q(-1, m)], [2, ['ln', arg]])], {
        chk, explain: `${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = (' + frac('1 + ' + X + sup(2), '1 ' + MINUS + ' ' + X + sup(2)) + ')' + sup(2))}이고 ${nb(frac('1 + ' + X + sup(2), '1 ' + MINUS + ' ' + X + sup(2)) + ' = ' + MINUS + '1 + ' + frac(1, ms('1 - x')) + ' + ' + frac(1, ms('1 + x')))}이므로 길이는 ${lH(right)}이다.`, rule: 'part' });
    }),
    T('arc-k', '곡선의 길이가 주어질 때 끝 구하기', '②22', (d) => {
      const kind = d.pick(['k2', 'k23', 'k43']);
      let cur, m, k, s;
      if (kind === 'k2') { cur = '2' + X + rt(X); m = 9; s = d.pick([8, 10]); }
      else if (kind === 'k23') { cur = frac(2, 3) + X + rt(X); m = 1; s = d.pick([3, 4, 5]); }
      else { cur = frac(4, 3) + X + rt(X); m = 4; s = d.pick([3, 5, 7]); }
      k = (s * s - 1) / m;
      if (!Number.isInteger(k)) return null;
      const Lv = Q(2 * (s ** 3 - 1), 3 * m);
      return qAns(`${xEq(0)}에서 ${nb(X + ' = ' + V('k'))}까지 곡선 ${yEq(cur)}의 길이가 ${num(Lv)}일 때, 양수 ${V('k')}의 값은?`, k, {
        explain: `${nb('1 + {' + V('f') + '′(' + X + ')}' + sup(2) + ' = 1 + ' + (m === 1 ? '' : m) + X)}이므로 길이는 ${intg(0, 'k', rt('1 + ' + (m === 1 ? '' : m) + X), 'x')} = ${nb(num(Q(2, 3 * m)) + '{(1 + ' + (m === 1 ? '' : m) + V('k') + ')' + rt('1 + ' + (m === 1 ? '' : m) + V('k')) + ' ' + MINUS + ' 1}')}이다. 이것이 ${num(Lv)}이므로 ${nb(rt('1 + ' + (m === 1 ? '' : m) + V('k')) + ' = ' + s)}, ${nb(V('k') + ' = ' + k)}이다.`,
        facts: { value: `((3*${m}*${Lv.p}/(2*${Lv.q})+1)**(2/3)-1)/${m}`, rule: 'arck' } });
    })
  ];

  B.addTypes('11-5-7', 'between', between);
  B.addTypes('11-5-7', 'special', special);
  B.addTypes('11-5-7', 'vol', vol);
  B.addTypes('11-5-7', 'vbase', vbase);
  B.addTypes('11-5-7', 'dist', dist);
  B.addTypes('11-5-7', 'arc', arc);
})(typeof window !== 'undefined' ? window : globalThis);
