// 6학년 2학기 6단원 원기둥, 원뿔, 구 — 원뿔, 구, 돌려서 만든 입체도형의 기본 문항.
// 단원 틀과 그림 도구(B.kit.round626)는 6-2-6a.js 에 있다. 본 모양·비교하기와 실력 문항은 6-2-6c.js, 대조표는 수집본의 _분석/6-2-6/싣기_대조표.md.
//
// 싣는 기준(6-2-6a.js 에 적은 것 말고)
//  - 원뿔은 높이와 모선을 가리는 일이 고비다. 그림에서 이름 찾기, 선분 고르기, 길이 읽기, 재는 그림을 따로 싣는다.
//    길이를 적은 원뿔은 직각삼각형이 되는 세 수(3·4·5, 5·12·13, 8·15·17 …)로 반지름·높이·모선을 정하고 그 비율대로 그린다.
//  - 구의 구성 요소는 구의 중심과 구의 반지름이다. 구의 중심을 지나는 선분의 길이에서 반지름을 구하는 것(÷ 2)까지 싣는다.
//  - 돌리는 그림은 중심이 되는 변을 굵은 선으로 긋고 도는 방향을 화살표로 그린다. 기본에서는 세로로 선 변을 중심으로 돌린다
//    (가로로 놓인 변을 중심으로 돌리는 그림, 같은 도형을 두 변으로 돌리는 그림은 실력에 있다).
//    직사각형은 중심이 되는 변이 높이, 이웃한 변이 밑면의 반지름이 되고, 직각삼각형은 중심이 되는 변이 높이, 다른 한 변이 밑면의 반지름, 빗변이 모선이 된다.
//
// 뺀 것과 까닭(이 파일의 세 묶음)
//  - 모선의 길이와 높이의 합·차(②33), 원기둥과 원뿔의 높이의 차(①12 ②11 ③60 심11), 두 원뿔의 높이의 합(③49): 읽은 길이에 덧셈·뺄셈을 얹은 덤 셈. 읽기는 「높이, 모선의 길이, 밑면의 지름 읽기」가 묻는다.
//  - 이름이 잘못 붙은 곳 고르기(③31): 「그림에서 원뿔의 부분 찾기」와 같은 판단이다. 자 눈금 읽기(③35): 재는 그림에 잰 길이를 적어 실력(높이와 모선의 길이 가려 읽기)에 실었다.
//  - 원뿔의 길이 사이의 크기 관계(심14): 「높이는 모선의 길이보다 짧다」만 설명 문항에 넣었다(반지름과 모선의 비교는 초등에서 댈 근거가 없다).
//  - 돌려 만든 입체도형의 밑면의 둘레(②46 ③50 심51)·밑면의 넓이(①60 심52), 돌리기 전 평면도형의 넓이·둘레(①65 ②47 ③67 심53·54): 원주·넓이 셈(측정). 밑면의 반지름·지름을 읽는 데까지 싣는다.
//  - 돌려 만든 입체도형 그리기·돌리기 전 도형 그리기(②48 ③51): 만들어지는 입체도형 고르기·돌리기 전 종이의 변의 길이로 바꾸어 실었다.
//  - 상자에 꼭 맞는 구·정육면체에 꼭 맞는 원기둥(②41 ①57의 변형 심57의 변형): 「통에 꼭 맞게 든 공」과 같은 판단이다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, lines, N, M, C } = B.kit;
  const K = B.kit.round626;
  const { T, TAGS, MARKS, cm, setOptions, say, pickWord, pickOrder, perms3, TILT, YELLOW, BLUE, RED, BOLD, ptsOf, stroke, curve, dot, onEll, arcD, canvas, one, tiles, leader, beside, corner, addCyl, addCone, addSphere, ART, pickArt, cylFig, coneFig, spin, measure } = K;

  // 직각삼각형이 되는 세 수 [밑면의 반지름, 높이, 모선의 길이]와 그림의 반지름(px). 높이 글이 원뿔 안에 들어가게 넉넉히 그린다.
  const CONES = [[3, 4, 5, 62], [6, 8, 10, 62], [9, 12, 15, 62], [5, 12, 13, 54], [8, 15, 17, 58]];
  const coneOf = (d) => { const [r, h, l, rx] = d.pick(CONES); return { r, h, l, rx, hpx: rx * h / r }; };
  const NOT_CONE = { cyl: '밑면이 2개이고 뾰족한 부분이 없다', ball: '밑면이 없다', frustum: '뾰족한 부분이 없다', pyramid: '밑면이 원이 아니다', prism: '밑면이 원이 아니다' };
  const CONE_LEAD = '원뿔은 밑면이 원이고 옆면이 굽은 면인 뿔 모양의 입체도형이다. ';
  Object.assign(K, { CONES, coneOf, NOT_CONE, CONE_LEAD });

  // ── 원뿔 ─────────────────────────────────────────────────────
  B.addTypes('6-2-6', 'cone', [
    T('cone-name', '원뿔의 뜻', '①4 ②3 ③6', (d) => pickWord(d, '밑면이 원이고 옆면이 굽은 면인 뿔 모양의 입체도형을 무엇이라고 하는가?', '원뿔', ['원기둥', '구', '각뿔'], '밑면이 원이고 옆면이 굽은 면인 뿔 모양의 입체도형을 원뿔이라고 한다.')),
    T('cone-find', '여러 입체도형 가운데 원뿔 고르기', '①2 ②1 ③2 심1', (d) => {
      // 밑면이 다각형인 뿔 모양을 꼭 하나 넣는다.
      const k = d.pick([1, 2]), rest = [d.pick(['pyr3', 'pyr4', 'pyr5'])].concat(d.shuffle(['frustum', d.pick(['cylTall', 'cylMid']), 'ball']).slice(0, 4 - k));
      const items = d.shuffle(pickArt(d, ['coneTall', 'coneWide'], k).concat(pickArt(d, rest, rest.length))), labels = TAGS.slice(0, 5), flags = items.map((it) => it.kind === 'cone'), made = setOptions(d, labels, flags);
      return C('입체도형 가운데 원뿔을 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())),
        explain: CONE_LEAD + items.map((it, i) => (flags[i] ? '' : `${labels[i]}는 ${NOT_CONE[it.kind]}. `)).join('') + `원뿔은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('cone-why-not', '원뿔이 아닌 까닭', '①5 ②5 ③8 심3', (d) => {
      // 까닭 쓰기를 까닭 고르기로 바꾸었다. 옆면이 굽은 면이 아닌 것도 까닭이 되므로 보기에는 넣지 않는다.
      const rows = d.shuffle([['밑면이 원이 아니다.', true], ['밑면이 1개가 아니다.', false], ['뾰족한 부분이 없다.', false], ['평평한 면이 없다.', false]]);
      return C('다음 입체도형이 원뿔이 아닌 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: ART['pyr' + d.pick([4, 5])].art(1.7), explain: '이 도형은 밑면이 1개이고 뾰족한 부분이 있는 뿔 모양이지만 밑면이 다각형이다. 원뿔은 밑면이 원이어야 한다.', facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('cone-word', '모선과 높이의 뜻', '①24 ③29', (d, n) => (n === 0
      ? pickWord(d, '원뿔에서 원뿔의 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분을 무엇이라고 하는가?', '모선', ['높이', '옆면', '밑면의 반지름'], '원뿔의 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분을 모선이라고 한다. 높이는 원뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이이다.')
      : pickWord(d, '원뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이를 무엇이라고 하는가?', '원뿔의 높이', ['모선의 길이', '밑면의 반지름', '밑면의 지름'], '원뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이를 원뿔의 높이라고 한다. 모선은 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분이다.')), { count: 2 }),
    T('cone-parts-point', '그림에서 원뿔의 부분 찾기', '①25 ②29 ③30·31 심6', (d) => {
      const first = d.pick(['원뿔의 꼭짓점', '옆면', '밑면']), WORDS = [first, '모선', '높이'], order = d.shuffle(WORDS), mark = (w) => MARKS[order.indexOf(w)], rx = 62, h = 96, ry = rx * TILT, made = pickOrder(d, order, perms3(WORDS));
      const told = { '원뿔의 꼭짓점': ['뾰족한 부분의 점', '뾰족한 부분의 점이므로 원뿔의 꼭짓점'], 옆면: ['옆을 둘러싼 굽은 면', '옆을 둘러싼 굽은 면이므로 옆면'], 밑면: ['색칠한 아래의 면', '평평한 면이므로 밑면'] }[first];
      return C('원뿔에서 ㉠, ㉡, ㉢이 가리키는 부분의 이름을 차례로 쓴 것은?', made.options, made.answer, {
        figure: one((cv) => {
          const s = addCone(cv, [0, 0], rx, h, first === '밑면' ? { bottom: YELLOW } : {});
          cv.add(stroke([0, 0], [0, h], 'dash') + stroke([0, h], [rx, h], 'dash') + corner([0, h], [0, 0], [rx, h]) + dot([0, h], 2) + stroke([0, 0], s.tR, '', BOLD));
          leader(cv, [-19, h * 0.5], [0, h * 0.5], mark('높이')); beside(cv, [0, 0], s.tR, -1, mark('모선'));
          if (first === '원뿔의 꼭짓점') { cv.add(dot([0, 0], 3.6, RED)); cv.write([-14, -5], mark(first)); }
          if (first === '옆면') leader(cv, [-rx - 4, h * 0.42], [-rx * 0.42, h * 0.8], mark(first));
          if (first === '밑면') leader(cv, [-rx * 0.9, h + ry + 15], [-rx * 0.4, h + ry * 0.5], mark(first));
        }, `원뿔. ${mark(first)}은 ${told[0]}, ${mark('모선')}은 꼭짓점과 밑면의 둘레의 한 점을 이은 굵은 선분, ${mark('높이')}은 꼭짓점에서 밑면의 가운데에 수직으로 내린 점선을 가리킨다.`),
        explain: `${mark(first)}은 ${told[1]}, ${mark('모선')}은 원뿔의 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분이므로 모선, ${mark('높이')}은 원뿔의 꼭짓점에서 밑면에 수직으로 내린 선분이므로 높이이다.`, facts: { truth: made.truth, want: true }
      });
    }),
    T('cone-seg', '높이인 선분과 모선인 선분', '①26 ②32 ③37 심8', (d, n) => {
      // 꼭짓점 ㄱ에서 밑면의 둘레 위의 세 점과 밑면의 가운데 점에 선분을 그었다. 점의 이름은 섞어서 붙인다.
      const rx = 62, h = 100, ry = rx * TILT, [nl, nf, nr, nc] = d.shuffle(['ㄴ', 'ㄷ', 'ㄹ', 'ㅁ']), center = [0, h], front = onEll(center, rx, ry, 58);
      const figure = one((cv) => {
        const s = addCone(cv, [0, 0], rx, h);
        cv.add(stroke([0, 0], center, 'dash') + stroke(center, s.tR, 'dash') + corner(center, [0, 0], s.tR) + stroke([0, 0], front) + [[0, 0], s.tL, s.tR, front, center].map((p) => dot(p)).join(''));
        cv.write([0, -11], 'ㄱ'); cv.write([s.tL[0] - 10, s.tL[1] + 5], nl); cv.write([s.tR[0] + 10, s.tR[1] + 5], nr); cv.write([front[0] + 4, front[1] + 12], nf); cv.write([-10, h + 9], nc);
      }, `원뿔. 뾰족한 부분의 점은 ㄱ, 밑면의 둘레 위의 점은 ${nl}, ${nf}, ${nr}, 밑면의 가운데 점은 ${nc}이다. 점 ㄱ과 네 점을 각각 선분으로 이었다.`);
      const rows = [[nl, true], [nf, true], [nr, true], [nc, false]].sort((x, y) => (x[0] < y[0] ? -1 : 1));
      if (n === 0) return C('원뿔에서 높이를 나타내는 선분은?', rows.map((r) => '선분 ㄱ' + r[0]), rows.findIndex((r) => !r[1]), {
        figure, explain: `원뿔의 꼭짓점 ㄱ에서 밑면에 수직으로 내린 선분 ㄱ${nc}의 길이가 높이이다. 선분 ㄱ${nl}, 선분 ㄱ${nf}, 선분 ㄱ${nr}은 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 모선이다.`, facts: { truth: rows.map((r) => !r[1]), want: true }
      });
      const labels = rows.map((r) => '선분 ㄱ' + r[0]).concat(['선분 ' + [nc, nr].sort().join('')]), flags = rows.map((r) => r[1]).concat([false]), made = setOptions(d, labels, flags);
      return C('원뿔에서 모선을 모두 고른 것은?', made.options, made.answer, {
        figure, explain: `원뿔의 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분이 모선이다. 선분 ㄱ${nl}, 선분 ㄱ${nf}, 선분 ㄱ${nr}이 모선이다. 선분 ㄱ${nc}은 높이를 나타내고, 선분 ${[nc, nr].sort().join('')}은 밑면의 반지름이다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('cone-gen-len', '한 원뿔에서 모선의 길이', '①30 ②32 ③38', (d) => {
      const c = coneOf(d);
      return N('원뿔에서 선분 ㄱㄷ의 길이는 몇 cm인가?', c.l, {
        unit: 'cm', figure: coneFig(c.rx, c.hpx, { h: cm(c.h), l: cm(c.l), lSide: -1, r: cm(c.r), names: ['ㄱ', 'ㄴ', 'ㄷ'], label: `원뿔. 뾰족한 부분의 점은 ㄱ, 밑면의 둘레 위의 두 점은 ㄴ, ㄷ이다. 선분 ㄱㄴ의 길이 ${c.l} cm, 높이 ${c.h} cm, 밑면의 반지름 ${c.r} cm` }),
        explain: `선분 ㄱㄴ과 선분 ㄱㄷ은 모두 원뿔의 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 모선이다. 한 원뿔에서 모선의 길이는 모두 같으므로 선분 ㄱㄷ의 길이는 ${c.l} cm이다.`, facts: { calc: [[String(c.l), 0]] }
      });
    }),
    T('cone-gen-count', '모선의 수', '①29 ②32', (d) => {
      const right = '셀 수 없이 많다.', options = d.shuffle([right, '1개', '2개', '4개']);
      return C('한 원뿔에서 모선은 몇 개인가?', options, options.indexOf(right), { explain: '원뿔의 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분이 모선이다. 원의 둘레 위에는 점이 셀 수 없이 많으므로 모선도 셀 수 없이 많다.', facts: { truth: options.map((o) => o === right), want: true } });
    }),
    T('cone-measure', '원뿔을 재는 그림', '①27 ②30 ③33·34 심9', (d, n) => {
      const WANT = { 'cone-h': '높이', 'cone-l': '모선의 길이', 'cone-d': '밑면의 지름' };
      if (n === 0) {
        const what = d.pick(['cone-h', 'cone-l', 'cone-d']), want = WANT[what];
        const why = { 'cone-h': '자를 원뿔 옆에 곧게 세우고 꼭짓점 높이에 삼각자를 대어, 꼭짓점에서 밑면에 수직으로 내린 길이를 재고 있다. 높이를 재는 그림이다.', 'cone-l': '자를 옆면에 대어 꼭짓점에서 밑면인 원의 둘레의 한 점까지를 재고 있다. 모선의 길이를 재는 그림이다.', 'cone-d': '밑면의 양쪽 끝에 삼각자를 대고 그 사이를 재고 있다. 밑면의 지름을 재는 그림이다.' }[what];
        return pickWord(d, '원뿔에 자를 대어 길이를 재고 있다. 원뿔의 무엇을 재는 그림인가?', want, ['높이', '모선의 길이', '밑면의 지름', '밑면의 둘레'].filter((w) => w !== want), why, measure(what, 46, 66));
      }
      // 재는 방법 고르기: 높이는 자를 곧게 세워서, 모선의 길이는 옆면에 자를 대어서 잰다.
      const kinds = d.shuffle(['cone-h', 'cone-l', 'cone-d']), what = d.pick(['cone-h', 'cone-l']), labels = TAGS.slice(0, 3), tag = (k) => labels[kinds.indexOf(k)];
      return C(`원뿔의 ${josa(WANT[what], '을/를')} 재는 그림은?`, labels, kinds.indexOf(what), {
        figure: tiles(kinds.map((k) => measure(k, 34, 50))),
        explain: `높이는 꼭짓점에서 밑면에 수직으로 내린 선분의 길이이므로 자를 곧게 세우고 꼭짓점 높이에 삼각자를 댄 ${tag('cone-h')}와 같이 잰다. 모선의 길이는 옆면에 자를 대어 꼭짓점에서 밑면의 둘레까지 재는 ${tag('cone-l')}와 같이 잰다. ${tag('cone-d')}는 밑면의 지름을 재는 그림이다.`,
        facts: { kindPick: { kinds, target: what } }
      });
    }, { count: 2 }),
    T('cone-read', '높이, 모선의 길이, 밑면의 지름 읽기', '①28 ②31 ③36 심8', (d) => {
      const c = coneOf(d);
      return M('원뿔의 높이, 모선의 길이, 밑면의 지름은 각각 몇 cm인가?', [{ label: '높이', answer: c.h, unit: 'cm' }, { label: '모선의 길이', answer: c.l, unit: 'cm' }, { label: '밑면의 지름', answer: c.r * 2, unit: 'cm' }], {
        figure: coneFig(c.rx, c.hpx, { h: cm(c.h), l: cm(c.l), r: cm(c.r), label: `원뿔. 꼭짓점에서 밑면의 가운데에 수직으로 내린 점선의 길이 ${c.h} cm, 꼭짓점과 밑면의 둘레의 한 점을 이은 선분의 길이 ${c.l} cm, 밑면의 반지름 ${c.r} cm` }),
        explain: `꼭짓점에서 밑면에 수직으로 내린 선분의 길이 ${c.h} cm가 높이이고, 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분의 길이 ${c.l} cm가 모선의 길이이다. 밑면의 반지름이 ${c.r} cm이므로 밑면의 지름은 ${c.r} × 2 = ${c.r * 2}(cm)이다.`,
        facts: { calc: [[String(c.h), 0], [String(c.l), 1], [`${c.r}*2`, 2]], unseen: [2] }
      });
    }),
    T('cone-say', '원뿔에 대한 설명', '①31 ②34 ③39 심14·16', (d, n) => say(d, n === 0 ? '원뿔에 대한 설명으로 옳지 않은 것은?' : '원뿔에 대한 설명으로 옳은 것은?',
      ['밑면은 원이다.', '밑면은 1개이다.', '옆면은 굽은 면이다.', '원뿔의 꼭짓점은 1개이다.', '모선은 셀 수 없이 많다.', '한 원뿔에서 모선의 길이는 모두 같다.', '높이는 모선의 길이보다 짧다.'],
      [['밑면은 2개이다.', '밑면은 1개이다.'], ['모선은 1개뿐이다.', '모선은 셀 수 없이 많다.'], ['높이는 모선의 길이와 같다.', '높이는 모선의 길이보다 짧다.'], ['높이는 모선의 길이보다 길다.', '높이는 모선의 길이보다 짧다.'], ['뾰족한 부분의 점을 모서리라고 한다.', '뾰족한 부분의 점은 원뿔의 꼭짓점이다.'],
        ['원뿔의 꼭짓점은 2개이다.', '원뿔의 꼭짓점은 1개이다.'], ['옆면은 평평한 면이다.', '옆면은 굽은 면이다.'], ['원뿔의 꼭짓점에서 밑면에 수직으로 내린 선분을 모선이라고 한다.', '모선은 원뿔의 꼭짓점과 밑면인 원의 둘레의 한 점을 이은 선분이다.']],
      n === 1, n === 1 ? '원뿔은 밑면이 원 1개이고 옆면이 굽은 면인 뿔 모양의 입체도형이다.' : ''), { count: 2 })
  ]);

  // ── 구 ───────────────────────────────────────────────────────
  const NOT_BALL = { bowl: '평평한 면이 있다', egg: '보는 방향에 따라 모양이 다르다', cyl: '평평한 면이 있다', cone: '평평한 면이 있다' };
  const BALL_LEAD = '구는 굽은 면으로만 둘러싸여 있고, 어느 방향에서 보아도 원 모양이다. ';
  Object.assign(K, { NOT_BALL, BALL_LEAD });
  const out = (p, far) => { const L = Math.hypot(p[0], p[1]) || 1; return [p[0] + p[0] / L * far, p[1] + p[1] / L * far]; };   // 중심(0, 0)에서 멀어지는 쪽으로 밀어낸 자리
  B.addTypes('6-2-6', 'sphere', [
    T('sphere-name', '구의 뜻', '①4 ②3 ③6', (d) => pickWord(d, '공처럼 굽은 면으로만 둘러싸여 있고 어느 방향에서 보아도 원 모양인 입체도형을 무엇이라고 하는가?', '구', ['원', '원기둥', '원뿔'], '공 모양의 입체도형을 구라고 한다. 구는 굽은 면으로만 둘러싸여 있고 어느 방향에서 보아도 원 모양이다.')),
    T('sphere-find', '여러 입체도형 가운데 구 고르기', '①3 ②1 ③3 심1', (d) => {
      // 공을 반으로 자른 모양과 길쭉한 둥근 도형을 넣는다.
      const k = d.pick([1, 2]), rest = ['bowl', 'egg'].concat(d.shuffle(['cylWide', 'coneWide', 'cylMid']).slice(0, 3 - k));
      const items = d.shuffle(pickArt(d, ['ball', 'ballSmall'], k).concat(pickArt(d, rest, rest.length))), labels = TAGS.slice(0, 5), flags = items.map((it) => it.kind === 'ball'), made = setOptions(d, labels, flags);
      return C('입체도형 가운데 구를 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())),
        explain: BALL_LEAD + items.map((it, i) => (flags[i] ? '' : `${labels[i]}는 ${NOT_BALL[it.kind]}. `)).join('') + `구는 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('sphere-word', '구의 중심과 구의 반지름의 뜻', '①32 ③40', (d) => (d.bool()
      ? pickWord(d, '구에서 가장 안쪽에 있는 점을 무엇이라고 하는가?', '구의 중심', ['구의 반지름', '원뿔의 꼭짓점', '모선'], '구에서 가장 안쪽에 있는 점을 구의 중심이라고 하고, 구의 중심에서 구의 겉면의 한 점을 이은 선분을 구의 반지름이라고 한다.')
      : pickWord(d, '구의 중심에서 구의 겉면의 한 점을 이은 선분을 무엇이라고 하는가?', '구의 반지름', ['구의 중심', '모선', '높이'], '구에서 가장 안쪽에 있는 점을 구의 중심이라고 하고, 구의 중심에서 구의 겉면의 한 점을 이은 선분을 구의 반지름이라고 한다.'))),
    T('sphere-parts', '구의 중심인 점과 반지름인 선분', '①33·34 ②37·38 ③41', (d, n) => {
      const R = 54;
      if (n === 0) {
        // 구의 가장 안쪽에 있는 점과, 겉면 위의 점 둘, 안쪽의 다른 점 하나
        const spots = d.shuffle([[0, 0], onEll([0, 0], R, R * TILT, d.pick([55, 125])), onEll([0, 0], R, R, d.pick([-35, -150])), d.pick([[-R * 0.45, -R * 0.42], [R * 0.42, -R * 0.45]])]), names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
        const isCenter = (p) => p[0] === 0 && p[1] === 0;
        return C('구의 중심은?', names.map((x) => '점 ' + x), spots.findIndex(isCenter), {
          figure: one((cv) => { addSphere(cv, [0, 0], R); spots.forEach((p, i) => { cv.add(dot(p)); cv.write(isCenter(p) ? [9, -9] : Math.hypot(p[0], p[1]) > R - 1 ? out(p, 10) : [p[0] + 9, p[1] - 8], names[i]); }); }, '구와 점 ㄱ, ㄴ, ㄷ, ㄹ. 한 점은 구의 가장 안쪽에 있고, 두 점은 구의 겉면 위에, 한 점은 구의 안쪽의 다른 곳에 있다.'),
          explain: '구에서 가장 안쪽에 있는 점이 구의 중심이다. 구의 중심에서 구의 겉면까지의 길이는 어느 쪽으로 재어도 같다.', facts: { truth: spots.map(isCenter), want: true }
        });
      }
      // 중심 ㅇ에서 겉면까지 그은 선분, 중심을 지나 겉면의 두 점을 이은 선분, 중심을 지나지 않고 겉면의 두 점을 이은 선분
      const [a, b1, b2, c1, c2] = d.shuffle(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ']), on = (t) => onEll([0, 0], R, R, t), P = { [a]: on(-62), [b1]: on(160), [b2]: on(-20), [c1]: on(60), [c2]: on(125) };
      const pair = (x, y) => '선분 ' + [x, y].sort().join(''), rows = d.shuffle([['선분 ㅇ' + a, true], [pair(b1, b2), false], [pair(c1, c2), false]]);
      return C('점 ㅇ은 구의 중심이다. 구의 반지름을 나타내는 선분은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: one((cv) => {
          addSphere(cv, [0, 0], R);
          cv.add(stroke([0, 0], P[a]) + stroke(P[b1], P[b2]) + stroke(P[c1], P[c2]) + dot([0, 0]) + [a, b1, b2, c1, c2].map((x) => dot(P[x])).join(''));
          cv.write([6, 13], 'ㅇ'); [a, b1, b2, c1, c2].forEach((x) => cv.write(out(P[x], 10), x));
        }, `구. 점 ㅇ은 구의 중심이고 점 ${[a, b1, b2, c1, c2].sort().join(', ')}은 구의 겉면 위에 있다. 선분 ㅇ${a}, ${pair(b1, b2)}, ${pair(c1, c2)}을 그었다. ${pair(b1, b2)}은 점 ㅇ을 지난다.`),
        explain: `구의 중심 ㅇ에서 구의 겉면의 한 점을 이은 선분 ㅇ${a}이 구의 반지름이다. ${pair(b1, b2)}은 구의 중심을 지나 겉면의 두 점을 이은 선분이고, ${pair(c1, c2)}은 구의 중심을 지나지 않는다.`, facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { count: 2 }),
    T('sphere-read', '구의 중심을 지나는 선분에서 반지름 읽기', '①35 ②39 ③42 심10', (d) => {
      // 구의 중심을 지나지 않는 선분의 길이는 쓰지 않는 수다. 그 길이는 그림의 비율(중심을 지나는 선분의 0.64배쯤)에 맞춘다.
      const R = 62, dia = d.pick([8, 10, 12, 14, 16, 18, 20, 22, 24, 26]), other = Math.round(dia * 0.643), on = (t) => onEll([0, 0], R, R, t), p = on(-25), q = on(155), u = on(130), v = on(50);
      return N('점 ㅇ은 구의 중심이다. 구의 반지름은 몇 cm인가?', dia / 2, {
        unit: 'cm', figure: one((cv) => {
          addSphere(cv, [0, 0], R);
          cv.add(stroke(q, p) + stroke(u, v) + dot([0, 0]) + [p, q, u, v].map((x) => dot(x)).join(''));
          cv.write([6, 10], 'ㅇ'); beside(cv, [0, 0], p, -1, cm(dia), 'is-length', 0.5); cv.write([0, u[1] - 10], cm(other), 'is-length');
        }, `구. 점 ㅇ은 구의 중심. 구의 중심을 지나 겉면의 두 점을 이은 선분의 길이 ${dia} cm, 구의 중심을 지나지 않고 겉면의 두 점을 이은 선분의 길이 ${other} cm`),
        explain: `구의 중심 ㅇ을 지나 겉면의 두 점을 이은 선분의 길이 ${dia} cm는 구의 반지름의 2배이다. 구의 반지름은 ${dia} ÷ 2 = ${dia / 2}(cm)이다. 구의 중심을 지나지 않는 선분의 길이 ${other} cm는 쓰지 않는다.`, facts: { calc: [[`${dia}/2`, 0]], unseen: [2] }
      });
    }),
    T('sphere-say', '구에 대한 설명', '①36 ②40 ③43 심17', (d, n) => say(d, n === 0 ? '구에 대한 설명으로 옳지 않은 것은?' : '구에 대한 설명으로 옳은 것은?',
      ['구의 중심은 1개이다.', '구의 반지름은 셀 수 없이 많다.', '구의 반지름은 길이가 모두 같다.', '어느 방향에서 보아도 원 모양이다.', '굽은 면으로만 둘러싸여 있다.', '꼭짓점이 없다.', '평평한 면이 없다.'],
      [['구의 중심은 2개이다.', '구의 중심은 1개이다.'], ['구의 반지름은 1개뿐이다.', '구의 반지름은 셀 수 없이 많다.'], ['평평한 면이 있다.', '구는 굽은 면으로만 둘러싸여 있다.'], ['원 모양인 밑면이 있다.', '구에는 밑면이 없다.'], ['보는 방향에 따라 모양이 다르다.', '구는 어느 방향에서 보아도 원 모양이다.'],
        ['구의 반지름은 재는 곳에 따라 길이가 다르다.', '구의 반지름은 길이가 모두 같다.'], ['가장 안쪽에 있는 점을 구의 꼭짓점이라고 한다.', '가장 안쪽에 있는 점은 구의 중심이다.'], ['위에서 본 모양은 정사각형이다.', '구를 위에서 본 모양은 원이다.']],
      n === 1, n === 1 ? '구는 굽은 면으로만 둘러싸여 있어 평평한 면과 꼭짓점이 없다.' : ''), { count: 2 }),
    T('sphere-fit', '통에 꼭 맞게 든 공', '①57 ②41 ③44 심57', (d) => {
      const r = d.int(4, 15), giveR = d.bool(), rx = 46;
      const figure = one((cv) => {
        addCyl(cv, [0, 0], rx, rx * 2);
        cv.add('<circle cx="0" cy="' + rx + '" r="' + rx + '" style="fill:' + BLUE + ';stroke:#1e293b;stroke-width:1.1"/>' + curve(arcD([0, rx], rx, rx * TILT, 180, 360), 'dash') + curve(arcD([0, rx], rx, rx * TILT, 180, 0), 'thin') + dot([0, rx], 2));
        if (giveR) { cv.add(stroke([0, rx], onEll([0, rx], rx, rx, -38), 'thin')); beside(cv, [0, rx], onEll([0, rx], rx, rx, -38), -1, cm(r), 'is-length'); }
        else cv.write([rx + 6 + K.wide(cm(r * 2), 12) / 2, rx], cm(r * 2), 'is-length');
      }, giveR ? `원기둥 모양의 통에 꼭 맞게 든 공. 공의 반지름 ${r} cm` : `원기둥 모양의 통에 꼭 맞게 든 공. 통의 높이 ${r * 2} cm`);
      if (giveR) return N(`원기둥 모양의 통에 구 모양의 공이 꼭 맞게 들어 있다. 공의 반지름이 ${r} cm일 때 통의 높이는 몇 cm인가?`, r * 2, {
        unit: 'cm', figure, explain: `공이 통에 꼭 맞게 들어 있으므로 통의 높이는 공의 반지름의 2배와 같다. ${r} × 2 = ${r * 2}(cm)`, facts: { calc: [[`${r}*2`, 0]], unseen: [2] }
      });
      return N(`원기둥 모양의 통에 구 모양의 공이 꼭 맞게 들어 있다. 통의 높이가 ${r * 2} cm일 때 공의 반지름은 몇 cm인가?`, r, {
        unit: 'cm', figure, explain: `공이 통에 꼭 맞게 들어 있으므로 통의 높이는 공의 반지름의 2배와 같다. 공의 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다.`, facts: { calc: [[`${r * 2}/2`, 0]], unseen: [2] }
      });
    })
  ]);

  // ── 돌려서 만든 입체도형 ─────────────────────────────────────
  const SPUN = { rect: '원기둥', tri: '원뿔', half: '구' };
  const SPIN_SAID = { rect: '직사각형과 그 한 변에 놓인 굵은 선', tri: '직각삼각형과 직각을 낀 한 변에 놓인 굵은 선', half: '반원과 그 지름에 놓인 굵은 선' }, ARROW = '. 굵은 선을 중심으로 도는 방향을 화살표로 나타냈다.';
  Object.assign(K, { SPUN, SPIN_SAID, ARROW });
  // 작은 그림 칸에 넣는 평면도형
  const flatTile = (kind) => one((cv) => {
    if (kind === 'half') { cv.box([12, 0], 12, 24); cv.add('<path class="mb-poly" d="' + arcD([0, 0], 24, 24, -90, 90) + 'Z"/>'); return; }
    const pts = { rect: [[0, 0], [0, 34], [48, 34], [48, 0]], tri: [[0, 0], [0, 44], [36, 44]], para: [[14, 0], [0, 34], [40, 34], [54, 0]] }[kind];
    pts.forEach(cv.point); cv.add('<polygon class="mb-poly" points="' + ptsOf(pts) + '"/>' + (kind === 'tri' ? corner(pts[1], pts[0], pts[2]) : ''));
  }, { rect: '직사각형', tri: '직각삼각형', half: '반원', para: '평행사변형' }[kind]);
  // 직각삼각형이 되는 세 수 [굵은 선과 이웃한 변, 굵은 선에 놓인 변, 빗변]
  const LEGS = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [9, 12, 15], [12, 9, 15], [8, 15, 17]];
  B.addTypes('6-2-6', 'turn', [
    T('turn-match', '돌려서 만든 입체도형의 이름', '①37 ②42 ③45 심46', (d) => {
      const kinds = d.shuffle(['rect', 'tri', 'half']), made = pickOrder(d, kinds.map((k) => SPUN[k]), perms3(['원기둥', '원뿔', '구']));
      return C('평면도형 가, 나, 다를 굵은 선을 중심으로 한 바퀴 돌렸다. 이때 만들어지는 입체도형을 차례로 쓴 것은?', made.options, made.answer, {
        figure: tiles(kinds.map((k) => (k === 'half' ? spin('half', 22, 0, { label: SPIN_SAID.half + ARROW }) : spin(k, 30, 44, { label: SPIN_SAID[k] + ARROW })))),
        explain: '직사각형을 한 변을 중심으로 돌리면 원기둥, 직각삼각형을 직각을 낀 한 변을 중심으로 돌리면 원뿔, 반원을 지름을 중심으로 돌리면 구가 된다.', facts: { truth: made.truth, want: true }
      });
    }),
    T('turn-from', '돌려서 원기둥·원뿔·구를 만들 수 있는 평면도형', '①37 ②48 ③45·51', (d) => {
      // 돌리기 전 도형 그리기를 고르기로 바꾸었다.
      const kinds = d.shuffle(['rect', 'tri', 'half', 'para']), target = d.pick(['rect', 'tri', 'half']), labels = TAGS.slice(0, 4);
      return C(`한 직선을 중심으로 한 바퀴 돌려서 ${josa(SPUN[target], '을/를')} 만들 수 있는 평면도형은?`, labels, kinds.indexOf(target), {
        figure: tiles(kinds.map(flatTile)), explain: `직사각형을 한 변을 중심으로 돌리면 원기둥, 직각삼각형을 직각을 낀 한 변을 중심으로 돌리면 원뿔, 반원을 지름을 중심으로 돌리면 구가 된다. ${josa(SPUN[target], '을/를')} 만들 수 있는 평면도형은 ${labels[kinds.indexOf(target)]}이다.`,
        facts: { kindPick: { kinds, target } }
      });
    }),
    T('turn-part-map', '돌리기 전 도형의 변과 입체도형의 구성 요소', '②42 심49', (d, n) => (n === 0
      ? pickWord(d, '직사각형 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 변 ㉠의 길이는 이 입체도형의 무엇과 같은가?', '밑면의 반지름', ['밑면의 지름', '높이', '밑면의 둘레'],
        '직사각형을 한 변을 중심으로 돌리면 원기둥이 된다. 굵은 선에 놓인 변이 원기둥의 높이가 되고, 그 변과 이웃한 변 ㉠은 한 바퀴 돌면서 밑면인 원을 그린다. 변 ㉠의 길이는 밑면의 반지름과 같다.', spin('rect', 50, 72, { aText: '㉠', label: SPIN_SAID.rect + ARROW + ' 굵은 선과 이웃한 아래쪽 변에 ㉠' }))
      : pickWord(d, '직각삼각형 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 변 ㉠의 길이는 이 입체도형의 무엇과 같은가?', '모선의 길이', ['높이', '밑면의 반지름', '밑면의 지름'],
        '직각삼각형을 직각을 낀 한 변을 중심으로 돌리면 원뿔이 된다. 굵은 선에 놓인 변이 원뿔의 높이가 되고, 아래쪽 변이 밑면의 반지름이 된다. 비스듬한 변 ㉠은 원뿔의 꼭짓점과 밑면의 둘레의 한 점을 잇는 모선이 된다.', spin('tri', 52, 72, { cText: '㉠', label: SPIN_SAID.tri + ARROW + ' 직각과 마주 보는 비스듬한 변에 ㉠' }))), { count: 2 }),
    T('turn-rect-read', '직사각형을 돌려 만든 원기둥의 밑면의 지름과 높이', '①38 ②43 ③46 심47', (d) => {
      const [a, b] = d.until(() => [d.int(2, 8), d.int(3, 12)], ([x, y]) => x !== y && x * 2 !== y && y <= x * 2.6 && x <= y * 1.5), k = 96 / Math.max(a, b);
      return M('직사각형 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 이 입체도형의 밑면의 지름과 높이는 각각 몇 cm인가?', [{ label: '밑면의 지름', answer: a * 2, unit: 'cm' }, { label: '높이', answer: b, unit: 'cm' }], {
        figure: spin('rect', a * k, b * k, { aText: cm(a), bText: cm(b), label: `${SPIN_SAID.rect}${ARROW} 굵은 선에 놓인 변의 길이 ${b} cm, 그 변과 이웃한 변의 길이 ${a} cm` }),
        explain: `직사각형을 한 변을 중심으로 돌리면 원기둥이 된다. 굵은 선과 이웃한 변의 길이 ${a} cm가 밑면의 반지름이므로 밑면의 지름은 ${a} × 2 = ${a * 2}(cm)이다. 굵은 선에 놓인 변의 길이 ${b} cm가 높이이다.`,
        facts: { calc: [[`${a}*2`, 0], [String(b), 1]], unseen: [2] }
      });
    }),
    T('turn-tri-read', '직각삼각형을 돌려 만든 원뿔의 밑면의 지름, 높이, 모선의 길이', '①39 ②44 ③47 심49', (d) => {
      const [a, b, c] = d.pick(LEGS), k = 96 / Math.max(a, b);
      return M('직각삼각형 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 이 입체도형의 밑면의 지름, 높이, 모선의 길이는 각각 몇 cm인가?', [{ label: '밑면의 지름', answer: a * 2, unit: 'cm' }, { label: '높이', answer: b, unit: 'cm' }, { label: '모선의 길이', answer: c, unit: 'cm' }], {
        figure: spin('tri', a * k, b * k, { aText: cm(a), bText: cm(b), cText: cm(c), label: `${SPIN_SAID.tri}${ARROW} 굵은 선에 놓인 변의 길이 ${b} cm, 직각을 낀 다른 변의 길이 ${a} cm, 비스듬한 변의 길이 ${c} cm` }),
        explain: `직각삼각형을 직각을 낀 한 변을 중심으로 돌리면 원뿔이 된다. 직각을 낀 다른 변의 길이 ${a} cm가 밑면의 반지름이므로 밑면의 지름은 ${a} × 2 = ${a * 2}(cm)이다. 굵은 선에 놓인 변의 길이 ${b} cm가 높이이고, 비스듬한 변의 길이 ${c} cm가 모선의 길이이다.`,
        facts: { calc: [[`${a}*2`, 0], [String(b), 1], [String(c), 2]], unseen: [2] }
      });
    }),
    T('turn-half-read', '반원을 돌려 만든 구의 반지름', '①41 ②45 ③48 심50', (d) => {
      const dia = d.pick([8, 10, 12, 14, 16, 18, 20, 24, 28, 30]);
      return N('반원 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 이 입체도형의 반지름은 몇 cm인가?', dia / 2, {
        unit: 'cm', figure: spin('half', 46, 0, { dText: cm(dia), label: `${SPIN_SAID.half}${ARROW} 반원의 지름 ${dia} cm` }),
        explain: `반원을 지름을 중심으로 돌리면 구가 되고, 구의 반지름은 반원의 반지름과 같다. 반원의 지름이 ${dia} cm이므로 구의 반지름은 ${dia} ÷ 2 = ${dia / 2}(cm)이다.`, facts: { calc: [[`${dia}/2`, 0]], unseen: [2] }
      });
    }),
    T('turn-pick-cone', '직각삼각형을 돌려 만든 입체도형 고르기', '①40 ②48', (d) => {
      // 그리기를 고르기로 바꾸었다. 세 원뿔은 직각삼각형과 같은 크기로 그린다: 맞는 것, 아래쪽 변을 밑면의 지름으로 잡은 것, 두 변을 바꾸어 잡은 것
      const [a, b] = d.pick([[26, 50], [30, 54], [28, 46]]), kinds = d.shuffle(['right', 'thin', 'flat']), labels = TAGS.slice(0, 3), at = kinds.indexOf('right');
      const art = { right: () => one((cv) => addCone(cv, [0, 0], a, b), '원뿔. 밑면의 반지름은 직각삼각형의 아래쪽 변과 같고 높이는 굵은 선에 놓인 변과 같다.'), thin: () => one((cv) => addCone(cv, [0, 0], a / 2, b), '원뿔. 밑면의 지름은 직각삼각형의 아래쪽 변과 같고 높이는 굵은 선에 놓인 변과 같다.'), flat: () => one((cv) => addCone(cv, [0, 0], b, a), '원뿔. 밑면의 반지름은 직각삼각형의 굵은 선에 놓인 변과 같고 높이는 아래쪽 변과 같다.') };
      return C('직각삼각형 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌렸다. 이때 만들어지는 입체도형은?', labels, at, {
        figure: spin('tri', a, b, { label: SPIN_SAID.tri + ARROW }) + tiles(kinds.map((k) => art[k]())),
        explain: `굵은 선에 놓인 변이 원뿔의 높이가 되고, 아래쪽 변이 밑면의 반지름이 된다. 높이가 굵은 선에 놓인 변과 같고 밑면의 지름이 아래쪽 변의 2배인 원뿔은 ${labels[at]}이다.`, facts: { kindPick: { kinds, target: 'right' } }
      });
    }),
    T('turn-back', '돌리기 전 종이의 변의 길이', '①42 ②44 심50', (d, n) => {
      if (n === 0) {
        const r = d.int(2, 7), h = K.heightFor(d, r * 2), k = 36 / r;
        return M('직사각형 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 만든 입체도형이다. 돌리기 전 종이의 ㉠, ㉡의 길이는 각각 몇 cm인가?', [{ label: '㉠', answer: r, unit: 'cm' }, { label: '㉡', answer: h, unit: 'cm' }], {
          figure: spin('rect', 36, h * k, { aText: '㉠', bText: '㉡', label: SPIN_SAID.rect + ARROW + ' 굵은 선과 이웃한 변에 ㉠, 굵은 선에 놓인 변과 마주 보는 변에 ㉡' }) + cylFig(36, h * k, { d: cm(r * 2), h: cm(h), label: `원기둥. 밑면의 지름 ${r * 2} cm, 높이 ${h} cm` }),
          explain: `굵은 선과 이웃한 변 ㉠은 밑면의 반지름이 되므로 ${r * 2} ÷ 2 = ${r}(cm)이다. 굵은 선에 놓인 변과 길이가 같은 변 ㉡은 높이가 되므로 ${h} cm이다.`, facts: { calc: [[`${r * 2}/2`, 0], [String(h), 1]], unseen: [2] }
        });
      }
      const c = coneOf(d);
      return M('직각삼각형 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 만든 입체도형이다. 돌리기 전 종이의 ㉠, ㉡의 길이는 각각 몇 cm인가?', [{ label: '㉠', answer: c.l, unit: 'cm' }, { label: '㉡', answer: c.r, unit: 'cm' }], {
        figure: spin('tri', c.rx * 0.8, c.hpx * 0.8, { cText: '㉠', aText: '㉡', label: SPIN_SAID.tri + ARROW + ' 비스듬한 변에 ㉠, 직각을 낀 아래쪽 변에 ㉡' }) + coneFig(c.rx * 0.8, c.hpx * 0.8, { d: cm(c.r * 2), l: cm(c.l), inner: true, label: `원뿔. 밑면의 지름 ${c.r * 2} cm, 모선의 길이 ${c.l} cm` }),
        explain: `비스듬한 변 ㉠은 원뿔의 모선이 되므로 ${c.l} cm이다. 직각을 낀 아래쪽 변 ㉡은 밑면의 반지름이 되므로 ${c.r * 2} ÷ 2 = ${c.r}(cm)이다.`, facts: { calc: [[String(c.l), 0], [`${c.r * 2}/2`, 1]], unseen: [2] }
      });
    }, { count: 2 }),
    T('turn-biggest', '가장 큰 구를 만든 사람', '②45 심25', (d) => {
      // 반지름으로 적은 사람과 지름으로 적은 사람을 섞는다. 적힌 수가 가장 큰 사람이 답이 되지 않는 경우도 있다.
      const who = d.shuffle(NAMES).slice(0, 3), r = d.int(6, 10), dias = d.bool() ? [r * 2 - 2, r * 2 - d.pick([4, 6])] : [r * 2 + d.pick([2, 4]), r * 2 - d.pick([2, 4])];
      const rows = d.shuffle([{ text: `반지름이 ${r} cm인 반원`, expr: String(r), value: r, how: `${r} cm` }].concat(dias.map((v) => ({ text: `지름이 ${v} cm인 반원`, expr: `${v}/2`, value: v / 2, how: `${v} ÷ 2 = ${v / 2}(cm)` }))));
      const best = rows.findIndex((x) => x.value === Math.max(...rows.map((y) => y.value)));
      return C('세 사람이 반원 모양의 종이를 지름을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 가장 큰 입체도형을 만든 사람은?', who, best, {
        figure: lines(rows.map((x, i) => `${who[i]}: ${x.text}`)),
        explain: `반원을 지름을 중심으로 돌리면 구가 되고, 구의 반지름은 반원의 반지름과 같다. 반원의 반지름은 ${rows.map((x, i) => `${name(who[i], '이/가')} ${x.how}`).join(', ')}이므로 ${name(who[best], '이/가')} 만든 구가 가장 크다.`,
        facts: { choose: { exprs: rows.map((x) => x.expr), rule: 'max' }, unseen: [2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
