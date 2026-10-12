// 5학년 2학기 5단원 직육면체 — 직육면체의 성질, 겨냥도, 전개도 알아보기, 전개도를 접었을 때의 기본 문항.
// 단원 틀과 그림 도구(B.kit.box525)는 5-2-5a.js 에 있다. 실력 문항은 5-2-5c.js, 대조표는 수집본의 _분석/5-2-5/싣기_대조표.md.
//
// 싣는 기준(5-2-5a.js 에 적은 것 말고)
//  - 면 사이의 관계(평행·수직), 보이는 것과 보이지 않는 것, 전개도를 접었을 때 만나는 면·점·선분은 모두 얼개(면 번호·꼭짓점 번호)와 접어 보는 셈으로 판정하여 답을 낸다.
//  - 교육과정이 평가의 중점으로 꼽은 「전개도가 될 수 있는 것과 될 수 없는 것 구별하기」는 정육면체와 직육면체로 나누어 「되는 것 하나 / 안 되는 것 하나 / 모두」와
//    까닭 고르기, 면을 더 붙일 자리, 겨냥도에 맞는 전개도 고르기로 넉넉히 실었다. 가짜 전개도는 면의 수와 크기가 맞는데도 접으면 겹치는 것, 면 하나의 크기가 다른 것을 섞는다.
//  - 전개도의 점 이름은 교과서처럼 테두리를 따라 ㄱ부터 ㅎ까지 14개를 붙인다. 면의 이름은 가~바를 읽는 차례로 붙인다.
//  - 길이는 맞닿는 변·평행한 변의 길이를 그대로 읽는 것과 한 번 더하는 것(옆면이 이어진 선분)만 싣는다.
//
// 뺀 것과 까닭(이 파일의 네 묶음)
//  - 평행한 면의 쌍 수와 수직인 면의 수를 더하기(①26의 변형), 보이는 것·보이지 않는 것의 수의 합·차·곱(①39의 변형 ②45 ③37의 변형 심20): 뜻 없는 셈
//  - 평행한 면에 색칠하기(①23 ②26 ③24)·전개도에 색칠하기(②57·59): 바르게 색칠한 그림 고르기, 평행한·수직인 면 고르기로 바꾸어 실었다.
//  - 세 면에 색종이를 붙인 상자에서 나머지 면의 색(②39의 변형), 평행한 면 세 쌍을 모두 쓰기(①24 ②28 ③23의 변형): 「평행한 면의 이름」과 같은 판단이다.
//  - 보이지 않는(보이는) 모서리의 길이의 합에서 한 모서리(①45 ②50 ③39), 직육면체와 정육면체의 합 비교·두 합의 차(심44·45의 변형): 길이를 거꾸로·거듭 셈한다.
//  - 겨냥도·전개도 그리기와 완성하기(①41·65·67·68 ②42·67·68 ③34·40·54~56 심24·72): 「빠뜨린 모서리와 그릴 선」「잘못 그린 모서리」「면을 붙일 자리」「겨냥도에 맞는 전개도」로 바꾸어 실었다.
//  - 전개도에서 길이가 같은 선분을 모두 찾기(①60): 그림을 정확한 크기로 그리면 눈으로 길이를 견주게 된다. 맞닿는 선분의 길이를 읽는 문항이 같은 성질을 묻는다.
//  - 전개도 설명의 참·거짓을 한꺼번에 가리기(①58): 평행한 면·만나는 점 문항과 같은 판단을 묶은 것이다.
//  - 전개도의 색칠한 면을 겨냥도에서 찾아 색칠하기(①57): 작도. 겨냥도와 전개도를 맞추는 일은 「겨냥도와 전개도의 꼭짓점 맞추기」가 묻는다.
//  - 옆으로 선 면을 밑면으로 잡는 문제(①28 ②29의 대표), 한 면하고만 붙어 있는 면·꺾인 전개도·세 점이 만나는 점·떨어져 있는 선분: 그림에 함정이 있는 것은 실력(5-2-5c.js)에 실었다.
//  - 전개도의 둘레·넓이(①63·64 ②71 ③58·59 심59~61·68), 끈·테이프(①69·70 ②64·73·74 ③57 심62·63·73·74), 주사위 눈의 합(①71~73 ②75·76 ③60 심70·71): 5-2-5a.js 머리의 「뺀 것」을 볼 것.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, tagged } = B.kit;
  const K = B.kit.box525;
  const { TAGS, MARKS, cm, fixed, setOptions, say, pickWord, tiles, YELLOW, BLUE, VERTS, VNAME, FACES, EDGES, faceHas, facesAt, opposite, isPara, isPerp, face, edge, dims3,
    sketch, seenEdge, seenVert, withLens, saidLens, fold, whyNot, WHY, POINTS, boundsOf, netArt, cellRects, CUBE_NETS, CUBE_FAKES, hasRow4, pickShapes, cubeArt, boxNet, cubeNet, rectName, cutsOf, fakeMove, fakeSize, NAMED, namedBox } = K;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const FPOS = ['왼쪽 옆면', '오른쪽 옆면', '앞면', '뒷면', '아랫면', '윗면'];
  const ALL_EDGES = EDGES.map((_, i) => i);
  // 서로 수직인 두 면
  const perpPair = (d) => { const f = d.pick(FACES); return [f, d.pick(FACES.filter((g) => isPerp(f, g)))]; };
  // 두 면에 모두 수직인 두 면
  const thirds = (f, g) => { const ax = 3 - (f >> 1) - (g >> 1); return [ax * 2, ax * 2 + 1]; };

  // ── 직육면체의 성질 ──────────────────────────────────────────
  B.addTypes('5-2-5', 'faces', [
    T('faces-word', '밑면과 옆면의 뜻', '①22 ②25 ③22', (d, n) => (n === 0
      ? pickWord(d, '직육면체에서 계속 늘여도 만나지 않는 두 면을 서로 ㉠하다고 하고, 이 두 면을 직육면체의 ㉡이라고 한다. ㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', '평행, 밑면', ['수직, 밑면', '평행, 옆면', '수직, 옆면'], '직육면체에서 마주 보는 두 면은 계속 늘여도 만나지 않으므로 서로 평행하다. 이 두 면을 직육면체의 밑면이라고 한다.')
      : pickWord(d, '직육면체에서 밑면과 수직인 면을 무엇이라고 하는가?', '옆면', ['밑면', '모서리', '꼭짓점'], '직육면체에서 서로 평행한 두 면을 밑면이라고 하고, 밑면과 수직인 면을 옆면이라고 한다.')), { count: 2 }),
    T('faces-counts', '평행한 면의 쌍 수와 수직인 면의 수', '①26 ②32 ③29', () => M('직육면체에서 서로 평행한 면은 모두 몇 쌍인가? 또 한 면과 수직인 면은 모두 몇 개인가?', [{ label: '서로 평행한 면', answer: 3, unit: '쌍' }, { label: '한 면과 수직인 면', answer: 4, unit: '개' }], {
      explain: '직육면체에서 마주 보는 면끼리 평행하므로 서로 평행한 면은 3쌍이다. 한 면은 마주 보는 면 하나를 뺀 나머지 4개의 면과 수직으로 만난다.', facts: fixed(3, 4)
    })),
    T('faces-side-count', '옆면의 수와 한 꼭짓점에서 만나는 면의 수', '①26·32 ②15·32 ③29', () => M('직육면체에서 한 밑면에 대한 옆면은 모두 몇 개인가? 또 한 꼭짓점에서 만나는 면은 모두 몇 개인가?', [{ label: '옆면', answer: 4, unit: '개' }, { label: '한 꼭짓점에서 만나는 면', answer: 3, unit: '개' }], {
      explain: '밑면과 수직인 면이 옆면이고, 한 밑면에 대한 옆면은 4개이다. 한 꼭짓점에서는 면 3개가 만나고, 이 세 면은 서로 수직이다.', facts: fixed(4, 3)
    })),
    T('faces-parallel', '평행한 면 찾기', '①24 ②28 ③23 심10', (d) => {
      const f = d.pick(FACES), rows = d.shuffle([opposite(f)].concat(d.shuffle(FACES.filter((g) => isPerp(f, g))).slice(0, 3)));
      return C(`직육면체에서 ${face(f)}과 평행한 면은?`, rows.map(face), rows.indexOf(opposite(f)), {
        figure: namedBox(d), explain: `${face(f)}과 마주 보는 ${face(opposite(f))}은 계속 늘여도 ${face(f)}과 만나지 않으므로 서로 평행하다. 나머지 네 면은 ${face(f)}과 수직으로 만난다.`, facts: { truth: rows.map((g) => isPara(f, g)), want: true }
      });
    }),
    T('faces-shaded', '색칠한 두 면의 관계', '①23 ②26·27·34 ③24·27', (d, n) => {
      // 색칠하기를 바르게 색칠한 그림 고르기로 바꾸었다. 마주 보는 두 면 가운데 하나는 보이지 않는 면이라 점선 안쪽이 비쳐 보이게 칠한다.
      const dims = d.pick([[4.4, 3.4, 3], [4, 3.6, 3.4], [4.6, 3, 3.6]]), small = (tint, said) => sketch(dims, { size: [78, 62], tint, label: said });
      if (n === 1) {
        const k = d.pick([1, 2]), pairs = d.shuffle(d.shuffle([[5, 4], [1, 0]]).slice(0, k).concat(d.shuffle([[2, 5], [2, 1], [5, 1], [2, 4], [1, 4]]).slice(0, 5 - k)));
        const flags = pairs.map(([f, g]) => isPerp(f, g)), made = setOptions(d, TAGS.slice(0, 5), flags);
        return C('색칠한 두 면이 서로 수직인 것을 모두 고른 것은?', made.options, made.answer, {
          figure: tiles(pairs.map(([f, g]) => small({ [f]: YELLOW, [g]: YELLOW }, `${FPOS[f]}과 ${FPOS[g]}을 색칠한 직육면체`))),
          explain: `이웃한 두 면은 서로 수직으로 만난다. ${TAGS.filter((_, i) => flags[i] === false).join(', ')}는 마주 보는 두 면을 색칠한 것이라 두 면이 서로 평행하다.`, facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets } }
        });
      }
      const given = d.pick([5, 1]), cands = d.shuffle(given === 5 ? [4, 2, 1, 0] : [0, 5, 2, 4]), at = cands.indexOf(opposite(given));
      return C('노란색으로 칠한 면과 평행한 면을 파란색으로 칠한 것은?', TAGS.slice(0, 4), at, {
        figure: tiles(cands.map((c) => small({ [given]: YELLOW, [c]: BLUE }, `노란색으로 ${FPOS[given]}을, 파란색으로 ${FPOS[c]}을 칠한 직육면체`))),
        explain: `노란색으로 칠한 면과 마주 보는 면이 평행한 면이다. ${TAGS[at]}는 마주 보는 면을 칠했고, 나머지는 노란색으로 칠한 면과 수직으로 만나는 면을 칠했다.`, facts: { kindPick: { kinds: cands.map((c) => (isPara(given, c) ? 'para' : 'perp' + c)), target: 'para' } }
      });
    }, { count: 2 }),
    T('faces-perp', '수직인 면 찾기', '①25 ②31·33 ③25 심11', (d, n) => {
      const f = d.pick(FACES), others = d.shuffle(FACES.filter((g) => g !== f));
      if (n === 1) {
        const rows = d.shuffle([opposite(f)].concat(others.filter((g) => isPerp(f, g)).slice(0, 3)));
        return C(`직육면체에서 ${face(f)}과 수직이 아닌 면은?`, rows.map(face), rows.indexOf(opposite(f)), {
          figure: namedBox(d), explain: `${face(f)}과 만나는 네 면은 모두 ${face(f)}과 수직이다. 마주 보는 ${face(opposite(f))}은 ${face(f)}과 만나지 않고 평행하다.`, facts: { truth: rows.map((g) => !isPerp(f, g)), want: true }
        });
      }
      const labels = others.map(face), flags = others.map((g) => isPerp(f, g)), made = setOptions(d, labels, flags);
      return C(`직육면체에서 ${face(f)}과 수직인 면을 모두 고른 것은?`, made.options, made.answer, {
        figure: namedBox(d), explain: `${face(f)}과 만나는 면은 모두 ${face(f)}과 수직이다. 마주 보는 ${face(opposite(f))}만 평행하고, 나머지 네 면이 수직이다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('faces-angle', '두 면이 만나서 이루는 각', '①27 ②36 ③28 심15', (d) => {
      const [f, g] = perpPair(d);
      return N(`직육면체에서 ${face(f)}과 ${face(g)}이 만나서 이루는 각의 크기는 몇 도인가?`, 90, {
        unit: '°', figure: namedBox(d), explain: `${face(f)}과 ${face(g)}은 한 모서리에서 만나는 이웃한 면이다. 직육면체에서 이웃한 두 면은 수직으로 만나므로 이루는 각의 크기는 90°이다.`, facts: fixed(90)
      });
    }),
    T('faces-base', '밑면과 옆면 찾기', '①28 ②29·30 ③31', (d, n) => {
      // 기본에서는 위나 아래에 놓인 면을 밑면으로 준다(옆으로 선 면을 밑면으로 잡는 문제는 실력에 있다).
      if (n === 0) {
        const f = d.pick([4, 5]), rows = d.shuffle([opposite(f)].concat(d.shuffle(FACES.filter((g) => isPerp(f, g))).slice(0, 3)));
        return C(`직육면체에서 ${face(f)}이 한 밑면일 때 다른 밑면은?`, rows.map(face), rows.indexOf(opposite(f)), {
          figure: namedBox(d), explain: `서로 평행한 두 면이 밑면이다. ${face(f)}과 평행한 면은 마주 보는 ${face(opposite(f))}이다.`, facts: { truth: rows.map((g) => isPara(f, g)), want: true }
        });
      }
      const f = d.pick([4, 5]), others = d.shuffle(FACES.filter((g) => g !== f)), labels = others.map(face), flags = others.map((g) => isPerp(f, g)), made = setOptions(d, labels, flags);
      return C(`직육면체에서 ${face(f)}이 한 밑면일 때 옆면을 모두 고른 것은?`, made.options, made.answer, {
        figure: namedBox(d), explain: `밑면과 수직인 면이 옆면이다. ${face(f)}과 평행한 ${face(opposite(f))}은 다른 밑면이고, 나머지 네 면이 옆면이다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('faces-both-perp', '두 면에 모두 수직인 면', '①29 ③26 심13', (d) => {
      const [f, g] = perpPair(d), [s, t] = thirds(f, g), ok = (pair) => pair.every((x) => isPerp(x, f) && isPerp(x, g));
      const rows = d.shuffle([[s, t], [s, opposite(f)], [t, opposite(g)], [opposite(f), opposite(g)]]);
      return C(`직육면체에서 ${face(f)}과도 수직이고 ${face(g)}과도 수직인 면을 모두 고른 것은?`, rows.map((p) => p.map(face).join(', ')), rows.findIndex(ok), {
        figure: namedBox(d), explain: `${face(f)}과 수직인 면은 마주 보는 ${face(opposite(f))}을 뺀 네 면이고, ${face(g)}과 수직인 면은 마주 보는 ${face(opposite(g))}을 뺀 네 면이다. 두 쪽에 모두 드는 면은 ${face(s)}과 ${face(t)}이다.`, facts: { truth: rows.map(ok), want: true }
      });
    }),
    T('faces-perp-apart', '수직인 면 가운데 다른 면과 만나지 않는 면', '①30', (d) => {
      const [f, g] = perpPair(d), [s, t] = thirds(f, g), ok = (x) => isPerp(x, f) && isPara(x, g), rows = d.shuffle([opposite(g), opposite(f), s, t]);
      return C(`직육면체에서 ${face(f)}과 수직인 면 가운데 ${face(g)}과 만나지 않는 면은?`, rows.map(face), rows.findIndex(ok), {
        figure: namedBox(d), explain: `${face(g)}과 만나지 않는 면은 마주 보는 ${face(opposite(g))}뿐이다. ${face(opposite(g))}은 ${face(f)}과 이웃한 면이므로 ${face(f)}과 수직이다.`, facts: { truth: rows.map(ok), want: true }
      });
    }),
    T('faces-odd', '두 면 사이의 관계가 다른 것', '①31 ②35 심14', (d) => {
      const para = [[0, 1], [2, 3], [4, 5]], perp = [];
      for (const f of FACES) for (const g of FACES) if (f < g && isPerp(f, g)) perp.push([f, g]);
      const lone = d.pick(['para', 'perp']), rows = d.shuffle(lone === 'para' ? [d.pick(para)].concat(d.shuffle(perp).slice(0, 3)) : para.concat([d.pick(perp)])).map((p) => d.shuffle(p));
      const kinds = rows.map(([f, g]) => (isPara(f, g) ? 'para' : 'perp')), at = kinds.indexOf(lone);
      return C('직육면체에서 두 면 사이의 관계가 나머지와 다른 것은?', MARKS.slice(0, 4), at, {
        figure: namedBox(d) + tagged(rows.map(([f, g]) => `${face(f)}과 ${face(g)}`), MARKS),
        explain: lone === 'para' ? `${MARKS[at]}의 두 면은 마주 보는 면이라 서로 평행하다. 나머지는 모두 이웃한 면이라 서로 수직이다.` : `${MARKS[at]}의 두 면은 이웃한 면이라 서로 수직이다. 나머지는 모두 마주 보는 면이라 서로 평행하다.`, facts: { kindPick: { kinds, target: lone } }
      });
    }),
    T('faces-at-vertex', '한 꼭짓점에서 만나는 면', '①32 ②15 심5', (d) => {
      const v = d.pick(VERTS), mine = facesAt(v), picks = d.shuffle(mine.concat(d.shuffle(FACES.filter((f) => !mine.includes(f))).slice(0, 2))), labels = picks.map(face), flags = picks.map((f) => faceHas(f, v)), made = setOptions(d, labels, flags);
      return C(`직육면체에서 꼭짓점 ${VNAME[v]}에서 만나는 면을 모두 고른 것은?`, made.options, made.answer, {
        figure: namedBox(d), explain: `꼭짓점 ${VNAME[v]}이 들어 있는 면은 ${mine.map(face).join(', ')}의 3개이다. 한 꼭짓점에서 만나는 세 면은 서로 수직이다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('faces-say', '직육면체의 성질에 대한 설명', '①33 ②37 ③30 심18', (d, n) => {
      if (n === 0) return say(d, '직육면체의 성질에 대한 설명으로 옳지 않은 것은?',
        // 수(몇 쌍·몇 개)는 적지 않는다: 같은 묶음의 수를 묻는 문항(faces-counts, faces-side-count)의 답을 흘리지 않게 면 사이의 관계만 말한다.
        ['밑면과 옆면은 서로 수직이다.', '한 모서리에서 만나는 두 면은 서로 수직이다.', '서로 평행한 두 면은 밑면이 될 수 있다.', '두 밑면은 서로 만나지 않는다.', '마주 보는 두 면은 모양과 크기가 같다.', '한 꼭짓점에서 만나는 면들은 서로 수직이다.'],
        [['밑면은 바닥에 닿은 면 하나뿐이다.', '서로 평행한 두 면이면 어느 면이나 밑면이 될 수 있다.'], ['이웃한 두 면은 서로 평행하다.', '이웃한 두 면은 서로 수직이다.'], ['마주 보는 두 면은 서로 수직이다.', '마주 보는 두 면은 서로 평행하다.'], ['밑면과 옆면은 서로 평행하다.', '밑면과 옆면은 서로 수직이다.'],
          ['옆면끼리는 모두 서로 평행하다.', '이웃한 옆면끼리는 서로 수직이다.'], ['두 밑면은 한 모서리에서 만난다.', '두 밑면은 서로 평행하여 만나지 않는다.'], ['마주 보는 두 면은 크기가 다를 수 있다.', '마주 보는 두 면은 모양과 크기가 같다.']], false);
      // 면의 이름으로 적은 설명: 참·거짓은 면 번호로 따진다. [설명, 참인가, 바로잡는 말]
      const [f, g] = perpPair(d), o = opposite(f), claims = [
        [`${face(f)}과 ${face(o)}은 서로 평행하다.`, isPara(f, o), ''], [`${face(f)}과 ${face(g)}은 서로 수직이다.`, isPerp(f, g), ''], [`${face(f)}이 밑면이면 ${face(g)}은 옆면이다.`, isPerp(f, g), ''],
        [`${face(f)}과 ${face(g)}은 서로 평행하다.`, isPara(f, g), `${face(f)}과 ${face(g)}은 이웃한 면이라 서로 수직이다.`], [`${face(f)}과 ${face(o)}은 서로 수직이다.`, isPerp(f, o), `${face(f)}과 ${face(o)}은 마주 보는 면이라 서로 평행하다.`],
        [`${face(f)}이 밑면이면 ${face(o)}은 옆면이다.`, isPerp(f, o), `${face(f)}이 밑면이면 마주 보는 ${face(o)}은 다른 밑면이다.`], [`${face(g)}과 ${face(f)}은 만나지 않는다.`, isPara(f, g), `${face(g)}과 ${face(f)}은 한 모서리에서 만난다.`]];
      const wrong = d.shuffle(claims.filter((c) => !c[1])).slice(0, 3), rows = d.shuffle([d.pick(claims.filter((c) => c[1]))].concat(wrong));
      return C('그림의 직육면체에 대한 설명으로 옳은 것은?', rows.map((c) => c[0]), rows.findIndex((c) => c[1]), {
        figure: namedBox(d), explain: '마주 보는 두 면은 서로 평행하고, 이웃한 두 면은 서로 수직이다. ' + wrong.map((c) => c[2]).join(' '), facts: { truth: rows.map((c) => c[1]), want: true }
      });
    }, { count: 2 }),
    T('faces-colors', '평행한 면끼리 같은 색을 칠할 때 색의 수', '②39 심16', () => N('직육면체의 면에 색을 칠하려고 한다. 서로 평행한 면에는 같은 색을, 서로 수직인 면에는 다른 색을 칠하면 색은 모두 몇 가지 필요한가?', 3, {
      unit: '가지', explain: '직육면체에서 서로 평행한 면은 3쌍이다. 쌍마다 한 가지 색을 칠하고 쌍끼리는 서로 수직이라 다른 색을 칠해야 하므로 3가지 색이 필요하다.', facts: fixed(3)
    })),
    T('faces-parallel-around', '평행한 면의 네 모서리의 길이의 합', '①34 ②38 ③18 심48', (d) => {
      const dims = dims3(d, 4, 9), f = d.pick(FACES), [x, y] = dims.filter((_, ax) => ax !== (f >> 1)), total = (x + y) * 2;
      return N(`직육면체에서 ${face(f)}과 평행한 면의 네 모서리의 길이의 합은 몇 cm인가?`, total, {
        unit: 'cm', figure: sketch(dims, { names: true, lens: withLens(dims), label: `${NAMED}. ${saidLens(dims)}` }),
        explain: `${face(f)}과 평행한 면은 ${face(opposite(f))}이고, 평행한 두 면은 모양과 크기가 같다. 이 면은 길이가 ${x} cm인 모서리 2개와 ${y} cm인 모서리 2개로 둘러싸여 있으므로 (${x} + ${y}) × 2 = ${total}(cm)`, facts: { calc: [[`(${x}+${y})*2`, 0]], unseen: [2] }
      });
    })
  ]);

  // ── 직육면체의 겨냥도 ────────────────────────────────────────
  const SMALL_BOXES = [[4.4, 3.4, 3], [4, 3.6, 3.4], [3.4, 3.4, 4.2]];
  const hiddenEdges = (mirror) => ALL_EDGES.filter((e) => !seenEdge(e, mirror)), shownEdges = (mirror) => ALL_EDGES.filter((e) => seenEdge(e, mirror));
  const styleAll = (list, kind) => { const out = {}; list.forEach((e) => { out[e] = kind; }); return out; };
  B.addTypes('5-2-5', 'sketch', [
    T('sketch-word', '겨냥도의 뜻', '①36 ②40 ③32', (d, n) => (n === 0
      ? pickWord(d, '직육면체의 모양을 잘 알 수 있도록 보이지 않는 모서리까지 나타낸 그림을 무엇이라고 하는가?', '겨냥도', ['전개도', '밑면', '옆면'], '직육면체의 모양을 잘 알 수 있도록 나타낸 그림을 직육면체의 겨냥도라고 한다. 겨냥도에는 보이지 않는 모서리도 그린다.')
      : pickWord(d, '직육면체의 겨냥도에서 보이지 않는 모서리는 어떻게 그리는가?', '점선으로 그린다.', ['실선으로 그린다.', '그리지 않는다.', '굵은 선으로 그린다.'], '겨냥도에서 보이는 모서리는 실선으로, 보이지 않는 모서리는 점선으로 그린다.')), { count: 2 }),
    // 수를 묻는 문항을 「바르게 그린 겨냥도 고르기」보다 앞에 둔다(뒤 문항의 풀이가 보이는 모서리 9개·보이지 않는 모서리 3개를 말한다).
    T('sketch-count', '겨냥도에서 보이는 것과 보이지 않는 것의 수', '①38 ②44 ③36 심20', (d, n) => {
      const seen = n === 0, word = seen ? '보이는' : '보이지 않는', vals = seen ? [3, 9, 7] : [3, 3, 1];
      return M(`직육면체의 겨냥도에서 ${word} 면, ${word} 모서리, ${word} 꼭짓점은 각각 몇 개인가?`, ['면', '모서리', '꼭짓점'].map((label, i) => ({ label, answer: vals[i], unit: '개' })), {
        figure: sketch(dims3(d, 4, 8)), explain: seen ? '겨냥도에서 실선으로 둘러싸인 면 3개가 보인다. 실선으로 그린 모서리가 9개이고, 실선의 끝에 있는 꼭짓점이 7개이다.' : '겨냥도에서 보이지 않는 면은 3개이다. 점선으로 그린 모서리가 3개이고, 이 점선 3개가 만나는 꼭짓점 1개가 보이지 않는다.', facts: fixed(vals[0], vals[1], vals[2])
      });
    }, { count: 2 }),
    T('sketch-most', '보이는 것과 보이지 않는 것의 수 비교', '①39 ③37 심21', (d) => {
      const ALL = [['보이는 면의 수', 3], ['보이지 않는 면의 수', 3], ['보이는 모서리의 수', 9], ['보이지 않는 모서리의 수', 3], ['보이는 꼭짓점의 수', 7], ['보이지 않는 꼭짓점의 수', 1]], most = d.bool(), best = (list) => (most ? Math.max : Math.min)(...list.map((r) => r[1]));
      const rows = d.until(() => d.shuffle(ALL).slice(0, 4), (list) => list.filter((r) => r[1] === best(list)).length === 1);
      return C(`직육면체의 겨냥도에서 다음 가운데 가장 ${most ? '큰' : '작은'} 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === best(rows)), {
        explain: '겨냥도에서 보이는 면은 3개, 보이지 않는 면은 3개, 보이는 모서리는 9개, 보이지 않는 모서리는 3개, 보이는 꼭짓점은 7개, 보이지 않는 꼭짓점은 1개이다.', facts: { choose: { exprs: rows.map((r) => String(r[1])), rule: most ? 'max' : 'min' }, unseen: [1, 3, 7, 9] }
      });
    }),
    T('sketch-say', '겨냥도에 대한 설명', '②46 ③36 심22', (d) => say(d, '직육면체의 겨냥도에 대한 설명으로 옳지 않은 것은?',
      // 수를 그대로 적지 않고 견주는 말로 쓴다: 같은 묶음의 수를 묻는 문항(sketch-count)의 답을 흘리지 않는다.
      ['보이는 면과 보이지 않는 면은 수가 같다.', '보이는 모서리는 보이지 않는 모서리보다 많다.', '보이지 않는 꼭짓점은 보이지 않는 모서리보다 적다.', '보이는 꼭짓점은 보이는 모서리보다 적다.', '보이지 않는 모서리는 모두 한 꼭짓점에서 만난다.'],
      [['보이지 않는 꼭짓점과 보이지 않는 모서리는 수가 같다.', '보이지 않는 모서리는 3개이지만 보이지 않는 꼭짓점은 그 3개가 만나는 1개뿐이다.'], ['보이지 않는 면은 보이는 면보다 많다.', '보이는 면과 보이지 않는 면은 3개씩으로 같다.'], ['보이지 않는 모서리는 보이는 모서리보다 많다.', '보이는 모서리가 9개, 보이지 않는 모서리가 3개이다.'],
        ['보이는 꼭짓점과 보이지 않는 꼭짓점은 수가 같다.', '보이는 꼭짓점이 7개, 보이지 않는 꼭짓점이 1개이다.'], ['꼭짓점은 모두 보인다.', '꼭짓점 8개 가운데 1개는 보이지 않는다.']], false)),
    T('sketch-pick', '바르게 그린 겨냥도 고르기', '①37 ②41 ③33', (d) => {
      const mirror = d.bool(), dims = d.pick(SMALL_BOXES), hid = hiddenEdges(mirror), seen = shownEdges(mirror);
      const WRONG = {
        solid: () => [styleAll(hid, 'solid'), '보이지 않는 모서리를 실선으로 그렸다'], none: () => [styleAll(hid, 'none'), '보이지 않는 모서리를 그리지 않았다'],
        one: () => [styleAll([d.pick(hid)], 'solid'), '보이지 않는 모서리 하나를 실선으로 그렸다'], dash: () => [styleAll([d.pick(seen)], 'dash'), '보이는 모서리 하나를 점선으로 그렸다'], short: () => [styleAll([d.pick(hid)], 'none'), '보이지 않는 모서리 하나를 그리지 않았다']
      };
      const rows = d.shuffle([[{}, '']].concat(d.shuffle(Object.keys(WRONG)).slice(0, 3).map((k) => WRONG[k]()))), good = (r) => Object.keys(r[0]).length === 0, at = rows.findIndex(good);
      return C('직육면체의 겨냥도를 바르게 그린 것은?', TAGS.slice(0, 4), at, {
        figure: tiles(rows.map((r) => sketch(dims, { size: [84, 66], mirror, style: r[0], label: '직육면체를 그린 그림. 모서리를 실선과 점선으로 그렸다.' }))),
        explain: `겨냥도는 보이는 모서리 9개를 실선으로, 보이지 않는 모서리 3개를 점선으로 그린다. 바르게 그린 것은 ${TAGS[at]}이다. ` + rows.map((r, i) => (i === at ? '' : `${TAGS[i]}는 ${r[1]}.`)).filter(Boolean).join(' '),
        facts: { kindPick: { kinds: rows.map((r, i) => (good(r) ? 'ok' : 'bad' + i)), target: 'ok' } }
      });
    }),
    T('sketch-hidden', '보이지 않는 꼭짓점 찾기', '①40', (d) => {
      const mirror = d.bool(), hid = VERTS.find((v) => !seenVert(v, mirror)), rows = d.shuffle(VERTS.filter((v) => v === hid || EDGES.some((E) => E.v.includes(v) && E.v.includes(hid))));
      return C('직육면체의 겨냥도에서 보이지 않는 꼭짓점은?', rows.map((v) => '꼭짓점 ' + VNAME[v]), rows.indexOf(hid), {
        figure: sketch(dims3(d, 4, 8), { names: true, mirror, label: NAMED }),
        explain: `점선으로 그린 보이지 않는 모서리 3개가 만나는 꼭짓점 ${VNAME[hid]}이 보이지 않는 꼭짓점이다. 점선의 다른 쪽 끝에 있는 꼭짓점들은 실선으로 그린 모서리의 끝이기도 하므로 보인다.`, facts: { truth: rows.map((v) => !seenVert(v, mirror)), want: true }
      });
    }),
    T('sketch-missing', '빠뜨린 모서리와 그릴 선', '①41 ②42 ③34 심24', (d) => {
      // 겨냥도 완성하기를 고르기로 바꾸었다: 어느 모서리가 빠졌는지, 그 모서리가 보이는 모서리인지를 함께 가린다.
      const mirror = d.bool(), kind = (x) => (seenEdge(x, mirror) ? '실선' : '점선'), flip = (k) => (k === '실선' ? '점선' : '실선'), e = d.pick(ALL_EDGES);
      const e2 = d.pick(ALL_EDGES.filter((x) => seenEdge(x, mirror) !== seenEdge(e, mirror))), e3 = d.pick(ALL_EDGES.filter((x) => x !== e && x !== e2));
      const rows = d.shuffle([[e, kind(e)], [e, flip(kind(e))], [e2, kind(e2)], [e3, flip(kind(e3))]]), ok = (r) => r[0] === e && r[1] === kind(e);
      return C('직육면체의 겨냥도를 그리면서 모서리 하나를 빠뜨렸다. 빠뜨린 모서리와 그 모서리를 그릴 선을 바르게 짝 지은 것은?', rows.map((r) => `${edge(r[0])}, ${r[1]}`), rows.findIndex(ok), {
        figure: sketch(dims3(d, 4, 8), { names: true, mirror, style: styleAll([e], 'none'), label: '모서리 하나를 그리지 않은 직육면체의 겨냥도. 윗면 ㄱㄴㄷㄹ, 아랫면 ㅁㅂㅅㅇ' }),
        explain: `그림에는 ${edge(e)}이 없다. 이 모서리는 ${seenEdge(e, mirror) ? '보이는' : '보이지 않는'} 모서리이므로 ${kind(e)}으로 그린다.`, facts: { truth: rows.map(ok), want: true }
      });
    }),
    T('sketch-wrong-why', '겨냥도를 잘못 그린 까닭', '①42 ③35 심23', (d) => {
      const mirror = d.bool(), kind = d.pick(['solid', 'dash', 'none']), style = kind === 'dash' ? styleAll([d.pick(shownEdges(mirror))], 'dash') : styleAll(hiddenEdges(mirror), kind);
      const REASON = { solid: '보이지 않는 모서리를 실선으로 그렸다.', dash: '보이는 모서리를 점선으로 그렸다.', none: '보이지 않는 모서리를 그리지 않았다.' };
      const rows = d.shuffle(Object.keys(REASON).map((k) => [REASON[k], k === kind]).concat([['보이는 모서리를 그리지 않았다.', false]]));
      return C('직육면체의 겨냥도를 잘못 그렸다. 잘못 그린 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: sketch(dims3(d, 4, 8), { mirror, style, label: '잘못 그린 직육면체의 겨냥도' }),
        explain: '겨냥도는 보이는 모서리 9개를 실선으로, 보이지 않는 모서리 3개를 점선으로 그린다. ' + { solid: '이 그림은 모서리 12개를 모두 실선으로 그렸다.', dash: '이 그림은 점선이 4개이다. 보이는 모서리 하나를 점선으로 그렸다.', none: '이 그림에는 모서리가 9개뿐이다. 보이지 않는 모서리 3개를 그리지 않았다.' }[kind], facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('sketch-wrong-edges', '잘못 그린 모서리 찾기', '②43', (d) => {
      const mirror = d.bool(), [v1, v2] = d.shuffle(shownEdges(mirror)), [h1, h2] = d.shuffle(hiddenEdges(mirror)), key = (pair) => pair.slice().sort((a, b) => a - b).join();
      const rows = d.shuffle([[v1, h1], [v1, h2], [v2, h1], [v2, h2]]), ok = (pair) => key(pair) === key([v1, h1]), text = (pair) => pair.slice().sort((a, b) => (EDGES[a].name < EDGES[b].name ? -1 : 1)).map(edge).join(', ');
      return C('직육면체의 겨냥도에서 선을 잘못 그린 모서리 2개를 고른 것은?', rows.map(text), rows.findIndex(ok), {
        figure: sketch(dims3(d, 4, 8), { names: true, mirror, style: Object.assign(styleAll([v1], 'dash'), styleAll([h1], 'solid')), label: '모서리 2개의 선을 잘못 그린 직육면체의 겨냥도. 윗면 ㄱㄴㄷㄹ, 아랫면 ㅁㅂㅅㅇ' }),
        explain: `${edge(v1)}은 보이는 모서리인데 점선으로 그렸고, ${edge(h1)}은 보이지 않는 모서리인데 실선으로 그렸다. 보이지 않는 모서리 3개는 한 꼭짓점에서 만난다.`, facts: { truth: rows.map(ok), want: true }
      });
    }),
    T('sketch-hidden-sum', '보이지 않는 모서리의 길이의 합', '①43 ②48 ③38 심44', (d) => {
      const dims = dims3(d, 4, 12), [a, b, c] = dims;
      return N('직육면체의 겨냥도에서 보이지 않는 모서리의 길이의 합은 몇 cm인가?', a + b + c, {
        unit: 'cm', figure: sketch(dims, { lens: withLens(dims), label: `직육면체의 겨냥도. ${saidLens(dims)}` }),
        explain: `보이지 않는 모서리는 점선으로 그린 3개이고, 길이가 ${a} cm, ${b} cm, ${c} cm인 모서리가 하나씩이다. ${a} + ${b} + ${c} = ${a + b + c}(cm)`, facts: { calc: [[`${a}+${b}+${c}`, 0]] }
      });
    }),
    T('sketch-seen-sum', '보이는 모서리의 길이의 합', '①44 ②49 심45', (d, n) => {
      if (n === 1) { const s = d.int(3, 9); return N(`한 모서리의 길이가 ${s} cm인 정육면체의 겨냥도를 그렸다. 이 겨냥도에서 보이는 모서리의 길이의 합은 몇 cm인가?`, s * 9, { unit: 'cm', explain: `겨냥도에서 보이는 모서리는 9개이고, 정육면체는 모서리의 길이가 모두 같다. ${s} × 9 = ${s * 9}(cm)`, facts: { calc: [[`${s}*9`, 0]], unseen: [9] } }); }
      const dims = dims3(d, 4, 9), [a, b, c] = dims, total = (a + b + c) * 3;
      return N('직육면체의 겨냥도에서 보이는 모서리의 길이의 합은 몇 cm인가?', total, {
        unit: 'cm', figure: sketch(dims, { lens: withLens(dims), label: `직육면체의 겨냥도. ${saidLens(dims)}` }),
        explain: `보이는 모서리는 실선으로 그린 9개이고, 길이가 ${a} cm, ${b} cm, ${c} cm인 모서리가 3개씩이다. (${a} + ${b} + ${c}) × 3 = ${total}(cm)`, facts: { calc: [[`(${a}+${b}+${c})*3`, 0]], unseen: [3] }
      });
    }, { count: 2 })
  ]);

  // ── 전개도 알아보기 ──────────────────────────────────────────
  const isNet = (cells) => Boolean(fold(cellRects(cells)));
  const ROW4 = CUBE_NETS.filter((s) => hasRow4(s.cells)), BENT = CUBE_NETS.filter((s) => !hasRow4(s.cells));
  // 모눈 위의 작은 직육면체 전개도(그림 칸용)
  const SMALL = [[2, 3, 4], [2, 3, 5], [2, 4, 5]], LIM = { cols: 13, rows: 12 };
  const tileUnit = (list) => Math.max(7, Math.min(14, Math.floor(112 / Math.max(...list.map((r) => boundsOf(r).w)))));
  const gridNets = (list) => { const unit = tileUnit(list); return tiles(list.map((r) => netArt(r, { unit, grid: true, label: `모눈종이에 직사각형 ${r.length}개를 이어 붙인 그림` }))); };
  const same = (r, s) => JSON.stringify(r) === JSON.stringify(s);
  const whyText = (rects) => WHY[whyNot(rects)](rects);
  B.addTypes('5-2-5', 'net', [
    T('net-word', '전개도의 뜻', '①46 ②52 ③41 심39', (d, n) => (n === 0
      ? pickWord(d, '직육면체의 모서리를 잘라서 펼친 그림을 무엇이라고 하는가?', '전개도', ['겨냥도', '밑면', '옆면'], '직육면체의 모서리를 잘라서 펼친 그림을 직육면체의 전개도라고 한다.')
      : pickWord(d, '직육면체의 전개도에서 잘리지 않은 모서리(접는 선)는 어떻게 그리는가?', '점선으로 그린다.', ['실선으로 그린다.', '그리지 않는다.', '굵은 선으로 그린다.'], '전개도에서 잘린 모서리는 실선으로, 잘리지 않은 모서리는 점선으로 그린다.')), { count: 2 }),
    T('net-cube-yes', '정육면체의 전개도가 될 수 있는 것', '①47 ②53 ③42 심34', (d) => {
      const items = d.shuffle(pickShapes(d, ROW4, 1).concat(pickShapes(d, CUBE_FAKES, 3))), flags = items.map((s) => isNet(s.cells)), at = flags.indexOf(true);
      return C('정육면체의 전개도가 될 수 있는 것은?', TAGS.slice(0, 4), at, {
        figure: tiles(items.map((s) => cubeArt(s.cells))), explain: `${TAGS[at]}는 접으면 여섯 면이 서로 겹치지 않고 정육면체가 된다. 나머지는 접었을 때 서로 겹치는 면이 있어 정육면체가 되지 않는다.`,
        facts: { kindPick: { kinds: flags.map((ok, i) => (ok ? 'net' : 'no' + i)), target: 'net' } }
      });
    }),
    T('net-cube-no', '정육면체의 전개도가 될 수 없는 것', '①47 ②53 ③42 심34', (d) => {
      const items = d.shuffle(pickShapes(d, ROW4, 2).concat(pickShapes(d, BENT, 1), pickShapes(d, CUBE_FAKES, 1))), flags = items.map((s) => isNet(s.cells)), at = flags.indexOf(false);
      return C('정육면체의 전개도가 될 수 없는 것은?', TAGS.slice(0, 4), at, {
        figure: tiles(items.map((s) => cubeArt(s.cells))), explain: `${TAGS[at]}는 접었을 때 서로 겹치는 면이 있어 정육면체가 되지 않는다. 나머지는 접으면 여섯 면이 서로 겹치지 않는다.`,
        facts: { kindPick: { kinds: flags.map((ok, i) => (ok ? 'net' + i : 'no')), target: 'no' } }
      });
    }),
    T('net-cube-all', '정육면체의 전개도 모두 고르기', '①47 ②53 ③42 심34', (d) => {
      const k = d.pick([2, 3]), items = d.shuffle(pickShapes(d, BENT, 1).concat(pickShapes(d, ROW4, k - 1), pickShapes(d, CUBE_FAKES, 5 - k))), flags = items.map((s) => isNet(s.cells)), made = setOptions(d, TAGS.slice(0, 5), flags);
      return C('정육면체의 전개도를 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((s) => cubeArt(s.cells))), explain: `${TAGS.filter((_, i) => flags[i]).join(', ')}는 접으면 여섯 면이 서로 겹치지 않고 정육면체가 된다. ${TAGS.filter((_, i) => flags[i] === false).join(', ')}는 접었을 때 서로 겹치는 면이 있다.`,
        facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets } }
      });
    }),
    T('net-why', '전개도가 될 수 없는 까닭', '①49 ②53·54 ③44 심36', (d, n) => {
      // 까닭 쓰기를 까닭 고르기로 바꾸었다. 까닭은 접어 보는 셈(whyNot)으로 가린다.
      if (n === 0) {
        const rects = cellRects(d.pick(CUBE_FAKES).cells), why = whyNot(rects), rows = d.shuffle([['접었을 때 서로 겹치는 면이 있다.', why === 'overlap'], ['면이 6개가 아니다.', why === 'count'], ['정사각형이 아닌 면이 있다.', false], ['접는 선을 점선으로 그리지 않았다.', false]]);
        return C('정사각형 6개를 이어 붙인 그림이다. 이 그림이 정육면체의 전개도가 될 수 없는 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: netArt(rects, { unit: 26, label: '정사각형 6개를 이어 붙인 그림' }), explain: '면은 6개이고 모두 정사각형이지만, 접으면 두 면이 같은 자리에 겹쳐서 한 면이 비게 된다.', facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }
      const rects = d.until(() => fakeSize(d, boxNet(d, d.shuffle(d.pick(SMALL)), LIM).rects, LIM), Boolean), why = whyNot(rects);
      // 「3쌍」이라고 적지 않는다(같은 묶음의 net-say 가 쌍의 수를 묻는다).
      const rows = d.shuffle([['모양과 크기가 같은 짝이 없는 면이 있다.', why === 'pairs'], ['면이 6개가 아니다.', why === 'count'], ['직사각형이 아닌 면이 있다.', false], ['접는 선을 점선으로 그리지 않았다.', false]]);
      return C('모눈종이에 직사각형 6개를 이어 붙인 그림이다. 이 그림이 직육면체의 전개도가 될 수 없는 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: netArt(rects, { unit: 14, grid: true, label: '모눈종이에 직사각형 6개를 이어 붙인 그림' }),
        explain: '직육면체는 마주 보는 면끼리 모양과 크기가 같으므로 전개도에는 모양과 크기가 같은 면이 3쌍 있어야 한다. 이 그림에는 모양과 크기가 같은 짝이 없는 면이 있다.', facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { count: 2 }),
    T('net-box-yes', '직육면체의 전개도가 될 수 있는 것', '①48 ②54 ③43 심35', (d) => {
      // 가짜 셋: 면의 수와 크기는 맞지만 접으면 겹치는 것 둘, 면 하나의 크기가 다른 것 하나
      const dims = d.shuffle(d.pick(SMALL)), net = () => boxNet(d, dims, LIM).rects;
      const items = d.shuffle(d.until(() => { const f1 = fakeMove(d, net(), LIM), f2 = fakeMove(d, net(), LIM), f3 = fakeSize(d, net(), LIM); return f1 && f2 && f3 && !same(f1, f2) ? [net(), f1, f2, f3] : null; }, Boolean));
      const flags = items.map((r) => Boolean(fold(r))), at = flags.indexOf(true);
      return C('모눈종이에 그린 그림 가운데 직육면체의 전개도가 될 수 있는 것은?', TAGS.slice(0, 4), at, {
        figure: gridNets(items), explain: `${TAGS[at]}는 모양과 크기가 같은 면이 3쌍이고, 접으면 겹치는 면 없이 맞닿는 모서리의 길이가 같다. ` + items.map((r, i) => (i === at ? '' : `${TAGS[i]}는 ${whyText(r)}.`)).filter(Boolean).join(' '),
        facts: { kindPick: { kinds: flags.map((ok, i) => (ok ? 'net' : 'no' + i)), target: 'net' } }
      });
    }),
    T('net-box-no', '직육면체의 전개도가 될 수 없는 것', '①48 ②54 ③43 심35', (d) => {
      const dims = d.shuffle(d.pick(SMALL)), net = () => boxNet(d, dims, LIM).rects;
      const items = d.shuffle(d.until(() => { const a = net(), b = net(), c = net(), f = (d.bool() ? fakeMove : fakeSize)(d, net(), LIM); return f && !same(a, b) && !same(a, c) && !same(b, c) ? [a, b, c, f] : null; }, Boolean));
      const flags = items.map((r) => Boolean(fold(r))), at = flags.indexOf(false);
      return C('모눈종이에 그린 그림 가운데 직육면체의 전개도가 될 수 없는 것은?', TAGS.slice(0, 4), at, {
        figure: gridNets(items), explain: `${TAGS[at]}는 ${whyText(items[at])}. 나머지는 접으면 겹치는 면 없이 직육면체가 된다.`,
        facts: { kindPick: { kinds: flags.map((ok, i) => (ok ? 'net' + i : 'no')), target: 'no' } }
      });
    }),
    T('net-say', '전개도에 대한 설명', '①50 ②52 심39', (d, n) => (n === 1
      ? N('직육면체의 전개도에서 모양과 크기가 같은 면은 모두 몇 쌍인가?', 3, { unit: '쌍', explain: '직육면체는 마주 보는 면끼리 모양과 크기가 같다. 전개도의 6개의 면도 모양과 크기가 같은 것끼리 3쌍이다.', facts: fixed(3) })
      : say(d, '직육면체의 전개도에 대한 설명으로 옳은 것은?',
        // 실선·점선은 적지 않는다(같은 묶음의 net-word 가 묻는다).
        ['접었을 때 맞닿는 모서리는 길이가 같다.', '접었을 때 겹치는 면이 없다.', '접었을 때 마주 보는 두 면은 모양과 크기가 같다.', '면은 모두 6개이다.'],
        [['면은 모두 4개이다.', '면은 6개이다.'], ['접었을 때 겹치는 면이 있다.', '접었을 때 겹치는 면이 없어야 한다.'], ['접었을 때 맞닿는 모서리는 길이가 다르다.', '맞닿는 모서리는 길이가 같아야 한다.'], ['한 가지 모양으로만 그릴 수 있다.', '어느 모서리를 자르는가에 따라 여러 가지 모양으로 그릴 수 있다.'], ['접었을 때 마주 보는 두 면은 크기가 다르다.', '마주 보는 두 면은 모양과 크기가 같다.']], true)), { count: 2 }),
    T('net-add-cube', '정사각형 하나를 더 붙일 자리', '②55 ③46 심37', (d) => {
      const made = d.until(() => {
        const cells = d.pick(CUBE_NETS).cells, key = (c) => c[0] + ',' + c[1], near = (c) => cells.filter((q) => Math.abs(q[0] - c[0]) + Math.abs(q[1] - c[1]) === 1).length;
        const leaf = d.pick(cells.filter((c) => near(c) === 1)), rest = cells.filter((c) => c !== leaf), has = new Set(rest.map(key)), spots = [];
        for (const [x, y] of rest) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const c = [x + dx, y + dy]; if (!has.has(key(c)) && !spots.some((s) => key(s) === key(c))) spots.push(c); }
        const fits = (c) => Boolean(fold(cellRects(rest.concat([c])))), good = spots.filter(fits), bad = spots.filter((c) => !fits(c));
        if (!good.length || bad.length < 3) return null;
        const picks = [d.pick(good)].concat(d.shuffle(bad).slice(0, 3)).sort((p, q) => p[1] - q[1] || p[0] - q[0]), box = boundsOf(cellRects(rest.concat(picks)));
        return box.w <= 6 && box.h <= 5 ? { rest, picks, flags: picks.map(fits) } : null;
      }, Boolean), at = made.flags.indexOf(true);
      return C('정사각형 5개를 이어 붙였다. 정사각형 1개를 더 붙여 정육면체의 전개도를 만들려고 한다. 붙일 수 있는 곳은?', MARKS.slice(0, 4), at, {
        figure: netArt(cellRects(made.rest), { unit: 28, ghosts: made.picks.map((c, i) => ({ rect: { x: c[0], y: c[1], w: 1, h: 1 }, text: MARKS[i] })), label: '정사각형 5개를 이어 붙인 그림. 둘레의 빈자리 네 곳에 ㉠, ㉡, ㉢, ㉣' }),
        explain: `${MARKS[at]}에 붙이면 접었을 때 여섯 면이 서로 겹치지 않는다. 나머지 자리에 붙이면 접었을 때 겹치는 면이 생긴다.`, facts: { kindPick: { kinds: made.flags.map((ok, i) => (ok ? 'ok' : 'no' + i)), target: 'ok' } }
      });
    }),
    T('net-add-box', '빠뜨린 면을 그려 넣을 자리', '①67 ②67 ③55 심72', (d) => {
      // 전개도 완성하기를 고르기로 바꾸었다. 후보 자리는 모두 빠뜨린 면과 크기가 같고, 길이가 맞는 변에 붙어 있다.
      const dims = d.shuffle(d.pick([[2, 3, 4], [2, 3, 5], [2, 4, 5]]));
      const made = d.until(() => {
        const rects = boxNet(d, dims, { cols: 14, rows: 10 }).rects, leaves = rects.filter((r) => rects.filter((s) => s !== r && K.touch(r, s)).length === 1), L = d.pick(leaves), rest = rects.filter((r) => r !== L), spots = [];
        for (const R of rest) for (const [w, h] of [[L.w, L.h], [L.h, L.w]]) {
          const cands = (h === R.h ? [{ x: R.x + R.w, y: R.y, w, h }, { x: R.x - w, y: R.y, w, h }] : []).concat(w === R.w ? [{ x: R.x, y: R.y + R.h, w, h }, { x: R.x, y: R.y - h, w, h }] : []);
          for (const s of cands) if (!rest.some((t) => K.overlap(s, t)) && !spots.some((t) => same(s, t))) spots.push(s);
        }
        const fits = (s) => Boolean(fold(rest.concat([s]))), good = spots.filter(fits);
        if (!good.length) return null;
        const picks = [d.pick(good)];
        for (const s of d.shuffle(spots.filter((x) => !fits(x)))) if (picks.length < 4 && !picks.some((t) => K.overlap(s, t))) picks.push(s);
        const box = boundsOf(rest.concat(picks));
        if (picks.length < 4 || box.w > 16 || box.h > 12) return null;
        const order = d.shuffle(picks);   // 읽는 차례로 기호를 붙이면 정답이 맨 위와 맨 아래 자리로 쏠린다.
        return { rest, picks: order, flags: order.map(fits) };
      }, Boolean), at = made.flags.indexOf(true), box = boundsOf(made.rest.concat(made.picks));
      return C('직육면체의 전개도를 그리다가 면 1개를 빠뜨렸다. 빠뜨린 면을 그려 넣을 수 있는 곳은?', MARKS.slice(0, 4), at, {
        figure: netArt(made.rest, { unit: Math.min(16, Math.floor(262 / box.w)), ghosts: made.picks.map((rect, i) => ({ rect, text: MARKS[i] })), label: '면 5개만 그린 직육면체의 전개도. 둘레의 빈자리 네 곳에 ㉠, ㉡, ㉢, ㉣' }),
        explain: `${MARKS[at]}에 그리면 접었을 때 겹치는 면 없이 직육면체가 된다. ` + made.picks.map((s, i) => (i === at ? '' : `${MARKS[i]}에 그리면 ${whyText(made.rest.concat([s]))}.`)).filter(Boolean).join(' '),
        facts: { kindPick: { kinds: made.flags.map((ok, i) => (ok ? 'ok' : 'no' + i)), target: 'ok' } }
      });
    }),
    T('net-of-sketch', '겨냥도에 맞는 전개도 고르기', '①67 ②68 ③54 심72', (d) => {
      // 겨냥도를 보고 전개도 그리기를 고르기로 바꾸었다: 크기가 맞는 전개도, 한 모서리의 길이가 다른 직육면체의 전개도, 접으면 겹치는 그림
      const dims = d.shuffle([2, 3, 4]), size = (v) => v.slice().sort((a, b) => a - b).join(), lim = LIM;
      const other = d.until(() => { const v = dims.slice(); v[d.int(0, 2)] += d.pick([-1, 1]); return v; }, (v) => new Set(v).size === 3);
      const items = d.shuffle(d.until(() => { const fake = fakeMove(d, boxNet(d, dims, lim).rects, lim); return fake ? [boxNet(d, dims, lim).rects, boxNet(d, other, lim).rects, fake] : null; }, Boolean));
      const kinds = items.map((r, i) => { const res = fold(r); return res && size(res.dims) === size(dims) ? 'ok' : 'no' + i; }), at = kinds.indexOf('ok');
      return C('모눈 한 칸의 길이는 1 cm이다. 겨냥도의 직육면체를 만들 수 있는 전개도는?', TAGS.slice(0, 3), at, {
        figure: sketch(dims, { lens: withLens(dims), label: `직육면체의 겨냥도. ${saidLens(dims)}` }) + gridNets(items),
        explain: `${TAGS[at]}는 가로와 세로가 ${dims[0]}칸과 ${dims[1]}칸, ${dims[0]}칸과 ${dims[2]}칸, ${dims[1]}칸과 ${dims[2]}칸인 면이 2개씩이고, 접으면 겹치는 면이 없다. ` + items.map((r, i) => (i === at ? '' : `${TAGS[i]}는 ${fold(r) ? '면의 크기가 겨냥도의 직육면체와 다르다' : whyText(r)}.`)).filter(Boolean).join(' '),
        facts: { kindPick: { kinds, target: 'ok' } }
      });
    }),
    T('net-to-dims', '전개도를 접은 직육면체의 세 모서리', '①68 심33', (d) => {
      const dims = d.shuffle(d.pick([[2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]])), net = boxNet(d, dims, { cols: 16, rows: 12 }), box = boundsOf(net.rects), said = (v) => v.slice().sort((a, b) => a - b).map(cm).join(', '), right = said(fold(net.rects).dims);
      const pool = [];
      for (let i = 0; i < 3; i += 1) for (const x of [box.w, box.h, dims[(i + 1) % 3] + dims[(i + 2) % 3], dims[i] + 1]) { const v = dims.slice(); v[i] = x; if (new Set(v).size === 3 && said(v) !== right && !pool.includes(said(v))) pool.push(said(v)); }
      const options = d.shuffle([right].concat(d.shuffle(pool).slice(0, 3)));
      return C('모눈 한 칸의 길이는 1 cm이다. 전개도를 접어서 만든 직육면체에서 길이가 서로 다른 세 모서리의 길이를 바르게 쓴 것은?', options, options.indexOf(right), {
        figure: netArt(net.rects, { unit: Math.min(16, Math.floor(262 / box.w)), grid: true, label: '모눈종이에 그린 직육면체의 전개도' }),
        explain: `전개도의 면은 가로와 세로가 ${dims[0]}칸과 ${dims[1]}칸, ${dims[0]}칸과 ${dims[2]}칸, ${dims[1]}칸과 ${dims[2]}칸인 직사각형이 2개씩이다. 접으면 세 모서리의 길이가 ${right}인 직육면체가 된다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    })
  ]);

  // ── 전개도를 접었을 때 ───────────────────────────────────────
  const PROPS = [[2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]];
  const lenOf = (cut) => Math.abs(cut.at[0][0] - cut.at[1][0]) + Math.abs(cut.at[0][1] - cut.at[1][1]);
  const partnerOf = (cuts, cut) => cuts.find((x) => x !== cut && x.edge === cut.edge);
  const netUnit = (rects, most) => Math.min(most, Math.floor(250 / boundsOf(rects).w));
  // 가~바를 적은 전개도 / 점 이름을 적은 전개도
  const lettered = (net, cube, o) => netArt(net.rects, Object.assign({ unit: cube ? 36 : netUnit(net.rects, 18), faceText: TAGS, label: `${cube ? '정육면체' : '직육면체'}의 전개도. 면에 가, 나, 다, 라, 마, 바를 적었다.` }, o || {}));
  const pointed = (net, cube, o) => netArt(net.rects, Object.assign({ unit: cube ? 36 : netUnit(net.rects, 18), names: POINTS, label: `${cube ? '정육면체' : '직육면체'}의 전개도. 테두리의 점에 ㄱ부터 ㅎ까지 이름을 붙였다.` }, o || {}));
  const randomBox = (d, want) => boxNet(d, d.shuffle(d.pick(PROPS)), want);
  const oppositeOf = (net, i) => net.face.indexOf(net.face[i] ^ 1);
  const Kname = (cube) => (cube ? '정육면체' : '직육면체');
  // 여섯 면을 둘씩 짝 짓는 모든 방법
  function matchings(list) { if (!list.length) return [[]]; const [first, ...rest] = list; return rest.reduce((all, other) => all.concat(matchings(rest.filter((x) => x !== other)).map((m) => [[first, other]].concat(m))), []); }
  B.addTypes('5-2-5', 'fold', [
    T('fold-parallel', '전개도에서 평행한 면', '①53 ②56 ③47 심25', (d, n) => {
      const net = randomBox(d, { strip: true }), i = d.int(0, 5), j = oppositeOf(net, i), rows = d.shuffle([j].concat(d.shuffle([0, 1, 2, 3, 4, 5].filter((x) => x !== i && x !== j)).slice(0, 3)));
      const name = (x) => (n === 0 ? TAGS[x] : rectName(net, x)), and = n === 0 ? '와' : '과', is = n === 0 ? '가' : '이';
      return C(`전개도를 접어서 직육면체를 만들었을 때 면 ${name(i)}${and} 평행한 면은?`, rows.map((x) => '면 ' + name(x)), rows.indexOf(j), {
        figure: n === 0 ? lettered(net) : pointed(net), explain: `전개도를 접으면 면 ${name(i)}${and} 면 ${name(j)}${is} 마주 보게 되어 서로 평행하다. 나머지 네 면은 면 ${name(i)}${and} 수직으로 만난다.`, facts: { truth: rows.map((x) => isPara(net.face[i], net.face[x])), want: true }
      });
    }, { count: 2 }),
    T('fold-number', '수를 적은 전개도에서 평행한 면', '②56 ③47', (d) => {
      const net = cubeNet(d, { row4: true }), nums = d.shuffle([1, 2, 3, 4, 5, 6]), i = d.int(0, 5), j = oppositeOf(net, i), a = net.rects[i], b = net.rects[j], inLine = a.x === b.x || a.y === b.y;
      return N(`정육면체의 전개도의 면에 1부터 6까지의 수를 하나씩 적었다. 전개도를 접었을 때 ${josa(nums[i], '이/가')} 적힌 면과 평행한 면에 적힌 수는?`, nums[j], {
        figure: netArt(net.rects, { unit: 36, faceText: nums.map(String), label: `정육면체의 전개도. 면에 적힌 수: ${nums.join(', ')}` }),
        explain: `전개도를 접으면 ${josa(nums[i], '이/가')} 적힌 면과 ${josa(nums[j], '이/가')} 적힌 면이 마주 보게 되어 서로 평행하다. ` + (inLine ? '한 줄로 나란히 이어진 면에서는 한 칸 건너 있는 면끼리 마주 본다.' : '한 줄로 이어진 네 면의 양쪽에 하나씩 붙은 두 면은 접으면 서로 마주 본다.'), facts: { calc: [[String(nums[j]), 0]] }
      });
    }),
    T('fold-pairs', '평행한 면끼리 짝 짓기', '①53 ②56 심32', (d) => {
      const net = cubeNet(d), key = (m) => m.map((p) => p.slice().sort().join('')).sort().join(' '), ok = (m) => m.every(([a, b]) => isPara(net.face[a], net.face[b]));
      const all = matchings([0, 1, 2, 3, 4, 5]), right = all.find(ok), rows = d.shuffle([right].concat(d.shuffle(all.filter((m) => key(m) !== key(right))).slice(0, 3))), said = (m) => m.map(([a, b]) => `${TAGS[a]}와 ${TAGS[b]}`).join(', ');
      return C('정육면체의 전개도를 접었을 때 서로 평행한 면끼리 바르게 짝 지은 것은?', rows.map(said), rows.findIndex(ok), {
        figure: lettered(net, true), explain: `전개도를 접으면 ${right.map(([a, b]) => `면 ${TAGS[a]}와 면 ${TAGS[b]}`).join(', ')}가 각각 마주 보게 되어 서로 평행하다.`, facts: { truth: rows.map(ok), want: true }
      });
    }),
    T('fold-perp', '전개도에서 수직인 면', '①54 ②58 ③48 심26', (d) => {
      const cube = d.bool(), net = cube ? cubeNet(d) : randomBox(d), i = d.pick([0, 1, 2, 3, 4, 5].filter((x) => net.rects.filter((r) => r !== net.rects[x] && K.touch(r, net.rects[x])).length >= 2));
      const others = [0, 1, 2, 3, 4, 5].filter((x) => x !== i), labels = others.map((x) => TAGS[x]), flags = others.map((x) => isPerp(net.face[i], net.face[x])), made = setOptions(d, labels, flags), j = oppositeOf(net, i);
      return C(`전개도를 접었을 때 면 ${TAGS[i]}와 수직인 면을 모두 고른 것은?`, made.options, made.answer, {
        figure: lettered(net, cube), explain: `전개도를 접으면 면 ${TAGS[i]}와 마주 보는 면은 면 ${TAGS[j]}이다. 마주 보는 면 ${TAGS[j]}만 평행하고 나머지 네 면은 모두 면 ${TAGS[i]}와 수직으로 만난다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('fold-odd', '전개도에서 두 면 사이의 관계가 다른 것', '②35 ③49', (d) => {
      const cube = d.bool(), net = cube ? cubeNet(d) : randomBox(d), pairs = [];
      for (let a = 0; a < 6; a += 1) for (let b = a + 1; b < 6; b += 1) pairs.push([a, b]);
      const para = pairs.filter(([a, b]) => isPara(net.face[a], net.face[b])), perp = pairs.filter(([a, b]) => isPerp(net.face[a], net.face[b])), lone = d.pick(['para', 'perp']);
      const rows = d.shuffle(lone === 'para' ? [d.pick(para)].concat(d.shuffle(perp).slice(0, 3)) : para.concat([d.pick(perp)])), kinds = rows.map(([a, b]) => (isPara(net.face[a], net.face[b]) ? 'para' : 'perp')), at = kinds.indexOf(lone);
      return C('전개도를 접었을 때 두 면 사이의 관계가 나머지와 다른 것은?', MARKS.slice(0, 4), at, {
        figure: lettered(net, cube) + tagged(rows.map(([a, b]) => `면 ${TAGS[a]}와 면 ${TAGS[b]}`), MARKS),
        explain: lone === 'para' ? `${MARKS[at]}의 두 면은 접었을 때 마주 보게 되어 서로 평행하다. 나머지는 모두 접었을 때 이웃하게 되어 서로 수직이다.` : `${MARKS[at]}의 두 면은 접었을 때 이웃하게 되어 서로 수직이다. 나머지는 모두 접었을 때 마주 보게 되어 서로 평행하다.`, facts: { kindPick: { kinds, target: lone } }
      });
    }),
    T('fold-point', '전개도를 접었을 때 만나는 점', '①51 ②60 ③50 심28', (d, n) => {
      // 만나는 점이 하나뿐인 점을 묻는다(둘인 점은 실력에 있다).
      const cube = n === 0, made = d.until(() => {
        const net = cube ? cubeNet(d) : randomBox(d, { strip: true }), groups = {};
        net.ring.forEach((key, i) => { const v = net.map.get(key); (groups[v] = groups[v] || []).push(i); });
        const pairs = Object.keys(groups).map((v) => groups[v]).filter((g) => g.length === 2);
        return pairs.length ? { net, pair: d.shuffle(d.pick(pairs)) } : null;
      }, Boolean), net = made.net, [p, q] = made.pair, vOf = (i) => net.map.get(net.ring[i]), all = net.ring.map((_, i) => i);
      const near = [p - 1, p + 1, q - 1, q + 1].map((i) => (i + 14) % 14).filter((i) => vOf(i) !== vOf(p)), others = [...new Set(d.shuffle(near).concat(d.shuffle(all.filter((i) => vOf(i) !== vOf(p)))))].slice(0, 3);
      const rows = d.shuffle([q].concat(others)), cuts = cutsOf(net), mine = cuts.filter((c) => c.a === p || c.b === p).map((c) => [c, partnerOf(cuts, c)]).find(([, t]) => t.a === q || t.b === q);
      return C(`${Kname(cube)}의 전개도를 접었을 때 점 ${POINTS[p]}과 만나는 점은?`, rows.map((i) => '점 ' + POINTS[i]), rows.indexOf(q), {
        figure: pointed(net, cube), explain: (mine ? `전개도를 접으면 선분 ${mine[0].name}과 선분 ${mine[1].name}이 맞닿는다. ` : '') + `그래서 점 ${POINTS[p]}과 점 ${POINTS[q]}이 한 꼭짓점에서 만난다.`, facts: { truth: rows.map((i) => vOf(i) === vOf(p)), want: true }
      });
    }, { count: 2 }),
    T('fold-seg', '전개도를 접었을 때 겹치는 선분', '①52 ②61 ③51 심30', (d, n) => {
      // 한 점에서 이어진 두 선분이 겹치는 경우를 묻는다(떨어져 있는 두 선분은 실력에 있다).
      const cube = n === 0, net = cube ? cubeNet(d) : randomBox(d, { strip: true }), cuts = cutsOf(net), joinedAt = (c) => { const t = partnerOf(cuts, c); return t.a === c.b || t.b === c.a; };
      const s = d.pick(cuts.filter(joinedAt)), t = partnerOf(cuts, s), rows = d.shuffle([t].concat(d.shuffle(cuts.filter((c) => c !== s && c !== t)).slice(0, 3)));
      return C(`${Kname(cube)}의 전개도를 접었을 때 선분 ${s.name}과 겹치는 선분은?`, rows.map((c) => '선분 ' + c.name), rows.indexOf(t), {
        figure: pointed(net, cube), explain: `선분 ${s.name}과 선분 ${t.name}은 한 점에서 만나 벌어져 있다. 전개도를 접으면 벌어진 틈이 닫히면서 두 선분이 맞닿아 한 모서리가 된다.`, facts: { truth: rows.map((c) => c.edge === s.edge), want: true }
      });
    }, { count: 2 }),
    T('fold-vertex-name', '겨냥도와 전개도의 꼭짓점 맞추기', '①55 ②62 심28', (d) => {
      const dims = d.shuffle(d.pick(PROPS)), made = d.until(() => {
        const net = boxNet(d, dims, { strip: true }), names = net.ring.map((key) => VNAME[net.map.get(key)]), [i, j] = d.shuffle(net.ring.map((_, k) => k)).slice(0, 2).sort((a, b) => a - b), at = (k) => net.ring[k].split(',').map(Number);
        const onRect = (r, p) => (p[0] === r.x || p[0] === r.x + r.w) && (p[1] === r.y || p[1] === r.y + r.h);
        return names[i] !== names[j] && !net.rects.some((r) => onRect(r, at(i)) && onRect(r, at(j))) ? { net, names, i, j } : null;
      }, Boolean), { net, names, i, j } = made, right = `${names[i]}, ${names[j]}`, pool = [];
      for (const x of VNAME) for (const y of VNAME) if (x !== y && `${x}, ${y}` !== right && (x === names[i] || y === names[j] || (x === names[j] && y === names[i]))) pool.push(`${x}, ${y}`);
      const options = d.shuffle([right].concat(d.shuffle(pool).slice(0, 3))), text = {};
      net.ring.forEach((key, k) => { text[key] = k === i ? '㉠' : k === j ? '㉡' : names[k]; });
      return C('직육면체의 겨냥도와 전개도이다. 전개도의 점마다 접었을 때의 꼭짓점을 적었다. ㉠, ㉡에 알맞은 꼭짓점을 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: sketch(dims, { names: true, size: [124, 92], label: NAMED }) + netArt(net.rects, { unit: netUnit(net.rects, 18), pointText: text, label: '직육면체의 전개도. 점마다 접었을 때의 꼭짓점 이름을 적고, 두 점은 ㉠, ㉡으로 적었다.' }),
        explain: `이름이 적힌 세 꼭짓점으로 면을 찾으면 그 면의 나머지 한 꼭짓점을 알 수 있다. ㉠은 꼭짓점 ${names[i]}, ㉡은 꼭짓점 ${names[j]}이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('fold-len-fill', '전개도의 변의 길이', '①59 ②65 ③52 심49', (d) => {
      const dims = d.until(() => dims3(d, 3, 8), (v) => v[0] >= v[1]), net = boxNet(d, dims, { strip: true, cols: 40, rows: 30 }), cuts = cutsOf(net), box = boundsOf(net.rects);
      const picks = dims.map((L) => d.pick(cuts.filter((c) => lenOf(c) === L))).sort((p, q) => p.a - q.a);
      return M('직육면체의 겨냥도와 전개도이다. 전개도에서 ㉠, ㉡, ㉢의 길이는 각각 몇 cm인가?', picks.map((c, i) => ({ label: MARKS[i], answer: lenOf(c), unit: 'cm' })), {
        figure: sketch(dims, { lens: withLens(dims), size: [124, 92], label: `직육면체의 겨냥도. ${saidLens(dims)}` }) + netArt(net.rects, { unit: Math.min(236 / box.w, 190 / box.h), lens: picks.map((c, i) => ({ a: c.at[0], b: c.at[1], text: MARKS[i] })), label: '직육면체의 전개도. 테두리의 세 선분에 ㉠, ㉡, ㉢' }),
        explain: `전개도의 면은 직육면체의 면과 모양과 크기가 같고, 접었을 때 맞닿는 선분은 길이가 같다. ${picks.map((c, i) => `${MARKS[i]}은 ${lenOf(c)} cm`).join(', ')}이다.`, facts: { calc: picks.map((c, i) => [String(lenOf(c)), i]) }
      });
    }),
    T('fold-len-read', '전개도에서 맞닿는 선분의 길이', '①61 ②66 ③53', (d) => {
      // 묻는 선분은 길이가 적힌 선분과 떨어져 있는 것으로 고른다(한 점에서 이어진 두 선분 사이에 길이를 적으면 어느 선분의 길이인지 헷갈린다).
      // 길이 글이 제 선분에서 멀리 밀려난 그림은 다시 뽑는다.
      const dims = d.shuffle(d.pick(PROPS)), made = d.until(() => {
        const net = boxNet(d, dims), cuts = cutsOf(net), far = cuts.filter((c) => { const t = partnerOf(cuts, c); return t.a !== c.b && t.b !== c.a; });
        if (!far.length) return null;
        const g = d.pick(far), given = [g].concat(dims.filter((L) => L !== lenOf(g)).map((L) => d.pick(cuts.filter((c) => lenOf(c) === L))));
        const figure = pointed(net, false, { lens: given.map((c) => ({ a: c.at[0], b: c.at[1], text: cm(lenOf(c)) })), label: `직육면체의 전개도. 테두리의 점에 ㄱ부터 ㅎ까지 이름을 붙였다. ${given.map((c) => `선분 ${c.name} ${lenOf(c)} cm`).join(', ')}` });
        return K.netTidy() ? { cuts, g, figure } : null;
      }, Boolean), { cuts, g, figure } = made, s = partnerOf(cuts, g);
      return N(`직육면체의 전개도에서 선분 ${s.name}의 길이는 몇 cm인가?`, lenOf(s), {
        unit: 'cm', figure,
        explain: `전개도를 접으면 선분 ${s.name}은 선분 ${g.name}과 맞닿는다. 맞닿는 선분은 길이가 같으므로 선분 ${s.name}의 길이는 ${lenOf(g)} cm이다.`, facts: { calc: [[String(lenOf(s)), 0]] }
      });
    }),
    T('fold-len-strip', '옆면이 이어진 선분의 길이', '①61 심50', (d) => {
      const dims = d.until(() => dims3(d, 3, 7), (v) => v[0] >= v[1]), net = boxNet(d, dims, { strip: true, cols: 40, rows: 30 }), box = boundsOf(net.rects);
      // 한 줄로 이어진 네 면과 그 줄의 한쪽 변 위의 점들
      const line = (() => {
        for (const r of net.rects) for (const along of [0, 1]) {
          const run = [r]; let cur = r;
          for (;;) { const nxt = net.rects.find((s) => (along === 0 ? s.x === cur.x + cur.w && s.y === cur.y && s.h === cur.h : s.y === cur.y + cur.h && s.x === cur.x && s.w === cur.w)); if (!nxt) break; run.push(nxt); cur = nxt; }
          if (run.length === 4) return { run, along };
        }
        return null;
      })();
      const { run, along } = line, side = d.bool(), marks = run.map((r) => (along === 0 ? r.x : r.y)).concat([along === 0 ? run[3].x + run[3].w : run[3].y + run[3].h]), fixedAt = along === 0 ? run[0].y + (side ? run[0].h : 0) : run[0].x + (side ? run[0].w : 0);
      const [i, j] = d.pick([[0, 2], [1, 3], [2, 4], [0, 3], [1, 4], [0, 4]]), keyOf = (k) => (along === 0 ? marks[k] + ',' + fixedAt : fixedAt + ',' + marks[k]), parts = run.slice(i, j).map((r) => (along === 0 ? r.w : r.h)), total = parts.reduce((s, v) => s + v, 0);
      const P = POINTS[net.ring.indexOf(keyOf(i))], Q = POINTS[net.ring.indexOf(keyOf(j))], name = [P, Q].sort().join('');
      return N(`직육면체의 겨냥도와 전개도이다. 전개도에서 선분 ${name}의 길이는 몇 cm인가?`, total, {
        unit: 'cm', figure: sketch(dims, { lens: withLens(dims), size: [124, 92], label: `직육면체의 겨냥도. ${saidLens(dims)}` }) + netArt(net.rects, { unit: Math.min(236 / box.w, 190 / box.h), names: POINTS, label: '직육면체의 전개도. 테두리의 점에 ㄱ부터 ㅎ까지 이름을 붙였다.' }),
        explain: `선분 ${name}은 한 줄로 이어진 면 ${parts.length}개의 변을 이은 선분이다. 면마다 그 변의 길이는 접었을 때 맞닿는 모서리의 길이와 같으므로 ${parts.join(' + ')} = ${total}(cm)`, facts: { calc: [[parts.join('+'), 0]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
