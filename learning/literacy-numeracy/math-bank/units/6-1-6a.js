// 6학년 1학기 6단원 직육면체의 부피와 겉넓이 — 단원 틀, 그림 도구, 기본 문항(부피 비교하기, 1 cm³와 쌓기나무, 직육면체와 정육면체의 부피, 부피로 모서리 구하기).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 74·87·79꼴, 심화꼴 68꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭) / 미룸」을 가른 대조표는 references/textbooks/수학/_분석/6-1-6/싣기_대조표.md 에 있다.
// (1 m³와 단위 바꾸기·겉넓이의 기본 문항은 6-1-6b.js, 실력 문항은 6-1-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 도형과 측정 가운데 측정. 부피와 겉넓이를 셈하는 것이 이 단원의 일이다.
//   6수03-17 직육면체와 정육면체의 겉넓이 / 6수03-18 부피 단위 1 cm³, 1 m³와 그 관계 / 6수03-19 직육면체와 정육면체의 부피
//   교육과정: 「입체도형의 겉넓이와 부피 등을 구할 때 복잡한 계산은 계산기를 사용하게 한다.」 → 손으로 셈할 만한 수만 쓴다(모서리는 한 자리 수나 10·12·15·20, 소수는 단위를 바꾸는 문항의 0.5 m 꼴).
//   「겉넓이와 부피를 구하는 방법에 대하여 다양한 추론을 하게 하고 …」 → 구하는 방법을 견주는 문항(여섯 면의 합, 세 쌍의 면, 두 밑면과 옆면)을 싣는다.
//
// 싣는 기준
//  - 주는 것(겨냥도·전개도·쌓기나무 그림·문장·표), 묻는 것(부피·겉넓이·모서리·단위·비교·방법), 도형(직육면체인가 정육면체인가), 셈의 얼개가 다르면 다른 문제다.
//    수만 다르거나 상황(이름·물건)만 다른 것은 한 번만 싣는다.
//  - 공식을 한 번 대는 것, 부피와 두 모서리에서 나머지 모서리를 한 번 거꾸로 구하는 것, 단위를 한 번 바꾸는 것은 기본에 싣는다.
//  - 그림은 셈하여 그린다. 겨냥도는 5학년 「직육면체」의 도구(B.kit.box525.sketch)로 적힌 길이의 비율대로 그리고, 전개도는 면을 정확한 크기로 놓는다.
//    쌓기나무 그림은 낱개마다 보이는 면을 모두 그리고(가려진 쌓기나무는 뒤에서부터 덮어 그려 저절로 가려진다), 기본 문항에서는 보이는 면이 하나도 없는 쌓기나무가 생기지 않게 쌓는다.
//    그림 속 수는 aria-label 에 적는다.
//  - 서술형·작도는 싣지 않는다. 고르기나 수 답으로 바꿀 수 있는 것은 바꾸었다(방법 쓰기 → 식의 빈칸·식 고르기, 같은 부피끼리 잇기 → 부피가 같은 두 개 고르기).
//
// 뺀 것과 까닭(단원 전체)
//  - 들이와 부피의 관계(L·mL): 성취기준에 없다. 꼴 목록에도 없었다.
//  - 위·앞·옆에서 본 모양으로 준 입체(②67 심16·55): 6학년 2학기 「공간과 입체」의 일이다.
//  - 최소공배수로 쌓는 가장 작은 정육면체(②31), 백분율로 줄인 길이(②82), 순서도 읽기(③77): 다른 단원의 일이다.
//  - 경우 따지기·조건 풀이: 정육면체 8개로 만들 수 있는 직육면체 모두(③30), 말의 조건을 이어 상자의 차례 짜기(①10), 곱이 35인 두 수를 짐작하는 색칠한 면(①70의 변형),
//    전개도에서 같은 길이를 찾아 ㉠을 푸는 것(①74 심54), 끈이 지나는 길 세기(심56), 전개도의 둘레가 모서리 몇 개분인지 세기(②87)
//  - 길이 없이 「모서리를 2배로 늘이면 겉넓이는 몇 배」만 묻는 것(①36의 변형): 닮음의 일반 규칙이다. 수를 준 것만 실었다.
//  - 면을 하나하나 따져 더하는 것이 일의 대부분인 겉넓이: 홈을 판 입체·가운데가 뚫린 입체(심59·60), 잘라 낸 입체의 겉넓이에서 부피(②84), 직육면체가 아닌 쌓기나무 입체의 겉넓이(③75의 변형 심64)
//  - 셈이 네 단계 이상이고 큰 수·소수의 셈이 겹치는 것: 넓이·길이 단위 셋이 섞인 부피(심31), 부피가 같은 두 입체의 겉넓이(심53), 겉넓이가 같은 직육면체의 빈 모서리(①73의 변형 ②78의 변형), 단위가 섞인 부피에서 겉넓이(심51의 변형)
//  - 뜻 없는 셈: 두 입체의 부피의 합·겉넓이의 합(①66의 변형 ③24·61의 변형)
//  - 같은 일을 고르기·잇기로 바꾼 것: 같은 부피끼리 잇기(①42 ②42 ③36) — 단위 바꾸기와 같은 문제다.
//  - 5학년 복습(③79), 놀이·활동(③78), 계산기를 쓰는 택배 상자 표(③76), 어림 그림(②19), 칸막이를 뺀 수조(③45 — 수집본에 그림이 없어 얼개를 알 수 없다)
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 수와 단위 기호는 띄어 쓴다(24 cm³, 1.5 m³, 150 cm²).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, tagged, lines, table } = B.kit;
  const K = B.kit.box525;
  const { canvas, stroke, fill, word, wide, tiles, CREAM, YELLOW, sketch, edgeOf, boundsOf, netArt, cutsOf, boxNet, cubeNet, CUBE_NETS, pickWord, say } = K;
  const SURF = '6수03-17', UNIT = '6수03-18', VOL = '6수03-19';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라'], MARKS = ['㉠', '㉡', '㉢', '㉣'];
  const AX = ['가로', '세로', '높이'];
  const calc = (expr, unseen) => ({ calc: [[expr, 0]], unseen: unseen || [] });
  const len = (v, u) => v + ' ' + (u || 'cm');
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const prod = (v) => v[0] * v[1] * v[2];
  const surf = (v) => (v[0] * v[1] + v[1] * v[2] + v[0] * v[2]) * 2;
  // 서로 다른 세 길이. 가장 긴 것이 가장 짧은 것의 ratio 배를 넘지 않는다(겨냥도의 비율이 터무니없지 않게).
  const three = (d, pool, ok, ratio) => d.until(() => [d.pick(pool), d.pick(pool), d.pick(pool)], (v) => new Set(v).size === 3 && Math.max(...v) <= (ratio || 3) * Math.min(...v) && (!ok || ok(v)));
  const said3 = (v, u) => `가로 ${len(v[0], u)}, 세로 ${len(v[1], u)}, 높이 ${len(v[2], u)}`;
  const text3 = (v, u) => `가로가 ${len(v[0], u)}, 세로가 ${len(v[1], u)}, 높이가 ${len(v[2], u)}`;
  const cms = (v, u) => v.map((x) => len(x, u));
  const ALL_ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  // 차례 고르기의 보기: 바른 차례 하나와 틀린 차례 셋
  const orderOptions = (d, values, labels) => {
    const right = [0, 1, 2].sort((x, y) => values[y] - values[x]), orders = d.shuffle([right].concat(d.shuffle(ALL_ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3)));
    return { right, orders, options: orders.map((o) => o.map((i) => labels[i]).join(', ')), answer: orders.findIndex((o) => o.join() === right.join()) };
  };

  // ── 그림: 겨냥도 ─────────────────────────────────────────────
  // 5학년 「직육면체」의 겨냥도에 길이를 적는다. texts: [가로, 세로, 높이]에 적을 글(null 이면 적지 않는다). o 는 sketch 의 것(size, tint, faceText, label …)
  function boxArt(v, texts, o) {
    const opt = o || {}, edges = K.lenEdges(opt.mirror), lens = [];
    (texts || []).forEach((t, i) => { if (t != null) lens.push([edges[i], t]); });
    return sketch(v, Object.assign({ lens }, opt));
  }
  const cubeArt = (s, text, label) => sketch([s, s, s], { size: [100, 92], lens: [[edgeOf('ㅂㅅ'), text]], label });
  // 여러 겨냥도를 같은 배율로 그릴 때의 크기(상자끼리 크기를 눈으로 견줄 수 있다)
  const DEP = [0.5, 0.36];
  function sameScale(list, most) {
    const k = Math.min(...list.map((v) => Math.min(most[0] / (v[0] + v[1] * DEP[0]), most[1] / (v[2] + v[1] * DEP[1]))));
    return list.map((v) => [(v[0] + v[1] * DEP[0]) * k, (v[2] + v[1] * DEP[1]) * k]);
  }

  // ── 그림: 쌓기나무 ───────────────────────────────────────────
  // 낱개 [가로 칸, 세로(안쪽) 칸, 층]의 목록을 비스듬히 본 그림으로 그린다. 뒤쪽·왼쪽·아래쪽 것부터 그려 가려지는 면은 저절로 덮인다.
  // 낱개마다 드러난 면(위·앞·오른쪽)만 테두리째 그리므로 칸마다 선이 또렷하다. o: { most: [너비, 높이] 한도, unit: 한 칸(px), frame: [가로, 세로, 높이](속이 비치는 상자의 테두리), label }
  const f1 = (n) => Math.round(n * 10) / 10;
  const TONE = { top: '#fffdf3', front: '#fff1c7', right: '#f1dc9c' };
  function cubesArt(cubes, o) {
    const opt = o || {}, ext = opt.frame || [0, 1, 2].map((i) => Math.max(...cubes.map((c) => c[i])) + 1), most = opt.most || [118, 104];
    const u = Math.min(opt.unit || 18, most[0] / (ext[0] + ext[1] * DEP[0]), most[1] / (ext[2] + ext[1] * DEP[1]));
    const P = (x, y, z) => [(x + y * DEP[0]) * u, -(z + y * DEP[1]) * u], has = new Set(cubes.map((c) => c.join(','))), on = (x, y, z) => has.has(x + ',' + y + ',' + z);
    const cv = canvas(), quad = (pts, color) => { pts.forEach(cv.point); cv.add('<polygon points="' + pts.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ') + '" style="fill:' + color + ';stroke:#1f2937;stroke-width:1.1;stroke-linejoin:round"/>'); };
    const [a, b, c] = ext, rim = (p, q, kind) => { cv.point(P(...p)); cv.point(P(...q)); cv.add(stroke(P(...p), P(...q), kind, kind ? '' : 'stroke-width:1.4')); };
    // 상자의 보이지 않는 모서리(점선)는 쌓기나무보다 먼저 그린다.
    if (opt.frame) [[[0, b, 0], [a, b, 0]], [[0, b, 0], [0, 0, 0]], [[0, b, 0], [0, b, c]]].forEach(([p, q]) => rim(p, q, 'dash'));
    cubes.slice().sort((p, q) => q[1] - p[1] || p[0] - q[0] || p[2] - q[2]).forEach(([x, y, z]) => {
      if (!on(x, y, z + 1)) quad([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], TONE.top);
      if (!on(x, y - 1, z)) quad([P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)], TONE.front);
      if (!on(x + 1, y, z)) quad([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], TONE.right);
    });
    if (opt.frame) [[[0, 0, 0], [a, 0, 0]], [[a, 0, 0], [a, 0, c]], [[a, 0, c], [0, 0, c]], [[0, 0, c], [0, 0, 0]], [[0, 0, c], [0, b, c]], [[0, b, c], [a, b, c]], [[a, b, c], [a, 0, c]], [[a, 0, 0], [a, b, 0]], [[a, b, 0], [a, b, c]]].forEach(([p, q]) => rim(p, q));
    return cv.out(opt.label || '쌓기나무로 쌓은 모양');
  }
  // 층마다의 높이(heights[세로 줄][가로 칸], 앞줄부터)를 낱개의 목록으로
  const pile = (heights) => { const out = []; heights.forEach((row, y) => row.forEach((h, x) => { for (let z = 0; z < h; z += 1) out.push([x, y, z]); })); return out; };
  const brick = (v) => pile(Array.from({ length: v[1] }, () => Array.from({ length: v[0] }, () => v[2])));
  const blockSaid = (v) => `쌓기나무를 가로 ${v[0]}개, 세로 ${v[1]}개, 높이 ${v[2]}층으로 빈틈없이 쌓은 직육면체`;
  const blockArt = (v, most) => cubesArt(brick(v), { most: most || [118, 104], label: blockSaid(v) });
  // 속이 비치는 상자의 가로·세로·높이에 쌓기나무를 한 줄씩 놓은 그림(세 줄은 앞쪽 오른쪽 아래 귀퉁이에서 만난다 — 세 줄이 모두 보인다)
  function crateArt(v, most) {
    const [a, b, c] = v, cubes = range(0, a - 1).map((x) => [x, 0, 0]).concat(range(1, b - 1).map((y) => [a - 1, y, 0]), range(1, c - 1).map((z) => [a - 1, 0, z]));
    return cubesArt(cubes, { frame: v, most: most || [124, 108], label: `속이 비치는 직육면체 모양 상자에 쌓기나무를 가로로 ${a}개, 세로로 ${b}개, 높이로 ${c}개 한 줄씩 놓은 그림` });
  }
  // 층마다 수가 다른 덩어리의 높이(앞줄부터). 뒤쪽·왼쪽으로 갈수록 낮아지지 않게 쌓아 줄마다 맨 위 쌓기나무가 보인다.
  function stairs(d, a, b, top) {
    const rows = []; let behind = Array.from({ length: a }, () => top);
    for (let y = b - 1; y >= 0; y -= 1) { let cap = top; const row = behind.map((hb) => { const h = d.int(y === b - 1 ? 1 : 0, Math.min(cap, hb)); cap = h; return h; }); rows[y] = row; behind = row; }
    return rows;
  }
  // 보이는 면(위·앞·오른쪽)이 하나도 없는 쌓기나무의 수
  const buried = (cubes) => { const has = new Set(cubes.map((c) => c.join(','))), on = (x, y, z) => has.has(x + ',' + y + ',' + z); return cubes.filter(([x, y, z]) => on(x, y, z + 1) && on(x, y - 1, z) && on(x + 1, y, z)).length; };
  // 층마다의 수: [1층, 2층, …]
  const layersOf = (cubes) => { const out = []; cubes.forEach((c) => { out[c[2]] = (out[c[2]] || 0) + 1; }); return out; };
  const layerSaid = (cubes) => layersOf(cubes).map((k, i) => `${i + 1}층에 ${k}개`).join(', ');

  // ── 그림: 손으로 짠 입체(계단 모양, 수조, 뚜껑 없는 상자, 자른 자리) ──
  // 겨냥도와 같은 방법으로 비스듬히 본다. ext: [가로, 세로, 높이], size: [너비, 높이] 한도(px)
  function stage(ext, size) {
    const k = Math.min(size[0] / (ext[0] + ext[1] * DEP[0]), size[1] / (ext[2] + ext[1] * DEP[1])), cv = canvas();
    const P = (p) => [(p[0] + p[1] * DEP[0]) * k, -(p[2] + p[1] * DEP[1]) * k];
    const put = (c, text) => { cv.add(word(c, text, 'is-length')); cv.box(c, wide(text, 12) / 2 + 1, 8); };
    return {
      k, P, cv, put,
      face: (pts, color) => { const q = pts.map(P); q.forEach(cv.point); cv.add(fill(q, color)); },
      edge: (a, b, kind, css) => { cv.point(P(a)); cv.point(P(b)); cv.add(stroke(P(a), P(b), kind, css)); },
      // 선분 a–b 위의 t 자리에서 dir([옆, 아래] 쪽, -1·0·1)로 비켜난 곳에 길이 글을 적는다.
      note: (a, b, dir, text, t) => { const p = P(a), q = P(b), s = t == null ? 0.5 : t, hw = wide(text, 12) / 2 + 1; put([p[0] + (q[0] - p[0]) * s + dir[0] * (hw + 5), p[1] + (q[1] - p[1]) * s + dir[1] * 12], text); },
      out: (label) => cv.out(label)
    };
  }
  const drawBox = (s, v, color) => {
    const [a, b, c] = v;
    [[[0, 0, 0], [a, 0, 0], [a, 0, c], [0, 0, c]], [[0, 0, c], [a, 0, c], [a, b, c], [0, b, c]], [[a, 0, 0], [a, b, 0], [a, b, c], [a, 0, c]]].forEach((f) => s.face(f, color || CREAM));
    [[[0, b, 0], [a, b, 0]], [[0, b, 0], [0, 0, 0]], [[0, b, 0], [0, b, c]]].forEach(([p, q]) => s.edge(p, q, 'dash'));
    [[[0, 0, 0], [a, 0, 0]], [[a, 0, 0], [a, 0, c]], [[a, 0, c], [0, 0, c]], [[0, 0, c], [0, 0, 0]], [[0, 0, c], [0, b, c]], [[0, b, c], [a, b, c]], [[a, b, c], [a, 0, c]], [[a, 0, 0], [a, b, 0]], [[a, b, 0], [a, b, c]]].forEach(([p, q]) => s.edge(p, q));
  };
  // 계단 모양 입체: 왼쪽 직육면체(가로 w1, 높이 H)와 오른쪽 직육면체(가로 w2, 높이 h, h < H)가 세로 D 로 나란히 붙은 모양(큰 직육면체의 오른쪽 위를 잘라 낸 모양이기도 하다).
  // notes: 적을 글만 준다 — w1·w2(아래쪽 치수선의 두 칸), W(아래 모서리 전체), H(왼쪽 높이), h(오른쪽 높이), D(세로), cutW·cutH(잘라 낸 자리의 가로와 높이)
  function stepsArt(w1, w2, D, H, h, notes, label) {
    const W = w1 + w2, s = stage([W, D, H], [176, 124]), t = notes || {};
    [[[0, 0, 0], [W, 0, 0], [W, 0, h], [w1, 0, h], [w1, 0, H], [0, 0, H]], [[0, 0, H], [w1, 0, H], [w1, D, H], [0, D, H]], [[w1, 0, h], [W, 0, h], [W, D, h], [w1, D, h]], [[w1, 0, h], [w1, D, h], [w1, D, H], [w1, 0, H]], [[W, 0, 0], [W, D, 0], [W, D, h], [W, 0, h]]].forEach((f) => s.face(f, CREAM));
    [[[0, D, 0], [W, D, 0]], [[0, 0, 0], [0, D, 0]], [[0, D, 0], [0, D, H]]].forEach(([p, q]) => s.edge(p, q, 'dash'));
    [[[0, 0, 0], [W, 0, 0]], [[W, 0, 0], [W, 0, h]], [[W, 0, h], [w1, 0, h]], [[w1, 0, h], [w1, 0, H]], [[w1, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]],
      [[0, 0, H], [0, D, H]], [[0, D, H], [w1, D, H]], [[w1, D, H], [w1, 0, H]], [[w1, D, H], [w1, D, h]], [[w1, 0, h], [w1, D, h]], [[w1, D, h], [W, D, h]], [[W, D, h], [W, 0, h]], [[W, 0, 0], [W, D, 0]], [[W, D, 0], [W, D, h]]].forEach(([p, q]) => s.edge(p, q));
    if (t.w1 || t.w2) {
      // 아래쪽 치수선: 두 직육면체의 가로를 따로 적는다.
      const y = 9, x = (v) => s.P([v, 0, 0])[0];
      s.cv.add(stroke([x(0), y], [x(W), y], 'thin') + [0, w1, W].map((v) => stroke([x(v), y - 4], [x(v), y + 4], 'thin')).join(''));
      s.put([(x(0) + x(w1)) / 2, y + 11], t.w1); s.put([(x(w1) + x(W)) / 2, y + 11], t.w2);
    }
    if (t.W) s.note([0, 0, 0], [W, 0, 0], [0, 1], t.W);
    if (t.H) s.note([0, 0, 0], [0, 0, H], [-1, 0], t.H);
    if (t.h) s.note([W, D, 0], [W, D, h], [1, 0], t.h);
    if (t.D) s.note([W, 0, 0], [W, D, 0], [1, 0.4], t.D, 0.4);
    if (t.cutW) s.note([w1, D, h], [W, D, h], [0, -1], t.cutW, 0.56);
    if (t.cutH) s.note([w1, D, h], [w1, D, H], [1, 0], t.cutH, 0.75);
    return s.out(label);
  }
  // 물이 든 직육면체 모양 수조: v = [가로, 세로, 높이], level = 물의 높이. notes: { a, b, level }
  function tankArt(v, level, notes, label) {
    const [a, b, c] = v, s = stage(v, [150, 104]), t = notes || {}, WATER = 'rgba(96,165,250,0.4)', TOP = 'rgba(147,197,253,0.55)';
    [[[0, 0, 0], [a, 0, 0], [a, 0, level], [0, 0, level]], [[a, 0, 0], [a, b, 0], [a, b, level], [a, 0, level]]].forEach((f) => s.face(f, WATER));
    s.face([[0, 0, level], [a, 0, level], [a, b, level], [0, b, level]], TOP);
    [[[0, b, 0], [a, b, 0]], [[0, b, 0], [0, 0, 0]], [[0, b, 0], [0, b, c]], [[0, b, level], [a, b, level]], [[0, b, level], [0, 0, level]]].forEach(([p, q]) => s.edge(p, q, 'dash'));
    [[[0, 0, level], [a, 0, level]], [[a, 0, level], [a, b, level]]].forEach(([p, q]) => s.edge(p, q, 'thin', 'stroke:#2563eb'));
    [[[0, 0, 0], [a, 0, 0]], [[a, 0, 0], [a, 0, c]], [[a, 0, c], [0, 0, c]], [[0, 0, c], [0, 0, 0]], [[0, 0, c], [0, b, c]], [[0, b, c], [a, b, c]], [[a, b, c], [a, 0, c]], [[a, 0, 0], [a, b, 0]], [[a, b, 0], [a, b, c]]].forEach(([p, q]) => s.edge(p, q));
    if (t.a) s.note([0, 0, 0], [a, 0, 0], [0, 1], t.a);
    if (t.b) s.note([a, 0, 0], [a, b, 0], [1, 0.4], t.b, 0.4);
    if (t.level) s.note([0, 0, 0], [0, 0, level], [-1, 0], t.level);
    return s.out(label);
  }
  // 뚜껑이 없는 상자: 위쪽이 뚫려 안쪽 벽이 보인다.
  function openArt(v, texts, label) {
    const [a, b, c] = v, s = stage(v, [150, 104]), dip = c - b * DEP[1];
    [[[0, 0, 0], [a, 0, 0], [a, 0, c], [0, 0, c]], [[a, 0, 0], [a, b, 0], [a, b, c], [a, 0, c]]].forEach((f) => s.face(f, CREAM));
    s.face([[0, b, c], [a, b, c], [a, 0, c], [0, b, dip]], '#eadfb8');
    s.face([[0, 0, c], [0, b, c], [0, b, dip]], '#d9c98f');
    s.edge([0, b, c], [0, b, dip], 'thin');
    [[[0, 0, 0], [a, 0, 0]], [[a, 0, 0], [a, 0, c]], [[a, 0, c], [0, 0, c]], [[0, 0, c], [0, 0, 0]], [[0, 0, c], [0, b, c]], [[0, b, c], [a, b, c]], [[a, b, c], [a, 0, c]], [[a, 0, 0], [a, b, 0]], [[a, b, 0], [a, b, c]]].forEach(([p, q]) => s.edge(p, q));
    s.note([0, 0, 0], [a, 0, 0], [0, 1], texts[0]); s.note([a, 0, 0], [a, b, 0], [1, 0.4], texts[1], 0.4); s.note([a, b, 0], [a, b, c], [1, 0], texts[2]);
    return s.out(label);
  }
  // 자를 자리를 붉은 점선으로 그은 직육면체. axis: 자른 면과 수직인 방향(0 가로, 1 세로, 2 높이를 똑같이 나눈다), pieces: 조각 수(자르는 자리는 pieces − 1 곳)
  function cutArt(v, axis, pieces, label) {
    const [a, b, c] = v, s = stage(v, [150, 104]), RED = 'stroke:#dc2626;stroke-width:2;stroke-dasharray:5 3';
    drawBox(s, v);
    for (let i = 1; i < pieces; i += 1) {
      const x = (a * i) / pieces, y = (b * i) / pieces, z = (c * i) / pieces;
      [[[[x, 0, 0], [x, 0, c]], [[x, 0, c], [x, b, c]]], [[[0, y, c], [a, y, c]], [[a, y, c], [a, y, 0]]], [[[0, 0, z], [a, 0, z]], [[a, 0, z], [a, b, z]]]][axis].forEach(([p, q]) => s.edge(p, q, '', RED));
    }
    s.note([0, 0, 0], [a, 0, 0], [0, 1], len(a)); s.note([a, 0, 0], [a, b, 0], [1, 0.4], len(b), 0.4); s.note([a, b, 0], [a, b, c], [1, 0], len(c));
    return s.out(label);
  }

  // ── 그림: 전개도 ─────────────────────────────────────────────
  const lenOf = (cut) => Math.abs(cut.at[0][0] - cut.at[1][0]) + Math.abs(cut.at[0][1] - cut.at[1][1]);
  // 한 줄로 이어진 네 면(옆면)과 그 방향. 없으면 null.
  function stripOf(rects) {
    for (const r of rects) for (const along of [0, 1]) {
      const run = [r]; let cur = r;
      for (;;) { const nxt = rects.find((q) => (along === 0 ? q.x === cur.x + cur.w && q.y === cur.y && q.h === cur.h : q.y === cur.y + cur.h && q.x === cur.x && q.w === cur.w)); if (!nxt) break; run.push(nxt); cur = nxt; }
      if (run.length === 4) return { run, along, cross: along === 0 ? r.h : r.w, sides: run.map((q) => (along === 0 ? q.w : q.h)) };
    }
    return null;
  }
  // 직육면체의 전개도(옆면 넷이 한 줄)에 서로 다른 세 모서리의 길이를 하나씩 적는다. textOf(길이, 옆면 줄): 적을 글. 길이 글이 제 선분에서 멀리 밀려난 그림은 다시 뽑는다.
  // o: { tintStrip: 옆면 넷을 색칠, label(strip): 그림 설명 }
  function netWith(d, dims, textOf, o) {
    const opt = o || {};
    return d.until(() => {
      const net = boxNet(d, dims, { strip: true, cols: 60, rows: 44 }), cuts = cutsOf(net), box = boundsOf(net.rects), strip = stripOf(net.rects);
      const given = dims.map((L) => d.pick(cuts.filter((c) => lenOf(c) === L))), tint = {};
      if (opt.tintStrip) strip.run.forEach((r) => { tint[net.rects.indexOf(r)] = YELLOW; });
      const figure = netArt(net.rects, { unit: Math.min(236 / box.w, 190 / box.h), lens: given.map((g, i) => ({ a: g.at[0], b: g.at[1], text: textOf(dims[i], strip) })), tint, label: opt.label(strip) });
      return K.netTidy() ? { net, strip, figure } : null;
    }, Boolean);
  }
  // 정육면체의 전개도에 한 모서리의 길이를 적는다.
  function cubeNetWith(d, text, label) {
    return d.until(() => {
      const net = cubeNet(d), cut = d.pick(cutsOf(net)), figure = netArt(net.rects, { unit: 30, lens: [{ a: cut.at[0], b: cut.at[1], text }], label });
      return K.netTidy() ? figure : null;
    }, Boolean);
  }
  // 정육면체의 전개도 가운데 맨 윗줄에 정사각형이 꼭 n 개 나란히 놓인 모양
  const topRun = (n) => CUBE_NETS.filter((s) => { const xs = s.cells.filter((c) => c[1] === 0).map((c) => c[0]).sort((x, y) => x - y); return xs.length === n && xs[n - 1] - xs[0] === n - 1; });
  const TOP_RUN = { 2: topRun(2), 3: topRun(3) };
  // 맨 윗줄 정사각형 n 개가 이어진 선분의 길이(text)를 치수선으로 적은 정육면체의 전개도
  function spanNet(d, n, text, label) {
    const cells = d.pick(TOP_RUN[n]).cells, u = 30, cv = canvas(), has = (x, y) => cells.some((c) => c[0] === x && c[1] === y), at = (x, y) => [x * u, y * u];
    cells.forEach(([x, y]) => { const q = [at(x, y), at(x, y + 1), at(x + 1, y + 1), at(x + 1, y)]; q.forEach(cv.point); cv.add(fill(q, CREAM)); });
    cells.forEach(([x, y]) => { if (has(x + 1, y)) cv.add(stroke(at(x + 1, y), at(x + 1, y + 1), 'dash')); if (has(x, y + 1)) cv.add(stroke(at(x, y + 1), at(x + 1, y + 1), 'dash')); });
    cells.forEach(([x, y]) => {
      if (!has(x, y - 1)) cv.add(stroke(at(x, y), at(x + 1, y))); if (!has(x, y + 1)) cv.add(stroke(at(x, y + 1), at(x + 1, y + 1)));
      if (!has(x - 1, y)) cv.add(stroke(at(x, y), at(x, y + 1))); if (!has(x + 1, y)) cv.add(stroke(at(x + 1, y), at(x + 1, y + 1)));
    });
    const xs = cells.filter((c) => c[1] === 0).map((c) => c[0]), x0 = Math.min(...xs) * u, x1 = (Math.max(...xs) + 1) * u, y = -10;
    cv.add(stroke([x0, y], [x1, y], 'thin') + stroke([x0, y - 4], [x0, y + 4], 'thin') + stroke([x1, y - 4], [x1, y + 4], 'thin') + word([(x0 + x1) / 2, y - 11], text, 'is-length'));
    cv.box([(x0 + x1) / 2, y - 11], wide(text, 12) / 2 + 1, 8);
    return cv.out(label, 5);
  }
  // 직사각형 모양 종이: 가로 w, 세로 h(cm)를 k 배(px)로 그리고 두 변의 길이를 적는다.
  function sheet(w, h, k) {
    const cv = canvas(), W = w * k, H = h * k, hw = wide(len(h), 12) / 2 + 1;
    cv.point([0, 0]); cv.point([W, H]);
    cv.add('<rect class="mb-poly" x="0" y="0" width="' + f1(W) + '" height="' + f1(H) + '"/>' + word([W / 2, H + 12], len(w), 'is-length') + word([W + 6 + hw, H / 2], len(h), 'is-length'));
    cv.box([W / 2, H + 12], wide(len(w), 12) / 2, 8); cv.box([W + 6 + hw, H / 2], hw, 8);
    return cv.out(`가로 ${w} cm, 세로 ${h} cm인 ${w === h ? '정사각형' : '직사각형'} 모양 종이`);
  }

  // 6-1-6b.js, 6-1-6c.js 가 같은 도구를 쓴다(이 파일이 먼저 불린다).
  B.kit.vol616 = { TAGS, MARKS, AX, calc, len, range, prod, surf, three, said3, text3, cms, orderOptions, boxArt, cubeArt, sameScale, cubesArt, pile, brick, blockSaid, blockArt, crateArt, stairs, buried, layersOf, layerSaid,
    stage, drawBox, stepsArt, tankArt, openArt, cutArt, lenOf, stripOf, netWith, cubeNetWith, spanNet, sheet };

  B.addUnit({
    id: '6-1-6', grade: 6, semester: 1, no: 6, title: '직육면체의 부피와 겉넓이', version: 1,
    groups: [
      { id: 'compare', title: '부피 비교하기', standard: UNIT, types: [] },
      { id: 'cm3', title: '1 cm³와 쌓기나무', standard: UNIT, types: [] },
      { id: 'volume', title: '직육면체와 정육면체의 부피', standard: VOL, types: [] },
      { id: 'back', title: '부피로 모서리 구하기', standard: VOL, types: [] },
      { id: 'm3', title: '1 m³와 단위 바꾸기', standard: UNIT, types: [] },
      { id: 'surface', title: '직육면체와 정육면체의 겉넓이', standard: SURF, types: [] },
      { id: 'sback', title: '겉넓이로 모서리 구하기', standard: SURF, types: [] }
    ]
  });

  // ── 부피 비교하기 ────────────────────────────────────────────
  const LONG = ['긴', '긴', '높은'];
  const sameTwo = (ax) => AX.filter((_, i) => i !== ax).join('와 ');
  const counted = (v) => `${v[0]} × ${v[1]} × ${v[2]} = ${prod(v)}(개)`;
  // 쌓기나무 직육면체의 세 수(그림 칸에 들어가는 크기)
  const blockDims = (d, ok) => d.until(() => [d.int(2, 4), d.int(2, 3), d.int(1, 4)], (v) => prod(v) >= 6 && (!ok || ok(v)));
  // 모양은 다르지만 쌓기나무의 수가 같은 두 직육면체
  const SAME_COUNT = [[[3, 2, 2], [2, 2, 3]], [[4, 3, 1], [2, 3, 2]], [[2, 2, 4], [4, 2, 2]], [[3, 3, 2], [2, 3, 3]], [[4, 2, 3], [3, 2, 4]], [[4, 3, 2], [2, 3, 4]], [[3, 2, 4], [4, 3, 2]], [[4, 2, 1], [2, 2, 2]], [[3, 2, 3], [3, 3, 2]]];
  B.addTypes('6-1-6', 'compare', [
    T('cmp-direct', '맞대어 부피 비교하기', '①1·2 ②2 ③1 심1', (d, n) => {
      if (n === 1) {
        // 세 직육면체: 기준 상자, 한 모서리만 늘인 것, 다른 한 모서리만 줄인 것. 둘씩 맞대면 차례가 정해진다.
        const base = three(d, range(4, 8), null, 2), [up, down] = d.shuffle([0, 1, 2]).slice(0, 2);
        const big = base.map((v, i) => (i === up ? v + d.int(1, 2) : v)), small = base.map((v, i) => (i === down ? v - d.int(1, 2) : v));
        const boxes = d.shuffle([big, base, small]), made = orderOptions(d, boxes.map(prod), TAGS), [x, y, z] = made.right.map((i) => TAGS[i]);
        return C('세 직육면체를 둘씩 맞대어 부피를 비교하려고 한다. 부피가 큰 것부터 차례대로 쓴 것은?', made.options, made.answer, {
          figure: tiles(boxes.map((v) => boxArt(v, cms(v), { size: [100, 78], label: `직육면체의 겨냥도. ${said3(v)}` }))),
          explain: `${x}와 ${y}는 ${sameTwo(up)}가 같고 ${AX[up]}만 다르다. ${AX[up]}가 더 ${LONG[up]} ${x}의 부피가 더 크다. ${y}와 ${z}는 ${sameTwo(down)}가 같고 ${AX[down]}만 다르다. ${AX[down]}가 더 ${LONG[down]} ${y}의 부피가 더 크다. 부피가 큰 것부터 쓰면 ${x}, ${y}, ${z}이다.`,
          facts: { choose: { exprs: boxes.map((v) => v.join('*')), rule: 'descending', orders: made.orders } }
        });
      }
      const base = three(d, range(3, 8), null, 2.4), ax = d.int(0, 2), other = d.until(() => base[ax] + d.pick([-3, -2, -1, 1, 2, 3]), (v) => v >= 2 && v <= 10);
      const boxes = d.shuffle([base, base.map((v, i) => (i === ax ? other : v))]), big = d.bool(), vols = boxes.map(prod), at = vols.indexOf(big ? Math.max(...vols) : Math.min(...vols)), more = vols.indexOf(Math.max(...vols));
      return C(`두 직육면체를 맞대어 부피를 비교하려고 한다. 부피가 더 ${big ? '큰' : '작은'} 것은?`, ['가', '나'], at, {
        figure: tiles(boxes.map((v) => boxArt(v, cms(v), { size: [112, 84], label: `직육면체의 겨냥도. ${said3(v)}` }))),
        explain: `두 직육면체는 ${sameTwo(ax)}가 같으므로 그 두 모서리로 이루어진 면끼리 맞대면 꼭 맞는다. 남은 ${AX[ax]}가 더 ${LONG[ax]} ${TAGS[more]}의 부피가 더 크고, ${TAGS[1 - more]}의 부피가 더 작다.`,
        facts: { choose: { exprs: boxes.map((v) => v.join('*')), rule: big ? 'max' : 'min' } }
      });
    }, { count: 2 }),
    T('cmp-can-direct', '맞대어 비교할 수 있는 두 상자 찾기', '②1 ③2 심2', (d) => {
      // 두 상자는 두 모서리의 길이가 같고(적힌 차례는 다르다), 나머지 한 상자는 어느 상자와도 한 모서리만 같다.
      const [p, q, r, s, t] = d.shuffle(range(3, 12)).slice(0, 5), rows = d.shuffle([d.shuffle([p, q, r]), d.shuffle([p, q, s]), d.shuffle([r, s, t])]);
      const pairs = [[0, 1], [0, 2], [1, 2]], ok = pairs.map(([i, j]) => rows[i].filter((v) => rows[j].includes(v)).length >= 2), at = ok.indexOf(true), [i, j] = pairs[at];
      const both = rows[i].filter((v) => rows[j].includes(v)), rest = (k) => rows[k].find((v) => !both.includes(v));
      return C('직육면체 모양 상자 가, 나, 다의 세 모서리의 길이가 다음과 같다. 직접 맞대어 부피를 비교할 수 있는 두 상자는?', pairs.map(([x, y]) => `${TAGS[x]}와 ${TAGS[y]}`), at, {
        figure: tagged(rows.map((row) => row.map((x) => len(x)).join(', ')), TAGS),
        explain: `모양과 크기가 같은 면이 있는 두 상자는 그 면끼리 맞대어 나머지 한 모서리의 길이로 부피를 비교할 수 있다. ${TAGS[i]}와 ${TAGS[j]}에는 두 변의 길이가 ${both[0]} cm, ${both[1]} cm인 면이 있고, 나머지 모서리의 길이는 ${TAGS[i]}가 ${rest(i)} cm, ${TAGS[j]}가 ${rest(j)} cm이다.`,
        facts: { truth: ok, want: true }
      });
    }),
    T('cmp-say', '부피를 비교하는 방법에 대한 설명', '①3·9 ②4 ③4 심4', (d) => say(d, '부피를 비교하는 방법에 대한 설명으로 옳은 것은?',
      ['밑면의 넓이가 같은 두 직육면체는 높이가 더 높은 쪽의 부피가 더 크다.', '크기가 같은 쌓기나무로 만든 두 직육면체는 쌓기나무의 수가 더 많은 쪽의 부피가 더 크다.', '크기가 같은 쌓기나무를 같은 수만큼 쌓아 만든 두 직육면체는 모양이 달라도 부피가 같다.'],
      [['두 상자를 맞대어 보면 한쪽이 다른 쪽보다 얼마나 더 큰지도 정확하게 알 수 있다.', '맞대어 보면 어느 쪽이 더 큰지는 알 수 있지만 얼마나 더 큰지는 정확하게 알 수 없다.'], ['담은 물건의 크기가 서로 달라도 물건을 더 많이 담은 상자의 부피가 더 크다.', '담은 물건의 크기가 다르면 물건의 수로 부피를 비교할 수 없다.'],
        ['가로가 더 긴 직육면체의 부피가 언제나 더 크다.', '가로가 길어도 세로나 높이가 짧으면 부피가 더 작을 수 있다.'], ['높이가 같은 두 직육면체는 부피도 언제나 같다.', '높이가 같아도 밑면의 넓이가 다르면 부피가 다르다.']], true,
      '부피는 모양과 크기가 같은 물건이 몇 개 들어가는지로 비교할 수 있다.')),
    T('cmp-blocks', '쌓기나무의 수로 두 직육면체의 부피 비교하기', '①4 ②7 ③5 심3', (d, n) => {
      if (n === 1) {
        // 모양이 달라도 수가 같으면 부피가 같다. 수가 다른 짝은 키가 큰 쪽이 더 적게 쌓인 것으로 고른다.
        const pair = d.shuffle(d.bool() ? d.pick(SAME_COUNT) : d.until(() => [blockDims(d), blockDims(d)], ([v, w]) => prod(v) !== prod(w) && Math.abs(prod(v) - prod(w)) <= 6 && (v[2] > w[2]) === (prod(v) < prod(w)) && v[2] !== w[2]));
        const [x, y] = pair.map(prod), sign = x > y ? '&gt;' : x === y ? '=' : '&lt;';
        return C('크기가 같은 쌓기나무로 직육면체 가와 나를 만들었다. 두 직육면체의 부피를 비교하여 ○ 안에 알맞은 것을 고르시오.', ['&gt;', '=', '&lt;'], x > y ? 0 : x === y ? 1 : 2, {
          figure: tiles(pair.map((v) => blockArt(v))) + lines(['가의 부피 ○ 나의 부피']),
          explain: `쌓기나무의 수를 세면 가는 ${counted(pair[0])}, 나는 ${counted(pair[1])}이다. ${x === y ? '모양이 달라도 쌓기나무의 수가 같으면 부피가 같다. ' : ''}가의 부피 ${sign} 나의 부피`,
          facts: { choose: { exprs: pair.map((v) => v.join('*')), rule: 'compare' } }
        });
      }
      const pair = d.until(() => [blockDims(d), blockDims(d)], ([v, w]) => prod(v) !== prod(w) && Math.abs(prod(v) - prod(w)) <= 8), vols = pair.map(prod), at = vols.indexOf(Math.max(...vols));
      return C('크기가 같은 쌓기나무로 만든 두 직육면체 가운데 부피가 더 큰 것은?', ['가', '나'], at, {
        figure: tiles(pair.map((v) => blockArt(v))), explain: `쌓기나무의 수를 세면 가는 ${counted(pair[0])}, 나는 ${counted(pair[1])}이다. 쌓기나무가 더 많은 ${TAGS[at]}의 부피가 더 크다.`,
        facts: { choose: { exprs: pair.map((v) => v.join('*')), rule: 'max' } }
      });
    }, { count: 2 }),
    T('cmp-blocks-three', '쌓기나무로 만든 세 직육면체의 부피 비교하기', '①5 ②8 심3', (d, n) => {
      const small = [96, 92];
      if (n === 1) {
        const twin = d.pick(SAME_COUNT), lone = blockDims(d, (v) => prod(v) !== prod(twin[0]) && Math.abs(prod(v) - prod(twin[0])) <= 6), boxes = d.shuffle([twin[0], twin[1], lone]), at = boxes.indexOf(lone);
        return C('크기가 같은 쌓기나무로 만든 세 직육면체 가운데 부피가 나머지 둘과 다른 것은?', TAGS.slice(0, 3), at, {
          figure: tiles(boxes.map((v) => blockArt(v, small))), explain: `쌓기나무의 수를 세면 ${boxes.map((v, i) => `${TAGS[i]}는 ${counted(v)}`).join(', ')}이다. ${TAGS[at]}만 쌓기나무의 수가 다르다.`,
          facts: { choose: { exprs: boxes.map((v) => v.join('*')), rule: 'odd' } }
        });
      }
      const boxes = d.until(() => [blockDims(d), blockDims(d), blockDims(d)], (list) => new Set(list.map(prod)).size === 3 && Math.max(...list.map(prod)) - Math.min(...list.map(prod)) <= 12), made = orderOptions(d, boxes.map(prod), TAGS);
      return C('크기가 같은 쌓기나무로 만든 세 직육면체를 부피가 큰 것부터 차례대로 쓴 것은?', made.options, made.answer, {
        figure: tiles(boxes.map((v) => blockArt(v, small))), explain: `쌓기나무의 수를 세면 ${boxes.map((v, i) => `${TAGS[i]}는 ${counted(v)}`).join(', ')}이다. 쌓기나무가 많은 것부터 쓰면 ${made.right.map((i) => TAGS[i]).join(', ')}이다.`,
        facts: { choose: { exprs: boxes.map((v) => v.join('*')), rule: 'descending', orders: made.orders } }
      });
    }, { count: 2 }),
    T('cmp-blocks-pair', '부피가 같은 두 직육면체 찾기', '①6 ②8', (d) => {
      // 같은 부피끼리 잇기를 「부피가 같은 두 개 고르기」로 바꾸었다. 수가 같은 것은 꼭 한 쌍이다.
      const twin = d.pick(SAME_COUNT), others = d.until(() => [blockDims(d), blockDims(d)], (list) => new Set(list.map(prod).concat([prod(twin[0])])).size === 3 && list.every((v) => Math.abs(prod(v) - prod(twin[0])) <= 8));
      const boxes = d.shuffle(twin.concat(others)), right = [boxes.indexOf(twin[0]), boxes.indexOf(twin[1])].sort((x, y) => x - y), all = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
      const shown = d.shuffle([right].concat(d.shuffle(all.filter((p) => p.join() !== right.join())).slice(0, 3)));
      return C('크기가 같은 쌓기나무로 만든 직육면체 가운데 부피가 같은 두 개는?', shown.map((p) => p.map((i) => TAGS[i]).join(', ')), shown.findIndex((p) => p.join() === right.join()), {
        figure: tiles(boxes.map((v) => blockArt(v, [96, 92]))), explain: `쌓기나무의 수를 세면 ${boxes.map((v, i) => `${TAGS[i]}는 ${counted(v)}`).join(', ')}이다. 모양이 달라도 쌓기나무의 수가 같은 ${right.map((i) => TAGS[i]).join('와 ')}의 부피가 같다.`,
        facts: { choose: { exprs: boxes.map((v) => v.join('*')), rule: 'same', pairsShown: shown } }
      });
    }),
    T('cmp-crate', '상자에 담을 수 있는 쌓기나무의 수', '①7 ②6 ③3', (d, n) => {
      const crate = (ok) => d.until(() => [d.int(3, 5), d.int(2, 4), d.int(2, 4)], (v) => !ok || ok(v));
      if (n === 1) {
        const pair = d.until(() => [crate(), crate()], ([v, w]) => prod(v) !== prod(w) && Math.abs(prod(v) - prod(w)) <= 10), vols = pair.map(prod), at = vols.indexOf(Math.max(...vols));
        return C('직육면체 모양 상자 가와 나에 크기가 같은 쌓기나무를 가로, 세로, 높이로 한 줄씩 놓았다. 쌓기나무를 빈틈없이 가득 채울 때 부피가 더 큰 상자는?', ['가', '나'], at, {
          figure: tiles(pair.map((v) => crateArt(v, [112, 100]))), explain: `가득 채우는 데 필요한 쌓기나무는 가가 ${counted(pair[0])}, 나가 ${counted(pair[1])}이다. 쌓기나무가 더 많이 들어가는 ${TAGS[at]}의 부피가 더 크다.`,
          facts: { choose: { exprs: pair.map((v) => v.join('*')), rule: 'max' } }
        });
      }
      const v = crate();
      return N('직육면체 모양 상자에 크기가 같은 쌓기나무를 가로, 세로, 높이로 한 줄씩 놓았다. 이 상자에 쌓기나무를 빈틈없이 가득 채우려면 쌓기나무는 모두 몇 개 필요한가?', prod(v), {
        unit: '개', figure: crateArt(v), explain: `한 층에 가로로 ${v[0]}개씩 ${v[1]}줄 놓이고, 이런 층이 ${v[2]}층 쌓인다. ${counted(v)}`, facts: calc(v.join('*'))
      });
    }, { count: 2 }),
    T('cmp-words', '말로 적은 쌓기나무 직육면체의 부피 비교하기', '②9 심3', (d) => {
      const made = d.until(() => ({ v: [d.int(3, 6), d.int(3, 6), d.int(2, 5)], floor: d.pick([12, 15, 16, 18, 20, 24, 25]), high: d.int(2, 6) }), (m) => m.v[0] !== m.v[1] && prod(m.v) !== m.floor * m.high && Math.abs(prod(m.v) - m.floor * m.high) <= 12 && m.v[0] * m.v[1] !== m.floor);
      const { v, floor, high } = made, rows = d.shuffle([[`쌓기나무를 가로로 ${v[0]}개, 세로로 ${v[1]}개씩 놓아 ${v[2]}층으로 쌓은 직육면체`, v.join('*'), prod(v)], [`쌓기나무를 한 층에 ${floor}개씩 ${high}층으로 쌓은 직육면체`, `${floor}*${high}`, floor * high]]);
      const big = d.bool(), values = rows.map((r) => r[2]), at = values.indexOf(big ? Math.max(...values) : Math.min(...values));
      return C(`크기가 같은 쌓기나무로 만든 두 직육면체 가운데 부피가 더 ${big ? '큰' : '작은'} 것은?`, MARKS.slice(0, 2), at, {
        figure: tagged(rows.map((r) => r[0]), MARKS), explain: `쌓기나무의 수를 구하면 ${rows.map((r, i) => `${MARKS[i]}은 ${r[1].split('*').join(' × ')} = ${r[2]}(개)`).join(', ')}이다. 쌓기나무가 더 ${big ? '많은' : '적은'} ${MARKS[at]}의 부피가 더 ${big ? '크다' : '작다'}.`,
        facts: { choose: { exprs: rows.map((r) => r[1]), rule: big ? 'max' : 'min' } }
      });
    }),
    T('cmp-table', '표로 나타낸 세 상자의 부피 비교하기', '①7 ②5', (d) => {
      const boxes = d.until(() => [0, 1, 2].map(() => [d.int(3, 8), d.int(3, 8), d.int(3, 8)]), (list) => new Set(list.map(prod)).size === 3 && Math.max(...list.map(prod)) - Math.min(...list.map(prod)) <= 30 && list.every((v) => new Set(v).size >= 2));
      const vols = boxes.map(prod), at = vols.indexOf(Math.max(...vols));
      return C('크기가 같은 쌓기나무를 세 상자에 빈틈없이 가득 채웠더니 가로, 세로, 높이에 놓인 쌓기나무의 수가 다음과 같았다. 부피가 가장 큰 상자는?', TAGS.slice(0, 3), at, {
        figure: table(['상자', '가로', '세로', '높이'], boxes.map((v, i) => [TAGS[i]].concat(v.map((x) => x + '개')))),
        explain: `상자에 들어간 쌓기나무의 수는 ${boxes.map((v, i) => `${TAGS[i]}가 ${counted(v)}`).join(', ')}이다. 쌓기나무가 가장 많이 들어간 ${TAGS[at]}의 부피가 가장 크다.`,
        facts: { choose: { exprs: boxes.map((v) => v.join('*')), rule: 'max' } }
      });
    }),
    T('cmp-things', '담은 물건이 다른 상자의 부피 비교하기', '①8 ②3 ③3 심4', (d, n) => {
      // 벽돌을 담은 두 상자만 수로 비교할 수 있다. 블록을 담은 상자의 수를 가장 크게 하여, 수만 보고 고르면 틀리게 한다.
      const lone = d.int(0, 2), [x, y] = d.until(() => [d.int(12, 24), d.int(12, 24)], ([p, q]) => p !== q), z = Math.max(x, y) + d.int(3, 9), counts = [0, 1, 2].map((i) => (i === lone ? z : [x, y][i - (i > lone ? 1 : 0)]));
      const things = [0, 1, 2].map((i) => (i === lone ? '블록' : '벽돌')), pairs = [[0, 1], [0, 2], [1, 2]], same = [0, 1, 2].filter((i) => i !== lone), big = counts[same[0]] > counts[same[1]] ? same[0] : same[1];
      const told = `${[0, 1, 2].map((i) => `${TAGS[i]} 상자에는 ${things[i]} ${counts[i]}개`).join(', ')}를 빈틈없이 가득 담았다. 벽돌끼리는 모양과 크기가 같고, 블록은 벽돌과 크기가 다르다.`;
      const why = `크기가 다른 물건을 담은 상자끼리는 물건의 수로 부피를 비교할 수 없다. 같은 벽돌을 담은 ${TAGS[same[0]]}와 ${TAGS[same[1]]}만 비교할 수 있다.`;
      if (n === 1) return C(`${told} 담은 물건의 수로 부피를 비교할 수 있는 두 상자 가운데 부피가 더 큰 상자는?`, TAGS.slice(0, 3), big, {
        explain: `${why} 벽돌이 더 많이 들어간 ${TAGS[big]}의 부피가 더 크다. 블록 ${z}개가 들어간 ${TAGS[lone]}는 수가 가장 크지만 벽돌을 담은 상자와 비교할 수 없다.`, facts: { truth: [0, 1, 2].map((i) => i === big), want: true }
      });
      return C(`${told} 담은 물건의 수로 부피를 비교할 수 있는 두 상자는?`, pairs.map(([p, q]) => `${TAGS[p]}와 ${TAGS[q]}`), pairs.findIndex((p) => p.join() === same.join()), {
        explain: why, facts: { truth: pairs.map((p) => things[p[0]] === things[p[1]]), want: true }
      });
    }, { count: 2 }),
    T('cmp-double', '부피가 몇 배인 직육면체를 만드는 데 더 필요한 쌓기나무', '②10', (d) => {
      const v = blockDims(d, (w) => prod(w) <= 24), k = d.pick([2, 3]), total = prod(v);
      return N(`크기가 같은 쌓기나무로 직육면체를 만들었다. 쌓기나무를 더 쌓아 부피가 이 직육면체의 ${k}배인 직육면체를 만들려면 쌓기나무는 몇 개 더 필요한가?`, total * (k - 1), {
        unit: '개', figure: blockArt(v), explain: `쌓은 쌓기나무는 ${counted(v)}이다. 부피가 ${k}배이려면 쌓기나무가 ${total} × ${k} = ${total * k}(개) 있어야 하므로 ${total * k} − ${total} = ${total * (k - 1)}(개)가 더 필요하다.`,
        facts: calc(`${v.join('*')}*${k}-${v.join('*')}`)
      });
    })
  ]);

  // ── 1 cm³와 쌓기나무 ─────────────────────────────────────────
  const CM3 = '부피가 1 cm³인 쌓기나무';
  B.addTypes('6-1-6', 'cm3', [
    T('cm3-word', '1 cm³의 뜻과 읽기', '①11 ②11 ③6 심8', (d, n) => {
      if (n === 0) return pickWord(d, '한 모서리의 길이가 1 cm인 정육면체의 부피를 바르게 쓴 것은?', '1 cm³', ['1 cm', '1 cm²', '3 cm³'], '한 모서리의 길이가 1 cm인 정육면체의 부피를 1 cm³라 쓰고 1 세제곱센티미터라고 읽는다.');
      const v = d.int(12, 96);
      return pickWord(d, `${v} cm³를 바르게 읽은 것은?`, `${v} 세제곱센티미터`, [`${v} 제곱센티미터`, `${v} 센티미터세제곱`, `${v} 세제곱미터`], `1 cm³는 1 세제곱센티미터라고 읽는다. ${v} cm³는 ${v} 세제곱센티미터이다.`);
    }, { count: 2 }),
    T('cm3-say', '부피의 단위 1 cm³에 대한 설명', '①13 ②11 ③7', (d, n) => {
      if (n === 1) {
        const k = d.int(12, 48);
        return pickWord(d, `${CM3} ${k}개를 빈틈없이 쌓아 직육면체를 만들었다. 이 직육면체의 부피를 바르게 나타낸 것은?`, `${k} cm³`, [`${k} cm²`, `${k} cm`, `${k * 3} cm³`], `1 cm³가 ${k}개이므로 부피는 ${k} cm³이다. cm는 길이의 단위이고 cm²는 넓이의 단위이다.`);
      }
      return say(d, '부피의 단위 1 cm³에 대한 설명으로 옳은 것은?',
        ['한 모서리의 길이가 1 cm인 정육면체의 부피이다.', '1 세제곱센티미터라고 읽는다.', '7 cm³는 1 cm³가 7개인 부피이다.'],
        [['한 변의 길이가 1 cm인 정사각형의 넓이이다.', '한 변의 길이가 1 cm인 정사각형의 넓이는 1 cm²이다.'], ['1 제곱센티미터라고 읽는다.', '1 제곱센티미터는 넓이의 단위 1 cm²를 읽은 것이다.'],
          ['모든 모서리의 길이의 합이 1 cm인 정육면체의 부피이다.', '모든 모서리의 길이의 합이 아니라 한 모서리의 길이가 1 cm이다.'], ['길이를 나타내는 단위이다.', '1 cm³는 부피를 나타내는 단위이다.']], true,
        '1 cm³는 한 모서리의 길이가 1 cm인 정육면체의 부피이고 1 세제곱센티미터라고 읽는다.');
    }, { count: 2 }),
    T('cm3-near', '부피가 1 cm³에 가까운 물건', '①12 ②12 ③8 심9', (d) => {
      const want = d.pick(['각설탕 한 개', '주사위 한 개']);
      return pickWord(d, '부피가 1 cm³에 가장 가까운 물건은?', want, d.shuffle(['필통', '냉장고', '세탁기', '두꺼운 사전', '휴지 상자', '여행 가방', '전자레인지']).slice(0, 3), `1 cm³는 한 모서리의 길이가 1 cm인 정육면체의 부피이다. ${want}의 크기가 이와 비슷하다.`);
    }),
    T('cm3-count', '쌓기나무를 세어 직육면체의 부피 구하기', '①14 ②14 ③11 심5', (d) => {
      const v = blockDims(d), k = prod(v);
      return M(`${CM3}로 직육면체를 만들었다. 쌓기나무의 수와 직육면체의 부피를 구하시오.`, [{ label: '쌓기나무', answer: k, unit: '개' }, { label: '부피', answer: k, unit: 'cm³' }], {
        figure: blockArt(v), explain: `쌓기나무는 ${counted(v)}이다. 1 cm³가 ${k}개이므로 부피는 ${k} cm³이다.`, facts: { calc: [[v.join('*'), 0], [v.join('*'), 1]] }
      });
    }),
    T('cm3-layers', '한 층의 수와 층수로 부피 구하기', '①15 ②18 ③11·13', (d) => {
      const v = d.until(() => [d.int(3, 4), d.int(2, 3), d.int(2, 4)], (w) => w[0] * w[1] !== w[2]), floor = v[0] * v[1];
      return M(`${CM3}로 직육면체를 만들었다. 쌓기나무가 한 층에 몇 개씩 몇 층으로 쌓여 있는지 세어 부피를 구하시오.`, [{ label: '한 층에', answer: floor, unit: '개' }, { label: '층수', answer: v[2], unit: '층' }, { label: '부피', answer: prod(v), unit: 'cm³' }], {
        figure: blockArt(v), explain: `한 층에 ${v[0]} × ${v[1]} = ${floor}(개)씩 ${v[2]}층으로 쌓여 있다. ${floor} × ${v[2]} = ${prod(v)}(개)이므로 부피는 ${prod(v)} cm³이다.`,
        facts: { calc: [[`${v[0]}*${v[1]}`, 0], [String(v[2]), 1], [v.join('*'), 2]] }
      });
    }),
    T('cm3-dims', '쌓기나무로 만든 직육면체의 가로, 세로, 높이', '②17 ③13', (d) => {
      const v = d.until(() => [d.int(2, 5), d.int(2, 3), d.int(2, 4)], (w) => new Set(w).size === 3);
      return M(`${CM3}로 직육면체를 만들었다. 이 직육면체의 가로, 세로, 높이는 각각 몇 cm인가?`, v.map((x, i) => ({ label: AX[i], answer: x, unit: 'cm' })), {
        figure: blockArt(v), explain: `부피가 1 cm³인 쌓기나무의 한 모서리의 길이는 1 cm이다. 가로에 ${v[0]}개, 세로에 ${v[1]}개, 높이에 ${v[2]}개가 놓여 있으므로 가로 ${v[0]} cm, 세로 ${v[1]} cm, 높이 ${v[2]} cm이다.`,
        facts: { calc: v.map((x, i) => [String(x), i]) }
      });
    }),
    T('cm3-shape', '쌓기나무로 만든 입체도형의 부피', '②13 ③10 심5', (d) => {
      // 직육면체가 아닌 모양. 보이는 면이 하나도 없는 쌓기나무가 생기지 않게 쌓는다.
      const made = d.until(() => { const a = d.int(2, 4), b = d.int(1, 2), rows = stairs(d, a, b, 3); return { a, b, rows, cubes: pile(rows) }; }, (m) => m.cubes.length >= 5 && m.cubes.length <= 10 && buried(m.cubes) === 0 && new Set(m.rows.reduce((all, r) => all.concat(r), [])).size >= 2 && m.rows[0].some((h) => h > 0));
      const { a, b, cubes } = made, top = layersOf(cubes).length, flags = [];
      for (let x = 0; x < a; x += 1) for (let y = 0; y < b; y += 1) for (let z = 0; z < top; z += 1) flags.push(cubes.some((c) => c[0] === x && c[1] === y && c[2] === z));
      return N(`${CM3}를 쌓아 만든 입체도형의 부피는 몇 cm³인가?`, cubes.length, {
        unit: 'cm³', figure: cubesArt(cubes, { most: [124, 104], label: `쌓기나무를 쌓아 만든 입체도형. ${layerSaid(cubes)}` }),
        explain: `쌓기나무는 ${layerSaid(cubes)}로 모두 ${cubes.length}개이다. 1 cm³가 ${cubes.length}개이므로 부피는 ${cubes.length} cm³이다.`, facts: { count: flags }
      });
    }),
    T('cm3-told', '쌓기나무의 수를 말로 준 부피', '①17 ②15 ③12 심7', (d, n) => {
      if (n === 1) {
        const s = d.pick([3, 4, 5]), k = s * s * s;
        return N(`${CM3} ${k}개를 빈틈없이 쌓아 정육면체를 만들었다. 이 정육면체의 한 모서리에는 쌓기나무가 몇 개씩 놓이는가?`, s, {
          unit: '개', explain: `정육면체는 가로, 세로, 높이에 놓이는 쌓기나무의 수가 같다. 같은 수를 세 번 곱하여 ${josa(k, '이/가')} 되는 수를 찾으면 ${s} × ${s} × ${s} = ${k}이므로 한 모서리에 ${s}개씩 놓인다.`,
          facts: { range: { ineq: `x*x*x>${k - 1}`, lo: 1, hi: 12, want: 'min' } }
        });
      }
      const floor = d.pick([12, 15, 16, 18, 20, 24, 28]), high = d.int(3, 9);
      return N(`${CM3}를 한 층에 ${floor}개씩 ${high}층으로 빈틈없이 쌓아 직육면체를 만들었다. 이 직육면체의 부피는 몇 cm³인가?`, floor * high, {
        unit: 'cm³', explain: `쌓기나무는 ${floor} × ${high} = ${floor * high}(개)이다. 1 cm³가 ${floor * high}개이므로 부피는 ${floor * high} cm³이다.`, facts: calc(`${floor}*${high}`)
      });
    }, { count: 2 }),
    T('cm3-floors', '부피에 맞추어 쌓을 층수', '①17 ②32 ③14 심7', (d) => {
      const a = d.int(3, 5), b = d.int(2, 4), high = d.int(3, 8), total = a * b * high;
      return N(`${CM3}로 한 층을 만들었다. 이와 같은 층을 쌓아 부피가 ${total} cm³인 직육면체를 만들려면 모두 몇 층으로 쌓아야 하는가?`, high, {
        unit: '층', figure: cubesArt(brick([a, b, 1]), { most: [140, 80], label: `쌓기나무를 가로 ${a}개, 세로 ${b}개로 빈틈없이 놓은 한 층` }),
        explain: `한 층에는 쌓기나무가 ${a} × ${b} = ${a * b}(개) 있으므로 한 층의 부피는 ${a * b} cm³이다. ${total} ÷ ${a * b} = ${high}(층)`, facts: calc(`${total}/(${a}*${b})`)
      });
    }),
    T('cm3-diff', '쌓기나무로 만든 두 직육면체의 부피의 차', '①14 ②16 ③5 심6', (d) => {
      const pair = d.until(() => [blockDims(d), blockDims(d)], ([v, w]) => prod(v) !== prod(w) && Math.abs(prod(v) - prod(w)) <= 12), [big, small] = prod(pair[0]) > prod(pair[1]) ? pair : [pair[1], pair[0]];
      return N(`${CM3}로 직육면체 가와 나를 만들었다. 두 직육면체의 부피의 차는 몇 cm³인가?`, prod(big) - prod(small), {
        unit: 'cm³', figure: tiles(pair.map((v) => blockArt(v))), explain: `가의 부피는 ${pair[0].join(' × ')} = ${prod(pair[0])}(cm³), 나의 부피는 ${pair[1].join(' × ')} = ${prod(pair[1])}(cm³)이다. ${prod(big)} − ${prod(small)} = ${prod(big) - prod(small)}(cm³)`,
        facts: calc(`${big.join('*')}-${small.join('*')}`)
      });
    }),
    T('cm3-fill', '상자를 가득 채우는 쌓기나무의 수', '①16 심7', (d) => {
      const v = three(d, range(3, 8), null, 2.4);
      return N('직육면체 모양 상자에 한 모서리의 길이가 1 cm인 정육면체 모양 쌓기나무를 빈틈없이 가득 채우려고 한다. 쌓기나무는 모두 몇 개 필요한가?', prod(v), {
        unit: '개', figure: boxArt(v, cms(v), { label: `직육면체 모양 상자의 겨냥도. ${said3(v)}` }),
        explain: `쌓기나무의 한 모서리가 1 cm이므로 가로에 ${v[0]}개, 세로에 ${v[1]}개씩 ${v[2]}층으로 놓으면 가득 찬다. ${counted(v)}`, facts: calc(v.join('*'))
      });
    }),
    T('cm3-times', '한 모서리만 몇 배인 직육면체의 부피', '①18 ②25', (d) => {
      const ax = d.pick([0, 2]), k = d.pick([2, 3]), v = d.until(() => [d.int(1, 3), d.int(2, 3), d.int(1, 2)], (w) => w[ax] * k <= (ax === 0 ? 6 : 4) && prod(w) >= 4), w = v.map((x, i) => (i === ax ? x * k : x));
      return N(`${CM3}로 직육면체 가와 나를 만들었다. 나의 부피는 가의 부피의 몇 배인가?`, k, {
        unit: '배', figure: tiles([blockArt(v), blockArt(w)]),
        explain: `가의 부피는 ${v.join(' × ')} = ${prod(v)}(cm³), 나의 부피는 ${w.join(' × ')} = ${prod(w)}(cm³)이다. ${prod(w)} ÷ ${prod(v)} = ${k}(배). ${sameTwo(ax)}가 같을 때 ${AX[ax]}가 ${k}배이면 부피도 ${k}배이다.`,
        facts: calc(`${w.join('*')}/(${v.join('*')})`)
      });
    })
  ]);

  // ── 직육면체와 정육면체의 부피 ───────────────────────────────
  const BOX_THINGS = ['과자 상자', '선물 상자', '필통', '벽돌', '두부'];
  const VOL_RULE = '(직육면체의 부피) = (가로) × (세로) × (높이)이다.';
  B.addTypes('6-1-6', 'volume', [
    T('vol-formula-word', '부피를 구하는 식', '①19 ②20 ③15 심8', (d, n) => (n === 0
      ? pickWord(d, '(직육면체의 부피) = (가로) × (세로) × ( ㉠ ) = (한 밑면의 넓이) × ( ㉠ )이다. ㉠에 공통으로 알맞은 말은?', '높이', ['밑면의 둘레', '옆면의 넓이', '모서리의 수'], '직육면체의 부피는 가로, 세로, 높이를 곱하여 구한다. (가로) × (세로)는 한 밑면의 넓이이므로 (한 밑면의 넓이) × (높이)로도 구할 수 있다.')
      : pickWord(d, '(정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × ( ㉠ )이다. ㉠에 알맞은 말은?', '한 모서리의 길이', ['한 면의 넓이', '모서리의 수', '면의 수'], '정육면체는 가로, 세로, 높이가 모두 한 모서리의 길이와 같으므로 한 모서리의 길이를 세 번 곱한다.')), { count: 2 }),
    T('vol-fill', '직육면체의 부피를 구하는 식의 빈칸', '①20 ②20 ③16', (d) => {
      const v = three(d, range(3, 10), null, 2.4);
      return M('직육면체의 부피를 구하는 식이다. ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: '㉠', answer: v[2] }, { label: '㉡', answer: prod(v) }], {
        figure: boxArt(v, cms(v), { label: `직육면체의 겨냥도. ${said3(v)}` }) + lines([`(직육면체의 부피) = ${v[0]} × ${v[1]} × ㉠ = ㉡(cm³)`]),
        explain: `${VOL_RULE} 높이가 ${v[2]} cm이므로 ㉠은 ${v[2]}이고, ${v.join(' × ')} = ${prod(v)}이므로 ㉡은 ${prod(v)}이다.`, facts: { calc: [[String(v[2]), 0], [v.join('*'), 1]] }
      });
    }),
    T('vol-box', '겨냥도로 준 직육면체의 부피', '①21 ②21 ③17 심10', (d) => {
      const v = three(d, [3, 4, 5, 6, 7, 8, 9, 10, 12], null, 2.5);
      return N('직육면체의 부피는 몇 cm³인가?', prod(v), { unit: 'cm³', figure: boxArt(v, cms(v), { label: `직육면체의 겨냥도. ${said3(v)}` }), explain: `${VOL_RULE} ${v.join(' × ')} = ${prod(v)}(cm³)`, facts: calc(v.join('*')) });
    }),
    T('vol-box-text', '글로 준 직육면체의 부피', '①21 ②23 ③18 심10', (d) => {
      const v = d.until(() => [d.pick([8, 10, 12, 15, 20]), d.int(4, 9), d.int(3, 8)], (w) => new Set(w).size === 3);
      return N(`${text3(v)}인 직육면체 모양 ${d.pick(BOX_THINGS)}의 부피는 몇 cm³인가?`, prod(v), { unit: 'cm³', explain: `${VOL_RULE} ${v.join(' × ')} = ${prod(v)}(cm³)`, facts: calc(v.join('*')) });
    }),
    T('vol-cube', '정육면체의 부피', '①22 ②22·23 ③19·29 심11·27', (d, n) => {
      const s = d.int(3, 9);
      if (n === 1) return N(`한 변의 길이가 ${s} cm인 정사각형 모양 종이 6장을 면으로 하여 정육면체 모양 상자를 만들었다. 이 상자의 부피는 몇 cm³인가?`, s * s * s, {
        unit: 'cm³', explain: `상자의 한 모서리의 길이는 종이의 한 변의 길이와 같은 ${s} cm이다. ${s} × ${s} × ${s} = ${s * s * s}(cm³)`, facts: calc(`${s}*${s}*${s}`)
      });
      return N('정육면체의 부피는 몇 cm³인가?', s * s * s, {
        unit: 'cm³', figure: cubeArt(s, len(s), `정육면체의 겨냥도. 한 모서리의 길이 ${s} cm`), explain: `(정육면체의 부피) = (한 모서리의 길이) × (한 모서리의 길이) × (한 모서리의 길이)이다. ${s} × ${s} × ${s} = ${s * s * s}(cm³)`, facts: calc(`${s}*${s}*${s}`)
      });
    }, { count: 2 }),
    T('vol-base', '밑면의 넓이와 높이로 부피 구하기', '①23 ②24 ③20 심12', (d, n) => {
      if (n === 1) {
        const v = three(d, range(3, 9), null, 2.4), area = v[0] * v[1];
        return N(`직육면체에서 색칠한 면의 넓이는 ${area} cm²이다. 이 직육면체의 부피는 몇 cm³인가?`, area * v[2], {
          unit: 'cm³', figure: boxArt(v, [null, null, len(v[2])], { tint: { 5: YELLOW }, label: `직육면체의 겨냥도. 윗면을 색칠했다. 높이 ${v[2]} cm` }),
          explain: `색칠한 면을 밑면으로 보면 높이는 ${v[2]} cm이다. (직육면체의 부피) = (한 밑면의 넓이) × (높이)이므로 ${area} × ${v[2]} = ${area * v[2]}(cm³)`, facts: calc(`${area}*${v[2]}`)
        });
      }
      const area = d.pick([18, 20, 24, 28, 32, 36, 45, 48, 54, 64]), h = d.int(3, 9);
      return N(`한 밑면의 넓이가 ${area} cm²이고 높이가 ${h} cm인 직육면체의 부피는 몇 cm³인가?`, area * h, { unit: 'cm³', explain: `(직육면체의 부피) = (한 밑면의 넓이) × (높이)이다. ${area} × ${h} = ${area * h}(cm³)`, facts: calc(`${area}*${h}`) });
    }, { count: 2 }),
    T('vol-expr', '부피를 구하는 식 고르기', '③21', (d) => {
      const rowsOf = ([a, b, c]) => [[`${a} × ${b} × ${c}`, `${a}*${b}*${c}`], [`(${a} + ${b}) × ${c}`, `(${a}+${b})*${c}`], [`(${a} × ${b} + ${b} × ${c} + ${a} × ${c}) × 2`, `(${a}*${b}+${b}*${c}+${a}*${c})*2`], [`(${a} + ${b} + ${c}) × 4`, `(${a}+${b}+${c})*4`]];
      const v = three(d, range(3, 9), (w) => surf(w) !== prod(w) && (w[0] + w[1]) * w[2] !== prod(w) && (w[0] + w[1] + w[2]) * 4 !== prod(w)), rows = d.shuffle(rowsOf(v));
      return C(`${text3(v)}인 직육면체의 부피를 구하는 식으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === v.join('*')), {
        explain: `${VOL_RULE} ${v.join(' × ')} = ${prod(v)}(cm³). 세 길이를 더하거나, 면의 넓이를 더하는 식은 부피를 구하는 식이 아니다.`, facts: { claimed: rows.map((r) => [r[1], prod(v)]), claimedWant: true }
      });
    }),
    T('vol-net-box', '전개도를 접은 직육면체의 부피', '①25 ②28 ③31 심14', (d) => {
      const v = three(d, range(3, 9), null, 2.4), made = netWith(d, v, (L) => len(L), { label: () => `직육면체의 전개도. 테두리의 세 선분의 길이 ${v.map((x) => len(x)).join(', ')}` });
      return N('전개도를 접어서 만든 직육면체의 부피는 몇 cm³인가?', prod(v), {
        unit: 'cm³', figure: made.figure, explain: `전개도에 적힌 세 길이가 직육면체의 가로, 세로, 높이이다. ${v.join(' × ')} = ${prod(v)}(cm³)`, facts: calc(v.join('*'))
      });
    }),
    T('vol-net-cube', '전개도를 접은 정육면체의 부피', '①26 ②28 심15', (d, n) => {
      const s = d.int(3, 9);
      if (n === 1) return N(`정육면체의 전개도에서 정사각형 3개가 이어진 선분의 길이가 ${s * 3} cm이다. 이 전개도를 접어서 만든 정육면체의 부피는 몇 cm³인가?`, s * s * s, {
        unit: 'cm³', figure: spanNet(d, 3, len(s * 3), `정육면체의 전개도. 맨 윗줄에 나란히 놓인 정사각형 3개의 변을 이은 선분의 길이 ${s * 3} cm`),
        explain: `정사각형 3개의 변을 이은 길이가 ${s * 3} cm이므로 한 모서리의 길이는 ${s * 3} ÷ 3 = ${s}(cm)이다. ${s} × ${s} × ${s} = ${s * s * s}(cm³)`, facts: calc(`(${s * 3}/3)*(${s * 3}/3)*(${s * 3}/3)`)
      });
      return N('전개도를 접어서 만든 정육면체의 부피는 몇 cm³인가?', s * s * s, {
        unit: 'cm³', figure: cubeNetWith(d, len(s), `정육면체의 전개도. 한 모서리의 길이 ${s} cm`), explain: `전개도의 정사각형의 한 변의 길이가 정육면체의 한 모서리의 길이이다. ${s} × ${s} × ${s} = ${s * s * s}(cm³)`, facts: calc(`${s}*${s}*${s}`)
      });
    }, { count: 2 }),
    T('vol-sum-edges', '모서리의 길이의 합·면의 둘레로 정육면체의 부피 구하기', '①28 ②29 심47', (d, n) => {
      const s = d.int(3, 9), k = n === 0 ? 12 : 4;
      return N(n === 0 ? `모든 모서리의 길이의 합이 ${s * 12} cm인 정육면체의 부피는 몇 cm³인가?` : `한 면의 둘레가 ${s * 4} cm인 정육면체의 부피는 몇 cm³인가?`, s * s * s, {
        unit: 'cm³', explain: `${n === 0 ? '정육면체는 길이가 같은 모서리가 12개이므로' : '정육면체의 한 면은 정사각형이므로'} 한 모서리의 길이는 ${s * k} ÷ ${k} = ${s}(cm)이다. ${s} × ${s} × ${s} = ${s * s * s}(cm³)`,
        facts: calc(`(${s * k}/${k})*(${s * k}/${k})*(${s * k}/${k})`, [k])
      });
    }, { count: 2 }),
    T('vol-face-cube', '한 면의 넓이로 정육면체의 부피 구하기', '①24 ②29 ③67 심48', (d) => {
      const s = d.int(3, 10), area = s * s;
      return N(`한 면의 넓이가 ${area} cm²인 정육면체의 부피는 몇 cm³인가?`, s * area, {
        unit: 'cm³', explain: `같은 수를 두 번 곱하여 ${josa(area, '이/가')} 되는 수를 찾으면 ${s} × ${s} = ${area}이므로 한 모서리의 길이는 ${s} cm이다. ${s} × ${s} × ${s} = ${s * area}(cm³)`,
        facts: { range: { ineq: `x*x>${area * area * area - 1}`, lo: 1, hi: 1100, want: 'min' } }
      });
    }),
    T('vol-compare', '글로 준 세 입체도형의 부피 비교하기', '①31 ②26 ③23 심13', (d) => {
      const m = d.until(() => {
        const s = d.pick([5, 6, 7, 8]), cube = s * s * s, h = d.int(4, 9), area = Math.round(cube / h) + d.int(-4, 4), a = d.int(4, 9), b = d.int(4, 9), c = Math.round(cube / (a * b)) + d.int(-1, 1);
        return { s, h, area, v: [a, b, c], values: [area * h, a * b * c, cube] };
      }, (x) => x.v[2] >= 3 && x.v[2] <= 12 && new Set(x.v).size === 3 && new Set(x.values).size === 3 && Math.max(...x.values) - Math.min(...x.values) <= x.values[2] * 0.15);
      const rows = d.shuffle([[`한 밑면의 넓이가 ${m.area} cm²이고 높이가 ${m.h} cm인 직육면체`, `${m.area}*${m.h}`, m.values[0]], [`${text3(m.v)}인 직육면체`, m.v.join('*'), m.values[1]], [`한 모서리의 길이가 ${m.s} cm인 정육면체`, `${m.s}*${m.s}*${m.s}`, m.values[2]]]);
      const values = rows.map((r) => r[2]), at = values.indexOf(Math.max(...values));
      return C('부피가 가장 큰 입체도형은?', MARKS.slice(0, 3), at, {
        figure: tagged(rows.map((r) => r[0]), MARKS), explain: `부피를 차례로 구하면 ${rows.map((r, i) => `${MARKS[i]} ${r[1].split('*').join(' × ')} = ${r[2]}(cm³)`).join(', ')}이다. 가장 큰 것은 ${MARKS[at]}이다.`,
        facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'max' } }
      });
    }),
    T('vol-diff', '두 직육면체의 부피의 차', '①31 ②27 ③22·24 심13', (d) => {
      const pair = d.until(() => [three(d, range(3, 9), null, 2.4), three(d, range(3, 9), null, 2.4)], ([v, w]) => prod(v) !== prod(w) && Math.abs(prod(v) - prod(w)) <= 60 && v.join() !== w.join()), [big, small] = prod(pair[0]) > prod(pair[1]) ? pair : [pair[1], pair[0]];
      return N('직육면체 가와 나의 부피의 차는 몇 cm³인가?', prod(big) - prod(small), {
        unit: 'cm³', figure: tiles(pair.map((v) => boxArt(v, cms(v), { size: [108, 84], label: `직육면체의 겨냥도. ${said3(v)}` }))),
        explain: `가의 부피는 ${pair[0].join(' × ')} = ${prod(pair[0])}(cm³), 나의 부피는 ${pair[1].join(' × ')} = ${prod(pair[1])}(cm³)이다. ${prod(big)} − ${prod(small)} = ${prod(big) - prod(small)}(cm³)`,
        facts: calc(`${big.join('*')}-${small.join('*')}`)
      });
    }),
    T('vol-times', '한 직육면체의 부피는 다른 직육면체의 부피의 몇 배인지 구하기', '①31 ③25 심68', (d) => {
      const m = d.until(() => { const w = [d.int(2, 6), d.int(2, 6), d.int(2, 6)], k = d.pick([2, 3, 4]), x = d.int(2, 10), y = d.int(2, 10); return { w, k, v: [x, y, (k * prod(w)) / (x * y)] }; },
        (q) => Number.isInteger(q.v[2]) && q.v[2] >= 2 && q.v[2] <= 12 && q.v.filter((x, i) => x === q.w[i]).length <= 1 && new Set(q.v).size >= 2 && new Set(q.w).size >= 2);
      return N(`${text3(m.v)}인 직육면체 가의 부피는 ${text3(m.w)}인 직육면체 나의 부피의 몇 배인가?`, m.k, {
        unit: '배', explain: `가의 부피는 ${m.v.join(' × ')} = ${prod(m.v)}(cm³), 나의 부피는 ${m.w.join(' × ')} = ${prod(m.w)}(cm³)이다. ${prod(m.v)} ÷ ${prod(m.w)} = ${m.k}(배)`,
        facts: calc(`${m.v.join('*')}/(${m.w.join('*')})`)
      });
    }),
    T('vol-many', '같은 상자 여러 개의 부피와 똑같이 나눈 한 조각의 부피', '①33 심17', (d, n) => {
      if (n === 1) {
        const k = d.pick([2, 4]), v = [d.pick([12, 16, 20, 24]), d.int(5, 9), d.int(3, 6)];
        return N(`${text3(v)}인 직육면체 모양 떡을 크기가 같은 ${k}조각으로 잘랐다. 한 조각의 부피는 몇 cm³인가?`, prod(v) / k, {
          unit: 'cm³', explain: `자르기 전 떡의 부피는 ${v.join(' × ')} = ${prod(v)}(cm³)이다. 크기가 같은 ${k}조각으로 나누었으므로 한 조각의 부피는 ${prod(v)} ÷ ${k} = ${prod(v) / k}(cm³)이다.`, facts: calc(`${v.join('*')}/${k}`)
        });
      }
      const v = three(d, range(2, 6)), k = d.pick([6, 8, 10, 12, 15]);
      return N(`${text3(v)}인 직육면체 모양 상자 ${k}개를 빈틈없이 쌓았다. 쌓은 상자 전체의 부피는 몇 cm³인가?`, prod(v) * k, {
        unit: 'cm³', explain: `상자 한 개의 부피는 ${v.join(' × ')} = ${prod(v)}(cm³)이다. ${k}개의 부피는 ${prod(v)} × ${k} = ${prod(v) * k}(cm³)이다.`, facts: calc(`${v.join('*')}*${k}`)
      });
    }, { count: 2 }),
    T('vol-biggest-cube', '직육면체를 잘라 만드는 가장 큰 정육면체의 부피', '①35 ②30 ③27 심63', (d) => {
      const v = three(d, range(4, 14), (w) => Math.min(...w) <= 9, 2.4), m = Math.min(...v);
      return N('직육면체 모양 나무토막을 잘라서 정육면체를 한 개 만들려고 한다. 만들 수 있는 가장 큰 정육면체의 부피는 몇 cm³인가?', m * m * m, {
        unit: 'cm³', figure: boxArt(v, cms(v), { label: `직육면체 모양 나무토막의 겨냥도. ${said3(v)}` }),
        explain: `정육면체는 모서리의 길이가 모두 같으므로 한 모서리가 나무토막의 가장 짧은 모서리인 ${m} cm보다 길 수 없다. ${m} × ${m} × ${m} = ${m * m * m}(cm³)`, facts: calc(`${m}*${m}*${m}`)
      });
    }),
    T('vol-dice', '정육면체 여러 개를 쌓아 만든 큰 정육면체', '②35 ③28', (d, n) => {
      const k = d.pick([2, 3]), s = d.int(2, k === 2 ? 5 : 3), count = k * k * k;
      if (n === 1) return N(`한 모서리의 길이가 ${s} cm인 정육면체 모양 블록 ${count}개를 빈틈없이 쌓아 큰 정육면체를 만들었다. 큰 정육면체의 부피는 몇 cm³인가?`, s * s * s * count, {
        unit: 'cm³', explain: `블록 한 개의 부피는 ${s} × ${s} × ${s} = ${s * s * s}(cm³)이다. ${count}개의 부피는 ${s * s * s} × ${count} = ${s * s * s * count}(cm³)이다.`, facts: calc(`${s}*${s}*${s}*${count}`)
      });
      return N(`한 모서리의 길이가 ${s} cm인 정육면체 모양 주사위 ${count}개를 빈틈없이 쌓아 큰 정육면체를 만들었다. 큰 정육면체의 한 모서리의 길이는 몇 cm인가?`, s * k, {
        unit: 'cm', explain: `${k} × ${k} × ${k} = ${count}이므로 큰 정육면체의 한 모서리에는 주사위가 ${k}개씩 놓인다. ${s} × ${k} = ${s * k}(cm)`, facts: calc(`${s}*${k}`, [k])
      });
    }, { count: 2 }),
    T('vol-stretch', '모서리를 몇 배로 늘인 정육면체의 부피', '①36 ②80 심68', (d) => {
      const k = d.pick([2, 3]), s = d.int(2, k === 2 ? 5 : 3), t = s * k;
      return N(`한 모서리의 길이가 ${s} cm인 정육면체의 모든 모서리의 길이를 ${k}배로 늘여 새 정육면체를 만들었다. 새 정육면체의 부피는 몇 cm³인가?`, t * t * t, {
        unit: 'cm³', explain: `새 정육면체의 한 모서리의 길이는 ${s} × ${k} = ${t}(cm)이다. ${t} × ${t} × ${t} = ${t * t * t}(cm³)`, facts: calc(`(${s}*${k})*(${s}*${k})*(${s}*${k})`)
      });
    })
  ]);

  // ── 부피로 모서리 구하기 ─────────────────────────────────────
  B.addTypes('6-1-6', 'back', [
    T('back-edge', '부피와 두 모서리로 나머지 모서리 구하기', '①29 ②32 ③64 심18', (d, n) => {
      if (n === 1) {
        const v = three(d, range(3, 9));
        return N(`부피가 ${prod(v)} m³인 직육면체 모양 창고의 가로가 ${v[0]} m, 세로가 ${v[1]} m일 때 높이는 몇 m인가?`, v[2], {
          unit: 'm', explain: `${v[0]} × ${v[1]} × (높이) = ${prod(v)}이다. ${v[0]} × ${v[1]} = ${v[0] * v[1]}이므로 높이는 ${prod(v)} ÷ ${v[0] * v[1]} = ${v[2]}(m)이다.`, facts: calc(`${prod(v)}/(${v[0]}*${v[1]})`)
        });
      }
      const v = three(d, range(3, 10), null, 2.4), ax = d.int(0, 2), rest = v.filter((_, i) => i !== ax), shown = v.map((x, i) => (i === ax ? '□ cm' : len(x)));
      return N(`부피가 ${prod(v)} cm³인 직육면체이다. □ 안에 알맞은 수는?`, v[ax], {
        figure: boxArt(v, shown, { label: `직육면체의 겨냥도. 가로 ${shown[0]}, 세로 ${shown[1]}, 높이 ${shown[2]}` }),
        explain: `${v.map((x, i) => (i === ax ? '□' : x)).join(' × ')} = ${prod(v)}이다. ${rest[0]} × ${rest[1]} = ${rest[0] * rest[1]}이므로 □ = ${prod(v)} ÷ ${rest[0] * rest[1]} = ${v[ax]}이다.`, facts: calc(`${prod(v)}/(${rest[0]}*${rest[1]})`)
      });
    }, { count: 2 }),
    T('back-net-edge', '전개도에서 부피로 모서리 구하기', '심18', (d) => {
      const v = three(d, range(3, 9), null, 2.4), ask = d.pick(v), rest = v.filter((x) => x !== ask);
      const made = netWith(d, v, (L) => (L === ask ? '□ cm' : len(L)), { label: () => `직육면체의 전개도. 테두리의 세 선분의 길이 ${rest[0]} cm, ${rest[1]} cm, □ cm` });
      return N(`부피가 ${prod(v)} cm³인 직육면체의 전개도이다. □ 안에 알맞은 수는?`, ask, {
        figure: made.figure, explain: `전개도에 적힌 세 길이가 직육면체의 서로 다른 세 모서리의 길이이다. ${rest[0]} × ${rest[1]} × □ = ${prod(v)}이고 ${rest[0]} × ${rest[1]} = ${rest[0] * rest[1]}이므로 □ = ${prod(v)} ÷ ${rest[0] * rest[1]} = ${ask}이다.`,
        facts: calc(`${prod(v)}/(${rest[0]}*${rest[1]})`)
      });
    }),
    T('back-base', '부피와 밑면의 넓이·높이', '①17 ③65 심19', (d, n) => {
      const area = d.pick([18, 24, 28, 32, 36, 42, 48, 54, 63]), h = d.int(3, 9), total = area * h;
      return n === 0
        ? N(`부피가 ${total} cm³이고 한 밑면의 넓이가 ${area} cm²인 직육면체의 높이는 몇 cm인가?`, h, { unit: 'cm', explain: `(한 밑면의 넓이) × (높이) = (부피)이다. ${area} × (높이) = ${total}이므로 높이는 ${total} ÷ ${area} = ${h}(cm)이다.`, facts: calc(`${total}/${area}`) })
        : N(`부피가 ${total} cm³이고 높이가 ${h} cm인 직육면체의 한 밑면의 넓이는 몇 cm²인가?`, area, { unit: 'cm²', explain: `(한 밑면의 넓이) × (높이) = (부피)이다. (한 밑면의 넓이) × ${h} = ${total}이므로 한 밑면의 넓이는 ${total} ÷ ${h} = ${area}(cm²)이다.`, facts: calc(`${total}/${h}`) });
    }, { count: 2 }),
    T('back-cube', '부피로 정육면체의 한 모서리 구하기', '①30 ②33 심20', (d) => {
      const s = d.int(3, 10), total = s * s * s;
      return N(`부피가 ${total} cm³인 정육면체의 한 모서리의 길이는 몇 cm인가?`, s, {
        unit: 'cm', explain: `같은 수를 세 번 곱하여 ${josa(total, '이/가')} 되는 수를 찾는다. ${s} × ${s} × ${s} = ${total}이므로 한 모서리의 길이는 ${s} cm이다.`,
        facts: { range: { ineq: `x*x*x>${total - 1}`, lo: 1, hi: 20, want: 'min' } }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
