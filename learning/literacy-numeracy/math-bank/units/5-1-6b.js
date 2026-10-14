// 5학년 1학기 6단원 다각형의 둘레와 넓이 — 평행사변형, 삼각형, 사다리꼴, 마름모, 여러 도형의 넓이의 기본 문항.
// 꼴 목록(기본꼴 1~3의 「밑변·높이·대각선」「평행사변형」「삼각형」「사다리꼴」「마름모」「여러 도형」 묶음, 심화꼴의 같은 묶음)을 번호마다 따져서 실었다.
// 단원 틀과 그림 도구(B.kit.area516)는 5-1-6a.js 에 있다. 대조표는 수집본의 _분석/5-1-6/싣기_대조표.md.
//
// 싣는 기준(5-1-6a.js 에 적은 것 말고)
//  - 교육과정 「삼각형의 넓이를 구할 때는 높이가 삼각형의 외부에 있는 것도 다룬다」: 높이가 밖에 있는 둔각삼각형을 높이 고르기, 넓이 구하기, 넓이가 같은 삼각형 찾기에 모두 넣었다.
//    밑변을 늘인 선은 점선으로, 높이는 점선과 직각 표시로 그린다.
//  - 교육과정 「도형의 변형을 이용하여 넓이를 구하는 여러 가지 방법을 추론하게 한다」: 잘라 옮겨 붙이기(평행사변형 → 직사각형, 삼각형 → 평행사변형),
//    똑같은 도형 2개 붙이기(삼각형·사다리꼴 → 평행사변형), 나누기(사다리꼴 → 삼각형 둘), 둘러싸기(마름모 → 직사각형의 반)를 도형마다 한 번씩 실었다.
//  - 밑변과 높이가 같으면 모양이 달라도 넓이가 같다는 것은 모눈 위의 도형 넷 가운데 넓이가 다른 하나를 찾는 꼴로 실었다(평행사변형, 삼각형, 사다리꼴).
//
// 뺀 것과 까닭(이 파일의 다섯 묶음)
//  - 높이·대각선 긋기, 넓이가 같은 도형 그리기, 도형을 완성하거나 잘라 그리기(①47·57·77 ②63·71·85·86 ③92·93 심66·98·111): 작도.
//    「넓이에 맞게 그리기」는 모눈 위의 네 도형 가운데 넓이가 맞는 것 고르기로 바꾸어 실었다. 마름모의 대각선 긋기는 대각선의 뜻(4-2-4)이다.
//  - 방법·까닭 쓰기(①54·62·66의 쓰는 부분 ②62·73·88의 까닭 ③54·63·80의 까닭, ③94 심59·85의 쓰는 부분): 서술형
//  - 길이가 몇 배면 넓이가 몇 배인지를 규칙으로 묻는 것(①55 ②93): 넓이의 비(6학년)와 닮음(중학교)의 일이다.
//  - 바르게(잘못) 구한 사람 고르기(①52·66의 변형 ③72·81 심58·67의 변형): 넓이를 한 번 구하는 일을 고르기로 바꾼 것이라 싣지 않았다. 같은 함정은 그림에 넣어 실력에 실었다.
//  - 셈이 아니라 절반 관계를 알아채야 하거나 이어 붙인 둘레에서 변을 풀어내는 것(②56·57), 겹친 삼각형·마름모에서 무엇을 빼고 더할지 가리는 것(심81·110, ③74),
//    세 겹 도형에서 안쪽 대각선을 거슬러 찾는 것(심105), 거꾸로 풀기를 두 번 넘게 잇는 것(심92·94): 지나치게 꼬인 문제
//  - 접어 자른 종이를 펼친 마름모(심107): 펼친 모양을 대칭으로 떠올려야 한다(합동과 대칭, 5-2).
//  - 수집본에 그림이 없어 얼개를 알 수 없는 것(②55·65의 변형 ③84, ②92·③87의 그림 속 수): 지어내지 않았다.
//  - 앞 학년 되짚기(③95)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C, tagged } = B.kit;
  const G = B.kit.geo;
  const { TAGS, MARKS, len, calc, setOptions, say, pickWord, mid, centre, scene, styled, tint, ghost, dashed, thin, word, beside, outside, edges, height, dim, gp, polyBoard, tiles } = B.kit.area516;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const GRID = '모눈 한 칸의 넓이는 1 cm²이다. ';
  const white = (pts) => styled(G.polygon(pts), 'fill:#fff');
  const names = (pts, list) => G.vertexLabels(pts, list);
  // 넷 가운데 넓이가 다른 하나: same 에서 셋, odd 에서 하나를 골라 섞는다. draw(자료)는 작은 모눈 그림, expr(자료)는 넓이 식.
  function oddOne(d, text, same, odd, draw, expr, explain) {
    const rows = d.shuffle(d.shuffle(same).slice(0, 3).map((r) => [r, false]).concat([[d.pick(odd), true]])), at = rows.findIndex((r) => r[1]);
    return C(GRID + text, TAGS.slice(0, 4), at, { figure: tiles(rows.map((r) => draw(r[0]))), explain: explain(rows.map((r) => r[0]), at), facts: { choose: { exprs: rows.map((r) => expr(r[0])), rule: 'odd' }, unseen: [2] } });
  }

  // ── 평행사변형 ───────────────────────────────────────────────
  B.addTypes('5-1-6', 'para', [
    T('para-word', '평행사변형의 밑변과 높이의 뜻', '①43', (d) => pickWord(d, '평행사변형에서 평행한 두 변을 밑변이라고 한다. 두 밑변 사이의 거리를 무엇이라고 하는가?', '높이', ['둘레', '대각선', '넓이'], '평행사변형에서 평행한 두 변을 밑변이라 하고, 두 밑변 사이의 거리를 높이라고 한다.')),
    T('para-talk', '평행사변형의 밑변과 높이에 대한 설명', '①48', (d) => say(d, '평행사변형의 밑변과 높이에 대한 설명으로 옳지 않은 것은?',
      ['평행한 두 변을 밑변이라고 한다.', '두 밑변 사이의 거리를 높이라고 한다.', '높이는 밑변에 수직인 선분의 길이이다.', '어느 변을 밑변으로 정하는가에 따라 높이가 달라진다.'],
      ['비스듬한 변의 길이가 높이이다.', '높이는 밑변과 수직으로 만나지 않아도 된다.', '밑변이 될 수 있는 변은 아래쪽에 놓인 변 하나뿐이다.'], false,
      '평행사변형에서 평행한 두 변이 밑변이고, 두 밑변 사이의 거리가 높이이다. 높이는 밑변에 수직인 선분의 길이이므로 비스듬한 변의 길이와 다르다. 마주 보는 변은 어느 쌍이나 밑변이 될 수 있고, 밑변에 따라 높이가 정해진다.')),
    T('para-height-pick', '평행사변형의 높이를 나타내는 선분 고르기', '①44 ②49 심56', (d) => {
      // 위아래 두 변 사이에 수직인 선분과 비스듬한 선분을 섞어 긋고, 밑변을 늘인 선 위(평행사변형 밖)에도 수직인 선분을 하나 긋는다.
      const b = 6, h = 3.2, s = 1.8, mirror = d.bool(), mx = ([x, y]) => [mirror ? b + s - x : x, y];
      const kinds = d.shuffle(d.bool() ? ['perp', 'slant', 'slant'] : ['perp', 'perp', 'slant']), xs = [2.4, 3.9, 5.4], lean = d.pick([-1, 1]) * 0.8;
      const segs = kinds.map((kind, i) => { const off = kind === 'perp' ? 0 : lean; return { perp: kind === 'perp', top: mx([xs[i] + off / 2, 0]), bottom: mx([xs[i] - off / 2, h]) }; })
        .concat([{ perp: true, out: true, top: mx([b + s, 0]), bottom: mx([b + s, h]) }]).sort((p, q) => p.top[0] - q.top[0]);
      const labels = MARKS.slice(0, 4), flags = segs.map((seg) => seg.perp), made = setOptions(d, labels, flags), quad = [[s, 0], [0, h], [b, h], [b + s, 0]].map(mx);
      const raw = quad.concat([mx([b, h])], segs.reduce((all, seg) => all.concat([seg.top, seg.bottom]), []));
      return C('평행사변형에서 아래쪽에 놓인 변을 밑변으로 할 때, 높이를 나타내는 선분을 모두 고른 것은?', made.options, made.answer, {
        figure: scene(raw, (p) => {
          const parts = [G.polygon(p.slice(0, 4))];
          segs.forEach((seg, i) => {
            const top = p[5 + i * 2], bottom = p[6 + i * 2];
            if (seg.out) parts.push(dashed(p[4], bottom));
            parts.push(dashed(top, bottom), G.text([top[0], top[1] - 0.45], labels[i]));
            if (seg.perp) parts.push(G.rightMark(bottom, top, seg.out ? p[4] : [bottom[0] + 1, bottom[1]]));
          });
          return parts;
        }, { box: [6.6, 2.9], pad: [0.9, 1.0], label: `평행사변형의 위쪽 변과 아래쪽 변(또는 아래쪽 변을 늘인 선) 사이에 그은 선분 ${labels.join(', ')}. 직각 표시가 있는 선분: ${labels.filter((_, i) => flags[i]).join(', ')}` }),
        explain: `높이는 두 밑변 사이의 거리이므로 밑변에 수직인 선분의 길이이다. 밑변이나 밑변을 늘인 선과 직각으로 만나는 선분은 ${labels.filter((_, i) => flags[i]).join(', ')}이다. 비스듬한 선분은 높이가 아니다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('para-cut', '평행사변형을 잘라 직사각형으로 바꾸기', '①50 ②50 ③51', (d) => {
      const b = d.int(4, 6), h = d.int(2, 4), s = d.int(1, 2), pts = [[s, 0], [0, h], [b, h], [b + s, 0]];
      return M('모눈 한 칸의 길이는 1 cm이다. 평행사변형의 왼쪽 삼각형을 점선을 따라 잘라 오른쪽에 옮겨 붙이면 직사각형이 된다. 이 직사각형의 가로와 세로, 평행사변형의 넓이를 차례로 구하시오.',
        [{ label: '가로', answer: b, unit: 'cm' }, { label: '세로', answer: h, unit: 'cm' }, { label: '넓이', answer: b * h, unit: 'cm²' }], {
          figure: polyBoard(pts, b + s + 2, h + 2, `모눈종이 위의 평행사변형. 밑변 ${b}칸, 높이 ${h}칸. 왼쪽 삼각형을 잘라 오른쪽에 붙이면 가로 ${b}칸, 세로 ${h}칸인 직사각형이 된다.`, 1.1, (move) => [dashed(move([s, 0]), move([s, h])), ghost([[b + s, 0], [b + s, h], [b, h]].map(move))]),
          explain: `만든 직사각형의 가로는 평행사변형의 밑변과 같은 ${b} cm, 세로는 높이와 같은 ${h} cm이다. 평행사변형의 넓이는 직사각형의 넓이와 같으므로 ${b} × ${h} = ${b * h}(cm²)이다.`,
          facts: { calc: [[String(b), 0], [String(h), 1], [`${b}*${h}`, 2]] }
        });
    }),
    T('para-area', '평행사변형의 넓이', '①51 ②51 ③50 심57', (d) => {
      const [b, h] = d.until(() => [d.int(7, 22), d.int(5, 15)], ([x, y]) => x !== y);
      return N(`밑변의 길이가 ${b} cm, 높이가 ${h} cm인 평행사변형 모양 카드의 넓이는 몇 cm²인가?`, b * h, { unit: 'cm²', explain: `평행사변형의 넓이는 (밑변의 길이) × (높이)이다. ${b} × ${h} = ${b * h}(cm²)`, facts: calc(`${b}*${h}`) });
    }),
    T('para-area-fig', '그림에서 밑변과 높이를 읽어 평행사변형의 넓이 구하기', '①51 ②51 ③50 심57', (d) => {
      const b = d.int(9, 16), h = d.int(5, 9), s = d.int(2, 4), flip = d.bool(), raw = [[s, 0], [0, h], [b, h], [b + s, 0], [s, h]].map(([x, y]) => [flip ? b + s - x : x, y]);
      return N('평행사변형 모양 밭의 넓이는 몇 m²인가?', b * h, {
        unit: 'm²', figure: scene(raw, (p) => [G.polygon(p.slice(0, 4)), outside(p.slice(0, 4), 1, len(b, 'm')), height(p[0], p[4], p[2], len(h, 'm'), edges(p.slice(0, 4)))], { label: `밑변 ${b} m, 높이 ${h} m인 평행사변형. 높이는 점선과 직각 표시로 나타냈다.` }),
        explain: `평행사변형의 넓이는 (밑변의 길이) × (높이)이다. ${b} × ${h} = ${b * h}(m²)`, facts: calc(`${b}*${h}`)
      });
    }),
    T('para-to-side', '넓이에서 평행사변형의 밑변이나 높이 구하기', '①53 ②52 ③52 심26', (d) => {
      const [b, h] = d.until(() => [d.int(6, 16), d.int(4, 14)], ([x, y]) => x !== y), base = d.bool();
      return N(base ? `넓이가 ${b * h} cm²이고 높이가 ${h} cm인 평행사변형의 밑변의 길이는 몇 cm인가?` : `넓이가 ${b * h} cm²이고 밑변의 길이가 ${b} cm인 평행사변형의 높이는 몇 cm인가?`, base ? b : h, {
        unit: 'cm', explain: `(밑변의 길이) × (높이) = ${b * h}이다. ${b * h} ÷ ${base ? h : b} = ${base ? b : h}(cm)`, facts: calc(`${b * h}/${base ? h : b}`)
      });
    }),
    T('para-same', '밑변과 높이가 같은 평행사변형 찾기', '①54 ②53·88 ③54·56 심59', (d) => {
      const h = d.pick([2, 3, 4]), two = [0, 1, 2, -1, -2].map((lean) => [2, lean]), three = [0, 1, -1].map((lean) => [3, lean]), swap = d.bool();
      const art = ([b, lean]) => polyBoard(lean >= 0 ? [[lean, 0], [0, h], [b, h], [b + lean, 0]] : [[0, 0], [-lean, h], [b - lean, h], [b, 0]], 4, h, `밑변 ${b}칸, 높이 ${h}칸인 평행사변형`);
      return oddOne(d, '넓이가 나머지 셋과 다른 평행사변형은?', swap ? three : two, swap ? two : three, art, ([b]) => `${b}*${h}`,
        (rows, at) => `평행사변형의 넓이는 (밑변의 길이) × (높이)이므로 밑변과 높이가 같으면 모양이 달라도 넓이가 같다. 네 평행사변형의 높이는 모두 ${h} cm이고 밑변의 길이는 ${rows.map((r, i) => `${TAGS[i]} ${r[0]} cm`).join(', ')}이다. ${TAGS[at]}만 밑변의 길이가 다르다.`);
    }),
    T('para-rearrange', '잘라 붙여 만든 평행사변형의 넓이', '②55 심62', (d) => {
      const s = d.int(6, 15);
      return N(`한 변의 길이가 ${s} cm인 정사각형 모양 종이를 두 조각으로 잘라 겹치지 않게 다시 이어 붙여 평행사변형을 만들었다. 만든 평행사변형의 넓이는 몇 cm²인가?`, s * s, {
        unit: 'cm²', explain: `잘라서 옮겨 붙여도 넓이는 달라지지 않는다. 평행사변형의 넓이는 처음 정사각형의 넓이와 같은 ${s} × ${s} = ${s * s}(cm²)이다.`, facts: calc(`${s}*${s}`)
      });
    })
  ]);

  // ── 삼각형 ───────────────────────────────────────────────────
  B.addTypes('5-1-6', 'tri', [
    T('tri-height-pick', '삼각형의 높이를 나타내는 선분 고르기', '①45·48 ②58', (d, n) => {
      // n = 0: 높이가 삼각형 안에 있다. n = 1: 둔각삼각형이라 높이가 밖에 있다(밑변을 늘인 선에 수직).
      // 보기: 꼭짓점 ㄱ에서 밑변에 수직으로 그은 선분(높이), 꼭짓점 ㄱ과 밑변의 한가운데를 이은 선분, 다른 꼭짓점에서 다른 변에 수직으로 그은 선분
      const [pb, pc, pa] = n === 0 ? [[0, 4], [6, 4], [1.6, 0]] : [[0, 4], [4, 4], [6.6, 0]], W = n === 0 ? 6 : 6.6, mirror = d.bool(), mx = ([x, y]) => [mirror ? W - x : x, y];
      const [from, s1, s2] = n === 0 ? [pb, pa, pc] : [pc, pb, pa], u = G.sub(s2, s1), t = G.dot(G.sub(from, s1), u) / G.len2(u), other = [s1[0] + u[0] * t, s1[1] + u[1] * t];
      const kinds = d.shuffle(['height', 'middle', 'other']), at = kinds.indexOf('height');
      return C('삼각형 ㄱㄴㄷ에서 변 ㄴㄷ을 밑변으로 할 때, 높이를 나타내는 선분은?', MARKS.slice(0, 3), at, {
        figure: scene([pb, pc, pa, [pa[0], 4], [(pb[0] + pc[0]) / 2, 4], other, from].map(mx), (p) => {
          const parts = [G.polygon(p.slice(0, 3)), names(p.slice(0, 3), ['ㄴ', 'ㄷ', 'ㄱ'])];
          if (n === 1) parts.push(dashed(p[1], p[3]));
          kinds.forEach((kind, i) => {
            if (kind === 'height') parts.push(dashed(p[2], p[3]), G.rightMark(p[3], p[2], p[1]), G.text([p[3][0], p[3][1] + 0.5], MARKS[i]));
            if (kind === 'middle') parts.push(dashed(p[2], p[4]), G.text([p[4][0], p[4][1] + 0.5], MARKS[i]));
            if (kind === 'other') parts.push(dashed(p[6], p[5]), G.rightMark(p[5], p[6], n === 0 ? p[1] : p[0]), G.text(G.beyond(p[6], p[5], 0.45), MARKS[i]));
          });
          return parts;
        }, { box: [6, 3.6], pad: [1.2, 1.0], label: `삼각형 ㄱㄴㄷ과 선분 셋. ${kinds.map((kind, i) => MARKS[i] + ': ' + ({ height: `꼭짓점 ㄱ에서 변 ㄴㄷ${n ? '을 늘인 선' : ''}에 수직으로 그은 선분`, middle: '꼭짓점 ㄱ과 변 ㄴㄷ의 한가운데를 이은 선분', other: `꼭짓점 ${n ? 'ㄷ' : 'ㄴ'}에서 변 ${n ? 'ㄱㄴ' : 'ㄱㄷ'}에 수직으로 그은 선분` }[kind])).join(' / ')}` }),
        explain: `변 ㄴㄷ을 밑변으로 할 때의 높이는 꼭짓점 ㄱ에서 변 ㄴㄷ${n ? '을 늘인 선' : ''}에 수직으로 그은 선분의 길이이다. ${MARKS[at]}이 그 선분이다. ${n ? '높이는 삼각형의 밖에 있을 수도 있다. ' : ''}다른 변에 수직인 선분은 그 변을 밑변으로 할 때의 높이이다.`,
        facts: { truth: kinds.map((kind) => kind === 'height'), want: true, rule: n ? 'tri-pick-out' : 'tri-pick-in' }
      });
    }, { count: 2 }),
    T('tri-double', '삼각형 2개로 만든 평행사변형으로 넓이 구하기', '①57 ②59 ③57', (d) => {
      const b = d.int(6, 14), h = d.until(() => d.int(4, 9), (v) => (b * v) % 2 === 0), s = d.int(2, 4);
      return M('똑같은 삼각형 2개를 이어 붙여 평행사변형 ㄱㄴㄷㄹ을 만들었다. 평행사변형 ㄱㄴㄷㄹ의 넓이와 삼각형 ㄱㄴㄷ의 넓이를 차례로 구하시오.', [{ label: '평행사변형', answer: b * h, unit: 'cm²' }, { label: '삼각형', answer: (b * h) / 2, unit: 'cm²' }], {
        figure: scene([[s, 0], [0, h], [b, h], [b + s, 0], [b + s, h]], (p) => [G.polygon(p.slice(0, 4)), thin(p[0], p[2]), dashed(p[2], p[4]), height(p[3], p[4], p[2], len(h), [p[4][0] + 2, p[4][1]]), outside(p.slice(0, 4), 1, len(b)), G.text([p[0][0] - 0.4, p[0][1] - 0.4], 'ㄱ'), G.text([p[1][0] - 0.45, p[1][1] + 0.35], 'ㄴ'), G.text([p[2][0] + 0.1, p[2][1] + 0.5], 'ㄷ'), G.text([p[3][0] + 0.4, p[3][1] - 0.4], 'ㄹ')],
          { box: [5.4, 3.4], pad: [2, 1.05], label: `평행사변형 ㄱㄴㄷㄹ과 선분 ㄱㄷ. 변 ㄴㄷ ${b} cm, 높이 ${h} cm(변 ㄴㄷ을 늘인 선에 점선과 직각 표시로 나타냈다).` }),
        explain: `평행사변형의 넓이는 ${b} × ${h} = ${b * h}(cm²)이다. 삼각형 ㄱㄴㄷ은 평행사변형의 반이므로 ${b * h} ÷ 2 = ${(b * h) / 2}(cm²)이다.`,
        facts: { calc: [[`${b}*${h}`, 0], [`${b}*${h}/2`, 1]], unseen: [2] }
      });
    }),
    T('tri-cut-talk', '삼각형을 잘라 만든 평행사변형', '①57 심68', (d) => {
      const a = d.pick([2, 4]), move = ([x, y]) => [x + 1, y + 1];
      const figure = G.board(8 + a / 2, 6, [gp([[a, 0], [0, 4], [6, 4]].map(move)), dashed(move([a / 2, 2]), move([(6 + a) / 2, 2])), ghost([[(6 + a) / 2, 2], [6 + a / 2, 2], [6, 4]].map(move))], { grid: 'lines', scale: 1.08, label: '모눈종이 위의 삼각형. 밑변 6칸, 높이 4칸. 높이의 반(2칸)에서 밑변과 평행하게 자른 위쪽 조각을 돌려 오른쪽에 붙이면 밑변 6칸, 높이 2칸인 평행사변형이 된다.' });
      return say(d, '모눈 한 칸의 길이는 1 cm이다. 삼각형을 높이의 반이 되는 곳에서 밑변과 평행하게 자르고, 위쪽 조각을 돌려 옆에 붙여 평행사변형을 만들었다. 옳지 않은 설명은?',
        ['평행사변형의 밑변의 길이는 삼각형의 밑변의 길이와 같은 6 cm이다.', '평행사변형의 높이는 삼각형의 높이의 반인 2 cm이다.', '삼각형의 넓이는 평행사변형의 넓이와 같은 12 cm²이다.'],
        ['평행사변형의 높이는 삼각형의 높이와 같은 4 cm이다.', '삼각형의 넓이는 평행사변형의 넓이의 2배이다.', '삼각형의 넓이는 6 × 4 = 24(cm²)이다.'], false,
        '잘라 옮겨 붙여도 넓이는 달라지지 않는다. 만든 평행사변형은 밑변이 6 cm, 높이가 삼각형의 높이의 반인 2 cm이므로 넓이는 6 × 2 = 12(cm²)이고, 삼각형의 넓이도 12 cm²이다.', figure);
    }),
    T('tri-area', '삼각형의 넓이', '①58 ②60 ③58·59 심67', (d) => {
      const [b, h] = d.until(() => [d.int(6, 24), d.int(5, 18)], ([x, y]) => x !== y && (x * y) % 2 === 0);
      return N(`밑변의 길이가 ${b} cm, 높이가 ${h} cm인 삼각형 모양 깃발의 넓이는 몇 cm²인가?`, (b * h) / 2, { unit: 'cm²', explain: `삼각형의 넓이는 (밑변의 길이) × (높이) ÷ 2이다. ${b} × ${h} ÷ 2 = ${(b * h) / 2}(cm²)`, facts: calc(`${b}*${h}/2`, [2]) });
    }),
    T('tri-area-fig', '그림에서 밑변과 높이를 읽어 삼각형의 넓이 구하기', '①45·58 ②60 ③58 심67·70', (d, n) => {
      const flip = d.bool();
      if (n === 2) {
        const [a, b] = d.until(() => [d.int(5, 10), d.int(7, 14)], ([x, y]) => (x * y) % 2 === 0 && y > x), raw = [[0, 0], [0, a], [b, a]].map(([x, y]) => [flip ? b - x : x, y]);
        return N('직각삼각형의 넓이는 몇 cm²인가?', (a * b) / 2, {
          unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p), G.rightMark(p[1], p[0], p[2]), outside(p, 0, len(a)), outside(p, 1, len(b))], { label: `직각을 낀 두 변의 길이가 ${a} cm, ${b} cm인 직각삼각형` }),
          explain: `직각을 낀 두 변 가운데 하나를 밑변으로 하면 다른 하나가 높이이다. ${b} × ${a} ÷ 2 = ${(a * b) / 2}(cm²)`, facts: calc(`${b}*${a}/2`, [2])
        });
      }
      const b = n === 0 ? d.int(10, 16) : d.int(6, 10), h = d.until(() => d.int(5, 9), (v) => (b * v) % 2 === 0), x = n === 0 ? Math.round(b * 0.3) : b + Math.max(3, Math.round(b * 0.4)), W = Math.max(b, x);
      const raw = [[0, h], [b, h], [x, 0], [x, h]].map(([u, v]) => [flip ? W - u : u, v]);
      return N('삼각형의 넓이는 몇 cm²인가?', (b * h) / 2, {
        unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p.slice(0, 3)), outside(p.slice(0, 3), 0, len(b))].concat(n === 0 ? [height(p[2], p[3], p[1], len(h), edges(p.slice(0, 3)))] : [dashed(p[1], p[3]), height(p[2], p[3], p[1], len(h), [p[3][0] * 2 - p[1][0], p[3][1]])]),
          { box: [5.6, 3.6], pad: [2, 1.05], label: n === 0 ? `밑변 ${b} cm, 높이 ${h} cm인 삼각형. 높이는 삼각형 안에 점선과 직각 표시로 나타냈다.` : `밑변 ${b} cm, 높이 ${h} cm인 둔각삼각형. 높이는 삼각형 밖에, 밑변을 늘인 점선에 수직인 점선과 직각 표시로 나타냈다.` }),
        explain: (n === 0 ? '삼각형의 넓이는 (밑변의 길이) × (높이) ÷ 2이다. 밑변에 수직인 점선의 길이가 높이이다. ' : '높이는 꼭짓점에서 밑변을 늘인 선에 수직으로 그은 선분의 길이이다. 높이가 삼각형의 밖에 있어도 넓이를 구하는 방법은 같다. ') + `${b} × ${h} ÷ 2 = ${(b * h) / 2}(cm²)`,
        facts: Object.assign(calc(`${b}*${h}/2`, [2]), { rule: n === 0 ? 'tri-in' : 'tri-out' })
      });
    }, { count: 3 }),
    T('tri-to-side', '넓이에서 삼각형의 밑변이나 높이 구하기', '①59 ②61 ③60 심71', (d) => {
      const [b, h] = d.until(() => [d.int(6, 18), d.int(4, 15)], ([x, y]) => x !== y && (x * y) % 2 === 0), base = d.bool(), area = (b * h) / 2;
      return N(base ? `넓이가 ${area} cm²이고 높이가 ${h} cm인 삼각형의 밑변의 길이는 몇 cm인가?` : `넓이가 ${area} cm²이고 밑변의 길이가 ${b} cm인 삼각형의 높이는 몇 cm인가?`, base ? b : h, {
        unit: 'cm', explain: `(밑변의 길이) × (높이) ÷ 2 = ${area}이므로 (밑변의 길이) × (높이) = ${area} × 2 = ${b * h}이다. ${b * h} ÷ ${base ? h : b} = ${base ? b : h}(cm)`, facts: calc(`${area}*2/${base ? h : b}`, [2])
      });
    }),
    T('tri-same', '밑변과 높이가 같은 삼각형 찾기', '①54 ②62·88 ③63·64 심70', (d) => {
      // [밑변의 길이, 밑변이 시작하는 자리, 위 꼭짓점의 자리]. 위 꼭짓점이 밑변 밖에 있는 것은 높이가 밖에 있는 둔각삼각형이다.
      const two = [[2, 0, 1], [2, 1, 0], [2, 0, 4], [2, 2, 2], [2, 1, 4], [2, 2, 0]], three = [[3, 0, 2], [3, 1, 1], [3, 0, 4], [3, 1, 0]], swap = d.bool();
      const art = ([b, x0, ax]) => polyBoard([[x0, 4], [x0 + b, 4], [ax, 0]], 4, 4, `밑변 ${b}칸, 높이 4칸인 삼각형`);
      return oddOne(d, '넓이가 나머지 셋과 다른 삼각형은?', swap ? three : two, swap ? two : three, art, ([b]) => `${b}*4/2`,
        (rows, at) => `삼각형의 넓이는 (밑변의 길이) × (높이) ÷ 2이므로 밑변과 높이가 같으면 모양이 달라도 넓이가 같다. 네 삼각형의 높이는 모두 4 cm이고(높이가 삼각형의 밖에 있는 것도 있다) 밑변의 길이는 ${rows.map((r, i) => `${TAGS[i]} ${r[0]} cm`).join(', ')}이다. ${TAGS[at]}만 밑변의 길이가 다르다.`);
    })
  ]);

  // ── 사다리꼴 ─────────────────────────────────────────────────
  B.addTypes('5-1-6', 'trap', [
    T('trap-word', '사다리꼴의 밑변과 높이의 뜻', '①46 ②66', (d) => pickWord(d, '사다리꼴에서 평행한 두 변을 밑변이라 하고, 위치에 따라 윗변, 아랫변이라고 한다. 두 밑변 사이의 거리를 무엇이라고 하는가?', '높이', ['둘레', '대각선', '옆변'], '사다리꼴에서 평행한 두 변을 밑변이라 하고 두 밑변 사이의 거리를 높이라고 한다.')),
    T('trap-read', '사다리꼴의 윗변, 아랫변, 높이 읽기', '①46 ②66', (d) => {
      const a = d.int(1, 3), b = d.int(4, 6), h = d.until(() => d.int(2, 4), (v) => v !== a && v !== b), x = d.int(0, b - a), up = d.bool(), top = up ? a : b, bottom = up ? b : a;
      const pts = up ? [[x, 0], [0, h], [b, h], [x + a, 0]] : [[0, 0], [x, h], [x + a, h], [b, 0]];
      return M('모눈 한 칸의 길이는 1 cm이다. 사다리꼴의 윗변의 길이, 아랫변의 길이, 높이를 차례로 구하시오.', [{ label: '윗변', answer: top, unit: 'cm' }, { label: '아랫변', answer: bottom, unit: 'cm' }, { label: '높이', answer: h, unit: 'cm' }], {
        figure: polyBoard(pts, b + 2, h + 2, `모눈종이 위의 사다리꼴. 위쪽 변 ${top}칸, 아래쪽 변 ${bottom}칸, 두 변 사이는 ${h}칸`, 1.1),
        explain: `평행한 두 변 가운데 위에 있는 변이 윗변, 아래에 있는 변이 아랫변이다. 윗변은 ${top} cm, 아랫변은 ${bottom} cm이고, 두 밑변 사이의 거리인 높이는 ${h} cm이다.`,
        facts: { calc: [[String(top), 0], [String(bottom), 1], [String(h), 2]] }
      });
    }),
    T('trap-double', '사다리꼴 2개로 만든 평행사변형으로 넓이 구하기', '①61 ②68 ③76', (d) => {
      const a = d.int(4, 7), b = a + d.int(2, 5), h = d.until(() => d.int(5, 9), (v) => ((a + b) * v) % 2 === 0), x = d.int(1, 2);
      return M('똑같은 사다리꼴 2개를 이어 붙여 평행사변형을 만들었다. 평행사변형의 밑변의 길이, 평행사변형의 넓이, 사다리꼴 한 개의 넓이를 차례로 구하시오.',
        [{ label: '밑변', answer: a + b, unit: 'cm' }, { label: '평행사변형', answer: (a + b) * h, unit: 'cm²' }, { label: '사다리꼴', answer: ((a + b) * h) / 2, unit: 'cm²' }], {
          figure: scene([[x, 0], [0, h], [b, h], [x + a, 0], [a + b + x, 0], [a + b, h], [x, h]], (p) => [tint(p.slice(0, 4)), ghost([p[3], p[4], p[5], p[2]]), height(p[0], p[6], p[2], len(h), edges(p.slice(0, 4))),
            beside(p[0], p[3], len(a), [p[0][0], p[0][1] - 2]), beside(p[3], p[4], len(b), [p[3][0], p[3][1] - 2]), beside(p[1], p[2], len(b), [p[1][0], p[1][1] + 2]), beside(p[2], p[5], len(a), [p[2][0], p[2][1] + 2])],
          { box: [7.4, 3.2], pad: [0.9, 1.0], label: `윗변 ${a} cm, 아랫변 ${b} cm, 높이 ${h} cm인 사다리꼴과, 그것을 돌려 옆에 붙인 똑같은 사다리꼴(점선). 두 개를 붙이면 평행사변형이 된다.` }),
          explain: `평행사변형의 밑변은 윗변과 아랫변을 더한 ${a} + ${b} = ${a + b}(cm)이고 넓이는 ${a + b} × ${h} = ${(a + b) * h}(cm²)이다. 사다리꼴은 그 반이므로 ${(a + b) * h} ÷ 2 = ${((a + b) * h) / 2}(cm²)이다.`,
          facts: { calc: [[`${a}+${b}`, 0], [`(${a}+${b})*${h}`, 1], [`(${a}+${b})*${h}/2`, 2]], unseen: [2] }
        });
    }),
    T('trap-split', '사다리꼴을 삼각형 둘로 나누어 넓이 구하기', '①62 ②67 ③77 심85', (d) => {
      const [b, x, h] = d.until(() => [d.int(8, 14), d.int(2, 5), d.pick([4, 6, 8])], ([w, v, z]) => ((z * (w - v)) / (3 * w)) * Math.min(5.6 / w, 3.4 / z) >= 0.52), a = b - x, flip = d.bool(), raw = [[x, 0], [0, h], [b, h], [b, 0]].map(([u, v]) => [flip ? b - u : u, v]);
      return M('사다리꼴을 삼각형 가와 나로 나누었다. 삼각형 가의 넓이, 삼각형 나의 넓이, 사다리꼴의 넓이를 차례로 구하시오.', [{ label: '가', answer: (a * h) / 2, unit: 'cm²' }, { label: '나', answer: (b * h) / 2, unit: 'cm²' }, { label: '사다리꼴', answer: ((a + b) * h) / 2, unit: 'cm²' }], {
        figure: scene(raw, (p) => [G.polygon(p), thin(p[1], p[3]), G.rightMark(p[2], p[1], p[3]), G.rightMark(p[3], p[0], p[2]), outside(p, 3, len(a)), outside(p, 1, len(b)), outside(p, 2, len(h)), G.text(centre([p[0], p[1], p[3]]), '가'), G.text(centre([p[1], p[2], p[3]]), '나')],
          { box: [5.6, 3.4], label: `윗변 ${a} cm, 아랫변 ${b} cm, 높이 ${h} cm인 사다리꼴을 대각선으로 나눈 삼각형 가(윗변 쪽)와 나(아랫변 쪽)` }),
        explain: `두 삼각형의 높이는 모두 사다리꼴의 높이인 ${h} cm이다. 가는 ${a} × ${h} ÷ 2 = ${(a * h) / 2}(cm²), 나는 ${b} × ${h} ÷ 2 = ${(b * h) / 2}(cm²)이므로 사다리꼴의 넓이는 ${(a * h) / 2} + ${(b * h) / 2} = ${((a + b) * h) / 2}(cm²)이다.`,
        facts: { calc: [[`${a}*${h}/2`, 0], [`${b}*${h}/2`, 1], [`${a}*${h}/2+${b}*${h}/2`, 2]], unseen: [2] }
      });
    }),
    T('trap-area', '사다리꼴의 넓이', '①63 ②69 ③75·76 심84', (d) => {
      const [a, b, h] = d.until(() => [d.int(5, 16), d.int(8, 22), d.int(4, 14)], ([x, y, z]) => y > x + 1 && ((x + y) * z) % 2 === 0), area = ((a + b) * h) / 2;
      return N(`윗변의 길이가 ${a} m, 아랫변의 길이가 ${b} m, 높이가 ${h} m인 사다리꼴 모양 텃밭의 넓이는 몇 m²인가?`, area, { unit: 'm²', explain: `사다리꼴의 넓이는 ((윗변의 길이) + (아랫변의 길이)) × (높이) ÷ 2이다. (${a} + ${b}) × ${h} ÷ 2 = ${area}(m²)`, facts: calc(`(${a}+${b})*${h}/2`, [2]) });
    }),
    T('trap-area-fig', '그림에서 윗변, 아랫변, 높이를 읽어 사다리꼴의 넓이 구하기', '①63 ②69 ③75 심84', (d, n) => {
      const a = d.int(5, 8), b = a + d.int(4, 7), h = d.until(() => d.int(5, 8), (v) => ((a + b) * v) % 2 === 0), flip = d.bool(), mx = ([u, v]) => [flip ? b - u : u, v], area = ((a + b) * h) / 2;
      const x = n === 0 ? d.int(2, 3) : 0, raw = [[x, 0], [0, h], [b, h], [x + a, 0], [x, h]].map(mx);
      return N('사다리꼴의 넓이는 몇 cm²인가?', area, {
        unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p.slice(0, 4)), outside(p.slice(0, 4), 3, len(a)), outside(p.slice(0, 4), 1, len(b))].concat(n === 0 ? [height(p[0], p[4], p[2], len(h), edges(p.slice(0, 4)))] : [G.rightMark(p[0], p[1], p[3]), G.rightMark(p[1], p[0], p[2]), outside(p.slice(0, 4), 0, len(h))]),
          { box: [5.6, 3.4], label: n === 0 ? `윗변 ${a} cm, 아랫변 ${b} cm, 높이 ${h} cm인 사다리꼴. 높이는 점선과 직각 표시로 나타냈다.` : `윗변 ${a} cm, 아랫변 ${b} cm인 사다리꼴. 두 밑변과 직각으로 만나는 변의 길이 ${h} cm` }),
        explain: (n === 0 ? '사다리꼴의 넓이는 ((윗변의 길이) + (아랫변의 길이)) × (높이) ÷ 2이다. ' : `두 밑변에 수직인 변의 길이 ${h} cm가 높이이다. `) + `(${a} + ${b}) × ${h} ÷ 2 = ${area}(cm²)`, facts: Object.assign(calc(`(${a}+${b})*${h}/2`, [2]), { rule: n === 0 ? 'trap-dash' : 'trap-right' })
      });
    }, { count: 2 }),
    T('trap-to-height', '넓이에서 사다리꼴의 높이 구하기', '①64 ②70 ③78 심88', (d) => {
      const [a, b, h] = d.until(() => [d.int(4, 14), d.int(6, 20), d.int(4, 12)], ([x, y, z]) => y > x && ((x + y) * z) % 2 === 0), area = ((a + b) * h) / 2;
      return N(`넓이가 ${area} cm²이고 윗변의 길이가 ${a} cm, 아랫변의 길이가 ${b} cm인 사다리꼴의 높이는 몇 cm인가?`, h, {
        unit: 'cm', explain: `(${a} + ${b}) × (높이) ÷ 2 = ${area}이므로 ${a + b} × (높이) = ${area} × 2 = ${area * 2}이다. ${area * 2} ÷ ${a + b} = ${h}(cm)`, facts: calc(`${area}*2/(${a}+${b})`, [2])
      });
    }),
    T('trap-same', '높이와 두 밑변의 길이의 합이 같은 사다리꼴 찾기', '①65 ②88 ③80 심87', (d) => {
      // [윗변의 길이, 윗변이 시작하는 자리, 아랫변의 길이, 아랫변이 시작하는 자리]
      const five = [[1, 1, 4, 0], [1, 3, 4, 0], [2, 0, 3, 0], [2, 1, 3, 1], [3, 0, 2, 1], [4, 0, 1, 2], [3, 1, 2, 0]], other = [[1, 0, 3, 0], [1, 2, 3, 1], [3, 0, 1, 1], [2, 1, 4, 0], [2, 0, 4, 0], [4, 0, 2, 2]], h = d.pick([2, 4]);
      const art = ([a, xa, b, xb]) => polyBoard([[xa, 0], [xb, h], [xb + b, h], [xa + a, 0]], 4, h, `윗변 ${a}칸, 아랫변 ${b}칸, 높이 ${h}칸인 사다리꼴`);
      return oddOne(d, '넓이가 나머지 셋과 다른 사다리꼴은?', five, other, art, ([a, , b]) => `(${a}+${b})*${h}/2`,
        (rows, at) => `사다리꼴의 넓이는 ((윗변의 길이) + (아랫변의 길이)) × (높이) ÷ 2이므로 높이와 두 밑변의 길이의 합이 같으면 넓이가 같다. 높이는 모두 ${h} cm이고 두 밑변의 길이의 합은 ${rows.map((r, i) => `${TAGS[i]} ${r[0] + r[2]} cm`).join(', ')}이다. ${TAGS[at]}만 합이 다르다.`);
    })
  ]);

  // ── 마름모 ───────────────────────────────────────────────────
  // 마름모 [위, 오른쪽, 아래, 왼쪽]와 그것을 둘러싸는 직사각형의 꼭짓점 [왼쪽 위, 오른쪽 위, 오른쪽 아래, 왼쪽 아래]
  const rhombus = (p, q) => [[p / 2, 0], [p, q / 2], [p / 2, q], [0, q / 2]], around = (p, q) => [[0, 0], [p, 0], [p, q], [0, q]];
  B.addTypes('5-1-6', 'rhom', [
    T('rhom-wrap', '마름모를 둘러싼 직사각형으로 넓이 구하기', '①68 ②76 ③67', (d) => {
      const [p, q] = d.until(() => [d.int(6, 14), d.int(4, 10)], ([x, y]) => x > y && (x * y) % 2 === 0);
      return M('마름모의 네 꼭짓점을 지나는 직사각형을 점선으로 그렸다. 직사각형의 넓이와 마름모의 넓이를 차례로 구하시오.', [{ label: '직사각형', answer: p * q, unit: 'cm²' }, { label: '마름모', answer: (p * q) / 2, unit: 'cm²' }], {
        figure: scene(around(p, q).concat(rhombus(p, q)), (v) => [ghost(v.slice(0, 4)), tint(v.slice(4)), outside(v.slice(0, 4), 2, len(p)), outside(v.slice(0, 4), 1, len(q))], { box: [5.6, 3.6], label: `마름모와 그것을 둘러싸는 직사각형(점선). 직사각형의 가로 ${p} cm, 세로 ${q} cm` }),
        explain: `직사각형의 넓이는 ${p} × ${q} = ${p * q}(cm²)이다. 마름모의 넓이는 직사각형의 넓이의 반이므로 ${p * q} ÷ 2 = ${(p * q) / 2}(cm²)이다.`, facts: { calc: [[`${p}*${q}`, 0], [`${p}*${q}/2`, 1]], unseen: [2] }
      });
    }),
    T('rhom-area', '마름모의 넓이', '①69 ②77 ③65·66 심99', (d) => {
      const [p, q] = d.until(() => [d.int(6, 22), d.int(5, 18)], ([x, y]) => x !== y && (x * y) % 2 === 0);
      return N(`두 대각선의 길이가 ${p} cm, ${q} cm인 마름모의 넓이는 몇 cm²인가?`, (p * q) / 2, { unit: 'cm²', explain: `마름모의 넓이는 (한 대각선의 길이) × (다른 대각선의 길이) ÷ 2이다. ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)`, facts: calc(`${p}*${q}/2`, [2]) });
    }),
    T('rhom-area-fig', '그림에서 두 대각선의 길이를 읽어 마름모의 넓이 구하기', '①69 ②77 ③65 심99', (d) => {
      const [p, q] = d.until(() => [d.int(8, 18), d.int(6, 12)], ([x, y]) => x > y + 1 && (x * y) % 2 === 0);
      return N('마름모 모양 표지판의 넓이는 몇 cm²인가?', (p * q) / 2, {
        unit: 'cm²', figure: scene(rhombus(p, q).concat(around(p, q)), (v) => [G.polygon(v.slice(0, 4)), dashed(v[3], v[1]), dashed(v[0], v[2]), dim(v[7], v[6], v[0], len(p)), dim(v[5], v[6], v[3], len(q))], { box: [4.8, 3.4], pad: [2.3, 1.3], label: `가로로 놓인 대각선 ${p} cm, 세로로 놓인 대각선 ${q} cm인 마름모` }),
        explain: `마름모의 넓이는 (한 대각선의 길이) × (다른 대각선의 길이) ÷ 2이다. ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)`, facts: calc(`${p}*${q}/2`, [2])
      });
    }),
    T('rhom-to-diag', '넓이에서 마름모의 다른 대각선 구하기', '①70 ②78 ③70 심101', (d) => {
      const [p, q] = d.until(() => [d.int(6, 25), d.int(6, 20)], ([x, y]) => x !== y && (x * y) % 2 === 0), area = (p * q) / 2;
      return N(`넓이가 ${area} cm²이고 한 대각선의 길이가 ${p} cm인 마름모의 다른 대각선의 길이는 몇 cm인가?`, q, {
        unit: 'cm', explain: `${p} × (다른 대각선의 길이) ÷ 2 = ${area}이므로 ${p} × (다른 대각선의 길이) = ${area} × 2 = ${p * q}이다. ${p * q} ÷ ${p} = ${q}(cm)`, facts: calc(`${area}*2/${p}`, [2])
      });
    }),
    T('rhom-mid', '사각형의 네 변의 가운데를 이은 마름모', '①71·75 ②80 ③68 심104', (d, n) => {
      if (n === 1) {
        const s = d.pick([8, 10, 12, 14, 16, 20]);
        return N(`한 변의 길이가 ${s} cm인 정사각형의 네 변의 가운데를 이어 사각형을 그렸다. 색칠한 부분의 넓이는 몇 cm²인가?`, (s * s) / 2, {
          unit: 'cm²', figure: scene(around(s, s).concat(rhombus(s, s)), (v) => [tint(v.slice(0, 4)), white(v.slice(4)), outside(v.slice(0, 4), 2, len(s))], { box: [3.6, 3.6], pad: [1.9, 1.05], label: `한 변의 길이가 ${s} cm인 정사각형. 네 변의 가운데를 이은 사각형의 바깥쪽 네 귀퉁이를 색칠했다.` }),
          explain: `안쪽 사각형은 두 대각선의 길이가 모두 ${s} cm인 마름모이므로 넓이는 ${s} × ${s} ÷ 2 = ${(s * s) / 2}(cm²)이다. 색칠한 부분은 ${s} × ${s} − ${(s * s) / 2} = ${(s * s) / 2}(cm²)이다.`, facts: calc(`${s}*${s}-${s}*${s}/2`, [2])
        });
      }
      const [p, q] = d.until(() => [d.int(8, 18), d.int(6, 14)], ([x, y]) => x > y + 1 && (x * y) % 2 === 0);
      return N(`가로가 ${p} cm, 세로가 ${q} cm인 직사각형의 네 변의 가운데를 이어 마름모를 그렸다. 마름모의 넓이는 몇 cm²인가?`, (p * q) / 2, {
        unit: 'cm²', figure: scene(around(p, q).concat(rhombus(p, q)), (v) => [styled(G.polygon(v.slice(0, 4)), 'fill:#fff'), tint(v.slice(4)), outside(v.slice(0, 4), 2, len(p)), outside(v.slice(0, 4), 1, len(q))], { box: [5.4, 3.6], label: `가로 ${p} cm, 세로 ${q} cm인 직사각형과 네 변의 가운데를 이은 마름모` }),
        explain: `마름모의 두 대각선의 길이는 직사각형의 가로, 세로와 같은 ${p} cm, ${q} cm이다. ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)`, facts: calc(`${p}*${q}/2`, [2])
      });
    }, { count: 2 }),
    T('rhom-piece', '마름모의 한 조각에서 전체 넓이 구하기', '①72 ②81 ③73 심103', (d, n) => {
      const t = d.int(6, 24), p = d.pick([6, 7, 8]), q = d.pick([4, 5]), raw = rhombus(p, q).concat([[p / 2, q / 2]]);
      if (n === 1) return N(`마름모 ㄱㄴㄷㄹ에서 삼각형 ㄱㄴㄷ의 넓이가 ${t} cm²일 때 마름모 ㄱㄴㄷㄹ의 넓이는 몇 cm²인가?`, t * 2, {
        unit: 'cm²', figure: scene(raw, (v) => [G.polygon(v.slice(0, 4)), tint([v[0], v[3], v[2]]), G.text([v[0][0], v[0][1] - 0.45], 'ㄱ'), G.text([v[3][0] - 0.45, v[3][1]], 'ㄴ'), G.text([v[2][0], v[2][1] + 0.45], 'ㄷ'), G.text([v[1][0] + 0.45, v[1][1]], 'ㄹ')], { box: [4.6, 3.2], pad: [1.2, 1.0], label: `마름모 ㄱㄴㄷㄹ과 대각선 ㄱㄷ. 삼각형 ㄱㄴㄷ을 색칠했다. 색칠한 삼각형의 넓이 ${t} cm²` }),
        explain: `대각선 ㄱㄷ은 마름모를 넓이가 같은 삼각형 2개로 나눈다. ${t} × 2 = ${t * 2}(cm²)`, facts: calc(`${t}*2`, [2])
      });
      const k = d.int(0, 3);
      return N(`마름모에 두 대각선을 그어 삼각형 4개로 나누었다. 색칠한 삼각형의 넓이가 ${t} cm²일 때 마름모의 넓이는 몇 cm²인가?`, t * 4, {
        unit: 'cm²', figure: scene(raw, (v) => [G.polygon(v.slice(0, 4)), tint([v[k], v[(k + 1) % 4], v[4]]), thin(v[0], v[2]), thin(v[1], v[3])], { box: [4.6, 3.2], pad: [1.2, 0.8], label: `두 대각선을 그은 마름모. 삼각형 4개 가운데 하나를 색칠했다. 색칠한 삼각형의 넓이 ${t} cm²` }),
        explain: `마름모의 두 대각선은 마름모를 넓이가 같은 삼각형 4개로 나눈다. ${t} × 4 = ${t * 4}(cm²)`, facts: calc(`${t}*4`, [4])
      });
    }, { count: 2 }),
    T('rhom-compare', '대각선의 길이로 마름모의 넓이 비교', '①74 ②90 ③71 심100', (d) => {
      // 두 대각선의 길이의 합이 같아도 넓이는 다르다.
      const sum = d.pick([21, 23, 25, 27, 29, 31, 33]), ps = d.shuffle(Array.from({ length: 7 }, (_, i) => Math.floor(sum / 2) - i)).slice(0, 4), rows = ps.map((p) => [p, sum - p]).map((r) => (d.bool() ? r : [r[1], r[0]]));
      const values = rows.map(([p, q]) => (p * q) / 2), at = values.indexOf(Math.max(...values));
      return C('두 대각선의 길이가 다음과 같은 마름모 가운데 넓이가 가장 넓은 것은?', MARKS.slice(0, 4), at, {
        figure: tagged(rows.map(([p, q]) => `${p} cm, ${q} cm`), MARKS), explain: `넓이를 차례로 구하면 ${rows.map(([p, q], i) => `${MARKS[i]} ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)`).join(', ')}이다. 두 대각선의 길이의 합이 같아도 넓이는 다르다. 가장 넓은 것은 ${MARKS[at]}이다.`,
        facts: { choose: { exprs: rows.map(([p, q]) => `${p}*${q}/2`), rule: 'max' }, unseen: [2] }
      });
    })
  ]);

  // ── 여러 도형 ────────────────────────────────────────────────
  const FORMULAS = [
    ['정사각형', '(한 변의 길이) × (한 변의 길이)', ['(한 변의 길이) × 4', '(한 변의 길이) × 2', '(한 변의 길이) + (한 변의 길이)'], '(한 변의 길이) × 4는 정사각형의 둘레를 구하는 식이다.'],
    ['평행사변형', '(밑변의 길이) × (높이)', ['(밑변의 길이) × (높이) ÷ 2', '(밑변의 길이) × (이웃한 변의 길이)', '((밑변의 길이) + (높이)) × 2'], '평행사변형을 잘라 옮겨 붙이면 가로가 밑변, 세로가 높이인 직사각형이 된다.'],
    ['삼각형', '(밑변의 길이) × (높이) ÷ 2', ['(밑변의 길이) × (높이)', '((밑변의 길이) + (높이)) ÷ 2', '(세 변의 길이의 합) ÷ 2'], '똑같은 삼각형 2개를 이어 붙이면 밑변과 높이가 같은 평행사변형이 되므로 그 넓이의 반이다.'],
    ['사다리꼴', '((윗변의 길이) + (아랫변의 길이)) × (높이) ÷ 2', ['((윗변의 길이) + (아랫변의 길이)) × (높이)', '(윗변의 길이) × (아랫변의 길이) ÷ 2', '((윗변의 길이) + (아랫변의 길이)) ÷ 2'], '똑같은 사다리꼴 2개를 이어 붙이면 밑변이 (윗변) + (아랫변)인 평행사변형이 되므로 그 넓이의 반이다.'],
    ['마름모', '(한 대각선의 길이) × (다른 대각선의 길이) ÷ 2', ['(한 대각선의 길이) × (다른 대각선의 길이)', '(한 변의 길이) × (한 변의 길이)', '((한 대각선의 길이) + (다른 대각선의 길이)) × 2'], '마름모를 둘러싸는 직사각형의 가로와 세로가 두 대각선의 길이와 같고, 마름모의 넓이는 그 직사각형의 넓이의 반이다.']
  ];
  B.addTypes('5-1-6', 'mix', [
    T('mix-formula', '넓이를 구하는 식', '①24 ②84 ③26·51·59·66·76', (d, n) => {
      const [shape, right, wrongs, why] = FORMULAS[n];
      return pickWord(d, `${shape}의 넓이를 구하는 식은?`, right, wrongs, `${shape}의 넓이는 ${right}로 구한다. ${why}`);
    }, { count: 5 }),
    T('mix-worded', '말로 준 길이를 풀어 넓이 구하기', '①73 ②89 ③82 심67·86', (d, n) => {
      if (n === 1) {
        const [p, k] = d.until(() => [d.int(12, 24), d.int(3, 8)], ([x, y]) => (x * (x - y)) % 2 === 0), q = p - k;
        return N(`한 대각선의 길이가 ${p} cm이고 다른 대각선의 길이는 그보다 ${k} cm 더 짧은 마름모의 넓이는 몇 cm²인가?`, (p * q) / 2, {
          unit: 'cm²', explain: `다른 대각선의 길이는 ${p} − ${k} = ${q}(cm)이다. ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)`, facts: calc(`${p}*(${p}-${k})/2`, [2])
        });
      }
      const [a, k, h] = d.until(() => [d.int(6, 14), d.int(2, 6), d.int(5, 13)], ([x, y, z]) => ((x * 2 + y) * z) % 2 === 0), b = a + k, area = ((a + b) * h) / 2;
      return N(`윗변의 길이가 ${a} cm이고 아랫변의 길이는 윗변보다 ${k} cm 더 긴 사다리꼴이 있다. 높이가 ${h} cm일 때 이 사다리꼴의 넓이는 몇 cm²인가?`, area, {
        unit: 'cm²', explain: `아랫변의 길이는 ${a} + ${k} = ${b}(cm)이다. (${a} + ${b}) × ${h} ÷ 2 = ${area}(cm²)`, facts: calc(`(${a}+${a}+${k})*${h}/2`, [2])
      });
    }, { count: 2 }),
    T('mix-diff', '서로 다른 두 도형의 넓이의 차', '①75 ②91 ③87 심75·97', (d) => {
      const [pb, ph, a, b, h] = d.until(() => [d.int(6, 12), d.int(5, 10), d.int(3, 8), d.int(6, 12), d.int(6, 12)], ([v, w, x, y, z]) => y > x && ((x + y) * z) % 2 === 0 && Math.abs(v * w - ((x + y) * z) / 2) >= 2 && Math.abs(v * w - ((x + y) * z) / 2) <= 14);
      const pa = pb * ph, ta = ((a + b) * h) / 2, big = pa > ta;
      return N(`밑변의 길이가 ${pb} cm, 높이가 ${ph} cm인 평행사변형 가와 윗변의 길이가 ${a} cm, 아랫변의 길이가 ${b} cm, 높이가 ${h} cm인 사다리꼴 나가 있다. 두 도형의 넓이의 차는 몇 cm²인가?`, Math.abs(pa - ta), {
        unit: 'cm²', explain: `가의 넓이는 ${pb} × ${ph} = ${pa}(cm²), 나의 넓이는 (${a} + ${b}) × ${h} ÷ 2 = ${ta}(cm²)이다. ${Math.max(pa, ta)} − ${Math.min(pa, ta)} = ${Math.abs(pa - ta)}(cm²)`,
        facts: calc(big ? `${pb}*${ph}-(${a}+${b})*${h}/2` : `(${a}+${b})*${h}/2-${pb}*${ph}`, [2])
      });
    }),
    T('mix-most', '서로 다른 도형 가운데 가장 넓은 것', '①75 ②91 ③85·86 심97', (d) => {
      const made = d.until(() => {
        const pb = d.int(6, 10), ph = d.int(5, 8), tb = d.int(9, 16), th = d.int(8, 12), p = d.int(10, 18), q = d.int(7, 12);
        return [[`밑변의 길이가 ${pb} cm, 높이가 ${ph} cm인 평행사변형`, `${pb}*${ph}`, pb * ph], [`밑변의 길이가 ${tb} cm, 높이가 ${th} cm인 삼각형`, `${tb}*${th}/2`, (tb * th) / 2], [`두 대각선의 길이가 ${p} cm, ${q} cm인 마름모`, `${p}*${q}/2`, (p * q) / 2]];
      }, (rows) => rows.every((r) => Number.isInteger(r[2])) && new Set(rows.map((r) => r[2])).size === 3 && Math.max(...rows.map((r) => r[2])) - Math.min(...rows.map((r) => r[2])) <= 12);
      const rows = d.shuffle(made), values = rows.map((r) => r[2]), at = values.indexOf(Math.max(...values));
      return C('넓이가 가장 넓은 도형은?', MARKS.slice(0, 3), at, {
        figure: tagged(rows.map((r) => r[0]), MARKS), explain: `넓이를 차례로 구하면 ${rows.map((r, i) => `${MARKS[i]} ${r[2]} cm²`).join(', ')}이다. 삼각형과 마름모는 곱한 뒤 2로 나누어야 한다. 가장 넓은 것은 ${MARKS[at]}이다.`,
        facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'max' }, unseen: [2] }
      });
    }),
    T('mix-many', '똑같은 도형 여러 개의 넓이', '①58 ②74 ③89 심67', (d) => {
      const [b, h] = d.until(() => [d.int(6, 14), d.int(5, 12)], ([x, y]) => (x * y) % 2 === 0 && x !== y), k = d.pick([4, 6]);
      return N(`밑변의 길이가 ${b} cm, 높이가 ${h} cm인 삼각형 모양 색종이 ${k}장을 겹치지 않게 이어 붙여 바람개비를 만들었다. 바람개비를 만든 색종이 ${k}장의 넓이는 모두 몇 cm²인가?`, (b * h) / 2 * k, {
        unit: 'cm²', explain: `색종이 한 장의 넓이는 ${b} × ${h} ÷ 2 = ${(b * h) / 2}(cm²)이다. ${k}장의 넓이는 ${(b * h) / 2} × ${k} = ${(b * h) / 2 * k}(cm²)이다.`, facts: calc(`${b}*${h}/2*${k}`, [2])
      });
    }),
    T('mix-compose', '직사각형과 삼각형으로 나누어 구하는 넓이', '①78 ②94 ③90 심96', (d) => {
      const W = d.pick([8, 10, 12]), R = d.int(4, 7), t = d.int(3, 5), area = W * R + (W * t) / 2;
      return N('점선을 따라 직사각형과 삼각형으로 나눌 수 있는 도형이다. 이 도형의 넓이는 몇 cm²인가?', area, {
        unit: 'cm²', figure: scene([[W / 2, 0], [W, t], [W, t + R], [0, t + R], [0, t], [0, 0]], (p) => [G.polygon(p.slice(0, 5)), dashed(p[4], p[1]), outside(p.slice(0, 5), 2, len(W)), outside(p.slice(0, 5), 1, len(R)), dim(p[5], p[4], p[1], len(t), 0.45)],
          { box: [4.4, 4.2], pad: [2.3, 1.05], label: `직사각형 위에 삼각형을 얹은 모양의 오각형. 직사각형의 가로 ${W} cm, 세로 ${R} cm, 삼각형의 밑변은 직사각형의 가로와 같고 높이는 ${t} cm` }),
        explain: `직사각형의 넓이는 ${W} × ${R} = ${W * R}(cm²), 삼각형의 넓이는 ${W} × ${t} ÷ 2 = ${(W * t) / 2}(cm²)이다. ${W * R} + ${(W * t) / 2} = ${area}(cm²)`, facts: calc(`${W}*${R}+${W}*${t}/2`, [2])
      });
    }),
    T('mix-minus', '큰 도형에서 빼어 구하는 색칠한 부분의 넓이', '①78 ②95 ③91 심80·95', (d) => {
      const [W, H, t] = d.until(() => { const w = d.pick([10, 12, 14, 16]), hh = d.int(6, 9); return [w, hh, d.int(3, hh - 2)]; }, ([w, hh, v]) => { const k = Math.min(5.4 / w, 3.6 / hh); return v * k * (1 - 1.75 / (0.75 * w * k)) >= 1; }), flip = d.bool(), area = W * H - (W * t) / 2;
      const raw = [[0, 0], [W, 0], [W, H], [0, H], [W / 4, H - t], [W / 4, H]].map(([x, y]) => [flip ? W - x : x, y]);
      return N('직사각형 안에 삼각형을 그렸다. 색칠한 부분의 넓이는 몇 cm²인가?', area, {
        unit: 'cm²', figure: scene(raw, (p) => [tint(p.slice(0, 4)), white([p[3], p[2], p[4]]), height(p[4], p[5], p[2], len(t), edges([p[3], p[2], p[4]])), outside(p.slice(0, 4), 2, len(W)), outside(p.slice(0, 4), flip ? 3 : 1, len(H))],
          { box: [5.4, 3.6], label: `가로 ${W} cm, 세로 ${H} cm인 직사각형 안에 직사각형의 아래쪽 변을 밑변으로 하고 높이가 ${t} cm인 삼각형을 그리고, 삼각형 밖을 색칠했다.` }),
        explain: `직사각형의 넓이에서 삼각형의 넓이를 뺀다. ${W} × ${H} − ${W} × ${t} ÷ 2 = ${W * H} − ${(W * t) / 2} = ${area}(cm²)`, facts: calc(`${W}*${H}-${W}*${t}/2`, [2])
      });
    }),
    T('mix-grid-pick', '넓이가 정해진 도형 고르기', '①77 ②86 ③93 심111', (d) => {
      // 모눈 위의 평행사변형 [밑변, 높이, 기운 칸], 삼각형 [밑변, 높이, 위 꼭짓점], 사다리꼴 [윗변, 아랫변, 높이, 윗변의 자리], 마름모 [가로 대각선, 세로 대각선]
      const kinds = [
        [[[2, 3, 1], [3, 2, 1], [2, 4, 1], [3, 4, 1], [2, 2, 2], [3, 3, 1]], ([b, h, s]) => [[s, 0], [0, h], [b, h], [b + s, 0]], ([b, h]) => [`밑변 ${b}칸, 높이 ${h}칸인 평행사변형`, `${b}*${h}`, b * h]],
        [[[4, 4, 1], [4, 3, 3], [3, 4, 0], [2, 4, 2], [4, 2, 1]], ([b, h, ax]) => [[0, h], [b, h], [ax, 0]], ([b, h]) => [`밑변 ${b}칸, 높이 ${h}칸인 삼각형`, `${b}*${h}/2`, (b * h) / 2]],
        [[[2, 4, 4, 1], [1, 3, 4, 1], [2, 4, 2, 0], [1, 3, 2, 2], [2, 4, 3, 1]], ([a, b, h, x]) => [[x, 0], [0, h], [b, h], [x + a, 0]], ([a, b, h]) => [`윗변 ${a}칸, 아랫변 ${b}칸, 높이 ${h}칸인 사다리꼴`, `(${a}+${b})*${h}/2`, ((a + b) * h) / 2]],
        [[[4, 4], [4, 2], [2, 4]], ([p, q]) => rhombus(p, q), ([p, q]) => [`두 대각선이 ${p}칸, ${q}칸인 마름모`, `${p}*${q}/2`, (p * q) / 2]]
      ];
      const rows = d.until(() => d.shuffle(kinds.map(([pool, points, tell]) => { const pick = d.pick(pool); return { pts: points(pick), told: tell(pick) }; })), (list) => new Set(list.map((r) => r.told[2])).size === 4);
      const at = d.int(0, 3), target = rows[at].told[2];
      return C(`모눈 한 칸의 넓이는 1 cm²이다. 네 도형 가운데 넓이가 ${target} cm²인 것은?`, TAGS.slice(0, 4), at, {
        figure: tiles(rows.map((r) => polyBoard(r.pts, 4, 4, r.told[0]))), explain: `넓이를 차례로 구하면 ${rows.map((r, i) => `${TAGS[i]} ${r.told[2]} cm²`).join(', ')}이다. 삼각형, 사다리꼴, 마름모는 곱한 뒤 2로 나눈다. 넓이가 ${target} cm²인 것은 ${TAGS[at]}이다.`,
        facts: { choose: { exprs: rows.map((r) => r.told[1]), rule: 'equals', target }, unseen: [2] }
      });
    }),
    T('mix-rhom-both', '마름모의 둘레와 넓이', '①79 심99', (d) => {
      const [x, y, s] = d.pick([[4, 3, 5], [8, 6, 10], [12, 5, 13], [12, 9, 15], [15, 8, 17]]), p = x * 2, q = y * 2;
      return M('마름모의 둘레와 넓이를 구하시오.', [{ label: '둘레', answer: s * 4, unit: 'cm' }, { label: '넓이', answer: (p * q) / 2, unit: 'cm²' }], {
        figure: scene(rhombus(p, q).concat(around(p, q)), (v) => [G.polygon(v.slice(0, 4)), dashed(v[3], v[1]), dashed(v[0], v[2]), outside(v.slice(0, 4), 3, len(s)), dim(v[7], v[6], v[0], len(p)), dim(v[5], v[6], v[3], len(q))], { box: [4.8, 3.4], pad: [2.3, 1.3], label: `한 변의 길이 ${s} cm, 가로로 놓인 대각선 ${p} cm, 세로로 놓인 대각선 ${q} cm인 마름모` }),
        explain: `둘레는 변의 길이를 모두 더한 것이므로 ${s} × 4 = ${s * 4}(cm)이다. 넓이는 두 대각선의 길이로 구하므로 ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)이다.`, facts: { calc: [[`${s}*4`, 0], [`${p}*${q}/2`, 1]], unseen: [4, 2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
