// 중학교 2학년 2학기 5단원 피타고라스 정리 — 뒤쪽 묶음
// (피타고라스 정리의 정당화, 직각삼각형이 되는 조건, 넓이·닮음과 함께 쓰기, 반원의 넓이, 피타고라스 정리의 활용).
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 파일의 얼개
//  - 정당화 그림은 셋이다: 정사각형의 네 변 위에 점을 잡아 만든 안쪽 정사각형(innerFig), 정사각형 안에 합동인 직각삼각형 넷을 붙인 그림(pinFig),
//    한 직선 위에 놓은 합동인 두 직각삼각형(twoTriFig). 넓이·길이와 문장의 참·거짓만 묻는다(정당화 과정을 쓰게 하지 않는다).
//  - 직각삼각형이 되는 조건은 세 변의 길이를 작은 것부터 적어 준다(가장 긴 변이 끝에 있지 않게 섞은 것은 실력에 있다).
//  - 빗변에 내린 수선의 길이는 넓이를 두 가지로 적어 구하고(곱이 같다), 수선의 발이 나눈 선분은 닮음으로 구한다. 답이 분수인 길이·넓이는 분수 칸으로 받는다.
//  - 반원의 넓이는 π의 계수를 받는다. 직각을 낀 두 변 위의 반원의 넓이의 합은 빗변 위의 반원의 넓이와 같고, 초승달 둘의 넓이는 직각삼각형의 넓이와 같다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, C } = B.kit;
  const { V, nb, claimQ, gcd } = B.kit.mid;
  const { dirOf, mid, XY, r1, sv, awayFrom, TINT, WHITE, CLEAR, Board } = B.kit.mgeo;
  const K = B.kit.m825;
  const { UNIT, T, TRIPLES, legsOf, X, seg, sq, cmL, HALF, PYTH, cmQ, areaQ, piQ, fracQ, cen, lay, semiPts, semi } = K;
  const PI = V('π');
  // 풀이 글에 적는 분수(약분한 것). 나누어떨어지면 자연수로 적는다.
  const fr = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : frac(p / g, q / g); };

  // ── 그림 ──
  // 정사각형 ABCD(한 변 s)의 네 변 위에 AH = BE = CF = DG = p 가 되게 잡은 네 점과 안쪽 사각형 EFGH. o.part: 변 BE 옆에 적을 글, o.side: 밑변 아래에 적을 글, o.fill, o.diag: 선분 HF 를 긋는다
  function innerFig(s, p, o) {
    const opt = o || {}, P = lay({ A: [0, s], B: [0, 0], C: [s, 0], D: [s, s], H: [p, s], E: [0, p], F: [s - p, 0], G: [s, s - p] }, opt.size || [132, 132]), b = Board(), c = cen([P.A, P.B, P.C, P.D]);
    b.poly([P.A, P.B, P.C, P.D]).poly([P.E, P.F, P.G, P.H], opt.fill);
    if (opt.diag) b.seg(P.H, P.F);
    b.corner(P.A, P.B, P.D, '').corner(P.B, P.C, P.A, '').corner(P.C, P.D, P.B, '').corner(P.D, P.A, P.C, '');
    b.tick(P.A, P.H).tick(P.B, P.E).tick(P.C, P.F).tick(P.D, P.G);
    b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).name(P.H, 'H', 90).name(P.E, 'E', 180).name(P.F, 'F', 270).name(P.G, 'G', 0);
    if (opt.part) b.beside(P.B, P.E, opt.part, c, { gap: 9 });
    if (opt.side) b.dim(P.B, P.C, opt.side, c, 23);
    return { b, P };
  }
  const INNER_SAID = '정사각형 ABCD. 점 H는 변 AD 위에, 점 E는 변 AB 위에, 점 F는 변 BC 위에, 점 G는 변 CD 위에 있고 선분 AH, BE, CF, DG에 길이가 같다는 표시가 있다. 네 점을 차례로 이은 사각형 EFGH가 그려져 있다';
  // 정사각형 ABCD(한 변 c)의 안쪽에 합동인 직각삼각형 넷(직각을 낀 두 변 a < bb)을 붙인 그림. 직각의 꼭짓점은 P(변 AD 쪽), S(변 DC 쪽), R(변 CB 쪽), Q(변 BA 쪽)이고 가운데에 정사각형 PQRS 가 남는다.
  function pinFig(a, bb, c, o) {
    const opt = o || {}, turn = ([x, y]) => [c / 2 + (y - c / 2), c / 2 - (x - c / 2)], p = [a * a / c, c - a * bb / c], s = turn(p), r = turn(s), q = turn(r);
    const P = lay({ A: [0, c], B: [0, 0], C: [c, 0], D: [c, c], P: p, Q: q, R: r, S: s }, opt.size || [150, 150]), b = Board(), centre = cen([P.A, P.B, P.C, P.D]);
    b.poly([P.A, P.B, P.C, P.D]).poly([P.P, P.Q, P.R, P.S], TINT).seg(P.A, P.Q).seg(P.D, P.P).seg(P.C, P.S).seg(P.B, P.R);
    b.corner(P.P, P.A, P.D, '').corner(P.S, P.D, P.C, '').corner(P.R, P.C, P.B, '').corner(P.Q, P.B, P.A, '');
    b.tick(P.A, P.P).tick(P.D, P.S).tick(P.C, P.R).tick(P.B, P.Q);
    b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45);
    for (const [key, ends] of [['P', ['A', 'Q', 'D']], ['S', ['D', 'P', 'C']], ['R', ['C', 'S', 'B']], ['Q', ['B', 'R', 'A']]]) b.nameFree(P[key], key, ends.map((e) => dirOf(P[key], P[e])));
    if (opt.side) b.dim(P.B, P.C, opt.side, centre, 12);
    return { b, P };
  }
  // 한 직선 위에 놓은 합동인 두 직각삼각형 ABC, CDE(AB = CD = u, BC = DE = v)와 가운데 삼각형 ACE. o.ab·o.de: 두 세로 변 옆에 적을 글
  function twoTriFig(u, v, o) {
    const opt = o || {}, P = lay({ A: [0, u], B: [0, 0], C: [v, 0], D: [u + v, 0], E: [u + v, v] }, opt.size || [186, 120]), b = Board();
    b.poly([P.A, P.B, P.D, P.E]).poly([P.A, P.C, P.E], TINT).corner(P.B, P.C, P.A, '').corner(P.D, P.E, P.C, '');
    b.name(P.A, 'A', 120).name(P.B, 'B', 225).name(P.C, 'C', 270).name(P.D, 'D', 315).name(P.E, 'E', 60);
    if (opt.ab) b.beside(P.A, P.B, opt.ab, P.C);
    if (opt.de) b.beside(P.D, P.E, opt.de, P.C);
    return { b, P };
  }
  const TWO_SAID = '세 점 B, C, D가 한 직선 위에 있고, 그 직선의 같은 쪽에 직각삼각형 ABC와 직각삼각형 CDE가 놓여 있다. ∠B와 ∠D에 직각 표시가 있다. 선분 AC, CE, AE가 그어져 있고 삼각형 ACE가 색칠되어 있다';
  // ∠A = 90°인 직각삼각형 ABC(AB = c, AC = bb, BC 가 밑변)와 꼭짓점 A 에서 내린 수선. o.foot: 수선의 발의 이름, o.markA: ∠A 에 직각 표시, o.ab·o.ac: 변 옆에 적을 글, o.bc: 밑변 아래 치수선의 글, o.bd: 선분 B–발 아래에 적을 글
  function altFig(c, bb, o) {
    const a = Math.sqrt(c * c + bb * bb), P = lay({ A: [c * c / a, c * bb / a], B: [0, 0], C: [a, 0], H: [c * c / a, 0] }, o.size || [190, 112]), b = Board(), g = cen([P.A, P.B, P.C]);
    b.poly([P.B, P.C, P.A]).seg(P.A, P.H).corner(P.H, c > bb ? P.C : P.B, P.A, '');
    if (o.markA) b.corner(P.A, P.B, P.C, '');
    b.name(P.A, 'A', 90).name(P.B, 'B', 200).name(P.C, 'C', 340).name(P.H, o.foot, 270);
    if (o.ab) b.beside(P.A, P.B, o.ab, g);
    if (o.ac) b.beside(P.A, P.C, o.ac, g);
    if (o.bd) b.beside(P.B, P.H, o.bd, g);
    if (o.bc) b.dim(P.B, P.C, o.bc, g, 21);
    return { b, P, g };
  }
  // 직사각형 ABCD(AB = h 세로, AD = w 가로)와 대각선 BD, 꼭짓점 A 에서 대각선에 내린 수선. o.footA: 그 발의 이름, o.footC: 꼭짓점 C 에서 내린 수선의 발의 이름(주면 그 수선도 긋는다)
  function rectFig(w, h, o) {
    const d2 = w * w + h * h, P = lay({ A: [0, h], B: [0, 0], C: [w, 0], D: [w, h], M: [w * h * h / d2, h * h * h / d2], N: [w * w * w / d2, h * w * w / d2] }, o.size || [176, 120]), b = Board(), c = cen([P.A, P.B, P.C, P.D]);
    b.poly([P.A, P.B, P.C, P.D]).seg(P.B, P.D).seg(P.A, P.M).corner(P.M, P.D, P.A, '');
    b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).name(P.M, o.footA, dirOf(P.A, P.M), 12);
    if (o.footC) b.seg(P.C, P.N).corner(P.N, P.B, P.C, '').name(P.N, o.footC, dirOf(P.C, P.N), 12);
    b.beside(P.A, P.B, cmL(h), c).beside(P.A, P.D, cmL(w), c);
    return { b, P };
  }
  // ∠A = 90°인 직각삼각형 ABC 의 변을 지름으로 하는 반원. kind: 'legs' 두 변 AB, AC 위의 반원(색칠), 'three' 세 변 위의 반원(모두 바깥쪽), 'lune' 세 반원(빗변 위의 반원은 A 쪽으로)과 색칠한 초승달 둘.
  // o.inside { AB, AC, BC: 반원 안에 적을 글 }, o.bc: 밑변 아래에 적을 글, o.ab: 변 AB 옆(삼각형 안쪽)에 적을 글, o.foot: 꼭짓점 A 에서 내린 수선의 발의 이름
  function semiFig(c, bb, kind, o) {
    const opt = o || {}, a = Math.sqrt(c * c + bb * bb), m = { A: [c * c / a, c * bb / a], B: [0, 0], C: [a, 0] };
    const extra = semiPts(m.A, m.B, m.C).concat(semiPts(m.A, m.C, m.B), kind === 'three' ? semiPts(m.B, m.C, m.A) : []);
    const P = lay(m, opt.size || [196, 170], extra), b = Board(), g = cen([P.A, P.B, P.C]), under = [g[0], 400], H = [P.A[0], 0];
    const t1 = semi(b, P.A, P.B, P.C, kind === 'three' ? CLEAR : TINT), t2 = semi(b, P.A, P.C, P.B, kind === 'three' ? CLEAR : TINT);
    const t3 = kind === 'three' ? semi(b, P.B, P.C, P.A, CLEAR) : null;
    if (kind === 'lune') semi(b, P.B, P.C, under, WHITE);
    b.poly([P.B, P.C, P.A], kind === 'legs' ? WHITE : CLEAR).corner(P.A, P.B, P.C, '');
    if (opt.foot) b.seg(P.A, H).corner(H, c > bb ? P.C : P.B, P.A, '').name(H, opt.foot, 270);
    const spot = (p, q, tip) => { const centre = mid(p, q); return [centre[0] + (tip[0] - centre[0]) * 0.5, centre[1] + (tip[1] - centre[1]) * 0.5]; };
    if (opt.inside) {
      if (opt.inside.AB) b.text(spot(P.A, P.B, t1), opt.inside.AB, { blue: true, size: 14 });
      if (opt.inside.AC) b.text(spot(P.A, P.C, t2), opt.inside.AC, { blue: true, size: 14 });
      if (opt.inside.BC && t3) b.text(spot(P.B, P.C, t3), opt.inside.BC, { blue: true, size: 14 });
    }
    b.name(P.A, 'A', awayFrom(P.A, [P.B, P.C]), 11).name(P.B, 'B', kind === 'three' ? (dirOf(P.B, P.A) + 90 + 270) / 2 : 215).name(P.C, 'C', kind === 'three' ? (dirOf(P.C, P.A) - 90 + 360 + 270) / 2 : 325);
    if (opt.bc) b.beside(P.B, P.C, opt.bc, g, opt.foot ? { t: c > bb ? 0.3 : 0.7 } : undefined);
    if (opt.ab) b.beside(P.A, P.B, opt.ab, t1, { gap: 4 });
    return { b, P, g };
  }
  const svS = (i) => `${sv('S')}<tspan dy="3" style="font-size:10px">${i}</tspan>`, S = (i) => `${V('S')}<sub>${i}</sub>`;
  const LUNE_SAID = '직각삼각형 ABC. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 변 BC를 지름으로 하는 반원이 점 A를 지나고, 변 AB, 변 AC를 각각 지름으로 하는 반원이 삼각형의 바깥쪽에 그려져 있다. 작은 두 반원에서 큰 반원의 바깥에 있는 초승달 모양의 두 부분이 색칠되어 있다';
  // 좌표평면의 직선: x축과 A(p, 0), y축과 B(0, q)에서 만난다. 원점 O 에서 내린 수선의 발 H. 모눈 한 칸은 1
  function planeFig(p, q) {
    const u = Math.min(20, 200 / (p + 3), 150 / (q + 3)), b = Board(), px = (x, y) => [x * u, -y * u], c2 = p * p + q * q, O = [0, 0], A = px(p, 0), Bp = px(0, q), H = px(p * q * q / c2, p * p * q / c2), GRID = 'stroke:#c9d6e4;stroke-width:0.8', INK = 'fill:#1f2933;stroke:none';
    for (let i = -1; i <= p + 1; i += 1) b.seg(px(i, -1), px(i, q + 1), 'thin', GRID);
    for (let j = -1; j <= q + 1; j += 1) b.seg(px(-1, j), px(p + 1, j), 'thin', GRID);
    const ex = px(p + 1.5, 0), ey = px(0, q + 1.5);
    b.seg(px(-1.3, 0), ex, 'thin').seg(px(0, -1.3), ey, 'thin');
    b.shape(`M${r1(ex[0] + 7)} 0l-8 -3.4v6.8z`, [[ex[0] + 7, 0]], INK).shape(`M0 ${r1(ey[1] - 7)}l-3.4 8h6.8z`, [[0, ey[1] - 7]], INK);
    const upper = p / q <= 1 ? px(-p / q, q + 1) : px(-1, q + q / p), lower = p / q <= 1 ? px(p + p / q, -1) : px(p + 1, -q / p);
    b.seg(upper, lower, null, 'stroke:#1d4ed8;stroke-width:1.8').seg(O, H).corner(H, O, A, '');
    b.text([ex[0] + 15, 1], sv('x'), { size: 14 }).text([10, ey[1] - 9], sv('y'), { size: 14 });
    b.name(O, 'O', 225).name(A, 'A', 62, 13).name(Bp, 'B', 28, 13).name(H, 'H', dirOf(O, H), 12);
    return b;
  }

  // ── 문장 ──
  const INNER_TRUE = ['△AEH ≡ △BFE이다.', '□EFGH의 네 변의 길이는 모두 같다.', '∠HEF = 90°이다.', '□EFGH는 정사각형이다.', '□ABCD의 넓이는 △AEH의 넓이의 4배와 □EFGH의 넓이의 합과 같다.', '∠AEH + ∠BEF = 90°이다.'];
  const INNER_FALSE = [
    ['□ABCD의 넓이는 △AEH의 넓이와 □EFGH의 넓이의 합과 같다.', '□ABCD는 합동인 직각삼각형 4개와 □EFGH로 이루어져 있으므로 그 넓이는 △AEH의 넓이의 4배와 □EFGH의 넓이의 합과 같다.', '□ABCD의 넓이는 △AEH의 넓이의 4배와 □EFGH의 넓이의 합과 같다.'],
    [`${seg('EH')} = ${seg('AE')} + ${seg('AH')}이다.`, `△AEH는 ∠A = 90°인 직각삼각형이므로 ${sq(seg('EH'))} = ${sq(seg('AE'))} + ${sq(seg('AH'))}이다.`],
    ['∠HEF = 60°이다.', '△AEH ≡ △BFE이므로 ∠AEH + ∠BEF = ∠AEH + ∠AHE = 90°이고, ∠HEF = 180° − 90° = 90°이다.', '∠HEF = 90°이다.'],
    ['□EFGH는 마름모이지만 정사각형은 아니다.', '□EFGH는 네 변의 길이가 같고 ∠HEF = 90°이므로 정사각형이다.', '□EFGH는 정사각형이다.']
  ];
  const TWO_TRUE = ['∠ACE = 90°이다.', `${seg('AC')} = ${seg('CE')}이다.`, '△ACE는 직각이등변삼각형이다.', '□ABDE는 사다리꼴이다.', `△ACE의 넓이는 ${HALF} × ${sq(seg('AC'))}이다.`, '∠BAC = ∠DCE이다.'];
  const TWO_FALSE = [
    [`△ACE의 넓이는 ${sq(seg('AC'))}이다.`, `△ACE는 ${seg('AC')} = ${seg('CE')}이고 ∠ACE = 90°이므로 그 넓이는 ${HALF} × ${seg('AC')} × ${seg('CE')} = ${HALF} × ${sq(seg('AC'))}이다.`, `△ACE의 넓이는 ${HALF} × ${sq(seg('AC'))}이다.`],
    ['△ACE는 정삼각형이다.', `△ACE는 ${seg('AC')} = ${seg('CE')}이고 ∠ACE = 90°인 직각이등변삼각형이다.`, '△ACE는 직각이등변삼각형이다.'],
    ['∠ACE = 60°이다.', '∠ACB + ∠DCE = ∠ACB + ∠BAC = 90°이므로 ∠ACE = 180° − 90° = 90°이다.', '∠ACE = 90°이다.'],
    [`${seg('AE')} = ${seg('AC')}이다.`, `△ACE는 ∠ACE = 90°인 직각삼각형이므로 빗변 AE가 가장 길다. ${sq(seg('AE'))} = 2 × ${sq(seg('AC'))}이다.`]
  ];

  // ── 수 ──
  // 직각삼각형이 아닌 세 변(작은 것부터): 피타고라스 수에서 한두 수를 1만큼 바꾼 것. 삼각형은 된다.
  const NUDGE = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0], [0, 2, 0], [0, 0, 2]];
  const SMALL = TRIPLES.filter((t) => t[2] <= 30);
  const notRight = (d) => d.until(() => { const t = d.pick(SMALL), k = d.pick(NUDGE); return [t[0] + k[0], t[1] + k[1], t[2] + k[2]].sort((x, y) => x - y); }, ([a, b, c]) => a >= 2 && a + b > c && a * a + b * b !== c * c);
  const three = (t) => `${t[0]} cm, ${t[1]} cm, ${t[2]} cm`;

  B.addTypes(UNIT, 'proof', [
    T('proof-inner', '네 변 위의 점으로 만든 안쪽 정사각형의 둘레와 넓이', '①31', (d, n) => {
      if (n === 0) {
        const [p, r, c] = legsOf(d, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]), s = p + r, f = innerFig(s, p, { part: cmL(p), side: cmL(s), fill: TINT });
        return cmQ(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형 ABCD에서 ${seg('AH')} = ${seg('BE')} = ${seg('CF')} = ${seg('DG')} = ${p} cm일 때, □EFGH의 둘레의 길이는?`, 4 * c, {
          figure: f.b.svg(`${INNER_SAID}. 사각형 EFGH가 색칠되어 있다. 정사각형 ABCD의 한 변의 길이는 ${s} cm, BE = ${p} cm`),
          explain: `${seg('AE')} = ${s} − ${p} = ${r}(cm)이다. △AEH에서 ${sq(seg('EH'))} = ${sq(r)} + ${sq(p)} = ${c * c}이므로 ${seg('EH')} = ${c} cm이다. 네 직각삼각형이 합동이므로 □EFGH의 네 변의 길이는 모두 ${c} cm이고, 둘레의 길이는 4 × ${c} = ${4 * c}(cm)이다.`,
          facts: { calc: [[`4*((${s}-${p})**2+${p}**2)**0.5`, 0]], unseen: [4, 2, 0.5] }
        });
      }
      const [s, p] = d.until(() => [d.int(6, 13), d.int(2, 10)], ([u, v]) => v <= u - 2 && 2 * v !== u && v * 132 / u >= 28 && (u - v) * 132 / u >= 28), r = s - p, f = innerFig(s, p, { part: cmL(p), side: cmL(s), fill: TINT });
      return areaQ(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형 ABCD에서 ${seg('AH')} = ${seg('BE')} = ${seg('CF')} = ${seg('DG')} = ${p} cm일 때, □EFGH의 넓이는?`, r * r + p * p, {
        figure: f.b.svg(`${INNER_SAID}. 사각형 EFGH가 색칠되어 있다. 정사각형 ABCD의 한 변의 길이는 ${s} cm, BE = ${p} cm`),
        explain: `${seg('AE')} = ${s} − ${p} = ${r}(cm)이다. △AEH에서 ${sq(seg('EH'))} = ${sq(r)} + ${sq(p)} = ${r * r + p * p}이다. □EFGH는 한 변의 길이가 ${seg('EH')}인 정사각형이므로 그 넓이는 ${sq(seg('EH'))} = ${r * r + p * p}(cm²)이다.`,
        facts: { calc: [[`(${s}-${p})**2+${p}**2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('proof-outer', '안쪽 정사각형의 넓이로 바깥 정사각형의 넓이 구하기', '①32 심17', (d) => {
      const [p, r] = d.until(() => [d.int(2, 12), d.int(2, 12)], ([u, v]) => u !== v && Math.min(u, v) / (u + v) >= 0.22), s = p + r, inner = p * p + r * r, f = innerFig(s, p, { part: cmL(p), fill: TINT });
      return areaQ(`그림과 같이 정사각형 ABCD의 네 변 위에 ${seg('AH')} = ${seg('BE')} = ${seg('CF')} = ${seg('DG')} = ${p} cm가 되도록 네 점 E, F, G, H를 잡았다. □EFGH의 넓이가 ${inner} cm²일 때, □ABCD의 넓이는?`, s * s, {
        figure: f.b.svg(`${INNER_SAID}. 사각형 EFGH가 색칠되어 있다. BE = ${p} cm`),
        explain: `□EFGH는 정사각형이므로 ${sq(seg('EH'))} = ${inner}이다. △AEH에서 ${sq(seg('AE'))} = ${inner} − ${sq(p)} = ${r * r}이므로 ${seg('AE')} = ${r} cm이다. ${seg('AB')} = ${r} + ${p} = ${s}(cm)이므로 □ABCD의 넓이는 ${sq(s)} = ${s * s}(cm²)이다.`,
        facts: { calc: [[`(${p}+(${inner}-${p}**2)**0.5)**2`, 0]], unseen: [2, 0.5] }
      });
    }),
    T('proof-inner-diagonal', '안쪽 정사각형의 대각선의 길이를 제곱한 값', '심18', (d) => {
      const [s, p] = d.until(() => [d.int(6, 13), d.int(2, 10)], ([u, v]) => v <= u - 2 && 2 * v !== u && v * 132 / u >= 28 && (u - v) * 132 / u >= 28 && Math.abs(u - 2 * v) * 132 / u >= 20), r = s - p, e2 = r * r + p * p, f = innerFig(s, p, { part: cmL(p), side: cmL(s), diag: true });
      return N(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형 ABCD에서 ${seg('AH')} = ${seg('BE')} = ${seg('CF')} = ${seg('DG')} = ${p} cm일 때, ${sq(seg('HF'))}의 값은?`, 2 * e2, {
        figure: f.b.svg(`${INNER_SAID}. 선분 HF가 그어져 있다. 정사각형 ABCD의 한 변의 길이는 ${s} cm, BE = ${p} cm`),
        explain: `△AEH에서 ${sq(seg('EH'))} = ${sq(r)} + ${sq(p)} = ${e2}이다. □EFGH는 정사각형이므로 △HEF는 ${seg('EH')} = ${seg('EF')}, ∠HEF = 90°인 직각이등변삼각형이다. ${sq(seg('HF'))} = ${sq(seg('EH'))} + ${sq(seg('EF'))} = ${e2} + ${e2} = ${2 * e2}이다.`,
        facts: { calc: [[`2*((${s}-${p})**2+${p}**2)`, 0]], unseen: [2] }
      });
    }),
    T('proof-pinwheel', '합동인 직각삼각형 넷이 둘러싼 가운데 정사각형의 넓이', '①33 심19', (d) => {
      const [a, bb, c] = d.pick([[5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25], [10, 24, 26], [18, 24, 30], [16, 30, 34]]), f = pinFig(a, bb, c, { side: cmL(c) });
      return areaQ(`그림과 같이 한 변의 길이가 ${c} cm인 정사각형 ABCD의 안쪽에 합동인 직각삼각형 4개를 붙여 놓았다. ${seg('AP')} = ${seg('BQ')} = ${seg('CR')} = ${seg('DS')} = ${a} cm일 때, □PQRS의 넓이는?`, (bb - a) * (bb - a), {
        figure: f.b.svg(`정사각형 ABCD의 안쪽에 합동인 직각삼각형 APD, DSC, CRB, BQA가 붙어 있고 가운데에 사각형 PQRS가 색칠되어 있다. ∠APD, ∠DSC, ∠CRB, ∠BQA에 직각 표시가 있고, 선분 AP, BQ, CR, DS에 길이가 같다는 표시가 있다. 점 S는 선분 PD 위에, 점 R는 선분 SC 위에, 점 Q는 선분 RB 위에, 점 P는 선분 QA 위에 있다. 정사각형 ABCD의 한 변의 길이는 ${c} cm`),
        explain: `△APD에서 ${sq(seg('PD'))} = ${sq(c)} − ${sq(a)} = ${bb * bb}이므로 ${seg('PD')} = ${bb} cm이다. ${seg('DS')} = ${a} cm이므로 ${seg('PS')} = ${bb} − ${a} = ${bb - a}(cm)이다. □PQRS는 한 변의 길이가 ${bb - a} cm인 정사각형이므로 그 넓이는 ${(bb - a) * (bb - a)} cm²이다.`,
        facts: { calc: [[`((${c}**2-${a}**2)**0.5-${a})**2`, 0]], unseen: [2, 0.5] }
      });
    }),
    T('proof-claims', '네 변 위의 점으로 만든 정사각형 그림에 대한 설명 가리기', '①34', (d) => {
      const wantTrue = d.bool(), f = innerFig(7, d.pick([2, 3, 4, 5]), {});
      return Object.assign(claimQ(d, `그림과 같이 정사각형 ABCD의 네 변 위에 ${seg('AH')} = ${seg('BE')} = ${seg('CF')} = ${seg('DG')}가 되도록 네 점 E, F, G, H를 잡았다. 다음 중 옳${wantTrue ? '은' : '지 않은'} 것은?`, INNER_TRUE, INNER_FALSE, wantTrue), { figure: f.b.svg(INNER_SAID) });
    }),
    T('proof-two-tri', '한 직선 위에 놓은 합동인 두 직각삼각형과 가운데 삼각형의 넓이', '①21', (d) => {
      const [u, v] = d.until(() => [d.int(3, 12), d.int(3, 12)], ([x, y]) => x !== y && (x - y) % 2 === 0 && Math.max(x, y) / Math.min(x, y) <= 2.5), f = twoTriFig(u, v, { ab: cmL(u), de: cmL(v) });
      return areaQ(`그림에서 △ABC ≡ △CDE이고 세 점 B, C, D는 한 직선 위에 있다. ${seg('AB')} = ${u} cm, ${seg('DE')} = ${v} cm일 때, △ACE의 넓이는?`, (u * u + v * v) / 2, {
        figure: f.b.svg(`${TWO_SAID}. AB = ${u} cm, DE = ${v} cm`),
        explain: `△ABC ≡ △CDE이므로 ${seg('BC')} = ${seg('DE')} = ${v} cm, ${seg('AC')} = ${seg('CE')}이다. △ABC에서 ${sq(seg('AC'))} = ${sq(u)} + ${sq(v)} = ${u * u + v * v}이다. ∠ACB + ∠DCE = ∠ACB + ∠BAC = 90°이므로 ∠ACE = 90°이다. △ACE의 넓이는 ${HALF} × ${seg('AC')} × ${seg('CE')} = ${HALF} × ${sq(seg('AC'))} = ${(u * u + v * v) / 2}(cm²)이다.`,
        facts: { calc: [[`(${u}**2+${v}**2)/2`, 0]], unseen: [2] }
      });
    }),
    T('proof-two-tri-claims', '합동인 두 직각삼각형으로 만든 사다리꼴 그림에 대한 설명 가리기', '①35', (d) => {
      const wantTrue = d.bool(), [u, v] = d.pick([[4, 8], [5, 9], [8, 4], [9, 5], [4, 7], [7, 4]]), f = twoTriFig(u, v, {});
      return Object.assign(claimQ(d, `그림에서 △ABC ≡ △CDE이고 세 점 B, C, D는 한 직선 위에 있다. 다음 중 옳${wantTrue ? '은' : '지 않은'} 것은?`, TWO_TRUE, TWO_FALSE, wantTrue), { figure: f.b.svg(TWO_SAID) });
    })
  ]);

  B.addTypes(UNIT, 'cond', [
    T('cond-pick', '세 변의 길이를 보고 직각삼각형 고르기', '①36·37', (d) => {
      const wantTrue = d.bool();
      const list = d.until(() => {
        const rights = d.shuffle(SMALL).slice(0, wantTrue ? 1 : 3).map((t) => t.slice().sort((x, y) => x - y)), others = Array.from({ length: wantTrue ? 3 : 1 }, () => notRight(d));
        return d.shuffle(rights.concat(others));
      }, (rows) => new Set(rows.map(three)).size === 4);
      const flags = list.map(([a, b, c]) => a * a + b * b === c * c), hit = flags.indexOf(wantTrue), [a, b, c] = list[hit];
      return C(`세 변의 길이가 각각 다음과 같은 삼각형 중에서 직각삼각형${wantTrue ? '인' : '이 아닌'} 것은?`, list.map(three), hit, {
        explain: `가장 긴 변의 길이의 제곱이 나머지 두 변의 길이의 제곱의 합과 같으면 직각삼각형이다. ${sq(a)} + ${sq(b)} = ${a * a + b * b}, ${sq(c)} = ${c * c}이므로 세 변의 길이가 ${three([a, b, c])}인 삼각형은 직각삼각형${wantTrue ? '이다' : '이 아니다'}.`,
        facts: { claimed: list.map(([x, y, z]) => [`${x}*${x}+${y}*${y}`, z * z]), claimedWant: wantTrue }
      });
    }),
    T('cond-third', '직각삼각형이 되게 하는 한 변의 길이', '①38', (d, n) => {
      const [a, b, c] = d.pick(TRIPLES.filter((t) => t[2] <= 37)), s = Math.min(a, b), l = Math.max(a, b);
      if (n === 0) {
        const known = d.bool() ? s : l, ans = a + b - known;
        return N(`세 변의 길이가 ${known} cm, ${c} cm, ${X} cm인 삼각형이 직각삼각형이 되도록 하는 ${X}의 값은? ${nb(`(단, ${X} &lt; ${c})`)}`, ans, {
          explain: `${X} &lt; ${c}이므로 가장 긴 변의 길이는 ${c} cm이다. ${sq(X)} + ${sq(known)} = ${sq(c)}에서 ${sq(X)} = ${c * c} − ${known * known} = ${ans * ans}이고 ${sq(ans)} = ${ans * ans}이므로 ${X} = ${ans}이다.`,
          facts: { calc: [[`(${c}**2-${known}**2)**0.5`, 0]], unseen: [2, 0.5] }
        });
      }
      return N(`세 변의 길이가 ${s} cm, ${l} cm, ${X} cm인 삼각형이 직각삼각형이 되도록 하는 ${X}의 값은? ${nb(`(단, ${X} &gt; ${l})`)}`, c, {
        explain: `${X} &gt; ${l}이므로 가장 긴 변의 길이는 ${X} cm이다. ${sq(X)} = ${sq(s)} + ${sq(l)} = ${c * c}이고 ${sq(c)} = ${c * c}이므로 ${X} = ${c}이다.`,
        facts: { calc: [[`(${s}**2+${l}**2)**0.5`, 0]], unseen: [2, 0.5] }
      });
    }, { count: 2 }),
    T('cond-area', '세 변의 길이로 직각삼각형임을 알아내어 넓이와 높이 구하기', '①40', (d, n) => {
      if (n === 0) {
        const [a0, b0, c] = d.pick(TRIPLES.filter((t) => t[2] <= 30)), a = Math.min(a0, b0), b = Math.max(a0, b0);
        return areaQ(`세 변의 길이가 ${a} cm, ${b} cm, ${c} cm인 삼각형의 넓이는?`, a * b / 2, {
          explain: `${sq(a)} + ${sq(b)} = ${c * c} = ${sq(c)}이므로 이 삼각형은 빗변의 길이가 ${c} cm인 직각삼각형이다. 직각을 낀 두 변의 길이가 ${a} cm, ${b} cm이므로 넓이는 ${HALF} × ${a} × ${b} = ${a * b / 2}(cm²)이다.`,
          facts: { calc: [[`${a}*${b}/2`, 0]], unseen: [2] }
        });
      }
      const w = d.until(() => { const [c, bb, a] = legsOf(d, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), f = altFig(c, bb, { foot: 'H', ab: cmL(c), ac: cmL(bb), bc: cmL(a) }); return { c, bb, a, f }; }, (x) => !x.f.b.clash());
      const { c, bb, a } = w;
      return fracQ(`그림의 △ABC에서 ${seg('AB')} = ${c} cm, ${seg('AC')} = ${bb} cm, ${seg('BC')} = ${a} cm이다. 꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 할 때, ${seg('AH')}의 길이는?`, c * bb, a, 'cm', {
        figure: w.f.b.svg(`삼각형 ABC. 꼭짓점 A에서 변 BC에 내린 수선의 발이 H이고 직각 표시가 있다. AB = ${c} cm, AC = ${bb} cm, BC = ${a} cm`),
        explain: `${sq(c)} + ${sq(bb)} = ${a * a} = ${sq(a)}이므로 △ABC는 ∠A = 90°인 직각삼각형이다. △ABC의 넓이를 두 가지로 나타내면 ${HALF} × ${c} × ${bb} = ${HALF} × ${a} × ${seg('AH')}이므로 ${seg('AH')} = ${fr(c * bb, a)}(cm)이다.`,
        facts: { value: `${c}*${bb}/${a}` }
      });
    }, { count: 2 })
  ]);

  B.addTypes(UNIT, 'height', [
    T('height-altitude', '빗변에 내린 수선의 길이', '①43', (d, n) => {
      if (n === 0) {
        const w = d.until(() => { const [c, bb, a] = legsOf(d, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), f = altFig(c, bb, { foot: 'H', markA: true, ab: cmL(c), ac: cmL(bb) }); return { c, bb, a, f }; }, (x) => !x.f.b.clash());
        const { c, bb, a } = w;
        return fracQ(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 ${seg('AH')} ⊥ ${seg('BC')}이다. ${seg('AB')} = ${c} cm, ${seg('AC')} = ${bb} cm일 때, ${seg('AH')}의 길이는?`, c * bb, a, 'cm', {
          figure: w.f.b.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있고, 꼭짓점 A에서 변 BC에 내린 수선의 발이 H이며 직각 표시가 있다. AB = ${c} cm, AC = ${bb} cm`),
          explain: `${PYTH}${sq(seg('BC'))} = ${sq(c)} + ${sq(bb)} = ${a * a}이므로 ${seg('BC')} = ${a} cm이다. △ABC의 넓이를 두 가지로 나타내면 ${HALF} × ${c} × ${bb} = ${HALF} × ${a} × ${seg('AH')}이므로 ${seg('AH')} = ${fr(c * bb, a)}(cm)이다.`,
          facts: { value: `${c}*${bb}/(${c}**2+${bb}**2)**0.5`, unseen: [2, 0.5] }
        });
      }
      const [h, wd, dg] = d.pick([[6, 8, 10], [3, 4, 5], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), f = rectFig(wd, h, { footA: 'E' });
      return fracQ(`그림과 같이 ${seg('AB')} = ${h} cm, ${seg('AD')} = ${wd} cm인 직사각형 ABCD의 꼭짓점 A에서 대각선 BD에 내린 수선의 발을 E라 할 때, ${seg('AE')}의 길이는?`, h * wd, dg, 'cm', {
        figure: f.b.svg(`직사각형 ABCD와 대각선 BD. 꼭짓점 A에서 대각선 BD에 내린 수선의 발이 E이고 직각 표시가 있다. AB = ${h} cm, AD = ${wd} cm`),
        explain: `△ABD에서 ${sq(seg('BD'))} = ${sq(h)} + ${sq(wd)} = ${dg * dg}이므로 ${seg('BD')} = ${dg} cm이다. △ABD의 넓이를 두 가지로 나타내면 ${HALF} × ${h} × ${wd} = ${HALF} × ${dg} × ${seg('AE')}이므로 ${seg('AE')} = ${fr(h * wd, dg)}(cm)이다.`,
        facts: { value: `${h}*${wd}/(${h}**2+${wd}**2)**0.5`, unseen: [2, 0.5] }
      });
    }, { count: 2 }),
    T('height-foot', '수선의 발이 나눈 선분의 길이', '①44 심31', (d, n) => {
      if (n === 0) {
        const w = d.until(() => { const [c, bb, a] = legsOf(d, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), f = altFig(c, bb, { foot: 'D', markA: true, ab: cmL(c), ac: cmL(bb) }); return { c, bb, a, f }; }, (x) => !x.f.b.clash());
        const { c, bb, a } = w;
        return fracQ(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 ${seg('AD')} ⊥ ${seg('BC')}이다. ${seg('AB')} = ${c} cm, ${seg('AC')} = ${bb} cm일 때, ${seg('BD')}의 길이는?`, c * c, a, 'cm', {
          figure: w.f.b.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있고, 꼭짓점 A에서 변 BC에 내린 수선의 발이 D이며 직각 표시가 있다. AB = ${c} cm, AC = ${bb} cm`),
          explain: `${PYTH}${sq(seg('BC'))} = ${sq(c)} + ${sq(bb)} = ${a * a}이므로 ${seg('BC')} = ${a} cm이다. △ABC와 △DBA에서 ∠B는 공통이고 ∠BAC = ∠BDA = 90°이므로 △ABC ∽ △DBA이다. ${nb(`${seg('AB')} : ${seg('DB')} = ${seg('BC')} : ${seg('BA')}`)}에서 ${sq(seg('AB'))} = ${seg('BD')} × ${seg('BC')}이므로 ${sq(c)} = ${seg('BD')} × ${a}, ${seg('BD')} = ${fr(c * c, a)}(cm)이다.`,
          facts: { value: `${c}**2/(${c}**2+${bb}**2)**0.5`, unseen: [2, 0.5] }
        });
      }
      // AB = c, BD = u 를 주고 CD 를 구한다(AD = h, CD = h² ÷ u 가 자연수인 것)
      const [u, h, c] = d.pick([[9, 12, 15], [16, 12, 20], [18, 24, 30], [32, 24, 40]]), cd = h * h / u, ac = h * c / u, f = altFig(c, ac, { foot: 'D', markA: true, ab: cmL(c), bd: cmL(u) });
      return cmQ(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 ${seg('AD')} ⊥ ${seg('BC')}이다. ${seg('AB')} = ${c} cm, ${seg('BD')} = ${u} cm일 때, ${seg('CD')}의 길이는?`, cd, {
        figure: f.b.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있고, 꼭짓점 A에서 변 BC에 내린 수선의 발이 D이며 직각 표시가 있다. AB = ${c} cm, BD = ${u} cm`),
        explain: `△ABD에서 ${sq(seg('AD'))} = ${sq(c)} − ${sq(u)} = ${h * h}이므로 ${seg('AD')} = ${h} cm이다. △ABD와 △CAD에서 ∠ADB = ∠CDA = 90°, ∠ABD = 90° − ∠BAD = ∠CAD이므로 △ABD ∽ △CAD이다. ${nb(`${seg('BD')} : ${seg('AD')} = ${seg('AD')} : ${seg('CD')}`)}에서 ${sq(seg('AD'))} = ${seg('BD')} × ${seg('CD')}이므로 ${h * h} = ${u} × ${seg('CD')}, ${seg('CD')} = ${cd} cm이다.`,
        facts: { calc: [[`(${c}**2-${u}**2)/${u}`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('height-plane', '좌표평면에서 원점과 직선 사이의 거리', '①47 심36', (d) => {
      const [p, q, c] = legsOf(d, [[3, 4, 5], [6, 8, 10], [9, 12, 15]]), g0 = gcd(p, q), ca = q / g0, cb = p / g0, rhs = p * q / g0, b = planeFig(p, q), Yv = V('y');
      const eq = nb(`${ca === 1 ? '' : ca}${X} + ${cb === 1 ? '' : cb}${Yv} = ${rhs}`);
      return fracQ(`그림과 같이 좌표평면에서 일차방정식 ${eq}의 그래프가 ${X}축, ${Yv}축과 만나는 점을 각각 A, B라 하자. 원점 O에서 이 그래프에 내린 수선의 발을 H라 할 때, ${seg('OH')}의 길이는?`, p * q, c, '', {
        figure: b.svg(`모눈이 그려진 좌표평면. 모눈 한 칸의 길이는 1이다. 직선이 x축과 원점에서 오른쪽으로 ${p}칸 간 점 A에서, y축과 원점에서 위쪽으로 ${q}칸 간 점 B에서 만난다. 원점 O에서 직선에 내린 수선의 발이 H이고 직각 표시가 있다`),
        explain: `${Yv} = 0일 때 ${X} = ${p}, ${X} = 0일 때 ${Yv} = ${q}이므로 ${seg('OA')} = ${p}, ${seg('OB')} = ${q}이다. △OAB에서 ${sq(seg('AB'))} = ${sq(p)} + ${sq(q)} = ${c * c}이므로 ${seg('AB')} = ${c}이다. △OAB의 넓이를 두 가지로 나타내면 ${HALF} × ${p} × ${q} = ${HALF} × ${c} × ${seg('OH')}이므로 ${seg('OH')} = ${fr(p * q, c)}이다.`,
        facts: { value: `${p}*${q}/(${p}**2+${q}**2)**0.5`, unseen: [2, 0.5] }
      });
    }),
    T('height-square-ext', '정사각형의 변의 연장선이 만드는 삼각형의 넓이', '①48 심37', (d) => {
      // 한 변 s, CE = p, BE = hyp. DE = s − p, DF = s(s − p) ÷ p
      const [s, p, hyp] = d.pick([[4, 3, 5], [8, 6, 10], [16, 12, 20], [20, 15, 25], [28, 21, 35], [12, 5, 13]]), de = s - p, df = s * de / p;
      const P = lay({ A: [0, s], B: [0, 0], C: [s, 0], D: [s, s], E: [s, p], F: [s + df, s] }, [200, 124]), b = Board(), centre = cen([P.A, P.B, P.C, P.D]);
      b.poly([P.A, P.B, P.C, P.D]).poly([P.D, P.E, P.F], TINT).seg(P.B, P.F);
      b.beside(P.A, P.B, cmL(s), centre).beside(P.B, P.E, cmL(hyp), P.C, { t: 0.45, gap: 3 });
      b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 90).name(P.E, 'E', 335, 12).name(P.F, 'F', 10, 12);
      return fracQ(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형 ABCD에서 변 DC 위의 점 E에 대하여 ${seg('BE')}의 연장선과 ${seg('AD')}의 연장선이 만나는 점을 F라 하자. ${seg('BE')} = ${hyp} cm일 때, △DEF의 넓이는?`, s * de * de, 2 * p, 'cm²', {
        figure: b.svg(`정사각형 ABCD. 변 DC 위에 점 E가 있고, 선분 BE를 늘인 선과 변 AD를 점 D 쪽으로 늘인 선이 점 F에서 만난다. 삼각형 DEF가 색칠되어 있다. AB = ${s} cm, BE = ${hyp} cm`),
        explain: `△BCE에서 ${sq(seg('CE'))} = ${sq(hyp)} − ${sq(s)} = ${p * p}이므로 ${seg('CE')} = ${p} cm, ${seg('DE')} = ${s} − ${p} = ${de}(cm)이다. △FDE와 △BCE에서 ∠FDE = ∠BCE = 90°, ∠FED = ∠BEC(맞꼭지각)이므로 △FDE ∽ △BCE이다. ${nb(`${seg('DF')} : ${seg('CB')} = ${seg('DE')} : ${seg('CE')}`)}에서 ${seg('DF')} = ${frac(`${s} × ${de}`, p)} = ${fr(s * de, p)}(cm)이다. △DEF의 넓이는 ${HALF} × ${de} × ${fr(s * de, p)} = ${fr(s * de * de, 2 * p)}(cm²)이다.`,
        facts: { value: `(${s}-(${hyp}**2-${s}**2)**0.5)**2*${s}/(2*(${hyp}**2-${s}**2)**0.5)`, unseen: [2, 0.5] }
      });
    }),
    T('height-two-squares', '나란히 붙인 두 정사각형을 가로지르는 선분', '심38', (d) => {
      // 큰 정사각형의 한 변 m, 작은 정사각형의 한 변 n, BF 는 직각을 낀 두 변이 m + n, n 인 직각삼각형의 빗변
      const [m, n, bf] = d.pick([[7, 5, 13], [17, 7, 25], [14, 10, 26], [23, 12, 37], [21, 15, 39], [28, 20, 52]]), be = m + n;
      const P = lay({ A: [0, m], B: [0, 0], C: [m, 0], D: [m, m], E: [be, 0], F: [be, n], G: [m, n], H: [m, n * m / be] }, [200, 132]), b = Board();
      b.poly([P.A, P.B, P.C, P.D]).poly([P.C, P.E, P.F, P.G]).seg(P.B, P.F);
      b.beside(P.B, P.F, cmL(bf), P.E, { t: 0.36, gap: 3 }).beside(P.G, P.F, cmL(n), P.E);
      b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 270).name(P.D, 'D', 45).name(P.E, 'E', 315).name(P.F, 'F', 20, 12).name(P.G, 'G', 150, 12).name(P.H, 'H', 300, 12);
      return fracQ(`그림에서 □ABCD와 □GCEF는 정사각형이고 세 점 B, C, E는 한 직선 위에 있다. ${seg('BF')}와 ${seg('GC')}가 만나는 점을 H라 하자. ${seg('BF')} = ${bf} cm, ${seg('GF')} = ${n} cm일 때, ${seg('CH')}의 길이는?`, n * m, be, 'cm', {
        figure: b.svg(`큰 정사각형 ABCD의 오른쪽에 작은 정사각형 GCEF가 밑변을 한 직선 위에 두고 붙어 있다. 점 G는 변 DC 위에 있다. 선분 BF가 선분 GC와 점 H에서 만난다. BF = ${bf} cm, GF = ${n} cm`),
        explain: `△FBE에서 ${seg('FE')} = ${seg('GF')} = ${n} cm이므로 ${sq(seg('BE'))} = ${sq(bf)} − ${sq(n)} = ${be * be}, ${seg('BE')} = ${be} cm이다. ${seg('CE')} = ${n} cm이므로 ${seg('BC')} = ${be} − ${n} = ${m}(cm)이다. ${seg('HC')} ∥ ${seg('FE')}이므로 △BCH ∽ △BEF이고 ${nb(`${seg('CH')} : ${seg('EF')} = ${seg('BC')} : ${seg('BE')}`)}이다. ${seg('CH')} = ${frac(`${n} × ${m}`, be)} = ${fr(n * m, be)}(cm)이다.`,
        facts: { value: `${n}*((${bf}**2-${n}**2)**0.5-${n})/(${bf}**2-${n}**2)**0.5`, unseen: [2, 0.5] }
      });
    })
  ]);

  B.addTypes(UNIT, 'semi', [
    T('semi-sum', '빗변의 길이로 반원의 넓이의 합 구하기', '①51 심23', (d, n) => {
      const [c, bb] = d.pick([[3, 4], [4, 3], [5, 6], [6, 5], [4, 5], [5, 4]]);
      if (n === 0) {
        const a = 4 * d.int(1, 5), f = semiFig(c, bb, 'legs', { inside: { AB: svS(1), AC: svS(2) }, bc: cmL(a) });
        return piQ(`그림과 같이 ∠A = 90°이고 ${seg('BC')} = ${a} cm인 직각삼각형 ABC에서 두 변 AB, AC를 각각 지름으로 하는 반원의 넓이를 ${S(1)}, ${S(2)}라 할 때, ${nb(`${S(1)} + ${S(2)}`)}의 값은?`, a * a / 8, {
          figure: f.b.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 변 AB, 변 AC를 각각 지름으로 하는 반원이 삼각형의 바깥쪽에 색칠되어 있고 차례로 S1, S2라고 적혀 있다. BC = ${a} cm`),
          explain: `${S(1)} + ${S(2)} = ${HALF} × ${PI} × ${sq(`(${frac(seg('AB'), 2)})`)} + ${HALF} × ${PI} × ${sq(`(${frac(seg('AC'), 2)})`)} = ${frac(PI, 8)} × (${sq(seg('AB'))} + ${sq(seg('AC'))})이다. ${sq(seg('AB'))} + ${sq(seg('AC'))} = ${sq(seg('BC'))} = ${a * a}이므로 ${S(1)} + ${S(2)} = ${frac(PI, 8)} × ${a * a} = ${a * a / 8}${PI}(cm²)이다.`,
          facts: { calc: [[`${a}**2/8`, 0]], unseen: [2, 8] }
        });
      }
      const a = 2 * d.int(2, 8), f = semiFig(c, bb, 'three', {});
      return piQ(`그림과 같이 ∠A = 90°이고 ${seg('BC')} = ${a} cm인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 세 반원의 넓이의 합은?`, a * a / 4, {
        figure: f.b.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 세 변 AB, AC, BC를 각각 지름으로 하는 반원이 삼각형의 바깥쪽에 그려져 있다`),
        explain: `변 BC를 지름으로 하는 반원의 넓이는 ${HALF} × ${PI} × ${sq(a / 2)} = ${fr(a * a, 8)}${PI}(cm²)이다. 두 변 AB, AC를 지름으로 하는 반원의 넓이의 합은 변 BC를 지름으로 하는 반원의 넓이와 같으므로 세 반원의 넓이의 합은 2 × ${fr(a * a, 8)}${PI} = ${a * a / 4}${PI}(cm²)이다.`,
        facts: { calc: [[`${a}**2/4`, 0]], unseen: [2, 4] }
      });
    }, { count: 2 }),
    T('semi-other', '두 반원의 넓이로 나머지 반원의 넓이와 변의 길이 구하기', '①52', (d, n) => {
      const P_ = V('P'), Q_ = V('Q'), R_ = V('R'), svI = (ch) => sv(ch);
      const fig = (c, bb) => semiFig(c, bb, 'three', { inside: { AB: svI('P'), AC: svI('Q'), BC: svI('R') } }).b.svg('직각삼각형 ABC. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 세 변을 각각 지름으로 하는 반원이 삼각형의 바깥쪽에 그려져 있고, 변 AB 위의 반원에 P, 변 AC 위의 반원에 Q, 변 BC 위의 반원에 R라고 적혀 있다');
      const head = `그림과 같이 ∠A = 90°인 직각삼각형 ABC의 세 변 AB, AC, BC를 각각 지름으로 하는 반원의 넓이를 차례로 ${P_}, ${Q_}, ${R_}이라 하자. `;
      if (n === 0) {
        const [p, q] = d.until(() => [d.int(4, 40), d.int(4, 40)], ([u, v]) => u !== v && Math.max(u, v) / Math.min(u, v) <= 2.4);
        return piQ(`${head}${P_} = ${p}${PI} cm², ${R_} = ${p + q}${PI} cm²일 때, ${Q_}의 값은?`, q, {
          figure: fig(Math.sqrt(p), Math.sqrt(q)),
          explain: `직각을 낀 두 변을 지름으로 하는 반원의 넓이의 합은 빗변을 지름으로 하는 반원의 넓이와 같으므로 ${P_} + ${Q_} = ${R_}이다. ${Q_} = ${p + q}${PI} − ${p}${PI} = ${q}${PI}(cm²)이다.`,
          facts: { calc: [[`${p + q}-${p}`, 0]] }
        });
      }
      if (n === 1) {
        const ac = 4 * d.int(1, 4), q = ac * ac / 8, p = d.until(() => d.int(4, 40), (u) => u !== q && Math.max(u, q) / Math.min(u, q) <= 2.4);
        return cmQ(`${head}${P_} = ${p}${PI} cm², ${R_} = ${p + q}${PI} cm²일 때, ${seg('AC')}의 길이는?`, ac, {
          figure: fig(Math.sqrt(p), Math.sqrt(q)),
          explain: `${P_} + ${Q_} = ${R_}이므로 ${Q_} = ${p + q}${PI} − ${p}${PI} = ${q}${PI}(cm²)이다. ${Q_} = ${HALF} × ${PI} × ${sq(`(${frac(seg('AC'), 2)})`)} = ${frac(PI, 8)} × ${sq(seg('AC'))}이므로 ${sq(seg('AC'))} = ${q} × 8 = ${ac * ac}이고 ${seg('AC')} = ${ac} cm이다.`,
          facts: { calc: [[`(8*(${p + q}-${p}))**0.5`, 0]], unseen: [8, 0.5] }
        });
      }
      const ab = 4 * d.int(1, 4), own = ab * ab / 8, k = d.until(() => d.int(2, 30), (u) => u !== own);
      return piQ(`∠B = 90°인 직각삼각형 ABC에서 ${seg('AB')} = ${ab} cm이고, 변 BC를 지름으로 하는 반원의 넓이가 ${k}${PI} cm²일 때, 변 AC를 지름으로 하는 반원의 넓이는?`, own + k, {
        explain: `변 AB를 지름으로 하는 반원의 넓이는 ${HALF} × ${PI} × ${sq(ab / 2)} = ${own}${PI}(cm²)이다. 빗변 AC를 지름으로 하는 반원의 넓이는 나머지 두 변을 지름으로 하는 반원의 넓이의 합과 같으므로 ${own}${PI} + ${k}${PI} = ${own + k}${PI}(cm²)이다.`,
        facts: { calc: [[`${ab}**2/8+${k}`, 0]], unseen: [2, 8] }
      });
    }, { count: 3 }),
    T('semi-lune', '초승달 모양 두 부분의 넓이', '①53', (d) => {
      const [c, bb, a] = legsOf(d, [[3, 4, 5], [6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17], [12, 16, 20]]), f = semiFig(c, bb, 'lune', { bc: cmL(a), ab: cmL(c) });
      return areaQ(`그림은 ∠A = 90°인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그린 것이다. ${seg('AB')} = ${c} cm, ${seg('BC')} = ${a} cm일 때, 색칠한 부분의 넓이는?`, c * bb / 2, {
        figure: f.b.svg(`${LUNE_SAID}. AB = ${c} cm, BC = ${a} cm`),
        explain: `두 변 AB, AC를 지름으로 하는 반원의 넓이의 합은 변 BC를 지름으로 하는 반원의 넓이와 같다. 색칠한 부분의 넓이는 (작은 두 반원의 넓이의 합) + △ABC − (큰 반원의 넓이)이므로 △ABC의 넓이와 같다. ${sq(seg('AC'))} = ${sq(a)} − ${sq(c)} = ${bb * bb}에서 ${seg('AC')} = ${bb} cm이므로 색칠한 부분의 넓이는 ${HALF} × ${c} × ${bb} = ${c * bb / 2}(cm²)이다.`,
        facts: { calc: [[`${c}*(${a}**2-${c}**2)**0.5/2`, 0]], unseen: [2, 0.5] }
      });
    }),
    T('semi-lune-back', '초승달 모양 두 부분의 넓이로 빗변의 길이 구하기', '①54', (d) => {
      const [c, bb, a] = legsOf(d, [[3, 4, 5], [6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17], [12, 16, 20]]), area = c * bb / 2, f = semiFig(c, bb, 'lune', { ab: cmL(c) });
      return cmQ(`그림은 ∠A = 90°인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그린 것이다. ${seg('AB')} = ${c} cm이고 색칠한 부분의 넓이가 ${area} cm²일 때, ${seg('BC')}의 길이는?`, a, {
        figure: f.b.svg(`${LUNE_SAID}. AB = ${c} cm`),
        explain: `색칠한 부분의 넓이는 △ABC의 넓이와 같으므로 ${HALF} × ${c} × ${seg('AC')} = ${area}에서 ${seg('AC')} = ${bb} cm이다. ${sq(seg('BC'))} = ${sq(c)} + ${sq(bb)} = ${a * a}이므로 ${seg('BC')} = ${a} cm이다.`,
        facts: { calc: [[`(${c}**2+(2*${area}/${c})**2)**0.5`, 0]], unseen: [2, 0.5] }
      });
    }),
    T('semi-lune-why', '초승달 모양의 넓이가 삼각형의 넓이와 같음을 보이는 과정의 빈칸', '①55', (d) => {
      const [c, bb] = d.pick([[3, 4], [4, 3], [5, 6], [6, 5]]), f = semiFig(c, bb, 'lune', {}), P_ = V('P'), Q_ = V('Q'), R_ = V('R');
      const right = `㈎ ${P_} + ${Q_}, ㈏ ${R_}`;
      // 틀린 보기: 세 넓이의 관계를 차로 아는 아이 / 빼는 것이 큰 반원임을 놓친 아이 / 반원이 아니라 원의 넓이로 셈한 아이
      const options = d.shuffle([right, `㈎ ${P_} − ${Q_}, ㈏ ${R_}`, `㈎ ${P_} + ${Q_}, ㈏ ${P_}`, `㈎ 2(${P_} + ${Q_}), ㈏ 2${R_}`]);
      return C(`그림은 ∠A = 90°인 직각삼각형 ABC의 세 변 AB, AC, BC를 각각 지름으로 하는 반원을 그린 것이고, 세 반원의 넓이를 차례로 ${P_}, ${Q_}, ${R_}이라 하자. 다음은 색칠한 부분의 넓이가 △ABC의 넓이와 같음을 보이는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 적은 것은?`, options, options.indexOf(right), {
        figure: f.b.svg(LUNE_SAID) + lines([`${sq(seg('AB'))} + ${sq(seg('AC'))} = ${sq(seg('BC'))}이므로 ${R_} = ㈎이다.`, `(색칠한 부분의 넓이) = ${P_} + ${Q_} + △ABC − ㈏ = △ABC`]),
        explain: `${P_} + ${Q_} = ${frac(PI, 8)} × (${sq(seg('AB'))} + ${sq(seg('AC'))}) = ${frac(PI, 8)} × ${sq(seg('BC'))} = ${R_}이다. 색칠한 부분은 작은 두 반원과 △ABC를 합한 도형에서 큰 반원을 뺀 것이므로 그 넓이는 ${P_} + ${Q_} + △ABC − ${R_} = △ABC이다.`,
        facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('semi-four-lunes', '원 위에 네 꼭짓점이 있는 직사각형과 네 반원', '①56', (d) => {
      const [w, h] = d.until(() => [d.int(4, 16), d.int(4, 16)], ([u, v]) => u !== v && Math.max(u, v) / Math.min(u, v) <= 2 && Math.max(u, v) / Math.min(u, v) >= 1.25), k = 184 / (w + h), b = Board(), O = [0, 0];
      const A = [-w * k / 2, -h * k / 2], Bp = [-w * k / 2, h * k / 2], Cp = [w * k / 2, h * k / 2], D = [w * k / 2, -h * k / 2];
      for (const [p, q] of [[A, D], [D, Cp], [Cp, Bp], [Bp, A]]) semi(b, p, q, O, TINT);
      b.disk(O, Math.sqrt(w * w + h * h) * k / 2, WHITE).poly([A, Bp, Cp, D]);
      b.beside(A, D, cmL(w), [0, -400], { gap: 4 }).beside(A, Bp, cmL(h), [-400, 0], { gap: 4 });
      b.name(A, 'A', 135, 10).name(Bp, 'B', 225, 10).name(Cp, 'C', 315, 10).name(D, 'D', 45, 10);
      return areaQ(`그림과 같이 ${seg('AB')} = ${h} cm, ${seg('AD')} = ${w} cm인 직사각형 ABCD의 네 꼭짓점이 한 원 위에 있다. 직사각형의 네 변을 각각 지름으로 하는 반원을 그렸을 때, 색칠한 부분의 넓이는?`, w * h, {
        figure: b.svg(`직사각형 ABCD의 네 꼭짓점을 지나는 원이 그려져 있다. 직사각형의 네 변을 각각 지름으로 하는 반원이 직사각형의 바깥쪽에 그려져 있고, 네 반원에서 원의 바깥에 있는 초승달 모양의 네 부분이 색칠되어 있다. AB = ${h} cm, AD = ${w} cm`),
        explain: `대각선 BD를 그으면 △ABD는 ∠A = 90°인 직각삼각형이고 원은 BD를 지름으로 한다. 두 변 AB, AD 위의 초승달 모양 두 부분의 넓이의 합은 △ABD의 넓이와 같다. 마찬가지로 두 변 CB, CD 위의 초승달 모양 두 부분의 넓이의 합은 △CDB의 넓이와 같다. 색칠한 부분의 넓이는 직사각형 ABCD의 넓이와 같으므로 ${h} × ${w} = ${w * h}(cm²)이다.`,
        facts: { calc: [[`${h}*${w}`, 0]] }
      });
    })
  ]);

  B.addTypes(UNIT, 'use', [
    T('use-height-diff', '높이가 다른 두 기둥의 꼭대기 사이의 거리', '①58', (d) => {
      const w = d.until(() => {
        const [dist0, diff, rope] = legsOf(d, [[4, 3, 5], [12, 5, 13], [8, 6, 10], [15, 8, 17], [12, 9, 15], [24, 7, 25], [24, 10, 26], [16, 12, 20]]), h2 = d.int(2, 6), h1 = h2 + diff;
        const k = Math.min(176 / dist0, 116 / h1), b = Board(), T1 = [0, -h1 * k], T2 = [dist0 * k, -h2 * k], G1 = [0, 0], G2 = [dist0 * k, 0], POLE = 'stroke:#8a6d3b;stroke-width:4.5;stroke-linecap:butt';
        b.seg([-16, 0], [dist0 * k + 16, 0]).seg(G1, T1, null, POLE).seg(G2, T2, null, POLE).seg(T1, T2, null, 'stroke:#1d4ed8;stroke-width:1.8');
        b.beside(G1, T1, `${h1} m`, G2, { gap: 7 }).beside(G2, T2, `${h2} m`, G1, { gap: 7 }).dim(G1, G2, `${dist0} m`, [0, -100], 9);
        return { dist0, diff, rope, h1, h2, b, low: h2 * k };
      }, (x) => x.low >= 20 && x.dist0 / x.h1 <= 3.2 && x.h1 / x.dist0 <= 1.6);
      const { dist0, diff, rope, h1, h2 } = w;
      return N(`그림과 같이 평평한 땅에 수직으로 서 있는 두 기둥의 높이는 각각 ${h1} m, ${h2} m이고, 두 기둥 사이의 거리는 ${dist0} m이다. 두 기둥의 꼭대기를 팽팽하게 잇는 줄의 길이는?`, rope, {
        unit: 'm', figure: w.b.svg(`평평한 땅에 높이 ${h1} m인 기둥과 높이 ${h2} m인 기둥이 ${dist0} m 떨어져 수직으로 서 있고, 두 기둥의 꼭대기가 줄로 이어져 있다`),
        explain: `낮은 기둥의 꼭대기에서 높은 기둥에 수선을 그으면 직각을 낀 두 변의 길이가 ${dist0} m, ${h1} − ${h2} = ${diff}(m)인 직각삼각형이 생기고, 줄은 그 빗변이다. ${sq(dist0)} + ${sq(diff)} = ${rope * rope}이고 ${sq(rope)} = ${rope * rope}이므로 줄의 길이는 ${rope} m이다.`,
        facts: { calc: [[`(${dist0}**2+(${h1}-${h2})**2)**0.5`, 0]], unseen: [2, 0.5] }
      });
    }),
    T('use-cone-height', '원뿔의 높이', '①60', (d) => {
      const [r, h, l] = d.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [10, 24, 26], [8, 6, 10], [12, 16, 20], [15, 20, 25]]), k = Math.min(64 / r, 124 / h), rk = r * k, ry = rk * 0.27, b = Board(), top = [0, -h * k], O = [0, 0], A = [rk, 0], L = [-rk, 0];
      b.shape(`M${XY(L)}A${r1(rk)} ${r1(ry)} 0 0 0 ${XY(A)}`, [L, A, [0, ry]], CLEAR).shape(`M${XY(L)}A${r1(rk)} ${r1(ry)} 0 0 1 ${XY(A)}`, [[0, -ry]], 'fill:none;stroke:#5b6770;stroke-width:1.2;stroke-dasharray:4 3');
      b.seg(top, L).seg(top, A).seg(top, O, 'cut').seg(O, A, 'cut').corner(O, A, top, '').dot(O, 2.2);
      b.beside(top, A, cmL(l), O).dim([0, ry + 3], [rk, ry + 3], cmL(r), [rk / 2, -60], 7);
      return cmQ(`그림과 같이 모선의 길이가 ${l} cm, 밑면의 반지름의 길이가 ${r} cm인 원뿔의 높이는?`, h, {
        figure: b.svg(`원뿔의 겨냥도. 모선의 길이는 ${l} cm, 밑면의 반지름의 길이는 ${r} cm이다. 꼭짓점에서 밑면의 중심까지 점선이 그어져 있고 밑면의 반지름과 직각을 이룬다는 표시가 있다`),
        explain: `원뿔의 높이, 밑면의 반지름, 모선은 모선을 빗변으로 하는 직각삼각형을 이룬다. 높이를 제곱하면 ${sq(l)} − ${sq(r)} = ${h * h}이고 ${sq(h)} = ${h * h}이므로 높이는 ${h} cm이다.`,
        facts: { calc: [[`(${l}**2-${r}**2)**0.5`, 0]], unseen: [2, 0.5] }
      });
    }),
    T('use-sphere-cut', '구를 평면으로 자른 단면의 넓이', '①62', (d) => {
      const [R, dd] = d.until(() => [d.int(5, 13), d.int(2, 11)], ([u, v]) => v <= u - 2 && v / u >= 0.45 && v / u <= 0.75), k = 66 / R, b = Board(), O = [0, 0], H = [0, -dd * k], wide = Math.sqrt(R * R - dd * dd) * k, ry = wide * 0.2, Pp = [wide, -dd * k], Lp = [-wide, -dd * k];
      b.disk(O, R * k).shape(`M${XY(Lp)}A${r1(wide)} ${r1(ry)} 0 0 0 ${XY(Pp)}`, [Lp, Pp], 'fill:none;stroke-width:1.2').shape(`M${XY(Lp)}A${r1(wide)} ${r1(ry)} 0 0 1 ${XY(Pp)}`, [Lp, Pp], 'fill:none;stroke:#5b6770;stroke-width:1.2;stroke-dasharray:4 3');
      b.seg(O, H, 'thin').seg(H, Pp, 'thin').seg(O, Pp, 'thin').corner(H, Pp, O, '').dot(O, 2.2).dot(H, 2.2);
      b.beside(O, H, cmL(dd), Pp, { gap: 4, t: 0.3 }).beside(O, Pp, cmL(R), H, { gap: 4 });
      b.name(O, 'O', 270);
      return piQ(`그림과 같이 반지름의 길이가 ${R} cm인 구를 중심 O에서 ${dd} cm 떨어진 평면으로 자를 때 생기는 단면인 원의 넓이는?`, R * R - dd * dd, {
        figure: b.svg(`중심이 O인 구와, 구를 평면으로 자른 단면인 원. 구의 중심 O에서 단면인 원의 중심까지 그은 선분의 길이는 ${dd} cm이고, 이 선분은 단면인 원의 반지름과 직각을 이룬다는 표시가 있다. 구의 중심 O에서 단면인 원 위의 한 점까지 그은 선분의 길이는 ${R} cm이다`),
        explain: `단면인 원의 중심을 H, 그 원 위의 한 점을 P라 하면 △OHP는 ∠OHP = 90°인 직각삼각형이고 ${seg('OP')} = ${R} cm, ${seg('OH')} = ${dd} cm이다. 단면인 원의 반지름의 길이를 제곱하면 ${sq(seg('HP'))} = ${sq(R)} − ${sq(dd)} = ${R * R - dd * dd}이므로 단면의 넓이는 ${R * R - dd * dd}${PI} cm²이다.`,
        facts: { calc: [[`${R}**2-${dd}**2`, 0]], unseen: [2] }
      });
    })
  ]);

  // 실력 파일(8-2-5c.js)이 함께 쓰는 그림
  Object.assign(K, { innerFig, pinFig, twoTriFig, TWO_SAID, altFig, rectFig, semiFig, LUNE_SAID, planeFig, notRight, three, SMALL, PI });
})(typeof window !== 'undefined' ? window : globalThis);
