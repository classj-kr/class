// 3학년 1학기 2단원 평면도형 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 10종의 평가 자료(단원평가·형성평가·수학익힘·수행평가 221개 문서)에 나온 문제 꼴을 모아 합친
// 통합 목록(84꼴)에서 고른 것이다. 꼴과 조건은 그 문제를 따르고 그림과 문장만 새로 만든다. 유형마다 통합 목록의 번호를 적어 둔다.
// (천재 박만구 교과서는 이 단원이 1단원이라 그 책의 자료는 1단원 폴더에서 가져왔다.)
//
// 고른 기준
//  - 그림만 다르거나 말만 다른 꼴은 한 번만 싣는다. 「찾기」는 도형마다(직각삼각형·직사각형·정사각형) 하나씩 둔다.
//  - 그리기 문제는 싣지 않는다. 보기에서 고르게 바꿀 수 있는 것만 고르기로 바꾸어 싣는다
//    (선분의 두 끝과 이어 직각삼각형이 되는 점, 직사각형이 되게 꼭짓점을 옮길 자리).
//  - 까닭 쓰기·다른 점 쓰기 같은 서술형, 놀이·만들기 활동은 싣지 않는다.
//  - 물건 사진·삼각자 그림처럼 그림을 그대로 옮겨야 하는 꼴은 싣지 않는다.
//  - 겹쳐 세기나 변의 길이를 이어 셈하는 꼴은 실력 문항으로 보냈다(3-1-2b.js).
// 도형은 모두 모눈의 점 위에 꼭짓점을 두고 그린다. 직각인지 아닌지는 눈대중이 아니라 셈(내적 0)으로 정하고,
// 직각처럼 보이지만 직각이 아닌 각(76°~104°)은 쓰지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, expr, tagged, N, M, C } = B.kit;
  const G = B.kit.geo;
  const LINE = '4수03-01', ANGLE = '4수03-02', RTRI = '4수03-09', QUAD = '4수03-10';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(통합 목록 ' + ref + '번)', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마'];
  const CIRCLED = ['①', '②', '③', '④'];
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';

  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags) {
    const key = (list) => list.join(', ');
    const right = labels.filter((_, i) => flags[i]);
    const pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  // 도형을 판 가운데에 놓아 그린다.
  function centered(points, cols, rows) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    const dx = Math.floor((cols - Math.max(...xs) - Math.min(...xs)) / 2), dy = Math.floor((rows - Math.max(...ys) - Math.min(...ys)) / 2);
    return points.map((p) => [p[0] + dx, p[1] + dy]);
  }
  const shapeTile = (points, cols, rows, grid) => G.board(cols, rows, [G.polygon(centered(points, cols, rows))], { grid });

  // ── 그림 감 ──────────────────────────────────────────────────
  // 삼각형: [꼭짓점 셋]
  const TRI_RIGHT = [[[0, 0], [0, 3], [4, 3]], [[0, 3], [4, 3], [4, 0]], [[0, 2], [2, 0], [4, 2]], [[1, 0], [4, 1], [0, 3]], [[0, 0], [3, 0], [0, 3]]];
  const TRI_OTHER = [[[0, 3], [2, 0], [4, 3]], [[0, 3], [1, 0], [4, 3]], [[0, 3], [3, 0], [4, 3]], [[0, 3], [4, 3], [2, 2]]];
  // 사각형
  const RECTS = [[[0, 0], [4, 0], [4, 2], [0, 2]], [[0, 0], [2, 0], [2, 4], [0, 4]], [[1, 0], [4, 3], [3, 4], [0, 1]], [[0, 0], [3, 0], [3, 2], [0, 2]]];
  const SQUARES = [[[0, 0], [3, 0], [3, 3], [0, 3]], [[1, 0], [3, 1], [2, 3], [0, 2]], [[2, 0], [4, 2], [2, 4], [0, 2]], [[0, 0], [2, 0], [2, 2], [0, 2]]];
  const QUAD_OTHER = [[[1, 0], [4, 0], [3, 3], [0, 3]], [[1, 0], [3, 0], [4, 3], [0, 3]], [[0, 0], [2, 0], [4, 3], [0, 3]]];
  const RHOMBUS = [[0, 1], [2, 0], [4, 1], [2, 2]];
  // 각: [꼭짓점, 지나는 점, 지나는 점]
  const ANGLE_RIGHT = [[[0, 3], [0, 0], [3, 3]], [[1, 3], [0, 1], [3, 2]], [[3, 3], [0, 3], [3, 0]], [[2, 3], [0, 1], [4, 1]]];
  const ANGLE_OTHER = [[[0, 3], [2, 0], [3, 3]], [[0, 3], [3, 1], [3, 3]], [[1, 3], [0, 0], [4, 3]], [[2, 3], [0, 2], [4, 2]], [[0, 3], [1, 0], [4, 2]]];
  // 직각을 세는 볼록한 도형
  const COUNT_SHAPES = [[[0, 2], [2, 0], [4, 2], [4, 4], [0, 4]], [[0, 0], [2, 0], [4, 3], [0, 3]], [[0, 0], [3, 0], [4, 1], [4, 3], [0, 3]], [[0, 0], [0, 3], [4, 3]], [[0, 0], [4, 0], [4, 3], [1, 3]]];
  // 각의 수를 견주는 도형(각의 수가 서로 다르다)
  const BY_ANGLES = { 3: [[0, 3], [2, 0], [4, 3]], 4: [[0, 0], [4, 0], [3, 3], [1, 3]], 5: [[0, 2], [2, 0], [4, 2], [3, 4], [1, 4]], 6: [[1, 0], [3, 0], [4, 2], [3, 4], [1, 4], [0, 2]] };
  // 선분으로 이루어진 도형
  const SEGMENT_SHAPES = [[[0, 2], [2, 0], [4, 2], [4, 4], [0, 4]], [[0, 0], [4, 0], [4, 2], [2, 2], [2, 4], [0, 4]], [[0, 1], [2, 1], [2, 0], [4, 2], [2, 4], [2, 3], [0, 3]], [[0, 0], [2, 1], [4, 0], [4, 4], [2, 3], [0, 4]]];
  // 칠교판(한 변 8칸): 삼각형 다섯, 사각형 둘
  const TANGRAM = [[[0, 0], [8, 0], [4, 4]], [[0, 0], [4, 4], [0, 8]], [[4, 4], [6, 2], [8, 4], [6, 6]], [[8, 0], [8, 4], [6, 2]], [[4, 4], [6, 6], [2, 6]], [[0, 8], [2, 6], [6, 6], [4, 8]], [[8, 4], [8, 8], [4, 8]]];

  B.addUnit({
    id: '3-1-2', grade: 3, semester: 1, no: 2, title: '평면도형', version: 7,
    groups: [
      {
        id: 'line', title: '선분, 반직선, 직선', standard: LINE,
        types: [
          T('line-straight', '곧은 선 세기', '4', (d) => {
            const flags = d.until(() => TAGS.map(() => d.bool()), (list) => { const n = list.filter(Boolean).length; return n >= 2 && n <= 4; });
            const ends = [[[0, 2], [4, 0]], [[0, 0], [4, 2]], [[0, 1], [4, 1]], [[1, 0], [3, 2]], [[1, 2], [4, 0]]];
            const list = flags.map((straight, i) => { const [p, q] = d.pick(ends); return [TAGS[i], G.board(4, 2, [straight ? G.straight('segment', p, q) : (d.bool() ? G.curve(p, q) : G.curve(q, p))], { grid: false })]; });
            return N('곧은 선은 모두 몇 개인가?', flags.filter(Boolean).length, { unit: '개', figure: G.tiles(list), explain: `곧은 선은 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다. 나머지는 굽은 선이다.`, facts: { count: flags } });
          }),
          T('line-kind', '선분·반직선·직선 가리기', '1', (d) => {
            const KO = { segment: '선분', ray: '반직선', line: '직선' };
            const kinds = d.shuffle(['segment', 'ray', 'line', 'curve']), target = d.pick(['segment', 'ray', 'line']);
            const list = kinds.map((kind, i) => { const [p, q] = d.pick([[[1, 1], [3, 1]], [[1, 2], [3, 0]], [[1, 0], [3, 2]]]); return [TAGS[i], G.board(4, 2, [kind === 'curve' ? G.curve(p, q) : G.straight(kind, p, q)], { grid: false })]; });
            return C(`${KO[target]}은?`, TAGS.slice(0, 4), kinds.indexOf(target), {
              figure: G.tiles(list), explain: '선분은 두 점을 곧게 이은 선, 반직선은 한 점에서 시작하여 한쪽으로 끝없이 늘인 곧은 선, 직선은 선분을 양쪽으로 끝없이 늘인 곧은 선이다.',
              facts: { kindPick: { kinds, target } }
            });
          }),
          T('line-name', '선의 이름', '3', (d) => {
            const [left, right] = d.pick([['ㄱ', 'ㄴ'], ['ㄷ', 'ㄹ'], ['ㅁ', 'ㅂ']]), fromLeft = d.bool();
            const [p, q] = d.pick([[[1, 1], [4, 1]], [[1, 2], [4, 1]], [[1, 1], [4, 2]]]);
            const from = fromLeft ? left : right, to = fromLeft ? right : left;
            const figure = G.board(5, 3, [fromLeft ? G.straight('ray', p, q, [left, right]) : G.straight('ray', q, p, [right, left])], { grid: false, scale: 1.4 });
            const list = d.shuffle([['선분', left, right], ['반직선', left, right], ['반직선', right, left], ['직선', left, right]]);
            return C('도형의 이름은?', list.map(([kind, a, b]) => `${kind} ${a}${b}`), list.findIndex(([kind, a]) => kind === '반직선' && a === from), {
              figure, explain: `점 ${from}에서 시작하여 점 ${to}을 지나 끝없이 늘인 곧은 선이므로 반직선 ${from}${to}이다.`,
              facts: { lineName: { kind: '반직선', from, to, options: list } }
            });
          }),
          T('line-segments', '도형을 이루는 선분의 수', '10', (d) => {
            const points = d.pick(SEGMENT_SHAPES);
            return N('도형을 이루는 선분은 모두 몇 개인가?', points.length, { unit: '개', figure: G.board(4, 4, [G.polygon(points)], { grid: false, scale: 1.3 }), explain: `꼭짓점과 꼭짓점을 이은 선분이 ${points.length}개이다.`, facts: { segments: { points, closed: true } } });
          }),
          T('line-define', '선의 뜻', '55', (d) => {
            const [text, answer] = d.pick([['두 점을 곧게 이은 선', '선분'], ['한 점에서 시작하여 한쪽으로 끝없이 늘인 곧은 선', '반직선'], ['선분을 양쪽으로 끝없이 늘인 곧은 선', '직선']]);
            const list = d.shuffle(['선분', '반직선', '직선', '각']);
            return C('다음에서 설명하는 것은?', list, list.indexOf(answer), { figure: conditions([text]), explain: `${text}을 ${answer}이라고 한다.`, facts: { truth: list.map((o) => o === answer), want: true } });
          }),
          T('line-true', '선에 대한 설명', '7', (d) => {
            const good = d.pick(['직선 ㄱㄴ과 직선 ㄴㄱ은 같은 직선이다.', '선분 ㄱㄴ과 선분 ㄴㄱ은 같은 선분이다.', '반직선 ㄱㄴ은 점 ㄱ에서 시작한다.']);
            const bad = d.shuffle(['반직선 ㄱㄴ과 반직선 ㄴㄱ은 같은 반직선이다.', '직선은 한쪽으로만 끝없이 늘인 곧은 선이다.', '선분은 양쪽으로 끝없이 늘인 곧은 선이다.', '직선에는 시작하는 점과 끝나는 점이 있다.', '반직선 ㄱㄴ은 점 ㄴ에서 시작한다.']).slice(0, 3);
            const list = d.shuffle([good].concat(bad));
            return C('선분, 반직선, 직선에 대한 설명으로 옳은 것은?', list, list.indexOf(good), {
              explain: '반직선은 시작하는 점이 다르면 다른 반직선이다. 선분과 직선은 두 점의 차례를 바꾸어 읽어도 같다.', facts: { truth: list.map((o) => o === good), want: true }
            });
          })
        ]
      },
      {
        id: 'angle', title: '각과 직각', standard: ANGLE,
        types: [
          T('angle-is', '각인 것 찾기', '17', (d) => {
            const kinds = d.shuffle(['angle', 'angle', 'curved', 'apart']);
            const proper = d.shuffle(ANGLE_OTHER.concat(ANGLE_RIGHT)).slice(0, 2);
            let used = 0;
            const draw = (kind) => {
              if (kind === 'angle') { const [v, p, q] = proper[used]; used += 1; return G.rays(v, [p, q]); }
              if (kind === 'curved') return G.line([0, 3], [3.6, 3]) + G.curve([0, 3], [3, 0]);
              return G.line([0, 3], [3, 3]) + G.line([1, 0], [4, 2]);
            };
            const list = kinds.map((kind, i) => [TAGS[i], G.board(4, 3, [draw(kind)], { grid: false })]);
            const made = setOptions(d, TAGS.slice(0, 4), kinds.map((kind) => kind === 'angle'));
            return C('각을 모두 고른 것은?', made.options, made.answer, {
              figure: G.tiles(list), explain: '각은 한 점에서 그은 두 반직선으로 이루어진 도형이다. 굽은 선이 있거나 두 선이 한 점에서 만나지 않으면 각이 아니다.',
              facts: { sets: { labels: TAGS.slice(0, 4), flags: kinds.map((kind) => kind === 'angle'), options: made.sets } }
            });
          }),
          T('angle-read', '각 읽기', '15', (d) => {
            const names = d.pick([['ㄱ', 'ㄴ', 'ㄷ'], ['ㄴ', 'ㄷ', 'ㄹ'], ['ㄹ', 'ㅁ', 'ㅂ']]), v = d.pick(names), [p, q] = names.filter((x) => x !== v);
            const [V, P, Q] = d.pick(ANGLE_OTHER);
            const list = d.shuffle([[p, v, q], [v, p, q], [p, q, v], [q, p, v]]);
            return C('각을 바르게 읽은 것은?', list.map((o) => '각 ' + o.join('')), list.findIndex((o) => o[1] === v), {
              figure: G.board(5, 4, [G.rays([V[0] + 0.5, V[1] + 0.5], [[P[0] + 0.5, P[1] + 0.5], [Q[0] + 0.5, Q[1] + 0.5]], [v, p, q])], { grid: false, scale: 1.3 }),
              explain: `각의 꼭짓점인 점 ${v}이 가운데에 오도록 읽는다. 각 ${p}${v}${q} 또는 각 ${q}${v}${p}이라고 읽는다.`,
              facts: { readAngle: { names: [v, p, q], options: list } }
            });
          }),
          T('angle-say', '각에 대한 설명', '21', (d) => {
            const [p, v, q] = d.pick([['ㄱ', 'ㄴ', 'ㄷ'], ['ㄹ', 'ㅁ', 'ㅂ']]), [V, P, Q] = d.pick(ANGLE_OTHER);
            const good = d.shuffle([`각의 꼭짓점은 점 ${v}이다.`, `각의 변은 반직선 ${v}${p}과 반직선 ${v}${q}이다.`, `각 ${q}${v}${p}이라고도 읽는다.`, '각의 변은 2개이다.']).slice(0, 3);
            const bad = d.pick(['각의 꼭짓점은 3개이다.', `각 ${v}${p}${q}이라고도 읽는다.`, `각의 꼭짓점은 점 ${p}이다.`]);
            const list = d.shuffle(good.concat([bad]));
            return C('각에 대한 설명으로 옳지 않은 것은?', list, list.indexOf(bad), {
              figure: G.board(5, 4, [G.rays([V[0] + 0.5, V[1] + 0.5], [[P[0] + 0.5, P[1] + 0.5], [Q[0] + 0.5, Q[1] + 0.5]], [v, p, q])], { grid: false, scale: 1.3 }),
              explain: `각 ${p}${v}${q}의 꼭짓점은 점 ${v} 하나이고, 변은 반직선 ${v}${p}과 반직선 ${v}${q}이다.`,
              facts: { truth: list.map((o) => o !== bad), want: false }
            });
          }),
          T('angle-most', '각이 가장 많은 도형', '20', (d) => {
            const counts = d.shuffle(d.shuffle([3, 4, 5, 6]).slice(0, 3).concat([0]));
            const list = counts.map((n, i) => [TAGS[i], G.board(4, 4, [n === 0 ? G.circle([2, 2], 1.8) : G.polygon(BY_ANGLES[n])], { grid: false })]);
            return C('각이 가장 많은 도형은?', TAGS.slice(0, 4), counts.indexOf(Math.max(...counts)), {
              figure: G.tiles(list), explain: counts.map((n, i) => `${TAGS[i]} ${n}개`).join(', ') + '이다. 굽은 선으로만 이루어진 도형에는 각이 없다.',
              facts: { mostAngles: counts }
            });
          }),
          T('right-pick', '직각 찾기', '31', (d) => {
            const angles = d.shuffle([d.pick(ANGLE_RIGHT)].concat(d.shuffle(ANGLE_OTHER).slice(0, 3)));
            const list = angles.map(([v, p, q], i) => [TAGS[i], G.board(4, 3, [G.line(v, p), G.line(v, q), G.point(v)], { grid: 'dots' })]);
            return C('직각은?', TAGS.slice(0, 4), angles.findIndex(([v, p, q]) => G.isRight(v, p, q)), {
              figure: G.tiles(list), explain: '삼각자의 직각 부분을 대었을 때 꼭 맞게 겹치는 각이 직각이다.', facts: { anglePick: angles }
            });
          }),
          T('right-count', '도형의 직각 세기', '27', (d) => {
            const points = d.pick(COUNT_SHAPES), n = G.rightAngles(points);
            const marks = points.map((v, i) => (G.rightAt(points, i) ? G.rightMark(v, points[(i + points.length - 1) % points.length], points[(i + 1) % points.length]) : '')).join('');
            return N('도형에서 직각은 모두 몇 개인가?', n, {
              unit: '개', figure: G.board(4, 4, [G.polygon(points)], { grid: 'lines', scale: 1.5 }),
              explain: '직각인 곳에 표시하면 다음과 같다.' + G.board(4, 4, [G.polygon(points), marks], { grid: 'lines' }), facts: { rightCount: points }
            });
          }),
          T('right-clock', '직각을 이루는 시각', '32', (d) => {
            const hours = d.shuffle([d.pick([3, 9])].concat(d.shuffle([1, 2, 4, 5, 6, 7, 8, 10, 11, 12]).slice(0, 3)));
            const at = hours.findIndex((h) => h === 3 || h === 9);
            return C('긴바늘과 짧은바늘이 이루는 작은 쪽의 각이 직각인 시계는?', TAGS.slice(0, 4), at, {
              figure: G.tiles(hours.map((h, i) => [TAGS[i], G.clock(h, 0)])), explain: `${hours[at]}시에 긴바늘과 짧은바늘이 이루는 각이 직각이다.`, facts: { clocks: hours }
            });
          }),
          T('right-rays', '한 점에 모인 선에서 직각 찾기', '30', (d) => {
            const DIRS = [[-3, 0], [3, 0], [0, -3], [-2, -2], [2, -2], [-3, -1], [3, -1], [-1, -3], [1, -3], [-3, -2], [3, -2], [-2, -3], [2, -3]];
            const V = [4, 4], angleOf = (u) => Math.atan2(-u[1], u[0]);
            const dirs = d.until(() => d.shuffle(DIRS).slice(0, 4).sort((a, b) => angleOf(b) - angleOf(a)), (list) => {
              let right = 0;
              for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) {
                const a = list[i], b = list[j], dot = a[0] * b[0] + a[1] * b[1], cos2 = (dot * dot) / ((a[0] * a[0] + a[1] * a[1]) * (b[0] * b[0] + b[1] * b[1]));
                if (dot === 0) right += 1; else if (cos2 < 0.06) return false;
                if (cos2 > 0.85) return false;   // 두 선이 너무 붙어 있다
              }
              return right === 1;
            });
            const ends = dirs.map((u) => [V[0] + u[0], V[1] + u[1]]), names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
            const pairs = []; for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) pairs.push([i, j]);
            const right = pairs.find(([i, j]) => G.isRight(V, ends[i], ends[j]));
            const list = d.shuffle(d.shuffle(pairs.filter((pair) => pair !== right)).slice(0, 3).concat([right]));
            return C('직각인 각은?', list.map(([i, j]) => `각 ${names[i]}ㅁ${names[j]}`), list.indexOf(right), {
              figure: G.board(8, 5, [G.rays(V, ends, ['ㅁ'].concat(names))], { grid: 'dots', scale: 1.3 }),
              explain: `삼각자의 직각 부분을 대었을 때 꼭 맞게 겹치는 각은 각 ${names[right[0]]}ㅁ${names[right[1]]}이다.`,
              facts: { raysRight: { v: V, ends, options: list } }
            });
          })
        ]
      },
      {
        id: 'rtri', title: '직각삼각형', standard: RTRI,
        types: [
          T('rtri-find', '직각삼각형 찾기', '40', (d) => {
            const picks = d.shuffle(d.shuffle(TRI_RIGHT).slice(0, 2).concat(d.shuffle(TRI_OTHER).slice(0, 2)));
            const flags = picks.map((points) => G.isRightTriangle(points));
            const made = setOptions(d, TAGS.slice(0, 4), flags);
            return C('직각삼각형을 모두 고른 것은?', made.options, made.answer, {
              figure: G.tiles(picks.map((points, i) => [TAGS[i], shapeTile(points, 4, 3, 'lines')])), explain: '한 각이 직각인 삼각형을 직각삼각형이라고 한다.',
              facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets }, polys: picks, prop: 'rightTriangle' }
            });
          }),
          T('rtri-point', '직각삼각형이 되는 점', '41', (d) => {
            // 선분 ㄱㄴ과 점 넷. 이어서 직각삼각형이 되는 점은 하나뿐이다.
            const [a, b] = d.pick([[[1, 4], [4, 4]], [[1, 4], [5, 4]], [[2, 4], [5, 4]], [[1, 4], [3, 2]], [[2, 4], [5, 3]]]);
            const lattice = []; for (let x = 0; x <= 6; x += 1) for (let y = 0; y <= 3; y += 1) lattice.push([x, y]);
            const near = (points) => G.looksRight(points);
            const points = d.until(() => d.shuffle(lattice).slice(0, 4), (list) => {
              const tris = list.map((c) => [a, b, c]);
              return tris.every((t) => G.cross(G.sub(b, a), G.sub(t[2], a)) !== 0) && tris.filter((t) => G.isRightTriangle(t)).length === 1 && tris.every((t) => G.isRightTriangle(t) || !near(t))
                && list.every((p, i) => list.every((q, j) => i === j || Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= 2));
            });
            const parts = [G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.1, a[1] + 0.6], 'ㄱ'), G.text([b[0] + 0.1, b[1] + 0.6], 'ㄴ')]
              .concat(points.map((p, i) => G.point(p) + G.text([p[0] + 0.5, p[1] - 0.35], CIRCLED[i], 'mb-label is-small')));
            const at = points.findIndex((c) => G.isRightTriangle([a, b, c]));
            return C('선분 ㄱㄴ의 두 끝 점과 한 점을 이어 직각삼각형을 그리려고 한다. 이어야 할 점은?', CIRCLED, at, {
              figure: G.board(6, 5, parts, { grid: 'dots', scale: 1.4 }),
              explain: `점 ${CIRCLED[at]}과 이으면 한 각이 직각인 삼각형이 된다.` + G.board(6, 5, [G.polygon([a, b, points[at]])].concat(parts), { grid: 'dots' }),
              facts: { triPoint: { a, b, candidates: points } }
            });
          }),
          T('rtri-tangram', '칠교판의 직각삼각형', '43', (d) => {
            const flip = d.bool(), turn = d.bool();
            const pieces = TANGRAM.map((points) => points.map(([x, y]) => { const fx = flip ? 8 - x : x; return turn ? [y, fx] : [fx, y]; }));
            const marks = '㉠㉡㉢㉣㉤㉥㉦'.split('');
            const center = (points) => [points.reduce((s, p) => s + p[0], 0) / points.length, points.reduce((s, p) => s + p[1], 0) / points.length];
            const n = pieces.filter((points) => G.isRightTriangle(points)).length;
            return N('칠교판의 조각 ㉠~㉦ 중 직각삼각형은 모두 몇 개인가?', n, {
              unit: '개', figure: G.board(8, 8, pieces.map((points, i) => G.polygon(points) + G.text(center(points), marks[i], 'mb-label is-small')), { grid: false, scale: 1.2 }),
              explain: `직각삼각형은 ${marks.filter((_, i) => G.isRightTriangle(pieces[i])).join(', ')}이다. 나머지 둘은 사각형이다.`, facts: { tangram: pieces }
            });
          })
        ]
      },
      {
        id: 'quad', title: '직사각형과 정사각형', standard: QUAD,
        types: [
          T('quad-rect', '직사각형 찾기', '46', (d) => {
            const picks = d.shuffle(d.shuffle(RECTS).slice(0, 2).concat(d.shuffle(QUAD_OTHER).slice(0, 2)));
            const flags = picks.map((points) => G.isRectangle(points)), made = setOptions(d, TAGS.slice(0, 4), flags);
            return C('직사각형을 모두 고른 것은?', made.options, made.answer, {
              figure: G.tiles(picks.map((points, i) => [TAGS[i], shapeTile(points, 4, 4, 'lines')])), explain: '네 각이 모두 직각인 사각형을 직사각형이라고 한다.',
              facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets }, polys: picks, prop: 'rectangle' }
            });
          }),
          T('quad-move', '직사각형이 되는 꼭짓점', '48', (d) => {
            // 사각형 ㄱㄴㄷㄹ에서 ㄷ만 어긋나 있다. 옮길 자리를 고른다.
            const x0 = 1, y0 = d.int(0, 1), w = d.int(3, 4), h = d.int(2, 3);
            const A = [x0, y0], Bp = [x0, y0 + h], D = [x0 + w, y0], right = [x0 + w, y0 + h];
            const inside = (p) => p[0] >= 0 && p[0] <= 7 && p[1] >= 0 && p[1] <= 5;
            const far = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
            const wrong = d.until(() => { const [dx, dy] = d.pick([[1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [1, -1], [-1, 1]]); return [right[0] + dx, right[1] + dy]; },
              (p) => inside(p) && p[0] > x0 && p[1] > y0 && G.cross(G.sub(p, Bp), G.sub(D, Bp)) !== 0);
            const around = []; for (let dx = -2; dx <= 2; dx += 1) for (let dy = -2; dy <= 2; dy += 1) around.push([right[0] + dx, right[1] + dy]);
            const others = d.until(() => d.shuffle(around).slice(0, 3), (list) => list.every((p, i) => inside(p) && far(p, right) >= 2 && far(p, wrong) >= 2 && [A, Bp, D].every((v) => far(p, v) >= 1) && list.every((q, j) => i === j || far(p, q) >= 2)));
            const cands = d.shuffle(others.concat([right]));
            const at = cands.findIndex((p) => p[0] === right[0] && p[1] === right[1]);
            const quad = [A, Bp, wrong, D];
            const parts = [G.polygon(quad, 'mb-poly is-plain'), G.vertexLabels(quad, ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'])]
              .concat(cands.map((p, i) => G.point(p) + G.text([p[0] + 0.45, p[1] - 0.4], CIRCLED[i], 'mb-label is-small')));
            return C('사각형 ㄱㄴㄷㄹ의 꼭짓점 ㄷ을 한 점으로 옮겨 직사각형을 만들려고 한다. 옮겨야 할 점은?', CIRCLED, at, {
              figure: G.board(7, 5, parts, { grid: 'dots', scale: 1.4 }), explain: `꼭짓점 ㄷ을 점 ${CIRCLED[at]}으로 옮기면 네 각이 모두 직각이 된다.`,
              facts: { rectMove: { fixed: [A, Bp, D], candidates: cands } }
            });
          }),
          T('quad-sides', '직사각형의 변의 길이', '75', (d) => {
            const a = d.int(7, 15), b = d.int(3, a - 3);
            const box = [[2, 0.6], [6.5, 0.6], [6.5, 3.4], [2, 3.4]];
            const figure = G.board(8, 4, [G.polygon(box), G.text([4.25, 0.12], a + ' cm', 'mb-label is-length'), G.text([1, 2], b + ' cm', 'mb-label is-length'), G.text([4.25, 3.9], '㉠ cm', 'mb-label is-length'), G.text([7.4, 2], '㉡ cm', 'mb-label is-length')], { grid: false, scale: 1.2 });
            return M('직사각형에서 ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }], { figure, explain: '직사각형은 마주 보는 두 변의 길이가 같다.', facts: { rectSides: [a, b] } });
          }),
          T('quad-square', '정사각형 찾기', '51', (d) => {
            const picks = d.shuffle(d.shuffle(SQUARES).slice(0, 2).concat([d.pick(RECTS.slice(0, 2)), RHOMBUS]));
            const flags = picks.map((points) => G.isSquare(points)), made = setOptions(d, TAGS.slice(0, 4), flags);
            return C('정사각형을 모두 고른 것은?', made.options, made.answer, {
              figure: G.tiles(picks.map((points, i) => [TAGS[i], shapeTile(points, 4, 4, 'lines')])), explain: '네 각이 모두 직각이고 네 변의 길이가 모두 같은 사각형을 정사각형이라고 한다.',
              facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets }, polys: picks, prop: 'square' }
            });
          }),
          T('quad-names', '도형의 이름이 될 수 있는 것', '65', (d) => {
            const points = d.pick(SQUARES.slice(0, 1).concat([SQUARES[3]]));
            const list = d.shuffle([['사각형', '직사각형', '정사각형'], ['정사각형'], ['사각형', '정사각형'], ['직사각형', '정사각형']]);
            return C('도형의 이름이 될 수 있는 것을 모두 고른 것은?', list.map((o) => o.join(', ')), list.findIndex((o) => o.length === 3), {
              figure: G.board(4, 4, [G.polygon(centered(points, 4, 4))], { grid: 'lines', scale: 1.3 }), explain: '변이 4개이므로 사각형이고, 네 각이 모두 직각이므로 직사각형이며, 네 변의 길이도 모두 같으므로 정사각형이다.',
              facts: { names: { points, options: list } }
            });
          }),
          T('quad-name', '설명에 맞는 도형', '61', (d) => {
            const [lines, answer] = d.pick([[['변이 3개이다.', '한 각이 직각이다.'], '직각삼각형'], [['변이 4개이다.', '네 각이 모두 직각이다.', '네 변의 길이가 모두 같지는 않다.'], '직사각형'], [['변이 4개이다.', '네 각이 모두 직각이다.', '네 변의 길이가 모두 같다.'], '정사각형']]);
            const list = d.shuffle(['삼각형', '직각삼각형', '직사각형', '정사각형']);
            return C('다음 설명에 모두 알맞은 도형은?', list, list.indexOf(answer), { figure: conditions(lines), explain: `설명에 모두 알맞은 도형은 ${answer}이다.`, facts: { truth: list.map((o) => o === answer), want: true } });
          }),
          T('quad-true', '직사각형에 대한 설명', '59', (d) => {
            const good = d.shuffle(['변이 4개이다.', '꼭짓점이 4개이다.', '네 각이 모두 직각이다.', '선분으로 둘러싸인 도형이다.']).slice(0, 3);
            const bad = d.pick(['직각이 2개뿐이다.', '네 변의 길이가 항상 모두 같다.', '변이 3개이다.']);
            const list = d.shuffle(good.concat([bad]));
            return C('직사각형에 대한 설명으로 옳지 않은 것은?', list, list.indexOf(bad), { explain: '직사각형은 네 각이 모두 직각인 사각형이다. 네 변의 길이가 모두 같은 직사각형은 정사각형이다.', facts: { truth: list.map((o) => o !== bad), want: false } });
          }),

        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
