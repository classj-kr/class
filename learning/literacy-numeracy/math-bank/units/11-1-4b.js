// 고등학교 대수 Ⅱ-2 사인법칙과 코사인법칙 — 뒤쪽 묶음(삼각형의 모양, 삼각형의 넓이, 사각형의 넓이와 넓이의 활용).
// 단원 틀과 도구(근호가 든 수의 셈, 답 칸, 그림 판)는 11-1-4a.js 가 B.kit.u14x 로 내보낸 것을 쓴다. 싣는 기준·뺀 것과 까닭은 11-1-4a.js 머리에 모아 적었다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 넓이의 식: 두 변 b, c 와 그 끼인각 A 를 알 때 S = ½bc sin A. 외접원의 반지름 R 로 S = abc/4R = 2R² sin A sin B sin C. 사각형은 ½ × 두 대각선 × sin(끼인각).
// 삼각형의 모양을 묻는 고르기는 보기마다 그 모양의 삼각형 여럿(각을 무작위로 고른 것)에 주어진 식을 대어 참·거짓을 코드로 가린다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, box, lines, N, C, inline } = B.kit;
  const { MINUS, gcd, nb, tail, V, sup, rt, grp, SG } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, sv, TINT } = B.kit.mgeo;
  const { trig } = B.kit.hs;
  const {
    UNIT, T, K, KR, KF, add, neg, sbt, mul, div, sqrtV, sq, fv, same, isK, isRF, isInt, isRat, isSum, half, SIN, COS,
    sh, L, plainV, sqH, pq, pm, vA, vB, vC, va, vb, vc, vR, vS, AV, SVv, eqh, dg, sinH, cosH, sinD, cosD, TRI, others,
    calcOf, seal, more, aRad, aRadFr, aSum, aInt, aQ, pickNum, pic, polar, onC, outward, sssABC, r2, roundInt, tailDec
  } = B.kit.u14x;

  // ── 삼각형의 모양: 모양마다 삼각형을 여럿 만들어 식을 대어 본다 ──
  // 모양: 두 변이 같은 이등변삼각형(ab, bc, ca), 한 각이 직각인 직각삼각형(A, B, C)
  const KINDS = {
    ab: { h: () => `${va} = ${vb}인 이등변삼각형`, make: (t) => [t, t, 180 - 2 * t] },
    bc: { h: () => `${vb} = ${vc}인 이등변삼각형`, make: (t) => [180 - 2 * t, t, t] },
    ca: { h: () => `${va} = ${vc}인 이등변삼각형`, make: (t) => [t, 180 - 2 * t, t] },
    A: { h: () => `${vA} = 90°인 직각삼각형`, make: (t) => [90, t, 90 - t] },
    B: { h: () => `${vB} = 90°인 직각삼각형`, make: (t) => [t, 90, 90 - t] },
    C: { h: () => `${vC} = 90°인 직각삼각형`, make: (t) => [t, 90 - t, 90] }
  };
  // 삼각형 { A, B, C(라디안), a, b, c(외접원의 지름이 1) }
  const triOf = (degs) => { const [A, Bn, Cn] = degs.map((x) => x * RAD); return { A, B: Bn, C: Cn, a: Math.sin(A), b: Math.sin(Bn), c: Math.sin(Cn) }; };
  const TRIALS = { ab: [37, 52, 71], bc: [33, 49, 74], ca: [28, 47, 68], A: [23, 38, 61], B: [26, 44, 67], C: [31, 53, 72] };
  // 식 eq(삼각형) = 0 을 만족시키는 모양들
  const holdsFor = (eq) => Object.keys(KINDS).filter((k) => TRIALS[k].every((t) => Math.abs(eq(triOf(KINDS[k].make(t)))) < 1e-9));
  // 아무 삼각형(모양이 따로 없는 것)에서는 식이 성립하지 않아야 한다.
  const plainFails = (eq) => [[47, 61, 72], [35, 58, 87], [52, 33, 95]].every((t) => Math.abs(eq(triOf(t))) > 1e-6);
  // 글자 바꾸기: 변 이름 σ(a, b, c)를 한꺼번에 바꾼다.
  const PERMS = [['a', 'b', 'c'], ['b', 'c', 'a'], ['c', 'a', 'b'], ['a', 'c', 'b'], ['c', 'b', 'a'], ['b', 'a', 'c']];
  const KIND_OF = { 'ab': ['a', 'b'], 'bc': ['b', 'c'], 'ca': ['c', 'a'] };
  const permKind = (kind, P) => {
    const map = { a: P[0], b: P[1], c: P[2] };
    if (kind.length === 1) return map[kind.toLowerCase()].toUpperCase();
    const [x, y] = KIND_OF[kind].map((l) => map[l]).sort(); return x + y === 'ac' ? 'ca' : x + y;
  };
  // 모양 고르기 문항: tpl { eq(삼각형, 글자 묶음 P), h(P) 식의 글, kind 원래 모양, why(P) 풀이 }
  function shapeQ(d, tpl) {
    const P = d.pick(PERMS), L3 = { a: P[0], b: P[1], c: P[2] };
    const T3 = (t) => ({ a: t[L3.a], b: t[L3.b], c: t[L3.c], A: t[L3.a.toUpperCase()], B: t[L3.b.toUpperCase()], C: t[L3.c.toUpperCase()] });
    const eq = (t) => tpl.eq(T3(t));
    const hold = holdsFor(eq);
    if (hold.length !== 1 || !plainFails(eq)) throw new Error('모양이 하나로 정해지지 않는다: ' + hold.join());
    const right = hold[0];
    if (right !== permKind(tpl.kind, P)) throw new Error('글자를 바꾼 모양이 다르다');
    const pool = [right].concat(d.shuffle(Object.keys(KINDS).filter((k) => k !== right)).slice(0, 4));
    const order = Object.keys(KINDS).filter((k) => pool.includes(k));
    const truth = order.map((k) => k === right);
    const v = (l) => SVv[L3[l]], A = (l) => AV[L3[l]];
    return seal(C(`${TRI}에서 등식 ${tpl.h(v, A)}가 성립할 때, ${TRI}는 어떤 삼각형인가?`, order.map((k) => KINDS[k].h()), order.indexOf(right), {
      explain: tpl.why(v, A) + ` 따라서 ${TRI}는 ${KINDS[right].h()}이다.`,
      facts: { truth, want: true }
    }));
  }
  const sR = (x) => frac(x, '2' + vR);   // sin A = a/2R 의 글
  const cosOf = (x, y, z) => frac(sqH(y) + ' + ' + sqH(z) + ' − ' + sqH(x), '2' + y + z);   // cos X = (y² + z² − x²)/2yz

  const shapeTypes = [
    T('shape-sine', '사인법칙으로 변의 관계식을 만들어 삼각형의 모양 알기', '②1', (d, n) => {
      const tpls = n === 1 ? [
        { kind: 'bc', eq: (t) => t.c * Math.sin(t.A + t.B) - t.b * Math.sin(t.A + t.C), h: (v, A) => nb(v('c') + ' ' + sinH('(' + A('a') + ' + ' + A('b') + ')') + ' = ' + v('b') + ' ' + sinH('(' + A('a') + ' + ' + A('c') + ')')),
          why: (v, A) => `${nb(A('a') + ' + ' + A('b') + ' = 180° − ' + A('c'))}, ${nb(A('a') + ' + ' + A('c') + ' = 180° − ' + A('b'))}이므로 ${nb(v('c') + ' ' + sinH(A('c')) + ' = ' + v('b') + ' ' + sinH(A('b')))}이다. 외접원의 반지름의 길이를 ${vR}라 하면 사인법칙에 의하여 ${nb(v('c') + ' × ' + sR(v('c')) + ' = ' + v('b') + ' × ' + sR(v('b')))}, 곧 ${nb(sqH(v('c')) + ' = ' + sqH(v('b')))}이고 ${nb(v('b') + ' = ' + v('c'))}이다.` }
      ] : [
        { kind: 'C', eq: (t) => t.a * Math.sin(t.A) + t.b * Math.sin(t.B) - t.c * Math.sin(t.C), h: (v, A) => nb(v('a') + ' ' + sinH(A('a')) + ' + ' + v('b') + ' ' + sinH(A('b')) + ' = ' + v('c') + ' ' + sinH(A('c'))),
          why: (v, A) => `외접원의 반지름의 길이를 ${vR}라 하면 사인법칙에 의하여 ${eqh(sinH(A('a')), sR(v('a')))}, ${eqh(sinH(A('b')), sR(v('b')))}, ${eqh(sinH(A('c')), sR(v('c')))}이다. 주어진 식에 넣으면 ${nb(sqH(v('a')) + ' + ' + sqH(v('b')) + ' = ' + sqH(v('c')))}이다.` },
        { kind: 'ca', eq: (t) => t.a * Math.sin(t.A) - t.c * Math.sin(t.C), h: (v, A) => nb(v('a') + ' ' + sinH(A('a')) + ' = ' + v('c') + ' ' + sinH(A('c'))),
          why: (v, A) => `외접원의 반지름의 길이를 ${vR}라 하면 사인법칙에 의하여 ${nb(v('a') + ' × ' + sR(v('a')) + ' = ' + v('c') + ' × ' + sR(v('c')))}, 곧 ${nb(sqH(v('a')) + ' = ' + sqH(v('c')))}이다. ${v('a')}, ${v('c')}는 양수이므로 ${nb(v('a') + ' = ' + v('c'))}이다.` },
        { kind: 'ab', eq: (t) => t.a * Math.sin(t.A) ** 2 - t.b * Math.sin(t.B) ** 2, h: (v, A) => nb(v('a') + ' ' + trig('sin', A('a'), 2) + ' = ' + v('b') + ' ' + trig('sin', A('b'), 2)),
          why: (v, A) => `외접원의 반지름의 길이를 ${vR}라 하면 사인법칙에 의하여 ${nb(v('a') + ' × (' + sR(v('a')) + ')' + sup(2) + ' = ' + v('b') + ' × (' + sR(v('b')) + ')' + sup(2))}, 곧 ${nb(v('a') + sup(3) + ' = ' + v('b') + sup(3))}이다. ${nb('(' + v('a') + ' − ' + v('b') + ')(' + sqH(v('a')) + ' + ' + v('a') + v('b') + ' + ' + sqH(v('b')) + ') = 0')}이고 ${nb(sqH(v('a')) + ' + ' + v('a') + v('b') + ' + ' + sqH(v('b')) + ' &gt; 0')}이므로 ${nb(v('a') + ' = ' + v('b'))}이다.` }
      ];
      return shapeQ(d, d.pick(tpls));
    }, { count: 2 }),
    T('shape-cos', '코사인법칙으로 변의 관계식을 만들어 삼각형의 모양 알기', '②2', (d) => {
      const cA = (t) => Math.cos(t.A), cB = (t) => Math.cos(t.B), cC = (t) => Math.cos(t.C);
      const tpl = d.pick([
        { kind: 'ab', eq: (t) => t.a * cB(t) - t.b * cA(t), h: (v, A) => nb(v('a') + ' ' + cosH(A('b')) + ' = ' + v('b') + ' ' + cosH(A('a'))),
          why: (v, A) => `코사인법칙에 의하여 ${eqh(cosH(A('b')), cosOf(v('b'), v('c'), v('a')))}, ${eqh(cosH(A('a')), cosOf(v('a'), v('b'), v('c')))}이다. 주어진 식에 넣어 정리하면 ${nb(sqH(v('c')) + ' + ' + sqH(v('a')) + ' − ' + sqH(v('b')) + ' = ' + sqH(v('b')) + ' + ' + sqH(v('c')) + ' − ' + sqH(v('a')))}, 곧 ${nb(sqH(v('a')) + ' = ' + sqH(v('b')))}이므로 ${nb(v('a') + ' = ' + v('b'))}이다.` },
        { kind: 'C', eq: (t) => t.a + t.b * cC(t) - t.c * cB(t), h: (v, A) => nb(v('a') + ' + ' + v('b') + ' ' + cosH(A('c')) + ' = ' + v('c') + ' ' + cosH(A('b'))),
          why: (v, A) => `코사인법칙에 의하여 ${eqh(cosH(A('c')), cosOf(v('c'), v('a'), v('b')))}, ${eqh(cosH(A('b')), cosOf(v('b'), v('c'), v('a')))}이다. 주어진 식에 넣고 양변에 2${v('a')}를 곱하여 정리하면 ${nb('2' + sqH(v('a')) + ' + ' + sqH(v('a')) + ' + ' + sqH(v('b')) + ' − ' + sqH(v('c')) + ' = ' + sqH(v('c')) + ' + ' + sqH(v('a')) + ' − ' + sqH(v('b')))}, 곧 ${nb(sqH(v('a')) + ' + ' + sqH(v('b')) + ' = ' + sqH(v('c')))}이다.` }
      ]);
      return shapeQ(d, tpl);
    }),
    T('shape-mix', '사인법칙과 코사인법칙을 함께 써서 삼각형의 모양 알기', '②3', (d) => {
      const tpl = d.pick([
        { kind: 'A', eq: (t) => Math.sin(t.A) * Math.cos(t.B) - Math.sin(t.C), h: (v, A) => nb(sinH(A('a')) + ' ' + cosH(A('b')) + ' = ' + sinH(A('c'))),
          why: (v, A) => `외접원의 반지름의 길이를 ${vR}라 하면 사인법칙과 코사인법칙에 의하여 ${nb(sR(v('a')) + ' × ' + cosOf(v('b'), v('c'), v('a')) + ' = ' + sR(v('c')))}이다. 정리하면 ${nb(sqH(v('c')) + ' + ' + sqH(v('a')) + ' − ' + sqH(v('b')) + ' = 2' + sqH(v('c')))}, 곧 ${nb(sqH(v('a')) + ' = ' + sqH(v('b')) + ' + ' + sqH(v('c')))}이다.` },
        { kind: 'bc', eq: (t) => 2 * Math.sin(t.B) * Math.cos(t.C) + Math.sin(t.C) - Math.sin(t.A) - Math.sin(t.B), h: (v, A) => nb('2' + sinH(A('b')) + ' ' + cosH(A('c')) + ' + ' + sinH(A('c')) + ' = ' + sinH(A('a')) + ' + ' + sinH(A('b'))),
          why: (v, A) => `사인법칙과 코사인법칙으로 바꾸어 정리하면 ${nb(sqH(v('a')) + ' + ' + sqH(v('b')) + ' − ' + sqH(v('c')) + ' + ' + v('a') + v('c') + ' = ' + sqH(v('a')) + ' + ' + v('a') + v('b'))}, 곧 ${nb('(' + v('b') + ' − ' + v('c') + ')(' + v('b') + ' + ' + v('c') + ' − ' + v('a') + ') = 0')}이다. 삼각형의 두 변의 길이의 합은 나머지 한 변의 길이보다 크므로 ${nb(v('b') + ' + ' + v('c') + ' − ' + v('a') + ' &gt; 0')}이고 ${nb(v('b') + ' = ' + v('c'))}이다.` }
      ]);
      return shapeQ(d, tpl);
    })
  ];

  // ── 묶음 6: 삼각형의 넓이 ──
  const triArea = (b, c, ang) => mul(mul(mul(b, c), half(1)), SIN[ang]);
  const areaTold = (b, c, ang) => `${frac(1, 2)} × ${pm(b)} × ${pm(c)} × ${sinD(ang)}`;
  // 정수인 세 변으로 된 삼각형(넓이가 k√m 꼴)
  const heron2 = (a, b, c) => { const s2 = (a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c); return s2; };   // 16S²
  const areaTypes = [
    T('area-sas', '두 변과 그 끼인각으로 삼각형의 넓이 구하기', '②5', (d, n) => {
      // n = 0: 끼인각이 45°·60°, n = 1: 120°·135°
      const z = d.until(() => ({ x: d.pick(['a', 'b', 'c']), th: n === 0 ? d.pick([45, 60]) : d.pick([120, 135]), p: d.int(2, 14), q: d.int(2, 14) }), (y) => y.p !== y.q && isK(triArea(K(y.p), K(y.q), y.th)));
      const { x, th, p, q } = z, [y1, y2] = others(x), S = triArea(K(p), K(q), th);
      return aRad(`${TRI}에서 ${eqh(SVv[y1], p)}, ${eqh(SVv[y2], q)}, ${eqh(AV[x], dg(th))}일 때, ${TRI}의 넓이는?`, S, '', {
        rule: n === 0 ? 'acute' : 'obtuse',
        explain: `${TRI}의 넓이는 ${frac(1, 2) + SVv[y1] + SVv[y2] + ' ' + sinH(AV[x])} = ${areaTold(K(p), K(q), th)} = ${sh(S)}이다.`
      });
    }, { count: 2 }),
    T('area-cos', '두 변과 끼인각의 cos 값으로 삼각형의 넓이 구하기', '②6', (d) => {
      // cos 의 값은 직각삼각형의 세 변(3, 4, 5 …)에서 — sin 은 sin² + cos² = 1 로 구한다
      const z = d.until(() => { const [u, v, h] = d.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]]); return { u, v, h, s: d.pick([1, -1]), x: d.pick(['a', 'b', 'c']), p: d.int(2, 15), q: d.int(2, 15) }; }, (y) => y.p !== y.q && (y.p * y.q * y.v) % (2 * y.h) === 0);
      const { u, v, h, s, x, p, q } = z, [y1, y2] = others(x), cosV = KF(s * u, h), sinV = KF(v, h), S = p * q * v / (2 * h);
      return aInt(`${TRI}에서 ${eqh(SVv[y1], p)}, ${eqh(SVv[y2], q)}이고 ${eqh(cosH(AV[x]), sh(cosV))}일 때, ${TRI}의 넓이는?`, K(S), '', {
        explain: `${nb(trig('sin', AV[x], 2) + ' + ' + trig('cos', AV[x], 2) + ' = 1')}이고 ${sinH(AV[x])} &gt; 0이므로 ${eqh(sinH(AV[x]), rt('1 − (' + sh(KF(u, h)) + ')' + sup(2)))} = ${sh(sinV)}이다. 넓이는 ${frac(1, 2)} × ${p} × ${q} × ${sh(sinV)} = ${S}이다.`,
        facts: { calc: [[`${p}*${q}*(${h}*${h}-${u}*${u})**0.5/(2*${h})`, 0]] }
      });
    }),
    T('area-sss', '세 변의 길이로 삼각형의 넓이·sin 값 구하기', '②7', (d, n) => {
      // n = 0: 넓이(k√m), n = 1: sin 값(k√m/n)
      const z = d.until(() => ({ s: [d.int(3, 15), d.int(3, 15), d.int(3, 15)], x: d.pick(['a', 'b', 'c']) }), (y) => {
        const [a, b, c] = y.s; if (a >= b + c || b >= a + c || c >= a + b || new Set(y.s).size < 3) return false;
        const i = 'abc'.indexOf(y.x), o = y.s.filter((_, j) => j !== i), num = o[0] * o[0] + o[1] * o[1] - y.s[i] * y.s[i], den = 2 * o[0] * o[1];
        if (num === 0 || 2 * Math.abs(num) === den) return false;
        try { const sn = sqrtV(sbt(K(1), sq(KF(num, den)))); const S = mul(mul(K(o[0] * o[1]), half(1)), sn); return isRF(sn) && isK(S) && fv(S) < 200; } catch (e) { return false; }
      });
      const { s, x } = z, i = 'abc'.indexOf(x), o = s.filter((_, j) => j !== i), [y1, y2] = others(x), cosV = KF(o[0] * o[0] + o[1] * o[1] - s[i] * s[i], 2 * o[0] * o[1]);
      const sinV = sqrtV(sbt(K(1), sq(cosV))), S = mul(mul(K(o[0] * o[1]), half(1)), sinV);
      const head = `${TRI}에서 ${eqh(va, s[0])}, ${eqh(vb, s[1])}, ${eqh(vc, s[2])}일 때,`;
      const tell = `코사인법칙에 의하여 ${cosH(AV[x])} = ${frac(o[0] + sup(2) + ' + ' + o[1] + sup(2) + ' − ' + s[i] + sup(2), '2 × ' + o[0] + ' × ' + o[1])} = ${sh(cosV)}이다. ${sinH(AV[x])} &gt; 0이므로 ${eqh(sinH(AV[x]), rt('1 − (' + sh(cosV.map((t) => ({ ...t, nv: Math.abs(t.nv) }))) + ')' + sup(2)))} = ${sh(sinV)}이다.`;
      if (n === 1) return aRadFr(`${head} ${sinH(AV[x])}의 값은?`, sinV, '', { explain: tell });
      return aRad(`${head} ${TRI}의 넓이는?`, S, '', { explain: `${tell} 넓이는 ${frac(1, 2)} × ${o[0]} × ${o[1]} × ${sh(sinV)} = ${sh(S)}이다.` });
    }, { count: 2 }),
    T('area-aas', '한 변과 두 각으로 삼각형의 넓이 구하기(주어진 sin 값)', '②8', (d) => {
      // a, B, C → A = 180° − (B + C), b = a sin B / sin A → S = ½ab sin C. sin 값은 소수 둘째 자리까지 준다.
      const z = d.until(() => ({ a: 2 * d.int(5, 15), Bv: d.int(40, 75), Cv: d.int(40, 80) }), (y) => {
        const A = 180 - y.Bv - y.Cv; if (A < 30 || A > 100 || [30, 45, 60, 90].includes(A) || [y.Bv, y.Cv].some((t) => [45, 60].includes(t)) || y.Bv === y.Cv) return false;
        const sA = r2(Math.sin(A * RAD)), sB = r2(Math.sin(y.Bv * RAD)), sC = r2(Math.sin(y.Cv * RAD)); if (new Set([sA, sB, sC]).size < 3) return false;
        const S = y.a * y.a * sB * sC / (2 * sA), fr = S - Math.floor(S); return Math.abs(fr - 0.5) > 0.08 && S < 9000;
      });
      const { a, Bv, Cv } = z, A = 180 - Bv - Cv, sA = r2(Math.sin(A * RAD)), sB = r2(Math.sin(Bv * RAD)), sC = r2(Math.sin(Cv * RAD)), S = a * a * sB * sC / (2 * sA), ans = Math.round(S);
      return seal(N(`${TRI}에서 ${eqh(va, a)}, ${eqh(vB, dg(Bv))}, ${eqh(vC, dg(Cv))}일 때, ${TRI}의 넓이는? (단, ${eqh(sinD(A), sA)}, ${eqh(sinD(Bv), sB)}, ${nb(sinD(Cv) + ' = ' + sC + tailDec(sC, '으로/로'))} 계산하고, 소수점 아래 첫째 자리에서 반올림한다.)`, ans, {
        explain: `${eqh(vA, '180° − (' + dg(Bv) + ' + ' + dg(Cv) + ')')} = ${dg(A)}이므로 사인법칙에 의하여 ${eqh(vb, frac(a + ' ' + sinD(Bv), sinD(A)))}이다. 넓이는 ${frac(1, 2) + va + vb + ' ' + sinH(vC)} = ${frac(1, 2)} × ${a} × ${frac(a + ' × ' + sB, sA)} × ${sC} = ${S.toFixed(3)}…이므로 약 ${ans}이다.`,
        facts: { calc: [[roundInt(`${a}*${a}*${sB}*${sC}/(2*${sA})`), 0]] }
      }));
    }),
    T('area-back', '넓이에서 거꾸로 한 변의 길이 구하기', '②9', (d) => {
      const z = d.until(() => ({ x: d.pick(['a', 'b', 'c']), th: d.pick([45, 60, 120, 135, 150, 30]), p: d.int(2, 14), q: d.int(2, 14) }), (y) => y.p !== y.q && (isK(triArea(K(y.p), K(y.q), y.th)) || [30, 150].includes(y.th) && (y.p * y.q) % 4 !== 0));
      const { x, th, p, q } = z, [y1, y2] = others(x), S = triArea(K(p), K(q), th), ask = d.bool() ? y1 : y2, known = ask === y1 ? y2 : y1, kv = ask === y1 ? q : p, av = ask === y1 ? p : q;
      return seal(N(`넓이가 ${sh(S)}인 ${TRI}에서 ${eqh(SVv[known], kv)}, ${eqh(AV[x], dg(th))}일 때, ${SVv[ask]}의 값은?`, av, {
        explain: `${nb(frac(1, 2) + ' × ' + SVv[ask] + ' × ' + kv + ' × ' + sinD(th) + ' = ' + sh(S))}이고 ${eqh(sinD(th), sh(SIN[th]))}이므로 ${eqh(SVv[ask], av)}이다.`,
        facts: { calc: [[`(${calcOf(S[0])})*2/(${kv}*${calcOf(SIN[th][0])})`, 0]] }
      }));
    }),
    T('area-ratio', '한 각을 함께 가진 두 삼각형의 넓이의 비 구하기', '②10', (d) => {
      const z = d.until(() => ({ ab: d.int(5, 15), ac: d.int(5, 15), ap: d.int(2, 12), aq: d.int(2, 12) }), (y) => y.ap < y.ab && y.aq < y.ac && y.ab !== y.ac && y.ap !== y.aq && (y.ab * y.ac) / gcd(y.ab * y.ac, y.ap * y.aq) <= 99 && y.ab / y.ac > 0.65 && y.ab / y.ac < 1.55 && y.ap / y.ab > 0.3 && y.ap / y.ab < 0.8 && y.aq / y.ac > 0.3 && y.aq / y.ac < 0.8);
      const { ab, ac, ap, aq } = z, g = gcd(ab * ac, ap * aq), r = [ab * ac / g, ap * aq / g];
      const mdl = { A: [0, 0], B: polar([0, 0], ab, 205), C: polar([0, 0], ac, 265) };
      mdl.P = [mdl.B[0] * ap / ab, mdl.B[1] * ap / ab]; mdl.Q = [mdl.C[0] * aq / ac, mdl.C[1] * aq / ac];
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['P', 'Q']], sides: [['A', 'P', String(ap), 'Q', { gap: 4 }], ['A', 'Q', String(aq), 'P', { gap: 4 }]], size: [200, 130] });
      return aRatioQ(`그림과 같이 ${eqh(SG('AB'), ab)}, ${eqh(SG('AC'), ac)}인 ${TRI}에서 두 점 P, Q가 각각 변 AB, 변 AC 위의 점이고 ${eqh(SG('AP'), ap)}, ${eqh(SG('AQ'), aq)}일 때, 삼각형 ABC와 삼각형 APQ의 넓이의 비를 가장 간단한 자연수의 비로 나타내면?`, r, [`${ab}*${ac}/${g}`, `${ap}*${aq}/${g}`], {
        figure: f.b.svg(`삼각형 ABC와 변 AB 위의 점 P, 변 AC 위의 점 Q, 선분 PQ. AB의 길이는 ${ab}, AC의 길이는 ${ac}, AP의 길이는 ${ap}, AQ의 길이는 ${aq}`),
        explain: `∠A의 크기를 ${vA}라 하면 넓이의 비는 ${nb(frac(1, 2) + ' × ' + ab + ' × ' + ac + ' × ' + sinH(vA) + ' : ' + frac(1, 2) + ' × ' + ap + ' × ' + aq + ' × ' + sinH(vA))} = ${nb(ab * ac + ' : ' + ap * aq)} = ${nb(r.join(' : '))}이다.`
      });
    }),
    T('area-sum', '두 변의 길이의 합과 그 끼인각의 대변으로 넓이 구하기', '②12', (d) => {
      const z = d.until(() => ({ b: d.int(2, 16), c: d.int(2, 16), th: d.pick([60, 120]) }), (y) => {
        const a2 = y.b * y.b + y.c * y.c + (y.th === 120 ? 1 : -1) * y.b * y.c, a = Math.round(Math.sqrt(a2));
        return y.b < y.c && a * a === a2 && isRF(triArea(K(y.b), K(y.c), y.th));
      });
      const { b, c, th } = z, a = Math.round(Math.sqrt(b * b + c * c + (th === 120 ? 1 : -1) * b * c)), S = triArea(K(b), K(c), th), sgn = '−';
      // a² = (b + c)² − 2bc − 2bc cos A → bc
      return aRadFr(`${TRI}에서 ${eqh(va, a)}, ${eqh(vA, dg(th))}이고 ${nb(vb + ' + ' + vc + ' = ' + (b + c))}일 때, ${TRI}의 넓이는?`, S, '', {
        explain: `코사인법칙에 의하여 ${nb(a + sup(2) + ' = ' + sqH(vb) + ' + ' + sqH(vc) + ' − 2' + vb + vc + ' ' + cosD(th))} = ${nb('(' + vb + ' + ' + vc + ')' + sup(2) + ' ' + sgn + ' ' + (th === 120 ? '' : '3') + vb + vc)}이므로 ${nb(a * a + ' = ' + (b + c) * (b + c) + ' ' + sgn + ' ' + (th === 120 ? '' : '3') + vb + vc)}, 곧 ${nb(vb + vc + ' = ' + b * c)}이다. 넓이는 ${frac(1, 2)} × ${b * c} × ${sinD(th)} = ${sh(S)}이다.`
      });
    }),
    T('area-formula', '외접원의 반지름으로 넓이를 나타내는 식의 빈칸', '②13', (d, n) => {
      // 교과서 개념 탐구의 빈칸을 고르기로: n = 0 S = abc/4R, n = 1 S = 2R² sin A sin B sin C
      const R = vR, S = vS, gA = box('㈎'), gB = box('㈏');
      const t = { A: 0.9, B: 1.1, C: Math.PI - 2 }, Rv = 1.3, a = 2 * Rv * Math.sin(t.A), b = 2 * Rv * Math.sin(t.B), c = 2 * Rv * Math.sin(t.C), Sv = 0.5 * b * c * Math.sin(t.A);
      const rowsH = n === 0
        ? [`사인법칙에 의하여 ${eqh(sinH(vA), frac(gA, '2' + R))}이므로`, `${S} = ${frac(1, 2)}${vb}${vc} ${sinH(vA)} = ${frac(1, 2)}${vb}${vc} × ${frac(gA, '2' + R)} = ${gB}`]
        : [`사인법칙에 의하여 ${nb(vb + ' = 2' + R + ' × ' + gA)}, ${nb(vc + ' = 2' + R + ' ' + sinH(vC))}이므로`, `${S} = ${frac(1, 2)}${vb}${vc} ${sinH(vA)} = ${gB}`];
      const opts = n === 0 ? [
        [[va, frac(va + vb + vc, '4' + R)], (x, y) => x === a && Math.abs(y - a * b * c / (4 * Rv)) < 1e-9, a, a * b * c / (4 * Rv)],
        [[va, frac(va + vb + vc, '2' + R)], 0, a, a * b * c / (2 * Rv)],
        [[vb, frac(va + vb + vc, '4' + R)], 0, b, a * b * c / (4 * Rv)],
        [[va, frac(va + vb + vc, R)], 0, a, a * b * c / Rv],
        [['2' + va, frac(va + vb + vc, '2' + R)], 0, 2 * a, a * b * c / (2 * Rv)]
      ] : [
        [[sinH(vB), nb('2' + R + sup(2) + ' ' + sinH(vA) + ' ' + sinH(vB) + ' ' + sinH(vC))], 0, Math.sin(t.B), 2 * Rv * Rv * Math.sin(t.A) * Math.sin(t.B) * Math.sin(t.C)],
        [[sinH(vB), nb(R + sup(2) + ' ' + sinH(vA) + ' ' + sinH(vB) + ' ' + sinH(vC))], 0, Math.sin(t.B), Rv * Rv * Math.sin(t.A) * Math.sin(t.B) * Math.sin(t.C)],
        [[sinH(vA), nb('2' + R + sup(2) + ' ' + sinH(vA) + ' ' + sinH(vB) + ' ' + sinH(vC))], 0, Math.sin(t.A), 2 * Rv * Rv * Math.sin(t.A) * Math.sin(t.B) * Math.sin(t.C)],
        [[sinH(vB), nb('4' + R + sup(2) + ' ' + sinH(vA) + ' ' + sinH(vB) + ' ' + sinH(vC))], 0, Math.sin(t.B), 4 * Rv * Rv * Math.sin(t.A) * Math.sin(t.B) * Math.sin(t.C)],
        [[sinH(vB), nb('2' + R + ' ' + sinH(vA) + ' ' + sinH(vB) + ' ' + sinH(vC))], 0, Math.sin(t.B), 2 * Rv * Math.sin(t.A) * Math.sin(t.B) * Math.sin(t.C)]
      ];
      // 참값: ㈎ 는 사인법칙(n = 0: sin A·2R = a, n = 1: b = 2R × ㈎), ㈏ 는 넓이
      const want1 = n === 0 ? a : Math.sin(t.B);
      const truth = opts.map((o) => Math.abs(o[2] - want1) < 1e-9 && Math.abs(o[3] - Sv) < 1e-9);
      const rows = d.shuffle(opts.map((o, i) => [o, truth[i]]));
      return seal(C(`다음은 ${TRI}의 넓이 ${S}를 외접원의 반지름의 길이 ${R}로 나타내는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, rows.map((r) => nb(r[0][0][0] + ', ' + r[0][0][1])), rows.findIndex((r) => r[1]), {
        figure: lines(rowsH),
        explain: n === 0 ? `사인법칙에 의하여 ${eqh(frac(va, sinH(vA)), '2' + R)}이므로 ${eqh(sinH(vA), frac(va, '2' + R))}이고 ${S} = ${frac(1, 2)}${vb}${vc} × ${frac(va, '2' + R)} = ${frac(va + vb + vc, '4' + R)}이다.`
          : `사인법칙에 의하여 ${nb(vb + ' = 2' + R + ' ' + sinH(vB))}, ${nb(vc + ' = 2' + R + ' ' + sinH(vC))}이므로 ${S} = ${frac(1, 2)} × 2${R} ${sinH(vB)} × 2${R} ${sinH(vC)} × ${sinH(vA)} = ${nb('2' + R + sup(2) + ' ' + sinH(vA) + ' ' + sinH(vB) + ' ' + sinH(vC))}이다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      }));
    }, { count: 2 }),
    T('area-circum', '외접원의 반지름과 세 변으로 넓이(넓이와 반지름으로 abc) 구하기', '②14', (d, n) => {
      if (n === 1) {
        const z = d.until(() => ({ R: d.int(2, 9), S: d.int(2, 40) }), (y) => y.S < 1.2 * y.R * y.R && 4 * y.R * y.S <= 9999);
        const { R, S } = z;
        return seal(N(`반지름의 길이가 ${R}인 원에 내접하는 ${TRI}의 넓이가 ${S}일 때, ${va}${vb}${vc}의 값은?`, 4 * R * S, {
          explain: `${eqh(vS, frac(1, 2) + va + vb + ' ' + sinH(vC))}이고 사인법칙에 의하여 ${eqh(sinH(vC), frac(vc, '2 × ' + R))}이므로 ${nb(S + ' = ' + frac(1, 2) + va + vb + ' × ' + frac(vc, 2 * R) + ' = ' + frac(va + vb + vc, 4 * R))}이다. 따라서 ${eqh(va + vb + vc, 4 * R * S)}이다.`,
          facts: { calc: [[`4*${R}*${S}`, 0]] }
        }));
      }
      const z = d.until(() => [d.int(3, 14), d.int(3, 14), d.int(3, 14)], (s) => {
        const [a, b, c] = s; if (a >= b + c || b >= a + c || c >= a + b || new Set(s).size < 3) return false;
        try { const S = div(sqrtV(K(heron2(a, b, c))), K(4)); return isK(S) && fv(S) < 120; } catch (e) { return false; }
      });
      const [a, b, c] = z, S = div(sqrtV(K(heron2(a, b, c))), K(4)), R = div(K(a * b * c), mul(K(4), S));
      return aRad(`${TRI}에서 ${eqh(va, a)}, ${eqh(vb, b)}, ${eqh(vc, c)}이고 외접원의 반지름의 길이가 ${sh(R)}일 때, ${TRI}의 넓이는?`, S, '', {
        explain: `사인법칙에 의하여 ${eqh(sinH(vA), frac(va, '2' + vR))}이므로 넓이는 ${frac(1, 2) + vb + vc + ' ' + sinH(vA)} = ${frac(va + vb + vc, '4' + vR)} = ${frac(a + ' × ' + b + ' × ' + c, '4 × ' + pm(R))} = ${sh(S)}이다.`
      });
    }, { count: 2 }),
    T('area-circum-angles', '두 각과 외접원의 반지름으로 넓이 구하기', '②15', (d) => {
      const z = d.until(() => { const [p, q] = d.pick([[120, 30], [30, 120], [30, 30], [30, 60], [60, 30], [60, 90], [90, 30], [60, 60]]); return { p, q, R: d.int(2, 8), which: d.pick([['a', 'b'], ['b', 'c'], ['a', 'c']]) }; }, (y) => {
        const r = 180 - y.p - y.q; if (!SIN[r]) return false;
        const S = mul(mul(mul(K(2 * y.R * y.R), SIN[y.p]), SIN[y.q]), SIN[r]); return isK(S);
      });
      const { p, q, R, which } = z, r = 180 - p - q, S = mul(mul(mul(K(2 * R * R), SIN[p]), SIN[q]), SIN[r]);
      const third = ['a', 'b', 'c'].find((l) => !which.includes(l));
      return aRad(`${TRI}에서 ${eqh(AV[which[0]], dg(p))}, ${eqh(AV[which[1]], dg(q))}이고 외접원의 반지름의 길이가 ${R}일 때, ${TRI}의 넓이는?`, S, '', {
        explain: `${eqh(AV[third], '180° − (' + dg(p) + ' + ' + dg(q) + ')')} = ${dg(r)}이다. 사인법칙에 의하여 ${nb(va + ' = 2' + vR + ' ' + sinH(vA))}, ${nb(vb + ' = 2' + vR + ' ' + sinH(vB))}이므로 넓이는 ${frac(1, 2) + va + vb + ' ' + sinH(vC)} = ${nb('2' + vR + sup(2) + ' ' + sinH(vA) + ' ' + sinH(vB) + ' ' + sinH(vC))} = 2 × ${R}${sup(2)} × ${sh(SIN[p])} × ${sh(SIN[q])} × ${sh(SIN[r])} = ${sh(S)}이다.`
      });
    })
  ];
  // 비 답(두 칸)
  function aRatioQ(text, values, exprs, o) {
    return seal(inline(text, '{0} : {1}', values.map((v) => ({ answer: v })), Object.assign(more(o, { calc: exprs.map((e, i) => [e, i]) }), { shown: values.join(' : ') })));
  }

  // 각의 이등분선: 꼭짓점 v 에서 p 쪽 변과 m(이등분선 위의 점) 사이, m 과 q 쪽 변 사이에 같은 각 표시(●)
  function halves(b, v, p, m, q) {
    const mid2 = (x, y) => { let t = (y - x + 360) % 360; if (t > 180) t -= 360; return x + t / 2; };
    const ap = dirOf(v, p), am = dirOf(v, m), aq = dirOf(v, q);
    b.sym(v, mid2(ap, am), 'dot', 22); b.sym(v, mid2(am, aq), 'dot', 22);
  }
  // ── 묶음 7: 사각형의 넓이와 넓이의 활용 ──
  const paraPic = (p, q, ang, o) => {
    const Bm = [0, 0], Cm = [q, 0], Am = polar(Bm, p, ang), Dm = [Am[0] + q, Am[1]];
    return pic({ A: Am, B: Bm, C: Cm, D: Dm }, Object.assign({ polys: [['A', 'B', 'C', 'D']], size: [190, 100] }, o || {}));
  };
  const quadTypes = [
    T('quad-para', '두 변과 그 끼인각으로 평행사변형의 넓이 구하기', '②17', (d) => {
      const z = d.until(() => ({ p: d.int(2, 14), q: d.int(2, 16), th: d.pick([45, 60, 120, 135]) }), (y) => y.p !== y.q && y.p < y.q && isK(mul(K(y.p * y.q), SIN[y.th])));
      const { p, q, th } = z, S = mul(K(p * q), SIN[th]);
      // ∠A 에 각을 적는다(∠B 는 180° − th)
      const f = paraPic(p, q, 180 - th, { angs: [['A', 'D', 'B', dg(th)]], sides: [['A', 'B', String(p), 'C'], ['B', 'C', String(q), 'A']] });
      return aRad(`그림과 같이 ${eqh(SG('AB'), p)}, ${eqh(SG('BC'), q)}, ${eqh('∠DAB', dg(th))}인 평행사변형 ABCD의 넓이는?`, S, '', {
        figure: f.b.svg(`평행사변형 ABCD. AB의 길이는 ${p}, BC의 길이는 ${q}, ∠A = ${th}°`),
        explain: `대각선 BD는 평행사변형을 넓이가 같은 두 삼각형으로 나누므로 넓이는 ${nb('2 × ' + frac(1, 2) + ' × ' + p + ' × ' + q + ' × ' + sinD(th))} = ${sh(S)}이다.`
      });
    }),
    T('quad-diag', '두 대각선과 그 끼인각으로 사각형의 넓이 구하기', '②18', (d, n) => {
      const z = d.until(() => ({ p: d.int(4, 16), q: d.int(4, 16), th: d.pick([45, 60, 120, 135]) }), (y) => y.p !== y.q && y.p / y.q > 0.6 && y.p / y.q < 1.7 && isK(mul(K(y.p * y.q), SIN[y.th])) && (n === 1 || isK(mul(mul(K(y.p * y.q), half(1)), SIN[y.th]))));
      const { p, q, th } = z, Sq = mul(mul(K(p * q), half(1)), SIN[th]), Sp = mul(K(p * q), SIN[th]);
      // 대각선 AC(가로)와 BD 가 점 O 에서 각 th 로 만난다
      const ang = th, O = [0, 0], Am = [-p * 0.45, 0], Cm = [p * 0.55, 0], Bm = polar(O, q * 0.4, 180 + ang), Dm = polar(O, q * 0.6, ang);
      const mdl = { A: Am, B: Bm, C: Cm, D: Dm, O };
      if (n === 0) {
        const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['B', 'D']], angs: [['O', 'C', 'D', dg(th)]], names: ['A', 'B', 'C', 'D'], size: [190, 120] });
        return aRad(`그림과 같이 두 대각선의 길이가 각각 ${p}, ${q}이고 두 대각선이 이루는 각의 크기가 ${dg(th)}인 사각형 ABCD의 넓이는?`, Sq, '', {
          figure: f.b.svg(`사각형 ABCD와 두 대각선 AC, BD. AC의 길이는 ${p}, BD의 길이는 ${q}, 두 대각선이 이루는 각은 ${th}°`),
          explain: `두 대각선의 교점을 O라 하고 네 삼각형 OAB, OBC, OCD, ODA의 넓이를 더하면 넓이는 ${nb(frac(1, 2) + ' × ' + p + ' × ' + q + ' × ' + sinD(th))} = ${sh(Sq)}이다.`
        });
      }
      // n = 1: 네 꼭짓점을 지나고 대각선에 평행한 선분으로 만든 평행사변형 EFGH
      const u = [Math.cos(ang * RAD), Math.sin(ang * RAD)], e = (P0, dir, t) => [P0[0] + dir[0] * t, P0[1] + dir[1] * t];
      // 각 꼭짓점을 지나 다른 대각선에 평행한 직선의 교점
      const meetL = (P1, d1, P2, d2) => { const det = d1[0] * -d2[1] - d1[1] * -d2[0], t = ((P2[0] - P1[0]) * -d2[1] - (P2[1] - P1[1]) * -d2[0]) / det; return e(P1, d1, t); };
      const hx = [1, 0];
      const E = meetL(Am, u, Bm, hx), F = meetL(Bm, hx, Cm, u), G = meetL(Cm, u, Dm, hx), Hh = meetL(Dm, hx, Am, u);
      const f = pic(Object.assign({}, mdl, { E, F, G, H: Hh }), { polys: [['E', 'F', 'G', 'H'], ['A', 'B', 'C', 'D']], fills: [null, TINT], segs: [['A', 'C'], ['B', 'D']], angs: [['O', 'C', 'D', dg(th)]], names: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], size: [200, 130] });
      return aRad(`그림과 같이 사각형 ABCD의 두 대각선의 길이는 각각 ${p}, ${q}이고 두 대각선이 이루는 각의 크기는 ${dg(th)}이다. 네 꼭짓점 A, B, C, D를 지나고 두 대각선 AC, BD에 각각 평행한 선분을 그어 만든 평행사변형 EFGH의 넓이는?`, Sp, '', {
        figure: f.b.svg(`사각형 ABCD와 두 대각선, 네 꼭짓점을 지나 대각선에 평행한 선분으로 만든 평행사변형 EFGH. AC의 길이는 ${p}, BD의 길이는 ${q}, 두 대각선이 이루는 각은 ${th}°`),
        explain: `평행사변형 EFGH의 이웃한 두 변의 길이는 두 대각선의 길이 ${p}, ${nb(q + tail(q, '과/와'))} 같고 그 끼인각은 ${dg(th)}(또는 ${dg(180 - th)})이므로 넓이는 ${nb(p + ' × ' + q + ' × ' + sinD(th))} = ${sh(Sp)}이다. (사각형 ABCD의 넓이는 그 절반이다.)`
      });
    }, { count: 2 }),
    T('quad-trap', '등변사다리꼴의 넓이로 대각선의 길이 구하기', '②19', (d) => {
      const z = d.until(() => ({ dd: d.int(4, 20), th: d.pick([45, 60, 120, 135]) }), (y) => { const S = mul(mul(K(y.dd * y.dd), half(1)), SIN[y.th]); return isInt(S) || isK(S); });
      const { dd, th } = z, S = mul(mul(K(dd * dd), half(1)), SIN[th]);
      // 그림: 아랫변이 긴 등변사다리꼴, 대각선의 교점 P, ∠APB = th(A 왼쪽 위 … 로 놓는다)
      // ∠BPC = 180° − th 가 되게 P 의 높이를 잡는다(B(−1, 0), C(1, 0)).
      const half2 = (180 - th) / 2, Bm = [-1, 0], Cm = [1, 0], Pm = [0, 1 / Math.tan(half2 * RAD)];
      const mdl = { A: [-0.55, Pm[1] * 1.55], B: Bm, C: Cm, D: [0.55, Pm[1] * 1.55], P: Pm };
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['B', 'D']], angs: [['P', 'A', 'B', dg(th)]], nameAt: { P: th > 90 ? 0 : 90 }, size: [180, 130] });
      return seal(N(`그림과 같은 등변사다리꼴 ABCD에서 두 대각선 AC, BD가 만나는 점 P에 대하여 ${eqh('∠APB', dg(th))}이다. 등변사다리꼴 ABCD의 넓이가 ${sh(S)}일 때, 대각선 AC의 길이는?`, dd, {
        figure: f.b.svg(`등변사다리꼴 ABCD와 두 대각선 AC, BD, 그 교점 P. ∠APB = ${th}°`),
        explain: `등변사다리꼴의 두 대각선의 길이는 같으므로 ${eqh(SG('AC'), SG('BD'))}이다. ${nb(frac(1, 2) + ' × ' + sqH(SG('AC')) + ' × ' + sinD(th) + ' = ' + sh(S))}이므로 ${sqH(SG('AC'))} = ${dd * dd}이고 AC의 길이는 ${dd}이다.`,
        facts: { calc: [[`((${calcOf(S[0])})*2/(${calcOf(SIN[th][0])}))**0.5`, 0]] }
      }));
    }),
    T('quad-arcs', '원 위의 점과 호의 길이의 비로 넓이 구하기', '②20', (d, n) => {
      // 중심각(모두 180° 보다 작다)의 합이 360°이고 넓이가 a + b√3 꼴(a, b 모두 0 이 아니다)
      const SETS = n === 0 ? [[90, 120, 150], [60, 150, 150], [150, 90, 120]] : [[30, 120, 150, 60], [60, 60, 90, 150], [30, 90, 90, 150], [90, 90, 60, 120], [30, 90, 120, 120], [60, 90, 60, 150], [30, 150, 120, 60], [150, 30, 90, 90]];
      const z = d.until(() => ({ set: d.shuffle(d.pick(SETS)), R: d.pick([2, 4, 6]) }), (y) => { const S = y.set.reduce((s, t) => add(s, mul(mul(K(y.R * y.R), half(1)), SIN[t])), []); return isSum(S); });
      const { set, R } = z, g = set.reduce((s, v) => gcd(s, v), 0), ratio = set.map((v) => v / g), S = set.reduce((s, t) => add(s, mul(mul(K(R * R), half(1)), SIN[t])), []);
      const names = n === 0 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'], start = 100, mdl = { O: [0, 0] };
      let a0 = start; names.forEach((nm, i) => { mdl[nm] = onC(a0); a0 -= set[i]; });
      const f = pic(mdl, { circle: ['O', 1], polys: [names], thins: names.map((nm) => ['O', nm]), names: ['O'].concat(names), nameAt: outward(mdl, names), size: [150, 150] });
      f.b.dot(f.P.O);
      const arcs = names.map((nm, i) => nb('호 ' + nm + names[(i + 1) % names.length]));
      const arcH = arcs.join(' : ') + ' = ' + nb(ratio.join(' : '));
      const shape = n === 0 ? `${TRI}` : '사각형 ABCD';
      return aSum(`그림과 같이 중심이 O이고 반지름의 길이가 ${R}인 원 위에 ${names.length}개의 점 ${names.join(', ')}가 있다. ${arcH}일 때, ${shape}의 넓이는?`, S, '', {
        figure: f.b.svg(`중심이 O이고 반지름의 길이가 ${R}인 원에 내접하는 ${n === 0 ? '삼각형 ABC' : '사각형 ABCD'}와 반지름 ${names.map((nm) => 'O' + nm).join(', ')}`),
        explain: `호의 길이는 중심각의 크기에 정비례하므로 중심각은 ${names.map((nm, i) => '∠' + nm + 'O' + names[(i + 1) % names.length] + ' = ' + dg(set[i])).join(', ')}이다. 넓이는 ${set.map((t) => frac(1, 2) + ' × ' + R + ' × ' + R + ' × ' + sinD(t)).join(' + ')} = ${sh(S)}이다.`
      });
    }, { count: 2 }),
    T('quad-bisector', '넓이를 이용하여 각의 이등분선의 길이 구하기', '②21', (d, n) => {
      if (n === 0) {
        // ∠A = 60°, AB = c, AC = b, ∠A 의 이등분선 AD: ½bc sin 60° = ½c·AD sin 30° + ½b·AD sin 30° → AD = √3 bc/(b + c)
        const z = d.until(() => ({ b: d.int(3, 16), c: d.int(3, 16) }), (y) => y.b !== y.c && isRF(div(mul(KR(1, 3), K(y.b * y.c)), K(y.b + y.c))));
        const { b, c } = z, AD = div(mul(KR(1, 3), K(b * c)), K(b + c)), S = triArea(K(b), K(c), 60);
        const mdl = sssABC(Math.sqrt(b * b + c * c - b * c), b, c), x = c / (b + c) * Math.sqrt(b * b + c * c - b * c); mdl.D = [x, 0];
        const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], sides: [['A', 'B', String(c), 'C'], ['A', 'C', String(b), 'B']], after: (bb, P) => halves(bb, P.A, P.B, P.D, P.C), nameAt: { D: 270 }, size: [190, 120] });
        return aRadFr(`그림과 같이 ${eqh(SG('AB'), c)}, ${eqh(SG('AC'), b)}, ${eqh('∠BAC', '60°')}인 ${TRI}에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 할 때, 선분 AD의 길이는?`, AD, '', {
          figure: f.b.svg(`삼각형 ABC와 ∠A의 이등분선 AD. AB의 길이는 ${c}, AC의 길이는 ${b}. ∠BAD와 ∠DAC에 같은 각 표시`),
          explain: `${nb('△ABC = △ABD + △ADC')}이고 ${nb('∠BAD = ∠DAC = 30°')}이므로 ${nb(frac(1, 2) + ' × ' + c + ' × ' + b + ' × ' + sinD(60) + ' = ' + frac(1, 2) + ' × ' + c + ' × ' + SG('AD') + ' × ' + sinD(30) + ' + ' + frac(1, 2) + ' × ' + SG('AD') + ' × ' + b + ' × ' + sinD(30))}이다. ${sh(S)} = ${frac(b + c, 4)}${SG('AD')}이므로 AD의 길이는 ${sh(AD)}이다.`
        });
      }
      // n = 1: 세 변으로 ∠B = 60° 를 먼저 구한 뒤 ∠B 의 이등분선 BD
      const z = d.until(() => ({ a: d.int(2, 15), c: d.int(2, 15) }), (y) => {
        if (y.a === y.c) return false; const b2 = y.a * y.a + y.c * y.c - y.a * y.c, b = Math.round(Math.sqrt(b2));
        return isRF(div(mul(KR(1, 3), K(y.a * y.c)), K(y.a + y.c))) && (b * b === b2 || !Number.isInteger(Math.sqrt(b2)));
      });
      const { a, c } = z, b2 = a * a + c * c - a * c, bV = sqrtV(K(b2)), BD = div(mul(KR(1, 3), K(a * c)), K(a + c));
      const mdl = sssABC(a, Math.sqrt(b2), c), Dx = mdl.A[0] + (mdl.C[0] - mdl.A[0]) * c / (a + c), Dy = mdl.A[1] + (mdl.C[1] - mdl.A[1]) * c / (a + c); mdl.D = [Dx, Dy];
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['B', 'D']], sides: [['A', 'B', String(c), 'C'], ['B', 'C', String(a), 'A']], after: (bb, P) => halves(bb, P.B, P.A, P.D, P.C), nameAt: { D: 40 }, size: [190, 120] });
      return aRadFr(`그림과 같이 ${eqh(SG('AB'), c)}, ${eqh(SG('BC'), a)}, ${eqh(SG('AC'), sh(bV))}인 ${TRI}에서 ∠ABC의 이등분선이 변 AC와 만나는 점을 D라 할 때, 선분 BD의 길이는?`, BD, '', {
        figure: f.b.svg(`삼각형 ABC와 ∠B의 이등분선 BD. AB의 길이는 ${c}, BC의 길이는 ${a}, AC의 길이는 ${plainV(bV)}. ∠ABD와 ∠DBC에 같은 각 표시`),
        explain: `코사인법칙에 의하여 ${cosH(vB)} = ${frac(c + sup(2) + ' + ' + a + sup(2) + ' − ' + sqH(pq(bV)), '2 × ' + c + ' × ' + a)} = ${frac(1, 2)}이므로 ${eqh(vB, '60°')}이다. ${nb('△ABC = △ABD + △DBC')}이고 ${nb('∠ABD = ∠DBC = 30°')}이므로 ${nb(frac(1, 2) + ' × ' + c + ' × ' + a + ' × ' + sinD(60) + ' = ' + frac(1, 2) + ' × (' + c + ' + ' + a + ') × ' + SG('BD') + ' × ' + sinD(30))}이고 BD의 길이는 ${sh(BD)}이다.`
      });
    }, { count: 2 }),
    T('quad-twostep', '대각선을 구하고 이차방정식으로 남은 변을 구해 사각형의 넓이 구하기', '②22', (d) => {
      // ∠B = θ, ∠D = 180° − θ. AB, BC → AC(코사인법칙) → AD 와 ∠D 로 CD(이차방정식) → 넓이
      const z = d.until(() => ({ ab: d.int(1, 9), bc: d.int(1, 9), ad: d.int(1, 9), th: d.pick([120, 60]) }), (y) => {
        if (y.ab === y.bc || Math.max(y.ab, y.bc, y.ad) > 3 * Math.min(y.ab, y.bc, y.ad)) return false;
        const ac2 = y.ab * y.ab + y.bc * y.bc - (y.th === 60 ? 1 : -1) * y.ab * y.bc, cD = y.th === 60 ? -0.5 : 0.5;   // cos D
        // CD² − 2·AD·cos D·CD + AD² − AC² = 0
        const bq = -2 * y.ad * cD, cq = y.ad * y.ad - ac2, disc = bq * bq - 4 * cq; if (disc <= 0) return false;
        const x = (-bq + Math.sqrt(disc)) / 2; if (Math.abs(x - Math.round(x)) > 1e-9 || x < 1 || x > 3 * Math.min(y.ab, y.bc, y.ad) || x < 0.45 * Math.max(y.ab, y.bc, y.ad)) return false;
        return isRF(mul(K(y.ab * y.bc + y.ad * Math.round(x)), mul(half(3), half(1))));
      });
      const { ab, bc, ad, th } = z, Dv = 180 - th, ac2 = ab * ab + bc * bc - (th === 60 ? 1 : -1) * ab * bc, cDs = th === 60 ? -1 : 1, bq = -cDs * ad, cq = ad * ad - ac2, cd = Math.round((-bq + Math.sqrt(bq * bq - 4 * cq)) / 2);
      const S1 = triArea(K(ab), K(bc), th), S2 = triArea(K(ad), K(cd), Dv), S = add(S1, S2);
      // 그림: B 원점, C (bc, 0), A 는 ∠B 쪽, D 는 AC 의 반대쪽(삼각형 ACD 의 세 변으로)
      const Bm = [0, 0], Cm = [bc, 0], Am = polar(Bm, ab, th), ac = Math.sqrt(ac2), ux = (Cm[0] - Am[0]) / ac, uy = (Cm[1] - Am[1]) / ac;
      const xD = (ad * ad - cd * cd + ac2) / (2 * ac), yD = Math.sqrt(Math.max(0, ad * ad - xD * xD));
      const nrm = [-uy, ux], sideB = (Bm[0] - Am[0]) * nrm[0] + (Bm[1] - Am[1]) * nrm[1], sgn = sideB > 0 ? -1 : 1;
      const Dm = [Am[0] + ux * xD + nrm[0] * yD * sgn, Am[1] + uy * xD + nrm[1] * yD * sgn];
      const f = pic({ A: Am, B: Bm, C: Cm, D: Dm }, { polys: [['A', 'B', 'C', 'D']], cuts: [['A', 'C']], angs: [['B', 'C', 'A', dg(th)], ['D', 'A', 'C', dg(Dv)]], sides: [['A', 'B', String(ab), 'C'], ['B', 'C', String(bc), 'A'], ['A', 'D', String(ad), 'C']], size: [190, 140] });
      return aRadFr(`그림과 같은 사각형 ABCD에서 ${eqh(SG('AB'), ab)}, ${eqh(SG('BC'), bc)}, ${eqh(SG('AD'), ad)}, ${eqh('∠ABC', dg(th))}, ${eqh('∠ADC', dg(Dv))}일 때, 사각형 ABCD의 넓이는?`, S, '', {
        figure: f.b.svg(`사각형 ABCD와 대각선 AC. AB의 길이는 ${ab}, BC의 길이는 ${bc}, AD의 길이는 ${ad}, ∠B = ${th}°, ∠D = ${Dv}°`),
        explain: `삼각형 ABC에서 코사인법칙에 의하여 ${sqH(SG('AC'))} = ${ab}${sup(2)} + ${bc}${sup(2)} − 2 × ${ab} × ${bc} × ${cosD(th)} = ${ac2}이다. ${eqh(SG('CD'), V('x'))}라 하면 삼각형 ACD에서 ${nb(ac2 + ' = ' + ad + sup(2) + ' + ' + V('x') + sup(2) + ' − 2 × ' + ad + ' × ' + V('x') + ' × ' + cosD(Dv))}이고 이 이차방정식의 양수인 근은 ${cd}이다. 넓이는 ${areaTold(K(ab), K(bc), th)} + ${areaTold(K(ad), K(cd), Dv)} = ${sh(S)}이다.`
      });
    })
  ];

  B.addTypes(UNIT, 'shape', shapeTypes);
  B.addTypes(UNIT, 'area', areaTypes);
  B.addTypes(UNIT, 'quad', quadTypes);
  B.kit.u14xb = { KINDS, triOf, holdsFor, plainFails, PERMS, permKind, shapeQ, sR, cosOf, triArea, areaTold, heron2, aRatioQ, paraPic };
})(typeof window !== 'undefined' ? window : globalThis);
