// 고등학교 기하 Ⅰ-3 쌍곡선(11-4-3) — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 쌍곡선 위의 점에서 두 초점까지 거리의 차를 늘 「(F′까지) − (F까지) = 2a」로만 쓰고, 점이 어느 가지에 있는지(어느 초점이 더 먼지)를 따지지 않는다.
//    두 점이 서로 다른 가지에 있으면 더 먼 초점이 서로 다르다.
//  - 우변이 −1인 쌍곡선에서 주축의 길이를 2a(x²의 분모 쪽)로 잡는다 — 주축은 y축 위에 있고 그 길이는 2b이다.
//  - 한 초점을 지나는 직선이 초점이 같은 두 쌍곡선과 만날 때 교점의 차례(어느 점이 초점에 더 가까운가)를 따지지 않는다.
//  - 「두 접선이 수직」을 기울기의 곱 −1로 옮긴 뒤, 판별식으로 얻은 기울기의 이차방정식에서 근과 계수의 관계를 쓰지 못한다.
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 문제의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, N, inline } = B.kit;
  const { MINUS, Q, qsub, qmul, qdiv, tx, V, sup, nb, poly, rt, radText } = B.kit.mid;
  const { jh, qAns } = B.kit.hs;
  const K = B.kit.u1143;
  const { UNIT, S3, S4, H, num, jn, isSq, sqFree, lcm, rad, X, Y, va, vb, vc, vk, vm, hypH, ellH, genH, symH, pt, bar, radPos, vals, hypPlot, PTS } = K;
  const vx = V('x'), vp = V('p'), vq = V('q');
  const tl = (n, pair) => josa(Math.abs(n), pair).slice(String(Math.abs(n)).length);

  // 해변의 관제소(①10): 해변(y = −d)과 쌍곡선의 교점에서 두 선박까지의 거리가 모두 자연수인 수 [c, a, d, x0, PA, PB]
  const STATION = [];
  for (let c = 3; c <= 12; c += 1) for (let a = 1; a < c; a += 1) for (let dd = 2; dd <= 12; dd += 1) {
    const b2 = c * c - a * a, x2 = a * a * (b2 + dd * dd) / b2;
    if (!Number.isInteger(x2) || !isSq(x2)) continue;
    const x0 = Math.sqrt(x2), PA2 = (x0 + c) ** 2 + dd * dd, PB2 = (x0 - c) ** 2 + dd * dd;
    if (isSq(PA2) && isSq(PB2)) STATION.push([c, a, dd, x0, Math.sqrt(PA2), Math.sqrt(PB2)]);
  }
  // 초점이 같은 타원과 쌍곡선이 수직으로 만나는 점(②15): [E1, E2, x1², y1, a²]
  const CONFOCAL = [];
  for (let E1 = 5; E1 <= 40; E1 += 1) for (let E2 = 2; E2 < E1; E2 += 1) for (let y = 1; y <= 4; y += 1) {
    const x2 = E1 * (E2 - y * y) / E2, C = E1 - E2;
    if (!Number.isInteger(x2) || x2 <= 0 || (x2 * C) % E1 !== 0) continue;
    const a2 = x2 * C / E1;
    if (a2 > 0 && a2 < C && a2 < x2) CONFOCAL.push([E1, E2, x2, y, a2]);
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: S3,
    types: [
      // ② 좌표를 잡아 쌍곡선을 세우고 → 해변과의 교점 → 두 거리(네 단계)
      H('hard-station', '해변의 관제소에서 두 선박까지 거리의 합', '①10', (d) => {
        const [c, a, dd, x0, PA, PB] = d.pick(STATION), b2 = c * c - a * a;
        const cE = `(${2 * c}/2)`, aE = `(${2 * a}/2)`, xE = `(${aE}**2*(${cE}**2-${aE}**2+${dd}**2)/(${cE}**2-${aE}**2))**0.5`;
        return N(`직선 모양의 해변에서 같은 쪽으로 ${dd} km 떨어진 바다 위에 두 선박 A, B가 있고, 두 선박 사이의 거리는 ${2 * c} km이다. 해변 위의 관제소 P에서 두 선박 A, B까지의 거리의 차가 ${2 * a} km일 때, 관제소 P에서 두 선박 A, B까지의 거리의 합은?`, PA + PB, {
          unit: 'km',
          explain: `직선 AB를 x축, 선분 AB의 수직이등분선을 y축으로 잡으면 A(${num(-c)}, 0), B(${c}, 0)이고 해변은 직선 ${nb(Y + ' = ' + num(-dd))}이다. 점 P는 두 점 A, B에 이르는 거리의 차가 ${2 * a}인 쌍곡선 ${hypH(a * a, b2, 1)} 위에 있으므로, ${jh(nb(Y + ' = ' + num(-dd)), '을/를')} 넣으면 ${nb(X + ' = ±' + x0)}이다. P(${x0}, ${num(-dd)})이면 ${bar('PB')} = ${PB}, ${bar('PA')} = ${PA}이므로 합은 ${PA + PB} km이다(P(${num(-x0)}, ${num(-dd)})이어도 같다).`,
          facts: { value: `((${xE}+${cE})**2+${dd}**2)**0.5+((${xE}-${cE})**2+${dd}**2)**0.5`, derived: [2, 0.5] }
        });
      }),
      // ② 점근선의 방정식 → 수선의 길이 둘 → 직사각형 → 곡선의 식으로 상수(점을 정하지 않아도 넓이가 정해진다)
      H('hard-perp-foot', '쌍곡선 위의 점에서 두 점근선에 내린 수선으로 만든 사각형의 넓이', '①18', (d) => {
        const k = 2 * d.int(1, 9);
        return N(`쌍곡선 ${hypH(k, k, 1)} 위의 점 A에서 두 점근선에 내린 수선의 발을 각각 B, C라 할 때, 원점 O에 대하여 사각형 ABOC의 넓이는?`, k / 2, {
          explain: `점근선은 ${nb(Y + ' = ' + X)}, ${nb(Y + ' = ' + MINUS + X)}로 서로 수직이므로 사각형 ABOC는 직사각형이다. A(${vp}, ${vq})라 하면 ${bar('AB')} = ${frac('|' + vp + ' ' + MINUS + ' ' + vq + '|', rt(2))}, ${bar('AC')} = ${frac('|' + vp + ' + ' + vq + '|', rt(2))}이므로 넓이는 ${frac('|' + vp + sup(2) + ' ' + MINUS + ' ' + vq + sup(2) + '|', 2)}이다. A가 쌍곡선 위에 있으므로 ${nb(vp + sup(2) + ' ' + MINUS + ' ' + vq + sup(2) + ' = ' + k)}이고, 넓이는 ${k / 2}이다.`,
          facts: { value: `${k}/2`, derived: [2] }
        });
      }),
      // ② 지름에 대한 원주각(직각) → 정의(거리의 차) → 피타고라스 정리 → 이차방정식
      H('hard-circle', '두 초점을 지름으로 하는 원과 쌍곡선의 교점까지의 거리', '①28', (d) => {
        const a = d.int(1, 4), Bd = d.int(1, 12), A = a * a, n2 = A + 2 * Bd;
        if (A === Bd || !sqFree(n2)) return null;
        return inline(`두 초점이 F, F′인 쌍곡선 ${jh(hypH(A, Bd, 1), '과/와')} 선분 FF′을 지름으로 하는 원이 제1사분면에서 만나는 점을 P라 할 때, 선분 PF의 길이는? (단, 점 F의 x좌표는 양수이다.)`, '{0} + ' + rt('{1}'), [{ answer: -a, signed: true }, { answer: n2 }], {
          shown: nb(rt(n2) + ' ' + MINUS + ' ' + a),
          explain: `c² = ${A} + ${Bd} = ${A + Bd}이고, 선분 FF′이 지름이므로 ∠FPF′ = 90°이다. P는 F 쪽 가지 위에 있으므로 ${nb(bar('PF') + ' = ' + vx)}라 하면 ${nb(bar('PF′') + ' = ' + vx + ' + ' + 2 * a)}이고, ${nb(vx + sup(2) + ' + (' + vx + ' + ' + 2 * a + ')' + sup(2) + ' = ' + 4 * (A + Bd))}에서 ${nb(vx + sup(2) + ' + ' + 2 * a + vx + ' ' + MINUS + ' ' + 2 * Bd + ' = 0')}이다. ${vx} &gt; 0이므로 ${nb(vx + ' = ' + MINUS + a + ' + ' + rt(n2))}이다.`,
          facts: { calc: [[`0-${A}**0.5`, 0], [`${A}+2*${Bd}`, 1]], derived: [0.5, 2] }
        });
      }),
      // ①② 두 쌍곡선의 초점이 같다 → 교점의 차례(F, A, B) → 거리의 차 둘과 둘레를 잇기
      H('hard-two-hyp', '초점이 같은 두 쌍곡선과 한 직선으로 만든 삼각형', '①31', (d) => {
        const c = d.int(4, 7), a2 = d.int(1, c - 2), a1 = d.int(a2 + 1, c - 1), BF = d.int(c - a2 + 1, c - a2 + 6);
        const A1 = a1 * a1, B1 = c * c - A1, A2 = a2 * a2, B2 = c * c - A2;
        // B: 둘째 쌍곡선의 F 쪽 가지 위에서 F 까지 BF 인 점(제1사분면), A: 선분 FB 와 첫째 쌍곡선의 교점
        const xB = a2 * (BF + a2) / c, yB = Math.sqrt(B2 * (xB * xB / A2 - 1));
        const f = (t) => { const x = c + (xB - c) * t, y = yB * t; return x * x / A1 - y * y / B1 - 1; };
        if (!(yB > 0) || !(f(0) > 0 && f(1) < 0)) return null;
        let lo = 0, hi = 1; for (let i = 0; i < 60; i += 1) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
        if (!(c + (xB - c) * lo > 0)) return null;
        const L = 2 * a1 + 2 * a2 + 2 * BF;
        return N(`두 쌍곡선 ${hypH(A1, B1, 1)}, ${jh(hypH(A2, B2, 1), '이/가')} 점 F(${c}, 0)을 지나는 직선과 제1사분면에서 만나는 점을 각각 A, B라 하자. 점 G(${num(-c)}, 0)에 대하여 삼각형 GAB의 둘레의 길이가 ${L}일 때, 선분 BF의 길이는?`, BF, {
          explain: `두 쌍곡선의 초점은 모두 F, G이다(c² = ${c * c}). 첫째 쌍곡선의 가지는 둘째 쌍곡선의 가지보다 안쪽(F 쪽)에 있으므로 직선 위에서 F, A, B의 차례로 놓이고 ${nb(bar('AB') + ' = ' + bar('BF') + ' ' + MINUS + ' ' + bar('AF'))}이다. ${nb(bar('AG') + ' ' + MINUS + ' ' + bar('AF') + ' = ' + 2 * a1)}, ${nb(bar('BG') + ' ' + MINUS + ' ' + bar('BF') + ' = ' + 2 * a2)}이므로 둘레는 ${nb('(' + bar('AF') + ' + ' + 2 * a1 + ') + (' + bar('BF') + ' + ' + 2 * a2 + ') + (' + bar('BF') + ' ' + MINUS + ' ' + bar('AF') + ')')} = ${nb(2 * (a1 + a2) + ' + 2' + bar('BF'))} = ${L}이다. 따라서 ${nb(bar('BF') + ' = ' + BF)}이다.`,
          facts: { value: `(${L}-2*${A1}**0.5-2*${A2}**0.5)/2`, derived: [2, 0.5] }
        });
      }),
      // ② 우변이 −1(초점이 y축 위, 주축 2b) → 각의 이등분선의 성질로 비 → 거리의 차와 연립 → 합
      H('hard-bisector', '∠FPF′의 이등분선이 지나는 점으로 두 거리의 합', '①32', (d) => {
        const b = d.int(2, 5), c = d.int(b + 1, b + 4), t = d.int(1, b - 1), Bd = b * b, A = c * c - Bd;
        if ((2 * b * c) % t !== 0 || A === Bd) return null;
        const PF = b * (c - t) / t, PFp = b * (c + t) / t;
        return N(`두 초점이 F, F′인 쌍곡선 ${hypH(A, Bd, -1)} 위의 점 가운데 제1사분면에 있는 점 P에 대하여 ∠FPF′의 이등분선이 점 ${jh(pt(0, t), '을/를')} 지날 때, ${nb(bar('PF') + ' + ' + bar('PF′'))}의 값은? (단, 점 F의 y좌표는 양수이다.)`, PF + PFp, {
          explain: `우변이 ${MINUS}1이므로 두 초점은 F(0, ${c}), F′(0, ${num(-c)})이고(c² = ${A} + ${Bd}), 주축은 y축 위에 있어 그 길이는 2b = ${2 * b}이다. 점 D(0, ${t})에 대하여 ${bar('FD')} = ${c - t}, ${bar('F′D')} = ${c + t}이고, 각의 이등분선의 성질에 의하여 ${nb(bar('PF') + ' : ' + bar('PF′') + ' = ' + (c - t) + ' : ' + (c + t))}이다. P는 위쪽 가지 위에 있으므로 ${nb(bar('PF′') + ' ' + MINUS + ' ' + bar('PF') + ' = ' + 2 * b)}이고, 두 식에서 ${bar('PF')} = ${PF}, ${bar('PF′')} = ${PFp}이다. 합은 ${PF + PFp}이다.`,
          facts: { value: `2*${Bd}**0.5*(${A}+${Bd})**0.5/${t}`, derived: [2, 0.5] }
        });
      }),
      // ① 두 점이 서로 다른 가지 위에 있다: P 는 F′ 이 더 멀고, Q 는 F 가 더 멀다 — 거리의 차의 부호가 갈린다
      H('hard-branches', '서로 다른 가지 위의 두 점과 두 초점까지의 거리', '①33', (d) => {
        const b = d.int(2, 4), c = d.int(b + 1, b + 4), Bd = b * b, A = c * c - Bd, [p, q] = d.pick([[1, 2], [2, 3], [3, 4], [1, 3], [2, 5], [3, 5]]);
        const QF = q * d.int(1, 6), PF = QF * p / q, s = PF - QF + 4 * b;
        if (A === Bd || s <= 0 || PF < c - b || QF < c + b) return null;
        return N(`두 초점이 F(0, ${c}), F′(0, ${num(-c)})인 쌍곡선 ${jh(hypH(A, Bd, -1), '이/가')} 있다. 제1사분면에 있는 쌍곡선 위의 점 P와 제3사분면에 있는 쌍곡선 위의 점 Q가 ${nb(bar('PF′') + ' ' + MINUS + ' ' + bar('QF′') + ' = ' + s)}, ${nb(bar('PF') + ' = ' + frac(p, q) + bar('QF'))}를 만족시킬 때, ${nb(bar('PF') + ' + ' + bar('QF'))}의 값은?`, PF + QF, {
          explain: `주축의 길이는 2b = ${2 * b}이다. P는 위쪽 가지 위에 있어 F′이 더 멀므로 ${nb(bar('PF′') + ' = ' + bar('PF') + ' + ' + 2 * b)}, Q는 아래쪽 가지 위에 있어 F가 더 멀므로 ${nb(bar('QF′') + ' = ' + bar('QF') + ' ' + MINUS + ' ' + 2 * b)}이다. 첫 조건에 넣으면 ${nb(bar('PF') + ' ' + MINUS + ' ' + bar('QF') + ' = ' + s + ' ' + MINUS + ' ' + 4 * b + ' = ' + num(s - 4 * b))}이고, ${nb(bar('PF') + ' = ' + frac(p, q) + bar('QF'))}와 연립하면 ${bar('QF')} = ${QF}, ${bar('PF')} = ${PF}이다. 합은 ${PF + QF}이다.`,
          facts: { value: `(4*${Bd}**0.5-${s})/(1-${p}/${q})*(1+${p}/${q})`, derived: [4, 0.5] }
        });
      }),
      // ② y축에 대한 대칭 → 길이 → 직각 → 피타고라스 정리 → 거리의 차
      H('hard-equilateral', '정삼각형 조건으로 쌍곡선의 주축', '①34', (d) => {
        const k = d.int(1, 6), cH = radText(k, 3);
        return N(`두 초점이 F(${cH}, 0), F′(${MINUS}${cH}, 0)인 쌍곡선 위의 점 가운데 제1사분면에 있는 점 P에 대하여 직선 PF′이 y축과 만나는 점을 Q라 하자. 삼각형 PQF가 정삼각형일 때, 이 쌍곡선의 주축의 길이는?`, 2 * k, {
          explain: `${nb(bar('PF') + ' = ' + vx)}라 하면 ${bar('PQ')} = ${bar('QF')} = ${vx}이고, Q는 선분 FF′의 수직이등분선(y축) 위에 있으므로 ${bar('QF′')} = ${bar('QF')} = ${vx}, ${nb(bar('PF′') + ' = 2' + vx)}이다. ∠FQF′ = 120°이므로 ∠QF′F = ∠QFF′ = 30°이고 ∠PFF′ = 60° + 30° = 90°이다. ${nb('(2' + vx + ')' + sup(2) + ' = ' + vx + sup(2) + ' + (' + radText(2 * k, 3) + ')' + sup(2))}에서 ${vx} = ${2 * k}이고, 주축의 길이는 ${nb(bar('PF′') + ' ' + MINUS + ' ' + bar('PF'))} = ${vx} = ${2 * k}이다.`,
          facts: { value: `2*${k}`, derived: [2] }
        });
      }),
      // ② 점근선 → a 를 c 로 → 둘레 식에서 PF 를 c 의 일차식으로 → 범위의 양 끝
      H('hard-range', '초점의 위치가 범위로 주어질 때 거리의 최댓값과 최솟값', '①35', (d) => {
        const [p, q, r] = d.pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13]]), u1 = d.int(1, 3), u2 = d.int(u1 + 1, 4), c1 = r * u1, c2 = r * u2;
        if (c2 > 40) return null;
        const L = 4 * c2 + 2 * d.int(0, 8), diff = (c2 - c1) * (r + p) / r;
        return N(`${nb(c1 + ' ≤ ' + vc + ' ≤ ' + c2)}인 실수 ${vc}에 대하여 두 초점이 F(${vc}, 0), F′(${MINUS}${vc}, 0)이고 점근선의 방정식이 ${nb(Y + ' = ±' + frac(q, p) + X)}인 쌍곡선이 있다. 이 쌍곡선 위의 점 가운데 제1사분면에 있는 점 P에 대하여 삼각형 PF′F의 둘레의 길이가 ${L}일 때, 선분 PF의 길이의 최댓값과 최솟값의 차는?`, diff, {
          explain: `b/a = ${frac(q, p)}, a² + b² = c²에서 a = ${frac(p, r)}c이다. P는 F 쪽 가지 위에 있으므로 ${nb(bar('PF′') + ' = ' + bar('PF') + ' + ' + frac(2 * p, r) + vc)}이고, 둘레 ${nb('2' + vc + ' + 2' + bar('PF') + ' + ' + frac(2 * p, r) + vc + ' = ' + L)}에서 ${nb(bar('PF') + ' = ' + L / 2 + ' ' + MINUS + ' ' + frac(r + p, r) + vc)}이다. ${vc}가 커질수록 ${bar('PF')}는 작아지므로 최댓값은 ${vc} = ${c1}일 때, 최솟값은 ${vc} = ${c2}일 때이고, 차는 ${frac(r + p, r)} × ${c2 - c1} = ${diff}이다.`,
          facts: { value: `(${c2}-${c1})*((${p}*${p}+${q}*${q})**0.5+${p})/((${p}*${p}+${q}*${q})**0.5)`, derived: [0.5] }
        });
      }),
      // ② 비 → 점근선의 기울기 → a, b, c 를 한 문자로 → P 의 좌표 → 곡선의 식에 넣기(다섯 단계)
      H('hard-parallel', '점근선에 평행한 직선과 길이의 비로 주축 구하기', '①36', (d) => {
        const [p, q, r] = d.pick([[3, 4, 5], [4, 3, 5]]), s = d.int(2, 9), axis = Q(4 * p * p * s, q * q);
        if (axis.q === 1) return null;
        const k = 2 * p * s / (q * q), a = p * k, b = q * k, c = r * k, Ay = q * c / p, P = [c - s * p / r, s * q / r];
        const ylo = -Math.max(1.5, Ay * 0.3), ys = Math.min(1, (2 * c + 3) * 1.1 / (Ay + 1 - ylo));
        const figure = hypPlot(a * a, b * b, 1, {
          x: [-(c + 1.5), c + 1.5], y: [ylo, Ay + 1], ys,
          segs: [{ p: [0, Ay], q: [c, 0], color: '#b42318' }],
          dots: [{ x: 0, y: Ay, name: 'A', side: 'ul', said: 'y축 위의 점' }, { x: P[0], y: P[1], name: 'P', side: 'ur', said: '선분 AF와 쌍곡선의 교점' }, { x: c, y: 0, name: 'F', side: 'dr', said: '초점' }, { x: -c, y: 0, name: 'F′', side: 'dl', said: '초점' }]
        });
        return qAns(`그림과 같이 두 초점이 F(${vc}, 0), F′(${MINUS}${vc}, 0)인 쌍곡선과 y축 위의 점 A가 있다. 쌍곡선이 선분 AF와 만나는 점을 P라 하자. 직선 AF는 쌍곡선의 한 점근선과 평행하고 ${nb(bar('AF') + ' : ' + bar('OF') + ' = ' + r + ' : ' + p)}, ${nb(bar('PF') + ' = ' + s)}일 때, 쌍곡선의 주축의 길이는? (단, ${vc} &gt; 0이고 O는 원점이다.)`, axis, {
          figure,
          explain: `${nb(bar('OF') + ' : ' + bar('OA') + ' : ' + bar('AF') + ' = ' + p + ' : ' + q + ' : ' + r)}이므로 직선 AF의 기울기는 ${MINUS}${frac(q, p)}이고, 점근선과 평행하므로 b/a = ${frac(q, p)}이다. a = ${p}${vk}, b = ${q}${vk}, c = ${r}${vk}로 놓으면 P(${r}${vk} ${MINUS} ${frac(p * s, r)}, ${frac(q * s, r)})이다. 이것을 쌍곡선의 식에 넣어 정리하면 ${nb(q * q + vk + ' = ' + 2 * p * s)}, ${vk} = ${tx(Q(2 * p * s, q * q))}이고, 주축의 길이는 2a = ${2 * p}${vk} = ${tx(axis)}이다.`,
          facts: { value: `4*${p}*${p}*${s}/(${r}*${r}-${p}*${p})`, derived: [4] }
        });
      }),
      // ② 접선의 x절편을 a 로 → 내분점 → a, b → 점의 좌표를 넣기
      H('hard-tan-divide', '접선의 x절편이 두 초점 사이를 내분할 때', '②12', (d) => {
        const c = d.int(3, 7), [m, n] = d.pick([[2, 1], [3, 1], [3, 2], [4, 1], [5, 3]]), x1 = d.int(c, c + 4);
        const X0 = Q(c * (m - n), m + n), a2 = qmul(X0, Q(x1)), b2 = qsub(Q(c * c), a2);
        if (a2.q !== 1 || b2.p <= 0 || a2.p >= x1 * x1) return null;
        const k2 = qmul(b2, qsub(qdiv(Q(x1 * x1), a2), Q(1)));
        if (k2.q !== 1 || k2.p <= 0 || isSq(k2.p)) return null;
        return N(`두 초점이 F(${c}, 0), F′(${num(-c)}, 0)인 쌍곡선 ${symH(1)} 위의 점 P(${x1}, ${vk})에서의 접선과 x축이 만나는 점이 선분 F′F를 ${m} : ${n}${tl(n, '으로/로')} 내분할 때, ${vk}${sup(2)}의 값은? (단, ${va}, ${vb}는 상수이다.)`, k2.p, {
          explain: `접선 ${nb(frac(x1 + X, va + sup(2)) + ' ' + MINUS + ' ' + frac(vk + Y, vb + sup(2)) + ' = 1')}이 x축과 만나는 점의 x좌표는 ${frac(va + sup(2), x1)}이다. 선분 F′F를 ${m} : ${n}${tl(n, '으로/로')} 내분하는 점의 x좌표는 ${frac(m + ' × ' + c + ' + ' + n + ' × (' + MINUS + c + ')', m + n)} = ${tx(X0)}이므로 a² = ${a2.p}, b² = ${c * c} ${MINUS} ${a2.p} = ${b2.p}이다. 점 P를 넣으면 ${nb(frac(x1 * x1, a2.p) + ' ' + MINUS + ' ' + frac(vk + sup(2), b2.p) + ' = 1')}이므로 ${vk}² = ${k2.p}이다.`,
          facts: { value: `(${c}*${c}-${x1}*${c}*(${m}-${n})/(${m}+${n}))*(${x1}*${x1}/(${x1}*${c}*(${m}-${n})/(${m}+${n}))-1)` }
        });
      }, { standard: S4 }),
      // ② 우변이 −1인 꼴의 접선 → 세로로 놓인 두 초점 → 점과 직선 사이의 거리 둘 → 곱
      H('hard-foci-product', '접선과 두 초점 사이의 거리의 곱', '②14', (d) => {
        const [A, Bd, x0, y0] = d.pick(PTS[-1].filter(([a2, b2]) => a2 !== b2 && a2 <= 20 && b2 <= 20));
        const x1 = d.pick([1, -1]) * x0, y1 = d.pick([1, -1]) * y0;
        return N(`쌍곡선 ${hypH(A, Bd, -1)} 위의 점 P${pt(x1, y1)}에서의 접선을 l이라 하고, 이 쌍곡선의 두 초점 F, F′에서 직선 l에 내린 수선의 발을 각각 H, H′이라 할 때, ${nb(bar('FH') + ' × ' + bar('F′H′'))}의 값은?`, A, {
          explain: `접선 ${nb(frac('x₁' + X, A) + ' ' + MINUS + ' ' + frac('y₁' + Y, Bd) + ' = ' + MINUS + '1')}에 점 P를 넣고 양변에 ${josa(A * Bd, '을/를')} 곱하면 ${nb(poly([[Bd * x1, X], [-A * y1, Y]]) + ' = ' + num(-A * Bd))}이다. 우변이 ${MINUS}1이므로 두 초점은 (0, ±${rad(A + Bd)})이고, 두 초점에서 이 직선까지의 거리의 곱은 ${frac('|' + (A * Bd) + sup(2) + ' ' + MINUS + ' ' + Math.abs(A * y1) + sup(2) + ' × ' + (A + Bd) + '|', Math.abs(Bd * x1) + sup(2) + ' + ' + Math.abs(A * y1) + sup(2))} = ${A}이다(우변이 ${MINUS}1인 쌍곡선에서 이 곱은 늘 x²의 분모와 같다).`,
          facts: { value: `${A}*${A}*(${y0}*${y0}*(${A}+${Bd})-${Bd}*${Bd})/(${Bd}*${Bd}*${x0}*${x0}+${A}*${A}*${y0}*${y0})` }
        });
      }, { standard: S4 }),
      // ② 두 곡선의 접선 → 기울기의 곱 −1 → 점의 좌표를 넣기 → 연립
      H('hard-two-curves', '타원과 쌍곡선의 교점에서 두 접선이 수직일 때', '②15', (d) => {
        const [E1, E2, x2, y1, a2] = d.pick(CONFOCAL), b2 = E1 - E2 - a2, xH = rad(x2);
        return vals(`쌍곡선 ${jh(symH(1), '과/와')} 타원 ${jh(ellH(E1, E2), '이/가')} 점 P(${xH}, ${y1})에서 만나고, 점 P에서 두 곡선에 그은 접선이 서로 수직일 때, ${va}${sup(2)}, ${vb}${sup(2)}의 값을 구하시오. (단, ${va}, ${vb}는 상수이다.)`, [[va + sup(2), a2], [vb + sup(2), b2]], {
          explain: `점 P에서 쌍곡선의 접선의 기울기는 ${frac(vb + sup(2) + ' × ' + xH, va + sup(2) + ' × ' + y1)}, 타원의 접선의 기울기는 ${MINUS}${frac(E2 + ' × ' + xH, E1 + ' × ' + y1)}이다. 곱이 ${MINUS}1이므로 ${nb(frac(vb + sup(2), va + sup(2)) + ' = ' + tx(Q(E1 * y1 * y1, E2 * x2)))}이다. 점 P가 쌍곡선 위에 있으므로 ${nb(frac(x2, va + sup(2)) + ' ' + MINUS + ' ' + frac(y1 * y1, vb + sup(2)) + ' = 1')}에 넣으면 a² = ${a2}, b² = ${b2}이다(이 쌍곡선은 타원과 초점이 같다).`,
          facts: { calc: [[`${x2}*(${E1}-${E2})/${E1}`, 0], [`${E1}-${E2}-${x2}*(${E1}-${E2})/${E1}`, 1]], derived: [x2] }
        });
      }, { standard: S4 }),
      // ② 판별식 → 기울기의 이차방정식 → 근과 계수의 관계 → 곱 −1
      H('hard-perp-tangents', '한 점에서 그은 두 접선이 서로 수직일 때', '②18', (d) => {
        const s = d.pick([1, -1]), P = d.int(1, 6), Qc = d.int(1, 6), Rr = lcm(P, Qc) * d.int(1, 2), A = Rr / P, Bd = Rr / Qc;
        const R2 = s === 1 ? A - Bd : Bd - A, t = d.pick([-3, -2, -1, 1, 2, 3]), p2 = R2 - t * t;
        if (P === Qc || R2 <= 0 || !sqFree(p2) || Rr > 36 || t * t * A === Bd * p2) return null;
        if (s === 1 && p2 === A) return null;
        const cst = s === 1 ? t * t + Bd : t * t - Bd;
        const quad = nb('(' + va + sup(2) + (s === 1 ? ' ' + MINUS + ' ' : ' + ') + A + ')' + vm + sup(2) + (t > 0 ? ' ' + MINUS + ' ' : ' + ') + 2 * Math.abs(t) + va + vm + (cst === 0 ? '' : (cst > 0 ? ' + ' : ' ' + MINUS + ' ') + Math.abs(cst)) + ' = 0');
        return radPos(`점 ${pt(va, t)}에서 쌍곡선 ${genH(P, Qc, s * Rr)}에 그은 두 접선이 서로 수직일 때, 양수 ${va}의 값은?`, 1, p2, {
          explain: `쌍곡선은 ${hypH(A, Bd, s)}이다. 점 ${jh(pt(va, t), '을/를')} 지나는 직선 ${jh(nb(Y + ' = ' + vm + '(' + X + ' ' + MINUS + ' ' + va + ')' + ' ' + (t < 0 ? MINUS : '+') + ' ' + Math.abs(t)), '을/를')} 쌍곡선의 식에 넣은 x의 이차방정식의 판별식이 0이 되는 조건은 ${quad}이다. 두 접선의 기울기는 이 방정식의 두 근이므로 두 근의 곱 ${jh(frac(s === 1 ? t * t + Bd : num(t * t - Bd), s === 1 ? va + sup(2) + ' ' + MINUS + ' ' + A : va + sup(2) + ' + ' + A), '이/가')} ${MINUS}1이다. 따라서 ${nb(va + sup(2) + ' = ' + p2)}, ${va} = ${rt(p2)}이다.`,
          facts: { value: s === 1 ? `${Rr}/${P}-${Rr}/${Qc}-${jn(t)}*${jn(t)}` : `${Rr}/${Qc}-${Rr}/${P}-${jn(t)}*${jn(t)}` }
        });
      }, { standard: S4 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
