// 3학년 2학기 2단원 나눗셈 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록 넷(기본꼴 1~3, 심화꼴)과 덧문서(꼴 목록을 만들 때 빠졌던 문서 뒷부분)를 처음부터 끝까지 다시 읽고,
// 3-2-2a.js·3-2-2b.js 의 유형이 묻지 않는 꼴을 옮겼다. 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다.
// ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번, 「덧」은 덧문서이다.
//
// 앞에서 「같은 일」이라며 한 번만 실었던 것 가운데 하는 일이 다른 것을 따로 실었다.
//  - 주는 것이 다른 것: 10과 1로 나타내어 나누어 놓은 그림, 묶어 놓은 그림, 백 모형이 든 수 모형, 수직선, 표, 끝난 세로셈, 틀린 세로셈, 자릿값으로 적은 수
//  - 묻는 것이 다른 것: 차례, 다른 하나, 기준보다 큰 것, 개수, 남는 것만, 식을 두고 한 말의 참·거짓
//  - 계산 구조가 다른 것: 몫이 두 자리인 세 자리 나눗셈의 과정, 몫에 0이 있는 과정, 세 자리 수를 이어 나누기
//  - 문장제의 얼개가 다른 것: 덜어 낸 뒤 나누기, 따로 나누어 더하기, 나머지끼리 비교하기, 나눈 몫에 곱하기, 곱한 뒤 나누어 더 필요한 수
//    (「곱한 뒤 나누어 더 필요한 수」는 앞에서 세 단계라며 뺐던 것이다. 세 번 모두 이 학년의 계산이고 수집본에 세 번 나와 실력에 실었다.)
//
// 뺀 것과 까닭
//  - 위 학년: 나누어떨어지게 하는 나누는 수·자리 숫자·범위 안의 수(①46 ①47 ②39 ②40 ③36 ③37 심35 심63, 5학년 약수와 배수),
//    네 변의 길이의 합으로 한 변 구하기(①55 ②92 ③21 심76, 심24의 정사각형 문제 — 둘레, 5학년),
//    두 식의 값이 같게 하는 □(②76 ③69 심54, 4학년 2학기 등식), 나누는 수 구하기(심46 — 거꾸로 푸는 방정식 꼴)
//  - 조건 풀이·경우 따지기: 조건 여럿에 맞는 수(①51 ②41 ③38 심67 심68), 수 카드로 몫이 가장 큰(작은) 식 만들기(①49 ①50 ②80 ②81 ③71 ③72 심65),
//    숫자가 가려진 세로셈(①26 ②84 심62), 두 몫 사이의 수 세기(②77 심56), 간격(②93 심80), 일의 양(③76 심81), 빠르기와 시각(심82)
//  - 뜻 없는 셈: 몫과 나머지의 합(①24 ②28 ③31), 두 몫의 합·차(①42 ②74 ③65 심50), 몫과 나머지를 이어 쓴 수(②53 ③32 심33)
//  - 서술형·만들기·놀이·앞 학기: ①39 ①63 ①64 ①70 ①71 ②65 ②82 ②95 ②96 ②97 ②98 ③15 ③40 ③64 심40 심83 심84
//  - 이야기·단위만 다른 것: 어떤 수를 구해 다른 수로 다시 나누기(①36 ②62 ③56 심42 — h-wrong 과 같은 얼개), 시간을 분으로 바꾸어 나누기(③48 — three-unit)
//  - 묻는 틀만 다른 것: 잇기(①33 ②59 ②71 ③52 ③63 심38), 문장제를 풀고 확인식까지(①38 ②66), 확인하는 방법을 낱말로(②55),
//    (몇십)÷(몇)의 세로셈 빈칸(②3 — down-steps 와 같은 과정), 색칠한 칸의 식(③17 — down-notes), 칸 수가 다른 상자 고르기(심25 — rest-exact)
//  - 그림이 필요해 미룬 것: 줄마다 번호를 붙인 세로셈에서 틀린 줄 고르기(②83의 변형, 심61 — 세로셈의 줄에 번호를 붙이는 도구가 없다)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, divSteps, longDivision, blocks, counters, dots, numberLine, cards, chain, lines, tagged, numbers, table, N, M, C, E } = B.kit;
  const SOLVE = '4수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 기본 자료에만 나오지만 두 번 넘게 계산해야 하는 문장제
  const HB = (id, title, ref, make, more) => T(id, title, ref, make, Object.assign({ level: '실력' }, more || {}));
  const SIGNS = ['&gt;', '=', '&lt;'];
  const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const quot = (a, b) => Math.floor(a / b);
  const both = (a, b) => [{ label: '몫', answer: quot(a, b) }, { label: '나머지', answer: a % b }];
  const shown = (a, b) => (a % b === 0 ? expr(a, '/', b, '=', a / b) : `${expr(a, '/', b, '=', quot(a, b))} … ${a % b}`);
  const said = (rows) => rows.map(([a, b], i) => `${LABELS[i]} ${shown(a, b)}`).join(', ');
  const apart = (list) => new Set(list.map(([a]) => a)).size === list.length;
  const labelled = (answers) => answers.map((answer, i) => ({ label: LABELS[i], answer }));
  const rowsOf = (a, b) => longDivision(b, a).rows.map((row) => row.value);
  // (몇십)÷(몇): 십의 자리에서 나누어떨어지는 것과, 남은 십을 일로 바꾸어야 하는 것
  const TENS_PLAIN = [[20, 2], [40, 2], [60, 2], [80, 2], [30, 3], [60, 3], [90, 3], [40, 4], [80, 4]];
  const TENS_DOWN = [[30, 2], [50, 2], [70, 2], [90, 2], [60, 4], [60, 5], [70, 5], [80, 5], [90, 5], [90, 6]];
  // 나누어떨어지는 (몇십몇)÷(몇). carry: 십의 자리에서 내림이 있는가.
  const exact2 = (d, carry, ok) => d.until(() => [d.int(24, 98), d.int(2, 8)], ([a, b]) => a % b === 0 && a % 10 !== 0 && a / b >= 11 && Math.floor(a / 10) >= b && ((Math.floor(a / 10) % b !== 0) === carry) && (!ok || ok(a, b)));
  // 나머지가 있는 (몇십몇)÷(몇): 몫이 한 자리인 것, 몫이 두 자리이고 내림이 있는 것
  const rest1 = (d, ok) => d.until(() => [d.int(13, 89), d.int(3, 9)], ([a, b]) => a % b !== 0 && quot(a, b) >= 2 && quot(a, b) <= 9 && (!ok || ok(a, b)));
  const restDown = (d, ok) => d.until(() => [d.int(31, 99), d.int(2, 8)], ([a, b]) => a % b !== 0 && Math.floor(a / 10) % b !== 0 && Math.floor(a / 10) > b && (!ok || ok(a, b)));
  // 실력 문장제에 쓰는 나머지가 있는 나눗셈(몫이 4 이상)
  const rest2 = (d, ok) => d.until(() => [d.int(26, 98), d.int(3, 9)], ([a, b]) => a % b !== 0 && quot(a, b) >= 4 && (!ok || ok(a, b, quot(a, b), a % b)));
  // (세 자리 수)÷(한 자리 수): 몫이 세 자리인 것(full), 두 자리인 것(short), 나머지가 있는 것
  const KIND = {
    full: (a, b, q, r) => r === 0 && Math.floor(a / 100) >= b && !String(q).includes('0') && a % 10 !== 0,
    short: (a, b, q, r) => r === 0 && Math.floor(a / 100) < b && a % 10 !== 0,
    restFull: (a, b, q, r) => r !== 0 && Math.floor(a / 100) >= b && !String(q).includes('0'),
    restShort: (a, b, q, r) => r !== 0 && Math.floor(a / 100) < b
  };
  const three = (d, kind, ok) => d.until(() => [d.int(104, 987), d.int(2, 9)], ([a, b]) => KIND[kind](a, b, quot(a, b), a % b) && (!ok || ok(a, b)));
  // 차례 고르기 문항의 보기 넷: 바른 차례, 흔한 잘못(lures), 나머지는 다른 차례로 채운다.
  const orderChoices = (d, right, lures) => {
    const picked = [];
    for (const o of [right].concat(lures, d.shuffle(PERMS))) if (picked.length < 4 && !picked.some((p) => p.join() === o.join())) picked.push(o);
    return d.shuffle(picked);
  };
  const orderText = (o) => o.map((i) => LABELS[i]).join(', ');

  // ── (몇십)÷(몇) ────────────────────────────────────────────────
  B.addTypes('3-2-2', 'tens', [
    T('tens-share', '십 모형을 똑같이 나누어 몫 구하기', '①1 ②4 ③1 심3', (d) => {
      // 십 모형 8개를 2묶음으로 → 한 묶음에 4개 → 80÷2=40
      const [a, b] = d.pick(TENS_PLAIN.filter(([x, y]) => x / y >= 20)), t = a / 10;
      return M(`십 모형 ${t}개를 똑같이 ${b}묶음으로 나누면 한 묶음에 십 모형이 ${box(LABELS[0])}개씩 놓인다. 이것을 나눗셈식으로 나타내면 ${a} ÷ ${b} = ${box(LABELS[1])}이다. ㉠, ㉡에 알맞은 수는?`, labelled([t / b, a / b]), {
        figure: blocks(a), explain: `십 모형 ${t}개를 ${b}묶음으로 똑같이 나누면 한 묶음에 ${t / b}개씩이다. 십 모형 ${t / b}개는 ${josa(a / b, '을/를')} 나타내므로 ${shown(a, b)}이다.`,
        facts: { calc: [[E(t, '/', b), 0], [E(a, '/', b), 1]], divide: [a, b], divideFree: true, rule: 'tensPlain' }
      });
    }),
    T('tens-split', '몇십을 두 수로 갈라 나누기', '①5', (d) => {
      // 60÷4: 60을 40과 20으로 갈라 40÷4=10, 20÷4=5 → 15
      const [a, b] = d.pick(TENS_DOWN), keep = Math.floor(a / 10 / b) * b * 10, rest = a - keep;
      return M(`${josa(a, '을/를')} ${josa(keep, '과/와')} ${josa(rest, '으로/로')} 갈라 ${a} ÷ ${josa(b, '을/를')} 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([keep / b, rest / b, a / b]), {
        figure: lines([expr(keep, '/', b, '=', box(LABELS[0])), expr(rest, '/', b, '=', box(LABELS[1])), expr(a, '/', b, '=', box(LABELS[2]))]),
        explain: `${expr(keep, '/', b, '=', keep / b)}, ${expr(rest, '/', b, '=', rest / b)}이다. 두 몫을 더하면 ${keep / b} + ${rest / b} = ${a / b}이므로 ${shown(a, b)}이다.`,
        facts: { calc: [[E(keep, '/', b), 0], [E(rest, '/', b), 1], [E(a, '/', b), 2]], divide: [a, b], divideFree: true, rule: 'tensDown' }
      });
    }),
    T('tens-judge', '몫을 바르게 구한 식 고르기', '①53 ③66 심57', (d) => {
      // 0을 빠뜨린 것(80÷4=2), 십의 자리에서 남은 수를 버린 것(90÷2=40), 바른 것
      const [good, drop, cut] = d.until(() => [d.pick(d.bool() ? TENS_PLAIN : TENS_DOWN), d.pick(TENS_PLAIN), d.pick(TENS_DOWN)], apart);
      const rows = d.shuffle([[good, good[0] / good[1]], [drop, drop[0] / drop[1] / 10], [cut, Math.floor(cut[0] / 10 / cut[1]) * 10]]);
      return C('몫을 바르게 구한 것은?', LABELS.slice(0, 3), rows.findIndex(([f]) => f === good), {
        figure: tagged(rows.map(([[a, b], q]) => expr(a, '/', b, '=', q))),
        explain: `바르게 계산하면 ${said(rows.map(([f]) => f))}이다. 몫의 0을 빠뜨리거나 십의 자리에서 남은 수를 버리지 않아야 한다.`,
        facts: { claimed: rows.map(([[a, b], q]) => [E(a, '/', b), q]), claimedWant: true }
      });
    }),
    T('tens-story', '구한 값이 정해진 상황 고르기', '②94', (d) => {
      // 세 상황 가운데 나눗셈으로 구한 값이 20인 것
      const picks = d.until(() => d.shuffle(TENS_PLAIN.concat(TENS_DOWN)).slice(0, 3), (list) => apart(list) && new Set(list.map(([a, b]) => a / b)).size === 3);
      const texts = [
        ([a, b]) => `사탕 ${a}개를 봉지 ${b}개에 똑같이 나누어 담을 때 한 봉지에 담는 사탕의 수`,
        ([a, b]) => `귤 ${a}개를 한 명에게 ${b}개씩 줄 때 귤을 받는 사람의 수`,
        ([a, b]) => `색종이 ${a}장을 ${b}명이 똑같이 나누어 가질 때 한 명이 가지는 색종이의 수`
      ];
      const at = d.int(0, 2), target = picks[at][0] / picks[at][1];
      return C(`나눗셈으로 구한 값이 ${target}인 것은?`, picks.map((f, i) => texts[i](f)), at, {
        explain: `차례로 ${picks.map(([a, b]) => shown(a, b)).join(', ')}이다.`,
        facts: { choose: { exprs: picks.map(([a, b]) => E(a, '/', b)), rule: 'equals', target } }
      });
    }, { standard: SOLVE })
  ]);

  // ── 내림이 없는 (몇십몇)÷(몇) ──────────────────────────────────
  B.addTypes('3-2-2', 'plain', [
    T('plain-bundle', '문장제: 묶음과 낱개로 된 수 나누기', '②85 심70', (d) => {
      // 10개씩 8묶음과 낱개 4개를 4명이 → 84÷4=21
      const [a, b] = exact2(d, false), t = Math.floor(a / 10), o = a % 10;
      return N(`구슬이 10개씩 ${t}묶음과 낱개 ${o}개가 있다. 이 구슬을 ${b}명이 똑같이 나누어 가지면 한 명이 가지는 구슬은 몇 개인가?`, a / b, {
        unit: '개', explain: `구슬은 모두 ${a}개이다. ${shown(a, b)}`, facts: { calc: [[`(10*${t}+${o})/${b}`, 0]], divide: [a, b], rule: 'plain' }
      });
    }, { standard: SOLVE })
  ]);

  // ── 내림이 있는 (몇십몇)÷(몇) ──────────────────────────────────
  B.addTypes('3-2-2', 'down', [
    T('down-chips', '똑같이 나누어 놓은 그림 보고 몫 구하기', '①1 ③1 덧', (d) => {
      // 72를 10과 1로 나타내어 3줄로 나누어 놓은 그림: 한 줄에 10이 2개, 1이 4개
      const [a, b] = exact2(d, true, (x, y) => y <= 5 && Math.floor(x / y / 10) + (x / y) % 10 <= 10), q = a / b;
      return N(`그림은 ${josa(a, '을/를')} 10과 1로 나타낸 다음 똑같이 ${b}줄로 나누어 놓은 것이다. ${a} ÷ ${b}의 몫은?`, q, {
        figure: counters(q, b), explain: `한 줄에 10이 ${Math.floor(q / 10)}개, 1이 ${q % 10}개씩 놓여 있으므로 한 줄은 ${q}이다. ${shown(a, b)}`,
        facts: { divide: [a, b], rule: 'down' }
      });
    }),
    T('down-notes', '세로셈에서 빼는 수를 곱셈으로 나타내기', '①8 ②16 ③16 ③17', (d) => {
      // 72÷3: 60 ← 3×20, 12 ← 3×4
      const [a, b] = exact2(d, true), q = a / b, first = b * Math.floor(q / 10) * 10, second = a - first;
      return M(`${a} ÷ ${josa(b, '을/를')} 세로로 계산한 것이다. 세로셈에서 뺀 수 ${josa(first, '은/는')} ${b} × ${box(LABELS[0])}의 값이고, 뺀 수 ${josa(second, '은/는')} ${b} × ${box(LABELS[1])}의 값이다. ㉠, ㉡에 알맞은 수는?`, labelled([first / b, second / b]), {
        figure: divSteps(b, a, { steps: true, given: { quot: q, rows: [{ value: first, end: 1, sub: true }, { value: second, end: 1, sub: false }, { value: second, end: 1, sub: true }, { value: 0, end: 1, sub: false }] } }),
        explain: `${expr(b, '*', first / b, '=', first)}, ${expr(b, '*', second / b, '=', second)}이다. ${first / b} + ${second / b} = ${josa(q, '이/가')} 몫이다.`,
        facts: { calc: [[E(first, '/', b), 0], [E(second, '/', b), 1]], divide: [a, b], divideFree: true, rule: 'down' }
      });
    }),
    T('down-fix', '남은 십을 빠뜨린 세로셈 바로잡기', '①54 ②83 ③67 심59 덧', (d) => {
      // 75÷5 를 11 로: 십의 자리를 계산하고 남은 2를 빠뜨리고 일의 자리 수 5만 나눈 세로셈
      const [a, b] = exact2(d, true, (x, y) => x % 10 >= y && (x % 10) % y === 0), t = Math.floor(a / 10), o = a % 10, left = t % b;
      const wrong = { quot: quot(t, b) * 10 + o / b, rows: [{ value: b * quot(t, b), end: 0, sub: true }, { value: o, end: 1, sub: false }, { value: o, end: 1, sub: true }, { value: 0, end: 1, sub: false }] };
      return N('나눗셈을 세로로 계산한 것이다. 잘못된 곳을 찾아 바르게 계산한 몫은?', a / b, {
        figure: divSteps(b, a, { steps: true, given: wrong }),
        explain: `십의 자리를 계산하고 남은 ${josa(left, '을/를')} 빠뜨리고 일의 자리 수 ${o}만 내려 썼다. 남은 십 ${left}개와 일의 자리 수 ${josa(o, '을/를')} 합친 ${josa(left * 10 + o, '을/를')} ${josa(b, '으로/로')} 나누어야 한다. ${shown(a, b)}`,
        facts: { divide: [a, b], rule: 'down' }
      });
    }),
    T('down-row', '여러 수를 같은 수로 나누기', '③5 심10', (d) => {
      // 45, 57, 72 를 3으로
      const b = d.int(3, 6), top = Math.floor(98 / b);
      const qs = d.until(() => [d.int(11, top), d.int(11, top), d.int(11, top)], (list) => new Set(list).size === 3 && list.every((q) => (b * q) % 10 !== 0 && Math.floor(b * q / 10) % b !== 0)).sort((x, y) => x - y);
      return M('빈칸 ㉠, ㉡, ㉢에 알맞은 수는?', labelled(qs), {
        figure: table(['수', `÷ ${b}`], qs.map((q, i) => [b * q, box(LABELS[i])])), explain: qs.map((q) => shown(b * q, b)).join(', '),
        facts: { calc: qs.map((q, i) => [E(b * q, '/', b), i]) }
      });
    }),
    T('down-line', '수직선에서 뛰어 센 횟수', '②19', (d) => {
      // 0에서 3씩 뛰어 42까지 → 42÷3=14(번)
      const [a, b] = d.pick([[42, 3], [45, 3], [48, 3], [52, 4], [56, 4]]);
      return N(`수직선에서 0부터 ${b}씩 뛰어 세어 ${a}까지 갔다. 모두 몇 번 뛰었는가?`, a / b, {
        unit: '번', figure: numberLine(a, b, { tick: b, length: 250 }), explain: `${a}에서 ${josa(b, '을/를')} 몇 번 덜어 낼 수 있는지 구하는 것과 같다. ${shown(a, b)}`,
        facts: { divide: [a, b], rule: 'down' }
      });
    }),
    T('down-count', '문장제: 나누는 수를 그림에서 세기', '②20', (d) => {
      // 접시 수를 세어(6개) 딸기 78개를 똑같이 → 13개
      const [a, b] = exact2(d, true, (x, y) => y >= 3);
      return N(`접시가 그림과 같이 놓여 있다. 딸기 ${a}개를 접시에 똑같이 나누어 담으면 접시 한 개에 담는 딸기는 몇 개인가?`, a / b, {
        unit: '개', figure: dots(1, b), explain: `접시는 ${b}개이다. ${shown(a, b)}`, facts: { divide: [a, b], rule: 'down' }
      });
    }, { standard: SOLVE }),
    T('down-two', '문장제: 두 가지를 같은 수로 나누기', '덧', (d) => {
      // 파란 구슬 65개와 빨간 구슬 85개로 똑같은 목걸이 5개 → 13개, 17개
      const b = d.int(3, 6), top = Math.floor(98 / b);
      const [p, q] = d.until(() => [d.int(11, top), d.int(11, top)], (list) => list[0] !== list[1] && list.every((v) => (b * v) % 10 !== 0 && Math.floor(b * v / 10) % b !== 0));
      return M(`파란 구슬 ${b * p}개와 빨간 구슬 ${b * q}개를 모두 사용하여 똑같은 목걸이 ${b}개를 만들려고 한다. 목걸이 한 개에 사용하는 파란 구슬과 빨간 구슬은 각각 몇 개인가?`, [{ label: '파란 구슬', answer: p, unit: '개' }, { label: '빨간 구슬', answer: q, unit: '개' }], {
        explain: `파란 구슬은 ${shown(b * p, b)}(개), 빨간 구슬은 ${shown(b * q, b)}(개)이다.`, facts: { calc: [[E(b * p, '/', b), 0], [E(b * q, '/', b), 1]] }
      });
    }, { standard: SOLVE })
  ]);

  // ── 나머지가 있는 (몇십몇)÷(몇) ────────────────────────────────
  B.addTypes('3-2-2', 'rest', [
    T('rest-read', '세로셈에서 몫과 나머지 읽기', '①15 심12', (d) => {
      const [a, b] = restDown(d);
      return M('나눗셈을 세로로 계산한 것이다. 이 나눗셈의 몫과 나머지는?', both(a, b), {
        figure: divSteps(b, a, { steps: true }), explain: `맨 위에 쓴 ${josa(quot(a, b), '이/가')} 몫이고, 맨 아래에 남은 ${josa(a % b, '이/가')} 나머지이다. ${shown(a, b)}`,
        facts: { divide: [a, b], rule: 'restDown' }
      });
    }),
    T('rest-model', '수 모형을 똑같이 나누고 남는 것', '①16 ②24 ③23 심13', (d) => {
      // 56÷3: 한 묶음에 십 모형 1개와 일 모형 8개, 일 모형 2개가 남는다
      const [a, b] = restDown(d, (x, y) => quot(x, y) % 10 !== 0 && x % 10 !== 0), t = Math.floor(a / 10), o = a % 10, q = quot(a, b), r = a % b, left = t % b;
      return M(`수 모형으로 나타낸 ${josa(a, '을/를')} 똑같이 ${b}묶음으로 나누려고 한다. 한 묶음은 십 모형 ${box(LABELS[0])}개와 일 모형 ${box(LABELS[1])}개이고, 일 모형 ${box(LABELS[2])}개가 남는다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([Math.floor(q / 10), q % 10, r]), {
        figure: blocks(a),
        explain: `십 모형을 한 묶음에 ${quot(t, b)}개씩 놓으면 ${left}개가 남는다. 남은 십 모형을 일 모형으로 바꾸면 일 모형은 ${left * 10 + o}개이고, 한 묶음에 ${q % 10}개씩 놓으면 ${r}개가 남는다. ${shown(a, b)}`,
        facts: { calc: [[`((${a}-${a}%${b})/${b}-((${a}-${a}%${b})/${b})%10)/10`, 0], [`((${a}-${a}%${b})/${b})%10`, 1], [`${a}%${b}`, 2]], unseen: [10], divide: [a, b], divideFree: true, rule: 'restDown' }
      });
    }),
    T('rest-loop', '묶어 놓은 그림을 나눗셈식으로 나타내기', '①37 ②8', (d) => {
      // 4개씩 7묶음과 낱개 2개 → 30÷4=7…2
      const [b, q, r] = d.until(() => [d.int(3, 6), d.int(3, 6), d.int(1, 5)], ([x, y, z]) => z < x && x !== y && y !== z), a = b * q + r;
      return M(`구슬을 ${b}개씩 묶고, 묶지 못한 구슬은 따로 놓았다. 그림을 보고 나눗셈식을 완성할 때, ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([a, q, r]), {
        figure: dots(q, b, { loop: 'rows' }) + dots(1, b, { count: r }) + lines([`<span class="mb-expr">${box(LABELS[0])} <i>÷</i> ${b} <i>=</i> ${box(LABELS[1])} … ${box(LABELS[2])}</span>`]),
        explain: `${b}개씩 ${q}묶음이고 ${r}개가 남았다. 구슬은 모두 ${expr(b, '*', q, '=', b * q)}, ${expr(b * q, '+', r, '=', a)}(개)이므로 ${shown(a, b)}이다.`,
        facts: { calc: [[`${b}*${q}+${r}`, 0], [String(q), 1], [String(r), 2]], divide: [a, b], divideFree: true }
      });
    }),
    T('rest-count', '나머지가 될 수 있는 수 세기', '①19 ③25 심15', (d) => {
      const b = d.int(4, 8);
      return N(`1부터 9까지의 수 중에서 어떤 수를 ${josa(b, '으로/로')} 나누었을 때 나머지가 될 수 있는 수는 모두 몇 개인가?`, b - 1, {
        unit: '개', explain: `나머지는 나누는 수 ${b}보다 작아야 한다. 1부터 9까지의 수 중에서 ${b}보다 작은 수는 1부터 ${b - 1}까지이므로 ${b - 1}개이다.`,
        facts: { digit: { template: `□<${b}`, lo: 1, hi: 9, ask: 'count' } }
      });
    }),
    T('rest-given', '같은 수로 나누어 나머지가 정해진 수 찾기', '②32 ③27 심19', (d) => {
      // 69, 53, 47, 73 가운데 7로 나누었을 때 나머지가 5인 수
      const b = d.int(5, 9), r = d.int(2, b - 1);
      const list = d.until(() => [b * d.int(5, 10) + r, d.int(41, 98), d.int(41, 98), d.int(41, 98)], (vs) => new Set(vs).size === 4 && vs.slice(1).every((v) => v % b !== r && v % b !== 0));
      const rows = d.shuffle(list);
      return C(`다음 수 중에서 ${josa(b, '으로/로')} 나누었을 때 나머지가 ${r}인 수는?`, rows.map(String), rows.indexOf(list[0]), {
        explain: rows.map((v) => shown(v, b)).join(', '), facts: { choose: { exprs: rows.map((v) => `${v}%${b}`), rule: 'equals', target: r } }
      });
    }),
    T('rest-compare', '나머지의 크기 비교(>, =, <)', '①22 ②30 ③28', (d) => {
      // 몫이 큰 쪽의 나머지가 크다고 여기지 않게, 몫이 두 자리인 식과 한 자리인 식을 견준다.
      const [[a, b], [c, e]] = d.until(() => d.shuffle([restDown(d), rest1(d)]), ([[x, y], [z, w]]) => x !== z && y !== w && Math.abs(x % y - z % w) <= 2);
      const p = a % b, q = c % e;
      return C('두 나눗셈의 나머지를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, p > q ? 0 : p === q ? 1 : 2, {
        figure: versus(expr(a, '/', b), expr(c, '/', e)), explain: `${shown(a, b)}, ${shown(c, e)}이다. 나머지는 차례로 ${p}, ${q}이다.`,
        facts: { choose: { exprs: [`${a}%${b}`, `${c}%${e}`], rule: 'compare' } }
      });
    }),
    T('rest-odd', '나머지가 다른 나눗셈 찾기', '①22 ②30 ③29 심18', (d) => {
      // 31÷6, 67÷8, 41÷5 → 67÷8 만 나머지가 3
      const rows = d.until(() => d.shuffle([rest1(d), rest1(d), restDown(d)]), (list) => apart(list) && new Set(list.map(([, b]) => b)).size === 3 && new Set(list.map(([a, b]) => a % b)).size === 2);
      const rs = rows.map(([a, b]) => a % b);
      return C('다음 중 나머지가 다른 하나는?', LABELS.slice(0, 3), rs.findIndex((v) => rs.filter((w) => w === v).length === 1), {
        figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: said(rows), facts: { choose: { exprs: rows.map(([a, b]) => `${a}%${b}`), rule: 'odd' } }
      });
    }),
    T('rest-share', '문장제: 똑같이 나누어 담고 남는 것', '①23 ②25 ③33', (d) => {
      const [a, b] = restDown(d);
      return M(`바둑돌 ${a}개를 통 ${b}개에 똑같이 나누어 담으려고 한다. 한 통에 몇 개씩 담을 수 있고, 몇 개가 남는가?`, [{ label: '한 통에', answer: quot(a, b), unit: '개' }, { label: '남는 것', answer: a % b, unit: '개' }], {
        explain: shown(a, b), facts: { divide: [a, b], rule: 'restDown' }
      });
    }, { standard: SOLVE }),
    T('rest-left', '문장제: 남는 것만 구하기', '②25 ③33 심12 심21 덧', (d) => {
      const [a, b] = restDown(d);
      return N(`귤 ${a}개를 한 봉지에 ${b}개씩 담아 팔고, 봉지에 담지 못한 귤은 먹으려고 한다. 먹는 귤은 몇 개인가?`, a % b, {
        unit: '개', explain: `${shown(a, b)}이다. ${quot(a, b)}봉지에 담으면 ${a % b}개가 남는다.`, facts: { calc: [[`${a}%${b}`, 0]], divide: [a, b], divideFree: true, rule: 'restDown' }
      });
    }, { standard: SOLVE }),
    T('rest-talk', '나눗셈을 계산하고 옳은 말 고르기', '①52 ②37 ③30 심34', (d) => {
      // 83÷6=13…5: 몫의 크기, 나머지, 나누어떨어지는지를 말한 것 가운데 옳은 것은 하나
      const [a, b] = restDown(d), q = quot(a, b), r = a % b, hit = d.int(0, 1), near = q + d.int(1, 3), other = r + 1 < b ? r + 1 : r - 1;
      const rows = d.shuffle([
        [`몫은 ${near}보다 ${hit === 0 ? '작다' : '크다'}.`, hit === 0],
        [`나머지는 ${hit === 1 ? r : other}이다.`, hit === 1],
        [`${josa(a, '은/는')} ${josa(b, '으로/로')} 나누어떨어진다.`, false],
        [`나머지는 ${b}보다 크다.`, false]
      ]);
      return C(`${a} ÷ ${b}에 대한 설명으로 옳은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: `${shown(a, b)}이다. 몫은 ${q}, 나머지는 ${r}이고, 나머지가 0이 아니므로 나누어떨어지지 않는다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: true, divide: [a, b], divideFree: true, rule: 'restDown' }
      });
    })
  ]);

  // ── (세 자리 수)÷(한 자리 수) ──────────────────────────────────
  B.addTypes('3-2-2', 'three', [
    T('three-model', '백·십·일 모형을 똑같이 나누기', '①16 ②50', (d) => {
      // 248÷2: 한 묶음에 백 모형 1개, 십 모형 2개, 일 모형 4개
      const b = d.pick([2, 2, 3]), h = b * (b === 2 ? d.int(1, 2) : 1);
      const [t, o] = d.until(() => [b * d.int(1, 4), b * d.int(1, 4)], ([x, y]) => x <= 9 && y <= 9 && new Set([h, x, y]).size >= 2), a = h * 100 + t * 10 + o;
      return M(`수 모형으로 나타낸 ${josa(a, '을/를')} 똑같이 ${b}묶음으로 나누려고 한다. 한 묶음은 백 모형 ${box(LABELS[0])}개, 십 모형 ${box(LABELS[1])}개, 일 모형 ${box(LABELS[2])}개이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([h / b, t / b, o / b]), {
        figure: blocks(a), explain: `백 모형 ${h}개, 십 모형 ${t}개, 일 모형 ${o}개를 각각 ${b}묶음으로 똑같이 나눈다. ${shown(a, b)}`,
        facts: { calc: [[E(h, '/', b), 0], [E(t, '/', b), 1], [E(o, '/', b), 2]], divide: [a, b], divideFree: true, rule: 'full' }
      });
    }),
    T('three-steps2', '세로셈의 계산 과정: 몫이 두 자리 수', '①25 ②47 ③44', (d) => {
      // 591÷7: 백의 자리에서 나눌 수 없어 59부터 나눈다. 56, 31, 28, 3
      const [a, b] = three(d, 'restShort', (x, y) => quot(x, y) % 10 !== 0), rows = rowsOf(a, b), q = quot(a, b);
      return M('나눗셈을 세로로 계산한 것이다. 몫 ㉠과 ㉡, ㉢에 알맞은 수는?', labelled([q, rows[0], rows[3]]), {
        figure: divSteps(b, a, { steps: true, quot: LABELS[0], rows: { 0: LABELS[1], 3: LABELS[2] } }),
        explain: `백의 자리 수 ${josa(Math.floor(a / 100), '은/는')} ${b}보다 작아 나눌 수 없으므로 앞의 두 자리 수 ${josa(Math.floor(a / 10), '을/를')} 먼저 나눈다. 처음에 빼는 수는 ${expr(b, '*', Math.floor(q / 10), '=', rows[0])}이고, ${shown(a, b)}이다.`,
        facts: { longDiv: { a, b, asks: ['quot', 0, 3] }, divide: [a, b], divideFree: true, rule: 'restShort' }
      });
    }),
    T('three-steps0', '세로셈의 계산 과정: 몫에 0이 있는 나눗셈', '②47', (d) => {
      // 618÷6: 6을 빼고, 십의 자리 수 1은 나눌 수 없어 8까지 내려 쓴 18을 나눈다. 몫 103. 내려 쓴 수가 두 자리인 것만 쓴다.
      const [x, y, b] = d.until(() => [d.int(1, 4), d.int(1, 9), d.int(2, 9)], ([p, q, r]) => (p * 100 + q) * r <= 999 && q * r >= 10), q = x * 100 + y, a = q * b, rows = rowsOf(a, b);
      return M('나눗셈을 세로로 계산한 것이다. 몫 ㉠과 내려 쓴 수 ㉡에 알맞은 수는?', labelled([q, rows[1]]), {
        figure: divSteps(b, a, { steps: true, quot: LABELS[0], rows: { 1: LABELS[1] } }),
        explain: `백의 자리를 계산하면 남는 수가 없다. 십의 자리 수 ${josa(Math.floor(a / 10) % 10, '은/는')} ${b}보다 작아 나눌 수 없으므로 몫의 십의 자리에 0을 쓰고, 일의 자리 수까지 내려 쓴 ${josa(rows[1], '을/를')} 나눈다. ${shown(a, b)}`,
        facts: { longDiv: { a, b, asks: ['quot', 1] }, divide: [a, b], divideFree: true, rule: 'zero' }
      });
    }),
    T('three-notes', '세로셈에서 빼는 수를 곱셈으로 나타내기', '②47 ③16 ③41', (d) => {
      // 536÷4: 400 ← 4×100, 120 ← 4×30, 16 ← 4×4
      const [a, b] = three(d, 'full'), q = a / b, parts = [Math.floor(q / 100) * 100, (Math.floor(q / 10) % 10) * 10, q % 10], subs = parts.map((p) => p * b);
      const rows = [[subs[0], true], [a - subs[0], false], [subs[1], true], [subs[2], false], [subs[2], true], [0, false]].map(([value, sub]) => ({ value, end: 2, sub }));
      return M(`${a} ÷ ${josa(b, '을/를')} 세로로 계산한 것이다. 세로셈에서 뺀 수 ${subs[0]}, ${subs[1]}, ${josa(subs[2], '은/는')} 차례로 ${b} × ${box(LABELS[0])}, ${b} × ${box(LABELS[1])}, ${b} × ${box(LABELS[2])}의 값이다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled(parts), {
        figure: divSteps(b, a, { steps: true, given: { quot: q, rows } }),
        explain: `${parts.map((p) => expr(b, '*', p, '=', p * b)).join(', ')}이다. ${parts.join(' + ')} = ${josa(q, '이/가')} 몫이다.`,
        facts: { calc: subs.map((s, i) => [E(s, '/', b), i]), divide: [a, b], divideFree: true, rule: 'full' }
      });
    }),
    T('three-fix', '몫의 자리를 잘못 쓴 세로셈 바로잡기', '①54 ②83 ③67 심60', (d) => {
      // 232÷4 를 580 으로: 몫을 백의 자리부터 쓰고 남은 자리에 0을 채운 세로셈
      const [a, b] = three(d, 'short');
      return N('다음은 나눗셈을 잘못 계산한 세로셈이다. 바르게 계산한 몫은?', a / b, {
        figure: divSteps(b, a, { steps: true, given: { quot: (a / b) * 10, rows: longDivision(b, a).rows } }),
        explain: `백의 자리 수 ${josa(Math.floor(a / 100), '은/는')} ${b}보다 작아 나눌 수 없으므로 몫은 십의 자리부터 써야 한다. ${shown(a, b)}`,
        facts: { divide: [a, b], rule: 'short' }
      });
    }),
    T('three-word3', '문장제: 같은 수씩 담고 남는 것', '①28 ③33 심29', (d) => {
      const [a, b] = three(d, 'restFull');
      return M(`공깃돌 ${a}개를 한 통에 ${b}개씩 담으려고 한다. 몇 통에 담을 수 있고, 몇 개가 남는가?`, [{ answer: quot(a, b), unit: '통' }, { answer: a % b, unit: '개' }], {
        explain: shown(a, b), facts: { divide: [a, b], rule: 'restFull' }
      });
    }, { standard: SOLVE }),
    T('three-talk', '세 자리 수의 나눗셈을 계산하고 옳은 말 고르기', '①52 ②37 ③30 심34 덧', (d) => {
      // 496÷6=82…4: 몫의 자리 수, 나머지, 낱말(나누어지는 수)을 말한 것 가운데 옳은 것은 하나
      const short = d.bool(), [a, b] = three(d, short ? 'restShort' : 'restFull'), q = quot(a, b), r = a % b, hit = d.int(0, 1), other = r + 1 < b ? r + 1 : r - 1;
      const rows = d.shuffle([
        [`몫은 ${(hit === 0) === short ? '두' : '세'} 자리 수이다.`, hit === 0],
        [`나머지는 ${hit === 1 ? r : other}이다.`, hit === 1],
        [`나누어지는 수는 ${b}이다.`, false],
        [`나머지는 ${b}보다 크다.`, false]
      ]);
      return C(`나눗셈 ${a} ÷ ${josa(b, '을/를')} 바르게 설명한 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: `${shown(a, b)}이다. 몫 ${josa(q, '은/는')} ${short ? '두' : '세'} 자리 수이고 나머지는 ${r}이다. 나누어지는 수는 ${a}, 나누는 수는 ${b}이다.`,
        facts: { truth: rows.map(([, ok]) => ok), want: true, divide: [a, b], divideFree: true, rule: short ? 'restShort' : 'restFull' }
      });
    }),
    T('three-cards', '수 카드로 만든 가장 큰 세 자리 수 나누기', '②79 덧', (d) => {
      // 5, 4, 7, 2 → 754÷2
      const list = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((p, q) => q - p), ([w, x, y, z]) => (w * 100 + x * 10 + y) % z !== 0);
      const a = list[0] * 100 + list[1] * 10 + list[2], z = list[3];
      return M('수 카드 4장 중에서 3장을 골라 만들 수 있는 가장 큰 세 자리 수를 남은 수 카드의 수로 나누었다. 몫과 나머지는?', both(a, z), {
        figure: cards(d.shuffle(list)), explain: `만들 수 있는 가장 큰 세 자리 수는 ${a}이고 남은 수는 ${z}이다. ${shown(a, z)}`,
        facts: { calc: [[`(${a}-${a}%${z})/${z}`, 0], [`${a}%${z}`, 1]], unseen: [a], divide: [a, z] }
      });
    }),
    T('three-divisor', '나누는 수를 골라 몫이 가장 작은 나눗셈 만들기', '②78 덧', (d) => {
      // 549÷□ 에 5, 9, 2 가운데 9를 넣는다
      const [a, list] = d.until(() => [d.int(204, 987), d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3)], ([x, picks]) => x % Math.max(...picks) !== 0 && x % 10 !== 0), big = Math.max(...list);
      return M(`수 카드 3장 중에서 한 장을 골라 □ 안에 넣어 몫이 가장 작은 나눗셈 ${a} ÷ □를 만들었다. 이 나눗셈의 몫과 나머지는?`, both(a, big), {
        figure: cards(list), explain: `나누어지는 수가 같을 때에는 나누는 수가 클수록 몫이 작다. 가장 큰 수 ${josa(big, '으로/로')} 나눈다. ${shown(a, big)}`,
        facts: { calc: [[`(${a}-${a}%${big})/${big}`, 0], [`${a}%${big}`, 1]], divide: [a, big] }
      });
    }),
    T('three-compose', '자릿값으로 나타낸 수 나누기', '덧', (d) => {
      // 100이 3개, 10이 7개, 1이 5개인 수 ÷ 5
      const [a, b] = three(d, 'short', (x) => Math.floor(x / 10) % 10 !== 0), h = Math.floor(a / 100), t = Math.floor(a / 10) % 10, o = a % 10;
      return N(`100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수를 ${josa(b, '으로/로')} 나눈 몫은?`, a / b, {
        explain: `100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수는 ${a}이다. ${shown(a, b)}`, facts: { calc: [[`(100*${h}+10*${t}+${o})/${b}`, 0]], divide: [a, b], rule: 'short' }
      });
    }),
    T('three-chain', '세 자리 수를 이어서 두 번 나누기', '②67 심52', (d) => {
      // 336 ÷8 → 42 ÷3 → 14
      const [a, b, c] = d.until(() => [d.int(104, 996), d.int(2, 9), d.int(2, 9)], ([x, y, z]) => x % y === 0 && (x / y) % z === 0 && y !== z && x / y / z >= 11 && x % 100 !== 0);
      return M('빈칸 ㉠, ㉡에 알맞은 수는?', labelled([a / b, a / b / c]), {
        figure: chain([a, '÷' + b, box(LABELS[0]), '÷' + c, box(LABELS[1])]), explain: `${shown(a, b)}, ${shown(a / b, c)}`, facts: { calc: [[E(a, '/', b), 0], [`${a}/${b}/${c}`, 1]] }
      });
    }),
    T('three-rest-order', '나머지가 큰 것부터 차례로 쓰기', '②31 ③28 심18 덧', (d) => {
      // 몫이 큰 차례와 나머지가 큰 차례가 다른 식 셋
      const order = (values) => [0, 1, 2].sort((x, y) => values[y] - values[x]);
      const rows = d.until(() => d.shuffle([three(d, 'restShort'), three(d, 'restShort'), three(d, 'restFull')]), (list) => apart(list) && new Set(list.map(([, b]) => b)).size === 3 && new Set(list.map(([a, b]) => a % b)).size === 3
        && new Set(list.map(([a, b]) => quot(a, b))).size === 3 && order(list.map(([a, b]) => a % b)).join() !== order(list.map(([a, b]) => quot(a, b))).join());
      const right = order(rows.map(([a, b]) => a % b));
      // 몫이 큰 차례(몫과 나머지를 혼동한 아이), 나머지가 작은 것부터(차례를 거꾸로 쓴 아이)
      const orders = orderChoices(d, right, [order(rows.map(([a, b]) => quot(a, b))), right.slice().reverse()]);
      return C('나머지가 큰 것부터 차례로 기호를 쓴 것은?', orders.map(orderText), orders.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: said(rows), facts: { choose: { exprs: rows.map(([a, b]) => `${a}%${b}`), rule: 'descending', orders } }
      });
    }),
    T('three-versus', '나눗셈의 몫과 수의 크기 비교', '①40 ②68 ③60', (d) => {
      // 380÷4 ○ 95
      const [a, b] = three(d, d.bool() ? 'short' : 'full'), q = a / b, n = q + d.pick([-3, -2, -1, 0, 0, 1, 2, 3]);
      return C('나눗셈의 몫과 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, q > n ? 0 : q === n ? 1 : 2, {
        figure: versus(expr(a, '/', b), expr(n)), explain: `${shown(a, b)}이다. 몫 ${josa(q, '은/는')} ${q === n ? '오른쪽 수와 같다' : n + (q > n ? '보다 크다' : '보다 작다')}.`,
        facts: { choose: { exprs: [E(a, '/', b), String(n)], rule: 'compare' } }
      });
    })
  ]);

  // ── 나눗셈의 어림셈 ────────────────────────────────────────────
  B.addTypes('3-2-2', 'est', [
    T('est-gap', '어림한 몫과 실제 몫의 차', '덧 ①67', (d) => {
      // 485÷5: 500÷5=100 으로 어림하였다. 실제 몫은 97 → 차는 3
      const [h, b, k] = d.until(() => [d.int(2, 8) * 100, d.int(2, 9), d.pick([-3, -2, -1, 1, 2, 3])], ([x, y, z]) => x % y === 0 && Math.abs(y * z) <= 15), a = h + b * k;
      const big = Math.max(h, a), small = Math.min(h, a);
      return N(`${a} ÷ ${b}의 몫을 구하려고 ${josa(a, '을/를')} ${josa(h, '으로/로')} 어림하여 계산하였더니 약 ${josa(h / b, '이었다/였다')}. 어림한 몫과 실제 몫의 차는?`, Math.abs(k), {
        explain: `어림한 몫은 ${shown(h, b)}이고, 실제 몫은 ${shown(a, b)}이다. ${expr(big / b, '-', small / b, '=', Math.abs(k))}`,
        facts: { calc: [[`${big}/${b}-${small}/${b}`, 0]], nearHundred: [a, h] }
      });
    })
  ]);

  // ── 계산이 맞는지 확인하기 ──────────────────────────────────────
  B.addTypes('3-2-2', 'check', [
    T('check-calc', '계산하고 확인하는 식 완성하기', '①30 ②57 ③50 ③51 심36 덧', (d) => {
      // 211÷8=㉠…㉡, 8×㉠=㉢, ㉢+㉡=211
      const [a, b] = three(d, 'restShort'), q = quot(a, b), r = a % b;
      return M(`${a} ÷ ${josa(b, '을/를')} 계산하고, 계산이 맞는지 확인하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([q, r, b * q]), {
        figure: lines([`<span class="mb-expr">${a} <i>÷</i> ${b} <i>=</i> ${box(LABELS[0])} … ${box(LABELS[1])}</span>`, `확인: ${expr(b, '*', box(LABELS[0]), '=', box(LABELS[2]))}, ${expr(box(LABELS[2]), '+', box(LABELS[1]), '=', a)}`]),
        explain: `${shown(a, b)}이다. 나누는 수와 몫의 곱에 나머지를 더하면 ${expr(b, '*', q, '=', b * q)}, ${expr(b * q, '+', r, '=', a)}이다.`,
        facts: { calc: [[`(${a}-${a}%${b})/${b}`, 0], [`${a}%${b}`, 1], [`${a}-${a}%${b}`, 2]], divide: [a, b], divideFree: true, rule: 'restShort' }
      });
    }),
    T('check-exact', '나누어떨어지는 나눗셈을 곱셈으로 확인하기', '③50', (d) => {
      // 75÷3=㉠, 3×㉠=㉡
      const [a, b] = exact2(d, true), q = a / b;
      return M('나눗셈을 계산하고, 곱셈으로 계산이 맞는지 확인하려고 한다. ㉠, ㉡에 알맞은 수는?', labelled([q, a]), {
        figure: lines([expr(a, '/', b, '=', box(LABELS[0])), `확인: ${expr(b, '*', box(LABELS[0]), '=', box(LABELS[1]))}`]),
        explain: `${shown(a, b)}이다. 나누어떨어지는 나눗셈은 나누는 수와 몫의 곱이 나누어지는 수가 되는지 확인한다. ${expr(b, '*', q, '=', a)}`,
        facts: { calc: [[E(a, '/', b), 0], [`${b}*(${a}/${b})`, 1]], divide: [a, b], divideFree: true, rule: 'down' }
      });
    })
  ]);

  // ── 여러 가지 나눗셈 ────────────────────────────────────────────
  // 가장 큰 수를 가장 작은 수로 나눈 몫이 다른 두 수의 짝에서는 나오지 않는가
  const ratioOnce = (vs) => {
    const want = Math.max(...vs) / Math.min(...vs); let n = 0;
    vs.forEach((x, i) => vs.forEach((y, j) => { if (i < j && Math.max(x, y) / Math.min(x, y) === want) n += 1; }));
    return n === 1;
  };
  B.addTypes('3-2-2', 'mix', [
    T('mix-rank', '몫의 크기 차례', '①41 ②70 ③61 심48 덧', (d) => {
      const big = d.bool(), order = (values) => [0, 1, 2].sort((x, y) => (big ? values[y] - values[x] : values[x] - values[y]));
      const rows = d.until(() => d.shuffle([exact2(d, true), exact2(d, true), exact2(d, false)]), (list) => apart(list) && new Set(list.map(([a, b]) => a / b)).size === 3
        && order(list.map(([a, b]) => a / b)).join() !== order(list.map(([a]) => a)).join());
      const right = order(rows.map(([a, b]) => a / b));
      // 나누어지는 수의 차례(수만 보는 아이), 거꾸로 쓴 차례
      const orders = orderChoices(d, right, [order(rows.map(([a]) => a)), right.slice().reverse()]);
      return C(`몫이 ${big ? '큰' : '작은'} 것부터 차례로 기호를 쓴 것은?`, orders.map(orderText), orders.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: said(rows), facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: big ? 'descending' : 'ascending', orders } }
      });
    }),
    T('mix-odd', '몫이 다른 나눗셈 찾기', '①41 ②69 ③62 심49 덧', (d) => {
      // 44÷2, 66÷3, 66÷6, 88÷4 → 66÷6 만 몫이 11
      const rows = d.until(() => {
        const q = d.int(11, 24), bs = d.shuffle([2, 3, 4, 5, 6, 7, 8]).filter((b) => b * q <= 98 && (b * q) % 10 !== 0).slice(0, 3);
        return d.shuffle(bs.map((b) => [b * q, b]).concat([exact2(d, d.bool())]));
      }, (list) => list.length === 4 && apart(list) && new Set(list.map(([a, b]) => a / b)).size === 2);
      const qs = rows.map(([a, b]) => a / b);
      return C('다음 중 몫이 다른 하나는?', rows.map(([a, b]) => `${a} ÷ ${b}`), qs.findIndex((v) => qs.filter((w) => w === v).length === 1), {
        explain: rows.map(([a, b]) => shown(a, b)).join(', '), facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: 'odd' } }
      });
    }),
    T('mix-above', '몫이 기준보다 큰 나눗셈 고르기', '②72 심48', (d) => {
      // 272÷4=68, 295÷5=59, 366÷6=61 → 몫이 65보다 큰 것
      const [rows, target] = d.until(() => {
        const list = [three(d, 'short'), three(d, 'short'), three(d, 'short')], qs = list.map(([a, b]) => a / b).sort((x, y) => y - x);
        return [list, Math.ceil((qs[1] + 1) / 10) * 10, qs];
      }, ([list, t, qs]) => apart(list) && new Set(list.map(([, b]) => b)).size === 3 && t < qs[0] && qs[0] - qs[2] <= 40);
      const values = rows.map(([a, b]) => a / b);
      return C(`몫이 ${target}보다 큰 나눗셈은?`, rows.map(([a, b]) => `${a} ÷ ${b}`), values.indexOf(Math.max(...values)), {
        explain: rows.map(([a, b]) => shown(a, b)).join(', '), facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: 'onlyAbove', target } }
      });
    }),
    T('mix-factor', '곱셈식의 □ 구하기', '①43 ②76 ③69 심53', (d) => {
      // □×7=91 → 91÷7=13
      const [a, b] = exact2(d, true);
      return N('□ 안에 알맞은 수는?', a / b, {
        figure: d.bool() ? expr(box(), '*', b, '=', a) : expr(b, '*', box(), '=', a),
        explain: `곱셈과 나눗셈의 관계를 이용하여 ${josa(a, '을/를')} ${josa(b, '으로/로')} 나눈다. ${shown(a, b)}`, facts: { calc: [[E(a, '/', b), 0]], divide: [a, b], rule: 'down' }
      });
    }),
    T('mix-least', '□ 안에 들어갈 수 있는 가장 작은 수', '①45 ③68 심55 덧', (d) => {
      // 112÷7 < □ → 17
      const [a, b] = three(d, 'short'), q = a / b;
      return N('□ 안에 들어갈 수 있는 자연수 중에서 가장 작은 수는?', q + 1, {
        figure: `<span class="mb-expr">${a} <i>÷</i> ${b} <i>&lt;</i> ${box()}</span>`,
        explain: `${shown(a, b)}이다. □ 안에는 ${q}보다 큰 수가 들어갈 수 있으므로 가장 작은 수는 ${q + 1}이다.`,
        facts: { range: { ineq: `${a}/${b}<x`, lo: 1, hi: q + 30, want: 'min' }, divide: [a, b], divideFree: true, rule: 'short' }
      });
    }),
    T('mix-cards2', '수 카드로 만든 가장 작은 두 자리 수 나누기', '②79 ③70', (d) => {
      // 8, 7, 9 → 78÷9=8…6
      const [x, y, z] = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, q) => p - q), ([p, q, r]) => (p * 10 + q) % r !== 0 && quot(p * 10 + q, r) >= 2), a = x * 10 + y;
      return M('수 카드 3장 중에서 2장을 골라 만들 수 있는 가장 작은 두 자리 수를 남은 수 카드의 수로 나누었다. 몫과 나머지는?', both(a, z), {
        figure: cards(d.shuffle([x, y, z])), explain: `만들 수 있는 가장 작은 두 자리 수는 ${a}이고 남은 수는 ${z}이다. ${shown(a, z)}`,
        facts: { calc: [[`(${a}-${a}%${z})/${z}`, 0], [`${a}%${z}`, 1]], unseen: [a], divide: [a, z] }
      });
    }),
    T('mix-ends', '가장 큰 수를 가장 작은 수로 나누기', '②73 ③11 ③19 ③45 심51', (d) => {
      // 65, 8, 72, 47, 6 → 72÷6=12
      const list = d.until(() => { const [a, b] = exact2(d, true); return [a, b, d.int(b + 1, 9), d.int(21, a - 1), d.int(21, a - 1)]; }, (vs) => new Set(vs).size === 5 && ratioOnce(vs));
      const [a, b] = list;
      return N('다음 수 중에서 가장 큰 수를 가장 작은 수로 나눈 몫은?', a / b, {
        figure: numbers(d.shuffle(list)), explain: `가장 큰 수는 ${a}, 가장 작은 수는 ${b}이다. ${shown(a, b)}`, facts: { divEnds: list, divide: [a, b], rule: 'down' }
      });
    })
  ]);

  // ── 실력 문제 ──────────────────────────────────────────────────
  B.addTypes('3-2-2', 'hard', [
    H('h-which', '두 나눗셈식의 나누어지는 수 비교', '심45', (d) => {
      // ㉮÷5=11…4, ㉯÷7=8…2 → 59 > 58. 몫이 큰 쪽이 큰 수라고 여기면 틀리게, 몫이 작은 쪽이 더 큰 수가 되게 한다(두 수가 같은 경우도 낸다).
      const [[b, q, r], [e, p, s]] = d.until(() => [[d.int(3, 9), d.int(6, 16), d.int(1, 8)], [d.int(3, 9), d.int(6, 16), d.int(1, 8)]],
        ([[x, y, z], [u, v, w]]) => z < x && w < u && x !== u && y !== v && x * y + z <= 99 && u * v + w <= 99 && Math.abs(x * y + z - (u * v + w)) <= 6 && (x * y + z === u * v + w || (y > v) !== (x * y + z > u * v + w)));
      const m = b * q + r, n = e * p + s, row = (tag, x, y, z) => `<span class="mb-expr">${tag} <i>÷</i> ${x} <i>=</i> ${y} … ${z}</span>`;
      return C('㉮와 ㉯의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, m > n ? 0 : m === n ? 1 : 2, {
        figure: lines([row('㉮', b, q, r), row('㉯', e, p, s), versus(expr('㉮'), expr('㉯'))]),
        explain: `㉮는 ${expr(b, '*', q, '=', b * q)}, ${expr(b * q, '+', r, '=', m)}이고, ㉯는 ${expr(e, '*', p, '=', e * p)}, ${expr(e * p, '+', s, '=', n)}이다.`,
        facts: { choose: { exprs: [`${b}*${q}+${r}`, `${e}*${p}+${s}`], rule: 'compare' } }
      });
    }),
    H('h-hidden', '문장제: 나누는 수가 글에 숨어 있는 경우', '심79 ②48', (d) => {
      // 친구 3명과 함께 → 4명. 친구 수로만 나누면 나누어떨어지지 않는다.
      const who = d.pick(NAMES), k = d.int(2, 7), a = d.until(() => d.int(104, 987), (x) => x % (k + 1) === 0 && x % k !== 0 && x % 10 !== 0);
      return N(`${name(who, '이/가')} 친구 ${k}명과 함께 색종이 ${a}장을 똑같이 나누어 가지려고 한다. 한 명이 가지는 색종이는 몇 장인가?`, a / (k + 1), {
        unit: '장', explain: `${nick(who)}와 친구 ${k}명은 모두 ${k + 1}명이다. ${shown(a, k + 1)}`, facts: { calc: [[`${a}/(${k}+1)`, 0]], unseen: [1] }
      });
    }, { standard: SOLVE }),
    H('h-sub', '문장제: 덜어 낸 뒤 나누기', '심74 ①57', (d) => {
      const [a, c, b] = d.until(() => [d.int(52, 98), d.int(3, 9), d.int(4, 9)], ([x, y, z]) => (x - y) % z !== 0 && x % 10 !== 0 && quot(x - y, z) >= 6 && y !== z);
      const left = a - c, q = quot(left, b), r = left % b;
      return M(`쿠키 ${a}개 중에서 ${c}개를 먹고, 남은 쿠키를 한 상자에 ${b}개씩 담으려고 한다. 몇 상자에 담을 수 있고, 몇 개가 남는가?`, [{ answer: q, unit: '상자' }, { answer: r, unit: '개' }], {
        explain: `먹고 남은 쿠키는 ${expr(a, '-', c, '=', left)}(개)이다. ${shown(left, b)}`, facts: { calc: [[`((${a}-${c})-(${a}-${c})%${b})/${b}`, 0], [`(${a}-${c})%${b}`, 1]] }
      });
    }, { standard: SOLVE }),
    H('h-more2', '문장제: 곱한 뒤 나누어 더 필요한 수 구하기', '심72 ②87 덧', (d) => {
      // 25개씩 4봉지를 7명에게 남김없이 → 100÷7=14…2 → 5개 더
      const [per, n, b] = d.until(() => [d.int(12, 29), d.int(3, 6), d.int(6, 9)], ([x, y, z]) => (x * y) % z !== 0 && y !== z && x % 10 !== 0);
      const total = per * n, q = quot(total, b), r = total % b;
      return N(`한 봉지에 ${per}개씩 들어 있는 사탕이 ${n}봉지 있다. 이 사탕을 ${b}명에게 남김없이 똑같이 나누어 주려면 사탕은 적어도 몇 개 더 필요한가?`, b - r, {
        unit: '개', explain: `사탕은 모두 ${expr(per, '*', n, '=', total)}(개)이다. ${shown(total, b)}이므로 ${b - r}개가 더 있으면 한 명에게 ${q + 1}개씩 남김없이 나누어 줄 수 있다.`,
        facts: { calc: [[`${b}-(${per}*${n})%${b}`, 0]] }
      });
    }, { standard: SOLVE }),
    HB('h-batch', '문장제: 나눈 몫에 곱하기', '②89', (d) => {
      // 구슬 97개, 팔찌 한 개에 8개 → 12개(1개는 남는다), 팔찌마다 방울 3개 → 36개
      const [a, b, k] = d.until(() => [d.int(42, 98), d.int(4, 9), d.int(2, 5)], ([x, y, z]) => x % y !== 0 && quot(x, y) >= 6 && y !== z && x % 10 !== 0), q = quot(a, b);
      return N(`구슬 ${a}개로 팔찌를 만들려고 한다. 팔찌 한 개에 구슬이 ${b}개 필요하고, 만든 팔찌마다 방울을 ${k}개씩 단다. 팔찌를 만들 수 있는 만큼 만들 때, 필요한 방울은 모두 몇 개인가?`, q * k, {
        unit: '개', explain: `${shown(a, b)}이므로 팔찌는 ${q}개 만들 수 있다. 방울은 ${expr(q, '*', k, '=', q * k)}(개) 필요하다.`, facts: { calc: [[`(${a}-${a}%${b})/${b}*${k}`, 0]] }
      });
    }, { standard: SOLVE }),
    H('h-left', '문장제: 두 나눗셈의 나머지 비교', '심78 ②91 ③28 덧', (d) => {
      // 전체가 많은 쪽이 남은 것은 더 적다. 몫의 차를 답하는 아이가 고를 보기를 넣는다.
      const people = d.shuffle(NAMES).slice(0, 2);
      const [[a, b], [c, e]] = d.until(() => [rest2(d), rest2(d)], ([[x, y], [z, w]]) => x !== z && y !== w && x % y !== z % w && (x > z) !== (x % y > z % w));
      const rs = [a % b, c % e], winner = rs[0] > rs[1] ? 0 : 1, gap = Math.abs(rs[0] - rs[1]);
      const other = [Math.abs(quot(a, b) - quot(c, e)), gap + 1].find((v) => v !== gap && v > 0);
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
      return C(`${name(people[0], '은/는')} 밤 ${a}개를 한 봉지에 ${b}개씩 담고, ${name(people[1], '은/는')} 밤 ${c}개를 한 봉지에 ${e}개씩 담았다. 봉지에 담고 남은 밤은 누가 몇 개 더 많은가?`, list.map(([i, n]) => `${people[i]}, ${n}개`), list.findIndex(([i, n]) => i === winner && n === gap), {
        explain: `${people[0]}: ${shown(a, b)}, ${people[1]}: ${shown(c, e)}이다. 남은 밤은 차례로 ${rs[0]}개, ${rs[1]}개이므로 ${name(people[winner], '이/가')} ${gap}개 더 많다.`,
        facts: { who: { exprs: [`${a}%${b}`, `${c}%${e}`], values: rs, options: list } }
      });
    }, { standard: SOLVE }),
    HB('h-plates', '문장제: 따로 나누어 더하기', '③75 덧', (d) => {
      // 단팥빵 48개는 3개씩, 크림빵 56개는 4개씩 → 16+14=30(접시)
      const [a, b, c, e] = d.until(() => [d.int(36, 96), d.int(3, 8), d.int(36, 96), d.int(3, 8)], ([x, y, z, w]) => x % y === 0 && z % w === 0 && y !== w && x !== z && x % 10 !== 0 && z % 10 !== 0 && x / y >= 11 && z / w >= 11);
      return N(`단팥빵 ${a}개는 한 접시에 ${b}개씩, 크림빵 ${c}개는 한 접시에 ${e}개씩 놓았다. 빵을 놓은 접시는 모두 몇 개인가?`, a / b + c / e, {
        unit: '개', explain: `단팥빵을 놓은 접시는 ${shown(a, b)}(개), 크림빵을 놓은 접시는 ${shown(c, e)}(개)이다. ${expr(a / b, '+', c / e, '=', a / b + c / e)}`,
        facts: { calc: [[`${a}/${b}+${c}/${e}`, 0]] }
      });
    }, { standard: SOLVE })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
