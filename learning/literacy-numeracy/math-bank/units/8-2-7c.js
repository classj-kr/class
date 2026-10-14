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
//  - 점이 두 직선 가운데 하나 위에 있는 경우를 셀 때, 두 직선이 만나는 점을 두 번 센다.
//  - 「같은 것을 고른 사람이 있다」를 「모두 같은 것을 골랐다」로 읽는다. 모두 다를 확률을 구할 때 세 번째 사람이 한 사람하고만 다르면 된다고 센다.
//
// 실력에는 ① 문제의 상황에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
//  ②에는 과제 글이 정한 「두 갈래로 나누어 곱하고 더하는 꼴」 넷(주머니를 고른 다음 공 꺼내기, 비가 오는지에 따라 달라지는 이길 확률, 이틀 이어지는 날씨, 세 번 가운데 두 번 넘게)을 한 유형씩,
//  그리고 세 갈래를 더하는 것(세 사람 가운데 두 사람만), 확률 둘로 개수 둘을 거꾸로 구하는 것, 두 눈의 수의 조건을 도형·직선의 식으로 옮겨 세는 것, 수의 성질(홀짝, 유한소수)로 옮긴 뒤 구하는 것,
//  곱으로 주어진 확률에서 한쪽을 되구하는 것, 세 번째 경기에서 우승이 정해지는 것, 세 사람의 가위바위보(27가지를 갈라 세기)를 실었다.
//  처음 지을 때 꼬임·경우 따지기·「한 유형만」이라는 까닭으로 뺐다가 다시 본 꼴(움직이는 점과 말, 계단, 번갈아 하는 놀이, 줄 세우기, 옮겨 넣은 뒤 꺼내기 등)은 파일 끝의 「다시 싣기」에 있다.
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

  // ══ 다시 싣기 ══
  // 처음 지을 때 「점이나 말이 움직이는 놀이·계단」「세 번 넘게 이어지는 승부」「경우를 여럿 따져야 하는 세기」「과제 글이 정한 한 유형만」이라는 까닭으로 뺀 꼴을 다시 보고 덧붙였다.
  // 수학 실력에 필요한 문제는 싣고, 상위 학년의 내용을 알아야 풀리는 것만 뺀다(꼴마다의 판정은 대조표에 있다).
  //  실력 ① 뜻을 정확히 대야 풀리는 것: hard-two-lines(심11), hard-same-day(②74)
  //  실력 ② 세 단계 넘게 잇는 것: hard-line(심23·24), hard-three-digit(심18), hard-walk-dice(①75), hard-vertex-walk(①76·77 ②68), hard-stairs-same(①78),
  //    hard-first-wins(심54·55·56), hard-balls-system(심49), hard-move-then-draw(심50)
  //  기본(두 단계 안팎): cases-coin-walk(②67 — 기본 문서 세 곳에 나온다), and-stairs(심52 — 「조건의 눈이 한 번만」으로 옮기면 한 번만 일어날 확률과 같은 셈이다)
  // 그대로 뺀 것: 심41(다섯 번 가운데 꼭 두 번 — 독립시행의 확률은 고등학교의 내용이다), 심57(같은 것이 든 차례 세기이고 원문 문장의 뜻이 갈린다),
  //  심42(상자를 고를 확률을 밝히면 hard-pick-bag 과 같은 일이다), ②73(끈 그림을 알 수 없는 실험 활동), ①27(hard-or-overlap 과 같은 일이다).
  const { nick } = B.kit;
  const { nline } = B.kit.mid;
  const { T, sum, fact, mulSaid, mult, divOf, PRIME, EVEN, ODD, atLeast, atMost } = K;
  const eyesOf = (c) => range(1, 6).filter(c.ok).length;
  const perms = (list) => (list.length <= 1 ? [list] : list.flatMap((v, i) => perms(list.filter((_, j) => j !== i)).map((p) => [v].concat(p))));
  // 자리 번호 0 … n − 1 가운데 k개를 고르는 묶음 모두(어느 묶음이나 일어날 가능성이 같다)
  const subsets = (n, k) => (k === 0 ? [[]] : n < k ? [] : subsets(n - 1, k).concat(subsets(n - 1, k - 1).map((s) => s.concat([n - 1]))));
  // 수직선 위의 수를 적는 글(음수는 빼기표)
  const num = (v) => (v < 0 ? MINUS + -v : String(v));
  // 곱하는 분수들을 적는 글: [분자, 분모]의 배열. 분자와 분모가 같으면 1로 적는다.
  const chain = (steps) => steps.map(([a, b]) => (a === b ? '1' : frac(a, b))).join(' × ');
  // 정다각형의 꼭짓점을 따라 움직이는 점·말의 그림. names: 꼭짓점의 이름(pts 의 차례, 화면에서 시계 반대 방향).
  //  mark 'P': 꼭짓점 A 에 검은 점과 이름 P, 변 AB 바깥에 움직이는 방향의 화살표(쪽 그림: 2022 대단원 평가 문제 20). mark 'piece': 꼭짓점 A 에 말(색칠한 동그라미).
  function ringFig(pts, names, mark, said) {
    const b = G.Board(), n = pts.length, c = [sum(pts.map((p) => p[0])) / n, sum(pts.map((p) => p[1])) / n], A = pts[names.indexOf('A')], Bv = pts[names.indexOf('B')];
    b.poly(pts, G.WHITE);
    pts.forEach((p, i) => b.name(p, names[i], G.dirOf(c, p), mark === 'piece' && names[i] === 'A' ? 16 : 11));
    if (mark === 'P') {
      const out = G.dirOf(c, G.mid(A, Bv)), from = G.at(G.mid(A, Bv, 0.22), 10, out), to = G.at(G.mid(A, Bv, 0.62), 10, out), a = G.dirOf(from, to);
      b.dot(A, 3.2); b.name(A, 'P', G.dirOf(A, c), n === 3 ? 23 : 15);
      b.seg(from, to, 'thin'); b.poly([to, G.at(to, 7, a + 155), G.at(to, 7, a - 155)], 'fill:#1f2933');
    } else b.disk(A, 6, 'fill:#b42318;stroke:#7f1d1d');
    return b.svg(said);
  }
  const SQUARE = [[0, 0], [0, 84], [84, 84], [84, 0]];   // 정사각형 ABCD: 왼쪽 위 A, 왼쪽 아래 B, 오른쪽 아래 C, 오른쪽 위 D(쪽 그림: 2015 지도서 중단원 19)

  B.addTypes('8-2-7', 'hard', [
    // ── ① 뜻을 정확히 대야 풀리는 문제 ──
    H('hard-two-lines', '점이 두 직선 가운데 하나 위에 있을 확률', '심11', (d) => {
      // 함정: 「~이거나」라고 두 직선 위에 있는 경우의 수를 그대로 더하는 아이. 두 직선이 만나는 점은 두 직선 위에 모두 있으므로 한 번만 세어야 한다
      //  (두 직선은 두 눈의 수로 된 점에서 꼭 한 번 만나게 골랐다).
      const on = ([m, k]) => DICE.filter(([a, b]) => b === m * a + k), same = (p, q) => p[0] === q[0] && p[1] === q[1];
      const [l1, l2] = d.until(() => [[d.pick([-1, 1]), d.int(-3, 10)], [d.pick([2, 3, -2]), d.int(-12, 14)]], ([u, v]) => on(u).length >= 3 && on(v).length >= 2 && on(u).filter((p) => on(v).some((q) => same(p, q))).length === 1);
      const s1 = on(l1), s2 = on(l2), both = s1.find((p) => s2.some((q) => same(p, q))), hit = DICE.filter(([a, b]) => b === l1[0] * a + l1[1] || b === l2[0] * a + l2[1]).length;
      const eq = ([m, k]) => nb(`${V('y')} = ${lin(m, k)}`), point = pt(V('a'), V('b'));
      return ansP(`${AB}, 점 ${point}가 직선 ${eq(l1)} 위에 있거나 직선 ${eq(l2)} 위에 있을 확률은?`, P(hit, 36), {
        explain: `점 ${point}가 직선 ${eq(l1)} 위에 있는 경우는 ${pairsSaid(s1)}, 직선 ${eq(l2)} 위에 있는 경우는 ${pairsSaid(s2)}이다. 이 가운데 (${both[0]}, ${both[1]})${tail(both[1], '은/는')} 두 직선 위에 모두 있으므로 한 번만 센다. 조건에 맞는 경우는 ${s1.length} + ${s2.length} − 1 = ${hit}(가지)이므로 구하는 확률은 ${red(hit, 36)}이다.`,
        facts: kn(s1.length + s2.length - 1, 36) });
    }),
    H('hard-same-day', '세 사람 가운데 같은 것을 고른 사람이 있을 확률', '기본 ②74', (d) => {
      // 함정: 「같은 요일에 태어난 사람이 있다」를 「세 사람이 모두 같은 요일에 태어났다」로 읽는 아이(1/7 × 1/7),
      //  모두 다를 확률을 구하면서 세 번째 사람이 한 사람하고만 다르면 된다고 세는 아이(6/7 × 6/7).
      //  「같은 사람이 있다」는 「모두 다르다」가 아닌 것이고, 모두 다르려면 세 번째 사람은 앞의 두 사람 모두와 달라야 한다.
      const who = d.shuffle(NAMES).slice(0, 3).join(', '), k = d.int(0, 2), n = [7, 12, d.pick([5, 6, 8, 10])][k], what = ['태어난 요일이', '태어난 달이', '적은 수가'][k], some = ['태어난 요일이 같은 사람이', '태어난 달이 같은 사람이', '같은 수를 적은 사람이'][k];
      const text = [`${who} 세 사람 중에 태어난 요일이 같은 사람이 있을 확률은? (단, 한 사람이 월요일부터 일요일까지 7개의 요일 중 어느 요일에 태어났을 가능성은 모두 같다.)`,
        `${who} 세 사람 중에 태어난 달이 같은 사람이 있을 확률은? (단, 한 사람이 1월부터 12월까지 12개의 달 중 어느 달에 태어났을 가능성은 모두 같다.)`,
        `${who} 세 사람이 1부터 ${n}까지의 자연수 중에서 하나씩을 각자 임의로 골라 종이에 적을 때, 세 사람 중에 같은 수를 적은 사람이 있을 확률은?`][k];
      let diff = 0; for (let a = 1; a <= n; a += 1) for (let b = 1; b <= n; b += 1) for (let c = 1; c <= n; c += 1) if (a !== b && b !== c && a !== c) diff += 1;
      const total = n * n * n, all = P(diff, total), ans = P(total - diff, total);
      return ansP(text, ans, {
        explain: `세 사람이 ${what} 모두 다른 경우가 아니면 ${some} 있다. 모두 다르려면 두 번째 사람은 첫 번째 사람과 달라야 하고(${n - 1}가지), 세 번째 사람은 앞의 두 사람 모두와 달라야 하므로(${n - 2}가지) 그 확률은 ${frac(n, n)} × ${frac(n - 1, n)} × ${frac(n - 2, n)} = ${tx(all)}이다. 따라서 구하는 확률은 1 − ${tx(all)} = ${tx(ans)}이다.`,
        facts: vf(`1-(${n}*(${n}-1)*(${n}-2))/(${n}*${n}*${n})`, [2]) });
    }),

    // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
    H('hard-line', '한 줄로 설 때 이웃하지 않을·끼리끼리 이웃할 확률', '심23·24', (d, n) => {
      if (n === 0) {
        // ② 모든 경우의 수 → 두 사람을 한 묶음으로 세기 → 묶음 안에서 자리 바꾸기 → 이웃할 확률 → 1에서 뺀다.
        const m = d.int(4, 5), who = d.shuffle(NAMES).slice(0, m), [x, y] = d.shuffle(who).slice(0, 2), all = perms(who), total = all.length, near = all.filter((r) => Math.abs(r.indexOf(x) - r.indexOf(y)) === 1).length, part = fact(m - 1);
        return ansP(`${who.join(', ')} ${m}명이 한 줄로 설 때, ${name(x, '과/와')} ${name(y, '이/가')} 이웃하여 서지 않을 확률은?`, P(total - near, total), {
          explain: `${m}명이 한 줄로 서는 경우의 수는 ${mulSaid(m)} = ${total}이다. ${name(x, '과/와')} ${name(y, '을/를')} 한 묶음으로 보고 한 줄로 세우는 경우의 수는 ${mulSaid(m - 1)} = ${part}이고, 묶음 안에서 두 사람이 자리를 바꾸는 경우가 2가지이므로 두 사람이 이웃하여 서는 경우의 수는 ${part} × 2 = ${part * 2}이다. 두 사람이 이웃하여 설 확률이 ${red(part * 2, total)}이므로 구하는 확률은 1 − ${tx(P(part * 2, total))} = ${tx(P(total - near, total))}이다.`,
          facts: vf(`1-(${part}*2)/${total}`, [part, 2, total]) });
      }
      // ② 모든 경우의 수 → 두 무리를 저마다 한 묶음으로 → 묶음의 차례 2가지 → 무리 안에서 자리 바꾸기를 저마다 곱한다.
      const [g1, g2] = d.pick([['남학생', '여학생'], ['초등학생', '중학생'], ['어른', '어린이']]), [a, b] = d.pick([[2, 2], [2, 3], [3, 2], [3, 3]]), m = a + b, kind = (i) => (i < a ? 0 : 1);
      const all = perms(range(0, m - 1)), total = all.length, hit = all.filter((r) => range(1, m - 1).filter((i) => kind(r[i]) !== kind(r[i - 1])).length === 1).length;
      return ansP(`${g1} ${a}명과 ${g2} ${b}명이 한 줄로 설 때, ${josa(g1, '은/는')} ${g1}끼리, ${josa(g2, '은/는')} ${g2}끼리 이웃하여 설 확률은?`, P(hit, total), {
        explain: `${m}명이 한 줄로 서는 경우의 수는 ${mulSaid(m)} = ${total}이다. ${g1} ${a}명을 한 묶음, ${g2} ${b}명을 한 묶음으로 보면 두 묶음을 한 줄로 세우는 경우의 수는 2이다. 묶음 안에서 ${g1}끼리 자리를 바꾸는 경우의 수는 ${mulSaid(a)} = ${fact(a)}, ${g2}끼리 자리를 바꾸는 경우의 수는 ${mulSaid(b)} = ${fact(b)}이므로 끼리끼리 이웃하여 서는 경우의 수는 2 × ${fact(a)} × ${fact(b)} = ${hit}이다. 따라서 구하는 확률은 ${red(hit, total)}이다.`,
        facts: kn(2 * fact(a) * fact(b), fact(m)) });
    }, { count: 2 }),
    H('hard-three-digit', '0이 낀 수 카드 세 장으로 만든 세 자리 수가 3의 배수일 확률', '심18', (d) => {
      // ② 모든 경우의 수(백의 자리에 0이 올 수 없다) → 합이 3의 배수인 세 장의 묶음 찾기 → 0이 든 묶음과 없는 묶음으로 갈라 세기 → 확률.
      const m = d.int(3, 5), digits = range(0, m), all = [];
      for (const a of digits) for (const b of digits) for (const c of digits) if (a !== 0 && a !== b && b !== c && a !== c) all.push(100 * a + 10 * b + c);
      const hit = all.filter((v) => v % 3 === 0).length, sets = subsets(m + 1, 3).map((s) => s.slice().sort((x, y) => x - y)).filter((s) => sum(s) % 3 === 0).sort((s, t) => s[0] - t[0] || s[1] - t[1] || s[2] - t[2]);
      const zero = sets.filter((s) => s[0] === 0).length, rest = sets.length - zero;
      return ansP(`${digits.join(', ')}${tail(m, '이/가')} 하나씩 적힌 ${m + 1}장의 카드 중에서 세 장을 뽑아 세 자리 자연수를 만들 때, 만든 수가 3의 배수일 확률은? (단, 각 자리의 숫자의 합이 3의 배수인 수는 3의 배수이다.)`, P(hit, all.length), {
        explain: `백의 자리에는 0이 올 수 없으므로 만들 수 있는 세 자리 자연수는 ${m} × ${m} × ${m - 1} = ${all.length}(개)이다. 적힌 수의 합이 3의 배수인 세 장의 묶음은 ${sets.map((s) => `(${s.join(', ')})`).join(', ')}이다. 0이 든 묶음 ${zero}개로는 저마다 2 × 2 × 1 = 4(개), 0이 없는 묶음 ${rest}개로는 저마다 3 × 2 × 1 = 6(개)의 수를 만들 수 있으므로 3의 배수는 4 × ${zero} + 6 × ${rest} = ${hit}(개)이다. 따라서 구하는 확률은 ${red(hit, all.length)}이다.`,
        facts: kn(4 * zero + 6 * rest, m * m * (m - 1)) });
    }),
    H('hard-walk-dice', '주사위의 눈만큼 수직선 위의 점을 옮길 때 제자리에 올 확률', '기본 ①75', (d) => {
      // ② 「제자리」를 「홀수의 눈의 수의 합 = 짝수의 눈의 수의 합」으로 옮긴다 → 홀수의 눈이 두 번, 짝수의 눈이 한 번임을 알아낸다 → 눈의 묶음 찾기 → 묶음마다 나오는 차례 세기 → 확률.
      const oddRight = d.bool(), [o, e] = oddRight ? ['오른쪽', '왼쪽'] : ['왼쪽', '오른쪽'], all = [];
      for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) for (let c = 1; c <= 6; c += 1) all.push([a, b, c]);
      const hit = all.filter((t) => sum(t.map((v) => (v % 2 === 1 ? v : -v))) === 0), groups = new Map();
      for (const t of hit) { const key = t.slice().sort((x, y) => x - y).join(', '); groups.set(key, (groups.get(key) || 0) + 1); }
      return ansP(`수직선 위의 원점에 점 P가 있다. 주사위 한 개를 던져 홀수의 눈이 나오면 그 눈의 수만큼 점 P를 ${o}으로, 짝수의 눈이 나오면 그 눈의 수만큼 점 P를 ${e}으로 옮긴다. 주사위를 세 번 던진 뒤 점 P가 다시 원점에 있을 확률은?`, P(hit.length, 216), {
        explain: `모든 경우의 수는 6 × 6 × 6 = 216이다. 점 P가 다시 원점에 있으려면 홀수의 눈의 수의 합과 짝수의 눈의 수의 합이 같아야 하므로, 홀수의 눈이 두 번 나오고 그 합과 같은 짝수의 눈이 한 번 나와야 한다. 세 눈의 수가 ${[...groups].map(([key, cnt]) => `(${key})인 경우는 나오는 차례에 따라 ${cnt}가지`).join(', ')}이므로 모두 ${[...groups.values()].join(' + ')} = ${hit.length}(가지)이다. 따라서 구하는 확률은 ${red(hit.length, 216)}이다.`,
        // 다른 길: 합이 6 이하의 짝수인 홀수의 눈의 순서쌍 (1, 1), (1, 3), (3, 1), (1, 5), (5, 1), (3, 3)의 6가지 × 짝수의 눈이 나오는 차례 3가지
        facts: { value: '(6*3)/(6*6*6)', unseen: [3, 6] } });
    }),
    H('hard-vertex-walk', '정다각형의 꼭짓점을 따라 움직이는 점·말', '기본 ①76·77 ②68', (d, n) => {
      if (n === 0) {
        // ② 놓이는 꼭짓점을 「합을 꼭짓점의 수로 나눈 나머지」로 옮긴다 → 그런 합을 모두 찾는다 → 합마다 순서쌍을 센다 → 더해 확률.
        const m = d.pick([3, 4, 5]), shape = { 3: '정삼각형', 4: '정사각형', 5: '정오각형' }[m], pts = m === 4 ? SQUARE : G.regPts(m, m === 3 ? 104 : 64), names = m === 4 ? ['A', 'B', 'C', 'D'] : G.vnames(pts), letters = G.ALPHA.slice(0, m).split('');
        const k = d.int(0, m - 1), sums = range(2, 12).filter((s) => s % m === k), hit = DICE.filter(([a, b]) => (a + b) % m === k).length, parts = sums.map((s) => 6 - Math.abs(7 - s));
        return ansP(`다음 그림과 같이 ${shape} ${letters.join('')}의 꼭짓점 A에 점 P가 있다. 서로 다른 두 개의 주사위를 동시에 던져 나오는 두 눈의 수의 합만큼, 점 P를 ${letters.slice(0, 3).join(' → ')}의 방향으로 이웃한 꼭짓점으로 한 칸씩 옮긴다. 이때 점 P가 꼭짓점 ${letters[k]}에 놓일 확률은?`, P(hit, 36), {
          figure: ringFig(pts, names, 'P', `${shape} ${letters.join('')}: 꼭짓점은 시계 반대 방향으로 ${letters.join(', ')}의 차례이다. 꼭짓점 A에 점 P가 있고, 변 AB의 바깥에 A에서 B 쪽을 가리키는 화살표가 있다.`),
          explain: `점 P는 ${m}칸을 움직일 때마다 꼭짓점 A로 돌아오므로, 꼭짓점 ${letters[k]}에 놓이려면 두 눈의 수의 합이 ${k === 0 ? `${m}의 배수이어야 한다` : `${josa(m, '으로/로')} 나누었을 때 나머지가 ${k}인 수이어야 한다`}. 그런 합은 ${sums.join(', ')}이고, ${sums.map((s, i) => `합이 ${s}인 경우는 ${parts[i]}가지`).join(', ')}이므로 구하는 확률은 ${frac(parts.join(' + '), 36)} = ${tx(P(hit, 36))}이다.`,
          facts: kn(sum(parts), 36) });
      }
      // ② 놓이는 꼭짓점을 「두 번의 방향이 같다(다르다)」로 옮긴다 → 조건의 눈이 나올 확률과 나오지 않을 확률 → 두 갈래를 곱해 더한다.
      const c = d.pick([divOf(5), mult(3), atLeast(5), divOf(6), atMost(4), PRIME, EVEN, divOf(4)]), k = eyesOf(c), p = P(k, 6), q = non(p), far = d.bool(), hit = DICE.filter(([a, b]) => (c.ok(a) === c.ok(b)) === far).length;
      const x = far ? qmul(p, p) : qmul(p, q), y = far ? qmul(q, q) : qmul(q, p);
      const told = far ? `말이 꼭짓점 C에 놓이려면 두 번 모두 같은 방향으로 움직여야 한다. 두 번 모두 시계 방향으로 움직일 확률은 ${tx(p)} × ${tx(p)} = ${tx(x)}, 두 번 모두 시계 반대 방향으로 움직일 확률은 ${tx(q)} × ${tx(q)} = ${tx(y)}`
        : `말이 꼭짓점 A로 돌아오려면 두 번을 서로 다른 방향으로 움직여야 한다. 시계 방향, 시계 반대 방향의 차례로 움직일 확률은 ${tx(p)} × ${tx(q)} = ${tx(x)}, 시계 반대 방향, 시계 방향의 차례로 움직일 확률은 ${tx(q)} × ${tx(p)} = ${tx(y)}`;
      return ansP(`다음 그림과 같이 정사각형 ABCD의 꼭짓점 A에 말이 놓여 있다. 주사위 한 개를 던져 ${c.eye}이 나오면 말을 시계 방향(A → D의 방향)으로, 그 밖의 눈이 나오면 시계 반대 방향(A → B의 방향)으로 이웃한 꼭짓점으로 한 칸 옮긴다. 주사위를 두 번 던진 뒤 말이 꼭짓점 ${far ? 'C' : 'A'}에 놓여 있을 확률은?`, P(hit, 36), {
        figure: ringFig(SQUARE, ['A', 'B', 'C', 'D'], 'piece', '정사각형 ABCD: 왼쪽 위 꼭짓점이 A이고 시계 반대 방향으로 B, C, D의 차례이다. 꼭짓점 A에 말이 놓여 있다.'),
        explain: `${c.eye}이 나올 확률은 ${red(k, 6)}, 그 밖의 눈이 나올 확률은 ${tx(q)}이다. ${told}이므로 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(P(hit, 36))}이다.`,
        facts: { value: far ? `(${k}*${k}+(6-${k})*(6-${k}))/36` : `(2*${k}*(6-${k}))/36`, unseen: [2, k, 6, 36] } });
    }, { count: 2 }),
    H('hard-stairs-same', '두 사람이 계단을 오르내릴 때 같은 계단에 있을 확률', '기본 ①78', (d) => {
      // ② 한 사람이 두 번 던진 뒤 서 있을 수 있는 세 곳과 그 확률 → 두 사람이 같은 곳에 있는 세 갈래를 저마다 곱해 더한다.
      const [A, Bn] = two(d), coin = d.bool(), c = coin ? null : d.pick([mult(3), divOf(5), atLeast(5), divOf(6), atMost(4)]), k = coin ? 1 : eyesOf(c), sides = coin ? 2 : 6, p = P(k, sides), q = non(p);
      const spots = [qmul(p, p), qmul(Q(2), qmul(p, q)), qmul(q, q)], ans = spots.reduce((s, v) => qadd(s, qmul(v, v)), Q(0));
      const up = coin ? '앞면이 나오면' : `${c.eye}이 나오면`, down = coin ? '뒷면이 나오면' : '그 밖의 눈이 나오면', thing = coin ? '동전' : '주사위';
      return ansP(`긴 계단의 중간에서 같은 계단에 서 있는 ${name(A, '과/와')} ${name(Bn, '이/가')} 저마다 ${thing} 한 개를 던져 ${up} 한 계단 올라가고, ${down} 한 계단 내려가기로 하였다. 두 사람이 ${josa(thing, '을/를')} 두 번씩 던진 뒤 서로 같은 계단에 서 있을 확률은?`, ans, {
        explain: `한 번 던져 올라갈 확률은 ${coin ? frac(1, 2) : red(k, 6)}, 내려갈 확률은 ${tx(q)}이다. 한 사람이 두 번 던진 뒤 서 있는 곳은 처음보다 두 계단 위(두 번 모두 올라간다), 처음 계단(한 번 올라가고 한 번 내려간다), 두 계단 아래(두 번 모두 내려간다) 중 하나이고, 그 확률은 차례로 ${tx(p)} × ${tx(p)} = ${tx(spots[0])}, ${tx(p)} × ${tx(q)} × 2 = ${tx(spots[1])}, ${tx(q)} × ${tx(q)} = ${tx(spots[2])}이다. 두 사람이 같은 곳에 있을 확률은 ${spots.map((v) => `${tx(v)} × ${tx(v)}`).join(' + ')} = ${tx(ans)}이다.`,
        facts: kn((k * k) ** 2 + (2 * k * (sides - k)) ** 2 + ((sides - k) * (sides - k)) ** 2, sides ** 4) });
    }),
    H('hard-first-wins', '번갈아 하여 먼저 해내는 사람이 이기는 놀이', '심54·55·56', (d, n) => {
      const [A, Bn] = two(d), both = `${name(A, '과/와')} ${name(Bn, '이/가')}`;
      if (n === 0) {
        // ② 이기는 차례가 몇 번째인지 가린다 → 그 차례마다 「앞에서는 모두 나오지 않고 그때 처음 나온다」의 곱 → 더한다.
        const c = d.pick([EVEN, ODD, PRIME, mult(3), atLeast(5), divOf(6)]), k = eyesOf(c), p = P(k, 6), q = non(p), later = d.bool(), who = later ? Bn : A, turns = later ? [2, 4] : [1, 3];
        const parts = turns.map((t) => times(Array(t - 1).fill(q).concat([p]))), ans = qadd(parts[0], parts[1]), said = (t) => Array(t - 1).fill(tx(q)).concat([tx(p)]).join(' × ');
        return ansP(`${both} ${nick(A)}부터 시작하여 번갈아 주사위를 한 번씩 던져, ${c.eye}이 먼저 나오는 사람이 이기는 놀이를 한다. 두 사람이 주사위를 던진 횟수를 모두 합하여 ${later ? 4 : 3}번 이내에 ${name(who, '이/가')} 이길 확률은?`, ans, {
          explain: `${c.eye}이 나올 확률은 ${red(k, 6)}, 나오지 않을 확률은 ${tx(q)}이다. ${name(who, '은/는')} ${turns[0]}번째와 ${turns[1]}번째에 던지므로, ${turns[0]}번째에 ${c.eye}이 처음 나오거나 ${turns[1]}번째에 처음 나오면 이긴다. ${turns.map((t, i) => `${t}번째에 처음 나올 확률은 ${t === 1 ? tx(p) : `${said(t)} = ${tx(parts[i])}`}`).join(', ')}이므로 구하는 확률은 ${tx(parts[0])} + ${tx(parts[1])} = ${tx(ans)}이다.`,
          facts: vf(turns.map((t) => Array(t - 1).fill(`(1-${k}/6)`).concat([`(${k}/6)`]).join('*')).join('+'), [k, 6]) });
      }
      if (n === 1) {
        // ② 이기는 차례를 가린다 → 차례마다 「앞에서는 모두 파란 구슬」의 곱(꺼낼 때마다 남은 구슬이 줄어든다) → 더한다.
        const [b, y] = d.pick([[4, 2], [3, 2], [2, 2], [3, 3], [4, 3]]), m = b + y, first = d.bool(), who = first ? A : Bn, turns = range(1, b + 1).filter((t) => (t % 2 === 1) === first);
        const steps = (t) => range(1, t - 1).map((i) => [b - i + 1, m - i + 1]).concat([[y, m - t + 1]]), parts = turns.map((t) => times(steps(t).map(([u, v]) => P(u, v)))), ans = parts.reduce((s, v) => qadd(s, v), Q(0));
        // 다른 길: 노란 구슬이 놓이는 자리의 묶음은 어느 것이나 가능성이 같다. 가장 앞의 노란 구슬이 홀수 번째에 있으면 먼저 꺼내는 사람이 이긴다.
        const spots = subsets(m, y), wins = spots.filter((s) => (Math.min(...s) % 2 === 0) === first).length;
        return ansP(`파란 구슬 ${b}개, 노란 구슬 ${y}개가 들어 있는 주머니에서 ${both} ${nick(A)}부터 시작하여 번갈아 구슬을 한 개씩 꺼내, 노란 구슬을 먼저 꺼내는 사람이 이기는 놀이를 한다. 이 놀이에서 ${name(who, '이/가')} 이길 확률은? (단, 꺼낸 구슬은 다시 넣지 않는다.)`, ans, {
          explain: `${name(who, '은/는')} ${turns.map((t) => t + '번째').join(', ')}에 꺼내므로, 그때 노란 구슬이 처음 나오면 이긴다. ${turns.map((t, i) => `${t}번째에 처음 나올 확률은 ${steps(t).length === 1 ? tx(parts[i]) : `${chain(steps(t))} = ${tx(parts[i])}`}`).join(', ')}이다. 따라서 구하는 확률은 ${parts.length === 1 ? tx(ans) : `${parts.map(tx).join(' + ')} = ${tx(ans)}`}이다.`,
          facts: kn(wins, spots.length) });
      }
      // ② 이기는 조건을 「상대가 홀수를 뽑기 전에 홀수 두 장을 뽑는다」로 옮긴다 → 그렇게 되는 차례를 모두 찾는다 → 갈래마다 줄어드는 분모로 곱한다 → 더한다.
      const m = d.pick([6, 7]), first = d.pick(range(1, m).filter((v) => v % 2 === 1)), rest = range(1, m).filter((v) => v !== first), odd = rest.filter((v) => v % 2 === 1).length, even = rest.length - odd, paths = [];
      // 남은 카드를 Bn 부터 번갈아 뽑는다(turn 이 짝수이면 Bn 의 차례). A 는 홀수를 한 장만 더 뽑으면 이긴다.
      const walk = (o, e, got, turn, path) => {
        if (o && turn % 2 === 0) { const step = path.concat([['홀', o, o + e]]); if (got === 1) paths.push(step); else walk(o - 1, e, got + 1, turn + 1, step); }
        if (e) walk(o, e - 1, got, turn + 1, path.concat([['짝', e, o + e]]));
      };
      walk(odd, even, 0, 0, []);
      const parts = paths.map((path) => times(path.map(([, u, v]) => P(u, v)))), ans = parts.reduce((s, v) => qadd(s, v), Q(0));
      // 다른 길: 남은 카드에서 홀수가 놓이는 자리의 묶음은 어느 것이나 가능성이 같다. 차례대로 넘기며 누가 먼저 홀수 두 장을 채우는지 본다.
      const spots = subsets(rest.length, odd), wins = spots.filter((s) => { let got = 0; for (let i = 0; i < rest.length; i += 1) if (s.includes(i)) { if (i % 2 === 1) return false; got += 1; if (got === 2) return true; } return false; }).length;
      return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드를 ${both} 한 장씩 번갈아 뽑아, 홀수가 적힌 카드 2장을 먼저 뽑는 사람이 이기는 놀이를 한다. ${name(A, '이/가')} 맨 처음에 ${first}${tail(first, '이/가')} 적힌 카드를 뽑았을 때, 이 놀이에서 ${name(Bn, '이/가')} 이길 확률은? (단, 뽑은 카드는 다시 넣지 않는다.)`, ans, {
        explain: `남은 카드는 홀수 ${odd}장, 짝수 ${even}장이고 ${nick(Bn)}부터 뽑는다. ${name(A, '은/는')} 홀수를 한 장만 더 뽑으면 이기므로, ${name(Bn, '이/가')} 이기려면 ${name(A, '이/가')} 홀수를 뽑기 전에 홀수 두 장을 뽑아야 한다. 그런 경우를 뽑는 차례대로 적으면 ${paths.map((path, i) => `(${path.map((s) => s[0]).join(', ')})일 확률은 ${chain(path.map(([, u, v]) => [u, v]))} = ${tx(parts[i])}`).join(', ')}이다. 따라서 구하는 확률은 ${parts.map(tx).join(' + ')} = ${tx(ans)}이다.`,
        facts: kn(wins, spots.length) });
    }, { count: 3 }),
    H('hard-balls-system', '식을 세워 공의 개수를 구한 뒤 차례로 꺼내기', '심49', (d) => {
      // ② 처음의 흰 공과 검은 공의 개수를 두 문자로 놓고 식 둘을 세운다 → 연립하여 푼다 → 다시 넣지 않고 세 번 꺼내는 곱(전체와 남은 개수가 줄어든다).
      const [w, b, a, c] = d.until(() => [d.int(3, 9), d.int(2, 4), d.int(1, 6), d.int(1, 6)], ([w0, b0, a0, c0]) => { const p1 = Q(w0 + a0, w0 + b0 + a0), p2 = Q(b0 + c0, w0 + b0 + c0); return w0 > b0 && p1.q <= 8 && p2.q <= 6 && p1.q < w0 + b0 + a0 && p2.q < w0 + b0 + c0 && p1.p * p2.q + p2.p * p1.q !== p1.q * p2.q; });
      const [n1, n2, n3] = d.shuffle(NAMES).slice(0, 3), p1 = Q(w + a, w + b + a), p2 = Q(b + c, w + b + c), all = w + b, X = V('x'), Y = V('y'), idx = range(0, all - 1), white = (i) => i < w;
      let hit = 0; for (const i of idx) for (const j of idx) for (const k of idx) if (i !== j && j !== k && i !== k && white(i) && !white(j) && white(k)) hit += 1;
      const total = all * (all - 1) * (all - 2), ans = P(hit, total);
      return ansP(`흰 공과 검은 공이 들어 있는 상자가 있다. 이 상자에 흰 공 ${a}개를 더 넣으면 흰 공이 전체의 ${tx(p1)}${tail(p1.p, '이/가')} 되고, 흰 공을 넣는 대신 검은 공 ${c}개를 더 넣으면 검은 공이 전체의 ${tx(p2)}${tail(p2.p, '이/가')} 된다. 공을 더 넣지 않은 처음 상자에서 ${n1}, ${n2}, ${n3} 세 사람이 이 차례로 공을 한 개씩 꺼낼 때, 세 사람 중 ${nick(n2)}만 검은 공을 꺼낼 확률은? (단, 꺼낸 공은 다시 넣지 않는다.)`, ans, {
        explain: `처음 상자의 흰 공을 ${X}개, 검은 공을 ${Y}개라 하면 ${nb(`${frac(`${X} + ${a}`, `${X} + ${Y} + ${a}`)} = ${tx(p1)}`)}, ${nb(`${frac(`${Y} + ${c}`, `${X} + ${Y} + ${c}`)} = ${tx(p2)}`)}이다. 두 식을 정리하면 ${nb(`${p1.q}(${X} + ${a}) = ${p1.p}(${X} + ${Y} + ${a})`)}, ${nb(`${p2.q}(${Y} + ${c}) = ${p2.p}(${X} + ${Y} + ${c})`)}이고, 연립하여 풀면 ${nb(`${X} = ${w}`)}, ${nb(`${Y} = ${b}`)}이다. 공 ${all}개 중에서 흰 공, 검은 공, 흰 공의 차례로 꺼낼 확률은 ${frac(w, all)} × ${frac(b, all - 1)} × ${frac(w - 1, all - 2)} = ${tx(ans)}이다.`,
        facts: vf(`(${w}/${all})*(${b}/(${all}-1))*((${w}-1)/(${all}-2))`, [w, b, all, 2]) });
    }),
    H('hard-move-then-draw', '한 상자에서 꺼내 다른 상자에 넣은 뒤 꺼내기', '심50', (d) => {
      // ② 옮긴 것이 무엇이냐에 따라 두 갈래로 나눈다 → 갈래마다 받은 상자의 개수가 달라진다(전체는 하나 늘고, 옮긴 맛만 하나 는다) → 곱해 더한다.
      const v = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 6), d.int(2, 6)], (s) => s[0] !== s[1] && (s[0] !== s[2] || s[1] !== s[3])), TASTE = ['딸기 맛', '포도 맛'], i = d.int(0, 1), j = 1 - i;
      const n1 = v[0] + v[1], n2 = v[2] + v[3] + 1, x = qmul(P(v[i], n1), P(v[2 + i] + 1, n2)), y = qmul(P(v[j], n1), P(v[2 + i], n2)), ans = qadd(x, y);
      return ansP(`상자 A에는 딸기 맛 사탕 ${v[0]}개와 포도 맛 사탕 ${v[1]}개가 들어 있고, 상자 B에는 딸기 맛 사탕 ${v[2]}개와 포도 맛 사탕 ${v[3]}개가 들어 있다. 상자 A에서 사탕 한 개를 꺼내 상자 B에 넣은 다음 상자 B에서 사탕 한 개를 꺼낼 때, 상자 B에서 꺼낸 사탕이 ${TASTE[i]} 사탕일 확률은?`, ans, {
        explain: `상자 A에서 ${TASTE[i]} 사탕을 꺼내 옮기면 상자 B에는 사탕 ${n2}개 중 ${TASTE[i]} 사탕이 ${v[2 + i] + 1}개이므로 그 확률은 ${frac(v[i], n1)} × ${frac(v[2 + i] + 1, n2)} = ${tx(x)}이다. 상자 A에서 ${TASTE[j]} 사탕을 꺼내 옮기면 상자 B에는 사탕 ${n2}개 중 ${TASTE[i]} 사탕이 ${v[2 + i]}개이므로 그 확률은 ${frac(v[j], n1)} × ${frac(v[2 + i], n2)} = ${tx(y)}이다. 따라서 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`,
        facts: vf(`(${v[i]}*(${v[2 + i]}+1)+${v[j]}*${v[2 + i]})/((${v[0]}+${v[1]})*(${v[2]}+${v[3]}+1))`) });
    })
  ]);

  // 기본 묶음에 덧붙이는 꼴(두 단계 안팎)
  B.addTypes('8-2-7', 'cases', [
    T('cases-coin-walk', '동전을 던져 수직선 위의 점을 옮길 때의 확률', '②67', (d) => {
      // 놓인 자리에서 앞면이 나온 횟수를 거꾸로 구한 다음, 앞면이 그만큼 나오는 경우를 센다.
      const n = d.int(3, 4), s = d.int(-1, 1), h = d.int(1, n - 1), t = s + 2 * h - n, X = V('x'), total = 2 ** n;
      const hit = range(0, total - 1).map((v) => range(0, n - 1).map((i) => (v >> i) & 1)).filter((seq) => sum(seq) === h);
      return ansP(`다음 그림과 같이 수직선 위에서 ${num(s)}${tail(Math.abs(s), '을/를')} 나타내는 점에 점 P가 있다. 동전 한 개를 던져 앞면이 나오면 점 P를 오른쪽으로 1만큼, 뒷면이 나오면 왼쪽으로 1만큼 옮긴다. 동전을 ${n}번 던진 뒤 점 P가 ${num(t)}${tail(Math.abs(t), '을/를')} 나타내는 점에 있을 확률은?`, P(hit.length, total), {
        figure: nline(-3, 3, { points: [{ at: Q(s), name: 'P' }] }),
        explain: `앞면이 ${X}번 나오면 뒷면은 (${n} − ${X})번 나오므로 점 P는 처음보다 오른쪽으로 ${nb(`${X} − (${n} − ${X}) = 2${X} − ${n}`)}만큼 간 곳에 있다. ${nb(`${num(s)} + (2${X} − ${n}) = ${num(t)}`)}에서 ${nb(`${X} = ${h}`)}이다. 모든 경우의 수는 ${Array(n).fill(2).join(' × ')} = ${total}이고, 앞면이 ${h}번 나오는 경우는 ${hit.map((seq) => `(${seq.map((v) => (v ? '앞' : '뒤')).join(', ')})`).join(', ')}의 ${hit.length}가지이므로 구하는 확률은 ${red(hit.length, total)}이다.`,
        facts: kn(fact(n) / (fact(h) * fact(n - h)), total) });
    })
  ]);
  B.addTypes('8-2-7', 'and', [
    T('and-stairs', '눈에 따라 오르는 칸이 다른 계단', '심52', (d) => {
      // 서 있는 계단을 「조건의 눈이 한 번만 나온다」로 옮긴 다음, 차례 둘을 곱해 더한다.
      // 조건: 눈 하나(확률 1/6), 눈 둘·넷(1/3, 2/3), 눈 셋(1/2)
      const one = d.int(1, 6), who = d.pick(NAMES), c = d.pick([{ eye: `${one}의 눈`, ok: (v) => v === one }, { eye: `${one}의 눈`, ok: (v) => v === one }, mult(3), divOf(5), atLeast(5), divOf(6), atMost(4), PRIME, divOf(4)]), k = eyesOf(c), p = P(k, 6), q = non(p), [a, b] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), x = qmul(p, q), ans = qadd(x, x);
      return ansP(`계단 아래의 바닥에 서 있는 ${name(who, '이/가')} 주사위 한 개를 던져 ${c.eye}이 나오면 계단을 ${a}칸, 그 밖의 눈이 나오면 계단을 ${b}칸 올라간다. 주사위를 두 번 던진 뒤 ${name(who, '이/가')} 바닥에서 ${a + b}번째 계단에 서 있을 확률은?`, ans, {
        explain: `${a + b}번째 계단에 서 있으려면 한 번은 ${a}칸, 다른 한 번은 ${b}칸 올라가야 하므로 두 번 중 한 번만 ${c.eye}이 나와야 한다. ${c.eye}이 나올 확률은 ${red(k, 6)}, 나오지 않을 확률은 ${tx(q)}이다. 첫 번째에만 나올 확률은 ${tx(p)} × ${tx(q)} = ${tx(x)}, 두 번째에만 나올 확률은 ${tx(q)} × ${tx(p)} = ${tx(x)}이므로 구하는 확률은 ${tx(x)} + ${tx(x)} = ${tx(ans)}이다.`,
        facts: vf(`2*(${k}/6)*(1-${k}/6)`, [2, k, 6]) });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
