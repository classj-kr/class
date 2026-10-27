// 아이스크림 5-1 「생각을 더하다」의 실용 문제와 조건 탐색을 단답형으로 보충.
(function (root) {
  'use strict';
  const B = root.MathBank, { N, M, F, table, frac } = B.kit;
  const add = (unit, id, title, pages, make) => B.addTypes(unit, 'hard', [{ id: 'ic-' + id, title, level: '실력', source: '아이스크림 수학 5-1 생각을 더하다 ' + pages + '쪽 — 구조 변형', make(d) {
    const item = make(d); if (item.fraction && Number(unit.split('-')[0]) >= 4) item.anyForm = true; if (item.figure) item.figure = `<div class="mb-iscream">${item.figure}</div>`; item.facts.iscream = { book: '5-1', pages, kind: id, ...item.facts.iscream }; return item;
  } }]);
  add('5-1-1', 'survival-weight', '묶음 무게에서 낱개 무게를 구해 가방의 여유 무게 계산하기', '22-23', d => {
    const per = [d.int(12, 16) * 100, d.int(3, 5) * 100, d.int(12, 16) * 100, d.int(1, 3) * 100, d.int(3, 8) * 10], packs = [2, 5, 3, 4, 10], counts = [1, 2, 1, 3, 2], names = ['담요', '통조림', '물', '간식', '성냥 세트'], cap = d.pick([6000, 6500]), sum = per.reduce((a, p, i) => a + p * counts[i], 0);
    return N(`비상 가방에 넣을 물건을 표와 같이 골랐다. 표의 묶음 무게는 물건만의 무게이다. 가방에 넣는 물건의 무게를 ${cap} g 이하로 하려면 물건을 몇 g까지 더 넣을 수 있는가?`, cap - sum, {
      unit: 'g', figure: table(['물건', '묶음', '묶음 무게(g)', '넣을 개수'], per.map((p, i) => [names[i], packs[i] + '개', p * packs[i], counts[i]])),
      explain: `묶음 무게를 묶음의 개수로 나눈 뒤 넣을 개수를 곱한다. 넣는 물건은 모두 ${sum} g이므로 ${cap} − ${sum} = ${cap - sum}(g)까지 더 넣을 수 있다.`, facts: { iscream: { totals: per.map((p, i) => p * packs[i]), packs, counts, cap } }
    });
  });
  add('5-1-2', 'parade-rows', '여러 반의 인원을 모아 줄 서는 방법의 수 구하기', '44-45', d => {
    const classes = d.int(3, 6), each = d.int(8, 15), girls = d.pick([36, 48, 60, 72, 84]), boys = classes * each, divisors = x => Array.from({ length: x }, (_, i) => i + 1).filter(n => x % n === 0);
    return M(`체육 대회에 남학생과 여학생이 따로 입장한다. ${classes}개 반에 남학생은 반마다 ${each}명씩 있고, 여학생은 모두 ${girls}명이다. 각 무리는 한 줄의 인원이 같고 남는 사람 없이 줄을 선다. 한 줄로 서는 경우도 포함할 때, 남학생과 여학생이 줄 서는 방법은 각각 몇 가지인가?`, [{ label: '남학생', answer: divisors(boys).length, unit: '가지' }, { label: '여학생', answer: divisors(girls).length, unit: '가지' }], {
      explain: `남학생은 ${classes} × ${each} = ${boys}명이다. 한 줄의 인원은 전체 인원의 약수이므로 남학생은 ${divisors(boys).join(', ')}명씩, 여학생은 ${divisors(girls).join(', ')}명씩 서는 ${divisors(boys).length}가지, ${divisors(girls).length}가지이다.`, facts: { iscream: { classes, each, girls } }
    });
  });
  add('5-1-5', 'dotted-note', '점음표에서 본 음표 길이와 그 절반 더하기', '108-109', d => {
    const den = d.pick([2, 4, 8, 16]);
    return F(`음악에서 음표 오른쪽의 점은 그 음표 길이의 절반을 더한다는 뜻이다. 본 음표의 길이가 ${frac(1, den)}박일 때 점을 하나 붙인 음표의 길이는 몇 박인가?`, 3, den * 2, {
      unit: '박', explain: `1/${den}박의 절반은 1/${den * 2}박이다. 본 음표와 점의 길이를 더하면 2/${den * 2} + 1/${den * 2} = 3/${den * 2}(박)이다.`, facts: { value: `1/${den}+1/(${den}*2)`, unseen: [1, 2], iscream: { den } }
    });
  });
  add('5-1-5', 'measure-fill', '한 마디의 길이를 맞추는 빠진 음표의 길이', '108-109', d => {
    const beats = d.int(2, 3), quarters = d.pick([1, 3]), used = 4 + quarters, rest = beats * 4 - used, g = rest % 2 ? 1 : 2, top = rest / g, bottom = 4 / g;
    return F(`한 마디의 길이를 ${beats}박으로 맞추려고 한다. 이 마디에는 1박인 음표 한 개와 ${frac(quarters, 4)}박인 음표 한 개가 있다. 음표 한 개를 더 넣어 길이를 맞출 때, 더 넣을 음표는 몇 박이어야 하는가?`, top % bottom, bottom, {
      ...(top > bottom ? { whole: Math.floor(top / bottom) } : {}), unit: '박', explain: `이미 있는 두 음표 길이의 합을 전체 길이에서 뺀다. ${beats} − 1 − ${quarters}/4 = ${top > bottom ? Math.floor(top / bottom) + '과 ' : ''}${top % bottom}/${bottom}(박)이다.`, facts: { value: `${beats}-1-${quarters}/4`, unseen: [1], iscream: { beats, quarters } }
    });
  });
  add('5-1-6', 'park-min-perimeter', '넓이가 정해진 직사각형에서 가장 짧은 둘레 찾기', '144', d => {
    const step = d.int(3, 8), tiles = d.pick([12, 18, 20, 24, 30]), area = tiles * step * step, pairs = [];
    for (let w = step; w * w <= area; w += step) if (area % w === 0 && (area / w) % step === 0) pairs.push([w, area / w]);
    const best = Math.min(...pairs.map(([w, h]) => 2 * (w + h)));
    return N(`넓이가 ${area} m²인 직사각형 공원을 만든다. 가로와 세로의 길이는 모두 ${step} m의 배수여야 한다. 만들 수 있는 공원의 둘레 중 가장 짧은 길이는 몇 m인가?`, best, {
      unit: 'm', explain: `조건에 맞는 가로와 세로의 짝은 ${pairs.map(p => p.join(' m, ') + ' m').join(' / ')}이다. 각 둘레를 비교하면 가장 짧은 길이는 ${best} m이다.`, facts: { iscream: { step, area } }
    });
  });
  add('5-1-6', 'park-max-area', '둘레가 정해진 직사각형에서 가장 넓은 넓이 찾기', '145', d => {
    const step = d.int(4, 9), half = d.pick([8, 9, 10, 11]) * step, perimeter = half * 2, pairs = [];
    for (let w = step; w <= half / 2; w += step) pairs.push([w, half - w]);
    const best = Math.max(...pairs.map(([w, h]) => w * h));
    return N(`둘레가 ${perimeter} m인 직사각형 공원을 만든다. 가로와 세로의 길이는 모두 ${step} m의 배수여야 한다. 만들 수 있는 공원의 넓이 중 가장 넓은 넓이는 몇 m²인가?`, best, {
      unit: 'm²', explain: `가로와 세로의 합은 ${perimeter} ÷ 2 = ${half}(m)이다. 조건에 맞는 짝의 넓이를 비교하면 ${best} m²가 가장 넓다.`, facts: { iscream: { step, perimeter } }
    });
  });
  // 회차의 구성 변경으로 예전 체크포인트를 새 회차에 섞지 않는다.
  for (const id of ["5-1-1","5-1-2","5-1-5","5-1-6"]) { const u = B.findUnit(id); u.version = (u.version || 1) + 1; }
})(typeof window !== 'undefined' ? window : globalThis);
