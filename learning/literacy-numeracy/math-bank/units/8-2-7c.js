// 중학교 2학년 2학기 7단원 확률 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-2-7a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 「또는」이면 두 확률을 언제나 그대로 더한다(두 조건에 모두 맞는 경우를 두 번 센다).
//  - 「적어도」라는 말이 없으면 1에서 빼는 길을 떠올리지 못한다. 세 사람이 한 목표물을 쏘면 세 확률을 곱하거나(모두 맞혀야 한다고 읽는다) 더한다(1을 넘는다).
//  - 결과가 몇 가지인지만 세어 확률을 정한다. 가위바위보에서 이길 확률을 1/2로 잡는다(이기거나 지거나 — 비기는 경우를 빠뜨린다). 일어날 가능성이 같은 경우로 세어야 한다.
//  - 기울기만 같으면 평행이라고 여겨, 두 직선이 일치하는 경우까지 센다.
//  - 짧은 두 변의 길이의 합이 가장 긴 변의 길이와 같아도 삼각형이 된다고 여긴다.
//  - 뽑은 것을 다시 넣지 않을 때, 나중에 뽑는 사람의 확률을 앞사람의 결과 하나만 놓고 구한다(k/(n − 1) 또는 (k − 1)/(n − 1)). 앞사람이 당첨된 때와 아닌 때로 나누어 더해야 한다.
//  - 확률은 세어 보아야만 알 수 있다고 여겨, 어느 경우에나 일어나는 사건(확률 1)을 알아채지 못한다.
//
// 실력에는 ① 문제의 상황에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
//  ②에는 과제 글이 정한 「두 갈래로 나누어 곱하고 더하는 꼴」 넷(주머니를 고른 다음 공 꺼내기, 비가 오는지에 따라 달라지는 이길 확률, 이틀 이어지는 날씨, 세 번 가운데 두 번 넘게)을 한 유형씩,
//  그리고 세 갈래를 더하는 것(세 사람 가운데 두 사람만), 확률 둘로 개수 둘을 거꾸로 구하는 것, 두 눈의 수의 조건을 도형·직선의 식으로 옮겨 세는 것, 수의 성질(홀짝, 유한소수)로 옮긴 뒤 구하는 것,
//  곱으로 주어진 확률에서 한쪽을 되구하는 것, 세 번째 경기에서 우승이 정해지는 것, 세 사람의 가위바위보(27가지를 갈라 세기)를 실었다.
// 「동시에」를 한 번 곱하는 것, 일어나지 않을 확률을 한 번 쓰는 것, 두 사건을 한 번 더하는 것, 「한 사람만」「적어도 한 사람이」는 기본 묶음(8-2-7b.js)에 있다.
// 묻는 말: 확률은 「~일 확률은?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, frac, C, M } = B.kit;
  const { range, gcd, lcm, Q, qadd, qmul, tx, js, tail, V, nb, poly, lin, MINUS } = B.kit.mid;
  const G = B.kit.mgeo, K = B.kit.m827;
  const { STD, P, non, DICE, pairsSaid, red, two, AB, pt, ansP, kn, vf, probs } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①58' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const times = (list) => list.reduce((x, v) => qmul(x, v), Q(1));
  const small = (max) => (list) => list.every((x) => x.q <= max);

  B.addGroup('8-2-7', {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-or-overlap', '겹치는 두 조건의 「또는」', '심11 / 기본 ①27·44', (d) => {
        // 함정: a의 배수일 확률과 b의 배수일 확률을 그대로 더하는 아이(두 수의 공배수를 두 번 센다). 두 사건이 동시에 일어날 수 있으면 겹치는 경우를 한 번만 세어야 한다.
        const [m, a, b] = d.until(() => [d.pick([20, 24, 30, 40, 50]), d.int(2, 6), d.int(3, 8)], ([m0, a0, b0]) => a0 < b0 && b0 % a0 !== 0 && lcm(a0, b0) <= m0);
        const all = range(1, m), hit = all.filter((v) => v % a === 0 || v % b === 0), both = all.filter((v) => v % a === 0 && v % b === 0), ka = Math.floor(m / a), kb = Math.floor(m / b);
        return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드 중에서 한 장을 뽑을 때, ${a}의 배수 또는 ${b}의 배수가 적힌 카드가 나올 확률은?`, P(hit.length, m), {
          explain: `${a}의 배수는 ${ka}개, ${b}의 배수는 ${kb}개이다. 그런데 ${both.slice(0, -1).concat([josa(both[both.length - 1], '은/는')]).join(', ')} ${a}의 배수이면서 ${b}의 배수이므로 두 번 세었다. 조건에 맞는 수는 ${ka} + ${kb} − ${both.length} = ${hit.length}(개)이므로 구하는 확률은 ${red(hit.length, m)}이다.`,
          facts: { value: `(${ka}+${kb}-${Math.floor(m / lcm(a, b))})/${m}`, unseen: [ka, kb, Math.floor(m / lcm(a, b))] } });
      }),
      H('hard-target', '「적어도」라는 말이 없는 「적어도 하나」', '심28 / 기본 ①38', (d) => {
        // 함정: 세 확률을 곱하는 아이(세 사람이 모두 맞혀야 목표물이 맞는다고 읽는다), 세 확률을 더하는 아이(1을 넘는다).
        //  목표물은 한 사람만 맞혀도 맞으므로 1 − (세 사람 모두 맞히지 못할 확률)이다.
        const ps = probs(d, 3, small(5)), none = times(ps.map(non)), ans = non(none);
        return ansP(`목표물을 맞힐 확률이 각각 ${ps.map(tx).join(', ')}인 세 선수 A, B, C가 한 목표물을 향해 동시에 화살을 한 발씩 쏠 때, 목표물이 화살에 맞을 확률은?`, ans, {
          explain: `목표물은 한 사람만 맞혀도 맞으므로 적어도 한 사람이 맞힐 확률을 구한다. 세 사람 모두 맞히지 못할 확률은 ${ps.map((x) => tx(non(x))).join(' × ')} = ${tx(none)}이므로 구하는 확률은 1 − ${tx(none)} = ${tx(ans)}이다.`,
          facts: vf(`1-${ps.map((x) => `(1-${js(x)})`).join('*')}`) });
      }),
      H('hard-parallel', '두 직선이 평행할 확률', '심9 / 기본 ②13', (d) => {
        // 함정: 기울기만 같으면 평행이라고 여겨, y절편까지 같은 경우(두 직선이 일치한다)를 함께 세는 아이. y절편이 주사위의 눈이 될 수 없는 수이면 뺄 것이 없다.
        const m = d.int(2, 6), n = d.pick([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 7, 8, -1, -2]), hit = DICE.filter(([a, b]) => a === m && b !== n), inside = n >= 1 && n <= 6, shown = n < 0 ? MINUS + -n : n;
        return ansP(`${AB}, 두 직선 ${nb(`${V('y')} = ${lin(m, n)}`)}, ${nb(`${V('y')} = ${V('a')}${V('x')} + ${V('b')}`)}가 서로 평행할 확률은?`, P(hit.length, 36), {
          explain: `두 직선이 평행하려면 기울기는 같고 ${V('y')}절편은 달라야 하므로 ${nb(`${V('a')} = ${m}`)}이고 ${nb(`${V('b')} ≠ ${shown}`)}이어야 한다. ${inside ? `${nb(`${V('b')} = ${n}`)}이면 두 직선이 일치하므로 ${V('b')}의 값은 ${josa(n, '을/를')} 뺀 5가지이다.` : `주사위의 눈은 ${n < 0 ? MINUS : ''}${josa(Math.abs(n), '이/가')} 될 수 없으므로 ${V('b')}의 값은 1부터 6까지 6가지가 모두 된다.`} 따라서 구하는 확률은 ${red(hit.length, 36)}이다.`,
          facts: kn(inside ? 5 : 6, 36) });
      }),
      H('hard-triangle', '막대 세 개로 삼각형이 만들어질 확률', '심20 / 기본 ①22', (d) => {
        // 함정: 짧은 두 변의 길이의 합이 가장 긴 변의 길이와 같은 경우를 삼각형으로 세는 아이. 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 작아야 한다.
        const tri = (v) => [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]].map((ix) => ix.map((i) => v[i]));
        const L = d.until(() => d.shuffle(range(2, 12)).slice(0, 4).sort((x, y) => x - y), (v) => { const t = tri(v), ok = t.filter(([a, b, c]) => a + b > c).length; return t.some(([a, b, c]) => a + b === c) && ok >= 1 && ok <= 3; });
        const all = tri(L), good = all.filter(([a, b, c]) => a + b > c), flat = all.filter(([a, b, c]) => a + b === c), said = (t) => `(${t.join(', ')})`;
        return ansP(`길이가 각각 ${L.map((v) => v + ' cm').join(', ')}인 막대 4개 중에서 3개를 골라 삼각형을 만들려고 한다. 이때 삼각형이 만들어질 확률은?`, P(good.length, 4), {
          explain: `3개를 고르는 경우는 ${all.map(said).join(', ')}의 4가지이다. 가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작아야 삼각형이 만들어지므로 삼각형이 되는 것은 ${good.map(said).join(', ')}의 ${good.length}가지이다. ${flat.map((t) => `${said(t)}는 ${t[0]} + ${t[1]} = ${t[2]}이므로`).join(', ')} 삼각형이 만들어지지 않는다. 따라서 구하는 확률은 ${red(good.length, 4)}이다.`,
          facts: kn(4 - all.filter(([a, b, c]) => c >= a + b).length, 4) });
      }),
      H('hard-later-draw', '다시 넣지 않을 때 나중에 뽑는 사람이 당첨될 확률', '심45·48 / 기본 ①68·69', (d) => {
        // 함정: 앞사람이 무엇을 뽑았는지 한쪽으로 정해 놓고 k/(m − 1)이나 (k − 1)/(m − 1)로 답하는 아이. 앞사람이 당첨된 때와 아닌 때로 나누어 더해야 한다(답은 먼저 뽑을 때와 같아진다).
        const [A, Bn] = two(d), m = d.pick([8, 9, 10, 12]), k = d.int(2, 4), x = qmul(P(k, m), P(k - 1, m - 1)), y = qmul(P(m - k, m), P(k, m - 1)), ans = qadd(x, y);
        return ansP(`${m}개의 제비 중에 당첨 제비가 ${k}개 들어 있다. ${name(A, '이/가')} 먼저 한 개를 뽑고 이어서 ${name(Bn, '이/가')} 한 개를 뽑을 때, ${name(Bn, '이/가')} 당첨 제비를 뽑을 확률은? (단, 뽑은 제비는 다시 넣지 않는다.)`, ans, {
          explain: `${name(A, '이/가')} 당첨 제비를 뽑은 경우에는 남은 ${m - 1}개 중 당첨 제비가 ${k - 1}개이므로 ${frac(k, m)} × ${frac(k - 1, m - 1)} = ${tx(x)}이다. ${name(A, '이/가')} 당첨 제비를 뽑지 못한 경우에는 남은 ${m - 1}개 중 당첨 제비가 ${k}개이므로 ${frac(m - k, m)} × ${frac(k, m - 1)} = ${tx(y)}이다. 따라서 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`,
          facts: { value: `${k}/${m}` } });
      }),
      H('hard-pentagon', '반드시 일어나는 사건임을 알아채기', '심3', (d) => {
        // 함정: 삼각형은 10개이고 그 가운데 몇 개만 이등변삼각형일 것이라고 어림하는 아이.
        //  1/2: 이웃한 세 꼭짓점으로 만든 5개만 이등변삼각형이라고 여긴다. 3/5, 4/5: 다 그려 보지 않고 어림한다.
        //  세 변은 정오각형의 변 아니면 대각선 두 가지뿐이므로 어느 세 꼭짓점을 골라도 두 변의 길이가 같다(반드시 일어나는 사건).
        const b = G.Board(), pts = G.regPts(5, 62), names = G.vnames(pts), center = [pts.reduce((s, p) => s + p[0], 0) / 5, pts.reduce((s, p) => s + p[1], 0) / 5];
        b.poly(pts, G.WHITE); pts.forEach((p, i) => b.name(p, names[i], G.dirOf(center, p)));
        const opts = d.shuffle([frac(1, 2), frac(3, 5), frac(4, 5), '1']);
        return C('다음 그림과 같은 정오각형 ABCDE의 다섯 꼭짓점 중에서 세 점을 골라 그 세 점을 꼭짓점으로 하는 삼각형을 만들 때, 만든 삼각형이 이등변삼각형일 확률은?', opts, opts.indexOf('1'), { figure: b.svg('정오각형 ABCDE: 맨 위 꼭짓점이 A이고 시계 반대 방향으로 B, C, D, E의 차례이다.'),
          explain: '정오각형의 변 5개의 길이는 모두 같고 대각선 5개의 길이도 모두 같다. 삼각형의 세 변은 저마다 정오각형의 변이거나 대각선이므로, 어느 세 꼭짓점을 골라도 세 변 가운데 적어도 두 변의 길이가 같다. 반드시 일어나는 사건이므로 구하는 확률은 1이다.', facts: { truth: opts.map((o) => o === '1'), want: true } });
      }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-pick-bag', '주머니를 고른 다음 공 꺼내기', '기본 ①58', (d) => {
        // ② 주머니를 고를 확률(문제에 밝혔다)과 그 주머니에서 그 색이 나올 확률을 갈래마다 곱해 더한다.
        const [w1, b1, w2, b2] = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 6), d.int(2, 6)], (v) => v[0] * v[3] !== v[1] * v[2]), coin = d.bool(), pa = coin ? Q(1, 2) : Q(1, 3), pb = non(pa), white = d.bool(), col = white ? '흰' : '검은';
        const k1 = white ? w1 : b1, k2 = white ? w2 : b2, x = qmul(pa, P(k1, w1 + b1)), y = qmul(pb, P(k2, w2 + b2)), ans = qadd(x, y);
        const how = coin ? '동전 한 개를 던져 앞면이 나오면 주머니 A에서, 뒷면이 나오면 주머니 B에서 공을 한 개 꺼낼 때' : '주사위 한 개를 던져 3의 배수의 눈이 나오면 주머니 A에서, 그 밖의 눈이 나오면 주머니 B에서 공을 한 개 꺼낼 때';
        return ansP(`주머니 A에는 흰 공 ${w1}개, 검은 공 ${b1}개가 들어 있고, 주머니 B에는 흰 공 ${w2}개, 검은 공 ${b2}개가 들어 있다. ${how}, ${col} 공이 나올 확률은?`, ans, {
          explain: `주머니 A에서 꺼낼 확률은 ${tx(pa)}, 주머니 B에서 꺼낼 확률은 ${tx(pb)}이다. 주머니 A에서 ${col} 공을 꺼낼 확률은 ${tx(pa)} × ${frac(k1, w1 + b1)} = ${tx(x)}, 주머니 B에서 ${col} 공을 꺼낼 확률은 ${tx(pb)} × ${frac(k2, w2 + b2)} = ${tx(y)}이므로 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`,
          facts: { value: `${js(pa)}*(${k1}/(${w1}+${b1}))+${js(pb)}*(${k2}/(${w2}+${b2}))`, unseen: [1, 2, 3] } });
      }),
      H('hard-rain-win', '비가 오는지에 따라 달라지는 이길 확률', '기본 ①59', (d) => {
        // ② 비가 오는 갈래와 오지 않는 갈래로 나누어 (그 날씨일 확률) × (그 날씨에서 이길 확률)을 더한다.
        const r = d.pick([20, 30, 40, 60, 70]), [p1, p2] = probs(d, 2, small(5)), pr = P(r, 100), x = qmul(pr, p1), y = qmul(non(pr), p2), ans = qadd(x, y);
        return ansP(`어느 축구팀이 경기에서 이길 확률은 비가 오는 날에는 ${tx(p1)}, 비가 오지 않는 날에는 ${tx(p2)}이다. 경기가 열리는 날에 비가 올 확률이 ${r} %일 때, 이 팀이 경기에서 이길 확률은?`, ans, {
          explain: `비가 올 확률은 ${r} % = ${tx(pr)}, 비가 오지 않을 확률은 1 − ${tx(pr)} = ${tx(non(pr))}이다. 비가 오고 이길 확률은 ${tx(pr)} × ${tx(p1)} = ${tx(x)}, 비가 오지 않고 이길 확률은 ${tx(non(pr))} × ${tx(p2)} = ${tx(y)}이므로 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`,
          facts: vf(`(${r}/100)*${js(p1)}+(1-${r}/100)*${js(p2)}`) });
      }),
      H('hard-weather', '전날의 날씨에 따라 달라지는 확률로 이틀 뒤 구하기', '심51 / 기본 ①60 ②66', (d) => {
        // ② 가운데 날에 비가 오는 갈래와 오지 않는 갈래로 나눈다. 오지 않는 갈래에서는 다른 확률을 쓴다.
        const [p, q] = probs(d, 2, small(6)), [d0, d1, d2] = d.pick([['월', '화', '수'], ['화', '수', '목'], ['수', '목', '금']]), x = qmul(p, p), y = qmul(non(p), q), ans = qadd(x, y);
        return ansP(`어느 지역에서 비가 온 날의 다음 날에 비가 올 확률은 ${tx(p)}, 비가 오지 않은 날의 다음 날에 비가 올 확률은 ${tx(q)}이다. ${d0}요일에 비가 왔을 때, 이틀 뒤인 ${d2}요일에 비가 올 확률은?`, ans, {
          explain: `${d1}요일에 비가 오고 ${d2}요일에도 비가 올 확률은 ${tx(p)} × ${tx(p)} = ${tx(x)}이다. ${d1}요일에 비가 오지 않고 ${d2}요일에 비가 올 확률은 (1 − ${tx(p)}) × ${tx(q)} = ${tx(y)}이다. 따라서 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`,
          facts: vf(`${js(p)}*${js(p)}+(1-${js(p)})*${js(q)}`) });
      }),
      H('hard-shots', '세 번 가운데 두 번 넘게 맞힐 확률', '기본 ①61', (d) => {
        // ② 두 번만 맞히는 갈래 셋(맞히지 못하는 차례가 첫 번째·두 번째·세 번째)과 세 번 모두 맞히는 갈래를 더한다.
        const p = d.pick([Q(2, 3), Q(3, 4), Q(1, 3), Q(3, 5), Q(4, 5), Q(2, 5), Q(1, 4)]), twice = times([p, p, non(p)]), thrice = times([p, p, p]), ans = qadd(qmul(Q(3), twice), thrice);
        return ansP(`화살을 한 번 쏘아 과녁을 맞힐 확률이 ${tx(p)}인 양궁 선수가 화살을 세 번 쏠 때, 과녁을 두 번 이상 맞힐 확률은?`, ans, {
          explain: `두 번만 맞히는 경우는 맞히지 못하는 차례가 첫 번째, 두 번째, 세 번째인 3가지이고 그 확률은 저마다 ${tx(p)} × ${tx(p)} × ${tx(non(p))} = ${tx(twice)}이다. 세 번 모두 맞힐 확률은 ${tx(p)} × ${tx(p)} × ${tx(p)} = ${tx(thrice)}이다. 따라서 구하는 확률은 ${tx(twice)} × 3 + ${tx(thrice)} = ${tx(ans)}이다.`,
          facts: vf(`3*${js(p)}*${js(p)}*(1-${js(p)})+${js(p)}*${js(p)}*${js(p)}`, [3]) });
      }),
      H('hard-two-of-three', '세 사람 가운데 두 사람만 해낼 확률', '심35·46', (d, n) => {
        // ② 누가 못 하는지에 따라 세 갈래로 나누고, 갈래마다 세 확률을 곱해 더한다.
        //  차례 0: 서로 영향을 주지 않는 세 사람(못 하는 사람의 「합격하지 못할 확률」을 곱한다). 차례 1: 다시 넣지 않는 제비(뽑을 때마다 전체 개수와 남은 당첨 제비가 달라진다).
        if (n === 1) {
          const [m, k] = d.until(() => [d.int(6, 8), d.int(3, 4)], ([m0, k0]) => m0 - k0 >= 2), lose = m - k, idx = range(0, m - 1), total = m * (m - 1) * (m - 2);
          let hit = 0; for (const a of idx) for (const b of idx) for (const c of idx) if (a !== b && b !== c && a !== c && [a, b, c].filter((v) => v < k).length === 2) hit += 1;
          const each = Q(k * (k - 1) * lose, total);
          return ansP(`${m}개의 제비 중에 당첨 제비가 ${k}개 들어 있다. A, B, C 세 사람이 이 차례로 제비를 한 개씩 뽑을 때, 세 사람 중 두 사람만 당첨 제비를 뽑을 확률은? (단, 뽑은 제비는 다시 넣지 않는다.)`, P(hit, total), {
            explain: `C만 당첨 제비를 뽑지 못할 확률은 ${frac(k, m)} × ${frac(k - 1, m - 1)} × ${frac(lose, m - 2)} = ${tx(each)}, B만 뽑지 못할 확률은 ${frac(k, m)} × ${frac(lose, m - 1)} × ${frac(k - 1, m - 2)} = ${tx(each)}, A만 뽑지 못할 확률은 ${frac(lose, m)} × ${frac(k, m - 1)} × ${frac(k - 1, m - 2)} = ${tx(each)}이다. 따라서 구하는 확률은 ${tx(each)} × 3 = ${tx(P(hit, total))}이다.`,
            facts: vf(`3*${k}*(${k}-1)*(${m}-${k})/(${m}*(${m}-1)*(${m}-2))`, [2, 3]) });
        }
        const [p, q, r] = probs(d, 3, small(5)), x = times([p, q, non(r)]), y = times([p, non(q), r]), z = times([non(p), q, r]), ans = qadd(qadd(x, y), z);
        return ansP(`어떤 시험에서 A, B, C 세 사람이 합격할 확률은 각각 ${tx(p)}, ${tx(q)}, ${tx(r)}이다. 세 사람 중 두 사람만 합격할 확률은?`, ans, {
          explain: `A, B만 합격할 확률은 ${tx(p)} × ${tx(q)} × ${tx(non(r))} = ${tx(x)}, A, C만 합격할 확률은 ${tx(p)} × ${tx(non(q))} × ${tx(r)} = ${tx(y)}, B, C만 합격할 확률은 ${tx(non(p))} × ${tx(q)} × ${tx(r)} = ${tx(z)}이다. 따라서 구하는 확률은 ${tx(x)} + ${tx(y)} + ${tx(z)} = ${tx(ans)}이다.`,
          facts: vf(`${js(p)}*${js(q)}*(1-${js(r)})+${js(p)}*(1-${js(q)})*${js(r)}+(1-${js(p)})*${js(q)}*${js(r)}`) });
      }, { count: 2 }),
      H('hard-ball-counts', '확률 둘로 두 가지 구슬의 개수 구하기', '기본 ②72', (d) => {
        // ② 빨간 구슬의 확률로 전체 개수를 거꾸로 구하고 → 파란 구슬의 개수 → 나머지인 노란 구슬의 개수.
        const [r, x, y] = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(2, 9)], (v) => new Set(v).size === 3 && [12, 15, 18, 20, 24].includes(v[0] + v[1] + v[2]) && Q(v[0], v[0] + v[1] + v[2]).p !== v[0]), all = r + x + y, p1 = P(r, all), p2 = P(x, all), X = V('x'), Y = V('y');
        return M(`빨간 구슬 ${r}개, 파란 구슬 ${X}개, 노란 구슬 ${Y}개가 들어 있는 주머니에서 구슬 한 개를 꺼낼 때, 빨간 구슬이 나올 확률은 ${tx(p1)}, 파란 구슬이 나올 확률은 ${tx(p2)}이다. ${X}, ${Y}의 값을 각각 구하시오.`, [{ label: X, answer: x }, { label: Y, answer: y }], { shown: `${X} = ${x}, ${Y} = ${y}`,
          explain: `빨간 구슬 ${r}개가 전체의 ${tx(p1)}이므로 전체 구슬은 ${r} ÷ ${tx(p1)} = ${all}(개)이다. 파란 구슬은 ${all} × ${tx(p2)} = ${x}(개)이고, 노란 구슬은 ${all} − ${r} − ${x} = ${y}(개)이다.`,
          facts: { calc: [[`${r}*${p1.q}/${p1.p}*${p2.p}/${p2.q}`, 0], [`${r}*${p1.q}/${p1.p}-${r}-${r}*${p1.q}/${p1.p}*${p2.p}/${p2.q}`, 1]] } });
      }),
      H('hard-dice-area', '두 눈의 수로 정해지는 도형의 넓이', '심12 / 기본 ②14', (d, n) => {
        // ② 넓이를 ab 의 식으로 옮긴다 → ab 의 값 → 순서쌍 세기 → 확률. 차례 0: 직사각형(4ab). 차례 1: 직선과 두 축으로 둘러싸인 삼각형(ab/2).
        const k = d.pick(n === 0 ? [4, 6, 8, 10, 12, 15, 18, 20] : [4, 6, 8, 10, 12, 18, 20, 24]), hit = DICE.filter(([a, b]) => a * b === k), a_ = V('a'), b_ = V('b'), other = range(1, 6).filter((a) => k % a === 0 && k / a <= 6).length;
        if (n === 0) return ansP(`${AB}, 좌표평면 위의 네 점 P${pt(a_, b_)}, Q${pt(MINUS + a_, b_)}, R${pt(MINUS + a_, MINUS + b_)}, S${pt(a_, MINUS + b_)}를 꼭짓점으로 하는 사각형 PQRS의 넓이가 ${4 * k}일 확률은?`, P(hit.length, 36), {
          explain: `사각형 PQRS는 가로의 길이가 2${a_}, 세로의 길이가 2${b_}인 직사각형이므로 넓이는 ${nb(`2${a_} × 2${b_} = 4${a_}${b_}`)}이다. ${nb(`4${a_}${b_} = ${4 * k}`)}에서 ${nb(`${a_}${b_} = ${k}`)}이고, 이를 만족시키는 순서쌍 ${pt(a_, b_)}는 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, 36)}이다.`, facts: kn(other, 36) });
        return ansP(`${AB}, 직선 ${nb(`${V('y')} = ${MINUS}${frac(b_, a_)}${V('x')} + ${b_}`)}와 ${V('x')}축, ${V('y')}축으로 둘러싸인 도형의 넓이가 ${k / 2}일 확률은?`, P(hit.length, 36), {
          explain: `이 직선의 ${V('x')}절편은 ${a_}, ${V('y')}절편은 ${b_}이므로 둘러싸인 도형은 밑변의 길이가 ${a_}, 높이가 ${b_}인 직각삼각형이고 넓이는 ${nb(`${frac(1, 2)} × ${a_} × ${b_}`)}이다. ${nb(`${frac(1, 2)}${a_}${b_} = ${k / 2}`)}에서 ${nb(`${a_}${b_} = ${k}`)}이고, 이를 만족시키는 순서쌍 ${pt(a_, b_)}는 ${pairsSaid(hit)}이므로 구하는 확률은 ${red(hit.length, 36)}이다.`, facts: kn(other, 36) });
      }, { count: 2 }),
      H('hard-meet', '두 직선이 한 점에서 만날 확률', '심10', (d) => {
        // ② 「한 점에서 만난다」를 「기울기가 다르다」로 옮기고 → 기울기가 같은 경우를 세어 → 1에서 뺀다.
        const [p, q] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), c = d.int(1, 6), r = d.int(1, 9), same = DICE.filter(([a, b]) => a * q === b * p), a_ = V('a'), b_ = V('b'), co = (v) => (v === 1 ? '' : v);
        return ansP(`${AB}, 두 직선 ${nb(`${a_}${V('x')} + ${b_}${V('y')} = ${c}`)}, ${nb(`${poly([[p, V('x')], [q, V('y')]])} = ${r}`)}${tail(r, '이/가')} 한 점에서 만날 확률은?`, P(36 - same.length, 36), {
          explain: `두 직선이 한 점에서 만나려면 기울기가 달라야 한다. 두 직선의 기울기는 ${MINUS}${frac(a_, b_)}, ${MINUS}${frac(p, q)}이므로 기울기가 같은 경우는 ${nb(`${co(q)}${a_} = ${co(p)}${b_}`)}인 ${pairsSaid(same)}이고 그 확률은 ${red(same.length, 36)}이다. 따라서 구하는 확률은 1 − ${tx(P(same.length, 36))} = ${tx(P(36 - same.length, 36))}이다.`,
          facts: vf(`1-${Math.floor(6 / Math.max(p, q))}/36`, [Math.floor(6 / Math.max(p, q)), 36]) });
      }),
      H('hard-parity', '두 수의 곱·합의 홀짝', '심30·37 / 기본 ②60', (d, n) => {
        const [p, q] = probs(d, 2, (l) => l.every((x) => x.q !== 2 && x.q <= 6)), a_ = V('a'), b_ = V('b');
        if (n === 0) {
          // ② 곱이 짝수 ↔ 「둘 다 홀수」가 아니다 → 홀수일 확률을 각각 구해 곱하고 → 1에서 뺀다.
          const odd = qmul(non(p), non(q)), ans = non(odd);
          return ansP(`두 자연수 ${a_}, ${b_}가 짝수일 확률이 각각 ${tx(p)}, ${tx(q)}일 때, 두 수의 곱 ${a_}${b_}가 짝수일 확률은?`, ans, {
            explain: `두 수의 곱이 홀수인 경우는 두 수가 모두 홀수일 때뿐이다. ${a_}, ${b_}가 홀수일 확률은 각각 1 − ${tx(p)} = ${tx(non(p))}, 1 − ${tx(q)} = ${tx(non(q))}이므로 곱이 홀수일 확률은 ${tx(non(p))} × ${tx(non(q))} = ${tx(odd)}이다. 따라서 곱이 짝수일 확률은 1 − ${tx(odd)} = ${tx(ans)}이다.`, facts: vf(`1-(1-${js(p)})*(1-${js(q)})`) });
        }
        // ② 합의 홀짝을 두 갈래(하나만 홀수 / 둘이 같은 쪽)로 옮긴 뒤 곱하고 더한다.
        const odd = d.bool(), x = odd ? qmul(p, non(q)) : qmul(p, q), y = odd ? qmul(non(p), q) : qmul(non(p), non(q)), ans = qadd(x, y);
        const told = odd ? `두 수의 합이 홀수인 경우는 한 수만 홀수일 때이다. ${a_}만 홀수일 확률은 ${tx(p)} × (1 − ${tx(q)}) = ${tx(x)}, ${b_}만 홀수일 확률은 (1 − ${tx(p)}) × ${tx(q)} = ${tx(y)}`
          : `두 수의 합이 짝수인 경우는 두 수가 모두 홀수이거나 모두 짝수일 때이다. 모두 홀수일 확률은 ${tx(p)} × ${tx(q)} = ${tx(x)}, 모두 짝수일 확률은 (1 − ${tx(p)}) × (1 − ${tx(q)}) = ${tx(y)}`;
        return ansP(`두 자연수 ${a_}, ${b_}가 홀수일 확률이 각각 ${tx(p)}, ${tx(q)}일 때, 두 수의 합 ${nb(`${a_} + ${b_}`)}가 ${odd ? '홀수' : '짝수'}일 확률은?`, ans, { explain: `${told}이므로 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`,
          facts: vf(odd ? `${js(p)}*(1-${js(q)})+(1-${js(p)})*${js(q)}` : `${js(p)}*${js(q)}+(1-${js(p)})*(1-${js(q)})`) });
      }, { count: 2 }),
      H('hard-back-solve', '곱으로 주어진 확률에서 한쪽 확률을 되구하기', '심38', (d) => {
        // ② 틀릴 확률을 뒤집어 맞힐 확률로 → 곱에서 나누어 다른 쪽 확률 → 다시 뒤집어 곱한다.
        const who = d.pick(NAMES), [pa, pb] = probs(d, 2, (l) => qmul(l[0], l[1]).q <= 40), fail = non(pa), joint = qmul(pa, pb), ans = qmul(pa, non(pb));
        return ansP(`${name(who, '이/가')} 두 문제 A, B를 푼다. A 문제를 틀릴 확률은 ${tx(fail)}이고, 두 문제를 모두 맞힐 확률은 ${tx(joint)}이다. 이때 A 문제는 맞히고 B 문제는 틀릴 확률은?`, ans, {
          explain: `A 문제를 맞힐 확률은 1 − ${tx(fail)} = ${tx(pa)}이다. (A 문제를 맞힐 확률) × (B 문제를 맞힐 확률) = ${tx(joint)}이므로 B 문제를 맞힐 확률은 ${tx(joint)} ÷ ${tx(pa)} = ${tx(pb)}이다. 따라서 구하는 확률은 ${tx(pa)} × (1 − ${tx(pb)}) = ${tx(ans)}이다.`,
          facts: vf(`(1-${js(fail)})-${js(joint)}`) });
      }),
      H('hard-finite', '뽑은 수가 분자인 분수가 유한소수일 확률', '심19', (d) => {
        // ② 분모를 소인수분해하여 → 약분되어야 할 수(2, 5가 아닌 소인수의 곱)를 찾고 → 그 수의 배수를 세어 → 확률.
        const fin = (a, D) => { let x = D / gcd(a, D); while (x % 2 === 0) x /= 2; while (x % 5 === 0) x /= 5; return x === 1; };
        const [m, D] = d.until(() => [d.pick([20, 30, 40, 50]), d.pick([12, 24, 28, 30, 36, 42, 45, 60, 70, 75, 90, 110, 120, 140, 150])], ([m0, D0]) => { const k = range(1, m0).filter((a) => fin(a, D0)).length; return k >= 2 && k <= m0 / 2; });
        const fac = []; let rest = D; for (let f = 2; rest > 1; f += 1) { let e = 0; while (rest % f === 0) { rest /= f; e += 1; } if (e) fac.push([f, e]); }
        const core = fac.filter(([f]) => f !== 2 && f !== 5).reduce((s, [f, e]) => s * f ** e, 1), hit = range(1, m).filter((a) => fin(a, D)).length, a_ = V('a');
        return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 구슬 ${m}개가 들어 있는 주머니에서 구슬 한 개를 꺼내 그 구슬에 적힌 수를 ${a_}라 할 때, 분수 ${frac(a_, D)}가 유한소수로 나타내어질 확률은?`, P(hit, m), {
          explain: `${nb(`${D} = ${fac.map(([f, e]) => f + (e > 1 ? `<sup>${e}</sup>` : '')).join(' × ')}`)}이다. 기약분수로 고쳤을 때 분모의 소인수가 2나 5뿐이어야 유한소수가 되므로 ${a_}는 ${core}의 배수이어야 한다. 1부터 ${m}까지의 자연수 중 ${core}의 배수는 ${hit}개이므로 구하는 확률은 ${red(hit, m)}이다.`,
          facts: kn(Math.floor(m / core), m) });
      }),
      H('hard-best-of-three', '세 번째 경기에서 우승이 결정될 확률', '심53 / 기본 ②64', (d) => {
        // ② 세 번째 경기까지 가려면 앞의 두 경기가 1승 1패여야 한다(차례가 둘) → 갈래마다 세 확률을 곱해 더한다.
        const p = d.pick([Q(2, 5), Q(3, 5), Q(1, 3), Q(2, 3), Q(1, 4), Q(3, 4)]), one = times([p, non(p), p]), ans = qadd(one, one);
        return ansP(`A, B 두 팀이 경기를 하여 먼저 두 번 이기는 팀이 우승한다. 한 경기에서 A 팀이 이길 확률은 ${tx(p)}이고 비기는 경우는 없다고 할 때, 세 번째 경기에서 A 팀의 우승이 결정될 확률은?`, ans, {
          explain: `세 번째 경기에서 A 팀의 우승이 결정되려면 앞의 두 경기에서 한 번 이기고 한 번 진 다음 세 번째 경기를 이겨야 한다. A 팀이 (승, 패, 승)일 확률은 ${tx(p)} × ${tx(non(p))} × ${tx(p)} = ${tx(one)}, (패, 승, 승)일 확률은 ${tx(non(p))} × ${tx(p)} × ${tx(p)} = ${tx(one)}이므로 구하는 확률은 ${tx(one)} + ${tx(one)} = ${tx(ans)}이다.`,
          facts: vf(`2*${js(p)}*(1-${js(p)})*${js(p)}`, [2]) });
      }),
      H('hard-rps-three', '세 사람이 가위바위보를 할 때의 확률', '심25 / 기본 ②21', (d, n) => {
        // ② 27가지를 갈라 센다. 차례 0: 비기는 경우(모두 같은 것 3 + 모두 다른 것 6). 차례 1: 한 사람이 이기는 경우(혼자 이기는 3 + 다른 한 사람과 함께 이기는 3 + 3).
        //  0 가위, 1 바위, 2 보: x 가 y 를 이긴다 ⇔ (x − y + 3) % 3 = 1
        const ALL = []; for (let x = 0; x < 3; x += 1) for (let y = 0; y < 3; y += 1) for (let z = 0; z < 3; z += 1) ALL.push([x, y, z]);
        const winners = (h) => { const kinds = [...new Set(h)]; if (kinds.length !== 2) return []; const top = (kinds[0] - kinds[1] + 3) % 3 === 1 ? kinds[0] : kinds[1]; return [0, 1, 2].filter((i) => h[i] === top); };
        if (n === 0) {
          const draw = d.bool(), hit = ALL.filter((h) => (winners(h).length === 0) === draw).length;
          return ansP(`A, B, C 세 사람이 가위바위보를 한 번 할 때, ${draw ? '비길' : '승부가 결정될'} 확률은?`, P(hit, 27), {
            explain: `모든 경우의 수는 3 × 3 × 3 = 27이다. 비기는 경우는 세 사람이 모두 같은 것을 내는 3가지와 세 사람이 모두 다른 것을 내는 3 × 2 × 1 = 6(가지)을 더한 9가지이므로 비길 확률은 ${frac(9, 27)} = ${frac(1, 3)}이다.${draw ? '' : ` 따라서 승부가 결정될 확률은 1 − ${frac(1, 3)} = ${frac(2, 3)}이다.`}`, facts: kn(draw ? 3 + 6 : 27 - 3 - 6, 27) });
        }
        const who = d.int(0, 2), nm = 'ABC'[who], hit = ALL.filter((h) => winners(h).includes(who)).length;
        return ansP(`A, B, C 세 사람이 가위바위보를 한 번 할 때, ${nm}가 이긴 사람에 들 확률은? (단, 두 사람이 함께 이긴 경우에는 두 사람 모두 이긴 것으로 본다.)`, P(hit, 27), {
          explain: `모든 경우의 수는 3 × 3 × 3 = 27이다. ${nm}가 혼자 이기는 경우는 ${nm}가 내는 것에 따라 3가지이고, ${nm}가 다른 한 사람과 함께 이기는 경우는 함께 이기는 사람이 2가지, 내는 것이 3가지이므로 2 × 3 = 6(가지)이다. 따라서 구하는 확률은 ${frac('3 + 6', 27)} = ${frac(1, 3)}이다.`, facts: kn(3 + 6, 27) });
      }, { count: 2 })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-2-7', 'and', [
    TB('and-rps-atleast', '가위바위보에서 적어도 한 번 이길 확률', '심31', (d) => {
      // 함정: 한 번에 이길 확률을 1/2로 잡는 아이(이기거나 지거나 둘 중 하나라고 여긴다). 일어날 가능성이 같은 9가지 가운데 이기는 것은 3가지이고, 비기는 것도 이기지 못한 것이다.
      const [A, Bn] = two(d), n = d.int(2, 3), lose = frac(2, 3), none = n === 2 ? Q(4, 9) : Q(8, 27), ans = non(none);
      return ansP(`${name(A, '과/와')} ${name(Bn, '이/가')} 가위바위보를 ${['두', '세'][n - 2]} 번 할 때, ${name(A, '이/가')} 적어도 한 번은 이길 확률은?`, ans, {
        explain: `가위바위보를 한 번 할 때 일어날 가능성이 같은 경우는 9가지이고 ${name(A, '이/가')} 이기는 경우는 3가지이므로 이길 확률은 ${frac(1, 3)}, 이기지 못할(비기거나 질) 확률은 ${lose}이다. ${n}번 모두 이기지 못할 확률은 ${Array(n).fill(lose).join(' × ')} = ${tx(none)}이므로 구하는 확률은 1 − ${tx(none)} = ${tx(ans)}이다.`,
        facts: { value: `1-${Array(n).fill('(6/9)').join('*')}`, unseen: [1, 6, 9] } });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
