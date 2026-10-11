// 3학년 2학기 4단원 분수 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 9종의 평가 자료(단원평가·형성평가·수학익힘·수행평가)에서 뽑은 문제 꼴 목록(기본꼴 1~3, 모두 311꼴)을
// 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (교과서마다 단원 차례가 달라 최수일·장혜원·강문봉·박만구의 자료는 5단원 폴더에서 가져왔다. 비상 교과서는 이 단원에 소수를 함께 싣지만
//  소수는 3학년 1학기 「분수와 소수」에 실었으므로 여기서는 분수만 다룬다.)
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다(부분을 분수로, 분수만큼의 양, 분수의 갈래, 대분수와 가분수, 크기 비교 — 그림·수직선·식·문장제).
//    숫자만 다르거나 말만 다른 것은 한 번만 싣는다.
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      4학년 「분수의 덧셈과 뺄셈」: 분수만큼끼리의 합·차를 분수로 구하는 꼴, 단위분수씩 여러 개를 더해 가는 꼴
//      5학년 「약분과 통분」: 크기가 같은 분수 찾기, 분모가 다른 분수의 크기 비교
//      4학년 「곱셈과 나눗셈」: 네 자리 수를 나누어야 하는 분수만큼(1200 m의 3/4)
//  - 분수만큼 색칠하기·수직선에 나타내기(작도), 방법·까닭 쓰기(서술형), 놀이는 싣지 않는다.
//  - 수 카드로 분수를 모두 만들기, 합과 차가 주어진 분수 찾기처럼 경우 따지기·조건 풀이가 어려움의 대부분인 것은 싣지 않는다.
// 분수의 답은 묶은 대로 적는다(더 줄일 수 있는 분수가 나오지 않게 수를 골랐다). 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, frac, mixed, partLine, dots, pieces, lines, numbers, N, M, C, F } = B.kit;
  const PART = '4수01-09', KIND = '4수01-10', COMP = '4수01-11';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // 토씨: 분수와 대분수는 분자를 마지막에 읽는다(5분의 3, 2와 5분의 3).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (k, n, pair) => frac(k, n) + tail(k, pair);
  const mj = (w, k, n, pair) => mixed(w, k, n) + tail(k, pair);
  const labelled = (answers) => answers.map((answer, i) => ({ label: LABELS[i], answer }));
  const sign = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  // 묶음: 한 묶음 g개, 모두 m묶음, 그 가운데 k묶음(k/m 은 더 줄일 수 없는 진분수)
  const bundles = (d, ok) => d.until(() => [d.int(2, 5), d.int(3, 6), d.int(1, 5)], ([g, m, k]) => k < m && gcd(k, m) === 1 && g * m <= 30 && (!ok || ok(g, m, k)));
  // 대분수 w n/d (n/d 는 진분수)
  const mixedOf = (d, ok) => d.until(() => [d.int(1, 4), d.int(1, 8), d.int(3, 9)], ([w, n, den]) => n < den && (!ok || ok(w, n, den)));
  const shapesOf = (w, n, den) => '<div class="mb-lines"><div>' + Array.from({ length: w + 1 }, (_, i) => pieces('circle', den, { shaded: i < w ? den : n, scale: 1.05 })).join(' ') + '</div></div>';

  B.addUnit({
    id: '3-2-4', grade: 3, semester: 2, no: 4, title: '분수', version: 1,
    groups: [
      {
        id: 'part', title: '부분은 전체의 얼마인지 분수로 나타내기', standard: PART,
        types: [
          T('part-fill', '묶음으로 분수 나타내기', '①1·3 ②1 ③1', (d) => {
            const [g, m, k] = bundles(d), total = g * m;
            return F(`${total}개를 ${g}개씩 묶으면 ${m}묶음이 된다. ${g * k}개는 ${total}개의 몇 분의 몇인가?`, k, m, {
              figure: dots(g, m, { loop: 'cols' }), explain: `${g * k}개는 ${m}묶음 중의 ${k}묶음이므로 ${total}개의 ${fj(k, m, '이다/다')}.`.replace(/(이다|다)\.$/, '이다.'), facts: { partOf: { total, group: g, part: g * k } }
            });
          }),
          T('part-shaded', '색칠한 부분을 분수로 나타내기', '①2 ②2 ③2 심2', (d) => {
            const [g, m, k] = bundles(d, (x, y, z) => z >= 2), total = g * m;
            return F('똑같이 묶은 것 중에서 색칠한 부분은 전체의 몇 분의 몇인가?', k, m, {
              figure: dots(g, m, { loop: 'cols', on: k }), explain: `전체 ${m}묶음 중에서 ${k}묶음을 색칠하였다.`, facts: { partOf: { total, group: g, part: g * k } }
            });
          }),
          T('part-regroup', '묶는 방법에 따라 달라지는 분수', '③5 ①6', (d) => {
            // 12를 2씩 묶으면 8은 4/6, 4씩 묶으면 8은 2/3
            const [g, m, k] = d.until(() => [d.int(2, 3), d.int(3, 5), d.int(1, 4)], ([x, y, z]) => z < y), total = g * 2 * m, part = g * 2 * k;
            return M('㉠, ㉡에 알맞은 수는?', labelled([part / g, k]), {
              figure: lines([`${josa(total, '을/를')} ${g}씩 묶으면 ${josa(part, '은/는')} ${total}의 ${frac(box(LABELS[0]), total / g)}이다.`, `${josa(total, '을/를')} ${g * 2}씩 묶으면 ${josa(part, '은/는')} ${total}의 ${frac(box(LABELS[1]), m)}이다.`]),
              explain: `${g}씩 묶으면 ${part}는 ${part / g}묶음, ${g * 2}씩 묶으면 ${part}는 ${k}묶음이다. 묶는 수에 따라 분수가 달라진다.`.replace(new RegExp(`${part}는`, 'g'), josa(part, '은/는')),
              facts: { calc: [[`${part}/${g}`, 0], [`${part}/${g * 2}`, 1]] }
            });
          }),
          T('part-word', '문장제: 부분은 전체의 몇 분의 몇', '①4 ②? ③10 심5', (d) => {
            const [g, m, k] = bundles(d, (x, y, z) => z >= 2), total = g * m;
            return F(`귤 ${total}개를 한 봉지에 ${g}개씩 나누어 담았다. 귤 ${g * k}개는 전체의 몇 분의 몇인가?`, k, m, {
              explain: `한 봉지에 ${g}개씩 담으면 ${m}봉지가 된다. 귤 ${g * k}개는 ${k}봉지이므로 전체의 ${frac(k, m)}이다.`, facts: { partOf: { total, group: g, part: g * k } }
            });
          }),
          T('part-rest', '문장제: 남은 부분을 분수로 나타내기', '③11 심8', (d) => {
            const [g, m, k] = bundles(d, (x, y, z) => y - z >= 2), total = g * m;
            return F(`구슬 ${total}개를 ${g}개씩 묶고, 그중 ${g * k}개를 동생에게 주었다. 남은 구슬은 전체의 몇 분의 몇인가?`, m - k, m, {
              explain: `${g}개씩 묶으면 ${m}묶음이다. ${k}묶음을 주었으므로 ${m - k}묶음이 남고, 남은 구슬은 전체의 ${frac(m - k, m)}이다.`, facts: { partOf: { total, group: g, part: total - g * k } }
            });
          })
        ]
      },
      {
        id: 'of', title: '전체의 분수만큼은 얼마인지 알아보기', standard: PART,
        types: [
          T('of-unit', '그림을 보고 분수만큼 구하기', '①11·12 ②15 ③14', (d) => {
            const [g, m, k] = bundles(d, (x, y, z) => z >= 2), total = g * m;
            return M('㉠, ㉡에 알맞은 수는?', labelled([g, g * k]), {
              figure: dots(g, m, { loop: 'cols' }) + lines([`${total}의 ${fj(1, m, '은/는')} ${box(LABELS[0])}이다.`, `${total}의 ${fj(k, m, '은/는')} ${box(LABELS[1])}이다.`]),
              explain: `${josa(total, '을/를')} 똑같이 ${m}묶음으로 나눈 것 중의 1묶음은 ${g}, ${k}묶음은 ${g} × ${k} = ${g * k}이다.`, facts: { calc: [[`${total}/${m}`, 0], [`${total}/${m}*${k}`, 1]] }
            });
          }),
          T('of-calc', '분수만큼 계산하기', '①13 ②16 ③16 심11', (d) => {
            const [m, u, k] = d.until(() => [d.int(3, 9), d.int(3, 9), d.int(2, 8)], ([x, y, z]) => z < x && gcd(z, x) === 1 && x !== y), total = m * u;
            return N(`${total}의 ${fj(k, m, '은/는')}?`, u * k, { explain: `${total}의 ${fj(1, m, '은/는')} ${total} ÷ ${m} = ${u}이므로 ${total}의 ${fj(k, m, '은/는')} ${u} × ${k} = ${u * k}이다.`, facts: { calc: [[`${total}/${m}*${k}`, 0]] } });
          }),
          T('of-right', '분수만큼을 바르게 구한 것 고르기', '①15 ③27 심14', (d) => {
            // 틀린 것: 단위분수만큼만 구한 것, 분자로 나눈 것
            const pick = () => d.until(() => [d.int(3, 8), d.int(3, 8), d.int(2, 5)], ([x, y, z]) => z < x && gcd(z, x) === 1 && y % z === 0 && y / z !== z);
            const rows = d.until(() => [pick(), pick(), pick()], (list) => new Set(list.map(([x, y]) => x * y)).size === 3), good = d.int(0, 2);
            const told = rows.map(([m, u, k], i) => (i === good ? u * k : i === (good + 1) % 3 ? u : m * u / k));
            return C('바르게 구한 것은?', rows.map(([m, u, k], i) => `${m * u}의 ${fj(k, m, '은/는')} ${told[i]}이다.`), good, {
              explain: rows.map(([m, u, k]) => `${m * u}의 ${fj(k, m, '은/는')} ${m * u} ÷ ${m} × ${k} = ${u * k}`).join(', ') + '이다.',
              facts: { claimed: rows.map(([m, u, k], i) => [`${m * u}/${m}*${k}`, told[i]]), claimedWant: true }
            });
          }),
          T('of-compare', '분수만큼의 크기 비교', '①22 ③25 심17', (d) => {
            const side = () => d.until(() => [d.int(3, 8), d.int(3, 9), d.int(1, 6)], ([x, y, z]) => z < x && gcd(z, x) === 1);
            const [[m1, u1, k1], [m2, u2, k2]] = d.until(() => [side(), side()], ([p, q]) => p[0] !== q[0] && p[0] * p[1] !== q[0] * q[1] && Math.abs(p[1] * p[2] - q[1] * q[2]) <= 6 && (p[0] * p[1] > q[0] * q[1]) !== (p[1] * p[2] > q[1] * q[2]));
            return C('두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(u1 * k1, u2 * k2), {
              figure: versus(`${m1 * u1}의 ${frac(k1, m1)}`, `${m2 * u2}의 ${frac(k2, m2)}`), explain: `${m1 * u1}의 ${fj(k1, m1, '은/는')} ${u1 * k1}, ${m2 * u2}의 ${fj(k2, m2, '은/는')} ${u2 * k2}이다.`,
              facts: { choose: { exprs: [`${m1 * u1}/${m1}*${k1}`, `${m2 * u2}/${m2}*${k2}`], rule: 'compare' } }
            });
          }),
          T('of-word', '문장제: 전체의 분수만큼', '①16 ②18 ③18 심18', (d) => {
            const [m, u, k] = d.until(() => [d.int(3, 9), d.int(3, 9), d.int(2, 7)], ([x, y, z]) => z < x && gcd(z, x) === 1), total = m * u;
            return N(`색종이 ${total}장 중에서 ${fj(k, m, '을/를')} 사용하였다. 사용한 색종이는 몇 장인가?`, u * k, { unit: '장', explain: `${total}의 ${fj(k, m, '은/는')} ${total} ÷ ${m} × ${k} = ${u * k}이다.`, facts: { calc: [[`${total}/${m}*${k}`, 0]] } });
          }),
          T('of-left', '문장제: 분수만큼 쓰고 남은 양', '①17 ②20 ③20 심19', (d) => {
            const [m, u, k] = d.until(() => [d.int(3, 9), d.int(3, 9), d.int(1, 7)], ([x, y, z]) => z < x && gcd(z, x) === 1), total = m * u;
            return N(`딱지 ${total}장 중에서 ${fj(k, m, '을/를')} 친구에게 주었다. 남은 딱지는 몇 장인가?`, total - u * k, {
              unit: '장', explain: `친구에게 준 딱지는 ${total} ÷ ${m} × ${k} = ${u * k}(장)이다. ${total} - ${u * k} = ${total - u * k}`, facts: { calc: [[`${total}-${total}/${m}*${k}`, 0]] }
            });
          }),
          T('of-length', '1 m의 분수만큼은 몇 cm', '①28 ③34', (d) => {
            const [m, k] = d.pick([[2, 1], [4, 1], [4, 3], [5, 1], [5, 2], [5, 3], [5, 4], [10, 3], [10, 7], [10, 9]]);
            return N(`1 m의 ${fj(k, m, '은/는')} 몇 cm인가?`, 100 / m * k, { unit: 'cm', explain: `1 m는 100 cm이다. 100 cm의 ${fj(k, m, '은/는')} 100 ÷ ${m} × ${k} = ${100 / m * k}(cm)이다.`, facts: { calc: [[`100/${m}*${k}`, 0]], unseen: [100] } });
          }),
          T('of-time', '1시간의 분수만큼은 몇 분', '①30 ③37', (d) => {
            const [m, k] = d.pick([[2, 1], [3, 1], [3, 2], [4, 1], [4, 3], [5, 2], [5, 3], [6, 5], [10, 3], [10, 7]]);
            return N(`1시간의 ${fj(k, m, '은/는')} 몇 분인가?`, 60 / m * k, { unit: '분', explain: `1시간은 60분이다. 60분의 ${fj(k, m, '은/는')} 60 ÷ ${m} × ${k} = ${60 / m * k}(분)이다.`, facts: { calc: [[`60/${m}*${k}`, 0]], unseen: [60] } });
          }),
          T('of-tape', '띠 그림을 보고 길이의 분수만큼 구하기', '①26 ②? ③32 심12', (d) => {
            const [m, u, k] = d.until(() => [d.int(3, 8), d.int(2, 9), d.int(2, 7)], ([x, y, z]) => z < x && gcd(z, x) === 1), total = m * u;
            return N(`길이가 ${total} cm인 종이띠를 똑같이 ${m}칸으로 나누어 ${k}칸을 색칠하였다. 색칠한 부분의 길이는 몇 cm인가?`, u * k, {
              unit: 'cm', figure: pieces('bar', m, { shaded: k }), explain: `색칠한 부분은 전체의 ${frac(k, m)}이다. ${total} ÷ ${m} × ${k} = ${u * k}`, facts: { calc: [[`${total}/${m}*${k}`, 0]] }
            });
          })
        ]
      },
      {
        id: 'kind', title: '진분수, 가분수, 대분수', standard: KIND,
        types: [
          T('kind-word', '분수의 뜻과 이름', '①32 ②30 ③39', (d) => {
            const [say, word] = d.pick([['분자가 분모보다 작은 분수', '진분수'], ['분자가 분모와 같거나 분모보다 큰 분수', '가분수'], ['자연수와 진분수로 이루어진 분수', '대분수']]), list = ['진분수', '가분수', '대분수'];
            return C('다음에서 설명하는 분수는?', list, list.indexOf(word), { figure: lines(['「' + say + '」']), explain: `${say}를 ${word}라고 한다.`, facts: { truth: list.map((w) => w === word), want: true } });
          }),
          T('kind-count', '가분수 가려내기', '①33·34 ②31 ③45', (d) => {
            // 분자와 분모가 같은 분수도 가분수이다
            const den = d.int(4, 8), list = d.until(() => d.shuffle([[den, den], [d.int(1, den - 1), den], [den + d.int(1, 5), den], [d.int(1, 5), 6], [d.int(7, 11), 6], [d.int(2, 4), 9]]), (x) => new Set(x.map(String)).size === 6);
            return N('가분수는 모두 몇 개인가?', list.filter(([n, m]) => n >= m).length, {
              unit: '개', figure: numbers(list.map(([n, m]) => frac(n, m))), explain: `분자가 분모와 같거나 분모보다 큰 분수가 가분수이다. 가분수는 ${list.filter(([n, m]) => n >= m).map(([n, m]) => frac(n, m)).join(', ')}이다.`,
              facts: { fracKinds: { list, want: 'improper' } }
            });
          }),
          T('kind-natural', '자연수를 분수로 나타내기', '①40·41 ②? ③47 심35', (d) => {
            const w = d.int(2, 5), den = d.int(3, 8);
            return N('□ 안에 알맞은 수는?', w * den, {
              figure: `<span class="mb-expr">${w} <i>=</i> ${frac(box(), den)}</span>`, explain: `1은 ${frac(den, den)}과 같다. ${w}는 ${frac(1, den)}이 ${den} × ${w} = ${w * den}(개)인 수이다.`.replace(`${w}는`, josa(w, '은/는')), facts: { calc: [[`${w}*${den}`, 0]] }
            });
          }),
          T('kind-all', '분모가 정해진 진분수의 수', '①45 ③48 심39', (d) => {
            const den = d.int(5, 12);
            return N(`분모가 ${den}인 진분수는 모두 몇 개인가?`, den - 1, { unit: '개', explain: `분자가 분모보다 작아야 하므로 분자는 1부터 ${den - 1}까지이다.`, facts: { calc: [[`${den}-1`, 0]], unseen: [1] } });
          }),
          T('kind-mixed', '대분수 찾기', '①55 ②33 ③64·66 심33', (d) => {
            // 자연수와 가분수를 붙여 쓴 것은 대분수가 아니다
            const [w, n, den] = mixedOf(d), rows = d.shuffle([[mixed(w, n, den), true], [mixed(d.int(1, 3), den + d.int(1, 3), den), false], [frac(den + d.int(1, 6), den), false], [frac(d.int(1, den - 1), den), false]]);
            return C('대분수는?', rows.map(([html]) => html), rows.findIndex(([, ok]) => ok), {
              explain: `대분수는 자연수와 진분수로 이루어진 분수이다. ${mj(w, n, den, '이/가')} 대분수이다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('kind-line', '수직선의 수를 가분수로 나타내기', '①37·38 ②? ③43·73 심51', (d) => {
            const den = d.int(3, 5), at = d.until(() => d.int(den + 1, den * 3 - 1), (v) => v % den !== 0);
            return N(`화살표가 가리키는 수를 분모가 ${den}인 가분수로 나타낼 때, 분자는?`, at, {
              figure: partLine(3, den, at), explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. 화살표는 0에서 ${at}칸 간 곳이므로 ${frac(at, den)}이다.`, facts: { calc: [[String(at), 0]] }
            });
          })
        ]
      },
      {
        id: 'conv', title: '대분수와 가분수', standard: KIND,
        types: [
          T('conv-picture', '색칠한 그림을 대분수와 가분수로 나타내기', '①52·63 ②? ③61·70 심50', (d) => {
            const [w, n, den] = mixedOf(d, (x, y, z) => x <= 2 && z <= 6);
            return M('색칠한 부분을 대분수와 가분수로 나타낼 때, ㉠, ㉡, ㉢에 알맞은 수는?', labelled([w, n, w * den + n]), {
              figure: shapesOf(w, n, den) + lines([`대분수: ${mixed(box(LABELS[0]), box(LABELS[1]), den)}`, `가분수: ${frac(box(LABELS[2]), den)}`]),
              explain: `모두 색칠한 원이 ${w}개, 나머지 원에서 ${den}조각 중 ${n}조각을 색칠하였으므로 ${mixed(w, n, den)}이다. 색칠한 조각은 모두 ${w * den + n}개이므로 ${frac(w * den + n, den)}이다.`,
              facts: { mixedPieces: 'both' }
            });
          }),
          T('conv-improper', '대분수를 가분수로 나타내기', '①66 ②53 ③75 심49', (d) => {
            const [w, n, den] = mixedOf(d);
            return N('대분수를 가분수로 나타내려고 한다. □ 안에 알맞은 수는?', w * den + n, {
              figure: `<span class="mb-expr">${mixed(w, n, den)} <i>=</i> ${frac(box(), den)}</span>`, explain: `${w}는 ${frac(1, den)}이 ${w * den}개이고 ${fj(n, den, '은/는')} ${frac(1, den)}이 ${n}개이므로 ${frac(1, den)}이 모두 ${w * den + n}개이다.`.replace(`${w}는`, josa(w, '은/는')),
              facts: { calc: [[`${w}*${den}+${n}`, 0]] }
            });
          }),
          T('conv-mixed', '가분수를 대분수로 나타내기', '①67 ②54 ③76 심49', (d) => {
            const [w, n, den] = mixedOf(d), top = w * den + n;
            return M('가분수를 대분수로 나타내려고 한다. ㉠, ㉡에 알맞은 수는?', labelled([w, n]), {
              figure: `<span class="mb-expr">${frac(top, den)} <i>=</i> ${mixed(box(LABELS[0]), box(LABELS[1]), den)}</span>`, explain: `${top} ÷ ${den} = ${w} … ${n}이다. ${frac(den, den)}이 ${w}개 있고 ${frac(n, den)}이 남으므로 ${mixed(w, n, den)}이다.`,
              facts: { calc: [[`(${top}-${top}%${den})/${den}`, 0], [`${top}%${den}`, 1]] }
            });
          }),
          T('conv-steps', '단위분수의 수로 바꾸는 과정', '①64 ②? ③74', (d) => {
            const [w, n, den] = mixedOf(d, (x, y) => x >= 2 && y >= 2);
            return M('㉠, ㉡에 알맞은 수는?', labelled([w * den, w * den + n]), {
              figure: lines([`${mixed(w, n, den)}에서 ${josa(w, '은/는')} ${frac(1, den)}이 ${box(LABELS[0])}개이고, ${fj(n, den, '은/는')} ${frac(1, den)}이 ${n}개이다.`, `따라서 ${mj(w, n, den, '은/는')} ${frac(1, den)}이 ${box(LABELS[1])}개이다.`]),
              explain: `1은 ${frac(1, den)}이 ${den}개이므로 ${josa(w, '은/는')} ${den} × ${w} = ${w * den}(개)이다. ${w * den} + ${n} = ${w * den + n}`, facts: { calc: [[`${den}*${w}`, 0], [`${den}*${w}+${n}`, 1]] }
            });
          }),
          T('conv-wrong', '잘못 바꾼 것 찾기', '①69 ②? ③78 심54', (d) => {
            // 틀린 것: 자연수 부분만 바꾸어 분자를 더하지 않았다
            const rows = d.until(() => [mixedOf(d), mixedOf(d), mixedOf(d)], (list) => new Set(list.map(String)).size === 3 && new Set(list.map(([w, n, den]) => den)).size >= 2), bad = d.int(0, 2);
            const tops = rows.map(([w, n, den], i) => (i === bad ? w * den : w * den + n));
            return C('대분수를 가분수로 잘못 나타낸 것은?', rows.map(([w, n, den], i) => `<span class="mb-expr">${mixed(w, n, den)} <i>=</i> ${frac(tops[i], den)}</span>`), bad, {
              explain: `${mj(rows[bad][0], rows[bad][1], rows[bad][2], '은/는')} ${frac(1, rows[bad][2])}이 ${rows[bad][0] * rows[bad][2]} + ${rows[bad][1]} = ${rows[bad][0] * rows[bad][2] + rows[bad][1]}(개)인 수이므로 ${frac(rows[bad][0] * rows[bad][2] + rows[bad][1], rows[bad][2])}이다.`,
              facts: { claimed: rows.map(([w, n, den], i) => [`${w}*${den}+${n}`, tops[i]]), claimedWant: false }
            });
          }),
          T('conv-unit', '단위분수가 여러 개인 수를 대분수로 나타내기', '①72 ②? ③41 심52', (d) => {
            const [w, n, den] = mixedOf(d), k = w * den + n;
            return M(`${frac(1, den)}이 ${k}개인 수를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, labelled([w, n]), {
              figure: mixed(box(LABELS[0]), box(LABELS[1]), den), explain: `${frac(1, den)}이 ${k}개인 수는 ${frac(k, den)}이다. ${k} ÷ ${den} = ${w} … ${n}이므로 ${mixed(w, n, den)}이다.`,
              facts: { calc: [[`(${k}-${k}%${den})/${den}`, 0], [`${k}%${den}`, 1]] }
            });
          }),
          T('conv-line', '수직선의 수를 대분수로 나타내기', '①53 ③73 심51', (d) => {
            const den = d.int(3, 5), at = d.until(() => d.int(den + 1, den * 3 - 1), (v) => v % den !== 0);
            return M('화살표가 가리키는 수를 대분수로 나타낼 때, ㉠, ㉡에 알맞은 수는?', labelled([Math.floor(at / den), at % den]), {
              figure: partLine(3, den, at) + mixed(box(LABELS[0]), box(LABELS[1]), den), explain: `작은 눈금 한 칸은 ${frac(1, den)}이다. 화살표는 ${Math.floor(at / den)}에서 ${at % den}칸 더 간 곳이므로 ${mixed(Math.floor(at / den), at % den, den)}이다.`,
              facts: { calc: [[`(${at}-${at}%${den})/${den}`, 0], [`${at}%${den}`, 1]] }
            });
          })
        ]
      },
      {
        id: 'comp', title: '분모가 같은 분수의 크기 비교', standard: COMP,
        types: [
          T('comp-improper', '가분수끼리 비교하기', '①79 ②64 ③94 심63', (d) => {
            const [a, b, den] = d.until(() => [d.int(6, 19), d.int(6, 19), d.int(4, 9)], ([x, y, z]) => x > z && y > z && x !== y);
            return C('두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(a, b), {
              figure: versus(frac(a, den), frac(b, den)), explain: `분모가 같은 가분수는 분자가 클수록 크다.`, facts: { choose: { exprs: [`${a}/${den}`, `${b}/${den}`], rule: 'compare' } }
            });
          }),
          T('comp-mixed', '대분수끼리 비교하기', '①80 ②65 ③95·96 심63', (d) => {
            // 자연수 부분이 작은 쪽의 분자가 더 크다
            const [w, a, b, den] = d.until(() => [d.int(1, 4), d.int(1, 8), d.int(1, 8), d.int(4, 9)], ([x, p, q, z]) => p < z && q < z && p > q), flip = d.bool();
            const left = flip ? [w + 1, b] : [w, a], right = flip ? [w, a] : [w + 1, b];
            return C('두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(left[0], right[0]), {
              figure: versus(mixed(left[0], left[1], den), mixed(right[0], right[1], den)), explain: '대분수는 자연수 부분이 클수록 크다. 자연수 부분이 같을 때에는 분자가 클수록 크다.',
              facts: { choose: { exprs: [`(${left[0]}*${den}+${left[1]})/${den}`, `(${right[0]}*${den}+${right[1]})/${den}`], rule: 'compare' } }
            });
          }),
          T('comp-both', '대분수와 가분수 비교하기', '①81 ②66 ③97 심63', (d) => {
            const [w, n, den] = mixedOf(d, (x, y, z) => z >= 4), top = w * den + n + d.pick([-2, -1, 0, 1, 2]);
            return C('두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(w * den + n, top), {
              figure: versus(mixed(w, n, den), frac(top, den)), explain: `${mj(w, n, den, '을/를')} 가분수로 나타내면 ${frac(w * den + n, den)}이다. 분자의 크기를 비교한다.`,
              facts: { choose: { exprs: [`(${w}*${den}+${n})/${den}`, `${top}/${den}`], rule: 'compare' } }
            });
          }),
          T('comp-natural', '가분수와 자연수 비교하기', '①82 ③103', (d) => {
            const w = d.int(2, 5), den = d.int(3, 8), top = w * den + d.pick([-3, -2, -1, 1, 2, 3]);
            return C('두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(top, w * den), {
              figure: versus(frac(top, den), String(w)), explain: `${w}는 ${frac(w * den, den)}과 같다. 분자의 크기를 비교한다.`.replace(`${w}는`, josa(w, '은/는')), facts: { choose: { exprs: [`${top}/${den}`, String(w)], rule: 'compare' } }
            });
          }),
          T('comp-max', '가장 큰 분수 찾기', '①86 ②68 ③100 심65', (d) => {
            const den = d.int(4, 8), tops = d.until(() => [d.int(den + 1, den * 4 - 1), d.int(den + 1, den * 4 - 1), d.int(den + 1, den * 4 - 1)], (x) => new Set(x).size === 3 && x.every((v) => v % den !== 0) && Math.max(...x) - Math.min(...x) <= den + 2);
            const asMixed = d.shuffle([true, true, false]), html = tops.map((top, i) => (asMixed[i] ? mixed(Math.floor(top / den), top % den, den) : frac(top, den)));
            return C('가장 큰 수는?', html, tops.indexOf(Math.max(...tops)), {
              explain: `모두 가분수로 나타내면 ${tops.map((top) => frac(top, den)).join(', ')}이다. 분자가 가장 큰 수가 가장 크다.`,
              facts: { choose: { exprs: tops.map((top, i) => (asMixed[i] ? `(${Math.floor(top / den)}*${den}+${top % den})/${den}` : `${top}/${den}`)), rule: 'max' } }
            });
          }),
          T('comp-word', '문장제: 더 긴 것 찾기', '①88 ②70 ③104·105 심67', (d) => {
            const who = d.shuffle(NAMES).slice(0, 3), den = d.int(4, 8), tops = d.until(() => [d.int(den + 1, den * 3 - 1), d.int(den + 1, den * 3 - 1), d.int(den + 1, den * 3 - 1)], (x) => new Set(x).size === 3 && x.every((v) => v % den !== 0));
            const asMixed = d.shuffle([true, false, true]), html = tops.map((top, i) => (asMixed[i] ? mixed(Math.floor(top / den), top % den, den) : frac(top, den)));
            return C(`세 사람이 가진 끈의 길이는 ${who.map((w, i) => `${name(w, '이/가')} ${html[i]} m`).join(', ')}이다. 가장 긴 끈을 가진 사람은?`, who, tops.indexOf(Math.max(...tops)), {
              explain: `모두 가분수로 나타내면 ${tops.map((top) => frac(top, den)).join(', ')}이다. 분자가 가장 큰 ${name(who[tops.indexOf(Math.max(...tops))], '이/가')} 가장 긴 끈을 가졌다.`,
              facts: { choose: { exprs: tops.map((top, i) => (asMixed[i] ? `(${Math.floor(top / den)}*${den}+${top % den})/${den}` : `${top}/${den}`)), rule: 'max' } }
            });
          }),
          T('comp-between', '두 분수 사이에 있는 분수 찾기', '①89 ②? ③106 심68', (d) => {
            // 아래쪽은 대분수, 위쪽은 가분수로 준다. 사이에 있는 것은 하나뿐이다.
            const den = d.int(4, 7), low = d.int(1, 2) * den + d.int(2, den - 2), high = low + 3;
            const inside = (low + 1) % den === 0 ? low + 2 : (low + 2) % den === 0 ? low + 1 : low + d.int(1, 2);
            const tops = d.shuffle([inside, low - 1, high, high + 1]), show = (top, i) => (i % 2 === 0 && top % den !== 0 ? mixed(Math.floor(top / den), top % den, den) : frac(top, den));
            return C(`${mixed(Math.floor(low / den), low % den, den)}보다 크고 ${frac(high, den)}보다 작은 분수는?`, tops.map(show), tops.indexOf(inside), {
              explain: `${mj(Math.floor(low / den), low % den, den, '은/는')} ${frac(low, den)}이다. 분자가 ${low}보다 크고 ${high}보다 작은 분수를 찾는다.`,
              facts: { between: { low: `${low}/${den}`, high: `${high}/${den}`, exprs: tops.map((top) => `${top}/${den}`) } }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
