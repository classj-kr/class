// 3학년 1학기 1단원 덧셈과 뺄셈 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(41개 문서)에 나온
// 문제 꼴 129개를 하나씩 따져 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
//
// 고른 기준
//  - 그 자료에서 쉬운 문제(한 번 계산하면 끝나는 것)와 기본 자료에도 두루 나오는 문제는 기본 문항으로 보냈다(3-1-1a.js).
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 덧셈·뺄셈만 뒤집은 꼴도 한 번만 싣는다.
//    (합·차만 바꾼 묶음 수 문제, 더할 것을 뺀 것과 뺄 것을 더한 것, 등식의 □ 자리만 바꾼 것 따위)
//  - 서술형(식 쓰기, 까닭 쓰기, 풀이 과정 쓰기)은 싣지 않는다. 답만 물을 수 있는 것은 답만 묻는다.
//  - 아래는 뺐다.
//      안 배운 것이 있어야 풀리는 것: 새 연산 기호를 약속하는 문제(가★나=가+나), 환율 표,
//        등호 양쪽이 같아지는 □(831-243=□+181 — 4학년 2학기 「관계와 규칙」의 등식)
//      계산보다 조건 풀이가 어려움의 대부분인 것: 양쪽에 기준이 있는 □(1024<□86+538<1424), 양쪽에 식이 있는 □ 범위(285+615<910-□),
//        찢어진 카드의 수 알아맞히기, 자리 조건이 겹친 수 카드(십의 자리가 0인 수 중 두 번째로 작은 수 …),
//        합이 어떤 수에 가장 가까운 두 수 찾기, 쉼터 문제(필요 없는 수가 섞임)
//      다른 꼴을 이어 붙였을 뿐인 것: 잘못된 계산을 고친 뒤 다시 더하기, 가려진 숫자를 찾은 뒤 더하기, 단위를 바꾸어 어림한 뒤 판단하기
// 실력 문항은 묶음마다 한두 문제뿐이어서 단원 끝의 「실력 문제」 한 묶음에 모았다. 차례는 배우는 차례를 따른다.
// 실력 문항의 잣대(2026-10-12): 어려움은 이 단원에서 배운 뜻을 정확히 아는가에서 나와야 한다. 맨 앞의 문항들이 그런 문항이다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { carryPlaces, borrowPlaces, count, plain, josa, name, nick, NAMES, LABELS, box, expr, column, chars, cards, chain, table, route, tapes, tagged, numbers, N, M, C, E, addPair, subPair, pairNear, ADD, SUB, result, shown } = B.kit;
  const CALC = '4수01-03';
  const three = (d, lo, hi) => d.until(() => d.int(lo, hi), plain);
  // 서로 gap 넘게 떨어진 세 자리 수 여러 개
  const apart = (d, howMany, lo, hi, gap) => d.until(() => Array.from({ length: howMany }, () => d.int(lo, hi)), (xs) => xs.every(plain) && xs.every((x, i) => xs.every((y, j) => i === j || Math.abs(x - y) >= gap)));
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});

  B.addGroup('3-1-1', {
    id: 'hard', title: '실력 문제', standard: CALC,
    types: [
      H('h-carry-say', '받아올림한 수가 나타내는 값 가리기', '받아올림한 수가 나타내는 값(기본 자료) — 두 자리의 받아올림을 한 그림에서 가리게', (d) => {
        // 백의 자리 위에 작게 쓴 1 은 100, 십의 자리 위에 작게 쓴 1 은 10 을 나타낸다.
        const [a, b] = addPair(d, (c, x, y) => ADD.twice(c) && x + y <= 990), ones = (a % 10) + (b % 10), tens = 1 + (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10);
        const slip = d.bool();     // 어느 자리의 설명을 틀리게 할지
        const rows = d.shuffle([
          { text: `일의 자리 계산은 ${a % 10} + ${b % 10} = ${ones}이다.`, ok: true },
          { text: `십의 자리 위에 작게 쓴 1은 ${slip ? 1 : 10}${slip ? '을' : '을'} 나타낸다.`, ok: !slip },
          { text: `백의 자리 위에 작게 쓴 1은 ${slip ? 100 : 10}을 나타낸다.`, ok: slip },
          { text: `십의 자리 계산 1 + ${Math.floor(a / 10) % 10} + ${Math.floor(b / 10) % 10} = ${tens}${josa(tens, '은/는').slice(String(tens).length)} 실제로 ${josa(tens * 10, '을/를')} 나타낸다.`, ok: true }
        ]);
        return C(`${a} + ${josa(b, '을/를')} 세로로 계산하였다. 계산에 대한 설명으로 옳지 않은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
          figure: column(chars(a), '+', chars(b), chars(a + b), ['1', '1', '']),
          explain: `십의 자리 위에 작게 쓴 1은 일의 자리에서 받아올림한 10이고, 백의 자리 위에 작게 쓴 1은 십의 자리에서 받아올림한 100이다.`,
          facts: { truth: rows.map((row) => row.ok), want: false, pair: [a, '+', b] }
        });
      }),
      // ── 덧셈 ──
      H('h-digit', '□에 들어갈 수 있는 가장 큰 수', 'YBM 수학익힘유사 문제(심화) 02 · 지학사 단원평가 실력', (d) => {
        // 2□6+532<754 꼴. 받아올림이 없는 덧셈이 되게 수를 고른다.
        const h = d.int(1, 4), o = d.int(1, 8), t = d.int(2, 7);
        const b = d.until(() => d.int(210, 580), (x) => plain(x) && (x % 10) + o < 10 && (Math.floor(x / 10) % 10) + t < 10 && Math.floor(x / 100) + h < 10);
        const edge = h * 100 + t * 10 + o, s = edge + b;
        const list = Array.from({ length: t }, (_, i) => i).join(', ');
        return N('0부터 9까지의 수 중 □ 안에 들어갈 수 있는 가장 큰 수는?', t - 1, {
          figure: expr(`${h}${box()}${o}`, '+', b, '<i>&lt;</i>', s),
          explain: `${shown(s, '-', b)}이므로 ${h}□${josa(o, '은/는')} ${edge}보다 작아야 한다. □ 안에 들어갈 수 있는 수는 ${list}이고, 그중 가장 큰 수는 ${t - 1}이다.`,
          facts: { digit: { template: `${h}□${o}+${b}<${s}`, lo: 0, hi: 9, ask: 'max' } }
        });
      }),
      H('h-compose', '묶음의 수로 나타낸 두 수의 합', '비상 차시별 심화 문제 · YBM·디딤돌·미래엔·아이스크림·지학사·천재 심화', (d) => {
        // 한 수는 10이 열 개를 넘고, 다른 수는 1이 열 개를 넘는다(100이 4개, 10이 14개, 1이 6개인 수 …).
        const [x, y] = d.until(() => [three(d, 215, 680), three(d, 125, 480)], ([p, q]) => Math.floor(p / 10) % 10 <= 8 && q % 10 <= 8 && Math.floor(q / 10) % 10 >= 1 && p + q <= 999 && ADD.any(carryPlaces(p, q)));
        const px = [Math.floor(x / 100) - 1, Math.floor(x / 10) % 10 + 10, x % 10];
        const py = [Math.floor(y / 100), Math.floor(y / 10) % 10 - 1, y % 10 + 10];
        const say = ([h, t, o]) => [[100, h], [10, t], [1, o]].filter((p) => p[1] > 0).map(([unit, n]) => `${josa(unit, '이/가')} ${n}개`).join(', ') + '인 수';
        return N('㉠과 ㉡이 나타내는 수의 합은?', x + y, {
          figure: tagged([say(px), say(py)]),
          explain: `㉠은 ${x}, ㉡은 ${y}이다. ` + shown(x, '+', y),
          facts: { compose: [px, py], composeOp: '+' }
        });
      }),
      H('h-more', '더 많은 쪽을 구해 모두 더하기', '비상 차시별 심화 문제 · YBM·디딤돌·지학사', (d) => {
        // 작년 778개, 올해는 128개 더 많이 → 작년과 올해 모두
        const [a, k] = d.until(() => [three(d, 320, 780), three(d, 110, 290)], ([p, q]) => p + q <= 999 && ADD.any(carryPlaces(p, q)) && ADD.many(carryPlaces(p, p + q)));
        return N(`어느 박물관에 지난달에는 ${a}명이 다녀갔고, 이번 달에는 지난달보다 ${k}명 더 많이 다녀갔다. 두 달 동안 이 박물관에 다녀간 사람은 모두 몇 명인가?`, a + a + k, {
          unit: '명', explain: `이번 달에 다녀간 사람은 ${shown(a, '+', k)}(명)이다. ` + expr(a, '+', a + k, '=', a + a + k),
          facts: { calc: [[`${a}+(${a}+${k})`, 0]] }
        });
      }),

      // ── 뺄셈 ──
      H('h-range', '□에 들어갈 수 있는 가장 큰 세 자리 수', '비상 차시별 심화 문제 · YBM 수학익힘유사 문제(심화) 05', (d) => {
        // 658-□>234 꼴. 받아내림이 없는 뺄셈으로 경계가 나온다.
        const [a, c] = subPair(d, (bw, x, y) => SUB.none(bw) && x - y >= 150), v = a - c;
        return N('□ 안에 들어갈 수 있는 수 중 가장 큰 세 자리 수는?', v - 1, {
          figure: expr(a, '-', box(), '<i>&gt;</i>', c),
          explain: `${expr(a, '-', box(), '=', c)}일 때 □는 ${expr(a, '-', c, '=', v)}이다. ${a}에서 빼는 수가 작을수록 차가 커지므로 □는 ${v}보다 작아야 한다. 가장 큰 세 자리 수는 ${v - 1}이다.`,
          facts: { range: { ineq: `${a}-x>${c}`, want: 'max', lo: 100, hi: 999 } }
        });
      }),
      H('h-detour', '들러 가는 길과 바로 가는 길', 'YBM 수학익힘유사 문제(심화) 05 · 디딤돌 문장제 서술형', (d) => {
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [a, b, c] = d.until(() => [three(d, 210, 520), three(d, 130, 420), three(d, 250, 760)], ([p, q, r]) => p + q <= 999 && r >= Math.max(p, q) + 20 && p + q - r >= 60 && SUB.none(borrowPlaces(p + q, r)) && plain(p + q));
        return N(`${name(one, '과/와')} ${name(two, '은/는')} 수영장에서 만나기로 하였다. ${name(one, '은/는')} 집에서 출발하여 놀이터에 들렀다가 수영장으로 가고, ${name(two, '은/는')} 같은 집에서 바로 수영장으로 간다. 두 사람이 가는 거리의 차는 몇 m인가?`, a + b - c, {
          unit: 'm', figure: route([['집', 0, 100], ['놀이터', 50, 0, false], ['수영장', 100, 100]], [[0, 1, a + ' m'], [1, 2, b + ' m'], [0, 2, c + ' m', 10]], 66),
          explain: `놀이터에 들렀다 가는 거리는 ${shown(a, '+', b)}(m)이다. ` + shown(a + b, '-', c),
          facts: { calc: [[`${a}+${b}-${c}`, 0]] }
        });
      }),
      H('h-after', '계산 결과보다 더 작은 수', 'YBM 수학익힘유사 문제(심화) 06', (d) => {
        // 573-348의 결과보다 182 작은 수
        const [a, b] = subPair(d, (bw, x, y) => SUB.once(bw) && x - y >= 210), c = d.until(() => d.int(105, a - b - 25), plain);
        return N(`다음 식의 계산 결과보다 ${c}만큼 더 작은 수는?`, a - b - c, {
          figure: expr(a, '-', b), explain: `${shown(a, '-', b)}, ${shown(a - b, '-', c)}`,
          facts: { calc: [[`${a}-${b}-${c}`, 0]] }
        });
      }),
      H('h-tape', '겹치게 이어 붙인 길이', 'YBM 수학익힘유사 문제(심화) 06 · YBM 단원심화평가 · 디딤돌 단원평가(심화)', (d) => {
        // 443 cm 리본 2개를 108 cm만큼 겹치게
        const [a, k] = d.until(() => [three(d, 310, 480), three(d, 105, 190)], ([p, q]) => count(borrowPlaces(p + p, q)) >= 1);
        return N(`길이가 ${a} cm인 종이띠 2장을 ${k} cm만큼 겹치게 이어 붙였다. 이어 붙인 종이띠의 전체 길이는 몇 cm인가?`, a + a - k, {
          unit: 'cm', figure: tapes(a + ' cm', a + ' cm', k + ' cm'),
          explain: `종이띠 2장의 길이의 합은 ${shown(a, '+', a)}(cm)이다. 겹친 부분은 한 번만 세어야 하므로 ${shown(a + a, '-', k)}`,
          facts: { calc: [[`${a}+${a}-${k}`, 0]] }
        });
      }),
      H('h-sumdiff', '합과 한 수를 알 때 두 수의 차', 'YBM 단원심화평가 · 디딤돌 문장제 서술형', (d) => {
        // 두 수의 합이 711, 한 수는 416 → 다른 수 295, 차 121
        const [a, b] = d.until(() => subPair(d, SUB.any), ([x, y]) => ADD.any(carryPlaces(x, y)) && x + y <= 999 && x - y >= 30);
        const known = d.pick([a, b]);
        return N(`수 카드 2장에 적힌 두 수의 합은 ${a + b}이다. 한 장에 적힌 수가 ${known}일 때, 두 수의 차는?`, a - b, {
          explain: `다른 한 수는 ${shown(a + b, '-', known)}이다. ` + shown(a, '-', b),
          facts: { sumDiff: [a + b, known] }
        });
      }),
      H('h-wrong', '잘못 계산한 어떤 수', '비상 차시별 심화 문제 · YBM·동아·아이스크림·천재 심화', (d) => {
        // 어떤 수에서 265를 빼야 할 것을 잘못하여 더했더니 788
        const [x, b] = subPair(d, (bw, p, q) => SUB.twice(bw) && q >= 120 && p - q >= 60 && p + q <= 999), c = x + b;
        return N(`어떤 수에서 ${josa(b, '을/를')} 빼야 하는데 잘못하여 더했더니 ${josa(c, '이/가')} 되었다. 바르게 계산한 값은?`, x - b, {
          explain: `어떤 수는 ${shown(c, '-', b)}이다. 바르게 계산하면 ${shown(x, '-', b)}이다.`,
          facts: { calc: [[`${c}-${b}-${b}`, 0]] }
        });
      }),
      H('h-twice', '두 번 덜어 내고 남은 것', '미래엔 단원평가 심화', (d) => {
        // 900에서 450을 덜고 다시 240을 던다
        const who = d.pick(NAMES), total = d.pick([700, 800, 900]);
        const [p, q] = d.until(() => [three(d, 210, 380), three(d, 120, 260)], ([x, y]) => total - x - y >= 110);
        return N(`${name(who, '은/는')} 구슬을 ${total}개 가지고 있다. 동생에게 ${p}개를 주고 친구에게 ${q}개를 주었을 때, ${nick(who)}에게 남은 구슬은 몇 개인가?`, total - p - q, {
          unit: '개', explain: `${shown(total, '-', p)}, ${shown(total - p, '-', q)}`,
          facts: { calc: [[`${total}-${p}-${q}`, 0]] }
        });
      }),

      // ── 덧셈과 뺄셈 ──
      H('h-near', '어떤 수에 가장 가까운 계산 결과', 'YBM 단원심화평가', (d) => {
        // 600에 가장 가까운 것: ㉠ 217+387 ㉡ 739-129 ㉢ 184+418
        const target = d.pick([400, 500, 600, 700]);
        const rows = d.until(() => d.shuffle(['+', '+', '-'].map((op) => [op, pairNear(d, op, target - 25, target + 25)])), (list) => {
          const gaps = list.map(([op, [a, b]]) => Math.abs(result(a, op, b) - target)), s = gaps.slice().sort((p, q) => p - q);
          return s[0] >= 1 && s[0] <= 9 && s[1] - s[0] >= 2;
        });
        const gaps = rows.map(([op, [a, b]]) => Math.abs(result(a, op, b) - target));
        return C(`계산 결과가 ${target}에 가장 가까운 것은?`, LABELS.slice(0, 3), gaps.indexOf(Math.min(...gaps)), {
          figure: tagged(rows.map(([op, [a, b]]) => expr(a, op, b))),
          explain: rows.map(([op, [a, b]], i) => `${LABELS[i]} ${shown(a, op, b)}`).join(', ') + `이다. ${josa(target, '과/와')}의 차는 차례로 ${gaps.join(', ')}이다.`,
          facts: { choose: { exprs: rows.map(([op, [a, b]]) => E(a, op, b)), rule: 'nearest', target } }
        });
      }),
      H('h-chainback', '거꾸로 계산하여 빈칸 채우기', 'YBM 단원심화평가', (d) => {
        // □ -378 → □ +267 → 937
        const [x, b] = subPair(d, (bw, p, q) => SUB.any(bw) && p - q >= 120), mid = x - b;
        const c = d.until(() => d.int(120, 985 - mid), (v) => plain(v) && ADD.any(carryPlaces(mid, v))), end = mid + c;
        return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: x }, { label: LABELS[1], answer: mid }], {
          figure: chain([box(LABELS[0]), '-' + b, box(LABELS[1]), '+' + c, end]),
          explain: `㉡은 ${shown(end, '-', c)}, ㉠은 ${shown(mid, '+', b)}이다.`,
          facts: { calc: [[`${end}-${c}+${b}`, 0], [`${end}-${c}`, 1]] }
        });
      }),
      H('h-ends', '가장 큰 수와 가장 작은 수의 합에서 나머지 빼기', '지학사 서술형평가', (d) => {
        // 196, 753, 579 → (753+196)-579
        const xs = d.until(() => apart(d, 3, 160, 790, 40), (list) => { const s = list.slice().sort((p, q) => p - q); return s[0] + s[2] <= 999 && ADD.any(carryPlaces(s[0], s[2])) && SUB.any(borrowPlaces(s[0] + s[2], s[1])); });
        const s = xs.slice().sort((p, q) => p - q);
        return N('세 수 중 가장 큰 수와 가장 작은 수의 합에서 나머지 한 수를 뺀 값은?', s[2] + s[0] - s[1], {
          figure: numbers(xs), explain: `${shown(s[2], '+', s[0])}, ${shown(s[2] + s[0], '-', s[1])}`,
          facts: { ends3: xs }
        });
      }),
      H('h-cards', '0이 든 수 카드로 만든 수의 차', '지학사 단원평가 실력 · 비상 단원 평가 실력 문제 · 디딤돌·미래엔 심화', (d) => {
        // 0, 1, 3, 4, 7 → 743-103
        const digits = d.shuffle([0, ...d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)]);
        const s = digits.slice().sort((p, q) => q - p);   // 큰 숫자부터, 맨 끝이 0
        const big = s[0] * 100 + s[1] * 10 + s[2], least = s[3] * 100 + s[2];
        return N('수 카드 5장 중 3장을 골라 한 번씩만 사용하여 세 자리 수를 만든다. 만들 수 있는 가장 큰 수와 가장 작은 수의 차는?', big - least, {
          figure: cards(digits),
          explain: `가장 큰 수는 ${big}이다. 0은 백의 자리에 쓸 수 없으므로 가장 작은 수는 ${least}이다. ` + shown(big, '-', least),
          facts: { cardSpec: { digits, which: 'max-min' } }
        });
      }),
      H('h-three', '차례로 정해지는 세 양의 합', '지학사 단원평가 실력', (d) => {
        // ㉮ 516개, ㉯는 138개 더 적게, ㉰는 ㉯보다 189개 더 많이 → 모두
        const a = three(d, 420, 640), b = three(d, 110, 190), c = three(d, 130, 240), second = a - b, third = second + c;
        return N(`㉮, ㉯, ㉰ 세 마을에 나무를 심었다. ㉮ 마을에는 ${a}그루를 심었고, ㉯ 마을에는 ㉮ 마을보다 ${b}그루 더 적게, ㉰ 마을에는 ㉯ 마을보다 ${c}그루 더 많이 심었다. 세 마을에 심은 나무는 모두 몇 그루인가?`, a + second + third, {
          unit: '그루', explain: `㉯ 마을에는 ${shown(a, '-', b)}(그루), ㉰ 마을에는 ${shown(second, '+', c)}(그루)를 심었다. ${expr(a, '+', second, '+', third, '=', a + second + third)}`,
          facts: { calc: [[`${a}+(${a}-${b})+(${a}-${b}+${c})`, 0]] }
        });
      }),
      H('h-school', '합친 뒤 나가고 들어온 수', '지학사 단원평가 실력', (d) => {
        // 348+291-115+107: 더하고, 빼고, 더한다
        const a = three(d, 260, 420), b = three(d, 240, 410), c = three(d, 105, 160), e = d.until(() => three(d, 102, 150), (v) => v !== c);
        return N(`수영장에 남자 ${a}명과 여자 ${b}명이 있었다. 잠시 뒤 ${c}명이 나가고 ${e}명이 새로 들어왔다. 지금 수영장에 있는 사람은 모두 몇 명인가?`, a + b - c + e, {
          unit: '명', explain: `${shown(a, '+', b)}, ${shown(a + b, '-', c)}, ${shown(a + b - c, '+', e)}`,
          facts: { calc: [[`${a}+${b}-${c}+${e}`, 0]] }
        });
      }),
      H('h-table', '표에서 묶음마다 합을 구해 견주기', '디딤돌 문장제 서술형 · 지학사 단원평가 실력', (d) => {
        // 두 사람의 수 둘씩(125·243, 186·245) → 합이 큰 쪽이 얼마나 더 많은가
        const [one, two] = d.shuffle(NAMES).slice(0, 2);
        const [a, b, c, e] = d.until(() => apart(d, 4, 112, 290, 5), ([p, q, r, s]) => Math.abs(p + q - r - s) >= 15 && (p > r) !== (q > s));
        const x = a + b, y = c + e;
        return N(`${name(one, '과/와')} ${name(two, '이/가')} 오전과 오후에 딴 딸기의 수를 나타낸 표이다. 하루 동안 딸기를 더 많이 딴 사람은 다른 사람보다 몇 개 더 많이 땄는가?`, Math.abs(x - y), {
          unit: '개', figure: table(['', '오전', '오후'], [[one, a + '개', b + '개'], [two, c + '개', e + '개']]),
          explain: `${name(one, '은/는')} ${shown(a, '+', b)}(개), ${name(two, '은/는')} ${shown(c, '+', e)}(개)를 땄다. ` + shown(Math.max(x, y), '-', Math.min(x, y)),
          facts: { sums: [[a, b], [c, e]] }
        });
      }),
      H('h-three-rows', '표에서 세 항목을 골라 더하기', 'YBM 서술형평가', (d) => {
        // 표의 값 285, 218, 217, 27, 69 가운데 셋(세 자리 수 둘, 두 자리 수 하나)을 골라 더한다
        const food = ['색연필', '풀', '지우개', '클립', '스티커'];
        const xs = [three(d, 240, 320), three(d, 180, 260), three(d, 190, 260), d.int(21, 38), d.int(52, 88)];
        const eaten = d.shuffle([0, 1, 2]).slice(0, 2).sort((p, q) => p - q).concat([d.pick([3, 4])]);
        const total = eaten.reduce((sum, i) => sum + xs[i], 0);
        return N(`문구점의 물건값을 나타낸 표이다. ${food[eaten[0]]}, ${food[eaten[1]]}, ${josa(food[eaten[2]], '을/를')} 한 개씩 살 때, 내야 하는 돈은 모두 얼마인가?`, total, {
          unit: '원', figure: table(['물건', '값(원)'], food.map((label, i) => [label, xs[i]])),
          explain: `${shown(xs[eaten[0]], '+', xs[eaten[1]])}, ${shown(xs[eaten[0]] + xs[eaten[1]], '+', xs[eaten[2]])}`,
          facts: { calc: [[eaten.map((i) => xs[i]).join('+'), 0]] }
        });
      }),
      H('h-rest', '합계에서 나머지 항목을 빼기', '비상 단원 평가 실력 문제', (d) => {
        // 합계 982, 두 항목 10과 123 → 나머지 한 항목
        const total = three(d, 720, 990), bus = d.int(12, 48), truck = three(d, 105, 190);
        return N('어느 과일 가게에서 하루 동안 판 과일의 수를 나타낸 표이다. 이날 판 사과는 몇 개인가?', total - bus - truck, {
          unit: '개', figure: table(['과일', '판 수(개)'], [['사과', box()], ['감', bus], ['귤', truck], ['합계', total]]),
          explain: `감과 귤은 모두 ${shown(bus, '+', truck)}(개)이다. ` + shown(total, '-', bus + truck),
          facts: { calc: [[`${total}-(${bus}+${truck})`, 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
