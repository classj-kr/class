// 3학년 2학기 3단원 원 — 꼴 목록의 본문(대표 문제와 「변형」)을 한 꼴씩 다시 읽어 보탠 문항.
// a·b·c.js는 꼴의 제목을 맞춰 실었다. 여기에는 제목은 같아도 그림의 얼개나 묻는 것이 다른 변형을 실었다.
//  - 그림의 얼개가 다른 것: 그림마다 선분 하나만 그은 세 그림, 원 안의 삼각형, 큰 원의 중심을 지나는 작은 원, 겹친 두 원,
//    서로 맞닿은 세 원·네 원의 중심을 이은 도형, 원의 일부가 든 모양, 모눈 위에서 중심도 옮기고 크기도 바꾼 원
//  - 묻는 것이 다른 것: 두 번째로 큰 원, 선분의 이름으로 묻는 길이, 길이가 같은 변, 중심 사이의 길이, 거꾸로 구하기
// 여기서도 뺀 것(자세한 것은 수집본 분석 폴더의 채우기_대조표.md)
//  - 반지름·지름 긋기, 원 그리기, 규칙에 따라 더 그리기(작도), 까닭·규칙 쓰기(서술형)
//  - 네 변의 길이의 합·세 변의 길이의 합을 구하게 하는 꼴(5학년 「다각형의 둘레와 넓이」). 같은 그림에서 한 변의 길이만 묻는 것은 실었다.
//  - 두 자리 수로 나누어야 하는 꼴(4학년), 큰 원 안에 그릴 수 있는 작은 원의 수·여러 줄로 놓인 원의 중심 세기(세기가 어려움의 대부분)
//  - 두 원의 지름의 합·차, 빈칸 수를 모두 더하기(뜻 없는 셈)
// 그림: 다른 선이나 모눈이 비쳐 보여야 하는 원은 칠하지 않은 원(ring)으로 그린다. 칠한 원을 겹쳐 그리면 먼저 그린 선이 가려진다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, box, lines, ruler, N, M, C } = B.kit;
  const G = B.kit.geo;
  const DRAW = '4수03-07';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});

  // ── 그림 ─────────────────────────────────────────────────────
  const RAD = Math.PI / 180;
  const on = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] - r * Math.sin(deg * RAD)];   // 원 위의 점(각도는 오른쪽에서 시계 반대쪽으로)
  const named = (c, p, name) => G.point(p) + G.text(G.beyond(c, p, 0.45), name);                  // 점과 이름(중심의 반대쪽에 적는다)
  const below = (p, name) => G.point(p) + G.text([p[0], p[1] + 0.48], name);                      // 점과 그 아래에 적는 이름
  const length = (p, value) => G.text(p, value, 'mb-label is-length');                           // 그림 속 길이
  // 중심에서 여러 쪽으로 선분이 나갈 때: 선분 사이가 가장 넓게 벌어진 쪽에 이름을 적는다
  function centreAway(c, name, angles) {
    const list = angles.map((a) => ((a % 360) + 360) % 360).sort((x, y) => x - y);
    let best = 0, at = 0;
    list.forEach((a, i) => { const next = i + 1 < list.length ? list[i + 1] : list[0] + 360; if (next - a > best) { best = next - a; at = a + (next - a) / 2; } });
    return G.point(c) + G.text(on(c, 0.5, at), name);
  }
  const draw = (cols, rows, parts, label, scale) => G.board(cols, rows, parts, { grid: false, scale: scale || 1.1, label });
  // 칠하지 않은 원과 원의 일부
  const ring = (c, r) => G.polygon(Array.from({ length: 72 }, (_, i) => on(c, r, i * 5)), 'mb-poly is-plain');
  const arc = (c, r, from, to) => G.polyline(Array.from({ length: Math.round((to - from) / 5) + 1 }, (_, i) => on(c, r, from + i * 5)));
  // 한 줄로 놓인 원: gaps 는 이웃한 중심 사이의 거리(그림 칸 수)
  function rowOfCircles(radii, gaps, plain) {
    const top = Math.max(...radii), xs = [0.9 + radii[0]];
    gaps.forEach((gap) => xs.push(xs[xs.length - 1] + gap));
    const centers = xs.map((x) => [x, 0.7 + top]);
    return { centers, y: 0.7 + top, cols: Math.ceil(xs[xs.length - 1] + radii[radii.length - 1] + 0.9), rows: Math.ceil(top * 2 + 1.5), circles: centers.map((c, i) => (plain ? ring(c, radii[i]) : G.circle(c, radii[i]))) };
  }
  // 누름 못과 구멍 넷이 있는 띠 종이
  const tape = (pin, holes) => [G.polygon([[0.4, 0.65], [7.2, 0.65], [7.2, 1.75], [0.4, 1.75]]), G.point([pin, 1.2]), G.text([pin, 0.25], '누름 못')].concat(holes.map((x, i) => G.circle([x, 1.2], 0.17) + G.text([x, 2.25], LABELS[i])));
  const cmList = (list) => list.map((v) => v + ' cm');

  // ── 원의 중심, 반지름, 지름 ───────────────────────────────────
  B.addTypes('3-2-3', 'parts', [
    T('parts-tape-say', '누름 못과 띠 종이로 그린 원', '①1 ③2·9 심6·10', (d) => {
      // 띠 종이의 길이를 지름으로 여기는 아이, 가까운 구멍일수록 큰 원이라고 여기는 아이를 겨눈다. 서로 맞서는 두 문장은 함께 내지 않는다.
      const pair = d.pick([
        [['누름 못에서 먼 구멍에 연필을 꽂을수록 큰 원이 그려진다.', true], ['누름 못에서 연필을 꽂은 구멍까지의 길이가 원의 지름이 된다.', false]],
        [['누름 못에서 연필을 꽂은 구멍까지의 길이가 원의 반지름이 된다.', true], ['누름 못에서 가까운 구멍에 연필을 꽂을수록 큰 원이 그려진다.', false]]
      ]);
      const rows = d.shuffle([['누름 못이 꽂힌 곳이 원의 중심이 된다.', true], ['띠 종이를 한 바퀴 돌리는 동안 누름 못에서 연필까지의 길이는 변하지 않는다.', true]].concat(pair));
      return C('누름 못과 구멍이 뚫린 띠 종이로 원을 그린다. 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        explain: '누름 못이 꽂힌 곳이 원의 중심이고, 누름 못에서 연필을 꽂은 구멍까지의 길이가 원의 반지름이다. 반지름이 길수록 원이 크므로 누름 못에서 먼 구멍에 꽂을수록 큰 원이 그려진다.',
        facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('parts-tape-2nd', '두 번째로 큰 원을 그리는 구멍', '②16', (d) => {
      const [pin, holes] = d.pick([[1, [2.2, 3.4, 4.6, 6.4]], [6, [1, 2.8, 4, 5]], [3, [0.9, 2, 4.4, 6.6]], [4.4, [0.8, 3.2, 5.4, 6.8]]]);
      const far = holes.map((x) => Math.abs(x - pin)), second = far.slice().sort((x, y) => y - x)[1];
      return C('누름 못과 띠 종이로 원을 그리려고 한다. 두 번째로 큰 원을 그리려면 연필을 어느 구멍에 꽂아야 하는가?', LABELS, far.indexOf(second), {
        figure: draw(7.6, 2.6, tape(pin, holes), '띠 종이: 누름 못과 구멍 넷'), explain: '누름 못에서 연필을 꽂은 구멍까지의 길이가 원의 반지름이 된다. 누름 못에서 두 번째로 먼 구멍에 꽂으면 두 번째로 큰 원이 그려진다.',
        facts: { rank: { values: far, nth: 2 } }
      });
    }),
    T('parts-radius-pic', '반지름을 바르게 그은 그림', '①7 ②3 ③3', (d) => {
      // 한쪽 끝이 원 위에 닿지 않은 선분을 꼭 넣고, 원의 중심을 지나지 않는 선분이나 지름을 하나 더 넣는다
      const c = [1.8, 1.8], r = 1.5, a = d.pick([35, 145, 215, 325]);
      const SEG = { radius: [c, on(c, r, a)], short: [c, on(c, r * 0.55, a)], chord: [on(c, r, a - 50), on(c, r, a + 50)], dia: [on(c, r, a), on(c, r, a + 180)] };
      const SAY = { radius: '원의 중심 ㅇ에서 원 위의 점까지 그은 선분', short: '원의 중심 ㅇ에서 원 안의 점까지 그은 선분', chord: '원 위의 두 점을 이었지만 원의 중심 ㅇ을 지나지 않는 선분', dia: '원의 중심 ㅇ을 지나고 원 위의 두 점을 이은 선분' };
      const kinds = d.shuffle(['radius', 'short', d.pick(['chord', 'dia'])]), labels = ['가', '나', '다'];
      const tile = (kind) => draw(3.6, 3.6, [G.circle(c, r), G.line(SEG[kind][0], SEG[kind][1]), G.point(SEG[kind][0]), G.point(SEG[kind][1]), G.point(c), G.text(on(c, 0.5, kind === 'dia' ? a + 90 : a + 180), 'ㅇ')], SAY[kind], 1.0);
      return C('점 ㅇ은 원의 중심이다. 원의 반지름을 바르게 그은 것은?', labels, kinds.indexOf('radius'), {
        figure: G.tiles(kinds.map((kind, i) => [labels[i], tile(kind)])), explain: '반지름은 원의 중심과 원 위의 한 점을 이은 선분이다. 한쪽 끝은 원의 중심에, 다른 쪽 끝은 원 위에 있는 선분을 고른다.',
        facts: { circleSegs: { center: c, r, segs: kinds.map((kind, i) => ({ name: labels[i], p: SEG[kind][0], q: SEG[kind][1] })), want: 'radius' } }
      });
    }),
    T('parts-diameter-pic', '지름을 바르게 그은 그림', '①8 ③4', (d) => {
      // 원의 중심을 지나지만 한쪽 끝이 원 위에 닿지 않은 선분을 꼭 넣는다
      const c = [1.8, 1.8], r = 1.5, a = d.pick([25, 155, 205, 335]);
      const SEG = { dia: [on(c, r, a), on(c, r, a + 180)], half: [on(c, r, a), on(c, r * 0.5, a + 180)], chord: [on(c, r, a - 50), on(c, r, a + 50)], radius: [c, on(c, r, a)] };
      const SAY = { dia: '원의 중심 ㅇ을 지나고 원 위의 두 점을 이은 선분', half: '원의 중심 ㅇ을 지나지만 한쪽 끝이 원 안에 있는 선분', chord: '원 위의 두 점을 이었지만 원의 중심 ㅇ을 지나지 않는 선분', radius: '원의 중심 ㅇ에서 원 위의 점까지 그은 선분' };
      const kinds = d.shuffle(['dia', 'half', d.pick(['chord', 'radius'])]), labels = ['가', '나', '다'];
      const tile = (kind) => draw(3.6, 3.6, [G.circle(c, r), G.line(SEG[kind][0], SEG[kind][1]), G.point(SEG[kind][0]), G.point(SEG[kind][1]), G.point(c), G.text(on(c, 0.5, kind === 'dia' || kind === 'half' ? a + 90 : a + 180), 'ㅇ')], SAY[kind], 1.0);
      return C('점 ㅇ은 원의 중심이다. 원의 지름을 바르게 그은 것은?', labels, kinds.indexOf('dia'), {
        figure: G.tiles(kinds.map((kind, i) => [labels[i], tile(kind)])), explain: '지름은 원 위의 두 점을 이은 선분 중에서 원의 중심을 지나는 선분이다. 원의 중심을 지나고 양쪽 끝이 모두 원 위에 있는 선분을 고른다.',
        facts: { circleSegs: { center: c, r, segs: kinds.map((kind, i) => ({ name: labels[i], p: SEG[kind][0], q: SEG[kind][1] })), want: 'diameter' } }
      });
    }),
    T('parts-howmany', '한 원에 그을 수 있는 반지름과 지름의 수', '①9 ②12 ③10', (d) => {
      const what = d.pick(['반지름', '지름']), list = d.shuffle(['1개', '2개', '4개', '셀 수 없이 많다']);
      return C(`한 원에 그을 수 있는 ${what}은 모두 몇 개인가?`, list, list.indexOf('셀 수 없이 많다'), {
        explain: '원 위의 점은 셀 수 없이 많다. 원의 중심과 원 위의 점을 이으면 모두 반지름이 되고, 원의 중심을 지나게 원 위의 두 점을 이으면 모두 지름이 되므로 반지름과 지름은 셀 수 없이 많이 그을 수 있다.',
        facts: { truth: list.map((text) => text === '셀 수 없이 많다'), want: true }
      });
    }),
    T('parts-read', '길이가 적힌 선분에서 반지름과 지름 읽기', '①10 ②10·27 ③7', (d) => {
      // 원의 중심을 지나지 않는 선분의 길이를 섞어 준다. 어느 선분이 반지름이고 지름인지 가려 읽는다.
      const c = [3, 3], r = 2.2, [cm, chord] = d.until(() => [d.int(4, 9), d.int(5, 12)], ([x, y]) => y > x && y * 10 >= x * 11 && y * 10 <= x * 14);
      const flip = d.bool(), half = Math.asin(chord / (cm * 2)) / RAD, dia = flip ? 160 : 20, rad = flip ? 80 : 100;
      const P = { ㄱ: on(c, r, rad), ㄴ: on(c, r, flip ? dia : dia + 180), ㄷ: on(c, r, flip ? dia + 180 : dia), ㄹ: on(c, r, 270 - half), ㅁ: on(c, r, 270 + half) };
      const rows = d.shuffle([`선분 ㅇㄱ: ${cm} cm`, `선분 ㄴㄷ: ${cm * 2} cm`, `선분 ㄹㅁ: ${chord} cm`]);
      const parts = [G.circle(c, r), G.line(P.ㄴ, P.ㄷ), G.line(c, P.ㄱ), G.line(P.ㄹ, P.ㅁ)].concat(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].map((n) => named(c, P[n], n)), [centreAway(c, 'ㅇ', [dia, dia + 180, rad])]);
      return M('점 ㅇ은 원의 중심이다. 세 선분의 길이가 다음과 같을 때, 원의 반지름과 지름은 각각 몇 cm인가?', [{ label: '반지름', answer: cm, unit: 'cm' }, { label: '지름', answer: cm * 2, unit: 'cm' }], {
        figure: draw(6, 6, parts, '원의 중심 ㅇ. 원의 중심과 원 위의 점을 이은 선분 ㅇㄱ, 원의 중심을 지나는 선분 ㄴㄷ, 원의 중심을 지나지 않는 선분 ㄹㅁ') + lines(rows),
        explain: `선분 ㅇㄱ은 원의 중심과 원 위의 한 점을 이었으므로 반지름이고, 선분 ㄴㄷ은 원의 중심을 지나므로 지름이다. 선분 ㄹㅁ은 원의 중심을 지나지 않으므로 반지름도 지름도 아니다.`,
        facts: { calc: [[`${cm * 2}/2`, 0], [`${cm}*2`, 1]], unseen: [2] }
      });
    }),
    T('parts-grid', '모눈종이에 그린 원의 반지름', '심14', (d) => {
      const n = d.int(2, 4), k = d.int(2, 3), size = n * 2 + 2, c = [n + 1, n + 1];
      return N(`모눈 한 칸의 길이는 ${k} cm이다. 모눈종이에 그린 원의 반지름은 몇 cm인가?`, n * k, {
        unit: 'cm', figure: G.board(size, size, [ring(c, n), G.point(c)], { grid: 'lines', scale: n === 4 ? 0.85 : 1.0, label: `모눈종이에 그린 원과 원의 중심: 원의 중심에서 원 위의 점까지 모눈 ${n}칸` }),
        explain: `원의 중심에서 원 위의 점까지는 모눈 ${n}칸이다. 한 칸의 길이가 ${k} cm이므로 반지름은 ${k} × ${n} = ${n * k}(cm)이다.`, facts: { calc: [[`${n}*${k}`, 0]] }
      });
    }),
    T('parts-notcircle', '원이 아닌 까닭', '심9', (d) => {
      const [a, b] = d.until(() => [d.int(5, 9), d.int(3, 7)], ([x, y]) => y * 100 >= x * 55 && y * 100 <= x * 75), c = [3.2, 2.5], rx = 2.5, ry = rx * b / a, right = [c[0] + rx, c[1]], top = [c[0], c[1] - ry];
      const oval = Array.from({ length: 72 }, (_, i) => [c[0] + rx * Math.cos(i * 5 * RAD), c[1] - ry * Math.sin(i * 5 * RAD)]);
      const rows = d.shuffle([['점 ㅇ에서 굽은 선 위의 점까지의 길이가 모두 같지는 않기 때문이다.', true], ['굽은 선으로 둘러싸인 도형이기 때문이다.', false], ['뾰족한 곳이 없는 도형이기 때문이다.', false], ['도형 안에 선분을 그을 수 있기 때문이다.', false]]);
      const parts = [G.polygon(oval), G.line(c, right), G.line(c, top), G.point(right), G.point(top), G.point(c), G.text([right[0] + 0.4, right[1]], 'ㄱ'), G.text([top[0], top[1] - 0.42], 'ㄴ'), G.text([c[0] - 0.36, c[1] + 0.44], 'ㅇ'), length([c[0] + rx / 2 + 0.2, c[1] + 0.45], `${a} cm`), length([c[0] - 0.82, c[1] - ry / 2], `${b} cm`)];
      return C('굽은 선으로 둘러싸인 도형 안의 점 ㅇ에서 굽은 선 위의 두 점까지 선분을 그어 길이를 재었다. 이 도형이 원이 아닌 까닭으로 알맞은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: draw(6.5, 5, parts, `길쭉하게 굽은 선으로 둘러싸인 도형. 선분 ㅇㄱ ${a} cm, 선분 ㅇㄴ ${b} cm`),
        explain: `원은 원의 중심에서 원 위의 어느 점까지나 길이가 같다. 이 도형은 점 ㅇ에서 굽은 선 위의 점까지의 길이가 ${a} cm, ${b} cm로 서로 다르므로 원이 아니다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('parts-talk', '지름의 길이를 알 때 원에 대한 설명', '덧문서 한대희 수행평가', (d) => {
      // 지름에 적힌 길이를 반지름으로 읽는 아이를 겨눈다
      const c = [3, 3], r = 2.2, a = d.pick([15, 160, 200, 340]), D = d.int(4, 12) * 2, p = on(c, r, a), q = on(c, r, a + 180);
      const rows = d.shuffle([[`원의 반지름은 ${D} cm이다.`, false], [`선분 ㅇㄱ의 길이는 ${D / 2} cm이다.`, true], ['선분 ㄱㄴ은 원 안에 그을 수 있는 가장 긴 선분이다.', true], ['선분 ㄱㄴ은 원을 똑같이 둘로 나눈다.', true]]);
      return C(`점 ㅇ은 원의 중심이고, 선분 ㄱㄴ의 길이는 ${D} cm이다. 옳지 않은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        figure: draw(6, 6, [G.circle(c, r), G.line(p, q), named(c, p, 'ㄱ'), named(c, q, 'ㄴ'), centreAway(c, 'ㅇ', [a, a + 180])], '원의 중심 ㅇ을 지나고 원 위의 두 점 ㄱ, ㄴ을 이은 선분'),
        explain: `선분 ㄱㄴ은 원의 중심을 지나므로 지름이다. 지름이 ${D} cm이므로 반지름은 ${D} ÷ 2 = ${D / 2}(cm)이다.`, facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    })
  ]);

  // ── 원의 성질 ────────────────────────────────────────────────
  B.addTypes('3-2-3', 'prop', [
    T('prop-word', '두 설명에 공통으로 들어갈 낱말', '①1·17 ②22', (d) => {
      const rows = d.shuffle([`원을 똑같이 둘로 나누는 선분은 원의 ${box()}이다.`, `원 안에 그을 수 있는 가장 긴 선분은 원의 ${box()}이다.`]), list = d.shuffle(['반지름', '지름', '중심']);
      return C('□ 안에 공통으로 들어갈 말은?', list, list.indexOf('지름'), {
        figure: lines(rows), explain: '원을 똑같이 둘로 나누는 선분도, 원 안에 그을 수 있는 가장 긴 선분도 원의 지름이다.', facts: { truth: list.map((word) => word === '지름'), want: true }
      });
    }),
    T('prop-fold-line', '원 모양 종이를 반으로 접어 생기는 선분', '①18 ②1 ③22', (d) => {
      const c = [3, 3], r = 2.2, a = d.pick([20, 70, 110, 160]), list = d.shuffle(['원의 중심', '원의 반지름', '원의 지름']);
      return C('원 모양의 종이를 완전히 포개어지도록 반으로 접었다가 폈다. 접힌 선분은 원의 무엇인가?', list, list.indexOf('원의 지름'), {
        figure: draw(6, 6, [G.circle(c, r), G.line(on(c, r, a), on(c, r, a + 180), 'mb-line is-cut')], '원 모양의 종이와 반으로 접힌 선'),
        explain: '완전히 포개어지도록 접으면 접힌 선분이 원을 똑같이 둘로 나눈다. 원을 똑같이 둘로 나누는 선분은 원의 지름이다.', facts: { truth: list.map((word) => word === '원의 지름'), want: true }
      });
    }),
    T('prop-seg-d2r', '지름인 선분의 길이로 반지름인 선분 구하기', '①11 ②26 심16', (d) => {
      const c = [3, 3], r = 2.2, [a, b] = d.pick([[15, 100], [160, 70], [200, 300], [345, 250]]), D = d.int(4, 14) * 2, P = { ㄱ: on(c, r, a), ㄴ: on(c, r, b), ㄷ: on(c, r, a + 180) };
      return N(`점 ㅇ은 원의 중심이다. 선분 ㄱㄷ의 길이가 ${D} cm일 때, 선분 ㅇㄴ의 길이는 몇 cm인가?`, D / 2, {
        unit: 'cm', figure: draw(6, 6, [G.circle(c, r), G.line(P.ㄱ, P.ㄷ), G.line(c, P.ㄴ)].concat(['ㄱ', 'ㄴ', 'ㄷ'].map((n) => named(c, P[n], n)), [centreAway(c, 'ㅇ', [a, a + 180, b])]), '원의 중심 ㅇ을 지나는 선분 ㄱㄷ과, 원의 중심 ㅇ과 원 위의 점 ㄴ을 이은 선분'),
        explain: `선분 ㄱㄷ은 원의 중심을 지나므로 지름이고, 선분 ㅇㄴ은 반지름이다. 반지름은 지름의 반이므로 ${D} ÷ 2 = ${D / 2}(cm)이다.`, facts: { calc: [[`${D}/2`, 0]], unseen: [2] }
      });
    }),
    T('prop-tri-dia', '원 안의 삼각형에서 원의 중심을 지나는 변', '②25 ③15·60', (d) => {
      const c = [3, 3], r = 2.2, [a, b] = d.pick([[10, 115], [170, 60], [200, 320], [350, 235]]), cm = d.int(3, 14), P = { ㄱ: on(c, r, a), ㄴ: on(c, r, a + 180), ㄷ: on(c, r, b) };
      const away = Math.sin((b - a) * RAD) > 0 ? a - 90 : a + 90;      // 중심의 이름은 점 ㄷ의 반대쪽에 적는다
      const parts = [G.circle(c, r), G.line(P.ㄱ, P.ㄴ), G.line(P.ㄴ, P.ㄷ), G.line(P.ㄷ, P.ㄱ)].concat(['ㄱ', 'ㄴ', 'ㄷ'].map((n) => named(c, P[n], n)), [G.point(c), G.text(on(c, 0.5, away), 'ㅇ')]);
      return N(`점 ㅇ은 원의 중심이고, 삼각형 ㄱㄴㄷ의 세 꼭짓점은 원 위에 있다. 원의 반지름이 ${cm} cm일 때, 변 ㄱㄴ의 길이는 몇 cm인가?`, cm * 2, {
        unit: 'cm', figure: draw(6, 6, parts, '원 위의 세 점을 이은 삼각형 ㄱㄴㄷ. 변 ㄱㄴ은 원의 중심 ㅇ을 지난다'),
        explain: `변 ㄱㄴ은 원 위의 두 점을 이은 선분이고 원의 중심을 지나므로 지름이다. ${cm} × 2 = ${cm * 2}`, facts: { calc: [[`${cm}*2`, 0]], unseen: [2] }
      });
    }),
    T('prop-tri-equal', '반지름 둘과 선분 하나로 된 삼각형', '②11·71 ③58 심59', (d) => {
      const c = [3, 3], r = 2.2, [a, b] = d.pick([[205, 335], [35, 150], [-20, 100], [250, 370]]), P = { ㅇ: c, ㄱ: on(c, r, a), ㄴ: on(c, r, b) };
      const rows = d.shuffle([['변 ㅇㄱ과 변 ㅇㄴ', 'ㅇㄱ', 'ㅇㄴ'], ['변 ㅇㄱ과 변 ㄱㄴ', 'ㅇㄱ', 'ㄱㄴ'], ['변 ㅇㄴ과 변 ㄱㄴ', 'ㅇㄴ', 'ㄱㄴ']]);
      const parts = [G.circle(c, r), G.line(c, P.ㄱ), G.line(c, P.ㄴ), G.line(P.ㄱ, P.ㄴ), named(c, P.ㄱ, 'ㄱ'), named(c, P.ㄴ, 'ㄴ'), G.point(c), G.text(on(c, 0.5, (a + b) / 2 + 180), 'ㅇ')];
      return C('점 ㅇ은 원의 중심이고, 점 ㄱ과 점 ㄴ은 원 위의 점이다. 삼각형 ㅇㄱㄴ에서 길이가 같은 두 변은?', rows.map(([text]) => text), rows.findIndex(([, x, y]) => x === 'ㅇㄱ' && y === 'ㅇㄴ'), {
        figure: draw(6, 6, parts, '원의 중심 ㅇ과 원 위의 두 점 ㄱ, ㄴ을 이은 삼각형'),
        explain: '변 ㅇㄱ과 변 ㅇㄴ은 모두 원의 반지름이다. 한 원에서 반지름은 길이가 모두 같다.',
        facts: { truth: rows.map(([, x, y]) => x === 'ㅇㄱ' && y === 'ㅇㄴ'), want: true, circleTalk: { center: c, r, points: P, claims: rows.map(([, x, y]) => ['same', x, y]) } }
      });
    }),
    T('prop-described', '성질로 나타낸 원의 크기 비교', '①26 ②32 ③19 심18', (d) => {
      // 반지름·지름이라는 말 없이 성질로 나타낸다. 적힌 수가 가장 작은 원(반지름으로 나타낸 원)이 가장 작은 원은 아니다.
      const [a, b, e] = d.until(() => [d.int(5, 9), d.int(7, 17), d.int(7, 17)], ([x, y, z]) => y !== z && x < Math.min(y, z) && x * 2 > Math.min(y, z) && x * 2 !== y && x * 2 !== z);
      const rows = d.shuffle([[`원의 중심과 원 위의 한 점을 이은 선분의 길이가 ${a} cm인 원`, `${a}*2`, a * 2], [`원 안에 그을 수 있는 가장 긴 선분의 길이가 ${b} cm인 원`, String(b), b], [`원을 똑같이 둘로 나누는 선분의 길이가 ${e} cm인 원`, String(e), e]]);
      return C('세 원 중에서 가장 작은 원은?', rows.map(([text]) => text), rows.findIndex(([, , v]) => v === Math.min(a * 2, b, e)), {
        explain: `원의 중심과 원 위의 한 점을 이은 선분은 반지름이고, 가장 긴 선분과 원을 똑같이 둘로 나누는 선분은 지름이다. 지름으로 비교하면 ${a} × 2 = ${a * 2}(cm), ${b} cm, ${e} cm이므로 지름이 ${Math.min(a * 2, b, e)} cm인 원이 가장 작다.`,
        facts: { choose: { exprs: rows.map(([, x]) => x), rule: 'min' }, unseen: [2] }
      });
    }),
    T('prop-odd', '크기가 다른 원 하나', '③20 심19', (d) => {
      const r = d.int(3, 9), odd = d.pick([[`지름이 ${r} cm인 원`, String(r)], [`반지름이 ${r * 2} cm인 원`, `${r * 2}*2`]]);
      const rows = d.shuffle([[`반지름이 ${r} cm인 원`, `${r}*2`], [`지름이 ${r * 2} cm인 원`, String(r * 2)], [`컴퍼스를 ${r} cm만큼 벌려 그린 원`, `${r}*2`], odd]);
      return C('크기가 나머지 셋과 다른 원은?', rows.map(([text]) => text), rows.indexOf(odd), {
        explain: `컴퍼스를 벌린 길이는 반지름과 같다. 반지름이 ${r} cm인 원, 지름이 ${r * 2} cm인 원, 컴퍼스를 ${r} cm만큼 벌려 그린 원은 모두 지름이 ${r * 2} cm이다. ${odd[0]}만 크기가 다르다.`,
        facts: { choose: { exprs: rows.map(([, x]) => x), rule: 'odd' }, unseen: [2] }
      });
    })
  ]);

  // ── 컴퍼스로 원 그리기 ────────────────────────────────────────
  B.addTypes('3-2-3', 'compass', [
    T('comp-open', '컴퍼스를 벌리는 길이', '①34 ②35 ③23 심26', (d) => {
      const list = d.shuffle(['원의 반지름', '원의 지름', '원의 지름의 2배']);
      return C('컴퍼스로 원을 그리려고 한다. 컴퍼스의 침과 연필심 사이는 원의 무엇만큼 벌려야 하는가?', list, list.indexOf('원의 반지름'), {
        explain: '컴퍼스의 침을 꽂은 곳이 원의 중심이 되고 연필심이 원 위를 지나간다. 침과 연필심 사이의 길이가 원의 반지름이 된다.', facts: { truth: list.map((word) => word === '원의 반지름'), want: true }
      });
    }),
    T('comp-widest', '가장 큰 원을 그리는 컴퍼스', '①38 심29', (d) => {
      const opens = d.shuffle([2, 3, 4, 5]).slice(0, 3), labels = ['가', '나', '다'];
      return C('컴퍼스의 침과 연필심 사이를 자로 재어 색 띠로 나타내었다. 가장 큰 원을 그릴 수 있는 것은?', labels, opens.indexOf(Math.max(...opens)), {
        figure: lines(opens.map((v, i) => `${labels[i]} ${ruler(0, v * 10, 6)}`)), explain: `컴퍼스를 벌린 길이가 원의 반지름이 된다. 가장 많이 벌린 컴퍼스로 가장 큰 원을 그릴 수 있다. 벌린 길이가 ${Math.max(...opens)} cm인 것이 가장 길다.`,
        facts: { choose: { exprs: opens.map(String), rule: 'max' } }
      });
    }),
    T('comp-wider', '지름이 더 긴 원을 그릴 때 컴퍼스를 벌릴 길이', '②41', (d) => {
      const [D, k] = d.until(() => [d.int(6, 16), d.int(2, 8)], ([x, y]) => (x + y) % 2 === 0);
      return N(`지름이 ${D} cm인 원보다 지름이 ${k} cm 더 긴 원을 그리려고 한다. 컴퍼스를 몇 cm만큼 벌려야 하는가?`, (D + k) / 2, {
        unit: 'cm', explain: `그리려는 원의 지름은 ${D} + ${k} = ${D + k}(cm)이다. 컴퍼스는 반지름만큼 벌리므로 ${D + k} ÷ 2 = ${(D + k) / 2}(cm)만큼 벌린다.`, facts: { calc: [[`(${D}+${k})/2`, 0]], unseen: [2] }
      });
    }),
    T('comp-pic', '컴퍼스를 벌린 길이에 맞는 원 그림', '②39 ③26 심14', (d) => {
      // 벌린 길이는 반지름이다: 적힌 수가 벌린 길이와 같은 지름, 반지름이 2배인 원을 섞는다
      const R = d.int(2, 6), c = [1.8, 1.8], r = 1.5, left = [c[0] - r, c[1]], right = [c[0] + r, c[1]], labels = ['가', '나', '다'];
      const KIND = { fit: { ends: [left, right], cm: R * 2, expr: String(R * 2) }, same: { ends: [left, right], cm: R, expr: String(R) }, wide: { ends: [c, right], cm: R * 2, expr: `${R * 2}*2` } };
      const kinds = d.shuffle(['fit', 'same', 'wide']);
      const tile = ({ ends, cm }) => draw(3.6, 3.6, [G.circle(c, r), G.line(ends[0], ends[1]), G.point(ends[0]), G.point(ends[1]), G.point(c), length([ends[0] === c ? c[0] + 0.45 : c[0], c[1] - 0.45], `${cm} cm`)], (ends[0] === c ? '원의 중심과 원 위의 한 점을 이은 선분' : '원의 중심을 지나고 원 위의 두 점을 이은 선분') + `의 길이 ${cm} cm`, 1.0);
      return C(`원 안의 점은 원의 중심이다. 컴퍼스를 ${R} cm만큼 벌려 그린 원은?`, labels, kinds.indexOf('fit'), {
        figure: G.tiles(kinds.map((kind, i) => [labels[i], tile(KIND[kind])])), explain: `컴퍼스를 벌린 길이는 원의 반지름이다. 반지름이 ${R} cm인 원의 지름은 ${R} × 2 = ${R * 2}(cm)이다. 원의 중심을 지나는 선분의 길이가 ${R * 2} cm인 원을 고른다.`,
        facts: { choose: { exprs: kinds.map((kind) => KIND[kind].expr), rule: 'equals', target: R * 2 }, unseen: [2] }
      });
    })
  ]);

  // ── 원을 이용하여 여러 가지 모양 그리기 ───────────────────────
  B.addTypes('3-2-3', 'design', [
    T('des-arcs', '원의 일부가 든 모양에서 컴퍼스의 침을 꽂을 곳의 수', '①44 ③32·33', (d) => {
      // 원의 일부도 원 1개로 센다. 한가운데의 원 2개는 중심이 같다.
      const s = 6, m = [3, 3], all = [[[0, 0], 270], [[s, 0], 180], [[s, s], 90], [[0, s], 0]], used = d.pick([all, [all[0], all[2]], [all[1], all[3]]]), n = used.length;
      const parts = [G.polygon([[0, 0], [s, 0], [s, s], [0, s]], 'mb-poly is-plain')].concat(used.map(([c, from]) => arc(c, 3, from, from + 90)), [ring(m, 1), ring(m, 0.5)]);
      return N('모눈종이의 정사각형 안에 원과 원의 일부를 그려 모양을 만들었다. 컴퍼스의 침을 꽂아야 할 곳은 모두 몇 군데인가?', n + 1, {
        unit: '군데', figure: G.board(s, s, parts, { grid: 'lines', scale: 1.15, label: `모눈종이의 정사각형 안에 그린 모양: 정사각형의 꼭짓점을 중심으로 하는 원의 일부 ${n}개와, 한가운데에 중심이 같은 원 2개` }),
        explain: `원의 일부를 그릴 때에도 그 원의 중심에 컴퍼스의 침을 꽂는다. 원의 일부 ${n}개는 정사각형의 꼭짓점 ${n}곳에 꽂아 그리고, 한가운데의 원 2개는 중심이 같으므로 한 곳에 꽂아 그린다. ${n} + 1 = ${n + 1}`,
        facts: { pins: { centers: used.map(([c]) => c).concat([m, m]) } }
      });
    }),
    T('des-where', '컴퍼스의 침을 꽂은 곳이 아닌 점', '①46 ②36', (d) => {
      const r = 1, y = 1.9, xs = [1.9, 3.9, 5.9], order = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], names = d.shuffle(order), k = d.int(0, 2), top = d.bool();
      const stray = top ? [xs[k], y - r] : [k === 2 ? xs[2] + r : xs[0] - r, y], at = top ? [stray[0], stray[1] - 0.42] : [stray[0] + (k === 2 ? 0.42 : -0.42), y];
      const parts = xs.map((x) => G.circle([x, y], r)).concat(xs.map((x, i) => below([x, y], names[i])), [G.point(stray), G.text(at, names[3])]);
      return C('컴퍼스로 크기가 같은 원 3개를 맞닿게 그렸다. 컴퍼스의 침을 꽂은 곳이 아닌 점은?', order.map((n) => '점 ' + n), order.indexOf(names[3]), {
        figure: draw(7.8, 3.8, parts, '한 줄로 맞닿은 원 3개. 점 셋은 원의 한가운데에, 점 하나는 원 위에 있다'),
        explain: `원을 그릴 때에는 원의 중심에 컴퍼스의 침을 꽂는다. 점 ${names[3]}은 원 위의 점이고 원의 중심이 아니다.`, facts: { truth: order.map((n) => n === names[3]), want: true }
      });
    }),
    T('des-both', '원의 중심도 옮기고 크기도 바꾼 규칙', '②55 ③36 심36', () => {
      const radii = [1, 2, 3], xs = [1, 4, 9];
      return M(`모눈종이에 원을 규칙에 따라 그렸다. ${LABELS[0]}, ${LABELS[1]}에 알맞은 수는?`, [{ label: LABELS[0], answer: xs[2] - xs[1], unit: '칸' }, { label: LABELS[1], answer: 2, unit: '칸' }], {
        figure: G.board(12, 6, xs.map((x, i) => ring([x, 3], radii[i]) + G.point([x, 3])), { grid: 'lines', scale: 0.95, label: '모눈종이에 그린 원 3개: 반지름은 왼쪽부터 모눈 1칸, 2칸, 3칸이고, 원의 중심은 모눈종이의 왼쪽 끝에서 1칸, 4칸, 9칸 떨어져 있다' })
          + lines([`원의 중심은 오른쪽으로 모눈 3칸, ${box(LABELS[0])}칸 옮겨 갔다.`, `원의 지름은 모눈 ${box(LABELS[1])}칸씩 늘어났다.`]),
        explain: '원의 중심은 오른쪽으로 모눈 3칸, 5칸 옮겨 갔다. 원의 반지름이 모눈 1칸, 2칸, 3칸이므로 지름은 모눈 2칸, 4칸, 6칸이고 2칸씩 늘어났다.',
        facts: { calc: [['9-4', 0], ['3*2-2*2', 1]] }
      });
    }),
    T('des-next', '모눈종이의 규칙에 따라 더 그린 원의 지름', '①49 ②57 ③39 심39', (d) => {
      const s = d.int(1, 2), more = d.int(1, 2), radii = [1, 1 + s, 1 + 2 * s], size = radii[2] * 2 + 2, c = [radii[2] + 1, radii[2] + 1], last = radii[2] + s * more;
      return N(`모눈종이에 중심이 같은 원을 규칙에 따라 그렸다. 모눈 한 칸의 길이는 1 cm이다. 같은 규칙으로 원을 ${more}개 더 그릴 때, 가장 큰 원의 지름은 몇 cm인가?`, last * 2, {
        unit: 'cm', figure: G.board(size, size, radii.map((r) => ring(c, r)).concat([G.point(c)]), { grid: 'lines', scale: s === 1 ? 1.0 : 0.7, label: `모눈종이에 그린 중심이 같은 원 3개: 반지름은 모눈 ${radii.join('칸, ')}칸` }),
        explain: `원의 중심은 옮기지 않고 반지름을 모눈 ${s}칸씩 늘려 그렸다. ${more === 1 ? `더 그린 원의 반지름은 ${last} cm` : `더 그린 두 원의 반지름은 ${radii[2] + s} cm, ${last} cm`}이므로 가장 큰 원의 지름은 ${last} × 2 = ${last * 2}(cm)이다.`,
        facts: { calc: [[`(${radii[2]}+(${radii[2]}-${radii[1]})*${more})*2`, 0]], unseen: [2] }
      });
    }),
    T('des-say', '모양을 보고 원을 그린 방법 말하기', '①48 ②56 ③35', (d) => {
      const SAY = { nest: '원의 중심은 옮기지 않고 반지름만 다르게 하여 그렸다.', slide: '반지름은 그대로 두고 원의 중심만 옮겨 가며 그렸다.', grow: '원의 중심도 옮기고 반지름도 다르게 하여 그렸다.' };
      const FIG = {
        nest: () => draw(5, 5, [G.circle([2.5, 2.5], 2.1), G.circle([2.5, 2.5], 1.4), G.circle([2.5, 2.5], 0.7), G.point([2.5, 2.5])], '원 3개: 큰 원 안에 작은 원이 차례로 들어 있고, 세 원의 한가운데가 같다'),
        slide: () => draw(6, 3.4, [1.7, 3.0, 4.3].map((x) => ring([x, 1.7], 1.3) + G.point([x, 1.7])), '원 3개: 크기가 같은 원이 옆으로 나란히 겹쳐 있다'),
        grow: () => draw(6.6, 3.7, [[1.0, 2.7, 0.6], [2.47, 2.4, 0.9], [4.71, 1.9, 1.4]].map(([x, y, r]) => G.circle([x, y], r) + G.point([x, y])), '원 3개: 크기가 서로 다른 원이 옆으로 나란히 맞닿아 있다')
      };
      const kind = d.pick(['nest', 'slide', 'grow']), rows = d.shuffle(['nest', 'slide', 'grow']);
      return C('컴퍼스로 원 3개를 그려 모양을 만들었다. 원을 그린 방법으로 옳은 것은?', rows.map((k) => SAY[k]), rows.indexOf(kind), {
        figure: FIG[kind](), explain: '원의 한가운데가 같은 곳에 있으면 원의 중심을 옮기지 않은 것이고, 원의 크기가 같으면 반지름을 바꾸지 않은 것이다.', facts: { truth: rows.map((k) => k === kind), want: true }
      });
    })
  ]);

  // ── 맞닿은 원과 길이 ──────────────────────────────────────────
  B.addTypes('3-2-3', 'touch', [
    T('touch-ring-big', '중심이 같은 두 원에서 큰 원의 반지름', '①60 ②62 ③47 심48', (d) => {
      const small = d.int(3, 8), w = d.int(2, 7), c = [3, 3], R = 2.4, r = Math.max(0.95, Math.min(1.85, R * small / (small + w))), a = d.pick([20, 160]), p = on(c, r, a), q = on(c, R, a);
      const parts = [G.circle(c, R), G.circle(c, r), G.line(c, q), G.point(p), G.point(q), G.text([p[0], p[1] - 0.45], 'ㄱ'), G.text(G.beyond(c, q, 0.45), 'ㄴ'), centreAway(c, 'ㅇ', [a])];
      return N(`점 ㅇ은 두 원의 중심이다. 작은 원의 지름이 ${small * 2} cm이고 선분 ㄱㄴ의 길이가 ${w} cm일 때, 큰 원의 반지름은 몇 cm인가?`, small + w, {
        unit: 'cm', figure: draw(6, 6, parts, '중심이 같은 두 원. 점 ㄱ은 작은 원 위에, 점 ㄴ은 큰 원 위에 있고, 점 ㄱ은 선분 ㅇㄴ 위에 있다'),
        explain: `작은 원의 반지름은 ${small * 2} ÷ 2 = ${small}(cm)이다. 큰 원의 반지름은 선분 ㅇㄱ과 선분 ㄱㄴ의 길이를 더한 것이므로 ${small} + ${w} = ${small + w}(cm)이다.`, facts: { calc: [[`${small * 2}/2+${w}`, 0]], unseen: [2] }
      });
    }),
    T('touch-through', '큰 원의 중심을 지나는 작은 원', '②59 ③44', (d) => {
      const k = d.int(2, 9), c = [3, 3], R = 2.4, dir = d.pick([1, -1]), m = [c[0] + dir * R / 2, c[1]];
      const parts = [G.circle(c, R), G.circle(m, R / 2), G.line(c, m), G.point(c), G.text([c[0] - dir * 0.42, c[1]], 'ㄱ'), below(m, 'ㄴ')];
      return N(`점 ㄱ은 큰 원의 중심이고, 점 ㄴ은 작은 원의 중심이다. 작은 원은 점 ㄱ을 지나면서 큰 원과 맞닿아 있다. 큰 원의 지름이 ${k * 4} cm일 때, 선분 ㄱㄴ의 길이는 몇 cm인가?`, k, {
        unit: 'cm', figure: draw(6, 6, parts, '큰 원과 그 안의 작은 원. 작은 원은 큰 원의 중심 ㄱ을 지나고 큰 원과 한 점에서 맞닿아 있다. 점 ㄴ은 작은 원의 중심'),
        explain: `큰 원의 반지름은 ${k * 4} ÷ 2 = ${k * 2}(cm)이고, 이것이 작은 원의 지름이다. 선분 ㄱㄴ은 작은 원의 반지름이므로 ${k * 2} ÷ 2 = ${k}(cm)이다.`, facts: { calc: [[`${k * 4}/2/2`, 0]], unseen: [2] }
      });
    }),
    T('touch-quad-side', '맞닿은 네 원의 중심을 이은 사각형의 한 변', '①61 ②72 ③62 심56', (d) => {
      // 변 ㄱㄴ은 반지름 2개를 이은 것, 곧 지름과 같다. 지름을 다시 2배 하거나 반으로 줄이는 아이를 겨눈다.
      const D = d.int(3, 9) * 2, s = 1.2, P = [[1.8, 1.8], [1.8, 4.2], [4.2, 4.2], [4.2, 1.8]], names = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], list = d.shuffle([D, D / 2, D * 2, D + D / 2]);
      const parts = P.map((p) => G.circle(p, s)).concat(P.map((p, i) => G.line(p, P[(i + 1) % 4])), P.map((p, i) => G.point(p) + G.text(G.outward(P, i, 0.45), names[i])));
      return C(`지름이 ${D} cm인 원 4개를 맞닿게 그리고, 네 원의 중심을 이어 사각형 ㄱㄴㄷㄹ을 만들었다. 변 ㄱㄴ의 길이는 몇 cm인가?`, cmList(list), list.indexOf(D), {
        figure: draw(6, 6, parts, '두 줄로 맞닿은 크기가 같은 원 4개와 네 원의 중심 ㄱ, ㄴ, ㄷ, ㄹ을 이은 사각형'),
        explain: `변 ㄱㄴ은 맞닿은 두 원의 반지름을 이은 것이다. 반지름은 ${D} ÷ 2 = ${D / 2}(cm)이므로 ${D / 2} + ${D / 2} = ${D}(cm)이고, 원의 지름과 같다.`, facts: { pick: { expr: `${D}/2+${D}/2`, options: list }, unseen: [2] }
      });
    }),
    T('touch-tri-diff', '크기가 다른 세 원의 중심을 이은 삼각형의 변', '③62', (d) => {
      const rs = d.until(() => [d.int(3, 6), d.int(3, 6), d.int(3, 6)], (x) => new Set(x).size === 3), [a, b, e] = rs;
      // 점 ㄱ, ㄴ을 아래에 나란히 놓고 점 ㄷ을 위에 놓는다. 세 변의 길이는 반지름의 합이다.
      const x = ((a + e) * (a + e) - (b + e) * (b + e) + (a + b) * (a + b)) / (2 * (a + b)), raw = [[0, 0], [a + b, 0], [x, -Math.sqrt((a + e) * (a + e) - x * x)]];
      const left = Math.min(...raw.map((p, i) => p[0] - rs[i])), right = Math.max(...raw.map((p, i) => p[0] + rs[i])), top = Math.min(...raw.map((p, i) => p[1] - rs[i])), bottom = Math.max(...raw.map((p, i) => p[1] + rs[i]));
      const u = 6 / Math.max(right - left, bottom - top), P = raw.map((p) => [0.6 + (p[0] - left) * u, 0.6 + (p[1] - top) * u]), names = ['ㄱ', 'ㄴ', 'ㄷ'];
      const parts = P.map((p, i) => G.circle(p, rs[i] * u)).concat(P.map((p, i) => G.line(p, P[(i + 1) % 3])), P.map((p, i) => G.point(p) + G.text(G.outward(P, i, 0.45), names[i])));
      return M(`점 ㄱ, 점 ㄴ, 점 ㄷ은 반지름이 각각 ${a} cm, ${b} cm, ${e} cm인 원의 중심이고, 세 원은 서로 맞닿아 있다. 삼각형 ㄱㄴㄷ의 세 변의 길이는 각각 몇 cm인가?`,
        [{ label: '변 ㄱㄴ', answer: a + b, unit: 'cm' }, { label: '변 ㄴㄷ', answer: b + e, unit: 'cm' }, { label: '변 ㄷㄱ', answer: e + a, unit: 'cm' }], {
          figure: draw((right - left) * u + 1.2, (bottom - top) * u + 1.2, parts, '서로 맞닿은 크기가 다른 원 3개와 세 원의 중심 ㄱ, ㄴ, ㄷ을 이은 삼각형', 1.0),
          explain: `맞닿은 두 원의 중심을 이은 선분의 길이는 두 원의 반지름의 합이다. 변 ㄱㄴ은 ${a} + ${b} = ${a + b}(cm), 변 ㄴㄷ은 ${b} + ${e} = ${b + e}(cm), 변 ㄷㄱ은 ${e} + ${a} = ${e + a}(cm)이다.`,
          facts: { calc: [[`${a}+${b}`, 0], [`${b}+${e}`, 1], [`${e}+${a}`, 2]] }
        });
    }),
    T('touch-rect-rows2', '두 줄로 꼭 맞는 원에서 세로로 가로 구하기', '③56', (d) => {
      const r = d.int(2, 8), n = d.int(3, 4), size = n === 3 ? 0.85 : 0.7, x0 = 0.8, y0 = 0.7, cs = [];
      for (let j = 0; j < 2; j += 1) for (let i = 0; i < n; i += 1) cs.push([x0 + size + i * size * 2, y0 + size + j * size * 2]);
      const corner = [[x0, y0], [x0 + size * 2 * n, y0], [x0 + size * 2 * n, y0 + size * 4], [x0, y0 + size * 4]];
      return N(`직사각형 안에 크기가 같은 원 ${n * 2}개를 두 줄로 꼭 맞게 그렸다. 직사각형의 세로가 ${r * 4} cm일 때, 가로는 몇 cm인가?`, r * 2 * n, {
        unit: 'cm', figure: draw(Math.ceil(x0 * 2 + size * 2 * n), Math.ceil(y0 * 2 + size * 4), [G.polygon(corner)].concat(cs.map((p) => G.circle(p, size))), `직사각형 안에 한 줄에 ${n}개씩 두 줄로 꼭 맞게 그린 크기가 같은 원`, 0.95),
        explain: `직사각형의 세로는 원의 지름의 2배이므로 지름은 ${r * 4} ÷ 2 = ${r * 2}(cm)이다. 가로는 지름의 ${n}배이므로 ${r * 2} × ${n} = ${r * 2 * n}(cm)이다.`, facts: { calc: [[`${r * 4}/2*${n}`, 0]], unseen: [2] }
      });
    }),
    T('touch-rect-count', '직사각형 안에 한 줄로 꼭 맞는 원의 수', '심54', (d) => {
      const D = d.int(4, 9), n = d.int(3, 6);
      return N(`가로가 ${D * n} cm, 세로가 ${D} cm인 직사각형 안에 크기가 같은 원을 한 줄로 꼭 맞게 그리려고 한다. 원을 몇 개 그릴 수 있는가?`, n, {
        unit: '개', explain: `원의 지름은 직사각형의 세로와 같은 ${D} cm이다. 가로에 지름이 ${n}번 들어가므로 ${D * n} ÷ ${D} = ${n}(개)를 그릴 수 있다.`, facts: { calc: [[`${D * n}/${D}`, 0]] }
      });
    })
  ]);

  // ── 실력 ─────────────────────────────────────────────────────
  // 뜻을 정확히 알아야 맞는 문제(보기마다 어떤 아이가 고르는지 적는다)와, 원의 성질을 두 번 넘게 써야 하는 길이 문제.
  B.addTypes('3-2-3', 'hard', [
    H('h-tape-gap', '구멍 사이의 간격이 주어진 띠 종이', '기본 ②17, 심11', (d) => {
      // 띠 종이의 길이는 반지름이다. 지름을 그대로 간격으로 세는 아이는 2배 먼 구멍을 고른다.
      const gap = d.int(2, 5), k = d.int(1, 2), D = gap * k * 2, pin = 1, holes = [1, 2, 3, 4].map((i) => pin + i * 1.4);
      return C(`누름 못을 꽂은 곳에서부터 ${gap} cm 간격으로 구멍을 뚫은 띠 종이가 있다. 지름이 ${D} cm인 원을 그리려면 연필을 어느 구멍에 꽂아야 하는가?`, LABELS, k - 1, {
        figure: draw(7.6, 2.6, tape(pin, holes), '띠 종이: 누름 못과, 누름 못에서부터 같은 간격으로 뚫은 구멍 넷'),
        explain: `누름 못에서 연필을 꽂은 구멍까지의 길이가 원의 반지름이 된다. 반지름은 ${D} ÷ 2 = ${D / 2}(cm)이므로 누름 못에서 ${D / 2} cm 떨어진 ${LABELS[k - 1]}에 꽂는다.`,
        facts: { choose: { exprs: [1, 2, 3, 4].map((i) => `${gap}*${i}`), rule: 'equals', target: D / 2 }, unseen: [1, 2, 3, 4] }
      });
    }),
    H('h-fold', '두 번 접은 원 모양 종이', '심25', (d) => {
      // 곧은 변은 반지름이다: 곧은 변을 지름으로 읽는 아이, 두 번 접었으니 4배라고 하는 아이
      const r = d.int(3, 9), o = [1, 5], list = d.shuffle([r * 2, r, r * 4, r * 3]);
      const fan = [o].concat(Array.from({ length: 19 }, (_, i) => on(o, 4, i * 5)));
      return C('원 모양의 종이를 완전히 포개어지도록 반으로 접고, 다시 반으로 접었더니 다음과 같은 모양이 되었다. 접기 전 원의 지름은 몇 cm인가?', cmList(list), list.indexOf(r * 2), {
        figure: draw(6, 6, [G.polygon(fan), length([3, 5.45], `${r} cm`)], `두 번 접어 부채 모양이 된 종이. 곧은 변의 길이 ${r} cm`),
        explain: `두 번 접어 생긴 곧은 변은 원의 중심과 원 위의 한 점을 이은 선분이므로 반지름이다. 지름은 ${r} × 2 = ${r * 2}(cm)이다.`, facts: { pick: { expr: `${r}*2`, options: list }, unseen: [2] }
      });
    }),
    H('h-hexa', '원 안의 삼각형 6개', '기본 ②73', (d) => {
      // 삼각형의 한 변은 반지름이다: 한 변을 지름으로 읽는 아이, 변 셋을 더하는 아이, 삼각형이 6개라 6배 하는 아이
      const a = d.int(3, 9), c = [3, 3], r = 2.3, pts = [0, 60, 120, 180, 240, 300].map((deg) => on(c, r, deg)), list = d.shuffle([a * 2, a, a * 3, a * 6]);
      const parts = [G.circle(c, r)].concat(pts.map((p, i) => G.line(c, p) + G.line(p, pts[(i + 1) % 6]) + G.point(p)), [G.point(c)]);
      return C(`원의 중심과 원 위의 점 6개를 이어 삼각형 6개를 만들었다. 삼각형은 모두 세 변의 길이가 같고, 한 변의 길이는 ${a} cm이다. 원의 지름은 몇 cm인가?`, cmList(list), list.indexOf(a * 2), {
        figure: draw(6, 6, parts, '원의 중심과 원 위의 점 6개를 이어 만든 삼각형 6개'),
        explain: `삼각형의 변 가운데 원의 중심과 원 위의 점을 이은 변은 반지름이다. 세 변의 길이가 같으므로 반지름은 ${a} cm이고, 지름은 ${a} × 2 = ${a * 2}(cm)이다.`, facts: { pick: { expr: `${a}*2`, options: list }, unseen: [2] }
      });
    }),
    H('h-treasure', '한 점에서 같은 거리에 있는 곳', '기본 ②46', (d) => {
      const k = d.int(2, 5);
      const rows = d.shuffle([
        [`나무를 원의 중심으로 하고 컴퍼스를 ${k} cm만큼 벌려 원을 그린다.`, true],
        [`나무를 원의 중심으로 하여 지름이 ${k} cm인 원을 그린다.`, false],                 // 떨어진 거리를 지름으로 여기는 아이
        [`나무에서 오른쪽으로 ${k} cm 떨어진 곳에 점을 하나 찍는다.`, false],                // 그런 곳이 한 곳뿐이라고 여기는 아이
        [`나무에서 시작하여 길이가 ${k} cm인 선분을 하나 긋는다.`, false]                    // 선분 위의 점이 모두 그만큼 떨어져 있다고 여기는 아이
      ]);
      return C(`보물은 지도의 나무에서 ${k} cm 떨어진 곳에 묻혀 있다. 보물이 묻혀 있을 수 있는 곳을 지도에 모두 나타내는 방법은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: `한 점에서 같은 길이만큼 떨어진 점을 모두 이으면 원이 된다. 나무가 원의 중심이고 반지름이 ${k} cm인 원 위의 모든 점이 나무에서 ${k} cm 떨어져 있다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }, { standard: DRAW }),
    H('h-overlap-reverse', '겹쳐 그린 원의 전체 길이로 반지름 구하기', '기본 ③49, 심43', (d) => {
      const n = d.pick([2, 3, 5]), r = d.int(3, 9), size = { 2: 1.4, 3: 1.25, 5: 0.85 }[n], row = rowOfCircles(Array(n).fill(size), Array(n - 1).fill(size), true), a = [row.centers[0][0] - size, row.y], b = [row.centers[n - 1][0] + size, row.y];
      const parts = row.circles.concat(row.centers.map((p) => G.point(p)), [G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.4, row.y], 'ㄱ'), G.text([b[0] + 0.4, row.y], 'ㄴ')]);
      return N(`크기가 같은 원 ${n}개를 이웃한 원의 중심을 지나도록 겹쳐 그렸더니 선분 ㄱㄴ의 길이가 ${r * (n + 1)} cm였다. 원의 반지름은 몇 cm인가?`, r, {
        unit: 'cm', figure: draw(row.cols, row.rows, parts, `이웃한 원의 중심을 지나게 겹쳐 그린 원 ${n}개와 양 끝을 이은 선분 ㄱㄴ. 점은 원의 중심`, 0.95),
        explain: `이웃한 두 원의 중심 사이의 길이는 반지름과 같으므로 선분 ㄱㄴ의 길이는 반지름의 ${n + 1}배이다. ${r * (n + 1)} ÷ ${n + 1} = ${r}(cm)이다.`, facts: { calc: [[`${r * (n + 1)}/(${n}+1)`, 0]], unseen: [1] }
      });
    }),
    H('h-lens-tri', '서로 중심을 지나는 두 원과 삼각형', '기본 ②70 ③61', (d) => {
      const r = 1.7, y = 2.5, up = d.bool() ? -1 : 1, a = [0.7 + r, y], b = [a[0] + r, y], top = [a[0] + r / 2, y + up * r * Math.sqrt(3) / 2];
      const rows = d.shuffle([
        ['세 변의 길이가 모두 같다.', true],
        ['변 ㄱㄷ과 변 ㄴㄷ의 길이만 같다.', false],     // 두 원의 중심을 이은 변 ㄱㄴ이 반지름인 줄 모르는 아이
        ['변 ㄱㄴ의 길이가 가장 길다.', false],           // 중심과 중심을 이은 선분을 지름처럼 여기는 아이
        ['세 변의 길이가 모두 다르다.', false]
      ]);
      const parts = [ring(a, r), ring(b, r), G.line(a, b), G.line(a, top), G.line(b, top), G.point(a), G.point(b), G.point(top), G.text([a[0] - 0.42, y], 'ㄱ'), G.text([b[0] + 0.42, y], 'ㄴ'), G.text([top[0], top[1] + up * 0.45], 'ㄷ')];
      return C('크기가 같은 두 원을 서로 원의 중심을 지나도록 겹쳐 그렸다. 점 ㄱ, 점 ㄴ은 원의 중심이고 점 ㄷ은 두 원이 만나는 점이다. 삼각형 ㄱㄴㄷ에 대한 설명으로 옳은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: draw(6.5, 5, parts, '서로 원의 중심을 지나게 겹쳐 그린 크기가 같은 두 원. 두 원의 중심 ㄱ, ㄴ과 두 원이 만나는 점 ㄷ을 이은 삼각형'),
        explain: '변 ㄱㄴ과 변 ㄱㄷ은 점 ㄱ이 중심인 원의 반지름이고, 변 ㄴㄱ과 변 ㄴㄷ은 점 ㄴ이 중심인 원의 반지름이다. 두 원의 크기가 같으므로 세 변의 길이가 모두 같다.',
        facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    H('h-inside-row', '큰 원 안 작은 원 셋의 양 끝 중심 사이', '기본 ②63', (d) => {
      const r = d.int(2, 6), c = [3, 3], R = 2.4, s = R / 3, a = [c[0] - 2 * s, c[1]], b = [c[0] + 2 * s, c[1]];
      const parts = [G.circle(c, R)].concat([-2, 0, 2].map((i) => G.circle([c[0] + i * s, c[1]], s)), [G.line(a, b), below(a, 'ㄱ'), below(b, 'ㄴ')]);
      return N(`큰 원 안에 크기가 같은 작은 원 3개를 한 줄로 맞닿게 그렸다. 큰 원의 반지름이 ${r * 3} cm이고 점 ㄱ, 점 ㄴ이 양 끝 작은 원의 중심일 때, 선분 ㄱㄴ의 길이는 몇 cm인가?`, r * 4, {
        unit: 'cm', figure: draw(6, 6, parts, '큰 원 안에 한 줄로 꼭 맞게 맞닿은 작은 원 3개. 점 ㄱ, ㄴ은 양 끝 작은 원의 중심'),
        explain: `큰 원의 반지름은 작은 원의 반지름의 3배이므로 작은 원의 반지름은 ${r * 3} ÷ 3 = ${r}(cm)이다. 선분 ㄱㄴ은 작은 원의 반지름의 4배이므로 ${r} × 4 = ${r * 4}(cm)이다.`, facts: { calc: [[`${r * 3}/3*4`, 0]], unseen: [4] }
      });
    }),
    H('h-rect-overlap', '직사각형 안에 서로 중심을 지나게 겹친 두 원', '기본 ③57', (d) => {
      const r = d.int(3, 9), s = 1.3, x0 = 0.8, y0 = 0.7, a = [x0 + s, y0 + s], b = [x0 + s * 2, y0 + s], corner = [[x0, y0], [x0 + s * 3, y0], [x0 + s * 3, y0 + s * 2], [x0, y0 + s * 2]];
      return M(`직사각형 안에 반지름이 ${r} cm인 원 2개를 서로 원의 중심을 지나도록 겹쳐서 꼭 맞게 그렸다. 직사각형의 가로와 세로는 각각 몇 cm인가?`, [{ label: '가로', answer: r * 3, unit: 'cm' }, { label: '세로', answer: r * 2, unit: 'cm' }], {
        figure: draw(5.5, 4, [G.polygon(corner), ring(a, s), ring(b, s), G.point(a), G.point(b)], '직사각형 안에 꼭 맞게 그린 크기가 같은 원 2개. 두 원은 서로 원의 중심을 지나게 겹쳐 있다. 점은 원의 중심'),
        explain: `두 원의 중심 사이의 길이는 반지름과 같다. 가로는 반지름의 3배이므로 ${r} × 3 = ${r * 3}(cm)이고, 세로는 원의 지름과 같으므로 ${r} × 2 = ${r * 2}(cm)이다.`, facts: { calc: [[`${r}*3`, 0], [`${r}*2`, 1]], unseen: [3] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
