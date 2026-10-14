// 6학년 1학기 2단원 각기둥과 각뿔 — 각기둥의 전개도, 전개도를 접었을 때, 각뿔, 각뿔의 이름과 구성 요소, 각기둥과 각뿔의 기본 문항.
// 단원 틀과 그림 도구(B.kit.solid612)는 6-1-2a.js 에 있다. 실력 문항은 6-1-2c.js, 대조표는 수집본의 _분석/6-1-2/싣기_대조표.md.
//
// 싣는 기준(6-1-2a.js 에 적은 것 말고)
//  - 전개도는 옆면을 한 줄로 잇고 두 밑면을 위와 아래에 하나씩 붙인 간단한 꼴만 쓴다(삼각·사각·오각·육각기둥). 각뿔의 전개도는 하나도 싣지 않는다.
//  - 교육과정이 평가의 중점으로 꼽은 「전개도가 될 수 있는 것과 될 수 없는 것 구별하기」는 「되는 것 하나 / 안 되는 것 하나 / 모두 / 이름에 맞는 것」과 까닭 고르기,
//    빠뜨린 밑면을 그려 넣을 자리, 겨냥도에 맞는 전개도 고르기로 넉넉히 실었다. 틀린 그림은 되는 전개도에서 한 군데만 바꾼 것이다:
//    옆면을 하나 더·덜 그린 것, 밑면을 하나만 그린 것, 두 밑면을 같은 쪽에 붙인 것, 옆면 하나의 높이를 다르게 그린 것. 되는지 안 되는지는 judge 가 판정한다.
//  - 전개도를 접었을 때 만나는 점·맞닿는 선분은 전개도의 점마다 접었을 때의 꼭짓점을 매겨(foldMap) 답을 낸다. 점 이름은 교과서처럼 테두리를 따라 ㄱ부터 붙인다.
//  - 각뿔의 높이를 읽는 그림은 밑면·모서리·높이의 길이가 서로 맞는 수(직각삼각형의 세 변)만 써서 비율대로 그린다.
//  - 수가 든 설명의 참·거짓, 수의 크기 비교는 규칙으로 셈한 값으로 가린다. 면·모서리·꼭짓점의 수를 더하고 빼는 것은 싣지 않는다.
//
// 뺀 것과 까닭(이 파일의 다섯 묶음)
//  - 사각기둥의 전개도에서 옆면끼리 평행한 면 찾기(①34 ②44 심51의 변형): 직육면체의 마주 보는 면이라 5-2-5 「전개도에서 평행한 면」이 이미 묻는다. 여기서는 두 밑면이 평행하다는 것만 묻는다.
//  - 옆면을 이은 선분의 길이·밑면의 둘레(①40의 변형 ①71 ②65 ③54 심54): 밑면의 변을 여럿 더하는 길이 셈이다. 맞닿는 변의 길이를 한 번 읽는 것만 실었다.
//  - 전개도 그리기·완성하기(①41 ②50~52 ③65·66·68 심55·56): 「빠뜨린 밑면을 그려 넣을 자리」「겨냥도에 맞는 전개도」「접었을 때 다른 각기둥이 되는 전개도」로 바꾸어 실었다. 겨냥도 완성하기(②53)는 5학년 겨냥도의 작도다.
//  - 각뿔에서 색칠한 옆면과 만나는 면의 수(①48의 변형): 이웃하지 않은 옆면끼리는 각뿔의 꼭짓점 한 점에서만 닿아 「만난다」고 볼지 갈린다.
//  - 이름표가 바르게 붙은 각뿔 고르기·그림과 이름 잇기(②15 ③12·27 심14의 변형): 「겨냥도를 보고 이름 쓰기」와 같은 판단이다.
//  - 한 밑면의 변의 수를 듣고 이름 쓰기(①15·50의 변형): 「밑면의 모양을 보고 이름 쓰기」와 같은 판단이다.
//  - 옆면 한 장과 그 수에서 밑면의 둘레(심58), 모든 모서리의 길이의 합(①70 ②63 심59): 둘레·여러 단계의 길이 셈이다. 옆면에서 밑면의 한 변을 읽는 것만 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C } = B.kit;
  const K = B.kit.solid612;
  const { TAGS, MARKS, POINTS, cm, fixed, gon, prismName, pyramidName, PRISM, PYRAMID, PRISM_EXPR, PYRAMID_EXPR, PART, PARTS, setOptions, say, pickWord, canvas, word, wide, tiles, ptsOf, YELLOW, BLUE, near, regular, regularSide, triangle,
    edgeKey, upPrism, upPyramid, faceSaid, draw, seenEdges, flatShape, netOf, judge, isNet, whyText, FAKE, foldMap, outlineOf, cutsOf, netArt, overlap2,
    countsOf, describe, TILE, prismOf, pyramidOf, SHAPES, whyNotPyramid, basePolygon, nameOptions, widestSide, prismLens } = K;
  const SOLID = '6수03-05', NET = '6수03-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const carry = (a, b, c, d2) => { const t = Math.atan2(d2[1] - c[1], d2[0] - c[0]) - Math.atan2(b[1] - a[1], b[0] - a[0]), co = Math.cos(t), si = Math.sin(t); return (p) => [c[0] + (p[0] - a[0]) * co - (p[1] - a[1]) * si, c[1] + (p[0] - a[0]) * si + (p[1] - a[1]) * co]; };
  // 글이 선이나 다른 글과 겹치지 않는 그림이 나올 때까지 몇 번 다시 그린다(make 는 그림을 돌려준다).
  const neat = (make, ok) => { let out = null; for (let i = 0; i < 10; i += 1) { out = make(i); if (ok()) break; } return out; };

  // ── 문제에 쓰는 전개도 ───────────────────────────────────────
  // n: 3(정삼각형), 4(직사각형), 5·6(정다각형)인 밑면. 두 밑면을 붙일 옆면은 씨앗마다 달라진다. o: { apart: 서로 다른 옆면에 붙인다 }
  const BASES = { 3: () => regularSide(3, 3), 4: (d) => d.pick([[[0, 0], [3, 0], [3, 2], [0, 2]], [[0, 0], [2, 0], [2, 3], [0, 3]]]), 5: () => regularSide(5, 2), 6: () => regularSide(6, 2), 7: () => regularSide(7, 2) };
  const TALL = { 3: [3.6, 4.4], 4: [3.6, 4.4], 5: [2.8, 3.4], 6: [3, 3.6], 7: [3, 3.6] };
  function netFor(d, n, o) {
    const opt = o || {}, top = d.int(0, n - 1), bottom = opt.apart ? d.until(() => d.int(0, n - 1), (b) => b !== top) : d.int(0, n - 1);
    return netOf(BASES[n](d), d.pick(TALL[n]), { top, bottom });
  }
  // 전개도가 되지 않게 한 군데를 바꾼 그림. kind: FAKE 의 이름
  const fakeOf = (d, n, kind) => d.until(() => FAKE[kind](netFor(d, n, { apart: true }), d), (net) => net && !isNet(net));
  const netSaid = (net) => (net.bases.length ? `${gon(net.bases[0].pts.length)} 모양의 면 ${net.bases.length}개와 ` : '') + `직사각형 모양의 면 ${net.rects.length}개를 이어 붙인 그림`;
  const netTile = (net, o) => netArt(net, Object.assign({ most: [116, 132], label: netSaid(net) }, o || {}));
  const netTiles = (list, o) => tiles(list.map((net) => netTile(net, o)));
  const sidesIn = (net) => net.bases[0].pts.length;
  // 면에 가, 나, 다 … 를 적은 전개도(위쪽 밑면, 옆면들, 아래쪽 밑면의 차례) / 테두리의 점에 ㄱ, ㄴ, ㄷ … 을 적은 전개도
  const lettered = (net, o) => netArt(net, Object.assign({ most: [280, 220], faceText: TAGS, label: `각기둥의 전개도. 면에 가부터 ${TAGS[net.rects.length + net.bases.length - 1]}까지 적었다.` }, o || {}));
  const pointed = (net, ring, o) => netArt(net, Object.assign({ most: [280, 230], names: POINTS, label: `각기둥의 전개도. 테두리의 점에 ㄱ부터 ${POINTS[ring.length - 1]}까지 이름을 붙였다.` }, o || {}));
  // 전개도의 테두리: ring(점), cuts(자른 선분), ids(점마다 접었을 때의 꼭짓점)
  const netInfo = (net) => { const ring = outlineOf(net), fm = foldMap(net); return { ring, cuts: cutsOf(net, ring), ids: ring.map((p) => fm.at(p)) }; };
  const partnerOf = (cuts, cut) => cuts.find((x) => x !== cut && x.edge === cut.edge);
  const adjoin = (s, t) => t.a === s.b || t.b === s.a;
  // 접었을 때 두 밑면을 잇는 모서리가 되는 선분인가(옆면 한 줄의 양 끝)
  const isUpright = (cut) => /T/.test(cut.edge) && /B/.test(cut.edge);
  const whyClaims = (net) => [
    ['옆면의 수가 한 밑면의 변의 수와 다르다.', net.rects.length !== sidesIn(net)],
    ['두 밑면이 옆면의 같은 쪽에 붙어 있어서 접으면 서로 겹친다.', net.bases.length === 2 && net.bases[0].on === net.bases[1].on],
    ['밑면이 2개가 아니다.', net.bases.length !== 2],
    ['옆면의 높이가 서로 다르다.', net.rects.some((r) => !near(r.h, net.rects[0].h))]];
  Object.assign(K, { neat, BASES, TALL, netFor, fakeOf, netSaid, netTile, netTiles, sidesIn, lettered, pointed, netInfo, partnerOf, adjoin, isUpright, whyClaims });

  // ── 각기둥의 전개도 ──────────────────────────────────────────
  B.addTypes('6-1-2', 'net', [
    T('net-word', '전개도의 뜻', '①27 ②1 ③55', (d, n) => (n === 0
      ? pickWord(d, '각기둥의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 무엇이라고 하는가?', '전개도', ['겨냥도', '밑면', '옆면'], '각기둥의 모서리를 잘라서 평면 위에 펼쳐 놓은 그림을 각기둥의 전개도라고 한다.')
      : pickWord(d, '각기둥의 전개도에서 접는 선과 자르는 선은 각각 어떻게 그리는가?', '접는 선은 점선, 자르는 선은 실선으로 그린다.', ['접는 선은 실선, 자르는 선은 점선으로 그린다.', '모두 실선으로 그린다.', '모두 점선으로 그린다.'], '전개도에서 잘린 모서리는 실선으로, 잘리지 않고 접히는 모서리는 점선으로 그린다.')), { count: 2 }),
    T('net-name', '전개도를 보고 각기둥의 이름 쓰기', '①28 ②38 ③58 심44', (d) => {
      const n = d.pick([3, 4, 5, 6]), made = nameOptions(d, prismName(n), [pyramidName(n), prismName(n + 2), prismName(n + 1), prismName(n === 4 ? 6 : 4), prismName(n === 3 ? 5 : n - 1)]);
      return C('전개도를 접었을 때 만들어지는 각기둥의 이름은?', made.options, made.answer, {
        figure: netArt(netFor(d, n), { most: [250, 200], label: '각기둥의 전개도' }),
        explain: `전개도에서 두 밑면의 모양이 ${gon(n)}이고 직사각형 모양의 옆면이 ${n}개이다. 밑면의 모양이 ${gon(n)}이므로 ${prismName(n)}이다.`, facts: { truth: made.truth, want: true }
      });
    }),
    T('net-odd-name', '접었을 때 다른 각기둥이 되는 전개도', '①28 ②52 ③68 심44', (d) => {
      // 같은 각기둥도 밑면을 붙이는 자리에 따라 전개도의 모양이 달라진다. 모양이 달라 보이는 둘은 같은 각기둥이고, 밑면의 변의 수가 다른 하나가 답이다.
      const [n, m] = d.pick([[5, 6], [6, 5], [4, 5], [5, 4]]), key = (net) => net.bases.map((b) => b.at).join(), made = d.until(() => [netFor(d, n, { apart: true }), netFor(d, n, { apart: true })], ([a, b]) => key(a) !== key(b));
      const items = d.shuffle(made.concat([netFor(d, m, { apart: true })])), kinds = items.map((net, i) => (sidesIn(net) === m ? 'odd' : 'same' + i)), at = kinds.indexOf('odd');
      return C('전개도를 접었을 때 만들어지는 각기둥이 나머지와 다른 하나는?', TAGS.slice(0, 3), at, {
        figure: netTiles(items), explain: `${TAGS[at]}는 밑면이 ${gon(m)}이라서 ${prismName(m)}이 되고, 나머지는 밑면이 ${gon(n)}이라서 ${prismName(n)}이 된다. 같은 각기둥도 밑면을 붙이는 자리에 따라 전개도의 모양이 달라진다.`,
        facts: { kindPick: { kinds, target: 'odd' } }
      });
    }),
    T('net-sides-only', '옆면만 그린 전개도', '①29 ②38 ③67 심44', (d) => {
      const n = d.pick([3, 4, 5, 6, 7]), net = { rects: netOf(regularSide(n, n === 3 ? 3 : 2), d.pick(TALL[n])).rects, bases: [] }, made = nameOptions(d, prismName(n), [prismName(n + 1), prismName(n === 3 ? 5 : n - 1), pyramidName(n), prismName(n + 2)]);
      return C('어떤 각기둥의 전개도에서 옆면만 그린 것이다. 이 각기둥의 이름은?', made.options, made.answer, {
        figure: netArt(net, { most: [270, 120], label: netSaid(net) }),
        explain: `옆면이 ${n}개이다. 각기둥의 옆면의 수는 한 밑면의 변의 수와 같으므로 밑면은 ${gon(n)}이고, 이 각기둥은 ${prismName(n)}이다.`, facts: { truth: made.truth, want: true }
      });
    }),
    T('net-shapes', '전개도에 있는 도형', '①30', (d) => {
      const n = d.pick([3, 5, 6]), labels = d.shuffle(['원', '삼각형', '직사각형', '오각형', '육각형']), flags = labels.map((w) => w === gon(n) || w === '직사각형'), made = setOptions(d, labels, flags);
      return C(`${prismName(n)}의 전개도에 있는 도형을 모두 고른 것은?`, made.options, made.answer, {
        explain: `${prismName(n)}의 전개도에는 ${gon(n)} 모양의 밑면 2개와 직사각형 모양의 옆면 ${n}개가 있다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('net-face-count', '전개도에 그릴 밑면과 옆면의 수', '②50 ③65', (d) => {
      const n = d.int(3, 8), c = countsOf(prismOf(d, n));
      return M(`${prismName(n)}의 전개도를 그리려고 한다. 밑면과 옆면을 각각 몇 개 그려야 하는가?`, [{ label: '밑면', answer: 2, unit: '개' }, { label: '옆면', answer: c.face - 2, unit: '개' }], {
        explain: `각기둥의 밑면은 2개이고, 옆면의 수는 한 밑면의 변의 수와 같다. ${josa(prismName(n), '은/는')} 밑면이 ${gon(n)}이므로 옆면을 ${n}개 그린다.`, facts: { calc: [['2', 0], [String(n), 1]], unseen: [2, n] }
      });
    }),
    T('net-count', '전개도를 접은 각기둥의 모서리·꼭짓점의 수', '①36 ②39 ③59 심45', (d) => {
      const n = d.pick([3, 4, 5, 6]), part = d.pick(['edge', 'vert']), c = countsOf(prismOf(d, n));
      return N(`전개도를 접어서 만든 각기둥의 ${josa(PART[part], '은/는')} 모두 몇 개인가?`, c[part], {
        unit: '개', figure: netArt(netFor(d, n), { most: [250, 200], label: '각기둥의 전개도' }),
        explain: `밑면이 ${gon(n)}이므로 접으면 ${prismName(n)}이 된다. ${prismName(n)}의 ${PART[part]}의 수는 ${n} × ${part === 'edge' ? 3 : 2} = ${c[part]}이다. 전개도에 그어진 선분의 수가 아니라 접은 뒤의 수를 센다.`,
        facts: { calc: [[PRISM_EXPR[part](n), 0]], unseen: [n, 2, 3] }
      });
    }),
    T('net-yes', '각기둥의 전개도가 될 수 있는 것', '①37 ②41 ③56 심46', (d) => {
      // 틀린 그림은 밑면이 직사각형이 아닌 각기둥으로 만든다(사각기둥은 밑면과 옆면이 모두 직사각형이라 어느 면을 밑면으로 보는지에 따라 까닭이 달라 보인다).
      const n = d.pick([3, 5, 6]), kinds = d.shuffle([d.pick(['more', 'fewer']), 'one', 'side', 'height']).slice(0, 3);
      const items = d.shuffle([netFor(d, n)].concat(kinds.map((k) => fakeOf(d, n, k)))), flags = items.map(isNet), at = flags.indexOf(true);
      return C('각기둥의 전개도가 될 수 있는 것은?', TAGS.slice(0, 4), at, {
        figure: netTiles(items),
        explain: `${TAGS[at]}는 합동인 두 밑면이 옆면의 위쪽과 아래쪽에 하나씩 있고, 옆면이 한 밑면의 변의 수만큼 있다. ` + items.map((net, i) => (i === at ? '' : `${TAGS[i]}는 ${whyText(net)}.`)).filter(Boolean).join(' '),
        facts: { kindPick: { kinds: flags.map((ok, i) => (ok ? 'net' : 'no' + i)), target: 'net' } }
      });
    }),
    T('net-no', '각기둥의 전개도가 될 수 없는 것', '①38 ②41 ③56 심46', (d) => {
      const ns = d.shuffle([3, 5, 6]), fake = fakeOf(d, ns[2], d.pick(['more', 'fewer', 'one', 'side', 'height']));
      const items = d.shuffle([netFor(d, ns[0]), netFor(d, ns[1]), netFor(d, 4)].concat([fake])), flags = items.map(isNet), at = flags.indexOf(false);
      return C('각기둥의 전개도가 될 수 없는 것은?', TAGS.slice(0, 4), at, {
        figure: netTiles(items), explain: `${TAGS[at]}는 ${whyText(items[at])}. 나머지는 합동인 두 밑면이 옆면의 위쪽과 아래쪽에 하나씩 있고, 옆면이 한 밑면의 변의 수만큼 있어서 접으면 각기둥이 된다.`,
        facts: { kindPick: { kinds: flags.map((ok, i) => (ok ? 'net' + i : 'no')), target: 'no' } }
      });
    }),
    T('net-all', '각기둥의 전개도 모두 고르기', '①37 ②41 ③56 심46', (d) => {
      const ns = d.shuffle([3, 5, 6]), kinds = d.shuffle(['more', 'fewer', 'one', 'side', 'height']);
      const items = d.shuffle([netFor(d, d.pick([4, ns[2]])), netFor(d, ns[2] === 3 ? 5 : 3), fakeOf(d, ns[0], kinds[0]), fakeOf(d, ns[1], kinds[1])]), flags = items.map(isNet), made = setOptions(d, TAGS.slice(0, 4), flags);
      return C('접어서 각기둥을 만들 수 있는 것을 모두 고른 것은?', made.options, made.answer, {
        figure: netTiles(items), explain: items.map((net, i) => (flags[i] ? '' : `${TAGS[i]}는 ${whyText(net)}. `)).join('') + `${TAGS.filter((_, i) => flags[i]).join(', ')}는 접으면 겹치거나 비는 면 없이 각기둥이 된다.`,
        facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets } }
      });
    }),
    T('net-of-name', '이름에 맞는 전개도 고르기', '②40', (d) => {
      // 밑면의 모양과 옆면의 수를 함께 본다: 이름이 다른 각기둥의 전개도 하나와, 밑면의 모양은 같지만 접어도 각기둥이 되지 않는 그림 둘을 섞는다.
      const n = d.pick([3, 5]), kinds = d.shuffle(['more', 'fewer', 'side', 'one']).slice(0, 2);
      const items = d.shuffle([['ok', netFor(d, n)], ['other', netFor(d, n + 1)], ['no0', fakeOf(d, n, kinds[0])], ['no1', fakeOf(d, n, kinds[1])]]), at = items.findIndex((it) => it[0] === 'ok');
      return C(`${prismName(n)}의 전개도는?`, TAGS.slice(0, 4), at, {
        figure: netTiles(items.map((it) => it[1])),
        explain: `${prismName(n)}의 전개도에는 ${gon(n)} 모양의 밑면 2개가 옆면의 위쪽과 아래쪽에 하나씩 있고 옆면이 ${n}개 있다. ` + items.map((it, i) => (it[0] === 'ok' ? '' : it[0] === 'other' ? `${TAGS[i]}는 ${prismName(n + 1)}의 전개도이다.` : `${TAGS[i]}는 ${whyText(it[1])}.`)).filter(Boolean).join(' '),
        facts: { kindPick: { kinds: items.map((it) => (it[0] === 'ok' && isNet(it[1]) && sidesIn(it[1]) === n ? 'ok' : it[0])), target: 'ok' } }
      });
    }),
    T('net-why', '전개도가 될 수 없는 까닭', '①38 ②42 ③57 심47', (d, k) => {
      // 까닭 쓰기를 까닭 고르기로 바꾸었다. 보기마다 참·거짓을 그림의 얼개로 따지고, 참인 까닭이 하나뿐인 그림만 쓴다.
      const kind = [d.pick(['more', 'fewer']), 'side', d.pick(['height', 'one'])][k], net = d.until(() => fakeOf(d, d.pick([3, 5]), kind), (x) => whyClaims(x).filter((r) => r[1]).length === 1), rows = d.shuffle(whyClaims(net));
      const text = ['다음 그림은 각기둥의 전개도가 될 수 없다. 그 까닭으로 알맞은 것은?', '각기둥의 전개도를 잘못 그렸다. 잘못 그린 까닭으로 알맞은 것은?', '다음 그림을 접어서 각기둥을 만들 수 없는 까닭으로 알맞은 것은?'][k];
      return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: netArt(net, { most: [240, 190], label: netSaid(net) }), explain: `이 그림은 ${whyText(net)}. 각기둥의 전개도에는 합동인 밑면 2개가 옆면의 위쪽과 아래쪽에 하나씩 있고, 높이가 같은 옆면이 한 밑면의 변의 수만큼 있어야 한다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { count: 3 }),
    T('net-add-face', '빠뜨린 밑면을 그려 넣을 자리', '①41 ②50 ③65 심55', (d) => {
      // 전개도 완성하기를 고르기로 바꾸었다. 후보: 아래쪽(옳은 자리), 이미 밑면이 있는 위쪽의 다른 옆면, 옆면 한 줄의 왼쪽 끝과 오른쪽 끝
      const made = d.until(() => {
        const n = d.pick([3, 5]), base = BASES[n](d), h = d.pick(TALL[n]), top = d.int(0, n - 1), bottom = d.int(0, n - 1), full = netOf(base, h, { top, bottom }), W = full.rects[n - 1].x + full.rects[n - 1].w, shape = full.bases[0].pts, s = full.rects[0].w;
        const good = { pts: full.bases[1].pts, ok: true }, ups = [...Array(n).keys()].filter((k) => k !== top).map((k) => ({ pts: netOf(base, h, { top: k }).bases[0].pts, ok: false }));
        const left = { pts: shape.map(carry(shape[0], shape[1], [0, s], [0, 0])), ok: false }, right = { pts: shape.map(carry(shape[0], shape[1], [W, 0], [W, s])), ok: false };
        const picks = [good], rest = { rects: full.rects, bases: [full.bases[0]] }, taken = [full.bases[0].pts].concat(full.rects.map(K.rectPts));
        for (const cand of d.shuffle([d.pick(ups), left, right].concat(d.shuffle(ups)))) if (picks.length < 4 && !picks.includes(cand) && !picks.concat(taken.map((pts) => ({ pts }))).some((p) => overlap2(p.pts, cand.pts))) picks.push(cand);
        // 아래쪽 자리가 정말로 전개도가 되고 위쪽 자리는 되지 않는지 판정한다(옆면의 끝에 붙이는 자리는 밑면이 옆면의 가로와 맞닿지 않으므로 되지 않는다).
        const fits = (c) => (c === left || c === right ? false : isNet({ rects: full.rects, bases: [full.bases[0], { on: c === good ? 'bottom' : 'top', at: c === good ? bottom : ups.indexOf(c) + (ups.indexOf(c) >= top ? 1 : 0), pts: c.pts }] }));
        const order = d.shuffle(picks);
        return picks.length === 4 && order.every((c) => fits(c) === c.ok) ? { n, rest, order } : null;
      }, Boolean), at = made.order.findIndex((c) => c.ok);
      return C('각기둥의 전개도를 그리다가 밑면 1개를 빠뜨렸다. 빠뜨린 밑면을 그려 넣을 수 있는 곳은?', MARKS.slice(0, 4), at, {
        figure: netArt(made.rest, { most: [280, 230], ghosts: made.order.map((c, i) => ({ pts: c.pts, text: MARKS[i] })), label: `밑면을 1개만 그린 ${prismName(made.n)}의 전개도. 둘레의 빈자리 네 곳에 ㉠, ㉡, ㉢, ㉣` }),
        explain: `두 밑면은 접었을 때 서로 마주 보아야 하므로, 이미 그린 밑면의 반대쪽에서 옆면의 가로와 맞닿게 그린다. ${MARKS[at]}에 그리면 접었을 때 각기둥이 된다. 이미 그린 밑면과 같은 쪽에 그리면 접었을 때 두 밑면이 겹치고, 옆면의 끝에 그리면 밑면의 변이 옆면의 가로와 맞닿지 않는다.`,
        facts: { kindPick: { kinds: made.order.map((c, i) => (c.ok ? 'ok' : 'no' + i)), target: 'ok' } }
      });
    }),
    T('net-of-sketch', '겨냥도에 맞는 전개도 고르기', '①37 ②51 ③56·66 심55', (d) => {
      // 겨냥도를 보고 전개도 그리기를 고르기로 바꾸었다: 크기가 맞는 전개도, 높이가 다른 각기둥의 전개도, 접어도 각기둥이 되지 않는 그림. 밑면은 세 변이 3 cm, 4 cm, 5 cm인 직각삼각형(모눈의 점 위에 놓인다).
      const tri = triangle(3, 4, 5), h = d.pick([5, 6]), h2 = h + d.pick([-2, 2]), spot = () => ({ top: d.int(0, 1), bottom: d.int(0, 1) }), solid = upPrism(tri, h, d.bool());
      const items = d.shuffle([['ok', netOf(tri, h, spot())], ['tall', netOf(tri, h2, spot())], ['no', d.until(() => FAKE[d.pick(['more', 'one'])](netOf(tri, h, spot()), d), Boolean)]]), at = items.findIndex((it) => it[0] === 'ok');
      const fitsSketch = (net) => isNet(net) && near(net.rects[0].h, h);
      return C('모눈 한 칸의 길이는 1 cm이다. 겨냥도의 각기둥을 만들 수 있는 전개도는?', TAGS.slice(0, 3), at, {
        figure: draw(solid, { size: [96, 112], lens: prismLens(solid), label: `각기둥의 겨냥도. 밑면의 세 변 3 cm, 4 cm, 5 cm, 높이 ${h} cm` }) + tiles(items.map((it) => netArt(it[1], { unit: Math.min(9.4, 112 / Math.max(...items.map((x) => Math.ceil(K.boundsOf(K.piecesOf(x[1])).w)))), grid: true, label: '모눈종이에 ' + netSaid(it[1]) }))),
        explain: `${TAGS[at]}는 세 변이 3칸, 4칸, 5칸인 삼각형 모양의 밑면이 2개이고, 가로가 3칸, 4칸, 5칸이고 세로가 ${h}칸인 옆면이 3개이다. ` + items.map((it, i) => (it[0] === 'ok' ? '' : it[0] === 'tall' ? `${TAGS[i]}는 옆면의 세로가 ${h2}칸이라서 높이가 다르다.` : `${TAGS[i]}는 ${whyText(it[1])}.`)).filter(Boolean).join(' '),
        facts: { kindPick: { kinds: items.map((it, i) => (fitsSketch(it[1]) ? 'ok' : 'no' + i)), target: 'ok' } }
      });
    }),
    T('net-say', '각기둥의 전개도에 대한 설명', '①38 ③56·68 심46', (d) => say(d, '각기둥의 전개도에 대한 설명으로 옳지 않은 것은?',
      ['접었을 때 맞닿는 선분은 길이가 같다.', '두 밑면은 서로 합동이다.', '옆면은 모두 직사각형이다.', '옆면의 수는 한 밑면의 변의 수와 같다.', '어느 모서리를 자르는가에 따라 여러 가지 모양으로 그릴 수 있다.'],
      [['한 가지 모양으로만 그릴 수 있다.', '어느 모서리를 자르는가에 따라 전개도의 모양이 달라진다.'], ['접었을 때 두 밑면이 서로 겹친다.', '접었을 때 겹치는 면이 없어야 하고, 두 밑면은 서로 마주 본다.'], ['접었을 때 맞닿는 선분의 길이가 서로 달라도 된다.', '맞닿는 선분은 한 모서리가 되므로 길이가 같아야 한다.'],
        ['옆면의 수는 한 밑면의 변의 수보다 많다.', '옆면의 수는 한 밑면의 변의 수와 같다.'], ['밑면은 1개만 그린다.', '각기둥의 밑면은 2개이므로 전개도에도 밑면을 2개 그린다.']], false, '각기둥의 전개도는 합동인 밑면 2개와 직사각형 모양의 옆면으로 이루어진다.'))
  ]);

  // ── 전개도를 접었을 때 ───────────────────────────────────────
  const TRIS = [[3, 4, 5], [5, 6, 7], [4, 5, 6], [6, 7, 8]];
  // 밑면의 세 변과 높이가 모두 다른 삼각기둥
  const oddTriangle = (d) => { const [a, b, c] = d.shuffle(d.pick(TRIS)); return { a, b, c, h: d.until(() => d.int(6, 10), (v) => ![a, b, c].includes(v)) }; };
  const lenAt = (cut) => Math.round(cut.len * 100) / 100;
  // 삼각기둥의 전개도: 두 밑면을 서로 다른 옆면에 붙인다(밑면의 변마다 테두리에 그 길이의 선분이 남는다).
  const triNet = (d, tri, h) => { const [top, bottom] = d.shuffle([0, 1, 2]); return netOf(tri, h, { top, bottom }); };
  B.addTypes('6-1-2', 'fold', [
    T('fold-bases', '전개도에서 밑면과 옆면 찾기', '①31·35 ②43·45 ③62·63 심48·51', (d, k) => {
      // 같은 묶음의 세 문항(밑면 찾기, 수직인 면, 평행한 면)에 같은 그림이 겹치지 않게 밑면의 모양을 나누어 쓴다: 육각형 / 삼각형 / 오각형
      const n = k === 0 ? 6 : 3, net = netFor(d, n), last = n + 1, isSide = (i) => i >= 1 && i <= n;
      if (k === 0) {
        const key = (p) => p.slice().sort((a, b) => a - b).map((i) => TAGS[i]).join(', '), right = [0, last], rows = d.shuffle([right, [0, d.int(1, n)], [1, n], [d.int(1, n), last]]), ok = (p) => p.every((i) => !isSide(i));
        return C('전개도를 접어서 각기둥을 만들 때 밑면이 되는 면을 모두 고른 것은?', rows.map(key), rows.findIndex(ok), {
          figure: lettered(net), explain: `각기둥의 밑면은 서로 합동인 두 면이다. ${gon(n)} 모양의 면 ${TAGS[0]}와 면 ${TAGS[last]}가 밑면이고, 직사각형 모양의 나머지 면은 옆면이다.`, facts: { truth: rows.map(ok), want: true }
        });
      }
      const x = d.pick([0, last]), others = [...Array(n + 2).keys()].filter((i) => i !== x), labels = others.map((i) => TAGS[i]), flags = others.map(isSide), made = setOptions(d, labels, flags);
      return C(`전개도를 접어서 각기둥을 만들었다. 면 ${TAGS[x]}와 수직으로 만나는 면을 모두 고른 것은?`, made.options, made.answer, {
        figure: lettered(net), explain: `면 ${TAGS[x]}는 밑면이다. 밑면과 수직으로 만나는 면은 옆면이므로 직사각형 모양의 면 ${labels.filter((_, i) => flags[i]).join(', ')}를 고른다. 면 ${TAGS[x === 0 ? last : 0]}는 다른 밑면이라서 면 ${TAGS[x]}와 평행하다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('fold-parallel', '전개도를 접었을 때 평행한 면', '①34 ②44 심51', (d) => {
      // 각기둥에서 서로 평행한 면은 두 밑면이다. 전개도에서는 두 밑면이 옆면의 위쪽과 아래쪽에 떨어져 있다.
      const n = 5, net = netFor(d, n, { apart: true }), last = n + 1, x = d.pick([0, last]), other = x === 0 ? last : 0, rows = d.shuffle([other].concat(d.shuffle([...Array(n).keys()].map((i) => i + 1)).slice(0, 3)));
      return C(`전개도를 접어서 각기둥을 만들었을 때 면 ${TAGS[x]}와 평행한 면은?`, rows.map((i) => '면 ' + TAGS[i]), rows.indexOf(other), {
        figure: lettered(net), explain: `${gon(n)} 모양의 면 ${TAGS[x]}와 면 ${TAGS[other]}가 밑면이다. 각기둥의 두 밑면은 서로 평행하다. 직사각형 모양의 옆면은 면 ${TAGS[x]}와 수직으로 만난다.`,
        facts: { truth: rows.map((i) => i === other), want: true }
      });
    }),
    T('fold-seg', '전개도를 접었을 때 맞닿는 선분', '①33 ②46 ③60 심49', (d) => {
      // 한 점에서 이어진 두 선분이 맞닿는 경우를 묻는다(떨어져 있는 두 선분은 실력에 있다).
      const net = netFor(d, d.pick([3, 4])), { ring, cuts } = netInfo(net), s = d.pick(cuts.filter((c) => adjoin(c, partnerOf(cuts, c)))), t = partnerOf(cuts, s);
      const rows = d.shuffle([t].concat(d.shuffle(cuts.filter((c) => c !== s && c !== t)).slice(0, 3)));
      return C(`각기둥의 전개도를 접었을 때 선분 ${s.name}과 맞닿는 선분은?`, rows.map((c) => '선분 ' + c.name), rows.indexOf(t), {
        figure: pointed(net, ring), explain: `선분 ${s.name}과 선분 ${t.name}은 한 점에서 만나 벌어져 있다. 전개도를 접으면 벌어진 틈이 닫히면서 두 선분이 맞닿아 한 모서리가 된다.`,
        facts: { truth: rows.map((c) => c.edge === s.edge), want: true }
      });
    }),
    T('fold-point', '전개도를 접었을 때 만나는 점', '①32 ②47 ③61', (d) => {
      // 만나는 점이 하나뿐인 점을 묻는다(둘인 점은 실력에 있다).
      const made = d.until(() => {
        const net = netFor(d, 4), info = netInfo(net), groups = {};
        info.ids.forEach((id, i) => { (groups[id] = groups[id] || []).push(i); });
        const pairs = Object.keys(groups).map((id) => groups[id]).filter((g) => g.length === 2);
        return pairs.length ? Object.assign(info, { net, pair: d.shuffle(d.pick(pairs)) }) : null;
      }, Boolean), { net, ring, cuts, ids } = made, [p, q] = made.pair, L = ring.length;
      const nearBy = [p - 1, p + 1, q - 1, q + 1].map((i) => (i + L) % L).filter((i) => ids[i] !== ids[p]), others = [...new Set(d.shuffle(nearBy).concat(d.shuffle(ring.map((_, i) => i).filter((i) => ids[i] !== ids[p]))))].slice(0, 3);
      const rows = d.shuffle([q].concat(others)), mine = cuts.filter((c) => c.a === p || c.b === p).map((c) => [c, partnerOf(cuts, c)]).find(([, t]) => t.a === q || t.b === q);
      return C(`사각기둥의 전개도를 접었을 때 점 ${POINTS[p]}과 만나는 점은?`, rows.map((i) => '점 ' + POINTS[i]), rows.indexOf(q), {
        figure: pointed(net, ring), explain: (mine ? `전개도를 접으면 선분 ${mine[0].name}과 선분 ${mine[1].name}이 맞닿는다. ` : '') + `그래서 점 ${POINTS[p]}과 점 ${POINTS[q]}이 한 꼭짓점에서 만난다.`,
        facts: { truth: rows.map((i) => ids[i] === ids[p]), want: true }
      });
    }),
    T('fold-len-fill', '겨냥도를 보고 전개도의 변의 길이 쓰기', '①39 ②48 ③64 심53', (d) => {
      const { a, b, c, h } = oddTriangle(d), tri = triangle(a, b, c), solid = upPrism(tri, h, d.bool());
      const made = neat(() => {
        const net = triNet(d, tri, h), { cuts } = netInfo(net), picks = d.shuffle([a, b, c]).slice(0, 2).concat([h]).map((len) => d.pick(cuts.filter((x) => near(lenAt(x), len)))).sort((p, q) => p.a - q.a);
        return { picks, art: netArt(net, { most: [280, 200], lens: picks.map((x, i) => ({ a: x.at[0], b: x.at[1], text: MARKS[i] })), label: '각기둥의 전개도. 테두리의 세 선분에 ㉠, ㉡, ㉢' }) };
      }, () => netArt.tidy);
      return M('각기둥의 겨냥도와 전개도이다. 전개도에서 ㉠, ㉡, ㉢의 길이는 각각 몇 cm인가?', made.picks.map((x, i) => ({ label: MARKS[i], answer: lenAt(x), unit: 'cm' })), {
        figure: draw(solid, { size: [96, 110], lens: prismLens(solid), label: `각기둥의 겨냥도. 밑면의 세 변 ${a} cm, ${b} cm, ${c} cm, 높이 ${h} cm` }) + made.art,
        explain: `전개도의 밑면은 각기둥의 밑면과 합동이고, 옆면의 세로는 각기둥의 높이와 같다. 접었을 때 맞닿는 선분은 길이가 같으므로 ${made.picks.map((x, i) => `${MARKS[i]}은 ${lenAt(x)} cm`).join(', ')}이다.`,
        facts: { calc: made.picks.map((x, i) => [String(lenAt(x)), i]) }
      });
    }),
    T('fold-height', '전개도를 접은 각기둥의 높이', '①40 ②49 심52', (d) => {
      const { a, b, c, h } = oddTriangle(d), tri = triangle(a, b, c);
      const art = neat(() => {
        const net = triNet(d, tri, h), { cuts } = netInfo(net), given = [a, b, c].map((len) => d.pick(cuts.filter((x) => near(lenAt(x), len) && !isUpright(x)))).concat([d.pick(cuts.filter(isUpright))]);
        return netArt(net, { most: [280, 210], lens: given.map((x) => ({ a: x.at[0], b: x.at[1], text: cm(lenAt(x)) })), label: `각기둥의 전개도. 밑면의 세 변 ${a} cm, ${b} cm, ${c} cm, 옆면의 세로 ${h} cm` });
      }, () => netArt.tidy);
      return N('전개도를 접어서 만든 각기둥의 높이는 몇 cm인가?', h, {
        unit: 'cm', figure: art, explain: `각기둥의 높이는 두 밑면 사이의 거리이고, 전개도에서는 옆면의 세로와 같다. 옆면의 세로가 ${h} cm이므로 높이는 ${h} cm이다. ${a} cm, ${b} cm, ${c} cm는 밑면의 변의 길이이다.`, facts: { calc: [[String(h), 0]] }
      });
    }),
    T('fold-height-seg', '전개도에서 높이와 길이가 같은 선분', '심52', (d) => {
      const net = netFor(d, d.pick([3, 4])), { ring, cuts } = netInfo(net), up = d.pick(cuts.filter(isUpright)), rows = d.shuffle([up].concat(d.shuffle(cuts.filter((c) => !isUpright(c))).slice(0, 3)));
      return C('전개도를 접어서 각기둥을 만들 때, 각기둥의 높이와 길이가 같은 선분은?', rows.map((c) => '선분 ' + c.name), rows.indexOf(up), {
        figure: pointed(net, ring), explain: `각기둥의 높이는 두 밑면을 잇는 모서리의 길이와 같다. 전개도에서 옆면의 세로인 선분 ${up.name}이 접었을 때 두 밑면을 잇는 모서리가 된다. 나머지 선분은 밑면의 변이 된다.`,
        facts: { truth: rows.map(isUpright), want: true }
      });
    }),
    T('fold-len-read', '전개도에서 맞닿는 선분의 길이', '②48 ③64 심49·53', (d) => {
      // 길이가 적힌 선분과 맞닿는 선분의 길이를 읽는다. 묻는 선분은 길이가 적힌 선분과 한 점에서 이어져 있지 않은 것으로 고른다.
      const { a, b, c, h } = oddTriangle(d), tri = triangle(a, b, c);
      const made = d.until(() => {
        const net = triNet(d, tri, h), { ring, cuts } = netInfo(net), far = cuts.filter((x) => !isUpright(x) && !adjoin(x, partnerOf(cuts, x)));
        if (!far.length) return null;
        const g = d.pick(far), s = partnerOf(cuts, g), given = [g].concat([a, b, c].filter((len) => !near(len, lenAt(g))).map((len) => d.pick(cuts.filter((x) => near(lenAt(x), len) && x !== s && !isUpright(x)))));
        const art = pointed(net, ring, { lens: given.map((x) => ({ a: x.at[0], b: x.at[1], text: cm(lenAt(x)) })), label: `각기둥의 전개도. 테두리의 점에 ㄱ부터 ${POINTS[ring.length - 1]}까지 이름을 붙였다. ${given.map((x) => `선분 ${x.name} ${lenAt(x)} cm`).join(', ')}` });
        return netArt.tidy ? { g, s, art } : null;
      }, Boolean), { g, s } = made;
      return N(`각기둥의 전개도에서 선분 ${s.name}의 길이는 몇 cm인가?`, lenAt(s), {
        unit: 'cm', figure: made.art, explain: `전개도를 접으면 선분 ${s.name}은 선분 ${g.name}과 맞닿아 한 모서리가 된다. 맞닿는 선분은 길이가 같으므로 선분 ${s.name}의 길이는 ${lenAt(g)} cm이다.`, facts: { calc: [[String(lenAt(s)), 0]] }
      });
    })
  ]);

  // ── 각뿔 ─────────────────────────────────────────────────────
  // 세운 각뿔의 옆면의 번호(tipSolid): 밑면 0, 옆면 1…
  const slopes = (solid) => solid.faces.map((_, f) => f).slice(1);
  B.addTypes('6-1-2', 'pyramid', [
    T('pyramid-word', '각뿔의 뜻', '①44 ②1 ③17', (d, n) => (n === 0
      ? pickWord(d, '밑면이 다각형이고 옆면이 모두 삼각형인 입체도형을 무엇이라고 하는가?', '각뿔', ['각기둥', '삼각형', '다각형'], '밑에 놓인 면이 다각형이고 옆으로 둘러싼 면이 모두 삼각형인 입체도형을 각뿔이라고 한다.')
      : pickWord(d, '각뿔에서 밑면과 만나는 면을 무엇이라고 하는가?', '옆면', ['밑면', '모서리', '높이'], '각뿔에서 밑에 놓인 면을 밑면, 밑면과 만나는 면을 옆면이라고 한다. 각뿔의 옆면은 모두 삼각형이다.')), { count: 2 }),
    T('pyramid-find', '여러 입체도형 가운데 각뿔 고르기', '①43 ②3 ③18 심1', (d) => {
      const ns = d.shuffle([3, 4, 5, 6]), others = d.shuffle([SHAPES.prism(d), SHAPES.frustum(d), SHAPES.cone(), SHAPES.pillar()]).slice(0, 3);
      const items = d.shuffle([SHAPES.pyramid(d, ns[0]), SHAPES.pyramid(d, ns[1])].concat(others)), flags = items.map((it) => it.pyramid), made = setOptions(d, TAGS.slice(0, 5), flags);
      return C('각뿔을 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())),
        explain: '밑면이 다각형이고 옆면이 모두 삼각형인 입체도형이 각뿔이다. ' + items.map((it, i) => (it.pyramid ? '' : `${TAGS[i]}는 ${whyNotPyramid(it)}. `)).join('') + `각뿔은 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets } }
      });
    }),
    T('pyramid-all-triangles', '모든 면이 삼각형인 입체도형', '①42', (d) => {
      const items = d.shuffle([SHAPES.pyramid(d, 3), SHAPES.pyramid(d, d.pick([4, 5])), SHAPES.prism(d, 3), SHAPES.pyramid(d, 6)]), all = (it) => it.solid.faces.every((ring) => ring.length === 3), at = items.findIndex(all);
      return C('모든 면이 삼각형인 입체도형은?', TAGS.slice(0, 4), at, {
        figure: tiles(items.map((it) => it.art())), explain: `각뿔의 옆면은 모두 삼각형이므로 밑면까지 삼각형인 각뿔을 찾는다. ${TAGS[at]}는 밑면도 옆면도 삼각형이다. 나머지에는 삼각형이 아닌 밑면이나 직사각형 모양의 옆면이 있다.`,
        facts: { kindPick: { kinds: items.map((it, i) => (all(it) ? 'all' : 'no' + i)), target: 'all' } }
      });
    }),
    T('pyramid-why-not', '각뿔이 아닌 까닭', '①45 ②4·5 ③20 심4', (d, n) => {
      // 까닭 쓰기를 까닭 고르기로 바꾸었다. 보기마다 그 도형에 맞는 말인지 따져, 맞는 까닭이 하나뿐이게 한다.
      const it = n === 0 ? SHAPES.cone() : d.bool() ? SHAPES.frustum(d) : SHAPES.prism(d, d.pick([3, 5])), sidesOk = it.kind === 'cone' ? false : it.solid.faces.slice(it.kind === 'pyramid' ? 1 : 2).every((ring) => ring.length === 3);
      const rows = d.shuffle(n === 0 ? [['밑면이 다각형이 아니다.', !it.poly], ['밑면이 2개이다.', false], ['옆면이 직사각형이다.', false], ['뾰족한 곳이 없다.', false]] : [['옆으로 둘러싼 면이 삼각형이 아니다.', !sidesOk], ['밑에 놓인 면이 다각형이 아니다.', !it.poly], ['굽은 면이 있다.', !it.poly], ['면이 모두 삼각형이다.', it.solid.faces.every((ring) => ring.length === 3)]]);
      return C(n === 0 ? '다음 도형이 각뿔이 아닌 까닭으로 알맞은 것은?' : '다음 입체도형은 각뿔이 아니다. 그 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: it.art([112, 104]),
        explain: n === 0 ? '뿔 모양이지만 밑면이 원이라서 다각형이 아니고, 옆의 면도 굽은 면이다. 각뿔은 밑면이 다각형이고 옆면이 모두 삼각형이어야 한다.' : `옆으로 둘러싼 면이 ${it.kind === 'frustum' ? '사다리꼴' : '직사각형'}이다. 각뿔은 옆면이 모두 삼각형이고 한 점에서 만나야 한다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { count: 2 }),
    T('pyramid-base-shaded', '색칠한 면이 밑면이 아닌 각뿔', '①46 ②6 ③21', (d) => {
      // 밑면 색칠하기를 고르기로 바꾸었다. 세운 각뿔의 밑면은 보이지 않는 면이라 점선 안쪽이 비쳐 보이게 칠한다.
      const ns = d.shuffle([4, 5, 6]), items = d.shuffle(ns.map((n) => ({ solid: pyramidOf(d, n), f: 0 })).concat([(() => { const solid = pyramidOf(d, d.pick([4, 5, 6])); return { solid, f: widestSide(solid) }; })()])), at = items.findIndex((it) => it.f !== 0);
      return C('색칠한 면이 각뿔의 밑면이 아닌 것은?', TAGS.slice(0, 4), at, {
        figure: tiles(items.map((it) => draw(it.solid, { size: TILE, tint: { [it.f]: YELLOW }, label: '면 하나를 색칠한 각뿔' }))),
        explain: `각뿔의 밑면은 옆면이 모두 만나는 각뿔의 꼭짓점과 마주 보는 면이다. ${TAGS[at]}는 각뿔의 꼭짓점을 지나는 삼각형 모양의 옆면을 색칠했다.`,
        facts: { kindPick: { kinds: items.map((it, i) => (it.f === 0 ? 'base' + i : 'side')), target: 'side' } }
      });
    }),
    T('pyramid-face-names', '각뿔의 밑면과 옆면을 면의 이름으로 찾기', '①47 ②7 ③21 심7', (d, k) => {
      const n = k === 0 ? d.pick([4, 5]) : 4, solid = pyramidOf(d, n), figure = draw(solid, { size: [124, 126], names: true, label: '꼭짓점에 이름을 붙인 각뿔의 겨냥도' });
      if (k === 0) {
        const rows = d.shuffle([0].concat(d.shuffle(slopes(solid)).slice(0, 3)));
        return C('각뿔의 밑면은?', rows.map((f) => faceSaid(solid, f)), rows.indexOf(0), {
          figure, explain: `각뿔에서 밑에 놓인 ${gon(n)} 모양의 ${faceSaid(solid, 0)}이 밑면이다. 나머지는 점 ㄱ에서 만나는 삼각형 모양의 옆면이다.`, facts: { truth: rows.map((f) => K.pyramidBases(solid).includes(f)), want: true }
        });
      }
      // 다섯 면을 모두 보기에 올린다(사각뿔). 「모두 고른 것」이 그 도형의 옆면 전부가 되게 한다.
      const picks = d.shuffle(solid.faces.map((_, f) => f)), labels = picks.map((f) => faceSaid(solid, f)), flags = picks.map((f) => !K.pyramidBases(solid).includes(f)), made = setOptions(d, labels, flags);
      return C('각뿔의 옆면을 모두 고른 것은?', made.options, made.answer, {
        figure, explain: `밑면과 만나는 삼각형 모양의 면이 옆면이다. ${faceSaid(solid, 0)}은 밑면이고, 점 ㄱ을 지나는 나머지 면이 옆면이다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('pyramid-face-count', '각뿔의 밑면과 옆면의 수', '①48 ②9 ③22 심9', (d) => {
      const n = d.int(3, 8), solid = pyramidOf(d, n);
      return M('각뿔의 밑면과 옆면은 각각 몇 개인가?', [{ label: '밑면', answer: 1, unit: '개' }, { label: '옆면', answer: solid.faces.length - 1, unit: '개' }], {
        figure: draw(solid, { size: [124, 126], label: '각뿔의 겨냥도' }), explain: `각뿔의 밑면은 1개이다. 밑면이 ${gon(n)}이므로 밑면의 변마다 옆면이 하나씩 있어 옆면은 ${n}개이다.`, facts: { calc: [['1', 0], [String(n), 1]], unseen: [1, n] }
      });
    }),
    T('pyramid-side-shape', '각뿔의 옆면의 모양', '①48 ②12 심11', (d) => pickWord(d, '각뿔의 옆면은 모두 어떤 도형인가?', '삼각형', ['직사각형', '오각형', '원'], '각뿔의 옆면은 밑면의 한 변과 각뿔의 꼭짓점을 이은 면이므로 모두 삼각형이다.')),
    T('pyramid-meet-count', '각뿔에서 밑면과 만나는 면의 수', '②10 ③22 심9·10', (d) => {
      const n = d.int(3, 8), solid = pyramidOf(d, n);
      return N('각뿔에서 밑면과 만나는 면은 모두 몇 개인가?', slopes(solid).length, {
        unit: '개', figure: draw(solid, { size: [124, 126], label: '각뿔의 겨냥도' }), explain: `각뿔에서 밑면과 만나는 면은 옆면이다. 밑면이 ${gon(n)}이므로 옆면은 ${n}개이다.`, facts: { calc: [[String(n), 0]], unseen: [n] }
      });
    }),
    T('pyramid-say', '각뿔에 대한 설명', '①49 ②55 ③23 심26', (d, n) => say(d, n === 0 ? '각뿔에 대한 설명으로 옳지 않은 것은?' : '각뿔에 대한 설명으로 옳은 것은?',
      ['밑면은 다각형이다.', '옆면은 모두 삼각형이다.', '옆면은 모두 한 점에서 만난다.', '옆면의 수는 밑면의 변의 수와 같다.', '서로 평행한 면이 없다.'],
      [['밑면은 2개이다.', '각뿔의 밑면은 1개이다.'], ['옆면은 모두 직사각형이다.', '각뿔의 옆면은 모두 삼각형이다.'], ['서로 평행한 두 면이 있다.', '각뿔에는 서로 평행한 면이 없다.'], ['원도 밑면이 될 수 있다.', '각뿔의 밑면은 다각형이다.'],
        ['각뿔의 이름은 옆면의 모양에 따라 정해진다.', '각뿔의 옆면은 언제나 삼각형이고, 이름은 밑면의 모양에 따라 정해진다.'], ['옆면의 수는 밑면의 변의 수보다 1개 많다.', '옆면의 수는 밑면의 변의 수와 같다.']],
      n === 1, '각뿔은 밑면이 다각형이고, 옆면이 모두 한 점에서 만나는 삼각형인 입체도형이다.'), { count: 2 })
  ]);

  // ── 각뿔의 이름과 구성 요소 ──────────────────────────────────
  // 세운 각뿔에 적는 길이: 앞에서 보이는 밑면의 변 하나(baseText)와 가장 바깥쪽 옆 모서리(edgeText)
  // baseText 가 함수이면 앞에서 보이는 밑면의 변마다 그 길이(cm)로 글을 지어 적는다(길이가 같은 변은 한 번만).
  function pyramidLens(solid, baseText, edgeText) {
    const n = solid.n, shown = new Set(seenEdges(solid)), out = [], next = (i) => ((i + 1) % n) + 1, depth = (i) => solid.verts[i + 1][1] + solid.verts[next(i)][1];
    const front = [...Array(n).keys()].filter((x) => shown.has(edgeKey(x + 1, next(x)))).sort((p, q) => depth(p) - depth(q));
    if (typeof baseText === 'function') { const done = new Set(); front.forEach((i) => { const len = Math.round(K.dist2(solid.verts[i + 1], solid.verts[next(i)]) * 100) / 100; if (!done.has(len)) { done.add(len); out.push([i + 1, next(i), baseText(len)]); } }); }
    else if (baseText) out.push([front[0] + 1, next(front[0]), baseText]);
    if (edgeText) { const xs = solid.verts.slice(1).map((p) => Math.abs(p[0])); out.push([0, xs.indexOf(Math.max(...xs)) + 1, edgeText]); }
    return out;
  }
  // 높이를 나타내는 선분: 각뿔의 꼭짓점에서 밑면의 가운데로 내린 점선과 직각 표시
  const heightMark = (text) => ({ a: 0, b: [0, 0, 0], kind: 'dash', right: [1, 0, 0], text, inner: true });
  // 자: p 에서 q 까지 눈금이 있는 변이 놓이고, side 쪽으로 몸통이 있다(그림의 자리, px).
  function ruler(cv, p, q, side) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], nv = [-u[1] * side, u[0] * side], W = 10, c = [p, q, [q[0] + nv[0] * W, q[1] + nv[1] * W], [p[0] + nv[0] * W, p[1] + nv[1] * W]];
    c.forEach(cv.point);
    let out = '<polygon points="' + ptsOf(c) + '" style="fill:#e0f2fe;stroke:#0369a1;stroke-width:1.1"/>';
    for (let t = 0, i = 0; t <= L + 0.01; t += 4.5, i += 1) { const a = [p[0] + u[0] * t, p[1] + u[1] * t], len = i % 5 === 0 ? 5.5 : 3; out += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + (a[0] + nv[0] * len).toFixed(1) + '" y2="' + (a[1] + nv[1] * len).toFixed(1) + '" style="stroke:#0369a1;stroke-width:0.8"/>'; }
    return out;
  }
  // 한 옆면의 모양: 밑변 b, 나머지 두 변 leg 인 이등변삼각형(위쪽 꼭짓점에 ㄱ)
  function sidePiece(b, leg) {
    const k = 92 / leg, tall = Math.sqrt(leg * leg - (b * b) / 4), P = [[0, 0], [b * k, 0], [(b * k) / 2, -tall * k]], cv = canvas(), put = (c, text, kind, hw) => { cv.add(word(c, text, kind)); cv.box(c, hw, 8); };
    P.forEach(cv.point); cv.add('<polygon class="mb-poly" points="' + ptsOf(P) + '"/>');
    put([P[2][0], P[2][1] - 11], 'ㄱ', '', 7); put([P[0][0] + (b * k) / 2, 12], cm(b), 'is-length', wide(cm(b), 12) / 2);
    const mid = [(P[0][0] + P[2][0]) / 2, (P[0][1] + P[2][1]) / 2], hw = wide(cm(leg), 12) / 2;
    put([mid[0] - hw - 7, mid[1]], cm(leg), 'is-length', hw);
    return cv.out(`이등변삼각형. 점 ㄱ과 마주 보는 변 ${b} cm, 나머지 두 변 ${leg} cm`);
  }
  Object.assign(K, { slopes, pyramidLens, heightMark, ruler, sidePiece, TRIS, oddTriangle, triNet, lenAt });
  B.addTypes('6-1-2', 'yname', [
    T('yname-name', '겨냥도를 보고 각뿔의 이름 쓰기', '①50 ②14 ③26 심14', (d) => {
      const n = d.int(3, 8), made = nameOptions(d, pyramidName(n), [prismName(n), n === 3 ? pyramidName(6) : '삼각뿔', pyramidName(n + 1), pyramidName(n * 2), pyramidName(n === 3 ? 5 : n - 1)]);
      return C('각뿔의 이름은?', made.options, made.answer, {
        figure: draw(pyramidOf(d, n), { size: [124, 126], label: '각뿔의 겨냥도' }), explain: `각뿔의 이름은 밑면의 모양에 따라 정해진다. 밑면의 모양이 ${gon(n)}이므로 ${pyramidName(n)}이다. 옆면의 모양은 어느 각뿔이나 삼각형이다.`, facts: { truth: made.truth, want: true }
      });
    }),
    T('yname-part-word', '각뿔의 꼭짓점과 높이의 뜻', '①51 ③28', (d, n) => (n === 0
      ? pickWord(d, '각뿔에서 옆면이 모두 만나는 점을 무엇이라고 하는가?', '각뿔의 꼭짓점', ['모서리', '높이', '밑면'], '각뿔에서 꼭짓점 가운데 옆면이 모두 만나는 점을 각뿔의 꼭짓점이라고 한다.')
      : pickWord(d, '각뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이를 무엇이라고 하는가?', '높이', ['모서리', '옆면', '각뿔의 꼭짓점'], '각뿔의 꼭짓점에서 밑면에 수직인 선분의 길이를 각뿔의 높이라고 한다.')), { count: 2 }),
    T('yname-point', '그림에서 각뿔의 꼭짓점, 모서리, 높이 찾기', '①52 ②18 ③28 심22', (d) => {
      const WORDS = ['각뿔의 꼭짓점', '모서리', '높이'], order = d.shuffle(WORDS), mark = (w) => MARKS[order.indexOf(w)], n = d.pick([4, 5, 6]);
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => WORDS[i]).join(', ')), right = order.join(', '), options = d.shuffle([right].concat(d.shuffle(perms.filter((p) => p !== right)).slice(0, 3)));
      const figure = neat(() => { const solid = pyramidOf(d, n), [e] = pyramidLens(solid, mark('모서리')); return draw(solid, { size: [124, 126], dots: [0], names: { 0: mark('각뿔의 꼭짓점') }, bold: [edgeKey(e[0], e[1])], lens: [e], marks: [heightMark(mark('높이'))], label: `각뿔의 겨냥도. ${mark('각뿔의 꼭짓점')}은 큰 점, ${mark('모서리')}은 굵게 그은 선분, ${mark('높이')}은 큰 점에서 밑면에 수직으로 내린 선분을 가리킨다.` }); }, () => draw.tidy);
      return C('각뿔에서 ㉠, ㉡, ㉢이 가리키는 부분의 이름을 차례로 쓴 것은?', options, options.indexOf(right), {
        figure, explain: `${mark('각뿔의 꼭짓점')}은 옆면이 모두 만나는 점이므로 각뿔의 꼭짓점, ${mark('모서리')}은 면과 면이 만나는 선분이므로 모서리, ${mark('높이')}은 각뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이이므로 높이이다.`,
        facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('yname-apex', '각뿔의 꼭짓점 찾기', '②19 ③29', (d) => {
      const n = d.pick([4, 5]), solid = pyramidOf(d, n), tip = solid.verts.findIndex((_, v) => slopes(solid).every((f) => solid.faces[f].includes(v))), rows = d.shuffle([tip].concat(d.shuffle(solid.verts.map((_, v) => v).filter((v) => v !== tip)).slice(0, 3)));
      return C('각뿔의 꼭짓점은?', rows.map((v) => '점 ' + solid.names[v]), rows.indexOf(tip), {
        figure: draw(solid, { size: [124, 126], names: true, label: '꼭짓점에 이름을 붙인 각뿔의 겨냥도' }), explain: `각뿔의 꼭짓점은 옆면이 모두 만나는 점이다. 삼각형 모양의 옆면 ${n}개가 모두 점 ${solid.names[tip]}에서 만난다. 나머지 점은 밑면의 꼭짓점이다.`,
        facts: { truth: rows.map((v) => v === tip), want: true }
      });
    }),
    T('yname-height', '각뿔의 높이 읽기', '①53 ②21 ③30 심24', (d) => {
      // 길이는 서로 맞는 수만 쓴다. 밑면은 가로 2p, 세로 2q 인 직사각형이고, 밑면의 가운데에서 꼭짓점까지의 거리(p, q 가 두 변인 직각삼각형의 빗변)와 높이 h, 모서리 e 가 직각삼각형의 세 변이다.
      const [p, q, h, e] = d.pick([[9, 12, 8, 17], [9, 12, 20, 25], [12, 16, 21, 29]]);
      const figure = neat(() => { const solid = upPyramid([[-p, -q], [p, -q], [p, q], [-p, q]], h, d.bool()); return draw(solid, { size: [150, 136], lens: pyramidLens(solid, cm, cm(e)), marks: [heightMark(cm(h))], label: `각뿔의 겨냥도. 밑면의 두 변 ${2 * p} cm, ${2 * q} cm, 모서리 ${e} cm, 각뿔의 꼭짓점에서 밑면에 수직으로 내린 선분 ${h} cm` }); }, () => draw.tidy);
      return N('각뿔의 높이는 몇 cm인가?', h, {
        unit: 'cm', figure, explain: `각뿔의 높이는 각뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이이므로 ${h} cm이다. ${e} cm는 비스듬한 모서리의 길이이고, ${2 * p} cm와 ${2 * q} cm는 밑면의 변의 길이이다.`, facts: { calc: [[String(h), 0]] }
      });
    }),
    T('yname-height-ruler', '각뿔의 높이를 바르게 재는 그림', '①63 ②22 ③30 심24', (d) => {
      const n = d.pick([4, 5]), tall = d.pick([2, 2.2]);
      const WAYS = {
        height: () => [(at, cv) => { const j = at([1.5, 0, tall]); return ruler(cv, at([1.5, 0, 0]), at([1.5, 0, tall + 0.25]), 1) + K.stroke(at([0, 0, tall]), j, 'thin', 'stroke:#0369a1') + '<polyline class="mb-mark" points="' + ptsOf([[j[0] - 6, j[1]], [j[0] - 6, j[1] + 6], [j[0], j[1] + 6]]) + '"/>'; }, '자를 각뿔 옆에 바닥과 수직으로 세우고, 각뿔의 꼭짓점과 같은 높이의 눈금을 읽는 그림'],
        edge: (solid) => { const xs = solid.verts.slice(1).map((p) => p[0]), v = xs.indexOf(Math.max(...xs)) + 1; return [(at, cv) => ruler(cv, at(solid.verts[v]), at(solid.verts[0]), 1), '자를 각뿔의 비스듬한 모서리에 대고 재는 그림']; },
        slope: (solid) => { const [e] = pyramidLens(solid, 'x'), a = solid.verts[e[0]], b = solid.verts[e[1]], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]; return [(at, cv) => ruler(cv, at(m), at(solid.verts[0]), -1), '자를 각뿔의 옆면 위에 비스듬히 대고 재는 그림']; }
      };
      const flip = d.bool(), items = d.shuffle(['height', 'edge', 'slope']), at = items.indexOf('height');
      return C('각뿔의 높이를 바르게 재고 있는 것은?', TAGS.slice(0, 3), at, {
        figure: tiles(items.map((way) => { const solid = upPyramid(regular(n, 1, 0), tall, flip), [over, label] = WAYS[way](solid); return draw(solid, { size: [84, 92], over, label }); })),
        explain: `각뿔의 높이는 각뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이이다. ${TAGS[at]}는 자를 바닥과 수직으로 세우고 각뿔의 꼭짓점의 높이를 읽는다. 나머지는 비스듬한 모서리나 옆면 위에 자를 대어, 높이보다 긴 길이를 잰다.`,
        facts: { kindPick: { kinds: items, target: 'height' } }
      });
    }),
    T('yname-count-fig', '그림을 보고 각뿔의 면, 모서리, 꼭짓점의 수 세기', '①54 ②25 ③34', (d) => {
      const n = d.int(3, 8), solid = pyramidOf(d, n), c = countsOf(solid);
      return M('각뿔의 면, 모서리, 꼭짓점은 각각 몇 개인가?', PARTS.map((p) => ({ label: PART[p], answer: c[p], unit: '개' })), {
        figure: draw(solid, { size: [124, 126], label: '각뿔의 겨냥도' }),
        explain: `밑면이 ${gon(n)}인 ${pyramidName(n)}이다. 면은 밑면 1개와 옆면 ${n}개로 ${c.face}개, 모서리는 밑면에 ${n}개와 옆에 ${n}개로 ${c.edge}개, 꼭짓점은 밑면에 ${n}개와 각뿔의 꼭짓점 1개로 ${c.vert}개이다.`,
        facts: { calc: PARTS.map((p, i) => [PYRAMID_EXPR[p](n), i]), unseen: [n, 1, 2] }
      });
    }),
    T('yname-count-name', '이름만 듣고 각뿔의 면, 모서리, 꼭짓점의 수 구하기', '①55 ②27 ③35 심31·32', (d) => {
      const n = d.int(9, 12);
      return M(`${pyramidName(n)}의 면, 모서리, 꼭짓점은 각각 몇 개인가?`, PARTS.map((p) => ({ label: PART[p], answer: PYRAMID[p](n), unit: '개' })), {
        explain: `${pyramidName(n)}의 밑면의 변은 ${n}개이다. 면의 수는 ${n} + 1 = ${n + 1}, 모서리의 수는 ${n} × 2 = ${n * 2}, 꼭짓점의 수는 ${n} + 1 = ${n + 1}이다.`,
        facts: { calc: PARTS.map((p, i) => [PYRAMID_EXPR[p](n), i]), unseen: [n, 1, 2] }
      });
    }),
    T('yname-rule', '각뿔의 면, 모서리, 꼭짓점의 수의 규칙', '①56 ③36 심33', () => M('각뿔의 면, 모서리, 꼭짓점의 수를 밑면의 변의 수로 나타내었다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: '㉠', answer: 1 }, { label: '㉡', answer: 2 }, { label: '㉢', answer: 1 }], {
      figure: B.kit.lines(['(면의 수) = (밑면의 변의 수) + ㉠', '(모서리의 수) = (밑면의 변의 수) × ㉡', '(꼭짓점의 수) = (밑면의 변의 수) + ㉢']).replace('class="mb-lines"', 'class="mb-lines" style="font-size:1rem"'),
      explain: '면은 옆면이 밑면의 변의 수만큼 있고 밑면이 1개 더 있다. 모서리는 밑면에 변의 수만큼 있고 각뿔의 꼭짓점과 밑면의 꼭짓점을 잇는 모서리가 변의 수만큼 있으므로 2배이다. 꼭짓점은 밑면에 변의 수만큼 있고 각뿔의 꼭짓점이 1개 더 있다.', facts: fixed(1, 2, 1)
    })),
    T('yname-back-name', '수를 듣고 각뿔의 이름 찾기', '①57 ②33 ③37 심19', (d, k) => {
      const part = PARTS[k], n = d.int(5, 10), cnt = PYRAMID[part](n);
      const made = nameOptions(d, pyramidName(n), [cnt, cnt - 2, cnt / 2, cnt + 1, n + 1, n - 1, n + 2].filter((x) => Number.isInteger(x) && x >= 3 && x <= 20 && x !== n).map(pyramidName));
      const how = { face: `각뿔의 면의 수는 밑면의 변의 수보다 1 큰 수이다. ${cnt} − 1 = ${n}`, edge: `각뿔의 모서리의 수는 밑면의 변의 수의 2배이다. ${cnt} ÷ 2 = ${n}`, vert: `각뿔의 꼭짓점의 수는 밑면의 변의 수보다 1 큰 수이다. ${cnt} − 1 = ${n}` }[part];
      return C(`${josa(PART[part], '이/가')} ${cnt}개인 각뿔의 이름은?`, made.options, made.answer, { explain: `${how}이므로 밑면이 ${gon(n)}인 ${pyramidName(n)}이다.`, facts: { truth: made.truth, want: true } });
    }, { count: 3 }),
    T('yname-same-count', '각뿔에서 수가 같은 것', '③42', (d) => pickWord(d, '어느 각뿔에서나 꼭짓점의 수와 같은 것은?', '면의 수', ['모서리의 수', '옆면의 수', '밑면의 변의 수'], '각뿔의 꼭짓점의 수와 면의 수는 모두 밑면의 변의 수보다 1 큰 수이다. 옆면의 수는 밑면의 변의 수와 같고, 모서리의 수는 밑면의 변의 수의 2배이다.')),
    T('yname-say-count', '수가 들어간 각뿔의 설명', '①25 ②56 ③43', (d) => {
      const n = d.int(3, 8), bad = d.int(0, 3), value = { 옆면: n, 면: n + 1, 모서리: n * 2, 꼭짓점: n + 1 };
      const rows = [['옆면', `${n}`, n + 1], ['면', `${n}+1`, n + 2], ['모서리', `${n}*2`, n * 3], ['꼭짓점', `${n}+1`, n * 2]].map(([part, expr, wrong], i) => ({ part, expr, said: i === bad ? wrong : value[part] }));
      const list = d.shuffle(rows), at = list.indexOf(rows[bad]);
      return C(`${pyramidName(n)}에 대한 설명으로 옳지 않은 것은?`, list.map((r) => `${josa(r.part, '은/는')} ${r.said}개이다.`), at, {
        explain: `${josa(pyramidName(n), '은/는')} 밑면의 변이 ${n}개이므로 옆면은 ${n}개, 면은 ${n + 1}개, 모서리는 ${n * 2}개, 꼭짓점은 ${n + 1}개이다. ${josa(rows[bad].part, '은/는')} ${rows[bad].said}개가 아니라 ${value[rows[bad].part]}개이다.`,
        facts: { claimed: list.map((r) => [r.expr, r.said]), claimedWant: false }
      });
    }),
    T('yname-most', '각뿔에서 수가 가장 많은 것', '①65 ③41 심33', (d) => pickWord(d, '어느 각뿔에서나 수가 가장 많은 것은?', '모서리', ['꼭짓점', '면', '옆면'], '각뿔의 모서리의 수는 밑면의 변의 수의 2배이고, 면과 꼭짓점의 수는 밑면의 변의 수보다 1 큰 수이다. 밑면의 변은 3개 이상이므로 모서리가 가장 많다.')),
    T('yname-side-piece', '옆면에서 밑면의 한 변 읽기', '②63 심58', (d) => {
      const [b, leg] = d.pick([[4, 7], [6, 10], [5, 9], [6, 8], [8, 11]]), n = d.int(4, 8);
      return N(`어떤 ${pyramidName(n)}의 옆면은 모두 다음과 같은 이등변삼각형이다. 점 ㄱ이 각뿔의 꼭짓점일 때, 이 각뿔의 밑면의 한 변의 길이는 몇 cm인가?`, b, {
        unit: 'cm', figure: sidePiece(b, leg), explain: `옆면에서 각뿔의 꼭짓점 ㄱ과 마주 보는 변이 밑면의 변과 맞닿는다. 밑면의 한 변의 길이는 ${b} cm이다. ${leg} cm는 각뿔의 꼭짓점에서 만나는 모서리의 길이이다.`, facts: { calc: [[String(b), 0]] }
      });
    })
  ]);

  // ── 각기둥과 각뿔 ────────────────────────────────────────────
  const safeName = (fn, x) => (Number.isInteger(x) && x >= 3 && x <= 20 ? fn(x) : null);
  B.addTypes('6-1-2', 'both', [
    T('both-sort', '각기둥과 각뿔의 수 세기', '①43 ②3 ③19', (d) => {
      const p = d.pick([1, 2]), q = d.pick([1, 2]), ns = d.shuffle([3, 4, 5, 6]), ms = d.shuffle([3, 4, 5, 6]);
      const items = d.shuffle(ns.slice(0, p).map((n) => SHAPES.prism(d, n)).concat(ms.slice(0, q).map((n) => SHAPES.pyramid(d, n)), d.shuffle([SHAPES.pillar(), SHAPES.cone(), SHAPES.frustum(d)]).slice(0, 5 - p - q)));
      const prisms = items.filter((it) => it.prism).length, pyramids = items.filter((it) => it.pyramid).length;
      return M('다음 도형 가운데 각기둥과 각뿔은 각각 몇 개인가?', [{ label: '각기둥', answer: prisms, unit: '개' }, { label: '각뿔', answer: pyramids, unit: '개' }], {
        figure: tiles(items.map((it) => it.art())),
        explain: `서로 평행한 두 면이 합동인 다각형이고 옆면이 모두 직사각형인 도형은 ${TAGS.slice(0, 5).filter((_, i) => items[i].prism).join(', ')}이므로 각기둥은 ${prisms}개이다. 밑면이 다각형이고 옆면이 모두 삼각형인 도형은 ${TAGS.slice(0, 5).filter((_, i) => items[i].pyramid).join(', ')}이므로 각뿔은 ${pyramids}개이다.`,
        facts: { count: items.map((it) => it.prism), calc: [[String(q), 1]], unseen: [q] }
      });
    }),
    T('both-from-base', '밑면의 모양을 보고 각기둥과 각뿔의 이름 쓰기', '①15 ②16 ③12·27 심15', (d) => {
      const n = d.int(3, 8), m = n === 3 ? 5 : n - 1, right = `${prismName(n)}, ${pyramidName(n)}`, options = d.shuffle([right, `${pyramidName(n)}, ${prismName(n)}`, `${prismName(n + 1)}, ${pyramidName(n + 1)}`, `${prismName(m)}, ${pyramidName(m)}`]);
      return C('다음 도형을 밑면으로 하는 각기둥과 각뿔의 이름을 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: basePolygon(d, n), explain: `변이 ${n}개인 ${gon(n)}이다. 밑면이 ${gon(n)}인 각기둥은 ${prismName(n)}, 밑면이 ${gon(n)}인 각뿔은 ${pyramidName(n)}이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('both-from-desc', '밑면과 옆면의 모양을 듣고 이름 쓰기', '①59 ②17 ③40 심18', (d, k) => {
      const n = d.int(5, 9);
      if (k === 0) { const made = nameOptions(d, pyramidName(n), [prismName(n), '삼각뿔', pyramidName(n + 1), '삼각기둥']); return C(`밑면은 ${gon(n)}이고 옆면은 모두 삼각형인 입체도형의 이름은?`, made.options, made.answer, { explain: `옆면이 모두 삼각형이므로 각뿔이다. 밑면의 모양이 ${gon(n)}이므로 ${pyramidName(n)}이다.`, facts: { truth: made.truth, want: true } }); }
      const made = nameOptions(d, prismName(n), [pyramidName(n), '사각기둥', prismName(n + 2), prismName(n * 2)]);
      return C(`서로 평행한 두 밑면이 합동이고, 직사각형 모양의 옆면이 ${n}개인 입체도형의 이름은?`, made.options, made.answer, { explain: `옆면이 모두 직사각형이므로 각기둥이다. 옆면의 수는 한 밑면의 변의 수와 같으므로 밑면은 ${gon(n)}이고, 이 도형은 ${prismName(n)}이다.`, facts: { truth: made.truth, want: true } });
    }, { count: 2 }),
    T('both-from-pieces', '밑면과 옆면의 모양을 보고 이름 쓰기', '②17 ③13 심16', (d) => {
      const n = d.pick([5, 6, 7, 8]), cone = d.bool(), right = cone ? pyramidName(n) : prismName(n), made = nameOptions(d, right, [cone ? prismName(n) : pyramidName(n), cone ? '삼각뿔' : '사각기둥', cone ? pyramidName(n + 1) : prismName(n + 1), cone ? '삼각기둥' : '사각뿔']);
      const side = cone ? flatShape([[0, 54], [34, 54], [17, 0]], '삼각형') : flatShape([[0, 0], [0, 54], [32, 54], [32, 0]], '직사각형');
      return C('밑면과 옆면의 모양이 다음과 같은 입체도형의 이름은?', made.options, made.answer, {
        figure: tiles([flatShape(regular(n, 30, -90), `변이 ${n}개인 다각형`), side], ['밑면', '옆면']),
        explain: `옆면이 ${cone ? '삼각형이므로 각뿔' : '직사각형이므로 각기둥'}이다. 밑면의 모양이 ${gon(n)}이므로 ${right}이다.`, facts: { truth: made.truth, want: true }
      });
    }),
    T('both-same-shape', '밑면과 옆면의 모양이 같은 입체도형', '③13 ③40 심17', (d, k) => (k === 0
      ? pickWord(d, '밑면의 모양과 옆면의 모양이 같은 각뿔의 이름은?', '삼각뿔', ['사각뿔', '오각뿔', '육각뿔'], '각뿔의 옆면은 언제나 삼각형이다. 밑면도 삼각형인 각뿔은 삼각뿔이다.')
      : pickWord(d, '밑면의 모양과 옆면의 모양이 모두 직사각형인 각기둥의 이름은?', '사각기둥', ['삼각기둥', '오각기둥', '육각기둥'], '각기둥의 옆면은 언제나 직사각형이다. 밑면도 직사각형인 각기둥은 밑면의 변이 4개이므로 사각기둥이다.')), { count: 2 }),
    T('both-three-counts', '면, 모서리, 꼭짓점의 수를 듣고 이름 찾기', '②35 ③39·40 심19·20', (d) => {
      // 각기둥인지 각뿔인지 알려 주지 않는다. 보기는 세 수 가운데 하나씩만 맞는 다른 도형이라서, 수 하나로 이름을 찾은 뒤 나머지 수로 확인해야 한다.
      const prism = d.bool(), n = d.int(4, 9), c = prism ? PRISM : PYRAMID, f = c.face(n), e = c.edge(n), v = c.vert(n), right = (prism ? prismName : pyramidName)(n);
      const pool = prism ? [safeName(pyramidName, f - 1), safeName(pyramidName, e / 2), safeName(pyramidName, v - 1), prismName(n + 1), prismName(n - 1)] : [safeName(prismName, f - 2), safeName(prismName, e / 3), safeName(prismName, v / 2), pyramidName(n + 1), pyramidName(n - 1)];
      const made = nameOptions(d, right, pool);
      return C(`면이 ${f}개, 모서리가 ${e}개, 꼭짓점이 ${v}개인 입체도형의 이름은?`, made.options, made.answer, {
        explain: prism ? `${prismName(n)}의 면은 ${n} + 2 = ${f}(개), 모서리는 ${n} × 3 = ${e}(개), 꼭짓점은 ${n} × 2 = ${v}(개)이다. 세 수가 모두 맞는 도형은 ${prismName(n)}뿐이다.` : `${pyramidName(n)}의 면은 ${n} + 1 = ${f}(개), 모서리는 ${n} × 2 = ${e}(개), 꼭짓점은 ${n} + 1 = ${v}(개)이다. 세 수가 모두 맞는 도형은 ${pyramidName(n)}뿐이다.`,
        facts: { truth: made.truth, want: true }
      });
    }),
    T('both-which', '각기둥의 설명과 각뿔의 설명 가리기', '①60 심28', (d, k) => {
      const prismOnly = ['서로 평행한 두 면이 있다.', '옆면이 모두 직사각형이다.', '밑면이 2개이다.', '밑면과 옆면이 서로 수직으로 만난다.'], pyramidOnly = ['밑면이 1개이다.', '옆면이 모두 삼각형이다.', '옆면이 모두 한 점에서 만난다.'], shared = ['밑면이 다각형이다.', '옆면의 수가 밑면 하나의 변의 수와 같다.', '모든 면이 다각형이다.'];
      const rows = d.shuffle(k === 0 ? [[d.pick(pyramidOnly), true]].concat(d.shuffle(prismOnly).slice(0, 2).map((t) => [t, false]), [[d.pick(shared), false]]) : [[d.pick(shared), true]].concat(d.shuffle(prismOnly).slice(0, 2).map((t) => [t, false]), [[d.pick(pyramidOnly), false]]));
      return C(k === 0 ? '다음 가운데 각뿔에는 맞고 각기둥에는 맞지 않는 설명은?' : '다음 가운데 각기둥과 각뿔에 모두 맞는 설명은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: '각기둥은 서로 평행하고 합동인 밑면이 2개이고 옆면이 모두 직사각형이다. 각뿔은 밑면이 1개이고 옆면이 모두 한 점에서 만나는 삼각형이다. 두 도형 모두 밑면이 다각형이고, 옆면의 수가 밑면 하나의 변의 수와 같다.',
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { count: 2 }),
    T('both-same', '각기둥과 각뿔에서 서로 같은 것', '①61 ②57 ③25 심29', (d) => {
      const n = d.int(3, 8), rows = d.shuffle([['밑면의 모양', true], ['옆면의 수', true], ['밑면의 수', false], ['옆면의 모양', false], ['꼭짓점의 수', PRISM.vert(n) === PYRAMID.vert(n)]]), labels = rows.map((r) => r[0]), flags = rows.map((r) => r[1]), made = setOptions(d, labels, flags);
      return C(`${prismName(n)}과 ${pyramidName(n)}에서 서로 같은 것을 모두 고른 것은?`, made.options, made.answer, {
        explain: `두 도형 모두 밑면의 모양이 ${gon(n)}이고 옆면이 ${n}개이다. 밑면은 ${prismName(n)}이 2개, ${pyramidName(n)}이 1개이고, 옆면의 모양은 직사각형과 삼각형으로 다르다. 꼭짓점은 ${n * 2}개와 ${n + 1}개이다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('both-talk', '그림의 각기둥과 각뿔에 대한 설명', '①62 심27', (d) => {
      const n = d.pick([4, 5, 6]), post = prismOf(d, n), cone = pyramidOf(d, n), figure = tiles([draw(post, { size: [96, 96], label: describe(post) }), draw(cone, { size: [96, 100], label: describe(cone) })]);
      return say(d, '두 입체도형 가와 나에 대한 설명으로 옳지 않은 것은?',
        ['가와 나는 밑면의 모양이 같다.', '가와 나는 옆면의 수가 같다.', '가는 밑면이 2개이고 나는 밑면이 1개이다.', '나의 옆면은 모두 한 점에서 만난다.'],
        [['가와 나는 옆면의 모양이 같다.', '가의 옆면은 직사각형이고 나의 옆면은 삼각형이다.'], ['가와 나는 꼭짓점의 수가 같다.', `가의 꼭짓점은 ${n * 2}개이고 나의 꼭짓점은 ${n + 1}개이다.`], ['가와 나는 모두 서로 평행한 두 면이 있다.', '나에는 서로 평행한 면이 없다.'], ['가와 나는 면의 수가 같다.', `가의 면은 ${n + 2}개이고 나의 면은 ${n + 1}개이다.`]],
        false, `가는 ${prismName(n)}, 나는 ${pyramidName(n)}이다.`, figure);
    }),
    T('both-compare', '면, 모서리, 꼭짓점의 수 비교', '①65 ②31 ③41 심35', (d, k) => {
      if (k === 1) {
        const rows = d.until(() => d.shuffle([3, 4, 5, 6, 7].map((n) => [prismName(n), PRISM_EXPR.vert(n), PRISM.vert(n), n]).concat([3, 4, 5, 6, 7, 8].map((n) => [pyramidName(n), PYRAMID_EXPR.vert(n), PYRAMID.vert(n), n]))).slice(0, 4), (list) => list.filter((r) => r[2] === Math.max(...list.map((x) => x[2]))).length === 1 && list.some((r) => /뿔/.test(r[0])) && list.some((r) => /기둥/.test(r[0])));
        return C('꼭짓점이 가장 많은 입체도형은?', rows.map((r) => r[0]), rows.findIndex((r) => r[2] === Math.max(...rows.map((x) => x[2]))), {
          explain: '각기둥의 꼭짓점의 수는 한 밑면의 변의 수의 2배이고, 각뿔의 꼭짓점의 수는 밑면의 변의 수보다 1 큰 수이다. ' + rows.map((r) => `${r[0]} ${r[2]}개`).join(', ') + '이다.',
          facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'max' }, unseen: [1, 2].concat(rows.map((r) => r[3])) }
        });
      }
      const most = d.bool(), rows = d.until(() => d.shuffle([0, 1, 2, 3]).map((i) => { const prism = i % 2 === 0, n = d.int(3, 9), part = d.pick(PARTS); return [`${(prism ? prismName : pyramidName)(n)}의 ${PART[part]}의 수`, (prism ? PRISM_EXPR : PYRAMID_EXPR)[part](n), (prism ? PRISM : PYRAMID)[part](n), n]; }), (list) => { const best = (most ? Math.max : Math.min)(...list.map((r) => r[2])); return list.filter((r) => r[2] === best).length === 1 && new Set(list.map((r) => r[0])).size === 4; });
      const best = (most ? Math.max : Math.min)(...rows.map((r) => r[2]));
      return C(`다음 가운데 가장 ${most ? '큰' : '작은'} 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[2] === best), {
        explain: rows.map((r) => `${josa(r[0], '은/는')} ${r[2]}`).join(', ') + '이다.', facts: { choose: { exprs: rows.map((r) => r[1]), rule: most ? 'max' : 'min' }, unseen: [1, 2, 3].concat(rows.map((r) => r[3])) }
      });
    }, { count: 2 }),
    T('both-least', '면의 수가 가장 적은 각기둥과 각뿔', '①67 ②31', (d, k) => (k === 0
      ? N('면의 수가 가장 적은 각기둥의 면은 모두 몇 개인가?', 5, { unit: '개', explain: '변의 수가 가장 적은 다각형은 삼각형이므로 면의 수가 가장 적은 각기둥은 삼각기둥이다. 삼각기둥의 면은 밑면 2개와 옆면 3개로 5개이다.', facts: fixed(5) })
      : N('면의 수가 가장 적은 각뿔의 면은 모두 몇 개인가?', 4, { unit: '개', explain: '변의 수가 가장 적은 다각형은 삼각형이므로 면의 수가 가장 적은 각뿔은 삼각뿔이다. 삼각뿔의 면은 밑면 1개와 옆면 3개로 4개이다.', facts: fixed(4) })), { count: 2 }),
    T('both-edge-sum', '모서리의 길이가 모두 같은 도형의 모든 모서리의 길이의 합', '②60 심57', (d, k) => {
      // 길이 셈은 곱셈 한 번이다: 모서리의 수를 세고(규칙 한 번) 한 모서리의 길이를 곱한다. 모서리의 길이가 모두 같은 각뿔은 밑면이 삼각형·사각형·오각형일 때만 있다.
      const s = d.int(3, 9), n = k === 0 ? d.int(3, 8) : d.pick([3, 4, 5]), edges = k === 0 ? PRISM.edge(n) : PYRAMID.edge(n), name = (k === 0 ? prismName : pyramidName)(n);
      return N(`모서리의 길이가 모두 ${s} cm인 ${name}이 있다. 이 ${k === 0 ? '각기둥' : '각뿔'}의 모든 모서리의 길이의 합은 몇 cm인가?`, s * edges, {
        unit: 'cm', explain: `${name}의 모서리는 ${n} × ${k === 0 ? 3 : 2} = ${edges}(개)이다. 모서리의 길이가 모두 같으므로 ${s} × ${edges} = ${s * edges}(cm)`,
        facts: { calc: [[`${s}*${n}*${k === 0 ? 3 : 2}`, 0]], unseen: [n, 2, 3] }
      });
    }, { count: 2 }),
    T('both-thing', '각뿔 모양의 물건에서 옆면의 모양과 수', '③46', (d) => {
      const n = d.int(4, 8), right = `삼각형, ${n}장`, options = d.shuffle([right, `삼각형, ${n + 1}장`, `${gon(n)}, ${n}장`, `직사각형, ${n}장`]);
      return C(`밑면이 ${gon(n)}인 각뿔 모양의 지붕을 만들려고 한다. 옆면마다 꼭 맞는 판을 1장씩 붙일 때, 판의 모양과 수를 차례로 쓴 것은?`, options, options.indexOf(right), {
        explain: `각뿔의 옆면은 모두 삼각형이고, 옆면의 수는 밑면의 변의 수와 같다. 밑면이 ${gon(n)}이므로 삼각형 모양의 판이 ${n}장 필요하다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
