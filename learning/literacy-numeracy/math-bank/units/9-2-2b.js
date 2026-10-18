// 중학교 3학년 2학기 2단원 삼각비의 활용 — 뒤쪽 묶음(삼각형의 넓이, 사각형의 넓이, 여러 가지 도형의 넓이와 길이).
// 단원 틀과 도구(근호가 든 수의 셈, 답 칸, 그림 판)는 9-2-2a.js 가 B.kit.m922 로 내보낸 것을 쓴다. 싣는 기준·뺀 것과 까닭은 9-2-2a.js 머리에 모아 적었다.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 넓이의 식: 두 변 b, c 와 그 끼인각 A 를 알 때 S = ½bc sin A, A 가 둔각이면 S = ½bc sin(180° − A)(교과서가 가르치는 두 식). 평행사변형은 ab sin B, 사각형은 ½ × 두 대각선 × sin(끼인각).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, inline } = B.kit;
  const { V, nb, SG, rt, grp, sqParts } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, XY, sv, TINT } = B.kit.mgeo;
  const {
    T, tm, K, KR, add, sub, mul, div, sqrtV, sq, fv, isK, SIN, COS, half, sh, L, plainV, sqH, pq, fn, angH, segEq, calcOf, seal, more,
    aRad, aInt, aFr, aPi, pickV, pickNum, pic, cm, polar, sasABC, third
  } = B.kit.m922;
  const UNIT = '9-2-2';
  const AREA = 'cm²';
  const half2 = (A) => mul(A, half(1));   // ½ × A
  // 두 변과 끼인각(특수각 또는 둔각)의 삼각형 넓이와 그 풀이 글
  const triArea = (b, c, ang) => mul(mul(mul(b, c), half(1)), SIN[ang > 90 ? 180 - ang : ang]);
  const sinOf = (ang) => (ang > 90 ? nb('sin(180° − ' + ang + '°)') : fn('sin', ang));
  const areaTold = (b, c, ang) => `${frac(1, 2)} × ${sh(b)} × ${sh(c)} × ${sinOf(ang)}${ang > 90 ? ' = ' + frac(1, 2) + ' × ' + sh(b) + ' × ' + sh(c) + ' × ' + fn('sin', 180 - ang) : ''}`;

  // ── 묶음 4: 삼각형의 넓이 ──
  const areaTypes = [
    T('area-sas', '두 변과 그 끼인각(예각)으로 삼각형의 넓이 구하기', '①26', (d, n) => {
      if (n === 1) {
        const [a, b] = d.until(() => [d.int(3, 16), d.int(3, 16)], ([x, y]) => x !== y && (x * y) % 4 === 0);
        const S = triArea(K(a), K(b), 30);
        return aInt(`두 변의 길이가 ${a} cm, ${b} cm이고 그 끼인각의 크기가 30°인 삼각형의 넓이는 몇 ${AREA}인가?`, S, AREA, {
          explain: `넓이는 ${areaTold(K(a), K(b), 30)} = ${L(S, AREA)}이다.`
        });
      }
      const th = d.pick([45, 60]), [a, c] = d.until(() => [d.int(3, 14), d.int(3, 14)], ([x, y]) => x !== y && (x * y) % 4 === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      const S = triArea(K(c), K(a), th);
      const f = pic(sasABC(a, c, th), { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', th + '°']], sides: [['A', 'B', cm(c), 'C'], ['B', 'C', cm(a), 'A']], size: [200, 115] });
      return aRad(`그림과 같이 ${segEq('AB', K(c), 'cm')}, ${segEq('BC', K(a), 'cm')}, ${angH('B', th)}인 △ABC의 넓이는?`, S, AREA, {
        figure: f.b.svg(`△ABC. AB의 길이는 ${c} cm, BC의 길이는 ${a} cm, ∠B = ${th}°`),
        explain: `△ABC = ${areaTold(K(c), K(a), th)} = ${L(S, AREA)}이다.`
      });
    }, { count: 2 }),
    T('area-obtuse', '두 변과 그 끼인각(둔각)으로 삼각형의 넓이 구하기', '①28', (d) => {
      const ang = d.pick([120, 135]), [b, c] = d.until(() => [d.int(3, 14), d.int(3, 14)], ([x, y]) => x !== y && (x * y) % 4 === 0 && y / x >= 0.7 && y / x < 2.6);
      const S = triArea(K(b), K(c), ang);
      const mdl = { A: [0, 0], B: [c, 0], C: polar([0, 0], b, ang) };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], angs: [['A', 'B', 'C', ang + '°']], sides: [['A', 'B', cm(c), 'C'], ['A', 'C', cm(b), 'B']], size: [210, 110] });
      return aRad(`그림과 같이 ${segEq('AB', K(c), 'cm')}, ${segEq('AC', K(b), 'cm')}, ${angH('A', ang)}인 △ABC의 넓이는?`, S, AREA, {
        figure: f.b.svg(`△ABC. AB의 길이는 ${c} cm, AC의 길이는 ${b} cm, ∠A = ${ang}°`),
        explain: `∠A가 둔각이므로 △ABC = ${areaTold(K(c), K(b), ang)} = ${L(S, AREA)}이다.`
      });
    }),
    T('area-formula', '∠A가 둔각인 삼각형의 높이·넓이를 나타낸 식 고르기', '①29', (d, n) => {
      // 보기의 값이 서로 다르게: 135°(sin = cos)는 쓰지 않는다
      const [A0, b0, c0] = d.until(() => [d.pick([110, 115, 125, 130, 140, 145, 155]), d.int(3, 9), d.int(4, 10)], ([a, x, y]) => {
        const e = (180 - a) * RAD, v = [x * Math.sin(e), x * Math.cos(e), x * Math.tan(e), x * Math.sin(e) / 2, x / Math.sin(e), x * y * Math.sin(e) / 2, x * y * Math.sin(e), x * y * Math.cos(e) / 2, x * y * Math.tan(e) / 2];
        return v.every((p, i) => v.every((q, j) => i === j || Math.abs(p - q) > 1e-6)) && x !== y;
      });
      const R = (x) => x * RAD;
      const s = Math.sin(R(180 - A0)), co = Math.cos(R(180 - A0)), t = Math.tan(R(180 - A0));
      const b = V('b'), c = V('c'), S180 = 'sin(180° − A)', C180 = 'cos(180° − A)', T180 = 'tan(180° − A)', HF = frac(1, 2);
      const mdl = { A: [0, 0], B: [c0, 0], C: polar([0, 0], b0, A0), H: [b0 * Math.cos(R(A0)), 0] };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['C', 'H']], cuts: [['H', 'A']], rights: [['H', 'A', 'C']], sides: [['A', 'B', sv('c'), 'C'], ['A', 'C', sv('b'), 'H', { t: 0.32 }]], size: [200, 110] });
      const fig = f.b.svg('∠A가 둔각인 △ABC. 꼭짓점 C에서 변 AB의 연장선에 내린 수선의 발 H, CA의 길이는 b, AB의 길이는 c');
      if (n === 1) {
        const opts = [[`${HF}${b}${c} ${S180}`, 0.5 * b0 * c0 * s], [`${b}${c} ${S180}`, b0 * c0 * s], [`${HF}${b}${c} ${C180}`, 0.5 * b0 * c0 * co], [`${HF}${b} ${S180}`, 0.5 * b0 * s], [`${HF}${b}${c} ${T180}`, 0.5 * b0 * c0 * t]].map(([h, v]) => ({ h: nb(h), v }));
        return pickNum(d, `그림과 같이 ∠A가 둔각인 △ABC에서 ${SG('CA')} = ${b}, ${SG('AB')} = ${c}일 때, △ABC의 넓이 ${V('S')}를 나타낸 것은?`, opts, 0.5 * b0 * c0 * s, {
          figure: fig,
          explain: `∠CAH = 180° − ∠A이므로 높이 ${SG('CH')} = ${b} ${S180}이고 ${V('S')} = ${HF} × ${c} × ${b} ${S180} = ${opts[0].h}이다.`
        });
      }
      const opts = [[`${b} ${S180}`, b0 * s], [`${b} ${C180}`, b0 * co], [`${b} ${T180}`, b0 * t], [`${HF}${b} ${S180}`, 0.5 * b0 * s], [frac(b, S180), b0 / s]].map(([h, v]) => ({ h: nb(h), v }));
      return pickNum(d, `그림과 같이 ∠A가 둔각인 △ABC의 꼭짓점 C에서 변 AB의 연장선에 내린 수선의 발을 H라 하자. ${SG('CA')} = ${b}일 때, ${SG('CH')}의 길이를 나타낸 것은?`, opts, b0 * s, {
        figure: fig,
        explain: `점 H는 변 BA의 연장선 위에 있으므로 ∠CAH = 180° − ∠A이다. 직각삼각형 CAH에서 ${SG('CH')} = ${opts[0].h}이다.`
      });
    }, { count: 2 }),
    T('area-iso', '이등변삼각형의 밑각으로 꼭지각을 구해 넓이 구하기', '①30', (d) => {
      const s = 2 * d.int(2, 9), S = triArea(K(s), K(s), 30);
      const mdl = { B: [0, 0], C: [2 * s * Math.sin(15 * RAD), 0], A: [s * Math.sin(15 * RAD), s * Math.cos(15 * RAD)] };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], ticks: [['A', 'B', 1], ['A', 'C', 1]], angs: [['B', 'C', 'A', '75°']], sides: [['A', 'B', cm(s), 'C']], size: [120, 150] });
      return aInt(`그림과 같이 ${nb(SG('AB') + ' = ' + SG('AC') + ' = ' + s + ' cm')}인 이등변삼각형 ABC에서 ${angH('B', 75)}일 때, △ABC의 넓이는 몇 ${AREA}인가?`, S, AREA, {
        figure: f.b.svg(`AB = AC인 이등변삼각형 ABC. AB의 길이는 ${s} cm, ∠B = 75°`),
        explain: `∠C = ∠B = 75°이므로 ∠A = 180° − 2 × 75° = 30°이다. △ABC = ${areaTold(K(s), K(s), 30)} = ${L(S, AREA)}이다.`
      });
    }),
    T('area-right-iso', '빗변과 45°로 직각이등변삼각형의 넓이 구하기', '①31', (d) => {
      const h = 2 * d.int(1, 7) + 1, leg = mul(K(h), SIN[45]), S = half2(sq(leg));
      const mdl = { A: [0, 0], C: [h / Math.SQRT2, 0], B: [h / Math.SQRT2, h / Math.SQRT2] };
      const f = pic(mdl, { polys: [['A', 'C', 'B']], rights: [['C', 'A', 'B']], angs: [['A', 'C', 'B', '45°']], sides: [['A', 'B', cm(h), 'C']], size: [170, 120] });
      return aFr(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${segEq('AB', K(h), 'cm')}, ${angH('A', 45)}일 때, △ABC의 넓이는 몇 ${AREA}인가?`, S, AREA, {
        figure: f.b.svg(`∠C = 90°인 직각삼각형 ABC. 빗변 AB의 길이는 ${h} cm, ∠A = 45°`),
        explain: `${SG('BC')} = ${SG('AC')} = ${h} ${fn('sin', 45)} = ${sh(leg)}이므로 △ABC = ${frac(1, 2)} × ${sh(leg)} × ${sh(leg)} = ${L(S, AREA)}이다.`
      });
    }),
    T('area-back-side', '넓이에서 거꾸로 한 변의 길이 구하기', '①34', (d) => {
      const th = d.pick([30, 45, 60]), [a, c] = d.until(() => [d.int(3, 16), d.int(3, 16)], ([x, y]) => x !== y && (x * y) % 4 === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      const S = triArea(K(a), K(c), th), Sg = S[0].m === 1 ? K(S[0].nv) : KR(S[0].nv, S[0].m);   // 문제에 적는 넓이
      const AB = div(mul(K(2), Sg), mul(K(a), SIN[th]));
      const f = pic(sasABC(a, c, th), { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', th + '°']], sides: [['B', 'C', cm(a), 'A']], size: [200, 115] });
      return aInt(`그림과 같이 ${segEq('BC', K(a), 'cm')}, ${angH('B', th)}인 △ABC의 넓이가 ${L(Sg, AREA)}일 때, ${SG('AB')}의 길이는 몇 cm인가?`, AB, 'cm', {
        figure: f.b.svg(`△ABC. BC의 길이는 ${a} cm, ∠B = ${th}°`),
        explain: `${frac(1, 2)} × ${SG('AB')} × ${a} × ${fn('sin', th)} = ${sh(Sg)}이고 ${frac(1, 2)} × ${a} × ${sh(SIN[th])} = ${sh(mul(mul(K(a), half(1)), SIN[th]))}이므로 ${SG('AB')} = ${sh(Sg)} ÷ ${sh(mul(mul(K(a), half(1)), SIN[th]))} = ${L(AB, 'cm')}이다.`
      });
    }),
    T('area-back-angle', '넓이에서 거꾸로 끼인각의 크기 구하기', '①35', (d) => {
      const th = d.pick([30, 45, 60]), [a, c] = d.until(() => [d.int(3, 14), d.int(3, 14)], ([x, y]) => x !== y && (x * y) % 4 === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      const S = triArea(K(a), K(c), th), sinB = 2 * fv(S) / (a * c);
      const opts = [30, 45, 60, 75, 90].map((g) => ({ h: g + '°', v: Math.sin(g * RAD) }));
      const f = pic(sasABC(a, c, th), { polys: [['A', 'B', 'C']], sides: [['A', 'B', cm(c), 'C'], ['B', 'C', cm(a), 'A']], size: [200, 115] });
      const item = pickNum(d, `그림과 같이 ${segEq('AB', K(c), 'cm')}, ${segEq('BC', K(a), 'cm')}인 △ABC의 넓이가 ${L(S, AREA)}일 때, ∠B의 크기는? (단, ∠B는 예각이다.)`, opts, sinB, {
        figure: f.b.svg(`△ABC. AB의 길이는 ${c} cm, BC의 길이는 ${a} cm`),
        explain: `${frac(1, 2)} × ${c} × ${a} × sin B = ${sh(S)}이므로 sin B = ${sh(div(mul(K(2), S), K(a * c)))}이다. ∠B는 예각이므로 ∠B = ${th}°이다.`
      });
      // 보기의 차례를 각의 크기 차례로 맞춘다(작은 각부터).
      const order = item.choice.options.map((o, i) => [parseInt(o, 10), i]).sort((x, y) => x[0] - y[0]);
      item.choice.answer = order.findIndex(([, i]) => i === item.choice.answer);
      item.facts.truth = order.map(([, i]) => item.facts.truth[i]);
      item.choice.options = order.map(([g]) => g + '°');
      return seal(item);
    }),
    T('area-back-third', '넓이로 한 변을 구한 뒤 나머지 한 변 구하기', '①36', (d) => {
      const z = d.until(() => { const a = d.int(4, 16), c = 2 * d.int(2, 8); return { a, c }; }, ({ a, c }) => (a * c) % 4 === 0 && c / 2 < a - 0.9 && isK(third(mul(K(c), SIN[60]), sub(K(a), mul(K(c), COS[60]))).len) && Math.max(a, c) / Math.min(a, c) < 2.6);
      const S = triArea(K(z.a), K(z.c), 60), Sg = KR(S[0].nv, S[0].m), AB = div(mul(K(2), Sg), mul(K(z.a), SIN[60]));
      const AH = mul(AB, SIN[60]), BH = mul(AB, COS[60]), CH = sub(K(z.a), BH), r = third(AH, CH);
      const f = pic(sasABC(z.a, z.c, 60), { polys: [['A', 'B', 'C']], angs: [['B', 'C', 'A', '60°']], sides: [['B', 'C', cm(z.a), 'A']], size: [200, 115] });
      return aRad(`그림과 같이 ${segEq('BC', K(z.a), 'cm')}, ${angH('B', 60)}인 △ABC의 넓이가 ${L(Sg, AREA)}일 때, ${SG('AC')}의 길이는?`, r.len, 'cm', {
        figure: f.b.svg(`△ABC. BC의 길이는 ${z.a} cm, ∠B = 60°`),
        explain: `${frac(1, 2)} × ${SG('AB')} × ${z.a} × ${fn('sin', 60)} = ${sh(Sg)}에서 ${SG('AB')} = ${sh(AB)}이다. 꼭짓점 A에서 BC에 수선 AH를 그으면 ${SG('AH')} = ${sh(AH)}, ${SG('BH')} = ${sh(BH)}, ${SG('CH')} = ${sh(CH)}이므로 ${SG('AC')} = ${rt(sqH(pq(AH)) + ' + ' + sqH(pq(CH)))} = ${L(r.len, 'cm')}이다.`
      });
    })
  ];

  // ── 묶음 5: 사각형의 넓이 ──
  // 평행사변형 ABCD(B 왼쪽 아래, C 오른쪽 아래): AB = a, BC = b, ∠B = th
  const para = (a, b, th) => { const A = polar([0, 0], a, th); return { A, B: [0, 0], C: [b, 0], D: [A[0] + b, A[1]] }; };
  const quadTypes = [
    T('quad-split', '대각선으로 나눈 두 삼각형으로 사각형의 넓이 구하기', '①37', (d) => {
      // AB = p, BC = q, ∠B = 60° → AC² = p² + q² − pq. CD = r, DA = s, ∠D = 120° → r² + rs + s² = AC²
      const z = d.until(() => {
        const p = d.int(3, 12), q = d.int(3, 12), X = p * p + q * q - p * q, sols = [];
        for (let r = 2; r <= 14; r += 1) for (let s = 2; s <= 14; s += 1) if (r * r + r * s + s * s === X) sols.push([K(r), K(s), r * s]);
        for (let t = 1; t <= 6; t += 1) { const m = X / (3 * t * t); if (Number.isInteger(m) && m >= 2 && sqParts(m)[0] === 1) sols.push([KR(t, m), KR(t, m), t * t * m]); }
        const pick = sols.length ? d.pick(sols) : null;
        return { p, q, X, pick };
      }, (y) => y.pick && (y.p * y.q + y.pick[2]) % 4 === 0 && y.p !== y.q);
      const [r, s] = z.pick, rv = fv(r), sv0 = fv(s), A = polar([0, 0], z.p, 60), Cp = [z.q, 0];
      // D: A 에서 s, C 에서 r 인 점 가운데 B 의 반대쪽
      const ac = dist(A, Cp), u = (sv0 * sv0 - rv * rv + ac * ac) / (2 * ac), hgt = Math.sqrt(Math.max(0, sv0 * sv0 - u * u)), ex = [(Cp[0] - A[0]) / ac, (Cp[1] - A[1]) / ac], nrm = [ex[1], -ex[0]];
      const base = [A[0] + ex[0] * u, A[1] + ex[1] * u], cand = [[base[0] + nrm[0] * hgt, base[1] + nrm[1] * hgt], [base[0] - nrm[0] * hgt, base[1] - nrm[1] * hgt]];
      const side = (pt) => (Cp[0] - A[0]) * (pt[1] - A[1]) - (Cp[1] - A[1]) * (pt[0] - A[0]), Dp = side(cand[0]) * side([0, 0]) < 0 ? cand[0] : cand[1];
      const S1 = triArea(K(z.p), K(z.q), 60), S2 = triArea(r, s, 120), S = add(S1, S2);
      const f = pic({ A, B: [0, 0], C: Cp, D: Dp }, { polys: [['A', 'B', 'C', 'D']], angs: [['B', 'C', 'A', '60°'], ['D', 'A', 'C', '120°']], sides: [['A', 'B', cm(z.p)], ['B', 'C', cm(z.q)], ['C', 'D', isK(r) ? [r[0].nv, r[0].m, 'cm'] : cm(fv(r))], ['D', 'A', isK(s) ? [s[0].nv, s[0].m, 'cm'] : cm(fv(s))]], size: [190, 150] });
      return aRad(`그림의 □ABCD에서 ${segEq('AB', K(z.p), 'cm')}, ${segEq('BC', K(z.q), 'cm')}, ${segEq('CD', r, 'cm')}, ${segEq('DA', s, 'cm')}, ${angH('B', 60)}, ${angH('D', 120)}일 때, □ABCD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`□ABCD. AB ${z.p} cm, BC ${z.q} cm, CD ${plainV(r)} cm, DA ${plainV(s)} cm, ∠B = 60°, ∠D = 120°`),
        explain: `대각선 AC를 그으면 △ABC = ${areaTold(K(z.p), K(z.q), 60)} = ${sh(S1)}, △ACD = ${areaTold(r, s, 120)} = ${sh(S2)}이므로 □ABCD = ${L(S, AREA)}이다.`
      });
    }),
    T('quad-diag-first', '대각선의 길이를 먼저 구해 사각형의 넓이 구하기', '①38', (d) => {
      const p = 2 * d.int(2, 6), q = 2 * d.until(() => d.int(2, 9), (x) => 2 * x < 2 * p - 1);
      const AC = mul(K(p), [tm(3, 1, 1, '1', '1')]);   // tan 60° = AC/AB
      const S1 = half2(mul(K(p), AC)), S2 = triArea(AC, K(q), 30), S = add(S1, S2);
      const mdl = { B: [0, 0], A: [p, 0], C: [p, p * Math.sqrt(3)], D: [p + q / 2, p * Math.sqrt(3) - q * Math.sqrt(3) / 2] };
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C']], rights: [['A', 'B', 'C']], angs: [['B', 'A', 'C', '60°'], ['C', 'A', 'D', '30°']], sides: [['A', 'B', cm(p), 'C'], ['C', 'D', cm(q), 'A']], size: [170, 160] });
      return aRad(`그림의 □ABCD에서 ∠BAC = 90°, ∠ABC = 60°, ∠ACD = 30°이고 ${segEq('AB', K(p), 'cm')}, ${segEq('CD', K(q), 'cm')}일 때, □ABCD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`대각선 AC로 나뉜 □ABCD. ∠BAC = 90°, ∠ABC = 60°, ∠ACD = 30°, AB의 길이는 ${p} cm, CD의 길이는 ${q} cm`),
        explain: `직각삼각형 ABC에서 ${SG('AC')} = ${p} ${fn('tan', 60)} = ${sh(AC)}이다. △ABC = ${frac(1, 2)} × ${p} × ${sh(AC)} = ${sh(S1)}, △ACD = ${areaTold(AC, K(q), 30)} = ${sh(S2)}이므로 □ABCD = ${L(S, AREA)}이다.`
      });
    }),
    T('quad-para', '두 변과 그 끼인각으로 평행사변형의 넓이 구하기', '①39', (d) => {
      const th = d.pick([45, 60, 120, 135]), [a, b] = d.until(() => [d.int(3, 12), d.int(3, 14)], ([x, y]) => x !== y && (x * y) % 2 === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      const S = mul(mul(K(a), K(b)), SIN[th > 90 ? 180 - th : th]);
      const f = pic(para(a, b, th), { polys: [['A', 'B', 'C', 'D']], angs: [['B', 'C', 'A', th + '°']], sides: [['A', 'B', cm(a)], ['B', 'C', cm(b)]], size: [210, 110] });
      return aRad(`그림과 같이 ${segEq('AB', K(a), 'cm')}, ${segEq('BC', K(b), 'cm')}, ${angH('B', th)}인 평행사변형 ABCD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`평행사변형 ABCD. AB의 길이는 ${a} cm, BC의 길이는 ${b} cm, ∠B = ${th}°`),
        explain: `평행사변형의 넓이는 △ABC의 2배이므로 ${a} × ${b} × ${sinOf(th)}${th > 90 ? ' = ' + a + ' × ' + b + ' × ' + fn('sin', 180 - th) : ''} = ${L(S, AREA)}이다.`
      });
    }),
    T('quad-rhombus', '둘레의 길이와 한 각으로 마름모의 넓이 구하기', '①40', (d) => {
      const th = d.pick([45, 60, 120, 135]), s = 2 * d.int(2, 7), S = mul(mul(K(s), K(s)), SIN[th > 90 ? 180 - th : th]);
      const f = pic(para(s, s, th), { polys: [['A', 'B', 'C', 'D']], ticks: [['A', 'B', 1], ['B', 'C', 1], ['C', 'D', 1], ['D', 'A', 1]], angs: [['B', 'C', 'A', th + '°']], size: [200, 110] });
      return aRad(`둘레의 길이가 ${4 * s} cm이고 ${angH('B', th)}인 마름모 ABCD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`마름모 ABCD. ∠B = ${th}°`),
        explain: `한 변의 길이는 ${4 * s} ÷ 4 = ${s} (cm)이고 넓이는 ${s} × ${s} × ${sinOf(th)} = ${L(S, AREA)}이다.`
      });
    }),
    T('quad-back', '넓이에서 거꾸로 평행사변형의 변·마름모의 둘레 구하기', '①41', (d, n) => {
      const th = d.pick([30, 45, 60, 120, 135, 150]), e = th > 90 ? 180 - th : th;
      if (n === 1) {
        const s = e === 30 ? 2 * d.int(2, 8) : 2 * d.int(2, 7), S = mul(mul(K(s), K(s)), SIN[e]), Sg = S[0].m === 1 ? K(S[0].nv) : KR(S[0].nv, S[0].m);
        const side = sqrtV(div(Sg, SIN[e])), per = mul(side, K(4));
        const f = pic(para(s, s, th), { polys: [['A', 'B', 'C', 'D']], ticks: [['A', 'B', 1], ['B', 'C', 1], ['C', 'D', 1], ['D', 'A', 1]], angs: [['B', 'C', 'A', th + '°']], size: [200, 110] });
        return aInt(`그림과 같이 ${angH('B', th)}인 마름모 ABCD의 넓이가 ${L(Sg, AREA)}일 때, 마름모 ABCD의 둘레의 길이는 몇 cm인가?`, per, 'cm', {
          figure: f.b.svg(`마름모 ABCD. ∠B = ${th}°`),
          explain: `한 변의 길이를 ${V('x')} cm라 하면 ${V('x')} × ${V('x')} × ${sinOf(th)} = ${sh(Sg)}이므로 ${V('x')}<sup>2</sup> = ${sh(div(Sg, SIN[e]))}, ${V('x')} = ${sh(side)}이다. 둘레의 길이는 4 × ${sh(side)} = ${L(per, 'cm')}이다.`
        });
      }
      const [a, b] = d.until(() => [d.int(3, 12), d.int(3, 14)], ([x, y]) => x !== y && (x * y) % 2 === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      const S = mul(mul(K(a), K(b)), SIN[e]), Sg = S[0].m === 1 ? K(S[0].nv) : KR(S[0].nv, S[0].m), BC = div(Sg, mul(K(a), SIN[e]));
      const f = pic(para(a, b, th), { polys: [['A', 'B', 'C', 'D']], angs: [['B', 'C', 'A', th + '°']], sides: [['A', 'B', cm(a)]], size: [210, 110] });
      return aInt(`그림과 같이 ${segEq('AB', K(a), 'cm')}, ${angH('B', th)}인 평행사변형 ABCD의 넓이가 ${L(Sg, AREA)}일 때, ${SG('BC')}의 길이는 몇 cm인가?`, BC, 'cm', {
        figure: f.b.svg(`평행사변형 ABCD. AB의 길이는 ${a} cm, ∠B = ${th}°`),
        explain: `${a} × ${SG('BC')} × ${sinOf(th)} = ${sh(Sg)}이고 ${a} × ${sh(SIN[e])} = ${sh(mul(K(a), SIN[e]))}이므로 ${SG('BC')} = ${sh(Sg)} ÷ ${sh(mul(K(a), SIN[e]))} = ${L(BC, 'cm')}이다.`
      });
    }, { count: 2 }),
    T('quad-trap', '등변사다리꼴의 높이와 윗변을 구해 넓이 구하기', '①42', (d) => {
      const p = 2 * d.int(1, 5), q = d.until(() => d.int(p + 2, p + 12), (x) => x - p >= 2);
      const hgt = mul(K(p), SIN[60]), BH = mul(K(p), COS[60]), AD = sub(K(q), mul(K(2), BH)), S = half2(mul(add(AD, K(q)), hgt));
      const mdl = { B: [0, 0], C: [q, 0], A: [p / 2, fv(hgt)], D: [q - p / 2, fv(hgt)] };
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], ticks: [['A', 'B', 1], ['D', 'C', 1]], angs: [['B', 'C', 'A', '60°']], sides: [['A', 'B', cm(p)], ['B', 'C', cm(q)]], size: [210, 100] });
      return aRad(`그림과 같이 ${nb('AD ∥ BC')}, ${nb(SG('AB') + ' = ' + SG('DC') + ' = ' + p + ' cm')}인 등변사다리꼴 ABCD에서 ${segEq('BC', K(q), 'cm')}, ${angH('B', 60)}일 때, □ABCD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`AD와 BC가 평행하고 AB = DC인 등변사다리꼴 ABCD. AB의 길이는 ${p} cm, BC의 길이는 ${q} cm, ∠B = 60°`),
        explain: `A, D에서 BC에 내린 수선의 발을 H, H′이라 하면 높이는 ${p} ${fn('sin', 60)} = ${sh(hgt)}, ${SG('BH')} = ${p} ${fn('cos', 60)} = ${sh(BH)}이다. ${SG('AD')} = ${q} − 2 × ${sh(BH)} = ${sh(AD)}이므로 넓이는 ${frac(1, 2)} × (${sh(AD)} + ${q}) × ${sh(hgt)} = ${L(S, AREA)}이다.`
      });
    }),
    T('quad-diag', '두 대각선과 그 끼인각으로 사각형의 넓이 구하기', '①43', (d) => {
      const th = d.pick([45, 60, 120, 135]), [p, q] = d.until(() => [d.int(6, 16), d.int(6, 16)], ([x, y]) => x !== y && (x * y) % 4 === 0);
      const S = mul(mul(mul(K(p), K(q)), half(1)), SIN[th > 90 ? 180 - th : th]);
      // 두 대각선 AC(가로)와 BD 가 O 에서 만난다. ∠AOB 쪽 표시
      const O = [0, 0], tA = d.pick([0.45, 0.5, 0.55]), tB = d.pick([0.45, 0.5, 0.55]);
      const mdl = { A: [-p * tA, 0], C: [p * (1 - tA), 0], B: polar(O, q * tB, 180 + th), D: polar(O, q * (1 - tB), th), O };
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['B', 'D']], angs: [['O', 'C', 'D', th + '°']], names: ['A', 'B', 'C', 'D'], size: [200, 130] });
      return aRad(`그림과 같이 □ABCD의 두 대각선의 길이가 ${p} cm, ${q} cm이고 두 대각선이 이루는 각의 크기가 ${th}°일 때, □ABCD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`□ABCD와 두 대각선 AC, BD. 두 대각선이 이루는 각 ${th}°`),
        explain: `□ABCD의 넓이는 ${frac(1, 2)} × ${p} × ${q} × ${sinOf(th)} = ${L(S, AREA)}이다.`
      });
    }),
    T('quad-diag-back', '넓이에서 거꾸로 대각선의 길이 구하기', '①44', (d) => {
      const th = d.pick([45, 60, 120, 135]), [p, q] = d.until(() => [d.int(6, 16), d.int(6, 16)], ([x, y]) => x !== y && (x * y) % 4 === 0);
      const e = th > 90 ? 180 - th : th, S = mul(mul(mul(K(p), K(q)), half(1)), SIN[e]), Sg = KR(S[0].nv, S[0].m), AC = div(mul(K(2), Sg), mul(K(q), SIN[e]));
      const O = [0, 0], mdl = { A: [-p * 0.45, 0], C: [p * 0.55, 0], B: polar(O, q * 0.5, 180 + th), D: polar(O, q * 0.5, th), O };
      const g = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['B', 'D']], angs: [['O', 'C', 'D', th + '°']], names: ['A', 'B', 'C', 'D'], size: [200, 130] });
      return aInt(`그림의 □ABCD에서 ${segEq('BD', K(q), 'cm')}이고 두 대각선이 이루는 각의 크기가 ${th}°이다. □ABCD의 넓이가 ${L(Sg, AREA)}일 때, ${SG('AC')}의 길이는 몇 cm인가?`, AC, 'cm', {
        figure: g.b.svg(`□ABCD와 두 대각선 AC, BD. 두 대각선이 이루는 각 ${th}°`),
        explain: `${frac(1, 2)} × ${SG('AC')} × ${q} × ${sinOf(th)} = ${sh(Sg)}이고 ${frac(1, 2)} × ${q} × ${sh(SIN[e])} = ${sh(mul(mul(K(q), half(1)), SIN[e]))}이므로 ${SG('AC')} = ${L(AC, 'cm')}이다.`
      });
    }),
    T('quad-para-part', '평행사변형 안의 삼각형의 넓이 구하기', '①45', (d, n) => {
      if (n === 1) {
        const th = d.pick([45, 60]), [a, b] = d.until(() => [d.int(3, 12), 2 * d.int(2, 7)], ([x, y]) => x !== y && (x * y) % 8 === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
        const P0 = mul(mul(K(a), K(b)), SIN[th]), S = mul(P0, [tm(1, 1, 4, '1', '4')]), mdl = para(a, b, th);
        mdl.M = [b / 2, 0];
        const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'M'], ['A', 'C']], fills: [], ticks: [['B', 'M', 1], ['M', 'C', 1]], angs: [['B', 'M', 'A', th + '°']], sides: [['A', 'B', cm(a)], ['B', 'C', cm(b), 'A', { dim: 20 }]], size: [210, 120],
          draw: (bd, P) => bd.poly([P.A, P.M, P.C], TINT) });
        return aRad(`그림과 같이 ${segEq('AB', K(a), 'cm')}, ${segEq('BC', K(b), 'cm')}, ${angH('B', th)}인 평행사변형 ABCD에서 점 M이 ${SG('BC')}의 중점일 때, △AMC의 넓이는?`, S, AREA, {
          figure: f.b.svg(`평행사변형 ABCD와 BC의 중점 M, 색칠한 △AMC. AB의 길이는 ${a} cm, BC의 길이는 ${b} cm, ∠B = ${th}°`),
          explain: `△ABC = ${frac(1, 2)} × ${a} × ${b} × ${fn('sin', th)} = ${sh(half2(P0))}이고 M이 BC의 중점이므로 △AMC = ${frac(1, 2)}△ABC = ${L(S, AREA)}이다.`
        });
      }
      const [k, Dg] = d.pick([[3, 45], [2, 60]]), Ag = 180 - Dg, [a, b] = d.until(() => [2 * d.int(2, 7), d.int(3, 12)], ([x, y]) => x !== y && (x * y) % 8 === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      // BC = a, CD = b, ∠C = ∠A = Ag
      const P0 = mul(mul(K(a), K(b)), SIN[Dg]), S = mul(P0, [tm(1, 1, 4, '1', '4')]), mdl = para(b, a, Dg);
      mdl.O = mid(mdl.A, mdl.C);
      const dirM = (p) => Math.atan2(p[1] - mdl.O[1], p[0] - mdl.O[0]) / RAD, oAt = (dirM(mdl.B) + dirM(mdl.C)) / 2;
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['B', 'D']], sides: [['B', 'C', cm(a)], ['C', 'D', cm(b)]], names: ['A', 'B', 'C', 'D', 'O'], nameAt: { O: oAt }, size: [210, 110],
        draw: (bd, P) => bd.poly([P.O, P.C, P.D], TINT) });
      return aRad(`그림의 평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. ∠A : ∠D = ${k} : 1이고 ${segEq('BC', K(a), 'cm')}, ${segEq('CD', K(b), 'cm')}일 때, △OCD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`평행사변형 ABCD와 두 대각선의 교점 O, 색칠한 △OCD. BC의 길이는 ${a} cm, CD의 길이는 ${b} cm`),
        explain: `∠A + ∠D = 180°이고 ∠A : ∠D = ${k} : 1이므로 ∠D = ${Dg}°, ∠C = ∠A = ${Ag}°이다. □ABCD = ${a} × ${b} × ${sinOf(Ag)} = ${sh(P0)}이고 △OCD는 그 ${frac(1, 4)}이므로 ${L(S, AREA)}이다.`
      });
    }, { count: 2 })
  ];

  // ── 묶음 6: 여러 가지 도형의 넓이와 길이 ──
  // 원(반지름 r)과 중심각 120° 의 활꼴 넓이: (r²/3)π − (r²/4)√3
  const segArea = (r) => ({ pi: mul(K(r * r), [tm(1, 1, 3, '1', '3')]), tri: triArea(K(r), K(r), 120) });
  const figTypes = [
    T('fig-segment', '부채꼴에서 삼각형을 빼어 활꼴의 넓이 구하기', '①47', (d, n) => {
      const r = d.pick([6, 12, 18]), { pi, tri } = segArea(r), R = r;
      if (n === 1) {
        // 반원 O(지름 AB), ∠ABC = 30° → ∠BOC = 120°, 현 BC 와 호 BC 사이
        const mdl = { O: [0, 0], A: [-R, 0], B: [R, 0], C: polar([0, 0], R, 60), t1: [0, R] };
        const f = pic(mdl, { segs: [['A', 'B'], ['B', 'C']], angs: [['B', 'C', 'O', '30°', { r: 24 }]], sides: [['O', 'B', cm(r), 'C', { gap: 4 }]], size: [200, 110],
          draw: (b, P) => { const k = P.k * R; b.shape(`M${XY(P.B)}A${k} ${k} 0 0 0 ${XY(P.C)}Z`, [P.B, P.C], TINT); b.arc(P.O, k, 0, 180); b.dot(P.O); },
          names: ['A', 'B', 'C', 'O'], nameAt: { O: 270, A: 200, B: 340 } });
        return aPi(`그림과 같이 반지름의 길이가 ${r} cm인 반원 O에서 ∠ABC = 30°일 때, 색칠한 부분의 넓이는?`, pi, mul(tri, K(-1)), AREA, {
          figure: f.b.svg(`지름이 AB이고 중심이 O인 반원, 호 위의 점 C, 선분 BC. 반지름 ${r} cm, ∠ABC = 30°. 현 BC와 호 BC 사이를 색칠했다`),
          explain: `${SG('OB')} = ${SG('OC')}이므로 ∠OCB = 30°이고 ∠BOC = 180° − 2 × 30° = 120°이다. 부채꼴 OBC의 넓이는 π × ${r}<sup>2</sup> × ${frac(120, 360)} = ${sh(pi)}π, △OBC = ${areaTold(K(r), K(r), 120)} = ${sh(tri)}이므로 색칠한 부분의 넓이는 ${sh(pi)}π − ${sh(tri)} (${AREA})이다.`
        });
      }
      const mdl = { O: [0, 0], A: polar([0, 0], R, 210), B: polar([0, 0], R, 330), t1: [0, R], t2: [-R, 0], t3: [R, 0], t4: [0, -R] };
      const f = pic(mdl, { segs: [['O', 'A'], ['O', 'B'], ['A', 'B']], angs: [['O', 'A', 'B', '120°']], sides: [['O', 'B', cm(r), 'A']], size: [150, 150],
        draw: (b, P) => { const k = P.k * R; b.disk(P.O, k); b.shape(`M${XY(P.A)}A${k} ${k} 0 0 0 ${XY(P.B)}Z`, [P.A, P.B], TINT); b.dot(P.O); },
        names: ['A', 'B', 'O'], nameAt: { O: 90 } });
      return aPi(`그림과 같이 반지름의 길이가 ${r} cm인 원 O에서 ∠AOB = 120°일 때, 색칠한 부분의 넓이는?`, pi, mul(tri, K(-1)), AREA, {
        figure: f.b.svg(`중심이 O이고 반지름이 ${r} cm인 원, ∠AOB = 120°. 현 AB와 호 AB 사이(작은 쪽)를 색칠했다`),
        explain: `부채꼴 AOB의 넓이는 π × ${r}<sup>2</sup> × ${frac(120, 360)} = ${sh(pi)}π, △AOB = ${areaTold(K(r), K(r), 120)} = ${sh(tri)}이므로 색칠한 부분의 넓이는 ${sh(pi)}π − ${sh(tri)} (${AREA})이다.`
      });
    }, { count: 2 }),
    T('fig-semi-tri', '반원 위의 점으로 만든 삼각형의 넓이', '①49', (d) => {
      const r = 4 * d.int(1, 4), OD = mul(K(r), COS[60]), CD = mul(K(r), SIN[60]), AD = add(K(r), OD), S = half2(mul(AD, CD));
      const mdl = { O: [0, 0], A: [-r, 0], B: [r, 0], C: polar([0, 0], r, 60), D: [r / 2, 0], t1: [0, r] };
      const f = pic(mdl, { polys: [['C', 'A', 'D']], segs: [['A', 'B'], ['O', 'C']], rights: [['D', 'A', 'C']], angs: [['O', 'A', 'C', '120°']], sides: [['A', 'O', cm(r), 'C', { gap: 4 }]], size: [200, 110], fills: [TINT],
        draw: (b, P) => { b.arc(P.O, P.k * r, 0, 180); b.dot(P.O); }, nameAt: { O: 270, A: 200, B: 340, D: 270 } });
      return aRad(`그림과 같이 반지름의 길이가 ${r} cm인 반원 O에서 ∠AOC = 120°, ∠ADC = 90°일 때, △CAD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`지름이 AB이고 중심이 O인 반원, 호 위의 점 C, C에서 AB에 내린 수선의 발 D. 반지름 ${r} cm, ∠AOC = 120°. △CAD를 색칠했다`),
        explain: `∠COD = 180° − 120° = 60°이므로 ${SG('OD')} = ${r} ${fn('cos', 60)} = ${sh(OD)}, ${SG('CD')} = ${r} ${fn('sin', 60)} = ${sh(CD)}이다. ${SG('AD')} = ${r} + ${sh(OD)} = ${sh(AD)}이므로 △CAD = ${frac(1, 2)} × ${sh(AD)} × ${sh(CD)} = ${L(S, AREA)}이다.`
      });
    }),
    T('fig-regular', '원에 내접하는 정다각형의 넓이', '①50', (d, n) => {
      const R = 1;
      if (n === 1) {
        const r = d.int(2, 9), S = mul(triArea(K(r), K(r), 45), K(8)), Sg = KR(S[0].nv, S[0].m);
        const pts = {}; for (let i = 0; i < 8; i += 1) pts['p' + i] = polar([0, 0], R, 90 + 45 * i);
        const f = pic(Object.assign({ O: [0, 0] }, pts), { polys: [Object.keys(pts)], segs: [['O', 'p0'], ['O', 'p1']], size: [140, 140], names: ['O'], nameAt: { O: 270 },
          draw: (b, P) => { b.disk(P.O, P.k * R); b.poly([P.O, P.p0, P.p1], TINT); } });
        return aInt(`그림과 같이 원에 내접하는 정팔각형의 넓이가 ${L(Sg, AREA)}일 때, 이 원의 반지름의 길이는 몇 cm인가?`, sqrtV(div(Sg, mul(K(8), mul(half(1), SIN[45])))), 'cm', {
          figure: f.b.svg('중심이 O인 원에 내접하는 정팔각형. 중심과 이웃한 두 꼭짓점을 이은 삼각형 하나를 색칠했다'),
          explain: `반지름을 ${V('r')} cm라 하면 정팔각형은 꼭지각이 360° ÷ 8 = 45°인 이등변삼각형 8개로 나누어진다. 8 × ${frac(1, 2)} × ${V('r')} × ${V('r')} × ${fn('sin', 45)} = 2${rt(2)}${V('r')}<sup>2</sup> = ${sh(Sg)}이므로 ${V('r')}<sup>2</sup> = ${r * r}, ${V('r')} = ${r}이다.`
        });
      }
      const r = d.int(2, 12), S = mul(triArea(K(r), K(r), 30), K(12));
      const pts = {}; for (let i = 0; i < 12; i += 1) pts['p' + i] = polar([0, 0], R, 90 + 30 * i);
      const f = pic(Object.assign({ O: [0, 0] }, pts), { polys: [Object.keys(pts)], segs: [['O', 'p0'], ['O', 'p1']], size: [140, 140], names: ['O'], nameAt: { O: 270 },
        draw: (b, P) => { b.disk(P.O, P.k * R); b.poly([P.O, P.p0, P.p1], TINT); } });
      return aInt(`반지름의 길이가 ${r} cm인 원에 내접하는 정십이각형의 넓이는 몇 ${AREA}인가?`, S, AREA, {
        figure: f.b.svg('중심이 O인 원에 내접하는 정십이각형. 중심과 이웃한 두 꼭짓점을 이은 삼각형 하나를 색칠했다'),
        explain: `정십이각형은 꼭지각이 360° ÷ 12 = 30°이고 두 변이 ${r} cm인 이등변삼각형 12개로 나누어진다. 12 × ${areaTold(K(r), K(r), 30)} = ${L(S, AREA)}이다.`
      });
    }, { count: 2 }),
    T('fig-centroid', '무게중심으로 나눈 삼각형의 넓이', '①51', (d) => {
      const [a, b] = d.until(() => [d.int(4, 12), d.int(4, 14)], ([x, y]) => x !== y && (x * y) % 12 === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      const S = triArea(K(a), K(b), 60), S3 = mul(S, [tm(1, 1, 3, '1', '3')]), mdl = sasABC(b, a, 60);
      mdl.G = [(mdl.A[0] + mdl.B[0] + mdl.C[0]) / 3, (mdl.A[1] + mdl.B[1] + mdl.C[1]) / 3];
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['A', 'G'], ['G', 'C']], angs: [['B', 'C', 'A', '60°']], sides: [['A', 'B', cm(a), 'C'], ['B', 'C', cm(b), 'A']], size: [200, 120],
        draw: (bd, P) => bd.poly([P.A, P.G, P.C], TINT) });
      return aRad(`그림에서 점 G는 △ABC의 무게중심이다. ${segEq('AB', K(a), 'cm')}, ${segEq('BC', K(b), 'cm')}, ${angH('B', 60)}일 때, △AGC의 넓이는?`, S3, AREA, {
        figure: f.b.svg(`△ABC와 무게중심 G, 색칠한 △AGC. AB의 길이는 ${a} cm, BC의 길이는 ${b} cm, ∠B = 60°`),
        explain: `△ABC = ${areaTold(K(a), K(b), 60)} = ${sh(S)}이고 무게중심 G에 대하여 △AGC = ${frac(1, 3)}△ABC이므로 ${L(S3, AREA)}이다.`
      });
    }),
    T('fig-parallel', '평행선으로 넓이가 같은 삼각형으로 옮기기', '①52', (d) => {
      const [a, bc, ce] = d.until(() => [d.int(4, 10), d.int(4, 10), d.int(3, 8)], ([x, y, z]) => (x * (y + z)) % 4 === 0 && (y + z) / x < 2.8 && x / (y + z) < 1.4);
      const be = bc + ce, S = triArea(K(a), add(K(bc), K(ce)), 60);
      const A = polar([0, 0], a, 60), Cp = [bc, 0], E = [be, 0], dir = [Cp[0] - A[0], Cp[1] - A[1]];
      // D: E 를 지나고 AC 에 평행한 직선 위, A 높이의 0.8배
      const tD = (A[1] * 0.8) / dir[1], Dp = [E[0] + dir[0] * tD, E[1] + dir[1] * tD];
      const f = pic({ A, B: [0, 0], C: Cp, D: Dp, E }, { polys: [['A', 'B', 'C', 'D']], segs: [['A', 'C'], ['C', 'E'], ['D', 'E']], angs: [['B', 'C', 'A', '60°']], sides: [['A', 'B', cm(a), 'C'], ['B', 'C', cm(bc), 'A', { dim: 20 }], ['C', 'E', cm(ce), 'A', { dim: 20 }]], size: [210, 130],
        after: (b, P) => { b.arrow(P.A, P.C, 0.55); b.arrow(P.D, P.E, 0.55); } });
      return aRad(`그림의 □ABCD에서 ${nb(SG('AC') + ' ∥ ' + SG('DE'))}이고, 점 E는 ${SG('BC')}의 연장선 위에 있다. ${segEq('AB', K(a), 'cm')}, ${segEq('BC', K(bc), 'cm')}, ${segEq('CE', K(ce), 'cm')}, ${angH('B', 60)}일 때, □ABCD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`□ABCD와 BC의 연장선 위의 점 E. AC와 DE는 평행하다. AB의 길이는 ${a} cm, BC의 길이는 ${bc} cm, CE의 길이는 ${ce} cm, ∠B = 60°`),
        explain: `${SG('AC')} ∥ ${SG('DE')}이므로 △ACD와 △ACE는 밑변 AC가 같고 높이가 같아 넓이가 같다. 따라서 □ABCD = △ABC + △ACE = △ABE = ${areaTold(K(a), K(be), 60)} = ${L(S, AREA)}이다.`
      });
    }),
    T('fig-fold', '종이 띠를 접어 생긴 삼각형의 넓이', '①53', (d, n) => {
      if (n === 1) {
        const wd = 3 * d.int(1, 4), AC = 2 * wd, S = mul(K(wd * wd), [tm(3, 1, 3, '1', '3')]);   // ∠ACB = 30°, 넓이 w²/√3
        const th = 120, bc = wd / Math.sin(60 * RAD);
        const mdl = { B: [0, 0], C: [bc, 0], A: polar([0, 0], bc, th), q1: [-bc * 1.1, 0], q2: [bc * 1.6, 0], q3: [-bc * 1.1, wd], q4: [bc * 1.6, wd] };
        const f = pic(mdl, { polys: [['A', 'B', 'C']], fills: [TINT], thins: [['q1', 'q2'], ['q3', 'q4']], sides: [['A', 'C', cm(AC), 'B']], names: ['A', 'B', 'C'], nameAt: { A: 90, B: 270, C: 270 }, size: [220, 100],
          after: (b, P) => b.dim(P.q3, P.q1, cm(wd), [P.q3[0] + 30, (P.q3[1] + P.q1[1]) / 2], 10) });
        return aRad(`폭이 ${wd} cm인 직사각형 모양의 종이 띠를 그림과 같이 ${SG('AC')}를 접는 선으로 하여 접었더니 ${segEq('AC', K(AC), 'cm')}이었다. 겹쳐진 부분 △ABC의 넓이는?`, S, AREA, {
          figure: f.b.svg(`폭이 ${wd} cm인 종이 띠를 AC를 접는 선으로 접어 생긴 △ABC(색칠). AC의 길이는 ${AC} cm`),
          explain: `A에서 B, C가 있는 쪽 변까지의 거리가 ${wd} cm이고 ${SG('AC')} = ${AC} cm이므로 ${fn('sin', 30)} = ${frac(wd, AC)}에서 ∠ACB = 30°이다. 접은 각과 엇각이 같아 ∠BAC = ∠ACB = 30°이므로 ∠ABC = 120°이고, ${SG('AB')} = ${SG('BC')}이다. 넓이는 ${frac(1, 2)} × ${SG('AC')} × (${SG('AC')}에 대한 높이)로 셈하면 ${frac(1, 2)} × ${AC} × (${wd} ${fn('tan', 30)}) = ${L(S, AREA)}이다.`
        });
      }
      const th = d.pick([45, 60]), wd = th === 45 ? 2 * d.int(1, 5) : 3 * d.int(1, 4);
      const AB = div(K(wd), SIN[th]), S = half2(mul(AB, K(wd)));
      const ab = fv(AB), mdl = { B: [0, 0], C: [ab, 0], A: polar([0, 0], ab, th), q1: [-ab * 0.7, 0], q2: [ab * 2, 0], q3: [-ab * 0.7, wd], q4: [ab * 2, wd] };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], fills: [TINT], thins: [['q1', 'q2'], ['q3', 'q4']], angs: [['B', 'C', 'A', th + '°']], names: ['A', 'B', 'C'], nameAt: { A: 90, B: 270, C: 270 }, size: [220, 100],
        after: (b, P) => b.dim(P.q3, P.q1, cm(wd), [P.q3[0] + 30, (P.q3[1] + P.q1[1]) / 2], 10) });
      return aRad(`폭이 ${wd} cm인 직사각형 모양의 종이 띠를 그림과 같이 ${SG('AC')}를 접는 선으로 하여 접었다. ∠ABC = ${th}°일 때, 겹쳐진 부분 △ABC의 넓이는?`, S, AREA, {
        figure: f.b.svg(`폭이 ${wd} cm인 종이 띠를 AC를 접는 선으로 접어 생긴 △ABC(색칠). ∠ABC = ${th}°`),
        explain: `${SG('AB')} = ${frac(wd, fn('sin', th))} = ${sh(AB)}이다. 접은 각과 엇각이 같아 ∠BAC = ∠BCA이므로 ${SG('BC')} = ${SG('AB')} = ${sh(AB)}이고, 높이가 ${wd}이므로 △ABC = ${frac(1, 2)} × ${sh(AB)} × ${wd} = ${L(S, AREA)}이다.`
      });
    }, { count: 2 }),
    T('fig-strips', '폭이 다른 두 띠가 겹쳐진 부분의 넓이', '①54', (d) => {
      const th = d.pick([45, 60]), [p, q] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y && Math.max(x, y) / Math.min(x, y) <= 2 && (th === 45 || (x * y) % 3 === 0));
      const s1 = div(K(p), SIN[th]), s2 = div(K(q), SIN[th]), S = mul(mul(s1, s2), SIN[th]);
      // 띠 1: 가로(폭 p), 띠 2: 기울기 th(폭 q). 겹친 부분 평행사변형
      const a1 = q / Math.sin(th * RAD), a2 = p / Math.sin(th * RAD), P0 = [0, 0], P1 = [a1, 0], P3 = polar(P0, a2, th), P2 = [P1[0] + P3[0], P3[1]];
      const ext = 1.6, u = [Math.cos(th * RAD), Math.sin(th * RAD)];
      const mdl = { A: P0, B: P1, C: P2, D: P3, h1: [-a1 * ext, 0], h2: [a1 * (1 + ext), 0], h3: [-a1 * ext, p], h4: [a1 * (1 + ext), p], s1: [P0[0] - u[0] * a2 * 0.9, P0[1] - u[1] * a2 * 0.9], s2: [P3[0] + u[0] * a2 * 0.9, P3[1] + u[1] * a2 * 0.9], s3: [P1[0] - u[0] * a2 * 0.9, P1[1] - u[1] * a2 * 0.9], s4: [P2[0] + u[0] * a2 * 0.9, P2[1] + u[1] * a2 * 0.9] };
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], fills: [TINT], thins: [['h1', 'h2'], ['h3', 'h4'], ['s1', 's2'], ['s3', 's4']], angs: [['A', 'B', 'D', th + '°']], names: [], size: [220, 130] });
      return aRad(`폭이 ${p} cm, ${q} cm인 두 종이 띠를 그림과 같이 ${th}°의 각을 이루도록 겹쳐 놓았다. 겹쳐진 부분의 넓이는?`, S, AREA, {
        figure: f.b.svg(`폭이 ${p} cm인 가로 띠와 폭이 ${q} cm인 기울어진 띠가 ${th}°를 이루며 겹친 평행사변형(색칠)`),
        explain: `겹쳐진 부분은 평행사변형이다. 가로 띠의 폭 ${p} cm가 기울어진 변의 높이이므로 기울어진 변은 ${frac(p, fn('sin', th))} = ${sh(s1)}, 기울어진 띠의 폭 ${q} cm로 가로 변은 ${frac(q, fn('sin', th))} = ${sh(s2)}이다. 넓이는 ${sh(s1)} × ${sh(s2)} × ${fn('sin', th)} = ${L(S, AREA)}이다.`
      });
    }),
    T('fig-angle-area', '넓이로 삼각형 안의 각의 sin 값 구하기', '①55', (d, n) => {
      if (n === 1) {
        // 이등변삼각형 AB = AC = s, BC = t: 높이 √(s² − t²/4), sin A = 2 × 넓이 ÷ s²
        const [s, t] = d.until(() => [d.int(3, 9), d.int(2, 8)], ([x, y]) => y < 2 * x - 1 && y !== x && !Number.isInteger(Math.sqrt(4 * x * x - y * y)));
        const hgt = sqrtV(sub(K(s * s), mul(K(t * t), [tm(1, 1, 4, '1', '4')]))), S = half2(mul(K(t), hgt)), sinA = div(mul(K(2), S), K(s * s));
        const sinB = div(hgt, K(s)), cosB = [tm(1, t, 2 * s, String(t), `2*${s}`)], wrong = [sinB, cosB, div(K(t), K(s)), div(mul(K(t), hgt), K(s * s)), div(hgt, K(t))];
        const mdl = { B: [0, 0], C: [t, 0], A: [t / 2, fv(hgt)] };
        const f = pic(mdl, { polys: [['A', 'B', 'C']], ticks: [['A', 'B', 1], ['A', 'C', 1]], sides: [['A', 'B', cm(s), 'C'], ['A', 'C', cm(s), 'B'], ['B', 'C', cm(t), 'A']], size: [150, 150] });
        return pickV(d, `그림과 같이 ${nb(SG('AB') + ' = ' + SG('AC') + ' = ' + s + ' cm')}, ${segEq('BC', K(t), 'cm')}인 △ABC에서 sin A의 값은?`, sinA, wrong, {
          figure: f.b.svg(`AB = AC인 이등변삼각형 ABC. AB와 AC의 길이는 ${s} cm, BC의 길이는 ${t} cm`),
          explain: `A에서 BC에 내린 수선의 발을 M이라 하면 ${SG('BM')} = ${sh(div(K(t), K(2)))}, ${SG('AM')} = ${sh(hgt)}이므로 △ABC = ${sh(S)}이다. ${frac(1, 2)} × ${s} × ${s} × sin A = ${sh(S)}이므로 sin A = ${sh(sinA)}이다.`
        });
      }
      // ∠C = 90°, D 는 AC 위의 점, AD = DC = BC = u(교과서 꼴 그대로 — 셋이 다르면 sin x 가 41√73/365 같은 수가 된다), ∠ABD = x
      const u = d.int(1, 6), v = u;
      const AB2 = 4 * u * u + v * v, BD2 = u * u + v * v, S = K(u * v);   // 2 × △ABD = AD × BC
      const prod = sqrtV(K(AB2 * BD2)), sinX = div(S, prod), cosX = div(K(AB2 + BD2 - u * u), mul(K(2), prod)), tanX = div(sinX, cosX);
      const sinDBC = div(K(u), sqrtV(K(BD2))), cosABC = div(K(v), sqrtV(K(AB2)));
      const mdl = { C: [0, 0], B: [0, v], D: [-u, 0], A: [-2 * u, 0] };
      const f = pic(mdl, { polys: [['A', 'C', 'B']], segs: [['B', 'D']], rights: [['C', 'D', 'B']], ticks: [['A', 'D', 1], ['D', 'C', 1]], angs: [['B', 'A', 'D', sv('x') + '°', { r: 26 }]], sides: [['C', 'B', cm(v), 'A']], size: [200, 120],
        after: (b, P) => b.text([(P.A[0] + P.D[0]) / 2, P.A[1] + 24], cm(u), { blue: true }) });
      return pickV(d, `그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 점 D는 ${SG('AC')} 위의 점이고 ${nb(SG('AD') + ' = ' + SG('DC') + ' = ' + SG('BC') + ' = ' + u + ' cm')}이다. ∠ABD = ${V('x')}°일 때, ${nb('sin ' + V('x') + '°')}의 값은?`, sinX, [cosX, tanX, sinDBC, cosABC, div(K(u), sqrtV(K(AB2)))], {
        figure: f.b.svg(`∠C = 90°인 직각삼각형 ABC와 AC 위의 점 D. AD와 DC의 길이는 ${u} cm, BC의 길이는 ${v} cm, ∠ABD = x°`),
        explain: `△ABD = ${frac(1, 2)} × ${u} × ${v} = ${sh(half2(S))}이다. ${SG('AB')} = ${sh(sqrtV(K(AB2)))}, ${SG('BD')} = ${sh(sqrtV(K(BD2)))}이고 △ABD = ${frac(1, 2)} × ${SG('AB')} × ${SG('BD')} × ${nb('sin ' + V('x') + '°')}이므로 ${nb('sin ' + V('x') + '°')} = ${sh(sinX)}이다.`
      });
    }, { count: 2 }),
    T('fig-bisector', '넓이로 각의 이등분선의 길이 구하기', '①56', (d) => {
      const [b, c] = d.until(() => [d.int(3, 12), d.int(3, 12)], ([x, y]) => x !== y && (x * y) % (x + y) !== 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      const AD = div(K(b * c), K(b + c));
      const mdl = { A: [0, 0], B: [-c * Math.sin(60 * RAD), -c * Math.cos(60 * RAD)], C: [b * Math.sin(60 * RAD), -b * Math.cos(60 * RAD)] };
      const t = c / (b + c); mdl.D = [mdl.B[0] + (mdl.C[0] - mdl.B[0]) * t, mdl.B[1] + (mdl.C[1] - mdl.B[1]) * t];
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], sides: [['A', 'B', cm(c), 'C'], ['A', 'C', cm(b), 'B']], size: [210, 100],
        after: (b, P) => { const aB = dirOf(P.A, P.B), aC = dirOf(P.A, P.C); b.angle(P.A, aB, aC, '', { r: 12 }); b.text(at(P.A, 30, (aB + aC) / 2 - 32), '120°', { blue: true }); } });
      return aFr(`그림과 같이 ${segEq('AB', K(c), 'cm')}, ${segEq('AC', K(b), 'cm')}, ∠BAC = 120°인 △ABC에서 ${SG('AD')}가 ∠BAC의 이등분선일 때, ${SG('AD')}의 길이는 몇 cm인가?`, AD, 'cm', {
        figure: f.b.svg(`△ABC와 ∠BAC의 이등분선 AD(D는 BC 위). AB의 길이는 ${c} cm, AC의 길이는 ${b} cm, ∠BAC = 120°`),
        explain: `△ABC = △ABD + △ADC이므로 ${frac(1, 2)} × ${c} × ${b} × ${fn('sin', 60)} = ${frac(1, 2)} × ${c} × ${SG('AD')} × ${fn('sin', 60)} + ${frac(1, 2)} × ${b} × ${SG('AD')} × ${fn('sin', 60)}이다. 양변을 ${frac(1, 2)} × ${fn('sin', 60)}로 나누면 ${c * b} = ${b + c} × ${SG('AD')}이므로 ${SG('AD')} = ${L(AD, 'cm')}이다.`
      });
    }),
    T('fig-equi', '정삼각형 안의 합동인 삼각형으로 변의 길이 구하기', '①57', (d) => {
      const [p, q] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([x, y]) => x !== y && isK(sqrtV(K(x * x + y * y - x * y))));
      const s = p + q, FH = mul(K(q), SIN[60]), AH = mul(K(q), COS[60]), DH = sub(K(p), AH), DF = third(FH, DH);
      const A = [s / 2, s * Math.sqrt(3) / 2], Bp = [0, 0], Cp = [s, 0], at2 = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
      const mdl = { A, B: Bp, C: Cp, D: at2(A, Bp, p / s), E: at2(Bp, Cp, q / s), F: at2(A, Cp, q / s) };
      const f = pic(mdl, { polys: [['A', 'B', 'C'], ['D', 'E', 'F']], sides: [['A', 'D', cm(p), 'C'], ['A', 'F', cm(q), 'B']], size: [170, 150] });
      return aRad(`그림과 같이 한 변의 길이가 ${s} cm인 정삼각형 ABC에서 ${segEq('AD', K(p), 'cm')}, ${segEq('AF', K(q), 'cm')}이고 △ADF ≡ △BED ≡ △CFE일 때, ${SG('EF')}의 길이는?`, DF.len, 'cm', {
        figure: f.b.svg(`정삼각형 ABC와 세 변 위의 점 D, E, F로 만든 △DEF. 한 변 ${s} cm, AD의 길이는 ${p} cm, AF의 길이는 ${q} cm`),
        explain: `△ADF ≡ △CFE이므로 ${SG('EF')} = ${SG('DF')}이다. F에서 AB에 수선 FH를 그으면 ∠A = 60°이므로 ${SG('FH')} = ${q} ${fn('sin', 60)} = ${sh(FH)}, ${SG('AH')} = ${q} ${fn('cos', 60)} = ${sh(AH)}이므로 ${SG('DH')} = ${sh(fv(DH) < 0 ? mul(DH, K(-1)) : DH)}이다. ${SG('DF')} = ${rt(sqH(pq(FH)) + ' + ' + sqH(pq(fv(DH) < 0 ? mul(DH, K(-1)) : DH)))} = ${L(DF.len, 'cm')}이다.`
      });
    }),
    T('fig-cone', '모선과 각으로 원뿔의 부피 구하기', '심12', (d) => {
      const th = d.pick([60, 45]), len = d.pick([6, 12]), r0 = mul(K(len), COS[th]), h0 = mul(K(len), SIN[th]);
      const Vv = mul(mul(mul(r0, r0), h0), [tm(1, 1, 3, '1', '3')]);
      if (!isK(Vv)) throw new Error('부피가 k√m 꼴이 아니다');
      const r = fv(r0), h = fv(h0), mdl = { A: [0, h], B: [-r, 0], C: [r, 0], H: [0, 0], e1: [-r, -r * 0.3], e2: [r, r * 0.3] };
      const f = pic(mdl, { segs: [['A', 'B'], ['A', 'C']], cuts: [['A', 'H'], ['B', 'H']], rights: [['H', 'B', 'A']], angs: [['A', 'B', 'H', (90 - th) + '°', { r: 26 }]], sides: [['A', 'B', cm(len), 'H']], names: ['A', 'B', 'H'], size: [150, 150],
        draw: (b, P) => { const rx = P.k * r, ry = rx * 0.3; b.shape(`M${XY(P.B)}A${rx} ${ry} 0 0 0 ${XY(P.C)}`, [P.B, P.C, P.e1, P.e2]); b.shape(`M${XY(P.C)}A${rx} ${ry} 0 0 0 ${XY(P.B)}`, [P.B, P.C], 'fill:none;stroke-dasharray:4 3'); } });
      const t = Vv[0];
      return seal(inline(`그림과 같이 모선의 길이가 ${len} cm인 원뿔에서 ∠BAH = ${90 - th}°일 때, 원뿔의 부피는? (단, H는 밑면의 중심이다.) (근호 앞의 수가 1이면 1을 적는다.)`, grp('{0}' + rt('{1}') + 'π cm³'), [{ answer: t.nv }, { answer: t.m }], Object.assign(more({
        figure: f.b.svg(`원뿔. 꼭짓점 A, 밑면의 중심 H, 밑면의 둘레 위의 점 B. 모선 AB의 길이는 ${len} cm, ∠BAH = ${90 - th}°`),
        explain: `직각삼각형 ABH에서 밑면의 반지름은 ${SG('BH')} = ${len} ${fn('sin', 90 - th)} = ${sh(r0)}, 높이는 ${SG('AH')} = ${len} ${fn('cos', 90 - th)} = ${sh(h0)}이므로 부피는 ${frac(1, 3)} × π × (${sh(r0)})<sup>2</sup> × ${sh(h0)} = ${sh(Vv)}π (cm³)이다.`
      }, { calc: [[calcOf(t), 0], [String(t.m), 1]] }), { shown: nb(sh(Vv) + 'π cm³') })));
    })
  ];

  B.addTypes(UNIT, 'area', areaTypes);
  B.addTypes(UNIT, 'quad', quadTypes);
  B.addTypes(UNIT, 'figure', figTypes);
})(typeof window !== 'undefined' ? window : globalThis);
