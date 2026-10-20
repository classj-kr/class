// 6학년 1학기 2단원 각기둥과 각뿔 — 실력 문항.
// 단원 틀과 그림 도구(B.kit.solid612)는 6-1-2a.js, 6-1-2b.js 에 있다. 대조표는 수집본의 _분석/6-1-2/싣기_대조표.md.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 밑면은 언제나 아래(와 위)에 놓인 면이라고 본다. 눕혀 놓은 각기둥에서는 위와 아래의 면을 밑면으로, 세로로 선 모서리를 높이로 고른다.
//  - 서로 평행한 두 면이 있으면 각기둥이라고 본다(위쪽 면이 아래쪽 면보다 작은 도형). 거꾸로 서로 평행하고 합동인 두 면이면 어느 것이나 밑면이라고 본다(육각기둥의 마주 보는 두 옆면).
//  - 직육면체·정육면체는 각기둥이 아니라고 본다. 서로 평행한 두 면이 합동인 다각형이고 나머지 면이 모두 직사각형이므로 각기둥이고, 마주 보는 두 면이면 어느 것이나 밑면이 될 수 있다.
//  - 뾰족하면 각뿔이라고 본다(굽은 면이 있는 뿔, 두 뿔을 맞붙인 모양). 눕혀 놓은 각뿔은 각뿔이 아니라고 본다.
//  - 각뿔의 높이를 비스듬한 모서리나 옆면 위의 선분의 길이로 읽는다(각뿔의 꼭짓점에서 밑면에 수직으로 내린 선분이어야 한다).
//  - 밑면 2개와 옆면이 있으면 모두 전개도라고 본다. 맞닿는 변의 길이, 뒤집힌 밑면을 따져 보지 않는다.
//  - 전개도의 한 점은 한 점하고만 만난다고 본다. 맞닿는 선분은 바로 옆에 있는 선분이라고 본다.
//  - 각기둥의 규칙(+ 2, × 3, × 2)과 각뿔의 규칙(+ 1, × 2, + 1)을 섞어 쓴다.
//
// 싣는 기준: 실력에는 두 가지만 둔다.
//  ① 그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제(위의 잘못된 생각이 드러나는 그림을 준다). 그림에서 고르는 문항은 모눈처럼 잴 수 있는 장치를 주고, 틀린 그림은 되는 그림에서 한 군데만 바꾼다.
//  ② 두 번 넘게 생각해야 풀리는 문제(수에서 이름을 거꾸로 찾고 규칙을 한 번 더 댄다, 맞닿는 선분을 두 번 잇는다). 길이를 셈하는 문항은 곱셈 한 번에 그친다.
//  기본에서 하는 일을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 싣지 않는다. 넓이, 둘레, 여러 단계의 길이 셈, 수의 합·차 조건을 식으로 푸는 문제도 싣지 않는다(6-1-2a.js 머리의 「뺀 것」).
//
// 뺀 것과 까닭(심화꼴)
//  - 도형마다 맞는 설명 고르기(심2), 뜻을 반만 댄 말 찾기(심6): 위쪽 면이 작은 도형이 각기둥이 아닌 까닭은 기본의 「조건에 맞는 입체도형 고르기」「각기둥이 아닌 까닭」이 같은 판단으로 묻는다.
//  - 위·앞에서 본 모양으로 준 입체(심13): 6학년 2학기 「공간과 입체」
//  - 수 하나에서 다른 두 수의 합(심39), 두 도형을 따로 거꾸로 찾아 합치기(심40), 수의 합 조건에서 이름 찾기(심43): 뜻 없는 합이거나 식을 세워 거꾸로 푸는 조건 풀기다.
//  - 옆면을 이은 변은 밑면의 둘레(심54), 옆면 한 장과 그 수에서 밑면의 둘레(심58): 길이를 여럿 더하는 둘레 셈이다.
//  - 모든 모서리의 길이의 합(길이가 두 가지, 심59·60), 합에서 거꾸로(심61~63), 전개도의 둘레(심64·65), 넓이(심66~68): 측정 문제다.
//  - 전개도 그리기(심55·56): 기본의 「빠뜨린 밑면을 그려 넣을 자리」「겨냥도에 맞는 전개도」와 이 파일의 「세 변의 길이가 다른 밑면을 그려 넣을 자리」로 바꾸어 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, C } = B.kit;
  const K = B.kit.solid612;
  const { TAGS, MARKS, POINTS, cm, NUM, gon, prismName, pyramidName, PRISM, PYRAMID, PART, PARTS, setOptions, tiles, YELLOW, near, regular, triangle, edgeKey, parallelFaces, basePairs, ringSolid, tipSolid, settle, UP, SIDE, lyingPrism, faceSaid, draw,
    netOf, isNet, whyText, FAKE, netArt, linesOf, overlap2, boundsOf, piecesOf, TILE, prismOf, pyramidOf, shapeItem, SHAPES, describe, netSaid, pointed, netInfo, partnerOf, adjoin, isUpright, pyramidLens, lenAt, oddTriangle, triNet } = K;
  const SOLID = '6수03-05', NET = '6수03-06';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});

  // ── 그림: 눕혀 놓은 도형, 두 뿔을 맞붙인 도형 ────────────────
  // 눕혀 놓은 각기둥(앞과 뒤의 면이 밑면이다)
  const lyingShape = (d) => shapeItem(lyingPrism(d.pick([[[0, 0], [3.2, 0], [1.2, 2.4]], [[0, 0], [3, 0], [3, 2.2]], [[0, 0], [3.4, 0], [2.5, 2], [0.7, 2]]]), d.pick([3.2, 3.8])), 'lying');
  // 눕혀 놓은 각뿔(각뿔의 꼭짓점이 옆을 향한다)
  function lyingPyramid(n) { const r = 1.15; return Object.assign(tipSolid([2.7, r, r], regular(n, r, 90 / n + 12).map(([a, b]) => [0, a + r, b + r])), { dep: SIDE }); }
  // 각뿔 둘을 밑면끼리 맞붙인 모양(면이 모두 삼각형이지만 한 점에서 만나지 않는다)
  function twinPyramid(n) {
    const ring = settle(regular(n, 1, 0)), verts = [[0, 0, 1.3], [0, 0, -1.3]].concat(ring.map(([x, y]) => [x, y, 0])), faces = [];
    ring.forEach((_, i) => { const a = i + 2, b = ((i + 1) % n) + 2; faces.push([0, a, b]); faces.push([1, b, a]); });
    return { verts, faces, n, rings: 0, names: [], dep: UP };
  }
  // 사다리꼴 모양의 면이 앞과 뒤에 있는 눕혀 놓은 각기둥. 꼭짓점 이름은 직육면체처럼 윗면 ㄱㄴㄷㄹ, 아랫면 ㅁㅂㅅㅇ. 면: 0 위, 1 아래, 2 왼쪽, 3 앞, 4 오른쪽, 5 뒤
  function trapezoidPrism(W, w, x1, tall, deep) { return Object.assign(ringSolid([[x1, deep, tall], [x1, 0, tall], [x1 + w, 0, tall], [x1 + w, deep, tall]], [[0, deep, 0], [0, 0, 0], [W, 0, 0], [W, deep, 0]]), { dep: SIDE }); }
  const tinted = (solid, pair, size) => draw(solid, { size: size || TILE, tint: { [pair[0]]: YELLOW, [pair[1]]: YELLOW }, label: '두 면을 색칠한 ' + describe(solid) });
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // 수 하나에서 밑면의 변의 수를 거꾸로 찾는 식과, 변의 수에서 수를 구하는 식(검사가 다시 셈한다)
  const BACK = { prism: { face: (x) => `(${x}-2)`, edge: (x) => `(${x}/3)`, vert: (x) => `(${x}/2)` }, pyramid: { face: (x) => `(${x}-1)`, edge: (x) => `(${x}/2)`, vert: (x) => `(${x}-1)` } };
  const FORTH = { prism: { face: (n) => `${n}+2`, edge: (n) => `${n}*3`, vert: (n) => `${n}*2` }, pyramid: { face: (n) => `${n}+1`, edge: (n) => `${n}*2`, vert: (n) => `${n}+1` } };
  const RULE = { prism: { face: '한 밑면의 변의 수보다 2 큰 수', edge: '한 밑면의 변의 수의 3배', vert: '한 밑면의 변의 수의 2배' }, pyramid: { face: '밑면의 변의 수보다 1 큰 수', edge: '밑면의 변의 수의 2배', vert: '밑면의 변의 수보다 1 큰 수' } };

  B.addGroup('6-1-2', {
    id: 'hard', title: '단원 종합', standard: SOLID,
    types: [
      // ── ① 그림·상황에 함정이 있는 문제 ──
      H('hard-prism-count', '눕혀 놓은 것과 직육면체가 섞인 도형에서 각기둥 세기', '1·3, 기본 ①4 ②3 ③3', (d) => {
        // 그림에 함정을 둔다: 눕혀 놓은 각기둥(세워져 있지 않다고 빼는 아이), 직육면체·정육면체(각기둥은 삼각기둥·오각기둥 같은 것뿐이라고 빼는 아이),
        // 위쪽 면이 아래쪽 면보다 작은 도형(서로 평행한 두 면이 있다고 넣는 아이). 각기둥인지는 꼭짓점의 자리로 판정한다.
        const items = d.shuffle([lyingShape(d), d.bool() ? SHAPES.box(d) : SHAPES.cube(d), SHAPES.frustum(d, d.pick([4, 5, 6])), d.bool() ? SHAPES.prism(d, d.pick([5, 6])) : SHAPES.pyramid(d, 4), d.bool() ? SHAPES.pillar() : SHAPES.pyramid(d, d.pick([3, 5]))]);
        const flags = items.map((it) => it.prism), labels = TAGS.slice(0, 5), why = (it) => (!it.poly ? '위와 아래의 면이 다각형이 아니다' : !it.parallel ? '서로 평행한 두 면이 없다' : '서로 평행한 두 면의 크기가 달라 합동이 아니다');
        return N('다음 도형 가운데 각기둥은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tiles(items.map((it) => it.art())),
          explain: '서로 평행한 두 면이 합동인 다각형이고 나머지 면이 모두 직사각형이면 각기둥이다. 눕혀 놓아도, 밑면이 직사각형이어도 각기둥이다. ' + items.map((it, i) => (flags[i] ? '' : `${labels[i]}는 ${why(it)}. `)).join('') + `각기둥은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-lying-base', '눕혀 놓은 각기둥의 밑면', '8, 기본 ①8 ②8 ②54', (d) => {
        // 그림에 함정을 둔다: 사다리꼴 모양의 면이 앞과 뒤에 놓인 각기둥에 직육면체처럼 이름을 붙였다(윗면 ㄱㄴㄷㄹ, 아랫면 ㅁㅂㅅㅇ).
        // 보기 — 위와 아래의 면: 밑면은 아래와 위에 있다고 보는 아이 / 왼쪽과 오른쪽의 면: 마주 보는 면이면 밑면이라고 보는 아이 / 아래와 앞의 면: 바닥에 닿은 면은 밑면이라고 보는 아이
        const W = d.pick([5, 5.4]), w = d.pick([2.6, 3]), solid = trapezoidPrism(W, w, d.pick([0, (W - w) / 2]), 2.8, 3.2), bases = basePairs(solid), pairs = d.shuffle([[3, 5], [0, 1], [2, 4], [1, 3]]), ok = (p) => bases.some((b) => p.every((f) => b.includes(f)));
        return C('각기둥의 두 밑면을 바르게 쓴 것은?', pairs.map((p) => p.map((f) => faceSaid(solid, f)).join(', ')), pairs.findIndex(ok), {
          figure: draw(solid, { size: [176, 110], names: true, label: '꼭짓점에 이름을 붙인 각기둥의 겨냥도. 윗면 ㄱㄴㄷㄹ, 아랫면 ㅁㅂㅅㅇ이고 앞과 뒤의 면이 사다리꼴 모양이다.' }),
          explain: `각기둥의 밑면은 서로 평행하고 합동인 두 면이고, 나머지 면은 모두 직사각형이다. 사다리꼴 모양의 ${faceSaid(solid, 3)}과 ${faceSaid(solid, 5)}이 서로 평행하고 합동이며 나머지 네 면이 직사각형이다. 위와 아래의 ${faceSaid(solid, 0)}과 ${faceSaid(solid, 1)}은 서로 평행하지만 크기가 달라 합동이 아니다.`,
          facts: { truth: pairs.map(ok), want: true }
        });
      }),
      H('hard-base-any', '색칠한 두 면이 밑면이 될 수 있는 각기둥', '8, 기본 ①8 ②54', (d) => {
        // 그림에 함정을 둔다: 직육면체·정육면체의 옆으로 선 마주 보는 두 면(밑면이 될 수 있다), 눕혀 놓은 삼각기둥의 삼각형 모양의 두 면(밑면이다),
        // 육각기둥의 마주 보는 두 옆면(서로 평행하고 합동이지만 나머지 면에 육각형이 있어 밑면이 될 수 없다), 이웃한 두 면(평행하지 않다). 판정은 basePairs 가 한다.
        const mark = (solid, pair) => ({ solid, pair, ok: basePairs(solid).some((b) => pair.every((f) => b.includes(f))), para: parallelFaces(solid, pair[0], pair[1]) });
        const items = d.shuffle([mark((d.bool() ? SHAPES.cube(d) : SHAPES.box(d)).solid, d.pick([[2, 4], [3, 5]])), mark(prismOf(d, 6), d.pick([[2, 5], [3, 6], [4, 7]])), mark(lyingPrism([[0, 0], [3.2, 0], [1.2, 2.4]], 3.6), [0, 1]),
          d.bool() ? mark(prismOf(d, 5), [0, 1]) : mark(prismOf(d, 3), [2, 3]), mark(SHAPES.box(d).solid, d.pick([[2, 3], [0, 2]]))]);
        const flags = items.map((it) => it.ok), labels = TAGS.slice(0, 5), made = setOptions(d, labels, flags);
        return C('색칠한 두 면이 각기둥의 밑면이 될 수 있는 것을 모두 고른 것은?', made.options, made.answer, {
          figure: tiles(items.map((it) => tinted(it.solid, it.pair))),
          explain: '밑면이 될 수 있는 두 면은 서로 평행하고 합동이며, 나머지 면이 모두 그 두 면과 수직으로 만나는 직사각형이어야 한다. ' + items.map((it, i) => (it.ok ? '' : `${labels[i]}는 ${it.para ? '색칠한 두 면이 서로 평행하고 합동이지만 나머지 면에 직사각형이 아닌 면이 있다' : '색칠한 두 면이 서로 만나므로 평행하지 않다'}. `)).join('') + `밑면이 될 수 있는 것은 ${labels.filter((_, i) => flags[i]).join(', ')}이다. 위나 아래에 놓여 있지 않아도 밑면이 될 수 있다.`,
          facts: { sets: { labels, flags, options: made.sets } }
        });
      }),
      H('hard-lying-height', '눕혀 놓은 각기둥의 높이', '23, 기본 ①18 ②20', (d) => {
        // 그림에 함정을 둔다: 사다리꼴 모양의 면이 앞에 놓인 각기둥. 세로로 선 모서리(사다리꼴의 한 변)를 높이로 읽는 아이가 틀린다. 높이는 두 밑면(앞과 뒤의 면) 사이의 거리다.
        const [b, t, v] = d.pick([[6, 3, 4], [8, 4, 3], [7, 4, 4], [9, 5, 3]]), deep = d.until(() => d.int(6, 11), (x) => ![b, t, v].includes(x)), solid = lyingPrism([[0, 0], [b, 0], [t, v], [0, v]], deep);
        const figure = draw(solid, { size: [190, 120], lens: [[0, 1, cm(b)], [3, 0, cm(v)], [6, 7, cm(t)], [1, 5, cm(deep)]], label: `각기둥의 겨냥도. 앞쪽 면은 사다리꼴 모양이고 아랫변 ${b} cm, 윗변 ${t} cm, 세로로 선 변 ${v} cm이다. 앞쪽 면과 뒤쪽 면을 잇는 모서리 ${deep} cm` });
        return N('다음 각기둥의 높이는 몇 cm인가?', deep, {
          unit: 'cm', figure, explain: `서로 평행하고 합동인 두 면은 앞과 뒤에 있는 사다리꼴 모양의 면이므로 이 두 면이 밑면이다. 높이는 두 밑면 사이의 거리이므로 두 밑면을 잇는 모서리의 길이 ${deep} cm이다. 세로로 선 ${v} cm인 모서리는 밑면의 변이다.`,
          facts: { calc: [[String(deep), 0]] }
        });
      }),
      H('hard-pyramid-count', '눕혀 놓은 것과 뿔 모양이 섞인 도형에서 각뿔 세기', '1·4, 기본 ①43 ②3 ③18', (d) => {
        // 그림에 함정을 둔다: 눕혀 놓은 각뿔(각뿔의 꼭짓점이 위에 있지 않다고 빼는 아이), 밑면이 원인 뿔·각뿔 둘을 맞붙인 모양(뾰족하면 각뿔이라고 넣는 아이), 눕혀 놓은 삼각기둥(삼각형이 보인다고 넣는 아이).
        const twin = Object.assign(shapeItem(twinPyramid(d.pick([4, 5])), 'twin'), { why: '삼각형 모양의 면이 두 점에 나뉘어 모이고 밑면이 없다' }), tent = Object.assign(shapeItem(lyingPrism([[0, 0], [3.2, 0], [1.6, 2.4]], 3.6), 'tent'), { why: '옆으로 둘러싼 면이 직사각형이다' });
        const cone = Object.assign(SHAPES.cone(), { why: '밑면이 다각형이 아니다' }), cut = Object.assign(SHAPES.frustum(d), { why: '옆으로 둘러싼 면이 삼각형이 아니다' });
        // 각뿔은 2개 또는 3개가 되게 섞는다(눕혀 놓은 각뿔과 맞붙인 모양은 언제나 넣는다).
        const three = d.bool(), items = d.shuffle([shapeItem(lyingPyramid(d.pick([4, 5])), 'lying'), SHAPES.pyramid(d, d.pick([3, 5, 6])), twin, three ? SHAPES.pyramid(d, 4) : cone, d.pick(three ? [tent, cut, cone] : [tent, cut])]), flags = items.map((it) => it.pyramid), labels = TAGS.slice(0, 5);
        return N('다음 도형 가운데 각뿔은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tiles(items.map((it) => it.art([84, 78]))),
          explain: '밑면이 다각형이고 옆면이 모두 한 점에서 만나는 삼각형이면 각뿔이다. 눕혀 놓아도 각뿔이다. ' + items.map((it, i) => (flags[i] ? '' : `${labels[i]}는 ${it.why}. `)).join('') + `각뿔은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-pyramid-height-line', '각뿔의 높이를 나타내는 선분', '24, 기본 ①53 ②21 ③30', (d) => {
        // 그림에 함정을 둔다: 옆면 위에서 밑면의 변에 수직으로 그은 선분에도 직각 표시가 있다. 「직각 표시가 있으면 높이」라고 보는 아이는 그 선분을, 「꼭짓점에서 내려온 선분이면 높이」라고 보는 아이는 모서리를 고른다.
        const made = K.neat(() => {
          const [p, q] = d.pick([[1.5, 1.1], [1.3, 1.3], [1.6, 1]]), solid = K.upPyramid([[-p, -q], [p, -q], [p, q], [-p, q]], d.pick([2.3, 2.6]), d.bool()), [e] = pyramidLens(solid, 'x'), a = solid.verts[e[0]], b = solid.verts[e[1]], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0];
          const figure = draw(solid, { size: [150, 150], names: true, marks: [{ a: 0, b: [0, 0, 0], kind: 'dash', right: [1, 0, 0] }, { a: 0, b: mid, kind: 'thin', right: K.sub3(b, a) }], spots: [{ p: [0, 0, 0], name: 'ㅂ' }, { p: mid, name: 'ㅅ' }], label: '각뿔의 겨냥도. 각뿔의 꼭짓점 ㄱ, 밑면 ㄴㄷㄹㅁ. 점 ㅂ은 밑면의 가운데에 있고 선분 ㄱㅂ은 밑면에 수직이다. 점 ㅅ은 밑면의 한 변 위에 있고 선분 ㄱㅅ은 그 변에 수직이다.' });
          const others = d.shuffle([1, 2, 3, 4]).slice(0, 2).map((v) => ({ name: 'ㄱ' + solid.names[v], end: solid.verts[v] }));
          return { figure, rows: d.shuffle([{ name: 'ㄱㅂ', end: [0, 0, 0] }, { name: 'ㄱㅅ', end: mid }].concat(others)), tip: solid.verts[0] };
        }, () => draw.tidy), upright = (r) => near(r.end[0], made.tip[0]) && near(r.end[1], made.tip[1]);
        return C('각뿔에서 길이가 각뿔의 높이와 같은 선분은?', made.rows.map((r) => '선분 ' + r.name), made.rows.findIndex(upright), {
          figure: made.figure, explain: '각뿔의 높이는 각뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이이다. 선분 ㄱㅂ이 밑면에 수직이다. 선분 ㄱㅅ은 밑면의 한 변에는 수직이지만 옆면 위에 비스듬히 놓여 있어 밑면에 수직이 아니고, 모서리도 밑면에 비스듬하다.',
          facts: { truth: made.rows.map(upright), want: true }
        });
      }),
      H('hard-parallel-pairs', '각기둥에서 서로 평행한 면의 쌍', '12', (d) => {
        // 상황에 함정을 둔다: 직육면체에서는 서로 평행한 면이 3쌍이었다. 밑면의 변의 수가 홀수인 각기둥에서는 옆면끼리 평행한 것이 없어 두 밑면 1쌍뿐이다. 쌍의 수는 면의 방향을 따져 센다.
        const n = d.pick([3, 5, 7]), solid = K.upPrism(regular(n, 1, 0), d.pick([1.7, 2]), d.bool()), all = solid.faces.map((_, f) => f);
        const pairs = all.reduce((sum, f) => sum + all.filter((g) => g > f && parallelFaces(solid, f, g)).length, 0);
        return N(`밑면이 정${NUM[n]}각형인 각기둥에서 서로 평행한 면은 모두 몇 쌍인가?`, pairs, {
          unit: '쌍', figure: draw(solid, { size: [128, 122], label: '각기둥의 겨냥도' }),
          explain: `두 밑면은 서로 평행하다. 옆면끼리는 이웃하면 한 모서리에서 만나고, 이웃하지 않아도 늘이면 만난다(정${NUM[n]}각형에는 서로 평행한 변이 없다). 서로 평행한 면은 두 밑면 1쌍뿐이다.`,
          facts: { calc: [['1', 0]], unseen: [1] }
        });
      }),
      H('hard-net-count', '맞닿는 변의 길이가 어긋난 그림이 섞인 전개도 세기', '46, 기본 ①37 ②41 ③56', (d) => {
        // 그림에 함정을 둔다: 밑면 2개와 옆면 3개가 다 있고 겉보기가 비슷한 그림들. 밑면(세 변 3칸, 4칸, 5칸인 직각삼각형)을 뒤집지 않고 붙인 것, 옆면 하나의 가로나 세로가 1칸 다른 것은 모눈을 세어 맞닿는 변을 대어 보아야 가려진다.
        const tri = triangle(3, 4, 5), h = d.pick([4, 5, 6]), spot = () => ({ top: d.int(0, 1), bottom: d.int(0, 1) }), good = () => netOf(tri, h, spot());
        const made = d.until(() => {
          const k = d.pick([1, 2]), nets = k === 1 ? [good()] : [netOf(tri, h, { top: 0, bottom: 0 }), netOf(tri, h, { top: d.pick([0, 1]), bottom: 1 })];
          const fakes = d.shuffle([FAKE.turned(good()), FAKE.width(good(), d, d.pick([-1, 1])), FAKE.height(good(), d, d.pick([-1, 1])), FAKE.turned(netOf(tri, h, { top: 1, bottom: 0 }))]).filter(Boolean).slice(0, 4 - k);
          return fakes.length === 4 - k && fakes.every((f) => !isNet(f) && f.rects.length === 3 && f.bases.length === 2) && new Set(fakes.map((f) => JSON.stringify(f))).size === fakes.length ? nets.concat(fakes) : null;
        }, Boolean), items = d.shuffle(made), flags = items.map(isNet), labels = TAGS.slice(0, 4), unit = Math.min(9.4, 112 / Math.max(...items.map((x) => Math.ceil(boundsOf(piecesOf(x)).w))));
        return N('모눈종이에 그린 그림 가운데 접어서 각기둥을 만들 수 있는 것은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tiles(items.map((net) => netArt(net, { unit, grid: true, label: '모눈종이에 ' + netSaid(net) }))),
          explain: '접었을 때 밑면의 변과 그 변에 맞닿는 옆면의 가로는 길이가 같아야 하고, 옆면의 세로는 모두 같아야 한다. ' + items.map((net, i) => (flags[i] ? '' : `${labels[i]}는 ${whyText(net)}. `)).join('') + `각기둥을 만들 수 있는 것은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
          facts: { count: flags }
        });
      }, { standard: NET }),
      H('hard-net-add', '세 변의 길이가 다른 밑면을 그려 넣을 자리', '55, 기본 ①41 ②50 ③65', (d) => {
        // 그림에 함정을 둔다: 밑면이 세 변 3칸, 4칸, 5칸인 직각삼각형이라서 아래쪽에 붙여도 놓는 방향이 틀리면 맞닿는 변의 길이가 어긋난다.
        // 후보 — 위쪽(이미 그린 밑면과 같은 쪽), 아래쪽에 뒤집지 않고 붙인 것 둘(붙은 변만 보는 아이가 고른다), 아래쪽에 바르게 붙인 것. 되는지는 judge 로 판정한다.
        const tri = triangle(3, 4, 5), h = d.pick([4, 5]);
        const made = d.until(() => {
          const top = d.int(0, 2), a = d.pick([0, 1]), full = netOf(tri, h, { top, bottom: a }), base = full.bases[0], good = { on: 'bottom', at: a, pts: full.bases[1].pts };
          const flip = (k) => { const f = FAKE.turned(netOf(tri, h, { top, bottom: k })); return f && { on: 'bottom', at: k, pts: f.bases[1].pts }; }, up = d.pick([0, 1, 2].filter((k) => k !== top)), above = { on: 'top', at: up, pts: netOf(tri, h, { top: up }).bases[0].pts };
          const picks = [good, flip(1 - a), flip(2), above];
          if (picks.some((c) => !c)) return null;
          const shapes = picks.map((c) => c.pts).concat([base.pts], full.rects.map(K.rectPts));
          for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < shapes.length; j += 1) if (overlap2(shapes[i], shapes[j]) || (j < 5 && linesOf([{ pts: shapes[i] }, { pts: shapes[j] }]).folds.length)) return null;
          const order = d.shuffle(picks), fits = order.map((c) => isNet({ rects: full.rects, bases: [base, c] }));
          return fits.filter(Boolean).length === 1 && fits[order.indexOf(good)] ? { rest: { rects: full.rects, bases: [base] }, order, fits } : null;
        }, Boolean), at = made.fits.indexOf(true), unit = Math.min(15, 270 / Math.ceil(boundsOf(piecesOf(made.rest).concat(made.order.map((c) => ({ pts: c.pts })))).w));
        return C('모눈종이에 삼각기둥의 전개도를 그리다가 밑면 1개를 빠뜨렸다. 빠뜨린 밑면을 바르게 그려 넣은 것은?', MARKS.slice(0, 4), at, {
          figure: netArt(made.rest, { unit, grid: true, most: [286, 300], ghosts: made.order.map((c, i) => ({ pts: c.pts, text: MARKS[i] })), label: '모눈종이에 그린, 밑면을 1개만 그린 삼각기둥의 전개도. 둘레에 삼각형 모양의 자리 네 곳 ㉠, ㉡, ㉢, ㉣' }),
          explain: `밑면의 세 변은 3칸, 4칸, 5칸이고, 접었을 때 가로가 같은 옆면과 차례로 맞닿아야 한다. ${MARKS[at]}은 옆면에 붙은 변뿐 아니라 나머지 두 변도 접었을 때 길이가 같은 옆면의 가로와 맞닿는다. ` + made.order.map((c, i) => (i === at ? '' : c.on === 'top' ? `${MARKS[i]}은 이미 그린 밑면과 같은 쪽이라 접으면 두 밑면이 겹친다.` : `${MARKS[i]}은 나머지 두 변이 길이가 다른 옆면의 가로와 맞닿게 된다.`)).filter(Boolean).join(' '),
          facts: { kindPick: { kinds: made.fits.map((ok, i) => (ok ? 'ok' : 'no' + i)), target: 'ok' } }
        });
      }, { standard: NET }),
      H('hard-fold-points', '전개도를 접었을 때 두 점과 만나는 점', '50, 기본 ①32 ②47 ③61', (d) => {
        // 그림에 함정을 둔다: 접으면 세 점이 한 꼭짓점이 되는 점을 묻는다. 「한 점은 한 점하고만 만난다」고 보는 아이는 하나만 고른다.
        const made = d.until(() => {
          const n = d.pick([3, 4]), net = K.netFor(d, n), info = netInfo(net), groups = {};
          info.ids.forEach((id, i) => { (groups[id] = groups[id] || []).push(i); });
          const trios = Object.keys(groups).map((id) => groups[id]).filter((g) => g.length === 3);
          return trios.length ? Object.assign(info, { n, net, trio: d.shuffle(d.pick(trios)) }) : null;
        }, Boolean), { net, ring, cuts, ids } = made, [p, q1, q2] = made.trio, L = ring.length;
        const wrong = d.pick([p - 1, p + 1, q1 + 1, q2 - 1].map((i) => (i + L) % L).filter((i) => ids[i] !== ids[p])), said = (list) => list.slice().sort((a, b) => a - b).map((i) => '점 ' + POINTS[i]).join(', ');
        const rows = d.shuffle([[q1, q2], [q1], [q2], [q1, wrong]]), ok = (list) => said(list) === said([q1, q2]), pairs = cuts.filter((c) => c.a === p || c.b === p).map((c) => `선분 ${c.name}은 선분 ${partnerOf(cuts, c).name}과`);
        return C(`${prismName(made.n)}의 전개도를 접었을 때 점 ${POINTS[p]}과 만나는 점을 모두 고른 것은?`, rows.map(said), rows.findIndex(ok), {
          figure: pointed(net, ring), explain: `전개도를 접으면 ${pairs.join(', ')} 맞닿는다. 그래서 점 ${POINTS[p]}은 ${said([q1, q2])}과 한 꼭짓점에서 만난다. 각기둥의 꼭짓점에는 면 3개가 모이므로 전개도의 세 점이 한 꼭짓점이 되기도 한다.`,
          facts: { truth: rows.map((list) => list.length === 2 && list.every((i) => ids[i] === ids[p])), want: true }
        });
      }, { standard: NET }),
      H('hard-seg-far', '전개도에서 떨어져 있는 두 선분이 맞닿는 경우', '49, 기본 ①33 ②46 ③60', (d) => {
        // 그림에 함정을 둔다: 맞닿는 선분이 바로 옆에 이어져 있지 않은 선분을 묻는다. 「옆에 이어진 선분끼리 맞닿는다」고 보는 아이는 이웃한 선분을 고른다.
        const made = d.until(() => {
          const n = d.pick([3, 4]), net = K.netFor(d, n, { apart: true }), info = netInfo(net), apart = info.cuts.filter((c) => !adjoin(c, partnerOf(info.cuts, c)));
          return apart.length ? Object.assign(info, { n, net, s: d.pick(apart) }) : null;
        }, Boolean), { net, ring, cuts, ids, s } = made, t = partnerOf(cuts, s), beside = cuts.filter((c) => c !== t && c !== s && (c.a === s.b || c.b === s.a)), meets = (i) => (ids[t.a] === ids[i] ? t.a : t.b);
        const rows = d.shuffle([t].concat(beside, d.shuffle(cuts.filter((c) => c !== s && c !== t && !beside.includes(c))).slice(0, 3 - beside.length)));
        return C(`${prismName(made.n)}의 전개도를 접을 때 선분 ${s.name}과 맞닿아 한 모서리가 되는 선분은?`, rows.map((c) => '선분 ' + c.name), rows.indexOf(t), {
          figure: pointed(net, ring), explain: `전개도를 접으면 점 ${POINTS[s.a]}은 점 ${POINTS[meets(s.a)]}과, 점 ${POINTS[s.b]}은 점 ${POINTS[meets(s.b)]}과 만난다. 그래서 선분 ${s.name}은 떨어져 있는 선분 ${t.name}과 맞닿는다.`,
          facts: { truth: rows.map((c) => c.edge === s.edge), want: true }
        });
      }, { standard: NET }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-chain', '수 하나에서 이름을 찾아 다른 수 구하기', '38, 기본 ①24·58 ②34 ③38', (d, k) => {
        // 주어진 수에서 밑면의 변의 수를 거꾸로 찾고(한 번), 그 변의 수로 다른 수를 구한다(두 번). 각뿔에서는 면의 수와 꼭짓점의 수가 같으므로 그 둘 사이는 묻지 않는다.
        const kind = k === 0 ? 'prism' : 'pyramid', rule = k === 0 ? PRISM : PYRAMID, name = k === 0 ? prismName : pyramidName, n = d.int(5, 10);
        const [a, b] = d.until(() => d.shuffle(PARTS).slice(0, 2), ([x, y]) => k === 0 || (x === 'edge') !== (y === 'edge')), given = rule[a](n), want = rule[b](n);
        return N(`${josa(PART[a], '이/가')} ${given}개인 ${k === 0 ? '각기둥' : '각뿔'}의 ${josa(PART[b], '은/는')} 모두 몇 개인가?`, want, {
          unit: '개', explain: `${k === 0 ? '각기둥' : '각뿔'}의 ${PART[a]}의 수는 ${RULE[kind][a]}이므로 밑면의 변은 ${n}개이고, 이 도형은 ${name(n)}이다. ${name(n)}의 ${PART[b]}의 수는 ${RULE[kind][b]}이므로 ${want}개이다.`,
          facts: { calc: [[FORTH[kind][b](BACK[kind][a](given)), 0]], unseen: [1, 2, 3] }
        });
      }, { count: 2 }),
      H('hard-cross', '각기둥과 수가 같은 각뿔', '41·42, 기본 ①66 ③38', (d, k) => {
        if (k === 1) {
          // 같은 수에서 각기둥의 이름과 각뿔의 이름을 따로 거꾸로 찾는다. 보기 — 두 규칙을 바꿔 댄 것, 수를 그대로 이름에 쓴 것, 한 가지 규칙만 댄 것
          const part = d.pick(PARTS), n = part === 'face' ? d.int(4, 9) : part === 'vert' ? d.int(3, 8) : d.pick([4, 6]), x = PRISM[part](n), m = part === 'edge' ? x / 2 : x - 1;
          const right = `${prismName(n)}, ${pyramidName(m)}`, safe = (v) => (Number.isInteger(v) && v >= 3 && v <= 20 ? v : null), pool = [[m, n], [x, x], [n, n], [m, m], [n + 1, m + 1]].filter(([p, q]) => safe(p) && safe(q)).map(([p, q]) => `${prismName(p)}, ${pyramidName(q)}`).filter((o) => o !== right);
          const options = d.shuffle([right].concat(d.shuffle([...new Set(pool)]).slice(0, 3)));
          return C(`${josa(PART[part], '이/가')} ${x}개인 각기둥과 각뿔의 이름을 차례로 쓴 것은?`, options, options.indexOf(right), {
            explain: `각기둥의 ${PART[part]}의 수는 ${RULE.prism[part]}이므로 ${PART[part]}${part === 'edge' ? '가' : '이'} ${x}개인 각기둥은 ${prismName(n)}이다. 각뿔의 ${PART[part]}의 수는 ${RULE.pyramid[part]}이므로 ${PART[part]}${part === 'edge' ? '가' : '이'} ${x}개인 각뿔은 ${pyramidName(m)}이다.`,
            facts: { truth: options.map((o) => o === right), want: true }
          });
        }
        // 각기둥의 수를 구하고(한 번), 그 수에서 각뿔의 밑면의 변의 수를 거꾸로 찾고(두 번), 각뿔의 다른 수를 구한다(세 번).
        const a = d.pick(PARTS), n = a === 'edge' ? d.pick([4, 6, 8]) : d.int(3, 8), x = PRISM[a](n), m = a === 'edge' ? x / 2 : x - 1, b = a === 'edge' ? d.pick(['face', 'vert']) : 'edge', want = PYRAMID[b](m);
        return N(`${prismName(n)}과 ${PART[a]}의 수가 같은 각뿔의 ${josa(PART[b], '은/는')} 모두 몇 개인가?`, want, {
          unit: '개', explain: `${prismName(n)}의 ${josa(PART[a], '은/는')} ${x}개이다. ${josa(PART[a], '이/가')} ${x}개인 각뿔은 밑면의 변이 ${m}개인 ${pyramidName(m)}이다. ${pyramidName(m)}의 ${PART[b]}의 수는 ${RULE.pyramid[b]}이므로 ${want}개이다.`,
          facts: { calc: [[FORTH.pyramid[b](BACK.pyramid[a]('(' + FORTH.prism[a](n) + ')')), 0]], unseen: [n, 1, 2, 3] }
        });
      }, { count: 2 }),
      H('hard-same-count', '면의 수와 꼭짓점의 수가 같은 입체도형', '42, 기본 ②34 ③50', (d) => {
        // 각기둥인지 각뿔인지를 스스로 가린다(각기둥은 꼭짓점이 면보다 언제나 많다). 그런 다음 수에서 밑면의 변의 수를 거꾸로 찾아 모서리의 수를 구한다.
        const x = d.int(5, 12), n = x - 1;
        return N(`각기둥이나 각뿔 가운데 하나인 입체도형이 있다. 이 입체도형의 면과 꼭짓점이 각각 ${x}개일 때, 모서리는 모두 몇 개인가?`, PYRAMID.edge(n), {
          unit: '개', explain: `각기둥은 꼭짓점의 수(한 밑면의 변의 수의 2배)가 면의 수(한 밑면의 변의 수보다 2 큰 수)보다 언제나 많다. 각뿔은 면의 수와 꼭짓점의 수가 모두 밑면의 변의 수보다 1 큰 수로 같다. 그래서 이 도형은 밑면의 변이 ${n}개인 ${pyramidName(n)}이고, 모서리는 ${n} × 2 = ${n * 2}(개)이다.`,
          facts: { calc: [[`(${x}-1)*2`, 0]], unseen: [1, 2] }
        });
      }),
      H('hard-cut-names', '각기둥을 잘라 만든 두 각기둥의 이름', '21, 기본 ②32', (d) => {
        // 자르는 선이 밑면을 어떤 두 다각형으로 나누는지 보고(한 번), 그 다각형이 밑면인 각기둥의 이름을 댄다(두 번). 보기 — 자르기 전의 이름 그대로, 뿔로 본 것, 변의 수를 하나씩 잘못 센 것
        const n = d.pick([5, 6]), solid = prismOf(d, n), i = d.int(0, n - 1), k = n === 5 ? 2 : d.pick([2, 3]), j = (i + k) % n, sides = [k + 1, n - k + 1].sort((x, y) => x - y), red = 'stroke:#dc2626;stroke-width:3.2';
        const right = sides.map(prismName).join(', '), pool = [[n, n], [sides[0], sides[0]], [sides[1], sides[1]], [sides[0] + 1, sides[1] + 1], [3, n]].map((p) => p.map(prismName).join(', ')).concat([sides.map(pyramidName).join(', ')]).filter((o) => o !== right);
        const options = d.shuffle([right].concat(d.shuffle([...new Set(pool)]).slice(0, 3)));
        return C(`${josa(prismName(n), '을/를')} 굵은 선을 따라 밑면에 수직으로 잘라 각기둥 2개를 만들었다. 만들어진 두 각기둥의 이름을 바르게 쓴 것은?`, options, options.indexOf(right), {
          figure: draw(solid, { size: [140, 132], bold: [edgeKey(i, i + n), edgeKey(j, j + n)], marks: [{ a: i, b: j, css: red }, { a: i + n, b: j + n, kind: 'dash', css: red }], label: `${prismName(n)}의 겨냥도. 윗면의 이웃하지 않은 두 꼭짓점을 이은 선분과 그 아래의 아랫면의 선분, 두 선분의 끝을 잇는 모서리 2개를 굵게 그었다.` }),
          explain: `굵은 선은 밑면인 ${gon(n)}을 ${sides[0] === sides[1] ? `${gon(sides[0])} 2개로` : `${gon(sides[0])}과 ${gon(sides[1])}으로`} 나눈다. 밑면에 수직으로 자르면 잘린 두 도형도 밑면이 서로 평행하고 합동이며 옆면이 직사각형인 각기둥이다. ${sides[0] === sides[1] ? `밑면이 ${gon(sides[0])}인 ${prismName(sides[0])} 2개가` : `밑면이 ${gon(sides[0])}인 ${prismName(sides[0])}과 밑면이 ${gon(sides[1])}인 ${prismName(sides[1])}이`} 만들어진다.`,
          facts: { truth: options.map((o) => o === right), want: true }
        });
      }),
      H('hard-triangle-edges', '모든 면이 정삼각형인 각뿔의 모든 모서리의 길이의 합', '57, 기본 ②60', (d) => {
        // 밑면도 삼각형이므로 삼각뿔이라는 것을 찾고(한 번), 모서리의 수를 구해(두 번) 한 모서리의 길이를 곱한다(곱셈 한 번).
        const s = d.int(3, 9), edges = PYRAMID.edge(3);
        return N(`모든 면이 한 변의 길이가 ${s} cm인 정삼각형인 각뿔이 있다. 이 각뿔의 모든 모서리의 길이의 합은 몇 cm인가?`, s * edges, {
          unit: 'cm', explain: `밑면도 삼각형이므로 이 각뿔은 삼각뿔이다. 삼각뿔의 모서리는 3 × 2 = 6(개)이고, 모서리마다 정삼각형의 한 변이므로 길이가 모두 ${s} cm이다. ${s} × 6 = ${s * 6}(cm)`,
          facts: { calc: [[`${s}*6`, 0]], unseen: [6] }
        });
      }),
      H('hard-fold-far-length', '전개도에서 두 번 이어 찾는 변의 길이', '49·53, 기본 ②48 ③64', (d) => {
        // 길이를 셈하지 않는다. 아래쪽 밑면의 변 → 맞닿는 옆면의 아래쪽 변 → 그 옆면의 위쪽 변(직사각형의 마주 보는 변) → 맞닿는 위쪽 밑면의 변으로 이어 가야 적힌 길이에 닿는다.
        const { a, b, c, h } = oddTriangle(d), tri = triangle(a, b, c);
        const made = d.until(() => {
          // 위쪽 밑면의 변(옆면 위로 솟은 선분) 둘과 아래쪽 밑면의 변(옆면 아래로 내려온 선분) 둘. 접었을 때 같은 옆면의 위와 아래에 맞닿는 변끼리 길이가 같다.
          const net = triNet(d, tri, h), { ring, cuts } = netInfo(net), topCuts = cuts.filter((x) => x.at.some((p) => p[1] < -1e-6)), lowCuts = cuts.filter((x) => x.at.some((p) => p[1] > h + 1e-6));
          const ask = lowCuts.find((x) => topCuts.some((y) => y.edge === x.edge.replace(/B/g, 'T')));
          if (!ask || topCuts.length !== 2) return null;
          const given = topCuts.concat([d.pick(cuts.filter(isUpright))]);
          const art = pointed(net, ring, { lens: given.map((x) => ({ a: x.at[0], b: x.at[1], text: cm(lenAt(x)) })), label: `삼각기둥의 전개도. 테두리의 점에 ㄱ부터 ${POINTS[ring.length - 1]}까지 이름을 붙였다. ${given.map((x) => `선분 ${x.name} ${lenAt(x)} cm`).join(', ')}` });
          return netArt.tidy ? { ask, from: topCuts.find((y) => y.edge === ask.edge.replace(/B/g, 'T')), art } : null;
        }, Boolean), { ask, from } = made;
        return N(`삼각기둥의 전개도이다. 접어서 삼각기둥을 만들 때 밑면의 변이 되는 선분 ${ask.name}의 길이는 몇 cm인가?`, lenAt(ask), {
          unit: 'cm', figure: made.art, explain: `선분 ${ask.name}은 접었을 때 옆면의 아래쪽 변과 맞닿고, 그 옆면의 위쪽 변은 위쪽 밑면의 선분 ${from.name}과 맞닿는다. 맞닿는 선분과 직사각형의 마주 보는 변은 길이가 같으므로 선분 ${ask.name}의 길이는 선분 ${from.name}과 같은 ${lenAt(from)} cm이다.`,
          facts: { calc: [[String(lenAt(ask)), 0]] }
        });
      }, { standard: NET })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
