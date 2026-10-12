// 3학년 2학기 3단원 원 — 꼴 목록(기본꼴 1~3, 심화꼴)을 다시 대조해 보탠 문항.
// a.js·b.js가 싣지 않은 꼴 가운데 답을 수나 고르기로 받을 수 있는 것을 모두 실었다. 여기서도 뺀 것:
//  - 반지름·지름 긋기, 원 그리기, 규칙에 따라 더 그리기(작도), 까닭·규칙 쓰기(서술형)
//  - 정사각형·직사각형의 네 변의 길이의 합, 삼각형의 세 변의 길이의 합이 끼는 꼴(5학년 「다각형의 둘레와 넓이」)
//  - 두 자리 수로 나누어야 하는 꼴(4학년), 큰 원 안에 그릴 수 있는 작은 원의 수·삼각형 모양으로 늘어나는 원(세기가 어려움의 대부분)
//  - 두 원의 지름의 합·차, 빈칸 수를 모두 더하기(뜻 없는 셈)
//  - 길이가 적힌 선분에서 반지름·지름 골라 읽기는 실력의 h-diameter와 같은 꼴이라 따로 싣지 않았다.
//  - 정사각형 안 세 겹 원의 선분(기본 ③53)은 뽑은 글에 그림이 없어 모양을 알 수 없고,
//    직사각형 안 원의 일부 넷(기본 ③64)은 조건 문장을 풀어 반지름을 네 번 이어 쫓는 퍼즐이다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, box, lines, ruler, N, M, C } = B.kit;
  const G = B.kit.geo;
  const PARTS = '4수03-06', DRAW = '4수03-07';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const RAD = Math.PI / 180;
  const on = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] - r * Math.sin(deg * RAD)];
  const named = (c, p, name) => G.point(p) + G.text(G.beyond(c, p, 0.45), name);
  const centre = (c, name) => G.point(c) + (name ? G.text([c[0] - 0.36, c[1] + 0.44], name) : '');
  // 중심에서 여러 쪽으로 선분이 나갈 때: 선분 사이가 가장 넓게 벌어진 쪽에 이름을 적는다
  function centreAway(c, name, angles) {
    const list = angles.map((a) => ((a % 360) + 360) % 360).sort((x, y) => x - y);
    let best = 0, at = 0;
    list.forEach((a, i) => { const next = i + 1 < list.length ? list[i + 1] : list[0] + 360; if (next - a > best) { best = next - a; at = a + (next - a) / 2; } });
    return G.point(c) + G.text(on(c, 0.5, at), name);
  }
  const draw = (cols, rows, parts, label, scale) => G.board(cols, rows, parts, { grid: false, scale: scale || 1.1, label });
  // 모눈이 비쳐 보여야 하는 원은 칠하지 않고 그린다
  const ring = (c, r) => G.polygon(Array.from({ length: 72 }, (_, i) => on(c, r, i * 5)), 'mb-poly is-plain');
  function rowOfCircles(radii, gaps) {
    const top = Math.max(...radii), xs = [0.9 + radii[0]];
    gaps.forEach((gap) => xs.push(xs[xs.length - 1] + gap));
    const centers = xs.map((x) => [x, 0.7 + top]);
    return { centers, cols: Math.ceil(xs[xs.length - 1] + radii[radii.length - 1] + 0.9), rows: Math.ceil(top * 2 + 1.5), circles: centers.map((c, i) => G.circle(c, radii[i])) };
  }

  B.addTypes('3-2-3', 'parts', [
    T('parts-nameof', '그림 속 선분의 이름', '①2 ②6', (d) => {
      const c = [3, 3], r = 2.2, a = d.pick([30, 150, 210, 330]), dia = d.bool(), p = on(c, r, a), q = on(c, r, a + 180), list = d.shuffle(['원의 반지름', '원의 지름', '원의 중심']);
      const want = dia ? '원의 지름' : '원의 반지름';
      return C(`점 ㅇ은 원의 중심이다. 선분 ${dia ? 'ㄱㄴ' : 'ㅇㄱ'}은 원의 무엇인가?`, list, list.indexOf(want), {
        figure: draw(6, 6, [G.circle(c, r), G.line(dia ? q : c, p), named(c, p, 'ㄱ')].concat(dia ? [named(c, q, 'ㄴ')] : [], [centre(c, 'ㅇ')]), dia ? '원의 중심 ㅇ을 지나고 원 위의 두 점 ㄱ, ㄴ을 이은 선분' : '원의 중심 ㅇ과 원 위의 점 ㄱ을 이은 선분'),
        explain: dia ? '원 위의 두 점을 이은 선분이 원의 중심을 지나므로 원의 지름이다.' : '원의 중심과 원 위의 한 점을 이은 선분이므로 원의 반지름이다.', facts: { truth: list.map((word) => word === want), want: true }
      });
    }),
    T('parts-count', '반지름인 선분의 수', '②4 심5', (d) => {
      // 중심에서 원 위의 점까지 그은 선분만 반지름이다. 원 안에서 끝나는 선분, 중심을 지나지 않는 선분을 섞는다.
      const c = [3, 3], r = 2.2, n = d.int(2, 4), angles = d.shuffle([20, 75, 130, 185, 240, 300]), radii = angles.slice(0, n).map((a) => on(c, r, a)), short = on(c, r * 0.55, angles[4]), chord = [on(c, r, angles[5] - 25), on(c, r, angles[5] + 25)];
      const parts = [G.circle(c, r)].concat(radii.map((p) => G.line(c, p) + G.point(p)), [G.line(c, short), G.point(short), G.line(chord[0], chord[1]), G.point(chord[0]), G.point(chord[1]), centreAway(c, 'ㅇ', angles.slice(0, n).concat([angles[4]]))]);
      return N('점 ㅇ은 원의 중심이다. 그림에 그은 선분 중에서 원의 반지름은 모두 몇 개인가?', n, {
        unit: '개', figure: draw(6, 6, parts, `원의 중심 ㅇ에서 원 위의 점까지 그은 선분 ${n}개, 원 안에서 끝나는 선분 1개, 원의 중심을 지나지 않는 선분 1개`),
        explain: `원의 중심과 원 위의 한 점을 이은 선분만 반지름이다. 원 안에서 끝나는 선분과 원의 중심을 지나지 않는 선분은 반지름이 아니다.`, facts: { calc: [[String(n), 0]] }
      });
    }),
    T('parts-fair', '원 위의 점과 원의 중심 사이의 거리', '①13', (d) => {
      const rows = d.shuffle([['원의 중심에서 원 위의 어느 점까지나 거리가 같기 때문이다.', true], ['원 위에 서면 과녁이 더 크게 보이기 때문이다.', false], ['원 위에 선 사람끼리의 거리가 모두 같기 때문이다.', false], ['원의 지름이 반지름보다 길기 때문이다.', false]]);
      return C('과녁을 원의 중심에 놓고 모두 원 위에 서서 고리를 던지기로 하였다. 이 놀이가 공정한 까닭으로 알맞은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: '원의 중심에서 원 위의 한 점까지의 거리는 반지름이고, 한 원에서 반지름은 길이가 모두 같다. 그래서 누구나 과녁에서 같은 거리에 서게 된다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    })
  ]);

  B.addTypes('3-2-3', 'prop', [
    T('prop-times', '지름은 반지름의 몇 배', '②23 ③17', () => N('한 원에서 지름은 반지름의 몇 배인가?', 2, { unit: '배', explain: '지름은 원의 중심을 지나므로 반지름 2개를 이은 것과 같다. 지름은 반지름의 2배이다.', facts: { calc: [['2', 0]], unseen: [2] } })),
    T('prop-rule', '지름과 반지름의 관계를 나타낸 식', '②24', (d) => {
      const rows = d.shuffle([['(지름) = (반지름) × 2', true], ['(반지름) = (지름) × 2', false], ['(지름) = (반지름) + 2', false], ['(지름) = (반지름) ÷ 2', false]]);
      return C('한 원에서 지름과 반지름의 관계를 바르게 나타낸 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), { explain: '한 원에서 지름은 반지름의 2배이다.', facts: { truth: rows.map(([, ok]) => ok), want: true } });
    }),
    T('prop-table', '반지름과 지름 표 채우기', '①24 ②27', (d) => {
      const [a, b] = d.until(() => [d.int(3, 12), d.int(3, 12) * 2], ([x, y]) => x * 2 !== y && x !== y);
      return M('한 원의 반지름과 지름을 나타낸 것이다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a * 2 }, { label: LABELS[1], answer: b / 2 }], {
        figure: lines([`반지름이 ${a} cm인 원의 지름: ${box(LABELS[0])} cm`, `지름이 ${b} cm인 원의 반지름: ${box(LABELS[1])} cm`]), explain: `지름은 반지름의 2배이므로 ${a} × 2 = ${a * 2}, 반지름은 지름의 반이므로 ${b} ÷ 2 = ${b / 2}이다.`,
        facts: { calc: [[`${a}*2`, 0], [`${b}/2`, 1]], unseen: [2] }
      });
    }),
    T('prop-order', '큰 원부터 차례대로 쓰기', '①29 ②33 ③19 심18', (d) => {
      const [a, b, e] = d.until(() => [d.int(4, 9), d.int(9, 17), d.int(4, 9)], ([x, y, z]) => new Set([x * 2, y, z * 2]).size === 3), dia = [a * 2, b, e * 2], names = ['가', '나', '다'];
      const right = dia.map((_, i) => i).sort((p, q) => dia[q] - dia[p]), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('큰 원부터 차례대로 나열한 것은?', list.map((o) => o.map((i) => names[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: lines([`가: 반지름이 ${a} cm인 원`, `나: 지름이 ${b} cm인 원`, `다: 반지름이 ${e} cm인 원`]), explain: `지름으로 비교한다. 가 ${a * 2} cm, 나 ${b} cm, 다 ${e * 2} cm이다.`,
        facts: { choose: { exprs: [`${a}*2`, String(b), `${e}*2`], rule: 'descending', orders: list }, unseen: [2] }
      });
    }),
    T('prop-equal', '길이가 같은 선분 찾기', '②11 심16', (d) => {
      // 한 원에서 반지름끼리는 길이가 같다. 지름, 중심을 지나지 않는 선분을 보기에 넣는다.
      const c = [3, 3], r = 2.2, s = d.pick([{ r1: 100, r2: 20, dia: 200, chord: [250, 320] }, { r1: 60, r2: 330, dia: 150, chord: [200, 260] }]);
      const P = { ㄱ: on(c, r, s.r1), ㄴ: on(c, r, s.r2), ㄷ: on(c, r, s.dia), ㄹ: on(c, r, s.chord[0]), ㅁ: on(c, r, s.chord[1]) }, list = d.shuffle(['ㅇㄴ', 'ㄴㄷ', 'ㄹㅁ']);
      const parts = [G.circle(c, r), G.line(c, P.ㄱ), G.line(P.ㄴ, P.ㄷ), G.line(P.ㄹ, P.ㅁ)].concat(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].map((n) => named(c, P[n], n)), [centre(c, 'ㅇ')]);
      return C('점 ㅇ은 원의 중심이다. 선분 ㅇㄱ과 길이가 같은 선분은?', list.map((n) => '선분 ' + n), list.indexOf('ㅇㄴ'), {
        figure: draw(6, 6, parts, '원의 중심 ㅇ. 선분 ㅇㄱ, 원의 중심을 지나는 선분 ㄴㄷ, 원의 중심을 지나지 않는 선분 ㄹㅁ'), explain: '선분 ㅇㄱ과 선분 ㅇㄴ은 모두 원의 반지름이다. 한 원에서 반지름은 길이가 모두 같다.',
        facts: { truth: list.map((n) => n === 'ㅇㄴ'), want: true }
      });
    })
  ]);

  B.addTypes('3-2-3', 'compass', [
    T('comp-pick', '컴퍼스를 바르게 벌린 것 고르기', '①38 ②37 ③24 심29', (d) => {
      // 반지름만큼 벌려야 한다: 지름만큼 벌린 것, 한 칸 모자라게 벌린 것을 섞는다
      const r = d.int(2, 3), opens = d.shuffle([r, r * 2, r - 1]), labels = ['가', '나', '다'];
      return C(`반지름이 ${r} cm인 원을 그리려고 한다. 컴퍼스의 침과 연필심 사이를 자로 재어 색 띠로 나타낼 때, 컴퍼스를 바르게 벌린 것은?`, labels, opens.indexOf(r), {
        figure: lines(opens.map((v, i) => `${labels[i]} ${ruler(0, v * 10, r * 2 + 1)}`)), explain: `컴퍼스는 원의 반지름만큼 벌린다. 침과 연필심 사이가 ${r} cm인 것을 고른다.`, facts: { choose: { exprs: opens.map(String), rule: 'equals', target: r } }
      });
    }),
    T('comp-compare', '그린 방법이 다른 원의 크기 비교', '①39 ②43', (d) => {
      const [a, b, e] = d.until(() => [d.int(3, 8), d.int(7, 15), d.int(3, 8)], ([x, y, z]) => new Set([x * 2, y, z * 2]).size === 3 && y > x && y > z && y < Math.min(x, z) * 2);
      const rows = d.shuffle([[`컴퍼스를 ${a} cm만큼 벌려 그린 원`, `${a}*2`, a * 2], [`지름이 ${b} cm인 원`, String(b), b], [`반지름이 ${e} cm인 원`, `${e}*2`, e * 2]]);
      return C('가장 작은 원은?', rows.map(([text]) => text), rows.findIndex(([, , v]) => v === Math.min(...rows.map((row) => row[2]))), {
        explain: `컴퍼스를 벌린 길이는 반지름과 같다. 지름으로 비교하면 ${rows.map(([text, , v]) => `${text} ${v} cm`).join(', ')}이다.`, facts: { choose: { exprs: rows.map(([, x]) => x), rule: 'min' }, unseen: [2] }
      });
    })
  ]);

  B.addTypes('3-2-3', 'design', [
    T('des-count', '모양을 그리는 데 그린 원의 수', '②51 ③33 심33', (d) => {
      const nest = d.int(2, 3), n = d.int(2, 3), radii = [1.5].concat(Array(n).fill(0.75)), row = rowOfCircles(radii, [2.25].concat(Array(n - 1).fill(1.5)));
      const circles = [G.circle(row.centers[0], 1.5), G.circle(row.centers[0], 0.9)].concat(nest === 3 ? [G.circle(row.centers[0], 0.4)] : [], row.circles.slice(1));
      return N('컴퍼스로 다음과 같은 모양을 그렸다. 원을 모두 몇 개 그렸는가?', nest + n, {
        unit: '개', figure: draw(row.cols, row.rows, circles, `원으로 그린 모양: 중심이 같은 원 ${nest}개와 그 옆에 한 줄로 놓인 원 ${n}개`, 0.95), explain: `중심이 같은 원이 ${nest}개, 그 옆에 놓인 원이 ${n}개이다. ${nest} + ${n} = ${nest + n}`,
        facts: { calc: [[`${nest}+${n}`, 0]] }
      });
    }),
    T('des-most', '컴퍼스의 침을 꽂을 곳이 가장 많은 모양', '①45 ②50 심32', (d) => {
      // 가: 중심이 같은 원 셋(1곳), 나: 한 줄로 놓인 원 둘(2곳), 다: 큰 원 안에 작은 원 둘(3곳)
      const KIND = {
        1: () => draw(4, 4, [G.circle([2, 2], 1.7), G.circle([2, 2], 1.15), G.circle([2, 2], 0.6)], '원으로 그린 모양: 중심이 같은 원 3개', 0.85),
        2: () => draw(5, 3, [G.circle([1.5, 1.5], 1.1), G.circle([3.5, 1.5], 1.1)], '원으로 그린 모양: 한 줄로 맞닿은 원 2개', 0.85),
        3: () => draw(4, 4, [G.circle([2, 2], 1.7), G.circle([1.15, 2], 0.85), G.circle([2.85, 2], 0.85)], '원으로 그린 모양: 큰 원 1개와 그 안에 맞닿은 작은 원 2개', 0.85)
      };
      const shown = d.shuffle([1, 2, 3]), labels = ['가', '나', '다'];
      return C('컴퍼스로 모양을 그릴 때, 컴퍼스의 침을 꽂아야 할 곳이 가장 많은 모양은?', labels, shown.indexOf(3), {
        figure: G.tiles(shown.map((kind, i) => [labels[i], KIND[kind]()])), explain: '원의 중심의 수를 센다. 중심이 같은 원 3개는 1곳, 맞닿은 원 2개는 2곳, 큰 원 안에 작은 원 2개가 있는 모양은 3곳이다.',
        facts: { choose: { exprs: shown.map(String), rule: 'max' }, unseen: [1, 2, 3] }
      });
    }),
    T('des-grid', '원의 중심을 옮긴 규칙', '①48 ②55 ③36 심36', (d) => {
      const step = d.int(2, 3), r = 1, centers = [0, 1, 2].map((i) => [1.5 + i * step, 2]);
      return N('모눈종이에 반지름이 같은 원을 규칙에 따라 그렸다. 원의 중심을 오른쪽으로 모눈 몇 칸씩 옮겨 가며 그렸는가?', step, {
        unit: '칸', figure: G.board(3 + step * 2, 4, centers.map((c) => ring(c, r) + G.point(c)), { grid: 'lines', scale: 1.0, label: `모눈종이에 그린 원 3개: 반지름은 모두 모눈 1칸, 원의 중심은 오른쪽으로 ${step}칸씩 옮겨 감` }),
        explain: `이웃한 두 원의 중심 사이는 모눈 ${step}칸이다.`, facts: { calc: [[String(step), 0]] }
      });
    })
  ]);

  B.addTypes('3-2-3', 'touch', [
    T('touch-far', '한 원의 중심에서 옆 원의 끝까지의 길이', '①55', (d) => {
      const [a, b] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([x, y]) => x !== y), big = Math.max(a, b), ra = 1.7 * a / big, rb = 1.7 * b / big, row = rowOfCircles([ra, rb], [ra + rb]), end = [row.centers[1][0] + rb, row.centers[1][1]];
      const parts = row.circles.concat([G.line(row.centers[0], end), G.point(row.centers[0]), G.point(row.centers[1]), G.point(end), G.text([row.centers[0][0], row.centers[0][1] + 0.5], 'ㄱ'), G.text([end[0] + 0.4, end[1]], 'ㄴ')]);
      return N(`반지름이 ${a} cm인 원과 반지름이 ${b} cm인 원이 맞닿아 있다. 점 ㄱ이 왼쪽 원의 중심일 때, 선분 ㄱㄴ의 길이는 몇 cm인가?`, a + b * 2, {
        unit: 'cm', figure: draw(row.cols, row.rows, parts, '맞닿은 두 원. 점 ㄱ은 왼쪽 원의 중심, 점 ㄴ은 오른쪽 원의 오른쪽 끝', 0.95),
        explain: `선분 ㄱㄴ의 길이는 왼쪽 원의 반지름과 오른쪽 원의 지름을 더한 것이다. ${a} + ${b} × 2 = ${a + b * 2}`, facts: { calc: [[`${a}+${b}*2`, 0]], unseen: [2] }
      });
    }),
    T('touch-inside2', '작은 원의 반지름으로 큰 원의 지름 구하기', '①58 ②60', (d) => {
      const r = d.int(2, 9), c = [3, 3], R = 2.4;
      return N(`큰 원 안에 크기가 같은 작은 원 2개를 맞닿게 그렸다. 작은 원의 반지름이 ${r} cm일 때, 큰 원의 지름은 몇 cm인가?`, r * 4, {
        unit: 'cm', figure: draw(6, 6, [G.circle(c, R), G.circle([c[0] - R / 2, c[1]], R / 2), G.circle([c[0] + R / 2, c[1]], R / 2), G.point(c), G.point([c[0] - R / 2, c[1]]), G.point([c[0] + R / 2, c[1]])], '큰 원 안에 꼭 맞게 맞닿은 작은 원 2개. 점은 원의 중심'),
        explain: `큰 원의 지름은 작은 원의 지름 2개를 이은 것과 같다. 작은 원의 지름은 ${r} × 2 = ${r * 2}(cm)이므로 ${r * 2} × 2 = ${r * 4}(cm)이다.`, facts: { calc: [[`${r}*2*2`, 0]], unseen: [2] }
      });
    }),
    T('touch-square2', '원이 꼭 맞는 정사각형의 한 변', '①62 ②67', (d) => {
      const r = d.int(3, 14), c = [3, 3], R = 2.2, corner = [[c[0] - R, c[1] - R], [c[0] + R, c[1] - R], [c[0] + R, c[1] + R], [c[0] - R, c[1] + R]];
      return N(`반지름이 ${r} cm인 원을 정사각형 안에 꼭 맞게 그렸다. 정사각형의 한 변의 길이는 몇 cm인가?`, r * 2, {
        unit: 'cm', figure: draw(6, 6, [G.polygon(corner), G.circle(c, R), G.point(c)], '정사각형 안에 꼭 맞게 그린 원'), explain: `정사각형의 한 변의 길이는 원의 지름과 같다. ${r} × 2 = ${r * 2}`, facts: { calc: [[`${r}*2`, 0]], unseen: [2] }
      });
    }),
    T('touch-rect2', '직사각형의 가로로 원의 반지름 구하기', '①64 ②69 심54', (d) => {
      const n = d.int(2, 3), r = d.int(3, 9), size = n === 2 ? 1.3 : 1.0, row = rowOfCircles(Array(n).fill(size), Array(n - 1).fill(size * 2)), y = row.centers[0][1];
      const corner = [[row.centers[0][0] - size, y - size], [row.centers[n - 1][0] + size, y - size], [row.centers[n - 1][0] + size, y + size], [row.centers[0][0] - size, y + size]];
      return N(`가로가 ${r * 2 * n} cm인 직사각형 안에 크기가 같은 원 ${n}개를 꼭 맞게 그렸다. 원의 반지름은 몇 cm인가?`, r, {
        unit: 'cm', figure: draw(row.cols, row.rows, [G.polygon(corner)].concat(row.circles), `직사각형 안에 꼭 맞게 그린 크기가 같은 원 ${n}개`, 0.95),
        explain: `직사각형의 가로는 원의 지름의 ${n}배이다. 지름은 ${r * 2 * n} ÷ ${n} = ${r * 2}(cm)이고 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다.`, facts: { calc: [[`${r * 2 * n}/${n}/2`, 0]], unseen: [2] }
      });
    })
  ]);

  B.addTypes('3-2-3', 'hard', [
    H('h-through', '맞닿은 원을 가로지르는 선분', '심42', (d) => {
      // 같은 원 셋: 첫째 원의 중심에서 셋째 원의 오른쪽 끝까지 = 반지름 5개
      const n = 3, r = d.int(3, 9), size = 1.15, row = rowOfCircles(Array(n).fill(size), Array(n - 1).fill(size * 2)), y = row.centers[0][1], a = row.centers[0], b = [row.centers[2][0] + size, y];
      const list = d.shuffle([r * 5, r * 6, r * 4, r * 3]);      // 바른 것, 끝에서 끝까지, 중심에서 중심까지, 원의 수만큼 반지름
      return C(`반지름이 ${r} cm인 원 3개를 맞닿게 한 줄로 그렸다. 점 ㄱ이 왼쪽 원의 중심일 때, 선분 ㄱㄴ의 길이는 몇 cm인가?`, list.map((v) => v + ' cm'), list.indexOf(r * 5), {
        figure: draw(row.cols, row.rows, row.circles.concat([G.line(a, b), G.point(a), G.point(b), G.text([a[0], a[1] + 0.48], 'ㄱ'), G.text([b[0] + 0.4, y], 'ㄴ')]), '크기가 같은 원 3개. 점 ㄱ은 왼쪽 원의 중심, 점 ㄴ은 오른쪽 원의 오른쪽 끝', 0.95),
        explain: `선분 ㄱㄴ은 왼쪽 원의 반지름 하나와 나머지 두 원의 지름을 이은 것이다. 반지름의 5배이므로 ${r} × 5 = ${r * 5}(cm)이다.`, facts: { pick: { expr: `${r}*5`, options: list }, unseen: [5] }
      });
    })
  ]);

  // ── 꼴 목록의 제목을 한 줄씩 다시 맞춰 보고 더 보탠 것 ─────────────────────
  const PRESETS = [{ dia: [20, 200], chord: [235, 305], rad: 100 }, { dia: [160, 340], chord: [40, 110], rad: 250 }, { dia: [80, 260], chord: [130, 215], rad: 350 }];
  function threeSegments(d) {
    const c = [3, 3], r = 2.2, s = d.pick(PRESETS);
    const P = { ㅇ: c, ㄱ: on(c, r, s.rad), ㄴ: on(c, r, s.chord[0]), ㄷ: on(c, r, s.chord[1]), ㄹ: on(c, r, s.dia[0]), ㅁ: on(c, r, s.dia[1]) };
    const segs = d.shuffle([['ㅇ', 'ㄱ'], ['ㄴ', 'ㄷ'], ['ㄹ', 'ㅁ']]);
    const parts = [G.circle(c, r)].concat(segs.map(([a, b]) => G.line(P[a], P[b])), ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].map((n) => named(c, P[n], n)), [centre(c, 'ㅇ')]);
    return { figure: draw(6, 6, parts, '원과 선분 셋. 점 ㅇ은 원의 중심'), segs: segs.map(([a, b]) => ({ name: a + b, p: P[a], q: P[b] })), center: c, r };
  }

  B.addTypes('3-2-3', 'parts', [
    T('parts-turn', '띠 종이를 돌려 그린 도형', '①3', (d) => {
      const list = d.shuffle(['원', '삼각형', '정사각형', '직사각형']);
      return C('띠 종이의 한쪽 구멍에 누름 못을 꽂고, 다른 구멍에 연필을 넣어 띠 종이를 한 바퀴 돌렸다. 이때 그려지는 도형은?', list, list.indexOf('원'), {
        explain: '누름 못이 꽂힌 점에서 연필까지의 길이가 변하지 않으므로 원이 그려진다.', facts: { truth: list.map((word) => word === '원'), want: true }
      });
    }),
    T('parts-center-pic', '원의 중심을 바르게 나타낸 그림', '①6', (d) => {
      const spots = d.shuffle([[0, 0], [1.0, d.pick([40, 140, 220, 320])], [1.7, d.pick([70, 200, 290])]]), labels = ['가', '나', '다'], c = [2, 2];
      const tile = ([far, deg]) => draw(4, 4, [G.circle(c, 1.7), G.point(on(c, far, deg))], far === 0 ? '원과 한가운데에 찍은 점' : far === 1.7 ? '원과 원 위에 찍은 점' : '원과 한쪽으로 치우친 곳에 찍은 점', 0.85);
      return C('원의 중심을 바르게 나타낸 것은?', labels, spots.findIndex(([far]) => far === 0), {
        figure: G.tiles(spots.map((spot, i) => [labels[i], tile(spot)])), explain: '원의 중심은 원의 한가운데에 있는 점이다. 원의 중심에서 원 위의 점까지의 길이는 어느 쪽으로 재어도 같다.', facts: { truth: spots.map(([far]) => far === 0), want: true }
      });
    }),
    T('parts-count-d', '지름인 선분의 수', '심5', (d) => {
      // 중심을 지나는 선분만 지름이다. 원 위의 두 점을 이었지만 중심을 지나지 않는 선분을 섞는다.
      const c = [3, 3], r = 2.2, n = d.int(2, 3), base = d.pick([10, 25]), dias = [0, 60, 120].slice(0, n).map((a) => base + a), chords = [[base + 15, base + 105], [base + 195, base + 290]];
      const parts = [G.circle(c, r)].concat(dias.map((a) => G.line(on(c, r, a), on(c, r, a + 180)) + G.point(on(c, r, a)) + G.point(on(c, r, a + 180))), chords.map(([a, b]) => G.line(on(c, r, a), on(c, r, b)) + G.point(on(c, r, a)) + G.point(on(c, r, b))), [centreAway(c, 'ㅇ', dias.concat(dias.map((a) => a + 180)))]);
      return N('점 ㅇ은 원의 중심이다. 그림에 그은 선분 중에서 원의 지름은 모두 몇 개인가?', n, {
        unit: '개', figure: draw(6, 6, parts, `원 위의 두 점을 이은 선분 가운데 원의 중심 ㅇ을 지나는 선분 ${n}개, 원의 중심을 지나지 않는 선분 2개`),
        explain: '원 위의 두 점을 이은 선분 중에서 원의 중심을 지나는 선분만 지름이다.', facts: { calc: [[String(n), 0]] }
      });
    }),
    T('parts-same-d', '한 원의 지름의 길이', '②8·9', (d) => {
      const c = [3, 3], r = 2.2, [a, b] = d.pick([[20, 100], [150, 60], [10, 130]]), cm = d.int(6, 24), P = { ㄱ: on(c, r, a), ㄴ: on(c, r, a + 180), ㄷ: on(c, r, b), ㄹ: on(c, r, b + 180) };
      return N(`점 ㅇ은 원의 중심이다. 선분 ㄱㄴ의 길이가 ${cm} cm일 때, 선분 ㄷㄹ의 길이는 몇 cm인가?`, cm, {
        unit: 'cm', figure: draw(6, 6, [G.circle(c, r), G.line(P.ㄱ, P.ㄴ), G.line(P.ㄷ, P.ㄹ)].concat(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'].map((n) => named(c, P[n], n)), [centreAway(c, 'ㅇ', [a, a + 180, b, b + 180])]), '원의 중심 ㅇ을 지나는 선분 ㄱㄴ과 선분 ㄷㄹ'),
        explain: `선분 ㄱㄴ과 선분 ㄷㄹ은 모두 원의 지름이다. 한 원에서 지름은 길이가 모두 같으므로 ${cm} cm이다.`, facts: { calc: [[String(cm), 0]] }
      });
    })
  ]);

  B.addTypes('3-2-3', 'prop', [
    T('prop-halve', '원을 똑같이 둘로 나누는 선분', '①20 ②21 ③11', (d) => {
      const fig = threeSegments(d);
      return C('원을 똑같이 둘로 나누는 선분은?', fig.segs.map((s) => '선분 ' + s.name), fig.segs.findIndex((s) => s.name === 'ㄹㅁ'), {
        figure: fig.figure, explain: '원을 똑같이 둘로 나누는 선분은 원의 중심을 지나는 지름이다. 선분 ㄹㅁ이 지름이다.', facts: { circleSegs: { center: fig.center, r: fig.r, segs: fig.segs, want: 'diameter' } }
      });
    }),
    T('prop-through', '지름이 모두 지나는 점', '①21 ③5', (d) => {
      const rows = d.shuffle([['원의 중심', true], ['원 위의 한 점', false], ['원 밖의 한 점', false], ['지나는 점이 정해져 있지 않다.', false]]);
      return C('한 원에 지름을 여러 개 그었다. 지름이 모두 지나는 점은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: '지름은 원 위의 두 점을 이은 선분 중에서 원의 중심을 지나는 선분이다. 지름은 모두 원의 중심을 지난다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('prop-ox', '선분 이름으로 말한 원의 성질', '②29', (d) => {
      const c = [3, 3], r = 2.2, s = d.pick([{ r1: 100, r2: 20, dia: 200, chord: [250, 320] }, { r1: 60, r2: 330, dia: 150, chord: [200, 260] }]);
      const P = { ㄱ: on(c, r, s.r1), ㄴ: on(c, r, s.r2), ㄷ: on(c, r, s.dia), ㄹ: on(c, r, s.chord[0]), ㅁ: on(c, r, s.chord[1]) };
      const rows = d.shuffle([['선분 ㄴㄷ의 길이는 선분 ㅇㄱ의 길이의 2배이다.', true], ['선분 ㄹㅁ은 원을 똑같이 둘로 나눈다.', false], ['선분 ㅇㄱ은 원의 지름이다.', false], ['선분 ㄹㅁ의 길이는 선분 ㄴㄷ의 길이와 같다.', false]]);
      const parts = [G.circle(c, r), G.line(c, P.ㄱ), G.line(P.ㄴ, P.ㄷ), G.line(P.ㄹ, P.ㅁ)].concat(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].map((n) => named(c, P[n], n)), [centre(c, 'ㅇ')]);
      return C('점 ㅇ은 원의 중심이고, 점 ㄱ, ㄴ, ㄷ, ㄹ, ㅁ은 원 위의 점이다. 옳은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: draw(6, 6, parts, '원의 중심 ㅇ. 선분 ㅇㄱ, 원의 중심을 지나는 선분 ㄴㄷ, 원의 중심을 지나지 않는 선분 ㄹㅁ'),
        explain: '선분 ㄴㄷ은 지름이고 선분 ㅇㄱ은 반지름이다. 지름은 반지름의 2배이다. 선분 ㄹㅁ은 원의 중심을 지나지 않으므로 지름보다 짧고, 원을 똑같이 둘로 나누지 못한다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('prop-why', '지름이 아닌 까닭', '①12 ②15 ③14 심8', (d) => {
      const c = [3, 3], r = 2.2, [a, b] = d.pick([[30, 130], [200, 300], [100, 190]]), p = on(c, r, a), q = on(c, r, b);
      const rows = d.shuffle([['원의 중심을 지나지 않기 때문이다.', true], ['원 위의 두 점을 이은 선분이기 때문이다.', false], ['원의 안쪽에 그은 선분이기 때문이다.', false], ['선분의 길이가 반지름보다 길기 때문이다.', false]]);
      return C('점 ㅇ은 원의 중심이다. 선분 ㄱㄴ이 원의 지름이 아닌 까닭은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: draw(6, 6, [G.circle(c, r), G.line(p, q), named(c, p, 'ㄱ'), named(c, q, 'ㄴ'), centre(c, 'ㅇ')], '원의 중심 ㅇ과, 원 위의 두 점을 이었지만 원의 중심을 지나지 않는 선분 ㄱㄴ'),
        explain: '지름은 원 위의 두 점을 이은 선분 중에서 원의 중심을 지나는 선분이다. 선분 ㄱㄴ은 원의 중심 ㅇ을 지나지 않는다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    })
  ]);

  B.addTypes('3-2-3', 'compass', [
    T('comp-pin', '컴퍼스의 침을 꽂은 곳', '②36', (d) => {
      const list = d.shuffle(['원의 중심', '원의 반지름', '원의 지름']);
      return C('컴퍼스로 원을 그렸다. 컴퍼스의 침을 꽂았던 곳은 원의 무엇이 되는가?', list, list.indexOf('원의 중심'), { explain: '컴퍼스의 침을 꽂은 점이 원의 중심이 되고, 컴퍼스를 벌린 길이가 원의 반지름이 된다.', facts: { truth: list.map((word) => word === '원의 중심'), want: true } });
    }),
    T('comp-match', '컴퍼스를 벌린 길이에 맞는 원', '①39', (d) => {
      // 벌린 길이는 반지름이다: 벌린 길이를 지름으로 여기는 아이, 반으로 줄이는 아이가 고를 보기를 넣는다
      const r = d.int(2, 6) * 2, rows = d.shuffle([[`지름이 ${r} cm인 원`, String(r)], [`지름이 ${r * 2} cm인 원`, String(r * 2)], [`반지름이 ${r * 2} cm인 원`, `${r * 2}*2`], [`반지름이 ${r / 2} cm인 원`, `${r / 2}*2`]]);
      return C(`컴퍼스를 ${r} cm만큼 벌려 그린 원은?`, rows.map(([text]) => text), rows.findIndex(([, x]) => x === String(r * 2)), {
        explain: `컴퍼스를 벌린 길이는 원의 반지름이다. 반지름이 ${r} cm인 원의 지름은 ${r} × 2 = ${r * 2}(cm)이다.`, facts: { choose: { exprs: rows.map(([, x]) => x), rule: 'equals', target: r * 2 }, unseen: [2] }
      });
    })
  ]);

  B.addTypes('3-2-3', 'design', [
    T('des-grow', '원의 반지름이 늘어난 규칙', '①48 ②55 심36', (d) => {
      const k = d.int(1, 2), radii = k === 1 ? [1, 2, 3] : [1, 3, 5], size = radii[2] * 2 + 2, c = [radii[2] + 1, radii[2] + 1];
      return N('모눈종이에 중심이 같은 원을 규칙에 따라 그렸다. 원의 반지름은 모눈 몇 칸씩 늘어나는가?', k, {
        unit: '칸', figure: G.board(size, size, radii.map((r) => ring(c, r)).concat([G.point(c)]), { grid: 'lines', scale: k === 1 ? 1.0 : 0.7, label: `모눈종이에 그린 중심이 같은 원 3개: 반지름은 모눈 ${radii.join('칸, ')}칸` }),
        explain: `원의 반지름은 모눈 ${radii.join('칸, ')}칸이다. 원의 중심은 옮기지 않고 반지름만 ${k}칸씩 늘려 그렸다.`, facts: { calc: [[`${radii[1]}-${radii[0]}`, 0]] }
      });
    })
  ]);

  B.addTypes('3-2-3', 'touch', [
    T('touch-inside-n', '큰 원 안에 한 줄로 맞닿은 작은 원 3개', '②63 심44', (d) => {
      const r = d.int(2, 6), c = [3, 3], R = 2.4, s = R / 3;
      return N(`큰 원 안에 크기가 같은 작은 원 3개를 한 줄로 맞닿게 그렸다. 큰 원의 지름이 ${r * 6} cm일 때, 작은 원의 반지름은 몇 cm인가?`, r, {
        unit: 'cm', figure: draw(6, 6, [G.circle(c, R)].concat([-2, 0, 2].map((k) => G.circle([c[0] + k * s, c[1]], s) + G.point([c[0] + k * s, c[1]]))), '큰 원 안에 한 줄로 꼭 맞게 맞닿은 작은 원 3개. 점은 작은 원의 중심'),
        explain: `큰 원의 지름은 작은 원의 지름의 3배이다. 작은 원의 지름은 ${r * 6} ÷ 3 = ${r * 2}(cm)이고 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다.`, facts: { calc: [[`${r * 6}/3/2`, 0]], unseen: [2] }
      });
    }),
    T('touch-side', '정사각형의 변을 지름으로 하는 원', '③54', (d) => {
      const r = d.int(3, 12), x0 = 0.9, y0 = 0.9, s = 2.6, corner = [[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]], c = [x0 + s, y0 + s / 2];
      return N(`한 변의 길이가 ${r * 2} cm인 정사각형의 한 변을 지름으로 하는 원을 그렸다. 원의 반지름은 몇 cm인가?`, r, {
        unit: 'cm', figure: draw(6, 5, [G.polygon(corner), G.circle(c, s / 2), G.line(corner[1], corner[2]), G.point(c)], '정사각형과, 그 오른쪽 변을 지름으로 하는 원. 점은 원의 중심'),
        explain: `원의 지름은 정사각형의 한 변과 같은 ${r * 2} cm이다. 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다.`, facts: { calc: [[`${r * 2}/2`, 0]], unseen: [2] }
      });
    })
  ]);

  B.addTypes('3-2-3', 'hard', [
    H('h-times', '반지름이 몇 배인 두 원', '심22', (d) => {
      // 가의 지름을 바로 나누는 아이(2배 큰 답), 가의 반지름에서 멈추는 아이, 거꾸로 곱하는 아이
      const k = d.int(3, 4), r = d.int(2, 6), D = r * k * 2, list = d.shuffle([r, r * 2, r * k, r * k * k]);
      return C(`가 원의 반지름은 나 원의 반지름의 ${k}배이다. 가 원의 지름이 ${D} cm일 때, 나 원의 반지름은 몇 cm인가?`, list.map((v) => v + ' cm'), list.indexOf(r), {
        explain: `가 원의 반지름은 ${D} ÷ 2 = ${r * k}(cm)이다. 나 원의 반지름은 ${r * k} ÷ ${k} = ${r}(cm)이다.`, facts: { pick: { expr: `${D}/2/${k}`, options: list }, unseen: [2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
