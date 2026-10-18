// 중학교 3학년 2학기 3단원 원과 직선 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-2-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 수선의 발이 이등분하는 것은 「그 원의」 현이다. 두 원에 걸친 직선에서는 원마다 따로 이등분한다(한 원의 현처럼 AB 의 중점을 찾는다).
//  - 길이를 구하려면 모르는 것을 모두 알아야 한다고 여긴다. 접선의 길이로 둘레를 바꾸면(△PBQ 의 둘레 = 2BD) 접선 PQ 가 어디에 있든 둘레가 같다.
//  - 접점은 변의 중점이라고 여긴다. 접점까지의 길이는 꼭짓점마다 다르고, 이웃한 두 삼각형의 내접원이 한 점에서 만나면 그 점까지의 길이를 두 삼각형이 함께 가진다.
//  - 작은 원에 접하는 서로 수직인 두 현에서 교점까지의 길이를 반지름으로 착각한다(중심, 두 접점, 교점이 정사각형을 이룬다).
// 실력에는 ① 문제의 그림·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(활꼴의 높이로 반지름 ①7·8, 직사각형의 세 변에 접하는 원 ①71·72, 빗변 위 두 조각으로 반지름 ①49, 동심원 사이의 넓이 ①13)은 기본에 두었다.
// 맞닿은 두 원(①73 심18·19·20·21)은 교육과정의 「두 원의 위치 관계」가 아니라 접선의 성질과 피타고라스 정리로 푸는 문항이다. 「맞닿은 두 원의 중심 사이의 거리는 두 반지름의 길이의 합」을 문제 글에 밝혀 둔다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { V, nb, rt, grp, radText } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT, WHITE, Board } = B.kit.mgeo;
  const K = B.kit.m923;
  const { UNIT, R_, X, sg, cm, deg, eq, is, perp, sq, sup2, gcd, jo, rad, rootOf, cmQ, degQ, cm2Q, xQ, fracQ, piQ, piF, radQ, sumRad, pickOne, fin, triple, isSq, split, foot, along, inOf, sssTri, fitPts, scene, inscribed, inTri, inScene, IN_HEAD, IN_SAY } = K;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: (/심/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')', make }, more || {});
  const TOUCH = '(단, 맞닿은 두 원의 중심 사이의 거리는 두 원의 반지름의 길이의 합과 같다.)';
  const Op = 'O′', Opp = 'O″';
  // 원과 직선 pq(p 는 원 위의 점)의 다른 한 교점
  const second = (c, p, q) => { const L = dist(p, q), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], t = 2 * ((c[0] - p[0]) * u[0] + (c[1] - p[1]) * u[1]); return [p[0] + u[0] * t, p[1] + u[1] * t]; };
  // 꼭짓점 A 에서 부채처럼 펼친 삼각형들. len: [AB, AC, AD, …], out: [BC, CD, …]. 이웃한 두 삼각형은 변을 함께 가진다.
  function fanPts(len, out, names) {
    const angs = out.map((o, i) => Math.acos((len[i] * len[i] + len[i + 1] * len[i + 1] - o * o) / (2 * len[i] * len[i + 1])) / RAD), total = angs.reduce((s, v) => s + v, 0), P0 = { A: [0, 0] };
    let a = -total / 2;
    names.forEach((n, i) => { P0[n] = at([0, 0], len[i], a); if (i < angs.length) a += angs[i]; });
    const circles = [];
    for (let i = 0; i + 1 < names.length; i += 1) { const p = P0[names[i]], q = P0[names[i + 1]], c = inOf(P0.A, p, q); circles.push([c, dist(c, foot(c, p, q))]); }
    const P = fitPts(P0, [215, 190], circles);
    return { P, circles: circles.map(([c, r]) => [[(c[0] - P0.A[0]) * P.k + P.A[0], (c[1] - P0.A[1]) * P.k + P.A[1]], r * P.k]), total };
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: K.STD,
    types: [
      // ── ① 그림·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-two-circle-chord', '두 원에 걸친 직선 위에서 두 중심에서 내린 수선의 발 사이의 거리', '심2', (d) => {
        // 함정: AB 를 한 원의 현으로 보고 AB 의 중점을 찾거나, 반지름이 없어 못 푼다고 여긴다. M 은 현 AP 의, N 은 현 PB 의 중점이다.
        const L = 2 * d.int(5, 13), R1 = 5, R2 = d.pick([3.6, 4.2, 4.6]), dd = d.pick([6.2, 6.8, 7.2]), ph = d.pick([-14, -8, 6, 12]);
        const x = (dd * dd + R1 * R1 - R2 * R2) / (2 * dd), Pp = [x, -Math.sqrt(R1 * R1 - x * x)], Qq = [x, Math.sqrt(R1 * R1 - x * x)], O = [0, 0], O2 = [dd, 0], u = at(Pp, 1, ph);
        const A = second(O, Pp, at(Pp, 1, 180 + ph)), Bp = second(O2, Pp, u), P = fitPts({ O, Op: O2, P: Pp, Q: Qq, A, B: Bp, M: mid(A, Pp), N: mid(Pp, Bp) }, [230, 170], [[O, R1], [O2, R2]]);
        const S = scene(P).ring('O', R1).ring('Op', R2).seg('AB OM Op-N').right('O-M-A Op-N-P').dot('O').dot('PQ').names({ M: [320, 14], N: [320, 14] });
        S.b.dot(P.Op).text(at(P.Op, 12, 300), Op);
        return cmQ(`다음 그림과 같이 두 원 O, ${Op}이 두 점 P, Q에서 만난다. 점 P를 지나는 직선이 원 O와 만나는 다른 한 점을 A, 원 ${Op}과 만나는 다른 한 점을 B라 하고, 두 원의 중심 O, ${Op}에서 ${jo(sg('AB'), '에/에')} 내린 수선의 발을 각각 M, N이라 하자. ${is('AB', L)}일 때, ${jo(sg('MN'), '의/의')} 길이는?`, L / 2, {
          figure: S.svg(`두 원 O, O′이 두 점 P, Q에서 만난다. 점 P를 지나는 직선이 원 O와 점 A에서, 원 O′과 점 B에서 만나고 점 P는 선분 AB 위에 있다. 원의 중심 O, O′에서 선분 AB에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다`),
          explain: `${sg('AP')}는 원 O의 현이므로 중심 O에서 내린 수선은 이 현을 이등분하고 ${eq('AM', 'MP')}이다. 같은 방법으로 ${sg('PB')}는 원 ${Op}의 현이므로 ${eq('PN', 'NB')}이다. ${sg('MN')} = ${sg('MP')} + ${sg('PN')} = ${frac(1, 2)}(${sg('AP')} + ${sg('PB')}) = ${frac(1, 2)} × ${L} = ${L / 2}(cm)이다.`,
          facts: { calc: [[`${L}/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-ring-cross', '작은 원에 접하는 서로 수직인 큰 원의 두 현', '심5·6', (d, n) => {
        // 함정: 교점 P 에서 접점까지를 모른다고 여긴다. 중심 O, 두 접점 Q, R, 교점 P 는 한 변이 작은 원의 반지름인 정사각형의 꼭짓점이다.
        const [r, q, R] = triple(d, ([a, b, c]) => a < b && a >= 0.3 * c && a <= 0.62 * c && b <= 16), O = [0, 0];
        const P = fitPts({ O, A: [r, q], B: [r, -q], Q: [r, 0], C: [-q, -r], D: [q, -r], R: [0, -r], P: [r, -r] }, [180, 180], [[O, R]]);
        const S = scene(P).ring('O', R).ring('O', r).seg('AB CD OQ OR').right('OQA ORD BPD').dot('O').names({ O: 225, P: [315, 12], Q: [0, 11], R: [90, 11] });
        const head = `다음 그림과 같이 중심이 O로 같은 두 원의 반지름의 길이가 각각 ${r} cm, ${R} cm이다. 큰 원의 두 현 AB, CD가 작은 원에 각각 점 Q, R에서 접하고 점 P에서 수직으로 만난다. (단, 점 Q는 두 점 A, P 사이에 있다.)`;
        const why = `원의 접선은 그 접점을 지나는 반지름과 수직이므로 ∠OQP = ∠ORP = 90°이고 ∠QPR = 90°, ${eq('OQ', 'OR')}이므로 □OQPR는 한 변의 길이가 ${r} cm인 정사각형이다. 직각삼각형 OAQ에서 ${sg('AQ')} = ${rootOf(`${sq(R)} − ${sq(r)}`)} = ${q}(cm)이고, 수선은 현을 이등분하므로 ${sg('BQ')} = ${q} cm이다.`;
        if (n === 0) return cmQ(`${head} ${jo(sg('AP'), '의/의')} 길이는?`, q + r, {
          figure: S.svg(`중심이 O로 같은 큰 원과 작은 원. 큰 원의 두 현 AB, CD가 작은 원에 각각 점 Q, R에서 접하고 점 P에서 수직으로 만난다. 선분 OQ, OR가 그어져 있고 Q, R, P에 직각 표시가 있다`),
          explain: `${why} 따라서 ${sg('AP')} = ${sg('AQ')} + ${sg('QP')} = ${q} + ${r} = ${q + r}(cm)이다.`,
          facts: { calc: [[`(${R}*${R}-${r}*${r})**0.5+${r}`, 0]] }
        });
        const g = gcd(q + r, q - r);
        return Object.assign(fin(inline(`${head} ${nb(`${sg('AP')} : ${sg('BP')}`)}를 가장 간단한 자연수의 비로 나타내시오.`, grp('{0} : {1}'), [{ answer: (q + r) / g }, { answer: (q - r) / g }], {
          shown: `${(q + r) / g} : ${(q - r) / g}`,
          figure: S.svg(`중심이 O로 같은 큰 원과 작은 원. 큰 원의 두 현 AB, CD가 작은 원에 각각 점 Q, R에서 접하고 점 P에서 수직으로 만난다. 선분 OQ, OR가 그어져 있고 Q, R, P에 직각 표시가 있다`),
          explain: `${why} ${sg('AP')} = ${q} + ${r} = ${q + r}(cm), ${sg('BP')} = ${q} − ${r} = ${q - r}(cm)이므로 ${nb(`${sg('AP')} : ${sg('BP')}`)} = ${q + r} : ${q - r} = ${(q + r) / g} : ${(q - r) / g}이다.`,
          facts: { calc: [[`((${R}*${R}-${r}*${r})**0.5+${r})/${g}`, 0], [`((${R}*${R}-${r}*${r})**0.5-${r})/${g}`, 1]], unseen: [g] }
        })), {});
      }, { count: 2 }),
      H('hard-cap-circle', '현과 원에 접하는 활꼴 안의 가장 큰 원', '심8', (d) => {
        // 함정: 작은 원의 중심이 현 AB 의 중점에 있다고 여기거나 반지름을 활꼴의 높이로 둔다. 가장 큰 원의 지름이 활꼴의 높이이다.
        const [hh, w, R] = triple(d, ([a, b, c]) => a < b && a >= 0.35 * b && (c - a) % 2 === 0 && c <= 30), rho = (R - hh) / 2, O = [0, 0];
        const P = fitPts({ O, A: [-w, -hh], B: [w, -hh], M: [0, -hh], Op: [0, -hh - rho] }, [175, 175], [[O, R]]);
        const S = scene(P).ring('O', R).ring('Op', rho).seg('AB OA').seg('OM', 'cut').right('OMB').dot('O').len('OA', cm(R), 'M').names({ M: [330, 16] });
        S.b.dot(P.Op, 2.2).text(at(P.Op, rho * P.k + 10, 0), Op);
        return cmQ(`다음 그림과 같이 반지름의 길이가 ${R} cm인 원 O에 길이가 ${2 * w} cm인 현 AB를 그었다. 현 AB와 원 O에 모두 접하고 원의 중심 O를 포함하지 않는 쪽에 있는 가장 큰 원 ${Op}의 반지름의 길이는?`, rho, {
          figure: S.svg(`원 O와 현 AB. 현 AB와 원 O 사이의 활꼴 안에 현과 원에 모두 접하는 원 O′이 있다. 원의 중심 O에서 현 AB에 내린 수선의 발 M까지 점선이 그어져 있다. 반지름 OA의 길이는 ${R} cm`),
          explain: `원의 중심 O에서 현 AB에 내린 수선의 발을 M이라 하면 ${sg('AM')} = ${w} cm이고 ${sg('OM')} = ${rootOf(`${sq(R)} − ${sq(w)}`)} = ${hh}(cm)이다. 활꼴의 높이(선분 OM을 늘여 원과 만나는 점까지)는 ${R} − ${hh} = ${R - hh}(cm)이고, 이 활꼴 안에 들어가는 가장 큰 원의 지름이 그 높이와 같으므로 반지름의 길이는 ${R - hh} ÷ 2 = ${rho}(cm)이다.`,
          facts: { calc: [[`(${R}-(${R}*${R}-${2 * w}*${2 * w}/4)**0.5)/2`, 0]], unseen: [2, 4] }
        });
      }),
      H('hard-pq-perim', '내접원에 접하는 선분이 자른 삼각형의 둘레', '①53 심14', (d) => {
        // 함정: P, Q 의 자리를 몰라 못 푼다고 여긴다. 둘레를 접선의 길이로 바꾸면 2BD 로 정해진다.
        const [p, q, s] = d.until(() => [d.int(3, 9), d.int(3, 9), d.int(3, 9)], (w) => new Set(w).size === 3 && w[1] >= 0.55 * Math.max(w[0], w[2]));
        const P = inTri(p, q, s, { more: (T0, O) => { const r = Math.sqrt(p * q * s / (p + q + s)), Tt = along(O, T0.B, r), v = at(Tt, 10, dirOf(O, T0.B) + 90); return { P: meet(Tt, v, T0.A, T0.B), Q: meet(Tt, v, T0.B, T0.C), tt: Tt }; } });
        const S = scene(P); S.b.poly([P.P, P.B, P.Q], TINT);
        S.ring('O', P.r).poly('ABC').seg('PQ').dot('O').names({ tt: null });
        return cmQ(`다음 그림에서 원 O는 △ABC의 내접원이고 세 점 D, E, F는 접점이다. 선분 PQ가 원 O에 접하고 ${is('AB', p + q)}, ${is('BC', q + s)}, ${is('CA', p + s)}일 때, △PBQ의 둘레의 길이는?`, 2 * q, {
          figure: S.svg(`${IN_SAY}변 AB 위의 점 P와 변 BC 위의 점 Q를 이은 선분 PQ가 내접원에 접하고, 삼각형 PBQ가 색칠되어 있다. 변 AB의 길이는 ${p + q} cm, 변 BC의 길이는 ${q + s} cm, 변 CA의 길이는 ${p + s} cm`),
          explain: `선분 PQ가 원에 접하는 점을 T라 하면 ${eq('PT', 'PD')}, ${eq('QT', 'QE')}이므로 △PBQ의 둘레의 길이는 ${sg('BP')} + ${sg('PD')} + ${sg('QE')} + ${sg('BQ')} = ${sg('BD')} + ${sg('BE')} = 2${sg('BD')}이다. ${sg('BD')} = ${X} cm라 하면 ${sg('AD')} = ${sg('AF')} = (${p + q} − ${X}) cm, ${sg('CE')} = ${sg('CF')} = (${q + s} − ${X}) cm이고 (${p + q} − ${X}) + (${q + s} − ${X}) = ${p + s}에서 ${X} = ${q}이다. 따라서 둘레의 길이는 2 × ${q} = ${2 * q}(cm)이다.`,
          facts: { calc: [[`${p + q}+${q + s}-${p + s}`, 0]] }
        });
      }),
      H('hard-rect-two-in', '직사각형의 대각선이 나눈 두 삼각형의 내접원과 대각선의 접점', '심15', (d) => {
        // 함정: 두 접점이 대각선의 중점에 대하여 아무 데나 있다고 여기거나 반지름부터 구하려 한다. 꼭짓점에서 접점까지의 길이만으로 정해진다.
        const [h, w, c] = triple(d, ([a, b]) => a < b && a >= 0.45 * b && b <= 24), r = (w + h - c) / 2;
        const A = [0, -h], Bp = [0, 0], Cp = [w, 0], Dp = [w, -h], I1 = [r, -r], I2 = [w - r, -h + r];
        const P = fitPts({ A, B: Bp, C: Cp, D: Dp, O: I1, Op: I2, P: foot(I1, A, Cp), Q: foot(I2, A, Cp) }, [220, 160], [[I1, r], [I2, r]]);
        const S = scene(P).ring('O', r).ring('Op', r).poly('ABCD').seg('AC').dot('O').dot('PQ').names({ P: [dirOf(P.O, P.P), 11], Q: [dirOf(P.Op, P.Q), 11] });
        S.b.dot(P.Op).text(at(P.Op, 12, 90), Op);
        return cmQ(`다음 그림과 같이 가로, 세로의 길이가 각각 ${w} cm, ${h} cm인 직사각형 ABCD에서 원 O는 △ABC의 내접원, 원 ${Op}은 △ACD의 내접원이다. 두 원이 대각선 AC에 접하는 점을 각각 P, Q라 할 때, ${jo(sg('PQ'), '의/의')} 길이는?`, w - h, {
          figure: S.svg(`직사각형 ABCD와 대각선 AC. 삼각형 ABC의 내접원 O와 삼각형 ACD의 내접원 O′이 대각선 AC에 각각 점 P, Q에서 접한다`),
          explain: `${sg('AC')} = ${rootOf(`${sq(w)} + ${sq(h)}`)} = ${c}(cm)이다. △ABC에서 꼭짓점에서 접점까지의 길이를 생각하면 ${sg('AP')} = (${sg('AB')} + ${sg('AC')} − ${sg('BC')}) ÷ 2 = (${h} + ${c} − ${w}) ÷ 2 = ${(h + c - w) / 2}(cm)이다. 같은 방법으로 △ACD에서 ${sg('CQ')} = (${sg('CD')} + ${sg('CA')} − ${sg('AD')}) ÷ 2 = ${(h + c - w) / 2}(cm)이다. 따라서 ${sg('PQ')} = ${c} − 2 × ${(h + c - w) / 2} = ${w - h}(cm)이다.`,
          facts: { calc: [[`${w}-${h}`, 0]] }
        });
      }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-equi-dist', '중심에서 두 변까지의 거리와 한 각으로 삼각형의 넓이 구하기', '①28', (d) => {
        const m = d.int(1, 6), P = inscribed(60, 60, 10, { more: (Q) => ({ M: foot(Q.O, Q.A, Q.B), N: foot(Q.O, Q.B, Q.C) }) });
        const S = scene(P); S.b.poly([P.A, P.B, P.C], TINT);
        S.ring('O', 10).poly('ABC').seg('OM ON').right('OMA ONC').tick('OM ON', 2).dot('O').ang('ACB', '60°').names();
        return radQ(`다음 그림과 같이 원 O에 내접하는 △ABC에서 원의 중심 O에서 두 변 AB, BC에 내린 수선의 발을 각각 M, N이라 하자. ${nb(`${sg('OM')} = ${sg('ON')} = ${m} cm`)}, ∠ACB = 60°일 때, △ABC의 넓이는?`, 3 * m * m, 3, 'cm²', {
          figure: S.svg(`원 O에 내접하는 삼각형 ABC가 색칠되어 있다. 원의 중심 O에서 변 AB, BC에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. ∠ACB의 크기는 60°`),
          explain: `${eq('OM', 'ON')}이므로 ${eq('AB', 'BC')}이고 ∠BAC = ∠ACB = 60°이므로 △ABC는 정삼각형이다. 정삼각형의 외심 O는 각의 이등분선 위에 있으므로 ∠OAM = 30°이고, 직각삼각형 OAM에서 ${sg('OA')} = 2${sg('OM')} = ${2 * m}(cm), ${sg('AM')} = ${rootOf(`${sq(2 * m)} − ${sq(m)}`)} = ${radText(m, 3)}(cm)이다. 따라서 한 변의 길이는 ${radText(2 * m, 3)} cm이다. 꼭짓점 A에서 변 BC에 내린 수선은 점 O와 N을 지나므로 높이는 ${sg('AO')} + ${sg('ON')} = ${2 * m} + ${m} = ${3 * m}(cm)이고, 넓이는 ${frac(1, 2)} × ${radText(2 * m, 3)} × ${3 * m} = ${radText(3 * m * m, 3)}(cm²)이다.`,
          facts: { calc: [[`3*${m}*${m}`, 0], ['3', 1]], unseen: [3] }
        });
      }),
      H('hard-semi-ring-ch', '작은 반원에 접하는 큰 반원의 현에서 지름에 내린 수선', '심3', (d) => {
        const [r, be, R] = triple(d, ([a, b, c]) => a < c && a >= 0.4 * c && c <= 30 && (2 * b * a) % c !== 0 && Math.abs(c - 2 * a * a / c) >= 0.2 * c), al = Math.acos(r / R) / RAD, O = [0, 0], Bp = [-R, 0], E = at(O, r, 180 - al), Cp = [2 * E[0] - Bp[0], 2 * E[1] - Bp[1]];
        const P = fitPts({ O, A: [R, 0], B: Bp, E, C: Cp, H: [Cp[0], 0], top: [0, -R] }, [220, 125]);
        const S = scene(P).arc('O', R, 0, 180).arc('O', r, 0, 180).seg('AB BC OE CH').right('OEC CHA').dot('O').names({ O: 270, H: 270, E: [dirOf(P.E, P.O) + 35, 13] });
        return fracQ(`다음 그림과 같이 중심이 O로 같은 두 반원에서 큰 반원의 현 BC가 작은 반원에 점 E에서 접한다. 두 반원의 반지름의 길이가 각각 ${R} cm, ${r} cm이고 ${perp('CH', 'AB')}일 때, ${jo(sg('CH'), '의/의')} 길이는?`, 2 * be * r, R, 'cm', {
          figure: S.svg(`중심이 O로 같은 큰 반원과 작은 반원, 큰 반원의 지름 AB. 큰 반원의 현 BC가 작은 반원에 점 E에서 접하고, 점 C에서 지름 AB에 내린 수선의 발이 H이다. E와 H에 직각 표시가 있다`),
          explain: `${perp('OE', 'BC')}이므로 직각삼각형 BOE에서 ${sg('BE')} = ${rootOf(`${sq(R)} − ${sq(r)}`)} = ${be}(cm)이고, 수선은 현을 이등분하므로 ${sg('BC')} = ${2 * be} cm이다. △BCH와 △BOE는 ∠B가 공통이고 ∠BHC = ∠BEO = 90°이므로 닮음(AA 닮음)이다. ${nb(`${sg('BC')} : ${sg('BO')} = ${sg('CH')} : ${sg('OE')}`)}에서 ${2 * be} : ${R} = ${sg('CH')} : ${r}이므로 ${sg('CH')} = ${frac((2 * be * r) / gcd(2 * be * r, R), R / gcd(2 * be * r, R))} cm이다.`,
          facts: { value: `2*(${R}*${R}-${r}*${r})**0.5*${r}/${R}`, unseen: [2] }
        });
      }),
      H('hard-obc-perim', '직각삼각형의 내접원의 중심과 빗변의 두 끝이 이루는 삼각형의 둘레', '①51', (d) => {
        const [p, q, c] = triple(d, ([x, y, z]) => { const r = (x + y - z) / 2, a = (x - r) ** 2 + r * r, b = (y - r) ** 2 + r * r; return x < y && y <= 2.6 * x && !isSq(a) && !isSq(b) && split(a)[0] >= 2 && split(b)[0] >= 2 && split(a)[1] !== split(b)[1] && z <= 30; });
        const r = (p + q - c) / 2, m = p - r, n = q - r, [s1, m1] = split(m * m + r * r), [s2, m2] = split(n * n + r * r);
        const P = inTri(r, m, n), S = scene(P); S.b.poly([P.O, P.B, P.C], TINT);
        S.ring('O', P.r).poly('ABC').seg('OB OC').seg('OD OE OF', 'thin').right('BAC OEB').dot('O').names();
        const Rx = `((-(${m}+${n})+((${m}+${n})*(${m}+${n})+4*${m}*${n})**0.5)/2)`;
        return fin(inline(`다음 그림에서 원 O는 ∠A = 90°인 직각삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. ${is('BE', m)}, ${is('CE', n)}일 때, △OBC의 둘레의 길이는? (단, 근호 안의 수는 가장 작은 자연수로 적는다.)`, grp('({0} + {1}' + rt('{2}')) + ' ' + grp('+ {3}' + rt('{4}') + ') cm'), [{ answer: m + n }, { answer: s1 }, { answer: m1 }, { answer: s2 }, { answer: m2 }], {
          shown: `(${m + n} + ${radText(s1, m1)} + ${radText(s2, m2)}) cm`, blocks: [[1, 2], [3, 4]],
          figure: S.svg(`직각삼각형 ABC와 그 내접원 O. ∠A에 직각 표시가 있다. 내접원이 세 변 AB, BC, CA에 접하는 점이 각각 D, E, F이고 반지름 OD, OE, OF가 그어져 있다. 삼각형 OBC가 색칠되어 있다. 선분 BE의 길이는 ${m} cm, 선분 CE의 길이는 ${n} cm`),
          explain: `반지름의 길이를 ${R_} cm라 하면 □ADOF는 정사각형이므로 ${sg('AB')} = (${R_} + ${m}) cm, ${sg('AC')} = (${R_} + ${n}) cm이고 (${R_} + ${m})${sup2} + (${R_} + ${n})${sup2} = ${sq(m + n)}에서 ${R_} = ${r}이다. ${perp('OE', 'BC')}이므로 ${sg('OB')} = ${rootOf(`${sq(m)} + ${sq(r)}`)} = ${radText(s1, m1)}(cm), ${sg('OC')} = ${rootOf(`${sq(n)} + ${sq(r)}`)} = ${radText(s2, m2)}(cm)이다. 둘레의 길이는 (${m + n} + ${radText(s1, m1)} + ${radText(s2, m2)}) cm이다.`,
          facts: { calc: [[`${m}+${n}`, 0], [`((${m}*${m}+${Rx}*${Rx})/${m1})**0.5`, 1], [`${m1}`, 2], [`((${n}*${n}+${Rx}*${Rx})/${m2})**0.5`, 3], [`${m2}`, 4]], unseen: [4, 2, m1, m2] }
        }));
      }),
      H('hard-semi-in-right', '직각삼각형의 빗변 위에 지름이 있는 반원이 두 변에 접할 때 반지름', '심10', (d) => {
        const [a, b, c] = triple(d, ([x, y, z]) => x !== y && Math.max(x, y) <= 2.6 * Math.min(x, y) && (x * y) % (x + y) !== 0 && z <= 30), r = a * b / (a + b);
        const T0 = sssTri(c, b, a), O = [c * a / (a + b), 0], P = fitPts({ A: T0.A, B: T0.B, C: T0.C, O, D: foot(O, T0.A, T0.B), F: foot(O, T0.A, T0.C) }, [220, 150]);
        const S = scene(P).arc('O', r, 0, 180).poly('ABC').seg('OD OF', 'thin').right('BAC ODB OFC').dot('O').names({ O: 270 });
        return fracQ(`다음 그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 ${is('BC', c)}, ${is('CA', b)}이다. 지름이 빗변 BC 위에 있는 반원 O가 두 변 AB, CA에 각각 점 D, F에서 접할 때, 반원 O의 반지름의 길이는?`, a * b, a + b, 'cm', {
          figure: S.svg(`직각삼각형 ABC와 지름이 빗변 BC 위에 있는 반원 O. 반원이 변 AB에 점 D에서, 변 CA에 점 F에서 접하고 반지름 OD, OF가 그어져 있다. A, D, F에 직각 표시가 있다. 변 BC의 길이는 ${c} cm, 변 CA의 길이는 ${b} cm`),
          explain: `${sg('AB')} = ${rootOf(`${sq(c)} − ${sq(b)}`)} = ${a}(cm)이다. 반지름의 길이를 ${R_} cm라 하면 ${perp('OD', 'AB')}, ${perp('OF', 'CA')}이고 ${eq('OD', 'OF')} = ${R_} cm이다. △ABC의 넓이는 △ABO와 △AOC의 넓이의 합이므로 ${frac(1, 2)} × ${a} × ${b} = ${frac(1, 2)} × ${a} × ${R_} + ${frac(1, 2)} × ${b} × ${R_}, ${a + b}${R_} = ${a * b}이고 ${R_} = ${frac(a * b / gcd(a * b, a + b), (a + b) / gcd(a * b, a + b))}이다.`,
          facts: { value: `(${c}*${c}-${b}*${b})**0.5*${b}/((${c}*${c}-${b}*${b})**0.5+${b})` }
        });
      }),
      H('hard-right-trap-circle', '원에 외접하는 직각사다리꼴의 두 밑변으로 원의 둘레 구하기', '심11', (d) => {
        const [a, b] = d.until(() => [d.int(3, 12), d.int(4, 18)], ([x, y]) => x < y && x >= 0.35 * y && (2 * x * y) % (x + y) !== 0), r = a * b / (a + b), O = [-r, -r];
        const P = fitPts({ D: [0, -2 * r], C: [0, 0], A: [-a, -2 * r], B: [-b, 0], O }, [200, 150], [[O, r]]), S = scene(P).ring('O', r).poly('ABCD').dot('O').right('BCD CDA').len('AD', cm(a), 'O').len('BC', cm(b), 'O').names();
        const g = gcd(2 * a * b, a + b);
        return piF(`다음 그림과 같이 ${nb(`${sg('AD')} ∥ ${sg('BC')}`)}이고 ∠C = ∠D = 90°인 사다리꼴 ABCD가 원 O에 외접한다. ${is('AD', a)}, ${is('BC', b)}일 때, 원 O의 둘레의 길이는?`, 2 * a * b, a + b, 'cm', {
          figure: S.svg(`원 O에 외접하는 사다리꼴 ABCD. 윗변 AD와 아랫변 BC가 평행하고 ∠C와 ∠D에 직각 표시가 있다. 변 AD의 길이는 ${a} cm, 변 BC의 길이는 ${b} cm`),
          explain: `반지름의 길이를 ${R_} cm라 하면 ${sg('CD')} = 2${R_} cm이고, ${sg('AB')} + ${sg('CD')} = ${sg('AD')} + ${sg('BC')}에서 ${sg('AB')} = (${a + b} − 2${R_}) cm이다. 점 A에서 변 BC에 내린 수선의 발을 H라 하면 ${sg('BH')} = ${b - a} cm, ${sg('AH')} = 2${R_} cm이므로 (${a + b} − 2${R_})${sup2} = ${sq(b - a)} + (2${R_})${sup2}, ${4 * (a + b)}${R_} = ${4 * a * b}, ${R_} = ${frac(a * b / gcd(a * b, a + b), (a + b) / gcd(a * b, a + b))}이다. 원 O의 둘레의 길이는 2π × ${frac(a * b / gcd(a * b, a + b), (a + b) / gcd(a * b, a + b))} = ${frac(2 * a * b / g, (a + b) / g)}π(cm)이다.`,
          facts: { value: `2*${a}*${b}/(${a}+${b})`, unseen: [2] }
        });
      }),
      H('hard-chain-three', '이웃한 세 삼각형의 내접원이 서로 맞닿을 때 변의 길이', '심16', (d) => {
        // 이웃한 두 원이 공통인 변 위의 한 점에서 만나므로, 그 점까지의 길이(꼭짓점 A 에서)를 세 삼각형이 함께 가진다.
        const t = d.until(() => [d.int(6, 11), d.int(2, 7), d.int(2, 6), d.int(2, 6), d.int(2, 6)], (w) => { const f = fanPts([w[0] + w[1], w[0] + w[2], w[0] + w[3], w[0] + w[4]], [w[1] + w[2], w[2] + w[3], w[3] + w[4]], ['B', 'C', 'D', 'E']); return f.total <= 150 && new Set(w.slice(1)).size >= 3; });
        const [tA, tB, tC, tD, tE] = t, AB = tA + tB, AC = tA + tC, BC = tB + tC, CD = tC + tD, DE = tD + tE, f = fanPts([AB, AC, tA + tD, tA + tE], [BC, CD, DE], ['B', 'C', 'D', 'E']);
        const S = scene(f.P); f.circles.forEach(([c, r]) => S.b.disk(c, r));
        S.seg('AB AC AD AE BC CD DE').names();
        return cmQ(`다음 그림에서 세 원은 각각 △ABC, △ACD, △ADE의 내접원이고, 이웃한 두 원은 선분 AC, AD 위의 한 점에서 만난다. ${is('AB', AB)}, ${is('BC', BC)}, ${is('CA', AC)}, ${is('CD', CD)}, ${is('DE', DE)}일 때, ${jo(sg('AE'), '의/의')} 길이는?`, tA + tE, {
          figure: S.svg(`꼭짓점 A를 함께 가진 세 삼각형 ABC, ACD, ADE와 각 삼각형의 내접원. 이웃한 두 내접원은 선분 AC, AD 위에서 만난다`),
          explain: `△ABC에서 꼭짓점 A에서 접점까지의 길이는 (${AB} + ${AC} − ${BC}) ÷ 2 = ${tA}(cm)이고, C에서 선분 AC 위의 접점까지는 ${AC} − ${tA} = ${tC}(cm)이다. 이 접점은 △ACD의 내접원의 접점이기도 하므로 △ACD에서 C에서 접점까지 ${tC} cm, D에서 접점까지 ${CD} − ${tC} = ${tD}(cm), A에서 접점까지 ${tA} cm이다. 같은 방법으로 △ADE에서 A에서 ${tA} cm, D에서 ${tD} cm이고 E에서 접점까지는 ${DE} − ${tD} = ${tE}(cm)이다. 따라서 ${sg('AE')} = ${tA} + ${tE} = ${tA + tE}(cm)이다.`,
          facts: { calc: [[`(${AB}+${AC}-${BC})/2+${DE}-(${CD}-(${AC}-(${AB}+${AC}-${BC})/2))`, 0]], unseen: [2] }
        });
      }),
      H('hard-chain-four', '이웃한 네 삼각형의 내접원과 바깥쪽 변의 길이만으로 한 변 구하기', '심17', (d) => {
        const t = d.until(() => [d.int(8, 14), d.int(3, 8), d.int(2, 6), d.int(2, 6), d.int(2, 6), d.int(3, 8)], (w) => { const f = fanPts([1, 2, 3, 4, 5].map((i) => w[0] + w[i]), [1, 2, 3, 4].map((i) => w[i] + w[i + 1]), ['B', 'C', 'D', 'E', 'F']); return f.total <= 165 && new Set(w.slice(1)).size >= 4; });
        const out = [1, 2, 3, 4].map((i) => t[i] + t[i + 1]), AB = t[0] + t[1], f = fanPts([1, 2, 3, 4, 5].map((i) => t[0] + t[i]), out, ['B', 'C', 'D', 'E', 'F']), [BC, CD, DE, EF] = out;
        const S = scene(f.P); f.circles.forEach(([c, r]) => S.b.disk(c, r));
        S.seg('AB AC AD AE AF BC CD DE EF').names();
        return cmQ(`다음 그림에서 네 원은 각각 △ABC, △ACD, △ADE, △AEF의 내접원이고, 이웃한 두 원은 한 점에서 만난다. ${is('AB', AB)}, ${is('BC', BC)}, ${is('CD', CD)}, ${is('DE', DE)}, ${is('EF', EF)}일 때, ${jo(sg('AF'), '의/의')} 길이는?`, t[0] + t[5], {
          figure: S.svg(`꼭짓점 A를 함께 가진 네 삼각형 ABC, ACD, ADE, AEF와 각 삼각형의 내접원. 이웃한 두 내접원은 선분 AC, AD, AE 위에서 만난다`),
          explain: `이웃한 두 원은 함께 가진 변 위의 한 점에서 만나므로 그 점은 두 삼각형의 내접원의 접점이다. 점 B에서 접점까지의 길이를 ${X} cm라 하면 A에서 접점까지는 (${AB} − ${X}) cm, C에서는 (${BC} − ${X}) cm, D에서는 ${CD} − (${BC} − ${X}) cm, E에서는 ${DE} − {${CD} − (${BC} − ${X})} cm, F에서는 ${EF} − [${DE} − {${CD} − (${BC} − ${X})}] cm이다. ${sg('AF')}는 A에서 접점까지의 길이와 F에서 접점까지의 길이의 합이므로 ${X}가 지워져 ${sg('AF')} = ${AB} − ${BC} + ${CD} − ${DE} + ${EF} = ${t[0] + t[5]}(cm)이다.`,
          facts: { calc: [[`${AB}-${BC}+${CD}-${DE}+${EF}`, 0]] }
        });
      }),
      H('hard-common-tangent', '맞닿은 두 원에 모두 접하는 두 직선이 만나는 점', '심18', (d) => {
        const k = d.pick([4, 8, 12, 16]), rr = Math.sqrt(k * k / 8), th = Math.asin(1 / 3) / RAD, Pp = [0, 0], O = [3 * rr, 0], O2 = [6 * rr, 0];
        const A = foot(O, Pp, at(Pp, 1, th)), Bq = foot(O2, Pp, at(Pp, 1, th)), A2 = foot(O, Pp, at(Pp, 1, -th)), B2 = foot(O2, Pp, at(Pp, 1, -th));
        const P = fitPts({ P: Pp, O, Op: O2, A, B: Bq, a2: A2, b2: B2 }, [230, 140], [[O, rr], [O2, 2 * rr]]);
        const S = scene(P).ring('O', rr).ring('Op', 2 * rr).line('PB', 0, 16).line('P-b2', 0, 16).seg('OA', 'thin').seg('Op-B', 'thin').right('P-A-O P-B-Op').dot('O').names({ a2: null, b2: null, A: [100, 11], B: [100, 11] });
        S.b.dot(P.Op).text(at(P.Op, 12, 270), Op);
        return piQ(`다음 그림과 같이 한 점에서 맞닿는 두 원 O, ${Op}에 모두 접하는 두 직선이 점 P에서 만난다. 한 직선이 두 원 O, ${Op}에 접하는 점을 각각 A, B라 하자. ${nb(`${sg('PA')} = ${sg('AB')} = ${k} cm`)}일 때, 작은 원 O의 넓이는? ${TOUCH}`, k * k / 8, 'cm²', {
          figure: S.svg(`한 점에서 맞닿는 작은 원 O와 큰 원 O′. 두 원에 모두 접하는 두 직선이 점 P에서 만나고, 위쪽 직선이 두 원에 접하는 점이 A, B이다. 반지름 OA, O′B가 그어져 있고 A, B에 직각 표시가 있다`),
          explain: `${jo(sg('OA'), '과/와')} ${jo(sg(`${Op}B`), '은/는')} 직선 PB에 수직이므로 △PAO와 △PB${Op}은 닮음(AA 닮음)이고 닮음비는 ${sg('PA')} : ${sg('PB')} = ${k} : ${2 * k} = 1 : 2이다. 작은 원의 반지름의 길이를 ${R_} cm라 하면 큰 원의 반지름의 길이는 2${R_} cm이고, ${sg('PO')} : ${sg(`P${Op}`)} = 1 : 2이므로 ${sg(`O${Op}`)} = ${sg('PO')}이다. ${sg(`O${Op}`)} = ${R_} + 2${R_} = 3${R_}이므로 ${sg('PO')} = 3${R_}이고, 직각삼각형 PAO에서 ${sq(k)} + ${R_}${sup2} = (3${R_})${sup2}, ${R_}${sup2} = ${k * k / 8}이다. 원 O의 넓이는 ${k * k / 8}π cm²이다.`,
          facts: { calc: [[`${k}*${k}/8`, 0]], unseen: [8] }
        });
      }),
      H('hard-rect-two-circles', '직사각형 안에서 원과 두 변에 접하는 원의 반지름', '①73 심19', (d) => {
        const [R, W] = d.until(() => [d.int(3, 12), d.int(8, 40)], ([u, w]) => w >= 2.5 * u && w <= 3.3 * u && !isSq(u * w)), [s, m] = split(W * R), x = W + R - 2 * Math.sqrt(W * R);
        const P = fitPts({ A: [0, -2 * R], B: [0, 0], C: [W, 0], D: [W, -2 * R], O: [R, -R], Op: [W - x, -x] }, [225, 150]);
        const S = scene(P).ring('O', R).ring('Op', x).poly('ABCD').dot('O').len('AD', cm(W), 'B').len('AB', cm(2 * R), 'C').names();
        S.b.dot(P.Op, 2.2).text(at(P.Op, 11, 120), Op);
        return fin(inline(`다음 그림과 같이 가로의 길이가 ${W} cm, 세로의 길이가 ${2 * R} cm인 직사각형 ABCD 안에 세 변 AB, BC, AD에 접하는 원 O가 있다. 원 ${Op}은 원 O와 맞닿고 두 변 BC, CD에 접할 때, 원 ${Op}의 반지름의 길이는? ${TOUCH}`, grp('({0} − {1}' + rt('{2}') + ') cm'), [{ answer: W + R }, { answer: 2 * s }, { answer: m }], {
          shown: `(${W + R} − ${radText(2 * s, m)}) cm`,
          figure: S.svg(`직사각형 ABCD 안에 세 변 AB, BC, AD에 접하는 원 O와, 원 O와 맞닿고 두 변 BC, CD에 접하는 원 O′이 있다. 변 AD의 길이는 ${W} cm, 변 AB의 길이는 ${2 * R} cm`),
          explain: `원 O의 반지름의 길이는 ${R} cm이다. 원 ${Op}의 반지름의 길이를 ${X} cm라 하면 두 중심 사이의 거리는 (${R} + ${X}) cm이고, 두 중심의 가로 방향 거리는 (${W - R} − ${X}) cm, 세로 방향 거리는 (${R} − ${X}) cm이다. (${R} + ${X})${sup2} = (${R} − ${X})${sup2} + (${W - R} − ${X})${sup2}을 정리하면 ${X}${sup2} − ${2 * (W + R)}${X} + ${(W - R) * (W - R)} = 0이고, ${X} &lt; ${R}이므로 ${X} = ${W + R} − ${radText(2 * s, m)}이다.`,
          facts: { calc: [[`${W}+${2 * R}/2`, 0], [`2*(${W}*${2 * R}/2/${m})**0.5`, 1], [`${m}`, 2]], unseen: [2, m] }
        }));
      }),
      H('hard-three-circles', '나란히 맞닿은 세 원과 한 원에 그은 접선이 가운데 원에서 자르는 현', '심20', (d) => {
        const r = d.pick([5, 10, 15, 20]), O1 = [r, 0], O2 = [3 * r, 0], O3 = [5 * r, 0], A = [0, 0], th = Math.asin(1 / 5) / RAD, E = foot(O3, A, at(A, 1, th)), Hh = foot(O2, A, E), half = 4 * r / 5, u = at([0, 0], 1, th);
        const Cc = [Hh[0] - u[0] * half, Hh[1] - u[1] * half], Dd = [Hh[0] + u[0] * half, Hh[1] + u[1] * half];
        const P = fitPts({ A, O: O1, Op: O2, Opp: O3, E, C: Cc, D: Dd, H: Hh }, [240, 110], [[O1, r], [O3, r]]);
        const S = scene(P).ring('O', r).ring('Op', r).ring('Opp', r).line('AE', 0, 10).seg('A-Opp', 'thin').seg('Opp-E Op-H', 'thin').right('Opp-E-A Op-H-E').dot('O').dot('C').dot('D').names({ H: null, O: 270, C: [115, 11], D: [70, 11], E: [80, 11] });
        S.b.dot(P.Op).text(at(P.Op, 12, 270), Op).dot(P.Opp).text(at(P.Opp, 12, 270), Opp);
        return cmQ(`다음 그림과 같이 반지름의 길이가 ${r} cm인 세 원 O, ${Op}, ${Opp}의 중심이 한 직선 위에 있고 이웃한 두 원이 맞닿아 있다. 원 O 위의 점 A에서 원 ${Opp}에 그은 접선의 접점을 E라 하고, 직선 AE가 원 ${Op}과 만나는 두 점을 C, D라 하자. ${jo(sg('CD'), '의/의')} 길이는? (단, 점 A는 직선 O${Opp} 위에 있고, 맞닿은 두 원의 중심 사이의 거리는 두 반지름의 길이의 합과 같다.)`, 8 * r / 5, {
          figure: S.svg(`반지름이 같은 세 원 O, O′, O″의 중심이 한 직선 위에 있고 이웃한 두 원이 맞닿아 있다. 원 O 위의 점 A는 세 중심을 지나는 직선 위에 있다. 점 A에서 원 O″에 그은 접선이 원 O″에 점 E에서 접하고, 이 접선이 원 O′과 두 점 C, D에서 만난다`),
          explain: `${sg(`A${Op}`)} = ${3 * r} cm, ${sg(`A${Opp}`)} = ${5 * r} cm이다. 점 ${Op}에서 선분 CD에 내린 수선의 발을 H라 하면 △A${Op}H와 △A${Opp}E는 닮음(AA 닮음)이므로 ${3 * r} : ${5 * r} = ${sg(`${Op}H`)} : ${r}, ${sg(`${Op}H`)} = ${3 * r / 5} cm이다. 직각삼각형 ${Op}CH에서 ${sg('CH')} = ${rootOf(`${sq(r)} − ${sq(3 * r / 5)}`)} = ${4 * r / 5}(cm)이고, 수선은 현을 이등분하므로 ${sg('CD')} = 2 × ${4 * r / 5} = ${8 * r / 5}(cm)이다.`,
          facts: { calc: [[`2*(${r}*${r}-(3*${r}/5)*(3*${r}/5))**0.5`, 0]], unseen: [2, 3, 5] }
        });
      }),
      H('hard-belt', '크기가 다른 두 원기둥을 묶는 끈의 길이', '심21', (d) => {
        const r = d.int(1, 4), R = 3 * r, knot = d.pick([10, 12, 15, 20]), O1 = [0, 0], O2 = [4 * r, 0];
        const pi = (p, q) => { const g = gcd(p, q); return (q / g === 1 ? p / g : frac(p / g, q / g)) + 'π'; };
        const right = nb(`(${pi(14 * r, 3)} + ${radText(4 * r, 3)} + ${knot}) cm`);
        // 틀린 보기: 호를 반원으로 본 것, 곧은 부분을 중심 사이의 거리로 본 것, 큰 원과 작은 원의 호를 바꾼 것, 매듭을 빠뜨린 것
        const wrongs = [nb(`(${pi(4 * r, 1)} + ${radText(4 * r, 3)} + ${knot}) cm`), nb(`(${pi(14 * r, 3)} + ${8 * r + knot}) cm`), nb(`(${pi(10 * r, 3)} + ${radText(4 * r, 3)} + ${knot}) cm`), nb(`(${pi(14 * r, 3)} + ${radText(4 * r, 3)}) cm`)];
        const P = fitPts({ O: O1, Op: O2 }, [200, 140], [[O1, R], [O2, r]]), k = P.k, c1 = P.O, c2 = P.Op, b = Board();
        b.disk(c1, R * k, TINT).disk(c2, r * k, TINT);
        const u1 = at(c1, R * k, 60), u2 = at(c2, r * k, 60), l1 = at(c1, R * k, 300), l2 = at(c2, r * k, 300), f = (p) => Math.round(p[0] * 10) / 10 + ' ' + Math.round(p[1] * 10) / 10;
        b.shape(`M${f(u1)}A${R * k} ${R * k} 0 1 0 ${f(l1)}L${f(l2)}A${r * k} ${r * k} 0 0 0 ${f(u2)}Z`, [u1, u2, l1, l2, at(c1, R * k, 180)], 'fill:none;stroke:#1d4ed8;stroke-width:2.4');
        b.dot(c1, 2).dot(c2, 2).seg(c1, at(c1, R * k, 150), 'thin').beside(c1, at(c1, R * k, 150), cm(R), at(c1, 20, 270)).seg(c2, at(c2, r * k, 0), 'thin').text(at(c2, r * k + 18, 0), cm(r), { blue: true });
        const opts = d.shuffle([right].concat(wrongs));
        return C(`다음 그림과 같이 밑면의 반지름의 길이가 각각 ${R} cm, ${r} cm인 두 원기둥을 맞닿게 세워 놓고 끈으로 한 바퀴 팽팽하게 묶으려고 한다. 매듭을 짓는 데 끈이 ${knot} cm 더 필요할 때, 필요한 끈의 길이의 최솟값은? ${TOUCH}`, opts, opts.indexOf(right), {
          figure: b.svg(`밑면의 반지름이 ${R} cm, ${r} cm인 두 원이 맞닿아 있고, 두 원을 둘러싼 끈이 두 원에 모두 접하는 두 곧은 부분과 두 호로 이루어져 있다`),
          explain: `두 원의 중심을 O, ${Op}이라 하면 ${sg(`O${Op}`)} = ${R} + ${r} = ${4 * r}(cm)이다. 곧은 끈이 두 원에 접하는 점을 A, B라 하면 ${perp('OA', 'AB')}, ${perp(`${Op}B`, 'AB')}이다. 점 ${Op}에서 ${jo(sg('OA'), '에/에')} 내린 수선의 발을 H라 하면 ${sg('OH')} = ${R} − ${r} = ${2 * r}(cm)이고 ${sg('AB')} = ${sg(`${Op}H`)} = ${rootOf(`${sq(4 * r)} − ${sq(2 * r)}`)} = ${radText(2 * r, 3)}(cm)이다. ${sg('OH')} : ${sg(`O${Op}`)} = 1 : 2이므로 ∠HO${Op} = 60°이고, 끈이 감긴 호의 중심각은 큰 원에서 360° − 2 × 60° = 240°, 작은 원에서 120°이다. 끈의 길이는 2π × ${R} × ${frac(240, 360)} + 2π × ${r} × ${frac(120, 360)} + 2 × ${radText(2 * r, 3)} + ${knot} = ${right}이다.`,
          facts: { truth: opts.map((o) => o === right), want: true }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
