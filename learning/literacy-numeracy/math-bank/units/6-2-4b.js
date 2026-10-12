// 6학년 2학기 4단원 비례식과 비례배분 — 기본 문항(비례식, 비례식의 성질, 비례식의 활용).
// 단원 틀과 함께 쓰는 도구(B.kit.r624), 싣는 기준, 뺀 것과 까닭은 6-2-4a.js 머리에 있다. 비례배분과 실력 문항은 6-2-4c.js 에 있다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, table, N, M, C, F, D } = B.kit;
  const { T, LAB, labelled, gcd, tail, ex, truthOf, ds, nat, dec, fr, mx, r, rj, R, P, simplify, quot, co, oneOf } = B.kit.r624;
  const U = '6-2-4';
  const PAIRS4 = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const tagged = (list) => lines(list.map((html, i) => `<span class="mb-tag mb-tag-short">${LAB[i]}</span>${html}`));
  const BOX = '□';
  // 네 값으로 적은 식 「x : y = z : w」가 비례식인가(외항의 곱과 내항의 곱을 자연수로 견준다)와, 검사가 다시 셈할 짝 [식 글, 적힌 값].
  const outer = (x, y, z, w) => x.p * w.p * y.q * z.q, inner = (x, y, z, w) => y.p * z.p * x.q * w.q;
  const isProp = (x, y, z, w) => outer(x, y, z, w) === inner(x, y, z, w);
  const claim = (x, y, z, w) => [`${x.p * w.p}*${y.q * z.q}`, inner(x, y, z, w)];
  const PV = (x, y, z, w) => P(x.html, y.html, z.html, w.html);
  const plain = (x, y, z, w) => `${x} : ${y} = ${z} : ${w}`;
  const N4 = (list) => list.map(nat);

  // ── 그림 ──
  // 두 줄 수직선: 위아래 눈금이 맞선다. tops·bottoms 는 눈금마다 적는 글(적지 않는 눈금은 '').
  function twin(names, tops, bottoms) {
    const n = tops.length, x0 = 66, L = 204, width = x0 + L + 30, x = (i) => (x0 + (i / (n - 1)) * L).toFixed(1);
    let out = '';
    [[24, tops, -9], [62, bottoms, 19]].forEach(([y, list, dy], row) => {
      out += `<line class="mb-axis" x1="${x0}" y1="${y}" x2="${x0 + L + 12}" y2="${y}"/><text class="mb-km-label" x="2" y="${y + 4}">${names[row]}</text>`;
      list.forEach((label, i) => { out += `<line class="mb-axis" x1="${x(i)}" y1="${y - 5}" x2="${x(i)}" y2="${y + 5}"/>` + (label === '' ? '' : `<text class="mb-km-label" x="${x(i)}" y="${y + dy}" text-anchor="middle">${label}</text>`); });
    });
    for (let i = 1; i < n; i += 1) out += `<line x1="${x(i)}" y1="29" x2="${x(i)}" y2="57" style="stroke:#94a3b8;stroke-width:1;stroke-dasharray:3 3"/>`;
    const said = (list) => list.map((label) => (label === '' ? '빈 눈금' : label)).join(', ');
    return `<svg class="mb-numberline" viewBox="0 0 ${width} 86" width="${width}" role="img" aria-label="눈금이 맞선 두 줄 수직선: ${names[0]} — ${said(tops)} / ${names[1]} — ${said(bottoms)}">${out}</svg>`;
  }

  B.addTypes(U, 'eq', [
    T('eq-word', '비례식의 뜻', '①23 ②27 ③26', (d) => {
      const [a, b] = co(d, 2, 9), k = d.int(2, 4), opts = d.shuffle(['비례식', '비례배분', '비율', '백분율']);
      return C(`${a} : ${b} = ${a * k} : ${josa(b * k, '과/와')} 같이 비율이 같은 두 비를 기호 =를 사용하여 나타낸 식을 무엇이라고 하는가?`, opts, opts.indexOf('비례식'), {
        explain: '비율이 같은 두 비를 기호 =를 사용하여 나타낸 식을 비례식이라고 한다.', facts: truthOf(opts.map((o) => o === '비례식'), true)
      });
    }),
    T('eq-form-pick', '여러 식 가운데 비례식 고르기', '①24 ②28 ③27 심21', (d) => {
      const [a, b] = co(d, 2, 9), k = d.int(2, 5), [p, q] = co(d, 2, 9), s = d.int(11, 19), x = d.int(5, 9), y = d.int(11, 16), e = d.int(1, 4), [m, n] = co(d, 2, 5), t = d.int(2, 3);
      const wrong = d.shuffle([[`${p} : ${q}`, false], [`${p} : ${q} = ${s}`, false], [`${x} + ${y} = ${x + e} + ${y - e}`, false], [`${m * t} × ${n} = ${m} × ${n * t}`, false]]).slice(0, 3);
      return oneOf(d, '다음 중 비례식은?', [[plain(a, b, a * k, b * k), true]].concat(wrong), true, {
        explain: `비율이 같은 두 비를 기호 =를 사용하여 나타낸 식이 비례식이다. ${a} : ${josa(b, '과/와')} ${a * k} : ${b * k}의 비율은 ${frac(a, b)}${tail(a, '으로/로')} 같다. 비 하나만 있는 식이나 덧셈식·곱셈식은 비례식이 아니다.`
      });
    }),
    T('eq-true-pick', '두 비의 비율을 비교하여 비례식 가려내기', '①25·35 ②29 ③27·35 심21', (d, n) => {
      const one = (kind) => {
        const [a, b] = co(d, 2, 9), k = d.int(2, 5), u = d.until(() => d.int(1, 9), (v) => (a * v) % 10 !== 0 && (b * v) % 10 !== 0);
        if (kind === 'true') return N4([a, b, a * k, b * k]);
        if (kind === 'off') return N4([a, b, a * k, b * (k + 1)]);
        if (kind === 'add') return N4([a, b, a * 2, b + a]);
        if (kind === 'swap') return N4([a, b, b * k, a * k]);
        if (kind === 'dec') return [dec(a * u, 1), dec(b * u, 1), nat(a * k), nat(b * k)];
        if (kind === 'natdec') return [nat(a * k), nat(b * k), dec(a * u, 1), dec(b * u, 1)];
        if (kind === 'unit') { const g = gcd(a + 1, b + 1); return [fr(1, a + 1), fr(1, b + 1), nat((b + 1) / g * k), nat((a + 1) / g * k)]; }
        if (kind === 'sameden') { const den = [11, 13, 17].find((x) => x > Math.max(a, b)); return [fr(a, den), fr(b, den), nat(a * k), nat(b * k)]; }
        if (kind === 'decoff') return [dec(a * u, 1), dec(b * u, 1), nat(a * k), nat(b * k + b + 1)];
        return [fr(1, a + 1), fr(1, b + 1), nat((a + 1) * k), nat((b + 1) * k)];   // unitbad: 분모의 비를 그대로 적었다.
      };
      const kinds = n === 0 ? ['true', 'off', 'add', 'swap'] : d.shuffle(['dec', 'natdec', 'unit', 'sameden']).slice(0, 3).concat([d.pick(['decoff', 'unitbad'])]);
      const rows = d.until(() => d.shuffle(kinds.map(one)), (list) => list.filter((v) => isProp(...v)).length === (n === 0 ? 1 : 3) && new Set(list.map((v) => PV(...v))).size === 4);
      const want = n === 0, hit = rows.findIndex((v) => isProp(...v) === want), v = rows[hit], s1 = simplify(v[0], v[1]), s2 = simplify(v[2], v[3]);
      return oneOf(d, want ? '옳은 비례식은?' : '비례식이 아닌 것은?', rows.map((row) => [PV(...row), isProp(...row), claim(...row)]), want, {
        tags: true, keep: true,
        explain: (row, tag) => `${tag}의 두 비를 가장 간단한 자연수의 비로 나타내면 ${s1.a} : ${s1.b}, ${s2.a} : ${s2.b}이다. ${want ? '두 비의 비율이 같으므로 비례식이다.' : '두 비의 비율이 다르므로 비례식이 아니다.'}`,
        facts: { rule: want ? 'true-nat' : 'false-mixed' }
      });
    }, { count: 2 }),
    T('eq-fill-ratio', '비례식의 한쪽에 들어갈 수 있는 비 고르기', '①26 ②5 ③29 심24', (d) => {
      const [a, b] = co(d, 2, 9), right = d.int(0, 2), k = d.int(2, 6), c = d.int(1, 3), u = d.until(() => d.int(1, 9), (v) => (a * v) % 10 !== 0 && (b * v) % 10 !== 0 && a * v <= 60 && b * v <= 60);
      // 보기: 소수의 비(틀린 것은 차례를 뒤바꿈) / 단위분수의 비(틀린 것은 분모를 그대로 적음) / 자연수의 비(틀린 것은 한쪽에만 맞게 곱함) / 같은 수를 더한 비
      const list = [right === 0 ? [dec(a * u, 1), dec(b * u, 1)] : [dec(b * u, 1), dec(a * u, 1)], right === 1 ? [fr(1, b), fr(1, a)] : [fr(1, a), fr(1, b)], right === 2 ? [nat(a * k), nat(b * k)] : [nat(a * k), nat(b * (k + 1))], [nat(a + c), nat(b + c)]];
      return oneOf(d, '□ 안에 들어갈 수 있는 비는?', list.map(([x, y]) => [R(x, y), x.p * y.q * b === y.p * x.q * a, [`${x.p * y.q}*${b}`, y.p * x.q * a]]), true, {
        figure: ex(`${a} : ${b} <i>=</i> ${box()}`),
        explain: (row) => { const [x, y] = list[right]; return `비례식이 되려면 ${a} : ${josa(b, '과/와')} 비율이 같아야 한다. ${R(x, y)}${tail(y.last, '을/를')} 가장 간단한 자연수의 비로 나타내면 ${a} : ${b}이다.`; }
      });
    }),
    T('eq-find-two', '여러 비에서 비율이 같은 두 비 찾기', '①27 ②31 ③30 심23', (d, n) => {
      const rows = d.until(() => {
        const [a, b] = co(d, 2, 9), [k1, k2, k3, k4] = d.shuffle([1, 2, 3, 4, 5, 6]), u = d.until(() => d.int(1, 9), (v) => (a * v) % 10 !== 0 && (b * v) % 10 !== 0);
        const same = n === 0 ? [N4([a * k1, b * k1]), N4([a * k2, b * k2])] : [[fr(1, b), fr(1, a)], [dec(a * u, 1), dec(b * u, 1)]];
        return d.shuffle(same.concat([N4([a * k3, b * k3 + d.pick([1, 2, b])]), N4([b * k4, a * k4])]));
      }, (list) => PAIRS4.filter(([i, j]) => isProp(list[i][0], list[i][1], list[j][0], list[j][1])).length === 1 && new Set(list.map(([x, y]) => R(x, y))).size === 4 && list.every(([x, y]) => x.p * y.q !== y.p * x.q));
      const same = (i, j) => isProp(rows[i][0], rows[i][1], rows[j][0], rows[j][1]), [i, j] = PAIRS4.find(([p, q]) => same(p, q)), s = simplify(rows[i][0], rows[i][1]);
      return oneOf(d, '비율이 같은 두 비를 찾아 비례식을 세우려고 한다. 두 비는?', PAIRS4.map(([p, q]) => [`${LAB[p]}, ${LAB[q]}`, same(p, q), claim(rows[p][0], rows[p][1], rows[q][0], rows[q][1])]), true, {
        keep: true, figure: tagged(rows.map(([x, y]) => R(x, y))),
        explain: `가장 간단한 자연수의 비로 나타내면 ${rows.map(([x, y], k) => { const t = simplify(x, y); return `${LAB[k]} ${t.a} : ${t.b}`; }).join(', ')}이다. ${LAB[i]}과 ${LAB[j]}의 비율이 같으므로 ${R(rows[i][0], rows[i][1])} = ${R(rows[j][0], rows[j][1])}${tail(rows[j][1].last, '으로/로')} 비례식을 세울 수 있다.`,
        facts: { rule: n === 0 ? 'two-nat' : 'two-mixed' }
      });
    }, { count: 2 }),
    T('eq-left-over', '비례식 두 개를 세우고 남는 비 찾기', '②32', (d) => {
      const v = d.until(() => {
        const [a, b] = co(d, 2, 7), [c, e] = co(d, 2, 7), [k1, k2, k3, k4, k5] = d.shuffle([1, 2, 3, 4, 5]), lone = d.bool() ? [a * k5, b * k5 + b] : [b * k5, a * k5];
        return { lone, rows: d.shuffle([[a * k1, b * k1], [a * k2, b * k2], [c * k3, e * k3], [c * k4, e * k4], lone]) };
      }, (o) => o.rows.every((x) => o.rows.filter((y) => y !== x && x[0] * y[1] === x[1] * y[0]).length === (x === o.lone ? 0 : 1)) && new Set(o.rows.map((x) => x.join(':'))).size === 5);
      const hit = v.rows.indexOf(v.lone), groups = v.rows.map((x) => { const g = gcd(x[0], x[1]); return r(x[0] / g, x[1] / g); });
      return C('다섯 비 가운데 비율이 같은 비를 둘씩 짝 지어 비례식을 두 개 세웠다. 짝이 없는 비는?', LAB, hit, {
        figure: lines([v.rows.map((x, i) => `<span style="display:inline-block;margin-right:16px;white-space:nowrap">${LAB[i]} ${r(...x)}</span>`).join('')]),
        explain: `가장 간단한 자연수의 비로 나타내면 ${groups.map((g, i) => `${LAB[i]} ${g}`).join(', ')}이다. ${LAB[hit]}과 비율이 같은 비는 없다.`,
        facts: truthOf(v.rows.map((x) => x === v.lone), true)
      });
    }),
    T('eq-rate-pick', '비율이 주어진 두 비로 세운 비례식 고르기', '①27 ②31·33', (d) => {
      const [p, q] = co(d, 2, 9, (x, y) => x < y), [k, m] = d.until(() => [d.int(1, 5), d.int(2, 6)], ([x, y]) => x !== y);
      // 보기: 정답 / 비율이 뒤집힌 비례식(q/p) / 앞의 비만 비율이 맞고 비례식이 아닌 식 / 전항끼리·후항끼리 바꿔 적어 비례식이 아닌 식
      const rows = [[p * k, q * k, p * m, q * m], [q * k, p * k, q * m, p * m], [p * k, q * k, p * m, q * m + q], [p * m, q * k, p * k, q * m]];
      const check = ([x, y, z, w]) => x * w === y * z && x * q === y * p;
      return oneOf(d, `비율이 ${frac(p, q)}인 두 비로 세운 비례식은?`, rows.map((v) => [plain(...v), check(v), [`(${v[0]}*${v[3]}-${v[1]}*${v[2]})*(${v[0]}*${v[3]}-${v[1]}*${v[2]})+(${v[0]}*${q}-${v[1]}*${p})*(${v[0]}*${q}-${v[1]}*${p})`, 0]]), true, {
        explain: `${p * k} : ${q * k}의 비율은 ${frac(p * k, q * k)}, ${p * m} : ${q * m}의 비율은 ${frac(p * m, q * m)}이고 둘 다 ${frac(p, q)}${tail(p, '과/와')} 같다. 비율은 (전항) ÷ (후항)이므로 전항과 후항의 차례가 바뀌면 비율이 달라진다.`
      });
    }),
    T('eq-rates', '크기가 같은 두 비율을 비례식으로 나타내기', '①28 심23', (d) => {
      const [a, b] = co(d, 2, 9, (x, y) => x < y), k = d.int(2, 6);
      return M('두 비율이 같음을 이용하여 비례식을 세웠다. ㉠, ㉡에 알맞은 수는?', labelled([a, b * k]), {
        figure: lines([ex(`${frac(a, b)} <i>=</i> ${frac(a * k, b * k)}`), P(box(LAB[0]), b, a * k, box(LAB[1]))]),
        explain: `비율 ${frac(a, b)}${tail(a, '은/는')} ${a} : ${b}의 비율이고, 비율 ${frac(a * k, b * k)}${tail(a * k, '은/는')} ${a * k} : ${b * k}의 비율이다. 따라서 ${a} : ${b} = ${a * k} : ${b * k}이다.`,
        facts: { calc: [[String(a), 0], [String(b * k), 1]] }
      });
    }),
    T('eq-table', '표를 보고 바르게 세운 비례식 고르기', '①30 ②34', (d) => {
      const [x, y, ux, uy] = d.pick([['쿠키', '달걀', '개', '개'], ['학생', '색종이', '명', '장'], ['모둠', '도화지', '개', '장'], ['꽃병', '장미', '개', '송이']]);
      const [a, b] = co(d, 2, 9), k = d.int(2, 4), rows = [[a, b, a * k, b * k], [a, b, b * k, a * k], [a, a * k, b * k, b], [a, b * k, a * k, b]];
      return oneOf(d, `${x} 수와 ${y} 수 사이의 관계를 나타낸 표이다. ${x} 수와 ${y} 수의 비로 비례식을 바르게 세운 것은?`, rows.map((v) => [plain(...v), v[0] * v[3] === v[1] * v[2], [`${v[0]}*${v[3]}`, v[1] * v[2]]]), true, {
        figure: table([`${x} 수(${ux})`, `${y} 수(${uy})`], [[a, b], [a * k, b * k]]),
        explain: `${x} 수와 ${y} 수의 비는 ${a} : ${b}, ${a * k} : ${b * k}이고 두 비의 비율이 같으므로 ${a} : ${b} = ${a * k} : ${b * k}이다. 두 비 모두 ${x} 수를 전항에, ${y} 수를 후항에 적어야 한다.`
      });
    }),
    T('term-outer', '비례식에서 외항과 내항 찾기', '①69 ②77 ③74 심28', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9), [s, t] = d.shuffle([1, 2, 3, 4, 5, 6]); return [a * s, b * s, a * t, b * t]; }, (l) => new Set(l).size === 4), out = d.bool(), ans = out ? [v[0], v[3]] : [v[1], v[2]];
      return M(`비례식에서 ${out ? '외항' : '내항'}을 모두 쓰시오.`, ans.map((answer) => ({ answer })), {
        unordered: true, figure: P(...v),
        explain: `비례식에서 바깥쪽에 있는 두 수 ${v[0]}${tail(v[0], '과/와')} ${v[3]}${tail(v[3], '을/를')} 외항, 안쪽에 있는 두 수 ${v[1]}${tail(v[1], '과/와')} ${v[2]}${tail(v[2], '을/를')} 내항이라고 한다.`,
        facts: { calc: [[String(ans[0]), 0], [String(ans[1]), 1]] }
      });
    }),
    T('term-both', '내항이면서 전항(후항)인 수 찾기', '①68·69 ②76·78 ③73 심27·28', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9), [s, t] = d.shuffle([1, 2, 3, 4, 5, 6]); return [a * s, b * s, a * t, b * t]; }, (l) => new Set(l).size === 4), i = d.int(0, 3);
      return N(`비례식 ${plain(...v)}에서 ${i === 0 || i === 3 ? '외항' : '내항'}이면서 ${i % 2 === 0 ? '전항' : '후항'}인 수는?`, v[i], {
        explain: `외항은 ${v[0]}${tail(v[0], '과/와')} ${v[3]}, 내항은 ${v[1]}${tail(v[1], '과/와')} ${v[2]}이다. 전항은 ${v[0]}${tail(v[0], '과/와')} ${v[2]}, 후항은 ${v[1]}${tail(v[1], '과/와')} ${v[3]}이다. 두 가지에 모두 드는 수는 ${v[i]}이다.`,
        facts: { calc: [[String(v[i]), 0]] }
      });
    })
  ]);

  B.addTypes(U, 'law', [
    T('law-products', '외항의 곱과 내항의 곱 구하기', '①34 ②39 ③33', (d, n) => {
      const v = d.until(() => {
        const [a, b] = co(d, 2, 9), [s, t] = d.until(() => [d.int(1, 6), d.int(2, 7)], ([x, y]) => x !== y), u = d.until(() => d.int(1, 9), (x) => (a * x) % 10 !== 0 && (b * x) % 10 !== 0), k = d.pick([10, 20, 30]);
        return n === 0 ? N4([a * s, b * s, a * t, b * t]) : [dec(a * u, 1), dec(b * u, 1), nat(a * k), nat(b * k)];
      }, (l) => l[0].p * l[3].p / (l[0].q * l[3].q) <= 300), prod = v[0].p * v[3].p / (v[0].q * v[3].q), q1 = quot([v[0], v[3]], [], prod), q2 = quot([v[1], v[2]], [], prod);
      return M('비례식에서 외항의 곱과 내항의 곱을 각각 구하시오.', [{ label: '외항의 곱', answer: prod }, { label: '내항의 곱', answer: prod }], {
        figure: PV(...v),
        explain: `외항의 곱은 ${v[0].html} × ${v[3].html} = ${prod}, 내항의 곱은 ${v[1].html} × ${v[2].html} = ${prod}이다. 비례식에서 외항의 곱과 내항의 곱은 같다.`,
        facts: { calc: [[q1.text, 0], [q2.text, 1]], unseen: q1.unseen.concat(q2.unseen), rule: ['products-nat', 'products-dec'][n] }
      });
    }, { count: 2 }),
    T('law-check', '외항의 곱과 내항의 곱으로 비례식인지 알아보기', '①35·36 ②29 ③35 심21·22', (d) => {
      // 보기마다 결론은 그 보기에 적힌 두 곱에서 바르게 나온 것이다. 틀린 보기는 곱을 잘못 구했다: 전항끼리·후항끼리 곱한 것, 앞의 비·뒤의 비의 두 수를 곱한 것, 한 곱을 다르게 셈한 것.
      const v = d.until(() => {
        const [a, b] = co(d, 2, 9), k = d.int(2, 5), ok = d.bool(), [x, y, z, w] = ok ? [a, b, a * k, b * k] : d.pick([[a, b, a * k, b * k + b], [a, b, a * 2, b + a], [a, b, a * k, b * k - 1]]), X = x * w, Y = y * z;
        return { x, y, z, w, X, Y, rows: [[X, Y], [x * z, y * w], [x * y, z * w], ok ? [X, Y + y] : [X, X]] };
      }, (o) => new Set(o.rows.map((row) => row.join())).size === 4 && o.rows.filter(([p, q]) => p === o.X && q === o.Y).length === 1);
      const { x, y, z, w, X, Y } = v, said = ([p, q]) => `외항의 곱은 ${p}, 내항의 곱은 ${josa(q, '으로/로')} 서로 ${p === q ? '같으므로 비례식이다.' : '다르므로 비례식이 아니다.'}`;
      return oneOf(d, '두 비를 기호 =로 이은 식이 비례식인지 알아보려고 외항의 곱과 내항의 곱을 구하였다. 바르게 말한 것은?', v.rows.map((row) => [said(row), row[0] === X && row[1] === Y, [`(${x}*${w}-${row[0]})*(${x}*${w}-${row[0]})+(${y}*${z}-${row[1]})*(${y}*${z}-${row[1]})`, 0]]), true, {
        figure: P(x, y, z, w),
        explain: `외항의 곱은 ${x} × ${w} = ${X}, 내항의 곱은 ${y} × ${z} = ${Y}이다. 두 곱이 ${X === Y ? '같으므로 비례식이다.' : '다르므로 비례식이 아니다.'}`
      });
    }),
    T('law-product-know','모르는 수를 구하지 않고 외항의 곱·내항의 곱 구하기', '①42 ②39 ③42 심26', (d, n) => {
      const [a, b] = co(d, 2, 9), [s, t] = d.until(() => [d.int(1, 5), d.int(2, 7)], ([x, y]) => x !== y), v = [a * s, b * s, a * t, b * t];
      if (n === 0) {
        const hide = d.int(0, 3), isOuter = hide === 0 || hide === 3, shown = v.map((x, i) => (i === hide ? BOX : x)), known = isOuter ? [v[1], v[2]] : [v[0], v[3]];
        return N(`비례식 ${plain(...shown)}에서 ${isOuter ? '외항' : '내항'}의 곱은?`, known[0] * known[1], {
          explain: `비례식에서 외항의 곱과 내항의 곱은 같다. ${isOuter ? '내항' : '외항'}의 곱이 ${known[0]} × ${known[1]} = ${known[0] * known[1]}이므로 ${isOuter ? '외항' : '내항'}의 곱도 ${known[0] * known[1]}이다.`,
          facts: { calc: [[`${known[0]}*${known[1]}`, 0]], rule: 'know-one' }
        });
      }
      return N(`비례식 ${v[0]} : ㉠ = ㉡ : ${v[3]}에서 ㉠ × ㉡의 값은?`, v[0] * v[3], {
        explain: `㉠ × ㉡은 내항의 곱이다. 비례식에서 내항의 곱은 외항의 곱과 같으므로 ${v[0]} × ${v[3]} = ${v[0] * v[3]}이다.`,
        facts: { calc: [[`${v[0]}*${v[3]}`, 0]], rule: 'know-two' }
      });
    }, { count: 2 }),
    T('law-product-other', '곱과 한 항으로 다른 항 구하기', '①42 ②43', (d) => {
      const x = d.int(3, 9), y = d.until(() => d.int(3, 12), (v) => v !== x), inner = d.bool(), A = inner ? '내항' : '외항', A2 = inner ? '외항' : '내항';
      return N(`어떤 비례식에서 ${A}의 곱이 ${x * y}이고, ${A2} 가운데 하나가 ${x}이다. 다른 ${A2}은?`, y, {
        explain: `비례식에서 외항의 곱과 내항의 곱은 같으므로 ${A2}의 곱도 ${x * y}이다. ${x * y} ÷ ${x} = ${y}이다.`,
        facts: { calc: [[`${x * y}/${x}`, 0]] }
      });
    }),
    T('law-setup', '비례식의 성질로 바르게 세운 식 고르기', '①37 ②47 심30', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9), [s, t] = d.shuffle([1, 2, 3, 4, 5, 6]); return [a * s, b * s, a * t, b * t]; }, (l) => new Set(l).size === 4 && l[0] * l[2] !== l[1] * l[3] && l[0] * l[1] !== l[2] * l[3]);
      const hide = d.int(0, 3), s = v.map((x, i) => (i === hide ? BOX : x));
      const rows = [[`${s[0]} × ${s[3]} = ${s[1]} × ${s[2]}`, true, [`${v[0]}*${v[3]}`, v[1] * v[2]]], [`${s[0]} × ${s[2]} = ${s[1]} × ${s[3]}`, false, [`${v[0]}*${v[2]}`, v[1] * v[3]]], [`${s[0]} × ${s[1]} = ${s[2]} × ${s[3]}`, false, [`${v[0]}*${v[1]}`, v[2] * v[3]]]];
      return oneOf(d, `비례식 ${plain(...s)}에서 □의 값을 구하려고 한다. 비례식의 성질을 이용하여 바르게 세운 식은?`, rows, true, {
        explain: `비례식에서 외항의 곱과 내항의 곱은 같다. 외항은 ${s[0]}${s[0] === BOX ? '와' : tail(v[0], '과/와')} ${s[3]}, 내항은 ${s[1]}${s[1] === BOX ? '와' : tail(v[1], '과/와')} ${s[2]}이므로 ${s[0]} × ${s[3]} = ${s[1]} × ${s[2]}이고, □ = ${v[hide]}이다.`
      });
    }),
    T('law-solve', '비례식의 □ 구하기(자연수)', '①37 ②30·40 ③28·37 심30', (d, n) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 13), [s, t] = d.until(() => [d.int(1, 9), d.int(1, 9)], ([x, y]) => x !== y); return [a * s, b * s, a * t, b * t]; }, (l) => Math.max(...l) <= 72 && l[0] * l[3] <= 900 && l[2] % l[0] !== 0 && l[0] % l[2] !== 0);
      const hide = n === 0 ? d.pick([0, 3]) : d.pick([1, 2]), s = v.map((x, i) => (i === hide ? box() : x)), isOuter = n === 0, pair = isOuter ? [v[1], v[2]] : [v[0], v[3]], other = isOuter ? v[3 - hide] : v[3 - hide];
      return N('□ 안에 알맞은 수는?', v[hide], {
        figure: P(...s),
        explain: `외항의 곱과 내항의 곱은 같다. □ × ${other} = ${pair[0]} × ${pair[1]} = ${pair[0] * pair[1]}이므로 □ = ${pair[0] * pair[1]} ÷ ${other} = ${v[hide]}이다.`,
        facts: { calc: [[`${pair[0]}*${pair[1]}/${other}`, 0]], rule: isOuter ? 'solve-outer' : 'solve-inner' }
      });
    }, { count: 2 }),
    T('law-solve-steps', '비례식의 성질로 □를 구하는 과정의 빈칸 채우기', '①37·45 ②41 ③36', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9), [s, t] = d.until(() => [d.int(1, 6), d.int(2, 9)], ([x, y]) => x !== y); return [a * s, b * s, a * t, b * t]; }, (l) => new Set(l).size === 4 && l[0] * l[3] <= 600);
      return M('비례식의 성질을 이용하여 ★의 값을 구하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([v[3], v[0] * v[3], v[2]]), {
        figure: lines([P(v[0], v[1], '★', v[3]), ex(`${v[0]} <i>×</i> ${box(LAB[0])} <i>=</i> ${v[1]} <i>×</i> ★`), ex(`${v[1]} <i>×</i> ★ <i>=</i> ${box(LAB[1])}`), ex(`★ <i>=</i> ${box(LAB[2])}`)]),
        explain: `외항의 곱은 ${v[0]} × ${v[3]} = ${v[0] * v[3]}, 내항의 곱은 ${v[1]} × ★이다. 두 곱이 같으므로 ${v[1]} × ★ = ${v[0] * v[3]}, ★ = ${v[0] * v[3]} ÷ ${v[1]} = ${v[2]}이다.`,
        facts: { calc: [[String(v[3]), 0], [`${v[0]}*${v[3]}`, 1], [`${v[0]}*${v[3]}/${v[1]}`, 2]] }
      });
    }),
    T('law-solve-dec', '소수가 든 비례식의 □ 구하기', '①38 ③28·38', (d) => {
      const v = d.until(() => {
        const [a, b] = co(d, 2, 9), u = d.int(2, 9), t = d.int(2, 9), k = d.pick([10, 20, 30]);
        return d.bool() ? [dec(a * u, 1), dec(b * u, 1), nat(a * t), nat(b * t)] : [nat(a), dec(b * u, 1), nat(a * k), nat(b * u * k / 10)];
      }, (l) => l.every((x) => x.kind !== 'dec' || x.p % 10 !== 0) && l[2].p <= 99 && l[3].p <= 99 && l[2].p !== l[3].p);
      const hide = v[0].kind === 'nat' ? 3 : d.pick([2, 3]), s = v.map((x, i) => (i === hide ? box() : x.html)), q = hide === 3 ? quot([v[1], v[2]], [v[0]], v[3].p) : quot([v[0], v[3]], [v[1]], v[2].p);
      const pair = hide === 3 ? [v[1], v[2]] : [v[0], v[3]], other = hide === 3 ? v[0] : v[1], prod = pair[0].p * pair[1].p / (pair[0].q * pair[1].q);
      return N('□ 안에 알맞은 수는?', v[hide].p, {
        figure: P(...s),
        explain: `외항의 곱과 내항의 곱은 같다. ${other.html} × □ = ${pair[0].html} × ${pair[1].html} = ${Number.isInteger(prod) ? prod : ds(Math.round(prod * 10), 1)}이므로 □ = ${v[hide].p}이다.`,
        facts: { calc: [[q.text, 0]], unseen: q.unseen, rule: 'solve-dec' }
      });
    }),
    T('law-solve-dec-ans', '답이 소수인 비례식의 □ 구하기', '①38 ③39', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9), u = d.int(1, 9), t = d.int(1, 3); return { a, b, u, t }; }, (o) => (o.a * o.u) % 10 !== 0 && (o.b * o.u) % 10 !== 0 && o.a * o.u !== o.b * o.u && o.a * o.u < 100);
      const x = v.a * v.u, y = dec(v.b * v.u, 1), first = d.bool(), s = first ? [box(), y.html, v.a * v.t, v.b * v.t] : [v.a * v.t, v.b * v.t, box(), y.html];
      return D('□ 안에 알맞은 수는?', x / 10, {
        figure: P(...s),
        explain: `외항의 곱과 내항의 곱은 같다. □ × ${v.b * v.t} = ${y.html} × ${v.a * v.t} = ${ds(v.b * v.u * v.a * v.t, 1).replace(/\.0$/, '')}이므로 □ = ${ds(x, 1)}이다.`,
        facts: { calc: [[`${y.ex}*${v.a * v.t}/${v.b * v.t}`, 0]], rule: 'solve-dec-answer' }
      });
    }),
    T('law-solve-frac', '분수가 든 비례식의 □ 구하기', '①38 ②42 ③28·38 심31', (d, n) => {
      const v = d.until(() => {
        if (n === 0) {
          const [a, b] = co(d, 1, 8, (x, y) => x < y), [c, e] = co(d, 1, 8, (x, y) => x < y), x = fr(a, b), y = fr(c, e), s = simplify(x, y), t = d.int(1, 6);
          return [x, y, nat(s.a * t), nat(s.b * t)];
        }
        const [a, b] = co(d, 1, 5, (x, y) => x < y), y = mx(d.int(1, 2), a, b), k = d.int(1, 4), c = d.int(2, 9);
        return [nat(c), y, nat(c * k * y.q), nat(y.p * k)];
      }, (l) => l[2].p <= 99 && l[3].p <= 99 && l[2].p !== l[3].p && (n === 1 || (l[0].d !== l[1].d && l[0].d * l[1].d <= 72)));
      const hide = n === 0 ? d.pick([2, 3]) : 2, s = v.map((x, i) => (i === hide ? box() : x.html)), q = hide === 3 ? quot([v[1], v[2]], [v[0]]) : quot([v[0], v[3]], [v[1]]);
      const t = simplify(v[0], v[1]);
      return N('□ 안에 알맞은 수는?', v[hide].p, {
        figure: P(...s),
        explain: `${R(v[0], v[1])}${tail(v[1].last, '을/를')} 가장 간단한 자연수의 비로 나타내면 ${t.a} : ${t.b}이다. ${hide === 3 ? `${t.a} : ${t.b} = ${v[2].p} : □` : `${t.a} : ${t.b} = □ : ${v[3].p}`}에서 외항의 곱과 내항의 곱이 같으므로 □ = ${v[hide].p}이다.`,
        facts: { calc: [[q.text, 0]], unseen: q.unseen, rule: ['solve-frac', 'solve-mixed'][n] }
      });
    }, { count: 2 }),
    T('law-solve-frac-ans', '답이 분수인 비례식의 □ 구하기', '①38', (d) => {
      const v = d.until(() => { const [n, den] = co(d, 1, 7, (x, y) => x < y), b = d.int(2, 9), c = d.int(2, 12); return { n, den, b, c, g: gcd(n * c, den * b) }; }, (o) => o.b !== o.c && o.n * o.c < o.den * o.b && o.den * o.b / o.g <= 20 && o.den * o.b / o.g >= 2);
      const x = fr(v.n, v.den), p = v.n * v.c / v.g, q = v.den * v.b / v.g, whole = v.n * v.c % v.den === 0, g2 = gcd(v.n * v.c, v.den), mid = whole ? v.n * v.c / v.den : frac(v.n * v.c / g2, v.den / g2);
      return F('□ 안에 알맞은 수를 분수로 나타내시오.', p, q, {
        anyForm: true, figure: P(x.html, v.b, box(), v.c),
        explain: `외항의 곱과 내항의 곱은 같다. ${v.b} × □ = ${x.html} × ${v.c} = ${mid}이므로 □ = ${mid} ÷ ${v.b} = ${frac(p, q)}이다.`,
        facts: { calc: [[`${v.n}*${v.c}/${v.g}`, 0], [`${v.den}*${v.b}/${v.g}`, 1]], unseen: [v.g] }
      });
    }),
    T('law-compare', '비례식의 □에 알맞은 수의 크기 비교', '①39·40 ③40 심33', (d) => {
      const rows = d.until(() => {
        const one = (kind) => {
          const [a, b] = co(d, 2, 9), t = d.int(2, 9), u = d.int(2, 9), [p, q] = co(d, 2, 9), s = simplify(fr(1, p), fr(1, q));
          if (kind === 0) { const m = d.until(() => d.int(1, 6), (x) => x !== t); return [nat(a * m), nat(b * m), nat(a * t), nat(b * t)]; }
          if (kind === 1) return [dec(a * u, 1), dec(b * u, 1), nat(a * t), nat(b * t)];
          return [fr(1, p), fr(1, q), nat(s.a * t), nat(s.b * t)];
        };
        return d.shuffle([one(0), one(1), one(2)]);
      }, (l) => new Set(l.map((v) => v[3].p)).size === 3 && l.every((v) => v[2].p <= 99 && v[3].p <= 99 && v.every((x) => x.kind !== 'dec' || x.p % 10 !== 0)));
      const answers = rows.map((v) => v[3].p), best = Math.max(...answers);
      return C('□ 안에 알맞은 수가 가장 큰 비례식은?', LAB.slice(0, 3), answers.indexOf(best), {
        figure: tagged(rows.map((v) => P(v[0].html, v[1].html, v[2].html, box()))),
        explain: `□ 안에 알맞은 수는 ${answers.map((x, i) => `${LAB[i]} ${x}`).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map((v) => quot([v[1], v[2]], [v[0]]).text), rule: 'max' } }
      });
    }),
    T('law-say-wrong', '비례식에 대한 설명 가운데 틀린 것 찾기', '②35 ③75 심25', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9, (x, y) => x < y), [s, t] = d.until(() => [d.int(1, 5), d.int(2, 6)], ([x, y]) => x !== y); return { a, b, l: [a * s, b * s, a * t, b * t] }; }, (o) => o.l[0] + o.l[3] !== o.l[1] + o.l[2] && o.l[0] * o.l[1] !== o.l[0] * o.l[3]);
      const [x, y, z, w] = v.l, sum = d.bool();
      const rows = [[`두 비의 비율은 모두 ${frac(v.a, v.b)}이다.`, true], [`외항의 곱은 ${x * w}이다.`, true], ['외항의 곱과 내항의 곱은 같다.', true], sum ? ['외항의 합과 내항의 합은 같다.', false] : [`내항의 곱은 ${x * y}이다.`, false]];
      return oneOf(d, `비례식 ${plain(x, y, z, w)}에 대한 설명으로 옳지 않은 것은?`, rows, false, {
        explain: sum ? `외항의 합은 ${x} + ${w} = ${x + w}, 내항의 합은 ${y} + ${z} = ${josa(y + z, '으로/로')} 서로 다르다. 비례식에서 같은 것은 외항의 곱과 내항의 곱이다.` : `내항은 ${y}${tail(y, '과/와')} ${z}이므로 내항의 곱은 ${y} × ${z} = ${y * z}이다.`
      });
    })
  ]);

  B.addTypes(U, 'use', [
    T('use-pick-eq', '문장에 알맞은 비례식 고르기', '①44 ②48 ③46 심39', (d) => {
      const kind = d.int(0, 2), [a, b] = co(d, 2, 9, (p, q) => kind === 2 || q * 500 / p >= 400), k = d.int(2, 6), B2 = kind < 2 ? b * 500 : b, C2 = B2 * k, x = a * k;
      const [text, ask] = [
        [`사과 ${a}개의 값은 ${B2}원이다. ${C2}원으로 살 수 있는 사과의 수를 알아보려고 한다.`, '사과의 수'],
        [`색 테이프 ${a} m의 값은 ${B2}원이다. ${C2}원으로 살 수 있는 색 테이프의 길이를 알아보려고 한다.`, '색 테이프의 길이(m)'],
        [`물 ${a}컵에 식초를 ${b}숟가락 넣어 식초물을 만든다. 식초 ${C2}숟가락을 넣으려면 물은 몇 컵 필요한지 알아보려고 한다.`, '물의 컵 수']
      ][kind];
      // 보기: 같은 종류의 양을 같은 자리에 놓은 식(정답) / 뒤의 비에서 두 양의 자리를 바꾼 식 / □를 엉뚱한 자리에 둔 식 / 앞의 비만 뒤집은 식
      const forms = [[a, B2, BOX, C2], [a, B2, C2, BOX], [a, BOX, C2, B2], [B2, a, BOX, C2]], num = (t) => (t === BOX ? x : t);
      return oneOf(d, `${text} ${ask}를 □라 할 때, 바르게 세운 비례식은?`, forms.map((f) => [plain(...f), num(f[0]) * num(f[3]) === num(f[1]) * num(f[2]), [`${num(f[0])}*${num(f[3])}`, num(f[1]) * num(f[2])]]), true, {
        explain: `두 비에서 같은 종류의 양을 같은 자리에 놓아야 한다. ${a} : ${B2} = □ : ${C2}에서 □ = ${x}이다.`
      });
    }),
    T('use-setup-solve', '비례식을 세우고 푸는 과정의 빈칸 채우기', '①45 ②48·49 ③46', (d) => {
      const [a, b] = co(d, 2, 9), k = d.int(3, 8);
      const [text, what] = d.pick([[`기계 한 대가 ${a}분 동안 장난감 ${b}개를 만든다. 같은 빠르기로 ${a * k}분 동안 만드는 장난감의 수를 ★개라 하여`, '장난감'], [`${a}분 동안 물이 ${b} L 나오는 수도꼭지가 있다. 같은 빠르기로 ${a * k}분 동안 나오는 물의 양을 ★ L라 하여`, '물'], [`쿠키 ${a}개를 만드는 데 버터가 ${b}숟가락 필요하다. 쿠키 ${a * k}개를 만드는 데 필요한 버터의 양을 ★숟가락이라 하여`, '버터']]);
      return M(`${text} 비례식을 세우고 답을 구하였다. ㉠, ㉡에 알맞은 수는?`, labelled([a * k, b * k]), {
        figure: lines([P(a, b, box(LAB[0]), '★'), ex(`★ <i>=</i> ${box(LAB[1])}`)]),
        explain: `${a} : ${b} = ${a * k} : ★에서 ${a} × ★ = ${b} × ${a * k} = ${b * a * k}이므로 ★ = ${b * k}이다.`,
        facts: { calc: [[String(a * k), 0], [`${b}*${a * k}/${a}`, 1]] }
      });
    }),
    T('use-ratio-other', '두 양의 비와 한쪽 양으로 다른 쪽 양 구하기', '①46 ②49 ③45 심40·42', (d, n) => {
      const [a, b] = co(d, 2, 9, (x, y) => n === 0 || (x > y && x <= 2 * y)), k = d.int(3, 12);
      if (n === 0) {
        const [text, u] = d.pick([[`꽃밭에 심은 장미 수와 튤립 수의 비는 ${a} : ${b}이다. 장미가 ${a * k}송이일 때 튤립은 몇 송이인가?`, '송이'], [`도서관에 있는 동화책 수와 과학책 수의 비는 ${a} : ${b}이다. 동화책이 ${a * k}권일 때 과학책은 몇 권인가?`, '권'], [`주머니에 든 흰 바둑돌 수와 검은 바둑돌 수의 비는 ${a} : ${b}이다. 흰 바둑돌이 ${a * k}개일 때 검은 바둑돌은 몇 개인가?`, '개']]);
        return N(text, b * k, { unit: u, explain: `구하는 수를 □라 하면 ${a} : ${b} = ${a * k} : □이다. ${a} × □ = ${b} × ${a * k} = ${a * b * k}이므로 □ = ${b * k}이다.`, facts: { calc: [[`${b}*${a * k}/${a}`, 0]] } });
      }
      const [text, u] = d.pick([[`텔레비전 화면의 가로와 세로의 비는 ${a} : ${b}이다. 세로가 ${b * k} cm일 때 가로는 몇 cm인가?`, 'cm'], [`밀가루와 설탕을 ${rj(a, b, '으로/로')} 섞어 반죽을 만들려고 한다. 설탕을 ${b * k}숟가락 넣었다면 밀가루는 몇 숟가락 넣어야 하는가?`, '숟가락'], [`깃발의 가로와 세로의 비는 ${a} : ${b}이다. 세로가 ${b * k} cm일 때 가로는 몇 cm인가?`, 'cm']]);
      return N(text, a * k, { unit: u, explain: `구하는 수를 □라 하면 ${a} : ${b} = □ : ${b * k}이다. □ × ${b} = ${a} × ${b * k} = ${a * b * k}이므로 □ = ${a * k}이다.`, facts: { calc: [[`${a}*${b * k}/${b}`, 0]] } });
    }, { count: 2 }),
    T('use-ratio-dec', '한쪽 양이 소수일 때 다른 쪽 양 구하기', '①46 ②50', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 7), u = d.int(3, 30); return { a, b, u }; }, (o) => (o.a * o.u) % 10 !== 0 && (o.b * o.u) % 10 === 0 && o.a * o.u < 100);
      const x = dec(v.a * v.u, 1), want = v.b * v.u / 10, q = quot([x, nat(v.b)], [nat(v.a)], want), [p, s, u] = d.pick([['쌀', '보리', 'kg'], ['딸기', '설탕', 'kg'], ['사과즙', '물', 'L']]);
      return N(`${josa(p, '과/와')} ${josa(s, '을/를')} ${rj(v.a, v.b, '으로/로')} 섞으려고 한다. ${josa(p, '을/를')} ${x.html} ${u} 넣었다면 ${josa(s, '은/는')} 몇 ${u} 넣어야 하는가?`, want, {
        unit: u, explain: `${josa(s, '을/를')} □ ${u} 넣는다고 하면 ${v.a} : ${v.b} = ${x.html} : □이다. ${v.a} × □ = ${v.b} × ${x.html} = ${v.b * v.a * v.u / 10}이므로 □ = ${want}이다.`,
        facts: { calc: [[q.text, 0]], unseen: q.unseen }
      });
    }),
    T('use-ratio-decratio', '소수로 적힌 비와 한쪽 양으로 다른 쪽 양 구하기', '③45 심40', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9), u = d.int(2, 9), t = d.int(2, 12); return { a, b, u, t }; }, (o) => (o.a * o.u) % 10 !== 0 && (o.b * o.u) % 10 !== 0 && o.a * o.u < 100 && o.b * o.u < 100 && o.t !== o.u);
      const x = dec(v.a * v.u, 1), y = dec(v.b * v.u, 1), given = v.a * v.t, want = v.b * v.t, q = quot([y, nat(given)], [x], want), [p, s] = d.pick([['빨간색 끈', '파란색 끈'], ['노란색 테이프', '초록색 테이프'], ['긴 막대', '짧은 막대']]);
      return N(`${josa(p, '과/와')} ${s}의 길이의 비는 ${R(x, y)}이다. ${josa(p, '이/가')} ${given} cm일 때 ${josa(s, '은/는')} 몇 cm인가?`, want, {
        unit: 'cm', explain: `${R(x, y)}${tail(y.last, '을/를')} 가장 간단한 자연수의 비로 나타내면 ${v.a} : ${v.b}이다. ${v.a} : ${v.b} = ${given} : □에서 ${v.a} × □ = ${v.b} × ${given} = ${v.b * given}이므로 □ = ${want}이다.`,
        facts: { calc: [[q.text, 0]], unseen: q.unseen }
      });
    }),
    T('use-ratio-unit', '비례식으로 구한 양을 큰 단위와 작은 단위로 나타내기', '①46 심41', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9, (x, y) => x > y), k = d.int(2, 9) * 100; return { a, b, k }; }, (o) => o.a * o.k > 1000 && (o.a * o.k) % 1000 !== 0 && o.a * o.k < 5000);
      const [p, s, mix] = d.pick([['밀가루', '설탕', '과자 반죽'], ['쌀가루', '팥가루', '떡 반죽'], ['찹쌀가루', '콩가루', '떡 반죽']]), total = v.a * v.k;
      return M(`${josa(p, '과/와')} ${josa(s, '을/를')} ${rj(v.a, v.b, '으로/로')} 섞어 ${josa(mix, '을/를')} 만든다. ${josa(s, '을/를')} ${v.b * v.k} g 넣었다면 ${josa(p, '은/는')} 몇 kg 몇 g 넣어야 하는가?`, [{ answer: Math.floor(total / 1000), unit: 'kg' }, { answer: total % 1000, unit: 'g' }], {
        explain: `${josa(p, '을/를')} □ g 넣는다고 하면 ${v.a} : ${v.b} = □ : ${v.b * v.k}이다. □ × ${v.b} = ${v.a} × ${v.b * v.k}이므로 □ = ${total}이다. ${total} g = ${Math.floor(total / 1000)} kg ${total % 1000} g이다.`,
        facts: { unit: [{ expr: `${v.a}*${v.b * v.k}/${v.b}`, base: 1000, at: [0, 1] }] }
      });
    }),
    T('use-pair-fwd', '짝 지어진 두 양에서 다른 짝의 값 구하기', '①47 ②50 ③47 심39', (d) => {
      const kind = d.int(0, 2), per = [d.int(3, 8) * 5, d.int(10, 20) * 10, d.int(12, 20) * 10][kind], v = d.until(() => { const a = d.int(2, 9), c = d.int(3, 15); return { a, c, b: per * a }; }, (o) => o.c > o.a && o.c % o.a !== 0);
      const want = v.b * v.c / v.a, [text, u] = [[`쿠키 ${v.a}개를 만드는 데 밀가루가 ${v.b} g 필요하다. 쿠키 ${v.c}개를 만드는 데 필요한 밀가루는 몇 g인가?`, 'g'], [`떡볶이 ${v.a}인분을 만드는 데 떡이 ${v.b} g 필요하다. 떡볶이 ${v.c}인분을 만드는 데 필요한 떡은 몇 g인가?`, 'g'], [`주스 ${v.a}컵을 만드는 데 물이 ${v.b} mL 필요하다. 주스 ${v.c}컵을 만드는 데 필요한 물은 몇 mL인가?`, 'mL']][kind];
      return N(text, want, { unit: u, explain: `구하는 양을 □라 하면 ${v.a} : ${v.b} = ${v.c} : □이다. ${v.a} × □ = ${v.b} × ${v.c} = ${v.b * v.c}이므로 □ = ${want}이다.`, facts: { calc: [[`${v.b}*${v.c}/${v.a}`, 0]] } });
    }),
    T('use-pair-back', '짝 지어진 두 양에서 앞의 양을 거꾸로 구하기', '①47·50·51 ②50·52 ③47·51·52·53 심39·42·43', (d) => {
      // 얼개가 같은 상황(값과 개수, 맞물린 톱니바퀴의 회전수, 같은 시각의 높이와 그림자) 가운데 하나만 싣는다.
      // 톱니바퀴는 회전수끼리만 견주고(톱니 수는 반비례라 쓰지 않는다), 그림자는 높이와 그림자의 길이의 비가 같다는 것을 글에 밝힌다.
      const kind = d.int(0, 2);
      if (kind === 0) {
        const v = d.until(() => { const a = d.int(2, 7), p = d.int(8, 60) * 100, k = d.int(2, 6); return { a, p, k }; }, (o) => (o.p / 100) % o.a !== 0 && o.p * o.k <= 30000), [thing, u] = d.pick([['사과', '개'], ['공책', '권'], ['장미', '송이'], ['지우개', '개']]);
        return N(`${thing} ${v.a}${u}의 값은 ${v.p}원이다. ${v.p * v.k}원으로 살 수 있는 ${josa(thing, '은/는')} 몇 ${u}인가?`, v.a * v.k, {
          unit: u, explain: `살 수 있는 수를 □라 하면 ${v.a} : ${v.p} = □ : ${v.p * v.k}이다. □ × ${v.p} = ${v.a} × ${v.p * v.k}이므로 □ = ${v.a * v.k}이다.`,
          facts: { calc: [[`${v.a}*${v.p * v.k}/${v.p}`, 0]] }
        });
      }
      const [a, b] = kind === 1 ? co(d, 2, 15) : co(d, 2, 6), k = d.int(3, 9), [x, y] = d.pick([['나무', '건물'], ['가로등', '건물'], ['기둥', '탑']]);
      return N(kind === 1 ? `맞물려 도는 두 톱니바퀴 가와 나가 있다. 가가 ${a}바퀴 도는 동안 나는 ${b}바퀴 돈다. 나가 ${b * k}바퀴 도는 동안 가는 몇 바퀴 도는가?`
        : `같은 시각에 물체의 높이와 그림자의 길이의 비는 모두 같다. 높이가 ${a} m인 ${x}의 그림자의 길이가 ${b} m일 때, 그림자의 길이가 ${b * k} m인 ${y}의 높이는 몇 m인가?`, a * k, {
        unit: kind === 1 ? '바퀴' : 'm',
        explain: `${kind === 1 ? '가가 도는 바퀴 수를 □라' : `${y}의 높이를 □ m라`} 하면 ${a} : ${b} = □ : ${b * k}이다. □ × ${b} = ${a} × ${b * k} = ${a * b * k}이므로 □ = ${a * k}이다.`,
        facts: { calc: [[`${a}*${b * k}/${b}`, 0]] }
      });
    }),
    T('use-pair-dec', '답이 소수인 비례식 문장제', '②50 ③50', (d) => {
      const v = d.until(() => ({ b: d.int(6, 12), c: d.int(6, 48) }), (o) => (o.b * o.c) % 5 !== 0 && o.b * o.c / 5 < 100), want = v.b * v.c / 5;
      return D(`일정한 빠르기로 달리는 기차가 5분 동안 ${v.b} km를 간다. 이 기차가 같은 빠르기로 ${v.c}분 동안 가는 거리는 몇 km인가?`, want, {
        unit: 'km', explain: `가는 거리를 □ km라 하면 5 : ${v.b} = ${v.c} : □이다. 5 × □ = ${v.b} × ${v.c} = ${v.b * v.c}이므로 □ = ${v.b * v.c} ÷ 5 = ${ds(v.b * v.c * 2, 1)}이다.`,
        facts: { calc: [[`${v.b}*${v.c}/5`, 0]] }
      });
    }),
    T('use-pair-two', '재료가 둘일 때 필요한 양 구하기', '②50 ③47', (d) => {
      const v = d.until(() => { const a = d.int(2, 6); return { a, c: d.int(3, 12), x: a * d.int(10, 24) * 5, y: a * d.int(3, 9) * 5 }; }, (o) => o.c > o.a && o.c % o.a !== 0 && o.x !== o.y);
      const [dish, p, s] = d.pick([['피자', '소스', '치즈'], ['샌드위치', '햄', '치즈'], ['김밥', '밥', '단무지']]), X = v.x * v.c / v.a, Y = v.y * v.c / v.a;
      return M(`${dish} ${v.a}인분을 만드는 데 ${p} ${v.x} g과 ${s} ${v.y} g이 필요하다. ${dish} ${v.c}인분을 만드는 데 필요한 ${josa(p, '과/와')} ${josa(s, '은/는')} 각각 몇 g인가?`, [{ label: p, answer: X, unit: 'g' }, { label: s, answer: Y, unit: 'g' }], {
        explain: `${p}: ${v.a} : ${v.x} = ${v.c} : □에서 □ = ${v.x} × ${v.c} ÷ ${v.a} = ${X}이다. ${s}: ${v.a} : ${v.y} = ${v.c} : □에서 □ = ${v.y} × ${v.c} ÷ ${v.a} = ${Y}이다.`,
        facts: { calc: [[`${v.x}*${v.c}/${v.a}`, 0], [`${v.y}*${v.c}/${v.a}`, 1]] }
      });
    }),
    T('use-pair-extra', '쓰지 않는 수가 섞인 비례식 문장제', '①47', (d) => {
      const v = d.until(() => ({ a: d.int(2, 6), c: d.int(4, 12), p: d.int(9, 60) * 100, ml: d.pick([200, 250, 300, 500]) }), (o) => o.c % o.a !== 0 && (o.p * o.c) % (o.a * 100) === 0 && o.c > o.a && o.p / o.a >= 600 && o.p / o.a <= 2500), want = v.p * v.c / v.a;
      const [thing, u] = d.pick([['주스', 'mL'], ['우유', 'mL'], ['식혜', 'mL']]);
      return N(`${v.ml} ${u}짜리 ${thing} ${v.a}병의 값은 ${v.p}원이다. 같은 ${thing} ${v.c}병의 값은 얼마인가?`, want, {
        unit: '원', explain: `병의 수와 값으로 비례식을 세운다. ${v.a} : ${v.p} = ${v.c} : □에서 ${v.a} × □ = ${v.p} × ${v.c}이므로 □ = ${want}이다. 한 병의 양 ${v.ml} ${u}는 쓰지 않는다.`,
        facts: { calc: [[`${v.p}*${v.c}/${v.a}`, 0]] }
      });
    }),
    T('use-twin', '두 줄 수직선을 보고 □ 구하기', '②3 ③34·48', (d) => {
      const [a, b] = co(d, 2, 9), k = d.int(3, 5), [names, text] = d.pick([[['시간(분)', '거리(km)'], '드론이 일정한 빠르기로 날아간 시간과 거리를 두 줄 수직선에 나타내었다.'], [['시간(분)', '거리(km)'], '기차가 일정한 빠르기로 달린 시간과 거리를 두 줄 수직선에 나타내었다.'], [['시간(분)', '물(L)'], '수도꼭지에서 일정하게 물이 나온 시간과 물의 양을 두 줄 수직선에 나타내었다.']]);
      const tops = Array.from({ length: k + 1 }, (_, i) => (i === 0 ? '0' : i === 1 || i === k ? String(a * i) : '')), bottoms = Array.from({ length: k + 1 }, (_, i) => (i === 0 ? '0' : i === 1 ? String(b) : i === k ? BOX : ''));
      return N(`${text} □ 안에 알맞은 수는?`, b * k, {
        figure: twin(names, tops, bottoms),
        explain: `위의 눈금과 아래의 눈금이 짝을 이루므로 ${a} : ${b} = ${a * k} : □이다. ${a} × □ = ${b} × ${a * k} = ${a * b * k}이므로 □ = ${b * k}이다.`,
        facts: { calc: [[`${b}*${a * k}/${a}`, 0]] }
      });
    }),
    T('use-time-hm', '걸리는 시간을 몇 시간 몇 분으로 구하기', '①48 ②51 ③49', (d) => {
      const v = d.until(() => ({ a: d.pick([2, 3, 4, 5, 6, 8, 10]), b: d.int(3, 20), t: d.int(13, 47) * 5 }), (o) => o.t % 60 !== 0 && (o.b * o.t) % o.a === 0 && o.b % o.a !== 0 && o.b * o.t / o.a <= 360 && o.b / o.a >= 1 && o.b / o.a <= 2.5), dist = v.b * v.t / v.a;
      return M(`${v.a}분 동안 ${v.b} km를 가는 기차가 있다. 이 기차가 같은 빠르기로 ${dist} km를 가는 데 걸리는 시간은 몇 시간 몇 분인가?`, [{ answer: Math.floor(v.t / 60), unit: '시간' }, { answer: v.t % 60, unit: '분' }], {
        explain: `걸리는 시간을 □분이라 하면 ${v.a} : ${v.b} = □ : ${dist}이다. □ × ${v.b} = ${v.a} × ${dist} = ${v.a * dist}이므로 □ = ${v.t}이다. ${v.t}분 = ${Math.floor(v.t / 60)}시간 ${v.t % 60}분이다.`,
        facts: { unit: [{ expr: `${v.a}*${dist}/${v.b}`, base: 60, at: [0, 1] }] }
      });
    }),
    T('use-time-first', '시간의 단위를 맞춘 뒤 비례식 세우기', '③49', (d) => {
      const v = d.until(() => ({ h: d.int(1, 3), w: d.int(2, 40) * 10, h2: d.int(1, 2), m2: d.pick([10, 15, 20, 30, 40, 45, 50]) }), (o) => (o.w * (o.h2 * 60 + o.m2)) % (o.h * 60) === 0 && o.h2 * 60 + o.m2 !== o.h * 60 && o.w * (o.h2 * 60 + o.m2) / (o.h * 60) >= 20);
      const t1 = v.h * 60, t2 = v.h2 * 60 + v.m2, want = v.w * t2 / t1;
      return N(`${v.h}시간 동안 물이 ${v.w} L 나오는 수도꼭지가 있다. 이 수도꼭지에서 같은 빠르기로 ${v.h2}시간 ${v.m2}분 동안 나오는 물은 몇 L인가?`, want, {
        unit: 'L', explain: `시간의 단위를 분으로 맞추면 ${v.h}시간 = ${t1}분, ${v.h2}시간 ${v.m2}분 = ${t2}분이다. ${t1} : ${v.w} = ${t2} : □에서 ${t1} × □ = ${v.w} × ${t2}이므로 □ = ${want}이다.`,
        facts: { calc: [[`${v.w}*(${v.h2}*60+${v.m2})/(${v.h}*60)`, 0]], unseen: [60] }
      });
    }),
    T('use-percent', '백분율을 비례식으로 나타내어 전체 구하기', '①49 ②53 ③50 심45', (d) => {
      const v = d.until(() => ({ p: d.pick([15, 20, 25, 30, 35, 40, 45, 55, 60]), total: d.int(2, 12) * 20 }), (o) => (o.p * o.total) % 100 === 0), part = v.p * v.total / 100;
      const [group, what, u, all] = d.pick([['어느 학교 학생', '안경을 쓴 학생', '명', '이 학교 학생은'], ['과수원에 있는 나무', '사과나무', '그루', '과수원에 있는 나무는'], ['도서관에 있는 책', '동화책', '권', '도서관에 있는 책은']]);
      return N(`${group} 가운데 ${v.p} %가 ${what}이고, ${josa(what, '은/는')} ${part}${u}이다. ${all} 모두 몇 ${u}인가?`, v.total, {
        unit: u, explain: `전체는 100 %이다. 전체를 □${josa(u, '이라/라')} 하면 ${v.p} : ${part} = 100 : □이다. ${v.p} × □ = ${part} × 100 = ${part * 100}이므로 □ = ${v.total}이다.`,
        facts: { calc: [[`${part}*100/${v.p}`, 0]], unseen: [100] }
      });
    }),
    T('use-map', '지도에서의 거리와 실제 거리', '②49·56 ③51 심44', (d, n) => {
      const s = d.pick([10000, 20000, 25000, 50000]);
      if (n === 0) {
        const c = d.until(() => d.int(2, 9), (x) => (x * s) % 100 === 0 && x * s / 100 !== 1000), want = c * s / 100;
        return N(`지도에서의 거리와 실제 거리의 비가 1 : ${s}인 지도가 있다. 이 지도에서 ${c} cm인 거리는 실제로 몇 m인가?`, want, {
          unit: 'm', explain: `실제 거리를 □ cm라 하면 1 : ${s} = ${c} : □이므로 □ = ${c * s}이다. 100 cm = 1 m이므로 ${c * s} cm = ${want} m이다.`,
          facts: { calc: [[`${c}*${s}/100`, 0]], unseen: [100], rule: 'map-to-real' }
        });
      }
      const km = d.until(() => d.int(1, 9), (x) => (x * 100000) % s === 0), want = km * 100000 / s;
      return N(`지도에서의 거리와 실제 거리의 비가 1 : ${s}인 지도가 있다. 실제 거리가 ${km} km인 두 곳 사이의 거리는 이 지도에서 몇 cm인가?`, want, {
        unit: 'cm', explain: `${km} km = ${km * 1000} m = ${km * 100000} cm이다. 지도에서의 거리를 □ cm라 하면 1 : ${s} = □ : ${km * 100000}이므로 □ = ${km * 100000} ÷ ${s} = ${want}이다.`,
        facts: { calc: [[`${km}*1000*100/${s}`, 0]], unseen: [1000, 100], rule: 'map-to-paper' }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
