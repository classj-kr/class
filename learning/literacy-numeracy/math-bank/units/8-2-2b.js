// 중학교 2학년 2학기 2단원 사각형의 성질 — 뒤쪽 묶음
// (직사각형·마름모·정사각형의 성질, 등변사다리꼴의 성질, 여러 가지 사각형 사이의 관계, 평행선과 넓이).
// 단원 틀과 단원 안의 도구, 싣는 기준, 뺀 것과 까닭은 8-2-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//  - 사각형 사이의 관계를 묻는 문장은 포함 관계로 참인 것을 틀렸다고 하지 않는다. 「직사각형은 등변사다리꼴이다」처럼 교과서마다 달리 읽힐 수 있는 문장은 싣지 않았다.
//  - 이름을 고르는 문항은 「가장 알맞은 이름」을 묻는다(정사각형이 답일 때 직사각형·마름모도 틀린 이름은 아니므로).
//  - 등변사다리꼴은 2022 김화경 교과서의 뜻(밑변의 양 끝 각의 크기가 같은 사다리꼴)과 성질(평행하지 않은 두 변의 길이가 같다, 두 대각선의 길이가 같다)을 쓴다.
//  - 평행선과 넓이는 「밑변이 같고 평행선 사이에 있는 두 삼각형의 넓이는 같다」「높이가 같은 두 삼각형의 넓이의 비는 밑변의 길이의 비와 같다」 두 가지를 쓴다.
//    넓이가 적힌 그림도 수치대로 그린다(사다리꼴의 윗변과 아랫변의 비, 평행선 사이의 거리의 비를 넓이에서 거꾸로 셈한다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C, lines, frac, tagged, table } = B.kit;
  const { V, nb } = B.kit.mid;
  const { RAD, dirOf, mid, meet, WHITE, Board } = B.kit.mgeo;
  const { UNIT, sg, X, HALF, eq, par, perp, cm, O_NOTE, TAGS, SYM, degQ, lenQ, areaQ, pickOne, allQ, sayQ, pol, lerp, foot, para, rect, rhom, trap, fit, centre, shape, segs, nameOn, nameIn, nameAt, same, ang, len, lenHalf, ticks, arrows, deg } = B.kit.m822;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  const at4 = '점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다.';
  const SAY_RECT = '직사각형 ABCD. ' + at4, SAY_SQ = '정사각형 ABCD. ' + at4, SAY_RH = '마름모 ABCD. 점 A는 위, 점 B는 왼쪽, 점 C는 아래, 점 D는 오른쪽에 있다.';
  const SAY_TR = '사다리꼴 ABCD. ' + at4 + ' 변 AD와 변 BC가 평행하고 변 AD가 변 BC보다 짧다.', SAY_O = ' 두 대각선 AC, BD가 점 O에서 만난다.';
  const QUADS = ['평행사변형', '직사각형', '마름모', '정사각형'];
  const A_ = V('a');

  // ── 직사각형, 마름모, 정사각형 ──
  const RECT_TRUE = [eq('AC', 'BD'), eq('OA', 'OD'), eq('OA', 'OB'), '∠OBC = ∠OCB', '△ABC ≡ △DCB', eq('AB', 'DC'), '∠ABO = ∠DCO'];
  const RECT_FALSE = [
    [eq('AB', 'BC'), '직사각형의 이웃하는 두 변의 길이가 같다고 할 수 없다. 길이가 같은 것은 대변이다.'],
    [perp('AC', 'BD'), '직사각형의 두 대각선은 길이가 같고 서로 다른 것을 이등분할 뿐, 서로 수직이라고 할 수 없다.'],
    ['∠AOB = 90°', '직사각형의 두 대각선이 서로 수직이라고 할 수 없다.'],
    ['∠BAO = ∠DAO', '직사각형의 대각선이 한 내각을 이등분한다고 할 수 없다.'],
    ['△OAB ≡ △OBC', '△OAB와 합동인 삼각형은 △OCD이다.']
  ];
  const RH_TRUE = [perp('AC', 'BD'), eq('AB', 'BC'), '∠ABD = ∠CBD', eq('OA', 'OC'), eq('OB', 'OD'), '∠BAD = ∠BCD', '△ABO ≡ △CBO', '∠AOB = 90°'];
  const RH_FALSE = [
    [eq('OA', 'OB'), `마름모의 두 대각선은 서로 다른 것을 수직이등분하므로 ${eq('OA', 'OC')}, ${eq('OB', 'OD')}이다. ${sg('OA')}와 ${sg('OB')}의 길이가 같다고 할 수 없다.`],
    [eq('AC', 'BD'), '마름모의 두 대각선의 길이가 같다고 할 수 없다.'],
    ['∠ABC = ∠BCD', '마름모의 이웃하는 두 내각의 크기가 같다고 할 수 없다. 크기가 같은 것은 대각이다.'],
    ['∠ABC = 90°', '마름모의 한 내각의 크기가 90°라고 할 수 없다.']
  ];

  B.addTypes(UNIT, 'kinds', [
    T('rect-xy', '직사각형의 대각선의 길이와 각', '①36 ②39 심22', (d, n) => {
      if (n === 0) {
        const th = d.int(26, 38), e = 2 * d.int(4, 10), g = fit(rect(Math.cos(th * RAD), Math.sin(th * RAD)), [185, 118]), b = shape(g, 'ABCD', { diag: true });
        ang(b, g, 'ACB', deg(th));
        return M(`직사각형 ABCD에서 두 대각선의 교점을 O라 하자. ${sg('BD')} = ${cm(e)}, ∠ACB = ${th}°일 때, ${sg('OC')}의 길이와 ∠BDC의 크기를 차례로 구하시오.`, [{ label: sg('OC'), answer: e / 2, unit: 'cm' }, { label: '∠BDC', answer: 90 - th, unit: '°' }], {
          figure: b.svg(`${SAY_RECT}${SAY_O} ∠ACB = ${th}°`),
          explain: `직사각형의 두 대각선은 길이가 같고 서로 다른 것을 이등분하므로 ${sg('OC')} = ${HALF}${sg('AC')} = ${HALF}${sg('BD')} = ${e / 2} (cm)이다. ${eq('OB', 'OC')}이므로 ∠OBC = ∠OCB = ${th}°이고, △BCD에서 ∠BDC = 90° − ${th}° = ${90 - th}°이다.`,
          facts: { calc: [[`${e}/2`, 0], [`90-${th}`, 1]], unseen: [2, 90] }
        });
      }
      const ga = d.int(52, 66), g = fit(rect(Math.sin(ga * RAD), Math.cos(ga * RAD)), [185, 118]), b = shape(g, 'ABCD', { diag: true });
      ang(b, g, 'ACD', deg(ga));
      return degQ(`직사각형 ABCD에서 두 대각선의 교점을 O라 하자. ∠ACD = ${ga}°일 때, ∠AOB의 크기는?`, 180 - 2 * ga, {
        figure: b.svg(`${SAY_RECT}${SAY_O} ∠ACD = ${ga}°`),
        explain: `직사각형의 두 대각선은 길이가 같고 서로 다른 것을 이등분하므로 ${eq('OC', 'OD')}이다. △OCD에서 ∠ODC = ∠OCD = ${ga}°이므로 ∠COD = 180° − 2 × ${ga}° = ${180 - 2 * ga}°이고, ∠AOB = ∠COD(맞꼭지각) = ${180 - 2 * ga}°이다.`,
        facts: { calc: [[`180-2*${ga}`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('kinds-claims', '두 대각선을 그은 직사각형·마름모에 대한 식 가리기', '①37 ②44', (d, n) => {
      const wantTrue = d.next() < 0.4, ask = wantTrue ? '항상 옳은' : '옳지 않은';
      if (n === 0) return sayQ(d, `직사각형 ABCD에서 두 대각선의 교점을 O라 할 때, 다음 중 ${ask} 것은?`, RECT_TRUE, RECT_FALSE, wantTrue, shape(fit(rect(1.55, 1), [170, 110]), 'ABCD', { diag: true }).svg(SAY_RECT + SAY_O));
      return sayQ(d, `마름모 ABCD에서 두 대각선의 교점을 O라 할 때, 다음 중 ${ask} 것은?`, RH_TRUE, RH_FALSE, wantTrue, shape(fit(rhom(0.6, 1), [190, 114]), 'ABCD', { diag: true }).svg(SAY_RH + SAY_O));
    }, { count: 2 }),
    T('rect-proof', '직사각형의 두 대각선의 길이가 같음을 설명하는 과정의 빈칸', '①38', (d) => {
      const g = fit(rect(1.55, 1), [170, 110]), b = shape(g, 'ABCD');
      segs(b, g, 'AC BD', 'thin'); ang(b, g, 'ABC', ''); ang(b, g, 'BCD', '');
      const rows = ['△ABC와 △DCB에서', `${eq('AB', 'DC')}, ∠ABC = ㈎ = 90°, ${sg('BC')}는 공통`, '이므로 △ABC ≡ △DCB (㈏ 합동)이다.', `따라서 ${sg('AC')} = ㈐이다.`];
      return pickOne(d, '다음은 직사각형 ABCD의 두 대각선의 길이가 같음을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?', `∠DCB, SAS, ${sg('DB')}`, [`∠DCB, ASA, ${sg('DB')}`, `∠BAD, SAS, ${sg('DB')}`, `∠DCB, SAS, ${sg('DC')}`], {
        figure: b.svg(`${SAY_RECT} 두 대각선 AC, BD가 그어져 있고 ∠ABC와 ∠DCB에 직각 표시가 있다`) + lines(rows),
        explain: `직사각형의 대변의 길이는 같으므로 ${eq('AB', 'DC')}이고, 네 내각의 크기는 모두 90°이므로 ∠ABC = ∠DCB = 90°이다. 두 변의 길이가 각각 같고 그 끼인각의 크기가 같으므로 SAS 합동이고, 대응변의 길이가 같으므로 ${eq('AC', 'DB')}이다.`
      });
    }),
    T('rect-trisect', '직사각형 안의 이등변삼각형과 크기가 같은 세 각', '①39', (d) => {
      const P = rect(Math.sqrt(3), 1); P.E = [Math.tan(30 * RAD), 0];
      const g = fit(P, [190, 112]), b = shape(g, 'ABCD');
      b.seg(g.A, g.C, 'thin').seg(g.A, g.E); nameOn(b, g, 'E', 'BC'); ticks(b, g, 'AE EC', 1); same(b, g, 'BAE', 'dot', 26); same(b, g, 'EAC', 'dot', 30);
      return degQ(`직사각형 ABCD의 변 BC 위의 점 E에 대하여 ${eq('AE', 'CE')}이고 ∠BAE = ∠EAC일 때, ∠AEB의 크기는?`, 60, {
        figure: b.svg(`${SAY_RECT} 대각선 AC가 그어져 있다. 변 BC 위에 점 E가 있고 선분 AE가 그어져 있다. 선분 AE와 선분 EC에 같은 길이 표시가, ∠BAE와 ∠EAC에 같은 각 표시가 있다`),
        explain: `${eq('AE', 'CE')}이므로 ∠ECA = ∠EAC이다. ∠BAE = ∠EAC = ∠ECA = ${A_}라 하면 △ABC에서 90° + 2${A_} + ${A_} = 180°이므로 ${A_} = 30°이다. △ABE에서 ∠AEB = 90° − 30° = 60°이다.`,
        facts: { calc: [['90-90/3', 0]], unseen: [90, 3] }
      });
    }),
    T('rhom-xy', '마름모의 대각선의 길이와 각', '①40 ②40 심28', (d, n) => {
      if (n === 0) {
        const p = d.int(3, 8), al = d.int(55, 64), g = fit(rhom(1, Math.tan(al * RAD)), [225, 124]), b = shape(g, 'ABCD', { diag: true });
        len(b, g, 'OC', cm(p), 'D', { gap: 3 }); ang(b, g, 'OAB', deg(al));
        return M(`마름모 ABCD에서 두 대각선의 교점을 O라 하자. ${sg('OC')} = ${cm(p)}, ∠OAB = ${al}°일 때, ${sg('OA')}의 길이와 ∠ADO의 크기를 차례로 구하시오.`, [{ label: sg('OA'), answer: p, unit: 'cm' }, { label: '∠ADO', answer: 90 - al, unit: '°' }], {
          figure: b.svg(`${SAY_RH}${SAY_O} 선분 OC의 길이는 ${cm(p)}, ∠OAB = ${al}°`),
          explain: `마름모의 두 대각선은 서로 다른 것을 수직이등분하므로 ${sg('OA')} = ${sg('OC')} = ${cm(p)}, ∠AOD = 90°이다. △ABO ≡ △ADO이므로 ∠OAD = ∠OAB = ${al}°이고, △AOD에서 ∠ADO = 90° − ${al}° = ${90 - al}°이다.`,
          facts: { calc: [[String(p), 0], [`90-${al}`, 1]], unseen: [90] }
        });
      }
      if (n === 1) {
        const th = d.int(24, 36), g = fit(rhom(Math.sin(th * RAD), Math.cos(th * RAD)), [200, 124]), b = shape(g, 'ABCD');
        b.seg(g.B, g.D, 'thin'); ang(b, g, 'BDC', deg(th));
        return degQ(`마름모 ABCD에서 ∠BDC = ${th}°일 때, ∠A의 크기는?`, 180 - 2 * th, {
          figure: b.svg(`${SAY_RH} 대각선 BD가 그어져 있다. ∠BDC = ${th}°`),
          explain: `${eq('CB', 'CD')}이므로 ∠CBD = ∠BDC = ${th}°이고, △BCD에서 ∠C = 180° − 2 × ${th}° = ${180 - 2 * th}°이다. 마름모의 대각의 크기는 같으므로 ∠A = ∠C = ${180 - 2 * th}°이다.`,
          facts: { calc: [[`180-2*${th}`, 0]], unseen: [180, 2] }
        });
      }
      const p = d.int(3, 8), g = fit(rhom(1, Math.sqrt(3)), [205, 120]), b = shape(g, 'ABCD', { diag: true });
      len(b, g, 'OA', cm(p), 'D'); ang(b, g, 'ABO', '30°');
      return lenQ(`마름모 ABCD에서 두 대각선의 교점을 O라 하자. ${sg('OA')} = ${cm(p)}, ∠ABO = 30°일 때, △ACD의 둘레의 길이는 몇 cm인가?`, 6 * p, {
        figure: b.svg(`${SAY_RH}${SAY_O} 선분 OA의 길이는 ${cm(p)}, ∠ABO = 30°`),
        explain: `△ABO ≡ △CBO이므로 ∠ABC = 2 × 30° = 60°이다. ${eq('BA', 'BC')}이고 ∠ABC = 60°이므로 △ABC는 정삼각형이고 ${sg('AB')} = ${sg('AC')} = 2 × ${p} = ${2 * p} (cm)이다. 마름모의 네 변의 길이는 모두 같으므로 △ACD의 세 변의 길이는 모두 ${cm(2 * p)}이고, 둘레의 길이는 3 × ${2 * p} = ${6 * p} (cm)이다.`,
        facts: { calc: [[`2*${p}*3`, 0]], unseen: [2, 3] }
      });
    }, { count: 3 }),
    T('rhom-foot', '마름모의 한 꼭짓점에서 변에 내린 수선과 대각선', '①41', (d) => {
      const ga = 2 * d.int(55, 62), P = rhom(Math.cos(ga / 2 * RAD), Math.sin(ga / 2 * RAD)); P.H = foot(P.A, P.C, P.D); P.P = meet(P.A, P.H, P.B, P.D);
      const g = fit(P, [205, 130]), b = shape(g, 'ABCD');
      b.seg(g.B, g.D, 'thin').seg(g.A, g.H); nameOn(b, g, 'H', 'CD'); nameAt(b, g, 'P', 'AB'); ang(b, g, 'AHD', ''); ang(b, g, 'BCD', deg(ga));
      return degQ(`마름모 ABCD의 꼭짓점 A에서 변 CD에 내린 수선의 발을 H, 선분 AH와 대각선 BD의 교점을 P라 하자. ∠C = ${ga}°일 때, ∠APB의 크기는?`, ga / 2, {
        figure: b.svg(`${SAY_RH} 대각선 BD가 그어져 있다. 점 A에서 변 CD에 내린 수선의 발 H에 직각 표시가 있고, 선분 AH와 대각선 BD가 점 P에서 만난다. ∠C = ${ga}°`),
        explain: `${eq('CB', 'CD')}이므로 △BCD에서 ∠CDB = (180° − ${ga}°) ÷ 2 = ${(180 - ga) / 2}°이다. △PHD에서 ∠DPH = 90° − ${(180 - ga) / 2}° = ${ga / 2}°이고, ∠APB = ∠DPH(맞꼭지각) = ${ga / 2}°이다.`,
        facts: { calc: [[`90-(180-${ga})/2`, 0]], unseen: [90, 180, 2] }
      });
    }),
    T('rhom-diag-point', '마름모의 대각선 위의 점과 이등변삼각형', '①42', (d) => {
      const be = d.int(24, 32), c = Math.cos(be * RAD), P = rhom(Math.sin(be * RAD), c); P.P = [Math.cos(2 * be * RAD) / (2 * c), 0];
      const g = fit(P, [215, 124]), b = shape(g, 'ABCD');
      b.seg(g.B, g.D).seg(g.A, g.P); nameIn(b, g, 'P', 'ABD'); ticks(b, g, 'AP PD', 1); ang(b, g, 'ABP', deg(be));
      return degQ(`마름모 ABCD의 대각선 BD 위에 ${eq('PA', 'PD')}가 되도록 점 P를 잡았다. ∠ABP = ${be}°일 때, ∠BAP의 크기는?`, 180 - 3 * be, {
        figure: b.svg(`${SAY_RH} 대각선 BD 위에 점 P가 있고 선분 AP가 그어져 있다. 선분 PA와 선분 PD에 같은 길이 표시가 있다. ∠ABP = ${be}°`),
        explain: `${eq('AB', 'AD')}이므로 ∠ADB = ∠ABD = ${be}°이고, △ABD에서 ∠BAD = 180° − 2 × ${be}° = ${180 - 2 * be}°이다. ${eq('PA', 'PD')}이므로 ∠PAD = ∠PDA = ${be}°이다. 따라서 ∠BAP = ${180 - 2 * be}° − ${be}° = ${180 - 3 * be}°이다.`,
        facts: { calc: [[`180-2*${be}-${be}`, 0]], unseen: [180, 2] }
      });
    }),
    T('sq-xy', '정사각형의 대각선의 길이와 각', '①44 ②41', (d) => {
      const p = d.int(3, 9), g = fit(rect(1, 1), [150, 150]), b = shape(g, 'ABCD', { diag: true });
      len(b, g, 'OA', cm(p), 'B', { gap: 2 });
      return M(`정사각형 ABCD에서 두 대각선의 교점을 O라 하자. ${sg('OA')} = ${cm(p)}일 때, ${sg('BD')}의 길이와 ∠OBC의 크기를 차례로 구하시오.`, [{ label: sg('BD'), answer: 2 * p, unit: 'cm' }, { label: '∠OBC', answer: 45, unit: '°' }], {
        figure: b.svg(`${SAY_SQ}${SAY_O} 선분 OA의 길이는 ${cm(p)}`),
        explain: `정사각형의 두 대각선은 길이가 같고 서로 다른 것을 수직이등분하므로 ${sg('BD')} = ${sg('AC')} = 2 × ${p} = ${2 * p} (cm)이다. △OBC는 ${eq('OB', 'OC')}, ∠BOC = 90°인 직각이등변삼각형이므로 ∠OBC = 90° ÷ 2 = 45°이다.`,
        facts: { calc: [[`2*${p}`, 0], ['90/2', 1]], unseen: [2, 90] }
      });
    }),
    T('sq-area', '대각선의 길이로 정사각형의 넓이 구하기', '①45 ②42', (d) => {
      const e = 2 * d.int(3, 9), g = fit(rect(1, 1), [120, 120]);
      return areaQ(`정사각형 ABCD에서 ${sg('BD')} = ${cm(e)}일 때, 정사각형 ABCD의 넓이는 몇 cm²인가?`, e * e / 2, {
        figure: shape(g, 'ABCD', { diag: true }).svg(SAY_SQ + SAY_O),
        explain: `정사각형의 두 대각선은 길이가 같고 서로 다른 것을 수직이등분하므로 ${sg('OA')} = ${sg('OB')} = ${sg('OC')} = ${sg('OD')} = ${cm(e / 2)}이다. 두 대각선으로 나누어진 직각삼각형 하나의 넓이는 ${HALF} × ${e / 2} × ${e / 2}이므로 정사각형의 넓이는 4 × ${HALF} × ${e / 2} × ${e / 2} = ${e * e / 2} (cm²)이다.`,
        facts: { calc: [[`4*(${e}/2)*(${e}/2)/2`, 0]], unseen: [4, 2] }
      });
    }),
    T('sq-diag-point', '정사각형의 대각선과 합동인 두 삼각형', '①46 ②49 심33 심34', (d, n) => {
      const P = rect(1, 1);
      if (n === 0) {
        const ep = d.int(58, 79); P.E = meet(P.B, pol(P.B, 1, 135 - ep), P.A, P.C);
        const g = fit(P, [136, 136]), b = shape(g, 'ABCD');
        b.seg(g.A, g.C, 'thin'); segs(b, g, 'EB ED'); nameIn(b, g, 'E', 'ABCD'); ang(b, g, 'BEC', deg(ep));
        return degQ(`정사각형 ABCD의 대각선 AC 위의 점 E에 대하여 ∠BEC = ${ep}°일 때, ∠EDA의 크기는?`, ep - 45, {
          figure: b.svg(`${SAY_SQ} 대각선 AC 위에 점 E가 있고 선분 EB, 선분 ED가 그어져 있다. ∠BEC = ${ep}°`),
          explain: `△BCE와 △DCE에서 ${eq('BC', 'DC')}, ∠BCE = ∠DCE = 45°, ${sg('CE')}는 공통이므로 △BCE ≡ △DCE (SAS 합동)이고 ∠DEC = ∠BEC = ${ep}°이다. ∠DEC는 △AED의 외각이고 ∠EAD = 45°이므로 ∠EDA = ${ep}° − 45° = ${ep - 45}°이다.`,
          facts: { calc: [[`${ep}-45`, 0]], unseen: [45] }
        });
      }
      const ph = d.int(20, 33), t = Math.tan(ph * RAD); P.E = [t, 1]; P.F = [1 - t, 0]; P.H = meet(P.A, P.C, P.D, P.F);
      const g = fit(P, [140, 140]), b = shape(g, 'ABCD');
      b.seg(g.A, g.C, 'thin'); segs(b, g, 'BE DF'); nameOn(b, g, 'E', 'AD'); nameOn(b, g, 'F', 'BC'); nameIn(b, g, 'H', 'ACDF'); ticks(b, g, 'AE CF', 1); ang(b, g, 'ABE', deg(ph));
      return degQ(`정사각형 ABCD의 변 AD, BC 위에 ${eq('AE', 'CF')}가 되도록 두 점 E, F를 잡고, 대각선 AC와 선분 DF의 교점을 H라 하자. ∠ABE = ${ph}°일 때, ∠AHF의 크기는?`, 135 - ph, {
        figure: b.svg(`${SAY_SQ} 변 AD 위에 점 E, 변 BC 위에 점 F가 있고 선분 AE와 선분 CF에 같은 길이 표시가 있다. 선분 BE, 선분 DF와 대각선 AC가 그어져 있고, 대각선 AC와 선분 DF가 점 H에서 만난다. ∠ABE = ${ph}°`),
        explain: `△ABE와 △CDF에서 ${eq('AB', 'CD')}, ${eq('AE', 'CF')}, ∠BAE = ∠DCF = 90°이므로 △ABE ≡ △CDF (SAS 합동)이고 ∠CDF = ∠ABE = ${ph}°이다. 정사각형의 대각선은 내각을 이등분하므로 ∠DCH = 45°이고, △DHC에서 ∠DHC = 180° − (45° + ${ph}°) = ${135 - ph}°이다. ∠AHF = ∠DHC(맞꼭지각) = ${135 - ph}°이다.`,
        facts: { calc: [[`180-(45+${ph})`, 0]], unseen: [180, 45] }
      });
    }, { count: 2 }),
    T('sq-overlap', '정사각형의 두 대각선의 교점에서 벌어진 직각과 넓이', '①49 심52 심53', (d, n) => {
      if (n === 0) {
        const a = 2 * d.int(2, 7), th = d.int(18, 30), P = rect(1, 1); P.E = pol(P.O, 1, th - 90); P.G = pol(P.O, 1, th); P.F = [P.E[0] + P.G[0] - P.O[0], P.E[1] + P.G[1] - P.O[1]];
        P.P = meet(P.O, P.E, P.B, P.C); P.Q = meet(P.O, P.G, P.C, P.D);
        const g = fit(P, [215, 170]), b = shape(g, 'ABCD', { diag: true, fill: ['OPCQ'], oIn: 'AB' }), c2 = centre([g.O, g.E, g.F, g.G]);
        b.poly([g.O, g.E, g.F, g.G]); for (const k of 'EFG') b.name(g[k], k, dirOf(c2, g[k])); nameAt(b, g, 'P', 'BE'); nameAt(b, g, 'Q', 'CG'); len(b, g, 'AD', cm(a));
        return areaQ(`한 변의 길이가 ${cm(a)}인 정사각형 ABCD의 두 대각선의 교점을 O라 하자. 정사각형 OEFG는 정사각형 ABCD와 합동이고, 변 OE, OG가 변 BC, CD와 만나는 점을 각각 P, Q라 할 때, □OPCQ의 넓이는 몇 cm²인가?`, a * a / 4, {
          figure: b.svg(`${SAY_SQ}${SAY_O} 점 O를 한 꼭짓점으로 하는 정사각형 OEFG가 비스듬히 겹쳐 놓여 있다. 변 OE는 변 BC와 점 P에서, 변 OG는 변 CD와 점 Q에서 만난다. 두 정사각형이 겹친 사각형 OPCQ가 색칠되어 있다. 변 AD의 길이는 ${cm(a)}`),
          explain: `△OBP와 △OCQ에서 ${eq('OB', 'OC')}, ∠OBP = ∠OCQ = 45°, ∠BOP = 90° − ∠POC = ∠COQ이므로 △OBP ≡ △OCQ (ASA 합동)이다. □OPCQ = △OPC + △OCQ = △OPC + △OBP = △OBC이고, △OBC의 넓이는 정사각형 ABCD의 넓이의 ${frac(1, 4)}이므로 ${a} × ${a} ÷ 4 = ${a * a / 4} (cm²)이다.`,
          facts: { calc: [[`${a}*${a}/4`, 0]], unseen: [4] }
        });
      }
      const v = d.until(() => ({ e: d.int(3, 8), f: d.int(3, 8) }), (x) => (x.e + x.f) % 2 === 0 && x.e !== x.f && x.e + x.f <= 14 && x.e + x.f >= 8), s = v.e + v.f, P = rect(s, s); P.E = [0, s - v.e]; P.F = [v.f, s];
      const g = fit(P, [140, 140]), b = shape(g, 'ABCD', { diag: true, fill: ['AEOF'], oIn: 'BC' });
      segs(b, g, 'OE OF'); nameOn(b, g, 'E', 'AB'); nameOn(b, g, 'F', 'AD'); ang(b, g, 'EOF', ''); len(b, g, 'AE', cm(v.e), null, { gap: 14 }); len(b, g, 'AF', cm(v.f), null, { gap: 14 });
      return areaQ(`정사각형 ABCD의 두 대각선의 교점을 O라 하자. 변 AB, AD 위의 두 점 E, F에 대하여 ∠EOF = 90°이고 ${sg('AE')} = ${cm(v.e)}, ${sg('AF')} = ${cm(v.f)}일 때, □AEOF의 넓이는 몇 cm²인가?`, s * s / 4, {
        figure: b.svg(`${SAY_SQ}${SAY_O} 변 AB 위에 점 E, 변 AD 위에 점 F가 있고 선분 OE, 선분 OF가 그어져 있다. ∠EOF에 직각 표시가 있고 사각형 AEOF가 색칠되어 있다. 선분 AE의 길이는 ${cm(v.e)}, 선분 AF의 길이는 ${cm(v.f)}`),
        explain: `△AEO와 △DFO에서 ${eq('OA', 'OD')}, ∠OAE = ∠ODF = 45°, ∠AOE = 90° − ∠AOF = ∠DOF이므로 △AEO ≡ △DFO (ASA 합동)이고 ${sg('DF')} = ${sg('AE')} = ${cm(v.e)}이다. 정사각형의 한 변의 길이는 ${v.f} + ${v.e} = ${s} (cm)이다. □AEOF = △AEO + △AOF = △DFO + △AOF = △AOD이므로 넓이는 ${s} × ${s} ÷ 4 = ${s * s / 4} (cm²)이다.`,
        facts: { calc: [[`(${v.e}+${v.f})*(${v.e}+${v.f})/4`, 0]], unseen: [4] }
      });
    }, { count: 2 }),
    T('sq-bisect-seg', '정사각형에서 서로 다른 것을 이등분하는 두 선분', '심35', (d) => {
      const v = d.until(() => ({ e: d.int(3, 7), f: d.int(3, 7) }), (x) => Math.abs(x.e - x.f) >= 2), s = v.e + v.f, P = rect(s, s); P.E = [0, v.e]; P.F = [s, v.f]; P.G = P.O; delete P.O;
      const g = fit(P, [140, 140]), b = shape(g, 'ABCD');
      b.seg(g.A, g.C, 'thin').seg(g.E, g.F); nameOn(b, g, 'E', 'AB'); nameOn(b, g, 'F', 'DC'); nameIn(b, g, 'G', 'ACEF'); ticks(b, g, 'AG GC', 1); ticks(b, g, 'EG GF', 2); len(b, g, 'EB', cm(v.e), null, { gap: 14 }); len(b, g, 'FC', cm(v.f), null, { gap: 14 });
      return areaQ(`정사각형 ABCD에서 변 AB 위의 점 E와 변 DC 위의 점 F를 이은 선분 EF가 대각선 AC와 점 G에서 만난다. ${eq('AG', 'CG')}, ${eq('EG', 'FG')}이고 ${sg('EB')} = ${cm(v.e)}, ${sg('FC')} = ${cm(v.f)}일 때, 정사각형 ABCD의 넓이는 몇 cm²인가?`, s * s, {
        figure: b.svg(`${SAY_SQ} 대각선 AC와, 변 AB 위의 점 E와 변 DC 위의 점 F를 이은 선분 EF가 점 G에서 만난다. 선분 AG와 선분 GC에 같은 표시(한 줄), 선분 EG와 선분 GF에 같은 표시(두 줄)가 있다. 선분 EB의 길이는 ${cm(v.e)}, 선분 FC의 길이는 ${cm(v.f)}`),
        explain: `△AEG와 △CFG에서 ${eq('AG', 'CG')}, ${eq('EG', 'FG')}, ∠AGE = ∠CGF(맞꼭지각)이므로 △AEG ≡ △CFG (SAS 합동)이고 ${sg('AE')} = ${sg('CF')} = ${cm(v.f)}이다. ${sg('AB')} = ${v.f} + ${v.e} = ${s} (cm)이므로 정사각형의 넓이는 ${s} × ${s} = ${s * s} (cm²)이다.`,
        facts: { calc: [[`(${v.e}+${v.f})*(${v.e}+${v.f})`, 0]] }
      });
    }),
    T('kinds-perp-rhombus', '두 대각선이 서로 수직인 평행사변형의 둘레의 길이', '②45', (d) => {
      const s = d.int(4, 12), g = fit(para(1, 1, d.int(58, 68)), [185, 110]), b = shape(g, 'ABCD', { diag: true, oIn: 'BC' });
      ang(b, g, 'AOD', ''); len(b, g, 'AB', cm(s));
      return lenQ(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. ∠AOD = 90°, ${sg('AB')} = ${cm(s)}일 때, 평행사변형 ABCD의 둘레의 길이는 몇 cm인가?`, 4 * s, {
        figure: b.svg(`평행사변형 ABCD. ${at4}${SAY_O} ∠AOD에 직각 표시가 있다. 변 AB의 길이는 ${cm(s)}`),
        explain: `두 대각선이 서로 수직인 평행사변형은 마름모이다. 마름모의 네 변의 길이는 모두 같으므로 둘레의 길이는 4 × ${s} = ${4 * s} (cm)이다.`,
        facts: { calc: [[`4*${s}`, 0]], unseen: [4] }
      });
    }),
    T('rect-perp-bis', '직사각형의 대각선의 수직이등분선이 만드는 사각형', '①51 ②46 심25 심26', (d, n) => {
      const v = n === 0 ? d.until(() => ({ a: d.int(10, 20), b: d.int(3, 7) }), (x) => x.b / x.a >= 0.22 && x.b / x.a <= 0.38) : { a: 18, b: 5 }, h = Math.sqrt(v.a * v.a - 2 * v.a * v.b);
      const P = rect(v.a, h); P.E = [v.a - v.b, h]; P.F = [v.b, 0];
      const g = fit(P, [205, 130]), b = shape(g, 'ABCD');
      b.seg(g.A, g.C, 'thin').seg(g.E, g.F, 'thin'); segs(b, g, 'AF CE'); nameOn(b, g, 'E', 'AD'); b.name(g.F, 'F', 300, 13); nameAt(b, g, 'O', 'AF'); ang(b, g, 'COE', ''); ticks(b, g, 'OA OC', 1);
      const said = `${SAY_RECT} 대각선 AC의 중점 O를 지나고 대각선 AC에 수직인 직선이 변 AD와 점 E에서, 변 BC와 점 F에서 만난다. 선분 OA와 선분 OC에 같은 길이 표시가, 점 O에 직각 표시가 있다. 선분 AF, 선분 CE가 그어져 있다.`;
      const why = `△AOE와 △COF에서 ${eq('OA', 'OC')}, ∠AOE = ∠COF = 90°, ∠EAO = ∠FCO(엇각)이므로 △AOE ≡ △COF (ASA 합동)이고 ${eq('AE', 'CF')}이다. ${par('AE', 'FC')}, ${eq('AE', 'FC')}이므로 □AFCE는 평행사변형이고, 두 대각선이 서로 수직이므로 마름모이다.`;
      if (n === 0) {
        len(b, g, 'BF', cm(v.b));
        return lenQ(`직사각형 ABCD에서 대각선 AC의 수직이등분선이 변 AD, BC와 만나는 점을 각각 E, F라 하자. ${sg('AD')} = ${cm(v.a)}, ${sg('BF')} = ${cm(v.b)}일 때, □AFCE의 둘레의 길이는 몇 cm인가?`, 4 * (v.a - v.b), {
          figure: b.svg(`${said} 선분 BF의 길이는 ${cm(v.b)}`),
          explain: `${why} ${sg('FC')} = ${sg('BC')} − ${sg('BF')} = ${v.a} − ${v.b} = ${v.a - v.b} (cm)이므로 □AFCE의 둘레의 길이는 4 × ${v.a - v.b} = ${4 * (v.a - v.b)} (cm)이다.`,
          facts: { calc: [[`4*(${v.a}-${v.b})`, 0]], unseen: [4] }
        });
      }
      const yes = ['∠AOE = ∠COF', '∠EAO = ∠FCO', eq('EO', 'FO'), eq('AF', 'AE'), eq('AE', 'CF'), par('AF', 'EC'), '△AOE ≡ △COF'];
      const no = [[eq('AC', 'FE'), `마름모의 두 대각선은 서로 다른 것을 수직이등분할 뿐, 길이가 같다고 할 수 없다.`], [eq('AB', 'BF'), `${sg('AB')}와 ${sg('BF')}의 길이가 같다고 할 수 없다.`], [eq('AO', 'EO'), `${sg('AO')}와 ${sg('EO')}의 길이가 같다고 할 수 없다.`], ['∠AFB = ∠AFE', '∠AFB와 ∠AFE의 크기가 같다고 할 수 없다. 크기가 같은 것은 ∠AFE와 ∠CFE이다.']];
      return sayQ(d, '직사각형 ABCD에서 대각선 AC의 중점 O를 지나고 대각선 AC에 수직인 직선이 변 AD, BC와 만나는 점을 각각 E, F라 할 때, 다음 중 옳지 않은 것은?', yes, no.map((r) => [r[0], `${why} ${r[1]}`]), false, b.svg(said));
    }, { count: 2 })
  ]);

  // ── 등변사다리꼴 ──
  B.addTypes(UNIT, 'trap', [
    T('trap-xy', '등변사다리꼴의 각의 크기와 변·대각선의 길이', '①54 ②43', (d) => {
      const v = d.until(() => { const s = d.int(5, 9), be = d.int(58, 72), e = s + d.int(2, 6), k = s * Math.sin(be * RAD); return { s, be, e, t: Math.sqrt(e * e - k * k) - s * Math.cos(be * RAD) }; }, (x) => x.t >= 0.5 * x.s && x.t <= 1.15 * x.s);
      const c = v.s * Math.cos(v.be * RAD), g = fit(trap(v.t, v.t + 2 * c, v.s * Math.sin(v.be * RAD), c), [190, 110]), b = shape(g, 'ABCD');
      arrows(b, g, 'AD BC', 0.5); len(b, g, 'AB', cm(v.s)); ang(b, g, 'ABC', deg(v.be));
      return M(`${par('AD', 'BC')}인 등변사다리꼴 ABCD에서 ${sg('AB')} = ${cm(v.s)}, ${sg('BD')} = ${cm(v.e)}, ∠B = ${v.be}°일 때, ∠D의 크기와 ${sg('DC')}, ${sg('AC')}의 길이를 차례로 구하시오.`,
        [{ label: '∠D', answer: 180 - v.be, unit: '°' }, { label: sg('DC'), answer: v.s, unit: 'cm' }, { label: sg('AC'), answer: v.e, unit: 'cm' }], {
          figure: b.svg(`${SAY_TR} 변 AB의 길이는 ${cm(v.s)}, ∠B = ${v.be}°`),
          explain: `등변사다리꼴은 밑변의 양 끝 각의 크기가 같으므로 ∠C = ∠B = ${v.be}°이고, ${par('AD', 'BC')}이므로 ∠D = 180° − ${v.be}° = ${180 - v.be}°이다. 등변사다리꼴에서 평행하지 않은 두 변의 길이는 같으므로 ${sg('DC')} = ${sg('AB')} = ${cm(v.s)}, 두 대각선의 길이는 같으므로 ${sg('AC')} = ${sg('BD')} = ${cm(v.e)}이다.`,
          facts: { calc: [[`180-${v.be}`, 0], [String(v.s), 1], [String(v.e), 2]], unseen: [180] }
        });
    }),
    T('trap-expr', '두 각의 크기 사이의 관계가 주어진 등변사다리꼴', '①54', (d) => {
      const [k, c] = d.pick([[2, 30], [2, 15], [2, 45], [2, 60], [3, -20], [3, -40], [3, 20], [2, -15], [2, -30]]), v = (180 - c) / (k + 1), tail = c > 0 ? `+ ${c}°` : `− ${-c}°`;
      return degQ(`${par('AD', 'BC')}인 등변사다리꼴 ABCD에서 ∠D = ${k}∠B ${tail}일 때, ∠B의 크기는?`, v, {
        explain: `등변사다리꼴은 밑변의 양 끝 각의 크기가 같으므로 ∠C = ∠B이고, ${par('AD', 'BC')}이므로 ∠C + ∠D = 180°이다. ∠B + ${k}∠B ${tail} = 180°에서 ${k + 1}∠B = ${180 - c}°, ∠B = ${v}°이다.`,
        facts: { calc: [[c > 0 ? `(180-${c})/(${k}+1)` : `(180+${-c})/(${k}+1)`, 0]], unseen: [180, 1] }
      });
    }),
    T('trap-iso', '윗변과 옆변의 길이가 같은 등변사다리꼴의 각', '①55 심37', (d) => {
      const be = 2 * d.int(32, 39), c = Math.cos(be * RAD), g = fit(trap(1, 1 + 2 * c, Math.sin(be * RAD), c), [190, 112]), b = shape(g, 'ABCD');
      b.seg(g.A, g.C); ticks(b, g, 'AB AD DC', 1); ang(b, g, 'ABC', deg(be));
      return degQ(`${par('AD', 'BC')}인 등변사다리꼴 ABCD에서 ${eq('AB', 'AD')}이고 ∠B = ${be}°일 때, ∠ACB의 크기는?`, be / 2, {
        figure: b.svg(`${SAY_TR} 대각선 AC가 그어져 있다. 변 AB, 변 AD, 변 DC에 같은 길이 표시가 있다. ∠B = ${be}°`),
        explain: `등변사다리꼴에서 ${eq('AB', 'DC')}이므로 ${eq('DA', 'DC')}이고 ∠DAC = ∠DCA이다. ${par('AD', 'BC')}이므로 ∠DAC = ∠ACB(엇각)이다. 따라서 ∠ACB = ∠DCA이고, ∠C = ∠B = ${be}°이므로 ∠ACB = ${be}° ÷ 2 = ${be / 2}°이다.`,
        facts: { calc: [[`${be}/2`, 0]], unseen: [2] }
      });
    }),
    T('trap-foot', '등변사다리꼴에 수선·평행선을 그어 길이 구하기', '①56 심38', (d, n) => {
      if (n === 0) {
        const t = d.int(5, 9), k = d.int(2, 5), w = t + 2 * k, P = trap(t, w, k * Math.tan(d.int(58, 68) * RAD), k); P.H = [k, 0];
        const g = fit(P, [190, 118]), b = shape(g, 'ABCD');
        b.seg(g.A, g.H, 'thin'); b.name(g.H, 'H', 38, 13); ang(b, g, 'AHB', ''); len(b, g, 'AD', cm(t)); b.dim(g.B, g.C, cm(w), g.A, 12);
        return lenQ(`${par('AD', 'BC')}인 등변사다리꼴 ABCD의 꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하자. ${sg('AD')} = ${cm(t)}, ${sg('BC')} = ${cm(w)}일 때, ${sg('BH')}의 길이는 몇 cm인가?`, k, {
          figure: b.svg(`${SAY_TR} 점 A에서 변 BC에 내린 수선의 발 H에 직각 표시가 있다. 변 AD의 길이는 ${cm(t)}, 변 BC의 길이는 ${cm(w)}`),
          explain: `꼭짓점 D에서 변 BC에 내린 수선의 발을 H′이라 하면 □AHH′D는 직사각형이므로 ${sg('HH′')} = ${sg('AD')} = ${cm(t)}이다. △ABH와 △DCH′에서 ${eq('AB', 'DC')}, ∠B = ∠C, ∠AHB = ∠DH′C = 90°이므로 △ABH ≡ △DCH′이고 ${sg('BH')} = ${sg('CH′')}이다. 따라서 ${sg('BH')} = (${w} − ${t}) ÷ 2 = ${k} (cm)이다.`,
          facts: { calc: [[`(${w}-${t})/2`, 0]], unseen: [2] }
        });
      }
      const v = d.until(() => ({ t: d.int(5, 10), s: d.int(4, 8) }), (x) => x.t !== x.s), g = fit(trap(v.t, v.t + v.s, v.s * Math.sin(60 * RAD), v.s / 2), [195, 112]), b = shape(g, 'ABCD');
      ang(b, g, 'BAD', '120°'); len(b, g, 'AD', cm(v.t)); len(b, g, 'AB', cm(v.s));
      return lenQ(`${par('AD', 'BC')}인 등변사다리꼴 ABCD에서 ${sg('AD')} = ${cm(v.t)}, ${sg('AB')} = ${cm(v.s)}, ∠A = 120°일 때, ${sg('BC')}의 길이는 몇 cm인가?`, v.t + v.s, {
        figure: b.svg(`${SAY_TR} 변 AD의 길이는 ${cm(v.t)}, 변 AB의 길이는 ${cm(v.s)}, ∠A = 120°`),
        explain: `∠B = 180° − 120° = 60°이고 ∠C = ∠B = 60°이다. 점 D를 지나고 변 AB에 평행한 직선이 변 BC와 만나는 점을 E라 하면 □ABED는 평행사변형이므로 ${sg('BE')} = ${sg('AD')} = ${cm(v.t)}, ${sg('DE')} = ${sg('AB')} = ${cm(v.s)}이다. ∠DEC = ∠B = 60°(동위각), ∠C = 60°이므로 △DEC는 정삼각형이고 ${sg('EC')} = ${cm(v.s)}이다. ${sg('BC')} = ${v.t} + ${v.s} = ${v.t + v.s} (cm)이다.`,
        facts: { calc: [[`${v.t}+${v.s}`, 0]] }
      });
    }, { count: 2 })
  ]);

  // ── 여러 가지 사각형 사이의 관계 ──
  const TO_RECT_YES = [eq('AC', 'BD'), '∠A = 90°', '∠A = ∠B', eq('OA', 'OB'), '∠A + ∠C = 180°'];
  const TO_RECT_NO = [
    [perp('AC', 'BD'), '두 대각선이 서로 수직인 평행사변형은 마름모이다.'],
    [eq('AB', 'AD'), '이웃하는 두 변의 길이가 같은 평행사변형은 마름모이다.'],
    ['∠A = ∠C', '평행사변형의 대각의 크기는 늘 같으므로 새로 더하는 조건이 되지 못한다.'],
    [eq('OA', 'OC'), '평행사변형의 두 대각선은 늘 서로 다른 것을 이등분하므로 새로 더하는 조건이 되지 못한다.'],
    ['∠AOD = 90°', '두 대각선이 서로 수직인 평행사변형은 마름모이다.']
  ];
  const TO_RECT_SAY_YES = ['한 내각의 크기가 90°이다.', '두 대각선의 길이가 같다.', '이웃하는 두 내각의 크기가 같다.', '네 내각의 크기가 모두 같다.'];
  const TO_RECT_SAY_NO = [
    ['두 대각선이 서로 수직이다.', '두 대각선이 서로 수직인 평행사변형은 마름모이다.'],
    ['이웃하는 두 변의 길이가 같다.', '이웃하는 두 변의 길이가 같은 평행사변형은 마름모이다.'],
    ['두 대각선이 서로 다른 것을 이등분한다.', '평행사변형이 늘 갖는 성질이므로 새로 더하는 조건이 되지 못한다.'],
    ['두 쌍의 대각의 크기가 각각 같다.', '평행사변형이 늘 갖는 성질이므로 새로 더하는 조건이 되지 못한다.']
  ];
  const RECT_WHY = '평행사변형이 직사각형이 되려면 한 내각이 직각이거나 두 대각선의 길이가 같아야 한다.';
  // [조건, 맞는가, 까닭, 함께 싣지 않을 조건]
  const TO_RHOM = [
    [eq('AB', 'BC'), true, '이웃하는 두 변의 길이가 같다.'], [perp('AC', 'BD'), true, '두 대각선이 서로 수직이다.', '∠AOD = 90°'], ['∠AOD = 90°', true, '두 대각선이 서로 수직이다.', perp('AC', 'BD')],
    ['∠BAC = ∠BCA', true, `△ABC에서 ${eq('BA', 'BC')}이므로 이웃하는 두 변의 길이가 같다.`], ['∠ABD = ∠CBD', true, `∠CBD = ∠ADB(엇각)이므로 ∠ABD = ∠ADB이고 ${eq('AB', 'AD')}이다.`],
    [eq('AC', 'BD'), false, '직사각형이 되는 조건이다.'], ['∠ABC = 90°', false, '직사각형이 되는 조건이다.'], [eq('OA', 'OD'), false, '두 대각선의 길이가 같아지므로 직사각형이 되는 조건이다.'],
    ['∠A = ∠C', false, '평행사변형이 늘 갖는 성질이다.'], [eq('OA', 'OC'), false, '평행사변형이 늘 갖는 성질이다.']
  ];
  const TO_SQ = {
    직사각형: [
      [eq('AB', 'AD'), true, '이웃하는 두 변의 길이가 같다.'], [perp('AC', 'BD'), true, '두 대각선이 서로 수직이다.', '∠AOB = 90°'], ['∠AOB = 90°', true, '두 대각선이 서로 수직이다.', perp('AC', 'BD')], ['∠ABD = ∠DBC', true, `∠DBC = ∠ADB(엇각)이므로 ∠ABD = ∠ADB이고 ${eq('AB', 'AD')}이다.`],
      [eq('AC', 'BD'), false, '직사각형이 늘 갖는 성질이다.'], [eq('OA', 'OC'), false, '직사각형이 늘 갖는 성질이다.'], ['∠ABC = 90°', false, '직사각형이 늘 갖는 성질이다.'], ['∠ABD = ∠BDC', false, `${par('AB', 'DC')}이므로 늘 성립하는 식(엇각)이다.`]
    ],
    마름모: [
      [eq('AC', 'BD'), true, '두 대각선의 길이가 같다.', eq('OA', 'OB')], ['∠A = 90°', true, '한 내각이 직각이다.', '∠A = ∠B'], [eq('OA', 'OB'), true, '두 대각선의 길이가 같다.', eq('AC', 'BD')], ['∠A = ∠B', true, '∠A + ∠B = 180°이므로 한 내각이 직각이다.', '∠A = 90°'],
      [eq('AB', 'BC'), false, '마름모가 늘 갖는 성질이다.'], [perp('AC', 'BD'), false, '마름모가 늘 갖는 성질이다.'], ['∠ABD = ∠CBD', false, '마름모가 늘 갖는 성질이다.'], [eq('OA', 'OC'), false, '마름모가 늘 갖는 성질이다.']
    ]
  };
  const SQ_SAY = [
    ['이웃하는 두 변의 길이가 같은 직사각형', true, ''], ['한 내각의 크기가 90°인 마름모', true, ''], ['두 대각선이 서로 수직인 직사각형', true, ''], ['두 대각선의 길이가 같은 마름모', true, ''],
    ['이웃하는 두 내각의 크기가 같은 평행사변형', false, '직사각형이다.'], ['두 대각선의 길이가 같은 평행사변형', false, '직사각형이다.'], ['두 대각선이 서로 수직인 평행사변형', false, '마름모이다.'],
    ['이웃하는 두 변의 길이가 같은 평행사변형', false, '마름모이다.'], ['두 대각선의 길이가 같은 직사각형', false, '직사각형은 늘 두 대각선의 길이가 같으므로 직사각형일 뿐이다.'], ['두 대각선이 서로 수직인 마름모', false, '마름모는 늘 두 대각선이 서로 수직이므로 마름모일 뿐이다.']
  ];
  // 다섯 줄 고르기: 맞는 줄이 둘이나 셋이고, 함께 싣지 않을 조건이 겹치지 않게 뽑는다.
  const fiveRows = (d, pool) => d.until(() => d.shuffle(pool).slice(0, 5), (list) => { const k = list.filter((r) => r[1]).length; return k >= 2 && k <= 3 && !list.some((r) => r[3] && list.some((o) => o[0] === r[3])); });
  const rowsWhy = (rows) => rows.map((r, i) => (r[2] ? `${TAGS[i]}. ${r[2]}` : '')).filter(Boolean).join(' ');
  const INCLUDE_YES = ['정사각형은 마름모이다.', '정사각형은 직사각형이다.', '마름모는 평행사변형이다.', '직사각형은 평행사변형이다.', '평행사변형은 사다리꼴이다.', '정사각형은 평행사변형이다.'];
  const INCLUDE_NO = [
    ['마름모는 직사각형이다.', '마름모의 네 내각의 크기가 모두 같다고 할 수 없으므로 마름모가 모두 직사각형인 것은 아니다.'],
    ['직사각형은 정사각형이다.', '직사각형의 네 변의 길이가 모두 같다고 할 수 없다. 정사각형이 직사각형이다.'],
    ['등변사다리꼴은 평행사변형이다.', '등변사다리꼴은 한 쌍의 대변만 평행해도 되므로 평행사변형이라고 할 수 없다.'],
    ['평행사변형은 마름모이다.', '평행사변형의 네 변의 길이가 모두 같다고 할 수 없다. 마름모가 평행사변형이다.'],
    ['사다리꼴은 평행사변형이다.', '사다리꼴은 한 쌍의 대변만 평행해도 되므로 평행사변형이라고 할 수 없다. 평행사변형이 사다리꼴이다.'],
    ['마름모는 정사각형이다.', '마름모의 네 내각의 크기가 모두 같다고 할 수 없다. 정사각형이 마름모이다.'],
    ['직사각형은 마름모이다.', '직사각형의 네 변의 길이가 모두 같다고 할 수 없으므로 직사각형이 모두 마름모인 것은 아니다.']
  ];
  const DIAG_YES = ['평행사변형의 두 대각선은 서로 다른 것을 이등분한다.', '직사각형의 두 대각선은 길이가 같고, 서로 다른 것을 이등분한다.', '마름모의 두 대각선은 서로 다른 것을 수직이등분한다.', '정사각형의 두 대각선은 길이가 같고, 서로 다른 것을 수직이등분한다.', '등변사다리꼴의 두 대각선은 길이가 같다.'];
  const DIAG_NO = [
    ['직사각형의 두 대각선은 서로 수직이다.', '직사각형의 두 대각선은 길이가 같고 서로 다른 것을 이등분한다. 서로 수직이라고 할 수 없다.'],
    ['마름모의 두 대각선은 길이가 같고, 서로 다른 것을 수직이등분한다.', '마름모의 두 대각선은 서로 다른 것을 수직이등분한다. 길이가 같다고 할 수 없다.', ['마름모의 두 대각선은 서로 다른 것을 수직이등분한다.']],
    ['평행사변형의 두 대각선은 서로 다른 것을 수직이등분한다.', '평행사변형의 두 대각선은 서로 다른 것을 이등분한다. 서로 수직이라고 할 수 없다.', ['평행사변형의 두 대각선은 서로 다른 것을 이등분한다.']],
    ['등변사다리꼴의 두 대각선은 서로 다른 것을 이등분한다.', '등변사다리꼴의 두 대각선은 길이가 같다. 서로 다른 것을 이등분한다고 할 수 없다.'],
    ['평행사변형의 두 대각선은 길이가 같다.', '평행사변형의 두 대각선은 서로 다른 것을 이등분한다. 길이가 같다고 할 수 없다.']
  ];
  // 사각형 사이의 관계 그림: 평행사변형 → 직사각형(㉠)·마름모(㉡) → 정사각형(㉢·㉣)
  function relFig() {
    const b = Board(), boxAt = (name, x, y, w) => { b.poly([[x, y], [x + w, y], [x + w, y + 26], [x, y + 26]], WHITE); b.text([x + w / 2, y + 13], name, { plain: true }); };
    boxAt('평행사변형', 0, 48, 80); boxAt('직사각형', 108, 0, 66); boxAt('마름모', 115, 96, 52); boxAt('정사각형', 204, 48, 66);
    const link = (p, q, tag, dx, dy) => { b.seg(p, q, 'thin').arrow(p, q, 1); const m = mid(p, q); b.text([m[0] + dx, m[1] + dy], tag); };
    link([62, 45], [112, 29], '㉠', -6, -11); link([62, 77], [118, 93], '㉡', -6, 12); link([166, 29], [214, 45], '㉢', 6, -11); link([163, 93], [214, 77], '㉣', 6, 12);
    return b.svg('여러 가지 사각형 사이의 관계를 나타낸 그림. 평행사변형에서 직사각형으로 가는 화살표 ㉠, 평행사변형에서 마름모로 가는 화살표 ㉡, 직사각형에서 정사각형으로 가는 화살표 ㉢, 마름모에서 정사각형으로 가는 화살표 ㉣이 있다');
  }
  // 원의 지름으로 만든 사각형: radii [AC 쪽 반지름, BD 쪽 반지름](px), turn: 두 지름이 이루는 각(∠AOB)
  function circleFig(radii, turn, said) {
    const b = Board(), O = [0, 0], g = { O, A: [radii[0] * Math.cos(145 * RAD), -radii[0] * Math.sin(145 * RAD)], B: [radii[1] * Math.cos((145 + turn) * RAD), -radii[1] * Math.sin((145 + turn) * RAD)] };
    g.C = [-g.A[0], -g.A[1]]; g.D = [-g.B[0], -g.B[1]];
    for (const r of radii[0] === radii[1] ? [radii[0]] : radii) b.disk(O, r);
    b.seg(g.A, g.C).seg(g.B, g.D); for (const k of 'ABCD') b.dot(g[k]).name(g[k], k, dirOf(O, g[k]), 12);
    if (turn === 90) b.corner(O, g.A, g.B, ''); nameAt(b, g, 'O', 'BC');
    return b.svg(said);
  }

  B.addTypes(UNIT, 'rel', [
    T('rel-to-rect', '평행사변형이 직사각형이 되는 조건', '①58 ②51', (d, n) => {
      const wantTrue = d.next() < 0.4;
      const q = n === 0
        ? sayQ(d, `다음 중 평행사변형 ABCD가 직사각형이 되는 조건${wantTrue ? '은' : '이 아닌 것은'}? ${O_NOTE}`, TO_RECT_YES, TO_RECT_NO, wantTrue)
        : sayQ(d, `평행사변형에 조건 하나를 더하여 직사각형이 되게 하려고 한다. 다음 중 더할 조건으로 알맞${wantTrue ? '은' : '지 않은'} 것은?`, TO_RECT_SAY_YES, TO_RECT_SAY_NO, wantTrue);
      q.explain += ' ' + RECT_WHY;
      return q;
    }, { count: 2 }),
    T('rel-to-rhom', '평행사변형이 마름모가 되는 조건', '①59', (d) => {
      const rows = fiveRows(d, TO_RHOM);
      return allQ(d, `다음 ㄱ~ㅁ 가운데 평행사변형 ABCD가 마름모가 되는 조건을 모두 고른 것은? ${O_NOTE}`, TAGS, rows.map((r) => r[1]), {
        figure: tagged(rows.map((r) => r[0]), TAGS), explain: '평행사변형이 마름모가 되려면 이웃하는 두 변의 길이가 같거나 두 대각선이 서로 수직이어야 한다. ' + rowsWhy(rows)
      });
    }),
    T('rel-rhom-expr', '마름모가 되도록 하는 변의 길이', '①60', (d) => {
      const v = d.until(() => { const x = d.int(2, 7), p = d.pick([1, 2, 3]), r = p + d.pick([1, 2, 3]), q = d.int(1, 9); return { x, p, r, q, t: (r - p) * x - q, side: p * x + q }; }, (w) => w.t >= 1 && w.t <= 9 && w.side >= 5 && w.side <= 20), px = (k) => (k === 1 ? '' : k) + X;
      return lenQ(`평행사변형 ABCD에서 ${sg('AB')} = ${nb(`(${px(v.p)} + ${v.q}) cm`)}, ${sg('AD')} = ${nb(`(${px(v.r)} − ${v.t}) cm`)}이다. 평행사변형 ABCD가 마름모가 되도록 할 때, ${sg('AD')}의 길이는 몇 cm인가?`, v.side, {
        explain: `이웃하는 두 변의 길이가 같은 평행사변형은 마름모이다. ${px(v.p)} + ${v.q} = ${px(v.r)} − ${v.t}에서 ${px(v.r - v.p)} = ${v.q + v.t}, ${X} = ${v.x}이다. ${sg('AD')} = ${v.r} × ${v.x} − ${v.t} = ${v.side} (cm)이다.`,
        facts: { calc: [[`${v.r}*(${v.q}+${v.t})/(${v.r}-${v.p})-${v.t}`, 0]], unseen: [1] }
      });
    }),
    T('rel-to-square', '정사각형이 되는 조건', '①61 ②54 심40', (d, n) => {
      if (n === 0) {
        const base = d.pick(['직사각형', '마름모']), rows = fiveRows(d, TO_SQ[base]);
        return allQ(d, `다음 ㄱ~ㅁ 가운데 ${base} ABCD가 정사각형이 되는 조건을 모두 고른 것은? ${O_NOTE}`, TAGS, rows.map((r) => r[1]), {
          figure: tagged(rows.map((r) => r[0]), TAGS), explain: (base === '직사각형' ? '직사각형이 정사각형이 되려면 이웃하는 두 변의 길이가 같거나 두 대각선이 서로 수직이어야 한다. ' : '마름모가 정사각형이 되려면 한 내각이 직각이거나 두 대각선의 길이가 같아야 한다. ') + rowsWhy(rows)
        });
      }
      const rows = fiveRows(d, SQ_SAY);
      return allQ(d, '다음 ㄱ~ㅁ 가운데 항상 정사각형인 것을 모두 고른 것은?', TAGS, rows.map((r) => r[1]), {
        figure: tagged(rows.map((r) => r[0]), TAGS), explain: '정사각형은 직사각형이면서 마름모인 사각형이다. ' + rowsWhy(rows)
      });
    }, { count: 2 }),
    T('rel-name', '조건을 만족시키는 평행사변형의 가장 알맞은 이름', '①62 ②53 심39', (d, n) => {
      const ask = '□ABCD를 나타내는 가장 알맞은 이름은?';
      if (n === 0) {
        const [cond, right, why] = d.pick([
          [eq('AC', 'BD'), '직사각형', '두 대각선의 길이가 같은 평행사변형은 직사각형이다.'], [perp('AC', 'BD'), '마름모', '두 대각선이 서로 수직인 평행사변형은 마름모이다.'],
          [eq('OA', 'OB'), '직사각형', `${eq('OA', 'OC')}, ${eq('OB', 'OD')}이므로 ${eq('OA', 'OB')}이면 두 대각선의 길이가 같다. 두 대각선의 길이가 같은 평행사변형은 직사각형이다.`],
          [eq('AB', 'AD'), '마름모', '이웃하는 두 변의 길이가 같은 평행사변형은 마름모이다.'], ['∠A = ∠B', '직사각형', '∠A + ∠B = 180°이므로 ∠A = ∠B = 90°이다. 한 내각이 직각인 평행사변형은 직사각형이다.'],
          ['∠ABD = ∠CBD', '마름모', `∠CBD = ∠ADB(엇각)이므로 ∠ABD = ∠ADB이고 ${eq('AB', 'AD')}이다. 이웃하는 두 변의 길이가 같은 평행사변형은 마름모이다.`]
        ]);
        return pickOne(d, `평행사변형 ABCD가 ${cond}를 만족시킬 때, ${ask} ${O_NOTE}`, right, ['직사각형', '마름모', '정사각형', '등변사다리꼴'].filter((s) => s !== right), { explain: why + ' 정사각형이라고 할 수는 없다.' });
      }
      if (d.next() < 0.3) {
        return pickOne(d, `사각형 ABCD가 세 조건 ${par('AD', 'BC')}, ${eq('AD', 'BC')}, ∠B = 90°를 모두 만족시킬 때, ${ask}`, '직사각형', ['평행사변형', '마름모', '정사각형'], {
          explain: '한 쌍의 대변이 평행하고 그 길이가 같으므로 평행사변형이고, 한 내각이 직각인 평행사변형은 직사각형이다. 이웃하는 두 변의 길이가 같은지는 알 수 없으므로 정사각형이라고 할 수 없다.'
        });
      }
      const [cond, right, why] = d.pick([
        [`∠A = 90°, ${perp('AC', 'BD')}`, '정사각형', '한 내각이 직각이므로 직사각형이고, 두 대각선이 서로 수직이므로 마름모이다. 직사각형이면서 마름모인 사각형은 정사각형이다.'],
        [`${eq('BC', 'CD')}, ${eq('AC', 'BD')}`, '정사각형', '이웃하는 두 변의 길이가 같으므로 마름모이고, 두 대각선의 길이가 같으므로 직사각형이다. 직사각형이면서 마름모인 사각형은 정사각형이다.'],
        [`${eq('AC', 'BD')}, ∠C = 90°`, '직사각형', '두 조건 모두 직사각형이 되는 조건이다. 이웃하는 두 변의 길이가 같은지는 알 수 없으므로 정사각형이라고 할 수 없다.'],
        [`${eq('AB', 'BC')}, ${perp('AC', 'BD')}`, '마름모', '두 조건 모두 마름모가 되는 조건이다. 한 내각이 직각인지는 알 수 없으므로 정사각형이라고 할 수 없다.'],
        [`${eq('OA', 'OB')}, ${perp('AC', 'BD')}`, '정사각형', `${eq('OA', 'OB')}이면 두 대각선의 길이가 같으므로 직사각형이고, 두 대각선이 서로 수직이므로 마름모이다. 직사각형이면서 마름모인 사각형은 정사각형이다.`]
      ]);
      return pickOne(d, `평행사변형 ABCD가 두 조건 ${cond}를 모두 만족시킬 때, ${ask} ${O_NOTE}`, right, QUADS.filter((s) => s !== right), { explain: why });
    }, { count: 2 }),
    T('rel-if-then', '조건을 더한 평행사변형에 대한 설명 가리기', '①62 ②52', (d) => {
      const yes = ['∠A = 90°이면 직사각형이다.', `${perp('AC', 'BD')}이면 마름모이다.`, `${eq('AB', 'BC')}이면 마름모이다.`, `${eq('AC', 'BD')}이면 직사각형이다.`, `${eq('BC', 'CD')}, ${eq('OA', 'OB')}이면 정사각형이다.`, `∠A = 90°, ${perp('AC', 'BD')}이면 정사각형이다.`];
      const no = [
        [`${eq('AD', 'DC')}이면 직사각형이다.`, '이웃하는 두 변의 길이가 같은 평행사변형은 마름모이다. 직사각형이라고 할 수 없다.'],
        [`${eq('OC', 'OD')}이면 마름모이다.`, `${eq('OC', 'OD')}이면 두 대각선의 길이가 같으므로 직사각형이다. 마름모라고 할 수 없다.`],
        [`${eq('AC', 'BD')}, ∠C = 90°이면 정사각형이다.`, '두 조건 모두 직사각형이 되는 조건이다. 이웃하는 두 변의 길이가 같은지 알 수 없으므로 정사각형이라고 할 수 없다.'],
        [`${perp('AC', 'BD')}, ${eq('AB', 'BC')}이면 정사각형이다.`, '두 조건 모두 마름모가 되는 조건이다. 한 내각이 직각인지 알 수 없으므로 정사각형이라고 할 수 없다.']
      ];
      const wantTrue = d.next() < 0.4;
      return sayQ(d, `평행사변형 ABCD에 대한 다음 설명 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은? ${O_NOTE}`, yes, no, wantTrue);
    }),
    T('rel-diagram', '사각형 사이의 관계를 나타낸 그림에서 조건이 들어갈 자리', '①66 ②59', (d, n) => {
      const [cond, right, why] = n === 0
        ? d.pick([['두 대각선의 길이가 같다.', '㉠, ㉣', '두 대각선의 길이가 같은 평행사변형은 직사각형이고, 두 대각선의 길이가 같은 마름모는 정사각형이다.'], ['두 대각선이 서로 수직이다.', '㉡, ㉢', '두 대각선이 서로 수직인 평행사변형은 마름모이고, 두 대각선이 서로 수직인 직사각형은 정사각형이다.']])
        : d.pick([['이웃하는 두 변의 길이가 같다.', '㉡, ㉢', '이웃하는 두 변의 길이가 같은 평행사변형은 마름모이고, 이웃하는 두 변의 길이가 같은 직사각형은 정사각형이다.'], ['한 내각의 크기가 90°이다.', '㉠, ㉣', '한 내각이 직각인 평행사변형은 직사각형이고, 한 내각이 직각인 마름모는 정사각형이다.']]);
      return pickOne(d, `그림은 여러 가지 사각형 사이의 관계를 나타낸 것이다. 화살표 ㉠~㉣ 가운데 「${cond}」라는 조건을 더하는 곳을 모두 고른 것은?`, right, ['㉠, ㉣', '㉡, ㉢', '㉠, ㉡', '㉢, ㉣', '㉠, ㉢'].filter((s) => s !== right), { figure: relFig(), explain: why });
    }, { count: 2 }),
    T('rel-include', '사각형 사이의 포함 관계에 대한 설명 가리기', '①67 ②56 심41', (d) => {
      const wantTrue = d.bool();
      return sayQ(d, `여러 가지 사각형 사이의 관계에 대한 다음 설명 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, INCLUDE_YES, INCLUDE_NO, wantTrue);
    }),
    T('rel-diag-claims', '사각형의 대각선의 성질에 대한 설명 가리기', '①68 ②55', (d) => {
      const wantTrue = d.next() < 0.35;
      return sayQ(d, `사각형의 대각선에 대한 다음 설명 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, DIAG_YES, DIAG_NO, wantTrue);
    }),
    T('rel-table', '사각형의 성질을 정리한 표', '①70 ②58', (d) => {
      const pool = [['두 쌍의 대변이 각각 평행하다.', [1, 1, 1, 1], 0], ['네 변의 길이가 모두 같다.', [0, 0, 1, 1], 0], ['네 내각의 크기가 모두 같다.', [0, 1, 0, 1], 0], ['두 대각선의 길이가 같다.', [0, 1, 0, 1], 1], ['두 대각선이 서로 수직이다.', [0, 0, 1, 1], 1], ['두 대각선이 서로 다른 것을 이등분한다.', [1, 1, 1, 1], 1]];
      const rows = d.until(() => d.shuffle(pool).slice(0, 3), (list) => list.filter((r) => r[2]).length >= 2), counts = rows.map((r) => r[1].reduce((s, v) => s + v, 0)), total = counts.reduce((s, v) => s + v, 0);
      return N('다음 표에서 사각형이 항상 갖는 성질인 칸에 ○표를 하려고 한다. ○표를 해야 하는 칸은 모두 몇 개인가?', total, {
        unit: '개', figure: tagged(rows.map((r) => r[0]), SYM) + table([''].concat(SYM.slice(0, 3)), QUADS.map((q) => [q, '', '', ''])),
        explain: rows.map((r, i) => `${SYM[i]}의 성질을 항상 갖는 사각형은 ${QUADS.filter((_, k) => r[1][k]).join(', ')}의 ${counts[i]}개이다.`).join(' ') + ` 모두 ${counts.join(' + ')} = ${total}(개)이다.`,
        facts: { calc: [[counts.join('+'), 0]], unseen: [2, 4] }
      });
    }),
    T('rel-circle', '원의 지름을 대각선으로 하는 사각형', '②60', (d, n) => {
      const ask = '네 점 A, B, C, D를 차례로 이은 □ABCD를 나타내는 가장 알맞은 이름은?', turn = d.bool() ? 90 : d.int(62, 72), tail = ' 네 점 A, B, C, D가 이 차례로 시계 반대 방향으로 놓여 있다';
      if (n === 0) {
        const right = turn === 90 ? '정사각형' : '직사각형';
        return pickOne(d, `점 O를 중심으로 하는 원에 ${turn === 90 ? '서로 수직인 ' : ''}두 지름 AC, BD를 그었다. ${ask}`, right, QUADS.filter((s) => s !== right), {
          figure: circleFig([56, 56], turn, `점 O를 중심으로 하는 원과 두 지름 AC, BD.${turn === 90 ? ' 두 지름이 만나는 곳에 직각 표시가 있다.' : ''}${tail}`),
          explain: `한 원의 지름은 길이가 모두 같고 원의 중심에서 서로 다른 것을 이등분한다. □ABCD는 두 대각선의 길이가 같고 서로 다른 것을 이등분하므로 직사각형이다.${turn === 90 ? ' 두 대각선이 서로 수직이기도 하므로 정사각형이다.' : ' 두 대각선이 서로 수직이 아니므로 정사각형은 아니다.'}`
        });
      }
      const right = turn === 90 ? '마름모' : '평행사변형';
      return pickOne(d, `점 O를 중심으로 하고 반지름의 길이가 서로 다른 두 원이 있다. 큰 원의 지름 AC와 작은 원의 지름 BD를 ${turn === 90 ? '서로 수직이 되게 ' : ''}그었을 때, ${ask}`, right, QUADS.filter((s) => s !== right), {
        figure: circleFig([60, 36], turn, `점 O를 중심으로 하는 크고 작은 두 원. 큰 원의 지름 AC와 작은 원의 지름 BD가 그어져 있다.${turn === 90 ? ' 두 지름이 만나는 곳에 직각 표시가 있다.' : ''}${tail}`),
        explain: `두 지름은 원의 중심 O에서 서로 다른 것을 이등분하므로 □ABCD는 평행사변형이다. 두 지름의 길이는 서로 다르므로 직사각형은 아니다.${turn === 90 ? ' 두 대각선이 서로 수직이므로 마름모이다.' : ' 두 대각선이 서로 수직이 아니므로 마름모도 아니다.'}`
      });
    }, { count: 2 })
  ]);

  // ── 평행선과 넓이 ──
  // 사다리꼴 ABCD(AD ∥ BC)와 두 대각선의 교점 O. 윗변과 아랫변의 길이의 비가 top : base
  function trapO(top, base) { const P = trap(top, base, 0.62 * base, 0.3 * base); P.O = meet(P.A, P.C, P.B, P.D); return P; }
  // □ABCD 와 변 BC 의 연장선 위의 점 E(AC ∥ DE). △ABC : △ACE = p : q, DE : AC = r
  function quadE(p, q, r) {
    const P = { A: [0.32, 1.2], B: [0, 0], C: [1.4, 0] }; P.E = [1.4 + 1.4 * q / p, 0]; P.D = [P.E[0] - r * (P.C[0] - P.A[0]), r * P.A[1]]; P.O = meet(P.A, P.E, P.C, P.D);
    return P;
  }

  B.addTypes(UNIT, 'par', [
    T('par-trap', '사다리꼴에서 넓이가 같은 두 삼각형', '①72', (d, n) => {
      if (n === 0) {
        const t = d.int(6, 24), g = fit(trapO(1, 1.9), [185, 112]), b = shape(g, 'ABCD');
        segs(b, g, 'AC BD', 'thin'); arrows(b, g, 'AD BC', 0.5);
        return areaQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 △ABC의 넓이가 ${t} cm²일 때, △DBC의 넓이는 몇 cm²인가?`, t, {
          figure: b.svg(`${SAY_TR} 두 대각선 AC, BD가 그어져 있고, 변 AD와 변 BC에 평행 표시가 있다`),
          explain: `△ABC와 △DBC는 밑변 BC가 공통이고, ${par('AD', 'BC')}이므로 높이가 같다. 밑변의 길이와 높이가 같은 두 삼각형의 넓이는 같으므로 △DBC의 넓이는 ${t} cm²이다.`,
          facts: { calc: [[String(t), 0]] }
        });
      }
      const v = d.until(() => ({ t: d.int(6, 14), x: d.int(10, 32) }), (w) => w.x - w.t >= 4 && w.x <= 2.6 * w.t), s = v.t + v.x;
      const g = fit(trapO(v.t, v.x), [190, 118]), b = shape(g, 'ABCD', { diag: true, fill: ['ABO'] });
      arrows(b, g, 'AD BC', 0.5);
      return areaQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. △DBC의 넓이가 ${s} cm², △ABO의 넓이가 ${v.t} cm²일 때, △OBC의 넓이는 몇 cm²인가?`, v.x, {
        figure: b.svg(`${SAY_TR}${SAY_O} 변 AD와 변 BC에 평행 표시가 있고 삼각형 ABO가 색칠되어 있다`),
        explain: `△ABC와 △DBC는 밑변 BC가 공통이고 ${par('AD', 'BC')}이므로 높이가 같다. 따라서 △ABC의 넓이도 ${s} cm²이고, △OBC = △ABC − △ABO = ${s} − ${v.t} = ${v.x} (cm²)이다.`,
        facts: { calc: [[`${s}-${v.t}`, 0]] }
      });
    }, { count: 2 }),
    T('par-quad-tri', '사각형과 넓이가 같은 삼각형', '①73 ②38 심59', (d, n) => {
      const [r, unit] = d.pick([[2 / 3, 5], [3 / 4, 7]]), q = unit * d.int(2, 4), p = d.until(() => d.int(10, 60), (x) => q / x >= 0.45 && q / x <= 0.7), small = Math.round(q * r / (1 + r));
      const g = fit(quadE(p, q, r), [215, 124]), b = shape(g, 'ABCD', { skip: 'C' });
      b.seg(g.A, g.C, 'thin'); segs(b, g, 'CE DE AE'); nameIn(b, g, 'C', 'BEAD'); b.name(g.E, 'E', 300); arrows(b, g, 'AC DE', 0.55);
      const head = `□ABCD의 변 BC의 연장선 위에 ${par('AC', 'DE')}가 되도록 점 E를 잡았다.`, said = `사각형 ABCD. ${at4} 대각선 AC가 그어져 있다. 변 BC를 점 C 너머로 늘인 선 위에 점 E가 있고, 선분 DE와 선분 AE가 그어져 있다. 선분 AC와 선분 DE에 평행 표시가 있다.`;
      const same2 = `△ACD와 △ACE는 밑변 AC가 공통이고 ${par('AC', 'DE')}이므로 높이가 같아 넓이가 같다.`;
      if (n === 0) {
        return areaQ(`${head} △ABC의 넓이가 ${p} cm², △ACE의 넓이가 ${q} cm²일 때, □ABCD의 넓이는 몇 cm²인가?`, p + q, {
          figure: b.svg(said),
          explain: `${same2} □ABCD = △ABC + △ACD = △ABC + △ACE = ${p} + ${q} = ${p + q} (cm²)이다.`,
          facts: { calc: [[`${p}+${q}`, 0]] }
        });
      }
      nameIn(b, g, 'O', 'ACDE');
      return areaQ(`${head} 선분 AE와 변 CD의 교점을 O라 하자. △ABE의 넓이가 ${p + q} cm², □ABCO의 넓이가 ${p + q - small} cm²일 때, △AOD의 넓이는 몇 cm²인가?`, small, {
        figure: b.svg(`${said} 선분 AE와 변 CD가 점 O에서 만난다`),
        explain: `${same2} 따라서 □ABCD = △ABC + △ACD = △ABC + △ACE = △ABE이므로 □ABCD의 넓이는 ${p + q} cm²이다. △AOD = □ABCD − □ABCO = ${p + q} − ${p + q - small} = ${small} (cm²)이다.`,
        facts: { calc: [[`${p + q}-${p + q - small}`, 0]] }
      });
    }, { count: 2 }),
    T('par-ratio', '사다리꼴의 대각선과 넓이의 비', '심61', (d) => {
      const [m, n] = d.pick([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5]]), k = d.int(3, 8), t = m * k;
      const g = fit(trapO(m, n), [190, 118]), b = shape(g, 'ABCD', { diag: true, fill: ['OCD'] });
      arrows(b, g, 'AD BC', 0.5);
      return areaQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 두 대각선의 교점을 O라 하자. ${nb(`${sg('OA')} : ${sg('OC')} = ${m} : ${n}`)}이고 △OCD의 넓이가 ${t} cm²일 때, △OBC의 넓이는 몇 cm²인가?`, n * k, {
        figure: b.svg(`${SAY_TR}${SAY_O} 변 AD와 변 BC에 평행 표시가 있고 삼각형 OCD가 색칠되어 있다`),
        explain: `△ABC와 △DBC는 밑변 BC가 공통이고 높이가 같으므로 넓이가 같다. 두 삼각형에서 △OBC를 빼면 △OAB = △OCD = ${t} cm²이다. △OAB와 △OBC는 높이가 같으므로 넓이의 비는 밑변의 길이의 비와 같아 ${nb(`△OAB : △OBC = ${m} : ${n}`)}이다. △OBC의 넓이는 ${t} × ${frac(n, m)} = ${n * k} (cm²)이다.`,
        facts: { calc: [[`${t}*${n}/${m}`, 0]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
