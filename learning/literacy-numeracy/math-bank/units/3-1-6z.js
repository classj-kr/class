// 아이스크림 2022 수학 3-1 「생각을 더하다」 대조 후 보충.
// 원문 문장·그림을 복제하지 않고, 빠진 조건과 풀이 구조를 새 수·상황의 단답형으로 옮겼다.
(function (root) {
  'use strict';
  const B = root.MathBank, { N, M, F, table } = B.kit;
  const add = (unit, id, title, pages, make) => B.addTypes(unit, 'hard', [{ id: 'ic-' + id, title, level: '실력', source: '아이스크림 수학 3-1 생각을 더하다 ' + pages + '쪽 — 구조 변형', make(d) {
    const item = make(d); if (item.fraction && Number(unit.split('-')[0]) >= 4) item.anyForm = true; if (item.figure) item.figure = `<div class="mb-iscream">${item.figure}</div>`; item.facts.iscream = { book: '3-1', pages, kind: id, ...item.facts.iscream }; return item;
  } }]);
  add('3-1-1', 'avatar-budget', '종류별로 하나씩 골라 예산 안에서 남는 양 줄이기', '28-29', d => {
    const budget = d.int(85, 99) * 10, chosen = [d.int(12, 18) * 10, d.int(18, 24) * 10, d.int(15, 21) * 10];
    const costs = [190, 250, 310, 370], spent = chosen.reduce((a, b) => a + b, 0), eligible = costs.filter(v => spent + v <= budget), best = Math.max(...eligible);
    return N(`게임에서 머리, 상의, 하의, 장식품을 하나씩 사려고 한다. 보석은 ${budget}개이고 머리, 상의, 하의는 표와 같이 골랐다. 장식품까지 사고 남는 보석이 가장 적게 되도록 고를 때, 남는 보석은 몇 개인가?`, budget - spent - best, {
      unit: '개', figure: table(['종류', '필요한 보석(개)'], [['머리', chosen[0]], ['상의', chosen[1]], ['하의', chosen[2]], ...costs.map((v, i) => ['장식품 ' + (i + 1), v])]),
      explain: `세 가지에 필요한 보석은 ${chosen.join(' + ')} = ${spent}개이다. 남은 ${budget - spent}개 안에서 가장 비싼 장식품은 보석 ${best}개가 필요하므로 ${budget} − ${spent} − ${best} = ${budget - spent - best}개가 남는다.`,
      facts: { iscream: { budget, chosen, costs } }
    });
  });
  // 간격의 수는 물체의 수보다 하나 적다. 원문에서 빠져 있던 핵심 조건이다.
  add('3-1-4', 'cones-gap', '양 끝을 포함한 물체의 수에서 간격의 수 구하기', '92-93', d => {
    const n = d.int(5, 9), gap = d.int(4, 8) * 10 + d.pick([0, 5]);
    return N(`운동장에 표지판 ${n}개를 ${gap} cm 간격으로 한 줄로 세웠다. 첫째 표지판에서 마지막 표지판까지의 거리는 몇 cm인가? (표지판의 너비는 생각하지 않는다.)`, (n - 1) * gap, {
      unit: 'cm', explain: `표지판 사이의 간격은 ${n} − 1 = ${n - 1}개이다. 거리는 ${gap} × ${n - 1} = ${(n - 1) * gap}(cm)이다.`, facts: { calc: [[`(${n}-1)*${gap}`, 0]], unseen: [1], iscream: { n, gap } }
    });
  });
  add('3-1-5', 'trip-schedule', '여러 체험 시간과 이동 시간을 합쳐 돌아올 시각 구하기', '114-115', d => {
    const start = d.int(9, 10), times = [d.int(12, 18) * 60 + 30, d.int(20, 28) * 60, d.int(16, 23) * 60 + 30], move = d.int(3, 6), total = times.reduce((a, b) => a + b, 0) + 4 * move * 60, end = start * 3600 + total;
    return M(`오전 ${start}시에 만남의 장소에서 출발하여 과학관, 방송실, 소방 체험실을 차례로 방문한 뒤 만남의 장소로 돌아온다. 각 장소 사이를 이동하는 데 ${move}분씩 걸린다. 기다리는 시간 없이 모두 체험하고 돌아올 시각은 오전 몇 시 몇 분인가?`, [{ label: '시', answer: Math.floor(end / 3600) }, { label: '분', answer: Math.floor(end % 3600 / 60) }], {
      figure: table(['체험', '걸리는 시간'], [['과학관', Math.floor(times[0] / 60) + '분 30초'], ['방송실', Math.floor(times[1] / 60) + '분'], ['소방 체험실', Math.floor(times[2] / 60) + '분 30초']]),
      explain: `체험 시간은 모두 ${times.reduce((a, b) => a + b, 0) / 60}분이고, 이동은 4번이므로 ${move * 4}분이다. 오전 ${start}시에서 모두 ${total / 60}분 뒤인 오전 ${Math.floor(end / 3600)}시 ${Math.floor(end % 3600 / 60)}분에 돌아온다.`, facts: { iscream: { start, times, move } }
    });
  });
  // L 모양의 렙타일. 한 조각의 경계를 단서로 나머지 분할을 복원한다.
  const cellKey = ([x, y]) => x + ',' + y;
  function refine(piece) {
    const cells = piece.flatMap(([x, y]) => [[x * 2, y * 2], [x * 2 + 1, y * 2], [x * 2, y * 2 + 1], [x * 2 + 1, y * 2 + 1]]), has = new Set(cells.map(cellKey)), candidates = [];
    for (const [x, y] of cells) for (let missing = 0; missing < 4; missing++) {
      const tile = [[x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]].filter((_, i) => i !== missing);
      if (tile.every(c => has.has(cellKey(c)))) candidates.push(tile);
    }
    const cover = (left, result) => {
      if (!left.size) return result;
      const first = left.values().next().value;
      for (const tile of candidates) if (tile.some(c => cellKey(c) === first) && tile.every(c => left.has(cellKey(c)))) {
        const next = new Set(left); tile.forEach(c => next.delete(cellKey(c))); const answer = cover(next, result.concat([tile])); if (answer) return answer;
      }
      return null;
    };
    const result = cover(has, []); if (!result) throw new Error('L 조각의 같은 모양 분할에 실패했다'); return result;
  }
  function outline(cells, size) {
    const has = new Set(cells.map(cellKey)); let path = '';
    for (const [x, y] of cells) for (const [dx, dy, a, b, c, e] of [[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]]) if (!has.has(cellKey([x + dx, y + dy]))) path += `M${12 + (x + a) * size} ${12 + (y + b) * size}L${12 + (x + c) * size} ${12 + (y + e) * size}`;
    return path;
  }
  add('3-1-6', 'nested-parts', '같은 모양의 조각으로 나눌 경계를 복원하여 분수 구하기', '142-143', d => {
    const depth = d.int(1, 2); let pieces = [[[0,0],[1,0],[0,1]]];
    for (let n = 0; n < depth; n++) pieces = pieces.flatMap(refine);
    pieces = d.shuffle(pieces); const colored = d.pick(depth === 1 ? [1, 3] : [1, 3, 5, 7]), size = depth === 1 ? 30 : 18, edge = size * (2 ** (depth + 1)) + 24;
    const fills = pieces.slice(0, colored).flatMap(p => p.map(([x, y]) => `<rect x="${12 + x * size}" y="${12 + y * size}" width="${size}" height="${size}" fill="#93c5fd"/>`)).join('');
    const figure = `<svg class="mb-geo" viewBox="0 0 ${edge} ${edge}" width="220" role="img" aria-label="큰 L 모양과 모양이 같은 작은 L 조각 ${colored}개를 색칠하고, 나머지 부분에는 나눈 선을 생략한 그림">${fills}<path d="${outline(pieces.flat(), size)}" fill="none" stroke="#334155" stroke-width="2"/>${pieces.slice(0, colored).map(p => `<path d="${outline(p, size)}" fill="none" stroke="#1d4ed8" stroke-width="1.3"/>`).join('')}</svg>`;
    return F('그림의 색칠한 조각들은 모양과 크기가 같고, 큰 모양과도 모양이 같다. 돌려 놓아도 된다. 나머지도 색칠한 조각과 모양과 크기가 같은 조각으로 빈틈없이 나눌 때, 색칠한 부분은 전체의 얼마인가? (나머지 부분의 나눈 선은 생략하였다.)', colored, pieces.length, {
      figure, explain: `같은 L 모양 조각으로 나누어 보면 전체는 ${pieces.length}조각이다. 그중 ${colored}조각을 색칠하였으므로 ${colored}/${pieces.length}이다.`, facts: { iscream: { pieces, colored, depth } }
    });
  });
  // 회차의 구성 변경으로 예전 체크포인트를 새 회차에 섞지 않는다.
  for (const id of ["3-1-1","3-1-4","3-1-5","3-1-6"]) { const u = B.findUnit(id); u.version = (u.version || 1) + 1; }
})(typeof window !== 'undefined' ? window : globalThis);
