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
// 교육과정의 금(복잡하게 변형된 입체)에 걸리지 않게, 입체는 둘까지만 붙이거나 빼고 겉넓이는 세 번까지만 셈한다. 닮음이 있어야 나오는 길이는 모두 그림에 적었다.
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
})(typeof window !== 'undefined' ? window : globalThis);
