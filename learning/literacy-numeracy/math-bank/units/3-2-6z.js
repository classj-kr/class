// 아이스크림 3-2 「생각을 더하다」의 빠진 문제 구조. 6단원 뒤에서 학기 전체에 보탠다.
(function (root) {
  'use strict';
  const B = root.MathBank, { N, M, table, frac } = B.kit;
  const add = (unit, id, title, pages, make) => B.addTypes(unit, 'hard', [{ id: 'ic-' + id, title, level: '실력', source: '아이스크림 수학 3-2 생각을 더하다 ' + pages + '쪽 — 구조 변형', make(d) {
    const item = make(d); if (item.fraction && Number(unit.split('-')[0]) >= 4) item.anyForm = true; if (item.figure) item.figure = `<div class="mb-iscream">${item.figure}</div>`; item.facts.iscream = { book: '3-2', pages, kind: id, ...item.facts.iscream }; return item;
  } }]);
  const board = () => '<div class="mb-ic-board">' + table(['줄', '1', '2', '3', '4', '5', '6', '7', '8'], Array.from({ length: 8 }, (_, y) => [y + 1, ...Array.from({ length: 8 }, (_, x) => y * 8 + x + 1)])) + '</div>';
  add('3-2-2', 'robot-route', '몫과 나머지를 이동 규칙에 적용하기', '56-57', d => {
    const divisor = d.int(4, 8), q = d.int(2, 5), r = d.int(1, divisor - 1), a = divisor * q + r, x = 8 - r, y = q + 1;
    return N(`로봇이 표의 맨 위 오른쪽 칸에서 출발한다. ${a} ÷ ${divisor}의 몫만큼 아래로, 나머지만큼 왼쪽으로 움직인다. 도착한 칸에 적힌 수는?`, (y - 1) * 8 + x, {
      figure: board(), explain: `${a} ÷ ${divisor}의 몫은 ${q}, 나머지는 ${r}이다. 아래로 ${q}칸, 왼쪽으로 ${r}칸 움직이면 ${y}번째 줄의 ${x}번째 칸인 ${(y - 1) * 8 + x}에 도착한다.`, facts: { iscream: { a, divisor, width: 8, start: [8, 1], delta: [-r, q] } }
    });
  });
  add('3-2-2', 'robot-correct', '나머지 조건을 바로잡은 뒤 이동하기', '56-57', d => {
    const divisor = d.int(4, 7), q = d.int(2, 5), r = d.int(1, divisor - 1), a = divisor * q + r;
    return N(`로봇은 나눗셈의 몫과 나머지가 모두 맞을 때만 움직인다. ${a} ÷ ${divisor}의 몫을 ${q - 1}, 나머지를 ${B.kit.josa(divisor + r, '으로/로')} 입력하여 움직이지 않았다. 두 값을 바르게 고쳐 맨 위 오른쪽 칸에서 몫만큼 아래로, 나머지만큼 왼쪽으로 움직일 때 도착한 칸의 수는?`, q * 8 + 8 - r, {
      figure: board(), explain: `나머지는 나누는 수보다 작아야 한다. 바른 몫은 ${q}, 나머지는 ${r}이다. 아래로 ${q}칸, 왼쪽으로 ${r}칸 가면 ${q * 8 + 8 - r}에 도착한다.`, facts: { iscream: { a, divisor, width: 8, start: [8, 1], delta: [-r, q], proposed: [q - 1, divisor + r] } }
    });
  });
  add('3-2-3', 'circle-band', '중심이 같은 두 원 사이에 있는 장소 찾기', '78-79', d => {
    const inner = d.int(3, 4), outer = inner + 1, distances = d.shuffle([inner - 0.6, outer + 0.6, outer - 0.3, inner + 0.4, inner + 0.7, inner]);
    const points = distances.map((r, i) => { const a = i * Math.PI / 3; return [Number((130 + r * 19 * Math.cos(a)).toFixed(2)), Number((122 + r * 19 * Math.sin(a)).toFixed(2))]; });
    const figure = `<svg class="mb-geo" viewBox="0 0 260 250" width="260" role="img" aria-label="같은 중심에서 반지름이 ${inner} cm와 ${outer} cm인 두 원과 장소 6곳"><circle cx="130" cy="122" r="${outer * 19}" fill="#eff6ff" stroke="#1d4ed8"/><circle cx="130" cy="122" r="${inner * 19}" fill="white" stroke="#1d4ed8" stroke-dasharray="4 3"/><circle cx="130" cy="122" r="3" fill="#0f172a"/><text x="130" y="240" text-anchor="middle" font-size="12">작은 원 ${inner} cm · 큰 원 ${outer} cm</text>${points.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3" fill="#0f172a"/><text x="${x + 5}" y="${y - 7}" font-size="12">${i + 1}</text>`).join('')}</svg>`;
    return N('지도에서 작은 원의 바깥쪽이면서 큰 원의 안쪽에 있는 장소는 모두 몇 곳인가? (원 위의 장소는 세지 않는다.)', distances.filter(r => r > inner && r < outer).length, {
      unit: '곳', figure, explain: '작은 원 안이나 원 위에 있는 장소와 큰 원 밖에 있는 장소를 뺀다. 두 원 사이에 있는 장소는 3곳이다.', facts: { iscream: { inner, outer, distances } }
    });
  });
  add('3-2-3', 'circle-meeting', '두 사람의 이동 범위를 함께 만족하는 약속 장소', '78-79', d => {
    const points = d.shuffle([[175, 110], [75, 100], [210, 180], [90, 180]]), centers = [[95, 110], [215, 110]], radii = [90, 60];
    const good = points.map(p => centers.every((c, i) => (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 < radii[i] ** 2));
    const figure = `<svg class="mb-geo" viewBox="0 0 300 220" width="270" role="img" aria-label="집 가를 중심으로 한 큰 원과 집 나를 중심으로 한 작은 원, 번호가 있는 약속 장소 네 곳">${centers.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${radii[i]}" fill="${i ? '#fef3c7' : '#dbeafe'}" fill-opacity="0.35" stroke="${i ? '#92400e' : '#1d4ed8'}"/><circle cx="${x}" cy="${y}" r="3"/><text x="${x - 5}" y="${y + 18}" font-size="12">집 ${i ? '나' : '가'}</text>`).join('')}${points.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3"/><text x="${x + 5}" y="${y - 7}" font-size="13">${i + 1}</text>`).join('')}</svg>`;
    return N('가의 집에 사는 사람은 큰 원 안쪽까지, 나의 집에 사는 사람은 작은 원 안쪽까지 갈 수 있다. 두 사람이 모두 갈 수 있는 약속 장소의 번호는? (원 위는 갈 수 없다.)', good.indexOf(true) + 1, {
      figure, explain: `두 원의 안쪽에 함께 들어 있는 장소는 ${good.indexOf(true) + 1}번이다. 나머지 장소는 적어도 한 사람의 이동 범위를 벗어난다.`, facts: { iscream: { points, centers, radii } }
    });
  });
  add('3-2-4', 'game-gems', '부분의 양을 구해 체력을 남기는 세 보석 고르기', '102-103', d => {
    const total = 12 * d.int(1, 3), fractions = d.shuffle([[1, 2], [2, 3], [3, 4], [1, 6], [5, 6], [1, 4]]), costs = fractions.map(([a, b]) => total * a / b);
    return N(`게임의 체력은 ${total}칸이다. 서로 다른 보석을 정확히 3개 캐고 체력을 1칸 이상 남기려고 한다. 조건에 맞는 보석 3개를 캘 때 사용하는 체력은 모두 몇 칸인가?`, total * 11 / 12, {
      unit: '칸', figure: table(['보석', '사용하는 체력'], fractions.map(([a, b], i) => [i + 1, `${total}칸의 ${frac(a, b)}`])),
      explain: `보석별 체력은 ${costs.join(', ')}칸이다. 작은 세 양인 ${total / 6}, ${total / 4}, ${total / 2}칸을 골라야 합이 전체보다 작다. 모두 ${total * 11 / 12}칸을 사용한다.`, facts: { iscream: { total, fractions, costs } }
    });
  });
  add('3-2-4', 'game-refill', '두 음식의 회복량을 계산해 부족한 체력 채우기', '102-103', d => {
    const k = d.int(1, 3), total = 12 * k, current = 5 * k, numerators = d.shuffle([1, 2, 3, 5, 8, 9]);
    return N(`전체 체력 ${total}칸 중 현재 ${current}칸이 남아 있다. 서로 다른 음식 2개를 먹어 체력을 넘치거나 모자라지 않게 모두 채우려고 한다. 먹을 두 음식 중 회복량이 더 큰 음식은 체력을 몇 칸 채우는가?`, 5 * k, {
      unit: '칸', figure: table(['음식', '회복량'], numerators.map((a, i) => [i + 1, `${total}칸의 ${frac(a, 12)}`])),
      explain: `더 채워야 할 체력은 ${total} − ${current} = ${7 * k}칸이다. 회복량이 ${2 * k}칸과 ${5 * k}칸인 두 음식만 합이 맞으므로 더 큰 회복량은 ${5 * k}칸이다.`, facts: { iscream: { total, current, amounts: numerators.map(a => a * k) } }
    });
  });
  add('3-2-5', 'donation-transfer', '두 상자의 무게 제한을 함께 맞추도록 물건 옮기기', '130-131', d => {
    const weights = d.shuffle([700, 1100, 1800, 2300, 2900]), target = 3400, low = 3350, high = 3450, cap = d.pick([15000, 20000, 25000]), a = cap + low, b = cap - high;
    const kg = n => `${Math.floor(n / 1000)} kg ${n % 1000} g`;
    return M(`가 상자에는 ${kg(a)}, 나 상자에는 ${kg(b)}의 물건이 들어 있다. 각 상자는 ${cap / 1000} kg까지 담을 수 있다. 가 상자에서 표의 물건 중 일부를 나 상자로 옮겨 두 상자 모두 제한을 지키려고 한다. 물건을 옮긴 뒤 가 상자의 무게는 몇 kg 몇 g인가? (그 밖의 물건은 옮기지 않는다.)`, [{ label: 'kg', answer: Math.floor((a - target) / 1000) }, { label: 'g', answer: (a - target) % 1000 }], {
      figure: table(['옮길 수 있는 물건', '무게'], weights.map((w, i) => ['물건 ' + (i + 1), kg(w)])),
      explain: `가에서는 적어도 ${kg(low)}을 덜어야 하고 나에는 ${kg(high)}까지 더 넣을 수 있다. 이 사이가 되는 조합은 1100 g과 2300 g뿐이다. 3400 g을 옮기면 가 상자는 ${kg(a - target)}이 된다.`, facts: { iscream: { cap, a, b, weights, low, high } }
    });
  });
  // 회차의 구성 변경으로 예전 체크포인트를 새 회차에 섞지 않는다.
  for (const id of ["3-2-2","3-2-3","3-2-4","3-2-5"]) { const u = B.findUnit(id); u.version = (u.version || 1) + 1; }
})(typeof window !== 'undefined' ? window : globalThis);
