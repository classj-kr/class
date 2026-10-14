// 1학년 2학기 2단원 덧셈과 뺄셈(1) — 나머지 기본 문항(10에서 빼기, 10을 만들어 더하기)과 실력 문항.
// 꼴 번호는 1-2-2a.js 와 같다(①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번). 싣는 기준과 뺀 꼴도 그 파일 머리에 적었다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 문항의 장치)
//  - 세 수의 뺄셈에서 뒤의 두 수를 먼저 뺀다(9 − 5 − 2 를 5 − 2 = 3, 9 − 3 = 6 으로). 5 와 2 는 둘 다 빼는 수이다.
//  - 10을 만들 두 수를 이웃한 수에서만 찾는다(3 + 5 + 7 의 3 과 7 을 보지 못한다).
//  - 「10을 만들어 더하기」를 「세 수의 합이 10인 식」으로 기억한다(2 + 5 + 3 에는 합이 10인 두 수가 없다).
//  - = 뒤를 답을 적는 자리로만 안다(2 + □ = 6 + 4 에서 4 를, 7 + 3 = □ + 5 에서 10 을 적는다).
//  - 「먹었더니 … 남았다」를 보면 뺄셈부터 한다(처음 수는 먹은 것과 남은 것을 합친 수이다).
//  - 문제에 나온 수를 모두 더한다(묻는 것과 상관없는 수가 섞여 있어도).
//
// 실력에 두지 않은 것
//  - 「그림에 알맞은 식 고르기」(심2), 「계산 결과가 큰 것부터」(심16), 「답이 십몇인 식의 □」(심46), 「10에서 두 번 덜어 내기」(심40)는
//    한 번 계산하거나 값 하나를 읽으면 되는 일이라 기본에 두었다. 십 배열판의 빈칸 읽기(ten-frame-more), 10 − □ 와 □ + △ = 10 이 같은 짝이라는 것(ten-family)도 기본이다.
//  - 덧셈 뒤에 뺄셈을 잇는 꼴(심10·심33)은 식 하나로 쓰지 않고, 풀이도 단계마다 식을 따로 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, lines, tagged, cards, table, N, M, C } = B.kit;
  const G = B.kit.geo;
  const { sum, key, pairsOf, pairsIn, add3, sub3, ten3, ex3, E3, said3, stepSub, stepTen, both, SIGNS, signOf, versus, COMPARE, rowsOf, tenFrame, tenPlus, dice, bond, hop, THREE, TEN, SPLIT } = B.kit.g122;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const split = (a) => `10은 ${josa(a, '과/와')} ${josa(10 - a, '으로/로')} 가를 수 있다.`;
  const where = (d) => d.pick(['front', 'back']);

  // ── 10에서 빼기 ──────────────────────────────────────────────
  B.addTypes('1-2-2', 'tensub', [
    T('tensub-row', '10에서 빼기', '①41', (d) => {
      const a = d.int(1, 9);
      return N('다음을 계산하시오.', 10 - a, { figure: expr(10, '-', a, '=', box()), explain: `${split(a)} ${expr(10, '-', a, '=', 10 - a)}`, facts: { calc: [[`10-${a}`, 0]], rule: 'tensub' } });
    }),
    T('tensub-frame', '그림을 보고 10에서 빼는 뺄셈식 만들기', '①42 심34', (d) => {
      const k = d.int(2, 8);
      return M('○ 10개 가운데 몇 개를 선으로 지웠다. 지운 수만큼 뺀다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: k }, { label: LABELS[1], answer: 10 - k }], {
        figure: tenFrame(Array.from({ length: 10 }, () => 'red'), `십 배열판: ○ 10개 가운데 ${k}개를 선으로 지웠다`, Array.from({ length: k }, (_, i) => 9 - i)) + expr(10, '-', box(LABELS[0]), '=', box(LABELS[1])),
        explain: `지운 ○는 ${k}개이고 남은 ○는 ${10 - k}개이다. ${expr(10, '-', k, '=', 10 - k)}`,
        facts: { calc: [[String(k), 0], [`10-${k}`, 1]] }
      });
    }),
    T('tensub-split', '10을 두 수로 가르기', '①41', (d) => {
      const a = d.int(1, 9);
      return N('10을 두 수로 갈랐다. □ 안에 알맞은 수는?', 10 - a, {
        figure: bond(10, a, `가르기 그림: 10을 ${josa(a, '과/와')} □로 갈랐다`), explain: split(a), facts: { calc: [[`10-${a}`, 0]] }
      });
    }, { standard: SPLIT }),
    T('tensub-blank', '10에서 빼는 식에서 □ 구하기', '①43', (d) => {
      const c = d.int(1, 9);
      return N('□ 안에 알맞은 수는?', 10 - c, {
        figure: expr(10, '-', box(), '=', c), explain: `${split(c)} ${expr(10, '-', 10 - c, '=', c)}`,
        facts: { calc: [[`10-${c}`, 0]], inverse: ['a-x=c', 10, 10 - c, c], rule: 'tensub-blank' }
      });
    }),
    T('tensub-match', '계산 결과가 정해진 식 찾기', '①44 심35', (d) => {
      const xs = d.shuffle(DIGITS).slice(0, 3), want = d.int(0, 2);
      return C(`계산 결과가 ${10 - xs[want]}인 것은?`, LABELS.slice(0, 3), want, {
        figure: tagged(xs.map((x) => expr(10, '-', x))), explain: xs.map((x, i) => `${LABELS[i]} ${expr(10, '-', x, '=', 10 - x)}`).join(', '),
        facts: { choose: { exprs: xs.map((x) => `10-${x}`), rule: 'equals', target: 10 - xs[want] } }
      });
    }),
    T('tensub-most', '10에서 뺀 결과가 가장 큰(작은) 식', '①45 심35', (d) => {
      const xs = d.shuffle(DIGITS).slice(0, 4), big = d.bool(), values = xs.map((x) => 10 - x);
      return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, LABELS.slice(0, 4), values.indexOf(big ? Math.max(...values) : Math.min(...values)), {
        figure: tagged(xs.map((x) => expr(10, '-', x))),
        explain: `${xs.map((x, i) => `${LABELS[i]} ${expr(10, '-', x, '=', 10 - x)}`).join(', ')}이다. 10에서 빼는 수가 ${big ? '작을수록 결과가 크다' : '클수록 결과가 작다'}.`,
        facts: { choose: { exprs: xs.map((x) => `10-${x}`), rule: big ? 'max' : 'min' } }
      });
    }),
    T('tensub-versus', '10에서 뺀 두 식의 비교', '①46', (d) => {
      const [x, y] = d.shuffle(DIGITS).slice(0, 2);
      return C(COMPARE, SIGNS, signOf(10 - x, 10 - y), {
        figure: versus(expr(10, '-', x), expr(10, '-', y)), explain: `${expr(10, '-', x, '=', 10 - x)}, ${expr(10, '-', y, '=', 10 - y)}`,
        facts: { choose: { exprs: [`10-${x}`, `10-${y}`], rule: 'compare' } }
      });
    }),
    T('tensub-wrong', '잘못 계산한 식 고르기', '심36', (d) => {
      const xs = d.shuffle(DIGITS).slice(0, 4), bad = d.int(0, 3);
      const told = xs.map((x, i) => (i === bad ? d.pick([9 - x, 11 - x].filter((v) => v >= 1 && v <= 9)) : 10 - x));
      return C('잘못 계산한 것은?', LABELS.slice(0, 4), bad, {
        figure: tagged(xs.map((x, i) => expr(10, '-', x, '=', told[i]))), explain: `${LABELS[bad]}을 바르게 계산하면 ${expr(10, '-', xs[bad], '=', 10 - xs[bad])}이다.`,
        facts: { claimed: xs.map((x, i) => [`10-${x}`, told[i]]), claimedWant: false }
      });
    }),
    T('tensub-word', '문장제: 10에서 덜어 내고 남은 것', '①47 심38', (d) => {
      const k = d.int(2, 8);
      return N(`색종이가 10장 있었다. 그 가운데 ${k}장을 썼다. 남은 색종이는 몇 장인가?`, 10 - k, { unit: '장', explain: expr(10, '-', k, '=', 10 - k), facts: { calc: [[`10-${k}`, 0]] } });
    }),
    T('tensub-word-more', '문장제: 얼마나 더 많은가', '①48', (d) => {
      const b = d.int(2, 8);
      return N(`사탕이 10개, 초콜릿이 ${b}개 있다. 사탕은 초콜릿보다 몇 개 더 많은가?`, 10 - b, { unit: '개', explain: expr(10, '-', b, '=', 10 - b), facts: { calc: [[`10-${b}`, 0]] } });
    }),
    T('tensub-pic-more', '그림에서 세어 얼마나 더 많은지 구하기', '①42 심34 심41', (d) => {
      const b = d.int(3, 8);
      return N('○ 모양은 △ 모양보다 몇 개 더 많은가?', 10 - b, {
        unit: '개', figure: rowsOf([[10, 'red', 'circle'], [b, 'blue', 'triangle']], `두 줄: ○ 모양 10개, △ 모양 ${b}개`),
        explain: `○ 모양은 10개, △ 모양은 ${b}개이다. ${expr(10, '-', b, '=', 10 - b)}`, facts: { calc: [[`10-${b}`, 0]] }
      });
    }),
    T('tensub-word-gone', '문장제: 덜어 낸 수', '①49 심39', (d) => {
      const r = d.int(2, 8);
      return N(`초콜릿이 10개 있었다. 몇 개를 먹었더니 ${r}개가 남았다. 먹은 초콜릿은 몇 개인가?`, 10 - r, {
        unit: '개', explain: `${split(r)} ${expr(10, '-', 10 - r, '=', r)}`, facts: { calc: [[`10-${r}`, 0]] }
      });
    }),
    T('tensub-word-part', '문장제: 10에서 두 부분을 빼기', '심40', (d) => {
      const [a, b] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y && x + y <= 8);
      return N(`구슬이 10개 있다. 빨간 구슬이 ${a}개, 파란 구슬이 ${b}개이다. 나머지는 모두 노란 구슬이다. 노란 구슬은 몇 개인가?`, 10 - a - b, {
        unit: '개', explain: stepSub([10, a, b]), facts: { calc: [[`10-${a}-${b}`, 0]] }
      });
    }, { standard: THREE })
  ]);

  // ── 10을 만들어 더하기 ───────────────────────────────────────
  const row = (id, title, at) => T(id, title, '①51', (d) => {
    if (at === 'back') d.int(0, 9);   // 앞의 두 수가 짝인 문항과 같은 세 수가 나오지 않게 난수를 한 번 흘린다.
    const xs = ten3(d, at);
    return N('다음을 계산하시오.', sum(xs), { figure: expr(xs[0], '+', xs[1], '+', xs[2], '=', box()), explain: stepTen(xs), facts: { calc: [[E3(xs, '+'), 0]], rule: at } });
  });
  B.addTypes('1-2-2', 'make10', [
    row('make10-front', '10을 만들어 더하기(앞의 두 수)', 'front'),
    row('make10-back', '10을 만들어 더하기(뒤의 두 수)', 'back'),
    T('make10-steps', '10을 만들어 더하는 계산 과정', '①51 심42', (d, n) => {
      // 첫째는 앞의 두 수, 둘째는 뒤의 두 수로 10을 만든다.
      const front = n === 0, [a, b, c] = ten3(d, front ? 'front' : 'back');
      return M(`${front ? '앞' : '뒤'}의 두 수를 먼저 더하여 ${a} + ${b} + ${josa(c, '을/를')} 계산한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: 10 }, { label: LABELS[1], answer: a + b + c }], {
        figure: front ? lines([expr(a, '+', b, '=', box(LABELS[0])), expr(box(LABELS[0]), '+', c, '=', box(LABELS[1]))]) : lines([expr(b, '+', c, '=', box(LABELS[0])), expr(a, '+', box(LABELS[0]), '=', box(LABELS[1]))]),
        explain: stepTen([a, b, c]),
        facts: { calc: [[front ? `${a}+${b}` : `${b}+${c}`, 0], [`${a}+${b}+${c}`, 1]] }
      });
    }, { count: 2 }),
    T('make10-frame', '그림을 보고 10을 만들어 더하기', '①52 심42', (d) => {
      const [a, b, c] = ten3(d, 'front');
      return M('빨간색, 파란색, 초록색 ○의 수를 차례로 더한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: c }, { label: LABELS[1], answer: 10 + c }], {
        figure: tenPlus(Array.from({ length: 10 }, (_, i) => (i < a ? 'red' : 'blue')), c, 'green', `십 배열판에 빨간색 ○ ${a}개와 파란색 ○ ${b}개, 그 옆에 초록색 ○ ${c}개`) + expr(a, '+', b, '+', box(LABELS[0]), '=', box(LABELS[1])),
        explain: `빨간색 ○ ${a}개와 파란색 ○ ${b}개를 더하면 10개이다. 초록색 ○는 ${c}개이다. ${expr(10, '+', c, '=', 10 + c)}`,
        facts: { calc: [[String(c), 0], [`${a}+${b}+${c}`, 1]] }
      });
    }),
    T('make10-pair', '세 수 가운데 합이 10이 되는 두 수', '①53', (d) => {
      // 짝이 아닌 두 수의 합이 9나 11이어서 어림으로는 가릴 수 없다.
      const xs = d.until(() => ten3(d, where(d)), (v) => new Set(v).size === 3 && pairsOf(v).some(([x, y]) => Math.abs(x + y - 10) === 1));
      const opts = d.shuffle([[xs[0], xs[1]], [xs[1], xs[2]], [xs[0], xs[2]]]), right = opts.find(([x, y]) => x + y === 10);
      return C('세 수 가운데 합이 10이 되는 두 수는?', opts.map(both), opts.indexOf(right), {
        figure: ex3(xs, '+'), explain: `${expr(right[0], '+', right[1], '=', 10)}이다.`,
        facts: { choose: { exprs: opts.map(([x, y]) => `${x}+${y}`), rule: 'equals', target: 10 } }
      });
    }),
    T('make10-cannot', '10을 만들어 더할 수 없는 식', '①54', (d) => {
      // 없는 식도 두 수의 합이 9나 11이어서 아슬아슬하다.
      const none = d.until(() => [d.int(2, 8), d.int(2, 8), d.int(2, 8)], (v) => pairsIn(v).length === 0 && pairsOf(v).some(([x, y]) => Math.abs(x + y - 10) === 1));
      const rows = d.until(() => d.shuffle([ten3(d, 'front'), ten3(d, 'back'), ten3(d, where(d)), none]), (list) => new Set(list.map(key)).size === 4);
      const told = rows.map((v, i) => (v === none ? '' : `${LABELS[i]} ${both(pairsIn(v)[0].map((n) => v[n]))}`)).filter(Boolean).join(', ');
      return C('합이 10이 되는 두 수가 없는 식은?', LABELS.slice(0, 4), rows.indexOf(none), {
        figure: tagged(rows.map((v) => ex3(v, '+'))), explain: `${told}의 합이 10이다. ${LABELS[rows.indexOf(none)]}에는 합이 10이 되는 두 수가 없다.`,
        facts: { truth: rows.map((v) => pairsIn(v).length === 0), want: true }
      });
    }),
    T('make10-same', '10을 만든 뒤의 식 찾기', '①55', (d) => {
      // 3 + 7 + 6 은 10 + 6 과 같다. 틀린 보기는 짝인 수를 10에 더한 식이다.
      const front = d.bool(), xs = d.until(() => ten3(d, front ? 'front' : 'back'), (v) => new Set(v).size === 3);
      const k = front ? xs[2] : xs[0], mates = xs.filter((v) => v !== k);
      const others = d.shuffle(Array.from(new Set(mates.concat([k - 1, k + 1]))).filter((v) => v >= 1 && v <= 9 && v !== k)).slice(0, 3);
      const list = d.shuffle([k].concat(others));
      return C(`${xs[0]} + ${xs[1]} + ${josa(xs[2], '과/와')} 계산 결과가 같은 것은?`, list.map((v) => (front ? expr(10, '+', v) : expr(v, '+', 10))), list.indexOf(k), {
        explain: `${both(mates)}의 합이 10이다. ${stepTen(xs)}`,
        facts: { choose: { exprs: list.map((v) => (front ? `10+${v}` : `${v}+10`)), rule: 'equals', target: 10 + k } }
      });
    }),
    T('make10-versus', '10을 만들어 더한 두 식의 비교', '①56', (d) => {
      const [xs, ys] = d.until(() => [ten3(d, where(d)), ten3(d, where(d))], ([p, q]) => key(p) !== key(q) && Math.abs(sum(p) - sum(q)) <= 2);
      return C(COMPARE, SIGNS, signOf(sum(xs), sum(ys)), {
        figure: versus(ex3(xs, '+'), ex3(ys, '+')), explain: `${said3(xs, '+', sum(xs))}, ${said3(ys, '+', sum(ys))}`,
        facts: { choose: { exprs: [E3(xs, '+'), E3(ys, '+')], rule: 'compare' } }
      });
    }),
    T('make10-min', '10을 만들어 더한 결과가 가장 작은 식', '①57 심48', (d) => {
      const rows = d.until(() => [ten3(d, where(d)), ten3(d, where(d)), ten3(d, where(d))], (list) => new Set(list.map(sum)).size === 3);
      const values = rows.map(sum);
      return C('계산 결과가 가장 작은 것은?', LABELS.slice(0, 3), values.indexOf(Math.min(...values)), {
        figure: tagged(rows.map((xs) => ex3(xs, '+'))), explain: `${rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '+', sum(xs))}`).join(', ')}이다. 10을 만들고 남는 수가 작을수록 결과가 작다.`,
        facts: { choose: { exprs: rows.map((xs) => E3(xs, '+')), rule: 'min' }, rule: 'make10' }
      });
    }),
    T('make10-right', '바르게 계산한 식 고르기(10을 만들어 더하기)', '①58 심47', (d) => {
      const rows = d.until(() => [0, 1, 2, 3].map(() => ten3(d, where(d))), (list) => new Set(list.map(key)).size === 4);
      const good = d.int(0, 3);
      // 틀린 값: 짝인 수 하나를 10에 더한 값, 하나 크거나 작은 값
      const told = rows.map((xs, i) => {
        if (i === good) return sum(xs);
        const [p, q] = pairsIn(xs)[0];
        return d.pick([10 + xs[p], 10 + xs[q], sum(xs) - 1, sum(xs) + 1].filter((v) => v >= 11 && v <= 19 && v !== sum(xs)));
      });
      return C('바르게 계산한 것은?', LABELS.slice(0, 4), good, {
        figure: tagged(rows.map((xs, i) => said3(xs, '+', told[i]))), explain: rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '+', sum(xs))}`).join(', '),
        facts: { claimed: rows.map((xs, i) => [E3(xs, '+'), told[i]]), claimedWant: true, rule: 'make10' }
      });
    }),
    T('make10-blank', '답이 십몇인 덧셈식에서 □ 구하기', '①59 심46 심51', (d) => {
      // 8 + □ + 5 = 15: 15는 10과 5이므로 8과 □의 합이 10이다.
      const xs = ten3(d, where(d)), [i, j] = pairsIn(xs)[0], h = d.pick([i, j]), k = 3 - i - j, total = sum(xs), mate = xs[h === i ? j : i];
      const parts = [];
      xs.forEach((v, n) => { if (n) parts.push('+'); parts.push(n === h ? box() : v); });
      return N('□ 안에 알맞은 수는?', xs[h], {
        figure: expr.apply(null, parts.concat(['=', total])),
        explain: `${josa(total, '은/는')} 10과 ${xs[k]}이다. ${josa(mate, '과/와')} □의 합이 10이어야 하므로 □ 안에 알맞은 수는 ${xs[h]}이다.`,
        facts: { calc: [[`${total}-${xs.filter((_, n) => n !== h).join('-')}`, 0]], rule: 'make10-blank' }
      });
    }),
    T('make10-fill', '두 수의 합이 10이 되게 식 완성하기', '심45', (d) => {
      // 가운데 수를 비워 둔다. 앞(뒤)의 두 수의 합이 10이 되게 채우고 계산한다.
      const front = d.bool(), xs = ten3(d, front ? 'front' : 'back'), mate = front ? xs[0] : xs[2], k = front ? xs[2] : xs[0];
      return M(`${front ? '앞' : '뒤'}의 두 수의 합이 10이 되게 식을 완성하려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: xs[1] }, { label: LABELS[1], answer: sum(xs) }], {
        figure: expr(xs[0], '+', box(LABELS[0]), '+', xs[2], '=', box(LABELS[1])),
        explain: `${josa(mate, '과/와')} 더하여 10이 되는 수는 ${xs[1]}이다. ${front ? expr(10, '+', k, '=', 10 + k) : expr(k, '+', 10, '=', 10 + k)}`,
        facts: { calc: [[`10-${mate}`, 0], [front ? `10+${k}` : `${k}+10`, 1]] }
      });
    }),
    T('make10-cards', '수 카드 두 장을 골라 답이 십몇인 덧셈식 완성하기', '①60 심50', (d) => {
      // □ + □ + 4 = 14: 합이 10인 두 장은 한 쌍뿐이고, 틀린 보기는 합이 9나 11이다.
      const off = ([x, y]) => Math.abs(x + y - 10);
      const v = d.until(() => { const list = d.shuffle(DIGITS).slice(0, 4), k = d.int(2, 9); return { list, k, all: pairsOf(list) }; }, (o) => !o.list.includes(o.k) && o.all.filter((p) => off(p) === 0).length === 1 && o.all.filter((p) => off(p) === 1).length >= 2);
      const right = v.all.find((p) => off(p) === 0);
      const opts = d.shuffle(d.shuffle(v.all.filter((p) => off(p) === 1)).concat(d.shuffle(v.all.filter((p) => off(p) > 1))).slice(0, 3).concat([right]));
      return C('수 카드 두 장을 골라 □ 안에 넣으려고 한다. 알맞은 두 수는?', opts.map(([x, y]) => `${x}, ${y}`), opts.indexOf(right), {
        figure: cards(v.list) + expr(box(), '+', box(), '+', v.k, '=', 10 + v.k),
        explain: `${josa(10 + v.k, '은/는')} 10과 ${v.k}이다. □ 안의 두 수의 합이 10이어야 한다. 수 카드에서 합이 10인 두 수는 ${both(right)}이다.`,
        facts: { choose: { exprs: opts.map(([x, y]) => `${x}+${y}+${v.k}`), rule: 'equals', target: 10 + v.k } }
      });
    }),
    T('make10-dice', '주사위 세 개의 눈의 수의 합', '①62', (d) => {
      const xs = d.until(() => { const p = d.pick([[4, 6], [6, 4], [5, 5]]), k = d.int(1, 6); return d.bool() ? p.concat([k]) : [k].concat(p); }, (v) => pairsIn(v).length === 1);
      return N('주사위 세 개의 눈의 수를 모두 더한 값은?', sum(xs), {
        figure: dice(xs, `주사위 세 개의 눈: ${xs.join(', ')}`), explain: `눈의 수는 ${xs.join(', ')}이다. ${stepTen(xs)}`, facts: { calc: [[E3(xs, '+'), 0]] }
      });
    }),
    T('make10-triple', '합이 정해진 세 수 찾기', '심49 ①57', (d) => {
      // 식 없이 수만 보고 합이 10인 두 수를 찾아 더한다.
      const rows = d.until(() => [0, 1, 2, 3].map(() => d.shuffle(ten3(d, 'front'))), (list) => new Set(list.map(sum)).size === 4);
      const want = d.int(0, 3);
      return C(`세 수의 합이 ${sum(rows[want])}인 것은?`, rows.map((xs) => xs.join(', ')), want, {
        explain: `합이 10이 되는 두 수를 먼저 더한다. ${stepTen(rows[want])}`,
        facts: { choose: { exprs: rows.map((xs) => E3(xs, '+')), rule: 'equals', target: sum(rows[want]) } }
      });
    }),
    T('make10-chain', '화살표를 따라 더하기(더하는 두 수의 합이 10)', '심43', (d) => {
      // 5 → +3 → +7: 차례로 더하면 8 + 7 에서 막힌다. 3과 7을 더하면 10을 더하는 것과 같다.
      const [k, a, b] = ten3(d, 'back');
      return N('□ 안에 알맞은 수는?', k + 10, {
        figure: hop([k, '+' + a, '+' + b, box()]), explain: `${josa(a, '을/를')} 더하고 ${josa(b, '을/를')} 더하는 것은 10을 더하는 것과 같다. ${expr(k, '+', 10, '=', k + 10)}`,
        facts: { calc: [[`${k}+${a}+${b}`, 0]], rule: 'make10-chain' }
      });
    }),
    T('make10-word', '문장제: 세 가지를 모두 합치기(10 만들기)', '①63 심52', (d) => {
      const [a, b, c] = ten3(d, 'back');
      return N(`책꽂이에 동화책 ${a}권, 만화책 ${b}권, 그림책 ${c}권이 있다. 책꽂이에 있는 책은 모두 몇 권인가?`, a + b + c, { unit: '권', explain: stepTen([a, b, c]), facts: { calc: [[`${a}+${b}+${c}`, 0]] } });
    }),
    T('make10-word-first', '문장제: 두 번 쓴 것과 남은 것으로 처음 수 구하기', '①64', (d) => {
      const [a, b, c] = ten3(d, 'front');
      return N(`초콜릿을 어제 ${a}개 먹었다. 오늘 ${b}개를 더 먹었더니 ${c}개가 남았다. 처음에 있던 초콜릿은 몇 개인가?`, a + b + c, {
        unit: '개', explain: `처음에 있던 초콜릿은 먹은 것과 남은 것을 모두 더한 것이다. ${stepTen([a, b, c])}`, facts: { calc: [[`${a}+${b}+${c}`, 0]] }
      });
    }),
    T('make10-word-more', '문장제: 연달아 더 많다', '①65', (d) => {
      const [a, b, c] = ten3(d, 'front');
      return N(`파란 구슬은 ${a}개이다. 빨간 구슬은 파란 구슬보다 ${b}개 더 많다. 노란 구슬은 빨간 구슬보다 ${c}개 더 많다. 노란 구슬은 몇 개인가?`, a + b + c, {
        unit: '개', explain: `빨간 구슬은 ${expr(a, '+', b, '=', 10)}(개)이다. 노란 구슬은 ${expr(10, '+', c, '=', 10 + c)}(개)이다.`, facts: { calc: [[`${a}+${b}+${c}`, 0]] }
      });
    }),
    T('make10-odd', '계산 결과가 홀수인 식', '①67', (d) => {
      // 홀수는 1-2-1에서 20까지의 수로 배운다.
      const rows = d.until(() => [ten3(d, where(d)), ten3(d, where(d)), ten3(d, where(d))], (list) => list.filter((xs) => sum(xs) % 2 === 1).length === 1 && new Set(list.map(key)).size === 3);
      const at = rows.findIndex((xs) => sum(xs) % 2 === 1);
      return C('계산 결과가 홀수인 것은?', LABELS.slice(0, 3), at, {
        figure: tagged(rows.map((xs) => ex3(xs, '+'))), explain: `${rows.map((xs, i) => `${LABELS[i]} ${said3(xs, '+', sum(xs))}`).join(', ')}이다. 이 가운데 홀수는 ${sum(rows[at])}이다.`,
        facts: { truth: rows.map((xs) => sum(xs) % 2 === 1), want: true }
      });
    }),
    T('make10-order', '더하는 차례를 바꾼 두 계산의 결과', '①51', (d) => {
      // 교육과정: 앞에서부터 차례로 더한 결과와 합이 10이 되는 두 수를 먼저 더한 결과를 비교한다(결과는 같다).
      const [one, two] = d.shuffle(NAMES).slice(0, 2), [k, a, b] = ten3(d, 'back');
      return C(`${k} + ${a} + ${josa(b, '을/를')} 계산한다. ${name(one, '은/는')} 앞에서부터 차례로 더하였다. ${name(two, '은/는')} ${josa(a, '과/와')} ${josa(b, '을/를')} 먼저 더하였다. 두 사람의 계산 결과를 바르게 비교한 것은?`, [`${nick(one)}의 결과가 더 크다.`, '두 결과가 같다.', `${nick(two)}의 결과가 더 크다.`], 1, {
        explain: `세 수를 더할 때에는 어느 두 수를 먼저 더해도 결과가 같다. ${stepTen([k, a, b])}`,
        facts: { choose: { exprs: [`${k}+${a}+${b}`, `${k}+(${a}+${b})`], rule: 'compare' } }
      });
    })
  ]);

  // ── 실력 ─────────────────────────────────────────────────────
  // 앞의 여섯은 ① 상황·식의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제, 뒤의 넷은 ② 두 번 넘게 생각해야 풀리는 문제이다.
  B.addGroup('1-2-2', {
    id: 'hard', title: '실력 문제', standard: THREE,
    types: [
      H('h-sub-order', '세 수의 뺄셈을 바르게 계산한 사람', '심18 심19', (d) => {
        // 두 사람의 식은 줄마다 계산이 맞다. 뒤의 두 수를 먼저 빼면 안 된다는 것을 알아야 가릴 수 있다.
        //  - 바른 쪽: 앞에서부터 차례로 뺀 아이
        //  - 틀린 쪽: 「세 수의 계산은 아무 두 수나 먼저 해도 된다」고 아는 아이가 고른다
        const [one, two] = d.shuffle(NAMES).slice(0, 2), [a, b, c] = d.until(() => sub3(d), (xs) => xs[1] > xs[2]);
        const good = lines([expr(a, '-', b, '=', a - b), expr(a - b, '-', c, '=', a - b - c)]), bad = lines([expr(b, '-', c, '=', b - c), expr(a, '-', b - c, '=', a - b + c)]);
        const first = d.bool();
        return C(`${a} − ${b} − ${josa(c, '을/를')} 두 사람이 계산하였다. 바르게 계산한 사람은?`, [one, two], first ? 0 : 1, {
          figure: G.tiles([[one, first ? good : bad], [two, first ? bad : good]]),
          explain: `${a}에서 ${josa(b, '을/를')} 빼고, 다시 ${josa(c, '을/를')} 빼야 한다. ${stepSub([a, b, c])}이다. ${b}에서 ${josa(c, '을/를')} 먼저 빼면 결과가 달라진다.`,
          facts: { claimed: [[`${a}-${b}-${c}`, first ? a - b - c : a - b + c], [`${a}-${b}-${c}`, first ? a - b + c : a - b - c]], claimedWant: true }
        });
      }),
      H('h-equal', '= 의 양쪽이 같아지는 □', '심29', (d) => {
        // = 뒤를 답 자리로만 아는 아이는 2 + □ = 6 + 4 에서 6 − 2 = 4 를, 7 + 3 = □ + 5 에서 10 을 적는다.
        const [p, q] = d.until(() => { const x = d.int(1, 9); return [x, 10 - x]; }, ([x, y]) => x !== y);
        const k = d.until(() => d.int(1, 9), (v) => v !== p && v !== q && v !== 5), left = d.bool();
        return N('□ 안에 알맞은 수는?', 10 - k, {
          figure: left ? expr(k, '+', box(), '=', p, '+', q) : expr(p, '+', q, '=', box(), '+', k),
          explain: `${expr(p, '+', q, '=', 10)}이다. = 의 양쪽은 크기가 같으므로 ${josa(k, '과/와')} □의 합도 10이다. □ 안에 알맞은 수는 ${10 - k}이다.`,
          facts: { calc: [[`${p}+${q}-${k}`, 0]], rule: 'equal-sides' }
        });
      }, { standard: TEN }),
      H('h-first', '먹은 것과 남은 것으로 처음 수 구하기', '심32', (d) => {
        // 「먹었더니 … 남았다」에 끌려 6 − 4 를 하는 아이가 있다. 처음 수는 먹은 것과 남은 것을 합친 수이다.
        const a = d.int(6, 8), b = 10 - a;
        return N(`만두를 ${a}개 먹었더니 ${b}개가 남았다. 처음에 있던 만두는 몇 개인가?`, 10, {
          unit: '개', explain: `처음에 있던 만두는 먹은 만두와 남은 만두를 합친 것이다. ${expr(a, '+', b, '=', 10)}`, facts: { calc: [[`${a}+${b}`, 0]] }
        });
      }, { standard: TEN }),
      H('h-ends', '양 끝의 두 수로 10을 만들어 더하기', '①51의 짝을 양 끝에 둠', (d) => {
        // 이웃한 두 수만 묶으려는 아이는 10을 만들지 못한다(이웃한 두 수의 합은 10이 아니다).
        const xs = ten3(d, 'ends');
        return N('다음을 계산하시오.', sum(xs), {
          figure: expr(xs[0], '+', xs[1], '+', xs[2], '=', box()), explain: `${josa(xs[0], '과/와')} ${josa(xs[2], '을/를')} 먼저 더한다. ${stepTen(xs)}`,
          facts: { calc: [[E3(xs, '+'), 0]], rule: 'ends' }
        });
      }),
      H('h-can', '10을 만들어 더할 수 있는 식 고르기', '심44', (d) => {
        // 보기마다 고르는 아이가 다르다.
        //  - 정답: 합이 10인 두 수가 이웃해 있는 식
        //  - 세 수를 모두 더해야 10이 되는 식(2 + 5 + 3): 「10이 되는 식」으로만 기억한 아이가 고른다
        //  - 두 수의 합이 9나 11인 식 둘: 10에 가까운 두 수를 어림으로 묶는 아이가 고른다
        const good = ten3(d, where(d));
        const whole = d.until(() => add3(d, 10, 10), (v) => pairsIn(v).length === 0);
        const close = () => d.until(() => [d.int(2, 8), d.int(2, 8), d.int(2, 8)], (v) => pairsIn(v).length === 0 && sum(v) !== 10 && pairsOf(v).some(([x, y]) => Math.abs(x + y - 10) === 1));
        const rows = d.until(() => d.shuffle([good, whole, close(), close()]), (list) => new Set(list.map(key)).size === 4);
        const pair = pairsIn(good)[0].map((n) => good[n]);
        return C('합이 10이 되는 두 수를 먼저 더하여 계산할 수 있는 식은?', rows.map((v) => ex3(v, '+')), rows.indexOf(good), {
          explain: `${ex3(good, '+')}에는 합이 10인 두 수 ${both(pair)}${josa(pair[1], '이/가').slice(String(pair[1]).length)} 있다. ${ex3(whole, '+')}${josa(whole[2], '은/는').slice(String(whole[2]).length)} 세 수를 모두 더해야 10이 되고, 합이 10인 두 수는 없다.`,
          facts: { truth: rows.map((v) => pairsIn(v).length > 0), want: true }
        });
      }),
      H('h-extra', '묻는 것과 상관없는 수가 섞인 문장제', '①63 심52에 쓰지 않는 수를 섞음', (d) => {
        // 문제에 나온 수를 모두 더하는 아이는 접시의 귤까지 더한다. 무엇을 묻는지 읽고 더할 수만 골라야 한다.
        const [a, b, c] = ten3(d, 'back'), e = d.until(() => d.int(2, 9), (v) => v !== a && v !== b && v !== c);
        return N(`바구니에 사과 ${a}개, 배 ${b}개, 감 ${c}개가 있다. 접시에는 귤이 ${e}개 있다. 바구니에 있는 과일은 모두 몇 개인가?`, a + b + c, {
          unit: '개', explain: `접시에 있는 귤은 바구니에 있는 과일이 아니므로 더하지 않는다. ${stepTen([a, b, c])}`, facts: { calc: [[`${a}+${b}+${c}`, 0]] }
        });
      }),
      H('h-gap', '세 번 얻은 점수와 두 번 얻은 점수를 같게 하기', '심10', (d) => {
        // 세 수의 합, 두 수의 합, 모자란 점수의 세 단계. 식 하나로 잇지 않고 단계마다 따로 계산한다.
        const [one, two] = d.shuffle(NAMES).slice(0, 2), score = () => d.pick([1, 3, 5, 7]);
        const [xs, ys] = d.until(() => [[score(), score(), score()], [score(), score()]], ([p, q]) => sum(p) <= 9 && sum(p) > sum(q) && sum(p) - sum(q) <= 3 && Math.max(...q) >= 3 && !pairsOf(p).some((two) => key(two) === key(q)));   // 두 점수가 세 점수 안에 그대로 들어 있으면 셈하지 않아도 보인다.
        const s1 = sum(xs), s2 = sum(ys);
        return N(`두 사람이 공 던지기 놀이에서 얻은 점수이다. 두 사람의 점수가 같아지려면 ${name(two, '은/는')} 몇 점을 더 얻어야 하는가?`, s1 - s2, {
          unit: '점', figure: table(['이름', '얻은 점수'], [[one, xs.map((v) => v + '점').join(', ')], [two, ys.map((v) => v + '점').join(', ')]]),
          explain: `${name(one, '은/는')} ${said3(xs, '+', s1)}(점), ${name(two, '은/는')} ${expr(ys[0], '+', ys[1], '=', s2)}(점)을 얻었다. ${s2}에 ${josa(s1 - s2, '을/를')} 더하면 ${josa(s1, '이/가')} 된다.`,
          facts: { calc: [[`${xs.join('+')}-${ys.join('-')}`, 0]] }
        });
      }),
      H('h-need', '두 번 모은 뒤 10까지 모자란 수', '심33', (d) => {
        const [a, b] = d.until(() => [d.int(1, 5), d.int(1, 5)], ([x, y]) => x !== y && x + y >= 3 && x + y <= 8);
        return N(`붙임딱지를 어제 ${a}장, 오늘 ${b}장 받았다. 모두 10장이 되려면 몇 장을 더 받아야 하는가?`, 10 - a - b, {
          unit: '장', explain: `지금까지 받은 붙임딱지는 ${expr(a, '+', b, '=', a + b)}(장)이다. ${josa(a + b, '과/와')} 더하여 10이 되는 수는 ${10 - a - b}이다.`, facts: { calc: [[`10-${a}-${b}`, 0]] }
        });
      }, { standard: TEN }),
      H('h-left', '10을 만들고 남은 수가 더 큰 사람', '①39', (d) => {
        // 가장 큰 수 카드를 가진 사람이 남은 수는 더 작다.
        const [one, two] = d.shuffle(NAMES).slice(0, 2), left = (xs) => sum(xs) - 10, used = (xs) => pairsIn(xs)[0].map((n) => xs[n]);
        const [xs, ys] = d.until(() => [d.shuffle(ten3(d, 'front')), d.shuffle(ten3(d, 'front'))], ([p, q]) => left(p) !== left(q) && Math.max(...p) !== Math.max(...q) && (Math.max(...p) > Math.max(...q)) !== (left(p) > left(q)));
        const say = (who, cardsOf) => `${name(who, '은/는')} ${josa(used(cardsOf)[0], '과/와')} ${josa(used(cardsOf)[1], '을/를')} 내려놓아 ${josa(left(cardsOf), '이/가')} 남는다.`;
        return C('두 사람이 수 카드를 3장씩 가지고 있다. 합이 10이 되는 두 장을 내려놓았다. 남은 카드의 수가 더 큰 사람은?', [one, two], left(xs) > left(ys) ? 0 : 1, {
          figure: table(['이름', '수 카드'], [[one, xs.join(', ')], [two, ys.join(', ')]]), explain: `${say(one, xs)} ${say(two, ys)}`,
          facts: { choose: { exprs: [`${xs.join('+')}-10`, `${ys.join('+')}-10`], rule: 'max' } }
        });
      }),
      H('h-share', '모두 합친 수에서 한 사람의 몫 구하기', '①66', (d) => {
        const [one, two] = d.shuffle(NAMES).slice(0, 2), a = d.pick([2, 3, 4, 6, 7, 8]), b = 10 - a, k = d.until(() => d.int(2, 9), (v) => v !== a && v !== b);
        return N(`${name(one, '은/는')} 딸기 맛 사탕 ${a}개와 포도 맛 사탕 ${b}개를 가지고 있다. ${name(one, '과/와')} ${name(two, '이/가')} 가진 사탕은 모두 ${10 + k}개이다. ${nick(two)}의 사탕은 몇 개인가?`, k, {
          unit: '개', explain: `${nick(one)}의 사탕은 ${expr(a, '+', b, '=', 10)}(개)이다. ${josa(10 + k, '은/는')} 10과 ${k}이므로 ${nick(two)}의 사탕은 ${k}개이다.`, facts: { calc: [[`${10 + k}-${a}-${b}`, 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
