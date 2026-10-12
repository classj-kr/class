// 6학년 2학기 6단원 원기둥, 원뿔, 구 — 위·앞·옆에서 본 모양, 세 도형 비교하기의 기본 문항과 실력 문항.
// 단원 틀과 그림 도구(B.kit.round626)는 6-2-6a.js 에 있다. 대조표는 수집본의 _분석/6-2-6/싣기_대조표.md.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 원기둥을 「서 있는 둥근 기둥」이라는 겉모습으로 안다. 눕혀 놓은 원기둥·납작한 원기둥은 빼고, 위아래 원의 크기가 다르거나 윗면이 비스듬한 도형은 원기둥으로 센다.
//  - 밑면은 아래에 놓인 면이고 높이는 위아래로 잰 길이라고 본다. 눕혀 놓은 원기둥에서 밑면의 지름과 높이를 바꿔 읽는다.
//  - 원뿔의 높이를 옆면을 따라 잰 길이(모선의 길이)로 안다. 그림에 적힌 수 가운데 비스듬한 선의 길이를 높이로 읽는다. 반지름을 지름으로 읽는다.
//  - 전개도의 두 원은 직사각형의 한가운데 위아래에 붙어 있어야만 한다고 본다(어긋난 자리에 붙은 것·옆으로 돌려 그린 것을 뺀다).
//    거꾸로 원 2개와 직사각형 1개가 붙어 있기만 하면 전개도라고 본다(두 원이 같은 쪽에 붙은 것, 옆면의 가로가 밑면의 둘레와 맞지 않는 것을 넣는다). 옆면의 가로를 밑면의 지름으로 안다.
//  - 평면도형을 돌릴 때 중심이 되는 변이 높이가 되고 다른 변이 반지름이 된다는 것을 놓친다. 가로로 놓인 변을 중심으로 돌려도 세로로 선 변을 높이로 읽고, 반지름이 되는 변을 지름으로 읽는다.
//  - 구를 본 모양은 방향에 따라 크기가 다르다고 보거나, 본 모양인 원의 반지름을 구의 지름으로 읽는다.
//
// 싣는 기준: 실력에는 두 가지만 둔다.
//  ① 그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제(위의 잘못된 생각이 드러나는 그림을 준다)
//  ② 두 번 넘게 생각해야 풀리는 문제(돌려 만든 도형 → 전개도, 본 모양 → 도형과 길이, 조건 둘로 가리기)
//  길이를 셈하는 문항은 원주를 한 번 구하거나 한 번 거꾸로 구하는 데 그친다(반지름과 지름을 바꾸는 × 2, ÷ 2 는 읽기로 본다).
//  기본에서 하는 일을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 싣지 않는다. 넓이, 둘레를 여러 단계로 셈하는 것, 조건을 거꾸로 푸는 것도 싣지 않는다(6-2-6a.js 머리의 「뺀 것」).
//
// 뺀 것과 까닭(본 모양·비교하기와 심화꼴)
//  - 본 모양의 둘레·넓이(①62~64 ②55·56 심26~30), 구를 자른 면(①66 ②56): 원주·넓이 셈이거나 중학교 내용(단면)이다.
//  - 구성 요소의 수를 더하고 곱하기(②59의 변형 ③59 심13): 뜻 없는 셈. 수가 다른 하나를 가리는 문항만 실었다.
//  - 같은 점·다른 점 쓰기(①55 ②60 ③58 심22), 본 모양 그리기(①44 ②53): 고르기(같은 점, 옳지 않은 설명, 잘못 그린 본 모양)로 바꾸어 실었다.
//  - 전개도의 넓이·둘레·옆면의 둘레·종이에 꼭 맞는 전개도(심36~43), 굴린 거리·롤러(심59~61), 넓이 조건·반원의 둘레에서 거꾸로(심55·56), 대화 조건으로 높이·모선 구하기(심63): 측정이거나 방정식 꼴이다.
//  - 원기둥과 원뿔의 높이의 합·차(심11), 지름 + 높이 − 모선(심8의 변형), 돌리는 변에 따른 지름의 차(심48의 대표): 덤 셈을 떼고 읽기·견주기로 실었다.
//  - 한 밑면의 둘레와 높이가 같은 원기둥의 높이(①22 심44): 원주 셈이 일의 전부다. 「옆면이 정사각형이면 높이는 밑면의 둘레와 같다」는 판단만 셈 없이 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, tagged, table, box, N, M, C } = B.kit;
  const K = B.kit.round626;
  const { T, TAGS, MARKS, cm, fixed, field, setOptions, say, pickWord, pickOrder, perms3, TILT, ptsOf, wide, stroke, dot, canvas, one, tiles, corner, addCyl, addCone, addSphere, addFrustum, addSlant, addLying, SAID, ART, pickArt, cylFig, coneFig, netFig, NETS, netTile, spin, flatView, VIEW, measure,
    wheel, heightFor, NOT_CYL, CYL_LEAD, NET_LEAD, CONES, coneOf, SPIN_SAID, ARROW } = K;
  const SOLID = '6수03-07', NET = '6수03-08';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';
  const FRONT = { 원기둥: '직사각형', 원뿔: '삼각형', 구: '원' };

  // ── 위, 앞, 옆에서 본 모양 ───────────────────────────────────
  B.addTypes('6-2-6', 'view', [
    T('view-front', '세 입체도형을 앞에서 본 모양', '①43 ②49 ③53 심23', (d) => {
      const order = d.shuffle(['원기둥', '원뿔', '구']), made = pickOrder(d, order.map((s) => FRONT[s]), perms3(['직사각형', '삼각형', '원']));
      return C(`${josa(order.join(', '), '을/를')} 앞에서 본 모양을 차례로 쓴 것은?`, made.options, made.answer, {
        explain: '원기둥을 앞에서 본 모양은 직사각형, 원뿔을 앞에서 본 모양은 삼각형, 구를 앞에서 본 모양은 원이다.', facts: { truth: made.truth, want: true }
      });
    }),
    T('view-top-same', '세 입체도형의 모양이 같게 보이는 방향', '①46 ③53', (d) => {
      const rows = d.shuffle([['위', true], ['앞', false], ['옆', false]]).concat([['그런 방향은 없다.', false]]);
      return C('원기둥, 원뿔, 구를 위, 앞, 옆에서 보았다. 세 입체도형의 모양이 모두 같게 보이는 방향은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: '위에서 본 모양은 세 입체도형 모두 원이다. 앞과 옆에서 본 모양은 원기둥이 직사각형, 원뿔이 삼각형, 구가 원으로 서로 다르다.', facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('view-any-circle', '어느 방향에서 보아도 원인 입체도형', '①46 ②51·58', (d) => pickWord(d, '어느 방향에서 보아도 모양이 원인 입체도형은?', '구', ['원기둥', '원뿔', '정육면체'],
      '구는 어느 방향에서 보아도 원 모양이다. 원기둥과 원뿔은 위에서 본 모양만 원이다.')),
    T('view-guess', '본 모양을 보고 입체도형 맞히기', '①45 ②50 ③52 심5', (d) => {
      const solid = d.pick(['원기둥', '원뿔']);
      return pickWord(d, '어떤 입체도형을 위, 앞, 옆에서 본 모양이다. 이 입체도형은?', solid, solid === '원기둥' ? ['원뿔', '구', '사각기둥'] : ['원기둥', '구', '사각뿔'],
        `위에서 본 모양이 원이고 앞과 옆에서 본 모양이 ${FRONT[solid]}인 입체도형은 ${solid}이다.`, tiles([VIEW.원(), VIEW[FRONT[solid]](), VIEW[FRONT[solid]]()], ['위', '앞', '옆']));
    }),
    T('view-wrong', '잘못 그린 본 모양', '①44 ②49·53', (d) => {
      // 본 모양 그리기를 잘못 그린 것 고르기로 바꾸었다. 혼자만 모양이 달라서 눈에 띄는 그림이 답이 되지 않게 짠다.
      const solid = d.pick(['원기둥', '원뿔']), f = FRONT[solid], [shapes, at] = d.pick([[[f, f, f], 0], [['원', f, '원'], 2], [['원', '원', f], 1]]), names = ['위에서 본 모양', '앞에서 본 모양', '옆에서 본 모양'];
      return C(`${josa(solid, '을/를')} 위, 앞, 옆에서 본 모양을 그렸다. 잘못 그린 것은?`, names, at, {
        figure: tiles(shapes.map((s) => VIEW[s]()), ['위', '앞', '옆']),
        explain: `${josa(solid, '을/를')} 위에서 본 모양은 원이고, 앞과 옆에서 본 모양은 ${f}이다. ${names[at]}을 ${josa(shapes[at], '으로/로')} 그린 것이 잘못이다.`, facts: { truth: names.map((_, i) => i === at), want: true }
      });
    }),
    T('view-square', '앞에서 본 모양이 정사각형인 원기둥', '①47 ②54 ③54 심24', (d) => {
      const r = d.int(3, 12), lead = '원기둥을 앞에서 본 모양은 가로가 밑면의 지름, 세로가 높이인 직사각형이다. 이 직사각형이 정사각형이므로 높이와 밑면의 지름이 같다.';
      if (d.bool()) return N(`어떤 원기둥을 위에서 본 모양은 반지름이 ${r} cm인 원이고, 앞에서 본 모양은 정사각형이다. 이 원기둥의 높이는 몇 cm인가?`, r * 2, {
        unit: 'cm', figure: tiles([flatView('circle', 74, 74, { rText: cm(r), label: `반지름이 ${r} cm인 원` }), flatView('rect', 74, 74, { label: '정사각형' })], ['위', '앞']),
        explain: `${lead} 위에서 본 원의 지름 ${r} × 2 = ${r * 2}(cm)가 밑면의 지름이므로 높이도 ${r * 2} cm이다.`, facts: { calc: [[`${r}*2`, 0]], unseen: [2] }
      });
      return N(`어떤 원기둥을 앞에서 본 모양은 정사각형이고, 이 원기둥의 높이는 ${r * 2} cm이다. 이 원기둥의 밑면의 반지름은 몇 cm인가?`, r, {
        unit: 'cm', figure: tiles([flatView('circle', 74, 74, { label: '원' }), flatView('rect', 74, 74, { hText: cm(r * 2), label: `세로가 ${r * 2} cm인 정사각형` })], ['위', '앞']),
        explain: `${lead} 높이가 ${r * 2} cm이므로 밑면의 지름도 ${r * 2} cm이고, 밑면의 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다.`, facts: { calc: [[`${r * 2}/2`, 0]], unseen: [2] }
      });
    })
  ]);

  // ── 원기둥, 원뿔, 구 비교하기 ────────────────────────────────
  // 원기둥·원뿔·구를 쌓아 만든 모양. parts: [종류, 자리, 크기…]를 차례로 그린다(뒤에 그린 것이 앞의 것을 가린다).
  const BUILT = {
    castle: { said: '양옆에 높은 원기둥이 하나씩 서 있고 그 위에 원뿔이 하나씩 놓여 있다. 가운데에는 낮은 원기둥이 있고 그 위에 구가 놓여 있다.',
      parts: [['cyl', [-52, 34], 16, 56, true], ['cone', [-52, -4], 16, 38], ['cyl', [52, 34], 16, 56, true], ['cone', [52, -4], 16, 38], ['cyl', [0, 56], 28, 34], ['ball', [0, 41], 16]] },
    snowman: { said: '큰 구 위에 작은 구가 놓여 있고 그 위에 원뿔이 놓여 있다. 옆에는 낮은 원기둥이 하나 있다.',
      parts: [['ball', [0, 64], 27], ['ball', [0, 23], 19], ['cone', [0, -30], 13, 34], ['cyl', [58, 62], 17, 29]] },
    gate: { said: '양옆에 원기둥이 하나씩 서 있고 그 위에 구가 하나씩 놓여 있다. 가운데에는 낮은 원기둥이 있고 그 위에 원뿔이 놓여 있다.',
      parts: [['cyl', [-54, 30], 15, 58], ['ball', [-54, 16], 15], ['cyl', [54, 30], 15, 58], ['ball', [54, 16], 15], ['cyl', [0, 60], 26, 28, true], ['cone', [0, 14], 26, 46]] },
    rocket: { said: '가운데에 높은 원기둥이 서 있고 그 위에 원뿔이 놓여 있다. 양옆에는 낮은 원기둥이 하나씩 있고 그 위에 원뿔이 하나씩 놓여 있다.',
      parts: [['cyl', [0, 22], 20, 68, true], ['cone', [0, -22], 20, 44], ['cyl', [-40, 58], 11, 32, true], ['cone', [-40, 34], 11, 24], ['cyl', [40, 58], 11, 32, true], ['cone', [40, 34], 11, 24]] },
    tower: { said: '넓고 낮은 원기둥 위에 좁은 원기둥이 놓여 있고 그 위에 구가 놓여 있다.',
      parts: [['cyl', [0, 62], 36, 26], ['cyl', [0, 26], 22, 36], ['ball', [0, 10], 17]] }
  };
  const builtArt = (key) => one((cv) => BUILT[key].parts.forEach(([kind, at, a, b, bare]) => { if (kind === 'cyl') addCyl(cv, at, a, b, { bare }); else if (kind === 'cone') addCone(cv, at, a, b, { bare: true }); else addSphere(cv, at, a); }), '입체도형을 쌓아 만든 모양. ' + BUILT[key].said);
  const builtCount = (key) => ['cyl', 'cone', 'ball'].map((kind) => BUILT[key].parts.filter((p) => p[0] === kind).length);
  const THINGS = { 원기둥: ['음료수 캔', '건전지', '통조림 통'], 원뿔: ['고깔모자', '아이스크림 콘'], 구: ['축구공', '구슬', '탁구공'], 직육면체: ['과자 상자', '벽돌', '두꺼운 사전'] };
  B.addTypes('6-2-6', 'compare', [
    T('compare-sort', '원기둥, 원뿔, 구의 수 세기', '②2 ③4 심1', (d) => {
      const [x, y, z] = d.until(() => [d.int(1, 2), d.int(1, 2), d.int(1, 2)], (v) => v[0] + v[1] + v[2] <= 5 && new Set(v).size > 1);
      const items = d.shuffle(pickArt(d, ['cylTall', 'cylMid', 'cylWide'], x).concat(pickArt(d, ['coneTall', 'coneWide'], y), pickArt(d, ['ball', 'ballSmall'], z), pickArt(d, ['prism4', 'prism6', 'pyr4', 'pyr5'], 1)));
      const count = (kind) => items.filter((it) => it.kind === kind).length, labels = TAGS.slice(0, items.length), list = (kind) => labels.filter((_, i) => items[i].kind === kind).join(', ');
      return M('입체도형 가운데 원기둥, 원뿔, 구는 각각 몇 개인가?', [{ label: '원기둥', answer: count('cyl'), unit: '개' }, { label: '원뿔', answer: count('cone'), unit: '개' }, { label: '구', answer: count('ball'), unit: '개' }], {
        figure: tiles(items.map((it) => it.art())), explain: `원기둥은 ${list('cyl')}, 원뿔은 ${list('cone')}, 구는 ${list('ball')}이다. ${labels[items.findIndex((it) => it.kind === 'prism' || it.kind === 'pyramid')]}는 밑면이 다각형이라서 원기둥도 원뿔도 아니다.`,
        facts: fixed(x, y, z)
      });
    }),
    T('compare-names', '그림을 보고 입체도형의 이름 쓰기', '①4 ②2·3 ③6', (d) => {
      const NAME = { cyl: '원기둥', cone: '원뿔', ball: '구' }, items = d.shuffle([d.pick(['cylTall', 'cylMid']), d.pick(['coneTall', 'coneWide']), 'ball']).map((key) => ART[key]), made = pickOrder(d, items.map((it) => NAME[it.kind]), perms3(['원기둥', '원뿔', '구']));
      return C('입체도형 가, 나, 다의 이름을 차례로 쓴 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())), explain: '두 밑면이 서로 평행하고 합동인 원인 기둥 모양은 원기둥, 밑면이 원이고 위가 뾰족한 뿔 모양은 원뿔, 공 모양은 구이다.', facts: { truth: made.truth, want: true }
      });
    }),
    T('compare-things', '원기둥, 원뿔, 구 모양인 물건', '②4 ③7', (d, n) => {
      if (n === 0) {
        const shape = d.pick(['원기둥', '원뿔', '구']), want = d.pick(THINGS[shape]), others = Object.keys(THINGS).filter((s) => s !== shape).map((s) => d.pick(THINGS[s]));
        return pickWord(d, `다음 가운데 ${shape} 모양인 물건은?`, want, others, `${josa(want, '은/는')} ${shape} 모양이다. ${others.map((o) => `${josa(o, '은/는')} ${Object.keys(THINGS).find((s) => THINGS[s].includes(o))} 모양`).join(', ')}이다.`);
      }
      const shapes = d.shuffle(['원기둥', '원뿔', '구']), things = shapes.map((s) => d.pick(THINGS[s])), right = `${things[0]} — ${shapes[0]}`;
      const options = d.shuffle([right, `${things[1]} — ${shapes[2]}`, `${things[2]} — ${shapes[0]}`, `${d.pick(THINGS.직육면체)} — ${shapes[1]}`]);
      return C('물건과 그 모양을 바르게 짝 지은 것은?', options, options.indexOf(right), {
        explain: `${josa(things[0], '은/는')} ${shapes[0]} 모양이다. ${josa(things[1], '은/는')} ${shapes[1]} 모양, ${josa(things[2], '은/는')} ${shapes[2]} 모양이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }, { count: 2 }),
    T('compare-built', '모양을 만드는 데 사용한 입체도형', '②61·62 심4', (d, n) => {
      if (n === 0) {
        const key = d.pick(['castle', 'snowman', 'gate']), [x, y, z] = builtCount(key);
        return M('원기둥, 원뿔, 구를 사용하여 만든 모양이다. 원기둥, 원뿔, 구를 각각 몇 개 사용했는가?', [{ label: '원기둥', answer: x, unit: '개' }, { label: '원뿔', answer: y, unit: '개' }, { label: '구', answer: z, unit: '개' }], {
          figure: builtArt(key), explain: `${BUILT[key].said} 원기둥은 ${x}개, 원뿔은 ${y}개, 구는 ${z}개이다.`, facts: fixed(x, y, z)
        });
      }
      const key = d.pick(['rocket', 'tower']), count = builtCount(key), names = ['원기둥', '원뿔', '구'], missing = names[count.indexOf(0)];
      return pickWord(d, '입체도형을 사용하여 만든 모양이다. 이 모양을 만드는 데 사용하지 않은 입체도형은?', missing, names.filter((x) => x !== missing), `${BUILT[key].said} ${josa(missing, '은/는')} 사용하지 않았다.`, builtArt(key));
    }, { count: 2 }),
    T('compare-cyl-cone', '원기둥과 원뿔의 같은 점과 다른 점', '①49 ②36 ③55 심19', (d, n) => (n === 0
      ? pickWord(d, '원뿔에는 있지만 원기둥에는 없는 것은?', d.pick(['원뿔의 꼭짓점', '모선']), ['밑면', '옆면', '높이'], '원기둥과 원뿔에는 모두 밑면, 옆면, 높이가 있다. 원뿔의 꼭짓점과 모선은 원뿔에만 있다.')
      : say(d, '원기둥과 원뿔의 같은 점으로 옳은 것은?', ['밑면의 모양이 원이다.', '옆면이 굽은 면이다.', '위에서 본 모양이 원이다.'],
        [['밑면의 수가 같다.', '밑면은 원기둥이 2개, 원뿔이 1개이다.'], ['꼭짓점이 있다.', '원기둥에는 꼭짓점이 없다.'], ['앞에서 본 모양이 같다.', '앞에서 본 모양은 원기둥이 직사각형, 원뿔이 삼각형이다.'], ['모선이 있다.', '모선은 원뿔에만 있다.']], true,
        '원기둥과 원뿔은 밑면의 모양이 원이고 옆면이 굽은 면이며 위에서 본 모양이 원이다.')), { count: 2 }),
    T('compare-three', '원기둥, 원뿔, 구에 대한 설명', '①51 ②57 ③55·57 심18', (d, n) => say(d, n === 0 ? '원기둥, 원뿔, 구에 대한 설명으로 옳지 않은 것은?' : '원기둥, 원뿔, 구에 대한 설명으로 옳은 것은?',
      ['세 입체도형 모두 굽은 면이 있다.', '세 입체도형 모두 위에서 본 모양이 원이다.', '원기둥과 원뿔에는 밑면이 있지만 구에는 없다.', '원뿔에는 꼭짓점이 있지만 원기둥과 구에는 없다.', '원기둥과 원뿔에는 평평한 면이 있지만 구에는 없다.', '세 입체도형 모두 평면도형을 한 직선을 중심으로 돌려서 만들 수 있다.'],
      [['세 입체도형 모두 어느 방향에서 보아도 모양이 같다.', '어느 방향에서 보아도 모양이 같은 것은 구뿐이다.'], ['세 입체도형 모두 밑면이 있다.', '구에는 밑면이 없다.'], ['세 입체도형 모두 꼭짓점이 있다.', '꼭짓점이 있는 것은 원뿔뿐이다.'], ['원뿔과 구는 앞에서 본 모양이 원이다.', '원뿔을 앞에서 본 모양은 삼각형이다.'],
        ['세 입체도형 모두 앞에서 본 모양이 같다.', '앞에서 본 모양은 원기둥이 직사각형, 원뿔이 삼각형, 구가 원이다.'], ['원기둥을 앞에서 본 모양은 원이다.', '원기둥을 앞에서 본 모양은 직사각형이다.']],
      n === 1, n === 1 ? '세 입체도형은 모두 굽은 면이 있고 위에서 본 모양이 원이다. 밑면은 원기둥과 원뿔에만 있고, 꼭짓점은 원뿔에만 있다.' : ''), { count: 2 }),
    T('compare-fit', '설명을 입체도형에 맞추기', '②36 ③56', (d) => {
      // 설명마다 [원기둥, 원뿔, 구]에 맞는지를 적어 두고 그것으로 답을 낸다.
      const SAID = [['밑면이 2개이다.', [1, 0, 0]], ['밑면이 1개이다.', [0, 1, 0]], ['옆면이 굽은 면이다.', [1, 1, 0]], ['꼭짓점이 있다.', [0, 1, 0]], ['평평한 면이 없다.', [0, 0, 1]], ['위에서 본 모양이 원이다.', [1, 1, 1]], ['앞에서 본 모양이 직사각형이다.', [1, 0, 0]],
        ['앞에서 본 모양이 삼각형이다.', [0, 1, 0]], ['어느 방향에서 보아도 원 모양이다.', [0, 0, 1]], ['모선이 있다.', [0, 1, 0]], ['굽은 면이 있다.', [1, 1, 1]]];
      const names = ['원기둥', '원뿔', '구'], t = d.int(0, 2), rows = d.until(() => d.shuffle(SAID).slice(0, 4), (list) => { const k = list.filter((s) => s[1][t]).length; return k === 2 || k === 3; });
      const labels = MARKS.slice(0, 4), flags = rows.map((s) => Boolean(s[1][t])), made = setOptions(d, labels, flags);
      return C(`${names[t]}에 대한 설명을 모두 고른 것은?`, made.options, made.answer, {
        figure: tagged(rows.map((s) => s[0]), MARKS), explain: `${names[t]}에 대한 설명은 ${labels.filter((_, i) => flags[i]).join(', ')}이다. ` + rows.map((s, i) => (flags[i] ? '' : `${labels[i]}은 ${names.filter((_, k) => s[1][k]).join(', ')}에 대한 설명이다. `)).join('').trim(),
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('compare-riddle', '설명에 모두 맞는 입체도형', '①52 ②58 심5', (d) => {
      const [solid, said, others] = d.pick([['원기둥', ['밑면이 2개이다.', '옆면이 굽은 면이다.', '앞에서 본 모양이 직사각형이다.'], ['원뿔', '구', '사각기둥']], ['원뿔', ['밑면이 원이다.', '옆면이 굽은 면이다.', '꼭짓점이 있다.'], ['원기둥', '구', '사각뿔']], ['구', ['꼭짓점이 없다.', '평평한 면이 없다.', '어느 방향에서 보아도 모양이 같다.'], ['원기둥', '원뿔', '정육면체']]]);
      return pickWord(d, '다음 설명에 모두 맞는 입체도형은?', solid, others, `세 설명에 모두 맞는 입체도형은 ${solid}이다. ${solid === '구' ? '구는 굽은 면으로만 둘러싸여 있어 꼭짓점과 평평한 면이 없고, 어느 방향에서 보아도 원 모양이다.' : solid === '원뿔' ? '원뿔은 밑면이 원 1개이고 옆면이 굽은 면이며 뾰족한 꼭짓점이 있다.' : '원기둥은 밑면이 2개이고 옆면이 굽은 면이며 앞에서 본 모양이 직사각형이다.'}`, conditions(d.shuffle(said)));
    }),
    T('compare-count-odd', '구성 요소의 수가 다른 하나', '①53 ②59 ③59 심13', (d) => {
      const rows = d.shuffle([['원기둥의 밑면의 수', 2]].concat(d.shuffle(['원뿔의 밑면의 수', '원뿔의 꼭짓점의 수', '구의 중심의 수', '원기둥의 옆면의 수', '원뿔의 옆면의 수']).slice(0, 3).map((text) => [text, 1])));
      return C('다음 가운데 수가 나머지 셋과 다른 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1] === 2), {
        explain: `원기둥의 밑면은 2개이다. ${rows.filter((r) => r[1] === 1).map((r) => r[0].replace(/의 수$/, '')).join(', ')}은 모두 1개이다.`, facts: { choose: { exprs: rows.map((r) => String(r[1])), rule: 'odd' }, unseen: [1, 2] }
      });
    }),
    T('compare-table', '원기둥과 원뿔을 비교한 표', '①48·54 ②52', (d) => {
      // 줄마다 원기둥 칸이나 원뿔 칸 하나를 빈칸으로 둔다. 틀린 보기는 다른 도형의 값이나 다른 방향에서 본 모양으로 바꾼 것이다.
      const ROWS = [['밑면의 수', '2개', '1개'], ['위에서 본 모양', '원', '원'], ['앞에서 본 모양', '직사각형', '삼각형']], cols = ROWS.map(() => d.pick([1, 2])), right = ROWS.map((row, i) => row[cols[i]]);
      const alts = [[right[0], right[0] === '2개' ? '1개' : '2개'], ['원', cols[1] === 1 ? '직사각형' : '삼각형'], [right[2], right[2] === '직사각형' ? '삼각형' : '직사각형', '원']], pool = [];
      for (const a of alts[0]) for (const b of alts[1]) for (const c of alts[2]) pool.push([a, b, c]);
      const made = pickOrder(d, right, pool);
      return C('원기둥과 원뿔을 비교한 표이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 쓴 것은?', made.options, made.answer, {
        figure: table(['', '원기둥', '원뿔'], ROWS.map((row, i) => row.map((cell, j) => (j === cols[i] ? box(MARKS[i]) : cell)))),
        explain: '밑면은 원기둥이 2개, 원뿔이 1개이다. 위에서 본 모양은 두 도형 모두 원이고, 앞에서 본 모양은 원기둥이 직사각형, 원뿔이 삼각형이다.', facts: { truth: made.truth, want: true }
      });
    }),
    T('compare-cyl-prism', '원기둥과 각기둥', '①48 ②35 ③55 심20', (d) => say(d, '원기둥과 각기둥에 대한 설명으로 옳지 않은 것은?',
      ['원기둥과 각기둥은 모두 밑면이 2개이다.', '원기둥과 각기둥은 모두 두 밑면이 서로 평행하고 합동이다.', '각기둥에는 꼭짓점이 있지만 원기둥에는 없다.', '각기둥에는 모서리가 있지만 원기둥에는 없다.', '원기둥의 밑면은 원이고 각기둥의 밑면은 다각형이다.', '원기둥의 옆면은 굽은 면이고 각기둥의 옆면은 평평한 면이다.'],
      [['원기둥과 각기둥은 모두 꼭짓점이 있다.', '원기둥에는 꼭짓점이 없다.'], ['원기둥과 각기둥은 모두 모서리가 있다.', '원기둥에는 모서리가 없다.'], ['원기둥과 각기둥은 모두 옆면이 굽은 면이다.', '각기둥의 옆면은 평평한 면이다.'], ['원기둥과 각기둥은 모두 밑면이 다각형이다.', '원기둥의 밑면은 원이다.'],
        ['원기둥과 각기둥은 모두 위에서 본 모양이 원이다.', '각기둥을 위에서 본 모양은 다각형이다.']], false)),
    T('compare-cone-pyramid', '원뿔과 각뿔', '①50 ②35 심21', (d) => say(d, '원뿔과 각뿔의 같은 점으로 옳은 것은?', ['밑면이 1개이다.', '뿔 모양의 입체도형이다.', '꼭짓점이 있다.'],
      [['밑면의 모양이 원이다.', '각뿔의 밑면은 다각형이다.'], ['옆면이 굽은 면이다.', '각뿔의 옆면은 삼각형 모양의 평평한 면이다.'], ['모서리가 있다.', '원뿔에는 모서리가 없다.'], ['꼭짓점의 수가 같다.', '원뿔의 꼭짓점은 1개이고, 각뿔은 밑면에도 꼭짓점이 있어 여러 개이다.'], ['위에서 본 모양이 원이다.', '각뿔을 위에서 본 모양은 다각형이다.']], true,
      '원뿔과 각뿔은 모두 밑면이 1개인 뿔 모양의 입체도형이고 꼭짓점이 있다.'))
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  // 원기둥을 닮은 도형(실력용): 기본 묶음의 것보다 원기둥에 가깝게 그린다. 그래도 옆 선이 나란하지 않은 것, 윗면이 기운 것은 눈으로 가릴 수 있다.
  const NEAR = {
    frustum: { key: 'frustumNear', kind: 'frustum', art: () => one((cv) => addFrustum(cv, [0, 0], 23, 31, 46), SAID.frustum) },
    bucket: { key: 'bucketNear', kind: 'frustum', art: () => one((cv) => addFrustum(cv, [0, 0], 31, 23, 44), '위의 원이 아래의 원보다 크고 옆이 굽은 도형') },
    slant: { key: 'slantNear', kind: 'slant', art: () => one((cv) => addSlant(cv, [0, 0], 25, 50, 0.27), SAID.slant) }
  };
  // 길이를 적은 직각삼각형 ㄱㄴㄷ(직각은 ㄴ). p: 변 ㄱㄴ, q: 변 ㄴㄷ 의 길이(cm)
  function triFig(p, q) {
    const k = 92 / Math.max(p, q), cv = canvas(), A = [0, 0], Bp = [0, p * k], Cp = [q * k, p * k];
    [A, Bp, Cp].forEach(cv.point);
    cv.add('<polygon class="mb-poly" points="' + ptsOf([A, Bp, Cp]) + '"/>' + corner(Bp, A, Cp));
    cv.write([-2, -10], 'ㄱ'); cv.write([-9, p * k + 9], 'ㄴ'); cv.write([q * k + 9, p * k + 9], 'ㄷ');
    cv.write([-6 - wide(cm(p), 12) / 2, p * k / 2], cm(p), 'is-length'); cv.write([q * k / 2, p * k + 11], cm(q), 'is-length');
    return cv.out(`직각삼각형 ㄱㄴㄷ. 각 ㄴ이 직각이고 변 ㄱㄴ의 길이 ${p} cm, 변 ㄴㄷ의 길이 ${q} cm`);
  }
  B.addGroup('6-2-6', {
    id: 'hard', title: '실력 문제', standard: SOLID,
    types: [
      // ── ① 그림·상황에 함정이 있는 문제 ──
      H('hard-count-cyl', '눕혀 놓은 것·닮은 도형이 섞인 그림에서 원기둥 세기', '1·2·7, 기본 ①1 ②1 ③1', (d) => {
        // 그림에 함정을 둔다: 눕혀 놓은 원기둥과 납작한 원기둥(겉모습으로 아는 아이가 뺀다), 위아래 원의 크기가 다른 도형과 윗면이 비스듬한 도형(둥근 기둥이면 된다고 보는 아이가 넣는다).
        // 볼 것은 뜻의 조건뿐이다: 두 밑면이 서로 평행하고 합동인 원인가, 옆면이 굽은 면인가.
        const k = d.pick([2, 3]), yes = pickArt(d, ['cylLying'].concat(d.shuffle(['cylFlat', 'cylTall', 'cylMid']).slice(0, k - 1)), k), no = [NEAR.slant, NEAR.frustum].concat(k === 2 ? [NEAR.bucket] : []);
        const items = d.shuffle(yes.concat(no)), labels = TAGS.slice(0, 5), flags = items.map((it) => it.kind === 'cyl');
        const told = (it, i) => (it.key === 'cylLying' ? `${labels[i]}는 옆으로 놓여 있지만 두 밑면이 서로 평행하고 합동인 원이다. ` : it.key === 'cylFlat' ? `${labels[i]}는 높이가 낮지만 두 밑면이 서로 평행하고 합동인 원이다. ` : it.kind === 'cyl' ? '' : `${labels[i]}는 ${NOT_CYL[it.kind]}. `);
        return N('다음 입체도형 가운데 원기둥은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tiles(items.map((it) => it.art())), explain: CYL_LEAD + '놓인 방향이나 높이와 관계없이 이 조건을 모두 갖추었는지 본다. ' + items.map(told).join('') + `원기둥은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`, facts: { count: flags }
        });
      }),
      H('hard-lying-read', '눕혀 놓은 원기둥의 밑면의 지름과 높이', '7, 기본 ②9', (d) => {
        // 그림에 함정을 둔다: 원기둥을 눕혀 놓는다. 「아래에 놓인 면이 밑면, 위아래로 잰 길이가 높이」라고 보는 아이는 두 수를 바꿔 적는다.
        const [dia, len] = d.until(() => [d.int(4, 14), d.int(3, 16)], ([x, y]) => x !== y && x <= y * 2.2 && y <= x * 2.2), k = 92 / Math.max(dia, len), R = dia * k / 2, L = len * k;
        return M('다음과 같이 놓인 원기둥에서 밑면의 지름과 높이는 각각 몇 cm인가?', [{ label: '밑면의 지름', answer: dia, unit: 'cm' }, { label: '높이', answer: len, unit: 'cm' }], {
          figure: one((cv) => {
            const s = addLying(cv, [0, 0], R, L);
            cv.add(stroke([L, -R], [L, R], 'thin') + dot([L, 0], 2)); cv.write([L + s.ex + 5 + wide(cm(dia), 12) / 2, 0], cm(dia), 'is-length'); cv.write([L / 2, R + 11], cm(len), 'is-length');
          }, `옆으로 놓인 원기둥. 마주 보는 두 원의 지름 ${dia} cm, 두 원 사이의 거리 ${len} cm`),
          explain: `원기둥에서 서로 평행하고 합동인 두 원이 밑면이다. 옆으로 놓여 있어도 마주 보는 두 원이 밑면이므로 밑면의 지름은 ${dia} cm이다. 높이는 두 밑면 사이의 거리이므로 ${len} cm이다.`,
          facts: { calc: [[String(dia), 0], [String(len), 1]] }
        });
      }),
      H('hard-measure-read', '재는 그림에서 원뿔의 높이와 모선의 길이 가려 읽기', '9, 기본 ①27 ②30 ③33~35', (d) => {
        // 그림에 함정을 둔다: 좁고 높은 원뿔이라 옆면에 댄 자와 곧게 세운 자가 비슷하게 서 있고, 잰 길이도 1~2 cm 차이다. 옆면을 따라 잰 길이를 높이로 아는 아이는 두 수를 바꿔 적는다.
        const [r, h, l] = d.pick([[7, 24, 25], [5, 12, 13], [8, 15, 17]]), k = 72 / h, kinds = d.shuffle(['cone-h', 'cone-l', 'cone-d']), value = { 'cone-h': h, 'cone-l': l, 'cone-d': r * 2 }, tag = (what) => TAGS[kinds.indexOf(what)];
        return M('같은 원뿔의 길이를 세 가지 방법으로 재었다. 이 원뿔의 높이와 모선의 길이는 각각 몇 cm인가?', [{ label: '높이', answer: h, unit: 'cm' }, { label: '모선의 길이', answer: l, unit: 'cm' }], {
          figure: tiles(kinds.map((what) => measure(what, r * k, h * k, cm(value[what])))),
          explain: `높이는 꼭짓점에서 밑면에 수직으로 내린 선분의 길이이다. 자를 곧게 세우고 꼭짓점 높이에 삼각자를 댄 ${tag('cone-h')}에서 읽으면 ${h} cm이다. 모선의 길이는 옆면에 자를 대어 꼭짓점에서 밑면의 둘레까지 잰 ${tag('cone-l')}에서 읽으면 ${l} cm이다. ${tag('cone-d')}는 밑면의 지름을 잰 것이다.`,
          facts: { calc: [[String(h), 0], [String(l), 1]] }
        });
      }),
      H('hard-net-count', '어긋나게 붙은 것·돌려 그린 것·가짜가 섞인 그림에서 전개도 세기', '32, 기본 ①14 ②19 ③17', (d) => {
        // 그림에 함정을 둔다: 두 원이 어긋난 자리에 붙은 전개도와 옆으로 돌려 그린 전개도(「한가운데 위아래」만 전개도라고 보는 아이가 뺀다),
        // 두 원이 같은 변에 붙은 것·이웃한 두 변에 붙은 것·옆면이 사다리꼴인 것(원 2개와 사각형 1개면 된다고 보는 아이가 넣는다). 원의 크기를 눈대중으로 견주어야 하는 가짜는 쓰지 않는다.
        const k = d.pick([1, 2]), keys = d.shuffle(d.shuffle(['offset', 'turned']).slice(0, k).concat(d.shuffle(['side', 'trap', 'adjacent', 'sideTurned']).slice(0, 5 - k))), labels = TAGS.slice(0, 5), flags = keys.map((key) => NETS[key].net);
        return N('다음 그림 가운데 원기둥의 전개도는 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: tiles(keys.map((key) => netTile(key))),
          explain: NET_LEAD + keys.map((key, i) => `${labels[i]}는 ${NETS[key].net ? NETS[key].note : NETS[key].why}. `).join('') + `전개도는 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`, facts: { count: flags }
        });
      }, { standard: NET }),
      H('hard-net-fit', '옆면의 가로가 밑면의 둘레와 맞는 전개도 고르기', '32·33·35, 기본 ①21 ②19·28 ③28', (d) => {
        // 그림에 함정을 둔다: 세 그림 모두 합동인 원 2개가 직사각형의 위와 아래에 붙어 있어 생김새로는 가릴 수 없다. 옆면의 가로가 밑면의 둘레(지름 × 3)와 같은지를 한 번씩 셈해야 가려진다.
        const dias = d.shuffle([5, 6, 7, 8]).slice(0, 3), right = d.int(0, 2), rows = dias.map((dia, i) => ({ dia, w: i === right ? dia * 3 : dia * 3 + d.pick([-3, -2, 2, 3]) })), k = 108 / Math.max(...rows.map((x) => x.w)), labels = TAGS.slice(0, 3);
        return C('밑면의 지름과 옆면의 가로를 적은 그림 가운데 원기둥의 전개도가 될 수 있는 것은? (원주율: 3)', labels, right, {
          figure: tiles(rows.map((x) => netFig(x.dia * k / 2, x.w * k, 26, { dText: cm(x.dia), wText: cm(x.w), label: `직사각형의 위와 아래에 크기가 같은 원이 하나씩 붙은 그림. 원의 지름 ${x.dia} cm, 직사각형의 가로 ${x.w} cm` }))),
          explain: '원기둥의 전개도에서 옆면의 가로는 밑면의 둘레와 같아야 한다. ' + rows.map((x, i) => `${labels[i]}는 밑면의 둘레가 ${x.dia} × 3 = ${x.dia * 3}(cm)${x.w === x.dia * 3 ? '로 옆면의 가로와 같다' : `인데 옆면의 가로가 ${x.w} cm이다`}. `).join('') + `전개도가 될 수 있는 것은 ${labels[right]}이다.`,
          facts: { claimed: rows.map((x) => [`${x.dia}*3`, x.w]), claimedWant: true }
        });
      }, { standard: NET }),
      H('hard-turn-two', '같은 직사각형을 세로로 선 변과 가로로 놓인 변으로 돌리기', '48, 기본 ①38 ②43 ③46', (d) => {
        // 상황에 함정을 둔다: 같은 종이인데 중심이 되는 변이 다르다. 「세로가 높이, 가로가 지름」으로 읽는 아이는 나에서 틀리고, 반지름이 되는 변을 지름으로 읽는 아이는 둘 다 틀린다.
        const [a, b] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y && x * 2 !== y && y * 2 !== x && x <= y * 2 && y <= x * 2), k = 58 / Math.max(a, b);
        return M('같은 직사각형 모양의 종이를 가는 세로로 선 변을, 나는 가로로 놓인 변을 중심으로 한 바퀴 돌려 원기둥을 만들었다. 두 원기둥의 밑면의 지름과 높이는 각각 몇 cm인가?',
          [{ label: '가의 밑면의 지름', answer: a * 2, unit: 'cm' }, { label: '가의 높이', answer: b, unit: 'cm' }, { label: '나의 밑면의 지름', answer: b * 2, unit: 'cm' }, { label: '나의 높이', answer: a, unit: 'cm' }], {
            figure: tiles([spin('rect', a * k, b * k, { aText: cm(a), bText: cm(b), label: `가로 ${a} cm, 세로 ${b} cm인 직사각형. 세로로 선 변에 굵은 선이 놓여 있다${ARROW}` }), spin('rect', b * k, a * k, { flat: true, aText: cm(b), bText: cm(a), label: `가로 ${a} cm, 세로 ${b} cm인 직사각형. 가로로 놓인 변에 굵은 선이 놓여 있다${ARROW}` })]),
            explain: `중심이 되는 변이 높이가 되고, 그 변과 이웃한 변이 밑면의 반지름이 된다. 가는 높이가 ${b} cm, 밑면의 지름이 ${a} × 2 = ${a * 2}(cm)이다. 나는 높이가 ${a} cm, 밑면의 지름이 ${b} × 2 = ${b * 2}(cm)이다.`,
            facts: { calc: [[`${a}*2`, 0], [String(b), 1], [`${b}*2`, 2], [String(a), 3]], unseen: [2] }
          });
      }),
      H('hard-turn-tri-axis', '직각삼각형을 어느 변으로 돌려야 밑면이 더 큰가', '48·49, 기본 ①39·40 ②44 ③47·49', (d) => {
        // 상황에 함정을 둔다: 중심이 되는 변이 아니라 다른 변이 반지름이 된다. 보기마다 고르는 아이 —
        //  긴 변을 중심으로 돌려야 크다고 보는 아이 / 반지름이 되는 변의 길이를 지름으로 적는 아이 / 중심이 되는 변이 반지름이라고 보는 아이
        const [x, y] = d.pick([[3, 4], [6, 8], [5, 12], [9, 12], [8, 15]]), [p, q] = d.bool() ? [x, y] : [y, x], big = Math.max(p, q), small = Math.min(p, q), axis = q > p ? 'ㄱㄴ' : 'ㄴㄷ', other = q > p ? 'ㄴㄷ' : 'ㄱㄴ';
        const rows = d.shuffle([[`변 ${axis}, ${big * 2} cm`, true], [`변 ${other}, ${big * 2} cm`, false], [`변 ${axis}, ${big} cm`, false], [`변 ${other}, ${small * 2} cm`, false]]);
        return C('직각삼각형 ㄱㄴㄷ을 변 ㄱㄴ 또는 변 ㄴㄷ을 중심으로 한 바퀴 돌려 원뿔을 만들려고 한다. 밑면의 지름이 더 긴 원뿔은 어느 변을 중심으로 돌린 것이고, 그 밑면의 지름은 몇 cm인가?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: triFig(p, q),
          explain: `중심이 되는 변은 높이가 되고, 직각을 낀 다른 변이 밑면의 반지름이 된다. 변 ㄱㄴ을 중심으로 돌리면 밑면의 지름은 ${q} × 2 = ${q * 2}(cm), 변 ㄴㄷ을 중심으로 돌리면 밑면의 지름은 ${p} × 2 = ${p * 2}(cm)이다. 밑면의 지름이 더 긴 것은 변 ${axis}을 중심으로 돌린 원뿔이고, 그 지름은 ${big * 2} cm이다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }),
      H('hard-pair-len', '원기둥과 원뿔에서 길이가 같은 것 찾기', '11·12, 기본 ①56 ②31', (d) => {
        // 그림에 함정을 둔다: 원기둥에 적힌 반지름과 원뿔에 적힌 높이가 같은 수다. 보기마다 고르는 아이 —
        //  반지름을 지름으로 읽는 아이(적힌 수가 같은 것끼리 짝 짓는다) / 원뿔의 비스듬한 선(모선)을 높이로 읽는 아이 / 밑면끼리는 같다고 넘겨짚는 아이
        const [r2, h2, l2, rx] = d.pick([[3, 4, 5, 62], [6, 8, 10, 62], [9, 12, 15, 62], [8, 15, 17, 50]]), k = rx / r2, r1 = h2, h1 = l2;
        const rows = d.shuffle([['원기둥의 높이와 원뿔의 모선의 길이', true], ['원기둥의 밑면의 지름과 원뿔의 높이', false], ['원기둥의 높이와 원뿔의 높이', false], ['원기둥의 밑면의 반지름과 원뿔의 밑면의 반지름', false]]);
        return C('원기둥과 원뿔에서 길이가 서로 같은 것끼리 짝 지은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: cylFig(r1 * k, h1 * k, { r: cm(r1), h: cm(h1), label: `원기둥. 밑면의 반지름 ${r1} cm, 높이 ${h1} cm` }) + coneFig(rx, h2 * k, { h: cm(h2), l: cm(l2), r: cm(r2), label: `원뿔. 꼭짓점에서 밑면의 가운데에 수직으로 내린 점선의 길이 ${h2} cm, 꼭짓점과 밑면의 둘레의 한 점을 이은 선분의 길이 ${l2} cm, 밑면의 반지름 ${r2} cm` }),
          explain: `원기둥의 높이는 ${h1} cm이고, 원뿔의 모선의 길이도 ${l2} cm이다. 원뿔의 높이는 꼭짓점에서 밑면에 수직으로 내린 선분의 길이인 ${h2} cm이고, 원기둥의 밑면의 지름은 ${r1} × 2 = ${r1 * 2}(cm)이다. 밑면의 반지름은 원기둥이 ${r1} cm, 원뿔이 ${r2} cm이다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-turn-net', '돌려 만든 원기둥의 전개도에서 옆면의 가로와 세로', '47, 기본 ①19·38 ②21·43', (d) => {
        // 돌리는 그림에서 밑면의 반지름과 높이를 읽고(한 번), 옆면의 가로 = 밑면의 둘레, 세로 = 높이로 옮긴다(두 번). 셈은 원주 한 번이다.
        const w = d.bool() ? wheel(d, 3.14, true) : wheel(d, 3.1, true), a = w.dia / 2, b = d.until(() => heightFor(d, w.dia), (v) => v !== a && v <= a * 2.6), k = 96 / Math.max(a, b);
        return M(`직사각형 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 이 입체도형의 전개도를 그릴 때 옆면의 가로와 세로는 각각 몇 cm로 그려야 하는가? (원주율: ${w.pi})`, [field('옆면의 가로', w.around), field('옆면의 세로', b)], {
          figure: spin('rect', a * k, b * k, { aText: cm(a), bText: cm(b), label: `${SPIN_SAID.rect}${ARROW} 굵은 선에 놓인 변의 길이 ${b} cm, 그 변과 이웃한 변의 길이 ${a} cm` }),
          explain: `돌려서 만든 입체도형은 밑면의 반지름이 ${a} cm, 높이가 ${b} cm인 원기둥이다. 전개도에서 옆면의 가로는 밑면의 둘레와 같으므로 ${a} × 2 × ${w.pi} = ${w.around}(cm)이고, 옆면의 세로는 높이와 같으므로 ${b} cm이다.`,
          facts: { calc: [[`${a}*2*${w.pi}`, 0], [String(b), 1]], unseen: [2] }
        });
      }, { standard: NET }),
      H('hard-net-radius', '옆면을 둘러싼 종이에서 밑면의 반지름 구하기', '34, 기본 ①20 ②23 ③27', (d) => {
        // 옆면을 둘러싼 종이가 전개도의 옆면이라는 것을 알아보고(한 번), 가로에서 밑면의 지름을 거꾸로 구한 뒤 반으로 나눈다(두 번). 세로는 쓰지 않는 수다.
        const w = wheel(d, 3.14, true), r = w.dia / 2, h = d.until(() => d.int(6, 24), (v) => v !== r && v !== w.dia);
        return N(`높이가 ${h} cm인 원기둥 모양의 통의 옆면을 종이로 겹치지 않게 꼭 맞게 둘러쌌다. 이 종이를 떼어 펼쳤더니 가로가 ${w.around} cm, 세로가 ${h} cm인 직사각형이었다. 통의 밑면의 반지름은 몇 cm인가? (원주율: 3.14)`, r, {
          unit: 'cm', explain: `옆면을 둘러싼 종이는 전개도의 옆면과 같다. 종이의 세로 ${h} cm가 통의 높이이므로 가로 ${w.around} cm는 밑면의 둘레이다. 밑면의 지름은 ${w.around} ÷ 3.14 = ${w.dia}(cm)이고, 밑면의 반지름은 ${w.dia} ÷ 2 = ${r}(cm)이다.`,
          facts: { calc: [[`${w.around}/3.14/2`, 0]], unseen: [2] }
        });
      }, { standard: NET }),
      H('hard-net-front-square', '옆면의 가로와 앞에서 본 모양으로 원기둥의 높이 구하기', '기본 ①23', (d) => {
        // 옆면의 가로에서 밑면의 지름을 거꾸로 구하고(한 번), 앞에서 본 모양이 정사각형이므로 높이가 밑면의 지름과 같다는 것을 댄다(두 번).
        const w = wheel(d, 3.1);
        return N(`어떤 원기둥의 전개도에서 옆면의 가로는 ${w.around} cm이다. 이 원기둥을 앞에서 본 모양이 정사각형일 때, 원기둥의 높이는 몇 cm인가? (원주율: 3.1)`, w.dia, {
          unit: 'cm', explain: `옆면의 가로는 밑면의 둘레와 같으므로 밑면의 지름은 ${w.around} ÷ 3.1 = ${w.dia}(cm)이다. 원기둥을 앞에서 본 모양은 가로가 밑면의 지름, 세로가 높이인 직사각형이다. 이 직사각형이 정사각형이므로 높이는 밑면의 지름과 같은 ${w.dia} cm이다.`,
          facts: { calc: [[`${w.around}/3.1`, 0]] }
        });
      }, { standard: NET }),
      H('hard-net-square', '옆면이 정사각형인 전개도에서 높이와 길이가 같은 것', '44, 기본 ①22', (d) => pickWord(d, '어떤 원기둥의 전개도에서 옆면이 정사각형이다. 이 원기둥의 높이와 길이가 같은 것은?', '밑면의 둘레', ['밑면의 지름', '밑면의 반지름', '밑면의 지름의 2배'],
        '전개도에서 옆면의 가로는 밑면의 둘레와 같고, 옆면의 세로는 원기둥의 높이와 같다. 옆면이 정사각형이면 가로와 세로가 같으므로 원기둥의 높이는 밑면의 둘레와 같다.'), { standard: NET }),
      H('hard-view-read', '본 모양에서 입체도형과 그 길이 읽기', '5·23·24, 기본 ①45·47 ②50·54', (d) => {
        // 본 모양에서 도형을 알아내고(한 번), 본 모양의 변이 그 도형의 무엇인지 맞대어 읽는다(두 번).
        const text = '어떤 입체도형을 위, 앞, 옆에서 본 모양이다. 이 입체도형을 바르게 설명한 것은?';
        if (d.bool()) {
          const c = coneOf(d), w = 64, h = w * c.h / (c.r * 2), right = `모선의 길이가 ${c.l} cm인 원뿔이다.`;
          const options = d.shuffle([right, `높이가 ${c.l} cm인 원뿔이다.`, `밑면의 반지름이 ${c.r * 2} cm인 원뿔이다.`, `높이가 ${c.l} cm인 원기둥이다.`]);
          return C(text, options, options.indexOf(right), {
            figure: tiles([flatView('circle', w, w, { dText: cm(c.r * 2), label: `지름이 ${c.r * 2} cm인 원` }), flatView('tri', w, h, { wText: cm(c.r * 2), sText: cm(c.l), label: `밑변의 길이가 ${c.r * 2} cm이고 나머지 두 변의 길이가 ${c.l} cm인 이등변삼각형` }), flatView('tri', w, h, { label: '앞에서 본 모양과 같은 이등변삼각형' })], ['위', '앞', '옆']),
            explain: `위에서 본 모양이 원이고 앞과 옆에서 본 모양이 삼각형이므로 원뿔이다. 앞에서 본 삼각형의 밑변 ${c.r * 2} cm는 밑면의 지름이고, 비스듬한 두 변 ${c.l} cm는 모선의 길이이다. 밑면의 반지름은 ${c.r} cm이고, 높이는 모선의 길이보다 짧다.`,
            facts: { truth: options.map((o) => o === right), want: true }
          });
        }
        const r = d.int(3, 8), h = d.until(() => d.int(5, 20), (v) => v !== r && v !== r * 2 && v <= r * 3.4 && v >= r * 1.1), w = 60, hp = w * h / (r * 2), right = `밑면의 지름이 ${r * 2} cm이고 높이가 ${h} cm인 원기둥이다.`;
        const options = d.shuffle([right, `밑면의 지름이 ${r} cm이고 높이가 ${h} cm인 원기둥이다.`, `밑면의 지름이 ${r * 2} cm이고 높이가 ${h} cm인 원뿔이다.`, `밑면의 지름이 ${h} cm이고 높이가 ${r * 2} cm인 원기둥이다.`]);
        return C(text, options, options.indexOf(right), {
          figure: tiles([flatView('circle', w, w, { rText: cm(r), label: `반지름이 ${r} cm인 원` }), flatView('rect', w, hp, { hText: cm(h), label: `세로가 ${h} cm인 직사각형` }), flatView('rect', w, hp, { label: '앞에서 본 모양과 같은 직사각형' })], ['위', '앞', '옆']),
          explain: `위에서 본 모양이 원이고 앞과 옆에서 본 모양이 직사각형이므로 원기둥이다. 위에서 본 원의 반지름이 ${r} cm이므로 밑면의 지름은 ${r} × 2 = ${r * 2}(cm)이고, 앞에서 본 직사각형의 세로 ${h} cm가 높이이다.`,
          facts: { truth: options.map((o) => o === right), want: true }
        });
      }),
      H('hard-cone-equi', '앞에서 본 모양이 정삼각형인 원뿔의 모선의 길이', '24, 기본 ①47 ②54', (d) => {
        // 위에서 본 원의 반지름에서 밑면의 지름을 구하고(한 번), 앞에서 본 삼각형의 세 변이 밑면의 지름과 모선 둘이라는 것을 댄다(두 번).
        const r = d.int(3, 12);
        return N(`어떤 원뿔을 위에서 본 모양은 반지름이 ${r} cm인 원이고, 앞에서 본 모양은 정삼각형이다. 이 원뿔의 모선의 길이는 몇 cm인가?`, r * 2, {
          unit: 'cm', explain: `위에서 본 원의 지름 ${r} × 2 = ${r * 2}(cm)가 밑면의 지름이다. 원뿔을 앞에서 본 모양은 밑변이 밑면의 지름이고 나머지 두 변이 모선인 삼각형이다. 이 삼각형이 정삼각형이므로 모선의 길이는 밑면의 지름과 같은 ${r * 2} cm이다.`,
          facts: { calc: [[`${r}*2`, 0]], unseen: [2] }
        });
      }),
      H('hard-half-view', '반원을 돌려 만든 입체도형을 위와 앞에서 본 모양', '17·25·50, 기본 ②54', (d) => {
        // 돌려서 만든 도형이 구이고 그 반지름이 반원의 지름의 반이라는 것을 알아내고(한 번), 구는 어느 방향에서 보아도 크기가 같은 원이라는 것을 댄다(두 번).
        const dia = d.pick([10, 12, 14, 16, 18, 20, 24]), r = dia / 2, right = `위에서 본 모양과 앞에서 본 모양은 모두 반지름이 ${r} cm인 원이다.`;
        const options = d.shuffle([right, `위에서 본 모양과 앞에서 본 모양은 모두 반지름이 ${dia} cm인 원이다.`, `위에서 본 모양은 반지름이 ${r} cm인 원이고, 앞에서 본 모양은 반지름이 ${r} cm인 반원이다.`, `위에서 본 모양은 반지름이 ${r} cm인 원이고, 앞에서 본 모양은 그보다 작은 원이다.`]);
        return C('반원 모양의 종이를 굵은 선을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 이 입체도형을 위와 앞에서 본 모양을 바르게 설명한 것은?', options, options.indexOf(right), {
          figure: spin('half', 46, 0, { dText: cm(dia), label: `${SPIN_SAID.half}${ARROW} 반원의 지름 ${dia} cm` }),
          explain: `반원을 지름을 중심으로 돌리면 구가 되고, 구의 반지름은 반원의 반지름과 같은 ${dia} ÷ 2 = ${r}(cm)이다. 구는 어느 방향에서 보아도 크기가 같은 원 모양이고, 그 원의 반지름은 구의 반지름과 같다.`,
          facts: { truth: options.map((o) => o === right), want: true }
        });
      }),
      H('hard-two-cond', '두 도형은 같고 한 도형은 다른 것', '5·18·19, 기본 ①49·51 ②57', (d) => {
        // 보기마다 세 도형을 따로 떠올려, 두 조건(두 도형은 같다 / 나머지 한 도형은 다르다)에 모두 맞는지 따진다.
        const [text, right, wrong, why] = d.pick([
          ['원기둥과 원뿔은 서로 같고, 구만 다른 것은?', '평평한 면이 있는지', ['굽은 면이 있는지', '꼭짓점이 있는지', '위에서 본 모양', '앞에서 본 모양'], '원기둥과 원뿔에는 평평한 면이 있고 구에는 없다. 굽은 면과 위에서 본 모양은 세 도형이 모두 같고, 꼭짓점은 원뿔에만 있으며, 앞에서 본 모양은 원기둥이 직사각형, 원뿔이 삼각형으로 서로 다르다.'],
          ['원기둥과 구는 서로 같고, 원뿔만 다른 것은?', '꼭짓점이 있는지', ['굽은 면이 있는지', '평평한 면이 있는지', '위에서 본 모양', '앞에서 본 모양'], '원기둥과 구에는 꼭짓점이 없고 원뿔에는 있다. 굽은 면과 위에서 본 모양은 세 도형이 모두 같고, 평평한 면은 원기둥에는 있지만 구에는 없으며, 앞에서 본 모양은 원기둥이 직사각형, 구가 원으로 서로 다르다.']
        ]);
        return pickWord(d, text, right, d.shuffle(wrong).slice(0, 3), why);
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
