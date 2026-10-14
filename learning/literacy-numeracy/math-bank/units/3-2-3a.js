// 3학년 2학기 3단원 원 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 9종의 평가 자료(단원평가·형성평가·수학익힘·수행평가)에서 뽑은 문제 꼴 목록(기본꼴 1~3, 모두 205꼴)을
// 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (교과서마다 단원 차례가 달라 류희찬·최수일·장혜원·강문봉의 자료는 2단원 폴더에서 가져왔다.)
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다. 숫자만 다르거나 말만 다른 것은 한 번만 싣는다.
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      5학년 「다각형의 둘레와 넓이」: 정사각형·직사각형의 네 변의 길이의 합, 삼각형 세 변의 길이의 합이 끼는 문제
//      4학년 「곱셈과 나눗셈」: 두 자리 수로 나누어야 풀리는 문제
//  - 긋기·그리기(작도), 까닭 쓰기·규칙 설명하기 같은 서술형, 놀이는 싣지 않는다.
//  - 뜻 없는 셈(두 원의 지름의 합, 빈칸 수를 모두 더하기)은 싣지 않는다.
// 그림 속 길이는 수와 단위를 띄어 적는다. 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, lines, ruler, N, M, C } = B.kit;
  const G = B.kit.geo;
  const PARTS = '4수03-06', DRAW = '4수03-07';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

  // ── 그림 ─────────────────────────────────────────────────────
  const RAD = Math.PI / 180;
  const on = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] - r * Math.sin(deg * RAD)];   // 원 위의 점(각도는 오른쪽에서 시계 반대쪽으로)
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const named = (c, p, name) => G.point(p) + G.text(G.beyond(c, p, 0.45), name);                  // 점과 이름(중심의 반대쪽에 적는다)
  const centre = (c, name) => G.point(c) + (name ? G.text([c[0] - 0.36, c[1] + 0.44], name) : '');
  // 선분 옆에 적는 길이: 글자 폭만큼 더 비켜 적어 비스듬한 선분에 겹치지 않게 한다
  const tag = (p, q, value) => { const dx = q[0] - p[0], dy = q[1] - p[1], size = Math.hypot(dx, dy) || 1; return G.text(G.beside(p, q, mid(p, q), 0.2 + String(value).length * 0.165 * Math.abs(dy / size) + 0.3 * Math.abs(dx / size)), value); };
  const draw = (cols, rows, parts, label, scale) => G.board(cols, rows, parts, { grid: false, scale: scale || 1.1, label });
  // 원 하나와 선분 셋: 반지름 ㅇㄱ, 중심을 지나지 않는 선분 ㄴㄷ, 지름 ㄹㅁ. 선분끼리 만나지 않게 자리를 정해 둔다.
  const PRESETS = [{ dia: [20, 200], chord: [235, 305], rad: 100 }, { dia: [160, 340], chord: [40, 110], rad: 250 }, { dia: [80, 260], chord: [130, 215], rad: 350 }];
  function threeSegments(d) {
    const c = [3, 3], r = 2.2, s = d.pick(PRESETS);
    const P = { ㅇ: c, ㄱ: on(c, r, s.rad), ㄴ: on(c, r, s.chord[0]), ㄷ: on(c, r, s.chord[1]), ㄹ: on(c, r, s.dia[0]), ㅁ: on(c, r, s.dia[1]) };
    const segs = d.shuffle([['ㅇ', 'ㄱ'], ['ㄴ', 'ㄷ'], ['ㄹ', 'ㅁ']]);
    const parts = [G.circle(c, r)].concat(segs.map(([a, b]) => G.line(P[a], P[b])), ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].map((n) => named(c, P[n], n)), [centre(c, 'ㅇ')]);
    return { figure: draw(6, 6, parts, '원과 선분 셋. 점 ㅇ은 원의 중심'), segs: segs.map(([a, b]) => ({ name: a + b, p: P[a], q: P[b] })), center: c, r };
  }
  // 한 줄로 놓인 원: gaps 는 이웃한 중심 사이의 거리(그림 칸 수)
  function rowOfCircles(radii, gaps) {
    const top = Math.max(...radii), xs = [0.7 + radii[0]];
    gaps.forEach((gap) => xs.push(xs[xs.length - 1] + gap));
    const centers = xs.map((x) => [x, 0.7 + top]);
    return { centers, cols: Math.ceil(xs[xs.length - 1] + radii[radii.length - 1] + 0.7), rows: Math.ceil(top * 2 + 1.4), circles: centers.map((c, i) => G.circle(c, radii[i])) };
  }
  const ends = (row, radii, names) => { const a = [row.centers[0][0] - radii[0], row.centers[0][1]], b = [row.centers[row.centers.length - 1][0] + radii[radii.length - 1], row.centers[0][1]]; return { a, b, parts: [G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.4, a[1]], names[0]), G.text([b[0] + 0.4, b[1]], names[1])] }; };
  const quote = (text) => lines(['「' + text + '」']);

  B.addUnit({
    id: '3-2-3', grade: 3, semester: 2, no: 3, title: '원', version: 4,
    groups: [
      {
        id: 'parts', title: '원의 중심, 반지름, 지름', standard: PARTS,
        types: [
          T('parts-word', '뜻에 맞는 낱말', '①1 ②1 ③2', (d) => {
            const list = d.shuffle([['원을 그릴 때 누름 못이 꽂혔던 점', '원의 중심'], ['원의 중심과 원 위의 한 점을 이은 선분', '원의 반지름'], ['원 위의 두 점을 이은 선분 중에서 원의 중심을 지나는 선분', '원의 지름']]);
            return C('다음에서 설명하는 것은?', list.map(([, word]) => word).sort(), list.map(([, word]) => word).sort().indexOf(list[0][1]), {
              figure: quote(list[0][0]), explain: `${list[0][0]}을 ${list[0][1]}이라고 한다.`, facts: { truth: list.map(([, word]) => word).sort().map((word) => word === list[0][1]), want: true }
            });
          }),
          T('parts-center', '원의 중심 찾기', '①5 ②2 ③1 심1', (d) => {
            const c = [3, 3], names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], spots = d.shuffle([[0, 0], [1.3, 40], [1.0, 160], [1.5, 265]]);
            const points = names.map((name, i) => ({ name, p: on(c, spots[i][0], spots[i][1]) }));
            return C('원의 중심은?', names.map((n) => '점 ' + n), spots.findIndex(([far]) => far === 0), {
              figure: draw(6, 6, [G.circle(c, 2.3)].concat(points.map(({ name, p }) => G.point(p) + G.text([p[0] + 0.38, p[1] - 0.34], name))), '원과 그 안의 점 넷'),
              explain: '원의 한가운데에 있는 점이 원의 중심이다. 원의 중심에서 원 위의 점까지의 길이는 어느 쪽으로 재어도 같다.', facts: { circlePoints: { center: c, points } }
            });
          }),
          T('parts-radius', '반지름인 선분 찾기', '①7 ②3 ③3 심3', (d) => {
            const fig = threeSegments(d);
            return C('원의 반지름은?', fig.segs.map((s) => '선분 ' + s.name), fig.segs.findIndex((s) => s.name === 'ㅇㄱ'), {
              figure: fig.figure, explain: '원의 중심 ㅇ과 원 위의 한 점을 이은 선분이 반지름이다. 선분 ㅇㄱ이 반지름이다.', facts: { circleSegs: { center: fig.center, r: fig.r, segs: fig.segs, want: 'radius' } }
            });
          }),
          T('parts-diameter', '지름인 선분 찾기', '①8 ②5 ③4 심4', (d) => {
            const fig = threeSegments(d);
            return C('원의 지름은?', fig.segs.map((s) => '선분 ' + s.name), fig.segs.findIndex((s) => s.name === 'ㄹㅁ'), {
              figure: fig.figure, explain: '원 위의 두 점을 이은 선분 중에서 원의 중심 ㅇ을 지나는 선분이 지름이다. 선분 ㄹㅁ이 지름이다.', facts: { circleSegs: { center: fig.center, r: fig.r, segs: fig.segs, want: 'diameter' } }
            });
          }),
          T('parts-say', '한 원의 중심과 반지름의 수', '①9 ②12·13 ③10', (d) => {
            const rows = d.shuffle([['원의 중심은 1개이다.', true], ['반지름은 1개만 그을 수 있다.', false], ['지름은 2개만 그을 수 있다.', false], ['반지름은 긋는 곳에 따라 길이가 다르다.', false]]);
            return C('한 원에 대한 설명으로 옳은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              explain: '한 원에서 원의 중심은 1개뿐이고, 반지름과 지름은 셀 수 없이 많이 그을 수 있다. 한 원의 반지름은 길이가 모두 같다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('parts-same', '한 원의 반지름의 길이', '①11 ②8·9 ③8 심16', (d) => {
            const c = [3, 3], r = 2.2, [a, b] = d.pick([[35, 160], [200, 330], [80, 215]]), cm = d.int(3, 12), p = on(c, r, a), q = on(c, r, b);
            return N('점 ㅇ은 원의 중심이다. 선분 ㅇㄴ의 길이는 몇 cm인가?', cm, {
              unit: 'cm', figure: draw(6, 6, [G.circle(c, r), G.line(c, p), G.line(c, q), named(c, p, 'ㄱ'), named(c, q, 'ㄴ'), centre(c, 'ㅇ'), tag(c, p, cm + ' cm')], `원의 중심 ㅇ, 선분 ㅇㄱ의 길이 ${cm} cm`),
              explain: `선분 ㅇㄱ과 선분 ㅇㄴ은 모두 원의 반지름이다. 한 원에서 반지름은 길이가 모두 같으므로 ${cm} cm이다.`, facts: { calc: [[String(cm), 0]] }
            });
          }),
          T('parts-tape', '띠 종이의 구멍과 원의 크기', '①4 ②16·17 ③9 심10', (d) => {
            // 누름 못에서 가장 먼 구멍에 연필을 꽂아야 가장 큰 원이 그려진다
            const [pin, holes] = d.pick([[1, [2.2, 3.4, 4.6, 6.4]], [6, [1, 2.8, 4, 5]], [2.5, [1, 3.6, 4.8, 6.6]], [5, [1.2, 2.4, 3.8, 6.2]]]);
            const far = holes.map((x) => Math.abs(x - pin)), y = 1.2;
            const parts = [G.polygon([[0.4, 0.65], [7.2, 0.65], [7.2, 1.75], [0.4, 1.75]]), G.point([pin, y]), G.text([pin, y - 0.95], '누름 못')]
              .concat(holes.map((x, i) => G.circle([x, y], 0.17) + G.text([x, y + 1.05], LABELS[i])));
            return C('누름 못과 띠 종이로 원을 그리려고 한다. 가장 큰 원을 그리려면 연필을 어느 구멍에 꽂아야 하는가?', LABELS, far.indexOf(Math.max(...far)), {
              figure: draw(7.6, 2.6, parts, '띠 종이: 누름 못과 구멍 넷'), explain: '누름 못에서 연필을 꽂은 구멍까지의 길이가 원의 반지름이 된다. 누름 못에서 가장 먼 구멍에 꽂아야 가장 큰 원이 그려진다.',
              facts: { farthest: { pin, holes } }
            });
          })
        ]
      },
      {
        id: 'prop', title: '원의 성질', standard: PARTS,
        types: [
          T('prop-longest', '길이가 가장 긴 선분', '①19 ②20 ③12 심17', (d) => {
            const c = [3, 3], r = 2.2, s = d.pick([{ dia: [20, 200], long: [215, 325], short: [70, 130] }, { dia: [100, 280], long: [300, 50], short: [150, 210] }, { dia: [150, 330], long: [345, 95], short: [200, 265] }]);
            const names = d.shuffle([['ㄱ', 'ㄴ'], ['ㄷ', 'ㄹ'], ['ㅁ', 'ㅂ']]), kinds = [s.dia, s.long, s.short];
            const segs = kinds.map((angles, i) => ({ name: names[i].join(''), p: on(c, r, angles[0]), q: on(c, r, angles[1]) })).sort((x, y) => (x.name < y.name ? -1 : 1));
            const parts = [G.circle(c, r)].concat(segs.map((g) => G.line(g.p, g.q) + named(c, g.p, g.name[0]) + named(c, g.q, g.name[1])), [centre(c)]);
            return C('원 위의 두 점을 이은 선분 중에서 길이가 가장 긴 선분은?', segs.map((g) => '선분 ' + g.name), segs.findIndex((g) => g.name === names[0].join('')), {
              figure: draw(6, 6, parts, '원과 선분 셋. 가운데 점은 원의 중심'), explain: '원 안에 그을 수 있는 가장 긴 선분은 원의 중심을 지나는 선분, 곧 지름이다.',
              facts: { circleSegs: { center: c, r, segs, want: 'longest' } }
            });
          }),
          T('prop-say', '지름에 대한 설명', '①17·25 ②22·30 ③13 심23', (d) => {
            const wrong = d.pick(['한 원에서 지름은 1개만 그을 수 있다.', '한 원에서 지름은 반지름의 3배이다.', '지름은 원 위의 두 점을 이은 선분이면 어느 것이나 된다.']);
            const right = d.shuffle(['지름은 원을 똑같이 둘로 나눈다.', '지름은 원 안에 그을 수 있는 가장 긴 선분이다.', '한 원에서 지름은 반지름의 2배이다.', '지름은 원의 중심을 지난다.']).slice(0, 3);
            const rows = d.shuffle(right.map((text) => [text, true]).concat([[wrong, false]]));
            return C('원의 지름에 대한 설명으로 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
              explain: '지름은 원의 중심을 지나고 원을 똑같이 둘로 나누며, 원 안에 그을 수 있는 가장 긴 선분이다. 한 원에서 지름은 셀 수 없이 많이 그을 수 있고 길이는 반지름의 2배이다.',
              facts: { truth: rows.map(([, ok]) => ok), want: false }
            });
          }),
          T('prop-r2d', '반지름으로 지름 구하기', '①22 ②25 ③15 심14', (d) => {
            const c = [3, 3], r = 2.2, cm = d.int(3, 14), p = on(c, r, d.pick([25, 150, 205, 335]));
            return N('점 ㅇ은 원의 중심이다. 원의 지름은 몇 cm인가?', cm * 2, {
              unit: 'cm', figure: draw(6, 6, [G.circle(c, r), G.line(c, p), G.point(p), centre(c, 'ㅇ'), tag(c, p, cm + ' cm')], `원의 중심 ㅇ, 반지름 ${cm} cm`),
              explain: `한 원에서 지름은 반지름의 2배이다. ${cm} × 2 = ${cm * 2}`, facts: { calc: [[`${cm}*2`, 0]], unseen: [2] }
            });
          }),
          T('prop-d2r', '지름으로 반지름 구하기', '①23 ②26 ③16 심14', (d) => {
            const c = [3, 3], r = 2.2, cm = d.int(3, 14) * 2, a = d.pick([15, 160, 200, 340]), p = on(c, r, a), q = on(c, r, a + 180);
            return N('점 ㅇ은 원의 중심이다. 원의 반지름은 몇 cm인가?', cm / 2, {
              unit: 'cm', figure: draw(6, 6, [G.circle(c, r), G.line(p, q), G.point(p), G.point(q), centre(c, 'ㅇ'), tag(p, c, cm + ' cm')], `원의 중심 ㅇ, 지름 ${cm} cm`),
              explain: `한 원에서 반지름은 지름의 반이다. ${cm} ÷ 2 = ${cm / 2}`, facts: { calc: [[`${cm}/2`, 0]], unseen: [2] }
            });
          }),
          T('prop-bigger', '가장 큰 원 고르기', '①27·28 ②32 ③18 심18', (d) => {
            // 반지름과 지름을 섞어 준다: 적힌 수가 가장 큰 원이 가장 큰 원은 아니다
            const [a, b, e] = d.until(() => [d.int(4, 9), d.int(9, 17), d.int(4, 9)], ([x, y, z]) => x !== z && y < x * 2 && y !== z * 2 && y > x && y > z);
            const rows = d.shuffle([[`반지름이 ${a} cm인 원`, a * 2, `${a}*2`], [`지름이 ${b} cm인 원`, b, String(b)], [`반지름이 ${e} cm인 원`, e * 2, `${e}*2`]]), best = Math.max(...rows.map(([, v]) => v));
            return C('가장 큰 원은?', rows.map(([text]) => text), rows.findIndex(([, v]) => v === best), {
              explain: `지름으로 비교한다. ${rows.map(([text, v]) => `${text}의 지름은 ${v} cm`).join(', ')}이다. 지름이 가장 긴 원이 가장 크다.`, facts: { choose: { exprs: rows.map(([, , x]) => x), rule: 'max' }, unseen: [2] }
            });
          }),
          T('prop-same', '크기가 같은 원 찾기', '①26 ②31 ③20 심19', (d) => {
            const r = d.int(3, 12), list = d.shuffle([[`반지름이 ${r} cm인 원`, `${r}*2`], [`반지름이 ${r * 2} cm인 원`, `${r * 2}*2`], [`지름이 ${r} cm인 원`, String(r)], [`지름이 ${r * 4} cm인 원`, String(r * 4)]]);
            return C(`지름이 ${r * 2} cm인 원과 크기가 같은 원은?`, list.map(([text]) => text), list.findIndex(([, x]) => x === `${r}*2`), {
              explain: `지름이 ${r * 2} cm인 원의 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다. 반지름이 같은 원은 크기가 같다.`, facts: { choose: { exprs: list.map(([, x]) => x), rule: 'equals', target: r * 2 }, unseen: [2] }
            });
          }),
          T('prop-longer', '반지름이 더 긴 원의 지름', '①31', (d) => {
            const a = d.int(3, 9), k = d.int(2, 5);
            return N(`반지름이 ${a} cm인 원보다 반지름이 ${k} cm 더 긴 원의 지름은 몇 cm인가?`, (a + k) * 2, {
              unit: 'cm', explain: `반지름은 ${a} + ${k} = ${a + k}(cm)이다. 지름은 반지름의 2배이므로 ${a + k} × 2 = ${(a + k) * 2}`, facts: { calc: [[`(${a}+${k})*2`, 0]], unseen: [2] }
            });
          }),
          T('prop-fold', '원 모양 종이를 접어 생기는 점', '①18 ③22 심25', (d) => {
            const list = d.shuffle(['원의 중심', '원의 반지름', '원의 지름']);
            return C('원 모양의 종이를 반으로 접었다가 펴고, 다른 쪽으로 다시 반으로 접었다가 폈다. 접힌 두 선분이 만나는 점은 원의 무엇인가?', list, list.indexOf('원의 중심'), {
              explain: '원을 똑같이 둘로 나누도록 접힌 선분은 지름이다. 지름은 모두 원의 중심을 지나므로 두 지름이 만나는 점은 원의 중심이다.', facts: { truth: list.map((word) => word === '원의 중심'), want: true }
            });
          }),
          T('prop-chord', '원 안에 그을 수 있는 가장 긴 선분의 길이', '①32', (d) => {
            const r = d.int(4, 15);
            return N(`반지름이 ${r} cm인 원 안에 그을 수 있는 가장 긴 선분의 길이는 몇 cm인가?`, r * 2, {
              unit: 'cm', explain: `원 안에 그을 수 있는 가장 긴 선분은 지름이다. ${r} × 2 = ${r * 2}`, facts: { calc: [[`${r}*2`, 0]], unseen: [2] }
            });
          })
        ]
      },
      {
        id: 'compass', title: '컴퍼스로 원 그리기', standard: DRAW,
        types: [
          T('comp-order', '원을 그리는 차례', '①33 ②35 ③23 심26', (d) => {
            const steps = ['원의 중심이 되는 점 ㅇ을 정한다.', '컴퍼스를 원의 반지름만큼 벌린다.', '컴퍼스의 침을 점 ㅇ에 꽂고 원을 그린다.'];
            const shown = d.shuffle([0, 1, 2]), right = [0, 1, 2].map((step) => shown.indexOf(step));
            const options = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C('컴퍼스로 원을 그리는 차례대로 나열한 것은?', options.map((o) => o.map((i) => LABELS[i]).join(', ')), options.findIndex((o) => o.join() === right.join()), {
              figure: lines(shown.map((step, i) => `${LABELS[i]} ${steps[step]}`)), explain: '원의 중심이 되는 점을 정하고, 컴퍼스를 반지름만큼 벌린 다음, 컴퍼스의 침을 중심에 꽂고 원을 그린다.',
              facts: { sequence: { ranks: shown, options } }
            });
          }),
          T('comp-ruler', '컴퍼스를 벌린 길이로 지름 구하기', '①35·36 ②38·39 ③26 심27', (d) => {
            const r = d.int(2, 6);
            return N('컴퍼스의 침과 연필심 사이를 자로 재어 색 띠로 나타내었다. 이 컴퍼스로 그린 원의 지름은 몇 cm인가?', r * 2, {
              unit: 'cm', figure: ruler(0, r * 10, r + 1), explain: `컴퍼스를 벌린 길이 ${r} cm가 원의 반지름이다. ${r} × 2 = ${r * 2}`, facts: { calc: [[`${r}*2`, 0]], unseen: [2] }
            });
          }),
          T('comp-need', '지름이 주어진 원을 그릴 때 컴퍼스를 벌릴 길이', '①37 ②40 ③25 심28', (d) => {
            const cm = d.int(4, 15) * 2;
            return N(`컴퍼스로 지름이 ${cm} cm인 원을 그리려고 한다. 컴퍼스를 몇 cm만큼 벌려야 하는가?`, cm / 2, {
              unit: 'cm', explain: `컴퍼스는 원의 반지름만큼 벌린다. ${cm} ÷ 2 = ${cm / 2}`, facts: { calc: [[`${cm}/2`, 0]], unseen: [2] }
            });
          }),
          T('comp-more', '컴퍼스를 더 벌려야 하는 길이', '②41·42', (d) => {
            const a = d.int(3, 7), cm = (a + d.int(2, 6)) * 2;
            return N(`컴퍼스를 ${a} cm만큼 벌려 원을 그렸다. 지름이 ${cm} cm인 원을 그리려면 컴퍼스를 몇 cm 더 벌려야 하는가?`, cm / 2 - a, {
              unit: 'cm', explain: `지름이 ${cm} cm인 원의 반지름은 ${cm} ÷ 2 = ${cm / 2}(cm)이다. ${cm / 2} - ${a} = ${cm / 2 - a}`, facts: { calc: [[`${cm}/2-${a}`, 0]], unseen: [2] }
            });
          })
        ]
      },
      {
        id: 'design', title: '원을 이용하여 여러 가지 모양 그리기', standard: DRAW,
        types: [
          T('des-pins', '컴퍼스의 침을 꽂을 곳의 수', '①44 ②49 ③32 심31', (d) => {
            // 중심이 같은 원 여럿과 한 줄로 놓인 원: 침을 꽂는 곳은 원의 수가 아니라 원의 중심의 수이다
            const nest = d.int(2, 3), n = d.int(2, 3), radii = [1.5].concat(Array(n).fill(0.75)), row = rowOfCircles(radii, [2.25].concat(Array(n - 1).fill(1.5)));
            const circles = [G.circle(row.centers[0], 1.5), G.circle(row.centers[0], 0.9)].concat(nest === 3 ? [G.circle(row.centers[0], 0.4)] : [], row.circles.slice(1));
            return N('컴퍼스로 다음과 같은 모양을 그리려고 한다. 컴퍼스의 침을 꽂아야 할 곳은 모두 몇 군데인가?', n + 1, {
              unit: '군데', figure: draw(row.cols, row.rows, circles, '원으로 그린 모양', 0.95), explain: `원의 중심마다 컴퍼스의 침을 꽂는다. 중심이 같은 원 ${nest}개는 한 곳에 꽂아 그리므로 원의 중심은 모두 ${n + 1}개이다.`,
              facts: { pins: { centers: Array(nest).fill(row.centers[0]).concat(row.centers.slice(1)) } }
            });
          }),
          T('des-kind', '원의 중심과 반지름으로 모양 가리기', '①52 ②56 ③34 심34', (d) => {
            const KIND = {
              nest: () => draw(4, 4, [G.circle([2, 2], 1.7), G.circle([2, 2], 1.15), G.circle([2, 2], 0.6)], '원으로 그린 모양', 0.85),
              slide: () => draw(5, 3, [G.circle([1.4, 1.5], 1.1), G.circle([2.5, 1.5], 1.1), G.circle([3.6, 1.5], 1.1)], '원으로 그린 모양', 0.85),
              grow: () => draw(6, 4, [G.circle([0.9, 3.1], 0.5), G.circle([2.1, 2.9], 0.7), G.circle([4.1, 2.3], 1.3)], '원으로 그린 모양', 0.85)
            };
            const ASK = { nest: '원의 중심은 옮기지 않고 반지름만 다르게 하여 그린 모양은?', slide: '반지름은 그대로 두고 원의 중심만 옮겨 가며 그린 모양은?', grow: '원의 중심도 옮기고 반지름도 다르게 하여 그린 모양은?' };
            const shown = d.shuffle(['nest', 'slide', 'grow']), want = d.pick(['nest', 'slide', 'grow']), labels = ['가', '나', '다'];
            return C(ASK[want], labels, shown.indexOf(want), {
              figure: G.tiles(shown.map((kind, i) => [labels[i], KIND[kind]()])), explain: '원의 중심이 같은지, 반지름이 같은지를 살펴본다. 원의 크기가 같으면 반지름이 같고, 원이 한 점을 가운데로 겹쳐 있으면 중심이 같다.',
              facts: { designs: { shown, want } }
            });
          }),
          T('des-rule', '규칙에 따라 그린 다음 원', '①49 ②57 ③39 심39', (d) => {
            const a = d.int(2, 4), s = d.int(2, 3), radii = [a, a + s, a + 2 * s];
            return N(`원의 중심은 옮기지 않고 반지름이 ${radii.map((r) => r + ' cm').join(', ')}인 원을 차례로 그렸다. 같은 규칙으로 원을 1개 더 그릴 때, 그 원의 지름은 몇 cm인가?`, (a + 3 * s) * 2, {
              unit: 'cm', explain: `반지름이 ${s} cm씩 길어지는 규칙이다. 다음 원의 반지름은 ${a + 2 * s} + ${s} = ${a + 3 * s}(cm)이고, 지름은 ${a + 3 * s} × 2 = ${(a + 3 * s) * 2}(cm)이다.`,
              facts: { calc: [[`(${a + 2 * s}+(${a + 2 * s}-${a + s}))*2`, 0]], unseen: [2] }
            });
          })
        ]
      },
      {
        id: 'touch', title: '맞닿은 원과 길이', standard: PARTS,
        types: [
          T('touch-centers', '맞닿은 두 원의 중심 사이의 길이', '①53 ②64 ③41 심40', (d) => {
            const [a, b] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([x, y]) => x !== y), big = Math.max(a, b), ra = 1.7 * a / big, rb = 1.7 * b / big, row = rowOfCircles([ra, rb], [ra + rb]);
            const parts = row.circles.concat([G.line(row.centers[0], row.centers[1]), G.point(row.centers[0]), G.point(row.centers[1]), G.text([row.centers[0][0], row.centers[0][1] + 0.5], 'ㄱ'), G.text([row.centers[1][0], row.centers[1][1] + 0.5], 'ㄴ')]);
            return N(`반지름이 ${a} cm인 원과 반지름이 ${b} cm인 원이 맞닿아 있다. 점 ㄱ, 점 ㄴ이 원의 중심일 때, 선분 ㄱㄴ의 길이는 몇 cm인가?`, a + b, {
              unit: 'cm', figure: draw(row.cols, row.rows, parts, '맞닿은 두 원과 두 원의 중심 ㄱ, ㄴ', 0.95), explain: `선분 ㄱㄴ의 길이는 두 원의 반지름의 합이다. ${a} + ${b} = ${a + b}`, facts: { calc: [[`${a}+${b}`, 0]] }
            });
          }),
          T('touch-row', '한 줄로 맞닿은 같은 원의 전체 길이', '①54·56 ②65 ③42 심41', (d) => {
            const n = d.int(3, 4), r = d.int(3, 8), size = n === 3 ? 1.15 : 0.9, radii = Array(n).fill(size), row = rowOfCircles(radii, Array(n - 1).fill(size * 2)), e = ends(row, radii, ['ㄱ', 'ㄴ']);
            return N(`반지름이 ${r} cm인 원 ${n}개를 맞닿게 한 줄로 그렸다. 선분 ㄱㄴ의 길이는 몇 cm인가?`, r * 2 * n, {
              unit: 'cm', figure: draw(row.cols, row.rows, row.circles.concat(e.parts), `크기가 같은 원 ${n}개와 양 끝을 이은 선분 ㄱㄴ`, 0.95),
              explain: `선분 ㄱㄴ의 길이는 원의 지름의 ${n}배이다. 지름은 ${r} × 2 = ${r * 2}(cm)이므로 ${r * 2} × ${n} = ${r * 2 * n}`, facts: { calc: [[`${r}*2*${n}`, 0]], unseen: [2] }
            });
          }),
          T('touch-inside', '큰 원 안에 꼭 맞는 같은 원 2개', '①57 ②59·63 ③44·46 심44', (d) => {
            const cm = d.int(3, 10) * 4, c = [3, 3], R = 2.4;
            const parts = [G.circle(c, R), G.circle([c[0] - R / 2, c[1]], R / 2), G.circle([c[0] + R / 2, c[1]], R / 2), G.point(c), G.point([c[0] - R / 2, c[1]]), G.point([c[0] + R / 2, c[1]])];
            return N(`큰 원 안에 크기가 같은 작은 원 2개를 맞닿게 그렸다. 큰 원의 지름이 ${cm} cm일 때, 작은 원의 반지름은 몇 cm인가?`, cm / 4, {
              unit: 'cm', figure: draw(6, 6, parts, '큰 원 안에 꼭 맞게 맞닿은 작은 원 2개. 점은 원의 중심'), explain: `작은 원의 지름은 큰 원의 반지름과 같다. 큰 원의 반지름은 ${cm} ÷ 2 = ${cm / 2}(cm)이고, 작은 원의 반지름은 ${cm / 2} ÷ 2 = ${cm / 4}(cm)이다.`,
              facts: { calc: [[`${cm}/2/2`, 0]], unseen: [2] }
            });
          }),
          T('touch-ring', '중심이 같은 두 원', '①60 ②62 ③47 심48', (d) => {
            const [big, small] = d.until(() => [d.int(7, 15), d.int(3, 9)], ([x, y]) => x - y >= 2), c = [3, 3], R = 2.4, r = Math.max(0.9, 2.4 * small / big), a = d.pick([20, 160, 340]), p = on(c, r, a), q = on(c, R, a);
            return N(`점 ㅇ은 두 원의 중심이다. 큰 원의 반지름이 ${big} cm, 작은 원의 반지름이 ${small} cm일 때, 선분 ㄱㄴ의 길이는 몇 cm인가?`, big - small, {
              unit: 'cm', figure: draw(6, 6, [G.circle(c, R), G.circle(c, r), G.line(c, q), G.point(p), G.point(q), G.text([p[0], p[1] - 0.45], 'ㄱ'), G.text(G.beyond(c, q, 0.45), 'ㄴ'), centre(c, 'ㅇ')], '중심이 같은 두 원. 점 ㄱ은 작은 원 위에, 점 ㄴ은 큰 원 위에 있다'),
              explain: `선분 ㅇㄴ은 큰 원의 반지름, 선분 ㅇㄱ은 작은 원의 반지름이다. ${big} - ${small} = ${big - small}`, facts: { calc: [[`${big}-${small}`, 0]] }
            });
          }),
          T('touch-square', '정사각형 안에 꼭 맞는 원', '①62 ②67 ③51 심52', (d) => {
            const cm = d.int(3, 14) * 2, c = [3, 3], R = 2.2, box = [[c[0] - R, c[1] - R], [c[0] + R, c[1] - R], [c[0] + R, c[1] + R], [c[0] - R, c[1] + R]];
            return N(`한 변의 길이가 ${cm} cm인 정사각형 안에 원을 꼭 맞게 그렸다. 원의 반지름은 몇 cm인가?`, cm / 2, {
              unit: 'cm', figure: draw(6, 6, [G.polygon(box), G.circle(c, R), G.point(c)], '정사각형 안에 꼭 맞게 그린 원'), explain: `원의 지름은 정사각형의 한 변의 길이와 같다. ${cm} ÷ 2 = ${cm / 2}`, facts: { calc: [[`${cm}/2`, 0]], unseen: [2] }
            });
          }),
          T('touch-rect', '직사각형 안에 꼭 맞는 같은 원', '①64 ②69 ③55 심53', (d) => {
            const n = d.int(2, 3), r = d.int(3, 9), size = n === 2 ? 1.3 : 1.0, row = rowOfCircles(Array(n).fill(size), Array(n - 1).fill(size * 2)), y = row.centers[0][1];
            const box = [[row.centers[0][0] - size, y - size], [row.centers[n - 1][0] + size, y - size], [row.centers[n - 1][0] + size, y + size], [row.centers[0][0] - size, y + size]];
            return M(`직사각형 안에 반지름이 ${r} cm인 원 ${n}개를 꼭 맞게 그렸다. 직사각형의 가로와 세로는 각각 몇 cm인가?`, [{ label: '가로', answer: r * 2 * n, unit: 'cm' }, { label: '세로', answer: r * 2, unit: 'cm' }], {
              figure: draw(row.cols, row.rows, [G.polygon(box)].concat(row.circles), `직사각형 안에 꼭 맞게 그린 크기가 같은 원 ${n}개`, 0.95),
              explain: `원의 지름은 ${r} × 2 = ${r * 2}(cm)이다. 세로는 원의 지름과 같고, 가로는 지름의 ${n}배이므로 ${r * 2} × ${n} = ${r * 2 * n}(cm)이다.`, facts: { calc: [[`${r}*2*${n}`, 0], [`${r}*2`, 1]], unseen: [2] }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
