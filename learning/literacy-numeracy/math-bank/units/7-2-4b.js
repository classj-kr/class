// 중학교 1학년 2학기 4단원 입체도형의 성질 — 겉넓이와 부피의 기본 문항(기둥, 뿔, 구)과 치수를 적은 다면체 그림.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 7-2-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 기본에는 입체 하나의 겉넓이·부피를 바로 구하는 것만 싣는다: 각기둥·원기둥·각뿔·원뿔·구·반구(겨냥도나 전개도로 줌), 밑면이 부채꼴·반원인 기둥의 부피.
//  - 초등 6학년의 직육면체·정육면체는 싣지 않는다. 각기둥은 밑면이 삼각형·사다리꼴·오각형인 것, 뿔과 구는 모두 이 단원에서 처음 배운다.
//  - π가 드는 답은 π의 계수를 받는다. 한 유형(차례)의 계수는 늘 자연수이거나 늘 분수이다 — 수를 그렇게 고른다(뿔의 부피는 3으로 나누어떨어지게, 구의 부피는 반지름이 3의 배수이게.
//    분수 계수는 「구의 부피(분수 계수)」「반구의 부피(분수 계수)」 두 유형에만 나온다).
//  - 거꾸로 구하는 것은 나눗셈 한 번으로 끝나는 것(밑넓이와 부피로 높이, 원기둥의 부피로 높이, 원뿔의 옆넓이로 반지름)만 기본에 두고 나머지는 실력에 두었다.
//  - 그림에 적힌 수가 답을 정한다. 겉넓이를 묻는 뿔 그림에는 모선(옆면의 높이)을, 부피를 묻는 뿔 그림에는 높이를 적고, 둘 다 묻는 그림에만 둘 다 적는다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, N, M, C, F } = B.kit;
  const { V, gcd } = B.kit.mid;
  const K = B.kit.m724;
  const { T, PI, U2, U3, UL, cm, calc, NUMW, pickWord, CREAM, SKY, SAND, RAD, f1, xy, stroke, curve, blob, fill, dot, onEll, arcD, tail, canvas, half, kindOf, beside, corner, leader, dimV, addPoly, netOf, TILT,
    cylFig, coneFig, sphereFig, hemiFig, cylNet, coneNet, pyrNet } = K;
  const mid2 = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  // 그림의 배율: 가로 길이 w(cm)가 화면에서 lo~hi px 사이에 들게 한다(치수는 적힌 수가 정하므로 가로와 세로의 배율은 따로 잡는다).
  const fitK = (w, lo, hi) => Math.min(hi, Math.max(lo, w * 12)) / w;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const FACES6 = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
  // 직각삼각형의 세 변 [직각을 낀 두 변, 빗변]
  const RIGHT = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]];

  // ── 그림: 치수를 적은 다면체 ─────────────────────────────────
  // 밑면이 직각삼각형인 삼각기둥(빗변이 앞에 놓인다). a, b: 직각을 낀 두 변(왼쪽, 오른쪽), c: 빗변, H: 높이(cm). o: { a, b, c, h: 글, label }
  function triPrismFig(a, b, c, H, o) {
    const k = fitK(c, 84, 116), cv = canvas(), x0 = -c / 2 * k, foot = a * a / c * k, dep = a * b / c * k, hh = clamp(H * k, 44, 100);
    const verts = [[x0, 0, 0], [-x0, 0, 0], [x0 + foot, dep, 0], [x0, 0, hh], [-x0, 0, hh], [x0 + foot, dep, hh]];
    const P = addPoly(cv, [0, 0], verts, [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]], { tl: 0.55 });
    cv.add(corner(P[5], P[3], P[4], 6));
    if (o.a) beside(cv, P[3], P[5], P[4], o.a);
    if (o.b) beside(cv, P[4], P[5], P[3], o.b);
    // 빗변의 글은 뒤쪽 세로 모서리(점선)와 겹치지 않는 쪽에 적는다.
    if (o.c) beside(cv, P[3], P[4], P[5], o.c, foot / (c * k) > 0.3 && foot / (c * k) < 0.7 ? (foot / (c * k) > 0.5 ? 0.24 : 0.76) : 0.5);
    if (o.h) beside(cv, P[1], P[4], P[0], o.h);
    return cv.out(o.label);
  }
  // 밑면이 사다리꼴인 사각기둥을, 사다리꼴인 밑면이 앞을 향하게 눕혀 그린 것(밑면이 제 모양대로 보인다).
  // 밑면: 아랫변 q, 윗변 p, 왼쪽 변 t(두 밑변에 수직), 오른쪽 변 s(비스듬한 변). H: 기둥의 높이(안쪽으로 뻗은 모서리, cm). o: { p, q, t, s, h: 글, label }
  function trapPrismFig(p, q, t, H, o) {
    const k = fitK(q, 84, 110), tz = clamp(t * k, 54, 80), cv = canvas(), dep = clamp(H * k, 56, 110), front = [[0, 0], [q * k, 0], [p * k, tz], [0, tz]];
    const P = addPoly(cv, [0, 0], front.map(([x, z]) => [x, 0, z]).concat(front.map(([x, z]) => [x, dep, z])), FACES6, { sk: 0.5, tl: 0.28 });
    cv.add(corner(P[0], P[1], P[3], 6) + corner(P[3], P[0], P[2], 6));
    if (o.q) beside(cv, P[0], P[1], P[3], o.q);
    // 윗변이 짧으면 글이 들어갈 자리가 없으므로 뒤쪽 윗변 위에 적는다.
    if (o.p) { if (p * k < 44) beside(cv, P[7], P[6], P[3], o.p); else beside(cv, P[3], P[2], P[7], o.p, null, null, 'is-length on-face'); }
    if (o.t) beside(cv, P[0], P[3], P[1], o.t);
    if (o.s) beside(cv, P[1], P[2], P[5], o.s, 0.45, 3, 'is-length on-face');
    if (o.h) beside(cv, P[1], P[5], P[0], o.h);
    return cv.out(o.label);
  }
  // 밑면이 오각형(직사각형 위에 이등변삼각형을 얹은 모양)인 오각기둥을 눕혀 그린 것. w: 밑면의 가로, e: 직사각형의 세로, g: 삼각형의 높이, L: 기둥의 높이(cm). o: { w, e, g, L: 글, s: 삼각형의 비스듬한 변의 글, label }
  function housePrismFig(w, e, g, L, o) {
    const k = Math.min(fitK(w, 72, 96), 100 / (e + g)), cv = canvas(), dep = clamp(L * k, 60, 120), front = [[0, 0], [w * k, 0], [w * k, e * k], [w * k / 2, (e + g) * k], [0, e * k]];
    const P = addPoly(cv, [0, 0], front.map(([x, z]) => [x, 0, z]).concat(front.map(([x, z]) => [x, dep, z])), [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [0, 1, 6, 5], [1, 2, 7, 6], [2, 3, 8, 7], [3, 4, 9, 8], [4, 0, 5, 9]], { sk: 0.5, tl: 0.28 });
    const m = mid2(P[4], P[2]);
    cv.add(stroke(P[4], P[2], 'dash') + stroke(P[3], m, 'dash') + corner(m, P[3], P[2], 5));
    if (o.w) beside(cv, P[0], P[1], P[3], o.w);
    if (o.e) beside(cv, P[0], P[4], P[1], o.e);
    if (o.g) leader(cv, [P[4][0] - 2, P[3][1] + 2], mid2(P[3], m), o.g);
    if (o.L) beside(cv, P[1], P[6], P[0], o.L);
    // 지붕의 비스듬한 변의 길이는 그림 밖(오른쪽)에 적고 가는 선으로 가리킨다(지붕 면 위에 적으면 가려진 모서리의 점선과 겹친다).
    if (o.s) leader(cv, [P[7][0] + 9 + half(o.s), (P[7][1] + P[8][1]) / 2 - 3], mid2(P[2], P[3]), o.s);
    return cv.out(o.label);
  }
  // 밑면이 직사각형(가로 a, 세로 b)인 사각뿔. H: 높이(cm). o: { a, b, h: 높이 글, s: 앞쪽 옆면의 높이 글, label }
  function sqPyramidFig(a, b, H, o) {
    const k = Math.min(fitK(a, 76, 108), 108 / b), cv = canvas(), A = a * k / 2, D = b * k / 2 * 0.9, hh = clamp(H * k, 56, 108);
    const P = addPoly(cv, [0, 0], [[-A, -D, 0], [A, -D, 0], [A, D, 0], [-A, D, 0], [0, 0, hh]], [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]], { sk: 0.5, tl: 0.42 }), O = [0, 0], front = mid2(P[0], P[1]);
    // 높이와 옆면의 높이는 그림 밖에 적고 가는 선으로 가리킨다(모서리와 글이 겹치지 않게).
    if (o.h) { cv.add(stroke(P[4], O, 'dash') + stroke(P[0], P[2], 'dash') + stroke(P[1], P[3], 'dash') + corner(O, P[4], P[1], 5)); leader(cv, [P[2][0] * 0.55 + 12 + half(o.h), -hh * 0.62], [0, -hh * 0.5], o.h); }
    if (o.s) { const at = [P[4][0] + (front[0] - P[4][0]) * 0.55, P[4][1] + (front[1] - P[4][1]) * 0.55]; cv.add(stroke(P[4], front, 'thin') + corner(front, P[4], P[1], 5)); leader(cv, [P[0][0] * 0.62 - 10 - half(o.s), at[1] - 16], at, o.s); }
    if (o.a) beside(cv, P[0], P[1], P[4], o.a);
    if (o.b) beside(cv, P[1], P[2], P[4], o.b);
    return cv.out(o.label);
  }
  // 밑면이 정사각형인 사각뿔대. a1: 윗면의 한 변, a2: 아랫면의 한 변, H: 높이(cm).
  // o: { a1, a2: 글, h: 뿔대의 높이 글, cut: 잘라 낸 사각뿔의 높이(cm), cutText: 그 글, s: 앞쪽 옆면(사다리꼴)의 높이 글, label }
  function sqFrustumFig(a1, a2, H, o) {
    const total = H + (o.cut || 0), k = fitK(a2, 84, 108), kv = Math.min(k, 124 / total), cv = canvas(), hh = Math.max(o.cut ? 30 : 44, H * kv);
    const sq = (a, z) => [[-a * k / 2, -a * k * 0.45, z], [a * k / 2, -a * k * 0.45, z], [a * k / 2, a * k * 0.45, z], [-a * k / 2, a * k * 0.45, z]];
    const P = addPoly(cv, [0, 0], sq(a2, 0).concat(sq(a1, hh)), FACES6, { sk: 0.5, tl: 0.42 });
    if (o.cut) {
      const apex = [0, -(hh + hh * o.cut / H)], x = Math.min(P[0][0], P[3][0]) - 12, dots = 'stroke-dasharray:2 3';
      cv.point(apex);
      [4, 5, 6, 7].forEach((i) => cv.add(stroke(P[i], apex, 'dash')));
      cv.add(stroke(apex, [0, 0], 'dash') + corner([0, 0], apex, P[1], 5));
      cv.add(stroke([x, apex[1]], apex, 'thin', dots) + stroke([x, -hh], [0, -hh], 'thin', dots) + stroke([x, 0], [0, 0], 'thin', dots));
      dimV(cv, x, apex[1], -hh, o.cutText); dimV(cv, x, -hh, 0, o.h);
    }
    if (o.s) { const up = mid2(P[4], P[5]), low = mid2(P[0], P[1]); cv.add(stroke(up, low, 'thin') + corner(low, up, P[1], 5));
      const at = mid2(up, low), room = (P[1][0] - P[0][0] + P[5][0] - P[4][0]) / 4;
      if (2 * half(o.s) + 9 <= room) beside(cv, up, low, P[0], o.s, 0.5, 3, 'is-length on-face'); else leader(cv, [mid2(P[0], P[4])[0] - 9 - half(o.s), at[1] - 9], at, o.s);
    }
    if (o.a1) leader(cv, [P[6][0] + 12 + half(o.a1), P[6][1] - 6], mid2(P[5], P[6]), o.a1);
    if (o.a2) beside(cv, P[0], P[1], P[4], o.a2);
    return cv.out(o.label);
  }
  // 밑면이 부채꼴(중심각 ang°)인 기둥. 부채꼴의 중심이 앞에 있고 호가 뒤에 있다. ang = 180(반원)이면 조금 돌려 놓아 평평한 옆면과 굽은 옆면이 함께 보인다.
  // r: 반지름, H: 높이(cm). o: { r: 반지름 글, d: 지름 글(반원), h: 높이 글, angle: 중심각 글, label }
  function sectorPrismFig(ang, r, H, o) {
    const rx = clamp(r * 13, 46, 62), ry = rx * 0.5, hh = clamp(H * 12, 46, 100), cv = canvas(), C0 = [0, 0], C1 = [0, hh], rot = ang === 180 ? -20 : 0;
    const a0 = 270 - ang / 2 + rot, a1 = 270 + ang / 2 + rot, down = (p) => [p[0], p[1] + hh], at = (t) => onEll(C0, rx, ry, t);
    const T0 = at(a0), T1 = at(a1), back = at((a0 + a1) / 2), see0 = Math.cos(a0 * RAD) < -1e-9, see1 = Math.cos(a1 * RAD) > 1e-9;
    // 굽은 옆면은 앞(각 0°~180°)을 향한 곳만 보인다.
    const spans = [];
    for (const from of [0, 360]) { const lo = Math.max(a0, from), hi = Math.min(a1, from + 180); if (hi - lo > 0.5) spans.push([lo, hi]); }
    const curved = (t) => spans.some(([lo, hi]) => t >= lo - 0.01 && t <= hi + 0.01);
    for (let t = a0; t <= a1 + 0.01; t += ang / 12) { cv.point(at(t)); cv.point(down(at(t))); }
    cv.point(C1);
    if (see0) cv.add(fill([C0, T0, down(T0), C1], CREAM));
    if (see1) cv.add(fill([C0, T1, down(T1), C1], CREAM));
    spans.forEach(([lo, hi]) => cv.add(blob(arcD(C0, rx, ry, lo, hi) + tail(arcD(C1, rx, ry, hi, lo)), CREAM)));
    cv.add(blob('M' + xy(C0) + 'L' + xy(T0) + tail(arcD(C0, rx, ry, a0, a1)), CREAM));
    cv.add(curve(arcD(C1, rx, ry, a0, a1), 'dash') + (see0 ? '' : stroke(C1, down(T0), 'dash')) + (see1 ? '' : stroke(C1, down(T1), 'dash')));
    spans.forEach(([lo, hi]) => cv.add(curve(arcD(C1, rx, ry, lo, hi))));
    cv.add(stroke(C0, T0) + stroke(C0, T1) + curve(arcD(C0, rx, ry, a0, a1)) + (see0 ? stroke(C1, down(T0)) : '') + (see1 ? stroke(C1, down(T1)) : ''));
    cv.add(stroke(T0, down(T0), see0 || curved(a0) ? '' : 'dash') + stroke(T1, down(T1), see1 || curved(a1) ? '' : 'dash'));
    [0, 180, 360].forEach((t) => { if (t > a0 + 0.5 && t < a1 - 0.5) cv.add(stroke(at(t), down(at(t)))); });
    if (ang < 180) cv.add(stroke(C0, C1, see0 || see1 ? '' : 'dash'));
    if (o.angle) { cv.add(curve(arcD(C0, 10, 5, a0, a1), 'thin')); cv.write([0, -ry * 0.62], o.angle, 'is-length'); }
    // 반지름 글은 기둥 밖(오른쪽 위)에 적고 가는 선으로 반지름을 가리킨다. 옆면 위에 적으면 중심각이 작을 때 오른쪽 모서리와 겹친다.
    if (o.r) leader(cv, [T1[0] + 7 + half(o.r), T1[1] - 11], mid2(C0, T1), o.r);
    if (o.d) beside(cv, T0, T1, back, o.d, 0.5, 3, 'is-length on-face');
    if (o.h) beside(cv, T1, down(T1), C1, o.h);
    return cv.out(o.label);
  }
  // 삼각기둥의 전개도: 옆면인 직사각형 3개(가로 u, v, c, 세로 H)가 옆으로 이어지고, 가운데 직사각형의 위와 아래에 밑면인 직각삼각형(직각을 낀 두 변 u, v, 빗변 c)이 붙어 있다.
  // o: { u, v, c, h: 글, label }
  function triPrismNet(u, v, c, H, o) {
    const k = Math.min(228 / (u + v + c), 190 / (H + 2 * u), 12), x1 = u * k, x2 = (u + v) * k, x3 = (u + v + c) * k, hh = H * k;
    return netOf([[[0, 0], [x1, 0], [x1, hh], [0, hh]], [[x1, 0], [x2, 0], [x2, hh], [x1, hh]], [[x2, 0], [x3, 0], [x3, hh], [x2, hh]], [[x1, 0], [x2, 0], [x1, -u * k]], [[x1, hh], [x2, hh], [x1, hh + u * k]]], o.label, (cv) => {
      cv.add(corner([x1, 0], [x1, -u * k], [x2, 0], 5) + corner([x1, hh], [x1, hh + u * k], [x2, hh], 5));
      if (o.u) cv.write([x1 - 5 - half(o.u), -u * k / 2], o.u, kindOf(o.u));
      if (o.c) beside(cv, [x1, -u * k], [x2, 0], [x1, 0], o.c);
      if (o.v) cv.write([(x1 + x2) / 2, 10], o.v, kindOf(o.v));
      if (o.h) cv.write([x3 + 5 + half(o.h), hh / 2], o.h, kindOf(o.h));
    });
  }
  Object.assign(K, { mid2, fitK, clamp, FACES6, RIGHT, triPrismFig, trapPrismFig, housePrismFig, sqPyramidFig, sqFrustumFig, sectorPrismFig, triPrismNet });

  // ── 기둥의 겉넓이와 부피 ─────────────────────────────────────
  const tri = (d) => { const [a, b, c] = d.pick(RIGHT); return d.bool() ? [a, b, c] : [b, a, c]; };
  const triSaid = (a, b, c, H) => `삼각기둥의 겨냥도. 밑면은 세 변의 길이가 ${cm(a)}, ${cm(b)}, ${cm(c)}인 직각삼각형이고(길이가 ${cm(c)}인 변이 빗변), 기둥의 높이는 ${cm(H)}`;
  const trapSaid = (p, q, t, s, H) => `사각기둥을 눕혀 놓은 겨냥도. 앞을 향한 밑면은 윗변 ${cm(p)}, 아랫변 ${cm(q)}, 높이 ${cm(t)}인 사다리꼴이고${s ? `(나머지 한 변은 ${cm(s)})` : ''}, 기둥의 높이는 ${cm(H)}`;
  B.addTypes('7-2-4', 'prism', [
    T('prism-formula', '기둥의 겉넓이를 구하는 식', '①39', (d) => pickWord(d, '다음은 기둥의 겉넓이를 구하는 식이다. ㉠에 알맞은 것은?', '밑넓이', ['옆넓이', '높이', '밑면의 둘레의 길이'], '기둥의 밑면은 2개이므로 (기둥의 겉넓이) = (밑넓이) × 2 + (옆넓이)이다.', lines(['(기둥의 겉넓이) = (㉠) × 2 + (옆넓이)']))),
    T('prism-volume', '각기둥의 부피', '①45·48 ②40', (d, n) => {
      if (n === 0) {
        const [a, b, c] = tri(d), H = d.until(() => d.int(4, 12), (v) => ![a, b, c].includes(v)), S = a * b / 2;
        return N('다음 삼각기둥의 부피는?', S * H, { unit: 'cm³', figure: triPrismFig(a, b, c, H, { a: cm(a), b: cm(b), c: cm(c), h: cm(H), label: triSaid(a, b, c, H) }), explain: `밑면은 직각을 낀 두 변의 길이가 ${a} cm, ${b} cm인 직각삼각형이므로 밑넓이는 ${a} × ${b} ÷ 2 = ${S}(cm²)이다. 부피는 ${S} × ${H} = ${S * H}(cm³)`, facts: calc(`${a}*${b}/2*${H}`, [2]) });
      }
      if (n === 1) {
        const [p, q, t] = d.until(() => { const x = d.int(2, 6); return [x, x + d.int(2, 5), d.int(3, 6)]; }, (v) => (v[0] + v[1]) * v[2] % 2 === 0 && v[2] !== v[0] && v[2] !== v[1]), H = d.until(() => d.int(4, 10), (v) => ![p, q, t].includes(v)), S = (p + q) * t / 2;
        return N('다음 그림과 같이 밑면이 사다리꼴인 사각기둥의 부피는?', S * H, { unit: 'cm³', figure: K.trapPrismFig(p, q, t, H, { p: cm(p), q: cm(q), t: cm(t), h: cm(H), label: trapSaid(p, q, t, 0, H) }), explain: `밑넓이는 (${p} + ${q}) × ${t} ÷ 2 = ${S}(cm²)이다. 부피는 ${S} × ${H} = ${S * H}(cm³)`, facts: calc(`(${p}+${q})*${t}/2*${H}`, [2]) });
      }
      const w = d.pick([4, 6, 8]), e = d.until(() => d.int(2, 5), (v) => v !== w), g = d.until(() => d.int(2, 4), (v) => v !== e && v !== w), L = d.until(() => d.int(5, 10), (v) => ![w, e, g].includes(v)), S = w * e + w * g / 2;
      return N('다음 그림과 같이 밑면이 오각형인 각기둥의 부피는?', S * L, {
        unit: 'cm³', figure: housePrismFig(w, e, g, L, { w: cm(w), e: cm(e), g: cm(g), L: cm(L), label: `오각기둥을 눕혀 놓은 겨냥도. 밑면은 가로 ${cm(w)}, 세로 ${cm(e)}인 직사각형 위에 밑변 ${cm(w)}, 높이 ${cm(g)}인 이등변삼각형을 얹은 모양의 오각형이고, 기둥의 높이는 ${cm(L)}` }),
        explain: `밑면을 직사각형과 삼각형으로 나누면 밑넓이는 ${w} × ${e} + ${w} × ${g} ÷ 2 = ${S}(cm²)이다. 부피는 ${S} × ${L} = ${S * L}(cm³)`, facts: calc(`(${w}*${e}+${w}*${g}/2)*${L}`, [2])
      });
    }, { count: 3 }),
    T('prism-cyl-volume', '원기둥의 부피', '①46 ②41', (d) => {
      const r = d.int(2, 7), h = d.until(() => d.int(3, 12), (v) => v !== r);
      return N('다음 원기둥의 부피는?', r * r * h, { unit: U3, figure: cylFig(r, h, { r: cm(r), h: cm(h), label: `원기둥의 겨냥도. 밑면의 반지름 ${cm(r)}, 높이 ${cm(h)}` }), explain: `밑넓이는 ${PI} × ${r} × ${r} = ${r * r}${PI}(cm²)이다. 부피는 ${r * r}${PI} × ${h} = ${r * r * h}${PI}(cm³)`, facts: calc(`${r}*${r}*${h}`) });
    }),
    T('prism-surface', '각기둥의 겉넓이', '①40 ②42', (d, n) => {
      if (n === 0) {
        const [a, b, c] = tri(d), H = d.until(() => d.int(4, 12), (v) => ![a, b, c].includes(v)), S = a * b / 2, side = (a + b + c) * H;
        return N('다음 삼각기둥의 겉넓이는?', 2 * S + side, { unit: 'cm²', figure: triPrismFig(a, b, c, H, { a: cm(a), b: cm(b), c: cm(c), h: cm(H), label: triSaid(a, b, c, H) }), explain: `밑넓이는 ${a} × ${b} ÷ 2 = ${S}(cm²), 옆넓이는 (${a} + ${b} + ${c}) × ${H} = ${side}(cm²)이다. 겉넓이는 ${S} × 2 + ${side} = ${2 * S + side}(cm²)`, facts: calc(`${a}*${b}/2*2+(${a}+${b}+${c})*${H}`, [2]) });
      }
      const [dq, t, s] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]), p = d.until(() => d.int(2, 6), (v) => ![dq, t, s].includes(v) && v + dq !== t && v + dq !== s), q = p + dq, H = d.until(() => d.int(4, 12), (v) => ![p, q, t, s].includes(v)), S = (p + q) * t / 2, side = (p + q + t + s) * H;
      return N('다음 그림과 같이 밑면이 사다리꼴인 사각기둥의 겉넓이는?', 2 * S + side, { unit: 'cm²', figure: K.trapPrismFig(p, q, t, H, { p: cm(p), q: cm(q), t: cm(t), s: cm(s), h: cm(H), label: trapSaid(p, q, t, s, H) }), explain: `밑넓이는 (${p} + ${q}) × ${t} ÷ 2 = ${S}(cm²), 옆넓이는 (${p} + ${q} + ${t} + ${s}) × ${H} = ${side}(cm²)이다. 겉넓이는 ${S} × 2 + ${side} = ${2 * S + side}(cm²)`, facts: calc(`(${p}+${q})*${t}/2*2+(${p}+${q}+${t}+${s})*${H}`, [2]) });
    }, { count: 2 }),
    T('prism-cyl-surface', '원기둥의 밑넓이, 옆넓이, 겉넓이', '①41 ②43', (d) => {
      const r = d.int(2, 6), h = d.until(() => d.int(3, 10), (v) => v !== r && v !== 2 * r);
      return M('다음 원기둥의 밑넓이, 옆넓이, 겉넓이를 각각 구하시오.', [{ label: '밑넓이', answer: r * r, unit: U2 }, { label: '옆넓이', answer: 2 * r * h, unit: U2 }, { label: '겉넓이', answer: 2 * r * r + 2 * r * h, unit: U2 }], {
        figure: cylFig(r, h, { r: cm(r), h: cm(h), label: `원기둥의 겨냥도. 밑면의 반지름 ${cm(r)}, 높이 ${cm(h)}` }),
        shown: `밑넓이 ${r * r}${PI} cm², 옆넓이 ${2 * r * h}${PI} cm², 겉넓이 ${2 * r * r + 2 * r * h}${PI} cm²`,
        explain: `밑넓이는 ${PI} × ${r} × ${r} = ${r * r}${PI}(cm²)이다. 옆면은 가로의 길이가 밑면의 둘레 2 × ${PI} × ${r} = ${2 * r}${PI}(cm), 세로의 길이가 ${h} cm인 직사각형이므로 옆넓이는 ${2 * r * h}${PI} cm²이다. 겉넓이는 ${r * r}${PI} × 2 + ${2 * r * h}${PI} = ${2 * r * r + 2 * r * h}${PI}(cm²)`,
        facts: { calc: [[`${r}*${r}`, 0], [`2*${r}*${h}`, 1], [`${r}*${r}*2+2*${r}*${h}`, 2]], unseen: [2] }
      });
    }),
    T('prism-cyl-net', '원기둥의 전개도에서 옆면의 가로의 길이와 겉넓이', '①42', (d) => {
      const r = d.int(2, 5), h = d.until(() => d.int(4, 9), (v) => v !== r && v !== 2 * r), px = Math.min(22, 60 / h * r);
      return M('다음은 원기둥과 그 전개도이다. 옆면인 직사각형의 가로의 길이 ㉠과 원기둥의 겉넓이를 각각 구하시오.', [{ label: '㉠', answer: 2 * r, unit: UL }, { label: '겉넓이', answer: 2 * r * r + 2 * r * h, unit: U2 }], {
        figure: cylFig(r, h, { r: cm(r), h: cm(h), label: `원기둥의 겨냥도. 밑면의 반지름 ${cm(r)}, 높이 ${cm(h)}` }) + cylNet(px, px * h / r, { w: '㉠', r: cm(r), h: cm(h), label: `원기둥의 전개도. 밑면인 원의 반지름 ${cm(r)}, 옆면인 직사각형의 가로 ㉠, 세로 ${cm(h)}` }),
        shown: `㉠ ${2 * r}${PI} cm, 겉넓이 ${2 * r * r + 2 * r * h}${PI} cm²`,
        explain: `옆면인 직사각형의 가로의 길이는 밑면인 원의 둘레의 길이와 같으므로 2 × ${PI} × ${r} = ${2 * r}${PI}(cm)이다. 겉넓이는 ${PI} × ${r} × ${r} × 2 + ${2 * r}${PI} × ${h} = ${2 * r * r + 2 * r * h}${PI}(cm²)`,
        facts: { calc: [[`2*${r}`, 0], [`${r}*${r}*2+2*${r}*${h}`, 1]], unseen: [2] }
      });
    }),
    T('prism-tri-net', '전개도로 준 삼각기둥의 겉넓이와 부피', '①42·43', (d, n) => {
      const [u, v, c] = d.pick(RIGHT.slice(0, 4)), H = d.until(() => d.int(5, 14), (x) => ![u, v, c].includes(x)), S = u * v / 2, side = (u + v + c) * H;
      const figure = triPrismNet(u, v, c, H, { u: cm(u), v: cm(v), c: cm(c), h: cm(H), label: `삼각기둥의 전개도. 세로 ${cm(H)}인 직사각형 3개가 옆으로 이어져 있고, 가운데 직사각형의 위와 아래에 세 변의 길이가 ${cm(u)}, ${cm(v)}, ${cm(c)}인 직각삼각형(길이가 ${cm(c)}인 변이 빗변)이 하나씩 붙어 있다` });
      if (n === 0) return N('다음 전개도로 만든 삼각기둥의 겉넓이는?', 2 * S + side, { unit: 'cm²', figure, explain: `밑넓이는 ${u} × ${v} ÷ 2 = ${S}(cm²)이다. 옆면인 직사각형 3개의 가로의 길이의 합은 밑면의 둘레 ${u} + ${v} + ${c} = ${u + v + c}(cm)이므로 옆넓이는 ${u + v + c} × ${H} = ${side}(cm²)이다. 겉넓이는 ${S} × 2 + ${side} = ${2 * S + side}(cm²)`, facts: calc(`${u}*${v}/2*2+(${u}+${v}+${c})*${H}`, [2]) });
      return N('다음 전개도로 만든 삼각기둥의 부피는?', S * H, { unit: 'cm³', figure, explain: `밑면은 직각을 낀 두 변의 길이가 ${u} cm, ${v} cm인 직각삼각형이므로 밑넓이는 ${u} × ${v} ÷ 2 = ${S}(cm²)이다. 높이는 옆면인 직사각형의 세로 ${H} cm이므로 부피는 ${S} × ${H} = ${S * H}(cm³)`, facts: calc(`${u}*${v}/2*${H}`, [2]) });
    }, { count: 2 }),
    T('prism-height', '기둥의 부피로 높이 구하기', '②45·46', (d, n) => {
      if (n === 0) {
        const S = d.int(12, 48), h = d.int(4, 9), name = NUMW[d.int(5, 8)] + '각기둥';
        return N(`밑넓이가 ${S} cm²이고 부피가 ${S * h} cm³인 ${name}의 높이는?`, h, { unit: 'cm', explain: `(기둥의 부피) = (밑넓이) × (높이)이므로 높이는 ${S * h} ÷ ${S} = ${h}(cm)`, facts: calc(`${S * h}/${S}`) });
      }
      const r = d.int(2, 5), h = d.until(() => d.int(3, 9), (v) => v !== r);
      return N(`다음 원기둥의 부피가 ${r * r * h}${PI} cm³일 때, 이 원기둥의 높이는?`, h, { unit: 'cm', figure: cylFig(r, h, { r: cm(r), label: `원기둥의 겨냥도. 밑면의 반지름 ${cm(r)}` }), explain: `밑넓이는 ${PI} × ${r} × ${r} = ${r * r}${PI}(cm²)이므로 높이는 ${r * r * h}${PI} ÷ ${r * r}${PI} = ${h}(cm)`, facts: calc(`${r * r * h}/(${r}*${r})`) });
    }, { count: 2 }),
    T('prism-cyl-net-volume', '전개도로 준 원기둥의 부피', '②49', (d) => {
      const r = d.int(2, 6), h = d.until(() => d.int(3, 10), (v) => v !== r && v !== 2 * r), px = Math.min(22, 64 / h * r);
      return N('다음 전개도로 만든 원기둥의 부피는?', r * r * h, {
        unit: U3, figure: cylNet(px, px * h / r, { w: `${2 * r}π cm`, h: cm(h), label: `원기둥의 전개도. 옆면인 직사각형의 가로 ${2 * r}π cm, 세로 ${cm(h)}` }),
        explain: `옆면인 직사각형의 가로의 길이는 밑면인 원의 둘레의 길이와 같다. 2 × ${PI} × (반지름) = ${2 * r}${PI}에서 밑면의 반지름의 길이는 ${r} cm이다. 부피는 ${PI} × ${r} × ${r} × ${h} = ${r * r * h}${PI}(cm³)`,
        facts: calc(`(${2 * r}/2)*(${2 * r}/2)*${h}`, [2])
      });
    }),
    T('prism-sector', '밑면이 부채꼴·반원인 기둥의 부피', '①49 ②51', (d, n) => {
      if (n === 0) {
        const [r, ang] = d.pick([[3, 120], [6, 60], [6, 120], [4, 90], [6, 90], [8, 90], [6, 150], [9, 120]]), h = d.until(() => d.int(3, 9), (v) => v !== r), S = r * r * ang / 360;
        return N('다음 그림과 같이 밑면이 부채꼴인 기둥의 부피는?', S * h, {
          unit: U3, figure: sectorPrismFig(ang, r, h, { r: cm(r), h: cm(h), angle: ang + '°', label: `밑면이 부채꼴인 기둥의 겨냥도. 밑면은 반지름 ${cm(r)}, 중심각 ${ang}°인 부채꼴이고, 기둥의 높이는 ${cm(h)}` }),
          explain: `밑넓이는 ${PI} × ${r} × ${r} × ${frac(ang, 360)} = ${S}${PI}(cm²)이다. 부피는 ${S}${PI} × ${h} = ${S * h}${PI}(cm³)`, facts: calc(`${r}*${r}*${ang}/360*${h}`, [360])
        });
      }
      const r = d.int(2, 5), h = d.until(() => d.int(2, 5) * 2, (v) => v !== 2 * r && v !== r), S = r * r / 2;
      return N('다음 그림과 같이 밑면이 반원인 기둥의 부피는?', r * r * h / 2, {
        unit: U3, figure: sectorPrismFig(180, r, h, { d: cm(2 * r), h: cm(h), label: `밑면이 반원인 기둥의 겨냥도. 밑면인 반원의 지름 ${cm(2 * r)}, 기둥의 높이 ${cm(h)}` }),
        explain: `밑면인 반원의 반지름의 길이는 ${r} cm이므로 밑넓이는 ${PI} × ${r} × ${r} × ${frac(1, 2)}이다. 부피는 ${PI} × ${r} × ${r} × ${frac(1, 2)} × ${h} = ${r * r * h / 2}${PI}(cm³)`, facts: calc(`(${2 * r}/2)*(${2 * r}/2)*${h}/2`, [2])
      });
    }, { count: 2 })
  ]);

  // ── 뿔의 겉넓이와 부피 ───────────────────────────────────────
  const THIRD = `(뿔의 부피) = ${frac(1, 3)} × (밑넓이) × (높이)이다. `;
  B.addTypes('7-2-4', 'cone', [
    T('cone-formula', '뿔의 부피와 겉넓이를 구하는 식', '①39', (d, n) => {
      if (n === 1) return pickWord(d, '다음은 뿔의 겉넓이를 구하는 식이다. ㉠에 알맞은 것은?', '옆넓이', ['높이', '밑넓이', '모선의 길이'], '뿔의 밑면은 1개이므로 (뿔의 겉넓이) = (밑넓이) + (옆넓이)이다.', lines(['(뿔의 겉넓이) = (밑넓이) + (㉠)']));
      const options = d.shuffle([frac(1, 3), frac(1, 2), frac(2, 3), frac(1, 4)]), right = frac(1, 3);
      return C('다음은 뿔의 부피를 구하는 식이다. ㉠에 알맞은 수는?', options, options.indexOf(right), { figure: lines(['(뿔의 부피) = ㉠ × (밑넓이) × (높이)']), explain: '뿔의 부피는 밑면이 합동이고 높이가 같은 기둥의 부피의 ' + frac(1, 3) + '이다.', facts: { truth: options.map((o) => o === right), want: true } });
    }, { count: 2 }),
    T('cone-pyr-volume', '각뿔의 부피', '①62 ②57', (d, n) => {
      if (n === 0) {
        const [a, b, H] = d.until(() => { const x = d.int(3, 9); return [x, d.bool() ? x : d.int(3, 9), d.int(4, 12)]; }, (v) => v[0] * v[1] * v[2] % 3 === 0 && v[2] !== v[0] && v[2] !== v[1]);
        return N('다음 사각뿔의 부피는?', a * b * H / 3, { unit: 'cm³', figure: sqPyramidFig(a, b, H, { a: cm(a), b: cm(b), h: cm(H), label: `사각뿔의 겨냥도. 밑면은 가로 ${cm(a)}, 세로 ${cm(b)}인 직사각형이고, 사각뿔의 높이는 ${cm(H)}` }), explain: THIRD + `${frac(1, 3)} × (${a} × ${b}) × ${H} = ${a * b * H / 3}(cm³)`, facts: calc(`${a}*${b}*${H}/3`, [3]) });
      }
      if (n === 1) {
        const [a, b, H] = d.until(() => [d.int(3, 9), d.int(3, 12), d.int(4, 12)], (v) => v[0] * v[1] * v[2] % 6 === 0 && new Set(v).size === 3);
        return N(`밑면이 직각을 낀 두 변의 길이가 각각 ${a} cm, ${b} cm인 직각삼각형이고 높이가 ${H} cm인 삼각뿔의 부피는?`, a * b * H / 6, { unit: 'cm³', explain: `밑넓이는 ${a} × ${b} ÷ 2 = ${a * b / 2}(cm²)이다. ` + THIRD + `${frac(1, 3)} × ${a * b / 2} × ${H} = ${a * b * H / 6}(cm³)`, facts: calc(`${a}*${b}*${H}/2/3`, [2, 3]) });
      }
      const [S, H] = d.until(() => [d.int(12, 60), d.int(4, 12)], (v) => v[0] * v[1] % 3 === 0 && v[0] !== v[1]), name = NUMW[d.int(5, 8)] + '각뿔';
      return N(`밑넓이가 ${S} cm²이고 높이가 ${H} cm인 ${name}의 부피는?`, S * H / 3, { unit: 'cm³', explain: THIRD + `${frac(1, 3)} × ${S} × ${H} = ${S * H / 3}(cm³)`, facts: calc(`${S}*${H}/3`, [3]) });
    }, { count: 3 }),
    T('cone-volume', '원뿔의 부피', '①63 ②58', (d) => {
      const [r, h] = d.until(() => [d.int(2, 9), d.int(3, 12)], (v) => v[0] * v[0] * v[1] % 3 === 0 && v[0] !== v[1]);
      return N('다음 원뿔의 부피는?', r * r * h / 3, { unit: U3, figure: coneFig(r, h, { r: cm(r), h: cm(h), label: `원뿔의 겨냥도. 밑면의 반지름 ${cm(r)}, 높이 ${cm(h)}` }), explain: THIRD + `${frac(1, 3)} × (${PI} × ${r} × ${r}) × ${h} = ${r * r * h / 3}${PI}(cm³)`, facts: calc(`${r}*${r}*${h}/3`, [3]) });
    }),
    T('cone-pyr-surface', '각뿔의 겉넓이', '①54 ②59', (d) => {
      const a = d.int(3, 9), s = d.until(() => d.int(4, 14), (v) => v > a * 0.7 && v !== a), total = a * a + 2 * a * s;
      return N('다음 그림과 같이 밑면이 정사각형이고 옆면이 모두 합동인 이등변삼각형인 사각뿔의 겉넓이는?', total, {
        unit: 'cm²', figure: sqPyramidFig(a, a, Math.sqrt(s * s - a * a / 4), { a: cm(a), b: cm(a), s: cm(s), label: `사각뿔의 겨냥도. 밑면은 한 변의 길이가 ${cm(a)}인 정사각형이고, 옆면은 모두 밑변 ${cm(a)}, 높이 ${cm(s)}인 이등변삼각형이다` }),
        explain: `밑넓이는 ${a} × ${a} = ${a * a}(cm²), 옆넓이는 (${a} × ${s} ÷ 2) × 4 = ${2 * a * s}(cm²)이다. 겉넓이는 ${a * a} + ${2 * a * s} = ${total}(cm²)`, facts: calc(`${a}*${a}+${a}*${s}/2*4`, [2, 4])
      });
    }),
    T('cone-pyr-net', '전개도로 준 사각뿔의 겉넓이', '①55·56', (d) => {
      const a = d.int(3, 8), s = d.until(() => d.int(4, 12), (v) => v > a * 0.8 && v !== a), total = a * a + 2 * a * s, k = Math.min(210 / (a + 2 * s), 13);
      return N('다음 전개도로 만든 사각뿔의 겉넓이는?', total, {
        unit: 'cm²', figure: pyrNet(4, a * k, s * k, { a: cm(a), s: cm(s), label: `사각뿔의 전개도. 한 변의 길이가 ${cm(a)}인 정사각형의 변마다 밑변 ${cm(a)}, 높이 ${cm(s)}인 이등변삼각형이 하나씩 붙어 있다` }),
        explain: `밑면은 정사각형 1개, 옆면은 합동인 이등변삼각형 4개이다. ${a} × ${a} + (${a} × ${s} ÷ 2) × 4 = ${a * a} + ${2 * a * s} = ${total}(cm²)`, facts: calc(`${a}*${a}+${a}*${s}/2*4`, [2, 4])
      });
    }),
    T('cone-surface', '원뿔의 겉넓이', '①58 ②60', (d) => {
      const r = d.int(2, 6), l = r + d.int(2, 8), total = r * r + r * l;
      return N('다음 원뿔의 겉넓이는?', total, {
        unit: U2, figure: coneFig(r, Math.sqrt(l * l - r * r), { r: cm(r), l: cm(l), label: `원뿔의 겨냥도. 밑면의 반지름 ${cm(r)}, 모선 ${cm(l)}` }),
        explain: `밑넓이는 ${PI} × ${r} × ${r} = ${r * r}${PI}(cm²)이다. 옆면은 반지름의 길이가 ${l} cm, 호의 길이가 2 × ${PI} × ${r} = ${2 * r}${PI}(cm)인 부채꼴이므로 옆넓이는 ${frac(1, 2)} × ${l} × ${2 * r}${PI} = ${r * l}${PI}(cm²)이다. 겉넓이는 ${r * r}${PI} + ${r * l}${PI} = ${total}${PI}(cm²)`,
        facts: calc(`${r}*${r}+${r}*${l}`)
      });
    }),
    T('cone-net-surface', '전개도로 준 원뿔의 밑넓이, 옆넓이, 겉넓이', '②66 ①55', (d) => {
      const r = d.int(2, 6), l = d.until(() => d.int(4, 16), (v) => v >= r * 1.6 && v <= r * 4), k = Math.min(86 / l, 12);
      return M('다음 전개도로 만든 원뿔의 밑넓이, 옆넓이, 겉넓이를 각각 구하시오.', [{ label: '밑넓이', answer: r * r, unit: U2 }, { label: '옆넓이', answer: r * l, unit: U2 }, { label: '겉넓이', answer: r * r + r * l, unit: U2 }], {
        figure: coneNet(l * k, r * k, { l: cm(l), r: cm(r), label: `원뿔의 전개도. 옆면인 부채꼴의 반지름 ${cm(l)}, 밑면인 원의 반지름 ${cm(r)}` }),
        shown: `밑넓이 ${r * r}${PI} cm², 옆넓이 ${r * l}${PI} cm², 겉넓이 ${r * r + r * l}${PI} cm²`,
        explain: `밑넓이는 ${PI} × ${r} × ${r} = ${r * r}${PI}(cm²)이다. 부채꼴의 호의 길이는 밑면인 원의 둘레 2 × ${PI} × ${r} = ${2 * r}${PI}(cm)이므로 옆넓이는 ${frac(1, 2)} × ${l} × ${2 * r}${PI} = ${r * l}${PI}(cm²)이다. 겉넓이는 ${r * r + r * l}${PI} cm²이다.`,
        facts: { calc: [[`${r}*${r}`, 0], [`${r}*${l}`, 1], [`${r}*${r}+${r}*${l}`, 2]] }
      });
    }),
    T('cone-both', '높이와 모선(옆면의 높이)을 가려 쓰는 뿔의 겉넓이와 부피', '①54·58', (d, n) => {
      if (n === 0) {
        const [r, h, l] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [9, 12, 15], [12, 9, 15]]), S = r * r + r * l, Vv = r * r * h / 3;
        return M('다음 원뿔의 겉넓이와 부피를 각각 구하시오.', [{ label: '겉넓이', answer: S, unit: U2 }, { label: '부피', answer: Vv, unit: U3 }], {
          figure: coneFig(r, h, { r: cm(r), h: cm(h), l: cm(l), label: `원뿔의 겨냥도. 밑면의 반지름 ${cm(r)}, 높이 ${cm(h)}, 모선 ${cm(l)}` }), shown: `겉넓이 ${S}${PI} cm², 부피 ${Vv}${PI} cm³`,
          explain: `겉넓이에는 모선의 길이를 쓴다. ${PI} × ${r} × ${r} + ${PI} × ${r} × ${l} = ${S}${PI}(cm²). 부피에는 높이를 쓴다. ${frac(1, 3)} × (${PI} × ${r} × ${r}) × ${h} = ${Vv}${PI}(cm³)`,
          facts: { calc: [[`${r}*${r}+${r}*${l}`, 0], [`${r}*${r}*${h}/3`, 1]], unseen: [3] }
        });
      }
      const [a, H, s] = d.pick([[6, 4, 5], [12, 8, 10], [10, 12, 13], [16, 6, 10], [8, 3, 5], [18, 12, 15]]), S = a * a + 2 * a * s, Vv = a * a * H / 3;
      return M('다음 그림과 같이 밑면이 정사각형이고 옆면이 모두 합동인 이등변삼각형인 사각뿔의 겉넓이와 부피를 각각 구하시오.', [{ label: '겉넓이', answer: S, unit: 'cm²' }, { label: '부피', answer: Vv, unit: 'cm³' }], {
        figure: sqPyramidFig(a, a, H, { a: cm(a), b: cm(a), h: cm(H), s: cm(s), label: `사각뿔의 겨냥도. 밑면은 한 변의 길이가 ${cm(a)}인 정사각형이고, 사각뿔의 높이는 ${cm(H)}, 옆면인 이등변삼각형의 높이는 ${cm(s)}` }),
        explain: `겉넓이에는 옆면인 삼각형의 높이를 쓴다. ${a} × ${a} + (${a} × ${s} ÷ 2) × 4 = ${S}(cm²). 부피에는 사각뿔의 높이를 쓴다. ${frac(1, 3)} × (${a} × ${a}) × ${H} = ${Vv}(cm³)`,
        facts: { calc: [[`${a}*${a}+${a}*${s}/2*4`, 0], [`${a}*${a}*${H}/3`, 1]], unseen: [2, 3, 4] }
      });
    }, { count: 2 }),
    T('cone-side-radius', '원뿔의 옆넓이로 밑면의 반지름 구하기', '②64', (d) => {
      const r = d.int(2, 7), l = r + d.int(2, 8);
      return N(`모선의 길이가 ${l} cm이고 옆넓이가 ${r * l}${PI} cm²인 원뿔의 밑면의 반지름의 길이는?`, r, { unit: 'cm', explain: `원뿔의 옆넓이는 ${PI} × (밑면의 반지름의 길이) × (모선의 길이)이므로 밑면의 반지름의 길이는 ${r * l} ÷ ${l} = ${r}(cm)`, facts: calc(`${r * l}/${l}`) });
    })
  ]);

  // ── 구의 겉넓이와 부피 ───────────────────────────────────────
  const r3 = () => `${V('r')}<sup>3</sup>`, r2 = () => `${V('r')}<sup>2</sup>`;
  B.addTypes('7-2-4', 'sphere', [
    T('sphere-formula', '구의 겉넓이와 부피를 구하는 식', '①39', (d) => {
      const S = V('S'), W = V('V'), right = `${S} = 4${PI}${r2()}, ${W} = ${frac(4, 3)}${PI}${r3()}`;
      const options = d.shuffle([right, `${S} = 4${PI}${r2()}, ${W} = 4${PI}${r3()}`, `${S} = 2${PI}${r2()}, ${W} = ${frac(4, 3)}${PI}${r3()}`, `${S} = ${frac(4, 3)}${PI}${r2()}, ${W} = 4${PI}${r3()}`]);
      return C(`반지름의 길이가 ${V('r')}인 구의 겉넓이 ${S}와 부피 ${W}를 바르게 나타낸 것은?`, options, options.indexOf(right), { explain: `반지름의 길이가 ${V('r')}인 구의 겉넓이는 4${PI}${r2()}, 부피는 ${frac(4, 3)}${PI}${r3()}이다.`, facts: { truth: options.map((o) => o === right), want: true } });
    }),
    T('sphere-surface', '구의 겉넓이', '①71 ②72', (d, n) => {
      const r = d.int(2, 9);
      if (n === 0) return N('다음 구의 겉넓이는?', 4 * r * r, { unit: U2, figure: sphereFig(44, { r: cm(r), label: `구의 겨냥도. 반지름 ${cm(r)}` }), explain: `4 × ${PI} × ${r} × ${r} = ${4 * r * r}${PI}(cm²)`, facts: calc(`4*${r}*${r}`, [4]) });
      return N(`다음 그림과 같이 지름의 길이가 ${2 * r} cm인 구의 겉넓이는?`, 4 * r * r, { unit: U2, figure: sphereFig(44, { d: cm(2 * r), label: `구의 겨냥도. 지름 ${cm(2 * r)}` }), explain: `반지름의 길이는 ${2 * r} ÷ 2 = ${r}(cm)이다. 4 × ${PI} × ${r} × ${r} = ${4 * r * r}${PI}(cm²)`, facts: calc(`4*(${2 * r}/2)*(${2 * r}/2)`, [4, 2]) });
    }, { count: 2 }),
    T('sphere-volume', '구의 부피(자연수 계수)', '①71 ②72', (d) => {
      const r = d.pick([3, 6, 9]), v = 4 * r * r * r / 3;
      return N('다음 구의 부피는?', v, { unit: U3, figure: sphereFig(44, { r: cm(r), label: `구의 겨냥도. 반지름 ${cm(r)}` }), explain: `${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${v}${PI}(cm³)`, facts: calc(`4*${r}*${r}*${r}/3`, [4, 3]) });
    }),
    T('sphere-volume-frac', '구의 부피(분수 계수)', '①71 ②72', (d) => {
      const r = d.pick([1, 2, 4, 5, 7]), top = 4 * r * r * r;
      return F(`다음 그림과 같이 지름의 길이가 ${2 * r} cm인 구의 부피는?`, top, 3, { unit: U3, improper: true, anyForm: true, figure: sphereFig(44, { d: cm(2 * r), label: `구의 겨냥도. 지름 ${cm(2 * r)}` }), explain: `반지름의 길이는 ${2 * r} ÷ 2 = ${r}(cm)이다. ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${frac(top, 3)}${PI}(cm³)`, facts: { value: `4*(${2 * r}/2)*(${2 * r}/2)*(${2 * r}/2)/3`, unseen: [4, 2, 3] } });
    }),
    T('hemi-both', '반구의 부피와 겉넓이', '①73 ②73', (d) => {
      const r = d.pick([3, 6, 9]), v = 2 * r * r * r / 3, s = 3 * r * r;
      return M('다음 반구의 부피와 겉넓이를 각각 구하시오.', [{ label: '부피', answer: v, unit: U3 }, { label: '겉넓이', answer: s, unit: U2 }], {
        figure: hemiFig(52, { r: cm(r), label: `반구의 겨냥도. 반지름 ${cm(r)}` }), shown: `부피 ${v}${PI} cm³, 겉넓이 ${s}${PI} cm²`,
        explain: `부피는 구의 부피의 절반이다. ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${frac(1, 2)} = ${v}${PI}(cm³). 겉넓이는 구의 겉넓이의 절반에 평평한 면인 원의 넓이를 더한다. 4 × ${PI} × ${r} × ${r} × ${frac(1, 2)} + ${PI} × ${r} × ${r} = ${s}${PI}(cm²)`,
        facts: { calc: [[`4*${r}*${r}*${r}/3/2`, 0], [`4*${r}*${r}/2+${r}*${r}`, 1]], unseen: [4, 3, 2] }
      });
    }),
    T('hemi-volume-frac', '반구의 부피(분수 계수)', '①73 ②73', (d) => {
      const r = d.pick([2, 4, 5, 10]), top = 2 * r * r * r;
      return F(`지름의 길이가 ${2 * r} cm인 반구의 부피는?`, top, 3, { unit: U3, improper: true, anyForm: true, explain: `반지름의 길이는 ${r} cm이다. 반구의 부피는 구의 부피의 절반이므로 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${frac(1, 2)} = ${frac(top, 3)}${PI}(cm³)`, facts: { value: `4*(${2 * r}/2)*(${2 * r}/2)*(${2 * r}/2)/3/2`, unseen: [4, 2, 3] } });
    }),
    T('sphere-times', '구의 겉넓이와 단면의 넓이, 두 구의 부피의 비', '①74', (d, n) => {
      if (n === 0) {
        const r = d.int(2, 9);
        return N(`반지름의 길이가 ${r} cm인 구의 겉넓이는 이 구를 중심을 지나는 평면으로 자를 때 생기는 단면의 넓이의 몇 배인가?`, 4, { unit: '배', explain: `단면은 반지름의 길이가 ${r} cm인 원이므로 넓이는 ${r * r}${PI} cm²이고, 구의 겉넓이는 4 × ${PI} × ${r} × ${r} = ${4 * r * r}${PI}(cm²)이다. ${4 * r * r}${PI} ÷ ${r * r}${PI} = 4(배)`, facts: calc(`4*${r}*${r}/(${r}*${r})`, [4]) });
      }
      const [a, b] = d.pick([[2, 6], [2, 4], [3, 6], [4, 6], [2, 3], [3, 9], [6, 9], [1, 3], [1, 2]]), g = gcd(a * a * a, b * b * b);
      return M(`반지름의 길이가 각각 ${a} cm, ${b} cm인 두 구의 부피의 비를 가장 간단한 자연수의 비로 나타내시오.`, [{ answer: a * a * a / g, unit: ':' }, { answer: b * b * b / g }], {
        explain: `두 구의 부피는 ${frac(4, 3)}${PI} × ${a * a * a}, ${frac(4, 3)}${PI} × ${b * b * b}이므로 부피의 비는 ${a * a * a} : ${b * b * b} = ${a * a * a / g} : ${b * b * b / g}이다.`,
        facts: { calc: [[`${a}*${a}*${a}/${g}`, 0], [`${b}*${b}*${b}/${g}`, 1]], unseen: [g] }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
