// 2학년 1학기 1단원 세 자리 수 — 뛰어 세기와 1000, 크기 비교의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴_1의 마·바 묶음 49~74번, 심화꼴 41꼴)을 꼴마다 따져서 실었다. 단원 틀과 그림 도구는 2-1-1a.js에 있다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 뜻을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 틀리게 되는 장치를 문제에 넣었다(보기를 쓴 문항은 보기마다 어떤 아이가 고르는지 주석에 적는다).
//   ① 100의 뜻을 하나로만 안다: 「10이 9개」「90보다 1만큼」「98보다 20만큼」처럼 아슬아슬하게 다른 말을 100으로 읽는다.
//   ② 「10이 16개」의 16을 십의 자리에 그대로 적거나 6만 적는다(10이 10개이면 100이 1개라는 것을 놓친다). 동전·점수도 같다.
//   ③ 숫자가 나타내는 값을 숫자의 크기나 수의 크기로 가린다(같은 5라도 자리에 따라 500, 50, 5).
//   ④ 수 모형의 조각 수(낱개가 많은 쪽)로 크기를 가린다.
//   ⑤ 10씩 뛰어 세다가 390 다음에서 백의 자리를 올리지 못한다.
//   ⑥ 가장 작은 수를 만들 때 0을 백의 자리에 놓는다.
//   ⑦ □가 든 수는 □ 자리만 보고, 같은 숫자를 넣었을 때 아랫자리까지 견주지 않는다. 가려진 숫자가 있으면 비교할 수 없다고 여긴다.
// 그다음에 두 번 넘게 생각해야 하는 문제를 실었다(거꾸로 뛰어 세어 처음 수 찾기, 풀어 준 수에서 뛰어 세기, 카드로 만든 수의 자리 숫자,
// 자리 숫자가 정해진 수의 개수, 다르게 나타낸 세 수의 차례).
//
// 뺀 것과 까닭
//  - 교과서 밖 간격: 심25(20씩 거꾸로 뛰어 세기) — 이 단원의 뛰어 세기는 100씩·10씩·1씩뿐이다.
//  - 조건 풀이·경우 따지기가 어려움의 전부인 것: ①74·심41(범위와 자리 조건 여럿에 맞는 수), 심35(수 카드로 조건에 맞는 수를 「모두」 만들기),
//    심40(수 모형 몇 개로 나타낼 수 있는 수의 개수), 심39(수 하나로 정해지지 않는 설명이 섞인 비교).
//  - 같은 문제: 수직선에 그린 뛰어 세기(①50 변형)는 뛰어 세기 띠와, 잇기(①28 변형·심10 변형)는 읽는 말 고르기와, ①71의 그림 꼴(천재 7차시, 그림 속 수를 알 수 없음)은 h-box-tens 와 같다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, lines, tagged, numbers, table, blocks, cards, box, josa, name, say, N, M, C } = B.kit;
  const { NUM, ORDER, PLACES, pow, digitAt, pickDigits, toNum, quote, vx, coins, hops } = B.kit.g211;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SIGNS = ['&gt;', '=', '&lt;'];
  const signOf = (left, right) => (left > right ? 0 : left === right ? 1 : 2);
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const both = (first, second) => [{ label: LABELS[0], answer: first }, { label: LABELS[1], answer: second }];
  const steps = (from, step, times) => Array.from({ length: times }, (_, i) => from + step * (i + 1));
  // 수를 늘어놓고 끝에 「으로/로」를 붙인다: 786, 787, 790으로
  const listTo = (list) => list.slice(0, -1).map(String).concat([josa(list[list.length - 1], '으로/로')]).join(', ');

  B.addTypes('2-1-1', 'skip', [
    T('sk-hundred', '100씩 뛰어 세기', '①49 심22', (d) => {
      const s = d.int(1, 4) * 100 + d.int(11, 99), at = (i) => s + 100 * i;
      return M('100씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?', both(at(2), at(4)), {
        figure: hops([at(0), at(1), LABELS[0], at(3), LABELS[1]]), explain: `100씩 뛰어 세면 백의 자리 숫자가 1씩 커진다. ㉠은 ${at(2)}, ㉡은 ${at(4)}이다.`, facts: { calc: [[`${at(1)}+100`, 0], [`${at(3)}+100`, 1]], rule: 'by-hundred' }
      });
    }),
    T('sk-ten', '10씩 뛰어 세기', '①50 심22', (d) => {
      const s = d.int(1, 9) * 100 + d.int(1, 4) * 10 + d.int(1, 9), at = (i) => s + 10 * i;
      return M('10씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?', both(at(3), at(4)), {
        figure: hops([at(0), at(1), at(2), LABELS[0], LABELS[1]]), explain: `10씩 뛰어 세면 십의 자리 숫자가 1씩 커진다. ㉠은 ${at(3)}, ㉡은 ${at(4)}이다.`, facts: { calc: [[`${at(2)}+10`, 0], [`${at(2)}+10+10`, 1]], rule: 'by-ten' }
      });
    }),
    T('sk-ten-cross', '규칙을 찾아 뛰어 세기', '①51 심22', (d) => {
      // 590 다음에서 백의 자리 숫자가 바뀐다. 맨 앞 칸은 거꾸로 생각해야 한다.
      const s = d.int(1, 8) * 100 + 60 + d.int(0, 9), at = (i) => s + 10 * i;
      return M('같은 수만큼씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?', both(at(0), at(4)), {
        figure: hops([LABELS[0], at(1), at(2), at(3), LABELS[1]]), explain: `10씩 뛰어 세었다. ㉠은 ${at(1)}보다 10만큼 더 작은 ${at(0)}이다. ${at(3)}에서 10만큼 뛰어 세면 백의 자리 숫자가 바뀌어 ㉡은 ${at(4)}이다.`,
        facts: { calc: [[`${at(1)}-(${at(2)}-${at(1)})`, 0], [`${at(3)}+(${at(2)}-${at(1)})`, 1]] }
      });
    }),
    T('sk-one', '1씩 뛰어 세기', '①52 심22', (d) => {
      const s = d.int(1, 9) * 100 + d.int(0, 8) * 10 + 7, at = (i) => s + i;
      return M('1씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?', both(at(1), at(3)), {
        figure: hops([at(0), LABELS[0], at(2), LABELS[1], at(4)]), explain: `㉠은 ${at(0)} 다음의 수인 ${at(1)}이다. ${at(2)} 다음의 수는 십의 자리 숫자가 바뀌어 ㉡은 ${at(3)}이다.`, facts: { calc: [[`${at(0)}+1`, 0], [`${at(2)}+1`, 1]], rule: 'by-one' }
      });
    }),
    T('sk-back-ten', '10씩 거꾸로 뛰어 세기', '①53 심23', (d) => {
      const s = d.int(1, 9) * 100 + d.int(5, 9) * 10 + d.int(1, 9), at = (i) => s - 10 * i;
      return M(`${s}부터 10씩 거꾸로 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, both(at(2), at(4)), {
        figure: hops([at(0), at(1), LABELS[0], at(3), LABELS[1]]), explain: `10씩 거꾸로 뛰어 세면 십의 자리 숫자가 1씩 작아진다. ㉠은 ${at(2)}, ㉡은 ${at(4)}이다.`, facts: { calc: [[`${at(1)}-10`, 0], [`${at(3)}-10`, 1]] }
      });
    }),
    T('sk-back-find', '줄어드는 규칙 찾기', '①53 심23', (d) => {
      const s = d.int(7, 9) * 100 + d.int(11, 99), at = (i) => s - 100 * i;
      return M('규칙을 찾아 ㉠, ㉡에 알맞은 수를 구하시오.', both(at(2), at(5)), {
        figure: hops([at(0), at(1), LABELS[0], at(3), at(4), LABELS[1]]), explain: `백의 자리 숫자가 1씩 작아진다. 100씩 거꾸로 뛰어 세었다. ㉠은 ${at(2)}, ㉡은 ${at(5)}이다.`,
        facts: { calc: [[`${at(1)}-(${at(0)}-${at(1)})`, 0], [`${at(4)}-(${at(0)}-${at(1)})`, 1]] }
      });
    }),
    T('sk-step', '몇씩 뛰어 세었는지', '①54 심24', (d) => {
      const k = d.int(0, 2), step = pow(k), s = toNum([d.int(1, 6), d.int(1, 6), d.int(1, 6)]), row = [0, 1, 2, 3].map((i) => s + step * i);
      return N('몇씩 뛰어 세었는가?', step, { figure: hops(row), explain: `${PLACES[k]}의 자리 숫자가 1씩 커진다. ${step}씩 뛰어 세었다.`, facts: { calc: [[`${row[1]}-${row[0]}`, 0]] } });
    }),
    T('sk-how-back', '거꾸로 뛰어 센 방법', '①54 심24', (d) => {
      // 틀린 보기: 줄어드는 것을 놓친 것, 백의 자리 숫자가 바뀌는 것만 본 것, 일의 자리 숫자로 헷갈린 것
      const s = d.int(2, 9) * 100 + 10 + d.int(1, 9), row = [0, 1, 2, 3].map((i) => s - 10 * i);
      const rows = d.shuffle([['10씩 거꾸로 뛰어 세었다.', -10], ['10씩 뛰어 세었다.', 10], ['100씩 거꾸로 뛰어 세었다.', -100], ['1씩 거꾸로 뛰어 세었다.', -1]]);
      return C('수를 차례로 썼다. 뛰어 센 방법을 바르게 말한 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1] === row[1] - row[0]), {
        figure: hops(row), explain: `수가 10씩 작아진다. ${row[1]}에서 10만큼 거꾸로 뛰어 세면 백의 자리 숫자가 바뀌어 ${row[2]}이다.`, facts: { claimed: rows.map((r) => [`${row[1]}-${row[0]}`, r[1]]), claimedWant: true }
      });
    }),
    T('sk-place', '뛰어 세면 바뀌는 자리', '①55', (d) => {
      const k = d.int(0, 2), step = pow(k), s = toNum([d.int(1, 6), d.int(1, 6), d.int(1, 6)]), row = [0, 1, 2, 3].map((i) => s + step * i);
      return C('수가 다음과 같이 커질 때, 어느 자리 숫자가 1씩 커지는가?', ['백의 자리', '십의 자리', '일의 자리'], 2 - k, {
        figure: hops(row), explain: `${PLACES[k]}의 자리 숫자가 1씩 커진다. ${step}씩 뛰어 세었다.`, facts: { choose: { exprs: [2, 1, 0].map((p) => `(${row[1]}-${row[0]})/${pow(p)}`), rule: 'equals', target: 1 }, unseen: [100, 10, 1] }
      });
    }),
    T('sk-like', '보기의 규칙대로 뛰어 세기', '①56', (d) => {
      const step = d.pick([10, 100]), from = () => (step === 10 ? d.int(1, 9) * 100 + d.int(1, 5) * 10 + d.int(1, 9) : d.int(1, 5) * 100 + d.int(11, 99));
      const ex = from(), s = d.until(from, (v) => v !== ex), row = [0, 1, 2, 3].map((i) => ex + step * i);
      return M('보기와 같은 규칙으로 뛰어 세었다. ㉠, ㉡에 알맞은 수는?', both(s + step, s + 2 * step), {
        figure: lines([`<span class="mb-tag">보기</span>${row.join(' → ')}`, `<span class="mb-tag"></span>${[s, box(LABELS[0]), box(LABELS[1])].join(' → ')}`]),
        explain: `보기는 ${step}씩 뛰어 세었다. ${s}에서 ${step}씩 뛰어 세면 ${s + step}, ${s + 2 * step}이다.`, facts: { calc: [[`${s}+(${row[1]}-${row[0]})`, 0], [`${s}+(${row[1]}-${row[0]})+(${row[1]}-${row[0]})`, 1]] }
      });
    }),
    T('sk-times', '몇 번 뛰어 센 수', '①57', (d) => {
      const s = d.int(1, 3) * 100 + d.int(11, 99), k = d.int(3, 5);
      return N(`${s}에서 100씩 ${k}번 뛰어 센 수는?`, s + 100 * k, { explain: `100씩 ${k}번 뛰어 세면 ${steps(s, 100, k).join(', ')}이다.`, facts: { calc: [[`${s}+100*${k}`, 0]], rule: 'times-hundred' } });
    }),
    T('sk-far', '뛰어 센 줄의 끝 수', '심28', (d) => {
      const s = d.int(1, 4) * 100 + d.int(11, 99);
      return N(`${s}부터 100씩 뛰어 세었다. ㉠에 알맞은 수는?`, s + 400, { figure: hops([s, '', '', '', LABELS[0]]), explain: `㉠은 ${s}에서 100씩 4번 뛰어 센 수이다. ${steps(s, 100, 4).join(', ')}이므로 ${s + 400}이다.`, facts: { calc: [[`${s}+100*4`, 0]], unseen: [4] } });
    }),
    T('sk-odd-rule', '뛰어 센 규칙이 다른 하나', '①58', (d) => {
      const [common, lone] = d.pick([[100, 10], [10, 100], [100, 1], [10, 1]]), at = d.int(0, 3);
      const from = (step) => (step === 100 ? d.int(1, 7) * 100 + d.int(11, 99) : step === 10 ? d.int(1, 9) * 100 + d.int(1, 7) * 10 + d.int(0, 9) : d.int(1, 9) * 100 + d.int(1, 9) * 10 + d.int(1, 7));
      const rows = [0, 1, 2, 3].map((i) => { const step = i === at ? lone : common, s = from(step); return [s, s + step, s + 2 * step]; });
      return C('뛰어 센 규칙이 나머지 셋과 다른 하나는?', LABELS.slice(0, 4), at, { figure: tagged(rows.map((row) => row.join(', '))), explain: `${LABELS[at]}은 ${lone}씩, 나머지는 ${common}씩 뛰어 세었다.`, facts: { choose: { exprs: rows.map((row) => `${row[1]}-${row[0]}`), rule: 'odd' } } });
    }),
    T('sk-who-wrong', '뛰어 세기를 잘못 말한 사람', '①59', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), bad = d.int(0, 2), a = d.int(6, 9) * 100, b = d.int(1, 8) * 100 + d.int(1, 6) * 10, c = d.int(1, 9) * 100 + d.int(1, 9) * 10 + d.int(0, 6);
      const plan = d.shuffle([
        [[a, a - 100, a - 200, a - 300], bad === 0 ? ['100씩 뛰어 센 것이다.', 100] : ['100씩 거꾸로 뛰어 센 것이다.', -100], '100씩 거꾸로'],
        [[b, b + 10, b + 20, b + 30], bad === 1 ? ['100씩 뛰어 센 것이다.', 100] : ['10씩 뛰어 센 것이다.', 10], '10씩'],
        [[c, c + 1, c + 2, c + 3], bad === 2 ? ['10씩 뛰어 센 것이다.', 10] : ['1씩 뛰어 센 것이다.', 1], '1씩']
      ]);
      const at = plan.findIndex(([list, told]) => list[1] - list[0] !== told[1]), listed = (list) => `${list.slice(0, 3).join(', ')}, ${josa(list[3], '은/는')}`;
      return C('뛰어 세기를 잘못 말한 사람은?', who, at, {
        figure: lines(plan.map(([list, told], i) => `<span class="mb-tag">${who[i]}</span>${listed(list)} ${told[0]}`)), explain: `${listed(plan[at][0])} ${plan[at][2]} 뛰어 센 것이다.`,
        facts: { claimed: plan.map(([list, told]) => [`${list[1]}-${list[0]}`, told[1]]), claimedWant: false }
      });
    }),
    T('sk-word', '같은 수만큼 여러 번 늘어난 양', '①60 심30', (d, turn) => {
      if (turn === 0) {
        const who = d.pick(NAMES), a = d.int(1, 8) * 100 + d.int(1, 5) * 10 + d.int(1, 9), k = d.int(3, 4);
        return N(`${name(who, '은/는')} 오늘까지 책을 ${a}쪽 읽었다. 내일부터 하루에 10쪽씩 ${k}일 동안 더 읽으면 모두 몇 쪽을 읽게 되는가?`, a + 10 * k, { unit: '쪽', explain: `${a}에서 10씩 ${k}번 뛰어 세면 ${steps(a, 10, k).join(', ')}이다.`, facts: { calc: [[`${a}+10*${k}`, 0]] } });
      }
      const a = d.int(1, 4) * 100 + d.int(1, 9) * 10, k = d.int(3, 5);
      return N(`저금통에 ${a}원이 있다. 100원짜리 동전 ${k}개를 더 넣으면 저금통에 있는 돈은 모두 얼마인가?`, a + 100 * k, { unit: '원', explain: `${a}에서 100씩 ${k}번 뛰어 세면 ${steps(a, 100, k).join(', ')}이다.`, facts: { calc: [[`${a}+100*${k}`, 0]] } });
    }, { count: 2 }),
    T('sk-thousand', '999보다 1만큼 더 큰 수', '①61', () => N('999보다 1만큼 더 큰 수는?', 1000, { explain: '999 다음의 수는 1000이다. 1000은 천이라고 읽는다.', facts: { calc: [['999+1', 0]], rule: 'next-thousand' } })),
    T('sk-to-thousand', '1000까지 차례로 세기', '①61', () => M('수를 차례로 썼다. ㉠, ㉡에 알맞은 수는?', both(998, 1000), {
      figure: hops([996, 997, LABELS[0], 999, LABELS[1]]), explain: '1씩 커진다. 997 다음의 수는 998, 999 다음의 수는 1000이다.', facts: { calc: [['997+1', 0], ['999+1', 1]], unseen: [1] }
    })),
    T('sk-thousand-say', '1000에 대한 설명', '①61 심6', (d) => {
      // 틀린 설명: 900에서 10만큼(990과 헷갈림), 99에서 1만큼(999와 헷갈림), 10이 10개(100과 헷갈림)
      const slip = d.pick([['900보다 10만큼 더 큰 수이다.', '900+10', '900보다 10만큼 더 큰 수는 910이다.'], ['99보다 1만큼 더 큰 수이다.', '99+1', '99보다 1만큼 더 큰 수는 100이다.'], ['10이 10개인 수이다.', '10*10', '10이 10개인 수는 100이다.']]);
      const rows = d.shuffle([['999보다 1만큼 더 큰 수이다.', '999+1'], ['990보다 10만큼 더 큰 수이다.', '990+10'], ['100이 10개인 수이다.', '100*10'], slip]);
      return C('1000을 잘못 설명한 것은?', rows.map((row) => row[0]), rows.indexOf(slip), { explain: `${slip[2]} 나머지는 모두 1000을 나타낸다.`, facts: { big: { odd: rows.map((row) => row[1]) } } });
    })
  ]);

  B.addTypes('2-1-1', 'compare', [
    T('cp-two', '두 수의 크기 비교', '①62 심31', (d, turn) => {
      // 낮은 자리의 숫자가 큰 쪽이 더 작은 수가 되게 한다.
      const h = d.int(2, 8);
      let big, small, why;
      if (turn === 0) { big = h * 100 + d.int(10, 49); small = (h - 1) * 100 + d.int(50, 99); why = '백의 자리 숫자가 큰 수가 더 크다.'; }
      else if (turn === 1) { const [t1, t2] = pickDigits(d, 2).sort((p, q) => q - p); big = h * 100 + t1 * 10 + d.int(0, 4); small = h * 100 + t2 * 10 + d.int(5, 9); why = '백의 자리 숫자가 같으므로 십의 자리 숫자를 비교한다.'; }
      else { const t = d.int(1, 9), [o1, o2] = d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2).sort((p, q) => q - p); big = h * 100 + t * 10 + o1; small = h * 100 + t * 10 + o2; why = '백의 자리 숫자와 십의 자리 숫자가 각각 같으므로 일의 자리 숫자를 비교한다.'; }
      const [left, right] = d.bool() ? [big, small] : [small, big];
      return C('두 수의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, signOf(left, right), {
        figure: versus(left, right), explain: `${why} ${big} &gt; ${small}`, facts: { choose: { exprs: [String(left), String(right)], rule: 'compare' }, rule: ['differ-hundreds', 'differ-tens', 'differ-ones'][turn] }
      });
    }, { count: 3 }),
    T('cp-place', '처음으로 다른 자리', '①63', (d) => {
      const k = d.pick([1, 1, 0]), a = toNum(pickDigits(d, 3)), x = digitAt(a, k), y = d.until(() => d.int(1, 9), (v) => v !== x);
      let b = a + (y - x) * pow(k); if (k === 1) b = b - (b % 10) + d.int(0, 9);
      const first = [2, 1, 0].find((p) => digitAt(a, p) !== digitAt(b, p)), row = (n) => [n, digitAt(n, 2), digitAt(n, 1), digitAt(n, 0)];
      return C(`${josa(a, '과/와')} ${josa(b, '을/를')} 백의 자리부터 차례로 비교한다. 숫자가 처음으로 다른 자리는?`, ['백의 자리', '십의 자리', '일의 자리'], 2 - first, {
        figure: table(['수', '백', '십', '일'], [row(a), row(b)]), explain: `백의 자리부터 차례로 비교하면 ${PLACES[first]}의 자리 숫자가 ${josa(digitAt(a, first), '과/와')} ${josa(digitAt(b, first), '으로/로')} 처음 다르다. ${josa(Math.max(a, b), '이/가')} 더 크다.`,
        facts: { truth: [2, 1, 0].map((p) => p === first), want: true }
      });
    }),
    T('cp-order', '세 수의 차례', '①64', (d) => {
      const h = d.int(2, 8), [t1, t2] = d.shuffle([5, 6, 7, 8, 9]).slice(0, 2), up = d.bool();
      const vals = d.shuffle([h * 100 + t1 * 10 + d.int(0, 9), h * 100 + t2 * 10 + d.int(0, 9), (h + 1) * 100 + d.int(1, 2) * 10 + d.int(0, 9)]);
      const right = [0, 1, 2].sort((p, q) => (up ? vals[p] - vals[q] : vals[q] - vals[p])), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C(`${up ? '작은' : '큰'} 수부터 차례로 쓴 것은?`, list.map((o) => o.map((i) => vals[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: numbers(vals), explain: `백의 자리 숫자가 ${h + 1}인 수가 가장 크다. 백의 자리 숫자가 ${h}인 두 수는 십의 자리 숫자를 비교한다. ${right.map((i) => vals[i]).join(', ')}이다.`,
        facts: { choose: { exprs: vals.map(String), rule: up ? 'ascending' : 'descending', orders: list } }
      });
    }),
    T('cp-max', '여러 수 중 가장 큰 수', '①64 심33', (d) => {
      // 낮은 자리의 9에 끌리는 아이가 틀리게: 백의 자리 숫자가 작은 수와 십의 자리 숫자가 0인 수에 큰 숫자를 넣는다.
      const h = d.int(4, 8), best = h * 100 + d.int(1, 3) * 10 + d.int(0, 8), same = h * 100 + d.int(6, 9);
      const list = d.shuffle([best, same, (h - 1) * 100 + 90 + d.int(5, 9), (h - 2) * 100 + d.int(5, 9) * 10 + 9, (h - 3) * 100 + 99 - d.int(0, 3)]);
      return C('가장 큰 수는?', list.map(String), list.indexOf(best), { explain: `백의 자리 숫자가 가장 큰 수는 ${josa(best, '과/와')} ${same}이다. 두 수의 십의 자리 숫자를 비교하면 ${josa(best, '이/가')} 더 크다.`, facts: { choose: { exprs: list.map(String), rule: 'max' } } });
    }),
    T('cp-rank', '표에서 두 번째로 큰 수', '심33', (d) => {
      const who = d.shuffle(NAMES).slice(0, 4), h = d.int(1, 7), ts = d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
      const vals = d.shuffle([(h + 1) * 100 + d.int(0, 1) * 10 + d.int(1, 9)].concat(ts.map((t) => h * 100 + t * 10 + d.int(1, 9)))), sorted = vals.slice().sort((p, q) => q - p);
      return C('줄넘기를 두 번째로 많이 넘은 사람은?', who, vals.indexOf(sorted[1]), {
        figure: table(['이름', '넘은 횟수(번)'], who.map((w, i) => [w, vals[i]])), explain: `많이 넘은 사람부터 차례로 쓰면 ${sorted.map((v) => who[vals.indexOf(v)]).join(', ')}이다.`, facts: { rank: { values: vals, nth: 2 } }
      });
    }),
    T('cp-word', '더 많은 쪽', '①65 심31', (d) => {
      // 170과 169: 일의 자리 숫자 9에 끌린다. 254와 245: 십과 일의 숫자가 바뀌었다.
      const [n1, n2] = d.shuffle(NAMES).slice(0, 2), h = d.int(1, 8);
      let a, b;
      if (d.bool()) { a = h * 100 + d.int(2, 9) * 10; b = a - 1; }
      else { const [x, y] = pickDigits(d, 2).sort((p, q) => q - p); a = h * 100 + x * 10 + y; b = h * 100 + y * 10 + x; }
      const vals = d.shuffle([a, b]);
      return C(`${name(n1, '은/는')} 밤을 ${vals[0]}개, ${name(n2, '은/는')} ${vals[1]}개 주웠다. 밤을 더 많이 주운 사람은?`, [n1, n2], vals.indexOf(a), {
        explain: `백의 자리 숫자가 같으므로 십의 자리 숫자를 비교한다. ${josa(a, '이/가')} ${b}보다 크다.`, facts: { choose: { exprs: vals.map(String), rule: 'max' } }
      });
    }),
    T('cp-described', '다르게 나타낸 수와 비교', '①66', (d) => {
      // 496의 9와 6을 보고 500보다 크다고 여기는 아이가 있다.
      const a = d.int(3, 8), y = (a - 1) * 100 + d.int(91, 99), big = d.bool(), rows = d.shuffle([[`100이 ${a}개인 수`, `100*${a}`, a * 100], [String(y), String(y), y]]);
      return C(`더 ${big ? '큰' : '작은'} 수는?`, LABELS.slice(0, 2), rows.findIndex((row) => row[2] === (big ? a * 100 : y)), {
        figure: tagged(rows.map((row) => row[0])), explain: `100이 ${a}개인 수는 ${a * 100}이다. ${josa(y, '은/는')} 백의 자리 숫자가 ${a - 1}이므로 ${a * 100}보다 작다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: big ? 'max' : 'min' } }
      });
    }),
    T('cp-cards', '숫자 카드로 가장 큰 수, 가장 작은 수 만들기', '①67', (d, turn) => {
      const digits = pickDigits(d, 3), sorted = digits.slice().sort((p, q) => (turn === 0 ? q - p : p - q));
      return N(`숫자 카드 3장을 한 번씩만 써서 세 자리 수를 만들려고 한다. 가장 ${turn === 0 ? '큰' : '작은'} 수는?`, toNum(sorted), {
        figure: cards(digits), explain: `백의 자리부터 ${turn === 0 ? '큰' : '작은'} 숫자를 차례로 놓는다. ${toNum(sorted)}이다.`, facts: { big: { cardsMake: { digits, rule: turn === 0 ? 'max' : 'min' } } }
      });
    }, { count: 2 }),
    T('cp-between', '두 수 사이에 있는 수', '①68', (d) => {
      // 틀린 보기: 두 끝의 수(「보다 크고」「보다 작은」에는 들어가지 않는다), 범위를 살짝 넘은 수
      const lo = d.int(1, 8) * 100 + d.int(10, 80), hi = lo + d.int(8, 25), inside = d.int(lo + 1, hi - 1), list = d.shuffle([inside, lo, hi, hi + d.int(1, 9)]);
      return C(`${lo}보다 크고 ${hi}보다 작은 수는?`, list.map(String), list.indexOf(inside), {
        explain: `${josa(inside, '은/는')} ${lo}보다 크고 ${hi}보다 작다. ${josa(lo, '과/와')} ${josa(hi, '은/는')} 들어가지 않는다.`, facts: { between: { low: String(lo), high: String(hi), exprs: list.map(String) } }
      });
    }),
    T('cp-between-count', '두 수 사이에 있는 수의 개수', '①69', (d) => {
      const lo = d.int(1, 8) * 100 + d.int(11, 94), gap = d.int(4, 7), hi = lo + gap;
      return N(`${lo}보다 크고 ${hi}보다 작은 세 자리 수는 모두 몇 개인가?`, gap - 1, {
        unit: '개', explain: `${listTo(steps(lo, 1, gap - 1))} 모두 ${gap - 1}개이다. ${josa(lo, '과/와')} ${josa(hi, '은/는')} 들어가지 않는다.`, facts: { calc: [[`${hi}-${lo}-1`, 0]], unseen: [1] }
      });
    }),
    T('cp-box-ones', '□ 안에 들어갈 수 있는 숫자', '①70', (d) => {
      const p = d.int(10, 99), v = d.int(2, 7), less = d.bool(), fits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => (less ? x < v : x > v));
      return N('0부터 9까지의 숫자 중에서 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', fits.length, {
        unit: '개', figure: quote(`${p}${box()} ${less ? '&lt;' : '&gt;'} ${p}${v}`), explain: `백의 자리 숫자와 십의 자리 숫자가 각각 같으므로 □ 안에는 ${v}보다 ${less ? '작은' : '큰'} 숫자가 들어간다. ${listTo(fits)} ${fits.length}개이다.`,
        facts: { digit: { template: `${p}□${less ? '<' : '>'}${p}${v}`, lo: 0, hi: 9, ask: 'count' } }
      });
    }),
    T('cp-true', '바르게 비교한 것', '심32', (d) => {
      // 틀린 보기: 몇백끼리 거꾸로 견준 것, 십의 자리 숫자를 거꾸로 견준 것, 일의 자리의 큰 숫자에 끌린 것
      const h = pickDigits(d, 4, [2, 3, 4, 5, 6, 7, 8]), x = h[0] * 100 + d.int(2, 8) * 10 + d.int(5, 9), c = d.int(6, 9);
      const rows = d.shuffle([[x, '&gt;', x - d.int(1, 4)], [h[1] * 100, '&lt;', (h[1] - 1) * 100], [h[2] * 100 + 90, '&lt;', h[2] * 100 + 80], [h[3] * 100 + c, '&gt;', h[3] * 100 + c * 10]]).map(([l, sign, r]) => [`${l} ${sign} ${r}`, sign === '&gt;' ? l > r : l < r]);
      return C('두 수의 크기를 바르게 비교한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: `백의 자리부터 차례로 비교한다. ${rows.find((row) => row[1])[0]}만 바르게 비교하였다.`, facts: { truth: rows.map((row) => row[1]), want: true } });
    })
  ]);

  B.addGroup('2-1-1', {
    id: 'hard', title: '단원 종합', standard: NUM,
    types: [
      H('h-hundred-all', '100을 나타내는 것 모두 고르기', '3', (d) => {
        // 틀린 설명을 100으로 읽는 아이: 「10이 9개」(90까지만 센다), 「90보다 1만큼」(10과 1을 바꿔 읽는다), 「98보다 20만큼」(2만큼으로 읽는다),
        // 「99보다 10만큼」(1만큼으로 읽는다), 「10이 100개」(10개로 읽는다).
        const GOOD = [['10이 10개인 수', '10*10', 10 * 10], ['90보다 10만큼 더 큰 수', '90+10', 90 + 10], ['99보다 1만큼 더 큰 수', '99+1', 99 + 1], ['80보다 20만큼 더 큰 수', '80+20', 80 + 20], ['95보다 5만큼 더 큰 수', '95+5', 95 + 5]];
        const BAD = [['10이 9개인 수', '10*9', 10 * 9], ['90보다 1만큼 더 큰 수', '90+1', 90 + 1], ['98보다 20만큼 더 큰 수', '98+20', 98 + 20], ['99보다 10만큼 더 큰 수', '99+10', 99 + 10], ['10이 100개인 수', '10*100', 10 * 100]];
        const good = d.int(2, 3), rows = d.shuffle(d.shuffle(GOOD).slice(0, good).concat(d.shuffle(BAD).slice(0, 4 - good))), right = [0, 1, 2, 3].filter((i) => rows[i][2] === 100);
        // 보기: 맞는 것만 모은 것(정답) / 틀린 설명 하나를 100으로 읽은 것 / 맞는 설명 하나를 놓친 것 / 하나를 놓치고 틀린 것을 하나 넣은 것
        const wrong = [0, 1, 2, 3].filter((i) => rows[i][2] !== 100), tidy = (set) => set.slice().sort((p, q) => p - q), drop = d.pick(right), swap = d.pick(right);
        const options = d.shuffle([right, tidy(right.concat([d.pick(wrong)])), right.filter((i) => i !== drop), tidy(right.filter((i) => i !== swap).concat([d.pick(wrong)]))]);
        const mask = (set) => set.reduce((sum, i) => sum + (1 << i), 0), maskExpr = rows.map((row, i) => `${1 << i}*0**(((${row[1]})-100)*((${row[1]})-100))`).join('+');
        return C('100을 나타내는 것을 모두 고른 것은?', options.map((set) => set.map((i) => LABELS[i]).join(', ')), options.indexOf(right), {
          figure: tagged(rows.map((row) => row[0])), explain: `${rows.filter((row) => row[2] !== 100).map((row) => `${row[0]}는 ${row[2]}`).join(', ')}이다. 나머지는 모두 100을 나타낸다.`,
          facts: { claimed: options.map((set) => [maskExpr, mask(set)]), claimedWant: true }
        });
      }),
      H('h-units-claims', '10이나 100이 몇 개인 수의 설명', '6', (d) => {
        // 「10이 50개이면 500」을 고르는 아이: 10개를 넘는 묶음은 없다고 여긴다. 정답(틀린 설명)을 못 고르는 아이: 「10이 9개」를 「100이 9개」로 읽는다.
        const [a, b, c, e] = pickDigits(d, 4, [2, 3, 4, 5, 6, 7, 8, 9]);
        const slip = d.pick([[`10이 ${e}개이면 ${e * 100}이다.`, `10*${e}`, e * 100, `10이 ${e}개이면 ${e * 10}이다.`], [`${josa(e * 100, '은/는')} 1이 ${e * 10}개인 수이다.`, `1*${e * 10}`, e * 100, `1이 ${e * 10}개인 수는 ${e * 10}이다.`]]);
        const rows = d.shuffle([[`100이 ${a}개이면 ${a * 100}이다.`, `100*${a}`, a * 100], [`10이 ${b * 10}개이면 ${b * 100}이다.`, `10*${b * 10}`, b * 100], [`${josa(c * 100, '은/는')} 10이 ${c * 10}개인 수이다.`, `10*${c * 10}`, c * 100], slip]);
        return C('설명이 틀린 것은?', rows.map((row) => row[0]), rows.indexOf(slip), { explain: `${slip[3]} 10이 10개이면 100이므로 10이 ${b * 10}개이면 ${b * 100}이다.`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: false } });
      }),
      H('h-over', '10개를 넘는 묶음이 낀 수', '11 기본 ①31', (d, turn) => {
        if (turn === 0) {
          const a = d.int(2, 7), b = d.int(11, 19), c = d.int(1, 9), n = a * 100 + b * 10 + c;
          return N(`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는?`, n, { explain: `10이 ${b}개이면 ${b * 10}이다. 100이 ${a + 1}개, 10이 ${b - 10}개, 1이 ${c}개인 수와 같으므로 ${n}이다.`, facts: { calc: [[`100*${a}+10*${b}+1*${c}`, 0]], rule: 'over-tens' } });
        }
        const a = d.int(2, 8), b = d.int(1, 8), c = d.int(11, 19), n = a * 100 + b * 10 + c;
        return N(`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는?`, n, { explain: `1이 ${c}개이면 ${c}이다. 100이 ${a}개, 10이 ${b + 1}개, 1이 ${c - 10}개인 수와 같으므로 ${n}이다.`, facts: { calc: [[`100*${a}+10*${b}+1*${c}`, 0]], rule: 'over-ones' } });
      }, { count: 2 }),
      H('h-coins-over', '10개를 넘는 동전', '13 기본 ①33', (d) => {
        const a = d.int(2, 6), b = d.int(11, 15), c = d.int(1, 4), n = a * 100 + b * 10 + c;
        return N('동전은 모두 얼마인가?', n, {
          unit: '원', figure: coins([[100, a], [10, b], [1, c]]), explain: `10원짜리 10개는 100원과 같다. 100원짜리 ${a + 1}개, 10원짜리 ${b - 10}개, 1원짜리 ${c}개와 같으므로 ${n}원이다.`, facts: { calc: [[`100*${a}+10*${b}+1*${c}`, 0]], rule: 'coins-over' }
        });
      }),
      H('h-value-size', '같은 숫자가 나타내는 값이 가장 큰(작은) 수', '16 기본 ①43', (d) => {
        // 가장 큰 값: 숫자가 백의 자리에 있는 수가 답인데 그 수가 넷 가운데 가장 작다 → 「가장 큰 수」를 고르는 아이가 틀린다.
        // 가장 작은 값: 숫자가 일의 자리에 있는 수가 답인데 그 수의 백의 자리 숫자가 크다 → 「가장 작은 수」를 고르는 아이가 틀린다.
        const big = d.bool(), t = big ? d.int(2, 6) : d.int(2, 9), other = () => d.until(() => d.int(1, 9), (v) => v !== t);
        const make = () => {
          if (big) { const up = () => d.int(t + 1, 9); return [[toNum([t, other(), other()]), 2], [toNum([up(), t, other()]), 1], [toNum([up(), other(), t]), 0], [toNum([up(), t, other()]), 1]]; }
          const top = d.until(() => d.int(5, 9), (v) => v !== t), low = () => d.until(() => d.int(1, top - 1), (v) => v !== t);
          return [[toNum([top, other(), t]), 0], [toNum([low(), t, other()]), 1], [toNum([low(), t, other()]), 1], [toNum([t, other(), other()]), 2]];
        };
        const rows = d.shuffle(d.until(make, (list) => new Set(list.map((row) => row[0])).size === 4)), values = rows.map(([, k]) => t * pow(k)), at = rows.findIndex(([, k]) => k === (big ? 2 : 0));
        return C(`숫자 ${josa(t, '이/가')} 나타내는 값이 가장 ${big ? '큰' : '작은'} 수는?`, rows.map((row) => String(row[0])), at, {
          explain: `숫자 ${josa(t, '이/가')} 나타내는 값은 차례로 ${values.join(', ')}이다. 수의 크기가 아니라 숫자 ${josa(t, '이/가')} 있는 자리를 본다.`, facts: { choose: { exprs: rows.map(([n, k]) => vx(n, k)), rule: big ? 'max' : 'min' }, unseen: [100, 10, 1] }
        });
      }),
      H('h-blocks-pieces', '조각이 많아 보이는 수 모형', '기본 ①63', (d) => {
        // 수 모형의 조각 수(십 모형 + 일 모형)가 많을수록 수는 작다 → 조각을 세어 고르는 아이가 틀린다. 백 모형의 수는 모두 같다.
        const big = d.bool(), h = d.int(2, 3), t = d.int(1, 3), rows = d.shuffle([[t, d.int(8, 9)], [t + 1, d.int(5, 6)], [t + 2, d.int(1, 2)]]);
        const vals = rows.map(([tens, ones]) => h * 100 + tens * 10 + ones), at = vals.indexOf(big ? Math.max.apply(null, vals) : Math.min.apply(null, vals));
        return C(`가장 ${big ? '큰' : '작은'} 수를 나타내는 것은?`, LABELS.slice(0, 3), at, {
          figure: vals.map((v, i) => blocks(v, LABELS[i])).join(''), explain: `수 모형이 나타내는 수는 차례로 ${vals.join(', ')}이다. 백 모형의 수가 같으므로 십 모형의 수를 비교한다.`,
          facts: { choose: { exprs: rows.map(([tens, ones]) => `100*${h}+10*${tens}+1*${ones}`), rule: big ? 'max' : 'min' }, unseen: [100, 10, 1] }
        });
      }, { standard: ORDER }),
      H('h-ten-cross', '10씩 뛰어 세어 백의 자리가 바뀌는 수', '26 기본 ①57', (d) => {
        const s = d.int(1, 8) * 100 + d.int(6, 8) * 10 + d.int(1, 9), k = d.int(4, 5);
        return N(`${s}에서 10씩 ${k}번 뛰어 센 수는?`, s + 10 * k, { explain: `10씩 뛰어 세면 ${steps(s, 10, k).join(', ')}이다. 십의 자리 숫자가 9인 수 다음에는 백의 자리 숫자가 1 커진다.`, facts: { calc: [[`${s}+10*${k}`, 0]], rule: 'ten-cross' } });
      }, { standard: ORDER }),
      H('h-cards-zero', '0이 있는 숫자 카드로 가장 작은 수 만들기', '34', (d) => {
        const [x, y] = pickDigits(d, 2).sort((p, q) => p - q), digits = d.shuffle([0, x, y]), n = toNum([x, 0, y]);
        return N('숫자 카드 3장을 한 번씩만 써서 가장 작은 세 자리 수를 만들면?', n, {
          figure: cards(digits), explain: `0은 백의 자리에 놓을 수 없다. 백의 자리에 ${josa(x, '을/를')} 놓고, 십의 자리에 0, 일의 자리에 ${josa(y, '을/를')} 놓는다. ${n}이다.`, facts: { big: { cardsMake: { digits, rule: 'min' } } }
        });
      }, { standard: ORDER }),
      H('h-box-tens', '□가 십의 자리에 있는 수의 비교', '36 기본 ①71', (d, turn) => {
        const a = d.int(1, 9), v = d.int(2, 7);
        if (turn === 0) {
          // 475 < 4□9: 십의 자리만 보는 아이는 7을 빼고 센다. 7을 넣어도 479는 475보다 크다.
          const r = d.int(1, 5), l = d.int(r + 1, 9), right = toNum([a, v, r]), fits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x >= v);
          return N('0부터 9까지의 숫자 중에서 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', fits.length, {
            unit: '개', figure: quote(`${right} &lt; ${a}${box()}${l}`), explain: `백의 자리 숫자가 같다. □ 안에 ${josa(v, '을/를')} 넣으면 ${josa(toNum([a, v, l]), '은/는')} ${right}보다 크므로 ${v}도 들어갈 수 있다. ${listTo(fits)} ${fits.length}개이다.`,
            facts: { big: { boxed: { left: `${a}□${l}`, right: String(right), op: '>', ask: 'count' } } }
          });
        }
        // 8□5 > 869: 십의 자리만 보는 아이는 6을 답한다. 6을 넣으면 865는 869보다 작다.
        const l = d.int(1, 5), r = d.int(l + 1, 9), right = toNum([a, v, r]);
        return N('0부터 9까지의 숫자 중에서 □ 안에 들어갈 수 있는 가장 작은 숫자는?', v + 1, {
          figure: quote(`${a}${box()}${l} &gt; ${right}`), explain: `백의 자리 숫자가 같다. □ 안에 ${josa(v, '을/를')} 넣으면 ${josa(toNum([a, v, l]), '은/는')} ${right}보다 작다. ${josa(v + 1, '을/를')} 넣으면 ${josa(toNum([a, v + 1, l]), '은/는')} ${right}보다 크다.`,
          facts: { big: { boxed: { left: `${a}□${l}`, right: String(right), op: '>', ask: 'min' } } }
        });
      }, { count: 2, standard: ORDER }),
      H('h-hidden-max', '숫자 하나가 가려진 세 수', '기본 ①72', (d) => {
        // 보이는 9에 끌려 고르는 아이(백의 자리 숫자가 작은 두 수에 9가 보인다), 가려진 숫자를 모르니 비교할 수 없다고 여기는 아이(넷째 보기)
        const hs = pickDigits(d, 3, [2, 3, 4, 5, 6, 7, 8]).sort((p, q) => q - p);
        const rows = d.shuffle([[`${hs[0]}●${d.int(0, 3)}`, String(hs[0]), hs[0]], [`${hs[1]}9●`, `(${hs[1]}9-${hs[1]}9%10)/10`, hs[1]], [`${hs[2]}●9`, String(hs[2]), hs[2]]]), at = rows.findIndex((row) => row[2] === hs[0]);
        return C('세 자리 수에서 ● 자리의 숫자가 보이지 않는다. 가장 큰 수는?', LABELS.slice(0, 3).concat(['알 수 없다']), at, {
          figure: tagged(rows.map((row) => row[0])), explain: `백의 자리 숫자가 ${hs[0]}인 ${LABELS[at]}이 가장 크다. ● 자리에 어떤 숫자가 있어도 달라지지 않는다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'max' }, unseen: [10] }
        });
      }, { standard: ORDER }),
      H('h-back-find', '거꾸로 뛰어 세어 처음 수 찾기', '29', (d) => {
        const step = d.pick([100, 10]), k = d.int(3, 5), end = step === 100 ? d.int(6, 9) * 100 + d.int(11, 99) : d.int(1, 9) * 100 + d.int(5, 9) * 10 + d.int(1, 9);
        return N(`어떤 수에서 ${step}씩 ${k}번 뛰어 세었더니 ${josa(end, '이/가')} 되었다. 어떤 수는?`, end - step * k, { explain: `${end}에서 ${step}씩 거꾸로 ${k}번 뛰어 세면 ${steps(end, -step, k).join(', ')}이다.`, facts: { calc: [[`${end}-${step}*${k}`, 0]] } });
      }, { standard: ORDER }),
      H('h-parts-skip', '풀어 준 수에서 뛰어 세기', '27', (d) => {
        const a = d.int(2, 6), b = d.int(11, 15), c = d.int(1, 9), k = d.int(2, 4), base = a * 100 + b * 10 + c;
        return N(`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수에서 10씩 ${k}번 뛰어 센 수는?`, base + 10 * k, {
          explain: `10이 ${b}개이면 ${b * 10}이므로 처음 수는 ${base}이다. ${base}에서 10씩 ${k}번 뛰어 세면 ${steps(base, 10, k).join(', ')}이다.`, facts: { calc: [[`100*${a}+10*${b}+1*${c}+10*${k}`, 0]] }
        });
      }, { standard: ORDER }),
      H('h-cards-place', '숫자 카드로 만든 수의 자리 숫자', '20', (d) => {
        const digits = pickDigits(d, 4), s = digits.slice().sort((p, q) => p - q), big = d.bool(), made = big ? toNum([s[3], s[2], s[1]]) : toNum([s[0], s[1], s[2]]), t = digitAt(made, 1);
        return N(`숫자 카드 4장 중에서 3장을 골라 세 자리 수를 만들려고 한다. 가장 ${big ? '큰' : '작은'} 수에서 십의 자리 숫자가 나타내는 값은?`, t * 10, {
          figure: cards(digits), explain: `가장 ${big ? '큰' : '작은'} 수는 ${made}이다. 십의 자리 숫자는 ${t}이고 ${josa(t * 10, '을/를')} 나타낸다.`, facts: { calc: [[`${t}*10`, 0]], unseen: [10] }
        });
      }),
      H('h-place-count', '자리 숫자가 정해진 수의 개수', '37 기본 ①73', (d) => {
        // 십의 자리 숫자가 같을 때: 일의 자리 숫자가 더 크면 들어가고(664 > 660), 같은 수이면 들어가지 않는다(942는 942보다 크지 않다).
        const a = d.int(1, 9), c = d.int(1, 9), v = d.int(2, 7), same = d.bool(), target = toNum([a, v, same ? c : 0]);
        const fits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => toNum([a, x, c])).filter((n) => n > target);
        return N(`백의 자리 숫자가 ${a}, 일의 자리 숫자가 ${c}인 세 자리 수가 있다. 이 가운데 ${target}보다 큰 수는 모두 몇 개인가?`, fits.length, {
          unit: '개', explain: `${a}□${josa(c, '으로/로')} 나타낼 수 있는 수 중에서 ${target}보다 큰 수는 ${listTo(fits)} ${fits.length}개이다.`, facts: { digit: { template: `${a}□${c}>${target}`, lo: 0, hi: 9, ask: 'count' } }
        });
      }, { standard: ORDER }),
      H('h-three-forms', '다르게 나타낸 세 수의 차례', '38 기본 ①66', (d) => {
        // 「100이 4개」만 보고 ㉠을 사백몇십으로 여기는 아이는 그 수를 가장 작은 수로 놓는다(10이 12개이면 120이라 오백이십이다).
        const a = d.int(2, 7), b = d.int(11, 15), v1 = a * 100 + b * 10, v3 = (a + 1) * 100, v2 = d.until(() => (a + 1) * 100 + d.int(1, 6) * 10, (v) => v !== v1);
        const rows = d.shuffle([[`100이 ${a}개, 10이 ${b}개인 수`, `100*${a}+10*${b}`, v1], [say(v2), String(v2), v2], [`${v3 - 1}보다 1만큼 더 큰 수`, `${v3 - 1}+1`, v3]]), vals = rows.map((row) => row[2]);
        const right = [0, 1, 2].sort((p, q) => vals[q] - vals[p]), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
        return C('큰 수부터 차례로 기호를 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
          figure: tagged(rows.map((row) => row[0])), explain: `10이 ${b}개이면 ${b * 10}이므로 100이 ${a}개, 10이 ${b}개인 수는 ${v1}이다. 수로 쓰면 차례로 ${vals.join(', ')}이다.`,
          facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'descending', orders: list }, big: { shown: [[say(v2), v2]] } }
        });
      }, { standard: ORDER })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
