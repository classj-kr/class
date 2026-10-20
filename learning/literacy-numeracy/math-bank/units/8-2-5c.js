// 중학교 2학년 2학기 5단원 피타고라스 정리 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 구하는 변 x 가 늘 빗변이라고 여긴다. 직각의 자리가 정해지지 않았는데도 두 수의 제곱을 더하기만 하고, 주어진 긴 변이 빗변인 경우를 놓친다.
//  - 세 변의 길이를 적힌 차례대로 a² + b² = c² 에 넣는다. 가장 긴 변을 먼저 찾지 않아, 가장 긴 변이 끝에 적혀 있지 않으면 직각삼각형을 놓친다.
//  - 정사각형의 넓이와 한 변의 길이를 섞는다. 넓이가 64, 36인 두 정사각형에서 빗변의 길이를 8 + 6 = 14 나 64 + 36 = 100 이라고 한다(넓이의 합이 빗변의 제곱이다).
//  - 넓이가 같은 삼각형은 합동인 것뿐이라고 여긴다. 유클리드의 그림에서 밑변이 같고 평행선 사이에 놓인 삼각형의 넓이가 같다는 것을 쓰지 못한다.
//  - 그림에 직각삼각형이 보이지 않으면 멈춘다. 사다리꼴·평행사변형에 수선을 긋거나, 직사각형 안의 점에서 변에 평행한 선을 그어 직각삼각형을 만들지 못한다.
//  - 접은 종이에서 접기 전과 길이가 같은 변을 놓치고, 겉면을 따라가는 가장 짧은 길을 모서리를 따라가는 길로 셈한다(펼친 그림의 선분이다).
//
// 실력에는 ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제(직각삼각형을 넷 이어 붙인 사슬,
// 사다리꼴에 수선을 그어 대각선 구하기, 넓이에서 거꾸로 변을 찾아 사다리꼴의 넓이 구하기, 대각선에 내린 두 수선의 발 사이의 거리, 무게중심과 외심, 닮음으로 찾는 평행사변형의 수선,
// 초승달의 넓이에서 빗변에 내린 수선까지, 접은 종이, 직육면체의 겉면을 따라가는 가장 짧은 길, 두 대각선이 수직인 사각형, 직사각형 안의 한 점)만 실었다.
// 묶음 끝의 열두 유형(hard-fold-diagonal 부터)은 처음 지을 때 꼬임·요령·「한 유형만」·앞 단원의 일이라는 까닭으로 뺐다가 2026-10-13 에 다시 실은 것이다(까닭은 8-2-5a.js 머리와 대조표에 있다).
// 그 가운데 원기둥의 옆면을 도는 길은 ①(펼친 직사각형의 가로는 밑면의 둘레의 길이이다), 나머지는 ②이다.
// 기본에서 하는 일을 고르기로 바꾼 것, 수만 키운 계산, 그림에서 답이 한눈에 보이는 것은 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C } = B.kit;
  const { V, nb, tagged, gcd } = B.kit.mid;
  const { RAD, r1, at, dirOf, mid, XY, meet, textW, TINT, CLEAR, Board } = B.kit.mgeo;
  const K = B.kit.m825;
  const { UNIT, STD, X, seg, sq, cmL, xL, HALF, cmQ, areaQ, fracQ, cen, lay, polyFig, sqOn, euclidFig, fitsIn, twoTriFig, TWO_SAID, rectFig, semiFig, LUNE_SAID, notRight, three, SMALL, PI } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '①66' 처럼 ①로 시작하게 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: (/^심/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')', make }, more || {});
  const KEYS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  const fr = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : frac(p / g, q / g); };

  // ── 그림 ──
  // ∠C = 90°인 직각삼각형 ABC(C 가 위, AB 가 밑변)와 두 변 CA, CB 위의 정사각형(넓이 p, q), 빗변의 중점 M 과 선분 CM
  function medianFig(p, q) {
    const ca = Math.sqrt(p), cb = Math.sqrt(q), ab = Math.sqrt(p + q), m = { C: [p / ab, ca * cb / ab], A: [0, 0], B: [ab, 0], M: [ab / 2, 0] };
    const s1 = sqOn(m.C, m.A, m.B), s2 = sqOn(m.C, m.B, m.A), P = lay(Object.assign({ U1: s1[2], U2: s1[3], V1: s2[2], V2: s2[3] }, m), [204, 156]), b = Board();
    b.poly([P.C, P.A, P.U1, P.U2], TINT).poly([P.C, P.B, P.V1, P.V2], TINT).poly([P.A, P.B, P.C]).seg(P.C, P.M).corner(P.C, P.A, P.B, '').tick(P.A, P.M).tick(P.M, P.B);
    if (fitsIn(ca * P.k, p + ' cm²') && fitsIn(cb * P.k, q + ' cm²')) b.text(cen([P.C, P.A, P.U1, P.U2]), p + ' cm²', { blue: true }).text(cen([P.C, P.B, P.V1, P.V2]), q + ' cm²', { blue: true });
    b.angle(P.C, dirOf(P.C, P.V2), dirOf(P.C, P.U2), 'C', { arc: false, ink: true }).nameFree(P.A, 'A', [dirOf(P.A, P.C), dirOf(P.A, P.B), dirOf(P.A, P.U1)]).nameFree(P.B, 'B', [dirOf(P.B, P.C), dirOf(P.B, P.A), dirOf(P.B, P.V1)]).name(P.M, 'M', 270);
    return b;
  }
  // ∠A = 90°인 직각삼각형 ABC 와 빗변 BC 의 아래쪽에 그린 정사각형 BDEC. 색칠한 두 삼각형 ABD, ACE
  function underFig(c, bb) {
    const a = Math.sqrt(c * c + bb * bb), P = lay({ A: [c * c / a, c * bb / a], B: [0, 0], C: [a, 0], D: [0, -a], E: [a, -a] }, [150, 196]), b = Board(), g = cen([P.A, P.B, P.C]);
    b.poly([P.B, P.D, P.E, P.C]).poly([P.A, P.B, P.D], TINT).poly([P.A, P.C, P.E], TINT).poly([P.A, P.B, P.C]).corner(P.A, P.B, P.C, '');
    b.beside(P.A, P.B, cmL(c), g).beside(P.A, P.C, cmL(bb), g).name(P.A, 'A', 90).name(P.B, 'B', 180).name(P.C, 'C', 0).name(P.D, 'D', 225).name(P.E, 'E', 315);
    return b;
  }
  // 직각삼각형을 이어 붙인 사슬: OA 에 수직인 AB, OB 에 수직인 BC, … 길이가 모두 같은 선분 n + 1 개
  function chainFig(n, label) {
    const pts = [[0, 0], [1, 0]], names = 'OABCDEF';
    for (let i = 1; i <= n; i += 1) { const p = pts[i], L = Math.hypot(p[0], p[1]); pts.push([p[0] - p[1] / L, p[1] + p[0] / L]); }
    const model = {}; pts.forEach((p, i) => { model[names[i]] = p; });
    const P = lay(model, [204, 150]), b = Board(), O = P.O;
    for (let i = 1; i <= n + 1; i += 1) { b.seg(O, P[names[i]]); if (i <= n) b.seg(P[names[i]], P[names[i + 1]]).corner(P[names[i]], O, P[names[i + 1]], '').tick(P[names[i]], P[names[i + 1]]); }
    b.tick(O, P.A).beside(O, P.A, label, P.B, { t: 0.3 });
    b.name(O, 'O', 250).name(P.A, 'A', 315);
    for (let i = 2; i <= n + 1; i += 1) b.name(P[names[i]], names[i], dirOf(O, P[names[i]]));
    return b;
  }
  // 직육면체의 겨냥도(앞면 BFGC, 윗면 ABCD, 아랫면 EFGH)와, 꼭짓점 A 에서 모서리 DH, CG 를 지나 꼭짓점 F 에 이르는 가장 짧은 길. FG = w, GH = dd, DH = h
  function boxFig(w, dd, h) {
    const k = Math.min(150 / (w + 0.56 * dd), 150 / (h + 0.4 * dd)), dv = [dd * k * 0.56, -dd * k * 0.4], add = (p) => [p[0] + dv[0], p[1] + dv[1]], b = Board(), ROUTE = 'stroke:#1d4ed8;stroke-width:1.9';
    const F = [0, 0], G = [w * k, 0], Cc = [w * k, -h * k], Bb = [0, -h * k], E = add(F), Hh = add(G), D = add(Cc), A = add(Bb);
    const Pp = mid(D, Hh, w / (2 * w + dd)), Q = mid(Cc, G, (w + dd) / (2 * w + dd));
    b.seg(A, E, 'cut').seg(E, F, 'cut').seg(E, Hh, 'cut').poly([Bb, F, G, Cc]).poly([Bb, A, D, Cc]).poly([Cc, G, Hh, D]);
    b.seg(A, Pp, 'cut', ROUTE + ';stroke-dasharray:4 3').seg(Pp, Q, null, ROUTE).seg(Q, F, null, ROUTE);
    b.beside(F, G, cmL(w), Cc).beside(G, Hh, cmL(dd), Cc).beside(Hh, D, cmL(h), Cc);
    // 꼭짓점의 이름은 그 둘레의 선(모서리와 길)에서 가장 먼 쪽에 적는다. clear: 이름과 선 사이의 가장 좁은 틈
    const lines = [[A, E], [E, F], [E, Hh], [Bb, F], [F, G], [G, Cc], [Cc, Bb], [Bb, A], [A, D], [D, Cc], [G, Hh], [Hh, D], [A, Pp], [Pp, Q], [Q, F]];
    const gapTo = (p, [s, e]) => { const vx = e[0] - s[0], vy = e[1] - s[1], t = Math.max(0, Math.min(1, ((p[0] - s[0]) * vx + (p[1] - s[1]) * vy) / (vx * vx + vy * vy))); return Math.hypot(p[0] - s[0] - t * vx, p[1] - s[1] - t * vy); };
    let clear = 99;
    for (const [p, label] of [[A, 'A'], [Bb, 'B'], [Cc, 'C'], [D, 'D'], [E, 'E'], [F, 'F'], [G, 'G'], [Hh, 'H']]) {
      let best = 0, room = -1;
      for (let a = 0; a < 360; a += 15) { const spot = at(p, 12, a), r = Math.min(...lines.map((line) => gapTo(spot, line))); if (r > room + 0.01) { room = r; best = a; } }
      b.name(p, label, best, 12); clear = Math.min(clear, room);
    }
    b.clear = clear;
    return b;
  }

  // ── 처음 지을 때 뺐다가 다시 실은 꼴의 그림과 답 ──
  // π가 붙은 길이·부피: 칸 뒤에 π와 단위를 붙여 계수만 받는다. 틀리면 「16π cm」처럼 보인다.
  const piN = (text, k, unit, o) => Object.assign(N(text, k, Object.assign({}, o, { unit })), { shown: k + unit });
  const FOLD_UNDER = 'fill:rgba(251,191,36,0.2)', FOLD_OVER = 'fill:rgba(251,191,36,0.6)', ROUTE = 'fill:none;stroke:#1d4ed8;stroke-width:1.9';
  // 선분 옆의 글이 다른 선에 닿지 않는 자리를 찾아 적는다. 판의 beside 가 글을 놓을 자리(상자)를 미리 셈해, 그 상자가 선분들(segs)에 닿지 않는 첫 자리를 고른다.
  // insides: 글을 두지 않을 쪽에 있는 점들(앞의 것부터 써 본다), ts: 선분을 따라간 자리들. 돌려주는 것: 닿지 않는 자리를 찾았는가
  const besideBox = (p, q, label, inside, t, gap) => {
    const m = mid(p, q, t), L = Math.hypot(q[0] - p[0], q[1] - p[1]), w = textW(label); let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
    if ((inside[0] - m[0]) * n[0] + (inside[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const off = (w / 2) * Math.abs(n[0]) + 7 * Math.abs(n[1]) + gap, c = [m[0] + n[0] * off, m[1] + n[1] * off];
    return [c[0] - w / 2 - 2, c[1] - 8.5, c[0] + w / 2 + 2, c[1] + 8.5];
  };
  const crosses = ([a, c], [x0, y0, x1, y1]) => {
    let t0 = 0, t1 = 1; const dx = c[0] - a[0], dy = c[1] - a[1];
    for (const [k, room] of [[-dx, a[0] - x0], [dx, x1 - a[0]], [-dy, a[1] - y0], [dy, y1 - a[1]]]) {
      if (k === 0) { if (room < 0) return false; } else if (k < 0) { if (room / k > t1) return false; t0 = Math.max(t0, room / k); } else { if (room / k < t0) return false; t1 = Math.min(t1, room / k); }
    }
    return true;
  };
  function putBeside(b, p, q, label, insides, ts, segs) {
    for (const inside of insides) for (const t of ts) if (!segs.some((line) => crosses(line, besideBox(p, q, label, inside, t, 3)))) { b.beside(p, q, label, inside, { t, gap: 3 }); return true; }
    b.beside(p, q, label, insides[0], { t: ts[0], gap: 3 }); return false;
  }
  // 직사각형 모양의 종이 ABCD(AB = h, BC = w, w > h)를 대각선 BD 로 접은 그림. 꼭짓점 C 가 옮겨진 점 C′, AD 와 BC′ 의 교점 E, 점 E 에서 BD 에 내린 수선의 발 F
  function foldDiagFig(h, w) {
    const d2 = w * w + h * h, P = lay({ A: [0, h], B: [0, 0], C: [w, 0], D: [w, h], K: [w * (w * w - h * h) / d2, 2 * w * w * h / d2], E: [(w * w - h * h) / (2 * w), h], F: [w / 2, h / 2] }, [196, 150]), b = Board();
    b.poly([P.A, P.B, P.E], FOLD_UNDER).poly([P.B, P.K, P.D], FOLD_OVER).seg(P.E, P.D, 'cut').seg(P.B, P.C, 'cut').seg(P.C, P.D, 'cut').seg(P.E, P.F).corner(P.F, P.D, P.E, '');
    b.beside(P.A, P.B, cmL(h), P.D).beside(P.B, P.C, cmL(w), P.A);
    b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 5).name(P.K, 'C′', 90);
    b.nameFree(P.E, 'E', [P.A, P.D, P.K, P.B, P.F].map((q) => dirOf(P.E, q))).name(P.F, 'F', dirOf(P.E, P.F), 12);
    return b;
  }
  // 정삼각형 ABC 의 내부의 점 P(∠BPC = 150°인 자리, phi 로 고른다)와, 점 P 를 점 B 를 중심으로 60° 돌린 점 Q(△ABP ≡ △CBQ)
  function turnFig(phi) {
    const h = Math.sqrt(3) / 2, p = [0.5 + Math.cos(phi * RAD), -h + Math.sin(phi * RAD)], q = [p[0] / 2 + p[1] * h, -p[0] * h + p[1] / 2];
    const P = lay({ A: [0.5, h], B: [0, 0], C: [1, 0], P: p, Q: q }, [176, 196]), b = Board(), low = (a) => (a > 180 ? a - 360 : a);
    b.poly([P.A, P.B, P.C]).seg(P.P, P.A).seg(P.P, P.B).seg(P.P, P.C).seg(P.B, P.Q).seg(P.C, P.Q).seg(P.P, P.Q).tick(P.B, P.P).tick(P.B, P.Q);
    b.sym(P.B, (dirOf(P.B, P.A) + dirOf(P.B, P.P)) / 2, 'dot', 26).sym(P.B, (low(dirOf(P.B, P.C)) + low(dirOf(P.B, P.Q))) / 2, 'dot', 26);
    for (const [key, ends] of [['A', 'BCP'], ['B', 'ACPQ'], ['C', 'ABPQ'], ['P', 'ABCQ'], ['Q', 'BCP']]) b.nameFree(P[key], key, ends.split('').map((e) => dirOf(P[key], P[e])));
    return b;
  }
  // 직각의 꼭짓점 R(왼쪽 아래), 세로 변의 끝 T(0, p), 가로 변의 끝 S(q, 0)인 직각삼각형과, 세로 변 위의 점 D(0, u), 가로 변 위의 점 E(v, 0). 선분 TE, SD, DE 를 긋는다. names { R, T, S }
  function crossFig(p, q, u, v, names) {
    const P = lay({ R: [0, 0], T: [0, p], S: [q, 0], D: [0, u], E: [v, 0] }, [176, 150]), b = Board();
    b.poly([P.R, P.S, P.T]).seg(P.T, P.E).seg(P.S, P.D).seg(P.D, P.E).corner(P.R, P.S, P.T, '');
    b.name(P.R, names.R, 225).name(P.T, names.T, 100).name(P.S, names.S, 350).name(P.D, 'D', 180).name(P.E, 'E', 270);
    return { b, P };
  }
  // ∠C = 90°인 직각삼각형 ABC(C 가 왼쪽 아래, A 가 위)와 빗변 AB 를 삼등분하는 두 점 M(A 쪽), N. CM = m, CN = n
  function trisectFig(m, n) {
    const p = Math.sqrt((4 * n * n - m * m) / 15), q = Math.sqrt((4 * m * m - n * n) / 15), P = lay({ A: [0, 3 * q], C: [0, 0], B: [3 * p, 0], M: [p, 2 * q], N: [2 * p, q] }, [190, 150]), b = Board();
    const out = Math.atan2(p, q) / RAD, left = p >= q;
    b.poly([P.C, P.B, P.A]).seg(P.C, P.M).seg(P.C, P.N).corner(P.C, P.B, P.A, '').tick(P.A, P.M).tick(P.M, P.N).tick(P.N, P.B);
    // 길이 하나는 꼭짓점 C 에서 벌어진 바깥 두 틈 가운데 넓은 쪽에, 다른 하나는 가운데 틈에 적는다(선에 닿지 않는 자리를 찾는다).
    const lines = [[P.C, P.A], [P.C, P.B], [P.A, P.B], [P.C, P.M], [P.C, P.N]], side = left ? P.B : P.A, ts = [0.62, 0.7, 0.54, 0.78, 0.46];
    b.clear = [putBeside(b, P.C, P.M, cmL(m), [side], ts, lines), putBeside(b, P.C, P.N, cmL(n), [side], ts, lines)].every(Boolean);
    b.name(P.A, 'A', 110).name(P.B, 'B', 340).name(P.C, 'C', 225).name(P.M, 'M', out, 12).name(P.N, 'N', out, 12);
    return b;
  }
  // △ABC(AC 가 밑변)의 두 변 AB, BC 위의 점 D, E 와, 점 F 에서 수직으로 만나는 두 선분 AE, CD. AF : FE = CF : FD = r : 1 이고 FE : FD = a : bq
  function perpFig(r, a, bq) {
    const psi = Math.atan2(bq, a), turn = ([x, y]) => [x * Math.cos(psi) - y * Math.sin(psi), x * Math.sin(psi) + y * Math.cos(psi)];
    const P = lay({ A: turn([-r * a, 0]), C: turn([0, -r * bq]), B: turn([r * a / (r - 1), r * bq / (r - 1)]), D: turn([0, bq]), E: turn([a, 0]), F: [0, 0] }, [190, 164]), b = Board(), g = cen([P.A, P.B, P.C]);
    b.poly([P.A, P.C, P.B]).seg(P.A, P.E).seg(P.C, P.D).seg(P.D, P.E).corner(P.F, P.A, P.D, '');
    b.name(P.A, 'A', 200).name(P.C, 'C', 340).name(P.B, 'B', 90).name(P.D, 'D', dirOf(g, P.D), 12).name(P.E, 'E', dirOf(g, P.E), 12).angle(P.F, dirOf(P.F, P.A), dirOf(P.F, P.C), 'F', { arc: false, ink: true });
    return b;
  }
  // 한 변의 길이가 s 인 정사각형 모양의 종이 ABCD 를 EF 로 접어 꼭짓점 B 가 변 AD 위의 점 B′(AB′ = p)에 오게 한 그림. EB = e. 꼭짓점 C 가 옮겨진 점 C′, B′C′ 과 변 DC 의 교점 G
  function foldSquareFig(s, e, p) {
    const turn = (s * p - (p * p + s * s) / 2) / (p * p + s * s), a = s - e;
    const P = lay({ A: [0, s], B: [0, 0], C: [s, 0], D: [s, s], E: [0, e], F: [s, e - p], V: [p, s], W: [s - 2 * turn * p, -2 * turn * s], G: [s, s - p * (s - p) / a] }, [196, 172]), b = Board();
    b.poly([P.A, P.E, P.F, P.D], FOLD_UNDER).poly([P.E, P.V, P.W, P.F], FOLD_OVER).seg(P.E, P.B, 'cut').seg(P.B, P.C, 'cut').seg(P.C, P.F, 'cut');
    b.beside(P.E, P.B, cmL(e), P.C).beside(P.B, P.C, cmL(s), P.A);
    b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).name(P.E, 'E', 180).name(P.F, 'F', 318, 12).name(P.V, 'B′', 90).name(P.W, 'C′', dirOf(P.G, P.W), 13).name(P.G, 'G', 28, 12);
    return b;
  }
  // 원기둥(밑면의 반지름 r, 높이는 hk × π)과, 밑면의 둘레 위의 점 A 에서 옆면을 따라 한 바퀴 돌아 바로 위의 점 B 에 이르는 길. 보이는 쪽은 실선, 뒤쪽은 점선
  function cylPathFig(r, hk) {
    const rx = Math.min(50, 150 * r / (hk * Math.PI)), ry = rx * 0.27, H = hk * Math.PI * rx / r, b = Board(), O = [0, 0], A = [rx, 0], L = [-rx, 0], Bp = [rx, -H], Lt = [-rx, -H];
    const way = (t0, t1) => 'M' + Array.from({ length: 25 }, (_, i) => { const t = t0 + (t1 - t0) * i / 24; return XY([rx * Math.cos(2 * Math.PI * t), -H * t + ry * Math.sin(2 * Math.PI * t)]); }).join('L');
    b.shape(`M${XY(Lt)}A${r1(rx)} ${r1(ry)} 0 0 0 ${XY(Bp)}A${r1(rx)} ${r1(ry)} 0 0 0 ${XY(Lt)}Z`, [[0, -H - ry], [0, -H + ry]], CLEAR);
    b.shape(`M${XY(L)}A${r1(rx)} ${r1(ry)} 0 0 0 ${XY(A)}`, [L, A, [0, ry]], CLEAR).shape(`M${XY(L)}A${r1(rx)} ${r1(ry)} 0 0 1 ${XY(A)}`, [[0, -ry]], 'fill:none;stroke:#5b6770;stroke-width:1.2;stroke-dasharray:4 3');
    b.seg(L, Lt).seg(A, Bp).seg(O, A, 'cut').dot(O, 2.2);
    b.shape(way(0, 0.5), [L], ROUTE).shape(way(0.5, 1), [L], ROUTE + ';stroke-dasharray:4 3').dot(A, 2.4).dot(Bp, 2.4);
    b.dim([0, ry + 3], [rx, ry + 3], cmL(r), [rx / 2, -60], 7).name(A, 'A', 0, 12).name(Bp, 'B', 0, 12);
    return b;
  }
  // 부채꼴(반지름 l, 중심각 th°). 벌어진 쪽이 아래로 가게 놓는다.
  function sectorFig(l, th) {
    const R = 72, gap = 360 - th, a0 = gap / 2 - 90, a1 = 270 - gap / 2, c = [0, 0], b = Board();
    b.fan(c, R, a0, a1, TINT).angle(c, a0, a1, th + '°', { r: 13 }).beside(c, at(c, R, a0), cmL(l), [0, -R]);
    return b;
  }
  // 직사각형 ABCD 와 대각선 AC, 꼭짓점 B 에서 대각선에 내린 수선의 발 E, 점 E 에서 변 CD 에 내린 수선의 발 F. AE = u, BE = v, AB = c
  function footAgainFig(u, v, c) {
    const W = v * c / u, P = lay({ A: [0, c], B: [0, 0], C: [W, 0], D: [W, c], E: [W * u * u / (c * c), v * v / c], F: [W, v * v / c] }, [190, 150]), b = Board(), g = cen([P.A, P.B, P.C, P.D]);
    b.poly([P.A, P.B, P.C, P.D]).seg(P.A, P.C).seg(P.B, P.E).seg(P.E, P.F).corner(P.E, P.C, P.B, '').corner(P.F, P.D, P.E, '');
    b.beside(P.A, P.B, cmL(c), g).beside(P.A, P.E, cmL(u), P.B, { gap: 3 });
    b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).nameFree(P.E, 'E', [P.A, P.C, P.B, P.F].map((q) => dirOf(P.E, q))).name(P.F, 'F', 0);
    return b;
  }
  // ∠C = 90°인 직각삼각형 ABC(AC = ac 세로, BC = bc 가로)와 ∠A 의 이등분선 AD. flip 이면 직각이 왼쪽 아래
  function bisectFig(ac, bc, flip) {
    const ab = Math.sqrt(ac * ac + bc * bc), dc = ac * (ab - ac) / bc, P = lay(flip ? { A: [0, ac], C: [0, 0], B: [bc, 0], D: [dc, 0] } : { A: [bc, ac], C: [bc, 0], B: [0, 0], D: [bc - dc, 0] }, [190, 132]), b = Board(), g = cen([P.A, P.B, P.C]);
    const aB = dirOf(P.A, P.B), aD = dirOf(P.A, P.D), aC = dirOf(P.A, P.C), far = Math.max(22, 5.5 / Math.sin(Math.abs(aB - aD) / 2 * RAD));
    b.poly([P.B, P.C, P.A]).seg(P.A, P.D).corner(P.C, P.B, P.A, '').sym(P.A, (aB + aD) / 2, 'dot', far).sym(P.A, (aD + aC) / 2, 'dot', far);
    b.beside(P.A, P.B, cmL(Math.round(ab)), g).beside(P.A, P.C, cmL(ac), g);
    b.name(P.A, 'A', dirOf(g, P.A)).name(P.B, 'B', dirOf(g, P.B)).name(P.C, 'C', dirOf(g, P.C)).name(P.D, 'D', 270);
    return b;
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      // ── ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-two-cases', '직각삼각형이 되게 하는 변의 길이를 제곱한 값 모두 찾기', '심27 ①39', (d) => {
        // 함정: 직각의 자리가 정해져 있지 않다. x 가 빗변인 경우와 주어진 긴 변이 빗변인 경우를 모두 따져야 한다.
        const [a, b] = d.until(() => [d.int(3, 12), d.int(5, 15)], ([u, v]) => v - u >= 2 && v <= 2.5 * u), lo = b * b - a * a, hi = a * a + b * b, slip = (b - a) * (b - a), right = `${lo}, ${hi}`;
        // 틀린 보기: hi 만 — x 를 빗변으로만 본 아이 / lo 만 — 주어진 긴 변을 빗변으로만 본 아이 / (b − a)², hi — 두 경우를 따졌지만 제곱의 차를 차의 제곱으로 셈한 아이
        const options = d.shuffle([String(hi), String(lo), right, `${slip}, ${hi}`]);
        return C(`세 변의 길이가 ${a} cm, ${b} cm, ${X} cm인 삼각형이 직각삼각형이 되도록 하는 ${sq(X)}의 값을 모두 고른 것은?`, options, options.indexOf(right), {
          explain: `가장 긴 변의 길이가 ${X} cm이면 ${sq(X)} = ${sq(a)} + ${sq(b)} = ${hi}이다. 가장 긴 변의 길이가 ${b} cm이면 ${sq(X)} + ${sq(a)} = ${sq(b)}에서 ${sq(X)} = ${b * b} − ${a * a} = ${lo}이다. ${sq(X)}의 값은 ${lo}, ${hi}이다.`,
          facts: { truth: options.map((o) => o === right), want: true }
        });
      }),
      H('hard-longest', '가장 긴 변을 찾아 직각삼각형 가려내기', '심26 ①36', (d) => {
        // 함정: 가장 긴 변이 끝에 적혀 있지 않다. 적힌 차례대로 앞의 두 수의 제곱을 더해 셋째 수의 제곱과 견주면 직각삼각형을 하나도 찾지 못한다.
        const unsort = ([a, b, c]) => d.pick([[c, a, b], [a, c, b], [c, b, a], [b, c, a]]);
        const rows = d.until(() => { const k = d.int(2, 3); return d.shuffle(d.shuffle(SMALL).slice(0, k).concat(Array.from({ length: 5 - k }, () => notRight(d)))); }, (list) => new Set(list.map((t) => t.slice().sort((x, y) => x - y).join())).size === 5).map((t) => unsort(t.slice().sort((x, y) => x - y)));
        const sorted = rows.map((t) => t.slice().sort((x, y) => x - y)), flags = sorted.map(([a, b, c]) => a * a + b * b === c * c), hits = KEYS.filter((_, i) => flags[i]);
        return N('세 변의 길이가 각각 다음과 같은 삼각형 중에서 직각삼각형인 것은 모두 몇 개인가?', hits.length, {
          unit: '개', figure: tagged(rows.map(three), KEYS.map((key) => key + '.')),
          explain: `가장 긴 변의 길이의 제곱을 나머지 두 변의 길이의 제곱의 합과 견준다. ${sorted.map(([a, b, c], i) => `${KEYS[i]}. ${sq(a)} + ${sq(b)} = ${a * a + b * b}, ${sq(c)} = ${c * c}`).join(' / ')}. 두 값이 같은 것은 ${hits.join(', ')}의 ${hits.length}개이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-square-median', '두 정사각형의 넓이로 빗변의 중점까지의 거리 구하기', '심13', (d) => {
        // 함정: 넓이의 합이 빗변의 길이의 제곱이다. 한 변의 길이끼리 더하거나(8 + 6), 넓이의 합을 그대로 빗변의 길이로 삼으면 틀린다.
        const [u, v, c] = d.pick([[6, 8, 10], [8, 6, 10], [12, 16, 20], [16, 12, 20], [18, 24, 30], [24, 18, 30], [10, 24, 26], [24, 10, 26], [16, 30, 34], [30, 16, 34]]), p = u * u, q = v * v;
        return cmQ(`그림은 ∠C = 90°인 직각삼각형 ABC에서 두 변 AC, BC를 각각 한 변으로 하는 정사각형을 그린 것이다. 두 정사각형의 넓이가 차례로 ${p} cm², ${q} cm²이고 점 M이 변 AB의 중점일 때, ${seg('CM')}의 길이는?`, c / 2, {
          figure: medianFig(p, q).svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 변 AB가 빗변이다. 두 변 AC, BC 위에 정사각형이 삼각형의 바깥쪽으로 그려져 있고 색칠되어 있다. 변 AB의 중점 M과 꼭짓점 C를 이은 선분이 그어져 있고, 선분 AM과 선분 MB에 길이가 같다는 표시가 있다. 변 AC 위의 정사각형의 넓이 ${p} cm², 변 BC 위의 정사각형의 넓이 ${q} cm²`),
          explain: `${sq(seg('AC'))} = ${p}, ${sq(seg('BC'))} = ${q}이므로 ${sq(seg('AB'))} = ${p} + ${q} = ${c * c}이고 ${seg('AB')} = ${c} cm이다. 직각삼각형의 빗변의 중점은 외심이므로 ${seg('CM')} = ${seg('AM')} = ${seg('BM')} = ${HALF} × ${c} = ${c / 2}(cm)이다.`,
          facts: { calc: [[`(${p}+${q})**0.5/2`, 0]], unseen: [0.5, 2] }
        });
      }),
      H('hard-euclid', '유클리드의 그림에서 넓이가 같은 삼각형', '심14·16 ①27·29', (d, n) => {
        if (n === 0) {
          // 함정: 넓이가 같은 것은 합동인 삼각형뿐이라고 여기는 아이. 밑변이 같고 평행선 사이에 놓인 삼각형, 합동인 삼각형을 차례로 옮겨 가야 한다.
          const [c, bb] = d.pick([[3, 4], [4, 3], [5, 7], [7, 5], [2, 3], [3, 2]]), left = d.bool(), f = euclidFig(c, bb, { size: [200, 204] }), P = f.P, k = P.k, a = Math.sqrt(c * c + bb * bb);
          const L = [P.A[0], 0], M = [P.A[0], a * k];
          f.b.seg(P.A, M, 'thin').corner(L, left ? P.C : P.B, P.A, '');
          if (left) f.b.seg(P.E, P.C, 'thin').seg(P.A, P.H, 'thin'); else f.b.seg(P.G, P.B, 'thin').seg(P.A, P.I, 'thin');
          f.b.name(L, 'L', left ? 318 : 222, 12).name(M, 'M', 270);
          const base = left ? '△EBA' : '△GCA', same = left ? ['△EBC', '△ABH', '△LBH'] : ['△GCB', '△ACI', '△LCI'], odd = '△ABC', options = d.shuffle(same.concat([odd]));
          return C(`그림은 ∠A = 90°인 직각삼각형 ABC의 세 변을 각각 한 변으로 하는 정사각형 ADEB, ACGF, BHIC를 그린 것이다. 꼭짓점 A에서 변 BC에 내린 수선의 발을 L, 그 수선의 연장선이 변 HI와 만나는 점을 M이라 할 때, 다음 중 ${base}와 넓이가 같지 않은 것은? ${nb(`(단, ${seg('AB')} ≠ ${seg('AC')})`)}`, options, options.indexOf(odd), {
            figure: f.b.svg(`직각삼각형 ABC의 세 변 위에 정사각형 ADEB, ACGF, BHIC가 삼각형의 바깥쪽으로 그려져 있다. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 꼭짓점 A에서 그은 수선이 변 BC와 점 L에서, 변 HI와 점 M에서 만난다. ${left ? '선분 EC와 선분 AH' : '선분 GB와 선분 AI'}가 그어져 있다`),
            explain: left
              ? `${seg('EB')} ∥ ${seg('DC')}이므로 밑변 EB가 같고 높이가 같아 △EBA = △EBC이다. △EBC와 △ABH에서 ${seg('EB')} = ${seg('AB')}, ${seg('BC')} = ${seg('BH')}, ∠EBC = ∠ABH이므로 △EBC ≡ △ABH이다. ${seg('BH')} ∥ ${seg('AM')}이므로 △ABH = △LBH이다. △EBA의 넓이는 ${HALF} × ${sq(seg('AB'))}이고 △ABC의 넓이는 ${HALF} × ${seg('AB')} × ${seg('AC')}이므로 ${seg('AB')} ≠ ${seg('AC')}이면 두 넓이는 다르다.`
              : `${seg('GC')} ∥ ${seg('FB')}이므로 밑변 GC가 같고 높이가 같아 △GCA = △GCB이다. △GCB와 △ACI에서 ${seg('GC')} = ${seg('AC')}, ${seg('CB')} = ${seg('CI')}, ∠GCB = ∠ACI이므로 △GCB ≡ △ACI이다. ${seg('CI')} ∥ ${seg('AM')}이므로 △ACI = △LCI이다. △GCA의 넓이는 ${HALF} × ${sq(seg('AC'))}이고 △ABC의 넓이는 ${HALF} × ${seg('AB')} × ${seg('AC')}이므로 ${seg('AB')} ≠ ${seg('AC')}이면 두 넓이는 다르다.`,
            facts: { truth: options.map((o) => o === odd), want: true }
          });
        }
        const [c, bb] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([u, v]) => (u - v) % 2 === 0 && u !== v && Math.max(u, v) / Math.min(u, v) <= 2), a2 = c * c + bb * bb;
        return areaQ(`그림은 ∠A = 90°인 직각삼각형 ABC에서 변 BC를 한 변으로 하는 정사각형 BDEC를 그린 것이다. ${seg('AB')} = ${c} cm, ${seg('AC')} = ${bb} cm일 때, 색칠한 두 삼각형 ABD, ACE의 넓이의 합은?`, a2 / 2, {
          figure: underFig(c, bb).svg(`직각삼각형 ABC와, 변 BC의 아래쪽에 그린 정사각형 BDEC. ∠A에 직각 표시가 있다. 삼각형 ABD와 삼각형 ACE가 색칠되어 있다. AB = ${c} cm, AC = ${bb} cm`),
          explain: `꼭짓점 A에서 변 BC에 내린 수선의 발을 L이라 하면 △ABD는 밑변이 BD이고 높이가 ${seg('BL')}, △ACE는 밑변이 CE이고 높이가 ${seg('LC')}이다. ${seg('BD')} = ${seg('CE')} = ${seg('BC')}이므로 두 넓이의 합은 ${HALF} × ${seg('BC')} × (${seg('BL')} + ${seg('LC')}) = ${HALF} × ${sq(seg('BC'))}이다. ${sq(seg('BC'))} = ${sq(c)} + ${sq(bb)} = ${a2}이므로 넓이의 합은 ${a2 / 2} cm²이다.`,
          facts: { calc: [[`(${c}**2+${bb}**2)/2`, 0]], unseen: [2] }
        });
      }, { count: 2 }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-chain', '직각삼각형을 이어 붙인 사슬', '심4 ①15·16', (d) => {
        const len = d.int(1, 4), ans = 5 * len * len;
        return N(`그림에서 ∠OAB = ∠OBC = ∠OCD = ∠ODE = 90°이고 ${seg('OA')} = ${seg('AB')} = ${seg('BC')} = ${seg('CD')} = ${seg('DE')} = ${len} cm일 때, ${sq(seg('OE'))}의 값은?`, ans, {
          figure: chainFig(4, cmL(len)).svg(`점 O를 함께 가지는 직각삼각형 OAB, OBC, OCD, ODE가 차례로 이어 붙어 있다. ∠OAB, ∠OBC, ∠OCD, ∠ODE에 직각 표시가 있고, 선분 OA, AB, BC, CD, DE에 길이가 같다는 표시가 있다. OA = ${len} cm`),
          explain: `${sq(seg('OB'))} = ${sq(len)} + ${sq(len)} = ${2 * len * len}, ${sq(seg('OC'))} = ${sq(seg('OB'))} + ${sq(len)} = ${3 * len * len}, ${sq(seg('OD'))} = ${sq(seg('OC'))} + ${sq(len)} = ${4 * len * len}, ${sq(seg('OE'))} = ${sq(seg('OD'))} + ${sq(len)} = ${ans}이다.`,
          facts: { calc: [[`5*${len}**2`, 0]], unseen: [5, 2] }
        });
      }),
      H('hard-trapezoid-diagonal', '사다리꼴에 수선을 그어 대각선의 길이 구하기', '①18 심6', (d) => {
        // AD = a, AB = c1, BC = bc, BD = x. 높이가 같은 두 직각삼각형을 잇는다.
        const w = d.until(() => {
          const [a, c1, bc, x] = d.pick([[9, 10, 15, 17], [11, 13, 16, 20], [7, 15, 16, 20], [4, 13, 9, 15], [12, 17, 20, 25], [11, 25, 18, 30], [8, 26, 18, 30], [22, 26, 32, 40], [14, 30, 32, 40], [6, 25, 21, 29], [18, 20, 30, 34]]), h = Math.round(Math.sqrt(x * x - bc * bc));
          const f = polyFig({ A: [bc - a, h], B: [0, 0], C: [bc, 0], D: [bc, h] }, { size: [176, 124], right: ['C', 'D'], nameAt: { A: 140, D: 40 }, sides: { DA: cmL(a), AB: cmL(c1), BC: cmL(bc) }, at: { AB: 0.62 } });
          f.b.seg(f.P.B, f.P.D).beside(f.P.B, f.P.D, xL('x'), f.P.A, { t: 0.56, gap: 3 });
          return { a, c1, bc, x, h, f };
        }, (v) => !v.f.b.clash()), { a, c1, bc, x, h } = w;
        return N(`그림과 같이 ∠C = ∠D = 90°인 사다리꼴 ABCD에서 ${X}의 값은?`, x, {
          figure: w.f.b.svg(`사다리꼴 ABCD와 대각선 BD. ∠C와 ∠D에 직각 표시가 있다. AD = ${a} cm, AB = ${c1} cm, BC = ${bc} cm, BD = x cm`),
          explain: `꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하면 ${seg('BH')} = ${bc} − ${a} = ${bc - a}(cm)이다. △ABH에서 ${sq(seg('AH'))} = ${sq(c1)} − ${sq(bc - a)} = ${h * h}이므로 ${seg('AH')} = ${h} cm이고 ${seg('DC')} = ${seg('AH')} = ${h} cm이다. △BCD에서 ${sq(X)} = ${sq(bc)} + ${sq(h)} = ${x * x}이고 ${sq(x)} = ${x * x}이므로 ${X} = ${x}이다.`,
          facts: { calc: [[`(${bc}**2+${c1}**2-(${bc}-${a})**2)**0.5`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-two-tri-back', '가운데 삼각형의 넓이로 사다리꼴의 넓이 구하기', '심20', (d) => {
        const [u, v, c] = d.pick([[6, 8, 10], [8, 6, 10], [12, 16, 20], [16, 12, 20], [10, 24, 26], [24, 10, 26], [18, 24, 30], [24, 18, 30], [16, 30, 34]]), area = c * c / 2, f = twoTriFig(u, v, { ab: cmL(u) });
        return areaQ(`그림에서 △ABC ≡ △CDE이고 세 점 B, C, D는 한 직선 위에 있다. ${seg('AB')} = ${u} cm이고 △ACE의 넓이가 ${area} cm²일 때, 사다리꼴 ABDE의 넓이는?`, (u + v) * (u + v) / 2, {
          figure: f.b.svg(`${TWO_SAID}. AB = ${u} cm`),
          explain: `△ABC ≡ △CDE이므로 ${seg('AC')} = ${seg('CE')}이고 ∠ACB + ∠DCE = ∠ACB + ∠BAC = 90°에서 ∠ACE = 90°이다. △ACE의 넓이는 ${HALF} × ${sq(seg('AC'))} = ${area}이므로 ${sq(seg('AC'))} = ${c * c}, ${seg('AC')} = ${c} cm이다. △ABC에서 ${sq(seg('BC'))} = ${sq(c)} − ${sq(u)} = ${v * v}이므로 ${seg('BC')} = ${v} cm이고 ${seg('DE')} = ${v} cm, ${seg('CD')} = ${u} cm이다. 사다리꼴 ABDE의 넓이는 ${HALF} × (${u} + ${v}) × (${v} + ${u}) = ${(u + v) * (u + v) / 2}(cm²)이다.`,
          facts: { calc: [[`(${u}+(2*${area}-${u}**2)**0.5)**2/2`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-two-feet', '대각선에 내린 두 수선의 발 사이의 거리', '심32 ①45·46', (d) => {
        const [h, wd, dg] = d.pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20], [8, 15, 17]]), f = rectFig(wd, h, { footA: 'M', footC: 'N' });
        return fracQ(`그림과 같이 ${seg('AB')} = ${h} cm, ${seg('AD')} = ${wd} cm인 직사각형 ABCD의 두 꼭짓점 A, C에서 대각선 BD에 내린 수선의 발을 각각 M, N이라 할 때, ${seg('MN')}의 길이는?`, wd * wd - h * h, dg, 'cm', {
          figure: f.b.svg(`직사각형 ABCD와 대각선 BD. 꼭짓점 A에서 대각선 BD에 내린 수선의 발이 M, 꼭짓점 C에서 대각선 BD에 내린 수선의 발이 N이고 직각 표시가 있다. AB = ${h} cm, AD = ${wd} cm`),
          explain: `△ABD에서 ${sq(seg('BD'))} = ${sq(h)} + ${sq(wd)} = ${dg * dg}이므로 ${seg('BD')} = ${dg} cm이다. △ABD ∽ △MBA이므로 ${sq(seg('AB'))} = ${seg('BM')} × ${seg('BD')}에서 ${seg('BM')} = ${fr(h * h, dg)}(cm)이다. △ABM ≡ △CDN이므로 ${seg('DN')} = ${seg('BM')}이다. ${seg('MN')} = ${dg} − 2 × ${fr(h * h, dg)} = ${fr(wd * wd - h * h, dg)}(cm)이다.`,
          facts: { value: `(${wd}**2-${h}**2)/(${h}**2+${wd}**2)**0.5`, unseen: [2, 0.5] }
        });
      }),
      H('hard-centroid', '직각삼각형의 무게중심과 빗변의 중점', '심11 ①49', (d) => {
        const [ab, ac, bc] = d.pick([[9, 12, 15], [12, 9, 15], [18, 24, 30], [24, 18, 30], [15, 36, 39], [36, 15, 39], [24, 45, 51], [45, 24, 51]]), useGD = bc % 6 === 0 && d.bool(), given = useGD ? bc / 6 : bc / 3;
        const P = lay({ A: [ab * ab / bc, ab * ac / bc], B: [0, 0], C: [bc, 0], D: [bc / 2, 0] }, [196, 116]), b = Board(), g = cen([P.A, P.B, P.C]), G = mid(P.A, P.D, 2 / 3);
        b.poly([P.B, P.C, P.A]).seg(P.A, P.D).corner(P.A, P.B, P.C, '').dot(G).beside(P.A, P.C, cmL(ac), g);
        b.name(P.A, 'A', 90).name(P.B, 'B', 200).name(P.C, 'C', 340).name(P.D, 'D', 270).name(G, 'G', dirOf(P.A, P.D) + 90, 12);
        const lead = useGD ? `${seg('AD')} = 3 × ${seg('GD')}` : `${seg('AD')} = ${frac(3, 2)} × ${seg('AG')}`, twice = useGD ? `6 × ${seg('GD')}` : `3 × ${seg('AG')}`;
        return cmQ(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 점 G는 △ABC의 무게중심이고, 직선 AG가 변 BC와 만나는 점을 D라 하자. ${seg('AC')} = ${ac} cm, ${useGD ? seg('GD') : seg('AG')} = ${given} cm일 때, ${seg('AB')}의 길이는?`, ab, {
          figure: b.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 꼭짓점 A와 변 BC 위의 점 D를 이은 선분 위에 점 G가 있다. AC = ${ac} cm`),
          explain: `무게중심은 중선을 꼭짓점으로부터 2 : 1로 나누므로 ${lead}이다. 점 D는 빗변 BC의 중점이고 직각삼각형의 빗변의 중점은 외심이므로 ${seg('BD')} = ${seg('CD')} = ${seg('AD')}이다. ${seg('BC')} = 2 × ${seg('AD')} = ${twice} = ${bc}(cm)이다. ${sq(seg('AB'))} = ${sq(bc)} − ${sq(ac)} = ${ab * ab}이므로 ${seg('AB')} = ${ab} cm이다.`,
          facts: { calc: [[`((${useGD ? 6 : 3}*${given})**2-${ac}**2)**0.5`, 0]], unseen: [useGD ? 6 : 3, 2, 0.5] }
        });
      }),
      H('hard-parallelogram', '평행사변형의 두 수선과 넓이', '심9', (d) => {
        // AB = ab, BE = be, AE = ae, AD = ad, DF = df, AF = af (△ABE ∽ △ADF)
        const [ab, be, ae, ad, df, af] = d.pick([[13, 5, 12, 26, 10, 24], [15, 9, 12, 20, 12, 16], [20, 12, 16, 25, 15, 20], [25, 15, 20, 30, 18, 24], [25, 15, 20, 35, 21, 28], [30, 18, 24, 35, 21, 28], [26, 10, 24, 39, 15, 36], [25, 7, 24, 50, 14, 48]]), ec = ad - be, fc = ab - df, area = (ec * ae + fc * af) / 2;
        const P = lay({ A: [be, ae], B: [0, 0], C: [ad, 0], D: [be + ad, ae], E: [be, 0], F: [be + ad - df * be / ab, ae - df * ae / ab] }, [204, 124]), b = Board(), g = cen([P.A, P.B, P.C, P.D]);
        b.poly([P.A, P.B, P.C, P.D]).poly([P.A, P.E, P.C, P.F], TINT).corner(P.E, P.C, P.A, '').corner(P.F, P.D, P.A, '');
        b.beside(P.A, P.B, cmL(ab), g).beside(P.A, P.D, cmL(ad), g).beside(P.D, P.F, cmL(df), g);
        b.name(P.A, 'A', 115).name(P.B, 'B', 225).name(P.C, 'C', 300).name(P.D, 'D', 45).name(P.E, 'E', 270).name(P.F, 'F', dirOf(P.A, P.F), 12);
        return areaQ(`그림과 같이 평행사변형 ABCD의 꼭짓점 A에서 두 변 BC, CD에 내린 수선의 발을 각각 E, F라 하자. ${seg('AB')} = ${ab} cm, ${seg('AD')} = ${ad} cm, ${seg('DF')} = ${df} cm일 때, □AECF의 넓이는?`, area, {
          figure: b.svg(`평행사변형 ABCD. 꼭짓점 A에서 변 BC에 내린 수선의 발이 E, 변 CD에 내린 수선의 발이 F이고 직각 표시가 있다. 사각형 AECF가 색칠되어 있다. AB = ${ab} cm, AD = ${ad} cm, DF = ${df} cm`),
          explain: `△ABE와 △ADF에서 ∠B = ∠D, ∠AEB = ∠AFD = 90°이므로 △ABE ∽ △ADF이다. ${nb(`${seg('BE')} : ${seg('DF')} = ${seg('AB')} : ${seg('AD')}`)}에서 ${seg('BE')} = ${be} cm이다. △ABE에서 ${sq(seg('AE'))} = ${sq(ab)} − ${sq(be)} = ${ae * ae}, ${seg('AE')} = ${ae} cm이고, △ADF에서 ${sq(seg('AF'))} = ${sq(ad)} − ${sq(df)} = ${af * af}, ${seg('AF')} = ${af} cm이다. ${seg('EC')} = ${ad} − ${be} = ${ec}(cm), ${seg('FC')} = ${ab} − ${df} = ${fc}(cm)이므로 □AECF의 넓이는 △AEC + △AFC = ${HALF} × ${ec} × ${ae} + ${HALF} × ${fc} × ${af} = ${area}(cm²)이다.`,
          facts: { calc: [[`((${ad}-${ab}*${df}/${ad})*(${ab}**2-(${ab}*${df}/${ad})**2)**0.5+(${ab}-${df})*(${ad}**2-${df}**2)**0.5)/2`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-lune-height', '초승달 모양의 넓이로 빗변에 내린 수선의 길이 구하기', '심24', (d) => {
        const [c, bb, a] = d.pick([[6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 9, 15], [12, 16, 20], [16, 12, 20], [8, 15, 17], [5, 12, 13]]), area = c * bb / 2, f = semiFig(c, bb, 'lune', { foot: 'H' });
        return fracQ(`그림은 ∠A = 90°인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그린 것이다. ${seg('AB')} = ${c} cm이고 색칠한 부분의 넓이가 ${area} cm²일 때, 꼭짓점 A에서 변 BC에 내린 수선 AH의 길이는?`, c * bb, a, 'cm', {
          figure: f.b.svg(`${LUNE_SAID}. 꼭짓점 A에서 변 BC에 내린 수선의 발이 H이고 직각 표시가 있다. AB = ${c} cm`),
          explain: `색칠한 부분의 넓이는 △ABC의 넓이와 같으므로 ${HALF} × ${c} × ${seg('AC')} = ${area}에서 ${seg('AC')} = ${bb} cm이다. ${sq(seg('BC'))} = ${sq(c)} + ${sq(bb)} = ${a * a}이므로 ${seg('BC')} = ${a} cm이다. △ABC의 넓이를 빗변을 밑변으로 하여 나타내면 ${HALF} × ${a} × ${seg('AH')} = ${area}이므로 ${seg('AH')} = ${fr(2 * area, a)}(cm)이다.`,
          facts: { value: `2*${area}/(${c}**2+(2*${area}/${c})**2)**0.5`, unseen: [2, 0.5] }
        });
      }),
      H('hard-fold', '직사각형 모양의 종이 접기', '①64', (d) => {
        // AB = h, BC = w, AC′ = p, DE = (w − p) × p ÷ h
        const [h, w, p] = d.pick([[8, 10, 6], [16, 20, 12], [24, 30, 18], [36, 39, 15]]), dc = w - p, de = dc * p / h;
        const P = lay({ A: [0, h], B: [0, 0], C: [w, 0], D: [w, h], E: [w, h - de], K: [p, h] }, [190, 150]), b = Board(), g = cen([P.A, P.B, P.C, P.D]);
        b.poly([P.A, P.B, P.E, P.D], 'fill:rgba(251,191,36,0.2)').poly([P.B, P.E, P.K], 'fill:rgba(251,191,36,0.6)').seg(P.B, P.C, 'cut').seg(P.C, P.E, 'cut');
        b.beside(P.A, P.B, cmL(h), g).beside(P.B, P.C, cmL(w), g);
        b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).name(P.E, 'E', 0).name(P.K, 'C′', 90);
        return cmQ(`그림과 같이 ${seg('AB')} = ${h} cm, ${seg('BC')} = ${w} cm인 직사각형 모양의 종이 ABCD를 ${seg('BE')}를 접는 선으로 하여 꼭짓점 C가 변 AD 위의 점 C′에 오도록 접었다. ${seg('DE')}의 길이는?`, de, {
          figure: b.svg(`직사각형 모양의 종이 ABCD를 선분 BE를 접는 선으로 하여 접은 그림. 점 E는 변 DC 위에 있고, 꼭짓점 C가 옮겨진 점 C′은 변 AD 위에 있다. 접힌 부분인 삼각형 BEC′이 짙게 색칠되어 있고, 접기 전의 변 BC와 선분 CE는 점선으로 그려져 있다. AB = ${h} cm, BC = ${w} cm`),
          explain: `접은 변이므로 ${seg('BC′')} = ${seg('BC')} = ${w} cm이다. △ABC′에서 ${sq(seg('AC′'))} = ${sq(w)} − ${sq(h)} = ${p * p}이므로 ${seg('AC′')} = ${p} cm, ${seg('DC′')} = ${w} − ${p} = ${dc}(cm)이다. ∠BC′E = ∠C = 90°이므로 ∠AC′B + ∠DC′E = 90°이다. △ABC′과 △DC′E에서 ∠A = ∠D = 90°, ∠ABC′ = 90° − ∠AC′B = ∠DC′E이므로 △ABC′ ∽ △DC′E이다. ${nb(`${seg('AB')} : ${seg('DC′')} = ${seg('AC′')} : ${seg('DE')}`)}에서 ${h} × ${seg('DE')} = ${dc} × ${p}이므로 ${seg('DE')} = ${de} cm이다.`,
          facts: { calc: [[`(${w}-(${w}**2-${h}**2)**0.5)*(${w}**2-${h}**2)**0.5/${h}`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-box-path', '직육면체의 겉면을 따라가는 가장 짧은 길', '①63 심47', (d) => {
        const v = d.until(() => { const set = d.pick([[6, 3, 8, 17], [4, 7, 8, 17], [5, 2, 5, 13], [3, 6, 5, 13], [4, 4, 9, 15], [5, 2, 9, 15], [9, 6, 10, 26], [7, 6, 15, 25], [6, 4, 12, 20], [8, 5, 20, 29]]); return { set, b: boxFig(set[0], set[1], set[2]) }; }, (x) => !x.b.clash() && x.b.clear >= 8.5), [w, dd, h, ans] = v.set, wide = 2 * w + dd;
        return cmQ(`그림과 같은 직육면체에서 ${seg('FG')} = ${w} cm, ${seg('GH')} = ${dd} cm, ${seg('DH')} = ${h} cm이다. 꼭짓점 A에서 겉면을 따라 두 모서리 DH, CG를 차례로 지나 꼭짓점 F에 이르는 가장 짧은 길의 길이는?`, ans, {
          figure: v.b.svg(`직육면체의 겨냥도. 윗면은 ABCD, 아랫면은 EFGH이고 꼭짓점 A, B, C, D의 아래에 차례로 E, F, G, H가 있다. FG = ${w} cm, GH = ${dd} cm, DH = ${h} cm이다. 꼭짓점 A에서 면 AEHD, 면 DHGC, 면 CGFB를 차례로 지나 꼭짓점 F에 이르는 선이 그려져 있다`),
          explain: `세 옆면 AEHD, DHGC, CGFB를 차례로 펼치면 가로의 길이가 ${w} + ${dd} + ${w} = ${wide}(cm), 세로의 길이가 ${h} cm인 직사각형이 되고, 가장 짧은 길은 이 직사각형의 대각선이다. ${sq(wide)} + ${sq(h)} = ${ans * ans}이고 ${sq(ans)} = ${ans * ans}이므로 가장 짧은 길의 길이는 ${ans} cm이다.`,
          facts: { calc: [[`((${w}+${dd}+${w})**2+${h}**2)**0.5`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-diagonals', '두 대각선이 수직으로 만나는 사각형', '①66', (d) => {
        const w = d.until(() => {
          const a = d.int(4, 9), bq = d.int(4, 9), c = d.int(4, 9), t = d.pick([0.5, 0.6, 0.7]) * Math.min(a, bq), od2 = c * c - bq * bq + t * t;
          if (od2 <= 0 || new Set([a, bq, c]).size < 3) return null;
          const oa = Math.sqrt(a * a - t * t), oc = Math.sqrt(bq * bq - t * t), od = Math.sqrt(od2), lens = [oa, t, oc, od];
          if (Math.min(...lens) / Math.max(...lens) < 0.34) return null;
          const P = lay({ A: [-oa, 0], B: [0, -t], C: [oc, 0], D: [0, od] }, [180, 150]), b = Board(), O = [0, 0];
          b.poly([P.A, P.B, P.C, P.D]).seg(P.A, P.C, 'thin').seg(P.B, P.D, 'thin').corner(O, P.C, P.D, '');
          b.beside(P.A, P.B, cmL(a), O).beside(P.B, P.C, cmL(bq), O).beside(P.C, P.D, cmL(c), O);
          b.name(P.A, 'A', 180).name(P.B, 'B', 270).name(P.C, 'C', 0).name(P.D, 'D', 90).angle(O, 180, 270, 'O', { arc: false, ink: true });
          return { a, bq, c, b };
        }, (v) => v && !v.b.clash()), { a, bq, c } = w, ans = a * a + c * c - bq * bq;
        return N(`그림과 같이 □ABCD의 두 대각선이 점 O에서 서로 수직으로 만난다. ${seg('AB')} = ${a} cm, ${seg('BC')} = ${bq} cm, ${seg('CD')} = ${c} cm일 때, ${sq(seg('AD'))}의 값은?`, ans, {
          figure: w.b.svg(`사각형 ABCD와 두 대각선 AC, BD. 두 대각선은 점 O에서 만나고 직각 표시가 있다. AB = ${a} cm, BC = ${bq} cm, CD = ${c} cm`),
          explain: `네 직각삼각형 OAB, OBC, OCD, ODA에서 ${sq(seg('AB'))} = ${sq(seg('OA'))} + ${sq(seg('OB'))}, ${sq(seg('CD'))} = ${sq(seg('OC'))} + ${sq(seg('OD'))}, ${sq(seg('BC'))} = ${sq(seg('OB'))} + ${sq(seg('OC'))}, ${sq(seg('AD'))} = ${sq(seg('OA'))} + ${sq(seg('OD'))}이다. ${nb(`${sq(seg('AB'))} + ${sq(seg('CD'))}`)}의 값과 ${nb(`${sq(seg('BC'))} + ${sq(seg('AD'))}`)}의 값은 모두 네 선분 OA, OB, OC, OD의 길이의 제곱의 합이므로 서로 같다. ${sq(seg('AD'))} = ${sq(a)} + ${sq(c)} − ${sq(bq)} = ${ans}이다.`,
          facts: { calc: [[`${a}**2+${c}**2-${bq}**2`, 0]], unseen: [2] }
        });
      }),
      H('hard-inner-point', '직사각형의 내부의 한 점에서 네 꼭짓점까지의 거리', '심41', (d) => {
        const w = d.until(() => {
          const ap = d.int(3, 9), bp = d.int(3, 9), cp = d.int(3, 9), u = d.pick([0.5, 0.6, 0.7]) * Math.min(ap, bp), s = Math.sqrt(ap * ap - u * u), t = Math.sqrt(bp * bp - u * u), v2 = cp * cp - t * t;
          if (v2 <= 0 || new Set([ap, bp, cp]).size < 3) return null;
          const v = Math.sqrt(v2), lens = [u, s, t, v], W = u + v, Hh = s + t;
          if (Math.min(...lens) / Math.max(...lens) < 0.4 || W / Hh > 1.7 || Hh / W > 1.15) return null;
          const P = lay({ A: [0, Hh], B: [0, 0], C: [W, 0], D: [W, Hh], P: [u, t] }, [190, 150]), b = Board();
          b.poly([P.A, P.B, P.C, P.D]).seg(P.P, P.A).seg(P.P, P.B).seg(P.P, P.C).seg(P.P, P.D).dot(P.P);
          b.beside(P.P, P.A, cmL(ap), P.B, { gap: 3 }).beside(P.P, P.B, cmL(bp), P.A, { gap: 3 }).beside(P.P, P.C, cmL(cp), P.B, { gap: 3 });
          b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).angle(P.P, dirOf(P.P, P.D), dirOf(P.P, P.A), 'P', { arc: false, ink: true });
          return { ap, bp, cp, b };
        }, (v) => v && !v.b.clash()), { ap, bp, cp } = w, ans = ap * ap + cp * cp - bp * bp;
        return N(`그림과 같이 직사각형 ABCD의 내부에 점 P가 있다. ${seg('AP')} = ${ap} cm, ${seg('BP')} = ${bp} cm, ${seg('CP')} = ${cp} cm일 때, ${sq(seg('DP'))}의 값은?`, ans, {
          figure: w.b.svg(`직사각형 ABCD와 그 내부의 점 P. 점 P와 네 꼭짓점을 이은 선분이 그어져 있다. AP = ${ap} cm, BP = ${bp} cm, CP = ${cp} cm`),
          explain: `점 P를 지나고 변 AB에 평행한 직선과 변 AD에 평행한 직선을 그으면 직각삼각형이 네 개 생긴다. 점 P에서 네 변 AB, BC, CD, DA까지의 거리를 차례로 ${nb('㉠, ㉡, ㉢, ㉣')}이라 하면 ${sq(seg('AP'))} = ${sq('㉠')} + ${sq('㉣')}, ${sq(seg('CP'))} = ${sq('㉡')} + ${sq('㉢')}, ${sq(seg('BP'))} = ${sq('㉠')} + ${sq('㉡')}, ${sq(seg('DP'))} = ${sq('㉢')} + ${sq('㉣')}이므로 ${sq(seg('AP'))} + ${sq(seg('CP'))} = ${sq(seg('BP'))} + ${sq(seg('DP'))}이다. ${sq(seg('DP'))} = ${sq(ap)} + ${sq(cp)} − ${sq(bp)} = ${ans}이다.`,
          facts: { calc: [[`${ap}**2+${cp}**2-${bp}**2`, 0]], unseen: [2] }
        });
      }),

      // ── 처음 지을 때 꼬임·요령·「한 유형만」이라는 까닭으로 뺐다가 다시 실은 꼴(2026-10-13). 모두 세 단계 넘게 잇는 문제이고, 원기둥의 길만 뜻을 대야 풀리는 문제이다 ──
      H('hard-fold-diagonal', '직사각형 모양의 종이를 대각선으로 접기', '심39 ①65', (d) => {
        // 접은 각과 엇각이 같아 △EBD 가 이등변삼각형이 되고, 수선의 발 F 가 대각선의 중점이 된다. 이어서 닮음을 쓴다.
        // (선분 DE 를 묻는 꼴(①65)은 같은 닮음에서 다른 변을 구하는 같은 일이라 따로 싣지 않는다.)
        const [h, w, dg] = d.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15], [12, 16, 20], [15, 20, 25]]);
        return fracQ(`그림과 같이 ${seg('AB')} = ${h} cm, ${seg('BC')} = ${w} cm인 직사각형 모양의 종이 ABCD를 대각선 BD를 접는 선으로 하여 접었더니 꼭짓점 C가 ${nb('점 C′으로')} 옮겨졌다. ${seg('AD')}와 ${seg('BC′')}이 만나는 점을 E, 점 E에서 ${seg('BD')}에 내린 수선의 발을 F라 할 때, ${seg('EF')}의 길이는?`, dg * h, 2 * w, 'cm', {
          figure: foldDiagFig(h, w).svg(`직사각형 모양의 종이 ABCD를 대각선 BD를 접는 선으로 하여 접은 그림. 꼭짓점 C가 옮겨진 점 C′은 변 AD의 위쪽에 있고, 선분 BC′과 변 AD가 점 E에서 만난다. 점 E에서 대각선 BD에 내린 수선의 발이 F이고 직각 표시가 있다. 접힌 부분인 삼각형 BC′D가 짙게 색칠되어 있고, 접기 전의 변 BC와 변 CD는 점선으로 그려져 있다. AB = ${h} cm, BC = ${w} cm`),
          explain: `△BCD에서 ${sq(seg('BD'))} = ${sq(w)} + ${sq(h)} = ${dg * dg}이므로 ${seg('BD')} = ${dg} cm이다. 접은 각이므로 ∠EBD = ∠DBC이고, ${seg('AD')} ∥ ${seg('BC')}이므로 ∠EDB = ∠DBC(엇각)이다. ∠EBD = ∠EDB이므로 △EBD는 ${seg('EB')} = ${seg('ED')}인 이등변삼각형이고, 꼭짓점 E에서 밑변 BD에 내린 수선의 발 F는 ${seg('BD')}의 중점이다. ${seg('BF')} = ${fr(dg, 2)}(cm)이다. △EBF와 △DBC에서 ∠EBF = ∠DBC, ∠EFB = ∠DCB = 90°이므로 △EBF ∽ △DBC이다. ${nb(`${seg('BF')} : ${seg('BC')} = ${seg('EF')} : ${seg('DC')}`)}에서 ${w} × ${seg('EF')} = ${fr(dg, 2)} × ${h}이므로 ${seg('EF')} = ${fr(dg * h, 2 * w)}(cm)이다.`,
          facts: { value: `(${w}**2+${h}**2)**0.5*${h}/(2*${w})`, unseen: [2, 0.5] }
        });
      }),
      H('hard-equilateral-turn', '정삼각형의 내부의 점과 합동으로 옮긴 변', '심30', (d) => {
        // 합동으로 PA 를 CQ 로 옮기고, 정삼각형 BQP 로 PB 를 PQ 로 옮긴 뒤, 세 변의 길이의 관계에서 직각을 찾는다.
        const b = turnFig(d.pick([82, 86, 90]));
        return N(`그림과 같이 정삼각형 ABC의 내부의 점 P와 외부의 점 Q에 대하여 ${nb(`${sq(seg('PA'))} = ${sq(seg('PB'))} + ${sq(seg('PC'))}`)}, ∠ABP = ∠CBQ, ${seg('BP')} = ${seg('BQ')}일 때, ∠BPC의 크기는?`, 150, {
          unit: '°', figure: b.svg('정삼각형 ABC. 삼각형의 내부에 점 P가, 변 BC를 사이에 두고 꼭짓점 A의 반대쪽에 점 Q가 있다. 선분 PA, PB, PC, BQ, CQ, PQ가 그어져 있다. 선분 BP와 선분 BQ에 길이가 같다는 표시가, ∠ABP와 ∠CBQ에 크기가 같다는 표시가 있다'),
          explain: `∠PBQ = ∠PBC + ∠CBQ = ∠PBC + ∠ABP = ∠ABC = 60°이고 ${seg('BP')} = ${seg('BQ')}이므로 △BQP는 정삼각형이다. ${seg('PQ')} = ${seg('PB')}, ∠BPQ = 60°이다. △ABP와 △CBQ에서 ${seg('AB')} = ${seg('CB')}, ${seg('BP')} = ${seg('BQ')}, ∠ABP = ∠CBQ이므로 △ABP ≡ △CBQ이고 ${seg('CQ')} = ${seg('PA')}이다. ${sq(seg('CQ'))} = ${sq(seg('PA'))} = ${sq(seg('PB'))} + ${sq(seg('PC'))} = ${sq(seg('PQ'))} + ${sq(seg('PC'))}이므로 △PQC는 ∠QPC = 90°인 직각삼각형이다. ∠BPC = ∠BPQ + ∠QPC = 60° + 90° = 150°이다.`,
          facts: { calc: [['60+90', 0]], unseen: [60, 90] }
        });
      }),
      H('hard-across-diagonal', '대각선에 수직인 선분의 길이', '심34', (d) => {
        // 보조선: 점 P 에서 변 BC 에 수선을 내리면 △BCD 와 닮은 직각삼각형이 생긴다.
        const v = d.until(() => {
          const [h, w, dg] = d.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [15, 20, 25]]), run = h * h / w, xp = (w - run) * d.pick([0.3, 0.4, 0.6, 0.7]), xq = xp + run;
          const f = polyFig({ A: [0, h], B: [0, 0], C: [w, 0], D: [w, h] }, { size: [196, 130], sides: { AB: cmL(h), BC: cmL(w) }, at: { BC: xq / w > 0.5 ? 0.22 : 0.8 } }), k = f.P.k, Pp = [xp * k, -h * k], Q = [xq * k, 0];
          f.b.seg(f.P.B, f.P.D).seg(Pp, Q).corner(meet(f.P.B, f.P.D, Pp, Q), f.P.D, Pp, '').name(Pp, 'P', 90).name(Q, 'Q', 270);
          return { h, w, dg, f };
        }, (x) => !x.f.b.clash()), { h, w, dg } = v;
        return fracQ(`그림과 같이 ${seg('AB')} = ${h} cm, ${seg('BC')} = ${w} cm인 직사각형 ABCD에서 변 AD 위의 점 P를 지나고 대각선 BD에 수직인 직선이 변 BC와 만나는 점을 Q라 할 때, ${seg('PQ')}의 길이는?`, dg * h, w, 'cm', {
          figure: v.f.b.svg(`직사각형 ABCD와 대각선 BD. 변 AD 위의 점 P와 변 BC 위의 점 Q를 이은 선분이 대각선 BD와 만나고, 만나는 곳에 직각 표시가 있다. AB = ${h} cm, BC = ${w} cm`),
          explain: `△BCD에서 ${sq(seg('BD'))} = ${sq(w)} + ${sq(h)} = ${dg * dg}이므로 ${seg('BD')} = ${dg} cm이다. 점 P에서 변 BC에 내린 수선의 발을 H라 하면 ${seg('PH')} = ${seg('AB')} = ${h} cm이다. ${seg('PQ')} ⊥ ${seg('BD')}이므로 ∠PQH = 90° − ∠DBC = ∠BDC이다. △PHQ와 △BCD에서 ∠PHQ = ∠BCD = 90°, ∠PQH = ∠BDC이므로 △PHQ ∽ △BCD이다. ${nb(`${seg('PQ')} : ${seg('BD')} = ${seg('PH')} : ${seg('BC')}`)}에서 ${seg('PQ')} = ${frac(`${dg} × ${h}`, w)} = ${fr(dg * h, w)}(cm)이다.`,
          facts: { value: `(${w}**2+${h}**2)**0.5*${h}/${w}`, unseen: [2, 0.5] }
        });
      }),
      H('hard-inner-point-right', '직사각형의 내부의 한 점과 직각', '심42', (d) => {
        // 직사각형 안의 점의 관계로 CP² 을 구한 뒤, 직각삼각형 PBC 에서 정리를 한 번 더 쓴다. BC = W, P(u, t), BP² = uW
        const w = d.until(() => {
          const ap = d.int(3, 9), bp = d.int(3, 9), dp = d.int(3, 9), W2 = dp * dp - ap * ap + 2 * bp * bp;
          if (W2 <= bp * bp || new Set([ap, bp, dp]).size < 3) return null;
          const W = Math.sqrt(W2), u = bp * bp / W, t2 = bp * bp - u * u, s2 = ap * ap - u * u;
          if (t2 <= 0 || s2 <= 0) return null;
          const t = Math.sqrt(t2), Hh = t + Math.sqrt(s2);
          if (u / W < 0.26 || u / W > 0.74 || t / Hh < 0.3 || t / Hh > 0.7 || W / Hh > 1.7 || Hh / W > 1.15) return null;
          const P = lay({ A: [0, Hh], B: [0, 0], C: [W, 0], D: [W, Hh], P: [u, t] }, [190, 150]), b = Board();
          b.poly([P.A, P.B, P.C, P.D]).seg(P.P, P.A).seg(P.P, P.B).seg(P.P, P.C).seg(P.P, P.D).corner(P.P, P.B, P.C, '').dot(P.P);
          const lines = [[P.A, P.B], [P.B, P.C], [P.C, P.D], [P.D, P.A], [P.P, P.A], [P.P, P.B], [P.P, P.C], [P.P, P.D]], ts = [0.5, 0.6, 0.42, 0.68];
          const clear = [putBeside(b, P.P, P.A, cmL(ap), [P.B, P.D], ts, lines), putBeside(b, P.P, P.B, cmL(bp), [P.A, P.C], ts, lines), putBeside(b, P.P, P.D, cmL(dp), [P.A, P.C], ts, lines)].every(Boolean);
          b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).angle(P.P, dirOf(P.P, P.D), dirOf(P.P, P.A), 'P', { arc: false, ink: true });
          return { ap, bp, dp, b, clear };
        }, (v) => v && v.clear && !v.b.clash()), { ap, bp, dp } = w, cp2 = bp * bp + dp * dp - ap * ap, ans = cp2 + bp * bp;
        return N(`그림과 같이 직사각형 ABCD의 내부에 ∠BPC = 90°가 되도록 점 P를 잡았다. ${seg('AP')} = ${ap} cm, ${seg('BP')} = ${bp} cm, ${seg('DP')} = ${dp} cm일 때, ${sq(seg('BC'))}의 값은?`, ans, {
          figure: w.b.svg(`직사각형 ABCD와 그 내부의 점 P. 점 P와 네 꼭짓점을 이은 선분이 그어져 있고, ∠BPC에 직각 표시가 있다. AP = ${ap} cm, BP = ${bp} cm, DP = ${dp} cm`),
          explain: `점 P를 지나고 변 AB에 평행한 직선과 변 AD에 평행한 직선을 그으면 직각삼각형이 네 개 생긴다. 점 P에서 네 변 AB, BC, CD, DA까지의 거리를 차례로 ${nb('㉠, ㉡, ㉢, ㉣')}이라 하면 ${sq(seg('AP'))} = ${sq('㉠')} + ${sq('㉣')}, ${sq(seg('CP'))} = ${sq('㉡')} + ${sq('㉢')}, ${sq(seg('BP'))} = ${sq('㉠')} + ${sq('㉡')}, ${sq(seg('DP'))} = ${sq('㉢')} + ${sq('㉣')}이므로 ${sq(seg('AP'))} + ${sq(seg('CP'))} = ${sq(seg('BP'))} + ${sq(seg('DP'))}이다. ${sq(seg('CP'))} = ${sq(bp)} + ${sq(dp)} − ${sq(ap)} = ${cp2}이다. △PBC는 ∠BPC = 90°인 직각삼각형이므로 ${sq(seg('BC'))} = ${sq(seg('BP'))} + ${sq(seg('CP'))} = ${bp * bp} + ${cp2} = ${ans}이다.`,
          facts: { calc: [[`${bp}**2+${bp}**2+${dp}**2-${ap}**2`, 0]], unseen: [2] }
        });
      }),
      H('hard-crossed', '직각을 낀 두 변 위의 두 점을 엇갈려 이은 선분', '심43', (d, n) => {
        if (n === 0) {
          // ∠A = 90°, AD = u, AE = v, DE = g, BE = e, CD = f
          const w = d.until(() => {
            const e = d.int(5, 12), f = d.int(5, 12), g = d.int(3, 8), th = d.pick([38, 45, 52]) * RAD, u = g * Math.cos(th), v = g * Math.sin(th);
            if (g > Math.min(e, f) - 2 || e === f) return null;
            const p = Math.sqrt(e * e - v * v), q = Math.sqrt(f * f - u * u);
            return u / p >= 0.4 && u / p <= 0.68 && v / q >= 0.4 && v / q <= 0.68 && p / q >= 0.6 && p / q <= 1.5 ? { e, f, g, fig: crossFig(p, q, u, v, { R: 'A', T: 'B', S: 'C' }) } : null;
          }, (x) => x), { e, f, g } = w, ans = e * e + f * f - g * g;
          return N(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 두 변 AB, AC 위에 각각 점 D, E가 있다. ${seg('BE')} = ${e} cm, ${seg('CD')} = ${f} cm, ${seg('DE')} = ${g} cm일 때, ${sq(seg('BC'))}의 값은?`, ans, {
            figure: w.fig.b.svg('직각삼각형 ABC. ∠A에 직각 표시가 있다. 변 AB 위에 점 D가, 변 AC 위에 점 E가 있고 선분 BE, CD, DE가 그어져 있다'),
            explain: `네 직각삼각형 ABE, ADC, ADE, ABC에서 ${sq(seg('BE'))} = ${sq(seg('AB'))} + ${sq(seg('AE'))}, ${sq(seg('CD'))} = ${sq(seg('AD'))} + ${sq(seg('AC'))}, ${sq(seg('DE'))} = ${sq(seg('AD'))} + ${sq(seg('AE'))}, ${sq(seg('BC'))} = ${sq(seg('AB'))} + ${sq(seg('AC'))}이다. ${nb(`${sq(seg('BE'))} + ${sq(seg('CD'))}`)}의 값과 ${nb(`${sq(seg('DE'))} + ${sq(seg('BC'))}`)}의 값은 모두 네 선분 AB, AC, AD, AE의 길이의 제곱의 합이므로 서로 같다. ${sq(seg('BC'))} = ${sq(e)} + ${sq(f)} − ${sq(g)} = ${ans}이다.`,
            facts: { calc: [[`${e}**2+${f}**2-${g}**2`, 0]], unseen: [2] }
          });
        }
        // ∠B = 90°, D, E 는 변 AB, BC 의 중점. AC = 2m, AE = e. AB = 2a, BC = 2c 라 하면 a² = (e² − m²) ÷ 3, c² = m² − a²
        const [m, e] = d.pick([[4, 6], [4, 7], [5, 7], [5, 8], [3, 4], [3, 5], [6, 8], [6, 9], [6, 10], [7, 10], [7, 11], [7, 12], [8, 11], [8, 12], [8, 13]]), a = Math.sqrt((e * e - m * m) / 3), c = Math.sqrt(m * m - a * a), ac = 2 * m, ans = 5 * m * m - e * e;
        const fig = crossFig(2 * a, 2 * c, a, c, { R: 'B', T: 'A', S: 'C' });
        fig.b.tick(fig.P.T, fig.P.D).tick(fig.P.D, fig.P.R).tick(fig.P.R, fig.P.E, 2).tick(fig.P.E, fig.P.S, 2);
        return N(`그림과 같이 ∠B = 90°인 직각삼각형 ABC에서 두 점 D, E는 각각 변 AB, BC의 중점이다. ${seg('AC')} = ${ac} cm, ${seg('AE')} = ${e} cm일 때, ${sq(seg('CD'))}의 값은?`, ans, {
          figure: fig.b.svg('직각삼각형 ABC. ∠B에 직각 표시가 있다. 변 AB의 중점 D와 변 BC의 중점 E가 있고 선분 AE, CD, DE가 그어져 있다. 선분 AD와 선분 DB에, 선분 BE와 선분 EC에 길이가 같다는 표시가 있다'),
          explain: `두 점 D, E는 두 변 AB, BC의 중점이므로 ${seg('DE')} = ${HALF} × ${seg('AC')} = ${m}(cm)이다. 네 직각삼각형 ABE, DBC, DBE, ABC에서 ${sq(seg('AE'))} = ${sq(seg('AB'))} + ${sq(seg('BE'))}, ${sq(seg('CD'))} = ${sq(seg('BD'))} + ${sq(seg('BC'))}, ${sq(seg('DE'))} = ${sq(seg('BD'))} + ${sq(seg('BE'))}, ${sq(seg('AC'))} = ${sq(seg('AB'))} + ${sq(seg('BC'))}이므로 ${nb(`${sq(seg('AE'))} + ${sq(seg('CD'))}`)} = ${nb(`${sq(seg('DE'))} + ${sq(seg('AC'))}`)}이다. ${sq(seg('CD'))} = ${sq(m)} + ${sq(ac)} − ${sq(e)} = ${ans}이다.`,
          facts: { calc: [[`(${ac}/2)**2+${ac}**2-${e}**2`, 0]], unseen: [2] }
        });
      }, { count: 2 }),
      H('hard-trisect', '빗변을 삼등분하는 두 점까지의 거리', '심44', (d) => {
        // 두 점에서 한 변에 수선을 내려 길이를 문자 둘로 놓고, 정리로 세운 두 식을 더한다.
        const w = d.until(() => { const pair = d.pick([[6, 7], [7, 6], [8, 9], [9, 8], [11, 12], [12, 11], [12, 14], [14, 12], [13, 14], [14, 13]]); return { pair, b: trisectFig(pair[0], pair[1]) }; }, (x) => x.b.clear && !x.b.clash());
        const [m, n] = w.pair, s = m * m + n * n, ans = 9 * s / 5, a = V('a'), bb = V('b');
        return N(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 두 점 M, N은 빗변 AB를 삼등분하는 점이다. ${seg('CM')} = ${m} cm, ${seg('CN')} = ${n} cm일 때, ${sq(seg('AB'))}의 값은?`, ans, {
          figure: w.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 변 AB가 빗변이다. 빗변 AB 위에 점 A에서 가까운 쪽부터 두 점 M, N이 있고, 선분 AM, MN, NB에 길이가 같다는 표시가 있다. 선분 CM과 선분 CN이 그어져 있다. CM = ${m} cm, CN = ${n} cm`),
          explain: `두 점 M, N에서 변 BC에 내린 수선의 발을 각각 D, E라 하면 ${seg('MD')} ∥ ${seg('NE')} ∥ ${seg('AC')}이고 ${seg('AM')} = ${seg('MN')} = ${seg('NB')}이므로 ${seg('CD')} = ${seg('DE')} = ${seg('EB')}이다. △BNE ∽ △BMD ∽ △BAC이고 닮음비가 ${nb('1 : 2 : 3')}이므로 ${seg('CD')} = ${a} cm, ${seg('NE')} = ${bb} cm라 하면 ${seg('CE')} = 2${a} cm, ${seg('MD')} = 2${bb} cm, ${seg('BC')} = 3${a} cm, ${seg('AC')} = 3${bb} cm이다. △MCD에서 ${nb(`${sq(a)} + 4${sq(bb)} = ${m * m}`)}, △NCE에서 ${nb(`4${sq(a)} + ${sq(bb)} = ${n * n}`)}이다. 두 식을 변끼리 더하면 ${nb(`5${sq(a)} + 5${sq(bb)} = ${s}`)}이므로 ${nb(`${sq(a)} + ${sq(bb)} = ${s / 5}`)}이다. ${sq(seg('AB'))} = ${sq(`(3${a})`)} + ${sq(`(3${bb})`)} = 9(${sq(a)} + ${sq(bb)}) = 9 × ${s / 5} = ${ans}이다.`,
          facts: { calc: [[`9*(${m}**2+${n}**2)/5`, 0]], unseen: [9, 2, 5] }
        });
      }),
      H('hard-perp-ratio', '수직으로 만나는 두 선분과 길이의 비', '심45', (d) => {
        // 길이를 문자 둘로 놓으면 세 선분의 길이의 제곱이 같은 두 문자로 적힌다.
        const r = d.pick([2, 3, 4]), g = d.int(1, 6), [fa, fb] = d.pick([[1, 1], [1, 1.25], [1.25, 1], [1, 1.45], [1.45, 1]]), ans = (r * r + 1) * g * g, a = V('a'), bb = V('b');
        return N(`그림과 같은 △ABC에서 두 변 AB, BC 위에 각각 점 D, E가 있고, ${seg('AE')}와 ${seg('CD')}는 점 F에서 수직으로 만난다. ${nb(`${seg('AF')} : ${seg('FE')} = ${seg('CF')} : ${seg('FD')} = ${r} : 1`)}이고 ${seg('DE')} = ${g} cm일 때, ${nb(`${sq(seg('AD'))} + ${sq(seg('EC'))}`)}의 값은?`, ans, {
          figure: perpFig(r, fa, fb).svg('삼각형 ABC. 변 AB 위에 점 D가, 변 BC 위에 점 E가 있다. 선분 AE와 선분 CD가 점 F에서 만나고 직각 표시가 있다. 선분 DE가 그어져 있다'),
          explain: `${seg('FE')} = ${a} cm, ${seg('FD')} = ${bb} cm라 하면 ${seg('AF')} = ${r}${a} cm, ${seg('CF')} = ${r}${bb} cm이다. △DFE에서 ${nb(`${sq(a)} + ${sq(bb)} = ${sq(g)} = ${g * g}`)}이다. △AFD에서 ${sq(seg('AD'))} = ${sq(`(${r}${a})`)} + ${sq(bb)} = ${r * r}${sq(a)} + ${sq(bb)}이고, △CFE에서 ${sq(seg('EC'))} = ${sq(a)} + ${sq(`(${r}${bb})`)} = ${sq(a)} + ${r * r}${sq(bb)}이다. ${nb(`${sq(seg('AD'))} + ${sq(seg('EC'))}`)} = ${r * r + 1}${sq(a)} + ${r * r + 1}${sq(bb)} = ${r * r + 1}(${sq(a)} + ${sq(bb)}) = ${r * r + 1} × ${g * g} = ${ans}이다.`,
          facts: { calc: [[`(${r}**2+1)*${g}**2`, 0]], unseen: [2] }
        });
      }),
      H('hard-fold-square', '정사각형 모양의 종이 접기', '심40', (d) => {
        // AE = a, AB′ = p, EB = e, 한 변 s = a + e. 접은 변이 두 번 쓰인다(EB′ = EB, B′C′ = BC).
        const [a, p, e] = d.pick([[4, 3, 5], [12, 9, 15], [20, 15, 25], [12, 5, 13], [15, 8, 17]]), s = a + e, db = s - p;
        return fracQ(`그림과 같이 한 변의 길이가 ${s} cm인 정사각형 모양의 종이 ABCD를 ${seg('EF')}를 접는 선으로 하여 꼭짓점 B가 변 AD 위의 ${nb('점 B′에')} 오도록 접었다. 꼭짓점 C가 옮겨진 점을 ${nb('C′,')} ${seg('B′C′')}과 변 DC가 만나는 점을 G라 하자. ${seg('EB')} = ${e} cm일 때, ${seg('GC′')}의 길이는?`, p * (e - p), a, 'cm', {
          figure: foldSquareFig(s, e, p).svg(`정사각형 모양의 종이 ABCD를 선분 EF를 접는 선으로 하여 접은 그림. 점 E는 변 AB 위에, 점 F는 변 DC 위에 있다. 꼭짓점 B가 옮겨진 점 B′은 변 AD 위에 있고, 꼭짓점 C가 옮겨진 점 C′은 변 DC의 바깥쪽에 있다. 선분 B′C′이 변 DC와 점 G에서 만난다. 접힌 부분인 사각형 EB′C′F가 짙게 색칠되어 있고, 접기 전의 선분 EB, 변 BC, 선분 CF는 점선으로 그려져 있다. 정사각형의 한 변의 길이는 ${s} cm, EB = ${e} cm`),
          explain: `${seg('AE')} = ${s} − ${e} = ${a}(cm)이고, 접은 변이므로 ${seg('EB′')} = ${seg('EB')} = ${e} cm이다. △AEB′에서 ${sq(seg('AB′'))} = ${sq(e)} − ${sq(a)} = ${p * p}이므로 ${seg('AB′')} = ${p} cm, ${seg('DB′')} = ${s} − ${p} = ${db}(cm)이다. ∠EB′G = ∠B = 90°이므로 ∠AB′E + ∠DB′G = 90°이다. △AEB′과 △DB′G에서 ∠A = ∠D = 90°, ∠AEB′ = 90° − ∠AB′E = ∠DB′G이므로 △AEB′ ∽ △DB′G이다. ${nb(`${seg('AE')} : ${seg('DB′')} = ${seg('EB′')} : ${seg('B′G')}`)}에서 ${a} × ${seg('B′G')} = ${db} × ${e}이므로 ${seg('B′G')} = ${fr(db * e, a)}(cm)이다. 접은 변이므로 ${seg('B′C′')} = ${seg('BC')} = ${s} cm이고 ${seg('GC′')} = ${s} − ${fr(db * e, a)} = ${fr(p * (e - p), a)}(cm)이다.`,
          facts: { value: `${s}-${e}*(${s}-(${e}**2-(${s}-${e})**2)**0.5)/(${s}-${e})`, unseen: [2, 0.5] }
        });
      }),
      H('hard-cylinder-path', '원기둥의 옆면을 한 바퀴 도는 가장 짧은 길', '심48', (d) => {
        // 함정: 옆면을 펼친 직사각형의 가로는 밑면의 둘레의 길이이다. 반지름이나 지름을 가로로 삼으면 틀린다.
        const [r, hk, l] = d.pick([[8, 12, 20], [6, 5, 13], [12, 7, 25], [12, 10, 26], [10, 15, 25], [6, 9, 15], [15, 16, 34], [12, 18, 30], [4, 6, 10]]), around = 2 * r;
        return piN(`그림과 같이 밑면의 반지름의 길이가 ${r} cm인 원기둥에서 밑면의 둘레 위의 점 A와 다른 밑면의 둘레 위의 점 B를 이은 선분 AB는 밑면에 수직이다. 점 A에서 출발하여 옆면을 따라 한 바퀴 돌아 점 B에 이르는 가장 짧은 길의 길이가 ${l}${PI} cm일 때, 원기둥의 높이는?`, hk, 'π cm', {
          figure: cylPathFig(r, hk).svg(`원기둥의 겨냥도. 밑면의 반지름의 길이는 ${r} cm이다. 아래 밑면의 둘레 위의 점 A에서 옆면을 따라 한 바퀴 돌아, 점 A의 바로 위에 있는 위 밑면의 둘레 위의 점 B에 이르는 선이 그려져 있다`),
          explain: `원기둥의 옆면을 선분 AB를 따라 잘라 펼치면 직사각형이 되고, 그 가로의 길이는 밑면의 둘레의 길이와 같은 2${PI} × ${r} = ${around}${PI}(cm), 세로의 길이는 원기둥의 높이와 같다. 가장 짧은 길은 이 직사각형의 대각선이다. 높이를 제곱하면 ${sq(`(${l}${PI})`)} − ${sq(`(${around}${PI})`)} = ${l * l - around * around}${sq(PI)}이고 ${sq(`(${hk}${PI})`)} = ${hk * hk}${sq(PI)}이므로 원기둥의 높이는 ${hk}${PI} cm이다.`,
          facts: { calc: [[`(${l}**2-(2*${r})**2)**0.5`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-sector-cone', '부채꼴을 옆면으로 하는 원뿔의 부피', '①61', (d) => {
        // 호의 길이 → 밑면의 반지름 → 높이(정리) → 부피. 밑면의 반지름 r, 높이 h, 모선 l
        const [r, h, l] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 9, 15], [12, 16, 20], [16, 12, 20], [15, 20, 25]]), th = 360 * r / l, vol = r * r * h / 3;
        return piN(`그림과 같이 중심각의 크기가 ${th}°이고 반지름의 길이가 ${l} cm인 부채꼴을 옆면으로 하는 원뿔의 부피는?`, vol, 'π cm³', {
          figure: sectorFig(l, th).svg(`색칠한 부채꼴. 중심각의 크기는 ${th}°이고 반지름의 길이는 ${l} cm이다`),
          explain: `부채꼴의 호의 길이는 2${PI} × ${l} × ${frac(th, 360)} = ${2 * r}${PI}(cm)이고, 이것은 밑면인 원의 둘레의 길이와 같으므로 밑면의 반지름의 길이는 ${r} cm이다. 원뿔의 모선의 길이는 부채꼴의 반지름의 길이와 같은 ${l} cm이므로 높이를 제곱하면 ${sq(l)} − ${sq(r)} = ${h * h}이고, ${sq(h)} = ${h * h}에서 높이는 ${h} cm이다. 부피는 ${frac(1, 3)} × ${PI} × ${sq(r)} × ${h} = ${vol}${PI}(cm³)이다.`,
          facts: { calc: [[`(${l}*${th}/360)**2*(${l}**2-(${l}*${th}/360)**2)**0.5/3`, 0]], unseen: [360, 2, 0.5, 3] }
        });
      }),
      H('hard-foot-again', '수선의 발에서 다시 내린 수선의 길이', '심33', (d) => {
        // AE = u, BE = v, AB = c. 정리 → 닮음으로 CE, BC → 평행선으로 EF
        const [u, v, c] = d.pick([[18, 24, 30], [32, 24, 40], [9, 12, 15], [16, 12, 20]]), ce = v * v / u, bc = v * c / u, ca = c * c / u, g0 = gcd(ce, ca);
        return fracQ(`그림과 같이 직사각형 ABCD의 꼭짓점 B에서 대각선 AC에 내린 수선의 발을 E, 점 E에서 변 CD에 내린 수선의 발을 F라 하자. ${seg('AB')} = ${c} cm, ${seg('AE')} = ${u} cm일 때, ${seg('EF')}의 길이는?`, bc * ce, ca, 'cm', {
          figure: footAgainFig(u, v, c).svg(`직사각형 ABCD와 대각선 AC. 꼭짓점 B에서 대각선 AC에 내린 수선의 발이 E, 점 E에서 변 CD에 내린 수선의 발이 F이고 직각 표시가 있다. AB = ${c} cm, AE = ${u} cm`),
          explain: `△ABE에서 ${sq(seg('BE'))} = ${sq(c)} − ${sq(u)} = ${v * v}이므로 ${seg('BE')} = ${v} cm이다. △ABE와 △BCE에서 ∠AEB = ∠BEC = 90°, ∠BAE = 90° − ∠ABE = ∠CBE이므로 △ABE ∽ △BCE이다. ${nb(`${seg('AE')} : ${seg('BE')} = ${seg('BE')} : ${seg('CE')}`)}에서 ${seg('CE')} = ${ce} cm이고, ${nb(`${seg('AE')} : ${seg('BE')} = ${seg('AB')} : ${seg('BC')}`)}에서 ${seg('BC')} = ${bc} cm이다. ${seg('EF')} ∥ ${seg('AD')}이므로 △CEF ∽ △CAD이고 ${nb(`${seg('EF')} : ${seg('AD')} = ${seg('CE')} : ${seg('CA')} = ${ce} : ${ca}${g0 > 1 ? ` = ${ce / g0} : ${ca / g0}` : ''}`)}이다. ${seg('AD')} = ${seg('BC')} = ${bc} cm이므로 ${seg('EF')} = ${bc} × ${frac(ce / g0, ca / g0)} = ${fr(bc * ce, ca)}(cm)이다.`,
          facts: { value: `(${c}**2-${u}**2)*(${c}**2-${u}**2)**0.5/(${u}*${c})`, unseen: [2, 0.5] }
        });
      }),
      H('hard-bisector', '각의 이등분선이 있는 직각삼각형', '심8', (d) => {
        // AC = ac, BC = bc, AB = ab. 이등분선 위의 점 D 에서 빗변에 수선을 내려 합동과 닮음으로 DC 를 구한다(각의 이등분선이 나눈 변의 비는 쓰지 않는다).
        const [ac, bc, ab] = d.pick([[6, 8, 10], [12, 9, 15], [12, 16, 20], [18, 24, 30], [24, 18, 30], [15, 36, 39], [24, 32, 40], [36, 27, 45]]), be = ab - ac, dc = ac * be / bc, ans = ac * ac + dc * dc;
        return N(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 하자. ${seg('AB')} = ${ab} cm, ${seg('AC')} = ${ac} cm일 때, ${sq(seg('AD'))}의 값은?`, ans, {
          figure: bisectFig(ac, bc, d.bool()).svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. 꼭짓점 A와 변 BC 위의 점 D를 이은 선분이 그어져 있고, ∠BAD와 ∠DAC에 크기가 같다는 표시가 있다. AB = ${ab} cm, AC = ${ac} cm`),
          explain: `△ABC에서 ${sq(seg('BC'))} = ${sq(ab)} − ${sq(ac)} = ${bc * bc}이므로 ${seg('BC')} = ${bc} cm이다. 점 D에서 변 AB에 내린 수선의 발을 E라 하면 △AED와 △ACD에서 ∠AED = ∠ACD = 90°, ${seg('AD')}는 공통, ∠EAD = ∠CAD이므로 △AED ≡ △ACD이다. ${seg('AE')} = ${seg('AC')} = ${ac} cm, ${seg('DE')} = ${seg('DC')}이고 ${seg('BE')} = ${ab} − ${ac} = ${be}(cm)이다. △BED와 △BCA에서 ∠B는 공통, ∠BED = ∠BCA = 90°이므로 △BED ∽ △BCA이고, ${nb(`${seg('DE')} : ${seg('AC')} = ${seg('BE')} : ${seg('BC')}`)}에서 ${seg('DE')} = ${frac(`${ac} × ${be}`, bc)} = ${dc}(cm)이다. ${seg('DC')} = ${dc} cm이므로 △ADC에서 ${sq(seg('AD'))} = ${sq(ac)} + ${sq(dc)} = ${ans}이다.`,
          facts: { calc: [[`${ac}**2+(${ac}*(${ab}-${ac})/(${ab}**2-${ac}**2)**0.5)**2`, 0]], unseen: [2, 0.5] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
