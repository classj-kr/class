// 중학교 1학년 2학기 4단원 입체도형의 성질 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 7-2-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 평평한 면이 하나라도 있으면 다면체라고 여긴다(원기둥·원뿔대·반구). 평면도형(정육각형, 원)을 입체도형과 섞어 센다.
//  - 이름에 붙은 수가 면의 개수라고 여긴다(칠각뿔대를 칠면체로). n각뿔대의 면은 n + 2개, n각뿔의 면은 n + 1개이다. 그림에서는 보이지 않는 면과 잘린 자리의 면을 빠뜨린다.
//  - 각 면이 합동인 정다각형이기만 하면 정다면체라고 여긴다(각 꼭짓점에 모인 면의 개수도 같아야 한다). 거꾸로, 꼭짓점에 모인 면의 개수만 같으면 된다고 여긴다.
//  - 회전체를 회전축을 포함하는 평면으로 자른 단면을 돌리기 전의 평면도형 그대로라고 여긴다(단면은 회전축에 대칭이므로 그 두 배이다).
//  - 겉넓이에서 밑넓이를 빠뜨리거나(원뿔은 밑면 1개, 기둥은 2개), 자르면 새로 생기는 면(반원기둥의 직사각형, 4분의 1을 잘라 낸 구의 반원 2개)을 빠뜨린다.
//    거꾸로, 두 입체를 붙이면 맞붙은 면은 겉이 아닌데도 더한다. 굴러가며 닿는 것은 옆면뿐인데 겉넓이 전체를 쓴다.
//  - 뿔의 부피에서 3분의 1을 빠뜨리거나, 치수가 없으면 구할 수 없다고 여긴다(밑면과 높이가 같으면 뿔의 부피는 기둥의 부피의 3분의 1이다).
//  - 원뿔의 전개도에서 부채꼴의 호의 길이가 밑면의 둘레와 같다는 것을 쓰지 못하고, 모선과 높이를 바꾸어 쓴다.
//  - 반지름이 2배, 3배가 되면 부피도 2배, 3배가 된다고 여긴다.
//
// 실력에는 ① 문제의 그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(조건으로 이름 대기, 개수 하나에서 다른 개수 구하기,
// 겉넓이·부피에서 길이를 거꾸로 구하기, 전개도에서 밑면의 반지름이나 중심각 구하기, 입체 둘을 붙이거나 뺀 부피, 뿔대의 부피, 평면도형 하나를 돌린 회전체의 겉넓이·부피)만 실었다.
// 처음 지을 때는 교육과정의 금(복잡하게 변형된 입체)에 걸리지 않게, 입체는 둘까지만 붙이거나 빼고 겉넓이는 세 번까지만 셈했다. 닮음이 있어야 나오는 길이는 모두 그림에 적었다.
//
// 2026-10-13 다시 싣기 — 「수학 실력에 필요한 문제는 모두 싣는다」는 기준으로, 처음에 꼬임·복잡한 입체·세 번 넘게 셈하는 겉넓이·요령·필요한 정도를 넘는 단면이라 뺐던 꼴을 다시 보고
// 실력 28유형(42문항)을 실력 묶음 끝에, 기본 1유형(오각기둥의 겉넓이)을 기둥 묶음 끝에 덧붙였다(파일 가운데의 「2026-10-13 다시 실은 꼴」과 맨 끝). 그 유형들에서 더 걸리는 곳:
//  - 정다면체의 면의 한가운데를 이은 다면체의 이름을 처음 이름 그대로 답한다(새 꼭짓점의 개수 = 처음 면의 개수). 면의 변을 모두 더한 수를 모서리의 개수라 한다(모서리 하나는 두 면의 변이다).
//  - 세 점을 이은 삼각형이 곧 단면이라 여긴다. 원기둥을 비스듬히 자르면 사다리꼴이 나온다고 여긴다. 회전축에서 떨어진 도형을 돌린 입체의 빈 곳(고리, 원기둥 모양의 구멍)을 빼지 않는다.
//  - 구멍·홈이 있는 기둥의 겉넓이에서 안쪽 옆면을 빠뜨리거나 밑넓이에서 구멍을 빼지 않는다. 원뿔대의 옆넓이를 큰 원뿔의 옆넓이 그대로 적는다. 쌓거나 이어 붙인 입체의 맞붙은 면을 겉넓이에 넣는다.
//  - 치수가 하나도 없거나(잘라 낸 삼각뿔의 비, 구 안의 원뿔) 높이가 적혀 있지 않으면(꼭 맞게 든 구 여럿) 구할 수 없다고 여긴다. 기울인 그릇의 물이 삼각뿔인지 삼각기둥인지 가리지 못한다.
// 상위 학년 내용(피타고라스 정리, 닮음)이 있어야 나오는 길이는 이 유형들에서도 모두 그림이나 글에 적어 주었다. 그대로 뺀 꼴과 까닭은 싣기_대조표.md 에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, N, M, C, F } = B.kit;
  const { V, gcd } = B.kit.mid;
  const K = B.kit.m724;
  const { SOLID, MEAS, PI, U2, U3, UL, TAGS, KEYS, cm, calc, NUMW, hedron, solid, cnt, cntSay, REG, setOptions, words, listed, POLY_NAMES, ROUND_NAMES,
    RAD, TILT, f1, xy, CREAM, SKY, SAND, INK, stroke, curve, blob, fill, dot, onEll, arcD, tail, canvas, one, tiles, half, kindOf, beside, corner, leader,
    addCyl, addCone, addCup, addSphere, addDome, addBowl, addPoly, prismOf, bipyramidOf, cutBoxOf, cylFig, coneFig, coneFrustumFig, coneNet, frustumNet, spx, spin, hollowFig,
    RIGHT, sqFrustumFig, sectorPrismFig, triPrismNet } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const PLANE_NAMES = ['정삼각형', '정육각형', '원', '직사각형', '부채꼴', '사다리꼴', '정오각형'];
  const LV = () => V('l');
  const SPIN_ASK = (what, ask) => `다음 ${what} 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 ${ask}`;

  // ── 그림 ─────────────────────────────────────────────────────
  // 두 입체를 붙인 입체. kind: 'cylCone'(원기둥 위에 원뿔), 'cylDome'(원기둥 위에 반구), 'bicone'(원뿔 2개를 밑면끼리), 'capsule'(원기둥의 위아래에 반구), 'scoop'(반구 아래에 원뿔)
  // r: 반지름, a: 위쪽 입체의 높이, b: 아래쪽 입체의 높이(cm). o: { r, a, b, l: 글, label }
  function joined(kind, r, a, b, o) {
    const round = kind === 'cylDome' || kind === 'capsule' || kind === 'scoop', k = Math.min(46 / r, 124 / ((round ? r : a) + b + (kind === 'capsule' ? r : 0))), R = Math.max(26, r * k), ry = R * TILT, up = round ? R : Math.max(30, a * k), low = Math.max(30, b * k), cv = canvas(), mid = [0, up];
    const w = (c, text) => cv.write(c, text, kindOf(text));
    if (kind === 'capsule') addBowl(cv, [0, up + low], R, { bare: true });
    if (kind === 'bicone' || kind === 'scoop') addCup(cv, mid, R, low); else { addCyl(cv, mid, R, low, { bare: true }); cv.add(curve(arcD(mid, R, ry, 180, 360), 'dash')); }
    if (round) { addDome(cv, mid, R, { bare: true }); cv.add(curve(arcD(mid, R, ry, 180, 0))); } else addCone(cv, [0, 0], R, up, { bare: true });
    cv.add(stroke(mid, [R, up], 'dash') + dot(mid));
    if (o.r) leader(cv, [R + 8 + half(o.r), up - 14], [R * 0.6, up], o.r);
    if (!round && o.a) { cv.add(stroke([0, 0], mid, 'dash') + corner(mid, [0, 0], [R, up])); leader(cv, [-R - 4 - half(o.a), up * 0.3], [0, up * 0.5], o.a); }
    if (kind === 'bicone') { cv.add(stroke(mid, [0, up + low], 'dash')); if (o.b) leader(cv, [-R - 4 - half(o.b), up + low * 0.7], [0, up + low * 0.5], o.b); }
    else if (kind === 'scoop') { if (o.l) beside(cv, [R, up], [0, up + low], [-R, up + low], o.l); }
    else if (o.b) w([R + 5 + half(o.b), up + low / 2 + 4], o.b);
    return cv.out(o.label);
  }
  // 구의 4분의 1(앞쪽 위)을 잘라 낸 입체. 잘린 면은 반원 2개(하나는 누워 있고 하나는 서 있다). o: { r: 반지름 글, label }
  function cutSphereFig(R, o) {
    const cv = canvas(), c = [0, 0], ry = R * TILT, phi = 38, co = Math.cos(phi * RAD), si = Math.sin(phi * RAD), E1 = [R * co, -ry * si], E2 = [-R * co, ry * si];
    // 서 있는 잘린 면의 둘레: 잘린 모서리(E2–E1)의 방향과 위쪽 방향으로 그린 반원
    const up = (s0, s1) => { let out = ''; for (let i = 0; i <= 24; i += 1) { const s = (s0 + (s1 - s0) * i / 24) * RAD; out += (i ? 'L' : 'M') + xy([R * co * Math.cos(s), -ry * si * Math.cos(s) - R * Math.sin(s)]); } return out; };
    cv.box(c, R, R);
    cv.add(blob(arcD(c, R, R, 0, 180), CREAM) + blob(arcD(c, R, ry, 0, 360), CREAM) + blob(arcD(c, R, R, 180, 270) + tail(up(90, 180)) + tail(arcD(c, R, ry, 180 - phi, 180)), CREAM));
    cv.add(blob(up(0, 180), SKY) + blob(arcD(c, R, ry, -phi, 180 - phi), SAND));
    cv.add(curve(arcD(c, R, ry, 180, 360 - phi), 'dash') + curve(arcD(c, R, R, 0, 180)) + curve(arcD(c, R, R, 180, 270)) + curve(up(0, 180)) + stroke(E2, E1) + curve(arcD(c, R, ry, -phi, 180 - phi)) + curve(arcD(c, R, ry, 180 - phi, 180), 'thin') + dot(c));
    if (o.r) leader(cv, [R + 9 + half(o.r), -R * 0.45], [E1[0] / 2, E1[1] / 2], o.r);
    return cv.out(o.label);
  }
  // 원기둥에 꼭 맞게 들어 있는 구. o: { r: 구의 반지름 글, label }
  function fitFig(R, o) {
    const cv = canvas(), c = [0, R];
    addCyl(cv, [0, 0], R, 2 * R);
    cv.add('<circle cx="0" cy="' + R + '" r="' + R + '" style="fill:none;stroke:' + INK + ';stroke-width:1.2"/>' + curve(arcD(c, R, R * TILT, 180, 360), 'dash') + curve(arcD(c, R, R * TILT, 180, 0), 'thin'));
    if (o.r) { const p = onEll(c, R, R, -38); cv.add(stroke(c, p, 'thin') + dot(c)); leader(cv, [R + 9 + half(o.r), R * 0.5], [(c[0] + p[0]) / 2, (c[1] + p[1]) / 2], o.r); }
    return cv.out(o.label);
  }
  // 직육면체 ABCD-EFGH(윗면 ABCD, 아랫면 EFGH)와 세 꼭짓점 B, G, D를 지나는 평면. C 가 오른쪽 앞 위에 있어 잘린 자리가 보인다.
  function boxCutFig(label) {
    const cv = canvas(), w = 100, dp = 76, h = 66, blue = 'stroke:#1d4ed8';
    const P = addPoly(cv, [0, 0], [[0, dp, h], [0, 0, h], [w, 0, h], [w, dp, h], [0, dp, 0], [0, 0, 0], [w, 0, 0], [w, dp, 0]], [[0, 1, 2, 3], [4, 5, 6, 7], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [0, 1, 5, 4]], { sk: 0.5, tl: 0.42 });
    cv.add(fill([P[1], P[6], P[3]], 'rgba(96,165,250,0.3)') + stroke(P[1], P[6], 'thin', blue) + stroke(P[6], P[3], 'thin', blue) + stroke(P[1], P[3], 'thin', blue));
    [['A', -8, -7], ['B', -10, 0], ['C', 9, 11], ['D', 9, -6], ['E', -9, -7], ['F', -9, 7], ['G', 2, 11], ['H', 10, 3]].forEach(([name, dx, dy], i) => cv.write([P[i][0] + dx, P[i][1] + dy], name));
    return cv.out(label);
  }
  // 직각삼각형 ABC(각 C가 직각, 변 AC는 세로, 변 BC는 가로). o: { p: 변 AC의 길이 글, q: 변 BC의 길이 글, label }
  function triABC(p, q, o) {
    const k = Math.min(100 / q, 96 / p, 22), A = [q * k, 0], Bp = [0, p * k], Cp = [q * k, p * k], cv = canvas();
    [A, Bp, Cp].forEach(cv.point);
    cv.add(K.shape([A, Bp, Cp], SKY) + corner(Cp, A, Bp));
    cv.write([A[0] + 2, A[1] - 9], 'A'); cv.write([Bp[0] - 9, Bp[1] + 2], 'B'); cv.write([Cp[0] + 9, Cp[1] + 3], 'C');
    cv.write([Cp[0] + 6 + half(o.p), p * k / 2], o.p, 'is-length'); cv.write([q * k / 2, p * k + 10], o.q, 'is-length');
    return cv.out(o.label);
  }

  B.addGroup('7-2-4', {
    id: 'hard', title: '실력 문제', standard: MEAS,
    types: [
      // ── ① 문제의 그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-same-faces', '꼭짓점을 잘라 낸 다면체와 면의 개수가 같은 다면체', '심5 / 기본 ①5 ②4', (d) => {
        // 함정: 잘린 자리의 면과 보이지 않는 면을 세지 않는 아이(6개 → 사각뿔대, 오각뿔), 이름의 수가 면의 개수라고 여기는 아이(칠각뿔, 칠각기둥, 칠각뿔대).
        const seven = d.shuffle(['육각뿔', '오각기둥', '오각뿔대']).slice(0, 2), others = d.shuffle([['칠각뿔', 8], ['칠각기둥', 9], ['칠각뿔대', 9]]).slice(0, 2).concat(d.shuffle([['사각뿔대', 6], ['오각뿔', 6], ['육각기둥', 8]]).slice(0, 1));
        const rows = d.shuffle(seven.map((w) => [w, 7]).concat(others)), labels = KEYS.slice(0, 5), flags = rows.map((r) => r[1] === 7), made = setOptions(d, labels, flags);
        const p = cutBoxOf(46, 34, 66, 30);
        return C('다음 그림은 직육면체의 한 꼭짓점을 잘라 낸 다면체이다. 보기에서 이 다면체와 면의 개수가 같은 것을 모두 고른 것은?', made.options, made.answer, {
          figure: one((cv) => addPoly(cv, [0, 0], p.verts, p.faces, { sk: 0.5, tl: 0.42 }), '직육면체의 한 꼭짓점을 세 모서리 위의 점을 지나는 평면으로 잘라 낸 다면체의 겨냥도. 잘린 자리에 삼각형인 면이 하나 생겼다') + words(rows.map((r) => r[0]), labels),
          explain: `그림의 다면체의 면은 직육면체의 면 6개에 잘린 자리의 면 1개를 더한 7개이다. ` + rows.map((r) => `${r[0]} ${r[1]}개`).join(', ') + '이므로 면이 7개인 것을 고른다.',
          facts: { sets: { labels, flags, options: made.sets } }
        });
      }, { standard: SOLID }),
      H('hard-not-regular', '정다면체가 아닌 까닭', '기본 ①22 ②22', (d, n) => {
        // 함정(차례 0): 면이 모두 합동인 정삼각형이라는 것만 보는 아이, 면의 개수로 이름을 대는 아이, 꼭짓점에 모인 면을 세어 보지 않는 아이.
        // 함정(차례 1): 꼭짓점에 모인 면의 개수가 같다는 것만 보는 아이, 면이 모두 정다각형이면 된다고 여기는 아이.
        const p = n ? prismOf(3, 40, 69, -84) : bipyramidOf(3, 46, 65, -84);
        const rows = d.shuffle(n ? [
          ['각 꼭짓점에 모인 면의 개수는 3개로 같지만, 면이 모두 합동은 아니므로 정다면체가 아니다.', true], ['각 꼭짓점에 모인 면의 개수가 모두 같으므로 정다면체이다.', false],
          ['각 면이 모두 정다각형이므로 정다면체이다.', false], ['각 꼭짓점에 모인 면의 개수가 서로 다르므로 정다면체가 아니다.', false]
        ] : [
          ['각 꼭짓점에 모인 면의 개수가 3개인 곳과 4개인 곳이 있으므로 정다면체가 아니다.', true], ['각 면이 모두 합동인 정다각형이므로 정다면체이다.', false],
          ['면이 6개이므로 정육면체이다.', false], ['각 꼭짓점에 모인 면의 개수가 모두 3개이므로 정다면체이다.', false]
        ]);
        return C(n ? '다음 그림은 정삼각형 2개와 정사각형 3개로 이루어진 다면체이다. 이 다면체에 대한 설명으로 옳은 것은?' : '다음 그림은 합동인 정삼각형 6개로 이루어진 다면체이다. 이 다면체에 대한 설명으로 옳은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: one((cv) => addPoly(cv, [0, 0], p.verts, p.faces), n ? '밑면이 정삼각형이고 옆면이 정사각형 3개인 삼각기둥의 겨냥도' : '삼각뿔 2개를 밑면끼리 맞붙인 모양의 다면체의 겨냥도'),
          explain: '정다면체는 각 면이 모두 합동인 정다각형이고, 각 꼭짓점에 모인 면의 개수가 같은 다면체이다. ' + (n ? '이 다면체는 꼭짓점마다 면이 3개씩 모이지만 면이 정삼각형과 정사각형의 두 가지이다.' : '이 다면체는 면이 모두 합동인 정삼각형이지만, 위와 아래의 꼭짓점에는 면이 3개, 가운데의 세 꼭짓점에는 면이 4개 모인다.'),
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }, { count: 2, standard: SOLID }),
      H('hard-third', '높이만 알려 준 뿔 모양 그릇과 기둥 모양 그릇', '기본 ②96', (d) => {
        // 함정: 밑면의 길이가 없어 구할 수 없다고 여기는 아이, 뿔의 부피를 기둥의 절반이라 여기는 아이. 밑면이 합동이고 높이가 같으면 뿔의 부피는 기둥의 부피의 3분의 1이다.
        const h = d.pick([6, 9, 12, 15, 18, 21]), [pole, peak] = d.pick([['사각기둥', '사각뿔'], ['원기둥', '원뿔'], ['삼각기둥', '삼각뿔']]);
        return N(`밑면이 합동이고 높이가 ${h} cm로 같은 ${pole} 모양의 그릇과 ${peak} 모양의 그릇이 있다. ${peak} 모양의 그릇에 물을 가득 채워 비어 있는 ${pole} 모양의 그릇에 모두 부었을 때, ${pole} 모양의 그릇에 담긴 물의 높이는? (단, 그릇의 두께는 생각하지 않는다.)`, h / 3, {
          unit: 'cm', explain: `밑면이 합동이고 높이가 같은 뿔의 부피는 기둥의 부피의 ${frac(1, 3)}이다. 물은 ${pole} 모양의 그릇의 ${frac(1, 3)}만큼 차므로 물의 높이는 ${h} ÷ 3 = ${h / 3}(cm)`, facts: calc(`${h}/3`, [3])
        });
      }),
      H('hard-half-cyl', '밑면이 반원인 기둥의 겉넓이', '심36·37 / 기본 ①49', (d, n) => {
        // 함정: 잘린 면(직사각형)을 넣지 않는 아이, 반원인 밑면을 1개만 넣는 아이, 굽은 옆면을 원기둥의 옆넓이 그대로 넣는 아이.
        const r = d.int(2, 6), h = d.until(() => d.int(4, 10), (v) => v !== 2 * r && v !== r), a = r * r + r * h, b = 2 * r * h, dia = 2 * r;
        const lead = `밑넓이는 반원 2개이므로 ${PI} × ${r} × ${r} = ${r * r}${PI}(cm²)이다. 굽은 옆면은 원기둥의 옆넓이의 절반이고, 평평한 옆면은 가로 ${dia} cm, 세로가 기둥의 높이인 직사각형이다. `;
        if (n === 0) return M('다음 그림은 원기둥을 밑면의 지름을 지나는 평면으로 잘라 만든, 밑면이 반원인 기둥이다. 이 기둥의 겉넓이를 구하시오.', [{ answer: a, unit: 'π +' }, { answer: b, unit: 'cm²' }], {
          figure: sectorPrismFig(180, r, h, { d: cm(dia), h: cm(h), label: `밑면이 반원인 기둥의 겨냥도. 밑면인 반원의 지름 ${cm(dia)}, 기둥의 높이 ${cm(h)}. 평평한 옆면이 앞을 향한다` }), shown: `(${a}${PI} + ${b}) cm²`,
          explain: lead + `굽은 옆면의 넓이는 ${PI} × ${r} × ${h} = ${r * h}${PI}(cm²), 평평한 옆면의 넓이는 ${dia} × ${h} = ${b}(cm²)이다. 겉넓이는 ${r * r}${PI} + ${r * h}${PI} + ${b} = ${a}${PI} + ${b}(cm²)`,
          facts: { calc: [[`(${dia}/2)*(${dia}/2)+(${dia}/2)*${h}`, 0], [`${dia}*${h}`, 1]], unseen: [2] }
        });
        return N(`다음 그림은 원기둥을 밑면의 지름을 지나는 평면으로 잘라 만든, 밑면이 반원인 기둥이다. 이 기둥의 겉넓이가 (${a}${PI} + ${b}) cm²일 때, 기둥의 높이는?`, h, {
          unit: 'cm', figure: sectorPrismFig(180, r, h, { d: cm(dia), label: `밑면이 반원인 기둥의 겨냥도. 밑면인 반원의 지름 ${cm(dia)}. 평평한 옆면이 앞을 향한다` }),
          explain: lead + `겉넓이에서 ${PI}가 없는 부분 ${b} cm²가 평평한 옆면의 넓이이므로 높이는 ${b} ÷ ${dia} = ${h}(cm)이다. 이때 ${r * r}${PI} + ${PI} × ${r} × ${h} = ${a}${PI}(cm²)이다.`,
          facts: calc(`${b}/${dia}`)
        });
      }, { count: 2 }),
      H('hard-quarter-sphere', '구의 4분의 1을 잘라 낸 입체도형의 겉넓이와 부피', '기본 ①75 ②75', (d, n) => {
        // 함정: 잘린 자리에 새로 생긴 면(반원 2개 = 원 1개)을 넣지 않는 아이(3πr²), 구의 겉넓이를 그대로 적는 것이 우연이라 여겨 다시 줄이는 아이.
        const r = d.int(2, 9), figure = cutSphereFig(52, { r: cm(r), label: `구의 4분의 1을 잘라 낸 입체도형의 겨냥도. 구의 반지름 ${cm(r)}. 잘린 자리에 반원인 면이 2개 있다` });
        if (n === 0) return N(`다음 그림은 반지름의 길이가 ${r} cm인 구의 ${frac(1, 4)}을 잘라 내고 남은 입체도형이다. 이 입체도형의 겉넓이는?`, 4 * r * r, {
          unit: U2, figure, explain: `굽은 면은 구의 겉넓이의 ${frac(3, 4)}이므로 4 × ${PI} × ${r} × ${r} × ${frac(3, 4)} = ${3 * r * r}${PI}(cm²)이다. 잘린 자리의 면은 반원 2개, 곧 원 1개이므로 ${r * r}${PI} cm²이다. 겉넓이는 ${3 * r * r}${PI} + ${r * r}${PI} = ${4 * r * r}${PI}(cm²)`,
          facts: calc(`4*${r}*${r}*3/4+${r}*${r}/2*2`, [3, 2])
        });
        return N(`다음 그림은 반지름의 길이가 ${r} cm인 구의 ${frac(1, 4)}을 잘라 내고 남은 입체도형이다. 이 입체도형의 부피는?`, r * r * r, {
          unit: U3, figure, explain: `구의 부피의 ${frac(3, 4)}이다. ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${frac(3, 4)} = ${r * r * r}${PI}(cm³)`, facts: calc(`4*${r}*${r}*${r}/3*3/4`, [3])
        });
      }, { count: 2 }),
      H('hard-roller', '원기둥 모양의 롤러로 칠한 넓이', '심35', (d) => {
        // 함정: 원기둥의 겉넓이 전체(두 밑면까지)를 쓰는 아이. 굴러가며 벽에 닿는 것은 옆면뿐이다.
        const r = d.int(3, 7), h = d.pick([10, 15, 20, 25, 30]), k = d.int(2, 4);
        return N(`밑면의 반지름의 길이가 ${r} cm, 높이가 ${h} cm인 원기둥 모양의 롤러에 페인트를 묻혀 벽에 대고 ${k}바퀴 굴렸다. 페인트가 칠해진 부분의 넓이는?`, 2 * r * h * k, {
          unit: U2, explain: `한 바퀴 굴릴 때 칠해지는 넓이는 원기둥의 옆넓이와 같다. 옆넓이는 2 × ${PI} × ${r} × ${h} = ${2 * r * h}${PI}(cm²)이므로 ${k}바퀴 굴리면 ${2 * r * h}${PI} × ${k} = ${2 * r * h * k}${PI}(cm²)`, facts: calc(`2*${r}*${h}*${k}`, [2])
        });
      }),
      H('hard-equal-surface', '구(반구)와 겉넓이가 같은 원뿔의 모선의 길이', '심62 / 기본 ①80 ②81', (d, n) => {
        // 함정: 원뿔의 겉넓이에서 밑넓이를 빼먹는 아이(구: 4r, 반구: 3r), 반구의 겉넓이에서 평평한 면을 빼먹는 아이(r).
        const r = d.int(2, 8), ball = n ? '반구' : '구', k = n ? 3 : 4;
        return N(`반지름의 길이가 ${r} cm인 ${ball}와 밑면의 반지름의 길이가 ${r} cm인 원뿔의 겉넓이가 서로 같을 때, 원뿔의 모선의 길이는?`, (k - 1) * r, {
          unit: 'cm',
          explain: `${ball}의 겉넓이는 ${n ? `2 × ${PI} × ${r} × ${r} + ${PI} × ${r} × ${r}` : `4 × ${PI} × ${r} × ${r}`} = ${k * r * r}${PI}(cm²)이다. 원뿔의 밑넓이는 ${r * r}${PI} cm²이므로 옆넓이는 ${k * r * r}${PI} − ${r * r}${PI} = ${(k - 1) * r * r}${PI}(cm²)이다. 옆넓이는 ${PI} × ${r} × (모선의 길이)이므로 모선의 길이는 ${(k - 1) * r * r} ÷ ${r} = ${(k - 1) * r}(cm)`,
          facts: calc(`(${k}*${r}*${r}-${r}*${r})/${r}`, [k])
        });
      }, { count: 2 }),
      H('hard-joined-surface', '두 입체도형을 붙인 입체도형의 겉넓이', '기본 ①82·83 ②95', (d, n) => {
        // 함정: 두 입체의 겉넓이를 그대로 더하는 아이(맞붙은 원은 겉이 아니다), 원기둥의 밑넓이나 반구의 평평한 면을 넣는 아이.
        if (n === 0) {
          const r = d.int(2, 5), h = d.until(() => d.int(4, 9), (v) => v !== r && v !== 2 * r), S = 2 * r * h + 4 * r * r;
          return N('다음 그림은 원기둥의 위와 아래에 반구를 하나씩 붙인 입체도형이다. 이 입체도형의 겉넓이는?', S, {
            unit: U2, figure: joined('capsule', r, 0, h, { r: cm(r), b: cm(h), label: `원기둥의 위와 아래에 반구를 하나씩 붙인 입체도형의 겨냥도. 원기둥의 밑면과 반구의 반지름 ${cm(r)}, 원기둥의 높이 ${cm(h)}` }),
            explain: `맞붙은 면은 겉이 아니므로 원기둥의 옆넓이와 두 반구의 굽은 면의 넓이만 더한다. 반구 2개의 굽은 면은 구 1개의 겉넓이와 같다. 2 × ${PI} × ${r} × ${h} + 4 × ${PI} × ${r} × ${r} = ${2 * r * h}${PI} + ${4 * r * r}${PI} = ${S}${PI}(cm²)`,
            facts: calc(`2*${r}*${h}+4*${r}*${r}`, [2, 4])
          });
        }
        const r = d.int(2, 5), l = r + d.int(2, 6), S = 2 * r * r + r * l;
        return N('다음 그림은 반구의 평평한 면에 원뿔의 밑면을 붙인 입체도형이다. 이 입체도형의 겉넓이는?', S, {
          unit: U2, figure: joined('scoop', r, 0, Math.sqrt(l * l - r * r), { r: cm(r), l: cm(l), label: `반구의 아래에 원뿔을 붙인 입체도형의 겨냥도. 반구와 원뿔의 밑면의 반지름 ${cm(r)}, 원뿔의 모선 ${cm(l)}` }),
          explain: `맞붙은 면은 겉이 아니므로 반구의 굽은 면의 넓이와 원뿔의 옆넓이만 더한다. 2 × ${PI} × ${r} × ${r} + ${PI} × ${r} × ${l} = ${2 * r * r}${PI} + ${r * l}${PI} = ${S}${PI}(cm²)`,
          facts: calc(`2*${r}*${r}+${r}*${l}`, [2])
        });
      }, { count: 2 }),
      H('hard-frustum-surface', '사각뿔대의 겉넓이', '기본 ②70', (d) => {
        // 함정: 두 밑면이 합동이라 여겨 한 밑면의 넓이를 2배 하는 아이, 옆면을 직사각형이나 삼각형으로 셈하는 아이. 각뿔대의 두 밑면은 크기가 다르고 옆면은 사다리꼴이다.
        const a1 = d.int(2, 5), a2 = a1 + d.pick([2, 4]), s = d.until(() => d.int(4, 9), (v) => v !== a1 && v !== a2), S = a1 * a1 + a2 * a2 + 2 * (a1 + a2) * s;
        return N('다음 그림과 같이 두 밑면이 모두 정사각형이고 옆면이 모두 합동인 사다리꼴인 사각뿔대의 겉넓이는?', S, {
          unit: 'cm²', figure: sqFrustumFig(a1, a2, Math.sqrt(s * s - (a2 - a1) * (a2 - a1) / 4), { a1: cm(a1), a2: cm(a2), s: cm(s), label: `사각뿔대의 겨냥도. 윗면은 한 변 ${cm(a1)}인 정사각형, 아랫면은 한 변 ${cm(a2)}인 정사각형이고, 옆면은 모두 윗변 ${cm(a1)}, 아랫변 ${cm(a2)}, 높이 ${cm(s)}인 사다리꼴이다` }),
          explain: `두 밑넓이는 ${a1} × ${a1} = ${a1 * a1}(cm²), ${a2} × ${a2} = ${a2 * a2}(cm²)이다. 옆면은 사다리꼴 4개이므로 옆넓이는 (${a1} + ${a2}) × ${s} ÷ 2 × 4 = ${2 * (a1 + a2) * s}(cm²)이다. 겉넓이는 ${a1 * a1} + ${a2 * a2} + ${2 * (a1 + a2) * s} = ${S}(cm²)`,
          facts: calc(`${a1}*${a1}+${a2}*${a2}+(${a1}+${a2})*${s}/2*4`, [2, 4])
        });
      }),
      H('hard-frustum-round', '원뿔대의 전개도에서 옆면의 둘레의 길이', '심33', (d) => {
        // 함정: 옆면의 굽은 두 변을 모선으로 셈하는 아이, 호 하나만 더하는 아이. 두 호의 길이는 두 밑면의 둘레와 같고 곧은 두 변이 모선이다.
        const r1 = d.int(2, 4), r2 = r1 + d.int(1, 4), l = d.until(() => d.int(4, 9), (v) => v > r2 - r1 + 1 && v !== r1 && v !== r2), a = 2 * r1 + 2 * r2, b = 2 * l;
        return M('다음은 원뿔대와 그 전개도이다. 전개도에서 옆면의 둘레의 길이를 구하시오.', [{ answer: a, unit: 'π +' }, { answer: b, unit: 'cm' }], {
          figure: coneFrustumFig(r1, r2, Math.sqrt(l * l - (r2 - r1) * (r2 - r1)), { r1: cm(r1), r2: cm(r2), l: cm(l), label: `원뿔대의 겨냥도. 두 밑면의 반지름 ${cm(r1)}, ${cm(r2)}, 모선 ${cm(l)}` }) + frustumNet('원뿔대의 전개도. 옆면은 큰 부채꼴에서 작은 부채꼴을 뺀 모양이고, 그 안쪽 호에 작은 원이, 바깥쪽 호에 큰 원이 붙어 있다'),
          shown: `(${a}${PI} + ${b}) cm`,
          explain: `옆면의 두 호의 길이는 두 밑면의 둘레의 길이와 같으므로 2 × ${PI} × ${r1} = ${2 * r1}${PI}(cm), 2 × ${PI} × ${r2} = ${2 * r2}${PI}(cm)이다. 곧은 두 변은 모선이므로 ${l} cm씩이다. 둘레의 길이는 ${2 * r1}${PI} + ${2 * r2}${PI} + ${l} × 2 = ${a}${PI} + ${b}(cm)`,
          facts: { calc: [[`2*${r1}+2*${r2}`, 0], [`2*${l}`, 1]], unseen: [2] }
        });
      }, { standard: SOLID }),
      H('hard-arc-surface', '부채꼴의 호의 길이로 원뿔의 겉넓이 구하기', '심56', (d) => {
        // 함정: 호의 길이를 그대로 반지름처럼 쓰는 아이, 옆넓이만 구하고 밑넓이를 넣지 않는 아이. 호의 길이는 밑면의 둘레와 같다.
        const r = d.int(2, 6), l = r + d.int(2, 7), S = r * r + r * l;
        return N(`모선의 길이가 ${l} cm이고, 전개도에서 옆면인 부채꼴의 호의 길이가 ${2 * r}${PI} cm인 원뿔의 겉넓이는?`, S, {
          unit: U2, explain: `부채꼴의 호의 길이는 밑면인 원의 둘레의 길이와 같으므로 밑면의 반지름의 길이는 ${2 * r} ÷ 2 = ${r}(cm)이다. 밑넓이는 ${r * r}${PI} cm², 옆넓이는 ${frac(1, 2)} × ${l} × ${2 * r}${PI} = ${r * l}${PI}(cm²)이므로 겉넓이는 ${S}${PI} cm²이다.`,
          facts: calc(`(${2 * r}/2)*(${2 * r}/2)+${l}*${2 * r}/2`, [2])
        });
      }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-sector-angle', '원뿔의 전개도에서 옆면인 부채꼴의 중심각의 크기', '기본 ①59 ②65', (d, n) => {
        const [r, l] = d.pick([[4, 10], [6, 10], [3, 9], [2, 8], [5, 12], [3, 12], [4, 6], [2, 6], [5, 8], [3, 8], [6, 9], [4, 16], [3, 4], [5, 15]]), ang = 360 * r / l;
        const why = `부채꼴의 호의 길이는 밑면인 원의 둘레 2 × ${PI} × ${r} = ${2 * r}${PI}(cm)이고, 반지름의 길이가 ${l} cm인 원의 둘레는 ${2 * l}${PI} cm이다. 중심각의 크기는 360° × ${frac(2 * r, 2 * l)} = ${ang}°`;
        if (n === 0) return N('다음 원뿔의 전개도에서 옆면인 부채꼴의 중심각의 크기는?', ang, { unit: '°', figure: coneFig(r, Math.sqrt(l * l - r * r), { r: cm(r), l: cm(l), label: `원뿔의 겨냥도. 밑면의 반지름 ${cm(r)}, 모선 ${cm(l)}` }), explain: `부채꼴의 반지름의 길이는 모선의 길이 ${l} cm이다. ` + why, facts: calc(`360*${r}/${l}`, [360]) });
        return N(`밑면의 반지름의 길이가 ${r} cm이고 옆넓이가 ${r * l}${PI} cm²인 원뿔의 전개도에서 옆면인 부채꼴의 중심각의 크기는?`, ang, { unit: '°', explain: `옆넓이는 ${PI} × ${r} × (모선의 길이) = ${r * l}${PI}이므로 모선의 길이는 ${l} cm이다. ` + why, facts: calc(`360*${r}/(${r * l}/${r})`, [360]) });
      }, { count: 2 }),
      H('hard-net-cone-surface', '부채꼴의 반지름과 중심각으로 준 전개도로 원뿔의 겉넓이 구하기', '심57 / 기본 ①60 ②67', (d) => {
        const [l, ang] = d.pick([[12, 120], [12, 150], [6, 240], [9, 120], [8, 90], [10, 144], [9, 240], [12, 90], [8, 135], [10, 216], [15, 120]]), r = l * ang / 360, S = r * r + r * l, k = Math.min(84 / l, 12);
        return N('다음 전개도로 만든 원뿔의 겉넓이는?', S, {
          unit: U2, figure: coneNet(l * k, r * k, { l: cm(l), angle: ang + '°', label: `원뿔의 전개도. 옆면인 부채꼴의 반지름 ${cm(l)}, 중심각 ${ang}°. 밑면인 원의 반지름은 적혀 있지 않다` }),
          explain: `부채꼴의 호의 길이는 2 × ${PI} × ${l} × ${frac(ang, 360)} = ${2 * r}${PI}(cm)이고 이것이 밑면인 원의 둘레이므로 밑면의 반지름의 길이는 ${r} cm이다. 밑넓이는 ${r * r}${PI} cm², 옆넓이는 ${PI} × ${l} × ${l} × ${frac(ang, 360)} = ${r * l}${PI}(cm²)이므로 겉넓이는 ${S}${PI} cm²이다.`,
          facts: calc(`(${l}*${ang}/360)*(${l}*${ang}/360)+${l}*${l}*${ang}/360`, [360])
        });
      }),
      H('hard-net-prism', '전개도로 준 삼각기둥의 부피로 높이를 구해 겉넓이 구하기', '기본 ②50', (d) => {
        const [u, v, c] = d.pick(RIGHT.slice(0, 4)), h = d.until(() => d.int(5, 14), (x) => ![u, v, c].includes(x)), S = u * v / 2, total = 2 * S + (u + v + c) * h;
        return N(`다음 전개도로 만든 삼각기둥의 부피가 ${S * h} cm³일 때, 이 삼각기둥의 겉넓이는?`, total, {
          unit: 'cm²', figure: triPrismNet(u, v, c, h, { u: cm(u), v: cm(v), c: cm(c), label: `삼각기둥의 전개도. 직사각형 3개가 옆으로 이어져 있고, 가운데 직사각형의 위와 아래에 세 변의 길이가 ${cm(u)}, ${cm(v)}, ${cm(c)}인 직각삼각형(길이가 ${cm(c)}인 변이 빗변)이 하나씩 붙어 있다. 직사각형의 세로는 적혀 있지 않다` }),
          explain: `밑넓이는 ${u} × ${v} ÷ 2 = ${S}(cm²)이므로 높이는 ${S * h} ÷ ${S} = ${h}(cm)이다. 옆넓이는 (${u} + ${v} + ${c}) × ${h} = ${(u + v + c) * h}(cm²)이므로 겉넓이는 ${S} × 2 + ${(u + v + c) * h} = ${total}(cm²)`,
          facts: calc(`${u}*${v}/2*2+(${u}+${v}+${c})*(${S * h}/(${u}*${v}/2))`, [2])
        });
      }),
      H('hard-square-section', '회전축을 포함하는 평면으로 자른 단면이 정사각형인 원기둥의 겉넓이', '기본 ②48', (d) => {
        const r = d.int(2, 8), s = 2 * r;
        return N(`회전축을 포함하는 평면으로 자를 때 생기는 단면이 한 변의 길이가 ${s} cm인 정사각형인 원기둥의 겉넓이는?`, 6 * r * r, {
          unit: U2, explain: `단면의 가로는 밑면의 지름, 세로는 원기둥의 높이이므로 밑면의 반지름의 길이는 ${r} cm, 높이는 ${s} cm이다. 겉넓이는 ${PI} × ${r} × ${r} × 2 + 2 × ${PI} × ${r} × ${s} = ${2 * r * r}${PI} + ${4 * r * r}${PI} = ${6 * r * r}${PI}(cm²)`, facts: calc(`2*(${s}/2)*(${s}/2)+2*(${s}/2)*${s}`, [2])
        });
      }),
      H('hard-hollow', '가운데가 원기둥 모양으로 뚫린 원기둥의 부피', '심38 / 기본 ①50 ②53', (d, n) => {
        const g = d.int(1, 4), w = d.until(() => d.int(1, 4), (v) => v !== g), h = d.until(() => d.int(4, 10), (v) => v !== g && v !== g + w && v !== w), Rr = g + w, vol = (Rr * Rr - g * g) * h, k = Math.min(52 / Rr, 96 / h);
        const why = `큰 원기둥의 부피에서 뚫린 원기둥의 부피를 뺀다. ${PI} × ${Rr} × ${Rr} × ${h} − ${PI} × ${g} × ${g} × ${h} = ${Rr * Rr * h}${PI} − ${g * g * h}${PI} = ${vol}${PI}(cm³)`;
        if (n === 0) return N('다음 그림과 같이 가운데가 원기둥 모양으로 뚫린 원기둥 모양의 입체도형의 부피는?', vol, {
          unit: U3, figure: hollowFig(Math.max(40, Rr * k), Math.max(40, Rr * k) * g / Rr, Math.max(50, h * k), { R: cm(Rr), r: cm(g), h: cm(h), label: `가운데가 원기둥 모양으로 뚫린 원기둥의 겨냥도. 큰 원기둥의 밑면의 반지름 ${cm(Rr)}, 뚫린 원기둥의 밑면의 반지름 ${cm(g)}, 높이 ${cm(h)}` }),
          explain: why, facts: calc(`(${Rr}*${Rr}-${g}*${g})*${h}`)
        });
        return N(SPIN_ASK('직사각형을', '부피는?'), vol, {
          unit: U3, figure: spin('rectOff', { g: spx(g, 16, 38, 60), w: spx(w, 16, 38, 60), h: spx(h, 12, 64, 110) }, { g: cm(g), w: cm(w), h: cm(h), label: `직사각형과 회전축 l. 직사각형은 가로 ${cm(w)}, 세로 ${cm(h)}이고, 회전축에서 ${cm(g)} 떨어져 회전축과 나란히 서 있다` }),
          explain: `회전체는 밑면의 반지름의 길이가 ${g} + ${w} = ${Rr}(cm)인 원기둥에서 밑면의 반지름의 길이가 ${g} cm인 원기둥 모양을 뚫은 모양이다. ` + why,
          facts: Object.assign(calc(`((${g}+${w})*(${g}+${w})-${g}*${g})*${h}`), { rule: 'spin-rect-off' })
        });
      }, { count: 2 }),
      H('hard-stack-volume', '두 입체도형을 붙인 입체도형의 부피', '기본 ②92·93·94 ①82', (d, n) => {
        if (n === 0) {
          const [r, a] = d.until(() => [d.int(2, 6), d.int(3, 9)], (v) => v[0] * v[0] * v[1] % 3 === 0), b = d.until(() => d.int(3, 9), (v) => v !== a && v !== r), vol = r * r * b + r * r * a / 3;
          return N('다음 그림은 원기둥 위에 밑면이 합동인 원뿔을 붙인 입체도형이다. 이 입체도형의 부피는?', vol, {
            unit: U3, figure: joined('cylCone', r, a, b, { r: cm(r), a: cm(a), b: cm(b), label: `원기둥 위에 원뿔을 붙인 입체도형의 겨냥도. 밑면의 반지름 ${cm(r)}, 원뿔의 높이 ${cm(a)}, 원기둥의 높이 ${cm(b)}` }),
            explain: `원기둥의 부피는 ${PI} × ${r} × ${r} × ${b} = ${r * r * b}${PI}(cm³), 원뿔의 부피는 ${frac(1, 3)} × ${PI} × ${r} × ${r} × ${a} = ${r * r * a / 3}${PI}(cm³)이다. ${r * r * b}${PI} + ${r * r * a / 3}${PI} = ${vol}${PI}(cm³)`, facts: calc(`${r}*${r}*${b}+${r}*${r}*${a}/3`, [3])
          });
        }
        if (n === 1) {
          const r = d.pick([3, 6]), b = d.until(() => d.int(4, 10), (v) => v !== r), vol = r * r * b + 2 * r * r * r / 3;
          return N('다음 그림은 원기둥 위에 반구를 붙인 입체도형이다. 이 입체도형의 부피는?', vol, {
            unit: U3, figure: joined('cylDome', r, 0, b, { r: cm(r), b: cm(b), label: `원기둥 위에 반구를 붙인 입체도형의 겨냥도. 원기둥의 밑면과 반구의 반지름 ${cm(r)}, 원기둥의 높이 ${cm(b)}` }),
            explain: `원기둥의 부피는 ${PI} × ${r} × ${r} × ${b} = ${r * r * b}${PI}(cm³), 반구의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${frac(1, 2)} = ${2 * r * r * r / 3}${PI}(cm³)이다. ${r * r * b}${PI} + ${2 * r * r * r / 3}${PI} = ${vol}${PI}(cm³)`, facts: calc(`${r}*${r}*${b}+4*${r}*${r}*${r}/3/2`, [4, 3, 2])
          });
        }
        const [r, a, b] = d.until(() => [d.int(2, 6), d.int(3, 8), d.int(3, 8)], (v) => v[0] * v[0] * (v[1] + v[2]) % 3 === 0 && v[1] !== v[2] && v[0] !== v[1] && v[0] !== v[2]), vol = r * r * (a + b) / 3;
        return N('다음 그림은 밑면이 합동인 두 원뿔을 밑면끼리 붙인 입체도형이다. 이 입체도형의 부피는?', vol, {
          unit: U3, figure: joined('bicone', r, a, b, { r: cm(r), a: cm(a), b: cm(b), label: `원뿔 2개를 밑면끼리 붙인 입체도형의 겨냥도. 밑면의 반지름 ${cm(r)}, 위쪽 원뿔의 높이 ${cm(a)}, 아래쪽 원뿔의 높이 ${cm(b)}` }),
          explain: `두 원뿔의 밑넓이는 ${r * r}${PI} cm²로 같다. ${frac(1, 3)} × ${r * r}${PI} × ${a} + ${frac(1, 3)} × ${r * r}${PI} × ${b} = ${frac(1, 3)} × ${r * r}${PI} × ${a + b} = ${vol}${PI}(cm³)`, facts: calc(`${r}*${r}*(${a}+${b})/3`, [3])
        });
      }, { count: 3 }),
      H('hard-frustum-volume', '뿔대의 부피', '기본 ①66·87 ②68·69·86', (d, n) => {
        if (n === 0) {
          const [a1, cut, a2, h] = d.pick([[4, 4, 7, 3], [3, 3, 6, 3], [2, 2, 5, 3], [4, 4, 10, 6], [3, 2, 6, 2], [6, 4, 9, 2], [3, 2, 9, 4], [2, 3, 4, 3], [2, 3, 6, 6], [4, 6, 6, 3], [3, 4, 6, 4]]), big = a2 * a2 * (cut + h), small = a1 * a1 * cut, vol = (big - small) / 3;
          return N('다음 그림과 같이 두 밑면이 모두 정사각형인 사각뿔대의 부피는?', vol, {
            unit: 'cm³', figure: sqFrustumFig(a1, a2, h, { a1: cm(a1), a2: cm(a2), h: cm(h), cut, cutText: cm(cut), label: `사각뿔대의 겨냥도. 윗면은 한 변 ${cm(a1)}인 정사각형, 아랫면은 한 변 ${cm(a2)}인 정사각형이고 높이는 ${cm(h)}이다. 옆 모서리를 길게 늘이면(점선) 한 점에서 만나 사각뿔이 되고, 잘라 낸 작은 사각뿔의 높이는 ${cm(cut)}이다` }),
            explain: `자르기 전 사각뿔의 높이는 ${cut} + ${h} = ${cut + h}(cm)이다. 자르기 전 사각뿔의 부피에서 잘라 낸 사각뿔의 부피를 뺀다. ${frac(1, 3)} × ${a2} × ${a2} × ${cut + h} − ${frac(1, 3)} × ${a1} × ${a1} × ${cut} = ${frac(big, 3)} − ${frac(small, 3)} = ${vol}(cm³)`,
            facts: calc(`(${a2}*${a2}*(${cut}+${h})-${a1}*${a1}*${cut})/3`, [3])
          });
        }
        const [a, cut, b, h] = d.pick([[3, 4, 6, 4], [2, 3, 4, 3], [3, 2, 6, 2], [2, 3, 6, 6], [4, 3, 8, 3], [3, 4, 9, 8], [6, 4, 9, 2], [4, 6, 6, 3], [3, 3, 6, 3]]), big = b * b * (cut + h), small = a * a * cut, vol = (big - small) / 3, k = Math.max(36 / a, Math.min(13, 84 / b)), kv = Math.min(k, 150 / (cut + h));
        return N(SPIN_ASK('사다리꼴을', '부피는?'), vol, {
          unit: U3, figure: spin('trap', { a: a * k, b: b * k, h: h * kv }, { a: cm(a), b: cm(b), h: cm(h), ext: cm(cut), label: `사다리꼴과 회전축 l. 윗변 ${cm(a)}, 아랫변 ${cm(b)}이고, 두 밑변에 수직인 길이 ${cm(h)}인 변이 회전축 위에 놓여 있다. 비스듬한 변을 길게 늘인 선(점선)은 윗변에서 위로 ${cm(cut)} 떨어진 곳에서 회전축과 만난다` }),
          explain: `회전체는 원뿔대이다. 밑면의 반지름의 길이가 ${b} cm, 높이가 ${cut} + ${h} = ${cut + h}(cm)인 원뿔에서 밑면의 반지름의 길이가 ${a} cm, 높이가 ${cut} cm인 원뿔을 잘라 낸 것이다. ${frac(1, 3)} × ${PI} × ${b} × ${b} × ${cut + h} − ${frac(1, 3)} × ${PI} × ${a} × ${a} × ${cut} = ${big / 3}${PI} − ${small / 3}${PI} = ${vol}${PI}(cm³)`,
          facts: calc(`(${b}*${b}*(${cut}+${h})-${a}*${a}*${cut})/3`, [3])
        });
      }, { count: 2 }),
      H('hard-pour', '원뿔 모양의 그릇에 담은 물을 원기둥 모양의 그릇에 붓기', '심55 / 기본 ①65·68 ②96', (d) => {
        const [r1, h1, r2] = d.pick([[3, 8, 2], [6, 8, 4], [4, 9, 2], [4, 6, 2], [6, 9, 3], [6, 4, 2], [6, 4, 4], [9, 4, 6], [9, 8, 6], [6, 6, 3]]), vol = r1 * r1 * h1 / 3, x = vol / (r2 * r2);
        return N(`밑면의 반지름의 길이가 ${r1} cm, 높이가 ${h1} cm인 원뿔 모양의 그릇에 물을 가득 채운 다음, 이 물을 밑면의 반지름의 길이가 ${r2} cm인 원기둥 모양의 빈 그릇에 모두 부었다. 원기둥 모양의 그릇에 담긴 물의 높이는? (단, 그릇의 두께는 생각하지 않고, 물은 넘치지 않는다.)`, x, {
          unit: 'cm', explain: `물의 부피는 ${frac(1, 3)} × ${PI} × ${r1} × ${r1} × ${h1} = ${vol}${PI}(cm³)이다. 원기둥 모양의 그릇의 밑넓이는 ${PI} × ${r2} × ${r2} = ${r2 * r2}${PI}(cm²)이므로 물의 높이는 ${vol}${PI} ÷ ${r2 * r2}${PI} = ${x}(cm)`, facts: calc(`${r1}*${r1}*${h1}/3/(${r2}*${r2})`, [3])
        });
      }),
      H('hard-fill-time', '원뿔 모양의 그릇에 물을 가득 채우는 데 걸리는 시간', '심53', (d) => {
        const [r, h, q] = d.pick([[6, 10, 4], [6, 10, 6], [3, 12, 4], [9, 8, 12], [6, 5, 3], [3, 8, 2], [9, 4, 6], [6, 8, 8], [3, 10, 5]]), vol = r * r * h / 3;
        return N(`밑면의 반지름의 길이가 ${r} cm, 높이가 ${h} cm인 원뿔 모양의 빈 그릇에 1분에 ${q}${PI} cm³씩 물을 넣을 때, 그릇에 물을 가득 채우는 데 걸리는 시간은 몇 분인가? (단, 그릇의 두께는 생각하지 않는다.)`, vol / q, {
          unit: '분', explain: `그릇의 부피는 ${frac(1, 3)} × ${PI} × ${r} × ${r} × ${h} = ${vol}${PI}(cm³)이다. ${vol}${PI} ÷ ${q}${PI} = ${vol / q}(분)`, facts: calc(`${r}*${r}*${h}/3/${q}`, [3, 1])
        });
      }),
      H('hard-fit', '원기둥에 꼭 맞게 들어가는 구와 원뿔', '기본 ①76·77 ②80', (d, n) => {
        const r = d.pick([3, 6]);
        if (n === 0) return F(`다음 그림과 같이 반지름의 길이가 ${r} cm인 구가 원기둥에 꼭 맞게 들어 있다. 원기둥의 부피는 구의 부피의 몇 배인가?`, 3, 2, {
          unit: '배', improper: true, anyForm: true, figure: fitFig(48, { r: cm(r), label: `원기둥에 꼭 맞게 들어 있는 구의 겨냥도. 구의 반지름 ${cm(r)}. 구는 원기둥의 두 밑면과 옆면에 닿아 있다` }),
          explain: `원기둥의 밑면의 반지름의 길이는 ${r} cm, 높이는 구의 지름 ${2 * r} cm이므로 부피는 ${PI} × ${r} × ${r} × ${2 * r} = ${2 * r * r * r}${PI}(cm³)이다. 구의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${4 * r * r * r / 3}${PI}(cm³)이다. ${2 * r * r * r} ÷ ${4 * r * r * r / 3} = ${frac(3, 2)}(배)`,
          facts: { value: `(${r}*${r}*2*${r})/(4*${r}*${r}*${r}/3)`, unseen: [2, 4, 3] }
        });
        if (n === 1) return M(`밑면의 반지름의 길이가 ${r} cm, 높이가 ${2 * r} cm인 원기둥과, 이 원기둥에 꼭 맞게 들어가는 구, 밑면과 높이가 이 원기둥과 같은 원뿔이 있다. 원뿔, 구, 원기둥의 부피의 비를 가장 간단한 자연수의 비로 나타내시오.`, [{ answer: 1, unit: ':' }, { answer: 2, unit: ':' }, { answer: 3 }], {
          explain: `원뿔의 부피는 ${frac(1, 3)} × ${PI} × ${r} × ${r} × ${2 * r} = ${2 * r * r * r / 3}${PI}(cm³), 구의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${4 * r * r * r / 3}${PI}(cm³), 원기둥의 부피는 ${PI} × ${r} × ${r} × ${2 * r} = ${2 * r * r * r}${PI}(cm³)이다. ${2 * r * r * r / 3} : ${4 * r * r * r / 3} : ${2 * r * r * r} = 1 : 2 : 3`,
          facts: { calc: [[`${r}*${r}*${2 * r}/(${r}*${r}*${2 * r})`, 0], [`4*${r}*${r}*${r}/(${r}*${r}*${2 * r})`, 1], [`${r}*${r}*${2 * r}*3/(${r}*${r}*${2 * r})`, 2]], unseen: [4, 3] }
        });
        const vol = 4 * r * r * r / 3;
        return N(`다음 그림과 같이 원기둥에 꼭 맞게 들어 있는 구의 부피가 ${vol}${PI} cm³일 때, 원기둥의 부피는?`, vol * 3 / 2, {
          unit: U3, figure: fitFig(48, { label: '원기둥에 꼭 맞게 들어 있는 구의 겨냥도. 구는 원기둥의 두 밑면과 옆면에 닿아 있다' }),
          explain: `구의 반지름의 길이를 ${V('r')} cm라 하면 원기둥의 부피는 ${PI}${V('r')}<sup>2</sup> × 2${V('r')} = 2${PI}${V('r')}<sup>3</sup>이고 구의 부피는 ${frac(4, 3)}${PI}${V('r')}<sup>3</sup>이므로, 원기둥의 부피는 구의 부피의 ${frac(3, 2)}배이다. ${vol}${PI} × ${frac(3, 2)} = ${vol * 3 / 2}${PI}(cm³)`,
          facts: calc(`${vol}*3/2`, [3, 2])
        });
      }, { count: 3 }),
      H('hard-melt', '큰 쇠구슬을 녹여 만드는 작은 쇠구슬의 개수', '기본 ②79', (d) => {
        // 걸리는 곳: 반지름이 3배이면 부피도 3배라고 여겨 3개라고 답하는 아이.
        const [big, small] = d.pick([[9, 3], [6, 3], [6, 2], [8, 2], [4, 2], [8, 4], [10, 5], [12, 4], [12, 6]]), k = big / small;
        return N(`반지름의 길이가 ${big} cm인 구 모양의 쇠구슬 1개를 녹여서 반지름의 길이가 ${small} cm인 구 모양의 쇠구슬을 여러 개 만들려고 한다. 작은 쇠구슬을 모두 몇 개 만들 수 있는가?`, k * k * k, {
          unit: '개', explain: `큰 쇠구슬의 부피는 ${frac(4, 3)}${PI} × ${big * big * big}, 작은 쇠구슬의 부피는 ${frac(4, 3)}${PI} × ${small * small * small}이다. ${big * big * big} ÷ ${small * small * small} = ${k * k * k}(개)`, facts: calc(`${big}*${big}*${big}/(${small}*${small}*${small})`)
        });
      }),
      H('hard-spin-two-axes', '같은 도형을 서로 다른 변을 회전축으로 하여 돌린 두 회전체의 부피의 비', '심59 / 기본 ①85 ②84', (d, n) => {
        const [p, q] = d.until(() => [d.int(2, 6), d.int(2, 6)], (v) => v[0] !== v[1]), g = gcd(p, q);
        if (n === 0) return M(`가로의 길이가 ${p} cm, 세로의 길이가 ${q} cm인 직사각형을 가로인 변을 회전축으로 하여 1회전 시킬 때 생기는 회전체를 ㉠, 세로인 변을 회전축으로 하여 1회전 시킬 때 생기는 회전체를 ㉡이라 하자. ㉠과 ㉡의 부피의 비를 가장 간단한 자연수의 비로 나타내시오.`, [{ answer: q / g, unit: ':' }, { answer: p / g }], {
          explain: `㉠은 밑면의 반지름의 길이가 ${q} cm, 높이가 ${p} cm인 원기둥이므로 부피는 ${PI} × ${q} × ${q} × ${p} = ${q * q * p}${PI}(cm³)이다. ㉡은 밑면의 반지름의 길이가 ${p} cm, 높이가 ${q} cm인 원기둥이므로 부피는 ${PI} × ${p} × ${p} × ${q} = ${p * p * q}${PI}(cm³)이다. ${q * q * p} : ${p * p * q} = ${q / g} : ${p / g}`,
          facts: { calc: [[`${q}*${q}*${p}/${p * q * g}`, 0], [`${p}*${p}*${q}/${p * q * g}`, 1]], unseen: [p * q * g] }
        });
        return M('다음 직각삼각형 ABC를 직선 AC를 회전축으로 하여 1회전 시킬 때 생기는 회전체를 ㉠, 직선 BC를 회전축으로 하여 1회전 시킬 때 생기는 회전체를 ㉡이라 하자. ㉠과 ㉡의 부피의 비를 가장 간단한 자연수의 비로 나타내시오.', [{ answer: q / g, unit: ':' }, { answer: p / g }], {
          figure: triABC(p, q, { p: cm(p), q: cm(q), label: `직각삼각형 ABC. 각 C가 직각이고 변 AC의 길이는 ${cm(p)}, 변 BC의 길이는 ${cm(q)}` }),
          explain: `㉠은 밑면의 반지름의 길이가 ${q} cm, 높이가 ${p} cm인 원뿔이므로 부피는 ${frac(1, 3)} × ${PI} × ${q} × ${q} × ${p}이다. ㉡은 밑면의 반지름의 길이가 ${p} cm, 높이가 ${q} cm인 원뿔이므로 부피는 ${frac(1, 3)} × ${PI} × ${p} × ${p} × ${q}이다. ${q * q * p} : ${p * p * q} = ${q / g} : ${p / g}`,
          facts: { calc: [[`${q}*${q}*${p}/${p * q * g}`, 0], [`${p}*${p}*${q}/${p * q * g}`, 1]], unseen: [p * q * g] }
        });
      }, { count: 2 }),
      H('hard-spin-carved', '한 꼭짓점만 회전축 위에 있는 직각삼각형을 돌린 회전체의 부피', '기본 ②85', (d) => {
        const [a, h] = d.until(() => [d.int(2, 6), d.int(4, 10)], (v) => v[0] * v[0] * v[1] % 3 === 0 && v[0] !== v[1]), vol = a * a * h * 2 / 3;
        return N(SPIN_ASK('직각삼각형을', '부피는?'), vol, {
          unit: U3, figure: spin('triFar', { a: spx(a, 13, 60, 90), h: spx(h, 12, 70, 110) }, { a: cm(a), h: cm(h), label: `직각삼각형과 회전축 l. 직각을 낀 두 변 가운데 길이 ${cm(a)}인 변은 회전축에 수직이고 한 끝이 회전축 위에 있다. 길이 ${cm(h)}인 변은 회전축과 나란하고 회전축에서 ${cm(a)} 떨어져 있다` }),
          explain: `회전체는 밑면의 반지름의 길이가 ${a} cm, 높이가 ${h} cm인 원기둥에서 밑면과 높이가 같은 원뿔 모양을 파낸 모양이다. ${PI} × ${a} × ${a} × ${h} − ${frac(1, 3)} × ${PI} × ${a} × ${a} × ${h} = ${a * a * h}${PI} − ${a * a * h / 3}${PI} = ${vol}${PI}(cm³)`,
          facts: Object.assign(calc(`${a}*${a}*${h}-${a}*${a}*${h}/3`, [3]), { rule: 'spin-tri-far' })
        });
      }),
      H('hard-corner-pyramid', '직육면체를 세 꼭짓점을 지나는 평면으로 잘라 만든 삼각뿔의 부피', '심49', (d) => {
        const [a, b, c] = d.until(() => [d.int(3, 9), d.int(3, 9), d.int(3, 9)], (v) => v[0] * v[1] * v[2] % 6 === 0 && new Set(v).size === 3), vol = a * b * c / 6;
        return N(`다음 그림과 같이 직육면체를 세 꼭짓점 B, G, D를 지나는 평면으로 자를 때 생기는 두 입체도형 중에서 꼭짓점 C를 포함하는 삼각뿔의 부피는? (단, 모서리 BC, CD, CG의 길이는 각각 ${a} cm, ${b} cm, ${c} cm이다.)`, vol, {
          unit: 'cm³', figure: boxCutFig('직육면체의 겨냥도. 윗면의 꼭짓점은 A, B, C, D, 아랫면의 꼭짓점은 E, F, G, H이고 A 아래에 E, B 아래에 F, C 아래에 G, D 아래에 H가 있다. 세 꼭짓점 B, G, D를 이은 삼각형이 색칠되어 있다'),
          explain: `삼각형 BCD를 밑면으로 보면 높이는 모서리 CG이다. 밑넓이는 ${a} × ${b} ÷ 2 = ${a * b / 2}(cm²)이므로 부피는 ${frac(1, 3)} × ${a * b / 2} × ${c} = ${vol}(cm³)`,
          facts: calc(`${a}*${b}/2*${c}/3`, [2, 3])
        });
      })
    ]
  });
  // ════════════════════════════════════════════════════════════
  // 2026-10-13 다시 실은 꼴(실력)
  // 처음 지을 때 「꼬임」「복잡한 입체」「세 번 넘게 셈하는 겉넓이」「요령」「필요한 정도를 넘는 단면」을 까닭으로 뺀 꼴을 다시 보고, 중1까지 배운 것만으로 풀리는 것을 실력 묶음 끝에 덧붙였다.
  // 닮음(중2)이나 피타고라스 정리(중2)가 있어야 나오는 길이는 모두 그림에 적어 주었다. 그대로 뺀 꼴과 까닭은 싣기_대조표.md 에 있다.
  const { addFrustum, axis, dimV, FACES6, mid2, TURN } = K;
  const BLUE = 'stroke:#1d4ed8', WATER = 'rgba(96,165,250,0.42)', SHADE = 'rgba(96,165,250,0.3)';
  const reduce = (a, b) => { const g = gcd(a, b); return [a / g, b / g]; };
  // 분수를 약분하여 적는다(나누어떨어지면 자연수로).
  const showQ = (n, m) => { const [p, q] = reduce(n, m); return q === 1 ? String(p) : frac(p, q); };
  // π의 몇 배(계수가 1이면 π만 적는다)
  const kpi = (k) => (String(k) === '1' ? '' : k) + PI;

  // ── 그림(다시 실은 꼴) ───────────────────────────────────────
  // 정육면체와, 그 각 면의 한가운데에 있는 점 6개를 꼭짓점으로 하는 다면체
  function dualFig(label) {
    const cv = canvas(), s = 46, o = { sk: 0.5, tl: 0.42 };
    addPoly(cv, [0, 0], [[-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s], [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]], FACES6, Object.assign({ fill: 'none' }, o));
    const P = addPoly(cv, [0, 0], [[s, 0, 0], [0, s, 0], [-s, 0, 0], [0, -s, 0], [0, 0, s], [0, 0, -s]], [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 0, 5]], Object.assign({ fill: SHADE }, o));
    P.forEach((p) => cv.add(dot(p, 2)));
    return cv.out(label);
  }
  // 각기둥의 한 꼭짓점(윗면의 가장 앞쪽 꼭짓점)에 모인 세 모서리의 중점을 이은 삼각형을 색칠한 그림
  function cornerMarkFig(n, label) {
    const p = prismOf(n, 48, 78, TURN[n]), cv = canvas(), P = addPoly(cv, [0, 0], p.verts, p.faces);
    let at = n; for (let i = n; i < 2 * n; i += 1) if (p.verts[i][1] < p.verts[at][1]) at = i;
    const k = at - n, tri = [n + (k + 1) % n, n + (k + n - 1) % n, k].map((j) => mid2(P[at], P[j]));
    cv.add(fill(tri, 'rgba(96,165,250,0.5)') + tri.map((q, i) => stroke(q, tri[(i + 1) % 3], 'thin', BLUE)).join(''));
    return cv.out(label);
  }
  // 정육면체 ABCD-EFGH(윗면 ABCD, 아랫면 EFGH). P 는 모서리 AB 의 중점, Q 는 모서리 AD 의 중점. mark: 굵은 점으로 나타낼 꼭짓점의 이름
  function cubePQFig(mark, label) {
    const cv = canvas(), s = 84, names = 'ABCDEFGH';
    const P = addPoly(cv, [0, 0], [[0, s, s], [0, 0, s], [s, 0, s], [s, s, s], [0, s, 0], [0, 0, 0], [s, 0, 0], [s, s, 0]], [[0, 1, 2, 3], [4, 5, 6, 7], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [0, 1, 5, 4]], { sk: 0.5, tl: 0.42 });
    [[-8, -7], [-10, 0], [9, 11], [9, -6], [-9, -7], [-9, 7], [2, 11], [10, 3]].forEach(([dx, dy], i) => cv.write([P[i][0] + dx, P[i][1] + dy], names[i]));
    const p = mid2(P[0], P[1]), q = mid2(P[0], P[3]);
    cv.add(dot(p, 2.6) + dot(q, 2.6) + dot(P[names.indexOf(mark)], 2.6));
    cv.write([p[0] - 9, p[1] - 3], 'P'); cv.write([q[0], q[1] - 11], 'Q');
    return cv.out(label);
  }
  // 회전축 l 에서 떨어져 있는 원(중심 O). g: 회전축에서 원까지의 거리, r: 원의 반지름(px). o: { g, r: 글, label }
  function circleOffFig(g, r, o) {
    const cv = canvas(), O = [-(g + r), r];
    cv.box(O, r, r);
    cv.add('<circle class="mb-poly" style="fill:' + SKY + '" cx="' + f1(O[0]) + '" cy="' + f1(O[1]) + '" r="' + f1(r) + '"/>');
    cv.add(stroke([0, r], [-g, r], 'dash') + stroke([-g, r], O, 'thin') + dot(O));
    cv.write([-g / 2, r - 9], o.g, 'is-length'); cv.write([-(g + r / 2), r - 9], o.r, 'is-length'); cv.write([O[0] - 3, r + 10], 'O');
    axis(cv, 0, 2 * r);
    return cv.out(o.label, 6);
  }
  // 평면도형 하나(작은 그림 칸): 직사각형, 사다리꼴, 원, 길쭉한 둥근 모양, 길쭉한 둥근 모양의 한쪽을 곧게 자른 모양
  const FLAT = {
    rect: { said: '직사각형', draw: (cv) => { const list = [[-22, -30], [22, -30], [22, 30], [-22, 30]]; list.forEach(cv.point); cv.add(K.shape(list, SKY)); } },
    trap: { said: '윗변이 아랫변보다 짧은 사다리꼴', draw: (cv) => { const list = [[-15, -30], [15, -30], [29, 30], [-29, 30]]; list.forEach(cv.point); cv.add(K.shape(list, SKY)); } },
    disk: { said: '원', draw: (cv) => { cv.box([0, 0], 29, 29); cv.add('<circle class="mb-poly" style="fill:' + SKY + '" cx="0" cy="0" r="29"/>'); } },
    oval: { said: '원을 한쪽으로 늘인 모양의 길쭉한 둥근 도형', draw: (cv) => { cv.box([0, 0], 21, 33); cv.add('<path class="mb-poly" style="fill:' + SKY + '" d="' + arcD([0, 0], 21, 33, 0, 360) + 'Z"/>'); } },
    cutOval: { said: '길쭉한 둥근 도형의 아래쪽을 곧게 잘라 낸 모양(위는 둥글고 아래는 곧은 변)', draw: (cv) => { cv.box([0, -6], 24, 30); cv.add('<path class="mb-poly" style="fill:' + SKY + '" d="' + arcD([0, 0], 24, 36, 138, 402) + 'Z"/>'); } }
  };
  // 평면 위에 눕혀 놓은 원뿔과, 꼭짓점 O 를 중심으로 굴릴 때 밑면의 둘레가 지나가는 원. turns: 제자리로 돌아올 때까지 원뿔이 도는 바퀴 수(모선 ÷ 반지름). o: { r: 반지름 글, label }
  function rollFig(turns, o) {
    const cv = canvas(), L = 84, FL = 0.4, pr = (v) => [v[0], FL * v[1] - v[2]], O = [0, 0];
    const sinA = 1 / turns, cosA = Math.sqrt(1 - sinA * sinA), r = L * sinA, th = 24 * RAD, ux = Math.cos(th), uy = Math.sin(th);
    const C = [ux * cosA, uy * cosA, sinA].map((v) => v * L * cosA), e1 = [-uy, ux, 0], e2 = [-ux * sinA, -uy * sinA, cosA];
    const at = (t) => pr(C.map((c, i) => c + r * (Math.cos(t * RAD) * e1[i] + Math.sin(t * RAD) * e2[i])));
    const rim = Array.from({ length: 72 }, (_, i) => at(i * 5)), ang = rim.map((p) => Math.atan2(p[1], p[0])), lo = rim[ang.indexOf(Math.min(...ang))], hi = rim[ang.indexOf(Math.max(...ang))];
    cv.box(O, L, L * FL); rim.forEach(cv.point);
    cv.add(curve(arcD(O, L, L * FL, 0, 360), 'dash'));
    cv.add(fill([O, lo, hi], CREAM) + fill(rim, CREAM) + stroke(O, lo) + stroke(O, hi) + '<polygon class="mb-poly" style="fill:none" points="' + K.ptsOf(rim) + '"/>');
    const c = pr(C), edge = at(200);
    cv.add(stroke(c, edge, 'thin') + dot(c) + dot(O));
    cv.write([-9, -6], 'O');
    if (o.r) leader(cv, [c[0] - 6, Math.min(...rim.map((p) => p[1])) - 12], mid2(c, edge), o.r);
    return cv.out(o.label);
  }
  const pathOf = (pts, close) => pts.map((p, i) => (i ? 'L' : 'M') + xy(p)).join('') + (close ? 'Z' : '');
  const circleXY = (rad) => Array.from({ length: 72 }, (_, i) => [rad * Math.cos(i * 5 * RAD), rad * Math.sin(i * 5 * RAD)]);
  // 큰 원기둥 위 가운데에 작은 원기둥을 올린 입체. r, h: 위 원기둥의 반지름과 높이, R, H: 아래 원기둥의 반지름과 높이(cm).
  // o: { r: 위 원기둥의 반지름 글, h: 위 원기둥의 높이 글, w: 아래 원기둥의 윗면에 드러난 고리의 너비 글, H: 아래 원기둥의 높이 글, label }
  function twoCylFig(r, h, R, H, o) {
    const k = Math.min(58 / R, 130 / (h + H)), Rp = Math.max(48, R * k), rp = Math.min(Math.max(16, Rp * r / R), Rp - 22), hp = Math.min(70, Math.max(50, h * k)), Hp = Math.min(70, Math.max(36, H * k)), cv = canvas();
    addCyl(cv, [0, hp], Rp, Hp); addCyl(cv, [0, 0], rp, hp);
    cv.add(stroke([0, 0], [rp, 0], 'thin') + dot([0, 0]) + stroke([rp, hp], [Rp, hp], 'thin'));
    leader(cv, [rp + 14 + half(o.r), -rp * TILT - 13], [rp * 0.6, 0], o.r);
    cv.write([-rp - 5 - half(o.h), hp / 2 - 2], o.h, kindOf(o.h));
    leader(cv, [Rp + 9 + half(o.w), hp - 15], [(rp + Rp) / 2, hp], o.w);
    cv.write([Rp + 5 + half(o.H), hp + Hp / 2 + 5], o.H, kindOf(o.H));
    return cv.out(o.label);
  }
  // 비스듬히 본 직육면체: 가로 x, 안쪽 y, 높이 z 를 화면에 옮긴다.
  const OBL = { sk: 0.5, tl: 0.42 }, obl = (x, y, z) => [x + y * OBL.sk, -(z + y * OBL.tl)];
  // 직육면체 모양의 사각기둥(가로 a, 세로 b, 높이 c)의 윗면 가운데에서 아랫면까지 원기둥 모양의 구멍(반지름 r)이 뚫린 입체. o: { a, b, c, r: 글, label }
  function holedBoxFig(a, b, c, r, o) {
    const k = Math.min(120 / a, 100 / b, 14), A = a * k / 2, D = b * k / 2, Hh = Math.min(92, Math.max(46, c * k)), rp = r * k, cv = canvas();
    const P = addPoly(cv, [0, 0], [[-A, -D, 0], [A, -D, 0], [A, D, 0], [-A, D, 0], [-A, -D, Hh], [A, -D, Hh], [A, D, Hh], [-A, D, Hh]], FACES6, OBL);
    const ring = (z) => circleXY(rp).map(([x, y]) => obl(x, y, z)), t0 = Math.atan(OBL.sk), side = (s, z) => obl(s * rp * Math.cos(t0), s * rp * Math.sin(t0), z);
    cv.add('<polygon class="mb-poly" style="fill:#e2e8f0" points="' + K.ptsOf(ring(Hh)) + '"/>');
    cv.add(curve(pathOf(ring(0), true), 'dash') + stroke(side(1, Hh), side(1, 0), 'dash') + stroke(side(-1, Hh), side(-1, 0), 'dash'));
    const ctr = obl(0, 0, Hh), edge = obl(rp, 0, Hh);
    cv.add(stroke(ctr, edge, 'thin') + dot(ctr));
    leader(cv, [ctr[0] - 4, P[7][1] - 13], mid2(ctr, edge), o.r);
    beside(cv, P[0], P[1], P[4], o.a); beside(cv, P[1], P[2], P[4], o.b); beside(cv, P[2], P[6], P[0], o.c);
    return cv.out(o.label);
  }
  // 직육면체 모양의 사각기둥(가로 a, 세로 b, 높이 c)의 앞쪽 옆면 가운데를 반원기둥 모양(반지름 r)으로 위에서 아래까지 파낸 입체. o: { a, b, c, r: 글, label }
  function notchBoxFig(a, b, c, r, o) {
    const k = Math.min(128 / a, 100 / b, 14), A = a * k / 2, D = b * k / 2, Hh = Math.min(92, Math.max(46, c * k)), rp = r * k, cv = canvas(), q = obl;
    const arc = (z, from, to) => { const n = Math.max(2, Math.ceil(Math.abs(to - from) / 6)); return Array.from({ length: n + 1 }, (_, i) => { const t = (from + (to - from) * i / n) * RAD; return obl(rp * Math.cos(t), -D + rp * Math.sin(t), z); }); };
    // 파낸 벽 가운데 이 각보다 오른쪽에 있는 곳은 오른쪽 앞면에 가려진다.
    const cut = 2 * Math.atan(OBL.sk) / RAD, topFace = [q(-A, -D, Hh), q(-rp, -D, Hh)].concat(arc(Hh, 180, 0), [q(A, -D, Hh), q(A, D, Hh), q(-A, D, Hh)]);
    topFace.forEach(cv.point); [q(-A, -D, 0), q(A, -D, 0), q(A, D, 0)].forEach(cv.point);
    cv.add(fill([q(A, -D, 0), q(A, D, 0), q(A, D, Hh), q(A, -D, Hh)], CREAM) + fill([q(-A, -D, 0), q(-rp, -D, 0), q(-rp, -D, Hh), q(-A, -D, Hh)], CREAM) + fill([q(rp, -D, 0), q(A, -D, 0), q(A, -D, Hh), q(rp, -D, Hh)], CREAM));
    cv.add(fill(arc(Hh, 0, 180).concat(arc(0, 180, cut)), '#f1e4bd') + fill(topFace, CREAM));
    cv.add(stroke(q(-A, D, 0), q(-A, D, Hh), 'dash') + stroke(q(-A, D, 0), q(A, D, 0), 'dash') + stroke(q(-A, D, 0), q(-A, -D, 0), 'dash') + curve(pathOf(arc(0, cut, 0)), 'dash'));
    cv.add('<polygon class="mb-poly" style="fill:none" points="' + K.ptsOf(topFace) + '"/>' + curve(pathOf(arc(0, 180, cut))));
    [[-A, -D], [-rp, -D], [rp, -D], [A, -D], [A, D]].forEach(([x, y]) => cv.add(stroke(q(x, y, Hh), q(x, y, 0))));
    cv.add(stroke(q(-A, -D, 0), q(-rp, -D, 0)) + stroke(q(rp, -D, 0), q(A, -D, 0)) + stroke(q(A, -D, 0), q(A, D, 0)));
    const ctr = q(0, -D, Hh), deep = q(0, -D + rp, Hh);
    cv.add(stroke(ctr, deep, 'thin') + dot(ctr));
    leader(cv, [ctr[0] - 16, q(-A, D, Hh)[1] - 13], mid2(ctr, deep), o.r);
    beside(cv, q(-A, -D, 0), q(A, -D, 0), q(0, -D, Hh), o.a); beside(cv, q(A, -D, 0), q(A, D, 0), q(-A, -D, Hh), o.b); beside(cv, q(A, D, 0), q(A, D, Hh), q(-A, -D, 0), o.c);
    return cv.out(o.label);
  }
  // 밑면이 부채꼴에서 중심이 같은 작은 부채꼴을 잘라 낸 모양(중심각 ang°, 안쪽 반지름 r1, 바깥쪽 반지름 r2)인 기둥. 부채꼴의 중심은 앞쪽에 있고 그림에는 점선으로만 나타난다. H: 높이(cm).
  // o: { h: 높이 글, angle: 중심각 글, label }
  function ringSectorFig(ang, r1, r2, H, o) {
    const rx = Math.min(86, Math.max(66, r2 * 13)), ry = rx * 0.5, ix = rx * r1 / r2, iy = ix * 0.5, hh = Math.min(80, Math.max(44, H * 11)), cv = canvas(), C0 = [0, 0], C1 = [0, hh];
    const a0 = 270 - ang / 2, a1 = 270 + ang / 2, down = (p) => [p[0], p[1] + hh], O = (t) => onEll(C0, rx, ry, t), I = (t) => onEll(C0, ix, iy, t);
    for (let t = a0; t <= a1 + 0.01; t += ang / 12) { cv.point(O(t)); cv.point(down(I(t))); }
    cv.point(C0); [O(a0), O(a1)].forEach((p) => cv.point(down(p)));
    cv.add(fill([I(a0), O(a0), down(O(a0)), down(I(a0))], CREAM) + fill([I(a1), O(a1), down(O(a1)), down(I(a1))], CREAM));
    cv.add(blob(arcD(C0, ix, iy, a0, a1) + tail(arcD(C1, ix, iy, a1, a0)), '#f1e4bd') + blob(arcD(C0, rx, ry, a0, a1) + tail(arcD(C0, ix, iy, a1, a0)), CREAM));
    // 가려진 바깥쪽 아랫면의 호(점선). 중심각을 적는 자리를 지나는 곳은 긋지 않는다.
    const hidden = [[]];
    for (let t = a0; t <= a1 + 0.01; t += ang / 48) { const p = onEll(C1, rx, ry, t); if (o.angle && Math.abs(p[0]) < half(o.angle) + 5 && Math.abs(p[1] - 13) < 10) { if (hidden[hidden.length - 1].length) hidden.push([]); } else hidden[hidden.length - 1].push(p); }
    hidden.filter((list) => list.length > 1).forEach((list) => cv.add(curve(pathOf(list), 'dash')));
    cv.add(curve(arcD(C0, rx, ry, a0, a1)) + curve(arcD(C0, ix, iy, a0, a1)) + curve(arcD(C1, ix, iy, a0, a1)));
    [a0, a1].forEach((t) => cv.add(stroke(I(t), O(t)) + stroke(I(t), down(I(t))) + stroke(O(t), down(O(t))) + stroke(down(I(t)), down(O(t))) + stroke(C0, I(t), 'dash')));
    cv.add(curve(arcD(C0, 11, 5.5, a0, a1), 'thin') + dot(C0, 1.8));
    if (o.angle) cv.write([0, 13], o.angle, 'is-length on-face');
    if (o.h) beside(cv, O(a0), down(O(a0)), C1, o.h);
    return cv.out(o.label);
  }
  // 원기둥을 밑면에 비스듬한 평면으로 자른 입체. r: 밑면의 반지름, h1: 낮은 쪽(왼쪽)의 높이, h2: 높은 쪽(오른쪽)의 높이(cm). o: { r, h1, h2: 글, label }
  function slantCylFig(r, h1, h2, o) {
    const k = Math.min(48 / r, 112 / h2), rx = Math.max(38, r * k), ry = rx * TILT, a = Math.max(46, h1 * k), b = Math.max(a + 24, h2 * k), cv = canvas(), base = [0, b];
    const top = (t) => [rx * Math.cos(t * RAD), b - ((a + b) / 2 + (b - a) / 2 * Math.cos(t * RAD)) + ry * Math.sin(t * RAD)], rim = Array.from({ length: 72 }, (_, i) => top(i * 5));
    cv.box([0, b / 2], rx, b / 2 + ry); rim.forEach(cv.point);
    cv.add(blob('M' + xy([-rx, b - a]) + 'L' + xy([-rx, b]) + tail(arcD(base, rx, ry, 180, 0)) + 'L' + xy([rx, 0]) + Array.from({ length: 37 }, (_, i) => 'L' + xy(top(360 - i * 5))).join(''), CREAM));
    cv.add(curve(arcD(base, rx, ry, 180, 360), 'dash') + curve(arcD(base, rx, ry, 180, 0)) + stroke([-rx, b - a], [-rx, b]) + stroke([rx, 0], [rx, b]) + '<polygon class="mb-poly" points="' + K.ptsOf(rim) + '"/>');
    cv.add(stroke(base, [rx, b], 'dash') + dot(base));
    cv.write([rx / 2 + 2, b + ry * 0.87 + 9], o.r, kindOf(o.r));
    cv.write([-rx - 5 - half(o.h1), b - a / 2], o.h1, kindOf(o.h1)); cv.write([rx + 5 + half(o.h2), b / 2], o.h2, kindOf(o.h2));
    return cv.out(o.label);
  }
  // 기울인 직육면체 모양의 그릇과 물. 그릇의 세 모서리 방향의 좌표(u, v, w)를, 물의 면(법선 nrm)이 수평이 되도록 돌려 놓는다.
  const dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2], cross3 = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]], unit3 = (p) => { const L = Math.hypot(p[0], p[1], p[2]); return p.map((v) => v / L); };
  const boxOf = (A, Bd, Cc) => [[0, 0, 0], [A, 0, 0], [A, Bd, 0], [0, Bd, 0], [0, 0, Cc], [A, 0, Cc], [A, Bd, Cc], [0, Bd, Cc]];
  // 한 꼭짓점을 아래로 하여 기울인 그릇: 물은 삼각뿔 모양이다. lens: 아래 꼭짓점에서 물의 면까지 세 모서리를 따라 잰 [길이(cm), 글] 3개 — 가장 짧은 것을 앞쪽 가운데 모서리에 놓는다.
  function tiltCornerFig(lens, label) {
    const [f, a, b] = lens.slice().sort((x, y) => x[0] - y[0]), k = Math.min(8.5, 66 / b[0]), e = [a[0], b[0], f[0]].map((v) => v * k), size = e.map((v) => v * 1.28 + 6), view = { sk: 0.2, tl: 0.32 };
    const up = unit3(e.map((v) => 1 / v)), back = unit3([0, 0, 1].map((v, i) => up[i] * up[2] - v)), right = cross3(back, up), turn = (v) => [dot3(v, right), dot3(v, back), dot3(v, up)], cv = canvas();
    addPoly(cv, [0, 0], boxOf(size[0], size[1], size[2]).map(turn), FACES6, Object.assign({ fill: 'none' }, view));
    const W = addPoly(cv, [0, 0], [[0, 0, 0], [e[0], 0, 0], [0, e[1], 0], [0, 0, e[2]]].map(turn), [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 2, 3]], Object.assign({ fill: WATER }, view));
    beside(cv, W[0], W[1], W[3], a[1]); beside(cv, W[0], W[2], W[3], b[1]);
    const far = W[1][0] > W[2][0] ? W[1] : W[2];
    leader(cv, [far[0] + 12 + half(f[1]), W[3][1] - 2], mid2(W[0], W[3]), f[1]);
    return cv.out(label);
  }
  // 한 모서리를 아래로 하여 기울인 그릇: 물은 삼각기둥 모양이고, 아래 모서리에서 물의 면까지 두 옆면을 따라 잰 길이가 a(왼쪽), b(오른쪽), 아래 모서리의 길이가 len 이다(cm). a ≥ b 로 준다. o: { a, b, len: 글, label }
  function tiltEdgeFig(a, b, len, o) {
    const k = Math.min(8.5, 60 / Math.max(a, b), 70 / len), A = a * k, Bd = b * k, Ln = Math.max(40, len * k), view = { sk: 0.5, tl: 0.35 }, cv = canvas();
    const up = unit3([1 / A, 1 / Bd, 0]), back = [0, 0, 1], right = cross3(back, up), turn = (v) => [dot3(v, right), dot3(v, back), dot3(v, up)];
    addPoly(cv, [0, 0], boxOf(A * 1.4 + 8, Bd * 1.5 + 8, Ln).map(turn), FACES6, Object.assign({ fill: 'none' }, view));
    const W = addPoly(cv, [0, 0], [[0, 0, 0], [A, 0, 0], [0, Bd, 0], [0, 0, Ln], [A, 0, Ln], [0, Bd, Ln]].map(turn), [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [0, 2, 5, 3], [1, 2, 5, 4]], Object.assign({ fill: WATER }, view));
    beside(cv, W[0], W[1], W[2], o.a); beside(cv, W[0], W[3], W[1], o.len); beside(cv, W[3], W[5], W[4], o.b);
    return cv.out(o.label);
  }

  // 원뿔대와, 잘라 낸 원뿔(점선). r1: 위, r2: 아래 밑면의 반지름, sl: 원뿔대의 모선, cut: 잘라 낸 원뿔의 모선(cm). o: { r1, r2, s, cut: 글, label }
  function frustumCutFig(r1, r2, sl, cut, o) {
    const big = Math.sqrt((sl + cut) * (sl + cut) - r2 * r2), k = Math.min(62 / r2, 124 / big), a = r1 * k, b = r2 * k, hh = big * (1 - r1 / r2) * k, cv = canvas();
    const fr = addFrustum(cv, [0, 0], a, b, hh), tp = fr.tR[0], bt = fr.tR[1], apex = [0, tp[1] - tp[0] * (bt[1] - tp[1]) / (bt[0] - tp[0])], L = (p) => [-p[0], p[1]];
    cv.point(apex);
    cv.add(stroke(apex, tp, 'dash') + stroke(apex, L(tp), 'dash') + stroke([0, 0], [a, 0], 'thin') + dot([0, 0]) + stroke([0, hh], [b, hh], 'dash') + dot([0, hh]));
    beside(cv, apex, L(tp), [0, 0], o.cut); beside(cv, L(tp), L(bt), [0, hh / 2], o.s);
    leader(cv, [Math.max(a + 16, b * 0.62) + half(o.r1), -fr.ry1 - 14], [a * 0.6, 0], o.r1);
    cv.write([b / 2 + 2, hh + fr.ry2 * 0.87 + 9], o.r2, kindOf(o.r2));
    return cv.out(o.label);
  }
  // 꼭짓점이 아래에 있는 원뿔 모양의 그릇과 물. R, H: 그릇의 밑면의 반지름과 높이, r, h: 수면의 반지름과 물의 깊이(cm). o: { R, H, r, h: 글, label }
  function cupWaterFig(R, H, r, h, o) {
    const k = Math.min(64 / R, 124 / H), rx = Math.max(62, R * k), hh = Math.max(108, H * k), ry = rx * TILT, cv = canvas(), apex = [0, hh], lv = hh * (1 - h / H), wx = rx * h / H, wy = wx * TILT, c = [0, lv], dots = 'stroke-dasharray:2 3';
    addCup(cv, [0, 0], rx, hh, { open: true });
    cv.add(blob('M' + xy(apex) + 'L' + xy([-wx, lv]) + tail(arcD(c, wx, wy, 180, 0)), WATER) + blob(arcD(c, wx, wy, 0, 360), 'rgba(96,165,250,0.22)') + curve(arcD(c, wx, wy, 0, 360), 'thin', BLUE));
    cv.add(stroke([0, 0], [rx, 0], 'thin') + dot([0, 0]) + stroke(c, [wx, lv], 'thin') + dot(c));
    cv.write([rx / 2, -ry - 9], o.R, kindOf(o.R));
    // 오른쪽: 그릇의 높이, 왼쪽: 물의 깊이
    const xr = rx + 12, xl = -wx - 14;
    cv.add(stroke([xr, 0], [xr, hh], 'thin') + stroke([xr - 3, 0], [xr + 3, 0], 'thin') + stroke([xr - 3, hh], [xr + 3, hh], 'thin') + stroke([4, hh], [xr - 4, hh], 'thin', dots));
    cv.write([xr + 5 + half(o.H), hh / 2], o.H, kindOf(o.H));
    cv.add(stroke([-wx - 3, lv], [xl + 4, lv], 'thin', dots) + stroke([-4, hh], [xl + 4, hh], 'thin', dots));
    dimV(cv, xl, lv, hh, o.h);
    leader(cv, [wx + 8 + half(o.r), lv + 14], [wx * 0.55, lv], o.r);
    return cv.out(o.label);
  }
  // 직육면체 ABCD-EFGH(윗면 ABCD, 아랫면 EFGH)와 모서리 CG 의 중점 M, 세 점 F, H, M 을 이은 삼각형. 선분 FH 는 아랫면 위에 있어 점선이다.
  function boxMidCutFig(label) {
    const cv = canvas(), w = 100, dp = 76, h = 70;
    const P = addPoly(cv, [0, 0], [[0, dp, h], [0, 0, h], [w, 0, h], [w, dp, h], [0, dp, 0], [0, 0, 0], [w, 0, 0], [w, dp, 0]], [[0, 1, 2, 3], [4, 5, 6, 7], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [0, 1, 5, 4]], { sk: 0.5, tl: 0.42 }), Mp = mid2(P[2], P[6]);
    cv.add(fill([P[5], Mp, P[7]], SHADE) + stroke(P[5], Mp, 'thin', BLUE) + stroke(Mp, P[7], 'thin', BLUE) + stroke(P[5], P[7], 'thin', BLUE + ';stroke-dasharray:4 3') + dot(Mp, 2.4));
    [['A', -8, -7], ['B', -10, 0], ['C', 9, 11], ['D', 9, -6], ['E', -9, -7], ['F', -9, 7], ['G', 2, 11], ['H', 10, 3]].forEach(([name, dx, dy], i) => cv.write([P[i][0] + dx, P[i][1] + dy], name));
    cv.write([Mp[0] - 10, Mp[1] - 8], 'M');
    return cv.out(label);
  }
  // 정사각형 ABCD 와 변 AB 의 중점 E, 변 BC 의 중점 F, 접는 선 ED, EF, DF(점선). o: { side: 한 변의 길이 글, label }
  function foldSquareFig(o) {
    const cv = canvas(), s = 124, A = [0, 0], Bp = [0, s], Cp = [s, s], Dp = [s, 0], E = [0, s / 2], F = [s / 2, s];
    [A, Bp, Cp, Dp].forEach(cv.point);
    cv.add(K.shape([A, Bp, Cp, Dp]) + stroke(E, Dp, 'dash') + stroke(E, F, 'dash') + stroke(Dp, F, 'dash') + dot(E) + dot(F));
    [['A', A, -8, -7], ['B', Bp, -8, 8], ['C', Cp, 8, 8], ['D', Dp, 8, -7], ['E', E, -10, 0], ['F', F, 0, 11]].forEach(([name, p, dx, dy]) => cv.write([p[0] + dx, p[1] + dy], name));
    cv.write([s / 2, -10], o.side, 'is-length');
    return cv.out(o.label);
  }
  // 구를 4등분한 한 조각(구의 아래쪽 반 가운데 뒤쪽 반). 평평한 면은 반원 2개로, 하나는 위를 향하고 하나는 앞을 향해 서 있다. 굽은 면은 왼쪽에 조금 보인다.
  function quarterPieceFig(R, label) {
    const cv = canvas(), c = [0, 0], ry = R * TILT, phi = 32, co = Math.cos(phi * RAD), si = Math.sin(phi * RAD), E1 = [R * co, -ry * si], E2 = [-R * co, ry * si];
    // 서 있는 평평한 면의 둘레: 지름 E2–E1 과 아래쪽 반원
    const dn = (s0, s1) => { let out = ''; for (let i = 0; i <= 24; i += 1) { const s = (s0 + (s1 - s0) * i / 24) * RAD; out += (i ? 'L' : 'M') + xy([R * co * Math.cos(s), -ry * si * Math.cos(s) + R * Math.sin(s)]); } return out; };
    cv.box([0, R / 2], R, R / 2); cv.box(c, R, ry);
    cv.add(blob(arcD(c, R, R, 180, 90) + tail(dn(90, 180)) + tail(arcD(c, R, ry, 180 - phi, 180)), CREAM));
    cv.add(blob(dn(0, 180), SKY) + blob(arcD(c, R, ry, -phi, -180 - phi), SAND));
    cv.add(curve(arcD(c, R, R, 180, 90)) + curve(dn(0, 180)) + curve(arcD(c, R, ry, -phi, -180 - phi)) + stroke(E2, E1) + dot(c));
    return cv.out(label);
  }
  // 구와, 밑면이 구의 중심을 지나는 원이고 꼭짓점이 구의 겉면 위에 있는 원뿔
  function coneInSphereFig(R, label) {
    const cv = canvas(), c = [0, 0], top = [0, -R];
    addSphere(cv, c, R);
    cv.add(blob('M' + xy(top) + 'L' + xy([-R, 0]) + tail(arcD(c, R, R * TILT, 180, 0)), SHADE) + stroke(top, [-R, 0]) + stroke(top, [R, 0]) + curve(arcD(c, R, R * TILT, 180, 0)) + stroke(top, c, 'dash') + stroke(c, [R, 0], 'dash') + corner(c, top, [R, 0]) + dot(c));
    return cv.out(label);
  }
  // 원기둥에 꼭 맞게 들어 있는 구 n개(위아래로 쌓여 있다). o: { d: 밑면의 지름 글, label }
  function ballsFig(n, o) {
    const R = n === 2 ? 30 : 23, H = 2 * R * n, cv = canvas();
    addCyl(cv, [0, 0], R, H);
    for (let i = 0; i < n; i += 1) { const c = [0, R + 2 * R * i]; cv.add('<circle cx="0" cy="' + c[1] + '" r="' + R + '" style="fill:none;stroke:' + INK + ';stroke-width:1.2"/>' + curve(arcD(c, R, R * TILT, 180, 360), 'dash') + curve(arcD(c, R, R * TILT, 180, 0), 'thin')); }
    if (o.d) { const y = H + R * TILT + 11; cv.add(stroke([-R, y], [R, y], 'thin') + stroke([-R, y - 4], [-R, y + 4], 'thin') + stroke([R, y - 4], [R, y + 4], 'thin')); cv.write([0, y + 11], o.d, 'is-length'); }
    return cv.out(o.label);
  }
  // 구 안에 꼭 맞게 들어 있는 정팔면체(꼭짓점 6개가 모두 구의 겉면 위에 있다). o: { r: 구의 반지름 글, label }
  function octaInSphereFig(R, o) {
    const cv = canvas(), c = [0, 0], sq = [18, 108, 198, 288].map((t) => [R * Math.cos(t * RAD), R * Math.sin(t * RAD), 0]);
    cv.box(c, R, R);
    cv.add('<circle class="mb-poly" cx="0" cy="0" r="' + R + '"/>' + curve(arcD(c, R, R * TILT, 180, 360), 'dash') + curve(arcD(c, R, R * TILT, 180, 0), 'thin'));
    const P = addPoly(cv, c, sq.concat([[0, 0, R], [0, 0, -R]]), [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 0, 5]], { fill: SHADE });
    cv.add(stroke(c, P[0], 'thin') + dot(c));
    if (o.r) leader(cv, [R + 9 + half(o.r), -R * 0.42], mid2(c, P[0]), o.r);
    return cv.out(o.label);
  }
  // 회전축 l 과 그 왼쪽에 놓인 평면도형(도형 여럿을 잇거나 뺀 것). 길이는 px 로 주고 글은 o 에 적는다. 모두 cv.out 까지 마친 svg 를 돌려준다.
  //  quarterTri: 위는 사분원(반지름 r), 아래는 직각삼각형(가로 r, 세로 h) — o: { r, h }
  //  coneCylDome: 위부터 직각삼각형(가로 r, 세로 hc), 직사각형(가로 r, 세로 hr), 사분원(반지름 r) — o: { r, hc: 삼각형의 세로 글, s: 삼각형의 빗변 글, hr }
  //  semiRing: 반원(반지름 r + w)에서 중심이 같은 반원(반지름 r)을 뺀 도형 — o: { r, w }
  //  quarterRing: 사분원(반지름 r + w)에서 중심이 같은 사분원(반지름 r)을 뺀 도형. 중심은 아래쪽에 있다 — o: { r, w }
  //  quarterPair: 중심이 같은 두 사분원을 위(반지름 a)와 아래(반지름 b)로 이은 도형 — o: { a, b }
  //  segment: 사분원에서 직각삼각형을 뺀 활꼴(색칠), 사분원의 한 반지름은 가는 선 — o: { r }
  //  triOff: 회전축에서 g 만큼 떨어진 직각삼각형(가로 a, 세로 b. 세로인 변이 회전축 쪽에 있다)과, 빗변을 늘인 점선 — o: { g, a, b, e: 점선이 회전축과 만나는 점까지의 높이 글 }
  function shapeSpin(kind, v, o) {
    const cv = canvas(), opt = o || {}, w = (c, text) => { if (text) cv.write(c, text, kindOf(text)); }, sky = (d) => cv.add('<path class="mb-poly" style="fill:' + SKY + '" d="' + d + 'Z"/>');
    let top = 0, bottom = 0;
    if (kind === 'quarterTri') {
      const c = [0, v.r]; bottom = v.r + v.h; cv.box([-v.r / 2, v.r / 2], v.r / 2, v.r / 2); cv.point([0, bottom]);
      sky(arcD(c, v.r, v.r, 270, 180) + 'L' + xy([0, bottom]));
      cv.add(stroke([-v.r, v.r], c, 'thin') + corner(c, [0, 0], [-v.r, v.r]));
      w([-v.r / 2, v.r - 9], opt.r); w([6 + half(opt.h), v.r + v.h / 2], opt.h);
    } else if (kind === 'coneCylDome') {
      const y1 = v.hc, y2 = v.hc + v.hr, c = [0, y2]; bottom = y2 + v.r; cv.box([-v.r / 2, bottom / 2], v.r / 2, bottom / 2);
      sky('M0 0L' + xy([-v.r, y1]) + 'L' + xy([-v.r, y2]) + tail(arcD(c, v.r, v.r, 180, 90)));
      cv.add(stroke([-v.r, y1], [0, y1], 'thin') + stroke([-v.r, y2], c, 'thin') + corner([0, y1], [0, 0], [-v.r, y1]) + corner(c, [0, y1], [-v.r, y2]));
      w([-v.r / 2, y2 - 9], opt.r); w([6 + half(opt.hc || ''), y1 / 2], opt.hc); w([-v.r - 5 - half(opt.hr), (y1 + y2) / 2], opt.hr);
      if (opt.s) beside(cv, [0, 0], [-v.r, y1], [0, y1], opt.s);
    } else if (kind === 'semiRing') {
      const R = v.r + v.w, c = [0, R]; bottom = 2 * R; cv.box([-R / 2, R], R / 2, R);
      sky(arcD(c, R, R, 270, 90) + 'L' + xy([0, R + v.r]) + tail(arcD(c, v.r, v.r, 90, 270)));
      cv.add(stroke(c, [-v.r, R], 'dash') + stroke([-v.r, R], [-R, R], 'thin') + dot(c));
      w([-v.r / 2, R - 9], opt.r); w([-(v.r + R) / 2, R - 9], opt.w);
    } else if (kind === 'quarterRing') {
      const R = v.r + v.w, c = [0, R]; bottom = R; cv.box([-R / 2, R / 2], R / 2, R / 2);
      sky(arcD(c, R, R, 270, 180) + 'L' + xy([-v.r, R]) + tail(arcD(c, v.r, v.r, 180, 270)));
      cv.add(stroke([-v.r, R], c, 'dash') + corner(c, [0, R - v.r], [-v.r, R]));
      w([-v.r / 2, R + 10], opt.r); w([-(v.r + R) / 2, R + 10], opt.w);
    } else if (kind === 'quarterPair') {
      const c = [0, v.a]; bottom = v.a + v.b; cv.box([-v.b / 2, bottom / 2], v.b / 2, bottom / 2);
      sky(arcD(c, v.a, v.a, 270, 180) + 'L' + xy([-v.b, v.a]) + tail(arcD(c, v.b, v.b, 180, 90)));
      cv.add(stroke([-v.a, v.a], c, 'thin') + corner(c, [0, 0], [-v.a, v.a]));
      w([6 + half(opt.a), v.a / 2], opt.a); w([6 + half(opt.b), v.a + v.b / 2], opt.b);
    } else if (kind === 'segment') {
      const c = [0, v.r]; bottom = v.r; cv.box([-v.r / 2, v.r / 2], v.r / 2, v.r / 2);
      sky(arcD(c, v.r, v.r, 270, 180));
      cv.add(stroke([-v.r, v.r], c, 'thin') + corner(c, [0, 0], [-v.r, v.r]));
      w([-v.r / 2, v.r + 10], opt.r);
    } else if (kind === 'triOff') {
      const e = v.g * v.b / v.a, list = [[-v.g, 0], [-v.g, v.b], [-(v.g + v.a), v.b]]; bottom = v.b; top = -e;
      list.forEach(cv.point); cv.point([0, -e - 4]);
      cv.add(K.shape(list, SKY) + corner(list[1], list[0], list[2]) + stroke(list[0], [0, 0], 'dash') + stroke(list[1], [0, v.b], 'dash') + stroke(list[0], [0, -e], 'dash'));
      w([-v.g / 2, v.b + 10], opt.g); w([-(v.g + v.a / 2), v.b + 10], opt.a); w([6 + half(opt.b), v.b / 2], opt.b); w([6 + half(opt.e), -e / 2], opt.e);
    }
    axis(cv, top, bottom);
    return cv.out(opt.label, 6);
  }

  B.addTypes('7-2-4', 'hard', [
    // ── 다면체와 정다면체 ──
    H('hard-dual', '정다면체의 각 면의 한가운데에 있는 점을 꼭짓점으로 하는 정다면체', '기본 ①23 ②23', (d, n) => {
      // 함정: 처음 정다면체의 이름을 그대로 답하는 아이(정육면체 → 정육면체), 면의 개수와 꼭짓점의 개수를 바꾸어 세지 못하는 아이.
      // 새 다면체의 꼭짓점은 처음 정다면체의 면마다 하나씩이므로, 꼭짓점의 개수가 처음 정다면체의 면의 개수와 같은 정다면체를 찾는다.
      const dualOf = (r) => REG.find((x) => x.v === r.f), lead = '새 다면체의 꼭짓점은 처음 정다면체의 면마다 하나씩 있으므로, 새 다면체의 꼭짓점의 개수는 처음 정다면체의 면의 개수와 같다. ';
      if (n === 0) {
        const r = d.pick(REG), to = dualOf(r);
        return N(`${r.f === 6 ? '다음 그림과 같이 ' : ''}${r.name}의 각 면의 한가운데에 있는 점을 꼭짓점으로 하는 다면체는 정다면체이다. 이 정다면체는 정${box()}면체이다. ${box()} 안에 알맞은 수는?`, to.f, {
          lead: '정', unit: '면체', figure: r.f === 6 ? dualFig('정육면체와 그 안에 그린 다면체의 겨냥도. 안쪽 다면체의 꼭짓점은 정육면체의 여섯 면의 한가운데에 하나씩 있다') : undefined,
          explain: lead + `${r.name}의 면은 ${r.f}개이므로 새 다면체의 꼭짓점은 ${r.f}개이다. 꼭짓점이 ${r.f}개인 정다면체는 ${to.name}이다.`,
          facts: { calc: [[`${r.f}*${to.m}/${to.p}`, 0]], unseen: [r.f, to.m, to.p] }
        });
      }
      const wrong = d.pick([['정십이면체', '정십이면체'], ['정이십면체', '정이십면체'], ['정육면체', '정육면체'], ['정팔면체', '정팔면체'], ['정사면체', '정팔면체']]);
      const rows = d.shuffle(d.shuffle(REG.filter((r) => r.name !== wrong[0])).slice(0, 3).map((r) => [r.name + ' – ' + dualOf(r).name, true]).concat([[wrong.join(' – '), false]]));
      const real = REG.find((r) => r.name === wrong[0]);
      return C('다음 중 정다면체와, 그 정다면체의 각 면의 한가운데에 있는 점을 꼭짓점으로 하는 정다면체를 차례로 짝 지은 것으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: lead + `${real.name}의 면은 ${real.f}개이고, 꼭짓점이 ${real.f}개인 정다면체는 ${dualOf(real).name}이다.`,
        facts: { truth: rows.map((r) => r[1]), want: false }
      });
    }, { count: 2, standard: SOLID }),
    H('hard-face-edges', '면의 모양과 개수로 다면체의 모서리의 개수 구하기', '심11', (d) => {
      // 함정: 면의 변의 개수를 모두 더한 수를 그대로 답하는 아이. 다면체의 모서리 하나는 두 면의 변이 맞붙은 것이므로 2로 나눈다.
      const [p, a, q, b] = d.pick([[5, 12, 6, 20], [3, 4, 6, 4], [3, 8, 4, 6], [4, 6, 6, 8], [3, 8, 8, 6], [3, 20, 5, 12]]), name = (k) => '정' + K.gon(k), e = (p * a + q * b) / 2;
      return N(`${name(p)} ${a}개와 ${name(q)} ${b}개로 이루어진 다면체${p === 5 && q === 6 ? '(축구공 모양)' : ''}가 있다. 이 다면체의 모서리의 개수는?`, e, {
        unit: '개', explain: `${name(p)} ${a}개의 변은 모두 ${p} × ${a} = ${p * a}(개), ${name(q)} ${b}개의 변은 모두 ${q} × ${b} = ${q * b}(개)이다. 다면체의 모서리 하나는 두 면의 변이 맞붙은 것이므로 모서리의 개수는 (${p * a} + ${q * b}) ÷ 2 = ${e}이다.`,
        facts: calc(`(${p}*${a}+${q}*${b})/2`, [p, q, 2])
      });
    }, { standard: SOLID }),
    H('hard-cut-corners', '꼭짓점마다 삼각뿔을 잘라 낸 각기둥의 꼭짓점, 모서리, 면의 개수', '심12', (d) => {
      // 걸리는 곳: 처음 꼭짓점·모서리가 남아 있다고 여기는 아이. 새 꼭짓점은 처음 모서리의 중점뿐이고, 처음 모서리는 양 끝에서 잘려 모두 없어진다.
      const n = d.int(3, 5), s = solid('prism', n);
      return M(`다음 그림과 같이 ${s.name}의 한 꼭짓점에 모인 세 모서리의 중점을 지나는 평면으로 삼각뿔을 잘라 내려고 한다(색칠한 삼각형이 잘리는 자리이다). ${s.name}의 모든 꼭짓점에서 이와 같이 삼각뿔을 잘라 낼 때 생기는 다면체의 꼭짓점, 모서리, 면의 개수를 각각 구하시오.`, [{ label: '꼭짓점', answer: 3 * n, unit: '개' }, { label: '모서리', answer: 6 * n, unit: '개' }, { label: '면', answer: 3 * n + 2, unit: '개' }], {
        figure: cornerMarkFig(n, `${s.name}의 겨냥도. 한 꼭짓점에 모인 세 모서리의 중점을 이은 삼각형이 색칠되어 있다`),
        explain: `${s.name}의 꼭짓점은 ${2 * n}개, 모서리는 ${3 * n}개, 면은 ${n + 2}개이다. 새 다면체의 꼭짓점은 처음 모서리의 중점이므로 ${3 * n}개이다. 처음 모서리는 양 끝에서 잘려 모두 없어지고 잘린 자리의 삼각형마다 변이 3개씩 있으므로 모서리는 3 × ${2 * n} = ${6 * n}(개)이다. 면은 처음의 면 ${n + 2}개에 잘린 자리의 삼각형 ${2 * n}개를 더한 ${3 * n + 2}개이다.`,
        facts: { calc: [[`3*${n}`, 0], [`3*2*${n}`, 1], [`${n}+2+2*${n}`, 2]], unseen: [n, 2, 3] }
      });
    }, { standard: SOLID }),
    H('hard-cube-section', '세 점을 지나는 평면으로 정육면체를 자를 때 생기는 단면의 모양', '심19', (d) => {
      // 걸리는 곳: 세 점을 이은 삼각형이 단면이라고 여기는 아이. 평면은 세 점을 이은 삼각형 밖으로도 이어져 다른 모서리와 만난다.
      const mark = d.pick(['G', 'G', 'F', 'H']), right = mark === 'G' ? '오각형' : '사각형', options = ['삼각형', '사각형', '오각형', '육각형'];
      return C(`다음 그림의 정육면체에서 두 점 P, Q는 각각 모서리 AB, AD의 중점이다. 세 점 P, Q, ${mark}를 지나는 평면으로 이 정육면체를 자를 때 생기는 단면의 모양은?`, options, options.indexOf(right), {
        figure: cubePQFig(mark, `정육면체의 겨냥도. 윗면의 꼭짓점은 A, B, C, D, 아랫면의 꼭짓점은 E, F, G, H이고 A 아래에 E, B 아래에 F, C 아래에 G, D 아래에 H가 있다. 점 P는 모서리 AB의 중점, 점 Q는 모서리 AD의 중점이다`),
        explain: mark === 'G'
          ? '평면은 윗면과 선분 PQ에서 만난다. 선분 PQ를 양쪽으로 늘인 직선은 모서리 CB, CD를 늘인 직선과 만나고, 이 두 점을 각각 점 G와 이은 선분은 모서리 BF, DH와 한 점씩에서 만난다. 단면은 점 P, Q, G와 모서리 BF, DH 위의 두 점을 꼭짓점으로 하는 오각형이다.'
          : '삼각형 APQ와 삼각형 ABD는 모두 직각이등변삼각형이므로 ∠APQ = ∠ABD = 45°이고, 동위각의 크기가 같으므로 선분 PQ와 대각선 BD는 평행하다. 대각선 BD와 FH도 평행하므로 선분 PQ와 FH는 평행하고, 네 점 P, Q, H, F는 한 평면 위에 있다. 단면은 사각형 PQHF이다.',
        facts: { truth: options.map((o) => o === right), want: true }
      });
    }, { standard: SOLID }),

    // ── 회전체와 단면 ──
    H('hard-ring-section', '회전축에서 떨어진 원을 돌린 회전체를 회전축에 수직인 평면으로 자른 단면의 넓이', '기본 ①36', (d) => {
      // 걸리는 곳: 단면을 처음 원 그대로라고 여기는 아이, 고리의 안쪽 원을 빼지 않는 아이. 단면은 큰 원에서 작은 원을 뺀 고리 모양이다.
      const g = d.int(1, 6), r = d.int(1, 4), out = g + 2 * r, S = out * out - g * g;
      return N(`다음 그림과 같이 반지름의 길이가 ${r} cm인 원 O가 직선 ${LV()}에서 ${g} cm 떨어져 있다. 이 원을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체를, 점 O를 지나고 직선 ${LV()}에 수직인 평면으로 자를 때 생기는 단면의 넓이는?`, S, {
        unit: U2, figure: circleOffFig(spx(g, 11, 36, 66), spx(r, 13, 36, 50), { g: cm(g), r: cm(r), label: `원 O와 회전축 l. 원의 반지름 ${cm(r)}, 회전축에서 원의 가장 가까운 점까지의 거리 ${cm(g)}` }),
        explain: `회전체는 가운데가 뚫린 고리 모양이다. 단면은 반지름의 길이가 ${g} + ${r} + ${r} = ${out}(cm)인 원에서 반지름의 길이가 ${g} cm인 원을 뺀 모양이다. ${PI} × ${out} × ${out} − ${PI} × ${g} × ${g} = ${out * out}${PI} − ${kpi(g * g)} = ${S}${PI}(cm²)`,
        facts: calc(`(${g}+${r}+${r})*(${g}+${r}+${r})-${g}*${g}`)
      });
    }, { standard: SOLID }),
    H('hard-cyl-section-shape', '원기둥을 평면으로 자를 때 생기는 단면이 될 수 없는 모양', '기본 ②34', (d) => {
      // 함정: 비스듬히 자르면 사다리꼴이 된다고 여기는 아이. 옆면이 굽어 있으므로 곧은 변은 밑면이 잘린 자리와 회전축에 평행하게 잘린 자리에만 생긴다.
      const keys = d.shuffle(['rect', 'trap', 'disk', 'oval', 'cutOval']), labels = TAGS.slice(0, 5);
      return C('다음 중 원기둥을 한 평면으로 자를 때 생기는 단면의 모양이 될 수 없는 것은?', labels, keys.indexOf('trap'), {
        figure: tiles(keys.map((k) => one(FLAT[k].draw, FLAT[k].said))),
        explain: '회전축에 수직인 평면으로 자르면 원, 회전축에 평행한 평면으로 자르면 직사각형이 된다. 비스듬한 평면으로 자르면 길쭉한 둥근 모양이 되고, 그 평면이 밑면을 지나면 밑면이 잘린 자리만 곧은 변이 된다. 옆면은 굽은 면이므로 밑면에 비스듬한 곧은 변은 생기지 않는다. 따라서 윗변과 아랫변의 길이가 다른 사다리꼴은 될 수 없다.',
        facts: { kindPick: { kinds: keys, target: 'trap' } }
      });
    }, { standard: SOLID }),
    H('hard-hyp-widest', '빗변을 회전축으로 하여 돌린 회전체를 회전축에 수직인 평면으로 자른 단면 중 가장 큰 단면의 반지름', '심32', (d) => {
      // 걸리는 곳: 직각을 낀 변의 길이를 그대로 반지름이라 여기는 아이. 가장 큰 단면의 반지름은 직각인 꼭짓점에서 빗변까지의 거리이고, 삼각형의 넓이를 두 가지로 나타내어 구한다.
      const [p, q, c] = d.pick(RIGHT), k = 110 / c, [top, bottom] = reduce(p * q, c);
      return F(`다음 직각삼각형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체를 회전축에 수직인 평면으로 자르려고 한다. 이때 생기는 단면 중에서 가장 큰 단면의 반지름의 길이는?`, top, bottom, {
        unit: 'cm', improper: true, anyForm: true,
        figure: spin('triHyp', { p: p * k, q: q * k }, { p: cm(p), q: cm(q), c: cm(c), label: `직각삼각형과 회전축 l. 직각을 낀 두 변은 ${cm(p)}, ${cm(q)}이고, 길이가 ${cm(c)}인 빗변이 회전축 위에 놓여 있다` }),
        explain: `회전체는 원뿔 2개를 밑면끼리 붙인 모양이고, 가장 큰 단면의 반지름은 직각인 꼭짓점에서 빗변에 내린 수선의 길이이다. 이 길이를 ${V('x')} cm라 하면 직각삼각형의 넓이는 ${frac(1, 2)} × ${p} × ${q} = ${frac(1, 2)} × ${c} × ${V('x')}이므로 ${V('x')} = ${p * q} ÷ ${c} = ${frac(top, bottom)}`,
        facts: { value: `${p}*${q}/${c}` }
      });
    }, { standard: SOLID }),
    H('hard-rolling-cone', '꼭짓점을 중심으로 굴린 원뿔의 모선의 길이와 옆넓이', '심58 / 기본 ①38', (d, n) => {
      // 걸리는 곳: 원뿔이 지나간 자리가 꼭짓점을 중심으로 하고 모선을 반지름으로 하는 원이라는 것을 읽지 못하는 아이. 이 원의 둘레는 밑면의 둘레의 (바퀴 수)배이다.
      const r = d.int(2, 7), t = d.int(2, 5), l = r * t;
      const figure = rollFig(t, { r: cm(r), label: `평면 위에 눕혀 놓은 원뿔의 겨냥도. 밑면의 반지름 ${cm(r)}. 꼭짓점 O를 중심으로 굴릴 때 밑면의 둘레가 지나가는 원이 점선으로 그려져 있다` });
      const why = `원뿔의 밑면의 둘레가 지나간 자리는 점 O를 중심으로 하고 모선을 반지름으로 하는 원이다. 이 원의 둘레의 길이는 밑면의 둘레의 길이의 ${t}배이므로 2 × ${PI} × (모선의 길이) = 2 × ${PI} × ${r} × ${t}에서 모선의 길이는 ${r} × ${t} = ${l}(cm)이다.`;
      const ask = `다음 그림과 같이 밑면의 반지름의 길이가 ${r} cm인 원뿔을 평면 위에 눕혀 놓고 꼭짓점 O를 중심으로 굴렸더니 ${t}바퀴 회전하고 처음 자리로 돌아왔다. 이 원뿔의 `;
      if (n === 0) return N(ask + '모선의 길이는?', l, { unit: 'cm', figure, explain: why, facts: calc(`${r}*${t}`) });
      return N(ask + '옆넓이는?', r * l, { unit: U2, figure, explain: why + ` 옆넓이는 ${PI} × ${r} × ${l} = ${r * l}${PI}(cm²)`, facts: calc(`${r}*${r}*${t}`) });
    }, { count: 2 }),

    // ── 기둥 ──
    H('hard-two-cyl', '큰 원기둥 위에 작은 원기둥을 올린 입체도형의 겉넓이와 부피', '기본 ①51 ②94', (d, n) => {
      // 함정: 두 원기둥의 겉넓이를 그대로 더하는 아이(맞붙은 원은 겉이 아니다), 고리의 너비를 아래 원기둥의 반지름으로 읽는 아이.
      const r = d.int(1, 4), w = d.int(1, 4), R = r + w, h = d.int(2, 8), H = d.int(2, 8);
      const figure = twoCylFig(r, h, R, H, { r: cm(r), h: cm(h), w: cm(w), H: cm(H), label: `큰 원기둥 위의 가운데에 작은 원기둥을 올린 입체도형의 겨냥도. 위 원기둥은 밑면의 반지름 ${cm(r)}, 높이 ${cm(h)}이고 아래 원기둥은 높이 ${cm(H)}이다. 아래 원기둥의 윗면에서 위 원기둥의 밖으로 드러난 고리 모양의 너비는 ${cm(w)}이다` });
      const lead = `아래 원기둥의 밑면의 반지름의 길이는 ${r} + ${w} = ${R}(cm)이다. `;
      if (n === 0) {
        const S = 2 * R * R + 2 * R * H + 2 * r * h;
        return N('다음 그림은 큰 원기둥 위의 가운데에 작은 원기둥을 올린 입체도형이다. 이 입체도형의 겉넓이는?', S, {
          unit: U2, figure, explain: lead + `위에서 보이는 면(작은 원기둥의 윗면과 큰 원기둥의 윗면에서 드러난 고리)의 넓이의 합은 큰 원기둥의 밑넓이와 같다. 따라서 겉넓이는 큰 원기둥의 겉넓이에 작은 원기둥의 옆넓이를 더한 것이다. (${PI} × ${R} × ${R} × 2 + 2 × ${PI} × ${R} × ${H}) + 2 × ${PI} × ${r} × ${h} = ${2 * R * R + 2 * R * H}${PI} + ${2 * r * h}${PI} = ${S}${PI}(cm²)`,
          facts: calc(`(${r}+${w})*(${r}+${w})*2+2*(${r}+${w})*${H}+2*${r}*${h}`, [2])
        });
      }
      const vol = r * r * h + R * R * H;
      return N('다음 그림은 큰 원기둥 위의 가운데에 작은 원기둥을 올린 입체도형이다. 이 입체도형의 부피는?', vol, {
        unit: U3, figure, explain: lead + `작은 원기둥의 부피는 ${PI} × ${r} × ${r} × ${h} = ${r * r * h}${PI}(cm³), 큰 원기둥의 부피는 ${PI} × ${R} × ${R} × ${H} = ${R * R * H}${PI}(cm³)이다. ${r * r * h}${PI} + ${R * R * H}${PI} = ${vol}${PI}(cm³)`,
        facts: calc(`${r}*${r}*${h}+(${r}+${w})*(${r}+${w})*${H}`)
      });
    }, { count: 2 }),
    H('hard-holed-surface', '구멍이 뚫리거나 홈이 파인 기둥의 겉넓이', '심40·41 / 기본 ①50·52 ②54', (d, n) => {
      // 함정: 구멍의 안쪽 옆면을 넣지 않는 아이, 밑넓이에서 구멍을 빼지 않는 아이(두 밑면 가운데 하나에서만 빼는 아이), 홈의 굽은 면을 넣지 않는 아이.
      if (n === 0) {
        const r = d.int(1, 3), a = 2 * r + d.int(2, 4), b = 2 * r + d.int(2, 4), c = r + d.int(1, 5), flat = 2 * a * b + 2 * (a + b) * c, round = 2 * r * c - 2 * r * r;
        return M('다음 그림과 같이 직육면체 모양의 입체도형에 윗면에서 아랫면까지 원기둥 모양의 구멍이 뚫려 있다. 이 입체도형의 겉넓이를 구하시오.', [{ answer: round, unit: 'π +' }, { answer: flat, unit: 'cm²' }], {
          figure: holedBoxFig(a, b, c, r, { a: cm(a), b: cm(b), c: cm(c), r: cm(r), label: `원기둥 모양의 구멍이 뚫린 직육면체 모양의 입체도형의 겨냥도. 직육면체의 밑면은 가로 ${cm(a)}, 세로 ${cm(b)}이고 높이는 ${cm(c)}이다. 구멍의 밑면의 반지름은 ${cm(r)}이고 구멍은 윗면에서 아랫면까지 뚫려 있다` }),
          shown: `(${round}${PI} + ${flat}) cm²`,
          explain: `한 밑면의 넓이는 직사각형에서 원을 뺀 (${a * b} − ${kpi(r * r)}) cm²이다. 바깥쪽 옆넓이는 (${a} + ${b} + ${a} + ${b}) × ${c} = ${2 * (a + b) * c}(cm²), 구멍의 안쪽 옆넓이는 2 × ${PI} × ${r} × ${c} = ${2 * r * c}${PI}(cm²)이다. 겉넓이는 (${a * b} − ${kpi(r * r)}) × 2 + ${2 * (a + b) * c} + ${2 * r * c}${PI} = ${round}${PI} + ${flat}(cm²)`,
          facts: { calc: [[`2*${r}*${c}-2*${r}*${r}`, 0], [`2*${a}*${b}+2*(${a}+${b})*${c}`, 1]], unseen: [2] }
        });
      }
      if (n === 1) {
        const r = d.int(2, 4), a = 2 * r + d.int(3, 7), b = r + d.int(3, 7), c = r + d.int(1, 5), edge = 2 * a + 2 * b - 2 * r, flat = 2 * a * b + edge * c, round = r * c - r * r;
        return M('다음 그림과 같이 직육면체 모양의 입체도형의 한 옆면의 가운데를 위에서 아래까지 반원기둥 모양으로 파냈다. 이 입체도형의 겉넓이를 구하시오.', [{ answer: round, unit: 'π +' }, { answer: flat, unit: 'cm²' }], {
          figure: notchBoxFig(a, b, c, r, { a: cm(a), b: cm(b), c: cm(c), r: cm(r), label: `한 옆면을 반원기둥 모양으로 파낸 직육면체 모양의 입체도형의 겨냥도. 직육면체의 밑면은 가로 ${cm(a)}, 세로 ${cm(b)}이고 높이는 ${cm(c)}이다. 가로 ${cm(a)}인 앞쪽 옆면의 가운데가 반지름 ${cm(r)}인 반원기둥 모양으로 위에서 아래까지 파여 있다` }),
          shown: `(${round}${PI} + ${flat}) cm²`,
          explain: `밑면은 직사각형에서 반원을 뺀 모양이므로 두 밑넓이의 합은 ${a} × ${b} × 2 − ${PI} × ${r} × ${r} = ${2 * a * b} − ${r * r}${PI}(cm²)이다. 밑면의 둘레에서 곧은 부분의 길이는 ${a} + ${b} + ${b} + (${a} − ${2 * r}) = ${edge}(cm), 굽은 부분의 길이는 반원의 호 ${PI} × ${r} = ${r}${PI}(cm)이므로 옆넓이는 (${edge} + ${r}${PI}) × ${c} = ${edge * c} + ${r * c}${PI}(cm²)이다. 겉넓이는 ${2 * a * b} − ${r * r}${PI} + ${edge * c} + ${r * c}${PI} = ${round}${PI} + ${flat}(cm²)`,
          facts: { calc: [[`${r}*${c}-${r}*${r}`, 0], [`2*${a}*${b}+(2*${a}+2*${b}-2*${r})*${c}`, 1]], unseen: [2] }
        });
      }
      const g = d.int(1, 4), w = d.until(() => d.int(1, 4), (v) => v !== g), h = d.until(() => d.int(4, 10), (v) => v !== g && v !== g + w && v !== w), Rr = g + w, S = 2 * (Rr * Rr - g * g) + 2 * Rr * h + 2 * g * h, k = Math.min(52 / Rr, 96 / h);
      return N('다음 그림과 같이 가운데가 원기둥 모양으로 뚫린 원기둥 모양의 입체도형의 겉넓이는?', S, {
        unit: U2, figure: hollowFig(Math.max(40, Rr * k), Math.max(40, Rr * k) * g / Rr, Math.max(50, h * k), { R: cm(Rr), r: cm(g), h: cm(h), label: `가운데가 원기둥 모양으로 뚫린 원기둥의 겨냥도. 큰 원기둥의 밑면의 반지름 ${cm(Rr)}, 뚫린 원기둥의 밑면의 반지름 ${cm(g)}, 높이 ${cm(h)}` }),
        explain: `한 밑면의 넓이는 큰 원에서 작은 원을 뺀 ${PI} × ${Rr} × ${Rr} − ${PI} × ${g} × ${g} = ${Rr * Rr - g * g}${PI}(cm²)이다. 바깥쪽 옆넓이는 2 × ${PI} × ${Rr} × ${h} = ${2 * Rr * h}${PI}(cm²), 안쪽 옆넓이는 2 × ${PI} × ${g} × ${h} = ${2 * g * h}${PI}(cm²)이다. 겉넓이는 ${Rr * Rr - g * g}${PI} × 2 + ${2 * Rr * h}${PI} + ${2 * g * h}${PI} = ${S}${PI}(cm²)`,
        facts: calc(`2*(${Rr}*${Rr}-${g}*${g})+2*${Rr}*${h}+2*${g}*${h}`, [2])
      });
    }, { count: 3 }),
    H('hard-sector-prism-surface', '밑면이 부채꼴인 기둥의 겉넓이', '기본 ②52', (d) => {
      // 함정: 옆면 가운데 평평한 직사각형 2개를 넣지 않는 아이, 굽은 옆면을 원기둥의 옆넓이 그대로 넣는 아이, 밑면을 1개만 넣는 아이.
      const [r, ang] = d.pick([[3, 120], [6, 60], [6, 120], [4, 90], [6, 90], [8, 90], [6, 150], [9, 120]]), h = d.until(() => d.int(3, 9), (v) => v !== r), S = r * r * ang / 360, arc = 2 * r * ang / 360, a = 2 * S + arc * h, b = 2 * r * h;
      return M('다음 그림과 같이 밑면이 부채꼴인 기둥의 겉넓이를 구하시오.', [{ answer: a, unit: 'π +' }, { answer: b, unit: 'cm²' }], {
        figure: sectorPrismFig(ang, r, h, { r: cm(r), h: cm(h), angle: ang + '°', label: `밑면이 부채꼴인 기둥의 겨냥도. 밑면은 반지름 ${cm(r)}, 중심각 ${ang}°인 부채꼴이고, 기둥의 높이는 ${cm(h)}` }),
        shown: `(${a}${PI} + ${b}) cm²`,
        explain: `한 밑면의 넓이는 ${PI} × ${r} × ${r} × ${frac(ang, 360)} = ${S}${PI}(cm²)이다. 밑면의 둘레는 호의 길이 2 × ${PI} × ${r} × ${frac(ang, 360)} = ${arc}${PI}(cm)와 반지름 2개의 길이 ${2 * r} cm의 합이므로 옆넓이는 (${arc}${PI} + ${2 * r}) × ${h} = ${arc * h}${PI} + ${b}(cm²)이다. 겉넓이는 ${S}${PI} × 2 + ${arc * h}${PI} + ${b} = ${a}${PI} + ${b}(cm²)`,
        facts: { calc: [[`2*${r}*${r}*${ang}/360+2*${r}*${ang}/360*${h}`, 0], [`2*${r}*${h}`, 1]], unseen: [2, 360] }
      });
    }),
    H('hard-ring-sector-prism', '밑면이 부채꼴에서 작은 부채꼴을 잘라 낸 모양인 기둥의 부피', '심39', (d) => {
      const [r1, r2, ang] = d.pick([[3, 6, 120], [2, 4, 90], [2, 6, 90], [4, 8, 90], [3, 9, 120], [2, 4, 120], [4, 6, 90], [3, 9, 90], [6, 9, 120], [4, 8, 60]]), h = d.until(() => d.int(3, 10), (v) => v !== r1 && v !== r2), S = (r2 * r2 - r1 * r1) * ang / 360;
      return N(`다음 그림과 같이 밑면이 반지름의 길이가 ${r2} cm, 중심각의 크기가 ${ang}°인 부채꼴에서 중심이 같고 반지름의 길이가 ${r1} cm인 부채꼴을 잘라 낸 모양인 기둥이 있다. 이 기둥의 높이가 ${h} cm일 때, 부피는?`, S * h, {
        unit: U3, figure: ringSectorFig(ang, r1, r2, h, { h: cm(h), angle: ang + '°', label: `밑면이 부채꼴에서 작은 부채꼴을 잘라 낸 모양인 기둥의 겨냥도. 두 부채꼴의 중심(점선이 만나는 점)은 같고 중심각은 ${ang}°이다. 기둥의 높이는 ${cm(h)}` }),
        explain: `밑넓이는 큰 부채꼴의 넓이에서 작은 부채꼴의 넓이를 뺀 ${PI} × ${r2} × ${r2} × ${frac(ang, 360)} − ${PI} × ${r1} × ${r1} × ${frac(ang, 360)} = ${kpi(showQ(r2 * r2 * ang, 360))} − ${kpi(showQ(r1 * r1 * ang, 360))} = ${S}${PI}(cm²)이다. 부피는 ${S}${PI} × ${h} = ${S * h}${PI}(cm³)`,
        facts: calc(`(${r2}*${r2}-${r1}*${r1})*${ang}/360*${h}`, [360])
      });
    }),
    H('hard-slant-cyl', '밑면에 비스듬한 평면으로 자른 원기둥의 부피', '심47', (d) => {
      // 걸리는 곳: 높이가 하나로 정해지지 않아 구할 수 없다고 여기는 아이, 높은 쪽(낮은 쪽) 높이만으로 원기둥의 부피를 구하는 아이.
      // 똑같은 입체도형 2개를 잘린 면끼리 맞붙이면 높이가 (낮은 쪽의 높이) + (높은 쪽의 높이)인 원기둥이 된다.
      const r = d.int(2, 5), h1 = d.int(3, 8), h2 = h1 + 2 * d.int(1, 3), vol = r * r * (h1 + h2) / 2;
      return N('다음 그림은 원기둥을 밑면에 비스듬한 평면으로 잘라 만든 입체도형이다. 이 입체도형의 부피는?', vol, {
        unit: U3, figure: slantCylFig(r, h1, h2, { r: cm(r), h1: cm(h1), h2: cm(h2), label: `원기둥을 밑면에 비스듬한 평면으로 자른 입체도형의 겨냥도. 밑면의 반지름 ${cm(r)}, 가장 낮은 쪽의 높이 ${cm(h1)}, 가장 높은 쪽의 높이 ${cm(h2)}` }),
        explain: `똑같은 입체도형 2개를 잘린 면끼리 맞붙이면 밑면의 반지름의 길이가 ${r} cm, 높이가 ${h1} + ${h2} = ${h1 + h2}(cm)인 원기둥이 된다. 구하는 부피는 이 원기둥의 부피의 절반이므로 ${PI} × ${r} × ${r} × ${h1 + h2} × ${frac(1, 2)} = ${vol}${PI}(cm³)`,
        facts: calc(`${r}*${r}*(${h1}+${h2})/2`, [2])
      });
    }),
    H('hard-tilted-water', '기울인 두 그릇에 담긴 물의 양이 같을 때 길이 구하기', '심52 / 기본 ①70 ②98', (d) => {
      // 함정: 삼각뿔 모양으로 담긴 물의 부피에서 3분의 1을 빠뜨리는 아이, 두 그릇의 물을 모두 삼각기둥(또는 모두 삼각뿔)으로 셈하는 아이.
      const v = d.until(() => { const p = d.int(3, 12), q = d.int(3, 12), r = d.int(3, 12), a = d.int(3, 10), len = d.int(3, 9); return { p, q, r, a, len, x: p * q * r / (3 * a * len) }; }, (t) => Number.isInteger(t.x) && t.x >= 2 && t.x <= 10 && t.x !== t.a && t.a * t.len * t.x % 2 === 0 && new Set([t.p, t.q, t.r]).size >= 2);
      const { p, q, r, a, len, x } = v, vol = p * q * r / 6;
      const left = tiltCornerFig([[p, cm(p)], [q, cm(q)], [r, cm(r)]], `한 꼭짓점을 아래로 하여 기울인 직육면체 모양의 그릇. 물은 삼각뿔 모양으로 담겨 있고, 아래 꼭짓점에서 물의 면까지 세 모서리를 따라 잰 길이는 ${cm(p)}, ${cm(q)}, ${cm(r)}이다`);
      const said = `한 모서리를 아래로 하여 기울인 직육면체 모양의 그릇. 물은 삼각기둥 모양으로 담겨 있다. 물의 밑면인 직각삼각형에서 직각을 낀 두 변의 길이는 ${cm(a)}, ㉠이고, 아래 모서리의 길이는 ${cm(len)}이다`;
      const right = a >= x ? tiltEdgeFig(a, x, len, { a: cm(a), b: '㉠', len: cm(len), label: said }) : tiltEdgeFig(x, a, len, { a: '㉠', b: cm(a), len: cm(len), label: said });
      return N('다음 그림은 직육면체 모양의 두 그릇 가, 나에 물을 담아 기울여 놓은 것이다. 두 그릇에 담긴 물의 양이 같을 때, ㉠의 길이는? (단, 그릇의 두께는 생각하지 않는다.)', x, {
        unit: 'cm', figure: tiles([left, right]),
        explain: `그릇 가의 물은 직각을 낀 두 변의 길이가 ${p} cm, ${q} cm인 직각삼각형을 밑면으로 하고 높이가 ${r} cm인 삼각뿔 모양이므로 부피는 ${frac(1, 3)} × (${p} × ${q} ÷ 2) × ${r} = ${vol}(cm³)이다. 그릇 나의 물은 직각을 낀 두 변의 길이가 ${a} cm, ㉠인 직각삼각형을 밑면으로 하고 높이가 ${len} cm인 삼각기둥 모양이므로 부피는 (${a} × ㉠ ÷ 2) × ${len}이다. 두 부피가 같으므로 ㉠ = ${vol} × 2 ÷ ${a} ÷ ${len} = ${x}(cm)`,
        facts: calc(`(${p}*${q}/2*${r}/3)/(${a}*${len}/2)`, [2, 3])
      });
    }),

    // ── 뿔 ──
    H('hard-cone-frustum-surface', '원뿔대의 겉넓이', '심60 / 기본 ①67·87 ②71', (d, n) => {
      // 함정: 두 밑면 가운데 하나만 넣는 아이, 옆넓이를 큰 원뿔의 옆넓이 그대로 넣는 아이(잘라 낸 원뿔의 옆넓이를 빼야 한다), 높이를 모선 자리에 쓰는 아이.
      if (n === 0) {
        const [r1, r2, cut, sl] = d.pick([[3, 6, 5, 5], [6, 12, 10, 10], [2, 4, 3, 3], [4, 8, 6, 6], [4, 8, 5, 5], [3, 6, 4, 4], [3, 9, 4, 8], [2, 6, 3, 6], [2, 6, 4, 8], [4, 6, 8, 4], [6, 9, 8, 4], [6, 9, 10, 5], [3, 9, 5, 10], [6, 8, 9, 3], [3, 6, 7, 7], [5, 10, 8, 8]]);
        const side = r2 * (cut + sl) - r1 * cut, S = r1 * r1 + r2 * r2 + side;
        return N('다음 그림은 원뿔을 밑면에 평행한 평면으로 잘라 만든 원뿔대이다(점선은 잘라 낸 원뿔이다). 이 원뿔대의 겉넓이는?', S, {
          unit: U2, figure: frustumCutFig(r1, r2, sl, cut, { r1: cm(r1), r2: cm(r2), s: cm(sl), cut: cm(cut), label: `원뿔대의 겨냥도. 두 밑면의 반지름 ${cm(r1)}, ${cm(r2)}, 원뿔대의 모선 ${cm(sl)}. 옆 선을 길게 늘이면(점선) 한 점에서 만나 원뿔이 되고, 잘라 낸 작은 원뿔의 모선은 ${cm(cut)}이다` }),
          explain: `두 밑넓이는 ${PI} × ${r1} × ${r1} = ${r1 * r1}${PI}(cm²), ${PI} × ${r2} × ${r2} = ${r2 * r2}${PI}(cm²)이다. 옆넓이는 모선의 길이가 ${cut} + ${sl} = ${cut + sl}(cm)인 큰 원뿔의 옆넓이에서 잘라 낸 원뿔의 옆넓이를 뺀 ${PI} × ${r2} × ${cut + sl} − ${PI} × ${r1} × ${cut} = ${r2 * (cut + sl)}${PI} − ${r1 * cut}${PI} = ${side}${PI}(cm²)이다. 겉넓이는 ${r1 * r1}${PI} + ${r2 * r2}${PI} + ${side}${PI} = ${S}${PI}(cm²)`,
          facts: calc(`${r1}*${r1}+${r2}*${r2}+${r2}*(${cut}+${sl})-${r1}*${cut}`)
        });
      }
      const [a, cutH, cutS, b, h, sl] = d.pick([[3, 4, 5, 6, 4, 5], [3, 4, 5, 9, 8, 10], [6, 8, 10, 9, 4, 5], [4, 3, 5, 8, 3, 5], [4, 3, 5, 12, 6, 10], [8, 6, 10, 12, 3, 5]]), side = b * (cutS + sl) - a * cutS, S = a * a + b * b + side;
      // 윗변이 48px 에 못 미치면 윗변 밑에 적는 글이 직각 표시에 닿는다.
      const k = Math.max(48 / a, Math.min(13, 84 / b)), kv = Math.min(k, 150 / (cutH + h));
      return N(SPIN_ASK('사다리꼴을', '겉넓이는?'), S, {
        unit: U2, figure: spin('trap', { a: a * k, b: b * k, h: h * kv }, { a: cm(a), b: cm(b), h: cm(h), s: cm(sl), ext: cm(cutH), extS: cm(cutS), label: `사다리꼴과 회전축 l. 윗변 ${cm(a)}, 아랫변 ${cm(b)}, 비스듬한 변 ${cm(sl)}이고, 두 밑변에 수직인 길이 ${cm(h)}인 변이 회전축 위에 놓여 있다. 비스듬한 변을 길게 늘인 선(점선)은 길이가 ${cm(cutS)}이고, 윗변에서 위로 ${cm(cutH)} 떨어진 곳에서 회전축과 만난다` }),
        explain: `회전체는 두 밑면의 반지름의 길이가 ${a} cm, ${b} cm이고 모선의 길이가 ${sl} cm인 원뿔대이다(겉넓이에는 높이가 아니라 모선의 길이를 쓴다). 두 밑넓이는 ${a * a}${PI} cm², ${b * b}${PI} cm²이다. 옆넓이는 모선의 길이가 ${cutS} + ${sl} = ${cutS + sl}(cm)인 큰 원뿔의 옆넓이에서 잘라 낸 원뿔의 옆넓이를 뺀 ${PI} × ${b} × ${cutS + sl} − ${PI} × ${a} × ${cutS} = ${side}${PI}(cm²)이다. 겉넓이는 ${a * a}${PI} + ${b * b}${PI} + ${side}${PI} = ${S}${PI}(cm²)`,
        facts: calc(`${a}*${a}+${b}*${b}+${b}*(${cutS}+${sl})-${a}*${cutS}`)
      });
    }, { count: 2 }),
    H('hard-cone-cup-time', '원뿔 모양의 그릇에 물을 더 넣어 가득 채우는 데 걸리는 시간', '심54 / 기본 ①69', (d) => {
      // 걸리는 곳: 물의 깊이가 그릇의 높이의 3분의 1이면 3배의 시간이 걸린다고 여기는 아이. 물이 담긴 부분도 원뿔이므로 두 원뿔의 부피를 각각 구해 견준다.
      const [R, H, k] = d.pick([[6, 9, 3], [6, 12, 2], [9, 12, 3], [4, 6, 2], [6, 6, 2], [8, 12, 2], [3, 9, 3], [12, 9, 3], [6, 18, 3], [8, 6, 2]]), r = R / k, h = H / k, t = d.int(1, 5), small = r * r * h / 3, full = R * R * H / 3, all = full / small * t;
      return N(`다음 그림과 같이 밑면의 반지름의 길이가 ${R} cm, 높이가 ${H} cm인 원뿔 모양의 빈 그릇에 일정한 빠르기로 물을 넣었더니, ${t}분 후에 수면의 반지름의 길이가 ${r} cm, 물의 깊이가 ${h} cm가 되었다. 이 그릇에 물을 가득 채우려면 앞으로 몇 분 동안 물을 더 넣어야 하는가? (단, 그릇의 두께는 생각하지 않는다.)`, all - t, {
        unit: '분', figure: cupWaterFig(R, H, r, h, { R: cm(R), H: cm(H), r: cm(r), h: cm(h), label: `꼭짓점이 아래에 있는 원뿔 모양의 그릇과 물의 겨냥도. 그릇의 밑면의 반지름 ${cm(R)}, 높이 ${cm(H)}. 수면의 반지름 ${cm(r)}, 물의 깊이 ${cm(h)}` }),
        explain: `${t}분 동안 넣은 물은 밑면의 반지름의 길이가 ${r} cm, 높이가 ${h} cm인 원뿔 모양이므로 부피는 ${frac(1, 3)} × ${PI} × ${r} × ${r} × ${h} = ${kpi(small)}(cm³)이다. 그릇의 부피는 ${frac(1, 3)} × ${PI} × ${R} × ${R} × ${H} = ${full}${PI}(cm³)이므로 넣은 물의 부피의 ${full} ÷ ${small} = ${full / small}(배)이다. 가득 채우는 데 모두 ${t} × ${full / small} = ${all}(분)이 걸리므로 앞으로 ${all} − ${t} = ${all - t}(분) 동안 더 넣어야 한다.`,
        facts: calc(`(${R}*${R}*${H}/3)/(${r}*${r}*${h}/3)*${t}-${t}`, [3])
      });
    }),
    H('hard-corner-ratio', '직육면체를 평면으로 잘라 만든 삼각뿔의 부피와 직육면체의 부피의 비', '심50 / 기본 ②99', (d, n) => {
      // 걸리는 곳: 길이가 하나도 없어 구할 수 없다고 여기는 아이, 삼각뿔의 밑면이 직육면체의 한 면의 절반이라는 것만 보고 2분의 1이나 3분의 1이라 답하는 아이.
      const a = V('a'), b = V('b'), c = V('c');
      if (n === 0) {
        const first = d.bool();
        return M(`다음 그림과 같이 직육면체를 세 꼭짓점 B, G, D를 지나는 평면으로 잘라 두 입체도형으로 나누었다. ${first ? '꼭짓점 C를 포함하는 삼각뿔의 부피와 나머지 입체도형의 부피' : '꼭짓점 A를 포함하는 입체도형의 부피와 꼭짓점 C를 포함하는 삼각뿔의 부피'}의 비를 가장 간단한 자연수의 비로 나타내시오.`, [{ answer: first ? 1 : 5, unit: ':' }, { answer: first ? 5 : 1 }], {
          figure: boxCutFig('직육면체의 겨냥도. 윗면의 꼭짓점은 A, B, C, D, 아랫면의 꼭짓점은 E, F, G, H이고 A 아래에 E, B 아래에 F, C 아래에 G, D 아래에 H가 있다. 세 꼭짓점 B, G, D를 이은 삼각형이 색칠되어 있다'),
          shown: first ? '1 : 5' : '5 : 1',
          explain: `모서리 BC, CD, CG의 길이를 각각 ${a}, ${b}, ${c}라 하면 직육면체의 부피는 ${a}${b}${c}이다. 삼각뿔은 밑면이 삼각형 BCD이고 높이가 모서리 CG이므로 부피는 ${frac(1, 3)} × (${frac(1, 2)} × ${a} × ${b}) × ${c} = ${frac(1, 6)}${a}${b}${c}이다. 나머지 입체도형의 부피는 ${a}${b}${c} − ${frac(1, 6)}${a}${b}${c} = ${frac(5, 6)}${a}${b}${c}이므로 구하는 비는 ${first ? '1 : 5' : '5 : 1'}이다.`,
          facts: { calc: first ? [['6*(1/2)/3', 0], ['6-6*(1/2)/3', 1]] : [['6-6*(1/2)/3', 0], ['6*(1/2)/3', 1]], unseen: [1, 2, 3, 6] }
        });
      }
      return F('다음 그림과 같은 직육면체에서 점 M은 모서리 CG의 중점이다. 세 점 F, H, M을 지나는 평면으로 이 직육면체를 자를 때 생기는 두 입체도형 중에서 꼭짓점 G를 포함하는 삼각뿔의 부피는 처음 직육면체의 부피의 몇 배인가?', 1, 12, {
        unit: '배', anyForm: true,
        figure: boxMidCutFig('직육면체의 겨냥도. 윗면의 꼭짓점은 A, B, C, D, 아랫면의 꼭짓점은 E, F, G, H이고 A 아래에 E, B 아래에 F, C 아래에 G, D 아래에 H가 있다. 점 M은 모서리 CG의 중점이고, 세 점 F, H, M을 이은 삼각형이 색칠되어 있다'),
        explain: `모서리 FG, GH, CG의 길이를 각각 ${a}, ${b}, ${c}라 하면 직육면체의 부피는 ${a}${b}${c}이다. 삼각뿔은 밑면이 삼각형 FGM이고 높이가 모서리 GH이다. 선분 GM의 길이는 ${frac(1, 2)}${c}이므로 밑넓이는 ${frac(1, 2)} × ${a} × ${frac(1, 2)}${c} = ${frac(1, 4)}${a}${c}이고, 부피는 ${frac(1, 3)} × ${frac(1, 4)}${a}${c} × ${b} = ${frac(1, 12)}${a}${b}${c}이다. 따라서 직육면체의 부피의 ${frac(1, 12)}배이다.`,
        facts: { value: '(1/2)*(1/2)/3', unseen: [1, 2, 3] }
      });
    }, { count: 2 }),
    H('hard-fold-pyramid', '정사각형을 접어 만든 삼각뿔의 부피', '심51', (d) => {
      // 걸리는 곳: 접었을 때 세 꼭짓점 A, B, C가 한 점에서 만난다는 것, 그 점에 모이는 세 모서리가 서로 수직이라는 것을 읽지 못하는 아이.
      const m = d.pick([2, 4, 5, 7, 8]), a = 2 * m, top = m * m * m;
      return F(`다음 그림과 같이 한 변의 길이가 ${a} cm인 정사각형 ABCD에서 변 AB, BC의 중점을 각각 E, F라 하자. 선분 ED, EF, DF를 접는 선으로 하여 접어서 만든 삼각뿔의 부피는?`, top, 3, {
        unit: 'cm³', improper: true, anyForm: true,
        figure: foldSquareFig({ side: cm(a), label: `정사각형 ABCD. 한 변의 길이 ${cm(a)}. 점 E는 변 AB의 중점, 점 F는 변 BC의 중점이고, 선분 ED, EF, DF가 점선으로 그려져 있다` }),
        explain: `접으면 세 점 A, B, C가 한 점에서 만난다. ∠A, ∠B, ∠C가 모두 직각이므로 그 점에 모이는 세 모서리는 서로 수직이다. 삼각형 EBF를 밑면으로 보면 밑넓이는 ${m} × ${m} ÷ 2 = ${showQ(m * m, 2)}(cm²)이고, 높이는 변 AD의 길이인 ${a} cm이다. 부피는 ${frac(1, 3)} × ${showQ(m * m, 2)} × ${a} = ${frac(top, 3)}(cm³)`,
        facts: { value: `(${a}/2)*(${a}/2)/2*${a}/3`, unseen: [2, 3] }
      });
    }),

    // ── 구 ──
    H('hard-quarter-piece', '구를 4등분한 한 조각의 겉넓이로 구의 반지름 구하기', '기본 ②76', (d) => {
      // 함정: 굽은 면만 넣는 아이(구의 겉넓이의 4분의 1로 본다), 평평한 면을 1개만 넣는 아이. 평평한 면은 반원 2개이다.
      const r = d.int(2, 9), S = 2 * r * r, rr = V('r') + '<sup>2</sup>';
      return N(`다음 그림은 구를 중심을 지나고 서로 수직인 두 평면으로 잘라 똑같은 조각 4개로 나눈 것 중의 하나이다. 이 조각의 겉넓이가 ${S}${PI} cm²일 때, 구의 반지름의 길이는?`, r, {
        unit: 'cm', figure: quarterPieceFig(66, '구를 4등분한 한 조각의 겨냥도. 굽은 면 하나와 평평한 면 2개로 둘러싸여 있다. 평평한 면은 모두 반원이고, 하나는 위를 향하며 다른 하나는 앞을 향해 서 있다'),
        explain: `구의 반지름의 길이를 ${V('r')} cm라 하면 굽은 면의 넓이는 구의 겉넓이의 ${frac(1, 4)}인 ${PI}${rr}이고, 평평한 면은 반원 2개이므로 그 넓이의 합은 ${PI}${rr}이다. 겉넓이는 2${PI}${rr} = ${S}${PI}에서 ${rr} = ${r * r}이므로 ${V('r')} = ${r}이다.`,
        facts: calc(`${S}/2/${r}`, [2, r])
      });
    }),
    H('hard-cone-in-sphere', '구 안에 들어 있는 원뿔의 부피로 구의 부피 구하기', '기본 ①78', (d) => {
      // 걸리는 곳: 길이가 없어 구할 수 없다고 여기는 아이. 원뿔의 밑면의 반지름과 높이가 모두 구의 반지름과 같다는 것을 읽어야 한다.
      const v = d.pick([9, 72, 243, 12, 15, 18, 20, 24, 25, 30, 36, 45, 50, 60]), r3 = V('r') + '<sup>3</sup>';
      return N(`다음 그림과 같이 구 안에 원뿔이 들어 있다. 원뿔의 밑면은 구의 중심을 지나는 평면으로 구를 자를 때 생기는 단면이고, 원뿔의 꼭짓점은 구의 겉면 위에 있다. 원뿔의 부피가 ${v}${PI} cm³일 때, 구의 부피는?`, 4 * v, {
        unit: U3, figure: coneInSphereFig(58, '구와 그 안에 들어 있는 원뿔의 겨냥도. 원뿔의 밑면은 구의 중심을 지나는 원이고, 원뿔의 꼭짓점은 구의 겉면 위에 있다. 원뿔의 높이를 나타내는 선분은 밑면에 수직이다'),
        explain: `구의 반지름의 길이를 ${V('r')} cm라 하면 원뿔의 밑면의 반지름의 길이와 높이는 모두 ${V('r')} cm이다. 원뿔의 부피는 ${frac(1, 3)} × ${PI}${V('r')}<sup>2</sup> × ${V('r')} = ${frac(1, 3)}${PI}${r3}, 구의 부피는 ${frac(4, 3)}${PI}${r3}이므로 구의 부피는 원뿔의 부피의 4배이다. ${v}${PI} × 4 = ${4 * v}${PI}(cm³)`,
        facts: calc(`${v}*4`, [4])
      });
    }),
    H('hard-balls-cyl', '원기둥에 꼭 맞게 들어 있는 구 여러 개', '심63·64 / 기본 ①79 ②97', (d, n) => {
      // 함정: 원기둥의 높이가 그림에 없어 구할 수 없다고 여기는 아이. 원기둥의 높이는 구의 지름의 (구의 개수)배이다.
      if (n === 2) {
        const [k, r] = d.pick([[3, 2], [3, 3], [3, 4], [3, 5], [2, 2], [2, 3], [2, 4], [2, 5]]), W = 2 * k * r * r * r, r3 = V('r') + '<sup>3</sup>';
        return N(`다음 그림과 같이 부피가 ${W}${PI} cm³인 원기둥에 크기가 같은 구 ${k}개가 꼭 맞게 들어 있다. 이 구 한 개의 겉넓이는?`, 4 * r * r, {
          unit: U2, figure: ballsFig(k, { label: `원기둥에 꼭 맞게 들어 있는 구 ${k}개의 겨냥도. 구는 위아래로 쌓여 있고 원기둥의 두 밑면과 옆면에 닿아 있다` }),
          explain: `구의 반지름의 길이를 ${V('r')} cm라 하면 원기둥의 밑면의 반지름의 길이는 ${V('r')} cm, 높이는 2${V('r')} × ${k} = ${2 * k}${V('r')}(cm)이므로 부피는 ${PI}${V('r')}<sup>2</sup> × ${2 * k}${V('r')} = ${2 * k}${PI}${r3}이다. ${2 * k}${r3} = ${W}에서 ${r3} = ${r * r * r}이므로 ${V('r')} = ${r}이다. 구 한 개의 겉넓이는 4 × ${PI} × ${r} × ${r} = ${4 * r * r}${PI}(cm²)`,
          facts: calc(`2*${W}/(${k}*${r})`, [2, r])
        });
      }
      const [k, r] = d.pick([[2, 3], [3, 2], [3, 3], [3, 4], [2, 6], [3, 5]]), dia = 2 * r, cyl = r * r * dia * k, balls = k * 4 * r * r * r / 3, water = cyl - balls;
      const figure = ballsFig(k, { d: cm(dia), label: `원기둥에 꼭 맞게 들어 있는 구 ${k}개의 겨냥도. 원기둥의 밑면의 지름 ${cm(dia)}. 구는 위아래로 쌓여 있고 원기둥의 두 밑면과 옆면에 닿아 있다` });
      const lead = `구의 반지름의 길이는 ${dia} ÷ 2 = ${r}(cm)이고, 원기둥의 높이는 구의 지름의 ${k}배인 ${dia} × ${k} = ${dia * k}(cm)이다. 원기둥의 부피는 ${PI} × ${r} × ${r} × ${dia * k} = ${cyl}${PI}(cm³), 구 ${k}개의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${k} = ${balls}${PI}(cm³)이므로 물의 부피는 ${cyl}${PI} − ${balls}${PI} = ${water}${PI}(cm³)이다.`;
      const expr = `(${dia}/2)*(${dia}/2)*${dia}*${k}-${k}*4*(${dia}/2)*(${dia}/2)*(${dia}/2)/3`;
      if (n === 0) return N(`다음 그림과 같이 밑면의 지름의 길이가 ${dia} cm인 원기둥에 구 ${k}개가 꼭 맞게 들어 있다. 이 원기둥의 빈 곳에 물을 가득 채울 때, 채워지는 물의 부피는?`, water, { unit: U3, figure, explain: lead, facts: calc(expr, [2, 4, 3]) });
      return N(`다음 그림과 같이 밑면의 지름의 길이가 ${dia} cm인 원기둥 모양의 그릇에 구 ${k}개가 꼭 맞게 들어 있다. 이 그릇에 물을 가득 채운 다음 구 ${k}개를 모두 꺼냈을 때, 그릇에 남아 있는 물의 높이는? (단, 그릇의 두께는 생각하지 않는다.)`, water / (r * r), {
        unit: 'cm', figure, explain: lead + ` 그릇의 밑넓이는 ${r * r}${PI} cm²이므로 남아 있는 물의 높이는 ${water}${PI} ÷ ${r * r}${PI} = ${water / (r * r)}(cm)`, facts: calc(`(${expr})/((${dia}/2)*(${dia}/2))`, [2, 4, 3])
      });
    }, { count: 3 }),
    H('hard-sunk-balls', '물통에 잠긴 쇠구슬을 꺼낼 때 낮아지는 물의 높이', '심67', (d) => {
      // 걸리는 곳: 물통의 높이를 몰라 구할 수 없다고 여기는 아이. 낮아진 만큼의 물의 부피가 쇠구슬의 부피와 같다.
      const [r, k, R] = d.pick([[3, 5, 6], [3, 2, 6], [3, 3, 6], [2, 3, 4], [3, 4, 4], [6, 2, 12], [2, 6, 4], [4, 3, 8], [3, 6, 6], [3, 4, 6], [3, 8, 6]]), balls = k * 4 * r * r * r / 3, x = balls / (R * R);
      return N(`밑면의 반지름의 길이가 ${R} cm인 원기둥 모양의 물통에 지름의 길이가 ${2 * r} cm인 구 모양의 쇠구슬 ${k}개를 넣고 물을 가득 채웠다. 쇠구슬을 모두 꺼내면 물의 높이는 몇 cm 낮아지는가? (단, 쇠구슬은 물에 완전히 잠겨 있었고, 물통의 두께는 생각하지 않는다.)`, x, {
        unit: 'cm', explain: `쇠구슬의 반지름의 길이는 ${r} cm이므로 쇠구슬 ${k}개의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${k} = ${balls}${PI}(cm³)이다. 낮아진 만큼의 물의 부피가 쇠구슬의 부피와 같고 물통의 밑넓이는 ${PI} × ${R} × ${R} = ${R * R}${PI}(cm²)이므로, 낮아지는 높이는 ${balls}${PI} ÷ ${R * R}${PI} = ${x}(cm)`,
        facts: calc(`${k}*4*(${2 * r}/2)*(${2 * r}/2)*(${2 * r}/2)/3/(${R}*${R})`, [4, 2, 3])
      });
    }),
    H('hard-octa-in-sphere', '구 안에 꼭 맞게 들어 있는 정팔면체의 부피', '심66 / 기본 ①81 ②82', (d, n) => {
      // 걸리는 곳: 정팔면체의 한 모서리의 길이를 구하려다 멈추는 아이. 정팔면체를 사각뿔 2개로 나누고, 밑면인 정사각형의 넓이는 두 대각선(구의 지름)으로 구한다.
      const r = d.pick([3, 6, 9, 12]), v = 4 * r * r * r / 3;
      const figure = octaInSphereFig(60, { r: cm(r), label: `구와 그 안에 꼭 맞게 들어 있는 정팔면체의 겨냥도. 구의 반지름 ${cm(r)}. 정팔면체의 꼭짓점 6개가 모두 구의 겉면 위에 있다` });
      const lead = `정팔면체는 밑면이 정사각형인 사각뿔 2개를 밑면끼리 붙인 모양이다. 밑면인 정사각형의 두 대각선은 길이가 모두 구의 지름인 ${2 * r} cm이고 서로 수직이므로 밑넓이는 ${2 * r} × ${2 * r} ÷ 2 = ${2 * r * r}(cm²)이다. 사각뿔 하나의 높이는 구의 반지름인 ${r} cm이므로 정팔면체의 부피는 (${frac(1, 3)} × ${2 * r * r} × ${r}) × 2 = ${v}(cm³)이다.`;
      const octa = `(2*${r})*(2*${r})/2*${r}/3*2`;
      if (n === 0) return N(`다음 그림과 같이 반지름의 길이가 ${r} cm인 구 안에 정팔면체가 꼭 맞게 들어 있다. 이 정팔면체의 부피는?`, v, { unit: 'cm³', figure, explain: lead, facts: calc(octa, [2, 3]) });
      return M(`다음 그림과 같이 반지름의 길이가 ${r} cm인 구 안에 정팔면체가 꼭 맞게 들어 있다. 구에서 정팔면체를 뺀 나머지 부분의 부피를 구하시오.`, [{ answer: v, unit: 'π −' }, { answer: v, unit: 'cm³' }], {
        figure, shown: `(${v}${PI} − ${v}) cm³`,
        explain: lead + ` 구의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${v}${PI}(cm³)이므로 나머지 부분의 부피는 (${v}${PI} − ${v}) cm³이다.`,
        facts: { calc: [[`4*${r}*${r}*${r}/3`, 0], [octa, 1]], unseen: [2, 3, 4] }
      });
    }, { count: 2 }),
    H('hard-cube-sphere-pyramid', '정육면체와 그 안에 꼭 맞는 구, 사각뿔의 부피의 비', '심65', (d) => {
      // 걸리는 곳: 구의 반지름을 정육면체의 한 모서리의 길이 그대로 쓰는 아이(반지름은 그 절반이다), 사각뿔의 부피에서 3분의 1을 빠뜨리는 아이.
      const a = d.pick([2, 4, 6, 8, 10]), r = a / 2, cube = a * a * a;
      return M(`한 모서리의 길이가 ${a} cm인 정육면체가 있다. 이 정육면체에 꼭 맞게 들어가는 구와, 이 정육면체의 한 면을 밑면으로 하고 높이가 ${a} cm인 사각뿔이 있다. 정육면체, 구, 사각뿔의 부피의 비를 구하시오.`, [{ answer: 6, unit: ': π :' }, { answer: 2 }], {
        shown: `6 : ${PI} : 2`,
        explain: `정육면체의 부피는 ${a} × ${a} × ${a} = ${cube}(cm³)이다. 구의 반지름의 길이는 ${a} ÷ 2 = ${r}(cm)이므로 구의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${showQ(cube, 6)}${PI}(cm³)이다. 사각뿔의 부피는 ${frac(1, 3)} × (${a} × ${a}) × ${a} = ${showQ(cube, 3)}(cm³)이다. ${cube} : ${showQ(cube, 6)}${PI} : ${showQ(cube, 3)} = 6 : ${PI} : 2`,
        facts: { calc: [[`${a}*${a}*${a}/(4*(${a}/2)*(${a}/2)*(${a}/2)/3)`, 0], [`(${a}*${a}*${a}/3)/(4*(${a}/2)*(${a}/2)*(${a}/2)/3)`, 1]], unseen: [2, 3, 4] }
      });
    }),

    // ── 회전체의 겉넓이와 부피 ──
    H('hard-spin-joined', '여러 도형을 이어 붙인 평면도형을 돌린 회전체의 부피와 겉넓이', '심70 / 기본 ①88 ②88', (d, n) => {
      // 걸리는 곳: 회전체를 입체 하나로만 보는 아이. 도형마다 따로 돌려 반구, 원기둥, 원뿔로 나눈다. 겉넓이에서는 맞붙은 원을 넣지 않는다.
      if (n === 0) {
        const r = d.pick([3, 6]), h = d.until(() => d.int(2, 9), (x) => x !== r), vol = 2 * r * r * r / 3 + r * r * h / 3;
        return N(`다음 그림과 같이 사분원과 직각삼각형을 이어 붙인 평면도형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 부피는?`, vol, {
          unit: U3, figure: shapeSpin('quarterTri', { r: 62, h: Math.min(96, Math.max(38, h * 62 / r)) }, { r: cm(r), h: cm(h), label: `사분원과 직각삼각형을 이어 붙인 평면도형과 회전축 l. 위쪽은 반지름 ${cm(r)}인 사분원이고 한 반지름이 회전축 위에 놓여 있다. 아래쪽은 직각을 낀 두 변이 ${cm(r)}, ${cm(h)}인 직각삼각형이고 길이가 ${cm(h)}인 변이 회전축 위에 놓여 있다` }),
          explain: `회전체는 반지름의 길이가 ${r} cm인 반구와 밑면의 반지름의 길이가 ${r} cm, 높이가 ${h} cm인 원뿔을 붙인 모양이다. 반구의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${frac(1, 2)} = ${2 * r * r * r / 3}${PI}(cm³), 원뿔의 부피는 ${frac(1, 3)} × ${PI} × ${r} × ${r} × ${h} = ${r * r * h / 3}${PI}(cm³)이다. ${2 * r * r * r / 3}${PI} + ${r * r * h / 3}${PI} = ${vol}${PI}(cm³)`,
          facts: calc(`4*${r}*${r}*${r}/3/2+${r}*${r}*${h}/3`, [4, 3, 2])
        });
      }
      if (n === 1) {
        const r = d.pick([3, 6]), hc = d.until(() => d.int(2, 8), (x) => x !== r), hr = d.until(() => d.int(2, 8), (x) => x !== r && x !== hc), vol = r * r * hc / 3 + r * r * hr + 2 * r * r * r / 3, px = 56 / r;
        return N(`다음 그림과 같이 직각삼각형, 직사각형, 사분원을 이어 붙인 평면도형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 부피는?`, vol, {
          unit: U3, figure: shapeSpin('coneCylDome', { r: 56, hc: Math.min(80, Math.max(34, hc * px)), hr: Math.min(70, Math.max(32, hr * px)) }, { r: cm(r), hc: cm(hc), hr: cm(hr), label: `직각삼각형, 직사각형, 사분원을 위에서부터 차례로 이어 붙인 평면도형과 회전축 l. 직각삼각형은 직각을 낀 두 변이 ${cm(r)}, ${cm(hc)}이고 길이가 ${cm(hc)}인 변이 회전축 위에 놓여 있다. 직사각형은 가로 ${cm(r)}, 세로 ${cm(hr)}이고 세로인 변이 회전축 위에 놓여 있다. 사분원은 반지름 ${cm(r)}이고 한 반지름이 회전축 위에 놓여 있다` }),
          explain: `회전체는 위에서부터 원뿔, 원기둥, 반구를 붙인 모양이고 밑면의 반지름의 길이는 모두 ${r} cm이다. 원뿔의 부피는 ${frac(1, 3)} × ${PI} × ${r} × ${r} × ${hc} = ${r * r * hc / 3}${PI}(cm³), 원기둥의 부피는 ${PI} × ${r} × ${r} × ${hr} = ${r * r * hr}${PI}(cm³), 반구의 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${frac(1, 2)} = ${2 * r * r * r / 3}${PI}(cm³)이다. ${r * r * hc / 3}${PI} + ${r * r * hr}${PI} + ${2 * r * r * r / 3}${PI} = ${vol}${PI}(cm³)`,
          facts: calc(`${r}*${r}*${hc}/3+${r}*${r}*${hr}+4*${r}*${r}*${r}/3/2`, [4, 3, 2])
        });
      }
      const [r, hc, s] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13]]), hr = d.until(() => d.int(2, 8), (x) => x !== r && x !== s), S = 2 * r * r + 2 * r * hr + r * s, px = 56 / r;
      return N(`다음 그림과 같이 직각삼각형, 직사각형, 사분원을 이어 붙인 평면도형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이는?`, S, {
        unit: U2, figure: shapeSpin('coneCylDome', { r: 56, hc: Math.min(84, Math.max(34, hc * px)), hr: Math.min(70, Math.max(32, hr * px)) }, { r: cm(r), s: cm(s), hr: cm(hr), label: `직각삼각형, 직사각형, 사분원을 위에서부터 차례로 이어 붙인 평면도형과 회전축 l. 직각삼각형은 빗변이 ${cm(s)}이고 직각을 낀 한 변이 회전축 위에 놓여 있으며, 회전축에 수직인 변은 ${cm(r)}이다. 직사각형은 가로 ${cm(r)}, 세로 ${cm(hr)}이고 세로인 변이 회전축 위에 놓여 있다. 사분원은 반지름 ${cm(r)}이고 한 반지름이 회전축 위에 놓여 있다` }),
        explain: `회전체는 위에서부터 원뿔, 원기둥, 반구를 붙인 모양이고 밑면의 반지름의 길이는 모두 ${r} cm이다. 맞붙은 원은 겉이 아니므로 원뿔의 옆넓이, 원기둥의 옆넓이, 반구의 굽은 면의 넓이만 더한다. ${PI} × ${r} × ${s} + 2 × ${PI} × ${r} × ${hr} + 2 × ${PI} × ${r} × ${r} = ${r * s}${PI} + ${2 * r * hr}${PI} + ${2 * r * r}${PI} = ${S}${PI}(cm²)`,
        facts: calc(`${r}*${s}+2*${r}*${hr}+2*${r}*${r}`, [2])
      });
    }, { count: 3 }),
    H('hard-spin-hollowed', '한 도형에서 다른 도형을 잘라 낸 평면도형을 돌린 회전체의 부피', '심71 / 기본 ①89 ②89', (d, n) => {
      // 걸리는 곳: 색칠한 도형이 무엇에서 무엇을 뺀 것인지 읽지 못하는 아이. 큰 도형을 돌린 입체에서 잘라 낸 도형을 돌린 입체를 뺀다.
      if (n === 0) {
        const [r, w] = d.pick([[1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [1, 6], [2, 6], [3, 6]]), R = r + w, vol = 4 * (R * R * R - r * r * r) / 3;
        return N(`다음 그림과 같이 반원에서 중심이 같은 작은 반원을 잘라 낸 평면도형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 부피는?`, vol, {
          unit: U3, figure: shapeSpin('semiRing', { r: spx(r, 11, 34, 46), w: spx(w, 9, 34, 46) }, { r: cm(r), w: cm(w), label: `반원에서 중심이 같은 작은 반원을 잘라 낸 평면도형과 회전축 l. 두 반원의 지름은 회전축 위에 놓여 있다. 작은 반원의 반지름은 ${cm(r)}, 남은 띠 모양의 너비는 ${cm(w)}이다` }),
          explain: `큰 반원의 반지름의 길이는 ${r} + ${w} = ${R}(cm)이다. 회전체는 반지름의 길이가 ${R} cm인 구에서 반지름의 길이가 ${r} cm인 구 모양을 파낸 모양이다. ${frac(4, 3)} × ${PI} × ${R} × ${R} × ${R} − ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${frac(4, 3)} × ${PI} × (${R * R * R} − ${r * r * r}) = ${vol}${PI}(cm³)`,
          facts: calc(`4*((${r}+${w})*(${r}+${w})*(${r}+${w})-${r}*${r}*${r})/3`, [4, 3])
        });
      }
      const r = d.pick([3, 6, 9]), vol = r * r * r / 3;
      return N(`다음 그림에서 색칠한 부분은 사분원에서 직각삼각형을 잘라 낸 활꼴이다. 이 활꼴을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 부피는?`, vol, {
        unit: U3, figure: shapeSpin('segment', { r: 80 }, { r: cm(r), label: `사분원과 회전축 l. 사분원의 반지름은 ${cm(r)}이고 한 반지름이 회전축 위에 놓여 있다. 호의 두 끝 점을 이은 현과 호 사이의 활꼴이 색칠되어 있다` }),
        explain: `회전체는 반지름의 길이가 ${r} cm인 반구에서 밑면의 반지름의 길이가 ${r} cm, 높이가 ${r} cm인 원뿔 모양을 파낸 모양이다. ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${frac(1, 2)} − ${frac(1, 3)} × ${PI} × ${r} × ${r} × ${r} = ${2 * r * r * r / 3}${PI} − ${vol}${PI} = ${vol}${PI}(cm³)`,
        facts: calc(`4*${r}*${r}*${r}/3/2-${r}*${r}*${r}/3`, [4, 3, 2])
      });
    }, { count: 2 }),
    H('hard-spin-shell-surface', '사분원을 잇거나 잘라 낸 평면도형을 돌린 회전체의 겉넓이', '심69 / 기본 ②90', (d, n) => {
      // 함정: 굽은 면 2개만 더하고 평평한 고리 모양의 면을 넣지 않는 아이, 고리 모양의 면을 큰 원 그대로 넣는 아이.
      if (n === 0) {
        const r = d.int(1, 4), w = d.int(1, 4), R = r + w, S = 3 * R * R + r * r;
        return N(`다음 그림과 같이 사분원에서 중심이 같은 작은 사분원을 잘라 낸 평면도형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이는?`, S, {
          unit: U2, figure: shapeSpin('quarterRing', { r: spx(r, 14, 36, 56), w: spx(w, 14, 36, 56) }, { r: cm(r), w: cm(w), label: `사분원에서 중심이 같은 작은 사분원을 잘라 낸 평면도형과 회전축 l. 두 사분원의 한 반지름은 회전축 위에 놓여 있다. 작은 사분원의 반지름은 ${cm(r)}, 남은 띠 모양의 너비는 ${cm(w)}이다` }),
          explain: `큰 사분원의 반지름의 길이는 ${r} + ${w} = ${R}(cm)이다. 회전체는 반지름의 길이가 ${R} cm인 반구에서 반지름의 길이가 ${r} cm인 반구 모양을 파낸 모양이다. 바깥쪽 굽은 면의 넓이는 2 × ${PI} × ${R} × ${R} = ${2 * R * R}${PI}(cm²), 안쪽 굽은 면의 넓이는 2 × ${PI} × ${r} × ${r} = ${2 * r * r}${PI}(cm²), 평평한 고리 모양의 면의 넓이는 ${PI} × ${R} × ${R} − ${PI} × ${r} × ${r} = ${R * R - r * r}${PI}(cm²)이다. 겉넓이는 ${2 * R * R}${PI} + ${2 * r * r}${PI} + ${R * R - r * r}${PI} = ${S}${PI}(cm²)`,
          facts: calc(`2*(${r}+${w})*(${r}+${w})+2*${r}*${r}+(${r}+${w})*(${r}+${w})-${r}*${r}`, [2])
        });
      }
      const [a, b] = d.until(() => [d.int(2, 6), d.int(3, 9)], (x) => x[0] < x[1]), S = a * a + 3 * b * b, pa = spx(a, 9, 38, 60);
      return N(`다음 그림과 같이 중심이 같고 반지름의 길이가 서로 다른 두 사분원을 이어 붙인 평면도형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이는?`, S, {
        unit: U2, figure: shapeSpin('quarterPair', { a: pa, b: Math.max(pa + 24, Math.min(98, b * 9)) }, { a: cm(a), b: cm(b), label: `중심이 같은 두 사분원을 위아래로 이어 붙인 평면도형과 회전축 l. 위쪽 사분원의 반지름은 ${cm(a)}, 아래쪽 사분원의 반지름은 ${cm(b)}이고, 두 사분원의 한 반지름은 회전축 위에 놓여 있다` }),
        explain: `회전체는 반지름의 길이가 ${a} cm인 반구와 반지름의 길이가 ${b} cm인 반구를 평평한 면끼리 붙인 모양이다. 두 굽은 면의 넓이는 2 × ${PI} × ${a} × ${a} = ${2 * a * a}${PI}(cm²), 2 × ${PI} × ${b} × ${b} = ${2 * b * b}${PI}(cm²)이다. 큰 반구의 평평한 면 가운데 작은 반구에 가려지지 않은 고리 모양의 면의 넓이는 ${PI} × ${b} × ${b} − ${PI} × ${a} × ${a} = ${b * b - a * a}${PI}(cm²)이다. 겉넓이는 ${2 * a * a}${PI} + ${2 * b * b}${PI} + ${b * b - a * a}${PI} = ${S}${PI}(cm²)`,
        facts: calc(`2*${a}*${a}+2*${b}*${b}+${b}*${b}-${a}*${a}`, [2])
      });
    }, { count: 2 }),
    H('hard-spin-tri-off', '회전축에서 떨어진 직각삼각형을 돌린 회전체의 부피', '심61', (d) => {
      // 걸리는 곳: 회전체를 원뿔이라 여기는 아이. 회전축에서 떨어져 있으므로 가운데가 원기둥 모양으로 비고, 겉은 원뿔대이다.
      const [g, a, b, e] = d.pick([[3, 3, 3, 3], [3, 6, 4, 2], [3, 3, 4, 4], [2, 4, 6, 3], [6, 3, 2, 4], [2, 2, 3, 3], [1, 2, 6, 3], [4, 2, 3, 6]]), R = g + a, big = R * R * (b + e) / 3, small = g * g * e / 3, hole = g * g * b, vol = big - small - hole;
      return N(`다음 그림과 같이 회전축에서 떨어져 있는 직각삼각형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 부피는?`, vol, {
        unit: U3, figure: shapeSpin('triOff', { g: spx(g, 14, 34, 56), a: spx(a, 14, 36, 70), b: spx(b, 13, 42, 84) }, { g: cm(g), a: cm(a), b: cm(b), e: cm(e), label: `직각삼각형과 회전축 l. 직각을 낀 두 변 가운데 길이 ${cm(b)}인 변은 회전축과 나란하고 회전축에서 ${cm(g)} 떨어져 있다. 길이 ${cm(a)}인 변은 회전축에 수직이고 삼각형의 아래쪽에 있다. 빗변을 길게 늘인 선(점선)은 삼각형의 위쪽 꼭짓점에서 위로 ${cm(e)} 떨어진 곳에서 회전축과 만난다` }),
        explain: `회전체는 원뿔대에서 원기둥 모양을 파낸 모양이다. 원뿔대는 밑면의 반지름의 길이가 ${g} + ${a} = ${R}(cm), 높이가 ${b} + ${e} = ${b + e}(cm)인 원뿔에서 밑면의 반지름의 길이가 ${g} cm, 높이가 ${e} cm인 원뿔을 잘라 낸 것이므로 부피는 ${frac(1, 3)} × ${PI} × ${R} × ${R} × ${b + e} − ${frac(1, 3)} × ${PI} × ${g} × ${g} × ${e} = ${big}${PI} − ${kpi(small)} = ${big - small}${PI}(cm³)이다. 파낸 원기둥의 부피는 ${PI} × ${g} × ${g} × ${b} = ${hole}${PI}(cm³)이므로 구하는 부피는 ${big - small}${PI} − ${hole}${PI} = ${vol}${PI}(cm³)`,
        facts: calc(`(${g}+${a})*(${g}+${a})*(${b}+${e})/3-${g}*${g}*${e}/3-${g}*${g}*${b}`, [3])
      });
    })
  ]);

  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('7-2-4', 'turn', [
    TB('turn-count-names', '평면도형과 회전체가 섞인 목록에서 다면체·회전체 세기', '심1·2 / 기본 ②2·25', (d, n) => {
      // 함정: 평평한 면이 있으면 다면체라고 여기는 아이(원기둥, 원뿔대, 반구), 다각형·원을 입체도형으로 세는 아이(정육각형을 다면체로, 원을 회전체로).
      const a = d.int(2, 3), b = d.int(2, 3), names = d.shuffle(d.shuffle(POLY_NAMES).slice(0, a).concat(d.shuffle(ROUND_NAMES).slice(0, b), d.shuffle(n ? ['원', '부채꼴'].concat(d.shuffle(PLANE_NAMES.filter((w) => w !== '원' && w !== '부채꼴')).slice(0, 1)) : PLANE_NAMES).slice(0, 2)));
      const flags = names.map((w) => (n ? ROUND_NAMES : POLY_NAMES).includes(w)), hit = names.filter((_, i) => flags[i]), flat = names.filter((w) => PLANE_NAMES.includes(w)), other = names.filter((w) => (n ? POLY_NAMES : ROUND_NAMES).includes(w));
      return N(`다음 중 ${n ? '회전체' : '다면체'}는 모두 몇 개인가?`, hit.length, {
        unit: '개', figure: words(names),
        explain: `${josa(listed(flat), '은/는')} 평면도형이므로 입체도형이 아니다. ` + (n ? `${josa(listed(other), '은/는')} 다각형인 면으로만 둘러싸인 다면체이다. ` : `${josa(listed(other), '은/는')} 굽은 면이 있으므로 다면체가 아니다. `) + `${n ? '회전체' : '다면체'}는 ${listed(hit)}의 ${hit.length}개이다.`,
        facts: { count: flags }
      });
    }, { count: 2, standard: SOLID })
  ]);
  B.addTypes('7-2-4', 'turn', [
    TB('turn-plane-cut-area', '평면도형을 돌린 회전체를 회전축을 포함하는 평면으로 자른 단면의 넓이', '심29·30·32 / 기본 ②36', (d, n) => {
      // 함정: 단면이 돌리기 전의 평면도형과 같다고 여기는 아이(답의 절반을 적는다). 단면은 회전축을 대칭축으로 하는 선대칭도형이므로 돌리기 전 도형 2개를 맞붙인 모양이다.
      const ask = '회전축을 포함하는 평면으로 자를 때 생기는 단면의 넓이는?', lead = '단면은 회전축을 대칭축으로 하는 선대칭도형이므로, 처음 도형과 그것을 회전축에 대하여 뒤집은 도형을 맞붙인 모양이다. ';
      if (n === 0) {
        const w = d.int(2, 6), h = d.until(() => d.int(3, 9), (v) => v !== w && v !== 2 * w);
        return N(`다음 직사각형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체를 ${ask}`, 2 * w * h, { unit: 'cm²', figure: spin('rect', { w: spx(w, 13, 44, 90), h: spx(h, 13, 60, 110) }, { w: cm(w), h: cm(h), label: `직사각형과 회전축 l. 가로 ${cm(w)}, 세로 ${cm(h)}이고 세로인 변이 회전축 위에 놓여 있다` }), explain: lead + `단면은 가로 ${2 * w} cm, 세로 ${h} cm인 직사각형이다. ${2 * w} × ${h} = ${2 * w * h}(cm²)`, facts: Object.assign(calc(`2*${w}*${h}`, [2]), { rule: 'cut-rect' }) });
      }
      if (n === 1) {
        const [a, b, c] = d.pick(RIGHT.slice(0, 4));
        return N(`다음 직각삼각형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체를 ${ask}`, a * b, { unit: 'cm²', figure: spin('tri', { a: spx(a, 11, 48, 84), b: spx(b, 11, 64, 110) }, { a: cm(a), b: cm(b), c: cm(c), label: `직각삼각형과 회전축 l. 직각을 낀 두 변은 ${cm(a)}, ${cm(b)}, 빗변은 ${cm(c)}이고, 길이가 ${cm(b)}인 변이 회전축 위에 놓여 있다` }), explain: lead + `단면은 밑변 ${2 * a} cm, 높이 ${b} cm인 이등변삼각형이다. ${2 * a} × ${b} ÷ 2 = ${a * b}(cm²)`, facts: Object.assign(calc(`2*${a}*${b}/2`, [2]), { rule: 'cut-tri' }) });
      }
      if (n === 2) {
        const a = d.int(2, 4), b = a + d.int(2, 4), h = d.until(() => d.int(3, 8), (v) => v !== a && v !== b);
        return N(`다음 사다리꼴을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체를 ${ask}`, (a + b) * h, { unit: 'cm²', figure: spin('trap', { a: spx(a, 13, 36, 60), b: spx(b, 13, 64, 100), h: spx(h, 13, 44, 100) }, { a: cm(a), b: cm(b), h: cm(h), label: `사다리꼴과 회전축 l. 윗변 ${cm(a)}, 아랫변 ${cm(b)}이고, 두 밑변에 수직인 길이 ${cm(h)}인 변이 회전축 위에 놓여 있다` }), explain: lead + `단면은 윗변 ${2 * a} cm, 아랫변 ${2 * b} cm, 높이 ${h} cm인 사다리꼴이다. (${2 * a} + ${2 * b}) × ${h} ÷ 2 = ${(a + b) * h}(cm²)`, facts: Object.assign(calc(`(2*${a}+2*${b})*${h}/2`, [2]), { rule: 'cut-trap' }) });
      }
      const [p, q, c] = d.pick(RIGHT.slice(0, 3)), k = 110 / c;
      return N(`다음 직각삼각형을 직선 ${LV()}을 회전축으로 하여 1회전 시킬 때 생기는 회전체를 ${ask}`, p * q, { unit: 'cm²', figure: spin('triHyp', { p: p * k, q: q * k }, { p: cm(p), q: cm(q), c: cm(c), label: `직각삼각형과 회전축 l. 직각을 낀 두 변은 ${cm(p)}, ${cm(q)}이고, 길이가 ${cm(c)}인 빗변이 회전축 위에 놓여 있다` }), explain: lead + `단면의 넓이는 처음 직각삼각형의 넓이의 2배이다. (${p} × ${q} ÷ 2) × 2 = ${p * q}(cm²)`, facts: Object.assign(calc(`${p}*${q}/2*2`, [2]), { rule: 'cut-hyp' }) });
    }, { count: 4, standard: SOLID })
  ]);
  B.addTypes('7-2-4', 'poly', [
    TB('poly-find-counts', '각뿔대의 개수 하나로 다른 개수 구하기', '심7·8 / 기본 ①9 ②10', (d, n) => {
      if (n === 0) {
        const m = d.int(5, 9), s = solid('frus', m), byEdge = d.bool();
        return M(`${byEdge ? '모서리' : '꼭짓점'}의 개수가 ${byEdge ? 3 * m : 2 * m}개인 각뿔대의 면의 개수와 ${byEdge ? '꼭짓점' : '모서리'}의 개수를 각각 구하시오.`, [{ label: '면', answer: m + 2, unit: '개' }, { label: byEdge ? '꼭짓점' : '모서리', answer: byEdge ? 2 * m : 3 * m, unit: '개' }], {
          explain: `${V('n')}각뿔대의 ${byEdge ? `모서리는 3${V('n')}개이므로 3${V('n')} = ${3 * m}` : `꼭짓점은 2${V('n')}개이므로 2${V('n')} = ${2 * m}`}에서 ${V('n')} = ${m}, 곧 ${s.name}이다. 면은 ${cntSay(s, 'f')}(개), ${byEdge ? `꼭짓점은 ${cntSay(s, 'v')}` : `모서리는 ${cntSay(s, 'e')}`}(개)이다.`,
          facts: { calc: byEdge ? [[`${3 * m}/3+2`, 0], [`${3 * m}/3*2`, 1]] : [[`${2 * m}/2+2`, 0], [`${2 * m}/2*3`, 1]], unseen: [2, 3] }
        });
      }
      const gap = d.int(2, 7), m = gap + 2;
      return N(`꼭짓점의 개수가 면의 개수보다 ${gap}개 더 많은 각뿔대의 모서리의 개수는?`, 3 * m, {
        unit: '개', explain: `${V('n')}각뿔대의 꼭짓점은 2${V('n')}개, 면은 (${V('n')} + 2)개이므로 2${V('n')} − (${V('n')} + 2) = ${gap}에서 ${V('n')} = ${m}이다. 모서리의 개수는 3 × ${m} = ${3 * m}이다.`, facts: calc(`3*(${gap}+2)`, [3, 2])
      });
    }, { count: 2, standard: SOLID })
  ]);
  B.addTypes('7-2-4', 'poly', [
    TB('poly-cut-pyramid', '각뿔을 잘라 만든 각뿔대와 처음 각뿔의 꼭짓점의 개수', '심3 / 기본 ①8', (d) => {
      const s = solid('pyr', d.int(4, 9)), f = solid('frus', s.n);
      return N(`${josa(s.name, '을/를')} 밑면에 평행한 평면으로 잘라 각뿔대를 만들었다. 이 각뿔대의 꼭짓점의 개수는 처음 ${s.name}의 꼭짓점의 개수보다 몇 개 더 많은가?`, s.n - 1, {
        unit: '개', explain: `${s.name}의 꼭짓점은 ${cntSay(s, 'v')}(개)이다. 잘라 만든 입체도형은 ${f.name}이고 꼭짓점은 ${cntSay(f, 'v')}(개)이다. ${2 * s.n} − ${s.n + 1} = ${s.n - 1}(개)`, facts: calc(`2*${s.n}-(${s.n}+1)`, [s.n, 2, 1])
      });
    }, { standard: SOLID })
  ]);
  B.addTypes('7-2-4', 'poly', [
    TB('poly-name-3cond', '조건 셋에 맞는 다면체의 이름과 개수', '심9 / 기본 ②11·12', (d, n) => {
      // 걸리는 곳: 면의 개수를 그대로 이름에 붙이는 아이(십이면체 → 십이각뿔대). 각뿔대의 면은 n + 2개, 각뿔의 면은 n + 1개이다.
      const k = d.int(8, 12);
      if (n === 0) return M(`다음 조건을 모두 만족시키는 입체도형은 ${box()}각뿔대이다. ${box()} 안에 알맞은 수와 이 입체도형의 꼭짓점의 개수를 구하시오.`, [{ label: '□ 안의 수', answer: k - 2 }, { label: '꼭짓점의 개수', answer: 2 * (k - 2), unit: '개' }], {
        figure: lines(['(가) 두 밑면이 서로 평행하다.', '(나) 옆면이 모두 직사각형이 아닌 사다리꼴이다.', `(다) ${hedron(k)}이다.`]), shown: `${NUMW[k - 2]}각뿔대, ${2 * (k - 2)}개`,
        explain: `(가), (나)에서 각뿔대이다. ${V('n')}각뿔대의 면은 (${V('n')} + 2)개이므로 ${V('n')} + 2 = ${k}에서 ${V('n')} = ${k - 2}, 곧 ${NUMW[k - 2]}각뿔대이다. 꼭짓점의 개수는 2 × ${k - 2} = ${2 * (k - 2)}이다.`,
        facts: { calc: [[`${k}-2`, 0], [`2*(${k}-2)`, 1]], unseen: [k, 2] }
      });
      return M(`다음 조건을 모두 만족시키는 입체도형은 ${box()}각뿔이다. ${box()} 안에 알맞은 수와 이 입체도형의 모서리의 개수를 구하시오.`, [{ label: '□ 안의 수', answer: k - 1 }, { label: '모서리의 개수', answer: 2 * (k - 1), unit: '개' }], {
        figure: lines(['(가) 밑면이 1개이다.', '(나) 옆면이 모두 삼각형이다.', `(다) ${hedron(k)}이다.`]), shown: `${NUMW[k - 1]}각뿔, ${2 * (k - 1)}개`,
        explain: `(가), (나)에서 각뿔이다. ${V('n')}각뿔의 면은 (${V('n')} + 1)개이므로 ${V('n')} + 1 = ${k}에서 ${V('n')} = ${k - 1}, 곧 ${NUMW[k - 1]}각뿔이다. 모서리의 개수는 2 × ${k - 1} = ${2 * (k - 1)}이다.`,
        facts: { calc: [[`${k}-1`, 0], [`2*(${k}-1)`, 1]], unseen: [k, 1, 2] }
      });
    }, { count: 2, standard: SOLID })
  ]);
  B.addTypes('7-2-4', 'regular', [
    TB('reg-find', '조건으로 정다면체를 찾아 꼭짓점의 개수 구하기', '기본 ②20', (d) => {
      const r = d.pick(REG);
      return N(`면의 모양이 ${r.shape}이고 모서리의 개수가 ${r.e}개인 정다면체의 꼭짓점의 개수는?`, r.v, {
        unit: '개', explain: `면의 모양이 ${r.shape}이고 모서리가 ${r.e}개인 정다면체는 ${r.name}이다. ${r.name}의 꼭짓점은 ${r.v}개이다.`, facts: calc(`2*${r.e}/${r.m}`, [2, r.m])
      });
    }, { standard: SOLID })
  ]);
  B.addTypes('7-2-4', 'prism', [
    TB('prism-back', '기둥의 부피·겉넓이로 높이 구하기', '기본 ①44·47 ②47', (d, n) => {
      if (n === 0) {
        const [p, q, t] = d.until(() => { const x = d.int(2, 6); return [x, x + d.int(2, 5), d.int(3, 6)]; }, (v) => (v[0] + v[1]) * v[2] % 2 === 0), h = d.int(4, 12), S = (p + q) * t / 2;
        return N(`밑면이 윗변의 길이가 ${p} cm, 아랫변의 길이가 ${q} cm, 높이가 ${t} cm인 사다리꼴인 사각기둥의 부피가 ${S * h} cm³일 때, 이 사각기둥의 높이는?`, h, { unit: 'cm', explain: `밑넓이는 (${p} + ${q}) × ${t} ÷ 2 = ${S}(cm²)이다. 높이는 ${S * h} ÷ ${S} = ${h}(cm)`, facts: calc(`${S * h}/((${p}+${q})*${t}/2)`, [2]) });
      }
      const r = d.int(2, 6), h = d.until(() => d.int(3, 10), (v) => v !== r), S = 2 * r * r + 2 * r * h;
      return N(`밑면의 반지름의 길이가 ${r} cm인 원기둥의 겉넓이가 ${S}${PI} cm²일 때, 이 원기둥의 높이는?`, h, { unit: 'cm', explain: `두 밑넓이의 합은 ${PI} × ${r} × ${r} × 2 = ${2 * r * r}${PI}(cm²)이므로 옆넓이는 ${S}${PI} − ${2 * r * r}${PI} = ${2 * r * h}${PI}(cm²)이다. 옆넓이는 밑면의 둘레 ${2 * r}${PI} cm에 높이를 곱한 것이므로 높이는 ${2 * r * h} ÷ ${2 * r} = ${h}(cm)`, facts: calc(`(${S}-2*${r}*${r})/(2*${r})`, [2]) });
    }, { count: 2 })
  ]);
  B.addTypes('7-2-4', 'cone', [
    TB('cone-back', '뿔의 부피·겉넓이로 길이 구하기', '기본 ①57·61·64 ②62·63', (d, n) => {
      if (n === 0) {
        const [r, h] = d.until(() => [d.int(2, 9), d.int(3, 12)], (v) => v[0] * v[0] * v[1] % 3 === 0 && v[0] !== v[1]), vol = r * r * h / 3;
        return N(`밑면의 반지름의 길이가 ${r} cm이고 부피가 ${vol}${PI} cm³인 원뿔의 높이는?`, h, { unit: 'cm', explain: `${frac(1, 3)} × ${PI} × ${r} × ${r} × (높이) = ${vol}${PI}이므로 ${r * r} × (높이) = ${3 * vol}에서 높이는 ${3 * vol} ÷ ${r * r} = ${h}(cm)`, facts: calc(`3*${vol}/(${r}*${r})`, [3]) });
      }
      if (n === 1) {
        const [a, h] = d.until(() => [d.int(3, 9), d.int(3, 12)], (v) => v[0] * v[0] * v[1] % 3 === 0 && v[0] !== v[1]), vol = a * a * h / 3;
        return N(`한 변의 길이가 ${a} cm인 정사각형을 밑면으로 하는 사각뿔의 부피가 ${vol} cm³일 때, 이 사각뿔의 높이는?`, h, { unit: 'cm', explain: `${frac(1, 3)} × (${a} × ${a}) × (높이) = ${vol}이므로 ${a * a} × (높이) = ${3 * vol}에서 높이는 ${3 * vol} ÷ ${a * a} = ${h}(cm)`, facts: calc(`3*${vol}/(${a}*${a})`, [3]) });
      }
      if (n === 2) {
        const a = d.int(3, 9), s = d.until(() => d.int(4, 14), (v) => v > a * 0.7 && v !== a), S = a * a + 2 * a * s;
        return N(`밑면이 한 변의 길이가 ${a} cm인 정사각형이고 옆면이 모두 합동인 이등변삼각형인 사각뿔의 겉넓이가 ${S} cm²일 때, 옆면인 이등변삼각형의 높이는?`, s, { unit: 'cm', explain: `밑넓이는 ${a} × ${a} = ${a * a}(cm²)이므로 옆넓이는 ${S} − ${a * a} = ${2 * a * s}(cm²)이다. 옆면은 합동인 이등변삼각형 4개이므로 (${a} × (높이) ÷ 2) × 4 = ${2 * a * s}, 곧 ${2 * a} × (높이) = ${2 * a * s}에서 높이는 ${s} cm이다.`, facts: calc(`(${S}-${a}*${a})/(2*${a})`, [2]) });
      }
      const r = d.int(2, 9), S = 3 * r * r;
      return N(`모선의 길이가 밑면의 반지름의 길이의 2배인 원뿔의 겉넓이가 ${S}${PI} cm²일 때, 밑면의 반지름의 길이는?`, r, { unit: 'cm', explain: `밑면의 반지름의 길이를 ${V('r')} cm라 하면 모선의 길이는 2${V('r')} cm이다. 겉넓이는 ${PI}${V('r')}<sup>2</sup> + ${PI} × ${V('r')} × 2${V('r')} = 3${PI}${V('r')}<sup>2</sup>이므로 ${V('r')}<sup>2</sup> = ${S} ÷ 3 = ${r * r}에서 ${V('r')} = ${r}이다.`, facts: calc(`${S}/3/${r}`, [3, r]) });
    }, { count: 4 })
  ]);
  B.addTypes('7-2-4', 'sphere', [
    TB('sphere-back', '구의 겉넓이·부피·단면의 넓이로 다른 양 구하기', '기본 ①72 ②77·78·87', (d, n) => {
      if (n === 0) { const r = d.int(2, 9); return N(`겉넓이가 ${4 * r * r}${PI} cm²인 구의 반지름의 길이는?`, r, { unit: 'cm', explain: `반지름의 길이를 ${V('r')} cm라 하면 4${PI}${V('r')}<sup>2</sup> = ${4 * r * r}${PI}에서 ${V('r')}<sup>2</sup> = ${r * r}이므로 ${V('r')} = ${r}이다.`, facts: calc(`${4 * r * r}/4/${r}`, [4, r]) }); }
      if (n === 1) { const r = d.pick([3, 6, 9]), vol = 4 * r * r * r / 3; return N(`부피가 ${vol}${PI} cm³인 구의 반지름의 길이는?`, r, { unit: 'cm', explain: `반지름의 길이를 ${V('r')} cm라 하면 ${frac(4, 3)}${PI}${V('r')}<sup>3</sup> = ${vol}${PI}에서 ${V('r')}<sup>3</sup> = ${vol} × ${frac(3, 4)} = ${r * r * r}이다. ${r} × ${r} × ${r} = ${r * r * r}이므로 ${V('r')} = ${r}이다.`, facts: calc(`${vol}*3/4/(${r}*${r})`, [3, 4, r]) }); }
      if (n === 2) { const r = d.int(3, 12); return N(`구의 중심을 지나는 평면으로 자를 때 생기는 단면의 넓이가 ${r * r}${PI} cm²인 구의 겉넓이는?`, 4 * r * r, { unit: U2, explain: `단면은 구와 반지름의 길이가 같은 원이므로 넓이는 ${PI} × (반지름) × (반지름)이다. 구의 겉넓이는 4 × ${PI} × (반지름) × (반지름)이므로 단면의 넓이의 4배이다. ${r * r}${PI} × 4 = ${4 * r * r}${PI}(cm²)`, facts: calc(`4*${r * r}`, [4]) }); }
      if (n === 3) { const r = d.pick([3, 6, 9]), vol = 4 * r * r * r / 3; return N(`겉넓이가 ${4 * r * r}${PI} cm²인 구의 부피는?`, vol, { unit: U3, explain: `반지름의 길이를 ${V('r')} cm라 하면 4${PI}${V('r')}<sup>2</sup> = ${4 * r * r}${PI}에서 ${V('r')}<sup>2</sup> = ${r * r}이므로 ${V('r')} = ${r}이다. 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${vol}${PI}(cm³)`, facts: calc(`${4 * r * r}/4*${r}*4/3`, [4, 3, r]) }); }
      const r = d.pick([6, 12]), vol = 4 * r * r * r / 3;
      return N(`넓이가 ${r * r / 2}${PI} cm²인 반원을 지름을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 부피는?`, vol, { unit: U3, explain: `반원의 반지름의 길이를 ${V('r')} cm라 하면 ${frac(1, 2)}${PI}${V('r')}<sup>2</sup> = ${r * r / 2}${PI}에서 ${V('r')}<sup>2</sup> = ${r * r}이므로 ${V('r')} = ${r}이다. 회전체는 반지름의 길이가 ${r} cm인 구이므로 부피는 ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${vol}${PI}(cm³)`, facts: calc(`${r * r / 2}*2*${r}*4/3`, [2, 4, 3, r]) });
    }, { count: 5 })
  ]);
  B.addTypes('7-2-4', 'spin', [
    TB('spin-volume', '평면도형 하나를 돌린 회전체의 부피', '기본 ①84·86', (d, n) => {
      if (n === 0) {
        const w = d.int(2, 6), h = d.until(() => d.int(3, 9), (v) => v !== w);
        return N(SPIN_ASK('직사각형을', '부피는?'), w * w * h, { unit: U3, figure: spin('rect', { w: spx(w, 13, 44, 90), h: spx(h, 13, 60, 110) }, { w: cm(w), h: cm(h), label: `직사각형과 회전축 l. 가로 ${cm(w)}, 세로 ${cm(h)}이고 세로인 변이 회전축 위에 놓여 있다` }), explain: `회전체는 밑면의 반지름의 길이가 ${w} cm, 높이가 ${h} cm인 원기둥이다. ${PI} × ${w} × ${w} × ${h} = ${w * w * h}${PI}(cm³)`, facts: Object.assign(calc(`${w}*${w}*${h}`), { rule: 'spin-rect' }) });
      }
      if (n === 1) {
        const [a, b, c] = d.until(() => { const t = d.pick(RIGHT.slice(0, 4)); return d.bool() ? t : [t[1], t[0], t[2]]; }, (v) => v[0] * v[0] * v[1] % 3 === 0);
        return N(SPIN_ASK('직각삼각형을', '부피는?'), a * a * b / 3, { unit: U3, figure: spin('tri', { a: spx(a, 11, 48, 96), b: spx(b, 11, 56, 110) }, { a: cm(a), b: cm(b), c: cm(c), label: `직각삼각형과 회전축 l. 직각을 낀 두 변은 ${cm(a)}, ${cm(b)}, 빗변은 ${cm(c)}이고, 길이가 ${cm(b)}인 변이 회전축 위에 놓여 있다` }), explain: `회전체는 밑면의 반지름의 길이가 ${a} cm, 높이가 ${b} cm인 원뿔이다(빗변 ${c} cm는 모선이다). ${frac(1, 3)} × ${PI} × ${a} × ${a} × ${b} = ${a * a * b / 3}${PI}(cm³)`, facts: Object.assign(calc(`${a}*${a}*${b}/3`, [3]), { rule: 'spin-tri' }) });
      }
      const r = d.pick([3, 6, 9]);
      if (n === 2) return N(SPIN_ASK('반원을', '부피는?'), 4 * r * r * r / 3, { unit: U3, figure: spin('semi', { r: 46 }, { d: cm(2 * r), label: `반원과 회전축 l. 반원의 지름 ${cm(2 * r)}이 회전축 위에 놓여 있다` }), explain: `회전체는 반지름의 길이가 ${2 * r} ÷ 2 = ${r}(cm)인 구이다. ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} = ${4 * r * r * r / 3}${PI}(cm³)`, facts: calc(`4*(${2 * r}/2)*(${2 * r}/2)*(${2 * r}/2)/3`, [4, 2, 3]) });
      return N(SPIN_ASK('사분원을', '부피는?'), 2 * r * r * r / 3, { unit: U3, figure: spin('quarter', { r: 62 }, { r: cm(r), label: `사분원(원의 4분의 1)과 회전축 l. 반지름 ${cm(r)}이고 한 반지름이 회전축 위에 놓여 있다` }), explain: `회전체는 반지름의 길이가 ${r} cm인 반구이다. ${frac(4, 3)} × ${PI} × ${r} × ${r} × ${r} × ${frac(1, 2)} = ${2 * r * r * r / 3}${PI}(cm³)`, facts: calc(`4*${r}*${r}*${r}/3/2`, [4, 3, 2]) });
    }, { count: 4 })
  ]);
  B.addTypes('7-2-4', 'spin', [
    TB('spin-surface', '평면도형 하나를 돌린 회전체의 겉넓이', '기본 ①86 ②83', (d, n) => {
      if (n === 0) {
        const w = d.int(2, 6), h = d.until(() => d.int(3, 9), (v) => v !== w && v !== 2 * w), S = 2 * w * w + 2 * w * h;
        return N(SPIN_ASK('직사각형을', '겉넓이는?'), S, { unit: U2, figure: spin('rect', { w: spx(w, 13, 44, 90), h: spx(h, 13, 60, 110) }, { w: cm(w), h: cm(h), label: `직사각형과 회전축 l. 가로 ${cm(w)}, 세로 ${cm(h)}이고 세로인 변이 회전축 위에 놓여 있다` }), explain: `회전체는 밑면의 반지름의 길이가 ${w} cm, 높이가 ${h} cm인 원기둥이다. ${PI} × ${w} × ${w} × 2 + 2 × ${PI} × ${w} × ${h} = ${2 * w * w}${PI} + ${2 * w * h}${PI} = ${S}${PI}(cm²)`, facts: calc(`${w}*${w}*2+2*${w}*${h}`, [2]) });
      }
      if (n === 1) {
        const t = d.pick(RIGHT.slice(0, 4)), [a, b, c] = d.bool() ? t : [t[1], t[0], t[2]], S = a * a + a * c;
        return N(SPIN_ASK('직각삼각형을', '겉넓이는?'), S, { unit: U2, figure: spin('tri', { a: spx(a, 11, 48, 96), b: spx(b, 11, 56, 110) }, { a: cm(a), b: cm(b), c: cm(c), label: `직각삼각형과 회전축 l. 직각을 낀 두 변은 ${cm(a)}, ${cm(b)}, 빗변은 ${cm(c)}이고, 길이가 ${cm(b)}인 변이 회전축 위에 놓여 있다` }), explain: `회전체는 밑면의 반지름의 길이가 ${a} cm, 모선의 길이가 ${c} cm인 원뿔이다(길이가 ${b} cm인 변은 높이이다). ${PI} × ${a} × ${a} + ${PI} × ${a} × ${c} = ${a * a}${PI} + ${a * c}${PI} = ${S}${PI}(cm²)`, facts: calc(`${a}*${a}+${a}*${c}`) });
      }
      const r = d.int(2, 9);
      return N(SPIN_ASK('반원을', '겉넓이는?'), 4 * r * r, { unit: U2, figure: spin('semi', { r: 46 }, { d: cm(2 * r), label: `반원과 회전축 l. 반원의 지름 ${cm(2 * r)}이 회전축 위에 놓여 있다` }), explain: `회전체는 반지름의 길이가 ${2 * r} ÷ 2 = ${r}(cm)인 구이다. 4 × ${PI} × ${r} × ${r} = ${4 * r * r}${PI}(cm²)`, facts: calc(`4*(${2 * r}/2)*(${2 * r}/2)`, [4, 2]) });
    }, { count: 3 })
  ]);

  // ── 2026-10-13 다시 실은 꼴(기본) ──
  // 처음 지을 때 「세 번 넘게 셈하는 겉넓이」라 뺀 꼴 가운데, 기본에서 하는 일(밑넓이 2개와 옆넓이)을 그대로 하는 것.
  const TR = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  B.addTypes('7-2-4', 'prism', [
    TR('prism-house-surface', '밑면이 오각형인 각기둥의 겉넓이', '①40', (d) => {
      const [w, g, s] = d.pick([[6, 4, 5], [8, 3, 5], [12, 8, 10]]), e = d.until(() => d.int(2, 6), (v) => ![w, g, s].includes(v)), L = d.until(() => d.int(5, 12), (v) => ![w, g, s, e].includes(v)), S = w * e + w * g / 2, round = w + 2 * e + 2 * s, total = 2 * S + round * L;
      return N('다음 그림과 같이 밑면이 오각형인 각기둥의 겉넓이는?', total, {
        unit: 'cm²', figure: K.housePrismFig(w, e, g, L, { w: cm(w), e: cm(e), g: cm(g), s: cm(s), L: cm(L), label: `오각기둥을 눕혀 놓은 겨냥도. 밑면은 가로 ${cm(w)}, 세로 ${cm(e)}인 직사각형 위에 밑변 ${cm(w)}, 높이 ${cm(g)}인 이등변삼각형을 얹은 모양의 오각형이고, 이등변삼각형의 길이가 같은 두 변은 ${cm(s)}이다. 기둥의 높이는 ${cm(L)}` }),
        explain: `밑면을 직사각형과 삼각형으로 나누면 밑넓이는 ${w} × ${e} + ${w} × ${g} ÷ 2 = ${S}(cm²)이다. 밑면의 둘레의 길이는 ${w} + ${e} + ${s} + ${s} + ${e} = ${round}(cm)이므로 옆넓이는 ${round} × ${L} = ${round * L}(cm²)이다(옆넓이에는 삼각형의 높이가 아니라 비스듬한 변의 길이를 쓴다). 겉넓이는 ${S} × 2 + ${round * L} = ${total}(cm²)`,
        facts: calc(`(${w}*${e}+${w}*${g}/2)*2+(${w}+${e}+${s}+${s}+${e})*${L}`, [2])
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
