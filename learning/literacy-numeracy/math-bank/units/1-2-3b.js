// 1학년 2학기 3단원 모양과 시각 — 기본 문항(세 모양으로 꾸민 모양, 몇 시, 몇 시 30분)과 꾸민 그림·시계 도구.
// 단원 틀과 싣는 기준은 1-2-3a.js, 실력 문항은 1-2-3c.js.
//
// 싣는 기준(이 파일)
//  - 꾸민 그림은 집·기차·로봇·로켓·배·성·트럭·아이스크림처럼 간단한 것으로 그리고, 한 모양은 9개를 넘기지 않는다.
//    기본 문항의 그림은 조각의 뾰족한 부분이 다른 조각에 가려지지 않게 놓는다(겹쳐 놓여 일부만 보이는 조각은 실력 문항에서만 쓴다).
//    그림 설명(aria-label)에 모양마다의 수를 적는다. 답은 조각 목록을 다시 세어 맞춘다.
//  - 모양의 수로 하는 셈은 한 번만 한다(두 모양의 합, 두 모양의 차). 수는 9 이하이다.
//  - 시각은 「몇 시」와 「몇 시 30분」뿐이다. 시계 그림의 설명에는 시각이 아니라 바늘이 가리키는 곳을 적는다.
//    「몇 시 30분」의 짧은바늘은 두 숫자의 한가운데에 그린다.
//  - 답으로 한글을 적게 하지 않는다(시와 분은 숫자 칸으로, 사람·할 일은 고르기로).
//
// 뺀 것과 까닭
//  - 한 모양을 모두 찾아 색칠하기(①29), 시계와 시각 잇기(①34), 시계에 바늘 그리기(①36·44 심27·33), 잘못 나타낸 시계를 고쳐 그리고 까닭 쓰기(①46 — 고르기로 바꾸어 실력에 실었다): 긋기·그리기·서술형.
//    바늘 그리기는 「그 시각에 바늘이 가리키는 수」(hour-point, half-point)로 물었다.
//  - 두 모양의 합이 10을 넘는 것(①25의 변형, 3 + 10): 두 자리 수가 낀 덧셈은 뒤 단원(1-2-6)이다. 한 자리 합만 실었다.
//  - 가장 많이 쓴 모양과 가장 적게 쓴 모양의 수의 합(심21): 뜻 없는 셈이다. 차(①26의 변형)는 실력에 실었다.
//  - 쓰고 읽기(①30·39의 변형 「한 시 삼십 분」), 일기 채우기(①38의 변형): 한글로 쓰는 답. 수 칸만 받았다.
//  - 세 수의 합 ㉠ + ㉡ + ㉢(①40의 변형): 시각과 상관없는 셈이라 세 수를 그대로 묻는다(half-point).
//  - 같은 시각을 나타내는 시계 찾기(심32, 심26의 변형): 바늘 시계끼리는 같은 그림 찾기가 되고, 생김새가 다른 시계(전자시계)를 그릴 도구와 근거가 없어 미루었다.
//  - 30분 지난 시각(심38), 긴바늘이 몇 바퀴 도는가(심39): 2학년 2학기 「시각과 시간」.
//  - 시각을 이야기로 말하기(심27·33의 변형): 서술형.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, table, N, M, C } = B.kit;
  const G = B.kit.geo;
  const K = B.kit.g123;
  const { TAGS, KINDS, MARK, say, SAYS, RAD, r2, frame, rect, tri, circ, paint, tally, told, conditions } = K;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 세 모양으로 꾸민 그림 ─────────────────────────────────────
  // 조각: 왼쪽 위 구석에서 잡는 네모, 세 구석으로 잡는 세모, 가운데로 잡는 동그라미. part 는 그림 속에서 맡은 자리(지붕, 문 …)
  const Bx = (x, y, w, h, fill, part) => Object.assign(rect(x + w / 2, y + h / 2, w, h), { fill, part });
  const Tr = (a, b, c, fill, part) => Object.assign(tri(a, b, c), { fill, part });
  const Ci = (cx, cy, r, fill, part) => Object.assign(circ(cx, cy, r), { fill, part });
  const WHEEL = '#64748b';
  // ban: 쓰지 않을 모양(두 모양만 쓴 그림을 만들 때)
  function house(d, ban) {
    const P = [], trees = d.int(0, 2);
    if (trees) { P.push(Bx(22, 122, 12, 36, '#d6a676', '나무 기둥'), Tr([4, 122], [52, 122], [28, 84], '#bbf7d0', '나뭇잎')); if (trees === 2) P.push(Tr([10, 84], [46, 84], [28, 50], '#bbf7d0', '나뭇잎')); }
    P.push(Bx(70, 88, 120, 70, '#fde68a', '벽'), Tr([58, 88], [202, 88], [130, 34], '#fca5a5', '지붕'));
    if (d.bool()) P.push(Bx(160, 44, 16, 30, '#cbd5e1', '굴뚝'));
    P.push(Bx(117, 118, 26, 40, '#d6a676', '문'));
    const win = ban === 'cir' ? 'sq' : d.pick(['sq', 'cir']);
    [84, 156].slice(0, d.int(1, 2)).forEach((x) => P.push(win === 'sq' ? Bx(x, 100, 22, 22, '#bfdbfe', '창문') : Ci(x + 11, 111, 11, '#bfdbfe', '창문')));
    if (ban !== 'cir' && d.bool()) P.push(Ci(224, 30, 15, '#fdba74', '해'));
    return { name: '집', W: 250, H: 164, pieces: P };
  }
  function train(d, ban) {
    const P = [], n = d.int(1, 3);
    P.push(Bx(8, 46, 54, 46, '#fca5a5', '기관차'), Bx(42, 24, 12, 22, '#94a3b8', '굴뚝'));
    if (d.bool()) P.push(Bx(16, 54, 18, 16, '#e0f2fe', '창문'));
    P.push(Ci(22, 100, 9, WHEEL, '바퀴'), Ci(48, 100, 9, WHEEL, '바퀴'));
    for (let i = 0; i < n; i += 1) {
      const x = 70 + i * 64, load = d.pick(ban === 'tri' ? ['sq', 'cir', ''] : ['sq', 'tri', 'cir', 'tri', '']);
      P.push(Bx(x, 58, 56, 34, ['#bfdbfe', '#fde68a', '#bbf7d0'][i], '칸'));
      if (load === 'tri') P.push(Tr([x + 10, 58], [x + 46, 58], [x + 28, 30], '#e9d5ff', '짐'));
      if (load === 'sq') P.push(Bx(x + 15, 34, 26, 24, '#e9d5ff', '짐'));
      if (load === 'cir') P.push(Ci(x + 28, 44, 14, '#e9d5ff', '짐'));
      P.push(Ci(x + 14, 100, 9, WHEEL, '바퀴'), Ci(x + 42, 100, 9, WHEEL, '바퀴'));
    }
    return { name: '기차', W: 74 + n * 64, H: 114, pieces: P };
  }
  function robot(d) {
    const P = [];
    if (d.bool()) P.push(Tr([83, 22], [97, 22], [90, 4], '#fca5a5', '뿔'));
    P.push(Bx(60, 22, 60, 44, '#bfdbfe', '머리'));
    if (d.bool()) P.push(Ci(77, 40, 7, '#fff', '눈'), Ci(103, 40, 7, '#fff', '눈')); else P.push(Bx(70, 34, 13, 13, '#fff', '눈'), Bx(97, 34, 13, 13, '#fff', '눈'));
    const mouth = d.pick(['sq', 'tri', '']);
    if (mouth === 'sq') P.push(Bx(79, 51, 22, 10, '#fca5a5', '입'));
    if (mouth === 'tri') P.push(Tr([82, 52], [98, 52], [90, 61], '#fca5a5', '입'));
    P.push(Bx(50, 70, 80, 62, '#fde68a', '몸'));
    for (let i = 0, k = d.int(0, 3); i < k; i += 1) P.push(Ci(90, 84 + i * 17, 6, '#fca5a5', '단추'));
    P.push(Bx(27, 74, 19, 50, '#bbf7d0', '팔'), Bx(134, 74, 19, 50, '#bbf7d0', '팔'));
    if (d.bool()) P.push(Ci(36.5, 134, 8, '#fed7aa', '손'), Ci(143.5, 134, 8, '#fed7aa', '손'));
    P.push(Bx(62, 134, 22, 40, '#e9d5ff', '다리'), Bx(96, 134, 22, 40, '#e9d5ff', '다리'));
    if (d.bool()) P.push(Tr([58, 191], [88, 191], [73, 177], '#94a3b8', '발'), Tr([92, 191], [122, 191], [107, 177], '#94a3b8', '발'));
    return { name: '로봇', W: 180, H: 196, pieces: P };
  }
  function rocket(d) {
    const P = [];
    if (d.bool()) P.push(Ci(150, 30, 14, '#fde68a', '달'));
    P.push(Bx(68, 52, 44, 92, '#e2e8f0', '몸통'), Tr([68, 52], [112, 52], [90, 12], '#fca5a5', '머리'));
    P.push(Tr([68, 144], [68, 104], [40, 144], '#93c5fd', '날개'), Tr([112, 144], [112, 104], [140, 144], '#93c5fd', '날개'));
    for (let i = 0, k = d.int(1, 3); i < k; i += 1) P.push(Ci(90, 72 + i * 24, 8, '#bfdbfe', '창'));
    d.pick([[90], [80, 100], [76, 90, 104]]).forEach((x) => P.push(Tr([x - 7, 147], [x + 7, 147], [x, 169], '#fdba74', '불꽃')));
    if (d.bool()) P.push(Bx(48, 174, 84, 18, '#94a3b8', '받침'));
    return { name: '로켓', W: 180, H: 198, pieces: P };
  }
  function boat(d) {
    // 돛대는 그리지 않는다: 가느다란 막대는 □ 모양으로 셀지 말지 헷갈린다.
    const P = [Tr([118, 110], [118, 22], [184, 110], '#bfdbfe', '돛')];
    if (d.bool()) P.push(Tr([110, 110], [110, 54], [62, 110], '#fecaca', '돛'));
    P.push(Bx(40, 112, 152, 30, '#d6a676', '배'));
    if (d.bool()) P.push(Bx(20, 62, 26, 22, '#fde68a', '연'), Bx(6, 30, 20, 18, '#bbf7d0', '연'));
    for (let i = 0, k = d.int(0, 3); i < k; i += 1) P.push(Ci(86 + i * 30, 127, 7, '#e0f2fe', '창'));
    if (d.bool()) P.push(Ci(216, 28, 15, '#fdba74', '해'));
    return { name: '배', W: 240, H: 150, pieces: P };
  }
  function castle(d, ban) {
    const P = [Bx(70, 88, 110, 68, '#e2e8f0', '벽'), Bx(34, 58, 36, 98, '#cbd5e1', '탑'), Bx(180, 58, 36, 98, '#cbd5e1', '탑'), Tr([28, 58], [76, 58], [52, 24], '#fca5a5', '지붕'), Tr([174, 58], [222, 58], [198, 24], '#fca5a5', '지붕')];
    if (d.bool()) P.push(Tr([92, 88], [158, 88], [125, 54], '#93c5fd', '지붕'));
    P.push(Bx(110, 118, 30, 38, '#d6a676', '문'));
    const win = ban === 'cir' ? 'sq' : d.pick(['sq', 'cir']);
    [52, 198].forEach((x) => P.push(win === 'sq' ? Bx(x - 7, 78, 14, 16, '#bfdbfe', '창문') : Ci(x, 86, 8, '#bfdbfe', '창문')));
    [88, 148].slice(0, d.int(0, 2)).forEach((x) => P.push(win === 'sq' ? Bx(x, 98, 14, 14, '#bfdbfe', '창문') : Ci(x + 7, 105, 7, '#bfdbfe', '창문')));
    if (ban !== 'cir' && d.bool()) P.push(Ci(125, 26, 13, '#fdba74', '해'));
    return { name: '성', W: 250, H: 162, pieces: P };
  }
  function truck(d, ban) {
    const P = [Bx(14, 52, 130, 48, '#bfdbfe', '짐칸'), Bx(146, 62, 60, 38, '#fca5a5', '운전석')];
    if (d.bool()) P.push(Bx(170, 68, 26, 16, '#e0f2fe', '창문'));
    for (let i = 0, k = d.int(1, 3); i < k; i += 1) {
      const x = 22 + i * 40, load = d.pick(ban === 'tri' ? ['sq', 'cir'] : KINDS);
      P.push(load === 'sq' ? Bx(x, 28, 30, 24, '#fde68a', '짐') : load === 'tri' ? Tr([x, 52], [x + 34, 52], [x + 17, 24], '#bbf7d0', '짐') : Ci(x + 16, 37, 15, '#e9d5ff', '짐'));
    }
    (d.bool() ? [44, 112, 178] : [44, 178]).forEach((x) => P.push(Ci(x, 106, 12, WHEEL, '바퀴')));
    return { name: '트럭', W: 220, H: 124, pieces: P };
  }
  function icecream(d) {
    const P = [], n = d.int(2, 3);
    for (let i = 0; i < n; i += 1) {
      const x = 14 + i * 70;
      P.push(Tr([x, 78], [x + 44, 78], [x + 22, 140], '#fdba74', '과자'), Ci(x + 22, 60, 20, ['#fecaca', '#bbf7d0', '#fde68a'][i], '아이스크림'));
      if (d.bool()) P.push(Ci(x + 22, 25, 15, ['#e9d5ff', '#fecaca', '#bfdbfe'][i], '아이스크림'));
    }
    return { name: '아이스크림', W: 14 + n * 70, H: 146, pieces: P };
  }
  const SCENES = [house, train, robot, rocket, boat, castle, truck];
  // 가로로 길어 여러 장을 위아래로 놓기 좋은 그림
  const WIDE = [train, truck, boat];
  // 두 모양만 쓴 그림: [그리는 법, 쓰지 않는 모양]
  const TWO_KINDS = [[train, 'tri'], [truck, 'tri'], [house, 'cir'], [castle, 'cir'], [icecream, 'sq']];
  const usable = (n) => KINDS.every((k) => n[k] <= 9);
  // 조건(ok)에 맞는 그림을 그린다. ok 는 모양마다의 수와 그림을 받는다.
  const sceneOf = (d, ok, pool) => d.until(() => d.pick(pool || SCENES)(d), (scene) => { const n = tally(scene.pieces); return usable(n) && ok(n, scene); });
  const sceneFig = (scene, scale) => frame(scene.W, scene.H, scene.pieces.map((piece) => paint(piece)).join(''), `세 모양으로 꾸민 ${scene.name}: ${told(tally(scene.pieces))}`, scale);
  const kindsOf = (scene) => scene.pieces.map((piece) => piece.k);
  const used = (thing) => `${josa(thing, '을/를')} 꾸미는 데`;
  // 작은 그림: 한 가지 모양만 쓴 것과 두 가지 모양을 쓴 것
  const MINI_ONE = [
    () => [Bx(18, 56, 44, 32, '#bfdbfe'), Bx(25, 30, 30, 26, '#fde68a'), Bx(32, 8, 16, 22, '#fecaca')],
    () => [Tr([12, 88], [68, 88], [40, 60], '#bbf7d0'), Tr([18, 60], [62, 60], [40, 34], '#bbf7d0'), Tr([24, 34], [56, 34], [40, 8], '#bbf7d0')],
    () => [Ci(40, 69, 19, '#e0f2fe'), Ci(40, 37, 13, '#e0f2fe'), Ci(40, 15, 9, '#e0f2fe')]
  ];
  const MINI_TWO = [
    () => [Tr([20, 44], [60, 44], [40, 88], '#fdba74'), Ci(40, 27, 18, '#fecaca')],
    () => [Bx(20, 46, 40, 42, '#fde68a'), Tr([12, 46], [68, 46], [40, 14], '#fca5a5')],
    () => [Bx(24, 6, 32, 82, '#cbd5e1'), Ci(40, 22, 10, '#fca5a5'), Ci(40, 47, 10, '#fde68a'), Ci(40, 72, 10, '#bbf7d0')],
    () => [Tr([21, 46], [5, 32], [5, 60], '#e9d5ff'), Tr([59, 46], [75, 32], [75, 60], '#e9d5ff'), Ci(40, 46, 17, '#fecaca')],
    () => [Bx(28, 32, 24, 56, '#fde68a'), Tr([28, 30], [52, 30], [40, 8], '#fed7aa')]
  ];
  const miniFig = (pieces) => frame(80, 94, pieces.map((piece) => paint(piece)).join(''), `꾸민 그림: ${told(tally(pieces))}`);

  // ── 시계 ─────────────────────────────────────────────────────
  // hp: 짧은바늘이 가리키는 곳(3 = 숫자 3, 3.5 = 3과 4의 한가운데), mp: 긴바늘이 가리키는 곳.
  // 그림 설명에는 시각이 아니라 바늘의 자리를 적는다(시각을 묻는 문항에서 답을 적어 주지 않으려고).
  const spot = (p) => (Number.isInteger(p) ? josa(p, '을/를') : `${josa(Math.floor(p), '과/와')} ${(Math.floor(p) % 12) + 1}의 가운데를`);
  function clock(hp, mp, width) {
    const Rr = 46, c = 54, polar = (deg, r) => [c + r * Math.sin(deg * RAD), c - r * Math.cos(deg * RAD)];
    let out = '<circle class="mb-clock-face" cx="54" cy="54" r="46"/>';
    for (let i = 0; i < 12; i += 1) { const a = polar(i * 30, Rr - 0.5), b = polar(i * 30, Rr - 3); out += `<line class="mb-tick" x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}"/>`; }
    for (let n = 1; n <= 12; n += 1) { const p = polar(n * 30, Rr - 9.5); out += `<text class="mb-clock-number" style="font-size:10.5px" x="${r2(p[0])}" y="${r2(p[1])}" text-anchor="middle" dominant-baseline="central">${n}</text>`; }
    // 긴바늘은 숫자를 가리지 않게 숫자 바로 안쪽까지만 뻗는다.
    const m = polar(mp * 30, Rr - 16), h = polar(hp * 30, Rr - 27);
    return `<svg class="mb-clock" viewBox="0 0 108 108" width="${width || 118}" role="img" aria-label="시계: 짧은바늘은 ${spot(hp)}, 긴바늘은 ${spot(mp)} 가리킨다">${out}`
      + `<line class="mb-hand-hour" x1="54" y1="54" x2="${r2(h[0])}" y2="${r2(h[1])}"/><line class="mb-hand-minute" x1="54" y1="54" x2="${r2(m[0])}" y2="${r2(m[1])}"/><circle class="mb-clock-pin" cx="54" cy="54" r="2.4"/></svg>`;
  }
  // 시각 [시, 30분인가]
  const face = (t, width) => clock(t[0] + (t[1] ? 0.5 : 0), t[1] ? 6 : 12, width);
  const at = (t) => t[0] + '시' + (t[1] ? ' 30분' : '');
  const mins = (t) => (t[1] ? `${t[0]}*60+30` : `${t[0]}*60`);
  const value = (t) => t[0] * 60 + (t[1] ? 30 : 0);
  const next = (h) => (h % 12) + 1;
  // 「몇 시」와 「몇 시 30분」의 바늘 자리를 말로
  const hourSaid = (h) => `짧은바늘이 ${josa(h, '을/를')}, 긴바늘이 12를 가리키므로 ${h}시이다.`;
  const halfSaid = (h) => `짧은바늘이 ${josa(h, '과/와')} ${next(h)} 사이에 있고 긴바늘이 6을 가리키므로 ${h}시 30분이다.`;
  const said = (t) => (t[1] ? halfSaid(t[0]) : hourSaid(t[0]));

  Object.assign(K, { Bx, Tr, Ci, house, train, robot, rocket, boat, castle, truck, icecream, SCENES, WIDE, sceneOf, sceneFig, kindsOf, used, clock, face, at, mins, value, next, hourSaid, halfSaid, said });

  B.addTypes('1-2-3', 'make', [
    T('make-each', '세 모양 각각의 수', '①19 심17', (d) => {
      const scene = sceneOf(d, (n) => KINDS.every((k) => n[k] >= 1)), n = tally(scene.pieces);
      return M(`□, △, ○ 모양으로 ${josa(scene.name, '을/를')} 꾸몄다. 모양마다 몇 개씩 썼는가?`, KINDS.map((k) => ({ label: say(k), answer: n[k], unit: '개' })), {
        figure: sceneFig(scene), explain: `${told(n)}를 썼다.`, facts: { calc: KINDS.map((k, i) => [String(n[k]), i]), parts: KINDS.map((k, i) => [kindsOf(scene).map((x) => (x === k ? 1 : 0)).join('+'), i]) }
      });
    }),
    T('make-one', '한 모양의 수', '①20 심18', (d) => {
      const scene = sceneOf(d, (n) => KINDS.filter((k) => n[k] >= 1).length === 3 && KINDS.some((k) => n[k] >= 3)), n = tally(scene.pieces), k = d.pick(KINDS.filter((x) => n[x] >= 3));
      return N(`${used(scene.name)} 쓴 ${say(k)}은 모두 몇 개인가?`, n[k], {
        unit: '개', figure: sceneFig(scene), explain: `${say(k)}에 표시하며 세면 모두 ${n[k]}개이다.`, facts: { calc: [[String(n[k]), 0]], tallyOf: { list: kindsOf(scene), target: k } }
      });
    }),
    T('make-most', '가장 많이 쓴 모양', '①21 심19', (d) => {
      const scene = sceneOf(d, (n) => KINDS.every((k) => n[k] >= 1) && KINDS.filter((k) => n[k] === Math.max(n.sq, n.tri, n.cir)).length === 1), n = tally(scene.pieces);
      return C(`${used(scene.name)} 가장 많이 쓴 모양은?`, SAYS, KINDS.findIndex((k) => n[k] === Math.max(n.sq, n.tri, n.cir)), {
        figure: sceneFig(scene), explain: `${told(n)}를 썼다. 가장 많이 쓴 모양은 ${say(KINDS.find((k) => n[k] === Math.max(n.sq, n.tri, n.cir)))}이다.`, facts: { choose: { exprs: KINDS.map((k) => String(n[k])), rule: 'max' } }
      });
    }),
    T('make-unused', '쓰지 않은 모양', '①22', (d) => {
      const [draw, ban] = d.pick(TWO_KINDS), scene = d.until(() => draw(d, ban), (s) => { const n = tally(s.pieces); return usable(n) && KINDS.filter((k) => n[k] === 0).length === 1; }), n = tally(scene.pieces);
      return C(`${used(scene.name)} 쓰지 않은 모양은?`, SAYS, KINDS.findIndex((k) => n[k] === 0), {
        figure: sceneFig(scene), explain: `${told(n)}를 썼다. ${say(KINDS.find((k) => n[k] === 0))}은 쓰지 않았다.`, facts: { truth: KINDS.map((k) => n[k] === 0), want: true }
      });
    }),
    T('make-used', '쓴 모양을 모두 고르기', '①23 심16', (d) => {
      // 하나뿐인 모양이 있는 그림: 그 모양을 빠뜨리기 쉽다.
      const scene = sceneOf(d, (n) => KINDS.some((k) => n[k] === 1)), n = tally(scene.pieces);
      const sets = [['sq', 'tri'], ['sq', 'cir'], ['tri', 'cir'], ['sq', 'tri', 'cir']], right = KINDS.filter((k) => n[k] >= 1);
      return C(`${used(scene.name)} 쓴 모양을 모두 고른 것은?`, sets.map((set) => set.map((k) => MARK[k]).join(', ')), sets.findIndex((set) => set.join() === right.join()), {
        figure: sceneFig(scene), explain: `${told(n)}를 썼다. 하나뿐인 모양도 빠뜨리지 않는다.`, facts: { truth: sets.map((set) => set.join() === right.join()), want: true }
      });
    }),
    T('make-parts', '꾸민 그림의 부분마다 어떤 모양인지', '①24', (d) => {
      const scene = house(d), n = tally(scene.pieces), kindAt = (part) => scene.pieces.find((piece) => piece.part === part).k, partsIn = (k) => [...new Set(scene.pieces.filter((piece) => piece.k === k).map((piece) => piece.part))];
      const parts = ['지붕', '벽', '문', '창문'].concat(scene.pieces.some((piece) => piece.part === '굴뚝') ? ['굴뚝'] : []);
      const good = parts.map((part) => ({ part, text: `${josa(part, '은/는')} ${say(kindAt(part))}이다.`, ok: true }));
      if (n.cir === 0) good.push({ text: '○ 모양은 쓰지 않았다.', ok: true });
      // 틀린 말: 조금만 쓴 모양을 「쓰지 않았다」고 한 것, 또는 한 부분의 모양을 바꾸어 말한 것
      const few = ['cir', 'tri', 'sq'].filter((k) => n[k] >= 1 && n[k] <= 2).sort((x, y) => n[x] - n[y]), wrongPart = d.pick(parts);
      const bad = few.length && d.bool() ? { text: `${say(few[0])}은 쓰지 않았다.`, why: `${josa(partsIn(few[0]).join(', '), '이/가')} ${say(few[0])}이다.` }
        : { part: wrongPart, text: `${josa(wrongPart, '은/는')} ${say(d.pick(KINDS.filter((k) => k !== kindAt(wrongPart))))}이다.`, why: `${josa(wrongPart, '은/는')} ${say(kindAt(wrongPart))}이다.` };
      const rows = d.shuffle(d.shuffle(good.filter((row) => row.part !== bad.part || !bad.part)).slice(0, 3).concat([bad]));
      return C('집을 꾸민 그림에 대한 설명으로 옳지 않은 것은?', rows.map((row) => row.text), rows.indexOf(bad), {
        figure: sceneFig(scene), explain: bad.why, facts: { truth: rows.map((row) => Boolean(row.ok)), want: false }
      });
    }),
    T('make-sum', '두 모양의 수의 합', '①25 심20', (d) => {
      const scene = sceneOf(d, (n) => KINDS.every((k) => n[k] >= 1) && KINDS.some((k) => n.sq + n.tri + n.cir - n[k] <= 9)), n = tally(scene.pieces);
      const out = d.pick(KINDS.filter((x) => n.sq + n.tri + n.cir - n[x] <= 9)), [p, q] = KINDS.filter((k) => k !== out);
      return N(`${used(scene.name)} 쓴 ${josa(say(p), '과/와')} ${say(q)}은 모두 몇 개인가?`, n[p] + n[q], {
        unit: '개', figure: sceneFig(scene), explain: `${say(p)}은 ${n[p]}개, ${say(q)}은 ${n[q]}개이다. ${n[p]} + ${n[q]} = ${n[p] + n[q]}(개)`, facts: { calc: [[`${n[p]}+${n[q]}`, 0]] }
      });
    }),
    T('make-diff', '두 모양의 수의 차', '①26', (d) => {
      const scene = sceneOf(d, (n) => KINDS.every((k) => n[k] >= 1) && new Set(KINDS.map((k) => n[k])).size >= 2), n = tally(scene.pieces);
      const [p, q] = d.until(() => d.shuffle(KINDS).slice(0, 2), ([x, y]) => n[x] > n[y]);
      return N(`${used(scene.name)} ${josa(say(p), '을/를')} ${say(q)}보다 몇 개 더 많이 썼는가?`, n[p] - n[q], {
        unit: '개', figure: sceneFig(scene), explain: `${say(p)}은 ${n[p]}개, ${say(q)}은 ${n[q]}개이다. ${n[p]} − ${n[q]} = ${n[p] - n[q]}(개)`, facts: { calc: [[`${n[p]}-${n[q]}`, 0]] }
      });
    }),
    T('make-only', '한 가지 모양으로만 꾸민 것 고르기', '①27 ①20 심15', (d) => {
      const list = d.shuffle([d.pick(MINI_ONE)()].concat(d.shuffle(MINI_TWO).slice(0, 2).map((draw) => draw()))), one = list.map((pieces) => new Set(pieces.map((piece) => piece.k)).size === 1), hit = one.indexOf(true);
      return C('한 가지 모양으로만 꾸민 그림은?', TAGS.slice(0, 3), hit, {
        figure: G.tiles(list.map((pieces, i) => [TAGS[i], miniFig(pieces)])), explain: `${TAGS[hit]}는 ${say(list[hit][0].k)}만 ${list[hit].length}개 썼다. 나머지는 두 가지 모양을 썼다.`, facts: { truth: one, want: true }
      });
    }),
    T('make-match', '모양의 수에 맞게 꾸민 그림 고르기', '①28 심23', (d) => {
      // 같은 그림을 조금씩 달리 꾸민 셋. 모양의 수가 한두 개씩만 다르다.
      const draw = d.pick(WIDE), key = (n) => KINDS.map((k) => n[k]).join();
      const list = d.until(() => [draw(d), draw(d), draw(d)], (three) => {
        const ns = three.map((scene) => tally(scene.pieces));
        return ns.every((n) => usable(n) && KINDS.every((k) => n[k] >= 1)) && new Set(ns.map(key)).size === 3 && ns.slice(1).every((n) => KINDS.reduce((sum, k) => sum + Math.abs(n[k] - ns[0][k]), 0) <= 3);
      });
      const order = d.shuffle([0, 1, 2]), shown = order.map((i) => list[i]), want = tally(list[0].pieces);
      return C(`${told(want)}로 꾸민 그림은?`, TAGS.slice(0, 3), order.indexOf(0), {
        figure: G.tiles(shown.map((scene, i) => [TAGS[i], sceneFig(scene)])), explain: `□, △, ○ 모양의 수를 차례로 세면 ${shown.map((scene, i) => `${TAGS[i]}는 ${KINDS.map((k) => tally(scene.pieces)[k] + '개').join(', ')}`).join(' / ')}이다.`,
        facts: { truth: shown.map((scene) => key(tally(scene.pieces)) === key(want)), want: true }
      });
    }),
    T('make-two', '두 사람이 꾸민 그림 비교', '심22', (d) => {
      // 배의 □ 모양처럼 수가 달라지지 않는 모양도 있어, 물을 모양도 그림과 함께 다시 뽑는다.
      const draw = d.pick(WIDE), who = d.shuffle(NAMES).slice(0, 2);
      const [k, list] = d.until(() => [d.pick(KINDS), [draw(d), draw(d)]], ([kind, two]) => { const counts = two.map((scene) => tally(scene.pieces)); return counts.every((n) => usable(n) && n[kind] >= 1) && counts[0][kind] !== counts[1][kind]; }), ns = list.map((scene) => tally(scene.pieces));
      return C(`두 사람이 꾸민 그림이다. ${josa(say(k), '을/를')} 더 많이 쓴 사람은?`, who, ns[0][k] > ns[1][k] ? 0 : 1, {
        figure: G.tiles(list.map((scene, i) => [who[i], sceneFig(scene)])), explain: `${say(k)}을 ${name(who[0], '은/는')} ${ns[0][k]}개, ${name(who[1], '은/는')} ${ns[1][k]}개 썼다.`,
        facts: { choose: { exprs: ns.map((n) => String(n[k])), rule: 'max' } }
      });
    })
  ]);

  // ── 몇 시 ────────────────────────────────────────────────────
  const ACTS = ['세수하기', '숙제하기', '책 읽기', '줄넘기', '그림 그리기', '간식 먹기', '피아노 치기'];
  B.addTypes('1-2-3', 'hour', [
    T('hour-read', '시계를 보고 몇 시 쓰기', '①30 심25', (d) => {
      const h = d.int(1, 11);
      return N('시계가 나타내는 시각은 몇 시인가?', h, { unit: '시', figure: clock(h, 12, 132), explain: hourSaid(h), facts: { calc: [[String(h), 0]] } });
    }),
    T('hour-twelve', '두 바늘이 겹친 시계', '심26', () => N('짧은바늘과 긴바늘이 겹쳐 있는 시계이다. 몇 시인가?', 12, {
      unit: '시', figure: clock(12, 12, 132), explain: '짧은바늘과 긴바늘이 모두 12를 가리키므로 12시이다.', facts: { calc: [['12', 0]] }
    })),
    T('hour-hands', '바늘이 가리키는 수로 몇 시 알기', '①31', (d) => {
      const h = d.int(1, 11);
      return N(`시계의 짧은바늘이 ${josa(h, '을/를')}, 긴바늘이 12를 가리킨다. 몇 시인가?`, h, { unit: '시', explain: `긴바늘이 12를 가리킬 때 짧은바늘이 가리키는 수가 시이다. ${h}시이다.`, facts: { calc: [[String(h), 0]] } });
    }),
    T('hour-point', '몇 시일 때 바늘이 가리키는 수', '①32·36 심27', (d) => {
      const h = d.int(1, 11);
      return M(`${h}시일 때, 시계의 짧은바늘과 긴바늘이 가리키는 수는?`, [{ label: '짧은바늘', answer: h }, { label: '긴바늘', answer: 12 }], {
        explain: `${h}시에는 짧은바늘이 ${josa(h, '을/를')}, 긴바늘이 12를 가리킨다.`, facts: { calc: [[String(h), 0], ['12', 1]], unseen: [12] }
      });
    }),
    T('hour-pick', '몇 시를 나타내는 시계 고르기', '①33 심26', (d) => {
      // 보기: 바른 시계, 숫자를 마주 보는 쪽으로 읽은 시계(4와 8), 한 칸 앞·뒤의 시계
      const h = d.until(() => d.int(1, 11), (x) => x !== 6), hours = d.shuffle([h, 12 - h].concat(d.shuffle([next(h), h === 1 ? 12 : h - 1, next(next(h))].filter((x) => x !== 12 - h)).slice(0, 2)));
      return C(`${h}시를 나타내는 시계는?`, TAGS.slice(0, 4), hours.indexOf(h), {
        figure: G.tiles(hours.map((x, i) => [TAGS[i], clock(x, 12)])), explain: `${h}시에는 짧은바늘이 ${josa(h, '을/를')}, 긴바늘이 12를 가리킨다.`, facts: { kindPick: { kinds: hours, target: h } }
      });
    }),
    T('hour-did', '그 시각에 한 일 찾기', '①37 ①33', (d) => {
      const who = d.pick(NAMES), acts = d.shuffle(ACTS).slice(0, 3), hours = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3), (list) => list.some((x, i) => list.some((y, j) => i !== j && Math.abs(x - y) === 1))), at0 = d.int(0, 2);
      return C(`${name(who, '이/가')} 한 일과 그때의 시각이다. ${hours[at0]}시에 한 일은?`, acts, at0, {
        figure: G.tiles(hours.map((h, i) => [acts[i], clock(h, 12)])), explain: `짧은바늘이 ${josa(hours[at0], '을/를')}, 긴바늘이 12를 가리키는 시계를 찾는다. ${hours[at0]}시에 한 일은 ${acts[at0]}이다.`,
        facts: { kindPick: { kinds: hours, target: hours[at0] } }
      });
    }),
    T('hour-wrong', '몇 시를 잘못 읽은 것 찾기', '①35', (d) => {
      // 시계 넷 가운데 하나만 한 칸 옆의 수로 읽었다.
      const hours = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 4), bad = d.int(0, 3), read = hours.map((h, i) => (i === bad ? (d.bool() && h > 1 ? h - 1 : h + 1) : h));
      return C('시계 아래에 읽은 시각을 적었다. 잘못 읽은 것은?', TAGS.slice(0, 4), bad, {
        figure: G.tiles(hours.map((h, i) => [`${TAGS[i]} ${read[i]}시`, clock(h, 12)])), explain: `${TAGS[bad]}의 시계는 ${hourSaid(hours[bad])}`,
        facts: { claimed: hours.map((h, i) => [String(h), read[i]]), claimedWant: false }
      });
    }),
    T('hour-talk', '시계를 보고 바르게 말한 사람', '①35', (d) => {
      // 긴바늘이 가리키는 12를 시로 읽은 말, 긴바늘이 12인데 30분이라고 한 말
      const h = d.int(2, 10), who = d.shuffle(NAMES).slice(0, 3);
      const rows = d.shuffle([{ text: `긴바늘이 12를 가리키므로 12시이다.` }, { text: `짧은바늘이 ${josa(h, '을/를')} 가리키므로 ${h}시이다.`, ok: true }, { text: `짧은바늘이 ${josa(h, '을/를')} 가리키므로 ${h}시 30분이다.` }]);
      return C('시계를 보고 시각을 바르게 말한 사람은?', who, rows.findIndex((row) => row.ok), {
        figure: clock(h, 12, 120) + lines(rows.map((row, i) => `${who[i]}: ${row.text}`)), explain: `${hourSaid(h)} 시는 짧은바늘로 읽는다.`, facts: { truth: rows.map((row) => Boolean(row.ok)), want: true }
      });
    })
  ]);

  // ── 몇 시 30분 ────────────────────────────────────────────────
  // 두 바늘이 너무 붙지 않는 시각(5시 30분·6시 30분은 두 바늘 사이가 반 칸뿐이다)
  const HALF_HOURS = [1, 2, 3, 4, 7, 8, 9, 10, 11];
  B.addTypes('1-2-3', 'half', [
    T('half-read', '시계를 보고 몇 시 30분 쓰기', '①39 심29', (d) => {
      const h = d.pick(HALF_HOURS);
      return M('시계가 나타내는 시각은 몇 시 몇 분인가?', [{ answer: h, unit: '시' }, { answer: 30, unit: '분' }], { figure: clock(h + 0.5, 6, 132), explain: halfSaid(h), facts: { calc: [[String(h), 0], ['30', 1]], unseen: [30] } });
    }),
    T('half-see', '시계에서 바늘이 가리키는 곳 읽기', '①40', (d) => {
      const h = d.pick(HALF_HOURS);
      return M('시계를 보고 ㉠, ㉡, ㉢에 알맞은 수를 구하시오. (㉠은 ㉡보다 작다.)', [{ label: LABELS[0], answer: h }, { label: LABELS[1], answer: h + 1 }, { label: LABELS[2], answer: 6 }], {
        figure: clock(h + 0.5, 6, 120) + lines([`짧은바늘은 ${box(LABELS[0])}과 ${box(LABELS[1])} 사이에 있다.`, `긴바늘은 ${box(LABELS[2])}을 가리킨다.`]),
        explain: `짧은바늘은 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘은 6을 가리킨다.`, facts: { calc: [[String(h), 0], [String(h + 1), 1], ['6', 2]] }
      });
    }),
    T('half-hands', '바늘 설명으로 몇 시 30분 알기', '①40', (d) => {
      const h = d.int(1, 11);
      return M(`시계의 짧은바늘이 ${josa(h, '과/와')} ${h + 1}의 가운데에 있고, 긴바늘이 6을 가리킨다. 몇 시 몇 분인가?`, [{ answer: h, unit: '시' }, { answer: 30, unit: '분' }], {
        explain: `긴바늘이 6을 가리키면 몇 시 30분이다. 짧은바늘이 ${josa(h, '과/와')} ${h + 1}의 가운데에 있으므로 ${h}시 30분이다.`, facts: { calc: [[String(h), 0], ['30', 1]], unseen: [30] }
      });
    }),
    T('half-point', '몇 시 30분일 때 바늘이 있는 곳', '①40·44 심33', (d) => {
      const h = d.int(1, 11);
      return M(`${h}시 30분일 때 시계의 바늘이 있는 곳이다. ㉠, ㉡, ㉢에 알맞은 수는? (㉠은 ㉡보다 작다.)`, [{ label: LABELS[0], answer: h }, { label: LABELS[1], answer: h + 1 }, { label: LABELS[2], answer: 6 }], {
        figure: lines([`짧은바늘은 ${box(LABELS[0])}과 ${box(LABELS[1])} 사이에 있다.`, `긴바늘은 ${box(LABELS[2])}을 가리킨다.`]),
        explain: `${h}시 30분에는 짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘이 6을 가리킨다.`, facts: { calc: [[String(h), 0], [`${h}+1`, 1], ['6', 2]], unseen: [1, 6] }
      });
    }),
    T('half-pick', '몇 시 30분을 나타내는 시계 고르기', '①41 심30', (d) => {
      // 보기: 바른 시계, 짧은바늘이 한 칸 앞에 있는 시계(그 수로 다가가는 쪽), 한 칸 뒤에 있는 시계, 긴바늘이 12인 시계
      const h = d.pick([2, 3, 4, 8, 9, 10]), list = d.shuffle([[h, true], [h - 1, true], [h + 1, true], [h, false]]);
      return C(`${h}시 30분을 나타내는 시계는?`, TAGS.slice(0, 4), list.findIndex((t) => t[0] === h && t[1]), {
        figure: G.tiles(list.map((t, i) => [TAGS[i], face(t)])), explain: `${h}시 30분에는 짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘이 6을 가리킨다.`,
        facts: { kindPick: { kinds: list.map(value), target: h * 60 + 30 } }
      });
    }),
    T('half-pick-hands', '바늘 설명에 맞는 시계 고르기', '①42 심26·30', (d) => {
      const h = d.pick([1, 2, 3, 7, 8, 9, 10]), list = d.shuffle([[h, true], [h, false], [h + 1, false], [h + 1, true]]);
      return C(`짧은바늘이 ${josa(h, '과/와')} ${h + 1}의 가운데에 있고, 긴바늘이 6을 가리키는 시계는?`, TAGS.slice(0, 4), list.findIndex((t) => t[0] === h && t[1]), {
        figure: G.tiles(list.map((t, i) => [TAGS[i], face(t)])), explain: `긴바늘이 6을 가리키는 시계 가운데 짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있는 것을 찾는다. ${h}시 30분을 나타낸다.`,
        facts: { kindPick: { kinds: list.map(value), target: h * 60 + 30 } }
      });
    }),
    T('half-between', '조건에 알맞은 몇 시 30분', '①42', (d) => {
      const h = d.int(1, 11);
      return M('조건에 알맞은 시각은 몇 시 몇 분인가?', [{ answer: h, unit: '시' }, { answer: 30, unit: '분' }], {
        figure: conditions([`${h}시와 ${h + 1}시 사이의 시각이다.`, '긴바늘이 6을 가리킨다.']), explain: `긴바늘이 6을 가리키면 몇 시 30분이다. ${h}시와 ${h + 1}시 사이이므로 ${h}시 30분이다.`,
        facts: { calc: [[String(h), 0], ['30', 1]], unseen: [30] }
      });
    }),
    T('half-wrong', '몇 시 30분을 잘못 읽은 것 찾기', '①43 심31', (d) => {
      // 하나만 짧은바늘이 다가가는 수로 읽었다(2와 3 사이를 3시 30분으로).
      const hours = d.shuffle(HALF_HOURS).slice(0, 4), bad = d.int(0, 3), read = hours.map((h, i) => (i === bad ? h + 1 : h));
      return C('시계 아래에 읽은 시각을 적었다. 몇 시 30분을 잘못 읽은 것은?', TAGS.slice(0, 4), bad, {
        figure: G.tiles(hours.map((h, i) => [`${TAGS[i]} ${read[i]}시 30분`, clock(h + 0.5, 6)])), explain: `${TAGS[bad]}의 시계는 ${halfSaid(hours[bad])} 짧은바늘이 지나온 수가 시이다.`,
        facts: { claimed: hours.map((h, i) => [`${h}*60+30`, read[i] * 60 + 30]), claimedWant: false }
      });
    }),
    T('half-earlier', '두 시각 가운데 더 이른(늦은) 것', '①47 심35', (d) => {
      const [what, ask, rule, lo] = d.pick([['아침에 일어난 시각', '더 일찍 일어난 사람', 'min', 7], ['학교에 온 시각', '더 일찍 온 사람', 'min', 7], ['밤에 잠자리에 든 시각', '더 늦게 잠자리에 든 사람', 'max', 8], ['집에 돌아온 시각', '더 늦게 돌아온 사람', 'max', 2]]);
      const who = d.shuffle(NAMES).slice(0, 2), times = d.until(() => [[lo + d.int(0, 2), d.bool()], [lo + d.int(0, 2), d.bool()]], ([a, b]) => (a[1] || b[1]) && [30, 60].includes(Math.abs(value(a) - value(b))));
      const at0 = (rule === 'min') === (value(times[0]) < value(times[1])) ? 0 : 1;
      return C(`${name(who[0], '과/와')} ${name(who[1], '이/가')} ${what}이다. ${ask}은?`, who, at0, {
        figure: G.tiles(times.map((t, i) => [who[i], face(t)])), explain: `${name(who[0], '은/는')} ${at(times[0])}, ${name(who[1], '은/는')} ${at(times[1])}이다. 더 ${rule === 'min' ? '이른' : '늦은'} 시각은 ${at(times[at0])}이다.`,
        facts: { choose: { exprs: times.map(mins), rule }, unseen: [60, 30] }
      });
    }),
    T('half-order', '세 시각을 이른 차례로 놓기', '심36', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), times = d.until(() => [0, 1, 2].map(() => [d.int(7, 9), d.bool()]), (list) => new Set(list.map(value)).size === 3 && list.some((t) => t[1]) && list.some((t) => !t[1]));
      const right = [0, 1, 2].sort((p, q) => value(times[p]) - value(times[q])), orders = d.shuffle([right].concat(d.shuffle(K.ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3)));
      return C('세 사람이 학교에 온 시각이다. 먼저 온 사람부터 차례로 쓴 것은?', orders.map((o) => o.map((i) => who[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: G.tiles(times.map((t, i) => [who[i], face(t)])), explain: times.map((t, i) => `${who[i]} ${at(t)}`).join(', ') + '이다. 이른 시각부터 차례로 쓴다.',
        facts: { choose: { exprs: times.map(mins), rule: 'ascending', orders }, unseen: [60, 30] }
      });
    }),
    T('half-plan', '계획표에서 시계의 시각에 할 일 찾기', '심37', (d) => {
      const who = d.pick(NAMES), acts = d.shuffle([0, 1, 2, 3, 4]).slice(0, 3).sort((x, y) => x - y).map((i) => ['숙제하기', '운동하기', '저녁 먹기', '책 읽기', '일기 쓰기'][i]);
      const times = d.until(() => [0, 1, 2].map(() => [d.int(4, 8), d.bool()]).sort((a, b) => value(a) - value(b)), (list) => new Set(list.map(value)).size === 3 && list.some((t) => t[1]) && list.some((t, i) => i > 0 && value(t) - value(list[i - 1]) === 30) && list.every((t) => !(t[1] && (t[0] === 5 || t[0] === 6))));
      const at0 = d.int(0, 2);
      return C(`${nick(who)}의 저녁 계획표이다. 시계가 나타내는 시각에 할 일은?`, acts, at0, {
        figure: face(times[at0], 112) + table(['시각', '할 일'], times.map((t, i) => [at(t), acts[i]])), explain: `시계는 ${said(times[at0])} ${at(times[at0])}에 할 일은 ${acts[at0]}이다.`,
        facts: { kindPick: { kinds: times.map(value), target: value(times[at0]) } }
      });
    }),
    T('half-story', '두 시계를 읽어 문장 채우기', '①38 심29', (d) => {
      const who = d.pick(NAMES), firstHalf = d.bool(), a = firstHalf ? d.int(7, 8) : d.int(6, 7), b = a + 1;
      const text = firstHalf ? `${box(LABELS[0])}시 ${box(LABELS[1])}분에 일어나서 ${box(LABELS[2])}시에 학교에 갔다.` : `${box(LABELS[0])}시에 일어나서 ${box(LABELS[1])}시 ${box(LABELS[2])}분에 학교에 갔다.`;
      const answers = firstHalf ? [a, 30, b] : [a, b, 30], times = firstHalf ? [[a, true], [b, false]] : [[a, false], [b, true]];
      return M(`${name(who, '이/가')} 아침에 한 일이다. ㉠, ㉡, ㉢에 알맞은 수는?`, answers.map((answer, i) => ({ label: LABELS[i], answer })), {
        figure: G.tiles(times.map((t, i) => [['일어난 시각', '학교에 간 시각'][i], face(t)])) + lines([text]), explain: `일어난 시각은 ${at(times[0])}, 학교에 간 시각은 ${at(times[1])}이다.`,
        facts: { calc: answers.map((answer, i) => [String(answer), i]), unseen: [30] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
