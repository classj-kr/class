// 5학년 1학기 4단원 약분과 통분 — 단원 틀과 기본 문항(크기가 같은 분수 알아보기·만들기, 약분과 기약분수, 통분과 공통분모).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 82·82·84꼴, 심화꼴 79꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/5-1-4/싣기_대조표.md 에 있다.
// (분모가 다른 분수의 크기 비교, 분수와 소수의 크기 비교, 실력 문항은 5-1-4b.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다. 주는 것(색칠한 띠·모눈·수직선·식·문장), 묻는 것(빈칸·고르기·개수·기약분수)이 다르면 따로 싣는다.
//    크기가 같은 분수는 곱해서 만드는 것과 나누어 만드는 것, 분자가 빈칸인 것과 분모가 빈칸인 것을 따로 싣고,
//    통분은 한쪽 분모가 다른 쪽의 배수인 쌍(1/3, 5/6), 공약수가 1뿐인 쌍(2/3, 4/5), 그 밖의 쌍(5/6, 7/8)을 따로 싣는다(facts.rule 에 이름을 단다).
//  - 기약분수 하나가 답인 문항은 분자·분모 칸에 받는다(F). 기약분수가 아닌 답(크기가 같은 분수, 통분한 분수, 한 번 약분한 분수)은
//    분모나 분자를 적어 준 빈칸 틀을 보이고 수로 받는다. 「통분하시오」「약분하시오」처럼 답이 여럿인 꼴은 공통분모나 나누는 수를 정해 주어 답을 하나로 만들었다.
//  - 답은 모두 코드로 셈한다(최대공약수·최소공배수, 크기 비교는 교차 곱). 고르기 문항의 참·거짓도 코드가 가린다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(잇기는 짝 고르기와, 놀이판·색칠해 글자 찾기는 계산 문항과 같은 문제).
//
// 뺀 것과 까닭
//  - 다음 단원·상위 학년: 분모와 분자의 합이나 차가 정해진 분수(①22·23 ②18 ③20 심13·14·15·16·17 — 합을 나누어 갖는 비례배분, 6학년. 늘어놓으면 풀리는 것도 뺐다),
//    분모와 분자에 같은 수를 더하거나 빼서 분수를 맞추는 것(②20 심38 — 방정식), 한 부분을 다른 부분에 견준 분수(심33·34 — 비와 비율)
//  - 색칠하기·수직선에 나타내기(작도: ①2·4·5 ②2·3·4 ③1·2·3·4의 그리는 부분, ①58 ②52·71 ③76의 변형) — 색칠해 준 그림을 보고 답하는 꼴로 바꾸어 실었다.
//  - 방법·까닭 쓰기(서술형: ①54 ②21 ③51 심27·79, ①20·34·65 ②1·31 ③10·26·37·38·43·59·71 심19의 쓰는 부분), 답이 열려 있는 것(③10, ①14·③54의 변형)
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: 수 카드로 만들 수 있는 분수를 모두 따지는 것(①24·79·80 ②37·67·80 ③54·70 심69·70·71·72·73),
//    조건 셋 넘게 맞는 분수(①40 ②38, ②35·63의 변형, 심56), 말풍선 조건으로 분수 맞히기(①68 심18), 세 단계를 거슬러 셈하기(①39), 약분·통분을 거슬러 두 분모의 합 구하기(①53),
//    번갈아 놓인 규칙의 몇째 수(②81)
//  - 뜻 없는 셈: 빈칸에 들어갈 수끼리 더하기(②22의 변형, 심4, ③53·심45의 합 — 빈칸은 하나씩 묻는다), 기약분수의 분모와 분자의 합(③36)
//  - 앞 학년 되짚기(②82 ③84)
//  - 같은 문제여서 한 번만 실은 것: 갈림길에서 더 큰 분수 따라가기(③64 — 더 큰 분수를 위 칸에 써넣기와 같다), 색칠해 글자 찾기(③32), 삼목 놀이판(③28·44의 변형),
//    분모가 100에 가장 가까운 크기가 같은 분수(③12의 변형 — 100에 가장 가까운 공통분모와 같은 일), 소수와 분수 사이의 기약분수(심63 — 두 분수 사이의 기약분수와 같은 일)
//  - 그림이 필요해 미룬 것은 없다. 분수 막대(심2)와 눈금 컵(①6)은 길이가 같은 띠와 글로 바꾸어 실었고, 갈림길(③64, 심52의 변형)은 대진표 꼴과 같은 문제다.
// 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, mixed, pieces, partLine, lines, tagged, numbers, cards, N, M, C, F } = B.kit;
  const EQ = '6수01-06', CMP = '6수01-07', DEC = '6수01-12';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], KA = ['가', '나', '다', '라'];
  const SIGNS = ['&gt;', '=', '&lt;'];
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  const divisors = (n) => { const out = []; for (let k = 1; k <= n; k += 1) if (n % k === 0) out.push(k); return out; };
  const primesOf = (n) => [2, 3, 5, 7, 11, 13].filter((p) => n % p === 0);
  // 분모와 공약수가 1뿐인 수인지 검사가 다시 따지는 식: 분모의 소인수로 나눈 나머지가 모두 0이 아니다.
  const coprimeTo = (n) => primesOf(n).map((p) => `(□%${p})`).join('*');
  const sign = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  // 토씨: 분수는 분자를 마지막에 읽는다(5분의 3).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (n, d, pair) => frac(n, d) + tail(n, pair);
  const SIGN = { '=': '=', '>': '&gt;', '<': '&lt;', '→': '→' };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  const eq = (...parts) => ex(parts.map((p) => (SIGN[p] ? '<i>' + SIGN[p] + '</i>' : p)).join(' '));
  const versus = (left, right) => `<div class="mb-versus">${ex(left)}<span class="mb-ring"></span>${ex(right)}</div>`;
  const duo = (x, y) => `(${x}, ${y})`;
  const blankFrac = (i, j) => frac(box(LAB[i]), box(LAB[j]));
  // 두 분수를 통분하는 틀: (a/b, c/d) → (왼쪽, 오른쪽)
  const arrow = (from, to) => ex(`${from} <i>→</i> ${to}`);

  // ── 수 고르기 ──
  // 기약분수인 진분수 a/b (b 는 lo~hi)
  const reduced = (d, lo, hi, ok) => d.until(() => { const b = d.int(lo, hi); return [d.int(1, b - 1), b]; }, ([a, b]) => gcd(a, b) === 1 && (!ok || ok(a, b)));
  const coTop = (d, den, lo) => d.until(() => d.int(lo || 1, den - 1), (v) => gcd(v, den) === 1);
  // 통분할 두 분모: 한쪽이 다른 쪽의 배수(MULTIPLE), 공약수가 1뿐(COPRIME), 그 밖(GENERAL)
  const MULTIPLE = [[2, 4], [2, 6], [3, 6], [2, 8], [4, 8], [3, 9], [5, 10], [3, 12], [4, 12], [6, 12], [7, 14], [3, 15], [5, 15], [4, 16], [8, 16], [6, 18], [9, 18], [4, 20], [5, 20], [10, 20], [7, 21], [6, 24], [8, 24], [12, 24]];
  const COPRIME = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [3, 8], [5, 8], [7, 8], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [3, 10], [7, 10]];
  const GENERAL = [[4, 6], [6, 8], [6, 9], [4, 10], [6, 10], [8, 10], [8, 12], [9, 12], [10, 12], [6, 14], [6, 15], [9, 15], [10, 15], [12, 15], [12, 16], [12, 18], [8, 20], [15, 20], [14, 21], [10, 25]];
  // 두 기약분수 a/b, c/e (분모는 list 에서 뽑아 차례를 섞는다)
  const twoFracs = (d, list, ok) => d.until(() => { const [b, e] = d.shuffle(d.pick(list)); return [coTop(d, b), b, coTop(d, e), e]; }, ([a, b, c, e]) => a * e !== c * b && (!ok || ok(a, b, c, e)));
  // 크기가 같은 두 분수와, 크기가 비슷하지만 다른 분수 하나(분모는 12까지)를 섞어서 돌려준다.
  // 다른 하나는 그림에서 눈으로 가려지게 전체의 1/12 넘게 차이가 난다.
  function sameTriple(d) {
    const rows = d.until(() => {
      const [a, b] = reduced(d, 2, 5), k = d.until(() => d.int(2, 4), (v) => b * v <= 12), m = d.until(() => d.int(3, 10), (v) => v !== b && v !== b * k);
      return [[a, b], [a * k, b * k], [Math.round(a * m / b) + d.pick([-1, 0, 1]), m]];
    }, ([[a, b], , [c, m]]) => c >= 1 && c < m && Math.abs(c * b - a * m) * 12 >= b * m && Math.abs(c * b - a * m) * 4 <= b * m);
    return d.shuffle(rows);
  }
  const PAIRS3 = [[0, 1], [0, 2], [1, 2]], PAIRS4 = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const same = (p, q) => p[0] * q[1] === q[0] * p[1];

  // ── 그림 ──
  // 띠 하나: 길이가 같은 띠를 똑같이 n칸으로 나누어 앞의 k칸을 색칠한다(띠마다 길이가 같아야 색칠한 부분으로 분수의 크기를 비교할 수 있다).
  function band(n, k) {
    const W = 216, h = 26, w = W / n;
    let out = '';
    for (let i = 0; i < n; i += 1) out += `<rect class="mb-piece${i < k ? ' is-on' : ''}" x="${(2 + i * w).toFixed(2)}" y="2" width="${w.toFixed(2)}" height="${h}"/>`;
    return `<svg class="mb-pieces" style="vertical-align:middle" viewBox="0 0 ${W + 4} ${h + 4}" width="${W + 4}" role="img" aria-label="띠를 똑같이 ${n}칸으로 나누어 ${k}칸을 색칠">${out}</svg>`;
  }
  // 길이가 같은 수직선 여러 개(0부터 1까지). rows: [나눈 칸 수, 화살표가 가리키는 칸, 이름표]
  function twinLines(rows) {
    const L = 220, x0 = rows.some((row) => row[2]) ? 36 : 14, gap = 48, width = x0 + L + 14, height = rows.length * gap + 2;
    let out = '';
    rows.forEach(([parts, at, tag], r) => {
      const y = 24 + r * gap, x = (i) => (x0 + (i / parts) * L).toFixed(1);
      out += `<line class="mb-axis" x1="${x0}" y1="${y}" x2="${x0 + L}" y2="${y}"/>`;
      for (let i = 0; i <= parts; i += 1) out += `<line class="mb-axis" x1="${x(i)}" y1="${y - (i % parts === 0 ? 6 : 3.5)}" x2="${x(i)}" y2="${y + (i % parts === 0 ? 6 : 3.5)}"/>`;
      out += `<text class="mb-km-label" x="${x0}" y="${y + 19}" text-anchor="middle">0</text><text class="mb-km-label" x="${x0 + L}" y="${y + 19}" text-anchor="middle">1</text>`;
      out += `<path class="mb-pointer" d="M${x(at)} ${y - 7}l-4.5 -9h9z"/>`;
      if (tag) out += `<text class="mb-km-label" style="font-size:14px" x="10" y="${y + 5}" text-anchor="middle">${tag}</text>`;
    });
    const said = rows.map(([parts, at, tag]) => `${tag ? tag + ' ' : ''}0부터 1까지를 똑같이 ${parts}칸으로 나누고 화살표는 0에서 ${at}칸 간 곳`).join(', ');
    return `<svg class="mb-numberline" viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="길이가 같은 수직선 ${rows.length}개: ${said}">${out}</svg>`;
  }

  B.addUnit({
    id: '5-1-4', grade: 5, semester: 1, no: 4, title: '약분과 통분', version: 1,
    groups: [
      {
        id: 'same', title: '크기가 같은 분수 알아보기', standard: EQ,
        types: [
          T('same-bars-sign', '색칠한 두 띠를 보고 분수의 크기 비교하기', '①1 ②1 ③1 심2', (d) => {
            const [a, b] = reduced(d, 2, 6), k = d.until(() => d.int(2, 4), (v) => b * v <= 12), gap = d.pick([0, 0, 1, -1]), c = a * k + gap, n = b * k;
            return C('길이가 같은 두 띠에 색칠한 부분을 보고 두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(a * k, c), {
              figure: lines([band(b, a), band(n, c)]) + versus(frac(a, b), frac(c, n)),
              explain: gap === 0 ? `색칠한 부분의 길이가 같으므로 ${fj(a, b, '과/와')} ${fj(c, n, '은/는')} 크기가 같은 분수이다.`
                : `${fj(a, b, '은/는')} ${fj(a * k, n, '과/와')} 크기가 같다. 색칠한 부분의 길이를 비교하면 ${fj(a, b, '이/가')} ${frac(c, n)}보다 ${gap < 0 ? '크다' : '작다'}.`,
              facts: { choose: { exprs: [`${a}/${b}`, `${c}/${n}`], rule: 'compare' } }
            });
          }),
          T('same-bars-pair', '색칠한 세 띠에서 크기가 같은 두 분수 찾기', '①2·3 ②2 ③3 심1·2', (d) => {
            const rows = sameTriple(d), hit = PAIRS3.findIndex(([i, j]) => same(rows[i], rows[j])), [i, j] = PAIRS3[hit];
            return C('길이가 같은 세 띠에 분수만큼 색칠하였다. 색칠한 부분의 크기가 같은 두 분수는?', PAIRS3.map(([p, q]) => `${frac(...rows[p])}, ${frac(...rows[q])}`), hit, {
              figure: tagged(rows.map(([k, n]) => band(n, k))),
              explain: `${LAB[i]}과 ${LAB[j]}은 색칠한 부분의 길이가 같다. 따라서 ${fj(rows[i][0], rows[i][1], '과/와')} ${fj(rows[j][0], rows[j][1], '은/는')} 크기가 같은 분수이다.`,
              facts: { choose: { exprs: rows.map(([k, n]) => `${k}/${n}`), rule: 'same', pairsShown: PAIRS3 } }
            });
          }),
          T('same-bars-fill', '색칠한 그림을 보고 크기가 같은 분수 쓰기', '②1 ③5 심1', (d) => {
            const [a, b] = reduced(d, 2, 4), [k1, k2] = d.pick(b === 2 ? [[2, 3], [2, 4], [3, 6], [2, 6]] : b === 3 ? [[2, 3], [2, 4], [3, 4]] : [[2, 3]]);
            return M('길이가 같은 세 띠에 색칠한 부분의 크기가 같다. ㉠, ㉡에 알맞은 수는?', labelled([a * k1, a * k2]), {
              figure: lines([band(b, a), band(b * k1, a * k1), band(b * k2, a * k2)]) + eq(frac(a, b), '=', frac(box(LAB[0]), b * k1), '=', frac(box(LAB[1]), b * k2)),
              explain: `둘째 띠는 ${b * k1}칸 중 ${a * k1}칸, 셋째 띠는 ${b * k2}칸 중 ${a * k2}칸을 색칠하였다. ${frac(a, b)} = ${frac(a * k1, b * k1)} = ${frac(a * k2, b * k2)}`,
              facts: { calc: [[`${a}*${b * k1}/${b}`, 0], [`${a}*${b * k2}/${b}`, 1]] }
            });
          }),
          T('same-grid-pick', '색칠한 모눈에서 주어진 분수와 크기가 같은 것 찾기', '①3 심2', (d) => {
            // 모눈: [칸 수, 가로 칸 수]. 틀린 그림은 색칠한 칸이 한두 칸 많거나 적다.
            const q = d.pick([2, 3, 4]), GRIDS = [[6, 3], [8, 4], [9, 3], [10, 5], [12, 4], [15, 5], [16, 4], [18, 6], [20, 5], [24, 6]];
            const right = d.pick(GRIDS.filter(([n]) => n % q === 0 && n / q >= 2)), others = d.shuffle(GRIDS.filter((g) => g !== right)).slice(0, 2);
            const rows = d.shuffle([[right, right[0] / q]].concat(others.map((g) => [g, d.until(() => Math.round(g[0] / q) + d.pick([-1, 0, 1, 2]), (v) => v >= 1 && v < g[0] && v * q !== g[0])])));
            const hit = rows.findIndex((row) => row[0] === right), [[n], k] = rows[hit];
            return C(`색칠한 부분이 전체의 ${frac(1, q)}인 것은?`, LAB.slice(0, 3), hit, {
              figure: tagged(rows.map(([[cells, cols], shaded]) => pieces('grid', cells, { cols, shaded, scale: 0.8 }))),
              explain: `${LAB[hit]}은 ${n}칸 중 ${k}칸을 색칠하였다. ${frac(k, n)}의 분모와 분자를 각각 ${josa(k, '으로/로')} 나누면 ${frac(1, q)}이다.`,
              facts: { choose: { exprs: rows.map(([[cells], shaded]) => `${shaded}/${cells}`), rule: 'equals', target: 1 / q } }
            });
          }),
          T('same-bars-cells', '크기가 같게 색칠할 칸 수 구하기', '①4 ②3 ③4', (d, n) => {
            // 첫째 문항은 더 잘게 나눈 띠에, 둘째 문항은 더 크게 나눈 띠에 색칠한다.
            const [a, b] = reduced(d, 2, 5), k = d.until(() => d.int(2, 5), (v) => b * v <= 15), fine = n === 0;
            return N('위의 띠에 색칠한 부분과 크기가 같게 아래의 띠를 색칠하려고 한다. 아래의 띠는 몇 칸을 색칠해야 하는가?', fine ? a * k : a, {
              unit: '칸', figure: lines(fine ? [band(b, a), band(b * k, 0)] : [band(b * k, a * k), band(b, 0)]),
              explain: fine ? `아래의 띠는 위의 띠의 한 칸을 ${k}칸씩으로 더 나눈 것이다. ${frac(a, b)} = ${frac(a * k, b * k)}이므로 ${a * k}칸을 색칠한다.`
                : `위의 띠 ${k}칸이 아래의 띠 한 칸과 같다. ${frac(a * k, b * k)} = ${frac(a, b)}이므로 ${a}칸을 색칠한다.`,
              facts: { calc: [[fine ? `${a}*${b * k}/${b}` : `${a * k}*${b}/${b * k}`, 0]], rule: fine ? 'cellsFiner' : 'cellsCoarser' }
            });
          }, { count: 2 }),
          T('same-line-pair', '수직선에 나타낸 세 분수에서 크기가 같은 두 분수 찾기', '①5 ②4 ③2 심1', (d) => {
            // 수직선의 눈금이 촘촘하지 않게 세 분모가 모두 10 이하인 것만 쓴다(띠 문항과 같은 세 분수가 은행에 실리는 것도 이 조건이 막는다).
            const rows = d.until(() => sameTriple(d), (list) => list.every((row) => row[1] <= 10)), hit = PAIRS3.findIndex(([i, j]) => same(rows[i], rows[j])), [i, j] = PAIRS3[hit];
            return C('길이가 같은 세 수직선에 화살표로 나타낸 분수 가운데 크기가 같은 두 분수는?', PAIRS3.map(([p, q]) => `${frac(...rows[p])}, ${frac(...rows[q])}`), hit, {
              figure: twinLines(rows.map(([k, n], r) => [n, k, LAB[r]])),
              explain: `${LAB[i]}과 ${LAB[j]}의 화살표는 0에서 같은 거리에 있다. 따라서 ${fj(rows[i][0], rows[i][1], '과/와')} ${fj(rows[j][0], rows[j][1], '은/는')} 크기가 같은 분수이다.`,
              facts: { choose: { exprs: rows.map(([k, n]) => `${k}/${n}`), rule: 'same', pairsShown: PAIRS3 } }
            });
          }),
          T('same-line-fill', '수직선을 보고 크기가 같은 분수 쓰기', '①5 ③2', (d) => {
            const [a, b] = reduced(d, 2, 5), k = d.until(() => d.int(2, 4), (v) => b * v <= 12);
            return N('길이가 같은 두 수직선에서 화살표가 가리키는 곳이 같다. □ 안에 알맞은 수는?', a * k, {
              figure: twinLines([[b, a], [b * k, a * k]]) + eq(frac(a, b), '=', frac(box(), b * k)),
              explain: `아래 수직선의 화살표는 0에서 ${a * k}칸 간 곳이다. ${frac(a, b)} = ${frac(a * k, b * k)}`,
              facts: { calc: [[`${a}*${b * k}/${b}`, 0]] }
            });
          }),
          T('same-word-pieces', '같은 양이 되는 조각 수 구하기', '①7 ②5 ③18 심9', (d) => {
            const [a, b] = reduced(d, 3, 6), k = d.int(2, 3), [p, q] = d.shuffle(NAMES).slice(0, 2), food = d.pick(['피자', '케이크', '시루떡']);
            return N(`크기가 같은 ${food} 두 개를 ${name(p, '은/는')} 똑같이 ${b}조각으로, ${name(q, '은/는')} 똑같이 ${b * k}조각으로 나누었다. ${name(p, '이/가')} ${a}조각을 먹었을 때, ${name(q, '이/가')} 같은 양을 먹으려면 몇 조각을 먹어야 하는가?`, a * k, {
              unit: '조각', explain: `${name(p, '이/가')} 먹은 양은 전체의 ${frac(a, b)}이다. ${frac(a, b)} = ${frac(a * k, b * k)}이므로 ${b * k}조각 중 ${a * k}조각을 먹어야 한다.`,
              facts: { calc: [[`${a}*${b * k}/${b}`, 0]] }
            });
          }),
          T('same-word-cut', '같은 양이 되게 나눈 조각 수 구하기', '심10', (d) => {
            const [x, t, k] = d.until(() => [d.int(4, 12), d.int(2, 9), d.int(2, 4)], ([p, q, r]) => q < p - 1 && p * r <= 36);
            return N(`크기가 같은 떡 두 개가 있다. 한 개는 똑같이 ${x * k}조각으로 나누어 ${t * k}조각을 먹었다. 다른 한 개는 똑같이 나누어 ${t}조각을 먹었더니 먹은 양이 같았다. 다른 한 개는 몇 조각으로 나누었는가?`, x, {
              unit: '조각', explain: `처음 떡은 전체의 ${frac(t * k, x * k)}만큼 먹었다. 분자가 ${t}${tail(t, '이/가')} 되려면 분모와 분자를 각각 ${josa(k, '으로/로')} 나눈다. ${frac(t * k, x * k)} = ${frac(t, x)}이므로 ${x}조각으로 나누었다.`,
              facts: { calc: [[`${x * k}*${t}/${t * k}`, 0]] }
            });
          }),
          T('same-word-cups', '같은 양이 담긴 컵 찾기', '①6 심6', (d) => {
            // 양이 같은 두 컵의 분수는 약분해야 같은 것이 보인다. 나머지 두 컵은 크기가 비슷하지만 다르다.
            const made = d.until(() => {
              const [a, b] = reduced(d, 2, 5), [k, m] = d.pick([[2, 3], [2, 3], [1, 2], [1, 3], [3, 4]]);
              const other = () => { const den = d.int(3, 12); return [d.int(1, den - 1), den]; };
              return [[a * k, b * k], [a * m, b * m], other(), other()];
            }, (list) => list[1][1] <= 20 && PAIRS4.filter(([i, j]) => same(list[i], list[j])).length === 1 && new Set(list.map((r) => r.join('/'))).size === 4);
            const list = d.shuffle(made), right = PAIRS4.find(([i, j]) => same(list[i], list[j]));
            const shown = d.shuffle(d.shuffle(PAIRS4.filter((p) => p !== right)).slice(0, 3).concat([right])), [i, j] = right;
            const g1 = gcd(list[i][0], list[i][1]);
            return C('모양과 크기가 같은 컵 가, 나, 다, 라에 주스가 각각 컵의 다음만큼 들어 있다. 주스의 양이 같은 두 컵은?', shown.map(([p, q]) => `${KA[p]}, ${KA[q]}`), shown.indexOf(right), {
              figure: numbers(list.map((row, r) => `${KA[r]} ${frac(...row)}`)),
              explain: `${fj(list[i][0], list[i][1], '과/와')} ${fj(list[j][0], list[j][1], '을/를')} 기약분수로 나타내면 모두 ${frac(list[i][0] / g1, list[i][1] / g1)}이다. 따라서 ${KA[i]}와 ${KA[j]}에 든 주스의 양이 같다.`,
              facts: { choose: { exprs: list.map(([k, n]) => `${k}/${n}`), rule: 'same', pairsShown: shown } }
            });
          })
        ]
      },
      {
        id: 'make', title: '크기가 같은 분수 만들기', standard: EQ,
        types: [
          T('make-rule-word', '크기가 같은 분수를 만드는 방법', '①8 ②10 ③16 심19', (d) => {
            const right = d.pick(['분모와 분자에 각각 0이 아닌 같은 수를 곱한다.', '분모와 분자를 각각 0이 아닌 같은 수로 나눈다.']);
            const rows = d.shuffle([[right, true], ['분모와 분자에 각각 같은 수를 더한다.', false], ['분모와 분자에서 각각 같은 수를 뺀다.', false], ['분모와 분자에 각각 0을 곱한다.', false]]);
            return C('크기가 같은 분수를 만드는 방법으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: '분모와 분자에 각각 0이 아닌 같은 수를 곱하거나, 분모와 분자를 각각 0이 아닌 같은 수로 나누면 크기가 같은 분수가 된다. 같은 수를 더하거나 빼면 크기가 달라진다.',
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('make-mul-steps', '분모와 분자에 같은 수를 곱하는 과정', '①9 ②6 ③6 심3', (d) => {
            const [a, b] = reduced(d, 3, 9), k = d.int(2, 6);
            return M('크기가 같은 분수를 만드는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([k, a * k, b * k]), {
              figure: eq(frac(a, b), '=', frac(`${a} × ${box(LAB[0])}`, `${b} × ${k}`), '=', blankFrac(1, 2)),
              explain: `분모에 ${josa(k, '을/를')} 곱했으므로 분자에도 ${josa(k, '을/를')} 곱한다. ${a} × ${k} = ${a * k}, ${b} × ${k} = ${b * k}이므로 ${frac(a * k, b * k)}이다.`,
              facts: { calc: [[String(k), 0], [`${a}*${k}`, 1], [`${b}*${k}`, 2]] }
            });
          }),
          T('make-div-steps', '분모와 분자를 같은 수로 나누는 과정', '①10 ②7 ③7 심3', (d) => {
            const [a, b] = reduced(d, 3, 9), k = d.int(2, 8), A = a * k, Bk = b * k;
            return M('크기가 같은 분수를 만드는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([k, a, b]), {
              figure: eq(frac(A, Bk), '=', frac(`${A} ÷ ${box(LAB[0])}`, `${Bk} ÷ ${k}`), '=', blankFrac(1, 2)),
              explain: `분모를 ${josa(k, '으로/로')} 나누었으므로 분자도 ${josa(k, '으로/로')} 나눈다. ${A} ÷ ${k} = ${a}, ${Bk} ÷ ${k} = ${b}이므로 ${frac(a, b)}이다.`,
              facts: { calc: [[String(k), 0], [`${A}/${k}`, 1], [`${Bk}/${k}`, 2]] }
            });
          }),
          T('make-fill-up', '곱하여 만든 크기가 같은 분수의 빈칸', '①11 ②8 ③8·11 심3·7', (d, n) => {
            // 첫째 문항은 분자가, 둘째 문항은 분모가 빈칸이다(분모가 빈칸이면 분자에서 몇 배인지 찾는다).
            const [a, b] = reduced(d, 3, 15, (x) => n === 0 || x >= 2), k = d.int(2, 7);
            return N('□ 안에 알맞은 수는?', n === 0 ? a * k : b * k, {
              figure: n === 0 ? eq(frac(a, b), '=', frac(box(), b * k)) : eq(frac(a, b), '=', frac(a * k, box())),
              explain: n === 0 ? `분모가 ${b}에서 ${b * k}${tail(b * k, '으로/로')} ${k}배가 되었으므로 분자에도 ${josa(k, '을/를')} 곱한다. ${a} × ${k} = ${a * k}`
                : `분자가 ${a}에서 ${a * k}${tail(a * k, '으로/로')} ${k}배가 되었으므로 분모에도 ${josa(k, '을/를')} 곱한다. ${b} × ${k} = ${b * k}`,
              facts: { calc: [[n === 0 ? `${a}*${b * k}/${b}` : `${b}*${a * k}/${a}`, 0]], rule: n === 0 ? 'fillUpTop' : 'fillUpBottom' }
            });
          }, { count: 2 }),
          T('make-fill-down', '나누어 만든 크기가 같은 분수의 빈칸', '①11 ②8 ③8·11·25 심3·7', (d, n) => {
            const [a, b] = reduced(d, 3, 12, (x) => n === 0 || x >= 2), k = d.int(2, 8), A = a * k, Bk = b * k;
            return N('□ 안에 알맞은 수는?', n === 0 ? a : b, {
              figure: n === 0 ? eq(frac(A, Bk), '=', frac(box(), b)) : eq(frac(A, Bk), '=', frac(a, box())),
              explain: n === 0 ? `분모 ${josa(Bk, '을/를')} ${josa(k, '으로/로')} 나누어 ${josa(b, '이/가')} 되었으므로 분자도 ${josa(k, '으로/로')} 나눈다. ${A} ÷ ${k} = ${a}`
                : `분자 ${josa(A, '을/를')} ${josa(k, '으로/로')} 나누어 ${josa(a, '이/가')} 되었으므로 분모도 ${josa(k, '으로/로')} 나눈다. ${Bk} ÷ ${k} = ${b}`,
              facts: { calc: [[n === 0 ? `${A}*${b}/${Bk}` : `${Bk}*${a}/${A}`, 0]], rule: n === 0 ? 'fillDownTop' : 'fillDownBottom' }
            });
          }, { count: 2 }),
          T('make-chain-up', '이어진 등식의 빈칸(곱)', '①12 ②8 ③8 심3', (d) => {
            const [a, b] = reduced(d, 3, 9), ks = d.shuffle([2, 3, 4, 5, 6]).slice(0, 3).sort((x, y) => x - y);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([a * ks[0], b * ks[1], a * ks[2]]), {
              figure: eq(frac(a, b), '=', frac(box(LAB[0]), b * ks[0]), '=', frac(a * ks[1], box(LAB[1])), '=', frac(box(LAB[2]), b * ks[2])),
              explain: `분모와 분자에 각각 ${ks.join(', ')}${tail(ks[2], '을/를')} 곱한 것이다. ${frac(a, b)} = ${frac(a * ks[0], b * ks[0])} = ${frac(a * ks[1], b * ks[1])} = ${frac(a * ks[2], b * ks[2])}`,
              facts: { calc: [[`${a}*${b * ks[0]}/${b}`, 0], [`${b}*${a * ks[1]}/${a}`, 1], [`${a}*${b * ks[2]}/${b}`, 2]] }
            });
          }),
          T('make-chain-down', '이어진 등식의 빈칸(나눔)', '①13 ②8 ③8·25 심3', (d) => {
            const [a, b] = reduced(d, 3, 7), ks = d.pick([[8, 4, 2, 1], [12, 6, 3, 1], [12, 6, 2, 1], [12, 4, 2, 1], [18, 9, 3, 1], [18, 6, 3, 1], [18, 6, 2, 1]]);
            const top = (i) => a * ks[i], bot = (i) => b * ks[i];
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([bot(1), bot(2), bot(3)]), {
              figure: eq(frac(top(0), bot(0)), '=', frac(top(1), box(LAB[0])), '=', frac(top(2), box(LAB[1])), '=', frac(top(3), box(LAB[2]))),
              explain: `분자가 줄어든 만큼 분모도 같은 수로 나눈다. ${frac(top(0), bot(0))} = ${frac(top(1), bot(1))} = ${frac(top(2), bot(2))} = ${frac(top(3), bot(3))}`,
              facts: { calc: [1, 2, 3].map((i) => [`${bot(0)}*${top(i)}/${top(0)}`, i - 1]) }
            });
          }),
          T('make-chain-back', '기약분수에서 거슬러 올라가는 등식의 빈칸', '①13', (d) => {
            const [a, b] = reduced(d, 3, 7), ks = d.pick([[6, 3, 2], [8, 4, 2], [9, 6, 3], [6, 4, 2], [8, 6, 4], [10, 5, 2], [9, 3, 2]]);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', labelled([a * ks[0], b * ks[1], a * ks[2]]), {
              figure: eq(frac(box(LAB[0]), b * ks[0]), '=', frac(a * ks[1], box(LAB[1])), '=', frac(box(LAB[2]), b * ks[2]), '=', frac(a, b)),
              explain: `${frac(a, b)}의 분모와 분자에 같은 수를 곱한 분수들이다. ${frac(a * ks[0], b * ks[0])} = ${frac(a * ks[1], b * ks[1])} = ${frac(a * ks[2], b * ks[2])} = ${frac(a, b)}`,
              facts: { calc: [[`${a}*${b * ks[0]}/${b}`, 0], [`${b}*${a * ks[1]}/${a}`, 1], [`${a}*${b * ks[2]}/${b}`, 2]] }
            });
          }),
          T('make-chain-both', '한쪽은 나누고 한쪽은 곱하는 등식의 빈칸', '②8 심3·4', (d) => {
            const [a, b] = reduced(d, 3, 9), g = d.int(3, 8), m = d.pick([2, 3]);
            return M('㉠, ㉡에 알맞은 수는?', labelled([b, a * g * m]), {
              figure: eq(frac(a, box(LAB[0])), '=', frac(a * g, b * g), '=', frac(box(LAB[1]), b * g * m)),
              explain: `${frac(a * g, b * g)}의 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(a, b)}이고, 분모와 분자에 각각 ${josa(m, '을/를')} 곱하면 ${frac(a * g * m, b * g * m)}이다.`,
              facts: { calc: [[`${a}*${b * g}/${a * g}`, 0], [`${a * g}*${b * g * m}/${b * g}`, 1]] }
            });
          }),
          T('make-nth', '크기가 같은 분수를 분모가 작은 것부터 쓰기', '①14 ②9 ③9 심11', (d) => {
            const [a, b] = reduced(d, 3, 9), nth = d.pick([3, 4]), word = nth === 3 ? '셋째' : '넷째', k = nth + 1;
            return M(`${fj(a, b, '과/와')} 크기가 같은 분수 가운데 분모가 ${b}보다 큰 분수를 분모가 작은 것부터 차례대로 쓸 때, ㉠, ㉡에 알맞은 수는?`, labelled([a * k, b * k]), {
              figure: lines([`${word} 분수: ${ex(blankFrac(0, 1))}`]),
              explain: `${frac(a, b)}의 분모와 분자에 2, 3, 4, …를 차례대로 곱한다. ${word} 분수는 ${josa(k, '을/를')} 곱한 ${frac(a * k, b * k)}이다.`,
              facts: { calc: [[`${a}*${k}`, 0], [`${b}*${k}`, 1]], unseen: [k] }
            });
          }),
          T('make-from-reduced', '기약분수가 아닌 분수와 크기가 같은 분수를 차례대로 쓰기', '①15 ③10', (d) => {
            const [a, b] = reduced(d, 3, 8), g = d.int(4, 9), A = a * g, Bg = b * g, nth = d.pick([2, 3]), word = nth === 2 ? '둘째' : '셋째';
            return M(`${fj(A, Bg, '과/와')} 크기가 같은 분수를 분모가 작은 것부터 차례대로 쓸 때, ㉠, ㉡에 알맞은 수는?`, labelled([a * nth, b * nth]), {
              figure: lines([`${word} 분수: ${ex(blankFrac(0, 1))}`]),
              explain: `분모가 가장 작은 분수는 ${fj(A, Bg, '을/를')} 기약분수로 나타낸 ${frac(a, b)}이다. ${word} 분수는 ${frac(a, b)}의 분모와 분자에 각각 ${josa(nth, '을/를')} 곱한 ${frac(a * nth, b * nth)}이다.`,
              facts: { calc: [[`${A}/${g}*${nth}`, 0], [`${Bg}/${g}*${nth}`, 1]], unseen: [g, nth] }
            });
          }),
          T('make-pick-same', '크기가 같은 분수 고르기', '①16 ②11 ③13 심5', (d) => {
            // 틀린 보기: 분모와 분자에 같은 수를 더한 것, 같은 수를 뺀 것, 분모와 분자를 서로 다른 수로 나눈 것
            const [a, b] = reduced(d, 3, 9, (x) => x >= 2), g = d.pick([4, 6, 8]), A = a * g, Bg = b * g, k = d.int(2, 4);
            const right = d.pick([[a, b], [A / 2, Bg / 2], [A * 2, Bg * 2], [a * 3, b * 3]]);
            const rows = d.shuffle([right, [A + k, Bg + k], [A - k, Bg - k], [a, Bg / 2]]);
            return C(`${fj(A, Bg, '과/와')} 크기가 같은 분수는?`, rows.map((row) => frac(...row)), rows.indexOf(right), {
              explain: `${fj(A, Bg, '을/를')} 기약분수로 나타내면 ${frac(a, b)}이다. ` + (right[0] === a ? '나머지는' : `${frac(right[0], right[1])}도 기약분수로 나타내면 ${frac(a, b)}이고, 나머지는`) + ' 분모와 분자에 같은 수를 더하거나 빼거나, 서로 다른 수로 나눈 것이다.',
              facts: { choose: { exprs: rows.map(([x, y]) => `${x}/${y}`), rule: 'equals', target: A / Bg } }
            });
          }),
          T('make-pick-odd', '크기가 나머지와 다른 분수 찾기', '①17 ②12 ③14 심5·26', (d) => {
            // 다른 하나: 분모와 분자에 1씩 더한 분수를 몇 배 한 것(같은 수를 더해도 크기가 같다고 여기면 가려내지 못한다)
            const [a, b] = reduced(d, 3, 9, (x) => x >= 2), ks = d.shuffle([1, 2, 3, 4, 5]).slice(0, 3), ko = d.int(2, 5), odd = [(a + 1) * ko, (b + 1) * ko];
            const rows = d.shuffle(ks.map((k) => [a * k, b * k]).concat([odd])), g = gcd(odd[0], odd[1]);
            return C('크기가 나머지와 다른 분수는?', rows.map((row) => frac(...row)), rows.indexOf(odd), {
              explain: `${fj(odd[0], odd[1], '을/를')} 기약분수로 나타내면 ${frac(odd[0] / g, odd[1] / g)}이고, 나머지는 모두 ${frac(a, b)}이다.`,
              facts: { choose: { exprs: rows.map(([x, y]) => `${x}/${y}`), rule: 'odd' } }
            });
          }),
          T('make-pair-pick', '크기가 같은 분수끼리 짝 지은 것 고르기', '①18 ②11·13 ③15 심5', (d) => {
            // 틀린 짝: 분자만 1 다른 것, 분모와 분자를 서로 다른 수로 나눈 것, 분모와 분자에 같은 수를 더한 것
            const base = () => reduced(d, 3, 9, (x) => x >= 2);
            const [a, b] = base(), k = d.int(3, 7), [c, e] = base(), m = d.int(3, 6), [p, q] = base(), g = d.pick([4, 6]), [r, s] = base(), t = d.int(2, 5);
            const right = [a, b, a * k, b * k];
            const rows = d.shuffle([right, [c, e, c * m + d.pick([-1, 1]), e * m], [p * g, q * g, p, q * g / 2], [r, s, r + t, s + t]]);
            return C('크기가 같은 분수끼리 짝 지은 것은?', rows.map(([x, y, u, v]) => duo(frac(x, y), frac(u, v))), rows.indexOf(right), {
              explain: `${frac(a, b)}의 분모와 분자에 각각 ${josa(k, '을/를')} 곱하면 ${frac(a * k, b * k)}이다. 나머지는 분모와 분자에 같은 수를 곱하거나 같은 수로 나눈 것이 아니다.`,
              facts: { claimed: rows.map(([x, y, u, v]) => [`${x}*${v}`, y * u]), claimedWant: true }
            });
          }),
          T('make-given-part', '분자가 정해진 크기가 같은 분수', '①19·38 ②14 ③11·34 심7', (d) => {
            const [a, b] = reduced(d, 4, 13, (x) => x >= 2), g = d.int(4, 9), A = a * g, Bg = b * g;
            return N(`${fj(A, Bg, '과/와')} 크기가 같은 분수 가운데 분자가 ${a}인 분수의 분모는?`, b, {
              explain: `분자 ${josa(A, '을/를')} ${josa(g, '으로/로')} 나누면 ${a}이다. 분모도 ${josa(g, '으로/로')} 나누면 ${Bg} ÷ ${g} = ${b}이다.`,
              facts: { calc: [[`${Bg}*${a}/${A}`, 0]] }
            });
          }),
          T('make-via-reduce', '약분한 다음 곱하여 만드는 크기가 같은 분수', '②14 심7', (d) => {
            const [a, b] = reduced(d, 3, 9), [g1, g2] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x % y !== 0 && y % x !== 0), A = a * g1, Bg = b * g1;
            return N(`${fj(A, Bg, '과/와')} 크기가 같은 분수 가운데 분모가 ${b * g2}인 분수의 분자는?`, a * g2, {
              explain: `${fj(A, Bg, '을/를')} 기약분수로 나타내면 ${frac(a, b)}이다. 분모가 ${b * g2}${tail(b * g2, '이/가')} 되도록 분모와 분자에 각각 ${josa(g2, '을/를')} 곱하면 ${frac(a * g2, b * g2)}이다.`,
              facts: { calc: [[`${A}*${b * g2}/${Bg}`, 0]] }
            });
          }),
          T('make-range-one', '분모의 범위가 정해진 크기가 같은 분수', '①19 ②15 ③12 심11', (d) => {
            const [a, b, k, lo] = d.until(() => { const [x, y] = reduced(d, 6, 13), kk = d.int(2, 7); return [x, y, kk, Math.floor((y * kk - 1) / 10) * 10]; },
              ([, y, kk, low]) => { let n = 0; for (let v = low + 1; v < low + 10; v += 1) if (v % y === 0) n += 1; return n === 1 && low >= 10 && y * kk > low && y * kk < low + 10; });
            return M(`${fj(a, b, '과/와')} 크기가 같은 분수 가운데 분모가 ${lo}보다 크고 ${lo + 10}보다 작은 분수를 구하려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([a * k, b * k]), {
              figure: ex(blankFrac(0, 1)),
              explain: `분모는 ${b}의 배수이다. ${lo}보다 크고 ${lo + 10}보다 작은 ${b}의 배수는 ${b * k}뿐이므로 분모와 분자에 각각 ${josa(k, '을/를')} 곱한 ${frac(a * k, b * k)}이다.`,
              facts: { calc: [[`${a}*${k}`, 0], [`${b}*${k}`, 1]], unseen: [k] }
            });
          }),
          T('make-range-count', '범위에 드는 크기가 같은 분수의 수', '②15 ③12 심11', (d, n) => {
            // 첫째 문항은 분모의 범위, 둘째 문항은 분자의 범위가 정해져 있다.
            const [a, b, lo, hi, count] = d.until(() => {
              const [x, y] = reduced(d, n === 0 ? 3 : 5, 9, (p) => n === 0 || p >= 2), low = d.pick([10, 20, 30]), high = low + d.pick([20, 30]), step = n === 0 ? y : x;
              let c = 0; for (let v = low + 1; v < high; v += 1) if (v % step === 0) c += 1;
              return [x, y, low, high, c];
            }, (made) => made[4] >= 2 && made[4] <= 5);
            const step = n === 0 ? b : a, list = []; for (let v = lo + 1; v < hi; v += 1) if (v % step === 0) list.push(v);
            return N(`${fj(a, b, '과/와')} 크기가 같은 분수 가운데 ${n === 0 ? '분모' : '분자'}가 ${lo}보다 크고 ${hi}보다 작은 분수는 모두 몇 개인가?`, count, {
              unit: '개', explain: `${n === 0 ? '분모' : '분자'}는 ${step}의 배수이다. ${lo}보다 크고 ${hi}보다 작은 ${step}의 배수는 ${list.join(', ')}${tail(list[list.length - 1], '으로/로')} ${count}개이다.`,
              facts: { digit: { template: `${lo}<□*${step}<${hi}`, lo: 1, hi: 30, ask: 'count' } }
            });
          }, { count: 2 }),
          T('make-same-method', '다른 방법으로 크기가 같은 분수를 만든 사람 찾기', '①20 ③16 심19', (d) => {
            const who = d.shuffle(NAMES).slice(0, 3), oddKind = d.pick(['mul', 'div']), kinds = d.shuffle(oddKind === 'mul' ? ['mul', 'div', 'div'] : ['div', 'mul', 'mul']);
            const rows = kinds.map((kind) => { const [a, b] = reduced(d, 3, 9), k = d.int(2, 5), j = d.int(1, 2); return kind === 'mul' ? [[a * j, b * j], [a * j * k, b * j * k]] : [[a * j * k, b * j * k], [a * j, b * j]]; });
            const hit = kinds.indexOf(oddKind);
            return C('세 사람이 크기가 같은 분수를 만들었다. 나머지 두 사람과 다른 방법으로 만든 사람은?', who, hit, {
              figure: tagged(rows.map(([from, to]) => `${frac(...from)} → ${frac(...to)}`), who),
              explain: `${name(who[hit], '은/는')} 분모와 분자${oddKind === 'mul' ? '에 같은 수를 곱하였고' : '를 같은 수로 나누었고'}, 나머지 두 사람은 분모와 분자${oddKind === 'mul' ? '를 같은 수로 나누었다' : '에 같은 수를 곱하였다'}.`,
              facts: { truth: kinds.map((kind) => kind === oddKind), want: true }
            });
          }),
          T('make-right-expr', '크기가 같은 분수를 바르게 만든 식 고르기', '②10 ③16 ①8·21 심19', (d) => {
            // 틀린 식: 같은 수를 더한 것, 같은 수를 뺀 것, 0을 곱한 것(또는 분모와 분자를 서로 다른 수로 나눈 것)
            const [a, b] = reduced(d, 3, 9, (x) => x >= 2), g = d.int(2, 5), A = a * g, Bg = b * g, k = d.int(2, 4), mul = d.bool();
            const made = (sym, x, y) => ex(`${frac(A, Bg)} <i>=</i> ${frac(`${A} ${sym} ${x}`, `${Bg} ${sym} ${y}`)}`);
            const last = b !== g && d.bool() ? made('÷', g, b) : made('×', 0, 0);
            const rows = d.shuffle([[mul ? made('×', k, k) : made('÷', g, g), true], [made('+', k, k), false], [made('−', k, k), false], [last, false]]);
            return C('크기가 같은 분수를 바르게 만든 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: '분모와 분자에 각각 0이 아닌 같은 수를 곱하거나, 분모와 분자를 각각 0이 아닌 같은 수로 나누어야 크기가 같은 분수가 된다.',
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('make-talk', '크기가 같은 분수에 대한 설명 가려내기', '①21 ②10', (d) => {
            const [a, b] = reduced(d, 3, 7), k = d.int(2, 5), [c, e] = reduced(d, 3, 7), [p, q] = reduced(d, 3, 7), g = d.int(3, 6), t = d.int(2, 4), [r, s] = reduced(d, 3, 8);
            const rows = d.shuffle([
              [`${fj(a, b, '과/와')} ${fj(a * k, b * k, '은/는')} 크기가 같은 분수이다.`, true],
              [`${fj(c * 2, e * 2, '과/와')} 크기가 같은 분수는 ${frac(c, e)} 하나뿐이다.`, false],
              [`${frac(p * g, q * g)}의 분모와 분자에 같은 자연수를 곱하여 ${fj(p, q, '을/를')} 만들 수 있다.`, false],
              [`${frac(r, s)}의 분모와 분자에 ${t}씩 더한 ${fj(r + t, s + t, '은/는')} ${fj(r, s, '과/와')} 크기가 같다.`, false]
            ]);
            return C('크기가 같은 분수에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: `${frac(a, b)}의 분모와 분자에 각각 ${josa(k, '을/를')} 곱하면 ${frac(a * k, b * k)}이다. 크기가 같은 분수는 셀 수 없이 많고, 약분하려면 분모와 분자를 나누어야 하며, 같은 수를 더하면 크기가 달라진다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('make-cards', '수 카드로 크기가 같은 분수 만들기', '②17 ③17 심68', (d) => {
            // 카드 넷 가운데 두 장으로 만들 수 있는 크기가 같은 분수는 하나뿐이다(모든 짝을 따져 뽑는다).
            const { a, b, m, k, list } = d.until(() => {
              const [x, y] = reduced(d, 3, 9, (v) => v >= 2), mm = d.int(2, 6), kk = d.until(() => d.int(1, 5), (v) => v !== mm);
              return { a: x, b: y, m: mm, k: kk, list: [x * kk, y * kk, d.int(2, 40), d.int(2, 40)] };
            }, (made) => new Set(made.list).size === 4 && made.list.every((v) => v !== made.a * made.m && v !== made.b * made.m)
              && made.list.reduce((hits, x) => hits + made.list.filter((y) => y !== x && x * made.b === y * made.a).length, 0) === 1);
            return M(`수 카드 4장 가운데 2장을 골라 ${fj(a * m, b * m, '과/와')} 크기가 같은 분수를 만들려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([a * k, b * k]), {
              figure: cards(list.slice().sort((x, y) => x - y)) + ex(blankFrac(0, 1)),
              explain: `${fj(a * m, b * m, '을/를')} 기약분수로 나타내면 ${frac(a, b)}이다. ` + (k === 1 ? `수 카드에 ${josa(a, '과/와')} ${josa(b, '이/가')} 있다.` : `분모와 분자에 각각 ${josa(k, '을/를')} 곱한 ${frac(a * k, b * k)}의 ${josa(a * k, '과/와')} ${josa(b * k, '이/가')} 수 카드에 있다.`),
              facts: { calc: [[`${a * m}/${m}*${k}`, 0], [`${b * m}/${m}*${k}`, 1]], unseen: [m, k] }
            });
          })
        ]
      },
      { id: 'reduce', title: '약분과 기약분수', standard: EQ, types: [] },
      { id: 'common', title: '통분과 공통분모', standard: EQ, types: [] },
      { id: 'comp', title: '분모가 다른 분수의 크기 비교', standard: CMP, types: [] },
      { id: 'deci', title: '분수와 소수의 크기 비교', standard: DEC, types: [] }
    ]
  });

  // ── 약분과 기약분수 ──
  B.addTypes('5-1-4', 'reduce', [
    T('reduce-word', '약분과 기약분수의 뜻', '①25 ③21 심19', (d, n) => {
      const rows = d.shuffle(n === 0 ? [['약분', true], ['통분', false], ['공통분모', false], ['기약분수', false]] : [['기약분수', true], ['단위분수', false], ['진분수', false], ['공통분모', false]]);
      return C(n === 0 ? '분모와 분자를 공약수로 나누어 간단한 분수로 만드는 것을 무엇이라고 하는가?' : '분모와 분자의 공약수가 1뿐인 분수를 무엇이라고 하는가?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: n === 0 ? '분모와 분자를 공약수로 나누어 간단한 분수로 만드는 것을 약분한다고 한다.' : '분모와 분자의 공약수가 1뿐이어서 더 약분할 수 없는 분수를 기약분수라고 한다.',
        facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }, { count: 2 }),
    T('reduce-steps-each', '공약수로 약분하는 과정', '①26 ②22 ③22·24 심20', (d) => {
      const g = d.pick([6, 10, 14, 15]), [p, q] = primesOf(g), [a, b] = reduced(d, 2, 7), A = a * g, Bg = b * g;
      return M(`${fj(A, Bg, '을/를')} 약분하려고 한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled([A / p, Bg / q, a, b]), {
        figure: lines([`${josa(A, '과/와')} ${Bg}의 공약수: 1, ${p}, ${q}, ${g}`,
          eq(frac(`${A} ÷ ${p}`, `${Bg} ÷ ${p}`), '=', frac(box(LAB[0]), Bg / p)),
          eq(frac(`${A} ÷ ${q}`, `${Bg} ÷ ${q}`), '=', frac(A / q, box(LAB[1]))),
          eq(frac(`${A} ÷ ${g}`, `${Bg} ÷ ${g}`), '=', blankFrac(2, 3))]),
        explain: `분모와 분자를 1이 아닌 공약수 ${p}, ${q}, ${g}${tail(g, '으로/로')} 각각 나눈다. ${frac(A / p, Bg / p)}, ${frac(A / q, Bg / q)}, ${frac(a, b)}`,
        facts: { calc: [[`${A}/${p}`, 0], [`${Bg}/${q}`, 1], [`${A}/${g}`, 2], [`${Bg}/${g}`, 3]] }
      });
    }),
    T('reduce-not-divisor', '약분할 때 나눌 수 없는 수 고르기', '①27 ②23 ③22·23 심22', (d) => {
      // 틀린 수: 분모와 분자 가운데 한쪽만 나누어떨어지는 수(없으면 어느 쪽도 나누어떨어지지 않는 수)
      const g = d.pick([6, 8, 10, 12, 18]), [a, b] = reduced(d, 2, 7), A = a * g, Bg = b * g;
      const goods = d.shuffle(divisors(g).filter((v) => v > 1)).slice(0, 3), all = []; for (let v = 2; v <= 20; v += 1) if (A % v !== 0 || Bg % v !== 0) all.push(v);
      const half = all.filter((v) => A % v === 0 || Bg % v === 0), bad = d.pick(half.length ? half : all), opts = goods.concat([bad]).sort((x, y) => x - y);
      return C(`${fj(A, Bg, '을/를')} 약분할 때, 분모와 분자를 나눌 수 없는 수는?`, opts.map(String), opts.indexOf(bad), {
        explain: `약분할 때에는 분모와 분자를 두 수의 공약수로 나눈다. ${josa(bad, '은/는')} ${josa(A, '과/와')} ${Bg}의 공약수가 아니다.`,
        facts: { claimed: opts.map((v) => [`${A}%${v}+${Bg}%${v}`, 0]), claimedWant: false }
      });
    }),
    T('reduce-count-forms', '약분하여 만들 수 있는 분수의 수', '①28 ②24 ③26 심20·21', (d) => {
      const g = d.pick([4, 6, 8, 9, 12, 16, 18, 20]), [a, b] = reduced(d, 2, 7), A = a * g, Bg = b * g, divs = divisors(g).filter((v) => v > 1);
      return N(`${fj(A, Bg, '을/를')} 약분하여 만들 수 있는 분수는 모두 몇 개인가?`, divs.length, {
        unit: '개', explain: `${josa(A, '과/와')} ${Bg}의 공약수 가운데 1이 아닌 수는 ${divs.join(', ')}${tail(divs[divs.length - 1], '으로/로')} ${divs.length}개이다. 공약수마다 약분한 분수가 하나씩 생긴다.`,
        facts: { digit: { template: `${A}%□+${Bg}%□<1`, lo: 2, hi: A, ask: 'count' } }
      });
    }),
    T('reduce-second', '약분한 분수 가운데 분모가 둘째로 작은 분수', '①28 심21', (d) => {
      const g = d.pick([4, 6, 8, 9, 10, 12, 15]), p = primesOf(g)[0], [a, b] = reduced(d, 2, 7), A = a * g, Bg = b * g;
      return M(`${fj(A, Bg, '을/를')} 약분하여 만들 수 있는 분수 가운데 분모가 둘째로 작은 분수를 구하려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([a * p, b * p]), {
        figure: ex(blankFrac(0, 1)),
        explain: `분모가 가장 작은 분수는 최대공약수 ${josa(g, '으로/로')} 나눈 ${frac(a, b)}이다. 둘째로 작은 분수는 그다음으로 큰 공약수 ${josa(g / p, '으로/로')} 나눈 ${frac(a * p, b * p)}이다.`,
        facts: { calc: [[`${A}/${g / p}`, 0], [`${Bg}/${g / p}`, 1]], unseen: [g / p] }
      });
    }),
    T('reduce-pick-form', '약분한 분수가 아닌 것 고르기', '①29 ②25 ③26 심20', (d) => {
      // 틀린 보기: 분모와 분자를 서로 다른 수로 나눈 것
      const g = d.pick([6, 8, 12]), [a, b] = reduced(d, 2, 7), A = a * g, Bg = b * g, divs = divisors(g).filter((v) => v > 1);
      const goods = d.shuffle(divs).slice(0, 3).map((v) => [A / v, Bg / v]), [p, q] = d.shuffle(divs).slice(0, 2).sort((x, y) => x - y), bad = [A / q, Bg / p];
      const rows = d.shuffle(goods.concat([bad]));
      return C(`${fj(A, Bg, '을/를')} 약분한 분수가 아닌 것은?`, rows.map((row) => frac(...row)), rows.indexOf(bad), {
        explain: `${fj(bad[0], bad[1], '은/는')} 분자를 ${josa(q, '으로/로')}, 분모를 ${josa(p, '으로/로')} 나눈 것이다. 분모와 분자를 같은 수로 나누어야 한다.`,
        facts: { claimed: rows.map(([x, y]) => [`${x}*${Bg}`, y * A]), claimedWant: false }
      });
    }),
    T('reduce-find-divisor', '약분한 결과를 보고 나눈 수 구하기', '②26 ③30', (d) => {
      const g = d.pick([4, 6, 8, 9, 12]), k = d.pick(divisors(g).filter((v) => v > 1)), [a, b] = reduced(d, 3, 9, (x) => x >= 2), A = a * g, Bg = b * g;
      return N(`${frac(A, Bg)}의 분모와 분자를 어떤 수로 나누어 약분하였더니 ${fj(A / k, Bg / k, '이/가')} 되었다. 어떤 수는?`, k, {
        explain: `분자 ${josa(A, '이/가')} ${josa(A / k, '이/가')} 되었다. ${A} ÷ ${A / k} = ${k}이므로 분모와 분자를 각각 ${josa(k, '으로/로')} 나눈 것이다.`,
        facts: { calc: [[`${A}/${A / k}`, 0]] }
      });
    }),
    T('reduce-by-gcd', '한 번에 기약분수로 나타낼 때 나누는 수', '①25·32 ②26 심23', (d) => {
      const g = d.pick([12, 14, 15, 16, 18, 20, 24, 25, 27]), [a, b] = reduced(d, 2, 6), A = a * g, Bg = b * g;
      return N(`${fj(A, Bg, '을/를')} 한 번만 약분하여 기약분수로 나타내려고 한다. 분모와 분자를 어떤 수로 나누어야 하는가?`, g, {
        explain: `분모와 분자를 두 수의 최대공약수로 나누면 한 번에 기약분수가 된다. ${josa(A, '과/와')} ${Bg}의 최대공약수는 ${g}이고, ${frac(A, Bg)} = ${frac(a, b)}이다.`,
        facts: { digit: { template: `${A}%□+${Bg}%□<1`, lo: 1, hi: A, ask: 'max' } }
      });
    }),
    T('reduce-steps-gcd', '최대공약수로 나누어 기약분수로 나타내는 과정', '①30 ②27 ③29 심23', (d) => {
      const g = d.pick([4, 6, 7, 8, 9, 12]), [a, b] = reduced(d, 3, 9), A = a * g, Bg = b * g;
      return M('최대공약수로 약분하여 기약분수로 나타내려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([g, a, b]), {
        figure: lines([`${josa(A, '과/와')} ${Bg}의 최대공약수: ${box(LAB[0])}`, eq(frac(A, Bg), '=', frac(`${A} ÷ ${box(LAB[0])}`, `${Bg} ÷ ${box(LAB[0])}`), '=', blankFrac(1, 2))]),
        explain: `${josa(A, '과/와')} ${Bg}의 최대공약수는 ${g}이다. ${A} ÷ ${g} = ${a}, ${Bg} ÷ ${g} = ${b}이므로 ${frac(a, b)}이다.`,
        facts: { digit: { template: `${A}%□+${Bg}%□<1`, lo: 1, hi: A, ask: 'max' }, calc: [[`${A}/${g}`, 1], [`${Bg}/${g}`, 2]], unseen: [g] }
      });
    }),
    T('reduce-steps-twice', '두 번 약분하여 기약분수로 나타내는 과정', '①30', (d) => {
      const q = d.pick([2, 3, 5]), p = d.int(2, 6), [a, b] = reduced(d, 3, 7, (x) => x >= 2), A = a * p * q, Bg = b * p * q;
      return M('두 번 약분하여 기약분수로 나타내는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([q, a, b]), {
        figure: lines([eq(frac(A, Bg), '=', frac(`${A} ÷ ${p}`, `${Bg} ÷ ${p}`), '=', frac(a * q, b * q)), eq('=', frac(`${a * q} ÷ ${box(LAB[0])}`, `${b * q} ÷ ${box(LAB[0])}`), '=', blankFrac(1, 2))]),
        explain: `${josa(a * q, '과/와')} ${b * q}의 공약수 가운데 1이 아닌 수는 ${q}뿐이다. ${a * q} ÷ ${q} = ${a}, ${b * q} ÷ ${q} = ${b}이므로 ${frac(a, b)}이다.`,
        facts: { digit: { template: `${a * q}%□+${b * q}%□<1`, lo: 2, hi: a * q, ask: 'max' }, calc: [[`${a * q}/${q}`, 1], [`${b * q}/${q}`, 2]], unseen: [q] }
      });
    }),
    T('reduce-simplest', '기약분수로 나타내기', '①31 ②28 ③28 심24', (d, n) => {
      // 문항마다 구조가 다르다: 최대공약수가 한 자리 수, 두 자리 수, 분자가 분모의 약수(단위분수가 된다), 가분수, 대분수.
      const g = d.pick([[2, 3, 4, 5, 6, 7, 8, 9], [12, 15, 16, 18, 24], [7, 9, 11, 12, 13, 15, 17], [3, 4, 5, 6, 8, 9], [3, 4, 6, 7, 9, 13]][n]);
      const [x, y] = n === 2 ? [1, d.int(3, 8)] : reduced(d, 3, n === 0 ? 12 : 9, (v) => v >= 2), [a, b] = n === 3 ? [y, x] : [x, y], A = a * g, Bg = b * g;
      const why = `${josa(A, '과/와')} ${Bg}의 최대공약수는 ${g}이다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 `;
      if (n === 4) {
        const w = d.int(2, 9);
        return F(`대분수 ${mixed(w, A, Bg)}의 분수 부분을 약분하여 기약분수로 나타내면?`, a, b, { whole: w, explain: why + `${frac(a, b)}이므로 ${mixed(w, a, b)}이다.`, facts: { calc: [[String(w), 0], [`${A}/${g}`, 1], [`${Bg}/${g}`, 2]], unseen: [g] } });
      }
      return F(`${fj(A, Bg, '을/를')} 기약분수로 나타내면?`, a, b, {
        improper: n === 3, explain: why + `${frac(a, b)}이다.`,
        facts: { calc: [[`${A}/${g}`, 0], [`${Bg}/${g}`, 1]], unseen: [g], rule: ['simplestSmall', 'simplestBig', 'simplestUnit', 'simplestImproper'][n] }
      });
    }, { count: 5 }),
    T('reduce-pick-simplest', '기약분수 고르기', '①33 ②29 ③31 심25', (d) => {
      const right = reduced(d, 7, 20, (x) => x >= 2), others = d.until(() => [0, 0, 0].map(() => { const [x, y] = reduced(d, 3, 9), k = d.int(2, 5); return [x * k, y * k]; }), (list) => new Set(list.map(String)).size === 3);
      const rows = d.shuffle([right].concat(others));
      return C('기약분수인 것은?', rows.map((row) => frac(...row)), rows.indexOf(right), {
        explain: `${josa(right[0], '과/와')} ${right[1]}의 공약수는 1뿐이므로 ${fj(right[0], right[1], '은/는')} 기약분수이다. 나머지는 약분할 수 있다(` + others.map(([x, y]) => `${frac(x, y)} = ${frac(x / gcd(x, y), y / gcd(x, y))}`).join(', ') + ').',
        facts: { truth: rows.map(([x, y]) => gcd(x, y) === 1), want: true }
      });
    }),
    T('reduce-fix', '기약분수가 아닌 것을 찾아 기약분수로 나타내기', '①34 ②31 ③38 심25', (d) => {
      const keep = reduced(d, 12, 45, (x) => x >= 5), [a, b] = reduced(d, 5, 16, (x) => x >= 2), g = d.pick([2, 3, 4, 6]), A = a * g, Bg = b * g;
      return F('두 분수 가운데 기약분수가 아닌 것을 찾아 기약분수로 나타내면?', a, b, {
        figure: numbers(d.shuffle([frac(...keep), frac(A, Bg)])),
        explain: `${josa(A, '과/와')} ${Bg}의 최대공약수는 ${g}이므로 ${fj(A, Bg, '은/는')} 기약분수가 아니다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(a, b)}이다.`,
        facts: { calc: [[`${A}/${g}`, 0], [`${Bg}/${g}`, 1]], unseen: [g] }
      });
    }),
    T('reduce-wrong-fix', '잘못 약분한 것 바로잡기', '②30 ③37·38 심25·27', (d) => {
      // 분자는 a 로, 분모는 최대공약수 g 로 나눈 잘못된 약분
      const [a, b, g] = d.until(() => reduced(d, 5, 11, (x) => x >= 2).concat([d.int(3, 9)]), ([x, y, z]) => z !== x && z < y), A = a * g, Bg = b * g;
      return F('다음은 약분을 잘못한 것이다. 바르게 약분하여 기약분수로 나타내면?', a, b, {
        figure: eq(frac(A, Bg), '=', frac(`${A} ÷ ${a}`, `${Bg} ÷ ${g}`), '=', frac(g, b)),
        explain: `분모와 분자를 같은 수로 나누어야 한다. ${josa(A, '과/와')} ${Bg}의 최대공약수 ${josa(g, '으로/로')} 나누면 ${A} ÷ ${g} = ${a}, ${Bg} ÷ ${g} = ${b}이므로 ${frac(a, b)}이다.`,
        facts: { calc: [[`${A}/${g}`, 0], [`${Bg}/${g}`, 1]] }
      });
    }),
    T('reduce-pick-right', '바르게 약분한 것 고르기', '①35 ②30 심25', (d) => {
      // 틀린 보기: 약분한 분수의 분모가 1 다른 것, 분모와 분자에서 같은 수를 뺀 것, 분모와 분자를 서로 다른 수로 나눈 것
      const base = () => reduced(d, 3, 9, (x) => x >= 2);
      const [a, b] = base(), g = d.int(3, 9), [c, e] = base(), h = d.int(3, 8), [p, q] = base(), m = d.int(3, 7), [r, s] = base();
      const right = [a * g, b * g, a, b], rows = d.shuffle([right, [c * h, e * h, c, e + 1], [p * m, q * m, (p - 1) * m, (q - 1) * m], [r * 6, s * 6, r * 2, s * 3]]);
      return C('약분을 바르게 한 것은?', rows.map(([x, y, u, v]) => ex(`${frac(x, y)} <i>=</i> ${frac(u, v)}`)), rows.indexOf(right), {
        explain: `${frac(a * g, b * g)}의 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(a, b)}이다. 나머지는 분모와 분자를 같은 수로 나눈 것이 아니다.`,
        facts: { claimed: rows.map(([x, y, u, v]) => [`${x}*${v}`, y * u]), claimedWant: true }
      });
    }),
    T('reduce-talk', '약분과 기약분수에 대한 설명 가려내기', '①35 ②31 ③37 심21', (d) => {
      const [a, b] = reduced(d, 3, 9), g = d.int(4, 9), A = a * g, Bg = b * g, [c, e] = reduced(d, 3, 7), h = d.pick([4, 6, 8]);
      const rows = d.shuffle([
        [`${frac(A, Bg)}의 분모와 분자를 ${josa(A, '과/와')} ${Bg}의 최대공약수 ${josa(g, '으로/로')} 나누면 기약분수가 된다.`, true],
        ['기약분수는 분자가 1인 분수이다.', false],
        ['분수를 약분하면 분수의 크기가 작아진다.', false],
        [`${fj(c * h, e * h, '을/를')} 약분하여 만들 수 있는 분수는 ${frac(c * h / 2, e * h / 2)} 하나뿐이다.`, false]
      ]);
      return C('약분과 기약분수에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `기약분수는 분모와 분자의 공약수가 1뿐인 분수이고, 분자가 1이 아니어도 된다. 약분하여도 분수의 크기는 변하지 않는다. ${fj(c * h, e * h, '은/는')} 1이 아닌 공약수마다 약분할 수 있다.`,
        facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }),
    T('reduce-proper-count', '분모가 정해진 진분수 가운데 기약분수의 수', '①36 ②34 ③33 심28', (d) => {
      const den = d.pick([8, 9, 10, 12, 14, 15, 16, 18, 20]), tops = []; for (let v = 1; v < den; v += 1) if (gcd(v, den) === 1) tops.push(v);
      return N(`분모가 ${den}인 진분수 가운데 기약분수는 모두 몇 개인가?`, tops.length, {
        unit: '개', explain: `분자가 ${den}${tail(den, '과/와')} 공약수가 1뿐인 수이어야 한다. 분자는 ${tops.join(', ')}${tail(tops[tops.length - 1], '으로/로')} ${tops.length}개이다.`,
        facts: { digit: { template: `${coprimeTo(den)}>0`, lo: 1, hi: den - 1, ask: 'count' }, rule: 'properSmall' }
      });
    }),
    T('reduce-top-fixed', '분자가 정해진 진분수가 기약분수가 되는 분모', '심29 ②35', (d) => {
      const top = d.pick([4, 6, 8, 9]), hi = d.pick([12, 15]), list = []; for (let v = top + 1; v <= hi; v += 1) if (gcd(v, top) === 1) list.push(v);
      return N(`${fj(top, box(), '은/는')} 진분수이면서 기약분수이다. 1부터 ${hi}까지의 자연수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?`, list.length, {
        unit: '개', explain: `진분수이므로 □ 안의 수는 ${top}보다 크고, 기약분수이므로 ${top}${tail(top, '과/와')} 공약수가 1뿐이다. ${list.join(', ')}${tail(list[list.length - 1], '으로/로')} ${list.length}개이다.`,
        facts: { digit: { template: `(□-${top})*${coprimeTo(top)}>0`, lo: 1, hi, ask: 'count' } }
      });
    }),
    T('reduce-min-den', '기약분수로 나타내었을 때 분모가 가장 작은 것', '②32 ③14 심26', (d) => {
      // 처음 분모가 가장 작은 분수가 답이 되지 않게 고른다.
      const rows = d.until(() => d.shuffle([3, 4, 5, 6, 7, 8, 9]).slice(0, 4).map((b) => { const g = d.int(2, 6); return [coTop(d, b) * g, b * g, g]; }),
        (list) => { const small = list.map((r) => r[1] / r[2]), big = list.map((r) => r[1]); return small.indexOf(Math.min(...small)) !== big.indexOf(Math.min(...big)) && new Set(big).size === 4; });
      const dens = rows.map(([, y, g]) => y / g), hit = dens.indexOf(Math.min(...dens));
      return C('기약분수로 나타내었을 때 분모가 가장 작은 것은?', rows.map(([x, y]) => frac(x, y)), hit, {
        explain: rows.map(([x, y, g]) => `${frac(x, y)} = ${frac(x / g, y / g)}`).join(', ') + `이다. 분모가 가장 작은 것은 ${frac(rows[hit][0], rows[hit][1])}이다.`,
        facts: { choose: { exprs: rows.map(([, y, g]) => `${y}/${g}`), rule: 'min' }, unseen: rows.map((r) => r[2]) }
      });
    }),
    T('reduce-word-part', '전체의 얼마인지 기약분수로 나타내기', '①37 ②36 ③39 심32', (d, n) => {
      // 둘째 문항은 전체(하루 24시간)가 글에 수로 적혀 있지 않다.
      if (n === 1) {
        const who = d.pick(NAMES), h = d.pick([2, 3, 4, 6, 8, 9, 10]), g = gcd(h, 24);
        return F(`${name(who, '은/는')} 하루 가운데 ${h}시간 동안 잠을 잔다. 잠을 자는 시간은 하루의 얼마인지 기약분수로 나타내면?`, h / g, 24 / g, {
          explain: `하루는 24시간이므로 ${frac(h, 24)}이다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(h / g, 24 / g)}이다.`, facts: { partOf: { total: 24, group: g, part: h } }
        });
      }
      const [p, t] = reduced(d, 3, 12), g = d.int(3, 12), [thing, kind] = d.pick([['구슬', '빨간 구슬'], ['색종이', '노란 색종이'], ['사탕', '딸기 맛 사탕']]);
      return F(`${thing} ${t * g}개 가운데 ${p * g}개가 ${kind}이다. ${josa(kind, '은/는')} 전체의 얼마인지 기약분수로 나타내면?`, p, t, {
        explain: `전체 ${t * g}개 중의 ${p * g}개이므로 ${frac(p * g, t * g)}이다. 분모와 분자를 각각 최대공약수 ${josa(g, '으로/로')} 나누면 ${frac(p, t)}이다.`, facts: { partOf: { total: t * g, group: g, part: p * g } }
      });
    }, { count: 2 }),
    T('reduce-before-by', '약분하기 전의 분수', '①38 ②33 ③34 심35', (d) => {
      const [a, b] = reduced(d, 3, 11), k = d.int(3, 9);
      return M(`어떤 분수의 분모와 분자를 각각 ${josa(k, '으로/로')} 나누어 약분하였더니 ${fj(a, b, '이/가')} 되었다. 어떤 분수를 구할 때, ㉠, ㉡에 알맞은 수는?`, labelled([a * k, b * k]), {
        figure: ex(blankFrac(0, 1)),
        explain: `약분하기 전의 분수는 ${frac(a, b)}의 분모와 분자에 각각 ${josa(k, '을/를')} 곱한 ${frac(a * k, b * k)}이다.`,
        facts: { calc: [[`${a}*${k}`, 0], [`${b}*${k}`, 1]] }
      });
    }),
    T('reduce-line', '수직선의 눈금을 기약분수로 나타내기', '②39', (d) => {
      const [parts, at] = d.until(() => { const n = d.pick([6, 8, 9, 10, 12]); return [n, d.int(2, n - 1)]; }, ([n, k]) => gcd(n, k) > 1), g = gcd(parts, at);
      return F('수직선에서 화살표가 가리키는 수를 기약분수로 나타내면?', at / g, parts / g, {
        figure: partLine(1, parts, at),
        explain: `0과 1 사이를 똑같이 ${parts}칸으로 나눈 것 중의 ${at}칸이므로 ${frac(at, parts)}이다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(at / g, parts / g)}이다.`,
        facts: { calc: [[`${at}/${g}`, 0], [`${parts}/${g}`, 1]], unseen: [g] }
      });
    }),
    T('reduce-band', '색칠한 부분을 기약분수로 나타내기', '②3 ③4 심1', (d) => {
      const [n, k] = d.until(() => { const cells = d.pick([6, 8, 9, 10, 12, 15]); return [cells, d.int(2, cells - 1)]; }, ([cells, on]) => gcd(cells, on) > 1), g = gcd(n, k);
      return F('띠에 색칠한 부분은 전체의 얼마인지 기약분수로 나타내면?', k / g, n / g, {
        figure: band(n, k),
        explain: `전체 ${n}칸 중의 ${k}칸이므로 ${frac(k, n)}이다. 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(k / g, n / g)}이다.`,
        facts: { calc: [[`${k}/${g}`, 0], [`${n}/${g}`, 1]], unseen: [g] }
      });
    })
  ]);

  // ── 통분과 공통분모 ──
  B.addTypes('5-1-4', 'common', [
    T('common-word', '통분과 공통분모의 뜻', '①25 ②40 ③21', (d, n) => {
      const rows = d.shuffle(n === 0 ? [['통분', true], ['약분', false], ['공통분모', false], ['기약분수', false]] : [['공배수', true], ['공약수', false], ['최대공약수', false], ['합', false]]);
      return C(n === 0 ? '분수의 분모를 같게 하는 것을 무엇이라고 하는가?' : '두 분수를 통분할 때, 공통분모가 될 수 있는 수는 두 분모의 무엇인가?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: n === 0 ? '분수의 분모를 같게 하는 것을 통분한다고 하고, 통분한 분모를 공통분모라고 한다.' : '공통분모는 두 분모로 모두 나누어떨어져야 하므로 두 분모의 공배수이다.',
        facts: { truth: rows.map((row) => row[1]), want: true }
      });
    }, { count: 2 }),
    T('common-list', '크기가 같은 분수를 늘어놓아 분모가 같은 것 찾기', '①41 ②40 ③40', (d) => {
      // 다섯 개씩 늘어놓았을 때 분모가 같은 짝이 하나만 생기는 분모들
      const [a, b, c, e] = twoFracs(d, [[2, 3], [3, 4], [2, 5], [3, 5], [4, 6], [4, 5], [6, 8], [6, 9], [4, 10], [6, 10], [8, 12], [9, 12], [10, 15]]), L = lcm(b, e);
      const row = (top, den) => eq(...[1, 2, 3, 4, 5].reduce((out, k) => out.concat(k > 1 ? ['='] : [], [frac(top * k, den * k)]), []));
      return M('두 분수와 크기가 같은 분수를 분모가 작은 것부터 차례대로 쓴 것이다. 분모가 같은 분수끼리 짝 지을 때, ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a * L / b, c * L / e, L]), {
        figure: lines([row(a, b), row(c, e), `분모가 같은 분수끼리 짝 지으면 ${ex(duo(blankFrac(0, 2), blankFrac(1, 2)))}`]),
        explain: `두 줄에 모두 있는 분모는 ${L}이다. ${frac(a, b)} = ${frac(a * L / b, L)}, ${frac(c, e)} = ${frac(c * L / e, L)}이므로 ${duo(frac(a * L / b, L), frac(c * L / e, L))}이다.`,
        facts: { calc: [[`${a}*${L}/${b}`, 0], [`${c}*${L}/${e}`, 1], [String(L), 2]] }
      });
    }),
    T('common-product-steps', '두 분모의 곱으로 통분하는 과정', '①42 ②41 ③41', (d) => {
      const [a, b, c, e] = twoFracs(d, GENERAL.concat(COPRIME).filter(([x, y]) => x * y <= 150));
      return M('두 분모의 곱을 공통분모로 하여 통분하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([e, a * e, b, c * b]), {
        figure: lines([eq(frac(a, b), '=', frac(`${a} × ${box(LAB[0])}`, `${b} × ${e}`), '=', frac(box(LAB[1]), b * e)), eq(frac(c, e), '=', frac(`${c} × ${box(LAB[2])}`, `${e} × ${b}`), '=', frac(box(LAB[3]), b * e))]),
        explain: `분모와 분자에 각각 다른 분수의 분모를 곱한다. ${frac(a, b)} = ${frac(a * e, b * e)}, ${frac(c, e)} = ${frac(c * b, b * e)}`,
        facts: { calc: [[String(e), 0], [`${a}*${e}`, 1], [String(b), 2], [`${c}*${b}`, 3]] }
      });
    }),
    T('common-product', '두 분모의 곱을 공통분모로 하여 통분하기', '①42 ②41 ③41 심39', (d) => {
      const [a, b, c, e] = twoFracs(d, GENERAL.filter(([x, y]) => x * y <= 150));
      return M('두 분모의 곱을 공통분모로 하여 통분할 때, ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a * e, c * b, b * e]), {
        figure: arrow(duo(frac(a, b), frac(c, e)), duo(blankFrac(0, 2), blankFrac(1, 2))),
        explain: `공통분모는 ${b} × ${e} = ${b * e}이다. ${frac(a, b)} = ${frac(a * e, b * e)}, ${frac(c, e)} = ${frac(c * b, b * e)}`,
        facts: { calc: [[`${a}*${e}`, 0], [`${c}*${b}`, 1], [`${b}*${e}`, 2]] }
      });
    }),
    T('common-lcm', '두 분모의 최소공배수를 공통분모로 하여 통분하기', '①43 ②42 ③42 심39', (d, n) => {
      // 문항마다 두 분모의 관계가 다르다: 한쪽이 다른 쪽의 배수, 공약수가 1뿐, 그 밖.
      const [a, b, c, e] = twoFracs(d, [MULTIPLE, COPRIME, GENERAL][n]), L = lcm(b, e);
      const why = [`${josa(Math.max(b, e), '은/는')} ${Math.min(b, e)}의 배수이므로 두 분모의 최소공배수는 ${L}이다.`, `두 분모의 공약수가 1뿐이므로 최소공배수는 두 분모의 곱 ${L}이다.`, `${josa(b, '과/와')} ${e}의 최소공배수는 ${L}이다.`][n];
      return M('두 분모의 최소공배수를 공통분모로 하여 통분할 때, ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a * L / b, c * L / e, L]), {
        figure: arrow(duo(frac(a, b), frac(c, e)), duo(blankFrac(0, 2), blankFrac(1, 2))),
        explain: `${why} ${frac(a, b)} = ${frac(a * L / b, L)}, ${frac(c, e)} = ${frac(c * L / e, L)}`,
        facts: { calc: [[`${a}*${L / b}`, 0], [`${c}*${L / e}`, 1], [`${b}*${L / b}`, 2]], unseen: [L / b, L / e], rule: ['lcmMultiple', 'lcmCoprime', 'lcmGeneral'][n] }
      });
    }, { count: 3 }),
    T('common-lcm-mixed', '대분수를 최소공배수로 통분하기', '③42 ①45', (d) => {
      const [a, b, c, e] = twoFracs(d, GENERAL.concat(COPRIME).filter(([x, y]) => lcm(x, y) <= 60)), L = lcm(b, e), w1 = d.int(1, 5), w2 = d.int(1, 5);
      return M('두 대분수의 분수 부분을 두 분모의 최소공배수를 공통분모로 하여 통분할 때, ㉠, ㉡, ㉢에 알맞은 수는?', labelled([a * L / b, c * L / e, L]), {
        figure: lines([ex(duo(mixed(w1, a, b), mixed(w2, c, e))), ex('<i>→</i> ' + duo(mixed(w1, box(LAB[0]), box(LAB[2])), mixed(w2, box(LAB[1]), box(LAB[2]))))]),
        explain: `자연수 부분은 그대로 두고 분수 부분만 통분한다. ${josa(b, '과/와')} ${e}의 최소공배수는 ${L}이므로 ${duo(mixed(w1, a * L / b, L), mixed(w2, c * L / e, L))}이다.`,
        facts: { calc: [[`${a}*${L / b}`, 0], [`${c}*${L / e}`, 1], [`${b}*${L / b}`, 2]], unseen: [L / b, L / e] }
      });
    }),
    T('common-lcm-steps', '최소공배수로 통분할 때 분모와 분자에 곱하는 수', '①43 ②42', (d) => {
      const [a, b, c, e] = twoFracs(d, GENERAL), L = lcm(b, e);
      return M('두 분모의 최소공배수를 공통분모로 하여 통분하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([L, L / b, L / e]), {
        figure: lines([`${josa(b, '과/와')} ${e}의 최소공배수: ${box(LAB[0])}`, eq(frac(a, b), '=', frac(`${a} × ${box(LAB[1])}`, `${b} × ${box(LAB[1])}`)), eq(frac(c, e), '=', frac(`${c} × ${box(LAB[2])}`, `${e} × ${box(LAB[2])}`))]),
        explain: `${josa(b, '과/와')} ${e}의 최소공배수는 ${L}이다. ${L} ÷ ${b} = ${L / b}, ${L} ÷ ${e} = ${L / e}이므로 분모와 분자에 각각 ${L / b}, ${L / e}${tail(L / e, '을/를')} 곱한다.`,
        facts: { digit: { template: `□%${b}+□%${e}<1`, lo: 1, hi: b * e, ask: 'min' }, calc: [[`${L}/${b}`, 1], [`${L}/${e}`, 2]], unseen: [L] }
      });
    }),
    T('common-both-ways', '두 가지 방법으로 통분하기', '①43·55 ②43 ③43 심39', (d) => {
      const [a, b, c, e] = twoFracs(d, GENERAL.filter(([x, y]) => x * y <= 150)), L = lcm(b, e), P = b * e;
      return M('두 분수를 두 가지 방법으로 통분할 때, ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([a * e, c * b, a * L / b, c * L / e]), {
        figure: lines([ex(duo(frac(a, b), frac(c, e))), `두 분모의 곱을 공통분모로: ${ex(duo(frac(box(LAB[0]), P), frac(box(LAB[1]), P)))}`, `두 분모의 최소공배수를 공통분모로: ${ex(duo(frac(box(LAB[2]), L), frac(box(LAB[3]), L)))}`]),
        explain: `두 분모의 곱 ${josa(P, '으로/로')} 통분하면 ${duo(frac(a * e, P), frac(c * b, P))}, 최소공배수 ${josa(L, '으로/로')} 통분하면 ${duo(frac(a * L / b, L), frac(c * L / e, L))}이다.`,
        facts: { calc: [[`${a}*${P}/${b}`, 0], [`${c}*${P}/${e}`, 1], [`${a}*${L}/${b}`, 2], [`${c}*${L}/${e}`, 3]] }
      });
    }),
    T('common-given', '주어진 공통분모로 통분하기', '①44 ②44 ③44·45', (d) => {
      // 공통분모는 두 분모의 곱도 최소공배수도 아닌 공배수
      const [a, b, c, e, Nn] = d.until(() => { const f = twoFracs(d, GENERAL.concat(COPRIME, MULTIPLE)); return f.concat([lcm(f[1], f[3]) * d.int(2, 4)]); }, (f) => f[4] !== f[1] * f[3] && f[4] <= 120);
      return M(`${josa(Nn, '을/를')} 공통분모로 하여 통분할 때, ㉠, ㉡에 알맞은 수는?`, labelled([a * Nn / b, c * Nn / e]), {
        figure: arrow(duo(frac(a, b), frac(c, e)), duo(frac(box(LAB[0]), Nn), frac(box(LAB[1]), Nn))),
        explain: `${Nn} ÷ ${b} = ${Nn / b}, ${Nn} ÷ ${e} = ${Nn / e}이므로 분모와 분자에 각각 ${Nn / b}, ${Nn / e}${tail(Nn / e, '을/를')} 곱한다. ${duo(frac(a * Nn / b, Nn), frac(c * Nn / e, Nn))}`,
        facts: { calc: [[`${a}*${Nn}/${b}`, 0], [`${c}*${Nn}/${e}`, 1]] }
      });
    }),
    T('common-cannot', '공통분모가 될 수 없는 수 고르기', '①45 ②46 ③46 심41', (d) => {
      // 틀린 수: 두 분모 가운데 한쪽만의 배수
      const [a, b, c, e] = twoFracs(d, GENERAL.concat(COPRIME).filter(([x, y]) => lcm(x, y) <= 45)), L = lcm(b, e);
      const cands = []; for (let v = 2; v <= L * 4; v += 1) if ((v % b === 0) !== (v % e === 0) && v * 2 > L) cands.push(v);
      const bad = d.pick(cands), opts = [L, L * 2, L * d.pick([3, 4]), bad].sort((x, y) => x - y);
      return C(`${fj(a, b, '과/와')} ${fj(c, e, '을/를')} 통분할 때, 공통분모가 될 수 없는 수는?`, opts.map(String), opts.indexOf(bad), {
        explain: `공통분모는 두 분모 ${josa(b, '과/와')} ${e}의 공배수이어야 한다. ${josa(bad, '은/는')} ${bad % b === 0 ? e : b}의 배수가 아니다.`,
        facts: { claimed: opts.map((v) => [`${v}%${b}+${v}%${e}`, 0]), claimedWant: false }
      });
    }),
    T('common-smallest3', '공통분모가 될 수 있는 수를 작은 수부터 쓰기', '①46 ②46 ③47 심41', (d) => {
      const [a, b, c, e] = twoFracs(d, GENERAL.concat(COPRIME, MULTIPLE).filter(([x, y]) => lcm(x, y) <= 60)), L = lcm(b, e);
      return M(`${fj(a, b, '과/와')} ${fj(c, e, '을/를')} 통분할 때, 공통분모가 될 수 있는 수를 작은 수부터 차례대로 ㉠, ㉡, ㉢이라고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([L, L * 2, L * 3]), {
        explain: `공통분모가 될 수 있는 수는 두 분모의 공배수이다. ${josa(b, '과/와')} ${e}의 최소공배수는 ${L}이고, 공배수는 ${L}의 배수이므로 ${L}, ${L * 2}, ${L * 3}이다.`,
        facts: { digit: { template: `□%${b}+□%${e}<1`, lo: 1, hi: b * e, ask: 'min' }, calc: [[`${L}*2`, 1], [`${L}*3`, 2]], unseen: [L, 2, 3] }
      });
    }),
    T('common-range-count', '100보다 작은 공통분모의 수', '①47 ②47 ③48 심42', (d) => {
      const [a, b, c, e] = twoFracs(d, GENERAL.concat(COPRIME).filter(([x, y]) => lcm(x, y) >= 12 && lcm(x, y) <= 48)), L = lcm(b, e), count = Math.floor(99 / L);
      const list = Array.from({ length: count }, (_, i) => L * (i + 1));
      return N(`${fj(a, b, '과/와')} ${fj(c, e, '을/를')} 통분할 때, 공통분모가 될 수 있는 수 가운데 100보다 작은 수는 모두 몇 개인가?`, count, {
        unit: '개', explain: `${josa(b, '과/와')} ${e}의 최소공배수는 ${L}이다. 100보다 작은 ${L}의 배수는 ${list.join(', ')}${tail(list[count - 1], '으로/로')} ${count}개이다.`,
        facts: { digit: { template: `□%${b}+□%${e}<1`, lo: 1, hi: 99, ask: 'count' } }
      });
    }),
    T('common-range-one', '50보다 큰 두 자리 수인 공통분모', '①47 ②47 ③48', (d) => {
      // 50보다 큰 두 자리 수인 공배수가 하나뿐인 분모들
      const ONE = GENERAL.concat(COPRIME).filter(([x, y]) => { const L = lcm(x, y); return Math.floor(99 / L) - Math.floor(50 / L) === 1; });
      const [a, b, c, e] = twoFracs(d, ONE), L = lcm(b, e), v = L * Math.floor(99 / L);
      return N(`${fj(a, b, '과/와')} ${fj(c, e, '을/를')} 통분할 때, 공통분모가 될 수 있는 수 가운데 50보다 큰 두 자리 수는?`, v, {
        explain: `${josa(b, '과/와')} ${e}의 최소공배수는 ${L}이다. ${L}의 배수 가운데 50보다 큰 두 자리 수는 ${v}뿐이다.`,
        facts: { digit: { template: `□%${b}+□%${e}<1`, lo: 51, hi: 99, ask: 'max' } }
      });
    }),
    T('common-least-pick', '가장 작은 공통분모가 가장 작은 것 고르기', '①49 ③49', (d) => {
      // 두 분모의 곱이 가장 작은 쌍이 답이 되지 않게 고른다.
      const rows = d.until(() => d.shuffle(GENERAL.concat(COPRIME, MULTIPLE)).slice(0, 4).map(([x, y]) => [coTop(d, x), x, coTop(d, y), y]),
        (list) => { const ls = list.map((r) => lcm(r[1], r[3])), ps = list.map((r) => r[1] * r[3]); return new Set(ls).size === 4 && Math.max(...ls) <= 90 && ps[ls.indexOf(Math.min(...ls))] !== Math.min(...ps); });
      const ls = rows.map((r) => lcm(r[1], r[3])), hit = ls.indexOf(Math.min(...ls));
      return C('두 분모의 최소공배수를 공통분모로 하여 통분할 때, 공통분모가 가장 작은 것은?', LAB, hit, {
        figure: tagged(rows.map(([a, b, c, e]) => ex(duo(frac(a, b), frac(c, e))))),
        explain: `두 분모의 최소공배수는 차례대로 ${ls.join(', ')}이다. 가장 작은 것은 ${LAB[hit]}의 ${ls[hit]}이다.`,
        facts: { choose: { exprs: rows.map(([, b, , e]) => `${b}*${e}/${gcd(b, e)}`), rule: 'min' }, unseen: rows.map(([, b, , e]) => gcd(b, e)) }
      });
    }),
    T('common-right-pick', '바르게 통분한 것 고르기', '①50 ②45 ③50 심40', (d) => {
      // 틀린 보기: 분모만 바꾸고 분자는 그대로 둔 것, 분자에 곱하는 수를 서로 바꾼 것, 분모는 두 분모의 곱인데 분자는 최소공배수로 통분한 것
      const [a, b, c, e] = twoFracs(d, GENERAL.filter(([x, y]) => x * y <= 150), (p, q, r, s) => p < s && r < q), L = lcm(b, e), x = a * L / b, y = c * L / e;
      const right = [x, y, L], rows = d.shuffle([right, [a, c, L], [a * L / e, c * L / b, L], [x, y, b * e]]);
      const zero = ([p, q, n]) => `(${p}*${b}-${a}*${n})*(${p}*${b}-${a}*${n})+(${q}*${e}-${c}*${n})*(${q}*${e}-${c}*${n})`;
      return C(`${fj(a, b, '과/와')} ${fj(c, e, '을/를')} 바르게 통분한 것은?`, rows.map(([p, q, n]) => ex(duo(frac(p, n), frac(q, n)))), rows.indexOf(right), {
        explain: `${josa(b, '과/와')} ${e}의 최소공배수 ${josa(L, '을/를')} 공통분모로 하면 분모와 분자에 각각 ${L / b}, ${L / e}${tail(L / e, '을/를')} 곱한다. ${duo(frac(x, L), frac(y, L))}`,
        facts: { claimed: rows.map((row) => [zero(row), 0]), claimedWant: true }
      });
    }),
    T('common-talk', '통분에 대한 설명 가려내기', '②49 ③50 ①54', (d) => {
      const [a, b, c, e] = twoFracs(d, GENERAL.filter(([x, y]) => x * y <= 150)), L = lcm(b, e), P = b * e, big = Math.max(b, e);
      const half = big * d.until(() => d.int(2, 4), (k) => (big * k) % L !== 0);
      const rows = d.shuffle([
        [`가장 작은 공통분모는 ${L}이다.`, true],
        [`두 분모의 곱 ${josa(P, '을/를')} 공통분모로 하여 통분할 수 있다.`, true],
        [`${josa(L, '을/를')} 공통분모로 하여 통분하면 ${duo(frac(a * L / b, L), frac(c * L / e, L))}이다.`, true],
        d.bool() ? [`공통분모가 될 수 있는 수는 ${josa(L, '과/와')} ${P}뿐이다.`, false] : [`${josa(half, '을/를')} 공통분모로 하여 통분할 수 있다.`, false]
      ]);
      return C(`${fj(a, b, '과/와')} ${frac(c, e)}의 통분에 대한 설명으로 옳지 않은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), {
        explain: `공통분모가 될 수 있는 수는 두 분모 ${josa(b, '과/와')} ${e}의 공배수 ${L}, ${L * 2}, ${L * 3}, …이다. 공배수는 셀 수 없이 많고, 공배수가 아닌 수는 공통분모가 될 수 없다.`,
        facts: { truth: rows.map((row) => row[1]), want: false }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
