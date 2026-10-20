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
// 처음 지을 때 경우 따지기·조건 여럿·요령이라는 까닭으로 뺀 꼴은 2026-10-13에 다시 보아 실력 묶음 끝에 덧붙였다(아래 「다시 실은 꼴」).
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
    id: 'hard', title: '단원 종합', standard: STD1,
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

  // ── 다시 실은 꼴 ──
  // 처음 지을 때 「경우 따지기·조건 여럿·요령」이라는 까닭으로 뺀 꼴을 다시 보고, 이 단원에서 배운 성질만으로 풀리는 것을 실력 묶음 끝에 덧붙였다(2026-10-13).
  // 모두 ② 두 번 넘게 생각해야 풀리는 문제이다: 후보를 빠짐없이 늘어놓고 하나씩 따지기, 되풀이되는 규칙 찾기, 개수에서 거꾸로 수의 꼴 찾기, 소인수마다 지수의 범위 정하기.
  // hard-prime-digitsum(91, 49, 77은 합성수)과 hard-prime-tree(짝수인 소수는 2뿐)에는 ①의 함정도 들어 있다.
  // 그대로 빼 둔 것: 활용(교육과정의 금, ①96~107 심51~62), 지수법칙(심41의 뒤쪽), 세 모임의 겹침(심49), 초등 내용 그대로(①43·51·52·61·62·77·82 심50),
  //   뜻 없는 합(심23), 그림을 알 수 없는 것(①95), 작도(①8), 걷어 내면 이미 실린 유형과 같은 일(심14 — 큰 수의 소인수 구하기, 심46 — 소인수 구하기 두 번).
  // 검사 근거: 답을 식 하나로 셈할 수 없는 꼴은 수를 하나씩 넣어 보는 틀(facts.digit)로 다시 찾는다. 약수의 개수는 1부터 차례로 나누어 본 「0**(a%j)」의 합으로 적는다.
  // 새 낱말·기호는 쓰지 않았다: 심47의 약속 기호는 「공약수가 몇 개」로, 심48의 순서쌍은 「c가 될 수 있는 수」로 적었다.
  const countJs = (x, top) => range(1, top).map((j) => `0**((${x})%${j})`).join('+');   // x의 약수의 개수(top 은 x보다 크거나 같은 수)
  const sumOf = (list) => list.reduce((s, v) => s + v, 0);
  const powTop = (f) => Math.max(...f.map(([p, e]) => p ** e));   // 소인수분해 한 식에서 가장 큰 거듭제곱(지수를 세는 틀의 위끝)
  const primeList = (v) => fz(v).map(([p]) => p);
  // 곱이 P인 서로소인 두 자연수의 짝(작은 수가 앞)
  const coprimePairs = (P) => range(1, P).filter((s) => P % s === 0 && s * s < P && gcd(s, P / s) === 1).map((s) => [s, P / s]);
  const twoDigit = (v) => v >= 10 && v <= 99;
  // 가지 그림의 글자를 수식 글꼴의 기울인 글자로 바꾼다(그림 안의 문자).
  const slant = (svg) => svg.replace(/>([A-E])<\/text>/g, '><tspan style="font-family:\'MB Math\',\'Times New Roman\',serif;font-style:italic;font-weight:400;font-size:17px">$1</tspan></text>');

  B.addTypes(U, 'hard', [
    H('hard-prime-digitsum', '각 자리의 숫자의 합이 정해진 두 자리 소수', '기본 ①13', (d) => {
      // 후보를 빠짐없이 늘어놓는다 → 짝수와 5의 배수를 지운다 → 남은 수를 하나씩 따진다. 함정: 91 = 7 × 13, 49 = 7 × 7, 77 = 7 × 11을 소수로 세는 아이.
      const s = d.pick([7, 11, 13, 14, 10]), cands = range(10, 99).filter((v) => Math.floor(v / 10) + v % 10 === s), ps = cands.filter(isPrime), top = ps[ps.length - 1];
      const look = cands.filter((v) => v % 2 === 1 && v % 5 !== 0 && !isPrime(v));
      return M(`각 자리의 숫자의 합이 ${s}인 두 자리 자연수 가운데 소수를 모두 찾을 때, 가장 큰 소수와 소수의 개수는?`, [{ label: '가장 큰 소수', answer: top }, { label: '소수의 개수', answer: ps.length, unit: '개' }], {
        explain: `각 자리의 숫자의 합이 ${s}인 두 자리 자연수는 ${cands.join(', ')}이다. 짝수와 5의 배수는 소수가 아니다. ${look.length ? `${look.map(split).join(', ')}이므로 ${look.join(', ')}도 소수가 아니다. ` : ''}${ps.length === 1 ? `소수는 ${top} 하나뿐이다.` : `소수는 ${ps.join(', ')}의 ${ps.length}개이고, 가장 큰 소수는 ${top}이다.`}`,
        facts: { digit: { template: `${s}-1<(□-□%10)/10+□%10+100*(${sieve('□')})<${s}+1`, lo: 10, hi: 99, ask: 'max' }, big: { countIf: { values: cands.map((v) => divs(v).length), test: 'below', target: 2.5, i: 1 } } }
      });
    }),
    H('hard-prime-tree', '소인수분해 가지 그림에서 한 소수가 다른 두 소수의 합일 때', '심15', (d) => {
      // 함정: 두 소수의 합이 다시 소수이려면 한 수는 2이어야 한다(2가 아닌 소수는 모두 홀수이고, 홀수끼리 더하면 2보다 큰 짝수이다). 2를 빼고 찾는 아이, 9나 15를 소수로 여기는 아이가 틀린다.
      // 원문의 그림은 남아 있지 않다. 풀이에 적힌 얼개(A = B × D × E)대로 단원의 가지 그림 도구로 그렸다.
      const top = d.pick([15, 20]), ps = PRIMES.filter((p) => p <= top), pairs = ps.reduce((all, x, i) => all.concat(ps.slice(i + 1).map((y) => [x, y])), []);
      const flags = pairs.map(([x, y]) => x + y <= top && isPrime(x + y)), hits = pairs.filter((pair, i) => flags[i]), made = hits.map(([x, y]) => (x + y) * x * y), big = Math.max(...made), [x, y] = hits[made.indexOf(big)];
      const A = V('A'), Bv = V('B'), Dv = V('D'), Ev = V('E');
      return M(`자연수 ${A}를 소인수분해 하는 과정을 그림으로 나타낸 것이다. ${Bv}, ${Dv}, ${Ev}가 모두 ${top} 이하의 소수이고 ${nb(`${Bv} = ${Dv} + ${Ev}`)}일 때, ${A}가 될 수 있는 수의 개수와 그 가운데 가장 큰 수는?`, [{ label: '개수', answer: hits.length, unit: '개' }, { label: '가장 큰 수', answer: big }], {
        figure: slant(K.factorTree('A', [['B', 'C'], ['D', 'E']])),
        explain: `그림에서 ${A} = ${Bv} × ${Dv} × ${Ev}이다. 2가 아닌 소수는 모두 홀수이고, 홀수끼리 더하면 2보다 큰 짝수가 되어 소수가 아니다. 두 소수의 합이 소수이려면 한 수는 2이어야 한다. ${top} 이하의 소수 ${ps.join(', ')} 가운데 2를 더한 수도 ${top} 이하의 소수인 것을 찾으면 ${hits.map(([s, t]) => `${s} + ${t} = ${s + t}`).join(', ')}이다. 이때 ${A}는 ${hits.map(([s, t]) => `${s + t} × ${s} × ${t} = ${(s + t) * s * t}`).join(', ')}의 ${hits.length}개이고, 가장 큰 수는 ${big}이다.`,
        facts: { count: flags, calc: [[`${x + y}*${x}*${y}`, 1]], unseen: [x + y, x, y] }
      });
    }),
    H('hard-power-last', '큰 거듭제곱의 일의 자리의 숫자', '심45 / 기본 ①21', (d, n) => {
      // 거듭제곱을 차례로 구해 일의 자리의 숫자가 되풀이되는 마디를 찾는다 → 지수를 마디의 길이로 나눈 나머지로 자리를 찾는다.
      // 둘째는 밑이 여러 자리 수이다(일의 자리의 숫자는 밑의 일의 자리의 숫자로만 정해진다). 함정: 지수를 4로 나눈 나머지가 0일 때 첫째 숫자를 고르는 아이.
      const b = d.pick([2, 3, 7, 8]), cyc = [1, 2, 3, 4].map((k) => b ** k % 10), e = n === 0 ? d.int(30, 150) : d.int(101, 999), base = n === 0 ? b : d.int(11, 209) * 10 + b;
      const q = Math.floor((e - 1) / 4), r = e - 4 * q, last = cyc[r - 1], ORD = ['첫째', '둘째', '셋째', '넷째'];
      return N(`${nb(base + sup(e))}의 일의 자리의 숫자는?`, last, {
        explain: `${n === 1 ? `곱의 일의 자리의 숫자는 곱하는 수들의 일의 자리의 숫자로 정해지므로 ${base}${sup(e)}의 일의 자리의 숫자는 ${b}${sup(e)}의 일의 자리의 숫자와 같다. ` : ''}${b}, ${b}${sup(2)}, ${b}${sup(3)}, ${b}${sup(4)}, ${b}${sup(5)}, …의 일의 자리의 숫자는 차례로 ${cyc.join(', ')}, ${cyc[0]}, …이므로 ${cyc.join(', ')}의 네 숫자가 이 차례로 되풀이된다. ${r === 4 ? `${e} = 4 × ${q + 1}` : `${e} = 4 × ${q} + ${r}`}이므로 ${b}${sup(e)}의 일의 자리의 숫자는 되풀이되는 네 숫자 가운데 ${ORD[r - 1]}인 ${last}이다.`,
        facts: { calc: [[`((${base}%10)**((${e}-1)%4+1))%10`, 0]], unseen: [1, 4, 10], rule: 'power-last-' + n }
      });
    }, { count: 2 }),
    H('hard-factorial-zeros', '1부터 차례로 곱한 수를 10의 거듭제곱을 써서 나타내기', '심44', (d) => {
      // 10 = 2 × 5 → 곱을 소인수분해 했을 때 2의 지수와 5의 지수 가운데 작은 쪽 → 5의 배수를 세고, 25의 배수에는 5가 한 번 더 들어 있다. 함정: 10의 배수만 세는 아이, 25의 배수를 한 번만 세는 아이.
      const top = d.int(26, 98), c5 = Math.floor(top / 5), c25 = Math.floor(top / 25), a = V('a'), x = V('n');
      return N(`1부터 ${top}까지의 자연수를 모두 곱한 수를 ${nb(`${a} × 10${sup(x)}`)} 꼴로 나타낼 때, 자연수 ${x}의 값은? (단, ${a}는 10의 배수가 아닌 자연수이다.)`, c5 + c25, {
        explain: `10 = 2 × 5이므로 ${x}은 곱을 소인수분해 했을 때 2의 지수와 5의 지수 가운데 작은 것과 같다. 2의 배수가 5의 배수보다 많으므로 5의 지수를 구하면 된다. 1부터 ${top}까지의 자연수 가운데 5의 배수는 ${c5}개이고, 25 = 5${sup(2)}의 배수 ${c25}개에는 5가 한 번씩 더 곱해져 있다. 5의 지수는 ${c5} + ${c25} = ${c5 + c25}이므로 ${x} = ${c5 + c25}이다.`,
        facts: { calc: [[`(${top}-${top}%5)/5+(${top}-${top}%25)/25`, 0]], unseen: [5, 25] }
      });
    }),
    H('hard-divisor-three', '약수가 3개인 자연수 가운데 몇 번째로 작은 수', '기본 ①45', (d) => {
      // 약수가 3개 → (지수 + 1)이 3 → 소수의 제곱 → 소수를 작은 것부터 → 제곱한다. 함정: 약수가 3개인 수를 하나씩 찾다가 놓치는 아이, 소수의 제곱이 아닌 수(6, 8)를 넣는 아이.
      const k = d.pick([4, 6, 7]), ps = PRIMES.slice(0, k), p = ps[k - 1], prev = ps[k - 2];
      return N(`약수가 3개인 자연수 가운데 ${k}번째로 작은 수는?`, p * p, {
        explain: `약수의 개수는 각 소인수의 지수에 1을 더한 수를 모두 곱한 것과 같다. 3은 1보다 큰 두 자연수의 곱으로 나타낼 수 없으므로 약수가 3개인 수는 소인수가 하나이고 그 지수가 2인 수, 곧 소수의 제곱이다. 소수를 작은 것부터 쓰면 ${ps.join(', ')}, …이므로 ${k}번째로 작은 수는 ${p}${sup(2)} = ${p * p}이다.`,
        facts: { digit: { template: `2<${countJs('□', p * p + 12)}<4`, lo: prev * prev + 1, hi: p * p + 12, ask: 'min' } }
      });
    }),
    H('hard-divisor-exp-two', '약수의 개수를 알 때 두 지수의 합', '심24', (d) => {
      // 약수의 개수를 알고 있는 (지수 + 1)로 나눈다 → 남은 수를 2 이상인 두 수의 곱으로 나타낸다(지수가 자연수이므로) → 두 지수의 합. 함정: 1 × 9로 갈라 지수 8을 넣는 아이(다른 지수가 0이 된다).
      const [p, q, r] = asc(d.shuffle([2, 3, 5, 7]).slice(0, 3)), k = d.int(1, 3), total = d.pick([6, 8, 9, 10, 15]), n = (k + 1) * total, a = V('a'), b = V('b');
      const s = range(2, total).find((v) => total % v === 0), t = total / s;   // total 을 2 이상인 두 수의 곱으로 나타내는 방법은 s × t 하나뿐이다.
      return N(`${nb(`${pw(p, k)} × ${q}${sup(a)} × ${r}${sup(b)}`)}의 약수가 ${n}개일 때, 자연수 ${a}, ${b}에 대하여 ${nb(`${a} + ${b}`)}의 값은?`, s + t - 2, {
        explain: `${k === 1 ? `${p}의 지수는 1이다. ` : ''}약수의 개수는 (${k} + 1) × (${a} + 1) × (${b} + 1) = ${n}이므로 (${a} + 1) × (${b} + 1) = ${total}이다. ${a}, ${b}는 자연수이므로 ${a} + 1, ${b} + 1은 모두 2 이상이다. ${josa(total, '을/를')} 2 이상인 두 자연수의 곱으로 나타내는 방법은 ${s} × ${t}뿐이므로 ${a} + 1, ${b} + 1은 ${s === t ? `모두 ${s}` : `${josa(s, '과/와')} ${t}`}이다. (${a} + 1) + (${b} + 1) = ${s + t}이므로 ${a} + ${b} = ${s + t - 2}이다.`,
        facts: { digit: { template: `0<${range(1, total).map((i) => `0**(((${i}+1)*(□-${i}+1)-(${n}/(${k}+1)))**2)`).join('+')}`, lo: 2, hi: total - 2, ask: 'min' } }
      });
    }),
    H('hard-divisor-least', '약수의 개수가 정해지도록 □에 넣을 가장 작은 수', '심26', (d) => {
      // □에 이미 있는 소인수가 들 수도 있다 → 그 소인수의 지수마다 나머지 부분의 꼴을 정한다 → 꼴마다 가장 작은 □를 구해 비교한다.
      // 함정: □를 새로운 소인수의 거듭제곱으로만 채우는 아이(2³ × □의 약수가 20개일 때 3⁴ = 81을 답하고 2 × 3 × 5 = 30을 놓친다).
      const [p, k, n] = d.pick([[2, 2, 12], [2, 3, 16], [2, 3, 20], [2, 2, 15], [2, 4, 18], [3, 2, 12], [3, 2, 15], [3, 3, 20], [3, 1, 12], [5, 2, 12], [5, 1, 12], [2, 1, 12], [2, 1, 8], [2, 1, 10], [3, 2, 18], [2, 3, 18]]);
      const rows = range(k, n - 1).filter((e) => n % (e + 1) === 0).map((e) => { const rest = n / (e + 1), m = range(1, 3000).find((w) => w % p !== 0 && nd(fz(w)) === rest); return { e, rest, f: sortF([[p, e]].concat(fz(m))), box: p ** (e - k) * m }; });
      const ans = Math.min(...rows.map((row) => row.box)), near = rows.filter((row) => row.box <= 999), far = rows.filter((row) => row.box > 999);
      return N(`${nb(`${pw(p, k)} × ${box()}`)}의 약수가 ${n}개일 때, □ 안에 들어갈 수 있는 가장 작은 자연수는?`, ans, {
        explain: `□에 ${josa(p, '이/가')} 소인수로 들어 있을 수도 있다. ${pw(p, k)} × □를 소인수분해 한 식에서 ${p}의 지수는 ${k} 이상이고 그 지수에 1을 더한 수는 ${n}의 약수이어야 하므로, ${p}의 지수는 ${rows.map((row) => row.e).join(', ')} 가운데 하나이다. ${near.map((row) => `${p}의 지수가 ${row.e}이면 ${p}의 거듭제곱을 뺀 나머지 부분의 약수가 ${n} ÷ ${row.e + 1} = ${row.rest}개이어야 하므로 가장 작은 수는 ${fx(row.f)}이고 이때 □는 ${row.box}이다.`).join(' ')}${far.length ? ` ${p}의 지수가 ${far.map((row) => row.e).join(', ')}이면 □는 이보다 크다.` : ''} □ 안에 들어갈 수 있는 가장 작은 자연수는 ${ans}이다.`,
        facts: { digit: { template: `${n}-1<${countJs(`${p}**${k}*□`, p ** k * (ans + 10))}<${n}+1`, lo: 1, hi: ans + 10, ask: 'min' } }
      });
    }),
    H('hard-divisor-sum', '소인수분해를 이용하여 모든 약수의 합 구하기', '심28', (d) => {
      // 소인수분해 → 약수를 표로 모두 구한다 → 한 줄씩 묶어 더한다. 함정: 1이나 자기 자신을 빼는 아이, 소인수의 거듭제곱만 더하고 서로 곱한 수를 빠뜨리는 아이.
      const v = d.pick([72, 98, 100, 108, 144, 147, 196, 200, 242, 245, 324, 392, 400, 441, 500, 675]), f = fz(v), [[p, a], [q, b]] = f, total = sumOf(divs(v));
      const left = range(0, a).map((i) => p ** i), right = range(0, b).map((j) => q ** j);
      return N(`소인수분해를 이용하여 ${v}의 모든 약수의 합을 구하시오.`, total, {
        explain: `${eqn(v)}이다. ${pw(p, a)}의 약수 ${left.join(', ')}${tail(left[a], '과/와')} ${pw(q, b)}의 약수 ${right.join(', ')}${tail(right[b], '을/를')} 하나씩 곱한 수가 ${v}의 약수이다. ${pw(p, a)}의 약수 하나에 ${pw(q, b)}의 약수를 차례로 곱하여 더한 합은 그 약수에 (${right.join(' + ')})을 곱한 수이므로, 모든 약수의 합은 (${left.join(' + ')}) × (${right.join(' + ')}) = ${sumOf(left)} × ${sumOf(right)} = ${total}이다.`,
        facts: { calc: [[range(1, v).map((j) => `${j}*0**(${v}%${j})`).join('+'), 0]], unseen: range(0, v) }
      });
    }),
    H('hard-square-common', '두 곱이 같은 자연수의 제곱이 될 때 그 자연수의 가장 작은 값', '심20', (d) => {
      // c²이 두 수의 공배수임을 읽는다 → 최소공배수 → 홀수인 지수를 1씩 키운다 → 지수를 반으로 나눈 수가 c이다. 함정: 최소공배수를 그대로 답하는 아이, 제곱이 된 수(c²)를 답하는 아이.
      const pool = range(12, 150).filter((v) => fz(v).every(([p]) => p <= 7) && fz(v).length >= 2);
      const [m, k] = d.until(() => asc(d.shuffle(pool).slice(0, 2)), ([x, y]) => { const L = fz(lcm(x, y)); return y % x !== 0 && L.some(([, e]) => e % 2 === 1) && L.some(([, e]) => e >= 2) && num(L.map(([p, e]) => [p, (e + (e % 2)) / 2])) <= 420; });
      const lF = fz(lcm(m, k)), done = lF.map(([p, e]) => [p, e + (e % 2)]), half = done.map(([p, e]) => [p, e / 2]), c = num(half), a = V('a'), b = V('b'), cv = V('c');
      return N(`자연수 ${a}, ${b}, ${cv}에 대하여 ${nb(`${m} × ${a} = ${k} × ${b} = ${cv}${sup(2)}`)}일 때, ${cv}의 값 가운데 가장 작은 수는?`, c, {
        explain: `${cv}${sup(2)}은 ${m}의 배수이면서 ${k}의 배수이므로 ${josa(m, '과/와')} ${k}의 공배수이다. ${eqn(m)}, ${eqn(k)}이므로 최소공배수는 ${fx(lF)}이다. 공배수는 최소공배수의 배수이고 어떤 자연수의 제곱인 수는 지수가 모두 짝수이므로, 가장 작은 ${cv}${sup(2)}은 홀수인 지수만 1씩 키운 ${fx(done)}이다. ${cv}는 지수를 모두 반으로 나눈 ${fx(half)}${fx(half) === String(c) ? '' : ' = ' + c}이다.`,
        facts: { digit: { template: `(□*□)%${m}+(□*□)%${k}<1`, lo: 1, hi: c + 20, ask: 'min' } }
      });
    }, { standard: STD2 }),
    H('hard-common-count-back', '공약수의 개수가 정해질 때 가장 작은 수', '심47', (d) => {
      // 공약수의 개수 → 최대공약수의 약수의 개수 → 최대공약수는 주어진 수의 약수 → 그 가운데 약수의 개수가 맞는 가장 작은 수.
      // 함정: 약수가 8개인 가장 작은 수(24)를 답하는 아이 — 24는 330의 약수가 아니어서 330과의 최대공약수가 될 수 없다.
      const [v, k] = d.pick([[330, 8], [390, 8], [420, 8], [462, 8], [150, 6], [126, 6], [90, 6], [140, 6], [198, 6], [294, 6], [315, 6], [350, 6], [252, 12]]), x = V('x');
      const hits = divs(v).filter((c) => nd(fz(c)) === k), ans = hits[0];
      return N(`자연수 ${x}와 ${v}의 공약수가 ${k}개일 때, ${x}의 값 가운데 가장 작은 수는?`, ans, {
        explain: `두 수의 공약수는 최대공약수의 약수이므로 ${x}와 ${v}의 최대공약수는 약수가 ${k}개인 수이다. 최대공약수는 ${v}의 약수이고, ${eqn(v)}의 약수 가운데 약수가 ${k}개인 수는 ${hits.map((h) => `${h} = ${fx(fz(h))}`).join(', ')}이다. ${x}는 최대공약수의 배수이므로 ${x}의 값 가운데 가장 작은 수는 ${ans}이다. 이때 ${josa(ans, '과/와')} ${v}의 최대공약수는 ${ans}이다.`,
        facts: { digit: { template: `${k}-1<${range(1, v).map((j) => `0**(□%${j}+${v}%${j})`).join('+')}<${k}+1`, lo: 1, hi: ans + 12, ask: 'min' } }
      });
    }, { standard: STD2 }),
    H('hard-lcm-least', '최소공배수와 크기 조건에 맞는 가장 작은 수', '기본 ①92', (d) => {
      // 두 수를 소인수분해 → 최소공배수에서 지수가 더 큰 소인수는 구하는 수가 채워야 한다 → 될 수 있는 수를 작은 것부터 늘어놓는다 → 크기 조건.
      // 함정: 최소공배수를 주어진 수로 나눈 몫(140 ÷ 20 = 7)의 배수를 아무것이나 고르는 아이(49는 140의 약수가 아니다).
      const listOf = (L, key) => { const need = key ** expIn(L, key); return divs(num(L) / need).map((x) => x * need); };
      const [aF, lF, key, lim] = d.until(() => {
        const L = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3]), lo: 60, hi: 900 }), q = d.pick(L.map(([p]) => p)), cut = d.int(1, expIn(L, q));
        return [L.map(([p, e]) => [p, p === q ? e - cut : e]).filter(([, e]) => e > 0), L, q, d.pick([10, 20, 30, 40, 50])];
      }, ([A, L, q, t]) => { const list = listOf(L, q); return A.length >= 1 && num(A) >= 12 && num(A) <= 99 && list.length >= 6 && list[0] <= t && list.filter((x) => x > t).length >= 2; });
      const a = num(aF), l = num(lF), list = listOf(lF, key), ans = list.find((x) => x > lim), shown = list.slice(0, list.indexOf(ans) + 1), el = expIn(lF, key), ea = expIn(aF, key);
      return N(`${josa(a, '과/와')}의 최소공배수가 ${l}인 자연수 가운데 ${lim}보다 큰 가장 작은 수는?`, ans, {
        explain: `${eqn(a)}, ${eqn(l)}이다. 최소공배수의 지수는 두 수의 지수 가운데 같거나 큰 것이다. ${ea ? `${a}에서 ${key}의 지수 ${josa(ea, '은/는')} 최소공배수의 지수 ${el}보다 작으므로` : `${a}에는 소인수 ${josa(key, '이/가')} 없으므로`} 구하는 수는 ${pw(key, el)}의 배수이고, 최소공배수 ${l}의 약수이다. 이런 수를 작은 것부터 쓰면 ${shown.join(', ')}, …이므로 ${lim}보다 큰 가장 작은 수는 ${ans}이다.`,
        facts: { digit: { template: `((${lcmJs([String(a), '□'], lF.map(([p]) => p), powTop(lF))})-${l})**2+${l}%□<1`, lo: lim + 1, hi: l, ask: 'min' } }
      });
    }, { standard: STD2 }),
    H('hard-third-number', '세 수의 최대공약수와 최소공배수를 알 때 나머지 한 수의 가장 작은 값·가장 큰 값', '심39 / 기본 ①90', (d, n) => {
      // 세 수를 소인수분해 → 소인수마다 가장 작은 지수가 최대공약수, 가장 큰 지수가 최소공배수 → 모르는 수의 지수가 될 수 있는 것 → 가장 작게(크게) 고른다.
      // 첫째는 가장 작은 값(최소공배수에만 있는 지수는 모르는 수가 채워야 하므로 최대공약수를 답하면 틀린다),
      // 둘째는 가장 큰 값(최대공약수의 지수보다 클 수 없는 소인수가 있으므로 최소공배수를 답하면 틀린다)을 묻는다.
      const pool = range(12, 150).filter((v) => fz(v).every(([p]) => p <= 5) && fz(v).length >= 2), A = V('A');
      const [a, b, g, l, sols] = d.until(() => {
        const [x, y, z] = d.shuffle(pool), [s, t] = asc([x, y]), G = gcd(gcd(s, t), z), L = lcm(lcm(s, t), z);
        return [s, t, G, L, L <= 900 ? divs(L).filter((w) => gcd(gcd(s, t), w) === G && lcm(lcm(s, t), w) === L) : []];
      }, ([s, t, G, L, list]) => G >= 2 && L <= 900 && t % s !== 0 && list.length >= 3 && list.length <= 8 && (n === 0 ? lcm(s, t) < L : gcd(s, t) > G));
      const ans = n === 0 ? sols[0] : sols[sols.length - 1], aF = fz(a), bF = fz(b), gF = fz(g), lF = fz(l), ps = lF.map(([p]) => p), top = powTop(lF);
      const told = ps.map((p) => {
        const fit = range(0, expIn(lF, p)).filter((e) => Math.min(expIn(aF, p), expIn(bF, p), e) === expIn(gF, p) && Math.max(expIn(aF, p), expIn(bF, p), e) === expIn(lF, p)), some = fit.filter(Boolean);
        const said = some.length >= 3 ? `${some.join(', ')} 가운데 하나` : some.join(' 또는 ');
        if (!some.length) return `${josa(p, '은/는')} ${A}의 소인수가 아니다.`;
        return fit[0] === 0 ? `${josa(p, '은/는')} ${A}의 소인수가 아니거나 ${A}에서 지수가 ${said}이다.` : `${A}에서 ${p}의 지수는 ${said}이다.`;
      }).join(' ');
      const shownEq = [a, b, g, l].filter((v) => fx(fz(v)) !== String(v)).map(eqn).join(', ');   // 소수(3 = 3)는 적지 않는다.
      return N(`세 자연수 ${a}, ${b}, ${A}의 최대공약수가 ${g}이고 최소공배수가 ${l}일 때, ${A}의 값 가운데 가장 ${n === 0 ? '작은' : '큰'} 수는?`, ans, {
        explain: `${shownEq}이다. 소인수마다 세 수의 지수 가운데 가장 작은 것이 최대공약수의 지수이고 가장 큰 것이 최소공배수의 지수이다. 이에 맞추면 ${told} 지수를 가장 ${n === 0 ? '작게' : '크게'} 고르면 ${A} = ${fx(fz(ans))}${fx(fz(ans)) === String(ans) ? '' : ' = ' + ans}이다.`,
        facts: { digit: { template: `((${gcdJs([String(a), String(b), '□'], ps, top)})-${g})**2+((${lcmJs([String(a), String(b), '□'], ps, top)})-${l})**2+${l}%□<1`, lo: 1, hi: l, ask: n === 0 ? 'min' : 'max' } }
      });
    }, { count: 2, standard: STD2 }),
    H('hard-coprime-split', '최소공배수를 알 때 서로소인 두 자리 수 두 개 구하기', '기본 ①93', (d) => {
      // 서로소인 두 수의 최소공배수는 두 수의 곱 → 같은 소인수는 모두 한 수에 들어간다 → 가르는 방법을 모두 따진다 → 두 수가 모두 두 자리 수인 것.
      // 함정: 같은 소인수를 두 수에 나누어 넣는 아이(525 = 15 × 35 — 15와 35는 서로소가 아니다).
      const [l, parts, small] = d.until(() => {
        const f = asc(d.shuffle([2, 3, 5, 7, 11, 13]).slice(0, 3)).map((p) => [p, d.int(1, p === 2 ? 4 : p === 3 ? 3 : p <= 7 ? 2 : 1)]), L = num(f), fit = coprimePairs(L).filter(([s, t]) => twoDigit(s) && twoDigit(t));
        return [L, f, fit.length === 1 ? fit[0][0] : 0];
      }, ([L, f, s]) => s > 0 && L <= 3000 && f.some(([, e]) => e >= 2));
      const big = l / small, pairs = coprimePairs(l);
      return M(`서로소인 두 자연수가 모두 두 자리 수이고 최소공배수가 ${l}일 때, 두 수는?`, [{ label: '작은 수', answer: small }, { label: '큰 수', answer: big }], {
        explain: `서로소인 두 수에는 공통인 소인수가 없으므로 최소공배수는 두 수의 곱과 같다. ${l} = ${fx(parts)}에서 같은 소인수는 모두 한 수에 들어가야 하므로, ${josa(l, '을/를')} 서로소인 두 수의 곱으로 나타내는 방법은 ${pairs.map(([s, t]) => `${s} × ${t}`).join(', ')}이다. 이 가운데 두 수가 모두 두 자리 수인 것은 ${small} × ${big}뿐이다.`,
        facts: { digit: { template: `${l}/100<□*(1+1000*(${l}%□+((${gcdJs(['□', `${l}/□`], parts.map(([p]) => p), powTop(parts))})-1)**2))<${l}/9.99`, lo: 10, hi: 99, ask: 'min' }, calc: [[`${l}/${small}`, 1]], unseen: [small] }
      });
    }, { standard: STD2 }),
    H('hard-gl-pair', '최대공약수·최소공배수와 다른 조건으로 두 수 구하기', '심42 / 기본 ①94', (d, n) => {
      // 두 수를 (최대공약수) × a, (최대공약수) × b(a, b는 서로소)로 놓는다 → a × b = (최소공배수) ÷ (최대공약수) → 서로소인 짝을 모두 찾는다 → 남은 조건에 맞는 짝.
      // 첫째는 두 수의 합, 둘째는 두 수가 모두 두 자리 수, 셋째는 십의 자리와 일의 자리의 숫자를 바꾼 두 수라는 조건이다.
      // 함정: 서로소가 아닌 짝(30 = 2 × 15는 되지만 60 = 6 × 10은 안 된다)을 넣는 아이, 조건에 맞는 짝이 더 있는지 따지지 않는 아이.
      let G, P, pick;
      if (n === 0) [G, P, pick] = d.until(() => { const g = d.int(2, 12), p = d.pick([30, 42, 60, 66, 70, 84, 90]); return [g, p, d.pick(coprimePairs(p).slice(1))]; }, ([g, p]) => g * p <= 999);
      else if (n === 1) [G, P, pick] = d.until(() => { const g = d.int(2, 15), p = d.pick([12, 15, 18, 20, 24, 28, 30, 35, 40, 42, 45, 56, 60, 63, 70, 72, 84, 90]), fit = coprimePairs(p).filter(([s, t]) => twoDigit(g * s) && twoDigit(g * t)); return [g, p, fit.length === 1 ? fit[0] : null]; }, ([g, p, hit]) => hit && g * p <= 999);
      else { const [x, y] = d.pick([[12, 21], [15, 51], [24, 42], [26, 62], [36, 63], [48, 84], [18, 81], [27, 72]]); G = gcd(x, y); P = x * y / G / G; pick = [x / G, y / G]; }
      const small = G * pick[0], big = G * pick[1], L = G * P, S = small + big, pairs = coprimePairs(P), av = V('a'), bv = V('b'), ps = primeList(G * L), top = powTop(fz(G * L)), flipped = '((□%10)*10+(□-□%10)/10)';
      const text = [`최대공약수가 ${G}, 최소공배수가 ${L}이고 합이 ${S}인 두 자연수는?`, `최대공약수가 ${G}, 최소공배수가 ${L}인 두 자연수가 모두 두 자리 수일 때, 두 수는?`, `어떤 두 자리 자연수와 그 수의 십의 자리의 숫자와 일의 자리의 숫자를 바꾼 수의 최대공약수가 ${G}, 최소공배수가 ${L}일 때, 두 수는?`][n];
      const last = [`이 가운데 합이 ${S}인 것은 ${josa(small, '과/와')} ${big}이다.`, `이 가운데 두 수가 모두 두 자리 수인 것은 ${josa(small, '과/와')} ${big}뿐이다.`, `이 가운데 십의 자리의 숫자와 일의 자리의 숫자를 바꾼 두 수는 ${josa(small, '과/와')} ${big}뿐이다.`][n];
      const template = [`((□*(${S}-□))-(${G}*${L}))**2<1`, `(${G}*${L})/100<□*(1+1000*((${G}*${L})%□+((${gcdJs(['□', `(${G}*${L})/□`], ps, top)})-${G})**2))<(${G}*${L})/9.99`, `(□*${flipped}-${G}*${L})**2+((${gcdJs(['□', flipped], ps, top)})-${G})**2<1`][n];
      return M(text, [{ label: '작은 수', answer: small }, { label: '큰 수', answer: big }], {
        explain: `두 수를 ${G} × ${av}, ${G} × ${bv}(${av}, ${bv}는 서로소, ${av} &lt; ${bv})라 하면 최소공배수는 ${G} × ${av} × ${bv} = ${L}이므로 ${av} × ${bv} = ${P}이다. 곱이 ${P}인 서로소인 두 자연수는 ${pairs.map(([s, t]) => `${josa(s, '과/와')} ${t}`).join(', ')}이므로 두 수가 될 수 있는 것은 ${pairs.map(([s, t]) => `${josa(G * s, '과/와')} ${G * t}`).join(', ')}이다. ${last}`,
        facts: { digit: { template, lo: n === 0 ? 1 : 10, hi: n === 0 ? S - 1 : 99, ask: 'min' }, calc: [[n === 0 ? `${S}-${small}` : `${G}*${L}/${small}`, 1]], unseen: [small] }
      });
    }, { count: 3, standard: STD2 }),
    H('hard-chain-products', '이웃한 두 수의 곱이 주어진 다섯 자연수', '심48', (d) => {
      // c는 둘째 곱과 셋째 곱의 공약수이다 → 후보마다 b, d를 구한다 → b가 첫째 곱의 약수인지, d가 넷째 곱의 약수인지 따진다.
      // 함정: 공약수이면 다 된다고 여기는 아이(둘째 곱을 c로 나눈 b가 첫째 곱의 약수가 아닐 수 있다).
      const [P, Q, R, S, cands, flags] = d.until(() => {
        const a0 = d.int(2, 9), b0 = d.pick([6, 8, 9, 10, 12, 15, 18, 20, 24, 36]), c0 = d.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]), d0 = d.pick([4, 5, 6, 8, 9, 10, 12, 15, 20]), e0 = d.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25]);
        const p = a0 * b0, q = b0 * c0, r = c0 * d0, s = d0 * e0, list = divs(gcd(q, r));
        return [p, q, r, s, list, list.map((c) => p % (q / c) === 0 && s % (r / c) === 0)];
      }, ([p, q, r, s, list, ok]) => { const hit = ok.filter(Boolean).length; return new Set([p, q, r, s]).size === 4 && Math.max(p, q, r, s) <= 600 && list.length >= 5 && hit >= 2 && hit <= 4 && list.length - hit >= 2; });
      const [a, b, c, dv, e] = ['a', 'b', 'c', 'd', 'e'].map(V), hits = cands.filter((x, i) => flags[i]), g = gcd(Q, R);
      return N(`다섯 자연수 ${a}, ${b}, ${c}, ${dv}, ${e}가 다음을 모두 만족시킬 때, ${c}가 될 수 있는 수는 모두 몇 개인가?`, hits.length, {
        unit: '개', figure: shelf([`${a} × ${b} = ${P}`, `${b} × ${c} = ${Q}`, `${c} × ${dv} = ${R}`, `${dv} × ${e} = ${S}`]),
        explain: `${c}는 ${josa(Q, '과/와')} ${R}의 공약수이므로 두 수의 최대공약수 ${g}의 약수 ${cands.join(', ')} 가운데 하나이다. 이때 ${b} = ${Q} ÷ ${c}는 ${P}의 약수이어야 하고, ${dv} = ${R} ÷ ${c}는 ${S}의 약수이어야 한다. 두 조건에 모두 맞는 것은 ${hits.map((x) => `${c} = ${x}(${b} = ${Q / x}, ${dv} = ${R / x})`).join(', ')}의 ${hits.length}개이다.`,
        facts: { count: flags }
      });
    }, { standard: STD2 })
  ]);

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
