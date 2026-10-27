// 아이스크림 6-2의 2단원(소수 나눗셈)은 앱의 3단원, 3단원(공간과 입체)은 앱의 2단원에 연결.
(function (root) {
  'use strict';
  const B = root.MathBank, { N, D, M, table } = B.kit;
  const add = (unit, id, title, pages, make) => B.addTypes(unit, 'hard', [{ id: 'ic-' + id, title, level: '실력', source: '아이스크림 수학 6-2 생각을 더하다 ' + pages + '쪽 — 구조 변형', make(d) {
    const item = make(d); if (item.fraction && Number(unit.split('-')[0]) >= 4) item.anyForm = true; if (item.figure) item.figure = `<div class="mb-iscream">${item.figure}</div>`; item.facts.iscream = { book: '6-2', pages, kind: id, ...item.facts.iscream }; return item;
  } }]);
  add('6-2-3', 'fuel-saving', '같은 거리에서 두 자동차의 연료 사용량을 구해 절약량 계산하기', '46-47', d => {
    const [a, b, common] = d.pick([[96, 176, 1056], [85, 255, 255], [72, 144, 144], [125, 200, 1000]]), k = d.int(4, 20), distance100 = common * k, rates10 = [a, b], oldFuel = distance100 / (a * 10), newFuel = distance100 / (b * 10), answer = Math.round((oldFuel - newFuel) * 1000) / 1000;
    return (Number.isInteger(answer) ? N : D)(`휘발유 자동차는 연료 1 L로 ${a / 10} km, 하이브리드 자동차는 연료 1 L로 ${b / 10} km를 간다. 두 자동차로 각각 ${distance100 / 100} km를 갈 때 하이브리드 자동차를 쓰면 연료를 몇 L 절약하는가?`, answer, {
      unit: 'L', explain: `필요한 연료는 거리를 1 L로 가는 거리로 나누어 구한다. 각각 ${oldFuel} L, ${newFuel} L이므로 ${oldFuel} − ${newFuel} = ${answer}(L)를 절약한다.`, facts: { iscream: { distance100, rates10 } }
    });
  });
  const grid = h => `<svg class="mb-geo" viewBox="0 0 100 115" width="100" role="img" aria-label="위에서 본 높이표, 뒤쪽 줄 ${h[0].join(', ')}, 앞쪽 줄 ${h[1].join(', ')}">${h.flatMap((r, y) => r.map((n, x) => `<rect x="${x * 40 + 10}" y="${y * 40 + 5}" width="40" height="40" fill="#eff6ff" stroke="#334155"/><text x="${x * 40 + 30}" y="${y * 40 + 31}" text-anchor="middle" font-size="17">${n}</text>`)).join('')}<text x="50" y="105" text-anchor="middle" font-size="12">앞</text></svg>`;
  add('6-2-2', 'blocks-add', '기존 쌓기나무를 보존하면서 정해진 수만 더 붙일 수 있는 모양', '68-69', d => {
    const base = [[1, 2], [1, 1]], addCount = d.int(1, 2), goodCount = d.int(1, 3), candidates = [];
    for (let i = 0; i < goodCount; i++) { const h = base.map(r => r.slice()); h[Math.floor(i / 2)][i % 2] += addCount; candidates.push(h); }
    const removed = [[0, 2 + addCount + 1], [1, 1]], tooMany = [[1, 2], [1, 2 + addCount]], tooFew = base.map(r => r.slice());
    candidates.push(...[removed, tooMany, tooFew].slice(0, 4 - goodCount));
    const targets = d.shuffle(candidates);
    return N(`위에서 본 모양의 각 칸에 그 자리에 쌓인 쌓기나무 수를 적었다. 처음 모양에 쌓기나무를 정확히 ${addCount}개 더 붙이려고 한다. 기존 쌓기나무를 옮기거나 떼지 않고 만들 수 있는 목표 모양은 모두 몇 개인가? (앞 방향은 고정한다.)`, goodCount, {
      unit: '개', figure: '<div>처음 모양</div>' + grid(base) + '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">' + targets.map((h, i) => `<div>목표 ${i + 1}${grid(h)}</div>`).join('') + '</div>',
      explain: `모든 칸의 높이가 처음보다 같거나 높고, 높이가 늘어난 수의 합이 ${addCount}인 것만 가능하다. 이 두 조건을 모두 만족하는 모양은 ${goodCount}개이다.`, facts: { iscream: { base, addCount, targets } }
    });
  });
  add('6-2-4', 'recipe-scale-share', '인분에 맞게 재료를 늘이거나 줄인 뒤 비례배분하기', '90-91', d => {
    const original = d.pick([2, 4]), servings = d.pick([3, 5]), ratio = d.pick([[3, 1], [3, 2], [2, 1]]), staple = d.int(7, 10) * original * 10, vegetable = (ratio[0] + ratio[1]) * original * d.int(2, 4) * 10, scaled = vegetable / original * servings, answers = [staple / original * servings, scaled * ratio[0] / (ratio[0] + ratio[1]), scaled * ratio[1] / (ratio[0] + ratio[1])];
    return M(`${original}인분 조리법에는 면 ${staple} g과 토마토·양파를 ${ratio[0]} : ${ratio[1]}로 섞은 채소 ${vegetable} g이 필요하다. 같은 조리법으로 ${servings}인분을 만들 때 면, 토마토, 양파는 각각 몇 g 필요한가?`, answers.map((answer, i) => ({ label: ['면', '토마토', '양파'][i], answer, unit: 'g' })), {
      explain: `인분이 ${servings}/${original}배이므로 면은 ${answers[0]} g, 섞은 채소는 ${scaled} g이다. 채소를 ${ratio[0]} : ${ratio[1]}로 나누면 토마토 ${answers[1]} g, 양파 ${answers[2]} g이다.`, facts: { iscream: { original, servings, ratio, staple, vegetable } }
    });
  });
  add('6-2-5', 'pizza-area', '한 판과 여러 판의 피자 넓이를 비교해 더 먹는 양 구하기', '112-113', d => {
    const radiusA = d.int(12, 18), radiusB = d.int(8, 12), nA = 1, nB = 2, area100 = [radiusA * radiusA * 314, radiusB * radiusB * 314 * 2], answer = Math.abs(area100[0] - area100[1]) / 100;
    return (Number.isInteger(answer) ? N : D)(`같은 가격인 가 메뉴는 지름 ${radiusA * 2} cm인 피자 1판, 나 메뉴는 지름 ${radiusB * 2} cm인 피자 2판이다. 피자의 두께는 모두 같다. 더 많이 먹을 수 있는 메뉴의 피자 넓이는 다른 메뉴보다 몇 cm² 더 넓은가? (원주율: 3.14)`, answer, {
      unit: 'cm²', explain: `가 메뉴의 넓이는 ${radiusA} × ${radiusA} × 3.14 = ${area100[0] / 100}(cm²)이다. 나 메뉴는 ${radiusB} × ${radiusB} × 3.14 × 2 = ${area100[1] / 100}(cm²)이므로 차는 ${answer} cm²이다.`, facts: { iscream: { diameters: [radiusA * 2, radiusB * 2], counts: [nA, nB], pi100: 314 } }
    });
  });
  add('6-2-6', 'solid-view-circles', '세 입체도형을 세 방향에서 본 모양 중 원 세기', '132-133', d => {
    const counts = [d.int(1, 3), d.int(1, 3), d.int(1, 3)], answer = counts[0] + counts[1] + counts[2] * 3;
    return N(`원기둥 ${counts[0]}개와 원뿔 ${counts[1]}개를 밑면이 수평이 되도록 세우고, 구 ${counts[2]}개도 놓았다. 각 입체도형을 위·앞·옆에서 따로 보고 모양을 하나씩 그렸다. 그린 모양 중 원은 모두 몇 개인가? (원기둥과 원뿔은 옆으로 기울이지 않는다.)`, answer, {
      unit: '개', explain: `세워 놓은 원기둥과 원뿔은 위에서 볼 때만 원이다. 구는 위·앞·옆에서 모두 원이므로 ${counts[0]} + ${counts[1]} + ${counts[2]} × 3 = ${answer}개이다.`, facts: { iscream: { counts } }
    });
  });
  // 회차의 구성 변경으로 예전 체크포인트를 새 회차에 섞지 않는다.
  for (const id of ["6-2-3","6-2-2","6-2-4","6-2-5","6-2-6"]) { const u = B.findUnit(id); u.version = (u.version || 1) + 1; }
})(typeof window !== 'undefined' ? window : globalThis);
