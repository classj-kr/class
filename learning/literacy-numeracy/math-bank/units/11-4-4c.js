// 고등학교 기하 Ⅱ-1 공간도형(11-4-4) — 실력 묶음.
// 단원 틀·도구·싣는 기준·뺀 것은 11-4-4a.js 머리에 있다. 꼴마다의 판정은 references/textbooks/수학/_분석/11-4-4/싣기_대조표.md 에 있다.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 서로 다른 점·직선이 정하는 평면을 셀 때 같은 평면을 여러 번 센다(정육면체의 세 점과 두 직선 — 직선과 점 셋이 모두 한 평면 위에 있는 경우).
//  - 직선과 평면이 이루는 각과 평면 위의 직선이 이루는 각을 그대로 더하거나, cos 를 곱해야 할 자리에서 각을 곱한다(세 코사인).
//  - 이면각을 교선에 수직이 아닌 두 선분의 각으로 잰다. 정사영의 둘레·길이를 넓이처럼 cos θ 배로 셈한다.
//  - 반구·원기둥의 그림자를 한 덩어리의 정사영으로만 보고, 두 조각(반원과 반타원, 직사각형과 반원)으로 나누지 않는다.
// 실력에 둔 잣대: ① 그림·상황의 장치 때문에 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, lines, M, inline } = B.kit;
  const { nb, V, rt, grp, sqParts, SG } = B.kit.mid;
  const { RAD, Board } = B.kit.mgeo;
  const { jh } = B.kit.hs;
  const K = B.kit.u1144;
  const { UNIT, S1, S2, S3, num, rad, vmul, vdiv, vfl, veq, sqrtFrac, kindOf, vh, vt, seal, aInt, aFrac, aRad, aRadFrac, aSum, aPick, KS,
    sub3, add3, lerp3, avg3, lineRel, planeOf, onPlane, planeRel, cuboid, prismOf, circR, tetra, sp, fitU, solidFig, nameOf, saidOf, sg, vg, al, be, th, cosT, sinT, COS3, SIN3, TAN3, pick, H } = K;
  const rv = (n) => vh(sqrtFrac(n, 1));
  const rq = (n) => { const [s, m] = sqParts(n); return s === 1 ? String(m) : m === 1 ? `${s}**2` : `${s}**2*${m}`; };

  // 원(가로로 놓인): 앞쪽 반은 실선, 뒤쪽 반은 점선
  function ring(S, c, r, back) {
    const f = (t) => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), c[2]], t0 = Math.atan2(-S.view[0], S.view[1]);
    S.curve(f, t0, t0 + Math.PI, undefined, 40);
    S.curve(f, t0 - Math.PI, t0, back === 'solid' ? undefined : 'dash', 40);
    return t0;
  }

  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: S2, types: [
    H('hard-plane-count', '점과 직선으로 만들 수 있는 서로 다른 평면의 개수', '①2', (d, n) => {
      const s = n === 0 ? prismOf(3, circR(3, 4), 4) : cuboid(3, 3, 3), v = s.v;
      if (n === 1) s.word = 'cube';
      const names = Object.keys(v), pts = d.shuffle(names.slice()).slice(0, 3).sort();
      const lineCand = s.edges.concat(n === 1 ? ['DE', 'DF', 'BE', 'AF', 'CF', 'DB', 'EG', 'AG'] : []).filter((e) => !(pts.includes(e[0]) && pts.includes(e[1])));
      const lns = d.shuffle(lineCand.slice()).slice(0, n === 0 ? 1 : 2);
      if (lns.length === 2 && (lns[0] === lns[1] || lineRel(v[lns[0][0]], v[lns[0][1]], v[lns[1][0]], v[lns[1][1]]) === 'same')) return null;
      // 평면을 정하는 것: 세 점, 점과 그 점을 지나지 않는 직선, 만나거나 평행한 두 직선
      const tries = [];
      tries.push(['세 점 ' + pts.join(', '), planeOf(v[pts[0]], v[pts[1]], v[pts[2]])]);
      for (const p of pts) for (const e of lns) { const pl = planeOf(v[e[0]], v[e[1]], v[p]); tries.push([`점 ${jh(p, '과/와')} 직선 ${e}`, pl]); }
      if (lns.length === 2) { const [e, f] = lns, r = lineRel(v[e[0]], v[e[1]], v[f[0]], v[f[1]]); tries.push([`두 직선 ${e}, ${f}`, r === 'skew' ? null : planeOf(v[e[0]], v[e[1]], r === 'par' ? v[f[0]] : (onPlane(planeOf(v[e[0]], v[e[1]], v[f[0]]) || { n: [0, 0, 1], d: 1e9 }, v[f[1]]) ? v[f[0]] : v[f[1]]))]); }
      const found = [], flags = tries.map(([, pl]) => { if (!pl) return false; if (found.some((q) => planeRel(q, pl) === 'same')) return false; found.push(pl); return true; });
      if (flags.every(Boolean) || !flags.some(Boolean)) return null;
      const cnt = found.length;
      const text = n === 0
        ? `그림과 같은 ${nameOf(s)}에서 세 꼭짓점 ${pts.join(', ')}와 모서리 ${jh(lns[0], '으로/로')} 만들 수 있는 서로 다른 평면의 개수는? (세 점, 한 직선과 그 위에 있지 않은 한 점으로 정해지는 평면을 센다.)`
        : `그림과 같은 정육면체 ABCD-EFGH에서 세 점 ${pts.join(', ')}와 두 직선 ${lns[0]}, ${jh(lns[1], '으로/로')} 결정되는 서로 다른 평면의 개수는? (세 점, 한 직선과 그 위에 있지 않은 한 점, 만나거나 평행한 두 직선으로 정해지는 평면을 센다.)`;
      return K.aCount(text.replace(/ 개수는\?/, ' 개수는?'), flags, {
        figure: solidFig(s, saidOf(s), (S) => { for (const e of lns) S.edge(e); for (const p of pts) S.dot(p); }),
        explain: `정해지는 평면을 하나씩 세면 ${tries.length}가지이지만, 그 가운데 ${tries.filter((t, i) => !flags[i] && t[1]).length ? '같은 평면이 겹치는 것' : ''}${tries.some((t) => !t[1]) ? (tries.filter((t, i) => !flags[i] && t[1]).length ? '과 ' : '') + '꼬인 위치에 있어 평면을 정하지 못하는 것' : ''}을 빼면 서로 다른 평면은 ${cnt}개이다.`
      });
    }, { count: 2, standard: S1 }),
    H('hard-two-planes', '수직인 두 평면 위의 두 직각삼각형이 이루는 각', '①27', (d) => {
      // 평면 α(세운 평면) 위 직각삼각형 APB(∠B = 90°, ∠APB = a), 평면 β(바닥) 위 직각삼각형 PCD(∠D = 90°, ∠CPD = c), P·B·D 는 교선 위 → cos θ = cos a cos c
      const a = pick(d, [30, 45, 60]), c = pick(d, [30, 45, 60]), cosv = vmul(COS3[a], COS3[c]);
      const right = sqrtFrac(...(() => { const v2 = vmul(cosv, cosv)[0].q; return [v2.q - v2.p, v2.q]; })());
      const side = (ang) => (ang === 45 ? { hyp: rad(1, 2), adj: num(1), opp: num(1) } : ang === 60 ? { hyp: num(2), adj: num(1), opp: rad(1, 3) } : { hyp: num(2), adj: rad(1, 3), opp: num(1) });
      const sa = side(a), sc = side(c);
      const wrongs = d.shuffle([cosv, vmul(SIN3[a], SIN3[c]), sqrtFrac(...(() => { const v2 = vmul(vmul(SIN3[a], SIN3[c]), vmul(SIN3[a], SIN3[c]))[0].q; return [v2.q - v2.p, v2.q]; })()), SIN3[a], SIN3[c], COS3[a], num(1, 2), rad(1, 3, 2), rad(1, 2, 2), rad(1, 15, 4), rad(1, 13, 4)]);
      const pb = vfl(sa.adj), pd = vfl(sc.adj), ab = vfl(sa.opp), cd = vfl(sc.opp), sc0 = 1.6;
      if (Math.abs(pb - pd) < 1e-9) return null;
      const P0 = [0, 0, 0], B0 = [0, pb * sc0, 0], D0 = [0, pd * sc0, 0], A0 = [0, pb * sc0, ab * sc0], C0 = [cd * sc0, pd * sc0, 0], V0 = { k: 0.8, ang: 230 };
      const S = sp(Object.assign({ u: fitU([P0, B0, D0, A0, C0, [2.6, -0.6, 0], [0, 4, 2.4]], 200, 160, V0) }, V0)).put({ P: P0, B: B0, D: D0, A: A0, C: C0 });
      S.plane([1.2, 1.5, 0], [1.5, 0, 0], [0, 2.3, 0], K.ALPHA.replace('α', 'β'), 3);
      S.b.poly([[0, -0.6, 0], [0, 3.8, 0], [0, 3.8, 2.4], [0, -0.6, 2.4]].map(S.P), 'fill:rgba(251,191,36,0.10);stroke:#94a3b8;stroke-width:1.1');
      S.text([0, 3.5, 2.1], K.ALPHA);
      S.seg('P', 'A').seg('A', 'B').seg('P', 'D', 'thin').seg('P', 'C').seg('C', 'D').right('B', 'A', 'P').right('D', 'C', 'P');
      for (const k of 'PABCD') S.dot(k);
      S.name('P', 'P', 200).name('A', 'A', 90).name('B', 'B', 285).name('C', 'C', 250).name('D', 'D', 330);
      const figure = S.svg(`서로 수직인 두 평면 α(세운 평면), β(바닥) 위에 직각삼각형 APB(∠B = 90°)와 PCD(∠D = 90°)가 각각 놓여 있고, 세 점 P, B, D는 두 평면의 교선 위에 있다. PA = ${vt(sa.hyp)}, PB = ${vt(sa.adj)}, AB = ${vt(sa.opp)}, PC = ${vt(sc.hyp)}, PD = ${vt(sc.adj)}, CD = ${vt(sc.opp)}.`);
      return aPick(d, `그림과 같이 서로 수직인 두 평면 ${al}, ${be} 위에 ∠B = 90°인 직각삼각형 APB와 ∠D = 90°인 직각삼각형 PCD가 각각 놓여 있고, 세 점 P, B, D는 두 평면의 교선 위에 있다. ${vg('PA', vh(sa.hyp))}, ${vg('PB', vh(sa.adj))}, ${vg('PC', vh(sc.hyp))}, ${vg('PD', vh(sc.adj))}일 때, 두 직선 PA와 PC가 이루는 각의 크기를 ${th}라 하자. ${sinT}의 값은?`, right, wrongs, {
        figure, explain: `AB는 교선에 수직이고 두 평면이 수직이므로 AB ⊥ 평면 ${'β'}이다. B에서 PC에 내린 수선의 발을 H라 하면 삼수선 정리에 의하여 AH ⊥ PC이다. PH = PB cos(∠CPD) = PA cos(∠APB) cos(∠CPD)이므로 ${cosT} = cos ${a}° × cos ${c}° = ${vh(cosv)}, ${sinT} = √(1 − cos²θ) = ${vh(right)}이다.`
      });
    }, { standard: S2 }),
    H('hard-frustum', '원뿔대에서 삼수선 정리로 길이 구하기', '①28', (d) => {
      const R = d.int(4, 6), r = d.int(1, R - 2), h = d.int(2, 5), om = d.int(1, R - 1), am2 = R * R - om * om;
      const qm = r + om, ap2 = am2 + qm * qm + h * h;
      const ab = vmul(num(2), sqrtFrac(am2, 1));
      if (kindOf(ab) !== 'rad') return null;
      // 그림(눈어림 크기): 아랫밑면 중심 O, M 은 앞쪽, Q 는 뒤쪽(O 가 QM 위)
      const Rf = 2, rf = Rf * r / R, hf = 2.2, omf = Rf * om / R, amf = Math.sqrt(Rf * Rf - omf * omf);
      const O0 = [0, 0, 0], M0 = [omf, 0, 0], A0 = [omf, -amf, 0], B0 = [omf, amf, 0], Q0 = [-rf, 0, 0], P0 = [-rf, 0, hf], V0 = { k: 0.6, ang: 215 };
      const S = sp(Object.assign({ u: fitU([[0, -Rf, 0], [0, Rf, 0], [Rf, 0, 0], [-Rf, 0, 0], [0, 0, hf], [rf, 0, hf], [-rf, 0, hf]], 190, 160, V0) }, V0)).put({ O: O0, M: M0, A: A0, B: B0, Q: Q0, P: P0 });
      const t0 = ring(S, [0, 0, 0], Rf, 'dash');
      S.curve((u) => [rf * Math.cos(u), rf * Math.sin(u), hf], 0, 2 * Math.PI, undefined, 56);
      for (const u of [t0, t0 + Math.PI]) S.seg([rf * Math.cos(u), rf * Math.sin(u), hf], [Rf * Math.cos(u), Rf * Math.sin(u), 0]);
      S.seg('A', 'B', 'dash').seg('Q', 'M', 'dash').seg('P', 'Q', 'dash').seg('P', 'M', 'dash').seg('P', 'A', 'hld').right('Q', 'P', 'M').right('M', 'O', 'B');
      for (const k of 'OMABQP') S.dot(k);
      S.name('O', 'O', 120).name('M', 'M', 300).name('A', 'A', 230).name('B', 'B', 330).name('Q', 'Q', 150).name('P', 'P', 120);
      const figure = S.svg(`두 밑면의 반지름의 길이가 각각 ${r}, ${R}이고 높이가 ${h}인 원뿔대. 반지름의 길이가 ${r}인 밑면의 둘레 위의 점 P, P에서 다른 밑면에 내린 수선의 발 Q, 반지름의 길이가 ${R}인 밑면의 중심 O와 둘레 위의 두 점 A, B, 선분 AB의 중점 M.`);
      return aInt(`그림과 같이 두 밑면의 반지름의 길이가 각각 ${r}, ${R}이고 높이가 ${h}인 원뿔대가 있다. 반지름의 길이가 ${r}인 밑면의 둘레 위의 한 점 P에서 다른 밑면에 내린 수선의 발을 Q라 하자. 반지름의 길이가 ${R}인 밑면의 중심 O와 둘레 위의 두 점 A, B가 다음 조건을 만족시킬 때, ${nb(SG('AP') + '²')}의 값은?`, num(ap2), {
        figure: figure + lines([`(가) ${vg('AB', vh(ab))}`, '(나) 선분 AB의 중점 M에 대하여 점 O는 선분 QM 위에 있다.']),
        value: `${rq(4 * am2)}/4+(${r}+(${R}**2-${rq(4 * am2)}/4)**0.5)**2+${h}**2`,
        explain: `(나)에서 Q, O, M이 한 직선 위에 있고 OM ⊥ AB이므로 QM ⊥ AB이다. PQ ⊥ 밑면이므로 삼수선 정리에 의하여 PM ⊥ AB이다. AM = ${rv(am2)}, OM = √(${R * R} − ${am2}) = ${om}, QM = ${r} + ${om} = ${qm}, PM² = ${qm * qm} + ${h * h} = ${qm * qm + h * h}이므로 AP² = AM² + PM² = ${am2} + ${qm * qm + h * h} = ${ap2}이다.`
      });
    }, { standard: S2 }),
    H('hard-balls', '공 다섯 개를 넣은 상자의 부피', '①29', (d) => {
      const r = d.int(1, 6), x = K.norm([{ q: B.kit.mid.Q(32 * r ** 3), m: 1 }, { q: B.kit.mid.Q(16 * r ** 3), m: 2 }]);
      return aSum(`반지름의 길이가 ${r} cm인 공 4개를 서로 외접하면서 밑면이 정사각형인 상자의 옆면에 닿도록 바닥에 놓고, 그 위에 같은 크기의 공 1개를 아래 4개의 공에 닿도록 올린 뒤 상자의 뚜껑을 덮었더니 뚜껑이 위에 있는 공에 닿았다. 이 상자의 부피는 몇 cm³인가?`, x, {
        unit: 'cm³', calc: [[`(4*${r})**2*2*${r}`, 0], [`(4*${r})**2*${r}`, 1], ['2', 2]],
        explain: `상자의 밑면은 한 변이 ${4 * r} cm인 정사각형이다. 다섯 공의 중심을 이으면 모든 모서리가 ${2 * r} cm인 정사각뿔이 되고, 꼭짓점에서 밑면에 내린 수선의 발은 밑면의 중심이므로 높이는 √(${2 * r}² − (${2 * r}${rt(2)}/2)²) = ${vh(rad(r, 2))} cm이다. 상자의 높이는 ${2 * r} + ${vh(rad(r, 2))} (cm)이므로 부피는 ${(4 * r) ** 2} × (${2 * r} + ${vh(rad(r, 2))}) = ${vh(x)} (cm³)이다.`
      });
    }, { standard: S2 }),
    H('hard-cosrule', '세 변의 길이만 아는 사면체의 이면각', '②4', (d) => {
      const s = 2 * d.int(1, 3), p = d.int(s / 2 + 1, s + 3), q = d.int(2, s + 3);
      const om2 = p * p - s * s / 4, cm2 = 3 * s * s / 4, om = Math.sqrt(om2), cm = Math.sqrt(cm2);
      if (q === p || !(q > Math.abs(om - cm) + 0.3 && q < om + cm - 0.3)) return null;
      const top = 2 * p * p + s * s - 2 * q * q;
      if (top === 0) return null;
      const x = sqrtFrac(top * top, 3 * s * s * (4 * p * p - s * s));
      if (kindOf(x) !== 'radfrac' || x[0].q.q > 90 || x[0].m > 200) return null;
      const Bp = [0, -1.5, 0], Cp = [1.9, 0.4, 0], Ap = [-0.6, 1.6, 0], Op = [0.1, 0.1, 2.2], V0 = { k: 0.6, ang: 215 };
      const S = sp(Object.assign({ u: fitU([Ap, Bp, Cp, Op], 190, 150, V0) }, V0)).put({ O: Op, A: Ap, B: Bp, C: Cp, M: lerp3(Ap, Bp, 0.5) });
      S.seg('O', 'A').seg('O', 'B').seg('O', 'C').seg('A', 'B', 'dash').seg('B', 'C').seg('C', 'A', 'dash').seg('O', 'M', 'dash').seg('C', 'M', 'dash');
      S.len('O', 'A', String(p), 'C').len('O', 'B', String(p), 'C').len('O', 'C', String(q), 'A').len('B', 'C', String(s), 'O');
      S.name('O', 'O', 90).name('A', 'A', 160).name('B', 'B', 250).name('C', 'C', 330).dot('M').name('M', 'M', 200);
      const figure = S.svg(`사면체 OABC. OA = OB = ${p}, OC = ${q}, AB = BC = CA = ${s}. M은 모서리 AB의 중점이다.`);
      return aRadFrac(`그림과 같은 사면체 OABC에서 ${sg('OA', p)}, ${sg('OB', p)}, ${sg('OC', q)}, ${sg('AB', s)}, ${sg('BC', s)}, ${sg('CA', s)}이다. 평면 OAB와 평면 ABC가 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
        figure, sq: [`(2*${p}**2+${s}**2-2*${q}**2)**2`, `3*${s}**2*(4*${p}**2-${s}**2)`],
        explain: `AB의 중점을 M이라 하면 OA = OB, CA = CB이므로 OM ⊥ AB, CM ⊥ AB이고 두 평면이 이루는 각은 ∠OMC(또는 그 보각)이다. OM = ${rv(om2)}, CM = ${vh(rad(s, 3, 2))}, OC = ${q}이므로 코사인법칙에서 |cos(∠OMC)| = |OM² + CM² − OC²| ÷ (2 × OM × CM) = ${vh(x)}이다.`
      });
    }, { standard: S2 }),
    H('hard-tan2', '이면각과 내분점 — 다른 점에서 본 각', '②6', (d) => {
      const sd = d.pick([4, 6, 8]), [m, n] = pick(d, [[1, 3], [1, 2], [1, 4], [3, 1], [2, 1], [1, 5]]), phi = pick(d, [30, 45, 60]);
      const t2 = { 30: num(1, 3), 45: num(1), 60: num(3) }[phi];
      const ah2 = num(3 * sd * sd, 4), pa2 = vmul(ah2, t2), bd = num(sd * m, m + n), dh = K.vsub(bd, num(sd, 2)), ad2 = K.vadd(ah2, vmul(dh, dh)), x = vdiv(pa2, ad2);
      if (kindOf(x) !== 'frac' || veq(dh, [])) return null;
      // 밑면은 사면체 그림처럼 A 뒤, B 앞 왼쪽, C 오른쪽에 둔다(BC 가 앞쪽 변).
      const s0 = 3, R0 = s0 / Math.sqrt(3), A0 = K.onRing(R0, 200, 0), B0 = K.onRing(R0, 320, 0), C0 = K.onRing(R0, 80, 0), H0 = lerp3(B0, C0, 0.5), D0 = lerp3(B0, C0, m / (m + n));
      const P0 = [A0[0], A0[1], Math.min(2.1, vfl(sqrtFrac(...(() => { const q2 = pa2[0].q; return [q2.p, q2.q]; })())) * s0 / sd)], V0 = { k: 0.6, ang: 215 };
      const S = sp(Object.assign({ u: fitU([A0, B0, C0, P0, [2.6, -2.6, 0], [-2.4, 2.6, 0]], 200, 160, V0) }, V0)).put({ A: A0, B: B0, C: C0, H: H0, D: D0, P: P0 });
      S.plane([0.1, 0, 0], [2.1, 0, 0], [0, 2.5, 0], K.ALPHA, 1);
      S.face(['A', 'B', 'C']).seg('A', 'B').seg('B', 'C').seg('C', 'A').seg('P', 'A').seg('P', 'B').seg('P', 'C').seg('P', 'H', 'dash').seg('A', 'H', 'dash').seg('P', 'D', 'hl').seg('A', 'D', 'dash');
      S.right('A', 'P', 'B');
      for (const k of 'ABCDHP') S.dot(k);
      S.name('A', 'A', 140).name('B', 'B', 220).name('C', 'C', 340).name('D', 'D', 290).name('H', 'H', 300).name('P', 'P', 90);
      const figure = S.svg(`평면 α 위의 한 변의 길이가 ${sd}인 정삼각형 ABC, α 위에 있지 않은 점 P(P에서 α에 내린 수선의 발이 A), 선분 BC를 ${m} : ${josa(n, "으로/로")} 내분하는 점 D, BC의 중점 H.`);
      return aFrac(`그림과 같이 평면 ${al} 위에 한 변의 길이가 ${sd}인 정삼각형 ABC가 있다. 평면 ${al} 위에 있지 않은 한 점 P에서 평면 ${al}에 내린 수선의 발이 A이고, 평면 PBC와 평면 ${al}가 이루는 각의 크기가 ${phi}°이다. 선분 BC를 ${m} : ${josa(n, "으로/로")} 내분하는 점 D에 대하여 ∠PDA = ${th}라 할 때, ${nb('tan² ' + th)}의 값은?`, x, {
        figure, value: `(3*${sd}**2/4*${phi === 30 ? '1/3' : phi === 45 ? '1' : '3'})/(3*${sd}**2/4+(${sd}*${m}/(${m}+${n})-${sd}/2)**2)`,
        explain: `P에서 BC에 내린 수선의 발을 H라 하면 PA ⊥ α이므로 삼수선 정리에 의하여 AH ⊥ BC이고 H는 BC의 중점, ∠PHA = ${phi}°이다. AH = ${vh(rad(sd, 3, 2))}, PA = AH tan ${phi}°이므로 PA² = ${vh(pa2)}이다. BD = ${vh(bd)}, DH = ${vh(dh[0] && dh[0].q.p < 0 ? K.vsub([], dh) : dh)}, AD² = AH² + DH² = ${vh(ad2)}이므로 tan²θ = PA² ÷ AD² = ${vh(x)}이다.`
      });
    }, { standard: S2 }),
    H('hard-pqr', '정사면체 속 삼각형의 정사영의 넓이 — 내분점의 정사영', '②17', (d) => {
      const a = d.pick([3, 6, 9]), [p1, p2] = pick(d, [[1, 2], [2, 1], [1, 1]]), [q1, q2] = pick(d, [[2, 1], [1, 2], [1, 1]]);
      if (p1 === q1 && p2 === q2) return null;
      const p = num(p1, p1 + p2), q = num(q1, q1 + q2), coef = K.vadd(vmul(q, q), vmul(num(2), vmul(p, q))), x = vmul(rad(a * a, 3, 12), coef);
      if (kindOf(x) !== 'radfrac') return null;
      const s = tetra(3.6, 'OABC'), v = s.v, P0 = lerp3(v.O, v.A, p1 / (p1 + p2)), Q0 = lerp3(v.O, v.B, q1 / (q1 + q2)), R0 = lerp3(v.O, v.C, q1 / (q1 + q2));
      const figure = solidFig(s, `한 모서리의 길이가 ${a}인 정사면체 OABC. 모서리 OA를 ${p1} : ${josa(p2, "으로/로")} 내분하는 점 P, 모서리 OB, OC를 ${q1} : ${josa(q2, "으로/로")} 내분하는 점 Q, R와 삼각형 PQR를 나타내었다.`, (S) => {
        S.put({ P: P0, Q: Q0, R: R0 }); S.face(['P', 'Q', 'R']); S.seg('P', 'Q').seg('Q', 'R').seg('R', 'P'); for (const k of 'PQR') S.dot(k); S.name('P', 'P', 160).name('Q', 'Q', 300).name('R', 'R', 20);
      });
      return aRadFrac(`그림과 같이 한 모서리의 길이가 ${a}인 정사면체 OABC에서 모서리 OA를 ${p1} : ${josa(p2, "으로/로")} 내분하는 점을 P, 두 모서리 OB, OC를 ${q1} : ${josa(q2, "으로/로")} 내분하는 점을 각각 Q, R라 하자. 삼각형 PQR의 평면 ABC 위로의 정사영의 넓이는?`, x, {
        figure, sq: [`3*${a}**4*(${q1}**2*(${p1}+${p2})+2*${p1}*${q1}*(${q1}+${q2}))**2`, `144*(${q1}+${q2})**4*(${p1}+${p2})**2`],
        explain: `O의 정사영은 정삼각형 ABC의 무게중심 G이고, OA 위의 점 P의 정사영은 GA를 같은 비로 나눈 점이다. 그래서 P, Q, R의 정사영은 G에서 A, B, C까지를 각각 ${vh(p)}, ${vh(q)}, ${vh(q)}배 한 점이다. 삼각형 GAB, GBC, GCA의 넓이가 모두 ${vh(rad(a * a, 3, 12))}이므로 구하는 넓이는 ${vh(rad(a * a, 3, 12))} × (${vh(vmul(q, q))} + 2 × ${vh(vmul(p, q))}) = ${vh(x)}이다.`
      });
    }, { standard: S3 }),
    H('hard-circle-proj', '원의 정사영의 넓이 — 이면각을 먼저 구하기', '②18', (d, n) => {
      if (n === 0) {
        const sd = d.pick([4, 6, 8, 10]), oa = sd / 2, x = rad(sd * sd, 3, 24);
        const s0 = 3, R0 = s0 / Math.sqrt(3), A0 = K.onRing(R0, 200, 0), B0 = K.onRing(R0, 320, 0), C0 = K.onRing(R0, 80, 0), O0 = [A0[0], A0[1], s0 / 2], G0 = avg3([A0, B0, C0]), V0 = { k: 0.6, ang: 215 };
        const S = sp(Object.assign({ u: fitU([A0, B0, C0, O0], 190, 150, V0) }, V0)).put({ A: A0, B: B0, C: C0, O: O0 });
        const ri = s0 / (2 * Math.sqrt(3));
        S.face(['O', 'B', 'C'], 'rgba(37,99,235,0.10)').seg('A', 'B').seg('B', 'C').seg('C', 'A').seg('O', 'A').seg('O', 'B').seg('O', 'C').right('A', 'O', 'B');
        S.curve((t) => [G0[0] + ri * Math.cos(t), G0[1] + ri * Math.sin(t), 0], 0, 2 * Math.PI, 'thin', 48);
        S.name('A', 'A', 140).name('B', 'B', 220).name('C', 'C', 340).name('O', 'O', 90);
        const figure = S.svg(`밑면이 한 변의 길이가 ${sd}인 정삼각형 ABC이고 모서리 OA가 밑면에 수직인 삼각뿔 O-ABC(OA = ${oa}). 정삼각형 ABC의 내접원을 나타내었다.`);
        return aRadFrac(`그림과 같이 밑면 ABC는 한 변의 길이가 ${sd}인 정삼각형이고, 모서리 OA는 밑면 ABC와 수직이며 ${sg('OA', oa)}인 삼각뿔 O-ABC가 있다. 정삼각형 ABC의 내접원의 평면 OBC 위로의 정사영의 넓이가 ${V('k')}π일 때, 상수 ${V('k')}의 값은?`, x, {
          figure, sq: [`3*${sd}**4`, '576'],
          explain: `OA ⊥ 밑면이므로 삼각형 OBC의 평면 ABC 위로의 정사영은 삼각형 ABC이다. BC의 중점을 M이라 하면 AM = ${vh(rad(sd, 3, 2))}, OM = √(${oa}² + AM²) = ${sd}이므로 두 평면이 이루는 각 θ에서 cos θ = AM ÷ OM = √3/2이다. 내접원의 반지름은 ${vh(rad(sd, 3, 6))}, 넓이는 ${vh(num(sd * sd, 12))}π이므로 정사영의 넓이는 ${vh(num(sd * sd, 12))}π × √3/2 = ${vh(x)}π이다.`
        });
      }
      // 반구(반지름² = r2)가 평면 α 위, 중심 O. α 와 30° 인 평면 β 가 반구와 만나 생기는 원 C, O 와 교선 사이의 거리 dd
      const [r2, dd] = pick(d, [[20, 8], [25, 6], [41, 10], [13, 4], [29, 10], [34, 6], [45, 12], [52, 12]]), m = r2 - dd * dd / 4;
      if (m <= 0 || m % 2) return null;
      const k2 = 3 * m * m / 4;
      return aInt(`반지름의 길이가 ${rv(r2)}인 반구가 평면 ${al} 위에 놓여 있고, 반구와 평면 ${al}가 만나서 생기는 원의 중심을 O라 하자. 평면 ${al}와 이루는 각의 크기가 30°인 평면 ${be}가 반구와 만나서 생기는 원을 C, 두 평면 ${al}, ${be}의 교선을 ${V('l')}이라 하자. 점 O와 직선 ${V('l')} 사이의 거리가 ${dd}일 때, 원 C의 평면 ${al} 위로의 정사영의 넓이는 ${V('k')}π이다. ${nb(V('k') + '²')}의 값은?`, num(k2), {
        value: `3*(${rq(r2)}-(${dd}/2)**2)**2/4`,
        explain: `원 C의 중심을 C′, C′에서 교선에 내린 수선의 발을 A라 하면 OC′ ⊥ β, C′A ⊥ l이므로 삼수선 정리에 의하여 OA ⊥ l이고 ∠C′AO = 30°이다. OC′ = ${dd} × sin 30° = ${dd / 2}, 원 C의 반지름² = ${r2} − ${dd * dd / 4} = ${m}이므로 원 C의 넓이는 ${m}π, 정사영의 넓이는 ${m}π × cos 30° = ${vh(rad(m, 3, 2))}π이다. 따라서 k² = ${k2}이다.`
      });
    }, { count: 2, standard: S3 }),
    H('hard-hemisphere', '반구의 정사영의 넓이 — 두 조각으로 나누기', '②19', (d) => {
      const r = d.int(1, 6);
      return seal(M(`반지름의 길이가 ${r}인 반구의 밑면을 포함하는 평면과 평면 ${al}가 이루는 각의 크기가 30°일 때, 반구의 평면 ${al} 위로의 정사영의 넓이는 ${nb('(' + V('m') + ' + ' + V('n') + rt(3) + ')π/4')}이다. 두 자연수 ${V('m')}, ${V('n')}의 값을 차례로 구하시오.`, [{ label: V('m'), answer: 2 * r * r }, { label: V('n'), answer: r * r }], {
        shown: `m = ${2 * r * r}, n = ${r * r}`, facts: { calc: [[`2*${r}**2`, 0], [`${r}**2`, 1]] },
        explain: `반구의 중심을 지나 α와 평행한 단면(반원, 넓이 ${vh(num(r * r, 2))}π)은 그대로 정사영되고, 밑면의 반원(넓이 ${vh(num(r * r, 2))}π)은 cos 30°배가 되어 두 조각을 합친 것이 반구의 정사영이다. 넓이는 ${vh(num(r * r, 2))}π + ${vh(num(r * r, 2))}π × √3/2 = (${2 * r * r} + ${r * r}√3)π/4이다.`
      }));
    }, { standard: S3 }),
    H('hard-manhole', '벽면에 생기는 맨홀 뚜껑의 그림자 — 활꼴', '②23', (d) => {
      const r = d.pick([6, 12, 18]), a = 2 * r * r / 3, bq = r * r / 2;
      // 옆에서 본 그림: 지면(가로)과 벽(세로)이 만나는 O, 뚜껑의 지름 AB(A 는 지면, B 는 벽 — 지면과 30°), O 에서 AB 에 내린 수선의 발 H, AB 에 수직인 햇빛
      const b = Board(), O0 = [190, 120], len = 130, A0 = [O0[0] - len * Math.cos(30 * RAD) * Math.cos(30 * RAD), O0[1]], B0 = [O0[0], O0[1] - len * Math.cos(30 * RAD) * Math.sin(30 * RAD)];
      const Hh = [A0[0] + (B0[0] - A0[0]) * 0.75, A0[1] + (B0[1] - A0[1]) * 0.75];
      b.seg([20, O0[1]], [O0[0] + 30, O0[1]]); b.seg([O0[0], O0[1] + 10], [O0[0], 18]);
      b.seg(A0, B0, undefined, 'stroke:#1d4ed8;stroke-width:3'); b.seg(O0, Hh, 'cut');
      for (const t of [0.15, 0.45, 0.75]) { const p0 = [A0[0] + (B0[0] - A0[0]) * t, A0[1] + (B0[1] - A0[1]) * t]; b.seg([p0[0] - 52 * Math.cos(60 * RAD), p0[1] - 52 * Math.sin(60 * RAD)], p0, 'thin', 'stroke:#d97706'); }
      b.corner(Hh, B0, O0, ''); b.corner(O0, A0, B0, ''); b.angle(A0, 0, 30, '30°', { d: 34 });
      b.text([A0[0], O0[1] + 12], 'A', { plain: true }); b.text([B0[0] + 10, B0[1]], 'B', { plain: true }); b.text([O0[0] + 9, O0[1] + 10], 'O', { plain: true }); b.text([Hh[0] - 8, Hh[1] + 10], 'H', { plain: true });
      b.text([60, O0[1] + 14], '지면', { plain: true }); b.text([O0[0] + 22, 34], '벽면', { plain: true }); b.text([62, 30], '햇빛', { plain: true });
      const figure = b.svg(`옆에서 본 그림: 지면과 벽면이 만나는 선 위의 점 O, 맨홀 뚜껑의 지름 AB(A는 지면 위, B는 벽면 위)는 지면과 30°를 이루고, H는 O에서 AB에 내린 수선의 발이다. 햇빛은 지면과 60°를 이루며 뚜껑에 수직으로 비춘다.`);
      return seal(M(`지면과 수직인 벽면에 반지름의 길이가 ${r}인 원 모양의 맨홀 뚜껑이 지면과 벽면에 기대어 놓여 있다. 지면과 이루는 각의 크기가 60°인 햇빛이 뚜껑에 수직으로 비출 때, 벽면에 생기는 뚜껑의 그림자의 넓이는 ${nb(V('a') + 'π − ' + V('b') + rt(3))}이다. 두 자연수 ${V('a')}, ${V('b')}의 값을 차례로 구하시오. (단, 뚜껑의 두께는 무시하고, 그림은 뚜껑의 지름 AB를 지나고 벽면에 수직인 평면으로 자른 모양이다.)`, [{ label: V('a'), answer: a }, { label: V('b'), answer: bq }], {
        figure, shown: `a = ${a}, b = ${bq}`, facts: { calc: [[`2*${r}**2/3`, 0], [`${r}**2/2`, 1]] },
        explain: `뚜껑은 햇빛에 수직이므로 지면과 30°를 이룬다. AB = ${2 * r}이고 O에서 AB에 내린 수선의 발 H에 대하여 AH = ${2 * r} × cos²30° = ${3 * r / 2}, HB = ${r / 2}이다. H를 지나 AB에 수직인 현이 자르는 작은 활꼴(중심에서 ${r / 2}만큼 떨어진 현 — 중심각 120°)만 벽에 그림자를 만들고, 그 넓이는 ${r * r / 3}π − ${r * r / 4}√3이다. 벽면과 뚜껑이 이루는 각은 60°이므로 그림자의 넓이는 (${r * r / 3}π − ${r * r / 4}√3) ÷ cos 60° = ${a}π − ${bq}√3이다.`
      }));
    }, { standard: S3 }),
    H('hard-cyl-shadow', '원기둥의 그림자의 넓이 — 직사각형으로 바꾸기', '②24', (d) => {
      const r = d.int(1, 4), h = d.int(1, 5), x = rad(2 * r * h, 3, 3);
      if (kindOf(x) !== 'radfrac') return null;
      return aRadFrac(`밑면의 반지름의 길이가 ${r}이고 높이가 ${h}인 원기둥이 평평한 바닥에 세워져 있다. 바닥과 60°의 각을 이루는 햇빛이 원기둥을 비출 때, 바닥에 생기는 원기둥의 그림자 가운데 원기둥이 놓인 밑면 부분을 뺀 넓이는?`, x, {
        sq: [`4*${r}**2*${h}**2`, '3'],
        explain: `윗밑면의 그림자는 밑면과 합동인 원이고, 그림자는 두 원과 그 사이의 직사각형으로 이루어진다. 윗밑면의 그림자 가운데 직사각형 바깥의 반원은 밑면의 반원과 넓이가 같으므로, 밑면 부분을 뺀 그림자의 넓이는 직사각형의 넓이와 같다. 직사각형의 가로는 ${2 * r}, 세로는 그림자가 늘어난 길이 ${h} ÷ tan 60° = ${vh(rad(h, 3, 3))}이므로 넓이는 ${vh(x)}이다.`
      });
    }, { standard: S3 }),
    H('hard-views-dist', '세 방향의 정사영도에서 두 점 사이의 거리', '②28', (d) => {
      const [hz, hsum, dist] = pick(d, [[9, 12, 15], [12, 16, 20], [8, 15, 17], [6, 8, 10], [12, 9, 15], [5, 12, 13]]);
      // 수평 거리 R + r = hz, 높이 h1 + h2 = hsum
      const r = d.int(1, Math.floor((hz - 1) / 2)), R = hz - r, h1 = d.int(1, hsum - 1), h2 = hsum - h1;
      if (R <= r || h1 < 2 || h2 < 2) return null;
      const b = Board(), sc = Math.min(58 / R, 120 / hsum), cx = 90, w1 = R * sc, w2 = r * sc, pc = 18 + w1;
      // 평면도(위) — 정면도와 같은 배율
      b.disk([cx, pc], w1, 'fill:#fff8e1'); b.disk([cx, pc], w2, 'fill:#fff8e1');
      b.seg([cx - w2, pc], [cx + w1, pc], 'cut'); b.dot([cx - w2, pc]); b.dot([cx + w1, pc]); b.text([cx - w2 - 9, pc - 9], 'P', { plain: true }); b.text([cx + w1 + 10, pc - 6], 'Q', { plain: true });
      b.text([cx + w1 + 40, pc + 18], '평면도', { plain: true });
      // 정면도(아래)
      const y0 = pc + w1 + 30 + hsum * sc * 0.8, y1 = y0 - h1 * sc * 0.8, y2 = y1 - h2 * sc * 0.8;
      b.poly([[cx - w1, y0], [cx + w1, y0], [cx + w1, y1], [cx - w1, y1]], 'fill:#fff8e1'); b.poly([[cx - w2, y1], [cx + w2, y1], [cx + w2, y2], [cx - w2, y2]], 'fill:#fff8e1');
      b.dot([cx - w2, y2]); b.dot([cx + w1, y0]); b.text([cx - w2 - 9, y2 - 6], 'P', { plain: true }); b.text([cx + w1 + 9, y0 + 9], 'Q', { plain: true });
      b.dim([cx - w1, y0], [cx + w1, y0], String(2 * R), [cx, y1], 12); b.dim([cx - w2, y2], [cx + w2, y2], String(2 * r), [cx, y1], 10);
      b.dim([cx - w1, y0], [cx - w1, y1], String(h1), [cx, y0], 10); b.dim([cx + w2, y1], [cx + w2, y2], String(h2), [cx, y1], 10);
      b.text([cx + w1 + 34, (y0 + y2) / 2], '정면도', { plain: true });
      const figure = b.svg(`어떤 입체도형의 평면도와 정면도. 평면도는 중심이 같은 두 원(점 P는 작은 원 위, 점 Q는 큰 원 위에 있고, P, Q와 두 원의 중심은 한 직선 위에 있으며 중심을 사이에 두고 반대쪽)이다. 정면도는 가로 ${2 * R}, 세로 ${h1}인 직사각형 위에 가로 ${2 * r}, 세로 ${h2}인 직사각형을 가운데에 얹은 모양이고, P는 위 직사각형의 왼쪽 위 꼭짓점, Q는 아래 직사각형의 오른쪽 아래 꼭짓점이다.`);
      return aInt(`두 점 P, Q가 표시된 어떤 입체도형의 평면도와 정면도가 그림과 같다. 이 입체도형에서 두 점 P, Q 사이의 거리는?`, num(dist), {
        figure, value: `((${2 * R}/2+${2 * r}/2)**2+(${h1}+${h2})**2)**0.5`,
        explain: `평면도와 정면도에서 이 입체도형은 반지름이 ${R}, 높이가 ${h1}인 원기둥 위에 반지름이 ${r}, 높이가 ${h2}인 원기둥을 중심을 맞추어 쌓은 것이다. P는 위 원기둥의 윗면 둘레 위, Q는 아래 원기둥의 밑면 둘레 위에 있고 중심을 사이에 두고 반대쪽이므로 두 점의 수평 거리는 ${r} + ${R} = ${hz}, 높이 차는 ${hsum}이다. PQ = √(${hz * hz} + ${hsum * hsum}) = ${dist}이다.`
      });
    }, { standard: S3 })
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
