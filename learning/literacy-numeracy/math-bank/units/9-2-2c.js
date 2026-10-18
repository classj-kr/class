// 중학교 3학년 2학기 2단원 삼각비의 활용 — 실력 문항(묶음 hard).
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - 둔각으로 준 각(∠ACB = 120°)을 그대로 tan 에 넣는다 — 높이를 잴 때는 그 옆의 각(180° − 120° = 60°)을 쓴다.
//  - 내려본각을 수직선에서 잰다 — 내려본각은 수평선에서 재고, 엇각으로 아래쪽 삼각형의 밑각이 된다.
//  - 입체 그림에서 지면 위의 선분과 지면에 수직인 선분이 직각을 이루는 것을 못 본다(그림에서 직각으로 보이지 않는다).
//  - tan A 의 값만 주면 넓이를 못 구한다 — 직각삼각형을 그려 sin A 를 얻는다.
//  - 끼인각이 둔각이면 sin(180° − 둔각)을 쓴다는 것을 넓이를 나누는 식에서 잊는다.
// 실력의 잣대(과제 글): ① 뜻을 정확히 대야 풀리는 함정 문제 ② 세 단계 넘게 잇는 문제. 유형마다 머리 주석에 ①·②를 적었다.
// ref: ①n = 기본꼴_1의 n번(기본 문서에 한 번 나오고 네 단계를 잇는 것), 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, C } = B.kit;
  const { V, nb, SG, rt } = B.kit.mid;
  const { RAD, at, dirOf, XY, arcTo, sv, TINT } = B.kit.mgeo;
  const {
    STD, tm, K, KR, add, sub, mul, div, sqrtV, fv, isK, SIN, COS, TAN, half, sh, L, plainV, fn, angH, segEq, seal, more,
    aRad, aSum, aFr, pickV, pic, cm, mt, polar, sqH, ground
  } = B.kit.m922;
  const UNIT = '9-2-2', AREA = 'cm²';
  const H = (id, title, ref, make, more2) => Object.assign({ id, level: '실력', title, source: (/①/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make }, more2 || {});
  const half2 = (A) => mul(A, half(1));
  const triArea = (b, c, ang) => mul(mul(mul(b, c), half(1)), SIN[ang > 90 ? 180 - ang : ang]);
  const sinOf = (ang) => (ang > 90 ? nb('sin(180° − ' + ang + '°)') : fn('sin', ang));
  // 분모가 같은 항들을 한 분수로: (√2 + √6)/4
  const shF = (A) => { const dv = A[0].dv; return A.every((t) => t.dv === dv) && dv > 1 ? frac(sh(mul(A, K(dv))), dv) : sh(A); };

  const hardTypes = [
    // ① 뜻 — 둔각으로 준 ∠ACB 의 옆의 각으로 높이를 잰다
    H('hard-obtuse-two', '둔각으로 준 각과 같은 쪽 두 지점으로 높이 구하기', '심1 ①25', (d) => {
      const [bA, cA] = d.pick([[45, 120], [30, 135]]), ex = 180 - cA, dd = 2 * d.int(3, 12);
      const h = div(K(dd), sub(div(K(1), TAN[bA]), div(K(1), TAN[ex])));
      const hv = fv(h), xH = hv / Math.tan(bA * RAD), mdl = { B: [0, 0], C: [dd, 0], H: [xH, 0], A: [xH, hv] };
      const f = pic(mdl, { segs: [['B', 'H'], ['B', 'A'], ['C', 'A']], cuts: [['A', 'H']], rights: [['H', 'B', 'A']], angs: [['B', 'C', 'A', bA + '°', { r: 14 }], ['C', 'B', 'A', cA + '°', { r: 10, d: 21 }]], sides: [['B', 'C', mt(dd), 'A']], size: bA === 45 ? [230, 230] : [250, 150] });
      return aSum(`그림과 같이 ${dd} m 떨어진 지면 위의 두 지점 B, C에서 공중에 떠 있는 풍선 A를 보았더니 ∠ABC = ${bA}°, ∠ACB = ${cA}°이었다. A에서 직선 BC에 내린 수선의 발을 H라 할 때, 풍선의 높이 ${SG('AH')}는?`, h, 'm', {
        figure: f.b.svg(`지면 위의 B, C, H(차례로 한 직선 위)와 H 위의 풍선 A. BC의 길이는 ${dd} m, ∠ABC = ${bA}°, ∠ACB = ${cA}°`),
        explain: `∠ACH = 180° − ${cA}° = ${ex}°이다. ${SG('AH')} = ${V('h')}라 하면 ${SG('BH')} = ${frac(V('h'), fn('tan', bA))}, ${SG('CH')} = ${frac(V('h'), fn('tan', ex))}이고 ${SG('BH')} − ${SG('CH')} = ${dd}이다. 이를 풀면 ${V('h')} = ${L(h, 'm')}이다.`
      });
    }),
    // ② 네 단계 — 내려본각(엇각) → 두 거리 → 차 → 1분 동안의 거리
    H('hard-boat-speed', '두 번 잰 내려본각으로 배가 1분 동안 움직인 거리', '심2', (d) => {
      const z = d.until(() => ({ hh: 3 * d.int(5, 40), tt: d.int(2, 9) }), ({ hh, tt }) => (2 * hh / 3) % tt === 0 && 2 * hh / 3 / tt > 1);
      const near = div(K(z.hh), TAN[60]), far = div(K(z.hh), TAN[30]), gap = sub(far, near), sp = div(gap, K(z.tt));
      const mdl = { A: [0, z.hh], B: [0, 0], D: [fv(near), 0], C: [fv(far), 0], R: [fv(far) * 0.8, z.hh] };
      const f = pic(mdl, { segs: [['A', 'B'], ['B', 'C'], ['A', 'D'], ['A', 'C']], cuts: [['A', 'R']], rights: [['B', 'A', 'D']], sides: [['A', 'B', mt(z.hh), 'D']], names: ['A', 'B', 'C', 'D'], size: [220, 110],
        after: (b, P) => { const aD = dirOf(P.A, P.D), aC = dirOf(P.A, P.C); b.angle(P.A, aD, 0, '', { r: 22 }); b.text(at(P.A, 40, (aD + aC) / 2), '60°', { blue: true }); b.angle(P.A, aC, 0, '30°', { r: 56 }); } });
      return aRad(`높이가 ${z.hh} m인 언덕 위의 A 지점에서 바다 위의 배를 내려본각의 크기가 60°였다. 배가 언덕에서 멀어지는 쪽으로 똑바로 움직여 ${z.tt}분 뒤에 다시 내려본각의 크기를 재었더니 30°였다. 배가 일정한 빠르기로 움직였을 때, 1분 동안 움직인 거리는?`, sp, 'm', {
        figure: f.b.svg(`언덕 AB(높이 ${z.hh} m)와 바다 위의 두 점 D, C. A에서 수평선(점선) 아래로 D를 내려본각 60°, C를 내려본각 30°`),
        explain: `내려본각은 엇각이므로 ∠ADB = 60°, ∠ACB = 30°이다. ${SG('BD')} = ${frac(z.hh, fn('tan', 60))} = ${sh(near)}, ${SG('BC')} = ${frac(z.hh, fn('tan', 30))} = ${sh(far)}이므로 ${z.tt}분 동안 ${sh(gap)} m를 움직였고, 1분 동안 ${sh(gap)} ÷ ${z.tt} = ${L(sp, 'm')}를 움직였다.`
      });
    }),
    // ② 다섯 단계 — 경사로의 수평·수직 조각 → 수평 거리 → 높이 → 빼기
    H('hard-slope-sign', '평지와 오르막을 지나 잰 광고탑의 높이', '심3', (d) => {
      const k = 2 * d.int(1, 5), a = d.int(k + 2, 2 * k + 2), DE = KR(k, 3), DB = mul(DE, COS[30]), BE = mul(DE, SIN[30]), AB = add(K(a), DB), BC = mul(AB, TAN[60]), CE = sub(BC, BE);
      const mdl = { A: [0, 0], D: [a, 0], B: [fv(AB), 0], E: [fv(AB), fv(BE)], C: [fv(AB), fv(BC)] };
      const f = pic(mdl, { segs: [['A', 'B'], ['D', 'E'], ['E', 'C'], ['A', 'C']], cuts: [['B', 'E']], rights: [['B', 'A', 'E']], angs: [['A', 'D', 'C', '60°']], sides: [['A', 'D', mt(a), 'C'], ['D', 'E', [k, 3, 'm'], 'B']], nameAt: { E: 0, D: 115 }, size: [240, 230] });
      return aRad(`그림과 같이 A 지점에서 ${a} m 떨어진 D 지점부터 길이가 ${sh(DE)} m이고 지면과 30°를 이루는 오르막길 DE가 있고, E 지점에 광고탑 CE가 지면에 수직으로 서 있다. A 지점에서 광고탑의 꼭대기 C를 올려본각의 크기가 60°일 때, 광고탑의 높이 ${SG('CE')}는? (단, 점 B는 직선 AD와 직선 CE가 만나는 점이다.)`, CE, 'm', {
        figure: f.b.svg(`지면 위의 A, D, B와 오르막 DE, B 위로 E와 C. AD의 길이는 ${a} m, DE의 길이는 ${plainV(DE)} m, ∠CAB = 60°`),
        explain: `${SG('DB')} = ${sh(DE)} ${fn('cos', 30)} = ${sh(DB)}, ${SG('BE')} = ${sh(DE)} ${fn('sin', 30)} = ${sh(BE)}이다. ${SG('AB')} = ${a} + ${sh(DB)} = ${sh(AB)}이므로 ${SG('BC')} = ${sh(AB)} ${fn('tan', 60)} = ${sh(BC)}이고, ${SG('CE')} = ${sh(BC)} − ${sh(BE)} = ${L(CE, 'm')}이다.`
      });
    }),
    // ① 뜻 + ② 네 단계 — 지면 위의 직각삼각형 둘, 지면에 수직인 높이
    H('hard-3d-two', '지면 위의 삼각형과 올려본각으로 건물의 높이 구하기(입체)', '심4', (d) => {
      const [bA, hA, el] = d.pick([[60, 45, 60], [60, 45, 30]]), dd = 2 * d.int(10, 40);
      const AQ = mul(K(dd), SIN[bA]), AH = div(AQ, SIN[hA]), PH = mul(AH, TAN[el]);
      if (!isK(PH)) throw new Error('높이가 k√m 꼴이 아니다');
      const bq = dd * Math.cos(bA * RAD), aq = fv(AQ), qh = aq / Math.tan(hA * RAD), sk = ground(-30, el === 60 ? 0.35 : 0.6);
      const mdl = { B: sk(0, 0), Q: sk(bq, 0), H: sk(bq + qh, 0), A: sk(bq, -aq), P: sk(bq + qh, 0, fv(PH)) };
      const f = pic(mdl, { polys: [['A', 'B', 'H']], segs: [['H', 'P'], ['A', 'P']], cuts: [['A', 'Q']], angs: [['B', 'H', 'A', bA + '°'], ['H', 'A', 'B', hA + '°'], ['A', 'H', 'P', el + '°']], sides: [['A', 'B', mt(dd), 'H']], size: [210, 150] });
      return aRad(`그림에서 세 점 A, B, H는 지면 위에 있고 건물 ${SG('PH')}는 지면에 수직이다. ${segEq('AB', K(dd), 'm')}, ∠ABH = ${bA}°, ∠AHB = ${hA}°이고, A 지점에서 건물의 꼭대기 P를 올려본각의 크기가 ${el}°일 때, 건물의 높이 ${SG('PH')}는? (단, 눈높이는 생각하지 않는다.)`, PH, 'm', {
        figure: f.b.svg(`지면 위의 △ABH와 H에 수직으로 선 건물 PH. AB의 길이는 ${dd} m, ∠ABH = ${bA}°, ∠AHB = ${hA}°, ∠PAH = ${el}°`),
        explain: `A에서 BH에 수선 AQ를 그으면 ${SG('AQ')} = ${dd} ${fn('sin', bA)} = ${sh(AQ)}이고, 직각삼각형 AQH에서 ${SG('AH')} = ${frac(SG('AQ'), fn('sin', hA))} = ${sh(AH)}이다. ${SG('PH')}는 지면에 수직이므로 ∠AHP = 90°이고 ${SG('PH')} = ${sh(AH)} ${fn('tan', el)} = ${L(PH, 'm')}이다.`
      });
    }),
    // ② 여섯 단계 — tan 75° 로 식을 세워 EC → BC → CD → AD
    H('hard-tan75', 'tan 75°의 값으로 이어 붙인 직각삼각형의 변 구하기', '심8', (d) => {
      const m = d.int(1, 4), be = 6 * m;
      const t75 = add(K(2), KR(1, 3)), EC = div(K(be), sub(t75, K(1))), BC = add(K(be), EC), CD = mul(BC, TAN[30]), AD = sub(BC, CD);
      if (!isK(AD) || fv(EC) <= 0) throw new Error('AD 가 k√m 꼴이 아니다');
      const mdl = { C: [0, 0], B: [-fv(BC), 0], E: [-fv(EC), 0], A: [0, fv(BC)], D: [0, fv(CD)] };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['A', 'E'], ['B', 'D']], rights: [['C', 'B', 'A']], angs: [['B', 'C', 'D', '30°', { r: 22 }], ['E', 'C', 'A', '75°']], sides: [['B', 'E', cm(be), 'A', { gap: 4 }]], size: [180, 160],
        after: (b, P) => { const aA = dirOf(P.B, P.A); b.angle(P.B, 0, aA, '', { r: 44 }); b.text(at(P.B, 54, aA + 13), '45°', { blue: true }); } });
      return aRad(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 점 D는 ${SG('AC')} 위에, 점 E는 ${SG('BC')} 위에 있다. ∠ABC = 45°, ∠DBC = 30°, ∠AEC = 75°이고 ${segEq('BE', K(be), 'cm')}일 때, ${SG('AD')}의 길이는? (단, ${nb('tan 75° = 2 + ' + rt(3))}으로 계산한다.)`, AD, 'cm', {
        figure: f.b.svg(`∠C = 90°인 직각삼각형 ABC, AC 위의 D, BC 위의 E, 선분 AE와 BD. BE의 길이는 ${be} cm, ∠ABC = 45°, ∠DBC = 30°, ∠AEC = 75°`),
        explain: `${SG('EC')} = ${V('x')}라 하면 ∠ABC = 45°이므로 ${SG('AC')} = ${SG('BC')} = ${be} + ${V('x')}이고, ${fn('tan', 75)} = ${frac(be + ' + ' + V('x'), V('x'))} = 2 + ${rt(3)}에서 ${V('x')} = ${sh(EC)}이다. ${SG('BC')} = ${sh(BC)}이므로 ${SG('CD')} = (${sh(BC)}) ${fn('tan', 30)} = ${sh(CD)}이고 ${SG('AD')} = ${SG('AC')} − ${SG('CD')} = ${L(AD, 'cm')}이다.`
      });
    }),
    // ② 보조선 둘 — 꼭지각 30° 인 이등변삼각형을 45°·60° 조각으로 가른다
    H('hard-iso30', '꼭지각이 30°인 이등변삼각형의 빗변 구하기', '심9', (d) => {
      const p = d.int(2, 8), base = KR(p, 2), BE = mul(base, COS[45]), DE = mul(base, SIN[45]), AE = mul(DE, TAN[60]), AB = add(BE, AE);
      const ab = fv(AB), mdl = { A: [0, ab * Math.cos(15 * RAD)], B: [-ab * Math.sin(15 * RAD), 0], C: [ab * Math.sin(15 * RAD), 0] };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], ticks: [['A', 'B', 1], ['A', 'C', 1]], angs: [['A', 'B', 'C', '30°', { r: 30 }]], sides: [['B', 'C', [p, 2, 'cm'], 'A']], size: [120, 170] });
      return aSum(`그림과 같이 꼭지각의 크기가 30°이고 밑변의 길이가 ${L(base, 'cm')}인 이등변삼각형 ABC에서 ${SG('AB')}의 길이는?`, AB, 'cm', {
        figure: f.b.svg(`AB = AC인 이등변삼각형 ABC. ∠A = 30°, BC의 길이는 ${plainV(base)} cm`),
        explain: `밑각은 (180° − 30°) ÷ 2 = 75°이다. ${SG('AC')} 위에 ${nb(SG('BD') + ' = ' + SG('BC'))}인 점 D를 잡으면 ∠BDC = 75°, ∠ABD = 75° − 30° = 45°이다. D에서 AB에 수선 DE를 그으면 ${SG('BE')} = ${SG('DE')} = ${sh(base)} ${fn('cos', 45)} = ${sh(BE)}이고, ∠ADE = 60°이므로 ${SG('AE')} = ${sh(DE)} ${fn('tan', 60)} = ${sh(AE)}이다. 따라서 ${SG('AB')} = ${L(AB, 'cm')}이다.`
      });
    }),
    // ② 네 단계 — 정삼각형에 내접하는 정사각형
    H('hard-inscribed-square', '정삼각형에 내접하는 정사각형의 한 변', '심10', (d) => {
      const s = d.int(2, 12), x = div(mul(K(s), TAN[60]), add(K(2), TAN[60]));
      const xv = fv(x), mdl = { B: [0, 0], C: [s, 0], A: [s / 2, s * Math.sqrt(3) / 2], D: [(s - xv) / 2, 0], E: [(s + xv) / 2, 0], F: [(s + xv) / 2, xv], G: [(s - xv) / 2, xv] };
      const f = pic(mdl, { polys: [['A', 'B', 'C'], ['D', 'E', 'F', 'G']], fills: [null, TINT], sides: [['B', 'C', cm(s), 'A', { gap: 14 }]], names: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], size: [180, 150] });
      return aSum(`그림과 같이 한 변의 길이가 ${s} cm인 정삼각형 ABC에 정사각형 DEFG가 내접하고 있다(D, E는 ${SG('BC')} 위, F는 ${SG('AC')} 위, G는 ${SG('AB')} 위). 정사각형의 한 변의 길이는?`, x, 'cm', {
        figure: f.b.svg(`한 변이 ${s} cm인 정삼각형 ABC와 그 안의 정사각형 DEFG(D, E는 BC 위, F는 AC 위, G는 AB 위)`),
        explain: `정사각형의 한 변을 ${V('x')}라 하면 ${SG('BD')} = ${frac(s + ' − ' + V('x'), 2)}이고 ∠B = 60°이므로 ${fn('tan', 60)} = ${frac(SG('DG'), SG('BD'))}, 곧 ${rt(3)} × ${frac(s + ' − ' + V('x'), 2)} = ${V('x')}이다. 이를 풀면 ${V('x')} = ${L(x, 'cm')}이다.`
      });
    }),
    // ② 여섯 단계 — 그림의 조각을 차례로 따라가 sin 75°·cos 75°
    H('hard-sin75', '그림의 조각으로 sin 75°·cos 75°의 값 구하기', '심11', (d) => {
      const k = d.int(1, 3), be = 4 * k, ask = d.pick(['sin', 'cos']);
      const AB = div(K(be), SIN[30]), AE = mul(AB, COS[30]), AD = mul(AE, COS[45]), EF = mul(K(be), SIN[45]), BC = add(EF, AD), AC = sub(AD, EF);
      const want = div(ask === 'sin' ? BC : AC, AB);
      const pool = [div(add(KR(1, 2), KR(1, 6)), K(4)), div(sub(KR(1, 6), KR(1, 2)), K(4)), div(add(KR(1, 2), KR(1, 6)), K(2)), div(add(K(1), KR(1, 3)), K(4)), div(add(KR(1, 3), KR(1, 6)), K(4)), div(add(KR(2, 2), KR(1, 6)), K(4))];
      const mdl = { C: [0, 0], A: [0, fv(AC)], B: [fv(BC), 0], F: [fv(AD), 0], E: [fv(AD), -fv(EF)], D: [0, -fv(EF)] };
      const f = pic(mdl, { polys: [['A', 'B', 'C'], ['C', 'D', 'E', 'F']], segs: [['A', 'D'], ['A', 'E'], ['B', 'E']], rights: [['C', 'A', 'B'], ['E', 'A', 'B']], angs: [['A', 'B', 'E', '30°', { r: 24 }]], sides: [['B', 'E', cm(be), 'A']], size: [190, 160] });
      return pickV(d, `그림에서 ∠ACB = 90°, ∠BAE = 30°, ∠AEB = 90°, ${nb(SG('AD') + ' = ' + SG('DE'))}이고 □CDEF는 직사각형이다(D는 직선 AC 위, F는 ${SG('BC')} 위). ${segEq('BE', K(be), 'cm')}일 때, ${fn(ask, 75)}의 값은?`, want, pool, {
        show: shF,
        figure: f.b.svg(`∠C = 90°인 직각삼각형 ABC와 BC 아래쪽의 점 E, 직사각형 CDEF. ∠BAE = 30°, ∠AEB = 90°, AD = DE, BE의 길이는 ${be} cm`),
        explain: `${SG('AB')} = ${frac(be, fn('sin', 30))} = ${sh(AB)}, ${SG('AE')} = ${sh(AB)} ${fn('cos', 30)} = ${sh(AE)}이다. △ADE는 직각이등변삼각형이므로 ${SG('AD')} = ${SG('DE')} = ${sh(AD)}이다. ∠BAC = 30° + 45° = 75°, ∠ABC = 15°이므로 ∠EBF = 60° − 15° = 45°이고 ${SG('EF')} = ${SG('BF')} = ${sh(EF)}이다. ${SG('BC')} = ${sh(BC)}, ${SG('AC')} = ${SG('AD')} − ${SG('CD')} = ${sh(AC)}이므로 ${fn(ask, 75)} = ${shF(want)}이다.`
      });
    }),
    // ① 뜻 — tan A 로 직각삼각형을 그려 sin A
    H('hard-tan-area', 'tan A의 값으로 삼각형의 넓이 구하기', '심14', (d) => {
      const [p, q] = d.pick([[2, 1], [3, 1], [1, 2], [1, 3]]), Nn = p * p + q * q;
      const [b, c] = d.until(() => [d.int(2, 15), d.int(2, 15)], ([x, y]) => x !== y && (x * y * p) % (2 * Nn) === 0 && Math.max(x, y) / Math.min(x, y) < 2.6);
      const sinA = div(K(p), sqrtV(K(Nn))), S = mul(mul(mul(K(b), K(c)), half(1)), sinA);
      const A0 = Math.atan2(p, q) / RAD, mdl = { A: [0, 0], B: [b, 0], C: polar([0, 0], c, A0) };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], sides: [['A', 'B', cm(b), 'C'], ['A', 'C', cm(c), 'B']], size: [200, 120] });
      const tanH = nb('tan A = ' + (q === 1 ? String(p) : frac(p, q)));
      return aRad(`그림과 같이 ${segEq('AB', K(b), 'cm')}, ${segEq('AC', K(c), 'cm')}이고 ${tanH}인 △ABC의 넓이는? (단, ∠A는 예각이다.)`, S, AREA, {
        figure: f.b.svg(`△ABC. AB의 길이는 ${b} cm, AC의 길이는 ${c} cm`),
        explain: `${tanH}이므로 밑변이 ${q}, 높이가 ${p}인 직각삼각형을 그리면 빗변은 ${rt(Nn)}이고 sin A = ${sh(sinA)}이다. △ABC = ${frac(1, 2)} × ${b} × ${c} × ${sh(sinA)} = ${L(S, AREA)}이다.`
      });
    }),
    // ② 네·다섯 단계 — 정사각형에서 세 삼각형을 빼 넓이를 구하고 ½ab sin x 로 거꾸로
    H('hard-square-mid', '정사각형 두 변의 중점으로 만든 각의 삼각비', '심16 심17', (d, n) => {
      const s = 2 * d.int(2, 8), hS = s / 2;
      const S = sub(sub(K(s * s), mul(K(2), half2(mul(K(s), K(hS))))), half2(mul(K(hS), K(hS))));   // △MBN
      const BM2 = add(mul(K(s), K(s)), mul(K(hS), K(hS))), sinX = div(mul(K(2), S), BM2);
      const ans = n === 1 ? sqrtV(sub(K(1), mul(sinX, sinX))) : sinX;
      const mdl = { A: [0, s], B: [0, 0], C: [s, 0], D: [s, s], M: [hS, s], N: [s, hS] };
      const f = pic(mdl, { polys: [['A', 'B', 'C', 'D']], segs: [['B', 'M'], ['B', 'N'], ['M', 'N']], ticks: [['A', 'M', 1], ['M', 'D', 1], ['D', 'N', 2], ['N', 'C', 2]], angs: [['B', 'N', 'M', sv('x') + '°', { r: 30 }]], sides: [['B', 'C', cm(s), 'A']], size: [150, 150] });
      const fn2 = n === 1 ? 'cos' : 'sin';
      return aFr(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형 ABCD에서 두 점 M, N은 각각 ${SG('AD')}, ${SG('CD')}의 중점이다. ∠MBN = ${V('x')}°일 때, ${nb(fn2 + ' ' + V('x') + '°')}의 값은?`, ans, '', {
        figure: f.b.svg(`한 변이 ${s} cm인 정사각형 ABCD와 AD의 중점 M, CD의 중점 N, 선분 BM, BN, MN. ∠MBN = x°`),
        explain: `△MBN = ${s * s} − 2 × ${frac(1, 2)} × ${s} × ${hS} − ${frac(1, 2)} × ${hS} × ${hS} = ${sh(S)}이고 ${nb(sqH(SG('BM')) + ' = ' + sqH(SG('BN')))} = ${sh(BM2)}이다. ${frac(1, 2)} × ${SG('BM')} × ${SG('BN')} × ${nb('sin ' + V('x') + '°')} = ${sh(S)}이므로 ${nb('sin ' + V('x') + '°')} = ${sh(sinX)}이다.` + (n === 1 ? ` 빗변이 5, 높이가 3인 직각삼각형을 그리면 밑변은 4이므로 ${nb('cos ' + V('x') + '°')} = ${sh(ans)}이다.` : '')
      });
    }, { count: 2 }),
    // ① 뜻 — 넓이를 나누는 식에서 둔각의 sin(180° − θ)
    H('hard-split-angle', '넓이의 합으로 각을 나누는 선분의 길이 구하기', '심18', (d) => {
      const [a, q] = d.until(() => [2 * d.int(2, 8), d.int(1, 6)], ([x, y]) => (x * y) % (x + 3 * y) === 0 && x / (y * Math.sqrt(3)) < 2.6 && y * Math.sqrt(3) / x < 2.6);
      const BC = KR(q, 3), BD = div(mul(K(a), BC), add(K(a), mul(BC, KR(1, 3))));
      if (!isK(BD)) throw new Error('BD 가 k√m 꼴이 아니다');
      const mdl = { B: [0, 0], A: polar([0, 0], a, 150), C: [fv(BC), 0] };
      // D 는 BD 가 BA 와 30° 를 이루는 직선과 AC 의 교점
      const dirD = polar([0, 0], 1, 120), Ax = mdl.A, Cx = mdl.C, den = dirD[0] * (Cx[1] - Ax[1]) - dirD[1] * (Cx[0] - Ax[0]), tt = (Ax[0] * (Cx[1] - Ax[1]) - Ax[1] * (Cx[0] - Ax[0])) / den;
      mdl.D = [dirD[0] * tt, dirD[1] * tt];
      const f = pic(mdl, { polys: [['A', 'B', 'C']], segs: [['B', 'D']], angs: [['B', 'D', 'A', '30°', { r: 26 }], ['B', 'C', 'D', '120°', { r: 14 }]], sides: [['A', 'B', cm(a), 'C'], ['B', 'C', [q, 3, 'cm'], 'A']], nameAt: { D: 60 }, size: [230, 115] });
      return aRad(`그림의 △ABC에서 점 D는 ${SG('AC')} 위에 있고 ∠ABD = 30°, ∠DBC = 120°이다. ${segEq('AB', K(a), 'cm')}, ${segEq('BC', BC, 'cm')}일 때, ${SG('BD')}의 길이는?`, BD, 'cm', {
        figure: f.b.svg(`△ABC와 AC 위의 점 D, 선분 BD. AB의 길이는 ${a} cm, BC의 길이는 ${plainV(BC)} cm, ∠ABD = 30°, ∠DBC = 120°`),
        explain: `△ABC = △ABD + △DBC이고 ∠ABC = 150°이다. ${frac(1, 2)} × ${a} × ${sh(BC)} × ${sinOf(150)} = ${frac(1, 2)} × ${a} × ${SG('BD')} × ${fn('sin', 30)} + ${frac(1, 2)} × ${SG('BD')} × ${sh(BC)} × ${sinOf(120)}에서 ${sh(mul(half2(mul(K(a), BC)), SIN[30]))} = (${sh(mul(half2(K(a)), SIN[30]))} + ${sh(mul(half2(BC), SIN[60]))}) × ${SG('BD')}이므로 ${SG('BD')} = ${L(BD, 'cm')}이다.`
      });
    }),
    // ② 요령 — 넓이가 같은 세 삼각형의 등식 둘을 비로
    H('hard-ratio', '넓이가 같은 세 삼각형으로 세 선분의 길이의 비 구하기', '심23', (d) => {
      const angs = d.shuffle([30, 45, 60]);   // (a, b), (a, c), (b, c) 의 끼인각
      // ab sin θ1 = ac sin θ2 = bc sin θ3 → a : b : c = sin θ3 : sin θ2 : sin θ1
      const vals = [SIN[angs[2]], SIN[angs[1]], SIN[angs[0]]].map((x) => mul(x, K(2)));   // 1, √2, √3
      const txt = (list) => nb(list.map((x) => sh(x)).join(' : '));
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], base = [K(1), KR(1, 2), KR(1, 3)];
      const right = txt(vals), opts = perms.map((pm) => txt(pm.map((i) => base[i]))), others = d.shuffle(opts.filter((o) => o !== right)).slice(0, 4);
      const rows = d.shuffle([right].concat(others)), answer = rows.indexOf(right);
      const tri = (x0, lab1, lab2, ang) => { const p0 = [x0, 0], p1 = [x0 + 1.5, 0], p2 = polar(p0, 1.15, ang); return { p0, p1, p2, lab1, lab2, ang }; };
      const ts = [tri(0, 'a', 'b', angs[0]), tri(2.1, 'a', 'c', angs[1]), tri(4.2, 'b', 'c', angs[2])], mdl = {};
      ts.forEach((t, i) => { mdl['p' + i + '0'] = t.p0; mdl['p' + i + '1'] = t.p1; mdl['p' + i + '2'] = t.p2; });
      const f = pic(mdl, { polys: [['p00', 'p01', 'p02'], ['p10', 'p11', 'p12'], ['p20', 'p21', 'p22']], angs: ts.map((t, i) => ['p' + i + '0', 'p' + i + '1', 'p' + i + '2', t.ang + '°', { r: 13 }]), sides: ts.flatMap((t, i) => [['p' + i + '0', 'p' + i + '1', sv(t.lab1), 'p' + i + '2'], ['p' + i + '0', 'p' + i + '2', sv(t.lab2), 'p' + i + '1']]), names: [], size: [270, 72] });
      return seal(C(`길이가 ${V('a')}, ${V('b')}, ${V('c')}인 세 선분 가운데 두 개씩 골라 그림과 같이 세 삼각형을 만들었더니 세 삼각형의 넓이가 모두 같았다. ${V('a')} : ${V('b')} : ${V('c')}는?`, rows, answer, more({
        figure: f.b.svg(`세 삼각형: 두 변 a, b와 끼인각 ${angs[0]}°, 두 변 a, c와 끼인각 ${angs[1]}°, 두 변 b, c와 끼인각 ${angs[2]}°`),
        explain: `${frac(1, 2)}${V('a')}${V('b')} ${fn('sin', angs[0])} = ${frac(1, 2)}${V('a')}${V('c')} ${fn('sin', angs[1])} = ${frac(1, 2)}${V('b')}${V('c')} ${fn('sin', angs[2])}의 각 변을 ${frac(1, 2)}${V('a')}${V('b')}${V('c')}로 나누면 ${frac(fn('sin', angs[0]), V('c'))} = ${frac(fn('sin', angs[1]), V('b'))} = ${frac(fn('sin', angs[2]), V('a'))}이다. 따라서 ${V('a')} : ${V('b')} : ${V('c')} = ${fn('sin', angs[2])} : ${fn('sin', angs[1])} : ${fn('sin', angs[0])} = ${right}이다.`
      }, { truth: rows.map((r) => r === right), want: true })));
    }),
    // ① 뜻 — RHS 합동으로 30° 를 반으로 나눈다
    H('hard-rotated-square', '돌린 정사각형과 겹쳐진 부분의 넓이', '심25', (d) => {
      const s = 3 * d.int(1, 4), EH = mul(K(s), TAN[30]), S = mul(K(s), EH);
      const A = [0, s], Bp = [0, 0], Cp = [s, 0], Dp = [s, s], E = polar(A, s, -60), F = [E[0] + s * Math.cos(30 * RAD), E[1] + s * Math.sin(30 * RAD)], G = polar(A, s, 30), Hh = [s, s - fv(EH)];
      const f = pic({ A, B: Bp, C: Cp, D: Dp, E, F, G, H: Hh }, { polys: [['A', 'B', 'C', 'D'], ['A', 'E', 'F', 'G']], draw: (b, P) => b.poly([P.A, P.E, P.H, P.D], TINT), angs: [['A', 'B', 'E', '30°', { r: 26 }]], sides: [['A', 'B', cm(s), 'C']], nameAt: { H: 330, E: 200, D: 75 }, size: [170, 170] });
      return aRad(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형 ABCD를 점 A를 중심으로 30°만큼 돌렸더니 정사각형 AEFG가 되었다. ${SG('CD')}와 ${SG('EF')}의 교점을 H라 할 때, 겹쳐진 부분 □AEHD의 넓이는?`, S, AREA, {
        figure: f.b.svg(`정사각형 ABCD와 A를 중심으로 30° 돌린 정사각형 AEFG, CD와 EF의 교점 H, 색칠한 □AEHD. 한 변 ${s} cm, ∠BAE = 30°`),
        explain: `${SG('AH')}를 그으면 ${nb(SG('AE') + ' = ' + SG('AD'))}, ∠AEH = ∠ADH = 90°이고 ${SG('AH')}는 공통이므로 △AEH ≡ △ADH(RHS 합동)이다. ∠EAD = 90° − 30° = 60°이므로 ∠EAH = 30°이고 ${SG('EH')} = ${s} ${fn('tan', 30)} = ${sh(EH)}이다. □AEHD = 2 × △AEH = 2 × ${frac(1, 2)} × ${s} × ${sh(EH)} = ${L(S, AREA)}이다.`
      });
    }),
    // ① 뜻 + ② — 평행사변형의 네 내각의 이등분선이 만드는 직사각형
    H('hard-bisector-rect', '평행사변형의 내각의 이등분선이 만드는 사각형의 넓이', '심26', (d) => {
      const [a, b] = d.until(() => [d.int(3, 10), d.int(5, 14)], ([x, y]) => y - x >= 4 && (y - x) % 2 === 0 && y < 2 * x);   // AD < 2AB 여야 □PQRS 가 평행사변형 안에 든다
      const PS = mul(K(b - a), COS[30]), PQ = mul(K(b - a), COS[60]), S = mul(PS, PQ);
      // ∠A = 120°, ∠B = 60° 인 평행사변형 ABCD(AB = a, AD = b)
      const Bp = [0, 0], A = polar(Bp, a, 60), Cp = [b, 0], Dp = [A[0] + b, A[1]];
      const ray = (p, ang) => [p, polar(p, 1, ang)], meet2 = (l1, l2) => { const [p, p2] = l1, [r, r2] = l2, u = [p2[0] - p[0], p2[1] - p[1]], w = [r2[0] - r[0], r2[1] - r[1]], t = ((r[0] - p[0]) * w[1] - (r[1] - p[1]) * w[0]) / (u[0] * w[1] - u[1] * w[0]); return [p[0] + u[0] * t, p[1] + u[1] * t]; };
      const bA = ray(A, -60), bB = ray(Bp, 30), bC = ray(Cp, 120), bD = ray(Dp, 210);
      const P = meet2(bA, bB), Q = meet2(bA, bD), R = meet2(bC, bD), Sx = meet2(bB, bC);
      const f = pic({ A, B: Bp, C: Cp, D: Dp, P, Q, R, S: Sx }, { polys: [['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S']], fills: [null, TINT], thins: [['A', 'P'], ['B', 'S'], ['C', 'S'], ['D', 'Q']], sides: [['A', 'B', cm(a), 'C'], ['A', 'D', cm(b), 'B', { t: 0.22 }]], size: [220, 110] });
      return aRad(`그림과 같이 ${segEq('AB', K(a), 'cm')}, ${segEq('AD', K(b), 'cm')}인 평행사변형 ABCD에서 이웃하는 두 내각의 크기의 비가 2 : 1이다. 네 내각의 이등분선이 만나서 생기는 □PQRS의 넓이는?`, S, AREA, {
        figure: f.b.svg(`평행사변형 ABCD와 네 내각의 이등분선이 만나 생긴 □PQRS(색칠). AB의 길이는 ${a} cm, AD의 길이는 ${b} cm`),
        explain: `∠A = 120°, ∠B = 60°이다. 이웃한 두 내각의 이등분선은 (120° + 60°) ÷ 2 = 90°로 만나므로 □PQRS는 직사각형이다. ${SG('BS')} = ${b} ${fn('cos', 30)}, ${SG('BP')} = ${a} ${fn('cos', 30)}이므로 ${SG('PS')} = ${b - a} ${fn('cos', 30)} = ${sh(PS)}이고, 같은 방법으로 ${SG('PQ')} = ${b - a} ${fn('cos', 60)} = ${sh(PQ)}이다. 넓이는 ${sh(PS)} × ${sh(PQ)} = ${L(S, AREA)}이다.`
      });
    }),
    // ② 네 단계 — 두 각과 한 변 → 수선 → 두 조각 → 넓이
    H('hard-aas-area', '두 각과 한 변으로 삼각형의 넓이 구하기', '①32 심15', (d) => {
      const k = 2 * d.int(1, 5), AB = K(2 * k);
      // ∠A = 60°, ∠C = 45°: B 에서 AC 에 수선 BH
      const AH = mul(AB, COS[60]), BH = mul(AB, SIN[60]), CH = BH, AC = add(AH, CH), S = half2(mul(AC, BH));
      const mdl = { A: [0, 0], C: [fv(AC), 0], B: polar([0, 0], 2 * k, 60) };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], angs: [['A', 'C', 'B', '60°'], ['C', 'B', 'A', '45°']], sides: [['A', 'B', cm(2 * k), 'C']], size: [200, 120] });
      return aSum(`그림과 같이 ${angH('A', 60)}, ${angH('C', 45)}, ${segEq('AB', AB, 'cm')}인 △ABC의 넓이는?`, S, AREA, {
        figure: f.b.svg(`△ABC. ∠A = 60°, ∠C = 45°, AB의 길이는 ${2 * k} cm`),
        explain: `꼭짓점 B에서 ${SG('AC')}에 수선 BH를 그으면 ${SG('AH')} = ${2 * k} ${fn('cos', 60)} = ${sh(AH)}, ${SG('BH')} = ${2 * k} ${fn('sin', 60)} = ${sh(BH)}이고 ∠C = 45°이므로 ${SG('CH')} = ${SG('BH')} = ${sh(CH)}이다. ${SG('AC')} = ${sh(AC)}이므로 △ABC = ${frac(1, 2)} × (${sh(AC)}) × ${sh(BH)} = ${L(S, AREA)}이다.`
      });
    }),
    // ② 네 단계 — 같은 쪽 두 각으로 높이 → 넓이
    H('hard-same-side-area', '같은 쪽 두 각으로 높이를 구해 넓이 구하기', '①33', (d) => {
      const [bA, ex] = d.pick([[45, 60], [30, 45]]), dd = 2 * d.int(1, 6);
      const h = div(K(dd), sub(div(K(1), TAN[bA]), div(K(1), TAN[ex]))), S = half2(mul(K(dd), h));
      const hv = fv(h), xD = hv / Math.tan(bA * RAD), mdl = { B: [0, 0], C: [dd, 0], D: [xD, 0], A: [xD, hv] };
      const f = pic(mdl, { polys: [['A', 'B', 'C']], cuts: [['C', 'D'], ['A', 'D']], rights: [['D', 'B', 'A']], angs: [['B', 'C', 'A', bA + '°'], ['C', 'D', 'A', ex + '°']], sides: [['B', 'C', cm(dd), 'A', { t: 0.4 }]], size: [210, 120] });
      return aSum(`그림과 같이 △ABC의 꼭짓점 A에서 ${SG('BC')}의 연장선에 내린 수선의 발을 D라 하자. ${segEq('BC', K(dd), 'cm')}, ∠ABC = ${bA}°, ∠ACD = ${ex}°일 때, △ABC의 넓이는?`, S, AREA, {
        figure: f.b.svg(`△ABC와 BC의 연장선 위의 점 D(A에서 내린 수선의 발). BC의 길이는 ${dd} cm, ∠ABC = ${bA}°, ∠ACD = ${ex}°`),
        explain: `${SG('AD')} = ${V('h')}라 하면 ${SG('BD')} = ${frac(V('h'), fn('tan', bA))}, ${SG('CD')} = ${frac(V('h'), fn('tan', ex))}이고 ${SG('BD')} − ${SG('CD')} = ${dd}이므로 ${V('h')} = ${sh(h)}이다. △ABC = ${frac(1, 2)} × ${dd} × (${sh(h)}) = ${L(S, AREA)}이다.`
      });
    }),
    // ② 네 단계 — 평행사변형에서 세 삼각형을 뺀다
    H('hard-para-minus', '평행사변형에서 세 삼각형을 빼어 넓이 구하기', '①46', (d) => {
      const [a, b] = d.until(() => [2 * d.int(3, 8), 2 * d.int(2, 6)], ([x, y]) => x !== y && (3 * x * y) % 16 === 0 && x / y < 2.6 && y / x < 2.6);
      const P0 = mul(mul(K(a), K(b)), SIN[60]), S1 = mul(P0, [tm(1, 1, 4, '1', '4')]), S2 = mul(P0, [tm(1, 1, 8, '1', '8')]), S = sub(P0, add(add(S1, S2), S1));
      const Bp = [0, 0], A = polar(Bp, b, 60), Cp = [a, 0], Dp = [A[0] + a, A[1]], M = [a / 2, 0], Nn = [(Cp[0] + Dp[0]) / 2, (Cp[1] + Dp[1]) / 2];
      const f = pic({ A, B: Bp, C: Cp, D: Dp, M, N: Nn }, { polys: [['A', 'B', 'C', 'D'], ['A', 'M', 'N']], fills: [null, TINT], ticks: [['B', 'M', 1], ['M', 'C', 1], ['C', 'N', 2], ['N', 'D', 2]], angs: [['B', 'C', 'A', '60°']], sides: [['B', 'C', cm(a), 'A', { t: 0.25 }], ['C', 'D', cm(b), 'A', { t: 0.25 }]], size: [210, 110] });
      return aRad(`그림과 같이 ${angH('B', 60)}, ${segEq('BC', K(a), 'cm')}, ${segEq('CD', K(b), 'cm')}인 평행사변형 ABCD에서 두 점 M, N은 각각 ${SG('BC')}, ${SG('CD')}의 중점이다. △AMN의 넓이는?`, S, AREA, {
        figure: f.b.svg(`평행사변형 ABCD와 BC의 중점 M, CD의 중점 N, 색칠한 △AMN. BC의 길이는 ${a} cm, CD의 길이는 ${b} cm, ∠B = 60°`),
        explain: `□ABCD = ${a} × ${b} × ${fn('sin', 60)} = ${sh(P0)}이다. △ABM = ${frac(1, 4)}□ABCD = ${sh(S1)}, △MCN = ${frac(1, 8)}□ABCD = ${sh(S2)}, △AND = ${frac(1, 4)}□ABCD = ${sh(S1)}이므로 △AMN = ${sh(P0)} − (${sh(S1)} + ${sh(S2)} + ${sh(S1)}) = ${L(S, AREA)}이다.`
      });
    }),
    // ② 네 단계 — 호의 길이 → 반지름 → 수선의 두 변 → 부채꼴 − 직각삼각형
    H('hard-sector-foot', '호의 길이로 반지름을 구해 부채꼴의 일부의 넓이 구하기', '①48 심13', (d) => {
      const r = d.pick([4, 5, 7, 8, 10, 11]), AH = mul(K(r), SIN[60]), OH = mul(K(r), COS[60]), tri = half2(mul(AH, OH));
      const pi = [tm(1, r * r, 6, `${r}*${r}`, '6')];
      // 보기: [π의 계수, 근호 항]
      const opt = (p, q) => ({ p, q });
      const right = opt(pi, tri), wrongs = [opt(pi, mul(tri, K(2))), opt(mul(pi, K(2)), tri), opt(pi, half2(tri)), opt(mul(pi, half(1)), tri), opt(mul(pi, K(2)), mul(tri, K(2)))];
      const val = (o) => fv(o.p) * Math.PI - fv(o.q), showO = (o) => nb(sh(o.p).replace(/^1$/, '') + 'π − ' + sh(o.q) + ' (' + AREA + ')');
      const pool = [right];
      for (const w of wrongs) if (pool.length < 5 && pool.every((p) => Math.abs(val(p) - val(w)) > 1e-9)) pool.push(w);
      const rows = d.shuffle(pool), answer = rows.indexOf(right);
      const mdl = { O: [0, 0], B: [r, 0], A: polar([0, 0], r, 60), H: [r / 2, 0] };
      const f = pic(mdl, { segs: [['O', 'B'], ['O', 'A'], ['A', 'H']], rights: [['H', 'A', 'B']], angs: [['O', 'B', 'A', '60°']], size: [170, 150], nameAt: { O: 200 },
        draw: (b, P) => { const k = P.k * r; b.shape(`M${XY(P.A)}${arcTo(P.O, k, 60, 0)}L${XY(P.H)}Z`, [P.A, P.B, P.H], TINT); b.arc(P.O, k, 0, 60); } });
      return seal(C(`그림과 같이 중심각의 크기가 60°인 부채꼴 AOB에서 호 AB의 길이가 ${nb(frac(r, 3) + 'π')} cm이고 ${nb(SG('AH') + ' ⊥ ' + SG('OB'))}일 때, 색칠한 부분의 넓이는?`, rows.map(showO), answer, more({
        figure: f.b.svg(`중심각이 60°인 부채꼴 AOB와 A에서 OB에 내린 수선의 발 H. 호 AB와 선분 AH, HB로 둘러싸인 부분을 색칠했다`),
        explain: `반지름을 ${V('r')}라 하면 2π${V('r')} × ${frac(60, 360)} = ${frac(r, 3)}π이므로 ${V('r')} = ${r}이다. ${SG('AH')} = ${r} ${fn('sin', 60)} = ${sh(AH)}, ${SG('OH')} = ${r} ${fn('cos', 60)} = ${sh(OH)}이다. 색칠한 부분은 부채꼴 AOB에서 △AOH를 뺀 것이므로 π × ${r}<sup>2</sup> × ${frac(60, 360)} − ${frac(1, 2)} × ${sh(OH)} × ${sh(AH)} = ${showO(right)}이다.`
      }, { truth: rows.map((x) => x === right), want: true })));
    })
  ];

  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: STD, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
