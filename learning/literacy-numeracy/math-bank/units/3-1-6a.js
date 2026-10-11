// 3학년 1학기 6단원 분수와 소수 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 10종의 평가 자료(단원평가·형성평가·수학익힘·수행평가 262개 문서)에 나온 문제 꼴을 세 덩이로 나누어 모은
// 목록(기본꼴 1~3, 모두 222꼴)에서 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
//
// 고른 기준
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 견주기(>·=·<), 차례 세우기, □에 들어갈 수, 문장제는 분수·단위분수·소수마다
//    견주는 규칙이 달라 묶음마다 싣되 문장제의 얼개는 달리했다.
//  - 색칠하기·똑같이 나누어 그리기·전체 그리기처럼 손으로 그리는 활동과 까닭 쓰기는 싣지 않는다(고르는 꼴로 있는 것은 실었다).
//  - 분수는 모두 1보다 작은 분수이고 소수는 소수 첫째 자리까지다. 양의 분수(12의 1/3), 분수·소수의 덧셈과 뺄셈은 뒤 학기·뒤 학년 것이다.
//  - 두 단계 이상이거나 거꾸로 생각해야 하는 꼴은 실력 문항으로 보냈다(3-1-6b.js).
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, frac, lines, tagged, cards, pieces, squares, tenthLine, ruler, N, M, C, F, D } = B.kit;
  const G = B.kit.geo;
  const WHOLE = '4수01-09', UNITFRAC = '4수01-10', FCOMPARE = '4수01-11', DECIMAL = '4수01-12', DCOMPARE = '4수01-14';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // 토씨: 분수는 분자를 마지막에 읽고(8분의 3), 소수는 끝자리 숫자를 마지막에 읽는다.
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (k, n, pair) => frac(k, n) + tail(k, pair);
  const dj = (text, pair) => text + tail(Number(String(text).slice(-1)), pair);
  const kindOf = (d) => d.pick(['bar', 'circle']);
  const orderChoice = (d, values, labels, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };

  B.addUnit({
    id: '3-1-6', grade: 3, semester: 1, no: 6, title: '분수와 소수', version: 2,
    groups: [
      {
        id: 'equal', title: '똑같이 나누기', standard: WHOLE,
        types: [
          T('equal-pick', '똑같이 나눈 도형 고르기', '①1·2 ②1·2 ③1', (d) => {
            // 똑같이 넷으로 나눈 것: 조각 수가 다른 것, 크기가 다르게 나눈 것이 섞여 있다.
            const n = d.int(3, 6), other = d.pick([n - 1, n + 1].filter((v) => v >= 2)), kinds = [kindOf(d), kindOf(d), kindOf(d), kindOf(d)];
            const list = d.shuffle([[n, false], [n, true], [other, false], [other, true]]);
            return C(`똑같이 ${n}조각으로 나눈 도형은?`, LABELS, list.findIndex(([count, uneven]) => count === n && !uneven), {
              figure: G.tiles(list.map(([count, uneven], i) => [LABELS[i], pieces(kinds[i], count, { uneven, scale: 1.25 })])),
              explain: `조각의 크기와 모양이 모두 같고 조각이 ${n}개인 도형을 고른다.`, facts: { tilePick: { n, shaded: 0 } }
            });
          })
        ]
      },
      {
        id: 'frac', title: '분수 알기', standard: WHOLE,
        types: [
          T('frac-mean', '「전체를 똑같이 □로 나눈 것 중의 □」', '①7 ②7 ③6', (d) => {
            const [k, n] = d.until(() => [d.int(1, 7), d.int(3, 8)], ([x, y]) => x < y && x !== y - x);
            return M('색칠한 부분은 전체를 똑같이 ㉠조각으로 나눈 것 중의 ㉡조각이다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: k }], {
              figure: pieces(kindOf(d), n, { shaded: k }), explain: `전체를 똑같이 ${n}조각으로 나누었고 그중 ${k}조각을 색칠하였다.`, facts: { pieceRead: 'parts' }
            });
          }),
          T('frac-write', '색칠한 부분을 분수로 나타내기', '①9 ②8 ③8', (d) => {
            const [k, n] = d.until(() => [d.int(2, 7), d.int(4, 9)], ([x, y]) => x < y && gcd(x, y) === 1);
            return F('색칠한 부분은 전체의 몇 분의 몇인가?', k, n, {
              figure: pieces(kindOf(d), n, { shaded: k }), explain: `전체를 똑같이 ${n}조각으로 나눈 것 중의 ${k}조각이므로 ${fj(k, n, '이라고/라고')} 쓴다.`, facts: { pieceRead: 'shaded' }
            });
          }),
          T('frac-read', '분수 읽기', '①8·10 ②13 ③7·13', (d) => {
            const [k, n] = d.until(() => [d.int(2, 8), d.int(3, 9)], ([x, y]) => x < y && x !== y - x && gcd(x, y) === 1);
            const list = d.shuffle([[`${n}분의 ${k}`, true], [`${k}분의 ${n}`, false], [`${n}분의 ${n - k}`, false]]);
            return C(`${fj(k, n, '을/를')} 바르게 읽은 것은?`, list.map(([said]) => said), list.findIndex(([, ok]) => ok), {
              explain: `분모 ${josa(n, '을/를')} 먼저 읽고 분자 ${josa(k, '을/를')} 읽는다. ${n}분의 ${josa(k, '이라고/라고')} 읽는다.`,
              facts: { truth: list.map(([, ok]) => ok), want: true }
            });
          }, { standard: UNITFRAC }),
          T('frac-pick', '분수만큼 색칠한 도형 고르기', '①13 ②10 ③11', (d) => {
            // 전체의 3/8: 조각 수가 다른 것, 색칠한 수가 다른 것, 똑같이 나누지 않은 것이 섞여 있다.
            const [k, n] = d.until(() => [d.int(2, 5), d.int(4, 8)], ([x, y]) => x < y - 1 && gcd(x, y) === 1), kind = kindOf(d);
            const list = d.shuffle([[n, k, false], [n, k + 1, false], [n + 1, k, false], [n, k, true]]);
            return C(`전체의 ${frac(k, n)}만큼 색칠한 도형은?`, LABELS, list.findIndex(([count, on, uneven]) => count === n && on === k && !uneven), {
              figure: G.tiles(list.map(([count, on, uneven], i) => [LABELS[i], pieces(kind, count, { shaded: on, uneven, scale: 1.25 })])),
              explain: `전체를 똑같이 ${n}조각으로 나눈 것 중의 ${k}조각을 색칠한 도형을 고른다. 똑같이 나누지 않은 도형은 분수로 나타낼 수 없다.`, facts: { tilePick: { n, shaded: k } }
            });
          }),
          T('frac-rest', '남은 부분을 분수로 나타내기', '①15 ②15·67 ③14·15', (d) => {
            const [k, n] = d.until(() => [d.int(1, 6), d.int(4, 9)], ([x, y]) => x < y - 1 && gcd(y - x, y) === 1 && x !== y - x);
            return F(`호두파이 한 판을 똑같이 ${n}조각으로 자른 뒤 ${k}조각을 먹었다. 남은 호두파이는 전체의 몇 분의 몇인가?`, n - k, n, {
              explain: `남은 호두파이는 ${n - k}조각이다. 전체 ${n}조각 중의 ${n - k}조각이므로 ${frac(n - k, n)}이다.`, facts: { calc: [[`${n}-${k}`, 0], [String(n), 1]] }
            });
          }),
          T('frac-left', '분수만큼 먹고 남은 조각 수', '①69 ②68', (d) => {
            const [k, n] = d.until(() => [d.int(2, 6), d.int(5, 9)], ([x, y]) => x < y - 1 && gcd(x, y) === 1 && x !== y - x);
            return N(`초콜릿 한 개를 똑같이 ${n}조각으로 나누어 전체의 ${frac(k, n)}만큼 먹었다. 남은 초콜릿은 몇 조각인가?`, n - k, {
              unit: '조각', explain: `전체의 ${fj(k, n, '은/는')} ${n}조각 중의 ${k}조각이다. 남은 초콜릿은 ${n - k}조각이다.`, facts: { calc: [[`${n}-${k}`, 0]] }
            });
          }),
          T('frac-more', '몇 칸을 더 색칠해야 하는지 구하기', '①20 ②17', (d) => {
            const [k, t, n] = d.until(() => [d.int(1, 4), d.int(3, 8), d.int(5, 9)], ([x, y, z]) => x < y - 0 && y < z && y - x >= 2 && gcd(y, z) === 1);
            return N(`색칠한 부분이 전체의 ${fj(t, n, '이/가')} 되려면 몇 칸을 더 색칠해야 하는가?`, t - k, {
              unit: '칸', figure: pieces('bar', n, { shaded: k }), explain: `전체의 ${fj(t, n, '은/는')} ${n}칸 중의 ${t}칸이다. 지금 ${k}칸을 색칠하였으므로 ${t - k}칸을 더 색칠해야 한다.`, facts: { pieceRead: 'more', target: t }
            });
          }),
          T('frac-whole', '부분을 보고 전체 고르기', '①19 ②19 ③16', (d) => {
            // 작은 정사각형 하나가 전체의 1/4 → 정사각형 4개로 된 모양
            const n = d.int(3, 5), counts = d.shuffle([n, n - 1, n + 1, n + 2]);
            const shape = (count) => Array.from({ length: count }, (_, i) => (count <= 3 ? [i, 0] : [i % 3, Math.floor(i / 3)]));
            return C(`작은 정사각형 한 개가 전체의 ${frac(1, n)}일 때, 전체가 될 수 있는 모양은?`, LABELS, counts.indexOf(n), {
              figure: squares([[0, 0]], 1.4) + G.tiles(counts.map((count, i) => [LABELS[i], squares(shape(count), 1.4)])),
              explain: `${fj(1, n, '은/는')} 전체를 똑같이 ${n}조각으로 나눈 것 중의 1조각이다. 작은 정사각형 ${n}개로 된 모양이 전체이다.`, facts: { squarePick: n }
            });
          }),
          T('frac-unit-count', '단위분수가 몇 개인지 구하기', '①24 ②23 ③19', (d) => {
            const [k, n] = d.until(() => [d.int(2, 8), d.int(4, 12)], ([x, y]) => x < y && gcd(x, y) === 1);
            return N(`${fj(k, n, '은/는')} ${frac(1, n)}이 몇 개인 수인가?`, k, { unit: '개', explain: `${fj(k, n, '은/는')} ${frac(1, n)}이 ${k}개인 수이다.`, facts: { calc: [[String(k), 0]] } });
          }, { standard: UNITFRAC }),
          T('frac-unit-pick', '단위분수 세기', '①23 ②22 ③18', (d) => {
            // 3/4, 5/9, 1/8, 4/7, 1/2 가운데 단위분수
            const units = d.int(2, 3), list = d.until(() => d.shuffle(Array.from({ length: 5 }, (_, i) => { const n = d.int(3, 12); return [i < units ? 1 : d.int(2, n - 1), n]; })), (rows) => new Set(rows.map((r) => r.join('/'))).size === 5 && rows.every(([k, n]) => gcd(k, n) === 1));
            return N('단위분수는 모두 몇 개인가?', units, {
              unit: '개', figure: '<div class="mb-numbers">' + list.map(([k, n]) => '<span>' + frac(k, n) + '</span>').join('') + '</div>',
              explain: `분자가 1인 분수가 단위분수이다. 단위분수는 ${list.filter(([k]) => k === 1).map(([k, n]) => frac(k, n)).join(', ')}이다.`, facts: { fracList: list }
            });
          }, { standard: UNITFRAC })
        ]
      },
      {
        id: 'same', title: '분모가 같은 분수의 크기 비교', standard: FCOMPARE,
        types: [
          T('same-compare', '두 분수의 크기 비교', '①31 ②27 ③26', (d) => {
            const [a, b, n] = d.until(() => [d.int(1, 11), d.int(1, 11), d.int(5, 13)], ([x, y, z]) => x < z && y < z && x !== y);
            return C('두 분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, a > b ? 0 : 2, {
              figure: versus(frac(a, n), frac(b, n)), explain: `분모가 같은 분수는 분자가 클수록 크다. ${a > b ? a : b}${tail(a > b ? a : b, '이/가')} ${a > b ? b : a}보다 크다.`,
              facts: { choose: { exprs: [`${a}/${n}`, `${b}/${n}`], rule: 'compare' } }
            });
          }),
          T('same-order', '분수 여럿의 크기 비교', '①32·36 ②28·29 ③28·30', (d) => {
            // ㉠ 5/10 ㉡ 1/10이 7개인 수 ㉢ 8/10
            const n = d.int(7, 13), ks = d.shuffle(Array.from({ length: n - 2 }, (_, i) => i + 2)).slice(0, 3), worded = d.int(0, 2);
            const pick = orderChoice(d, ks, LABELS, true);
            return C('큰 수부터 차례대로 나열한 것은?', pick.options, pick.answer, {
              figure: tagged(ks.map((k, i) => (i === worded ? `${frac(1, n)}이 ${k}개인 수` : frac(k, n)))), explain: `${frac(1, n)}이 ${ks[worded]}개인 수는 ${frac(ks[worded], n)}이다. 분모가 같으므로 분자가 큰 수가 더 크다.`,
              facts: { choose: { exprs: ks.map((k) => `${k}/${n}`), rule: 'descending', orders: pick.list } }
            });
          }),
          T('same-fill', '□ 안에 들어갈 수 있는 분자', '①35 ③29', (d) => {
            const n = d.int(7, 13), b = d.int(4, n - 2);
            return N(`1부터 ${n - 1}까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?`, b - 1, {
              unit: '개', figure: `<span class="mb-expr">${frac(box(), n)} <i>&lt;</i> ${frac(b, n)}</span>`, explain: `분모가 같으므로 □는 ${b}보다 작은 수이다. 1부터 ${b - 1}까지 ${b - 1}개이다.`,
              facts: { digit: { template: `□/${n}<${b}/${n}`, lo: 1, hi: n - 1, ask: 'count' } }
            });
          }),
          T('same-word', '문장제: 분모가 같은 분수의 비교', '①71 ②64 ③61', (d) => {
            const n = d.int(7, 12), ks = d.shuffle(Array.from({ length: n - 2 }, (_, i) => i + 2)).slice(0, 3), colors = ['빨간색', '파란색', '노란색'];
            return C(`색 테이프의 길이가 빨간색은 ${frac(ks[0], n)}m, 파란색은 ${frac(ks[1], n)}m, 노란색은 ${frac(ks[2], n)}m이다. 가장 긴 색 테이프는?`, colors, ks.indexOf(Math.max(...ks)), {
              explain: `분모가 같으므로 분자가 가장 큰 ${frac(Math.max(...ks), n)}m가 가장 길다.`, facts: { choose: { exprs: ks.map((k) => `${k}/${n}`), rule: 'max' } }
            });
          })
        ]
      },
      {
        id: 'unit', title: '단위분수의 크기 비교', standard: FCOMPARE,
        types: [
          T('unit-compare', '두 단위분수의 크기 비교', '①38 ②33 ③33', (d) => {
            const [a, b] = d.until(() => [d.int(2, 15), d.int(2, 15)], ([x, y]) => x !== y);
            return C('두 단위분수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, a < b ? 0 : 2, {
              figure: versus(frac(1, a), frac(1, b)), explain: `단위분수는 분모가 작을수록 크다. ${a < b ? frac(1, a) : frac(1, b)}이 더 크다.`, facts: { choose: { exprs: [`1/${a}`, `1/${b}`], rule: 'compare' } }
            });
          }),
          T('unit-order', '단위분수 여럿의 크기 비교', '①39 ②34 ③34', (d) => {
            const ns = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]).slice(0, 3), pick = orderChoice(d, ns.map((n) => 1 / n), LABELS, false);
            return C('작은 수부터 차례대로 나열한 것은?', pick.options, pick.answer, {
              figure: tagged(ns.map((n) => frac(1, n))), explain: '단위분수는 분모가 클수록 작다. 분모가 큰 수부터 차례대로 쓴다.', facts: { choose: { exprs: ns.map((n) => `1/${n}`), rule: 'ascending', orders: pick.list } }
            });
          }),
          T('unit-fill', '□ 안에 들어갈 수 있는 분모', '①41 ②36 ③35', (d) => {
            const b = d.int(4, 8);
            return N('2부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', b - 2, {
              unit: '개', figure: `<span class="mb-expr">${frac(1, box())} <i>&gt;</i> ${frac(1, b)}</span>`, explain: `단위분수는 분모가 작을수록 크므로 □는 ${b}보다 작은 수이다. 2부터 ${b - 1}까지 ${b - 2}개이다.`,
              facts: { digit: { template: `1/□>1/${b}`, lo: 2, hi: 9, ask: 'count' } }
            });
          }),
          T('unit-word', '문장제: 단위분수의 비교', '①72 ②65 ③63', (d) => {
            const who = d.shuffle(NAMES).slice(0, 3), ns = d.shuffle([2, 3, 4, 5, 6, 8]).slice(0, 3);
            return C(`같은 크기의 떡을 ${name(who[0], '은/는')} 한 개의 ${frac(1, ns[0])}만큼, ${name(who[1], '은/는')} ${frac(1, ns[1])}만큼, ${name(who[2], '은/는')} ${frac(1, ns[2])}만큼 먹었다. 떡을 가장 많이 먹은 사람은?`, who, ns.indexOf(Math.min(...ns)), {
              explain: `단위분수는 분모가 작을수록 크다. ${frac(1, Math.min(...ns))}만큼 먹은 사람이 가장 많이 먹었다.`, facts: { choose: { exprs: ns.map((n) => `1/${n}`), rule: 'max' } }
            });
          }),
          T('unit-cards', '수 카드로 가장 큰 단위분수 만들기', '①42 ②39', (d) => {
            const list = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
            return N('수 카드 중 한 장을 골라 분자가 1인 분수를 만들려고 한다. 만들 수 있는 가장 큰 분수의 분모는?', Math.min(...list), {
              figure: cards(list), explain: `단위분수는 분모가 작을수록 크다. 분모를 가장 작은 수 ${josa(Math.min(...list), '으로/로')} 한다.`, facts: { minOf: list }
            });
          })
        ]
      },
      {
        id: 'deci', title: '소수 알기', standard: DECIMAL,
        types: [
          T('deci-convert', '분모가 10인 분수와 소수', '①44 ②43 ③37', (d) => {
            const [a, b] = d.until(() => [d.int(1, 9), d.int(1, 9)], ([x, y]) => x !== y);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a / 10, decimal: true }, { label: LABELS[1], answer: b }], {
              figure: lines([`${frac(a, 10)} = ${box(LABELS[0])}`, `0.${b} = ${frac(box(LABELS[1]), 10)}`]), explain: `${fj(a, 10, '은/는')} 0.${a}이고, ${dj('0.' + b, '은/는')} ${frac(b, 10)}이다.`,
              facts: { calc: [[`${a}/10`, 0], [String(b), 1]] }
            });
          }),
          T('deci-shade', '색칠한 부분을 소수로 나타내기', '①43 ②42 ③39', (d) => {
            const k = d.int(2, 9);
            return D('전체를 1로 볼 때, 색칠한 부분을 소수로 나타낸 수는?', k / 10, { figure: pieces('bar', 10, { shaded: k, scale: 2 }), explain: `전체를 똑같이 10칸으로 나눈 것 중의 ${k}칸이므로 ${frac(k, 10)}이고 소수로 0.${k}이다.`, facts: { pieceRead: 'decimal' } });
          }),
          T('deci-line', '수직선의 소수 읽기', '①47 ②44·52 ③45', (d) => {
            const from = d.int(0, 4), k = d.until(() => d.int(1, 9), (v) => v !== 5);
            return D('수직선에서 화살표가 가리키는 수를 소수로 나타낸 수는?', from + k / 10, { figure: tenthLine(from, k), explain: `작은 눈금 한 칸은 0.1이다. ${from}에서 ${k}칸을 더 갔으므로 ${from}.${k}이다.`, facts: { tenthRead: true } });
          }),
          T('deci-tenths', '0.1이 몇 개인 수', '①45·53 ②46·54 ③41', (d) => {
            const n = d.until(() => d.int(12, 68), (v) => v % 10 !== 0), x = d.until(() => d.int(11, 89), (v) => v % 10 !== 0 && v !== n), said = `${Math.floor(x / 10)}.${x % 10}`;
            return M(`0.1이 ${n}개인 수는 ㉠이고, ${dj(said, '은/는')} 0.1이 ㉡개인 수이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: n / 10, decimal: true }, { label: LABELS[1], answer: x }], {
              explain: `0.1이 10개이면 1이다. 0.1이 ${n}개인 수는 ${Math.floor(n / 10)}.${n % 10}이고, ${dj(said, '은/는')} 0.1이 ${x}개인 수이다.`, facts: { calc: [[`${n}/10`, 0]], unseen: [10], tenths: [[said, 1]] }
            });
          }),
          T('deci-and', '「몇과 0.몇만큼인 수」', '①52 ②53 ③44', (d) => {
            const w = d.int(1, 9), k = d.int(1, 9);
            return D(`${josa(w, '과/와')} 0.${k}만큼인 수는?`, w + k / 10, { explain: `${josa(w, '과/와')} 0.${k}만큼인 수는 ${w}.${k}이다.`, facts: { calc: [[`${w}+0.${k}`, 0]] } });
          }),
          T('deci-mm', 'cm와 mm를 소수로 나타내기', '①55 ②56 ③46', (d) => {
            // 5cm 8mm=□cm, 93mm=□cm
            const c = d.int(2, 14), m = d.int(1, 9), v = d.until(() => d.int(13, 98), (x) => x % 10 !== 0 && Math.floor(x / 10) !== c);
            return M('㉠, ㉡에 알맞은 소수는?', [{ label: LABELS[0], answer: c + m / 10, decimal: true }, { label: LABELS[1], answer: v / 10, decimal: true }], {
              figure: lines([`${c}cm ${m}mm = ${box(LABELS[0])}cm`, `${v}mm = ${box(LABELS[1])}cm`]), explain: `1mm는 0.1cm이다. ${c}cm ${m}mm는 ${c}.${m}cm이고, ${v}mm는 ${Math.floor(v / 10)}.${v % 10}cm이다.`,
              facts: { calc: [[`${c}+${m}/10`, 0], [`${v}/10`, 1]], unseen: [10] }
            });
          }),
          T('deci-ruler', '자 그림에서 길이를 소수로 읽기', '①54 ②57 ③47', (d) => {
            const to = d.until(() => d.int(23, 48), (v) => v % 10 !== 0 && v % 10 !== 5);
            return D('물건의 길이를 소수로 나타내면 몇 cm인가?', to / 10, { unit: 'cm', figure: ruler(0, to, Math.floor(to / 10) + 1), explain: `물건의 길이는 ${Math.floor(to / 10)}cm ${to % 10}mm이다. 1mm는 0.1cm이므로 ${Math.floor(to / 10)}.${to % 10}cm이다.`, facts: { ruler: 'decimal' } });
          }),
          T('deci-other', '나타내는 수가 다른 것 찾기', '①50 ②55 ③43', (d) => {
            // ㉠ 0.1이 82개인 수 ㉡ 8.2 ㉢ 8과 0.2만큼인 수 ㉣ 2.8
            const [w, k] = d.until(() => [d.int(1, 9), d.int(1, 9)], ([x, y]) => x !== y), n = w * 10 + k;
            const list = d.shuffle([[`0.1이 ${n}개인 수`, `${n}/10`], [`${w}.${k}`, `${w}.${k}`], [`${josa(w, '과/와')} 0.${k}만큼인 수`, `${w}+0.${k}`], [`${k}.${w}`, `${k}.${w}`]]);
            return C('나타내는 수가 나머지 셋과 다른 것은?', list.map(([said]) => said), list.findIndex(([, text]) => text === `${k}.${w}`), {
              explain: `0.1이 ${n}개인 수와 ${josa(w, '과/와')} 0.${k}만큼인 수는 모두 ${w}.${k}이다.`, facts: { choose: { exprs: list.map(([, text]) => text), rule: 'odd' }, unseen: [10] }
            });
          }),
          T('deci-ten', '문장제: 10조각 중 남은 양을 소수로', '①74 ②69·70 ③50', (d) => {
            const k = d.int(2, 8);
            return D(`리본 한 개를 똑같이 10조각으로 나누어 그중 ${k}조각을 사용하였다. 남은 리본은 처음 리본의 얼마인지 소수로 나타낸 수는?`, (10 - k) / 10, {
              explain: `남은 리본은 ${10 - k}조각이다. 전체 10조각 중의 ${10 - k}조각이므로 ${frac(10 - k, 10)}이고 소수로 0.${10 - k}이다.`, facts: { calc: [[`(10-${k})/10`, 0]] }
            });
          })
        ]
      },
      {
        id: 'dcomp', title: '소수의 크기 비교', standard: DCOMPARE,
        types: [
          T('dcomp-compare', '두 소수의 크기 비교', '①58·59 ②59·61 ③54·55', (d) => {
            // 0.1이 46개인 수 ○ 4.8
            const n = d.until(() => d.int(12, 88), (v) => v % 10 !== 0), x = d.until(() => n + d.int(-12, 12), (v) => v > 10 && v % 10 !== 0), said = `${Math.floor(x / 10)}.${x % 10}`, flip = d.bool();
            const left = flip ? said : `0.1이 ${n}개인 수`, right = flip ? `0.1이 ${n}개인 수` : said, p = flip ? x : n, q = flip ? n : x;
            return C('두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, p > q ? 0 : p === q ? 1 : 2, {
              figure: versus(left, right), explain: `0.1이 ${n}개인 수는 ${Math.floor(n / 10)}.${n % 10}이다.`, facts: { choose: { exprs: flip ? [said, `${n}/10`] : [`${n}/10`, said], rule: 'compare' }, unseen: [10] }
            });
          }),
          T('dcomp-order', '소수 여럿의 크기 비교', '①60 ②60 ③56', (d) => {
            const base = d.int(1, 7) * 10, xs = d.until(() => [base + d.int(-9, 19), base + d.int(-9, 19), base + d.int(-9, 19)], (v) => new Set(v).size === 3 && v.every((x) => x > 0 && x % 10 !== 0) && new Set(v.map((x) => Math.floor(x / 10))).size >= 2);
            const said = xs.map((x) => `${Math.floor(x / 10)}.${x % 10}`), pick = orderChoice(d, xs, LABELS, true);
            return C('큰 수부터 차례대로 나열한 것은?', pick.options, pick.answer, {
              figure: tagged(said), explain: '자연수 부분이 큰 수가 더 크고, 자연수 부분이 같으면 소수 부분이 큰 수가 더 크다.', facts: { choose: { exprs: said, rule: 'descending', orders: pick.list } }
            });
          }),
          T('dcomp-fill', '□ 안에 들어갈 수 있는 숫자', '①64 ②62 ③58', (d) => {
            const w = d.int(1, 8), k = d.int(3, 7);
            return N('0부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', k, {
              unit: '개', figure: `<span class="mb-expr">${w}.${box()} <i>&lt;</i> ${w}.${k}</span>`, explain: `자연수 부분이 같으므로 □는 ${k}보다 작은 수이다. 0부터 ${k - 1}까지 ${k}개이다.`,
              facts: { digit: { template: `${w}.□<${w}.${k}`, lo: 0, hi: 9, ask: 'count' } }
            });
          }),
          T('dcomp-word', '문장제: 분수와 소수로 나타낸 양의 비교', '①63·75 ②72 ③66', (d) => {
            // 공원 0.7km, 학교 5/10km, 도서관 8/10km → 가까운 곳부터
            const places = d.shuffle(['수영장', '박물관', '기차역', '우체국', '놀이공원']).slice(0, 3), ks = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
            const said = ks.map((k, i) => (i === 0 ? `0.${k}km` : `${frac(k, 10)}km`)), pick = orderChoice(d, ks, places, false);
            return C(`집에서 ${places[0]}까지의 거리는 ${said[0]}, ${places[1]}까지의 거리는 ${said[1]}, ${places[2]}까지의 거리는 ${said[2]}이다. 집에서 가까운 곳부터 차례대로 나열한 것은?`, pick.options, pick.answer, {
              explain: `분수를 소수로 나타내면 ${ks.map((k, i) => `${places[i]} 0.${k}km`).join(', ')}이다.`, facts: { choose: { exprs: ks.map((k, i) => (i === 0 ? `0.${k}` : `${k}/10`)), rule: 'ascending', orders: pick.list } }
            });
          }),
          T('dcomp-cards', '수 카드로 가장 큰 소수 만들기', '①65 ②63 ③60', (d) => {
            const list = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), sorted = list.slice().sort((p, q) => q - p);
            return D('수 카드 중 2장을 골라 한 번씩만 사용하여 소수 ■.▲를 만들려고 한다. 만들 수 있는 가장 큰 소수는?', sorted[0] + sorted[1] / 10, {
              figure: cards(list), explain: `자연수 부분에 가장 큰 수 ${josa(sorted[0], '을/를')}, 소수 부분에 둘째로 큰 수 ${josa(sorted[1], '을/를')} 놓는다. ${sorted[0]}.${sorted[1]}`, facts: { deciCards: list }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
