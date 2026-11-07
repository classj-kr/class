// 고등학교 확률과 통계 Ⅲ-1 「확률분포」(11-3-5) — 뒤쪽 묶음(확률변수 aX + b의 평균·분산·표준편차, 이항분포의 뜻과 확률, 이항분포의 평균·분산·표준편차).
// 싣는 기준과 뺀 것은 11-3-5a.js 머리 주석에, 꼴마다의 판정은 references/textbooks/수학/_분석/11-3-5/싣기_대조표.md 에 있다.
// 이항분포의 확률(②9~12)은 11-3-4(독립시행의 확률)와 셈이 같지만, B(n, p)로 놓고 P(X = k)를 구하는 것이 이 단원의 몸통이라 실었다.
// 평균에서 n을 구해 분산을 내는 이항분포의 거꾸로 셈(11-3-6이 넘긴 꼴 27)은 ②17의 셋째 차례(binm-back#3)로 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, inline } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, gcd, nb, V, rt, sqParts } = B.kit.mid;
  const { ms, pr, ev, vr, sd, bin, dist, fn, jh: jh0, nC } = B.kit.hs;
  const jh = (h, pair) => (pair.includes('/') ? jh0(h, pair) : h + pair);
  const {
    UNIT, STD2, STD3, num, par, jn, jq, R, fq, fqj, pl, sumQ, comb, X, Xs, PX, PR, EX, VX, SX, EX2, NOTEF, rng, cell,
    T, numQ, ratQ, slots, fracsQ, distFit, sdAns, rootAns, oneQ, meanOf, ex2Of, varOf, meanJ, varJ, meanI, varI, sumTold, randDist, drawOf
  } = B.kit.u1135;
  void STD2; void STD3;

  // ── 글 ──
  // aX + b 의 글: linH(-5, 3) → −5X + 3, linH(1, -2, 'Y') → Y − 2
  const linH = (a, b, v) => { const L = ms(v || 'X'); return (a === 1 ? '' : a === -1 ? MINUS : num(a)) + L + (b === 0 ? '' : b < 0 ? ' ' + MINUS + ' ' + Math.abs(b) : ' + ' + b); };
  const plusB = (b) => (b === 0 ? '' : b < 0 ? ' ' + MINUS + ' ' + Math.abs(b) : ' + ' + b);
  const B2 = (n, p) => bin(n, typeof p === 'number' ? p : p.q === 1 ? String(p.p) : frac(p.p, p.q));      // B(n, p)
  const pq = (p) => (p.q === 1 ? String(p.p) : frac(p.p, p.q));
  // 가장 작은 자연수 a(≥ 2): a·E 와 a²·V 가 모두 정수
  const intCoef = (E, Vv, top) => { for (let a = 2; a <= (top || 12); a += 1) if ((a * E.p) % E.q === 0 && (a * a * Vv.p) % Vv.q === 0) return a; return null; };

  // ════════════════════════════════════════════════════════════════
  // ── 확률변수 aX + b 의 평균·분산·표준편차 ──
  B.addTypes(UNIT, 'lin', [
    T('lin-rule', 'E(X), V(X)로 aX + b의 평균·분산·표준편차 구하기', '②1', (d, n) => {
      const m = d.int(2, 30), s = d.int(2, 9), a = d.pick([-5, -4, -3, -2, -1, 2, 3, 4, 5]), b = d.pick([-9, -7, -5, -3, -1, 1, 2, 4, 6, 8, 10]);
      const Ym = a * m + b, Yv = a * a * s * s, Ys = Math.abs(a) * s, Y = linH(a, b);
      if (n === 0) {
        return slots(`확률변수 ${X}에 대하여 ${nb(EX + ' = ' + m)}, ${nb(VX + ' = ' + s * s)}일 때, 확률변수 ${jh(nb(ms('Y') + ' = ' + Y), '의')} 평균, 분산, 표준편차는?`, [
          [ev('Y'), Ym, `${jn(a)}*${m}+${jn(b)}`, true], [vr('Y'), Yv, `${jn(a)}*${jn(a)}*${s * s}`], [sd('Y'), Ys, `${Math.abs(a)}*${s}`]
        ], {
          explain: `${ev('Y')} = ${par(a)} × ${m}${plusB(b)} = ${num(Ym)}, ${vr('Y')} = ${par(a)}<sup>2</sup> × ${s * s} = ${Yv}, ${sd('Y')} = |${num(a)}| × ${rt(s * s)} = ${Ys}이다.`,
          derived: [s]
        });
      }
      const tpl = lines([
        `${ev(Y)} = {0}${EX}${plusB(b)} = {1}`,
        `${vr(Y)} = {2}${VX} = {3}`,
        `${sd(Y)} = {4}${SX} = {5}`
      ]);
      return inline(`확률변수 ${X}에 대하여 ${nb(EX + ' = ' + m)}, ${jh(nb(VX + ' = ' + s * s), '일')} 때, 다음 빈칸에 알맞은 수는?`, tpl, [
        { answer: a, signed: true }, { answer: Ym, signed: true }, { answer: a * a }, { answer: Yv }, { answer: Math.abs(a) }, { answer: Ys }
      ], {
        shown: lines([`${ev(Y)} = ${par(a)}${EX}${plusB(b)} = ${num(Ym)}`, `${vr(Y)} = ${a * a}${VX} = ${Yv}`, `${sd(Y)} = ${Math.abs(a)}${SX} = ${Ys}`]),
        explain: `${ev(ms('aX + b'))} = ${V('a')}${EX} + ${V('b')}, ${vr(ms('aX + b'))} = ${V('a')}<sup>2</sup>${VX}, ${sd(ms('aX + b'))} = |${V('a')}|${SX}이다. ${SX} = ${rt(s * s)} = ${s}이므로 차례로 ${num(a)}, ${num(Ym)}, ${a * a}, ${Yv}, ${Math.abs(a)}, ${Ys}이다.`,
        facts: { calc: [[`${jn(a)}`, 0], [`${jn(a)}*${m}+${jn(b)}`, 1], [`${jn(a)}*${jn(a)}`, 2], [`${jn(a)}*${jn(a)}*${s * s}`, 3], [`${Math.abs(a)}`, 4], [`${Math.abs(a)}*${s}`, 5]], auto: true }
      });
    }, { count: 2 }),

    T('lin-table', '분포에서 aX + b의 평균·분산 구하기', '②2', (d, n) => {
      if (n === 0) {
        const k = 4, ps = randDist(d, k, [5, 8, 10]), x1 = d.int(0, 1), xs = ps.map((_, i) => x1 + i);
        const E = meanOf(xs, ps), Vv = varOf(xs, ps), a0 = intCoef(E, Vv, 10);
        if (!a0 || E.q === 1) return null;
        const a = a0 * d.pick([1, -1]), b = d.int(-9, 9), Ym = qadd(qmul(R(a), E), R(b)), Yv = qmul(R(a * a), Vv);
        if (b === 0) return null;
        return slots(`이산확률변수 ${X}의 확률분포가 다음 표와 같을 때, 확률변수 ${jh(nb(ms('Y') + ' = ' + linH(a, b)), '의')} 평균과 분산은?`, [
          [ev('Y'), Ym.p, `${jn(a)}*${meanI(xs, ps)}+${jn(b)}`, true], [vr('Y'), Yv.p, `${jn(a)}*${jn(a)}*${varI(xs, ps)}`]
        ], {
          figure: distFit(xs, ps.map(cell)),
          explain: `${EX} = ${fq(E)}, ${EX2} = ${fq(ex2Of(xs, ps))}, ${VX} = ${fq(Vv)}이므로 ${ev('Y')} = ${par(a)} × ${fq(E)}${plusB(b)} = ${num(Ym.p)}, ${vr('Y')} = ${par(a)}<sup>2</sup> × ${fq(Vv)} = ${Yv.p}이다.`,
          auto: true
        });
      }
      if (n === 1) {
        const x1 = -d.int(1, 3), x2 = d.int(1, 2), x3 = x2 + d.int(1, 2), q = d.pick([5, 7, 11, 13]), p = R(d.int(1, q - 2), q), a = qmul(qsub(R(1), p), R(1, 3));
        const xs = [x1, x2, x3], ps = [a, qmul(R(2), a), p], E = meanOf(xs, ps), ans = qmul(a, E);
        if (ans.p === 0) return null;
        const aH = V('a');
        return ratQ(`이산확률변수 ${X}의 확률분포가 다음 표와 같을 때, 확률변수 ${jh(aH + X, '의')} 평균은? (단, ${aH}는 상수이다.)`, ans, {
          figure: dist(xs, [aH, '2' + aH, cell(p)]), signed: true,
          explain: `확률의 합이 1이므로 3${aH} + ${fq(p)} = 1, ${aH} = ${fq(a)}이다. ${EX} = ${sumTold(xs, ps)} = ${fq(E)}이므로 ${ev(aH + X)} = ${aH}${EX} = ${fq(a)} × ${fq(E)} = ${fq(ans)}이다.`,
          value: `(1-${jq(p)})/3*(${jn(x1)}*(1-${jq(p)})/3+${x2}*2*(1-${jq(p)})/3+${x3}*${jq(p)})`, derived: [3, 2]
        });
      }
      const m = d.pick([3, 4]), k = 2 ** m - 1, xs = Array.from({ length: m }, (_, i) => 2 ** (i + 1)), ps = xs.map((_, i) => R(comb(m, i + 1), k));
      const E = meanOf(xs, ps), c = E.q * d.pick([1, 2]), e = d.int(-5, 9), ans = c * E.p / E.q + e;
      if (c > 20 || ans <= 0) return null;
      const kH = V('k');
      return numQ(`확률변수 ${X}의 확률분포가 다음 표와 같을 때, ${jh(ev(linH(c, e)), '의')} 값은? (단, ${kH}는 상수이다.)`, ans, {
        figure: dist(xs, xs.map((_, i) => frac(nC(m, i + 1), kH)), { total: false }),
        explain: `확률의 합이 1이므로 ${frac(xs.map((_, i) => nC(m, i + 1)).join(' + '), kH)} = 1, ${kH} = 2<sup>${m}</sup> ${MINUS} 1 = ${k}이다. ${EX} = ${sumTold(xs, ps)} = ${fq(E)}이므로 ${ev(linH(c, e))} = ${c} × ${fq(E)}${plusB(e)} = ${ans}이다.`,
        value: `${c}*(${xs.map((x, i) => `${x}*${comb(m, i + 1)}/${k}`).join('+')})+${jn(e)}`, auto: true
      });
    }, { count: 3 }),

    T('lin-draw', '상황에서 분포를 구해 aX + b의 평균·분산 구하기', '②3', (d, n) => {
      if (n === 0) {
        const D = drawOf(d, { rmax: 3 });
        if (D.xs.length < 3) return null;
        const E = meanOf(D.xs, D.ps), Vv = varOf(D.xs, D.ps), a0 = intCoef(E, Vv, 12);
        if (!a0) return null;
        const a = a0 * (a0 <= 6 ? d.pick([1, 2]) : 1), b = d.pick([-7, -5, -3, -1, 1, 3, 5, 10]);
        const Ym = qadd(qmul(R(a), E), R(b)), Yv = qmul(R(a * a), Vv);
        return slots(`${D.text} 확률변수 ${jh(linH(a, b), '의')} 평균과 분산은?`, [
          [ev(linH(a, b)), Ym.p, `${a}*${meanI(D.xs, D.ps)}+${jn(b)}`, true], [vr(linH(a, b)), Yv.p, `${a}*${a}*${varI(D.xs, D.ps)}`]
        ], {
          explain: `${D.xs.map((k, i) => nb(PX(k) + ' = ' + fq(D.ps[i]))).join(', ')}이므로 ${EX} = ${fq(E)}, ${VX} = ${fq(Vv)}이다. 따라서 ${ev(linH(a, b))} = ${a} × ${fq(E)}${plusB(b)} = ${num(Ym.p)}, ${vr(linH(a, b))} = ${a}<sup>2</sup> × ${fq(Vv)} = ${Yv.p}이다.`,
          auto: true
        });
      }
      const m = d.int(2, 4), xs = Array.from({ length: m + 1 }, (_, i) => i), ps = xs.map((x) => R(comb(m, x), 2 ** m)), Vv = varOf(xs, ps);
      const a = d.pick([2, 4, -2, -4, 6]), b = d.int(-5, 5), ans = qmul(R(a * a), Vv);
      if (ans.q !== 1) return null;
      const word = ['', '', '두', '세', '네'][m];
      return numQ(`${word} 개의 동전을 동시에 던질 때 앞면이 나오는 동전의 개수를 확률변수 ${jh(X, '이라/라')} 하자. 확률변수 ${jh(nb(ms('Y') + ' = ' + linH(a, b)), '의')} 분산은?`, ans.p, {
        explain: `${xs.map((x, i) => nb(PX(x) + ' = ' + fq(ps[i]))).join(', ')}이므로 ${EX} = ${fq(meanOf(xs, ps))}, ${EX2} = ${fq(ex2Of(xs, ps))}, ${VX} = ${fq(Vv)}이다. 따라서 ${vr('Y')} = ${par(a)}<sup>2</sup> × ${fq(Vv)} = ${ans.p}이다.`,
        value: `${jn(a)}*${jn(a)}*(${varJ(xs, ps)})`, auto: true
      });
    }, { count: 2 }),

    T('lin-score', '순서쌍·규칙으로 정한 확률변수의 V(aX + b)', '②4', (d, n) => {
      if (n === 0) {
        const m = d.int(3, 6), Vv = R(m * m - 1, 6), cs = [2, 3, 4, 6].filter((c) => (c * c * Vv.p) % Vv.q === 0), c = d.pick(cs), e = d.pick([0, 0, -3, 2, 5]);
        const xs = Array.from({ length: 2 * m - 1 }, (_, i) => i - (m - 1)), ps = xs.map((x) => R(m - Math.abs(x), m * m)), ans = c * c * Vv.p / Vv.q;
        const ask = vr(linH(c, e));
        return numQ(`1부터 ${m}까지의 자연수가 하나씩 적힌 공 ${m}개가 들어 있는 주머니에서 임의로 공을 한 개 꺼내어 수를 확인하고 다시 넣는 일을 2번 한다. 첫 번째 수에서 두 번째 수를 뺀 값을 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(ask, '의')} 값은?`, ans, {
          explain: `${X} = ${V('k')}인 경우는 ${m} ${MINUS} |${V('k')}|가지이므로 ${PX(V('k'))} = ${frac(`${m} ${MINUS} |${V('k')}|`, m * m)}이다. 분포가 0에 대하여 대칭이므로 ${EX} = 0이고 ${VX} = ${EX2} = ${fq(Vv)}이다. 따라서 ${ask} = ${c}<sup>2</sup> × ${fq(Vv)} = ${ans}이다.`,
          value: `${c}*${c}*(${xs.map((x, i) => `${jn(x)}*${jn(x)}*${jq(ps[i])}`).join('+')})`, auto: true
        });
      }
      const [s0, s1, s2] = d.pick([[0, 1, 3], [0, 2, 5], [1, 2, 4], [0, 1, 4], [1, 3, 4], [0, 2, 3]]), xs = [s0, s1, s2], ps = [R(1, 4), R(1, 2), R(1, 4)], Vv = varOf(xs, ps);
      const a = d.pick([4, -4]), e = d.int(-15, 15), ans = qmul(R(16), Vv);
      if (ans.q !== 1 || Vv.p === 0) return null;
      const box = lines([`㈎ 같은 면이 연달아 나오지 않으면 ${s0}점을 얻는다.`, `㈏ 같은 면이 두 번만 연달아 나오면 ${s1}점을 얻는다.`, `㈐ 같은 면이 세 번 연달아 나오면 ${s2}점을 얻는다.`]);
      const ask = vr(linH(a, e));
      return numQ(`한 개의 동전을 세 번 던져 나온 결과에 따라 다음 규칙으로 얻은 점수를 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(ask, '의')} 값은?`, ans.p, {
        figure: `<div style="padding:8px 12px;border:1.5px solid #94a3b8;border-radius:8px">${box}</div>`,
        explain: `앞면을 H, 뒷면을 T라 하면 HTH, THT는 ${s0}점, HHT, THH, TTH, HTT는 ${s1}점, HHH, TTT는 ${s2}점이므로 ${PX(s0)} = ${frac(1, 4)}, ${PX(s1)} = ${frac(1, 2)}, ${PX(s2)} = ${frac(1, 4)}이다. ${EX} = ${fq(meanOf(xs, ps))}, ${EX2} = ${fq(ex2Of(xs, ps))}, ${VX} = ${fq(Vv)}이므로 ${ask} = ${par(a)}<sup>2</sup> × ${fq(Vv)} = ${ans.p}이다.`,
        value: `${jn(a)}*${jn(a)}*(${varJ(xs, ps)})`, auto: true
      });
    }, { count: 2 }),

    T('lin-coef', 'aX + b의 평균·분산에 맞추는 상수 a, b', '②5', (d, n) => {
      const aH = V('a'), bH = V('b');
      if (n === 0) {
        const mu = d.int(5, 80), v = d.int(4, 120), a = d.int(2, 5), b = d.int(-120, 60), e = a * mu + b, vy = a * a * v;
        if (b === 0 || e === mu) return null;
        return slots(`확률변수 ${X}에 대하여 ${nb(EX + ' = ' + mu)}, ${nb(VX + ' = ' + v)}이다. 확률변수 ${nb(ms('Y') + ' = ' + ms('aX + b'))}에 대하여 ${nb(ev('Y') + ' = ' + num(e))}, ${jh(nb(vr('Y') + ' = ' + vy), '일')} 때, 두 상수 ${aH}, ${jh(bH, '의')} 값은? (단, ${aH} &gt; 0)`, [
          [aH, a, `${a}`], [bH, b, `${jn(e)}-${mu}*${a}`, true]
        ], {
          explain: `${vr('Y')} = ${aH}<sup>2</sup>${VX}에서 ${v}${aH}<sup>2</sup> = ${vy}, ${aH} &gt; 0이므로 ${aH} = ${a}이다. ${ev('Y')} = ${aH}${EX} + ${bH}에서 ${a} × ${mu} + ${bH} = ${num(e)}, ${bH} = ${num(b)}이다.`,
          derived: [a]
        });
      }
      let a, mu, v, b, e, vy, lead;
      if (d.bool()) {
        const s = d.int(2, 9); mu = s * d.int(2, 12); v = s * s; a = R(1, s); b = -mu / s; e = 0; vy = 1;
        lead = `${vr('Y')} = ${aH}<sup>2</sup> × ${v} = 1, ${aH} &gt; 0이므로 ${aH} = ${fq(a)}이다. ${ev('Y')} = ${fq(a)} × ${mu} + ${bH} = 0에서 ${bH} = ${num(b)}이다.`;
      } else {
        a = d.pick([R(3, 2), R(1, 2), R(2, 3), R(1, 3), R(3, 4), R(1, 4), R(5, 2), R(4, 3)]); mu = a.q * d.int(3, 30); v = a.q * a.q * d.int(2, 30); b = d.int(-40, 40); e = a.p * mu / a.q + b; vy = a.p * a.p * v / (a.q * a.q);
        if (b === 0) return null;
        lead = `${vr('Y')} = ${aH}<sup>2</sup> × ${v} = ${vy}, ${aH} &gt; 0이므로 ${aH} = ${fq(a)}이다. ${ev('Y')} = ${fq(a)} × ${mu} + ${bH} = ${num(e)}에서 ${bH} = ${num(b)}이다.`;
      }
      const bRow = [bH, R(b), true, [`${jn(e)}-${a.p}*${mu}/${a.q}`]]; bRow.int = true;
      return fracsQ(`확률변수 ${X}에 대하여 ${nb(EX + ' = ' + mu)}, ${nb(VX + ' = ' + v)}이다. 확률변수 ${nb(ms('Y') + ' = ' + ms('aX + b'))}의 평균이 ${num(e)}, 분산이 ${jh(String(vy), '일')} 때, 두 상수 ${aH}, ${jh(bH, '의')} 값은? (단, ${aH} &gt; 0)`, [[aH, a], bRow], {
        explain: lead, derived: [a.p, a.q]
      });
    }, { count: 2 }),

    T('lin-back', 'aX + b의 평균·표준편차에서 X의 것을 거꾸로', '②6', (d, n) => {
      if (n === 0) {
        const m = d.int(10, 90), s = d.int(2, 9), e0 = d.pick([0, 0, 1, 2, -1]), s0 = d.pick([1, 1, 2]), EXv = m + s * e0, SXv = s * s0;
        const Y = frac(ms('X - ' + m), s);
        return slots(`확률변수 ${X}에 대하여 확률변수 ${jh(Y, '의')} 평균이 ${num(e0)}, 표준편차가 ${jh(String(s0), '일')} 때, ${jh(X, '의')} 평균과 표준편차는?`, [
          [EX, EXv, `${m}+${s}*${jn(e0)}`], [SX, SXv, `${s}*${s0}`]
        ], {
          explain: `${ev(Y)} = ${frac(1, s)}${EX} ${MINUS} ${frac(m, s)} = ${num(e0)}이므로 ${EX} = ${EXv}, ${sd(Y)} = ${frac(1, s)}${SX} = ${s0}이므로 ${SX} = ${SXv}이다.`
        });
      }
      const a = d.pick([2, 3, -2, -3, 4]), b = d.int(-5, 9), dd = d.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]), mu = d.int(1, 6), e = a * mu + b, vy = a * a * dd, e2 = vy + e * e;
      if (b === 0) return null;
      return rootAns(`두 확률변수 ${X}, ${ms('Y')}에 대하여 ${nb(ms('Y') + ' = ' + linH(a, b))}이고 ${nb(ev('Y') + ' = ' + num(e))}, ${jh(nb(ev(ms('Y^2')) + ' = ' + e2), '일')} 때, ${jh(SX, '의')} 값은?`, dd, {
        explain: `${vr('Y')} = ${ev(ms('Y^2'))} ${MINUS} {${ev('Y')}}<sup>2</sup> = ${e2} ${MINUS} ${par(e)}<sup>2</sup> = ${vy}이고 ${vr('Y')} = ${par(a)}<sup>2</sup>${VX}이므로 ${VX} = ${dd}, ${SX} = ${rt(dd)}이다.`,
        calc: [[`(${e2}-${jn(e)}*${jn(e)})/(${jn(a)}*${jn(a)})`, 0]]
      });
    }, { count: 2 }),

    T('lin-tscore', '표준 점수 T의 평균·표준편차와 값', '②7', (d, n) => {
      const c = d.pick([10, 20, 15]), base = d.pick([50, 100]), mH = V('m'), sH = V('σ');
      const T = `${c}${ms('(')}${frac(ms('X - m'), sH)}${ms(')')} + ${base}`;
      if (n === 0) {
        return slots(`어느 시험에서 응시자의 점수를 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(X, '의')} 평균이 ${mH}점, 표준편차가 ${sH}점이다. ${jh(nb(ms('T') + ' = ' + T), '을/를')} 표준 점수라 할 때, ${ms('T')}의 평균과 표준편차는? (단, ${sH} &gt; 0)`, [
          [ev('T'), base, `${base}`], [sd('T'), c, `${c}`]
        ], {
          explain: `${ms('T')} = ${frac(c, sH)}${X} ${MINUS} ${frac(c + mH, sH)} + ${base}이므로 ${ev('T')} = ${frac(c, sH)}${mH} ${MINUS} ${frac(c + mH, sH)} + ${base} = ${base}, ${sd('T')} = ${frac(c, sH)} × ${sH} = ${c}이다.`
        });
      }
      const sg = d.pick([8, 10, 12, 15, 20]), m = d.int(50, 75), ts = [];
      for (let t = -2 * sg; t <= 2 * sg; t += 1) if (t !== 0 && (c * t) % sg === 0 && m + t >= 0 && m + t <= 100) ts.push(t);
      const t = d.pick(ts), x = m + t, Tv = base + c * t / sg;
      return numQ(`어느 시험에서 응시자의 점수를 확률변수 ${jh(X, '이라/라')} 할 때, ${jh(nb(ms('T') + ' = ' + T), '을/를')} 표준 점수라 한다. 응시자 점수의 평균이 ${m}점, 표준편차가 ${sg}점일 때, 점수가 ${x}점인 응시자의 표준 점수는? (단, ${mH}, ${jh(sH, '은/는')} 각각 ${jh(X, '의')} 평균과 표준편차이다.)`, Tv, {
        unit: '점', explain: `${ms('T')} = ${c} × ${ms('(')}${frac(`${x} ${MINUS} ${m}`, sg)}${ms(')')} + ${base} = ${Tv}(점)이다.`,
        value: `${c}*(${x}-${m})/${sg}+${base}`
      });
    }, { count: 2 })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 이항분포의 뜻과 확률 ──
  B.addTypes(UNIT, 'binp', [
    T('binp-form', '상황을 이항분포 B(n, p)로 나타내기', '②8', (d, n) => {
      let txt, p, how, nn;
      if (n === 0) {
        const kind = d.int(0, 3);
        nn = d.pick([7, 10, 12, 20, 30, 50, 60, 100, 120, 200, 300]);
        if (kind === 0) { const k = d.int(2, 5); p = R(7 - k, 6); txt = `한 개의 주사위를 ${nn}번 던질 때, ${k} 이상의 눈이 나오는 횟수`; how = `한 번 던질 때 ${k} 이상의 눈이 나올 확률은 ${frac(7 - k, 6)}${p.q === 6 ? '' : ' = ' + fq(p)}`; }
        else if (kind === 1) { const ev2 = d.pick([['소수', 3], ['짝수', 3], ['3의 배수', 2], ['6의 약수', 4], ['4의 약수', 3]]); p = R(ev2[1], 6); txt = `한 개의 주사위를 ${nn}번 던질 때, ${ev2[0]}의 눈이 나오는 횟수`; how = `한 번 던질 때 ${ev2[0]}의 눈이 나올 확률은 ${frac(ev2[1], 6)} = ${fq(p)}`; }
        else if (kind === 2) { const r = d.pick([60, 70, 75, 80, 90]), sc = d.pick([['완치율이', '어느 치료약을 환자', '명에게 투여할 때, 완치되는 환자의 수'], ['발아율이', '어느 씨앗', '개를 심을 때, 싹이 트는 씨앗의 수']]); p = R(r, 100); txt = `${sc[0]} ${r} %인 ${sc[1]} ${nn}${sc[2]}`; how = `한 번의 확률은 ${r} %, 곧 ${fq(p)}`; }
        else { const ch = d.pick([4, 5]); p = R(1, ch); txt = `정답이 한 개인 ${ch === 5 ? '오지선다형' : '사지선다형'} 문제 ${nn}개의 답을 각각 임의로 하나씩 고를 때, 정답을 맞힌 문제의 수`; how = `한 문제의 정답을 맞힐 확률은 ${fq(p)}`; }
      } else {
        const kind = d.int(0, 2);
        nn = d.pick([5, 7, 10, 20, 30, 36, 40]);
        if (kind === 0) { const ev2 = d.pick([['모두 앞면이', 1], ['모두 뒷면이', 1], ['서로 다른 면이', 2]]); p = R(ev2[1], 4); txt = `서로 다른 두 개의 동전을 동시에 던지는 시행을 ${nn}번 반복할 때, 두 동전이 ${ev2[0]} 나오는 횟수`; how = `한 번 던질 때 두 동전이 ${ev2[0]} 나올 확률은 ${frac(ev2[1], 4)}${p.q === 4 ? '' : ' = ' + fq(p)}`; }
        else if (kind === 1) { const s = d.int(4, 10), cnt = 6 - Math.abs(s - 7); p = R(cnt, 36); txt = `서로 다른 두 개의 주사위를 동시에 던지는 시행을 ${nn}번 반복할 때, 두 눈의 수의 합이 ${jh(String(s), '이/가')} 되는 횟수`; how = `한 번 던질 때 두 눈의 수의 합이 ${s}인 경우는 ${cnt}가지이므로 그 확률은 ${frac(cnt, 36)} = ${fq(p)}`; }
        else { const h = d.pick([6, 7, 8, 9]); p = R(h, 10); txt = `10발을 쏘면 평균 ${h}발을 명중시키는 사격 선수가 ${nn}발을 쏠 때, 명중시키는 횟수`; how = `한 발을 쏠 때 명중시킬 확률은 ${frac(h, 10)}${p.q === 10 ? '' : ' = ' + fq(p)}`; }
      }
      if (p.q === 1) return null;
      return inline(`다음 확률변수 ${jh(X, '의')} 확률분포를 이항분포 ${fn('B')}(${V('n')}, ${V('p')}) 꼴로 나타낼 때, 빈칸에 알맞은 수는?` + NOTEF, `${fn('B')}({0}, ${frac('{1}', '{2}')})`, [{ answer: nn }, { answer: p.p }, { answer: p.q }], {
        figure: lines([`${X}: ${txt}`]), shown: B2(nn, p),
        explain: `${how}이고 시행 횟수가 ${nn}이므로 ${jh(X, '은/는')} 이항분포 ${jh(B2(nn, p), '을/를')} 따른다.`,
        facts: { calc: [[`${nn}`, 0], [`${p.p}`, 1], [`${p.q}`, 2]], unseen: [p.p, p.q] }
      });
    }, { count: 2 }),

    T('binp-pmf', '이항분포의 확률질량함수로 확률 구하기', '②9', (d, n) => {
      if (n === 0) {
        const p = d.pick([R(1, 2), R(1, 3), R(2, 3), R(1, 4), R(3, 4), R(2, 5), R(3, 5)]), top = { 2: 9, 3: 7, 4: 6, 5: 5 }[p.q], nn = d.int(4, top), k = d.int(1, nn - 1);
        const c = comb(nn, k), ans = R(c * p.p ** k * (p.q - p.p) ** (nn - k), p.q ** nn);
        if (ans.q > 9999) return null;
        return ratQ(`확률변수 ${jh(X, '이/가')} 이항분포 ${jh(B2(nn, p), '을/를')} 따를 때, ${jh(PX(k), '의')} 값은?`, ans, {
          explain: `${PX(k)} = ${nC(nn, k)}${'(' + fq(p) + ')'}<sup>${k}</sup>${'(' + fq(qsub(R(1), p)) + ')'}<sup>${nn - k}</sup> = ${fq(ans)}이다.`,
          value: `${c}*(${jq(p)})**${k}*(1-${jq(p)})**(${nn}-${k})`, derived: [c]
        });
      }
      const ev2 = d.pick([['3의 배수의', R(1, 3)], ['짝수의', R(1, 2)], ['5 이상의', R(1, 3)], ['1의', R(1, 6)]]), p = ev2[1], nn = p.q === 6 ? 3 : d.int(3, 4);
      const xs = Array.from({ length: nn + 1 }, (_, i) => i), ps = xs.map((x) => R(comb(nn, x) * p.p ** x * (p.q - p.p) ** (nn - x), p.q ** nn));
      const [i, j] = d.shuffle(xs.slice()).slice(0, 2).sort((u, v) => u - v);
      const shown = ps.map((q, t) => (t === i ? '㉠' : t === j ? '㉡' : cell(q))), fig = distFit(xs, shown);
      if (!fig) return null;
      const mk = (x) => [`${comb(nn, x)}*${p.p ** x * (p.q - p.p) ** (nn - x)}`, `${p.q ** nn}`];
      return fracsQ(`한 개의 주사위를 ${nn}번 던질 때 ${ev2[0]} 눈이 나오는 횟수를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(X, '의')} 확률분포를 나타낸 다음 표에서 ㉠, ㉡에 알맞은 수는?`, [['㉠', ps[i], false, mk(xs[i])], ['㉡', ps[j], false, mk(xs[j])]], {
        figure: fig,
        explain: `${jh(X, '은/는')} 이항분포 ${jh(B2(nn, p), '을/를')} 따르므로 ${nb(PX(Xs) + ' = ' + nC(nn, Xs) + '(' + fq(p) + ')<sup>' + Xs + '</sup>(' + fq(qsub(R(1), p)) + ')<sup>' + nn + MINUS + Xs + '</sup>')}이다. 따라서 ㉠ = ${fq(ps[i])}, ㉡ = ${fq(ps[j])}이다.`,
        auto: true
      });
    }, { count: 2 }),

    T('binp-range', '이항분포에서 이상·이하의 확률', '②10', (d, n) => {
      if (n === 0) {
        const S = d.pick([
          { p: R(1, 4), t: (k) => `서로 다른 두 개의 동전을 동시에 ${k}번 던질 때, 두 동전이 모두 앞면이 나오는 횟수` },
          { p: R(3, 5), t: (k) => `공을 한 번 던질 때 모든 핀을 쓰러트릴 확률이 0.6인 볼링 선수가 공을 ${k}번 던질 때, 모든 핀을 쓰러트리는 횟수` },
          { p: R(2, 3), t: (k) => `한 개의 주사위를 ${k}번 던질 때, 3 이상의 눈이 나오는 횟수` },
          { p: R(2, 5), t: (k) => `성공할 확률이 0.4인 일을 ${k}번 할 때, 성공하는 횟수` }
        ]);
        const nn = d.int(3, 5), k = d.int(Math.ceil(nn / 2), nn - 1);
        if (S.p.q ** nn > 9999) return null;
        const terms = []; for (let x = k; x <= nn; x += 1) terms.push(R(comb(nn, x) * S.p.p ** x * (S.p.q - S.p.p) ** (nn - x), S.p.q ** nn));
        const ans = sumQ(terms);
        return ratQ(`${S.t(nn)}를 확률변수 ${jh(X, '이라/라')} 하자. 확률 ${jh(PR(`X >= ${k}`), '의')} 값은?`, ans, {
          explain: `${jh(X, '은/는')} 이항분포 ${jh(B2(nn, S.p), '을/를')} 따르므로 ${PR(`X >= ${k}`)} = ${terms.map((_, i) => PX(k + i)).join(' + ')} = ${terms.map(fq).join(' + ')} = ${fq(ans)}이다.`,
          value: terms.map((_, i) => `${comb(nn, k + i)}*${jq(S.p)}**${k + i}*(1-${jq(S.p)})**(${nn}-${k + i})`).join('+'), auto: true
        });
      }
      if (n === 1) {
        const S = d.pick([
          { p: R(4, 5), t: (k) => `10발을 쏘면 평균 8발을 명중시키는 선수가 ${k}발을 쏠 때, 명중시키는 횟수` },
          { p: R(3, 4), t: (k) => `자유투 성공률이 75 %인 농구 선수가 자유투를 ${k}번 던질 때, 성공하는 횟수` }
        ]);
        const nn = d.int(3, 5), lowSide = d.bool();
        if (S.p.q ** nn > 9999) return null;
        const pAll = R(S.p.p ** nn, S.p.q ** nn), pNone = R((S.p.q - S.p.p) ** nn, S.p.q ** nn);
        const ans = lowSide ? qsub(R(1), pAll) : qsub(R(1), pNone), ask = lowSide ? PR(`X <= ${nn - 1}`) : PR('X >= 1');
        return ratQ(`${S.t(nn)}를 확률변수 ${jh(X, '이라/라')} 하자. 확률 ${jh(ask, '의')} 값은?`, ans, {
          explain: `${jh(X, '은/는')} 이항분포 ${jh(B2(nn, S.p), '을/를')} 따르므로 여사건을 생각하면 ${ask} = 1 ${MINUS} ${lowSide ? PX(nn) : PX(0)} = 1 ${MINUS} (${fq(lowSide ? S.p : qsub(R(1), S.p))})<sup>${nn}</sup> = ${fq(ans)}이다.`,
          value: lowSide ? `1-${jq(S.p)}**${nn}` : `1-(1-${jq(S.p)})**${nn}`, auto: true
        });
      }
      const [res, c] = d.pick([[100, 5], [50, 4], [100, 3], [80, 4], [60, 5], [50, 10]]), q = 1 - c / 100, v = Math.round(Math.pow(q, res) * 1000) / 1000;
      if (v < 0.005) return null;
      const show = (x) => x.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
      const qq = R(100 - c, 100), rows = [{ h: show(1 - v), ok: true }, { h: show(v), ok: false }, { h: show(q), ok: false }, { h: show(c / 100), ok: false }];
      return oneQ(d, `좌석이 ${res - 1}개인 어느 관광선의 예약 취소율이 ${c} %라고 한다. 이 관광선의 예약자가 ${res}명일 때, 좌석이 부족하지 않을 확률은? (단, 예약자는 서로 영향을 주지 않고 각자 취소하며, ${nb('(' + frac(qq.p, qq.q) + ')<sup>' + res + '</sup> = ' + show(v))}${josa(Number(show(v).slice(-1)), '으로/로').slice(1)} 계산한다.)`, rows, true, {
        explain: `예약을 취소하는 사람의 수를 ${X}라 하면 ${jh(X, '은/는')} 이항분포 ${jh(B2(res, R(c, 100)), '을/를')} 따른다. 좌석이 부족한 것은 아무도 취소하지 않을 때뿐이므로 구하는 확률은 ${PR('X >= 1')} = 1 ${MINUS} ${PX(0)} = 1 ${MINUS} ${show(v)} = ${show(1 - v)}이다.`
      });
    }, { count: 3 }),

    T('binp-ends', '이항분포의 두 끝 확률의 합', '②11', (d) => {
      const nn = d.pick([50, 80, 100, 120, 150, 200, 300, 400]), S = d.pick([`한 개의 주사위를 ${nn}번 던질 때, 소수의 눈이 나오는 횟수`, `한 개의 동전을 ${nn}번 던질 때, 앞면이 나오는 횟수`, `한 개의 주사위를 ${nn}번 던질 때, 짝수의 눈이 나오는 횟수`]);
      const aH = V('a');
      return numQ(`${S}를 확률변수 ${jh(X, '이라/라')} 하자. ${nb(PX(0) + ' + ' + PX(nn) + ' = ' + frac(1, '2<sup>' + aH + '</sup>'))}일 때, 상수 ${jh(aH, '의')} 값은?`, nn - 1, {
        explain: `${jh(X, '은/는')} 이항분포 ${jh(B2(nn, R(1, 2)), '을/를')} 따르므로 ${PX(0)} = ${PX(nn)} = ${frac(1, '2<sup>' + nn + '</sup>')}이고, 합은 ${frac(2, '2<sup>' + nn + '</sup>')} = ${frac(1, '2<sup>' + (nn - 1) + '</sup>')}이다. 따라서 ${aH} = ${nn - 1}이다.`,
        value: `${nn}-1`
      });
    }),

    T('binp-solve', '두 이항분포의 확률이 맺은 등식에서 p 구하기', '②12', (d, n) => {
      const pH = V('p');
      if (n === 0) {
        const [p, c] = d.pick([[R(1, 2), 128], [R(2, 3), 60], [R(1, 3), 336], [R(4, 5), 35], [R(2, 5), 220], [R(1, 4), 640]]);
        return ratQ(`확률변수 ${jh(X, '은/는')} 이항분포 ${jh(bin(3, pH), '을/를')} 따르고, 확률변수 ${jh(ms('Y'), '은/는')} 이항분포 ${jh(bin(4, frac(pH, 2)), '을/를')} 따른다. ${jh(nb(PR('X >= 2') + ' = ' + c + pr(ms('Y = 4'))), '일')} 때, 양수 ${jh(pH, '의')} 값은?`, p, {
          explain: `${PR('X >= 2')} = ${nC(3, 2)}${pH}<sup>2</sup>(1 ${MINUS} ${pH}) + ${pH}<sup>3</sup> = 3${pH}<sup>2</sup> ${MINUS} 2${pH}<sup>3</sup>, ${pr(ms('Y = 4'))} = (${frac(pH, 2)})<sup>4</sup> = ${frac(pH + '<sup>4</sup>', 16)}이다. 3${pH}<sup>2</sup> ${MINUS} 2${pH}<sup>3</sup> = ${frac(c + pH + '<sup>4</sup>', 16)}의 양변을 ${pH}<sup>2</sup>으로 나누면 ${c}${pH}<sup>2</sup> + 32${pH} ${MINUS} 48 = 0이고, 양수인 근은 ${pH} = ${fq(p)}이다.`,
          value: jq(p), derived: [p.p, p.q]
        });
      }
      const c = d.int(9, 31), p = R(32 - c, 48);
      return ratQ(`확률변수 ${jh(X, '은/는')} 이항분포 ${jh(bin(3, pH), '을/를')} 따르고, 확률변수 ${jh(ms('Y'), '은/는')} 이항분포 ${jh(bin(4, '2' + pH), '을/를')} 따른다. ${jh(nb(c + PX(3) + ' = ' + PR('Y >= 3')), '일')} 때, 양수 ${jh(pH, '의')} 값은?`, p, {
        explain: `${PX(3)} = ${pH}<sup>3</sup>, ${PR('Y >= 3')} = ${nC(4, 3)}(2${pH})<sup>3</sup>(1 ${MINUS} 2${pH}) + (2${pH})<sup>4</sup> = 32${pH}<sup>3</sup> ${MINUS} 48${pH}<sup>4</sup>이다. ${c}${pH}<sup>3</sup> = 32${pH}<sup>3</sup> ${MINUS} 48${pH}<sup>4</sup>에서 ${pH} &gt; 0이므로 48${pH} = ${32 - c}, ${pH} = ${fq(p)}이다.`,
        value: `(32-${c})/48`, derived: [32, 48]
      });
    }, { count: 2 })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 이항분포의 평균·분산·표준편차 ──
  const PS = [R(1, 2), R(1, 3), R(2, 3), R(1, 4), R(3, 4), R(1, 5), R(2, 5), R(3, 5), R(4, 5), R(1, 6), R(1, 10)];
  // B(n, p)에서 np 와 npq 가 모두 정수가 되는 n(범위 안)
  const goodN = (d, p, lo, hi) => { const list = []; for (let k = lo; k <= hi; k += 1) if ((k * p.p) % p.q === 0 && (k * p.p * (p.q - p.p)) % (p.q * p.q) === 0) list.push(k); return list.length ? d.pick(list) : null; };
  B.addTypes(UNIT, 'binm', [
    T('binm-basic', '이항분포의 평균·분산·표준편차', '②13', (d, n) => {
      const p = d.pick(PS), q = qsub(R(1), p);
      if (n === 0) {
        const nn = goodN(d, p, 20, 400);
        if (!nn) return null;
        const E = nn * p.p / p.q, Vv = E * q.p / q.q;
        return slots(`확률변수 ${jh(X, '이/가')} 이항분포 ${jh(B2(nn, p), '을/를')} 따를 때, ${jh(X, '의')} 평균과 분산은?`, [[EX, E, `${nn}*${p.p}/${p.q}`], [VX, Vv, `${nn}*${p.p}*(${p.q}-${p.p})/(${p.q}*${p.q})`]], {
          explain: `${EX} = ${nn} × ${fq(p)} = ${E}, ${VX} = ${nn} × ${fq(p)} × ${fq(q)} = ${Vv}이다.`
        });
      }
      const nn = d.int(10, 400);
      if ((nn * p.p) % p.q !== 0) return null;
      const Vq = R(nn * p.p * q.p, p.q * q.q);
      if (Vq.q !== 1) return null;
      const [a, b] = sqParts(Vq.p);
      if (a < 2 || b < 2) return null;
      return sdAns(`확률변수 ${jh(X, '이/가')} 이항분포 ${jh(B2(nn, p), '을/를')} 따를 때, ${jh(X, '의')} 표준편차는?`, a, b, {
        explain: `${VX} = ${nn} × ${fq(p)} × ${fq(q)} = ${Vq.p}이므로 ${SX} = ${rt(Vq.p)} = ${a}${rt(b)}이다.`,
        calc: [[`${a}`, 0], [`${b}`, 1]], derived: [a, b]
      });
    }, { count: 2 }),

    T('binm-pmf', '확률질량함수의 식에서 이항분포를 알아보고 평균·분산', '②14', (d) => {
      const p = d.pick([R(1, 3), R(2, 3), R(1, 4), R(3, 4), R(2, 5), R(1, 6)]), q = qsub(R(1), p), nn = p.q * d.int(3, 30);
      const E = R(nn * p.p, p.q), Vv = qmul(E, q);
      if (E.q !== 1 || Vv.q === 1) return null;
      const eRow = [EX, E, false, [`${nn}*${p.p}/${p.q}`]]; eRow.int = true;
      return fracsQ(`확률변수 ${X}의 확률질량함수가 ${nb(pr(ms('X = x')) + ' = ' + nC(nn, Xs) + '(' + fq(p) + ')<sup>' + Xs + '</sup>(' + fq(q) + ')<sup>' + nn + MINUS + Xs + '</sup>')} ${nb('(' + Xs + ' = 0, 1, 2, …, ' + nn + ')')}일 때, ${jh(X, '의')} 평균과 분산은?`, [eRow, [VX, Vv, false, [`${nn}*${p.p}*${q.p}`, `${p.q}*${q.q}`]]], {
        explain: `${jh(X, '은/는')} 이항분포 ${jh(B2(nn, p), '을/를')} 따르므로 ${EX} = ${nn} × ${fq(p)} = ${E.p}, ${VX} = ${nn} × ${fq(p)} × ${fq(q)} = ${fq(Vv)}이다.`
      });
    }),

    T('binm-situ', '상황에서 이항분포의 평균·표준편차', '②15', (d) => {
      const [r, nn] = d.pick([[90, 400], [10, 400], [10, 900], [20, 100], [20, 400], [80, 100], [80, 400], [50, 100], [50, 400], [50, 196], [90, 900], [75, 192], [25, 48], [60, 600]]);
      const p = R(r, 100), E = nn * r / 100, Vv = nn * r * (100 - r) / 10000, s = Math.round(Math.sqrt(Vv));
      if (s * s !== Vv) return null;
      const sc = d.pick([['발아율이', '씨앗', '개를 심었을 때, 싹이 트는 씨앗의 수', '개'], ['불량률이', '부품 공장에서 만든 부품 가운데', '개를 임의로 꺼낼 때, 불량품의 수', '개'], ['학교생활에 만족하는 학생의 비율이', '어느 학교의 학생 가운데', '명을 임의로 뽑을 때, 만족하는 학생의 수', '명'], ['명중률이', '사격 선수가 총을', '발 쏠 때, 명중시키는 횟수', '번']]);
      return slots(`${sc[0]} ${r} %인 ${sc[1]} ${nn}${sc[2]}를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(X, '의')} 평균과 표준편차는?`, [[EX, E, `${nn}*${r}/100`], [SX, s, `${s}`]], {
        explain: `${jh(X, '은/는')} 이항분포 ${jh(B2(nn, p), '을/를')} 따르므로 ${EX} = ${nn} × ${fq(p)} = ${E}, ${VX} = ${nn} × ${fq(p)} × ${fq(qsub(R(1), p))} = ${Vv}, ${SX} = ${rt(Vv)} = ${s}이다.`,
        derived: [100, s]
      });
    }),

    T('binm-trial', '한 번 시행의 확률을 먼저 구하는 이항분포의 평균·분산', '②16', (d, n) => {
      const kind = d.int(0, 2);
      let p, head, how;
      if (kind === 0) {
        const w = d.int(2, 4), k = d.int(2, 6), N2 = comb(w + k, 2), ev2 = d.int(0, 2);
        const cnt = [comb(w, 2), w * k, comb(w, 2) + comb(k, 2)][ev2], name = ['두 공이 모두 흰 공', '흰 공과 검은 공이 하나씩', '두 공의 색이 같은 경우'][ev2];
        p = R(cnt, N2);
        head = (nn) => `흰 공 ${w}개와 검은 공 ${k}개가 들어 있는 주머니에서 임의로 2개의 공을 동시에 꺼내어 색을 확인하고 다시 넣는 시행을 ${nn}번 반복할 때, ${name === '두 공의 색이 같은 경우' ? '두 공의 색이 같은' : name + '인'} 횟수`;
        how = `한 번의 시행에서 그렇게 될 확률은 ${frac(cnt, nC(w + k, 2))} = ${fq(p)}`;
      } else if (kind === 1) {
        const c = d.pick([8, 9, 10, 12, 14, 15]), good = [1, 2, 3, 4, 5, 6].filter((t) => gcd(t, Math.abs(c - t)) === 1 && c - t !== 0);
        if (good.length === 0 || good.length === 6) return null;
        p = R(good.length, 6);
        head = (nn) => `한 개의 주사위를 던져서 나온 눈의 수 ${V('t')}에 대하여 ${V('t')}와 ${nb('(' + c + ' ' + MINUS + ' ' + V('t') + ')')}가 서로소인 사건을 A라 하자. 이 주사위를 ${nn}번 던질 때 사건 A가 일어나는 횟수`;
        how = `${V('t')} = ${good.join(', ')}일 때 서로소이므로 한 번 던질 때 A가 일어날 확률은 ${frac(good.length, 6)} = ${fq(p)}`;
      } else {
        const parts = randDist(d, 4, [100]).map((x) => x.p * (100 / x.q)), [o, a, b, ab] = parts;
        if (Math.min(...parts) < 5) return null;
        p = R(a + b, 100);
        head = (nn) => `다음 표는 어느 학교 학생들의 혈액형을 조사한 것이다. 이 학교 학생 가운데 ${nn}명을 임의로 뽑을 때, 혈액형이 A형 또는 B형인 학생의 수`;
        how = `한 명이 A형 또는 B형일 확률은 ${frac(a + ' + ' + b, 100)} = ${fq(p)}`;
        p.tb = `<table class="mb-table" aria-label="혈액형별 인원(명): O형 ${o}, A형 ${a}, B형 ${b}, AB형 ${ab}, 합계 100"><tbody><tr><th>혈액형</th> <td>O형</td> <td>A형</td> <td>B형</td> <td>AB형</td></tr> <tr><th>인원(명)</th> <td>${o}</td> <td>${a}</td> <td>${b}</td> <td>${ab}</td></tr></tbody></table>`;
      }
      if (p.q === 1) return null;
      const nn = p.q * d.int(3, Math.floor(600 / p.q)), q = qsub(R(1), p), E = nn * p.p / p.q, Vv = qmul(R(E), q);
      if (n === 1 && Vv.q === 1) return null;
      const ask = n === 0 ? `${jh(X, '의')} 평균은?` : `${jh(X, '의')} 분산은?`;
      const out = (n === 0 ? numQ : ratQ)(`${head(nn)}를 확률변수 ${jh(X, '이라/라')} 하자. ${ask}`, n === 0 ? E : Vv, {
        figure: p.tb,
        explain: `${how}이므로 ${jh(X, '은/는')} 이항분포 ${jh(B2(nn, p), '을/를')} 따른다. 따라서 ${n === 0 ? `${EX} = ${nn} × ${fq(p)} = ${E}` : `${VX} = ${nn} × ${fq(p)} × ${fq(q)} = ${fq(Vv)}`}이다.`,
        value: n === 0 ? `${nn}*${p.p}/${p.q}` : `${nn}*${p.p}/${p.q}*(1-${p.p}/${p.q})`, auto: true
      });
      return out;
    }, { count: 2 }),

    T('binm-back', '이항분포의 평균·분산에서 n이나 p를 거꾸로', '②17', (d, n) => {
      if (n === 0) {
        const p = d.pick([R(1, 2), R(1, 3), R(1, 4), R(1, 5), R(1, 10)]), q = qsub(R(1), p);
        const nn = goodN(d, p, 16, 900);
        if (!nn) return null;
        const Vv = nn * p.p * q.p / (p.q * q.q), s = Math.round(Math.sqrt(Vv)), useSd = s * s === Vv && d.bool();
        const a = d.pick([2, 3, 4, 5, 10]), b = d.pick([-6, -3, -1, 1, 3, 5]), E = nn * p.p / p.q, ans = a * E + b;
        const given = useSd ? nb(SX + ' = ' + s) : nb(VX + ' = ' + Vv);
        return numQ(`이항분포 ${jh(bin(V('n'), fq(p)), '을/를')} 따르는 확률변수 ${X}에 대하여 ${jh(given, '일')} 때, ${jh(ev(linH(a, b)), '의')} 값은?`, ans, {
          explain: `${VX} = ${V('n')} × ${fq(p)} × ${fq(q)} = ${Vv}이므로 ${V('n')} = ${nn}이고 ${EX} = ${nn} × ${fq(p)} = ${E}이다. 따라서 ${ev(linH(a, b))} = ${a} × ${E}${plusB(b)} = ${ans}이다.`,
          value: `${a}*(${Vv}/(${jq(p)}*(1-${jq(p)})))*${jq(p)}+${jn(b)}`, auto: true
        });
      }
      if (n === 1) {
        const nn = d.pick([20, 30, 40, 50, 60, 80, 90, 100, 120, 150, 200]), p = d.pick(PS.filter((x) => (nn * x.p) % x.q === 0)), E = nn * p.p / p.q, Vv = qmul(R(E), qsub(R(1), p));
        if (Vv.q === 1) return null;
        return ratQ(`이항분포 ${jh(bin(nn, V('p')), '을/를')} 따르는 확률변수 ${X}의 평균이 ${jh(String(E), '일')} 때, ${jh(X, '의')} 분산은?`, Vv, {
          explain: `${EX} = ${nn}${V('p')} = ${E}에서 ${V('p')} = ${fq(p)}이므로 ${VX} = ${nn} × ${fq(p)} × ${fq(qsub(R(1), p))} = ${fq(Vv)}이다.`,
          value: `${E}*(1-${E}/${nn})`
        });
      }
      const p = d.pick([R(1, 2), R(1, 3), R(1, 4), R(2, 5), R(1, 5), R(3, 4)]), q = qsub(R(1), p), nn = p.q * d.int(4, 60), E = nn * p.p / p.q, Vv = qmul(R(E), q);
      if (Vv.q !== 1) return null;
      return numQ(`확률변수 ${jh(X, '이/가')} 이항분포 ${jh(bin(V('n'), fq(p)), '을/를')} 따르고 ${jh(nb(EX + ' = ' + E), '일')} 때, ${jh(VX, '의')} 값은?`, Vv.p, {
        explain: `${EX} = ${V('n')} × ${fq(p)} = ${E}에서 ${V('n')} = ${nn}이다. 따라서 ${VX} = ${nn} × ${fq(p)} × ${fq(q)} = ${Vv.p}이다.`,
        value: `${E}*(1-${jq(p)})`
      });
    }, { count: 3 }),

    T('binm-sq', '이항분포에서 X²의 평균', '②18', (d) => {
      const p = d.pick(PS), q = qsub(R(1), p), nn = goodN(d, p, 20, 200);
      if (!nn) return null;
      const E = nn * p.p / p.q, Vv = E * q.p / q.q, ans = Vv + E * E;
      if (ans > 9999) return null;
      if (d.bool()) {
        return numQ(`이항분포 ${jh(bin(nn, V('p')), '을/를')} 따르는 확률변수 ${X}의 평균이 ${jh(String(E), '일')} 때, ${jh(EX2, '의')} 값은?`, ans, {
          explain: `${nn}${V('p')} = ${E}에서 ${V('p')} = ${fq(p)}이므로 ${VX} = ${nn} × ${fq(p)} × ${fq(q)} = ${Vv}이다. ${VX} = ${EX2} ${MINUS} {${EX}}<sup>2</sup>이므로 ${EX2} = ${Vv} + ${E}<sup>2</sup> = ${ans}이다.`,
          value: `${E}*(1-${E}/${nn})+${E}*${E}`
        });
      }
      const r = p.p * 100 / p.q;
      if (!Number.isInteger(r)) return null;
      return numQ(`어느 과수원에서 수확한 사과의 ${r} %가 1등급이라고 한다. 이 과수원의 사과 가운데 ${nn}개를 임의로 고를 때 1등급인 사과의 개수를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(ms('X^2'), '의')} 평균은?`, ans, {
        explain: `${jh(X, '은/는')} 이항분포 ${jh(B2(nn, p), '을/를')} 따르므로 ${EX} = ${E}, ${VX} = ${Vv}이다. 따라서 ${EX2} = ${VX} + {${EX}}<sup>2</sup> = ${Vv} + ${E}<sup>2</sup> = ${ans}이다.`,
        value: `${nn}*${r}/100*(1-${r}/100)+(${nn}*${r}/100)*(${nn}*${r}/100)`, derived: [100]
      });
    }),

    T('binm-lin', '이항분포를 따르는 X의 aX + b의 평균·분산', '②19', (d) => {
      const p = d.pick(PS), q = qsub(R(1), p), nn = goodN(d, p, 6, 120);
      if (!nn) return null;
      const E = nn * p.p / p.q, Vv = E * q.p / q.q, a = d.pick([-5, -3, -2, 2, 3, 4, 5]), b = d.pick([-8, -5, -1, 2, 4, 7, 10]);
      return slots(`확률변수 ${jh(X, '이/가')} 이항분포 ${jh(B2(nn, p), '을/를')} 따를 때, 확률변수 ${jh(linH(a, b), '의')} 평균과 분산은?`, [
        [ev(linH(a, b)), a * E + b, `${jn(a)}*${nn}*${p.p}/${p.q}+${jn(b)}`, true], [vr(linH(a, b)), a * a * Vv, `${jn(a)}*${jn(a)}*${nn}*${p.p}*(${p.q}-${p.p})/(${p.q}*${p.q})`]
      ], {
        explain: `${EX} = ${nn} × ${fq(p)} = ${E}, ${VX} = ${nn} × ${fq(p)} × ${fq(q)} = ${Vv}이므로 평균은 ${par(a)} × ${E}${plusB(b)} = ${num(a * E + b)}, 분산은 ${par(a)}<sup>2</sup> × ${Vv} = ${a * a * Vv}이다.`
      });
    }),

    T('binm-linback', 'aX + b의 평균·분산에서 이항분포의 n 구하기', '②20', (d) => {
      const p = d.pick([R(1, 4), R(1, 2), R(1, 3), R(3, 4), R(2, 5), R(1, 5)]), q = qsub(R(1), p), nn = p.q * d.int(5, 80), E = R(nn * p.p, p.q), Vv = qmul(E, q);
      const a = d.pick([-2, -3, 2, 3, -4]), b = d.int(-20, 80), e = qadd(qmul(R(a), E), R(b)), v = qmul(R(a * a), Vv);
      if (e.q !== 1 || v.q !== 1 || b === 0) return null;
      return numQ(`확률변수 ${jh(X, '이/가')} 이항분포 ${jh(bin(V('n'), V('p')), '을/를')} 따를 때, 확률변수 ${jh(linH(a, b), '의')} 평균과 분산이 각각 ${num(e.p)}, ${v.p}이다. 자연수 ${jh(V('n'), '의')} 값은?`, nn, {
        explain: `${par(a)}${EX}${plusB(b)} = ${num(e.p)}에서 ${EX} = ${fq(E)}, ${par(a)}<sup>2</sup>${VX} = ${v.p}에서 ${VX} = ${fq(Vv)}이다. ${V('n')}${V('p')} = ${fq(E)}, ${V('n')}${V('p')}(1 ${MINUS} ${V('p')}) = ${fq(Vv)}에서 1 ${MINUS} ${V('p')} = ${fq(q)}, ${V('p')} = ${fq(p)}이므로 ${V('n')} = ${nn}이다.`,
        value: `((${jn(e.p)}-${jn(b)})/${jn(a)})/(1-(${v.p}/(${jn(a)}*${jn(a)}))/((${jn(e.p)}-${jn(b)})/${jn(a)}))`
      });
    }),

    T('binm-compare', '두 이항분포의 분산을 비교하는 n의 최솟값', '②21', (d) => {
      const SX0 = d.pick([{ t: (k) => `한 개의 주사위를 ${k}번 던질 때 4의 약수의 눈이 나오는 횟수`, p: R(1, 2) }, { t: (k) => `한 개의 주사위를 ${k}번 던질 때 3의 배수의 눈이 나오는 횟수`, p: R(1, 3) }, { t: (k) => `한 개의 동전을 ${k}번 던질 때 앞면이 나오는 횟수`, p: R(1, 2) }]);
      const SY0 = d.pick([{ t: '서로 다른 두 개의 동전을 동시에 n번 던질 때 두 동전이 모두 앞면이 나오는 횟수', p: R(1, 4) }, { t: '한 개의 주사위를 n번 던질 때 6의 눈이 나오는 횟수', p: R(1, 6) }, { t: '서로 다른 두 개의 동전을 동시에 n번 던질 때 두 동전이 서로 다른 면이 나오는 횟수', p: R(1, 2) }]);
      const k = d.pick([10, 12, 18, 20, 24, 30, 36]), VXv = qmul(qmul(R(k), SX0.p), qsub(R(1), SX0.p)), pq0 = qmul(SY0.p, qsub(R(1), SY0.p));
      const bound = qdiv(VXv, pq0), ans = Math.floor(bound.p / bound.q) + 1;
      if (SX0.p.p === SY0.p.p && SX0.p.q === SY0.p.q) return null;
      return numQ(`${SX0.t(k)}를 확률변수 ${jh(X, '이라/라')} 하고, ${SY0.t.replace('n번', V('n') + '번')}를 확률변수 ${jh(ms('Y'), '이라/라')} 하자. ${jh(nb(VX + ' &lt; ' + vr('Y')), '을/를')} 만족시키는 자연수 ${jh(V('n'), '의')} 최솟값은?`, ans, {
        explain: `${VX} = ${k} × ${fq(SX0.p)} × ${fq(qsub(R(1), SX0.p))} = ${fq(VXv)}, ${vr('Y')} = ${V('n')} × ${fq(SY0.p)} × ${fq(qsub(R(1), SY0.p))} = ${fq(pq0)}${V('n')}이다. ${fq(VXv)} &lt; ${fq(pq0)}${V('n')}에서 ${V('n')} &gt; ${fq(bound)}이므로 자연수 ${jh(V('n'), '의')} 최솟값은 ${ans}이다.`,
        value: `${ans}`, derived: [ans]
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
