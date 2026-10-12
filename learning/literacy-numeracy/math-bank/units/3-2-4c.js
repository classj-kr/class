// 3학년 2학기 4단원 분수 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록 넷(기본꼴 1~3 311꼴, 심화꼴 76꼴)을 처음부터 끝까지 다시 읽어, 이미 실린 41유형(3-2-4a.js, 3-2-4b.js)이 묻지 않는 꼴을 실었다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 싣는 기준은 a.js와 같다. 주는 것(식·그림·표·수직선·문장), 묻는 것(값·고르기·차례·맞는 것/틀린 것·빈칸), 문장제의 얼개가 다르면 다른 문제다.
// 실력에는 ① 뜻을 정확히 알아야 맞는 고르기 문항(보기마다 어떤 아이가 고르는지 적었다) ② 분수만큼을 두 번 넘게 구하는 문장제,
// ③ □가 있는 크기 비교를 실었다.
//
// 뺀 것과 까닭(자세한 대조표는 references/textbooks/수학/_분석/3-2-4/채우기_대조표.md)
//  - 상위 학년: 크기가 같은 분수·한 부분을 여러 분수로(5학년 약분과 통분), 분모가 다른 분수끼리의 비교(수 카드로 가장 작은 대분수·가장 큰 가분수),
//    단위분수씩 여러 번(4학년 분수의 덧셈·5학년 분수의 곱셈), 분수만큼의 분수만큼·진분수만큼으로 전체 구하기(5~6학년), 네 자리 수 나누기,
//    분모가 가려진 등식(방정식 꼴), 소수(3-1-6에 실음)
//  - 작도·서술형·놀이·준비 학습
//  - 조건 풀이·경우 따지기: 분모와 분자의 합·차로 분수 찾기, 여러 분수에 공통으로 들어갈 수, 수 카드로 분수 모두 만들기, 자연수와 분자를 바꾼 대분수
//  - 뜻 없는 셈: 빈칸에 들어갈 수끼리 더하기·견주기, 가분수로 바꾼 분자끼리 견주기
//  - 이미 실린 유형과 수·상황만 다른 것
// 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, frac, mixed, partLine, dots, pieces, lines, tagged, numbers, cards, table, N, M, C, F } = B.kit;
  const G = B.kit.geo;
  const PART = '4수01-09', KIND = '4수01-10', COMP = '4수01-11';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const THREE = LABELS.slice(0, 3);
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const ex = (html) => `<span class="mb-expr">${html}</span>`;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  // 토씨: 분수와 대분수는 분자를 마지막에 읽는다(5분의 3, 2와 5분의 3).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (k, n, pair) => frac(k, n) + tail(k, pair);
  const mj = (w, k, n, pair) => mixed(w, k, n) + tail(k, pair);
  const labelled = (answers) => answers.map((answer, i) => ({ label: LABELS[i], answer }));
  const sign = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  // 묶음: 한 묶음 g개, 모두 m묶음, 그 가운데 k묶음(k/m 은 더 줄일 수 없는 진분수)
  const bundles = (d, ok) => d.until(() => [d.int(2, 5), d.int(3, 6), d.int(1, 5)], ([g, m, k]) => k < m && gcd(k, m) === 1 && g * m <= 30 && (!ok || ok(g, m, k)));
  // 대분수 w n/den (n/den 은 진분수)
  const mixedOf = (d, ok) => d.until(() => [d.int(1, 4), d.int(1, 8), d.int(3, 9)], ([w, n, den]) => n < den && (!ok || ok(w, n, den)));
  // 색칠한 원: 모두 색칠한 원 w개와 den조각 중 n조각을 색칠한 원 하나
  const circlesOf = (w, n, den, scale) => Array.from({ length: w + 1 }, (_, i) => pieces('circle', den, { shaded: i < w ? den : n, scale: scale || 1.05 })).join(' ');
  // 그림 여럿을 한 줄에 나란히 놓는다(그림 칸 안에서는 그림마다 줄이 바뀌므로 한 덩이로 묶어 넣는다).
  const inRow = (html) => '<div class="mb-lines"><div>' + html + '</div></div>';
  const shapesOf = (w, n, den) => inRow(circlesOf(w, n, den));
  // 분자 top, 분모 den 인 수를 대분수(asMixed)나 가분수로 적는다. 식 글은 `(w*den+n)/den` 꼴로 적어야 가분수의 값과 끝자리까지 같다.
  const isMixed = (top, den, asMixed) => asMixed && top > den && top % den !== 0;
  const show = (top, den, asMixed) => (isMixed(top, den, asMixed) ? mixed(Math.floor(top / den), top % den, den) : frac(top, den));
  const valueOf = (top, den, asMixed) => (isMixed(top, den, asMixed) ? `(${Math.floor(top / den)}*${den}+${top % den})/${den}` : `${top}/${den}`);
  const orderChoice = (d, values, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, options: list.map((o) => o.map((i) => LABELS[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };
  // 「전체의 분수만큼」 한 벌: 분모 m, 한 묶음 u, 분자 k → (m × u)의 k/m 은 u × k
  const ofPick = (d, ok) => d.until(() => [d.int(3, 9), d.int(2, 9), d.int(1, 7)], ([m, u, k]) => k < m && gcd(k, m) === 1 && m !== u && (!ok || ok(m, u, k)));
  const ofTotal = ([m, u]) => m * u;
  const ofValue = ([, u, k]) => u * k;
  const ofSay = ([m, u, k]) => `${m * u}의 ${frac(k, m)}`;
  const ofExpr = ([m, u, k]) => `${m * u}/${m}*${k}`;
  const OF_ALL = [];
  for (let m = 3; m <= 9; m += 1) for (let u = 2; u <= 9; u += 1) for (let k = 1; k < m; k += 1) if (gcd(k, m) === 1 && m !== u && m * u <= 72) OF_ALL.push([m, u, k]);
  // 한 전체(total)의 두 분수만큼: 분모가 서로 다르고 둘 다 단위분수이지는 않다(plain 이면 둘 다 단위분수가 아니다). ok(total, 첫째 양, 둘째 양)
  const twoShares = (d, ok, plain) => d.until(() => { const m1 = d.int(2, 9), m2 = d.int(2, 9), total = lcm(m1, m2) * d.int(1, 3); return [total, m1, d.int(1, m1 - 1), m2, d.int(1, m2 - 1)]; },
    ([total, m1, k1, m2, k2]) => m1 !== m2 && total >= 12 && total <= 72 && gcd(k1, m1) === 1 && gcd(k2, m2) === 1 && (plain ? k1 >= 2 && k2 >= 2 : k1 + k2 >= 3) && ok(total, total / m1 * k1, total / m2 * k2));

  // ── 부분은 전체의 얼마인지 분수로 나타내기 ──
  B.addTypes('3-2-4', 'part', [
    T('part-unshaded', '색칠하지 않은 부분을 분수로 나타내기', '①2 ③2', (d) => {
      const [g, m, k] = bundles(d, (x, y, z) => y - z !== z), total = g * m;
      return F('똑같이 묶은 것 중에서 색칠하지 않은 부분은 전체의 몇 분의 몇인가?', m - k, m, {
        figure: dots(g, m, { loop: 'cols', on: k }), explain: `전체 ${m}묶음 중에서 색칠하지 않은 것은 ${m} - ${k} = ${m - k}(묶음)이다.`, facts: { partOf: { total, group: g, part: total - g * k } }
      });
    }),
    T('part-plain', '몇 개 중의 몇 개를 분수로 나타내기', '②2·3 심3', (d) => {
      const who = d.pick(NAMES), [n, k] = d.until(() => [d.int(5, 11), d.int(2, 9)], ([x, y]) => y < x && gcd(x, y) === 1);
      return F(`${name(who, '은/는')} 사탕 ${n}개 중에서 ${k}개를 먹었다. ${name(who, '이/가')} 먹은 사탕은 전체의 몇 분의 몇인가?`, k, n, {
        explain: `전체 ${n}개 중의 ${k}개이므로 전체의 ${frac(k, n)}이다.`, facts: { partOf: { total: n, group: 1, part: k } }
      });
    }),
    T('part-two-kinds', '두 종류를 합한 전체에서 한 종류의 분수', '②4', (d) => {
      const [a, b] = d.until(() => [d.int(2, 8), d.int(2, 8)], ([x, y]) => x !== y && gcd(x, x + y) === 1 && x + y <= 13);
      return F(`빨간 구슬 ${a}개와 파란 구슬 ${b}개가 있다. 빨간 구슬은 전체 구슬의 몇 분의 몇인가?`, a, a + b, {
        explain: `구슬은 모두 ${a} + ${b} = ${a + b}(개)이다. 빨간 구슬은 전체 ${a + b}개 중의 ${a}개이므로 전체의 ${frac(a, a + b)}이다.`,
        facts: { calc: [[String(a), 0], [`${a}+${b}`, 1]], partOf: { total: a + b, group: 1, part: a } }
      });
    }),
    T('part-by-count', '똑같이 몇 묶음으로 나눌 때 부분은 전체의 몇 분의 몇', '②10 심6', (d) => {
      const [g, m, k] = bundles(d, (x, y, z) => z >= 2 && x !== y), total = g * m;
      return F(`공책 ${total}권을 똑같이 ${m}묶음으로 나누었다. 공책 ${g * k}권은 전체의 몇 분의 몇인가?`, k, m, {
        explain: `한 묶음은 ${total} ÷ ${m} = ${g}(권)이다. 공책 ${g * k}권은 ${k}묶음이므로 전체의 ${frac(k, m)}이다.`, facts: { partOf: { total, group: g, part: g * k } }
      });
    }),
    T('part-word-bags', '문장제: 몇 묶음은 전체의 몇 분의 몇', '①5 ③10 심5', (d) => {
      const [g, m, k] = bundles(d, (x, y, z) => z >= 2 && x !== y), total = g * m;
      return F(`쿠키 ${total}개를 한 봉지에 ${g}개씩 담아 그중 ${k}봉지를 친구에게 주었다. 친구에게 준 쿠키는 전체의 몇 분의 몇인가?`, k, m, {
        explain: `한 봉지에 ${g}개씩 담으면 ${total} ÷ ${g} = ${m}(봉지)이다. 전체 ${m}봉지 중의 ${k}봉지를 주었으므로 전체의 ${frac(k, m)}이다.`, facts: { partOf: { total, group: g, part: g * k } }
      });
    }),
    T('part-bottom', '분모가 빈칸인 분수', '③8 심9', (d) => {
      const [g, m, k] = bundles(d, (x, y, z) => z >= 2 && x !== y && x * z !== y), total = g * m, part = g * k;
      return N('□ 안에 알맞은 수는?', m, {
        figure: lines([`${josa(total, '을/를')} ${g}씩 묶으면 ${josa(part, '은/는')} ${total}의 ${frac(k, box())}이다.`]),
        explain: `${josa(total, '을/를')} ${g}씩 묶으면 ${total} ÷ ${g} = ${m}(묶음)이다. 분모에는 전체 묶음의 수를 쓴다.`, facts: { calc: [[`${total}/${g}`, 0]] }
      });
    }),
    T('part-pick-figure', '분수에 알맞은 그림 고르기', '①9', (d) => {
      // 틀린 그림: 색칠한 묶음의 수는 같지만 전체 묶음의 수가 다른 것, 색칠하지 않은 묶음의 수가 분자와 같은 것
      const [m, k] = d.until(() => [d.int(3, 5), d.int(1, 4)], ([y, z]) => z < y && gcd(z, y) === 1 && y - z !== z);
      const list = d.shuffle([[m, k], [m + 1, k], [m, m - k]]).map(([cols, on]) => [d.int(2, 3), cols, on]);
      const hit = list.map(([, cols, on]) => cols === m && on === k);
      return C(`색칠한 부분이 전체의 ${frac(k, m)}인 것은?`, THREE, hit.indexOf(true), {
        figure: G.tiles(list.map(([rows, cols, on], i) => [LABELS[i], dots(rows, cols, { loop: 'cols', on })])),
        explain: `전체 ${m}묶음 중에서 ${k}묶음을 색칠한 그림을 찾는다.`, facts: { truth: hit, want: true }
      });
    }),
    T('part-wrong', '부분을 분수로 잘못 나타낸 것 찾기', '②12 심10', (d) => {
      // 틀린 것: 한 묶음의 크기를 분자에 썼다(그럴 수 없는 수이면 묶음의 수를 하나 다르게 셌다)
      const one = () => bundles(d, (x, y, z) => z >= 2);
      const rows = d.until(() => [one(), one(), one()], (list) => new Set(list.map(([g, m]) => g * m)).size === 3), bad = d.int(0, 2);
      const tops = rows.map(([g, m, k], i) => (i !== bad ? k : g !== k && g < m ? g : k + 1 < m ? k + 1 : k - 1));
      const [g, m, k] = rows[bad];
      return C('부분을 분수로 잘못 나타낸 것은?', rows.map(([x, y, z], i) => `${josa(x * y, '을/를')} ${x}씩 묶으면 ${josa(x * z, '은/는')} ${x * y}의 ${frac(tops[i], y)}이다.`), bad, {
        explain: `${josa(g * m, '을/를')} ${g}씩 묶으면 ${m}묶음이고 ${josa(g * k, '은/는')} ${k}묶음이므로 ${g * m}의 ${frac(k, m)}이다.`,
        facts: { claimed: rows.map(([x, y, z], i) => [`(${x * z}/${x})/(${x * y}/${x})`, tops[i] / y]), claimedWant: false }
      });
    })
  ]);

  // ── 전체의 분수만큼은 얼마인지 알아보기 ──
  const GRIDS = [[12, 3, 4, [3, 4, 6]], [16, 4, 4, [4, 8]], [18, 3, 6, [3, 6, 9]], [20, 4, 5, [4, 5]], [24, 4, 6, [3, 4, 6, 8]]];
  B.addTypes('3-2-4', 'of', [
    T('of-regroup', '한 그림을 두 가지로 묶어 분수만큼 구하기', '①12 ③15', (d) => {
      const [total, rows, cols, dens] = d.pick(GRIDS), [m1, m2] = d.shuffle(dens).slice(0, 2).sort((x, y) => x - y);
      const top = (m) => d.until(() => d.int(2, m - 1), (k) => gcd(k, m) === 1), k1 = top(m1), k2 = top(m2);
      return M('그림을 두 가지 방법으로 묶어 볼 때, ㉠, ㉡에 알맞은 수는?', labelled([total / m1 * k1, total / m2 * k2]), {
        figure: dots(rows, cols) + lines([`${total}의 ${fj(k1, m1, '은/는')} ${box(LABELS[0])}이다.`, `${total}의 ${fj(k2, m2, '은/는')} ${box(LABELS[1])}이다.`]),
        explain: `${josa(total, '을/를')} 똑같이 ${m1}묶음으로 나누면 한 묶음은 ${total / m1}이므로 ${total / m1} × ${k1} = ${total / m1 * k1}이고, 똑같이 ${m2}묶음으로 나누면 한 묶음은 ${total / m2}이므로 ${total / m2} × ${k2} = ${total / m2 * k2}이다.`,
        facts: { calc: [[`${total}/${m1}*${k1}`, 0], [`${total}/${m2}*${k2}`, 1]] }
      });
    }),
    T('of-steps', '분수만큼을 구하는 과정', '②17', (d) => {
      const [m, u, k] = d.until(() => [d.int(3, 9), d.int(3, 9), d.int(2, 8)], ([x, y, z]) => z < x && gcd(z, x) === 1 && x !== y && y !== z), total = m * u;
      return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([m, k, u * k]), {
        figure: lines([`${total}의 ${fj(k, m, '은/는')} ${josa(total, '을/를')} 똑같이 ${box(LABELS[0])}묶음으로 나눈 것 중의 ${box(LABELS[1])}묶음이므로 ${box(LABELS[2])}이다.`]),
        explain: `${total}의 ${fj(k, m, '은/는')} ${josa(total, '을/를')} 똑같이 ${m}묶음으로 나눈 것 중의 ${k}묶음이다. ${total} ÷ ${m} = ${u}이고 ${u} × ${k} = ${u * k}이다.`,
        facts: { calc: [[String(m), 0], [String(k), 1], [`${total}/${m}*${k}`, 2]] }
      });
    }),
    T('of-match', '분수만큼과 값 짝 짓기', '①14 ②28 ③26 심13', (d) => {
      const rows = d.until(() => [ofPick(d), ofPick(d), ofPick(d)], (list) => new Set(list.map(ofValue)).size === 3 && new Set(list.map(ofTotal)).size === 3 && list.filter((row) => row[2] >= 2).length >= 2 && Math.max(...list.map(ofValue)) - Math.min(...list.map(ofValue)) <= 8);
      const values = rows.map(ofValue), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('분수만큼과 그 값을 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LABELS[i]} ${values[j]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(ofSay)), explain: rows.map((row, i) => `${LABELS[i]} ${ofTotal(row)} ÷ ${row[0]} × ${row[2]} = ${ofValue(row)}`).join(', ') + '이다.',
        facts: { match: { exprs: rows.map(ofExpr), options: list.map((o) => o.map((j) => values[j])) } }
      });
    }),
    T('of-odd', '나타내는 수가 다른 하나 찾기', '①21 ②27 심15', (d) => {
      const sameAs = (row) => OF_ALL.filter((other) => ofValue(other) === ofValue(row) && ofTotal(other) !== ofTotal(row));
      const nearTo = (row, taken) => OF_ALL.filter((other) => ofValue(other) !== ofValue(row) && Math.abs(ofValue(other) - ofValue(row)) <= 4 && !taken.includes(ofTotal(other)));
      const [a, b, c] = d.until(() => {
        const first = d.pick(OF_ALL), same = sameAs(first), second = same.length ? d.pick(same) : first, near = nearTo(first, [ofTotal(first), ofTotal(second)]);
        return [first, second, near.length ? d.pick(near) : first];
      }, ([first, second, third]) => second !== first && third !== first);
      const rows = d.shuffle([a, b, c]);
      return C('나타내는 수가 나머지와 다른 하나는?', THREE, rows.indexOf(c), {
        figure: tagged(rows.map(ofSay)), explain: rows.map((row, i) => `${LABELS[i]} ${ofTotal(row)} ÷ ${row[0]} × ${row[2]} = ${ofValue(row)}`).join(', ') + '이다.',
        facts: { choose: { exprs: rows.map(ofExpr), rule: 'odd' } }
      });
    }),
    T('of-max', '분수만큼이 가장 큰 것 찾기', '①23 ③25·36 심17', (d) => {
      // 전체가 가장 큰 것이 답이 되지 않게 고른다.
      const rows = d.until(() => [ofPick(d), ofPick(d), ofPick(d)], (list) => {
        const values = list.map(ofValue), totals = list.map(ofTotal);
        return new Set(values).size === 3 && new Set(totals).size === 3 && list.filter((row) => row[2] >= 2).length >= 2 && Math.max(...values) - Math.min(...values) <= 9 && totals.indexOf(Math.max(...totals)) !== values.indexOf(Math.max(...values));
      });
      const values = rows.map(ofValue);
      return C('가장 긴 것은?', rows.map(([m, u, k]) => `${m * u} m의 ${frac(k, m)}`), values.indexOf(Math.max(...values)), {
        explain: rows.map((row) => `${ofTotal(row)} m의 ${fj(row[2], row[0], '은/는')} ${ofValue(row)} m`).join(', ') + '이다.',
        facts: { choose: { exprs: rows.map(ofExpr), rule: 'max' } }
      });
    }),
    T('of-day', '하루의 분수만큼은 몇 시간', '①29 ②22 ③37 심12', (d) => {
      const [m, k] = d.pick([[2, 1], [3, 1], [3, 2], [4, 1], [4, 3], [6, 1], [6, 5], [8, 3], [8, 5], [8, 7]]);
      return N(`하루의 ${fj(k, m, '은/는')} 몇 시간인가?`, 24 / m * k, { unit: '시간', explain: `하루는 24시간이다. 24시간의 ${fj(k, m, '은/는')} 24 ÷ ${m} × ${k} = ${24 / m * k}(시간)이다.`, facts: { calc: [[`24/${m}*${k}`, 0]], unseen: [24] } });
    }),
    T('of-word-compare', '문장제: 분수만큼을 구해 비교하기', '②25 심21', (d) => {
      // 전체가 긴 쪽이 답이 되지 않게 고른다.
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [p, q] = d.until(() => [ofPick(d), ofPick(d)], ([x, y]) => x[0] !== y[0] && ofTotal(x) !== ofTotal(y) && ofValue(x) !== ofValue(y) && Math.abs(ofValue(x) - ofValue(y)) <= 6 && (ofTotal(x) > ofTotal(y)) !== (ofValue(x) > ofValue(y)));
      return C(`${name(one, '은/는')} 길이가 ${ofTotal(p)} cm인 리본의 ${fj(p[2], p[0], '을/를')} 사용하였고, ${name(two, '은/는')} 길이가 ${ofTotal(q)} cm인 리본의 ${fj(q[2], q[0], '을/를')} 사용하였다. 리본을 더 길게 사용한 사람은?`, [one, two], ofValue(p) > ofValue(q) ? 0 : 1, {
        explain: `${name(one, '은/는')} ${ofTotal(p)} ÷ ${p[0]} × ${p[2]} = ${ofValue(p)}(cm), ${name(two, '은/는')} ${ofTotal(q)} ÷ ${q[0]} × ${q[2]} = ${ofValue(q)}(cm)를 사용하였다.`,
        facts: { choose: { exprs: [ofExpr(p), ofExpr(q)], rule: 'max' } }
      });
    })
  ]);

  // ── 진분수, 가분수, 대분수 ──
  B.addTypes('3-2-4', 'kind', [
    T('kind-three', '진분수, 가분수, 대분수로 분류하기', '①56 ②33·34 ③65', (d) => {
      // 분자와 분모가 같은 분수(가분수)를 꼭 넣는다.
      const make = (kind) => { const den = d.int(3, 9); return kind === 'p' ? [0, d.int(1, den - 1), den] : kind === 'i' ? [0, den + d.int(1, 6), den] : kind === 'e' ? [0, den, den] : [d.int(1, 4), d.int(1, den - 1), den]; };
      const kinds = d.shuffle(['p', 'p', 'i', 'e', 'm', 'm', d.pick(['p', 'i', 'm'])]);
      const list = d.until(() => kinds.map(make), (rows) => new Set(rows.map(String)).size === rows.length);
      const html = ([w, n, den]) => (w ? mixed(w, n, den) : frac(n, den));
      const proper = list.filter(([w, n, den]) => w === 0 && n < den), improper = list.filter(([w, n, den]) => w === 0 && n >= den), whole = list.filter(([w]) => w > 0);
      return M('분수를 진분수, 가분수, 대분수로 분류할 때, 각각 몇 개인가?', [{ label: '진분수', answer: proper.length, unit: '개' }, { label: '가분수', answer: improper.length, unit: '개' }, { label: '대분수', answer: whole.length, unit: '개' }], {
        figure: numbers(list.map(html)),
        explain: `진분수는 ${proper.map(html).join(', ')}, 가분수는 ${improper.map(html).join(', ')}, 대분수는 ${whole.map(html).join(', ')}이다. 분자와 분모가 같은 분수는 가분수이다.`,
        facts: { fracKinds: { list: list.map(([w, n, den]) => [w * den + n, den]), want: 'proper' } }
      });
    }),
    T('kind-unit', '단위분수가 몇 개인 수', '①36 ③41', (d) => {
      const den = d.int(3, 9), [a, b] = d.until(() => [d.int(den + 1, den * 3), d.int(den + 1, den * 3)], ([x, y]) => x !== y && x % den !== 0 && y % den !== 0);
      return M('㉠, ㉡에 알맞은 수는?', labelled([a, b]), {
        figure: lines([`${frac(1, den)}이 ${a}개인 수는 ${frac(box(LABELS[0]), den)}이다.`, `${fj(b, den, '은/는')} ${frac(1, den)}이 ${box(LABELS[1])}개인 수이다.`]),
        explain: `분모가 ${den}인 분수의 분자는 ${frac(1, den)}이 몇 개인지를 나타낸다. ${frac(1, den)}이 ${a}개인 수는 ${frac(a, den)}이고, ${fj(b, den, '은/는')} ${frac(1, den)}이 ${b}개인 수이다.`,
        facts: { calc: [[String(a), 0], [String(b), 1]] }
      });
    }),
    T('kind-natural-pick', '자연수와 크기가 같은 분수 찾기', '①41 ③47 심34', (d) => {
      // 틀린 것: 분자와 분모에 그 자연수를 쓴 분수(1과 같다), 분자가 하나 많거나 적은 분수
      const w = d.int(2, 4), [d1, d2, d3] = d.shuffle([2, 3, 4, 5, 6, 7, 8].filter((v) => v !== w)).slice(0, 3);
      const list = d.shuffle([[w * d1, d1], [w, w], [w * d2 + 1, d2], [w * d3 - 1, d3]]);
      return C(`자연수 ${josa(w, '과/와')} 크기가 같은 분수는?`, list.map(([n, den]) => frac(n, den)), list.findIndex(([n, den]) => n === w * d1 && den === d1), {
        explain: `1은 ${fj(d1, d1, '과/와')} 같으므로 ${josa(w, '은/는')} ${frac(1, d1)}이 ${d1} × ${w} = ${w * d1}(개)인 수 ${fj(w * d1, d1, '과/와')} 같다.`,
        facts: { choose: { exprs: list.map(([n, den]) => `${n}/${den}`), rule: 'equals', target: w } }
      });
    }),
    T('kind-top', '가분수가 되게 하는 분자의 수', '①42 ②44 ③49 심41', (d) => {
      const den = d.int(3, 8);
      return N('다음 분수가 가분수일 때, 1부터 9까지의 자연수 중에서 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', 10 - den, {
        unit: '개', figure: ex(frac(box(), den)), explain: `분자가 분모와 같거나 분모보다 큰 분수가 가분수이다. □ 안에는 ${den}부터 9까지의 수가 들어갈 수 있으므로 ${10 - den}개이다.`,
        facts: { digit: { template: `□+1>${den}`, lo: 1, hi: 9, ask: 'count' } }
      });
    }),
    T('kind-bottom', '진분수가 되게 하는 분모의 수', '①43 ②45 ③50', (d) => {
      const top = d.int(3, 7);
      return N('다음 분수가 진분수일 때, 1부터 9까지의 자연수 중에서 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', 9 - top, {
        unit: '개', figure: ex(frac(top, box())), explain: `분자가 분모보다 작은 분수가 진분수이다. □ 안에는 ${top}보다 큰 ${top + 1}부터 9까지의 수가 들어갈 수 있으므로 ${9 - top}개이다.`,
        facts: { digit: { template: `${top}<□`, lo: 1, hi: 9, ask: 'count' } }
      });
    }),
    T('kind-line-pick', '수직선에서 분수의 자리 찾기', '①38 ③43', (d) => {
      // 틀린 그림: 분자에서 분모를 뺀 칸만큼만 간 것(1을 지나지 않았다), 한 칸 더 가거나 덜 간 것
      const den = d.int(3, 4), top = d.int(den + 1, den * 2 - 1), near = top + 1 < den * 2 ? top + 1 : top - 1, ats = d.shuffle([top, top - den, near]);
      return C(`수직선에 ${fj(top, den, '을/를')} 바르게 나타낸 것은?`, THREE, ats.indexOf(top), {
        figure: G.tiles(ats.map((at, i) => [LABELS[i], partLine(2, den, at)])),
        explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. ${fj(top, den, '은/는')} ${frac(1, den)}이 ${top}개인 수이므로 0에서 ${top}칸 간 곳이다.`,
        facts: { truth: ats.map((at) => at === top), want: true }
      });
    }),
    T('kind-picture-pick', '그림이 나타내는 분수의 종류', '①50 ②35 ③40', (d) => {
      // 도형 하나를 모두 색칠한 그림(분자와 분모가 같은 분수)을 진분수로 여기는 아이가 있다.
      const den = d.int(3, 6), list = d.shuffle([d.int(1, den - 1), den, den + d.int(1, den - 1)]);
      const draw = (top) => inRow(top > den ? pieces('circle', den, { shaded: den, scale: 1 }) + ' ' + pieces('circle', den, { shaded: top - den, scale: 1 }) : pieces('circle', den, { shaded: top, scale: 1 }));
      return C('색칠한 부분을 분수로 나타낼 때, 진분수인 것은?', THREE, list.findIndex((top) => top < den), {
        figure: G.tiles(list.map((top, i) => [LABELS[i], draw(top)])),
        explain: `색칠한 부분은 ${list.map((top, i) => `${LABELS[i]} ${frac(top, den)}`).join(', ')}이다. 분자가 분모보다 작은 분수가 진분수이다.`,
        facts: { truth: list.map((top) => top < den), want: true }
      });
    }),
    T('mixed-read', '대분수 읽기', '①51 ②38 ③60', (d) => {
      // 틀린 것: 분모와 분자를 바꾸어 읽은 것, 자연수와 분자를 바꾸어 읽은 것, 자연수와 분자를 이어 읽은 것
      const [w, n, den] = mixedOf(d, (x, y) => x !== y);
      const rows = d.shuffle([[`${josa(w, '과/와')} ${den}분의 ${n}`, true], [`${josa(w, '과/와')} ${n}분의 ${den}`, false], [`${josa(n, '과/와')} ${den}분의 ${w}`, false], [`${den}분의 ${w}${n}`, false]]);
      return C('대분수를 바르게 읽은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: ex(mixed(w, n, den)), explain: `대분수는 자연수를 먼저 읽고 진분수를 읽는다. 진분수는 분모를 먼저 읽으므로 「${josa(w, '과/와')} ${den}분의 ${n}」${tail(n, '이라고/라고')} 읽는다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('mixed-fill', '대분수의 분자가 될 수 없는 수', '①57 ③67 심41', (d) => {
      const w = d.int(1, 5), den = d.int(5, 9), list = d.shuffle([1, d.int(2, den - 2), den - 1, den]);
      return C('다음이 대분수일 때, □ 안에 들어갈 수 없는 수는?', list.map(String), list.indexOf(den), {
        figure: ex(mixed(w, box(), den)), explain: `대분수는 자연수와 진분수로 이루어진 분수이다. 분수 부분이 진분수이어야 하므로 □ 안에는 ${den}보다 작은 수만 들어갈 수 있다.`,
        facts: { only: { values: list, test: 'atLeast', target: den } }
      });
    }),
    T('mixed-picture-pick', '대분수만큼 바르게 색칠한 그림 고르기', '③63', (d) => {
      // 틀린 그림: 자연수와 분자를 바꾸어 색칠한 것, 색칠하지 않은 조각의 수가 분자와 같은 것
      const [w, n] = d.pick([[1, 2], [2, 1]]), den = d.until(() => d.int(4, 6), (v) => v - n !== n);
      const list = d.shuffle([[w, n], [n, w], [w, den - n]]), hit = list.map(([x, y]) => x === w && y === n);
      return C(`${mixed(w, n, den)}만큼 바르게 색칠한 것은?`, THREE, hit.indexOf(true), {
        figure: G.tiles(list.map(([x, y], i) => [LABELS[i], inRow(circlesOf(x, y, den, 1))])),
        explain: `${mj(w, n, den, '은/는')} 모두 색칠한 원 ${w}개와, 똑같이 ${den}조각으로 나눈 것 중의 ${n}조각을 색칠한 원으로 나타낸다.`,
        facts: { truth: hit, want: true }
      });
    })
  ]);

  // ── 대분수와 가분수 ──
  B.addTypes('3-2-4', 'conv', [
    T('conv-recipe', '표에서 가분수를 찾아 대분수로 나타내기', '①66 ②62 ③75', (d) => {
      const den = d.int(3, 6), top = d.until(() => d.int(den + 1, den * 3 - 1), (v) => v % den !== 0);
      const [w, n] = d.until(() => [d.int(1, 2), d.int(1, den - 1)], ([x, y]) => x * den + y !== top), p = d.int(1, den - 1);
      const what = d.shuffle(['밀가루', '설탕', '우유']), rows = d.shuffle([[what[0], mixed(w, n, den)], [what[1], frac(p, den)], [what[2], frac(top, den)]]);
      return M('빵을 만드는 데 필요한 재료의 양을 나타낸 표이다. 가분수로 나타낸 양을 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(top / den), top % den]), {
        figure: table(['재료', '양'], rows.map(([item, html]) => [item, html + '컵'])) + lines([`대분수: ${mixed(box(LABELS[0]), box(LABELS[1]), den)}컵`]),
        explain: `가분수로 나타낸 양은 ${what[2]} ${frac(top, den)}컵이다. ${top} ÷ ${den} = ${Math.floor(top / den)} … ${top % den}이므로 ${mixed(Math.floor(top / den), top % den, den)}컵이다.`,
        facts: { calc: [[`(${top}-${top}%${den})/${den}`, 0], [`${top}%${den}`, 1]] }
      });
    }),
    T('conv-match', '대분수와 가분수 짝 짓기', '①68 ②59 ③77 심54', (d) => {
      const den = d.int(4, 9), tops = d.until(() => [0, 0, 0].map(() => d.int(den + 1, den * 3 - 1)), (list) => new Set(list).size === 3 && list.every((v) => v % den !== 0) && Math.max(...list) - Math.min(...list) <= den);
      const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('대분수와 크기가 같은 가분수를 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LABELS[i]} ${frac(tops[j], den)}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(tops.map((top) => mixed(Math.floor(top / den), top % den, den))),
        explain: '가분수의 분자는 ' + tops.map((top, i) => `${LABELS[i]} ${Math.floor(top / den)} × ${den} + ${top % den} = ${top}`).join(', ') + '이다.',
        facts: { match: { exprs: tops.map((top) => `${Math.floor(top / den)}*${den}+${top % den}`), options: list.map((o) => o.map((j) => tops[j])) } }
      });
    }),
    T('conv-whole-max', '대분수로 나타냈을 때 자연수 부분이 가장 큰 분수', '①70 ③81 심57', (d) => {
      // 분자가 가장 큰 분수가 답이 되지 않게 고른다. [분자, 분모, 자연수 부분]
      const rows = d.until(() => d.shuffle([3, 4, 5, 6, 7, 8, 9]).slice(0, 3).map((den) => { const w = d.int(2, 9); return [w * den + d.int(1, den - 1), den, w]; }), (list) => {
        const tops = list.map(([top]) => top), wholes = list.map(([, , w]) => w);
        return new Set(wholes).size === 3 && new Set(tops).size === 3 && Math.max(...tops) <= 70 && tops.indexOf(Math.max(...tops)) !== wholes.indexOf(Math.max(...wholes));
      });
      const wholes = rows.map(([, , w]) => w);
      return C('대분수로 나타냈을 때 자연수 부분이 가장 큰 분수는?', rows.map(([top, den]) => frac(top, den)), wholes.indexOf(Math.max(...wholes)), {
        explain: '대분수로 나타내면 ' + rows.map(([top, den, w]) => mixed(w, top % den, den)).join(', ') + '이다.',
        facts: { choose: { exprs: rows.map(([top, den]) => `(${top}-${top}%${den})/${den}`), rule: 'max' } }
      });
    }),
    T('conv-largest', '조건에 맞는 가장 큰 대분수를 가분수로 나타내기', '①74 ③85', (d) => {
      const w = d.int(2, 6), den = d.until(() => d.int(3, 9), (v) => v !== w);
      return N(`자연수 부분이 ${w}이고 분모가 ${den}인 대분수 중에서 가장 큰 분수를 가분수로 나타내려고 한다. □ 안에 알맞은 수는?`, w * den + den - 1, {
        figure: ex(frac(box(), den)), explain: `분모가 ${den}인 진분수 중에서 가장 큰 분수는 ${frac(den - 1, den)}이므로 가장 큰 대분수는 ${mixed(w, den - 1, den)}이다. ${w} × ${den} + ${den - 1} = ${w * den + den - 1}`,
        facts: { calc: [[`${w}*${den}+${den}-1`, 0]], unseen: [1] }
      });
    }),
    T('conv-say', '대분수에 대한 설명', '③89 심36', (d) => {
      const [w, n, den] = mixedOf(d, (x, y, z) => x >= 2 && z >= 4), top = w * den + n, slip = d.pick(['unit', 'improper']);
      const rows = d.shuffle([
        { text: '자연수와 진분수로 이루어진 대분수이다.', ok: true },
        { text: `${frac(1, den)}이 ${slip === 'unit' ? w * den : top}개인 수이다.`, ok: slip !== 'unit' },                    // 자연수 부분만 바꾸고 분자를 더하지 않는 아이는 옳다고 본다
        { text: `가분수로 나타내면 ${frac(slip === 'improper' ? w * 10 + n : top, den)}이다.`, ok: slip !== 'improper' },      // 자연수와 분자를 이어 쓰는 아이는 옳다고 본다
        { text: `${w}보다 크고 ${w + 1}보다 작은 수이다.`, ok: true }
      ]);
      return C(`${mixed(w, n, den)}에 대한 설명으로 옳지 않은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
        explain: `${mj(w, n, den, '은/는')} ${frac(1, den)}이 ${w} × ${den} + ${n} = ${top}(개)인 수이고, 가분수로 나타내면 ${frac(top, den)}이다.`,
        facts: { truth: rows.map((row) => row.ok), want: false }
      });
    })
  ]);

  // ── 분모가 같은 분수의 크기 비교 ──
  B.addTypes('3-2-4', 'comp', [
    T('comp-picture', '그림이 나타내는 분수와 크기 비교하기', '①77 ②64 ③91', (d) => {
      const [w, n, den] = mixedOf(d, (x, y, z) => x <= 2 && z <= 6), top = w * den + n, other = top + d.pick([-2, -1, 0, 1, 2]);
      return C('색칠한 부분이 나타내는 분수와 주어진 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(top, other), {
        figure: shapesOf(w, n, den) + versus('색칠한 부분', frac(other, den)),
        explain: `${frac(1, den)}만큼인 조각을 모두 ${top}개 색칠하였으므로 색칠한 부분은 ${frac(top, den)}이다. 분자의 크기를 비교한다.`,
        facts: { choose: { exprs: [`(${Array(w).fill(den).join('+')}+${n})/${den}`, `${other}/${den}`], rule: 'compare' } }
      });
    }),
    T('comp-wrong', '크기를 잘못 비교한 것 찾기', '①84 ②73 ③96', (d) => {
      // 세 식: 대분수와 가분수, 자연수 부분이 다른 대분수끼리(자연수 부분이 작은 쪽의 분자가 더 크다), 가분수끼리
      const pairOf = (kind) => {
        const den = d.int(4, 9);
        if (kind === 0) { const top = d.int(1, 3) * den + d.int(1, den - 1); return [[top, den, true], [top + d.pick([-2, -1, 1, 2]), den, false]]; }
        if (kind === 1) { const w = d.int(1, 3), [a, b] = d.until(() => [d.int(1, den - 1), d.int(1, den - 1)], ([x, y]) => x > y); return [[w * den + a, den, true], [(w + 1) * den + b, den, true]]; }
        return d.until(() => [[d.int(den + 1, den * 3), den, false], [d.int(den + 1, den * 3), den, false]], ([x, y]) => x[0] !== y[0] && Math.abs(x[0] - y[0]) <= 4);
      };
      const rows = d.shuffle([0, 1, 2]).map((kind) => (d.bool() ? pairOf(kind) : pairOf(kind).reverse())), bad = d.int(0, 2);
      // 바른 식은 큰 쪽으로 벌어진 기호를, 틀린 식은 거꾸로 된 기호를 적는다.
      const opens = rows.map(([left, right], i) => (left[0] > right[0]) !== (i === bad));
      return C('두 분수의 크기를 잘못 비교한 것은?', rows.map(([left, right], i) => ex(`${show(...left)} <i>${opens[i] ? '&gt;' : '&lt;'}</i> ${show(...right)}`)), bad, {
        explain: `가분수로 나타내면 ${frac(rows[bad][0][0], rows[bad][0][1])}, ${frac(rows[bad][1][0], rows[bad][1][1])}이다. 분자가 큰 쪽이 더 크다.`,
        facts: { biggerClaims: rows.map(([left, right], i) => (opens[i] ? [valueOf(...left), valueOf(...right), i] : [valueOf(...right), valueOf(...left), i])), truth: rows.map((_, i) => i !== bad), want: false }
      });
    }),
    T('comp-said', '여러 가지로 나타낸 수의 크기 비교', '①85 ②79 ③102 심66', (d) => {
      const den = d.int(4, 9), tops = d.until(() => [0, 0, 0].map(() => d.int(den + 1, den * 3 - 1)), (list) => new Set(list).size === 3 && list[1] % den !== 0 && Math.max(...list) - Math.min(...list) <= den);
      const said = d.shuffle([[`${frac(1, den)}이 ${tops[0]}개인 수`, `${tops[0]}/${den}`, tops[0]], [show(tops[1], den, true), valueOf(tops[1], den, true), tops[1]], [frac(tops[2], den), `${tops[2]}/${den}`, tops[2]]]);
      return C('나타내는 수가 가장 큰 것은?', said.map(([html]) => html), said.findIndex(([, , top]) => top === Math.max(...tops)), {
        explain: `${frac(1, den)}이 ${tops[0]}개인 수는 ${frac(tops[0], den)}이고, ${mj(Math.floor(tops[1] / den), tops[1] % den, den, '은/는')} ${frac(tops[1], den)}이다. 분자가 가장 큰 수가 가장 크다.`,
        facts: { choose: { exprs: said.map(([, text]) => text), rule: 'max' } }
      });
    }),
    T('comp-order', '크기 순서대로 나열하기', '①87 ②72 ③101 심65', (d) => {
      const den = d.int(4, 9), tops = d.until(() => [0, 0, 0].map(() => d.int(den + 1, den * 4 - 1)), (list) => new Set(list).size === 3 && list.every((v) => v % den !== 0) && Math.max(...list) - Math.min(...list) <= den + 2);
      const asMixed = d.shuffle([true, false, true]), pick = orderChoice(d, tops, true);
      return C('큰 수부터 차례대로 나열한 것은?', pick.options, pick.answer, {
        figure: tagged(tops.map((top, i) => show(top, den, asMixed[i]))),
        explain: `모두 가분수로 나타내면 ${tops.map((top, i) => `${LABELS[i]} ${frac(top, den)}`).join(', ')}이다. 분자가 큰 수부터 차례대로 쓴다.`,
        facts: { choose: { exprs: tops.map((top, i) => valueOf(top, den, asMixed[i])), rule: 'descending', orders: pick.list } }
      });
    }),
    T('comp-count-below', '기준보다 작은 분수의 수', '②74', (d) => {
      const den = d.int(4, 8), base = d.int(1, 2) * den + d.int(1, den - 1);
      const tops = d.until(() => [0, 0, 0, 0, 0].map(() => base + d.int(-den, den)), (list) => new Set(list).size === 5 && list.every((v) => v !== base && v > 1 && v % den !== 0) && list.some((v) => v < base) && list.some((v) => v > base));
      const asMixed = d.shuffle([true, false, true, false, true]), below = tops.filter((v) => v < base);
      return N(`${mixed(Math.floor(base / den), base % den, den)}보다 작은 분수는 모두 몇 개인가?`, below.length, {
        unit: '개', figure: numbers(tops.map((top, i) => show(top, den, asMixed[i]))),
        explain: `${mj(Math.floor(base / den), base % den, den, '을/를')} 가분수로 나타내면 ${frac(base, den)}이다. 분자가 ${base}보다 작은 분수는 ${below.map((top) => frac(top, den)).join(', ')}이다.`,
        facts: { choose: { exprs: tops.map((top, i) => valueOf(top, den, asMixed[i])), rule: 'countBelow', target: base / den } }
      });
    }),
    T('comp-clue', '세 분수에 대한 설명', '②81', (d) => {
      // 세 수: 가분수(top), 자연수와 크기가 같은 가분수(c), 대분수(가장 작거나 가장 크다). 옳은 설명은 하나뿐이다.
      const den = d.int(4, 9), c = d.int(2, 3), q = c + d.int(0, 1), r = d.int(2, den - 2), top = q * den + r, low = d.bool(), s = d.int(1, den - 1);
      const side = low ? [c - 1, s] : [q + 1, s], right = d.int(0, 2);
      // 가장 작은 수: 대분수가 아래에 있으면 대분수, 위에 있으면 자연수와 같은 가분수
      const least = low ? mixed(side[0], side[1], den) : frac(c * den, den), middle = low ? frac(c * den, den) : frac(top, den);
      const rows = d.shuffle([
        { text: `가장 작은 수는 ${right === 0 ? least : middle}이다.`, ok: right === 0 },
        { text: `${fj(c * den, den, '은/는')} 자연수 ${josa(right === 1 ? c : den, '과/와')} 크기가 같다.`, ok: right === 1 },
        { text: `${fj(top, den, '은/는')} ${mixed(q, right === 2 ? r - 1 : r + 1, den)}보다 크다.`, ok: right === 2 }
      ]);
      return C('세 분수에 대한 설명으로 옳은 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        figure: numbers(d.shuffle([frac(top, den), frac(c * den, den), mixed(side[0], side[1], den)])),
        explain: `${fj(c * den, den, '은/는')} ${josa(c, '과/와')} 크기가 같다. 모두 가분수로 나타내면 ${frac(top, den)}, ${frac(c * den, den)}, ${frac(side[0] * den + side[1], den)}이고, ${fj(top, den, '을/를')} 대분수로 나타내면 ${mixed(q, r, den)}이다.`,
        facts: { truth: rows.map((row) => row.ok), want: true }
      });
    }),
    T('comp-above', '자연수보다 큰 수 찾기', '③103', (d) => {
      // 큰 수 하나: 가분수이거나 대분수. 작은 수 셋: 분자가 조금 모자란 가분수 둘, 자연수 부분이 하나 작은 대분수
      const w = d.int(2, 3), dens = d.shuffle([3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
      const over = d.bool() ? [w * dens[0] + d.int(1, 2), dens[0], false] : [w * dens[0] + d.int(1, dens[0] - 1), dens[0], true];
      const list = d.shuffle([over, [w * dens[1] - d.int(1, 2), dens[1], false], [w * dens[2] - 1, dens[2], false], [(w - 1) * dens[3] + d.int(dens[3] - 2, dens[3] - 1), dens[3], true]]);
      return C(`${w}보다 큰 수는?`, list.map((row) => show(...row)), list.indexOf(over), {
        explain: `${josa(w, '을/를')} 분모가 같은 가분수로 나타내어 분자의 크기를 비교한다. ${josa(w, '은/는')} ${fj(w * over[1], over[1], '과/와')} 같으므로 ${w}보다 큰 수는 ${show(...over)}뿐이다.`,
        facts: { choose: { exprs: list.map((row) => valueOf(...row)), rule: 'onlyAbove', target: w } }
      });
    })
  ]);

  // ── 실력 문제 ──
  B.addTypes('3-2-4', 'hard', [
    H('h-part-sum', '두 양을 합한 전체에서 부분의 분수', '심7', (d) => {
      const [g, m, k] = d.until(() => [d.int(2, 6), d.int(3, 9), d.int(1, 8)], ([x, y, z]) => z >= 2 && z < y && gcd(z, y) === 1 && x * y <= 60 && x !== y && z !== y - z), a = g * k, b = g * (m - k);
      return F(`빨간 색종이 ${a}장과 노란 색종이 ${b}장이 있다. 색종이 전체를 똑같이 ${m}묶음으로 나누면 빨간 색종이는 전체의 몇 분의 몇인가?`, k, m, {
        explain: `색종이는 모두 ${a} + ${b} = ${a + b}(장)이고, 한 묶음은 ${a + b} ÷ ${m} = ${g}(장)이다. 빨간 색종이 ${a}장은 ${k}묶음이므로 전체의 ${frac(k, m)}이다.`,
        facts: { partOf: { total: a + b, group: g, part: a }, calc: [[`${a}/((${a}+${b})/${m})`, 0], [String(m), 1]] }
      });
    }, { standard: PART }),
    H('h-of-two-left', '두 번 덜어 내고 남은 양', '심20, 기본 ①18 ③21', (d) => {
      const [total, m1, k1, m2, k2] = twoShares(d, (all, a, b) => a + b < all && a !== b);
      const a = total / m1 * k1, b = total / m2 * k2;
      return N(`색종이 ${total}장 중에서 전체의 ${fj(k1, m1, '은/는')} 종이학을 접는 데 사용하고, 전체의 ${fj(k2, m2, '은/는')} 종이배를 접는 데 사용하였다. 남은 색종이는 몇 장인가?`, total - a - b, {
        unit: '장', explain: `종이학을 접는 데 ${total} ÷ ${m1} × ${k1} = ${a}(장), 종이배를 접는 데 ${total} ÷ ${m2} × ${k2} = ${b}(장)을 사용하였다. ${total} - ${a} - ${b} = ${total - a - b}`,
        facts: { calc: [[`${total}-${total}/${m1}*${k1}-${total}/${m2}*${k2}`, 0]] }
      });
    }, { standard: PART }),
    H('h-of-who-more', '두 분수만큼을 구해 누가 얼마나 더', '심21, 기본 ①19 ②26 ③22', (d) => {
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [total, m1, k1, m2, k2] = twoShares(d, (all, a, b) => a !== b && a + b <= all && Math.abs(a - b) <= 12, true);
      const values = [total / m1 * k1, total / m2 * k2], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
      // 틀린 차: 단위분수만큼끼리의 차(분자를 곱하지 않았다). 차가 같으면 2 큰 수.
      const unit = Math.abs(total / m1 - total / m2), other = unit > 0 && unit !== gap ? unit : gap + 2;
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
      return C(`딸기 ${total}개 중에서 ${name(one, '은/는')} 전체의 ${fj(k1, m1, '을/를')}, ${name(two, '은/는')} 전체의 ${fj(k2, m2, '을/를')} 먹었다. 누가 몇 개 더 많이 먹었는가?`, list.map(([who, n]) => `${[one, two][who]}, ${n}개`), list.findIndex(([who, n]) => who === winner && n === gap), {
        explain: `${name(one, '은/는')} ${total} ÷ ${m1} × ${k1} = ${values[0]}(개), ${name(two, '은/는')} ${total} ÷ ${m2} × ${k2} = ${values[1]}(개)를 먹었다. ${name([one, two][winner], '이/가')} ${Math.max(...values)} - ${Math.min(...values)} = ${gap}(개) 더 많이 먹었다.`,
        facts: { who: { values, options: list, exprs: [`${total}/${m1}*${k1}`, `${total}/${m2}*${k2}`] } }
      });
    }, { standard: PART }),
    H('h-of-three', '세 사람의 몫 가운데 가장 많은 것과 가장 적은 것의 차', '심22, 기본 ③23', (d) => {
      const [one, two, three] = d.shuffle(NAMES).slice(0, 3);
      const [total, m1, k1, m2, k2] = twoShares(d, (all, a, b) => all - a - b >= 2 && new Set([a, b, all - a - b]).size === 3);
      const said = [`${total}/${m1}*${k1}`, `${total}/${m2}*${k2}`, `(${total}-${total}/${m1}*${k1}-${total}/${m2}*${k2})`];
      const values = [total / m1 * k1, total / m2 * k2, total - total / m1 * k1 - total / m2 * k2], most = values.indexOf(Math.max(...values)), least = values.indexOf(Math.min(...values));
      return N(`귤 ${total}개를 세 사람이 나누어 가졌다. ${name(one, '은/는')} 전체의 ${fj(k1, m1, '을/를')}, ${name(two, '은/는')} 전체의 ${fj(k2, m2, '을/를')} 가졌고, ${name(three, '은/는')} 나머지를 모두 가졌다. 귤을 가장 많이 가진 사람은 가장 적게 가진 사람보다 몇 개 더 많이 가졌는가?`, values[most] - values[least], {
        unit: '개', explain: `${name(one, '은/는')} ${total} ÷ ${m1} × ${k1} = ${values[0]}(개), ${name(two, '은/는')} ${total} ÷ ${m2} × ${k2} = ${values[1]}(개), ${name(three, '은/는')} ${total} - ${values[0]} - ${values[1]} = ${values[2]}(개)를 가졌다. ${values[most]} - ${values[least]} = ${values[most] - values[least]}`,
        facts: { calc: [[`${said[most]}-${said[least]}`, 0]], tableRank: { values, a: 0, b: 2 } }
      });
    }, { standard: PART }),
    H('h-of-sum', '두 분수만큼을 합한 시간', '심16, 기본 ①24·30', (d) => {
      const who = d.pick(NAMES), [m1, k1, m2, k2] = d.pick([[4, 1, 3, 1], [4, 1, 8, 3], [6, 1, 3, 1], [6, 1, 8, 3]]);
      const a = 24 / m1 * k1, b = 24 / m2 * k2;
      return N(`${name(who, '은/는')} 하루의 ${frac(k1, m1)}만큼은 학교에서 지내고, 하루의 ${frac(k2, m2)}만큼은 잠을 잔다. ${name(who, '이/가')} 하루에 학교에서 지내는 시간과 잠을 자는 시간은 모두 몇 시간인가?`, a + b, {
        unit: '시간', explain: `하루는 24시간이다. 학교에서 지내는 시간은 24 ÷ ${m1} × ${k1} = ${a}(시간), 잠을 자는 시간은 24 ÷ ${m2} × ${k2} = ${b}(시간)이다. ${a} + ${b} = ${a + b}`,
        facts: { calc: [[`24/${m1}*${k1}+24/${m2}*${k2}`, 0]], unseen: [24] }
      });
    }, { standard: PART }),
    H('h-of-total', '두 양을 합한 전체의 분수만큼', '심25', (d) => {
      const [m, u, k] = ofPick(d, (x, y) => x * y >= 20), total = m * u, a = d.until(() => d.int(6, total - 6), (v) => v % m !== 0 && v * 2 !== total), b = total - a;
      return N(`상자에 빨간 공 ${a}개와 파란 공 ${b}개가 들어 있다. 상자에 들어 있는 공 전체의 ${fj(k, m, '을/를')} 꺼냈다. 꺼낸 공은 몇 개인가?`, u * k, {
        unit: '개', explain: `공은 모두 ${a} + ${b} = ${total}(개)이다. ${total}의 ${fj(k, m, '은/는')} ${total} ÷ ${m} × ${k} = ${u * k}(개)이다.`,
        facts: { calc: [[`(${a}+${b})/${m}*${k}`, 0]] }
      });
    }, { standard: PART }),
    H('h-of-left-diff', '두 끈에서 쓰고 남은 길이의 차', '심26', (d) => {
      const left = ([m, u, k]) => u * (m - k);
      const [p, q] = d.until(() => [ofPick(d), ofPick(d)], ([x, y]) => x[0] !== y[0] && ofTotal(x) >= 12 && ofTotal(y) >= 12 && ofTotal(x) !== ofTotal(y) && left(x) !== left(y) && Math.abs(left(x) - left(y)) <= 20);
      const said = (row) => `(${ofTotal(row)}-${ofExpr(row)})`, big = left(p) > left(q) ? p : q, small = big === p ? q : p;
      return N(`길이가 ${ofTotal(p)} cm인 빨간 끈의 ${fj(p[2], p[0], '과/와')} 길이가 ${ofTotal(q)} cm인 파란 끈의 ${fj(q[2], q[0], '을/를')} 사용하였다. 남은 두 끈의 길이의 차는 몇 cm인가?`, left(big) - left(small), {
        unit: 'cm', explain: `빨간 끈은 ${ofTotal(p)} ÷ ${p[0]} × ${p[2]} = ${ofValue(p)}(cm)를 사용하여 ${ofTotal(p)} - ${ofValue(p)} = ${left(p)}(cm)가 남고, 파란 끈은 ${ofTotal(q)} ÷ ${q[0]} × ${q[2]} = ${ofValue(q)}(cm)를 사용하여 ${ofTotal(q)} - ${ofValue(q)} = ${left(q)}(cm)가 남는다. ${left(big)} - ${left(small)} = ${left(big) - left(small)}`,
        facts: { calc: [[`${said(big)}-${said(small)}`, 0]] }
      });
    }, { standard: PART }),
    H('h-whole-then', '단위분수만큼으로 전체를 구해 다른 분수만큼 구하기', '심30', (d) => {
      const [m1, v, m2, k2] = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(3, 9), d.int(2, 8)], ([a, x, b, k]) => a !== b && k < b && gcd(k, b) === 1 && (a * x) % b === 0 && a * x <= 72 && a * x / b * k !== x);
      const whole = m1 * v;
      return N(`어떤 수의 ${fj(1, m1, '은/는')} ${v}이다. 어떤 수의 ${fj(k2, m2, '은/는')}?`, whole / m2 * k2, {
        explain: `어떤 수는 ${v} × ${m1} = ${whole}이다. ${whole}의 ${fj(k2, m2, '은/는')} ${whole} ÷ ${m2} × ${k2} = ${whole / m2 * k2}이다.`, facts: { calc: [[`${v}*${m1}/${m2}*${k2}`, 0]] }
      });
    }, { standard: PART }),
    H('h-cards-mixed', '수 카드로 가장 큰 대분수 만들기', '심59, 기본 ①59 ②51 ③87', (d) => {
      const [x, y, z] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, q) => p - q);
      return M('수 카드 세 장을 한 번씩 모두 사용하여 가장 큰 대분수를 만들고, 그 대분수를 가분수로 나타내려고 한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([z, x, y, z * y + x]), {
        figure: cards(d.shuffle([x, y, z])) + lines([`가장 큰 대분수: ${mixed(box(LABELS[0]), box(LABELS[1]), box(LABELS[2]))}`, `가분수: ${frac(box(LABELS[3]), box(LABELS[2]))}`]),
        explain: `자연수 부분이 클수록 큰 분수이므로 가장 큰 수 ${josa(z, '을/를')} 자연수 부분에 놓고, 남은 두 수로 진분수 ${fj(x, y, '을/를')} 만든다. ${z} × ${y} + ${x} = ${z * y + x}이므로 ${mj(z, x, y, '은/는')} ${frac(z * y + x, y)}이다.`,
        facts: { calc: [[String(z), 0], [String(x), 1], [String(y), 2], [`${z}*${y}+${x}`, 3]] }
      });
    }),
    H('h-improper-below', '기준보다 작은 가분수의 수', '심69, 기본 ③55·111·112', (d) => {
      const [w, n, den] = d.until(() => [d.int(1, 2), d.int(1, 4), d.int(3, 5)], ([x, y, z]) => y < z && (x - 1) * z + y >= 3), top = w * den + n, right = top - den;
      const list = d.shuffle([
        right,          // 바른 것
        right - 1,      // 분자와 분모가 같은 분수는 가분수가 아니라고 여기는 아이가 고른다
        top - 1,        // 진분수까지 모두 세는 아이가 고른다
        right + 1       // 기준이 되는 수까지 세는 아이가 고른다
      ]);
      return C(`분모가 ${den}인 가분수 중에서 ${mixed(w, n, den)}보다 작은 분수는 모두 몇 개인가?`, list.map((v) => `${v}개`), list.indexOf(right), {
        explain: `${mj(w, n, den, '을/를')} 가분수로 나타내면 ${frac(top, den)}이다. 분모가 ${den}인 가분수는 ${frac(den, den)}부터이므로 분자가 ${den}부터 ${top - 1}까지인 ${right}개이다.`,
        facts: { pick: { expr: `${w}*${den}+${n}-${den}`, options: list } }
      });
    }, { standard: COMP }),
    H('h-between-count', '두 분수 사이에 있는 분수의 분자', '심70, 기본 ①90 ②77 ③107', (d) => {
      const den = d.int(4, 9), lo = d.until(() => d.int(den + 1, den * 3), (v) => v % den !== 0), count = d.until(() => d.int(2, 6), (v) => (lo + v + 1) % den !== 0), hi = lo + count + 1;
      return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', count, {
        unit: '개', figure: ex(`${frac(lo, den)} <i>&lt;</i> ${frac(box(), den)} <i>&lt;</i> ${mixed(Math.floor(hi / den), hi % den, den)}`),
        explain: `${mj(Math.floor(hi / den), hi % den, den, '을/를')} 가분수로 나타내면 ${frac(hi, den)}이다. □ 안에는 ${lo}보다 크고 ${hi}보다 작은 수가 들어갈 수 있으므로 ${lo + 1}부터 ${hi - 1}까지 ${count}개이다.`,
        facts: { digit: { template: `${lo}/${den}<□/${den}<(${Math.floor(hi / den)}*${den}+${hi % den})/${den}`, lo: 1, hi: 60, ask: 'count' } }
      });
    }, { standard: COMP }),
    H('h-fill-top', '□가 있는 가분수와 대분수의 크기 비교', '심71, 기본 ①93 ②76 ③107', (d) => {
      const [w, n, den] = mixedOf(d, (x, y, z) => z >= 4), top = w * den + n;
      return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 큰 수는?', top - 1, {
        figure: ex(`${frac(box(), den)} <i>&lt;</i> ${mixed(w, n, den)}`),
        explain: `${mj(w, n, den, '을/를')} 가분수로 나타내면 ${frac(top, den)}이다. □ 안에는 ${top}보다 작은 수가 들어갈 수 있으므로 가장 큰 수는 ${top - 1}이다.`,
        facts: { digit: { template: `□/${den}<(${w}*${den}+${n})/${den}`, lo: 1, hi: 60, ask: 'max' } }
      });
    }, { standard: COMP }),
    H('h-fill-whole', '□가 있는 대분수의 자연수 부분', '심73, 기본 ①92 ②78 ③109', (d) => {
      // 분자끼리 비교해야 한다: 왼쪽 분자가 더 작으면 자연수 부분이 같아도 되고, 같거나 크면 하나 작아야 한다.
      const den = d.int(4, 9), whole = d.int(3, 6), r = d.int(1, den - 1), k = d.int(1, den - 1), top = whole * den + r, best = k < r ? whole : whole - 1;
      return N('대분수의 자연수 부분인 □ 안에 들어갈 수 있는 수 중에서 가장 큰 수는?', best, {
        figure: ex(`${mixed(box(), k, den)} <i>&lt;</i> ${frac(top, den)}`),
        explain: `${fj(top, den, '을/를')} 대분수로 나타내면 ${mixed(whole, r, den)}이다. ` + `□ 안에 ${josa(whole, '을/를')} 넣으면 ${mj(whole, k, den, '은/는')} ${mixed(whole, r, den)}보다 ` + (k < r ? `작으므로 가장 큰 수는 ${whole}이다.` : `작지 않으므로 가장 큰 수는 ${whole - 1}이다.`),
        facts: { digit: { template: `(□*${den}+${k})/${den}<${top}/${den}`, lo: 1, hi: 9, ask: 'max' } }
      });
    }, { standard: COMP })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
