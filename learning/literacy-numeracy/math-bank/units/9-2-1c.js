// 중학교 3학년 2학기 1단원 삼각비 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-2-1a.js 에 있다. ref: 심n = 심화꼴의 n번, 기본 ①n = 기본꼴_1의 n번(기본 자료에만 나온 꼴).
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - sin A : cos A 의 비를 sin A, cos A 의 값 자체로 본다(sin A = 3, cos A = 4). 두 값의 비는 대변 : 이웃한 변이다.
//  - 90° − A 를 새로운 각으로 여겨 값을 모른다고 한다. 같은 직각삼각형의 다른 예각이다.
//  - 직각 표시가 없으면 직각삼각형이 아니라고 여긴다. 세 변이 a² + b² = c² 를 만족하면 직각삼각형이다(피타고라스 정리의 역).
//  - 0° < A < 45° 에서도 sin A ≥ cos A 로 보고 근호를 벗긴다. 45°보다 작으면 sin A < cos A, tan A < 1 이다.
//  - 직선의 기울기를 그 직선이 x축과 이루는 각의 sin 으로 본다. 기울기는 tan 이다.
//  - 수선의 발에서 생긴 작은 삼각형의 각(∠CDE)에서 대변과 이웃한 변을 큰 삼각형 기준으로 댄다.
//  - cos(x + y) 를 cos x + cos y 로 셈한다. 각을 먼저 구해 더한다.
//  - cos A = 1 인 A 를 정할 수 없다고 한다. 0°의 삼각비까지 본다(cos 0° = 1, sin 90° = 1).
//
// 실력에는 ① 문제의 그림·조건에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴, 두 단계를 잇는 꼴(한 변과 삼각비로 다른 변, 수선으로 같은 각 찾기 따위)은 기본 묶음에 있다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, C, inline } = B.kit;
  const { MINUS, gcd, lcm, Q, qmul, qadd, fl, nb, tail, V, sup, rt, grp, SG } = B.kit.mid;
  const { r1, at, dirOf, dist, sv, TINT, WHITE, CLEAR, Board } = B.kit.mgeo;
  const K = B.kit.m921, K2 = B.kit.m921b;
  const { UNIT, STD, num, sqrtN, sqrtQ, rad, vadd, vneg, vsub, vmul, vinv, vdiv, vfl, veq, kindOf, isSq, vh, vt, SV, fn, fd, fx, X, seg, FN3, stripH, seal, more,
    aInt, aFrac, aRad, aRadFrac, aSum, aPick, pickRows, fig, rtFig, POSES, degx, TRIPLES, legsOf, fair, PYTH, ONE } = K;
  const { term, tv, th, opv, OPS, ITALIC, exh, DEGS, dg } = K2;
  const H = (id, title, ref, make, more0) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more0 || {});
  const SPECIAL = [num(1, 2), rad(1, 2, 2), rad(1, 3, 2), rad(1, 3, 3), num(1), rad(1, 3)];
  const SP0 = [[]].concat(SPECIAL);
  // 비스듬히 본 직각 표시(평행사변형의 두 변): 꼭짓점 v 에서 p 쪽, q 쪽으로 m 만큼
  function rightMark(b, v, p, q, m) {
    const u = (s, t) => { const L = dist(s, t); return [(t[0] - s[0]) / L, (t[1] - s[1]) / L]; }, u1 = u(v, p), u2 = u(v, q), k = m || 7;
    const p1 = [v[0] + u1[0] * k, v[1] + u1[1] * k], p3 = [v[0] + u2[0] * k, v[1] + u2[1] * k], p2 = [p1[0] + u2[0] * k, p1[1] + u2[1] * k];
    b.shape(`M${r1(p1[0])} ${r1(p1[1])}L${r1(p2[0])} ${r1(p2[1])}L${r1(p3[0])} ${r1(p3[1])}`, [p1, p2, p3], 'fill:none;stroke:#b42318;stroke-width:1.2');
    return b;
  }
  // 이차식 a x² + b x + c 의 글(a 는 자연수, b ≤ 0, c ≥ 0 인 값)
  function quadText(a, bv, cv) {
    const x = X, coef = (v) => (veq(v, num(1)) ? '' : v.length > 1 ? '(' + vh(v) + ')' : vh(v));
    let out = (a === 1 ? '' : a) + x + sup(2);
    if (bv.length) out += ' ' + MINUS + ' ' + coef(vneg(bv)) + x;
    if (cv.length) out += ' + ' + vh(cv);
    return nb(out + ' = 0');
  }
  // 두 근이 r1, r2 인 이차방정식(계수의 분모를 없앤다)
  function quadOf(r1v, r2v) {
    const S = vadd(r1v, r2v), P = vmul(r1v, r2v), L = S.concat(P).reduce((l, t) => lcm(l, t.q.q), 1);
    return { a: L, b: vmul(vneg(S), num(L)), c: vmul(P, num(L)) };
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 그림·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-sincos-ratio', 'sin A : cos A 의 비로 삼각비 구하기', '기본 ①13', (d) => {
        // 함정: 비 p : q 를 sin A = p, cos A = q 로 보거나, 빗변을 p + q 로 잡는다. sin A : cos A = 대변 : 이웃한 변이다.
        const w = d.until(() => ({ p: d.int(1, 7), q: d.int(1, 7), f0: d.pick(['sin', 'cos']) }), (z) => z.p !== z.q && gcd(z.p, z.q) === 1 && !isSq(z.p * z.p + z.q * z.q));
        const { p, q, f0 } = w, hyp = sqrtN(p * p + q * q), x = vdiv(num(f0 === 'sin' ? p : q), hyp);
        return aRadFrac(`∠A가 예각이고 ${nb(`${fn('sin', 'A')} : ${fn('cos', 'A')} = ${p} : ${q}`)}일 때, ${fn(f0, 'A')}의 값은?`, x, {
          sq: [`${f0 === 'sin' ? p : q}**2`, `${p}**2+${q}**2`],
          explain: `∠C = 90°인 직각삼각형 ABC에서 ${fn('sin', 'A')} = ${frac(seg('BC'), seg('AB'))}, ${fn('cos', 'A')} = ${frac(seg('AC'), seg('AB'))}이므로 ${nb(`${fn('sin', 'A')} : ${fn('cos', 'A')} = ${seg('BC')} : ${seg('AC')} = ${p} : ${q}`)}이다. ${seg('BC')} = ${K.kv(p)}, ${seg('AC')} = ${K.kv(q)}(${V('k')} &gt; 0)라 하면 ${seg('AB')} = ${vh(hyp)}${V('k')}이므로 ${fn(f0, 'A')} = ${vh(x)}이다.`
        });
      }),
      H('hard-complement', '90° − A 의 삼각비를 직각삼각형의 다른 예각으로 구하기', '심2', (d) => {
        // 함정: 90° − A 를 모르는 각으로 여긴다. ∠C = 90°이면 ∠B = 90° − ∠A 이다.
        const w = d.until(() => ({ p: d.int(1, 8), q: d.int(1, 8), f0: d.pick(['sin', 'cos']) }), (z) => z.p !== z.q && gcd(z.p, z.q) === 1 && !isSq(z.p * z.p + z.q * z.q));
        const { p, q, f0 } = w, hyp = sqrtN(p * p + q * q), x = vdiv(num(f0 === 'sin' ? q : p), hyp);
        return aRadFrac(`∠A가 예각이고 ${fn('tan', 'A')} = ${frac(p, q)}일 때, ${nb(`${f0}(90° − A)`)}의 값은?`, x, {
          sq: [`${f0 === 'sin' ? q : p}**2`, `${p}**2+${q}**2`],
          explain: `∠C = 90°, ${seg('BC')} = ${p}, ${seg('AC')} = ${q}인 직각삼각형 ABC를 생각하면 ${seg('AB')} = ${vh(hyp)}이고 ∠B = 90° − ∠A이다. ${nb(`${f0}(90° − A)`)} = ${fn(f0, 'B')} = ${f0 === 'sin' ? frac(seg('AC'), seg('AB')) : frac(seg('BC'), seg('AB'))} = ${vh(x)}이다.`
        });
      }),
      H('hard-converse', '직각 표시가 없는 삼각형에서 직각을 찾아 삼각비 구하기', '기본 ①14', (d) => {
        // 함정: 그림에 ∠A 의 직각 표시가 없다. 세 변이 a² + b² = c² 이므로 ∠A = 90°이고 ∠BAH = ∠C 이다.
        const w = d.until(() => {
          const [ab, ac, bc] = legsOf(d), which = d.pick(['BAH', 'CAH']), f0 = d.pick(FN3);
          const Hx = ab * ab / bc, A = [Hx, ab * ac / bc];
          const f = fig({ A, B: [0, 0], C: [bc, 0], H: [Hx, 0] }, { polys: [['A', 'B', 'C']], segs: [['A', 'H']], right: [['H', 'C', 'A']], side: [['A', 'B', String(ab)], ['A', 'C', String(ac)]], dims: [['B', 'C', String(bc), 'A', 16]], nameAt: { H: 135 },
            ang: [['A', which === 'BAH' ? 'B' : 'C', 'H', degx('x'), { r: 16 }]], size: [200, 104] });
          return { ab, ac, bc, which, f0, f };
        }, (z) => Math.max(z.ab, z.ac) / Math.min(z.ab, z.ac) <= 2 && !z.f.b.clash());
        const { ab, ac, bc, which, f0 } = w, same = which === 'BAH' ? 'C' : 'B', opp = same === 'C' ? ab : ac, adj = same === 'C' ? ac : ab;
        const x = f0 === 'sin' ? num(opp, bc) : f0 === 'cos' ? num(adj, bc) : num(opp, adj);
        return aFrac(`그림과 같이 ${seg('AB')} = ${ab}, ${seg('AC')} = ${ac}, ${seg('BC')} = ${bc}인 △ABC의 꼭짓점 A에서 ${seg('BC')}에 내린 수선의 발을 H라 하자. ∠${which} = ${X}°일 때, ${fx(f0, 'x')}의 값은?`, x, {
          figure: w.f.b.svg(`삼각형 ABC와 A에서 변 BC에 내린 수선 AH. ∠AHB에만 직각 표시가 있다. AB = ${ab}, AC = ${ac}, BC = ${bc}. ∠${which}에 x°가 적혀 있다`),
          sq: f0 === 'sin' ? [`${opp}**2`, `${bc}**2`] : f0 === 'cos' ? [`${adj}**2`, `${bc}**2`] : [`${opp}**2`, `${adj}**2`],
          explain: `${ab}${sup(2)} + ${ac}${sup(2)} = ${bc}${sup(2)}이므로 △ABC는 ∠A = 90°인 직각삼각형이다. △ABC와 △${which === 'BAH' ? 'HBA' : 'HAC'}에서 ∠${which === 'BAH' ? 'B' : 'C'}는 공통이고 직각이 하나씩 있으므로 ∠${which} = ∠${same}이다. ${fx(f0, 'x')} = ${fn(f0, same)} = ${vh(x)}이다.`
        });
      }),
      H('hard-abs-simplify', '삼각비의 대소로 근호를 벗겨 식 간단히 하기', '기본 ①43 심19', (d, n) => {
        // 함정: 45°를 기준으로 sin 과 cos 의 크기, tan 과 1의 크기가 바뀐다. 범위를 보지 않고 근호를 그대로 벗긴다.
        const low = d.bool(), range = low ? `0° &lt; A &lt; 45°` : `45° &lt; A &lt; 90°`, sA = fn('sin', 'A'), cA = fn('cos', 'A'), tA = fn('tan', 'A');
        const sq = (h) => rt(`(${h})${sup(2)}`);
        let shown, right, why;
        const all = n === 0 ? [`2${sA} − 2${cA}`, `2${cA} − 2${sA}`, `2${sA}`, `2${cA}`, '0'] : [`2${tA}`, '2', `${MINUS}2`, '0', `2 − 2${tA}`];
        if (n === 0) {
          const form = d.int(0, 1);
          if (form === 0) { shown = `${sq(`${cA} − ${sA}`)} + ${sq(`${sA} − ${cA}`)}`; right = low ? all[1] : all[0]; why = low ? `${sA} &lt; ${cA}이므로 ${cA} − ${sA} &gt; 0, ${sA} − ${cA} &lt; 0이다. (${cA} − ${sA}) − (${sA} − ${cA}) = ${all[1]}이다.` : `${sA} &gt; ${cA}이므로 ${cA} − ${sA} &lt; 0, ${sA} − ${cA} &gt; 0이다. −(${cA} − ${sA}) + (${sA} − ${cA}) = ${all[0]}이다.`; }
          else { shown = `${sq(`${sA} + ${cA}`)} − ${sq(`${sA} − ${cA}`)}`; right = low ? all[2] : all[3]; why = low ? `${sA} + ${cA} &gt; 0이고 ${sA} &lt; ${cA}이므로 ${sA} − ${cA} &lt; 0이다. (${sA} + ${cA}) + (${sA} − ${cA}) = ${all[2]}이다.` : `${sA} + ${cA} &gt; 0이고 ${sA} &gt; ${cA}이므로 ${sA} − ${cA} &gt; 0이다. (${sA} + ${cA}) − (${sA} − ${cA}) = ${all[3]}이다.`; }
        } else {
          const form = d.int(0, 1);
          if (form === 0) { shown = `${sq(`${tA} + 1`)} − ${sq(`${tA} − 1`)}`; right = low ? all[0] : all[1]; why = low ? `${tA} &lt; 1이므로 ${tA} − 1 &lt; 0이다. (${tA} + 1) + (${tA} − 1) = ${all[0]}이다.` : `${tA} &gt; 1이므로 ${tA} − 1 &gt; 0이다. (${tA} + 1) − (${tA} − 1) = 2이다.`; }
          else { shown = `${sq(`1 − ${tA}`)} + ${sq(`1 + ${tA}`)}`; right = low ? all[1] : all[0]; why = low ? `${tA} &lt; 1이므로 1 − ${tA} &gt; 0이다. (1 − ${tA}) + (1 + ${tA}) = 2이다.` : `${tA} &gt; 1이므로 1 − ${tA} &lt; 0이다. −(1 − ${tA}) + (1 + ${tA}) = ${all[0]}이다.`; }
        }
        return pickRows(d, `${range}일 때, 다음 식을 간단히 한 것은?`, all.map((h) => [h, h === right]), { figure: exh(shown), explain: why, rule: n === 0 ? 'abs-sincos' : 'abs-tan' });
      }, { count: 2 }),
      H('hard-line', '직선의 기울기와 x축이 이루는 각의 삼각비', '심11', (d, n) => {
        if (n === 0) {
          // 함정: 기울기가 그대로 tan(각)이다. 기울기를 sin 으로 본 아이, 절편으로만 풀려다 헤매는 아이가 있다.
          const w = d.until(() => ({ p: d.int(1, 6), q: d.int(1, 4), k: d.pick([-5, -4, -3, -2, 2, 3, 4, 5]), neg: d.bool(), f0: d.pick(['sin', 'cos']) }), (z) => gcd(z.p, z.q) === 1 && z.p !== z.q && !isSq(z.p * z.p + z.q * z.q));
          const { p, q, k, neg, f0 } = w, hyp = sqrtN(p * p + q * q), x = vdiv(num(f0 === 'sin' ? p : q), hyp), yv = V('y');
          const slope = (neg ? MINUS : '') + (q === 1 ? (p === 1 ? '' : p) : frac(p, q));
          const eq = `${yv} = ${slope}${X} ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`;
          return aRadFrac(`직선 ${nb(eq)}${tail(Math.abs(k), '이/가')} ${X}축과 이루는 예각의 크기를 ${V('a')}°라 할 때, ${fx(f0, 'a')}의 값은?`, x, {
            sq: [`${f0 === 'sin' ? p : q}**2`, `${p}**2+${q}**2`],
            explain: `직선의 기울기가 ${slope}이므로 ${X}의 값이 ${q} 증가할 때 ${yv}의 값이 ${p}만큼 ${neg ? '감소' : '증가'}한다. 직선과 ${X}축이 이루는 예각을 낀 직각삼각형의 밑변을 ${q}, 높이를 ${p}${tail(p, '으로/로')} 잡으면 ${fx('tan', 'a')} = ${frac(p, q)}이고 빗변은 ${vh(hyp)}이다. ${fx(f0, 'a')} = ${vh(x)}이다.`,
            rule: 'line-slope'
          });
        }
        // 계수에 특수각의 삼각비가 든 일차방정식 (f₁)x + (f₂)y = 1 → x 절편 1/α, y 절편 1/β, tan a = α/β
        const w = d.until(() => ({ p: term(d), q: term(d), f0: d.pick(['sin', 'cos']) }), (z) => {
          const a1 = tv(z.p), b1 = tv(z.q); if (!a1.length || !b1.length) return false;
          const t = vdiv(a1, b1), hyp = sqrtQ(vadd(vmul(t, t), num(1))[0].q), v = z.f0 === 'sin' ? vdiv(t, hyp) : vinv(hyp);
          return !veq(a1, b1) && kindOf(v) === 'radfrac';
        });
        const { p, q, f0 } = w, a1 = tv(p), b1 = tv(q), xi = vinv(a1), yi = vinv(b1), t = vdiv(a1, b1), hyp2 = vadd(vmul(xi, xi), vmul(yi, yi)), hyp = sqrtQ(hyp2[0].q);
        const x = f0 === 'sin' ? vdiv(yi, hyp) : vdiv(xi, hyp);
        return aRadFrac(`일차방정식 ${nb(`(${th(p)})${X} + (${th(q)})${V('y')} = 1`)}의 그래프가 ${X}축과 이루는 예각의 크기를 ${V('a')}°라 할 때, ${fx(f0, 'a')}의 값은?`, x, {
          explain: `${th(p)} = ${vh(a1)}, ${th(q)} = ${vh(b1)}이므로 그래프의 ${X}절편은 ${vh(xi)}, ${V('y')}절편은 ${vh(yi)}이다. 두 절편과 원점이 만드는 직각삼각형의 빗변은 ${vh(hyp)}이므로 ${fx(f0, 'a')} = ${frac(vh(f0 === 'sin' ? yi : xi), vh(hyp))} = ${vh(x)}이다.`,
          rule: 'line-special'
        });
      }, { count: 2 }),
      H('hard-double-perp', '수선 둘로 생긴 작은 삼각형의 각의 삼각비', '심7', (d) => {
        // 함정: y = ∠CDE 는 작은 삼각형 CDE 의 각이다. y 의 이웃한 변은 DE, 빗변은 CD 이다(큰 삼각형의 변으로 대지 않는다).
        const w = d.until(() => {
          const p = d.int(1, 9), q = d.int(1, 9), h = Math.sqrt(p * q);
          const f = fig({ A: [0, 0], C: [p + q, 0], E: [p, 0], D: [p, h] }, { polys: [['A', 'C', 'D']], segs: [['D', 'E']], right: [['D', 'A', 'C'], ['E', 'C', 'D']], side: [['A', 'E', String(p), 'D'], ['E', 'C', String(q), 'D']],
            ang: [['C', 'A', 'D', degx('x'), { r: 20 }], ['D', 'C', 'E', degx('y'), { r: 18 }]], size: [210, 110] });
          return { p, q, f };
        }, (z) => z.p !== z.q && z.q >= 2 && z.q / z.p >= 0.5 && z.q / z.p <= 2.5 && !isSq(z.p * (z.p + z.q)) && Math.sqrt(z.p * z.q) / (z.p + z.q) >= 0.3 && !z.f.b.clash());
        const { p, q } = w, de = sqrtN(p * q), cd = sqrtN(q * (p + q)), x = vdiv(de, cd);
        return aRadFrac(`그림과 같이 ∠ADC = 90°인 직각삼각형 ADC의 꼭짓점 D에서 ${seg('AC')}에 내린 수선의 발을 E라 하자. ${seg('AE')} = ${p}, ${seg('EC')} = ${q}이고 ∠DCA = ${X}°, ∠CDE = ${V('y')}°일 때, ${fx('cos', 'y')}의 값은?`, x, {
          figure: w.f.b.svg(`직각삼각형 ADC. ∠D에 직각 표시가 있고 D에서 변 AC에 내린 수선 DE가 있다. AE = ${p}, EC = ${q}. ∠DCA에 x°, ∠CDE에 y°가 적혀 있다`),
          sq: [`${p}*${q}`, `${q}*(${p}+${q})`],
          explain: `△ADE ∽ △DCE이므로 ${seg('DE')}${sup(2)} = ${seg('AE')} × ${seg('EC')} = ${p * q}, △CDE ∽ △CAD이므로 ${seg('CD')}${sup(2)} = ${seg('CE')} × ${seg('CA')} = ${q * (p + q)}이다. ${seg('DE')} = ${vh(de)}, ${seg('CD')} = ${vh(cd)}이고 △CDE에서 ∠CDE의 이웃한 변은 ${seg('DE')}이므로 ${fx('cos', 'y')} = ${frac(seg('DE'), seg('CD'))} = ${vh(x)}이다.`
        });
      }),
      H('hard-angle-sum', '삼각비의 값으로 두 각을 구해 각의 합·차의 삼각비 구하기', '심13 심14', (d, n) => {
        // 함정: cos(x + y) 를 cos x + cos y 로 셈한다. 두 각을 먼저 구해야 한다.
        const ANG = [0, 30, 45, 60, 90];
        if (n === 0) {
          // 이차방정식의 두 근이 sin A, sin B(A > B) → A − B 의 삼각비
          const w = d.until(() => ({ A: d.pick([30, 45, 60, 90]), Bv: d.pick([30, 45, 60]), f0: d.pick(FN3) }), (z) => z.A > z.Bv && [30, 45, 60].includes(z.A - z.Bv) && !(z.A === 90 && z.Bv === 45));
          const { A, Bv, f0 } = w, qd = quadOf(SV.sin[A], SV.sin[Bv]), right = SV[f0][A - Bv];
          return aPick(d, `${X}에 대한 이차방정식 ${quadText(qd.a, qd.b, qd.c)}의 두 근이 ${fn('sin', 'A')}, ${fn('sin', 'B')}일 때, ${nb(`${f0}(A − B)`)}의 값은? (단, 0° &lt; B &lt; A ≤ 90°)`, right, d.shuffle(SP0.filter((v) => !veq(v, right))), {
            sort: true, show: (v) => vh(v),
            explain: `두 근은 ${vh(SV.sin[A])}, ${vh(SV.sin[Bv])}이고 0°에서 90°까지는 각이 클수록 sin의 값이 크므로 ${fn('sin', 'A')} = ${vh(SV.sin[A])}, ${fn('sin', 'B')} = ${vh(SV.sin[Bv])}이다. A = ${A}°, B = ${Bv}°이므로 ${nb(`${f0}(A − B)`)} = ${fd(f0, A - Bv)} = ${vh(right)}이다.`,
            rule: 'sum-quad'
          });
        }
        // 두 값으로 각을 구해 합(차)의 삼각비
        const w = d.until(() => ({ x: d.pick(DEGS), y: d.pick(DEGS), fx0: d.pick(FN3), fy0: d.pick(FN3), op: d.pick(['+', '-']), f0: d.pick(FN3) }), (z) => {
          const g = z.op === '+' ? z.x + z.y : z.x - z.y; return ANG.includes(g) && g > 0 && !(z.f0 === 'tan' && g === 90) && z.x !== z.y;
        });
        const { x, y, fx0, fy0, op, f0 } = w, g = op === '+' ? x + y : x - y, right = SV[f0][g], arg = op === '+' ? `${X} + ${V('y')}` : `${X} − ${V('y')}`;
        const wrongish = op === '+' ? vadd(SV[f0][x], SV[f0][y]) : vsub(SV[f0][x], SV[f0][y]);
        return aPick(d, `${fx(fx0, 'x')} = ${vh(SV[fx0][x])}, ${fx(fy0, 'y')} = ${vh(SV[fy0][y])}일 때, ${nb(`${f0}(${arg})°`)}의 값은? (단, 0° &lt; ${X}° &lt; 90°, 0° &lt; ${V('y')}° &lt; 90°)`, right, [wrongish].concat(d.shuffle(SP0)).filter((v) => !veq(v, right)), {
          sort: true,
          explain: `${fd(fx0, x)} = ${vh(SV[fx0][x])}이므로 ${X} = ${x}, ${fd(fy0, y)} = ${vh(SV[fy0][y])}이므로 ${V('y')} = ${y}이다. ${nb(`${f0}(${arg})°`)} = ${fd(f0, g)} = ${vh(right)}이다.`,
          rule: 'sum-values'
        });
      }, { count: 2 }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-two-sines', '두 밑각의 사인 값과 한 변으로 밑변의 길이 구하기', '기본 ①17', (d) => {
        const SB = [[30, num(1, 2)], [45, rad(1, 2, 2)], [60, rad(1, 3, 2)]], SC = [num(1, 2), rad(1, 2, 2), rad(1, 3, 2), rad(1, 3, 3), num(1, 3), num(2, 3), num(1, 4), num(3, 4), rad(1, 5, 5), rad(2, 5, 5)];
        const w = d.until(() => { const [bd, sb] = d.pick(SB), sc = d.pick(SC), c = d.int(2, 12); return { bd, sb, sc, c }; }, (z) => {
          const ah = vmul(num(z.c), z.sb), ac = vdiv(ah, z.sc); if (vfl(ac) <= vfl(ah) + 1e-9) return false;
          const bh = sqrtQ(vsub(num(z.c * z.c), vmul(ah, ah))[0].q), ch = sqrtQ(vsub(vmul(ac, ac), vmul(ah, ah))[0].q), bc = vadd(bh, ch);
          if (vfl(ah) / vfl(bc) < 0.3) return false;
          return kindOf(bc) === 'sum' && bc[0].q.p > 0 && bc[1].q.p > 0 && bc[0].q.p <= 40 && bc[1].q.p <= 40 && !veq(z.sc, z.sb) && kindOf(ac) !== 'other';
        });
        const { bd, sb, sc, c } = w, ah = vmul(num(c), sb), ac = vdiv(ah, sc), bh = sqrtQ(vsub(num(c * c), vmul(ah, ah))[0].q), ch = sqrtQ(vsub(vmul(ac, ac), vmul(ah, ah))[0].q), bc = vadd(bh, ch);
        const Hx = vfl(bh), Ah = vfl(ah);
        const f = fig({ A: [Hx, Ah], B: [0, 0], C: [Hx + vfl(ch), 0], H: [Hx, 0] }, { polys: [['A', 'B', 'C']], segs: [['A', 'H']], right: [['H', 'C', 'A']], side: [['A', 'B', c + ' cm']], size: [210, 110] });
        return aSum(`그림과 같이 △ABC의 꼭짓점 A에서 ${seg('BC')}에 내린 수선의 발을 H라 하자. ${seg('AB')} = ${c} cm, ${fn('sin', 'B')} = ${vh(sb)}, ${fn('sin', 'C')} = ${vh(sc)}일 때, ${seg('BC')}의 길이는?`, bc, {
          unit: 'cm', figure: f.b.svg(`삼각형 ABC와 A에서 변 BC에 내린 수선 AH. ∠AHC에 직각 표시가 있다. AB = ${c} cm`),
          explain: `△ABH에서 ${seg('AH')} = ${c} × ${vh(sb)} = ${vh(ah)}(cm), ${seg('BH')} = ${rt(`${c}${sup(2)} − (${vh(ah)})${sup(2)}`)} = ${vh(bh)}(cm)이다. △AHC에서 ${fn('sin', 'C')} = ${frac(seg('AH'), seg('AC'))}이므로 ${seg('AC')} = ${vh(ah)} ÷ ${vh(sc)} = ${vh(ac)}(cm), ${seg('CH')} = ${rt(`(${vh(ac)})${sup(2)} − (${vh(ah)})${sup(2)}`)} = ${vh(ch)}(cm)이다. ${seg('BC')} = ${vh(bh)} + ${vh(ch)} = ${vh(bc)}(cm)이다.`
        });
      }),
      H('hard-tan-split', '중선이 나눈 각의 탄젠트를 보조선으로 구하기', '기본 ①21', (d) => {
        // ∠B = 90°, AB = a, BD = DC = d, x = ∠CAD. C 에서 AD 의 연장선에 내린 수선의 발 E: △ABD ∽ △CED
        const w = d.until(() => { const a = d.int(1, 6), dd = d.int(1, 5); const f = fig({ A: [0, a], B: [0, 0], D: [dd, 0], C: [2 * dd, 0] }, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], right: [['B', 'A', 'C']], ticks: [['B', 'D', 1], ['D', 'C', 1]],
          side: [['A', 'B', String(a)], ['B', 'D', String(dd)]], ang: [['A', 'D', 'C', degx('x'), { r: 26 }]], size: [200, 120] }); return { a, dd, f }; },
          (z) => (2 * z.dd) / z.a >= 0.8 && (2 * z.dd) / z.a <= 2.6 && !z.f.b.clash());
        const { a, dd } = w, val = num(dd * a, a * a + 2 * dd * dd), ad = sqrtN(a * a + dd * dd), ce = vdiv(num(dd * a), ad), de = vdiv(num(dd * dd), ad), ae = vadd(ad, de);
        return aFrac(`그림과 같이 ∠B = 90°인 직각삼각형 ABC에서 점 D는 ${seg('BC')}의 중점이다. ${seg('AB')} = ${a}, ${seg('BD')} = ${dd}이고 ∠CAD = ${X}°일 때, ${fx('tan', 'x')}의 값은?`, val, {
          figure: w.f.b.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있고 변 BC의 중점 D와 A를 이은 선분이 있다. 선분 BD와 DC에 길이가 같다는 표시가 있다. AB = ${a}, BD = ${dd}. ∠CAD에 x°가 적혀 있다`),
          sq: [`(${dd}*${a})**2`, `(${a}**2+2*${dd}**2)**2`],
          explain: `${seg('AD')} = ${rt(`${a}${sup(2)} + ${dd}${sup(2)}`)} = ${vh(ad)}이다. 꼭짓점 C에서 ${seg('AD')}의 연장선에 내린 수선의 발을 E라 하면 △ABD ∽ △CED(맞꼭지각과 직각)이므로 ${seg('CE')} : ${seg('DE')} : ${seg('CD')} = ${a} : ${dd} : ${vh(ad)}이고 ${seg('CD')} = ${dd}에서 ${seg('CE')} = ${vh(ce)}, ${seg('DE')} = ${vh(de)}이다. ${seg('AE')} = ${vh(ad)} + ${vh(de)} = ${vh(ae)}이므로 ${fx('tan', 'x')} = ${frac(seg('CE'), seg('AE'))} = ${vh(val)}이다.`
        });
      }),
      H('hard-iso-apex', '이등변삼각형의 꼭지각의 사인을 넓이로 구하기', '기본 ①21', (d) => {
        const w = d.until(() => { const s = d.int(2, 9), hh = d.int(1, 6); const f = fig({ A: [hh, Math.sqrt(Math.max(0.01, s * s - hh * hh))], B: [0, 0], C: [2 * hh, 0] }, { polys: [['A', 'B', 'C']], ticks: [['A', 'B', 1], ['A', 'C', 1]], side: [['A', 'B', s + ' cm'], ['B', 'C', 2 * hh + ' cm']], ang: [['A', 'B', 'C', '', { r: 16 }]], size: [170, 120] }); return { s, hh, f }; },
          (z) => z.hh < z.s && 2 * z.hh !== z.s && !isSq(z.s * z.s - z.hh * z.hh) && Math.sqrt(z.s * z.s - z.hh * z.hh) / (2 * z.hh) >= 0.45 && Math.sqrt(z.s * z.s - z.hh * z.hh) / (2 * z.hh) <= 2.4 && !z.f.b.clash());
        const { s, hh } = w, am = sqrtN(s * s - hh * hh), area = vmul(num(hh), am), bh = vdiv(vmul(num(2), area), num(s)), x = vdiv(bh, num(s));
        return aRadFrac(`그림과 같이 ${seg('AB')} = ${seg('AC')} = ${s} cm, ${seg('BC')} = ${2 * hh} cm인 이등변삼각형 ABC에서 ${fn('sin', 'A')}의 값은?`, x, {
          figure: w.f.b.svg(`이등변삼각형 ABC. 변 AB와 변 AC에 길이가 같다는 표시가 있다. AB = ${s} cm, BC = ${2 * hh} cm. ∠A에 각 표시가 있다`),
          sq: [`(${2 * hh})**2*(${s}**2-(${2 * hh}/2)**2)`, `${s}**4`],
          explain: `A에서 ${seg('BC')}에 내린 수선의 발을 M이라 하면 ${seg('BM')} = ${hh} cm, ${seg('AM')} = ${rt(`${s}${sup(2)} − ${hh}${sup(2)}`)} = ${vh(am)}(cm)이고 △ABC의 넓이는 ${frac(1, 2)} × ${2 * hh} × ${vh(am)} = ${vh(area)}(cm²)이다. B에서 ${seg('AC')}에 내린 수선의 발을 H라 하면 ${frac(1, 2)} × ${s} × ${seg('BH')} = ${vh(area)}에서 ${seg('BH')} = ${vh(bh)}(cm)이다. ${fn('sin', 'A')} = ${frac(seg('BH'), seg('AB'))} = ${vh(x)}이다.`
        });
      }),
      H('hard-incenter', '내심이 만든 각으로 직각삼각형의 각을 구해 식의 값 구하기', '기본 ①29', (d) => {
        const A0 = d.pick([30, 60]), Bd = 90 - A0, form = d.int(0, 2), atB = d.bool();
        // ∠BIC = 90° + A/2, ∠AIC = 90° + B/2
        const shownAngle = atB ? 90 + A0 / 2 : 90 + Bd / 2, angName = atB ? 'BIC' : 'AIC';
        const FORMS = [
          [`${fn('sin', 'A')} − ${fn('cos', 'A')} × ${fn('tan', 'B')}`, (a, b) => vsub(SV.sin[a], vmul(SV.cos[a], SV.tan[b]))],
          [`${fn('cos', 'B')} + ${fn('sin', 'B')} × ${fn('tan', 'A')}`, (a, b) => vadd(SV.cos[b], vmul(SV.sin[b], SV.tan[a]))],
          [`${fn('tan', 'A')} × ${fn('sin', 'B')} + ${fn('cos', 'A')}`, (a, b) => vadd(vmul(SV.tan[a], SV.sin[b]), SV.cos[a])]
        ];
        const [h, val] = FORMS[form], right = val(A0, Bd), wrongs = [val(Bd, A0), val(45, 45), vneg(right), vadd(right, num(1)), vmul(right, num(2))];
        const a = Math.tan(A0 * Math.PI / 180) * 1, legBC = a, legAC = 1, hyp = Math.hypot(a, 1), r = (legBC + legAC - hyp) / 2;
        const Bp = [0, 0], Cp = [legBC, 0], A = [legBC, legAC], I = [legBC - r, r];
        const P = fig({ A, B: Bp, C: Cp, I }, { polys: [['A', 'B', 'C']], segs: atB ? [['I', 'B'], ['I', 'C']] : [['I', 'A'], ['I', 'C']], right: [['C', 'B', 'A']], ang: [['I', atB ? 'B' : 'A', 'C', dg(shownAngle), { r: 9, d: 17 }]], dots: ['I'], size: [190, 140], nameAt: { I: atB ? 100 : 250 } });
        const k = P.P.k; P.b.disk([I[0] * k, -I[1] * k], r * k, 'fill:none;stroke:#5b6770;stroke-width:1.1');
        return aPick(d, `그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 점 I는 내심이고 ∠${angName} = ${shownAngle}°일 때, ${nb(h)}의 값은?`, right, wrongs, {
          figure: P.b.svg(`직각삼각형 ABC와 내접원. ∠C에 직각 표시가 있고 내심 I와 두 꼭짓점을 이은 선분이 있다. ∠${angName} = ${shownAngle}°`),
          explain: `내심은 세 내각의 이등분선의 교점이므로 ∠ICA = ∠ICB = 45°이다. △${atB ? 'IBC' : 'IAC'}에서 ∠I${atB ? 'B' : 'A'}C = 180° − ${shownAngle}° − 45° = ${180 - shownAngle - 45}°이므로 ∠${atB ? 'B' : 'A'} = ${2 * (180 - shownAngle - 45)}°이다. 따라서 ∠A = ${A0}°, ∠B = ${Bd}°이고 값을 넣으면 ${vh(right)}이다.`
        });
      }),
      H('hard-sector', '부채꼴에서 직각삼각형을 뺀 넓이', '기본 ①34', (d) => {
        const th0 = d.pick([30, 60]), r = 12 * d.int(1, 2), arcLen = r * th0 / 180, piC = r * r * th0 / 360, triC = r * r / 8;   // △AOH = ½ r cos θ · r sin θ = r²√3/8
        const R = 150, t = th0 * Math.PI / 180, O = [0, 0], Bp = [R, 0], A = [R * Math.cos(t), -R * Math.sin(t)], Hh = [A[0], 0];
        const b = Board();
        b.fan(O, R, 0, th0, TINT).poly([O, A, Hh], WHITE).seg(O, A).seg(O, Bp).seg(A, Hh).corner(Hh, Bp, A, '').corner(O, Bp, A, dg(th0), { r: 22 });
        b.arcDim(O, R, 0, th0, arcLen + 'π cm', 10).name(O, 'O', 200, 10).name(A, 'A', 100, 11).name(Bp, 'B', 300, 10).name(Hh, 'H', 270, 11);
        const tri = vmul(num(triC), sqrtN(3));
        return seal(inline(`그림과 같이 중심각의 크기가 ${th0}°이고 호 AB의 길이가 ${arcLen}π cm인 부채꼴 AOB에서 점 A에서 ${seg('OB')}에 내린 수선의 발을 H라 할 때, 색칠한 부분의 넓이는?`,
          grp('{0}π') + ' ' + MINUS + ' ' + grp('{1}' + rt('{2}') + ' cm²'), [{ answer: piC }, { answer: triC }, { answer: 3 }], Object.assign(more({
            figure: b.svg(`중심이 O인 부채꼴 AOB. 중심각 ∠AOB = ${th0}°, 호 AB의 길이 ${arcLen}π cm. A에서 OB에 내린 수선의 발이 H이고, 부채꼴에서 삼각형 AOH를 뺀 부분이 색칠되어 있다`),
            explain: `반지름을 ${V('r')}라 하면 2π${V('r')} × ${frac(th0, 360)} = ${arcLen}π에서 ${V('r')} = ${r} cm이다. 부채꼴의 넓이는 π × ${r}${sup(2)} × ${frac(th0, 360)} = ${piC}π(cm²)이다. △AOH에서 ${seg('OH')} = ${r} × ${fd('cos', th0)} = ${vh(vmul(num(r), SV.cos[th0]))}(cm), ${seg('AH')} = ${r} × ${fd('sin', th0)} = ${vh(vmul(num(r), SV.sin[th0]))}(cm)이므로 넓이는 ${vh(tri)} cm²이다. 색칠한 부분의 넓이는 (${piC}π − ${vh(tri)}) cm²이다.`
          }, { calc: [[`${r}**2*${th0}/360`, 0], [`${r}**2/8`, 1], ['3', 2]] }), { shown: `${piC}π − ${vh(tri)} cm²` })));
      }),
      H('hard-inradius', '특수각인 직각삼각형의 내접원의 반지름', '기본 ①35', (d) => {
        const beta = d.pick([30, 45]), k = 2 * d.int(1, 4);
        // ∠B = 30°: AB = 2k, AC = k, BC = k√3 / ∠B = 45°: AC = BC = k, AB = k√2. r = (AC + BC − AB) ÷ 2
        const ac = num(k), bc = beta === 30 ? vmul(num(k), sqrtN(3)) : num(k), ab = beta === 30 ? num(2 * k) : vmul(num(k), sqrtN(2)), r = vmul(vsub(vadd(ac, bc), ab), num(1, 2));
        const BC = vfl(bc), AC = k, rr = vfl(r), I = [BC - rr, rr];
        const P = fig({ A: [BC, AC], B: [0, 0], C: [BC, 0], I }, { polys: [['A', 'B', 'C']], right: [['C', 'B', 'A']], dots: ['I'], side: beta === 30 ? [['A', 'B', 2 * k + ' cm', 'C']] : [['A', 'C', k + ' cm', 'B'], ['B', 'C', k + ' cm', 'A']], ang: [['B', 'C', 'A', dg(beta), { r: 22 }]], size: [200, 130], nameAt: { I: 150 } });
        const kk = P.P.k; P.b.disk([I[0] * kk, -I[1] * kk], rr * kk, 'fill:none;stroke:#5b6770;stroke-width:1.1');
        const given = beta === 30 ? `${seg('AB')} = ${2 * k} cm` : `${seg('AC')} = ${seg('BC')} = ${k} cm`;
        return aSum(`그림과 같이 ∠C = 90°, ∠B = ${beta}°인 직각삼각형 ABC에서 ${given}일 때, 내접원의 반지름의 길이는?`, r, {
          unit: 'cm', figure: P.b.svg(`직각삼각형 ABC와 그 내접원(중심 I). ∠C에 직각 표시가 있고 ∠B = ${beta}°이다. ${beta === 30 ? `AB = ${2 * k} cm` : `AC = ${k} cm, BC = ${k} cm`}`),
          explain: `${beta === 30 ? `${seg('AC')} = ${2 * k} × ${fd('sin', 30)} = ${k}(cm), ${seg('BC')} = ${2 * k} × ${fd('cos', 30)} = ${vh(bc)}(cm)` : `${seg('AB')} = ${k} ÷ ${fd('sin', 45)} = ${vh(ab)}(cm)`}이다. 반지름을 ${V('r')}라 하면 △ABC의 넓이는 ${frac(1, 2)} × ${V('r')} × (${seg('AB')} + ${seg('BC')} + ${seg('CA')})이므로 ${frac(1, 2)} × ${vh(bc)} × ${k} = ${frac(1, 2)} × ${V('r')} × (${vh(vadd(vadd(ab, bc), ac))})에서 ${V('r')} = ${vh(r)}(cm)이다.`
        });
      }),
      H('hard-15-75', '특수각 그림으로 15°·75°의 탄젠트 구하기', '기본 ①36 심15', (d, n) => {
        const k = d.int(1, 4);
        if (n === 0) {
          // ∠C = 90°, AC = k, ∠ADC = 30°, AD = BD → ∠B = 15°
          const s3 = Math.sqrt(3), f = fig({ A: [2 * k + k * s3, k], B: [0, 0], C: [2 * k + k * s3, 0], D: [2 * k, 0] }, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], right: [['C', 'B', 'A']], ticks: [['A', 'D', 1], ['B', 'D', 1]],
            side: [['A', 'C', k + ' cm', 'B']], ang: [['D', 'C', 'A', dg(30), { r: 16 }]], size: [230, 80] });
          const v = vsub(num(2), sqrtN(3));
          return aSum(`그림과 같이 ∠C = 90°인 직각삼각형 ABC의 ${seg('BC')} 위에 ${seg('AD')} = ${seg('BD')}인 점 D가 있다. ∠ADC = 30°, ${seg('AC')} = ${k} cm일 때, 이 그림을 이용하여 구한 ${fd('tan', 15)}의 값은?`, v, {
            figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 변 BC 위의 점 D와 A를 이은 선분이 있다. 선분 AD와 BD에 길이가 같다는 표시가 있다. ∠ADC = 30°, AC = ${k} cm`),
            explain: `△ADC에서 ${seg('AD')} = ${k} ÷ ${fd('sin', 30)} = ${2 * k}(cm), ${seg('DC')} = ${k} ÷ ${fd('tan', 30)} = ${vh(vmul(num(k), sqrtN(3)))}(cm)이다. ${seg('BD')} = ${seg('AD')} = ${2 * k} cm이고, △ABD가 이등변삼각형이므로 ∠B = ∠BAD = 30° ÷ 2 = 15°이다. ${fd('tan', 15)} = ${frac(seg('AC'), seg('BC'))} = ${frac(k, vh(vadd(num(2 * k), vmul(num(k), sqrtN(3)))))} = ${vh(v)}이다.`,
            rule: 'tan15'
          });
        }
        // ∠B = 90°, AB = k, ∠BAC = 60°, BC 의 연장선 위에 AC = CD 인 점 D → ∠DAB = 75°
        const s3 = Math.sqrt(3), f = fig({ A: [0, k], B: [0, 0], C: [k * s3, 0], D: [k * s3 + 2 * k, 0] }, { polys: [['A', 'B', 'D']], segs: [['A', 'C']], right: [['B', 'A', 'D']], ticks: [['A', 'C', 1], ['C', 'D', 1]],
          side: [['A', 'B', k + ' cm']], ang: [['A', 'B', 'C', dg(60), { r: 16 }]], size: [230, 80] });
        const v = vadd(num(2), sqrtN(3));
        return aSum(`그림과 같이 ∠B = 90°, ∠BAC = 60°인 직각삼각형 ABC에서 ${seg('BC')}의 연장선 위에 ${seg('AC')} = ${seg('CD')}인 점 D를 잡았다. ${seg('AB')} = ${k} cm일 때, 이 그림을 이용하여 구한 ${fd('tan', 75)}의 값은?`, v, {
          figure: f.b.svg(`직각삼각형 ABC와 BC의 연장선 위의 점 D. ∠B에 직각 표시가 있고 ∠BAC = 60°이다. 선분 AC와 CD에 길이가 같다는 표시가 있다. AB = ${k} cm`),
          explain: `${seg('AC')} = ${k} ÷ ${fd('cos', 60)} = ${2 * k}(cm), ${seg('BC')} = ${k} × ${fd('tan', 60)} = ${vh(vmul(num(k), sqrtN(3)))}(cm)이다. ∠ACB = 30°이고 △ACD는 이등변삼각형이므로 ∠CAD = 30° ÷ 2 = 15°, ∠DAB = 60° + 15° = 75°이다. ${fd('tan', 75)} = ${frac(seg('BD'), seg('AB'))} = ${frac(vh(vadd(num(2 * k), vmul(num(k), sqrtN(3)))), k)} = ${vh(v)}이다.`,
          rule: 'tan75'
        });
      }, { count: 2 }),
      H('hard-rect-perp', '직사각형의 대각선에 내린 수선으로 삼각비 구하기', '심6', (d) => {
        const w = d.until(() => { const p = d.int(1, 9), q = d.int(1, 9), f0 = d.pick(['sin', 'cos']); const L = p + q, ab = Math.sqrt(q * L), bc = Math.sqrt(p * L);
          const E = [bc * p / L, ab * q / L]; // D 에서 AC 에 내린 수선의 발(AE = p)
          const f = fig({ A: [0, ab], B: [0, 0], C: [bc, 0], D: [bc, ab], E }, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['D', 'E']], right: [['E', 'C', 'D']], side: [['A', 'E', String(p), ab > bc ? 'B' : 'D'], ['E', 'C', String(q), ab > bc ? 'D' : 'B']], ang: [['C', 'B', 'A', degx('x'), { r: 22 }]], size: [200, 130] });
          return { p, q, f0, f, ab, bc }; },
          (z) => z.p !== z.q && z.p / z.q >= 0.38 && z.p / z.q <= 2.6 && !isSq(z.q * (z.p + z.q)) && !isSq(z.p * (z.p + z.q)) && fair(z.ab, z.bc) && !z.f.b.clash());
        const { p, q, f0 } = w, L = p + q, dc = sqrtN(q * L), ad = sqrtN(p * L), x = vdiv(f0 === 'sin' ? dc : ad, num(L));
        return aRadFrac(`그림과 같이 직사각형 ABCD의 꼭짓점 D에서 대각선 AC에 내린 수선의 발을 E라 하자. ${seg('AE')} = ${p}, ${seg('EC')} = ${q}이고 ∠ACB = ${X}°일 때, ${fx(f0, 'x')}의 값은?`, x, {
          figure: w.f.b.svg(`직사각형 ABCD와 대각선 AC. D에서 AC에 내린 수선 DE가 있고 직각 표시가 있다. AE = ${p}, EC = ${q}. ∠ACB에 x°가 적혀 있다`),
          sq: [`${f0 === 'sin' ? q : p}*(${p}+${q})`, `(${p}+${q})**2`],
          explain: `△DCA는 ∠ADC = 90°인 직각삼각형이고 △DCA ∽ △ECD이므로 ${seg('DC')}${sup(2)} = ${seg('CE')} × ${seg('CA')} = ${q} × ${L} = ${q * L}, 같은 방법으로 ${seg('AD')}${sup(2)} = ${seg('AE')} × ${seg('AC')} = ${p * L}이다. ${seg('AB')} = ${seg('DC')} = ${vh(dc)}, ${seg('BC')} = ${seg('AD')} = ${vh(ad)}이므로 ${fx(f0, 'x')} = ${f0 === 'sin' ? frac(seg('AB'), seg('AC')) : frac(seg('BC'), seg('AC'))} = ${vh(x)}이다.`
        });
      }),
      H('hard-tetra', '정사면체에서 높이와 모서리·옆면이 이루는 각의 삼각비', '심10', (d, n) => {
        const s = d.int(2, 9), f0 = n === 0 ? d.pick(['sin', 'cos']) : 'sin';
        // 3차원 좌표 → 비스듬한 그림
        // 비스듬히 위에서 본 그림: B 가 앞 왼쪽, C 가 오른쪽, D 가 왼쪽 뒤. 보이지 않는 모서리 CD 와 안쪽 선분은 점선.
        const s3 = Math.sqrt(3), Bq = [0, 0, 0], Cq = [1, 0, 0], Dq = [0.5, s3 / 2, 0], Hq = [0.5, s3 / 6, 0], Aq = [0.5, s3 / 6, Math.sqrt(2 / 3)], Eq = [0.5, 0, 0];
        const cp = Math.cos(40 * Math.PI / 180), sp = Math.sin(40 * Math.PI / 180), ce = Math.cos(18 * Math.PI / 180), se = Math.sin(18 * Math.PI / 180);
        const pr = ([x, y, z]) => [(x * cp - y * sp) * 190, -(z * ce + (x * sp + y * cp) * se) * 190], P = { A: pr(Aq), B: pr(Bq), C: pr(Cq), D: pr(Dq), H: pr(Hq), E: pr(Eq) };
        const b = Board();
        const tri = n === 0 ? [P.A, P.D, P.H] : [P.A, P.E, P.D];
        b.shape(`M${tri.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L')}Z`, tri, TINT + ';stroke:none');
        b.seg(P.A, P.B).seg(P.A, P.C).seg(P.A, P.D).seg(P.B, P.C).seg(P.B, P.D).seg(P.C, P.D, 'cut').seg(P.A, P.H, 'cut').seg(P.D, P.H, 'cut');
        if (n === 1) b.seg(P.A, P.E, 'cut').seg(P.E, P.D, 'cut').tick(P.B, P.E).tick(P.E, P.C);
        rightMark(b, P.H, P.A, n === 0 ? P.D : P.E, 6);
        if (n === 0) b.corner(P.D, P.A, P.H, degx('x'), { r: 20 }); else b.corner(P.E, P.A, P.D, degx('x'), { r: 14 });
        b.dot(P.H).name(P.A, 'A', 90).name(P.B, 'B', 250).name(P.C, 'C', 0).name(P.D, 'D', 180).name(P.H, 'H', n === 0 ? 300 : 220, 10);
        if (n === 1) b.name(P.E, 'E', 300, 10);
        b.beside(P.B, P.D, String(s), P.A);
        const height = vmul(num(s), rad(1, 6, 3)), dh = vmul(num(s), rad(1, 3, 3)), em = vmul(num(s), rad(1, 3, 2)), eh = vmul(num(s), rad(1, 3, 6));
        if (n === 0) {
          const x = f0 === 'sin' ? vdiv(height, num(s)) : vdiv(dh, num(s));
          return aRadFrac(`그림과 같이 한 모서리의 길이가 ${s}인 정사면체 A-BCD의 꼭짓점 A에서 밑면에 내린 수선의 발 H는 △BCD의 무게중심이다. ∠ADH = ${X}°일 때, ${fx(f0, 'x')}의 값은?`, x, {
            figure: b.svg(`정사면체 A-BCD. 꼭짓점 A에서 밑면에 내린 수선 AH가 있고 H는 밑면 BCD의 무게중심이다. 삼각형 ADH가 색칠되어 있고 ∠ADH에 x°가 적혀 있다. 모서리의 길이는 ${s}`),
            explain: `정삼각형 BCD의 높이는 ${s} × ${fd('sin', 60)} = ${vh(em)}이고 무게중심 H는 높이를 꼭짓점에서 ${nb('2 : 1')}로 나누므로 ${seg('DH')} = ${vh(dh)}이다. △AHD에서 ${seg('AH')} = ${rt(`${s}${sup(2)} − (${vh(dh)})${sup(2)}`)} = ${vh(height)}이므로 ${fx(f0, 'x')} = ${f0 === 'sin' ? frac(seg('AH'), seg('AD')) : frac(seg('DH'), seg('AD'))} = ${vh(x)}이다.`,
            rule: 'tetra-edge'
          });
        }
        const x = vdiv(height, em);
        return aRadFrac(`그림과 같이 한 모서리의 길이가 ${s}인 정사면체 A-BCD에서 ${seg('BC')}의 중점을 E, 꼭짓점 A에서 밑면에 내린 수선의 발을 H라 하자. ∠AED = ${X}°일 때, ${fx('sin', 'x')}의 값은?`, x, {
          figure: b.svg(`정사면체 A-BCD. 변 BC의 중점 E와 A, D를 이은 선분이 있고, A에서 밑면에 내린 수선 AH가 있다. 삼각형 AED가 색칠되어 있고 ∠AED에 x°가 적혀 있다. 모서리의 길이는 ${s}`),
          explain: `${seg('AE')} = ${seg('ED')} = ${s} × ${fd('sin', 60)} = ${vh(em)}이다. H는 △BCD의 무게중심이므로 ${seg('EH')} = ${frac(1, 3)}${seg('ED')} = ${vh(eh)}이고 ${seg('AH')} = ${rt(`(${vh(em)})${sup(2)} − (${vh(eh)})${sup(2)}`)} = ${vh(height)}이다. ${fx('sin', 'x')} = ${frac(seg('AH'), seg('AE'))} = ${vh(x)}이다.`,
          rule: 'tetra-face'
        });
      }, { count: 2 }),
      H('hard-quad-angle', '이차방정식의 근이 삼각비일 때 각의 크기 구하기', '기본 ①27', (d, n) => {
        if (n === 0) {
          // 두 근이 tan A, cos A(또는 sin A, tan A)
          const A0 = d.pick(DEGS), pair = d.pick([['tan', 'cos'], ['sin', 'tan']]), r1v = SV[pair[0]][A0], r2v = SV[pair[1]][A0], qd = quadOf(r1v, r2v);
          const rel = vfl(r1v) > vfl(r2v) ? '&gt;' : '&lt;';
          return aInt(`${X}에 대한 이차방정식 ${quadText(qd.a, qd.b, qd.c)}의 두 근이 ${fn(pair[0], 'A')}, ${fn(pair[1], 'A')}일 때, ∠A의 크기는 몇 도인가? (단, 0° &lt; A &lt; 90°, ${fn(pair[0], 'A')} ${rel} ${fn(pair[1], 'A')})`, num(A0), {
            unit: '°', value: String(A0),
            explain: `이차방정식을 풀면 두 근은 ${vh(r1v)}, ${vh(r2v)}이다. ${fn(pair[0], 'A')} ${rel} ${fn(pair[1], 'A')}이므로 ${fn(pair[0], 'A')} = ${vh(r1v)}, ${fn(pair[1], 'A')} = ${vh(r2v)}이고 이를 모두 만족하는 각은 ${A0}°이다.`,
            rule: 'quad-two'
          });
        }
        // 중근이 삼각비의 값: 0°·90°까지 본다
        const [rv, eq] = d.pick([[num(1), `${X}${sup(2)} − 2${X} + 1 = 0`], [num(1, 2), `4${X}${sup(2)} − 4${X} + 1 = 0`]]), f0 = veq(rv, num(1)) ? d.pick(FN3) : d.pick(['sin', 'cos']);
        const A0 = [0, 30, 45, 60, 90].find((g) => SV[f0][g] && veq(SV[f0][g], rv));
        return aInt(`${X}에 대한 이차방정식 ${nb(eq)}의 근이 ${fn(f0, 'A')}일 때, ∠A의 크기는 몇 도인가? (단, 0° ≤ A ≤ 90°)`, num(A0), {
          unit: '°', value: String(A0),
          explain: `${nb(eq)}에서 (${veq(rv, num(1)) ? `${X} − 1` : `2${X} − 1`})${sup(2)} = 0이므로 ${X} = ${vh(rv)}이다. ${fn(f0, 'A')} = ${vh(rv)}이고 0° ≤ A ≤ 90°이므로 A = ${A0}°이다.`,
          rule: 'quad-double'
        });
      }, { count: 2 }),
      H('hard-quad-abs', '이차방정식의 두 근이 sin A, cos A 일 때 근호가 든 식의 값', '심20', (d) => {
        const A0 = d.pick([30, 60]), s = SV.sin[A0], c = SV.cos[A0], qd = quadOf(s, c), rel = A0 === 30 ? '&lt;' : '&gt;';
        const k1 = d.pick([rad(1, 3, 2), num(1, 2), rad(1, 2, 2)]), k2 = d.pick([rad(1, 3, 2), num(1, 2), rad(1, 2, 2)]);
        const e1 = vadd(k1, s), e2 = vsub(k2, c), right = vsub(e1, vfl(e2) >= 0 ? e2 : vneg(e2)), wrong1 = vsub(e1, e2), wrong2 = vsub(vadd(k1, c), vfl(vsub(k2, s)) >= 0 ? vsub(k2, s) : vsub(s, k2));
        const sq = (h) => rt(`(${h})${sup(2)}`);
        const shown = `${sq(`${vh(k1)} + ${fn('sin', 'A')}`)} − ${sq(`${vh(k2)} − ${fn('cos', 'A')}`)}`;
        return aPick(d, `${X}에 대한 이차방정식 ${quadText(qd.a, qd.b, qd.c)}의 두 근이 ${fn('sin', 'A')}, ${fn('cos', 'A')}일 때, 다음 식의 값은? (단, 0° &lt; A &lt; 90°, ${fn('sin', 'A')} ${rel} ${fn('cos', 'A')})`, right, [wrong1, wrong2, vneg(right), vadd(right, num(1)), vsub(right, num(1))], {
          figure: exh(shown),
          explain: `두 근은 ${vh(s)}, ${vh(c)}이고 ${fn('sin', 'A')} ${rel} ${fn('cos', 'A')}이므로 ${fn('sin', 'A')} = ${vh(s)}, ${fn('cos', 'A')} = ${vh(c)}이다. ${vh(k1)} + ${fn('sin', 'A')} = ${vh(e1)} &gt; 0, ${vh(k2)} − ${fn('cos', 'A')} = ${vh(e2)}${vfl(e2) >= 0 ? ' ≥ 0' : ' &lt; 0'}이므로 식의 값은 ${vh(right)}이다.`
        });
      }),
      H('hard-abs-solve', '근호를 벗겨 방정식을 풀어 탄젠트를 구한 뒤 다른 삼각비 구하기', '심21', (d) => {
        const w = d.until(() => ({ p: d.int(2, 9), q: d.int(1, 6), k: d.pick([2, 3]), f0: d.pick(['sin', 'cos']) }), (z) => z.p > z.q && gcd(z.p, z.q) === 1 && !isSq(z.p * z.p + z.q * z.q) && ((z.k + 1) * z.p) % z.q === 0);
        const { p, q, k, f0 } = w, S = (k + 1) * p / q, tX = fx('tan', 'x'), hyp = sqrtN(p * p + q * q), x = vdiv(num(f0 === 'sin' ? p : q), hyp);
        return aRadFrac(`45° &lt; ${X}° &lt; 90°이고 ${nb(`${rt(`(1 + ${tX})${sup(2)}`)} + ${rt(`(1 − ${k}${tX})${sup(2)}`)} = ${S}`)}일 때, ${fx(f0, 'x')}의 값은?`, x, {
          sq: [`${f0 === 'sin' ? p : q}**2`, `${p}**2+${q}**2`],
          explain: `45° &lt; ${X}° &lt; 90°이면 ${tX} &gt; 1이므로 1 + ${tX} &gt; 0, 1 − ${k}${tX} &lt; 0이다. (1 + ${tX}) − (1 − ${k}${tX}) = ${S}에서 ${k + 1}${tX} = ${S}, ${tX} = ${frac(p, q)}이다. 높이 ${p}, 밑변 ${q}인 직각삼각형의 빗변은 ${vh(hyp)}이므로 ${fx(f0, 'x')} = ${vh(x)}이다.`
        });
      }),
      H('hard-quarter-area', '사분원에서 두 직각삼각형의 넓이의 차', '심18', (d) => {
        const th0 = d.pick([30, 60]), r = d.pick([1, 2]), R = 140, t = th0 * Math.PI / 180, O = [0, 0], A = [R, 0], E = [0, -R], P = [R * Math.cos(t), -R * Math.sin(t)], Hh = [P[0], 0], Tp = [R, -R * Math.tan(t)];
        const b = Board();
        b.poly([Hh, P, Tp, A], TINT).arc(O, R, 0, 90).seg(O, A).seg(O, E).seg(O, Tp).seg(P, Hh).seg(A, Tp).corner(Hh, O, P, '').corner(A, O, Tp, '').corner(O, A, P, dg(th0), { r: 20 });
        b.name(O, 'O', 225, 10).name(A, 'A', 315, 10).name(P, 'B', th0 + 45, 11).name(Hh, 'C', 270, 11).name(Tp, 'D', 20, 10).beside(O, E, r + ' cm', A);
        const big = vmul(num(r * r, 2), SV.tan[th0]), small = vmul(num(r * r, 2), vmul(SV.cos[th0], SV.sin[th0])), area = vsub(big, small);
        return aRadFrac(`그림과 같이 반지름의 길이가 ${r} cm인 사분원에서 ∠BOA = ${th0}°, ${seg('BC')} ⊥ ${seg('OA')}, ${seg('DA')} ⊥ ${seg('OA')}일 때, 색칠한 부분의 넓이는?`, area, {
          unit: 'cm²', figure: b.svg(`중심이 O이고 반지름의 길이가 ${r} cm인 사분원. 호 위의 점 B에서 OA에 내린 수선의 발이 C, A에서 그은 접선과 OB의 연장선의 교점이 D이다. 사각형 CBDA가 색칠되어 있다. ∠BOA = ${th0}°`),
          explain: `${seg('OC')} = ${r} × ${fd('cos', th0)}, ${seg('BC')} = ${r} × ${fd('sin', th0)}, ${seg('AD')} = ${r} × ${fd('tan', th0)}이다. 색칠한 부분의 넓이는 △OAD − △OCB = ${vh(big)} − ${vh(small)} = ${vh(area)}(cm²)이다.`
        });
      }),
      H('hard-xy-square', '특수각의 삼각비로 만든 두 수의 제곱의 합', '심12', (d) => {
        // x = a + b, y = a − b (a, b 를 서로 다른 삼각비로 적는다) → x² + y² = 2(a² + b²)
        const NAMES = (v) => [['sin', 30], ['cos', 30], ['sin', 45], ['cos', 45], ['sin', 60], ['cos', 60], ['tan', 30], ['tan', 60]].filter((t) => veq(tv(t), v));
        const w = d.until(() => ({ av: d.pick([rad(1, 3, 2), rad(1, 3, 3), num(1, 2), rad(1, 3)]), bv: d.pick([rad(1, 2, 2), num(1, 2), rad(1, 3, 3)]) }), (z) => {
          const v = vmul(num(2), vadd(vmul(z.av, z.av), vmul(z.bv, z.bv))); return !veq(z.av, z.bv) && kindOf(v) === 'frac' && (z.av[0].m !== z.bv[0].m) && NAMES(z.av).length && NAMES(z.bv).length;
        });
        const { av, bv } = w, a1 = d.pick(NAMES(av)), a2 = d.pick(NAMES(av)), b1 = d.pick(NAMES(bv)), b2 = d.pick(NAMES(bv)), val = vmul(num(2), vadd(vmul(av, av), vmul(bv, bv)));
        return aFrac(`${X} = ${th(a1)} + ${th(b1)}, ${V('y')} = ${th(a2)} − ${th(b2)}일 때, ${X}${sup(2)} + ${V('y')}${sup(2)}의 값은?`, val, {
          value: `2*(${vfl(vmul(av, av)) === 0 ? 0 : '(' + vmul(av, av)[0].q.p + '/' + vmul(av, av)[0].q.q + ')'}+(${vmul(bv, bv)[0].q.p}/${vmul(bv, bv)[0].q.q}))`,
          explain: `${X} = ${vh(av)} + ${vh(bv)}, ${V('y')} = ${vh(av)} − ${vh(bv)}이다. ${X} + ${V('y')} = ${vh(vmul(num(2), av))}, ${X}${V('y')} = ${vh(vsub(vmul(av, av), vmul(bv, bv)))}이므로 ${X}${sup(2)} + ${V('y')}${sup(2)} = (${X} + ${V('y')})${sup(2)} − 2${X}${V('y')} = ${vh(val)}이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
