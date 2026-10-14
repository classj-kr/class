// 3학년 1학기 6단원 분수와 소수 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록 넷(기본꼴 1~3, 심화꼴)과 덧문서를 처음부터 끝까지 다시 읽고, 3-1-6a.js·3-1-6b.js 의 유형이 묻지 않는 꼴을 옮겼다.
// 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다. ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번, 「덧」은 덧문서이다.
//
// 분수는 모두 1보다 작은 분수(분모가 같은 분수·단위분수끼리만 견준다)이고 소수는 소수 첫째 자리까지다.
// 남은 양은 식(1 − 3/8)이 아니라 조각 수를 세어 구하게 글에 「똑같이 □조각」을 밝혀 두었다.
//
// 뺀 것과 까닭
//  - 뒤 학기·위 학년: 묶음(이산량)의 분수·양의 분수만큼(③23 ③24 심18 심19 — 3학년 2학기), 분수의 2배(심34·덧),
//    분모가 10이 아닌 분수를 소수로(③52 — 크기가 같은 분수), m를 km 소수로(②74 심63), 소수로 적힌 변의 길이 더하기·네 변의 길이의 합(③48의 일부 심57)
//  - 조건 풀이·경우 따지기: 분모와 분자의 합·차로 찾는 단위분수(①27 ②24 ③20 심25), 짝수 조건을 덧댄 분수(②31 심33), 수 카드로 만들 수 있는 수를 모두 늘어놓기
//    (②40 ③32 ③60 심68 심69·덧 — ③32는 7/1 같은 가분수도 걸린다), 두 조건 묶음의 개수 견주기(심41), 접은 횟수로 조각 수(①21 심5), 하루 중 시간(심17),
//    사람 수 세기 함정(①70), 값 구하기(③53)
//  - 뜻 없는 셈: 빈칸에 들어갈 수끼리 더하기(①25 ②48 심52·덧, ②23·②54·③41의 묶은 꼴), 단위분수 칸을 칠해 분수 만들기(①28)
//  - 그리기·색칠·서술형·놀이·되짚기: ①4 ①6 ①11 ①12 ①18 ①22 ①46 ①66 ②4 ②6 ②12 ②18 ②20 ②21 ②25 ②45 ③3 ③5 ③10 ③25 ③40 ③67~70 심3 심4 심10 심46
//    (까닭 쓰기 가운데 「똑같이 나누지 않은 도형」은 고르는 꼴 h-uneven-say 로 실었다)
//  - 묻는 틀만 다른 것(잇기, 모두 고르기, 방향만 뒤집은 것)은 이미 있는 유형과 같은 문제로 보아 싣지 않았다.
// 그림이 없어 미룬 것: 10칸 눈금이 그려진 컵·물병(①48 ②44 심50), 눈금마다 분수·소수를 적고 군데군데 비운 수직선(①47 ③38 — 화살표 하나짜리로만 실음).
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, frac, expr, lines, tagged, cards, numbers, table, pieces, squares, tenthLine, N, M, C, F, D } = B.kit;
  const G = B.kit.geo;
  const WHOLE = '4수01-09', UNITFRAC = '4수01-10', FCOMPARE = '4수01-11', DECIMAL = '4수01-12', DCOMPARE = '4수01-14';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 기본 자료에만 나오지만 뜻을 정확히 알아야 맞는 고르기 문항
  const HB = (id, title, ref, make, more) => T(id, title, ref, make, Object.assign({ level: '실력' }, more || {}));
  const SIGNS = ['&gt;', '=', '&lt;'];
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // 토씨: 분수는 분자를 마지막에 읽고(8분의 3), 소수는 끝자리 숫자를 마지막에 읽는다.
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (k, n, pair) => frac(k, n) + tail(k, pair);
  const dj = (text, pair) => text + tail(Number(String(text).slice(-1)), pair);
  const deci = (x) => `${Math.floor(x / 10)}.${x % 10}`;
  const kindOf = (d) => d.pick(['bar', 'circle']);
  const sign = (more) => `<i>${more ? '&gt;' : '&lt;'}</i>`;
  // 작은 정사각형 count 개를 한 줄에 셋씩 이어 붙인 모양
  const shape = (count) => Array.from({ length: count }, (_, i) => (count <= 3 ? [i, 0] : [i % 3, Math.floor(i / 3)]));

  // ── 똑같이 나누기 ───────────────────────────────────────────────
  B.addTypes('3-1-6', 'equal', [
    T('equal-not', '똑같이 나누지 않은 도형 고르기', '①1 ②1 ③1 심1', (d) => {
      // 조각 수가 저마다 다른 도형 넷 가운데 하나만 크기가 다르게 나누었다.
      const ns = d.shuffle([2, 3, 4, 5, 6, 8]).slice(0, 4), bad = d.int(0, 3), kinds = ns.map(() => kindOf(d));
      return C('똑같이 나누지 않은 도형은?', LABELS, bad, {
        figure: G.tiles(ns.map((n, i) => [LABELS[i], pieces(kinds[i], n, { uneven: i === bad, scale: 1.25 })])),
        explain: `${LABELS[bad]}의 조각은 크기가 서로 다르다. 나머지 도형은 조각의 모양과 크기가 모두 같다.`,
        facts: { truth: ns.map((_, i) => i !== bad), want: false }
      });
    }),
    T('equal-odd', '조각의 수가 다른 도형 고르기', '②3', (d) => {
      // 모양이 달라도 똑같이 나눈 조각의 수는 같을 수 있다: 모눈 꼴·원 꼴·띠 꼴
      const n = d.pick([4, 6, 8]), m = d.until(() => n + d.pick([-2, -1, 1, 2]), (v) => v >= 3 && v <= 9);
      const rows = d.shuffle([[n, 'grid'], [n, 'circle'], [m, kindOf(d)]]);
      return C('똑같이 나눈 조각의 수가 나머지와 다른 도형은?', LABELS.slice(0, 3), rows.findIndex(([count]) => count !== n), {
        figure: G.tiles(rows.map(([count, kind], i) => [LABELS[i], pieces(kind, count, kind === 'grid' ? { cols: count / 2, scale: 1.25 } : { scale: 1.25 })])),
        explain: rows.map(([count], i) => `${LABELS[i]} ${count}조각`).join(', ') + '으로 나누었다.',
        facts: { tileOdd: rows.map(([count]) => [count, 0]) }
      });
    }),
    T('equal-line', '똑같이 둘로 나누지 못하는 선', '①5 ②5 ③4 심1', (d) => {
      // 가로 4칸, 세로 2칸인 직사각형. 한가운데 (2, 1)을 지나는 선은 똑같이 둘로 나누고(비스듬한 선도), 한가운데를 비켜난 선은 그러지 못한다.
      const W = 4, TALL = 2, rect = [[0, 0], [W, 0], [W, TALL], [0, TALL]];
      const good = d.shuffle([[[2, 0], [2, 2]], [[0, 1], [4, 1]], [[0, 0], [4, 2]], [[0, 2], [4, 0]], [[1, 0], [3, 2]], [[3, 0], [1, 2]]]).slice(0, 3);
      const bad = d.pick([[[1, 0], [1, 2]], [[3, 0], [3, 2]], [[0, 0], [3, 2]], [[1, 0], [4, 2]], [[0, 2], [3, 0]], [[1, 0], [2, 2]]]);
      const rows = d.shuffle(good.concat([bad])), through = ([p, q]) => p[0] + q[0] === W && p[1] + q[1] === TALL, at = rows.findIndex((row) => !through(row));
      return C('점선을 따라 자를 때, 똑같이 둘로 나누어지지 않는 도형은?', LABELS, at, {
        figure: G.tiles(rows.map(([p, q], i) => [LABELS[i], G.board(W, TALL, [G.polygon(rect, 'mb-poly is-plain'), G.line(p, q, 'mb-line is-cut')], { grid: 'lines', label: '모눈 위의 직사각형과 자르는 점선' })])),
        explain: `${LABELS[at]}의 두 조각은 크기가 서로 다르다. 나머지는 두 조각의 모양과 크기가 같아서 포개면 완전히 겹친다.`,
        facts: { truth: rows.map(through), want: false }
      });
    }),
    T('equal-say', '똑같이 나눈 조각에 대한 설명', '③4', (d) => {
      const n = d.int(3, 8), miss = d.pick([n - 1, n + 1]);
      const rows = d.shuffle([['조각을 포개면 완전히 겹친다.', true], ['조각의 모양은 같지만 크기는 서로 다르다.', false], ['조각의 크기는 같지만 모양은 서로 다르다.', false], [`조각은 모두 ${miss}개이다.`, false]]);
      return C('도형을 똑같이 나누었다. 나눈 조각에 대한 설명으로 옳은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        figure: pieces(kindOf(d), n, {}), explain: `똑같이 나눈 조각은 모양과 크기가 모두 같아서 포개면 완전히 겹친다. 조각은 모두 ${n}개이다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    })
  ]);

  // ── 분수 알기 ───────────────────────────────────────────────────
  B.addTypes('3-1-6', 'frac', [
    T('frac-say', '말로 나타낸 분수 쓰기', '①8 ③21', (d) => {
      const [k, n] = d.until(() => [d.int(2, 8), d.int(3, 9)], ([x, y]) => x < y && gcd(x, y) === 1);
      return F(`전체를 똑같이 ${josa(n, '으로/로')} 나눈 것 중의 ${josa(k, '을/를')} 분수로 나타내면 몇 분의 몇인가?`, k, n, {
        explain: `똑같이 나눈 수 ${josa(n, '을/를')} 분모에, 그중 부분의 수 ${josa(k, '을/를')} 분자에 적는다. ${fj(k, n, '이라고/라고')} 쓴다.`,
        facts: { calc: [[String(k), 0], [String(n), 1]] }
      });
    }),
    T('frac-top-pick', '그림에서 분모(분자)가 주어진 수인 것 찾기', '②13 ③13 심21', (d) => {
      // 분모가 5인 것: 5조각 중 2조각(답), 8조각 중 5조각(분자가 5 — 분모와 분자를 바꾸어 아는 아이가 고른다), 5가 없는 것 둘
      const t = d.int(3, 6), ask = d.pick(['분모', '분자']), k = d.int(1, t - 1), m = d.int(t + 1, 9);
      const others = d.until(() => [d.int(3, 9), d.int(3, 9)].map((a) => [a, d.int(1, a - 1)]), (list) => list.every(([a, b]) => a !== t && b !== t) && new Set(list.concat([[t, k], [m, t]]).map(String)).size === 4);
      const rows = d.shuffle([[t, k], [m, t]].concat(others)), kinds = rows.map(() => kindOf(d)), hit = ([a, b]) => (ask === '분모' ? a === t : b === t);
      return C(`색칠한 부분을 분수로 나타낼 때, ${ask}가 ${t}인 것은?`, LABELS, rows.findIndex(hit), {
        figure: G.tiles(rows.map(([a, b], i) => [LABELS[i], pieces(kinds[i], a, { shaded: b, scale: 1.25 })])),
        explain: rows.map(([a, b], i) => `${LABELS[i]} ${frac(b, a)}`).join(', ') + '이다. 분모는 전체를 똑같이 나눈 수이고 분자는 색칠한 부분의 수이다.',
        facts: { truth: rows.map(hit), want: true }
      });
    }, { standard: UNITFRAC }),
    T('frac-unshaded', '색칠하지 않은 부분을 분수로 나타내기', '①14 ②15 ③14 심6', (d) => {
      const [k, n] = d.until(() => [d.int(1, 7), d.int(4, 9)], ([x, y]) => x < y - 1 && gcd(y - x, y) === 1 && x !== y - x);
      return F('색칠하지 않은 부분은 전체의 몇 분의 몇인가?', n - k, n, {
        figure: pieces(kindOf(d), n, { shaded: k }), explain: `전체 ${n}조각 중에서 색칠하지 않은 조각은 ${n - k}조각이므로 ${frac(n - k, n)}이다.`,
        facts: { calc: [[`${n}-${k}`, 0], [String(n), 1]] }
      });
    }),
    T('frac-other-part', '한 부분의 분수로 나머지 부분의 분수 구하기', '①15 ②16 ③15·21', (d) => {
      // 도형의 2/9에 빨간색, 남은 부분에 파란색 → 파란색은 7/9. 칸을 세어 구하게 나눈 도형을 함께 보인다.
      const [k, n] = d.until(() => [d.int(2, 7), d.int(5, 9)], ([x, y]) => x < y - 1 && gcd(x, y) === 1 && x !== y - x);
      return F(`도형 전체의 ${frac(k, n)}에 빨간색을 칠하고, 남은 부분에는 모두 파란색을 칠하려고 한다. 파란색을 칠하는 부분은 전체의 몇 분의 몇인가?`, n - k, n, {
        figure: pieces('bar', n, {}), explain: `전체의 ${fj(k, n, '은/는')} ${n}칸 중의 ${k}칸이다. 남은 ${n - k}칸에 파란색을 칠하므로 ${frac(n - k, n)}이다.`,
        facts: { calc: [[`${n}-${k}`, 0], [String(n), 1]] }
      });
    }),
    T('frac-explain', '분수에 대한 설명 중 틀린 것', '①26 ②14 ③13 심7', (d) => {
      // 읽기·분모와 분자·단위분수의 개수 가운데 하나만 분모와 분자를 바꾸어 적는다.
      const [k, n] = d.until(() => [d.int(2, 7), d.int(3, 9)], ([x, y]) => x < y), slip = d.int(0, 2);
      const rows = d.shuffle([
        [slip === 0 ? `${k}분의 ${josa(n, '이라고/라고')} 읽는다.` : `${n}분의 ${josa(k, '이라고/라고')} 읽는다.`, slip !== 0],
        [slip === 1 ? `분모는 ${k}, 분자는 ${n}이다.` : `분모는 ${n}, 분자는 ${k}이다.`, slip !== 1],
        [slip === 2 ? `${frac(1, k)}이 ${n}개인 수이다.` : `${frac(1, n)}이 ${k}개인 수이다.`, slip !== 2],
        [`전체를 똑같이 ${josa(n, '으로/로')} 나눈 것 중의 ${k}이다.`, true]
      ]);
      return C(`${frac(k, n)}에 대한 설명으로 옳지 않은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        explain: `${fj(k, n, '은/는')} ${n}분의 ${josa(k, '이라고/라고')} 읽는다. 분모는 ${n}, 분자는 ${k}이고 ${frac(1, n)}이 ${k}개인 수이다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }, { standard: UNITFRAC }),
    T('frac-unit-make', '단위분수가 모인 수를 분수로 쓰기', '①24 ②23 ③19 심23 덧', (d) => {
      const [k, n] = d.until(() => [d.int(2, 9), d.int(4, 12)], ([x, y]) => x < y && gcd(x, y) === 1);
      return F(`${frac(1, n)}이 ${k}개인 수는 몇 분의 몇인가?`, k, n, {
        explain: `${frac(1, n)}이 ${k}개이면 ${frac(k, n)}이다. 분모는 그대로이고 분자는 모은 개수와 같다.`, facts: { calc: [[String(k), 0], [String(n), 1]] }
      });
    }, { standard: UNITFRAC }),
    T('frac-unit-whole', '단위분수인 한 조각으로 전체의 조각 수 알기', '①24 ②18·51 심23', (d) => {
      // 케이크 한 판은 1/8이 8개
      const n = d.int(4, 12);
      return N(`떡 한 판을 똑같이 나누었더니 한 조각이 한 판의 ${fj(1, n, '이/가')} 되었다. 떡 한 판을 모두 몇 조각으로 나누었는가?`, n, {
        unit: '조각', explain: `${fj(1, n, '은/는')} 전체를 똑같이 ${n}조각으로 나눈 것 중의 1조각이다. 떡 한 판은 ${frac(1, n)}이 ${n}개인 것과 같다.`,
        facts: { calc: [[String(n), 0]] }
      });
    }, { standard: UNITFRAC }),
    T('frac-ate', '문장제: 먹은 조각을 분수로', '①67 ②67 ③15 심15', (d) => {
      const [k, n] = d.until(() => [d.int(2, 9), d.int(5, 12)], ([x, y]) => x < y && gcd(x, y) === 1 && x !== y - x);
      return F(`김밥 한 줄을 똑같이 ${n}조각으로 썰어 그중 ${k}조각을 먹었다. 먹은 김밥은 전체의 몇 분의 몇인가?`, k, n, {
        explain: `전체 ${n}조각 중의 ${k}조각을 먹었으므로 ${frac(k, n)}이다.`, facts: { calc: [[String(k), 0], [String(n), 1]] }
      });
    }),
    T('frac-more-pieces', '문장제: 분수만큼 먹은 조각 수의 차', '①69', (d) => {
      // 피자 8조각, 3/8과 5/8 → 2조각 더
      const [one, two] = d.shuffle(NAMES).slice(0, 2), n = d.int(7, 12), [x, y] = d.until(() => [d.int(1, 5), d.int(2, 7)], ([p, q]) => q > p && p + q <= n);
      return N(`피자 한 판을 똑같이 ${n}조각으로 나누어 ${name(one, '은/는')} 전체의 ${frac(x, n)}만큼, ${name(two, '은/는')} 전체의 ${frac(y, n)}만큼 먹었다. ${name(two, '은/는')} ${nick(one)}보다 몇 조각 더 많이 먹었는가?`, y - x, {
        unit: '조각', explain: `${name(one, '은/는')} ${x}조각, ${name(two, '은/는')} ${y}조각을 먹었다. ${expr(y, '-', x, '=', y - x)}(조각)`, facts: { calc: [[`${y}-${x}`, 0]] }
      });
    }),
    T('frac-piece-of', '한 모양을 전체로 볼 때 다른 모양의 크기', '③17', (d) => {
      // 작은 정사각형 2개짜리(가)와 5개짜리(나) → 가는 나의 2/5
      const [k, n] = d.until(() => [d.int(1, 3), d.int(4, 9)], ([x, y]) => gcd(x, y) === 1);
      return F('작은 정사각형의 크기는 모두 같다. 나를 전체로 볼 때, 가는 전체의 몇 분의 몇인가?', k, n, {
        figure: G.tiles([['가', squares(shape(k), 1.4)], ['나', squares(shape(n), 1.4)]]),
        explain: `나는 작은 정사각형 ${n}개, 가는 작은 정사각형 ${k}개로 되어 있다. 가는 전체를 똑같이 ${josa(n, '으로/로')} 나눈 것 중의 ${k}이므로 ${frac(k, n)}이다.`,
        facts: { calc: [[String(k), 0], [String(n), 1]] }
      });
    })
  ]);

  // ── 분모가 같은 분수의 크기 비교 ─────────────────────────────────
  B.addTypes('3-1-6', 'same', [
    T('same-figure', '그림으로 두 분수의 크기 비교', '①29 ②26 ③26', (d) => {
      const n = d.int(5, 9), [a, b] = d.until(() => [d.int(1, n - 1), d.int(1, n - 1)], ([x, y]) => x !== y), top = Math.max(a, b);
      return C('가와 나에서 색칠한 부분을 각각 분수로 나타내어 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, a > b ? 0 : 2, {
        figure: G.tiles([['가', pieces('bar', n, { shaded: a, scale: 1.25 })], ['나', pieces('bar', n, { shaded: b, scale: 1.25 })]]) + versus('가', '나'),
        explain: `가는 ${frac(a, n)}, 나는 ${frac(b, n)}이다. 분모가 같으므로 분자가 큰 ${fj(top, n, '이/가')} 더 크다.`,
        facts: { choose: { exprs: [`${a}/${n}`, `${b}/${n}`], rule: 'compare' } }
      });
    }),
    T('same-count', '단위분수의 개수로 크기 비교', '①30 ②26 ③27 심26', (d) => {
      // 7/8은 1/8이 □개, 5/8는 1/8이 □개 ⇨ 더 큰 분수
      const n = d.int(6, 13), [a, b] = d.until(() => [d.int(2, n - 1), d.int(2, n - 1)], ([x, y]) => x !== y), top = Math.max(a, b);
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }, { label: LABELS[2], answer: top }], {
        figure: lines([`${fj(a, n, '은/는')} ${frac(1, n)}이 ${box(LABELS[0])}개인 수이다.`, `${fj(b, n, '은/는')} ${frac(1, n)}이 ${box(LABELS[1])}개인 수이다.`, `두 분수 중 더 큰 분수는 ${frac(box(LABELS[2]), n)}이다.`]),
        explain: `${fj(a, n, '은/는')} ${frac(1, n)}이 ${a}개, ${fj(b, n, '은/는')} ${frac(1, n)}이 ${b}개인 수이다. ${frac(1, n)}이 더 많은 ${fj(top, n, '이/가')} 더 크다.`,
        facts: { calc: [[String(a), 0], [String(b), 1], [String(top), 2]] }
      });
    }),
    T('same-than', '기준보다 큰(작은) 분수의 수', '①33 ③28', (d) => {
      // 5/18보다 작은 분수: 7/18 3/18 4/18 9/18 1/18 → 3개
      const n = d.int(11, 18), b = d.int(4, n - 4), big = d.bool(), fits = (k) => (big ? k > b : k < b);
      const ks = d.until(() => d.shuffle(Array.from({ length: n - 1 }, (_, i) => i + 1).filter((k) => k !== b)).slice(0, 5), (list) => { const hit = list.filter(fits).length; return hit >= 1 && hit <= 4; });
      const hit = ks.filter(fits);
      return N(`${frac(b, n)}보다 ${big ? '큰' : '작은'} 분수는 모두 몇 개인가?`, hit.length, {
        unit: '개', figure: numbers(ks.map((k) => frac(k, n))),
        explain: `분모가 같으므로 분자가 ${b}보다 ${big ? '큰' : '작은'} 분수를 찾는다. ${hit.map((k) => frac(k, n)).join(', ')}${tail(hit[hit.length - 1], '으로/로')} 모두 ${hit.length}개이다.`,
        facts: { choose: { exprs: ks.map((k) => `${k}/${n}`), rule: big ? 'countAbove' : 'countBelow', target: b / n } }
      });
    }),
    T('same-between', '두 분수 사이에 있는 분수의 수', '①34·35 ②30 심32', (d) => {
      // 분모가 11인 분수 중 4/11보다 크고 9/11보다 작은 분수 → 4개
      const n = d.int(8, 13), gap = d.int(3, 5), a = d.int(1, n - 1 - gap), b = a + gap;
      return N(`분모가 ${n}인 분수 중에서 ${frac(a, n)}보다 크고 ${frac(b, n)}보다 작은 분수는 모두 몇 개인가?`, gap - 1, {
        unit: '개', explain: `분모가 같으므로 분자가 ${a}보다 크고 ${b}보다 작은 분수를 찾는다. ${frac(a + 1, n)}부터 ${frac(b - 1, n)}까지 ${gap - 1}개이다.`,
        facts: { digit: { template: `${a}/${n}<□/${n}<${b}/${n}`, lo: 1, hi: n - 1, ask: 'count' } }
      });
    })
  ]);

  // ── 단위분수의 크기 비교 ─────────────────────────────────────────
  B.addTypes('3-1-6', 'unit', [
    T('unit-figure', '그림으로 단위분수의 크기 비교', '①37 ②32·41 ③33 심35', (d) => {
      // 같은 크기의 도형을 4, 5, 6조각으로 나누어 한 조각씩 색칠 → 가장 작은 것
      const ns = d.shuffle([2, 3, 4, 5, 6, 8]).slice(0, 3), big = d.bool(), kind = kindOf(d), best = big ? Math.min(...ns) : Math.max(...ns);
      return C(`크기가 같은 도형을 똑같이 나누어 한 조각씩 색칠했다. 색칠한 부분이 나타내는 분수가 가장 ${big ? '큰' : '작은'} 것은?`, LABELS.slice(0, 3), ns.indexOf(best), {
        figure: G.tiles(ns.map((n, i) => [LABELS[i], pieces(kind, n, { shaded: 1, scale: 1.25 })])),
        explain: ns.map((n, i) => `${LABELS[i]} ${frac(1, n)}`).join(', ') + `이다. 단위분수는 분모가 작을수록 크므로 가장 ${big ? '큰' : '작은'} 분수는 ${frac(1, best)}이다.`,
        facts: { choose: { exprs: ns.map((n) => `1/${n}`), rule: big ? 'max' : 'min' } }
      });
    }),
    T('unit-than', '기준보다 큰(작은) 단위분수의 수', '①39 ②35 ③34 심36', (d) => {
      // 1/9보다 큰 분수: 1/14 1/3 1/12 1/20 1/7 → 2개
      const b = d.int(5, 10), big = d.bool(), fits = (m) => (big ? m < b : m > b);
      const ms = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 20].filter((m) => m !== b)).slice(0, 5), (list) => { const hit = list.filter(fits).length; return hit >= 1 && hit <= 4; });
      const hit = ms.filter(fits);
      return N(`다음 단위분수 중에서 ${frac(1, b)}보다 ${big ? '큰' : '작은'} 것은 모두 몇 개인가?`, hit.length, {
        unit: '개', figure: numbers(ms.map((m) => frac(1, m))),
        explain: `단위분수는 분모가 작을수록 크다. 분모가 ${b}보다 ${big ? '작은' : '큰'} 분수는 ${hit.map((m) => frac(1, m)).join(', ')}${tail(1, '으로/로')} 모두 ${hit.length}개이다.`,
        facts: { choose: { exprs: ms.map((m) => `1/${m}`), rule: big ? 'countAbove' : 'countBelow', target: 1 / b } }
      });
    }),
    T('unit-signs', '잘못 비교한 식 고르기', '①40 ②38 심28', (d) => {
      // 단위분수끼리 둘, 분모가 같은 분수끼리 둘. 분모가 큰 쪽을 크다고 여기는 아이는 바르게 적은 단위분수 식을 틀렸다고 고른다.
      const [p, q, r, s] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]).slice(0, 4), m = d.int(6, 12), w = d.until(() => d.int(6, 13), (v) => v !== m);
      const [x, y] = d.until(() => [d.int(1, m - 1), d.int(1, m - 1)], ([e, f]) => e !== f), [u, v] = d.until(() => [d.int(1, w - 1), d.int(1, w - 1)], ([e, f]) => e !== f), slip = d.int(0, 3);
      const rows = d.shuffle([[[1, p], [1, q]], [[1, r], [1, s]], [[x, m], [y, m]], [[u, w], [v, w]]].map(([left, right], i) => {
        const more = left[0] * right[1] > right[0] * left[1];
        return { left, right, shown: (i === slip) !== more, more, ok: i !== slip };      // shown: 적힌 부등호가 > 인가
      }));
      const said = (row, more) => `<span class="mb-expr">${frac(row.left[0], row.left[1])} ${sign(more)} ${frac(row.right[0], row.right[1])}</span>`, wrong = rows.find((row) => !row.ok);
      return C('분수의 크기를 잘못 비교한 것은?', rows.map((row) => said(row, row.shown)), rows.indexOf(wrong), {
        explain: `단위분수는 분모가 작을수록 크고, 분모가 같은 분수는 분자가 클수록 크다. 바르게 비교하면 ${said(wrong, wrong.more)}이다.`,
        facts: { truth: rows.map((row) => row.ok), want: false, biggerClaims: rows.map((row, i) => { const l = row.left.join('/'), g = row.right.join('/'); return row.shown ? [l, g, i] : [g, l, i]; }) }
      });
    }),
    T('unit-cards-two', '수 카드 2장으로 가장 큰 단위분수 만들기', '①42 ②39 ③31 심38', (d) => {
      // 3, 9, 7, 1 → 1/3. 가장 작은 수 1은 분자에 써야 하므로 분모에는 남은 수 중 가장 작은 수가 온다.
      const rest = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), least = Math.min(...rest);
      return F('수 카드 4장 중에서 2장을 골라 한 번씩만 사용하여 만들 수 있는 가장 큰 단위분수는 몇 분의 몇인가?', 1, least, {
        figure: cards(d.shuffle([1].concat(rest))),
        explain: `단위분수는 분자가 1이므로 분자에 1을 놓는다. 단위분수는 분모가 작을수록 크므로 남은 수 중 가장 작은 수 ${josa(least, '을/를')} 분모에 놓는다.`,
        facts: { calc: [['1', 0], [String(least), 1]] }
      });
    })
  ]);

  // ── 소수 알기 ───────────────────────────────────────────────────
  B.addTypes('3-1-6', 'deci', [
    T('deci-pairs', '크기가 같은 분수와 소수의 짝', '②43 ③42·43 심47', (d) => {
      const [a, b, c, e] = d.shuffle([2, 3, 4, 6, 7, 8, 9]).slice(0, 4);
      const rows = d.shuffle([
        { text: `${fj(a, 10, '과/와')} 0.${a}`, expr: `${a}/10`, said: a / 10 },
        { text: `${fj(b, 10, '과/와')} ${b}.${b}`, expr: `${b}/10`, said: (b * 10 + b) / 10 },          // 분자를 자연수 부분에도 적는 아이
        { text: `${fj(c, 10, '과/와')} 0.${10 - c}`, expr: `${c}/10`, said: (10 - c) / 10 },             // 10에서 뺀 수를 적는 아이
        { text: `${fj(1, e, '과/와')} 0.${e}`, expr: `1/${e}`, said: e / 10 }                            // 분모를 소수점 아래에 적는 아이
      ]);
      return C('크기가 같은 수끼리 짝 지은 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.expr === `${a}/10`), {
        explain: `${fj(a, 10, '은/는')} 0.1이 ${a}개인 수이므로 0.${a}${tail(a, '과/와')} 크기가 같다.`,
        facts: { claimed: rows.map((row) => [row.expr, row.said]), claimedWant: true }
      });
    }),
    T('deci-card-tenth', '수 카드로 만든 가장 큰 분수를 소수로', '③31·37 덧', (d) => {
      const list = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), top = Math.max(...list);
      return D('수 카드 중에서 한 장을 골라 □ 안에 넣어 가장 큰 분수를 만들었다. 이 분수를 소수로 나타낸 수는?', top / 10, {
        figure: lines([cards(list), `<span class="mb-expr">${frac(box(), 10)}</span>`]),
        explain: `분모가 같은 분수는 분자가 클수록 크므로 가장 큰 수 ${josa(top, '을/를')} 넣는다. ${fj(top, 10, '은/는')} 소수로 0.${top}이다.`,
        facts: { calc: [[`${top}/10`, 0]] }
      });
    }),
    T('deci-line-not', '수직선의 수를 나타낸 것이 아닌 것', '①47 ②44 ③38 심49', (d) => {
      // 0과 1 사이에 그어진 눈금 9개를 세어 「9로 나눈 것」으로 여기는 아이가 k/9를 맞다고 본다.
      const k = d.pick([2, 3, 4, 6, 7, 8]);
      const rows = d.shuffle([[frac(k, 10), true], [`0.${k}`, true], [`0.1이 ${k}개인 수`, true], [frac(k, 9), false]]);
      return C('수직선에서 화살표가 가리키는 수를 나타낸 것이 아닌 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        figure: tenthLine(0, k), explain: `0과 1 사이를 똑같이 10칸으로 나누었으므로 작은 눈금 한 칸은 ${frac(1, 10)}이고 소수로 0.1이다. 화살표는 ${k}칸 간 곳이므로 ${frac(k, 10)}이고 소수로 0.${k}이다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('deci-shade-big', '색칠한 부분을 1보다 큰 소수로 나타내기', '①51 ②52 ③39', (d) => {
      // 열 칸짜리 띠 한두 개를 모두 칠하고 몇 칸을 더 칠했다.
      const w = d.int(1, 2), k = d.int(1, 9);
      return D('띠 한 개를 1로 볼 때, 색칠한 부분을 소수로 나타낸 수는?', (w * 10 + k) / 10, {
        figure: lines(Array.from({ length: w + 1 }, (_, i) => pieces('bar', 10, { shaded: i < w ? 10 : k, scale: 2 }))),
        explain: `띠 ${w}개를 모두 색칠하고 ${k}칸을 더 색칠하였다. ${josa(w, '과/와')} 0.${k}만큼이므로 ${w}.${k}이다.`,
        facts: { calc: [[`(${Array.from({ length: w }, () => 10).join('+')}+${k})/10`, 0]] }
      });
    }),
    T('deci-write', '읽은 말을 소수로 쓰기', '②47 ③44', (d) => {
      const W = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
      const [x, y] = d.until(() => [d.int(0, 9), d.int(1, 9)], ([p, q]) => p !== q);
      return D(`「${W[x]} 점 ${W[y]}」${josa(W[y], '이라고/라고').slice(1)} 읽는 소수는?`, (x * 10 + y) / 10, {
        explain: `소수점 앞에 ${josa(x, '을/를')} 쓰고 소수점을 찍은 뒤 ${josa(y, '을/를')} 쓴다. ${x}.${y}`,
        facts: { calc: [[`${x * 10 + y}/10`, 0]], unseen: [x * 10 + y, 10] }
      });
    }),
    T('deci-mm-back', 'mm를 분수 cm로, 소수 cm를 mm로', '②50 ③46 심51', (d) => {
      // 4 mm = □/10 cm, 8.2 cm = □ mm
      const m = d.int(2, 9), said = `${d.int(1, 9)}.${d.int(1, 9)}`, tenths = Number(said.replace('.', ''));
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: m }, { label: LABELS[1], answer: tenths }], {
        figure: lines([`${m} mm = ${frac(box(LABELS[0]), 10)} cm`, `${said} cm = ${box(LABELS[1])} mm`]),
        explain: `1 mm는 ${frac(1, 10)} cm이므로 ${m} mm는 ${frac(m, 10)} cm이다. ${said} cm는 0.1 cm가 ${tenths}개이므로 ${tenths} mm이다.`,
        facts: { calc: [[String(m), 0]], tenths: [[said, 1]] }
      });
    }),
    T('deci-mm-wrong', '길이를 잘못 나타낸 것 고르기', '①56 ②56 ③49 심55', (d) => {
      // 틀린 보기와 같은 꼴의 바른 보기를 하나씩 둔다: 세 자리 mm 가 틀리면 바른 세 자리 mm 를, cm·mm 가 틀리면 바른 cm·mm 를 함께 싣는다.
      const zero = d.bool(), [c, m] = [d.int(2, 9), d.int(1, 9)], k = d.int(2, 9), [h, u] = [d.int(1, 9), d.int(1, 9)];
      const v = zero ? d.until(() => d.int(111, 989), (x) => x % 10 !== 0 && Math.floor(x / 10) % 10 !== 0) : d.until(() => d.int(12, 98), (x) => x % 10 !== 0);
      const [c2, m2] = d.until(() => [d.int(2, 9), d.int(1, 9)], ([p, q]) => p !== q && !(p === c && q === m));
      const wrong = zero
        ? { text: `${h}0${u} mm는 ${h}.${u} cm이다.`, expr: `${h * 100 + u}/10`, said: (h * 10 + u) / 10 }                 // 가운데 0을 빼고 적는 아이
        : { text: `${c2} cm ${m2} mm는 ${m2}.${c2} cm이다.`, expr: `${c2 * 10 + m2}/10`, said: (m2 * 10 + c2) / 10 };      // cm와 mm의 자리를 바꾸어 적는 아이
      const rows = d.shuffle([
        { text: `${v} mm는 ${deci(v)} cm이다.`, expr: `${v}/10`, said: v / 10 },
        { text: `${c} cm ${m} mm는 ${c}.${m} cm이다.`, expr: `${c * 10 + m}/10`, said: (c * 10 + m) / 10 },
        { text: `0.${k} cm는 ${k} mm이다.`, expr: String(k), said: k },
        wrong
      ]);
      return C('길이를 잘못 나타낸 것은?', rows.map((row) => row.text), rows.indexOf(wrong), {
        explain: zero ? `${h}0${u} mm는 ${h}0 cm ${u} mm이므로 ${h}0.${u} cm이다.` : `${c2} cm ${m2} mm는 ${c2}.${m2} cm이다.`,
        facts: { claimed: rows.map((row) => [row.expr, row.said]), claimedWant: false }
      });
    }),
    T('deci-mm-word', '문장제: cm와 mm로 된 길이를 소수로', '③48', (d) => {
      const c = d.int(3, 15), m = d.int(1, 9);
      return D(`길이가 ${c} cm인 선분을 그은 뒤 ${m} mm를 더 이어 그었다. 선분의 길이를 소수로 나타내면 몇 cm인가?`, (c * 10 + m) / 10, {
        unit: 'cm', explain: `선분의 길이는 ${c} cm ${m} mm이다. 1 mm는 0.1 cm이므로 ${c}.${m} cm이다.`, facts: { calc: [[`${c}+${m}/10`, 0]], unseen: [10] }
      });
    }),
    T('deci-daily', '문장제: 1/10씩 여러 번 모은 양을 소수로', '①53·76 심58', (d) => {
      // 하루에 1/10 cm씩 21일 → 2.1 cm
      const n = d.until(() => d.int(12, 38), (v) => v % 10 !== 0);
      return D(`하루에 ${frac(1, 10)} cm씩 자라는 새싹이 있다. 이 새싹이 ${n}일 동안 자라는 길이를 소수로 나타내면 몇 cm인가?`, n / 10, {
        unit: 'cm', explain: `${frac(1, 10)} cm는 0.1 cm이다. 0.1 cm가 ${n}개이면 ${deci(n)} cm이다.`, facts: { calc: [[`${n}/10`, 0]] }
      });
    }),
    T('deci-two-ate', '문장제: 10조각 중 먹은 양을 각각 소수로', '②69 ③50 심71', (d) => {
      const [one, two] = d.shuffle(NAMES).slice(0, 2), [x, y] = d.until(() => [d.int(1, 7), d.int(1, 7)], ([p, q]) => p !== q && p + q <= 9);
      return M(`가래떡 한 줄을 똑같이 10조각으로 썰어 ${name(one, '은/는')} ${x}조각, ${name(two, '은/는')} ${y}조각을 먹었다. 두 사람이 먹은 가래떡은 각각 전체의 얼마인지 소수로 나타낸 수는?`, [{ label: one, answer: x / 10, decimal: true }, { label: two, answer: y / 10, decimal: true }], {
        explain: `전체 10조각 중의 ${x}조각은 ${frac(x, 10)}이고 소수로 0.${x}이다. ${y}조각은 ${frac(y, 10)}이고 소수로 0.${y}이다.`,
        facts: { calc: [[`${x}/10`, 0], [`${y}/10`, 1]] }
      });
    })
  ]);

  // ── 소수의 크기 비교 ─────────────────────────────────────────────
  B.addTypes('3-1-6', 'dcomp', [
    T('dcomp-lines', '수직선에 나타낸 두 소수의 크기 비교', '①57 ②58 ③54 심49', (d) => {
      // 수직선이 서로 다르면 화살표가 오른쪽에 있다고 큰 수가 아니다: 자연수 부분이 큰 쪽의 화살표를 더 왼쪽에 둔다.
      const same = d.bool(), f1 = d.int(0, 4), f2 = same ? f1 : d.until(() => d.int(0, 4), (v) => v !== f1);
      const [k1, k2] = d.until(() => [d.int(1, 9), d.int(1, 9)], ([p, q]) => p !== q && (same || (f1 > f2) === (p < q)));
      const x = f1 * 10 + k1, y = f2 * 10 + k2;
      return C('㉠과 ㉡에서 화살표가 가리키는 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : 2, {
        figure: G.tiles([[LABELS[0], tenthLine(f1, k1)], [LABELS[1], tenthLine(f2, k2)]]) + versus(LABELS[0], LABELS[1]),
        explain: `㉠은 ${deci(x)}, ㉡은 ${dj(deci(y), '을/를')} 가리킨다. ${same ? '자연수 부분이 같으므로 소수 부분이 큰 수가 더 크다.' : '자연수 부분이 큰 수가 더 크다.'}`,
        facts: { choose: { exprs: [`${f1}+${k1}/10`, `${f2}+${k2}/10`], rule: 'compare' } }
      });
    }),
    T('dcomp-mixed', '여러 가지로 나타낸 수의 크기 비교', '①62 ②55·61 ③57 심60 덧', (d) => {
      // ㉠ 4와 0.7만큼인 수 ㉡ 0.1이 43개인 수 ㉢ 1이 4개, 0.1이 5개인 수
      const base = d.int(2, 8) * 10, big = d.bool();
      const vs = d.until(() => [base + d.int(-9, 9), base + d.int(-9, 9), base + d.int(-9, 9)], (list) => new Set(list).size === 3 && list.every((v) => v % 10 !== 0));
      const forms = d.shuffle([
        (v) => [`${josa(Math.floor(v / 10), '과/와')} 0.${v % 10}만큼인 수`, `${Math.floor(v / 10)}+0.${v % 10}`],
        (v) => [`0.1이 ${v}개인 수`, `${v}/10`],
        (v) => [`1이 ${Math.floor(v / 10)}개, 0.1이 ${v % 10}개인 수`, `${Math.floor(v / 10)}+${v % 10}/10`]
      ]);
      const rows = vs.map((v, i) => forms[i](v)), best = big ? Math.max(...vs) : Math.min(...vs);
      return C(`가장 ${big ? '큰' : '작은'} 수는?`, LABELS.slice(0, 3), vs.indexOf(best), {
        figure: tagged(rows.map(([text]) => text)),
        explain: `소수로 나타내면 ${vs.map((v, i) => `${LABELS[i]} ${deci(v)}`).join(', ')}이다. 자연수 부분이 큰 수가 더 크고, 자연수 부분이 같으면 소수 부분이 큰 수가 더 크다.`,
        facts: { choose: { exprs: rows.map(([, text]) => text), rule: big ? 'max' : 'min' }, unseen: [10] }
      });
    }),
    T('dcomp-forms', '0.1의 개수·분수·그림으로 나타낸 수의 크기 비교', '③57 덧', (d) => {
      // 민지: 0.1이 6개인 수, 승기: 8/10, 현수: 색칠한 그림
      const who = d.shuffle(NAMES).slice(0, 3), vals = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), big = d.bool(), best = big ? Math.max(...vals) : Math.min(...vals);
      return C(`세 사람이 생각한 수이다. 가장 ${big ? '큰' : '작은'} 수를 생각한 사람은?`, who, vals.indexOf(best), {
        figure: lines([`${who[0]}: 0.1이 ${vals[0]}개인 수`, `${who[1]}: ${frac(vals[1], 10)}`, `${who[2]}: 전체를 1로 볼 때 색칠한 부분이 나타내는 수`]) + pieces('bar', 10, { shaded: vals[2], scale: 2 }),
        explain: `소수로 나타내면 ${who.map((w, i) => `${w} 0.${vals[i]}`).join(', ')}이다.`,
        facts: { choose: { exprs: vals.map((v) => `${v}/10`), rule: big ? 'max' : 'min' } }
      });
    }),
    T('dcomp-than', '문장제: 기준보다 긴 것의 수', '①61 ②60 ③56 심64 덧', (d) => {
      // 2.5 m 줄자로 한 번에 잴 수 없는 것
      const t = d.int(1, 3) * 10 + 5, things = d.shuffle(['빨간색 끈', '파란색 끈', '노란색 끈', '초록색 끈', '보라색 끈']).slice(0, 4);
      const ls = d.until(() => things.map(() => d.int(8, 49)), (list) => { const over = list.filter((v) => v > t).length; return new Set(list).size === 4 && list.every((v) => v % 10 !== 0 && v !== t) && over >= 1 && over <= 3 && list.some((v) => Math.floor(v / 10) === Math.floor(t / 10)); });
      const over = things.filter((_, i) => ls[i] > t);
      return N(`길이가 ${deci(t)} m인 줄자가 있다. 표의 끈 가운데 줄자로 한 번에 길이를 잴 수 없는 것은 모두 몇 개인가?`, over.length, {
        unit: '개', figure: table(['끈', '길이'], things.map((thing, i) => [thing, `${deci(ls[i])} m`])),
        explain: `줄자보다 긴 끈은 한 번에 잴 수 없다. ${deci(t)} m보다 긴 것은 ${over.join(', ')}으로 모두 ${over.length}개이다.`,
        facts: { choose: { exprs: ls.map(deci), rule: 'countAbove', target: t / 10 } }
      });
    }),
    T('dcomp-race', '문장제: 기록이 가장 빠른 사람', '①77 ②71 ③64 심61', (d) => {
      // 달리기 기록은 수가 작을수록 빠르다.
      const who = d.shuffle(NAMES).slice(0, 3);
      const ts = d.until(() => [d.int(82, 108), d.int(82, 108), d.int(82, 108)], (list) => new Set(list).size === 3 && list.every((v) => v % 10 !== 0) && new Set(list.map((v) => Math.floor(v / 10))).size === 2);
      return C(`50 m 달리기 기록이 ${name(who[0], '은/는')} ${deci(ts[0])}초, ${name(who[1], '은/는')} ${deci(ts[1])}초, ${name(who[2], '은/는')} ${deci(ts[2])}초이다. 가장 빨리 달린 사람은?`, who, ts.indexOf(Math.min(...ts)), {
        explain: `걸린 시간이 짧을수록 빨리 달린 것이다. 가장 작은 수는 ${deci(Math.min(...ts))}이다.`,
        facts: { choose: { exprs: ts.map(deci), rule: 'min' } }
      });
    }),
    T('dcomp-table', '표에서 가장 큰 소수 찾기', '②71 ③64 심61 덧', (d) => {
      const who = d.shuffle(NAMES).slice(0, 4);
      const vs = d.until(() => who.map(() => d.int(8, 19)), (list) => new Set(list).size === 4 && list.every((v) => v % 10 !== 0) && new Set(list.map((v) => Math.floor(v / 10))).size === 2);
      return C('제자리멀리뛰기 기록을 나타낸 표이다. 가장 멀리 뛴 사람은?', who, vs.indexOf(Math.max(...vs)), {
        figure: table(['이름', '기록'], who.map((w, i) => [w, `${deci(vs[i])} m`])),
        explain: `자연수 부분이 큰 수가 더 크고, 자연수 부분이 같으면 소수 부분이 큰 수가 더 크다. 가장 큰 수는 ${deci(Math.max(...vs))}이다.`,
        facts: { choose: { exprs: vs.map(deci), rule: 'max' } }
      });
    }),
    T('dcomp-units', 'mm와 cm로 나타낸 두 길이의 비교', '①78 ②73 ③65 심62', (d) => {
      // 17 mm ○ 2.8 cm
      const v = d.until(() => d.int(12, 97), (x) => x % 10 !== 0), w = d.until(() => v + d.int(-11, 11), (x) => x > 10 && x < 100 && x % 10 !== 0), flip = d.bool();
      const left = flip ? `${deci(w)} cm` : `${v} mm`, right = flip ? `${v} mm` : `${deci(w)} cm`, p = flip ? w : v, q = flip ? v : w;
      return C('두 길이를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, p > q ? 0 : p === q ? 1 : 2, {
        figure: versus(left, right), explain: `1 mm는 0.1 cm이므로 ${v} mm는 ${deci(v)} cm이다. ${deci(v)} cm와 ${deci(w)} cm를 비교한다.`,
        facts: { choose: { exprs: flip ? [deci(w), `${v}/10`] : [`${v}/10`, deci(w)], rule: 'compare' }, unseen: [10] }
      });
    })
  ]);

  // ── 실력 ────────────────────────────────────────────────────────
  B.addTypes('3-1-6', 'hard', [
    H('h-uneven-say', '똑같이 나누지 않은 도형의 한 조각', '①22 ②20 ③5·67 심4', (d) => {
      // 크기가 다르게 나눈 도형에서 가장 큰 조각 하나를 색칠해 보인다.
      const n = d.int(3, 5);
      const rows = d.shuffle([
        { text: `조각이 ${n}개이므로 색칠한 부분은 전체의 ${frac(1, n)}이다.`, ok: false },                                  // 조각의 수만 세는 아이
        { text: `색칠하지 않은 조각이 ${n - 1}개이므로 색칠한 부분은 전체의 ${frac(1, n - 1)}이다.`, ok: false },            // 색칠한 조각과 색칠하지 않은 조각끼리 견주는 아이
        { text: `색칠한 조각이 가장 크므로 색칠한 부분은 전체의 ${frac(n - 1, n)}이다.`, ok: false },                        // 넓어 보이는 만큼 큰 분수를 붙이는 아이
        { text: `조각의 크기가 서로 다르므로 색칠한 부분을 전체의 ${fj(1, n, '이라고/라고')} 할 수 없다.`, ok: true }
      ]);
      return C(`도형을 ${n}조각으로 나누어 한 조각을 색칠했다. 색칠한 부분에 대한 설명으로 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        figure: pieces(kindOf(d), n, { shaded: 1, uneven: true }),
        explain: `전체를 똑같이 나누었을 때에만 한 조각을 ${fj(1, n, '이라고/라고')} 할 수 있다. 이 도형은 조각의 크기가 서로 다르다.`,
        facts: { truth: rows.map((row) => row.ok), want: true }
      });
    }, { standard: WHOLE }),
    HB('h-figure-say', '색칠한 그림에 대한 설명 가리기', '①17 ②9 ③9', (d) => {
      // 색칠한 부분·색칠하지 않은 부분·「나눈 것 중의 몇」 가운데 하나만 바르게 적고, 나머지는 두 부분을 바꾸어 적는다.
      const [k, n] = d.until(() => [d.int(2, 6), d.int(5, 9)], ([x, y]) => x < y - 1 && x !== y - x), right = d.int(0, 2), low = Math.min(k, n - k), high = Math.max(k, n - k);
      const rows = d.shuffle([
        { text: `색칠한 부분은 전체의 ${frac(right === 0 ? k : n - k, n)}이다.`, ok: right === 0 },                                         // 틀린 꼴: 색칠하지 않은 조각을 세는 아이
        { text: `색칠하지 않은 부분은 전체의 ${frac(right === 1 ? n - k : k, n)}이다.`, ok: right === 1 },                                  // 틀린 꼴: 색칠한 조각을 세는 아이
        { text: `색칠한 부분은 전체를 똑같이 ${josa(n, '으로/로')} 나눈 것 중의 ${right === 2 ? k : n - k}이다.`, ok: right === 2 },
        { text: `색칠한 부분은 전체의 ${frac(low, high)}이다.`, ok: false }                                                                  // 색칠한 조각과 색칠하지 않은 조각끼리 견주는 아이
      ]);
      return C('그림에 대한 설명으로 옳은 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        figure: pieces(kindOf(d), n, { shaded: k }),
        explain: `전체를 똑같이 ${josa(n, '으로/로')} 나눈 것 중의 ${josa(k, '을/를')} 색칠하였다. 색칠한 부분은 전체의 ${frac(k, n)}, 색칠하지 않은 부분은 전체의 ${frac(n - k, n)}이다.`,
        facts: { truth: rows.map((row) => row.ok), want: true }
      });
    }, { standard: WHOLE }),
    H('h-whole-from-part', '단위분수가 아닌 부분으로 전체 찾기', '①19 ②19·25 심14', (d) => {
      // 정사각형 2개가 전체의 2/3 → 한 개가 1/3 → 전체는 3개. 2×3=6개(곱하는 아이), 2+3=5개(더하는 아이)를 보기에 넣는다.
      const [k, n] = d.pick([[2, 3], [2, 5], [3, 4], [3, 5]]), counts = d.shuffle([n, k * n, k + n, n + 1]);
      return C(`작은 정사각형 ${k}개로 된 모양이 전체의 ${frac(k, n)}일 때, 전체가 될 수 있는 모양은?`, LABELS, counts.indexOf(n), {
        figure: squares(shape(k), 1.4) + G.tiles(counts.map((count, i) => [LABELS[i], squares(shape(count), 1.4)])),
        explain: `${fj(k, n, '은/는')} ${frac(1, n)}이 ${k}개인 수이므로 작은 정사각형 한 개가 전체의 ${frac(1, n)}이다. 작은 정사각형 ${n}개로 된 모양이 전체이다.`,
        facts: { pick: { expr: `${k}/${k}*${n}`, options: counts } }
      });
    }, { standard: WHOLE }),
    H('h-two-fracs-rest', '두 분수만큼 쓰고 남은 부분', '①68 ③62 심15 덧', (d) => {
      // 16조각 가운데 4/16와 7/16 → 남은 5/16. 조각 수로 바꾸어 센다.
      const [n, a, b] = d.until(() => [d.int(8, 16), d.int(2, 7), d.int(2, 7)], ([t, x, y]) => x !== y && x + y < t && gcd(t - x - y, t) === 1);
      return F(`케이크 한 개를 똑같이 ${n}조각으로 나누어 전체의 ${frac(a, n)}에는 딸기를, 전체의 ${frac(b, n)}에는 귤을 올렸다. 아무것도 올리지 않은 부분은 전체의 몇 분의 몇인가?`, n - a - b, n, {
        explain: `딸기는 ${a}조각, 귤은 ${b}조각에 올렸다. 남은 조각은 ${n - a - b}조각이므로 전체의 ${frac(n - a - b, n)}이다.`,
        facts: { calc: [[`${n}-${a}-${b}`, 0], [String(n), 1]] }
      });
    }, { standard: WHOLE }),
    H('h-more-than', '더 많이 먹은 조각 수로 남은 양 구하기', '덧', (d) => {
      // 10조각 중 한 사람이 1조각, 다른 사람이 그보다 2조각 더 → 남은 6조각
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [n, x, y] = d.until(() => [d.int(8, 12), d.int(1, 3), d.int(1, 3)], ([t, p, q]) => t - 2 * p - q >= 1 && gcd(t - 2 * p - q, t) === 1), rest = n - 2 * x - y;
      return F(`롤케이크 한 줄을 똑같이 ${n}조각으로 잘라 ${name(one, '은/는')} ${x}조각을 먹고, ${name(two, '은/는')} ${nick(one)}보다 ${y}조각 더 많이 먹었다. 남은 롤케이크는 전체의 몇 분의 몇인가?`, rest, n, {
        explain: `${name(two, '은/는')} ${x + y}조각을 먹었다. 두 사람이 먹은 것은 모두 ${2 * x + y}조각이고 남은 것은 ${rest}조각이므로 전체의 ${frac(rest, n)}이다.`,
        facts: { calc: [[`${n}-${x}-(${x}+${y})`, 0], [String(n), 1]] }
      });
    }, { standard: WHOLE }),
    H('h-rest-vs', '칠하고 남은 부분과 넓이 비교', '②66 심30 덧', (d) => {
      // 분수가 적힌 쪽(노란색)을 그대로 고르는 아이가 있다. 남은 부분의 분수를 구해야 견줄 수 있다.
      const [k, n] = d.until(() => [d.int(2, 9), d.int(7, 12)], ([x, y]) => x < y - 1 && x !== y - x), more = k > n - k;
      return C(`도화지 전체의 ${frac(k, n)}에는 노란색을 칠하고, 남은 부분에는 모두 초록색을 칠했다. 더 넓게 칠한 색은?`, ['노란색', '초록색', '두 색을 칠한 넓이가 같다.'], more ? 0 : 1, {
        explain: `초록색을 칠한 부분은 전체의 ${frac(n - k, n)}이다. 분모가 같으므로 분자가 큰 ${fj(Math.max(k, n - k), n, '만큼/만큼')} 칠한 ${more ? '노란색' : '초록색'}이 더 넓다.`,
        facts: { choose: { exprs: [`${k}/${n}`, `(${n}-${k})/${n}`], rule: 'max' } }
      });
    }),
    H('h-unit-back', '모인 수에서 단위분수를 찾아 비교', '심24 덧', (d) => {
      // 7/9은 ㉠이 7개, 6/7은 ㉡이 6개 → ㉠ 1/9, ㉡ 1/7 → 더 큰 수는 1/7
      const [n, m] = d.until(() => [d.int(4, 12), d.int(4, 12)], ([x, y]) => x !== y), a = d.int(2, n - 1), b = d.int(2, m - 1), least = Math.min(n, m);
      return F(`${fj(a, n, '은/는')} ㉠이 ${a}개인 수이고, ${fj(b, m, '은/는')} ㉡이 ${b}개인 수이다. ㉠과 ㉡ 중 더 큰 수는 몇 분의 몇인가?`, 1, least, {
        explain: `㉠은 ${frac(1, n)}, ㉡은 ${frac(1, m)}이다. 단위분수는 분모가 작을수록 크므로 더 큰 수는 ${frac(1, least)}이다.`,
        facts: { calc: [['1', 0], [String(least), 1]], unseen: [1] }
      });
    }),
    H('h-left-most', '남은 양으로 가장 많이 마신 사람 찾기', '심43', (d) => {
      // 남은 양 1/5, 1/3, 1/7 → 가장 적게 남긴 사람이 가장 많이 마셨다. 가장 큰 단위분수를 고르는 아이는 가장 많이 남긴 사람을 답한다.
      const who = d.shuffle(NAMES).slice(0, 3), ns = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 3), most = Math.max(...ns);
      return C(`같은 크기의 컵에 가득 담긴 우유를 마시고 남은 양이 ${name(who[0], '은/는')} 한 컵의 ${frac(1, ns[0])}, ${name(who[1], '은/는')} ${frac(1, ns[1])}, ${name(who[2], '은/는')} ${frac(1, ns[2])}이다. 우유를 가장 많이 마신 사람은?`, who, ns.indexOf(most), {
        explain: `남은 양이 가장 적은 사람이 가장 많이 마셨다. 단위분수는 분모가 클수록 작으므로 ${frac(1, most)}만큼 남긴 사람이 가장 많이 마셨다.`,
        facts: { choose: { exprs: ns.map((n) => `1-1/${n}`), rule: 'max' } }
      });
    }),
    H('h-unit-cond', '분모 조건이 겹친 단위분수의 수', '②37 ③36 심40 덧', (d) => {
      // 1/9보다 큰 단위분수 중 분모가 6보다 큰 분수 → 1/7, 1/8. 「보다 큰」을 분모에도 그대로 옮기면 끝없이 많아진다.
      const a = d.int(7, 13), c = d.int(2, a - 3);
      return N(`${frac(1, a)}보다 큰 단위분수 중에서 분모가 ${c}보다 큰 분수는 모두 몇 개인가?`, a - c - 1, {
        unit: '개', explain: `${frac(1, a)}보다 큰 단위분수는 분모가 ${a}보다 작다. 분모가 ${c}보다 크고 ${a}보다 작은 수는 ${c + 1}부터 ${a - 1}까지 ${a - c - 1}개이다.`,
        facts: { unitBetween: [a, c] }
      });
    }),
    H('h-common-frac', '분자와 분모의 □에 공통으로 들어갈 수', '③29 심39', (d) => {
      // 3/10 < □/10 (분자는 클수록 크다), 1/□ > 1/8 (분모는 작을수록 크다)
      const n = d.int(10, 13), a = d.int(2, 5), m = d.int(a + 3, 9);
      return N('2부터 9까지의 수 중 두 식의 □ 안에 공통으로 들어갈 수 있는 수는 모두 몇 개인가?', m - a - 1, {
        unit: '개', figure: lines([`<span class="mb-expr">${frac(a, n)} ${sign(false)} ${frac(box(), n)}</span>`, `<span class="mb-expr">${frac(1, box())} ${sign(true)} ${frac(1, m)}</span>`]),
        explain: `첫째 식은 분모가 같으므로 □는 ${a}보다 크다. 둘째 식은 단위분수이므로 □는 ${m}보다 작다. ${a + 1}부터 ${m - 1}까지 ${m - a - 1}개이다.`,
        facts: { digitBoth: { templates: [`${a}/${n}<□/${n}`, `1/□>1/${m}`], lo: 2, hi: 9 } }
      });
    }),
    H('h-tenths-both', '0.1과 1/10을 함께 모은 수', '①53 심53', (d) => {
      // 0.1이 32개이고 1/10이 24개인 수 → 5.6
      const [a, b] = d.until(() => [d.int(11, 48), d.int(11, 48)], ([x, y]) => x !== y && (x + y) % 10 !== 0);
      return D(`0.1이 ${a}개이고 ${frac(1, 10)}이 ${b}개인 수를 소수로 나타낸 수는?`, (a + b) / 10, {
        explain: `${fj(1, 10, '은/는')} 0.1과 같다. 0.1이 모두 ${a + b}개이므로 ${deci(a + b)}이다.`, facts: { calc: [[`(${a}+${b})/10`, 0]] }
      });
    }, { standard: DECIMAL }),
    H('h-between-deci', '다르게 나타낸 두 수 사이의 소수', '③59 심65·70 덧', (d) => {
      // (0.1이 52개인 수) < 5.□ < (5와 0.9만큼인 수)
      const w = d.int(1, 8), [p, q] = d.until(() => [d.int(1, 6), d.int(4, 9)], ([x, y]) => y - x >= 3), lo = w * 10 + p;
      return N(`0.1이 ${lo}개인 수보다 크고 ${josa(w, '과/와')} 0.${q}만큼인 수보다 작은 소수 ${w}.□가 있다. 0부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?`, q - p - 1, {
        unit: '개', explain: `0.1이 ${lo}개인 수는 ${w}.${p}이고, ${josa(w, '과/와')} 0.${q}만큼인 수는 ${w}.${q}이다. □는 ${p}보다 크고 ${q}보다 작으므로 ${p + 1}부터 ${q - 1}까지 ${q - p - 1}개이다.`,
        facts: { digit: { template: `${lo}/10<${w}.□<${w}.${q}`, lo: 0, hi: 9, ask: 'count' } }
      });
    }, { standard: DCOMPARE }),
    H('h-mixed-rest', '분수만큼·소수만큼 쓰고 남은 양', '①75 심73', (d) => {
      // 10칸 가운데 3/10과 0.5 → 3칸과 5칸 → 남은 2칸은 0.2
      const [one, two] = d.shuffle(NAMES).slice(0, 2), [x, y] = d.until(() => [d.int(1, 6), d.int(1, 6)], ([p, q]) => p !== q && p + q <= 9), rest = 10 - x - y;
      return D(`색종이 한 장을 똑같이 10칸으로 나누어 ${name(one, '은/는')} 전체의 ${frac(x, 10)}만큼, ${name(two, '은/는')} 전체의 0.${y}만큼을 서로 겹치지 않게 색칠했다. 색칠하지 않은 부분은 전체의 얼마인지 소수로 나타낸 수는?`, rest / 10, {
        explain: `${fj(x, 10, '은/는')} ${x}칸, ${dj('0.' + y, '은/는')} ${y}칸이다. 색칠하지 않은 칸은 ${rest}칸이므로 0.${rest}이다.`,
        facts: { calc: [[`(10-${x}-${y})/10`, 0]] }
      });
    }, { standard: DECIMAL })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
