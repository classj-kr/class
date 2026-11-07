// 고등학교 미적분Ⅰ Ⅱ-2 도함수의 활용(2) — 뒤쪽 묶음(방정식의 실근의 개수, 부등식이 늘 성립할 조건, 속도와 가속도).
// 틀·도구와 싣는 기준, 뺀 것과 까닭은 11-2-5a.js 머리에 있다. ref: ①n = 기본꼴_1의 n번.
// 실근의 개수는 극점을 먼저 정해 짓고, 극점(정류점)마다의 함숫값의 부호로 센다(이웃한 정류점 사이에서는 함수가 한쪽으로만 움직인다).
// 속도와 가속도는 직선 운동만 다룬다. 위치 x 를 시각 t 로 미분한 것이 속도 v, v 를 미분한 것이 가속도 a 이다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, V, sup, nb, LAB } = B.kit.mid;
  const { jh, df, plot, qAns, signed } = B.kit.hs;
  const { S9, S10, X, TT, T, near, sgn, toQ, isIntV, qt, js, qj, sgnT, padd, pscale, psub, pmul, pval, pder, pint, lin1, fromRoots, intCoef, ptext, pjs, fx, fIs, facText, closed, cubicOf, quarticOf, kindAt, endClause } = B.kit.u25x;

  // 다항식의 실근(서로 다른 것)의 개수: 정류점 crits(모두, 차례대로)의 함숫값 부호와 양 끝의 부호로 센다.
  function rootCount(a, crits) {
    const deg = a.length - 1, lead = sgn(a[deg]), vals = crits.map((x) => sgn(pval(a, x)));
    const seq = [deg % 2 === 0 ? lead : -lead].concat(vals, [lead]);
    let n = vals.filter((v) => v === 0).length;
    for (let i = 0; i + 1 < seq.length; i += 1) if (seq[i] * seq[i + 1] < 0) n += 1;
    return n;
  }
  // 도함수의 값을 문제에 적힌 계수로 셈하는 식: k 번 미분한 다항식에 t 를 넣는다(곱하는 수 i, i(i − 1) 은 글에 없는 수).
  function dvjs(a, t, k) {
    const out = [];
    a.forEach((c, i) => {
      if (near(c, 0) || i < k) return;
      const mul = k === 1 ? i : i * (i - 1), pow = i - k;
      out.push(`${mul === 1 ? '' : mul + '*'}${js(c)}${pow === 0 ? '' : '*' + t + (pow > 1 ? '**' + pow : '')}`);
    });
    return out.join('+') || '0';
  }
  const MULS = [2, 3, 4, 6, 12];
  // 극값의 말
  const peaks = (a, crits) => crits.map((x) => `${nb(`${fx('f', qt(x))} = ${qt(pval(a, x))}`)}`).join(', ');
  // 삼차함수 짓기: f′ = 3k(x − p)(x − q), 계수가 정수
  function cubicPQ(d, k, lo, hi) {
    const p = d.int(lo, hi - 1), q = d.int(p + 1, hi);
    if ((3 * k * (p + q)) % 2) return null;
    return { p, q, g: cubicOf(k, p, q, 0) };
  }
  const countWords = (n) => (n === 0 ? '만나지 않는다' : `서로 다른 ${n}개의 점에서 만난다`);

  // ════════════════════════════════════════════════════════════════
  // 방정식의 실근의 개수
  // ════════════════════════════════════════════════════════════════
  const roots = [
    T('roots-steps', '방정식의 실근의 개수를 구하는 과정의 빈칸', '①19', (d) => {
      const c = cubicPQ(d, d.pick([1, 2]), -3, 3);
      if (!c) return null;
      const a = padd(c.g, [d.int(-8, 8)]);
      if (!intCoef(a) || near(a[0], 0)) return null;
      const Mx = pval(a, c.p), mn = pval(a, c.q), n = rootCount(a, [c.p, c.q]);
      if (Math.abs(Mx) > 60 || Math.abs(mn) > 60) return null;
      const steps = lines([
        `${nb(`${fx()} = `)}${jh(ptext(a), '이라/라')} 하면 ${nb(`${df('f')}(${X}) = `)}${facText(3 * a[3], [c.p, c.q])}이다.`,
        `${nb(`${df('f')}(${X}) = 0`)}에서 ${nb(`${X} = ${qt(c.p)}`)} 또는 ${nb(`${X} = ${qt(c.q)}`)}이다.`,
        `함수 ${fx()}는 ${nb(`${X} = ${qt(c.p)}`)}에서 극댓값 (가), ${nb(`${X} = ${qt(c.q)}`)}에서 극솟값 (나)를 가진다.`,
        `따라서 함수 ${nb(`${V('y')} = ${fx()}`)}의 그래프는 x축과 서로 다른 (다)개의 점에서 만나므로 방정식의 서로 다른 실근의 개수는 (다)이다.`
      ]);
      return M(`다음은 방정식 ${nb(ptext(a) + ' = 0')}의 서로 다른 실근의 개수를 구하는 과정이다. (가), (나), (다)에 알맞은 수는?`, [{ label: '(가)', answer: Mx, signed: true }, { label: '(나)', answer: mn, signed: true }, { label: '(다)', answer: n }], {
        figure: steps,
        explain: `${peaks(a, [c.p, c.q])}이다. 극댓값과 극솟값의 부호를 보면 그래프는 x축과 ${countWords(n)}.`,
        facts: { calc: [[pjs(a, js(c.p)), 0], [pjs(a, js(c.q)), 1]], derived: [Math.abs(c.p), Math.abs(c.q), 2, 3], check: { poly: a, crits: [c.p, c.q], count: n } } });
    }),
    T('roots-cubic', '삼차방정식의 서로 다른 실근의 개수', '①20', (d, n) => {
      // n = 0: f(x) = 0, n = 1: 양변에 식이 있는 방정식(극값이 없는 것이 섞인다), n = 2: f(x) = 0 과 f(x) = k 두 방정식
      if (n === 1) {
        let h, crits, why;
        if (d.bool()) {
          const p = d.int(-2, 2), w = d.pick([0, 0, 1, 2]);
          h = padd(pint(padd(pmul(lin1(p), lin1(p)), [w]).map((v) => v * 3)), [d.int(-6, 6)]); crits = w === 0 ? [p] : [];
          why = `${facText(3, [p, p])}${w ? ` + ${3 * w} &gt; 0` : ' ≥ 0'}이므로 ${fx()}는 실수 전체의 집합에서 증가하고`;
        } else { const c = cubicPQ(d, 1, -3, 3); if (!c) return null; h = padd(c.g, [d.int(-6, 6)]); crits = [c.p, c.q]; why = `${facText(3, crits)}이고 극값은 ${peaks(h, crits)}이므로`; }
        if (!intCoef(h)) return null;
        const r = [d.int(-5, 5), d.int(-6, 6), d.pick([-2, -1, 1, 2, 3])], L = padd(h, r), cnt = rootCount(h, crits);
        if (L.length < 4 || L.slice(0, 3).every((v) => near(v, 0))) return null;
        return N(`방정식 ${nb(ptext(L) + ' = ' + ptext(r))}의 서로 다른 실근의 개수는?`, cnt, {
          explain: `우변을 옮기면 ${nb(ptext(h) + ' = 0')}이다. ${nb(`${fx()} = `)}${jh(ptext(h), '이라/라')} 하면 ${nb(`${df('f')}(${X}) = `)}${why} 그래프는 x축과 ${countWords(cnt)}. 실근의 개수는 ${cnt}이다.`,
          facts: { rule: 'cubic-1', check: { poly: h, crits, count: cnt } } });
      }
      const c = cubicPQ(d, d.pick([1, 2, -1, -2]), -3, 3);
      if (!c) return null;
      const g = c.g, gp = pval(g, c.p), gq = pval(g, c.q), want = d.pick([1, 2, 3]);
      let k0;
      const lo = Math.min(-gp, -gq), hi = Math.max(-gp, -gq);
      if (want === 3) { if (hi - lo < 2) return null; k0 = d.int(lo + 1, hi - 1); } else if (want === 2) k0 = d.pick([lo, hi]); else k0 = d.bool() ? hi + d.int(1, 6) : lo - d.int(1, 6);
      const a = padd(g, [k0]);
      if (!intCoef(a)) return null;
      const cnt = rootCount(a, [c.p, c.q]);
      if (n === 0) {
        if (near(a[0], 0)) return null;
        return N(`방정식 ${nb(ptext(a) + ' = 0')}의 서로 다른 실근의 개수는?`, cnt, {
          explain: `${nb(`${fx()} = `)}${jh(ptext(a), '이라/라')} 하면 ${nb(`${df('f')}(${X}) = `)}${facText(3 * a[3], [c.p, c.q])}이고 ${peaks(a, [c.p, c.q])}이다. 그래프는 x축과 ${countWords(cnt)}.`,
          facts: { rule: 'cubic-0', check: { poly: a, crits: [c.p, c.q], count: cnt } } });
      }
      // n = 2: 두 값 0, K
      const vals = [pval(a, c.p), pval(a, c.q)].sort((u, v) => u - v);
      const K = d.pick([vals[0], vals[1], vals[1] + d.int(1, 5), vals[0] - d.int(1, 5), Math.round((vals[0] + vals[1]) / 2)].filter((v) => !near(v, 0) && Math.abs(v) <= 99));
      if (K == null) return null;
      const cK = rootCount(padd(a, [-K]), [c.p, c.q]);
      return M(`함수 ${fIs(a)}에 대하여 두 방정식 ${nb(`${fx()} = 0`)}, ${nb(`${fx()} = ${qt(K)}`)}의 서로 다른 실근의 개수는?`, [{ label: nb(`${fx()} = 0`), answer: cnt }, { label: nb(`${fx()} = ${qt(K)}`), answer: cK }], {
        explain: `${nb(`${df('f')}(${X}) = `)}${facText(3 * a[3], [c.p, c.q])}이고 극값은 ${peaks(a, [c.p, c.q])}이다. 곡선 ${nb(`${V('y')} = ${fx()}`)}는 직선 ${nb(`${V('y')} = 0`)}과 ${cnt}개, 직선 ${jh(nb(`${V('y')} = ${qt(K)}`), '과/와')} ${cK}개의 점에서 만난다.`,
        facts: { rule: 'cubic-2', check: { poly: a, crits: [c.p, c.q], count: [cnt, cK], K } } });
    }, { count: 3 }),
    T('roots-quartic', '사차방정식의 서로 다른 실근의 개수', '①21', (d, n) => {
      let a, crits;
      if (n === 0) {
        const p = d.int(-3, 1), q = d.int(p + 1, 2), r = d.int(q + 1, 3);
        if ((p + q + r) % 3) return null;
        a = padd(quarticOf(1, p, q, r, 0), [d.int(-12, 12)]); crits = [p, q, r];
      } else {
        // f′ = 12(x − p)²(x − q): x = p 에서는 극값이 없다.
        const p = d.int(-2, 2), q = d.pick([-2, -1, 0, 1, 2].filter((v) => v !== p));
        a = padd(pint(fromRoots([p, p, q], 12)), [d.int(-12, 12)]); crits = [p, q].sort((u, v) => u - v);
      }
      if (!intCoef(a) || near(a[0], 0) || crits.some((x) => Math.abs(pval(a, x)) > 80)) return null;
      const cnt = rootCount(a, crits);
      return N(`방정식 ${nb(ptext(a) + ' = 0')}의 서로 다른 실근의 개수는?`, cnt, {
        explain: `${nb(`${fx()} = `)}${jh(ptext(a), '이라/라')} 하면 ${nb(`${df('f')}(${X}) = `)}${facText(a[4] * 4, n === 0 ? crits : [crits.find((x) => kindAt(a, x) === 'flat'), crits.find((x) => kindAt(a, x) === 'flat'), crits.find((x) => kindAt(a, x) !== 'flat')])}이다. `
          + crits.map((x) => (kindAt(a, x) === 'flat' ? `${nb(`${X} = ${qt(x)}`)}에서는 극값을 갖지 않고 ${nb(`${fx('f', qt(x))} = ${qt(pval(a, x))}`)}` : `${nb(`${X} = ${qt(x)}`)}에서 ${kindAt(a, x) === 'max' ? '극댓값' : '극솟값'} ${qt(pval(a, x))}`)).join(', ')
          + `이므로 그래프는 x축과 ${countWords(cnt)}.`,
        facts: { rule: 'quartic-' + n, check: { poly: a, crits, count: cnt } } });
    }, { count: 2 }),
    T('roots-mm', '극댓값과 극솟값의 곱의 부호로 삼차방정식의 실근의 개수 구하기', '①22', (d) => {
      const c = d.pick([['&gt; 0', 1, '극댓값과 극솟값의 부호가 같아 그래프가 x축과 한 점에서만 만난다'], ['= 0', 2, '극댓값과 극솟값 가운데 하나가 0이라 그래프가 x축에 접하고 다른 한 점에서 만난다'], ['&lt; 0', 3, '극댓값은 양수, 극솟값은 음수라 그래프가 x축과 세 점에서 만난다']]);
      return N(`삼차함수 ${fx()}가 극댓값 ${V('M')}과 극솟값 ${V('m')}을 갖는다. ${nb(`${V('M')}${V('m')} ${c[0]}`)}일 때, 방정식 ${nb(`${fx()} = 0`)}의 서로 다른 실근의 개수는?`, c[1], {
        explain: `${nb(`${V('M')}${V('m')} ${c[0]}`)}이면 ${c[2]}. 따라서 실근의 개수는 ${c[1]}이다.`, facts: { check: { sign: c[0], count: c[1] } } });
    }),
    T('roots-k3', '서로 다른 세 실근을 갖도록 하는 상수의 범위', '①23', (d, n) => {
      const c = cubicPQ(d, d.pick([1, -1, 2]), -3, 3);
      if (!c) return null;
      const g = c.g, A = pval(g, c.p), Bv = pval(g, c.q);
      if (Math.abs(A - Bv) < 3 || Math.abs(A) > 60 || Math.abs(Bv) > 60) return null;
      if (n === 0) {
        // g(x) + k = 0 ⇔ −g(x) = k: k 는 −g 의 두 극값 사이
        const lo = Math.min(-A, -Bv), hi = Math.max(-A, -Bv), at = -A === lo ? c.p : c.q, bt = at === c.p ? c.q : c.p;
        return M(`방정식 ${nb(`${ptext(g)} + ${V('k')} = 0`)}이 서로 다른 세 실근을 갖도록 하는 실수 ${V('k')}의 값의 범위가 ${nb(`${V('α')} &lt; ${V('k')} &lt; ${V('β')}`)}일 때, ${V('α')}, ${V('β')}의 값은?`,
          [{ label: V('α'), answer: lo, signed: true }, { label: V('β'), answer: hi, signed: true }], {
            explain: `${nb(`${MINUS}(${ptext(g)}) = ${V('k')}`)}이므로 곡선 ${jh(nb(`${V('y')} = ${ptext(pscale(g, -1))}`), '과/와')} 직선 ${nb(`${V('y')} = ${V('k')}`)}가 세 점에서 만나야 한다. 이 함수의 극값은 ${qt(-A)}, ${qt(-Bv)}이므로 ${nb(`${qt(lo)} &lt; ${V('k')} &lt; ${qt(hi)}`)}이다.`,
            facts: { calc: [[`-(${pjs(g, js(at))})`, 0], [`-(${pjs(g, js(bt))})`, 1]], derived: [Math.abs(c.p), Math.abs(c.q), 2, 3], rule: 'k3-0' } });
      }
      const lo = Math.min(A, Bv), hi = Math.max(A, Bv), at = A === hi ? c.p : c.q, bt = at === c.p ? c.q : c.p, cnt = hi - lo - 1;
      return N(`방정식 ${nb(`${ptext(g)} = ${V('a')}`)}가 서로 다른 세 실근을 갖도록 하는 정수 ${V('a')}의 개수는?`, cnt, {
        explain: `곡선 ${jh(nb(`${V('y')} = ${ptext(g)}`), '과/와')} 직선 ${nb(`${V('y')} = ${V('a')}`)}가 세 점에서 만나야 한다. 극값이 ${qt(lo)}, ${qt(hi)}이므로 ${nb(`${qt(lo)} &lt; ${V('a')} &lt; ${qt(hi)}`)}이고 정수 ${V('a')}는 ${cnt}개이다.`,
        facts: { calc: [[`${pjs(g, js(at))}-(${pjs(g, js(bt))})-1`, 0]], derived: [Math.abs(c.p), Math.abs(c.q), 2, 3], rule: 'k3-1' } });
    }, { count: 2 }),
    T('roots-curves3', '곡선과 직선(두 곡선)이 세 점에서 만나도록 하는 상수', '①24', (d, n) => {
      const c = cubicPQ(d, 1, -3, 3);
      if (!c) return null;
      const h = c.g, A = pval(h, c.p), Bv = pval(h, c.q), lo = Math.min(A, Bv), hi = Math.max(A, Bv), at = A === hi ? c.p : c.q, bt = at === c.p ? c.q : c.p;
      if (hi - lo < 3 || hi - lo > 120) return null;
      if (n === 0) {
        // 곡선 y = h(x) + βx, 직선 y = βx + k
        const beta = d.pick([-6, -4, -3, -2, 2, 3, 4, 5, 6]), curve = padd(h, [0, beta]), cnt = hi - lo - 1;
        if (near(curve[1], 0) && near(curve[2], 0)) return null;
        return N(`곡선 ${jh(nb(`${V('y')} = ${ptext(curve)}`), '과/와')} 직선 ${jh(nb(`${V('y')} = ${ptext([0, beta])} + ${V('k')}`), '이/가')} 서로 다른 세 점에서 만나도록 하는 정수 ${V('k')}의 개수는?`, cnt, {
          explain: `${nb(`${ptext(curve)} = ${ptext([0, beta])} + ${V('k')}`)}에서 ${nb(`${ptext(h)} = ${V('k')}`)}이다. 함수 ${nb(`${V('y')} = ${ptext(h)}`)}의 극값이 ${qt(lo)}, ${qt(hi)}이므로 ${nb(`${qt(lo)} &lt; ${V('k')} &lt; ${qt(hi)}`)}이고 정수 ${V('k')}는 ${cnt}개이다.`,
          facts: { calc: [[`${pjs(curve, js(at))}-${js(beta)}*${js(at)}-(${pjs(curve, js(bt))}-${js(beta)}*${js(bt)})-1`, 0]], derived: [Math.abs(c.p), Math.abs(c.q), 2, 3], rule: 'curves3-0' } });
      }
      // 두 곡선 y = h(x) + q(x), y = q(x) + k (q 는 이차식)
      const q = [0, d.int(-6, 6), d.pick([-2, -1, 1, 2, 3])], up = padd(h, q);
      return M(`두 곡선 ${nb(`${V('y')} = ${ptext(up)}`)}, ${jh(nb(`${V('y')} = ${ptext(q)} + ${V('k')}`), '이/가')} 서로 다른 세 점에서 만나도록 하는 실수 ${V('k')}의 값의 범위가 ${nb(`${V('α')} &lt; ${V('k')} &lt; ${V('β')}`)}일 때, ${V('α')}, ${V('β')}의 값은?`,
        [{ label: V('α'), answer: lo, signed: true }, { label: V('β'), answer: hi, signed: true }], {
          explain: `두 식을 같다고 놓고 정리하면 ${nb(`${ptext(h)} = ${V('k')}`)}이다. 함수 ${nb(`${V('y')} = ${ptext(h)}`)}의 극값이 ${qt(lo)}, ${qt(hi)}이므로 ${nb(`${qt(lo)} &lt; ${V('k')} &lt; ${qt(hi)}`)}이다.`,
          facts: { calc: [[`${pjs(up, js(bt))}-(${pjs(q, js(bt))})`, 0], [`${pjs(up, js(at))}-(${pjs(q, js(at))})`, 1]], derived: [Math.abs(c.p), Math.abs(c.q), 2, 3], rule: 'curves3-1' } });
    }, { count: 2 }),
    T('roots-k2', '서로 다른 두 실근을 갖도록 하는 상수', '①25', (d, n) => {
      const c = cubicPQ(d, d.pick([1, 2]), -3, 3);
      if (!c) return null;
      const h = c.g, A = pval(h, c.p), Bv = pval(h, c.q);
      if (Math.abs(A - Bv) < 3 || Math.abs(A) > 60 || Math.abs(Bv) > 60 || near(A, 0) || near(Bv, 0) || near(A + Bv, 0)) return null;   // 두 값이 부호만 다르면 부호를 모두 뒤집은 답도 맞게 되어 쓰지 않는다
      if (n === 0) {
        const ks = [-A, -Bv];
        return inline(`방정식 ${nb(`${ptext(h)} + ${V('k')} = 0`)}이 서로 다른 두 실근을 갖도록 하는 실수 ${V('k')}의 값을 모두 구하시오.`, `${V('k')} = {0} 또는 ${V('k')} = {1}`, ks.map((v) => ({ answer: v, signed: true })), {
          unordered: true, shown: `${V('k')} = ${qt(ks[0])} 또는 ${V('k')} = ${qt(ks[1])}`,
          explain: `서로 다른 두 실근을 가지려면 그래프가 x축에 접해야 하므로 극값 가운데 하나가 0이어야 한다. ${nb(`${fx()} = `)}${ptext(h)} + ${V('k')}의 극값은 ${nb(`${qt(A)} + ${V('k')}`)}, ${nb(`${qt(Bv)} + ${V('k')}`)}이므로 ${nb(`${V('k')} = ${qt(-A)}`)} 또는 ${nb(`${V('k')} = ${qt(-Bv)}`)}이다.`,
          facts: { calc: [[`-(${pjs(h, js(c.p))})`, 0], [`-(${pjs(h, js(c.q))})`, 1]], derived: [Math.abs(c.p), Math.abs(c.q), 2, 3], rule: 'k2-0' } });
      }
      const q = [d.int(-5, 5), d.int(-6, 6), d.pick([-2, -1, 1, 2, 3])], up = padd(h, q);
      return inline(`두 곡선 ${nb(`${V('y')} = ${ptext(up)}`)}, ${jh(nb(`${V('y')} = ${ptext(q)} + ${V('k')}`), '이/가')} 서로 다른 두 점에서 만나도록 하는 실수 ${V('k')}의 값을 모두 구하시오.`, `${V('k')} = {0} 또는 ${V('k')} = {1}`, [{ answer: A, signed: true }, { answer: Bv, signed: true }], {
        unordered: true, shown: `${V('k')} = ${qt(A)} 또는 ${V('k')} = ${qt(Bv)}`,
        explain: `두 식을 같다고 놓으면 ${nb(`${ptext(h)} = ${V('k')}`)}이다. 곡선 ${jh(nb(`${V('y')} = ${ptext(h)}`), '과/와')} 직선 ${nb(`${V('y')} = ${V('k')}`)}가 두 점에서 만나려면 직선이 극점을 지나야 하므로 ${V('k')}는 극값 ${qt(A)}, ${qt(Bv)}이다.`,
        facts: { calc: [[`${pjs(up, js(c.p))}-(${pjs(q, js(c.p))})`, 0], [`${pjs(up, js(c.q))}-(${pjs(q, js(c.q))})`, 1]], derived: [Math.abs(c.p), Math.abs(c.q), 2, 3], rule: 'k2-1' } });
    }, { count: 2 }),
    T('roots-one', '두 곡선이 오직 한 점에서 만나도록 하는 상수(사차함수)', '①26', (d) => {
      // h = f − g = 3x⁴ − 4px³ + 6sx² − 12psx + (β − k), h′ = 12(x − p)(x² + s): 극점은 x = p 하나뿐이고 h(p) = 0 이어야 한다.
      const p = d.pick([-2, -1, 1, 2]), s = d.int(1, 3), al = d.int(1, 6), be = d.int(5, 15);
      const f = [be, 0, al, 0, 3], gk = [0, 12 * p * s, al - 6 * s, 4 * p], k = pval(f, p) - pval(gk, p);
      if (Math.abs(k) > 99) return null;
      return N(`두 함수 ${fIs(f)}, ${nb(`${fx('g')} = `)}${ptext(gk)} + ${V('k')}에 대하여 곡선 ${nb(`${V('y')} = ${fx()}`)}와 곡선 ${nb(`${V('y')} = ${fx('g')}`)}가 오직 한 점에서 만날 때, 상수 ${V('k')}의 값은?`, k, {
        signed: true,
        explain: `${nb(`${fx('h')} = ${fx()} ${MINUS} ${fx('g')}`)}라 하면 ${nb(`${df('h')}(${X}) = ${facText(12, [p])}(${X}${sup(2)} + ${s})`)}이므로 ${fx('h')}는 ${nb(`${X} = ${qt(p)}`)}에서만 극소이자 최소이다. 오직 한 점에서 만나려면 최솟값 ${nb(`${fx('h', qt(p))} = ${qt(pval(f, p) - pval(gk, p))} ${MINUS} ${V('k')}`)}가 0이어야 하므로 ${nb(`${V('k')} = ${qt(k)}`)}이다.`,
        facts: { calc: [[`${pjs(f, js(p))}-(${pjs(gk, js(p))})`, 0]], derived: [Math.abs(p), 2, 3, 4] } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 부등식이 늘 성립할 조건
  // ════════════════════════════════════════════════════════════════
  const ineq = [
    T('ineq-proof', '부등식이 성립함을 보이는 과정의 빈칸(최소가 되는 점과 최솟값)', '①32', (d, n) => {
      if (n === 0) {
        // x ≥ 0 에서 f(x) = x³ + bx² + cx + e > 0: 극점 p < 0 < q, 최소는 x = q
        const p = d.int(-3, -1), q = d.int(1, 4);
        if ((p + q) % 2) return null;
        const g = cubicOf(1, p, q, 0), m0 = d.int(1, 9), e = m0 - pval(g, q), a = padd(g, [e]);
        if (!intCoef(a) || e <= 0 || e > 99) return null;
        const steps = lines([
          `${nb(`${fx()} = `)}${jh(ptext(a), '이라/라')} 하고 ${nb(`${X} ≥ 0`)}에서 ${nb(`${fx()} &gt; 0`)}임을 보이자.`,
          `${nb(`${df('f')}(${X}) = `)}${facText(3, [p, q])}이므로 구간 ${nb('[0, ∞)')}에서 ${fx()}는 ${nb(`${X} = `)}(가)에서 최소이고 최솟값은 (나)이다.`,
          `따라서 ${nb(`${X} ≥ 0`)}인 모든 ${X}에 대하여 ${nb(`${fx()} &gt; 0`)}이다.`
        ]);
        return M(`다음은 ${nb(`${X} ≥ 0`)}일 때, 부등식 ${nb(ptext(a) + ' &gt; 0')}이 성립함을 보이는 과정이다. (가), (나)에 알맞은 수는?`, [{ label: '(가)', answer: q }, { label: '(나)', answer: m0, signed: true }], {
          figure: steps,
          explain: `${nb(`${df('f')}(${X}) = 0`)}에서 ${nb(`${X} = ${qt(p)}`)} 또는 ${nb(`${X} = ${q}`)}이다. ${nb(`${X} ≥ 0`)}에서는 ${nb(`0 ≤ ${X} &lt; ${q}`)}일 때 감소, ${nb(`${X} &gt; ${q}`)}일 때 증가하므로 ${nb(`${X} = ${q}`)}에서 최소이고 최솟값은 ${nb(`${fx('f', q)} = ${m0}`)}이다.`,
          facts: { calc: [[`${q}`, 0], [pjs(a, q), 1]], derived: [q, 2, 3], rule: 'proof-0' } });
      }
      // 모든 실수 x 에서 L(x) ≥ R(x): L − R = 3x⁴ − 4rx³ + c, 최소는 x = r 에서 c − r⁴ ≥ 0
      const r = d.pick([-2, -1, 1, 2]), m0 = d.int(0, 4), c = r ** 4 + m0, u = d.pick([-3, -2, -1, 1, 2]), w = d.int(-5, 5);
      const Lp = [w, 0, 0, u, 3], Rp = [w - c, 0, 0, u + 4 * r];
      if (near(Rp[3], 0)) return null;
      const f = psub(Lp, Rp);
      const steps = lines([
        `${nb(`${fx()} = `)}${jh(ptext(f), '이라/라')} 하고 ${nb(`${fx()} ≥ 0`)}임을 보이자.`,
        `${nb(`${df('f')}(${X}) = `)}${facText(12, [0, 0, r])}이므로 ${fx()}는 ${nb(`${X} = `)}(가)에서 최소이고 최솟값은 (나)이다.`,
        `따라서 모든 실수 ${X}에 대하여 부등식이 성립한다.`
      ]);
      return M(`다음은 모든 실수 ${X}에 대하여 부등식 ${jh(nb(`${ptext(Lp)} ≥ ${ptext(Rp)}`), '이/가')} 성립함을 보이는 과정이다. (가), (나)에 알맞은 수는?`, [{ label: '(가)', answer: r, signed: true }, { label: '(나)', answer: m0, signed: true }], {
        figure: steps,
        explain: `우변을 옮긴 ${fx()}에서 ${nb(`${df('f')}(${X}) = 0`)}의 근은 ${nb(`${X} = 0`)}(중근), ${nb(`${X} = ${qt(r)}`)}이고 ${nb(`${X} = 0`)}의 좌우에서는 ${df('f')}(${X})의 부호가 바뀌지 않는다. 따라서 ${nb(`${X} = ${qt(r)}`)}에서 최소이고 최솟값은 ${nb(`${fx('f', qt(r))} = ${m0}`)}이다.`,
        facts: { calc: [[js(r), 0], [`${pjs(Lp, js(r))}-(${pjs(Rp, js(r))})`, 1]], derived: [Math.abs(r), 2, 3, 4], rule: 'proof-1' } });
    }, { count: 2 }),
    T('ineq-all', '모든 실수에서 사차부등식이 성립하도록 하는 상수의 최솟값', '①33', (d, n) => {
      if (n === 0) {
        // x⁴ + αx² − βx + k ≥ 0, f′ = 2(x − p)(2x² + 2px + w) (이차식은 근이 없다)
        const p = d.pick([-2, -1, 1, 2]), w = d.int(Math.floor(p * p / 2) + 1, 6), al = w - 2 * p * p, be = 2 * p * w;
        if (near(al, 0)) return null;
        const g = [0, -be, al, 0, 1], k = -pval(g, p);
        return qAns(`모든 실수 ${X}에 대하여 부등식 ${nb(`${ptext(g)} + ${V('k')} ≥ 0`)}이 성립하도록 하는 실수 ${V('k')}의 최솟값은?`, k, {
          signed: true,
          explain: `${nb(`${fx()} = `)}${ptext(g)} + ${V('k')}라 하면 ${nb(`${df('f')}(${X}) = ${facText(2, [p])}(2${X}${sup(2)} ${p < 0 ? MINUS : '+'} ${Math.abs(2 * p)}${X} + ${w})`)}이고 이차식 부분은 늘 양수이다. ${fx()}는 ${nb(`${X} = ${qt(p)}`)}에서 최소이고 최솟값 ${nb(`${qt(pval(g, p))} + ${V('k')} ≥ 0`)}에서 ${V('k')}의 최솟값은 ${qt(k)}이다.`,
          facts: { value: `-(${pjs(g, js(p))})`, derived: [Math.abs(p), 2, 4] } });
      }
      // ax⁴ − bx² + k ≥ 0 꼴을 두 변에 나누어 적는다: 최소는 x² = b/(2a) 일 때 k − b²/(4a)
      const a = d.pick([1, 2, 3, 4]), b = d.pick([2, 4, 6, 8]), l4 = -d.int(1, 3), l2 = d.int(1, 4), L = [0, 0, l2, 0, l4], R = [0, 0, l2 - b, 0, l4 + a];
      if (near(R[4], 0) || near(R[2], 0)) return null;
      const ans = b * b / (4 * a);
      return qAns(`모든 실수 ${X}에 대하여 부등식 ${nb(`${ptext(L)} ≤ ${ptext(R)} + ${V('k')}`)}가 성립하도록 하는 실수 ${V('k')}의 최솟값은?`, toQ(ans), {
        signed: true,
        explain: `${nb(`${fx()} = ${ptext(psub(R, L))} + ${V('k')}`)}라 하면 ${nb(`${df('f')}(${X}) = ${ptext(pder(psub(R, L)))}`)}이므로 ${nb(`${X}${sup(2)} = ${qt(b / (2 * a))}`)}일 때 최소이다. 최솟값 ${nb(`${V('k')} ${MINUS} ${qt(ans)} ≥ 0`)}에서 ${V('k')}의 최솟값은 ${qt(ans)}이다.`,
        facts: { value: `(${js(l2)}-(${js(l2 - b)}))**2/(4*(${js(l4 + a)}-(${js(l4)})))`, derived: [2, 4] } });
    }, { count: 2 }),
    T('ineq-pos', 'x ≥ 0에서 부등식이 늘 성립하도록 하는 상수의 최댓값', '①34', (d) => {
      const p = d.int(-6, -1), q = d.int(1, 3);
      if ((p + q) % 2) return null;
      const g = cubicOf(1, p, q, 0), c2 = d.int(-9, 9), e2 = d.int(-9, 9), e1 = d.int(-5, 15), L = padd(g, [e1, c2]), kmax = pval(L, q) - (c2 * q + e2);
      if (near(c2, 0) || near(L[1], 0) || Math.abs(kmax) > 99 || pval(L, 0) - e2 <= kmax) return null;
      return N(`${nb(`${X} ≥ 0`)}일 때, 부등식 ${nb(`${ptext(L)} ≥ ${ptext([e2, c2])} + ${V('k')}`)}가 항상 성립하도록 하는 실수 ${V('k')}의 최댓값은?`, kmax, {
        signed: true,
        explain: `${nb(`${fx()} = `)}${ptext(padd(L, [-e2, -c2]))} ${MINUS} ${V('k')}라 하면 ${nb(`${df('f')}(${X}) = ${facText(3, [p, q])}`)}이다. ${nb(`${X} ≥ 0`)}에서 ${fx()}는 ${nb(`${X} = ${q}`)}에서 최소이고 최솟값은 ${nb(`${qt(kmax)} ${MINUS} ${V('k')}`)}이다(${nb(`${fx('f', 0)} = ${qt(pval(L, 0) - e2)} ${MINUS} ${V('k')}`)}보다 작다). 이 값이 0 이상이어야 하므로 ${V('k')}의 최댓값은 ${qt(kmax)}이다.`,
        facts: { calc: [[`${pjs(L, q)}-(${js(c2)}*${q}+${js(e2)})`, 0]], derived: [q, 2, 3] } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 속도와 가속도
  // ════════════════════════════════════════════════════════════════
  const xIs = (a) => nb(`${X} = `) + ptext(a, TT);
  const vText = (a) => nb(`${V('v')} = ${frac(V('d') + X, V('d') + TT)} = `) + ptext(pder(a), TT);
  const aText = (a) => nb(`${V('a')} = ${frac(V('d') + V('v'), V('d') + TT)} = `) + ptext(pder(pder(a)), TT);
  const motion = [
    T('motion-va', '주어진 시각에서의 속도와 가속도', '①35', (d) => {
      const deg = d.pick([2, 3, 3, 4]), a = [0].concat(Array.from({ length: deg }, () => d.int(-6, 6)));
      a[deg] = d.pick([-2, -1, 1, 2, 3]);
      if (near(a[1], 0) && near(a[2], 0)) return null;
      const t0 = d.int(1, 3), v = pval(pder(a), t0), ac = pval(pder(pder(a)), t0);
      if (Math.abs(v) > 200 || Math.abs(ac) > 200) return null;
      return M(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${xIs(a)}일 때, ${nb(`${TT} = ${t0}`)}에서의 점 P의 속도와 가속도는?`, [{ label: '속도', answer: v, signed: true }, { label: '가속도', answer: ac, signed: true }], {
        explain: `${vText(a)}, ${aText(a)}이므로 ${nb(`${TT} = ${t0}`)}에서 속도는 ${qt(v)}, 가속도는 ${qt(ac)}이다.`,
        facts: { calc: [[dvjs(a, t0, 1), 0], [dvjs(a, t0, 2), 1]], derived: MULS } });
    }),
    T('motion-turn', '운동 방향을 바꾸는 시각', '①36', (d, n) => {
      if (n === 0) {
        // 방향을 바꾸는 때가 한 번: t² − 2pt, 삼차(v = 3(t + r)(t − p)), 사차(t⁴ − 4p³t)
        const p = d.int(1, 6), kind = d.int(0, 2), r = d.int(1, 4);
        let a, vf;
        if (kind === 0) { a = [0, -2 * p, 1]; vf = facText(2, [p], TT); }
        else if (kind === 1) { if ((r - p) % 2) return null; a = pint(fromRoots([-r, p], 3)); vf = facText(3, [-r, p], TT); }
        else { if (p > 3) return null; a = [0, -4 * p ** 3, 0, 0, 1]; vf = nb(`4(${TT} ${MINUS} ${p})(${TT}${sup(2)} + ${p}${TT} + ${p * p})`); }
        if (!intCoef(a)) return null;
        return N(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${xIs(a)}일 때, 점 P가 운동 방향을 바꾸는 시각은?`, p, {
          explain: `${vText(a)} = ${vf}이다. ${TT} &gt; 0에서 ${nb(`${V('v')} = 0`)}인 때는 ${nb(`${TT} = ${p}`)}뿐이고 그 앞뒤에서 ${V('v')}의 부호가 바뀌므로 운동 방향을 바꾸는 시각은 ${p}이다.`,
          facts: { calc: [[`${p}`, 0]], derived: [p], check: { poly: a, turn: [p] }, rule: 'turn-0' } });
      }
      // 두 번: v = −3(t − p)(t − q)
      const p = d.int(1, 3), q = p + 2 * d.int(1, 2), a = pint(fromRoots([p, q], -3)), mid = (p + q) / 2;
      const sets = [[p, q], [p], [q], [mid], [p, mid, q]].map((s) => ({ s, ok: s.length === 2 && s[0] === p && s[1] === q }));
      const rows = d.shuffle(sets);
      return C(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${xIs(a)}일 때, 점 P가 운동 방향을 바꾸는 시각을 모두 고른 것은?`, rows.map((r) => r.s.join(', ')), rows.findIndex((r) => r.ok), {
        explain: `${vText(a)} = ${facText(-3, [p, q], TT)}이다. ${nb(`${V('v')} = 0`)}인 ${nb(`${TT} = ${p}`)}, ${nb(`${TT} = ${q}`)}의 앞뒤에서 ${V('v')}의 부호가 바뀌므로 운동 방향을 바꾸는 시각은 ${p}, ${q}이다. ${nb(`${TT} = ${mid}`)}${B.kit.josa(mid, '은/는').slice(String(mid).length)} 속도가 가장 큰 때이다.`,
        facts: { truth: rows.map((r) => r.ok), want: true, rule: 'turn-1' } });
    }, { count: 2 }),
    T('motion-turnat', '운동 방향을 바꾸는 순간의 위치·가속도', '①37', (d, n) => {
      if (n === 0) {
        // v = 3(t + r)(t − p): t = p 에서 한 번 바뀐다.
        const p = d.int(2, 6), r = d.int(1, 4);
        if ((r - p) % 2) return null;
        const a = pint(fromRoots([-r, p], 3)), xp = pval(a, p), ac = pval(pder(pder(a)), p);
        if (Math.abs(xp) > 300) return null;
        return M(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${xIs(a)}일 때, 점 P가 운동 방향을 바꾸는 시각에서의 점 P의 위치와 가속도는?`, [{ label: '위치', answer: xp, signed: true }, { label: '가속도', answer: ac, signed: true }], {
          explain: `${vText(a)} = ${facText(3, [-r, p], TT)}이므로 ${nb(`${TT} = ${p}`)}에서 운동 방향을 바꾼다. 그때의 위치는 ${qt(xp)}이고, ${aText(a)}이므로 가속도는 ${qt(ac)}이다.`,
          facts: { calc: [[pjs(a, p), 0], [dvjs(a, p, 2), 1]], derived: [p].concat(MULS), rule: 'turnat-0' } });
      }
      // v = (t − p)(t − q): 처음으로 바뀌는 t = p 에서의 가속도 p − q
      const p = d.int(1, 3), q = p + d.int(1, 4), e = d.int(1, 6), a = [e, p * q, -(p + q) / 2, 1 / 3], ac = p - q;
      return N(`시각 ${nb(`${TT} = 0`)}일 때 출발하여 수직선 위를 움직이는 점 P의 시각 ${nb(`${TT}(${TT} ≥ 0)`)}에서의 위치 ${X}가 ${xIs(a)}이다. 출발 후 점 P의 운동 방향이 처음으로 바뀌는 시각에서의 점 P의 가속도는?`, ac, {
        signed: true,
        explain: `${vText(a)} = ${facText(1, [p, q], TT)}이므로 ${nb(`${TT} = ${p}`)}에서 처음으로 운동 방향이 바뀐다. ${aText(a)}이므로 그때의 가속도는 ${qt(ac)}이다.`,
        facts: { calc: [[dvjs(a, p, 2), 0]], derived: [p].concat(MULS), rule: 'turnat-1' } });
    }, { count: 2 }),
    T('motion-origin', '출발 후 다시 원점을 지나는 순간의 속도', '①38', (d) => {
      const Tm = d.int(2, 5), s = d.int(1, 4), quart = d.bool(), a = quart ? pmul(pmul([0, 1], lin1(Tm)), [s, 0, 1]) : pmul(pmul([0, 1], lin1(Tm)), lin1(-s)), v = pval(pder(a), Tm);
      if (Math.abs(v) > 300) return null;
      return N(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${xIs(a)}일 때, 점 P가 출발한 후 다시 원점을 지나는 순간의 속도는?`, v, {
        signed: true,
        explain: `${nb(`${X} = 0`)}에서 ${quart ? nb(`${TT}(${TT} ${MINUS} ${Tm})(${TT}${sup(2)} + ${s}) = 0`) : facText(1, [0, Tm, -s], TT) + ' = 0'}이고 ${nb(`${TT} &gt; 0`)}이므로 ${nb(`${TT} = ${Tm}`)}이다. ${vText(a)}이므로 그때의 속도는 ${qt(v)}이다.`,
        facts: { calc: [[dvjs(a, Tm, 1), 0]], derived: [Tm].concat(MULS) } });
    }),
    T('motion-vtoa', '속도가 주어진 값인 순간의 가속도', '①39', (d) => {
      // v − V0 = 3(t − t1)(t − t2), t1 > 0 > t2
      const t1 = d.int(2, 5), t2 = -d.int(1, 3), V0 = d.int(2, 20);
      if ((t1 + t2) % 2) return null;
      const a = pint(padd(fromRoots([t1, t2], 3), [V0])), ac = pval(pder(pder(a)), t1);
      if (!intCoef(a)) return null;
      return N(`원점을 출발하여 수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${xIs(a)}일 때, 점 P의 속도가 ${qt(V0)}인 순간의 가속도는?`, ac, {
        signed: true,
        explain: `${vText(a)}이므로 ${nb(`${V('v')} = ${V0}`)}에서 ${facText(3, [t1, t2], TT)} = 0이고 ${nb(`${TT} &gt; 0`)}이므로 ${nb(`${TT} = ${t1}`)}이다. ${aText(a)}이므로 가속도는 ${qt(ac)}이다.`,
        facts: { calc: [[dvjs(a, t1, 2), 0]], derived: [t1].concat(MULS) } });
    }),
    T('motion-coef', '주어진 시각의 속도로 위치 식의 계수 구하기', '①40', (d) => {
      const c3 = d.pick([1, 2, 3]), k = d.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5]), t0 = d.int(1, 3), e = d.int(1, 9), V0 = 3 * c3 * t0 * t0 + 2 * k * t0;
      if (V0 === 0) return null;
      const known = nb(`${X} = ${c3 === 1 ? '' : c3}${TT}${sup(3)} + ${V('k')}${TT}${sup(2)} + ${e}`);
      return N(`수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${known}이다. ${nb(`${TT} = ${t0}`)}에서의 점 P의 속도가 ${qt(V0)}일 때, 상수 ${V('k')}의 값은?`, k, {
        signed: true,
        explain: `${nb(`${V('v')} = ${frac(V('d') + X, V('d') + TT)} = ${3 * c3}${TT}${sup(2)} + 2${V('k')}${TT}`)}이므로 ${nb(`${3 * c3 * t0 * t0} + ${2 * t0}${V('k')} = ${qt(V0)}`)}에서 ${nb(`${V('k')} = ${qt(k)}`)}이다.`,
        facts: { calc: [[`(${js(V0)}-3*${c3}*${t0}**2)/(2*${t0})`, 0]], derived: [2, 3] } });
    }),
    T('motion-originturn', '원점에서 운동 방향을 바꿀 때의 상수', '①41', (d) => {
      // x = c(t³ − 3pt²) + k: t = 2p 에서 방향을 바꾸고 그때 x = 0
      const c = d.pick([1, 1, 2, -1]), p = d.int(1, 2), k = 4 * c * p ** 3, a = [0, 0, -3 * c * p, c];
      return N(`수직선 위를 움직이는 점 P의 시각 ${TT}에서의 위치 ${X}가 ${nb(`${X} = ${ptext(a, TT)} + ${V('k')}`)}이다. 점 P가 출발한 후 원점에 있는 순간 운동 방향을 바꿀 때, 상수 ${V('k')}의 값은?`, k, {
        signed: true,
        explain: `${nb(`${V('v')} = ${facText(3 * c, [0, 2 * p], TT)}`)}이므로 출발 후 ${nb(`${TT} = ${2 * p}`)}에서 운동 방향을 바꾼다. 그때 원점에 있으므로 ${nb(`${qt(pval(a, 2 * p))} + ${V('k')} = 0`)}에서 ${nb(`${V('k')} = ${qt(k)}`)}이다.`,
        facts: { calc: [[`-(${pjs(a, `(2*${p})`)})`, 0]], derived: [p, 2, 3] } });
    }),
    T('motion-throw', '위로 던진 물체의 최고 높이와 땅에 닿는 순간의 속도', '①42', (d, n) => {
      // x = h0 + 10t1·t − 5t²: t = t1 에서 최고, t = T 에서 땅에 닿는다(h0 = 5T(T − 2t1)).
      const t1 = d.int(1, 4), T0 = 2 * t1 + d.int(0, 3), v0 = 10 * t1, h0 = 5 * T0 * (T0 - 2 * t1), top = h0 + 5 * t1 * t1, vT = v0 - 10 * T0;
      const a = [h0, v0, -5];
      const head = h0 ? `지면으로부터 ${h0} m 높이에서 ${v0} m/s의 속도로 지면과 수직으로 위로 던져 올린` : `지면에서 ${v0} m/s의 속도로 지면과 수직으로 위로 쏘아 올린`;
      if (n === 0) {
        return M(`${head} 물체의 ${TT}초 후의 높이 ${X} m가 ${nb(`${X} = ${ptext(a, TT)}`)}일 때, 물체가 최고 높이에 도달할 때까지 걸린 시간과 그때의 높이는?`, [{ label: '시간', answer: t1, unit: '초' }, { label: '높이', answer: top, unit: 'm' }], {
          explain: `${nb(`${V('v')} = ${v0} ${MINUS} 10${TT}`)}이고 최고 높이에서 속도는 0이므로 ${nb(`${TT} = ${t1}`)}이다. 그때의 높이는 ${top} m이다.`,
          facts: { calc: [[`${v0}/(2*5)`, 0], [`${js(h0)}+${v0}*${v0}/(2*5)-5*(${v0}/(2*5))**2`, 1]], derived: [2, 10], rule: 'throw-0' } });
      }
      return N(`${head} 물체의 ${TT}초 후의 높이 ${X} m가 ${nb(`${X} = ${ptext(a, TT)}`)}일 때, 물체가 지면에 닿는 순간의 속도는?`, vT, {
        signed: true, unit: 'm/s',
        explain: `지면에 닿을 때 ${nb(`${X} = 0`)}이므로 ${nb(`${ptext(a, TT)} = 0`)}에서 ${nb(`${TT} &gt; 0`)}인 근은 ${nb(`${TT} = ${T0}`)}이다. ${nb(`${V('v')} = ${v0} ${MINUS} 10${TT}`)}이므로 그때의 속도는 ${qt(vT)} m/s이다.`,
        facts: { calc: [[`${v0}-10*${T0}`, 0]], derived: [T0, 10], rule: 'throw-1' } });
    }, { count: 2 }),
    T('motion-brake', '브레이크를 밟은 자동차의 가속도와 정지할 때까지 움직인 거리', '①43', (d) => {
      const c = d.int(2, 8), Tm = d.int(3, 8), v0 = 2 * c * Tm, dist = c * Tm * Tm;
      if (v0 > 120) return null;
      return M(`직선 도로를 달리는 자동차가 브레이크를 밟은 후 ${TT}초 동안 움직인 거리를 ${X} m라 하면 ${nb(`${X} = ${ptext([0, v0, -c], TT)}`)}이다. 브레이크를 밟은 순간의 가속도와 자동차가 정지할 때까지 움직인 거리는?`, [{ label: '가속도', answer: -2 * c, signed: true, unit: 'm/s²' }, { label: '거리', answer: dist, unit: 'm' }], {
        explain: `${nb(`${V('v')} = ${v0} ${MINUS} ${2 * c}${TT}`)}, ${nb(`${V('a')} = ${MINUS}${2 * c}`)}이므로 가속도는 ${MINUS}${2 * c} m/s²이다. 정지할 때 ${nb(`${V('v')} = 0`)}이므로 ${nb(`${TT} = ${Tm}`)}이고 그때까지 움직인 거리는 ${nb(`${v0} × ${Tm} ${MINUS} ${c} × ${Tm}${sup(2)} = ${dist}`)} m이다.`,
        facts: { calc: [[`-2*${c}`, 0], [`${v0}*${v0}/(2*${c})-${c}*(${v0}/(2*${c}))**2`, 1]], derived: [2] } });
    }),
    T('motion-avg', '평균 속도와 순간 속도', '①46', (d) => {
      const c2 = d.int(1, 4), c1 = d.int(0, 5), s = d.int(2, 5), a = [0, c1, c2], avg = c2 * s + c1, inst = 2 * c2 * s + c1;
      return M(`직선 도로를 달리는 자전거가 출발한 후 ${TT}초 동안 달린 거리를 ${nb(`${fx('f', TT)} m`)}라 하면 ${fIs(a, 'f', TT)}이다. ${nb(`${TT} = 0`)}에서 ${nb(`${TT} = ${s}`)}까지의 평균 속도와 ${nb(`${TT} = ${s}`)}에서의 속도는?`, [{ label: '평균 속도', answer: avg, unit: 'm/s', signed: true }, { label: '속도', answer: inst, unit: 'm/s', signed: true }], {
        explain: `평균 속도는 ${nb(`${frac(`${fx('f', s)} ${MINUS} ${fx('f', 0)}`, `${s} ${MINUS} 0`)} = ${frac(pval(a, s), s)} = ${avg}`)} m/s이다. 속도는 ${nb(`${df('f')}(${TT}) = ${ptext(pder(a), TT)}`)}에 ${nb(`${TT} = ${s}`)}${B.kit.josa(s, '을/를').slice(String(s).length)} 넣은 ${inst} m/s이다.`,
        facts: { calc: [[`(${pjs(a, s)})/${s}`, 0], [dvjs(a, s, 1), 1]], derived: [2] } });
    }),
    T('motion-shadow', '가로등 밑에서 걸어갈 때 그림자 끝이 움직이는 속도', '①47', (d) => {
      // 그림자 끝까지의 거리 x: x : (x − vt) = H : h → x = Hvt/(H − h), 속도 Hv/(H − h)
      const H = d.pick([3, 4, 5, 6]), h10 = d.pick([15, 16, 17, 18]), v = d.pick([1, 2, 3]), h = h10 / 10, ans = toQ(H * 10 * v / (H * 10 - h10));
      const said = `가로등의 높이 ${H} m, 사람의 키 ${h} m`, vt = v === 1 ? TT : v + TT;
      return qAns(`키가 ${h} m인 사람이 높이가 ${H} m인 가로등의 바로 밑에서 출발하여 일직선으로 ${v} m/s의 속도로 걸어가고 있다. 출발한 지 ${TT}초 후 가로등의 바로 밑에서부터 이 사람의 그림자 끝까지의 거리를 ${X} m라 할 때, 그림자 끝이 움직이는 속도는?`, ans, {
        unit: 'm/s', signed: true,
        explain: `${TT}초 동안 걸은 거리는 ${vt} m이고, 닮음에서 ${nb(`${X} : (${X} ${MINUS} ${vt}) = ${H} : ${h}`)}이므로 ${nb(`${X} = ${qt(H * v / (H - h))}${TT}`)}이다. 따라서 그림자 끝이 움직이는 속도는 ${nb(`${frac(V('d') + X, V('d') + TT)} = ${qt(H * v / (H - h))}`)} m/s이다.`,
        facts: { value: `${H}*${v}/(${H}-${h})`, check: said } });
    }),
    T('motion-rate', '시간에 따라 변하는 직사각형의 넓이의 변화율', '①48', (d) => {
      const a = d.int(2, 9), b = d.int(2, 9), p = d.int(1, 3), q = d.int(1, 3);
      if (a === b && p === q) return null;
      const c1 = 2 * p * q, c0 = a * q + b * p;
      return inline(`가로, 세로의 길이가 각각 ${a} cm, ${b} cm인 직사각형이 있다. 가로의 길이는 매초 ${p} cm씩, 세로의 길이는 매초 ${q} cm씩 길어질 때, ${TT}초 후 이 직사각형의 넓이의 변화율을 구하시오.`, `{0}${TT} {1} (cm²/s)`, [{ answer: c1, signed: true }, { answer: c0, signed: true }], {
        shown: `${c1}${TT} + ${c0} (cm²/s)`,
        explain: `${TT}초 후 가로는 ${nb(`(${a} + ${ptext([0, p], TT)})`)} cm, 세로는 ${nb(`(${b} + ${ptext([0, q], TT)})`)} cm이므로 넓이는 ${nb(`S = (${a} + ${ptext([0, p], TT)})(${b} + ${ptext([0, q], TT)}) = ${ptext([a * b, c0, p * q], TT)}`)}이다. 넓이의 변화율은 ${nb(`${frac(V('d') + 'S', V('d') + TT)} = ${c1}${TT} + ${c0}`)}이다.`,
        facts: { calc: [[`2*${p}*${q}`, 0], [`${a}*${q}+${b}*${p}`, 1]], derived: [2] } });
    })
  ];

  B.addTypes('11-2-5', 'roots', roots);
  B.addTypes('11-2-5', 'ineq', ineq);
  B.addTypes('11-2-5', 'motion', motion);
})(typeof window !== 'undefined' ? window : globalThis);
