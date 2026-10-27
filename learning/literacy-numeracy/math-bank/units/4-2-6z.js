// 아이스크림의 단원 순서와 앱의 단원 순서가 다르다. 측정 문항은 측정 단원에 연결한다.
(function (root) {
  'use strict';
  const B = root.MathBank, { N, D, M, F, table, frac } = B.kit;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const add = (unit, id, title, book, pages, make) => B.addTypes(unit, 'hard', [{ id: 'ic-' + id, title, level: '실력', source: '아이스크림 수학 ' + book + ' 생각을 더하다 ' + pages + '쪽 — 구조 변형', make(d) {
    const item = make(d); if (item.fraction && Number(unit.split('-')[0]) >= 4) item.anyForm = true; if (item.figure) item.figure = `<div class="mb-iscream">${item.figure}</div>`; item.facts.iscream = { book, pages, kind: id, ...item.facts.iscream }; return item;
  } }]);
  function orders(d, shortage) {
    const den = d.pick([3, 7]), whole = d.int(3, 4), per = whole * den + 1, stock = 4 * whole + 2, count = 4, left = stock * den - per * count, numerator = shortage ? per - left : left, g = gcd(numerator, den), num = numerator / g, bottom = den / g;
    const text = `찻집에 과일청 ${stock}큰술이 있다. 과일 음료 한 잔에는 과일청 ${whole}${frac(1, den)}큰술이 필요하다. 표의 주문을 모두 만들었다. ` + (shortage ? '추가 주문 한 잔까지 만들려면 과일청은 몇 큰술 더 필요한가?' : '남은 과일청은 몇 큰술인가?');
    return F(text, num % bottom, bottom, { ...(num > bottom ? { whole: Math.floor(num / bottom) } : {}), unit: '큰술',
      figure: table(['주문서', '과일 음료', '다른 음료'], [['가', '1잔', '2잔'], ['나', '2잔', '0잔'], ['다', '1잔', '1잔']]),
      explain: `과일 음료는 1 + 2 + 1 = 4잔이다. 주문 후 남은 과일청은 ${stock} − (${whole} + 1/${den}) × 4이다.` + (shortage ? ` 한 잔에 필요한 양에서 남은 양을 빼면 ` : ' 남은 양은 ') + `${num > bottom ? B.kit.mixed(Math.floor(num / bottom), num % bottom, bottom) : frac(num, bottom)}큰술이다.`,
      facts: { iscream: { den, per, stock, count, shortage } }
    });
  }
  add('4-2-1', 'orders-rest', '여러 주문서에서 필요한 잔 수를 모아 재료의 나머지 구하기', '4-2', '24-25', d => orders(d, false));
  add('4-2-1', 'orders-short', '주문 처리 후 남은 재료로 추가 주문의 부족량 구하기', '4-2', '24-25', d => orders(d, true));
  add('4-2-3', 'nutrition-limit', '식단표와 서로 다른 기준을 연결해 초과량 구하기', '4-2', '74-75', d => {
    const values = [d.int(4, 6), d.int(7, 9), d.int(7, 8), d.int(7, 9), d.int(8, 9)], limits = [15, 20], sums = [values[0] + values[1] + values[2], values[3] + values[4] + values[2]], answers = sums.map((s, i) => (s - limits[i]) / 10);
    return M('식단표를 읽는 연습에서 어린이의 비교 기준을 1.5 g, 어른의 비교 기준을 2 g으로 정했다. 어린이는 가·나·다 음식, 어른은 라·마·다 음식을 각각 한 그릇씩 먹었다. 각자 먹은 음식 속 나트륨의 양은 자기 기준보다 몇 g 더 많은가?', answers.map((answer, i) => ({ label: i ? '어른' : '어린이', answer, unit: 'g', decimal: !Number.isInteger(answer) })), {
      figure: table(['음식', '한 그릇에 든 나트륨(g)'], values.map((v, i) => [['가', '나', '다', '라', '마'][i], v / 10])),
      explain: `어린이는 ${sums[0] / 10} − 1.5 = ${answers[0]}(g), 어른은 ${sums[1] / 10} − 2 = ${answers[1]}(g) 더 많다.`, facts: { iscream: { values, limits } }
    });
  });
  add('4-2-3', 'fire-rope', '비스듬한 길이와 수직 높이를 가려 대피 줄의 길이 구하기', '4-2', '100-101', d => {
    const heights = [d.int(24, 29), d.int(25, 30)], door = d.int(16, 21), stair = [heights[0] + 11, heights[1] + 12], answer = (heights[0] + heights[1] + door) / 10;
    const figure = `<svg class="mb-geo" viewBox="0 0 270 220" width="270" role="img" aria-label="평행한 세 층의 바닥, 층 사이 수직 높이 ${heights[0] / 10} m와 ${heights[1] / 10} m, 문 위까지 높이 ${door / 10} m, 계단 길이 ${stair[0] / 10} m와 ${stair[1] / 10} m">${[190, 125, 60].map(y => `<path d="M15 ${y}H210" stroke="#334155" stroke-width="2"/>`).join('')}<path d="M35 190L115 125L35 60" fill="none" stroke="#64748b" stroke-width="3"/><text x="32" y="163" font-size="12">${stair[0] / 10} m</text><text x="35" y="100" font-size="12">${stair[1] / 10} m</text><path d="M205 60V20H170V60M235 20V190" fill="none" stroke="#2563eb" stroke-width="2"/><text x="150" y="43" font-size="12">${door / 10} m</text><text x="160" y="103" font-size="12">${heights[1] / 10} m</text><text x="160" y="166" font-size="12">${heights[0] / 10} m</text><text x="20" y="210" font-size="12">각 층의 바닥은 서로 평행</text></svg>`;
    const marked = figure.replace('<path d="M35', '<path d="M15 60V190M145 60V190" stroke="#94a3b8" stroke-width="3"/><path d="M145 117h8v8M145 182h8v8" fill="none" stroke="#475569"/><path d="M35').replace('M235 20V190', 'M205 20V190');
    return (Number.isInteger(answer) ? N : D)('그림의 두 기둥은 각 층의 바닥과 수직이다. 파란 줄을 3층 문 윗부분에서 1층 바닥까지 수직으로 곧게 내린다. 바닥에 딱 닿는 데 필요한 줄의 길이는 몇 m인가?', answer, {
      unit: 'm', figure: marked, explain: `계단의 비스듬한 길이는 쓰지 않는다. 층 사이의 수직 높이와 3층 문 높이를 더하면 ${heights[0] / 10} + ${heights[1] / 10} + ${door / 10} = ${answer}(m)이다.`, facts: { iscream: { heights, door, stair } }
    });
  });
  add('4-2-6', 'pipe-turns', '길의 입구와 출구에 맞게 조각 돌리기', '4-1', '100-101', d => {
    const turns = Array.from({ length: 3 }, () => d.int(1, 3)), total = turns.reduce((a, b) => a + b, 0), targets = [2, 1, 3], current = targets.map((x, i) => (x - turns[i] + 4) % 4);
    const elbow = k => `<svg class="mb-geo" viewBox="0 0 60 60" width="60" role="img" aria-label="위·오른쪽으로 열린 길 조각을 시계 방향 ${k * 90}도 돌린 모양"><rect x="2" y="2" width="56" height="56" fill="#f8fafc" stroke="#94a3b8"/><path d="M30 3V30H57" transform="rotate(${k * 90} 30 30)" stroke="#2563eb" stroke-width="9" fill="none"/></svg>`;
    return N('길 조각마다 단추를 한 번 누르면 시계 방향으로 90° 돌아간다. 세 조각을 각각 처음 모양에서 목표 모양으로 바꾸려면 단추를 적어도 모두 몇 번 눌러야 하는가?', total, {
      unit: '번', figure: table(['조각', '처음 모양', '목표 모양'], current.map((c, i) => [i + 1, elbow(c), elbow(targets[i])])),
      explain: `첫째부터 차례로 ${turns.join(', ')}번 누르면 된다. 모두 ${turns.join(' + ')} = ${total}번이다.`, facts: { iscream: { current, targets } }
    });
  });
  // 회차의 구성 변경으로 예전 체크포인트를 새 회차에 섞지 않는다.
  for (const id of ["4-2-1","4-2-3","4-2-6"]) { const u = B.findUnit(id); u.version = (u.version || 1) + 1; }
})(typeof window !== 'undefined' ? window : globalThis);
