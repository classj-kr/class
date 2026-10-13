// 중학교 2학년 1학기 1단원 유리수와 순환소수 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-1-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 분모의 소인수를 약분하기 전의 분모에서 읽는다. 분모에 3이나 7이 보이면 곧 유한소수가 아니라고 하고(3/6 = 1/2), 조건 문장에서 「기약분수」가 빠진 것을 알아채지 못한다.
//  - 거꾸로, 분자에 3이 있으면 분모의 3은 몇 개든 다 약분된다고 여긴다(3/(2³ × 5 × 9)에는 3이 하나 남는다).
//  - 순환소수를 분수로 고친 뒤 약분하지 않고 분모(90, 99, 990)만 본다(0.63̇ = 57/90 = 19/30이므로 지울 것은 9가 아니라 3이다).
//  - 정수가 되는 경우를 유한소수의 개수에 넣는다. 「정수가 아닌 유한소수」를 세는 물음에서 빼지 않는다.
//  - 순환마디가 소수점 아래 첫째 자리에서 시작한다고 여기고 n 을 그대로 순환마디의 길이로 나눈다(0.10̇9̇의 1은 한 번뿐이다).
//  - 잘못 본 분수에서 분자·분모를 읽을 때 기약분수로 고치지 않거나, 잘못 본 쪽의 수를 가져온다.
//
// 실력에는 ① 문제의 수·말에 함정이 있어 「기약분수로 고친 다음 분모를 본다」는 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제
// (두 분수를 모두 유한소수로 만드는 수, 범위 안의 개수에서 정수가 되는 것 빼기, 통분하여 범위를 잡고 배수 세기, 자리의 숫자의 합과 횟수, 합에서 거꾸로 숫자 구하기,
// 분자·분모를 잘못 본 두 답으로 처음 분수 구하기)만 실었다. 기본 문서에 여러 번 나오는 꼴(유한소수가 되게 하는 가장 작은 자연수, 순환소수를 분수로, 점을 잘못 찍은 표현 가리기,
// 순환하지 않는 자리가 있는 수의 n번째 자리, 점의 자리가 다른 수의 크기 비교, 관계 문장의 참·거짓)은 기본 묶음에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, name, NAMES, N, F } = B.kit;
  const {
    STD, range, gcd, lcm, nb, tail, V, claimQ, ruled,
    fz, fval, strip25, need, fin, pickRep, pickFrac, headOf, repOf, valOf, unrollOf, lastJ, repJ, fj, fden, par, ffrac, eqn, SR, x,
    digitJs, repDen, BIG, asProduct, denTold, parts, asFrac
  } = B.kit.m811;
  const U = '8-1-1';
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①46' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const a = V('a'), n = V('n');
  // 약분한 꼴: num/(D) → 기약분수(분모는 소인수분해 한 꼴)
  const low = (num, den) => { const g = gcd(num, den); return frac(num / g, par(fden(fz(den / g)))); };
  // 문자가 든 순환마디에 점을 찍는다(순환마디의 첫 글자와 끝 글자). toks: 순환마디의 글자들, said: 글로 옮길 때의 순환마디
  const rdot = (h) => '<span class="mb-rdot">' + h + '</span>';
  const repV = (head, toks, said) => '<span style="white-space:nowrap">' + head + rdot(toks[0]) + toks.slice(1, -1).join('') + rdot(toks[toks.length - 1]) + '<span style="' + SR + '">(순환마디 ' + said + ')</span></span>';

  const half = frac(1, 2), threeSix = frac(3, 6);
  const COND_TRUE = [
    '기약분수의 분모의 소인수가 2 또는 5뿐이면 그 분수는 유한소수로 나타낼 수 있다.', '기약분수의 분모에 2와 5 이외의 소인수가 있으면 그 분수는 유한소수로 나타낼 수 없다.',
    '분모의 소인수가 2뿐인 기약분수는 유한소수로 나타낼 수 있다.', '분모에 소인수 3이 있어도 유한소수로 나타낼 수 있는 분수가 있다.', '분모의 소인수 가운데 7이 있는 기약분수는 유한소수로 나타낼 수 없다.'
  ];
  const COND_FALSE = [
    ['분모에 2와 5 이외의 소인수가 있는 분수는 유한소수로 나타낼 수 없다.', `${threeSix} = ${half} = 0.5처럼 약분하면 그 소인수가 없어지는 분수는 유한소수로 나타낼 수 있다. 기약분수로 고친 다음 분모를 보아야 한다.`, COND_TRUE[3]],
    ['유한소수로 나타낼 수 있는 분수는 분모의 소인수가 2 또는 5뿐이다.', `${threeSix} = 0.5는 유한소수로 나타낼 수 있지만 분모 6에는 소인수 3이 있다. 기약분수로 고친 다음 분모를 보아야 한다.`, COND_TRUE[3]],
    ['분자에 2와 5 이외의 소인수가 있는 분수는 유한소수로 나타낼 수 없다.', `${frac(3, 4)} = 0.75이다. 분자의 소인수는 상관이 없다.`],
    ['분모의 소인수에 2와 5가 모두 있어야 유한소수로 나타낼 수 있다.', `${frac(1, 4)} = 0.25는 분모의 소인수가 2뿐이다.`, COND_TRUE[2]],
    ['분모에 소인수 3이 있는 분수는 모두 순환소수로만 나타낼 수 있다.', `${threeSix} = 0.5는 분모에 소인수 3이 있지만 유한소수이다. 기약분수로 고친 다음 분모를 보아야 한다.`, COND_TRUE[3]]
  ];

  B.addGroup(U, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 수·말에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-condition-claims', '「기약분수」가 빠진 조건 문장 가리기', '심45 / 기본 ①33', (d) => {
        // 함정: 「분모에 2와 5 이외의 소인수가 있으면 유한소수가 아니다」를 기약분수가 아닌 분수에도 그대로 대는 아이(3/6 = 0.5를 떠올리지 못한다).
        //  분자의 소인수를 따지는 아이, 2와 5가 둘 다 있어야 한다고 여기는 아이가 저마다 다른 문장을 고른다.
        const wantTrue = d.bool();
        return claimQ(d, `유한소수로 나타낼 수 있는 분수에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, COND_TRUE, COND_FALSE, wantTrue);
      }),
      H('hard-repeat-least', '분자와 약분되는 수를 가려 순환소수가 되게 하는 가장 작은 자연수 구하기', '기본 ①46', (d) => {
        // 함정: 분모에 3이 곱해지면 곧 순환소수가 된다고 여겨 3이라고 답하는 아이. 분자의 3(7)과 약분되어 없어지는 수는 건너뛰어야 한다.
        //  분자가 21, 42이면 3, 6, 7이 모두 약분되어 9가, 63이면 9까지 약분되어 11이 답이다.
        const [num, f] = d.pick([[6, [[2, 2], [5, 2]]], [3, [[2, 2], [5, 1]]], [9, [[2, 1], [5, 2]]], [12, [[5, 2]]], [15, [[2, 3]]], [21, [[2, 2], [5, 1]]], [42, [[5, 2]]], [63, [[2, 1], [5, 1]]], [33, [[2, 1], [5, 2]]]]), D0 = fval(f);
        const answer = range(1, 12).find((v) => !fin(num, D0 * v)), passed = range(3, answer - 1).filter((v) => strip25(v) > 1), left = fz(need(num, D0 * answer)).map(([p]) => p);
        return N(`${nb(ffrac(num, f, x) + tail(num, '이/가'))} 순환소수가 되게 하는 가장 작은 자연수 ${x}의 값은?`, answer, {
          explain: `기약분수로 고쳤을 때 분모에 2와 5 이외의 소인수가 남아야 한다. ${passed.length ? `${x} = ${passed.join(', ')}이면 분자와 약분되어 차례로 ${passed.map((v) => low(num, D0 * v)).join(', ')}이고 모두 유한소수가 된다. ` : ''}${x} = ${answer}이면 ${low(num, D0 * answer)}이고 분모에 소인수 ${left.join(', ')}${tail(left[left.length - 1], '이/가')} 남으므로 순환소수가 된다.`,
          facts: { digit: { template: `0<(${num}*${BIG})%(${D0}*□)`, lo: 1, hi: 12, ask: 'min' } }
        });
      }),
      H('hard-denom-count', '분모에 곱해진 한 자리 수 가운데 순환소수가 되게 하는 것의 개수', '심22 / 기본 ①42·48', (d) => {
        // 함정: 3, 6, 7, 9를 모두 세는 아이(분자와 약분되는 것을 보지 않는다), 분자에 3이 있으니 9도 약분된다고 여겨 빼는 아이(3이 하나 남는다).
        const [num, f] = d.pick([[27, [[3, 2], [5, 1]]], [3, [[2, 3], [5, 1]]], [9, [[2, 2], [5, 1]]], [21, [[2, 1], [3, 1], [5, 1]]], [21, [[2, 2], [5, 1]]], [14, [[5, 2]]], [63, [[2, 1], [5, 1], [7, 1]]], [6, [[5, 2]]]]), D0 = fval(f);
        const flags = range(1, 9).map((v) => !fin(num, D0 * v)), hits = range(1, 9).filter((v) => flags[v - 1]);
        return N(`${nb(ffrac(num, f, a) + tail(num, '이/가'))} 순환소수가 되게 하는 한 자리 자연수 ${a}는 모두 몇 개인가?`, hits.length, {
          unit: '개',
          explain: `${a} = 1, 2, 4, 5, 8이면 기약분수의 분모의 소인수가 2와 5뿐이다. ${[3, 6, 7, 9].map((v) => `${a} = ${v}이면 ${low(num, D0 * v)}`).join(', ')}이다. 기약분수의 분모에 2와 5 이외의 소인수가 남는 것은 ${a} = ${hits.join(', ')}일 때이므로 ${hits.length}개이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-rep-finite', '순환소수에 곱하여 유한소수가 되게 하는 가장 작은 자연수', '심42 / 기본 ①70', (d) => {
        // 함정: 분수로 고친 분모 90(990)만 보고 9(99)라고 답하는 아이. 기약분수로 고친 다음 분모를 보아야 한다(0.63̇ = 57/90 = 19/30이므로 3).
        //  곱이 정수가 되어 버리지 않게, 기약분수의 분모에 2나 5가 남는 수(순환하지 않는 자리가 있는 수)만 쓴다.
        const r = d.until(() => pickRep(d, { f: 1, k: d.int(1, 2) }), (v) => need(valOf(v).p, valOf(v).q) < need(1, repDen(v)) && strip25(valOf(v).q) < valOf(v).q && valOf(v).q <= 330), v = valOf(r), k = need(v.p, v.q), { A, B: Bn, den } = parts(r);
        return N(`${nb(repOf(r) + ' × ' + a + '가')} 유한소수가 되게 하는 가장 작은 자연수 ${a}의 값은?`, k, {
          explain: `${asFrac(r)}이다. 기약분수의 분모는 ${eqn(v.q)}이므로 ${a}는 ${asProduct(k)}의 배수이어야 한다. 가장 작은 자연수는 ${k}이다.`,
          facts: { digit: { template: `(□*${A - Bn}*${BIG})%${den}<1`, lo: 1, hi: k + 30, ask: 'min' } }
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-both-finite', '두 분수를 모두 유한소수가 되게 하는 가장 작은 자연수', '심19 / 기본 ①43', (d) => {
        // 한 분수는 약분부터 해야 한다(17/102 = 1/6이므로 지울 것은 17이 아니라 3). 분수마다 지울 수를 구한 다음 두 수의 최소공배수를 구한다.
        //  곱이 정수가 되어 버리지 않게, 기약분수의 분모에 2나 5가 있는 분수만 쓴다.
        const [one, two, k1, k2] = d.until(() => {
          const first = d.pick([[13, 78], [17, 102], [7, 42], [21, 90], [21, 54], [9, 66], [22, 132], [9, 84], [26, 156]]), second = d.pick([[3, 220], [7, 110], [9, 70], [3, 140], [7, 150], [13, 90], [9, 140], [11, 180], [3, 130]]);
          return [first, second, need(first[0], first[1]), need(second[0], second[1])];
        }, ([, , u, w]) => lcm(u, w) > Math.max(u, w) && lcm(u, w) <= 400), [[p1, q1], [p2, q2]] = d.bool() ? [one, two] : [two, one], [u, w] = [need(p1, q1), need(p2, q2)], answer = lcm(k1, k2);
        const told = (p, q, k) => { const g = gcd(p, q); return `${g > 1 ? `${frac(p, q)} = ${frac(p / g, q / g)}이고 ` : ''}${denTold(q / g)}${n}은 ${asProduct(k)}의 배수이어야 한다.`; };
        return N(`두 분수 ${frac(p1, q1)}, ${frac(p2, q2)}에 자연수 ${n}을 각각 곱하면 두 수가 모두 유한소수가 된다. 이러한 ${n} 가운데 가장 작은 수는?`, answer, {
          explain: `${told(p1, q1, u)} ${told(p2, q2, w)} ${u}${tail(u, '과/와')} ${w}의 최소공배수는 ${answer}이므로 가장 작은 수는 ${answer}이다.`,
          facts: { digit: { template: `(${p1}*□*${BIG})%${q1}+(${p2}*□*${BIG})%${q2}<1`, lo: 1, hi: answer + 40, ask: 'min' } }
        });
      }),
      H('hard-finite-not-integer', '곱이 정수가 아닌 유한소수가 되게 하는 두 자리 자연수의 개수', '심15·20', (d) => {
        // 지울 수의 배수를 세고, 곱이 정수가 되어 버리는 수(분모의 배수)를 뺀다. 90 = 2 × 3² × 5에서 3만 지우면 되는 줄 아는 아이는 3의 배수를 센다.
        const [p, q] = d.pick([[29, 90], [11, 70], [13, 90], [7, 36], [5, 28], [9, 44], [3, 70], [7, 45], [3, 26], [9, 55], [11, 18], [13, 60]]), k = need(p, q);
        const flags = range(10, 99).map((v) => fin(p * v, q) && (p * v) % q !== 0), multiples = range(10, 99).filter((v) => v % k === 0), whole = range(10, 99).filter((v) => v % q === 0), answer = flags.filter(Boolean).length;
        return N(`두 자리 자연수 ${a}에 대하여 ${nb(frac(p, q) + ' × ' + a + '가')} 정수가 아닌 유한소수가 될 때, ${a}의 값은 모두 몇 개인가?`, answer, {
          unit: '개',
          explain: `${eqn(q)}이므로 ${a}는 ${asProduct(k)}의 배수이어야 한다. 두 자리 자연수 가운데 ${k}의 배수는 ${multiples.length}개이다. 이 가운데 ${a} = ${whole.join(', ')}이면 분모와 모두 약분되어 정수가 되므로 뺀다. ${multiples.length} − ${whole.length} = ${answer}개이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-between-count', '두 분수 사이에 있고 분모가 정해진 분수 가운데 유한소수(순환소수)가 되는 것의 개수', '심16·17 / 기본 ①35', (d, at) => {
        // 통분하여 분자의 범위를 잡고, 분모의 3(7)을 지우는 배수를 센다. 첫째는 유한소수가 되는 것, 둘째는 순환소수로만 나타낼 수 있는 것(범위 안의 개수에서 유한소수가 되는 것을 뺀다)이다.
        const s = d.until(() => {
          const L = d.pick([24, 28, 30, 35, 36, 45, 56, 60, 70]), ds = range(2, L - 1).filter((v) => L % v === 0), d1 = d.pick(ds), d2 = d.pick(ds), c1 = d.int(1, d1 - 1), c2 = d.int(1, d2 - 1), lo = c1 * L / d1, hi = c2 * L / d2;
          const inside = range(1, L - 1).filter((v) => v > lo && v < hi);
          return { L, d1, d2, c1, c2, lo, hi, inside, fins: inside.filter((v) => fin(v, L)) };
        }, (v) => gcd(v.c1, v.d1) === 1 && gcd(v.c2, v.d2) === 1 && v.d1 !== v.d2 && v.lo < v.hi && v.inside.length >= 6 && v.inside.length <= 22 && v.fins.length >= 2 && v.fins.length <= 6);
        const k = need(1, s.L), flags = range(1, s.L - 1).map((v) => v > s.lo && v < s.hi && fin(v, s.L) === (at === 0)), answer = flags.filter(Boolean).length;
        const head = `${fj(s.c1, s.d1, '과/와')} ${frac(s.c2, s.d2)} 사이에 있는 분수 ${frac(x, s.L)} 가운데`, base = `통분하면 ${frac(s.c1, s.d1)} = ${frac(s.lo, s.L)}, ${frac(s.c2, s.d2)} = ${frac(s.hi, s.L)}이므로 ${s.lo} &lt; ${x} &lt; ${s.hi}이다. ${eqn(s.L)}이므로 ${x}가 ${asProduct(k)}의 배수이면 유한소수가 된다.`;
        return ruled(N(`${head} ${at === 0 ? '유한소수로 나타낼 수 있는' : '순환소수로만 나타낼 수 있는'} 것은 모두 몇 개인가? (단, ${x}는 자연수이다.)`, answer, {
          unit: '개',
          explain: at === 0 ? `${base} 범위 안의 ${k}의 배수는 ${s.fins.join(', ')}의 ${s.fins.length}개이다.` : `${base} 범위 안의 자연수는 ${s.inside.length}개이고 이 가운데 ${k}의 배수 ${s.fins.join(', ')}의 ${s.fins.length}개는 유한소수가 된다. ${s.inside.length} − ${s.fins.length} = ${answer}개이다.`,
          facts: { count: flags }
        }), at === 0 ? 'hard-between-finite' : 'hard-between-repeating');
      }, { count: 2 }),
      H('hard-digit-run', '소수점 아래 n번째 자리까지의 숫자의 합과 어떤 숫자가 나오는 횟수', '심7·8 / 기본 ①21', (d, at) => {
        // 첫째는 순환하지 않는 자리가 있는 수의 숫자의 합(첫째 자리의 숫자는 한 번만 더한다), 둘째는 순환마디가 여섯 자리인 수에서 한 숫자가 나오는 횟수(남는 자리에 그 숫자가 드는지 본다)이다.
        if (at === 0) {
          const { p, q, e } = pickFrac(d, [22, 54, 55, 66, 74, 110], (v) => v.e.pre.length === 1 && v.e.cyc.length >= 2 && v.e.cyc.length <= 3), k = e.cyc.length, cnt = d.until(() => d.int(10, 30), (v) => (v - 1) % k !== 0);
          const times = Math.floor((cnt - 1) / k), rest = (cnt - 1) % k, digits = (headOf(e).split('.')[1] + e.cyc.repeat(times + 1)).slice(0, cnt).split('').map(Number), total = digits.reduce((s, v) => s + v, 0), cs = e.cyc.split('');
          return ruled(N(`${fj(p, q, '을/를')} 소수로 나타낼 때, 소수점 아래 첫째 자리부터 ${cnt}번째 자리까지의 숫자의 합은?`, total, {
            explain: `${p} ÷ ${q} = ${unrollOf(e)}이므로 ${frac(p, q)} = ${repOf(e)}이다. 첫째 자리의 숫자 ${e.pre}${lastJ(e.pre, '은/는')} 한 번만 나오고, 둘째 자리부터 순환마디 ${e.cyc}${lastJ(e.cyc, '이/가')} 되풀이된다. ${nb(`${cnt} − 1 = ${cnt - 1}`)}이고 ${nb(`${cnt - 1} = ${k} × ${times} + ${rest}`)}이므로 순환마디가 ${times}번 되풀이되고 숫자 ${cs.slice(0, rest).join(', ')}${tail(Number(cs[rest - 1]), '이/가')} 더 온다. 합은 ${e.pre} + (${cs.join(' + ')}) × ${times} + ${cs.slice(0, rest).join(' + ')} = ${total}이다.`,
            facts: { calc: [[range(1, cnt).map((i) => digitJs(p, q, i)).join('+'), 0]], unseen: [10] }
          }), 'hard-digit-sum');
        }
        const { p, q, e } = pickFrac(d, [7, 13], null), cnt = d.until(() => d.int(40, 60), (v) => v % 6 !== 0), times = Math.floor(cnt / 6), rest = cnt % 6, cs = e.cyc.split(''), t = Number(d.pick(cs)), more = cs.slice(0, rest).includes(String(t));
        return ruled(N(`${fj(p, q, '을/를')} 소수로 나타낼 때, 소수점 아래 첫째 자리부터 ${cnt}번째 자리까지에 숫자 ${t}${tail(t, '은/는')} 모두 몇 번 나오는가?`, times + (more ? 1 : 0), {
          unit: '번',
          explain: `${p} ÷ ${q} = ${headOf(e) + e.cyc.repeat(2)}…이므로 순환마디는 ${e.cyc}이고, 순환마디에 숫자 ${t}${tail(t, '은/는')} 한 번 들어 있다. ${nb(`${cnt} = 6 × ${times} + ${rest}`)}이므로 순환마디가 ${times}번 되풀이되고 숫자 ${cs.slice(0, rest).join(', ')}${tail(Number(cs[rest - 1]), '이/가')} 더 온다. 더 오는 숫자에 ${t}${tail(t, '이/가')} ${more ? '있으므로' : '없으므로'} 모두 ${times + (more ? 1 : 0)}번 나온다.`,
          facts: { calc: [[range(1, cnt).map((i) => `0**((${digitJs(p, q, i)}-${t})**2)`).join('+'), 0]], unseen: [10, 0, 2] }
        }), 'hard-digit-times');
      }, { count: 2 }),
      H('hard-digit-sum-back', '자리의 숫자의 합으로 순환마디 속의 숫자 구하기', '심9', (d) => {
        // 첫째 자리의 숫자는 순환마디에 들지 않는다. 순환마디가 되풀이되는 횟수와 남는 자리를 바르게 세어야 a 가 몇 번 나오는지 알 수 있다.
        const s = d.until(() => ({ p0: d.int(1, 9), y: d.int(0, 9), z: d.int(0, 9), v: d.int(2, 9), m: d.int(5, 10), more: d.int(1, 2) }), (c) => c.z !== c.p0 && c.y !== c.z && !(c.v === c.y && c.y === c.z) && !(c.v === 9 && c.y === 9));
        const cnt = 1 + 3 * s.m + s.more, fixed = s.p0 + s.m * (s.y + s.z) + (s.more === 2 ? s.y : 0), total = fixed + (s.m + 1) * s.v;
        return N(`순환소수 ${repV('0.' + s.p0, [a, String(s.y), String(s.z)], 'a' + s.y + s.z)}의 소수점 아래 첫째 자리부터 ${cnt}번째 자리까지의 숫자의 합이 ${total}일 때, 한 자리 자연수 ${a}의 값은?`, s.v, {
          explain: `첫째 자리의 숫자 ${s.p0}${tail(s.p0, '은/는')} 한 번만 나오고, 둘째 자리부터 순환마디의 숫자 ${a}, ${s.y}, ${s.z}${tail(s.z, '이/가')} 되풀이된다. ${nb(`${cnt} − 1 = ${cnt - 1}`)}이고 ${nb(`${cnt - 1} = 3 × ${s.m} + ${s.more}`)}이므로 순환마디가 ${s.m}번 되풀이되고 ${s.more === 1 ? a : `${a}, ${s.y}`}${s.more === 1 ? '가' : tail(s.y, '이/가')} 더 온다. 합은 ${s.p0} + (${a} + ${s.y} + ${s.z}) × ${s.m} + ${a}${s.more === 2 ? ` + ${s.y}` : ''} = ${total}이므로 ${nb(`${s.m + 1} × ${a} + ${fixed} = ${total}`)}, ${nb(`${a} = ${s.v}`)}이다.`,
          facts: { digit: { template: `${total}-1<${s.p0}+${s.m}*(□+${s.y}+${s.z})+□${s.more === 2 ? '+' + s.y : ''}<${total}+1`, lo: 1, hi: 9, ask: 'max' } }
        });
      }),
      H('hard-misread', '분모와 분자를 한 사람씩 잘못 본 기약분수 구하기', '심31 / 기본 ①65', (d) => {
        // 분모를 잘못 본 사람은 분자를, 분자를 잘못 본 사람은 분모를 바르게 보았다. 두 순환소수를 기약분수로 고쳐야 바르게 본 수를 읽을 수 있다.
        // 흔한 잘못: 약분하지 않은 분수(194/90)에서 분자를 읽는다, 잘못 본 쪽의 수를 가져온다.
        const s = d.until(() => {
          const s1 = d.pick([[1, 1], [0, 2], [0, 1]]), s2 = d.pick([[0, 2], [1, 1]]), r1 = pickRep(d, { whole: [0, 2], f: s1[0], k: s1[1] }), r2 = pickRep(d, { whole: [0, 1], f: s2[0], k: s2[1] });
          return { r1, r2, v1: valOf(r1), v2: valOf(r2) };
        }, (c) => gcd(c.v1.p, c.v2.q) === 1 && c.v1.p !== c.v2.p && c.v1.q !== c.v2.q && c.v1.p >= 2 && c.v1.p <= 99 && c.v2.q <= 99 && (c.v1.q < repDen(c.r1) || c.v2.q < repDen(c.r2)));
        const [who1, who2] = d.shuffle(NAMES).slice(0, 2), top = s.v1.p, bottom = s.v2.q;
        return F(`어떤 기약분수를 소수로 나타내는데, ${name(who1, '은/는')} 분모를 잘못 보아 ${repJ(s.r1, '으로/로')} 나타내고, ${name(who2, '은/는')} 분자를 잘못 보아 ${repJ(s.r2, '으로/로')} 나타내었다. 처음 기약분수를 구하시오.`, top, bottom, {
          improper: top > bottom,
          explain: `${name(who1, '은/는')} 분자를 바르게 보았다. ${asFrac(s.r1)}이므로 처음 분수의 분자는 ${top}이다. ${name(who2, '은/는')} 분모를 바르게 보았다. ${asFrac(s.r2)}이므로 처음 분수의 분모는 ${bottom}이다. 처음 기약분수는 ${frac(top, bottom)}이다.`,
          facts: { value: `${top}/${bottom}`, unseen: [top, bottom] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
