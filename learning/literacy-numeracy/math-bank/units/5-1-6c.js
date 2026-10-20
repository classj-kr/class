// 5학년 1학기 6단원 다각형의 둘레와 넓이 — 실력 문항.
// 단원 틀과 그림 도구(B.kit.area516)는 5-1-6a.js 에 있다. 대조표는 수집본의 _분석/5-1-6/싣기_대조표.md.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 넓이를 구할 때 그림에 적힌 길이를 아무것이나 곱한다: 평행사변형·삼각형·사다리꼴의 비스듬한 변을 높이로 쓰고, 밑변을 늘인 점선의 길이까지 밑변에 넣는다.
//  - 높이는 도형 안에만 있다고 여긴다. 한 도형에서 밑변을 바꾸면 높이도 달라진다는 것을 모른다(한 밑변에 다른 밑변의 높이를 곱한다).
//  - 삼각형·사다리꼴·마름모에서 2로 나누는 것을 빠뜨린다. 둘레와 넓이를 바꾸어 구한다.
//  - 단위가 다른 가로와 세로를 그대로 곱한다(4 m × 150 cm = 600).
//  - 꺾인 도형의 둘레를 잴 때 안으로 들어간 변을 빠뜨리거나, 이어 붙인 도형에서 맞닿은 변까지 센다.
//  - 한 변을 2 cm 늘이면 넓이도 2 × 2 = 4(cm²)만 늘어난다고 여긴다.
//
// 실력 문항의 잣대: 두 가지만 둔다.
//  ① 문제의 상황·그림에 함정이 있어 뜻을 정확히 대야 풀리는 문제(보기 없이 수로 답한다. 어려움은 보기가 아니라 그림과 상황에서 나온다)
//     - 높이가 아닌 비스듬한 변의 길이까지 적어 놓은 평행사변형·삼각형·사다리꼴, 밑변을 늘인 길이까지 적어 놓은 둔각삼각형(높이가 밖에 있다)
//     - 밑변으로 삼는 변에 따라 높이가 달라지는 평행사변형·직각삼각형(한 넓이를 두 가지로 세운다)
//     - 단위가 섞인 가로와 세로, 계단 모양·안으로 파인 도형의 둘레, 가로세로로 길을 낸 꽃밭, 밑변을 똑같이 나눈 삼각형의 조각(조각마다 높이가 같다),
//       정사각형의 네 변을 늘였을 때 늘어난 넓이, 원 안에 그린 마름모(정사각형 모양이어도 두 대각선으로 넓이를 구한다)
//  ② 두 번 넘게 생각해야 풀리는 문제: 둘레 → 변 → 넓이, 넓이 → 변 → 다른 도형의 넓이, 넓이가 같은(몇 배인) 두 도형에서 거꾸로 구하기, 단위를 바꾼 뒤 거꾸로 구하기,
//     나누어 더하거나 큰 것에서 빼는 넓이
// 기본에서 이미 하는 일(넓이 한 번 구하기, 단위 한 번 바꾸기)을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 실력이 아니므로 싣지 않았다
// (바르게 구한 사람 고르기, ÷ 2를 빠뜨린 풀이 고르기). 같은 함정은 보기가 아니라 그림에 넣었다.
//
// 뺀 것과 까닭(실력 쪽): 5-1-6a.js, 5-1-6b.js 머리에 적은 것(방정식 꼴, 경우 따지기, 규칙 찾기, 겹친 도형 퍼즐, 소수가 낀 단위, cm²와 km²를 한 줄에 세우기, 작도·서술형)에 더해
//  - 삼각형의 넓이를 두 가지로 세워 높이를 구한 다음 그 높이로 사다리꼴의 넓이를 구하는 것(심91): 세 선분이 겹치는 그림을 휴대폰 너비에 길이 글과 함께 그릴 수 없어 미루었다.
//  - 색종이 두 장으로 만든 마름모(심108)·평행사변형에서 직사각형을 뺀 띠(심65의 변형): 그림 없이는 얼개를 알 수 없다. 「잘라 붙여도 넓이는 같다」「큰 것에서 빼기」는 기본에 있다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N } = B.kit;
  const G = B.kit.geo;
  const { NAME, PYT, len, calc, centre, scene, styled, tint, ghost, dashed, thin, beside, outside, edges, height, dim } = B.kit.area516;
  const PERI = '6수03-11', UNITS = '6수03-12', RECT = '6수03-13', AREA = '6수03-14';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const white = (pts) => styled(G.polygon(pts), 'fill:#fff');
  const names = (pts, list) => G.vertexLabels(pts, list);
  // 높이 h 에 맞는 비스듬한 변 [길이, 옆으로 나간 길이]
  const SLANTS = { 8: [[10, 6], [17, 15]], 12: [[13, 5], [15, 9], [20, 16]], 24: [[25, 7], [26, 10], [30, 18]] };

  B.addGroup('5-1-6', {
    id: 'hard', title: '단원 종합', standard: AREA,
    types: [
      // ── ① 그림·상황에 함정이 있는 문제 ─────────────────────────
      H('hard-para-slant', '비스듬한 변의 길이까지 적힌 평행사변형의 넓이', '심58 ①52 ②87 ③50', (d) => {
        // 어떤 아이가 틀리는가: 그림에 적힌 두 변의 길이를 곱한다(밑변 × 비스듬한 변).
        const [s, h, c] = d.pick(PYT), b = d.int(Math.max(s + 3, h), h + 8), flip = d.bool(), raw = [[s, 0], [0, h], [b, h], [b + s, 0], [s, h]].map(([x, y]) => [flip ? b + s - x : x, y]);
        return N('평행사변형의 넓이는 몇 cm²인가?', b * h, {
          unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p.slice(0, 4)), outside(p.slice(0, 4), 1, len(b)), outside(p.slice(0, 4), 0, len(c)), height(p[0], p[4], p[2], len(h), edges(p.slice(0, 4)))], { label: `밑변 ${b} cm, 비스듬한 변 ${c} cm인 평행사변형. 밑변에 수직인 점선(높이) ${h} cm` }),
          explain: `높이는 밑변에 수직인 선분의 길이인 ${h} cm이다. 비스듬한 변의 길이 ${c} cm는 넓이를 구하는 데 쓰지 않는다. ${b} × ${h} = ${b * h}(cm²)`, facts: calc(`${b}*${h}`)
        });
      }),
      H('hard-tri-slant', '세 변의 길이와 높이가 모두 적힌 삼각형의 넓이', '심67 ①52 ②87', (d) => {
        // 어떤 아이가 틀리는가: 밑변에 옆 변의 길이를 곱하거나, 2로 나누지 않는다. [밑변, 왼쪽 변, 오른쪽 변, 높이, 높이의 발]
        const [b, left, right, h, x] = d.pick([[14, 13, 15, 12, 5], [21, 10, 17, 8, 6], [12, 10, 10, 8, 6], [18, 15, 15, 12, 9], [28, 17, 25, 15, 8]]), flip = d.bool();
        const raw = [[0, h], [b, h], [x, 0], [x, h]].map(([u, v]) => [flip ? b - u : u, v]);
        return N('삼각형의 넓이는 몇 cm²인가?', (b * h) / 2, {
          unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p.slice(0, 3)), outside(p.slice(0, 3), 0, len(b)), outside(p.slice(0, 3), 1, len(right)), outside(p.slice(0, 3), 2, len(left)), height(p[2], p[3], p[1], len(h), edges(p.slice(0, 3)))],
            { box: [6, 4.4], label: `세 변의 길이가 ${b} cm, ${left} cm, ${right} cm인 삼각형. 길이가 ${b} cm인 변을 밑변으로 할 때의 높이(점선) ${h} cm` }),
          explain: `밑변 ${b} cm에 수직인 점선의 길이 ${h} cm가 높이이다. 나머지 두 변의 길이는 넓이를 구하는 데 쓰지 않는다. ${b} × ${h} ÷ 2 = ${(b * h) / 2}(cm²)`, facts: Object.assign(calc(`${b}*${h}/2`, [2]), { rule: 'tri-slant' })
        });
      }),
      H('hard-tri-outside', '밑변을 늘인 길이까지 적힌 둔각삼각형의 넓이', '심70 ①45 ③58', (d) => {
        // 어떤 아이가 틀리는가: 점선으로 늘인 부분까지 밑변으로 본다((밑변 + 늘인 길이) × 높이 ÷ 2).
        const [e, h] = d.pick([[3, 4], [6, 8], [5, 12], [9, 12], [4, 3], [8, 6]]), b = d.until(() => d.int(5, 11), (v) => (v * h) % 2 === 0 && v !== e && v !== h), flip = d.bool();
        const raw = [[0, h], [b, h], [b + e, 0], [b + e, h]].map(([u, v]) => [flip ? b + e - u : u, v]);
        return N('색칠한 삼각형의 넓이는 몇 cm²인가?', (b * h) / 2, {
          unit: 'cm²', figure: scene(raw, (p) => [tint(p.slice(0, 3)), dashed(p[1], p[3]), outside(p.slice(0, 3), 0, len(b)), beside(p[1], p[3], len(e), [p[1][0], p[1][1] + 2]), height(p[2], p[3], p[1], len(h), [p[3][0] * 2 - p[1][0], p[3][1]])],
            { box: [5.6, 3.6], pad: [2, 1.05], label: `밑변 ${b} cm인 둔각삼각형. 밑변을 ${e} cm 늘인 점선의 끝에 수직으로 세운 높이(점선) ${h} cm` }),
          explain: `밑변은 삼각형의 변인 ${b} cm이고, 높이는 밑변을 늘인 선에 수직인 ${h} cm이다. 점선으로 늘인 ${e} cm는 밑변에 넣지 않는다. ${b} × ${h} ÷ 2 = ${(b * h) / 2}(cm²)`, facts: calc(`${b}*${h}/2`, [2])
        });
      }),
      H('hard-para-two-heights', '평행사변형의 두 밑변과 두 높이', '심60 ①56 ③55', (d) => {
        // 어떤 아이가 틀리는가: 한 밑변에 다른 밑변의 높이를 짝 짓는다. 넓이를 두 가지로 세워야 한다: (한 밑변) × (그 높이) = (다른 밑변) × (그 높이)
        const [a, c] = d.pick([[15, 10], [20, 15], [25, 20], [30, 20], [30, 25]]), s = (c * 3) / 5, ha = (c * 4) / 5, hb = (a * 4) / 5, hide = d.pick(['hb', 'c']);
        const foot = [a + s - (a * s * s) / (c * c), (a * s * ha) / (c * c)], ask = hide === 'hb' ? hb : c, show = (key, v) => (hide === key ? '□ cm' : len(v));
        return N('평행사변형에서 □ 안에 알맞은 수는?', ask, {
          unit: 'cm', figure: scene([[s, 0], [0, ha], [a, ha], [a + s, 0], [a + s, ha], foot], (p) => [G.polygon(p.slice(0, 4)), dashed(p[2], p[4]), height(p[3], p[4], p[2], len(ha), [p[4][0] + 2, p[4][1]]), height(p[0], p[5], p[2], show('hb', hb), edges(p.slice(0, 4))), outside(p.slice(0, 4), 1, len(a)), outside(p.slice(0, 4), 0, show('c', c))],
            { box: [7, 3.4], pad: [2, 1.05], label: `평행사변형. 아래쪽 밑변 ${a} cm와 그 높이 ${ha} cm, 비스듬한 밑변 ${hide === 'c' ? '□' : c} cm와 그 높이 ${hide === 'hb' ? '□' : hb} cm. 높이는 모두 점선과 직각 표시로 나타냈다.` }),
          explain: `넓이는 어느 변을 밑변으로 해도 같다. ${a} × ${ha} = ${a * ha}(cm²)이므로 ${hide === 'hb' ? `${c} × □ = ${a * ha}, □ = ${a * ha} ÷ ${c} = ${hb}` : `□ × ${hb} = ${a * ha}, □ = ${a * ha} ÷ ${hb} = ${c}`}이다. 밑변과 높이는 서로 수직인 것끼리 짝 지어야 한다.`,
          facts: calc(`${a}*${ha}/${hide === 'hb' ? c : hb}`)
        });
      }),
      H('hard-tri-two-heights', '직각삼각형의 두 밑변과 두 높이', '심69·72 ②64 ③61', (d) => {
        // 어떤 아이가 틀리는가: 가장 긴 변에 직각을 낀 변을 높이로 곱한다. 직각을 낀 두 변으로 넓이를 구한 뒤 가장 긴 변을 밑변으로 다시 본다.
        const [p, q, r, hh] = d.pick([[20, 15, 25, 12], [40, 30, 50, 24]]), flip = d.bool(), hide = d.pick(['hh', 'r']), t = (q * q) / (p * p + q * q), show = (key, v) => (hide === key ? '□ cm' : len(v));
        const raw = [[0, 0], [0, q], [p, q], [p * t, q * t]].map(([u, v]) => [flip ? p - u : u, v]);
        return N('직각삼각형에서 □ 안에 알맞은 수는?', hide === 'hh' ? hh : r, {
          unit: 'cm', figure: scene(raw, (v) => [G.polygon(v.slice(0, 3)), G.rightMark(v[1], v[0], v[2]), outside(v.slice(0, 3), 0, len(q)), outside(v.slice(0, 3), 1, len(p)), outside(v.slice(0, 3), 2, show('r', r)), height(v[1], v[3], v[2], show('hh', hh), edges(v.slice(0, 3)))],
            { box: [6, 4.5], label: `직각을 낀 두 변이 ${q} cm, ${p} cm인 직각삼각형. 가장 긴 변 ${hide === 'r' ? '□' : r} cm, 직각인 꼭짓점에서 가장 긴 변에 수직으로 그은 점선 ${hide === 'hh' ? '□' : hh} cm` }),
          explain: `직각을 낀 두 변으로 넓이를 구하면 ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)이다. 가장 긴 변을 밑변으로 하면 점선이 높이이므로 ${hide === 'hh' ? `${r} × □ ÷ 2 = ${(p * q) / 2}, □ = ${p * q} ÷ ${r} = ${hh}` : `□ × ${hh} ÷ 2 = ${(p * q) / 2}, □ = ${p * q} ÷ ${hh} = ${r}`}이다.`,
          facts: calc(`${p}*${q}/${hide === 'hh' ? r : hh}`)
        });
      }),
      H('hard-mixed-units', '단위가 섞인 가로와 세로로 넓이 구하기', '심51 ①40 ②45 ③47·48', (d, n) => {
        // 어떤 아이가 틀리는가: 단위가 다른 두 수를 그대로 곱한다.
        if (n === 1) {
          const [a, b] = d.until(() => [d.int(3, 18), d.int(4, 15)], ([x, y]) => x !== y);
          return N(`가로가 ${a * 1000} m, 세로가 ${b} km인 직사각형 모양 땅의 넓이는 몇 km²인가?`, a * b, { unit: 'km²', explain: `단위를 km로 맞춘다. ${a * 1000} m = ${a} km이므로 ${a} × ${b} = ${a * b}(km²)이다.`, facts: calc(`${a * 1000}/1000*${b}`, [1000]) });
        }
        const a = d.pick([4, 6, 8, 12, 14]), b = d.pick([50, 150, 250, 350]), area = (a * b) / 100;
        return N(`가로가 ${a} m, 세로가 ${b} cm인 직사각형 모양 천의 넓이는 몇 m²인가?`, area, {
          unit: 'm²', explain: `단위를 cm로 맞춘다. ${a} m = ${a * 100} cm이므로 넓이는 ${a * 100} × ${b} = ${a * 100 * b}(cm²)이다. 10000 cm² = 1 m²이므로 ${a * 100 * b} cm² = ${area} m²이다.`, facts: calc(`${a}*100*${b}/10000`, [100, 10000])
        });
      }, { count: 2, standard: UNITS }),
      H('hard-stairs-peri', '계단 모양 도형의 둘레', '심10', (d) => {
        // 어떤 아이가 틀리는가: 길이가 적힌 두 변만 더하거나, 계단의 변 길이를 몰라 구할 수 없다고 여긴다.
        const Hh = d.int(9, 13), W = Hh + d.int(3, 7), x1 = Math.round(W / 3), x2 = Math.round((W * 2) / 3), y1 = Math.round(Hh / 3), y2 = Math.round((Hh * 2) / 3), flip = d.bool();
        const raw = [[0, 0], [x1, 0], [x1, y1], [x2, y1], [x2, y2], [W, y2], [W, Hh], [0, Hh]].map(([x, y]) => [flip ? W - x : x, y]);
        return N('이웃한 변이 모두 수직으로 만나는 계단 모양 도형이다. 이 도형의 둘레는 몇 cm인가?', (W + Hh) * 2, {
          unit: 'cm', figure: scene(raw, (p) => [G.polygon(p), outside(p, 6, len(W)), outside(p, 7, len(Hh))], { box: [5.6, 3.8], label: `계단 모양 도형. 아래쪽 변 ${W} cm, 가장 긴 세로 변 ${Hh} cm. 계단은 세 단이다.` }),
          explain: `가로로 놓인 계단의 변을 모두 위로 밀면 ${W} cm인 변 하나가 되고, 세로로 놓인 계단의 변을 모두 옆으로 밀면 ${Hh} cm인 변 하나가 된다. 둘레는 가로 ${W} cm, 세로 ${Hh} cm인 직사각형의 둘레와 같으므로 (${W} + ${Hh}) × 2 = ${(W + Hh) * 2}(cm)이다.`,
          facts: calc(`(${W}+${Hh})*2`, [2])
        });
      }, { standard: PERI }),
      H('hard-notch-peri', '안으로 파인 도형의 둘레', '심11', (d) => {
        // 어떤 아이가 틀리는가: 파인 곳의 세로 변 둘을 빠뜨리고 직사각형의 둘레만 구한다.
        const W = d.pick([14, 16]), Hh = d.int(8, 10), wn = 6, dn = d.int(3, 5), x1 = (W - wn) / 2;
        const raw = [[0, 0], [x1, 0], [x1, dn], [x1 + wn, dn], [x1 + wn, 0], [W, 0], [W, Hh], [0, Hh]], total = (W + Hh) * 2 + dn * 2;
        return N('직사각형의 위쪽을 직사각형 모양으로 파낸 도형이다. 이 도형의 둘레는 몇 cm인가?', total, {
          unit: 'cm', figure: scene(raw, (p) => [G.polygon(p), outside(p, 6, len(W)), outside(p, 7, len(Hh)), outside(p, 1, len(dn))], { box: [6.2, 3.8], label: `가로 ${W} cm, 세로 ${Hh} cm인 직사각형의 위쪽 가운데를 깊이 ${dn} cm인 직사각형 모양으로 파낸 도형` }),
          explain: `가로로 놓인 변을 모두 위로 밀면 직사각형이 되므로 (${W} + ${Hh}) × 2 = ${(W + Hh) * 2}(cm)이다. 여기에 파인 곳의 세로 변 2개가 더 있다. ${(W + Hh) * 2} + ${dn} × 2 = ${total}(cm)`,
          facts: calc(`(${W}+${Hh})*2+${dn}*2`, [2])
        });
      }, { standard: PERI }),
      H('hard-paths', '가로세로로 길을 낸 꽃밭의 넓이', '심40 ①42', (d) => {
        // 어떤 아이가 틀리는가: 길 둘의 넓이를 그대로 빼어 겹친 곳을 두 번 뺀다. 조각을 밀어 붙이면 직사각형 하나가 된다.
        const W = d.int(14, 22), Hh = d.int(10, 14), w = d.int(2, 3), vx = Math.round(W * 0.55), hy = Math.round(Hh * 0.38);
        const raw = [[0, 0], [W, 0], [W, Hh], [0, Hh], [vx, 0], [vx + w, 0], [vx + w, Hh], [vx, Hh], [0, hy], [W, hy], [W, hy + w], [0, hy + w]];
        return N(`가로가 ${W} m, 세로가 ${Hh} m인 직사각형 모양 꽃밭에 너비가 ${w} m인 길을 가로와 세로로 한 줄씩 냈다. 길을 뺀 꽃밭의 넓이는 몇 m²인가?`, (W - w) * (Hh - w), {
          unit: 'm²', figure: scene(raw, (p) => [styled(G.polygon(p.slice(0, 4)), 'fill:rgba(134,239,172,0.55)'), styled(G.polygon(p.slice(4, 8)), 'fill:#fff;stroke-width:1'), styled(G.polygon(p.slice(8, 12)), 'fill:#fff;stroke-width:1'), styled(G.polygon([[p[4][0], p[8][1]], [p[5][0], p[8][1]], [p[5][0], p[11][1]], [p[4][0], p[11][1]]]), 'fill:#fff;stroke:none'),
            outside(p.slice(0, 4), 2, len(W, 'm')), outside(p.slice(0, 4), 3, len(Hh, 'm')), beside(p[4], p[5], len(w, 'm'), [p[4][0], p[4][1] - 2]), beside(p[9], p[10], len(w, 'm'), [p[9][0] + 2, p[9][1]])],
          { box: [5.4, 3.6], pad: [2, 1.05], label: `가로 ${W} m, 세로 ${Hh} m인 직사각형 모양 꽃밭. 너비 ${w} m인 길이 가로로 한 줄, 세로로 한 줄 꽃밭을 가로지른다.` }),
          explain: `길로 나뉜 꽃밭 네 조각을 길이 없어지게 밀어 붙이면 가로 ${W} − ${w} = ${W - w}(m), 세로 ${Hh} − ${w} = ${Hh - w}(m)인 직사각형이 된다. ${W - w} × ${Hh - w} = ${(W - w) * (Hh - w)}(m²)`,
          facts: calc(`(${W}-${w})*(${Hh}-${w})`)
        });
      }, { standard: RECT }),
      H('hard-tri-split', '밑변을 똑같이 나눈 삼각형의 색칠한 조각', '심78 ①60', (d) => {
        // 어떤 아이가 틀리는가: 조각마다 높이가 다르다고 여겨 구할 수 없다고 한다. 조각은 모두 높이가 같다(높이가 조각 밖에 있다).
        const n = d.pick([4, 5]), u = d.int(3, 6), h = d.until(() => d.int(6, 12), (v) => (u * v) % 2 === 0), picks = d.shuffle(Array.from({ length: n - 1 }, (_, i) => i + 1)).slice(0, 2).sort((x, y) => x - y), flip = d.bool();
        const raw = [[0, 0], [0, h]].concat(Array.from({ length: n }, (_, i) => [(i + 1) * u, h])).map(([x, y]) => [flip ? n * u - x : x, y]), area = (u * h) / 2 * 2;
        return N(`직각삼각형의 밑변을 똑같이 ${n}칸으로 나누어 위쪽 꼭짓점과 이었다. 색칠한 부분의 넓이는 몇 cm²인가?`, area, {
          unit: 'cm²', figure: scene(raw, (p) => [G.polygon([p[0], p[1], p[n + 1]])].concat(picks.map((j) => tint([p[0], p[1 + j], p[2 + j]])), p.slice(2, n + 1).map((q) => thin(p[0], q)), [G.rightMark(p[1], p[0], p[2]), outside([p[0], p[1], p[n + 1]], 0, len(h)), beside(p[1], p[2], len(u), [p[1][0], p[1][1] + 2])]),
            { box: [5.8, 3.6], label: `직각삼각형의 밑변을 ${n}칸으로 똑같이 나누어 위쪽 꼭짓점과 이은 그림. 밑변 한 칸 ${u} cm, 높이 ${h} cm, 색칠한 조각은 2개` }),
          explain: `나누어진 삼각형은 모두 밑변이 ${u} cm이고 높이가 ${h} cm이다(높이는 조각의 밖에 있다). 조각 하나의 넓이는 ${u} × ${h} ÷ 2 = ${(u * h) / 2}(cm²)이므로 색칠한 2개의 넓이는 ${(u * h) / 2} × 2 = ${area}(cm²)이다.`,
          facts: calc(`${u}*${h}/2*2`, [])
        });
      }),
      H('hard-trap-slant', '비스듬한 변의 길이까지 적힌 사다리꼴의 넓이', '심84 ②87', (d) => {
        // 어떤 아이가 틀리는가: 비스듬한 변을 높이로 쓴다.
        const h = d.pick([8, 12, 24]), [[c1, o1], [c2, o2]] = d.shuffle(SLANTS[h]), a = d.int(Math.round(h * 0.6), h), b = o1 + a + o2, area = ((a + b) * h) / 2;
        return N('사다리꼴의 넓이는 몇 cm²인가?', area, {
          unit: 'cm²', figure: scene([[o1, 0], [0, h], [b, h], [o1 + a, 0], [o1, h]], (p) => [G.polygon(p.slice(0, 4)), outside(p.slice(0, 4), 3, len(a)), outside(p.slice(0, 4), 1, len(b)), outside(p.slice(0, 4), 0, len(c1)), outside(p.slice(0, 4), 2, len(c2)), height(p[0], p[4], p[2], len(h), edges(p.slice(0, 4)))],
            { box: [6, 3.6], label: `윗변 ${a} cm, 아랫변 ${b} cm, 비스듬한 두 변 ${c1} cm, ${c2} cm인 사다리꼴. 두 밑변에 수직인 점선(높이) ${h} cm` }),
          explain: `높이는 두 밑변에 수직인 점선의 길이 ${h} cm이다. 비스듬한 두 변의 길이는 넓이를 구하는 데 쓰지 않는다. (${a} + ${b}) × ${h} ÷ 2 = ${area}(cm²)`, facts: Object.assign(calc(`(${a}+${b})*${h}/2`, [2]), { rule: 'trap-slant' })
        });
      }),
      H('hard-stretch', '정사각형의 변을 늘였을 때 늘어난 넓이', '심37 ③33', (d) => {
        // 어떤 아이가 틀리는가: 늘인 길이끼리 곱하거나(2 × 2), 한 변에 늘인 길이를 곱한다(7 × 2).
        const s = d.int(6, 14), x = d.int(2, 5);
        return N(`한 변의 길이가 ${s} cm인 정사각형의 네 변을 모두 ${x} cm씩 늘여 더 큰 정사각형을 만들었다. 넓이는 몇 cm² 늘어났는가?`, (s + x) * (s + x) - s * s, {
          unit: 'cm²', explain: `새 정사각형의 한 변의 길이는 ${s} + ${x} = ${s + x}(cm)이다. ${s + x} × ${s + x} − ${s} × ${s} = ${(s + x) * (s + x)} − ${s * s} = ${(s + x) * (s + x) - s * s}(cm²)`, facts: calc(`(${s}+${x})*(${s}+${x})-${s}*${s}`)
        });
      }, { standard: RECT }),
      H('hard-circle-rhom', '원 안에 그린 마름모의 넓이', '심106 ②82·83 ③69', (d) => {
        // 어떤 아이가 틀리는가: 한 변의 길이를 몰라 구할 수 없다고 여기거나 반지름끼리 곱한다. 두 대각선이 모두 원의 지름이다.
        const r = d.int(4, 12), c = [3, 3], R = 2.3, pts = [[c[0], c[1] - R], [c[0] + R, c[1]], [c[0], c[1] + R], [c[0] - R, c[1]]];
        return N(`반지름이 ${r} cm인 원 안에 네 꼭짓점이 모두 원 위에 있는 마름모를 그렸다. 마름모의 두 대각선이 모두 원의 중심을 지날 때, 이 마름모의 넓이는 몇 cm²인가?`, r * r * 2, {
          unit: 'cm²', figure: G.board(6, 6, [styled(G.circle(c, R), 'fill:#fff'), tint(pts), dashed(pts[0], pts[2]), dashed(pts[3], pts[1]), G.point(c)], { grid: false, scale: 1.1, label: '원과 그 안에 그린 마름모. 마름모의 네 꼭짓점은 원 위에 있고 두 대각선(점선)은 원의 중심에서 만난다.' }),
          explain: `마름모의 두 대각선은 모두 원의 지름이므로 길이가 ${r} × 2 = ${r * 2}(cm)이다. 넓이는 ${r * 2} × ${r * 2} ÷ 2 = ${r * r * 2}(cm²)이다.`, facts: calc(`${r}*2*${r}*2/2`, [2])
        });
      }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ───────────────────────
      H('hard-peri-rhom-rect', '둘레가 같은 마름모와 직사각형', '심8 ①10 ②9 ③12', (d) => {
        const s = d.int(7, 16), b = d.until(() => d.int(4, s - 1), (v) => v !== s * 2 - v);
        return N(`한 변의 길이가 ${s} cm인 마름모와 둘레가 같은 직사각형이 있다. 직사각형의 세로가 ${b} cm일 때 가로는 몇 cm인가?`, s * 2 - b, {
          unit: 'cm', explain: `마름모의 둘레는 ${s} × 4 = ${s * 4}(cm)이다. 직사각형의 가로와 세로의 합은 ${s * 4} ÷ 2 = ${s * 2}(cm)이므로 가로는 ${s * 2} − ${b} = ${s * 2 - b}(cm)이다.`, facts: calc(`${s}*4/2-${b}`, [4, 2])
        });
      }, { standard: PERI }),
      H('hard-joined-regular', '이어 붙인 정다각형의 둘레에서 한 도형의 둘레 구하기', '심14 ③14', (d) => {
        const s = d.int(4, 12), q = Math.sqrt(3) / 2;
        const raw = [[-q, 0.5], [0, 0], [0, 1], [1, 0], [1, 1], [1 + q, 1.5], [1 + q * 2, 1], [1 + q * 2, 0], [1 + q, -0.5]];
        return N(`한 변의 길이가 모두 같은 정삼각형, 정사각형, 정육각형을 한 변이 꼭 맞닿게 이어 붙였다. 이어 붙인 도형의 둘레가 ${s * 9} cm일 때 정육각형 한 개의 둘레는 몇 cm인가?`, s * 6, {
          unit: 'cm', figure: scene(raw, (p) => [G.polygon([p[0], p[1], p[2]]), G.polygon([p[1], p[3], p[4], p[2]]), G.polygon([p[3], p[4], p[5], p[6], p[7], p[8]])], { box: [5.6, 3], pad: [0.8, 0.6], label: '왼쪽부터 정삼각형, 정사각형, 정육각형을 한 변씩 맞닿게 이어 붙인 도형. 겉에 있는 변은 정삼각형 2개, 정사각형 2개, 정육각형 5개' }),
          explain: `맞닿은 변은 둘레가 아니다. 겉에 있는 변은 2 + 2 + 5 = 9(개)이므로 한 변의 길이는 ${s * 9} ÷ 9 = ${s}(cm)이다. 정육각형의 둘레는 ${s} × 6 = ${s * 6}(cm)이다.`, facts: calc(`${s * 9}/(2+2+5)*6`, [6])
        });
      }, { standard: PERI }),
      H('hard-square-split', '정사각형을 나눈 직사각형 한 조각의 둘레', '②14 ③15', (d) => {
        const k = d.pick([2, 3, 4]), m = d.int(2, 6), side = k * m, P = side * 4;
        return N(`둘레가 ${P} cm인 정사각형을 크기가 같은 직사각형 ${k}개로 나누었다. 직사각형 한 개의 둘레는 몇 cm인가?`, (m + side) * 2, {
          unit: 'cm', figure: scene([[0, 0], [0, 1], [1, 1], [1, 0]], (p) => [G.polygon(p)].concat(Array.from({ length: k - 1 }, (_, i) => { const x = p[0][0] + ((p[3][0] - p[0][0]) * (i + 1)) / k; return G.line([x, p[0][1]], [x, p[1][1]]); })), { box: [3, 3], pad: [0.6, 0.6], label: `정사각형을 세로로 긴 직사각형 ${k}개로 똑같이 나눈 그림` }),
          explain: `정사각형의 한 변의 길이는 ${P} ÷ 4 = ${side}(cm)이다. 직사각형 한 개는 가로가 ${side} ÷ ${k} = ${m}(cm), 세로가 ${side} cm이므로 둘레는 (${m} + ${side}) × 2 = ${(m + side) * 2}(cm)이다.`,
          facts: calc(`(${P}/4/${k}+${P}/4)*2`, [4, 2])
        });
      }, { standard: PERI }),
      H('hard-two-squares', '직사각형을 나눈 두 정사각형', '①33', (d) => {
        const m = d.int(4, 7), g = m + d.int(2, 5), W = g + m;
        const raw = [[0, 0], [W, 0], [W, g], [0, g], [g, 0], [g, g], [g, g - m], [W, g - m]];
        return N(`가로가 ${W} cm인 직사각형을 정사각형 가, 정사각형 나와 남은 부분으로 나누었다. 정사각형 나의 넓이가 ${m * m} cm²일 때 정사각형 가의 넓이는 몇 cm²인가?`, g * g, {
          unit: 'cm²', figure: scene(raw, (p) => [styled(G.polygon(p.slice(0, 4)), 'fill:#fff'), tint([p[0], p[4], p[5], p[3]]), tint([p[6], p[7], p[2], p[5]], 'rgba(134,239,172,0.5)'), G.text(centre([p[0], p[4], p[5], p[3]]), '가'), G.text(centre([p[6], p[7], p[2], p[5]]), '나'), dim(p[3], p[2], p[0], len(W))],
            { box: [5.4, 3.4], pad: [1, 1.3], label: `가로 ${W} cm인 직사각형. 왼쪽에 직사각형의 세로를 한 변으로 하는 정사각형 가가 있고, 오른쪽 아래에 그보다 작은 정사각형 나가 있다.` }),
          explain: `${m} × ${m} = ${m * m}이므로 정사각형 나의 한 변의 길이는 ${m} cm이다. 정사각형 가의 한 변의 길이는 ${W} − ${m} = ${g}(cm)이므로 넓이는 ${g} × ${g} = ${g * g}(cm²)이다.`,
          facts: calc(`(${W}-${m})*(${W}-${m})`, [m])
        });
      }, { standard: RECT }),
      H('hard-towel', '넓이에서 구한 변으로 다른 도형의 넓이 구하기', '심28', (d) => {
        const b = d.int(7, 15), a = d.until(() => d.int(12, 40), (v) => v > b + 3);
        return N(`가로가 ${a} cm이고 넓이가 ${a * b} cm²인 직사각형 모양 수건이 있다. 이 수건의 세로와 한 변의 길이가 같은 정사각형 모양 손수건의 넓이는 몇 cm²인가?`, b * b, {
          unit: 'cm²', explain: `수건의 세로는 ${a * b} ÷ ${a} = ${b}(cm)이다. 손수건은 한 변의 길이가 ${b} cm인 정사각형이므로 넓이는 ${b} × ${b} = ${b * b}(cm²)이다.`, facts: calc(`(${a * b}/${a})*(${a * b}/${a})`)
        });
      }, { standard: RECT }),
      H('hard-same-peri-square', '둘레가 같은 직사각형과 정사각형의 넓이의 차', '심31 ②34', (d) => {
        const s = d.int(8, 16), k = d.int(2, 5), a = s + k, b = s - k;
        return N(`가로가 ${a} cm, 세로가 ${b} cm인 직사각형과 둘레가 같은 정사각형이 있다. 정사각형은 직사각형보다 몇 cm² 더 넓은가?`, k * k, {
          unit: 'cm²', explain: `직사각형의 둘레는 (${a} + ${b}) × 2 = ${s * 4}(cm)이므로 정사각형의 한 변의 길이는 ${s * 4} ÷ 4 = ${s}(cm)이다. ${s} × ${s} − ${a} × ${b} = ${s * s} − ${a * b} = ${k * k}(cm²)`,
          facts: calc(`((${a}+${b})*2/4)*((${a}+${b})*2/4)-${a}*${b}`, [2, 4])
        });
      }, { standard: RECT }),
      H('hard-unit-side', '넓이와 한 변의 단위를 맞추어 다른 변 구하기', '심53 ①41 ②47 ③49', (d) => {
        const a = d.int(2, 8), b = d.until(() => d.int(2, 9), (v) => v !== a);
        return N(`넓이가 ${a * b} m²이고 가로가 ${a * 100} cm인 직사각형 모양 벽이 있다. 이 벽의 세로는 몇 cm인가?`, b * 100, {
          unit: 'cm', explain: `${a * 100} cm = ${a} m이므로 세로는 ${a * b} ÷ ${a} = ${b}(m)이다. ${b} m = ${b * 100} cm`, facts: calc(`${a * b}*10000/${a * 100}`, [10000])
        });
      }, { standard: UNITS }),
      H('hard-unit-square', '넓이가 같은 정사각형 모양 땅의 둘레', '심52', (d) => {
        const [a, b] = d.pick([[9, 4], [16, 4], [8, 2], [12, 3], [18, 2], [20, 5], [25, 4], [27, 3], [16, 9]]), s = Math.round(Math.sqrt(a * b));
        return N(`가로가 ${a * 1000} m, 세로가 ${b * 1000} m인 직사각형 모양 땅과 넓이가 같은 정사각형 모양 땅이 있다. 정사각형 모양 땅의 둘레는 몇 km인가?`, s * 4, {
          unit: 'km', explain: `직사각형 모양 땅의 넓이는 ${a} km × ${b} km = ${a * b} km²이다. ${s} × ${s} = ${a * b}이므로 정사각형의 한 변의 길이는 ${s} km이고 둘레는 ${s} × 4 = ${s * 4}(km)이다.`,
          facts: { range: { ineq: `x*x>${a * b * 16 - 1}`, lo: 1, hi: 100, want: 'min' } }
        });
      }, { standard: UNITS }),
      H('hard-wall-tiles', '벽을 채우는 타일의 수', '심55', (d) => {
        const [tw, th] = d.pick([[50, 20], [50, 25], [40, 25], [25, 20], [50, 40]]), W = d.int(3, 8), Hh = d.int(2, 4), count = ((W * 100) / tw) * ((Hh * 100) / th);
        return N(`가로가 ${W} m, 세로가 ${Hh} m인 직사각형 모양 벽에 가로가 ${tw} cm, 세로가 ${th} cm인 직사각형 모양 타일을 같은 방향으로 겹치지 않게 빈틈없이 붙이려고 한다. 타일은 모두 몇 장 필요한가?`, count, {
          unit: '장', explain: `벽의 가로는 ${W * 100} cm이므로 타일이 가로로 ${W * 100} ÷ ${tw} = ${(W * 100) / tw}(장), 세로는 ${Hh * 100} cm이므로 세로로 ${Hh * 100} ÷ ${th} = ${(Hh * 100) / th}(장) 놓인다. ${(W * 100) / tw} × ${(Hh * 100) / th} = ${count}(장)`,
          facts: calc(`(${W}*100/${tw})*(${Hh}*100/${th})`, [100])
        });
      }, { standard: UNITS }),
      H('hard-para-peri-area', '둘레에서 밑변을 구해 평행사변형의 넓이 구하기', '심61 ②54', (d) => {
        const [s, h, c] = d.pick(PYT), b = d.int(Math.max(s + 3, h), h + 8), P = (b + c) * 2, flip = d.bool(), raw = [[s, 0], [0, h], [b, h], [b + s, 0], [s, h]].map(([x, y]) => [flip ? b + s - x : x, y]);
        return N(`둘레가 ${P} cm인 평행사변형이다. 이 평행사변형의 넓이는 몇 cm²인가?`, b * h, {
          unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p.slice(0, 4)), outside(p.slice(0, 4), 0, len(c)), height(p[0], p[4], p[2], len(h), edges(p.slice(0, 4)))], { label: `비스듬한 변 ${c} cm인 평행사변형. 아래쪽 변에 수직인 점선(높이) ${h} cm. 아래쪽 변의 길이는 적혀 있지 않다.` }),
          explain: `이웃한 두 변의 길이의 합은 ${P} ÷ 2 = ${P / 2}(cm)이므로 밑변의 길이는 ${P / 2} − ${c} = ${b}(cm)이다. 넓이는 ${b} × ${h} = ${b * h}(cm²)이다. 비스듬한 변 ${c} cm는 높이가 아니다.`, facts: calc(`(${P}/2-${c})*${h}`, [2])
        });
      }),
      H('hard-tri-peri-area', '세 변의 길이의 합에서 밑변을 구해 삼각형의 넓이 구하기', '심77 ③62', (d) => {
        const [s, h, c] = d.pick([[3, 4, 5], [4, 3, 5], [8, 6, 10], [6, 8, 10], [12, 9, 15], [9, 12, 15], [12, 16, 20]]), base = s * 2, P = base + c * 2;
        return N(`세 변의 길이의 합이 ${P} cm인 이등변삼각형이다. 이 삼각형의 넓이는 몇 cm²인가?`, s * h, {
          unit: 'cm²', figure: scene([[0, h], [base, h], [s, 0], [s, h]], (p) => [G.polygon(p.slice(0, 3)), outside(p.slice(0, 3), 1, len(c)), outside(p.slice(0, 3), 2, len(c)), height(p[2], p[3], p[1], len(h), edges(p.slice(0, 3)))], { box: [5.6, 3.8], label: `길이가 같은 두 변이 각각 ${c} cm인 이등변삼각형. 아래쪽 변에 수직인 점선(높이) ${h} cm. 아래쪽 변의 길이는 적혀 있지 않다.` }),
          explain: `밑변의 길이는 ${P} − ${c} − ${c} = ${base}(cm)이다. 넓이는 ${base} × ${h} ÷ 2 = ${s * h}(cm²)이다. 길이가 ${c} cm인 변은 높이가 아니다.`, facts: calc(`(${P}-${c}-${c})*${h}/2`, [2])
        });
      }),
      H('hard-trap-peri-area', '둘레에서 높이를 구해 사다리꼴의 넓이 구하기', '심89 ②72', (d) => {
        const [out, h, c] = d.pick(PYT), a = d.until(() => d.int(Math.ceil(h / 2), h + 3), (v) => ((v * 2 + out) * h) % 2 === 0 && v + out !== c && v !== h), b = a + out, P = a + b + c + h, flip = d.bool(), area = ((a + b) * h) / 2;
        const raw = [[0, 0], [0, h], [b, h], [a, 0]].map(([x, y]) => [flip ? b - x : x, y]);
        return N(`둘레가 ${P} cm인 사다리꼴이다. 이 사다리꼴의 넓이는 몇 cm²인가?`, area, {
          unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p), G.rightMark(p[0], p[1], p[3]), G.rightMark(p[1], p[0], p[2]), outside(p, 3, len(a)), outside(p, 1, len(b)), outside(p, 2, len(c))], { label: `윗변 ${a} cm, 아랫변 ${b} cm, 비스듬한 변 ${c} cm인 사다리꼴. 남은 한 변은 두 밑변과 직각으로 만나고 길이가 적혀 있지 않다.` }),
          explain: `두 밑변과 직각으로 만나는 변의 길이가 높이이다. 높이는 ${P} − ${a} − ${b} − ${c} = ${h}(cm)이므로 넓이는 (${a} + ${b}) × ${h} ÷ 2 = ${area}(cm²)이다.`, facts: calc(`(${a}+${b})*(${P}-${a}-${b}-${c})/2`, [2])
        });
      }),
      H('hard-para-shared-height', '높이가 같은 두 평행사변형', '심63 ②65', (d) => {
        const h = d.int(6, 12), [b1, b2] = d.until(() => [d.int(8, 18), d.int(5, 14)], ([x, y]) => x !== y && x !== h && y !== h);
        return N(`높이가 같은 두 평행사변형 가와 나가 있다. 가는 밑변의 길이가 ${b1} cm이고 넓이가 ${b1 * h} cm²이다. 나의 밑변의 길이가 ${b2} cm일 때 나의 넓이는 몇 cm²인가?`, b2 * h, {
          unit: 'cm²', explain: `가의 높이는 ${b1 * h} ÷ ${b1} = ${h}(cm)이다. 나의 높이도 ${h} cm이므로 넓이는 ${b2} × ${h} = ${b2 * h}(cm²)이다.`, facts: calc(`${b1 * h}/${b1}*${b2}`)
        });
      }),
      H('hard-para-half', '평행사변형의 절반의 넓이에서 높이 구하기', '심64 ①53', (d) => {
        const b = d.int(3, 9) * 100, h = d.until(() => d.int(2, 9) * 100, (v) => v !== b), halfArea = (b * h) / 2;
        return N(`평행사변형 모양 밭의 절반에 고구마를 심었다. 고구마를 심은 부분의 넓이가 ${halfArea} m²이고 밭의 밑변의 길이가 ${b} m일 때 밭의 높이는 몇 m인가?`, h, {
          unit: 'm', explain: `밭 전체의 넓이는 ${halfArea} × 2 = ${b * h}(m²)이다. 높이는 ${b * h} ÷ ${b} = ${h}(m)이다.`, facts: calc(`${halfArea}*2/${b}`, [2])
        });
      }),
      H('hard-tri-to-trap', '삼각형의 넓이로 높이를 구해 사다리꼴의 넓이 구하기', '심90 ①67 ②75 ③83', (d) => {
        const b = d.int(10, 18), a = d.int(5, b - 3), h = d.until(() => d.int(5, 12), (v) => (b * v) % 2 === 0 && ((a + b) * v) % 2 === 0), x = d.int(2, 3), tri = (b * h) / 2, area = ((a + b) * h) / 2;
        return N(`사다리꼴 ㄱㄴㄷㄹ에서 삼각형 ㄱㄴㄷ의 넓이가 ${tri} cm²이다. 사다리꼴 ㄱㄴㄷㄹ의 넓이는 몇 cm²인가?`, area, {
          unit: 'cm²', figure: scene([[x, 0], [0, h], [b, h], [x + a, 0]], (p) => [G.polygon(p), thin(p[0], p[2]), names(p, ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ']), outside(p, 3, len(a)), outside(p, 1, len(b))], { box: [5.6, 3.4], pad: [1.2, 1.1], label: `사다리꼴 ㄱㄴㄷㄹ과 선분 ㄱㄷ. 윗변 ㄱㄹ ${a} cm, 아랫변 ㄴㄷ ${b} cm` }),
          explain: `삼각형 ㄱㄴㄷ에서 변 ㄴㄷ을 밑변으로 하면 높이는 ${tri} × 2 ÷ ${b} = ${h}(cm)이고, 이것은 사다리꼴의 높이와 같다. 사다리꼴의 넓이는 (${a} + ${b}) × ${h} ÷ 2 = ${area}(cm²)이다.`,
          facts: calc(`(${a}+${b})*(${tri}*2/${b})/2`, [2])
        });
      }),
      H('hard-trap-to-side', '넓이에서 사다리꼴의 아랫변 구하기', '①64 ③79', (d) => {
        const [a, b, h] = d.until(() => [d.int(4, 12), d.int(7, 18), d.int(4, 12)], ([x, y, z]) => y > x + 1 && ((x + y) * z) % 2 === 0 && z !== x), area = ((a + b) * h) / 2;
        return N(`넓이가 ${area} cm²이고 높이가 ${h} cm인 사다리꼴이 있다. 윗변의 길이가 ${a} cm일 때 아랫변의 길이는 몇 cm인가?`, b, {
          unit: 'cm', explain: `((윗변의 길이) + (아랫변의 길이)) × ${h} ÷ 2 = ${area}이므로 두 밑변의 길이의 합은 ${area} × 2 ÷ ${h} = ${a + b}(cm)이다. 아랫변의 길이는 ${a + b} − ${a} = ${b}(cm)이다.`, facts: calc(`${area}*2/${h}-${a}`, [2])
        });
      }),
      H('hard-same-area', '넓이가 같거나 몇 배인 두 도형에서 길이 구하기', '심74·93·102 ①70·76 ②79·92 ③88', (d, n) => {
        if (n === 1) {
          const [p, q, r] = d.until(() => [d.int(4, 12), d.int(4, 12), d.int(4, 16)], ([x, y, z]) => x !== y && (x * y) % 2 === 0 && (x * y * 2) % z === 0 && z !== x && z !== y && (x * y * 2) / z !== z && (x * y * 2) / z <= z * 2 && (x * y * 2) / z >= z / 2);
          return N(`두 대각선의 길이가 ${p} cm, ${q} cm인 마름모 가가 있다. 마름모 나의 넓이는 가의 넓이의 2배이고 한 대각선의 길이는 ${r} cm이다. 마름모 나의 다른 대각선의 길이는 몇 cm인가?`, (p * q * 2) / r, {
            unit: 'cm', explain: `가의 넓이는 ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)이므로 나의 넓이는 ${(p * q) / 2} × 2 = ${p * q}(cm²)이다. ${r} × (다른 대각선의 길이) ÷ 2 = ${p * q}이므로 다른 대각선의 길이는 ${p * q} × 2 ÷ ${r} = ${(p * q * 2) / r}(cm)이다.`,
            facts: calc(`${p}*${q}/2*2*2/${r}`, [])
          });
        }
        const [pb, ph, tb] = d.until(() => [d.int(6, 16), d.int(4, 12), d.int(6, 24)], ([x, y, z]) => x !== y && (x * y * 2) % z === 0 && z !== x && z !== y && (x * y * 2) / z !== y && (x * y * 2) / z !== x && (x * y * 2) / z <= z * 2 && (x * y * 2) / z >= 4);
        return N(`밑변의 길이가 ${pb} cm, 높이가 ${ph} cm인 평행사변형과 넓이가 같은 삼각형이 있다. 삼각형의 밑변의 길이가 ${tb} cm일 때 높이는 몇 cm인가?`, (pb * ph * 2) / tb, {
          unit: 'cm', explain: `평행사변형의 넓이는 ${pb} × ${ph} = ${pb * ph}(cm²)이다. ${tb} × (높이) ÷ 2 = ${pb * ph}이므로 삼각형의 높이는 ${pb * ph} × 2 ÷ ${tb} = ${(pb * ph * 2) / tb}(cm)이다.`, facts: calc(`${pb}*${ph}*2/${tb}`, [2])
        });
      }, { count: 2 }),
      H('hard-rhom-rect-peri', '직사각형의 둘레에서 안에 그린 마름모의 넓이 구하기', '심104', (d) => {
        const [a, b] = d.until(() => [d.int(10, 30), d.int(6, 18)], ([x, y]) => x > y + 2 && (x * y) % 2 === 0), P = (a + b) * 2;
        return N(`둘레가 ${P} cm이고 세로가 ${b} cm인 직사각형의 네 변의 가운데를 이어 마름모를 그렸다. 마름모의 넓이는 몇 cm²인가?`, (a * b) / 2, {
          unit: 'cm²', explain: `직사각형의 가로는 ${P} ÷ 2 − ${b} = ${a}(cm)이다. 마름모의 두 대각선의 길이는 직사각형의 가로, 세로와 같으므로 넓이는 ${a} × ${b} ÷ 2 = ${(a * b) / 2}(cm²)이다.`, facts: calc(`(${P}/2-${b})*${b}/2`, [2])
        });
      }),
      H('hard-rhom-row', '한 줄로 이어 놓은 마름모의 넓이', '심109', (d) => {
        const k = d.pick([3, 4, 5]), p = d.pick([6, 8, 10, 12]), q = d.until(() => d.int(5, 16), (v) => v !== p && v > p * 0.6 && v < p * 1.7), total = (p * q) / 2 * k;
        const raw = [].concat(...Array.from({ length: k }, (_, i) => [[i * p + p / 2, 0], [i * p + p, q / 2], [i * p + p / 2, q], [i * p, q / 2]]), [[0, q], [k * p, q], [k * p, 0]]);
        return N(`똑같은 마름모 ${k}개를 꼭짓점이 맞닿게 한 줄로 이어 놓았다. 마름모 ${k}개의 넓이는 모두 몇 cm²인가?`, total, {
          unit: 'cm²', figure: scene(raw, (v) => Array.from({ length: k }, (_, i) => tint(v.slice(i * 4, i * 4 + 4))).concat([dim(v[k * 4], v[k * 4 + 1], v[0], len(k * p)), dim(v[k * 4 + 2], v[k * 4 + 1], v[0], len(q))]), { box: [5.2, 2.6], pad: [2.3, 1.3], label: `똑같은 마름모 ${k}개를 가로로 한 줄로 이어 놓은 그림. 전체 가로 길이 ${k * p} cm, 세로 길이 ${q} cm` }),
          explain: `마름모 한 개의 가로로 놓인 대각선의 길이는 ${k * p} ÷ ${k} = ${p}(cm), 세로로 놓인 대각선의 길이는 ${q} cm이다. 한 개의 넓이는 ${p} × ${q} ÷ 2 = ${(p * q) / 2}(cm²)이므로 ${k}개의 넓이는 ${(p * q) / 2} × ${k} = ${total}(cm²)이다.`,
          facts: calc(`${k * p}/${k}*${q}/2*${k}`, [2])
        });
      }),
      H('hard-compose', '삼각형과 사다리꼴로 나누어 구하는 넓이', '심96 ①78 ②94 ③90', (d) => {
        const W = d.pick([12, 14, 16]), bw = d.pick([4, 6, 8]), t = d.int(4, 6), h = d.int(7, 9), area = (W * t) / 2 + ((W + bw) * h) / 2;
        const raw = [[W / 2, 0], [W, t], [(W + bw) / 2, t + h], [(W - bw) / 2, t + h], [0, t], [0, 0], [W, 0], [0, t + h]];
        return N('삼각형과 사다리꼴로 나눌 수 있는 오각형이다. 이 도형의 넓이는 몇 cm²인가?', area, {
          unit: 'cm²', figure: scene(raw, (p) => [G.polygon(p.slice(0, 5)), dashed(p[4], p[1]), dim(p[5], p[6], p[2], len(W), 0.4), dim(p[5], p[4], p[1], len(t), 0.45), dim(p[4], p[7], p[1], len(h), 0.45), outside(p.slice(0, 5), 2, len(bw))],
            { box: [4.4, 4.4], pad: [2.3, 1.3], label: `오각형. 가장 넓은 곳의 가로 ${W} cm(점선), 점선 위쪽 삼각형의 높이 ${t} cm, 점선 아래쪽 사다리꼴의 높이 ${h} cm, 아래쪽 변 ${bw} cm` }),
          explain: `점선을 따라 나누면 위쪽은 밑변 ${W} cm, 높이 ${t} cm인 삼각형이고 아래쪽은 두 밑변이 ${W} cm, ${bw} cm이고 높이가 ${h} cm인 사다리꼴이다. ${W} × ${t} ÷ 2 + (${W} + ${bw}) × ${h} ÷ 2 = ${(W * t) / 2} + ${((W + bw) * h) / 2} = ${area}(cm²)`,
          facts: calc(`${W}*${t}/2+(${W}+${bw})*${h}/2`, [2])
        });
      }),
      H('hard-three-squares', '이어 붙인 정사각형에서 삼각형을 뺀 넓이', '심83', (d) => {
        const [s1, s2, s3] = d.pick([[4, 7, 10], [3, 5, 8], [4, 6, 8], [5, 7, 10], [3, 6, 9], [4, 8, 12]]), S = s1 + s2 + s3, area = s1 * s1 + s2 * s2 + s3 * s3 - (S * s3) / 2;
        const raw = [[0, s3 - s1], [s1, s3 - s1], [s1, s3 - s2], [s1 + s2, s3 - s2], [s1 + s2, 0], [S, 0], [S, s3], [0, s3], [s1, s3], [s1 + s2, s3]];
        return N('정사각형 3개를 나란히 이어 붙이고 선분 하나를 그었다. 색칠한 부분의 넓이는 몇 cm²인가?', area, {
          unit: 'cm²', figure: scene(raw, (p) => [tint(p.slice(0, 8)), white([p[7], p[6], p[5]]), thin(p[1], p[8]), thin(p[3], p[9]), outside(p.slice(0, 8), 7, len(s1)), outside(p.slice(0, 8), 2, len(s2)), outside(p.slice(0, 8), 4, len(s3))],
            { box: [5.6, 3.6], pad: [1.8, 1.05], label: `한 변의 길이가 ${s1} cm, ${s2} cm, ${s3} cm인 정사각형 3개를 아래쪽을 맞추어 나란히 이어 붙인 그림. 왼쪽 아래 끝과 오른쪽 위 끝을 이은 선분의 아래쪽 삼각형은 색칠하지 않았다.` }),
          explain: `정사각형 3개의 넓이의 합은 ${s1} × ${s1} + ${s2} × ${s2} + ${s3} × ${s3} = ${s1 * s1 + s2 * s2 + s3 * s3}(cm²)이다. 색칠하지 않은 부분은 밑변이 ${s1} + ${s2} + ${s3} = ${S}(cm), 높이가 ${s3} cm인 삼각형이므로 ${S} × ${s3} ÷ 2 = ${(S * s3) / 2}(cm²)이다. ${s1 * s1 + s2 * s2 + s3 * s3} − ${(S * s3) / 2} = ${area}(cm²)`,
          facts: calc(`${s1}*${s1}+${s2}*${s2}+${s3}*${s3}-(${s1}+${s2}+${s3})*${s3}/2`, [2])
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
