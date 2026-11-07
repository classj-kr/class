// 고등학교 대수 Ⅱ-2 사인법칙과 코사인법칙 — 실력 문제.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - sin B = 1/2 이면 B = 30° 라고만 생각한다(0° < B < 180° 에서는 30° 와 150° 둘이다). 거꾸로, 이미 둔각이 있거나 「둔각삼각형」이라는 조건이 있으면 하나만 남는다는 것을 놓친다.
//  - a/sin A 가 외접원의 반지름이라고 생각한다(지름 2R 이다).
//  - 15°·75°·105° 처럼 sin 값을 모르는 각이 나오면 막힌다 — 수선을 내려 길이를 더하거나 빼면 된다.
//  - 움직이는 점이 만드는 비(BP/sin θ)를 사인법칙으로 한 선분으로 바꾸어 볼 줄 모른다.
//  - a cos A + b cos B = c cos C 같은 식에서 한 경우만 답한다(두 경우가 모두 답이다).
// 실력에 둔 것은 ① 상황에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것뿐이다. 대조표에 ①·②로 적었다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, D, C, inline } = B.kit;
  const { gcd, nb, tail, V, sup, rt, SG } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, sv } = B.kit.mgeo;
  const { trig, sub: hsub } = B.kit.hs;
  const {
    UNIT, STD, K, KR, KF, add, neg, sbt, mul, div, sqrtV, sq, fv, same, isK, isRF, isInt, isRat, isSum, half, SIN, COS,
    sh, L, plainV, sqH, pq, pm, vA, vB, vC, va, vb, vc, vR, vS, AV, SVv, eqh, dg, sinH, cosH, sinD, cosD, TRI, others,
    calcOf, seal, more, aRad, aRadFr, aSum, aInt, aQ, aDeg, pickNum, pic, polar, onC, outward, sssABC, angABC, r2, tailDec
  } = B.kit.u14x;
  const { KINDS, triOf, holdsFor, plainFails, PERMS, triArea, areaTold } = B.kit.u14xb;
  const H = (id, title, ref, make, more2) => Object.assign({ id, level: '실력', title, source: (/심/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')', make }, more2 || {});

  const hardTypes = [
    // ① 뜻 — sin 값 하나에 각이 둘. 이미 둔각이 있으니 하나만 남는다.
    H('hard-ssa', '두 변과 한 변의 대각(둔각)으로 나머지 변·각 구하기 — sin 값의 두 각 가운데 하나', '①5', (d, n) => {
      if (n === 0) {
        // A = 120°, a = k√3, b = k → sin B = 1/2, B = 150° 이면 A + B > 180° 이므로 B = 30°, C = 30° → c = b
        const k = d.int(2, 9), P = d.pick(PERMS), Lx = { a: P[0], b: P[1], c: P[2] };
        const aV = KR(k, 3), bV = K(k);
        return aInt(`${TRI}에서 ${eqh(SVv[Lx.a], sh(aV))}, ${eqh(SVv[Lx.b], k)}, ${eqh(AV[Lx.a], '120°')}일 때, ${SVv[Lx.c]}의 값은?`, bV, '', {
          explain: `사인법칙에 의하여 ${frac(sh(aV), sinD(120))} = ${frac(k, sinH(AV[Lx.b]))}이므로 ${eqh(sinH(AV[Lx.b]), frac(1, 2))}이다. ${AV[Lx.b]} = 150°이면 ${AV[Lx.a]} + ${AV[Lx.b]} &gt; 180°이므로 ${eqh(AV[Lx.b], '30°')}이고 ${eqh(AV[Lx.c], '180° − (120° + 30°)')} = 30°이다. 두 각이 같으므로 ${eqh(SVv[Lx.c], SVv[Lx.b])} = ${k}이다.`
        });
      }
      // n = 1: B 가 둔각, b, c → sin C → C(둔각이 될 수 없다) → A
      const [Bv, Cv] = d.pick([[135, 30], [120, 30], [120, 45]]), k = d.int(2, 8), P = d.pick(PERMS), Lx = { a: P[0], b: P[1], c: P[2] };
      const cV = Cv === 45 ? K(2 * k) : K(k), bV = div(mul(cV, SIN[Bv]), SIN[Cv]), Av = 180 - Bv - Cv;
      if (!isK(bV)) throw new Error('b 가 k√m 꼴이 아니다');
      return aDeg(`${TRI}에서 ${eqh(SVv[Lx.b], sh(bV))}, ${eqh(SVv[Lx.c], sh(cV))}, ${eqh(AV[Lx.b], dg(Bv))}일 때, ${AV[Lx.a]}의 크기는?`, Av, `180-${Bv}-${Cv}`, {
        explain: `사인법칙에 의하여 ${frac(sh(bV), sinD(Bv))} = ${frac(sh(cV), sinH(AV[Lx.c]))}이므로 ${eqh(sinH(AV[Lx.c]), sh(SIN[Cv]))}이다. ${AV[Lx.b]}가 둔각이므로 ${AV[Lx.c]}는 예각이고 ${eqh(AV[Lx.c], dg(Cv))}이다. 따라서 ${eqh(AV[Lx.a], '180° − (' + dg(Bv) + ' + ' + dg(Cv) + ')')} = ${dg(Av)}이다.`
      });
    }, { count: 2 }),
    // ① 뜻 — 움직이는 비를 사인법칙으로 한 선분(AP)으로 바꾸고, 가장 짧은 AP 는 수선
    H('hard-min-ratio', '변 위를 움직이는 점 P에 대한 BP/sin θ의 최솟값', '①15', (d) => {
      const [Bv, Cv, m] = d.pick([[45, 60, 6], [60, 45, 6], [30, 60, 3], [60, 30, 3], [30, 45, 2], [45, 30, 2]]), k = d.int(2, 8), AC = KR(k, m), Av = 180 - Bv - Cv;
      const APmin = mul(AC, SIN[Cv]), ans = div(APmin, SIN[Bv]);
      if (!isInt(ans)) throw new Error('최솟값이 자연수가 아니다');
      const mdl = angABC(Av, Bv, Cv), t = 0.38; mdl.P = [mdl.B[0] + (mdl.C[0] - mdl.B[0]) * t, 0];
      const th = V('θ');
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['A', 'P']], angs: [['B', 'C', 'A', dg(Bv)], ['A', 'B', 'P', sv('θ'), { r: 24 }]], nameAt: { P: 270 }, size: [200, 120] });
      return aInt(`그림과 같이 ${eqh(vA, dg(Av))}, ${eqh(vB, dg(Bv))}, ${eqh(SG('AC'), sh(AC))}인 ${TRI}에서 변 BC 위의 한 점 P에 대하여 ${eqh('∠BAP', th)}라 할 때, ${frac(SG('BP'), sinH(th))}의 최솟값은?`, ans, '', {
        figure: f.b.svg(`삼각형 ABC와 변 BC 위의 점 P, 선분 AP. ∠B = ${Bv}°, ∠BAP = θ`),
        explain: `삼각형 ABP에서 사인법칙에 의하여 ${frac(SG('BP'), sinH(th))} = ${frac(SG('AP'), sinD(Bv))}이므로 AP가 가장 짧을 때 최소이다. 점 A에서 변 BC에 내린 수선이 가장 짧고, ${eqh('∠C', dg(Cv))}이므로 그때 ${eqh(SG('AP'), SG('AC') + ' ' + sinD(Cv))} = ${sh(APmin)}이다. 따라서 최솟값은 ${frac(sh(APmin), sinD(Bv))} = ${sh(ans)}이다.`
      });
    }),
    // ① 뜻 — 15°(또는 75°·105°)의 sin 값을 몰라도 수선을 내려 b cos C ± c cos B 로 구한다
    H('hard-15deg', 'sin 값을 모르는 각이 든 삼각형의 변 — 수선으로 나누어 구하기', '①17', (d) => {
      const [Bv, Cv] = d.pick([[120, 45], [135, 30], [60, 45], [45, 60], [30, 45], [45, 30]]), R = d.pick([2, 4, 6]), Av = 180 - Bv - Cv;
      const bV = mul(K(2 * R), SIN[Bv]), cV = mul(K(2 * R), SIN[Cv]);
      // a = b cos C + c cos B (cos B 가 음수이면 빼는 셈이 된다)
      const aV = add(mul(bV, COS[Cv]), mul(cV, COS[Bv]));
      const r6 = KR(1, 6), r2v = KR(1, 2), hR = K(R / 2);
      const cands = [aV, mul(hR, add(r6, r2v)), mul(hR, sbt(r6, r2v)), fv(sbt(bV, cV)) < 0 ? sbt(cV, bV) : sbt(bV, cV), mul(hR, sbt(KR(2, 3), r2v)), mul(hR, add(KR(1, 3), K(1))), mul(hR, sbt(KR(1, 3), K(1)))];
      const opts = [];
      for (const c of cands) if (c.length && fv(c) > 0 && !opts.some((o) => Math.abs(o.v - fv(c)) < 1e-9) && opts.length < 5) opts.push({ h: sh(c), v: fv(c) });
      if (opts.length < 5) throw new Error('보기가 모자란다');
      const obtuse = Bv > 90, tell = obtuse
        ? `점 A에서 변 CB의 연장선에 수선 AH를 내리면 ${eqh(SG('CH'), sh(bV) + ' ' + cosD(Cv))}, ${eqh(SG('BH'), sh(cV) + ' ' + cosD(180 - Bv))}이고 ${eqh(va, SG('CH') + ' − ' + SG('BH'))}이다.`
        : `점 A에서 변 BC에 수선 AH를 내리면 ${eqh(SG('BH'), sh(cV) + ' ' + cosD(Bv))}, ${eqh(SG('CH'), sh(bV) + ' ' + cosD(Cv))}이고 ${eqh(va, SG('BH') + ' + ' + SG('CH'))}이다.`;
      const mdl = Object.assign({ O: [0, 0] }, (() => { const t = angABC(Av, Bv, Cv); const cx = t.C[0] / 2, cy = (t.A[0] * t.A[0] + t.A[1] * t.A[1] - t.C[0] * t.A[0]) / (2 * t.A[1]); return { A: [t.A[0] - cx, t.A[1] - cy], B: [-cx, -cy], C: [t.C[0] - cx, -cy] }; })());
      const f = pic(mdl, { circle: ['O', 1], polys: [['A', 'B', 'C']], names: ['A', 'B', 'C', 'O'], nameAt: Object.assign(outward(mdl, ['A', 'B', 'C']), { O: 90 }), size: [150, 150] });
      f.b.dot(f.P.O);
      return pickNum(d, `그림과 같이 중심이 O이고 반지름의 길이가 ${R}인 원에 내접하는 ${TRI}에서 ${eqh(vB, dg(Bv))}, ${eqh(vC, dg(Cv))}일 때, ${va}의 값은?`, opts, fv(aV), {
        figure: f.b.svg(`중심이 O이고 반지름의 길이가 ${R}인 원에 내접하는 삼각형 ABC. ∠B = ${Bv}°, ∠C = ${Cv}°`),
        explain: `사인법칙에 의하여 ${eqh(vb, '2 × ' + R + ' × ' + sinD(Bv))} = ${sh(bV)}, ${eqh(vc, '2 × ' + R + ' × ' + sinD(Cv))} = ${sh(cV)}이다. ${eqh(vA, dg(Av))}의 sin 값은 모르므로 ${tell} 따라서 ${eqh(va, sh(aV))}이다.`
      });
    }),
    // ② 세 단계 넘게 — 삼각형 셋을 차례로 이어 사인법칙을 쓴다
    H('hard-survey', '삼각 측량 — 사인법칙을 이어 써서 먼 두 지점 사이의 거리 구하기', '①14', (d) => {
      // △ABC: AB, ∠A, ∠B → BC / △BCD: ∠BCD = 90°, ∠CBD = 45° → CD = BC / △CDE: ∠DCE = 64°, ∠CDE = 79° → ∠E = 37° → DE
      const [aA, aB, AB] = d.pick([[45, 75, 20], [45, 75, 60]]), aC = 180 - aA - aB;   // 답이 100보다 작은 소수 첫째 자리 수가 되는 것(∠A = 60° 인 꼴은 그림에서 A, B 의 각 글이 겹쳐 뺐다)
      const BCx = div(mul(K(AB), SIN[aA]), SIN[aC]);   // k√6
      const ans = Math.round(fv(BCx) / Math.sqrt(6) * 2.45 * 0.9 / 0.6 * 1000) / 1000;
      if (Math.abs(ans * 10 - Math.round(ans * 10)) > 1e-9 || Number.isInteger(ans)) throw new Error('답이 소수 첫째 자리가 아니다');
      // 그림(실제 각으로 그린다)
      const P0 = { A: [0, 0], B: [1, 0] }, Cm = polar([0, 0], Math.sin(aB * RAD) / Math.sin(aC * RAD), aA);
      const vBC = [Cm[0] - 1, Cm[1]], Dm = [Cm[0] + vBC[1], Cm[1] - vBC[0]];   // C 에서 CB 를 시계 반대쪽으로 90° 돌린 쪽
      const cd = Math.hypot(Dm[0] - Cm[0], Dm[1] - Cm[1]), ce = cd * Math.sin(79 * RAD) / Math.sin(37 * RAD), dirCD = Math.atan2(Dm[1] - Cm[1], Dm[0] - Cm[0]) / RAD;
      const Em = polar(Cm, ce, dirCD + 64);
      const mdl = { A: P0.A, B: P0.B, C: Cm, D: Dm, E: Em };
      const f = pic(mdl, { polys: [['A', 'B', 'C'], ['B', 'D', 'C'], ['C', 'D', 'E']], rights: [['C', 'B', 'D']], angs: [['A', 'B', 'C', dg(aA)], ['B', 'C', 'A', dg(aB)], ['B', 'D', 'C', '45°'], ['C', 'D', 'E', '64°'], ['D', 'E', 'C', '79°']], sides: [['A', 'B', AB + ' m', 'C']], size: [180, 230] });
      return seal(D(`그림은 다섯 지점 A, B, C, D, E를 정하고 각의 크기와 두 지점 A, B 사이의 거리를 재어 나타낸 것이다. ${eqh(SG('AB'), AB + ' m')}일 때, 두 지점 D, E 사이의 거리는 몇 m인가? (단, ${eqh(sinD(37), '0.6')}, ${eqh(sinD(64), '0.9')}, ${nb(rt(6) + ' = 2.45' + tailDec(2.45, '으로/로'))} 계산한다.)`, ans, {
        unit: 'm', figure: f.b.svg(`다섯 지점 A, B, C, D, E를 이은 삼각형 ABC, BDC, CDE. AB의 길이는 ${AB} m, ∠CAB = ${aA}°, ∠ABC = ${aB}°, ∠BCD = 90°, ∠CBD = 45°, ∠DCE = 64°, ∠CDE = 79°`),
        explain: `삼각형 ABC에서 ${eqh('∠ACB', '180° − (' + dg(aA) + ' + ' + dg(aB) + ')')} = ${dg(aC)}이므로 사인법칙에 의하여 ${eqh(SG('BC'), frac(AB + ' ' + sinD(aA), sinD(aC)))} = ${L(BCx, 'm')}이다. 삼각형 BCD는 ${eqh('∠BCD', '90°')}, ${eqh('∠CBD', '45°')}인 직각이등변삼각형이므로 ${eqh(SG('CD'), SG('BC'))} = ${L(BCx, 'm')}이다. 삼각형 CDE에서 ${eqh('∠CED', '180° − (64° + 79°)')} = 37°이므로 사인법칙에 의하여 ${eqh(SG('DE'), frac(SG('CD') + ' ' + sinD(64), sinD(37)))} = ${frac(sh(BCx) + ' × 0.9', '0.6')}이고 ${rt(6)} = 2.45로 셈하면 ${ans} m이다.`,
        facts: { calc: [[`${calcOf(div(BCx, KR(1, 6))[0])}*2.45*0.9/0.6`, 0]] }
      }));
    }),
    // ② 세 단계 넘게 + 두 경우 — 사차식을 묶어 두 경우를 모두 남긴다
    H('hard-shape-two', '변의 관계식에서 두 경우가 나오는 삼각형의 모양', '②4', (d) => {
      const P = d.pick(PERMS), Lx = { a: P[0], b: P[1], c: P[2] };
      const T3 = (t) => ({ a: t[Lx.a], b: t[Lx.b], c: t[Lx.c], A: t[Lx.a.toUpperCase()], B: t[Lx.b.toUpperCase()], C: t[Lx.c.toUpperCase()] });
      const eq = (t0) => { const t = T3(t0); return t.a * Math.cos(t.A) + t.b * Math.cos(t.B) - t.c * Math.cos(t.C); };
      const hold = holdsFor(eq);
      if (hold.length !== 2 || !plainFails(eq)) throw new Error('두 경우가 아니다: ' + hold.join());
      const up = (l) => Lx[l].toUpperCase(), pair = (x, y) => [x, y].sort().join('') === 'ac' ? 'ca' : [x, y].sort().join('');
      // 보기: 한 경우씩, 두 경우, 이등변과 직각을 섞은 것
      const sets = [hold, [hold[0]], [hold[1]], [up('c')], [pair(Lx.a, Lx.b), up('c')]].map((s) => s.slice().sort());
      const label = (s) => s.map((k) => KINDS[k].h()).join(' 또는 ');
      const key = (s) => s.join('|'), seen = new Set(), opts = [];
      for (const s of sets) if (!seen.has(key(s))) { seen.add(key(s)); opts.push(s); }
      if (opts.length !== 5) throw new Error('보기가 다섯이 아니다');
      const truth = opts.map((s) => key(s) === key(hold.slice().sort()));
      const rows = d.shuffle(opts.map((s, i) => [s, truth[i]]));
      const v = (l) => SVv[Lx[l]], A = (l) => AV[Lx[l]];
      const cf = (x, y, z) => frac(sqH(y) + ' + ' + sqH(z) + ' − ' + sqH(x), '2' + y + z);
      return seal(C(`${TRI}에서 등식 ${nb(v('a') + ' ' + cosH(A('a')) + ' + ' + v('b') + ' ' + cosH(A('b')) + ' = ' + v('c') + ' ' + cosH(A('c')))}가 성립할 때, ${TRI}는 어떤 삼각형인가?`, rows.map((r) => label(r[0])), rows.findIndex((r) => r[1]), {
        explain: `코사인법칙에 의하여 ${eqh(cosH(A('a')), cf(v('a'), v('b'), v('c')))} 따위를 넣고 양변에 2${v('a')}${v('b')}${v('c')}를 곱하면 ${nb(sqH(v('a')) + '(' + sqH(v('b')) + ' + ' + sqH(v('c')) + ' − ' + sqH(v('a')) + ') + ' + sqH(v('b')) + '(' + sqH(v('c')) + ' + ' + sqH(v('a')) + ' − ' + sqH(v('b')) + ') = ' + sqH(v('c')) + '(' + sqH(v('a')) + ' + ' + sqH(v('b')) + ' − ' + sqH(v('c')) + ')')}이다. 정리하면 ${nb('(' + sqH(v('a')) + ' − ' + sqH(v('b')) + ')' + sup(2) + ' − ' + v('c') + sup(4) + ' = 0')}, 곧 ${nb('(' + sqH(v('a')) + ' − ' + sqH(v('b')) + ' − ' + sqH(v('c')) + ')(' + sqH(v('a')) + ' − ' + sqH(v('b')) + ' + ' + sqH(v('c')) + ') = 0')}이므로 ${nb(sqH(v('a')) + ' = ' + sqH(v('b')) + ' + ' + sqH(v('c')))} 또는 ${nb(sqH(v('b')) + ' = ' + sqH(v('c')) + ' + ' + sqH(v('a')))}이다. 따라서 ${label(hold.slice().sort())}이다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      }));
    }),
    // ① 뜻 — 「둔각삼각형」이라는 조건으로 sin 값의 두 각 가운데 하나를 버린다
    H('hard-obtuse-area', '둔각삼각형이라는 조건으로 각을 골라 넓이 구하기', '②11', (d) => {
      // B = 30°, a = r√3, R = r → sin A = √3/2 → A = 60° 이면 C = 90°(직각삼각형) → A = 120°, C = 30°, c = b = r
      const r = 2 * d.int(1, 6), P = d.pick(PERMS), Lx = { a: P[0], b: P[1], c: P[2] };
      const aV = KR(r, 3), bV = K(r), S = mul(mul(mul(aV, bV), half(1)), SIN[30]);
      return aRad(`둔각삼각형 ABC에서 ${eqh(SVv[Lx.a], sh(aV))}, ${eqh(AV[Lx.b], '30°')}이고 외접원의 반지름의 길이가 ${r}일 때, ${TRI}의 넓이는?`, S, '', {
        explain: `사인법칙에 의하여 ${eqh(SVv[Lx.b], '2 × ' + r + ' × ' + sinD(30))} = ${r}, ${eqh(sinH(AV[Lx.a]), frac(sh(aV), '2 × ' + r))} = ${frac(rt(3), 2)}이므로 ${AV[Lx.a]} = 60° 또는 ${AV[Lx.a]} = 120°이다. ${AV[Lx.a]} = 60°이면 ${AV[Lx.c]} = 90°가 되어 둔각삼각형이 아니므로 ${eqh(AV[Lx.a], '120°')}, ${eqh(AV[Lx.c], '30°')}이다. 넓이는 ${frac(1, 2)} × ${sh(aV)} × ${r} × ${sinD(30)} = ${sh(S)}이다.`
      });
    }),
    // ① 뜻 — 넓이를 두 가지로(abc/4R, ½r(a + b + c)) 나타내어 잇는다
    H('hard-inradius', '외접원과 내접원의 반지름으로 식 나타내기', '②16', (d) => {
      const r = V('r'), R = vR;
      // 참값: 아무 삼각형에서 수로 셈해 견준다
      const t0 = triOf([47, 61, 72]), Rv = 1.7, t = { A: t0.A, B: t0.B, C: t0.C, a: 2 * Rv * t0.a, b: 2 * Rv * t0.b, c: 2 * Rv * t0.c }, per = t.a + t.b + t.c, Sv = t.a * t.b * t.c / (4 * Rv), rv = 2 * Sv / per, target = t.a * t.b * t.c / (Math.sin(t.A) + Math.sin(t.B) + Math.sin(t.C));   // 외접원의 반지름 1.7 인 삼각형
      const opts = [
        { h: nb('4' + r + R + sup(2)), v: 4 * rv * Rv * Rv },
        { h: nb('2' + r + R), v: 2 * rv * Rv },
        { h: nb('2' + r + sup(2) + R), v: 2 * rv * rv * Rv },
        { h: nb('4' + r + sup(2) + R), v: 4 * rv * rv * Rv },
        { h: nb('2' + r + R + sup(2)), v: 2 * rv * Rv * Rv }
      ];
      return pickNum(d, `${TRI}의 외접원과 내접원의 반지름의 길이를 각각 ${R}, ${r}라 할 때, ${frac(va + vb + vc, sinH(vA) + ' + ' + sinH(vB) + ' + ' + sinH(vC))}를 ${R}, ${r}로 나타낸 것은?`, opts, target, {
        explain: `${TRI}의 넓이를 ${vS}라 하면 사인법칙에 의하여 ${eqh(vS, frac(1, 2) + vb + vc + ' ' + sinH(vA))} = ${frac(va + vb + vc, '4' + R)}이므로 ${nb(va + vb + vc + ' = 4' + R + vS)}이다. 또 ${eqh(vS, frac(1, 2) + r + '(' + va + ' + ' + vb + ' + ' + vc + ')')}이므로 ${nb(va + ' + ' + vb + ' + ' + vc + ' = ' + frac('2' + vS, r))}이다. ${nb(sinH(vA) + ' + ' + sinH(vB) + ' + ' + sinH(vC) + ' = ' + frac(va + ' + ' + vb + ' + ' + vc, '2' + R))}이므로 구하는 식은 ${nb('4' + R + vS + ' × ' + frac('2' + R, va + ' + ' + vb + ' + ' + vc))} = ${nb('4' + R + vS + ' × ' + frac(R + r, vS))} = ${nb('4' + r + R + sup(2))}이다.`
      });
    }),
    // ② 세 단계 넘게 + ① — 대각선(코사인법칙) → 각(사인법칙, 45° 만 남음) → 직각 → 두 넓이
    H('hard-quad-sine', '대각선을 구하고 사인법칙으로 각을 구해 사각형의 넓이 구하기', '②23', (d) => {
      // AD = k(√6 − √2), DC = 2√2k, ∠BAD = 135°, ∠ADC = 120°, AB = m → AC = 2√3k, ∠CAD = 45°, ∠BAC = 90°
      const z = d.until(() => ({ k: d.int(1, 3), m: d.int(1, 9) }), (y) => y.m !== y.k);
      const { k, m } = z, AD = mul(K(k), sbt(KR(1, 6), KR(1, 2))), DC = KR(2 * k, 2), AC = KR(2 * k, 3);
      const S1 = mul(mul(K(m), AC), half(1)), S2 = mul(mul(mul(AD, DC), half(1)), SIN[120]), S = add(S1, S2);
      if (!isSum(S)) throw new Error('넓이가 a + b√c 꼴이 아니다');
      // 그림: A 원점, AD 는 오른쪽, AB 는 −135° 쪽, DC 는 D 에서 300° 쪽
      const ad = fv(AD), dc = fv(DC), Am = [0, 0], Dm = [ad, 0], Bm = polar(Am, m, -135), Cm = polar(Dm, dc, 300);
      const f = pic({ A: Am, B: Bm, C: Cm, D: Dm }, { polys: [['A', 'B', 'C', 'D']], sides: [['A', 'B', String(m), 'C']], size: [190, 150] });
      return aSum(`그림과 같은 사각형 ABCD에서 ${eqh(SG('AB'), m)}, ${eqh(SG('AD'), sh(AD))}, ${eqh(SG('DC'), sh(DC))}, ${eqh('∠BAD', '135°')}, ${eqh('∠ADC', '120°')}일 때, 사각형 ABCD의 넓이는?`, S, '', {
        figure: f.b.svg(`사각형 ABCD. AB의 길이는 ${m}, AD의 길이는 ${plainV(AD)}, DC의 길이는 ${plainV(DC)}, ∠A = 135°, ∠D = 120°`),
        explain: `대각선 AC를 그으면 삼각형 ACD에서 코사인법칙에 의하여 ${sqH(SG('AC'))} = ${sqH(pq(DC))} + ${sqH(pq(AD))} − 2 × ${pm(DC)} × ${pm(AD)} × ${cosD(120)} = ${sh(sq(AC))}이므로 ${eqh(SG('AC'), sh(AC))}이다. 사인법칙에 의하여 ${frac(sh(AC), sinD(120))} = ${frac(sh(DC), sinH('(∠CAD)'))}, ${eqh(sinH('(∠CAD)'), frac(rt(2), 2))}이고 ∠CAD는 60°보다 작으므로 ${eqh('∠CAD', '45°')}, ${eqh('∠BAC', '135° − 45°')} = 90°이다. 넓이는 ${frac(1, 2)} × ${m} × ${sh(AC)} + ${frac(1, 2)} × ${pm(AD)} × ${pm(DC)} × ${sinD(120)} = ${sh(S)}이다.`
      });
    }),
    // ② 세 단계 넘게 — 대각선 둘(코사인법칙 두 번)과 넓이를 두 가지로
    H('hard-para-angle', '평행사변형의 두 대각선이 이루는 각의 sin 값', '②24', (d) => {
      const z = d.until(() => ({ p: d.int(1, 6), q: d.int(2, 8), A: d.pick([60, 120]) }), (y) => { if (y.p >= y.q) return false; const c = y.A === 60 ? 1 : -1, v = KF(3 * y.p * y.p * y.q * y.q, (y.p * y.p + y.q * y.q + c * y.p * y.q) * (y.p * y.p + y.q * y.q - c * y.p * y.q)); return v[0].dv !== 1 && v[0].nv <= 999 && v[0].dv <= 999; });
      const { p, q, A } = z, cA = A === 60 ? 1 : -1;   // 2pq cos A = ±pq
      const BD2 = p * p + q * q - cA * p * q, AC2 = p * p + q * q + cA * p * q, ans = KF(3 * p * p * q * q, AC2 * BD2);
      if (ans[0].dv === 1) throw new Error('자연수');
      const mdl = { B: [0, 0], C: [q, 0], A: polar([0, 0], p, 180 - A) }; mdl.D = [mdl.A[0] + q, mdl.A[1]];
      const th = V('θ');
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['B', 'D']], angsBy: [['A', 'D', 'B', 'C', dg(A)]], sides: [['A', 'B', String(p), 'C'], ['A', 'D', String(q), 'B']], size: [190, 100] });
      return aQ(`그림과 같이 ${eqh(SG('AB'), p)}, ${eqh(SG('AD'), q)}, ${eqh('∠BAD', dg(A))}인 평행사변형 ABCD에서 두 대각선 AC, BD가 이루는 각의 크기를 ${th}라 할 때, ${trig('sin', th, 2)}의 값은?`, ans, {
        figure: f.b.svg(`평행사변형 ABCD와 두 대각선 AC, BD. AB의 길이는 ${p}, AD의 길이는 ${q}, ∠A = ${A}°`),
        explain: `평행사변형의 넓이는 ${p} × ${q} × ${sinD(A)} = ${sh(mul(K(p * q), SIN[A]))}이다. 삼각형 ABD에서 ${sqH(SG('BD'))} = ${p}${sup(2)} + ${q}${sup(2)} − 2 × ${p} × ${q} × ${cosD(A)} = ${BD2}이고, ${eqh('∠ADC', dg(180 - A))}이므로 삼각형 ACD에서 ${sqH(SG('AC'))} = ${q}${sup(2)} + ${p}${sup(2)} − 2 × ${q} × ${p} × ${cosD(180 - A)} = ${AC2}이다. 넓이는 ${nb(frac(1, 2) + ' × ' + SG('AC') + ' × ' + SG('BD') + ' × ' + sinH(th))}로도 나타낼 수 있으므로 ${eqh(sinH(th), frac('2 × ' + sh(mul(K(p * q), SIN[A])), rt(AC2) + ' × ' + rt(BD2)))}이고 ${trig('sin', th, 2)} = ${sh(ans)}이다.`,
        facts: { value: `3*${p}*${p}*${q}*${q}/((${p}*${p}+${q}*${q}+(${cA})*${p}*${q})*(${p}*${p}+${q}*${q}-(${cA})*${p}*${q}))` }
      });
    }),
    // ② 세 단계 넘게 — 코사인법칙 → sin(sin² + cos² = 1) → 사인법칙 → 넓이
    H('hard-circum-area', '두 변과 끼인각의 cos 값으로 외접원의 넓이 구하기', '②25', (d) => {
      const z = d.until(() => ({ a: d.int(2, 10), c: d.int(2, 10), q: d.int(3, 9), p: d.int(1, 8) * (d.bool() ? 1 : -1) }), (y) => {
        if (Math.abs(y.p) >= y.q || gcd(Math.abs(y.p), y.q) !== 1 || 2 * Math.abs(y.p) === y.q || y.a === y.c) return false;
        const b2 = y.a * y.a + y.c * y.c - 2 * y.a * y.c * y.p / y.q, b = Math.round(Math.sqrt(b2)); if (!Number.isInteger(b2) || b * b !== b2 || b < 2) return false;
        const k = KF(b2 * y.q * y.q, 4 * (y.q * y.q - y.p * y.p)); return k[0].dv !== 1 && k[0].nv <= 999 && k[0].dv <= 999;
      });
      const { a, c, q, p } = z, b2 = a * a + c * c - 2 * a * c * p / q, b = Math.sqrt(b2), cosV = KF(p, q), sinV = sqrtV(KF(q * q - p * p, q * q)), Rv = div(K(b), mul(K(2), sinV)), kV = KF(b2 * q * q, 4 * (q * q - p * p));
      return aQ(`${TRI}에서 ${eqh(va, a)}, ${eqh(vc, c)}이고 ${eqh(cosH(vB), sh(cosV))}이다. ${TRI}의 외접원의 넓이가 ${nb(V('k') + 'π')}일 때, 상수 ${V('k')}의 값은?`, kV, {
        explain: `코사인법칙에 의하여 ${sqH(vb)} = ${a}${sup(2)} + ${c}${sup(2)} − 2 × ${a} × ${c} × ${p < 0 ? '(' + sh(cosV) + ')' : sh(cosV)} = ${b2}이므로 ${eqh(vb, b)}이다. ${sinH(vB)} &gt; 0이므로 ${eqh(sinH(vB), rt('1 − (' + sh(KF(Math.abs(p), q)) + ')' + sup(2)))} = ${sh(sinV)}이고, 사인법칙에 의하여 ${eqh(vR, frac(vb, '2' + sinH(vB)))} = ${sh(Rv)}이다. 외접원의 넓이는 ${nb('π' + vR + sup(2))} = ${nb(sh(kV) + 'π')}이므로 ${eqh(V('k'), sh(kV))}이다.`,
        facts: { value: `(${a}*${a}+${c}*${c}-2*${a}*${c}*(${p})/${q})*${q}*${q}/(4*(${q}*${q}-(${p})*(${p})))` }
      });
    }),
    // ② 세 단계 넘게 — 각의 이등분선의 성질 → 코사인법칙 → 사인법칙 → 넓이
    H('hard-bisector-circle', '각의 이등분선이 만든 삼각형의 외접원의 넓이 구하기', '②26', (d) => {
      const z = d.until(() => ({ p: d.int(1, 8), q: d.int(1, 8), A: d.pick([60, 120]) }), (y) => {
        if (y.p === y.q) return false; const bc2 = y.p * y.p + y.q * y.q - (y.A === 60 ? 1 : -1) * y.p * y.q;
        const pc2 = KF(bc2 * y.q * y.q, (y.p + y.q) * (y.p + y.q)), k = y.A === 60 ? pc2 : mul(pc2, KF(1, 3)); return k[0].dv !== 1 && k[0].nv <= 999 && k[0].dv <= 999;
      });
      const { p, q, A } = z, bc2 = p * p + q * q - (A === 60 ? 1 : -1) * p * q, pc2 = KF(bc2 * q * q, (p + q) * (p + q)), half2 = A / 2, kV = A === 60 ? pc2 : mul(pc2, KF(1, 3));
      const bcV = sqrtV(K(bc2)), pcV = sqrtV(pc2);
      return aQ(`${TRI}에서 ${eqh(SG('AB'), p)}, ${eqh(SG('AC'), q)}, ${eqh('∠BAC', dg(A))}이다. ∠BAC의 이등분선이 변 BC와 만나는 점을 P라 할 때, 삼각형 APC의 외접원의 넓이는 ${nb(V('k') + 'π')}이다. 상수 ${V('k')}의 값은?`, kV, {
        explain: `각의 이등분선의 성질에 의하여 ${nb(SG('BP') + ' : ' + SG('PC') + ' = ' + p + ' : ' + q)}이다. 코사인법칙에 의하여 ${sqH(SG('BC'))} = ${p}${sup(2)} + ${q}${sup(2)} − 2 × ${p} × ${q} × ${cosD(A)} = ${bc2}이므로 ${eqh(SG('BC'), sh(bcV))}이고 ${eqh(SG('PC'), sh(bcV) + ' × ' + frac(q, p + q))} = ${sh(pcV)}이다. 삼각형 APC에서 ${eqh('∠PAC', dg(half2))}이므로 외접원의 반지름의 길이를 ${vR}라 하면 사인법칙에 의하여 ${eqh('2' + vR, frac(SG('PC'), sinD(half2)))}이고 ${nb(vR + sup(2))} = ${sh(kV)}이다. 따라서 ${eqh(V('k'), sh(kV))}이다.`,
        facts: { value: `(${p}*${p}+${q}*${q}-(${A === 60 ? 1 : -1})*${p}*${q})*${q}*${q}/((${p}+${q})*(${p}+${q}))${A === 60 ? '' : '/3'}` }
      });
    }),
    // ② 세 단계 넘게 + ① 두 변의 곱만으로 넓이 — 2024학년도 수능 13번의 꼴
    H('hard-ratio-radius', '넓이의 비와 두 변의 곱으로 외접원의 반지름과 사인의 비 구하기', '심1', (d) => {
      // AB = p, ∠BAC = π/3, BC² = p² + x² − px → AC = x. AD × CD = m, S₂ = t S₁ → sin(∠ADC) = t(√3/2)px/m → R/sin(∠ADC) = 2m²/(3t²p²x)
      const z = d.until(() => ({ p: d.int(2, 6), x: d.int(2, 8), m: d.int(4, 20), tn: d.int(1, 9), td: d.int(2, 9) }), (y) => {
        if (y.p === y.x || gcd(y.tn, y.td) !== 1 || y.tn >= y.td) return false;
        const bc2 = y.p * y.p + y.x * y.x - y.p * y.x; if (Number.isInteger(Math.sqrt(bc2))) return false;
        const s = (y.tn / y.td) * (Math.sqrt(3) / 2) * y.p * y.x / y.m; if (s >= 0.97 || s < 0.2) return false;
        // 이차방정식 x² − px + p² − BC² = 0 의 양수인 근이 x 하나뿐(다른 근은 음수)
        // 삼각형 ACD 가 있으려면 AC² ≥ 2·AD·CD(1 − cos D)(D 가 예각일 때)
        if (y.x * y.x < 2 * y.m * (1 - Math.sqrt(1 - s * s)) + 0.5) return false;
        const v = KF(2 * y.m * y.m * y.td * y.td, 3 * y.tn * y.tn * y.p * y.p * y.x);
        return y.p * y.p - bc2 < 0 && v[0].dv !== 1 && v[0].nv <= 999 && v[0].dv <= 999;
      });
      const { p, x, m, tn, td } = z, bc2 = p * p + x * x - p * x, S1 = mul(mul(K(p * x), half(1)), SIN[60]), sD = mul(mul(KF(tn, td), S1), KF(2, m)), ans = KF(2 * m * m * td * td, 3 * tn * tn * p * p * x);
      const pi3 = frac('π', 3), bcV = sqrtV(K(bc2));
      return aQ(`사각형 ABCD에서 ${eqh(SG('AB'), p)}, ${eqh(SG('BC'), sh(bcV))}, ${nb(SG('AD') + ' × ' + SG('CD') + ' = ' + m)}, ${eqh('∠BAC', pi3)}이다. 삼각형 ABC의 넓이를 ${vS + hsub(1)}, 삼각형 ACD의 넓이를 ${vS + hsub(2)}라 하고, 삼각형 ACD의 외접원의 반지름의 길이를 ${vR}라 하자. ${nb(vS + hsub(2) + ' = ' + frac(tn, td) + vS + hsub(1))}일 때, ${frac(vR, sinH('(∠ADC)'))}의 값은?`, ans, {
        explain: `${eqh(SG('AC'), V('x'))}라 하면 삼각형 ABC에서 코사인법칙에 의하여 ${nb(bc2 + ' = ' + p + sup(2) + ' + ' + V('x') + sup(2) + ' − 2 × ' + p + ' × ' + V('x') + ' × ' + cosH(pi3))}이고 양수인 근은 ${x}이다. ${vS + hsub(1)} = ${frac(1, 2)} × ${p} × ${x} × ${sinH(pi3)} = ${sh(S1)}이다. ${vS + hsub(2)} = ${frac(1, 2)} × ${SG('AD')} × ${SG('CD')} × ${sinH('(∠ADC)')} = ${frac(m, 2)} ${sinH('(∠ADC)')}이므로 ${eqh(sinH('(∠ADC)'), sh(sD))}이다. 사인법칙에 의하여 ${eqh('2' + vR, frac(SG('AC'), sinH('(∠ADC)')))}이므로 ${frac(vR, sinH('(∠ADC)'))} = ${frac(x, '2' + trig('sin', '(∠ADC)', 2))} = ${sh(ans)}이다.`,
        facts: { value: `2*${m}*${m}*${td}*${td}/(3*${tn}*${tn}*${p}*${p}*${x})` }
      });
    }),
    // ② 세 단계 넘게 + ① sin 값에서 45° 만 남음 — 2023년 3월 고3 학력평가 11번의 꼴
    H('hard-inner-point', '삼각형 안의 점으로 나뉜 삼각형의 넓이 구하기', '심2', (d) => {
      // ∠BAC = 60°, AB = 2√2k, BC = 2√3k, ∠PBC = 30°, ∠PCB = 15° → PC = √6k, AC = (√2 + √6)k, ∠ACB = 45° → ∠PCA = 30°
      const k = d.pick([2, 4, 6]), AB = KR(2 * k, 2), BC = KR(2 * k, 3), PC = KR(k, 6), AC = add(KR(k, 2), KR(k, 6));
      const S = mul(mul(mul(PC, AC), half(1)), SIN[30]);
      if (!isSum(S)) throw new Error('넓이 꼴');
      const mdl = angABC(60, 75, 45), Pm = (() => { const Bp = mdl.B, Cp = mdl.C, u = [Math.cos(30 * RAD), Math.sin(30 * RAD)], v2 = [-Math.cos(15 * RAD), Math.sin(15 * RAD)]; const det = u[0] * -v2[1] - u[1] * -v2[0], tt = ((Cp[0] - Bp[0]) * -v2[1] - (Cp[1] - Bp[1]) * -v2[0]) / det; return [Bp[0] + u[0] * tt, Bp[1] + u[1] * tt]; })();
      mdl.P = Pm;
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['P', 'B'], ['P', 'C'], ['P', 'A']], fills: [], angs: [['B', 'C', 'P', '', { r: 30, square: false }], ['C', 'P', 'B', '', { r: 34, square: false }]], angsBy: [['A', 'B', 'C', 'P', '60°']], size: [200, 140] });
      return aSum(`그림과 같이 ${eqh('∠BAC', '60°')}, ${eqh(SG('AB'), sh(AB))}, ${eqh(SG('BC'), sh(BC))}인 ${TRI}의 내부의 점 P에 대하여 ${eqh('∠PBC', '30°')}, ${eqh('∠PCB', '15°')}일 때, 삼각형 APC의 넓이는?`, S, '', {
        figure: f.b.svg(`삼각형 ABC와 그 내부의 점 P, 선분 PA, PB, PC. ∠BAC = 60°, ∠PBC = 30°, ∠PCB = 15°`),
        explain: `삼각형 PBC에서 ${eqh('∠BPC', '135°')}이므로 사인법칙에 의하여 ${eqh(SG('PC'), frac(sh(BC) + ' ' + sinD(30), sinD(135)))} = ${sh(PC)}이다. 삼각형 ABC에서 ${eqh(SG('AC'), V('x'))}라 하면 코사인법칙에 의하여 ${nb(sqH(pq(BC)) + ' = ' + sqH(pq(AB)) + ' + ' + V('x') + sup(2) + ' − 2 × ' + sh(AB) + ' × ' + V('x') + ' × ' + cosD(60))}이고 양수인 근은 ${sh(AC)}이다. 사인법칙에 의하여 ${frac(sh(BC), sinD(60))} = ${frac(sh(AB), sinH('(∠ACB)'))}, ${eqh(sinH('(∠ACB)'), frac(rt(2), 2))}인데 ∠BAC = 60°이므로 ∠ACB &lt; 120°이고 ${eqh('∠ACB', '45°')}이다. 따라서 ${eqh('∠PCA', '45° − 15°')} = 30°이고 넓이는 ${frac(1, 2)} × ${sh(PC)} × (${sh(AC)}) × ${sinD(30)} = ${sh(S)}이다.`
      });
    })
  ];

  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: STD, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
