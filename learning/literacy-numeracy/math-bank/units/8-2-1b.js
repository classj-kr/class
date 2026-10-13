// 중학교 2학년 2학기 1단원 삼각형의 성질 — 뒤쪽 묶음(삼각형의 외심, 삼각형의 내심, 외심과 내심).
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 파일에서 지킨 것
//  - 외심이 있는 그림은 원 위에 세 꼭짓점을 놓아 짓는다(세 내각의 크기로 중심각을 정한다). 외심과 꼭짓점을 이은 선분이 만드는 조각 각은 그대로 수치가 된다.
//  - ∠BOC = 2∠A(외심), ∠BIC = 90° + ½∠A(내심)를 한 번 쓰는 것, 조각 각 셋의 합이 90°인 것은 두 교과서가 문제로 가르치므로 기본이다. 풀이에는 이등변삼각형·각의 이등분으로 까닭을 적는다.
//  - 내접원의 반지름·넓이·둘레는 실제로 그려지는 삼각형(세 변의 길이와 넓이가 맞는 것)만 쓴다. 원문에서 수가 맞지 않던 것(변 7·9·8에 넓이 24 따위)은 따르지 않았다.
//  - 내접원은 원으로 그리고 접점에 직각 표시를 넣는다. 접선의 길이는 「한 꼭짓점에서 두 접점까지의 길이가 같다」로 푼다.
//  - 둔각삼각형의 외심(삼각형 밖), 외심과 내심이 함께 있는 그림에서 각을 여러 번 좇는 것은 실력(8-2-1c.js)에 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 각도는 수에 붙여 적고(56°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { lines, N, M, C } = B.kit;
  const { V, nb } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT, Board } = B.kit.mgeo;
  const K = B.kit.m821;
  const { UNIT, T, X, SYM, HALF, sg, deg, cm, eq, jo, degQ, cmQ, cm2Q, pickOne, allQ, sayQ, tagged, foot, along, midDir, circumOf, inOf, baseTri, isoTri, sssTri, fitPts, spin, scene, exSvg, exSay, exHtml } = K;

  // ── 그림 ──
  // 세 내각의 크기가 al(∠A), be(∠B), 나머지(∠C)인 삼각형을 중심이 O 인 원 위에 놓는다. 변 BC 가 가로이고 꼭짓점 A 가 위에 온다(∠A 가 둔각이면 O 는 변 BC 의 아래에 있다).
  const onCircle = (al, be) => { const O = [0, 0]; return { O, B: at(O, 100, 270 - al), C: at(O, 100, 270 + al), A: at(O, 100, 270 + al + 2 * be) }; };
  // 외심 그림. o.feet: 세 변의 중점 D(AB), E(BC), F(CA)도 넣는다.
  function circPts(al, be, o) {
    const opt = o || {}, P = onCircle(al, be);
    if (opt.feet) Object.assign(P, { D: mid(P.A, P.B), E: mid(P.B, P.C), F: mid(P.C, P.A) });
    return fitPts(P, opt.size || [205, 160]);
  }
  // 내심 그림. o.feet: 내심에서 세 변에 내린 수선의 발 D(AB), E(BC), F(CA)도 넣는다. 돌려주는 점들에 r(내접원의 반지름, px)가 붙는다.
  function inPts(be, ga, o) {
    const opt = o || {}, P = baseTri(be, ga);
    P.I = inOf(P.A, P.B, P.C);
    if (opt.feet) Object.assign(P, { D: foot(P.I, P.A, P.B), E: foot(P.I, P.B, P.C), F: foot(P.I, P.C, P.A) });
    if (opt.more) Object.assign(P, opt.more(P));
    const Q = fitPts(P, opt.size || [215, 160]);
    Object.defineProperty(Q, 'r', { value: dist(Q.I, foot(Q.I, Q.B, Q.C)), enumerable: false });
    return Q;
  }
  // 세 변의 길이(a = BC, b = CA, c = AB)로 지은 내심 그림
  function inPtsSides(a, b, c, o) {
    const opt = o || {}, P = sssTri(a, b, c);
    P.I = inOf(P.A, P.B, P.C);
    if (opt.feet) Object.assign(P, { D: foot(P.I, P.A, P.B), E: foot(P.I, P.B, P.C), F: foot(P.I, P.C, P.A) });
    const Q = fitPts(P, opt.size || [215, 160]);
    Object.defineProperty(Q, 'r', { value: dist(Q.I, foot(Q.I, Q.B, Q.C)), enumerable: false });
    return Q;
  }
  // 변 BC 가 가로가 되고 꼭짓점 A 가 위에 오도록 점들을 돌리고 뒤집는다.
  function layFlat(P) {
    const Q = spin(P, -dirOf(P.B, P.C), P.B), out = {};
    const up = Q.A[1] < Q.B[1];
    for (const key of Object.keys(Q)) out[key] = up ? Q[key] : [Q[key][0], 2 * Q.B[1] - Q[key][1]];
    return out;
  }
  // 조각 각 셋(합 90°): 서로 다르고 글이 들어갈 만큼 크다.
  const pieces = (d, lo) => d.until(() => { const p = d.int(lo || 22, 42), q = d.int(lo || 22, 42); return [p, q, 90 - p - q]; }, (w) => w[2] >= (lo || 22) && w[2] <= 42 && Math.abs(w[0] - w[1]) >= 3 && Math.abs(w[1] - w[2]) >= 3 && Math.abs(w[0] - w[2]) >= 3);
  // 서로 꽤 다른 세 예각(외심이 안에 있고, 틀린 식이 우연히 맞지 않게)
  const acute = (d) => d.until(() => { const a = d.int(44, 76), b = d.int(44, 76); return [a, b, 180 - a - b]; }, (w) => w[2] >= 44 && w[2] <= 76 && Math.abs(w[0] - w[1]) >= 7 && Math.abs(w[1] - w[2]) >= 7 && Math.abs(w[0] - w[2]) >= 7);
  const O_HEAD = '점 O는 △ABC의 외심이다.', I_HEAD = '점 I는 △ABC의 내심이다.';
  const O_SAY = '삼각형 ABC와 그 내부의 점 O. ', I_SAY = '삼각형 ABC와 그 내부의 점 I. ';
  const O_WHY = `점 O가 외심이므로 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이고 △OAB, △OBC, △OCA는 모두 이등변삼각형이다.`;

  // ── 삼각형의 외심 ──
  const O_TRUE = [eq('AD', 'BD'), eq('BE', 'CE'), eq('AF', 'CF'), nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`), '△OBE ≡ △OCE', '△OAD ≡ △OBD', '∠OAD = ∠OBD', '∠OBE = ∠OCE', '∠OAF = ∠OCF'];
  const O_FALSE = [
    [eq('OD', 'OE'), '외심에서 세 변까지의 거리가 같다고 할 수 없다. 세 변까지의 거리가 같은 점은 내심이다.'],
    ['∠OCE = ∠OCF', `${sg('OC')}가 ∠C를 이등분한다고 할 수 없다. 세 내각의 이등분선이 만나는 점은 내심이다.`],
    ['∠OBD = ∠OBE', `${sg('OB')}가 ∠B를 이등분한다고 할 수 없다. 세 내각의 이등분선이 만나는 점은 내심이다.`],
    [eq('BD', 'BE'), `점 D, E는 각각 변 AB, BC의 중점이므로 ${sg('BD')}, ${sg('BE')}의 길이는 두 변의 길이의 절반이다. 두 변의 길이가 다르면 같지 않다.`],
    [eq('AD', 'AF'), `점 D, F는 각각 변 AB, AC의 중점이므로 ${sg('AD')}, ${sg('AF')}의 길이는 두 변의 길이의 절반이다. 두 변의 길이가 다르면 같지 않다.`],
    ['△OBD ≡ △OBE', `△OBD와 합동인 삼각형은 △OAD이다. ${sg('BD')}와 ${sg('BE')}의 길이가 같다고 할 수 없다.`, ['△OAD ≡ △OBD']]
  ];
  const WHERE = [['외부', '둔각삼각형'], ['내부', '예각삼각형'], ['한 변 위', '직각삼각형']];
  const SIDES3 = [[6, 7, 8], [7, 8, 9], [8, 9, 10], [9, 10, 11], [8, 10, 11], [9, 11, 12], [7, 9, 10]];   // 반쪽의 길이 셋(두 배 한 세 변이 가장 큰 각이 77°를 넘지 않는 예각삼각형 — 외심이 변에서 멀다)
  // [꼭짓점 A, C, B 의 좌표(외심이 원점), AF, OF, 사각형 ODBE 의 넓이, △ABC 의 넓이]: 변 CA 의 중점 F 까지의 거리와 넓이가 모두 자연수인 삼각형
  const O_AREAS = [[[3, 4], [3, -4], [-5, 0], 4, 3, 10, 32], [[3, 4], [3, -4], [-4, 3], 4, 3, 8, 28], [[6, 8], [6, -8], [-8, 6], 8, 6, 32, 112], [[6, 8], [6, -8], [-10, 0], 8, 6, 40, 128], [[8, 6], [8, -6], [-10, 0], 6, 8, 30, 108], [[5, 12], [5, -12], [-13, 0], 12, 5, 78, 216], [[5, 12], [5, -12], [-12, 5], 12, 5, 72, 204]];
  B.addTypes(UNIT, 'circum', [
    T('circum-words', '외접, 외접원, 외심의 뜻을 적은 문장의 빈칸', '①44 ②36', (d) => {
      const [al, be] = acute(d), P = onCircle(al, be), b = Board(), Q = {};
      b.disk(P.O, 78); for (const key of Object.keys(P)) Q[key] = [P[key][0] * 0.78, P[key][1] * 0.78];
      const S2 = scene(Q, b); S2.poly('BCA').seg('OA OB OC', 'thin').tick('OA OB OC').dot('O').names();
      return pickOne(d, '다음 ㈎, ㈏, ㈐에 알맞은 말을 차례로 나열한 것은?', '외접, 외접원, 외심', ['내접, 내접원, 내심', '외접, 외접원, 내심', '내접, 외접원, 외심'], {
        figure: S2.svg('원 O 위에 삼각형 ABC의 세 꼭짓점 A, B, C가 있다. 원의 중심 O와 세 꼭짓점을 이은 선분 OA, OB, OC에 길이가 같다는 표시가 있다') + lines(['△ABC의 세 꼭짓점이 모두 원 O 위에 있을 때, 원 O는 △ABC에 ㈎한다고 한다.', '이때 원 O를 △ABC의 ㈏이라 하고, 원의 중심 O를 △ABC의 ㈐이라고 한다.']),
        explain: '삼각형의 세 꼭짓점을 모두 지나는 원은 그 삼각형에 외접한다고 하고, 이 원을 외접원, 외접원의 중심을 외심이라고 한다.'
      });
    }),
    T('circum-claims', '외심에서 세 변에 수선을 그은 그림: 옳은 것과 옳지 않은 것', '①45 ②37 심34', (d) => {
      const [al, be] = acute(d), S = scene(circPts(al, be, { feet: true })), wantTrue = d.bool();
      S.poly('BCA').seg('OA OB OC OD OE OF').right('ODA OEB OFC').dot('O').names();
      return sayQ(d, `점 O는 △ABC의 외심이고, 점 O에서 세 변 AB, BC, CA에 내린 수선의 발을 각각 D, E, F라 하자. 다음 중 ${wantTrue ? '항상 옳은' : '옳다고 할 수 없는'} 것은?`, O_TRUE, O_FALSE, wantTrue,
        S.svg(`${O_SAY}점 O와 세 꼭짓점을 이은 선분 OA, OB, OC가 그어져 있다. 점 D는 변 AB 위에, 점 E는 변 BC 위에, 점 F는 변 CA 위에 있고 선분 OD, OE, OF가 그어져 있다. ∠ODA, ∠OEB, ∠OFC에 직각 표시가 있다`));
    }),
    T('circum-where', '삼각형의 모양과 외심의 위치', '①46 ②68', (d) => {
      const at0 = d.int(0, 2), [where] = WHERE[at0];
      const tri = (kind) => { const w = d.until(() => { const a = 5 * d.int(5, 23), b = 5 * d.int(5, 16); return [a, b, 180 - a - b]; }, (v) => v[2] >= 20 && v[2] <= v[1] && v[1] <= v[0] && (kind === 0 ? v[0] > 90 : kind === 1 ? v[0] < 90 : v[0] === 90) && v[0] !== v[1] && v[1] !== v[2]); return d.shuffle(w); };
      const kinds = [at0, (at0 + 1) % 3, (at0 + 2) % 3, (at0 + 1 + d.int(0, 1)) % 3], list = d.until(() => kinds.map(tri), (w) => new Set(w.map((t) => t.slice().sort().join())).size === 4);
      const show = (t) => nb(`${t[0]}°, ${t[1]}°, ${t[2]}°`);
      return pickOne(d, `세 내각의 크기가 다음과 같은 삼각형 가운데 외심이 삼각형의 ${where}에 있는 것은?`, show(list[0]), list.slice(1).map(show), {
        explain: `외심은 예각삼각형에서는 삼각형의 내부에, 직각삼각형에서는 빗변의 중점에, 둔각삼각형에서는 삼각형의 외부에 있다. 세 내각의 크기가 ${list[0].join('°, ')}°인 삼각형은 ${WHERE[at0][1]}이다.`
      });
    }),
    T('circum-xy', '외심과 변의 수직이등분선, 외접원의 반지름', '①47 ②39', (d, n) => {
      if (n === 0) {
        const [p, q, r] = d.shuffle(d.pick(SIDES3.filter((s) => new Set(s).size === 3))), P0 = sssTri(2 * q, 2 * r, 2 * p);
        P0.O = circumOf(P0.A, P0.B, P0.C); P0.D = mid(P0.A, P0.B); P0.E = mid(P0.B, P0.C);
        const S = scene(fitPts(P0, [215, 165]));
        S.poly('BCA').seg('OD OE').right('ODA OEB').dot('O').len('AD', cm(p), 'C').len('DB', `${sv('x')} cm`, 'C').len('BE', cm(q), 'A').len('EC', `${sv('y')} cm`, 'A').names();
        return M(`${O_HEAD} 점 O에서 두 변 AB, BC에 내린 수선의 발을 각각 D, E라 하자. ${nb(`${sg('AD')} = ${p} cm`)}, ${nb(`${sg('BD')} = ${X} cm`)}, ${nb(`${sg('BE')} = ${q} cm`)}, ${nb(`${sg('CE')} = ${V('y')} cm`)}일 때, ${X}, ${V('y')}의 값은?`, [{ label: 'x', answer: p }, { label: 'y', answer: q }], {
          figure: S.svg(`${O_SAY}점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 OD, OE가 그어져 있다. ∠ODA와 ∠OEB에 직각 표시가 있다. 선분 AD의 길이는 ${p} cm, 선분 BD의 길이는 x cm, 선분 BE의 길이는 ${q} cm, 선분 CE의 길이는 y cm`),
          explain: `외심은 세 변의 수직이등분선의 교점이므로 점 D, E는 각각 변 AB, BC의 중점이다. ${eq('BD', 'AD')} = ${p} cm, ${eq('CE', 'BE')} = ${q} cm이므로 ${X} = ${p}, ${V('y')} = ${q}이다.`,
          facts: { calc: [[`${p}`, 0], [`${q}`, 1]], rule: 'circum-xy-len' }
        });
      }
      const t = d.int(24, 38), r = d.int(4, 12), be = d.until(() => d.int(48, 76), (v) => 90 + t - v >= 46 && 90 + t - v <= 78 && Math.abs(v - (90 - t)) >= 6), S = scene(circPts(90 - t, be));
      S.poly('BCA').seg('OA OB OC').dot('O').len('OA', cm(r), be > 180 - (90 - t) - be ? 'C' : 'B', { gap: 3, t: 0.22 }).ang('OBC', deg(t)).ang('OCB', `${sv('y')}°`).names();
      return M(`${O_HEAD} ${nb(`${sg('OA')} = ${r} cm`)}, ${nb(`${sg('OC')} = ${X} cm`)}, ∠OBC = ${t}°, ∠OCB = ${V('y')}°일 때, ${X}, ${V('y')}의 값은?`, [{ label: 'x', answer: r }, { label: 'y', answer: t }], {
        figure: S.svg(`${O_SAY}선분 OA, OB, OC가 그어져 있다. 선분 OA의 길이는 ${r} cm, ∠OBC = ${t}°, ∠OCB = y°`),
        explain: `외심에서 세 꼭짓점까지의 거리는 같으므로 ${eq('OC', 'OA')} = ${r} cm이다. ${eq('OB', 'OC')}이므로 △OBC는 이등변삼각형이고 ∠OCB = ∠OBC = ${t}°이다. ${X} = ${r}, ${V('y')} = ${t}이다.`,
        facts: { calc: [[`${r}`, 0], [`${t}`, 1]], rule: 'circum-xy-mix' }
      });
    }, { count: 2 }),
    T('circum-perimeter', '외심에서 내린 수선의 발까지의 길이로 삼각형의 둘레 구하기', '①48 ②40 심35', (d) => {
      const [p, q, r] = d.shuffle(d.pick(SIDES3.filter((s) => new Set(s).size === 3))), P0 = sssTri(2 * q, 2 * r, 2 * p);
      P0.O = circumOf(P0.A, P0.B, P0.C); P0.D = mid(P0.A, P0.B); P0.E = mid(P0.B, P0.C); P0.F = mid(P0.C, P0.A);
      const S = scene(fitPts(P0, [215, 165])), sum = 2 * (p + q + r);
      S.poly('BCA').seg('OD OE OF').right('ODA OEB OFC').dot('O').len('BD', cm(p), 'C').len('EC', cm(q), 'A').len('CF', cm(r), 'B').names();
      return cmQ(`${O_HEAD} 점 O에서 세 변 AB, BC, CA에 내린 수선의 발을 각각 D, E, F라 하자. ${nb(`${sg('BD')} = ${p} cm`)}, ${nb(`${sg('CE')} = ${q} cm`)}, ${nb(`${sg('CF')} = ${r} cm`)}일 때, △ABC의 둘레의 길이는?`, sum, {
        figure: S.svg(`${O_SAY}점 D는 변 AB 위에, 점 E는 변 BC 위에, 점 F는 변 CA 위에 있고 선분 OD, OE, OF가 그어져 있다. ∠ODA, ∠OEB, ∠OFC에 직각 표시가 있다. 선분 BD의 길이는 ${p} cm, 선분 CE의 길이는 ${q} cm, 선분 CF의 길이는 ${r} cm`),
        explain: `외심은 세 변의 수직이등분선의 교점이므로 점 D, E, F는 세 변의 중점이다. ${sg('AB')} = ${2 * p} cm, ${sg('BC')} = ${2 * q} cm, ${sg('CA')} = ${2 * r} cm이므로 둘레의 길이는 2 × (${p} + ${q} + ${r}) = ${sum}(cm)이다.`,
        facts: { calc: [[`2*(${p}+${q}+${r})`, 0]], unseen: [2] }
      });
    }),
    T('circum-radius', '외심과 두 꼭짓점이 이루는 삼각형의 둘레로 외접원의 반지름 구하기', '①49 ②41', (d) => {
      const [k, r] = d.pick([[11, 9], [14, 13], [10, 8], [12, 10], [8, 7], [6, 5], [16, 13], [10, 9], [12, 11], [14, 11]]), ga = Math.asin(k / (2 * r)) / RAD, off = d.int(-9, 9), t = 2 * r + k;
      const S = scene(circPts((180 - ga) / 2 + off, (180 - ga) / 2 - off));
      S.poly('BCA').seg('OA OB').dot('O').len('AB', cm(k), 'C').names();
      return cmQ(`${O_HEAD} ${nb(`${sg('AB')} = ${k} cm`)}이고 △OAB의 둘레의 길이가 ${t} cm일 때, △ABC의 외접원의 반지름의 길이는?`, r, {
        figure: S.svg(`${O_SAY}선분 OA, OB가 그어져 있다. 변 AB의 길이는 ${k} cm`),
        explain: `외심에서 세 꼭짓점까지의 거리는 같으므로 ${eq('OA', 'OB')}이고, 이 길이가 외접원의 반지름의 길이이다. ${sg('OA')} + ${sg('OB')} = ${t} − ${k} = ${t - k}(cm)이므로 반지름의 길이는 ${t - k} ÷ 2 = ${r}(cm)이다.`,
        facts: { calc: [[`(${t}-${k})/2`, 0]], unseen: [2] }
      });
    }),
    T('circum-three', '외심과 세 꼭짓점을 이어 생긴 각', '①50 ②43', (d, n) => {
      const draw = (w) => { const S0 = scene(circPts(w[0] + w[2], w[0] + w[1])).poly('BCA').seg('OA OB OC').dot('O'); return n === 0 ? S0.ang('OAB', deg(w[0])).ang('OBC', deg(w[1])).ang('OCA', sv('x')).names() : S0.ang('OAB', deg(w[0])).ang('BOC', deg(180 - 2 * w[1]), { r: 12 }).ang('OCA', sv('x')).names({ O: 'AB|AC' }); };
      const [p, q, r] = d.until(() => pieces(d), (w) => !draw(w).clash()), S = draw([p, q, r]);
      if (n === 0) {
        return degQ(`${O_HEAD} ∠OAB = ${p}°, ∠OBC = ${q}°일 때, ∠OCA의 크기는?`, r, {
          figure: S.svg(`${O_SAY}선분 OA, OB, OC가 그어져 있다. ∠OAB = ${p}°, ∠OBC = ${q}°, ∠OCA = x`),
          explain: `${O_WHY} ∠OBA = ${p}°, ∠OCB = ${q}°, ∠OAC = ∠OCA이므로 △ABC의 세 내각의 크기의 합은 2 × (${p}° + ${q}° + ∠OCA) = 180°이다. ∠OCA = 90° − ${p}° − ${q}° = ${r}°이다.`,
          facts: { calc: [[`90-${p}-${q}`, 0]], unseen: [90] }
        });
      }
      const boc = 180 - 2 * q;
      return degQ(`${O_HEAD} ∠OAB = ${p}°, ∠BOC = ${boc}°일 때, ∠OCA의 크기는?`, r, {
        figure: S.svg(`${O_SAY}선분 OA, OB, OC가 그어져 있다. ∠OAB = ${p}°, ∠BOC = ${boc}°, ∠OCA = x`),
        explain: `${O_WHY} △OBC에서 ∠OBC = ∠OCB = (180° − ${boc}°) ÷ 2 = ${q}°이다. ∠OBA = ${p}°, ∠OAC = ∠OCA이므로 2 × (${p}° + ${q}° + ∠OCA) = 180°에서 ∠OCA = ${r}°이다.`,
        facts: { calc: [[`90-${p}-(180-${boc})/2`, 0]], unseen: [90, 180, 2] }
      });
    }, { count: 2 }),
    T('circum-vertex', '외심과 꼭짓점을 이어 한 내각의 크기 구하기', '①51 ②44', (d, n) => {
      const draw = (w) => { const S0 = scene(circPts(w[0] + w[2], w[0] + w[1])); return n === 0 ? S0.poly('BCA').seg('OB OC').dot('O').ang('OBA', deg(w[0])).ang('OCA', deg(w[2])).ang('BAC', sv('x'), { square: false }).names() : S0.poly('BCA').seg('OA OB OC').dot('O').ang('OAB', deg(w[0])).ang('OCB', deg(w[1])).names(); };
      const [p, q, r] = d.until(() => pieces(d), (w) => !draw(w).clash()), S = draw([p, q, r]);
      if (n === 0) {
        return degQ(`${O_HEAD} ∠OBA = ${p}°, ∠OCA = ${r}°일 때, ∠A의 크기는?`, p + r, {
          figure: S.svg(`${O_SAY}선분 OB, OC가 그어져 있다. ∠OBA = ${p}°, ∠OCA = ${r}°, ∠A = x`),
          explain: `선분 OA를 그으면 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이므로 ∠OAB = ∠OBA = ${p}°, ∠OAC = ∠OCA = ${r}°이다. ∠A = ${p}° + ${r}° = ${p + r}°이다.`,
          facts: { calc: [[`${p}+${r}`, 0]] }
        });
      }
      return degQ(`${O_HEAD} ∠OAB = ${p}°, ∠OCB = ${q}°일 때, ∠ABC의 크기는?`, p + q, {
        figure: S.svg(`${O_SAY}선분 OA, OB, OC가 그어져 있다. ∠OAB = ${p}°, ∠OCB = ${q}°`),
        explain: `${O_WHY} ∠OBA = ∠OAB = ${p}°, ∠OBC = ∠OCB = ${q}°이므로 ∠ABC = ${p}° + ${q}° = ${p + q}°이다.`,
        facts: { calc: [[`${p}+${q}`, 0]] }
      });
    }, { count: 2 }),
    T('circum-mixed', '한 꼭짓점의 조각 각과 내각으로 다른 각 구하기', '①51 ②47', (d, n) => {
      const draw = (w) => { const S0 = scene(circPts(w[0] + w[2], w[0] + w[1])); return n === 0 ? S0.poly('BCA').seg('OB').dot('O').ang('ABO', deg(w[0])).ang('OBC', deg(w[1])).ang('BAC', sv('x'), { square: false }).names() : S0.poly('BCA').seg('OA OB').dot('O').ang('ACB', deg(w[1] + w[2])).ang('OBC', deg(w[1])).ang('OAB', sv('x')).names(); };
      const [p, q, r] = d.until(() => pieces(d), (w) => !draw(w).clash()), S = draw([p, q, r]);
      if (n === 0) {
        return degQ(`${O_HEAD} ∠ABO = ${p}°, ∠OBC = ${q}°일 때, ∠BAC의 크기는?`, p + r, {
          figure: S.svg(`${O_SAY}선분 OB가 그어져 있다. ∠ABO = ${p}°, ∠OBC = ${q}°, ∠BAC = x`),
          explain: `선분 OA, OC를 그으면 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이므로 ∠OAB = ${p}°, ∠OCB = ${q}°, ∠OAC = ∠OCA이다. 2 × (${p}° + ${q}° + ∠OAC) = 180°에서 ∠OAC = ${r}°이다. ∠BAC = ${p}° + ${r}° = ${p + r}°이다.`,
          facts: { calc: [[`${p}+(90-${p}-${q})`, 0]], unseen: [90] }
        });
      }
      return degQ(`${O_HEAD} ∠ACB = ${q + r}°, ∠OBC = ${q}°일 때, ∠OAB의 크기는?`, p, {
        figure: S.svg(`${O_SAY}선분 OA, OB가 그어져 있다. ∠ACB = ${q + r}°, ∠OBC = ${q}°, ∠OAB = x`),
        explain: `선분 OC를 그으면 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이므로 ∠OCB = ∠OBC = ${q}°이고 ∠OCA = ${q + r}° − ${q}° = ${r}°, ∠OAC = ${r}°이다. ∠OAB = ∠OBA이므로 2 × (∠OAB + ${q}° + ${r}°) = 180°에서 ∠OAB = ${p}°이다.`,
        facts: { calc: [[`90-${q}-(${q + r}-${q})`, 0]], unseen: [90] }
      });
    }, { count: 2 }),
    T('circum-central', '외심과 두 꼭짓점이 이루는 각', '①52 ②45·46 심39', (d, n) => {
      if (n === 0) {
        const [al, be] = d.until(() => acute(d), (w) => w[1] <= 68), S = scene(circPts(al, be));
        S.poly('BCA').seg('OA OC').dot('O').ang('ABC', deg(be)).ang('AOC', sv('x'), { r: 12, square: false }).names({ O: 'AB|BC' });
        return degQ(`${O_HEAD} ∠B = ${be}°일 때, ∠AOC의 크기는?`, 2 * be, {
          figure: S.svg(`${O_SAY}선분 OA, OC가 그어져 있다. ∠B = ${be}°, ∠AOC = x`),
          explain: `선분 OB를 그으면 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이므로 △OAB, △OBC는 이등변삼각형이다. ∠AOB + ∠BOC = (180° − 2∠OBA) + (180° − 2∠OBC) = 360° − 2∠B = ${360 - 2 * be}°이므로 ∠AOC = 360° − ${360 - 2 * be}° = ${2 * be}°이다. 곧 ∠AOC = 2∠B이다.`,
          facts: { calc: [[`2*${be}`, 0]], unseen: [2] }
        });
      }
      if (n === 1) {
        const [al, be] = d.until(() => acute(d), (w) => w[0] <= 66), S = scene(circPts(al, be));
        S.poly('BCA').seg('OB OC').dot('O').ang('BAC', deg(al)).ang('OBC', sv('x')).names();
        return degQ(`${O_HEAD} ∠A = ${al}°일 때, ∠OBC의 크기는?`, 90 - al, {
          figure: S.svg(`${O_SAY}선분 OB, OC가 그어져 있다. ∠A = ${al}°, ∠OBC = x`),
          explain: `∠BOC = 2∠A = ${2 * al}°이다. ${eq('OB', 'OC')}이므로 △OBC는 이등변삼각형이고 ∠OBC = (180° − ${2 * al}°) ÷ 2 = ${90 - al}°이다.`,
          facts: { calc: [[`(180-2*${al})/2`, 0]], unseen: [180, 2] }
        });
      }
      const draw = (w) => scene(circPts(w[0] + w[2], w[0] + w[1])).poly('BCA').seg('OA OB OC').dot('O').ang('OAB', deg(w[0])).ang('OCA', deg(w[2])).ang('BOC', sv('x'), { r: 12, square: false }).names({ O: 'AB|AC' });
      const [p, q, r] = d.until(() => pieces(d), (w) => !draw(w).clash()), S = draw([p, q, r]);
      return degQ(`${O_HEAD} ∠OAB = ${p}°, ∠OCA = ${r}°일 때, ∠BOC의 크기는?`, 2 * (p + r), {
        figure: S.svg(`${O_SAY}선분 OA, OB, OC가 그어져 있다. ∠OAB = ${p}°, ∠OCA = ${r}°, ∠BOC = x`),
        explain: `${O_WHY} ∠OAC = ∠OCA = ${r}°이므로 ∠BAC = ${p}° + ${r}° = ${p + r}°이다. ∠BOC = 2∠BAC = ${2 * (p + r)}°이다.`,
        facts: { calc: [[`2*(${p}+${r})`, 0]], unseen: [2] }
      });
    }, { count: 3 }),
    T('circum-perp-angle', '외심에서 한 변에 내린 수선이 이루는 각', '①53 ②48', (d) => {
      const [p, q, r] = pieces(d), P = circPts(p + r, p + q, { feet: true }), S = scene({ A: P.A, B: P.B, C: P.C, O: P.O, D: P.E });
      S.poly('BCA').seg('OA OB OD').right('ODB').dot('O').ang('OAB', deg(p)).ang('BOD', sv('x'), { r: 13 }).names();
      return degQ(`${O_HEAD} 점 O에서 변 BC에 내린 수선의 발을 D라 하자. ∠OAB = ${p}°, ∠ABC = ${p + q}°일 때, ∠BOD의 크기는?`, 90 - q, {
        figure: S.svg(`${O_SAY}선분 OA, OB가 그어져 있다. 점 D는 변 BC 위에 있고 선분 OD가 그어져 있다. ∠ODB에 직각 표시가 있다. ∠OAB = ${p}°, ∠BOD = x`),
        explain: `${eq('OA', 'OB')}이므로 ∠OBA = ∠OAB = ${p}°이고 ∠OBD = ${p + q}° − ${p}° = ${q}°이다. △OBD에서 ∠BOD = 90° − ${q}° = ${90 - q}°이다.`,
        facts: { calc: [[`90-(${p + q}-${p})`, 0]], unseen: [90] }
      });
    }),
    T('circum-ratio', '각의 크기의 비가 주어진 외심 문제', '①54 ②50 심40', (d, n) => {
      if (n === 0) {
        const [a, bq, c] = d.shuffle(d.pick([[3, 4, 5], [4, 5, 6], [5, 6, 7], [5, 7, 8], [9, 10, 11], [7, 11, 12], [11, 12, 13]])), u = 180 / (a + bq + c), al = a * u, be = bq * u, S = scene(circPts(al, be));
        S.poly('BCA').seg('OA OB OC').dot('O').ang('AOC', sv('x'), { r: 12, square: false }).names({ O: 'AB|BC' });
        return degQ(`${O_HEAD} ${nb(`∠BAC : ∠ABC : ∠ACB = ${a} : ${bq} : ${c}`)}일 때, ∠AOC의 크기는?`, 2 * be, {
          figure: S.svg(`${O_SAY}선분 OA, OB, OC가 그어져 있다. ∠AOC = x`),
          explain: `∠ABC = 180° × ${B.kit.frac(bq, `${a} + ${bq} + ${c}`)} = ${be}°이다. ∠AOC = 2∠ABC = ${2 * be}°이다.`,
          facts: { calc: [[`2*180*${bq}/(${a}+${bq}+${c})`, 0]], unseen: [2, 180] }
        });
      }
      if (n === 1) {
        const [a, bq, c] = d.shuffle(d.pick([[4, 5, 6], [3, 4, 5], [5, 6, 7], [5, 7, 8], [9, 10, 11], [7, 11, 12]])), u = 360 / (a + bq + c), aob = a * u, boc = bq * u, coa = c * u, S = scene(circPts(boc / 2, coa / 2));
        S.poly('BCA').seg('OA OB OC').dot('O').names();
        return degQ(`${O_HEAD} ${nb(`∠AOB : ∠BOC : ∠COA = ${a} : ${bq} : ${c}`)}일 때, ∠ABC의 크기는?`, coa / 2, {
          figure: S.svg(`${O_SAY}선분 OA, OB, OC가 그어져 있다`),
          explain: `∠AOB = 360° × ${B.kit.frac(a, `${a} + ${bq} + ${c}`)} = ${aob}°, ∠BOC = ${boc}°이다. △OAB, △OBC는 이등변삼각형이므로 ∠OBA = (180° − ${aob}°) ÷ 2 = ${90 - aob / 2}°, ∠OBC = (180° − ${boc}°) ÷ 2 = ${90 - boc / 2}°이다. ∠ABC = ${90 - aob / 2}° + ${90 - boc / 2}° = ${coa / 2}°이다.`,
          facts: { calc: [[`(180-360*${a}/(${a}+${bq}+${c}))/2+(180-360*${bq}/(${a}+${bq}+${c}))/2`, 0]], unseen: [180, 360, 2] }
        });
      }
      // 조각 각이 모두 20° 안팎보다 크게(글이 들어가게) x 의 배수 셋으로 준다.
      const draw = ([j, k, m]) => { const x = 90 / (j + k + m); return scene(circPts(j * x + m * x, j * x + k * x)).poly('BCA').seg('OA OB OC').dot('O').ang('OAB', exSvg(j, 0, '°')).ang('OBC', exSvg(k, 0, '°')).ang('OCA', exSvg(m, 0, '°')).names(); };
      const [j, k, m] = d.until(() => d.shuffle(d.pick([[2, 3, 4], [4, 5, 6], [5, 6, 7], [4, 5, 9], [7, 8, 15], [8, 9, 13], [7, 9, 14]])), (w) => !draw(w).clash()), x = 90 / (j + k + m), S = draw([j, k, m]);
      return N(`${O_HEAD} ∠OAB = ${exHtml(j, 0, '°')}, ∠OBC = ${exHtml(k, 0, '°')}, ∠OCA = ${exHtml(m, 0, '°')}일 때, ${X}의 값은?`, x, {
        figure: S.svg(`${O_SAY}선분 OA, OB, OC가 그어져 있다. ∠OAB = ${exSay(j, 0, '°')}, ∠OBC = ${exSay(k, 0, '°')}, ∠OCA = ${exSay(m, 0, '°')}`),
        explain: `${O_WHY} △ABC의 세 내각의 크기의 합은 2 × (${j}${X} + ${k}${X} + ${m}${X}) = 180이므로 ${2 * (j + k + m)}${X} = 180, ${X} = ${x}이다.`,
        facts: { calc: [[`180/(2*(${j}+${k}+${m}))`, 0]], unseen: [180, 2] }
      });
    }, { count: 3 }),
    T('circum-area', '외심에서 내린 수선으로 나누어진 넓이', '②42 심36', (d, n) => {
      const [pa, pc, pb, p, h, quad, area] = d.pick(O_AREAS), raw = { A: [pa[0], -pa[1]], B: [pb[0], -pb[1]], C: [pc[0], -pc[1]], O: [0, 0] };
      Object.assign(raw, { D: mid(raw.A, raw.B), E: mid(raw.B, raw.C), F: mid(raw.C, raw.A) });
      const S = scene(fitPts(layFlat(raw), [215, 170]));
      S.b.poly([S.P.O, S.P.D, S.P.B, S.P.E], TINT);
      S.poly('BCA').seg('OD OE OF').right('ODA OEB OFC').dot('O').len(n === 0 ? 'AF' : 'CF', cm(p), 'B').len('OF', cm(h), n === 0 ? 'C' : 'A', { gap: 3 }).names({ O: n === 0 ? 'EF' : 'DF' });
      const said = `${O_SAY}점 D는 변 AB 위에, 점 E는 변 BC 위에, 점 F는 변 CA 위에 있고 선분 OD, OE, OF가 그어져 있다. ∠ODA, ∠OEB, ∠OFC에 직각 표시가 있고 사각형 ODBE가 색칠되어 있다. `;
      const head = `${O_HEAD} 점 O에서 세 변 AB, BC, CA에 내린 수선의 발을 각각 D, E, F라 하자.`;
      const why = `세 변의 수직이등분선으로 △ABC는 직각삼각형 여섯 개로 나누어지고 △OAD ≡ △OBD, △OBE ≡ △OCE, △OCF ≡ △OAF이다. △OAF의 넓이는 ${HALF} × ${p} × ${h} = ${p * h / 2}(cm²)이다.`;
      if (n === 0) return cm2Q(`${head} ${nb(`${sg('AF')} = ${p} cm`)}, ${nb(`${sg('OF')} = ${h} cm`)}이고 사각형 ODBE의 넓이가 ${quad} cm²일 때, △ABC의 넓이는?`, area, {
        figure: S.svg(`${said}선분 AF의 길이는 ${p} cm, 선분 OF의 길이는 ${h} cm`),
        explain: `${why} △ABC의 넓이는 사각형 ODBE의 넓이의 2배와 △OAF의 넓이의 2배를 더한 것이므로 ${quad} × 2 + ${p * h / 2} × 2 = ${area}(cm²)이다.`,
        facts: { calc: [[`${quad}*2+${p}*${h}/2*2`, 0]], unseen: [2] }
      });
      return cm2Q(`${head} ${nb(`${sg('CF')} = ${p} cm`)}, ${nb(`${sg('OF')} = ${h} cm`)}이고 △ABC의 넓이가 ${area} cm²일 때, 사각형 ODBE의 넓이는?`, quad, {
        figure: S.svg(`${said}선분 CF의 길이는 ${p} cm, 선분 OF의 길이는 ${h} cm`),
        explain: `${why} △OAC의 넓이는 ${p * h / 2} × 2 = ${p * h}(cm²)이다. 사각형 ODBE의 넓이는 △ABC에서 △OAC를 뺀 넓이의 절반이므로 (${area} − ${p * h}) ÷ 2 = ${quad}(cm²)이다.`,
        facts: { calc: [[`(${area}-${p}*${h}/2*2)/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('circum-right-len', '직각삼각형의 외심: 빗변의 중점과 길이', '①56 ②52', (d, n) => {
      if (n === 0) {
        const bb = d.until(() => d.int(32, 58), (v) => Math.abs(v - 45) >= 4), k = d.int(4, 12), P0 = { B: [0, 0], C: [100, 0], A: at([0, 0], 100 * Math.cos(bb * RAD), bb), M: [50, 0] };
        const S = scene(fitPts(P0, [215, 150]));
        S.poly('BCA').seg('AM').right('BAC').tick('BM MC').len('AM', cm(k), bb > 45 ? 'C' : 'B', { gap: 3, t: 0.62 }).names();
        return cmQ(`∠A = 90°인 직각삼각형 ABC에서 점 M은 빗변 BC의 중점이다. ${nb(`${sg('AM')} = ${k} cm`)}일 때, ${sg('BC')}의 길이는?`, 2 * k, {
          figure: S.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있다. 점 M은 변 BC 위에 있고 선분 BM과 선분 MC에 길이가 같다는 표시가 있다. 선분 AM의 길이는 ${k} cm`),
          explain: `직각삼각형의 외심은 빗변의 중점이므로 점 M은 △ABC의 외심이고 ${nb(`${sg('MA')} = ${sg('MB')} = ${sg('MC')}`)} = ${k} cm이다. ${sg('BC')} = ${k} × 2 = ${2 * k}(cm)이다.`,
          facts: { calc: [[`${k}*2`, 0]], unseen: [2] }
        });
      }
      const k = d.int(3, 12), P0 = { B: [0, 0], C: [100, 0], A: at([0, 0], 50, 60), O: [50, 0] }, S = scene(fitPts(P0, [215, 110]));
      S.poly('BCA').seg('AO').right('BAC').dot('O').ang('ABC', '60°').dim('BC', cm(2 * k), 'A', 22).names({ O: 270 });
      return cmQ(`∠A = 90°인 직각삼각형 ABC에서 점 O는 △ABC의 외심이다. ∠B = 60°, ${nb(`${sg('BC')} = ${2 * k} cm`)}일 때, ${sg('AB')}의 길이는?`, k, {
        figure: S.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있고 ∠B = 60°이다. 점 O는 변 BC 위에 있고 선분 AO가 그어져 있다. 변 BC의 길이는 ${2 * k} cm`),
        explain: `직각삼각형의 외심은 빗변의 중점이므로 ${eq('OA', 'OB')} = ${2 * k} ÷ 2 = ${k}(cm)이다. △OAB는 ${eq('OA', 'OB')}이고 ∠B = 60°이므로 세 내각의 크기가 모두 60°인 정삼각형이다. ${sg('AB')}의 길이는 ${k} cm이다.`,
        facts: { calc: [[`${2 * k}/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('circum-right-angle', '직각삼각형의 빗변의 중점과 각', '①57 ②51', (d, n) => {
      const bb = d.until(() => d.int(28, 58), (v) => Math.abs(v - 45) >= 5 && Math.abs(v - 30) >= 2), P0 = { B: [0, 0], C: [100 * Math.cos(bb * RAD), 0], A: [100 * Math.cos(bb * RAD), -100 * Math.sin(bb * RAD)], M: [50 * Math.cos(bb * RAD), -50 * Math.sin(bb * RAD)] };
      const S = scene(fitPts(P0, [215, 150]));
      S.poly('BCA').seg('CM').right('BCA').tick('AM MB').ang('ABC', deg(bb));
      const said = `직각삼각형 ABC. ∠C에 직각 표시가 있다. 점 M은 변 AB 위에 있고 선분 AM과 선분 MB에 길이가 같다는 표시가 있다. 선분 CM이 그어져 있다. ∠B = ${bb}°`;
      if (n === 0) {
        S.ang('MCA', sv('x')).names();
        return degQ(`∠C = 90°인 직각삼각형 ABC에서 점 M은 빗변 AB의 중점이다. ∠B = ${bb}°일 때, ∠MCA의 크기는?`, 90 - bb, {
          figure: S.svg(`${said}, ∠MCA = x`),
          explain: `직각삼각형의 외심은 빗변의 중점이므로 ${nb(`${sg('MA')} = ${sg('MB')} = ${sg('MC')}`)}이다. △MBC에서 ∠MCB = ∠B = ${bb}°이므로 ∠MCA = 90° − ${bb}° = ${90 - bb}°이다.`,
          facts: { calc: [[`90-${bb}`, 0]], unseen: [90] }
        });
      }
      S.names();
      return sayQ(d, `∠C = 90°인 직각삼각형 ABC에서 점 M은 빗변 AB의 중점이고 ∠B = ${bb}°이다. 다음 중 옳지 않은 것은?`,
        ['점 M은 △ABC의 외심이다.', `∠MAC = ${90 - bb}°`, `∠BMC = ${180 - 2 * bb}°`, '∠MBC = ∠MCB', `∠AMC = ${2 * bb}°`, nb(`${sg('MA')} = ${sg('MB')} = ${sg('MC')}`)],
        [['△MAC ≡ △MBC', `△MAC와 △MBC는 모두 이등변삼각형이지만 꼭지각의 크기가 ${2 * bb}°, ${180 - 2 * bb}°로 다르므로 합동이 아니다.`], [`∠MCA = ${bb}°`, `∠MCB = ∠B = ${bb}°이고 ∠MCA = 90° − ${bb}° = ${90 - bb}°이다.`], [`∠BMC = ${2 * bb}°`, `△MBC에서 ∠BMC = 180° − ${bb}° × 2 = ${180 - 2 * bb}°이다.`, [`∠BMC = ${180 - 2 * bb}°`, `∠AMC = ${2 * bb}°`]]], false, S.svg(said));
    }, { count: 2 }),
    T('circum-right-area', '직각삼각형의 외심과 넓이', '①58 심37', (d, n) => {
      const [a, b] = d.pick([[24, 7], [8, 6], [12, 5], [15, 8], [12, 9], [16, 12], [24, 10], [20, 21], [12, 10], [14, 8], [10, 6]]), part = a * b / 4;
      const P0 = { B: [0, 0], C: [a, 0], A: [0, -b], O: [a / 2, -b / 2] }, S = scene(fitPts(P0, b / a > 0.9 ? [185, 165] : [225, 150]));
      S.b.poly([S.P.O, S.P.B, S.P.C], TINT);
      S.poly('BCA').seg('OB').right('ABC').dot('O');
      if (n === 0) {
        S.len('AB', cm(b), 'C').len('BC', cm(a), 'A').names();
        return cm2Q(`∠B = 90°인 직각삼각형 ABC에서 점 O는 △ABC의 외심이다. ${nb(`${sg('AB')} = ${b} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}일 때, △OBC의 넓이는?`, part, {
          figure: S.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있다. 점 O는 변 AC 위에 있고 선분 OB가 그어져 있다. 삼각형 OBC가 색칠되어 있다. 변 AB의 길이는 ${b} cm, 변 BC의 길이는 ${a} cm`),
          explain: `직각삼각형의 외심은 빗변의 중점이므로 ${eq('OA', 'OC')}이다. △OAB와 △OBC는 밑변의 길이가 같고 높이가 같으므로 넓이가 같다. △OBC의 넓이는 △ABC의 넓이의 절반인 ${HALF} × ${a} × ${b} × ${HALF} = ${part}(cm²)이다.`,
          facts: { calc: [[`${a}*${b}/2/2`, 0]], unseen: [2] }
        });
      }
      S.len('BC', cm(a), 'A').len('AB', `${sv('x')} cm`, 'C').names();
      return cmQ(`∠B = 90°인 직각삼각형 ABC에서 점 O는 △ABC의 외심이다. ${nb(`${sg('BC')} = ${a} cm`)}이고 △OBC의 넓이가 ${part} cm²일 때, ${sg('AB')}의 길이는?`, b, {
        figure: S.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있다. 점 O는 변 AC 위에 있고 선분 OB가 그어져 있다. 삼각형 OBC가 색칠되어 있다. 변 BC의 길이는 ${a} cm, 변 AB의 길이는 x cm`),
        explain: `직각삼각형의 외심은 빗변의 중점이므로 ${eq('OA', 'OC')}이고 △ABC의 넓이는 △OBC의 넓이의 2배인 ${2 * part} cm²이다. ${HALF} × ${a} × ${sg('AB')} = ${2 * part}에서 ${sg('AB')} = ${b} cm이다.`,
        facts: { calc: [[`${part}*2*2/${a}`, 0]], unseen: [2] }
      });
    }, { count: 2 })
  ]);

  // ── 삼각형의 내심 ──
  const I_TRUE = ['∠IAD = ∠IAF', '∠IBD = ∠IBE', '∠ICE = ∠ICF', nb(`${sg('ID')} = ${sg('IE')} = ${sg('IF')}`), eq('AD', 'AF'), eq('BD', 'BE'), eq('CE', 'CF'), '△IBD ≡ △IBE', '△IAD ≡ △IAF', '△ICE ≡ △ICF'];
  const I_FALSE = [
    [nb(`${sg('IA')} = ${sg('IB')} = ${sg('IC')}`), '내심에서 세 꼭짓점까지의 거리가 같다고 할 수 없다. 세 꼭짓점까지의 거리가 같은 점은 외심이다.'],
    ['∠IBE = ∠ICE', `${sg('IB')}와 ${sg('IC')}의 길이가 같다고 할 수 없으므로 두 각의 크기가 같다고 할 수 없다. ∠IBE와 크기가 같은 각은 ∠IBD이다.`, ['∠IBD = ∠IBE']],
    [eq('BE', 'CE'), `점 E는 내접원이 변 BC에 접하는 점이다. 변 BC의 중점이라고 할 수 없다.`],
    [eq('AF', 'CF'), `점 F는 내접원이 변 CA에 접하는 점이다. 변 CA의 중점이라고 할 수 없다.`],
    ['△IBE ≡ △ICE', `△IBE와 합동인 삼각형은 △IBD이다. ${sg('BE')}와 ${sg('CE')}의 길이가 같다고 할 수 없다.`, ['△IBD ≡ △IBE']]
  ];
  // [BC, CA, AB, 넓이, 내접원의 반지름]: 세 변의 길이와 넓이, 내접원의 반지름의 길이가 모두 자연수인 삼각형
  const HERON = [[4, 3, 5, 6, 1], [12, 5, 13, 30, 2], [8, 6, 10, 24, 2], [15, 8, 17, 60, 3], [12, 9, 15, 54, 3], [14, 13, 15, 84, 4], [12, 10, 10, 48, 3], [16, 12, 20, 96, 4], [24, 7, 25, 84, 3], [24, 15, 15, 108, 4], [24, 20, 20, 192, 6], [28, 17, 25, 210, 6], [21, 10, 17, 84, 3.5], [20, 13, 11, 66, 3]].filter((t) => Number.isInteger(t[4]));
  // [BC, CA, AB, BD, CE]: 내심을 지나고 변 BC 에 평행한 직선이 두 변을 자른 길이가 자연수인 삼각형
  const PARA = [[12, 9, 15, 5, 3], [12, 16, 20, 5, 4], [15, 12, 18, 6, 4], [18, 15, 21, 7, 5], [20, 28, 32, 8, 7], [21, 18, 24, 8, 6], [24, 21, 27, 9, 7], [27, 24, 30, 10, 8], [30, 20, 25, 10, 8], [27, 21, 33, 11, 7], [30, 27, 33, 11, 9]];
  // 내심을 지나고 변 BC 에 평행한 선분 DE(D 는 AB 위, E 는 AC 위)가 있는 그림
  function paraScene(a, b, c) {
    const P = inPtsSides(a, b, c, { size: [235, 150] });
    P.D = meet(P.I, [P.I[0] + 10, P.I[1]], P.A, P.B); P.E = meet(P.I, [P.I[0] + 10, P.I[1]], P.A, P.C);
    return scene(P).poly('BCA').seg('DE IB IC').arrow('DE', 0.72).arrow('BC', 0.6).dot('I');
  }
  const PARA_HEAD = `${I_HEAD} 점 I를 지나고 변 BC에 평행한 직선이 두 변 AB, AC와 만나는 점을 각각 D, E라 하자.`;
  const PARA_SAY = `${I_SAY}점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 DE가 점 I를 지난다. 선분 DE와 변 BC에 평행하다는 표시가 있다. 선분 IB, IC가 그어져 있다. `;
  const PARA_WHY = `${sg('DE')} ∥ ${sg('BC')}이므로 ∠DIB = ∠IBC(엇각)이고 ∠IBC = ∠DBI이므로 △DBI는 ${eq('DB', 'DI')}인 이등변삼각형이다. 같은 방법으로 ${eq('EC', 'EI')}이다.`;
  // 내접원이 그려진 그림(접점 D, E, F 와 반지름, 직각 표시)
  function incircleScene(P, o) {
    const opt = o || {}, S = scene(P);
    S.b.disk(P.I, P.r);
    S.poly('BCA');
    if (opt.radii !== false) S.seg('ID IE IF', 'thin').right('IDA IEB IFC');
    return S.dot('I');
  }
  // 접점이 있는 변 전체의 길이를 적는다(접점의 이름과 겹치지 않게 접점에서 먼 쪽에).
  const sideLen = (S, pair, touch, label, inside) => S.len(pair, label, inside, { t: dist(S.P[pair[0]], S.P[touch]) / dist(S.P[pair[0]], S.P[pair[1]]) < 0.5 ? 0.76 : 0.24 });
  B.addTypes(UNIT, 'incenter', [
    T('in-words', '내접, 내접원, 내심의 뜻을 적은 문장의 빈칸', '①44 ②53', (d) => {
      const v = d.until(() => [d.int(46, 70), d.int(46, 70)], (w) => 180 - w[0] - w[1] >= 46 && Math.abs(w[0] - w[1]) >= 6), S = incircleScene(inPts(v[0], v[1], { feet: true, size: [200, 150] }));
      S.tick('ID IE IF').names();
      return pickOne(d, '다음 ㈎, ㈏, ㈐에 알맞은 말을 차례로 나열한 것은?', '내접, 내접원, 내심', ['외접, 외접원, 외심', '내접, 내접원, 외심', '외접, 내접원, 내심'], {
        figure: S.svg('삼각형 ABC의 내부에 세 변에 모두 접하는 원 I가 있다. 원이 변 AB, BC, CA에 접하는 점이 각각 D, E, F이고, 원의 중심 I와 세 접점을 이은 선분 ID, IE, IF에 길이가 같다는 표시와 직각 표시가 있다') + lines(['△ABC의 세 변이 모두 원 I에 접할 때, 원 I는 △ABC에 ㈎한다고 한다.', '이때 원 I를 △ABC의 ㈏이라 하고, 원의 중심 I를 △ABC의 ㈐이라고 한다.']),
        explain: '삼각형의 세 변에 모두 접하는 원은 그 삼각형에 내접한다고 하고, 이 원을 내접원, 내접원의 중심을 내심이라고 한다.'
      });
    }),
    T('in-claims', '내심에서 세 변에 수선을 그은 그림: 옳은 것과 옳지 않은 것', '①62 ②54 심45', (d) => {
      const v = d.until(() => [d.int(44, 74), d.int(44, 74)], (w) => 180 - w[0] - w[1] >= 44 && Math.abs(w[0] - w[1]) >= 8 && Math.abs(180 - w[0] - 2 * w[1]) >= 8 && Math.abs(180 - 2 * w[0] - w[1]) >= 8), S = scene(inPts(v[0], v[1], { feet: true })), wantTrue = d.bool();
      S.poly('BCA').seg('IA IB IC ID IE IF').right('IDA IEB IFC').dot('I').names();
      return sayQ(d, `점 I는 △ABC의 내심이고, 점 I에서 세 변 AB, BC, CA에 내린 수선의 발을 각각 D, E, F라 하자. 다음 중 ${wantTrue ? '항상 옳은' : '옳다고 할 수 없는'} 것은?`, I_TRUE, I_FALSE, wantTrue,
        S.svg(`${I_SAY}점 I와 세 꼭짓점을 이은 선분 IA, IB, IC가 그어져 있다. 점 D는 변 AB 위에, 점 E는 변 BC 위에, 점 F는 변 CA 위에 있고 선분 ID, IE, IF가 그어져 있다. ∠IDA, ∠IEB, ∠IFC에 직각 표시가 있다`));
    }),
    T('in-xy', '내심과 각의 이등분선, 세 변까지의 거리', '①63 ②55', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 9), draw = (w) => { const P = inPts(2 * w.y, 2 * w.t, { feet: true }); return scene({ A: P.A, B: P.B, C: P.C, I: P.I, D: P.D, E: P.E }).poly('BCA').seg('IB IC ID IE').right('IDA IEB').dot('I').len('ID', cm(k), 'B', { gap: 3 }).len('IE', `${sv('x')} cm`, 'B', { gap: 3 }).ang('BAC', deg(w.a)).ang('ICB', deg(w.t), { r: 30 }).ang('IBE', `${sv('y')}°`, { r: 30 }).names({ I: 'AC' }); };
        const v = d.until(() => { const t = d.int(20, 30), y = d.int(22, 34); return { t, y, a: 180 - 2 * t - 2 * y }; }, (w) => w.a >= 56 && w.a <= 90 && Math.abs(w.t - w.y) >= 3 && !draw(w).clash()), S = draw(v);
        return M(`${I_HEAD} 점 I에서 두 변 AB, BC에 내린 수선의 발을 각각 D, E라 하자. ${nb(`${sg('ID')} = ${k} cm`)}, ${nb(`${sg('IE')} = ${X} cm`)}, ∠A = ${v.a}°, ∠ICB = ${v.t}°, ∠IBE = ${V('y')}°일 때, ${X}, ${V('y')}의 값은?`, [{ label: 'x', answer: k }, { label: 'y', answer: v.y }], {
          figure: S.svg(`${I_SAY}선분 IB, IC가 그어져 있다. 점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 ID, IE가 그어져 있다. ∠IDA와 ∠IEB에 직각 표시가 있다. 선분 ID의 길이는 ${k} cm, 선분 IE의 길이는 x cm, ∠A = ${v.a}°, ∠ICB = ${v.t}°, ∠IBE = y°`),
          explain: `내심에서 세 변까지의 거리는 같으므로 ${eq('IE', 'ID')} = ${k} cm이다. ${sg('IC')}는 ∠C의 이등분선이므로 ∠C = ${2 * v.t}°이고 ∠B = 180° − (${v.a}° + ${2 * v.t}°) = ${2 * v.y}°이다. ${sg('IB')}는 ∠B의 이등분선이므로 ∠IBE = ${v.y}°이다. ${X} = ${k}, ${V('y')} = ${v.y}이다.`,
          facts: { calc: [[`${k}`, 0], [`(180-${v.a}-2*${v.t})/2`, 1]], unseen: [180, 2], rule: 'in-xy-mix' }
        });
      }
      const draw = (w) => scene(inPts(2 * w[1], 2 * w[2])).poly('BCA').seg('IA IB IC').dot('I').ang('IBC', deg(w[1])).ang('ICA', deg(w[2])).ang('IBA', `${sv('x')}°`).ang('ICB', `${sv('y')}°`).names();
      const [p, q, r] = d.until(() => pieces(d, 24), (w) => !draw(w).clash()), S = draw([p, q, r]);
      return M(`${I_HEAD} ∠IBC = ${q}°, ∠ICA = ${r}°, ∠IBA = ${X}°, ∠ICB = ${V('y')}°일 때, ${X}, ${V('y')}의 값은?`, [{ label: 'x', answer: q }, { label: 'y', answer: r }], {
        figure: S.svg(`${I_SAY}선분 IA, IB, IC가 그어져 있다. ∠IBC = ${q}°, ∠ICA = ${r}°, ∠IBA = x°, ∠ICB = y°`),
        explain: `내심은 세 내각의 이등분선의 교점이므로 ∠IBA = ∠IBC = ${q}°, ∠ICB = ∠ICA = ${r}°이다. ${X} = ${q}, ${V('y')} = ${r}이다.`,
        facts: { calc: [[`${q}`, 0], [`${r}`, 1]], rule: 'in-xy-angle' }
      });
    }, { count: 2 }),
    T('in-three', '내심과 세 꼭짓점을 이어 생긴 각', '①64 ②56', (d, n) => {
      const draw = (w) => { const S0 = scene(inPts(2 * w[1], 2 * w[2])); return n === 0 ? S0.poly('BCA').seg('IA IB IC').dot('I').ang('IAB', deg(w[0])).ang('IBC', deg(w[1])).ang('ICA', sv('x')).names() : S0.poly('BCA').seg('IB IC').dot('I').ang('IBC', deg(w[1])).ang('ICB', deg(w[2])).ang('BAC', sv('x'), { square: false }).names(); };
      const [p, q, r] = d.until(() => pieces(d), (w) => !draw(w).clash()), S = draw([p, q, r]);
      if (n === 0) {
        return degQ(`${I_HEAD} ∠IAB = ${p}°, ∠IBC = ${q}°일 때, ∠ICA의 크기는?`, r, {
          figure: S.svg(`${I_SAY}선분 IA, IB, IC가 그어져 있다. ∠IAB = ${p}°, ∠IBC = ${q}°, ∠ICA = x`),
          explain: `내심은 세 내각의 이등분선의 교점이므로 ∠A = ${2 * p}°, ∠B = ${2 * q}°, ∠C = 2∠ICA이다. 2 × (${p}° + ${q}° + ∠ICA) = 180°에서 ∠ICA = 90° − ${p}° − ${q}° = ${r}°이다.`,
          facts: { calc: [[`90-${p}-${q}`, 0]], unseen: [90] }
        });
      }
      return degQ(`${I_HEAD} ∠IBC = ${q}°, ∠ICB = ${r}°일 때, ∠A의 크기는?`, 2 * p, {
        figure: S.svg(`${I_SAY}선분 IB, IC가 그어져 있다. ∠IBC = ${q}°, ∠ICB = ${r}°, ∠A = x`),
        explain: `${sg('IB')}, ${sg('IC')}는 각각 ∠B, ∠C의 이등분선이므로 ∠B = ${2 * q}°, ∠C = ${2 * r}°이다. ∠A = 180° − (${2 * q}° + ${2 * r}°) = ${2 * p}°이다.`,
        facts: { calc: [[`180-2*${q}-2*${r}`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('in-tri', '내심과 두 꼭짓점이 이루는 삼각형의 각', '①65 ②57', (d, n) => {
      const draw = (w) => { const P = inPts(2 * w[1], 2 * w[2]), S0 = scene(P); S0.wide = P.r >= (n === 0 ? 44 : 47); return n === 0 ? S0.poly('BCA').seg('IA IB').dot('I').ang('AIB', sv('x'), { r: 12, square: false }).names() : S0.poly('BCA').seg('IA IC').dot('I').ang('AIC', deg(180 - w[0] - w[2]), { r: 9, d: 26 }).ang('BCI', deg(w[2])).ang('BAI', sv('x')).names(); };
      const [p, q, r] = d.until(() => pieces(d), (w) => { const S0 = draw(w); return S0.wide && !S0.clash(); }), S = draw([p, q, r]);
      if (n === 0) {
        return degQ(`${I_HEAD} ∠BAC = ${2 * p}°, ∠ABC = ${2 * q}°일 때, ∠AIB의 크기는?`, 180 - p - q, {
          figure: S.svg(`${I_SAY}선분 IA, IB가 그어져 있다. ∠AIB = x`),
          explain: `${sg('IA')}, ${sg('IB')}는 각각 ∠A, ∠B의 이등분선이므로 ∠IAB = ${p}°, ∠IBA = ${q}°이다. △IAB에서 ∠AIB = 180° − (${p}° + ${q}°) = ${180 - p - q}°이다.`,
          facts: { calc: [[`180-${2 * p}/2-${2 * q}/2`, 0]], unseen: [180, 2] }
        });
      }
      const aic = 180 - p - r;
      return degQ(`${I_HEAD} ∠AIC = ${aic}°, ∠BCI = ${r}°일 때, ∠BAI의 크기는?`, p, {
        figure: S.svg(`${I_SAY}선분 IA, IC가 그어져 있다. ∠AIC = ${aic}°, ∠BCI = ${r}°, ∠BAI = x`),
        explain: `${sg('IC')}는 ∠C의 이등분선이므로 ∠ICA = ∠BCI = ${r}°이다. △IAC에서 ∠IAC = 180° − (${aic}° + ${r}°) = ${p}°이다. ${sg('IA')}는 ∠A의 이등분선이므로 ∠BAI = ∠IAC = ${p}°이다.`,
        facts: { calc: [[`180-${aic}-${r}`, 0]], unseen: [180] }
      });
    }, { count: 2 }),
    T('in-bic', '한 내각과 내심이 이루는 각', '①66 ②58', (d, n) => {
      const v = d.until(() => { const a = 2 * d.int(20, 42), b = d.int(40, 76); return [a, b, 180 - a - b]; }, (w) => w[2] >= 40 && w[2] <= 76 && Math.abs(w[1] - w[2]) >= 6), a = v[0], x = 90 + a / 2, S = scene(inPts(v[1], v[2]));
      S.poly('BCA').seg('IB IC').dot('I');
      if (n === 0) {
        S.ang('BAC', deg(a)).ang('BIC', sv('x'), { r: 12, square: false }).names();
        return degQ(`${I_HEAD} ∠A = ${a}°일 때, ∠BIC의 크기는?`, x, {
          figure: S.svg(`${I_SAY}선분 IB, IC가 그어져 있다. ∠A = ${a}°, ∠BIC = x`),
          explain: `∠ABC + ∠ACB = 180° − ${a}° = ${180 - a}°이고 ${sg('IB')}, ${sg('IC')}는 각의 이등분선이므로 ∠IBC + ∠ICB = ${180 - a}° ÷ 2 = ${90 - a / 2}°이다. △IBC에서 ∠BIC = 180° − ${90 - a / 2}° = ${x}°이다.`,
          facts: { calc: [[`180-(180-${a})/2`, 0]], unseen: [180, 2] }
        });
      }
      S.ang('BIC', deg(x), { r: 12 }).ang('BAC', sv('x'), { square: false }).names();
      return degQ(`${I_HEAD} ∠BIC = ${x}°일 때, ∠A의 크기는?`, a, {
        figure: S.svg(`${I_SAY}선분 IB, IC가 그어져 있다. ∠BIC = ${x}°, ∠A = x`),
        explain: `△IBC에서 ∠IBC + ∠ICB = 180° − ${x}° = ${180 - x}°이다. ${sg('IB')}, ${sg('IC')}는 각의 이등분선이므로 ∠ABC + ∠ACB = ${180 - x}° × 2 = ${2 * (180 - x)}°이다. ∠A = 180° − ${2 * (180 - x)}° = ${a}°이다.`,
        facts: { calc: [[`180-(180-${x})*2`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 }),
    T('in-ratio', '세 내각의 크기의 비와 내심이 이루는 각', '①66 심46', (d) => {
      const v = d.until(() => d.shuffle(d.pick([[7, 3, 5], [4, 5, 6], [2, 3, 4], [5, 6, 7], [3, 5, 7], [5, 7, 6], [4, 3, 5], [3, 4, 5], [5, 7, 8]])), (w) => w.every((k) => (180 * k / (w[0] + w[1] + w[2])) % 2 === 0)), sum = v[0] + v[1] + v[2], u = 180 / sum, [a, bq, c] = v.map((k) => k * u), x = 90 + c / 2;
      const S = scene(inPts(bq, c));
      S.poly('BCA').seg('IA IB').dot('I').ang('AIB', sv('x'), { r: 12, square: false }).names();
      return degQ(`${I_HEAD} ${nb(`∠A : ∠B : ∠C = ${v[0]} : ${v[1]} : ${v[2]}`)}일 때, ∠AIB의 크기는?`, x, {
        figure: S.svg(`${I_SAY}선분 IA, IB가 그어져 있다. ∠AIB = x`),
        explain: `∠A = 180° × ${B.kit.frac(v[0], sum)} = ${a}°, ∠B = 180° × ${B.kit.frac(v[1], sum)} = ${bq}°이다. ${sg('IA')}, ${sg('IB')}는 각의 이등분선이므로 △IAB에서 ∠AIB = 180° − (${a / 2}° + ${bq / 2}°) = ${x}°이다.`,
        facts: { calc: [[`180-180*${v[0]}/${sum}/2-180*${v[1]}/${sum}/2`, 0]], unseen: [180, 2, sum] }
      });
    }),
    T('in-extend', '두 내각의 이등분선을 맞은편 변까지 그은 그림', '①67', (d) => {
      const v = d.until(() => { const a = 2 * d.int(22, 40), b = d.int(46, 74); return [a, b, 180 - a - b]; }, (w) => w[2] >= 46 && w[2] <= 74 && Math.abs(w[1] - w[2]) >= 6), a = v[0], x = 90 + a / 2;
      const S = scene(inPts(v[1], v[2], { more: (P) => ({ E: meet(P.B, P.I, P.A, P.C), D: meet(P.C, P.I, P.A, P.B) }) }));
      S.poly('BCA').seg('BE CD').dot('I').ang('BAC', deg(a)).ang('DIE', sv('x'), { r: 12, square: false }).names({ I: [270, 13] });
      return degQ(`${I_HEAD} 선분 BI, CI의 연장선이 두 변 AC, AB와 만나는 점을 각각 E, D라 하자. ∠A = ${a}°일 때, ∠DIE의 크기는?`, x, {
        figure: S.svg(`${I_SAY}점 D는 변 AB 위에, 점 E는 변 AC 위에 있다. 선분 BE와 선분 CD가 점 I에서 만난다. ∠A = ${a}°, ∠DIE = x`),
        explain: `∠IBC + ∠ICB = (180° − ${a}°) ÷ 2 = ${90 - a / 2}°이므로 △IBC에서 ∠BIC = 180° − ${90 - a / 2}° = ${x}°이다. ∠DIE는 ∠BIC의 맞꼭지각이므로 ${x}°이다.`,
        facts: { calc: [[`180-(180-${a})/2`, 0]], unseen: [180, 2], rule: 'in-extend' }
      });
    }),
    T('in-iso', '이등변삼각형의 내심', '②60', (d) => {
      const t = 2 * d.int(14, 22), x = (90 - t) / 2, P0 = isoTri(2 * t); P0.I = inOf(P0.A, P0.B, P0.C);
      const S = scene(fitPts(P0, 2 * t >= 90 ? [225, 125] : [175, 160]));
      S.poly('BCA').tick('AB AC').seg('IA IB IC').dot('I').ang('BAI', deg(t), { r: 26 }).ang('ICB', sv('x'), { r: 26 }).names();
      return degQ(`점 I는 ${eq('AB', 'AC')}인 이등변삼각형 ABC의 내심이다. ∠BAI = ${t}°일 때, ∠ICB의 크기는?`, x, {
        figure: S.svg(`삼각형 ABC와 그 내부의 점 I. 변 AB와 변 AC에 길이가 같다는 표시가 있다. 선분 IA, IB, IC가 그어져 있다. ∠BAI = ${t}°, ∠ICB = x`),
        explain: `${sg('IA')}는 ∠A의 이등분선이므로 ∠A = ${2 * t}°이다. ${eq('AB', 'AC')}이므로 ∠ACB = (180° − ${2 * t}°) ÷ 2 = ${90 - t}°이다. ${sg('IC')}는 ∠C의 이등분선이므로 ∠ICB = ${90 - t}° ÷ 2 = ${x}°이다.`,
        facts: { calc: [[`(180-2*${t})/2/2`, 0]], unseen: [180, 2] }
      });
    }),
    T('in-altitude', '내심과 꼭짓점을 이은 선분과 높이 사이의 각', '②61', (d) => {
      const v = d.until(() => { const b = 2 * d.int(16, 18), c = 2 * d.int(32, 34); return [b, c]; }, (w) => w[1] - w[0] >= 32 && 180 - w[0] - w[1] >= 44), [bq, c] = v, a = 180 - bq - c, x = (c - bq) / 2;
      const S = scene(inPts(bq, c, { more: (P) => ({ H: foot(P.A, P.B, P.C) }) }));
      S.poly('BCA').seg('AI AH').right('AHB').dot('I').ang('ABC', deg(bq)).ang('ACB', deg(c)).ang('IAH', sv('x'), { r: 44, d: 60 }).names({ I: [180, 11] });
      return degQ(`${I_HEAD} 꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하자. ∠B = ${bq}°, ∠C = ${c}°일 때, ∠IAH의 크기는?`, x, {
        figure: S.svg(`${I_SAY}선분 AI가 그어져 있다. 점 H는 변 BC 위에 있고 선분 AH가 그어져 있다. ∠AHB에 직각 표시가 있다. ∠B = ${bq}°, ∠C = ${c}°, ∠IAH = x`),
        explain: `∠BAC = 180° − (${bq}° + ${c}°) = ${a}°이고 ${sg('AI')}는 ∠A의 이등분선이므로 ∠BAI = ${a / 2}°이다. △ABH에서 ∠BAH = 90° − ${bq}° = ${90 - bq}°이다. ∠IAH = ${90 - bq}° − ${a / 2}° = ${x}°이다.`,
        facts: { calc: [[`(90-${bq})-(180-${bq}-${c})/2`, 0]], unseen: [90, 180, 2] }
      });
    }),
    T('in-parallel', '내심을 지나고 한 변에 평행한 직선: 선분의 길이와 둘레', '①68 ②62 심49·50', (d, n) => {
      const flip = d.bool(), raw = d.pick(PARA), [a, b, c, bd, ce] = flip ? [raw[0], raw[2], raw[1], raw[4], raw[3]] : raw, S = paraScene(a, b, c);
      if (n === 0) {
        S.len('DB', cm(bd), 'C').len('EC', cm(ce), 'B').names();
        return cmQ(`${PARA_HEAD} ${nb(`${sg('BD')} = ${bd} cm`)}, ${nb(`${sg('CE')} = ${ce} cm`)}일 때, ${sg('DE')}의 길이는?`, bd + ce, {
          figure: S.svg(`${PARA_SAY}선분 BD의 길이는 ${bd} cm, 선분 CE의 길이는 ${ce} cm`),
          explain: `${PARA_WHY} ${sg('DE')} = ${sg('DI')} + ${sg('IE')} = ${bd} + ${ce} = ${bd + ce}(cm)이다.`, facts: { calc: [[`${bd}+${ce}`, 0]] }
        });
      }
      if (n === 1) {
        S.len('AB', cm(c), 'C', { t: 0.3 }).len('AC', cm(b), 'B', { t: 0.3 }).names();
        return cmQ(`${PARA_HEAD} ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('AC')} = ${b} cm`)}일 때, △ADE의 둘레의 길이는?`, b + c, {
          figure: S.svg(`${PARA_SAY}변 AB의 길이는 ${c} cm, 변 AC의 길이는 ${b} cm`),
          explain: `${PARA_WHY} △ADE의 둘레의 길이는 ${sg('AD')} + ${sg('DI')} + ${sg('IE')} + ${sg('EA')} = (${sg('AD')} + ${sg('DB')}) + (${sg('EC')} + ${sg('EA')}) = ${sg('AB')} + ${sg('AC')} = ${c} + ${b} = ${b + c}(cm)이다.`,
          facts: { calc: [[`${c}+${b}`, 0]] }
        });
      }
      S.names();
      return cmQ(`${PARA_HEAD} △ABC의 둘레의 길이가 ${a + b + c} cm이고 △ADE의 둘레의 길이가 ${b + c} cm일 때, ${sg('BC')}의 길이는?`, a, {
        figure: S.svg(PARA_SAY.trim()),
        explain: `${PARA_WHY} △ADE의 둘레의 길이는 ${sg('AD')} + ${sg('DB')} + ${sg('EC')} + ${sg('EA')} = ${sg('AB')} + ${sg('AC')}와 같으므로 ${sg('AB')} + ${sg('AC')} = ${b + c} cm이다. ${sg('BC')} = ${a + b + c} − ${b + c} = ${a}(cm)이다.`,
        facts: { calc: [[`${a + b + c}-${b + c}`, 0]] }
      });
    }, { count: 3 }),
    T('in-parallel-angle', '내심을 지나고 한 변에 평행한 직선: 각의 크기', '①69', (d) => {
      const [p, q, r] = pieces(d, 24), P = inPts(2 * q, 2 * r, { size: [235, 150] });
      P.D = meet(P.I, [P.I[0] + 10, P.I[1]], P.A, P.B); P.E = meet(P.I, [P.I[0] + 10, P.I[1]], P.A, P.C);
      const S = scene(P).poly('BCA').seg('DE IB IC').arrow('DE', 0.72).arrow('BC', 0.6).dot('I').ang('BAC', sv('x'), { square: false }).names();
      return degQ(`${PARA_HEAD} ∠BID + ∠CIE = ${q + r}°일 때, ∠A의 크기는?`, 2 * p, {
        figure: S.svg(`${PARA_SAY}∠A = x`),
        explain: `${sg('DE')} ∥ ${sg('BC')}이므로 ∠BID = ∠IBC, ∠CIE = ∠ICB(엇각)이다. ∠IBC + ∠ICB = ${q + r}°이고 ${sg('IB')}, ${sg('IC')}는 각의 이등분선이므로 ∠B + ∠C = ${q + r}° × 2 = ${2 * (q + r)}°이다. ∠A = 180° − ${2 * (q + r)}° = ${2 * p}°이다.`,
        facts: { calc: [[`180-${q + r}*2`, 0]], unseen: [180, 2] }
      });
    }),
    T('in-tangent', '내접원의 접점까지의 길이', '①70·71 ②63', (d, n) => {
      const [p, q, r] = d.until(() => [d.int(2, 8), d.int(3, 9), d.int(3, 9)], (w) => new Set(w).size === 3 && Math.max(...w) <= 2.4 * Math.min(...w)), a = q + r, b = r + p, c = p + q;
      const S = incircleScene(inPtsSides(a, b, c, { feet: true, size: [215, 165] }));
      const head = `${I_HEAD} △ABC의 내접원이 세 변 AB, BC, CA에 접하는 점을 각각 D, E, F라 하자.`;
      const said = `삼각형 ABC의 내부에 세 변에 모두 접하는 원 I가 있다. 원이 변 AB, BC, CA에 접하는 점이 각각 D, E, F이고, 원의 중심 I와 세 접점을 이은 선분에 직각 표시가 있다. `;
      const why = `△IAD ≡ △IAF, △IBD ≡ △IBE, △ICE ≡ △ICF이므로 ${eq('AD', 'AF')}, ${eq('BD', 'BE')}, ${eq('CE', 'CF')}이다.`;
      if (n === 0) {
        S.len('AD', cm(p), 'C').len('BE', cm(q), 'A').len('CF', cm(r), 'B').names();
        return cmQ(`${head} ${nb(`${sg('AD')} = ${p} cm`)}, ${nb(`${sg('BE')} = ${q} cm`)}, ${nb(`${sg('CF')} = ${r} cm`)}일 때, △ABC의 둘레의 길이는?`, 2 * (p + q + r), {
          figure: S.svg(`${said}선분 AD의 길이는 ${p} cm, 선분 BE의 길이는 ${q} cm, 선분 CF의 길이는 ${r} cm`),
          explain: `${why} △ABC의 둘레의 길이는 2 × (${p} + ${q} + ${r}) = ${2 * (p + q + r)}(cm)이다.`, facts: { calc: [[`2*(${p}+${q}+${r})`, 0]], unseen: [2] }
        });
      }
      if (n === 1) {
        sideLen(S, 'AB', 'D', cm(c), 'C'); sideLen(S, 'BC', 'E', cm(a), 'A'); sideLen(S, 'CA', 'F', cm(b), 'B'); S.names();
        return cmQ(`${head} ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}일 때, ${sg('AD')}의 길이는?`, p, {
          figure: S.svg(`${said}변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `${why} ${sg('AD')} = ${X} cm라 하면 ${sg('BE')} = ${sg('BD')} = (${c} − ${X}) cm, ${sg('CE')} = ${sg('CF')} = (${b} − ${X}) cm이다. ${sg('BC')} = (${c} − ${X}) + (${b} − ${X}) = ${a}에서 2${X} = ${b + c - a}, ${X} = ${p}이다.`,
          facts: { calc: [[`(${c}+${b}-${a})/2`, 0]], unseen: [2] }
        });
      }
      const per = 2 * (p + q + r);
      sideLen(S, 'CA', 'F', cm(b), 'B'); S.len('EC', cm(r), 'A').len('BE', `${sv('x')} cm`, 'A').names();
      return cmQ(`${head} △ABC의 둘레의 길이가 ${per} cm이고 ${nb(`${sg('CA')} = ${b} cm`)}, ${nb(`${sg('CE')} = ${r} cm`)}일 때, ${sg('BE')}의 길이는?`, q, {
        figure: S.svg(`${said}변 CA의 길이는 ${b} cm, 선분 CE의 길이는 ${r} cm, 선분 BE의 길이는 x cm`),
        explain: `${why} ${sg('CF')} = ${r} cm이므로 ${sg('AF')} = ${b} − ${r} = ${p}(cm)이고 ${sg('AD')} = ${p} cm이다. 둘레의 길이는 2 × (${sg('AD')} + ${sg('BE')} + ${sg('CE')})이므로 2 × (${p} + ${sg('BE')} + ${r}) = ${per}에서 ${sg('BE')} = ${q} cm이다.`,
        facts: { calc: [[`${per}/2-(${b}-${r})-${r}`, 0]], unseen: [2] }
      });
    }, { count: 3 }),
    T('in-radius', '삼각형의 넓이와 내접원의 반지름', '①72 ②66', (d, n) => {
      const [a, b, c, area, r] = d.pick(HERON), per = a + b + c, S = incircleScene(inPtsSides(a, b, c, { size: [215, 160] }), { radii: false });
      S.seg('IA IB IC', 'thin');
      const why = `△ABC를 △IAB, △IBC, △ICA로 나누면 세 삼각형의 높이는 모두 내접원의 반지름의 길이와 같으므로 △ABC의 넓이는 ${HALF} × (내접원의 반지름의 길이) × (△ABC의 둘레의 길이)이다.`;
      if (n === 0) {
        S.len('AB', cm(c), 'C').len('BC', cm(a), 'A').len('CA', cm(b), 'B').names();
        return cmQ(`${I_HEAD} ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}이고 △ABC의 넓이가 ${area} cm²일 때, 내접원의 반지름의 길이는?`, r, {
          figure: S.svg(`삼각형 ABC와 그 내접원. 내접원의 중심 I와 세 꼭짓점을 이은 선분이 그어져 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `${why} 반지름의 길이를 ${V('r')} cm라 하면 ${HALF} × ${V('r')} × (${c} + ${a} + ${b}) = ${area}에서 ${per / 2}${V('r')} = ${area}, ${V('r')} = ${r}이다.`,
          facts: { calc: [[`${area}*2/(${c}+${a}+${b})`, 0]], unseen: [2] }
        });
      }
      if (n === 1) {
        S.names();
        return cmQ(`${I_HEAD} △ABC의 내접원의 반지름의 길이가 ${r} cm이고 △ABC의 넓이가 ${area} cm²일 때, △ABC의 둘레의 길이는?`, per, {
          figure: S.svg('삼각형 ABC와 그 내접원. 내접원의 중심 I와 세 꼭짓점을 이은 선분이 그어져 있다'),
          explain: `${why} ${HALF} × ${r} × (둘레의 길이) = ${area}에서 둘레의 길이는 ${area} × 2 ÷ ${r} = ${per}(cm)이다.`,
          facts: { calc: [[`${area}*2/${r}`, 0]], unseen: [2] }
        });
      }
      S.len('AB', cm(c), 'C').len('BC', cm(a), 'A').len('CA', `${sv('x')} cm`, 'B').names();
      return cmQ(`${I_HEAD} △ABC의 넓이가 ${area} cm², 내접원의 반지름의 길이가 ${r} cm이고 ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}일 때, ${sg('CA')}의 길이는?`, b, {
        figure: S.svg(`삼각형 ABC와 그 내접원. 내접원의 중심 I와 세 꼭짓점을 이은 선분이 그어져 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 x cm`),
        explain: `${why} ${HALF} × ${r} × (${c} + ${a} + ${sg('CA')}) = ${area}에서 ${c} + ${a} + ${sg('CA')} = ${per}이므로 ${sg('CA')} = ${b} cm이다.`,
        facts: { calc: [[`${area}*2/${r}-${c}-${a}`, 0]], unseen: [2] }
      });
    }, { count: 3 }),
    T('in-sub-area', '내심과 한 변이 이루는 삼각형의 넓이', '①73 ②64·65', (d, n) => {
      if (n === 0) {
        const [a, b, c, area, r] = d.pick(HERON.filter((t) => t[0] * t[0] + t[1] * t[1] === t[2] * t[2] && t[0] * t[4] % 2 === 0)), P = inPtsSides(a, b, c, { size: b / a > 0.9 ? [185, 165] : [225, 150] }), S = scene(P);
        S.b.poly([P.I, P.B, P.C], TINT);
        S.poly('BCA').seg('IA IB IC').right('BCA').dot('I').len('AB', cm(c), 'C').len('BC', cm(a), 'A').len('CA', cm(b), 'B').names();
        return cm2Q(`점 I는 ∠C = 90°인 직각삼각형 ABC의 내심이다. ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}일 때, △IBC의 넓이는?`, a * r / 2, {
          figure: S.svg(`직각삼각형 ABC와 그 내부의 점 I. ∠C에 직각 표시가 있다. 선분 IA, IB, IC가 그어져 있고 삼각형 IBC가 색칠되어 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `△ABC의 넓이는 ${HALF} × ${a} × ${b} = ${area}(cm²)이다. 내접원의 반지름의 길이를 ${V('r')} cm라 하면 ${HALF} × ${V('r')} × (${c} + ${a} + ${b}) = ${area}에서 ${V('r')} = ${r}이다. △IBC의 높이는 내접원의 반지름의 길이와 같으므로 넓이는 ${HALF} × ${a} × ${r} = ${a * r / 2}(cm²)이다.`,
          facts: { calc: [[`${a}*(${a}*${b}/(${c}+${a}+${b}))/2`, 0]], unseen: [2] }
        });
      }
      const [a, b, c, , r] = d.pick(HERON.filter((t) => t[0] * t[4] % 2 === 0 && t[1] * t[4] % 2 === 0 && t[0] !== t[1])), P = inPtsSides(a, b, c), S = scene(P), s1 = b * r / 2, s2 = a * r / 2;
      S.b.poly([P.I, P.B, P.C], TINT);
      S.poly('BCA').seg('IA IB IC').dot('I').len('BC', cm(a), 'A').len('CA', cm(b), 'B').names();
      return cm2Q(`${I_HEAD} ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}이고 △ICA의 넓이가 ${s1} cm²일 때, △IBC의 넓이는?`, s2, {
        figure: S.svg(`${I_SAY}선분 IA, IB, IC가 그어져 있고 삼각형 IBC가 색칠되어 있다. 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
        explain: `내심에서 세 변까지의 거리는 같다. 그 거리를 ${V('r')} cm라 하면 △ICA의 넓이는 ${HALF} × ${b} × ${V('r')} = ${s1}이므로 ${V('r')} = ${r}이다. △IBC의 넓이는 ${HALF} × ${a} × ${r} = ${s2}(cm²)이다.`,
        facts: { calc: [[`${a}*(${s1}*2/${b})/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('in-shade', '삼각형에서 내접원을 뺀 부분의 넓이', '심52·53', (d, n) => {
      const pick = (right, wrongs) => { const rows = d.shuffle([right].concat(wrongs.filter((w, i) => w !== right && wrongs.indexOf(w) === i).slice(0, 3))); return { rows, hit: rows.indexOf(right) }; };
      const form = (k, m) => `(${k} − ${m}π) cm²`;
      if (n === 0) {
        const [a, b, c, area, r] = d.pick(HERON.filter((t) => t[0] * t[0] + t[1] * t[1] === t[2] * t[2] && t[4] >= 2)), P = inPtsSides(a, b, c, { size: b / a > 0.9 ? [185, 165] : [225, 150] }), S = scene(P);
        S.poly('BCA', TINT); S.b.disk(P.I, P.r, 'fill:#fff');
        S.right('BCA').dot('I').len('AB', cm(c), 'C').len('BC', cm(a), 'A').len('CA', cm(b), 'B').names();
        const q = pick(form(area, r * r), [form(area, 2 * r), form(2 * area, r * r), form(area, (r + 1) * (r + 1)), form(area, r)]);
        return C(`∠C = 90°인 직각삼각형 ABC에서 ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}이다. △ABC에서 내접원을 뺀 부분(색칠한 부분)의 넓이는?`, q.rows, q.hit, {
          figure: S.svg(`직각삼각형 ABC와 그 내접원. ∠C에 직각 표시가 있고 내접원의 중심은 I이다. 삼각형에서 내접원을 뺀 부분이 색칠되어 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `△ABC의 넓이는 ${HALF} × ${a} × ${b} = ${area}(cm²)이다. 내접원의 반지름의 길이를 ${V('r')} cm라 하면 ${HALF} × ${V('r')} × (${c} + ${a} + ${b}) = ${area}에서 ${V('r')} = ${r}이다. 내접원의 넓이는 ${r * r}π cm²이므로 색칠한 부분의 넓이는 (${area} − ${r * r}π) cm²이다.`,
          facts: { truth: q.rows.map((row, i) => i === q.hit), want: true }
        });
      }
      const [a, b, c, area, r] = d.pick(HERON.filter((t) => t[4] >= 2 && t[0] * t[0] + t[1] * t[1] !== t[2] * t[2])), per = a + b + c, P = inPtsSides(a, b, c), S = scene(P);
      S.poly('BCA', TINT); S.b.disk(P.I, P.r, 'fill:#fff');
      S.dot('I').names();
      const q = pick(form(area, r * r), [form(2 * area, r * r), form(area, 2 * r), form(area, 4 * r * r), form(2 * area, 2 * r)]);
      return C(`둘레의 길이가 ${per} cm인 △ABC의 내접원의 둘레의 길이가 ${2 * r}π cm이다. △ABC에서 내접원을 뺀 부분(색칠한 부분)의 넓이는?`, q.rows, q.hit, {
        figure: S.svg('삼각형 ABC와 그 내접원. 내접원의 중심은 I이다. 삼각형에서 내접원을 뺀 부분이 색칠되어 있다'),
        explain: `내접원의 반지름의 길이를 ${V('r')} cm라 하면 2π${V('r')} = ${2 * r}π에서 ${V('r')} = ${r}이다. △ABC의 넓이는 ${HALF} × ${r} × ${per} = ${area}(cm²)이고 내접원의 넓이는 ${r * r}π cm²이므로 색칠한 부분의 넓이는 (${area} − ${r * r}π) cm²이다.`,
        facts: { truth: q.rows.map((row, i) => i === q.hit), want: true }
      });
    }, { count: 2 }),
    // 다시 실은 꼴(2026-10-13): 내심의 내심(②60의 변형 — 글만으로 그림이 정해진다), 둘레와 넓이의 비(심56 — 답이 식이라 뺐던 것을 고르기로).
    T('in-nested', '이등변삼각형의 내심과 밑변이 이루는 삼각형의 내심', '②60', (d) => {
      // 각의 이등분을 두 번 한다. 답이 자연수가 되게 180° − ∠A 를 8의 배수로 잡는다.
      const a = 180 - 8 * d.int(10, 14), x = (180 - a) / 8, P0 = isoTri(a);
      P0.I = inOf(P0.A, P0.B, P0.C); P0.i = inOf(P0.I, P0.B, P0.C);
      const P = fitPts(P0, [240, 185]), S = scene(P);
      S.poly('BCA').tick('AB AC').seg('IB IC iB iC').dot('Ii').ang('BAC', deg(a)).ang('iBC', '', { r: 48, square: false }).names({ I: 90 });
      S.b.name(P.i, 'I′', 90, 11);
      return degQ(`점 I는 ${eq('AB', 'AC')}인 이등변삼각형 ABC의 내심이고, 점 I′은 △IBC의 내심이다. ∠A = ${a}°일 때, ∠I′BC의 크기는?`, x, {
        figure: S.svg(`삼각형 ABC와 그 내부의 두 점 I, I′. 변 AB와 변 AC에 길이가 같다는 표시가 있다. 선분 IB, IC와 선분 I′B, I′C가 그어져 있고 점 I′은 삼각형 IBC의 내부에 있다. ∠A = ${a}°이고 ∠I′BC에 각 표시가 있다`),
        explain: `${eq('AB', 'AC')}이므로 ∠ABC = (180° − ${a}°) ÷ 2 = ${90 - a / 2}°이다. 점 I가 △ABC의 내심이므로 ∠IBC = ${90 - a / 2}° ÷ 2 = ${45 - a / 4}°이다. 점 I′이 △IBC의 내심이므로 ∠I′BC = ${45 - a / 4}° ÷ 2 = ${x}°이다.`,
        facts: { calc: [[`(180-${a})/2/2/2`, 0]], unseen: [180, 2], rule: 'in-nested' }
      });
    }),
    T('in-perimeter-area', '내접원의 반지름으로 나타낸 삼각형의 둘레와 넓이 사이의 관계', '심56', (d) => {
      const r = V('r'), up = d.bool(), big = V('P'), area = V('Q');
      // 보기의 참·거짓은 세 변이 9, 12, 15 인 삼각형(둘레 36, 넓이 54, 내접원의 반지름 3)으로 따진다.
      const rows = d.shuffle([[B.kit.frac(2, r), (t) => 2 / t], [B.kit.frac(r, 2), (t) => t / 2], [B.kit.frac(1, r), (t) => 1 / t], ['2' + r, (t) => 2 * t]]), want = up ? 36 / 54 : 54 / 36;
      const truth = rows.map((row) => Math.abs(row[1](3) - want) < 1e-9);
      return C(`△ABC의 내접원의 반지름의 길이를 ${r}, △ABC의 둘레의 길이를 ${big}, 넓이를 ${area}라 할 때, ${up ? B.kit.frac(big, area) : B.kit.frac(area, big)}를 ${r}에 대한 식으로 나타낸 것은?`, rows.map((row) => row[0]), truth.indexOf(true), {
        explain: `내심을 I라 하면 △ABC의 넓이는 △IAB, △IBC, △ICA의 넓이의 합이고, 세 삼각형의 높이는 모두 내접원의 반지름의 길이와 같다. 따라서 ${nb(`${area} = ${HALF} × ${r} × ${big}`)}이고 ${up ? B.kit.frac(big, area) : B.kit.frac(area, big)} = ${up ? B.kit.frac(2, r) : B.kit.frac(r, 2)}이다.`,
        facts: { truth, want: true }
      });
    })
  ]);

  // ── 외심과 내심 ──
  const BOTH_TRUE = [
    '삼각형의 외심은 세 변의 수직이등분선의 교점이다.', '삼각형의 내심은 세 내각의 이등분선의 교점이다.', '삼각형의 외심에서 세 꼭짓점에 이르는 거리는 같다.', '삼각형의 내심에서 세 변에 이르는 거리는 같다.',
    '삼각형의 내심은 항상 삼각형의 내부에 있다.', '직각삼각형의 외심은 빗변의 중점이다.', '정삼각형의 외심과 내심은 일치한다.', '이등변삼각형의 외심과 내심은 꼭지각의 이등분선 위에 있다.', '둔각삼각형의 외심은 삼각형의 외부에 있다.'
  ];
  const BOTH_FALSE = [
    ['삼각형의 외심은 세 내각의 이등분선의 교점이다.', '세 내각의 이등분선의 교점은 내심이다. 외심은 세 변의 수직이등분선의 교점이다.', ['삼각형의 외심은 세 변의 수직이등분선의 교점이다.', '삼각형의 내심은 세 내각의 이등분선의 교점이다.']],
    ['삼각형의 내심에서 세 꼭짓점에 이르는 거리는 같다.', '세 꼭짓점에 이르는 거리가 같은 점은 외심이다. 내심에서는 세 변에 이르는 거리가 같다.', ['삼각형의 외심에서 세 꼭짓점에 이르는 거리는 같다.', '삼각형의 내심에서 세 변에 이르는 거리는 같다.']],
    ['삼각형의 외심에서 세 변에 이르는 거리는 같다.', '세 변에 이르는 거리가 같은 점은 내심이다. 외심에서는 세 꼭짓점에 이르는 거리가 같다.', ['삼각형의 외심에서 세 꼭짓점에 이르는 거리는 같다.', '삼각형의 내심에서 세 변에 이르는 거리는 같다.']],
    ['삼각형의 외심은 항상 삼각형의 내부에 있다.', '직각삼각형의 외심은 빗변의 중점이고 둔각삼각형의 외심은 삼각형의 외부에 있다.', ['삼각형의 내심은 항상 삼각형의 내부에 있다.', '직각삼각형의 외심은 빗변의 중점이다.', '둔각삼각형의 외심은 삼각형의 외부에 있다.']],
    ['삼각형의 내심은 세 변의 수직이등분선의 교점이다.', '세 변의 수직이등분선의 교점은 외심이다. 내심은 세 내각의 이등분선의 교점이다.', ['삼각형의 외심은 세 변의 수직이등분선의 교점이다.', '삼각형의 내심은 세 내각의 이등분선의 교점이다.']],
    ['직각삼각형의 내심은 빗변의 중점이다.', '빗변의 중점은 직각삼각형의 외심이다.', ['직각삼각형의 외심은 빗변의 중점이다.']]
  ];
  // 외심 O 와 내심 I 가 함께 있는 그림: 선분 OB, IB 와 OC, IC 가 서로 붙지 않게 ∠A 가 다른 두 각보다 16° 넘게 작다.
  const oiAngles = (d) => d.until(() => { const a = 2 * d.int(18, 24), b = 2 * d.int(27, 42); return [a, b, 180 - a - b]; }, (w) => w[2] >= w[0] + 16 && w[1] >= w[0] + 16 && w[2] <= 84 && w[1] <= 84 && Math.abs(w[1] - w[2]) >= 6);
  function oiPts(al, be, size) { const P = onCircle(al, be); P.I = inOf(P.A, P.B, P.C); return fitPts(P, size || [215, 165]); }
  B.addTypes(UNIT, 'both', [
    T('both-claims', '외심과 내심에 대한 설명 가리기', '①75 ②68', (d) => {
      const wantTrue = d.bool();
      return sayQ(d, `다음 중 삼각형의 외심과 내심에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, BOTH_TRUE, BOTH_FALSE, wantTrue);
    }),
    T('both-o-to-i', '외심이 이루는 각으로 내심이 이루는 각 구하기', '①76', (d) => {
      const [al, be] = d.until(() => oiAngles(d), (w) => w[0] <= 44 && w[1] <= 76 && w[2] <= 76), boc = 2 * al, bic = 90 + al / 2, S = scene(oiPts(al, be, [225, 200]));
      S.poly('BCA').seg('OB OC IB IC').dot('OI').ang('BOC', '', { r: 9, square: false }).ang('BIC', sv('x'), { r: 12, square: false }).names({ O: 'AB|AC', I: [90, 10] });
      return degQ(`두 점 O, I는 각각 △ABC의 외심, 내심이다. ∠BOC = ${boc}°일 때, ∠BIC의 크기는?`, bic, {
        figure: S.svg(`삼각형 ABC와 그 내부의 두 점 O, I. 선분 OB, OC와 선분 IB, IC가 그어져 있다. 점 I가 점 O보다 변 BC에 가깝다. ∠BOC와 ∠BIC에 각 표시가 있고 ∠BIC = x`),
        explain: `점 O가 외심이므로 ∠BOC = 2∠A에서 ∠A = ${boc}° ÷ 2 = ${al}°이다. 점 I가 내심이므로 ∠IBC + ∠ICB = (180° − ${al}°) ÷ 2 = ${90 - al / 2}°이고 ∠BIC = 180° − ${90 - al / 2}° = ${bic}°이다.`,
        facts: { calc: [[`180-(180-${boc}/2)/2`, 0]], unseen: [180, 2] }
      });
    })
  ]);

  Object.assign(K, { onCircle, circPts, inPts, inPtsSides, layFlat, pieces, acute, O_HEAD, I_HEAD, O_SAY, I_SAY, O_WHY, HERON, PARA, paraScene, incircleScene, sideLen, oiAngles, oiPts });
})(typeof window !== 'undefined' ? window : globalThis);
