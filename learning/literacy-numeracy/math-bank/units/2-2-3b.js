// 2학년 2학기 3단원 길이 재기 — 기본 문항(길이의 차, 몸의 부분과 1 m로 어림하기, 알맞은 단위와 실제 길이).
// 꼴 목록(기본꼴_1 64꼴 = ①n, 심화꼴 49꼴 = 심n)을 꼴마다 따져서 실었다. 싣는 기준과 뺀 것은 2-2-3a.js 머리에 적었다.
//
// 이 파일에서 더 지킨 것
//  - 길이의 차는 cm끼리 뺄 수 있는 것만 싣는다. 답이 「몇 cm」뿐인 차(m끼리 빼면 0)는 따로 한 문항으로 실었다.
//  - 걸음 수를 m로 바꾸는 문항은 「두 걸음이 약 1 m」를 둘씩 묶어 세는 10걸음 안쪽만, 몇 m를 걸음 수로 바꾸는 문항은 2단 곱셈구구 안쪽만 싣는다.
//  - 몸의 부분의 길이는 교과서가 쓰는 어림값을 따른다(뼘 < 한 걸음 < 양팔을 벌린 길이, 양팔을 벌린 길이는 약 1 m).
//  - 길이 양감은 2학년이 아는 물건만 쓰고, 틀린 보기는 실제 길이와 크게 어긋나게 잡았다(교실 문의 높이 약 2 m ↔ 20 cm·20 m).
// 묻는 말: 값을 물을 때는 「~은?/~는?」, 양을 물을 때는 「몇 ~인가?」, 시키는 말은 「~하시오.」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, lines, tagged, numbers, chain, timeColumn, N, M, C } = B.kit;
  const { KNOW, CONV, SIGNS, versus, mOf, cOf, L, LC, X, ask, mc, pairSum, pairDiff, threeLengths, pairOptions, ORDERS, whyDiff, twoBars, road, unitRow, prints } = B.kit.g223;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 길이의 차 ────────────────────────────────────────────────
  B.addTypes('2-2-3', 'diff', [
    T('diff-row', '길이의 차(가로식)', '①32 심17', (d, n) => {
      // 3 m 70 cm − 1 m 20 cm / 8 m 50 cm − 5 m 25 cm(일의 자리 받아내림) / 5 m 20 cm − 4 m 5 cm(빼는 cm가 한 자리) / 21 m 78 cm − 15 m 11 cm(m가 두 자리)
      const kind = ['tens', 'borrow', 'one', 'plain'][n], [a, b] = n === 3 ? pairDiff(d, kind, [3, 9], [11, 25]) : pairDiff(d, kind, [1, 4], [1, 5]);
      return M('다음을 계산하시오.', ask(a - b), { figure: lines([expr(L(a), '-', L(b))]), explain: whyDiff(a, b), facts: Object.assign(mc(`${X(a)}-${X(b)}`), { rule: 'diff-row-' + (n === 3 ? 'long' : kind) }) });
    }, { count: 4 }),
    T('diff-col', '길이의 차(세로식)', '①33', (d, n) => {
      // 6 m 92 cm − 3 m 31 cm / 6 m 40 cm − 2 m 15 cm(일의 자리 받아내림) / 11 m 97 cm − 5 m 3 cm(m가 두 자리, 빼는 cm가 한 자리)
      const kind = ['plain', 'borrow', 'one'][n], [a, b] = n === 2 ? pairDiff(d, kind, [5, 8], [3, 6], (p) => mOf(p) >= 10) : pairDiff(d, kind, [1, 5], [1, 4]);
      return M('다음을 계산하시오.', ask(a - b), {
        figure: timeColumn([mOf(a) + ' m', cOf(a) + ' cm'], '-', [mOf(b) + ' m', cOf(b) + ' cm']), explain: whyDiff(a, b), facts: Object.assign(mc(`${X(a)}-${X(b)}`), { rule: 'diff-col-' + kind })
      });
    }, { count: 3 }),
    T('diff-mask', '뺄셈 세로식의 □', '①34 심18', (d, n) => {
      // 7 m 53 cm − 1 m □ cm = 6 m 22 cm(빼는 수) / 3 m □ cm − 1 m 18 cm = 2 m 11 cm(빼어지는 수 — 더해서 구한다)
      const [a, b] = pairDiff(d, 'plain', [1, 5], [1, 4]), r = a - b, hide = (v, at) => (n === at ? box() : cOf(v)) + ' cm';
      return N('□ 안에 알맞은 수는?', n === 0 ? cOf(b) : cOf(a), {
        figure: timeColumn([mOf(a) + ' m', hide(a, 1)], '-', [mOf(b) + ' m', hide(b, 0)], [mOf(r) + ' m', cOf(r) + ' cm']),
        explain: n === 0 ? `cm끼리 빼면 ${cOf(r)} cm이다. ${cOf(a)} − ${cOf(r)} = ${cOf(b)}이므로 □ 안에 알맞은 수는 ${cOf(b)}이다.` : `cm끼리 빼면 ${cOf(r)} cm이다. ${cOf(r)} + ${cOf(b)} = ${cOf(a)}이므로 □ 안에 알맞은 수는 ${cOf(a)}이다.`,
        facts: { calc: [[n === 0 ? `${cOf(a)}-${cOf(r)}` : `${cOf(r)}+${cOf(b)}`, 0]] }
      });
    }, { count: 2 }),
    T('diff-chain', '화살표를 따라 빼기', '①35', (d) => {
      const [a, b] = pairDiff(d, d.pick(['plain', 'borrow']), [2, 6], [1, 3]);
      return M('빈칸에 알맞은 길이는 몇 m 몇 cm인가?', ask(a - b), { figure: chain([L(a), '-' + L(b), box()]), explain: whyDiff(a, b), facts: mc(`${X(a)}-${X(b)}`) });
    }),
    T('diff-chain2', '화살표를 따라 두 번 계산하기', '①35', (d, n) => {
      // 9 m 87 cm − 2 m 21 cm − 2 m 35 cm / 4 m 27 cm + 6 m 65 cm − 5 m 25 cm
      const ops = n === 0 ? ['-', '-'] : ['+', '-'], t = threeLengths(d, ops), [a, b, c] = t.v, sign = (op) => (op === '+' ? '+' : '−');
      return M('㉠, ㉡에 알맞은 길이는 각각 몇 m 몇 cm인가?', [{ label: LABELS[0], answer: mOf(t.r1), unit: 'm' }, { answer: cOf(t.r1), unit: 'cm' }, { label: LABELS[1], answer: mOf(t.r2), unit: 'm' }, { answer: cOf(t.r2), unit: 'cm' }], {
        figure: lines([chain([L(a), ops[0] + L(b), box(LABELS[0])]), chain([LABELS[0], ops[1] + L(c), box(LABELS[1])])]),
        explain: `㉠은 ${L(a)} ${sign(ops[0])} ${L(b)} = ${L(t.r1)}이다. ㉡은 ${L(t.r1)} ${sign(ops[1])} ${L(c)} = ${L(t.r2)}이다.`,
        facts: { unit: [{ expr: `${X(a)}${ops[0]}${X(b)}`, base: 100, at: [0, 1] }, { expr: `${X(a)}${ops[0]}${X(b)}${ops[1]}${X(c)}`, base: 100, at: [2, 3] }], unseen: [100] }
      });
    }, { count: 2 }),
    T('diff-two', '그림에 적힌 두 길이의 차', '①36', (d) => {
      // 짧은 것이 위에 놓인다.
      const [a, b] = pairDiff(d, d.pick(['plain', 'borrow']), [1, 3], [3, 6]);
      return M('리본 가와 나의 길이의 차는 몇 m 몇 cm인가?', ask(a - b), {
        figure: twoBars([['가', b], ['나', a]], '리본'), explain: `긴 길이에서 짧은 길이를 뺀다. ${L(a)} − ${L(b)} = ${L(a - b)}`, facts: mc(`${X(a)}-${X(b)}`)
      });
    }),
    T('diff-compare', '계산한 두 길이의 비교', '①37 심22', (d) => {
      // ㉠ 5 m 83 cm − 3 m 62 cm ㉡ 6 m 79 cm − 4 m 54 cm → 2 m 21 cm < 2 m 25 cm
      const m = d.int(1, 4), [x, y] = d.until(() => [d.int(11, 58), d.int(11, 58)], ([p, q]) => p !== q && Math.abs(p - q) <= 9);
      const back = (r) => { const b = d.int(1, 4) * 100 + d.int(11, 99 - cOf(r)); return [r + b, b]; };
      const [a, b] = back(m * 100 + x), [c, e] = d.until(() => back(m * 100 + y), ([p, q]) => q !== b && p !== a), r1 = a - b, r2 = c - e;
      return C('㉠과 ㉡의 길이를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, r1 > r2 ? 0 : 2, {
        figure: tagged([`${L(a)} − ${L(b)}`, `${L(c)} − ${L(e)}`]) + versus('㉠', '㉡'), explain: `㉠은 ${L(r1)}, ㉡은 ${L(r2)}이다.`,
        facts: { choose: { exprs: [`${X(a)}-${X(b)}`, `${X(c)}-${X(e)}`], rule: 'compare' }, unseen: [100] }
      });
    }),
    T('diff-vs-cm', '계산한 길이와 「몇 cm」의 비교', '①37', (d) => {
      // ㉠ 6 m 88 cm − 3 m 16 cm ㉡ 360 cm
      const [a, b] = pairDiff(d, 'plain', [2, 5], [1, 3]), r = a - b, v = d.until(() => r + d.int(-12, 12), (p) => p !== r && p > 100);
      return C('㉠과 ㉡의 길이를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, r > v ? 0 : 2, {
        figure: tagged([`${L(a)} − ${L(b)}`, LC(v)]) + versus('㉠', '㉡'), explain: `㉠은 ${L(r)}이고, ${L(r)}는 ${r} cm이다.`,
        facts: { choose: { exprs: [`${X(a)}-${X(b)}`, String(v)], rule: 'compare' }, unseen: [100] }
      });
    }),
    T('diff-vs-sum', '합과 차의 비교', '①37', (d) => {
      // ㉠ 5 m 28 cm + 3 m 41 cm ㉡ 16 m 64 cm − 8 m 13 cm
      const [a, b] = pairSum(d, d.pick(['plain', 'carry']), [3, 5], [2, 4]), s = a + b;
      const [c, e] = d.until(() => { const r = s + d.int(-15, 15), q = d.int(6, 9) * 100 + d.int(11, 60); return [r + q, q]; }, ([p, q]) => p - q !== s && mOf(p - q) === mOf(s) && cOf(p - q) >= 1 && cOf(p - q) + cOf(q) <= 99 && mOf(p) >= 10);
      const r = c - e;
      return C('㉠과 ㉡의 길이를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, s > r ? 0 : 2, {
        figure: tagged([`${L(a)} + ${L(b)}`, `${L(c)} − ${L(e)}`]) + versus('㉠', '㉡'), explain: `㉠은 ${L(s)}, ㉡은 ${L(r)}이다.`,
        facts: { choose: { exprs: [`${X(a)}+${X(b)}`, `${X(c)}-${X(e)}`], rule: 'compare' }, unseen: [100] }
      });
    }),
    T('diff-longer', '차보다 더 긴 길이 모두 고르기', '①38 심23', (d) => {
      // 8 m 53 cm − 2 m 20 cm = 6 m 33 cm보다 긴 것: 6 m 38 cm, 6 m 55 cm (6 m 9 cm는 더 짧다)
      const [a, b] = pairDiff(d, 'plain', [3, 7], [1, 2], (p, q) => cOf(p - q) >= 21 && cOf(p - q) <= 60), r = a - b, m = mOf(r);
      const one = d.until(() => d.int(4, 9), (v) => v > Math.floor(cOf(r) / 10));
      const rows = d.shuffle([r + d.int(2, 9), m * 100 + one, r - d.int(6, 11), r + d.int(12, 30)]), made = pairOptions(d, rows.map((v) => v > r));
      return C(`${L(a)}와 ${L(b)}의 차보다 더 긴 길이를 모두 고른 것은?`, made.options, made.answer, {
        figure: tagged(rows.map(L)), explain: `${L(a)} − ${L(b)} = ${L(r)}이다. ${L(r)}보다 긴 길이는 ${rows.filter((v) => v > r).map(L).join(', ')}이다.`,
        facts: { sets: { labels: LABELS, flags: rows.map((v) => v > r), options: made.sets } }
      });
    }),
    T('diff-ends', '가장 긴 것과 가장 짧은 것의 차', '①39', (d) => {
      // 3 m 34 cm, 7 m 45 cm, 6 m 80 cm — 가운데 길이는 가장 긴 것과 m가 같거나, cm의 수가 더 크다.
      const [lo, hi, mid] = d.until(() => {
        const low = d.int(1, 3) * 100 + d.int(11, 40), high = d.int(6, 9) * 100 + d.int(41, 75);
        return [low, high, d.bool() ? mOf(high) * 100 + d.int(11, cOf(high) - 3) : (mOf(high) - 1) * 100 + d.int(cOf(high) + 5, 98)];
      }, (v) => v[2] > v[0] && v[2] < v[1] && cOf(v[1]) - cOf(v[0]) >= 2);
      return M('세 길이 가운데 가장 긴 것과 가장 짧은 것의 차는 몇 m 몇 cm인가?', ask(hi - lo), {
        figure: numbers(d.shuffle([lo, hi, mid]).map(L)), explain: `가장 긴 길이는 ${L(hi)}, 가장 짧은 길이는 ${L(lo)}이다. ${L(hi)} − ${L(lo)} = ${L(hi - lo)}`, facts: mc(`${X(hi)}-${X(lo)}`)
      });
    }),
    T('diff-more', '문장제: 몇 m 몇 cm 더 높은가', '①40', (d) => {
      const [a, b] = pairDiff(d, d.pick(['plain', 'borrow']), [1, 3], [1, 2]), [p, q] = d.shuffle(['사과나무', '감나무', '소나무', '은행나무']);
      return M(`${p}의 높이는 ${L(a)}이고, ${q}의 높이는 ${L(b)}이다. ${josa(p, '은/는')} ${q}보다 몇 m 몇 cm 더 높은가?`, ask(a - b), { explain: whyDiff(a, b), facts: mc(`${X(a)}-${X(b)}`) });
    }),
    T('diff-cm', '문장제: 답이 「몇 cm」인 차', '①40', (d) => {
      // 1 m 45 cm와 1 m 32 cm → 13 cm (m끼리 빼면 0)
      const x = d.int(22, 48), y = d.int(12, x - 3), a = 100 + x, b = 100 + y, [p, q] = d.shuffle(NAMES);
      return N(`${nick(p)}의 키는 ${L(a)}이고, ${nick(q)}의 키는 ${L(b)}이다. ${name(p, '은/는')} ${nick(q)}보다 몇 cm 더 큰가?`, x - y, {
        unit: 'cm', explain: `m는 1 m로 같으므로 cm끼리 뺀다. ${x} cm − ${y} cm = ${x - y} cm`, facts: { calc: [[`${X(a)}-${X(b)}`, 0]], unseen: [100] }
      });
    }),
    T('diff-left', '문장제: 남은 길이', '①42 심19', (d) => {
      const [a, b] = pairDiff(d, d.pick(['tens', 'plain']), [1, 4], [1, 3]);
      return M(`길이가 ${L(a)}인 색 테이프 가운데 ${L(b)}를 사용하였다. 남은 색 테이프의 길이는 몇 m 몇 cm인가?`, ask(a - b), { explain: whyDiff(a, b), facts: mc(`${X(a)}-${X(b)}`) });
    }),
    T('diff-used', '문장제: 사용한 길이', '①43 심20', (d) => {
      // 처음 15 m 85 cm, 남은 12 m 52 cm → 사용한 3 m 33 cm
      const [a, b] = pairDiff(d, 'plain', [2, 9], [11, 28]);
      return M(`길이가 ${L(a)}인 리본이 있다. 선물을 포장하는 데 사용하고 나니 ${L(b)}가 남았다. 사용한 리본의 길이는 몇 m 몇 cm인가?`, ask(a - b), {
        explain: `처음 길이에서 남은 길이를 빼면 사용한 길이이다. ${L(a)} − ${L(b)} = ${L(a - b)}`, facts: mc(`${X(a)}-${X(b)}`)
      });
    }),
    T('diff-twice', '문장제: 같은 길이를 두 번 쓰고 남은 길이', '①44', (d) => {
      const k = d.int(1, 2), a = d.int(k * 2 + 2, 9) * 100 + d.int(12, 88);
      return M(`길이가 ${L(a)}인 실을 ${k} m씩 2번 잘라 사용하였다. 남은 실의 길이는 몇 m 몇 cm인가?`, ask(a - k * 200), {
        explain: `${k} m씩 2번 사용하면 ${k * 2} m를 사용한 것이다. ${L(a)}에서 ${k * 2} m를 빼면 ${L(a - k * 200)}이다.`, facts: mc(`${X(a)}-${k}*100*2`)
      });
    }),
    T('diff-route', '전체 거리에서 한 구간 빼기', '①46', (d) => {
      // 집 ― 공원 ― 도서관: 전체 98 m 70 cm, 앞 구간 35 m 50 cm
      const [a, b] = pairDiff(d, d.pick(['tens', 'plain']), [18, 52], [15, 38]), places = ['집'].concat(d.shuffle(['공원', '학교', '도서관', '놀이터']).slice(0, 2));
      return M(`${places[1]}에서 ${places[2]}까지의 거리는 몇 m 몇 cm인가?`, ask(a - b), {
        figure: road(places, [L(b), '?'], L(a), b / a, `길 그림: ${places[0]}에서 ${places[2]}까지 ${L(a)}, ${places[0]}에서 ${places[1]}까지 ${L(b)}`),
        explain: `${places[0]}에서 ${places[2]}까지의 거리에서 ${places[0]}에서 ${places[1]}까지의 거리를 뺀다. ${L(a)} − ${L(b)} = ${L(a - b)}`, facts: mc(`${X(a)}-${X(b)}`)
      });
    })
  ]);

  // ── 몸의 부분과 1 m로 어림하기 ───────────────────────────────
  // 잴 곳과 그 길이의 어림(양팔을 벌린 길이로 몇 번쯤인가)
  const SPOTS = [['교실 칠판의 긴 쪽', 4, 5], ['교실 게시판의 긴 쪽', 3, 4], ['교실 창문의 긴 쪽', 2, 3], ['신발장의 긴 쪽', 3, 5]];
  B.addTypes('2-2-3', 'body', [
    T('body-one', '몸에서 약 1 m인 것 찾기', '심42', (d) => {
      const right = '양팔을 벌린 길이', list = d.shuffle(d.shuffle(['한 뼘의 길이', '발 길이', '손가락 한 마디의 길이', '손바닥의 너비']).slice(0, 3).concat([right]));
      return C('2학년 학생의 몸에서 길이가 약 1 m인 것은?', list, list.indexOf(right), {
        explain: '양팔을 벌린 길이는 약 1 m이다. 나머지는 모두 1 m보다 훨씬 짧다.', facts: { truth: list.map((v) => v === right), want: true }
      });
    }),
    T('body-unit', '주어진 길이로 어림하기', '①50 심30·33', (d, n) => {
      // 1 m 막대로 몇 번 / 약 3 m인 자동차로 몇 번
      if (n === 0) {
        const k = d.int(4, 7);
        return N('길이가 1 m인 막대로 긴 줄의 길이를 어림하려고 한다. 긴 줄의 길이는 약 몇 m인가?', k, {
          unit: 'm', lead: '약', figure: unitRow(k, ['1 m', '긴 줄'], `길이가 1 m인 막대와 긴 줄: 긴 줄의 길이는 막대로 ${k}번`), explain: `긴 줄의 길이는 1 m인 막대로 ${k}번이다. 약 ${k} m이다.`, facts: { calc: [[`1*${k}`, 0]] }
        });
      }
      const [thing, u, long, lo, hi] = d.pick([['자동차', 3, '건물의 긴 쪽', 3, 4], ['침대', 2, '방의 긴 쪽', 2, 3]]), k = d.int(lo, hi);
      return N(`${thing}의 길이는 약 ${u} m이다. ${long}의 길이는 약 몇 m인가?`, u * k, {
        unit: 'm', lead: '약', figure: unitRow(k, [`${thing} 약 ${u} m`, long], `길이가 약 ${u} m인 ${thing}와 ${long}: ${long}의 길이는 ${thing}로 ${k}번`),
        explain: `${long}의 길이는 ${thing}로 ${k}번이다. 약 ${u} m씩 ${k}번이므로 약 ${u * k} m이다.`, facts: { calc: [[`${u}*${k}`, 0]] }
      });
    }, { count: 2 }),
    T('body-arms', '양팔을 벌린 길이로 어림하기', '①51 심31', (d) => {
      const who = d.pick(NAMES), [spot, lo, hi] = d.pick(SPOTS), k = d.int(lo, hi);
      return N(`${nick(who)}가 양팔을 벌린 길이는 약 1 m이다. ${spot}의 길이를 재었더니 양팔을 벌린 길이로 ${k}번이었다. ${spot}의 길이는 약 몇 m인가?`, k, {
        unit: 'm', lead: '약', explain: `약 1 m씩 ${k}번이므로 약 ${k} m이다.`, facts: { calc: [[`1*${k}`, 0]] }
      });
    }),
    T('body-steps', '걸음 수를 m로 나타내기', '①52', (d) => {
      const who = d.pick(NAMES), k = d.int(2, 5) * 2;
      return N(`${nick(who)}의 두 걸음은 약 1 m이다. 교실 앞에서 뒤까지 걸었더니 ${k}걸음이었다. 교실 앞에서 뒤까지의 거리는 약 몇 m인가?`, k / 2, {
        unit: 'm', lead: '약', explain: `두 걸음이 약 1 m이므로 두 걸음씩 묶어 센다. ${k}걸음은 두 걸음씩 ${k / 2}번이므로 약 ${k / 2} m이다.`, facts: { calc: [[`${k}/2`, 0]], unseen: [2] }
      });
    }),
    T('body-prints', '발자국을 세어 거리 어림하기', '①52', (d) => {
      const k = d.int(2, 5) * 2;
      return N('두 걸음이 약 1 m인 사람이 두 깃발 사이를 걸은 발자국이다. 두 깃발 사이의 거리는 약 몇 m인가?', k / 2, {
        unit: 'm', lead: '약', figure: prints(k), explain: `발자국이 ${k}개이므로 ${k}걸음이다. 두 걸음씩 ${k / 2}번이므로 약 ${k / 2} m이다.`, facts: { calc: [[`${k}/2`, 0]], unseen: [2] }
      });
    }),
    T('body-need', '몇 m를 재는 데 필요한 걸음 수', '①53 심35', (d) => {
      const k = d.int(3, 8);
      return N(`두 걸음이 약 1 m일 때, ${k} m를 어림하려면 약 몇 걸음을 걸어야 하는가?`, k * 2, {
        unit: '걸음', lead: '약', explain: `1 m를 재는 데 두 걸음이므로 ${k} m를 재려면 두 걸음씩 ${k}번을 걸어야 한다. 2 × ${k} = ${k * 2}이므로 약 ${k * 2}걸음이다.`, facts: { calc: [[`2*${k}`, 0]], unseen: [2] }
      });
    }),
    T('body-half', '한 걸음이 약 50 cm일 때 걸은 거리', '①53 심37', (d) => {
      const who = d.pick(NAMES), k = d.int(2, 5) * 2;
      return N(`${nick(who)}의 한 걸음은 약 50 cm이다. ${name(who, '이/가')} ${k}걸음을 걸은 거리는 약 몇 m인가?`, k / 2, {
        unit: 'm', lead: '약', explain: `50 cm씩 두 걸음이면 100 cm, 곧 1 m이다. ${k}걸음은 두 걸음씩 ${k / 2}번이므로 약 ${k / 2} m이다.`, facts: { calc: [[`${k}*50/100`, 0]], unseen: [100] }
      });
    }),
    T('body-count', '재는 횟수 비교하기', '①55 심41', (d) => {
      // 짧은 것으로 잴수록 여러 번 잰다: 뼘 > 걸음 > 양팔을 벌린 길이
      const parts = d.shuffle([['뼘', 12], ['걸음', 50], ['양팔을 벌린 길이', 100]]), right = [0, 1, 2].sort((p, q) => parts[p][1] - parts[q][1]);
      const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C('교실의 긴 쪽의 길이를 세 가지 방법으로 재려고 한다. 잰 횟수가 많은 것부터 차례로 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(parts.map((p) => p[0])), explain: '짧은 것으로 잴수록 여러 번 재어야 한다. 뼘이 가장 짧고 양팔을 벌린 길이가 가장 길다.',
        facts: { choose: { exprs: parts.map((p) => String(p[1])), rule: 'ascending', orders: list }, unseen: [12, 50, 100] }
      });
    }),
    T('body-part', '재기에 알맞은 몸의 부분 고르기', '①56', (d) => {
      const spot = d.pick(['운동장 긴 쪽의 길이', '학교 복도의 길이', '강당 긴 쪽의 길이']), list = d.shuffle(['손가락 너비', '뼘', '발 길이', '걸음']);
      return C(`${josa(spot, '을/를')} 몸의 부분으로 재려고 한다. 가장 알맞은 것은?`, list, list.indexOf('걸음'), {
        explain: '긴 길이는 길이가 긴 것으로 재어야 여러 번 재지 않는다. 넷 가운데 걸음이 가장 길다.', facts: { truth: list.map((v) => v === '걸음'), want: true }
      });
    }),
    T('body-rope', '끈으로 잰 길이보다 몇 cm 더 긴 길이', '①59', (d) => {
      // 3 m인 끈으로 3번 잰 길이보다 50 cm 더 길다 → 약 9 m 50 cm (교실의 긴 쪽은 8~9 m쯤이다)
      const [u, k] = d.pick([[3, 3], [2, 4], [4, 2]]), c = d.int(2, 8) * 10, v = u * k * 100 + c;
      return M(`교실의 긴 쪽의 길이는 길이가 ${u} m인 끈으로 ${k}번 잰 길이보다 ${c} cm 더 길다. 교실의 긴 쪽의 길이는 약 몇 m 몇 cm인가?`, ask(v, '약'), {
        explain: `${u} m씩 ${k}번은 ${u * k} m이다. ${u * k} m보다 ${c} cm 더 긴 길이는 ${L(v)}이다.`, facts: mc(`${u}*${k}*100+${c}`)
      });
    })
  ]);

  // ── 알맞은 단위와 실제 길이 ──────────────────────────────────
  // [이름, 수, 단위] — 2학년이 아는 물건. 단위를 바꾸면 말이 안 되는 것만 모았다(연필 15 m, 버스 11 cm).
  const THINGS = [['연필의 길이', 15, 'cm'], ['지우개의 길이', 5, 'cm'], ['수학책의 긴 쪽의 길이', 27, 'cm'], ['필통의 길이', 20, 'cm'], ['젓가락의 길이', 20, 'cm'],
    ['교실 문의 높이', 2, 'm'], ['버스의 길이', 11, 'm'], ['운동장 긴 쪽의 길이', 80, 'm'], ['침대의 긴 쪽의 길이', 2, 'm'], ['3층 건물의 높이', 10, 'm']];
  // [이름, 실제 길이에 가까운 것, 크게 어긋난 것들]
  const REAL = [['연필의 길이', '15 cm', ['1 m', '2 m', '15 m']], ['2학년 학생이 양팔을 벌린 길이', '1 m', ['10 cm', '10 m', '20 m']], ['교실 문의 높이', '2 m', ['20 cm', '10 m', '20 m']],
    ['버스의 길이', '10 m', ['10 cm', '1 m', '100 m']], ['2학년 학생의 키', '1 m 25 cm', ['12 cm', '5 m', '12 m']], ['수학책의 긴 쪽의 길이', '27 cm', ['2 m', '7 m', '27 m']]];
  const SHORT1 = ['연필의 길이', '지우개의 길이', '수학책의 긴 쪽의 길이', '필통의 길이', '실내화의 길이', '젓가락의 길이'], LONG1 = ['교실 문의 높이', '버스의 길이', '교실 칠판의 긴 쪽의 길이', '운동장 긴 쪽의 길이', '침대의 긴 쪽의 길이'];
  const SHORT5 = ['교실 문의 높이', '침대의 긴 쪽의 길이', '2학년 학생이 양팔을 벌린 길이', '우산의 길이', '책상의 긴 쪽의 길이'], LONG5 = ['버스의 길이', '운동장 긴 쪽의 길이', '3층 건물의 높이', '기차의 길이'];
  B.addTypes('2-2-3', 'sense', [
    T('sense-unit', '알맞은 단위 고르기', '①60', (d) => {
      const [p, q] = d.until(() => d.shuffle(THINGS).slice(0, 2), ([x, y]) => x[1] !== y[1]), units = [['cm', 'cm'], ['cm', 'm'], ['m', 'cm'], ['m', 'm']];
      return C('㉠, ㉡에 알맞은 단위를 바르게 짝 지은 것은?', units.map(([x, y]) => `㉠ ${x}, ㉡ ${y}`), units.findIndex(([x, y]) => x === p[2] && y === q[2]), {
        figure: lines([`${josa(p[0], '은/는')} 약 ${p[1]} ${box(LABELS[0])}이다.`, `${josa(q[0], '은/는')} 약 ${q[1]} ${box(LABELS[1])}이다.`]),
        explain: `${josa(p[0], '은/는')} 약 ${p[1]} ${p[2]}, ${josa(q[0], '은/는')} 약 ${q[1]} ${q[2]}이다. 1 m보다 짧은 길이는 cm로, 1 m보다 긴 길이는 m로 나타내면 알맞다.`,
        facts: { truth: units.map(([x, y]) => x === p[2] && y === q[2]), want: true }
      });
    }),
    T('sense-odd', '알맞은 단위가 나머지와 다른 것 찾기', '①61 심44', (d) => {
      const lone = d.pick(['cm', 'm']), picks = d.shuffle(d.shuffle(THINGS.filter((t) => t[2] !== lone)).slice(0, 3).concat([d.pick(THINGS.filter((t) => t[2] === lone))]));
      return C('□ 안에 알맞은 단위가 나머지와 다른 것은?', picks.map((t) => `${josa(t[0], '은/는')} 약 ${t[1]} □이다.`), picks.findIndex((t) => t[2] === lone), {
        explain: picks.map((t) => `${t[0]} 약 ${t[1]} ${t[2]}`).join(', ') + '이다.', facts: { truth: picks.map((t) => t[2] === lone), want: true }
      });
    }),
    T('sense-match', '실제 길이에 가깝게 짝 지은 것 고르기', '①62', (d) => {
      const picks = d.shuffle(REAL).slice(0, 4), good = d.int(0, 3), list = picks.map((t, i) => `${t[0]} — 약 ${i === good ? t[1] : d.pick(t[2])}`);
      return C('실제 길이에 가깝게 짝 지은 것은?', list, good, {
        explain: `${josa(picks[good][0], '은/는')} 약 ${picks[good][1]}이다. 나머지는 ${picks.filter((_, i) => i !== good).map((t) => `${t[0]} 약 ${t[1]}`).join(', ')}이다.`,
        facts: { truth: list.map((_, i) => i === good), want: true }
      });
    }),
    T('sense-fill', '알맞은 길이 고르기', '①63 심45', (d) => {
      const [thing, right, wrong] = d.pick(REAL), list = d.shuffle(wrong.concat([right]));
      return C(`${josa(thing, '은/는')} 약 □이다. □ 안에 알맞은 길이는?`, list, list.indexOf(right), { explain: `${josa(thing, '은/는')} 약 ${right}이다.`, facts: { truth: list.map((v) => v === right), want: true } });
    }),
    T('sense-over', '기준 길이보다 긴 것 모두 고르기', '①64 ①61', (d, n) => {
      // 1 m보다 긴 것 / 5 m보다 긴 것
      const ref = n === 0 ? 1 : 5, long = n === 0 ? LONG1 : LONG5, short = n === 0 ? SHORT1 : SHORT5;
      const rows = d.shuffle(d.shuffle(long).slice(0, 2).map((t) => [t, true]).concat(d.shuffle(short).slice(0, 2).map((t) => [t, false]))), made = pairOptions(d, rows.map((r) => r[1]));
      return C(`길이가 ${ref} m보다 긴 것을 모두 고른 것은?`, made.options, made.answer, {
        figure: tagged(rows.map((r) => r[0])), explain: `${rows.filter((r) => r[1]).map((r) => r[0]).join(', ')}는 ${ref} m보다 길다. ${rows.filter((r) => !r[1]).map((r) => r[0]).join(', ')}는 ${ref} m보다 짧다.`,
        facts: { sets: { labels: LABELS, flags: rows.map((r) => r[1]), options: made.sets }, rule: 'over-' + ref }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
