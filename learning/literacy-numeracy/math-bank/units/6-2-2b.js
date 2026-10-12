// 6학년 2학기 2단원 공간과 입체 — 본 모양으로 쌓은 모양 알기, 위에서 본 모양에 수를 써서 나타내기, 층별로 나타낸 모양, 쌓기나무로 여러 가지 모양 만들기의 기본 문항.
// 단원 틀과 그림 도구(B.kit.blocks622)는 6-2-2a.js 에 있다. 실력 문항은 6-2-2c.js, 대조표는 수집본의 _분석/6-2-2/싣기_대조표.md.
//
// 싣는 기준(6-2-2a.js 에 적은 것 말고)
//  - 위·앞·옆에서 본 모양으로 묻는 문제는 쌓은 모양이 하나로 정해지는 것만 싣는다. 위에서 본 모양의 칸마다 1부터 (그 세로줄의 앞 층수와 그 가로줄의 옆 층수 가운데 작은 것)까지
//    모든 경우를 넣어 보아(fits) 본 모양 셋에 맞는 것이 하나뿐인지 판정한다.
//  - 수를 쓴 모양·층별 모양은 쌓은 모양의 그림 없이 칸과 수만으로 낸다. 쌓은 모양을 고르는 문제의 틀린 그림은 위에서 본 모양은 같고 한 칸의 높이만 다르거나 두 칸의 높이를 맞바꾼 것이다.
//  - 층별 모양은 위층의 칸이 아래층의 칸 위에만 놓인다. 「2층 모양이 될 수 없는 것」「1층과 3층 사이의 2층 모양」은 이것만으로 판정한다(칸 수로는 가릴 수 없게 칸 수를 맞춘다).
//  - 쌓기나무를 붙여 만든 모양은 쌓기나무의 자리 [x, y, z] 로 다루고, 돌리는 방법 24가지를 모두 해 보아 같은 모양인지, 두 모양으로 나눌 수 있는지를 판정한다.
//    거울에 비친 모양은 돌려서 같아지지 않으면 다른 모양으로 본다(교과서의 「쌓기나무 4개로 만들 수 있는 모양은 8가지」와 같은 셈).
//
// 뺀 것과 까닭(이 파일의 네 묶음)
//  - 본 모양 셋이 한 가지로 정해지는지 가리기(심41), 방향 이름이 없는 세 그림으로 개수 구하기(심40): 정해지지 않는 자리를 찾는 경우 따지기다.
//  - 두 그림이 앞과 옆 가운데 어느 쪽인지(①46·③37의 변형 심25): 「위, 앞, 옆 가운데 어느 방향에서 본 모양인가」와 같은 판단이다.
//  - 층마다 쌓은 수를 모두 쓰기(②40의 변형), 주어진 개수로 나타낼 수 없는 것(①51), 더 적은 것(①44의 변형): 「쓴 수로 개수 구하기」「한 층에 쌓은 개수」를 여러 번 하는 것이다.
//  - 가려진 수가 있는 모양(①54), 본 모양이 같아지게 하는 가장 작은 수(①55): 조건 풀이다. 수를 바르게 쓴 것 고르기(③33): 「쌓은 모양을 보고 수 쓰기」와 같은 판단이다.
//  - 말로 한 설명에 맞는 모양 고르기(①64), 쌓은 모양과 세 방향 모양으로 개수 구하기(①58), 본 모양 셋으로 개수를 구한 뒤 남는 수(②61): 「정해진 개수로 쌓은 모양 고르기」「가려진 자리가 있는 쌓은 모양의 개수」「똑같이 쌓고 남는 쌓기나무」와 같은 판단이다.
//  - 붙여 만든 모양을 본 모양·위에서 보이는 수(②59 심59): 쓰인 조각을 가린 뒤 다시 본 모양을 따지는 세 단계이고 답이 조각을 놓는 방법에 따라 달라진다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C } = B.kit;
  const K = B.kit.blocks622;
  const { TAGS, MARKS, sum, same, distinct, setOptions, pickTile, tiles, ROSE, total, peak, copy, cellsOf, frontOf, sideOf, layerOf, footOf, layerCounts, mirrored, where, levels, byLayer, plus,
    stackArt, sight, clear, fixedByTop, fixedByCount, fixedIfShown, pile, SQ, MID, topArt, viewArt, layerArt, threeViews, grab, within, reversed, rowsSaid, fourViews, nearFoots, pair, HIDDEN_NONE, nearSide, frontWhy, sideWhy, T } = K;
  const VIEW = K.VIEW, COUNT = K.COUNT;
  const COLS3 = ['왼쪽 줄', '가운데 줄', '오른쪽 줄'];

  // ── 본 모양에 맞는 쌓은 모양 찾기 ────────────────────────────
  // 위에서 본 모양(foot)의 칸마다 수를 넣어 보아 앞·옆에서 본 모양에 맞는 쌓은 모양을 모두 찾는다(cap 개까지). front 나 side 를 주지 않으면 그 방향은 보지 않는다.
  // o.total: 쌓기나무의 수도 맞아야 한다.
  function fits(foot, front, side, o) {
    const opt = o || {}, R = foot.length, cells = cellsOf(foot), cur = foot.map((row) => row.map(() => 0)), out = [], cap = opt.cap || 3;
    const most = cells.map(([r, c]) => Math.min(front ? front[c] : 3, side ? side[R - 1 - r] : 3));
    (function place(i, used) {
      if (out.length >= cap || (opt.total != null && used > opt.total)) return;
      if (i === cells.length) { if (!(front && !same(frontOf(cur), front)) && !(side && !same(sideOf(cur), side)) && (opt.total == null || used === opt.total)) out.push(copy(cur)); return; }
      const [r, c] = cells[i];
      for (let v = 1; v <= most[i]; v += 1) { cur[r][c] = v; place(i + 1, used + v); }
      cur[r][c] = 0;
    })(0, 0);
    return out;
  }
  const fixedByViews = (h) => fits(footOf(h), frontOf(h), sideOf(h), { cap: 2 }).length === 1;
  // 본 모양 셋으로 하나로 정해지는 쌓은 모양
  const solved = (d, ok) => grab(d, { sizes: MID, cells: [4, 6], peak: [2, 3] }, (s) => within(s, 5, 11) && fixedByViews(s) && (!ok || ok(s)));
  const deduce = (h) => `위에서 본 모양의 칸마다 쌓은 수를 정한다. 앞에서 본 모양에서 세로줄마다 가장 높은 층은 왼쪽부터 ${levels(frontOf(h))}이고, 옆에서 본 모양에서 가로줄마다 가장 높은 층은 앞줄부터 ${levels(sideOf(h))}이다. 두 가지에 모두 맞게 쌓으면 ${rowsSaid(h)}이다.`;
  // 위에서 본 모양은 같고 한 칸의 높이만 다르거나, 높이가 다른 두 칸을 맞바꾼 모양들
  function lookalikes(h) {
    const out = [], cells = cellsOf(h);
    cells.forEach(([r, c]) => [h[r][c] - 1, h[r][c] + 1].forEach((v) => { if (v >= 1 && v <= 3) { const g = copy(h); g[r][c] = v; out.push(g); } }));
    cells.forEach(([r, c], i) => cells.forEach(([r2, c2], j) => { if (i < j && h[r][c] !== h[r2][c2]) { const g = copy(h); g[r][c] = h[r2][c2]; g[r2][c2] = h[r][c]; out.push(g); } }));
    return out;
  }
  // 쌓은 모양 넷(맞는 것 하나와 닮은 것 셋). ok(g): 틀린 보기로 쓸 수 있는가
  function fourPiles(d, h, ok) {
    const pool = d.shuffle(distinct(lookalikes(h))).filter((g) => !same(g, h) && K.open(g) && fixedIfShown(g) && (!ok || ok(g)));
    return pool.length >= 3 ? d.shuffle([h].concat(pool.slice(0, 3))) : null;
  }
  // 서로 다른 칸 n개(쌓은 수가 여러 가지가 되게 고른다)
  function someCells(d, h, n) {
    const cells = d.shuffle(cellsOf(h)), out = [];
    for (const q of cells) if (out.length < n && !out.some((p) => h[p[0]][p[1]] === h[q[0]][q[1]])) out.push(q);
    for (const q of cells) if (out.length < n && !out.includes(q)) out.push(q);
    return out.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  }
  const numArt = (h, o) => topArt(h, Object.assign({ numbers: true, said: '위에서 본 모양에 쌓은 쌓기나무의 수를 쓴 것' }, o || {}));
  const WROTE = '위에서 본 모양에 쌓은 쌓기나무의 수를 썼다.';
  Object.assign(K, { fits, fixedByViews, solved, deduce, lookalikes, fourPiles, someCells, numArt, WROTE });

  B.addTypes('6-2-2', 'guess', [
    T('guess-count', '위, 앞, 옆에서 본 모양으로 개수 구하기', '①59 ②27 ③26 심35', (d) => {
      const h = solved(d);
      return N('쌓기나무로 쌓은 모양을 위, 앞, 옆에서 본 모양이다. 똑같은 모양으로 쌓는 데 필요한 쌓기나무는 몇 개인가?', total(h), {
        unit: '개', figure: threeViews(h), explain: `${deduce(h)} 모두 더하면 ${total(h)}개이다.`, facts: { calc: [[plus(h), 0]], unseen: [1, 2, 3], b622: { kind: 'views3', h } }
      });
    }, { standard: COUNT }),
    T('guess-pick', '위, 앞, 옆에서 본 모양에 맞는 쌓은 모양 고르기', '①57 ②26 ③25 심37', (d) => {
      const made = d.until(() => { const h = solved(d, (s) => K.open(s) && fixedIfShown(s)), list = fourPiles(d, h, (g) => !same(frontOf(g), frontOf(h)) || !same(sideOf(g), sideOf(h))); return list ? { h, list } : null; }, Boolean), { h, list } = made;
      const fit = (g) => same(footOf(g), footOf(h)) && same(frontOf(g), frontOf(h)) && same(sideOf(g), sideOf(h));
      return pickTile(`쌓기나무로 쌓은 모양을 위, 앞, 옆에서 본 모양이다. 가, 나, 다, 라 가운데 이 모양은? ${HIDDEN_NONE}`, list.map(fit), {
        figure: threeViews(h) + tiles(list.map((g) => stackArt(g, { u: 16 }))),
        explain: list.map((g, i) => (fit(g) ? '' : `${TAGS[i]}는 ${!same(frontOf(g), frontOf(h)) ? '앞' : '옆'}에서 본 모양이 왼쪽부터 ${levels(!same(frontOf(g), frontOf(h)) ? frontOf(g) : sideOf(g))}이라서 맞지 않는다. `)).join('') + `${TAGS[list.findIndex(fit)]}는 세 방향에서 본 모양이 모두 맞는다.`,
        facts: { b622: { kind: 'pickByViews', h, list } }
      });
    }),
    T('guess-cell', '위, 앞, 옆에서 본 모양으로 자리마다 쌓은 수 알기', '①60 ③28 심36', (d) => {
      const h = solved(d, (s) => peak(s) >= 2), spots = someCells(d, h, 2);
      return M('쌓기나무로 쌓은 모양을 위, 앞, 옆에서 본 모양이다. 위에서 본 모양의 ㉠, ㉡ 자리에 쌓은 쌓기나무는 각각 몇 개인가?', spots.map(([r, c], i) => ({ label: MARKS[i], answer: h[r][c], unit: '개' })), {
        figure: threeViews(h, { text: spots.map(([r, c], i) => [r, c, MARKS[i]]) }), explain: `${deduce(h)} ${spots.map(([r, c], i) => `${MARKS[i]} 자리에는 ${h[r][c]}개`).join(', ')}를 쌓았다.`,
        facts: { calc: spots.map(([r, c], i) => [String(h[r][c]), i]), unseen: [1, 2, 3], b622: { kind: 'cellsByViews', h, spots } }
      });
    })
  ]);

  // ── 위에서 본 모양에 수를 써서 나타내기 ──────────────────────
  B.addTypes('6-2-2', 'nums', [
    T('nums-read', '쌓은 모양을 보고 위에서 본 모양에 수 쓰기', '①43 ②32·33 ③32 심21', (d) => {
      const h = grab(d, { sizes: MID, cells: [5, 8], peak: [2, 3] }, (s) => within(s, 7, 13) && clear(s) && fixedByTop(s)), spots = someCells(d, h, 3);
      return M('쌓기나무로 쌓은 모양과 위에서 본 모양이다. 위에서 본 모양의 칸마다 쌓은 쌓기나무의 수를 쓸 때, ㉠, ㉡, ㉢ 자리에 쓸 수는 각각 얼마인가?', spots.map(([r, c], i) => ({ label: MARKS[i], answer: h[r][c] })), {
        figure: tiles([stackArt(h), topArt(h, { text: spots.map(([r, c], i) => [r, c, MARKS[i]]) })], ['쌓은 모양', '위에서 본 모양']),
        explain: `자리마다 맨 아래부터 맨 위까지 쌓은 쌓기나무를 센다. ${spots.map(([r, c], i) => `${MARKS[i]} 자리에는 ${h[r][c]}개`).join(', ')}를 쌓았다.`,
        facts: { calc: spots.map(([r, c], i) => [String(h[r][c]), i]), b622: { kind: 'read', h, spots } }
      });
    }, { standard: COUNT }),
    T('nums-total', '쓴 수로 개수 구하기', '①44 ②35 ③34 심22', (d) => {
      const h = grab(d, { sizes: MID, cells: [5, 8], peak: [2, 3] }, (s) => within(s, 8, 14));
      return N(`${WROTE} 똑같은 모양으로 쌓는 데 필요한 쌓기나무는 몇 개인가?`, total(h), {
        unit: '개', figure: numArt(h), explain: `칸에 쓴 수는 그 자리에 쌓은 쌓기나무의 수이다. 쓴 수를 모두 더하면 ${cellsOf(h).map(([r, c]) => h[r][c]).join(' + ')} = ${total(h)}(개)이다.`, facts: { calc: [[plus(h), 0]], b622: { kind: 'total', h } }
      });
    }, { standard: COUNT }),
    T('nums-front-levels', '쓴 수로 앞에서 본 모양의 층수 알기', '①45 ②37 ③36 심24', (d) => {
      const h = grab(d, { sizes: SQ, cells: [5, 8], peak: [2, 3] }, (s) => new Set(frontOf(s)).size > 1 && !same(frontOf(s), s[2])), list = frontOf(h);
      return M(`${WROTE} 이 모양을 앞에서 본 모양은 왼쪽 줄부터 차례로 몇 층인가?`, list.map((v, i) => ({ label: COLS3[i], answer: v, unit: '층' })), {
        figure: numArt(h), explain: `앞에서 보면 세로줄마다 가장 큰 수만큼의 층이 보인다. 세로줄마다 가장 큰 수는 왼쪽부터 ${list.join(', ')}이다.`, facts: { calc: list.map((v, i) => [String(v), i]), b622: { kind: 'levels', h, dir: '앞' } }
      });
    }),
    T('nums-side-pick', '쓴 수로 옆에서 본 모양 고르기', '①46 ③37 심24', (d) => {
      const h = grab(d, { sizes: SQ, cells: [5, 8], peak: [2, 3] }, (s) => !same(sideOf(s), reversed(sideOf(s)))), right = sideOf(h), list = fourViews(d, right, [reversed(right), frontOf(h), nearSide(h)], peak(h));
      return pickTile(`${WROTE} 이 모양을 옆에서 본 모양은?`, list.map((v) => same(v, right)), {
        figure: numArt(h) + tiles(list.map((v) => viewArt(v, { top: peak(h) }))), explain: `옆에서 보면 가로줄마다 가장 큰 수만큼의 층이 보이고, 앞줄이 왼쪽에 보인다. 가로줄마다 가장 큰 수는 앞줄부터 ${right.join(', ')}이므로 왼쪽부터 ${levels(right)}이다.`,
        facts: { b622: { kind: 'view', h, dir: '옆', list } }
      });
    }),
    T('nums-layer-count', '쓴 수로 한 층에 쌓은 개수 알기', '①48 ②40 ③39 심23', (d) => {
      const h = grab(d, { sizes: MID, cells: [5, 8], peak: [3, 3] }, (s) => layerCounts(s)[2] >= 1), k = d.pick([2, 3]), flags = cellsOf(h).map(([r, c]) => h[r][c] >= k), n = flags.filter(Boolean).length;
      return N(`${WROTE} 이 모양의 ${k}층에 쌓은 쌓기나무는 몇 개인가?`, n, {
        unit: '개', figure: numArt(h), explain: `${k}층에는 ${k} 이상인 수를 쓴 자리에만 쌓기나무가 있다. ${k} 이상인 수를 쓴 칸이 ${n}개이므로 ${k}층에 쌓은 쌓기나무는 ${n}개이다.`, facts: { count: flags, b622: { kind: 'layer', h, k } }
      });
    }, { standard: COUNT }),
    T('nums-blank', '전체 개수로 빈칸의 수 구하기', '①49 ③41', (d) => {
      const h = grab(d, { sizes: MID, cells: [4, 7], peak: [2, 3] }, (s) => within(s, 7, 13)), [r, c] = d.pick(cellsOf(h)), rest = cellsOf(h).filter((q) => q[0] !== r || q[1] !== c).map((q) => h[q[0]][q[1]]);
      return N(`쌓기나무 ${total(h)}개로 쌓은 모양을 위에서 본 모양에 쌓은 쌓기나무의 수를 쓰다가 색칠한 칸을 비워 두었다. 색칠한 칸에 알맞은 수는?`, h[r][c], {
        figure: numArt(h, { hide: [[r, c, '']], tint: { [r + ',' + c]: '#cfe3ff' }, said: `위에서 본 모양에 쌓은 쌓기나무의 수를 쓴 것(${where(h, r, c)}은 색칠하고 비워 두었다)` }),
        explain: `쓴 수를 모두 더하면 쌓기나무의 수가 된다. 색칠한 칸을 뺀 나머지 수의 합은 ${rest.join(' + ')} = ${sum(rest)}이므로 색칠한 칸의 수는 ${total(h)} − ${sum(rest)} = ${h[r][c]}이다.`,
        facts: { calc: [[`${total(h)}-(${rest.join('+')})`, 0]], b622: { kind: 'blank', h, cell: [r, c] } }
      });
    }, { standard: COUNT }),
    T('nums-match-pic', '쓴 수에 맞는 쌓은 모양 고르기', '①47 ②36 ③35 심27', (d) => {
      const made = d.until(() => { const h = grab(d, { sizes: MID, cells: [4, 7], peak: [2, 3] }, (s) => within(s, 6, 12) && K.open(s) && fixedIfShown(s)), list = fourPiles(d, h); return list ? { h, list } : null; }, Boolean), { h, list } = made;
      return pickTile(`${WROTE} 가, 나, 다, 라 가운데 이 모양은? ${HIDDEN_NONE}`, list.map((g) => same(g, h)), {
        figure: numArt(h) + tiles(list.map((g) => stackArt(g, { u: 16 }))),
        explain: list.map((g, i) => { if (same(g, h)) return ''; const [r, c] = cellsOf(h).find((q) => g[q[0]][q[1]] !== h[q[0]][q[1]]); return `${TAGS[i]}는 ${where(h, r, c)}에 ${g[r][c]}개를 쌓았다. `; }).join('') + `칸마다 쓴 수만큼 쌓은 모양은 ${TAGS[list.findIndex((g) => same(g, h))]}이다.`,
        facts: { b622: { kind: 'pickSame', h, list } }
      });
    }),
    T('nums-wrong-cell', '잘못 쓴 수 찾아 고치기', '①52 ②34', (d) => {
      const h = grab(d, { sizes: MID, cells: [5, 7], peak: [2, 3] }, (s) => within(s, 7, 12) && clear(s) && fixedByTop(s)), [r, c] = d.pick(cellsOf(h)), wrong = d.pick([1, 2, 3].filter((v) => v !== h[r][c] && Math.abs(v - h[r][c]) === 1)), g = copy(h);
      g[r][c] = wrong;
      return N('쌓기나무로 쌓은 모양을 보고 위에서 본 모양의 칸마다 쌓은 쌓기나무의 수를 썼는데, 한 칸에 수를 잘못 썼다. 그 칸에 바르게 써야 할 수는?', h[r][c], {
        figure: tiles([stackArt(h), numArt(g, { said: '위에서 본 모양에 수를 쓴 것(한 칸은 잘못 썼다)' })], ['쌓은 모양', '위에서 본 모양']),
        explain: `쌓은 모양에서 자리마다 쌓은 수를 세어 쓴 수와 비교한다. ${where(h, r, c)}에는 쌓기나무를 ${h[r][c]}개 쌓았는데 ${wrong}${wrong === 2 ? '라고' : '이라고'} 썼다. 바르게 쓰면 ${h[r][c]}이다.`,
        facts: { calc: [[String(h[r][c]), 0]], b622: { kind: 'fix', h, g } }
      });
    }, { standard: COUNT }),
    T('nums-eq-views', '앞과 옆에서 본 모양이 같은 것 찾기', '②22 ③38 심26', (d) => {
      // 맞는 것은 앞과 옆에서 본 모양이 같다(좌우로 뒤집어도 같은 모양은 쓰지 않는다). 틀린 것 하나는 옆에서 본 모양이 앞에서 본 모양을 좌우로 뒤집은 것이다.
      const F = d.until(() => [d.int(1, 3), d.int(1, 3), d.int(1, 3)], (v) => !same(v, reversed(v)) && Math.max(...v) >= 2);
      const make = (front, side) => d.until(() => K.built(d, { front, side, cells: [5, 7] }), Boolean), other = () => d.until(() => pile(d, { sizes: SQ, cells: [5, 7], peak: [2, 3] }), (s) => !same(frontOf(s), sideOf(s)));
      const list = d.until(() => d.shuffle([make(F, F), make(F, reversed(F)), other(), other()]), (four) => four.filter((s) => same(frontOf(s), sideOf(s))).length === 1 && distinct(four).length === 4);
      const flags = list.map((s) => same(frontOf(s), sideOf(s))), at = flags.indexOf(true);
      return pickTile('위에서 본 모양에 쌓은 쌓기나무의 수를 쓴 것이다. 가, 나, 다, 라 가운데 앞에서 본 모양과 옆에서 본 모양이 같은 것은?', flags, {
        figure: tiles(list.map((s) => numArt(s, { u: 20 }))),
        explain: `${TAGS[at]}는 앞에서 본 모양이 왼쪽부터 ${levels(frontOf(list[at]))}이고, 옆에서 본 모양도 왼쪽부터 ${levels(sideOf(list[at]))}이다. 옆에서 본 모양은 앞줄이 왼쪽에 오도록 아래 줄부터 읽는다. ` + list.map((s, i) => (flags[i] ? '' : `${TAGS[i]}는 앞이 ${levels(frontOf(s))}, 옆이 ${levels(sideOf(s))}이다. `)).join('').trim(),
        facts: { b622: { kind: 'eqViews', list } }
      });
    }),
    T('nums-add-to', '쌓은 모양을 수를 쓴 모양대로 바꾸기', '①53 ②51 심51', (d) => {
      const made = d.until(() => {
        const goal = pile(d, { sizes: MID, cells: [5, 7], peak: [3, 3] }), now = copy(goal), picks = d.shuffle(cellsOf(goal).filter(([r, c]) => goal[r][c] >= 2)).slice(0, d.int(2, 3));
        picks.forEach(([r, c]) => { now[r][c] -= d.int(1, goal[r][c] - 1); });
        return picks.length >= 2 && within(goal, 9, 14) && clear(now) && fixedByTop(now) ? { goal, now, picks } : null;
      }, Boolean), { goal, now, picks } = made, more = total(goal) - total(now);
      return N('쌓기나무로 쌓은 모양에 쌓기나무를 더 쌓아서, 위에서 본 모양에 쓴 수와 같은 모양을 만들려고 한다. 쌓기나무는 몇 개 더 필요한가?', more, {
        unit: '개', figure: tiles([stackArt(now), numArt(goal, { said: '만들 모양을 위에서 본 모양에 쌓은 쌓기나무의 수를 쓴 것' })], ['지금 쌓은 모양', '만들 모양']),
        explain: `자리마다 지금 쌓은 수와 쓴 수를 비교한다. ${picks.map(([r, c]) => `${where(goal, r, c)}에 ${goal[r][c] - now[r][c]}개`).join(', ')}를 더 쌓아야 하므로 모두 ${more}개가 더 필요하다. 쓴 수의 합 ${total(goal)}에서 지금 쌓은 쌓기나무의 수 ${total(now)}${josa622(total(now))} 빼도 된다.`,
        facts: { calc: [[`(${plus(goal)})-(${plus(now)})`, 0]], b622: { kind: 'diff', a: goal, b: now } }
      });
    }, { standard: COUNT })
  ]);
  function josa622(n) { return B.kit.josa(n, '을/를').slice(String(n).length); }

  // ── 층별로 나타낸 모양 ───────────────────────────────────────
  const FLOORS = ['1층', '2층', '3층'];
  const floorsArt = (h, o) => tiles(layerCounts(h).map((_, i) => layerArt(layerOf(h, i + 1), { said: `${i + 1}층 모양`, u: (o && o.u) || 18 })), FLOORS);
  const inside = (m, big) => m.every((row, r) => row.every((v, c) => !v || big[r][c]));
  const ones = (n) => Array(n).fill(1).join('+');
  // 한 층의 모양 넷: 맞는 것 하나와 틀린 것 셋. first: 먼저 쓸 틀린 모양(다른 층의 모양 따위)
  function fourLayers(d, right, first) {
    const near = nearLayers(right), pool = distinct(first.concat(d.shuffle(near.moved).slice(0, 2), [mirrored(right)], d.shuffle(near.other))).filter((m) => total(m) > 0 && !same(m, right));
    return pool.length >= 3 ? d.shuffle([right].concat(pool.slice(0, 3))) : null;
  }
  // 한 층의 모양에서 한 칸을 옆으로 옮긴 것(moved), 한 칸을 더하거나 뺀 것(other)
  function nearLayers(m) {
    const on = cellsOf(m), off = [], moved = [], other = [], put = (cells) => { const g = m.map((row) => row.map(() => 0)); cells.forEach(([r, c]) => { g[r][c] = 1; }); return g; };
    m.forEach((row, r) => row.forEach((v, c) => { if (!v) off.push([r, c]); }));
    on.forEach((q) => off.forEach((p) => { if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) === 1) moved.push(put(on.filter((x) => x !== q).concat([p]))); }));
    off.forEach((p) => other.push(put(on.concat([p]))));
    if (on.length > 1) on.forEach((q) => other.push(put(on.filter((x) => x !== q))));
    return { moved, other };
  }
  // 3층까지 쌓은 모양(층마다 칸 수가 다르다)
  const tower = (d, ok) => grab(d, { sizes: SQ, cells: [5, 7], peak: [3, 3] }, (s) => { const n = layerCounts(s); return n.length === 3 && n[0] > n[1] && n[1] > n[2] && within(s, 8, 14) && (!ok || ok(s)); });
  Object.assign(K, { floorsArt, inside, fourLayers, tower, FLOORS });

  B.addTypes('6-2-2', 'layers', [
    T('layers-count-pic', '쌓은 모양의 층마다 쌓은 개수', '①33 ②44 ③12 심28', (d) => {
      const h = tower(d, (s) => clear(s) && fixedByTop(s)), n = layerCounts(h);
      return M('쌓기나무로 쌓은 모양과 위에서 본 모양이다. 1층, 2층, 3층에 쌓은 쌓기나무는 각각 몇 개인가?', n.map((v, i) => ({ label: FLOORS[i], answer: v, unit: '개' })), {
        figure: pair(h), explain: `1층에 쌓은 쌓기나무의 수는 위에서 본 모양의 칸 수와 같으므로 ${n[0]}개이다. 2층에는 2층 이상 쌓은 자리마다 1개씩 ${n[1]}개, 3층에는 3층까지 쌓은 자리마다 1개씩 ${n[2]}개가 있다.`,
        facts: { calc: n.map((v, i) => [ones(v), i]), b622: { kind: 'floors', h } }
      });
    }, { standard: COUNT }),
    T('layers-total', '층별 모양으로 개수 구하기', '①35 ②46 ③46 심29', (d) => {
      const h = tower(d), n = layerCounts(h);
      return N('쌓기나무로 쌓은 모양을 층별로 나타낸 것이다. 똑같은 모양으로 쌓는 데 필요한 쌓기나무는 몇 개인가?', total(h), {
        unit: '개', figure: floorsArt(h), explain: `층마다 칸 수를 세어 더한다. ${byLayer(h)}`, facts: { calc: [[n.join('+'), 0]], b622: { kind: 'total', h } }
      });
    }, { standard: COUNT }),
    T('layers-to-nums', '층별 모양을 위에서 본 모양에 수로 나타내기', '①41 ②47 ③48 심31', (d) => {
      const h = tower(d), spots = someCells(d, h, 3);
      return M('쌓기나무로 쌓은 모양을 층별로 나타낸 것이다. 이 모양을 위에서 본 모양의 칸마다 쌓은 쌓기나무의 수를 쓸 때, ㉠, ㉡, ㉢ 자리에 쓸 수는 각각 얼마인가?', spots.map(([r, c], i) => ({ label: MARKS[i], answer: h[r][c] })), {
        figure: floorsArt(h) + tiles([topArt(h, { text: spots.map(([r, c], i) => [r, c, MARKS[i]]), u: 20 })], ['위에서 본 모양']),
        explain: `위에서 본 모양은 1층 모양과 같다. 어느 층까지 칸이 있는지를 자리마다 본다. ${spots.map(([r, c], i) => `${MARKS[i]} 자리는 ${h[r][c]}층까지 칸이 있으므로 ${h[r][c]}`).join(', ')}이다.`,
        facts: { calc: spots.map(([r, c], i) => [String(h[r][c]), i]), b622: { kind: 'read', h, spots } }
      });
    }),
    T('layers-pick-pic', '층별 모양에 맞는 쌓은 모양 고르기', '①37 ②49 ③47 심30', (d) => {
      const made = d.until(() => { const h = tower(d, (s) => K.open(s) && fixedIfShown(s)), list = fourPiles(d, h); return list ? { h, list } : null; }, Boolean), { h, list } = made;
      return pickTile(`쌓기나무로 쌓은 모양을 층별로 나타낸 것이다. 가, 나, 다, 라 가운데 이 모양은? ${HIDDEN_NONE}`, list.map((g) => same(g, h)), {
        figure: floorsArt(h) + tiles(list.map((g) => stackArt(g, { u: 16 }))),
        explain: list.map((g, i) => { if (same(g, h)) return ''; const [r, c] = cellsOf(h).find((q) => g[q[0]][q[1]] !== h[q[0]][q[1]]); return `${TAGS[i]}는 ${where(h, r, c)}에 ${g[r][c]}층까지 쌓았는데 층별 모양에서는 ${h[r][c]}층까지 칸이 있다. `; }).join('') + `층마다 모양이 모두 맞는 것은 ${TAGS[list.findIndex((g) => same(g, h))]}이다.`,
        facts: { b622: { kind: 'pickSame', h, list } }
      });
    }),
    T('layers-of-pic', '쌓은 모양의 한 층 모양 고르기', '①34 ②43 ③42·43·44', (d) => {
      const made = d.until(() => { const h = tower(d, (s) => clear(s) && fixedByTop(s)), k = d.pick([2, 3]), list = fourLayers(d, layerOf(h, k), [layerOf(h, k === 2 ? 3 : 2), layerOf(h, 1)]); return list ? { h, k, list } : null; }, Boolean), { h, k, list } = made;
      return pickTile(`쌓기나무로 쌓은 모양과 위에서 본 모양이다. 이 모양의 ${k}층 모양은?`, list.map((m) => same(m, layerOf(h, k))), {
        figure: pair(h) + tiles(list.map((m) => layerArt(m))), explain: `${k}층에는 ${k}층 이상 쌓은 자리에만 쌓기나무가 있다. 위에서 본 모양의 칸마다 쌓은 수를 쓰면 ${rowsSaid(h)}이고, 이 가운데 ${k} 이상인 자리를 찾는다.`,
        facts: { b622: { kind: 'layerPick', h, k, list } }
      });
    }),
    T('layers-order', '섞여 있는 층 모양의 차례', '①38 ③44 심33', (d) => {
      const h = tower(d), order = d.shuffle([0, 1, 2]), right = [0, 1, 2].map((k) => TAGS[order.indexOf(k)]).join(', ');
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => TAGS[i]).join(', ')), options = d.shuffle([right].concat(d.shuffle(perms.filter((p) => p !== right)).slice(0, 3)));
      return C('쌓기나무로 3층까지 쌓은 모양의 1층, 2층, 3층 모양을 섞어 놓은 것이다. 1층, 2층, 3층 모양을 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: tiles(order.map((k) => layerArt(layerOf(h, k + 1)))), explain: `위층의 쌓기나무는 아래층의 쌓기나무 위에만 놓이므로, 위층의 칸은 모두 아래층에도 있다. 칸이 가장 많은 ${TAGS[order.indexOf(0)]}가 1층, 그 안에 들어가는 ${TAGS[order.indexOf(1)]}가 2층, 다시 그 안에 들어가는 ${TAGS[order.indexOf(2)]}가 3층이다.`,
        facts: { truth: options.map((o) => o === right), want: true, b622: { kind: 'floorOrder', shown: order.map((k) => layerOf(h, k + 1)), options } }
      });
    }),
    T('layers-fit', '아래층 모양 위에 쌓을 수 있는 층 모양', '①38 ②50 ③45 심33', (d, n) => {
      // 위층의 칸은 아래층의 칸 위에만 놓인다. 틀린 모양은 칸 수가 맞는 것과 같아서 칸 수로는 가릴 수 없다.
      const foot = d.until(() => { const m = Array.from({ length: 3 }, () => [0, 0, 0]); K.footprint(d, 3, 3, d.int(5, 7)).forEach(([r, c]) => { m[r][c] = 1; }); return m; }, Boolean), on = cellsOf(foot), off = [];
      foot.forEach((row, r) => row.forEach((v, c) => { if (!v) off.push([r, c]); }));
      const shape = (cells) => { const m = Array.from({ length: 3 }, () => [0, 0, 0]); cells.forEach(([r, c]) => { m[r][c] = 1; }); return m; };
      if (n === 0) {
        const size = d.int(3, 4), good = () => shape(d.shuffle(on).slice(0, size)), bad = shape(d.shuffle(on).slice(0, size - 1).concat([d.pick(off)]));
        const list = d.until(() => d.shuffle([good(), good(), good(), bad]), (four) => distinct(four).length === 4), flags = list.map((m) => !inside(m, foot)), at = flags.indexOf(true), [r, c] = cellsOf(list[at]).find((q) => !foot[q[0]][q[1]]);
        return pickTile('쌓기나무로 쌓은 모양의 1층 모양이다. 가, 나, 다, 라 가운데 이 모양의 2층 모양이 될 수 없는 것은?', flags, {
          figure: tiles([layerArt(foot, { said: '1층 모양', u: 20 })], ['1층']) + tiles(list.map((m) => layerArt(m))), explain: `2층의 쌓기나무는 1층의 쌓기나무 위에만 놓인다. ${TAGS[at]}는 ${where(foot, r, c)}에 쌓기나무가 있는데 1층의 그 자리에는 쌓기나무가 없다.`,
          facts: { b622: { kind: 'fit', low: foot, high: null, list, want: false } }
        });
      }
      const made = d.until(() => {
        const third = shape(d.shuffle(on).slice(0, d.int(1, 2))), core = cellsOf(third), rest = on.filter((q) => !third[q[0]][q[1]]), extra = d.int(1, 2);
        if (rest.length < extra + 1) return null;
        const good = shape(core.concat(d.shuffle(rest).slice(0, extra)));
        const miss = shape(core.slice(1).concat(d.shuffle(rest).slice(0, extra + 1)));                       // 3층의 칸 하나 밑에 쌓기나무가 없다
        const out = shape(core.concat(d.shuffle(rest).slice(0, extra - 1), [d.pick(off)]));                  // 1층에 없는 자리에 쌓기나무가 있다
        const miss2 = shape(d.shuffle(rest).slice(0, core.length + extra));                                  // 3층의 칸 밑이 모두 비었다
        const list = d.shuffle([good, miss, out, miss2]);
        return rest.length >= core.length + extra && distinct(list).length === 4 ? { third, list } : null;
      }, Boolean), { third, list } = made, ok = (m) => inside(third, m) && inside(m, foot), flags = list.map(ok);
      return pickTile('쌓기나무로 3층까지 쌓은 모양의 1층과 3층 모양이다. 가, 나, 다, 라 가운데 이 모양의 2층 모양이 될 수 있는 것은?', flags, {
        figure: tiles([layerArt(foot, { said: '1층 모양' }), layerArt(third, { said: '3층 모양' })], ['1층', '3층']) + tiles(list.map((m) => layerArt(m))),
        explain: '2층의 쌓기나무는 1층의 쌓기나무 위에만 놓이고, 3층의 쌓기나무 밑에는 2층의 쌓기나무가 꼭 있어야 한다. ' + list.map((m, i) => (flags[i] ? '' : `${TAGS[i]}는 ${!inside(m, foot) ? '1층에 쌓기나무가 없는 자리에 칸이 있다' : '3층 쌓기나무의 밑에 칸이 없는 자리가 있다'}. `)).join('') + `될 수 있는 것은 ${TAGS[flags.indexOf(true)]}이다.`,
        facts: { b622: { kind: 'fit', low: foot, high: third, list, want: true } }
      });
    }, { count: 2 }),
    T('nums-to-layer', '쓴 수로 한 층의 모양 고르기', '①41 ②41 ③40 심31', (d) => {
      const made = d.until(() => { const h = tower(d), k = d.pick([2, 3]), list = fourLayers(d, layerOf(h, k), [layerOf(h, k === 2 ? 3 : 2), layerOf(h, 1)]); return list ? { h, k, list } : null; }, Boolean), { h, k, list } = made;
      return pickTile(`${WROTE} 이 모양의 ${k}층 모양은?`, list.map((m) => same(m, layerOf(h, k))), {
        figure: numArt(h) + tiles(list.map((m) => layerArt(m))), explain: `${k}층에는 ${k} 이상인 수를 쓴 자리에만 쌓기나무가 있다. ${k} 이상인 수를 쓴 칸만 색칠한 모양을 찾는다.`,
        facts: { b622: { kind: 'layerPick', h, k, list } }
      });
    })
  ]);

  // ── 쌓기나무를 붙여 만든 모양 ────────────────────────────────
  // 모양은 쌓기나무의 자리 [x, y, z] 들이다. 돌리는 방법은 24가지(축을 바꾸고 방향을 뒤집되, 거울에 비친 모양이 되는 것은 뺀다).
  const ROT = [];
  [[0, 1, 2, 1], [1, 2, 0, 1], [2, 0, 1, 1], [0, 2, 1, -1], [1, 0, 2, -1], [2, 1, 0, -1]].forEach(([a, b, c, par]) => {
    for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) if (par * sx * sy * sz === 1) ROT.push((p) => [sx * p[a], sy * p[b], sz * p[c]]);
  });
  // 가장 작은 좌표가 0이 되게 옮기고 차례를 맞춘다.
  const settle = (cells) => { const lo = [0, 1, 2].map((i) => Math.min(...cells.map((p) => p[i]))); return cells.map((p) => p.map((v, i) => v - lo[i])).sort((p, q) => p[0] - q[0] || p[1] - q[1] || p[2] - q[2]); };
  const keyOf = (cells) => settle(cells).map((p) => p.join('')).join(' ');
  // 돌려서 나오는 모양 전부(같은 것은 한 번만)
  const turnsMemo = new Map();
  function turns(cells) {
    const id = keyOf(cells);
    if (!turnsMemo.has(id)) { const seen = new Map(); ROT.forEach((f) => { const s = settle(cells.map(f)); seen.set(keyOf(s), s); }); turnsMemo.set(id, [...seen.values()]); }
    return turnsMemo.get(id);
  }
  // 돌리거나 뒤집어 같은 모양이면 같은 이름이 나온다.
  const freeKey = (cells) => turns(cells).map(keyOf).sort()[0];
  const flipped = (cells) => cells.map(([x, y, z]) => [-x, y, z]);
  // 바닥부터 빈틈없이 쌓인 모양이면 높이 표로 바꾼다(아니면 null). 높이 표의 차례: 뒷줄부터, 왼쪽부터.
  function toPile(cells) {
    const s = settle(cells), X = Math.max(...s.map((p) => p[0])) + 1, Y = Math.max(...s.map((p) => p[1])) + 1, cols = {}, h = Array.from({ length: Y }, () => Array(X).fill(0));
    s.forEach(([x, y, z]) => { (cols[x + ',' + y] = cols[x + ',' + y] || []).push(z); });
    for (const key of Object.keys(cols)) { const zs = cols[key].sort((a, b) => a - b), [x, y] = key.split(',').map(Number); if (zs.some((z, i) => z !== i)) return null; h[Y - 1 - y][x] = zs.length; }
    return h;
  }
  const toCells = (h) => K.cubesOf(h).map((c) => [c.x, c.y, c.z]);
  // 그림으로 그릴 수 있는 놓음새: 바닥부터 쌓인 모양이고, 쌓기나무마다 윗면이 보이며, 쌓기나무의 수를 알면 그림이 하나로 읽힌다.
  const posesMemo = new Map();
  function poses(cells) {
    const id = freeKey(cells);
    if (!posesMemo.has(id)) posesMemo.set(id, turns(cells).map(toPile).filter((h) => h && h.length <= 4 && h[0].length <= 4 && clear(h) && fixedByCount(h)));
    return posesMemo.get(id);
  }
  // 쌓기나무 4개로 만들 수 있는 여덟 가지 모양, 3개로 만들 수 있는 두 가지 모양
  const FOUR = {
    bar: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]], ell: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0]], tee: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0]], zig: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [2, 1, 0]],
    box: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]], peg: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]], twist: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]], twist2: [[0, 0, 0], [-1, 0, 0], [-1, 1, 0], [-1, 1, 1]]
  };
  const THREE = { bar: [[0, 0, 0], [1, 0, 0], [2, 0, 0]], ell: [[0, 0, 0], [1, 0, 0], [0, 1, 0]] };
  const FOUR_NAMES = Object.keys(FOUR);
  const pieceArt = (h, o) => stackArt(h, Object.assign({ u: 16, arrows: false, said: '쌓기나무를 붙여 만든 모양' }, o || {}));
  // 작은 모양(small)에 쌓기나무를 더 붙여 큰 모양(big)을 만들 수 있는가: 작은 모양을 돌려 큰 모양 안에 꼭 맞게 놓을 수 있는가
  function grows(small, big) {
    const set = new Set(big.map((p) => p.join()));
    return turns(small).some((v) => big.some((t) => v.every((p) => set.has([p[0] - v[0][0] + t[0], p[1] - v[0][1] + t[1], p[2] - v[0][2] + t[2]].join()))));
  }
  // 모양(cells)을 두 모양 a, b 로 나눌 수 있는가. 나눌 수 있으면 a 가 놓인 자리들을 돌려준다.
  function splits(cells, a, b) {
    const set = new Set(cells.map((p) => p.join())), want = new Set(turns(b).map(keyOf));
    for (const v of turns(a)) for (const t of cells) {
      const placed = v.map((p) => [p[0] - v[0][0] + t[0], p[1] - v[0][1] + t[1], p[2] - v[0][2] + t[2]]);
      if (!placed.every((p) => set.has(p.join()))) continue;
      const used = new Set(placed.map((p) => p.join())), rest = cells.filter((p) => !used.has(p.join()));
      if (rest.length === b.length && want.has(keyOf(rest))) return placed;
    }
    return null;
  }
  // 두 모양을 면끼리 닿게 붙여 만든 모양 하나(높이 표). 가로 4칸·세로 3칸·높이 2층 안이고 그림이 하나로 읽힌다.
  function joinTwo(d, a, b) {
    return d.until(() => {
      // 한 조각의 쌓기나무 하나와 다른 조각의 쌓기나무 하나가 면으로 닿게 옮겨 놓는다.
      const p = d.pick(turns(a)), q0 = d.pick(turns(b)), at = d.pick(p), from = d.pick(q0), way = d.pick([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]);
      const q = q0.map((c) => c.map((v, i) => v + at[i] + way[i] - from[i])), all = p.concat(q);
      if (new Set(all.map((c) => c.join())).size !== all.length) return null;
      const h = toPile(all);
      return h && h.length <= 3 && h[0].length <= 4 && peak(h) <= 2 && sight(h).tops >= 1 && fixedByCount(h) ? h : null;
    }, Boolean);
  }
  // 붙여 만든 모양에서 한 조각이 놓인 자리를 색칠한 그림(풀이에 쓴다)
  const splitArt = (h, placed) => { const R = h.length; return stackArt(h, { u: 16, arrows: false, tint: placed.map(([x, y, z]) => [R - 1 - y, x, z]), said: '붙여 만든 모양(한 조각이 놓인 자리를 색칠했다)' }); };
  Object.assign(K, { ROT, settle, keyOf, turns, freeKey, flipped, toPile, toCells, poses, FOUR, THREE, FOUR_NAMES, pieceArt, grows, splits, joinTwo, splitArt });

  B.addTypes('6-2-2', 'make', [
    T('make-same', '돌리거나 뒤집어 같은 모양 찾기', '①66 ②55 ③52', (d) => {
      // 거울에 비친 짝(twist 와 twist2)은 함께 쓰지 않는다(그 둘을 가리는 문제는 실력에 있다).
      const name = d.pick(FOUR_NAMES.filter((x) => x !== 'bar' && x !== 'box')), others = d.shuffle(FOUR_NAMES.filter((x) => x !== name && !(name.startsWith('twist') && x.startsWith('twist')))).slice(0, 3), mine = d.shuffle(poses(FOUR[name]));
      const list = d.shuffle([mine[1]].concat(others.map((x) => d.pick(poses(FOUR[x]))))), flags = list.map((h) => freeKey(toCells(h)) === freeKey(toCells(mine[0])));
      return pickTile('쌓기나무 4개를 붙여 만든 모양이다. 가, 나, 다, 라 가운데 돌리거나 뒤집었을 때 이 모양과 같은 모양이 되는 것은?', flags, {
        figure: tiles([pieceArt(mine[0], { u: 20 })], ['만든 모양']) + tiles(list.map((h) => pieceArt(h))), explain: `${TAGS[flags.indexOf(true)]}를 돌리거나 뒤집으면 처음 모양과 꼭 같아진다. 나머지는 쌓기나무가 이어진 차례가 달라서 어떻게 돌려도 같아지지 않는다.`,
        facts: { b622: { kind: 'sameShape', target: mine[0], list } }
      });
    }),
    T('make-add', '쌓기나무 1개를 더 붙여 만들 수 있는 모양', '②53 ③53 심56', (d, n) => {
      if (n === 1) {
        const base = d.pick(poses(THREE.ell)), list = d.shuffle(['bar'].concat(d.shuffle(['ell', 'tee', 'zig', 'box', 'peg', 'twist', 'twist2']).slice(0, 3))).map((x) => d.pick(poses(FOUR[x]))), flags = list.map((h) => !grows(toCells(base), toCells(h)));
        return pickTile('쌓기나무 3개를 붙여 만든 모양에 쌓기나무 1개를 더 붙이려고 한다. 가, 나, 다, 라 가운데 만들 수 없는 모양은?', flags, {
          figure: tiles([pieceArt(base, { u: 20 })], ['처음 모양']) + tiles(list.map((h) => pieceArt(h))), explain: `처음 모양은 쌓기나무 3개가 꺾여서 이어져 있다. ${TAGS[flags.indexOf(true)]}는 쌓기나무 4개가 한 줄로 곧게 이어져 있어서, 어느 1개를 빼도 꺾인 모양이 남지 않는다. 나머지는 쌓기나무 1개를 빼면 처음 모양이 남는다.`,
          facts: { b622: { kind: 'grow', base, list, want: false } }
        });
      }
      const base = d.pick(poses(THREE.bar).filter((h) => peak(h) === 1)), yes = d.shuffle(['bar', 'ell', 'tee']).slice(0, 2), no = d.shuffle(['zig', 'box', 'peg', 'twist', 'twist2']).slice(0, 2);
      const list = d.shuffle(yes.concat(no)).map((x) => d.pick(poses(FOUR[x]))), flags = list.map((h) => grows(toCells(base), toCells(h))), labels = TAGS.slice(0, 4), made = setOptions(d, labels, flags);
      return C('쌓기나무 3개를 한 줄로 붙여 만든 모양에 쌓기나무 1개를 더 붙이려고 한다. 가, 나, 다, 라 가운데 만들 수 있는 모양을 모두 고른 것은?', made.options, made.answer, {
        figure: tiles([pieceArt(base, { u: 20 })], ['처음 모양']) + tiles(list.map((h) => pieceArt(h))), explain: `만들 수 있는 모양에는 쌓기나무 3개가 한 줄로 곧게 이어진 곳이 있다. ${labels.filter((_, i) => flags[i]).join(', ')}에는 그런 곳이 있고, ${labels.filter((_, i) => !flags[i]).join(', ')}에는 없다.`,
        facts: { sets: { labels, flags, options: made.sets }, b622: { kind: 'grow', base, list, want: true } }
      });
    }, { count: 2 }),
    T('make-two', '두 가지 모양을 붙여 만든 모양', '①67 ②57 ③55 심57', (d, n) => {
      const made = d.until(() => {
        const [a, b, c] = d.shuffle(FOUR_NAMES.filter((x) => x !== 'bar')).slice(0, 3), A = FOUR[a], Bb = FOUR[b], yes = () => joinTwo(d, A, Bb), no = () => d.until(() => joinTwo(d, d.pick([A, Bb]), FOUR[c]), (h) => !splits(toCells(h), A, Bb));
        const list = d.shuffle(n === 0 ? [yes(), no(), no(), no()] : [yes(), yes(), yes(), no()]);
        return distinct(list).length === 4 && new Set(list.map((h) => freeKey(toCells(h)))).size === 4 ? { A, Bb, list } : null;
      }, Boolean), { A, Bb, list } = made, can = list.map((h) => Boolean(splits(toCells(h), A, Bb))), flags = can.map((x) => x === (n === 0)), at = flags.indexOf(true);
      const shown = n === 0 ? at : can.indexOf(true);
      return pickTile(`쌓기나무 4개를 붙여 만든 두 가지 모양 ㉠, ㉡이 있다. 가, 나, 다, 라 가운데 ㉠과 ㉡을 붙여서 ${n === 0 ? '만들 수 있는' : '만들 수 없는'} 모양은?`, flags, {
        figure: tiles([pieceArt(d.pick(poses(A)), { u: 18 }), pieceArt(d.pick(poses(Bb)), { u: 18 })], MARKS) + tiles(list.map((h) => pieceArt(h))),
        explain: (n === 0 ? `${TAGS[at]}는 아래 그림처럼 색칠한 곳에 ㉠을, 나머지에 ㉡을 놓아 만들 수 있다. 다른 모양은 ㉠을 어떻게 놓아도 남는 곳이 ㉡ 모양이 되지 않는다.` : `${TAGS[at]}는 ㉠을 어떻게 놓아도 남는 곳이 ㉡ 모양이 되지 않는다. 나머지는 만들 수 있다. 아래 그림은 ${TAGS[shown]}에서 ㉠이 놓인 곳을 색칠한 것이다.`) + '<div style="margin-top:6px">' + splitArt(list[shown], splits(toCells(list[shown]), A, Bb)) + '</div>',
        facts: { b622: { kind: 'twoPieces', a: A, b: Bb, list, want: n === 0 } }
      });
    }, { count: 2 }),
    T('make-used', '새로운 모양을 만드는 데 사용한 두 가지 모양', '②58 ③56', (d) => {
      const pairs = [[0, 1], [0, 2], [1, 2]], made = d.until(() => {
        const three = d.shuffle(FOUR_NAMES.filter((x) => x !== 'bar')).slice(0, 3).map((x) => FOUR[x]), k = d.int(0, 2), h = joinTwo(d, three[pairs[k][0]], three[pairs[k][1]]);
        const flags = pairs.map(([i, j]) => Boolean(splits(toCells(h), three[i], three[j])));
        return flags.filter(Boolean).length === 1 ? { three, h, flags } : null;
      }, Boolean), { three, h, flags } = made, at = flags.indexOf(true), options = pairs.map(([i, j]) => `${TAGS[i]}와 ${TAGS[j]}`);
      return C('쌓기나무 4개를 붙여 만든 세 가지 모양 가, 나, 다 가운데 두 가지를 붙여서 새로운 모양을 만들었다. 사용한 두 가지 모양은?', options, at, {
        figure: tiles(three.map((x) => pieceArt(d.pick(poses(x))))) + tiles([pieceArt(h, { u: 18 })], ['새로운 모양']),
        explain: `새로운 모양은 아래 그림처럼 색칠한 곳에 ${TAGS[pairs[at][0]]}를, 나머지에 ${TAGS[pairs[at][1]]}를 놓아 만든 것이다. 다른 두 가지로는 어떻게 놓아도 이 모양이 되지 않는다.` + '<div style="margin-top:6px">' + splitArt(h, splits(toCells(h), three[pairs[at][0]], three[pairs[at][1]])) + '</div>',
        facts: { truth: flags, want: true, b622: { kind: 'usedPieces', three, h } }
      });
    })
  ]);

  // ── 꼴 목록을 다시 대조해 보탠 기본 문항 ─────────────────────
  B.addTypes('6-2-2', 'nums', [
    T('nums-odd-view', '옆에서 본 모양이 다른 것 찾기', '①46 ②38 ③38', (d) => {
      // 셋은 옆에서 본 모양이 같고 하나만 한 줄이 한 층 다르다. 위에서 본 모양과 쓴 수는 넷이 모두 다르다.
      const S = d.until(() => [d.int(1, 3), d.int(1, 3), d.int(1, 3)], (v) => Math.max(...v) >= 2 && new Set(v).size > 1), odd = d.pick(K.oneOff(S, 3));
      const one = (side) => d.until(() => K.built(d, { side, cols: 3, cells: [5, 7] }), Boolean), list = d.until(() => d.shuffle([one(S), one(S), one(S), one(odd)]), (four) => distinct(four).length === 4);
      const flags = list.map((h) => list.filter((g) => same(sideOf(g), sideOf(h))).length === 1), at = flags.indexOf(true);
      return pickTile('위에서 본 모양에 쌓은 쌓기나무의 수를 쓴 것이다. 가, 나, 다, 라 가운데 옆에서 본 모양이 나머지 셋과 다른 것은?', flags, {
        figure: tiles(list.map((h) => numArt(h, { u: 20 }))),
        explain: `옆에서 보면 가로줄마다 가장 큰 수만큼의 층이 보이고, 앞줄이 왼쪽에 보인다. ${TAGS[at]}는 가로줄마다 가장 큰 수가 앞줄부터 ${sideOf(list[at]).join(', ')}이고, 나머지 셋은 모두 앞줄부터 ${S.join(', ')}이다.`,
        facts: { b622: { kind: 'oddSide', list } }
      });
    })
  ]);
  B.addTypes('6-2-2', 'layers', [
    T('layers-more', '층별 모양으로 두 모양의 개수 비교', '①40 심29', (d) => {
      // 1층의 칸 수는 나가 더 많지만 쌓기나무는 가가 더 많다(1층만 보고 답하지 못한다).
      const made = d.until(() => { const a = tower(d), b = tower(d); return total(a) > total(b) && total(a) - total(b) <= 3 && layerCounts(a)[0] < layerCounts(b)[0] ? { a, b } : null; }, Boolean), { a, b } = made, na = layerCounts(a), nb = layerCounts(b);
      const names = (who) => FLOORS.map((f) => `${who}의 ${f}`);
      return N('쌓기나무로 쌓은 두 모양 가와 나를 층별로 나타낸 것이다. 가는 나보다 쌓기나무를 몇 개 더 많이 사용하였는가?', total(a) - total(b), {
        unit: '개', figure: tiles(na.map((_, i) => layerArt(layerOf(a, i + 1), { said: `가의 ${i + 1}층 모양`, u: 16 })), names('가')) + tiles(nb.map((_, i) => layerArt(layerOf(b, i + 1), { said: `나의 ${i + 1}층 모양`, u: 16 })), names('나')),
        explain: `층마다 칸 수를 세어 더한다. 가는 ${na.join(' + ')} = ${total(a)}(개), 나는 ${nb.join(' + ')} = ${total(b)}(개)이다. 가가 ${total(a)} − ${total(b)} = ${total(a) - total(b)}(개) 더 많이 사용하였다.`,
        facts: { calc: [[`(${na.join('+')})-(${nb.join('+')})`, 0]], b622: { kind: 'diff', a, b } }
      });
    }, { standard: COUNT })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
