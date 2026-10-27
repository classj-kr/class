// 아이스크림 5-2 「생각을 더하다」. 표의 두 기준·엄격한 경계·여러 음식의 양을 보존한다.
(function (root) {
  'use strict';
  const B = root.MathBank, { N, D, table, frac } = B.kit;
  const add = (unit, id, title, pages, make) => B.addTypes(unit, 'hard', [{ id: 'ic-' + id, title, level: '실력', source: '아이스크림 수학 5-2 생각을 더하다 ' + pages + '쪽 — 구조 변형', make(d) {
    const item = make(d); if (item.fraction && Number(unit.split('-')[0]) >= 4) item.anyForm = true; if (item.figure) item.figure = `<div class="mb-iscream">${item.figure}</div>`; item.facts.iscream = { book: '5-2', pages, kind: id, ...item.facts.iscream }; return item;
  } }]);
  add('5-2-1', 'parcel-two-rules', '무게·세 변의 합으로 정한 요금 중 높은 요금 적용하기', '26-27', d => {
    const rows = [[d.pick([4, 6, 8]), ...d.shuffle([d.int(38, 43), d.int(39, 44), d.int(41, 46)])], [d.pick([12, 15, 18]), d.int(20, 25), d.int(22, 27), d.int(23, 28)]], weights = [2, 10, 20, 30], sizes = [60, 120, 140, 160], fees = [6000, 7000, 8000, 9000], level = (v, limits) => limits.findIndex(x => v <= x), actual = rows.map(([w, ...s]) => fees[Math.max(level(w, weights), level(s.reduce((a, b) => a + b, 0), sizes))]);
    return N('택배 크기는 상자의 가로·세로·높이의 합이다. 무게와 크기에 따른 요금이 다르면 더 높은 요금을 낸다. 표의 가, 나 상자를 각각 하나씩 보낼 때 택배 요금은 모두 얼마인가?', actual.reduce((a, b) => a + b, 0), {
      unit: '원', figure: table(['무게', '크기', '요금(원)'], weights.map((w, i) => [i ? `${weights[i - 1]} kg 초과 ${w} kg 이하` : `${w} kg 이하`, i ? `${sizes[i - 1]} cm 초과 ${sizes[i]} cm 이하` : `${sizes[i]} cm 이하`, fees[i]])) + table(['상자', '무게(kg)', '세 변의 길이(cm)'], rows.map(([w, ...s], i) => [i ? '나' : '가', w, s.join(', ')])),
      explain: `상자의 크기는 가 ${rows[0].slice(1).reduce((a, b) => a + b, 0)} cm, 나 ${rows[1].slice(1).reduce((a, b) => a + b, 0)} cm이다. 두 기준 중 높은 요금은 각각 ${actual[0]}원, ${actual[1]}원이므로 모두 ${actual[0] + actual[1]}원이다.`, facts: { iscream: { rows, weights, sizes, fees } }
    });
  });
  add('5-2-2', 'vote-minimum', '출석과 찬성의 두 초과 조건을 만족하는 최소 표 수', '50-51', d => {
    const members = d.int(45, 79), attendance = Math.floor(members / 2) + 1, votes = Math.floor(attendance * 2 / 3) + 1;
    return N(`회원 ${members}명이 있는 모임에서 전체 회원의 ${frac(1, 2)}보다 많은 사람이 참석해야 회의를 열 수 있다. 의견이 통과되려면 참석한 사람의 ${frac(2, 3)}보다 많은 사람이 찬성해야 한다. 회의를 열 수 있는 가장 적은 인원이 참석했을 때, 의견이 통과되는 데 필요한 찬성표는 최소 몇 표인가?`, votes, {
      unit: '표', explain: `참석자는 ${members} × 1/2보다 많은 최소 정수인 ${attendance}명이다. 찬성표는 ${attendance} × 2/3보다 많아야 하므로 최소 ${votes}표이다. 나누어떨어지더라도 조건이 ‘보다 많은’이므로 한 명을 더한다.`, facts: { iscream: { members } }
    });
  });
  add('5-2-4', 'meal-energy', '먹은 양에 따른 음식별 열량을 모아 기준과 비교하기', '100-101', d => {
    const energy = [d.int(30, 38) * 10, d.int(100, 160) + 0.5, d.int(50, 80)], amount = [0.5, 2, 1.5], target = 700, total = energy.reduce((s, v, i) => s + v * amount[i], 0), answer = target - total;
    return (Number.isInteger(answer) ? N : D)(`식단 계산 연습에서 한 끼의 비교 기준을 ${target}킬로칼로리로 정했다. 표와 같이 음식을 먹었을 때 기준까지 몇 킬로칼로리가 모자라는가?`, answer, {
      unit: '킬로칼로리', figure: table(['음식', '하나의 열량', '먹은 양'], energy.map((v, i) => [['볶음밥', '빵', '우유'][i], v + '킬로칼로리', amount[i] + ['그릇', '개', '컵'][i]])),
      explain: `먹은 열량은 ${energy.map((v, i) => `${v} × ${amount[i]}`).join(' + ')} = ${total}(킬로칼로리)이다. ${target} − ${total} = ${answer}(킬로칼로리)가 모자란다.`, facts: { iscream: { energy, amount, target } }
    });
  });
  // 회차의 구성 변경으로 예전 체크포인트를 새 회차에 섞지 않는다.
  for (const id of ["5-2-1","5-2-2","5-2-4"]) { const u = B.findUnit(id); u.version = (u.version || 1) + 1; }
})(typeof window !== 'undefined' ? window : globalThis);
