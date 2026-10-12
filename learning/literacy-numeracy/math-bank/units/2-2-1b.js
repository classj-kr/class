// 2학년 2학기 1단원 네 자리 수 — 뛰어 세기, 수의 크기 비교, 수 카드로 수 만들기의 기본 문항과 실력 문항.
// 단원 틀·그림 도구·싣는 기준·뺀 꼴은 2-2-1a.js 머리에 적었다. 꼴 번호: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//   ㉮ 1000을 만드는 짝(900과 100, 990과 10, 999와 1)을 엇갈리게 기억한다(「900보다 10만큼 더 큰 수」를 1000이라고 한다).
//   ㉯ 열 개가 모이면 윗자리 하나가 된다는 것을 그림이나 돈에서는 떠올리지 못한다(10원짜리 동전 10개를 100원으로 바꾸어 세지 않는다).
//   ㉰ 한 자리의 묶음이 10개를 넘어도 개수를 그대로 이어 쓰거나(1000이 2개, 100이 13개 → 2130), 「100이 7개」만 보고 백의 자리 숫자를 7이라고 한다.
//   ㉱ 0이 낀 수에서 자리를 당겨 읽는다(3007과 3070, 「삼천칠」과 「삼천칠십」). 읽는 말의 차례가 곧 자리라고 여긴다.
//   ㉲ 자리의 숫자와 그 숫자가 나타내는 값을 가리지 못한다(숫자가 크면 값도 크다고 여긴다. 「백의 자리 숫자가 4인 수」와 「4가 40을 나타내는 수」를 같은 것으로 센다).
//   ㉳ 뛰어 셀 때 9 다음에 윗자리가 함께 바뀌는 것을 놓친다(2964 다음을 2064라고 쓰고, 천의 자리가 바뀐 줄을 1000씩 뛰어 센 것이라고 한다).
//   ㉴ 크기를 비교할 때 높은 자리부터 보지 않는다. □ 안의 수가 견주는 숫자와 같을 때 아랫자리를 보지 않고 넣거나 뺀다.
//   ㉵ 0이 있는 수 카드로 가장 작은 수를 만들 때 0을 맨 앞에 놓는다.
//   ㉶ 「3월부터 6월까지」를 세 번으로 센다(처음 달을 빼먹는다).
// 실력 문항은 이 오개념에 걸리는 장치를 둔 것(①)과 두 번 넘게 생각해야 하는 것(②)만 실었다. 이 학년은 실력 문항이 적어도 된다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, tagged, numbers, table, cards, josa, name, say, N, M, C } = B.kit, G = B.kit.geo;
  const { PLACES, UNITS, pow, digitAt, dx, vx, toNum, uniq, withDigit, quoted, after, digits4, bundles, expanded, bundleExpr, formExpr, claimOf, model, money, hops, under, versus, both } = B.kit.g221;
  const NUM = '2수01-02', ORDER = '2수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SIGNS = ['&gt;', '=', '&lt;'], TAGS = ['가', '나'], PLACE_OPTIONS = ['천의 자리', '백의 자리', '십의 자리', '일의 자리'];
  const signOf = (left, right) => (left > right ? 0 : left === right ? 1 : 2);
  const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  // 빈칸과 그 뒤의 말이 줄 끝에서 갈라지지 않게 묶는다
  const keep = (html) => `<span style="white-space:nowrap">${html}</span>`;
  // 검사가 따로 셈하는 식: 두 식의 값이 같으면 1, 다르면 0
  const same = (expr, target) => `0**(((${expr})-${target})*((${expr})-${target}))`;
  // 서로 다른 수들 가운데 가장 큰 수(식에는 그 수들과 0, 1만 쓴다): 다른 모든 수보다 크거나 같은 수만 남는다
  const maxExpr = (vals) => vals.map((v, i) => `${v}*` + vals.filter((_, j) => j !== i).map((w) => `(1-0**((${v}-${v}%${w})/${w}))`).join('*')).join('+');
  // 네 자리 수: 숫자 넷이 서로 다르고 10^k 자리 숫자가 lo~hi 인 수
  const spread = (d, k, lo, hi) => d.until(() => toNum(uniq(d, 4)), (v) => digitAt(v, k) >= lo && digitAt(v, k) <= hi);
  const modelExpr = (ds) => ds.map((v, k) => (v ? (k < 3 ? `${UNITS[k]}*${v}` : String(v)) : '')).filter(Boolean).join('+');
  // 수 카드 넷으로 만들 수 있는 네 자리 수를 모두 만든다(맨 앞에 0은 오지 못한다)
  function arrange(digits) {
    const out = [];
    for (let i = 0; i < 4; i += 1) for (let j = 0; j < 4; j += 1) for (let k = 0; k < 4; k += 1) for (let l = 0; l < 4; l += 1) {
      if (new Set([i, j, k, l]).size === 4 && digits[i] !== 0) out.push(digits[i] * 1000 + digits[j] * 100 + digits[k] * 10 + digits[l]);
    }
    return out.sort((x, y) => x - y);
  }

  B.addTypes('2-2-1', 'skip', [
    T('sk-fill', '뛰어 세기의 빈칸', '①42·43·44·45 심29', (d, i) => {
      // 차례: 1000씩 / 100씩 / 10씩(백의 자리가 바뀌는 곳을 지난다) / 1씩(십의 자리가 바뀌는 곳을 지난다)
      const step = [1000, 100, 10, 1][i], a = d.int(1, 8), top = d.int(6, 8);
      const start = i === 0 ? d.int(1, 5) * 1000 + d.int(1, 9) * 100 + d.int(11, 99) : i === 1 ? a * 1000 + d.int(1, 5) * 100 + d.int(11, 99) : i === 2 ? a * 1000 + d.int(1, 8) * 100 + top * 10 + d.int(1, 9) : a * 1000 + d.int(1, 9) * 100 + d.int(1, 8) * 10 + top;
      const at = (k) => start + step * k, [p, q] = i < 2 ? [2, 4] : [9 - top, 10 - top];
      return M(`${step}씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, both(at(p), at(q)), {
        figure: hops([0, 1, 2, 3, 4].map((k) => (k === p ? LABELS[0] : k === q ? LABELS[1] : at(k)))),
        explain: i < 2 ? `${step}씩 뛰어 세면 ${PLACES[3 - i]}의 자리 숫자가 1씩 커진다. ㉠은 ${at(p)}, ㉡은 ${at(q)}이다.` : `㉠은 ${at(p - 1)}보다 ${step}만큼 더 큰 ${at(p)}이다. ${at(p)}에서 ${step}만큼 뛰어 세면 ${PLACES[4 - i]}의 자리 숫자가 바뀌어 ㉡은 ${at(q)}이다.`,
        facts: { rule: ['by1000', 'by100', 'by10', 'by1'][i], calc: i < 2 ? [[`${at(1)}+${step}`, 0], [`${at(3)}+${step}`, 1]] : [[`${at(p - 1)}+${step}`, 0], [`${at(p - 1)}+${step}+${step}`, 1]] }
      });
    }, { count: 4 }),
    T('sk-cross', '천의 자리가 바뀌는 100씩 뛰어 세기', '①43 심29', (d) => {
      const a = d.int(1, 8), s = a * 1000 + 700;
      return N('100씩 뛰어 세었다. □ 안에 알맞은 수는?', (a + 1) * 1000, {
        figure: hops([s, s + 100, s + 200, '', s + 400]), explain: `${s + 200}에서 100만큼 뛰어 세면 100이 10개가 되어 천의 자리 숫자가 1 커진다. ${(a + 1) * 1000}이다.`, facts: { calc: [[`${s + 200}+100`, 0]] }
      });
    }),
    T('sk-back', '거꾸로 뛰어 세기의 빈칸', '①46 심30', (d, i) => {
      // 차례: 100씩 거꾸로(백의 자리 숫자가 0이 되는 곳까지) / 1씩·10씩 거꾸로(윗자리가 바뀌는 곳을 지난다)
      const a = d.int(1, 9), step = i === 0 ? 100 : d.pick([1, 10]);
      const start = i === 0 ? a * 1000 + 400 + d.int(11, 99) : step === 1 ? a * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10 + 2 : a * 1000 + d.int(1, 9) * 100 + 20 + d.int(1, 9);
      const at = (k) => start - step * k, [p, q] = i === 0 ? [2, 4] : [2, 3];
      return M(`${start}부터 ${step}씩 거꾸로 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, both(at(p), at(q)), {
        figure: hops([0, 1, 2, 3, 4].map((k) => (k === p ? LABELS[0] : k === q ? LABELS[1] : at(k)))),
        explain: i === 0 ? `100씩 거꾸로 뛰어 세면 백의 자리 숫자가 1씩 작아진다. ㉠은 ${at(2)}, ㉡은 백의 자리 숫자가 0인 ${at(4)}이다.` : `㉠은 ${at(1)}보다 ${step}만큼 더 작은 ${at(2)}이다. ${at(2)}에서 ${step}만큼 거꾸로 뛰어 세면 ${PLACES[step === 1 ? 1 : 2]}의 자리 숫자가 바뀌어 ㉡은 ${at(3)}이다.`,
        facts: { rule: ['backHundreds', 'backCross'][i], calc: i === 0 ? [[`${at(1)}-${step}`, 0], [`${at(3)}-${step}`, 1]] : [[`${at(1)}-${step}`, 0], [`${at(1)}-${step}-${step}`, 1]] }
      });
    }, { count: 2 }),
    T('sk-rule', '규칙을 찾아 뛰어 세기', '①44·46 심29', (d, i) => {
      // 차례: 커지는 줄(윗자리가 바뀌는 곳을 지난다) / 작아지는 줄(윗자리가 바뀌는 곳을 지난다). 몇씩 뛰어 세었는지는 알려 주지 않는다.
      const step = d.pick([10, 100]), k = step === 10 ? 1 : 2;
      if (i === 0) {
        const s = step === 10 ? d.int(1, 9) * 1000 + d.int(1, 8) * 100 + 80 + d.int(1, 9) : d.int(1, 8) * 1000 + 800 + d.int(11, 99), at = (j) => s + step * j;
        return M('규칙을 찾아 ㉠, ㉡에 알맞은 수를 구하시오.', both(at(2), at(3)), {
          figure: hops([at(0), at(1), LABELS[0], LABELS[1], at(4)]), explain: `${PLACES[k]}의 자리 숫자가 1씩 커지므로 ${step}씩 뛰어 세었다. ${at(1)}에서 ${step}만큼 뛰어 세면 ${PLACES[k + 1]}의 자리 숫자가 바뀌어 ㉠은 ${at(2)}이다. ㉡은 ${at(3)}이다.`,
          facts: { rule: 'up', calc: [[`${at(1)}+(${at(1)}-${at(0)})`, 0], [`${at(4)}-(${at(1)}-${at(0)})`, 1]] }
        });
      }
      const s = step === 10 ? d.int(1, 9) * 1000 + d.int(1, 9) * 100 + 30 + d.int(1, 9) : d.int(2, 9) * 1000 + 300 + d.int(11, 99), at = (j) => s - step * j;
      return M('규칙을 찾아 ㉠, ㉡에 알맞은 수를 구하시오.', both(at(3), at(5)), {
        figure: hops([at(0), at(1), at(2), LABELS[0], at(4), LABELS[1]]), explain: `${PLACES[k]}의 자리 숫자가 1씩 작아지므로 ${step}씩 거꾸로 뛰어 세었다. ㉠은 ${at(2)}보다 ${step}만큼 더 작은 ${at(3)}, ㉡은 ${at(4)}보다 ${step}만큼 더 작은 ${at(5)}이다.`,
        facts: { rule: 'down', calc: [[`${at(2)}-(${at(0)}-${at(1)})`, 0], [`${at(4)}-(${at(0)}-${at(1)})`, 1]] }
      });
    }, { count: 2 }),
    T('sk-step', '몇씩 뛰어 세었는지', '①47', (d) => {
      const k = d.int(0, 3), step = pow(k), n = spread(d, k, 1, 6), list = [0, 1, 2, 3].map((j) => n + step * j);
      return N('몇씩 뛰어 세었는가?', step, { figure: hops(list), explain: `${PLACES[k]}의 자리 숫자가 1씩 커진다. ${step}씩 뛰어 세었다.`, facts: { rule: 'plain', calc: [[`${list[1]}-${list[0]}`, 0]] } });
    }),
    T('sk-place', '1씩 커지는 자리', '①47', (d) => {
      const k = d.int(0, 3), step = pow(k), n = spread(d, k, 1, 6), list = [0, 1, 2, 3].map((j) => n + step * j);
      return C('수가 다음과 같이 커질 때, 어느 자리 숫자가 1씩 커지는가?', PLACE_OPTIONS, 3 - k, {
        figure: hops(list), explain: `${PLACES[k]}의 자리 숫자가 1씩 커진다. ${step}씩 뛰어 세었다.`, facts: { choose: { exprs: [3, 2, 1, 0].map((p) => `(${list[1]}-${list[0]})/${pow(p)}`), rule: 'equals', target: 1 }, unseen: [1000, 100, 10, 1] }
      });
    }),
    T('sk-like', '보기와 같은 규칙으로 뛰어 세기', '①48', (d) => {
      const [step, sign] = d.pick([[100, -1], [10, -1], [1000, 1], [100, 1]]), k = String(step).length - 1, from = () => (sign > 0 ? spread(d, k, 1, 6) : spread(d, k, 3, 9));
      const ex = from(), s = d.until(from, (v) => v !== ex), row = [0, 1, 2].map((j) => ex + sign * step * j), diff = sign > 0 ? `(${row[1]}-${row[0]})` : `(${row[0]}-${row[1]})`, op = sign > 0 ? '+' : '-', back = sign > 0 ? '' : '거꾸로 ';
      return M('보기와 같은 규칙으로 뛰어 세었다. ㉠, ㉡에 알맞은 수는?', both(s + sign * step, s + sign * 2 * step), {
        figure: lines([`<span class="mb-tag mb-tag-short">보기</span> ${row.join(' → ')}`, `<span class="mb-tag mb-tag-short"></span> ${[s, box(LABELS[0]), box(LABELS[1])].join(' → ')}`]),
        explain: `보기는 ${step}씩 ${back}뛰어 세었다. ${s}에서 ${step}씩 ${back}뛰어 세면 ${s + sign * step}, ${s + sign * 2 * step}이다.`,
        facts: { calc: [[`${s}${op}${diff}`, 0], [`${s}${op}${diff}${op}${diff}`, 1]] }
      });
    }),
    T('sk-far', '뛰어 센 줄의 끝 수', '①49', (d) => {
      // 100씩 뛰어 세다 천의 자리가 바뀐다
      const s = d.int(1, 8) * 1000 + d.int(7, 9) * 100 + d.int(11, 99);
      return N(`${s}부터 100씩 뛰어 세었다. ㉠에 알맞은 수는?`, s + 300, {
        figure: hops([s, '', '', LABELS[0]]), explain: `㉠은 ${s}에서 100씩 3번 뛰어 센 수이다. ${s + 100}, ${s + 200}, ${s + 300}이므로 ${s + 300}이다.`, facts: { calc: [[`${s}+100*3`, 0]], unseen: [3] }
      });
    }),
    T('sk-times', '몇 번 뛰어 센 수', '①50', (d) => {
      // 10씩 뛰어 셀 때는 백의 자리가 바뀌는 곳을 지난다
      const step = d.pick([1000, 100, 10]), n = d.int(3, 5), a = d.int(1, 8);
      const start = step === 1000 ? d.int(1, 9 - n) * 1000 + d.int(1, 9) * 100 + d.int(11, 99) : step === 100 ? a * 1000 + d.int(1, 9 - n) * 100 + d.int(11, 99) : a * 1000 + d.int(1, 8) * 100 + d.int(7, 9) * 10 + d.int(1, 9);
      return N(`${start}에서 ${step}씩 ${n}번 뛰어 센 수는?`, start + step * n, { explain: `${step}씩 ${n}번 뛰어 세면 ${range(1, n).map((j) => start + step * j).join(', ')}이다.`, facts: { calc: [[`${start}+${step}*${n}`, 0]] } });
    }),
    T('sk-times-back', '거꾸로 몇 번 뛰어 센 수', '①51 심33', (d) => {
      const step = d.pick([1000, 100]), n = d.int(3, 5);
      const start = step === 1000 ? d.int(n + 1, 9) * 1000 + d.int(1, 9) * 100 + d.int(11, 99) : d.int(1, 9) * 1000 + d.int(n, 9) * 100 + d.int(11, 99);
      return N(`${start}에서 ${step}씩 거꾸로 ${n}번 뛰어 센 수는?`, start - step * n, { explain: `${step}씩 거꾸로 ${n}번 뛰어 세면 ${range(1, n).map((j) => start - step * j).join(', ')}이다.`, facts: { calc: [[`${start}-${step}*${n}`, 0]] } });
    }),
    T('sk-count', '몇 번 뛰어 세었는지', '①53', (d) => {
      const k = d.int(0, 3), step = pow(k), n = d.int(3, 6), start = spread(d, k, 1, 9 - n), end = start + step * n;
      return N(`${start}에서 ${step}씩 뛰어 세었더니 ${josa(end, '이/가')} 되었다. 몇 번 뛰어 세었는가?`, n, {
        unit: '번', explain: `${PLACES[k]}의 자리 숫자가 ${digitAt(start, k)}에서 ${josa(digitAt(end, k), '으로/로')} ${n}만큼 커졌다. ${step}씩 ${n}번 뛰어 세었다.`, facts: { calc: [[`(${end}-${start})/${step}`, 0]] }
      });
    }),
    T('sk-grid', '가로와 세로로 뛰어 센 표', '①54', (d) => {
      const [a, b] = d.pick([[100, 1000], [10, 100], [10, 1000]]), s = d.int(1, 6) * 1000 + d.int(1, 6) * 100 + d.int(1, 6) * 10 + d.int(1, 9), cell = (r, c) => s + a * c + b * r;
      return M(`가로(→)로 ${a}씩, 세로(↓)로 ${b}씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, both(cell(0, 2), cell(2, 0)), {
        figure: table(null, [[cell(0, 0), cell(0, 1), box(LABELS[0])], [cell(1, 0), '', ''], [box(LABELS[1]), '', '']]),
        explain: `㉠은 ${cell(0, 1)}보다 ${a}만큼 더 큰 ${cell(0, 2)}, ㉡은 ${cell(1, 0)}보다 ${b}만큼 더 큰 ${cell(2, 0)}이다.`, facts: { calc: [[`${cell(0, 1)}+${a}`, 0], [`${cell(1, 0)}+${b}`, 1]] }
      });
    }),
    T('sk-wrong', '뛰어 세기를 잘못 말한 것', '①55', (d) => {
      // 틀린 말: 뛰어 센 크기를 한 자리 틀리게 말한다(100씩 뛰어 센 줄을 10씩이라고 한다). 한 줄은 거꾸로 뛰어 센 줄이다.
      const ks = d.shuffle([0, 1, 2, 3]).slice(0, 3), back = d.int(0, 2), bad = d.int(0, 2);
      const rows = ks.map((k, j) => { const s = j === back ? spread(d, k, 4, 9) : spread(d, k, 1, 6), sign = j === back ? -1 : 1, told = j === bad ? (k === 3 ? 100 : k === 0 ? 10 : pow(k + d.pick([-1, 1]))) : pow(k); return { k, seq: [0, 1, 2].map((m) => s + sign * pow(k) * m), down: j === back, told }; });
      return C('뛰어 센 방법을 잘못 말한 것은?', rows.map((row) => `${row.seq.join(', ')} — ${row.told}씩 ${row.down ? '거꾸로 ' : ''}뛰어 세었다.`), bad, {
        explain: `${rows[bad].seq.join(', ')}에서는 ${PLACES[rows[bad].k]}의 자리 숫자가 1씩 ${rows[bad].down ? '작아진다' : '커진다'}. ${pow(rows[bad].k)}씩 ${rows[bad].down ? '거꾸로 ' : ''}뛰어 세었다.`,
        facts: { claimed: rows.map((row) => [row.down ? `${row.seq[0]}-${row.seq[1]}` : `${row.seq[1]}-${row.seq[0]}`, row.told]), claimedWant: false }
      });
    }),
    T('sk-save', '달마다 1000원씩 저금하기', '①56', (d) => {
      const have = d.int(2, 4) * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10, m = d.int(3, 5);
      return N(`저금통에 ${have}원이 있다. 다음 달부터 한 달에 1000원씩 ${m}달 동안 넣는다. 저금통의 돈은 모두 얼마가 되는가?`, have + 1000 * m, {
        unit: '원', explain: `${have}에서 1000씩 ${m}번 뛰어 세면 ${range(1, m).map((j) => have + 1000 * j).join(', ')}이다.`, facts: { calc: [[`${have}+1000*${m}`, 0]] }
      });
    }),
    T('sk-save-table', '표에서 규칙을 찾아 뛰어 세기', '①56', (d) => {
      const step = d.pick([1000, 100]), have = step === 1000 ? d.int(1, 4) * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10 : d.int(1, 9) * 1000 + d.int(1, 4) * 100 + d.int(1, 9) * 10, first = d.int(1, 7), at = (k) => have + step * k;
      return M('달마다 같은 돈을 저금통에 넣고 저금통의 돈을 표에 적었다. ㉠, ㉡에 알맞은 수는?', both(at(2), at(4), '원'), {
        figure: table(['달', '저금통의 돈(원)'], [0, 1, 2, 3, 4].map((k) => [`${first + k}월`, k === 2 ? box(LABELS[0]) : k === 4 ? box(LABELS[1]) : at(k)])),
        explain: `${at(0)}에서 ${josa(at(1), '으로/로')} ${step}만큼 커졌다. 달마다 ${step}원씩 넣었다. ㉠은 ${at(2)}, ㉡은 ${at(4)}이다.`, facts: { calc: [[`${at(1)}+(${at(1)}-${at(0)})`, 0], [`${at(3)}+(${at(1)}-${at(0)})`, 1]] }
      });
    }),
    T('sk-more', '몇 번 더 모은 뒤의 수', '①58 심36', (d) => {
      const who = d.pick(NAMES), k = d.int(3, 5), a = d.int(1, 9);
      if (d.bool()) {
        const have = a * 1000 + d.int(0, 9 - k) * 100 + d.int(1, 9) * 10;
        return N(`${name(who, '은/는')} ${have}원을 모았다. 100원짜리 동전 ${k}개를 더 모으면 모두 얼마인가?`, have + 100 * k, { unit: '원', explain: `${have}에서 100씩 ${k}번 뛰어 세면 ${range(1, k).map((j) => have + 100 * j).join(', ')}이다.`, facts: { calc: [[`${have}+100*${k}`, 0]] } });
      }
      const have = a * 1000 + d.int(1, 9) * 100 + d.int(0, 9 - k) * 10 + d.int(1, 9);
      return N(`${name(who, '은/는')} 종이학을 ${have}개 접었다. 하루에 10개씩 ${k}일 동안 더 접으면 모두 몇 개인가?`, have + 10 * k, { unit: '개', explain: `${have}에서 10씩 ${k}번 뛰어 세면 ${range(1, k).map((j) => have + 10 * j).join(', ')}이다.`, facts: { calc: [[`${have}+10*${k}`, 0]] } });
    })
  ]);

  B.addTypes('2-2-1', 'compare', [
    T('cmp-two', '두 수의 크기 비교', '①59·61 심41', (d, i) => {
      // 차례: 천의 자리 숫자가 다른 두 수(작은 쪽의 아랫자리 숫자가 더 크다) / 천의 자리 숫자가 같은 두 수(백·십·일의 자리에서 갈린다)
      let x, y, k = 3;
      if (i === 0) { const a = d.int(1, 8); [x, y] = d.shuffle([a * 1000 + d.int(600, 999), (a + 1) * 1000 + d.int(100, 499)]); }
      else {
        k = d.int(0, 2); x = toNum(uniq(d, 4));
        const other = d.until(() => d.int(0, 9), (v) => v !== digitAt(x, k)); y = x + (other - digitAt(x, k)) * pow(k);
        if (k > 0) y = y - (y % pow(k)) + d.int(0, pow(k) - 1);
        [x, y] = d.shuffle([x, y]);
      }
      const why = ['천, 백, 십의 자리 숫자가 각각 같으므로 일의 자리 숫자를 비교한다.', '천의 자리 숫자와 백의 자리 숫자가 각각 같으므로 십의 자리 숫자를 비교한다.', '천의 자리 숫자가 같으므로 백의 자리 숫자를 비교한다.', '천의 자리 숫자가 큰 수가 더 크다.'][k];
      return C('두 수의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, signOf(x, y), {
        figure: versus(x, y), explain: `${why} ${Math.max(x, y)} &gt; ${Math.min(x, y)}`, facts: { rule: ['thousands', 'lower'][i], choose: { exprs: [String(x), String(y)], rule: 'compare' } }
      });
    }, { count: 2 }),
    T('cmp-models', '수 모형으로 나타낸 두 수의 비교', '①59', (d) => {
      // 백 모형이 많은 쪽이 천 모형은 하나 적다
      const a = d.int(1, 2), list = d.shuffle([[a, d.int(3, 5), d.int(1, 4), d.int(1, 5)], [a + 1, d.int(0, 2), d.int(1, 4), d.int(1, 5)]]), vals = list.map(toNum), at = vals[0] > vals[1] ? 0 : 1;
      return C('더 큰 수를 나타내는 것은?', TAGS, at, {
        figure: G.tiles(list.map((ds, k) => [TAGS[k], model(ds[0], ds[1], ds[2], ds[3], 1)])), explain: `가는 ${vals[0]}, 나는 ${vals[1]}이다. 천 모형이 더 많은 ${TAGS[at]}가 더 큰 수이다.`,
        facts: { choose: { exprs: list.map(modelExpr), rule: 'max' }, unseen: [1000, 100, 10] }
      });
    }),
    T('cmp-place', '처음으로 다른 자리', '①60', (d) => {
      const k = d.pick([2, 1, 1, 0]), a = toNum(uniq(d, 4)), x = digitAt(a, k), y = d.until(() => d.int(1, 9), (v) => v !== x);
      let b = a + (y - x) * pow(k); if (k > 0) b = b - (b % pow(k)) + d.int(0, pow(k) - 1);
      const first = [3, 2, 1, 0].find((p) => digitAt(a, p) !== digitAt(b, p)), row = (n) => [n].concat(digits4(n));
      return C(`${josa(a, '과/와')} ${josa(b, '을/를')} 천의 자리부터 차례로 비교한다. 숫자가 처음으로 다른 자리는?`, PLACE_OPTIONS, 3 - first, {
        figure: table(['수', '천', '백', '십', '일'], [row(a), row(b)]), explain: `천의 자리부터 차례로 비교하면 ${PLACES[first]}의 자리 숫자가 ${josa(digitAt(a, first), '과/와')} ${josa(digitAt(b, first), '으로/로')} 처음 다르다. ${josa(Math.max(a, b), '이/가')} 더 크다.`,
        facts: { truth: [3, 2, 1, 0].map((p) => p === first), want: true }
      });
    }),
    T('cmp-true', '바르게 비교한 것 고르기', '①62 심42', (d) => {
      // 틀린 보기: 천의 자리 숫자는 작고 백의 자리 숫자가 큰 수를 크다고 한 것(8800 > 9000), 십의 자리에서 갈리는 것(8301 > 8364), 일의 자리에서 갈리는 것(2769 < 2760)
      const rows = d.until(() => {
        const a = d.int(1, 8), b = d.int(1, 9) * 1000 + d.int(0, 9) * 100, t = d.int(0, 5), c = d.int(1, 9) * 1000 + d.int(0, 9) * 100 + d.int(0, 9) * 10, o = d.int(1, 9), g = d.int(1, 8), x = d.int(1000, 9990);
        const good = d.bool() ? [x, '<', x + d.int(1, 9)] : [(g + 1) * 1000 + d.int(0, 299), '>', g * 1000 + d.int(700, 999)];
        return d.shuffle([good, [a * 1000 + d.int(7, 9) * 100 + d.int(0, 99), '>', (a + 1) * 1000 + d.int(0, 2) * 100 + d.int(0, 99)], [b + t * 10 + d.int(5, 9), '>', b + (t + d.int(1, 4)) * 10 + d.int(0, 4)], [c + o, '<', c + d.int(0, o - 1)]]);
      }, (list) => new Set(list.map((row) => row.join(' '))).size === 4);
      const truth = rows.map(([l, s, r]) => (s === '>' ? l > r : l < r)), at = truth.indexOf(true), show = ([l, s, r]) => `${l} ${s === '>' ? '&gt;' : '&lt;'} ${r}`;
      return C('두 수의 크기를 바르게 비교한 것은?', rows.map(show), at, { explain: `천의 자리부터 차례로 비교한다. ${show(rows[at])}만 바르게 비교하였다.`, facts: { truth, want: true } });
    }),
    T('cmp-ends', '세 수 가운데 가장 작은 수와 가장 큰 수', '①63', (d) => {
      // 천의 자리 숫자가 같은 두 수와, 천의 자리 숫자가 하나 작고 아랫자리 숫자는 큰 수
      const a = d.int(2, 9), [h1, h2] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]), vals = d.shuffle([a * 1000 + h1 * 100 + d.int(0, 99), a * 1000 + h2 * 100 + d.int(0, 99), (a - 1) * 1000 + 900 + d.int(0, 99)]);
      const big = Math.max(...vals), small = Math.min(...vals);
      return M('가장 작은 수와 가장 큰 수는?', [{ label: '가장 작은 수', answer: small }, { label: '가장 큰 수', answer: big }], {
        figure: numbers(vals), explain: `천의 자리 숫자가 ${a - 1}인 ${josa(small, '이/가')} 가장 작다. 천의 자리 숫자가 ${a}인 두 수는 백의 자리 숫자를 비교한다. ${josa(big, '이/가')} 가장 크다.`,
        facts: { minOf: vals, calc: [[maxExpr(vals), 1]], unseen: [0, 1] }
      });
    }),
    T('cmp-pick', '여러 수 가운데 가장 큰(작은) 수', '①63 심44', (d) => {
      // 천의 자리 숫자가 같은 수가 셋이고, 그 가운데 둘은 백의 자리 숫자까지 같다
      const small = d.bool(), a = small ? d.int(1, 7) : d.int(3, 9), h = small ? d.int(0, 6) : d.int(3, 9), [t1, t2] = d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const vals = d.shuffle([a * 1000 + h * 100 + t1 * 10 + d.int(0, 9), a * 1000 + h * 100 + t2 * 10 + d.int(0, 9), a * 1000 + (small ? d.int(h + 1, 9) : d.int(0, h - 1)) * 100 + d.int(0, 99), (small ? d.int(a + 1, 9) : d.int(1, a - 1)) * 1000 + (small ? d.int(0, 199) : d.int(800, 999))]);
      const best = small ? Math.min(...vals) : Math.max(...vals);
      return C(`가장 ${small ? '작은' : '큰'} 수는?`, vals.map(String), vals.indexOf(best), {
        explain: `천의 자리 숫자가 ${a}인 수 가운데 백의 자리 숫자가 ${h}인 두 수의 십의 자리 숫자를 비교한다. ${josa(best, '이/가')} 가장 ${small ? '작다' : '크다'}.`, facts: { choose: { exprs: vals.map(String), rule: small ? 'min' : 'max' } }
      });
    }),
    T('cmp-order', '세 수의 차례', '①64 심44', (d) => {
      // 4097과 4106: 끝 두 자리(97)가 커 보여도 백의 자리 숫자(0 < 1)에서 갈린다
      const a = d.int(2, 8), h = d.int(0, 7), small = d.bool(), vals = d.shuffle([a * 1000 + h * 100 + d.int(70, 99), a * 1000 + (h + 1) * 100 + d.int(0, 29), (a + d.pick([-1, 1])) * 1000 + d.int(0, 9) * 100 + d.int(0, 99)]);
      const right = [0, 1, 2].sort((p, q) => (small ? vals[p] - vals[q] : vals[q] - vals[p])), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C(`${small ? '작은' : '큰'} 수부터 차례로 기호를 쓴 것은?`, list.map((o) => o.map((k) => LABELS[k]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(vals.map(String)), explain: `천의 자리 숫자를 먼저 비교하고, 같으면 백의 자리 숫자를 비교한다. ${small ? '작은' : '큰'} 수부터 차례로 쓰면 ${right.map((k) => vals[k]).join(', ')}이다.`,
        facts: { choose: { exprs: vals.map(String), rule: small ? 'ascending' : 'descending', orders: list } }
      });
    }),
    T('cmp-count', '기준 수보다 큰(작은) 수의 개수', '①65 심43', (d) => {
      // 십의 자리나 일의 자리에서 갈리는 수를 섞는다(4215와 4213·4205)
      const a = d.int(2, 8), b = d.int(1, 8), target = toNum([a, b, d.int(2, 7), d.int(3, 6)]), above = d.bool(), hit = (v) => (above ? v > target : v < target);
      const vals = d.until(() => d.shuffle([target + d.pick([-3, -2, -1, 1, 2, 3]), target + d.pick([-20, -10, 10, 20]) + d.int(-3, 3), a * 1000 + (b + d.pick([-1, 1])) * 100 + d.int(0, 99), (a - 1) * 1000 + d.int(800, 999), (a + 1) * 1000 + d.int(0, 199), a * 1000 + b * 100 + d.int(0, 99)]),
        (v) => new Set(v).size === 6 && !v.includes(target) && v.filter(hit).length >= 2 && v.filter(hit).length <= 4);
      return N(`${target}보다 ${above ? '큰' : '작은'} 수는 모두 몇 개인가?`, vals.filter(hit).length, {
        unit: '개', figure: numbers(vals), explain: `${target}보다 ${above ? '큰' : '작은'} 수는 ${vals.filter(hit).join(', ')}이다.`, facts: { big: { countIf: { values: vals, test: above ? 'above' : 'below', target, i: 0 } } }
      });
    }),
    T('cmp-above-word', '읽는 말로 준 수보다 큰 수', '①65', (d) => {
      // 틀린 보기: 일의 자리만 작은 수, 십의 자리가 작고 일의 자리는 큰 수, 천의 자리가 작고 아랫자리는 큰 수
      const a = d.int(2, 9), b = d.int(1, 9), c = d.int(2, 8), e = d.int(2, 7), target = toNum([a, b, c, e]), right = d.bool() ? target + d.int(1, 9 - e) : toNum([a, b, c + 1, d.int(0, e - 1)]);
      const vals = d.shuffle([right, target - d.int(1, e), toNum([a, b, c - 1, d.int(e + 1, 9)]), toNum([a - 1, 9, d.int(c, 9), d.int(e, 9)])]), word = say(target);
      return C(`${quoted(word)}보다 큰 수는?`, vals.map(String), vals.indexOf(right), {
        explain: `${quoted(word, '을/를')} 수로 쓰면 ${target}이다. ${target}보다 큰 수는 ${right}이다.`, facts: { only: { values: vals, test: 'atLeast', target: target + 1 }, big: { shown: [[word, target]] } }
      });
    }),
    T('cmp-forms', '다르게 나타낸 세 수의 비교', '①66 ①61', (d) => {
      // 읽는 말, 묶음, 수로 적은 세 수를 모두 수로 고쳐 비교한다. 수로 적은 것은 천의 자리 숫자가 하나 다르고 아랫자리 숫자가 눈에 띈다.
      const a = d.int(3, 8), big = d.bool(), [h1, h2] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]), c = d.int(0, 9), w = a * 1000 + h1 * 100 + d.int(1, 9), text = bundles([a, h2, c, 0]), num = big ? (a - 1) * 1000 + 900 + d.int(11, 99) : (a + 1) * 1000 + d.int(1, 99);
      const rows = d.shuffle([[say(w), String(w), w], [text, bundleExpr(text), a * 1000 + h2 * 100 + c * 10], [String(num), String(num), num]]);
      const best = big ? Math.max(...rows.map((row) => row[2])) : Math.min(...rows.map((row) => row[2]));
      return C(`가장 ${big ? '큰' : '작은'} 수는?`, LABELS.slice(0, 3), rows.findIndex((row) => row[2] === best), {
        figure: tagged(rows.map((row) => row[0])), explain: `수로 쓰면 ㉠은 ${rows[0][2]}, ㉡은 ${rows[1][2]}, ㉢은 ${rows[2][2]}이다.`,
        facts: { rule: 'forms', choose: { exprs: rows.map((row) => row[1]), rule: big ? 'max' : 'min' }, big: { shown: [[say(w), w]] } }
      });
    }),
    T('cmp-between-list', '두 수 사이의 수 쓰기', '①67', (d) => {
      // 천의 자리가 바뀌는 곳을 지난다
      const a = d.int(2, 9) * 1000 - d.int(2, 3), b = a + 5;
      return M(`${a}보다 크고 ${b}보다 작은 수를 작은 수부터 차례로 쓰시오.`, [1, 2, 3, 4].map((k) => ({ answer: a + k })), {
        explain: `${a}부터 차례로 쓰면 ${range(a, b).join(', ')}이다. ${josa(a, '과/와')} ${josa(b, '은/는')} 들어가지 않는다.`, facts: { calc: [[`${a}+1`, 0], [`${a}+2`, 1], [`${b}-2`, 2], [`${b}-1`, 3]], unseen: [1, 2] }
      });
    }),
    T('cmp-between', '두 수 사이에 있는 수 고르기', '심46', (d) => {
      // 틀린 보기: 작은 쪽 끝보다 조금 작은 수, 큰 쪽 끝보다 조금 큰 수, 천의 자리 숫자만 다른 수
      const lo = d.int(2, 8) * 1000 + d.int(1, 7) * 100 + d.int(20, 79), hi = lo + d.int(110, 190), inside = d.int(lo + 20, hi - 20), under2 = lo - d.int(2, 15), over = hi + d.int(2, 15);
      const vals = d.shuffle([inside, under2, over, inside + d.pick([-1000, 1000])]);
      return C(`${lo}보다 크고 ${hi}보다 작은 수는?`, vals.map(String), vals.indexOf(inside), {
        explain: `${josa(inside, '은/는')} ${lo}보다 크고 ${hi}보다 작다. ${josa(under2, '은/는')} ${lo}보다 작고, ${josa(over, '은/는')} ${hi}보다 크다.`, facts: { between: { low: String(lo), high: String(hi), exprs: vals.map(String) } }
      });
    }),
    T('cmp-between-count', '두 수 사이에 있는 번호 세기', '심47', (d) => {
      // 끝과 가까운 번호(4549, 4601)와 천의 자리 숫자만 다른 번호(3575)를 섞는다
      const names = d.shuffle(NAMES).slice(0, 6), lo = d.int(2, 8) * 1000 + d.int(1, 8) * 100 + 50, hi = lo + 50, k = d.int(2, 3);
      const vals = d.until(() => d.shuffle(range(1, k).map(() => d.int(lo + 1, hi - 1)).concat([lo - d.int(1, 45), hi + d.int(1, 45), d.int(lo + 1, hi - 1) + d.pick([-1000, 1000])], k === 2 ? [d.bool() ? lo - d.int(46, 90) : hi + d.int(46, 90)] : [])), (v) => new Set(v).size === 6);
      const inside = vals.filter((v) => v > lo && v < hi);
      return N(`여섯 사람이 받은 번호표이다. 번호가 ${lo}보다 크고 ${hi}보다 작은 사람은 모두 몇 명인가?`, inside.length, {
        unit: '명', figure: table(['이름', '번호'], names.map((who, j) => [who, vals[j]])), explain: `${lo}보다 크고 ${hi}보다 작은 번호는 ${inside.join(', ')}이다.`,
        facts: { calc: [[vals.map((v) => `(1-0**((${v}-${v}%${lo})/${lo}))*0**((${v}-${v}%${hi})/${hi})`).join('+'), 0]], unseen: [0, 1] }
      });
    }),
    T('cmp-word2', '두 양을 비교하는 문장제', '①68', (d) => {
      // 백의 자리 숫자가 작은 쪽의 십의 자리 숫자가 더 크다(5400원과 5380원)
      const [n1, n2] = d.shuffle(NAMES), a = d.int(2, 9), h = d.int(2, 8), [x, y] = d.shuffle([a * 1000 + h * 100 + d.int(0, 2) * 10, a * 1000 + (h - 1) * 100 + d.int(6, 9) * 10]);
      return C(`${name(n1, '은/는')} ${x}원, ${name(n2, '은/는')} ${y}원을 모았다. 돈을 더 많이 모은 사람은?`, [n1, n2], x > y ? 0 : 1, {
        explain: `천의 자리 숫자가 같으므로 백의 자리 숫자를 비교한다. ${Math.max(x, y)} &gt; ${Math.min(x, y)}이므로 ${name(x > y ? n1 : n2, '이/가')} 더 많이 모았다.`, facts: { choose: { exprs: [String(x), String(y)], rule: 'max' } }
      });
    }),
    T('cmp-word3', '세 양을 비교하는 문장제', '①68', (d) => {
      // 천의 자리 숫자가 하나 다른 수는 아랫자리 숫자가 눈에 띈다(2905, 4012)
      const most = d.bool(), a = d.int(2, 8), [h1, h2] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]), things = ['사과', '배', '감'];
      const vals = d.shuffle([a * 1000 + h1 * 100 + d.int(0, 99), a * 1000 + h2 * 100 + d.int(0, 99), most ? (a - 1) * 1000 + 900 + d.int(0, 99) : (a + 1) * 1000 + d.int(0, 99)]), best = most ? Math.max(...vals) : Math.min(...vals);
      return C(`과수원에서 사과를 ${vals[0]}개, 배를 ${vals[1]}개, 감을 ${vals[2]}개 땄다. 가장 ${most ? '많이' : '적게'} 딴 과일은?`, things, vals.indexOf(best), {
        explain: `${most ? '큰' : '작은'} 수부터 차례로 쓰면 ${vals.slice().sort((p, q) => (most ? q - p : p - q)).join(', ')}이다. ${josa(best, '이/가')} 가장 ${most ? '크다' : '작다'}.`, facts: { choose: { exprs: vals.map(String), rule: most ? 'max' : 'min' } }
      });
    }),
    T('cmp-box', '□ 안에 들어갈 수 있는 숫자', '①69', (d) => {
      // □가 일의 자리에 있어 일의 자리 숫자만 비교하면 된다(□가 백의 자리에 있는 꼴은 실력에 있다)
      const o = d.int(3, 6), stem = toNum(uniq(d, 3)), n = stem * 10 + o, less = d.bool(), flip = d.bool(), fits = less ? range(0, o - 1) : range(o + 1, 9);
      const shown = flip ? `${n} ${less ? '&gt;' : '&lt;'} ${stem}${box()}` : `${stem}${box()} ${less ? '&lt;' : '&gt;'} ${n}`;
      return N('0부터 9까지의 숫자 중에서 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', fits.length, {
        unit: '개', figure: lines([shown]), explain: `천, 백, 십의 자리 숫자가 각각 같으므로 □ 안에는 ${o}보다 ${less ? '작은' : '큰'} 숫자가 들어간다. ${fits.join(', ')}${after(String(fits[fits.length - 1]), '으로/로')} ${fits.length}개이다.`,
        facts: { rule: 'ones', digit: { template: flip ? `${n}${less ? '>' : '<'}${stem}□` : `${stem}□${less ? '<' : '>'}${n}`, lo: 0, hi: 9, ask: 'count' } }
      });
    })
  ]);

  B.addTypes('2-2-1', 'cards', [
    T('cd-max', '수 카드로 가장 큰 수 만들기', '①70', (d) => {
      const digits = d.bool() ? d.shuffle([0].concat(uniq(d, 3))) : uniq(d, 4), made = toNum(digits.slice().sort((p, q) => q - p));
      return N('수 카드 4장을 한 번씩만 써서 네 자리 수를 만들려고 한다. 가장 큰 수는?', made, { figure: cards(digits), explain: `천의 자리부터 큰 수를 차례로 놓는다. ${made}이다.`, facts: { rule: 'max', big: { cardsMake: { digits, rule: 'max' } } } });
    }),
    T('cd-min', '수 카드로 가장 작은 수 만들기', '①70', (d) => {
      const digits = uniq(d, 4), made = toNum(digits.slice().sort((p, q) => p - q));
      return N('수 카드 4장을 한 번씩만 써서 네 자리 수를 만들려고 한다. 가장 작은 수는?', made, { figure: cards(digits), explain: `천의 자리부터 작은 수를 차례로 놓는다. ${made}이다.`, facts: { rule: 'min', big: { cardsMake: { digits, rule: 'min' } } } });
    }),
    T('cd-fixed-max', '한 자리를 정해 놓고 가장 큰 수 만들기', '①71', (d) => {
      const digits = uniq(d, 4), k = d.int(0, 3), sorted = digits.slice().sort((p, q) => q - p), t = k === 3 ? d.pick(sorted.slice(1)) : d.pick(digits), rest = sorted.filter((v) => v !== t), made = toNum(rest.slice(0, 3 - k).concat([t], rest.slice(3 - k)));
      return N(`수 카드 4장을 한 번씩만 써서 ${PLACES[k]}의 자리 숫자가 ${t}인 네 자리 수를 만들려고 한다. 가장 큰 수는?`, made, {
        figure: cards(digits), explain: `${PLACES[k]}의 자리에 ${josa(t, '을/를')} 놓는다. 남은 자리에는 높은 자리부터 큰 수를 차례로 놓는다. ${made}이다.`, facts: { big: { cardsMake: { digits, rule: 'max', fixed: [[pow(k), t]] } } }
      });
    })
  ]);

  B.addGroup('2-2-1', {
    id: 'hard', title: '실력 문제', standard: NUM,
    types: [
      H('h-thousand-all', '1000을 나타내는 것 모두 고르기', '2·4, 기본 ①4', (d) => {
        // ① 1000을 만드는 짝을 엇갈리게 적은 말(「900보다 10만큼」「990보다 100만큼」「999보다 10만큼」「990보다 1만큼」)을 1000으로 읽는 아이가 틀린다(㉮).
        //    「10이 10개」(100)를 1000으로 읽는 아이, 「10이 100개」를 100으로 읽어 빼는 아이도 틀린다.
        const GOOD = ['100이 10개인 수', '10이 100개인 수', '900보다 100만큼 더 큰 수', '990보다 10만큼 더 큰 수', '999보다 1만큼 더 큰 수'];
        const BAD = ['10이 10개인 수', '900보다 10만큼 더 큰 수', '990보다 100만큼 더 큰 수', '999보다 10만큼 더 큰 수', '990보다 1만큼 더 큰 수'];
        const good = d.int(2, 3), rows = d.shuffle(d.shuffle(GOOD).slice(0, good).concat(d.shuffle(BAD).slice(0, 4 - good))), right = [0, 1, 2, 3].filter((i) => claimOf(rows[i])[1] === 1000);
        // 보기: 맞는 것만 모은 것(정답) / 틀린 말 하나를 1000으로 읽은 것 / 맞는 말 하나를 놓친 것 / 하나를 놓치고 틀린 것을 하나 넣은 것
        const wrong = [0, 1, 2, 3].filter((i) => !right.includes(i)), tidy = (set) => set.slice().sort((p, q) => p - q), drop = d.pick(right), swap = d.pick(right);
        const options = d.shuffle([right, tidy(right.concat([d.pick(wrong)])), right.filter((i) => i !== drop), tidy(right.filter((i) => i !== swap).concat([d.pick(wrong)]))]);
        const mask = (set) => set.reduce((sum, i) => sum + (1 << i), 0), maskExpr = rows.map((row, i) => `${1 << i}*${same(claimOf(row)[0], 1000)}`).join('+');
        return C('1000을 나타내는 것을 모두 고른 것은?', options.map((set) => set.map((i) => LABELS[i]).join(', ')), options.indexOf(right), {
          figure: tagged(rows), explain: `${wrong.map((i) => `${rows[i]}는 ${claimOf(rows[i])[1]}`).join(', ')}이다. 나머지는 모두 1000을 나타낸다.`,
          facts: { claimed: options.map((set) => [maskExpr, mask(set)]), claimedWant: true }
        });
      }),
      H('h-coins-more', '10원짜리 동전 10개가 낀 돈', '5', (d) => {
        // ① 10원짜리 동전 10개를 100원으로 바꾸어 세어야 한다(㉯). 답은 금액이 아니라 동전의 수이다.
        const k = d.int(3, 6);
        return N('동전이 그림과 같이 있다. 1000원이 되려면 100원짜리 동전이 몇 개 더 있어야 하는가?', 9 - k, {
          unit: '개', figure: money(0, k, 10), explain: `10원짜리 동전 10개는 100원이다. 100원짜리 동전 ${k + 1}개가 있는 것과 같으므로 ${(k + 1) * 100}원이다. 100원짜리 동전이 ${9 - k}개 더 있으면 100이 10개가 되어 1000원이다.`,
          facts: { calc: [[`(1000-100*${k}-10*10)/100`, 0]] }
        });
      }),
      H('h-over', '한 자리의 묶음이 10개를 넘는 수', '19, 기본 ①28', (d) => {
        // ① 개수를 그대로 이어 쓰거나(2134…) 넘친 10개를 버리는 아이가 틀린다(㉰). 10개는 윗자리 1개로 바꾼다.
        const z = d.int(1, 3), counts = [d.int(1, 7), d.int(1, 8), d.int(1, 8), d.int(1, 9)];
        counts[z] = d.int(11, 19);
        const text = bundles(counts), n = counts.reduce((sum, c, k) => sum + c * UNITS[k], 0), fixed = counts.map((c, k) => (k === z ? c - 10 : k === z - 1 ? c + 1 : c));
        return N(`${text}는?`, n, {
          explain: `${josa(UNITS[z], '이/가')} ${counts[z]}개이면 ${josa(UNITS[z - 1], '이/가')} 1개, ${josa(UNITS[z], '이/가')} ${counts[z] - 10}개인 것과 같다. ${bundles(fixed)}와 같으므로 ${n}이다.`, facts: { rule: 'over', calc: [[bundleExpr(text), 0]] }
        });
      }),
      H('h-over-digit', '묶음이 넘치는 수의 자리 숫자가 나타내는 값', '21', (d) => {
        // ① 「100이 7개」만 보고 700이라고 하는 아이가 틀린다(㉰). 아랫자리의 묶음이 10개를 넘어 그 자리 숫자가 1 커진다.
        const z = d.int(1, 3), counts = [d.int(1, 8), d.int(1, 8), d.int(1, 8), d.int(1, 9)];
        counts[z] = d.int(11, 19);
        const text = bundles(counts), n = counts.reduce((sum, c, k) => sum + c * UNITS[k], 0), unit = UNITS[z - 1], k = 4 - z, value = digitAt(n, k) * unit, whole = `(${bundleExpr(text)})`;
        return N(`${text}가 있다. 이 수에서 ${PLACES[k]}의 자리 숫자가 나타내는 값은?`, value, {
          explain: `${josa(UNITS[z], '이/가')} ${counts[z]}개이면 ${josa(unit, '이/가')} 1개, ${josa(UNITS[z], '이/가')} ${counts[z] - 10}개인 것과 같다. 이 수는 ${n}이다. ${PLACES[k]}의 자리 숫자는 ${digitAt(n, k)}이고 ${josa(value, '을/를')} 나타낸다.`,
          facts: { calc: [[`((${whole}-${whole}%${unit})/${unit})%10*${unit}`, 0]], unseen: [10] }
        });
      }),
      H('h-zero-odd', '0이 두 군데 낀 수와 다른 하나', '16', (d) => {
        // ① 7002와 7020을 가른다(㉱): 「칠천이」의 이는 일의 자리, 「칠천이십」의 이는 십의 자리이다. 숫자만 맞추어 보는 아이는 가리지 못한다.
        const a = d.int(2, 9), e = d.until(() => d.int(2, 9), (v) => v !== a), [n, m] = d.shuffle([a * 1000 + e, a * 1000 + e * 10, a * 1000 + e * 100]);
        const forms = [String, say, (v) => bundles(digits4(v)), expanded], odd = d.int(0, 3), order = d.shuffle([0, 1, 2, 3]), rows = order.map((f) => forms[f](f === odd ? m : n)), at = order.indexOf(odd);
        return C('나타내는 수가 나머지와 다른 하나는?', rows, at, {
          explain: `수로 쓰면 차례로 ${order.map((f) => (f === odd ? m : n)).join(', ')}이다. 0인 자리는 읽지 않고, 묶음이나 합으로 나타낼 때도 적지 않는다.`, facts: { rule: 'twoZeros', big: { odd: rows.map(formExpr) } }
        });
      }),
      H('h-read-ends', '읽는 말의 처음과 끝으로 수 찾기', '17', (d) => {
        // ① 숫자 8이 들어 있기만 하면 고르는 아이는 「오천팔십사」「오천팔백이」를 고른다. 읽는 말의 끝은 일의 자리 숫자이다(㉱).
        const [a, a2] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]), t = d.int(2, 9), [c, c2, c3] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== t));
        const right = d.bool() ? a * 1000 + c * 10 + t : a * 1000 + c * 100 + t, list = d.shuffle([right, a * 1000 + t * 10 + c2, a * 1000 + t * 100 + c3, a2 * 1000 + c * 100 + c2 * 10 + t]);
        const head = say(a * 1000), last = say(t), truth = list.map((v) => say(v).startsWith(head) && say(v).endsWith(last));
        return C(`어떤 수를 읽으면 ${quoted(head, '으로/로')} 시작하고 ${quoted(last, '으로/로')} 끝난다. 이 수는?`, list.map(String), truth.indexOf(true), {
          explain: `네 수를 읽으면 차례로 ${list.map((v) => quoted(say(v))).join(', ')}이다. 0인 자리는 읽지 않으므로 끝에 읽는 말은 일의 자리 숫자이다.`, facts: { truth, want: true }
        });
      }),
      H('h-underlined', '밑줄 친 숫자가 나타내는 값의 비교', '27, 기본 ①36', (d) => {
        // ① 밑줄 친 숫자의 크기만 보는 아이가 틀린다(㉲): 값이 가장 큰 것은 백의 자리의 작은 숫자이고, 값이 가장 작은 것은 일의 자리의 큰 숫자이다.
        const big = d.bool(), marks = big ? [[2, d.int(2, 4)], [1, 9], [1, d.int(6, 8)], [0, d.int(8, 9)]] : [[0, d.int(8, 9)], [1, d.int(1, 2)], [1, d.int(3, 4)], [2, 1]];
        const made = d.until(() => marks.map(([k, t]) => { const ds = [d.int(1, 9), d.int(0, 9), d.int(0, 9), d.int(0, 9)]; ds[3 - k] = t; return [toNum(ds), k, t]; }), (list) => new Set(list.map((row) => row[0])).size === 4);
        const list = d.shuffle(made), values = list.map(([, k, t]) => t * pow(k));
        return C(`밑줄 친 숫자가 나타내는 값이 가장 ${big ? '큰' : '작은'} 수는?`, list.map(([n, k]) => under(n, k)), list.indexOf(made[0]), {
          explain: `밑줄 친 숫자가 나타내는 값은 차례로 ${values.join(', ')}이다. 숫자의 크기가 아니라 숫자가 있는 자리를 먼저 본다.`,
          facts: { choose: { exprs: list.map(([n, k]) => vx(n, k)), rule: big ? 'max' : 'min' }, unseen: [1000, 100, 10, 1] }
        });
      }),
      H('h-value-words', '읽는 말로 적은 수에서 숫자가 나타내는 값의 비교', '26, 기본 ①35', (d) => {
        // ② 읽는 말을 수로 바꾼 다음 그 숫자의 자리를 본다. 0인 자리는 읽지 않으므로 말의 차례만으로는 자리를 알 수 없다(㉱)
        const t = d.int(2, 9), big = d.bool(), places = d.shuffle([0, 1, 2, 3]), want = big ? 3 : 0;
        const list = places.map((p) => { const ds = [3, 2, 1, 0].map((k) => (k === p ? t : d.until(() => d.int(2, 9), (v) => v !== t))); ds[d.pick([1, 2, 3].filter((j) => j !== 3 - p))] = 0; return toNum(ds); });
        return C(`숫자 ${josa(t, '이/가')} 나타내는 값이 가장 ${big ? '큰' : '작은'} 수는?`, list.map(say), places.indexOf(want), {
          explain: `수로 쓰면 차례로 ${list.join(', ')}이다. 숫자 ${josa(t, '이/가')} 나타내는 값은 차례로 ${places.map((p) => t * pow(p)).join(', ')}이다.`,
          facts: { rule: 'words', choose: { exprs: list.map((v, i) => vx(v, places[i])), rule: big ? 'max' : 'min' }, big: { shown: list.map((v) => [say(v), v]) }, unseen: [1000, 100, 10, 1] }
        });
      }),
      H('h-place-or-value', '자리의 숫자와 숫자가 나타내는 값', '28, 기본 ①39', (d) => {
        // ① 「백의 자리 숫자가 4인 수」는 「4가 400을 나타내는 수」이다. 이것을 「4가 40을 나타내는 수」와 같은 것으로 세는 아이가 틀린다(㉲)
        const t = d.int(2, 9), [nh, nt] = d.pick([[1, 2], [2, 1], [2, 3], [3, 2]]), spots = d.shuffle([3, 0, d.pick([3, 0])]).slice(0, 6 - nh - nt);
        const list = d.until(() => d.shuffle(range(1, nh).map(() => withDigit(d, t, 2)).concat(range(1, nt).map(() => withDigit(d, t, 1)), spots.map((p) => withDigit(d, t, p)))), (v) => new Set(v).size === 6);
        return M('수를 보고 ㉠, ㉡에 알맞은 수를 구하시오.', both(nh, nt, '개'), {
          figure: numbers(list) + lines([`백의 자리 숫자가 ${t}인 수는 ${keep(box(LABELS[0]) + '개이다.')}`, `숫자 ${josa(t, '이/가')} ${josa(t * 10, '을/를')} 나타내는 수는 ${keep(box(LABELS[1]) + '개이다.')}`]),
          explain: `백의 자리 숫자가 ${t}인 수는 ${list.filter((v) => digitAt(v, 2) === t).join(', ')}이다. 숫자 ${josa(t, '이/가')} ${josa(t * 10, '을/를')} 나타내는 수는 십의 자리 숫자가 ${t}인 ${list.filter((v) => digitAt(v, 1) === t).join(', ')}이다.`,
          facts: { calc: [[list.map((v) => same(dx(v, 2), t)).join('+'), 0], [list.map((v) => same(vx(v, 1), t * 10)).join('+'), 1]], unseen: [0, 100, 10] }
        });
      }),
      H('h-skip-step', '윗자리가 함께 바뀌는 줄에서 뛰어 센 크기', '31', (d) => {
        // ① 천의 자리(백의 자리) 숫자가 바뀐 것만 보고 1000씩(100씩) 뛰어 세었다고 하는 아이가 틀린다(㉳)
        const step = d.pick([100, 10]), k = step === 100 ? 2 : 1, s = step === 100 ? d.int(1, 8) * 1000 + d.int(7, 8) * 100 + d.int(11, 99) : d.int(1, 9) * 1000 + d.int(1, 8) * 100 + d.int(7, 8) * 10 + d.int(1, 9);
        const list = [0, 1, 2, 3].map((j) => s + step * j), cross = list.findIndex((v) => digitAt(v, k) === 0);
        return N('몇씩 뛰어 세었는가?', step, {
          figure: hops(list), explain: `${list[0]}에서 ${josa(list[1], '으로/로')} ${step}만큼 커졌다. ${list[cross - 1]}에서 ${step}만큼 뛰어 세면 ${PLACES[k + 1]}의 자리 숫자까지 바뀌어 ${list[cross]}이다. ${step}씩 뛰어 세었다.`,
          facts: { rule: 'cross', calc: [[`${list[1]}-${list[0]}`, 0]] }
        });
      }, { standard: ORDER }),
      H('h-back-find', '거꾸로 뛰어 세어 처음 수 구하기', '33, 기본 ①51', (d) => {
        // ② 뛰어 센 것을 거꾸로 되짚는다. 거꾸로 셀 때 윗자리가 바뀌는 곳을 지난다(㉳)
        const step = d.pick([100, 10]), n = d.int(3, 5), a = d.int(2, 9);
        const end = step === 100 ? a * 1000 + d.int(0, n - 1) * 100 + d.int(11, 99) : a * 1000 + d.int(1, 9) * 100 + d.int(0, n - 1) * 10 + d.int(1, 9);
        return N(`어떤 수에서 ${step}씩 ${n}번 뛰어 세었더니 ${josa(end, '이/가')} 되었다. 어떤 수는?`, end - step * n, {
          explain: `${end}에서 ${step}씩 거꾸로 ${n}번 뛰어 세면 ${range(1, n).map((j) => end - step * j).join(', ')}이다.`, facts: { calc: [[`${end}-${step}*${n}`, 0]] }
        });
      }, { standard: ORDER }),
      H('h-skip-parts', '묶음으로 준 수에서 뛰어 세기', '기본 ①52', (d) => {
        // ② 한 자리가 비는 수를 먼저 쓰고(1000이 5개, 10이 4개, 1이 6개 → 5046), 그 빈 자리의 수만큼 뛰어 센다
        const z = d.int(1, 2), ds = uniq(d, 4); ds[z] = 0;
        const text = bundles(ds), base = toNum(ds), step = UNITS[z], k = d.int(3, 5);
        return N(`${text}가 있다. 이 수에서 ${step}씩 ${k}번 뛰어 센 수는?`, base + step * k, {
          explain: `${text}는 ${base}이다. ${base}에서 ${step}씩 ${k}번 뛰어 세면 ${range(1, k).map((j) => base + step * j).join(', ')}이다.`, facts: { calc: [[`${bundleExpr(text)}+${step}*${k}`, 0]] }
        });
      }, { standard: ORDER }),
      H('h-skip-grid', '규칙을 찾아야 하는 뛰어 세기 표', '34, 기본 ①54', (d) => {
        // ② 가로와 세로의 규칙을 따로 찾아 두 번 뛰어 센다. 가로 줄은 윗자리가 바뀌는 곳을 지난다(㉳)
        const [a, b] = d.pick([[10, 100], [10, 1000], [100, 1000]]);
        const s = a === 10 ? d.int(1, 6) * 1000 + d.int(1, 6) * 100 + 80 + d.int(1, 9) : d.int(1, 5) * 1000 + 800 + d.int(11, 99), cell = (r, c) => s + a * c + b * r;
        return N('가로(→)와 세로(↓)로 각각 같은 수만큼 뛰어 세어 표에 썼다. ㉠에 알맞은 수는?', cell(2, 2), {
          figure: table(null, [[cell(0, 0), cell(0, 1), cell(0, 2)], [cell(1, 0), '', ''], ['', '', box(LABELS[0])]]),
          explain: `가로로 ${a}씩, 세로로 ${b}씩 커진다. ${cell(0, 2)}에서 세로로 ${b}씩 2번 뛰어 세면 ${cell(1, 2)}, ${cell(2, 2)}이다.`, facts: { calc: [[`${cell(0, 2)}+(${cell(1, 0)}-${cell(0, 0)})*2`, 0]], unseen: [2] }
        });
      }, { standard: ORDER }),
      H('h-missing-card', '섞인 수 카드에서 보이지 않는 수', '35', (d) => {
        // ② 흩어진 수를 차례대로 놓아 본 다음 빠진 수를 찾는다. 빠진 수는 윗자리가 바뀌는 곳에 있다(㉳)
        const step = d.pick([10, 100]), top = d.int(4, 6), s = step === 10 ? d.int(1, 9) * 1000 + d.int(1, 8) * 100 + top * 10 : d.int(1, 8) * 1000 + top * 100 + d.int(1, 9) * 10;
        const all = range(0, 7).map((j) => s + step * j), miss = 10 - top + d.pick([-1, 0, 1]), seen = all.filter((_, j) => j !== miss), shown = d.shuffle(seen.concat([null]));
        return N(`${s}부터 ${step}씩 커지는 수를 카드 8장에 하나씩 썼다. 카드를 섞었더니 한 장이 뒤집혔다. 뒤집힌 카드(?)에 쓴 수는?`, all[miss], {
          figure: numbers(shown.map((v) => (v === null ? box('?') : v))), explain: `차례대로 놓으면 ${all.map((v, j) => (j === miss ? '□' : v)).join(', ')}이다. ${all[miss - 1]}에서 ${step}만큼 뛰어 센 ${josa(all[miss], '이/가')} 빠졌다.`,
          facts: { calc: [[`${s}*8+${step}*28-(${seen.join('+')})`, 0]], unseen: [28] }
        });
      }, { standard: ORDER }),
      H('h-save-months', '몇 월부터 몇 월까지 저금한 돈', '37, 기본 ①56', (d) => {
        // ① 「3월부터 6월까지」는 네 번이다. 6 - 3 = 3번으로 세는 아이가 틀린다(㉶)
        const have = d.int(1, 3) * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10, m1 = d.int(2, 7), times = d.int(4, 5), m2 = m1 + times - 1;
        return N(`저금통에 ${have}원이 있다. ${m1}월부터 ${m2}월까지 달마다 1000원씩 넣는다. ${m2}월에 넣은 뒤 저금통의 돈은 얼마인가?`, have + 1000 * times, {
          unit: '원', explain: `${range(m1, m2).map((m) => m + '월').join(', ')}로 ${times}번 넣는다. ${have}에서 1000씩 ${times}번 뛰어 세면 ${range(1, times).map((j) => have + 1000 * j).join(', ')}이다.`,
          facts: { calc: [[`${have}+1000*(${m2}-${m1}+1)`, 0]], unseen: [1] }
        });
      }, { standard: ORDER }),
      H('h-save-until', '값을 넘을 때까지 뛰어 세기', '38', (d) => {
        // ② 1000씩 뛰어 센 수마다 물건값과 비교한다. 천의 자리 숫자만 보고 달 수를 정하는 아이는 백의 자리에서 모자라는 것을 놓친다(㉴)
        const have = d.int(2, 4) * 1000 + d.int(1, 8) * 100 + d.int(1, 9) * 10, k = d.int(3, 4), price = d.until(() => d.int(30, 99) * 100, (v) => v > have + 1000 * (k - 1) && v < have + 1000 * k);
        const seq = range(1, k).map((j) => have + 1000 * j);
        return N(`지금 ${have}원이 있다. 다음 달부터 한 달에 1000원씩 모은다. ${price}원짜리 장난감을 사려면 적어도 몇 달 동안 모아야 하는가?`, k, {
          unit: '달', explain: `${have}에서 1000씩 뛰어 세면 ${seq.join(', ')}이다. ${josa(seq[k - 2], '은/는')} ${price}보다 작고 ${josa(seq[k - 1], '은/는')} ${price}보다 크다. ${k}달 동안 모아야 한다.`,
          facts: { calc: [[`(${price}-${have}+1000-(${price}-${have})%1000)/1000`, 0]] }
        });
      }, { standard: ORDER }),
      H('h-save-step', '처음과 나중의 돈으로 뛰어 센 크기 찾기', '기본 ①57', (d) => {
        // ② 몇 번 뛰어 세었는지와 어느 자리 숫자가 얼마나 커졌는지를 함께 읽는다
        const step = d.pick([1000, 100]), k = d.int(3, 5), have = step === 1000 ? d.int(1, 9 - k) * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10 : d.int(1, 9) * 1000 + d.int(1, 9 - k) * 100 + d.int(1, 9) * 10, end = have + step * k, p = step === 1000 ? 3 : 2;
        return N(`저금통에 ${have}원이 있었다. ${k}달 동안 달마다 같은 돈을 넣었더니 ${end}원이 되었다. 한 달에 얼마씩 넣었는가?`, step, {
          unit: '원', explain: `${PLACES[p]}의 자리 숫자가 ${digitAt(have, p)}에서 ${josa(digitAt(end, p), '으로/로')} ${k}만큼 커졌다. ${k}번 뛰어 세어 ${k}만큼 커졌으므로 한 번에 ${step}씩 뛰어 세었다.`,
          facts: { calc: [[`(${end}-${have})/${k}`, 0]] }
        });
      }, { standard: ORDER }),
      H('h-forms-order', '다르게 나타낸 세 수의 차례', '45', (d) => {
        // ② 세 수를 모두 수로 고친 뒤 비교한다. 「100이 19개」는 1900으로 바꾸어야 하고(㉰), 고친 두 수는 십의 자리나 일의 자리에서 갈린다(㉴)
        const a = d.int(4, 8), c = d.int(2, 8), mid = (a - 1) * 1000 + 900 + c * 10, w = mid + d.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]), small = d.bool();
        const t1 = bundles([a - 2, 19, c, 0]), t2 = bundles([0, a * 10, 0, 0]), rows = d.shuffle([[say(w), String(w), w], [t1, bundleExpr(t1), mid], [t2, bundleExpr(t2), a * 1000]]), vals = rows.map((row) => row[2]);
        const right = [0, 1, 2].sort((p, q) => (small ? vals[p] - vals[q] : vals[q] - vals[p])), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
        return C(`${small ? '작은' : '큰'} 수부터 차례로 기호를 쓴 것은?`, list.map((o) => o.map((k) => LABELS[k]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
          figure: tagged(rows.map((row) => row[0])), explain: `100이 19개이면 1900이므로 ${t1}는 ${mid}이다. 100이 ${a * 10}개인 수는 ${a * 1000}이다. 수로 쓰면 ㉠은 ${vals[0]}, ㉡은 ${vals[1]}, ㉢은 ${vals[2]}이다.`,
          facts: { rule: 'forms', choose: { exprs: rows.map((row) => row[1]), rule: small ? 'ascending' : 'descending', orders: list }, big: { shown: [[say(w), w]] } }
        });
      }, { standard: ORDER }),
      H('h-box-count', '□가 백의 자리에 있는 수의 비교', '48, 기본 ①69', (d) => {
        // ② 천의 자리 숫자가 같음을 보고 → 백의 자리 숫자를 비교하고 → □ 안의 수가 그 숫자와 같을 때는 십의 자리까지 본다(㉴)
        const a = d.int(1, 9), v = d.int(3, 6), [p, q] = d.until(() => [d.int(10, 99), d.int(0, 99)], ([x, y]) => Math.floor(x / 10) !== Math.floor(y / 10));
        const known = `${a}${v}${p}`, boxed = `${a}□${String(q).padStart(2, '0')}`, less = d.bool(), flip = d.bool(), fill = (x) => Number(boxed.replace('□', x));      // less: □가 든 수가 더 작다
        const [left, op, right] = flip ? [known, less ? '>' : '<', boxed] : [boxed, less ? '<' : '>', known], fits = range(0, 9).filter((x) => (less ? fill(x) < Number(known) : fill(x) > Number(known)));
        return N('0부터 9까지의 숫자 중에서 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', fits.length, {
          unit: '개', figure: lines([`${left.replace('□', box())} ${op === '<' ? '&lt;' : '&gt;'} ${right.replace('□', box())}`]),
          explain: `천의 자리 숫자가 같다. □ 안에 ${josa(v, '을/를')} 넣으면 ${josa(fill(v), '은/는')} ${known}보다 ${fill(v) > Number(known) ? '크다' : '작다'}. ${fits.includes(v) ? `${v}도 들어갈 수 있다` : `${josa(v, '은/는')} 들어갈 수 없다`}. ${fits.join(', ')}${after(String(fits[fits.length - 1]), '으로/로')} ${fits.length}개이다.`,
          facts: { rule: 'hundreds', big: { boxed: { left, right, op, ask: 'count' } } }
        });
      }, { standard: ORDER }),
      H('h-cards-zero', '0이 있는 수 카드로 가장 작은 수 만들기', '기본 ①70', (d) => {
        // ① 0을 맨 앞에 놓아 세 자리 수를 만드는 아이가 틀린다(㉵)
        const digits = d.shuffle([0].concat(uniq(d, 3))), made = arrange(digits)[0], s = digits.slice().sort((p, q) => p - q);
        return N('수 카드 4장을 한 번씩만 써서 네 자리 수를 만들려고 한다. 가장 작은 수는?', made, {
          figure: cards(digits), explain: `0은 천의 자리에 놓을 수 없다. 천의 자리에 0이 아닌 가장 작은 수 ${josa(s[1], '을/를')} 놓고, 백의 자리에 0, 남은 자리에 작은 수부터 차례로 놓는다. ${made}이다.`,
          facts: { rule: 'zero', big: { cardsMake: { digits, rule: 'min' } } }
        });
      }, { standard: ORDER }),
      H('h-cards-fixed-min', '한 자리를 정해 놓고 가장 작은 수 만들기', '기본 ①71', (d) => {
        // ② 정해진 자리에 카드를 놓고 → 천의 자리에는 0이 아닌 가장 작은 수를 놓고(㉵) → 남은 자리를 작은 수부터 채운다
        const digits = d.shuffle([0].concat(uniq(d, 3))), k = d.int(0, 2), t = d.pick(digits.filter((v) => v !== 0)), made = arrange(digits).filter((v) => digitAt(v, k) === t)[0];
        return N(`수 카드 4장을 한 번씩만 써서 ${PLACES[k]}의 자리 숫자가 ${t}인 네 자리 수를 만들려고 한다. 가장 작은 수는?`, made, {
          figure: cards(digits), explain: `${PLACES[k]}의 자리에 ${josa(t, '을/를')} 놓는다. 0은 천의 자리에 놓을 수 없으므로 천의 자리에 ${josa(digitAt(made, 3), '을/를')} 놓고, 남은 자리에 작은 수부터 차례로 놓는다. ${made}이다.`,
          facts: { big: { cardsMake: { digits, rule: 'min', fixed: [[pow(k), t]] } } }
        });
      }, { standard: ORDER })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
