// 3학년 1학기 3단원 나눗셈 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록 넷(기본꼴 1~3, 심화꼴)을 처음부터 끝까지 다시 읽고, 3-1-3a.js·3-1-3b.js 의 유형이 묻지 않는 꼴을 옮겼다.
// 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다. ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번이다.
//
// 나눗셈은 모두 곱셈구구 범위(나누는 수와 몫이 2~9)이고 나머지가 없다.
//
// 뺀 것과 까닭
//  - 뒤 학기·위 학년: 남김없이 나눌 수 있는 경우 가리기·나눌 수 있는 수 찾기(①48 ①49 ②66 심7 심8 — 나머지는 3학년 2학기, 약수는 5학년),
//    나누는 방법을 모두 찾기(①15 ②50 — 곱이 되는 수의 짝을 모두 찾는 것은 약수), 끈으로 만든 정사각형의 한 변(①50, ②60·③53·심9의 정사각형 문제 — 둘레, 5학년),
//    몫이 같은 두 나눗셈의 등식(①47 ②55 심35 — 4학년 2학기), 종이를 잘라 정사각형 만들기(②65 — 가로·세로 두 방향으로 따지는 공간 문제),
//    보기에 곱셈구구 밖의 나눗셈이 섞인 것(심26·심44의 일부)
//  - 조건 풀이·경우 따지기: 숫자 카드로 두 자리 수를 만들어 식 맞추기(②33 ②34 ③51 심24 심54 심55), 합과 몫으로 두 수 찾기(심42),
//    간격(②64 심51), 일의 빠르기(심52), 쓰이지 않는 조건(심53), 변의 수로 도형 알아내기(심10), 모자란 수로 전체 구하기(③59), 다리 수(①55)
//  - 뜻 없는 셈: 여러 식의 □ 값 더하기(①46·심32의 일부), 두 몫의 차(②51)
//  - 서술형·그리기·놀이: ①2 ①31 ②1 ②22 ②41 ③9 ③30 ③37 ③62~66 심3 심13
//  - 묻는 틀만 다른 것(잇기, 화살표 상자 한 번, 여럿을 모두 고르기)은 이미 있는 유형과 같은 문제로 보아 싣지 않았다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, cards, dots, numberLine, lines, tagged, table, N, M, C, E } = B.kit;
  const MEAN = '4수01-05', CALC = '4수01-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 기본 자료에만 나오지만 두 번 넘게 계산해야 하는 문장제
  const HB = (id, title, ref, make, more) => T(id, title, ref, make, Object.assign({ level: '실력' }, more || {}));
  const DIGITS = [2, 3, 4, 5, 6, 7, 8, 9];
  // 곱셈구구 범위의 나눗셈: a ÷ b = q (b, q 는 2~9)
  const fact = (d, ok) => d.until(() => { const b = d.int(2, 9), q = d.int(2, 9); return [b * q, b, q]; }, ok || (() => true));
  const full = ([a, b, q]) => expr(a, '/', b, '=', q);
  // 곱셈구구 범위에서 total 을 나눌 수 있는 수(몫도 2~9)
  const divisorsOf = (total) => DIGITS.filter((b) => total % b === 0 && total / b >= 2 && total / b <= 9);
  // 식 뒤에 붙이는 토씨: 식의 마지막 수를 읽는 소리에 맞춘다.
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);

  // ── 똑같이 나누기 · 나눗셈식 읽고 쓰기 ─────────────────────────
  B.addTypes('3-1-3', 'share', [
    T('share-two', '두 가지 물건을 같은 수로 나누기', '①3 ②6 ③55', (d) => {
      // 풀 27개와 가위 15개를 3명이 → 9개, 5개
      const k = d.int(2, 9), [x, y] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p !== q);
      return M(`공책 ${k * x}권과 지우개 ${k * y}개를 ${k}명이 각각 똑같이 나누어 가지려고 한다. 한 명이 가지는 공책과 지우개는 각각 몇 권, 몇 개인가?`, [{ label: '공책', answer: x, unit: '권' }, { label: '지우개', answer: y, unit: '개' }], {
        explain: `공책은 ${expr(k * x, '/', k, '=', x)}(권), 지우개는 ${expr(k * y, '/', k, '=', y)}(개)이다.`, facts: { calc: [[E(k * x, '/', k), 0], [E(k * y, '/', k), 1]] }
      });
    }),
    T('share-most', '한 묶음의 수가 가장 큰 경우', '①5 ②5 심6', (d) => {
      // 같은 수를 나눌 때 나누는 수가 작을수록 몫이 크다. 접시가 많을수록 많이 담긴다고 여기는 아이는 가장 큰 수를 고른다.
      const total = d.pick([16, 18, 24, 36]), list = d.shuffle(divisorsOf(total)).slice(0, 3), least = Math.min(...list);
      return C(`딸기 ${total}개를 접시에 똑같이 나누어 담으려고 한다. 한 접시에 담는 딸기가 가장 많은 경우는?`, list.map((b) => `접시 ${b}개에 나누어 담을 때`), list.indexOf(least), {
        explain: list.slice().sort((x, y) => x - y).map((b) => `접시 ${b}개: ${expr(total, '/', b, '=', total / b)}(개)`).join(', ') + '. 접시의 수가 적을수록 한 접시에 많이 담는다.',
        facts: { choose: { exprs: list.map((b) => E(total, '/', b)), rule: 'max' } }
      });
    }),
    T('share-write', '말로 나타낸 나눗셈을 식으로', '①17 ②15 ③1 심16', (d) => {
      // 「8은 48을 6으로 나눈 몫이다」 → 48 ÷ 6 = 8. 말의 차례와 식의 차례가 다르다.
      const [a, b, q] = fact(d, ([, y, z]) => y !== z);
      return M('다음을 나눗셈식으로 나타낼 때, ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }, { label: LABELS[2], answer: q }], {
        figure: lines([`${josa(q, '은/는')} ${josa(a, '을/를')} ${josa(b, '으로/로')} 나눈 몫이다.`, expr(box(LABELS[0]), '/', box(LABELS[1]), '=', box(LABELS[2]))]),
        explain: `${josa(a, '을/를')} ${josa(b, '으로/로')} 나눈 몫이 ${q}이므로 ${expr(a, '/', b, '=', q)}이다.`, facts: { calc: [[E(b, '*', q), 0], [E(a, '/', q), 1], [E(a, '/', b), 2]] }
      });
    }),
    T('share-role', '몫이 정해진 나눗셈식 찾기', '①19 ②18 ③2', (d) => {
      // 몫이 8인 식: 8이 몫인 식, 8이 나누는 수인 식, 8이 없는 식
      const k = d.int(2, 9);
      const [x, y, other] = d.until(() => [d.int(2, 9), d.int(2, 9), fact(d)], ([p, q, f]) => p !== k && q !== k && f[1] !== k && f[2] !== k && new Set([k * p, k * q, f[0]]).size === 3);
      const rows = d.shuffle([[k * x, x, k], [k * y, k, y], other]);
      return C(`몫이 ${k}인 나눗셈식은?`, rows.map(full), rows.findIndex((f) => f[2] === k), {
        explain: `${expr(k * x, '/', x, '=', k)}에서 나누어지는 수는 ${k * x}, 나누는 수는 ${x}, 몫은 ${k}이다.`,
        facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: 'equals', target: k } }
      });
    }),
    T('share-sentence', '상황 문장을 나눗셈식으로', '①21 ②19 ③4 심18', (d) => {
      const [a, b, q] = fact(d, ([, y, z]) => y !== z);
      return M(`나무 ${a}그루를 ${b}줄로 똑같이 나누어 심었더니 한 줄에 ${q}그루씩 심게 되었다. 이것을 나눗셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: q }], {
        figure: expr(a, '/', box(LABELS[0]), '=', box(LABELS[1])), explain: `${a}그루를 ${b}줄로 똑같이 나누었으므로 ${expr(a, '/', b, '=', q)}이다.`,
        facts: { calc: [[E(a, '/', q), 0], [E(a, '/', b), 1]], divMeans: [a, b, q] }
      });
    })
  ]);

  // ── 똑같이 묶어 덜어 내기 ───────────────────────────────────────
  B.addTypes('3-1-3', 'group', [
    T('group-each', '한 묶음의 수가 빈칸인 문장', '①6', (d) => {
      // 풍선 54개를 한 명에게 □개씩 주면 9명에게 줄 수 있다 → 6
      const [a, b, q] = fact(d, ([, y, z]) => y !== z);
      return N(`붙임딱지 ${a}장을 한 명에게 □장씩 남김없이 나누어 주었더니 ${b}명이 받았다. □ 안에 알맞은 수는?`, q, {
        explain: `${expr(a, '/', box(), '=', b)}이다. ${expr(q, '*', b, '=', a)}이므로 □는 ${q}이다.`, facts: { calc: [[E(a, '/', b), 0]] }
      });
    }),
    T('group-situation', '덜어 내는 횟수와 묶음의 수', '①8 ②10 ③15 심12', (d) => {
      // 과자 12개를 2개씩 → 12에서 2를 6번 빼면 0, 6명
      const [a, k, n] = fact(d, ([, y, z]) => y !== z);
      return N(`젤리 ${a}개를 한 명에게 ${k}개씩 나누어 주려고 한다. □ 안에 공통으로 들어갈 수는?`, n, {
        figure: lines([`${a}에서 ${josa(k, '을/를')} ${box()}번 빼면 0이 된다.`, `젤리를 ${box()}명에게 줄 수 있다.`]),
        explain: `${k}개씩 덜어 낸 횟수가 젤리를 받는 사람의 수이다. ${expr(a, '/', k, '=', n)}`, facts: { calc: [[E(a, '/', k), 0]] }
      });
    }),
    T('group-vary', '한 묶음의 수를 바꾸어 덜어 내기', '①13 ②4', (d) => {
      // 종이띠 15 m를 3 m씩, 5 m씩
      const total = d.pick([12, 18, 24, 36]);
      const [x, y] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p < q && total % p === 0 && total % q === 0 && total / p <= 9 && total / q >= 2 && p * q !== total);
      return M(`길이가 ${total} cm인 색 테이프를 ${x} cm씩 자를 때와 ${y} cm씩 자를 때, 색 테이프는 각각 몇 도막이 되는가?`, [{ label: `${x} cm씩`, answer: total / x, unit: '도막' }, { label: `${y} cm씩`, answer: total / y, unit: '도막' }], {
        explain: `${expr(total, '/', x, '=', total / x)}, ${expr(total, '/', y, '=', total / y)}`, facts: { calc: [[E(total, '/', x), 0], [E(total, '/', y), 1]] }
      });
    }),
    T('group-count', '거듭 뺀 횟수로 몫 비교하기', '②13 ③17 심15', (d) => {
      // ㉠ 32에서 8을 4번 ㉡ 12에서 4를 3번 ㉢ 25에서 5를 5번. 처음 수가 가장 큰(작은) 것이 답이 되지 않게 한다.
      const big = d.bool(), best = (values) => (big ? Math.max(...values) : Math.min(...values));
      const rows = d.until(() => [fact(d), fact(d), fact(d)], (list) => {
        const qs = list.map((f) => f[2]), as = list.map((f) => f[0]);
        return new Set(qs).size === 3 && new Set(as).size === 3 && list.every((f) => f[1] !== f[2]) && as[qs.indexOf(best(qs))] !== best(as);
      });
      const qs = rows.map((f) => f[2]);
      return C(`나눗셈식으로 나타내었을 때 몫이 가장 ${big ? '큰' : '작은'} 것은?`, LABELS.slice(0, 3), qs.indexOf(best(qs)), {
        figure: tagged(rows.map(([a, k, n]) => `${a}에서 ${josa(k, '을/를')} ${n}번 빼면 0이 된다.`)),
        explain: '뺀 횟수가 몫이다. ' + rows.map((f, i) => `${LABELS[i]} ${full(f)}`).join(', '),
        facts: { choose: { exprs: rows.map(([a, k]) => E(a, '/', k)), rule: big ? 'max' : 'min' } }
      });
    }),
    T('group-story', '나눗셈식에 맞는 상황 문장', '①22 ②21 ③5 심18', (d) => {
      // 28 ÷ 4 = 7 → 배추 28포기를 4포기씩 묶으면 7묶음
      const [a, b, q] = fact(d, ([x, y, z]) => y !== z && ![28, 30, 32, 36, 72].includes(x));
      return M(`나눗셈식 ${a} ÷ ${b} = ${josa(q, '을/를')} 보고 문장을 완성할 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: q }], {
        figure: lines([`김밥 ${a}줄을 한 접시에 ${box(LABELS[0])}줄씩 담으면 ${box(LABELS[1])}접시가 된다.`]),
        explain: `${expr(a, '/', b, '=', q)}에서 나누는 수 ${josa(b, '은/는')} 한 접시에 담는 김밥의 수이고, 몫 ${josa(q, '은/는')} 접시의 수이다.`,
        facts: { calc: [[E(a, '/', q), 0], [E(a, '/', b), 1]], divMeans: [a, b, q] }
      });
    })
  ]);

  // ── 곱셈과 나눗셈의 관계 ───────────────────────────────────────
  B.addTypes('3-1-3', 'relate', [
    T('relate-not', '곱셈식으로 만들 수 없는 식', '①25 ②25 ②37 심22 심26', (d) => {
      // 3×8=24 → 24÷3=8, 24÷8=3 은 되고 24÷4=6 은 안 된다. 나누어지는 수가 같아 세 수를 모두 견주어야 가려지게, 곱이 같은 곱셈구구가 둘인 수만 쓴다.
      const twinsOf = (x, y, z) => divisorsOf(x).filter((v) => v !== y && v !== z).map((v) => [x, v, x / v]);
      const [a, b, q] = fact(d, ([x, y, z]) => y !== z && twinsOf(x, y, z).length > 0 && !(x === 24 && (y === 4 || y === 6)) && !(x === 18 && (y === 3 || y === 6)));
      const wrong = d.pick(twinsOf(a, b, q));
      const rows = d.shuffle([[full([a, b, q]), true], [full([a, q, b]), true], [expr(q, '*', b, '=', a), true], [full(wrong), false]]);
      return C(`곱셈식 ${b} × ${q} = ${josa(a, '을/를')} 보고 만들 수 없는 식은?`, rows.map(([html]) => html), rows.findIndex(([, ok]) => !ok), {
        explain: `곱셈식의 세 수 ${b}, ${q}, ${josa(a, '으로/로')} 된 식만 만들 수 있다. ${full(wrong)}의 세 수는 이와 다르다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('relate-array-not', '그림에 맞지 않는 식', '②27 심19 심22', (d) => {
      // 7개씩 3줄: 7×3=21, 21÷3=7, 21÷7=3 은 맞고 줄 수를 잘못 센 식은 맞지 않는다.
      const [a, c, r] = fact(d, ([, y, z]) => y >= 4 && z <= 5 && y !== z);
      const miss = d.until(() => r + d.pick([-1, 1]), (v) => v >= 2 && v !== c);
      const wrong = d.bool() ? expr(c, '*', miss, '=', c * miss) : full([c * miss, c, miss]);
      const rows = d.shuffle([[expr(c, '*', r, '=', a), true], [full([a, c, r]), true], [full([a, r, c]), true], [wrong, false]]);
      return C('그림을 보고 만든 식으로 알맞지 않은 것은?', rows.map(([html]) => html), rows.findIndex(([, ok]) => !ok), {
        figure: dots(r, c), explain: `${c}개씩 ${r}줄이므로 모두 ${a}개이다. 그림에 맞는 식은 ${expr(c, '*', r, '=', a)}, ${full([a, c, r])}, ${full([a, r, c])}이다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('relate-line', '수직선을 곱셈식과 나눗셈식으로', '①28 ②28 ③29 심21', (d) => {
      // 3씩 6번 뛰어 18 → 3×6=18, 18÷3=6. 끝 수는 적지 않는다.
      const [a, k, n] = fact(d, ([x, y, z]) => x <= 30 && y <= 6 && z >= 3 && z <= 6 && y !== z && ![15, 18, 20].includes(x));
      return M('수직선을 보고 곱셈식과 나눗셈식을 완성할 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: a }], {
        figure: numberLine(a, k, { hideEnd: true }) + lines([expr(k, '*', box(LABELS[0]), '=', box(LABELS[1])), expr(box(LABELS[1]), '/', k, '=', box(LABELS[0]))]),
        explain: `0부터 ${k}씩 ${n}번 뛰었다. ${expr(k, '*', n, '=', a)}, ${expr(a, '/', k, '=', n)}`, facts: { calc: [[E(a, '/', k), 0], [E(k, '*', n), 1]] }
      });
    }),
    T('relate-sentence', '「몇씩 몇 줄」을 곱셈식과 나눗셈식으로', '②29 ③24', (d) => {
      // 포도 8송이씩 2줄 → 8×2=16, 16÷2=8
      const [a, c, r] = fact(d, ([, y, z]) => y !== z);
      return M(`의자가 한 줄에 ${c}개씩 ${r}줄 놓여 있다. 이것을 곱셈식과 나눗셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: r }], {
        figure: lines([expr(c, '*', r, '=', box(LABELS[0])), expr(box(LABELS[0]), '/', box(LABELS[1]), '=', c)]),
        explain: `${expr(c, '*', r, '=', a)}이므로 ${expr(a, '/', r, '=', c)}이다.`, facts: { calc: [[E(c, '*', r), 0], [`${c}*${r}/${c}`, 1]] }
      });
    }),
    T('relate-max', '곱이 가장 큰 곱셈식을 나눗셈식으로', '①30 심23', (d) => {
      // 4, 6, 9, 3 → 6×9=54 → 54÷9=6
      const list = d.shuffle(DIGITS).slice(0, 4), [x, y] = list.slice().sort((p, q) => q - p);
      return M('수 카드 4장 중에서 2장을 골라 곱이 가장 큰 곱셈식을 만들고, 이를 나눗셈식으로 나타내었다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: x * y }, { label: LABELS[1], answer: y }], {
        figure: cards(list) + expr(box(LABELS[0]), '/', x, '=', box(LABELS[1])),
        explain: `가장 큰 두 수 ${x}, ${josa(y, '을/를')} 곱한다. ${expr(x, '*', y, '=', x * y)}이므로 ${expr(x * y, '/', x, '=', y)}이다.`,
        facts: { calc: [[E(x, '*', y), 0], [`${x}*${y}/${x}`, 1]] }
      });
    }),
    T('relate-three', '세 수로 몫이 가장 큰 나눗셈식 만들기', '①29 ②31 ③27 ③52 심23', (d) => {
      // 5, 9, 45 → 45÷5=9
      const [a, b, q] = fact(d, ([, y, z]) => y !== z), small = Math.min(b, q), big = Math.max(b, q);
      return N('수 카드 3장을 한 번씩 모두 사용하여 몫이 가장 큰 나눗셈식 □ ÷ □ = □를 만들었다. 이 나눗셈식의 몫은?', big, {
        figure: cards(d.shuffle([a, b, q])),
        explain: `${full([a, big, small])}, ${full([a, small, big])}${tail(big, '을/를')} 만들 수 있다. 몫이 더 큰 식은 ${full([a, small, big])}이다.`,
        facts: { calc: [[E(a, '/', small), 0]] }
      });
    })
  ]);

  // ── 나눗셈의 몫 구하기 ─────────────────────────────────────────
  B.addTypes('3-1-3', 'quot', [
    T('quot-pair', '나눗셈식과 곱셈식의 □', '①34 ②38 ③32 ③34 심27', (d) => {
      // 48÷8=□, 8×□=48
      const [a, b, q] = fact(d, ([x, y, z]) => y !== z && ![48, 30, 72, 63, 18, 16].includes(x));
      return N('□ 안에 공통으로 들어갈 수는?', q, {
        figure: lines([expr(a, '/', b, '=', box()), expr(b, '*', box(), '=', a)]), explain: `${expr(b, '*', q, '=', a)}이므로 ${expr(a, '/', b, '=', q)}이다.`, facts: { calc: [[E(a, '/', b), 0]] }
      });
    }),
    T('quot-word-times', '문장제의 몫을 구하는 곱셈식', '①35 ②40 ③35 심27', (d) => {
      // 옥수수 42개를 6명이 → 42÷6 → 6×7=42
      const [a, b, q] = fact(d, ([, y, z]) => y !== z && y >= 3 && z >= 3 && z <= 8 && y - 1 !== z);
      const twin = divisorsOf(a).filter((x) => x !== b && x !== q).map((x) => [x, a / x])[0];
      const list = d.shuffle([[b, q], [b, q + 1], [b - 1, q], twin || [q, q]]);
      return C(`달걀 ${a}개를 바구니 ${b}개에 똑같이 나누어 담으려고 한다. 바구니 한 개에 담는 달걀의 수를 구하는 데 필요한 곱셈식은?`, list.map(([x, y]) => expr(x, '*', y, '=', x * y)), list.findIndex(([x, y]) => x === b && y === q), {
        explain: `식은 ${expr(a, '/', b)}이다. ${josa(b, '과/와')} 곱하여 ${josa(a, '이/가')} 되는 수를 찾으면 ${expr(b, '*', q, '=', a)}이므로 바구니 한 개에 ${q}개씩 담는다.`,
        facts: { times: { a, b, options: list } }
      });
    }),
    T('quot-which', '몫을 구할 때 이용하는 곱셈구구의 단', '①37 ②42 ③39', (d) => {
      // 27÷9 → 2단, 7단, 9단 중 9단. 곱이 나누어지는 수가 되는 다른 단(27÷9의 3단)은 보기에 넣지 않는다.
      const outside = (x) => DIGITS.filter((k) => x % k !== 0);
      const [a, b, q] = fact(d, ([x]) => outside(x).length >= 3);
      const list = d.shuffle([b].concat(d.shuffle(outside(a)).slice(0, 3)));
      return C(`${a} ÷ ${b}의 몫을 구할 때 이용할 수 있는 곱셈구구는?`, list.map((k) => `${k}단`), list.indexOf(b), {
        explain: `${josa(b, '과/와')} 곱하여 ${josa(a, '이/가')} 되는 수를 찾아야 하므로 ${b}단 곱셈구구를 이용한다. ${expr(b, '*', q, '=', a)}이므로 몫은 ${q}이다.`,
        facts: { truth: list.map((k) => a % k === 0 && a / k <= 9), want: true }
      });
    }),
    T('quot-look', '곱셈표에서 몫 찾기', '①38 ②44 ③40 심28', (d) => {
      // 8단 줄에서 32÷8=4, □÷8=9
      const b = d.int(3, 9), start = d.int(2, 5), ms = [0, 1, 2, 3, 4].map((i) => start + i), [m1, m2] = d.shuffle(ms);
      return M(`${b}단 곱셈구구를 나타낸 표를 보고 식을 완성할 때, ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: m1 }, { label: LABELS[1], answer: b * m2 }], {
        figure: table(['×', String(b)], ms.map((m) => [m, b * m])) + lines([expr(b * m1, '/', b, '=', box(LABELS[0])), expr(box(LABELS[1]), '/', b, '=', m2)]),
        explain: `표에서 ${expr(b, '*', m1, '=', b * m1)}이므로 ${expr(b * m1, '/', b, '=', m1)}이고, ${expr(b, '*', m2, '=', b * m2)}이므로 ${expr(b * m2, '/', b, '=', m2)}이다.`,
        facts: { calc: [[E(b * m1, '/', b), 0], [E(b, '*', m2), 1]] }
      });
    }),
    T('quot-row', '같은 수로 여러 수 나누기', '①41 ②45 ③43', (d) => {
      // 12, 24, 30, 54 를 6으로
      const b = d.int(3, 9), qs = d.shuffle(DIGITS).slice(0, 3);
      return M('빈칸 ㉠, ㉡, ㉢에 알맞은 수는?', qs.map((q, i) => ({ label: LABELS[i], answer: q })), {
        figure: table(['수', `÷ ${b}`], qs.map((q, i) => [b * q, box(LABELS[i])])), explain: qs.map((q) => expr(b * q, '/', b, '=', q)).join(', '),
        facts: { calc: qs.map((q, i) => [E(b * q, '/', b), i]) }
      });
    }),
    T('quot-max', '몫이 가장 큰(작은) 나눗셈', '①43 ②48 ③49 심30', (d) => {
      // 25÷5, 16÷2, 54÷6, 18÷9. 나누어지는 수가 가장 큰(작은) 식이 답이 되지 않게 한다.
      const big = d.bool(), best = (values) => (big ? Math.max(...values) : Math.min(...values));
      const rows = d.until(() => [fact(d), fact(d), fact(d), fact(d)], (list) => {
        const qs = list.map((f) => f[2]), as = list.map((f) => f[0]);
        return new Set(as).size === 4 && qs.filter((v) => v === best(qs)).length === 1 && as[qs.indexOf(best(qs))] !== best(as);
      });
      const qs = rows.map((f) => f[2]);
      return C(`몫이 가장 ${big ? '큰' : '작은'} 나눗셈은?`, rows.map(([a, b]) => expr(a, '/', b)), qs.indexOf(best(qs)), {
        explain: rows.map(full).join(', '), facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: big ? 'max' : 'min' } }
      });
    }),
    T('quot-order', '몫이 큰 것부터 차례로 쓰기', '②48 ③49 심30', (d) => {
      const order = (values) => [0, 1, 2].sort((x, y) => values[y] - values[x]);
      const rows = d.until(() => [fact(d), fact(d), fact(d)], (list) => new Set(list.map((f) => f[2])).size === 3 && new Set(list.map((f) => f[0])).size === 3
        && order(list.map((f) => f[2])).join() !== order(list.map((f) => f[0])).join());
      const right = order(rows.map((f) => f[2]));
      // 나누어지는 수가 큰 차례(수만 보는 아이), 몫이 작은 것부터(차례를 거꾸로 쓴 아이)를 보기에 넣고 나머지 한 자리는 다른 차례로 채운다.
      const picked = [];
      for (const o of [right, order(rows.map((f) => f[0])), right.slice().reverse()].concat(d.shuffle([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]))) {
        if (picked.length < 4 && !picked.some((p) => p.join() === o.join())) picked.push(o);
      }
      const orders = d.shuffle(picked);
      return C('몫이 큰 것부터 차례로 기호를 쓴 것은?', orders.map((o) => o.map((i) => LABELS[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: rows.map((f, i) => `${LABELS[i]} ${full(f)}`).join(', '),
        facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: 'descending', orders } }
      });
    }),
    T('quot-same', '몫이 같은 두 나눗셈', '①44 ③47 심31', (d) => {
      // 24÷8 — 15÷5
      const rows = d.until(() => { const q = d.int(2, 9), [b1, b2] = d.shuffle(DIGITS); return d.shuffle([[b1 * q, b1, q], [b2 * q, b2, q], fact(d), fact(d)]); },
        (list) => new Set(list.map((f) => f[0])).size === 4 && new Set(list.map((f) => f[2])).size === 3);
      const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], hit = pairs.find(([i, j]) => rows[i][2] === rows[j][2]);
      const shown = d.shuffle([hit].concat(d.shuffle(pairs.filter((p) => p !== hit)).slice(0, 3)));
      return C('몫이 같은 두 나눗셈을 찾아 기호를 쓴 것은?', shown.map(([i, j]) => `${LABELS[i]}, ${LABELS[j]}`), shown.indexOf(hit), {
        figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: rows.map((f, i) => `${LABELS[i]} ${full(f)}`).join(', '),
        facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: 'same', pairsShown: shown } }
      });
    }),
    T('quot-some', '어떤 수 구하기', '①46 ②36 ③50 심33 심40', (d) => {
      // 어떤 수를 5로 나누면 몫이 9 → 45
      const [a, b, q] = fact(d, ([, y, z]) => y !== z);
      return N(`어떤 수를 ${josa(b, '으로/로')} 나누었더니 몫이 ${josa(q, '이/가')} 되었다. 어떤 수는?`, a, {
        explain: `어떤 수를 □라 하면 ${expr(box(), '/', b, '=', q)}이다. ${expr(b, '*', q, '=', a)}이므로 어떤 수는 ${a}이다.`, facts: { calc: [[E(b, '*', q), 0]] }
      });
    }),
    T('quot-box-odd', '□에 알맞은 수가 다른 식', '②53 심34', (d) => {
      // 48÷□=8, 30÷□=5, 42÷□=7, 63÷□=9 → 넷째만 7
      const rows = d.until(() => {
        const x = d.int(3, 8), other = d.pick([x - 1, x + 1]), at = d.int(0, 3);
        return d.shuffle(DIGITS).slice(0, 4).map((q, i) => { const b = i === at ? other : x; return [b * q, b, q]; });
      }, (list) => new Set(list.map((f) => f[0])).size === 4);
      const lone = rows.findIndex((f) => rows.filter((g) => g[1] === f[1]).length === 1);
      return C('□ 안에 알맞은 수가 나머지 셋과 다른 것은?', LABELS, lone, {
        figure: tagged(rows.map(([a, , q]) => expr(a, '/', box(), '=', q))),
        explain: rows.map((f, i) => `${LABELS[i]} ${full(f)}`).join(', ') + `이므로 □ 안에 알맞은 수는 차례로 ${rows.map((f) => f[1]).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map(([a, , q]) => E(a, '/', q)), rule: 'odd' } }
      });
    }),
    T('quot-common', '두 식에 공통으로 들어갈 수', '②54', (d) => {
      // 36÷□=9, □÷2=2 → 4
      const [b, r] = d.pick([[2, 2], [2, 3], [3, 2], [2, 4], [4, 2], [3, 3]]), x = b * r, q = d.until(() => d.int(2, 9), (v) => v !== r && v !== x);
      return N('두 식의 □ 안에 공통으로 들어갈 수는?', x, {
        figure: lines([expr(x * q, '/', box(), '=', q), expr(box(), '/', b, '=', r)]), explain: `${expr(x * q, '/', x, '=', q)}, ${expr(x, '/', b, '=', r)}이므로 □는 ${x}이다.`,
        facts: { calc: [[E(x * q, '/', q), 0], [E(b, '*', r), 0]] }
      });
    }),
    T('quot-linked', '이어진 두 식의 모르는 수', '②56 심39', (d) => {
      // 40÷●=8, 30÷▲=● → ●=5, ▲=6
      const [a, x, q] = fact(d, ([, y, z]) => y !== z), y = d.until(() => d.int(2, 9), (v) => v !== x && v !== q && x * v !== a), c = x * y;
      return M('같은 모양은 같은 수를 나타낸다. ●, ▲에 알맞은 수는?', [{ label: '●', answer: x }, { label: '▲', answer: y }], {
        figure: lines([expr(a, '/', '●', '=', q), expr(c, '/', '▲', '=', '●')]),
        explain: `${expr(a, '/', x, '=', q)}이므로 ●는 ${x}이다. ${expr(c, '/', y, '=', x)}이므로 ▲는 ${y}이다.`,
        facts: { calc: [[E(a, '/', q), 0], [`${c}/(${a}/${q})`, 1]] }
      });
    }),
    T('quot-cards', '수 카드로 만든 두 자리 수 나누기', '①56', (d) => {
      // 5, 7, 3 → 가장 작은 두 자리 수 35 를 남은 수 7 로 나눈다
      const sets = [];
      for (let x = 1; x <= 7; x += 1) for (let y = x + 1; y <= 8; y += 1) for (let z = y + 1; z <= 9; z += 1) if ((x * 10 + y) % z === 0 && (x * 10 + y) / z >= 2 && (x * 10 + y) / z <= 9 && x * 10 + y !== 35) sets.push([x, y, z]);
      const [x, y, z] = d.pick(sets), a = x * 10 + y;
      return N('수 카드 3장 중에서 2장을 골라 가장 작은 두 자리 수를 만들고, 이 수를 남은 수 카드의 수로 나누었다. 몫은?', a / z, {
        figure: cards(d.shuffle([x, y, z])), explain: `가장 작은 두 자리 수는 ${a}이고 남은 수는 ${z}이다. ${expr(a, '/', z, '=', a / z)}`,
        facts: { calc: [[E(a, '/', z), 0]], unseen: [a] }
      });
    })
  ]);

  // ── 실력 문제 ──────────────────────────────────────────────────
  // 곱이 같은 곱셈구구가 둘인 수: [나누어지는 수, 나누는 수, 몫, 곱만 같은 곱셈식의 두 수]
  const TWINS = [];
  for (const a of [12, 18, 24, 36]) for (const b of divisorsOf(a)) for (const x of divisorsOf(a)) if (b !== a / b && x !== b && x !== a / b) TWINS.push([a, b, a / b, x, a / x]);

  B.addTypes('3-1-3', 'hard', [
    H('h-friends', '나누는 사람 수가 글에 숨어 있는 문장제', '심4 ②60', (d) => {
      // 젤리 48개를 민수와 친구 7명이 → 8명 → 6개. 친구 수로만 나누어도 나누어지는 수를 고른다.
      const who = d.pick(NAMES), k = d.pick([2, 3, 4, 6, 7, 8]), a = k * (k + 1);
      return N(`${name(who, '이/가')} 친구 ${k}명과 함께 딱지 ${a}장을 똑같이 나누어 가지려고 한다. 한 명이 몇 장씩 가질 수 있는가?`, k, {
        unit: '장', explain: `${nick(who)}와 친구 ${k}명은 모두 ${k + 1}명이다. ${expr(a, '/', k + 1, '=', k)}`, facts: { calc: [[`${a}/(${k}+1)`, 0]], unseen: [1] }
      });
    }),
    H('h-gap', '두 몫을 비교하여 차 구하기', '심47 ①16 ②63 ③56', (d) => {
      // 축구공 24÷3=8, 농구공 36÷4=9 → 농구공이 1개 더 많다. 전체가 많은 쪽이 한 명 몫은 적게 한다.
      const [one, two] = d.shuffle(NAMES).slice(0, 2), team = [nick(one) + '네 모둠', nick(two) + '네 모둠'];
      const [f1, f2] = d.until(() => [fact(d), fact(d)], ([p, q]) => p[2] !== q[2] && p[1] !== q[1] && p[0] !== q[0] && (p[0] > q[0]) !== (p[2] > q[2]));
      const winner = f1[2] > f2[2] ? 0 : 1, gap = Math.abs(f1[2] - f2[2]);
      const other = [Math.abs(f1[1] - f2[1]), gap + 1].find((v) => v !== gap);
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
      return C(`${team[0]}은 사탕 ${f1[0]}개를 ${f1[1]}명이 똑같이 나누어 가지고, ${team[1]}은 사탕 ${f2[0]}개를 ${f2[1]}명이 똑같이 나누어 가졌다. 한 명이 가진 사탕은 어느 모둠이 몇 개 더 많은가?`, list.map(([i, n]) => `${team[i]}, ${n}개`), list.findIndex(([i, n]) => i === winner && n === gap), {
        explain: `${team[0]}은 ${full(f1)}(개)씩, ${team[1]}은 ${full(f2)}(개)씩 가졌다. ${expr(Math.max(f1[2], f2[2]), '-', Math.min(f1[2], f2[2]), '=', gap)}`,
        facts: { who: { exprs: [E(f1[0], '/', f1[1]), E(f2[0], '/', f2[1])], values: [f1[2], f2[2]], options: list } }
      });
    }),
    H('h-twice', '두 번 이어 나누는 문장제', '심48 ①54 ②52', (d) => {
      // 바나나 24개를 바구니 3개에(8개), 한 바구니를 접시 2개에 → 4개
      const [m, c, n] = fact(d, ([x]) => x <= 9), b = d.until(() => d.int(2, 9), (v) => v !== c), a = m * b;
      return N(`감자 ${a}개를 상자 ${b}개에 똑같이 나누어 담았다. 그중 한 상자에 담은 감자를 ${c}명이 똑같이 나누어 가지면 한 명이 몇 개씩 가지는가?`, n, {
        unit: '개', explain: `한 상자에 ${expr(a, '/', b, '=', m)}(개)씩 담았다. 이것을 ${c}명이 나누어 가지면 ${expr(m, '/', c, '=', n)}(개)씩이다.`,
        facts: { calc: [[`${a}/${b}/${c}`, 0]] }
      });
    }),
    HB('h-times', '몇 배인 수에서 처음 수를 구해 다시 몇 배 하기', '③60', (d) => {
      // 8월 27권이 6월의 3배, 7월은 6월의 2배 → 6월 9권, 7월 18권
      const [a, k, q] = fact(d, ([, y, z]) => y <= 6 && y !== z), m = d.until(() => d.int(2, 6), (v) => v !== k);
      return N(`빨간 색종이는 ${a}장이고, 이것은 파란 색종이 수의 ${k}배이다. 노란 색종이 수는 파란 색종이 수의 ${m}배이다. 노란 색종이는 몇 장인가?`, q * m, {
        unit: '장', explain: `파란 색종이는 ${expr(a, '/', k, '=', q)}(장)이다. 노란 색종이는 ${expr(q, '*', m, '=', q * m)}(장)이다.`,
        facts: { calc: [[`${a}/${k}*${m}`, 0]] }
      });
    }),
    H('h-sum', '합친 뒤 나누기', '심45', (d) => {
      // 사탕 27개와 37개를 한 봉지에 8개씩 → 64÷8=8. 두 수 모두 한 묶음보다 많지만 따로는 나누어지지 않고 합쳐야 나누어진다.
      const k = d.int(3, 9), n = d.int(3, 9), total = k * n, p = d.until(() => d.int(k + 1, total - k - 1), (v) => v % k !== 0 && v * 2 !== total), r = total - p;
      return N(`동화책 ${p}권과 과학책 ${r}권을 책꽂이 한 칸에 ${k}권씩 모두 꽂으려고 한다. 책꽂이는 몇 칸 필요한가?`, n, {
        unit: '칸', explain: `책은 모두 ${expr(p, '+', r, '=', total)}(권)이다. ${expr(total, '/', k, '=', n)}`, facts: { calc: [[`(${p}+${r})/${k}`, 0]] }
      });
    })
  ]);

  // 덧문서(꼴 목록을 만들 때 잘려 빠졌던 문서 뒷부분)에서 보탠 꼴. 나머지는 이미 있는 유형과 같은 문제였다
  // (뺀 뒤 나누기 → h-rest, 잘못 나눈 것 바로잡기·어떤 수를 구해 다시 나누기 → h-wrong, 합친 뒤 나누기 → h-sum). 간격을 두고 나무 심기는 경우 따지기라 뺐다.
  B.addTypes('3-1-3', 'quot', [
    T('quot-bundles', '묶음과 낱개로 준 수 나누기', '덧문서', (d) => {
      const [a, b, q] = fact(d, ([x]) => x > 20 && x % 10 !== 0), tens = Math.floor(a / 10), ones = a % 10;
      return N(`누름 못이 10개씩 ${tens}묶음과 낱개 ${ones}개 있다. 그림 한 장을 붙이는 데 누름 못이 ${b}개 필요할 때, 그림을 몇 장 붙일 수 있는가?`, q, {
        unit: '장', explain: `누름 못은 모두 ${a}개이다. ${expr(a, '/', b, '=', q)}`, facts: { calc: [[`(10*${tens}+${ones})/${b}`, 0]] }
      });
    })
  ]);
  B.addTypes('3-1-3', 'hard', [
    H('h-both-sides', '두 몫 사이에 들어갈 수', '덧문서', (d) => {
      const low = d.int(2, 6), b1 = d.int(2, 9), b2 = d.until(() => d.int(2, 9), (v) => v !== b1), a1 = low * b1, a2 = (low + 2) * b2;
      return N('두 식의 □ 안에 공통으로 들어갈 수 있는 수는?', low + 1, {
        figure: lines([`${a1} ÷ ${b1} &lt; □`, `□ &lt; ${a2} ÷ ${b2}`]), explain: `${expr(a1, '/', b1, '=', low)}이므로 □는 ${low}보다 크고, ${expr(a2, '/', b2, '=', low + 2)}이므로 □는 ${low + 2}보다 작다. ${low}보다 크고 ${low + 2}보다 작은 수는 ${low + 1}이다.`,
        facts: { calc: [[`${a1}/${b1}+1`, 0], [`${a2}/${b2}-1`, 0]], unseen: [1] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
