// 중학교 3학년 2학기 3단원 원과 직선 — 뒤쪽 묶음(원의 접선과 접선의 길이, 삼각형의 내접원과 접선의 길이, 원에 외접하는 사각형, 지름의 양 끝 접선과 직사각형 안의 원).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-2-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 파일에서 지킨 것
//  - 접선 그림은 원 밖의 점 P 를 왼쪽에 두고 두 접점 A(위)·B(아래)에 직각 표시를 한다. 「원의 접선은 그 접점을 지나는 반지름과 수직이다」는 중1에서 배운 것으로 쓴다.
//  - 접선의 길이는 「원 밖의 한 점에서 그 원에 그은 두 접선의 길이는 같다」로 푼다. 문제 글에는 「접선의 길이」라는 말을 쓰지 않고 선분의 이름으로 묻는다.
//  - 외접하는 사각형은 네 꼭짓점에서 접점까지의 길이(접선의 길이)를 먼저 정하고 원의 반지름을 셈해 그린다. 그래서 그림의 변의 길이가 문제의 수와 맞는다.
//  - 맞닿은 두 원(상자 채우기)은 「맞닿은 두 원의 중심을 이은 선분은 맞닿은 점을 지나므로 그 길이는 두 반지름의 합이다」를 풀이에 밝힌다(교과서 읽을거리가 그렇게 쓴다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 각도는 수에 붙여 적고(56°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C } = B.kit;
  const { V, nb, rt, radText } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT, WHITE, Board } = B.kit.mgeo;
  const K = B.kit.m923;
  const { UNIT, T, X, R_, sg, cm, deg, eq, is, perp, sq, sup2, gcd, jo, rad, rootOf, cmQ, degQ, cm2Q, xQ, fracQ, piQ, piF, radQ, sumRad, pickOne, fin, triple, isSq, split, foot, along, inOf, sssTri, fitPts, scene } = K;
  const Y = V('y');

  // ── 그림 ──
  // 원 O 와 원 밖의 점 P(왼쪽), 두 접점 A(위)·B(아래). t: 접선의 길이, R: 반지름(cm). more: 덧붙일 점
  function tanPts(t, R, o) {
    const opt = o || {}, h = Math.hypot(t, R), be = Math.acos(R / h) / RAD, O = [0, 0];
    const P0 = Object.assign({ O, P: [-h, 0], A: at(O, R, 180 - be), B: at(O, R, 180 + be) }, opt.more ? opt.more({ O, R, h, be }) : {});
    return fitPts(P0, opt.size || [225, 150], [[O, R]]);
  }
  const tanScene = (P, R, o) => {
    const opt = o || {}, S = scene(P).ring('O', R).line('PA PB', 0, opt.tail == null ? 16 : opt.tail);
    if (opt.radii !== false) S.seg('OA OB').right('PAO PBO');
    return S.dot('O');
  };
  const TAN_SAY = '원 O와 원 밖의 점 P. 점 P에서 원 O에 그은 두 접선의 접점이 A, B이다. ';
  const TAN_HEAD = '다음 그림에서 두 점 A, B는 점 P에서 원 O에 그은 두 접선의 접점이다.';
  const TAN_WHY = `원 밖의 한 점에서 그 원에 그은 두 접선의 길이는 같으므로 ${eq('PA', 'PB')}이다.`;
  const RIGHT_WHY = '원의 접선은 그 접점을 지나는 반지름과 수직이므로';

  // 세 꼭짓점에서 접점까지의 길이 p(A), q(B), s(C)로 지은 삼각형과 내접원(중심 O, 접점 D(AB)·E(BC)·F(CA)). 반지름 r 이 붙는다.
  function inTri(p, q, s, o) {
    const opt = o || {}, a = q + s, b = p + s, c = p + q, T0 = sssTri(a, b, c), O = inOf(T0.A, T0.B, T0.C);
    const P0 = Object.assign({ A: T0.A, B: T0.B, C: T0.C, O, D: foot(O, T0.A, T0.B), E: foot(O, T0.B, T0.C), F: foot(O, T0.C, T0.A) }, opt.more ? opt.more(T0, O) : {});
    const r = dist(O, P0.E), P = fitPts(P0, opt.size || [215, 165], [[O, r]]);
    Object.defineProperty(P, 'r', { value: r });
    return P;
  }
  const inScene = (P, o) => { const opt = o || {}, S = scene(P).ring('O', P.r).poly('ABC'); if (opt.radii) S.seg('OD OE OF', 'thin').right('ODA OEB OFC'); return S.dot('O'); };
  const IN_HEAD = '다음 그림에서 원 O는 △ABC의 내접원이고 세 점 D, E, F는 접점이다.';
  const IN_SAY = '삼각형 ABC와 그 내접원 O. 내접원이 변 AB, BC, CA에 접하는 점이 각각 D, E, F이다. ';
  // 실력 파일(9-2-3c.js)도 쓴다.
  Object.assign(K, { inTri, inScene, IN_HEAD, IN_SAY });
  // ∠C = 90°인 직각삼각형(C 오른쪽 아래, B 왼쪽 아래, A 위)과 내접원. 두 다리 a = BC, b = CA
  function rightIn(a, b, o) {
    const opt = o || {}, c = Math.hypot(a, b), r = (a + b - c) / 2, Cc = [0, 0], Bb = [-a, 0], Aa = [0, -b], O = [-r, -r];
    const P = fitPts(Object.assign({ A: Aa, B: Bb, C: Cc, O, D: foot(O, Aa, Bb), E: [-r, 0], F: [0, -r] }, opt.more ? opt.more(O, r) : {}), opt.size || [210, 165], [[O, r]]);
    Object.defineProperty(P, 'r', { value: r * P.k });
    return P;
  }

  // 네 꼭짓점에서 접점까지의 길이 tA, tB, tC, tD 로 지은 원에 외접하는 사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위).
  // 접점: E(AB), F(BC), G(CD), H(DA). 반지름은 네 반각(tan = r / t)의 합이 180°가 되게 셈한다.
  function quadPts(t, o) {
    const opt = o || {}, half = (r) => t.map((x) => Math.atan(r / x) / RAD);
    let lo = 0, hi = 100; for (let i = 0; i < 80; i += 1) { const m = (lo + hi) / 2; if (half(m).reduce((s, v) => s + v, 0) < 180) lo = m; else hi = m; }
    const r = (lo + hi) / 2, [aA, aB, aC, aD] = half(r), O = [0, 0];
    const e = 90 + 2 * aB, f = e + 180 - 2 * aB, g = f + 180 - 2 * aC, h = g + 180 - 2 * aD;
    const P0 = { O, E: at(O, r, e), F: at(O, r, f), G: at(O, r, g), H: at(O, r, h), A: at(O, Math.hypot(r, t[0]), (h + e + 360) / 2), B: at(O, Math.hypot(r, t[1]), (e + f) / 2), C: at(O, Math.hypot(r, t[2]), (f + g) / 2), D: at(O, Math.hypot(r, t[3]), (g + h) / 2) };
    const P = fitPts(P0, opt.size || [210, 170], [[O, r]]);
    Object.defineProperty(P, 'r', { value: r });
    return { P, r, angles: [aA, aB, aC, aD].map((x) => 2 * x) };
  }
  // 그려 보기 좋은 접선의 길이 넷(네 내각이 55°~125°)
  const quadT = (d, ok) => d.until(() => [d.int(3, 9), d.int(3, 9), d.int(3, 9), d.int(3, 9)], (t) => { const q = quadPts(t); return q.angles.every((a) => a >= 55 && a <= 125) && (!ok || ok(t)); });
  const QUAD_SAY = '원 O와 그 원에 외접하는 사각형 ABCD. ';
  // 접점이 있는 변 전체의 길이는 접점의 이름과 겹치지 않게 접점에서 먼 쪽에 적는다.
  const sideLen = (S, pair, touch, label, o) => { const P = S.P, t = dist(P[pair[0]], P[touch]) / dist(P[pair[0]], P[pair[1]]); return S.len(pair, label, 'O', Object.assign({ t: t < 0.5 ? 0.76 : 0.24 }, o)); };
  const QUAD_WHY = '원 밖의 한 점에서 그 원에 그은 두 접선의 길이는 같으므로 원에 외접하는 사각형에서 두 쌍의 대변의 길이의 합은 같다.';

  // 지름 AB(가로, 아래)와 양 끝 접선 위의 점 D(A 위, AD = a)·C(B 위, BC = b), 접선 CD 의 접점 E. full: 원 전체를 그린다(아니면 반원)
  function semiPts(a, b, o) {
    const opt = o || {}, rho = Math.sqrt(a * b), O = [0, 0], A = [-rho, 0], Bp = [rho, 0], D = [-rho, -a], Cp = [rho, -b], E = [D[0] + (Cp[0] - D[0]) * a / (a + b), D[1] + (Cp[1] - D[1]) * a / (a + b)];
    const P0 = Object.assign({ O, A, B: Bp, C: Cp, D, E, top: [0, -rho] }, opt.full ? { bot: [0, rho] } : {});
    const P = fitPts(P0, opt.size || [200, 150]);
    Object.defineProperty(P, 'r', { value: rho });
    return P;
  }
  const semiScene = (P, o) => {
    const opt = o || {}, S = scene(P);
    if (opt.full) S.ring('O', P.r); else S.arc('O', P.r, 0, 180);
    return S.poly('ABCD').dot('O');
  };

  B.addGroup(UNIT, {
    id: 'tangent', title: '원의 접선과 접선의 길이', standard: K.STD,
    types: [
      T('tan-equal', '원 밖의 한 점에서 그은 두 접선의 길이', '①30', (d) => {
        const t = d.int(4, 15), R = t * d.pick([0.42, 0.5, 0.58]), P = tanPts(t, R), S = tanScene(P, R, { radii: false }).len('PA', cm(t), 'B').names();
        return cmQ(`${TAN_HEAD} ${is('PA', t)}일 때, ${jo(sg('PB'), '의/의')} 길이는?`, t, {
          figure: S.svg(`${TAN_SAY}선분 PA의 길이는 ${t} cm`),
          explain: `${TAN_WHY} 따라서 ${sg('PB')} = ${t} cm이다.`,
          facts: { calc: [[`${t}`, 0]] }
        });
      }),
      T('tan-len', '반지름과 원의 중심까지의 거리로 두 접선의 길이 구하기', '①31', (d) => {
        const [R, t, h] = triple(d, ([a, b, c]) => a < b && a >= 0.35 * b && a <= 0.55 * c && b <= 24), P = tanPts(t, R);
        const S = tanScene(P, R).seg('PO', 'thin').len('OA', cm(R), 'P', { gap: 3 }).len('PO', cm(h), 'A', { t: 0.8 }).names();
        return cmQ(`${TAN_HEAD} 원 O의 반지름의 길이가 ${R} cm이고 ${is('OP', h)}일 때, ${jo(sg('PB'), '의/의')} 길이는?`, t, {
          figure: S.svg(`${TAN_SAY}반지름 OA, OB와 선분 OP가 그어져 있고 두 접점에 직각 표시가 있다. 반지름 OA의 길이는 ${R} cm, 선분 OP의 길이는 ${h} cm`),
          explain: `${RIGHT_WHY} ∠OBP = 90°이다. 직각삼각형 OBP에서 ${sg('PB')} = ${rootOf(`${sq(h)} − ${sq(R)}`)} = ${rt(h * h - R * R)} = ${t}(cm)이다.`,
          facts: { calc: [[`(${h}*${h}-${R}*${R})**0.5`, 0]] }
        });
      }),
      T('tan-len-out', '반지름과 원 밖으로 나온 부분의 길이로 두 접선의 길이 구하기', '①32', (d) => {
        const [R, e] = d.until(() => [d.int(2, 10), d.int(2, 10)], ([r, k]) => { const v = k * k + 2 * r * k; return k >= 0.45 * r && k <= 2.2 * r && !isSq(v) && split(v)[0] >= 2; }), v = e * e + 2 * R * e, [s, m] = split(v), t = Math.sqrt(v);
        const P = tanPts(t, R, { more: ({ O, R: r }) => ({ C: at(O, r, 180) }) }), S = tanScene(P, R).seg('PO', 'thin').len('OB', cm(R), 'P', { gap: 3 }).names({ C: [125, 12] });
        return radQ(`${TAN_HEAD} 선분 OP가 원 O와 만나는 점을 C라 하자. 원 O의 반지름의 길이가 ${R} cm이고 ${is('PC', e)}일 때, ${jo(sg('PB'), '의/의')} 길이는?`, s, m, 'cm', {
          figure: S.svg(`${TAN_SAY}반지름 OA, OB와 선분 OP가 그어져 있고 두 접점에 직각 표시가 있다. 선분 OP가 원과 만나는 점이 C이다. 반지름 OB의 길이는 ${R} cm`),
          explain: `${sg('OC')} = ${R} cm이므로 ${sg('OP')} = ${R} + ${e} = ${R + e}(cm)이다. ${RIGHT_WHY} 직각삼각형 OBP에서 ${sg('PB')} = ${rootOf(`${sq(R + e)} − ${sq(R)}`)} = ${rt(v)} = ${radText(s, m)}(cm)이다.`,
          facts: { calc: [[`(((${R}+${e})*(${R}+${e})-${R}*${R})/${m})**0.5`, 0], [`${m}`, 1]], unseen: [m] }
        });
      }),
      T('tan-po', '두 접선의 길이와 반지름으로 원의 중심까지의 거리 구하기', '①33', (d) => {
        const [t, R] = d.until(() => [d.int(3, 14), d.int(2, 9)], ([a, b]) => { const v = a * a + b * b; return b >= 0.3 * a && b <= 0.9 * a && !isSq(v) && split(v)[0] >= 2; }), v = t * t + R * R, [s, m] = split(v);
        const P = tanPts(t, R), S = tanScene(P, R).seg('PO', 'thin').len('OA', cm(R), 'P', { gap: 3 }).len('PB', cm(t), 'O').names();
        return radQ(`${TAN_HEAD} 원 O의 반지름의 길이가 ${R} cm이고 ${is('PB', t)}일 때, ${jo(sg('OP'), '의/의')} 길이는?`, s, m, 'cm', {
          figure: S.svg(`${TAN_SAY}반지름 OA, OB와 선분 OP가 그어져 있고 두 접점에 직각 표시가 있다. 반지름 OA의 길이는 ${R} cm, 선분 PB의 길이는 ${t} cm`),
          explain: `${RIGHT_WHY} ∠OBP = 90°이다. 직각삼각형 OBP에서 ${sg('OP')} = ${rootOf(`${sq(t)} + ${sq(R)}`)} = ${rt(v)} = ${radText(s, m)}(cm)이다.`,
          facts: { calc: [[`((${t}*${t}+${R}*${R})/${m})**0.5`, 0], [`${m}`, 1]], unseen: [m] }
        });
      }),
      T('tan-secant', '접선의 길이와 원 밖으로 나온 부분의 길이로 반지름 구하기', '①34', (d) => {
        const [t, e] = d.until(() => [d.int(4, 15), d.int(2, 6)], ([a, b]) => { const r = (a * a - b * b) / (2 * b); return b < a && !Number.isInteger(r) && r >= 0.45 * b && r <= 2.6 * b; }), R = (t * t - e * e) / (2 * e);
        const h = R + e, be = Math.acos(R / h) / RAD, O = [0, 0], P = fitPts({ O, P: [-h, 0], A: at(O, R, 180 - be), B: at(O, R, 180) }, [225, 150], [[O, R]]);
        const S = scene(P).ring('O', R).line('PA', 0, 18).seg('PO OA').right('PAO').dot('O').len('PA', cm(t), 'O').len('PB', cm(e), 'A', { gap: 3 }).names({ B: [60, 12] });
        return fracQ(`다음 그림에서 직선 PA는 원 O의 접선이고 점 A는 접점이다. 선분 PO가 원 O와 만나는 점을 B라 할 때, ${is('PA', t)}, ${is('PB', e)}이면 원 O의 반지름의 길이는?`, t * t - e * e, 2 * e, 'cm', {
          figure: S.svg(`원 O와 원 밖의 점 P. 직선 PA는 점 A에서 원 O에 접하고, 반지름 OA와 선분 PO가 그어져 있다. A에 직각 표시가 있다. 선분 PO가 원과 만나는 점이 B이다. 선분 PA의 길이는 ${t} cm, 선분 PB의 길이는 ${e} cm`),
          explain: `반지름의 길이를 ${R_} cm라 하면 ${sg('PO')} = (${e} + ${R_}) cm이다. ${RIGHT_WHY} 직각삼각형 PAO에서 (${e} + ${R_})${sup2} = ${sq(t)} + ${R_}${sup2}, ${2 * e}${R_} = ${t * t - e * e}이므로 ${R_} = ${frac((t * t - e * e) / gcd(t * t - e * e, 2 * e), 2 * e / gcd(t * t - e * e, 2 * e))}이다.`,
          facts: { value: `(${t}*${t}-${e}*${e})/(2*${e})`, unseen: [2] }
        });
      }),
      T('tan-aob', '두 접선이 이루는 각으로 두 반지름이 이루는 각 구하기', '①35', (d) => {
        const th = 2 * d.int(18, 42), P = tanPts(10, 10 * Math.tan(th / 2 * RAD)), S = tanScene(P, 10 * Math.tan(th / 2 * RAD)).ang('APB', deg(th)).names();
        return degQ(`${TAN_HEAD} ∠APB = ${th}°일 때, ∠AOB의 크기는?`, 180 - th, {
          figure: S.svg(`${TAN_SAY}반지름 OA, OB가 그어져 있고 두 접점에 직각 표시가 있다. ∠APB의 크기는 ${th}°`),
          explain: `${RIGHT_WHY} ∠PAO = ∠PBO = 90°이다. 사각형 APBO에서 ∠AOB = 360° − (90° + ${th}° + 90°) = ${180 - th}°이다.`,
          facts: { calc: [[`360-90-${th}-90`, 0]], unseen: [360, 90] }
        });
      }),
      T('tan-pab', '두 접선이 이루는 각으로 접점을 이은 현과 접선이 이루는 각 구하기', '①36', (d) => {
        const th = 2 * d.int(18, 42), R = 10 * Math.tan(th / 2 * RAD), P = tanPts(10, R), S = tanScene(P, R, { radii: false }).seg('AB').ang('APB', deg(th)).names();
        return degQ(`${TAN_HEAD} ∠APB = ${th}°일 때, ∠PAB의 크기는?`, (180 - th) / 2, {
          figure: S.svg(`${TAN_SAY}두 접점을 이은 선분 AB가 그어져 있다. ∠APB의 크기는 ${th}°`),
          explain: `${TAN_WHY} △PAB는 이등변삼각형이므로 ∠PAB = (180° − ${th}°) ÷ 2 = ${(180 - th) / 2}°이다.`,
          facts: { calc: [[`(180-${th})/2`, 0]], unseen: [180, 2] }
        });
      }),
      T('tan-oab', '두 접선이 이루는 각으로 반지름과 현이 이루는 각 구하기', '①37', (d) => {
        const th = 2 * d.int(18, 42), R = 10 * Math.tan(th / 2 * RAD), P = tanPts(10, R), S = tanScene(P, R).seg('AB').ang('APB', deg(th)).names();
        return degQ(`${TAN_HEAD} ∠APB = ${th}°일 때, ∠OAB의 크기는?`, th / 2, {
          figure: S.svg(`${TAN_SAY}반지름 OA, OB와 선분 AB가 그어져 있고 두 접점에 직각 표시가 있다. ∠APB의 크기는 ${th}°`),
          explain: `${TAN_WHY} ∠PAB = (180° − ${th}°) ÷ 2 = ${(180 - th) / 2}°이다. ${RIGHT_WHY} ∠PAO = 90°이고 ∠OAB = 90° − ${(180 - th) / 2}° = ${th / 2}°이다.`,
          facts: { calc: [[`90-(180-${th})/2`, 0]], unseen: [90, 180, 2] }
        });
      }),
      T('tan-diam', '지름의 한 끝에서 그은 접선과 현이 이루는 각으로 두 접선이 이루는 각 구하기', '①38', (d) => {
        const x = d.int(28, 40), th = 2 * x, R = 10 * Math.tan(x * RAD), P = tanPts(10, R, { more: ({ O, R: r, be }) => ({ C: at(O, r, be) }) });
        const S = tanScene(P, R, { radii: false }).seg('AB BC OA').right('PBO').ang('OBA', deg(x)).names();
        return degQ(`${TAN_HEAD} ${jo(sg('BC'), '은/는')} 원 O의 지름이고 ∠OBA = ${x}°일 때, ∠APB의 크기는?`, th, {
          figure: S.svg(`${TAN_SAY}선분 BC는 원의 중심 O를 지나는 지름이고, 선분 AB와 반지름 OA가 그어져 있다. B에 직각 표시가 있다. ∠OBA의 크기는 ${x}°`),
          explain: `${RIGHT_WHY} ∠PBO = 90°이고 ∠PBA = 90° − ${x}° = ${90 - x}°이다. ${TAN_WHY} ∠PAB = ∠PBA = ${90 - x}°이고 ∠APB = 180° − 2 × ${90 - x}° = ${th}°이다.`,
          facts: { calc: [[`180-2*(90-${x})`, 0]], unseen: [180, 2, 90] }
        });
      }),
      T('tan-60', '두 접선이 이루는 각이 60°일 때', '①39', (d, n) => {
        // n = 0: 현 AB 의 길이, n = 1: △APB 의 넓이
        const k = d.int(2, 8), t = n === 0 ? d.int(4, 15) : 2 * k, R = t * Math.tan(30 * RAD), P = tanPts(t, R), S = scene(P);
        if (n === 1) S.b.poly([P.P, P.A, P.B], TINT);
        S.ring('O', R).line('PA PB', 0, 16).dot('O').seg('AB').ang('APB', '60°').len('PA', cm(t), 'B').names();
        if (n === 0) return cmQ(`${TAN_HEAD} ${is('PA', t)}, ∠APB = 60°일 때, ${jo(sg('AB'), '의/의')} 길이는?`, t, {
          figure: S.svg(`${TAN_SAY}두 접점을 이은 선분 AB가 그어져 있다. ∠APB의 크기는 60°, 선분 PA의 길이는 ${t} cm`),
          explain: `${TAN_WHY} △PAB에서 ∠PAB = ∠PBA = (180° − 60°) ÷ 2 = 60°이므로 △PAB는 정삼각형이고 ${sg('AB')} = ${sg('PA')} = ${t} cm이다.`,
          facts: { calc: [[`${t}`, 0]] }
        });
        return radQ(`${TAN_HEAD} ${is('PA', t)}, ∠APB = 60°일 때, △APB의 넓이는?`, k * k, 3, 'cm²', {
          figure: S.svg(`${TAN_SAY}두 접점을 이은 선분 AB가 그어져 있다. ∠APB의 크기는 60°, 선분 PA의 길이는 ${t} cm`),
          explain: `${TAN_WHY} 꼭지각이 60°인 이등변삼각형 PAB는 정삼각형이다. 한 변의 길이가 ${t} cm인 정삼각형의 높이는 ${rootOf(`${sq(t)} − ${sq(k)}`)} = ${radText(k, 3)}(cm)이므로 넓이는 ${frac(1, 2)} × ${t} × ${radText(k, 3)} = ${radText(k * k, 3)}(cm²)이다.`,
          facts: { calc: [[`${t}*${t}/4`, 0], ['3', 1]], unseen: [4, 3] }
        });
      }, { count: 2 }),
      T('tan-120', '두 반지름이 이루는 각이 120°일 때 접선과 현의 길이', '①40', (d, n) => {
        // n = 0: 접선 PA, n = 1: 현 AB
        const R = d.int(2, 12), t = R * Math.sqrt(3), P = tanPts(t, R), S = tanScene(P, R).len('OB', cm(R), 'P', { gap: 3 });
        if (n === 0) {
          S.ang('AOB', '120°', { r: 12 }).names();
          return radQ(`${TAN_HEAD} 원 O의 반지름의 길이가 ${R} cm이고 ∠AOB = 120°일 때, ${jo(sg('PA'), '의/의')} 길이는?`, R, 3, 'cm', {
            figure: S.svg(`${TAN_SAY}반지름 OA, OB가 그어져 있고 두 접점에 직각 표시가 있다. ∠AOB의 크기는 120°, 반지름 OB의 길이는 ${R} cm`),
            explain: `선분 OP를 그으면 △PAO ≡ △PBO (RHS 합동)이므로 ∠AOP = 120° ÷ 2 = 60°, ∠APO = 30°이다. 직각삼각형 PAO에서 ${sg('OP')} = 2${sg('OA')} = ${2 * R}(cm)이므로 ${sg('PA')} = ${rootOf(`${sq(2 * R)} − ${sq(R)}`)} = ${radText(R, 3)}(cm)이다.`,
            facts: { calc: [[`${R}`, 0], ['3', 1]], unseen: [3] }
          });
        }
        S.seg('AB').names();
        return radQ(`${TAN_HEAD} 원 O의 반지름의 길이가 ${R} cm이고 ∠AOB = 120°일 때, 두 접점을 이은 ${jo(sg('AB'), '의/의')} 길이는?`, R, 3, 'cm', {
          figure: S.svg(`${TAN_SAY}반지름 OA, OB와 선분 AB가 그어져 있고 두 접점에 직각 표시가 있다. 반지름 OB의 길이는 ${R} cm`),
          explain: `사각형 APBO에서 ∠APB = 360° − (90° + 120° + 90°) = 60°이고 ${eq('PA', 'PB')}이므로 △PAB는 정삼각형이다. 선분 OP를 그으면 ∠AOP = 60°, ∠APO = 30°인 직각삼각형 PAO에서 ${sg('OP')} = ${2 * R} cm, ${sg('PA')} = ${rootOf(`${sq(2 * R)} − ${sq(R)}`)} = ${radText(R, 3)}(cm)이다. 따라서 ${sg('AB')} = ${sg('PA')} = ${radText(R, 3)} cm이다.`,
          facts: { calc: [[`${R}`, 0], ['3', 1]], unseen: [3] }
        });
      }, { count: 2 }),
      T('tan-sector', '두 접선이 이루는 각으로 부채꼴의 넓이 구하기', '①41', (d) => {
        const [R, th] = d.pick([[4, 45], [6, 60], [6, 90], [3, 60], [4, 90], [6, 120], [8, 45], [6, 30], [12, 150], [2, 90], [8, 90], [12, 120], [3, 120], [10, 72], [5, 36]].filter(([u, w]) => w < 85).filter(([u, w]) => Number.isInteger(u * u * (180 - w) / 360))), k = R * R * (180 - th) / 360;
        const P = tanPts(R / Math.tan(th / 2 * RAD), R), S = scene(P);
        S.b.fan(P.O, R * P.k, dirOf(P.O, P.A), dirOf(P.O, P.B) + (dirOf(P.O, P.B) < dirOf(P.O, P.A) ? 360 : 0), TINT);
        S.ring('O', R).line('PA PB', 0, 16).seg('OA OB').right('PAO PBO').dot('O').ang('APB', deg(th)).len('OA', cm(R), 'P', { gap: 3 }).names();
        return piQ(`${TAN_HEAD} ${is('OA', R)}, ∠APB = ${th}°일 때, 색칠한 부채꼴 AOB의 넓이는?`, k, 'cm²', {
          figure: S.svg(`${TAN_SAY}반지름 OA, OB가 그어져 있고 두 접점에 직각 표시가 있다. 부채꼴 AOB가 색칠되어 있다. ∠APB의 크기는 ${th}°, 반지름 OA의 길이는 ${R} cm`),
          explain: `${RIGHT_WHY} 사각형 APBO에서 ∠AOB = 360° − (90° + ${th}° + 90°) = ${180 - th}°이다. 부채꼴 AOB의 넓이는 π × ${sq(R)} × ${frac(180 - th, 360)} = ${k}π(cm²)이다.`,
          facts: { calc: [[`${R}*${R}*(360-90-${th}-90)/360`, 0]], unseen: [360, 90] }
        });
      }),
      T('tan-kite', '두 접선과 두 반지름으로 이루어진 도형의 넓이', '①42', (d, n) => {
        if (n === 0) {
          const [R, t, h] = triple(d, ([a, b, c]) => a < b && a >= 0.35 * b && a <= 0.55 * c && b <= 24), P = tanPts(t, R), S = scene(P);
          S.b.poly([P.A, P.O, P.B, P.P], TINT);
          S.ring('O', R).line('PA PB', 0, 16).seg('OA OB').seg('OP', 'thin').right('PAO PBO').dot('O').len('OA', cm(R), 'P', { gap: 3 }).len('PO', cm(h), 'A', { t: 0.8 }).names();
          return cm2Q(`${TAN_HEAD} ${is('OA', R)}, ${is('OP', h)}일 때, □AOBP의 넓이는?`, R * t, {
            figure: S.svg(`${TAN_SAY}반지름 OA, OB와 선분 OP가 그어져 있고 두 접점에 직각 표시가 있다. 사각형 AOBP가 색칠되어 있다. 반지름 OA의 길이는 ${R} cm, 선분 OP의 길이는 ${h} cm`),
            explain: `${RIGHT_WHY} 직각삼각형 AOP에서 ${sg('AP')} = ${rootOf(`${sq(h)} − ${sq(R)}`)} = ${t}(cm)이다. △AOP ≡ △BOP (RHS 합동)이므로 □AOBP의 넓이는 2 × (${frac(1, 2)} × ${t} × ${R}) = ${R * t}(cm²)이다.`,
            facts: { calc: [[`${R}*(${h}*${h}-${R}*${R})**0.5`, 0]] }
          });
        }
        const [h, t] = d.until(() => [d.int(6, 16), d.int(4, 14)], ([a, b]) => { const v = a * a - b * b; if (b >= a || isSq(v)) return false; const [s] = split(v); return v > 0 && Math.sqrt(v) >= 0.35 * b && Math.sqrt(v) <= 0.95 * b && s >= 2 && (b * s) % 2 === 0; }), v = h * h - t * t, [s, m] = split(v), R = Math.sqrt(v);
        const P = tanPts(t, R), S = scene(P);
        S.b.poly([P.O, P.B, P.P], TINT);
        S.ring('O', R).line('PA PB', 0, 16).seg('OA OB').seg('OP', 'thin').right('PAO PBO').dot('O').len('PA', cm(t), 'O').len('PO', cm(h), 'A', { t: 0.78 }).names();
        return radQ(`${TAN_HEAD} ${is('OP', h)}, ${is('AP', t)}일 때, △OBP의 넓이는?`, t * s / 2, m, 'cm²', {
          figure: S.svg(`${TAN_SAY}반지름 OA, OB와 선분 OP가 그어져 있고 두 접점에 직각 표시가 있다. 삼각형 OBP가 색칠되어 있다. 선분 OP의 길이는 ${h} cm, 선분 PA의 길이는 ${t} cm`),
          explain: `${TAN_WHY} 따라서 ${sg('PB')} = ${t} cm이다. ${RIGHT_WHY} 직각삼각형 OBP에서 ${sg('OB')} = ${rootOf(`${sq(h)} − ${sq(t)}`)} = ${radText(s, m)}(cm)이므로 △OBP의 넓이는 ${frac(1, 2)} × ${t} × ${radText(s, m)} = ${radText(t * s / 2, m)}(cm²)이다.`,
          facts: { calc: [[`${t}*((${h}*${h}-${t}*${t})/${m})**0.5/2`, 0], [`${m}`, 1]], unseen: [m, 2] }
        });
      }, { count: 2 }),
      T('tan-perim', '세 접선으로 둘러싸인 삼각형의 둘레', '①43', (d, n) => {
        // n = 0: 반지름과 OP 로, n = 1: 반지름과 ∠APB = 60° 로
        const [R, t, h] = n === 0 ? triple(d, ([a, b, c]) => a < b && a >= 0.35 * b && a <= 0.55 * c && b <= 24) : (() => { const r = d.int(2, 12); return [r, r * Math.sqrt(3), 2 * r]; })();
        const dl = d.pick([-14, -8, 8, 14]), P = tanPts(t, R, { more: ({ O, R: r }) => { const E = at(O, r, 180 + dl), u = at(E, 10, 180 + dl + 90); return { E, u }; } });
        P.C = meet(P.E, P.u, P.P, P.A); P.D = meet(P.E, P.u, P.P, P.B); delete P.u;
        const S = scene(P); S.b.poly([P.P, P.C, P.D], TINT);
        S.ring('O', R).line('PA PB', 0, 16).seg('CD OA OB OE').right('PAO PBO OEC').dot('O');
        if (n === 0) {
          S.seg('OP', 'thin').len('OA', cm(R), 'P', { gap: 3 }).names({ E: [180 + dl, 11] });
          return cmQ(`${TAN_HEAD} ${jo(sg('CD'), '은/는')} 점 E에서 원 O에 접한다. ${is('OA', R)}, ${is('OP', h)}일 때, △PCD의 둘레의 길이는?`, 2 * t, {
            figure: S.svg(`${TAN_SAY}선분 CD가 점 E에서 원 O에 접하고, 점 C는 선분 PA 위에, 점 D는 선분 PB 위에 있다. 삼각형 PCD가 색칠되어 있다. 반지름 OA, OB, OE와 선분 OP가 그어져 있다. 반지름 OA의 길이는 ${R} cm, 선분 OP의 길이는 ${h} cm`),
            explain: `직각삼각형 OAP에서 ${sg('PA')} = ${rootOf(`${sq(h)} − ${sq(R)}`)} = ${t}(cm)이다. 원 밖의 한 점에서 그은 두 접선의 길이는 같으므로 ${eq('CE', 'CA')}, ${eq('DE', 'DB')}, ${eq('PA', 'PB')}이다. △PCD의 둘레의 길이는 ${sg('PC')} + ${sg('CE')} + ${sg('ED')} + ${sg('DP')} = ${sg('PC')} + ${sg('CA')} + ${sg('BD')} + ${sg('DP')} = ${sg('PA')} + ${sg('PB')} = 2 × ${t} = ${2 * t}(cm)이다.`,
            facts: { calc: [[`2*(${h}*${h}-${R}*${R})**0.5`, 0]], unseen: [2] }
          });
        }
        S.ang('APB', '60°').len('OA', cm(R), 'P', { gap: 3 }).names({ E: [180 + dl, 11] });
        return radQ(`${TAN_HEAD} ${jo(sg('CD'), '은/는')} 점 E에서 원 O에 접한다. ${is('OE', R)}, ∠APB = 60°일 때, △PCD의 둘레의 길이는?`, 2 * R, 3, 'cm', {
          figure: S.svg(`${TAN_SAY}선분 CD가 점 E에서 원 O에 접하고, 점 C는 선분 PA 위에, 점 D는 선분 PB 위에 있다. 삼각형 PCD가 색칠되어 있다. 반지름 OA, OB, OE가 그어져 있다. ∠APB의 크기는 60°, 반지름의 길이는 ${R} cm`),
          explain: `선분 OP를 그으면 △PAO ≡ △PBO (RHS 합동)이므로 ∠APO = 30°이고 직각삼각형 PAO에서 ${sg('OP')} = 2 × ${R} = ${2 * R}(cm), ${sg('PA')} = ${rootOf(`${sq(2 * R)} − ${sq(R)}`)} = ${radText(R, 3)}(cm)이다. ${eq('CE', 'CA')}, ${eq('DE', 'DB')}이므로 △PCD의 둘레의 길이는 ${sg('PA')} + ${sg('PB')} = 2${sg('PA')} = ${radText(2 * R, 3)}(cm)이다.`,
          facts: { calc: [[`2*${R}`, 0], ['3', 1]], unseen: [2, 3] }
        });
      }, { count: 2 }),
      T('tan-excircle', '삼각형의 한 변과 두 변의 연장선에 접하는 원', '①44', (d) => {
        const [a, b, c] = d.until(() => [d.int(5, 12), d.int(5, 12), d.int(5, 12)], ([x, y, z]) => (x + y + z) % 2 === 0 && x < y + z && y < x + z && z < x + y && new Set([x, y, z]).size === 3 && (x + y - z) / 2 >= 2 && (x + z - y) / 2 >= 2 && x <= 0.85 * Math.max(y, z));
        const s = (a + b + c) / 2, T0 = sssTri(a, b, c), w = -a + b + c, Ia = [(-a * T0.A[0] + b * T0.B[0] + c * T0.C[0]) / w, (-a * T0.A[1] + b * T0.B[1] + c * T0.C[1]) / w];
        const P0 = { A: T0.A, B: T0.B, C: T0.C, O: Ia, D: foot(Ia, T0.A, T0.B), E: foot(Ia, T0.B, T0.C), F: foot(Ia, T0.A, T0.C) }, ra = dist(Ia, P0.E), P = fitPts(P0, [200, 200], [[Ia, ra]]);
        const S = scene(P).ring('O', ra).seg('BC').line('AD AF', 0, 14).seg('OD OE OF', 'thin').right('ODA OEC OFA').dot('O').names({ E: [90, 11] });
        return cmQ(`다음 그림에서 원 O는 △ABC의 변 BC에 점 E에서 접하고, 두 변 AB, AC의 연장선에 각각 점 D, F에서 접한다. ${is('AB', c)}, ${is('BC', a)}, ${is('CA', b)}일 때, ${jo(sg('BE'), '의/의')} 길이는?`, s - c, {
          figure: S.svg(`삼각형 ABC와 원 O. 원 O는 변 BC에 점 E에서 접하고, 변 AB의 연장선에 점 D에서, 변 AC의 연장선에 점 F에서 접한다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `원 밖의 한 점에서 그은 두 접선의 길이는 같으므로 ${eq('AD', 'AF')}, ${eq('BD', 'BE')}, ${eq('CF', 'CE')}이다. ${sg('BE')} = ${X} cm라 하면 ${sg('CE')} = (${a} − ${X}) cm이고 ${sg('AD')} = ${c} + ${X}, ${sg('AF')} = ${b} + (${a} − ${X})이다. ${c} + ${X} = ${b} + ${a} − ${X}에서 ${X} = ${s - c}이다.`,
          facts: { calc: [[`(${a}+${b}-${c})/2`, 0]], unseen: [2] }
        });
      })
    ]
  });

  B.addGroup(UNIT, {
    id: 'incircle', title: '삼각형의 내접원과 접선의 길이', standard: K.STD,
    types: [
      T('in-two', '두 변과 접점까지의 길이로 나머지 접점까지의 길이 구하기', '①45', (d) => {
        const [p, q, s] = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(2, 9)], (w) => new Set(w).size === 3 && Math.max(...w) <= 2.5 * Math.min(...w));
        const P = inTri(p, q, s), S = inScene(P).names();
        return cmQ(`${IN_HEAD} ${is('AB', p + q)}, ${is('BE', q)}, ${is('AC', p + s)}일 때, ${jo(sg('CE'), '의/의')} 길이는?`, s, {
          figure: S.svg(`${IN_SAY}변 AB의 길이는 ${p + q} cm, 선분 BE의 길이는 ${q} cm, 변 AC의 길이는 ${p + s} cm`),
          explain: `원 밖의 한 점에서 그은 두 접선의 길이는 같으므로 ${sg('BD')} = ${sg('BE')} = ${q} cm이고 ${sg('AF')} = ${sg('AD')} = ${p + q} − ${q} = ${p}(cm)이다. 따라서 ${sg('CE')} = ${sg('CF')} = ${p + s} − ${p} = ${s}(cm)이다.`,
          facts: { calc: [[`${p + s}-(${p + q}-${q})`, 0]] }
        });
      }),
      T('in-right-r', '직각삼각형의 내접원의 반지름', '①47', (d) => {
        const [a, b, c] = triple(d, ([x, y]) => x !== y && x <= 24 && y <= 24 && Math.max(x, y) <= 2.6 * Math.min(x, y)), r = (a + b - c) / 2, P = rightIn(a, b), S = scene(P).ring('O', r).poly('ABC').seg('OE OF', 'thin').right('BCA OEB OFA').dot('O').names();
        return cmQ(`다음 그림에서 △ABC는 ∠C = 90°인 직각삼각형이고 원 O는 △ABC의 내접원이다. ${is('BC', a)}, ${is('AC', b)}일 때, 원 O의 반지름의 길이는?`, r, {
          figure: S.svg(`직각삼각형 ABC와 그 내접원 O. ∠C에 직각 표시가 있다. 내접원이 세 변 AB, BC, CA에 접하는 점이 각각 D, E, F이고 반지름 OE, OF가 그어져 있다. 변 BC의 길이는 ${a} cm, 변 AC의 길이는 ${b} cm`),
          explain: `${sg('AB')} = ${rootOf(`${sq(a)} + ${sq(b)}`)} = ${c}(cm)이다. ∠OEC = ∠OFC = ∠C = 90°이고 ${eq('OE', 'OF')}이므로 □OECF는 정사각형이다. 반지름의 길이를 ${R_} cm라 하면 ${sg('BD')} = ${sg('BE')} = (${a} − ${R_}) cm, ${sg('AD')} = ${sg('AF')} = (${b} − ${R_}) cm이고 ${sg('AB')} = (${a} − ${R_}) + (${b} − ${R_}) = ${c}이므로 ${R_} = ${r}이다.`,
          facts: { calc: [[`(${a}+${b}-(${a}*${a}+${b}*${b})**0.5)/2`, 0]], unseen: [2] }
        });
      }),
      T('in-right-leg', '직각삼각형의 내접원의 반지름과 한 변으로 다른 변 구하기', '①48·50', (d) => {
        const [a, b, c] = triple(d, ([x, y]) => x !== y && x <= 24 && y <= 24 && Math.max(x, y) <= 2.6 * Math.min(x, y)), r = (a + b - c) / 2, P = rightIn(a, b), S = scene(P).ring('O', r).poly('ABC').seg('OE OF', 'thin').right('BCA OEB OFA').dot('O').len('AC', cm(b), 'B', { t: (b - r) / b < 0.5 ? 0.76 : 0.24 }).names();
        const x = a - r;
        return cmQ(`다음 그림에서 원 O는 ∠C = 90°인 직각삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. 원 O의 반지름의 길이가 ${r} cm이고 ${is('AC', b)}일 때, ${jo(sg('BC'), '의/의')} 길이는?`, a, {
          figure: S.svg(`직각삼각형 ABC와 그 내접원 O. ∠C에 직각 표시가 있다. 내접원이 세 변 AB, BC, CA에 접하는 점이 각각 D, E, F이고 반지름 OE, OF가 그어져 있다. 변 AC의 길이는 ${b} cm`),
          explain: `□OECF는 한 변의 길이가 ${r} cm인 정사각형이므로 ${sg('CE')} = ${sg('CF')} = ${r} cm이고 ${sg('AD')} = ${sg('AF')} = ${b} − ${r} = ${b - r}(cm)이다. ${sg('BD')} = ${sg('BE')} = ${X} cm라 하면 ${sg('AB')} = (${b - r} + ${X}) cm, ${sg('BC')} = (${X} + ${r}) cm이고, (${X} + ${r})${sup2} + ${sq(b)} = (${X} + ${b - r})${sup2}에서 ${X} = ${x}이다. 따라서 ${sg('BC')} = ${x} + ${r} = ${a}(cm)이다.`,
          facts: { calc: [[`${b}*${r}/(${b}-2*${r})+${r}`, 0]], unseen: [2] }
        });
      }),
      T('in-right-split', '빗변이 접점에서 나뉜 두 길이로 내접원의 반지름 구하기', '①49', (d) => {
        const [p, q, c] = triple(d, ([x, y]) => x !== y && x <= 24 && y <= 24 && Math.max(x, y) <= 2.6 * Math.min(x, y)), r = (p + q - c) / 2, m = p - r, n = q - r;
        const P = inTri(r, m, n), S = inScene(P, { radii: true }).right('BAC').names();
        return cmQ(`다음 그림에서 원 O는 ∠A = 90°인 직각삼각형 ABC의 내접원이고 세 점 D, E, F는 접점이다. ${is('BE', m)}, ${is('CE', n)}일 때, 원 O의 반지름의 길이는?`, r, {
          figure: S.svg(`직각삼각형 ABC와 그 내접원 O. ∠A에 직각 표시가 있다. 내접원이 세 변 AB, BC, CA에 접하는 점이 각각 D, E, F이고 반지름 OD, OE, OF가 그어져 있다. 선분 BE의 길이는 ${m} cm, 선분 CE의 길이는 ${n} cm`),
          explain: `□ADOF는 정사각형이므로 반지름의 길이를 ${R_} cm라 하면 ${sg('AD')} = ${sg('AF')} = ${R_} cm이다. ${sg('BD')} = ${sg('BE')} = ${m} cm, ${sg('CF')} = ${sg('CE')} = ${n} cm이므로 (${R_} + ${m})${sup2} + (${R_} + ${n})${sup2} = ${sq(m + n)}, ${R_}${sup2} + ${m + n}${R_} − ${m * n} = 0이다. ${R_} &gt; 0이므로 ${R_} = ${r}이다.`,
          facts: { calc: [[`(-(${m}+${n})+((${m}+${n})*(${m}+${n})+4*${m}*${n})**0.5)/2`, 0]], unseen: [4, 2] }
        });
      }),
      T('in-ag', '꼭짓점과 내접원의 중심을 잇는 선분이 원과 만나는 점까지의 길이', '①52', (d) => {
        const [p, r, h, q] = d.until(() => { const [x, y, z] = triple(d, ([u, v]) => v < u && v >= 0.45 * u && u <= 16); return [x, y, z, d.int(3, 14)]; }, ([x, y, , w]) => { if (x * w <= y * y) return false; const s = y * y * (x + w) / (x * w - y * y); return s >= 0.6 * Math.min(x, w) && s <= 2.2 * Math.max(x, w); });
        const s = r * r * (p + q) / (p * q - r * r), P = inTri(p, q, s, { more: (T0, O) => ({ G: along(O, T0.A, r) }) });
        const S = inScene(P).seg('AO').seg('OD', 'thin').right('ODA').dot('G').names({ G: [dirOf(P.O, P.G) + 55, 15] });
        return cmQ(`${IN_HEAD} 선분 AO가 원 O와 만나는 점을 G라 하자. ${is('AB', p + q)}, ${is('BE', q)}이고 원 O의 반지름의 길이가 ${r} cm일 때, ${jo(sg('AG'), '의/의')} 길이는?`, h - r, {
          figure: S.svg(`${IN_SAY}선분 AO가 원과 만나는 점이 G이고, 반지름 OD가 그어져 있으며 D에 직각 표시가 있다. 변 AB의 길이는 ${p + q} cm, 선분 BE의 길이는 ${q} cm`),
          explain: `${sg('BD')} = ${sg('BE')} = ${q} cm이므로 ${sg('AD')} = ${p + q} − ${q} = ${p}(cm)이다. 직각삼각형 ADO에서 ${sg('AO')} = ${rootOf(`${sq(p)} + ${sq(r)}`)} = ${h}(cm)이고 ${sg('OG')} = ${r} cm이므로 ${sg('AG')} = ${h} − ${r} = ${h - r}(cm)이다.`,
          facts: { calc: [[`((${p + q}-${q})*(${p + q}-${q})+${r}*${r})**0.5-${r}`, 0]] }
        });
      })
    ]
  });

  B.addGroup(UNIT, {
    id: 'quad', title: '원에 외접하는 사각형', standard: K.STD,
    types: [
      T('quad-sum', '두 쌍의 대변의 길이의 합으로 한 변 구하기', '①54', (d) => {
        const t = quadT(d), { P } = quadPts(t), [ab, bc, cd, da] = [t[0] + t[1], t[1] + t[2], t[2] + t[3], t[3] + t[0]];
        const S = scene(P).ring('O', P.r).poly('ABCD').dot('O').len('AB', cm(ab), 'O').len('BC', cm(bc), 'O').len('DA', cm(da), 'O').names({ E: null, F: null, G: null, H: null });
        return cmQ(`다음 그림에서 □ABCD가 원 O에 외접한다. ${is('AB', ab)}, ${is('BC', bc)}, ${is('AD', da)}일 때, ${jo(sg('CD'), '의/의')} 길이는?`, cd, {
          figure: S.svg(`${QUAD_SAY}변 AB의 길이는 ${ab} cm, 변 BC의 길이는 ${bc} cm, 변 AD의 길이는 ${da} cm`),
          explain: `${QUAD_WHY} ${sg('AB')} + ${sg('CD')} = ${sg('AD')} + ${sg('BC')}이므로 ${sg('CD')} = ${da} + ${bc} − ${ab} = ${cd}(cm)이다.`,
          facts: { calc: [[`${da}+${bc}-${ab}`, 0]] }
        });
      }),
      T('quad-piece', '접점까지의 길이가 섞인 변의 길이 구하기', '①55', (d) => {
        const t = quadT(d), { P } = quadPts(t), [ab, bc, cd, da] = [t[0] + t[1], t[1] + t[2], t[2] + t[3], t[3] + t[0]];
        const S = scene(P).ring('O', P.r).poly('ABCD').dot('O').dot('EFGH').len('BF', cm(t[1]), 'O', { gap: 3 }); sideLen(S, 'AB', 'E', cm(ab)); sideLen(S, 'CD', 'G', cm(cd)); sideLen(S, 'DA', 'H', cm(da)); S.names();
        return cmQ(`다음 그림에서 □ABCD가 원 O에 외접하고 네 점 E, F, G, H는 접점이다. ${is('AB', ab)}, ${is('BF', t[1])}, ${is('CD', cd)}, ${is('AD', da)}일 때, ${jo(sg('CF'), '의/의')} 길이는?`, t[2], {
          figure: S.svg(`${QUAD_SAY}원이 변 AB, BC, CD, DA에 접하는 점이 각각 E, F, G, H이다. 변 AB의 길이는 ${ab} cm, 선분 BF의 길이는 ${t[1]} cm, 변 CD의 길이는 ${cd} cm, 변 AD의 길이는 ${da} cm`),
          explain: `${QUAD_WHY} ${sg('AD')} + ${sg('BC')} = ${sg('AB')} + ${sg('CD')}에서 ${sg('BC')} = ${ab} + ${cd} − ${da} = ${bc}(cm)이다. 따라서 ${sg('CF')} = ${bc} − ${t[1]} = ${t[2]}(cm)이다.`,
          facts: { calc: [[`${ab}+${cd}-${da}-${t[1]}`, 0]] }
        });
      }),
      T('quad-perim', '한 쌍의 대변의 길이로 둘레 구하기', '①56', (d) => {
        const t = quadT(d), { P } = quadPts(t), ab = t[0] + t[1], cd = t[2] + t[3];
        const S = scene(P).ring('O', P.r).poly('ABCD').dot('O').len('AB', cm(ab), 'O').len('CD', cm(cd), 'O').names({ E: null, F: null, G: null, H: null });
        return cmQ(`다음 그림에서 □ABCD가 원 O에 외접하고 ${is('AB', ab)}, ${is('CD', cd)}일 때, □ABCD의 둘레의 길이는?`, 2 * (ab + cd), {
          figure: S.svg(`${QUAD_SAY}변 AB의 길이는 ${ab} cm, 변 CD의 길이는 ${cd} cm`),
          explain: `${QUAD_WHY} ${sg('AD')} + ${sg('BC')} = ${sg('AB')} + ${sg('CD')} = ${ab + cd}(cm)이므로 둘레의 길이는 2 × ${ab + cd} = ${2 * (ab + cd)}(cm)이다.`,
          facts: { calc: [[`2*(${ab}+${cd})`, 0]], unseen: [2] }
        });
      }),
      T('quad-perim-pieces', '꼭짓점에서 접점까지의 길이로 둘레 구하기', '①57', (d) => {
        const t = quadT(d), { P } = quadPts(t), da = t[3] + t[0];
        const S = scene(P).ring('O', P.r).poly('ABCD').dot('O').dot('EFGH').len('BF', cm(t[1]), 'O', { gap: 3 }).len('CG', cm(t[2]), 'O', { gap: 3 }); sideLen(S, 'DA', 'H', cm(da)); S.names();
        return cmQ(`다음 그림에서 □ABCD가 원 O에 외접하고 네 점 E, F, G, H는 접점이다. ${is('AD', da)}, ${is('BF', t[1])}, ${is('CG', t[2])}일 때, □ABCD의 둘레의 길이는?`, 2 * (da + t[1] + t[2]), {
          figure: S.svg(`${QUAD_SAY}원이 변 AB, BC, CD, DA에 접하는 점이 각각 E, F, G, H이다. 변 AD의 길이는 ${da} cm, 선분 BF의 길이는 ${t[1]} cm, 선분 CG의 길이는 ${t[2]} cm`),
          explain: `${eq('CF', 'CG')} = ${t[2]} cm이므로 ${sg('BC')} = ${t[1]} + ${t[2]} = ${t[1] + t[2]}(cm)이다. ${QUAD_WHY} 둘레의 길이는 2 × (${sg('AD')} + ${sg('BC')}) = 2 × (${da} + ${t[1] + t[2]}) = ${2 * (da + t[1] + t[2])}(cm)이다.`,
          facts: { calc: [[`2*(${da}+${t[1]}+${t[2]})`, 0]], unseen: [2] }
        });
      }),
      T('quad-xy', '접점으로 나뉜 두 조각의 길이', '①58', (d) => {
        const t = quadT(d, (w) => w[0] !== w[1] && w[0] !== w[3]), { P } = quadPts(t), ab = t[0] + t[1], cd = t[2] + t[3];
        const S = scene(P).ring('O', P.r).poly('ABCD').dot('O').dot('EFGH').len('BF', cm(t[1]), 'O', { gap: 3 }).len('FC', cm(t[2]), 'O', { gap: 3 }); sideLen(S, 'AB', 'E', cm(ab)); sideLen(S, 'CD', 'G', cm(cd)); S.names();
        return M(`다음 그림에서 □ABCD가 원 O에 외접하고 네 점 E, F, G, H는 접점이다. ${is('AB', ab)}, ${is('BF', t[1])}, ${is('FC', t[2])}, ${is('CD', cd)}이고 ${nb(`${sg('AE')} = ${X} cm`)}, ${nb(`${sg('AD')} = ${Y} cm`)}일 때, ${X}, ${Y}의 값을 차례로 구하시오.`, [{ label: X, answer: t[0] }, { label: Y, answer: t[0] + t[3] }], {
          figure: S.svg(`${QUAD_SAY}원이 변 AB, BC, CD, DA에 접하는 점이 각각 E, F, G, H이다. 변 AB의 길이는 ${ab} cm, 선분 BF의 길이는 ${t[1]} cm, 선분 FC의 길이는 ${t[2]} cm, 변 CD의 길이는 ${cd} cm`),
          explain: `원 밖의 한 점에서 그은 두 접선의 길이는 같으므로 ${sg('BE')} = ${sg('BF')} = ${t[1]} cm이고 ${X} = ${ab} − ${t[1]} = ${t[0]}이다. ${sg('CG')} = ${sg('CF')} = ${t[2]} cm이므로 ${sg('DG')} = ${cd} − ${t[2]} = ${t[3]}(cm)이고, ${Y} = ${sg('AH')} + ${sg('HD')} = ${sg('AE')} + ${sg('DG')} = ${t[0]} + ${t[3]} = ${t[0] + t[3]}이다.`,
          shown: `${X} = ${t[0]}, ${Y} = ${t[0] + t[3]}`,
          facts: { calc: [[`${ab}-${t[1]}`, 0], [`${ab}-${t[1]}+${cd}-${t[2]}`, 1]] }
        });
      }),
      T('quad-iso-side', '원에 외접하는 등변사다리꼴의 옆변', '①59', (d) => {
        const [a, b] = d.until(() => [d.int(2, 12), d.int(4, 20)], ([x, y]) => x < y && (x + y) % 2 === 0 && x >= 0.25 * y), hh = Math.sqrt(a * b), O = [0, -hh / 2];
        const P = fitPts({ A: [-a / 2, -hh], D: [a / 2, -hh], B: [-b / 2, 0], C: [b / 2, 0], O }, [200, 150], [[O, hh / 2]]), S = scene(P).ring('O', hh / 2).poly('ABCD').dot('O').tick('AB DC', 1).len('AD', cm(a), 'O').len('BC', cm(b), 'O').names();
        return cmQ(`다음 그림에서 ${eq('AB', 'DC')}인 등변사다리꼴 ABCD가 원 O에 외접한다. ${is('AD', a)}, ${is('BC', b)}일 때, ${jo(sg('AB'), '의/의')} 길이는?`, (a + b) / 2, {
          figure: S.svg(`원 O에 외접하는 등변사다리꼴 ABCD. 윗변 AD와 아랫변 BC가 평행하고 두 옆변 AB, DC에 길이가 같다는 표시가 있다. 변 AD의 길이는 ${a} cm, 변 BC의 길이는 ${b} cm`),
          explain: `${QUAD_WHY} ${sg('AB')} + ${sg('DC')} = ${sg('AD')} + ${sg('BC')} = ${a + b}(cm)이고 ${eq('AB', 'DC')}이므로 ${sg('AB')} = ${a + b} ÷ 2 = ${(a + b) / 2}(cm)이다.`,
          facts: { calc: [[`(${a}+${b})/2`, 0]], unseen: [2] }
        });
      }),
      T('quad-iso-circle', '원에 외접하는 등변사다리꼴로 원의 넓이 구하기', '①60', (d) => {
        const [a, b] = d.pick([[4, 16], [4, 9], [3, 12], [8, 18], [6, 24], [9, 16], [4, 25], [8, 32], [12, 27], [6, 6 * 4], [5, 20], [10, 40]].filter(([x, y]) => (x + y) % 2 === 0)), hh = Math.sqrt(a * b), r = hh / 2, O = [0, -r];
        const P = fitPts({ A: [-a / 2, -hh], D: [a / 2, -hh], B: [-b / 2, 0], C: [b / 2, 0], O }, [200, 150], [[O, r]]), S = scene(P).ring('O', r).poly('ABCD').dot('O').tick('AB DC', 1).len('AD', cm(a), 'O').len('BC', cm(b), 'O').names();
        return piQ(`다음 그림에서 ${eq('AB', 'DC')}인 등변사다리꼴 ABCD가 원 O에 외접한다. ${is('AD', a)}, ${is('BC', b)}일 때, 원 O의 넓이는?`, r * r, 'cm²', {
          figure: S.svg(`원 O에 외접하는 등변사다리꼴 ABCD. 윗변 AD와 아랫변 BC가 평행하고 두 옆변 AB, DC에 길이가 같다는 표시가 있다. 변 AD의 길이는 ${a} cm, 변 BC의 길이는 ${b} cm`),
          explain: `${sg('AB')} + ${sg('DC')} = ${sg('AD')} + ${sg('BC')} = ${a + b}(cm)이므로 ${sg('AB')} = ${(a + b) / 2} cm이다. 점 A에서 변 BC에 내린 수선의 발을 E라 하면 ${sg('BE')} = (${b} − ${a}) ÷ 2 = ${(b - a) / 2}(cm)이고, 높이 ${sg('AE')} = ${rootOf(`${sq((a + b) / 2)} − ${sq((b - a) / 2)}`)} = ${hh}(cm)이다. 높이는 원의 지름과 같으므로 반지름의 길이는 ${r} cm이고 넓이는 ${r * r}π cm²이다.`,
          facts: { calc: [[`(((${a}+${b})/2)*((${a}+${b})/2)-((${b}-${a})/2)*((${b}-${a})/2))/4`, 0]], unseen: [2, 4] }
        });
      }),
      T('quad-right-trap', '원에 외접하는 직각사다리꼴의 옆변', '①61', (d) => {
        const [a, b] = d.until(() => [d.int(2, 15), d.int(4, 30)], ([x, y]) => x < y && Number.isInteger(x * y / (x + y)) && x >= 0.3 * y), r = a * b / (a + b), O = [-r, -r];
        const P = fitPts({ D: [0, -2 * r], C: [0, 0], A: [-a, -2 * r], B: [-b, 0], O }, [200, 150], [[O, r]]), S = scene(P).ring('O', r).poly('ABCD').dot('O').right('BCD CDA').len('BC', cm(b), 'O').len('CD', cm(2 * r), 'O').names();
        const ab = a + b - 2 * r;
        return cmQ(`다음 그림에서 □ABCD는 원 O에 외접하고 ∠C = ∠D = 90°이다. ${is('BC', b)}, ${is('CD', 2 * r)}일 때, ${jo(sg('AB'), '의/의')} 길이는?`, ab, {
          figure: S.svg(`원 O에 외접하는 사각형 ABCD. ∠C와 ∠D에 직각 표시가 있다. 변 BC의 길이는 ${b} cm, 변 CD의 길이는 ${2 * r} cm`),
          explain: `${sg('AB')} = ${X} cm라 하면 ${sg('AD')} + ${b} = ${X} + ${2 * r}에서 ${sg('AD')} = (${X} − ${b - 2 * r}) cm이다. 점 A에서 변 BC에 내린 수선의 발을 H라 하면 ${sg('AH')} = ${2 * r} cm, ${sg('BH')} = ${b} − (${X} − ${b - 2 * r}) = (${2 * b - 2 * r} − ${X}) cm이고, 직각삼각형 ABH에서 ${X}${sup2} = (${2 * b - 2 * r} − ${X})${sup2} + ${sq(2 * r)}이므로 ${X} = ${ab}이다.`,
          facts: { calc: [[`((2*${b}-${2 * r})*(2*${b}-${2 * r})+${2 * r}*${2 * r})/(2*(2*${b}-${2 * r}))`, 0]], unseen: [2] }
        });
      }),
      T('quad-diag', '한 각이 직각인 외접사각형에서 대각선으로 변 구하기', '①62', (d) => {
        const [ab, bc, ac, da] = d.until(() => { const [x, y, z] = triple(d, ([u, v]) => u <= 16 && v <= 16 && u !== v); return [x, y, z, d.int(3, 14)]; }, ([x, y, z, w]) => { const c4 = w + y - x; if (c4 < 2 || w === c4 || w + c4 <= z + 1 || Math.abs(w - c4) >= z - 1) return false; const xA = (w * w - c4 * c4 + z * z) / (2 * z); return xA > 0.15 * z && xA < 0.85 * z; });
        const cdv = da + bc - ab, Bp = [0, 0], Ap = [0, -ab], Cp = [bc, 0], L = ac, xA = (da * da - cdv * cdv + L * L) / (2 * L), yA = Math.sqrt(Math.max(da * da - xA * xA, 0)), u = [(Cp[0] - Ap[0]) / L, (Cp[1] - Ap[1]) / L], nrm = [u[1], -u[0]];
        const Dp = [Ap[0] + u[0] * xA + nrm[0] * yA, Ap[1] + u[1] * xA + nrm[1] * yA], area = Math.abs((ab * bc) / 2) + Math.abs(((Cp[0] - Ap[0]) * (Dp[1] - Ap[1]) - (Cp[1] - Ap[1]) * (Dp[0] - Ap[0])) / 2), r = area / ((ab + bc + cdv + da) / 2), O = [r, -r];
        const P = fitPts({ A: Ap, B: Bp, C: Cp, D: Dp, O }, [200, 160], [[O, r]]), S = scene(P).ring('O', r).poly('ABCD').seg('AC', 'thin').dot('O').right('CBA').len('AD', cm(da), 'C').len('BC', cm(bc), 'O').names({ O: [225, 12] });
        return cmQ(`다음 그림에서 □ABCD는 원 O에 외접하고 ∠ABC = 90°이다. ${is('AD', da)}, ${is('BC', bc)}, ${is('AC', ac)}일 때, ${jo(sg('CD'), '의/의')} 길이는?`, cdv, {
          figure: S.svg(`원 O에 외접하는 사각형 ABCD와 대각선 AC. ∠B에 직각 표시가 있다. 변 AD의 길이는 ${da} cm, 변 BC의 길이는 ${bc} cm`),
          explain: `직각삼각형 ABC에서 ${sg('AB')} = ${rootOf(`${sq(ac)} − ${sq(bc)}`)} = ${ab}(cm)이다. ${QUAD_WHY} ${sg('AB')} + ${sg('CD')} = ${sg('AD')} + ${sg('BC')}이므로 ${sg('CD')} = ${da} + ${bc} − ${ab} = ${cdv}(cm)이다.`,
          facts: { calc: [[`${da}+${bc}-(${ac}*${ac}-${bc}*${bc})**0.5`, 0]] }
        });
      })
    ]
  });

  B.addGroup(UNIT, {
    id: 'semi', title: '지름의 양 끝 접선과 직사각형 안의 원', standard: K.STD,
    types: [
      T('semi-cod', '지름의 양 끝 접선과 셋째 접선이 이루는 각', '①63', (d) => {
        const x = d.until(() => d.int(28, 62), (v) => Math.abs(v - 45) >= 4), r = 10, O = [0, 0], A = [-r, 0], Bp = [r, 0], Cp = [-r, -r / Math.tan(x * RAD)], Dp = [r, -r * Math.tan(x * RAD)], Pp = (() => { const f = foot(A, O, Cp); return [2 * f[0] - A[0], 2 * f[1] - A[1]]; })();
        const P = fitPts({ A, B: Bp, C: Cp, D: Dp, O, P: Pp }, [190, 190], [[O, r]]), S = scene(P).ring('O', r).seg('AB CD OC OD').line('AC BD', 0, 14).right('BAC ABD').dot('O').ang('ACO', deg(x)).names({ O: 270 });
        return degQ(`다음 그림에서 ${jo(sg('AB'), '은/는')} 원 O의 지름이고, 두 점 C, D는 지름의 양 끝 점 A, B에서 그은 접선이 원 O 위의 점 P에서 그은 접선과 만나는 점이다. ∠ACO = ${x}°일 때, ∠ODB의 크기는?`, 90 - x, {
          figure: S.svg(`원 O의 지름 AB. 점 A, B에서 그은 접선이 점 P에서 그은 접선과 각각 점 C, D에서 만난다. 선분 OC, OD가 그어져 있고 A, B에 직각 표시가 있다. ∠ACO의 크기는 ${x}°`),
          explain: `△OAC ≡ △OPC, △OBD ≡ △OPD (RHS 합동)이므로 ∠AOC = ∠POC, ∠BOD = ∠POD이고 ∠COD = 180° ÷ 2 = 90°이다. 또 ∠OCP = ∠ACO = ${x}°, ∠ODC = ∠ODB이다. △OCD에서 ∠ODC = 180° − (90° + ${x}°) = ${90 - x}°이므로 ∠ODB = ${90 - x}°이다.`,
          facts: { calc: [[`180-90-${x}`, 0]], unseen: [180, 90] }
        });
      }),
      T('semi-diam', '지름의 양 끝 접선의 길이로 지름 구하기', '①64', (d) => {
        const [a, b] = d.until(() => [d.int(2, 14), d.int(2, 14)], ([x, y]) => y < x && y >= 0.3 * x && !isSq(x * y)), v = a * b, [s, m] = split(v);
        const P = semiPts(a, b), S = semiScene(P).right('BAD ABC').len('DA', cm(a), 'B').len('BC', cm(b), 'A').names({ O: 270 });
        return radQ(`다음 그림에서 ${jo(sg('AB'), '은/는')} 반원 O의 지름이고 ${sg('AD')}, ${sg('DC')}, ${jo(sg('BC'), '은/는')} 반원 O의 접선이다. ${is('AD', a)}, ${is('BC', b)}일 때, ${jo(sg('AB'), '의/의')} 길이는?`, 2 * s, m, 'cm', {
          figure: S.svg(`반원 O와 지름 AB. 선분 AD, BC는 지름의 양 끝에서 반원에 접하고, 선분 DC는 반원에 점 E에서 접한다. A, B에 직각 표시가 있다. 선분 AD의 길이는 ${a} cm, 선분 BC의 길이는 ${b} cm`),
          explain: `${eq('DE', 'DA')} = ${a} cm, ${eq('CE', 'CB')} = ${b} cm이므로 ${sg('DC')} = ${a + b} cm이다. 점 C에서 ${sg('AD')}에 내린 수선의 발을 H라 하면 ${sg('DH')} = ${a} − ${b} = ${a - b}(cm)이고, ${sg('AB')} = ${sg('HC')} = ${rootOf(`${sq(a + b)} − ${sq(a - b)}`)} = ${rt(4 * v)} = ${radText(2 * s, m)}(cm)이다.`,
          facts: { calc: [[`(((${a}+${b})*(${a}+${b})-(${a}-${b})*(${a}-${b}))/${m})**0.5`, 0], [`${m}`, 1]], unseen: [m] }
        });
      }),
      T('semi-radius', '셋째 접선과 한 쪽 접선의 길이로 반지름 구하기', '①65', (d) => {
        const [a, b] = d.until(() => [d.int(2, 12), d.int(2, 12)], ([x, y]) => y < x && y >= 0.3 * x && split(x * y)[0] === 1), r = Math.sqrt(a * b);
        const P = semiPts(a, b, { full: true }), S = semiScene(P, { full: true }).right('BAD ABC').len('DC', cm(a + b), 'O', { t: a / (a + b) < 0.5 ? 0.76 : 0.24 }).len('DA', cm(a), 'B').names({ O: 270 });
        // 원문(기접16)처럼 접선 위의 점은 C(B 쪽), D(A 쪽)이다.
        return radQ(`다음 그림은 원 O의 지름 AB의 양 끝 점에서 이 원에 접선을 긋고, 점 E에서 원에 접하는 접선이 두 접선과 만나는 점을 각각 C, D라 한 것이다. ${is('CD', a + b)}, ${is('AD', a)}일 때, 원 O의 반지름의 길이는?`, 1, a * b, 'cm', {
          figure: S.svg(`원 O의 지름 AB와 그 양 끝에서 그은 두 접선. 점 E에서 원에 접하는 직선이 A 쪽 접선과 점 D에서, B 쪽 접선과 점 C에서 만난다. A, B에 직각 표시가 있다. 선분 CD의 길이는 ${a + b} cm, 선분 AD의 길이는 ${a} cm`),
          explain: `${eq('DE', 'DA')} = ${a} cm이므로 ${sg('CB')} = ${sg('CE')} = ${a + b} − ${a} = ${b}(cm)이다. 점 C에서 ${sg('AD')}에 내린 수선의 발을 H라 하면 ${sg('DH')} = ${a - b} cm이고 지름 ${sg('AB')} = ${sg('HC')} = ${rootOf(`${sq(a + b)} − ${sq(a - b)}`)} = ${radText(2, a * b)}(cm)이다. 반지름의 길이는 ${rt(a * b)} cm이다.`,
          facts: { calc: [[`${a + b}*${a + b}/4-(${a + b}-2*${a})*(${a + b}-2*${a})/4`, 0]], unseen: [4, 2] }
        });
      }),
      T('semi-area', '지름의 양 끝 접선의 길이로 반원의 넓이 구하기', '①66', (d) => {
        const [a, b] = d.until(() => [d.int(3, 13), d.int(1, 11)], ([x, y]) => y < x && y >= 0.3 * x && (x * y) % 2 === 1), P = semiPts(a, b);
        const S = semiScene(P).right('BAD ABC').len('DA', cm(a), 'B').len('BC', cm(b), 'A').names({ O: 270 });
        return piF(`다음 그림에서 ${jo(sg('AB'), '은/는')} 반원 O의 지름이고 ${sg('AD')}, ${sg('DC')}, ${jo(sg('BC'), '은/는')} 반원 O의 접선이다. ${is('AD', a)}, ${is('BC', b)}일 때, 반원 O의 넓이는?`, a * b, 2, 'cm²', {
          figure: S.svg(`반원 O와 지름 AB. 선분 AD, BC는 지름의 양 끝에서 반원에 접하고, 선분 DC는 반원에 점 E에서 접한다. A, B에 직각 표시가 있다. 선분 AD의 길이는 ${a} cm, 선분 BC의 길이는 ${b} cm`),
          explain: `${sg('DC')} = ${sg('DA')} + ${sg('CB')} = ${a + b}(cm)이고, 점 C에서 ${sg('AD')}에 내린 수선의 발을 H라 하면 ${sg('DH')} = ${a - b} cm이다. ${sg('AB')} = ${sg('HC')} = ${rootOf(`${sq(a + b)} − ${sq(a - b)}`)} = ${rt(4 * a * b)}(cm)이므로 반지름의 길이는 ${rt(a * b)} cm이다. 반원의 넓이는 ${frac(1, 2)} × π × (${rt(a * b)})${sup2} = ${frac(a * b, 2)}π(cm²)이다.`,
          facts: { value: `${a}*${b}/2`, unseen: [2] }
        });
      }),
      T('semi-trap-area', '지름의 양 끝 접선의 길이로 사다리꼴의 넓이 구하기', '①67', (d) => {
        const [a, b] = d.until(() => [d.int(2, 14), d.int(2, 14)], ([x, y]) => y > x && x >= 0.3 * y && !isSq(x * y)), [s, m] = split(a * b);
        const P = semiPts(a, b), S = semiScene(P).right('BAD ABC').dot('E').len('DA', cm(a), 'B').len('BC', cm(b), 'A').names({ O: 270 });
        return radQ(`다음 그림의 반원 O에서 세 점 A, B, E는 접점이다. ${is('AD', a)}, ${is('BC', b)}일 때, □ABCD의 넓이는?`, (a + b) * s, m, 'cm²', {
          figure: S.svg(`반원 O와 지름 AB. 선분 AD, BC는 지름의 양 끝 A, B에서 반원에 접하고, 선분 DC는 반원에 점 E에서 접한다. A, B에 직각 표시가 있다. 선분 AD의 길이는 ${a} cm, 선분 BC의 길이는 ${b} cm`),
          explain: `${sg('DC')} = ${sg('DE')} + ${sg('EC')} = ${sg('DA')} + ${sg('CB')} = ${a + b}(cm)이다. 점 D에서 ${sg('BC')}에 내린 수선의 발을 H라 하면 ${sg('CH')} = ${b - a} cm이고 ${sg('AB')} = ${sg('DH')} = ${rootOf(`${sq(a + b)} − ${sq(b - a)}`)} = ${radText(2 * s, m)}(cm)이다. 따라서 □ABCD의 넓이는 ${frac(1, 2)} × (${a} + ${b}) × ${radText(2 * s, m)} = ${radText((a + b) * s, m)}(cm²)이다.`,
          facts: { calc: [[`(${a}+${b})*(${a}*${b}/${m})**0.5`, 0], [`${m}`, 1]], unseen: [m] }
        });
      }),
      T('semi-area-back', '반지름과 셋째 접선의 길이로 사다리꼴의 넓이 구하기', '①68', (d) => {
        const [a, b] = d.pick([[8, 2], [9, 4], [12, 3], [16, 4], [18, 2], [9, 1], [16, 9], [27, 3], [25, 4], [18, 8], [20, 5], [24, 6]]), r = Math.sqrt(a * b);
        const P = semiPts(a, b), S = semiScene(P).right('BAD ABC').dot('E').len('DA', cm(a), 'B').len('AO', cm(r), 'D', { gap: 3 }).len('DC', cm(a + b), 'O', { t: a / (a + b) < 0.5 ? 0.76 : 0.24 }).names({ O: 270 });
        return cm2Q(`다음 그림에서 ${jo(sg('AB'), '은/는')} 반원 O의 지름이고 ${sg('AD')}, ${sg('DC')}, ${jo(sg('BC'), '은/는')} 반원 O의 접선이며 점 E는 접점이다. ${is('AD', a)}, ${is('AO', r)}, ${is('CD', a + b)}일 때, □ABCD의 넓이는?`, (a + b) * r, {
          figure: S.svg(`반원 O와 지름 AB. 선분 AD, BC는 지름의 양 끝 A, B에서 반원에 접하고, 선분 DC는 반원에 점 E에서 접한다. A, B에 직각 표시가 있다. 선분 AD의 길이는 ${a} cm, 선분 AO의 길이는 ${r} cm, 선분 DC의 길이는 ${a + b} cm`),
          explain: `${eq('DE', 'DA')} = ${a} cm이므로 ${sg('CB')} = ${sg('CE')} = ${a + b} − ${a} = ${b}(cm)이고 ${sg('AB')} = 2 × ${r} = ${2 * r}(cm)이다. □ABCD는 사다리꼴이므로 넓이는 ${frac(1, 2)} × (${a} + ${b}) × ${2 * r} = ${(a + b) * r}(cm²)이다.`,
          facts: { calc: [[`(${a}+${a + b}-${a})*2*${r}/2`, 0]], unseen: [2] }
        });
      }),
      T('semi-perp-feet', '지름의 양 끝에서 접선에 내린 두 수선의 발 사이의 거리', '①69', (d) => {
        const [p, q] = d.until(() => [d.int(2, 9), d.int(2, 14)], ([x, y]) => x < y && x >= 0.25 * y && (x + y) % 2 === 0 && !isSq(x * y)), [s, m] = split(p * q), R = (p + q) / 2, ph = Math.asin((q - p) / (q + p)) / RAD, O = [0, 0];
        const A = at(O, R, 180 + ph), Bp = at(O, R, ph), P = fitPts({ O, A, B: Bp, T: [0, R], P: [A[0], R], Q: [Bp[0], R] }, [200, 190], [[O, R]]);
        const S = scene(P).ring('O', R).seg('AB AP BQ').line('PQ', 18, 18).right('APQ BQP').dot('OT').len('AP', cm(p), 'O', { gap: 3 }).len('BQ', cm(q), 'O', { gap: 3, t: 0.84 }).names({ T: 270, P: 270, Q: 270 });
        return radQ(`다음 그림과 같이 원 O의 지름 AB의 양 끝 점 A, B에서 원 O 위의 점 T에서 그은 접선에 내린 수선의 발을 각각 P, Q라 하자. ${is('AP', p)}, ${is('BQ', q)}일 때, ${jo(sg('PQ'), '의/의')} 길이는?`, 2 * s, m, 'cm', {
          figure: S.svg(`원 O의 지름 AB와 원 위의 점 T에서 그은 접선. 점 A, B에서 이 접선에 내린 수선의 발이 각각 P, Q이고 두 곳에 직각 표시가 있다. 선분 AP의 길이는 ${p} cm, 선분 BQ의 길이는 ${q} cm`),
          explain: `${sg('OT')} ⊥ ${sg('PQ')}이고 ${sg('AP')} ∥ ${sg('OT')} ∥ ${sg('BQ')}이며 O는 ${jo(sg('AB'), '의/의')} 중점이므로 ${sg('OT')} = (${p} + ${q}) ÷ 2 = ${R}(cm)이고 ${sg('AB')} = ${2 * R} cm이다. 점 A에서 ${sg('BQ')}에 내린 수선의 발을 H라 하면 ${sg('BH')} = ${q} − ${p} = ${q - p}(cm)이고 ${sg('PQ')} = ${sg('AH')} = ${rootOf(`${sq(2 * R)} − ${sq(q - p)}`)} = ${radText(2 * s, m)}(cm)이다.`,
          facts: { calc: [[`(((${p}+${q})*(${p}+${q})-(${q}-${p})*(${q}-${p}))/${m})**0.5`, 0], [`${m}`, 1]], unseen: [m] }
        });
      }),
      T('semi-square', '정사각형 안의 반원에 접하는 선분', '①70', (d) => {
        const sd = d.pick([6, 10, 14, 18, 22, 26]), P = fitPts({ A: [0, -sd], B: [0, 0], C: [sd, 0], D: [sd, -sd], E: [0, -sd / 4], O: [sd / 2, 0] }, [180, 180]);
        const k = P.k, S = scene(P); S.arc('O', sd / 2, 0, 180);
        const tp = (() => { const O = P.O, D = P.D, E = P.E, f = foot(O, E, D); return f; })();
        S.poly('ABCD').seg('DE').dot('O').b.dot(tp);
        S.len('CD', cm(sd), 'A').names({ O: 270 });
        return fracQ(`다음 그림에서 □ABCD는 한 변의 길이가 ${sd} cm인 정사각형이다. 변 AB 위의 점 E에 대하여 선분 DE가 ${jo(sg('BC'), '을/를')} 지름으로 하는 반원 O에 접할 때, ${jo(sg('DE'), '의/의')} 길이는?`, 5 * sd, 4, 'cm', {
          figure: S.svg(`정사각형 ABCD와 변 BC를 지름으로 하는 반원 O. 변 AB 위의 점 E와 꼭짓점 D를 이은 선분 DE가 반원에 접한다. 변 CD의 길이는 ${sd} cm`),
          explain: `${jo(sg('DC'), '과/와')} ${jo(sg('EB'), '은/는')} 반원의 접선이다(지름의 양 끝에서 지름에 수직). 선분 DE가 반원에 접하는 점을 P라 하면 ${sg('DP')} = ${sg('DC')} = ${sd} cm, ${sg('EP')} = ${sg('EB')}이다. ${sg('EB')} = ${X} cm라 하면 ${sg('DE')} = (${sd} + ${X}) cm, ${sg('AE')} = (${sd} − ${X}) cm이고 직각삼각형 AED에서 (${sd} + ${X})${sup2} = ${sq(sd)} + (${sd} − ${X})${sup2}, ${4 * sd}${X} = ${sd * sd}, ${X} = ${frac(sd / 2, 2)}이다. 따라서 ${sg('DE')} = ${frac(5 * sd / 2, 2)} cm이다.`,
          facts: { value: `(${sd}+${sd}*${sd}/(4*${sd}))`, unseen: [4] }
        });
      }),
      T('semi-rect-tan', '직사각형의 세 변에 접하는 원과 꼭짓점에서 그은 접선', '①71', (d) => {
        const [cdv, ch, h] = triple(d, ([u, v]) => u % 2 === 0 && v >= 0.3 * u && v <= 2 * u && u <= 24), r = cdv / 2, bh = (h - ch) / 2 + r, L = bh + ch;
        const P = fitPts({ A: [0, -cdv], B: [0, 0], C: [L, 0], D: [L, -cdv], H: [bh, 0], O: [r, -r] }, [215, 150], [[[r, -r], r]]);
        const S = scene(P).ring('O', r).poly('ABCD').seg('DH').dot('O').len('CD', cm(cdv), 'A').len('DH', cm(h), 'A', { t: 0.55, gap: 3 }).names();
        return cmQ(`다음 그림에서 원 O는 직사각형 ABCD의 세 변 AB, BC, AD에 접하고, 꼭짓점 D에서 원 O에 그은 접선이 변 BC와 만나는 점을 H라 하자. ${is('CD', cdv)}, ${is('DH', h)}일 때, ${jo(sg('BH'), '의/의')} 길이는?`, bh, {
          figure: S.svg(`직사각형 ABCD와 세 변 AB, BC, AD에 접하는 원 O. 꼭짓점 D에서 원 O에 그은 접선이 변 BC와 점 H에서 만난다. 변 CD의 길이는 ${cdv} cm, 선분 DH의 길이는 ${h} cm`),
          explain: `원 O의 반지름의 길이는 ${cdv} ÷ 2 = ${r}(cm)이다. 직각삼각형 DHC에서 ${sg('CH')} = ${rootOf(`${sq(h)} − ${sq(cdv)}`)} = ${ch}(cm)이다. 원이 변 AB, BC, AD, DH에 접하는 점을 각각 E, F, G, I라 하고 ${sg('HF')} = ${sg('HI')} = ${X} cm라 하면 ${sg('DG')} = ${sg('DI')} = (${h} − ${X}) cm이다. ${eq('AD', 'BC')}이므로 ${r} + (${h} − ${X}) = ${r} + ${X} + ${ch}, ${X} = ${(h - ch) / 2}이다. 따라서 ${sg('BH')} = ${r} + ${(h - ch) / 2} = ${bh}(cm)이다.`,
          facts: { calc: [[`${cdv}/2+(${h}-(${h}*${h}-${cdv}*${cdv})**0.5)/2`, 0]], unseen: [2] }
        });
      }),
      T('semi-rect-only', '직사각형의 가로와 세로만으로 꼭짓점에서 그은 접선이 자른 길이 구하기', '①72', (d) => {
        const [r, g] = d.until(() => [d.int(2, 7), d.int(3, 30)], ([u, w]) => w > u && (u * u) % w === 0 && w <= 2.6 * u && u * u / w >= 1), L = r + g, x = r * r / g;
        const P = fitPts({ A: [0, -2 * r], B: [0, 0], C: [L, 0], D: [L, -2 * r], F: [r, 0], I: [r + x, 0], O: [r, -r] }, [215, 150], [[[r, -r], r]]);
        const S = scene(P).ring('O', r).poly('ABCD').seg('DI').dot('O').dot('F').len('AB', cm(2 * r), 'C').len('AD', cm(L), 'B').names({ F: 270, I: 270 });
        return cmQ(`다음 그림에서 원 O는 직사각형 ABCD의 세 변 AB, BC, AD에 접하고, 원이 변 BC에 접하는 점은 F이다. 꼭짓점 D에서 원 O에 그은 접선이 변 BC와 만나는 점을 I라 하자. ${is('AB', 2 * r)}, ${is('AD', L)}일 때, ${jo(sg('FI'), '의/의')} 길이는?`, x, {
          figure: S.svg(`직사각형 ABCD와 세 변 AB, BC, AD에 접하는 원 O. 원이 변 BC에 접하는 점이 F이고, 꼭짓점 D에서 원 O에 그은 접선이 변 BC와 점 I에서 만난다. 변 AB의 길이는 ${2 * r} cm, 변 AD의 길이는 ${L} cm`),
          explain: `원 O의 반지름의 길이는 ${r} cm이므로 ${sg('BF')} = ${r} cm이고, 원이 변 AD에 접하는 점을 G라 하면 ${sg('DG')} = ${L} − ${r} = ${g}(cm)이다. ${sg('FI')} = ${X} cm라 하면 접선 DI의 길이는 ${sg('DG')} + ${X} = (${g} + ${X}) cm이고 ${sg('CI')} = (${g} − ${X}) cm이다. 직각삼각형 DIC에서 (${g} + ${X})${sup2} = (${g} − ${X})${sup2} + ${sq(2 * r)}, ${4 * g}${X} = ${4 * r * r}이므로 ${X} = ${x}이다.`,
          facts: { calc: [[`(${2 * r}*${2 * r})/(4*(${L}-${2 * r}/2))`, 0]], unseen: [4, 2] }
        });
      }),
      T('semi-box', '맞닿은 원으로 정사각형 상자 채우기', '①74', (d, n) => {
        // n = 0: 병 5개가 든 상자의 한 변, n = 1: 원 4개 사이의 작은 원
        if (n === 0) {
          const r = d.int(2, 8), sd = 2 * r + 2 * r * Math.SQRT2, cs = [[r, r], [sd - r, r], [r, sd - r], [sd - r, sd - r], [sd / 2, sd / 2]], P = fitPts({ A: [0, 0], B: [sd, sd] }, [170, 170]), k = P.k, b = Board();
          b.poly([[0, 0], [sd * k, 0], [sd * k, sd * k], [0, sd * k]]);
          cs.forEach((c) => b.disk([c[0] * k, c[1] * k], r * k, TINT));
          b.seg([r * k, r * k], [r * k - r * k * Math.SQRT1_2, r * k - r * k * Math.SQRT1_2], 'thin').dot([r * k, r * k], 2).text([r * k + 2, r * k + 13], cm(r), { blue: true });
          return sumRad(`다음 그림과 같이 밑면의 반지름의 길이가 ${r} cm인 원기둥 모양의 병 5개가 밑면이 정사각형인 상자에 꼭 맞게 들어 있다. 네 귀퉁이의 병은 상자의 두 옆면에 닿고, 가운데 병은 네 병에 모두 닿는다. 상자의 밑면인 정사각형의 한 변의 길이는?`, 2 * r, 2 * r, 2, 1, 'cm', {
            figure: b.svg(`정사각형 안에 반지름의 길이가 ${r} cm인 원 5개가 있다. 네 귀퉁이의 원은 정사각형의 두 변에 닿고, 가운데 원은 네 원에 모두 닿는다`),
            explain: `맞닿은 두 원의 중심을 이은 선분은 맞닿은 점을 지나므로 그 길이는 두 반지름의 합인 ${2 * r} cm이다. 정사각형의 한 변의 길이를 ${V('a')} cm라 하면 귀퉁이 원의 중심과 가운데 원의 중심 사이의 거리는 한 변의 길이가 (${frac(V('a'), 2)} − ${r}) cm인 정사각형의 대각선의 길이이므로 ${rt(2)}(${frac(V('a'), 2)} − ${r}) = ${2 * r}, ${frac(V('a'), 2)} − ${r} = ${radText(r, 2)}이다. 따라서 한 변의 길이는 (${2 * r} + ${radText(2 * r, 2)}) cm이다.`,
            facts: { calc: [[`2*${r}`, 0], [`2*${r}`, 1], ['2', 2]], unseen: [2] }
          });
        }
        const r = d.int(2, 9), sd = 4 * r, cs = [[r, r], [3 * r, r], [r, 3 * r], [3 * r, 3 * r]], P = fitPts({ A: [0, 0], B: [sd, sd] }, [170, 170]), k = P.k, b = Board(), sr = r * (Math.SQRT2 - 1);
        b.poly([[0, 0], [sd * k, 0], [sd * k, sd * k], [0, sd * k]]);
        cs.forEach((c) => b.disk([c[0] * k, c[1] * k], r * k, TINT));
        b.disk([2 * r * k, 2 * r * k], sr * k, 'fill:rgba(147,197,253,0.55)');
        b.seg([3 * r * k, r * k], [4 * r * k, r * k], 'thin').dot([3 * r * k, r * k], 2).text([3.5 * r * k, r * k - 9], cm(r), { blue: true });
        return sumRad(`다음 그림과 같이 한 변의 길이가 ${sd} cm인 정사각형 안에 반지름의 길이가 ${r} cm인 원 4개와 작은 원 1개가 꼭 맞게 들어 있다. 작은 원이 네 원에 모두 닿을 때, 작은 원의 반지름의 길이는?`, r, r, 2, -1, 'cm', {
          figure: b.svg(`정사각형 안에 반지름의 길이가 ${r} cm인 원 4개가 두 줄로 들어 있고, 네 원 사이에 작은 원 1개가 네 원에 모두 닿아 있다`),
          explain: `큰 원의 중심 넷은 한 변의 길이가 ${2 * r} cm인 정사각형의 꼭짓점이고, 작은 원의 중심은 그 정사각형의 두 대각선이 만나는 점이다. 대각선의 길이는 ${radText(2 * r, 2)} cm이므로 큰 원의 중심에서 작은 원의 중심까지의 거리는 ${radText(r, 2)} cm이다. 맞닿은 두 원의 중심 사이의 거리는 두 반지름의 합이므로 작은 원의 반지름의 길이는 (${radText(r, 2)} − ${r}) cm이다.`,
          facts: { calc: [[`${sd}/4`, 0], ['2', 1], [`${r}`, 2]], unseen: [4, 2] }
        });
      }, { count: 2 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
