// 2학년 2학기 2단원 곱셈구구 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「3개씩 5묶음」은 3 × 5 로만 쓸 수 있다고 여긴다(5 × 3 도, 3 을 다섯 번 더한 식도 같은 수이다). 거꾸로 3 + 5 를 같은 수로 보기도 한다.
//  - 곱하는 수가 1 커지면 곱이 1(또는 곱하는 수만큼) 커진다고 여긴다(단의 수만큼 커진다). 2 커지면 단의 수의 2배만큼 커진다.
//  - 7 × 6 을 「7 × 5 에 6 을 더한다」고 한다(7 을 더해야 한다).
//  - 0 × 1 = 1, 7 × 0 = 7 이라고 한다. □ × 1 = 6 의 □ 를 1 이라고 한다.
//  - 한 묶음의 수가 글에 숫자로 없으면(세발자전거, 삼각형의 변) 곱할 수를 찾지 못한다. 글에 적힌 수를 모두 곱하거나 더한다(쓰지 않는 수).
//  - 곱해야 할 것을 더한다(6개씩 7봉지를 6 + 7).
// 실력 문항의 잣대: ① 상황·그림의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제, ② 두 번 넘게 생각해야 풀리는 문제.
// 기본에서 하는 일을 고르기로 바꾼 것은 싣지 않았다. 보기가 있는 문항은 보기마다 「어떤 아이가 고르는가」를 주석으로 달았다.
// 빼거나 기본으로 보낸 것은 2-2-2a.js 머리에 적었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, expr, lines, tagged, cards, N, M, C, E } = B.kit;
  const { UNIT, CALC, WORD, L5, FACTS, MULTI, THINGS, range, times, labelled, product, setOptions, pairOptions, packs, arr, mtable } = B.kit.g222;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LT = '<i>&lt;</i>';

  B.addGroup(UNIT, {
    id: 'hard', title: '단원 종합', standard: CALC,
    types: [
      // ── ① 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('h-allforms', '그림의 수를 나타낸 식 모두 고르기', '심5 심4', (d) => {
        // 3개씩 5묶음: 3 × 5, 5 × 3, 3 + 3 + 3 + 3 + 3 은 모두 맞고 3 + 5, 5 × 5 는 틀리다.
        const [a, n] = d.until(() => [d.int(3, 6), d.int(3, 6)], ([x, y]) => x !== y), thing = d.pick(THINGS), sum = Array.from({ length: n }, () => a);
        const rows = d.shuffle([
          { key: 'as', html: expr(a, '*', n), value: a * n },
          { key: 'swap', html: expr(n, '*', a), value: n * a },
          { key: 'add', html: '<span class="mb-expr">' + sum.join(' <i>+</i> ') + '</span>', value: sum.reduce((s, v) => s + v, 0) },
          { key: 'plus', html: expr(a, '+', n), value: a + n },
          { key: 'square', html: expr(n, '*', n), value: n * n }
        ]);
        const at = (key) => rows.findIndex((row) => row.key === key), flags = rows.map((row) => row.value === a * n);
        const made = setOptions(d, L5, flags, [
          [at('as'), at('add')],                          // 두 수를 바꾼 곱셈식은 다른 수라고 여기는 아이
          [at('as'), at('swap')],                         // 곱셈식만 고르고, 같은 수를 거듭 더한 식은 곱셈과 다르다고 여기는 아이
          [at('as'), at('swap'), at('add'), at('plus')]   // 두 수를 더한 식도 같은 수라고 여기는 아이
        ]);
        return C(`그림의 ${thing.what} 수를 바르게 나타낸 식을 모두 고른 것은?`, made.options, made.answer, {
          figure: packs(a, n, thing) + tagged(rows.map((row) => row.html), L5),
          explain: `${a}개씩 ${n}묶음이므로 ${times(a, n)}(개)이다. 두 수를 바꾸어 곱한 식도, ${josa(a, '을/를')} ${n}번 더한 식도 ${josa(a * n, '을/를')} 나타낸다. ${expr(a, '+', n, '=', a + n)}, ${times(n, n)}이므로 나머지 둘은 아니다.`,
          facts: { sets: { labels: L5, flags, options: made.sets } }
        });
      }),
      H('h-regroup', '같은 그림을 다른 단의 곱셈식으로', '심7 심6', (d) => {
        // 8개씩 3묶음 → 4 × □. 틀리기 쉬운 답: 3(묶음 수를 그대로 둠), 12(한 묶음의 수와 묶음 수를 모두 바꿈)
        const a = d.pick([2, 3, 4]), r = d.until(() => d.int(2, 4), (v) => v !== a);
        return N(`그림의 구슬 수는 ${2 * a} × ${r}이다. □ 안에 알맞은 수는?`, 2 * r, {
          figure: arr(r, 2 * a, { loop: 'rows' }) + lines([`같은 구슬을 ${a}개씩 묶으면 ${a} × ${box()}이다.`]),
          explain: `${2 * a}개 한 묶음을 ${a}개씩 묶으면 2묶음이 된다. ${r}묶음이 모두 그렇게 되므로 ${a}개씩 ${2 * r}묶음이다. ${times(2 * a, r)}, ${times(a, 2 * r)}`,
          facts: { calc: [[`${2 * a}*${r}/${a}`, 0]] }
        });
      }),
      H('h-hidden', '한 묶음의 수가 글에 없는 문장제', '심43 ①56', (d) => {
        // 곱할 수(3, 4)를 스스로 대야 한다. 「1주일은 7일」은 2-2-4에서 배우므로 쓰지 않는다.
        const n = d.int(3, 9);
        const [text, size, unit, why] = d.pick([
          [`세발자전거 ${n}대의 바퀴는 모두 몇 개인가?`, 3, '개', '세발자전거 한 대의 바퀴는 3개이다.'],
          [`삼각형 ${n}개를 서로 떨어뜨려 그렸다. 삼각형의 변은 모두 몇 개인가?`, 3, '개', '삼각형 한 개의 변은 3개이다.'],
          [`사각형 ${n}개를 서로 떨어뜨려 그렸다. 사각형의 꼭짓점은 모두 몇 개인가?`, 4, '개', '사각형 한 개의 꼭짓점은 4개이다.']
        ]);
        return N(text, size * n, { unit, explain: `${why} ${times(size, n)}`, facts: { calc: [[E(size, '*', n), 0]], unseen: [size] } });
      }, { standard: WORD }),
      H('h-wrongway', '곱을 구하는 방법으로 옳지 않은 것', '①24 심23', (d) => {
        const [a, b, k] = d.until(() => { const y = d.int(5, 8); return [d.int(6, 9), y, d.int(2, y - 2)]; }, ([x, y, v]) => x !== y && v * 2 !== y);
        const good = d.shuffle([
          [`${josa(a, '을/를')} ${b}번 더한다.`, Array.from({ length: b }, () => a).join('+')],                       // 곱셈의 뜻
          [`${a} × ${b - 1}에 ${josa(a, '을/를')} 더한다.`, `${a}*${b - 1}+${a}`],                                      // 앞의 곱에 단의 수를 더함
          [`${a} × ${josa(k, '과/와')} ${a} × ${josa(b - k, '을/를')} 더한다.`, `${a}*${k}+${a}*${b - k}`]            // 두 곱으로 가름
        ].concat(b % 2 === 0 ? [[`${a} × ${josa(b / 2, '을/를')} 두 번 더한다.`, `${a}*${b / 2}+${a}*${b / 2}`]] : [])).slice(0, 3);
        // 틀린 방법: 앞의 곱에 단의 수가 아니라 곱하는 수를 더한다 — 「곱하는 수가 1 커지면 곱하는 수만큼 커진다」고 여기는 아이는 이것을 옳다고 본다.
        const bad = [`${a} × ${b - 1}에 ${josa(b, '을/를')} 더한다.`, `${a}*${b - 1}+${b}`];
        const rows = d.shuffle(good.concat([bad]));
        return C(`${a} × ${josa(b, '을/를')} 구하는 방법으로 옳지 않은 것은?`, rows.map(([said]) => said), rows.indexOf(bad), {
          explain: `${a} × ${josa(b, '은/는')} ${josa(a, '을/를')} ${b}번 더한 수이다. ${a} × ${b - 1}에는 ${josa(a, '을/를')} 더해야 한다. ${josa(b, '을/를')} 더하면 ${expr(a * (b - 1), '+', b, '=', a * (b - 1) + b)}이고, 이것은 ${josa(a * b, '과/와')} 다르다.`,
          facts: { claimed: rows.map(([, text]) => [text, a * b]), claimedWant: false }
        });
      }),
      H('h-twomore', '곱하는 수가 2(3) 커질 때 곱이 커지는 수', '①19', (d) => {
        // 틀리기 쉬운 답: 단의 수(한 번만 더함), 2(곱하는 수가 커진 만큼)
        const a = d.int(3, 9), j = d.pick([2, 2, 3]), b = d.int(2, 9 - j);
        return N(`${a} × ${b}에 얼마를 더하면 ${a} × ${josa(b + j, '이/가')} 되는가?`, a * j, {
          explain: `곱하는 수가 ${j} 커지면 ${josa(a, '을/를')} ${j}번 더 더한 것이다. ${times(a, b)}, ${times(a, b + j)}이므로 ${a * j}만큼 더 크다.`,
          facts: { calc: [[`${a}*${b + j}-${a}*${b}`, 0]] }
        });
      }),
      H('h-oddzero', '0의 곱과 1의 곱이 섞인 식에서 곱이 다른 하나', '①40 심33', (d) => {
        const a = d.int(2, 9);
        const rows = d.shuffle([
          [0, a],                          // 0 × 7 = 7 이라고 여기는 아이가 고른다
          [a, 0],                          // 7 × 0 = 7 이라고 여기는 아이가 고른다
          d.bool() ? [0, 1] : [1, 0],      // 0 × 1 = 1 이라고 여기는 아이가 고른다(나머지를 모두 0 또는 7로 보고)
          d.bool() ? [a, 1] : [1, a]       // 맞는 답: 곱이 7
        ]), values = rows.map(product);
        return C('곱이 나머지 셋과 다른 것은?', rows.map(([x, y]) => `${x} × ${y}`), values.findIndex((v) => v !== 0), {
          explain: '0과 어떤 수의 곱은 항상 0이고, 1과 어떤 수의 곱은 그 수 그대로이다. ' + rows.map(([x, y]) => times(x, y)).join(', '),
          facts: { truth: values.map((v) => v === 0), want: false }
        });
      }),
      H('h-onezero', '1의 곱과 0의 곱이 섞인 식의 □', '①38 심32 심34', (d) => {
        // □ × 1 = 6 의 □ 는 6 이고(1 이 아니다), □ × 1 = 0 의 □ 는 0 이다(1 이 아니다).
        const [a, b, c] = d.shuffle(range(2, 9)).slice(0, 3);
        const rows = d.shuffle([
          { html: (blank) => expr(blank, '*', 1, '=', a), answer: a, text: `${a}/1` },
          { html: (blank) => expr(blank, '*', b, '=', b), answer: 1, text: `${b}/${b}` },
          { html: (blank) => expr(c, '*', blank, '=', 0), answer: 0, text: `0/${c}` },
          { html: (blank) => expr(blank, '*', 1, '=', 0), answer: 0, text: '0/1' }
        ]);
        return M('㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled(rows.map((row) => row.answer)), {
          figure: lines(rows.map((row, i) => row.html(box(L5[i])))),
          explain: '어떤 수와 1의 곱은 그 수 그대로이고, 어떤 수와 0의 곱은 항상 0이다. ' + rows.map((row, i) => `${L5[i]} ${row.answer}`).join(', '),
          facts: { parts: rows.map((row, i) => [row.text, i]) }
        });
      }),
      H('h-samecells', '곱셈표에서 곱이 같은 칸 모두 찾기', '①46 심38', (d) => {
        // 두 수를 바꾼 칸만 세면 모자란다(12 는 2 × 6, 6 × 2, 3 × 4, 4 × 3).
        const cells = (hs, v) => hs.reduce((list, r) => list.concat(hs.filter((c) => r * c === v).map((c) => [r, c])), []);
        const [heads, p] = d.until(() => [d.shuffle([2, 3, 4, 6, 8, 9]).slice(0, 5).sort((x, y) => x - y), d.pick(MULTI)], ([hs, v]) => cells(hs, v).length >= 3);
        const found = cells(heads, p), flags = heads.reduce((list, r) => list.concat(heads.map((c) => r * c === p)), []);
        return N(`곱셈표의 빈칸을 모두 채울 때, 곱이 ${p}인 칸은 모두 몇 칸인가?`, found.length, {
          unit: '칸', figure: mtable(heads, heads, () => ''), explain: `곱이 ${p}인 곱셈구구는 ${found.map(([r, c]) => `${r} × ${c}`).join(', ')}이다.`,
          facts: { count: flags }
        });
      }),
      H('h-addfix', '곱해야 할 것을 더한 잘못 바로잡기', '①58 심47', (d) => {
        // 어떤 수에 b를 곱해야 하는데 더했다: □ + b = s → □ = s − b, 바른 값은 □ × b. 잘못 계산한 값 s에 b를 곱하거나, 어떤 수를 구하고 멈추는 아이가 틀린다.
        const [a, b] = d.pick(FACTS.filter(([x, y]) => x >= 3 && y >= 4 && x !== y && x + y >= 11));
        return N(`어떤 수에 ${josa(b, '을/를')} 곱해야 할 것을 잘못하여 더하였더니 ${josa(a + b, '이/가')} 되었다. 바르게 계산한 값은?`, a * b, {
          explain: `어떤 수에 ${josa(b, '을/를')} 더하여 ${josa(a + b, '이/가')} 되었으므로 어떤 수는 ${expr(a + b, '-', b, '=', a)}이다. 바르게 계산하면 ${times(a, b)}`,
          facts: { calc: [[`(${a + b}-${b})*${b}`, 0]] }
        });
      }),
      H('h-extra', '쓰지 않는 수가 섞인 문장제', '①51 심42', (d) => {
        // 가게에 있는 봉지 수(m)는 쓰지 않는다. 틀리기 쉬운 답: a × m(적힌 수를 앞에서부터 곱함)
        const a = d.int(3, 9), n = d.int(3, 7), m = d.int(n + 1, 9), who = d.pick(NAMES);
        return N(`가게에 한 봉지에 ${a}개씩 든 사탕이 ${m}봉지 있다. ${name(who, '은/는')} 그 가운데 ${n}봉지를 샀다. ${name(who, '이/가')} 산 사탕은 모두 몇 개인가?`, a * n, {
          unit: '개', explain: `산 것은 ${a}개씩 ${n}봉지이다. ${times(a, n)}`, facts: { calc: [[E(a, '*', n), 0]] }
        });
      }, { standard: WORD }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('h-left', '전체에서 곱한 만큼 덜어 내기', '심45 ①54', (d) => {
        const [a, b] = d.pick(FACTS.filter(([x, y]) => x >= 3 && y >= 3 && x !== y && x * y >= 20)), all = Math.ceil((a * b + 6) / 10) * 10 + d.pick([0, 10]), who = d.pick(NAMES);
        return N(`${name(who, '은/는')} ${all}쪽인 책을 하루에 ${a}쪽씩 ${b}일 동안 읽었다. 남은 쪽수는 몇 쪽인가?`, all - a * b, {
          unit: '쪽', explain: `읽은 쪽수는 ${times(a, b)}(쪽)이다. ${expr(all, '-', a * b, '=', all - a * b)}(쪽)`, facts: { calc: [[`${all}-${a}*${b}`, 0]] }
        });
      }, { standard: WORD }),
      H('h-lump', '덩어리 그림의 수를 구하는 방법 모두 고르기', '①27', (d) => {
        // 위쪽 r1 줄은 c1 개씩, 아래쪽 r2 줄은 c2 개씩인 그림
        const [c1, r1, c2, r2] = d.until(() => { const x = d.int(5, 8); return [x, d.int(2, 4), d.int(2, x - 2), d.int(2, 3)]; }, ([x, , y, v]) => (x - y) * v <= 9);
        const all = r1 + r2, gone = (c1 - c2) * r2, total = c1 * r1 + c2 * r2, what = d.pick(['공', '구슬', '바둑돌']);
        const rows = d.shuffle([
          [`${c1} × ${josa(r1, '과/와')} ${c2} × ${josa(r2, '을/를')} 더한다.`, c1 * r1 + c2 * r2],   // 맞음: 위쪽과 아래쪽으로 나눔
          [`${c1} × ${all}에서 ${josa(gone, '을/를')} 뺀다.`, c1 * all - gone],                        // 맞음: 빈 곳을 채워 센 뒤 뺌
          [`${c1} × ${all}의 곱을 구한다.`, c1 * all],                                                 // 틀림: 빈 곳까지 센 아이
          [`${c2} × ${all}에 ${josa(c1 - c2, '을/를')} 더한다.`, c2 * all + (c1 - c2)]                 // 틀림: 옆으로 나온 줄 수(r1)를 곱하지 않은 아이
        ]);
        const flags = rows.map(([, value]) => value === total), made = pairOptions(d, LABELS, flags);
        return C(`${what}의 수를 구하는 방법으로 옳은 것을 모두 고른 것은?`, made.options, made.answer, {
          figure: arr(all, c1, { skip: (row, col) => row >= r1 && col >= c2, said: `위쪽 ${r1}줄은 한 줄에 ${c1}개씩, 아래쪽 ${r2}줄은 한 줄에 ${c2}개씩` }) + tagged(rows.map(([said]) => said)),
          explain: `위쪽은 ${times(c1, r1)}, 아래쪽은 ${times(c2, r2)}이므로 모두 ${total}개이다. 방법대로 셈하면 ` + rows.map(([, value], i) => `${LABELS[i]} ${value}`).join(', ') + '이다.',
          facts: { sets: { labels: LABELS, flags, options: made.sets } }
        });
      }),
      H('h-range', '□에 들어갈 수 있는 수', '①34 심29', (d, n) => {
        if (n === 0) {
          // 7 × □ < 33 → 1, 2, 3, 4
          const a = d.int(3, 9), q = d.int(2, 7), limit = a * q + d.int(1, a - 1);
          return N('1부터 9까지의 수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', q, {
            unit: '개', figure: expr(a, '*', box(), LT, limit), explain: `${times(a, q)}, ${times(a, q + 1)}이므로 □ 안에는 1부터 ${q}까지 들어갈 수 있다.`,
            facts: { digit: { template: `${a}*□<${limit}`, lo: 1, hi: 9, ask: 'count' } }
          });
        }
        // 7 × 2 < □ × 3 → 가장 작은 수는 5
        const [a, b, c, m] = d.until(() => { const [x, y] = d.pick(FACTS), z = d.int(2, 9); return [x, y, z, Math.floor((x * y) / z) + 1]; }, ([x, y, z, v]) => z !== x && z !== y && v >= 3 && v <= 9);
        return N('1부터 9까지의 수 가운데 □ 안에 들어갈 수 있는 가장 작은 수는?', m, {
          figure: expr(a, '*', b, LT, box(), '*', c), explain: `${times(a, b)}이다. ${times(c, m - 1)}, ${times(c, m)}이므로 곱이 ${a * b}보다 커지는 가장 작은 수는 ${m}이다.`,
          facts: { digit: { template: `${a}*${b}<□*${c}`, lo: 1, hi: 9, ask: 'min' } }
        });
      }, { count: 2 }),
      H('h-heads', '곱셈표의 가려진 머리 칸 찾기', '심40', (d) => {
        // ㉠은 첫째 세로줄에서, ㉡은 첫째 가로줄에서 따로 구해진다(한 칸을 알아야 다음 칸이 풀리는 꼴이 아니다).
        const cols = d.shuffle(range(2, 9)).slice(0, 3).sort((x, y) => x - y), rows = d.shuffle(range(2, 9)).slice(0, 3).sort((x, y) => x - y);
        return M('곱셈표에서 가려진 수 ㉠, ㉡에 알맞은 수는?', labelled([rows[1], cols[1]]), {
          figure: mtable(cols.map((c, j) => (j === 1 ? L5[1] : c)), rows.map((r, i) => (i === 1 ? L5[0] : r)), (i, j) => rows[i] * cols[j]),
          explain: `㉠ × ${cols[0]} = ${rows[1] * cols[0]}에서 ㉠에 알맞은 수는 ${rows[1]}이다. ${rows[0]} × ㉡ = ${rows[0] * cols[1]}에서 ㉡에 알맞은 수는 ${cols[1]}이다.`,
          facts: { calc: [[`${rows[1] * cols[0]}/${cols[0]}`, 0], [`${rows[0] * cols[1]}/${rows[0]}`, 1]] }
        });
      }),
      H('h-shared', '두 단의 곱셈구구에 함께 있는 수', '심9', (d) => {
        // 4단 곱셈구구의 값과 8단 곱셈구구의 값을 나란히 놓고 겹치는 수를 찾는다(8, 16, 24, 32).
        const [a, b] = d.pick([[2, 4], [3, 6], [4, 8], [3, 9], [2, 6], [2, 8]]), low = range(1, 9).map((k) => a * k), high = range(1, 9).map((k) => b * k);
        const both = low.filter((v) => high.includes(v));
        return N(`${a}단 곱셈구구에도 있고 ${b}단 곱셈구구에도 있는 수는 모두 몇 개인가?`, both.length, {
          unit: '개', explain: `${a}단 곱셈구구의 값은 ${low.join(', ')}이고, ${b}단 곱셈구구의 값은 ${high.join(', ')}이다. 두 단에 모두 있는 수는 ${both.join(', ')}이다.`,
          facts: { count: low.map((v) => v % b === 0 && v / b <= 9) }
        });
      }),
      H('h-cards', '수 카드 두 장으로 가장 큰 곱과 가장 작은 곱', '①62 심51', (d) => {
        // 0 이나 1 이 낀 카드: 가장 작은 곱은 0 × (어떤 수) = 0 또는 1 × (가장 작은 수)이다.
        const low = d.pick([0, 1]), list = d.shuffle([low].concat(d.shuffle(range(2, 9)).slice(0, 3)));
        const all = []; list.forEach((x, i) => list.forEach((y, j) => { if (i < j) all.push([x, y]); }));
        const by = all.slice().sort((p, q) => product(p) - product(q)), small = by[0], big = by[by.length - 1];
        return M('수 카드 4장 가운데 2장을 뽑아 두 수를 곱한다. 가장 큰 곱과 가장 작은 곱을 차례로 구하시오.', [{ label: '가장 큰 곱', answer: product(big) }, { label: '가장 작은 곱', answer: product(small) }], {
          figure: cards(list),
          explain: `가장 큰 두 수를 곱하면 ${times(Math.max(...big), Math.min(...big))}이다. ` + (low === 0 ? `0과 어떤 수의 곱은 0이므로 가장 작은 곱은 0이다.` : `가장 작은 두 수를 곱하면 ${times(Math.min(...small), Math.max(...small))}이다.`),
          facts: { calc: [[E(big[0], '*', big[1]), 0]], parts: [[E(small[0], '*', small[1]), 1]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
