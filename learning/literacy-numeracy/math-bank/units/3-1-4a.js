// 3학년 1학기 4단원 곱셈 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 10종의 평가 자료(단원평가·형성평가·수학익힘·수행평가 196개 문서)에 나온 문제 꼴을 세 덩이로 나누어 모은
// 목록(기본꼴 1~3, 모두 222꼴)에서 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
// (천재 박만구 교과서는 이 단원이 5단원이라 그 책의 자료는 5단원 폴더에서 가져왔다.)
//
// 고른 기준
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 가로셈·세로셈과 한 번 계산하는 문장제만 묶음마다 싣되(올림이 달라 다른 계산이다)
//    문장제는 묶음마다 얼개를 달리한다(묶음, 몇 배, 이어 붙인 길이, 날마다, 글에 숨은 수).
//    묶음마다 되풀이되는 수 모형 그림·자리별 곱 세로셈·「두 수의 곱」 빈칸은 한 번만 싣는다.
//  - 식 쓰기·계산 방법 설명하기·문제 만들기 같은 서술형, 빙고·말판·암호 놀이는 싣지 않는다.
//  - 곱셈은 모두 (두 자리 수)×(한 자리 수)까지다. (세 자리 수)×(한 자리 수)와 (두 자리 수)×(두 자리 수)는 3학년 2학기 것이다.
//  - 곱하는 수 □ 구하기(25×□=175)는 싣지 않는다. 곱에서 거꾸로 찾는 것은 두 자리 수로 나누는 나눗셈(4학년)이다.
//  - 두 단계 이상이거나 거꾸로 생각해야 하는 꼴은 실력 문항으로 보냈다(3-1-4b.js).
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, column, columnSteps, chars, counters, chain, numberLine, lines, tagged, numbers, N, M, C, E, mulPair, mulCarries, MUL } = B.kit;
  const CALC = '4수01-04', EST = '4수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const times = (a, b) => expr(a, '*', b, '=', a * b);
  // 가로셈·세로셈: 묶음마다 올림 조건만 바꿔 쓴다.
  const across = (rule) => (d) => {
    const [a, b] = mulPair(d, rule);
    return N('다음을 계산하시오.', a * b, { figure: expr(a, '*', b, '=', box()), explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]], mul: [a, b], rule: true } });
  };
  const down = (rule) => (d) => {
    const [a, b] = mulPair(d, rule);
    return N('다음을 계산하시오.', a * b, { figure: column(chars(a), '*', [String(b)]), explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]], mul: [a, b], rule: true } });
  };
  // 곱이 같은 (두 자리 수)×(한 자리 수)가 여럿인 수(계산 결과가 같은 식 찾기에 쓴다)
  const factorings = (p) => [2, 3, 4, 5, 6, 7, 8, 9].filter((b) => p % b === 0 && p / b >= 11 && p / b <= 99).map((b) => [p / b, b]);
  const MANY = []; for (let p = 40; p <= 400; p += 1) if (factorings(p).length >= 3) MANY.push(p);
  // 곱이 정한 수 가까이에 오는 (몇십몇)×(몇). 견주는 문항은 곱이 몰려 있어야 계산해야 풀린다.
  const near = (d, center, spread) => d.until(() => { const list = factorings(center + d.int(-spread, spread)).filter(([x]) => x % 10 !== 0); return list.length ? d.pick(list) : null; }, Boolean);

  B.addUnit({
    id: '3-1-4', grade: 3, semester: 1, no: 4, title: '곱셈', version: 7,
    groups: [
      {
        id: 'tens', title: '(몇십)×(몇)', standard: CALC,
        types: [
          T('tens-calc', '(몇십)×(몇) 계산', '①1 ②1 ③5', across((c, a) => MUL.tens(c, a) && a >= 20)),
          T('tens-add', '같은 수를 거듭 더한 식을 곱셈식으로', '①3 ②4 ③2', (d) => {
            // 30+30+30=30×□=□
            const a = d.pick([30, 40, 50]), n = d.int(3, 4);
            return M('덧셈식을 곱셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: a * n }], {
              figure: lines(['<span class="mb-expr">' + Array.from({ length: n }, () => a).join(' <i>+</i> ') + '</span>', expr('=', a, '*', box(LABELS[0]), '=', box(LABELS[1]))]),
              explain: `${josa(a, '을/를')} ${n}번 더한 것이다. ` + times(a, n), facts: { repeatAdd: { a, n } }
            });
          }),
          T('tens-relate', '(몇)×(몇)과 (몇십)×(몇)', '①4 ②3 ③3', (d) => {
            // 3×3=□, 30×3=□
            const [c, b] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: c * b }, { label: LABELS[1], answer: c * 10 * b }], {
              figure: lines([expr(c, '*', b, '=', box(LABELS[0])), expr(c * 10, '*', b, '=', box(LABELS[1]))]),
              explain: `${times(c, b)}이고, ${josa(c * 10, '은/는')} ${c}의 10배이므로 ${times(c * 10, b)}이다.`, facts: { calc: [[E(c, '*', b), 0], [E(c * 10, '*', b), 1]] }
            });
          }),
          T('tens-line', '수직선으로 (몇십)×(몇) 구하기', '②49 ③4', (d) => {
            const step = 20, n = d.int(3, 5);
            return M('수직선을 보고 곱셈식을 완성할 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: step * n }], {
              figure: numberLine(step * n, step, { tick: 10, hideEnd: true, length: 230 }) + expr(step, '*', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `0부터 ${step}씩 ${n}번 뛰었다. ` + times(step, n), facts: { calc: [[String(n), 0], [E(step, '*', n), 1]] }
            });
          }),
          T('tens-word', '문장제: 몇십씩 몇 묶음', '①5 ②9 ③7', (d) => {
            const [a, b] = mulPair(d, (c, x) => MUL.tens(c, x) && x >= 20);
            return N(`색종이가 한 묶음에 ${a}장씩 ${b}묶음 있다. 색종이는 모두 몇 장인가?`, a * b, { unit: '장', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'plain', title: '올림이 없는 (몇십몇)×(몇)', standard: CALC,
        types: [
          T('plain-calc', '가로셈', '①9 ②10 ③14', across(MUL.none)),
          T('plain-col', '세로셈', '①9 ②10 ③14', down(MUL.none)),
          T('plain-model', '그림 보고 곱셈식 완성하기', '①10 ②11 ③11', (d) => {
            // 12씩 3묶음 → 12×□=□
            const [a, b] = mulPair(d, (c, x, y) => MUL.none(c, x) && x <= 44 && x % 10 <= 4 && y <= 4);
            return M('그림을 보고 곱셈식을 완성할 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a * b }], {
              figure: counters(a, b) + expr(a, '*', box(LABELS[0]), '=', box(LABELS[1])),
              explain: `한 줄에 ${a}씩 ${b}줄이다. ` + times(a, b), facts: { calc: [[String(b), 0], [E(a, '*', b), 1]] }
            });
          }),
          T('plain-split', '몇십과 몇으로 갈라 곱하기', '①11 ②13 ③12', (d) => {
            // 32×3 = 30×3 + 2×3
            const [a, b] = mulPair(d, (c, x) => MUL.none(c, x) && x % 10 >= 2), tens = Math.floor(a / 10) * 10, ones = a % 10;
            return M(`${a} × ${josa(b, '을/를')} 몇십과 몇으로 갈라 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: tens * b }, { label: LABELS[1], answer: ones * b }, { label: LABELS[2], answer: a * b }], {
              figure: lines([expr(tens, '*', b, '=', box(LABELS[0])), expr(ones, '*', b, '=', box(LABELS[1])), expr(a, '*', b, '=', box(LABELS[2]))]),
              explain: `${times(tens, b)}, ${times(ones, b)}이고, 두 곱을 더하면 ${a * b}이다.`, facts: { calc: [[E(tens, '*', b), 0], [E(ones, '*', b), 1], [E(a, '*', b), 2]] }
            });
          }),
          T('plain-word', '문장제: 몇 배', '②51 ③16', (d) => {
            const [a, b] = mulPair(d, MUL.none);
            return N(`도서관에 동화책이 ${a}권 있고, 과학책은 동화책의 ${b}배만큼 있다. 과학책은 몇 권인가?`, a * b, { unit: '권', explain: `${a}의 ${b}배는 ${times(a, b)}이다.`, facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'upper', title: '십의 자리에서 올림이 있는 (몇십몇)×(몇)', standard: CALC,
        types: [
          T('upper-calc', '가로셈', '①13 ②18 ③18', across(MUL.upper)),
          T('upper-col', '세로셈', '①13 ②18 ③18', down(MUL.upper)),
          T('upper-steps', '자리별 곱을 적는 세로셈', '①15 ②14 ③13', (d) => {
            // 42×4 → 8, 160, 168
            const [a, b] = mulPair(d, (c, x) => MUL.upper(c, x) && x % 10 >= 2), ones = a % 10, tens = a - ones;
            return M(`${a} × ${josa(b, '을/를')} 다음과 같이 계산하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: ones * b }, { label: LABELS[1], answer: tens * b }, { label: LABELS[2], answer: a * b }], {
              figure: columnSteps(chars(a), '*', [String(b)], [box(LABELS[0]), box(LABELS[1])], box(LABELS[2]), [`← ${ones} × ${b}`, `← ${tens} × ${b}`]),
              explain: `${times(ones, b)}, ${times(tens, b)}이고, 두 곱을 더하면 ${expr(ones * b, '+', tens * b, '=', a * b)}이다.`,
              facts: { calc: [[E(ones, '*', b), 0], [E(tens, '*', b), 1], [E(a, '*', b), 2]], mul: [a, b] }
            });
          }),
          T('upper-word', '문장제: 겹치지 않게 이어 붙인 길이', '②53 ③16', (d) => {
            const [a, b] = mulPair(d, MUL.upper);
            return N(`길이가 ${a} cm인 리본 ${b}개를 겹치지 않게 한 줄로 이어 붙였다. 이어 붙인 리본의 전체 길이는 몇 cm인가?`, a * b, { unit: 'cm', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'ones', title: '일의 자리에서 올림이 있는 (몇십몇)×(몇)', standard: CALC,
        types: [
          T('ones-calc', '가로셈', '①17 ②20 ③22', across(MUL.ones)),
          T('ones-col', '세로셈', '①17 ②20 ③22', down(MUL.ones)),
          T('ones-carry', '올림한 수와 그 수가 나타내는 값', '①20·21 ②16·21 ③25', (d) => {
            // 14×6=84 에서 십의 자리 위에 작게 쓴 2 는 20 을 나타낸다.
            const [a, b] = mulPair(d, MUL.ones), up = Math.floor(((a % 10) * b) / 10);
            return M(`${a} × ${josa(b, '을/를')} 계산한 세로셈이다. ㉠에 알맞은 수와 ㉠이 실제로 나타내는 값은?`, [{ label: LABELS[0], answer: up }, { label: '나타내는 값', answer: up * 10 }], {
              figure: column(chars(a), '*', [String(b)], chars(a * b), [box(LABELS[0]), '']),
              explain: `일의 자리 계산 ${times(a % 10, b)}에서 ${up * 10}을 십의 자리로 올림한다. ㉠은 ${up}이고 ${up * 10}을 나타낸다.`,
              facts: { carry: [a, b], mul: [a, b] }
            });
          }),
          T('ones-model', '그림으로 올림 알아보기', '①18 ②12 ③21', (d) => {
            // 16씩 3줄: 1이 18개 → 10이 1개, 1이 8개
            const [a, b] = mulPair(d, (c, x, y) => MUL.ones(c, x) && x <= 29 && y <= 4 && ((x % 10) * y) % 10 !== 0), ones = a % 10, all = ones * b;
            return M(`그림은 ${a}씩 ${b}줄을 나타낸 것이다. 1은 모두 ${box(LABELS[0])}개이고, 이것은 10이 ${box(LABELS[1])}개, 1이 ${box(LABELS[2])}개인 수와 같다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: all }, { label: LABELS[1], answer: Math.floor(all / 10) }, { label: LABELS[2], answer: all % 10 }], {
              figure: counters(a, b), explain: `1은 한 줄에 ${ones}개씩 ${b}줄이므로 ${times(ones, b)}(개)이다. 1이 10개이면 10이 1개가 되므로 10이 ${Math.floor(all / 10)}개, 1이 ${all % 10}개인 수와 같다. ${times(a, b)}`,
              facts: { calc: [[`${ones}*${b}`, 0], [`(${ones}*${b}-(${ones}*${b})%10)/10`, 1], [`(${ones}*${b})%10`, 2]], mul: [a, b] }
            });
          }),
          T('ones-word', '문장제: 날마다 같은 양', '①23 ②23 ③24', (d) => {
            const [a, b] = mulPair(d, MUL.ones), who = d.pick(NAMES);
            return N(`${name(who, '은/는')} 피아노를 하루에 ${a}분씩 ${b}일 동안 연습하였다. 연습한 시간은 모두 몇 분인가?`, a * b, { unit: '분', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          })
        ]
      },
      {
        id: 'both', title: '올림이 두 번 있는 (몇십몇)×(몇)', standard: CALC,
        types: [
          T('both-calc', '가로셈', '①24 ②24 ③27', across(MUL.both)),
          T('both-col', '세로셈', '①24 ②24 ③27', down(MUL.both)),
          T('both-fix', '잘못 계산한 세로셈 바로잡기', '①39 ②39 ③30', (d) => {
            // 64×5 를 올림한 수를 더하지 않아 300 이라고 한 것
            const [a, b] = mulPair(d, MUL.both), wrong = Math.floor(a / 10) * b * 10 + ((a % 10) * b) % 10;
            return N(`다음은 ${a} × ${josa(b, '을/를')} 잘못 계산한 것이다. 바르게 계산한 값은?`, a * b, {
              figure: column(chars(a), '*', [String(b)], chars(wrong)),
              explain: `일의 자리에서 올림한 수를 십의 자리 계산에 더하지 않았다. 바르게 계산하면 ${times(a, b)}이다.`,
              facts: { calc: [[E(a, '*', b), 0]], mul: [a, b], wrongValue: wrong }
            });
          }),
          T('both-word', '문장제: 한 번에 타는 사람 수', '①28 ②25 ③29', (d) => {
            const [a, b] = mulPair(d, MUL.both);
            return N(`유람선 한 척에 ${a}명씩 탈 수 있다. 유람선 ${b}척에 탈 수 있는 사람은 모두 몇 명인가?`, a * b, { unit: '명', explain: times(a, b), facts: { calc: [[E(a, '*', b), 0]] } });
          }),
          T('both-hidden', '문장제: 곱하는 수가 글에 숨어 있는 경우', '①55 ②54 ③62', (d) => {
            const a = d.until(() => d.int(24, 89), (v) => MUL.both(mulCarries(v, 7))), who = d.pick(NAMES);
            return N(`${name(who, '은/는')} 훌라후프를 하루에 ${a}번씩 일주일 동안 매일 돌렸다. 훌라후프를 모두 몇 번 돌렸는가?`, a * 7, { unit: '번', explain: `일주일은 7일이다. ` + times(a, 7), facts: { calc: [[E(a, '*', 7), 0]], unseen: [7] } });
          })
        ]
      },
      {
        id: 'mix', title: '여러 가지 곱셈', standard: CALC,
        types: [
          T('mix-match', '식과 곱 짝 짓기', '①36 ②28 ③33', (d) => {
            const base = d.int(90, 420);
            const pairs = d.until(() => [near(d, base, 30), near(d, base, 30), near(d, base, 30)], (list) => new Set(list.map(([x, y]) => x * y)).size === 3 && new Set(list.map(([x]) => x)).size === 3);
            const values = pairs.map(([x, y]) => x * y);
            const list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C('식과 계산 결과를 알맞게 짝 지은 것은?', list.map((o) => o.map((k, i) => `${LABELS[i]} ${values[k]}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(pairs.map(([x, y]) => expr(x, '*', y))), explain: pairs.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { match: { exprs: pairs.map(([x, y]) => E(x, '*', y)), options: list.map((o) => o.map((k) => values[k])) } }
            });
          }),
          T('mix-compare', '두 곱의 크기 비교', '①29 ②30 ③35', (d) => {
            const base = d.int(70, 450);
            const [[a, b], [c, e]] = d.until(() => [near(d, base, 12), near(d, base, 12)], ([p, q]) => p[0] !== q[0] && p[1] !== q[1]);
            const x = a * b, y = c * e;
            return C('두 식의 계산 결과를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : x === y ? 1 : 2, {
              figure: versus(expr(a, '*', b), expr(c, '*', e)), explain: `${times(a, b)}, ${times(c, e)}`, facts: { choose: { exprs: [E(a, '*', b), E(c, '*', e)], rule: 'compare' } }
            });
          }),
          T('mix-order', '곱이 큰 것부터 차례대로', '①32 ②32 ③38', (d) => {
            const base = d.int(80, 430);
            const rows = d.until(() => [near(d, base, 20), near(d, base, 20), near(d, base, 20)], (list) => { const v = list.map(([x, y]) => x * y).sort((p, q) => p - q); return v[1] - v[0] >= 2 && v[2] - v[1] >= 2 && new Set(list.map(([x]) => x)).size === 3; });
            const values = rows.map(([x, y]) => x * y), right = [0, 1, 2].sort((p, q) => values[q] - values[p]);
            const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C('계산 결과가 큰 것부터 차례대로 나열한 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
              figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'descending', orders: list } }
            });
          }),
          T('mix-above', '기준 수보다 큰(작은) 곱 고르기', '①35 ②33 ③36', (d) => {
            // 200보다 큰 것: ㉠ 32×4 ㉡ 43×3 ㉢ 61×7
            const target = d.pick([100, 150, 200, 300]), above = d.bool();
            const rows = d.until(() => [near(d, target, 45), near(d, target, 45), near(d, target, 45)], (list) => {
              const v = list.map(([x, y]) => x * y);
              return v.every((p) => p !== target) && v.filter((p) => (above ? p > target : p < target)).length === 1 && new Set(v).size === 3 && new Set(list.map(([x]) => x)).size === 3;
            });
            const at = rows.findIndex(([x, y]) => (above ? x * y > target : x * y < target));
            return C(`계산 결과가 ${target}보다 ${above ? '큰' : '작은'} 것은?`, LABELS.slice(0, 3), at, {
              figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: above ? 'onlyAbove' : 'onlyBelow', target } }
            });
          }),
          T('mix-odd', '계산 결과가 다른 식 찾기', '①34 ②35 ③39', (d) => {
            // ㉠ 24×8 ㉡ 64×3 ㉢ 28×9 ㉣ 96×2
            const p = d.pick(MANY), same = d.shuffle(factorings(p)).slice(0, 3);
            const other = d.until(() => mulPair(d, MUL.any), ([x, y]) => x * y !== p && Math.abs(x * y - p) <= 30 && same.every(([sx]) => sx !== x));
            const at = d.int(0, 3), rows = same.slice(0, at).concat([other], same.slice(at));
            return C('계산 결과가 나머지 셋과 다른 것은?', LABELS, at, {
              figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'odd' } }
            });
          }),
          T('mix-right', '바르게 계산한 식 고르기', '①38 ②38 ③32', (d) => {
            // 43×3=139, 52×4=208, 71×3=231 가운데 맞는 것
            const rows = d.until(() => [mulPair(d, MUL.upper), mulPair(d, MUL.ones), mulPair(d, MUL.both)], (list) => new Set(list.map(([x]) => x)).size === 3);
            const good = d.int(0, 2), order = d.shuffle([0, 1, 2]);
            // 틀린 값: 올림한 수를 빠뜨리거나 10을 더 올린 것
            const said = rows.map(([x, y], i) => (i === good ? x * y : x * y + (mulCarries(x, y)[0] ? -10 : 10)));
            const shownRows = order.map((i) => [rows[i][0], rows[i][1], said[i]]);
            return C('바르게 계산한 것은?', LABELS.slice(0, 3), order.indexOf(good), {
              figure: tagged(shownRows.map(([x, y, v]) => expr(x, '*', y, '=', v))), explain: shownRows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', '),
              facts: { claimed: shownRows.map(([x, y, v]) => [E(x, '*', y), v]), claimedWant: true }
            });
          }),
          T('mix-ends', '가장 큰 수와 가장 작은 수의 곱', '①44 ②44 ③43', (d) => {
            // 21, 6, 13, 31 → 31×6
            const [big, small] = mulPair(d, (c, x, y) => MUL.any(c, x) && x >= 24 && y <= 7 && (c[0] || c[1]));
            const others = d.until(() => [d.int(11, big - 1), d.int(small + 1, 9)], ([p, q]) => p % 10 !== 0 && p !== q);
            const list = d.shuffle([big, small].concat(others));
            return N('가장 큰 수와 가장 작은 수의 곱은?', big * small, { figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + times(big, small), facts: { mulEnds: list } });
          }),
          T('mix-chain', '이어 곱하기', '①45 ②27 ③48', (d) => {
            // 12 ×2 → 24 ×4 → 96
            const [a, b] = d.until(() => [d.int(11, 33), d.int(2, 4)], ([x, y]) => x * y <= 99 && x % 10 !== 0 && (x * y) % 10 !== 0), c = d.until(() => d.int(2, 9), (v) => v !== b);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a * b }, { label: LABELS[1], answer: a * b * c }], {
              figure: chain([a, '×' + b, box(LABELS[0]), '×' + c, box(LABELS[1])]), explain: `${times(a, b)}, ${times(a * b, c)}`,
              facts: { calc: [[E(a, '*', b), 0], [`${a}*${b}*${c}`, 1]] }
            });
          }),
          T('mix-say', '나타내는 수가 다른 표현 찾기', '①42 ②36 ③41', (d) => {
            // 13×4 와 다른 것: 13을 4번 더한 수, 13의 4배, 10×4와 3×4의 합, 13과 5의 곱
            const [a, b] = mulPair(d, (c, x, y) => MUL.any(c, x) && y >= 3 && y <= 8), ones = a % 10, tens = a - ones;
            const list = d.shuffle([
              [`${josa(a, '을/를')} ${b}번 더한 수`, Array.from({ length: b }, () => a).join('+')],
              [`${a}의 ${b}배`, E(a, '*', b)],
              [`${tens} × ${josa(b, '과/와')} ${ones} × ${b}의 합`, `${tens}*${b}+${ones}*${b}`],
              d.bool() ? [`${josa(a, '과/와')} ${b + 1}의 곱`, E(a, '*', b + 1)] : [`${a} × ${b - 1}에 ${josa(b, '을/를')} 더한 수`, `${a}*${b - 1}+${b}`]
            ]);
            const at = list.findIndex(([, text]) => text !== Array.from({ length: b }, () => a).join('+') && text !== E(a, '*', b) && text !== `${tens}*${b}+${ones}*${b}`);
            return C(`${a} × ${josa(b, '과/와')} 계산 결과가 다른 것은?`, list.map(([said]) => said), at, {
              explain: `${times(a, b)}이다. ${list[at][0]}만 계산 결과가 다르다.`, facts: { choose: { exprs: list.map(([, text]) => text), rule: 'odd' }, mul: [a, b] }
            });
          }),
          T('mix-about', '어림하여 곱에 가장 가까운 수 고르기', '③73 ①72', (d) => {
            // 49×6 → 50×6=300
            const a = d.until(() => d.int(18, 92), (v) => [1, 2, 8, 9].includes(v % 10)), b = d.int(3, 8), about = Math.round(a / 10) * 10 * b;
            const list = d.shuffle([about, about - b * 10, about + b * 10]);
            return C(`${a} × ${b}의 곱에 가장 가까운 수는?`, list.map(String), list.indexOf(about), {
              explain: `${josa(a, '은/는')} ${Math.round(a / 10) * 10}에 가깝다. ${times(Math.round(a / 10) * 10, b)}이므로 곱은 ${about}에 가깝다.`,
              facts: { choose: { exprs: list.map(String), rule: 'nearest', target: a * b }, mul: [a, b] }
            });
          }, { standard: EST }),
          T('mix-estimate', '어림셈', '①70 ②22 ③71', (d) => {
            // 28은 약 30, 28×6은 약 180
            const a = d.until(() => d.int(18, 92), (v) => [1, 2, 8, 9].includes(v % 10)), b = d.int(3, 8), about = Math.round(a / 10) * 10;
            return M(`${josa(a, '을/를')} 가장 가까운 몇십으로 어림하여 ${a} × ${b}의 값을 어림하려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: about }, { label: LABELS[1], answer: about * b }], {
              figure: lines([`${josa(a, '은/는')} 약 ${box(LABELS[0])}이다.`, `${a} × ${josa(b, '은/는')} 약 ${box(LABELS[1])}이다.`]),
              explain: `${josa(a, '은/는')} ${about}에 가깝다. ${times(about, b)}`, facts: { mulEstimate: [a, b] }
            });
          }, { standard: EST })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
