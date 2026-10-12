// 중학교 1학년 1학기 1단원 소인수분해 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 1을 소수나 합성수로 센다(자연수는 소수와 합성수로만 이루어진다고 여긴다). 2를 짝수라서 합성수로 여기고, 소수는 모두 홀수라고 여긴다.
//  - 51, 57, 87, 91처럼 홀수이고 5로 끝나지 않는 수를 소수로 여긴다. 범위의 첫 수·끝 수를 따져 보지 않고 답한다.
//  - 2³을 2 × 3으로, 3 + 3 + 3을 3³으로 읽는다. 거꾸로 「덧셈으로 쓴 식은 거듭제곱과 같을 수 없다」고 외워 2 + 2 + 2 + 2 = 2³을 틀렸다고 한다.
//  - 소인수를 지수만큼 여러 번 센다(36 = 2² × 3²의 소인수를 4개라고 한다). 1이나 거듭제곱(2²)을 소인수에 넣는다.
//  - 6² × 7, 4 × 3³처럼 밑이 소수가 아닌 꼴도 소인수분해 한 것으로 여겨 그대로 소인수를 대고 약수의 개수를 센다.
//  - 약수는 지수가 「작은」 것이라고만 여겨 지수가 같은 것(자기 자신)과 1을 뺀다. 한 소인수의 지수만 보고 약수라고 한다.
//  - 어떤 자연수의 제곱이 되게 하려면 「제곱인 수」를 곱하면 된다고 여긴다(지수가 모두 짝수가 되어야 한다). 1을 제곱인 수에서 뺀다.
//  - 서로소를 「두 수가 모두 소수」 「홀수끼리」로 여긴다(8과 15는 서로소이고, 17과 51은 서로소가 아니다). 1과 다른 수는 서로소가 아니라고 여긴다.
//  - 세 수의 공약수·공배수를 하나하나 늘어놓으려 한다(공약수는 최대공약수의 약수, 공배수는 최소공배수의 배수이다).
//  - 최소공배수의 지수를 더하거나, 한 수에만 있는 소인수를 뺀다. 최대공약수에 큰 지수를 고르거나 한 수에만 있는 소인수를 넣는다.
//  - 분수 꼴(24/n, n/45)만 보고 공약수와 공배수를 거꾸로 댄다.
//
// 실력에는 ① 문제의 수·식·말에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(약수의 개수에서 거꾸로 지수 구하기,
// 두 번째로 큰 약수, 홀수·짝수인 약수 세기, 곱하는 수와 제곱이 되는 수를 함께 구하기, 공배수 가운데 제곱인 수·가까운 수·몇 번째 수,
// 최대공약수와 최소공배수에서 거꾸로 지수와 소인수 구하기)만 실었다. 기본에서 하는 일을 고르기로 바꾼 것, 수만 키운 계산은 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, numbers, N, M, C } = B.kit;
  const K = B.kit.m711;
  const { U, STD1, STD2, LAB, range, gcd, lcm, nb, tail, V, sup, ex, taggedEx, claimQ, isPrime, PRIMES, P2, divs, isSquare, asc, fz, num, nd, sortF, gcdF, lcmF, expIn,
    pw, fx, fh, fjs, fm, fmj, eqn, split, ndTold, UNSEEN, expJs, gExp, lExp, gcdJs, lcmJs, SQ, form, someForms, primesOf, shelf, ruled, gTold, lTold } = K;
  const { tagged } = B.kit.mid;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①42' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const asExpr = (h) => h.replace(/ ([+×=]) /g, ' <i>$1</i> ');
  const product = (list) => list.reduce((s, v) => s * v, 1);
  // 100보다 작은 수가 소수인지 보는 틀(2, 3, 5, 7로 나누어 본다. 11부터 120까지의 수에 쓴다)
  const sieve = (x) => [2, 3, 5, 7].map((p) => `0**(${x}%${p})`).join('+');
  // 밑이 소수가 아닌 수가 섞인 식: [[밑, 지수], …]
  const RAWS = [[[6, 2], [7, 1]], [[4, 1], [3, 3]], [[2, 1], [5, 1], [9, 1]], [[2, 3], [9, 1]], [[4, 2], [5, 1]], [[6, 1], [5, 2]], [[10, 2], [3, 1]], [[4, 1], [7, 2]], [[3, 1], [6, 2]], [[2, 2], [15, 1]], [[9, 1], [5, 2]], [[4, 1], [3, 1], [5, 1]], [[6, 2], [5, 1]], [[2, 2], [9, 1]]];

  const COPRIME_TRUE = ['최대공약수가 1인 두 자연수는 서로소이다.', '서로 다른 두 소수는 항상 서로소이다.', '1은 모든 자연수와 서로소이다.', '서로소인 두 자연수의 공약수는 1 하나뿐이다.', '서로소인 두 자연수의 최소공배수는 두 수의 곱과 같다.', '공통인 소인수가 없는 두 자연수는 서로소이다.'];
  const COPRIME_FALSE = [
    ['서로 다른 두 홀수는 항상 서로소이다.', '3과 9는 모두 홀수이지만 최대공약수가 3이므로 서로소가 아니다.'], ['서로소인 두 자연수는 모두 소수이다.', '8과 15는 모두 합성수이지만 최대공약수가 1이므로 서로소이다.'],
    ['서로소인 두 자연수는 최대공약수가 없다.', '서로소인 두 자연수의 최대공약수는 1이다.', '최대공약수가 1인 두 자연수는 서로소이다.'],
    ['소수와 합성수는 항상 서로소이다.', '3과 6의 최대공약수는 3이므로 서로소가 아니다.'], ['홀수와 짝수는 항상 서로소이다.', '9와 12의 최대공약수는 3이므로 서로소가 아니다.'],
    ['서로소인 두 자연수는 공약수가 없다.', '1은 모든 자연수의 약수이므로 서로소인 두 자연수도 공약수 1을 가진다.', '서로소인 두 자연수의 공약수는 1 하나뿐이다.'], ['1과 서로소인 자연수는 없다.', '1과 어떤 자연수의 최대공약수도 1이므로 1은 모든 자연수와 서로소이다.', '1은 모든 자연수와 서로소이다.']
  ];
  const ALWAYS_TRUE = ['4의 배수 가운데 소수는 없다.', '3의 배수 가운데 소수는 3 하나뿐이다.', '약수가 3개인 자연수는 합성수이다.', '서로 다른 두 소수의 곱은 합성수이다.', '짝수인 소수는 2 하나뿐이다.', '5의 배수 가운데 소수는 5 하나뿐이다.', '1보다 큰 자연수는 소수이거나 합성수이다.'];
  const ALWAYS_FALSE = [
    ['소수는 모두 홀수이다.', '2는 짝수인 소수이다.', '짝수인 소수는 2 하나뿐이다.'], ['짝수는 모두 합성수이다.', '2는 짝수이지만 소수이다.', '짝수인 소수는 2 하나뿐이다.'],
    ['자연수는 소수와 합성수로만 이루어져 있다.', '1은 소수도 합성수도 아닌 자연수이다.', '1보다 큰 자연수는 소수이거나 합성수이다.'], ['소수가 아닌 자연수는 모두 합성수이다.', '1은 소수가 아니지만 합성수도 아니다.', '1보다 큰 자연수는 소수이거나 합성수이다.'],
    ['두 자연수의 곱은 항상 합성수이다.', '1 × 2 = 2는 소수이다.'], ['두 소수의 합은 항상 짝수이다.', '2 + 3 = 5는 홀수이다.'], ['홀수는 모두 소수이다.', '9 = 3 × 3은 홀수인 합성수이다.'],
    ['합성수는 모두 짝수이다.', '15 = 3 × 5는 홀수인 합성수이다.'], ['두 소수의 곱은 항상 홀수이다.', '2 × 3 = 6은 짝수이다.'], ['모든 자연수는 약수가 2개 이상이다.', '1의 약수는 1 하나뿐이다.']
  ];

  B.addGroup(U, {
    id: 'hard', title: '실력 문제', standard: STD1,
    types: [
      // ── ① 문제의 수·식·말에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-prime-both', '1과 2, 소수처럼 보이는 합성수가 섞인 수 목록에서 소수와 합성수의 개수', '심1 / 기본 ①3·4', (d) => {
        // 함정: 1을 소수나 합성수로 세는 아이(두 개수의 합이 수의 개수와 같다고 여긴다), 2를 짝수라서 합성수로 세는 아이, 51·57·87·91을 소수로 세는 아이.
        const a = d.int(1, 3), b = d.int(2, 3), look = d.shuffle([39, 49, 51, 57, 87, 91]).slice(0, b);
        const list = d.shuffle([1, 2].concat(d.shuffle(P2).slice(0, a), look, d.shuffle([8, 12, 15, 25, 32, 45, 66, 85, 100]).slice(0, 8 - a - b)));
        const counts = list.map((v) => divs(v).length), ps = asc(list.filter(isPrime)), cs = asc(list.filter((v) => v > 1 && !isPrime(v)));
        return M('다음 수 가운데 소수와 합성수는 각각 몇 개인가?', [{ label: '소수', answer: ps.length, unit: '개' }, { label: '합성수', answer: cs.length, unit: '개' }], {
          figure: numbers(list),
          explain: `1은 소수도 합성수도 아니고, 2는 소수이다. ${asc(look).map(split).join(', ')}이므로 이 수들은 합성수이다. 소수는 ${ps.join(', ')}의 ${ps.length}개, 합성수는 ${cs.join(', ')}의 ${cs.length}개이다.`,
          facts: { count: counts.map((c) => c === 2), big: { countIf: { values: counts, test: 'above', target: 2.5, i: 1 } } }
        });
      }),
      H('hard-prime-claims', '「모두」「항상」이 붙은 소수와 합성수에 대한 설명 가리기', '심3 / 기본 ①10', (d) => ruled(claimQ(d, '소수와 합성수에 대한 설명으로 항상 옳은 것은?', ALWAYS_TRUE, ALWAYS_FALSE, true), 'hard-prime-claims')),
      // (위 문항의 함정: 「모두」「항상」이 붙은 말은 1과 2에서 깨진다. 1은 소수도 합성수도 아니고, 2는 짝수인 소수이다. 틀린 말마다 1이나 2, 9를 넣어 보아야 가려진다.)
      H('hard-prime-ends', '범위 안에서 가장 큰 소수와 가장 작은 합성수', '심2', (d) => {
        // 함정: 범위의 첫 수(11, 13, 17 …)가 소수인데 그것을 가장 작은 합성수로 적는 아이, 범위의 끝 수(51, 57, 91 …)를 소수로 여겨 가장 큰 소수로 적는 아이.
        const [a, b] = d.until(() => [d.pick([10, 12, 16, 18, 22, 28, 30]), d.pick([28, 34, 40, 50, 52, 58, 64, 70, 78, 88, 92, 94])], ([x, y]) => y - x >= 12);
        const inside = range(a + 1, b - 1), top = Math.max(...inside.filter(isPrime)), low = Math.min(...inside.filter((v) => !isPrime(v))), over = range(top + 1, b - 1).reverse();
        return M(`${a}보다 크고 ${b}보다 작은 자연수 가운데 가장 큰 소수와 가장 작은 합성수는?`, [{ label: '가장 큰 소수', answer: top }, { label: '가장 작은 합성수', answer: low }], {
          explain: `${b}보다 작은 수를 큰 것부터 살핀다. ${over.map(split).join(', ')}이므로 이 수들은 합성수이고, ${josa(top, '은/는')} 소수이다. ${a}보다 큰 수를 작은 것부터 살피면 ${josa(a + 1, '은/는')} 소수이고 ${split(low)}${tail(low / 2, '은/는')} 합성수이다.`,
          facts: { digit: { template: `${sieve('□')}<1`, lo: a + 1, hi: b - 1, ask: 'max' }, calc: [[`${a}+2`, 1]], unseen: [2] }
        });
      }),
      H('hard-prime-twin', '차가 2인 두 소수의 다음 짝 찾기', '심4', (d) => {
        // 함정: 39, 49, 51, 57, 69처럼 소수로 보이는 합성수를 소수로 여겨 (37, 39), (47, 49), (67, 69)를 답하는 아이.
        const p = d.pick([17, 29, 41, 59]), q = range(p + 1, 100).find((v) => isPrime(v) && isPrime(v + 2)), near = PRIMES.filter((r) => r > p + 2 && r < q && !isPrime(r + 2) && r + 2 < q);
        return M(`차가 2인 두 소수를 짝 지어 작은 것부터 차례로 쓰면 (3, 5), (5, 7), (11, 13), …이다. (${p}, ${p + 2}) 바로 다음에 오는 짝의 두 소수는?`, [{ label: '작은 수', answer: q }, { label: '큰 수', answer: q + 2 }], {
          explain: `${p + 2}보다 큰 소수를 차례로 살핀다. ${near.map((r) => `${josa(r, '은/는')} 소수이지만 ${split(r + 2)}${tail((r + 2) / fz(r + 2)[0][0], '은/는')} 소수가 아니다.`).join(' ')} ${josa(q, '과/와')} ${josa(q + 2, '은/는')} 모두 소수이고 차가 2이다.`,
          facts: { digit: { template: `${sieve('□')}+${sieve('(□+2)')}<1`, lo: p + 1, hi: 100, ask: 'min' }, calc: [[`${q}+2`, 1]], unseen: [q, 2] }
        });
      }),
      H('hard-power-count', '덧셈·곱셈·거듭제곱이 섞인 등식 가운데 옳은 것의 개수', '심6 / 기본 ①17', (d) => {
        // 함정: 2³을 2 × 3으로, 3 + 3 + 3을 3³으로 읽는 아이. 거꾸로 「덧셈으로 쓴 식은 거듭제곱과 같을 수 없다」고 외운 아이는 2 + 2 + 2 + 2 = 2³, 3 + 3 + 3 = 3²을 틀렸다고 한다.
        //  값을 직접 셈해야 가려진다. [글, 왼쪽 값, 오른쪽 값, 왼쪽 식의 이름(같은 왼쪽 식이 두 번 나오지 않게)]
        const plus = (a, k) => Array(k).fill(a).join(' + '), times = (a, k) => Array(k).fill(a).join(' × ');
        const yes = [[`${plus(2, 4)} = 2${sup(3)}`, 8, 8, 'a'], [`${plus(3, 3)} = 3${sup(2)}`, 9, 9, 'b'], [`${plus(4, 4)} = 4${sup(2)}`, 16, 16, 'c'], [`2${sup(4)} = 4${sup(2)}`, 16, 16, 'd'], [`${plus(2, 2)} = 2${sup(2)}`, 4, 4, 'e'], [`${plus(5, 5)} = 5${sup(2)}`, 25, 25, 'f']];
        const no = [[`${plus(3, 3)} = 3${sup(3)}`, 9, 27, 'b'], [`2${sup(3)} = 2 × 3`, 8, 6, 'g'], [`5${sup(2)} = 5 × 2`, 25, 10, 'h'], [`${times(4, 3)} = 4 × 3`, 64, 12, 'i'], [`${plus(2, 3)} = 2${sup(3)}`, 6, 8, 'j'], [`3${sup(2)} = 2${sup(3)}`, 9, 8, 'k'], [`${plus(4, 4)} = 4${sup(4)}`, 16, 256, 'c'], [`${plus(2, 4)} = 2${sup(4)}`, 8, 16, 'a']];
        const k = d.int(1, 3), rows = d.until(() => d.shuffle(d.shuffle(yes).slice(0, k).concat(d.shuffle(no).slice(0, 5 - k))), (list) => new Set(list.map((r) => r[3])).size === 5), right = rows.map((r, i) => (r[1] === r[2] ? LAB[i] : '')).filter(Boolean);
        return N('다음 중 옳은 것은 모두 몇 개인가?', k, {
          unit: '개', figure: taggedEx(rows.map((r) => asExpr(r[0]))),
          explain: `양쪽의 값을 셈하여 비교한다. ${rows.map((r, i) => `${LAB[i]} ${r[1]} ${r[1] === r[2] ? '=' : '≠'} ${r[2]}`).join(', ')}이다. 옳은 것은 ${right.join(', ')}의 ${k}개이다.`,
          facts: { count: rows.map((r) => r[1] === r[2]) }
        });
      }),
      H('hard-factor-cond', '범위 안에서 소인수가 2개이고 그 합이 정해진 수', '심13', (d) => {
        // 함정: 36 = 2² × 3²의 소인수를 4개로 세는 아이(지수만큼 센다), 소수 37의 소인수를 1과 37의 2개로 세는 아이. 소인수는 지수를 빼고 센다.
        const own = (v) => fz(v).map(([p]) => p);
        const [lo, hi, t] = d.until(() => { const v = d.pick([12, 18, 24, 36, 48, 54, 72, 96, 20, 40, 50, 80, 45, 75, 28, 56, 98, 63, 44, 88]), s = d.int(0, 3); return [v - s - 1, v - s + 4, v]; },
          ([a, b, v]) => range(a + 1, b - 1).filter((k) => own(k).length === 2 && own(k)[0] + own(k)[1] === own(v)[0] + own(v)[1]).length === 1);
        const [p, q] = own(t), under = PRIMES.filter((r) => r < 100);
        return N(`${lo}보다 크고 ${hi}보다 작은 자연수 가운데 소인수가 2개이고 두 소인수의 합이 ${p + q}인 수는?`, t, {
          explain: `${range(lo + 1, hi - 1).map((v) => (isPrime(v) ? `${v}(소수)` : eqn(v))).join(', ')}이다. 소인수는 지수와 상관없이 센다. ${t}의 소인수는 ${p}, ${q}의 2개이고 합이 ${p + q}이다.`,
          facts: { digit: { template: `${p + q}+1999<${under.map((r) => `${r}*0**(□%${r})`).join('+')}+1000*(${under.map((r) => `0**(□%${r})`).join('+')})<${p + q}+2001`, lo: lo + 1, hi: hi - 1, ask: 'max' } }
        });
      }),
      H('hard-raw', '밑이 소수가 아닌 식으로 준 수의 약수의 개수와 소인수', '심12·22 / 기본 ①39', (d, n) => {
        // 함정: 6² × 7을 소인수분해 한 식으로 여겨 그대로 (2 + 1) × (1 + 1)개라고 세거나, 소인수를 6과 7이라고 하는 아이. 밑이 소수가 아니면 소인수분해부터 다시 한다.
        const raw = d.pick(RAWS), v = num(raw), f = fz(v), odd = raw.filter(([b]) => !isPrime(b)), x = V('A');
        const again = `${odd.map(([b, e]) => `${pw(b, e)} = ${fx(fz(b ** e))}`).join(', ')}이므로 ${fx(raw)} = ${fx(f)}이다.`;
        if (n === 0) return N(`${nb(fx(raw))}의 약수는 모두 몇 개인가?`, nd(f), {
          unit: '개', explain: `${odd.map(([b]) => b).join(', ')}${tail(odd[odd.length - 1][0], '은/는')} 소수가 아니므로 소인수분해 한 식이 아니다. ${again} 약수의 개수는 ${ndTold(f)}이다.`,
          facts: { count: range(1, v).map((k) => v % k === 0), rule: 'raw-count' }
        });
        // 둘째: 옳지 않은 설명 고르기. 틀린 말은 밑을 그대로 소인수로 댄 것이거나, 주어진 식을 소인수분해 한 것이라고 한 것이다.
        const ps = f.map(([p]) => p), oddP = f.filter(([, e]) => e % 2 === 1).map(([p]) => p), mul = d.pick(divs(v).filter((k) => k > 3 && k < v && !isPrime(k) && !raw.some(([b, e]) => b === k || b ** e === k)));
        const lie = d.bool(), wrong = lie ? [`${x}의 소인수는 ${asc(raw.map(([b]) => b)).join(', ')}이다.`, `${odd[0][0]}${tail(odd[0][0], '은/는')} 소수가 아니므로 소인수가 아니다. ${x}의 소인수는 ${ps.join(', ')}이다.`] : [`${fmj(raw, '은/는')} ${x}를 소인수분해 한 것이다.`, `밑 ${odd[0][0]}${tail(odd[0][0], '이/가')} 소수가 아니므로 소인수분해 한 것이 아니다. 소인수분해 하면 ${fx(f)}이다.`];
        const good = d.shuffle([`${x}는 ${mul}의 배수이다.`, oddP.length ? `${x}에 ${josa(product(oddP), '을/를')} 곱하면 어떤 자연수의 제곱이 된다.` : `${x}는 어떤 자연수의 제곱이다.`, `${x}의 약수는 모두 ${nd(f)}개이다.`].concat(lie ? [] : [`${x}의 소인수는 ${ps.join(', ')}이다.`])).slice(0, 3);
        const rows = d.shuffle(good.concat([wrong[0]]));
        return C(`자연수 ${x}가 다음과 같을 때, ${x}에 대한 설명으로 옳지 않은 것은?`, rows, rows.indexOf(wrong[0]), {
          figure: ex(`${x} <i>=</i> ${fh(raw)}`),
          explain: `${again} ${wrong[1]}`,
          facts: { truth: rows.map((r) => r !== wrong[0]), want: false, rule: 'raw-claims' }
        });
      }, { count: 2 }),
      H('hard-divisor-fill', '곱한 수의 약수의 개수가 정해질 때 □에 들어갈 수 없는 수', '심25', (d) => {
        // 함정: □에 서로 다른 두 소수의 곱을 넣으면 다 된다고 여기는 아이, □의 약수의 개수만 따로 세어 곱하는 아이. □에 이미 있는 소인수가 들면 지수를 합쳐서 다시 세어야 한다(2³ × 6 = 2⁴ × 3).
        //  이미 있는 소인수가 들었어도 되는 수(2² × 18 = 2³ × 3²)를 하나 섞어, 「같은 소인수가 들면 안 된다」고만 외운 아이도 걸리게 한다.
        const [p, a] = d.pick([[2, 3], [3, 2], [2, 2], [5, 2]]), base = p ** a, want = (a + 1) * 4;
        const fine = range(2, 60).filter((x) => divs(base * x).length === want), poor = range(2, 60).filter((x) => x % p === 0 && fz(x).length === 2 && nd(fz(x)) === 4 && divs(base * x).length !== want);
        const bad = d.pick(poor), good = d.shuffle(fine.filter((x) => x % p === 0)).slice(0, 1).concat(d.shuffle(fine.filter((x) => x % p !== 0)).slice(0, 3)), rows = d.shuffle(good.concat([bad])), made = fz(base * bad);
        return C(`${nb(`${pw(p, a)} × ${box()}`)}의 약수가 ${want}개일 때, 다음 중 □ 안에 들어갈 수 없는 수는?`, rows.map(String), rows.indexOf(bad), {
          explain: `${eqn(bad)}이므로 ${pw(p, a)} × ${bad} = ${fx(made)}이고, 약수의 개수는 ${ndTold(made)}이다. □에 ${josa(p, '을/를')} 소인수로 가지는 수를 넣으면 ${p}의 지수가 달라지므로 소인수분해부터 다시 한다. ${asc(good).map((x) => `${pw(p, a)} × ${x} = ${fx(fz(base * x))}`).join(', ')}의 약수는 모두 ${want}개이다.`,
          facts: { truth: rows.map((x) => divs(base * x).length === want), want: false }
        });
      }),
      H('hard-square-divisors', '약수 가운데 어떤 자연수의 제곱인 수의 개수', '기본 ①44', (d) => {
        // 함정: 1을 빼는 아이(1 = 1 × 1), 지수가 홀수인 소인수를 한 번 넣는 아이, 2⁴의 약수 가운데 2²만 세고 2⁴을 빼는 아이.
        const v = d.pick([144, 180, 196, 200, 300, 324, 400, 432, 450, 576, 720, 900]), hits = divs(v).filter(isSquare);
        return N(`${v}의 약수 가운데 어떤 자연수의 제곱인 수는 모두 몇 개인가?`, hits.length, {
          unit: '개', explain: `${eqn(v)}이다. 어떤 자연수의 제곱인 수는 소인수분해 했을 때 모든 소인수의 지수가 짝수이다. 약수 가운데 소인수를 짝수 번씩만 곱한 수를 찾으면 ${hits.join(', ')}의 ${hits.length}개이다. 1 = 1 × 1도 어떤 자연수의 제곱이다.`,
          facts: { count: divs(v).map((k) => Number.isInteger(k ** 0.5)) }
        });
      }),
      H('hard-square-not', '곱하여 어떤 자연수의 제곱이 되게 하는 수가 아닌 것', '기본 ①48', (d) => {
        // 함정: 가장 작은 수(3)만 알고 그 배수(6)나 제곱(9)도 된다고 여기는 아이. 곱하는 수는 3 × (어떤 자연수의 제곱) 꼴이어야 한다.
        const f = form(d, { ps: [2, 3, 5, 7], k: 2, lo: 40, hi: 600, ok: (g) => g.filter(([, e]) => e % 2 === 1).length === 1 && g.some(([, e]) => e >= 2) }), v = num(f), k = f.find(([, e]) => e % 2 === 1)[0];
        const good = asc(d.shuffle([1, 4, 9, 16, 25]).slice(0, 4)).map((s) => k * s), bad = d.pick([k * k, 2 * k, 3 * k, 6 * k].filter((x) => !isSquare(v * x) && !good.includes(x))), rows = d.shuffle(good.concat([bad]));
        return C(`${v}에 자연수를 곱하여 어떤 자연수의 제곱이 되게 하려고 한다. 다음 중 곱하는 수가 될 수 없는 것은?`, rows.map(String), rows.indexOf(bad), {
          explain: `${eqn(v)}이다. 지수가 홀수인 소인수는 ${k}뿐이므로 곱하는 수는 ${k}에 어떤 자연수의 제곱을 곱한 수이어야 한다. ${good.map((g) => `${g} = ${k} × ${g / k}`).join(', ')}이다. ${v} × ${bad} = ${fx(fz(v * bad))}에는 지수가 홀수인 소인수가 있으므로 ${josa(bad, '은/는')} 될 수 없다.`,
          facts: { truth: rows.map((x) => Number.isInteger((v * x) ** 0.5)), want: false }
        });
      }),
      H('hard-coprime-pairs', '합성수끼리, 소수와 그 배수가 섞인 짝 가운데 서로소인 것의 수', '심29 / 기본 ①65', (d) => {
        // 함정: 합성수끼리는 서로소가 아니라고 여기는 아이(8과 15), 소수가 끼면 서로소라고 여기는 아이(17과 51), 홀수끼리는 서로소라고 여기는 아이(9와 21), 1이 낀 짝을 빼는 아이.
        const YES = [[8, 15], [14, 25], [9, 16], [27, 35], [21, 40], [45, 77], [16, 35]], EASY = [[11, 13], [7, 23], [1, 12], [1, 18], [1, 25]], NO = [[17, 51], [13, 91], [19, 57], [9, 21], [15, 33], [21, 35], [22, 33], [38, 57], [27, 45], [14, 91]];
        const a = d.int(1, 2), b = d.int(0, 1), rows = d.shuffle(d.shuffle(YES).slice(0, a).concat(d.shuffle(EASY).slice(0, b), d.shuffle(NO).slice(0, 5 - a - b)));
        const gs = rows.map(([x, y]) => gcd(x, y)), hit = rows.map((r, i) => (gs[i] === 1 ? LAB[i] : '')).filter(Boolean);
        return N('다음 중 두 수가 서로소인 것은 모두 몇 쌍인가?', a + b, {
          unit: '쌍', figure: tagged(rows.map(([x, y]) => `${josa(x, '과/와')} ${y}`)),
          explain: `서로소는 최대공약수가 1인 두 자연수이다. 두 수가 모두 합성수여도 공통인 소인수가 없으면 서로소이고, 한 수가 소수여도 다른 수가 그 배수이면 서로소가 아니다. 최대공약수는 차례로 ${gs.join(', ')}이므로 서로소인 것은 ${hit.join(', ')}의 ${hit.length}쌍이다.`,
          facts: { count: rows.map(([x, y]) => divs(x).filter((k) => y % k === 0).length === 1) }
        });
      }, { standard: STD2 }),
      H('hard-coprime-claims', '서로소에 대한 설명 가리기', '심30·31 / 기본 ①68·69', (d) => ruled(claimQ(d, '서로소에 대한 설명으로 옳은 것은?', COPRIME_TRUE, COPRIME_FALSE, true), 'hard-coprime-claims'), { standard: STD2 }),
      // (위 문항의 함정: 서로소를 「두 수가 모두 소수」 「홀수끼리」 「공약수가 없다」로 아는 아이. 서로소는 최대공약수가 1이라는 뜻뿐이다.)
      H('hard-coprime-quot', '두 수를 나눈 몫이 서로소가 되게 하는 수', '기본 ①63', (d) => {
        // 함정: 아무 공약수로나 나누어도 된다고 여기는 아이(몫에 공약수가 남는다). 몫이 서로소가 되려면 최대공약수로 나누어야 한다.
        const fs = someForms(d, 2, { hi: 600, lo: 60, gmin: 12 }).sort((x, y) => num(x) - num(y)), vs = fs.map(num), g = gcd(vs[0], vs[1]);
        return N(`${josa(vs[0], '과/와')} ${josa(vs[1], '을/를')} 어떤 자연수로 나누면 모두 나누어떨어지고, 두 몫은 서로소가 된다. 어떤 자연수는?`, g, {
          explain: `두 수를 공약수로 나눈 몫이 서로소가 되려면 더 나눌 공약수가 남지 않아야 하므로 최대공약수로 나누어야 한다. ${eqn(vs[0])}, ${eqn(vs[1])}이므로 최대공약수는 ${fx(fz(g))} = ${g}이다. 몫은 ${josa(vs[0] / g, '과/와')} ${vs[1] / g}이다.`,
          facts: { calc: [[gcdJs(vs.map(String), [2, 3, 5, 7], vs[1]), 0]], unseen: UNSEEN }
        });
      }, { standard: STD2 }),
      H('hard-frac-n', '두 분수가 모두 자연수가 되게 하는 수', '기본 ①64·83 / 심52', (d, n) => {
        // 함정: 분수 꼴만 보고 공약수와 공배수를 거꾸로 대는 아이. 분모에 n이 있으면 n은 분자들의 공약수, 분자에 n이 있으면 n은 분모들의 공배수이다.
        const x = V('n');
        if (n === 0) {
          const fs = someForms(d, 2, { hi: 600, lo: 60, gmin: 12 }).sort((p, q) => num(p) - num(q)), vs = fs.map(num), g = gcd(vs[0], vs[1]);
          return N(`${frac(vs[0], x)}, ${frac(vs[1], x)}${tail(vs[1], '이/가')} 모두 자연수가 되게 하는 자연수 ${x} 가운데 가장 큰 수는?`, g, {
            explain: `두 분수가 모두 자연수가 되려면 ${x}은 ${josa(vs[0], '과/와')} ${vs[1]}의 공약수이어야 한다. 그 가운데 가장 큰 수는 최대공약수이다. ${eqn(vs[0])}, ${eqn(vs[1])}이므로 ${fx(fz(g))} = ${g}이다.`,
            facts: { calc: [[gcdJs(vs.map(String), [2, 3, 5, 7], vs[1]), 0]], unseen: UNSEEN, rule: 'frac-n-gcd' }
          });
        }
        const fs = someForms(d, 2, { hi: 200, lo: 24, gmin: 4, lmax: 2000 }).sort((p, q) => num(p) - num(q)), vs = fs.map(num), l = lcm(vs[0], vs[1]);
        return N(`${frac(x, vs[0])}, ${frac(x, vs[1])}이 모두 자연수가 되게 하는 자연수 ${x} 가운데 가장 작은 수는?`, l, {
          explain: `두 분수가 모두 자연수가 되려면 ${x}은 ${josa(vs[0], '과/와')} ${vs[1]}의 공배수이어야 한다. 그 가운데 가장 작은 수는 최소공배수이다. ${eqn(vs[0])}, ${eqn(vs[1])}이므로 ${fx(fz(l))} = ${l}이다.`,
          facts: { calc: [[lcmJs(vs.map(String), [2, 3, 5, 7], vs[1]), 0]], unseen: UNSEEN, rule: 'frac-n-lcm' }
        });
      }, { count: 2, standard: STD2 }),
      H('hard-lcm-other', '최소공배수가 주어질 때 다른 한 수가 될 수 없는 것', '심38 / 기본 ①88', (d) => {
        // 함정: 최소공배수의 약수이면 다 된다고 여기는 아이(모자란 소인수를 채우지 못한다), 지수가 최소공배수보다 커도 된다고 여기는 아이. 보기는 모두 최소공배수와 소인수가 겹치는 수이다.
        const [aF, lF, key] = d.until(() => { const L = form(d, { ps: [2, 3, 5], k: 3, lo: 60, hi: 2700 }), q = d.pick([2, 3, 5]), cut = d.int(1, expIn(L, q)); return [L.map(([p, e]) => [p, p === q ? e - cut : e]).filter(([, e]) => e > 0), L, q]; }, ([a]) => a.length >= 2);
        const a = num(aF), l = num(lF), fits = (x) => lcm(x, a) === l, need = key ** expIn(lF, key);
        const fine = divs(l).filter(fits), over = lF.filter(([p]) => p !== key).map(([p, e]) => need * p ** (e + 1)), short = divs(l / key).filter((x) => x > 1 && !fits(x) && fz(x).length >= 2);
        const bad = d.pick(d.int(0, 2) === 0 && short.length ? short : over), rows = d.shuffle(d.shuffle(fine).slice(0, 4).concat([bad])), [p, e] = fz(bad).find(([q, k]) => k > expIn(lF, q)) || [0, 0];
        return C(`어떤 자연수와 ${fm(aF)}의 최소공배수가 ${fm(lF)}일 때, 다음 중 어떤 자연수가 될 수 없는 것은?`, rows.map((x) => fx(fz(x))), rows.indexOf(bad), {
          explain: `최소공배수의 지수는 두 수의 지수 가운데 같거나 큰 것이다. ${expIn(aF, key) ? `${fx(aF)}에서 ${key}의 지수 ${josa(expIn(aF, key), '은/는')} 최소공배수의 지수 ${expIn(lF, key)}보다 작으므로` : `${fx(aF)}에는 소인수 ${josa(key, '이/가')} 없으므로`} 어떤 자연수는 ${pw(key, expIn(lF, key))}의 배수이어야 하고, 어느 소인수의 지수도 최소공배수의 지수보다 클 수 없다. ${fmj(fz(bad), '은/는')} ${p ? `소인수 ${p}의 지수 ${josa(e, '이/가')} 최소공배수의 지수 ${e - 1}보다 크다` : `${pw(key, expIn(lF, key))}의 배수가 아니다`}.`,
          facts: { truth: rows.map((x) => { let m = x; while (m % a !== 0) m += x; return m === l; }), want: false }
        });
      }, { standard: STD2 }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-divisor-exp', '약수의 개수를 알 때 지수 구하기', '기본 ①40 / 심24', (d, n) => {
        // 첫째: 약수의 개수 → (지수 + 1)끼리의 곱 → 모르는 지수. 둘째: 다른 수의 약수의 개수부터 구한다(소인수분해 → 개수 → 거꾸로).
        const draw = () => { const [p0, q0] = d.shuffle([2, 3, 5, 7]), a0 = d.int(2, 4), m0 = d.int(1, 4); return [p0, q0, a0, m0]; };
        const same = ([p0, q0, a0, m0]) => range(24, 400).filter((w) => divs(w).length === (a0 + 1) * (m0 + 1) && fz(w).length >= 2 && w !== p0 ** a0 * q0 ** m0);
        const [p, q, a, m] = n === 0 ? draw() : d.until(draw, (c) => same(c).length >= 3), k = (a + 1) * (m + 1), x = V('x'), shown = nb(`${pw(p, a)} × ${q}${sup(x)}`);
        if (n === 0) return N(`${shown}의 약수가 ${k}개일 때, 자연수 ${x}의 값은?`, m, {
          explain: `약수의 개수는 (${a} + 1) × (${x} + 1) = ${k}이다. ${x} + 1 = ${k} ÷ ${a + 1} = ${m + 1}이므로 ${x} = ${m}이다.`,
          facts: { calc: [[`${k}/(${a}+1)-1`, 0]], unseen: [1], rule: 'divisor-exp-direct' }
        });
        const v = d.pick(same([p, q, a, m])), f = fz(v);
        return N(`${v}의 약수의 개수와 ${shown}의 약수의 개수가 같을 때, 자연수 ${x}의 값은?`, m, {
          explain: `${eqn(v)}이므로 ${v}의 약수의 개수는 ${ndTold(f)}이다. (${a} + 1) × (${x} + 1) = ${k}에서 ${x} + 1 = ${m + 1}이므로 ${x} = ${m}이다.`,
          facts: { calc: [[`(${range(1, v).map((w) => `0**(${v}%${w})`).join('+')})/(${a}+1)-1`, 0]], unseen: range(0, v), rule: 'divisor-exp-equal' }
        });
      }, { count: 2 }),
      H('hard-divisor-second', '소인수분해 한 수의 약수 가운데 두 번째로 큰 수', '기본 ①42', (d) => {
        // 가장 큰 약수는 자기 자신 → 그다음은 가장 작은 소인수로 나눈 수 → 값을 셈한다.
        const f = form(d, { ps: [2, 3, 5, 7], k: 3, lo: 100, hi: 2000 }), v = num(f), p = f[0][0], rest = fz(v / p);
        return N(`${fm(f)}의 약수 가운데 두 번째로 큰 수는?`, v / p, {
          explain: `가장 큰 약수는 자기 자신이다. 두 번째로 큰 약수는 가장 작은 소인수 ${josa(p, '으로/로')} 한 번 나눈 수이므로 ${fx(rest)} = ${v / p}이다.`,
          facts: { digit: { template: `(${fjs(f)})%□<1`, lo: 1, hi: v - 1, ask: 'max' } }
        });
      }),
      H('hard-divisor-odd', '약수 가운데 홀수의 개수', '심27', (d) => {
        // 홀수인 약수는 2를 곱하지 않은 약수 → 2를 뺀 나머지의 약수 → 개수.
        const f = d.until(() => { const [q, r] = asc(d.shuffle([3, 5, 7]).slice(0, 2)); return [[2, d.int(1, 4)], [q, d.int(1, 3)], [r, d.int(1, 3)]]; }, (g) => num(g) <= 9999 && nd(g.slice(1)) >= 4), v = num(f), rest = f.slice(1);
        return N(`${fm(f)}의 약수 가운데 홀수는 모두 몇 개인가?`, nd(rest), {
          unit: '개', explain: `홀수인 약수는 2를 한 번도 곱하지 않은 약수이므로 ${fx(rest)}의 약수와 같다. 그 개수는 ${ndTold(rest)}이다.`,
          facts: { count: divs(v).map((k) => k % 2 === 1) }
        });
      }),
      H('hard-common-even', '공약수 가운데 짝수의 개수', '심34', (d) => {
        // 공약수는 최대공약수의 약수 → 모두 몇 개 → 홀수인 것(2를 곱하지 않은 것)을 덜어 낸다.
        const fs = d.until(() => { const [q, r] = asc(d.shuffle([3, 5, 7]).slice(0, 2)); return [0, 1].map(() => [[2, d.int(1, 4)], [q, d.int(1, 3)]].concat(d.bool() ? [[r, d.int(1, 2)]] : [])); },
          (list) => { const [x, y] = list.map(num), g = gcd(x, y); return x !== y && x <= 9999 && y <= 9999 && g < x && g < y && nd(fz(g)) >= 6 && g % 4 === 0; });
        const vs = fs.map(num), gF = gcdF(fs), g = num(gF), rest = gF.slice(1), all = nd(gF), oddN = nd(rest);
        return N(`두 수 ${fm(fs[0])}, ${fm(fs[1])}의 공약수 가운데 짝수는 모두 몇 개인가?`, all - oddN, {
          unit: '개', explain: `공약수는 최대공약수 ${fx(gF)}의 약수이고 모두 ${ndTold(gF)}개이다. 이 가운데 홀수는 2를 곱하지 않은 ${fx(rest)}의 약수 ${oddN}개이다. 짝수인 공약수는 ${all} − ${oddN} = ${all - oddN}개이다.`,
          facts: { count: range(1, Math.min(...vs)).filter((k) => vs.every((v) => v % k === 0)).map((k) => k % 2 === 0) }
        });
      }, { standard: STD2 }),
      H('hard-square-second', '곱하여 어떤 자연수의 제곱이 되게 하는 수 가운데 두 번째로 작은 수', '심18', (d) => {
        // 가장 작은 수 k → 곱하는 수는 k × (어떤 자연수의 제곱) → 두 번째는 k × 4. (k × 2로 답하면 틀린다.)
        const f = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3]), lo: 40, hi: 700, ok: (g) => g.some(([, e]) => e % 2 === 1) && g.some(([, e]) => e >= 2) }), v = num(f), k = product(f.filter(([, e]) => e % 2 === 1).map(([p]) => p));
        return N(`${v}에 자연수를 곱하여 어떤 자연수의 제곱이 되게 하려고 한다. 곱할 수 있는 자연수 가운데 두 번째로 작은 수는?`, 4 * k, {
          explain: `${eqn(v)}이므로 곱할 수 있는 가장 작은 수는 ${k}이다. 지수가 모두 짝수이려면 곱하는 수는 ${k}에 어떤 자연수의 제곱을 곱한 수이어야 하므로 작은 것부터 ${k} × 1, ${k} × 4, ${k} × 9, …이다. 두 번째로 작은 수는 ${k} × 4 = ${4 * k}이다.`,
          facts: { digit: { template: `(${v}*□)**0.5%1<${SQ}`, lo: k + 1, hi: 4 * k + 10, ask: 'min' } }
        });
      }),
      H('hard-square-both', '곱하거나 나누는 가장 작은 수와 그때 제곱이 되는 수', '기본 ①49 / 심16·17', (d, n) => {
        // 소인수분해 → 지수가 홀수인 소인수를 곱하거나 덜어 낸다 → 지수를 반으로 나눈 수가 제곱이 되는 수이다.
        const f = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3]), lo: 40, hi: 700, ok: (g) => g.some(([, e]) => e % 2 === 1) && g.some(([, e]) => e >= 2) && (n === 0 || num(g.map(([p, e]) => [p, e - (e % 2)])) >= 16) }), v = num(f);
        const k = product(f.filter(([, e]) => e % 2 === 1).map(([p]) => p)), done = f.map(([p, e]) => [p, n === 0 ? e + (e % 2) : e - (e % 2)]).filter(([, e]) => e > 0), half = done.map(([p, e]) => [p, e / 2]), b = num(half);
        return M(n === 0 ? `${v}에 가장 작은 자연수 ㉠을 곱하여 자연수 ㉡의 제곱이 되게 하려고 한다. ㉠, ㉡에 알맞은 수는?` : `${josa(v, '을/를')} 가장 작은 자연수 ㉠으로 나누어 자연수 ㉡의 제곱이 되게 하려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: k }, { label: LAB[1], answer: b }], {
          explain: `${eqn(v)}이다. 지수가 홀수인 소인수를 ${n === 0 ? '한 번씩 더 곱하면' : '하나씩 덜어 내면'} 되므로 ㉠은 ${k}이다. 이때 ${v} ${n === 0 ? '×' : '÷'} ${k} = ${fx(done)}이고, 이 수는 지수를 모두 반으로 나눈 ${fx(half)}${fx(half) === String(b) ? '' : ' = ' + b}${tail(b, '을/를')} 두 번 곱한 수이므로 ㉡은 ${b}이다.`,
          facts: { digit: { template: n === 0 ? `(${v}*□)**0.5%1<${SQ}` : `(${v}/□)**0.5%1+${v}%□<${SQ}`, lo: 1, hi: 2 * k + 10, ask: 'min' }, calc: [[`(${v}${n === 0 ? '*' : '/'}${k})**0.5`, 1]], unseen: [k, 0.5], rule: 'square-both-' + n }
        });
      }, { count: 2 }),
      H('hard-square-lcm', '공배수 가운데 어떤 자연수의 제곱인 가장 작은 수', '심19', (d) => {
        // 최소공배수를 구한다 → 공배수는 그 배수이므로 지수를 줄일 수 없다 → 홀수인 지수만 1씩 키운다.
        const fs = someForms(d, 2, { hi: 9000, ok: (list, G, L) => L.some(([, e]) => e % 2 === 1) && L.some(([, e]) => e % 2 === 0) }), lF = lcmF(fs), done = lF.map(([p, e]) => [p, e + (e % 2)]), top = Math.max(...fs.map(num)), labs = LAB.slice(0, lF.length);
        return M(`두 수 ${fm(fs[0])}, ${fm(fs[1])}의 공배수 가운데 어떤 자연수의 제곱인 가장 작은 수를 소인수분해 하면 다음과 같다. ${labs.join(', ')}에 알맞은 수는?`, done.map(([, e], i) => ({ label: LAB[i], answer: e })), {
          figure: ex(lF.map(([p], i) => p + sup(LAB[i])).join(' <i>×</i> ')),
          explain: `${lTold(fs)} 최소공배수는 ${fx(lF)}이다. 공배수는 최소공배수의 배수이므로 어느 지수도 최소공배수의 지수보다 작을 수 없다. 홀수인 지수만 1씩 키워 모두 짝수로 만들면 ${fx(done)}이다.`,
          facts: { calc: lF.map(([p], i) => { const e = lExp(fs.map(fjs), p, top); return [`(${e})+(${e})%2`, i]; }), unseen: UNSEEN }
        });
      }, { standard: STD2 }),
      H('hard-multiple-near', '세 수의 공배수 가운데 어떤 수에 가장 가까운 수', '심36 / 기본 ①79', (d) => {
        // 세 수의 최소공배수 → 그 배수 가운데 어떤 수의 바로 아래와 바로 위 → 어느 쪽이 가까운지 비교한다.
        const [fs, t] = d.until(() => [someForms(d, 3, { hi: 200, gmin: 2, lmax: 180 }), d.pick([300, 400, 500, 600, 700, 800, 1000])], ([list, target]) => { const l = num(lcmF(list)), r = target % l; return l >= 48 && r !== 0 && 2 * r !== l && Math.floor(target / l) >= 2; });
        const lF = lcmF(fs), l = num(lF), q = Math.floor(t / l), below = l * q, above = l * (q + 1), near = t - below < above - t ? below : above, L = `(${lcmJs(fs.map(fjs), primesOf(fs), Math.max(...fs.map(num)))})`;
        return N(`다음 세 수의 공배수 가운데 ${t}에 가장 가까운 수는?`, near, {
          figure: shelf(fs.map(fx)),
          explain: `${lTold(fs)} 세 수의 최소공배수는 ${fx(lF)} = ${l}이다. 공배수는 ${l}의 배수이고, ${t}의 바로 아래와 위에 있는 것은 ${l} × ${q} = ${below}, ${l} × ${q + 1} = ${above}이다. ${t} − ${below} = ${t - below}, ${above} − ${t} = ${above - t}이므로 가장 가까운 수는 ${near}이다.`,
          facts: { calc: [[`${L}*((2*${t}+${L}-(2*${t}+${L})%(2*${L}))/(2*${L}))`, 0]], unseen: UNSEEN }
        });
      }, { standard: STD2 }),
      H('hard-multiple-kth', '세 수의 공배수 가운데 몇 번째로 작은 수를 소인수분해 한 식', '기본 ①80', (d) => {
        // 세 수의 최소공배수 → k번째로 작은 공배수는 최소공배수의 k배 → k를 소인수분해 하여 지수를 합친다.
        const [fs, k] = d.until(() => [someForms(d, 3, { hi: 900, gmin: 2 }), d.pick([2, 3, 4, 5, 6, 8, 9, 10])], ([list, m]) => { const L = lcmF(list); return L.length === 3 && fz(m).every(([p]) => expIn(L, p)); });
        const lF = lcmF(fs), kF = fz(k), done = lF.map(([p, e]) => [p, e + expIn(kF, p)]), top = Math.max(...fs.map(num));
        return M(`다음 세 수의 공배수 가운데 ${k}번째로 작은 수를 소인수분해 하면 ${nb(lF.map(([p], i) => p + sup(LAB[i])).join(' × '))}이다. ㉠, ㉡, ㉢에 알맞은 수는?`, done.map(([, e], i) => ({ label: LAB[i], answer: e })), {
          figure: shelf(fs.map(fx)),
          explain: `${lTold(fs)} 세 수의 최소공배수는 ${fx(lF)}이다. 공배수를 작은 것부터 쓰면 최소공배수의 1배, 2배, 3배, …이므로 ${k}번째로 작은 수는 ${fx(lF)} × ${k}이다. ${kF.length > 1 || kF[0][1] > 1 ? eqn(k) + '이므로 ' : ''}같은 소인수끼리 모으면 ${fx(done)}이다.`,
          facts: { calc: lF.map(([p], i) => [`(${lExp(fs.map(fjs), p, top)})+(${expJs(String(k), p, k)})`, i]), unseen: UNSEEN }
        });
      }, { standard: STD2 }),
      H('hard-back-chain', '최대공약수에서 구한 지수로 최소공배수의 지수까지 구하기', '심37', (d) => {
        // 최대공약수를 소인수분해 → 작은 지수 ㉠, ㉡ → 구한 지수와 맞은편 지수 가운데 큰 것이 최소공배수의 지수 ㉢, ㉣.
        const [q, r] = asc(d.shuffle([2, 3, 5]).slice(0, 2)), s1 = d.pick([2, 3, 5, 7].filter((p) => p !== q && p !== r)), s2 = d.pick([11, 13]), x = d.int(1, 2), y = d.int(1, 2), dd = x + d.int(1, 2), c = y + d.int(1, 2), u = d.int(1, 2), g = q ** x * r ** y;
        const text = (cells) => cells.sort((m, k) => m[0] - k[0]).map((cell) => cell[1]).join(' × ');
        const a = text([[s1, pw(s1, u)], [q, q + sup(LAB[0])], [r, pw(r, c)]]), b = text([[q, pw(q, dd)], [r, r + sup(LAB[1])], [s2, String(s2)]]), frame = text([[s1, pw(s1, u)], [q, q + sup(LAB[2])], [r, r + sup(LAB[3])], [s2, String(s2)]]);
        return M(`다음 두 수의 최대공약수가 ${g}이고 최소공배수가 ${nb(frame)}일 때, ㉠, ㉡, ㉢, ㉣에 알맞은 자연수는?`, [x, y, dd, c].map((v, i) => ({ label: LAB[i], answer: v })), {
          figure: shelf([a, b]),
          explain: `${eqn(g)}이다. 최대공약수의 지수는 두 수의 지수 가운데 같거나 작은 것이므로 ㉠은 ${x}, ㉡은 ${y}이다. 최소공배수의 지수는 같거나 큰 것이므로 ㉢은 ${josa(x, '과/와')} ${dd} 가운데 큰 ${dd}, ㉣은 ${josa(c, '과/와')} ${y} 가운데 큰 ${c}이다.`,
          facts: { calc: [[expJs(g, q, g), 0], [expJs(g, r, g), 1], [String(dd), 2], [String(c), 3]], unseen: UNSEEN }
        });
      }, { standard: STD2 }),
      H('hard-back-unknown', '최대공약수와 최소공배수를 알 때 지수와 모르는 소인수 구하기', '기본 ①86', (d) => {
        // ㉠은 최대공약수에서(작은 지수), ㉡은 최소공배수에서(큰 지수), ㉢은 최소공배수에만 있는 소인수에서 정해진다.
        const [p, q] = asc(d.shuffle([2, 3, 5]).slice(0, 2)), r = d.pick([2, 3, 5, 7].filter((v) => v !== p && v !== q)), s = d.pick([7, 11, 13].filter((v) => v !== r)), a1 = d.int(2, 3), x = d.int(1, a1 - 1), a2 = d.int(1, 2), y = a2 + d.int(1, 2);
        const aF = sortF([[p, a1], [q, a2], [r, 1]]), gF = [[p, x], [q, a2]], lF = sortF([[p, a1], [q, y], [r, 1], [s, 1]]), other = `${p}${sup(LAB[0])} × ${q}${sup(LAB[1])} × ${box(LAB[2])}`;
        return M(`다음 두 수의 최대공약수가 ${fm(gF)}, 최소공배수가 ${fm(lF)}일 때, ㉠, ㉡, ㉢에 알맞은 자연수는? (단, ㉢은 소수이다.)`, [x, y, s].map((v, i) => ({ label: LAB[i], answer: v })), {
          figure: shelf([fx(aF), other]),
          explain: `최대공약수에서 ${p}의 지수 ${josa(x, '은/는')} ${fx(aF)}에서의 지수 ${a1}보다 작으므로 ㉠은 ${x}이다. 최소공배수에서 ${q}의 지수 ${josa(y, '은/는')} ${fx(aF)}에서의 지수 ${a2}보다 크므로 ㉡은 ${y}이다. 최소공배수의 소인수 ${josa(s, '은/는')} ${fx(aF)}에 없으므로 ㉢은 ${s}이다.`,
          facts: { calc: [[expJs(fjs(gF), p, num(gF)), 0], [expJs(fjs(lF), q, num(lF)), 1], [String(s), 2]], unseen: UNSEEN }
        });
      }, { standard: STD2 }),
      H('hard-back-fill', '최대공약수가 정해지도록 □에 넣을 가장 작은 수', '기본 ①87', (d) => {
        // 두 수를 소인수분해 → 최대공약수의 배수가 되려면 □가 채워야 할 소인수 → 가장 작은 수 → 그때 최대공약수가 맞는지 확인.
        const [v, p, s, g] = d.until(() => { const f = form(d, { ps: [2, 3, 5], k: 3, lo: 120, hi: 900, ok: (h) => h[0][1] >= 2 }), q = f[0][0], G = [[q, 1]].concat(f.slice(1).map(([r, e]) => [r, d.int(0, e)]).filter(([, e]) => e > 0)); return [num(f), q, d.pick([7, 11, 13]), num(G)]; },
          ([w, q, t, G]) => G / q >= 6 && G < w && range(1, G / q).every((k) => (gcd(w, q * k * t) === G) === (k === G / q)));
        const need = g / p;
        return N(`${josa(v, '과/와')} ${nb(`${p} × ${box()} × ${s}`)}의 최대공약수가 ${g}일 때, □ 안에 들어갈 수 있는 가장 작은 자연수는?`, need, {
          explain: `${eqn(v)}, ${eqn(g)}이다. ${p} × □ × ${s}${tail(s, '이/가')} ${g}의 배수가 되려면 □는 ${g} ÷ ${p} = ${need}의 배수이어야 한다. □에 ${josa(need, '을/를')} 넣으면 ${p} × ${need} × ${s} = ${fx(fz(p * need * s))}이고, ${josa(v, '과/와')} 공통인 소인수의 작은 지수를 고르면 최대공약수는 ${fx(fz(g))} = ${g}이다.`,
          facts: { digit: { template: `(${p}*□*${s})%${g}<1`, lo: 1, hi: need + 20, ask: 'min' } }
        });
      }, { standard: STD2 }),
      H('hard-back-times', '같은 수를 곱한 세 수의 최소공배수를 알 때 세 수의 최대공약수', '심40', (d) => {
        // 최소공배수에서 곱한 수 x를 구한다 → 세 수의 최대공약수는 (세 수 앞에 곱한 수들의 최대공약수) × x.
        const cs = d.pick([[4, 6, 16], [4, 6, 10], [6, 9, 12], [4, 10, 12], [9, 12, 15], [4, 6, 8], [6, 8, 10], [6, 10, 14], [6, 9, 15], [8, 12, 20]]), l0 = cs.reduce((a, b) => lcm(a, b)), g0 = cs.reduce((a, b) => gcd(a, b)), k = d.until(() => d.int(2, 7), (v) => l0 * v <= 999), x = V('x');
        return N(`세 자연수 ${cs.map((c) => nb(`${c} × ${x}`)).join(', ')}의 최소공배수가 ${l0 * k}일 때, 세 자연수의 최대공약수는?`, g0 * k, {
          explain: `${cs.join(', ')}의 최소공배수는 ${l0}이므로 세 자연수의 최소공배수는 ${l0} × ${x}이다. ${l0} × ${x} = ${l0 * k}에서 ${x} = ${k}이다. ${cs.join(', ')}의 최대공약수는 ${g0}이므로 세 자연수의 최대공약수는 ${g0} × ${x} = ${g0} × ${k} = ${g0 * k}이다.`,
          facts: { calc: [[`${l0 * k}/(${lcmJs(cs.map(String), [2, 3, 5, 7], 20)})*(${gcdJs(cs.map(String), [2, 3, 5, 7], 20)})`, 0]], unseen: UNSEEN }
        });
      }, { standard: STD2 }),
      H('hard-product', '두 수의 곱과 최대공약수를 알 때 최소공배수', '심41', (d) => {
        // 두 수를 (최대공약수) × a, (최대공약수) × b로 놓는다 → 최소공배수는 (최대공약수) × a × b → 두 수의 곱은 (최대공약수) × (최소공배수).
        const [g, m, k] = d.until(() => [d.pick([4, 6, 8, 9, 12, 15]), d.int(2, 7), d.int(2, 7)], ([G, s, t]) => s < t && gcd(s, t) === 1 && G * G * s * t <= 9999), l = g * m * k, a = V('a'), b = V('b');
        return N(`두 자연수의 곱이 ${g * l}이고 최대공약수가 ${g}일 때, 두 자연수의 최소공배수는?`, l, {
          explain: `두 자연수를 ${g} × ${a}, ${g} × ${b}(${a}, ${b}는 서로소)라 하면 최소공배수는 ${g} × ${a} × ${b}이고, 두 수의 곱은 ${g} × ${g} × ${a} × ${b}이다. 두 수의 곱은 최대공약수와 최소공배수의 곱과 같으므로 최소공배수는 ${g * l} ÷ ${g} = ${l}이다.`,
          facts: { calc: [[`${g * l}/${g}`, 0]] }
        });
      }, { standard: STD2 })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('7-1-1', 'gcd', [
    TB('gcd-common-three', '세 수의 공약수의 개수와 두 번째로 큰 공약수', '기본 ①59·60 / 심33', (d, n) => {
      // 함정: 세 수의 약수를 하나하나 늘어놓으려는 아이는 풀기 어렵다. 공약수는 최대공약수의 약수이다. 둘째 문항은 최대공약수 자신을 「두 번째」로 세거나 반으로 나누기만 하는 아이가 틀린다.
      const fs = someForms(d, 3, { hi: 400, lo: 24, gmin: 8, ok: (list, G) => nd(G) >= (n === 0 ? 6 : 4) && nd(G) <= 12 }), vs = fs.map(num), gF = gcdF(fs), g = num(gF), p = gF[0][0];
      const head = `${vs.map(eqn).join(', ')}이므로 세 수의 최대공약수는 ${fx(gF)}${fx(gF) === String(g) ? '' : ' = ' + g}이다. 공약수는 최대공약수의 약수이다.`;
      if (n === 0) return N(`세 수 ${vs.join(', ')}의 공약수는 모두 몇 개인가?`, nd(gF), {
        unit: '개', explain: `${head} 공약수의 개수는 ${ndTold(gF)}이다.`,
        facts: { count: range(1, Math.min(...vs)).map((k) => vs.every((v) => v % k === 0)), rule: 'common-count' }
      });
      return N(`세 수 ${vs.join(', ')}의 공약수 가운데 두 번째로 큰 수는?`, g / p, {
        explain: `${head} 가장 큰 공약수는 ${g}이고, 두 번째로 큰 공약수는 ${josa(g, '을/를')} 가장 작은 소인수 ${josa(p, '으로/로')} 나눈 ${g / p}이다.`,
        facts: { calc: [[`(${gcdJs(vs.map(String), [2, 3, 5, 7], Math.max(...vs))})/${p}`, 0]], unseen: UNSEEN, rule: 'common-second' }
      });
    }, { count: 2, standard: STD2 })
  ]);
  B.addTypes('7-1-1', 'lcm', [
    TB('lcm-multiple-count', '소인수분해 한 두 수의 공배수 가운데 범위에 드는 것의 개수', '기본 ①78', (d) => {
      // 함정: 두 수의 배수를 하나하나 늘어놓으려는 아이, 두 수의 곱의 배수만 세는 아이. 공배수는 최소공배수의 배수이다.
      const [fs, top] = d.until(() => { const list = someForms(d, 2, { hi: 150, gmin: 2, lmax: 180 }); return [list, d.pick([300, 400, 500, 600, 1000])]; }, ([list, t]) => { const l = num(lcmF(list)); return l >= 36 && t % l !== 0 && Math.floor(t / l) >= 3 && Math.floor(t / l) <= 12; });
      const vs = fs.map(num), lF = lcmF(fs), l = num(lF), k = Math.floor(top / l);
      return N(`두 수 ${fm(fs[0])}, ${fm(fs[1])}의 공배수 가운데 ${top} 이하인 수는 모두 몇 개인가?`, k, {
        unit: '개', explain: `${lTold(fs)} 최소공배수는 ${fx(lF)} = ${l}이다. 공배수는 최소공배수의 배수이므로 ${l}, ${2 * l}, ${3 * l}, …이다. ${top} ÷ ${l}의 몫이 ${k}이므로 ${top} 이하인 공배수는 ${k}개이다.`,
        facts: { count: range(1, top).map((m) => vs.every((v) => m % v === 0)) }
      });
    }, { standard: STD2 })
  ]);
  B.addTypes('7-1-1', 'divisor', [
    TB('divisor-list-count', '1과 자기 자신, 지수가 같은 것이 섞인 식 가운데 약수의 개수', '심21 / 기본 ①37', (d) => {
      // 함정: 지수가 「작은」 것만 약수라고 여겨 지수가 같은 것(자기 자신, 2³)을 빼는 아이, 1을 약수에서 빼는 아이, 한 소인수의 지수만 보고 다른 소인수의 지수가 큰 것을 넣는 아이.
      const f = form(d, { ps: [2, 3, 5, 7], k: 3, lo: 100, hi: 3000, ok: (g) => g[0][1] >= 2 && g.some(([, e]) => e === 1) }), v = num(f), spare = [2, 3, 5, 7, 11].filter((p) => !expIn(f, p));
      const lower = () => fz(d.pick(divs(v).filter((k) => k > 1 && k < v && fz(k).length >= 2)));
      const makers = {
        one: () => ({ h: '1', v: 1 }), self: () => ({ h: fx(f), v }), top: () => ({ h: fx([f[0]]), v: num([f[0]]) }), lower: () => { const g = lower(); return { h: fx(g), v: num(g) }; },
        over: () => { const i = d.int(0, 2), g = f.map(([p, e], j) => [p, j === i ? e + 1 : d.int(0, e)]).filter(([, e]) => e > 0); return { h: fx(g), v: num(g), why: `소인수 ${f[i][0]}의 지수가 더 크다` }; },
        alien: () => { const q = d.pick(spare), g = sortF(lower().concat([[q, 1]])); return { h: fx(g), v: num(g), why: `${josa(q, '은/는')} ${fx(f)}의 소인수가 아니다` }; }
      };
      const rows = d.until(() => d.shuffle(['one', 'self', 'top', 'lower', 'over', 'over', 'alien']).slice(0, 5).map((kind) => Object.assign({ kind }, makers[kind]())),
        (list) => list.some((r) => r.kind === 'one' || r.kind === 'self') && list.some((r) => r.why) && new Set(list.map((r) => r.v)).size === 5 && list.filter((r) => v % r.v === 0).length >= 2);
      const flags = rows.map((r) => v % r.v === 0), hit = flags.filter(Boolean).length;
      return N(`다음 중 ${fm(f)}의 약수인 것은 모두 몇 개인가?`, hit, {
        unit: '개', figure: taggedEx(rows.map((r) => asExpr(r.h))),
        explain: `약수는 소인수의 지수가 같거나 작은 수이다. 1과 자기 자신도 약수이다. 약수가 아닌 것은 ${rows.map((r, i) => (r.why ? `${LAB[i]}(${r.why})` : '')).filter(Boolean).join(', ')}이다. 약수인 것은 ${rows.map((r, i) => (flags[i] ? LAB[i] : '')).filter(Boolean).join(', ')}의 ${hit}개이다.`,
        facts: { count: flags }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
