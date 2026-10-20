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
// (2026-10-13) 처음 지을 때 보조선·합동 거듭 쓰기·접기·방정식·넓이 셈을 까닭으로 뺐던 꼴을 다시 보고 덧붙였다. 실력 묶음 끝의 열다섯 유형(hard-fold-pentagon 부터)과
// 파일 끝의 기본 네 유형(use-fold, use-perp-ext, area-inner-lines, rect-fold)이 그것이다. 그대로 뺀 꼴과 까닭은 8-2-2a.js 머리와 싣기_대조표.md 에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 각도는 수에 붙여 적고(108°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, frac, tagged, josa } = B.kit;
  const { V, nb } = B.kit.mid;
  const { RAD, dirOf, meet, sv, TINT, Board } = B.kit.mgeo;
  const { UNIT, STD, sg, X, Y, HALF, eq, par, cm, O_NOTE, TAGS, SAY_PG, SAY_O, degQ, lenQ, areaQ, pickOne, allQ, sayQ, pol, add, lerp, foot, para, paraDiag, rect, rhom, trap, fit, centre, shape, segs, nameOn, nameIn, nameAt, same, ang, len, lenHalf, ticks, arrows, deg, halves } = B.kit.m822;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②57' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const at4 = '점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다.';
  const SAY_RECT = '직사각형 ABCD. ' + at4, SAY_SQ = '정사각형 ABCD. ' + at4, SAY_RH = '마름모 ABCD. 점 A는 위, 점 B는 왼쪽, 점 C는 아래, 점 D는 오른쪽에 있다.';
  const A_ = V('a'), S_ = V('S');
  // 덧붙인 문항(뺀 꼴을 다시 보고 실은 것)이 쓰는 것. 좌표는 수학 좌표(오른쪽이 x, 위쪽이 y)이다.
  // 점 p 를 직선 aq 에 대하여 뒤집은 점(접은 자리) / 점 p 를 점 c 둘레로 a° 돌린 점(시계 반대쪽)
  const reflect = (p, a, q) => { const f = foot(p, a, q); return [2 * f[0] - p[0], 2 * f[1] - p[1]]; };
  const turn = (p, c, a) => { const x = p[0] - c[0], y = p[1] - c[1], k = Math.cos(a * RAD), s = Math.sin(a * RAD); return [c[0] + x * k - y * s, c[1] + x * s + y * k]; };
  // 변의 일부를 점선으로 그리는 그림(접은 종이)의 판. keys: 가운데를 잡는 데 쓸 점 이름들
  const boardOf = (g, keys) => { const b = Board(); b.c = centre(keys.split('').map((k) => g[k])); return b; };
  // 점마다 선이 가장 성긴 쪽에 이름을 적는다: [['A', 'BCD'], …] (점 이름, 그 점에서 선이 뻗는 쪽의 점들). label 을 주면 그 글로 적는다(A′).
  const namesIn = (b, g, list) => { for (const [k, to, label] of list) b.nameFree(g[k], label || k, to.split('').map((t) => dirOf(g[k], g[t]))); return b; };
  const H_ = V('h');

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
    id: 'hard', title: '단원 종합', standard: STD,
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
      }, { count: 2 }),
      // ── 처음 지을 때 뺀 꼴을 다시 보고 덧붙인 것(2026-10-13) ──
      // 보조선을 긋거나 합동·판별·넓이 옮기기를 거듭 이어야 한다는 까닭, 접기·방정식·넓이 셈이 낀다는 까닭으로 뺐던 꼴이다. 모두 ② 세 단계 넘게 이어 생각해야 풀리는 문제다.
      H('hard-fold-pentagon', '평행사변형 모양의 종이를 접어 만든 정오각형과 각', '기본 ②17', () => {
        // 정오각형 CDEFG(한 변 1)를 먼저 짓는다. 접기 전의 점 A 는 점 C 를, 점 B 는 점 G 를 접는 선 EF 에 대하여 뒤집은 자리다.
        const c72 = Math.cos(72 * RAD), s72 = Math.sin(72 * RAD), P = { E: [0, 0], D: [1, 0], C: [1 + c72, -s72], G: [0.5, -s72 - Math.sin(36 * RAD)], F: [-c72, -s72] };
        P.A = reflect(P.C, P.E, P.F); P.B = reflect(P.G, P.E, P.F);
        const g = fit(P, [250, 140]), b = boardOf(g, 'ABCD');
        b.poly([g.C, g.D, g.E, g.F, g.G], TINT); b.seg(g.A, g.E, 'cut').seg(g.A, g.B, 'cut').seg(g.B, g.F, 'cut'); segs(b, g, 'EC FC', 'thin'); b.seg(g.A, g.C);
        namesIn(b, g, [['A', 'EBC'], ['B', 'AF'], ['C', 'DGEAF'], ['D', 'EC'], ['E', 'ADFC'], ['F', 'BECG'], ['G', 'FC']]);
        return degQ('평행사변형 ABCD 모양의 종이를 변 AD 위의 점 E와 변 BC 위의 점 F를 이은 선분 EF를 접는 선으로 하여 꼭짓점 A가 꼭짓점 C에 오도록 접었더니 정오각형 CDEFG가 만들어졌다. ∠BAC의 크기는?', 54, {
          figure: b.svg('평행사변형 ABCD 모양의 종이를 접은 그림. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있고, 변 AD 위에 점 E, 변 BC 위에 점 F가 있다. 접기 전의 변 AB와 선분 AE, 선분 BF는 점선으로 그려져 있다. 접어서 생긴 정오각형 CDEFG가 색칠되어 있고 점 G는 변 BC의 아래쪽에 있다. 선분 AC, EC, FC가 그어져 있다'),
          explain: `정오각형의 한 내각의 크기는 108°이므로 ∠D = 108°이고, 평행사변형에서 이웃한 두 내각의 크기의 합은 180°이므로 ∠BAD = 180° − 108° = 72°이다. △DEC는 ${eq('DE', 'DC')}인 이등변삼각형이므로 ∠DEC = (180° − 108°) ÷ 2 = 36°이다. 접어서 겹친 변이므로 ${eq('EA', 'EC')}이고, ∠DEC는 △AEC의 외각이므로 ∠EAC = 36° ÷ 2 = 18°이다. 따라서 ∠BAC = 72° − 18° = 54°이다.`,
          facts: { calc: [['(180-108)-(180-108)/2/2', 0]], unseen: [180, 108, 2] }
        });
      }),
      H('hard-mid-foot', '한 변의 중점을 지나는 선분에 내린 수선과 각', '심12', (d) => {
        // 변 AD 의 연장선과 선분 BE 의 연장선이 만나는 점을 G 라 하면 점 D 는 직각삼각형 AFG 의 빗변의 중점이다. 그 꼴이 되게 점 F 에서 거꾸로 짓는다.
        const a = d.int(58, 68), t = (2 + d.pick([0.25, 0.3, 0.35])) / (4 * Math.sin(a * RAD) ** 2), G = [2, 0];
        const P = { A: [0, 0], D: [1, 0], F: [1 + Math.cos(2 * a * RAD), -Math.sin(2 * a * RAD)] }; P.B = lerp(G, P.F, 2 * t); P.C = add(P.B, [1, 0]); P.E = lerp(P.C, P.D, 0.5);
        const g = fit(P, [175, 180]), b = shape(g, 'ABCD');
        segs(b, g, 'BE AF DF'); nameOn(b, g, 'E', 'CD'); nameIn(b, g, 'F', 'ABED'); ang(b, g, 'AFB', ''); ticks(b, g, 'CE ED', 1); ang(b, g, 'DAF', deg(a));
        return degQ(`평행사변형 ABCD에서 변 CD의 중점을 E라 하고, 꼭짓점 A에서 선분 BE에 내린 수선의 발을 F라 하자. ∠DAF = ${a}°일 때, ∠DFE의 크기는?`, 90 - a, {
          figure: b.svg(`${SAY_PG} 변 CD의 중점 E와 선분 BE가 그어져 있고, 선분 CE와 선분 ED에 같은 길이 표시가 있다. 점 A에서 선분 BE에 내린 수선의 발 F에 직각 표시가 있고, 선분 DF가 그어져 있다. ∠DAF = ${a}°`),
          explain: `변 AD의 연장선과 선분 BE의 연장선이 만나는 점을 G라 하자. △EGD와 △EBC에서 ${eq('ED', 'EC')}, ∠DEG = ∠CEB(맞꼭지각), ∠EDG = ∠ECB(엇각)이므로 △EGD ≡ △EBC (ASA 합동)이고 ${sg('DG')} = ${sg('CB')} = ${sg('AD')}이다. 점 D는 직각삼각형 AFG의 빗변 AG의 중점이므로 △AFG의 외심이고 ${sg('DA')} = ${sg('DF')} = ${sg('DG')}이다. △DAF는 이등변삼각형이므로 ∠DFA = ∠DAF = ${a}°이고, ∠AFE = 90°이므로 ∠DFE = 90° − ${a}° = ${90 - a}°이다.`,
          facts: { calc: [[`90-${a}`, 0]], unseen: [90] }
        });
      }),
      H('hard-mid-pgram-angle', '두 변의 중점으로 생긴 평행사변형의 각', '심18', (d) => {
        const v = d.until(() => ({ al: d.int(56, 66), be: d.int(30, 38) }), (w) => w.al + w.be !== 90), F = [1, 0], E = meet([0, 0], pol([0, 0], 1, v.be), F, pol(F, 1, 180 - v.al)), A = [2 * E[0] - 1, 2 * E[1]];
        const P = { A, B: [0, 0], C: [2, 0], D: [A[0] + 2, A[1]], H: [A[0] + 1, A[1]], F, E, G: [E[0] + 1, E[1]] }, sum = v.al + v.be;
        const g = fit(P, [225, 120]), b = shape(g, 'ABCD');
        segs(b, g, 'AF HC BH FD', 'thin'); nameOn(b, g, 'H', 'AD'); nameOn(b, g, 'F', 'BC'); nameAt(b, g, 'E', 'AB'); nameAt(b, g, 'G', 'CD'); ticks(b, g, 'AH HD BF FC', 1); ang(b, g, 'EBF', deg(v.be)); ang(b, g, 'EAH', deg(v.al));
        return degQ(`평행사변형 ABCD에서 두 변 AD, BC의 중점을 각각 H, F라 하고, 선분 AF와 선분 BH의 교점을 E, 선분 HC와 선분 FD의 교점을 G라 하자. ∠EBF = ${v.be}°, ∠EAH = ${v.al}°일 때, ∠HGF의 크기는?`, sum, {
          figure: b.svg(`${SAY_PG} 변 AD의 중점 H, 변 BC의 중점 F가 있고 선분 AF, BH, HC, FD가 그어져 있다. 선분 AH, HD, BF, FC에 같은 길이 표시가 있다. 선분 AF와 BH가 점 E에서, 선분 HC와 FD가 점 G에서 만난다. ∠EBF = ${v.be}°, ∠EAH = ${v.al}°`),
          explain: `${par('AH', 'FC')}, ${eq('AH', 'FC')}이므로 □AFCH는 평행사변형이고 ${par('AF', 'HC')}이다. ${par('HD', 'BF')}, ${eq('HD', 'BF')}이므로 □HBFD는 평행사변형이고 ${par('BH', 'FD')}이다. 두 쌍의 대변이 각각 평행하므로 □EFGH는 평행사변형이다. ${par('AD', 'BC')}이므로 ∠AFB = ∠FAH = ${v.al}°(엇각)이고, ∠HEF는 △EBF의 외각이므로 ∠HEF = ${v.be}° + ${v.al}° = ${sum}°이다. 평행사변형의 대각의 크기는 같으므로 ∠HGF = ∠HEF = ${sum}°이다.`,
          facts: { calc: [[`${v.be}+${v.al}`, 0]] }
        });
      }),
      H('hard-three-equi', '삼각형의 세 변을 한 변으로 하는 세 정삼각형과 각', '심21', (d) => {
        const th = d.int(104, 136), be = (180 - th) / 2 + d.pick([-6, -5, -4, 4, 5, 6]), A = meet([0, 0], pol([0, 0], 1, be), [1, 0], pol([1, 0], 1, th + be));
        const P = { A, B: [0, 0], C: [1, 0], D: turn(A, [0, 0], 60), E: turn([1, 0], [0, 0], 60), F: turn(A, [1, 0], -60) };
        const g = fit(P, [225, 205]), b = shape(g, 'ABC', { fill: ['ABC'], skip: 'A' });
        segs(b, g, 'AD DB AF FC EB EC DE EF'); nameAt(b, g, 'A', 'DF'); b.name(g.D, 'D', 170).name(g.E, 'E', 90).name(g.F, 'F', 10); ang(b, g, 'BAC', deg(th));
        return degQ(`△ABC의 세 변 AB, AC, BC를 각각 한 변으로 하는 정삼각형 ADB, ACF, EBC를 그림과 같이 그렸다. ∠BAC = ${th}°일 때, ∠DEF의 크기는?`, 240 - th, {
          figure: b.svg(`삼각형 ABC. 점 A는 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있고 삼각형 ABC가 색칠되어 있다. 변 AB의 왼쪽 위에 정삼각형 ADB, 변 AC의 오른쪽 위에 정삼각형 ACF가 있다. 변 BC의 위쪽에 정삼각형 EBC가 있고 점 A는 정삼각형 EBC의 내부에 있다. 선분 DE, 선분 EF가 그어져 있다. ∠BAC = ${th}°`),
          explain: `△DBE와 △ABC에서 ${eq('DB', 'AB')}, ${eq('BE', 'BC')}, ∠DBE = 60° − ∠EBA = ∠ABC이므로 △DBE ≡ △ABC (SAS 합동)이고 ${sg('DE')} = ${sg('AC')} = ${sg('AF')}이다. 같은 방법으로 △FEC ≡ △ABC이므로 ${sg('FE')} = ${sg('AB')} = ${sg('AD')}이다. 두 쌍의 대변의 길이가 각각 같으므로 □EDAF는 평행사변형이고, 대각의 크기는 같으므로 ∠DEF = ∠DAF이다. ∠DAF = 360° − (60° + ${th}° + 60°) = ${240 - th}°이므로 ∠DEF = ${240 - th}°이다.`,
          facts: { calc: [[`360-(60+${th}+60)`, 0]], unseen: [360, 60] }
        });
      }),
      H('hard-rect-sum45', '변의 길이의 비가 주어진 직사각형에서 두 각의 크기의 합', '심27', (d) => {
        const [h, p] = d.pick([[2, 1], [3, 1], [3, 2]]), w = h + p, P = rect(w, h); P.P = [0, p]; P.Q = [h, 0]; delete P.O;
        const g = fit(P, [200, 140]), b = shape(g, 'ABCD');
        segs(b, g, 'DP PQ'); nameOn(b, g, 'P', 'AB'); nameOn(b, g, 'Q', 'BC'); ang(b, g, 'ADP', ''); ang(b, g, 'BQP', '');
        const whereP = h === 2 * p ? '변 AB의 중점을 P라 하고' : `변 AB 위에 ${nb(`${sg('AP')} : ${sg('PB')} = ${h - p} : ${josa(p, '이/가')}`)} 되도록 점 P를 잡고`;
        return degQ(`${nb(`${sg('AB')} : ${sg('BC')} = ${h} : ${w}`)}인 직사각형 ABCD에서 ${whereP}, 변 BC 위에 ${nb(`${sg('BQ')} : ${sg('QC')} = ${h} : ${josa(p, '이/가')}`)} 되도록 점 Q를 잡았다. ∠ADP와 ∠BQP의 크기의 합은?`, 45, {
          figure: b.svg(`${SAY_RECT} 변 AB 위에 점 P, 변 BC 위에 점 Q가 있고 선분 DP, 선분 PQ가 그어져 있다. ∠ADP와 ∠BQP에 각을 나타내는 호가 그려져 있다`),
          explain: `${sg('AB')} = ${h}${A_}, ${sg('BC')} = ${w}${A_}라 하면 ${sg('PB')} = ${p === 1 ? '' : p}${A_}, ${sg('BQ')} = ${h}${A_}, ${sg('QC')} = ${p === 1 ? '' : p}${A_}, ${sg('CD')} = ${h}${A_}이다. 선분 DQ를 그으면 △PBQ와 △QCD에서 ${eq('PB', 'QC')}, ${eq('BQ', 'CD')}, ∠B = ∠C = 90°이므로 △PBQ ≡ △QCD (SAS 합동)이고 ${eq('PQ', 'QD')}, ∠BQP = ∠CDQ이다. ∠PQD = 180° − (∠PQB + ∠DQC) = 180° − (∠PQB + ∠QPB) = 90°이므로 △PQD는 직각이등변삼각형이고 ∠QDP = 45°이다. 따라서 ∠ADP + ∠BQP = ∠ADP + ∠CDQ = 90° − 45° = 45°이다.`,
          facts: { calc: [['90-90/2', 0]], unseen: [90, 2] }
        });
      }),
      H('hard-sq-45', '정사각형의 한 꼭짓점에서 벌어진 45°와 삼각형의 둘레의 길이', '심36', (d) => {
        const s = d.int(4, 15), f = d.pick([0.3, 0.36, 0.42]), P = rect(1, 1); P.F = [f, 1]; P.E = [1, (1 - f) / (1 + f)]; delete P.O;
        const g = fit(P, [150, 150]), b = shape(g, 'ABCD', { fill: ['DFE'] });
        segs(b, g, 'BF BE FE'); nameOn(b, g, 'F', 'AD'); nameOn(b, g, 'E', 'DC'); ang(b, g, 'FBE', '45°'); len(b, g, 'BC', cm(s));
        return lenQ(`한 변의 길이가 ${cm(s)}인 정사각형 ABCD의 변 AD 위의 점 F와 변 CD 위의 점 E에 대하여 ∠FBE = 45°일 때, △DFE의 둘레의 길이는 몇 cm인가?`, 2 * s, {
          figure: b.svg(`${SAY_SQ} 변 AD 위에 점 F, 변 CD 위에 점 E가 있고 선분 BF, BE, FE가 그어져 있다. 삼각형 DFE가 색칠되어 있다. ∠FBE = 45°, 변 BC의 길이는 ${cm(s)}`),
          explain: `변 DA의 연장선 위에 ${eq('AG', 'CE')}가 되도록 점 G를 잡는다. △GBA와 △EBC에서 ${eq('GA', 'EC')}, ∠GAB = ∠ECB = 90°, ${eq('AB', 'CB')}이므로 △GBA ≡ △EBC (SAS 합동)이고 ${eq('GB', 'EB')}, ∠GBA = ∠EBC이다. ∠GBF = ∠GBA + ∠ABF = ∠EBC + ∠ABF = 90° − 45° = 45°이므로 △GBF와 △EBF에서 ${eq('GB', 'EB')}, ∠GBF = ∠EBF, ${sg('BF')}는 공통이다. △GBF ≡ △EBF (SAS 합동)이므로 ${sg('EF')} = ${sg('GF')} = ${sg('GA')} + ${sg('AF')} = ${sg('EC')} + ${sg('AF')}이다. △DFE의 둘레의 길이는 ${sg('EF')} + ${sg('FD')} + ${sg('DE')} = (${sg('AF')} + ${sg('FD')}) + (${sg('DE')} + ${sg('EC')}) = ${sg('AD')} + ${sg('DC')} = ${s} + ${s} = ${2 * s} (cm)이다.`,
          facts: { calc: [[`${s}+${s}`, 0]] }
        });
      }),
      H('hard-trap-halve', '사다리꼴의 넓이를 이등분하는 선분', '심55', (d) => {
        const v = d.until(() => { const [m, n] = d.pick([[1, 2], [1, 1], [1, 3], [2, 1]]), j = d.int(1, 3), k = d.int(2, 6); return { m, n, h: (2 * m + n) * j, w: (m + n) * k, ae: m * k, x: m * j }; }, (q) => q.h >= 6 && q.h <= 15 && q.w >= q.h + 2 && q.w <= 2 * q.h);
        const P = rect(v.w, v.h); P.E = [v.ae, v.h]; P.F = [(v.ae + v.w) / 2, v.h / 2]; P.G = [0, v.x]; delete P.O;
        const g = fit(P, [190, 135]), b = shape(g, 'ABCD', { fill: ['AGFE'] });
        segs(b, g, 'EC FG'); nameOn(b, g, 'E', 'AD'); nameOn(b, g, 'G', 'AB'); nameIn(b, g, 'F', 'ECG'); ticks(b, g, 'EF FC', 1); b.dim(g.A, g.D, cm(v.w), g.B, 24); b.dim(g.A, g.B, cm(v.h), g.C, 24);
        return lenQ(`${sg('AB')} = ${cm(v.h)}, ${sg('AD')} = ${cm(v.w)}인 직사각형 ABCD에서 변 AD 위에 ${nb(`${sg('AE')} : ${sg('ED')} = ${v.m} : ${josa(v.n, '이/가')}`)} 되도록 점 E를 잡고, 선분 EC의 중점을 F라 하자. 변 AB 위의 점 G에 대하여 선분 FG가 사다리꼴 ABCE의 넓이를 이등분할 때, ${sg('GB')}의 길이는 몇 cm인가?`, v.x, {
          figure: b.svg(`${SAY_RECT} 변 AD 위에 점 E가 있고 선분 EC가 그어져 있다. 선분 EC의 중점 F에서 선분 EF와 선분 FC에 같은 길이 표시가 있다. 변 AB 위에 점 G가 있고 선분 FG가 그어져 있으며 사각형 AGFE가 색칠되어 있다. 변 AB의 길이는 ${cm(v.h)}, 변 AD의 길이는 ${cm(v.w)}`),
          explain: `${sg('AE')} = ${v.w} × ${frac(v.m, `${v.m} + ${v.n}`)} = ${v.ae} (cm)이다. 선분 GE, GC를 그으면 △GEF와 △GFC는 밑변의 길이가 같고(${eq('EF', 'FC')}) 높이가 같으므로 넓이가 같다. □AGFE와 □GBCF의 넓이가 같으므로 △AGE와 △GBC의 넓이가 같다. ${sg('GB')} = ${X} cm라 하면 ${HALF} × ${v.ae} × (${v.h} − ${X}) = ${HALF} × ${v.w} × ${X}에서 ${v.ae * v.h} − ${v.ae}${X} = ${v.w}${X}, ${X} = ${v.x}이다.`,
          facts: { calc: [[`(${v.w}*${v.m}/(${v.m}+${v.n}))*${v.h}/(${v.w}*${v.m}/(${v.m}+${v.n})+${v.w})`, 0]] }
        });
      }),
      H('hard-feet-line', '네 꼭짓점에서 한 직선에 내린 수선과 평행사변형의 넓이', '심56', (d) => {
        const v = d.until(() => ({ p: d.int(6, 8), q: d.int(3, 4), a: d.int(9, 13), u: d.int(4, 7), b: d.int(4, 6) }), (x) => x.a - x.b >= 5 && x.a + x.u <= 18 && new Set([x.a, x.a + x.u, x.b + x.u, x.p, x.q]).size === 5);
        const { p, q, a } = v, ds = a + v.u, bt = v.b, cv = bt + v.u, end = 2 * p + q, L_ = V('l');
        const P = { A: [0, a], B: [p + q, bt], C: [end, cv], D: [p, ds], R: [0, 0], S: [p, 0], T: [p + q, 0], V: [end, 0], K: [-1.5, 0], L: [end + 2.4, 0] };
        const g = fit(P, [235, 175]), b = shape(g, 'ABCD', { skip: 'B' });
        b.name(g.B, 'B', 205, 12); b.seg(g.K, g.L); segs(b, g, 'AR DS BT CV', 'thin'); for (const k of 'RSTV') b.name(g[k], k, 270, 12);
        ang(b, g, 'ARS', ''); ang(b, g, 'DST', ''); ang(b, g, 'BTV', ''); ang(b, g, 'CVL', ''); b.text([g.L[0] + 8, g.L[1]], sv('l'));
        len(b, g, 'AR', cm(a)); len(b, g, 'CV', cm(cv)); b.beside(g.D, g.S, cm(ds), g.T, { t: 0.86 }); b.dim(g.R, g.S, cm(p), g.A, 27); b.dim(g.S, g.T, cm(q), g.A, 27);
        const t1 = (a + ds) * p / 2, t2 = (ds + cv) * (p + q) / 2, t3 = (a + bt) * (p + q) / 2, t4 = (bt + cv) * p / 2, S = t1 + t2 - t3 - t4;
        return areaQ(`평행사변형 ABCD의 네 꼭짓점 A, B, C, D에서 직선 ${L_}에 내린 수선의 발을 각각 R, T, V, S라 하자. ${sg('DS')} = ${cm(ds)}, ${sg('AR')} = ${cm(a)}, ${sg('CV')} = ${cm(cv)}, ${sg('RS')} = ${cm(p)}, ${sg('ST')} = ${cm(q)}일 때, 평행사변형 ABCD의 넓이는 몇 cm²인가?`, S, {
          figure: b.svg(`직선 l 위에 왼쪽부터 점 R, S, T, V가 있고, 직선의 위쪽에 평행사변형 ABCD가 있다. 점 A는 왼쪽, 점 D는 위, 점 C는 오른쪽, 점 B는 아래에 있다. 점 A, D, B, C에서 직선 l에 내린 수선의 발이 차례로 R, S, T, V이고 네 곳에 직각 표시가 있다. 선분 DS의 길이는 ${cm(ds)}, 선분 AR의 길이는 ${cm(a)}, 선분 CV의 길이는 ${cm(cv)}, 선분 RS의 길이는 ${cm(p)}, 선분 ST의 길이는 ${cm(q)}`),
          explain: `점 A에서 선분 DS에 내린 수선의 발을 E, 점 B에서 선분 CV에 내린 수선의 발을 F라 하자. △AED와 △BFC에서 ${eq('AD', 'BC')}, ∠AED = ∠BFC = 90°이고, ${par('AD', 'BC')}, ${par('AE', 'BF')}이므로 ∠DAE = ∠CBF이다. △AED ≡ △BFC (RHA 합동)이므로 ${sg('TV')} = ${sg('BF')} = ${sg('AE')} = ${sg('RS')} = ${cm(p)}, ${sg('CF')} = ${sg('DE')} = ${ds} − ${a} = ${v.u} (cm)이고 ${sg('BT')} = ${cv} − ${v.u} = ${bt} (cm)이다. 사다리꼴의 넓이를 구하면 □ARSD = ${HALF} × (${a} + ${ds}) × ${p} = ${t1}, □DSVC = ${HALF} × (${ds} + ${cv}) × ${p + q} = ${t2}, □ARTB = ${HALF} × (${a} + ${bt}) × ${p + q} = ${t3}, □BTVC = ${HALF} × (${bt} + ${cv}) × ${p} = ${t4} (cm²)이다. 평행사변형 ABCD의 넓이는 □ARSD + □DSVC − □ARTB − □BTVC = ${t1} + ${t2} − ${t3} − ${t4} = ${S} (cm²)이다.`,
          facts: { calc: [[`((${a}+${ds})*${p}+(${ds}+${cv})*(${p}+${q})-(${a}+${cv}-(${ds}-${a}))*(${p}+${q})-(${cv}-(${ds}-${a})+${cv})*${p})/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-mid-ext-area', '두 변의 중점을 지나는 직선과 변의 연장선이 만드는 삼각형의 넓이', '심57', (d) => {
        const k = d.int(3, 12), S = 8 * k, P = para(1.7, 0.85, d.int(60, 66)); P.M = lerp(P.A, P.D, 0.5); P.N = [0.85, 0]; P.E = [2 * P.D[0] - P.C[0], 2 * P.D[1]]; P.F = [2 * P.C[0] - P.D[0], -P.D[1]]; P.O = lerp(P.A, P.N, 0.5);
        const g = fit(P, [220, 200]), b = shape(g, 'ABCD', { fill: ['EFO'] });
        segs(b, g, 'BE AF DE CF'); nameIn(b, g, 'M', 'ABDE'); b.name(g.N, 'N', 235, 12); nameAt(b, g, 'O', 'AB'); b.name(g.E, 'E', 45).name(g.F, 'F', 300); ticks(b, g, 'AM MD BN NC', 1);
        return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD에서 두 변 AD, BC의 중점을 각각 M, N이라 하자. 직선 BM과 직선 AN이 변 CD의 연장선과 만나는 점을 각각 E, F라 하고, 선분 AF와 선분 BE의 교점을 O라 할 때, △EFO의 넓이는 몇 cm²인가?`, 9 * k, {
          figure: b.svg(`${SAY_PG} 변 AD의 중점 M, 변 BC의 중점 N이 있고 선분 AM, MD, BN, NC에 같은 길이 표시가 있다. 선분 BM을 점 M 너머로 늘인 선이 변 CD를 점 D 너머로 늘인 선과 점 E에서 만나고, 선분 AN을 점 N 너머로 늘인 선이 변 CD를 점 C 너머로 늘인 선과 점 F에서 만난다. 선분 AF와 선분 BE가 점 O에서 만나고 삼각형 EFO가 색칠되어 있다`),
          explain: `△ABM과 △DEM에서 ${eq('AM', 'DM')}, ∠AMB = ∠DME(맞꼭지각), ∠BAM = ∠EDM(엇각)이므로 △ABM ≡ △DEM (ASA 합동)이다. 같은 방법으로 △ABN ≡ △FCN이다. ${par('AM', 'BN')}, ${eq('AM', 'BN')}이므로 □ABNM은 평행사변형이고, 그 넓이는 ${S} ÷ 2 = ${4 * k} (cm²)이다. 점 O는 □ABNM의 두 대각선의 교점이므로 △ABM = △ABN = ${4 * k} ÷ 2 = ${2 * k} (cm²), △OMN = ${4 * k} ÷ 4 = ${k} (cm²)이다. △EFO = △DEM + △FCN + △OMN + □MNCD = ${2 * k} + ${2 * k} + ${k} + ${4 * k} = ${9 * k} (cm²)이다.`,
          facts: { calc: [[`${S}/4+${S}/4+${S}/8+${S}/2`, 0]], unseen: [4, 8, 2] }
        });
      }),
      H('hard-par-move', '대각선에 평행한 선분으로 넓이가 같은 삼각형을 이어 찾기', '심60', (d, n) => {
        const [m, r] = d.pick([[1, 2], [1, 3], [2, 3], [3, 2], [2, 1]]), j = d.int(2, 6), S = 2 * (m + r) * j, P = para(1.6, 1, d.int(62, 70)); delete P.O;
        if (n === 0) {
          const t = r * j; P.E = lerp(P.D, P.A, m / (m + r)); P.F = lerp(P.D, P.C, m / (m + r));
          const g = fit(P, [200, 114]), b = shape(g, 'ABCD', { fill: ['ABE'] });
          b.seg(g.A, g.C, 'thin'); segs(b, g, 'EF BE'); nameOn(b, g, 'E', 'AD'); nameOn(b, g, 'F', 'DC'); b.arrow(g.A, g.C, 0.74).arrow(g.E, g.F, 0.5);
          return areaQ(`평행사변형 ABCD의 변 AD 위의 점 E와 변 DC 위의 점 F에 대하여 ${par('AC', 'EF')}이고 ${nb(`${sg('DF')} : ${sg('FC')} = ${m} : ${r}`)}이다. △ABE의 넓이가 ${t} cm²일 때, 평행사변형 ABCD의 넓이는 몇 cm²인가?`, S, {
            figure: b.svg(`${SAY_PG} 변 AD 위에 점 E, 변 DC 위에 점 F가 있다. 대각선 AC와 선분 EF에 평행 표시가 있고, 선분 BE가 그어져 있으며 삼각형 ABE가 색칠되어 있다`),
            explain: `선분 CE, AF를 긋는다. ${par('AD', 'BC')}이므로 △ABE와 △ACE는 밑변 AE가 공통이고 높이가 같아 넓이가 같다. ${par('AC', 'EF')}이므로 △ACE와 △ACF는 밑변 AC가 공통이고 높이가 같아 넓이가 같다. 따라서 △ACF의 넓이는 ${t} cm²이다. △AFD와 △ACF는 높이가 같으므로 넓이의 비는 ${nb(`${sg('DF')} : ${sg('FC')} = ${m} : ${r}`)}이고 △AFD = ${t} × ${frac(m, r)} = ${m * j} (cm²)이다. △ACD = ${t} + ${m * j} = ${(m + r) * j} (cm²)이므로 평행사변형 ABCD의 넓이는 2 × ${(m + r) * j} = ${S} (cm²)이다.`,
            facts: { calc: [[`(${t}+${t}*${m}/${r})*2`, 0]], unseen: [2] }
          });
        }
        P.P = lerp(P.A, P.D, m / (m + r)); P.Q = lerp(P.C, P.D, m / (m + r));
        const g = fit(P, [200, 114]), b = shape(g, 'ABCD', { fill: ['BCQ'] });
        b.seg(g.A, g.C, 'thin'); segs(b, g, 'PQ BQ'); nameOn(b, g, 'P', 'AD'); nameOn(b, g, 'Q', 'DC'); b.arrow(g.A, g.C, 0.4).arrow(g.P, g.Q, 0.5);
        return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD의 변 AD 위의 점 P와 변 DC 위의 점 Q에 대하여 ${par('AC', 'PQ')}이고 ${nb(`${sg('AP')} : ${sg('PD')} = ${m} : ${r}`)}이다. △BCQ의 넓이는 몇 cm²인가?`, m * j, {
          figure: b.svg(`${SAY_PG} 변 AD 위에 점 P, 변 DC 위에 점 Q가 있다. 대각선 AC와 선분 PQ에 평행 표시가 있고, 선분 BQ가 그어져 있으며 삼각형 BCQ가 색칠되어 있다`),
          explain: `선분 AQ, CP를 긋는다. ${par('AB', 'DC')}이므로 △BCQ와 △ACQ는 밑변 CQ가 공통이고 높이가 같아 넓이가 같다. ${par('AC', 'PQ')}이므로 △ACQ와 △ACP는 밑변 AC가 공통이고 높이가 같아 넓이가 같다. △ACD의 넓이는 평행사변형의 넓이의 반인 ${S / 2} cm²이고, △ACP와 △PCD는 높이가 같으므로 넓이의 비는 ${nb(`${sg('AP')} : ${sg('PD')} = ${m} : ${r}`)}이다. △ACP = ${S / 2} × ${frac(m, `${m} + ${r}`)} = ${m * j} (cm²)이므로 △BCQ의 넓이는 ${m * j} cm²이다.`,
          facts: { calc: [[`${S}/2*${m}/(${m}+${r})`, 0]], unseen: [2] }
        });
      }, { count: 2 }),
      H('hard-trap-sum', '윗변과 옆변의 길이의 합이 아랫변의 길이와 같은 사다리꼴의 각', '기본 ①57', (d) => {
        const be = 2 * d.int(22, 32), t = d.pick([0.7, 0.8, 0.9]), A = pol([0, 0], 1, be), P = { A, B: [0, 0], C: [1 + t, 0], D: [A[0] + t, A[1]] }, e = 90 - be / 2;
        const g = fit(P, [200, 120]), b = shape(g, 'ABCD');
        arrows(b, g, 'AD BC', 0.5); ang(b, g, 'ABC', deg(be));
        return degQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 ${sg('AB')} + ${sg('AD')} = ${sg('BC')}이고 ∠B = ${be}°일 때, ∠D의 크기는?`, 180 - e, {
          figure: b.svg(`사다리꼴 ABCD. ${at4} 변 AD와 변 BC에 평행 표시가 있고 변 AD가 변 BC보다 짧다. ∠B = ${be}°`),
          explain: `꼭짓점 A를 지나고 변 DC에 평행한 직선이 변 BC와 만나는 점을 E라 하면 □AECD는 두 쌍의 대변이 각각 평행하므로 평행사변형이고 ${eq('EC', 'AD')}이다. ${sg('BE')} = ${sg('BC')} − ${sg('EC')} = ${sg('BC')} − ${sg('AD')} = ${sg('AB')}이므로 △ABE는 이등변삼각형이고 ∠AEB = (180° − ${be}°) ÷ 2 = ${e}°이다. ∠AEC = 180° − ${e}° = ${180 - e}°이고 평행사변형의 대각의 크기는 같으므로 ∠D = ∠AEC = ${180 - e}°이다.`,
          facts: { calc: [[`180-(180-${be})/2`, 0]], unseen: [180, 2] }
        });
      }),
      H('hard-four-points', '네 변 위의 점이 만드는 사각형의 변의 길이와 미지수', '심16', (d) => {
        const ex = (k, name, c, mark) => `(${k}${mark(name)} − ${c}) cm`;
        const draw = (w) => {
          // 선분 EF 의 길이가 y 가 되게 점 E 의 자리를 셈한다(BF = u, ∠B = be).
          const u = 0.62 * w.y, sb = Math.sin(w.be * RAD), eb = u * Math.cos(w.be * RAD) + Math.sqrt(w.y * w.y - u * u * sb * sb), ae = 0.45 * eb, s = ae + eb, P = para(w.L1 + u, s, w.be);
          P.E = lerp(P.B, P.A, eb / s); P.F = [u, 0]; P.G = lerp(P.C, P.D, ae / s); P.H = [P.D[0] - u, P.D[1]]; delete P.O;
          const g = fit(P, [225, 125]), b = shape(g, 'ABCD');
          segs(b, g, 'EF FG GH HE'); nameOn(b, g, 'E', 'AB'); nameOn(b, g, 'F', 'BC'); nameOn(b, g, 'G', 'DC'); nameOn(b, g, 'H', 'AD'); ticks(b, g, 'AE CG', 1); ticks(b, g, 'BF DH', 2);
          len(b, g, 'AH', ex(w.p, 'x', w.q, sv)); len(b, g, 'FC', ex(w.r, 'y', w.t, sv)); len(b, g, 'EF', `(${sv('x')} + ${w.c}) cm`, 'D', { gap: 10 }); len(b, g, 'GH', `${sv('y')} cm`, 'B', { gap: 8 });
          return b;
        };
        const v = d.until(() => { const x = d.int(2, 6), c = d.int(1, 3), y = x + c, p = d.pick([3, 4, 5]), r = d.pick([2, 3]), q = d.int(1, 6), L1 = p * x - q; return { x, c, y, p, r, q, L1, t: r * y - L1, be: d.int(62, 70) }; },
          (w) => w.p > w.r && w.t >= 1 && w.t <= 9 && w.L1 >= w.y + 2 && w.L1 <= 14 && w.y <= 8 && !draw(w).clash());
        const k = v.p - v.r, rhs = v.q + v.r * v.c - v.t;
        return M(`평행사변형 ABCD의 네 변 AB, BC, CD, DA 위에 ${eq('AE', 'CG')}, ${eq('BF', 'DH')}가 되도록 네 점 E, F, G, H를 각각 잡았다. ${sg('AH')} = ${nb(ex(v.p, 'x', v.q, V))}, ${sg('CF')} = ${nb(ex(v.r, 'y', v.t, V))}, ${sg('EF')} = ${nb(`(${X} + ${v.c}) cm`)}, ${sg('GH')} = ${nb(`${Y} cm`)}일 때, ${X}, ${Y}의 값을 차례로 구하시오.`, [{ label: X, answer: v.x }, { label: Y, answer: v.y }], {
          figure: draw(v).svg(`${SAY_PG} 변 AB 위에 점 E, 변 BC 위에 점 F, 변 CD 위에 점 G, 변 DA 위에 점 H가 있고 사각형 EFGH의 네 변이 그어져 있다. 선분 AE와 선분 CG에 같은 표시(한 줄), 선분 BF와 선분 DH에 같은 표시(두 줄)가 있다. 선분 AH의 길이는 (${v.p}x − ${v.q}) cm, 선분 CF의 길이는 (${v.r}y − ${v.t}) cm, 선분 EF의 길이는 (x + ${v.c}) cm, 선분 GH의 길이는 y cm`),
          explain: `${eq('AD', 'BC')}, ${eq('DH', 'BF')}이므로 ${sg('AH')} = ${sg('AD')} − ${sg('DH')} = ${sg('BC')} − ${sg('BF')} = ${sg('CF')}이고, ${v.p}${X} − ${v.q} = ${v.r}${Y} − ${v.t}이다. △BFE와 △DHG에서 ${eq('BF', 'DH')}, ∠B = ∠D, ${sg('BE')} = ${sg('AB')} − ${sg('AE')} = ${sg('CD')} − ${sg('CG')} = ${sg('DG')}이므로 △BFE ≡ △DHG (SAS 합동)이고 ${eq('EF', 'GH')}, 곧 ${Y} = ${X} + ${v.c}이다. 이것을 앞의 식에 대입하면 ${v.p}${X} − ${v.q} = ${v.r}(${X} + ${v.c}) − ${v.t}에서 ${k === 1 ? '' : `${k}${X} = ${rhs}, `}${X} = ${v.x}이고 ${Y} = ${v.x} + ${v.c} = ${v.y}이다.`,
          facts: { calc: [[`(${v.q}+${v.r}*${v.c}-${v.t})/(${v.p}-${v.r})`, 0], [`(${v.q}+${v.r}*${v.c}-${v.t})/(${v.p}-${v.r})+${v.c}`, 1]] }
        });
      }),
      H('hard-bis-tri-area', '직각삼각형의 넓이로 높이를 구하여 이등분선이 만든 삼각형의 넓이 구하기', '심49', (d) => {
        // 답이 자연수가 되는 세 변만 쓴다(∠BAC = 90°인 직각삼각형 ABC 의 세 변은 문제가 모두 준다).
        const [a, c2, w] = d.pick([[15, 20, 25], [20, 15, 25], [30, 40, 50], [40, 30, 50]]), h = a * c2 / w, P = { A: [a * a / w, h], B: [0, 0], C: [w, 0] }; P.D = add(P.A, [w, 0]); P.E = add(P.A, [a, 0]);
        const g = fit(P, [225, 110]), b = shape(g, 'ABCD', { fill: ['ABE'] });
        b.seg(g.A, g.C, 'thin').seg(g.B, g.E); nameOn(b, g, 'E', 'AD'); ang(b, g, 'BAC', ''); halves(b, g, 'ABC', 'E', 'dot', a > c2 ? 44 : 28); len(b, g, 'AB', cm(a)); len(b, g, 'BC', cm(w)); len(b, g, 'AC', cm(c2), 'D', { t: 0.72 });
        return areaQ(`평행사변형 ABCD에서 ∠B의 이등분선이 변 AD와 만나는 점을 E라 하자. ∠BAC = 90°이고 ${sg('AB')} = ${cm(a)}, ${sg('AC')} = ${cm(c2)}, ${sg('BC')} = ${cm(w)}일 때, △ABE의 넓이는 몇 cm²인가?`, a * h / 2, {
          figure: b.svg(`${SAY_PG} 대각선 AC가 그어져 있고 ∠BAC에 직각 표시가 있다. 변 AD 위에 점 E가 있고 선분 BE가 그어져 있다. ∠ABE와 ∠CBE에 같은 표시가 있고 삼각형 ABE가 색칠되어 있다. 변 AB의 길이는 ${cm(a)}, 대각선 AC의 길이는 ${cm(c2)}, 변 BC의 길이는 ${cm(w)}`),
          explain: `△ABC는 ∠BAC = 90°인 직각삼각형이므로 넓이는 ${HALF} × ${a} × ${c2} = ${a * c2 / 2} (cm²)이고, 평행사변형 ABCD의 넓이는 그 2배인 ${a * c2} cm²이다. 변 BC를 밑변으로 할 때의 높이를 ${H_} cm라 하면 ${w} × ${H_} = ${a * c2}에서 ${H_} = ${h}이다. ${par('AD', 'BC')}이므로 ∠AEB = ∠CBE(엇각)이고, ∠ABE = ∠CBE이므로 △ABE는 ${sg('AE')} = ${sg('AB')} = ${cm(a)}인 이등변삼각형이다. △ABE의 넓이는 ${HALF} × ${a} × ${h} = ${a * h / 2} (cm²)이다.`,
          facts: { calc: [[`${a}*(${a}*${c2}/${w})/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-rect-corners', '직사각형의 세 귀퉁이를 자른 직각삼각형의 넓이', '심54', (d) => {
        const v = d.until(() => { const [i, j] = d.pick([[1, 3], [1, 2], [1, 4], [2, 5], [2, 3]]), [k, l] = d.pick([[1, 2], [1, 3], [1, 4], [2, 3], [2, 5]]), S = 2 * j * l * d.int(1, 4); return { i, j, k, l, S, a: S * i / (2 * j), b: S * k / (2 * l), z: S * (j - i) * (l - k) / (2 * j * l) }; },
          (q) => q.S >= 24 && q.S <= 120 && q.i * q.l !== q.k * q.j && new Set([q.a, q.b, q.z]).size === 3);
        const P = rect(4, 3); P.P = [4 * v.i / v.j, 0]; P.Q = [4, 3 - 3 * v.k / v.l]; delete P.O;
        const g = fit(P, [190, 143]), b = shape(g, 'ABCD', { fill: ['PCQ'] });
        segs(b, g, 'AP AQ PQ'); nameOn(b, g, 'P', 'BC'); nameOn(b, g, 'Q', 'DC');
        return areaQ(`넓이가 ${v.S} cm²인 직사각형 ABCD의 변 BC 위의 점 P와 변 CD 위의 점 Q에 대하여 △ABP의 넓이가 ${v.a} cm², △ADQ의 넓이가 ${v.b} cm²일 때, △PCQ의 넓이는 몇 cm²인가?`, v.z, {
          figure: b.svg(`${SAY_RECT} 변 BC 위에 점 P, 변 CD 위에 점 Q가 있고 선분 AP, AQ, PQ가 그어져 있다. 삼각형 PCQ가 색칠되어 있다`),
          explain: `대각선 AC를 그으면 △ABC와 △ACD의 넓이는 모두 직사각형의 넓이의 반인 ${v.S / 2} cm²이다. △ABP와 △ABC는 높이가 같으므로 ${nb(`${sg('BP')} : ${sg('BC')} = ${v.a} : ${v.S / 2} = ${v.i} : ${v.j}`)}이고 ${sg('PC')} = ${frac(v.j - v.i, v.j)}${sg('BC')}이다. △ADQ와 △ACD도 높이가 같으므로 ${nb(`${sg('DQ')} : ${sg('DC')} = ${v.b} : ${v.S / 2} = ${v.k} : ${v.l}`)}이고 ${sg('QC')} = ${frac(v.l - v.k, v.l)}${sg('DC')}이다. △PCQ의 넓이는 ${HALF} × ${sg('PC')} × ${sg('QC')} = ${HALF} × ${frac(v.j - v.i, v.j)} × ${frac(v.l - v.k, v.l)} × ${v.S} = ${v.z} (cm²)이다.`,
          facts: { calc: [[`(${v.S}-2*${v.a})*(${v.S}-2*${v.b})/(2*${v.S})`, 0]], unseen: [2] }
        });
      }),
      H('hard-trap-inner', '사다리꼴의 내부의 한 점과 넓이가 같은 두 삼각형', '심65', (d) => {
        // 수치대로 그렸을 때 사다리꼴이 지나치게 길쭉해지지 않게, 윗변 2mk, 아랫변 2nk, 높이 (m + n)k 로 잡는다.
        const [m, n, top] = d.pick([[3, 5, 2], [2, 3, 3], [2, 5, 2], [3, 4, 2], [1, 2, 3]]), k = d.int(1, top), p = 2 * m * k, q = 2 * n * k, hh = (m + n) * k, S = (m + n) * (m + n) * k * k, each = m * n * k * k, co = (c) => (c === 1 ? '' : c) + H_;
        const shift = 0.35 * (q - p), P = trap(p, q, hh, shift), y = m * k, lo = shift * y / hh, hi = q - (q - p - shift) * y / hh; P.P = [lo + 0.45 * (hi - lo), y];
        const g = fit(P, [200, 160]), b = shape(g, 'ABCD', { fill: ['ABP', 'PCD'] });
        segs(b, g, 'PA PB PC PD', 'thin'); nameIn(b, g, 'P', 'ABCD'); arrows(b, g, 'AD BC', 0.25); len(b, g, 'AD', cm(p)); len(b, g, 'BC', cm(q));
        return areaQ(`${par('AD', 'BC')}이고 ${sg('AD')} = ${cm(p)}, ${sg('BC')} = ${cm(q)}인 사다리꼴 ABCD의 내부의 한 점 P에 대하여 △APD와 △PBC의 넓이가 같다. 사다리꼴 ABCD의 넓이가 ${S} cm²일 때, △ABP와 △PCD의 넓이의 합은 몇 cm²인가?`, S - 2 * each, {
          figure: b.svg(`사다리꼴 ABCD. ${at4} 변 AD와 변 BC에 평행 표시가 있다. 내부의 점 P와 네 꼭짓점을 이은 선분이 그어져 있고, 삼각형 ABP와 삼각형 PCD가 색칠되어 있다. 변 AD의 길이는 ${cm(p)}, 변 BC의 길이는 ${cm(q)}`),
          explain: `△APD와 △PBC의 넓이가 같고 밑변의 길이의 비가 ${nb(`${p} : ${q} = ${m} : ${n}`)}이므로 높이의 비는 ${nb(`${n} : ${m}`)}이다. 두 삼각형의 높이를 각각 ${co(n)} cm, ${co(m)} cm라 하면 사다리꼴의 높이는 ${m + n}${H_} cm이므로 ${HALF} × (${p} + ${q}) × ${m + n}${H_} = ${S}에서 ${H_} = ${k}이다. △APD의 넓이는 ${HALF} × ${p} × ${n * k} = ${each} (cm²)이고 △PBC의 넓이도 ${each} cm²이므로, △ABP와 △PCD의 넓이의 합은 ${S} − 2 × ${each} = ${S - 2 * each} (cm²)이다.`,
          facts: { calc: [[`${S}-2*${p}*${q}*${S}/((${p}+${q})*(${p}+${q}))`, 0]], unseen: [2] }
        });
      })
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
  // ── 처음 지을 때 뺀 꼴을 다시 보고 기본 묶음에 덧붙인 것(2026-10-13) ──
  // 접기(①19 ①50 심24)와 변을 늘이는 보조선(심11), 「내부의 한 점은 한 유형만」이라 겹침으로 두었던 심46이다. 두세 단계에 풀리므로 기본에 둔다.
  B.addTypes('8-2-2', 'use', [
    TB('use-fold', '대각선을 접는 선으로 하여 접은 평행사변형과 각', '기본 ①19', (d) => {
      // ∠ABD = ∠CDB = th, ∠DBC = ph 인 평행사변형. 점 E 는 점 C 를 대각선 BD 에 대하여 뒤집은 자리다.
      const v = d.until(() => ({ th: d.int(36, 46), ph: d.int(20, 26) }), (w) => w.th - w.ph >= 13), th = v.th, P = { B: [0, 0], D: pol([0, 0], 1, v.ph) };
      P.A = [P.D[1] / Math.tan((th + v.ph) * RAD), P.D[1]]; P.C = [P.D[0] - P.A[0], 0]; P.E = reflect(P.C, P.B, P.D); P.F = meet(P.B, P.A, P.D, P.E);
      const g = fit(P, [235, 180]), b = boardOf(g, 'ABCD');
      b.poly([g.D, g.B, g.E], TINT); b.seg(g.B, g.C, 'cut').seg(g.C, g.D, 'cut'); segs(b, g, 'BA AD BD'); segs(b, g, 'AF EF', 'thin');
      namesIn(b, g, [['A', 'BFD'], ['B', 'ADC'], ['C', 'BD'], ['D', 'ABCE'], ['E', 'DBF'], ['F', 'AE']]); ang(b, g, 'CDB', deg(th));
      return degQ(`평행사변형 ABCD 모양의 종이를 대각선 BD를 접는 선으로 하여 접었더니 꼭짓점 C가 점 E로 옮겨졌다. 변 BA의 연장선과 선분 DE의 연장선이 만나는 점을 F라 하자. ∠CDB = ${th}°일 때, ∠BFD의 크기는?`, 180 - 2 * th, {
        figure: b.svg(`평행사변형 ABCD 모양의 종이를 대각선 BD로 접은 그림. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다. 접기 전의 변 BC와 변 CD는 점선으로 그려져 있고, 접어 옮긴 삼각형 DBE가 색칠되어 있다. 점 E는 변 AD의 위쪽에 있다. 변 BA를 점 A 너머로 늘인 선과 선분 DE를 점 E 너머로 늘인 선이 점 F에서 만난다. ∠CDB = ${th}°`),
        explain: `${par('AB', 'DC')}이므로 ∠ABD = ∠CDB = ${th}°(엇각)이다. 접은 각이므로 ∠EDB = ∠CDB = ${th}°이다. △FBD에서 ∠BFD = 180° − (${th}° + ${th}°) = ${180 - 2 * th}°이다.`,
        facts: { calc: [[`180-(${th}+${th})`, 0]], unseen: [180] }
      });
    }),
    TB('use-perp-ext', '한 꼭짓점에서 내린 수선과 변의 연장선', '심11', (d) => {
      const v = d.until(() => { const ph = d.int(26, 34), P = para(1, d.pick([1.15, 1.2, 1.25]), d.int(64, 72)); P.F = meet(P.B, pol(P.B, 1, ph), P.C, P.D); P.E = foot(P.A, P.B, P.F); delete P.O; return { ph, P, u: P.F[1] / P.D[1], e: P.E[0] / P.F[0] }; }, (w) => w.u >= 0.35 && w.u <= 0.8 && w.e >= 0.35 && w.e <= 0.75);
      const g = fit(v.P, [190, 200]), b = shape(g, 'ABCD');
      segs(b, g, 'BF AE'); nameOn(b, g, 'F', 'DC'); nameIn(b, g, 'E', 'BFA'); ang(b, g, 'AEF', ''); ang(b, g, 'FBC', deg(v.ph));
      return degQ(`평행사변형 ABCD의 변 CD 위의 점 F에 대하여 꼭짓점 A에서 선분 BF에 내린 수선의 발을 E라 하자. ∠FBC = ${v.ph}°일 때, ∠DAE의 크기는?`, 90 - v.ph, {
        figure: b.svg(`${SAY_PG} 변 CD 위에 점 F가 있고 선분 BF가 그어져 있다. 점 A에서 선분 BF에 내린 수선의 발 E에 직각 표시가 있다. ∠FBC = ${v.ph}°`),
        explain: `변 AD의 연장선과 선분 BF의 연장선이 만나는 점을 P라 하자. ${par('AD', 'BC')}이므로 ∠APE = ∠FBC = ${v.ph}°(엇각)이다. △AEP에서 ∠AEP = 90°이므로 ∠DAE = 90° − ${v.ph}° = ${90 - v.ph}°이다.`,
        facts: { calc: [[`90-${v.ph}`, 0]], unseen: [90] }
      });
    })
  ]);
  B.addTypes('8-2-2', 'area', [
    TB('area-inner-lines', '내부의 한 점을 지나는 두 평행선과 세 삼각형의 넓이', '심46', (d) => {
      const S = 2 * d.int(12, 48), P = para(1.6, 1, d.int(62, 70)), s = d.pick([0.4, 0.45, 0.55, 0.6]); delete P.O;
      P.E = lerp(P.B, P.A, d.pick([0.4, 0.45, 0.55])); P.F = [1.6 * s, 0]; P.P = add(P.E, P.F); P.H = add(P.A, P.F); P.G = add(P.E, P.C);
      const g = fit(P, [200, 114]), b = shape(g, 'ABCD', { fill: ['PAH', 'PBF', 'PCD'] });
      segs(b, g, 'HF EG PA PB PC PD', 'thin'); nameOn(b, g, 'E', 'AB'); nameOn(b, g, 'F', 'BC'); nameOn(b, g, 'G', 'DC'); nameOn(b, g, 'H', 'AD'); nameIn(b, g, 'P', 'ABCDEFGH');
      return areaQ(`넓이가 ${S} cm²인 평행사변형 ABCD의 내부의 한 점 P를 지나고 변 AB에 평행한 직선이 변 AD, BC와 만나는 점을 각각 H, F라 하고, 변 BC에 평행한 직선이 변 AB, DC와 만나는 점을 각각 E, G라 하자. △PAH, △PBF, △PCD의 넓이의 합은 몇 cm²인가?`, S / 2, {
        figure: b.svg(`${SAY_PG} 내부의 점 P를 지나고 변 AB에 평행한 선분 HF(점 H는 변 AD 위, 점 F는 변 BC 위)와 변 BC에 평행한 선분 EG(점 E는 변 AB 위, 점 G는 변 DC 위)가 그어져 있다. 점 P와 네 꼭짓점을 이은 선분이 그어져 있고, 삼각형 PAH, 삼각형 PBF, 삼각형 PCD가 색칠되어 있다`),
        explain: `□AEPH와 □EBFP는 두 쌍의 대변이 각각 평행하므로 평행사변형이고, 평행사변형의 대각선은 그 넓이를 이등분하므로 △PAH = △PAE, △PBF = △PBE이다. 따라서 △PAH + △PBF = △PAE + △PBE = △PAB이다. △PAB는 □ABFH와 밑변 AB가 같고 높이가 같으므로 넓이가 □ABFH의 반이고, 같은 방법으로 △PCD의 넓이는 □HFCD의 반이다. 세 삼각형의 넓이의 합은 △PAB + △PCD = ${HALF} × (□ABFH + □HFCD) = ${HALF} × ${S} = ${S / 2} (cm²)이다.`,
        facts: { calc: [[`${S}/2`, 0]], unseen: [2] }
      });
    })
  ]);
  B.addTypes('8-2-2', 'kinds', [
    TB('rect-fold', '직사각형 모양의 종이를 접어 생긴 각', '기본 ①50 / 심24', (d, n) => {
      if (n === 0) {
        // 꼭짓점 B 가 꼭짓점 D 에 오게 접는다(접는 선 EF 는 대각선 BD 의 수직이등분선). 세로 1, ∠FDC = ph 이면 FC = tan ph, DF = BF = 1/cos ph. 점 Q 는 점 A 가 옮겨진 자리(A′).
        const ph = 2 * d.int(12, 17), flap = d.bool(), t = Math.tan(ph * RAD), k = 1 / Math.cos(ph * RAD), w = t + k, x = 45 + ph / 2;
        const P = { A: [0, 1], B: [0, 0], C: [w, 0], D: [w, 1], E: [t, 1], F: [k, 0] }; P.Q = reflect(P.A, P.E, P.F);
        const g = fit(P, [215, 190]), b = boardOf(g, 'ECDQ');
        b.poly([g.Q, g.D, g.F, g.E], TINT); b.seg(g.A, g.E, 'cut').seg(g.A, g.B, 'cut').seg(g.B, g.F, 'cut'); segs(b, g, 'ED DC CF');
        b.name(g.A, 'A', 135).name(g.B, 'B', 225).name(g.C, 'C', 315).name(g.E, 'E', 120, 12).name(g.F, 'F', 270).name(g.Q, 'A′', 80, 12); namesIn(b, g, [['D', 'ECFQ']]);
        ang(b, g, flap ? 'QDE' : 'FDC', deg(ph));
        return degQ(`직사각형 모양의 종이 ABCD를 꼭짓점 B가 꼭짓점 D에 오도록 접었더니 꼭짓점 A가 점 A′으로 옮겨졌다. 접는 선이 변 AD, BC와 만나는 점을 각각 E, F라 하자. ${flap ? '∠A′DE' : '∠FDC'} = ${ph}°일 때, ∠DEF의 크기는?`, x, {
          figure: b.svg(`직사각형 모양의 종이 ABCD를 접은 그림. ${at4} 변 AD 위에 점 E, 변 BC 위에 점 F가 있고 선분 EF가 접는 선이다. 접기 전의 변 AB와 선분 AE, 선분 BF는 점선으로 그려져 있다. 접어 옮긴 사각형 A′DFE가 색칠되어 있고 점 A′은 변 AD의 위쪽에 있다. ${flap ? '∠A′DE' : '∠FDC'} = ${ph}°`),
          explain: `${flap ? `접어 옮긴 각이므로 ∠A′DF = ∠ABF = 90°이고` : '∠EDC = 90°이므로'} ∠EDF = 90° − ${ph}° = ${90 - ph}°이다. 접은 각이므로 ∠DFE = ∠BFE이고, ${par('AD', 'BC')}이므로 ∠DEF = ∠BFE(엇각)이다. 따라서 ∠DEF = ∠DFE이고, △DEF에서 ∠DEF = (180° − ${90 - ph}°) ÷ 2 = ${x}°이다.`,
          facts: { calc: [[`(180-(90-${ph}))/2`, 0]], unseen: [180, 90, 2] }
        });
      }
      // 대각선 BD 로 접는다. 점 Q 는 점 C 가 옮겨진 자리(C′), 점 P 는 변 BA 의 연장선과 선분 DC′ 의 연장선이 만나는 점.
      const ph = d.int(28, 38), h = Math.tan(ph * RAD), P = { A: [0, h], B: [0, 0], C: [1, 0], D: [1, h] }; P.Q = pol(P.B, 1, 2 * ph); P.P = meet(P.B, P.A, P.D, P.Q);
      const g = fit(P, [175, 205]), b = boardOf(g, 'ABDQ');
      b.poly([g.B, g.D, g.Q], TINT); b.seg(g.B, g.C, 'cut').seg(g.C, g.D, 'cut'); segs(b, g, 'BA AD'); segs(b, g, 'AP QP', 'thin');
      b.name(g.A, 'A', 180).name(g.B, 'B', 225).name(g.C, 'C', 315).name(g.D, 'D', 20).name(g.Q, 'C′', 62, 13).name(g.P, 'P', 135); ang(b, g, 'DBC', deg(ph));
      return degQ(`직사각형 모양의 종이 ABCD를 대각선 BD를 접는 선으로 하여 접었더니 꼭짓점 C가 점 C′으로 옮겨졌다. 변 BA의 연장선과 선분 DC′의 연장선이 만나는 점을 P라 하자. ∠DBC = ${ph}°일 때, ∠BPD의 크기는?`, 2 * ph, {
        figure: b.svg(`직사각형 모양의 종이 ABCD를 대각선 BD로 접은 그림. ${at4} 접기 전의 변 BC와 변 CD는 점선으로 그려져 있고, 접어 옮긴 삼각형 BDC′이 색칠되어 있다. 점 C′은 변 AD의 위쪽에 있다. 변 BA를 점 A 너머로 늘인 선과 선분 DC′을 점 C′ 너머로 늘인 선이 점 P에서 만난다. ∠DBC = ${ph}°`),
        explain: `접은 각이므로 ∠DBC′ = ∠DBC = ${ph}°, ∠BC′D = ∠BCD = 90°이다. ∠ABC = 90°이므로 ∠PBC′ = 90° − 2 × ${ph}° = ${90 - 2 * ph}°이다. △PBC′에서 ∠BC′P = 90°이므로 ∠BPD = 90° − ${90 - 2 * ph}° = ${2 * ph}°이다.`,
        facts: { calc: [[`90-(90-2*${ph})`, 0]], unseen: [90, 2] }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
