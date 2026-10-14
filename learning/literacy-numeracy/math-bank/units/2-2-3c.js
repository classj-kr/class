// 2학년 2학기 3단원 길이 재기 — 실력 문항.
// 꼴 목록(기본꼴_1 64꼴 = ①n, 심화꼴 49꼴 = 심n) 가운데 실력으로 보낸 것이다. 싣는 기준과 뺀 것은 2-2-3a.js 머리에 적었다.
//
// 실력 문항의 잣대: 어려움은 보기가 아니라 문제의 상황과 그림의 장치에서 나온다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적는다.
//   ① 수의 생김새만 보고 단위를 바꾼다(103 cm를 1 m 30 cm로, 12 m 8 cm를 128 cm로, 890 cm를 8 m 9 cm로). → h-place, h-over
//   ② 단위가 다른 두 길이를 수만 보고 견준다(2 m 5 cm와 250 cm에서 5와 250을 견주거나 둘이 같다고 본다). → h-units
//   ③ 줄자의 끝 눈금을 그대로 길이로 읽는다(한끝이 눈금 0에 있지 않은데도). → h-zero
//   ④ 「더 가깝다」「더 짧다」라는 말만 보고 셈을 고른다(가까운 곳은 거리가 짧은 곳, 「가가 나보다 짧다」면 나는 더 길다). → h-near, h-shorter
//   ⑤ 잰 횟수가 많으면 길다고 본다(한 걸음이 긴 사람은 적게 잰다, 재는 단위가 다르면 횟수만으로는 견줄 수 없다). → h-fewer, h-pace
//   ⑥ 물건의 수가 크면 길다고 본다(연필 10자루를 이어도 10 m가 안 된다). → h-ten
//   ⑦ 어림한 수가 실제에 「가까워 보이는」 쪽을 고른다(넘친 어림과 모자란 어림은 저마다 실제와의 차로 견준다). → h-closer
// 그다음에 두 번 넘게 생각해야 풀리는 문제를 실었다: 단위를 고친 뒤 빼기(h-stretch), 합을 구한 뒤 차(h-sum-diff), 그림에서 횟수를 세어 같은 길이를 거듭 더하기(h-height),
// 줄자를 읽고 고쳐서 두 번 더하기(h-double), 두 뼘씩 묶어 더한 뒤 단위 고치기(h-span), 받침의 높이를 빼고 다른 받침의 높이를 더하기(h-stand).
// 기본에서 하는 일(단위 한 번 바꾸기, 합·차 한 번)을 고르기로 바꾼 문항은 싣지 않는다. 「사용한 길이(처음 − 남은)」는 한 번 빼면 풀려서 기본(diff-used)에 두었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, tagged, M, C } = B.kit;
  const { KNOW, CONV, GUESS, CALC, mOf, cOf, L, LC, X, ask, mc, pairSum, pairDiff, tape, around, tick, heights } = B.kit.g223;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});

  B.addGroup('2-2-3', {
    id: 'hard', title: '실력 문제', standard: CALC,
    types: [
      H('h-place', '길이를 잘못 나타낸 것 찾기', '심3·5 ①9', (d) => {
        // 890 cm = 8 m 90 cm, 12 m 8 cm = 1208 cm, 103 cm = 1 m 3 cm 가운데 하나만 자리를 잘못 잡는다.
        const [p, q, r] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]), t = d.int(2, 9), far = d.int(11, 19), one = d.until(() => d.int(2, 9), (v) => v !== far % 10), few = d.int(2, 9), c = d.until(() => d.int(12, 98), (v) => v % 10 !== 0), bad = d.int(0, 2);
        const rows = d.shuffle([
          { bad: bad === 0, text: `${p * 100 + t * 10} cm = ${p} m ${bad === 0 ? t : t * 10} cm`, expr: String(p * 100 + t * 10), said: p * 100 + (bad === 0 ? t : t * 10) },          // 890 cm를 8 m 9 cm로: 0을 떼고 읽은 아이
          { bad: bad === 1, text: `${far} m ${one} cm = ${bad === 1 ? far * 10 + one : far * 100 + one} cm`, expr: `${far}*100+${one}`, said: bad === 1 ? far * 10 + one : far * 100 + one },   // 12 m 8 cm를 128 cm로: 수를 그대로 이어 붙인 아이
          { bad: bad === 2, text: `${q * 100 + few} cm = ${q} m ${bad === 2 ? few * 10 : few} cm`, expr: String(q * 100 + few), said: q * 100 + (bad === 2 ? few * 10 : few) },            // 103 cm를 1 m 30 cm로: 가운데 0을 빼고 끊은 아이
          { bad: false, text: `${r} m ${c} cm = ${r * 100 + c} cm`, expr: `${r}*100+${c}`, said: r * 100 + c }
        ]);
        const at = rows.findIndex((row) => row.bad);
        return C('길이를 잘못 나타낸 것은?', rows.map((row) => row.text), at, {
          explain: [`${p * 100 + t * 10} cm는 ${p * 100} cm보다 ${t * 10} cm 더 긴 길이이므로 ${p} m ${t * 10} cm이다.`, `${far} m는 ${far * 100} cm이므로 ${far} m ${one} cm는 ${far * 100 + one} cm이다.`, `${q * 100 + few} cm는 ${q * 100} cm보다 ${few} cm 더 긴 길이이므로 ${q} m ${few} cm이다.`][bad],
          facts: { claimed: rows.map((row) => [row.expr, row.said]), claimedWant: false }
        });
      }, { standard: CONV }),
      H('h-units', '단위가 다른 두 길이의 차', '심8 ①10', (d) => {
        // 2 m 5 cm와 250 cm(수만 보면 같아 보인다), 2 m 5 cm와 203 cm(수만 보면 203이 더 커 보인다)
        const m = d.int(2, 8), s = d.int(3, 9), a = m * 100 + s, b = d.bool() ? m * 100 + s * 10 : a - d.int(1, s - 1), [p, q] = d.shuffle(NAMES), flip = d.bool();
        const values = flip ? [b, a] : [a, b], said = flip ? [LC(b), L(a)] : [L(a), LC(b)], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(a - b), other = d.until(() => d.pick([b - s, s, gap + 10]), (v) => v !== gap && v > 0);
        // 보기: 바른 답 / 수만 보고 긴 쪽을 거꾸로 고른 아이 / m를 떼고 cm의 수끼리만 뺀 아이(307 − 8) / 둘 다
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
        return C(`${nick(p)}의 끈의 길이는 ${said[0]}이고, ${nick(q)}의 끈의 길이는 ${said[1]}이다. 누구의 끈이 몇 cm 더 긴가?`, list.map(([who, n]) => `${[p, q][who]}, ${LC(n)}`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${L(a)}는 ${a} cm이다. ${values[0]} cm와 ${values[1]} cm를 비교하면 ${nick([p, q][winner])}의 끈이 ${gap} cm 더 길다.`,
          facts: { who: { values, options: list, exprs: flip ? [String(b), `${m}*100+${s}`] : [`${m}*100+${s}`, String(b)] }, unseen: [100] }
        });
      }, { standard: CONV }),
      H('h-zero', '눈금 0이 아닌 곳에서 잰 길이', '①20', (d) => {
        // 한끝이 눈금 10, 다른 쪽 끝이 눈금 123 → 1 m 13 cm (끝 눈금을 그대로 읽으면 1 m 23 cm)
        const from = d.pick([5, 10]), to = d.until(() => 100 + from + d.int(8, 14), (v) => v % 5 !== 0);
        return M('줄자로 나무 막대의 길이를 재려고 한다. 나무 막대의 길이는 몇 m 몇 cm인가?', ask(to - from), {
          figure: tape({ u: 6, stub: 13, lo: 95, hi: 125, things: [{ from, to }] }),
          explain: `나무 막대의 한끝이 눈금 0이 아니라 눈금 ${from}에 있다. 다른 쪽 끝의 눈금 ${to}에서 ${josa(from, '을/를')} 빼면 ${to - from} cm이고, ${to - from} cm는 ${L(to - from)}이다.`,
          facts: mc(`${tick(to)}-${from}`)
        });
      }, { standard: KNOW }),
      H('h-near', '더 가까운 곳과 거리의 차', '심24 ①41', (d) => {
        // 집에서 학교까지 85 m 70 cm, 도서관까지 77 m 16 cm → 도서관이 8 m 54 cm 더 가깝다.
        const [far, near] = pairDiff(d, d.pick(['plain', 'borrow']), [2, 9], [41, 78]), [p, q] = d.shuffle(['학교', '도서관', '공원', '놀이터', '병원']), flip = d.bool();
        const values = flip ? [far, near] : [near, far], winner = values[0] < values[1] ? 0 : 1, gap = far - near, other = gap + 100;
        // 보기: 바른 답 / 「더 가깝다」를 거리가 더 긴 쪽으로 읽은 아이 / m끼리 뺄 때 1을 잘못 받아내린 아이 / 둘 다
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
        return C(`집에서 ${p}까지의 거리는 ${L(values[0])}이고, 집에서 ${q}까지의 거리는 ${L(values[1])}이다. 집에서 어느 곳이 몇 m 몇 cm 더 가까운가?`, list.map(([who, n]) => `${[p, q][who]}, ${L(n)}`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `거리가 더 짧은 곳이 더 가깝다. ${L(near)}가 더 짧으므로 ${[p, q][winner]}까지가 더 가깝다. ${L(far)} − ${L(near)} = ${L(gap)}`,
          facts: { who: { values, options: list, exprs: values.map(X), smaller: true }, unseen: [100] }
        });
      }),
      H('h-shorter', '「더 짧다」로 주어진 길이', '심26', (d) => {
        // 가는 나보다 1 m 20 cm 더 짧다. 가가 5 m 25 cm이면 나는 6 m 45 cm (빼면 4 m 5 cm가 나온다)
        const [a, g] = pairSum(d, d.pick(['plain', 'carry']), [3, 7], [1, 2], (x, y) => cOf(x) > cOf(y));
        return M(`빨간색 끈은 파란색 끈보다 ${L(g)} 더 짧다. 빨간색 끈의 길이가 ${L(a)}일 때, 파란색 끈의 길이는 몇 m 몇 cm인가?`, ask(a + g), {
          explain: `빨간색 끈이 ${L(g)} 더 짧으므로 파란색 끈은 빨간색 끈보다 ${L(g)} 더 길다. ${L(a)} + ${L(g)} = ${L(a + g)}`, facts: mc(`${X(a)}+${X(g)}`)
        });
      }),
      H('h-fewer', '걸음 수로 한 걸음의 길이 비교하기', '심41 ①55', (d) => {
        // 같은 길이를 잰 걸음 수가 가장 적은 사람의 한 걸음이 가장 길다.
        const who = d.shuffle(NAMES).slice(0, 3), base = d.int(14, 24), steps = d.shuffle([base, base + d.int(2, 4), base - d.int(2, 4)]);
        return C(`세 사람이 같은 복도의 길이를 걸음으로 재었다. ${name(who[0], '은/는')} ${steps[0]}걸음, ${name(who[1], '은/는')} ${steps[1]}걸음, ${name(who[2], '은/는')} ${steps[2]}걸음이었다. 한 걸음의 길이가 가장 긴 사람은?`, who, steps.indexOf(Math.min.apply(null, steps)), {
          explain: '같은 길이를 잴 때 한 걸음이 길수록 적게 걷는다. 걸음 수가 가장 적은 사람의 한 걸음이 가장 길다.', facts: { choose: { exprs: steps.map(String), rule: 'min' } }
        });
      }, { standard: GUESS }),
      H('h-pace', '재는 단위가 다른 두 어림의 비교', '①58 심40', (d) => {
        // 양팔(약 1 m)로 6번 = 약 6 m, 두 걸음이 약 1 m인데 10걸음 = 약 5 m — 횟수는 10이 더 크다.
        const [p, q] = d.shuffle(NAMES), [arms, steps] = d.until(() => [d.int(4, 8), d.int(3, 9) * 2], ([x, y]) => y > x && y / 2 !== x && y - x !== Math.abs(x - y / 2));
        const values = [arms, steps / 2], winner = values[0] > values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]), other = steps - arms;
        // 보기: 바른 답 / 긴 쪽을 거꾸로 고른 아이 / 잰 횟수끼리 뺀 아이(10 − 6) / 둘 다
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
        return C(`${name(p, '은/는')} 양팔을 벌린 길이가 약 1 m이고, 긴 줄을 양팔을 벌린 길이로 ${arms}번 재었다. ${name(q, '은/는')} 두 걸음이 약 1 m이고, 다른 긴 줄을 ${steps}걸음으로 재었다. 누가 잰 줄이 약 몇 m 더 긴가?`,
          list.map(([who, n]) => `${[p, q][who]}, 약 ${n} m`), list.findIndex(([who, n]) => who === winner && n === gap), {
            explain: `${name(p, '이/가')} 잰 줄은 약 ${arms} m이다. ${name(q, '이/가')} 잰 줄은 두 걸음씩 ${steps / 2}번이므로 약 ${steps / 2} m이다. ${name([p, q][winner], '이/가')} 잰 줄이 약 ${gap} m 더 길다.`,
            facts: { who: { values, options: list, exprs: [`1*${arms}`, `${steps}/2`] }, unseen: [2] }
          });
      }, { standard: GUESS }),
      H('h-ten', '10 m보다 긴 것 찾기', '심46', (d) => {
        const n = d.pick([15, 20, 30]), right = `2학년 학생 ${n}명이 양팔을 벌리고 나란히 선 길이`, [many, thing] = d.pick([['수학책 10권을', '수학책'], ['지우개 20개를', '지우개']]);
        const list = d.shuffle([right,
          '연필 10자루를 한 줄로 이어 놓은 길이',                       // 10이라는 수만 본 아이
          '2학년 학생 5명이 양팔을 벌리고 나란히 선 길이',              // 양팔을 벌린 길이가 약 1 m인 줄은 알지만 5 m와 10 m를 견주지 않은 아이
          `${many} 한 줄로 이어 놓은 길이`]);   // 물건이 많으면 길다고 본 아이
        return C('길이가 10 m보다 긴 것은?', list, list.indexOf(right), {
          explain: `2학년 학생이 양팔을 벌린 길이는 약 1 m이다. ${n}명이 나란히 서면 약 ${n} m이고, 5명이 나란히 서면 약 5 m이다. 연필과 ${josa(thing, '은/는')} 1 m보다 훨씬 짧아서 여러 개를 이어도 10 m가 안 된다.`,
          facts: { truth: list.map((v) => v === right), want: true }
        });
      }, { standard: GUESS }),
      H('h-closer', '실제 길이에 더 가깝게 어림한 사람', '①49 심43', (d) => {
        // 실제 10 m 50 cm: 약 11 m 60 cm(차 1 m 10 cm), 약 9 m 30 cm(차 1 m 20 cm), 약 12 m(차 1 m 50 cm)
        // 가장 가까운 어림과 그다음 어림은 차가 10 cm만 다르고, 하나는 넘치고 하나는 모자라게 놓는다(차를 구해 보아야 가릴 수 있다).
        const who = d.shuffle(NAMES).slice(0, 3), t = d.until(() => {
          const base = d.int(6, 12) * 100 + d.pick([30, 40, 50, 60]), gaps = d.shuffle([40, 50, 60, 70, 80, 90, 110, 120, 130]).slice(0, 3).sort((x, y) => x - y), up = d.bool() ? 1 : -1;
          return { base, gaps, list: [base + up * gaps[0], base - up * gaps[1], base + (d.bool() ? 1 : -1) * gaps[2]] };
        }, (s) => s.gaps[1] - s.gaps[0] === 10 && s.list.every((v, i) => (v > s.base ? cOf(s.base) + cOf(s.gaps[i]) <= 99 : cOf(s.base) >= cOf(s.gaps[i]))));
        const real = t.base, guesses = d.shuffle(t.list);
        const off = guesses.map((v) => Math.abs(v - real));
        return C(`끈의 실제 길이는 ${L(real)}이다. 끈의 길이를 ${name(who[0], '은/는')} 약 ${L(guesses[0])}, ${name(who[1], '은/는')} 약 ${L(guesses[1])}, ${name(who[2], '은/는')} 약 ${L(guesses[2])}로 어림하였다. 실제 길이에 가장 가깝게 어림한 사람은?`, who, off.indexOf(Math.min.apply(null, off)), {
          explain: `어림한 길이와 실제 길이의 차는 ${who.map((w, i) => w + ' ' + L(off[i])).join(', ')}이다. 차가 가장 작은 사람이 가장 가깝게 어림하였다.`,
          facts: { closer: { expr: X(real), estimates: guesses } }
        });
      }, { standard: GUESS }),
      H('h-stretch', '늘어난 길이(단위가 섞인 차)', '①45 심21', (d) => {
        // 1 m 40 cm인 고무줄을 당겼더니 362 cm → 3 m 62 cm − 1 m 40 cm = 2 m 22 cm
        const [b, a] = pairDiff(d, d.pick(['plain', 'borrow']), [1, 2], [1, 2]);
        return M(`길이가 ${L(a)}인 고무줄을 잡아당겼더니 ${LC(b)}가 되었다. 고무줄이 늘어난 길이는 몇 m 몇 cm인가?`, ask(b - a), {
          explain: `${b} cm는 ${L(b)}이다. 늘어난 길이는 ${L(b)} − ${L(a)} = ${L(b - a)}이다.`, facts: mc(`${b}-${X(a)}`)
        });
      }),
      H('h-sum-diff', '합을 구한 뒤 다른 길이와의 차', '심25', (d) => {
        // ㉠ 8 m 13 cm + 2 m 40 cm ㉡ 9 m 51 cm → 10 m 53 cm − 9 m 51 cm = 1 m 2 cm
        const [a, b] = pairSum(d, d.pick(['plain', 'carry']), [3, 6], [2, 4], (x, y) => cOf(x) + cOf(y) >= 30 && cOf(x) + cOf(y) <= 70), s = a + b;
        const gap = d.int(1, 2) * 100 + d.pick([d.int(2, 9), d.int(11, 25)]), c = d.bool() ? s + gap : s - gap, big = Math.max(s, c), small = Math.min(s, c);
        return M('㉠과 ㉡의 길이의 차는 몇 m 몇 cm인가?', ask(gap), {
          figure: tagged([`${L(a)} + ${L(b)}`, L(c)]), explain: `㉠은 ${L(s)}이다. 긴 길이에서 짧은 길이를 빼면 ${L(big)} − ${L(small)} = ${L(gap)}이다.`,
          facts: mc(c > s ? `${X(c)}-(${X(a)}+${X(b)})` : `${X(a)}+${X(b)}-${X(c)}`)
        });
      }),
      H('h-height', '키로 높이 어림하기', '심32', (d) => {
        // 키가 1 m 20 cm인 사람의 키로 3번 → 약 3 m 60 cm
        const k = d.int(2, 3), h = 100 + d.pick(k === 2 ? [15, 20, 25, 30, 35] : [10, 15, 20, 25, 30]), who = d.pick(NAMES);
        return M(`${nick(who)}의 키는 ${L(h)}이다. 그림을 보고 나무의 높이를 어림하면 약 몇 m 몇 cm인가?`, ask(h * k, '약'), {
          figure: heights(L(h), k, '나무'), explain: `나무의 높이는 ${nick(who)}의 키로 ${k}번이다. ${Array.from({ length: k }, () => L(h)).join(' + ')} = ${L(h * k)}`,
          facts: mc(Array.from({ length: k }, () => X(h)).join('+'))
        });
      }, { standard: GUESS }),
      H('h-double', '줄자로 잰 길이의 2배', '심11', (d) => {
        // 끝 눈금 145 → 1 m 45 cm + 1 m 45 cm = 2 m 90 cm
        const to = d.until(() => 100 + d.int(12, 48), (v) => v % 5 !== 0);
        return M('줄자로 막대의 길이를 재었다. 창고의 긴 쪽의 길이는 막대의 길이의 약 2배이다. 창고의 긴 쪽의 길이는 약 몇 m 몇 cm인가?', ask(to * 2, '약'), {
          figure: tape(Object.assign({ stub: 4, things: [{ from: 0, to }] }, around(to))), explain: `막대의 길이는 ${to} cm, 곧 ${L(to)}이다. 2배는 두 번 더한 것이므로 ${L(to)} + ${L(to)} = ${L(to * 2)}이다.`,
          facts: mc(`${tick(to)}+${tick(to)}`)
        });
      }),
      H('h-span', '두 뼘의 길이로 잰 길이', '심34', (d) => {
        // 두 뼘이 약 40 cm, 6뼘 → 40 + 40 + 40 = 120 cm = 1 m 20 cm (같은 길이를 세 번만 더한다. 어른의 뼘이라 선생님으로 적는다)
        const two = d.pick([35, 40, 45]), n = 6, v = (two * n) / 2;
        return M(`선생님의 두 뼘의 길이는 약 ${two} cm이다. 선생님이 액자의 긴 쪽의 길이를 뼘으로 재었더니 ${n}뼘이었다. 액자의 긴 쪽의 길이는 약 몇 m 몇 cm인가?`, ask(v, '약'), {
          explain: `${n}뼘은 두 뼘씩 ${n / 2}번이다. ${Array.from({ length: n / 2 }, () => two + ' cm').join(' + ')} = ${v} cm이고, ${v} cm는 ${L(v)}이다.`, facts: Object.assign(mc(`${two}*${n}/2`), { unseen: [100, 2] })
        });
      }, { standard: GUESS }),
      H('h-stand', '받침 위에 서서 잰 높이', '심29', (d) => {
        // 25 cm 상자 위에서 1 m 49 cm → 키 1 m 24 cm → 40 cm 의자 위에서는 1 m 64 cm
        const who = d.pick(NAMES), [box1, box2] = d.until(() => [d.int(2, 5) * 5, d.int(3, 9) * 5], ([x, y]) => x !== y), tall = 100 + d.until(() => d.int(18, 42), (v) => v + box1 <= 95 && v + box2 <= 95 && v % 5 !== 0), seen = tall + box1;
        return M(`${name(who, '이/가')} 높이가 ${box1} cm인 상자 위에 올라섰더니 바닥에서 머리끝까지의 높이가 ${L(seen)}였다. ${name(who, '이/가')} 높이가 ${box2} cm인 의자 위에 올라서면 바닥에서 머리끝까지의 높이는 몇 m 몇 cm인가?`, ask(tall + box2), {
          explain: `${nick(who)}의 키는 ${L(seen)} − ${box1} cm = ${L(tall)}이다. 의자 위에 올라서면 ${L(tall)} + ${box2} cm = ${L(tall + box2)}이다.`, facts: mc(`${X(seen)}-${box1}+${box2}`)
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
