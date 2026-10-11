// 3학년 2학기 3단원 원 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(32개 문서)의 문제 꼴 60개와
// 기본 자료의 꼴을 참고하되, 그대로 옮기지 않고 꼴마다 따져서 냈다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 반지름: 원의 중심에서 그은 선분이면 원 위에 닿지 않아도 반지름이라고 여긴다.
//   ② 지름: 원 위의 두 점을 이은 선분이면 중심을 지나지 않아도 지름이라고 여긴다. 길게 그어진 선분의 길이를 지름으로 읽는다.
//   ③ 한 줄로 놓인 원: 원의 수만큼 지름을 곱한다(첫째 중심에서 마지막 중심까지는 지름이 하나 적다).
// 그다음에 원의 성질을 두 번 넘게 써야 하는 문제를 실었다(중심을 지나게 겹친 원, 반씩 줄어드는 세 원, 전체 길이에서 반지름 구하기).
//
// 뺀 것과 까닭
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      5학년 1학기 「다각형의 둘레와 넓이」: 정사각형·직사각형의 네 변의 길이의 합, 삼각형·사각형의 변의 길이의 합이 끼는 모든 꼴
//        (원의 중심을 이은 삼각형·사각형의 변의 합, 네 변의 합으로 원의 반지름 구하기, 원 안의 삼각형)
//      4학년 1학기 「곱셈과 나눗셈」: 두 자리 수로 나누어야 하는 꼴
//  - 조건 풀이·세기가 어려움의 대부분: 큰 원 안에 그릴 수 있는 작은 원의 수, 삼각형 모양으로 늘어나는 원, 여러 줄로 놓인 원, 배 조건이 붙은 두 원
//  - 작도·서술형: 반지름·지름 긋기, 원 그리기, 규칙에 따라 더 그리기, 까닭·규칙 쓰기, 종이를 접어 중심을 찾는 방법 쓰기
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, C } = B.kit;
  const G = B.kit.geo;
  const PARTS = '4수03-06';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const RAD = Math.PI / 180;
  const on = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] - r * Math.sin(deg * RAD)];
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const named = (c, p, name) => G.point(p) + G.text(G.beyond(c, p, 0.45), name);
  const centre = (c, name) => G.point(c) + (name ? G.text([c[0] - 0.36, c[1] + 0.44], name) : '');
  // 선분 옆에 적는 길이: 글자 폭만큼 더 비켜 적어 비스듬한 선분에 겹치지 않게 한다
  const tag = (p, q, value) => { const dx = q[0] - p[0], dy = q[1] - p[1], size = Math.hypot(dx, dy) || 1; return G.text(G.beside(p, q, mid(p, q), 0.2 + String(value).length * 0.165 * Math.abs(dy / size) + 0.3 * Math.abs(dx / size)), value); };
  const draw = (cols, rows, parts, label, scale) => G.board(cols, rows, parts, { grid: false, scale: scale || 1.1, label });
  // 한 줄로 놓인 같은 원 n개. gap: 이웃한 중심 사이의 거리(맞닿으면 지름, 중심을 지나게 겹치면 반지름)
  function rowOf(n, size, gap) {
    const centers = Array.from({ length: n }, (_, i) => [0.9 + size + i * gap, 0.7 + size]);
    return { centers, cols: Math.ceil(centers[n - 1][0] + size + 0.9), rows: Math.ceil(size * 2 + 1.5), circles: centers.map((c) => G.circle(c, size)) };
  }

  B.addGroup('3-2-3', {
    id: 'hard', title: '실력 문제', standard: PARTS,
    types: [
      H('h-radius-say', '중심에서 그은 선분과 원 위의 두 점을 이은 선분', '원의 성질 옳은 것 고르기·잘못 말한 사람(심화 23), 잘못 그은 지름·반지름(심화 8, 기본 ①12)', (d) => {
        // 점 ㄹ은 원 안에 있다. 선분 ㅇㄹ은 중심에서 그었지만 반지름이 아니다.
        const c = [3, 3], r = 2.2, s = d.pick([{ dia: 200, top: 100, inside: 300 }, { dia: 160, top: 60, inside: 250 }, { dia: 220, top: 115, inside: 320 }]);
        const P = { ㅇ: c, ㄱ: on(c, r, s.dia), ㄴ: on(c, r, s.dia + 180), ㄷ: on(c, r, s.top), ㄹ: on(c, r * 0.58, s.inside) };
        const rows = d.shuffle([
          { text: '선분 ㅇㄷ은 원의 반지름이다.', ok: true, claim: ['radius', 'ㅇㄷ'] },
          { text: '선분 ㅇㄹ은 원의 반지름이다.', ok: false, claim: ['radius', 'ㅇㄹ'] },                 // 중심에서 그은 선분은 모두 반지름이라는 아이는 이것을 옳다고 본다
          { text: '선분 ㄱㄷ은 원의 지름이 아니다.', ok: true, claim: ['notDiameter', 'ㄱㄷ'] },            // 원 위의 두 점을 이으면 지름이라는 아이가 고른다
          { text: '선분 ㅇㄱ과 선분 ㅇㄷ은 길이가 같다.', ok: true, claim: ['same', 'ㅇㄱ', 'ㅇㄷ'] }       // 그어진 방향이 다르면 길이도 다르다고 보는 아이가 고른다
        ]);
        const parts = [G.circle(c, r), G.line(P.ㄱ, P.ㄴ), G.line(c, P.ㄷ), G.line(c, P.ㄹ), G.line(P.ㄱ, P.ㄷ), named(c, P.ㄱ, 'ㄱ'), named(c, P.ㄴ, 'ㄴ'), named(c, P.ㄷ, 'ㄷ'), G.point(P.ㄹ), G.text(G.beyond(c, P.ㄹ, 0.42), 'ㄹ'), centre(c, 'ㅇ')];
        return C('점 ㅇ은 원의 중심이다. 옳지 않은 것은?', rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
          figure: draw(6, 6, parts, '원의 중심 ㅇ. 점 ㄱ, ㄴ, ㄷ은 원 위에 있고 점 ㄹ은 원 안에 있다'),
          explain: '반지름은 원의 중심과 원 위의 한 점을 이은 선분이다. 점 ㄹ은 원 위에 있지 않으므로 선분 ㅇㄹ은 반지름이 아니다. 지름은 원 위의 두 점을 이은 선분 중에서 원의 중심을 지나는 선분이다.',
          facts: { truth: rows.map((row) => row.ok), want: false, circleTalk: { center: c, r, points: P, claims: rows.map((row) => row.claim) } }
        });
      }),
      H('h-diameter', '길게 그어진 선분과 지름', '길이가 적힌 선분 가운데 반지름·지름 읽기(기본 ①10 ②10 ③7), 지름이 아닌 까닭(기본 ②15)', (d) => {
        // 중심을 지나지 않는 선분 ㄴㄷ의 길이를 지름으로 읽는 아이
        const [cm, chord] = d.until(() => [d.int(4, 9), d.int(6, 16)], ([x, y]) => y > x + 1 && y < x * 2 - 1), c = [3, 3], r = 2.2, half = Math.asin(chord / (cm * 2)) / RAD;
        const p = on(c, r, 270 - half), q = on(c, r, 270 + half), top = on(c, r, d.pick([50, 130]));
        const list = d.shuffle([cm * 2, chord, cm, cm + chord]);
        return C('점 ㅇ은 원의 중심이고, 점 ㄱ, ㄴ, ㄷ은 원 위의 점이다. 원의 지름은 몇 cm인가?', list.map((v) => v + ' cm'), list.indexOf(cm * 2), {
          figure: draw(6, 6, [G.circle(c, r), G.line(c, top), G.line(p, q), named(c, top, 'ㄱ'), named(c, p, 'ㄴ'), named(c, q, 'ㄷ'), centre(c, 'ㅇ'), tag(c, top, cm + ' cm'), G.text([c[0], p[1] - 0.45], chord + ' cm')], `원의 중심 ㅇ, 선분 ㅇㄱ ${cm} cm, 선분 ㄴㄷ ${chord} cm`),
          explain: `선분 ㄴㄷ은 원의 중심을 지나지 않으므로 지름이 아니다. 선분 ㅇㄱ이 반지름이므로 지름은 ${cm} × 2 = ${cm * 2}(cm)이다.`,
          facts: { pick: { expr: `${cm}*2`, options: list }, unseen: [2] }
        });
      }),
      H('h-row-centers', '첫째 원의 중심에서 마지막 원의 중심까지', '한 줄로 맞닿은 세 원의 중심 사이(기본 ③43), 한 줄로 이어 붙인 원(심화 41·42)', (d) => {
        // 원이 n개이면 중심 사이는 n-1칸이다
        const n = d.int(3, 5), r = d.int(3, 7), size = [0, 0, 0, 1.15, 0.9, 0.72][n], row = rowOf(n, size, size * 2), a = row.centers[0], b = row.centers[n - 1];
        const list = d.shuffle([(n - 1) * 2 * r, n * 2 * r, (n - 1) * r, n * r]);
        return C(`반지름이 ${r} cm인 원 ${n}개를 맞닿게 한 줄로 그렸다. 점 ㄱ, 점 ㄴ이 양 끝 원의 중심일 때, 선분 ㄱㄴ의 길이는 몇 cm인가?`, list.map((v) => v + ' cm'), list.indexOf((n - 1) * 2 * r), {
          figure: draw(row.cols, row.rows, row.circles.concat([G.line(a, b), G.point(a), G.point(b), G.text([a[0], a[1] + 0.48], 'ㄱ'), G.text([b[0], b[1] + 0.48], 'ㄴ')]), `크기가 같은 원 ${n}개와 양 끝 원의 중심 ㄱ, ㄴ`, 0.95),
          explain: `이웃한 두 원의 중심 사이의 길이는 반지름의 2배인 ${r * 2} cm이다. 원이 ${n}개이면 중심 사이는 ${n - 1}칸이므로 ${r * 2} × ${n - 1} = ${(n - 1) * 2 * r}(cm)이다.`,
          facts: { pick: { expr: `(${n}-1)*2*${r}`, options: list }, unseen: [1, 2] }
        });
      }),
      H('h-overlap', '서로 중심을 지나게 겹친 원', '중심을 지나도록 겹친 같은 원(심화 43, 기본 ③48)', (d) => {
        const n = d.int(3, 4), r = d.int(3, 9), size = n === 3 ? 1.3 : 1.1, row = rowOf(n, size, size), y = row.centers[0][1], a = [row.centers[0][0] - size, y], b = [row.centers[n - 1][0] + size, y];
        const parts = row.circles.concat(row.centers.map((c) => G.point(c)), [G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.4, y], 'ㄱ'), G.text([b[0] + 0.4, y], 'ㄴ')]);
        return N(`반지름이 ${r} cm인 원 ${n}개를 이웃한 원의 중심을 지나도록 겹쳐 그렸다. 선분 ㄱㄴ의 길이는 몇 cm인가?`, (n + 1) * r, {
          unit: 'cm', figure: draw(row.cols, row.rows, parts, `이웃한 원의 중심을 지나게 겹쳐 그린 원 ${n}개와 양 끝을 이은 선분 ㄱㄴ`, 0.95),
          explain: `이웃한 두 원의 중심 사이의 길이는 반지름과 같다. 선분 ㄱㄴ의 길이는 반지름의 ${n + 1}배이므로 ${r} × ${n + 1} = ${(n + 1) * r}(cm)이다.`, facts: { calc: [[`(${n}+1)*${r}`, 0]], unseen: [1] }
        });
      }),
      H('h-chain', '반씩 줄어드는 세 원', '반씩 줄어드는 원(심화 47, 기본 ②61 ③45)', (d) => {
        const cm = d.int(2, 7) * 8, c = [3, 3], R = 2.4, m = [c[0] + R / 2, c[1]], s = [m[0] + R / 4, c[1]];
        return N(`가장 큰 원의 반지름은 가운데 원의 지름과 같고, 가운데 원의 반지름은 가장 작은 원의 지름과 같다. 가장 큰 원의 지름이 ${cm} cm일 때, 가장 작은 원의 반지름은 몇 cm인가?`, cm / 8, {
          unit: 'cm', figure: draw(6, 6, [G.circle(c, R), G.circle(m, R / 2), G.circle(s, R / 4), G.point(c), G.point(m), G.point(s)], '큰 원 안의 가운데 원, 그 안의 작은 원. 점은 원의 중심'),
          explain: `가장 큰 원의 반지름은 ${cm} ÷ 2 = ${cm / 2}(cm)이고 이것이 가운데 원의 지름이다. 가운데 원의 반지름은 ${cm / 2} ÷ 2 = ${cm / 4}(cm)이고 이것이 가장 작은 원의 지름이다. 가장 작은 원의 반지름은 ${cm / 4} ÷ 2 = ${cm / 8}(cm)이다.`,
          facts: { calc: [[`${cm}/2/2/2`, 0]], unseen: [2] }
        });
      }),
      H('h-reverse', '전체 길이로 원의 반지름 구하기', '전체 길이에서 거꾸로 구하기(심화 49, 기본 ③49)', (d) => {
        const n = d.int(3, 4), r = d.int(3, 9), size = n === 3 ? 1.15 : 0.9, row = rowOf(n, size, size * 2), y = row.centers[0][1], a = [row.centers[0][0] - size, y], b = [row.centers[n - 1][0] + size, y];
        return N(`크기가 같은 원 ${n}개를 맞닿게 한 줄로 그렸더니 선분 ㄱㄴ의 길이가 ${r * 2 * n} cm였다. 원의 반지름은 몇 cm인가?`, r, {
          unit: 'cm', figure: draw(row.cols, row.rows, row.circles.concat([G.line(a, b), G.point(a), G.point(b), G.text([a[0] - 0.4, y], 'ㄱ'), G.text([b[0] + 0.4, y], 'ㄴ')]), `크기가 같은 원 ${n}개와 양 끝을 이은 선분 ㄱㄴ`, 0.95),
          explain: `선분 ㄱㄴ의 길이는 원의 지름의 ${n}배이다. 지름은 ${r * 2 * n} ÷ ${n} = ${r * 2}(cm)이고 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다.`, facts: { calc: [[`${r * 2 * n}/${n}/2`, 0]], unseen: [2] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
