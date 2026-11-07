// 고등학교 기하 Ⅲ-2 벡터의 성분과 내적(11-4-7) — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 내분점의 위치벡터 (mb⃗ + na⃗)/(m + n)에서 m, n의 짝을 바꾸어 쓴다. 벡터 등식 pOA⃗ + qOB⃗ + rOC⃗ = 0⃗에서 두 항을 묶으면
//    내분점이 생긴다는 것을 떠올리지 못한다.
//  - |OP⃗ + 2OA⃗|를 점 P와 점 2A 사이의 거리로 읽는다(OP⃗ + 2OA⃗ = OP⃗ − OX⃗이므로 X는 −2A이다).
//  - 두 벡터가 평행하면 a⃗ = kb⃗로 놓되 k의 부호를 따지지 않는다(a⃗ · b⃗의 부호가 k의 부호를 정한다).
//  - 내적의 최댓값에서 벡터를 「정해진 벡터 + 움직이는 벡터」로 쪼개지 않는다. 두 벡터가 이루는 각이 가장 클 때를 그림에서 찾지 못한다.
//  - cos θ의 최솟값을 θ의 최솟값과 헷갈린다(θ가 가장 클 때 cos θ가 가장 작다).
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 문제의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, inline } = B.kit;
  const { MINUS, Q, qmul, qsub, tx, V, nb, poly, rt, sqParts, SG } = B.kit.mid;
  const { vec, jh, qAns, fn } = B.kit.hs;
  const { Board, at, awayFrom, dirOf } = B.kit.mgeo;
  const K = B.kit.u1147;
  const { UNIT, S2, S3, H, num, jn, par, tup, pt, va, vb, vx, vy, dt, ab, ratio, NOTE1, isSqFree, isSquare, fracVals, RATIOS, nameOut, centerOf, onSeg } = K;
  const TH = V('θ'), COS = fn('cos');
  const nz = (d, lo, hi) => { let x = 0; while (x === 0) x = d.int(lo, hi); return x; };
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : a), gcd3 = (a, b, c) => gcd2(gcd2(a, b), c);
  const sqT = (v, c) => (c === 0 ? v + '<sup>2</sup>' : '(' + poly([[1, v], [-c, '']]) + ')<sup>2</sup>');   // (x − c)²

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: S3,
    types: [
      // ② 두 항을 묶어 내분점 → O가 나누는 비 → 넓이의 비(넷을 잇는다).
      H('hard-area', '벡터 등식으로 점의 자리를 읽어 넓이 구하기', '①8', (d) => {
        const w = { A: d.int(1, 6), B: d.int(1, 6), C: d.int(1, 6) }, sm = w.A + w.B + w.C;
        if ((w.A === w.B && w.B === w.C) || gcd3(w.A, w.B, w.C) !== 1) return null;
        const S = sm * d.int(2, 5), [X, Y, Z] = d.pick([['A', 'B', 'C'], ['A', 'C', 'B'], ['B', 'A', 'C']]);   // 묻는 삼각형 XOZ, 남은 꼭짓점 Y
        const ans = S * w[Y] / sm, eq = nb(poly([[w.A, vec('OA')], [w.B, vec('OB')], [w.C, vec('OC')]]) + ' = ' + vec('0'));
        const sXZ = w[X] + w[Z], g1 = gcd2(w[Z], w[X]), g2 = gcd2(sXZ, w[Y]);
        return N(`삼각형 ABC의 내부의 한 점 O에 대하여 ${jh(eq, '이/가')} 성립한다. 삼각형 ABC의 넓이가 ${S}일 때, 삼각형 ${X}O${Z}의 넓이는?`, ans, {
          explain: `${nb(poly([[w[X], vec('O' + X)], [w[Z], vec('O' + Z)]]) + ' = ' + sXZ + vec('OD'))}(D는 선분 ${X}${Z}를 ${ratio(w[Z] / g1, w[X] / g1, '으로/로')} 내분하는 점)이므로 ${nb((w[Y] === 1 ? '' : w[Y]) + vec('O' + Y) + ' = ' + MINUS + sXZ + vec('OD'))}, 곧 O는 선분 ${Y}D를 ${ratio(sXZ / g2, w[Y] / g2, '으로/로')} 내분한다. 삼각형 ${X}O${Z}와 삼각형 ABC는 밑변 ${X}${Z}가 같고 높이의 비가 ${nb(SG('OD') + ' : ' + SG(Y + 'D') + ' = ' + w[Y] + ' : ' + sm)}이므로 넓이는 ${nb(S + ' × ' + frac(w[Y], sm) + ' = ' + ans)}이다.`,
          facts: { value: `${S}*${w[Y]}/(${w.A}+${w.B}+${w.C})` }
        });
      }, { standard: S2 }),
      // ② 교점을 두 길로 나타내기 → 평행하지 않은 두 벡터의 계수 비교 → 연립 → 답(넷을 잇는다).
      H('hard-meet', '두 선분의 교점을 두 벡터로 나타내기', '①9', (d, n) => {
        if (n === 0) {
          const [m1, n1] = d.pick(RATIOS.concat([[1, 1], [1, 1]])), [m2, n2] = d.pick(RATIOS.concat([[1, 1]]));
          if (m1 === n1 && m2 === n2) return null;
          const al = Q(m1, m1 + n1), be = Q(m2, m2 + n2), one = qsub(Q(1), qmul(al, be));
          const mm = Q(al.p * (be.q - be.p) * one.q, al.q * be.q * one.p), nn = Q(be.p * (al.q - al.p) * one.q, al.q * be.q * one.p);
          const k = Q((al.q - al.p) * one.q, al.q * one.p), t = qsub(Q(1), qmul(k, be));
          const sayM = m1 === n1 ? '선분 OA의 중점을 M' : `선분 OA를 ${ratio(m1, n1, '으로/로')} 내분하는 점을 M`, sayN = m2 === n2 ? '선분 OB의 중점을 N' : `선분 OB를 ${ratio(m2, n2, '으로/로')} 내분하는 점을 N`;
          const g = Board(), O = [0, 120], A = [70, 0], Bp = [230, 120], Mp = onSeg(O, A, m1 / (m1 + n1)), Np = onSeg(O, Bp, m2 / (m2 + n2));
          const P = [O[0] + (A[0] - O[0]) * (mm.p / mm.q) + (Bp[0] - O[0]) * (nn.p / nn.q), O[1] + (A[1] - O[1]) * (mm.p / mm.q) + (Bp[1] - O[1]) * (nn.p / nn.q)], cen = centerOf([O, A, Bp]);
          g.poly([O, A, Bp]).seg(A, Np).seg(Bp, Mp).dot(Mp).dot(Np).dot(P);
          nameOut(g, O, 'O', cen); nameOut(g, A, 'A', cen); nameOut(g, Bp, 'B', cen); g.name(Mp, 'M', 160); g.name(Np, 'N', 270); g.nameFree(P, 'P', [dirOf(P, A), dirOf(P, Np), dirOf(P, Bp), dirOf(P, Mp)]);
          const figure = g.svg('삼각형 OAB. 변 OA 위의 점 M, 변 OB 위의 점 N이 있고 선분 AN과 선분 BM이 점 P에서 만난다.');
          const VM = V('m'), VN = V('n'), VK = V('k'), VT = V('t');
          return fracVals(`그림과 같이 삼각형 OAB에서 ${sayM}, ${sayN}이라 하고, 두 선분 AN, BM의 교점을 P라 하자. ${nb(vec('OA') + ' = ' + va)}, ${nb(vec('OB') + ' = ' + vb)}라 할 때, ${jh(nb(vec('OP') + ' = ' + VM + va + ' + ' + VN + vb), '을/를')} 만족시키는 실수 ${VM}, ${VN}의 값은?`, [[VM, mm], [VN, nn]], {
            figure,
            explain: `P는 선분 AN 위에 있으므로 ${nb(vec('OP') + ' = (1 ' + MINUS + ' ' + VK + ')' + va + ' + ' + VK + '·' + tx(be) + vb)}, 선분 BM 위에 있으므로 ${nb(vec('OP') + ' = ' + VT + '·' + tx(al) + va + ' + (1 ' + MINUS + ' ' + VT + ')' + vb)}로 나타낼 수 있다. ${va}, ${jh(vb, '은/는')} 영벡터가 아니고 평행하지 않으므로 ${nb('1 ' + MINUS + ' ' + VK + ' = ' + tx(al) + VT)}, ${nb(tx(be) + VK + ' = 1 ' + MINUS + ' ' + VT)}이고, 이를 풀면 ${nb(VK + ' = ' + tx(k))}, ${nb(VT + ' = ' + tx(t))}이다. 따라서 ${nb(VM + ' = ' + tx(mm))}, ${nb(VN + ' = ' + tx(nn))}이다.`,
            facts: { calc: [[String(mm.p), 0], [String(mm.q), 1], [String(nn.p), 2], [String(nn.q), 3]], derived: [mm.p, mm.q, nn.p, nn.q] }
          });
        }
        const [d1, d2] = d.pick(RATIOS.filter(([, b]) => b >= 2)), dl = Q(d1, d1 + d2), kap = Q(d1 + d2, d1 + 2 * d2), v = Q(d1 + d2, d2);
        const g = Board(), O = [0, 110], A = [190, 110], Bp = [250, 0], Cp = [60, 0], D = onSeg(Bp, Cp, d1 / (d1 + d2)), E = onSeg(O, D, kap.p / kap.q), cen = centerOf([O, A, Bp, Cp]);
        g.poly([O, A, Bp, Cp]).seg(O, D).seg(A, Cp).dot(D).dot(E);
        nameOut(g, O, 'O', cen); nameOut(g, A, 'A', cen); nameOut(g, Bp, 'B', cen); nameOut(g, Cp, 'C', cen); g.name(D, 'D', 90); g.nameFree(E, 'E', [dirOf(E, O), dirOf(E, D), dirOf(E, A), dirOf(E, Cp)]);
        const figure = g.svg('평행사변형 OABC(O 왼쪽 아래, A 오른쪽 아래, B 오른쪽 위, C 왼쪽 위). 변 BC 위의 점 D와 O를 잇는 선분이 대각선 AC와 점 E에서 만난다.');
        return qAns(`그림과 같이 평행사변형 OABC에서 변 BC를 ${ratio(d1, d2, '으로/로')} 내분하는 점을 D라 하자. 선분 OD 위의 점 E에 대하여 세 점 A, E, C가 한 직선 위에 있을 때, ${frac(SG('OE'), SG('DE'))}의 값은?`, v, {
          figure,
          explain: `${nb(vec('OA') + ' = ' + va)}, ${nb(vec('OC') + ' = ' + vb)}라 하면 ${nb(vec('CB') + ' = ' + va)}이므로 ${nb(vec('OD') + ' = ' + vb + ' + ' + tx(Q(d2, d1 + d2)) + va)}이다. ${nb(vec('OE') + ' = ' + V('k') + vec('OD'))}라 하면 E가 직선 AC 위에 있으므로 ${va}, ${vb}의 계수의 합이 1이다. ${nb(V('k') + ' × ' + tx(Q(d2, d1 + d2)) + ' + ' + V('k') + ' = 1')}에서 ${nb(V('k') + ' = ' + tx(kap))}이므로 ${nb(SG('OE') + ' : ' + SG('ED') + ' = ' + (d1 + d2) + ' : ' + d2)}, 값은 ${tx(v)}이다.`,
          facts: { value: `(${d1}+${d2})/${d2}` }
        });
      }, { count: 2, standard: S2 }),
      // ① OP⃗ + λOA⃗ = OP⃗ − OX⃗ 에서 X 는 −λA 이다(λA 로 읽는 함정).
      H('hard-circlemax', '원 위의 점과 정해진 벡터의 합의 크기의 최댓값·최솟값', '①23', (d) => {
        const lam = d.int(2, 3), A = [d.int(-3, 3), d.int(-3, 3)], Cc = [d.int(-4, 4), d.int(-4, 4)];
        if (A[0] === 0 && A[1] === 0) return null;
        const u = Cc[0] + lam * A[0], v = Cc[1] + lam * A[1], dd = Math.sqrt(u * u + v * v);
        if (!Number.isInteger(dd) || dd < 3) return null;
        const r = d.int(1, dd - 1), X = [-lam * A[0], -lam * A[1]];
        // 함정 확인: λA 로 읽었을 때의 거리가 바른 거리와 달라야 한다.
        if ((Cc[0] - lam * A[0]) ** 2 + (Cc[1] - lam * A[1]) ** 2 === dd * dd) return null;
        const circ = nb(sqT(vx, Cc[0]) + ' + ' + sqT(vy, Cc[1]) + ' = ' + r * r);
        return M(`좌표평면 위의 점 ${jh(pt('A', A), '과/와')} 원 ${circ} 위의 점 P에 대하여 ${ab(vec('OP') + ' + ' + lam + vec('OA'))}의 최댓값과 최솟값을 구하시오. <span style="white-space:nowrap">(단, O는 원점이다.)</span>`, [{ answer: dd + r, lead: '최댓값:' }, { answer: dd - r, lead: '최솟값:' }], {
          shown: `최댓값 ${dd + r}, 최솟값 ${dd - r}`,
          explain: `점 X${tup(X)}에 대하여 ${nb(lam + vec('OA') + ' = ' + MINUS + vec('OX'))}이므로 ${nb(vec('OP') + ' + ' + lam + vec('OA') + ' = ' + vec('OP') + ' ' + MINUS + ' ' + vec('OX') + ' = ' + vec('XP'))}이다. 원의 중심 ${jh(tup(Cc), '과/와')} X 사이의 거리는 ${nb(rt(par(u) + '<sup>2</sup> + ' + par(v) + '<sup>2</sup>') + ' = ' + dd)}이고 반지름의 길이는 ${r}이므로 최댓값은 ${nb(dd + ' + ' + r + ' = ' + (dd + r))}, 최솟값은 ${nb(dd + ' ' + MINUS + ' ' + r + ' = ' + (dd - r))}이다.`,
          facts: { calc: [[`${dd}+${r}`, 0], [`${dd}-${r}`, 1]], derived: [dd, r] }
        });
      }, { standard: S2 }),
      // ① 평행하면 a⃗ = kb⃗, a⃗ · b⃗ > 0 이므로 k > 0 — 이차방정식의 음의 근을 버린다.
      H('hard-parallel', '평행한 두 벡터의 내적 조건', '②15', (d) => {
        const [p, q] = d.pick([[1, 2], [1, 3], [2, 1], [3, 1], [2, 3], [3, 2]]), w = d.int(1, 3), x = d.int(2, 3);
        const B2 = q * q * w, P = p * q * w, Qv = (p * p - q * q) * w, ans = x * P + B2;
        return N(`영벡터가 아닌 두 벡터 ${va}, ${jh(vb, '이/가')} 서로 평행하고 ${nb(dt(va, vb) + ' = ' + P)}, ${jh(nb('(' + va + ' + ' + vb + ') · (' + va + ' ' + MINUS + ' ' + vb + ') = ' + num(Qv)), '을/를')} 만족시킬 때, ${nb('(' + x + va + ' + ' + vb + ') · ' + vb)}의 값은?`, ans, {
          explain: `${nb(va + ' = ' + V('k') + vb)}(${V('k')}는 0이 아닌 실수)라 하면 ${nb(V('k') + '|' + vb + '|<sup>2</sup> = ' + P)}, ${nb('(' + V('k') + '<sup>2</sup> ' + MINUS + ' 1)|' + vb + '|<sup>2</sup> = ' + num(Qv))}이다. 두 식에서 ${nb(P + V('k') + '<sup>2</sup> ' + (Qv < 0 ? '+ ' + (-Qv) : MINUS + ' ' + Qv) + V('k') + ' ' + MINUS + ' ' + P + ' = 0')}이므로 ${nb(V('k') + ' = ' + tx(Q(p, q)))} 또는 ${nb(V('k') + ' = ' + MINUS + tx(Q(q, p)))}이다. ${nb(dt(va, vb) + ' &gt; 0')}이므로 ${V('k')} &gt; 0, 곧 ${nb(V('k') + ' = ' + tx(Q(p, q)))}, ${nb('|' + vb + '|<sup>2</sup> = ' + B2)}이다. 따라서 ${nb(x + dt(va, vb) + ' + |' + vb + '|<sup>2</sup> = ' + x * P + ' + ' + B2 + ' = ' + ans)}이다.`,
          facts: { value: `${x}*${P}+${P}*${q}/${p}`, derived: [p, q] }
        });
      }),
      // ② PQ⃗ 를 원의 중심을 거쳐 쪼개기 → 앞 항은 좌표로 → 뒤 항은 같은 방향일 때 최대(넷을 잇는다).
      H('hard-maxdot', '두 원이 든 정사각형에서 내적의 최댓값', '②24', (d) => {
        const L = 2 * d.int(4, 8), r = d.int(1, 3);
        if (L < 4 * r) return null;
        const V0 = L * L + r * r;
        if (isSquare(V0)) return null;
        const [c, t] = sqParts(V0), a0 = L * L - 2 * L * r + 2 * r * r, b0 = r * c;
        const k = 150 / L, Bp = [0, 150], A = [0, 0], Cp = [150, 150], D = [150, 0], c1 = [r * k, 150 - r * k], c2 = [150 - r * k, r * k], P = [0, 150 - r * k], Qp = at(c2, r * k, 180);
        const g = Board().poly([A, Bp, Cp, D]).disk(c1, r * k).disk(c2, r * k).seg(P, Cp).seg(P, Qp).dot(P).dot(Qp), cen = [75, 75];
        nameOut(g, A, 'A', cen); nameOut(g, Bp, 'B', cen); nameOut(g, Cp, 'C', cen); nameOut(g, D, 'D', cen); g.name(P, 'P', 180); g.name(Qp, 'Q', 125);
        const figure = g.svg(`한 변의 길이가 ${L}인 정사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위). 원 C₁은 변 AB, BC에 접하고 원 C₂는 변 AD, CD에 접한다. 두 원의 반지름의 길이는 ${r}. 점 P는 원 C₁과 변 AB의 접점, Q는 원 C₂ 위의 점이다.`);
        return inline(`그림과 같이 한 변의 길이가 ${L}인 정사각형 ABCD의 내부에 두 선분 AB, BC에 접하고 반지름의 길이가 ${r}인 원 C₁과 두 선분 AD, CD에 접하고 반지름의 길이가 ${r}인 원 C₂가 있다. 원 C₁과 선분 AB의 접점을 P, 원 C₂ 위의 점을 Q라 할 때, ${dt(vec('PC'), vec('PQ'))}의 최댓값을 구하시오.` + NOTE1, `{0} + {1}${rt('{2}')}`, [{ answer: a0 }, { answer: b0 }, { answer: t }], {
          figure, shown: `${a0} + ${b0 === 1 ? '' : b0}${rt(String(t))}`,
          explain: `원 C₂의 중심을 O₂라 하면 ${nb(dt(vec('PC'), vec('PQ')) + ' = ' + dt(vec('PC'), vec('PO₂')) + ' + ' + dt(vec('PC'), vec('O₂Q')))}이다. P를 원점, 직선 AB를 ${V('y')}축으로 놓으면 C(${L}, ${MINUS}${r}), O₂(${L - r}, ${L - 2 * r})이므로 ${nb(dt(vec('PC'), vec('PO₂')) + ' = ' + L + ' × ' + (L - r) + ' + (' + MINUS + r + ') × ' + (L - 2 * r) + ' = ' + a0)}이다. ${nb(ab(vec('PC')) + ' = ' + rt(String(V0)))}, ${nb(ab(vec('O₂Q')) + ' = ' + r)}이므로 ${dt(vec('PC'), vec('O₂Q'))}는 두 벡터의 방향이 같을 때 가장 크고 그 값은 ${nb((b0 === 1 ? '' : b0) + rt(String(t)))}이다. 따라서 최댓값은 ${nb(a0 + ' + ' + (b0 === 1 ? '' : b0) + rt(String(t)))}이다.`,
          facts: { calc: [[`${L}*${L}-2*${L}*${r}+2*${r}*${r}`, 0], [`${r}*${c}`, 1], [`(${L}*${L}+${r}*${r})/(${c}*${c})`, 2]], derived: [2, c] }
        });
      }),
      // ① 각이 가장 클 때의 자리(P = C, Q = D)를 그림에서 찾는다 ② 벡터 옮기기 → 크기 조건으로 cos → 수선의 발 → 두 배.
      H('hard-semicircle', '두 반원에서 두 벡터가 이루는 각이 최대일 때', '②25', (d) => {
        const R = d.int(2, 5), t = d.int(1, R - 1);
        if ((t * t) % R === 0) return null;
        const v = Q(2 * R * R - t * t, R), w = v.p / v.q, AE = 2 * R;
        const k = 220 / (2 * R + w);
        if ((t * t / R) * k < 14) return null;   // D와 E가 그림에서 붙지 않게
        const y0 = 0, A = [0, y0], O1 = [R * k, y0], E = [2 * R * k, y0], O2 = [(R + w) * k, y0], D = [w * k, y0], Bp = [(2 * R + w) * k, y0];
        const hgt = Math.sqrt(R * R - (w / 2) * (w / 2)) * k, Cp = [(R + w / 2) * k, y0 - hgt];
        const phi = Math.atan2(hgt, (w / 2) * k) * 180 / Math.PI, P = at(O1, R * k, (phi + 180) / 2), Qp = at(O2, R * k, 180 - phi * 0.3);
        const g = Board().seg(A, Bp).arc(O1, R * k, 0, 180).arc(O2, R * k, 0, 180).seg(O1, P).seg(O2, Qp).dot(O1).dot(O2).dot(Cp).dot(P).dot(Qp).dot(D).dot(E);
        g.name(A, 'A', 270).name(D, 'D', 240, 13).name(E, 'E', 300, 13).name(Bp, 'B', 270).name(O1, 'O₁', 270).name(O2, 'O₂', 270).name(Cp, 'C', 75).name(P, 'P', 150).name(Qp, 'Q', 200, 12);
        const figure = g.svg('선분 AB 위에 차례로 A, O₁, D, E, O₂, B가 있다. 선분 AE, DB를 지름으로 하는 두 반원이 같은 쪽에 그려져 점 C에서 만난다. 점 P는 호 AC 위, 점 Q는 호 DC 위의 점이다.');
        const vO1P = vec('O₁P'), vO2Q = vec('O₂Q');
        return qAns(`그림과 같이 선분 AB 위에 ${nb(SG('AE') + ' = ' + SG('DB') + ' = ' + AE)}인 두 점 D, E가 있다. 두 선분 AE, DB의 중점을 각각 O₁, O₂라 하고, 두 선분 AE, DB를 각각 지름으로 하는 두 반원의 호 AE, DB가 만나는 점을 C라 하자. 호 AC 위를 움직이는 점 P와 호 DC 위를 움직이는 점 Q에 대하여 두 벡터 ${vO1P}, ${jh(vO2Q, '이/가')} 이루는 각의 크기가 최대일 때 ${nb(ab(vO1P + ' + ' + vO2Q) + ' = ' + t)}이다. 선분 O₁O₂의 길이는? <span style="white-space:nowrap">(단, ${nb(R + ' &lt; ' + SG('O₁O₂') + ' &lt; ' + AE)})</span>`, v, {
          figure,
          explain: `${nb(vO2Q + ' = ' + vec('O₁G'))}인 점 G는 호 AC 쪽 반원 위에 있고, 두 벡터가 이루는 각이 가장 클 때 G는 A, P는 C의 자리에 있다. 이때 각의 크기를 ${jh(TH, '이라/라')} 하면 ${nb(sqH2(vec('O₁C') + ' + ' + vec('O₁A')) + ' = ' + R * R + ' ' + MINUS + ' 2 × ' + R + ' × ' + R + ' × ' + COS + '(180° ' + MINUS + ' ' + TH + ') + ' + R * R + ' = ' + t * t)}이므로 ${nb(COS + '(180° ' + MINUS + ' ' + TH + ') = ' + tx(Q(2 * R * R - t * t, 2 * R * R)))}이다. C에서 직선 AB에 내린 수선의 발을 H라 하면 ${nb(SG('O₁H') + ' = ' + R + ' × ' + tx(Q(2 * R * R - t * t, 2 * R * R)) + ' = ' + tx(Q(2 * R * R - t * t, 2 * R)))}이고 ${nb(SG('O₁H') + ' = ' + SG('HO₂'))}이므로 ${nb(SG('O₁O₂') + ' = ' + tx(v))}이다.`,
          facts: { value: `(2*(${AE}/2)*(${AE}/2)-${t}*${t})/(${AE}/2)`, derived: [2] }
        });
      }),
      // ① θ 가 가장 클 때 cos θ 가 가장 작다 ② 두 벡터 → cos 을 변수의 식으로 → 크기가 같아 한 식으로 → 최솟값.
      H('hard-cosmin', '좌표축 위의 점에서 본 각의 cos 최솟값', '②38', (d) => {
        const CIRC = { 5: [1, 2], 10: [1, 3], 13: [2, 3], 25: [3, 4], 17: [1, 4] };
        const R2 = Number(d.pick(Object.keys(CIRC))), [s0, l0] = CIRC[R2];
        const pts = []; for (const [x, z] of [[s0, l0], [l0, s0]]) for (const sx of [1, -1]) for (const sz of [1, -1]) pts.push([sx * x, sz * z]);
        if (R2 === 25) pts.push([5, 0], [-5, 0], [0, 5], [0, -5]);
        const [p1, p2] = [d.pick(pts), d.pick(pts)], m = p1[0] * p2[0] + p1[1] * p2[1], c = d.int(-3, 4);
        if (m === 0 || Math.abs(m) === R2) return null;
        const A = [p1[0], c, p1[1]], P = [p2[0], c, p2[1]], v = Q(m, R2);
        const s = V('s'), u = poly([[c, ''], [-1, s]]);
        return qAns(`좌표공간의 두 점 ${pt('A', A)}, ${jh(pt('B', P), '과/와')} ${V('y')}축 위를 움직이는 점 P에 대하여 ${nb('∠APB = ' + TH)}라 할 때, ${COS} ${TH}의 최솟값은?`, v, {
          signed: true,
          explain: `P(0, ${s}, 0)이라 하면 ${nb(vec('PA') + ' = ' + tup([p1[0], u, p1[1]]))}, ${nb(vec('PB') + ' = ' + tup([p2[0], u, p2[1]]))}이므로 ${nb(dt(vec('PA'), vec('PB')) + ' = ' + num(m) + ' + (' + u + ')<sup>2</sup>')}, ${nb(ab(vec('PA')) + '<sup>2</sup> = ' + ab(vec('PB')) + '<sup>2</sup> = ' + R2 + ' + (' + u + ')<sup>2</sup>')}이다. ${nb('(' + u + ')<sup>2</sup> = ' + V('u'))}라 하면 ${nb(COS + ' ' + TH + ' = ' + frac(num(m) + ' + ' + V('u'), R2 + ' + ' + V('u')) + ' = 1 ' + MINUS + ' ' + frac(R2 - m, R2 + ' + ' + V('u')))}이고 ${V('u')} ≥ 0이므로 ${nb(V('u') + ' = 0')}일 때 가장 작은 값 ${jh(tx(v), '을/를')} 갖는다.`,
          facts: { value: `(${jn(p1[0])}*${jn(p2[0])}+${jn(p1[1])}*${jn(p2[1])})/(${jn(p1[0])}*${jn(p1[0])}+${jn(p1[1])}*${jn(p1[1])})` }
        });
      }),
      // ② 수선의 발(내적이 0) → 높이 → 한 변 → 끼인각 60°로 내적(넷을 잇는다).
      H('hard-equi', '직선 위에 두 꼭짓점이 있는 정삼각형의 내적', '②39', (d) => {
        const A = [d.int(-4, 4), d.int(-4, 4)], q0 = [d.int(-3, 4), d.int(-3, 4)], u = [nz(d, -3, 3), nz(d, -3, 3)];
        const uu = u[0] * u[0] + u[1] * u[1], cross = u[0] * (A[1] - q0[1]) - u[1] * (A[0] - q0[0]), v = Q(2 * cross * cross, 3 * uu);
        if (cross === 0 || v.q === 1 || (Math.abs(u[0]) === Math.abs(u[1]) && Math.abs(u[0]) > 1)) return null;
        const side = (nm, q, k0) => { const top = poly([[1, nm], [-q, '']]); return k0 === 1 ? top : k0 === -1 ? poly([[q, ''], [-1, nm]]) : frac(top, num(k0)); };
        const line = nb(side(vx, q0[0], u[0]) + ' = ' + side(vy, q0[1], u[1]));
        const t0 = Q((A[0] - q0[0]) * u[0] + (A[1] - q0[1]) * u[1], uu), Hh = [Q(q0[0] * t0.q + u[0] * t0.p, t0.q), Q(q0[1] * t0.q + u[1] * t0.p, t0.q)], h2 = Q(cross * cross, uu);
        const crossE = `(${jn(u[0])}*(${jn(A[1])}-${jn(q0[1])})-${jn(u[1])}*(${jn(A[0])}-${jn(q0[0])}))`;
        return qAns(`좌표평면 위의 점 ${jh(pt('A', A), '과/와')} 직선 ${nb('l: ' + line)} 위의 두 점 B, C에 대하여 삼각형 ABC가 정삼각형일 때, ${dt(vec('BA'), vec('BC'))}의 값은?`, v, {
          explain: `직선 l의 방향벡터는 ${nb(vec('u') + ' = ' + tup(u))}이다. A에서 직선 l에 내린 수선의 발 H에 대하여 ${nb(dt(vec('AH'), vec('u')) + ' = 0')}이므로 H${tup([tx(Hh[0]), tx(Hh[1])])}이고 ${nb(SG('AH') + '<sup>2</sup> = ' + tx(h2))}이다. 정삼각형의 한 변의 길이를 ${jh(V('a'), '이라/라')} 하면 ${nb(frac(rt('3'), 2) + V('a') + ' = ' + SG('AH'))}이므로 ${nb(V('a') + '<sup>2</sup> = ' + tx(Q(4 * cross * cross, 3 * uu)))}이고, ${nb(dt(vec('BA'), vec('BC')) + ' = ' + V('a') + '<sup>2</sup>' + COS + ' 60° = ' + tx(v))}이다.`,
          facts: { value: `2*${crossE}*${crossE}/(3*(${jn(u[0])}*${jn(u[0])}+${jn(u[1])}*${jn(u[1])}))`, derived: [2, 3] }
        });
      })
    ]
  });
  function sqH2(h) { return '|' + h + '|<sup>2</sup>'; }
})(typeof window !== 'undefined' ? window : globalThis);
