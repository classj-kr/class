// 6학년 1학기 5단원 여러 가지 그래프 — 기본 문항(그래프로 나타내기, 해석하기, 두 그래프 비교하기, 여러 가지 그래프).
// 꼴 목록(기본꼴 1~3, 심화꼴)을 번호마다 따져 실었다. 싣는 기준과 뺀 것은 6-1-5a.js 머리에, 꼴마다의 판정은 수집본의 _분석/6-1-5/싣기_대조표.md 에 있다.
//
// 이 파일에서 지킨 것
//  - 그리는 꼴(작도)은 고르기·수 답으로: 그리는 차례와 방법, 눈금 한 칸의 크기 정하기, 차지하는 칸 수, 그래프의 빈 곳, 바르게 나타낸 그래프 고르기, 잘못 적은 백분율 찾기.
//    바르게 나타낸 그래프를 고르는 문항의 그래프에는 백분율을 적지 않는다(눈금으로 읽어 표와 비교한다). 틀린 그래프는 이웃한 두 칸을 바꾸거나 금을 눈금 한 칸 옮긴 것이다.
//  - 「몇 % 더 많은가」는 백분율의 차로 묻는다(30 %는 20 %보다 「10 % 더 많다」고 하면 뜻이 둘로 읽힌다).
//  - 한 항목의 수로 다른 항목의 수를 구하는 문항은 백분율이 자연수 배인 것만 싣는다(같은 전체에 대한 비율이므로 수도 그 배). 자연수 배가 아닌 것은 비례식(6학년 2학기)의 일이다.
//  - 띠그래프의 길이는 전체 길이에 백분율을 한 번 곱하는 것만 싣는다.
//  - 알맞은 그래프를 고르는 문항은 답이 갈리지 않게 알아보려는 것(변화·비율·많고 적음)을 글에 밝힌다. 항목별 수량은 비율 그래프로도 나타낼 수 있기 때문이다.
// 묻는 말: 수나 값을 물으면 "~은?/~는?", 양을 물으면 "몇 ~인가?", 시키는 말은 "~구하시오."로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, NAMES, frac, lines, tagged, barChart, lineChart, N, M, C, D } = B.kit;
  const { T, sum, top, low, distinct, lone, truthOf, tail, MARKS, SETS, say, pc, lead, parts, make, ratioPairs, orderOptions, desc, band, pie, cap, cells, tab, head, counts } = B.kit.g615;
  const U = '6-1-5';
  const PLAIN = '#f1f5f9';
  // 섞은 차례(제자리 그대로는 쓰지 않는다)
  const mixed = (d, n) => d.until(() => d.shuffle(Array.from({ length: n }, (_, i) => i)), (x) => x.some((v, i) => v !== i));
  // 표와 다르게 나타낸 그래프 둘: 이웃한 두 칸의 크기를 바꾼 것과, 금 하나를 눈금 한 칸(5 %) 옮긴 것
  const wrongPair = (d, p) => d.until(() => {
    const i = d.int(0, p.length - 2), j = d.int(0, p.length - 2), a = p.slice(), b = p.slice(), s = d.pick([5, -5]);
    [a[i], a[i + 1]] = [a[i + 1], a[i]]; b[j] += s; b[j + 1] -= s;
    return [a, b];
  }, ([a, b]) => low(b) >= 10 && a.join() !== p.join() && a.join() !== b.join());

  // ── 띠그래프와 원그래프로 나타내기 ───────────────────────────
  B.addTypes(U, 'draw', [
    T('draw-order', '띠그래프로 나타내는 차례', '①24 ②35 ③19', (d) => {
      const steps = ['각 항목의 백분율을 구한다.', '각 항목의 백분율의 합계가 100 %인지 확인한다.', '각 항목의 백분율만큼 띠를 나눈다.', '나눈 부분에 항목의 이름과 백분율을 쓴다.'];
      const shown = mixed(d, 4), right = [0, 1, 2, 3].map((s) => shown.indexOf(s)), orders = orderOptions(d, right);
      return C('자료를 띠그래프로 나타내는 방법을 차례 없이 늘어놓았다. 차례대로 늘어놓은 것은?', orders.map((o) => o.map((i) => MARKS[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: tagged(shown.map((s) => steps[s]), MARKS),
        explain: `먼저 백분율을 구하고(${MARKS[right[0]]}), 합계가 100 %인지 확인한 다음(${MARKS[right[1]]}), 백분율만큼 띠를 나누고(${MARKS[right[2]]}), 나눈 부분에 항목의 이름과 백분율을 쓴다(${MARKS[right[3]]}).`,
        facts: { truth: orders.map((o) => o.join() === right.join()), want: true }
      });
    }),
    T('draw-how', '원그래프로 나타내는 방법', '①21·23의 주의점 ①29 ②35 ③17·18', (d) => {
      const wrong = d.pick(['각 항목의 수가 몇 명인지 세어, 그 수만큼 눈금을 세어 원을 나눈다.', '백분율이 가장 큰 항목부터 원을 대강 어림하여 나눈다.']);
      const rows = d.shuffle([['각 항목의 백분율을 구하고, 합계가 100 %인지 확인한다.', true], ['원의 중심에서 둘레의 눈금까지 선을 그어, 각 항목의 백분율만큼 원을 나눈다.', true], ['나눈 부분에 항목의 이름과 백분율을 쓴다.', true], [wrong, false]]);
      return C('자료를 눈금이 표시된 원에 원그래프로 나타내는 방법으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: '원그래프는 각 항목의 백분율만큼 원을 나누어 나타낸다. 눈금 한 칸이 몇 %인지 보고, 원의 중심에서 눈금까지 선을 그어 백분율만큼 나눈다.', facts: truthOf(rows, false)
      });
    }),
    T('draw-tick-choose', '작은 눈금 한 칸의 크기 정하기', '②3의 변형 심43', (d) => {
      const g = make(d, 'subject', 4, { step: 4, lo: 12, hi: 44, ok: (v) => distinct(v) && v.filter((x) => x % 5 !== 0).length >= 2 }), c = g.c, sizes = d.shuffle([1, 5, 10, 20]), odd = g.p.filter((x) => x % 5 !== 0);
      return C(`${c.intro} 조사하여 백분율로 나타낸 표이다. 이 표를 눈금에 꼭 맞게 띠그래프로 나타내려고 할 때, 작은 눈금 한 칸의 크기로 알맞은 것은?`, sizes.map(pc), sizes.indexOf(1), {
        figure: tab(g, [['백분율(%)', g.p]], [100]),
        explain: `${pc(odd[0])}와 ${pc(odd[1])}는 5 %씩이나 10 %씩 나눈 눈금에 꼭 맞지 않는다. 작은 눈금 한 칸을 1 %로 하면 모든 항목을 눈금에 맞게 나타낼 수 있다.`,
        facts: { truth: sizes.map((t) => g.p.every((x) => x % t === 0)), want: true }
      });
    }),
    T('draw-cells', '띠그래프에서 차지하는 작은 눈금의 칸 수', '①26 ②33', (d) => {
      const g = make(d, 'job', 4, { ok: distinct }), c = g.c, k = d.int(0, 3), a = g.names[k];
      return N(`${c.intro} 조사하여 백분율로 나타낸 표이다. 0부터 100까지를 작은 눈금 20칸으로 똑같이 나눈 띠에 띠그래프로 나타낼 때, ${josa(a, '은/는')} 작은 눈금 몇 칸을 차지하는가?`, g.p[k] / 5, {
        unit: '칸', figure: tab(g, [['백분율(%)', g.p]], [100]),
        explain: `작은 눈금 한 칸은 100 ÷ 20 = 5(%)를 나타낸다. ${josa(a, '은/는')} ${pc(g.p[k])}이므로 ${g.p[k]} ÷ 5 = ${g.p[k] / 5}(칸)을 차지한다.`, facts: { calc: [[`${g.p[k]}/(100/20)`, 0]] }
      });
    }),
    T('draw-cells-count', '표의 수를 원그래프의 눈금 칸 수로 나타내기', '①26 ②33의 변형', (d) => {
      const total = d.pick([40, 200]), g = make(d, 'place', 4, { step: 10, lo: 10, hi: 40, ok: distinct }), c = g.c, n = counts(g, total), k = d.until(() => d.int(0, 3), (i) => g.p[i] >= 20), a = g.names[k];
      return N(`${lead(c, '표')} 둘레를 눈금 10칸으로 똑같이 나눈 원에 원그래프로 나타낼 때, ${josa(a, '은/는')} 눈금 몇 칸을 차지하는가?`, g.p[k] / 10, {
        unit: '칸', figure: tab(g, [[head(c), n]], [total]),
        explain: `${josa(a, '은/는')} ${frac(n[k], total)} × 100 = ${g.p[k]}(%)이다. 눈금 한 칸은 100 ÷ 10 = 10(%)를 나타내므로 ${g.p[k]} ÷ 10 = ${g.p[k] / 10}(칸)을 차지한다.`,
        facts: { calc: [[`${n[k]}*100/${total}/(100/10)`, 0]], unseen: [100] }
      });
    }),
    T('draw-fill-band', '표를 보고 띠그래프의 빈 곳 채우기', '①20 ②32 ③16', (d) => {
      const total = d.pick([40, 200]), g = make(d, 'snack', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, n = counts(g, total), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((x, y) => x - y);
      return M(`${c.intro} 조사하여 나타낸 표와 띠그래프이다. ㉠, ㉡에 알맞은 수를 차례로 구하시오.`, [{ label: '㉠', answer: g.p[i], unit: '%' }, { label: '㉡', answer: g.p[j], unit: '%' }], {
        figure: tab(g, [[head(c), n]], [total]) + cap(c.title, band(cells(g, (at) => (at === i ? { show: 'blank', mark: '㉠' } : at === j ? { show: 'blank', mark: '㉡' } : {})))),
        explain: `${josa(g.names[i], '은/는')} ${frac(n[i], total)} × 100 = ${g.p[i]}(%), ${josa(g.names[j], '은/는')} ${frac(n[j], total)} × 100 = ${g.p[j]}(%)이다.`,
        facts: { calc: [[`${n[i]}*100/${total}`, 0], [`${n[j]}*100/${total}`, 1]], unseen: [100] }
      });
    }),
    T('draw-fill-pie', '표를 보고 원그래프의 칸에 알맞은 항목과 백분율 찾기', '①22 ①28 ②32 ③16', (d) => {
      const total = d.pick([20, 40]), g = make(d, 'fruit', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, n = counts(g, total), order = mixed(d, 4), m = d.int(0, 3), x = order[m], y = order[(m + 1) % 4];
      const rows = d.shuffle([[x, g.p[x], true], [y, g.p[y], false], [x, n[x], false], [y, g.p[x], false]]);
      return C(`${c.intro} 조사하여 나타낸 표와 원그래프이다. 원그래프의 ${MARKS[m]}에 알맞은 과일과 그 백분율을 바르게 짝 지은 것은?`, rows.map((r) => `${g.names[r[0]]}, ${pc(r[1])}`), rows.findIndex((r) => r[2]), {
        figure: tab(g, [[head(c), n]], [total]) + cap(c.title, pie(order.map((src, at) => ({ name: g.names[src], pct: g.p[src], show: 'mark', mark: MARKS[at], fill: PLAIN })))),
        explain: `눈금 한 칸은 5 %이고 ${MARKS[m]}은 눈금 ${g.p[x] / 5}칸을 차지하므로 ${pc(g.p[x])}이다. 표에서 ${frac(n[x], total)} × 100 = ${g.p[x]}(%)인 과일은 ${g.names[x]}이다.`,
        facts: { truth: rows.map((r) => r[2]), want: true }
      });
    }),
    T('draw-pick-band', '바르게 나타낸 띠그래프 고르기', '①21 ②34 ③17 심42', (d) => {
      const g = make(d, 'fruit', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, list = d.shuffle([g.p].concat(wrongPair(d, g.p))), right = list.indexOf(g.p);
      return C(`${c.intro} 조사하여 백분율로 나타낸 표이다. 표를 보고 띠그래프로 바르게 나타낸 것은?`, MARKS.slice(0, 3), right, {
        figure: tab(g, [['백분율(%)', g.p]], [100]) + band(list.map((v, at) => ({ tag: MARKS[at], cells: g.names.map((name, i) => ({ name, pct: v[i], show: 'name' })) }))),
        explain: `띠의 칸을 눈금으로 읽어 표의 백분율과 비교한다. ${MARKS[right]}의 칸은 왼쪽부터 ${g.p.map(pc).join(', ')}로 표와 같다. 나머지 둘은 표와 크기가 다른 칸이 있다.`,
        facts: { truth: list.map((v) => v.join() === g.p.join()), want: true }
      });
    }),
    T('draw-pick-pie', '바르게 나타낸 원그래프 고르기', '①23 ②34 ③18 심42', (d) => {
      const g = make(d, 'season', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, list = d.shuffle([g.p].concat(wrongPair(d, g.p))), right = list.indexOf(g.p);
      return C(`${c.intro} 조사하여 백분율로 나타낸 표이다. 표를 보고 원그래프로 바르게 나타낸 것은?`, MARKS.slice(0, 3), right, {
        figure: tab(g, [['백분율(%)', g.p]], [100]) + list.map((v, at) => cap(MARKS[at], pie(g.names.map((name, i) => ({ name, pct: v[i], show: 'name' })), { r: 46 }))).join(''),
        explain: `눈금 한 칸이 5 %임을 보고 각 부분이 차지하는 눈금의 칸 수를 센다. ${MARKS[right]}의 부분은 12시부터 시계 방향으로 ${g.p.map(pc).join(', ')}로 표와 같다.`,
        facts: { truth: list.map((v) => v.join() === g.p.join()), want: true }
      });
    }),
    T('draw-convert', '원그래프를 띠그래프로 바꾸어 나타내기', '①25 ②34의 변형 심42', (d) => {
      const g = make(d, 'subject', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, order = mixed(d, 4), m = d.int(0, 3), x = order[m], from = sum(order.slice(0, m).map((i) => g.p[i]));
      return C(`${c.intro} 조사하여 원그래프와 띠그래프로 나타내었다. 띠그래프의 ${MARKS[m]}에 알맞은 과목은?`, g.names, x, {
        figure: cap('원그래프', pie(cells(g))) + cap('띠그래프', band(order.map((src, at) => ({ name: g.names[src], pct: g.p[src], show: 'mark', mark: MARKS[at], fill: PLAIN })))),
        explain: `띠그래프에서 ${MARKS[m]}의 칸은 눈금 ${from}에서 ${from + g.p[x]}까지이므로 ${pc(g.p[x])}이다. 원그래프에서 ${pc(g.p[x])}인 과목은 ${g.names[x]}이다.`,
        facts: { choose: { exprs: g.p.map(String), rule: 'equals', target: g.p[x] } }
      });
    }),
    T('draw-wrong', '띠그래프에 잘못 적은 백분율 찾기', '③49의 변형 심44', (d) => {
      const g = make(d, 'color', 4, { step: 2, lo: 16, hi: 40, ok: distinct }), c = g.c, n = counts(g, 50), k = d.int(0, 3), said = g.p.map((x, i) => (i === k ? n[k] : x));
      return C(`${c.intro} 조사하여 나타낸 표와 띠그래프이다. 띠그래프에 백분율을 잘못 적은 색깔은?`, g.names, k, {
        figure: tab(g, [[head(c), n]], [50]) + cap(c.title, band(cells(g, (at) => (at === k ? { as: n[k] } : {})), { tick: 10 })),
        explain: `${josa(g.names[k], '은/는')} ${frac(n[k], 50)} × 100 = ${g.p[k]}(%)인데 학생 수 ${josa(n[k], '을/를')} 그대로 적었다. 띠그래프에 적힌 백분율을 모두 더하면 ${sum(said)} %로 100 %가 되지 않는다.`,
        facts: { mismatch: { table: g.p, drawn: said } }
      });
    })
  ]);

  // ── 띠그래프와 원그래프 해석하기 ─────────────────────────────
  // 한 달 동안 읽은 책 수(구간으로 나눈 자료)
  const READ = { noun: '읽은 책 수', names: ['2권 이하', '3~5권', '6~8권', '9권 이상'], title: '한 달 동안 읽은 책 수별 학생 수', intro: '어느 학교 6학년 학생들이 한 달 동안 읽은 책 수를' };
  B.addTypes(U, 'solve', [
    T('sum-two', '두 항목을 합한 백분율', '①30 ②11 ③26 심6', (d) => {
      const g = make(d, 'fruit', 5, { etc: true, sort: true, lo: 5, hi: 40, ok: distinct }), c = g.c, [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2), both = `${g.names[i]} 또는 ${g.names[j]}`;
      return N(`${lead(c, '원그래프')} ${josa(c.one(both), '은/는')} 전체의 몇 %인가?`, g.p[i] + g.p[j], {
        unit: '%', figure: cap(c.title, pie(cells(g))), explain: `${josa(g.names[i], '은/는')} ${pc(g.p[i])}, ${josa(g.names[j], '은/는')} ${pc(g.p[j])}이므로 ${g.p[i]} + ${g.p[j]} = ${g.p[i] + g.p[j]}(%)이다.`, facts: { calc: [[`${g.p[i]}+${g.p[j]}`, 0]] }
      });
    }),
    T('sum-range', '구간을 묶은 백분율', '①30의 변형 ②12 심7', (d) => {
      const p = parts(d, 4, { lo: 15, hi: 40, ok: distinct }), g = { c: READ, names: READ.names, p }, up = d.bool(), [i, j] = up ? [2, 3] : [0, 1];
      return N(`${lead(READ, '띠그래프')} 한 달 동안 책을 ${up ? '6권 이상' : '5권 이하'} 읽은 학생은 전체의 몇 %인가?`, p[i] + p[j], {
        unit: '%', figure: cap(READ.title, band(cells(g))),
        explain: `${up ? '6권 이상은' : '5권 이하는'} 「${READ.names[i]}」${tail(READ.names[i], '과/와')} 「${READ.names[j]}」이다. ${p[i]} + ${p[j]} = ${p[i] + p[j]}(%)이다.`, facts: { calc: [[`${p[i]}+${p[j]}`, 0]] }
      });
    }),
    T('rest-except', '한 항목을 뺀 나머지의 백분율', '②17의 변형 심8', (d) => {
      const g = make(d, 'money', 4, { names: d.shuffle(['저축'].concat(d.shuffle(['학용품', '간식', '교통비', '선물']).slice(0, 3))), lo: 15, hi: 40, ok: distinct }), c = g.c, k = g.names.indexOf('저축');
      return N(`${lead(c, '원그래프')} 한 달 용돈 가운데 저축하지 않고 쓴 돈은 전체의 몇 %인가?`, 100 - g.p[k], {
        unit: '%', figure: cap(c.title, pie(cells(g))), explain: `전체 100 %에서 저축의 ${pc(g.p[k])}를 빼면 100 - ${g.p[k]} = ${100 - g.p[k]}(%)이다.`, facts: { calc: [[`100-${g.p[k]}`, 0]] }
      });
    }),
    T('diff-ends', '가장 높은 비율과 가장 낮은 비율의 차', '①33 ②13 심10', (d) => {
      const g = make(d, 'village', 5, { lo: 5, hi: 40, ok: distinct }), c = g.c, hi = g.p.indexOf(top(g.p)), lo = g.p.indexOf(low(g.p));
      return N(`${lead(c, '띠그래프')} 학생 수의 비율이 가장 높은 마을과 가장 낮은 마을의 백분율의 차는?`, top(g.p) - low(g.p), {
        unit: '%', figure: cap(c.title, band(cells(g))),
        explain: `가장 높은 것은 ${say(c, g.names[hi])}의 ${pc(top(g.p))}, 가장 낮은 것은 ${say(c, g.names[lo])}의 ${pc(low(g.p))}이다. ${top(g.p)} - ${low(g.p)} = ${top(g.p) - low(g.p)}(%)이다.`, facts: { calc: [[`${top(g.p)}-${low(g.p)}`, 0]] }
      });
    }),
    T('times', '한 항목이 다른 항목의 몇 배인지 구하기', '①31 ②14 ③28 심17', (d) => {
      const g = make(d, 'sport', 4, { lo: 10, hi: 45, ok: (v) => distinct(v) && ratioPairs(v).length > 0 }), c = g.c, [i, j] = d.pick(ratioPairs(g.p)), k = g.p[i] / g.p[j];
      return N(`${lead(c, '띠그래프')} ${c.one(g.names[i])} 수는 ${c.one(g.names[j])} 수의 몇 배인가?`, k, {
        unit: '배', figure: cap(c.title, band(cells(g))),
        explain: `${josa(g.names[i], '은/는')} ${pc(g.p[i])}, ${josa(g.names[j], '은/는')} ${pc(g.p[j])}이다. 같은 전체에 대한 비율이므로 학생 수도 ${g.p[i]} ÷ ${g.p[j]} = ${k}(배)이다.`, facts: { calc: [[`${g.p[i]}/${g.p[j]}`, 0]] }
      });
    }),
    T('times-decimal', '몇 배인지 소수로 나타내기', '①31의 변형 ②15 ③29 심18', (d, n) => {
      const pairs = n === 0 ? [[30, 20], [15, 10], [25, 10], [35, 10], [45, 10], [30, 25], [35, 25], [40, 25], [45, 25], [45, 30], [50, 20]] : [[10, 20], [10, 25], [20, 25], [15, 30], [20, 40], [15, 25], [20, 50], [30, 50], [25, 50], [15, 50]];
      const [a, b] = d.pick(pairs), rest = d.until(() => { const x = d.int(1, 8) * 5; return [x, 100 - a - b - x]; }, (v) => v[1] >= 5 && distinct(v.concat([a, b])));
      const key = n === 0 ? 'subject' : 'color', c = SETS[key], order = d.shuffle([a, b].concat(rest)), g = { c, names: d.shuffle(c.names).slice(0, 4), p: order }, i = order.indexOf(a), j = order.indexOf(b);
      return D(`${lead(c, '원그래프')} ${c.one(g.names[i])} 수는 ${c.one(g.names[j])} 수의 몇 배인지 소수로 나타내시오.`, a / b, {
        unit: '배', figure: cap(c.title, pie(cells(g))),
        explain: `${josa(g.names[i], '은/는')} ${pc(a)}, ${josa(g.names[j], '은/는')} ${pc(b)}이다. ${a} ÷ ${b} = ${a / b}(배)이다.${n === 1 ? ` 나누는 차례를 바꾸어 ${b} ÷ ${josa(a, '으로/로')} 계산하면 안 된다.` : ''}`, facts: { calc: [[`${a}/${b}`, 0]] }
      });
    }, { count: 2 }),
    T('times-find', '비율이 몇 배인 항목 찾기', '①32 ②16 ③28의 변형 심20', (d) => {
      const g = make(d, 'place', 5, { lo: 5, hi: 40, ok: (v) => distinct(v) && ratioPairs(v).length > 0 }), c = g.c, [i, j] = d.pick(ratioPairs(g.p)), k = g.p[i] / g.p[j], rest = g.names.map((_, at) => at).filter((at) => at !== j);
      return C(`${lead(c, '띠그래프')} 비율이 ${g.names[j]}의 ${k}배인 장소는?`, rest.map((at) => g.names[at]), rest.indexOf(i), {
        figure: cap(c.title, band(cells(g))), explain: `${josa(g.names[j], '은/는')} ${pc(g.p[j])}이므로 그 ${k}배는 ${g.p[j]} × ${k} = ${g.p[i]}(%)이다. 비율이 ${pc(g.p[i])}인 장소는 ${g.names[i]}이다.`,
        facts: { choose: { exprs: rest.map((at) => String(g.p[at])), rule: 'equals', target: g.p[j] * k } }
      });
    }),
    T('miss-band', '백분율이 지워진 한 항목의 백분율 구하기', '①4 ②17 ③27 심11', (d) => {
      const g = make(d, 'sport', 5, { step: 2, lo: 12, hi: 34, ok: (v) => distinct(v) && v.some((x) => x % 5 !== 0) }), c = g.c, k = d.until(() => d.int(0, 4), (i) => g.p[i] % 5 !== 0), a = g.names[k], others = g.p.filter((_, i) => i !== k);
      return N(`${c.intro} 조사하여 나타낸 띠그래프인데 백분율 하나가 지워졌다. ${josa(c.one(a), '은/는')} 전체의 몇 %인가?`, g.p[k], {
        unit: '%', figure: cap(c.title, band(cells(g, (at) => (at === k ? { show: 'blank' } : {})), { tick: 10 })),
        explain: `백분율의 합계는 100 %이다. 100 - ${others.join(' - ')} = ${g.p[k]}(%)이다.`, facts: { calc: [[`100-${others.join('-')}`, 0]] }
      });
    }),
    T('miss-pie-two', '백분율이 지워진 두 항목을 합한 백분율', '②17의 변형 심13', (d) => {
      const g = make(d, 'color', 5, { step: 2, lo: 12, hi: 34, ok: (v) => distinct(v) && v.some((x) => x % 5 !== 0) }), c = g.c, [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2), others = g.p.filter((_, at) => at !== i && at !== j);
      return N(`${c.intro} 조사하여 나타낸 원그래프인데 백분율 두 개가 지워졌다. ${josa(c.one(`${g.names[i]} 또는 ${g.names[j]}`), '은/는')} 전체의 몇 %인가?`, g.p[i] + g.p[j], {
        unit: '%', figure: cap(c.title, pie(cells(g, (at) => (at === i || at === j ? { show: 'blank' } : {})), { tick: 10 })),
        explain: `두 항목의 백분율을 따로 알 수는 없지만, 합은 전체 100 %에서 나머지를 뺀 것이다. 100 - ${others.join(' - ')} = ${g.p[i] + g.p[j]}(%)이다.`, facts: { calc: [[`100-${others.join('-')}`, 0]] }
      });
    }),
    T('miss-times-known', '몇 배인지를 써서 지워진 백분율 구하기', '③30', (d) => {
      const c = SETS.snack, [a, k, e] = d.until(() => [d.pick([12, 14, 16, 18]), d.pick([2, 3]), d.pick([6, 8, 12, 14])], ([x, m, y]) => x * m <= 48 && 100 - x - x * m - y >= 16 && 100 - x - x * m - y <= 48 && (100 - x - x * m - y) % 5 !== 0 && distinct([x, x * m, y, 100 - x - x * m - y]));
      const want = 100 - a - a * k - e, names = d.shuffle(c.names).slice(0, 3), order = d.shuffle([0, 1, 2]), p = [a, a * k, want];
      const shown = order.map((src) => ({ name: names[src], pct: p[src], show: src === 0 ? 'both' : 'blank' })).concat([{ name: '기타', pct: e }]);
      return N(`${c.intro} 조사하여 나타낸 띠그래프인데 백분율 두 개가 지워졌다. ${names[1]}의 비율이 ${names[0]}의 비율의 ${k}배일 때, ${josa(c.one(names[2]), '은/는')} 전체의 몇 %인가?`, want, {
        unit: '%', figure: cap(c.title, band(shown, { tick: 10 })),
        explain: `${josa(names[1], '은/는')} ${a} × ${k} = ${a * k}(%)이다. 백분율의 합계는 100 %이므로 ${josa(names[2], '은/는')} 100 - ${a} - ${a * k} - ${e} = ${want}(%)이다.`, facts: { calc: [[`100-${a}-${a}*${k}-${e}`, 0]] }
      });
    }),
    T('half-of', '한 항목의 반은 전체의 몇 %인지 구하기', '②19', (d) => {
      const names = d.shuffle(['플라스틱'].concat(d.shuffle(['종이', '캔', '유리병', '비닐']).slice(0, 3))), k = names.indexOf('플라스틱');
      const h = make(d, 'recycle', 4, { names, lo: 10, hi: 40, ok: (v) => distinct(v) && v[k] % 10 === 0 && v[k] >= 20 }), c = h.c, p = h.p;
      return N(`${lead(c, '원그래프')} 플라스틱의 무게의 반이 페트병의 무게일 때, 페트병의 무게는 재활용품 전체의 무게의 몇 %인가?`, p[k] / 2, {
        unit: '%', figure: cap(c.title, pie(cells(h))), explain: `플라스틱은 전체의 ${pc(p[k])}이다. 그 반은 ${p[k]} ÷ 2 = ${p[k] / 2}(%)이다.`, facts: { calc: [[`${p[k]}/2`, 0]], unseen: [2] }
      });
    }),
    T('claims-band', '띠그래프를 보고 한 설명이 옳은지 판단하기', '①34 ②20 ③36 심52', (d) => {
      const g = d.until(() => make(d, 'place', 5, { etc: true, sort: true, lo: 5, hi: 40, ok: distinct }), (x) => ratioPairs(x.p.slice(0, 4)).length > 0), c = g.c, P = g.p, t = d.int(0, 3);
      const [i, j] = d.pick(ratioPairs(P.slice(0, 4))), k = P[i] / P[j] + (t === 2 ? 1 : 0), [a, b] = d.shuffle([0, 1, 2, 3]).slice(0, 2), s = P[a] + P[b] + (t === 1 ? d.pick([-5, 5]) : 0), x = d.int(0, 3), v = P[t === 3 ? (x + 1) % 4 : x], m = t === 0 ? 1 : 0;
      const rows = d.shuffle([
        [`${josa(c.most, '은/는')} ${g.names[m]}이다.`, P[m] === top(P)],
        [`${josa(c.one(`${g.names[a]} 또는 ${g.names[b]}`), '은/는')} 전체의 ${pc(s)}이다.`, s === P[a] + P[b]],
        [`${c.one(g.names[i])} 수는 ${c.one(g.names[j])} 수의 ${k}배이다.`, P[i] === k * P[j]],
        [`${josa(c.one(g.names[x]), '은/는')} 전체의 ${pc(v)}이다.`, v === P[x]]
      ]);
      return C(`${lead(c, '띠그래프')} 띠그래프에 대한 설명으로 옳지 않은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        figure: cap(c.title, band(cells(g))),
        explain: `${josa(c.most, '은/는')} ${pc(P[0])}인 ${g.names[0]}이다. ${g.names[a]} 또는 ${josa(g.names[b], '은/는')} ${P[a]} + ${P[b]} = ${P[a] + P[b]}(%)이다. ${josa(g.names[i], '은/는')} ${g.names[j]}의 ${P[i]} ÷ ${P[j]} = ${P[i] / P[j]}(배)이다. ${josa(g.names[x], '은/는')} ${pc(P[x])}이다.`,
        facts: truthOf(rows, false)
      });
    }),
    T('claims-pie', '원그래프를 보고 바르게 말한 사람 찾기', '①34 ③36 심52', (d) => {
      const g = make(d, 'season', 4, { lo: 10, hi: 45, ok: (v) => distinct(v) && ratioPairs(v).length > 0 }), c = g.c, P = g.p, t = d.int(0, 2), who = d.shuffle(NAMES).slice(0, 3);
      const [i, j] = d.pick(ratioPairs(P)), k = P[i] / P[j] + (t === 2 ? 0 : 1), x = d.int(0, 3), v = P[t === 0 ? x : (x + 1) % 4], order = desc(P), y = order[t === 1 ? 3 : 2];
      const says = d.shuffle([
        [`${josa(c.one(g.names[x]), '은/는')} 전체의 ${pc(v)}야.`, v === P[x]],
        [`좋아하는 학생 수의 비율이 가장 낮은 계절은 ${g.names[y]}${tail(g.names[y], '이야/야')}.`, P[y] === low(P)],
        [`${c.one(g.names[i])} 수는 ${c.one(g.names[j])} 수의 ${k}배야.`, P[i] === k * P[j]]
      ]);
      return C(`${lead(c, '원그래프')} 세 사람 가운데 원그래프를 보고 바르게 말한 사람은?`, who, says.findIndex((r) => r[1]), {
        figure: cap(c.title, pie(cells(g))) + lines(says.map((r, at) => `${who[at]}: ${r[0]}`)),
        explain: `${josa(g.names[x], '은/는')} ${pc(P[x])}이고, 비율이 가장 낮은 계절은 ${pc(low(P))}인 ${g.names[order[3]]}이다. ${josa(g.names[i], '은/는')} ${g.names[j]}의 ${P[i]} ÷ ${P[j]} = ${P[i] / P[j]}(배)이다.`,
        facts: { truth: says.map((r) => r[1]), want: true }
      });
    }),
    T('amount-band', '전체 수와 백분율로 항목의 수 구하기', '①38 ②37 ③32 심22', (d) => {
      const g = make(d, 'job', 5, { etc: true, sort: true, lo: 5, hi: 40, ok: distinct }), c = g.c, total = d.pick([200, 300, 400, 500]), k = d.int(0, 3), a = g.names[k];
      return N(`${lead(c, '띠그래프')} 조사한 학생이 ${total}명일 때, ${josa(c.one(a), '은/는')} 몇 명인가?`, total * g.p[k] / 100, {
        unit: '명', figure: cap(c.title, band(cells(g))),
        explain: `${josa(c.one(a), '은/는')} 전체의 ${pc(g.p[k])}이다. ${total} × ${frac(g.p[k], 100)} = ${total * g.p[k] / 100}(명)이다.`, facts: { calc: [[`${total}*${g.p[k]}/100`, 0]], unseen: [100] }
      });
    }),
    T('amount-pie-ticks', '눈금으로 백분율을 읽어 금액 구하기', '①38의 변형 ②37 ③32', (d) => {
      const g = make(d, 'money', 4, { names: d.shuffle(SETS.money.names).slice(0, 4), step: 10, lo: 10, hi: 40, ok: distinct }), c = g.c, total = d.pick([20000, 30000, 50000]), k = d.int(1, 3), a = g.names[k];
      return N(`${lead(c, '원그래프')} 한 달 용돈이 ${total}원일 때, ${josa(c.one(a), '은/는')} 얼마인가?`, total * g.p[k] / 100, {
        unit: '원', figure: cap(c.title, pie(cells(g, { show: 'name' }), { tick: 10 })),
        explain: `눈금 0과 50 사이가 5칸이므로 눈금 한 칸은 10 %이다. ${josa(a, '은/는')} 눈금 ${g.p[k] / 10}칸을 차지하므로 ${pc(g.p[k])}이다. ${total} × ${frac(g.p[k], 100)} = ${total * g.p[k] / 100}(원)이다.`,
        facts: { calc: [[`${total}*${g.p[k]}/100`, 0]], unseen: [100] }
      });
    }),
    T('amount-two', '두 항목을 합한 수 구하기', '②38의 변형 ③33', (d) => {
      const g = make(d, 'pet', 4, { lo: 15, hi: 40, ok: distinct }), c = g.c, total = d.pick([200, 400, 500]), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2), both = `${g.names[i]} 또는 ${g.names[j]}`, p = g.p[i] + g.p[j];
      return N(`${lead(c, '원그래프')} 조사한 학생이 ${total}명일 때, ${josa(c.one(both), '은/는')} 모두 몇 명인가?`, total * p / 100, {
        unit: '명', figure: cap(c.title, pie(cells(g))),
        explain: `${josa(c.one(both), '은/는')} 전체의 ${g.p[i]} + ${g.p[j]} = ${p}(%)이다. ${total} × ${frac(p, 100)} = ${total * p / 100}(명)이다.`, facts: { calc: [[`${total}*(${g.p[i]}+${g.p[j]})/100`, 0]], unseen: [100] }
      });
    }),
    T('amount-times', '한 항목의 수로 다른 항목의 수 구하기', '①39 ②39 심25', (d) => {
      const g = make(d, 'color', 4, { lo: 10, hi: 45, ok: (v) => distinct(v) && ratioPairs(v).length > 0 }), c = g.c, [i, j] = d.pick(ratioPairs(g.p)), k = g.p[i] / g.p[j], total = d.pick([200, 300, 400, 500]), n = total * g.p[j] / 100;
      return N(`${lead(c, '띠그래프')} ${josa(c.one(g.names[j]), '이/가')} ${n}명일 때, ${josa(c.one(g.names[i]), '은/는')} 몇 명인가?`, n * k, {
        unit: '명', figure: cap(c.title, band(cells(g))),
        explain: `${g.names[i]}의 비율은 ${g.names[j]}의 비율의 ${g.p[i]} ÷ ${g.p[j]} = ${k}(배)이다. 같은 전체에 대한 비율이므로 학생 수도 ${k}배이다. ${n} × ${k} = ${n * k}(명)이다.`, facts: { calc: [[`${n}*(${g.p[i]}/${g.p[j]})`, 0]] }
      });
    }),
    T('band-length', '띠그래프에서 한 항목이 차지하는 길이', '③34 심31', (d) => {
      const [len, step] = d.pick([[20, 5], [40, 5], [50, 2], [10, 10]]), g = make(d, 'subject', 4, { step, lo: step === 2 ? 14 : 10, hi: 40, ok: distinct }), c = g.c, k = d.int(0, 3), a = g.names[k];
      return N(`${c.intro} 조사하여 백분율로 나타낸 표이다. 이 표를 전체 길이가 ${len} cm인 띠그래프로 나타낼 때, ${josa(a, '이/가')} 차지하는 부분의 길이는 몇 cm인가?`, len * g.p[k] / 100, {
        unit: 'cm', figure: tab(g, [['백분율(%)', g.p]], [100]),
        explain: `${josa(a, '은/는')} 전체의 ${pc(g.p[k])}이므로 띠의 전체 길이의 ${pc(g.p[k])}를 차지한다. ${len} × ${frac(g.p[k], 100)} = ${len * g.p[k] / 100}(cm)이다.`, facts: { calc: [[`${len}*${g.p[k]}/100`, 0]], unseen: [100] }
      });
    })
  ]);

  // ── 두 그래프 비교하기 ───────────────────────────────────────
  // 띠 여럿: 같은 항목을 같은 차례로 놓는다(빛깔도 같다).
  const rowsOf = (tags, names, list) => tags.map((tag, r) => ({ tag, cells: names.map((name, i) => ({ name, pct: list[r][i] })) }));
  const two = (d, n, o, ok) => d.until(() => [parts(d, n, o), parts(d, n, o)], ([a, b]) => ok(a, b));
  B.addTypes(U, 'compare', [
    T('two-up', '두 해의 띠그래프에서 비율이 높아진 항목의 수', '①45 ②43 심48', (d) => {
      const c = SETS.farm, names = d.shuffle(c.names).slice(0, 4), [a, b] = two(d, 4, { lo: 15, hi: 45 }, (x, y) => distinct(x) && x.filter((v, i) => v === y[i]).length === 1 && x.some((v, i) => y[i] > v)), up = a.map((v, i) => b[i] > v);
      return N('어느 농장에서 기르는 가축의 수를 2020년과 2025년에 종류별로 조사하여 나타낸 띠그래프이다. 2020년보다 2025년에 비율이 높아진 가축은 모두 몇 가지인가?', up.filter(Boolean).length, {
        unit: '가지', figure: cap(c.title, band(rowsOf(['2020년', '2025년'], names, [a, b]))),
        explain: `가축마다 두 해의 백분율을 비교한다. ${names.map((x, i) => `${x} ${a[i]} % → ${b[i]} %`).join(', ')}이므로 비율이 높아진 가축은 ${names.filter((_, i) => up[i]).join(', ')}의 ${up.filter(Boolean).length}가지이다.`, facts: { count: up }
      });
    }),
    T('two-change-most', '비율이 가장 많이 높아진 항목 찾기', '②44', (d) => {
      const c = SETS.money, names = d.shuffle(c.names).slice(0, 4), [a, b] = two(d, 4, { lo: 15, hi: 45 }, (x, y) => { const gap = y.map((v, i) => v - x[i]), s = gap.slice().sort((p, q) => q - p); return s[0] >= 10 && s[0] > s[1] && s[1] >= 5; }), gap = b.map((v, i) => v - a[i]), hi = gap.indexOf(top(gap));
      return C('수아가 4월과 5월에 용돈을 쓴 곳을 조사하여 나타낸 띠그래프이다. 4월보다 5월에 비율이 가장 많이 높아진 것은?', names, hi, {
        figure: cap(c.title, band(rowsOf(['4월', '5월'], names, [a, b]))),
        explain: `비율이 높아진 것은 ${names.map((x, i) => (gap[i] > 0 ? `${x}(${b[i]} - ${a[i]} = ${gap[i]})` : '')).filter(Boolean).join(', ')}이다. 가장 많이 높아진 것은 ${names[hi]}이다.`,
        facts: { truth: gap.map((v) => v === top(gap)), want: true }
      });
    }),
    T('multi-trend', '세 해의 띠그래프에서 비율이 계속 높아진 항목 찾기', '①46 ②45 ③38·39 심48', (d) => {
      const c = SETS.crop, names = d.shuffle(['쌀', '보리', '콩', '밀']), rise = (x, y, z, i) => x[i] < y[i] && y[i] < z[i], fall = (x, y, z, i) => x[i] > y[i] && y[i] > z[i];
      const [a, b, e] = d.until(() => [parts(d, 4, { lo: 15, hi: 45 }), parts(d, 4, { lo: 15, hi: 45 }), parts(d, 4, { lo: 15, hi: 45 })], ([x, y, z]) => [0, 1, 2, 3].filter((i) => rise(x, y, z, i)).length === 1 && [0, 1, 2, 3].filter((i) => fall(x, y, z, i)).length >= 1 && [0, 1, 2, 3].filter((i) => !rise(x, y, z, i) && !fall(x, y, z, i) && z[i] > x[i]).length >= 1);
      const hit = [0, 1, 2, 3].map((i) => rise(a, b, e, i)), k = hit.indexOf(true);
      return C('어느 마을의 곡식 생산량을 2015년, 2020년, 2025년에 종류별로 조사하여 나타낸 띠그래프이다. 생산량의 비율이 계속 높아진 곡식은?', names, k, {
        figure: cap(c.title, band(rowsOf(['2015년', '2020년', '2025년'], names, [a, b, e]))),
        explain: `${names[k]}의 비율은 ${a[k]} % → ${b[k]} % → ${e[k]} %로 계속 높아졌다. 나머지 곡식은 낮아지거나, 높아졌다가 낮아지거나, 낮아졌다가 높아졌다.`, facts: { truth: hit, want: true }
      });
    }),
    T('two-most-each', '두 띠그래프에서 각각 비율이 가장 높은 항목', '①47 ②42', (d) => {
      const c = SETS.fruit, names = d.shuffle(c.names).slice(0, 4), [a, b] = two(d, 4, { lo: 15, hi: 45 }, (x, y) => lone(x, top(x)) && lone(y, top(y)) && x.indexOf(top(x)) !== y.indexOf(top(y))), i = a.indexOf(top(a)), j = b.indexOf(top(b));
      const rows = d.shuffle([[i, j], [j, i], [i, i], [j, j]]);
      return C('어느 학교 5학년과 6학년 학생들이 좋아하는 과일을 조사하여 나타낸 띠그래프이다. 5학년과 6학년에서 비율이 가장 높은 과일을 차례로 쓴 것은?', rows.map(([x, y]) => `${names[x]}, ${names[y]}`), rows.findIndex(([x, y]) => x === i && y === j), {
        figure: cap(c.title, band(rowsOf(['5학년', '6학년'], names, [a, b]))),
        explain: `5학년에서는 ${josa(names[i], '이/가')} ${pc(a[i])}로 가장 높고, 6학년에서는 ${josa(names[j], '이/가')} ${pc(b[j])}로 가장 높다.`, facts: { truth: rows.map(([x, y]) => x === i && y === j), want: true }
      });
    }),
    T('multi-times', '같은 항목의 비율이 몇 배가 되었는지 구하기', '①48 ③29의 변형 심49', (d) => {
      const c = SETS.books, names = d.shuffle(c.names).slice(0, 4), [a, b] = two(d, 4, { lo: 15, hi: 45 }, (x, y) => x.filter((v, i) => y[i] > v && y[i] % v === 0).length === 1), k = a.findIndex((v, i) => b[i] > v && b[i] % v === 0);
      return N(`어느 학급 문고에 있는 책의 수를 작년과 올해에 종류별로 조사하여 나타낸 띠그래프이다. 올해 ${names[k]}의 비율은 작년 ${names[k]}의 비율의 몇 배인가?`, b[k] / a[k], {
        unit: '배', figure: cap(c.title, band(rowsOf(['작년', '올해'], names, [a, b]))),
        explain: `${names[k]}의 비율은 작년에 ${pc(a[k])}, 올해 ${pc(b[k])}이다. ${b[k]} ÷ ${a[k]} = ${b[k] / a[k]}(배)이다.`, facts: { calc: [[`${b[k]}/${a[k]}`, 0]] }
      });
    }),
    T('duo-higher', '두 원그래프에서 한쪽의 비율이 더 높은 항목 모두 찾기', '①49 ②42 ③40 심46', (d) => {
      const c = SETS.sport, names = d.shuffle(c.names).slice(0, 4), [a, b] = two(d, 4, { lo: 15, hi: 40 }, (x, y) => x.filter((v, i) => y[i] > v).length === 2 && x.every((v, i) => v !== y[i])), up = [0, 1, 2, 3].filter((i) => b[i] > a[i]), down = [0, 1, 2, 3].filter((i) => b[i] < a[i]);
      const rows = d.shuffle([up, down, [up[0], down[0]].sort(), [up[1], down[1]].sort()]);
      return C('어느 학교 6학년 가 반과 나 반 학생들이 좋아하는 운동을 조사하여 나타낸 원그래프이다. 가 반보다 나 반에서 비율이 더 높은 운동을 모두 고른 것은?', rows.map((r) => r.map((i) => names[i]).join(', ')), rows.indexOf(up), {
        figure: cap('가 반', pie(names.map((name, i) => ({ name, pct: a[i] })), { r: 70 })) + cap('나 반', pie(names.map((name, i) => ({ name, pct: b[i] })), { r: 70 })),
        explain: `운동마다 두 반의 백분율을 비교한다. ${names.map((x, i) => `${x} ${a[i]} %, ${b[i]} %`).join(' / ')}이므로 나 반에서 더 높은 운동은 ${up.map((i) => names[i]).join(', ')}이다.`,
        facts: { truth: rows.map((r) => r === up), want: true }
      });
    }),
    T('duo-match', '한 그래프의 항목과 비율이 같은 다른 그래프의 항목', '②42의 변형 ③40 심47', (d) => {
      const c = SETS.snack, names = d.shuffle(c.names).slice(0, 4), [a, b] = two(d, 4, { lo: 15, hi: 40 }, (x, y) => distinct(x) && distinct(y) && x.filter((v, i) => y.includes(v) && y.indexOf(v) !== i).length >= 1 && x.every((v, i) => v !== y[i]));
      const k = d.pick([0, 1, 2, 3].filter((i) => b.includes(a[i]))), m = b.indexOf(a[k]);
      return C(`어느 학교 5학년과 6학년 학생들이 좋아하는 간식을 조사하여 나타낸 원그래프이다. 5학년의 ${josa(names[k], '과/와')} 비율이 같은 6학년의 간식은?`, names, m, {
        figure: cap('5학년', pie(names.map((name, i) => ({ name, pct: a[i] })), { r: 70 })) + cap('6학년', pie(names.map((name, i) => ({ name, pct: b[i] })), { r: 70 })),
        explain: `5학년에서 ${josa(names[k], '은/는')} ${pc(a[k])}이다. 6학년에서 비율이 ${pc(a[k])}인 간식은 ${names[m]}이다.`, facts: { choose: { exprs: b.map(String), rule: 'equals', target: a[k] } }
      });
    })
  ]);

  // ── 여러 가지 그래프 ─────────────────────────────────────────
  const CHANGE = ['월별 강아지의 몸무게 변화', '시각별 교실의 온도 변화', '연도별 우리 학교 학생 수의 변화', '요일별 줄넘기 횟수의 변화'];
  const SHARE = ['전체 학생 수에 대한 반별 학생 수의 비율', '전체 득표수에 대한 후보별 득표수의 비율', '과자에 들어 있는 영양소의 비율', '학급 문고에 있는 책의 종류별 비율'];
  const AMOUNT = ['마을별 사과 생산량의 많고 적음', '반별 모은 빈 병 수의 많고 적음', '모둠별 읽은 책 수의 많고 적음'];
  const PERM3 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  B.addTypes(U, 'kind', [
    T('kind-ratio', '비율을 한눈에 알아보기 쉬운 그래프', '①51 ②52의 변형 ③46', (d) => {
      const rows = d.shuffle([['띠그래프, 원그래프', true], ['막대그래프, 꺾은선그래프', false], ['막대그래프, 띠그래프', false], ['꺾은선그래프, 원그래프', false]]);
      return C('전체에 대한 각 부분의 비율을 한눈에 알아보기 쉬운 그래프를 모두 고른 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        explain: '띠그래프와 원그래프는 전체에 대한 각 부분의 비율을 띠와 원에 나타낸다. 막대그래프는 수량의 많고 적음을, 꺾은선그래프는 시간에 따른 변화를 나타낸다.', facts: truthOf(rows, true)
      });
    }),
    T('kind-topic', '알아보려는 것에 알맞은 그래프', '①52·55 ②53 ③45 심58', (d) => {
      const rows = d.shuffle([[d.pick(CHANGE), '꺾은선그래프'], [d.pick(SHARE), '원그래프'], [d.pick(AMOUNT), '막대그래프']]), right = rows.map((r) => r[1]);
      const orders = d.shuffle([PERM3[0]].concat(d.shuffle(PERM3.slice(1)).slice(0, 3)));
      return C('㉠, ㉡, ㉢을 알아보려고 한다. 각각 알맞은 그래프를 차례로 쓴 것은?', orders.map((o) => o.map((i) => right[i]).join(', ')), orders.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map((r) => r[0]), MARKS),
        explain: '시간에 따른 변화는 꺾은선그래프, 전체에 대한 각 부분의 비율은 원그래프(띠그래프), 항목별 수량의 많고 적음은 막대그래프로 나타내면 알아보기 쉽다.', facts: { truth: orders.map((o) => o.join() === '0,1,2'), want: true }
      });
    }),
    T('kind-not-topic', '띠그래프나 원그래프로 나타내기에 알맞지 않은 자료', '①53 ②54 심57', (d) => {
      const bad = d.pick(CHANGE), rows = d.shuffle(d.shuffle(SHARE).slice(0, 3).map((t) => [t, true]).concat([[bad, false]]));
      return C('띠그래프나 원그래프로 나타내어 알아보기에 알맞지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: `「${bad}」${tail(bad, '은/는')} 시간에 따라 변하는 모습을 알아보는 것이므로 꺾은선그래프가 알맞다. 띠그래프와 원그래프는 전체에 대한 각 부분의 비율을 나타낸다.`, facts: truthOf(rows, false)
      });
    }),
    T('kind-not-graph', '자료를 나타내기에 알맞지 않은 그래프', '①54', (d) => {
      const rows = d.shuffle([['막대그래프', true], ['그림그래프', true], ['원그래프', true], ['꺾은선그래프', false]]);
      return C('어느 지역의 마을별 사과 생산량을 조사하였다. 이 자료를 나타내기에 알맞지 않은 그래프는?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: '마을은 시간의 차례가 아니므로 변화를 나타내는 꺾은선그래프는 알맞지 않다. 막대그래프와 그림그래프로는 마을별 생산량을, 원그래프로는 전체에 대한 마을별 생산량의 비율을 나타낼 수 있다.', facts: truthOf(rows, false)
      });
    }),
    T('kind-who', '알맞지 않은 그래프를 고른 사람', '①55·56 심59', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), change = d.shuffle(CHANGE), share = d.shuffle(SHARE), flip = d.bool();
      const bad = flip ? [`「${share[1]}」${tail(share[1], '을/를')} 알아보려고 꺾은선그래프로 나타낼 거야.`, share[1], '전체에 대한 각 부분의 비율을 알아보는 것이므로 띠그래프나 원그래프가 알맞다'] : [`「${change[1]}」${tail(change[1], '을/를')} 알아보려고 원그래프로 나타낼 거야.`, change[1], '시간에 따른 변화를 알아보는 것이므로 꺾은선그래프가 알맞다'];
      const says = d.shuffle([[`「${change[0]}」${tail(change[0], '을/를')} 알아보려고 꺾은선그래프로 나타낼 거야.`, true], [`「${share[0]}」${tail(share[0], '을/를')} 알아보려고 띠그래프로 나타낼 거야.`, true], [bad[0], false]]);
      return C('세 사람이 조사한 자료를 그래프로 나타내려고 한다. 알맞지 않은 그래프를 고른 사람은?', who, says.findIndex((s) => !s[1]), {
        figure: lines(says.map((s, at) => `${who[at]}: ${s[0]}`)), explain: `「${bad[1]}」${tail(bad[1], '은/는')} ${bad[2]}.`, facts: { truth: says.map((s) => s[1]), want: false }
      });
    }),
    T('kind-names', '같은 자료를 나타낸 세 그래프의 이름', '②51 ③44', (d) => {
      const months = ['3월', '4월', '5월', '6월'], p = parts(d, 4, { lo: 10, hi: 40, ok: distinct }), v = p.map((x) => x * 2), kinds = ['막대그래프', '꺾은선그래프', '띠그래프'];
      const figs = [barChart(months, v, { step: 10, unit: '명', title: '월' }), lineChart(months, v, { step: 10, unit: '명', title: '월' }), band(months.map((name, i) => ({ name, pct: p[i] })))];
      const order = d.shuffle([0, 1, 2]), orders = d.shuffle([order].concat(d.shuffle(PERM3.filter((x) => x.join() !== order.join())).slice(0, 3)));
      return C('어느 도서관의 월별 방문자 수를 조사하여 세 가지 그래프로 나타내었다. (가), (나), (다)는 차례로 무슨 그래프인가?', orders.map((o) => o.map((i) => kinds[i]).join(', ')), orders.indexOf(order), {
        figure: order.map((i, at) => cap(['(가)', '(나)', '(다)'][at], figs[i])).join(''),
        explain: '막대의 길이로 수량을 나타낸 것은 막대그래프, 점을 찍어 선분으로 이은 것은 꺾은선그래프, 전체에 대한 각 부분의 비율을 띠 모양에 나타낸 것은 띠그래프이다.', facts: { truth: orders.map((o) => o === order), want: true }
      });
    }),
    T('kind-use', '같은 자료의 두 그래프 가운데 알아보기에 편리한 그래프', '①57·58 ②36·52 ③46·48의 변형 심60·61', (d) => {
      const g = make(d, 'color', 4, { ok: distinct }), c = g.c, n = counts(g, 40), [a, b] = d.shuffle(g.names), barFirst = d.bool(), bar = barFirst ? '(가)' : '(나)', strip = barFirst ? '(나)' : '(가)';
      const figs = [barChart(g.names, n, { step: 2, unit: '명', title: '색깔' }), band(cells(g, { show: 'name' }))];
      const rows = d.shuffle([[`㉠ ${bar}, ㉡ ${strip}`, true], [`㉠ ${strip}, ㉡ ${bar}`, false], [`㉠ ${bar}, ㉡ ${bar}`, false], [`㉠ ${strip}, ㉡ ${strip}`, false]]);
      return C(`${c.intro} 조사하여 두 가지 그래프 (가), (나)로 나타내었다. ㉠ ${josa(a, '을/를')} 좋아하는 학생이 몇 명인지, ㉡ ${josa(b, '을/를')} 좋아하는 학생이 전체의 몇 %인지 알아보려고 한다. 눈금을 읽어 바로 알 수 있는 그래프를 바르게 짝 지은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: cap('(가)', figs[barFirst ? 0 : 1]) + cap('(나)', figs[barFirst ? 1 : 0]),
        explain: `막대그래프 ${bar}의 눈금은 학생 수를 나타내므로 학생 수를 바로 읽을 수 있고, 띠그래프 ${strip}의 눈금은 백분율을 나타내므로 전체에 대한 비율을 바로 읽을 수 있다.`, facts: truthOf(rows, true)
      });
    }),
    T('kind-feature', '여러 가지 그래프의 특징', '②55 심59', (d) => {
      const good = { 막대: '막대그래프는 막대의 길이로 수량의 많고 적음을 비교하기 쉽다.', 꺾은선: '꺾은선그래프는 시간에 따른 수량의 변화를 알아보기 쉽다.', 띠: '띠그래프는 전체에 대한 각 부분의 비율을 띠 모양에 나타낸다.', 원: '원그래프는 전체에 대한 각 부분의 비율을 한눈에 알아보기 쉽다.' };
      const [kind, wrong] = d.pick([['띠', '띠그래프는 시간에 따라 수량이 변하는 모습을 알아보기 쉽다.'], ['꺾은선', '꺾은선그래프는 전체에 대한 각 부분의 비율을 한눈에 알아보기 쉽다.'], ['막대', '막대그래프는 선분이 기울어진 정도로 변화의 크기를 알 수 있다.']]);
      const rows = d.shuffle(Object.keys(good).filter((key) => key !== kind).map((key) => [good[key], true]).concat([[wrong, false]]));
      return C('그래프에 대한 설명으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: '막대그래프는 수량의 많고 적음을, 꺾은선그래프는 시간에 따른 변화를, 띠그래프와 원그래프는 전체에 대한 각 부분의 비율을 알아보기 쉽다.', facts: truthOf(rows, false)
      });
    }),
    T('kind-feature-name', '특징을 보고 그래프의 이름 찾기', '②52·53·55의 변형 심58', (d) => {
      const list = d.shuffle(['그림그래프', '띠그래프', '꺾은선그래프', '원그래프']);
      return C('조사한 수를 그림의 크기와 수로 나타내어, 지역마다 수량이 많고 적음을 한눈에 알아보기 쉬운 그래프는?', list, list.indexOf('그림그래프'), {
        explain: '그림그래프는 조사한 수를 그림의 크기와 수로 나타낸다. 띠그래프와 원그래프는 비율을, 꺾은선그래프는 변화를 나타낸다.', facts: { truth: list.map((w) => w === '그림그래프'), want: true }
      });
    }),
    T('kind-judge', '막대그래프가 비율을 알아보기에 알맞은지 판단하기', '②56 ③46의 유의점', (d) => {
      const g = make(d, 'sport', 4, { ok: distinct }), c = g.c, n = counts(g, 40);
      const rows = d.shuffle([
        ['비율을 한눈에 알아보려면 백분율을 구하여 띠그래프나 원그래프로 나타내는 것이 알맞다.', true],
        ['막대의 길이를 나타내는 눈금의 수가 곧 백분율이므로 이 그래프로 충분하다.', false],
        ['비율을 알아보려면 점을 찍어 선분으로 이은 꺾은선그래프로 바꾸어야 한다.', false],
        ['막대가 네 개이므로 운동마다 전체의 25 %씩이라고 볼 수 있다.', false]
      ]);
      return C(`${lead(c, '막대그래프')} 전체 학생 수에 대한 운동별 학생 수의 비율을 한눈에 알아보려고 한다. 이에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: barChart(g.names, n, { step: 2, unit: '명', title: '운동' }),
        explain: '막대그래프는 항목별 수량의 많고 적음을 비교하기에 알맞다. 전체에 대한 각 부분의 비율을 한눈에 알아보려면 백분율을 구하여 띠그래프나 원그래프로 나타낸다.', facts: truthOf(rows, true)
      });
    }),
    T('kind-steps', '자료를 조사하여 그래프로 나타내는 차례', '②60 ③19의 변형', (d) => {
      const steps = ['알아보고 싶은 문제를 정한다.', '자료를 수집한다.', '수집한 자료를 표로 정리한다.', '알맞은 그래프로 나타내고 해석한다.'];
      const shown = mixed(d, 4), right = [0, 1, 2, 3].map((s) => shown.indexOf(s)), orders = orderOptions(d, right);
      return C('알아보고 싶은 것을 조사하여 그래프로 나타내는 과정을 차례 없이 늘어놓았다. 차례대로 늘어놓은 것은?', orders.map((o) => o.map((i) => MARKS[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: tagged(shown.map((s) => steps[s]), MARKS),
        explain: `문제를 정하고(${MARKS[right[0]]}), 자료를 수집하여(${MARKS[right[1]]}), 표로 정리한 다음(${MARKS[right[2]]}), 알맞은 그래프로 나타내고 해석한다(${MARKS[right[3]]}).`,
        facts: { truth: orders.map((o) => o.join() === right.join()), want: true }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
