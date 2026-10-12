// 5학년 2학기 5단원 직육면체 — 실력 문항.
// 단원 틀과 그림 도구(B.kit.box525)는 5-2-5a.js 에 있다. 대조표는 수집본의 _분석/5-2-5/싣기_대조표.md.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 정육면체는 직육면체가 아니라고 본다. 면이 6개이기만 하면 직육면체라고 본다(사다리꼴·평행사변형 모양의 면이 있어도).
//  - 밑면은 언제나 아래(와 위)에 놓인 면이라고 본다. 옆으로 선 면을 밑면으로 잡으면 위와 아래의 면이 옆면이 된다는 것을 놓친다.
//  - 겨냥도에서 보이지 않는 것을 그림에 그려진 선의 수로만 센다. 덜 그린 그림에서는 보이는 모서리 9개, 보이지 않는 모서리 3개라는 것을 대야 한다.
//  - 전개도에서 붙어 있는 면만 수직이라고 본다. 떨어져 있는 면은 모두 평행하다고 보거나, 한 줄로 나란히 놓인 면끼리만 마주 본다고 본다.
//  - 정사각형(직사각형)이 여섯 개 이어져 있으면 모두 전개도라고 본다. 면의 수가 5개·7개인 것, 접으면 겹치는 것을 가리지 못한다.
//  - 전개도의 한 점은 한 점하고만 만난다고 본다(꼭짓점에는 세 면이 모이므로 전개도의 세 점이 한 꼭짓점이 되기도 한다). 맞닿는 선분은 바로 옆에 있는 선분이라고 본다.
//
// 싣는 기준: 실력에는 두 가지만 둔다.
//  ① 그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제(위의 잘못된 생각이 드러나는 그림을 준다)
//  ② 두 번 넘게 생각해야 풀리는 문제(성질을 두 번 이어 쓴다). 길이를 셈하는 문항은 덧셈·곱셈·나눗셈 한 번에 그친다.
//  기본에서 하는 일을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 싣지 않는다. 넓이, 끈의 길이, 전개도의 둘레, 길이를 거꾸로·거듭 셈하는 문제도 싣지 않는다(5-2-5a.js 머리의 「뺀 것」).
//
// 뺀 것과 까닭(심화꼴)
//  - 길이를 거듭 셈하는 꼴(심51·52·54~58): 모서리의 길이의 합을 구한 뒤 나누거나 빼는 셈이 일의 대부분이다. 성질은 기본의 「모든 모서리의 길이의 합」이 묻는다.
//  - 본뜬 두 면·면 조각으로 모든 모서리의 길이의 합 구하기(심53, 기본 ②23): 「두 가지 종이로 직육면체를 만들 때 더 필요한 종이」가 같은 판단(함께 가진 변 찾기)을 길이 셈 없이 묻는다.
//  - 전개도의 둘레(심59~61), 끈의 길이(심62·63), 넓이(심64~68), 본 모양(심19·69), 주사위·수 규칙(심70·71): 측정이거나 다른 단원·퍼즐의 일이다.
//  - 한 면을 더 붙일 자리를 모두 찾기(심37의 「모두」): 기본의 「정사각형 하나를 더 붙일 자리」와 같은 판단을 여러 번 하는 것이다.
//  - 보이는 것·보이지 않는 것의 수를 더하고 빼기(심20), 수가 가장 많은 것(심21), 설명의 참·거짓(심22): 기본 묶음에 실었다(한 번 세면 되는 일이다).
//  - 무늬 셋이 한 꼭짓점에 모이게 하기(심31): 「두 면에 모두 수직인 면」과 같은 판단이고 답이 둘이다. 자른 모서리대로 펼친 모양(심38): 자른 모서리를 그린 겨냥도가 있어야 한다 → 미룸
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C } = B.kit;
  const K = B.kit.box525;
  const { TAGS, cm, setOptions, canvas, word, wide, tiles, YELLOW, VERTS, FACES, EDGES, edgesAt, opposite, isPara, isPerp, face, dims3,
    sketch, seenEdge, withLens, saidLens, OTHERS, boxTile, BOXES, cubeTile, fold, whyNot, WHY, POINTS, boundsOf, moved, sorted, netArt, cellRects, spanOf, normCells, CUBE_NETS, CUBE_FAKES, hasRow4, pickShapes, cubeArt, boxNet, cubeNet, cutsOf, fakeMove, fakeSize, namedBox } = K;
  const SOLID = '6수03-03', DRAW = '6수03-04';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ALL_EDGES = EDGES.map((_, i) => i), SIX = [0, 1, 2, 3, 4, 5];
  const PROPS = [[2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]];
  const randomBox = (d, want) => boxNet(d, d.shuffle(d.pick(PROPS)), want);
  const netUnit = (rects, most) => Math.min(most, Math.floor(250 / boundsOf(rects).w));
  const Kname = (cube) => (cube ? '정육면체' : '직육면체');
  const lettered = (net, cube, o) => netArt(net.rects, Object.assign({ unit: cube ? 36 : netUnit(net.rects, 18), faceText: TAGS, label: `${Kname(cube)}의 전개도. 면에 가, 나, 다, 라, 마, 바를 적었다.` }, o || {}));
  const pointed = (net, cube, o) => netArt(net.rects, Object.assign({ unit: cube ? 36 : netUnit(net.rects, 18), names: POINTS, label: `${Kname(cube)}의 전개도. 테두리의 점에 ㄱ부터 ㅎ까지 이름을 붙였다.` }, o || {}));
  const oppositeOf = (net, i) => net.face.indexOf(net.face[i] ^ 1);
  const lenOf = (cut) => Math.abs(cut.at[0][0] - cut.at[1][0]) + Math.abs(cut.at[0][1] - cut.at[1][1]);
  const partnerOf = (cuts, cut) => cuts.find((x) => x !== cut && x.edge === cut.edge);
  const isNet = (cells) => cells.length === 6 && Boolean(fold(cellRects(cells)));
  const same = (r, s) => JSON.stringify(r) === JSON.stringify(s);
  const letters = (list) => list.slice().sort((a, b) => a - b).map((i) => TAGS[i]).join(', ');
  const ROW4 = CUBE_NETS.filter((s) => hasRow4(s.cells)), BENT = CUBE_NETS.filter((s) => !hasRow4(s.cells));
  const SMALL = [[2, 3, 4], [2, 3, 5], [2, 4, 5]], LIM = { cols: 13, rows: 12 };
  // 직사각형: 가로 w, 세로 h(cm)를 k 배(px)로 그리고 두 변의 길이를 적는다.
  function paper(w, h, k) {
    const cv = canvas(), W = w * k, Hh = h * k, hw = wide(cm(h), 12) / 2 + 1;
    cv.point([0, 0]); cv.point([W, Hh]);
    cv.add('<rect class="mb-poly" x="0" y="0" width="' + W + '" height="' + Hh + '"/>' + word([W / 2, Hh + 12], cm(w), 'is-length') + word([W + 6 + hw, Hh / 2], cm(h), 'is-length'));
    cv.box([W / 2, Hh + 12], wide(cm(w), 12) / 2, 8); cv.box([W + 6 + hw, Hh / 2], hw, 8);
    return cv.out(`가로 ${w} cm, 세로 ${h} cm인 직사각형`);
  }

  B.addGroup('5-2-5', {
    id: 'hard', title: '실력 문제', standard: SOLID,
    types: [
      // ── ① 그림·상황에 함정이 있는 문제 ──
      H('hard-count-box', '정육면체가 섞인 그림에서 직육면체 세기', '1, 기본 ①2 ②2 ③2', (d) => {
        // 그림에 함정을 둔다: 정육면체를 섞어 놓는다. 직육면체를 「길쭉한 상자」라는 겉모습으로 아는 아이는 정육면체를 빼고 세고, 면이 6개이기만 하면 된다고 보는 아이는 사다리꼴 모양의 면이 있는 도형까지 센다.
        // 뜻(직사각형 6개로 둘러싸인 도형 — 정사각형도 네 각이 모두 직각이다)을 그대로 대어 세는 문제이다. 「정육면체는 직육면체라고 할 수 있는가」를 말로 묻는 것(포함 관계)과는 다른 일이다.
        const k = d.pick([1, 2]), six = d.shuffle(['trap', 'para', 'cut']), rest = d.shuffle(['tri', 'pyr', 'cyl']), others = [six[0], rest[0], six[1]].slice(0, 4 - k);
        const items = d.shuffle(d.shuffle(BOXES).slice(0, k).map((b) => ({ kind: 'box', art: () => boxTile(b[0], b[1], b[2]) })).concat([{ kind: 'cube', art: cubeTile }], others.map((key) => Object.assign({ kind: 'no' }, OTHERS[key]()))));
        const labels = TAGS.slice(0, 5), flags = items.map((it) => it.kind !== 'no'), cube = labels[items.findIndex((it) => it.kind === 'cube')];
        return N('다음 도형 가운데 직육면체는 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tiles(items.map((it) => it.art())),
          explain: `직사각형 6개로 둘러싸인 도형이 직육면체이다. ${cube}의 면은 모두 정사각형이고, 정사각형도 네 각이 모두 직각인 사각형이므로 ${cube}도 직육면체이다. ` + items.map((it, i) => (it.kind === 'no' ? `${labels[i]}에는 ${it.why}이 있다. ` : '')).join('') + `직육면체는 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-base-turned', '옆으로 선 면을 밑면으로 잡을 때의 옆면', '17, 기본 ①28·33 ②29 ③30', (d) => {
        // 상황에 함정을 둔다: 옆으로 선 면을 밑면으로 잡는다. 「위와 아래의 면은 언제나 밑면」이라고 보는 아이는 윗면이나 아랫면을 고른다.
        const f = d.pick([0, 1, 2, 3]), side = d.pick(FACES.filter((g) => isPerp(f, g) && g < 4)), rows = d.shuffle([opposite(f), 4, 5, side]), ok = (g) => !isPerp(f, g);
        return C(`직육면체에서 ${face(f)}을 밑면이라고 할 때, 옆면이 아닌 것은?`, rows.map(face), rows.findIndex(ok), {
          figure: namedBox(d), explain: `밑면과 수직인 면이 옆면이다. ${face(f)}과 평행한 ${face(opposite(f))}은 다른 밑면이고, 나머지 네 면이 옆면이다. 위와 아래에 놓인 ${face(5)}과 ${face(4)}도 ${face(f)}과 수직이므로 옆면이다.`, facts: { truth: rows.map(ok), want: true }
        });
      }),
      H('hard-sketch-missing', '덜 그린 겨냥도에 더 그릴 실선과 점선의 수', '24, 기본 ②47', (d) => {
        // 그림에 함정을 둔다: 실선도 점선도 덜 그린 그림. 빠진 모서리마다 보이는 모서리인지 가려야 하고, 보이는 모서리 9개·보이지 않는 모서리 3개를 대야 한다.
        const mirror = d.bool(), shown = ALL_EDGES.filter((e) => seenEdge(e, mirror)), hidden = ALL_EDGES.filter((e) => !seenEdge(e, mirror));
        const out = d.until(() => d.shuffle(shown).slice(0, d.pick([1, 2])).concat(d.shuffle(hidden).slice(0, d.pick([1, 2]))), (list) => VERTS.every((v) => edgesAt(v).some((e) => !list.includes(e))));
        const x = out.filter((e) => seenEdge(e, mirror)).length, y = out.length - x, style = {};
        out.forEach((e) => { style[e] = 'none'; });
        return M('직육면체의 겨냥도를 그리다가 말았다. 겨냥도를 완성하려면 실선과 점선을 각각 몇 개 더 그려야 하는가?', [{ label: '실선', answer: x, unit: '개' }, { label: '점선', answer: y, unit: '개' }], {
          figure: sketch(dims3(d, 4, 8), { mirror, style, label: `그리다 만 직육면체의 겨냥도. 실선 ${9 - x}개와 점선 ${3 - y}개를 그렸다.` }),
          explain: `겨냥도에는 보이는 모서리 9개를 실선으로, 보이지 않는 모서리 3개를 점선으로 그린다. 그림에는 실선이 ${9 - x}개, 점선이 ${3 - y}개 있으므로 실선 ${x}개와 점선 ${y}개를 더 그린다.`, facts: { calc: [[`9-${9 - x}`, 0], [`3-${3 - y}`, 1]], unseen: [9, 3] }
        });
      }, { standard: DRAW }),
      H('hard-net-count', '면의 수가 다른 그림·접으면 겹치는 그림이 섞인 전개도 세기', '34·35, 기본 ③42·43', (d, n) => {
        // 그림에 함정을 둔다: 면이 5개·7개인 그림(면의 수를 세지 않는 아이가 넣는다), 면은 6개이지만 접으면 겹치는 그림, 한 줄로 놓이지 않은 꺾인 전개도(전개도가 아니라고 보는 아이가 뺀다).
        if (n === 0) {
          const k = d.pick([2, 3]), nets = pickShapes(d, BENT, 1).concat(pickShapes(d, ROW4, k - 1)).map((s) => s.cells), base = d.pick(ROW4).cells, near = (c, list) => list.filter((q) => Math.abs(q[0] - c[0]) + Math.abs(q[1] - c[1]) === 1).length;
          const leaf = d.pick(base.filter((q) => near(q, base) === 1)), five = normCells(base.filter((c) => c !== leaf));
          const seven = d.until(() => { const [x, y] = d.pick(base), [dx, dy] = d.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]); return base.some((q) => q[0] === x + dx && q[1] === y + dy) ? null : normCells(base.concat([[x + dx, y + dy]])); }, (cells) => cells && spanOf(cells)[0] <= 4 && spanOf(cells)[1] <= 5);
          const fakes = k === 2 ? [five, seven, d.pick(CUBE_FAKES).cells] : d.shuffle([five, seven]).slice(0, 1).concat([d.pick(CUBE_FAKES).cells]);
          const items = d.shuffle(nets.concat(fakes)), flags = items.map(isNet), labels = TAGS.slice(0, 5);
          return N('정사각형을 이어 붙인 그림 가운데 정육면체의 전개도는 모두 몇 개인가?', flags.filter(Boolean).length, {
            unit: '개', figure: tiles(items.map((cells) => cubeArt(cells))),
            explain: '정육면체의 전개도는 정사각형 6개로 이루어지고, 접었을 때 겹치는 면이 없어야 한다. ' + items.map((cells, i) => (flags[i] ? '' : `${labels[i]}는 ${cells.length === 6 ? '접었을 때 서로 겹치는 면이 있다' : `면이 ${cells.length}개이다`}. `)).join('') + `전개도는 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
            facts: { count: flags }
          });
        }
        const dims = d.shuffle(d.pick(SMALL)), net = () => boxNet(d, dims, LIM).rects, leafOf = (rects) => d.pick(rects.filter((r) => rects.filter((s) => s !== r && K.touch(r, s)).length === 1));
        const made = d.until(() => {
          const k = d.pick([1, 2]), a = net(), b = net(), base = net(), L = leafOf(base), five = sorted(moved(base.filter((r) => r !== L))), spots = [];
          for (const R of base) for (const [w, h] of [[L.w, L.h], [L.h, L.w]]) {
            const cands = (h === R.h ? [{ x: R.x + R.w, y: R.y, w, h }, { x: R.x - w, y: R.y, w, h }] : []).concat(w === R.w ? [{ x: R.x, y: R.y + R.h, w, h }, { x: R.x, y: R.y - h, w, h }] : []);
            for (const s of cands) if (!base.some((t) => K.overlap(s, t))) spots.push(s);
          }
          const seven = spots.length ? sorted(moved(base.concat([d.pick(spots)]))) : null, over = fakeMove(d, net(), LIM), size = fakeSize(d, net(), LIM);
          if (!seven || !over || !size || same(a, b) || boundsOf(seven).w > LIM.cols || boundsOf(seven).h > LIM.rows) return null;
          // 면의 수가 다른 그림을 꼭 하나 넣고, 나머지는 면이 6개인 가짜로 채운다.
          return (k === 1 ? [a] : [a, b]).concat([d.pick([five, seven])], d.shuffle([over, size]).slice(0, 3 - k));
        }, Boolean), items = d.shuffle(made), flags = items.map((r) => r.length === 6 && Boolean(fold(r))), labels = TAGS.slice(0, 4), unit = Math.max(7, Math.min(14, Math.floor(112 / Math.max(...items.map((r) => boundsOf(r).w)))));
        return N('모눈종이에 직사각형을 이어 붙인 그림 가운데 직육면체의 전개도는 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tiles(items.map((r) => netArt(r, { unit, grid: true, label: `모눈종이에 직사각형 ${r.length}개를 이어 붙인 그림` }))),
          explain: '직육면체의 전개도는 직사각형 6개로 이루어지고, 모양과 크기가 같은 면이 3쌍이며, 접었을 때 겹치는 면이 없어야 한다. ' + items.map((r, i) => (flags[i] ? '' : `${labels[i]}는 ${WHY[whyNot(r)](r)}. `)).join('') + `전개도는 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
          facts: { count: flags }
        });
      }, { count: 2, standard: DRAW }),
      H('hard-fold-leaf', '전개도에서 한 면하고만 붙어 있는 면과 수직인 면', '26, 기본 ①54 ②58 ③48', (d) => {
        // 그림에 함정을 둔다: 전개도에서 한 면하고만 붙어 있는 면을 묻는다.
        // 보기 — 붙어 있는 면 하나만: 붙어 있어야 수직이라고 보는 아이 / 다섯 면 모두: 평행한 면을 빼지 못하는 아이 / 세 면: 떨어져 있는 면 하나를 평행하다고 보는 아이
        const cube = d.bool(), net = cube ? cubeNet(d, { row4: true }) : randomBox(d, { strip: true }), touching = (x) => SIX.filter((y) => y !== x && K.touch(net.rects[x], net.rects[y]));
        const i = d.pick(SIX.filter((x) => touching(x).length === 1)), near = touching(i)[0], perp = SIX.filter((x) => isPerp(net.face[i], net.face[x])), far = d.pick(perp.filter((x) => x !== near));
        const rows = d.shuffle([perp, [near], SIX.filter((x) => x !== i), perp.filter((x) => x !== far)]), ok = (list) => letters(list) === letters(perp);
        return C(`전개도를 접어서 ${Kname(cube)}를 만들었다. 면 ${TAGS[i]}와 수직으로 만나는 면을 모두 고른 것은?`, rows.map(letters), rows.findIndex(ok), {
          figure: lettered(net, cube), explain: `전개도에서 면 ${TAGS[i]}는 면 ${TAGS[near]}하고만 붙어 있지만, 접으면 마주 보는 면 ${TAGS[oppositeOf(net, i)]}를 뺀 네 면과 모두 수직으로 만난다. 수직으로 만나는 면은 ${letters(perp)}이다.`, facts: { truth: rows.map(ok), want: true }
        });
      }, { standard: DRAW }),
      H('hard-parallel-bent', '꺾인 전개도에서 마주 보는 면', '25, 기본 ①53 ②56 ③47', (d) => {
        // 그림에 함정을 둔다: 한 줄에 네 면이 놓이지 않은 전개도에서, 나란히 놓이지 않은 두 면이 마주 보는 경우를 묻는다. 「한 칸 건너 나란히 있는 면」만 찾는 아이는 답을 못 찾거나 가장 멀리 있는 면을 고른다.
        const made = d.until(() => { const net = cubeNet(d, { row4: false }), i = d.int(0, 5), j = oppositeOf(net, i), a = net.rects[i], b = net.rects[j]; return a.x !== b.x && a.y !== b.y ? { net, i, j } : null; }, Boolean), { net, i, j } = made;
        const rows = d.shuffle([j].concat(d.shuffle(SIX.filter((x) => x !== i && x !== j)).slice(0, 3)));
        return C(`정육면체의 전개도를 접었을 때 면 ${TAGS[i]}와 마주 보는 면은?`, rows.map((x) => '면 ' + TAGS[x]), rows.indexOf(j), {
          figure: lettered(net, true), explain: `전개도를 접으면 면 ${letters(SIX.filter((x) => isPerp(net.face[i], net.face[x])))}의 네 면이 면 ${TAGS[i]}와 이웃하게 된다. 남은 면 ${TAGS[j]}가 면 ${TAGS[i]}와 마주 본다. 한 줄로 나란히 놓여 있지 않아도 접으면 마주 보게 된다.`, facts: { truth: rows.map((x) => isPara(net.face[i], net.face[x])), want: true }
        });
      }, { standard: DRAW }),
      H('hard-meet-two', '전개도를 접었을 때 두 점과 만나는 점', '29, 기본 ①51 ②60 ③50', (d) => {
        // 그림에 함정을 둔다: 접으면 세 점이 한 꼭짓점이 되는 점을 묻는다. 「한 점은 한 점하고만 만난다」고 보는 아이는 하나만 고른다.
        const cube = d.bool(), made = d.until(() => {
          const net = cube ? cubeNet(d) : randomBox(d), groups = {};
          net.ring.forEach((key, k) => { const v = net.map.get(key); (groups[v] = groups[v] || []).push(k); });
          const trios = Object.keys(groups).map((v) => groups[v]).filter((g) => g.length === 3);
          return trios.length ? { net, trio: d.shuffle(d.pick(trios)) } : null;
        }, Boolean), net = made.net, [p, q1, q2] = made.trio, vOf = (k) => net.map.get(net.ring[k]), wrong = d.pick([p - 1, p + 1, q1 + 1, q2 - 1].map((k) => (k + 14) % 14).filter((k) => vOf(k) !== vOf(p)));
        const said = (list) => list.slice().sort((a, b) => a - b).map((k) => '점 ' + POINTS[k]).join(', '), rows = d.shuffle([[q1, q2], [q1], [q2], [q1, wrong]]), ok = (list) => said(list) === said([q1, q2]);
        const cuts = cutsOf(net), pairs = cuts.filter((c) => c.a === p || c.b === p).map((c) => `선분 ${c.name}은 선분 ${partnerOf(cuts, c).name}과`);
        return C(`${Kname(cube)}의 전개도를 접었을 때 점 ${POINTS[p]}과 만나는 점을 모두 고른 것은?`, rows.map(said), rows.findIndex(ok), {
          figure: pointed(net, cube), explain: `전개도를 접으면 ${pairs.join(', ')} 맞닿는다. 그래서 점 ${POINTS[p]}은 ${said([q1, q2])}과 한 꼭짓점에서 만난다. 꼭짓점에는 면 3개가 모이므로 전개도의 세 점이 한 꼭짓점이 되기도 한다.`, facts: { truth: rows.map(ok), want: true }
        });
      }, { standard: DRAW }),
      H('hard-seg-far', '전개도에서 떨어져 있는 두 선분이 맞닿는 경우', '30, 기본 ①52 ②61 ③51', (d) => {
        // 그림에 함정을 둔다: 맞닿는 선분이 바로 옆에 이어져 있지 않은 선분을 묻는다. 「옆에 이어진 선분끼리 맞닿는다」고 보는 아이는 이웃한 선분을 고른다.
        const cube = d.bool(), made = d.until(() => {
          const net = cube ? cubeNet(d) : randomBox(d), cuts = cutsOf(net), apart = cuts.filter((c) => { const t = partnerOf(cuts, c); return t.a !== c.b && t.b !== c.a; });
          return apart.length ? { net, cuts, s: d.pick(apart) } : null;
        }, Boolean), { net, cuts, s } = made, t = partnerOf(cuts, s), beside = cuts.filter((c) => c !== t && (c.a === s.b || c.b === s.a)), vOf = (k) => net.map.get(net.ring[k]), meets = (k) => (vOf(t.a) === vOf(k) ? t.a : t.b);
        const rows = d.shuffle([t].concat(beside, d.shuffle(cuts.filter((c) => c !== s && c !== t && !beside.includes(c))).slice(0, 3 - beside.length)));
        return C(`${Kname(cube)}의 전개도를 접을 때 선분 ${s.name}과 맞닿아 한 모서리가 되는 선분은?`, rows.map((c) => '선분 ' + c.name), rows.indexOf(t), {
          figure: pointed(net, cube), explain: `전개도를 접으면 점 ${POINTS[s.a]}은 점 ${POINTS[meets(s.a)]}과, 점 ${POINTS[s.b]}은 점 ${POINTS[meets(s.b)]}과 만난다. 그래서 선분 ${s.name}은 떨어져 있는 선분 ${t.name}과 맞닿는다.`, facts: { truth: rows.map((c) => c.edge === s.edge), want: true }
        });
      }, { standard: DRAW }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-fold-both-perp', '전개도에서 두 면에 모두 수직인 면', '27, 기본 ①54 ③48', (d) => {
        const cube = d.bool(), net = cube ? cubeNet(d) : randomBox(d), i = d.int(0, 5), j = d.pick(SIX.filter((x) => isPerp(net.face[i], net.face[x]))), both = SIX.filter((x) => isPerp(net.face[x], net.face[i]) && isPerp(net.face[x], net.face[j]));
        const oi = oppositeOf(net, i), oj = oppositeOf(net, j), rows = d.shuffle([both, [both[0], oi], [both[1], oj], [oi, oj]]), ok = (list) => letters(list) === letters(both);
        return C(`전개도를 접어서 ${Kname(cube)}를 만들었다. 면 ${TAGS[i]}와도 수직이고 면 ${TAGS[j]}와도 수직인 면을 모두 고른 것은?`, rows.map(letters), rows.findIndex(ok), {
          figure: lettered(net, cube), explain: `면 ${TAGS[i]}와 마주 보는 면은 면 ${TAGS[oi]}이고, 면 ${TAGS[j]}와 마주 보는 면은 면 ${TAGS[oj]}이다. 마주 보는 면은 수직이 아니므로 이 두 면을 빼면 면 ${letters(both)}가 남는다.`, facts: { truth: rows.map(ok), want: true }
        });
      }, { standard: DRAW }),
      H('hard-perp-shape', '색칠한 면과 수직인 면의 모양', '12', (d) => {
        // 색칠한 면과 모양이 같은 직사각형은 평행한 면의 모양이다. 수직인 면을 찾으며 평행한 면을 빼고(한 번), 그 면들의 두 변의 길이를 겨냥도에서 읽는다(두 번).
        const dims = dims3(d, 4, 9), f = d.pick([5, 2, 1]), order = d.shuffle([0, 1, 2]), sides = (ax) => d.shuffle(dims.filter((_, i) => i !== ax)), labels = TAGS.slice(0, 3), flags = order.map((ax) => ax !== (f >> 1)), made = setOptions(d, labels, flags);
        const lone = order.indexOf(f >> 1), [x, y] = dims.filter((_, i) => i !== (f >> 1)), k = 62 / Math.max(...dims);
        return C('직육면체에서 색칠한 면과 수직인 면의 모양을 모두 고른 것은?', made.options, made.answer, {
          figure: sketch(dims, { tint: { [f]: YELLOW }, lens: withLens(dims), label: `직육면체의 겨냥도. ${saidLens(dims)}. ${['', '오른쪽 옆면', '앞면', '', '', '윗면'][f]}을 색칠했다.` }) + tiles(order.map((ax) => { const [w, h] = sides(ax); return paper(w, h, k); }), labels),
          explain: `색칠한 면은 두 변의 길이가 ${x} cm, ${y} cm인 직사각형이다. 이 면과 모양이 같은 면은 마주 보는 면 하나뿐이고, 그 면은 색칠한 면과 평행하다. 색칠한 면과 수직인 네 면은 ${labels.filter((_, i) => i !== lone).join(', ')}와 같은 모양이 2개씩이다.`, facts: { sets: { labels, flags, options: made.sets } }
        });
      }),
      H('hard-third-face', '두 가지 종이로 직육면체를 만들 때 더 필요한 종이', '40, 기본 ②23', (d) => {
        // 두 종이에 모두 있는 길이의 변끼리 맞닿는다는 것을 찾고(한 번), 남은 면의 두 변을 댄다(두 번). 길이 셈은 없다.
        const [a, b, c] = dims3(d, 4, 12), k = 78 / Math.max(a, b, c), turn = d.bool();
        return M('직사각형 모양의 종이 가와 나가 2장씩 있다. 모양과 크기가 같은 직사각형 모양의 종이 2장을 더하여, 종이 6장을 면으로 하는 직육면체를 만들려고 한다. 더 필요한 종이의 두 변의 길이는 각각 몇 cm인가?', [{ label: '한 변', answer: a, unit: 'cm' }, { label: '다른 한 변', answer: c, unit: 'cm' }], {
          unordered: true, figure: tiles([paper(a, b, k), turn ? paper(c, b, k) : paper(b, c, k)]),
          explain: `가와 나에 모두 있는 ${b} cm인 변끼리 맞닿아 한 모서리가 된다. 이 직육면체의 서로 다른 세 모서리의 길이는 ${a} cm, ${b} cm, ${c} cm이다. 가는 ${a} cm와 ${b} cm, 나는 ${b} cm와 ${c} cm인 면이므로, 남은 면은 두 변의 길이가 ${a} cm, ${c} cm인 직사각형이다.`, facts: { calc: [[String(a), 0], [String(c), 1]] }
        });
      }),
      H('hard-net-sum', '전개도를 접은 직육면체의 모든 모서리의 길이의 합', '기본 ①62 ②70', (d) => {
        const dims = dims3(d, 3, 9), net = boxNet(d, dims, { cols: 40, rows: 30 }), cuts = cutsOf(net), box = boundsOf(net.rects), given = dims.map((L) => d.pick(cuts.filter((c) => lenOf(c) === L))), [a, b, c] = dims, total = (a + b + c) * 4;
        return N('직육면체의 전개도이다. 이 전개도를 접어서 만든 직육면체의 모든 모서리의 길이의 합은 몇 cm인가?', total, {
          unit: 'cm', figure: netArt(net.rects, { unit: Math.min(236 / box.w, 200 / box.h), lens: given.map((g) => ({ a: g.at[0], b: g.at[1], text: cm(lenOf(g)) })), label: `직육면체의 전개도. 테두리의 세 선분의 길이 ${dims.map(cm).join(', ')}` }),
          explain: `전개도에 적힌 세 길이가 직육면체의 서로 다른 세 모서리의 길이이다. 직육면체에는 길이가 같은 모서리가 4개씩 있으므로 (${a} + ${b} + ${c}) × 4 = ${total}(cm)`, facts: { calc: [[`(${a}+${b}+${c})*4`, 0]], unseen: [4] }
        });
      }, { standard: DRAW }),
      H('hard-sum-ratio', '보이지 않는 모서리의 길이의 합과 다른 모서리의 길이의 합', '46·47, 기본 ②51', (d, n) => {
        const [a, b, c] = dims3(d, 4, 12), s = a + b + c;
        if (n === 1) return N(`모든 모서리의 길이의 합이 ${s * 4} cm인 직육면체의 겨냥도를 그렸다. 이 겨냥도에서 보이지 않는 모서리의 길이의 합은 몇 cm인가?`, s, {
          unit: 'cm', figure: sketch([a, b, c]), explain: `직육면체에는 가로, 세로, 높이 쪽 모서리가 4개씩 있다. 보이지 않는 모서리 3개는 가로, 세로, 높이 쪽 모서리가 하나씩이므로, 그 길이의 합은 모든 모서리의 길이의 합을 4로 나눈 것이다. ${s * 4} ÷ 4 = ${s}(cm)`, facts: { calc: [[`${s * 4}/4`, 0]], unseen: [4] }
        });
        return N(`어떤 직육면체의 겨냥도에서 보이지 않는 모서리의 길이의 합이 ${s} cm이다. 이 겨냥도에서 보이는 모서리의 길이의 합은 몇 cm인가?`, s * 3, {
          unit: 'cm', figure: sketch([a, b, c]), explain: `보이지 않는 모서리 3개는 가로, 세로, 높이 쪽 모서리가 하나씩이다. 보이는 모서리 9개는 가로, 세로, 높이 쪽 모서리가 3개씩이므로, 그 길이의 합은 보이지 않는 모서리의 길이의 합의 3배이다. ${s} × 3 = ${s * 3}(cm)`, facts: { calc: [[`${s}*3`, 0]], unseen: [3] }
        });
      }, { count: 2, standard: DRAW }),
      H('hard-move-face', '면 하나를 옮겨 정육면체의 전개도로 고치기', '기본 ①66 ②69 ③45', (d) => {
        // 접으면 겹치는 두 면을 찾고(한 번), 그 가운데 하나를 떼어 붙일 자리가 있는지 따진다(두 번). 보기 넷 가운데 옮겨서 전개도가 되는 면은 하나뿐이다.
        const made = d.until(() => {
          const cells = d.pick(CUBE_FAKES).cells, fixedBy = cells.map((c, i) => {
            const rest = cells.filter((_, k) => k !== i), spots = [];
            for (const [x, y] of rest) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const s = [x + dx, y + dy]; if (!cells.some((q) => q[0] === s[0] && q[1] === s[1]) && !spots.some((q) => q[0] === s[0] && q[1] === s[1])) spots.push(s); }
            const good = spots.filter((s) => isNet(rest.concat([s])));
            return good.length ? d.pick(good) : null;
          });
          const yes = SIX.filter((i) => fixedBy[i]), no = SIX.filter((i) => !fixedBy[i]);
          if (!yes.length || no.length < 3) return null;
          const pick = d.pick(yes);
          return { cells, pick, spot: fixedBy[pick], rows: d.shuffle([pick].concat(d.shuffle(no).slice(0, 3))), yes };
        }, Boolean), { cells, pick, spot, rows, yes } = made, res = fold(cellRects(cells), true), twin = SIX.find((i) => i !== pick && res.face[i] === res.face[pick]);
        const after = cells.map((c, i) => (i === pick ? spot : c)), tint = {}; tint[pick] = YELLOW;
        return C('정사각형 6개를 이어 붙였더니 정육면체의 전개도가 되지 않았다. 면 1개만 다른 자리로 옮겨 정육면체의 전개도를 만들려고 한다. 옮길 수 있는 면은?', rows.map((i) => '면 ' + TAGS[i]), rows.indexOf(pick), {
          figure: netArt(cellRects(cells), { unit: 32, faceText: TAGS, label: '정사각형 6개를 이어 붙인 그림. 면에 가, 나, 다, 라, 마, 바를 적었다.' }),
          explain: (twin == null ? '' : `이 그림을 접으면 면 ${TAGS[pick]}와 면 ${TAGS[twin]}가 같은 자리에 겹친다. `) + `면 ${TAGS[pick]}를 떼어 아래 그림처럼 옮겨 붙이면 접었을 때 여섯 면이 서로 겹치지 않는다.` + '<div style="margin-top:6px">' + netArt(cellRects(after), { unit: 24, faceText: TAGS, tint, label: `면 ${TAGS[pick]}를 옮겨 붙여 만든 정육면체의 전개도` }) + '</div>',
          facts: { truth: rows.map((i) => yes.includes(i)), want: true }
        });
      }, { standard: DRAW })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
