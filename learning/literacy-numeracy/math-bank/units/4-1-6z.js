// 아이스크림 4-1 「생각을 더하다」의 각도·자료 선택·누적 규칙 보충.
(function (root) {
  'use strict';
  const B = root.MathBank, { N, table } = B.kit;
  const add = (unit, id, title, pages, make, count = 1) => B.addTypes(unit, 'hard', [{ id: 'ic-' + id, title, count, level: '실력', source: '아이스크림 수학 4-1 생각을 더하다 ' + pages + '쪽 — 구조 변형', make(d, n) {
    const item = make(d, n); if (item.fraction && Number(unit.split('-')[0]) >= 4) item.anyForm = true; if (item.figure) item.figure = `<div class="mb-iscream">${item.figure}</div>`; item.facts.iscream = { book: '4-1', pages, kind: id, ...item.facts.iscream }; return item;
  } }]);
  add('4-1-2', 'map-turn', '방향을 바꾸는 명령에서 빠진 회전각 구하기', '54-55', d => {
    const left = d.int(4, 7) * 10, right = d.int(1, 3) * 10, answer = 90 - left + right;
    return N(`지도 속 로봇이 동쪽을 향해 출발했다. 첫 갈림길에서 왼쪽으로 ${left}°, 다음 갈림길에서 오른쪽으로 ${right}° 돌았다. 마지막 갈림길에서 왼쪽으로 90°보다 작게 한 번 더 돌아 북쪽을 향하게 하려면 마지막에 몇 ° 돌아야 하는가?`, answer, {
      unit: '°', figure: '<div class="mb-lines">북 ↑<br>서 ← ＋ → 동<br>남 ↓</div>',
      explain: `동쪽에서 북쪽까지 왼쪽으로 도는 각은 90°이다. 지금은 왼쪽으로 ${left} − ${right} = ${left - right}° 돈 셈이므로 ${answer}°를 더 돌아야 한다.`, facts: { calc: [[`90-${left}+${right}`, 0]], unseen: [90], iscream: { left, right } }
    });
  });
  add('4-1-3', 'footprint-choice', '재료별 사용량을 더해 더 적은 메뉴의 전체 양 구하기', '78-79', d => {
    const serving = d.int(12, 25), rows = [[d.int(7, 10) * 10, d.int(10, 13) * 10, 90], [d.int(12, 15) * 10, d.int(15, 18) * 10, 90]], sums = rows.map(r => r.reduce((a, b) => a + b, 0));
    return N(`샐러드 1인분에 쓰는 재료를 생산하는 데 필요한 물의 양을 표로 나타냈다. 재료를 생산하는 데 물이 더 적게 드는 샐러드로 ${serving}인분을 만든다. 필요한 물은 모두 몇 L인가?`, Math.min(...sums) * serving, {
      unit: 'L', figure: table(['샐러드', '첫째 재료(L)', '둘째 재료(L)', '양상추(L)'], rows.map((r, i) => [i ? '나' : '가', ...r])),
      explain: `1인분에 필요한 물은 가 ${sums[0]} L, 나 ${sums[1]} L이다. 더 적은 ${Math.min(...sums)} L씩 ${serving}인분이므로 모두 ${Math.min(...sums) * serving} L이다.`, facts: { iscream: { serving, rows } }
    });
  });
  add('4-1-6', 'saving-series', '날마다 늘어나는 저금액의 누적 합', '148-149', d => {
    const days = d.int(5, 9), step = d.pick([100, 200]), first = d.bool() ? step : step / 2, amounts = Array.from({ length: days }, (_, i) => first + i * step), total = amounts.reduce((a, b) => a + b, 0);
    return N(`첫날 ${first}원을 저금하고, 다음 날부터는 바로 전날 저금한 금액보다 ${step}원씩 더 많이 저금한다. ${days}일 동안 저금한 돈은 모두 얼마인가?`, total, {
      unit: '원', figure: table(['날', '그날 저금한 돈(원)'], [[1, first], [2, first + step], [3, first + step * 2], ['⋯', '⋯']]),
      explain: `날마다 저금한 돈은 ${amounts.join(', ')}원이다. 이 금액을 모두 더하면 ${total}원이다.`, facts: { iscream: { days, step, first } }
    });
  });
  // 회차의 구성 변경으로 예전 체크포인트를 새 회차에 섞지 않는다.
  for (const id of ["4-1-2","4-1-3","4-1-6"]) { const u = B.findUnit(id); u.version = (u.version || 1) + 1; }
})(typeof window !== 'undefined' ? window : globalThis);
