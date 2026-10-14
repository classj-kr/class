// 3학년 1학기 4단원 곱셈 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(40개 문서)에 나온
// 문제 꼴 69개를 하나씩 따져 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
//
// 고른 기준
//  - 곱셈 한 번으로 끝나는 문제와 식마다 계산해 견주는 문제는 기본 문항으로 보냈다(3-1-4a.js).
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 방향만 뒤집은 꼴도 한 번만 싣는다
//    (가장 큰 곱 ↔ 가장 작은 곱, 곱한 뒤 전체에서 빼기 ↔ 묶음 전체에서 덜기, 합한 뒤 곱하기 ↔ 뺀 뒤 곱하기,
//     두 묶음의 합은 「바퀴 수의 합」으로, 두 묶음의 차는 「누가 몇 쪽 더」로, 빈칸 하나인 세로셈은 빈칸 둘인 세로셈으로).
//  - 서술형(식 쓰기, 틀린 까닭 쓰기, 문제 만들기)은 싣지 않는다.
//  - 아래는 뺐다.
//      뒤 학기 것이 있어야 풀리는 것: 곱에서 곱해지는 수를 거꾸로 찾아야 하는 것(자리를 바꾼 수에 3을 곱했더니 105,
//        □×9=90×4, ●÷2=10 — 곱셈구구를 넘는 나눗셈), 「적어도 몇 상자」(나머지가 있는 나눗셈), 초를 분·초로 바꾸기
//      곱셈보다 조건 풀이가 어려움의 대부분인 것: 간격 수(가로등), 자르는 횟수, 겹쳐 이어 붙인 길이, 요일·달 수 세기,
//        약속한 기호, 합·차 조건으로 수 찾기, 규칙 찾기, 빈칸 둘이 맞물린 부등식, 곱이 기준에 가까운 두 수를 여섯 가지 다 따져 고르기,
//        카드 네 장에서 세 장을 뽑아 만들기, 곱보다 작은 가장 큰 자연수·두 곱 사이의 수 세기(곱셈은 한두 번이고 나머지는 조건 읽기),
//        곱셈을 쓰지 않아도 답이 나오는 「남은 것끼리의 차」
// 실력 문항의 잣대(2026-10-12): 어려움은 이 단원에서 배운 뜻을 정확히 아는가에서 나와야 한다. 맨 앞의 문항들이 그런 문항이다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, column, chars, cards, tagged, N, M, C, E, mulPair, mulCarries, MUL } = B.kit;
  const CALC = '4수01-04';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const times = (a, b) => expr(a, '*', b, '=', a * b);
  const factorings = (p) => [2, 3, 4, 5, 6, 7, 8, 9].filter((b) => p % b === 0 && p / b >= 11 && p / b <= 99).map((b) => [p / b, b]);
  // 곱이 정한 수 가까이에 오는 (몇십몇)×(몇)
  const near = (d, center, spread) => d.until(() => { const list = factorings(center + d.int(-spread, spread)).filter(([x]) => x % 10 !== 0); return list.length ? d.pick(list) : null; }, Boolean);

  B.addGroup('3-1-4', {
    id: 'hard', title: '실력 문제', standard: CALC,
    types: [
      H('h-onemore', '곱셈의 뜻으로 같은 값 찾기', '나타내는 수가 다른 하나(기본·심화 자료) — 곱하는 수가 1 커지면 곱해지는 수만큼 커짐을 가리게', (d) => {
        // 23×4 에 23 을 더한 수 = 23×5
        const [a, b] = mulPair(d, (c, x, y) => MUL.any(c, x) && y >= 3 && y <= 8 && x >= 13);
        const list = d.shuffle([[`${a} × ${b + 1}`, E(a, '*', b + 1)], [`${a + 1} × ${b}`, E(a + 1, '*', b)], [`${a} × ${b - 1}`, E(a, '*', b - 1)], [`${a - 1} × ${b + 1}`, E(a - 1, '*', b + 1)]]);
        return C(`${a} × ${b}에 ${josa(a, '을/를')} 더한 수와 계산 결과가 같은 것은?`, list.map(([said]) => said), list.findIndex(([, text]) => text === E(a, '*', b + 1)), {
          explain: `${a} × ${josa(b, '은/는')} ${josa(a, '을/를')} ${b}번 더한 수이다. 여기에 ${josa(a, '을/를')} 한 번 더 더하면 ${josa(a, '을/를')} ${b + 1}번 더한 수이므로 ${expr(a, '*', b + 1)}의 값과 같다.`,
          facts: { choose: { exprs: list.map(([, text]) => text), rule: 'equals', target: a * b + a } }
        });
      }),
      H('h-nearest', '기준 수에 가장 가까운 곱', 'YBM·동아·디딤돌·지학사 단원평가 심화', (d) => {
        // 100에 가장 가까운 것: ㉠ 23×4 ㉡ 16×6 ㉢ 17×6 ㉣ 18×5
        const target = d.pick([100, 200, 300]);
        const rows = d.until(() => [near(d, target, 28), near(d, target, 28), near(d, target, 28), near(d, target, 28)], (list) => {
          const gaps = list.map(([x, y]) => Math.abs(x * y - target)).sort((p, q) => p - q);
          return gaps[0] >= 1 && gaps[0] <= 9 && gaps[1] > gaps[0] && new Set(list.map(([x]) => x)).size === 4 && list.some(([x, y]) => x * y > target) && list.some(([x, y]) => x * y < target);
        });
        const gaps = rows.map(([x, y]) => Math.abs(x * y - target));
        return C(`계산 결과가 ${target}에 가장 가까운 것은?`, LABELS, gaps.indexOf(Math.min(...gaps)), {
          figure: tagged(rows.map(([x, y]) => expr(x, '*', y))), explain: rows.map(([x, y], i) => `${LABELS[i]} ${times(x, y)}`).join(', ') + `이다. ${target}과의 차가 가장 작은 것을 고른다.`,
          facts: { choose: { exprs: rows.map(([x, y]) => E(x, '*', y)), rule: 'nearest', target } }
        });
      }),
      H('h-blanks', '빈칸이 둘인 세로셈', '비상 단원평가 실력 · YBM·동아·디딤돌·미래엔·아이스크림·지학사 단원평가 심화', (d) => {
        // 3□×8=3□4 → 38×8=304
        const fits = (t, b, h, o) => { const out = []; for (let x = 0; x <= 9; x += 1) for (let y = 0; y <= 9; y += 1) if ((t * 10 + x) * b === h * 100 + y * 10 + o) out.push([x, y]); return out; };
        const [a, b] = mulPair(d, (c, x, y) => MUL.both(c) && x % 10 >= 2 && y >= 3 && fits(Math.floor(x / 10), y, Math.floor((x * y) / 100), (x * y) % 10).length === 1);
        const p = a * b, t = Math.floor(a / 10), x = a % 10, y = Math.floor(p / 10) % 10;
        return M('세로셈에서 ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: x }, { label: LABELS[1], answer: y }], {
          figure: column([String(t), box(LABELS[0])], '*', [String(b)], [String(Math.floor(p / 100)), box(LABELS[1]), String(p % 10)]),
          explain: `㉠ × ${b}의 일의 자리 숫자가 ${josa(p % 10, '이/가')} 되는 경우를 찾아 곱이 맞는지 확인한다. ${times(a, b)}이므로 ㉠은 ${x}, ㉡은 ${y}이다.`,
          facts: { mulMasks: { a: `${t}?`, b: String(b), p: `${Math.floor(p / 100)}?${p % 10}` } }
        });
      }),
      H('h-fits', '□에 들어갈 수 있는 가장 큰 수', '비상 차시별 심화 · YBM·디딤돌·아이스크림 단원평가 심화', (d) => {
        // 24×□<98 → 4
        const a = d.until(() => d.int(13, 48), (v) => v % 10 !== 0), k = d.int(3, 7), limit = a * k + d.int(2, a - 2);
        return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 가장 큰 수는?', k, {
          figure: expr(a, '*', box(), '<i>&lt;</i>', limit), explain: `${times(a, k)}, ${times(a, k + 1)}이므로 □ 안에 들어갈 수 있는 가장 큰 수는 ${k}이다.`,
          facts: { digit: { template: `${a}*□<${limit}`, lo: 1, hi: 9, ask: 'max' } }
        });
      }),
      H('h-wrong', '잘못 계산한 어떤 수', '비상 차시별 심화 · 동아·지학사 단원평가 심화 · 디딤돌 서술형', (d) => {
        // 어떤 수에 3을 곱할 것을 더했더니 76 → 73×3=219
        const [x, b] = mulPair(d, (c, p, q) => MUL.any(c, p) && (c[0] || c[1]) && q >= 3);
        return N(`어떤 수에 ${josa(b, '을/를')} 곱해야 할 것을 잘못하여 ${josa(b, '을/를')} 더하였더니 ${josa(x + b, '이/가')} 되었다. 바르게 계산한 값은?`, x * b, {
          explain: `어떤 수는 ${expr(x + b, '-', b, '=', x)}이다. 바르게 계산하면 ${times(x, b)}이다.`, facts: { calc: [[`(${x + b}-${b})*${b}`, 0]] }
        });
      }),
      H('h-plus', '기준량과 그 몇 배의 합', '비상 차시별 심화 · YBM 단원심화평가', (d) => {
        // 11분과 그 4배 → 모두 55분
        const [a, b] = mulPair(d, (c, x, y) => MUL.any(c, x) && c[0] && y <= 6 && x <= 58), who = d.pick(NAMES);
        return N(`${name(who, '은/는')} 딱지를 ${a}장 가지고 있고, 형은 ${who}의 ${b}배만큼 가지고 있다. 두 사람이 가지고 있는 딱지는 모두 몇 장인가?`, a * b + a, {
          unit: '장', explain: `형이 가지고 있는 딱지는 ${times(a, b)}(장)이다. ${expr(a * b, '+', a, '=', a * b + a)}`, facts: { calc: [[`${a}*${b}+${a}`, 0]] }
        });
      }),
      H('h-wheels', '글에 숨은 수를 곱한 두 곱의 합', '디딤돌 단원평가 심화·서술형 · 천재 단원평가 심화', (d) => {
        // 두발자전거 38대와 승용차 46대의 바퀴 → 38×2+46×4
        const [a, b] = d.until(() => [d.int(26, 48), d.int(17, 33)], ([x, y]) => mulCarries(x, 2)[0] && mulCarries(y, 3)[0] && x !== y);
        return N(`두발자전거 ${a}대와 세발자전거 ${b}대가 있다. 자전거의 바퀴는 모두 몇 개인가?`, a * 2 + b * 3, {
          unit: '개', explain: `두발자전거의 바퀴는 ${times(a, 2)}(개), 세발자전거의 바퀴는 ${times(b, 3)}(개)이다. ${expr(a * 2, '+', b * 3, '=', a * 2 + b * 3)}`,
          facts: { calc: [[`${a}*2+${b}*3`, 0]], unseen: [2, 3] }
        });
      }),
      H('h-who', '두 묶음을 견주어 누가 얼마나 더', '비상 차시별 심화 · YBM·미래엔·아이스크림 단원평가 심화 · 디딤돌·지학사 서술형', (d) => {
        // 감자 35개씩 7상자, 고구마 28개씩 9상자 → 고구마, 7개
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [[a, b], [c, e]] = d.until(() => [mulPair(d, MUL.any), mulPair(d, MUL.any)], ([p, q]) => {
          const gap = Math.abs(p[0] * p[1] - q[0] * q[1]);
          return gap >= 3 && gap <= 40 && p[0] !== q[0] && p[1] !== q[1] && (p[0] > q[0]) !== (p[0] * p[1] > q[0] * q[1]) && (mulCarries(p[0], p[1])[0] || mulCarries(q[0], q[1])[0]);
        });
        const values = [a * b, c * e], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 10], [1 - winner, gap + 10]]);
        return C(`${name(one, '은/는')} 책을 하루에 ${a}쪽씩 ${b}일 동안 읽었고, ${name(two, '은/는')} 하루에 ${c}쪽씩 ${e}일 동안 읽었다. 누가 몇 쪽 더 많이 읽었는가?`, list.map(([who, n]) => `${[one, two][who]}, ${n}쪽`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${name(one, '은/는')} ${times(a, b)}(쪽), ${name(two, '은/는')} ${times(c, e)}(쪽)을 읽었다. ${name([one, two][winner], '이/가')} ${expr(Math.max(...values), '-', Math.min(...values), '=', gap)}(쪽) 더 많이 읽었다.`,
          facts: { who: { values, options: list, exprs: [E(a, '*', b), E(c, '*', e)] } }
        });
      }),
      H('h-left', '전체에서 묶음을 뺀 나머지', 'YBM·지학사 단원평가 심화 · 동아·디딤돌 서술형', (d) => {
        // 도넛 140개를 27개씩 5상자에 담으면 남는 것
        const [a, b] = mulPair(d, MUL.both), rest = d.int(4, 38);
        return N(`구슬 ${a * b + rest}개를 한 봉지에 ${a}개씩 ${b}봉지에 담았다. 봉지에 담고 남은 구슬은 몇 개인가?`, rest, {
          unit: '개', explain: `봉지에 담은 구슬은 ${times(a, b)}(개)이다. ${expr(a * b + rest, '-', a * b, '=', rest)}`, facts: { calc: [[`${a * b + rest}-${a}*${b}`, 0]] }
        });
      }),
      H('h-together', '합한 뒤 곱하기', '천재 서술형 평가 · 디딤돌 서술형 · YBM 수학익힘 심화', (d) => {
        // 1반 24명, 2반 27명 모두에게 4장씩
        const [a, b, k] = d.until(() => [d.int(12, 48), d.int(12, 48), d.int(3, 8)], ([x, y, z]) => x !== y && x + y <= 96 && (x + y) % 10 !== 0 && MUL.both(mulCarries(x + y, z)));
        return N(`버스에 어른 ${a}명과 어린이 ${b}명이 탔다. 버스에 탄 모든 사람에게 사탕을 ${k}개씩 나누어 주려면 사탕은 모두 몇 개 필요한가?`, (a + b) * k, {
          unit: '개', explain: `버스에 탄 사람은 ${expr(a, '+', b, '=', a + b)}(명)이다. ${times(a + b, k)}`, facts: { calc: [[`(${a}+${b})*${k}`, 0]] }
        });
      }),
      H('h-twice', '두 번 곱하기', '천재 단원평가 심화·서술형 · 디딤돌 서술형 · YBM 단원심화평가', (d) => {
        // 22명씩 4개 반, 한 사람이 6장씩 → 528장
        const [a, b, k] = d.until(() => [d.int(11, 32), d.int(2, 4), d.int(3, 8)], ([x, y, z]) => x * y <= 98 && (x * y) % 10 !== 0 && x % 10 !== 0 && y !== z && mulCarries(x * y, z)[0]);
        return N(`화분이 한 줄에 ${a}개씩 ${b}줄로 놓여 있다. 화분마다 꽃이 ${k}송이씩 피었다면 꽃은 모두 몇 송이인가?`, a * b * k, {
          unit: '송이', explain: `화분은 ${times(a, b)}(개)이다. ${times(a * b, k)}`, facts: { calc: [[`${a}*${b}*${k}`, 0]] }
        });
      }),
      H('h-cards', '수 카드로 만드는 가장 큰 곱', '비상 차시별 심화 · YBM·동아 단원평가 심화 · 아이스크림 서술형', (d) => {
        // 3, 6, 8 → 63×8=504
        const list = d.shuffle(d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3)), [low, mid, high] = list.slice().sort((p, q) => p - q);
        return N('수 카드 3장을 한 번씩만 사용하여 (몇십몇) × (몇)의 곱셈식을 만들려고 한다. 만들 수 있는 가장 큰 곱은?', (mid * 10 + low) * high, {
          figure: cards(list), explain: `가장 큰 수 ${josa(high, '을/를')} 곱하는 수로 하고, 남은 두 수로 더 큰 두 자리 수 ${josa(mid * 10 + low, '을/를')} 만든다. ${times(mid * 10 + low, high)}`,
          facts: { mulCards: list }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
