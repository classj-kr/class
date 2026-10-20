// 4학년 1학기 1단원 큰 수 — 뛰어 세기, 수의 크기 비교, 수 카드로 수 만들기의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3의 「뛰어 세기」「크기 비교」「수 만들기」 묶음, 심화꼴 72꼴)과 덧문서를 꼴마다 따져서 실었다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 0이 여러 군데 낀 수를 읽을 때 자리를 건너뛰거나 당겨 읽는다.
//   ② 10개가 넘는 묶음이 낀 수에서 그 자리의 숫자를 묶음의 수로 여긴다.
//   ③ 숫자가 나타내는 값의 몇 배를 물으면 숫자만 보거나 자리만 본다.
//   ④ □가 든 수는 □를 모르니 크기를 비교할 수 없다고 여긴다.
//   ⑤ 몇 번째에 처음으로 목표에 닿는지를 셀 때 처음 한 번을 빼먹거나 더 센다.
// 그다음에 두 번 넘게 따져야 하는 문제를 실었다(몇 배 한 수의 자리 숫자, 살 수 있는 개수, 기준에 가장 가까운 수 만들기).
//
// 뺀 것과 까닭
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: 여러 조건을 모두 만족하는 수(기본 ①147 ②125 ③28 일부, 심화 32·69·71), 빠진 카드로 수 알아내기(심화 72),
//    □가 든 여러 수의 차례(심화 64), 길을 따라가며 수 만들기(기본 ③127, 놀이)
//  - 뜻 없는 셈: 두 물음의 답을 더하기(심화 16), 같은 숫자가 나타내는 값의 합(기본 ②26 ③43)
//  - 서술형·작도: 규칙을 정해 뛰어 세기(기본 ①118 ②106 ③103), 비교한 까닭 쓰기(기본 ③120 심화 61), 수직선에 나타내어 비교하기(기본 ①121 ③110)
//  - 같은 문제: 자리 표에 써넣고 비교하기(기본 ①120 ③108)는 두 수의 비교와, 수 카드로 만든 수 읽기(기본 ②120)는 가장 큰 수 만들기·읽기와 같다.
//    거꾸로 뛰어 세기의 조 단위(기본 ①112)와 해마다 늘어난 양(기본 ①116)은 억 단위·다달이 모은 돈과 수만 다르다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, tagged, numbers, table, cards, josa, name, say, cut, named, N, M, C } = B.kit;
  const NUM = '4수01-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const PLACES = ['일', '십', '백', '천', '만', '십만', '백만', '천만', '억', '십억', '백억', '천억', '조', '십조', '백조', '천조'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SIGNS = ['&gt;', '=', '&lt;'];
  const pow = (k) => Number('1e' + k);
  const big = (jo, eok, man, one) => jo * 1e12 + eok * 1e8 + man * 1e4 + (one || 0);
  const digitAt = (n, k) => Math.floor(n / pow(k)) % 10;
  const dx = (n, k) => `((${n}-${n}%${pow(k)})/${pow(k)})%10`;
  const vx = (n, k) => `(${dx(n, k)})*${pow(k)}`;
  const uniq = (d, len) => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);
  const toNum = (digits) => digits.reduce((n, v) => n * 10 + v, 0);
  const zerosIn = (n) => String(n).split('0').length - 1;
  const said = (n) => '「' + say(n) + '」' + josa(say(n), '이라고/라고').slice(say(n).length);
  const quote = (text) => lines([text]);
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const signOf = (left, right) => (left > right ? 0 : left === right ? 1 : 2);
  // 큰 수 수직선: 두 끝 사이를 열 칸으로 나누고 at 번째 눈금에 ㉠을 단다.
  function bigLine(leftText, rightText, at) {
    const x = (i) => 30 + i * 24, y = 44, word = 'style="font-size:15px;font-weight:600"';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(10)}" y2="${y}"/>`;
    for (let i = 0; i <= 10; i += 1) out += `<line class="mb-axis" x1="${x(i)}" y1="${y - (i % 10 === 0 ? 7 : 4)}" x2="${x(i)}" y2="${y + (i % 10 === 0 ? 7 : 4)}"/>`;
    out += `<text class="mb-axis-label" ${word} x="${x(0)}" y="${y + 25}" text-anchor="middle">${leftText}</text><text class="mb-axis-label" ${word} x="${x(10)}" y="${y + 25}" text-anchor="middle">${rightText}</text>`;
    out += `<text class="mb-axis-label" ${word} x="${x(at)}" y="${y - 20}" text-anchor="middle">${LABELS[0]}</text><line class="mb-axis" x1="${x(at)}" y1="${y - 15}" x2="${x(at)}" y2="${y - 6}"/>`;
    return `<svg class="mb-numberline" viewBox="0 0 300 78" width="300" role="img" aria-label="수직선: ${leftText}부터 ${rightText}까지를 똑같이 10칸으로 나누었다. ${LABELS[0]}은 ${leftText}에서 ${at}칸 간 곳">${out}</svg>`;
  }

  B.addTypes('4-1-1', 'skip', [
    T('skip-man', '정해 준 만큼 뛰어 세기(천만까지)', '①96 ②92 ③88', (d) => {
      const step = d.pick([10000, 20000, 100000, 300000, 1000000]), start = d.int(12, 88) * 10000 + d.pick([0, 5000]), at = (k) => start + step * k;
      return M(`${step}씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: at(2) }, { label: LABELS[1], answer: at(4) }], {
        figure: numbers([at(0), at(1), box(LABELS[0]), at(3), box(LABELS[1])]), explain: `${step}씩 커진다. ㉠은 ${at(1)}보다 ${step} 큰 ${at(2)}, ㉡은 ${at(3)}보다 ${step} 큰 ${at(4)}이다.`, facts: { calc: [[`${at(1)}+${step}`, 0], [`${at(3)}+${step}`, 1]] }
      });
    }),
    T('skip-eok', '정해 준 만큼 뛰어 세기(억)', '①97 ②93 ③89', (d) => {
      const step = d.pick([10, 20, 100, 500]), start = d.int(12, 88) * 10, at = (k) => start + step * k;
      return M(`${step}억씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: at(2), unit: '억' }, { label: LABELS[1], answer: at(4), unit: '억' }], {
        figure: numbers([at(0) + '억', at(1) + '억', box(LABELS[0]), at(3) + '억', box(LABELS[1])]), explain: `${step}억씩 커진다. ㉠은 ${at(2)}억, ㉡은 ${at(4)}억이다.`, facts: { calc: [[`${at(1)}+${step}`, 0], [`${at(3)}+${step}`, 1]] }
      });
    }),
    T('skip-jo', '정해 준 만큼 뛰어 세기(조)', '①98 ③90', (d) => {
      const step = d.pick([10, 100, 200]), start = d.int(12, 58) * 10, at = (k) => start + step * k;
      return M(`${step}조씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: at(2), unit: '조' }, { label: LABELS[1], answer: at(4), unit: '조' }], {
        figure: numbers([at(0) + '조', at(1) + '조', box(LABELS[0]), at(3) + '조', box(LABELS[1])]), explain: `${step}조씩 커진다. ㉠은 ${at(2)}조, ㉡은 ${at(4)}조이다.`, facts: { calc: [[`${at(1)}+${step}`, 0], [`${at(3)}+${step}`, 1]] }
      });
    }),
    T('skip-cross', '억에서 조로 넘어가는 뛰어 세기', '③91', (d) => {
      const step = d.pick([100, 1000]), terms = [3, 2, 1].map((k) => 1e12 - step * 1e8 * k), list = d.shuffle([1e12, 1e13, 1e8, 1e14]);
      return C(`${step}억씩 뛰어 세었다. ㉠에 알맞은 수는?`, list.map(cut), list.indexOf(1e12), {
        figure: numbers(terms.map(cut).concat([box(LABELS[0])])), explain: `${cut(terms[2])}보다 ${step}억 큰 수는 1조이다.`, facts: { pick: { expr: `${terms[2]}+${terms[2]}-${terms[1]}`, options: list }, big: { shown: [[cut(terms[1]), terms[1]], [cut(terms[2]), terms[2]]] } }
      });
    }),
    T('skip-rule-man', '규칙을 찾아 뛰어 세기(천만까지)', '①99 ②96 ③96', (d) => {
      const k = d.int(4, 6), step = pow(k), start = d.int(12, 88) * pow(k) + d.int(1, 9) * pow(k - 1), at = (i) => start + step * i;
      return N('뛰어 세는 규칙을 찾아 빈칸에 알맞은 수를 구하면?', at(3), { figure: numbers([at(0), at(1), at(2), box()]), explain: `${step}씩 커지는 규칙이다. ${at(2)}보다 ${step} 큰 수는 ${at(3)}이다.`, facts: { calc: [[`${at(2)}+${at(2)}-${at(1)}`, 0]] } });
    }),
    T('skip-rule-eok', '규칙을 찾아 뛰어 세기(억)', '①100 ②97 ③97', (d) => {
      const step = d.pick([1e8, 1e7]), start = big(0, d.int(2, 8), d.int(1, 8) * 1000), at = (i) => start + step * i, right = at(3), list = d.shuffle([right, right + step, right + 2 * step, right + 9 * step]);
      return C('뛰어 세는 규칙을 찾을 때, ㉠에 알맞은 수는?', list.map(cut), list.indexOf(right), {
        figure: numbers([cut(at(0)), cut(at(1)), cut(at(2)), box(LABELS[0])]), explain: `${cut(step)}씩 커지는 규칙이다. ${cut(at(2))}보다 ${cut(step)} 큰 수는 ${cut(right)}이다.`, facts: { pick: { expr: `${at(2)}+${at(2)}-${at(1)}`, options: list }, big: { shown: [[cut(at(1)), at(1)], [cut(at(2)), at(2)]] } }
      });
    }),
    T('skip-rule-jo', '규칙을 찾아 뛰어 세기(조)', '①101 ③98', (d) => {
      const step = d.pick([1e12, 1e11]), start = big(d.int(2, 8), d.int(1, 6) * 1000, 0), at = (i) => start + step * i, right = at(3), list = d.shuffle([right, right + step, right + 2 * step, right + 9 * step]);
      return C('뛰어 세는 규칙을 찾을 때, ㉠에 알맞은 수는?', list.map(cut), list.indexOf(right), {
        figure: numbers([cut(at(0)), cut(at(1)), cut(at(2)), box(LABELS[0])]), explain: `${cut(step)}씩 커지는 규칙이다. ${cut(at(2))}보다 ${cut(step)} 큰 수는 ${cut(right)}이다.`, facts: { pick: { expr: `${at(2)}+${at(2)}-${at(1)}`, options: list }, big: { shown: [[cut(at(1)), at(1)], [cut(at(2)), at(2)]] } }
      });
    }),
    T('skip-han', '한글로 쓴 수 뛰어 세기', '①102 ③92', (d) => {
      const step = d.pick([1e5, 2e5]), start = d.int(21, 78) * 1e5, at = (i) => start + step * i, right = at(3), list = d.shuffle([right, right + step, right + 2 * step, right + 1e6]);
      return C('뛰어 세는 규칙을 찾을 때, ㉠에 알맞은 수는?', list.map(say), list.indexOf(right), {
        figure: numbers([say(at(0)), say(at(1)), say(at(2)), box(LABELS[0])]), explain: `${say(step)}씩 커지는 규칙이다. 수로 쓰면 ${at(0)}, ${at(1)}, ${at(2)}이고 다음 수는 ${at(3)}이다.`, facts: { pick: { expr: `${at(2)}+${at(2)}-${at(1)}`, options: list }, big: { shown: [[say(at(1)), at(1)], [say(at(2)), at(2)]] } }
      });
    }),
    T('skip-place', '바뀌는 자리와 뛰어 센 크기', '①103 ③95', (d) => {
      const k = d.int(4, 7), n = d.until(() => toNum(uniq(d, 8)), (v) => digitAt(v, k) <= 6), s = pow(k);
      return C('수가 다음과 같이 커질 때, 어느 자리 숫자가 1씩 커지는가?', [4, 5, 6, 7].map((p) => PLACES[p] + '의 자리'), k - 4, {
        figure: numbers([n, n + s, n + 2 * s]), explain: `${PLACES[k]}의 자리 숫자가 1씩 커진다. ${s}씩 뛰어 센 것이다.`, facts: { choose: { exprs: [4, 5, 6, 7].map((p) => `(${n + s}-${n})/${pow(p)}`), rule: 'equals', target: 1 }, unseen: [1e4, 1e5, 1e6, 1e7] }
      });
    }),
    T('skip-step-man', '얼마씩 뛰어 세었는지(천만까지)', '①104 ②94 ③93', (d) => {
      const step = d.pick([10000, 50000, 200000, 1000000]), start = d.int(12, 88) * 10000 + d.pick([0, 5000]), at = (i) => start + step * i;
      return N('얼마씩 뛰어 세었는가?', step, { figure: numbers([at(0), at(1), at(2), at(3)]), explain: `${at(1)} - ${at(0)} = ${step}`, facts: { calc: [[`${at(1)}-${at(0)}`, 0]] } });
    }),
    T('skip-step-eok', '얼마씩 뛰어 세었는지(억)', '①105 ②95 ③94', (d) => {
      const k = d.pick([8, 9, 10]), step = pow(k), start = d.int(12, 58) * pow(k) + (k > 8 ? d.int(1, 9) * pow(k - 1) : 0), at = (i) => start + step * i, list = d.shuffle([1e8, 1e9, 1e10, 1e11]);
      return C('얼마씩 뛰어 세었는가?', list.map(cut), list.indexOf(step), {
        figure: numbers([0, 1, 2, 3].map((i) => cut(at(i)))), explain: `${cut(at(1))}은 ${cut(at(0))}보다 ${cut(step)} 큰 수이다.`, facts: { pick: { expr: `${at(1)}-${at(0)}`, options: list }, big: { shown: [[cut(at(0)), at(0)], [cut(at(1)), at(1)]] } }
      });
    }),
    T('skip-step-jo', '얼마씩 뛰어 세었는지(조)', '①106', (d) => {
      const step = d.pick([1e10, 1e11, 1e12]), start = big(d.int(2, 8), d.int(1, 5) * 1000 + d.int(1, 6) * 100, 0), at = (i) => start + step * i, list = d.shuffle([1e10, 1e11, 1e12, 1e13]);
      return C('얼마씩 뛰어 세었는가?', list.map(cut), list.indexOf(step), {
        figure: numbers([0, 1, 2, 3].map((i) => cut(at(i)))), explain: `${cut(at(1))}은 ${cut(at(0))}보다 ${cut(step)} 큰 수이다.`, facts: { pick: { expr: `${at(1)}-${at(0)}`, options: list }, big: { shown: [[cut(at(0)), at(0)], [cut(at(1)), at(1)]] } }
      });
    }),
    T('skip-far', '뛰어 센 줄의 끝 수', '①107', (d) => {
      const step = d.pick([10, 20, 50]) * 1e4, start = d.int(21, 78) * 1e5, at = (i) => start + step * i;
      return N('같은 크기만큼 뛰어 세었다. ㉠에 알맞은 수는?', at(4) / 1e4, {
        unit: '만', figure: numbers([cut(at(0)), cut(at(1)), box(), box(), box(LABELS[0])]), explain: `${cut(step)}씩 뛰어 세었다. ${cut(at(1))}에서 3번 더 뛰어 세면 ${cut(at(4))}이다.`,
        facts: { calc: [[`(${at(1)}+(${at(1)}-${at(0)})*3)/10000`, 0]], unseen: [3, 10000], big: { shown: [[cut(at(0)), at(0)], [cut(at(1)), at(1)]] } }
      });
    }),
    T('skip-who', '정해 준 만큼 뛰어 센 것 고르기', '①108 ③99', (d) => {
      const steps = d.shuffle([1e4, 1e5, 1e6]), target = d.pick([1e5, 1e6]), rows = steps.map((s) => { const start = d.int(12, 58) * 1e5 + d.int(1, 9) * 1e4; return [start, start + s, start + 2 * s]; });
      return C(`${cut(target)}씩 뛰어 센 것은?`, LABELS.slice(0, 3), steps.indexOf(target), {
        figure: tagged(rows.map((row) => row.join(', '))), explain: `㉠은 ${cut(steps[0])}씩, ㉡은 ${cut(steps[1])}씩, ㉢은 ${cut(steps[2])}씩 뛰어 세었다.`, facts: { choose: { exprs: rows.map((row) => `${row[1]}-${row[0]}`), rule: 'equals', target }, big: { shown: [[cut(target), target]] } }
      });
    }),
    T('skip-grid', '가로와 세로의 규칙이 다른 표', '①109 ②98 ③100 심47', (d) => {
      const a = d.pick([1e5, 2e5]), b = d.pick([1e6, 2e6]), s = d.int(12, 48) * 1e5, cell = (r, c) => s + a * c + b * r;
      const rows = [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === 0 || c === 0 ? cut(cell(r, c)) : r === 2 && c === 2 ? box(LABELS[0]) : '')));
      return N('가로(→)와 세로(↓)로 각각 같은 크기만큼 뛰어 센 표이다. ㉠에 알맞은 수는?', cell(2, 2) / 1e4, {
        unit: '만', figure: table(null, rows), explain: `가로로 ${cut(a)}씩, 세로로 ${cut(b)}씩 커진다. ${cut(cell(0, 2))}에서 세로로 2번 뛰어 세면 ${cut(cell(2, 2))}이다.`,
        facts: { calc: [[`(${cell(0, 2)}+(${cell(1, 0)}-${cell(0, 0)})*2)/10000`, 0]], unseen: [2, 10000], big: { shown: [[cut(cell(0, 2)), cell(0, 2)], [cut(cell(1, 0)), cell(1, 0)], [cut(cell(0, 0)), cell(0, 0)]] } }
      });
    }),
    T('skip-times', '몇 번 뛰어 센 수', '①110 ②99 심49', (d) => {
      const start = d.int(21, 78) * 1e5, step = d.pick([10, 20, 50]) * 1e4, times = d.int(3, 5), end = start + step * times;
      return N(`${cut(start)}에서 ${cut(step)}씩 ${times}번 뛰어 센 수는?`, end / 1e4, { unit: '만', explain: `${cut(step)}씩 ${times}번 뛰어 세면 ${cut(step * times)}만큼 커진다. ${cut(end)}이다.`, facts: { calc: [[`(${start}+${step}*${times})/10000`, 0]], unseen: [10000], big: { shown: [[cut(start), start], [cut(step), step]] } } });
    }),
    T('skip-count', '몇 번 뛰어 세었는지', '②100', (d) => {
      const a = d.int(1, 8), t = d.int(3, 6), step = 1e7, end = (a + 1) * 1e8, start = end - step * t;
      return N(`${cut(start)}에서 ${cut(step)}씩 뛰어 세어 ${cut(end)}이 되었다. 몇 번 뛰어 세었는가?`, t, { unit: '번', explain: `${cut(end)}은 ${cut(start)}보다 ${cut(end - start)} 큰 수이다. ${cut(step)}씩 ${t}번 뛰어 세었다.`, facts: { calc: [[`(${end}-${start})/${step}`, 0]], big: { shown: [[cut(start), start], [cut(step), step], [cut(end), end]] } } });
    }),
    T('skip-back', '거꾸로 뛰어 세어 어떤 수 구하기', '①111 ②101 심50', (d) => {
      const step = d.pick([10, 100]), times = d.int(3, 4), end = d.int(5, 9) * 100 + d.int(1, 9) * 10;
      return N(`어떤 수에서 ${step}억씩 ${times}번 뛰어 세었더니 ${end}억이 되었다. 어떤 수는?`, end - step * times, { unit: '억', explain: `${end}억에서 ${step}억씩 거꾸로 ${times}번 뛰어 세면 ${end - step * times}억이다.`, facts: { calc: [[`${end}-${step}*${times}`, 0]] } });
    }),
    T('skip-save', '다달이 같은 돈을 모을 때 모은 돈', '①113 ②103 ③104 심51', (d) => {
      const per = d.int(2, 9) * 10000, months = d.int(4, 8);
      return N(`매달 ${per}원씩 ${months}개월 동안 저금하면 모두 얼마가 되는가?`, per * months, { unit: '원', explain: `${per}씩 ${months}번 뛰어 세면 ${per * months}이다.`, facts: { calc: [[`${per}*${months}`, 0]] } });
    }),
    T('skip-save-start', '있던 돈에 다달이 더한 돈', '①114 ③105', (d) => {
      const have = d.int(12, 48) * 10000, per = d.int(2, 5) * 10000, months = d.int(3, 6);
      return N(`통장에 ${have}원이 있다. 다음 달부터 매달 ${per}원씩 ${months}개월 동안 저금하면 통장에 있는 돈은 모두 얼마가 되는가?`, have + per * months, { unit: '원', explain: `${have}에서 ${per}씩 ${months}번 뛰어 세면 ${have + per * months}이다.`, facts: { calc: [[`${have}+${per}*${months}`, 0]] } });
    }),
    T('skip-goal', '목표까지 걸리는 기간', '①115 ②104 심52', (d) => {
      const per = d.pick([20000, 30000, 50000]), have = d.int(12, 38) * 10000, t = d.int(3, 7), goal = have + per * t;
      return N(`지금 ${have}원이 있다. 매달 ${per}원씩 모으면 ${goal}원이 되는 데 몇 개월이 걸리는가?`, t, { unit: '개월', explain: `${have}에서 ${per}씩 뛰어 세어 ${goal}이 될 때까지 센다. ${goal} - ${have} = ${goal - have}이고, ${per}씩 ${t}번이다.`, facts: { calc: [[`(${goal}-${have})/${per}`, 0]] } });
    }),
    T('skip-line', '수직선의 눈금이 나타내는 수', '①117 ②102 심48', (d) => {
      const a = d.int(2, 8), at = d.until(() => d.int(2, 8), (v) => v !== 5), left = a * 1e8, right = (a + 1) * 1e8, value = left + at * 1e7, list = d.shuffle([value, left + at * 1e6, value + 1e7, left + (10 - at) * 1e7]);
      return C(`수직선에서 ${cut(left)}과 ${cut(right)} 사이를 똑같이 10칸으로 나누었다. ㉠이 나타내는 수는?`, list.map(cut), list.indexOf(value), {
        figure: bigLine(cut(left), cut(right), at), explain: `눈금 한 칸은 1000만을 나타낸다. ㉠은 ${cut(left)}에서 ${at}칸 간 곳이므로 ${cut(value)}이다.`, facts: { pick: { expr: `${left}+(${right}-${left})/10*${at}`, options: list }, big: { shown: [[cut(left), left], [cut(right), right]] } }
      });
    }),
    T('skip-two', '두 사람의 저금 비교', '②105', (d) => {
      const [n1, n2] = d.shuffle(NAMES).slice(0, 2), a = d.int(2, 5) * 10000, m1 = d.int(5, 8), b = d.int(2, 5) * 10000 + 5000, m2 = d.until(() => d.int(4, 8), (v) => b * v !== a * m1);
      return C(`${name(n1, '은/는')} 매달 ${a}원씩 ${m1}개월 동안, ${name(n2, '은/는')} 매달 ${b}원씩 ${m2}개월 동안 저금하였다. 저금한 돈이 더 많은 사람은?`, [n1, n2], a * m1 > b * m2 ? 0 : 1, { explain: `${name(n1, '은/는')} ${a * m1}원, ${name(n2, '은/는')} ${b * m2}원을 저금하였다.`, facts: { choose: { exprs: [`${a}*${m1}`, `${b}*${m2}`], rule: 'max' } } });
    })
  ]);

  B.addTypes('4-1-1', 'compare', [
    T('cmp-how', '큰 수의 크기를 비교하는 방법', '①119', (d) => {
      const rows = d.shuffle([['자리 수가 다르면 자리 수가 많은 수가 더 크다.', true], ['자리 수가 다르면 맨 앞자리 숫자가 큰 수가 더 크다.', false], ['자리 수가 같으면 일의 자리 숫자부터 차례로 비교한다.', false], ['자리 수가 같으면 숫자 0이 적은 수가 더 크다.', false]]);
      return C('두 자연수의 크기를 비교하는 방법으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: '자리 수가 다르면 자리 수가 많은 수가 더 크다. 자리 수가 같으면 가장 높은 자리의 숫자부터 차례로 비교한다.', facts: truthOf(rows, true) });
    }),
    T('cmp-place', '비교할 자리 찾기', '①140', (d) => {
      const k = d.int(4, 6), n1 = toNum(uniq(d, 8)), x = digitAt(n1, k), y = d.until(() => d.int(1, 9), (v) => v !== x), n2 = Math.floor((n1 + (y - x) * pow(k)) / 1e4) * 1e4 + d.int(1001, 9999);
      const diff = (p) => `(${dx(n1, p)}-(${dx(n2, p)}))*(${dx(n1, p)}-(${dx(n2, p)}))+1`;
      return C(`${josa(n1, '과/와')} ${n2}의 크기를 비교하려고 한다. 가장 높은 자리부터 차례로 비교할 때, 숫자가 처음으로 다른 자리는?`, [7, 6, 5, 4].map((p) => PLACES[p] + '의 자리'), [7, 6, 5, 4].indexOf(k), {
        explain: `천만의 자리부터 차례로 비교하면 ${PLACES[k]}의 자리 숫자가 ${josa(x, '과/와')} ${josa(y, '으로/로')} 처음 다르다.`, facts: { choose: { exprs: [7, 6, 5, 4].map(diff), rule: 'equals', target: (x - y) * (x - y) + 1 }, unseen: [1e7, 1e6, 1e5, 1e4, 10, 1] }
      });
    }),
    T('cmp-diff', '자리 수가 다른 두 수의 비교', '①122·123 ②107 ③106', (d) => {
      // 자리 수가 적은 쪽의 맨 앞 숫자가 더 크다
      const a = d.int(10000000, 39999999), b = d.int(8000000, 9999999), [left, right] = d.bool() ? [a, b] : [b, a];
      return C('두 수의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, signOf(left, right), { figure: versus(left, right), explain: `${josa(a, '은/는')} 여덟 자리 수이고 ${josa(b, '은/는')} 일곱 자리 수이다. 자리 수가 많은 수가 더 크다.`, facts: { rule: 'tenman', big: { size: a }, choose: { exprs: [String(left), String(right)], rule: 'compare' } } });
    }),
    T('cmp-same', '자리 수가 같은 두 수의 비교', '①124·125 ②108 ③107', (d) => {
      const k = d.int(5, 8), a = d.int(100, 899) * 1e9 + d.int(100000000, 999999999), x = digitAt(a, k), y = d.until(() => d.int(0, 9), (v) => v !== x), b = Math.floor((a + (y - x) * pow(k)) / pow(k)) * pow(k) + d.int(0, pow(k) - 1), [left, right] = d.bool() ? [a, b] : [b, a];
      return C('두 수의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, signOf(left, right), { figure: versus(left, right), explain: `두 수 모두 열두 자리 수이다. 가장 높은 자리부터 차례로 비교하면 ${PLACES[k]}의 자리 숫자가 처음으로 다르다.`, facts: { rule: 'eok', big: { size: a }, choose: { exprs: [String(left), String(right)], rule: 'compare' } } });
    }),
    T('cmp-units', '억, 만으로 쓴 두 수의 비교', '①126·127 ②109 ③109', (d) => {
      const m1 = d.int(11, 98) * 100, m2 = d.until(() => d.int(11, 98) * 100, (v) => v !== m1), same = d.bool(), e = d.int(2, 9);
      const a = same ? big(0, e, m1) : big(0, 10 + d.int(0, 8), m1), b = same ? big(0, e, m2) : big(0, 9, m2), [left, right] = d.bool() ? [a, b] : [b, a];
      return C('두 수의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, signOf(left, right), { figure: versus(cut(left), cut(right)), explain: same ? '억의 수가 같으므로 만의 수를 비교한다.' : '억의 수가 큰 쪽이 더 크다. 억의 수는 맨 앞 숫자가 아니라 수 전체로 비교한다.', facts: { choose: { exprs: [String(left), String(right)], rule: 'compare' }, big: { shown: [[cut(left), left], [cut(right), right]] } } });
    }),
    T('cmp-mixed', '수로 쓴 수와 끊어 쓴 수의 비교', '①128 ②110', (d) => {
      const e = d.int(2, 9), x = d.int(1, 9), y = d.int(1, 9), b = big(0, e, x * 1000 + y * 100), a = big(0, e, x * 1000 + y * 10), flip = d.bool();
      return C('두 수의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, flip ? 0 : 2, { figure: flip ? versus(cut(b), a) : versus(a, cut(b)), explain: `${cut(b)}을 수로 쓰면 ${b}이다. ${a}보다 크다.`, facts: { choose: { exprs: flip ? [String(b), String(a)] : [String(a), String(b)], rule: 'compare' }, big: { shown: [[cut(b), b]] } } });
    }),
    T('cmp-han', '수로 쓴 수와 읽은 수의 비교', '①129·130', (d) => {
      const b = (d.int(2, 9) * 1000 + d.int(1, 9) * 100) * 1e4, a = d.pick([b, b * 10, b / 10]), flip = d.bool();
      return C('두 수의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, flip ? signOf(b, a) : signOf(a, b), { figure: flip ? versus(say(b), a) : versus(a, say(b)), explain: `${named(b, say(b), '을/를')} 수로 쓰면 ${b}이다.`, facts: { choose: { exprs: flip ? [String(b), String(a)] : [String(a), String(b)], rule: 'compare' }, big: { shown: [[say(b), b]] } } });
    }),
    T('cmp-max3', '세 수 중 가장 큰 수', '①131 ②111 ③112 심57', (d) => {
      const a = d.int(100000000, 399999999), b = a + d.int(1, 9) * 1e5, c = d.int(80000000, 99999999), list = d.shuffle([a, b, c]);
      return C('가장 큰 수는?', list.map(String), list.indexOf(b), { explain: `${josa(c, '은/는')} 여덟 자리 수이므로 가장 작다. 아홉 자리 수끼리는 가장 높은 자리부터 차례로 비교한다.`, facts: { choose: { exprs: list.map(String), rule: 'max' } } });
    }),
    T('cmp-min-mixed', '적는 방법이 섞인 세 수 중 가장 작은 수', '①132 ③111·116', (d) => {
      const e = d.int(2, 8), vals = d.shuffle([big(0, e, d.int(11, 49) * 100), big(0, e, d.int(51, 98) * 100), big(0, e + 1, d.int(11, 98) * 100)]), shown = [String(vals[0]), cut(vals[1]), say(vals[2])];
      return C('가장 작은 수는?', shown, vals.indexOf(Math.min(...vals)), { explain: `수로 쓰면 차례로 ${vals.join(', ')}이다.`, facts: { choose: { exprs: vals.map(String), rule: 'min' }, big: { shown: [[shown[1], vals[1]], [shown[2], vals[2]]] } } });
    }),
    T('cmp-order', '세 수의 차례', '①133 ②112 심58', (d) => {
      const top = d.int(10, 89), vals = d.until(() => [0, 1, 2].map(() => top * 1e8 + d.int(10000000, 99999999)), (v) => new Set(v.map((x) => Math.floor(x / 1e6))).size === 3);
      const right = [0, 1, 2].sort((p, q) => vals[q] - vals[p]), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('큰 수부터 차례로 기호를 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), { figure: tagged(vals.map(String)), explain: '세 수 모두 열 자리 수이다. 가장 높은 자리부터 차례로 비교한다.', facts: { choose: { exprs: vals.map(String), rule: 'descending', orders: list } } });
    }),
    T('cmp-order-mixed', '적는 방법이 섞인 세 수의 차례', '①134 ③113·115', (d) => {
      const e = d.int(2, 8), vals = d.shuffle([big(0, e, d.int(11, 49) * 100), big(0, e, d.int(51, 98) * 100), big(0, e + 1, d.int(11, 98) * 100)]), shown = [String(vals[0]), cut(vals[1]), say(vals[2])];
      const right = [0, 1, 2].sort((p, q) => vals[p] - vals[q]), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('작은 수부터 차례로 기호를 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), { figure: tagged(shown), explain: `수로 쓰면 차례로 ${vals.join(', ')}이다.`, facts: { choose: { exprs: vals.map(String), rule: 'ascending', orders: list }, big: { shown: [[shown[1], vals[1]], [shown[2], vals[2]]] } } });
    }),
    T('cmp-bundles', '묶음 수로 말한 두 수의 비교', '①135 ②116', (d) => {
      // 묶음의 수가 큰 쪽이 더 큰 수라고 여기는 아이가 있다
      const a = d.int(21, 89), b = a * 10 + (d.bool() ? 1 : -1) * d.int(11, 99);
      return C('더 큰 수는?', LABELS.slice(0, 2), a * 10 > b ? 0 : 1, { figure: tagged([`100만이 ${a}개인 수`, `10만이 ${b}개인 수`]), explain: `㉠은 ${cut(a * 1e6)}, ㉡은 ${cut(b * 1e5)}이다.`, facts: { choose: { exprs: [`1000000*${a}`, `100000*${b}`], rule: 'max' }, unseen: [1e6, 1e5] } });
    }),
    T('cmp-buy', '가진 돈으로 살 수 있는 물건', '①136', (d) => {
      const budget = d.int(32, 58) * 10000, things = d.shuffle(['가방', '운동화', '시계', '인형']), prices = d.shuffle([budget - d.int(1, 9) * 1000, budget + d.int(1, 9) * 1000, budget + d.int(1, 9) * 10000, budget + d.int(11, 19) * 10000]);
      return C(`${budget}원으로 살 수 있는 물건은?`, prices.map((p, i) => `${things[i]} ${p}원`), prices.findIndex((p) => p < budget), { explain: `${budget}보다 작은 수는 ${prices.find((p) => p < budget)}뿐이다.`, facts: { choose: { exprs: prices.map(String), rule: 'onlyBelow', target: budget } } });
    }),
    T('cmp-box-count', '□에 들어갈 수 있는 숫자의 수', '①137 ②117 ③117 심62', (d) => {
      const a = d.int(1, 9), v = d.int(3, 7), low = d.int(10000, 49999), right = Number(`${a}${v}${d.int(50000, 99999)}`), filled = Number(`${a}${v}${low}`);
      return N('0부터 9까지의 숫자 중에서 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', 9 - v, {
        unit: '개', figure: quote(`${a}${box()}${low} &gt; ${right}`), explain: `두 수 모두 일곱 자리 수이고 백만의 자리 숫자가 같다. □ 안에 ${josa(v, '을/를')} 넣으면 ${josa(filled, '은/는')} ${right}보다 작으므로 □ 안에는 ${v}보다 큰 숫자만 들어갈 수 있다.`,
        facts: { big: { boxed: { left: `${a}□${low}`, right: String(right), op: '>', ask: 'count' } } }
      });
    }),
    T('cmp-box-max', '□에 들어갈 수 있는 가장 큰 숫자', '①138·139 ③118', (d) => {
      // □ 다음 자리까지 비교해야 한다: □에 같은 숫자를 넣어도 뒤가 작으면 된다
      const p = d.int(11, 89), v = d.int(2, 8), low = d.int(10000000, 49999999), right = Number(`${p}${v}${d.int(50000000, 99999999)}`), filled = Number(`${p}${v}${low}`);
      return N('0부터 9까지의 숫자 중에서 □ 안에 들어갈 수 있는 가장 큰 숫자는?', v, {
        figure: quote(`${p}${box()}${low} &lt; ${right}`), explain: `□ 안에 ${josa(v, '을/를')} 넣으면 ${josa(filled, '은/는')} ${right}보다 작다. ${josa(v + 1, '을/를')} 넣으면 더 커지므로 가장 큰 숫자는 ${v}이다.`,
        facts: { big: { boxed: { left: `${p}□${low}`, right: String(right), op: '<', ask: 'max' } } }
      });
    }),
    T('cmp-true', '바르게 비교한 것 고르기', '심59', (d) => {
      const a = d.int(1000000, 9999999), x = d.int(9000000, 9999999), y = d.int(10000000, 19999999), u = d.int(500000000, 899999999), s = d.int(100000000, 399999999);
      const rows = d.shuffle([[a, '&gt;', a * 10 + d.int(0, 9)], [x, '&lt;', y], [u, '&lt;', u - d.int(1, 9) * 1e4], [s, '&gt;', s + d.int(1, 9) * 1e6]]).map(([l, sign, r]) => [`${l} ${sign} ${r}`, sign === '&gt;' ? l > r : l < r]);
      return C('두 수의 크기를 바르게 비교한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: `${josa(x, '은/는')} 일곱 자리 수, ${josa(y, '은/는')} 여덟 자리 수이므로 ${x} &lt; ${y}이다.`, facts: truthOf(rows, true) });
    }),
    T('cmp-data-second', '자료에서 두 번째로 큰 것', '②114 ③114', (d) => {
      const names = ['가 도시', '나 도시', '다 도시', '라 도시'], vals = d.until(() => names.map(() => d.int(95, 1400) * 10000 + d.int(1000, 9999)), (v) => new Set(v).size === 4), sorted = vals.slice().sort((p, q) => q - p);
      return C('인구가 두 번째로 많은 도시는?', names, vals.indexOf(sorted[1]), { figure: table(['도시', '인구(명)'], names.map((n, i) => [n, vals[i]])), explain: `인구가 많은 도시부터 차례로 쓰면 ${sorted.map((v) => names[vals.indexOf(v)]).join(', ')}이다.`, facts: { rank: { values: vals, nth: 2 } } });
    }),
    T('cmp-data-above', '기준보다 큰 것의 수', '②113 심60', (d) => {
      const names = ['1월', '2월', '3월', '4월', '5월'], target = d.int(31, 68) * 1e5;
      const vals = d.until(() => names.map(() => d.int(250, 750) * 10000 + d.int(1, 9) * 1000), (v) => { const n = v.filter((x) => x > target).length; return n >= 1 && n <= 4; });
      return N(`어느 놀이공원의 달마다 입장객 수이다. 입장객이 ${cut(target)} 명보다 많은 달은 모두 몇 달인가?`, vals.filter((v) => v > target).length, {
        unit: '달', figure: table(['달', '입장객 수(명)'], names.map((n, i) => [n, vals[i]])), explain: `${cut(target)}은 ${target}이다. ${target}보다 큰 수는 ${vals.filter((v) => v > target).join(', ')}이다.`, facts: { big: { countIf: { values: vals, test: 'above', target, i: 0 }, shown: [[cut(target), target]] } }
      });
    })
  ]);

  B.addTypes('4-1-1', 'make', [
    T('make-max', '수 카드로 가장 큰 수 만들기', '①141 ②119 ③121 심65', (d) => {
      const digits = uniq(d, 5), answer = toNum(digits.slice().sort((p, q) => q - p));
      return N('수 카드를 한 번씩 모두 사용하여 가장 큰 다섯 자리 수를 만들면?', answer, { figure: cards(digits), explain: '가장 높은 자리부터 큰 수를 차례로 놓는다.', facts: { big: { cardsMake: { digits, rule: 'max' } } } });
    }),
    T('make-min-zero', '0이 있는 수 카드로 가장 작은 수 만들기', '①142 ③123·124', (d) => {
      const digits = d.shuffle([0].concat(uniq(d, 5))), sorted = digits.slice().sort((p, q) => p - q), answer = toNum([sorted[1], 0].concat(sorted.slice(2)));
      return N('수 카드를 한 번씩 모두 사용하여 가장 작은 여섯 자리 수를 만들면?', answer, { figure: cards(digits), explain: `가장 높은 자리에는 0을 놓을 수 없다. 0이 아닌 가장 작은 수 ${josa(sorted[1], '을/를')} 맨 앞에 놓고, 나머지를 작은 수부터 차례로 놓는다.`, facts: { big: { cardsMake: { digits, rule: 'min' } } } });
    }),
    T('make-fixed-max', '자리가 정해진 가장 큰 수', '①143 ②122 심66', (d) => {
      const digits = uniq(d, 6), k = d.int(1, 4), t = d.pick(digits), rest = digits.filter((v) => v !== t).sort((p, q) => q - p), made = rest.slice(0, 5 - k).concat([t], rest.slice(5 - k));
      return N(`수 카드를 한 번씩 모두 사용하여 ${PLACES[k]}의 자리 숫자가 ${t}인 가장 큰 여섯 자리 수를 만들면?`, toNum(made), { figure: cards(digits), explain: `${PLACES[k]}의 자리에 ${josa(t, '을/를')} 놓고, 남은 자리에 가장 높은 자리부터 큰 수를 차례로 놓는다.`, facts: { big: { cardsMake: { digits, rule: 'max', fixed: [[pow(k), t]] } } } });
    }),
    T('make-fixed-min', '자리가 정해진 가장 작은 수(0 포함)', '①144·145 덧문서', (d) => {
      const digits = d.shuffle([0].concat(uniq(d, 6))), k = d.int(2, 5), t = d.pick(digits.filter((v) => v !== 0)), rest = digits.filter((v) => v !== t).sort((p, q) => p - q), order = [rest[1], 0].concat(rest.slice(2)), made = order.slice(0, 6 - k).concat([t], order.slice(6 - k));
      return N(`수 카드를 한 번씩 모두 사용하여 ${PLACES[k]}의 자리 숫자가 ${t}인 가장 작은 일곱 자리 수를 만들면?`, toNum(made), { figure: cards(digits), explain: `${PLACES[k]}의 자리에 ${josa(t, '을/를')} 놓는다. 가장 높은 자리에는 0을 놓을 수 없으므로 0이 아닌 가장 작은 수를 맨 앞에 놓고, 나머지를 작은 수부터 차례로 놓는다.`, facts: { big: { cardsMake: { digits, rule: 'min', fixed: [[pow(k), t]] } } } });
    }),
    T('make-second', '두 번째로 큰 수', '③122 심67', (d) => {
      const digits = uniq(d, 5), sorted = digits.slice().sort((p, q) => q - p), answer = toNum([sorted[0], sorted[1], sorted[2], sorted[4], sorted[3]]);
      return N('수 카드를 한 번씩 모두 사용하여 만들 수 있는 다섯 자리 수 중에서 두 번째로 큰 수는?', answer, { figure: cards(digits), explain: `가장 큰 수는 ${toNum(sorted)}이다. 두 번째로 큰 수는 가장 큰 수에서 십의 자리 숫자와 일의 자리 숫자를 바꾼 수이다.`, facts: { big: { cardsMake: { digits, rule: 'secondMax' } } } });
    }),
    T('make-twice', '수 카드를 두 번씩 써서 만든 수', '①146 ②121 심70 덧문서', (d) => {
      const digits = d.shuffle([0].concat(uniq(d, 3))), desc = digits.slice().sort((p, q) => q - p), most = d.bool();
      const asc = desc.slice().reverse(), answer = most ? toNum(desc.flatMap((v) => [v, v])) : toNum([asc[1], 0, 0, asc[1]].concat(asc.slice(2).flatMap((v) => [v, v])));
      return N(`수 카드를 두 번씩 모두 사용하여 가장 ${most ? '큰' : '작은'} 여덟 자리 수를 만들면?`, answer, { figure: cards(digits), explain: most ? '가장 높은 자리부터 큰 수를 두 번씩 차례로 놓는다.' : `가장 높은 자리에는 0을 놓을 수 없다. 0이 아닌 가장 작은 수 ${josa(asc[1], '을/를')} 맨 앞에 한 번 놓고, 0을 두 번 놓은 다음 나머지를 작은 수부터 놓는다.`, facts: { big: { cardsMake: { digits, rule: most ? 'max' : 'min', twice: true } } } });
    })
  ]);

  B.addGroup('4-1-1', {
    id: 'hard', title: '단원 종합', standard: NUM,
    types: [
      H('h-missing-count', '10개가 넘는 묶음이 낀 수에서 빠진 묶음의 수', '9, 기본 ②15', (d) => {
        // 수의 천의 자리 숫자를 그대로 답하는 아이(100이 10개를 넘어 천의 자리가 하나 올라간 것을 놓친다)
        const a = d.int(2, 8), x = d.int(2, 7), b = d.int(11, 19), c = d.int(1, 9), n = a * 10000 + x * 1000 + b * 100 + c * 10, list = d.shuffle([x, x + 1, x - 1, x + 2]);
        return C(`10000이 ${a}개, 1000이 □개, 100이 ${b}개, 10이 ${c}개인 수는 ${n}이다. □ 안에 알맞은 수는?`, list.map(String), list.indexOf(x), {
          explain: `100이 ${b}개이면 ${b * 100}이다. ${n} - ${a * 10000} - ${b * 100} - ${c * 10} = ${x * 1000}이므로 1000은 ${x}개이다.`, facts: { pick: { expr: `(${n}-10000*${a}-100*${b}-10*${c})/1000`, options: list } }
        });
      }),
      H('h-times-digit', '몇 배 한 수의 자리 숫자', '36, 덧문서', (d) => {
        const ds = uniq(d, 5), base = big(0, ds[0], toNum(ds.slice(1))), mult = d.pick([10, 100, 1000]), result = base * mult, k = String(result).length - 1 - d.int(0, 3);
        return N(`${named(base, cut(base), '을/를')} ${mult}배 한 수에서 ${PLACES[k]}의 자리 숫자는?`, digitAt(result, k), {
          explain: `${cut(base)}의 ${mult}배는 ${cut(result)}이다. ${PLACES[k]}의 자리 숫자는 ${digitAt(result, k)}이다.`, facts: { calc: [[`(((${base}*${mult})-(${base}*${mult})%${pow(k)})/${pow(k)})%10`, 0]], unseen: [pow(k), 10], big: { shown: [[cut(base), base]] } }
        });
      }),
      H('h-box-both', '□가 든 두 수의 크기 비교', '63, 기본 ②118 덧문서', (d) => {
        // □를 모르니 비교할 수 없다고 여기는 아이가 셋째 보기를 고른다. □보다 높은 자리에서 이미 크기가 갈린다.
        const p = d.int(11, 89), a = d.int(1, 9), b = d.until(() => d.int(1, 9), (v) => v !== a), left = `${p}${a}□${d.int(1000, 9999)}`, right = `${p}${b}□${d.int(1000, 9999)}`;
        return C('□ 안에는 0부터 9까지 어느 숫자나 들어갈 수 있다. 두 수 ㉠, ㉡의 크기를 바르게 비교한 것은?', ['㉠이 더 크다.', '㉡이 더 크다.', '□ 안의 숫자에 따라 다르다.'], a > b ? 0 : 1, {
          figure: tagged([left, right].map((text) => text.replace('□', box()))), explain: `두 수 모두 여덟 자리 수이다. 가장 높은 자리부터 차례로 비교하면 십만의 자리 숫자가 ${josa(a, '과/와')} ${josa(b, '으로/로')} 다르다. □ 안에 어떤 숫자가 들어가도 ${a > b ? '㉠' : '㉡'}이 더 크다.`,
          facts: { big: { boxedPair: { left, right, signs: ['>', '<', '?'] } } }
        });
      }),
      H('h-month', '처음으로 목표 금액이 되는 달', '53', (d) => {
        // 저금한 횟수만큼 달을 더하는 아이(한 달 뒤로 밀린다), 횟수를 그대로 답하는 아이
        const s = d.int(3, 5), per = d.pick([10, 20, 25]), t = d.int(4, 6), list = d.shuffle([s + t - 1, s + t, t, s + t - 2]);
        return C(`${s}월부터 매달 ${per}만 원씩 저금한다. 저금한 돈이 처음으로 ${per * t}만 원이 되는 달은?`, list.map((v) => v + '월'), list.indexOf(s + t - 1), {
          explain: `${per}만씩 뛰어 세면 ${t}번째에 ${per * t}만이 된다. ${s}월에 첫 번째로 저금하므로 ${t}번째로 저금하는 달은 ${s + t - 1}월이다.`, facts: { pick: { expr: `${s}+${per * t}/${per}-1`, options: list }, unseen: [1] }
        });
      }),
      H('h-buy-count', '가진 돈으로 살 수 있는 개수', '55', (d) => {
        const price = d.pick([40000, 60000, 70000, 80000, 90000]), count = d.int(3, 6), money = price * count + d.int(1, price / 10000 - 1) * 10000;
        return N(`${money}원으로 한 개에 ${price}원인 물건을 몇 개까지 살 수 있는가?`, count, {
          unit: '개', explain: `${price}씩 뛰어 세면 ${Array.from({ length: count + 1 }, (_, i) => price * (i + 1)).join(', ')}이다. ${josa(price * (count + 1), '은/는')} ${money}보다 크므로 ${count}개까지 살 수 있다.`, facts: { calc: [[`(${money}-${money}%${price})/${price}`, 0]] }
        });
      }),
      H('h-below-make', '기준보다 작은 수 중에서 가장 큰 수 만들기', '69, 기본 ②123 ③126', (d) => {
        const digits = uniq(d, 5), sorted = digits.slice().sort((p, q) => p - q), t = d.pick(sorted.slice(1)), lead = Math.max(...sorted.filter((v) => v < t)), answer = toNum([lead].concat(sorted.filter((v) => v !== lead).reverse()));
        return N(`수 카드를 한 번씩 모두 사용하여 만들 수 있는 다섯 자리 수 중에서 ${t * 10000}보다 작은 수 중 가장 큰 수는?`, answer, {
          figure: cards(digits), explain: `만의 자리에 ${josa(t, '을/를')} 놓으면 ${t * 10000}보다 커진다. 만의 자리에 ${t}보다 작은 수 중에서 가장 큰 ${josa(lead, '을/를')} 놓고, 나머지를 큰 수부터 차례로 놓는다.`,
          facts: { big: { cardsMake: { digits, rule: 'maxBelow', target: t * 10000 } } }
        });
      }),
      H('h-zeros-most', '수로 쓸 때 0의 개수 비교', '24, 기본 ③46', (d) => {
        const make = () => d.shuffle([big(0, d.int(2, 9) * 100, 0, d.int(1, 9) * 10), big(0, d.int(1, 9) * 1000 + d.int(1, 9) * 100, d.int(1, 9) * 1000), big(d.int(2, 9), d.int(1, 9) * 100 + d.int(1, 9) * 10, 0)]);
        const vals = d.until(make, (v) => { const z = v.map(zerosIn); return z.filter((x) => x === Math.max(...z)).length === 1; }), zeros = vals.map(zerosIn);
        return C('수로 쓸 때 0의 개수가 가장 많은 것은?', vals.map(say), zeros.indexOf(Math.max(...zeros)), { explain: `수로 쓰면 차례로 ${vals.join(', ')}이다. 0은 차례로 ${zeros.join('개, ')}개이다.`, facts: { big: { zerosMost: true } } });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
