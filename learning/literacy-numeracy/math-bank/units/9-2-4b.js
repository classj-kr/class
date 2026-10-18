// 중학교 3학년 2학기 4단원 원주각 — 뒤쪽 묶음
// (원에 내접하는 사각형, 네 점이 한 원 위에 있을 조건, 원의 접선과 현이 이루는 각).
// 단원 틀과 원 그림 도구(B.kit.m924), 싣는 기준, 뺀 것과 까닭은 9-2-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 파일에서 지킨 것
//  - 네 점이 한 원 위에 있는지를 따지는 그림(con-same-side, con-given, con-make)은 원을 그리지 않는다(원은 문제의 결론이다). 점은 실제로 한 원 위에 놓아 수치를 맞춘다.
//  - 접선과 현이 이루는 각은 「그 각의 안쪽에 있는 호」에 대한 원주각과 같다는 것을 풀이마다 적는다. 접선 위의 점(T, P, Q, E)은 그 호가 있는 쪽에 둔다.
//  - 원 밖의 한 점에서 그은 두 접선은 접점과 중심을 이은 반지름이 접선에 수직이라는 것(9-2-3)을 쓰고, 접선의 길이가 같다는 것은 이등변삼각형으로만 쓴다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C } = B.kit;
  const { V, nb, rt } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT, Board } = B.kit.mgeo;
  const K = B.kit.m924;
  const { UNIT, S19, T, X, Y, HALF, sg, deg, gcd, degQ, cmQ, degs, piQ, radQ, pickOne, allQ, Circ, even, sure, angAt, angOf, reach, foot } = K;
  const TAGS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];
  const tagged = (rows) => lines(rows.map((h, i) => `${TAGS[i]}. ${h}`));

  // 원 위의 사각형 ABCD(시계 반대쪽 차례)의 네 호 AB, BC, CD, DA(짝수 도). 모두 lo 이상 hi 이하.
  const quadArcs = (d, lo, hi, ok) => d.until(() => { const a = even(d, lo, hi), b2 = even(d, lo, hi), c = even(d, lo, hi); return { ab: a, bc: b2, cd: c, da: 360 - a - b2 - c }; }, (w) => w.da >= lo && w.da <= hi && (!ok || ok(w)));
  // 사각형 ABCD 의 네 내각(호로 셈한다)
  const quadAngles = (w) => ({ A: (w.bc + w.cd) / 2, B: (w.cd + w.da) / 2, C: (w.da + w.ab) / 2, D: (w.ab + w.bc) / 2 });
  // 꼭짓점 A 를 start° 에 두고 시계 반대쪽으로 B, C, D 를 놓는다.
  const quadOn = (w, start) => ({ A: start, B: start + w.ab, C: start + w.ab + w.bc, D: start + w.ab + w.bc + w.cd });

  // ── 묶음: 원에 내접하는 사각형 ──
  const types5 = [
    T('cyc-opposite', '원에 내접하는 사각형의 대각의 크기의 합', '①38', (d) => {
      const w = quadArcs(d, 56, 124, (v) => { const q = quadAngles(v); return q.A !== q.B && q.A !== 90 && q.B !== 90 && Math.abs(q.A - q.B) >= 6; }), q = quadAngles(w);
      const S = Circ().center().on(quadOn(w, 115 + d.int(-10, 10))).seg('AB BC CD DA').ang('DAB', deg(q.A)).ang('ABC', deg(q.B)).ang('BCD', sv('x'), { square: false }).ang('CDA', sv('y'), { square: false }).names();
      sure(angOf(S, 'DAB'), q.A); sure(angOf(S, 'BCD'), 180 - q.A); sure(angOf(S, 'CDA'), 180 - q.B);
      return degs(`그림과 같이 □ABCD가 원 O에 내접하고 ∠A = ${q.A}°, ∠B = ${q.B}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', 180 - q.A], ['∠y', 180 - q.B]], {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD. ∠A = ${q.A}°, ∠B = ${q.B}°, ∠C = x, ∠D = y`),
        explain: `원에 내접하는 사각형에서 한 쌍의 대각의 크기의 합은 180°이다. ∠${X} = 180° − ${q.A}° = ${180 - q.A}°, ∠${Y} = 180° − ${q.B}° = ${180 - q.B}°이다.`,
        facts: { calc: [[`180-${q.A}`, 0], [`180-${q.B}`, 1]], unseen: [180] }
      });
    }),
    T('cyc-exterior', '원에 내접하는 사각형의 한 외각과 그 대각', '①39', (d) => {
      const w = quadArcs(d, 56, 124, (v) => { const q = quadAngles(v); return q.A !== 90 && q.B !== 90 && q.C > 60 && Math.abs(q.A + q.B - 180) >= 8; }), q = quadAngles(w);
      const S = Circ().center().on(quadOn(w, 115 + d.int(-10, 10)));
      S.put({ E: at(S.P.C, 40, dirOf(S.P.B, S.P.C)) }).seg('AB BC CD DA CE').ang('DCE', deg(q.A)).ang('ABC', deg(q.B)).ang('DAB', sv('x'), { square: false }).ang('CDA', sv('y'), { square: false }).names();
      sure(angOf(S, 'DCE'), q.A); sure(angOf(S, 'CDA'), 180 - q.B);
      return degs(`그림과 같이 □ABCD가 원 O에 내접하고 점 E는 변 BC의 연장선 위의 점이다. ∠DCE = ${q.A}°, ∠ABC = ${q.B}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', q.A], ['∠y', 180 - q.B]], {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD와 변 BC를 점 C 너머로 늘인 직선 위의 점 E. ∠DCE = ${q.A}°, ∠ABC = ${q.B}°, ∠BAD = x, ∠ADC = y`),
        explain: `원에 내접하는 사각형의 한 외각의 크기는 그 외각과 이웃한 내각의 대각의 크기와 같으므로 ∠${X} = ∠DCE = ${q.A}°이다. 대각의 크기의 합은 180°이므로 ∠${Y} = 180° − ${q.B}° = ${180 - q.B}°이다.`,
        facts: { calc: [[`${q.A}`, 0], [`180-${q.B}`, 1]], unseen: [180] }
      });
    }),
    T('cyc-ext-central', '원에 내접하는 사각형의 외각과 중심각', '①40', (d) => {
      const w = quadArcs(d, 50, 130, (v) => { const q = quadAngles(v); return q.A >= 50 && q.A <= 86; }), q = quadAngles(w), x = 2 * q.A;
      const S = Circ().center().on(quadOn(w, 120 + d.int(-10, 10)));
      S.put({ E: at(S.P.C, 40, dirOf(S.P.B, S.P.C)) }).seg('AB BC CD DA CE OB OD').ang('DCE', deg(q.A)).ang('BOD', sv('x'), { square: false }).names();
      sure(angOf(S, 'BOD'), x); sure(angOf(S, 'DCE'), q.A);
      return degQ(`그림과 같이 □ABCD가 원 O에 내접하고 점 E는 변 BC의 연장선 위의 점이다. ∠DCE = ${q.A}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD와 변 BC를 점 C 너머로 늘인 직선 위의 점 E. 반지름 OB, OD가 그어져 있다. ∠DCE = ${q.A}°, 점 C 쪽으로 벌어진 ∠BOD = x`),
        explain: `원에 내접하는 사각형의 한 외각의 크기는 그 내대각의 크기와 같으므로 ∠BAD = ${q.A}°이다. ∠${X}는 호 BCD에 대한 중심각이므로 2 × ${q.A}° = ${x}°이다.`,
        facts: { calc: [[`2*${q.A}`, 0]], unseen: [2] }
      });
    }),
    T('cyc-diagonal', '대각선을 그은 내접사각형에서 같은 호와 대각을 함께 쓰기', '①41', (d, n) => {
      if (n === 0) {
        const w = quadArcs(d, 50, 130, (v) => v.cd >= 44 && v.da >= 48 && v.cd !== v.da), q = quadAngles(w), a = w.cd / 2, x = w.da / 2;
        const S = Circ().center().on(quadOn(w, 110 + d.int(-10, 10))).seg('AB BC CD DA AC').ang('ABC', deg(q.B)).ang('CAD', deg(a)).ang('ACD', sv('x'), { square: false }).names();
        sure(angOf(S, 'ABC'), q.B); sure(angOf(S, 'CAD'), a); sure(angOf(S, 'ACD'), x);
        return degQ(`그림과 같이 □ABCD가 원 O에 내접하고 ∠ABC = ${q.B}°, ∠CAD = ${a}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O에 내접하는 사각형 ABCD와 대각선 AC. ∠ABC = ${q.B}°, ∠CAD = ${a}°, ∠ACD = x`),
          explain: `원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 ∠ADC = 180° − ${q.B}° = ${180 - q.B}°이다. △ACD에서 ∠${X} = 180° − (${a}° + ${180 - q.B}°) = ${x}°이다.`,
          facts: { calc: [[`180-${a}-(180-${q.B})`, 0]], unseen: [180] }
        });
      }
      const w = quadArcs(d, 50, 130, (v) => v.cd >= 44 && v.da >= 44 && v.cd !== v.da && v.cd + v.da <= 180), s = w.da / 2, t = w.cd / 2, x = s + t;
      const S = Circ().center().on(quadOn(w, 105 + d.int(-10, 10)));
      S.put({ E: at(S.P.D, 38, dirOf(S.P.A, S.P.D)) }).seg('AB BC CD DA AC BD DE').ang('ACD', deg(s)).ang('CBD', deg(t)).ang('CDE', sv('x'), { square: false }).names();
      sure(angOf(S, 'ACD'), s); sure(angOf(S, 'CBD'), t); sure(angOf(S, 'CDE'), x);
      return degQ(`그림과 같이 □ABCD가 원에 내접하고 점 E는 변 AD의 연장선 위의 점이다. ∠ACD = ${s}°, ∠CBD = ${t}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원에 내접하는 사각형 ABCD와 두 대각선 AC, BD. 점 E는 변 AD를 점 D 너머로 늘인 직선 위에 있다. ∠ACD = ${s}°, ∠CBD = ${t}°, ∠CDE = x`),
        explain: `∠ABD와 ∠ACD는 모두 호 AD에 대한 원주각이므로 ∠ABD = ${s}°이고 ∠ABC = ${s}° + ${t}° = ${x}°이다. 원에 내접하는 사각형의 한 외각의 크기는 그 내대각의 크기와 같으므로 ∠${X} = ∠ABC = ${x}°이다.`,
        facts: { calc: [[`${s}+${t}`, 0]] }
      });
    }, { count: 2 }),
    T('cyc-tri', '삼각형의 내각으로 내접사각형의 대각 구하기', '①42', (d, n) => {
      if (n === 0) {
        const w = quadArcs(d, 50, 130, (v) => v.bc >= 44 && v.cd >= 44 && v.bc !== v.cd), p = w.cd / 2, q = w.bc / 2, x = p + q;
        const S = Circ().center().on(quadOn(w, 120 + d.int(-10, 10))).seg('AB BC CD DA BD').ang('CBD', deg(p)).ang('CDB', deg(q)).ang('BAD', sv('x'), { square: false }).names();
        sure(angOf(S, 'CBD'), p); sure(angOf(S, 'CDB'), q); sure(angOf(S, 'BAD'), x);
        return degQ(`그림과 같이 □ABCD가 원에 내접하고 ∠CBD = ${p}°, ∠CDB = ${q}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원에 내접하는 사각형 ABCD와 대각선 BD. ∠CBD = ${p}°, ∠CDB = ${q}°, ∠BAD = x`),
          explain: `△BCD에서 ∠BCD = 180° − (${p}° + ${q}°) = ${180 - p - q}°이다. 원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 ∠${X} = 180° − ${180 - p - q}° = ${x}°이다.`,
          facts: { calc: [[`180-(180-${p}-${q})`, 0]], unseen: [180] }
        });
      }
      const a = even(d, 30, 76), turn = d.int(-8, 8), x = 90 + a / 2;
      const S = Circ().center().on({ A: 90 + turn, B: 270 - a + turn, C: 270 + a + turn, D: 270 + a + turn + d.int(40, 140 - a) }).seg('AB BC CD DA AC').tick('AB AC').ang('BAC', deg(a)).ang('ADC', sv('x'), { square: false }).names();
      sure(angOf(S, 'BAC'), a); sure(angOf(S, 'ADC'), x);
      return degQ(`그림과 같이 □ABCD가 원에 내접하고 ${sg('AB')} = ${sg('AC')}, ∠BAC = ${a}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원에 내접하는 사각형 ABCD와 대각선 AC. 변 AB와 대각선 AC에 길이가 같다는 표시가 있다. ∠BAC = ${a}°, ∠ADC = x`),
        explain: `△ABC는 이등변삼각형이므로 ∠ABC = (180° − ${a}°) ÷ 2 = ${90 - a / 2}°이다. 원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 ∠${X} = 180° − ${90 - a / 2}° = ${x}°이다.`,
        facts: { calc: [[`180-(180-${a})/2`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('cyc-central', '중심각과 원에 내접하는 사각형', '①43', (d) => {
      const c = even(d, 84, 164), turn = d.int(-8, 8), x = c / 2;
      const S = Circ().center().on({ A: 90 + turn + d.int(-25, 25), B: 270 - c / 2 + turn, C: 270 + turn + d.int(-Math.floor(c / 5), Math.floor(c / 5)), D: 270 + c / 2 + turn }).seg('AB AD CB CD OB OD').ang('BOD', deg(c), { r: 12 }).ang('BAD', sv('x'), { square: false }).ang('BCD', sv('y'), { square: false }).names({ O: 90 + turn });
      sure(angOf(S, 'BOD'), c); sure(angOf(S, 'BAD'), x); sure(angOf(S, 'BCD'), 180 - x);
      return degs(`그림과 같이 □ABCD가 원 O에 내접하고 ∠BOD = ${c}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', x], ['∠y', 180 - x]], {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD. 반지름 OB, OD가 그어져 있고 점 C 쪽으로 벌어진 ∠BOD = ${c}°이다. ∠BAD = x, ∠BCD = y`),
        explain: `∠BAD는 호 BCD에 대한 원주각이므로 ∠${X} = ${HALF} × ${c}° = ${x}°이다. 원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 ∠${Y} = 180° − ${x}° = ${180 - x}°이다.`,
        facts: { calc: [[`${c}/2`, 0], [`180-${c}/2`, 1]], unseen: [2, 180] }
      });
    }),
    T('cyc-radius', '반지름을 그어 내접사각형의 한 내각을 나누기', '①44', (d) => {
      const c = d.int(104, 140), half = 180 - c, turn = d.int(-8, 8);
      const S = Circ().center().on({ A: 90 + turn + d.int(-12, 12), B: 270 - half + turn, C: 270 + turn + d.int(-Math.floor(half / 3), Math.floor(half / 3)), D: 270 + half + turn }).seg('AB AD BC CD OB OD').ang('BCD', deg(c), { r: 11 }).ang('OBA', sv('x'), { square: false }).ang('ODA', sv('y'), { square: false }).names({ O: 270 + turn });
      sure(angOf(S, 'BCD'), c); sure(angOf(S, 'OBA') + angOf(S, 'ODA'), half);
      return degQ(`그림과 같이 □ABCD가 원 O에 내접하고 ∠BCD = ${c}°일 때, ∠${X} + ∠${Y}의 크기는?`, half, {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD. 반지름 OB, OD가 그어져 있고 점 O는 △ABD의 내부에 있다. ∠BCD = ${c}°, ∠OBA = x, ∠ODA = y`),
        explain: `원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 ∠BAD = 180° − ${c}° = ${half}°이다. 반지름 OA를 그으면 ${sg('OA')} = ${sg('OB')} = ${sg('OD')}이므로 ∠OAB = ∠${X}, ∠OAD = ∠${Y}이고 ∠${X} + ∠${Y} = ∠BAD = ${half}°이다.`,
        facts: { calc: [[`180-${c}`, 0]], unseen: [180] }
      });
    }),
    T('cyc-diameter', '지름이 한 변인 원에 내접하는 사각형', '①45', (d) => {
      const a = d.int(18, 40), turn = d.int(-10, 10), x = 90 + a;
      const S = Circ().center().on({ A: 180 + turn, D: turn, C: 2 * a + turn, B: 2 * a + turn + d.int(30, 150 - 2 * a) }).seg('AB BC CD DA AC').ang('CAD', deg(a)).ang('ABC', sv('x'), { square: false }).names();
      sure(angOf(S, 'CAD'), a); sure(angOf(S, 'ABC'), x);
      return degQ(`그림과 같이 □ABCD가 원 O에 내접하고 선분 AD는 원 O의 지름이다. ∠CAD = ${a}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD. 변 AD는 원 O의 지름이고 대각선 AC가 그어져 있다. ∠CAD = ${a}°, ∠ABC = x`),
        explain: `∠ACD는 반원에 대한 원주각이므로 90°이고 ∠ADC = 90° − ${a}° = ${90 - a}°이다. 대각의 크기의 합은 180°이므로 ∠${X} = 180° − ${90 - a}° = ${x}°이다.`,
        facts: { calc: [[`180-(90-${a})`, 0]], unseen: [180, 90] }
      });
    }),
    T('cyc-pentagon', '원에 내접하는 오각형과 다섯 점 — 보조선으로 내접사각형 찾기', '①46 심6·10', (d, n) => {
      const arcs = d.until(() => { const a = [even(d, 50, 96), even(d, 50, 96), even(d, 50, 96), even(d, 50, 96)]; return a.concat([360 - a.reduce((s, v) => s + v, 0)]); }, (a) => a[4] >= 50 && a[4] <= 96);
      const [ab, bc, cd, de, ea] = arcs, start = 100 + d.int(-10, 10), on = { A: start, B: start + ab, C: start + ab + bc, D: start + ab + bc + cd, E: start + ab + bc + cd + de };
      const angA = (bc + cd + de) / 2, angD = (ea + ab + bc) / 2, angB = (cd + de + ea) / 2, angE = (ab + bc + cd) / 2;
      if (n === 0) {
        const S = Circ().center().on(on).seg('AB BC CD DE EA OB OC').ang('EAB', deg(angA)).ang('CDE', deg(angD)).ang('BOC', sv('x'), { square: false }).names();
        sure(angOf(S, 'BOC'), bc); sure(angOf(S, 'EAB'), angA); sure(angOf(S, 'CDE'), angD);
        return degQ(`그림과 같이 오각형 ABCDE가 원 O에 내접하고 ∠A = ${angA}°, ∠D = ${angD}°일 때, ∠${X}의 크기는?`, bc, {
          figure: S.svg(`원 O에 내접하는 오각형 ABCDE. 반지름 OB, OC가 그어져 있다. ∠A = ${angA}°, ∠D = ${angD}°, ∠BOC = x`),
          explain: `대각선 BD를 그으면 □ABDE는 원에 내접하므로 ∠BDE = 180° − ${angA}° = ${180 - angA}°이고 ∠BDC = ${angD}° − ${180 - angA}° = ${angA + angD - 180}°이다. ∠${X}는 호 BC에 대한 중심각이므로 2 × ${angA + angD - 180}° = ${bc}°이다.`,
          facts: { calc: [[`2*(${angD}-(180-${angA}))`, 0]], unseen: [2, 180] }
        });
      }
      if (n === 1) {
        const S = Circ().center().on(on).seg('AB BC CD DE EA OC OD').ang('COD', deg(cd), { r: 12 }).names();
        sure(angOf(S, 'COD'), cd); sure(angOf(S, 'ABC') + angOf(S, 'DEA'), angB + angE);
        return degQ(`그림과 같이 오각형 ABCDE가 원 O에 내접하고 ∠COD = ${cd}°일 때, ∠B + ∠E의 크기는?`, angB + angE, {
          figure: S.svg(`원 O에 내접하는 오각형 ABCDE. 반지름 OC, OD가 그어져 있다. ∠COD = ${cd}°`),
          explain: `대각선 CE를 그으면 □ABCE는 원에 내접하므로 ∠B + ∠AEC = 180°이다. ∠CED는 호 CD에 대한 원주각이므로 ${HALF} × ${cd}° = ${cd / 2}°이다. ∠B + ∠E = 180° + ${cd / 2}° = ${angB + angE}°이다.`,
          facts: { calc: [[`180+${cd}/2`, 0]], unseen: [180, 2] }
        });
      }
      const S = Circ().on(on).seg('AB BC AE ED AC AD').ang('ABC', deg(angB)).ang('AED', deg(angE)).ang('CAD', sv('x'), { square: false }).names();
      sure(angOf(S, 'CAD'), cd / 2); sure(angOf(S, 'ABC'), angB); sure(angOf(S, 'AED'), angE);
      return degQ(`그림과 같이 원 위의 다섯 점 A, B, C, D, E에 대하여 ∠ABC = ${angB}°, ∠AED = ${angE}°일 때, ∠${X}의 크기는?`, cd / 2, {
        figure: S.svg(`원 위에 다섯 점 A, B, C, D, E가 이 차례로 놓여 있다. 현 AB, BC, AE, ED, AC, AD가 그어져 있다. ∠ABC = ${angB}°, ∠AED = ${angE}°, ∠CAD = x`),
        explain: `선분 CD를 그으면 □ABCD는 원에 내접하므로 ∠ADC = 180° − ${angB}° = ${180 - angB}°이고, □ACDE도 원에 내접하므로 ∠ACD = 180° − ${angE}° = ${180 - angE}°이다. △ACD에서 ∠${X} = 180° − (${180 - angB}° + ${180 - angE}°) = ${cd / 2}°이다.`,
        facts: { calc: [[`${angB}+${angE}-180`, 0]], unseen: [180] }
      });
    }, { count: 3 })
  ];

  // ── 묶음: 네 점이 한 원 위에 있을 조건 ──
  const SHAPES = [['사다리꼴', false], ['등변사다리꼴', true], ['평행사변형', false], ['직사각형', true], ['마름모', false], ['정사각형', true]];
  const types6 = [
    T('con-same-side', '같은 쪽에서 같은 크기로 보는 두 점과 한 원 위의 네 점', '①47', (d, n) => {
      if (n === 0) {
        const w = quadArcs(d, 54, 120, (v) => v.cd >= 60 && v.da >= 50 && Math.abs(v.cd - v.da) >= 12), s = w.cd / 2, t = w.da / 2;
        const S = Circ(78, { hide: true }).on(quadOn(w, 115 + d.int(-10, 10))).seg('AB BC CD DA AC BD').ang('CAD', deg(s)).ang('CBD', deg(s)).ang('ABD', deg(t)).ang('ACD', sv('x'), { square: false }).names();
        sure(angOf(S, 'CAD'), s); sure(angOf(S, 'CBD'), s); sure(angOf(S, 'ABD'), t); sure(angOf(S, 'ACD'), t);
        return degQ(`그림과 같이 □ABCD에서 ∠CAD = ∠CBD = ${s}°, ∠ABD = ${t}°일 때, ∠${X}의 크기는?`, t, {
          figure: S.svg(`사각형 ABCD와 두 대각선 AC, BD. ∠CAD = ${s}°, ∠CBD = ${s}°, ∠ABD = ${t}°, ∠ACD = x`),
          explain: `두 점 A, B는 직선 CD에 대하여 같은 쪽에 있고 ∠CAD = ∠CBD이므로 네 점 A, B, C, D는 한 원 위에 있다. ∠ACD와 ∠ABD는 호 AD에 대한 원주각이므로 ∠${X} = ${t}°이다.`,
          facts: { calc: [[`${t}`, 0]] }
        });
      }
      const w = quadArcs(d, 50, 116, (v) => v.cd >= 50 && new Set([v.ab, v.da, v.bc]).size === 3 && (v.ab + v.da) / 2 !== 90 && (v.ab + v.bc) / 2 !== 90), s = w.ab / 2, t = w.da / 2, u = w.bc / 2, x = 180 - s - t, y = 180 - s - u;
      const S = Circ(80, { hide: true }).on(quadOn(w, 115 + d.int(-10, 10))).seg('AB BC CD DA AC BD').ang('ADB', deg(s)).ang('ACB', deg(s)).ang('ACD', deg(t)).ang('BDC', deg(u)).ang('BAD', sv('x'), { square: false }).ang('ABC', sv('y'), { square: false }).names();
      sure(angOf(S, 'BAD'), x); sure(angOf(S, 'ABC'), y); sure(angOf(S, 'ADB'), s); sure(angOf(S, 'BDC'), u);
      return degs(`그림과 같이 □ABCD에서 ∠ADB = ∠ACB = ${s}°, ∠ACD = ${t}°, ∠BDC = ${u}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', x], ['∠y', y]], {
        figure: S.svg(`사각형 ABCD와 두 대각선 AC, BD. ∠ADB = ${s}°, ∠ACB = ${s}°, ∠ACD = ${t}°, ∠BDC = ${u}°, ∠BAD = x, ∠ABC = y`),
        explain: `두 점 C, D는 직선 AB에 대하여 같은 쪽에 있고 ∠ADB = ∠ACB이므로 □ABCD는 원에 내접한다. ∠BCD = ${s}° + ${t}° = ${s + t}°이므로 ∠${X} = 180° − ${s + t}° = ${x}°이고, ∠ADC = ${s}° + ${u}° = ${s + u}°이므로 ∠${Y} = 180° − ${s + u}° = ${y}°이다.`,
        facts: { calc: [[`180-${s}-${t}`, 0], [`180-${s}-${u}`, 1]], unseen: [180] }
      });
    }, { count: 2 }),
    T('con-given', '한 원 위에 있는 네 점과 원 밖에서 만나는 두 직선', '①48', (d) => {
      const v = d.until(() => ({ x: d.int(18, 40), d1: d.int(44, 70), s: d.int(-10, 10) }), (w) => w.d1 - w.x >= 16 && reach(15 + w.d1 + w.s, 195 - w.x, 375 - w.d1 + w.s, 195 + w.x) <= 2.4), turn = d.int(-8, 8), p = v.d1 - v.x;
      const S = Circ(78, { hide: true }).on({ D: 15 + v.d1 + v.s + turn, A: 195 - v.x + turn, B: 195 + v.x + turn, C: 375 - v.d1 + v.s + turn });
      S.put({ P: meet(S.P.D, S.P.A, S.P.C, S.P.B) }).seg('PD PC AC BD').ang('DPC', deg(p)).ang('DAC', deg(v.d1)).ang('ADB', sv('x'), { square: false }).names();
      sure(angOf(S, 'DPC'), p); sure(angOf(S, 'DAC'), v.d1); sure(angOf(S, 'ADB'), v.x);
      return degQ(`그림과 같이 네 점 A, B, C, D가 한 원 위에 있고 두 직선 DA, CB의 교점을 P라 하자. ∠P = ${p}°, ∠DAC = ${v.d1}°일 때, ∠${X}의 크기는?`, v.x, {
        figure: S.svg(`한 원 위에 있는 네 점 A, B, C, D(원은 그리지 않았다). 직선 DA와 직선 CB가 점 P에서 만나고 선분 AC, BD가 그어져 있다. ∠P = ${p}°, ∠DAC = ${v.d1}°, ∠ADB = x`),
        explain: `∠DAC는 △PAC의 외각이므로 ∠ACB = ${v.d1}° − ${p}° = ${v.x}°이다. 네 점이 한 원 위에 있으므로 ∠ADB와 ∠ACB는 호 AB에 대한 원주각이고 ∠${X} = ${v.x}°이다.`,
        facts: { calc: [[`${v.d1}-${p}`, 0]] }
      });
    }),
    T('con-pick', '원에 내접하는 사각형인지 가리기', '①50', (d, n) => {
      if (n === 0) {
        const make = (kind, ok) => {
          if (kind === 'opp') { const a = d.int(64, 116), c = ok ? 180 - a : 180 - a + d.pick([-1, 1]) * d.int(6, 20); return [`∠A = ${a}°, ∠C = ${c}°`, `∠A + ∠C = ${a + c}°`]; }
          if (kind === 'opp2') { const b2 = d.int(64, 116), dd = ok ? 180 - b2 : 180 - b2 + d.pick([-1, 1]) * d.int(6, 20); return [`∠B = ${b2}°, ∠D = ${dd}°`, `∠B + ∠D = ${b2 + dd}°`]; }
          if (kind === 'ext') { const a = d.int(64, 112), e = ok ? a : a + d.pick([-1, 1]) * d.int(5, 15); return [`∠A = ${a}°이고 꼭짓점 C에서의 한 외각의 크기가 ${e}°`, `∠A와 C에서의 외각이 ${ok ? '같다' : '다르다'}`]; }
          const p = d.int(30, 60), q = ok ? p : p + d.pick([-1, 1]) * d.int(4, 12); return [`∠BAC = ${p}°, ∠BDC = ${q}°`, `∠BAC와 ∠BDC가 ${ok ? '같다' : '다르다'}`];
        };
        const kinds = d.shuffle(['opp', 'opp2', 'ext', 'same']), flags = d.until(() => kinds.map(() => d.bool()), (f) => f.some(Boolean) && !f.every(Boolean));
        const rows = kinds.map((k, i) => make(k, flags[i]));
        return allQ(d, '다음 조건을 만족시키는 □ABCD 가운데 원에 내접하는 것을 모두 고른 것은?', TAGS.slice(0, 4), flags, {
          figure: tagged(rows.map((r) => r[0])),
          explain: `한 쌍의 대각의 크기의 합이 180°이거나, 한 외각의 크기가 그 내대각의 크기와 같거나, 한 변에 대하여 같은 쪽에 있는 두 꼭짓점에서 그 변을 바라본 각의 크기가 같으면 사각형은 원에 내접한다. ${rows.map((r, i) => `${TAGS[i]}은 ${r[1]}${flags[i] ? '(내접)' : '(내접하지 않음)'}`).join(', ')}.`
        });
      }
      const turn = d.int(-6, 6), S = Circ(74).on({ A: 110 + turn + d.int(-10, 10), B: 215 + turn, C: 325 + turn, D: 62 + turn });
      const base = mid(S.P.B, S.P.C), dirD = dirOf(base, S.P.D), pE = at(base, dist(base, S.P.D) * 0.62, dirD), pF = at(base, dist(base, S.P.D) * 1.3, dirD);
      S.put({ E: pE, F: pF }).seg('BA CA BD CD BE CE BF CF').names({ E: dirD - 90, F: dirD });
      return pickOne(d, '그림과 같이 세 점 A, B, C를 지나는 원 위의 점 D, 원의 내부의 점 E, 원의 외부의 점 F가 직선 BC에 대하여 점 A와 같은 쪽에 있다. 다음 가운데 ∠BAC와 크기가 같은 것은?', '∠BDC', ['∠BEC', '∠BFC'], {
        figure: S.svg('세 점 A, B, C를 지나는 원. 원 위의 점 D, 원의 내부의 점 E, 원의 외부의 점 F는 직선 BC에 대하여 점 A와 같은 쪽에 있고, 네 점 A, D, E, F를 각각 점 B, C와 이은 선분이 그어져 있다'),
        explain: '∠BDC와 ∠BAC는 같은 호 BC에 대한 원주각이므로 크기가 같다. 원의 내부의 점 E에서 본 ∠BEC는 ∠BAC보다 크고, 원의 외부의 점 F에서 본 ∠BFC는 ∠BAC보다 작다.'
      });
    }, { count: 2 }),
    T('con-always', '항상 원에 내접하는 사각형', '①51', (d) => {
      const list = d.until(() => d.shuffle(SHAPES).slice(0, 5), (l) => l.some((s) => s[1]) && l.some((s) => !s[1]));
      return allQ(d, '다음 사각형 가운데 항상 원에 내접하는 것을 모두 고른 것은?', TAGS.slice(0, 5), list.map((s) => s[1]), {
        figure: tagged(list.map((s) => s[0])),
        explain: '한 쌍의 대각의 크기의 합이 항상 180°인 사각형만 항상 원에 내접한다. 등변사다리꼴은 아랫변의 양 끝 각의 크기가 같고 윗변의 양 끝 각과 이웃한 각의 합이 180°이므로 대각의 합이 180°이다. 직사각형과 정사각형은 네 각이 모두 90°이다. 사다리꼴, 평행사변형, 마름모는 대각의 크기의 합이 180°가 아닌 것이 있다.'
      });
    }),
    T('con-make', '사각형이 원에 내접하도록 각의 크기 정하기', '①52', (d) => {
      const w = quadArcs(d, 56, 124, (v) => { const q = quadAngles(v); return q.A !== 90 && q.B !== 90 && Math.abs(q.A - q.B) >= 8 && q.D <= 120; }), q = quadAngles(w);
      const S = Circ(78, { hide: true }).on(quadOn(w, 115 + d.int(-10, 10)));
      S.put({ E: at(S.P.D, 38, dirOf(S.P.A, S.P.D)) }).seg('AB BC CD DA DE').ang('DAB', deg(q.A)).ang('ABC', deg(q.B)).ang('BCD', sv('x'), { square: false }).ang('CDE', sv('y'), { square: false }).names();
      sure(angOf(S, 'BCD'), 180 - q.A); sure(angOf(S, 'CDE'), q.B);
      return degs(`그림의 □ABCD에서 ∠A = ${q.A}°, ∠B = ${q.B}°이고 점 E는 변 AD의 연장선 위의 점이다. □ABCD가 원에 내접하도록 하는 ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', 180 - q.A], ['∠y', q.B]], {
        figure: S.svg(`사각형 ABCD와 변 AD를 점 D 너머로 늘인 직선 위의 점 E. ∠A = ${q.A}°, ∠B = ${q.B}°, ∠BCD = x, ∠CDE = y`),
        explain: `한 쌍의 대각의 크기의 합이 180°인 사각형은 원에 내접하므로 ∠${X} = 180° − ${q.A}° = ${180 - q.A}°이다. 한 외각의 크기가 그 내대각의 크기와 같아도 원에 내접하므로 ∠${Y} = ∠B = ${q.B}°이다.`,
        facts: { calc: [[`180-${q.A}`, 0], [`${q.B}`, 1]], unseen: [180] }
      });
    })
  ];

  // ── 묶음: 원의 접선과 현이 이루는 각 ──
  // 점 A(아래, 270°)에서의 접선. 오른쪽 끝 T, 왼쪽 끝은 이름 없음(또는 left).
  const atA = (S, l0, l1, right, left) => S.tangent('A', l0 || 70, l1 || 70, right || 'T', left || '');
  const T_HEAD = '그림에서 직선 AT는 원 O의 접선이고 점 A는 접점이다. ';
  const types7 = [
    T('tan-direct', '접선과 현이 이루는 각과 그 각의 안쪽에 있는 호에 대한 원주각', '①53', (d, n) => {
      const turn = d.int(-6, 6);
      if (n < 2) {
        const c = d.int(34, 76), S = Circ().center().on({ A: 270 + turn, B: 270 + 2 * c + turn, C: 270 + 2 * c + turn + d.int(50, 330 - 2 * c - 40) });
        atA(S).seg('AB AC BC');
        if (n === 0) S.ang('BCA', deg(c)).ang('BAT', sv('x'), { square: false }); else S.ang('BAT', deg(c)).ang('BCA', sv('x'), { square: false });
        S.names();
        sure(angOf(S, 'BAT'), c); sure(angOf(S, 'BCA'), c);
        const given = n === 0 ? '∠BCA' : '∠BAT', ask = n === 0 ? '∠BAT' : '∠BCA';
        return degQ(`${T_HEAD}${given} = ${c}°일 때, ∠${X}의 크기는?`, c, {
          figure: S.svg(`원 O 위에 세 점 A, B, C가 있고 점 A에서의 접선 위에 점 T가 있다. 현 AB, AC, BC가 그어져 있고 호 AB는 ∠BAT의 안쪽에 있다. ${given} = ${c}°, ${ask} = x`),
          explain: `원의 접선과 그 접점을 지나는 현이 이루는 각의 크기는 그 각의 안쪽에 있는 호에 대한 원주각의 크기와 같다. ∠BAT의 안쪽에 있는 호 AB에 대한 원주각이 ∠BCA이므로 ∠${X} = ${c}°이다.`,
          facts: { calc: [[`${c}`, 0]] }
        });
      }
      const v = d.until(() => ({ p: d.int(26, 54), q: d.int(22, 50) }), (w) => Math.abs(w.p - w.q) >= 6 && w.p + w.q <= 96);
      const S = Circ().center().on({ A: 270 + turn, B: 270 + 2 * v.p + turn, C: 270 - 2 * v.q + turn, D: 90 + turn + d.int(-15, 15) });
      S.tangent('A', 72, 72, 'Q', 'P').seg('AB AC CB DC DB').ang('BAQ', deg(v.p)).ang('CAP', deg(v.q)).ang('BCA', sv('x'), { square: false }).ang('CDB', sv('y'), { square: false }).names();
      sure(angOf(S, 'BCA'), v.p); sure(angOf(S, 'CDB'), v.p + v.q);
      return degs(`그림에서 직선 PQ는 원 O의 접선이고 점 A는 접점이다. ∠BAQ = ${v.p}°, ∠CAP = ${v.q}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', v.p], ['∠y', v.p + v.q]], {
        figure: S.svg(`원 O 위에 네 점 A, B, C, D가 있고 점 A에서의 접선 PQ가 그어져 있다. 점 B는 점 Q 쪽에, 점 C는 점 P 쪽에 있다. 현 AB, AC, CB, DC, DB가 그어져 있다. ∠BAQ = ${v.p}°, ∠CAP = ${v.q}°, ∠BCA = x, ∠CDB = y`),
        explain: `∠BCA는 ∠BAQ의 안쪽에 있는 호 AB에 대한 원주각이므로 ∠${X} = ${v.p}°이다. ∠CDB는 점 A를 지나는 호 CAB에 대한 원주각이고, 호 CA에 대한 원주각은 ∠CAP와 같은 ${v.q}°이므로 ∠${Y} = ${v.q}° + ${v.p}° = ${v.p + v.q}°이다.`,
        facts: { calc: [[`${v.p}`, 0], [`${v.p}+${v.q}`, 1]] }
      });
    }, { count: 3 }),
    T('tan-tri', '접선과 현이 이루는 각과 삼각형의 내각', '①54', (d, n) => {
      const turn = d.int(-6, 6);
      if (n === 0) {
        const v = d.until(() => ({ a: d.int(36, 80), b: d.int(30, 70) }), (w) => 180 - w.a - w.b >= 30 && 180 - w.a - w.b <= 80 && Math.abs(w.a - w.b) >= 5), x = 180 - v.a - v.b;
        const S = Circ().center().on({ A: 270 + turn, B: 270 + 2 * x + turn, C: 270 + 2 * x + 2 * v.a + turn });
        atA(S).seg('AB AC BC').ang('ABC', deg(v.b)).ang('CAB', deg(v.a)).ang('BAT', sv('x'), { square: false }).names();
        sure(angOf(S, 'ABC'), v.b); sure(angOf(S, 'CAB'), v.a); sure(angOf(S, 'BAT'), x);
        return degQ(`${T_HEAD}∠ABC = ${v.b}°, ∠CAB = ${v.a}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O 위에 세 점 A, B, C가 있고 점 A에서의 접선 위에 점 T가 있다. 현 AB, AC, BC가 그어져 있다. ∠ABC = ${v.b}°, ∠CAB = ${v.a}°, ∠BAT = x`),
          explain: `△ABC에서 ∠BCA = 180° − (${v.a}° + ${v.b}°) = ${x}°이다. ∠BAT는 그 안쪽에 있는 호 AB에 대한 원주각 ∠BCA와 크기가 같으므로 ∠${X} = ${x}°이다.`,
          facts: { calc: [[`180-${v.a}-${v.b}`, 0]], unseen: [180] }
        });
      }
      if (n === 1) {
        const v = d.until(() => ({ a: d.int(44, 80), dd: d.int(30, 70) }), (w) => 180 - w.a - w.dd >= 26 && 180 - w.a - w.dd <= 80 && Math.abs(w.a - w.dd) >= 5), x = 180 - v.a - v.dd;
        const S = Circ().center().on({ A: 270 + turn, B: 270 - 2 * v.dd + turn, C: 270 + 2 * x + turn });
        S.tangent('A', 72, 72, 'T', 'D').seg('AB AC BC').ang('BAC', deg(v.a)).ang('DAB', deg(v.dd)).ang('ABC', sv('x'), { square: false }).names();
        sure(angOf(S, 'BAC'), v.a); sure(angOf(S, 'DAB'), v.dd); sure(angOf(S, 'ABC'), x);
        return degQ(`그림에서 직선 DT는 원 O의 접선이고 점 A는 접점이다. ∠BAC = ${v.a}°, ∠BAD = ${v.dd}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O 위에 세 점 A, B, C가 있고 점 A에서의 접선 DT가 그어져 있다. 점 B는 점 D 쪽에, 점 C는 점 T 쪽에 있다. 현 AB, AC, BC가 그어져 있다. ∠BAC = ${v.a}°, ∠BAD = ${v.dd}°, ∠ABC = x`),
          explain: `∠CAT = 180° − (${v.dd}° + ${v.a}°) = ${x}°이다. ∠ABC는 ∠CAT의 안쪽에 있는 호 AC에 대한 원주각이므로 ∠${X} = ${x}°이다.`,
          facts: { calc: [[`180-${v.dd}-${v.a}`, 0]], unseen: [180] }
        });
      }
      const t = d.int(22, 58), x = 90 - t;
      const S = Circ().center().on({ A: 270 + turn, B: 270 + 2 * t + turn, C: 90 + 2 * t + turn });
      atA(S).seg('AB AC BC').ang('BAT', deg(t)).ang('ABC', sv('x'), { square: false }).names();
      sure(angOf(S, 'BAT'), t); sure(angOf(S, 'ABC'), x); sure(angOf(S, 'BAC'), 90);
      return degQ(`${T_HEAD}선분 BC는 원 O의 지름이고 ∠BAT = ${t}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 BC와 원 위의 점 A. 점 A에서의 접선 위에 점 T가 있고 현 AB, AC가 그어져 있다. ∠BAT = ${t}°, ∠ABC = x`),
        explain: `∠BCA는 ∠BAT의 안쪽에 있는 호 AB에 대한 원주각이므로 ${t}°이다. ∠BAC는 반원에 대한 원주각이므로 90°이고 ∠${X} = 180° − (90° + ${t}°) = ${x}°이다.`,
        facts: { calc: [[`180-90-${t}`, 0]], unseen: [180, 90] }
      });
    }, { count: 3 }),
    T('tan-iso', '접선과 현이 이루는 각과 이등변삼각형', '①55', (d, n) => {
      const turn = d.int(-5, 5);
      if (n === 0) {
        const a = even(d, 36, 96), x = 90 - a / 2;
        const S = Circ().center().on({ A: 270 + turn, B: 90 + a + turn, C: 90 - a + turn });
        atA(S).seg('AB AC BC').tick('AB AC').ang('BAC', deg(a)).ang('CAT', sv('x'), { square: false }).names();
        sure(angOf(S, 'CAT'), x);
        return degQ(`${T_HEAD}${sg('AB')} = ${sg('AC')}이고 ∠BAC = ${a}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O에 내접하는 삼각형 ABC와 점 A에서의 접선 위의 점 T. 변 AB와 변 AC에 길이가 같다는 표시가 있다. 점 C는 점 T 쪽에 있다. ∠BAC = ${a}°, ∠CAT = x`),
          explain: `△ABC는 이등변삼각형이므로 ∠ABC = (180° − ${a}°) ÷ 2 = ${x}°이다. ∠CAT의 안쪽에 있는 호 AC에 대한 원주각이 ∠ABC이므로 ∠${X} = ${x}°이다.`,
          facts: { calc: [[`(180-${a})/2`, 0]], unseen: [180, 2] }
        });
      }
      const v = d.until(() => ({ tau: d.int(52, 72), b: d.int(30, 58) }), (w) => 180 - w.b - w.tau >= 30 && 180 - w.b - w.tau <= 80), x = 180 - v.b - v.tau;
      const S = Circ().center().on({ A: 270 + turn, B: 270 + 2 * v.tau + turn, C: 270 - 2 * v.b + turn });
      // 점 T: 접선 위에서 BA = BT 인 점(점 B 에서 접선에 내린 수선의 발에 대하여 점 A 와 대칭)
      const f = foot(S.P.B, S.P.A, at(S.P.A, 10, turn)), pT = [2 * f[0] - S.P.A[0], 2 * f[1] - S.P.A[1]];
      S.put({ T: pT }).seg('AT BT AB AC BC').tick('AB BT').ang('ABC', deg(v.b)).ang('BTA', deg(v.tau)).ang('CAB', sv('x'), { square: false });
      S.b.seg(at(S.P.A, 46, 180 + turn), S.P.A);
      S.names();
      sure(angOf(S, 'BTA'), v.tau); sure(angOf(S, 'ABC'), v.b); sure(angOf(S, 'CAB'), x); sure(dist(S.P.A, S.P.B), dist(S.P.B, S.P.T));
      return degQ(`${T_HEAD}${sg('AB')} = ${sg('BT')}이고 ∠ABC = ${v.b}°, ∠BTA = ${v.tau}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위에 세 점 A, B, C가 있고 점 A에서의 접선 위에 점 T가 있다. 선분 AB와 선분 BT에 길이가 같다는 표시가 있다. 현 AB, AC, BC와 선분 BT가 그어져 있다. ∠ABC = ${v.b}°, ∠BTA = ${v.tau}°, ∠CAB = x`),
        explain: `△ABT는 이등변삼각형이므로 ∠BAT = ∠BTA = ${v.tau}°이다. ∠BAT의 안쪽에 있는 호 AB에 대한 원주각이 ∠ACB이므로 ∠ACB = ${v.tau}°이다. △ABC에서 ∠${X} = 180° − (${v.b}° + ${v.tau}°) = ${x}°이다.`,
        facts: { calc: [[`180-${v.b}-${v.tau}`, 0]], unseen: [180] }
      });
    }, { count: 2 }),
    T('tan-cyc-in', '원에 내접하는 사각형의 대각으로 접선과 현이 이루는 각 구하기', '①56', (d) => {
      const v = d.until(() => ({ al: d.int(96, 124), t: d.int(28, 50) }), (w) => w.al - w.t >= 40 && w.al - w.t <= 80), x = v.al - v.t, turn = d.int(-6, 6);
      const aB = 270 + turn, aC = aB + 2 * x, aD = aC + 2 * v.t, aA = aD + (360 - 2 * v.al) / 2;
      const S = Circ().center().on({ A: aA, B: aB, C: aC, D: aD });
      S.tangent('B', 70, 60, 'E', '').seg('AB AD DC CB BD').ang('DAB', deg(v.al)).ang('DBC', deg(v.t)).ang('CBE', sv('x'), { square: false }).names();
      sure(angOf(S, 'DAB'), v.al); sure(angOf(S, 'DBC'), v.t); sure(angOf(S, 'CBE'), x);
      return degQ(`그림에서 직선 BE는 원 O의 접선이고 점 B는 접점이다. □ABCD가 원 O에 내접하고 ∠DAB = ${v.al}°, ∠DBC = ${v.t}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD와 대각선 BD. 점 B에서의 접선 위에 점 E가 있고 점 C는 점 E 쪽에 있다. ∠DAB = ${v.al}°, ∠DBC = ${v.t}°, ∠CBE = x`),
        explain: `원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 ∠BCD = 180° − ${v.al}° = ${180 - v.al}°이다. △BCD에서 ∠BDC = 180° − (${180 - v.al}° + ${v.t}°) = ${x}°이다. ∠CBE는 그 안쪽에 있는 호 BC에 대한 원주각 ∠BDC와 크기가 같으므로 ∠${X} = ${x}°이다.`,
        facts: { calc: [[`180-(180-${v.al})-${v.t}`, 0]], unseen: [180] }
      });
    }),
    T('tan-cyc-out', '접선과 현이 이루는 각으로 내접사각형의 각 구하기', '①57', (d) => {
      const v = d.until(() => ({ s: d.int(30, 60), r: d.int(30, 56), q: d.int(22, 44) }), (w) => { const x = 180 - w.s - w.r - w.q; return x >= 28 && x <= 66 && new Set([w.s, w.r, w.q, x]).size === 4; });
      const x = 180 - v.s - v.r - v.q, y = 180 - v.r - v.s, turn = d.int(-5, 5);
      const S = Circ().center().on({ A: 270 + turn, D: 270 + 2 * v.s + turn, B: 270 - 2 * v.r + turn, C: 270 - 2 * v.r - 2 * v.q + turn });
      atA(S, 70, 50).seg('AB AD BD BC CD').ang('DAT', deg(v.s)).ang('BDA', deg(v.r)).ang('CDB', deg(v.q)).ang('CBD', sv('x'), { square: false }).ang('BAD', sv('y'), { square: false }).names();
      sure(angOf(S, 'DAT'), v.s); sure(angOf(S, 'BDA'), v.r); sure(angOf(S, 'CDB'), v.q); sure(angOf(S, 'CBD'), x); sure(angOf(S, 'BAD'), y);
      return degs(`${T_HEAD}□ABCD가 원 O에 내접하고 ∠DAT = ${v.s}°, ∠BDA = ${v.r}°, ∠CDB = ${v.q}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', x], ['∠y', y]], {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD와 대각선 BD. 점 A에서의 접선 위에 점 T가 있고 점 D는 점 T 쪽에 있다. ∠DAT = ${v.s}°, ∠BDA = ${v.r}°, ∠CDB = ${v.q}°, ∠CBD = x, ∠BAD = y`),
        explain: `∠ABD는 ∠DAT의 안쪽에 있는 호 AD에 대한 원주각이므로 ${v.s}°이다. △ABD에서 ∠${Y} = 180° − (${v.r}° + ${v.s}°) = ${y}°이다. ∠ADC = ${v.r}° + ${v.q}° = ${v.r + v.q}°이므로 ∠ABC = 180° − ${v.r + v.q}° = ${180 - v.r - v.q}°이고 ∠${X} = ${180 - v.r - v.q}° − ${v.s}° = ${x}°이다.`,
        facts: { calc: [[`180-${v.r}-${v.q}-${v.s}`, 0], [`180-${v.r}-${v.s}`, 1]], unseen: [180] }
      });
    }),
    T('tan-secant', '원 밖의 한 점에서 그은 접선과 할선', '①59', (d, n) => {
      const turn = d.int(-5, 5);
      if (n === 0) {
        const pos = (w) => { const aT = 270, aB = aT + 2 * w.a, aA = aB + 2 * w.c - 2 * w.a; return { aT, aB, aA, aC: aA + (360 - 2 * w.c) / 2 }; };
        const v = d.until(() => ({ a: d.int(22, 40), c: d.int(100, 128) }), (w) => { const x = 180 - w.c - w.a, p = pos(w), u = (a) => at([0, 0], 1, a), m = meet(u(p.aA), u(p.aB), u(p.aT), at(u(p.aT), 1, 0)); return x >= 18 && x <= 50 && Math.hypot(m[0], m[1]) <= 2.4; });
        const p = pos(v), x = 180 - v.c - v.a;
        const S = Circ().center().on({ T: p.aT + turn, B: p.aB + turn, A: p.aA + turn, C: p.aC + turn });
        S.put({ P: meet(S.P.A, S.P.B, S.P.T, at(S.P.T, 10, turn)) }).seg('PA AT BT AC CT').ray('PT', 34).ang('BAT', deg(v.a)).ang('ACT', deg(v.c), { r: 11 }).ang('APT', sv('x'), { square: false }).names();
        sure(angOf(S, 'BAT'), v.a); sure(angOf(S, 'ACT'), v.c); sure(angOf(S, 'APT'), x); sure(angOf(S, 'OTP'), 90);
        return degQ(`그림에서 직선 PT는 원 O의 접선이고 점 T는 접점이다. □ABTC가 원 O에 내접하고 직선 AB가 점 P를 지난다. ∠BAT = ${v.a}°, ∠ACT = ${v.c}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O에 내접하는 사각형 ABTC. 직선 AB를 점 B 너머로 늘인 직선이 점 T에서의 접선과 점 P에서 만난다. 선분 AT가 그어져 있다. ∠BAT = ${v.a}°, ∠ACT = ${v.c}°, ∠APT = x`),
          explain: `원에 내접하는 사각형의 대각의 크기의 합은 180°이므로 ∠ABT = 180° − ${v.c}° = ${180 - v.c}°이다. ∠BTP는 그 안쪽에 있는 호 BT에 대한 원주각 ∠BAT와 크기가 같으므로 ${v.a}°이다. ∠ABT는 △BPT의 외각이므로 ∠${X} = ${180 - v.c}° − ${v.a}° = ${x}°이다.`,
          facts: { calc: [[`180-${v.c}-${v.a}`, 0]], unseen: [180] }
        });
      }
      const pos = (w) => { const aA = 270, aD = aA + 2 * w.u, aC = aD + 2 * w.x; return { aA, aD, aC, aB: aC + (360 - 2 * w.u - 2 * w.x) / 2 }; };
      const v = d.until(() => ({ u: d.int(16, 36), x: d.int(26, 50) }), (w) => { const be = w.u + w.x, pp = 180 - be - w.u, p = pos(w), u = (a) => at([0, 0], 1, a), m = meet(u(p.aC), u(p.aD), u(p.aA), at(u(p.aA), 1, 0)); return be <= 86 && pp >= 40 && Math.hypot(m[0], m[1]) <= 2.4; });
      const p = pos(v), be = v.u + v.x, pp = 180 - be - v.u;
      const S = Circ().center().on({ A: p.aA + turn, D: p.aD + turn, C: p.aC + turn, B: p.aB + turn });
      S.put({ P: meet(S.P.C, S.P.D, S.P.A, at(S.P.A, 10, turn)) }).seg('PC AB BC AD AC').ray('PA', 34).ang('ABC', deg(be)).ang('APD', deg(pp)).ang('CAD', sv('x'), { square: false }).names();
      sure(angOf(S, 'ABC'), be); sure(angOf(S, 'APD'), pp); sure(angOf(S, 'CAD'), v.x); sure(angOf(S, 'OAP'), 90);
      return degQ(`그림에서 □ABCD가 원 O에 내접하고 점 A에서의 접선과 변 CD의 연장선의 교점을 P라 하자. ∠ABC = ${be}°, ∠APD = ${pp}°일 때, ∠${X}의 크기는?`, v.x, {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD와 대각선 AC. 변 CD를 점 D 너머로 늘인 직선이 점 A에서의 접선과 점 P에서 만난다. ∠ABC = ${be}°, ∠APD = ${pp}°, ∠CAD = x`),
        explain: `∠PAC는 그 안쪽에 있는 호 ADC에 대한 원주각 ∠ABC와 크기가 같으므로 ${be}°이다. 원에 내접하는 사각형의 한 외각은 그 내대각과 크기가 같으므로 ∠PDA = ∠ABC = ${be}°이고, △APD에서 ∠PAD = 180° − (${pp}° + ${be}°) = ${180 - pp - be}°이다. ∠${X} = ${be}° − ${180 - pp - be}° = ${v.x}°이다.`,
        facts: { calc: [[`${be}-(180-${pp}-${be})`, 0]], unseen: [180] }
      });
    }, { count: 2 }),
    T('tan-same-arc', '접선과 현이 이루는 각과 길이가 같은 호', '①60', (d) => {
      const t = d.int(22, 42), turn = d.int(-6, 6), x = 2 * t, aC = 270 + turn, aB = aC + 2 * t, aA = aC + 4 * t, aD = aA + (360 - 4 * t) * (0.38 + 0.24 * d.next());
      const S = Circ().center().on({ A: aA, B: aB, C: aC, D: aD });
      S.tangent('C', 70, 50, 'T', '').seg('CB BA AD DC DB').arcTick(aC, aB).arcTick(aB, aA).ang('BCT', deg(t)).ang('ADC', sv('x'), { square: false }).names();
      sure(angOf(S, 'BCT'), t); sure(angOf(S, 'ADC'), x);
      return degQ(`그림에서 직선 CT는 원 O의 접선이고 점 C는 접점이다. 호 AB와 호 BC의 길이가 같고 ∠BCT = ${t}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위에 네 점 A, B, C, D가 있고 점 C에서의 접선 위에 점 T가 있다. 호 AB와 호 BC에 길이가 같다는 표시가 있다. 현 CB, BA, AD, DC, DB가 그어져 있다. ∠BCT = ${t}°, ∠ADC = x`),
        explain: `∠BDC는 ∠BCT의 안쪽에 있는 호 BC에 대한 원주각이므로 ${t}°이다. 호 AB와 호 BC의 길이가 같으므로 ∠ADB = ∠BDC = ${t}°이고 ∠${X} = ${t}° + ${t}° = ${x}°이다.`,
        facts: { calc: [[`2*${t}`, 0]], unseen: [2] }
      });
    }),
    T('tan-arc-ratio', '호의 길이의 비와 접선과 현이 이루는 각', '①61', (d, n) => {
      const turn = d.int(-5, 5);
      if (n < 2) {
        const all = [];
        for (let p = 1; p <= 7; p += 1) for (let q = 1; q <= 7; q += 1) for (let r = 1; r <= 7; r += 1) {
          const s = p + q + r;
          if (new Set([p, q, r]).size === 3 && gcd(gcd(p, q), r) === 1 && [p, q, r].every((k) => 360 * k / s >= 50 && (180 * k) % s === 0)) all.push([p, q, r]);
        }
        const [p, q, r] = d.pick(all), s = p + q + r;
        if (n === 0) {
          // 호 AB : 호 BC : 호 CA = p : q : r, 점 B 에서의 접선 BT(호 AB 쪽)
          const x = 180 * p / s, S = Circ().center().on({ B: 270 + turn, A: 270 + 360 * p / s + turn, C: 270 + 360 * (p + r) / s + turn });
          S.tangent('B', 70, 60, 'T', '').seg('AB BC CA').ang('ABT', sv('x'), { square: false }).names();
          sure(angOf(S, 'ABT'), x);
          return degQ(`그림에서 직선 TB는 원 O의 접선이고 점 B는 접점이다. 호 AB, 호 BC, 호 CA의 길이의 비가 ${nb(`${p} : ${q} : ${r}`)}일 때, ∠${X}의 크기는?`, x, {
            figure: S.svg('원 O에 내접하는 삼각형 ABC와 점 B에서의 접선 위의 점 T. 점 A는 점 T 쪽에 있다. 호 AB, 호 BC, 호 CA는 각각 나머지 한 꼭짓점을 지나지 않는 호이다. ∠ABT = x'),
            explain: `∠ABT는 그 안쪽에 있는 호 AB에 대한 원주각 ∠ACB와 크기가 같다. 세 원주각 ∠ACB, ∠BAC, ∠CBA의 크기의 비는 호의 길이의 비와 같이 ${nb(`${p} : ${q} : ${r}`)}이고 합은 180°이므로 ∠${X} = 180° × ${frac(p, s)} = ${x}°이다.`,
            facts: { calc: [[`180*${p}/(${p}+${q}+${r})`, 0]], unseen: [180] }
          });
        }
        // 호 AB : 호 CA = p : r, 호 BC : 호 CA = q : r, 점 C 에서의 접선 CT(호 CA 쪽)
        const x = 180 * r / s, g1 = gcd(p, r), g2 = gcd(q, r), S = Circ().center().on({ C: 270 + turn, A: 270 + 360 * r / s + turn, B: 270 + 360 * (r + p) / s + turn });
        S.tangent('C', 70, 60, 'T', '').seg('AB BC CA').ang('ACT', sv('x'), { square: false }).names();
        sure(angOf(S, 'ACT'), x);
        return degQ(`그림에서 직선 CT는 원 O의 접선이고 점 C는 접점이다. 호 AB와 호 CA의 길이의 비는 ${nb(`${p / g1} : ${r / g1}`)}이고, 호 BC와 호 CA의 길이의 비는 ${nb(`${q / g2} : ${r / g2}`)}일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg('원 O에 내접하는 삼각형 ABC와 점 C에서의 접선 위의 점 T. 점 A는 점 T 쪽에 있다. 호 AB, 호 BC, 호 CA는 각각 나머지 한 꼭짓점을 지나지 않는 호이다. ∠ACT = x'),
          explain: `두 비를 이으면 호 AB : 호 BC : 호 CA = ${nb(`${p} : ${q} : ${r}`)}이다. ∠ACT는 그 안쪽에 있는 호 CA에 대한 원주각 ∠ABC와 크기가 같으므로 ∠${X} = 180° × ${frac(r, s)} = ${x}°이다.`,
          facts: { calc: [[`180*${r}/(${p}+${q}+${r})`, 0]], unseen: [180, p, q, r] }
        });
      }
      const [m, k] = d.pick([[2, 1], [3, 2], [5, 2], [3, 4], [7, 4], [4, 7], [5, 8]]), s = 2 * m + k, x = 180 * k / s;
      const S = Circ().center().on({ A: 270 + turn, C: 270 + 360 * k / s + turn, B: 270 + 360 * (k + m) / s + turn });
      S.tangent('A', 70, 60, 'T', '').seg('AB BC CA').tick('AB BC').ang('CAT', sv('x'), { square: false }).names();
      sure(angOf(S, 'CAT'), x);
      return degQ(`${T_HEAD}${sg('AB')} = ${sg('BC')}이고 호 AB와 호 AC의 길이의 비가 ${nb(`${m} : ${k}`)}일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg('원 O에 내접하는 삼각형 ABC와 점 A에서의 접선 위의 점 T. 점 C는 점 T 쪽에 있다. 현 AB와 현 BC에 길이가 같다는 표시가 있다. 호 AB와 호 AC는 각각 나머지 한 꼭짓점을 지나지 않는 호이다. ∠CAT = x'),
        explain: `한 원에서 길이가 같은 현에 대한 호의 길이는 같으므로 호 AB : 호 BC : 호 CA = ${nb(`${m} : ${m} : ${k}`)}이다. ∠CAT는 그 안쪽에 있는 호 AC에 대한 원주각 ∠ABC와 크기가 같으므로 ∠${X} = 180° × ${frac(k, s)} = ${x}°이다.`,
        facts: { calc: [[`180*${k}/(2*${m}+${k})`, 0]], unseen: [180, 2] }
      });
    }, { count: 3 }),
    T('tan-central', '접선과 현이 이루는 각과 중심각·반지름', '①62', (d, n) => {
      const turn = d.int(-5, 5);
      if (n === 0) {
        const t = d.until(() => d.int(30, 76), (v) => v !== 45);
        const S = Circ().center().on({ A: 270 + turn, B: 270 + 2 * t + turn, C: 270 + 2 * t + turn + d.int(60, 330 - 2 * t - 50) });
        atA(S).seg('AB OA OB CA CB').ang('BAT', deg(t)).ang('AOB', sv('x'), { square: false }).ang('OAB', sv('y'), { square: false }).names();
        sure(angOf(S, 'AOB'), 2 * t); sure(angOf(S, 'OAB'), 90 - t);
        return degs(`${T_HEAD}∠BAT = ${t}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', 2 * t], ['∠y', 90 - t]], {
          figure: S.svg(`원 O 위에 세 점 A, B, C가 있고 점 A에서의 접선 위에 점 T가 있다. 현 AB, CA, CB와 반지름 OA, OB가 그어져 있다. ∠BAT = ${t}°, ∠AOB = x, ∠OAB = y`),
          explain: `∠ACB는 ∠BAT의 안쪽에 있는 호 AB에 대한 원주각이므로 ${t}°이고, 중심각 ∠${X} = 2 × ${t}° = ${2 * t}°이다. ${sg('OA')} = ${sg('OB')}이므로 ∠${Y} = (180° − ${2 * t}°) ÷ 2 = ${90 - t}°이다.`,
          facts: { calc: [[`2*${t}`, 0], [`(180-2*${t})/2`, 1]], unseen: [2, 180] }
        });
      }
      const c = d.until(() => even(d, 64, 156), (v) => v !== 90);
      const S = Circ().center().on({ A: 270 + turn, B: 270 + c + turn });
      atA(S).seg('AB OA OB').ang('AOB', deg(c), { r: 12 }).ang('OAB', sv('x'), { square: false }).ang('BAT', sv('y'), { square: false }).names();
      sure(angOf(S, 'OAB'), 90 - c / 2); sure(angOf(S, 'BAT'), c / 2);
      return degs(`${T_HEAD}∠AOB = ${c}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', 90 - c / 2], ['∠y', c / 2]], {
        figure: S.svg(`원 O 위의 두 점 A, B와 점 A에서의 접선 위의 점 T. 현 AB와 반지름 OA, OB가 그어져 있다. ∠AOB = ${c}°, ∠OAB = x, ∠BAT = y`),
        explain: `${sg('OA')} = ${sg('OB')}이므로 ∠${X} = (180° − ${c}°) ÷ 2 = ${90 - c / 2}°이다. 원 위의 다른 점 C를 잡으면 ∠ACB = ${HALF} × ${c}° = ${c / 2}°이고, ∠BAT는 그 안쪽에 있는 호 AB에 대한 원주각과 크기가 같으므로 ∠${Y} = ${c / 2}°이다.`,
        facts: { calc: [[`(180-${c})/2`, 0], [`${c}/2`, 1]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('tan-diameter-ext', '지름의 연장선과 접선이 만나는 점', '①63', (d, n) => {
      const R = 70, turn = d.int(-5, 5);
      if (n === 0) {
        const b = d.int(20, 27), x = 90 - 2 * b, S = Circ(76).center().on({ A: 180 + turn, B: turn, T: 180 - 2 * b + turn });
        S.put({ P: at(S.O, 76 / Math.cos(2 * b * RAD), 180 + turn) }).seg('PB TA TB').ray('PT', 26).ang('ABT', deg(b)).ang('BPT', sv('x'), { square: false }).names({ A: 300 + turn });
        sure(angOf(S, 'ABT'), b); sure(angOf(S, 'BPT'), x); sure(angOf(S, 'OTP'), 90);
        return degQ(`그림에서 직선 PT는 원 O의 접선이고 점 T는 접점이다. 지름 AB의 연장선이 점 P를 지나고 ∠ABT = ${b}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O의 지름 AB를 점 A 너머로 늘인 직선 위의 점 P에서 그은 접선 PT. 현 TA, TB가 그어져 있다. ∠ABT = ${b}°, ∠BPT = x`),
          explain: `∠ATP는 그 안쪽에 있는 호 AT에 대한 원주각 ∠ABT와 크기가 같으므로 ${b}°이다. ∠ATB는 반원에 대한 원주각이므로 90°이다. △PTB에서 ∠${X} = 180° − (${b}° + 90° + ${b}°) = ${x}°이다.`,
          facts: { calc: [[`180-2*${b}-90`, 0]], unseen: [180, 2, 90] }
        });
      }
      const p = even(d, 30, 50), x = (90 + p) / 2, S = Circ(R).center().on({ A: 180 + turn, B: turn, T: 90 + p + turn });
      const pP = at(S.O, R / Math.sin(p * RAD), 180 + turn);
      S.put({ P: pP, C: at(S.P.T, 40, dirOf(pP, S.P.T)) }).seg('PB PC TA TB').ang('BPT', deg(p)).ang('BTC', sv('x'), { square: false }).names();
      sure(angOf(S, 'BPT'), p); sure(angOf(S, 'BTC'), x); sure(angOf(S, 'OTP'), 90);
      return degQ(`그림에서 직선 PC는 원 O의 접선이고 점 T는 접점이다. 지름 AB의 연장선이 점 P를 지나고 ∠BPT = ${p}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 AB를 점 A 너머로 늘인 직선 위의 점 P에서 그은 접선 PC. 점 T는 접점이고 점 C는 점 T 너머의 접선 위에 있다. 현 TA, TB가 그어져 있다. ∠BPT = ${p}°, ∠BTC = x`),
        explain: `∠BTC는 그 안쪽에 있는 호 BT에 대한 원주각 ∠BAT와 크기가 같으므로 ∠BAT = ∠${X}이다. ∠ATB = 90°이므로 ∠PTA = 180° − 90° − ∠${X} = 90° − ∠${X}이다. ∠BAT는 △APT의 외각이므로 ∠${X} = ${p}° + (90° − ∠${X}), ∠${X} = ${x}°이다.`,
        facts: { calc: [[`(90+${p})/2`, 0]], unseen: [90, 2] }
      });
    }, { count: 2 }),
    T('tan-arc-length', '접선과 현이 이루는 각으로 호의 길이 구하기', '①64', (d) => {
      const [a, m, k0] = d.pick([[15, 5, 1], [18, 4, 1], [20, 7, 2], [25, 13, 5], [27, 7, 3], [30, 2, 1]]), t = d.until(() => d.int(1, 4), (v) => v * m <= 26 && v * k0 >= 2), Lb = t * m, La = t * k0;
      const R = 70, turn = d.int(-5, 5), S = Circ(R).center().on({ A: 180 + turn, B: turn, T: 180 - 2 * a + turn });
      S.put({ P: at(S.O, R / Math.cos(2 * a * RAD), 180 + turn) }).seg('PB TA TB').ray('PT', 26).ang('ATP', deg(a), { side: -1 }).names();
      sure(angOf(S, 'ATP'), a); sure(angOf(S, 'ABT'), a);
      return piQ(`그림에서 선분 AB는 원 O의 지름이고 점 T에서의 접선과 지름 AB의 연장선의 교점을 P라 하자. ∠ATP = ${a}°이고 호 BT의 길이가 ${Lb}π cm일 때, 호 AT의 길이는?`, La, 'cm', {
        figure: S.svg(`원 O의 지름 AB를 점 A 너머로 늘인 직선 위의 점 P에서 그은 접선 PT. 현 TA, TB가 그어져 있다. 호 BT와 호 AT는 점 T에서 각각 B, A까지의 짧은 호이다. ∠ATP = ${a}°`),
        explain: `∠ABT는 ∠ATP의 안쪽에 있는 호 AT에 대한 원주각이므로 ${a}°이다. ∠ATB = 90°이므로 ∠BAT = 90° − ${a}° = ${90 - a}°이다. 호의 길이는 원주각의 크기에 정비례하므로 ${90 - a} : ${a} = ${Lb}π : (호 AT의 길이)이고 호 AT의 길이는 ${La}π cm이다.`,
        facts: { calc: [[`${Lb}*${a}/(90-${a})`, 0]], unseen: [90] }
      });
    }),
    T('tan-pc-bc', '지름의 연장선 위의 점과 접선, 이등변삼각형', '①65', (d) => {
      const R = 64, turn = d.int(-6, 6), ask = d.pick(['BCT', 'CPB']), v = ask === 'BCT' ? 60 : 30;
      const S = Circ(R).center().on({ A: 180 + turn, B: turn, C: 120 + turn });
      const pP = at(S.O, 2 * R, 180 + turn);
      S.put({ P: pP, T: at(S.P.C, 40, dirOf(pP, S.P.C)) }).seg('PB PT CA CB').tick('PC CB').ang(ask, sv('x'), { square: false }).names();
      sure(angOf(S, ask), v); sure(angOf(S, 'OCP'), 90);
      return degQ(`그림에서 직선 PT는 원 O의 접선이고 점 C는 접점이다. 지름 AB의 연장선이 점 P를 지나고 ${sg('PC')} = ${sg('BC')}일 때, ∠${ask}의 크기는?`, v, {
        figure: S.svg('원 O의 지름 AB를 점 A 너머로 늘인 직선 위의 점 P에서 그은 접선 PT. 점 C는 접점이고 현 CA, CB가 그어져 있다. 선분 PC와 현 BC에 길이가 같다는 표시가 있다. ∠' + ask + ' = x'),
        explain: `∠CPB = ∠CBP = ∠a라 하면, ∠ACP는 그 안쪽에 있는 호 AC에 대한 원주각 ∠ABC와 크기가 같으므로 ∠ACP = ∠a이다. ∠ACB = 90°이므로 △PBC에서 ∠a + (∠a + 90°) + ∠a = 180°, ∠a = 30°이다. ${ask === 'BCT' ? '∠BCT = 180° − 90° − 30° = 60°이다.' : '∠CPB = 30°이다.'}`,
        facts: { calc: [[ask === 'BCT' ? '180-90-(180-90)/3' : '(180-90)/3', 0]], unseen: [180, 90, 3] }
      });
    }),
    T('tan-parallel', '접선과 평행한 현', '①67', (d, n) => {
      const turn = 0, a = n === 0 ? d.until(() => d.int(36, 78), (v) => Math.abs(v - 45) >= 8 && v !== 60) : d.int(53, 70), S = Circ().center().on({ A: 270, B: 270 + 2 * a, C: 270 - 2 * a });
      S.tangent('A', 72, 72, 'T', 'S').seg('AB AC CB').arrow('CB ST');
      if (n === 0) {
        S.ang('BAT', deg(a)).ang('BAC', sv('x'), { square: false }).names({ S: null });
        sure(angOf(S, 'BAC'), 180 - 2 * a);
        return degQ(`${T_HEAD}현 BC가 직선 AT와 평행하고 ∠BAT = ${a}°일 때, ∠${X}의 크기는?`, 180 - 2 * a, {
          figure: S.svg(`원 O 위의 세 점 A, B, C와 점 A에서의 접선 위의 점 T. 현 BC와 접선에 평행하다는 표시가 있다. 점 B는 점 T 쪽에 있다. ∠BAT = ${a}°, ∠BAC = x`),
          explain: `∠ACB는 ∠BAT의 안쪽에 있는 호 AB에 대한 원주각이므로 ${a}°이고, 현 BC와 접선이 평행하므로 ∠ABC = ∠BAT = ${a}°(엇각)이다. △ABC에서 ∠${X} = 180° − 2 × ${a}° = ${180 - 2 * a}°이다.`,
          facts: { calc: [[`180-2*${a}`, 0]], unseen: [180, 2] }
        });
      }
      S.names({ S: null });
      return degQ(`${T_HEAD}현 BC가 직선 AT와 평행할 때, △ABC가 정삼각형이 되도록 하는 ∠BAT의 크기는?`, 60, {
        figure: S.svg('원 O 위의 세 점 A, B, C와 점 A에서의 접선 위의 점 T. 현 BC와 접선에 평행하다는 표시가 있다. 점 B는 점 T 쪽에 있다'),
        explain: '∠ACB = ∠BAT(접선과 현이 이루는 각)이고 ∠ABC = ∠BAT(엇각)이므로 △ABC는 AB = AC인 이등변삼각형이다. 정삼각형이 되려면 ∠ACB = 60°이어야 하므로 ∠BAT = 60°이다.',
        facts: { calc: [['180/3', 0]], unseen: [180, 3] }
      });
    }, { count: 2 }),
    T('tan-proof', '접선과 현이 이루는 각이 둔각일 때 설명의 빈칸', '①68', (d) => {
      const th = d.int(106, 128), aB = 270 + 2 * th;
      const S = Circ().center().on({ A: 270, B: aB, C: (aB - 360 + 270) / 2, D: 90 });
      S.tangent('A', 72, 50, 'T', '').seg('AB CA CB').seg('AD CD', 'cut').right('DAT DCA').names();
      sure(angOf(S, 'DCA'), 90);
      return M('다음은 원 O 위의 점 A에서의 접선 AT와 현 AB가 이루는 ∠BAT가 둔각일 때, 지름 AD와 선분 CD를 그어 ∠BAT = ∠BCA임을 설명하는 과정의 일부이다. ㈎, ㈏에 알맞은 수를 차례로 구하시오.', [{ label: '㈎', answer: 90 }, { label: '㈏', answer: 90 }], {
        figure: S.svg('원 O 위의 세 점 A, B, C와 점 A에서의 접선 위의 점 T. ∠BAT는 둔각이다. 현 AB, CA, CB가 그어져 있고 지름 AD와 선분 CD가 점선으로 그어져 있다. ∠DAT와 ∠DCA에 직각 표시가 있다') + lines([
          '∠BAT = ㈎° + ∠BAD', '∠BCA = ㈏° + ∠BCD', '∠BAD와 ∠BCD는 모두 호 BD에 대한 원주각이므로 ∠BAD = ∠BCD이다.', '따라서 ∠BAT = ∠BCA이다.'
        ]),
        shown: '㈎ 90, ㈏ 90',
        explain: '원의 접선은 접점을 지나는 반지름에 수직이므로 ∠DAT = 90°이고 ∠BAT = 90° + ∠BAD이다. ∠DCA는 반원에 대한 원주각이므로 90°이고 ∠BCA = 90° + ∠BCD이다.',
        facts: { calc: [['90', 0], ['90', 1]], unseen: [90] }
      });
    }),
    T('tan-two', '원 밖의 한 점에서 그은 두 접선과 원주각', '①69', (d, n) => {
      const R = 62, place = (pAng) => { const S = Circ(R).center().on({ A: 90 + pAng / 2, B: 270 - pAng / 2 }); S.put({ P: at(S.O, R / Math.sin(pAng / 2 * RAD), 180) }); return S; };
      const head = '그림과 같이 원 O 밖의 한 점 P에서 원 O에 그은 두 접선의 접점을 A, B라 하자. ';
      if (n === 0) {
        const p = even(d, 46, 96), x = 90 - p / 2, S = place(p);
        S.on({ C: d.int(-45, 45) }).seg('PA PB CA CB').ang('APB', deg(p)).ang('ACB', sv('x'), { square: false }).names();
        sure(angOf(S, 'ACB'), x); sure(angOf(S, 'OAP'), 90);
        return degQ(`${head}원 위의 점 C에 대하여 ∠APB = ${p}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O 밖의 점 P에서 그은 두 접선 PA, PB. 점 C는 점 P에서 먼 쪽의 호 AB 위에 있고 현 CA, CB가 그어져 있다. ∠APB = ${p}°, ∠ACB = x`),
          explain: `원의 접선은 접점을 지나는 반지름에 수직이므로 ∠OAP = ∠OBP = 90°이다. □APBO에서 ∠AOB = 360° − (90° + 90° + ${p}°) = ${180 - p}°이고 ∠${X} = ${HALF} × ${180 - p}° = ${x}°이다.`,
          facts: { calc: [[`(360-90-90-${p})/2`, 0]], unseen: [360, 90, 2] }
        });
      }
      if (n === 1) {
        const dd = d.int(112, 138), p = 2 * dd - 180, S = place(p);
        S.on({ D: 180 + d.int(-Math.floor((180 - p) / 4), Math.floor((180 - p) / 4)) }).seg('PA PB DA DB').ang('ADB', deg(dd), { r: 11 }).ang('APB', sv('x'), { square: false }).names();
        sure(angOf(S, 'ADB'), dd); sure(angOf(S, 'APB'), p);
        return degQ(`${head}원 위의 점 D에 대하여 ∠ADB = ${dd}°일 때, ∠${X}의 크기는?`, p, {
          figure: S.svg(`원 O 밖의 점 P에서 그은 두 접선 PA, PB. 점 D는 점 P에 가까운 쪽의 호 AB 위에 있고 현 DA, DB가 그어져 있다. ∠ADB = ${dd}°, ∠APB = x`),
          explain: `∠ADB는 점 D를 지나지 않는 큰 호 AB에 대한 원주각이므로 그 중심각은 2 × ${dd}° = ${2 * dd}°이고, 작은 호 AB에 대한 중심각 ∠AOB = 360° − ${2 * dd}° = ${360 - 2 * dd}°이다. □APBO에서 ∠OAP = ∠OBP = 90°이므로 ∠${X} = 180° − ${360 - 2 * dd}° = ${p}°이다.`,
          facts: { calc: [[`180-(360-2*${dd})`, 0]], unseen: [180, 360, 2] }
        });
      }
      const all = [];
      for (let a = 1; a <= 7; a += 1) for (let b2 = 1; b2 <= 7; b2 += 1) for (let c = 1; c <= 7; c += 1) {
        const s = a + b2 + c, ab = 360 * a / s;
        if (new Set([a, b2, c]).size === 3 && gcd(gcd(a, b2), c) === 1 && Number.isInteger(ab) && ab >= 84 && ab <= 134 && ab !== 90 && 360 * b2 / s >= 60 && 360 * c / s >= 60) all.push([a, b2, c]);
      }
      const [a, b2, c] = d.pick(all), s = a + b2 + c, ab = 360 * a / s, p = 180 - ab, S = place(p);
      S.on({ C: 270 - p / 2 + 360 * b2 / s }).seg('PA PB CA CB').ang('APB', sv('x'), { square: false }).names();
      sure(angOf(S, 'APB'), p);
      return degQ(`${head}원 위의 점 C에 대하여 호 AB, 호 BC, 호 CA의 길이의 비가 ${nb(`${a} : ${b2} : ${c}`)}일 때, ∠${X}의 크기는?`, p, {
        figure: S.svg('원 O 밖의 점 P에서 그은 두 접선 PA, PB. 점 C는 점 P에서 먼 쪽의 호 AB 위에 있고 현 CA, CB가 그어져 있다. 호 AB는 점 C를 지나지 않는 호이다. ∠APB = x'),
        explain: `호 AB에 대한 중심각은 360° × ${frac(a, s)} = ${ab}°이다. □APBO에서 ∠OAP = ∠OBP = 90°이므로 ∠${X} = 180° − ${ab}° = ${p}°이다.`,
        facts: { calc: [[`180-360*${a}/(${a}+${b2}+${c})`, 0]], unseen: [180, 360] }
      });
    }, { count: 3 }),
    T('tan-two-iso', '두 접선이 만드는 이등변삼각형과 접선과 현이 이루는 각', '①70', (d, n) => {
      const R = 62;
      if (n === 0) {
        const a = 4 * d.int(12, 24), x = 135 - a / 4, S = Circ(R).center().on({ B: 90 + a / 2, C: 270 - a / 2, D: 0 });
        S.put({ A: at(S.O, R / Math.sin(a / 2 * RAD), 180) }).seg('AB AC BC BD CD').tick('BD CD').ang('BAC', deg(a)).ang('ABD', sv('x'), { square: false }).names();
        sure(angOf(S, 'ABD'), x); sure(angOf(S, 'OBA'), 90);
        return degQ(`그림과 같이 원 O 밖의 한 점 A에서 원 O에 그은 두 접선의 접점을 B, C라 하자. 원 위의 점 D에 대하여 ${sg('BD')} = ${sg('CD')}이고 ∠BAC = ${a}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O 밖의 점 A에서 그은 두 접선 AB, AC. 점 D는 점 A에서 먼 쪽의 호 BC 위에 있다. 현 BC, BD, CD가 그어져 있고 현 BD와 현 CD에 길이가 같다는 표시가 있다. ∠BAC = ${a}°, ∠ABD = x`),
          explain: `${sg('AB')} = ${sg('AC')}이므로 ∠ABC = (180° − ${a}°) ÷ 2 = ${90 - a / 2}°이다. ∠BDC는 ∠ABC의 안쪽에 있는 호 BC에 대한 원주각이므로 ${90 - a / 2}°이고, ${sg('BD')} = ${sg('CD')}이므로 ∠DBC = (180° − ${90 - a / 2}°) ÷ 2 = ${45 + a / 4}°이다. ∠${X} = ${90 - a / 2}° + ${45 + a / 4}° = ${x}°이다.`,
          facts: { calc: [[`(180-${a})/2+(180-(180-${a})/2)/2`, 0]], unseen: [180, 2] }
        });
      }
      const v = d.until(() => ({ p: even(d, 44, 80), q: d.int(34, 62) }), (w) => { const x = 90 + w.p / 2 - w.q; return x >= 30 && x <= 80 && 2 * w.q <= 90 + w.p / 2 + 60; }), x = 90 + v.p / 2 - v.q;
      const aA = 90 + v.p / 2, S = Circ(R).center().on({ A: aA, B: 270 - v.p / 2, C: aA - 2 * v.q });
      const pP = at(S.O, R / Math.sin(v.p / 2 * RAD), 180);
      S.put({ P: pP, D: at(S.P.A, 34, dirOf(pP, S.P.A)), E: at(S.P.B, 34, dirOf(pP, S.P.B)) }).seg('PD PE AB AC BC').ang('APB', deg(v.p)).ang('CAD', deg(v.q)).ang('CBE', sv('x'), { square: false }).names();
      sure(angOf(S, 'CAD'), v.q); sure(angOf(S, 'CBE'), x); sure(angOf(S, 'APB'), v.p);
      return degQ(`그림과 같이 원 O 밖의 한 점 P에서 원 O에 그은 두 접선의 접점을 A, B라 하고, 직선 PA, PB 위에 점 A, B보다 점 P에서 먼 점 D, E를 잡았다. 원 위의 점 C에 대하여 ∠APB = ${v.p}°, ∠CAD = ${v.q}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 밖의 점 P에서 그은 두 접선 위의 접점 A, B와 그 너머의 점 D, E. 점 C는 점 P에서 먼 쪽의 원 위에 있고 현 AB, AC, BC가 그어져 있다. ∠APB = ${v.p}°, ∠CAD = ${v.q}°, ∠CBE = x`),
        explain: `${sg('PA')} = ${sg('PB')}이므로 ∠PAB = (180° − ${v.p}°) ÷ 2 = ${90 - v.p / 2}°이고 ∠CAB = 180° − (${90 - v.p / 2}° + ${v.q}°) = ${x}°이다. ∠CBE는 그 안쪽에 있는 호 BC에 대한 원주각 ∠CAB와 크기가 같으므로 ∠${X} = ${x}°이다.`,
        facts: { calc: [[`180-(180-${v.p})/2-${v.q}`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('tan-incircle', '삼각형의 내접원이 접점 삼각형의 외접원일 때', '①71', (d) => {
      const v = d.until(() => ({ A: even(d, 40, 84), B: even(d, 44, 84) }), (w) => 180 - w.A - w.B >= 40 && 180 - w.A - w.B <= 84 && Math.abs(w.A - w.B) >= 6), Cg = 180 - v.A - v.B, f = 90 - v.B / 2, x = 90 - Cg / 2;
      const pB = [0, 0], pC = [210, 0], pA = meet(pB, at(pB, 10, v.B), pC, at(pC, 10, 180 - Cg));
      const la = dist(pB, pC), lb = dist(pC, pA), lc = dist(pA, pB), s = la + lb + lc, I = [(la * pA[0] + lb * pB[0] + lc * pC[0]) / s, (la * pA[1] + lb * pB[1] + lc * pC[1]) / s];
      const S = Circ(1, { hide: true });
      S.b.disk(I, dist(I, foot(I, pB, pC)));
      S.put({ A: pA, B: pB, C: pC, O: I, D: foot(I, pA, pB), E: foot(I, pB, pC), F: foot(I, pC, pA) }).seg('AB BC CA DE EF FD').dot('O').ang('BAC', deg(v.A)).ang('DFE', deg(f)).ang('EDF', sv('x'), { square: false }).names();
      sure(angOf(S, 'DFE'), f); sure(angOf(S, 'EDF'), x);
      return degQ(`그림에서 원 O는 △ABC의 내접원이면서 △DEF의 외접원이고, 세 점 D, E, F는 접점이다. ∠A = ${v.A}°, ∠DFE = ${f}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`삼각형 ABC와 그 내접원 O. 내접원은 변 AB와 점 D, 변 BC와 점 E, 변 CA와 점 F에서 접하고 삼각형 DEF가 그어져 있다. ∠A = ${v.A}°, ∠DFE = ${f}°, ∠EDF = x`),
        explain: `원 밖의 한 점에서 그은 두 접선의 길이는 같으므로 ${sg('AD')} = ${sg('AF')}이고 ∠ADF = (180° − ${v.A}°) ÷ 2 = ${90 - v.A / 2}°이다. ∠DEF는 ∠ADF의 안쪽에 있는 호 DF에 대한 원주각이므로 ${90 - v.A / 2}°이다. △DEF에서 ∠${X} = 180° − (${90 - v.A / 2}° + ${f}°) = ${x}°이다.`,
        facts: { calc: [[`180-(180-${v.A})/2-${f}`, 0]], unseen: [180, 2] }
      });
    }),
    T('tan-two-circles', '한 점에서 접하는 두 원과 공통인 접선', '①72', (d, n) => {
      const s = d.int(28, 62), be = d.int(30, 60), S = Circ(1, { hide: true }), T0 = [0, 0];
      if (n === 0) {
        const r1 = 56, r2 = d.int(40, 50), O1 = [-r1, 0], O2 = [r2, 0];
        S.b.disk(O1, r1); S.b.disk(O2, r2);
        S.put({ T: T0, P: [0, -78], Q: [0, 78], A: at(T0, 2 * r1 * Math.sin(s * RAD), 90 + s), C: at(T0, 2 * r2 * Math.sin(s * RAD), 270 + s), B: at(T0, 2 * r1 * Math.cos(be * RAD), 180 + be), D: at(T0, 2 * r2 * Math.cos(be * RAD), be) });
        S.seg('PQ AC BD AB CD').ang('ATP', deg(s)).ang('ABT', sv('x'), { square: false }).ang('CDT', sv('y'), { square: false }).names({ A: dirOf(O1, S.P.A), B: dirOf(O1, S.P.B), C: dirOf(O2, S.P.C), D: dirOf(O2, S.P.D) });
        sure(dist(S.P.A, O1), r1); sure(dist(S.P.D, O2), r2); sure(angOf(S, 'ABT'), s); sure(angOf(S, 'CDT'), s);
        return degs(`그림과 같이 두 원이 점 T에서 외접하고 직선 PQ는 두 원의 공통인 접선이다. 점 T를 지나는 두 직선이 왼쪽 원과 만나는 점을 A, B, 오른쪽 원과 만나는 점을 C, D라 하자. ∠ATP = ${s}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', s], ['∠y', s]], {
          figure: S.svg(`점 T에서 외접하는 두 원과 공통인 접선 PQ. 세 점 A, T, C와 세 점 B, T, D가 각각 한 직선 위에 있고 현 AB, CD가 그어져 있다. ∠ATP = ${s}°, ∠ABT = x, ∠CDT = y`),
          explain: `왼쪽 원에서 ∠ABT는 ∠ATP의 안쪽에 있는 호 AT에 대한 원주각이므로 ∠${X} = ${s}°이다. ∠CTQ = ∠ATP = ${s}°(맞꼭지각)이고, 오른쪽 원에서 ∠CDT는 ∠CTQ의 안쪽에 있는 호 CT에 대한 원주각이므로 ∠${Y} = ${s}°이다.`,
          facts: { calc: [[`${s}`, 0], [`${s}`, 1]] }
        });
      }
      const r1 = d.int(34, 42), R2 = d.int(70, 80), O1 = [r1, 0], O2 = [R2, 0];
      S.b.disk(O2, R2); S.b.disk(O1, r1);
      S.put({ T: T0, P: [0, -76], Q: [0, 76], A: at(T0, 2 * r1 * Math.sin(s * RAD), 90 - s), C: at(T0, 2 * R2 * Math.sin(s * RAD), 90 - s), B: at(T0, 2 * r1 * Math.cos(be * RAD), -be), D: at(T0, 2 * R2 * Math.cos(be * RAD), -be) });
      S.seg('PQ TC TD AB CD').ang('ATP', deg(s)).ang('ABT', sv('x'), { square: false }).ang('CDT', sv('y'), { square: false }).names({ A: dirOf(O1, S.P.A) + 25, B: dirOf(O1, S.P.B) - 25, C: dirOf(O2, S.P.C), D: dirOf(O2, S.P.D) });
      sure(dist(S.P.A, O1), r1); sure(dist(S.P.C, O2), R2); sure(angOf(S, 'ABT'), s); sure(angOf(S, 'CDT'), s);
      return degs(`그림과 같이 두 원이 점 T에서 내접하고 직선 PQ는 두 원의 공통인 접선이다. 점 T에서 그은 두 직선이 작은 원과 만나는 점을 A, B, 큰 원과 만나는 점을 C, D라 하자. ∠ATP = ${s}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', s], ['∠y', s]], {
        figure: S.svg(`점 T에서 내접하는 두 원과 공통인 접선 PQ. 점 T에서 그은 한 직선 위에 A, C가, 다른 직선 위에 B, D가 이 차례로 있다. 현 AB, CD가 그어져 있다. ∠ATP = ${s}°, ∠ABT = x, ∠CDT = y`),
        explain: `작은 원에서 ∠ABT는 ∠ATP의 안쪽에 있는 호 AT에 대한 원주각이므로 ∠${X} = ${s}°이다. 큰 원에서 ∠CTP도 ${s}°이고 ∠CDT는 그 안쪽에 있는 호 CT에 대한 원주각이므로 ∠${Y} = ${s}°이다.`,
        facts: { calc: [[`${s}`, 0], [`${s}`, 1]] }
      });
    }, { count: 2 }),
    T('tan-trig', '접선과 현이 이루는 각과 30°·60°로 길이·넓이 구하기', '①73', (d, n) => {
      const R = 66, turn = d.int(-6, 6);
      if (n === 0) {
        const dd = d.pick([6, 8, 10, 12, 14]), S = Circ(R).center().on({ A: 180 + turn, B: turn, C: 120 + turn });
        const pP = at(S.O, 2 * R, 180 + turn);
        S.put({ P: pP }).seg('PB CA CB').ray('PC', 30).ang('ABC', deg(30)).names();
        sure(angOf(S, 'ABC'), 30); sure(angOf(S, 'OCP'), 90); sure(dist(pP, S.P.A), dist(S.P.A, S.P.C));
        return cmQ(`그림에서 직선 PC는 원 O의 접선이고 점 C는 접점이다. 지름 AB의 연장선이 점 P를 지나고 ${sg('AB')} = ${dd} cm, ∠ABC = 30°일 때, ${sg('PA')}의 길이는?`, dd / 2, {
          figure: S.svg('원 O의 지름 AB를 점 A 너머로 늘인 직선 위의 점 P에서 그은 접선 PC. 현 CA, CB가 그어져 있다. ∠ABC = 30°'),
          explain: `∠ACB = 90°, ∠ABC = 30°인 직각삼각형에서 ${sg('AC')} = ${HALF}${sg('AB')} = ${dd / 2} cm이다. ∠PCA는 그 안쪽에 있는 호 AC에 대한 원주각 ∠ABC와 크기가 같으므로 30°이다. ∠CAB = 60°는 △PCA의 외각이므로 ∠CPA = 60° − 30° = 30°이고, △PCA는 이등변삼각형이므로 ${sg('PA')} = ${sg('AC')} = ${dd / 2} cm이다.`,
          facts: { calc: [[`${dd}/2`, 0]], unseen: [2] }
        });
      }
      const r = d.pick([4, 6, 8, 10, 12]), t = d.pick([30, 60]), S = Circ(R).center().on({ A: 180 + turn, B: turn, C: 2 * t + turn });
      S.put({ P: at(S.P.C, 46, 2 * t - 90 + turn), T: at(S.P.C, 46, 2 * t + 90 + turn) }).seg('AB CA CB PT').ang('BCP', deg(t)).names();
      sure(angOf(S, 'BCP'), t); sure(angOf(S, 'CAB'), t);
      return radQ(`그림에서 직선 PT는 반지름의 길이가 ${r} cm인 원 O의 접선이고 점 C는 접점이다. 선분 AB는 원 O의 지름이고 ∠BCP = ${t}°일 때, △ACB의 넓이는?`, r * r / 2, 3, 'cm²', {
        figure: S.svg(`원 O의 지름 AB와 원 위의 점 C에서의 접선 PT. 점 P는 점 B 쪽에 있다. 현 CA, CB가 그어져 있다. ∠BCP = ${t}°`),
        explain: `∠CAB는 ∠BCP의 안쪽에 있는 호 BC에 대한 원주각이므로 ${t}°이고, ∠ACB = 90°이다. ${sg('AB')} = ${2 * r} cm이므로 ${t === 30 ? `${sg('BC')} = ${r} cm, ${sg('AC')} = ${r}${rt(3)} cm` : `${sg('AC')} = ${r} cm, ${sg('BC')} = ${r}${rt(3)} cm`}이다. 넓이는 ${HALF} × ${r} × ${r}${rt(3)} = ${r * r / 2}${rt(3)}(cm²)이다.`,
        facts: { calc: [[`${r}*${r}/2`, 0], ['3', 1]], unseen: [2, 3] }
      });
    }, { count: 2 })
  ];

  B.addGroup(UNIT, { id: 'cyclic', title: '원에 내접하는 사각형', standard: S19, types: types5 });
  B.addGroup(UNIT, { id: 'concyclic', title: '네 점이 한 원 위에 있을 조건', standard: S19, types: types6 });
  B.addGroup(UNIT, { id: 'tangent', title: '원의 접선과 현이 이루는 각', standard: S19, types: types7 });
})(typeof window !== 'undefined' ? window : globalThis);
