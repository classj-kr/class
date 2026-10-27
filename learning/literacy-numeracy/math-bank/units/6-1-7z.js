// 아이스크림 6-1 「생각을 더하다」의 포장 무게·단위량·절약률·묶음 포장 보충.
(function (root) {
  'use strict';
  const B = root.MathBank, { N, D, F, table, frac, mixed } = B.kit;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const add = (unit, id, title, pages, make) => B.addTypes(unit, 'hard', [{ id: 'ic-' + id, title, level: '실력', source: '아이스크림 수학 6-1 생각을 더하다 ' + pages + '쪽 — 구조 변형', make(d) {
    const item = make(d); if (item.fraction && Number(unit.split('-')[0]) >= 4) item.anyForm = true; if (item.figure) item.figure = `<div class="mb-iscream">${item.figure}</div>`; item.facts.iscream = { book: '6-1', pages, kind: id, ...item.facts.iscream }; return item;
  } }]);
  add('6-1-1', 'tare-fraction', '여러 상자의 총무게에서 포장 무게를 빼고 낱개 무게 구하기', '22-23', d => {
    const den = d.pick([3, 4, 5, 6]), top = d.int(den + 1, den * 3 - 1), boxes = d.int(2, 5), each = d.int(2, 4), gross = boxes * (top * each + 1), g = gcd(top, den), a = top / g, b = den / g;
    const show = (n, q) => n % q === 0 ? String(n / q) : n > q ? mixed(Math.floor(n / q), n % q, q) : frac(n, q);
    const text = `상자 하나에 같은 구호 물품이 ${each}개씩 들어 있다. 물품이 든 상자 ${boxes}개의 무게는 ${show(gross, den)} kg이고, 빈 상자 하나의 무게는 ${frac(1, den)} kg이다. 구호 물품 하나의 무게는 몇 kg인가?`;
    const options = { unit: 'kg', explain: `총무게를 ${B.kit.josa(boxes, '으로/로')} 나누어 상자 한 개의 무게를 구한다. 빈 상자의 무게를 뺀 뒤 ${B.kit.josa(each, '으로/로')} 나누면 물품 하나의 무게는 ${show(a, b)} kg이다.`, facts: { iscream: { den, gross, boxes, each, tare: 1 } } };
    return b === 1 ? N(text, a, options) : F(text, a % b, b, { ...options, ...(a > b ? { whole: Math.floor(a / b) } : {}) });
  });
  add('6-1-3', 'exercise-rate', '서로 다른 운동 시간을 단위 시간으로 바꾸어 비교하기', '72-73', d => {
    const rates = d.shuffle([d.int(25, 34), d.int(40, 49), d.int(55, 64)]), times = [d.int(9, 15), d.int(16, 24), d.int(25, 32)], totals = rates.map((r, i) => r * times[i] / 10), max = d.bool(), answer = (max ? Math.max(...rates) : Math.min(...rates)) / 10;
    return (Number.isInteger(answer) ? N : D)(`세 운동의 기록이다. 1분 동안 소모한 열량이 가장 ${max ? '많은' : '적은'} 운동은 1분 동안 몇 킬로칼로리를 소모했는가?`, answer, {
      unit: '킬로칼로리', figure: table(['운동', '소모한 열량', '시간(분)'], totals.map((v, i) => [['걷기', '자전거', '줄넘기'][i], v + '킬로칼로리', times[i]])),
      explain: `각 운동의 열량을 시간으로 나누면 차례로 ${rates.map(v => v / 10).join(', ')}킬로칼로리이다. 이 중 가장 ${max ? '많은' : '적은'} 양은 ${answer}킬로칼로리이다.`, facts: { iscream: { totals, times, max } }
    });
  });
  add('6-1-4', 'energy-saving', '여러 기기의 절약량을 합해 지난달 사용량에 대한 백분율 구하기', '94-95', d => {
    const previous = d.pick([240, 280, 320]), pct = d.pick([5, 10, 15]), amount = previous * pct / 100, a = d.int(2, 4), b = d.int(2, 4), saved = [a, b, amount - a - b];
    return N(`지난달 전기 사용량은 ${previous} kWh이다. 이번 달에는 표와 같이 세 기기의 전기 사용량을 줄이고, 다른 기기의 사용량은 그대로 두려고 한다. 줄이려는 전기 사용량은 지난달 사용량의 몇 %인가?`, pct, {
      unit: '%', figure: table(['기기', '줄일 사용량(kWh)'], saved.map((v, i) => [['텔레비전', '세탁기', '건조기'][i], v])),
      explain: `줄이는 양은 ${saved.join(' + ')} = ${amount}(kWh)이다. 기준량은 지난달 사용량이므로 ${amount} ÷ ${previous} × 100 = ${pct}(%)이다.`, facts: { iscream: { previous, saved } }
    });
  });
  add('6-1-6', 'package-surface', '같은 직육면체 상자를 다르게 쌓아 포장지 절약량 구하기', '140-141', d => {
    const dims = d.shuffle(d.pick([[3, 5, 8], [2, 3, 7], [3, 4, 7]])), configs = d.bool() ? [[4, 1, 1], [2, 2, 1]] : [[4, 2, 1], [2, 2, 2]], sizes = configs.map(c => c.map((n, i) => n * dims[i])), surface = sizes.map(([a, b, c]) => 2 * (a * b + b * c + c * a)), answer = Math.abs(surface[0] - surface[1]), count = configs[0].reduce((a, b) => a * b, 1);
    return N(`가로 ${dims[0]} cm, 세로 ${dims[1]} cm, 높이 ${dims[2]} cm인 같은 상자 ${count}개를 빈틈없이 쌓아 직육면체 모양으로 포장한다. 표의 가, 나 방법 중 포장지가 덜 드는 방법을 쓰면 다른 방법보다 포장지를 몇 cm² 절약하는가? (방향을 바꾸지 않고, 겹침 없이 모든 겉면을 포장한다.)`, answer, {
      unit: 'cm²', figure: table(['방법', '가로로 놓는 수', '세로로 놓는 수', '쌓는 층수'], configs.map((r, i) => [i ? '나' : '가', ...r])),
      explain: `전체의 가로·세로·높이는 가 ${sizes[0].join(', ')} cm, 나 ${sizes[1].join(', ')} cm이다. 겉넓이는 각각 ${surface[0]} cm², ${surface[1]} cm²이므로 차는 ${answer} cm²이다.`, facts: { iscream: { dims, configs } }
    });
  });
  // 회차의 구성 변경으로 예전 체크포인트를 새 회차에 섞지 않는다.
  for (const id of ["6-1-1","6-1-3","6-1-4","6-1-6"]) { const u = B.findUnit(id); u.version = (u.version || 1) + 1; }
})(typeof window !== 'undefined' ? window : globalThis);
