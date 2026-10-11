// 3학년 1학기 1단원 덧셈과 뺄셈 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록(기본꼴 통합 115꼴과 그 바탕인 기본꼴 1~3, 보충꼴 43꼴, 심화꼴 129꼴)과 덧문서 모음을 처음부터 끝까지 다시 읽고,
// 3-1-1a.js·3-1-1b.js 의 유형이 묻지 않는 꼴을 옮겼다. 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다.
// ref 의 「통n」은 기본꼴_통합의 n번(괄호 안 ①②③은 기본꼴_1·2·3의 번호), 「보n」은 보충꼴, 「심n」은 심화꼴의 n번, 「덧」은 덧문서_모음이다.
// (3-1-1a.js 에 적힌 번호는 통합 목록의 옛 번호이다. 지금 번호와의 짝은 채우기_대조표.md 에 적어 두었다.)
//
// 지난번에 「계산 한 번을 다르게 그려 놓았을 뿐」이라며 합쳤던 꼴 가운데 주는 것·묻는 것·계산 구조가 다른 것은 따로 실었다:
//   화살표 칸, 띠 그림의 전체, 표, 수 모형의 개수, 몇백과 나머지로 가르기, 줄마다 적는 뺄셈, 받아올림·받아내림이 겹친 빈 숫자,
//   □ 식의 자리(□+a=b, □-a=b), 어떤 수의 덧셈판·뺄셈판, 잘못 계산한 어떤 수의 세 갈래, 수 카드의 뺄셈판과 4장판.
//
// 뺀 것과 까닭
//  - 위 학년: 등호 양쪽 맞추기와 두 길의 거리가 같을 때 모르는 구간(통52 심39~41 심113 — 4학년 2학기 등식),
//    삼각형 세 변의 길이의 합(통101 심118 — 둘레), 약속셈(심44 심45)
//  - 조건 풀이·경우 따지기: 찢어진·얼룩진 카드(통50 통51 심66 심68 심69), 합과 차로 두 수 찾기(통55), 변 위 세 수의 합(통56),
//    합·차가 목표에 가장 가까운 두 수(통66 보36 심77), 자리 조건이 붙은 수 카드·둘째로 큰 수 만들기(통70 통71 심85~88),
//    세 수로 □+□-□ 가장 작게(통72), 조건으로 수 찾기(통73), 양쪽이 막힌 □·양쪽에 식이 있는 □(심50 심51 심55), 쉼터(심100), 열량 표에서 짝 찾기(보37)
//  - 뜻 없는 셈: 두 식의 결과끼리 다시 셈하기(통12 심20), 빈 숫자들의 합(통44의 변형, 심62 심63)
//  - 다른 꼴을 이어 붙였을 뿐: 고친 뒤 더하기(심7), 가려진 수를 찾은 뒤 더하기(심65), 어림으로 고른 식만 계산(통113의 변형)
//  - 서술형·문제 만들기·놀이: 통20 통34 통37 통38 통74 보5 보38~43 심10 심128, 덧문서의 풍선 놀이·문제 만들기
//  - 숫자·상황·부등호 방향만 다른 것은 이미 있는 유형과 같은 문제로 보았다(대조표에 번호마다 적음).
// 그림이 필요해 미룬 꼴: 두 도형이 겹친 곳의 수(통64의 변형, 심78), 과녁·물고기 점수 그림(통100), 길이가 적힌 띠 두 개를 나란히 놓은 그림(통93),
//   세 수와 + 둘이 놓인 그림(통10 — 원본 모양을 알 수 없음), 수직선에서 옮겨 가는 그림(통24 — 화살표 칸으로 바꾸어 실음)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { carryPlaces, borrowPlaces, plain, josa, name, nick, NAMES, LABELS, box, expr, column, columnSteps, chars, blocks, cards, chain, table, route, bar, shapes, lines, tagged, numbers, N, M, C, E, addPair, subPair, ADD, SUB, result, shown } = B.kit;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 기본 자료에만 나오지만 뜻을 정확히 알아야 하거나 두 번 넘게 계산해야 하는 꼴
  const HB = (id, title, ref, make, more) => T(id, title, ref, make, Object.assign({ level: '실력' }, more || {}));
  const three = (d, lo, hi) => d.until(() => d.int(lo, hi), plain);
  // 서로 gap 넘게 떨어진 세 자리 수 여러 개
  const apart = (d, howMany, lo, hi, gap) => d.until(() => Array.from({ length: howMany }, () => d.int(lo, hi)), (xs) => xs.every(plain) && xs.every((x, i) => xs.every((y, j) => i === j || Math.abs(x - y) >= gap)));
  const digits = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
  const calcFacts = (a, op, b) => ({ calc: [[E(a, op, b), 0]], pair: [a, op, b], rule: true });
  // 한 번 계산하는 문장제
  const word = (text, unit, a, op, b) => N(text, result(a, op, b), { unit, explain: shown(a, op, b), facts: calcFacts(a, op, b) });
  const toHundred = (n) => Math.round(n / 100) * 100;
  // 몇백에 가까운 세 자리 수(몇백에서 2~12 떨어진 수). 100은 아래로 내려가지 않는다.
  const nearTo = (d, h) => h * 100 + (h === 1 ? 1 : d.pick([-1, 1])) * d.int(2, 12);
  // 숫자 카드로 만드는 가장 큰 세 자리 수
  const biggest = (list) => { const s = list.slice().sort((p, q) => q - p); return s[0] * 100 + s[1] * 10 + s[2]; };
  // 자리마다 큰 숫자에서 작은 숫자를 뺀 값(받아내림을 모르는 아이의 답)
  const flipped = (x, y) => { const p = digits(x), q = digits(y); return Math.abs(p[0] - q[0]) * 100 + Math.abs(p[1] - q[1]) * 10 + Math.abs(p[2] - q[2]); };
  // 세로셈에서 줄마다 한 자리씩 숫자를 가린다. 자리마다 모르는 숫자가 하나뿐이라 답이 하나로 정해진다(합이 네 자리여도 천의 자리는 가리지 않는다).
  function hidden(d, a, op, b) {
    const rows = [chars(a), chars(b), chars(result(a, op, b))];
    const places = d.shuffle([0, 1, 2]);   // 줄마다 가릴 자리(0 = 일의 자리)
    const inputs = [], masks = [];
    places.forEach((place, row) => {
      const at = rows[row].length - 1 - place;
      inputs.push({ label: LABELS[row], answer: Number(rows[row][at]) });
      masks.push({ row, place });
      rows[row][at] = box(LABELS[row]);
    });
    return M('㉠, ㉡, ㉢에 알맞은 숫자는?', inputs, { figure: column(rows[0], op, rows[1], rows[2]), explain: shown(a, op, b), facts: { masks, pair: [a, op, b], rule: true } });
  }
  // 네 곳을 마름모로 놓은 길(위로 도는 길과 아래로 도는 길)
  const diamond = (places, labels) => route([[places[0], 0, 50], [places[1], 50, 0, false], [places[2], 50, 100], [places[3], 100, 50]],
    [[0, 1, labels[0]], [1, 3, labels[1]], [0, 2, labels[2], 10], [2, 3, labels[3], 10]], 70);

  // ── 받아올림이 없는 덧셈 ────────────────────────────────────────
  B.addTypes('3-1-1', 'add0', [
    T('add0-target', '계산 결과가 정해진 수인 식 찾기', '통35(③20)', (d) => {
      // 679인 것: 325+352, 125+543, 264+415. 세 식의 합은 일의 자리가 모두 같아서 끝자리만 보고는 고를 수 없다.
      const splits = (s) => { const out = []; for (let x = 101; x <= s - 101; x += 1) { const y = s - x; if (y <= 999 && plain(x) && plain(y) && x !== y && ADD.none(carryPlaces(x, y))) out.push([x, y]); } return out; };
      const made = d.until(() => {
        const first = addPair(d, ADD.none), target = first[0] + first[1];
        const sums = d.shuffle([-110, -100, -10, 10, 100, 110]).map((k) => target + k).filter((v) => v >= 240 && v <= 999 && splits(v).length > 0).slice(0, 2);
        return { target, rows: [first].concat(sums.map((v) => d.pick(splits(v)))) };
      }, (m) => m.rows.length === 3 && new Set([].concat(...m.rows)).size === 6);
      const rows = d.shuffle(made.rows), target = made.target;
      return C(`계산 결과가 ${target}인 식은?`, rows.map(([x, y]) => expr(x, '+', y)), rows.findIndex(([x, y]) => x + y === target), {
        explain: rows.map(([x, y]) => shown(x, '+', y)).join(', '),
        facts: { choose: { exprs: rows.map(([x, y]) => E(x, '+', y)), rule: 'equals', target } }
      });
    }),
    T('add0-arrow', '화살표를 따라 더하기', '통4(①6 ②7 ③23) 보9 심32', (d) => {
      const [a, b] = addPair(d, ADD.none);
      return N('빈칸에 알맞은 수는?', a + b, { figure: chain([a, '+' + b, box()]), explain: shown(a, '+', b), facts: calcFacts(a, '+', b) });
    }),
    T('add0-count', '두 수 모형을 모았을 때의 개수', '통23(①12)', (d) => {
      // 132+346: 백 모형 4개, 십 모형 7개, 일 모형 8개
      const [a, b] = addPair(d, (c, x, y) => ADD.none(c) && x < 500 && y < 500 && digits(x).every((v) => v >= 1) && digits(y).every((v) => v >= 1));
      const A = digits(a), Bd = digits(b);
      return M('두 수 모형을 모으면 백 모형, 십 모형, 일 모형은 각각 몇 개가 되는가?', ['백 모형', '십 모형', '일 모형'].map((label, i) => ({ label, answer: A[i] + Bd[i], unit: '개' })), {
        figure: blocks(a) + blocks(b),
        explain: `백 모형은 ${shown(A[0], '+', Bd[0])}(개), 십 모형은 ${shown(A[1], '+', Bd[1])}(개), 일 모형은 ${shown(A[2], '+', Bd[2])}(개)이다. 두 수의 합은 ${a + b}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [E(A[i], '+', Bd[i]), i]), pair: [a, '+', b], rule: true }
      });
    })
  ]);

  // ── 받아올림이 한 번 있는 덧셈 ──────────────────────────────────
  B.addTypes('3-1-1', 'add1', [
    T('add1-split2', '몇백과 남은 두 자리로 나누어 더하기', '통18(②20)', (d) => {
      // 563+128 → 500+100, 63+28
      const [a, b] = addPair(d, (c, x, y) => ADD.ones(c) && x % 100 >= 11 && y % 100 >= 11);
      const ah = Math.floor(a / 100) * 100, bh = Math.floor(b / 100) * 100, ar = a % 100, br = b % 100;
      return M(`${a} + ${josa(b, '을/를')} 몇백끼리, 남은 두 자리 수끼리 나누어 계산한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [ah + bh, ar + br, a + b].map((answer, i) => ({ label: LABELS[i], answer })), {
        figure: lines([expr(ah, '+', bh, '=', box(LABELS[0])), expr(ar, '+', br, '=', box(LABELS[1])), expr(a, '+', b, '=', box(LABELS[2]))]),
        explain: `몇백끼리 ${shown(ah, '+', bh)}, 남은 두 자리 수끼리 ${shown(ar, '+', br)}이다. 두 값을 더하면 ${shown(ah + bh, '+', ar + br)}이다.`,
        facts: { calc: [[E(ah, '+', bh), 0], [E(ar, '+', br), 1], [E(a, '+', b), 2]], pair: [a, '+', b], rule: true }
      });
    }),
    T('add1-jump', '몇백을 먼저 더하고 나머지를 더하기', '통24(②25)', (d) => {
      // 536+382: 536에서 300만큼 가고 82만큼 더 간다. 수직선에서 옮겨 가는 꼴을 화살표 칸으로 나타냈다.
      const [a, b] = addPair(d, (c, x, y) => ADD.once(c) && y % 100 >= 11);
      const bh = Math.floor(b / 100) * 100, br = b % 100;
      return M(`${a} + ${josa(b, '을/를')} 계산하려고 ${josa(b, '을/를')} ${josa(bh, '과/와')} ${josa(br, '으로/로')} 나누어 차례로 더한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a + bh }, { label: LABELS[1], answer: a + b }], {
        figure: chain([a, '+' + bh, box(LABELS[0]), '+' + br, box(LABELS[1])]), explain: `${shown(a, '+', bh)}, ${shown(a + bh, '+', br)}`,
        facts: { calc: [[E(a, '+', bh), 0], [`${a}+${bh}+${br}`, 1]], pair: [a, '+', b], rule: true }
      });
    }),
    T('add1-places2', '묶음의 수로 말한 두 수의 합', '통61(①53 ②47) 보12', (d) => {
      // ㉠ 100이 5개, 10이 8개, 1이 2개인 수 ㉡ 100이 2개, 10이 6개, 1이 9개인 수. 두 수를 모두 말로 준다(묶음이 열 개를 넘지 않는다).
      const [a, b] = addPair(d, (c, x, y) => ADD.once(c) && digits(x).every((v) => v >= 1) && digits(y).every((v) => v >= 1));
      const say = (n) => { const [h, t, o] = digits(n); return `100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수`; }, Bd = digits(b);
      return N('두 수 ㉠과 ㉡의 합은?', a + b, {
        figure: tagged([say(a), say(b)]), explain: `㉠은 ${a}, ㉡은 ${b}이다. ` + shown(a, '+', b),
        facts: { places: [digits(a), '+', b], calc: [[`${a}+(${Bd[0]}*100+${Bd[1]}*10+${Bd[2]})`, 0]], pair: [a, '+', b], rule: true }
      });
    }),
    T('add1-bar', '띠 그림에서 전체 구하기', '통9(②26) 보10', (d) => {
      const [a, b] = addPair(d, ADD.once);
      return N('띠 그림에서 전체를 나타내는 □ 안에 알맞은 수는?', a + b, {
        figure: bar('□', a, b, Math.min(0.7, Math.max(0.3, a / (a + b)))), explain: `두 부분을 더하면 전체이다. ${shown(a, '+', b)}`, facts: calcFacts(a, '+', b)
      });
    })
  ]);

  // ── 받아올림이 여러 번 있는 덧셈 ────────────────────────────────
  B.addTypes('3-1-1', 'add2', [
    T('add2-chain', '이어서 두 번 더하기', '통5(②9 ③27) 심33', (d) => {
      // 283 → +307 → +438
      const [a, b] = addPair(d, (k, x, y) => ADD.twice(k) && x + y <= 780 && plain(x + y) && (x + y) % 10 >= 2);
      const c = d.until(() => three(d, 120, 480), (v) => ADD.any(carryPlaces(a + b, v)));
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: a + b + c }], {
        figure: chain([a, '+' + b, box(LABELS[0]), '+' + c, box(LABELS[1])]), explain: `${shown(a, '+', b)}, ${shown(a + b, '+', c)}`,
        facts: { calc: [[E(a, '+', b), 0], [`${a}+${b}+${c}`, 1]] }
      });
    }),
    T('add2-maxsum', '합이 가장 큰 두 수 고르기', '통62(①60) 통68 심73 보21', (d) => {
      // 392, 546, 485, 217 → 546+485. 가장 큰 수와 둘째로 큰 수를 고른다.
      const list = d.until(() => apart(d, 4, 130, 890, 15), (xs) => { const s = xs.slice().sort((p, q) => q - p); return ADD.many(carryPlaces(s[0], s[1])); });
      const s = list.slice().sort((p, q) => q - p);
      return N('네 수 중 두 수를 골라 합이 가장 큰 덧셈식을 만들려고 한다. 이때의 합은?', s[0] + s[1], {
        figure: numbers(list), explain: `가장 큰 수 ${josa(s[0], '과/와')} 둘째로 큰 수 ${josa(s[1], '을/를')} 더한다. ${shown(s[0], '+', s[1])}`,
        facts: { pairs: { numbers: list, want: 'maxSum' }, pair: [s[0], '+', s[1]], rule: true }
      });
    }),
    T('add2-two-cards', '두 사람이 저마다 만든 가장 큰 수의 합', '통69(①58) 보24', (d) => {
      // 5·6·8 과 5·7·9 → 865+975
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const draw = () => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
      const [l1, l2] = d.until(() => [draw(), draw()], ([p, q]) => biggest(p) !== biggest(q) && ADD.many(carryPlaces(biggest(p), biggest(q))));
      const x = biggest(l1), y = biggest(l2);
      return N(`${name(one, '과/와')} ${name(two, '은/는')} 각자 가진 수 카드 3장을 한 번씩 모두 사용하여 가장 큰 세 자리 수를 만들었다. 두 사람이 만든 수의 합은?`, x + y, {
        figure: lines([`${one} ${cards(l1)}`, `${two} ${cards(l2)}`]),
        explain: `${name(one, '이/가')} 만든 수는 ${x}, ${name(two, '이/가')} 만든 수는 ${y}이다. ${shown(x, '+', y)}`,
        facts: { calc: [[E(x, '+', y), 0]], pair: [x, '+', y], rule: true }
      });
    }),
    T('add2-table', '표에서 한 줄의 합 구하기', '통95(①95 ②101)', (d) => {
      // 토요일 528·483, 일요일 402·396 → 세로줄의 합
      const [a, b, c, e] = d.until(() => apart(d, 4, 140, 680, 12), ([, q, , s]) => ADD.many(carryPlaces(q, s)));
      return N('어느 박물관에 이틀 동안 입장한 사람 수를 나타낸 표이다. 이틀 동안 입장한 어린이는 모두 몇 명인가?', b + e, {
        unit: '명', figure: table(['', '어른(명)', '어린이(명)'], [['토요일', a, b], ['일요일', c, e]]),
        explain: `어린이는 토요일에 ${b}명, 일요일에 ${e}명 입장하였다. ${shown(b, '+', e)}`, facts: { calc: [[E(b, '+', e), 0]], pair: [b, '+', e], rule: true }
      });
    }),
    T('add2-shorter', '두 길 중 더 짧은 길', '통99(②103) 심114 덧', (d) => {
      // 가 345+268=613, 나 349+269=618. 첫 구간이 긴 길이 꼭 더 긴 길은 아니게 한다.
      const twice = (k, x, y) => ADD.many(k) && x + y <= 999;
      const [[a, b], [c, e]] = d.until(() => [addPair(d, twice), addPair(d, twice)], ([p, q]) => {
        const gap = Math.abs(p[0] + p[1] - q[0] - q[1]);
        return gap >= 3 && gap <= 30 && new Set([p[0], p[1], q[0], q[1]]).size === 4 && (p[0] > q[0]) !== (p[0] + p[1] > q[0] + q[1]);
      });
      return C('집에서 도서관까지 가는 두 길 중 더 짧은 길은?', ['공원을 지나는 길', '서점을 지나는 길'], a + b < c + e ? 0 : 1, {
        figure: diamond(['집', '공원', '서점', '도서관'], [a + ' m', b + ' m', c + ' m', e + ' m']),
        explain: `공원을 지나는 길은 ${shown(a, '+', b)}(m), 서점을 지나는 길은 ${shown(c, '+', e)}(m)이다.`,
        facts: { choose: { exprs: [E(a, '+', b), E(c, '+', e)], rule: 'min' } }
      });
    }),
    T('add2-hide', '합이 네 자리 수인 세로셈의 빈 숫자', '통44(②68 ③33) 보18 심60', (d) => { const [a, b] = addPair(d, ADD.thrice); return hidden(d, a, '+', b); })
  ]);

  // ── 받아내림이 없는 뺄셈 ────────────────────────────────────────
  B.addTypes('3-1-1', 'sub0', [
    T('sub0-arrow', '화살표를 따라 빼기', '통4(①6 ②7 ③24) 보9 심32', (d) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.none(bw) && x - y >= 100);
      return N('빈칸에 알맞은 수는?', a - b, { figure: chain([a, '-' + b, box()]), explain: shown(a, '-', b), facts: calcFacts(a, '-', b) });
    }),
    T('sub0-split', '나누어 뺀 계산에서 잘못 구한 것', '통43(②21) 통18(①14)', (d) => {
      // 679-163: 79-63=㉠, 600-100=㉡, ㉠+㉡=㉢. 세 값 가운데 하나만 틀리게 말한다.
      const [a, b] = subPair(d, (bw, x, y) => SUB.none(bw) && x - y >= 100 && y % 100 >= 11 && x % 100 - y % 100 >= 11);
      const ah = Math.floor(a / 100) * 100, bh = Math.floor(b / 100) * 100, ar = a % 100, br = b % 100;
      const right = [ar - br, ah - bh, a - b], bad = d.int(0, 2);
      const slip = bad === 0 ? d.pick([-10, 10]) : bad === 1 ? (ah - bh === 100 ? 100 : d.pick([-100, 100])) : d.pick([-100, -10, 10, 100]);
      const said = right.map((v, i) => v + (i === bad ? slip : 0));
      return C(`${a} − ${josa(b, '을/를')} 몇백끼리, 남은 두 자리 수끼리 나누어 계산한다. ㉠, ㉡, ㉢에 알맞은 수를 잘못 구한 것은?`, said.map((v, i) => `${LABELS[i]} ${v}`), bad, {
        figure: lines([expr(ar, '-', br, '=', box(LABELS[0])), expr(ah, '-', bh, '=', box(LABELS[1])), expr(a, '-', b, '=', box(LABELS[0]), '+', box(LABELS[1]), '=', box(LABELS[2]))]),
        explain: `${shown(ar, '-', br)}, ${shown(ah, '-', bh)}이므로 ${a} − ${b} = ${shown(ar - br, '+', ah - bh)}이다.`,
        facts: { claimed: [[E(ar, '-', br), said[0]], [E(ah, '-', bh), said[1]], [E(a, '-', b), said[2]]], claimedWant: false, pair: [a, '-', b], rule: true }
      });
    }),
    T('sub0-odd', '계산 결과가 다른 하나 찾기', '통33(②37 ③21)', (d) => {
      // 495-162, 537-213, 694-370 → 둘은 같고 하나만 다르다(십의 자리만 다르게).
      const none = (bw, x, y) => SUB.none(bw) && x - y >= 100;
      const rows = d.until(() => {
        const first = subPair(d, none), value = first[0] - first[1], shift = d.pick([-1, 1]) * d.int(11, 180);
        const y = d.int(100, 880 - value), x = y + value + d.pick([-20, -10, 10, 20]);
        return d.shuffle([first, [first[0] + shift, first[1] + shift], [x, y]]);
      }, (list) => list.every(([x, y]) => x <= 999 && y >= 100 && plain(x) && plain(y) && none(borrowPlaces(x, y), x, y)) && new Set(list.map(([x]) => x)).size === 3 && new Set(list.map(([x, y]) => x - y)).size === 2);
      const values = rows.map(([x, y]) => x - y);
      return C('계산 결과가 나머지 둘과 다른 것은?', rows.map(([x, y]) => expr(x, '-', y)), values.findIndex((v) => values.filter((w) => w === v).length === 1), {
        explain: rows.map(([x, y]) => shown(x, '-', y)).join(', '), facts: { choose: { exprs: rows.map(([x, y]) => E(x, '-', y)), rule: 'odd' } }
      });
    }),
    T('sub0-shapes', '정해 준 도형 안의 두 수의 차', '통64(②59 ③43) 보23', (d) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.none(bw) && x - y >= 100);
      const others = d.until(() => apart(d, 2, 110, 980, 20), (xs) => xs.every((v) => Math.abs(v - a) >= 10 && Math.abs(v - b) >= 10));
      const list = d.shuffle([['triangle', a], ['triangle', b], ['circle', others[0]], ['square', others[1]]]);
      return N('삼각형 안에 있는 두 수의 차는?', a - b, { figure: shapes(list), explain: `삼각형 안에 있는 수는 ${a}, ${b}이다. ` + shown(a, '-', b), facts: calcFacts(a, '-', b) });
    }),
    T('sub0-more', '문장제: 얼마나 더 많은가', '통76(①84 ②81 ③52) 통93 심90', (d) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.none(bw) && x - y >= 100);
      return word(`과수원에서 사과를 ${a}개, 배를 ${b}개 땄다. 사과는 배보다 몇 개 더 많이 땄는가?`, '개', a, '-', b);
    })
  ]);

  // ── 받아내림이 한 번 있는 뺄셈 ──────────────────────────────────
  B.addTypes('3-1-1', 'sub1', [
    T('sub1-blocks', '수 모형이 나타내는 수보다 더 작은 수', '통15(①23 ②13 ③8) 보4 심13', (d) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.once(bw) && x < 600);
      return N(`수 모형이 나타내는 수보다 ${b}만큼 더 작은 수는?`, a - b, { figure: blocks(a), explain: `수 모형이 나타내는 수는 ${a}이다. ` + shown(a, '-', b), facts: calcFacts(a, '-', b) });
    }),
    T('sub1-change', '백 모형을 십 모형으로 바꾸어 빼기', '통23(①18)', (d) => {
      // 325-162: 백 모형 1개를 십 모형 10개로 바꾸면 백 모형 2개, 십 모형 12개
      const [a, b] = subPair(d, (bw, x, y) => SUB.tens(bw) && x < 600 && x - y >= 100), [h, t] = digits(a);
      return M(`수 모형으로 ${a} − ${josa(b, '을/를')} 계산하려고 백 모형 1개를 십 모형 10개로 바꾸었다. 바꾼 뒤의 백 모형과 십 모형은 각각 몇 개인가?`, [{ label: '백 모형', answer: h - 1, unit: '개' }, { label: '십 모형', answer: t + 10, unit: '개' }], {
        figure: blocks(a), explain: `백 모형은 ${h}개에서 1개가 줄어 ${h - 1}개가 되고, 십 모형은 ${t}개에서 10개가 늘어 ${t + 10}개가 된다. 이렇게 바꾸어 계산하면 ${shown(a, '-', b)}이다.`,
        facts: { calc: [[`${h}-1`, 0], [`${t}+10`, 1]], pair: [a, '-', b], rule: true }
      });
    }),
    T('sub1-partial', '자리별 차를 줄마다 적는 세로셈', '보7', (d) => {
      // 545-129: 15-9=6, 30-20=10, 500-100=400
      const [a, b] = subPair(d, (bw, x, y) => SUB.ones(bw) && x - y >= 100 && digits(y)[1] >= 1 && digits(x)[1] - 1 > digits(y)[1]);
      const A = digits(a), Bd = digits(b), ones = A[2] + 10 - Bd[2], tens = (A[1] - 1 - Bd[1]) * 10, hundreds = (A[0] - Bd[0]) * 100;
      return M(`${a} − ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: tens }, { label: LABELS[1], answer: hundreds }, { label: LABELS[2], answer: a - b }], {
        figure: columnSteps(chars(a), '-', chars(b), [chars(ones), box(LABELS[0]), box(LABELS[1])], box(LABELS[2]), [`← ${A[2] + 10} − ${Bd[2]}`, `← ${(A[1] - 1) * 10} − ${Bd[1] * 10}`, `← ${A[0] * 100} − ${Bd[0] * 100}`]),
        explain: `십의 자리에서 10을 받아내림하면 일의 자리끼리 ${shown(A[2] + 10, '-', Bd[2])}, 십의 자리끼리 ${shown((A[1] - 1) * 10, '-', Bd[1] * 10)}, 백의 자리끼리 ${shown(A[0] * 100, '-', Bd[0] * 100)}이다. 세 값을 더하면 ${a - b}이다.`,
        facts: { calc: [[`${(A[1] - 1) * 10}-${Bd[1] * 10}`, 0], [`${A[0] * 100}-${Bd[0] * 100}`, 1], [E(a, '-', b), 2]], pair: [a, '-', b], rule: true }
      });
    }),
    T('sub1-pick', '차가 정해진 두 수 고르기', '통58(②58) 보20 심70 심72', (d) => {
      // 498, 576, 813 … □-□=237. 일의 자리만 보아서는 짝이 하나로 좁혀지지 않게 한다.
      const pairsOf = (list) => { const out = []; list.forEach((x, i) => list.forEach((y, j) => { if (i < j) out.push([Math.max(x, y), Math.min(x, y)]); })); return out; };
      const list = d.until(() => apart(d, 4, 115, 880, 12), (xs) => {
        const all = pairsOf(xs), gaps = all.map(([x, y]) => x - y);
        return new Set(gaps).size === 6 && gaps.filter((v) => v % 10 === gaps[0] % 10).length >= 2 && SUB.once(borrowPlaces(all[0][0], all[0][1]));
      });
      const [big, small] = pairsOf(list)[0], target = big - small;
      return M(`네 수 중 두 수를 골라 차가 ${target}인 뺄셈식을 만들려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: big }, { label: LABELS[1], answer: small }], {
        figure: numbers(d.shuffle(list)) + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', target), explain: shown(big, '-', small),
        facts: { pairs: { numbers: list, want: 'diff', target }, pair: [big, '-', small], rule: true }
      });
    }),
    T('sub1-part', '문장제: 전체에서 한 부분 빼기', '통79(①87 ②80 ③54) 보25', (d) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.once(bw) && x - y >= 100 && y >= 150);
      return word(`어느 초등학교의 학생은 모두 ${a}명이다. 그중 남학생이 ${b}명일 때, 여학생은 몇 명인가?`, '명', a, '-', b);
    }),
    T('sub1-table', '표에서 두 값을 찾아 차 구하기', '통94(①93) 통102(①96) 심106', (d) => {
      // 네 사람의 기록 가운데 정해 준 두 사람의 차(가장 큰 값과 가장 작은 값의 짝은 피한다)
      const who = d.shuffle(NAMES).slice(0, 4);
      const made = d.until(() => { const xs = apart(d, 4, 180, 920, 25), [i, j] = d.shuffle([0, 1, 2, 3]); return { xs, i, j }; },
        ({ xs, i, j }) => xs[i] > xs[j] && !(xs[i] === Math.max(...xs) && xs[j] === Math.min(...xs)) && SUB.once(borrowPlaces(xs[i], xs[j])));
      const { xs, i, j } = made;
      return N(`네 사람의 줄넘기 횟수를 나타낸 표이다. ${name(who[i], '은/는')} ${nick(who[j])}보다 줄넘기를 몇 번 더 많이 하였는가?`, xs[i] - xs[j], {
        unit: '번', figure: table(['이름', '횟수(번)'], who.map((w, k) => [w, xs[k]])),
        explain: `${name(who[i], '은/는')} ${xs[i]}번, ${name(who[j], '은/는')} ${xs[j]}번 하였다. ${shown(xs[i], '-', xs[j])}`, facts: calcFacts(xs[i], '-', xs[j])
      });
    }),
    T('sub1-cards', '수 카드로 만든 가장 큰 수보다 더 작은 수', '통65(②53 ③47) 보24', (d) => {
      // 3·6·9 → 963-211
      const made = d.until(() => { const list = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3); return { list, big: biggest(list), k: three(d, 110, 480) }; },
        ({ big, k }) => big - k >= 100 && SUB.once(borrowPlaces(big, k)));
      return N(`수 카드 3장을 한 번씩 모두 사용하여 만들 수 있는 가장 큰 세 자리 수보다 ${made.k}만큼 더 작은 수는?`, made.big - made.k, {
        figure: cards(made.list), explain: `가장 큰 세 자리 수는 ${made.big}이다. ` + shown(made.big, '-', made.k), facts: calcFacts(made.big, '-', made.k)
      });
    })
  ]);

  // ── 받아내림이 두 번 있는 뺄셈 ──────────────────────────────────
  B.addTypes('3-1-1', 'sub2', [
    T('sub2-marks', '십의 자리가 0인 수에서 받아내림하기', '통17(①21 ②16) 통21(②17) 심2', (d) => {
      // 603-247: 백의 자리 위에 5, 십의 자리 위에 9, 일의 자리 위에 10
      const [a, b] = subPair(d, (bw, x, y) => SUB.zeroTens(bw, x) && x - y >= 100), h = digits(a)[0];
      return M('뺄셈식에서 ㉠, ㉡에 알맞은 수와 계산 결과는?', [{ label: LABELS[0], answer: h - 1 }, { label: LABELS[1], answer: 9 }, { label: '계산 결과', answer: a - b }], {
        figure: column(chars(a), '-', chars(b), null, [box(LABELS[0]), box(LABELS[1]), '10']),
        explain: `십의 자리 수가 0이므로 백의 자리에서 100을 받아내림한다. 백의 자리 수는 ${josa(h - 1, '이/가')} 되고, 받아내림한 100 가운데 10을 일의 자리로 다시 받아내림하면 십의 자리에는 10이 9개 남는다. 계산하면 ${shown(a, '-', b)}이다.`,
        facts: { calc: [[`${h}-1`, 0], ['10-1', 1], [E(a, '-', b), 2]], pair: [a, '-', b], rule: true }
      });
    }),
    T('sub2-result', '계산 결과 고르기', '통42(①50 ②39) 통2(②3) 심9', (d) => {
      // 775-397 = 488 / 378. 보기: 받아내림한 수를 빼지 않은 값(+110), 일의 자리로 받아내림한 것만 잊은 값(+10), 자리마다 큰 숫자에서 작은 숫자를 뺀 값
      const options = (x, y) => [x - y, x - y + 110, x - y + 10, flipped(x, y)];
      const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && digits(x)[1] < digits(y)[1] && x - y >= 100 && new Set(options(x, y)).size === 4);
      const values = d.shuffle(options(a, b));
      return C(`${a} − ${b}의 계산 결과로 알맞은 것은?`, values.map(String), values.indexOf(a - b), {
        explain: `${shown(a, '-', b)}이다. 받아내림한 수를 빼지 않으면 ${josa(a - b + 110, '이/가')} 되고, 자리마다 큰 숫자에서 작은 숫자를 빼면 ${josa(flipped(a, b), '이/가')} 된다.`,
        facts: { pick: { expr: E(a, '-', b), options: values }, pair: [a, '-', b], rule: true, wrong: a - b + 110 }
      });
    }),
    T('sub2-say', '말로 나타낸 수 중 가장 작은 수', '통36(①67) 심12', (d) => {
      // 「723보다 467만큼 더 작은 수」와 「387과 654의 차」처럼 말로 나타낸 수를 구해 비교한다.
      const pairs = d.until(() => [subPair(d, SUB.twice), subPair(d, SUB.twice), subPair(d, SUB.twice)], (list) => {
        const v = list.map(([x, y]) => x - y);
        return new Set(v).size === 3 && Math.max(...v) - Math.min(...v) <= 60 && Math.min(...v) >= 100 && new Set([].concat(...list)).size === 6;
      });
      const values = pairs.map(([x, y]) => x - y), at = d.int(0, 2);
      return C('나타내는 수가 가장 작은 것은?', LABELS.slice(0, 3), values.indexOf(Math.min(...values)), {
        figure: tagged(pairs.map(([x, y], i) => (i === at ? `${josa(y, '과/와')} ${x}의 차` : `${x}보다 ${y}만큼 더 작은 수`))),
        explain: pairs.map(([x, y], i) => `${LABELS[i]} ${shown(x, '-', y)}`).join(', '),
        facts: { choose: { exprs: pairs.map(([x, y]) => E(x, '-', y)), rule: 'min' } }
      });
    }),
    T('sub2-cards', '수 카드로 만든 가장 큰 수와 가장 작은 수의 차', '통60(①55 ②51) 심80 보24', (d) => {
      const list = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), s = list.slice().sort((p, q) => q - p), big = biggest(list), small = s[2] * 100 + s[1] * 10 + s[0];
      return N('수 카드 3장을 한 번씩 모두 사용하여 세 자리 수를 만든다. 만들 수 있는 가장 큰 수와 가장 작은 수의 차는?', big - small, {
        figure: cards(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, '-', small),
        facts: { cardSpec: { digits: list, which: 'max-min' }, pair: [big, '-', small], rule: true }
      });
    }),
    T('sub2-chain', '몇백에서 이어서 두 번 빼기', '통5(②8 ③28) 심34', (d) => {
      // 800 → -178 → -224
      const start = d.pick([700, 800, 900]);
      const [b, c] = d.until(() => [three(d, 125, 390), three(d, 120, 380)], ([x, y]) => x % 10 !== 0 && x !== y && start - x - y >= 110 && SUB.any(borrowPlaces(start - x, y)));
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: start - b }, { label: LABELS[1], answer: start - b - c }], {
        figure: chain([start, '-' + b, box(LABELS[0]), '-' + c, box(LABELS[1])]), explain: `${shown(start, '-', b)}, ${shown(start - b, '-', c)}`,
        facts: { calc: [[E(start, '-', b), 0], [`${start}-${b}-${c}`, 1]] }
      });
    }),
    T('sub2-hide', '받아내림이 두 번 있는 세로셈의 빈 숫자', '통44(②69 ③34) 보18 심61', (d) => { const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 100); return hidden(d, a, '-', b); })
  ]);

  // ── 어림셈 ──────────────────────────────────────────────────────
  B.addTypes('3-1-1', 'est', [
    T('est-word-sub', '문장제: 어림셈으로 약 얼마나 더', '보33 심122 통108', (d) => {
      const a = nearTo(d, d.int(6, 9)), b = nearTo(d, d.int(2, 4)), ra = toHundred(a), rb = toHundred(b);
      return N(`농장에서 딸기를 ${a}개, 귤을 ${b}개 땄다. 어림셈으로 구하면 딸기는 귤보다 약 몇 개 더 많이 땄는가?`, ra - rb, {
        unit: '개', lead: '약', explain: `${josa(a, '은/는')} 약 ${ra}, ${josa(b, '은/는')} 약 ${rb}이다. ` + shown(ra, '-', rb), facts: { estimate: [a, '-', b] }
      });
    }),
    T('est-seats', '어림셈으로 자리가 넉넉한지 판단하기', '통107(②114) 심125 심127', (d) => {
      // 자리 700개, 302명 입장, 학생 379명 → 700-300=400, 앉을 수 있다
      const total = d.pick([600, 700, 800, 900]), entered = nearTo(d, d.int(2, 4)), est = total - toHundred(entered), can = d.bool();
      const need = d.until(() => est + (can ? -1 : 1) * d.int(40, 80), plain);
      const say = (value, ok) => `남은 자리는 약 ${value}개이므로 모두 앉을 수 ${ok ? '있다' : '없다'}.`;
      const list = d.shuffle([[est, can], [est, !can], [est + 100, true], [est - 100, false]]);
      return C(`공연장의 자리는 ${total}개이고 지금까지 ${entered}명이 입장하였다. 학생 ${need}명이 남은 자리에 모두 앉을 수 있는지 어림셈으로 알아본 것으로 옳은 것은?`, list.map(([value, ok]) => say(value, ok)), list.findIndex(([value, ok]) => value === est && ok === can), {
        explain: `${josa(entered, '은/는')} 약 ${toHundred(entered)}이므로 남은 자리는 약 ${shown(total, '-', toHundred(entered))}(개)이다. 실제로 남은 자리는 ${shown(total, '-', entered)}(개)이다.`,
        facts: { judge: { need: String(need), have: `${total}-${entered}`, shown: est, options: list } }
      });
    }),
    T('est-change', '문장제: 거스름돈 어림하기', '통111(②115) 덧', (d) => {
      // 792원짜리를 사고 1000원을 냄 → 1000-800=200
      const price = nearTo(d, d.int(5, 8)), about = toHundred(price);
      return N(`${price}원짜리 공책 한 권을 사고 1000원을 내었다. 어림셈으로 구하면 거스름돈은 약 얼마인가?`, 1000 - about, {
        unit: '원', lead: '약', explain: `${josa(price, '은/는')} 약 ${about}이다. ` + shown(1000, '-', about), facts: { calc: [[`1000-${about}`, 0]], nearHundred: [price, about] }
      });
    }),
    T('est-pair', '어림한 합이 정해진 두 수 고르기', '보34', (d) => {
      // 269·414·112·688 가운데 합이 700쯤인 두 수. 몇백끼리의 합이 같은 짝이 둘이 되지 않게 고른다.
      const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
      const hs = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4), (xs) => new Set(PAIRS.map(([i, j]) => xs[i] + xs[j])).size === 6);
      const list = hs.map((h) => nearTo(d, h)), target = (hs[0] + hs[1]) * 100;
      const picks = d.shuffle(d.shuffle(PAIRS.slice(1)).slice(0, 3).concat([PAIRS[0]]));
      return C(`네 수를 각각 몇백으로 어림하여 더할 때, 합이 약 ${target}인 두 수는?`, picks.map(([i, j]) => `${list[i]}, ${list[j]}`), picks.indexOf(PAIRS[0]), {
        figure: numbers(d.shuffle(list)),
        explain: `${josa(list[0], '은/는')} 약 ${hs[0] * 100}, ${josa(list[1], '은/는')} 약 ${hs[1] * 100}이므로 두 수의 합은 약 ${target}이다.`,
        facts: { choose: { exprs: picks.map(([i, j]) => `${hs[i] * 100}+${hs[j] * 100}`), rule: 'equals', target } }
      });
    })
  ]);

  // ── 덧셈과 뺄셈 ─────────────────────────────────────────────────
  B.addTypes('3-1-1', 'mix', [
    T('mix-two', '두 수의 합과 차', '통3(①3 ②4·5 ③25·26) 통8(①4 ②6) 심30 보9', (d) => {
      // 작은 수를 앞에 적는다. 차는 큰 수를 스스로 가려서 구한다.
      const [big, small] = subPair(d, (bw, x, y) => SUB.any(bw) && ADD.any(carryPlaces(x, y)) && x - y >= 30);
      return M('두 수의 합과 차는?', [{ label: '합', answer: big + small }, { label: '차', answer: big - small }], {
        figure: numbers([small, big]), explain: `${shown(small, '+', big)}, ${shown(big, '-', small)}`, facts: { calc: [[E(small, '+', big), 0], [E(big, '-', small), 1]] }
      });
    }),
    T('mix-grid', '가로줄과 세로줄의 합을 적는 표', '통7(①8 ②11) 심31', (d) => {
      const [a, b, c, e] = d.until(() => apart(d, 4, 120, 560, 12), ([p, q, r, s]) => [[p, q], [r, s], [p, r], [q, s]].every(([x, y]) => ADD.any(carryPlaces(x, y)) && x + y <= 999));
      // 표의 첫 세로줄은 머리 칸으로 그려지므로 수를 넣지 않고 비워 둔다.
      return M('가로줄의 두 수의 합과 세로줄의 두 수의 합을 「합」 칸에 쓴다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', [a + b, c + e, a + c, b + e].map((answer, i) => ({ label: LABELS[i], answer })), {
        figure: table(['', '', '', '합'], [['', a, b, box(LABELS[0])], ['', c, e, box(LABELS[1])], ['합', box(LABELS[2]), box(LABELS[3]), '']]),
        explain: `${LABELS[0]} ${shown(a, '+', b)}, ${LABELS[1]} ${shown(c, '+', e)}, ${LABELS[2]} ${shown(a, '+', c)}, ${LABELS[3]} ${shown(b, '+', e)}`,
        facts: { calc: [[E(a, '+', b), 0], [E(c, '+', e), 1], [E(a, '+', c), 2], [E(b, '+', e), 3]] }
      });
    }),
    T('mix-both', '문장제: 합과 차를 모두 구하기', '통84(①91)', (d) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.any(bw) && ADD.any(carryPlaces(x, y)) && x - y >= 30);
      return M(`어느 농장에 닭이 ${a}마리, 오리가 ${b}마리 있다. 닭과 오리는 모두 몇 마리이고, 닭은 오리보다 몇 마리 더 많은가?`, [{ label: '모두', answer: a + b, unit: '마리' }, { label: '차', answer: a - b, unit: '마리' }], {
        explain: `닭과 오리는 모두 ${shown(a, '+', b)}(마리)이고, 닭이 ${shown(a, '-', b)}(마리) 더 많다.`, facts: { calc: [[E(a, '+', b), 0], [E(a, '-', b), 1]] }
      });
    }),
    T('mix-what-sub', '어떤 수 구하기: 빼었더니', '통45(②65) 심37', (d) => {
      // 어떤 수에서 426을 빼었더니 249
      const [c, b] = addPair(d, (k, x, y) => ADD.any(k) && x + y <= 999);
      return N(`어떤 수에서 ${josa(b, '을/를')} 빼었더니 ${josa(c, '이/가')} 되었다. 어떤 수는?`, c + b, { explain: `어떤 수는 ${c}에 ${josa(b, '을/를')} 더한 수이다. ` + shown(c, '+', b), facts: { calc: [[E(c, '+', b), 0]] } });
    }),
    T('mix-box-plus', '덧셈식의 □에 알맞은 수 고르기', '통46(①27·28 ②61) 보19 덧', (d) => {
      // 387+□=600 꼴을 보기에서 고른다. +10·+100: 받아내림한 수를 빼지 않은 아이, 두 수의 합: □를 구할 때에도 더하는 아이
      const [s, a] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 100), right = s - a;
      const values = d.shuffle([right, right + 10, right + 100, s + a]);
      return C('□ 안에 알맞은 수는?', values.map(String), values.indexOf(right), {
        figure: expr(a, '+', box(), '=', s), explain: `□는 ${s}에서 ${josa(a, '을/를')} 뺀 수이다. ${shown(s, '-', a)}`, facts: { pick: { expr: E(s, '-', a), options: values } }
      });
    }),
    T('mix-box-minus', '뺄셈식의 빼어지는 수 구하기', '통46(②62) 심37 덧', (d) => {
      // □-241=679
      const [c, b] = addPair(d, (k, x, y) => ADD.many(k) && x + y <= 999);
      return N('□ 안에 알맞은 수는?', c + b, {
        figure: expr(box(), '-', b, '=', c), explain: `□는 ${c}에 ${josa(b, '을/를')} 더한 수이다. ${shown(c, '+', b)}`, facts: { calc: [[E(c, '+', b), 0]], inverse: ['x-b=c', 0, b, c] }
      });
    }),
    T('mix-linked', '같은 모양이 든 두 식', '통53(①30) 심42', (d) => {
      // 153+420=●, ■-●=412
      const [a, b] = addPair(d, (k, x, y) => ADD.any(k) && x + y <= 640 && (x + y) % 10 >= 2);
      const c = d.until(() => three(d, 120, 990 - a - b), (v) => ADD.any(carryPlaces(a + b, v)));
      return M('같은 모양은 같은 수를 나타낸다. ●, ■에 알맞은 수는?', [{ label: '●', answer: a + b }, { label: '■', answer: a + b + c }], {
        figure: lines([expr(a, '+', b, '=', '●'), expr('■', '-', '●', '=', c)]),
        explain: `●는 ${shown(a, '+', b)}이다. ■에서 ${josa(a + b, '을/를')} 빼면 ${c}이므로 ■는 ${shown(c, '+', a + b)}이다.`,
        facts: { calc: [[E(a, '+', b), 0], [`${c}+${a}+${b}`, 1]] }
      });
    }),
    T('mix-cards4', '수 카드 4장 중 3장으로 만든 수의 합', '통60(①56) 심81 심82', (d) => {
      // 2, 3, 4, 6 → 643+234
      const list = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), s = list.slice().sort((p, q) => q - p);
      const big = s[0] * 100 + s[1] * 10 + s[2], small = s[3] * 100 + s[2] * 10 + s[1];
      return N('수 카드 4장 중 3장을 골라 한 번씩만 사용하여 세 자리 수를 만든다. 만들 수 있는 가장 큰 수와 가장 작은 수의 합은?', big + small, {
        figure: cards(list), explain: `가장 큰 수는 큰 숫자 셋으로 만든 ${big}, 가장 작은 수는 작은 숫자 셋으로 만든 ${small}이다. ` + shown(big, '+', small),
        facts: { cardSpec: { digits: list, which: 'max+min' } }
      });
    }),
    T('mix-rank', '표에서 둘째로 큰 값과 가장 작은 값의 차', '심108 통94(①92 ③58) 통68(②50) 심107', (d) => {
      const towns = ['가', '나', '다', '라', '마'];
      const values = d.until(() => apart(d, 5, 130, 940, 12), (xs) => { const s = xs.slice().sort((p, q) => q - p); return SUB.any(borrowPlaces(s[1], s[4])); });
      const s = values.slice().sort((p, q) => q - p);
      return N('마을별로 심은 나무 수를 나타낸 표이다. 나무를 둘째로 많이 심은 마을과 가장 적게 심은 마을의 나무 수의 차는 몇 그루인가?', s[1] - s[4], {
        unit: '그루', figure: table(['마을', '나무 수(그루)'], towns.map((t, i) => [t + ' 마을', values[i]])),
        explain: `둘째로 많이 심은 마을은 ${s[1]}그루, 가장 적게 심은 마을은 ${s[4]}그루를 심었다. ${shown(s[1], '-', s[4])}`,
        facts: { tableRank: { values, a: 1, b: 4 } }
      });
    }),
    T('mix-afford', '계산하여 살 수 있는지 판단하기', '통107(②113) 심126 덧', (d) => {
      // 513원과 792원, 1500원 → 1305원이므로 살 수 있다. 함정 값은 십의 자리에서 받아올림한 수를 더하지 않은 합이다.
      const [a, b] = d.until(() => [three(d, 410, 690), three(d, 520, 890)], ([x, y]) => carryPlaces(x, y)[1] && x + y >= 1000);
      const sum = a + b, can = d.bool(), money = can ? Math.ceil((sum + 20) / 100) * 100 : Math.floor((sum - 20) / 100) * 100, wrong = sum - 100;
      const say = (value, ok) => `두 물건의 값은 ${value}원이므로 살 수 ${ok ? '있다' : '없다'}.`;
      const list = d.shuffle([[sum, can], [sum, !can], [wrong, true], [wrong, false]]);
      return C(`색연필 한 자루는 ${a}원, 수첩 한 권은 ${b}원이다. ${money}원으로 색연필 한 자루와 수첩 한 권을 살 수 있는지 계산하여 알아본 것으로 옳은 것은?`, list.map(([value, ok]) => say(value, ok)), list.findIndex(([value, ok]) => value === sum && ok === can), {
        explain: `두 물건의 값은 ${shown(a, '+', b)}(원)이다. ${money}원${can ? '보다 적으므로 살 수 있다' : '보다 많으므로 살 수 없다'}.`,
        facts: { judge: { need: `${a}+${b}`, have: String(money), shown: sum, options: list } }
      });
    })
  ]);

  // ── 실력 문제 ──────────────────────────────────────────────────
  B.addTypes('3-1-1', 'hard', [
    HB('h-why', '잘못 계산한 까닭 고르기', '통41(①104 ②43 ③61) 통40 보17', (d) => {
      // 두 가지 잘못 가운데 하나로 계산한 세로셈을 보인다:
      //   받아내림한 수를 빼지 않았다(631-387=354) / 받아내림하지 않고 자리마다 큰 숫자에서 작은 숫자를 뺐다(631-387=356)
      const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && digits(x)[1] < digits(y)[1] && x - y >= 100 && flipped(x, y) !== x - y + 110);
      const kind = d.int(0, 1), wrong = kind === 0 ? a - b + 110 : flipped(a, b);
      const rows = d.shuffle([
        // 받아내림은 했으나 받아내림한 수를 빼지 않은 계산을 알아보는 아이가 고른다.
        { text: '받아내림을 하고도 받아내림한 수를 빼지 않았다.', ok: kind === 0 },
        // 받아내림하지 않고 큰 숫자에서 작은 숫자를 뺀 계산을 알아보는 아이가 고른다.
        { text: '받아내림하지 않고 자리마다 큰 숫자에서 작은 숫자를 빼었다.', ok: kind === 1 },
        // 어느 자리가 틀렸는지 따지지 않고 「받아내림」이라는 말만 보고 고르는 아이
        { text: '받아내림하지 않아도 되는 자리에서 받아내림하였다.', ok: false },
        // 계산은 살피지 않고 세로로 쓴 모양을 의심하는 아이
        { text: '같은 자리 숫자끼리 맞추어 쓰지 않았다.', ok: false }
      ]);
      return C('다음은 잘못 계산한 것이다. 잘못 계산한 까닭으로 알맞은 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        figure: column(chars(a), '-', chars(b), chars(wrong)),
        explain: (kind === 0 ? '일의 자리와 십의 자리로 받아내림을 하고도 받아내림한 수를 빼지 않았다.' : '받아내림하지 않고 자리마다 큰 숫자에서 작은 숫자를 빼었다.') + ` 바르게 계산하면 ${shown(a, '-', b)}이다.`,
        facts: { truth: rows.map((row) => row.ok), want: true, pair: [a, '-', b], wrong }
      });
    }),
    H('h-compose-diff', '묶음의 수로 나타낸 두 수의 차', '심17 통61(①53 ②47) 통63(②48) 보12', (d) => {
      // ㉠ 10이 68개, 1이 5개인 수(685) ㉡ 100이 2개, 10이 3개, 1이 17개인 수(247). ㉠은 백의 묶음 없이 말한다.
      const [x, y] = d.until(() => [three(d, 420, 980), three(d, 125, 480)], ([p, q]) => p - q >= 110 && p % 10 >= 1 && q % 10 <= 8 && Math.floor(q / 10) % 10 >= 1 && SUB.any(borrowPlaces(p, q)));
      const px = [0, Math.floor(x / 10), x % 10], py = [Math.floor(y / 100), Math.floor(y / 10) % 10 - 1, y % 10 + 10];
      const say = ([h, t, o]) => [[100, h], [10, t], [1, o]].filter((p) => p[1] > 0).map(([unit, n]) => `${josa(unit, '이/가')} ${n}개`).join(', ') + '인 수';
      return N('㉠과 ㉡이 나타내는 수의 차는?', x - y, {
        figure: tagged([say(px), say(py)]), explain: `㉠은 ${x}, ㉡은 ${y}이다. ` + shown(x, '-', y), facts: { compose: [px, py], composeOp: '-' }
      });
    }),
    H('h-range-sum', '계산 결과보다 작은 수 중 가장 큰 수', '심46 통48(②74 ③36)', (d) => {
      // 463+298>□ → 760. 계산 결과를 그대로 답하면 틀린다.
      const [a, b] = addPair(d, (k, x, y) => ADD.many(k) && x + y <= 999);
      return N('□ 안에 들어갈 수 있는 수 중 가장 큰 수는?', a + b - 1, {
        figure: expr(a, '+', b, '<i>&gt;</i>', box()),
        explain: `${shown(a, '+', b)}이므로 □는 ${a + b}보다 작아야 한다. ${a + b}보다 작은 수 중 가장 큰 수는 ${a + b - 1}이다.`,
        facts: { range: { ineq: `${a}+${b}>x`, want: 'max', lo: 100, hi: 999 } }
      });
    }),
    H('h-range-min', '계산 결과보다 큰 수 중 가장 작은 수', '심47 통48(②74)', (d) => {
      // 865-497<□ → 369
      const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 110);
      return N('□ 안에 들어갈 수 있는 수 중 가장 작은 수는?', a - b + 1, {
        figure: expr(a, '-', b, '<i>&lt;</i>', box()),
        explain: `${shown(a, '-', b)}이므로 □는 ${a - b}보다 커야 한다. ${a - b}보다 큰 수 중 가장 작은 수는 ${a - b + 1}이다.`,
        facts: { range: { ineq: `${a}-${b}<x`, want: 'min', lo: 100, hi: 999 } }
      });
    }),
    H('h-between', '두 식에 공통으로 들어갈 수', '덧(미래엔 단원평가 심화 3회)', (d) => {
      // 348+291<□, 956-315>□ → 639보다 크고 641보다 작은 수
      const made = d.until(() => {
        const [a, b] = addPair(d, (k, x, y) => ADD.any(k) && x + y >= 300 && x + y <= 880), e = d.int(100, 997 - a - b);
        return { a, b, c: a + b + 2 + e, e };
      }, ({ c, e }) => plain(c) && plain(e) && SUB.any(borrowPlaces(c, e)));
      const { a, b, c, e } = made;
      return N('두 식의 □ 안에 공통으로 들어갈 수 있는 수는?', a + b + 1, {
        figure: lines([expr(a, '+', b, '<i>&lt;</i>', box()), expr(c, '-', e, '<i>&gt;</i>', box())]),
        explain: `${shown(a, '+', b)}이므로 □는 ${a + b}보다 크고, ${shown(c, '-', e)}이므로 □는 ${c - e}보다 작다. ${a + b}보다 크고 ${c - e}보다 작은 수는 ${a + b + 1}이다.`,
        facts: { calc: [[`${a}+${b}+1`, 0], [`${c}-${e}-1`, 0]] }
      });
    }),
    H('h-digit-count', '빼는 수의 □에 들어갈 수 있는 수의 개수', '심54 통49(①33 ②76) 보28 덧', (d) => {
      // 819-16□>656 → 16□<163 → 0, 1, 2. 빼는 수가 클수록 차가 작아진다는 것을 알아야 한다(□가 클수록 차도 크다고 여기면 거꾸로 센다).
      const made = d.until(() => { const h = d.int(1, 4), t = d.int(1, 8), k = d.int(2, 7), c = three(d, 210, 580); return { h, t, k, c, a: c + h * 100 + t * 10 + k }; }, ({ a }) => a <= 999 && plain(a));
      const { h, t, k, c, a } = made, list = Array.from({ length: k }, (_, i) => i).join(', ');
      return N('0부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', k, {
        unit: '개', figure: expr(a, '-', `${h}${t}${box()}`, '<i>&gt;</i>', c),
        explain: `${shown(a, '-', c)}이므로 ${h}${t}□는 ${a - c}보다 작아야 한다. □ 안에 들어갈 수 있는 수는 ${list}이고, 모두 ${k}개이다.`,
        facts: { digit: { template: `${a}-${h}${t}□>${c}`, lo: 0, hi: 9, ask: 'count' } }
      });
    }),
    H('h-wrong-add', '잘못 계산한 어떤 수: 더할 것을 뺌', '심56 통47(①38)', (d) => {
      // 어떤 수에 368을 더해야 할 것을 뺐더니 284
      const [x, b] = subPair(d, (bw, p, q) => SUB.any(bw) && q >= 120 && p - q >= 110 && plain(p - q) && p + q <= 999 && ADD.any(carryPlaces(p, q))), c = x - b;
      return N(`어떤 수에 ${josa(b, '을/를')} 더해야 하는데 잘못하여 빼었더니 ${josa(c, '이/가')} 되었다. 바르게 계산한 값은?`, x + b, {
        explain: `어떤 수는 ${shown(c, '+', b)}이다. 바르게 계산하면 ${shown(x, '+', b)}이다.`, facts: { calc: [[`${c}+${b}+${b}`, 0]] }
      });
    }),
    H('h-wrong-from', '잘못 계산한 어떤 수: 어떤 수를 빼야 할 때', '심58 덧', (d) => {
      // 625에서 어떤 수를 빼야 할 것을 더했더니 918 → 어떤 수 293, 바른 값 332
      const [a, x] = subPair(d, (bw, p, q) => SUB.any(bw) && q >= 120 && p - q >= 60 && p + q <= 999 && ADD.any(carryPlaces(p, q))), c = a + x;
      return N(`${a}에서 어떤 수를 빼야 하는데 잘못하여 더했더니 ${josa(c, '이/가')} 되었다. 바르게 계산한 값은?`, a - x, {
        explain: `어떤 수는 ${shown(c, '-', a)}이다. 바르게 계산하면 ${shown(a, '-', x)}이다.`, facts: { calc: [[`${a}-(${c}-${a})`, 0]] }
      });
    }),
    H('h-wrong-swap', '잘못 계산한 어떤 수: 자리를 바꾼 수를 더함', '심59 보27', (d) => {
      // 541을 더해야 할 것을 514를 더했더니 790 → 어떤 수 276, 바른 값 817
      const made = d.until(() => { const h = d.int(1, 5), t = d.int(1, 9), o = d.int(1, 9); return { right: h * 100 + t * 10 + o, slip: h * 100 + o * 10 + t, x: three(d, 130, 440) }; },
        ({ right, slip, x }) => right !== slip && plain(right) && plain(slip) && x + right <= 999 && x + slip <= 999 && plain(x + slip) && ADD.any(carryPlaces(x, right)) && SUB.any(borrowPlaces(x + slip, slip)));
      const { right, slip, x } = made, c = x + slip;
      return N(`어떤 수에 ${josa(right, '을/를')} 더해야 하는데 잘못하여 ${josa(slip, '을/를')} 더했더니 ${josa(c, '이/가')} 되었다. 바르게 계산한 값은?`, x + right, {
        explain: `어떤 수는 ${shown(c, '-', slip)}이다. 바르게 계산하면 ${shown(x, '+', right)}이다.`, facts: { calc: [[`${c}-${slip}+${right}`, 0]] }
      });
    }),
    H('h-then', '어떤 수를 구한 뒤 다시 계산하기', '통47(①37 ②67 ③38) 심43 덧', (d) => {
      // 어떤 수에 153을 더했더니 451, 어떤 수에서 109를 뺀 값
      const [c, b] = subPair(d, (bw, p, q) => SUB.any(bw) && p - q >= 260 && (p - q) % 10 <= 7), x = c - b;
      const e = d.until(() => three(d, 110, x - 40), (v) => v !== b && SUB.any(borrowPlaces(x, v)));
      return N(`어떤 수에 ${josa(b, '을/를')} 더했더니 ${josa(c, '이/가')} 되었다. 어떤 수에서 ${josa(e, '을/를')} 뺀 값은?`, x - e, {
        explain: `어떤 수는 ${shown(c, '-', b)}이다. 여기에서 ${josa(e, '을/를')} 빼면 ${shown(x, '-', e)}이다.`, facts: { calc: [[`${c}-${b}-${e}`, 0]] }
      });
    }),
    H('h-less-all', '더 적은 쪽을 구해 모두 더하기', '심94 통86(①98 ②95) 보26 덧', (d) => {
      // 여학생 872명, 남학생은 219명 더 적음 → 모두
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [a, k] = d.until(() => [three(d, 330, 760), three(d, 110, 240)], ([p, q]) => p - q >= 120 && SUB.any(borrowPlaces(p, q)) && ADD.any(carryPlaces(p, p - q)));
      return N(`붙임딱지를 ${name(one, '은/는')} ${a}장 모았고, ${name(two, '은/는')} ${nick(one)}보다 ${k}장 더 적게 모았다. 두 사람이 모은 붙임딱지는 모두 몇 장인가?`, a + a - k, {
        unit: '장', explain: `${name(two, '은/는')} ${shown(a, '-', k)}(장)을 모았다. ${shown(a, '+', a - k)}`, facts: { calc: [[`${a}+(${a}-${k})`, 0]] }
      });
    }),
    H('h-sum-more', '두 양의 합보다 더 많은 양', '심95', (d) => {
      // 어제 134회, 오늘 188회, 다른 사람은 그 합보다 153회 더
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [a, b, k] = d.until(() => [three(d, 130, 290), three(d, 130, 290), three(d, 110, 260)], ([p, q, r]) => p !== q && ADD.any(carryPlaces(p, q)) && ADD.any(carryPlaces(p + q, r)) && plain(p + q));
      return N(`${name(one, '은/는')} 줄넘기를 어제 ${a}번, 오늘 ${b}번 하였다. ${name(two, '은/는')} ${nick(one)}가 이틀 동안 한 횟수보다 ${k}번 더 많이 하였다. ${name(two, '이/가')} 한 줄넘기는 몇 번인가?`, a + b + k, {
        unit: '번', explain: `${name(one, '이/가')} 이틀 동안 한 줄넘기는 ${shown(a, '+', b)}(번)이다. ${shown(a + b, '+', k)}`, facts: { calc: [[`${a}+${b}+${k}`, 0]] }
      });
    }),
    H('h-off-on', '줄었다가 늘어난 수', '심97 통88(①97 ②97)', (d) => {
      // 812명에서 253명이 내리고 164명이 탐
      const [a, b, c] = d.until(() => [three(d, 420, 880), three(d, 130, 290), three(d, 110, 260)], ([p, q, r]) => q !== r && p - q >= 110 && p - q + r <= 999 && plain(p - q) && SUB.any(borrowPlaces(p, q)) && ADD.any(carryPlaces(p - q, r)));
      return N(`기차에 ${a}명이 타고 있었다. 이번 역에서 ${b}명이 내리고 ${c}명이 탔다. 지금 기차에 타고 있는 사람은 몇 명인가?`, a - b + c, {
        unit: '명', explain: `${shown(a, '-', b)}, ${shown(a - b, '+', c)}`, facts: { calc: [[`${a}-${b}+${c}`, 0]] }
      });
    }),
    H('h-left', '남은 양을 각각 구해 비교하기', '심104 통91(②99) 덧', (d) => {
      // 지우개 315개 중 143개, 자 427개 중 215개 → 어느 것이 몇 개 더 많이 남았는가. 처음에 더 많던 것이 더 많이 남지는 않게 한다.
      const things = ['지우개', '자'];
      const [a, b, c, e] = d.until(() => [three(d, 310, 620), three(d, 120, 290), three(d, 310, 620), three(d, 120, 290)], ([p, q, r, s]) => {
        const x = p - q, y = r - s, gap = Math.abs(x - y);
        return x >= 100 && y >= 100 && gap >= 12 && gap <= 90 && (p > r) !== (x > y) && Math.abs(p - r) !== gap && SUB.any(borrowPlaces(p, q)) && SUB.any(borrowPlaces(r, s));
      });
      const left = [a - b, c - e], winner = left[0] > left[1] ? 0 : 1, gap = Math.abs(left[0] - left[1]), other = Math.abs(a - c);
      // 처음 수만 비교하는 아이는 처음에 더 많던 것과 그 차(other)를 고른다.
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
      return C(`문구점에 지우개가 ${a}개, 자가 ${c}개 있었다. 지우개를 ${b}개, 자를 ${e}개 팔았을 때, 어느 것이 몇 개 더 많이 남았는가?`, list.map(([i, n]) => `${things[i]}, ${n}개`), list.findIndex(([i, n]) => i === winner && n === gap), {
        explain: `지우개는 ${shown(a, '-', b)}(개), 자는 ${shown(c, '-', e)}(개) 남았다. ${shown(Math.max(...left), '-', Math.min(...left))}`,
        facts: { who: { exprs: [E(a, '-', b), E(c, '-', e)], values: left, options: list } }
      });
    }),
    H('h-loop', '올라간 길과 내려온 길을 모두 더하기', '심111 심101', (d) => {
      // 입구–약수터 169, 약수터–정상 253, 정상–쉼터 157, 쉼터–입구 346 → 925
      const [a, b, c, e] = d.until(() => apart(d, 4, 135, 380, 9), ([p, q, r, s]) => ADD.any(carryPlaces(p, q)) && ADD.any(carryPlaces(r, s)) && ADD.any(carryPlaces(p + q, r + s)));
      return N('산 입구에서 약수터를 지나 정상까지 올라갔다가, 쉼터를 지나 산 입구로 내려왔다. 걸은 거리는 모두 몇 m인가?', a + b + c + e, {
        unit: 'm', figure: diamond(['입구', '약수터', '쉼터', '정상'], [a + ' m', b + ' m', e + ' m', c + ' m']),
        explain: `올라간 거리는 ${shown(a, '+', b)}(m), 내려온 거리는 ${shown(c, '+', e)}(m)이다. ${shown(a + b, '+', c + e)}`,
        facts: { calc: [[`${a}+${b}+${c}+${e}`, 0]] }
      });
    }),
    H('h-back', '갔다가 되돌아온 거리', '심116', (d) => {
      // 집–학교 432, 학교–문구점 134 → 432+134+134
      const [a, b] = d.until(() => [three(d, 310, 560), three(d, 115, 240)], ([p, q]) => ADD.any(carryPlaces(p, q)) && ADD.any(carryPlaces(p + q, q)) && p + q + q <= 999);
      return N('집에서 출발하여 학교를 지나 문구점까지 갔다가 다시 학교로 돌아왔다. 걸은 거리는 모두 몇 m인가?', a + b + b, {
        unit: 'm', figure: route([['집', 0, 50], ['학교', 58, 50], ['문구점', 100, 50]], [[0, 1, a + ' m'], [1, 2, b + ' m']], 40),
        explain: `학교와 문구점 사이를 두 번 걸었다. ${shown(a, '+', b)}, ${shown(a + b, '+', b)}`, facts: { calc: [[`${a}+${b}+${b}`, 0]] }
      });
    }),
    H('h-overlap', '겹친 구간의 거리', '심115 통104(①102)', (d) => {
      // 집–공원 725 m, 집–마트 397 m, 빵집–공원 516 m → 빵집–마트 188 m
      const [x, y, z] = d.until(() => [three(d, 160, 330), three(d, 120, 260), three(d, 160, 330)], ([p, q, r]) => p + q + q + r <= 999 && plain(p + q) && plain(q + r) && plain(p + q + r)
        && ADD.any(carryPlaces(p + q, q + r)) && SUB.any(borrowPlaces(p + q + q + r, p + q + r)));
      const total = x + y + z, front = x + y, back = y + z;
      return N(`집, 빵집, 마트, 공원이 이 차례로 곧은 길 위에 있다. 집에서 공원까지의 거리는 ${total} m, 집에서 마트까지의 거리는 ${front} m, 빵집에서 공원까지의 거리는 ${back} m이다. 빵집에서 마트까지의 거리는 몇 m인가?`, y, {
        unit: 'm', figure: route([['집', 0, 50], ['빵집', 30, 50], ['마트', 64, 50], ['공원', 100, 50]], [[0, 1], [1, 2], [2, 3]], 40),
        explain: `집에서 마트까지의 거리와 빵집에서 공원까지의 거리를 더하면 빵집과 마트 사이를 두 번 센 것이다. ${shown(front, '+', back)}, ${shown(front + back, '-', total)}`,
        facts: { calc: [[`${front}+${back}-${total}`, 0]] }
      });
    }),
    HB('h-score', '표의 빈칸을 거꾸로 채우기', '보31', (d) => {
      // 청군 경기 357, 총점 814 → 응원 457. 백군 경기 425 + 응원 457 = 882
      const [a, x, c] = d.until(() => [three(d, 310, 480), three(d, 320, 480), three(d, 310, 480)], ([p, q, r]) => p !== r && p + q <= 999 && r + q <= 999 && plain(p + q) && SUB.any(borrowPlaces(p + q, p)) && ADD.any(carryPlaces(r, q)));
      const s = a + x;
      return M('운동회에서 청군과 백군이 얻은 점수를 나타낸 표이다. 두 편의 응원 점수가 같을 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: x }, { label: LABELS[1], answer: c + x }], {
        figure: table(['', '청군', '백군'], [['경기 점수(점)', a, c], ['응원 점수(점)', box(LABELS[0]), box(LABELS[0])], ['총점(점)', s, box(LABELS[1])]]),
        explain: `청군의 응원 점수는 ${shown(s, '-', a)}(점)이다. 백군의 총점은 ${shown(c, '+', x)}(점)이다.`,
        facts: { calc: [[E(s, '-', a), 0], [`${c}+${s}-${a}`, 1]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
