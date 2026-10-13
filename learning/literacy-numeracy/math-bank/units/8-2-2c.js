// 중학교 2학년 2학기 2단원 사각형의 성질 — 실력 문항.
// 단원 틀과 단원 안의 도구, 싣는 기준, 뺀 것과 까닭은 8-2-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 한 쌍의 대변이 평행하고 「어느 한 쌍이든」 대변의 길이가 같으면 평행사변형이라고 여긴다. 평행한 대변과 길이가 같은 대변은 같은 쌍이어야 한다(다른 쌍이면 등변사다리꼴일 수 있다).
//  - ∠A + ∠B = 180°, ∠C + ∠D = 180°처럼 식이 둘이면 조건도 둘이라고 여긴다(둘 다 같은 한 쌍의 대변이 평행하다는 말이다). 엇각으로 준 조건을 평행으로 바꾸어 읽지 못한다.
//  - 두 대각선의 길이가 같은 사각형은 직사각형(과 정사각형)뿐이라고 여긴다. 등변사다리꼴도 두 대각선의 길이가 같다.
//  - 평행사변형의 내부의 한 점과 네 꼭짓점을 이은 네 삼각형의 넓이가 모두 같다고 여기거나, 이웃한 두 삼각형의 넓이를 더한다. 넓이의 합이 평행사변형의 넓이의 반인 것은 마주 보는 두 삼각형이다.
//  - 넓이가 같은 삼각형은 합동인 삼각형뿐이라고 여긴다. 밑변이 같고 평행선 사이에 있으면 모양이 달라도 넓이가 같다.
//  - 「마름모」「평행사변형」이라고만 주어진 도형이 조건 때문에 정사각형·마름모가 되는 것을 놓친다(한 내각이 직각인 마름모는 정사각형, 두 대각선이 서로 수직인 평행사변형은 마름모).
//  - 각의 이등분선과 평행선이 함께 있으면 이등변삼각형이 생긴다는 것을 한 번만 쓰고 멈춘다(수선에서 또 하나의 이등분선을 끌어내지 못한다).
//
// 실력에는 ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 기본 문서에 여러 번 나오는 꼴(이웃한 두 내각의 이등분선 사이의 길이, 직사각형의 대각선의 수직이등분선이 만드는 마름모, 겹쳐 놓은 두 정사각형, 포함 관계 문장의 참·거짓,
// 평행사변형이 직사각형·마름모가 되는 조건, 대각선의 성질 표)은 기본 묶음에 두었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 각도는 수에 붙여 적고(108°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, frac, tagged } = B.kit;
  const { V, nb } = B.kit.mid;
  const { RAD, dirOf, meet } = B.kit.mgeo;
  const { UNIT, STD, sg, HALF, eq, par, cm, O_NOTE, TAGS, SAY_PG, SAY_O, degQ, lenQ, areaQ, pickOne, allQ, sayQ, pol, lerp, foot, para, paraDiag, rect, rhom, fit, centre, shape, segs, nameOn, nameIn, nameAt, same, ang, len, lenHalf, ticks, arrows, deg, halves } = B.kit.m822;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②57' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const at4 = '점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다.';
  const SAY_RECT = '직사각형 ABCD. ' + at4, SAY_SQ = '정사각형 ABCD. ' + at4, SAY_RH = '마름모 ABCD. 점 A는 위, 점 B는 왼쪽, 점 C는 아래, 점 D는 오른쪽에 있다.';
  const A_ = V('a'), S_ = V('S');

  // 평행사변형이 되는가를 따질 조건들: [조건, 되는가, 까닭, 함정인가]
  const COUNT_POOL = [
    [`${par('AD', 'BC')}, ${eq('AB', 'DC')}`, false, '평행한 대변과 길이가 같은 대변이 서로 다른 쌍이다. 등변사다리꼴일 수 있다.', true],
    [`${par('AD', 'BC')}, ${eq('AD', 'BC')}`, true, '한 쌍의 대변이 평행하고 그 길이가 같다.', false],
    ['∠A + ∠B = 180°, ∠B + ∠C = 180°', true, `∠A + ∠B = 180°이면 ${par('AD', 'BC')}, ∠B + ∠C = 180°이면 ${par('AB', 'DC')}이므로 두 쌍의 대변이 각각 평행하다.`, true],
    ['∠A + ∠B = 180°, ∠C + ∠D = 180°', false, `두 식 모두 ${par('AD', 'BC')}를 뜻한다. 한 쌍의 대변만 평행하다.`, true],
    [`∠B = ∠D, ${eq('AD', 'BC')}`, false, '한 쌍의 대각의 크기가 같고 한 쌍의 대변의 길이가 같은 것은 평행사변형이 되는 조건이 아니다.', true],
    [`${eq('OA', 'OC')}, ${eq('OB', 'OD')}`, true, '두 대각선이 서로 다른 것을 이등분한다.', false],
    [`${eq('OA', 'OB')}, ${eq('OC', 'OD')}`, false, `${eq('OA', 'OC')}인지 알 수 없으므로 두 대각선이 서로 다른 것을 이등분한다고 할 수 없다.`, true],
    ['∠ABD = ∠CDB, ∠ADB = ∠CBD', true, `엇각의 크기가 같으므로 ${par('AB', 'DC')}, ${par('AD', 'BC')}이다. 두 쌍의 대변이 각각 평행하다.`, true],
    [`${eq('AB', 'DC')}, ∠BAC = ∠DCA`, true, `엇각의 크기가 같으므로 ${par('AB', 'DC')}이고, 그 길이가 같다.`, true],
    [`${eq('AB', 'BC')}, ${eq('CD', 'DA')}`, false, '길이가 같은 것이 이웃한 변끼리이다.', false],
    [`${eq('AB', 'DC')}, ${eq('AD', 'BC')}`, true, '두 쌍의 대변의 길이가 각각 같다.', false]
  ];

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-cond-count', '기호로 쓴 조건 가운데 평행사변형이 되는 것의 개수', '심14 / 기본 ②20 ②21', (d) => {
        // 함정: 평행한 쌍과 길이가 같은 쌍이 다른 조건, 같은 평행을 두 번 말한 조건, 엇각으로 돌려 말한 조건. 다섯 조건을 낱말로만 외운 아이는 수를 틀리게 센다.
        const rows = d.until(() => d.shuffle(COUNT_POOL).slice(0, 5), (list) => { const k = list.filter((r) => r[1]).length; return k >= 2 && k <= 3 && list.filter((r) => r[3]).length >= 3 && list.some((r) => r[3] && !r[1]) && list.some((r) => r[3] && r[1]); });
        const k = rows.filter((r) => r[1]).length;
        return N(`다음 ㄱ~ㅁ 가운데 □ABCD가 평행사변형이 되는 것은 모두 몇 개인가? ${O_NOTE}`, k, {
          unit: '개', figure: tagged(rows.map((r) => r[0]), TAGS),
          explain: rows.map((r, i) => `${TAGS[i]}. ${r[2]}${r[1] ? ' 평행사변형이 된다.' : ''}`).join(' ') + ` 평행사변형이 되는 것은 ${k}개이다.`,
          facts: { calc: [[rows.map((r) => (r[1] ? 1 : 0)).join('+'), 0]], unseen: [1, 0] }
        });
      }),
      H('hard-par-same', '평행선 사이에서 넓이가 같은 삼각형 모두 찾기', '심58 / 기본 ①75', (d) => {
        // 함정: 합동인 삼각형만 넓이가 같다고 여기는 아이는 하나도 못 찾는다. 평행한 쌍(AD ∥ BC, BD ∥ EF, AB ∥ DC)마다 밑변이 같은 삼각형을 짝 지어야 한다.
        const t = d.pick([0.45, 0.5, 0.55]), P = para(1.7, 1, d.int(62, 70)); P.E = lerp(P.C, P.B, t); P.F = lerp(P.C, P.D, t); delete P.O;
        const g = fit(P, [205, 116]), b = shape(g, 'ABCD');
        segs(b, g, 'BD EF AE AF DE BF', 'thin'); nameOn(b, g, 'E', 'BC'); nameOn(b, g, 'F', 'DC'); arrows(b, g, 'BD EF', 0.5);
        const rows = d.shuffle([['△DBE', true], ['△DBF', true], ['△DAF', true], ['△BEF', false], ['△DEF', false]]), flags = rows.map((r) => r[1]);
        return allQ(d, `평행사변형 ABCD의 변 BC, CD 위의 두 점 E, F에 대하여 ${par('BD', 'EF')}이다. 다음 ㄱ~ㅁ 가운데 △ABE와 넓이가 같은 삼각형을 모두 고른 것은?`, TAGS, flags, {
          figure: b.svg(`${SAY_PG} 변 BC 위에 점 E, 변 CD 위에 점 F가 있다. 대각선 BD와 선분 EF에 평행 표시가 있고, 선분 AE, AF, DE, BF가 그어져 있다`) + tagged(rows.map((r) => r[0]), TAGS),
          // 틀린 보기: 한 번만 옮긴 아이(△DBE만) / 두 번까지 옮긴 아이(△DBE, △DBF)
          must: [rows.map((r) => r[0] === '△DBE'), rows.map((r) => r[0] === '△DBE' || r[0] === '△DBF')],
          explain: `${par('AD', 'BC')}이므로 △ABE와 △DBE는 밑변 BE가 공통이고 높이가 같아 넓이가 같다. ${par('BD', 'EF')}이므로 △DBE와 △DBF는 밑변 BD가 공통이고 높이가 같아 넓이가 같다. ${par('AB', 'DC')}이므로 △DBF와 △DAF는 밑변 DF가 공통이고 높이가 같아 넓이가 같다. △BEF와 △DEF는 서로 넓이가 같지만, △DBE보다 높이가 낮아 넓이가 작다.`
        });
      }),
      H('hard-rhom-square', '마름모의 대각선 위에 세운 마름모의 넓이', '심44', (d) => {
        // 함정: □EOCF를 마름모로만 보면 넓이를 구할 수 없다. 마름모 ABCD의 두 대각선이 수직이므로 ∠EOC = 90°이고, 한 내각이 직각인 마름모는 정사각형이다.
        const v = d.until(() => ({ p: d.int(5, 9), q: d.int(3, 7) }), (w) => w.p - w.q >= 2 && w.p - w.q <= 4 && w.q >= 0.5 * w.p && (w.p * w.q) % 2 === 0), P = rhom(v.p, v.q); P.E = [v.p, 0]; P.F = [v.p, -v.p];
        const g = fit(P, [200, 180]), b = shape(g, 'ABCD', { diag: true, fill: ['EDCF'], oIn: 'AB', skip: 'D' });
        segs(b, g, 'DE EF FC'); b.name(g.D, 'D', 62).name(g.E, 'E', 30).name(g.F, 'F', 315);
        return areaQ(`마름모 ABCD의 두 대각선의 교점을 O라 하자. 선분 OD의 연장선 위의 점 E와 점 F에 대하여 □EOCF도 마름모이다. ${sg('AC')} = ${cm(2 * v.p)}, ${sg('BD')} = ${cm(2 * v.q)}일 때, □EDCF의 넓이는 몇 cm²인가?`, v.p * v.p - v.p * v.q / 2, {
          figure: b.svg(`${SAY_RH}${SAY_O} 선분 OD를 점 D 너머로 늘인 선 위에 점 E가 있고, 사각형 EOCF의 꼭짓점 F는 점 C의 오른쪽에 있다. 사각형 EDCF가 색칠되어 있다`),
          explain: `마름모 ABCD의 두 대각선은 서로 다른 것을 수직이등분하므로 ∠EOC = 90°, ${sg('OC')} = ${cm(v.p)}, ${sg('OD')} = ${cm(v.q)}이다. □EOCF는 한 내각이 직각인 마름모이므로 한 변의 길이가 ${cm(v.p)}인 정사각형이고, 넓이는 ${v.p} × ${v.p} = ${v.p * v.p} (cm²)이다. △OCD의 넓이는 ${HALF} × ${v.q} × ${v.p} = ${v.p * v.q / 2} (cm²)이므로 □EDCF의 넓이는 ${v.p * v.p} − ${v.p * v.q / 2} = ${v.p * v.p - v.p * v.q / 2} (cm²)이다.`,
          facts: { calc: [[`(${2 * v.p}/2)*(${2 * v.p}/2)-(${2 * v.q}/2)*(${2 * v.p}/2)/2`, 0]], unseen: [2] }
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-bis-perp', '한 내각의 이등분선과 그에 수직인 직선', '심7 심9 / 기본 ①13 ②10 ②12', (d, n) => {
        if (n === 0) {
          const v = d.until(() => ({ s: d.int(6, 11), w: d.int(9, 18) }), (x) => 2 * x.s - x.w >= 2 && x.w - x.s >= 3);
          const P = para(v.w, v.s, d.int(62, 72)); P.E = [v.w - v.s, 0]; P.F = [v.s, 0]; P.G = meet(P.A, P.F, P.D, P.E); delete P.O;
          const g = fit(P, [195, 104]), b = shape(g, 'ABCD');
          segs(b, g, 'DE AF'); nameOn(b, g, 'E', 'BC'); nameOn(b, g, 'F', 'BC'); nameAt(b, g, 'G', 'DF'); ang(b, g, 'AGD', ''); halves(b, g, 'ADC', 'E', 'dot', 26); len(b, g, 'AB', cm(v.s)); len(b, g, 'AD', cm(v.w));
          return lenQ(`평행사변형 ABCD에서 ∠D의 이등분선이 변 BC와 만나는 점을 E라 하고, 꼭짓점 A를 지나고 선분 DE에 수직인 직선이 변 BC와 만나는 점을 F라 하자. ${sg('AB')} = ${cm(v.s)}, ${sg('AD')} = ${cm(v.w)}일 때, ${sg('EF')}의 길이는 몇 cm인가?`, 2 * v.s - v.w, {
            figure: b.svg(`${SAY_PG} 변 BC 위에 점 B에서 가까운 쪽부터 점 E, 점 F가 있고 선분 DE, 선분 AF가 그어져 있다. ∠ADE와 ∠CDE에 같은 표시가 있고, 선분 AF와 선분 DE가 만나는 점 G에 직각 표시가 있다. 변 AB의 길이는 ${cm(v.s)}, 변 AD의 길이는 ${cm(v.w)}`),
            explain: `${par('AD', 'BC')}이므로 ∠ADE = ∠CED(엇각)이고, △CDE는 ${sg('CE')} = ${sg('CD')} = ${cm(v.s)}인 이등변삼각형이다. ∠BAD + ∠ADC = 180°이고 △AGD에서 ∠DAG = 90° − ${HALF}∠ADC = ${HALF}∠BAD이므로 선분 AF는 ∠A의 이등분선이다. 같은 방법으로 △ABF는 ${sg('BF')} = ${sg('AB')} = ${cm(v.s)}인 이등변삼각형이다. ${sg('EF')} = ${sg('BF')} + ${sg('CE')} − ${sg('BC')} = ${v.s} + ${v.s} − ${v.w} = ${2 * v.s - v.w} (cm)이다.`,
            facts: { calc: [[`${v.s}+${v.s}-${v.w}`, 0]] }
          });
        }
        const be = 2 * d.int(26, 38), P = para(1.6, 1, be); P.E = [0.6, 0]; P.F = foot(P.A, P.D, P.E); delete P.O;
        const g = fit(P, [195, 104]), b = shape(g, 'ABCD');
        segs(b, g, 'DE AF'); nameOn(b, g, 'E', 'BC'); nameAt(b, g, 'F', 'AE'); ang(b, g, 'AFD', ''); halves(b, g, 'ADC', 'E', 'dot', 28); ang(b, g, 'ABC', deg(be));
        return degQ(`평행사변형 ABCD에서 ∠D의 이등분선이 변 BC와 만나는 점을 E, 꼭짓점 A에서 선분 DE에 내린 수선의 발을 F라 하자. ∠B = ${be}°일 때, ∠BAF의 크기는?`, 90 - be / 2, {
          figure: b.svg(`${SAY_PG} 변 BC 위에 점 E가 있고 선분 DE가 그어져 있다. ∠ADE와 ∠CDE에 같은 표시가 있다. 점 A에서 선분 DE에 내린 수선의 발 F에 직각 표시가 있다. ∠B = ${be}°`),
          explain: `대각의 크기는 같으므로 ∠ADC = ∠B = ${be}°이고 ∠ADF = ${be / 2}°이다. △AFD에서 ∠DAF = 90° − ${be / 2}° = ${90 - be / 2}°이다. 이웃한 두 내각의 크기의 합은 180°이므로 ∠BAD = 180° − ${be}° = ${180 - be}°이고, ∠BAF = ${180 - be}° − ${90 - be / 2}° = ${90 - be / 2}°이다.`,
          facts: { calc: [[`180-${be}-(90-${be}/2)`, 0]], unseen: [180, 90, 2] }
        });
      }, { count: 2 }),
      H('hard-inner-tri', '정사각형·마름모에 붙은 정삼각형·이등변삼각형과 각', '심31 심32 / 기본 ①47', (d, n) => {
        if (n === 0) {
          const P = rect(1, 1); P.E = [0.5, Math.sqrt(3) / 2]; delete P.O;
          const g = fit(P, [140, 140]), b = shape(g, 'ABCD');
          b.seg(g.B, g.D, 'thin'); segs(b, g, 'EB EC ED'); b.name(g.E, 'E', 90); ticks(b, g, 'EB EC BC', 1);
          return degQ('정사각형 ABCD의 내부에 △EBC가 정삼각형이 되도록 점 E를 잡았다. ∠EDB의 크기는?', 30, {
            figure: b.svg(`${SAY_SQ} 내부의 점 E와 선분 EB, EC, ED가 그어져 있고 대각선 BD가 그어져 있다. 선분 EB, 선분 EC, 변 BC에 같은 길이 표시가 있다`),
            explain: `${sg('CE')} = ${sg('CB')} = ${sg('CD')}이므로 △CDE는 이등변삼각형이다. ∠ECD = 90° − 60° = 30°이므로 ∠CDE = (180° − 30°) ÷ 2 = 75°이다. 정사각형의 대각선은 내각을 이등분하므로 ∠CDB = 45°이고, ∠EDB = 75° − 45° = 30°이다.`,
            facts: { calc: [['(180-(90-60))/2-45', 0]], unseen: [180, 90, 60, 2, 45] }
          });
        }
        if (n === 1) {
          const ph = d.int(26, 38), t = 90 - 2 * ph, P = rect(1, 1); P.E = pol(P.A, 1, t); delete P.O;
          const g = fit(P, [150, 190]), b = shape(g, 'ABCD');
          segs(b, g, 'AE BE'); b.name(g.E, 'E', 60); ticks(b, g, 'AD AE', 1); ang(b, g, 'ABE', deg(ph));
          return degQ(`정사각형 ABCD의 바깥쪽에 ${eq('AD', 'AE')}가 되도록 점 E를 그림과 같이 잡았더니 ∠ABE = ${ph}°이었다. ∠EAD의 크기는?`, t, {
            figure: b.svg(`${SAY_SQ} 변 AD의 위쪽에 점 E가 있고 선분 AE, 선분 BE가 그어져 있다. 선분 BE는 변 AD를 가로지른다. 변 AD와 선분 AE에 같은 길이 표시가 있다. ∠ABE = ${ph}°`),
            explain: `${sg('AB')} = ${sg('AD')} = ${sg('AE')}이므로 △ABE는 이등변삼각형이고 ∠AEB = ∠ABE = ${ph}°이다. ∠BAE = 180° − 2 × ${ph}° = ${180 - 2 * ph}°이고 ∠BAD = 90°이므로 ∠EAD = ${180 - 2 * ph}° − 90° = ${t}°이다.`,
            facts: { calc: [[`180-2*${ph}-90`, 0]], unseen: [180, 2, 90] }
          });
        }
        const be = 2 * d.int(34, 42), P = para(1, 1, be); P.P = pol(P.B, 1, be - 60); delete P.O;
        const g = fit(P, [195, 130]), b = shape(g, 'ABCD');
        segs(b, g, 'PA PB PC'); nameAt(b, g, 'P', 'AB'); ticks(b, g, 'AB AP BP', 1);
        return degQ(`마름모 ABCD의 내부에 △ABP가 정삼각형이 되도록 점 P를 잡았다. ∠ABC = ${be}°일 때, ∠PCD의 크기는?`, 60 - be / 2, {
          figure: b.svg(`마름모 ABCD. ${at4} 내부의 점 P와 선분 PA, PB, PC가 그어져 있다. 변 AB, 선분 AP, 선분 BP에 같은 길이 표시가 있다`),
          explain: `${sg('BP')} = ${sg('BA')} = ${sg('BC')}이므로 △BCP는 이등변삼각형이다. ∠PBC = ${be}° − 60° = ${be - 60}°이므로 ∠BCP = (180° − ${be - 60}°) ÷ 2 = ${(240 - be) / 2}°이다. ∠BCD = 180° − ${be}° = ${180 - be}°이므로 ∠PCD = ${180 - be}° − ${(240 - be) / 2}° = ${60 - be / 2}°이다.`,
          facts: { calc: [[`180-${be}-(180-(${be}-60))/2`, 0]], unseen: [180, 60, 2] }
        });
      }, { count: 3 }),
      H('hard-find-rhombus', '마름모임을 알아낸 다음 길이·넓이 구하기', '심29 / 기본 ①63 ②45', (d, n) => {
        const pg = `평행사변형 ABCD. ${at4}`;
        if (n === 0) {
          const a = d.int(54, 66), s = d.int(4, 12), g = fit(para(1, 1, 180 - 2 * a), [190, 116]), b = shape(g, 'ABCD', { diag: true });
          ang(b, g, 'BAC', deg(a)); ang(b, g, 'BDC', deg(90 - a)); len(b, g, 'DC', cm(s));
          return lenQ(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. ∠BAC = ${a}°, ∠BDC = ${90 - a}°, ${sg('DC')} = ${cm(s)}일 때, 평행사변형 ABCD의 둘레의 길이는 몇 cm인가?`, 4 * s, {
            figure: b.svg(`${pg}${SAY_O} ∠BAC = ${a}°, ∠BDC = ${90 - a}°, 변 DC의 길이는 ${cm(s)}`),
            explain: `${par('AB', 'DC')}이므로 ∠ABD = ∠BDC = ${90 - a}°(엇각)이다. △ABO에서 ∠AOB = 180° − (${a}° + ${90 - a}°) = 90°이므로 두 대각선이 서로 수직이다. 두 대각선이 서로 수직인 평행사변형은 마름모이고, 마름모의 네 변의 길이는 모두 같으므로 둘레의 길이는 4 × ${s} = ${4 * s} (cm)이다.`,
            facts: { calc: [[`4*${s}`, 0]], unseen: [4] }
          });
        }
        if (n === 1) {
          const v = d.until(() => ({ p: d.int(4, 10), q: d.int(4, 10) }), (w) => w.p !== w.q && w.p / w.q >= 0.6 && w.p / w.q <= 1.6), P = paraDiag(v.p, v.q, 90); P.P = lerp(P.O, P.A, 0.5);
          const g = fit(P, [195, 124]), b = shape(g, 'ABCD', { diag: true, oIn: 'AD' });
          segs(b, g, 'BP DP'); nameIn(b, g, 'P', 'ABCD'); ticks(b, g, 'BP DP', 1);   // 두 대각선의 반의 길이는 글에만 적는다(선분 BP, DP 가 지나 그림에 적을 자리가 없다).
          return areaQ(`평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. 대각선 AC 위의 점 P에 대하여 ${eq('BP', 'DP')}이고 ${sg('OC')} = ${cm(v.p)}, ${sg('OB')} = ${cm(v.q)}일 때, 평행사변형 ABCD의 넓이는 몇 cm²인가?`, 2 * v.p * v.q, {
            figure: b.svg(`${pg}${SAY_O} 대각선 AC 위에 점 P가 있고 선분 BP, 선분 DP에 같은 길이 표시가 있다`),
            explain: `△BOP와 △DOP에서 ${eq('BP', 'DP')}, ${eq('OB', 'OD')}, ${sg('OP')}는 공통이므로 △BOP ≡ △DOP (SSS 합동)이고 ∠BOP = ∠DOP = 90°이다. 두 대각선이 서로 수직인 평행사변형은 마름모이고, 두 대각선으로 나누어진 네 직각삼각형은 모두 합동이다. 넓이는 4 × ${HALF} × ${v.p} × ${v.q} = ${2 * v.p * v.q} (cm²)이다.`,
            facts: { calc: [[`4*${v.p}*${v.q}/2`, 0]], unseen: [4, 2] }
          });
        }
        const s = d.int(4, 12), g = fit(para(1, 1, d.int(56, 70)), [190, 116]), b = shape(g, 'ABCD');
        b.seg(g.A, g.C, 'thin'); same(b, g, 'BAC', 'dot', 24); same(b, g, 'CAD', 'dot', 26); len(b, g, 'AB', cm(s));
        return lenQ(`평행사변형 ABCD에서 ∠BAC = ∠DAC이고 ${sg('AB')} = ${cm(s)}일 때, 평행사변형 ABCD의 둘레의 길이는 몇 cm인가?`, 4 * s, {
          figure: b.svg(`${pg} 대각선 AC가 그어져 있고 ∠BAC와 ∠DAC에 같은 표시가 있다. 변 AB의 길이는 ${cm(s)}`),
          explain: `${par('AD', 'BC')}이므로 ∠DAC = ∠BCA(엇각)이다. ∠BAC = ∠DAC이므로 ∠BAC = ∠BCA이고, △ABC는 ${eq('BA', 'BC')}인 이등변삼각형이다. 이웃하는 두 변의 길이가 같은 평행사변형은 마름모이므로 둘레의 길이는 4 × ${s} = ${4 * s} (cm)이다.`,
          facts: { calc: [[`4*${s}`, 0]], unseen: [4] }
        });
      }, { count: 3 }),
      H('hard-ratio-chain', '중점과 선분의 비로 넓이를 세 번 나누기', '심63 / 기본 ②37 ①35', (d) => {
        const k = d.int(3, 10), S = 12 * k, P = para(1.6, 1, d.int(62, 70)); P.P = lerp(P.C, P.D, 0.5); P.Q = meet(P.A, P.P, P.B, P.D); delete P.O;
        const g = fit(P, [195, 110]), b = shape(g, 'ABCD', { fill: ['AQD'] });
        b.seg(g.B, g.D, 'thin').seg(g.A, g.P); nameOn(b, g, 'P', 'DC'); nameAt(b, g, 'Q', 'BP'); ticks(b, g, 'DP PC', 1);
        return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD에서 변 CD의 중점을 P, 선분 AP와 대각선 BD의 교점을 Q라 하자. ${nb(`${sg('AQ')} : ${sg('QP')} = 2 : 1`)}일 때, △AQD의 넓이는 몇 cm²인가?`, 2 * k, {
          figure: b.svg(`${SAY_PG} 변 CD의 중점 P와 선분 AP, 대각선 BD가 그어져 있다. 선분 DP와 선분 PC에 같은 길이 표시가 있다. 선분 AP와 대각선 BD가 점 Q에서 만나고 삼각형 AQD가 색칠되어 있다`),
          explain: `△ACD의 넓이는 평행사변형의 넓이의 반이므로 ${S / 2} cm²이다. △APD와 △APC는 밑변의 길이가 같고(${eq('DP', 'PC')}) 높이가 같으므로 △APD = ${S / 2} ÷ 2 = ${S / 4} (cm²)이다. △AQD와 △DQP는 높이가 같으므로 넓이의 비는 ${nb(`${sg('AQ')} : ${sg('QP')} = 2 : 1`)}이다. △AQD = ${S / 4} × ${frac(2, 3)} = ${2 * k} (cm²)이다.`,
          facts: { calc: [[`${S}/2/2*2/(2+1)`, 0]] }
        });
      }),
      H('hard-perp-pgram', '대각선에 내린 두 수선이 만드는 평행사변형의 각', '심20 / 기본 ①28', (d) => {
        const ep = d.int(36, 54), P = paraDiag(1, 1.1, Math.atan(2 * Math.tan(ep * RAD)) / RAD); P.E = foot(P.B, P.A, P.C); P.F = foot(P.D, P.A, P.C); delete P.O;
        const g = fit(P, [205, 124]), b = shape(g, 'ABCD');
        b.seg(g.A, g.C); segs(b, g, 'BE DF'); segs(b, g, 'DE BF', 'thin'); nameAt(b, g, 'E', 'BC'); nameAt(b, g, 'F', 'AD'); ang(b, g, 'BEA', ''); ang(b, g, 'DFC', ''); ang(b, g, 'DEF', deg(ep));
        return degQ(`평행사변형 ABCD의 두 꼭짓점 B, D에서 대각선 AC에 내린 수선의 발을 각각 E, F라 하자. ∠DEF = ${ep}°일 때, ∠EBF의 크기는?`, 90 - ep, {
          figure: b.svg(`${SAY_PG} 대각선 AC가 그어져 있다. 점 B에서 대각선 AC에 내린 수선의 발 E와 점 D에서 대각선 AC에 내린 수선의 발 F에 직각 표시가 있다. 대각선 AC 위에 점 A에서 가까운 쪽부터 점 E, 점 F가 있고 선분 DE, 선분 BF가 그어져 있다. ∠DEF = ${ep}°`),
          explain: `△ABE와 △CDF에서 ${eq('AB', 'CD')}, ∠AEB = ∠CFD = 90°, ∠BAE = ∠DCF(엇각)이므로 △ABE ≡ △CDF이고 ${eq('BE', 'DF')}이다. 선분 BE와 선분 DF는 모두 대각선 AC에 수직이므로 ${par('BE', 'DF')}이다. 한 쌍의 대변이 평행하고 그 길이가 같으므로 □EBFD는 평행사변형이고, ${par('ED', 'BF')}이므로 ∠BFE = ∠DEF = ${ep}°(엇각)이다. △BEF에서 ∠EBF = 90° − ${ep}° = ${90 - ep}°이다.`,
          facts: { calc: [[`90-${ep}`, 0]], unseen: [90] }
        });
      }),
      H('hard-rhom-feet', '마름모의 한 꼭짓점에서 두 변에 내린 수선', '심30 / 기본 ②48 ①41', (d) => {
        const be = 2 * d.int(30, 36), P = rhom(Math.sin(be / 2 * RAD), Math.cos(be / 2 * RAD)); P.P = foot(P.A, P.B, P.C); P.Q = foot(P.A, P.C, P.D); delete P.O;
        const g = fit(P, [215, 134]), b = shape(g, 'ABCD');
        segs(b, g, 'AP AQ PQ'); nameOn(b, g, 'P', 'BC'); nameOn(b, g, 'Q', 'CD'); ang(b, g, 'APC', ''); ang(b, g, 'AQC', ''); ang(b, g, 'ABC', deg(be));
        return degQ(`마름모 ABCD의 꼭짓점 A에서 두 변 BC, CD에 내린 수선의 발을 각각 P, Q라 하자. ∠B = ${be}°일 때, ∠APQ의 크기는?`, 90 - be / 2, {
          figure: b.svg(`${SAY_RH} 점 A에서 변 BC에 내린 수선의 발 P와 변 CD에 내린 수선의 발 Q에 직각 표시가 있고, 선분 AP, AQ, PQ가 그어져 있다. ∠B = ${be}°`),
          explain: `△ABP와 △ADQ에서 ${eq('AB', 'AD')}, ∠APB = ∠AQD = 90°, ∠B = ∠D이므로 △ABP ≡ △ADQ이고 ${eq('AP', 'AQ')}, ∠BAP = ∠DAQ = 90° − ${be}° = ${90 - be}°이다. ∠BAD = 180° − ${be}° = ${180 - be}°이므로 ∠PAQ = ${180 - be}° − 2 × ${90 - be}° = ${be}°이다. △APQ는 이등변삼각형이므로 ∠APQ = (180° − ${be}°) ÷ 2 = ${90 - be / 2}°이다.`,
          facts: { calc: [[`(180-${be})/2`, 0]], unseen: [180, 2] }
        });
      }),
      H('hard-bis-area', '마주 보는 두 내각의 이등분선 사이에 생긴 사각형의 넓이', '심50 / 기본 ②14', (d) => {
        const draw = (v) => {
          const P = para(v.w, v.s, Math.asin(v.h / v.s) / RAD); P.E = [P.A[0] + v.s, P.A[1]]; P.F = [v.w - v.s, 0]; delete P.O;
          const g = fit(P, [195, 108]), b = shape(g, 'ABCD', { fill: ['EBFD'] });
          segs(b, g, 'BE DF'); nameOn(b, g, 'E', 'AD'); nameOn(b, g, 'F', 'BC'); halves(b, g, 'ABC', 'E', 'dot', 26); halves(b, g, 'ADC', 'F', 'x', 26); len(b, g, 'AB', cm(v.s)); len(b, g, 'BC', cm(v.w), null, { t: 0.72 });
          return b;
        };
        const v = d.until(() => ({ s: d.int(6, 10), w: d.int(9, 16), h: d.int(4, 9) }), (x) => x.w - x.s >= 3 && x.w - x.s <= 6 && x.h / x.s >= 0.83 && x.h / x.s <= 0.95 && !draw(x).clash()), S = v.w * v.h;
        return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD에서 ∠B, ∠D의 이등분선이 변 AD, BC와 만나는 점을 각각 E, F라 하자. ${sg('AB')} = ${cm(v.s)}, ${sg('BC')} = ${cm(v.w)}일 때, □EBFD의 넓이는 몇 cm²인가?`, (v.w - v.s) * v.h, {
          figure: draw(v).svg(`${SAY_PG} 변 AD 위에 점 E, 변 BC 위에 점 F가 있고 선분 BE, 선분 DF가 그어져 있다. ∠ABE와 ∠CBE에 같은 표시(점)가, ∠ADF와 ∠CDF에 같은 표시(가위표)가 있다. 사각형 EBFD가 색칠되어 있다. 변 AB의 길이는 ${cm(v.s)}, 변 BC의 길이는 ${cm(v.w)}`),
          explain: `${par('AD', 'BC')}이므로 ∠AEB = ∠CBE(엇각)이고, △ABE는 ${sg('AE')} = ${sg('AB')} = ${cm(v.s)}인 이등변삼각형이다. ${sg('ED')} = ${v.w} − ${v.s} = ${v.w - v.s} (cm)이고, 같은 방법으로 ${sg('BF')} = ${cm(v.w - v.s)}이다. ${par('ED', 'BF')}, ${eq('ED', 'BF')}이므로 □EBFD는 평행사변형이다. 변 BC를 밑변으로 할 때 평행사변형 ABCD의 높이는 ${S} ÷ ${v.w} = ${v.h} (cm)이므로 □EBFD의 넓이는 ${v.w - v.s} × ${v.h} = ${(v.w - v.s) * v.h} (cm²)이다.`,
          facts: { calc: [[`(${v.w}-${v.s})*${S}/${v.w}`, 0]] }
        });
      }),
      H('hard-rect-mid', '직사각형에서 두 변의 중점과 대각선이 만드는 사각형의 넓이', '심51 / 기본 ①34', (d) => {
        const v = d.until(() => ({ h: 2 * d.int(3, 6), w: 2 * d.int(4, 10) }), (x) => x.w - x.h >= 2 && x.w <= 1.9 * x.h), P = rect(v.w, v.h);
        P.M = [v.w / 2, v.h]; P.N = [v.w / 2, 0]; P.E = meet(P.B, P.D, P.A, P.N); P.F = meet(P.B, P.D, P.M, P.C); delete P.O;
        const g = fit(P, [205, 130]), b = shape(g, 'ABCD', { fill: ['AEFM'] });
        segs(b, g, 'AN MC BD', 'thin'); nameOn(b, g, 'M', 'AD'); nameOn(b, g, 'N', 'BC'); nameAt(b, g, 'E', 'BN'); nameAt(b, g, 'F', 'CD'); ticks(b, g, 'AM MD BN NC', 1); len(b, g, 'AB', cm(v.h));
        return areaQ(`${sg('AB')} = ${cm(v.h)}, ${sg('AD')} = ${cm(v.w)}인 직사각형 ABCD에서 두 변 AD, BC의 중점을 각각 M, N이라 하고, 대각선 BD가 선분 AN, MC와 만나는 점을 각각 E, F라 하자. □AEFM의 넓이는 몇 cm²인가?`, v.w * v.h / 4, {
          figure: b.svg(`${SAY_RECT} 변 AD의 중점 M, 변 BC의 중점 N이 있고 선분 AN, 선분 MC, 대각선 BD가 그어져 있다. 대각선 BD가 선분 AN과 점 E에서, 선분 MC와 점 F에서 만나고 사각형 AEFM이 색칠되어 있다. 변 AB의 길이는 ${cm(v.h)}`),
          explain: `${par('AM', 'NC')}, ${eq('AM', 'NC')}이므로 □ANCM은 평행사변형이고, 그 넓이는 직사각형의 넓이의 반인 ${v.w} × ${v.h} ÷ 2 = ${v.w * v.h / 2} (cm²)이다. 대각선 BD는 직사각형의 두 대각선의 교점을 지나고, 이 점은 □ANCM의 두 대각선 AC, MN의 교점이기도 하다. 평행사변형의 두 대각선의 교점을 지나는 직선은 그 넓이를 이등분하므로 □AEFM의 넓이는 ${v.w * v.h / 2} ÷ 2 = ${v.w * v.h / 4} (cm²)이다.`,
          facts: { calc: [[`${v.w}*${v.h}/2/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-rect-rhombus', '직사각형 안에 두 이등분선이 만든 마름모와 각', '기본 ①52 ②47', (d) => {
        const r3 = Math.sqrt(3), t = Math.tan(30 * RAD), P = rect(r3, 1); P.E = [t, 1]; P.F = [r3 - t, 0]; delete P.O;
        const g = fit(P, [205, 124]), b = shape(g, 'ABCD');
        b.seg(g.B, g.D, 'thin'); segs(b, g, 'BE DF'); nameOn(b, g, 'E', 'AD'); nameOn(b, g, 'F', 'BC'); same(b, g, 'ABE', 'dot', 28); same(b, g, 'EBD', 'dot', 34); same(b, g, 'BDF', 'x', 34); same(b, g, 'FDC', 'x', 28);
        return degQ('직사각형 ABCD에서 ∠ABD의 이등분선이 변 AD와 만나는 점을 E, ∠BDC의 이등분선이 변 BC와 만나는 점을 F라 하자. □EBFD가 마름모일 때, ∠DFC의 크기는?', 60, {
          figure: b.svg(`${SAY_RECT} 대각선 BD가 그어져 있다. 변 AD 위에 점 E, 변 BC 위에 점 F가 있고 선분 BE, 선분 DF가 그어져 있다. ∠ABE와 ∠EBD에 같은 표시(점)가, ∠BDF와 ∠FDC에 같은 표시(가위표)가 있다`),
          explain: `∠ABE = ∠EBD = ${A_}라 하자. □EBFD가 마름모이므로 ${eq('EB', 'ED')}이고 ∠EDB = ∠EBD = ${A_}이다. ${par('AD', 'BC')}이므로 ∠DBC = ∠EDB = ${A_}(엇각)이다. ∠ABC = 3${A_} = 90°에서 ${A_} = 30°이다. ${par('EB', 'DF')}이므로 ∠DFC = ∠EBF(동위각) = 2${A_} = 60°이다.`,
          facts: { calc: [['2*90/3', 0]], unseen: [2, 90, 3] }
        });
      }),
      H('hard-rect-bis', '직사각형에서 각의 이등분선과 대각선이 이루는 각', '심23', (d) => {
        const ph = d.pick([114, 117, 120, 123, 126]), a = (180 - ph) / 3, w = Math.cos(2 * a * RAD), P = rect(w, Math.sin(2 * a * RAD)); P.E = [w, w * Math.tan(a * RAD)]; P.F = meet(P.B, P.E, P.A, P.C);
        const g = fit(P, [215, 150]), b = shape(g, 'ABCD', { diag: true, oIn: 'AD' });
        b.seg(g.B, g.E); nameOn(b, g, 'E', 'DC'); nameAt(b, g, 'F', 'BC'); halves(b, g, 'DBC', 'E', 'dot', 38); ang(b, g, 'OFE', deg(ph));
        return degQ(`직사각형 ABCD에서 두 대각선의 교점을 O라 하자. ∠DBC의 이등분선이 변 CD와 만나는 점을 E, 선분 BE와 대각선 AC의 교점을 F라 하자. ∠OFE = ${ph}°일 때, ∠AOB의 크기는?`, 4 * a, {
          figure: b.svg(`${SAY_RECT}${SAY_O} 변 CD 위에 점 E가 있고 선분 BE가 그어져 있다. ∠DBE와 ∠CBE에 같은 표시가 있다. 선분 BE와 대각선 AC가 점 F에서 만난다. ∠OFE = ${ph}°`),
          explain: `∠CBE = ${A_}라 하면 ∠OBC = 2${A_}이고, ${eq('OB', 'OC')}이므로 ∠OCB = 2${A_}이다. ∠BFC = ∠OFE = ${ph}°(맞꼭지각)이므로 △FBC에서 ${A_} + 2${A_} + ${ph}° = 180°, ${A_} = ${a}°이다. ∠AOB는 △OBC의 외각이므로 ∠AOB = 2${A_} + 2${A_} = ${4 * a}°이다.`,
          facts: { calc: [[`4*(180-${ph})/3`, 0]], unseen: [4, 180, 3] }
        });
      }),
      H('hard-mid-tri', '두 변의 중점을 이은 삼각형의 넓이로 평행사변형의 넓이 구하기', '심48', (d) => {
        const k = d.int(3, 12), t = 3 * k, P = para(1.6, 1, d.int(62, 70)); P.E = lerp(P.B, P.C, 0.5); P.F = lerp(P.C, P.D, 0.5); delete P.O;
        const g = fit(P, [195, 110]), b = shape(g, 'ABCD', { fill: ['AEF'] });
        segs(b, g, 'AE EF FA'); nameOn(b, g, 'E', 'BC'); nameOn(b, g, 'F', 'DC'); ticks(b, g, 'BE EC', 1); ticks(b, g, 'CF FD', 2);
        return areaQ(`평행사변형 ABCD에서 두 변 BC, CD의 중점을 각각 E, F라 하자. △AEF의 넓이가 ${t} cm²일 때, 평행사변형 ABCD의 넓이는 몇 cm²인가?`, 8 * k, {
          figure: b.svg(`${SAY_PG} 변 BC의 중점 E와 변 CD의 중점 F가 있고 삼각형 AEF가 색칠되어 있다. 선분 BE와 선분 EC에 같은 표시(한 줄), 선분 CF와 선분 FD에 같은 표시(두 줄)가 있다`),
          explain: `평행사변형 ABCD의 넓이를 ${S_}라 하자. △ABE = ${HALF}△ABC = ${frac(1, 4)}${S_}, △AFD = ${HALF}△ACD = ${frac(1, 4)}${S_}이고, △ECF = ${HALF}△ECD = ${frac(1, 4)}△BCD = ${frac(1, 8)}${S_}이다. △AEF = ${S_} − ${frac(1, 4)}${S_} − ${frac(1, 4)}${S_} − ${frac(1, 8)}${S_} = ${frac(3, 8)}${S_}이므로 ${frac(3, 8)}${S_} = ${t}에서 ${S_} = ${8 * k}이다.`,
          facts: { calc: [[`${t}*8/3`, 0]], unseen: [8, 3] }
        });
      }),
      H('hard-par-ext', '꼭짓점을 지나는 직선과 변의 연장선이 만드는 삼각형의 넓이', '심64', (d) => {
        const [m, n] = d.pick([[1, 2], [2, 3], [1, 1], [3, 4]]), k = d.int(2, 6), S = 2 * (m + n) * k, P = para(1.6, 1, d.int(62, 70)); P.E = lerp(P.B, P.C, m / (m + n)); P.F = meet(P.D, P.E, P.A, P.B); delete P.O;
        const g = fit(P, [195, 170]), b = shape(g, 'ABCD', { fill: ['EFC'] });
        segs(b, g, 'DF BF CF'); nameIn(b, g, 'E', 'BCDF'); b.name(g.F, 'F', 240);
        return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD의 꼭짓점 D를 지나는 직선이 변 BC와 만나는 점을 E, 변 AB의 연장선과 만나는 점을 F라 하자. ${nb(`${sg('BE')} : ${sg('EC')} = ${m} : ${n}`)}일 때, △EFC의 넓이는 몇 cm²인가?`, m * k, {
          figure: b.svg(`${SAY_PG} 점 D를 지나는 직선이 변 BC와 점 E에서, 변 AB를 점 B 너머로 늘인 선과 점 F에서 만난다. 선분 CF가 그어져 있고 삼각형 EFC가 색칠되어 있다`),
          explain: `△DBC의 넓이는 평행사변형의 넓이의 반이므로 ${S / 2} cm²이다. △DEC와 △DBC는 높이가 같으므로 △DEC = ${S / 2} × ${frac(n, `${m} + ${n}`)} = ${n * k} (cm²)이다. ${par('AF', 'DC')}이므로 △DFC와 △DBC는 밑변 DC가 공통이고 높이가 같아 넓이가 같다. △DFC의 넓이는 ${S / 2} cm²이므로 △EFC = △DFC − △DEC = ${S / 2} − ${n * k} = ${m * k} (cm²)이다.`,
          facts: { calc: [[`${S}/2-${S}/2*${n}/(${m}+${n})`, 0]], unseen: [2] }
        });
      }),
      H('hard-made-quad', '새로 만든 사각형이 어떤 사각형인지 알아내기', '심42 / 기본 ①64', (d, n) => {
        if (n === 0) {
          const P = para(1.7, 1, d.int(62, 72)); P.E = [1, 0]; P.F = [P.A[0] + 1, P.A[1]]; delete P.O;
          const g = fit(P, [195, 108]), b = shape(g, 'ABCD', { fill: ['ABEF'] });
          segs(b, g, 'AE BF EF'); nameOn(b, g, 'E', 'BC'); nameOn(b, g, 'F', 'AD'); halves(b, g, 'BAD', 'E', 'dot', 20); halves(b, g, 'ABC', 'F', 'x', 24);
          const why = `${par('AD', 'BC')}이므로 ∠DAE = ∠AEB(엇각)이고 △ABE는 ${eq('BE', 'AB')}인 이등변삼각형이다. 같은 방법으로 ${eq('AF', 'AB')}이다. ${par('AF', 'BE')}, ${eq('AF', 'BE')}이므로 □ABEF는 평행사변형이고, 이웃하는 두 변의 길이가 같으므로 마름모이다.`;
          // 보기: □ABEF 를 평행사변형으로만 본 아이는 「네 변의 길이가 모두 같다」「수직이등분한다」를 틀렸다고 고르고, 직사각형·정사각형으로 본 아이는 틀린 보기를 옳다고 넘긴다.
          const yes = ['네 변의 길이가 모두 같다.', '두 대각선이 서로 다른 것을 수직이등분한다.', '두 쌍의 대각의 크기가 각각 같다.', '두 쌍의 대변이 각각 평행하다.', '이웃하는 두 내각의 크기의 합은 180°이다.'];
          const no = [['두 대각선의 길이가 같다.', '마름모의 두 대각선의 길이가 같다고 할 수 없다.'], ['이웃하는 두 내각의 크기가 같다.', '마름모의 이웃하는 두 내각의 크기가 같다고 할 수 없다.'], ['네 내각의 크기가 모두 같다.', '마름모의 네 내각의 크기가 모두 같다고 할 수 없다.']];
          return sayQ(d, `${sg('AB')}의 길이가 ${sg('AD')}의 길이보다 짧은 평행사변형 ABCD에서 ∠A, ∠B의 이등분선이 변 BC, AD와 만나는 점을 각각 E, F라 하자. 다음 중 □ABEF에 대한 설명으로 옳지 않은 것은?`, yes, no.map((r) => [r[0], `${why} ${r[1]}`]), false,
            b.svg(`${SAY_PG} 변 BC 위에 점 E, 변 AD 위에 점 F가 있고 선분 AE, BF, EF가 그어져 있다. ∠BAE와 ∠DAE에 같은 표시(점)가, ∠ABF와 ∠CBF에 같은 표시(가위표)가 있다. 사각형 ABEF가 색칠되어 있다`));
        }
        const P = rect(2, 1); P.M = [1, 1]; P.N = [1, 0]; P.P = [0.5, 0.5]; P.Q = [1.5, 0.5]; delete P.O;
        const g = fit(P, [215, 108]), b = shape(g, 'ABCD', { fill: ['MPNQ'] });
        segs(b, g, 'AN BM MC ND', 'thin'); nameOn(b, g, 'M', 'AD'); nameOn(b, g, 'N', 'BC'); nameAt(b, g, 'P', 'AB'); nameAt(b, g, 'Q', 'CD'); ticks(b, g, 'AM MD BN NC AB DC', 1);
        // 보기: 평행사변형(한 쌍의 대변만 본 아이), 직사각형(직각만 본 아이), 마름모(네 변의 길이만 본 아이 — 그림이 마름모꼴로 놓여 있어 직각을 놓치기 쉽다)
        const right = '정사각형';
        return pickOne(d, `${sg('AD')} = 2${sg('AB')}인 직사각형 ABCD에서 두 변 AD, BC의 중점을 각각 M, N이라 하자. 선분 AN과 선분 BM의 교점을 P, 선분 MC와 선분 ND의 교점을 Q라 할 때, □MPNQ를 나타내는 가장 알맞은 이름은?`, right, ['평행사변형', '직사각형', '마름모'], {
          figure: b.svg(`${SAY_RECT} 변 AD의 중점 M, 변 BC의 중점 N이 있고 선분 AN, BM, MC, ND가 그어져 있다. 선분 AN과 BM이 점 P에서, 선분 MC와 ND가 점 Q에서 만나고 사각형 MPNQ가 색칠되어 있다. 선분 AM, MD, BN, NC와 변 AB, 변 DC에 같은 길이 표시가 있다`),
          explain: `${sg('AM')} = ${HALF}${sg('AD')} = ${sg('AB')}이고 ∠A = 90°이므로 □ABNM은 정사각형이다. 정사각형의 두 대각선 AN, BM은 길이가 같고 서로 다른 것을 수직이등분하므로 ${eq('PM', 'PN')}, ∠MPN = 90°이다. 같은 방법으로 □MNCD도 정사각형이고 ${eq('QM', 'QN')}, ∠MQN = 90°이다. 두 정사각형은 합동이므로 □MPNQ는 네 변의 길이가 모두 같은 마름모이고, 한 내각이 직각이므로 정사각형이다.`
        });
      }, { count: 2 })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-2-2', 'rel', [
    TB('rel-diag-equal', '여섯 가지 사각형 가운데 두 대각선의 길이가 같은 것', '기본 ②57 ①68 ①69', (d) => {
      // 함정: 「두 대각선의 길이가 같다」를 직사각형의 성질로만 외운 아이는 등변사다리꼴을 빠뜨린다. 대각선의 성질을 뒤섞는 아이는 마름모나 평행사변형을 넣는다.
      const rows = d.shuffle([['사다리꼴', false], ['등변사다리꼴', true], ['평행사변형', false], ['직사각형', true], ['마름모', false], ['정사각형', true]]), flags = rows.map((r) => r[1]);
      return allQ(d, '다음 ㄱ~ㅂ 가운데 두 대각선의 길이가 항상 같은 사각형을 모두 고른 것은?', TAGS, flags, {
        figure: tagged(rows.map((r) => r[0]), TAGS),
        // 틀린 보기: 등변사다리꼴을 빠뜨린 아이 / 서로 다른 것을 이등분하는 사각형과 헷갈려 평행사변형까지 넣은 아이
        must: [rows.map((r) => r[1] && r[0] !== '등변사다리꼴'), rows.map((r) => r[0] === '직사각형' || r[0] === '정사각형' || r[0] === '평행사변형')],
        explain: '직사각형과 정사각형의 두 대각선은 길이가 같다. 등변사다리꼴도 두 대각선의 길이가 같다(서로 다른 것을 이등분하지는 않는다). 평행사변형과 마름모의 두 대각선은 길이가 같다고 할 수 없다.'
      });
    })
  ]);
  B.addTypes('8-2-2', 'area', [
    TB('area-inner-point', '평행사변형의 내부의 한 점과 네 삼각형의 넓이', '심45 / 기본 ①31', (d) => {
      // 함정: 네 삼각형의 넓이가 모두 같다고 여기는 아이, 이웃한 두 삼각형을 묶는 아이. 넓이의 합이 같은 것은 마주 보는 두 삼각형끼리이다.
      const v = d.until(() => { const h = d.int(24, 44), x = d.int(9, 26), y = d.int(8, 28); return { h, x, x2: h - x, y, y2: h - y }; }, (w) => w.x / w.h >= 0.36 && w.x / w.h <= 0.64 && w.y / w.h >= 0.32 && w.y / w.h <= 0.68 && new Set([w.x, w.x2, w.y, w.y2]).size === 4);
      const P = para(1.6, 1, d.int(62, 70)); P.P = [v.x / v.h * P.C[0] + v.y2 / v.h * P.A[0], v.y2 / v.h * P.A[1]]; delete P.O;
      const g = fit(P, [190, 110]), b = shape(g, 'ABCD', { fill: ['PAB', 'PCD'] });
      segs(b, g, 'PA PB PC PD', 'thin'); nameIn(b, g, 'P', 'ABCD');
      return areaQ(`평행사변형 ABCD의 내부에 한 점 P가 있다. △PAB, △PCD, △PDA의 넓이가 각각 ${v.x} cm², ${v.x2} cm², ${v.y} cm²일 때, △PBC의 넓이는 몇 cm²인가?`, v.y2, {
        figure: b.svg(`${SAY_PG} 내부의 점 P와 네 꼭짓점을 이은 선분이 그어져 있고, 삼각형 PAB와 삼각형 PCD가 색칠되어 있다`),
        explain: `점 P를 지나고 변 AB에 평행한 직선과 변 AD에 평행한 직선을 그으면 평행사변형이 넷으로 나누어지고, 그 대각선으로 넓이가 같은 삼각형이 짝 지어진다. 따라서 △PAB + △PCD = △PDA + △PBC이고, 둘 다 평행사변형의 넓이의 반이다. ${v.x} + ${v.x2} = ${v.y} + △PBC에서 △PBC의 넓이는 ${v.y2} cm²이다.`,
        facts: { calc: [[`${v.x}+${v.x2}-${v.y}`, 0]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
