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
// 2026-10-13: 처음 지을 때 뺀 꼴을 다시 보고 실력 유형 열여덟 개(스물세 문항)를 묶음 끝에 덧붙였다. 파일 끝의 「다시 실은 꼴」 구역에 있다.
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
    id: 'hard', title: '단원 종합', standard: STD,
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

  // ══ 다시 실은 꼴(2026-10-13) ══
  // 처음 지을 때 「정도 넘음」(순환소수가 든 등식·혼합 계산·문자가 든 순환소수), 「조건 셋 이상·경우 따지기」, 「요령」으로 뺀 꼴을 다시 보고 실력 묶음 끝에 덧붙였다
  // (사용자 2026-10-13: 「수학실력에 필요해보이는문제는 다 넣어」). 앞의 유형은 id·차례·문항이 그대로다. 꼴마다의 판정은 싣기_대조표.md 에 있다.
  //  - 그대로 뺀 것: 순환마디가 9인 수가 나오는 것(0.ȧ의 분모가 9, 0.1999…), 「무리수」, 순환소수가 든 부등식(심38 — 일차부등식은 뒤 단원 8-1-3), 중1 복습(①3), 그림을 알 수 없는 것(①37 심10),
  //    순환소수가 아닌 소수의 자리 세기(심11 — 이 단원의 성질에서 나오지 않는 요령), 따로 구한 값을 더하게 하는 것(①59, 두 역수의 곱 등).
  //  - 바꾸어 실은 것: 심34는 a + b 대신 a, b 를 순환소수로 나타낸 짝을 고르게 했다(따로 구한 값의 합을 묻지 않는다). 심40은 순환마디가 9인 수(0.009̇)가 나오지 않게 8 이하의 수로 좁혔다.
  //    ①49는 합 대신 개수를, 심25는 n = 1(정수)이 걸리지 않게 2 이상의 수로 물었다.
  //  - 순환소수를 식에 쓸 때는 분수로 고쳐서 계산한다. 답이 순환소수인 문항은 고르기로 낸다.
  // 함정(실력 ①)의 장치: 분자와 약분되는 소인수는 분모에 곱해져도 된다(가장 큰 두 자리 수는 80이 아니다), 서로소이면 약분되지 않는다(분모의 3은 지워지지 않고 2는 쓸 수 없다),
  //   순환마디가 첫째 자리에서 시작하면 기약분수의 분모에 2와 5가 없다(분모의 3²이 아니라 2² × 5를 지운다).
  const { M, C } = B.kit;
  const { qsub, qmul, qdiv, ex } = B.kit.mid;
  const { expand, okRep, rep, Q, sup, repJs, repUnseen, unroll, decText, repL } = B.kit.m811;
  const vb = V('b'), vc = V('c'), vy = V('y'), vz = V('z'), LT = ' &lt; ', PLUS = ' <i>+</i> ', TIMES = ' <i>×</i> ';
  // 짧게 적을 수 있는 순환소수인가: 순환마디 k자리까지, 순환하지 않는 자리 f자리까지
  const shortRep = (e, f, k) => e.cyc !== '' && e.cyc.length <= (k || 2) && e.pre.length <= (f == null ? 1 : f) && okRep(e.pre, e.cyc);
  const fq = (v) => frac(v.p, v.q);
  // 수를 소인수분해 한 등식으로 적고 토씨를 붙인다(소수이면 그 수만). 토씨는 마지막에 읽는 것(끝 소인수, 지수가 있으면 「제곱」)에 맞춘다.
  const eqJ = (v, pair) => { const g = fz(v); if (g.length === 1 && g[0][1] === 1) return v + tail(v, pair); const [p, e] = g[g.length - 1]; return eqn(v) + (e > 1 ? pair.split('/')[0] : tail(p, pair)); };
  // 소인수가 2와 5뿐인 수
  const SMOOTH = range(1, 99).filter((v) => strip25(v) === 1);
  // 어떤 자연수의 제곱이 되게 곱하는 가장 작은 수: 지수가 홀수인 소인수의 곱
  const oddPart = (v) => fz(v).filter(([, e]) => e % 2 === 1).map(([p]) => p);
  // 순환소수 셋의 혼합 계산 c ÷ a + b 가 자연수가 되는 짝(처음 쓸 때 한 번만 찾는다)
  let mixedTable = null;
  function mixedRows() {
    if (mixedTable) return mixedTable;
    const pool = [];
    for (const [f, k] of [[0, 1], [0, 2], [1, 1]]) for (let v = 0; v < 10 ** (f + k); v += 1) {
      const t = String(v).padStart(f + k, '0'), r = { whole: 0, pre: t.slice(0, f), cyc: t.slice(f) };
      if (okRep(r.pre, r.cyc) && valOf(r).q <= 99) pool.push(r);
    }
    mixedTable = [];
    for (const ra of pool) for (const rc of pool) {
      const t = qdiv(valOf(rc), valOf(ra));
      if (ra === rc || t.q === 1 || t.q > 45 || valOf(ra).p === 1) continue;
      for (const up of [Math.ceil(t.p / t.q), Math.ceil(t.p / t.q) + 1]) {
        const v = qsub(Q(up), t), e = expand(v.p, v.q);
        if (up >= 2 && up <= 9 && e.whole <= 2 && shortRep(e) && repOf(e) !== repOf(ra) && repOf(e) !== repOf(rc)) mixedTable.push({ ra, rc, rb: e, t, up });
      }
    }
    return mixedTable;
  }

  B.addTypes(U, 'hard', [
    // ── ① 문제의 수·말에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
    H('hard-denom-largest', '분모에 곱해진 수 가운데 유한소수가 되게 하는 가장 큰 두 자리 수', '심21', (d) => {
      // 함정: 분모의 소인수가 2와 5뿐이어야 한다며 80이라고 답하는 아이. 분자와 약분되는 소인수는 분모에 곱해져도 된다(3 × 32 = 96).
      //  거꾸로 3의 배수이면 다 된다고 여겨 99라고 답하는 아이도 있다(99 = 3² × 11은 3과 11이 남는다). 분자가 99이면 99가 통째로 약분된다.
      const num = d.pick([3, 6, 9, 11, 21, 22, 33, 77, 91, 99]), f = d.pick([[[2, 2], [5, 3]], [[2, 3], [5, 1]], [[2, 1], [5, 2]], [[5, 2]], [[2, 3]]]), D0 = fval(f);
      const answer = range(10, 99).filter((v) => fin(num, D0 * v)).pop(), core = strip25(num), plain = SMOOTH.filter((v) => v >= 10).pop();
      const best = range(2, core).filter((e) => core % e === 0).map((e) => { const m = SMOOTH.filter((v) => e * v >= 10 && e * v <= 99).pop(); return { value: e * m, text: m === 1 ? String(e) : nb(`${e} × ${m} = ${e * m}`) }; });
      return N(`${nb(ffrac(num, f, a) + tail(num, '이/가'))} 유한소수가 될 때, 두 자리 자연수 ${a} 가운데 가장 큰 수는?`, answer, {
        explain: `${a}의 소인수 가운데 2와 5가 아닌 것은 분자 ${eqJ(num, '과/와')} 약분되어 모두 없어져야 한다. 소인수가 2와 5뿐인 두 자리 자연수 가운데 가장 큰 수는 ${plain}이다. 분자와 약분되는 수를 곱한 꼴에서는 ${best.map((v) => v.text).join(', ')}${tail(best[best.length - 1].value, '이/가')} ${best.length > 1 ? '저마다 ' : ''}가장 크다. 따라서 가장 큰 수는 ${answer}이다.`,
        facts: { digit: { template: `(${num}*1000000000000)%(${D0}*□)<1`, lo: 10, hi: 99, ask: 'max' } }
      });
    }),
    H('hard-coprime-count', '분자와 서로소인 분모 가운데 유한소수가 되게 하는 것의 개수', '심25', (d) => {
      // 함정: 분자와 약분되는 분모(24/3, 24/6, 24/15)까지 세는 아이. 서로소이면 약분되지 않으므로 분모의 소인수가 그대로 남고, 분자와 같은 소인수(2)는 분모에 쓸 수 없다.
      //  분자가 2나 5를 소인수로 가지는 수만 쓴다(그 소인수는 분모에 쓸 수 없다). n = 1이면 정수가 되므로 2 이상의 수만 묻는다.
      const [num, top] = d.pick([[24, 1000], [24, 200], [12, 1000], [36, 200], [48, 1000], [6, 200], [18, 1000], [14, 1000], [15, 100], [15, 50], [45, 100], [75, 200], [35, 100], [55, 50]]);
      const flags = range(2, top).map((v) => gcd(v, num) === 1 && fin(num, v)), hits = range(2, top).filter((v) => flags[v - 2]), shared = [2, 5].filter((p) => num % p === 0), free = [2, 5].filter((p) => num % p !== 0);
      return N(`2 이상 ${top} 이하의 자연수 ${n} 가운데 ${num}${tail(num, '과/와')} 서로소이고 ${fj(num, n, '이/가')} 유한소수가 되게 하는 것은 모두 몇 개인가?`, hits.length, {
        unit: '개',
        explain: `${n}이 ${num}${tail(num, '과/와')} 서로소이면 ${frac(num, n)}${tail(num, '은/는')} 더 약분되지 않으므로, 유한소수가 되려면 ${n}의 소인수가 2 또는 5뿐이어야 한다. ${shared.length ? `${eqn(num)}이므로 ${n}은 소인수 ${shared.join(', ')}${tail(shared[shared.length - 1], '을/를')} 가질 수 없다. ${n}은 소인수가 ${free[0]}뿐인 수이다. ` : ''}${top} 이하에서 그런 수는 ${hits.join(', ')}의 ${hits.length}개이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-pure-count', '순환마디가 소수점 아래 첫째 자리에서 시작되게 하는 분자의 개수', '심26', (d) => {
      // 함정: 순환소수가 되기만 하면 된다고 여겨 유한소수가 되는 분자만 빼는 아이. 순환하지 않는 자리가 없으려면 기약분수의 분모에 2와 5가 없어야 한다
      //  (순환소수를 분수로 고치면 분모가 9…9이고, 순환하지 않는 자리가 있으면 그만큼 0이 붙는다). 정수가 되는 분자는 뺀다.
      const [q, top] = d.pick([[180, 100], [60, 100], [90, 50], [150, 200], [220, 100], [45, 30], [36, 30], [330, 50], [66, 14], [110, 60], [44, 30], [396, 30]]);
      const t = q / strip25(q), flags = range(1, top).map((v) => { const e = expand(v, q); return e.cyc !== '' && e.pre === ''; }), mult = range(1, top).filter((v) => v % t === 0), whole = mult.filter((v) => v % q === 0), count = flags.filter(Boolean).length;
      const shown = mult.map((v) => (v % q === 0 ? String(v / q) : nb(`${frac(v / gcd(v, q), q / gcd(v, q))} = ${repOf(expand(v, q))}`)));
      return N(`분수 ${frac(x, q)}를 소수로 나타내면 소수점 아래 첫째 자리부터 순환마디가 시작되는 순환소수가 된다. 이러한 ${top} 이하의 자연수 ${x}는 모두 몇 개인가?`, count, {
        unit: '개',
        explain: `소수점 아래 첫째 자리부터 순환마디가 시작되는 순환소수는 분모가 9, 99, 999, …인 분수로 나타낼 수 있다. 이 분모들에는 소인수 2와 5가 없으므로 기약분수로 고친 분모에도 2와 5가 없어야 한다. ${eqn(q)}이므로 ${x}는 ${asProduct(t)}의 배수이어야 한다. ${top} 이하의 ${t}의 배수는 ${mult.join(', ')}이고, 이때 분수의 값은 차례로 ${shown.join(', ')}이다. ${whole.length ? `${x} = ${whole.join(', ')}이면 정수가 되므로 뺀다. ` : ''}모두 ${count}개이다.`,
        facts: { count: flags }
      });
    }),
    // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
    H('hard-between-rep', '순환소수와 분수(소수) 사이에 있고 분모가 정해진 분수 가운데 유한소수가 되는 것의 개수', '심16 / 기본 ①36', (d) => {
      // hard-between-count 에 한 단계가 더 있다: 끝 수가 순환소수이면 분수로 고쳐서 통분해야 분자의 범위가 잡힌다. 끝 수는 세지 않는다.
      const s = d.until(() => {
        const L = d.pick([30, 45, 60, 90]), lo = d.int(1, L - 8), hi = lo + d.int(6, 22), kinds = d.pick([['rep', 'rep'], ['rep', 'other'], ['other', 'rep']]);
        if (hi >= L) return null;
        const ends = [lo, hi].map((v, i) => { const e = expand(v, L), g = gcd(v, L); return { v, e, p: v / g, q: L / g, kind: kinds[i] === 'rep' ? 'rep' : e.cyc === '' && e.pre.length <= 2 ? 'dec' : 'frac' }; });
        const inside = range(lo + 1, hi - 1);
        return { L, lo, hi, ends, inside, fins: inside.filter((v) => fin(v, L)) };
      }, (v) => v && v.ends.every((t) => (t.kind === 'rep' ? shortRep(t.e) : t.kind === 'frac' ? t.q < v.L && t.q <= 12 : true)) && v.fins.length >= 1 && v.fins.length <= 6 && v.inside.length >= 5);
      const k = need(1, s.L), [e1, e2] = s.ends, flags = range(1, s.L - 1).map((v) => v > s.lo && v < s.hi && fin(v, s.L));
      const show = (t) => (t.kind === 'rep' ? repOf(t.e) : t.kind === 'dec' ? decText(t.e) : frac(t.p, t.q));
      const withJ = (t, pair) => (t.kind === 'rep' ? repJ(t.e, pair) : t.kind === 'dec' ? decText(t.e) + lastJ(decText(t.e), pair) : fj(t.p, t.q, pair));
      const told = (t) => {
        if (t.kind !== 'rep') return `${show(t)} = ${frac(t.v, s.L)}`;
        const { A, B: Bn, den } = parts(t.e), chain = [frac(A - Bn, den)];
        if (den !== s.L) { if (t.q !== den && t.q !== s.L) chain.push(frac(t.p, t.q)); chain.push(frac(t.v, s.L)); }
        return `${repOf(t.e)} = ${chain.join(' = ')}`;
      };
      return N(`${withJ(e1, '과/와')} ${show(e2)} 사이에 있는 분수 ${frac(x, s.L)} 가운데 유한소수로 나타낼 수 있는 것은 모두 몇 개인가? (단, ${x}는 자연수이다.)`, s.fins.length, {
        unit: '개',
        explain: `${told(e1)}, ${told(e2)}이므로 ${s.lo}${LT}${x}${LT}${s.hi}이다. ${eqn(s.L)}이므로 ${x}가 ${asProduct(k)}의 배수이면 유한소수가 된다. 범위 안의 ${k}의 배수는 ${s.fins.join(', ')}의 ${s.fins.length}개이다.`,
        facts: { count: flags, rule: 'hard-between-rep' }
      });
    }),
    H('hard-multiple-cond', '유한소수가 되고 배수 조건도 만족시키는 가장 작은 두 자리 분자', '심24 / 기본 ①44', (d) => {
      // 유한소수 조건에서 나오는 배수와 주어진 배수의 공배수를 구한다. 서로소가 아닌 두 수(21과 9, 9와 6)를 섞어, 두 수의 곱이 아니라 최소공배수를 찾게 한다.
      const [q, m] = d.pick([[210, 9], [600, 11], [90, 6], [140, 11], [210, 6], [180, 12], [450, 15], [420, 9], [210, 14], [330, 6], [150, 11], [280, 4], [120, 7], [660, 9], [130, 4], [220, 6]]), k = need(1, q), answer = lcm(k, m);
      return N(`분수 ${frac(x, q)}를 소수로 나타내면 유한소수가 되고, ${x}는 ${m}의 배수이다. 이러한 두 자리 자연수 ${x} 가운데 가장 작은 수는?`, answer, {
        explain: `${eqn(q)}이므로 ${x}는 ${asProduct(k)}의 배수이어야 한다. ${x}는 ${m}의 배수이기도 하므로 ${k}${tail(k, '과/와')} ${m}의 공배수이다. ${k}${tail(k, '과/와')} ${m}의 최소공배수는 ${answer}이므로 가장 작은 두 자리 자연수는 ${answer}이다.`,
        facts: { digit: { template: `(□*${BIG})%${q}+□%${m}<1`, lo: 10, hi: 99, ask: 'min' } }
      });
    }),
    H('hard-reduced-form', '유한소수가 되고 기약분수의 분자가 정해진 분수의 분자와 분모 구하기', '심23 / 기본 ①45', (d) => {
      // 범위 안의 배수가 둘 이상 나오고, 약분한 꼴의 분자로 하나를 고른다(30 < x < 50에서 36/90 = 2/5, 45/90 = 1/2).
      const s = d.until(() => {
        const q = d.pick([60, 70, 90, 140, 150, 180, 210, 220, 420, 440, 450]), k = need(1, q), lo = 10 * d.int(1, 9), hi = lo + d.pick([10, 20]);
        const cands = range(lo + 1, hi - 1).filter((v) => v % k === 0).map((v) => ({ v, top: v / gcd(v, q), bottom: q / gcd(v, q) }));
        return { q, k, lo, hi, cands, me: cands.length ? d.pick(cands) : null };
      }, (v) => v.me && v.hi < v.q && v.cands.length >= 2 && v.cands.length <= 3 && v.cands.filter((t) => t.top === v.me.top).length === 1 && v.me.top <= 20);
      const { q, k, lo, hi, me } = s;
      return M(`분수 ${frac(x, q)}를 소수로 나타내면 유한소수가 되고, 이 분수를 기약분수로 나타내면 ${frac(me.top, vy)}이다. ${nb(`${lo}${LT}${x}${LT}${hi}`)}일 때, 자연수 ${x}, ${vy}의 값은?`, [{ label: x, answer: me.v }, { label: vy, answer: me.bottom }], {
        shown: `${x} = ${me.v}, ${vy} = ${me.bottom}`,
        explain: `${eqn(q)}이므로 ${x}는 ${asProduct(k)}의 배수이어야 한다. ${nb(`${lo}${LT}${x}${LT}${hi}`)}인 ${k}의 배수는 ${s.cands.map((t) => t.v).join(', ')}이다. ${s.cands.map((t) => nb(`${frac(t.v, q)} = ${frac(t.top, t.bottom)}`)).join(', ')}이므로 기약분수의 분자가 ${me.top}인 것은 ${nb(`${x} = ${me.v}`)}일 때이고, ${nb(`${vy} = ${me.bottom}`)}이다.`,
        facts: { digit: { template: `${lo}<□+((□*${BIG})%${q}+(□*${me.bottom}-${q}*${me.top})**2)*1000<${hi}`, lo: lo + 1, hi: hi - 1, ask: 'min' }, calc: [[`${q}*${me.top}/${me.v}`, 1]], unseen: [me.v] }
      });
    }),
    H('hard-shifted-pair', '한 분수는 순환소수, 분자가 조금 큰 분수는 유한소수가 되게 하는 수의 개수', '기본 ①49', (d) => {
      // n + s 가 지울 수의 배수이어야 한다(범위가 s 만큼 밀린다). 이때 n 은 그 배수가 아니므로 첫 조건(순환소수)은 저절로 맞는다 — 맞는지 따져 보아야 안다.
      const [q, lim] = d.pick([[660, 9], [330, 9], [420, 5], [210, 5], [390, 9], [780, 9], [420, 9], [210, 9]]), k = need(1, q), s = d.int(1, lim);
      const flags = range(10, 99).map((v) => !fin(v, q) && fin(v + s, q)), sums = range(10 + s, 99 + s).filter((v) => v % k === 0), count = flags.filter(Boolean).length;
      return N(`분수 ${frac(n, q)}은 순환소수로만 나타낼 수 있고, 분수 ${frac(`${n} + ${s}`, q)}${tail(s, '은/는')} 유한소수로 나타낼 수 있다. 이러한 두 자리 자연수 ${n}은 모두 몇 개인가?`, count, {
        unit: '개',
        explain: `${eqn(q)}이므로 ${nb(`${n} + ${s}`)}${tail(s, '이/가')} ${asProduct(k)}의 배수이어야 한다. ${n}이 두 자리 자연수이면 ${nb(`${10 + s} ≤ ${n} + ${s} ≤ ${99 + s}`)}이고, 이 범위의 ${k}의 배수는 ${sums.join(', ')}이므로 ${nb(`${n} = ${sums.map((v) => v - s).join(', ')}`)}이다. 이 수들은 ${k}의 배수가 아니므로 ${frac(n, q)}은 순환소수로만 나타낼 수 있다. 모두 ${count}개이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-cycle-denominator', '기약분수의 분모가 정해질 때 순환마디 속의 숫자 구하기', '기본 ①62', (d) => {
      // 순환마디가 세 자리이면 분모는 999 = 3³ × 37이다. 기약분수의 분모가 37이 되려면 분자(순환마디가 나타내는 세 자리 수)가 27의 배수이어야 한다.
      const s = d.until(() => { const v = 27 * d.int(4, 36); return { v, t: String(v), at: d.int(0, 2) }; }, (c) => c.t[c.at] !== '0' && okRep('', c.t));
      const digit = Number(s.t[s.at]), place = 10 ** (2 - s.at), toks = s.t.split('').map((ch, i) => (i === s.at ? a : ch)), said = s.t.split('').map((ch, i) => (i === s.at ? 'a' : ch)).join('');
      const me = repL('0.', toks, said), names = ['백', '십', '일'];
      return N(`순환소수 ${me}${s.at === 2 ? '를' : tail(Number(s.t[2]), '을/를')} 기약분수로 나타내면 분모가 37이다. 한 자리 자연수 ${a}의 값은?`, digit, {
        explain: `순환마디가 세 자리이므로 분수로 고치면 분모는 999이고 분자는 순환마디가 나타내는 세 자리 수(${names[s.at]}의 자리의 숫자가 ${a})이다. ${nb('999 = 3' + sup(3) + ' × 37')}이므로 기약분수의 분모가 37이 되려면 분자가 ${nb('3' + sup(3) + ' = 27')}의 배수이어야 한다. ${a}에 1부터 9까지의 수를 넣은 세 자리 수 가운데 27의 배수는 ${nb(`27 × ${s.v / 27} = ${s.v}`)}뿐이므로 ${nb(`${a} = ${digit}`)}이다. 이때 ${frac(s.v, 999)} = ${frac(s.v / 27, 37)}이다.`,
        facts: { digit: { template: `(${s.v - digit * place}+□*${place})%27<1`, lo: 1, hi: 9, ask: 'min' } }
      });
    }),
    H('hard-endless-sum', '끝없이 이어지는 합을 순환소수로 읽어 계산하기', '심32', (d, at) => {
      // 자리마다 같은 숫자가 놓이는 합은 소수로 이어 쓰면 순환소수이다(3 + 0.3 + 0.03 + … = 3.333…). 첫째는 소수의 합, 둘째는 분수의 합(소수로 고쳐 보아야 한다 — 순환마디가 두 자리)이다.
      if (at === 0) {
        const whole = d.bool(), [c0, p, xv] = d.pick(whole
          ? [[1, 20, 18], [2, 20, 9], [2, 40, 18], [3, 20, 6], [3, 40, 12], [3, 50, 15], [4, 40, 9], [6, 40, 6], [6, 80, 12], [8, 80, 9]]
          : [[2, 4, 18], [3, 2, 6], [3, 4, 12], [3, 5, 15], [4, 8, 18], [6, 4, 6], [6, 8, 12], [1, 2, 18], [1, 4, 36], [2, 6, 27]]);
        const terms = whole ? [c0, '0.' + c0, '0.0' + c0] : ['0.' + c0, '0.0' + c0, '0.00' + c0], sum = whole ? rep(c0 + '.', String(c0)) : rep('0.', String(c0)), v = whole ? Q(10 * c0, 9) : Q(c0, 9), raw = whole ? frac(`${c0}${c0} − ${c0}`, 9) : frac(c0, 9);
        return ruled(N(`다음 식의 값이 ${frac(1, x)}일 때, 자연수 ${x}의 값은?`, xv, {
          figure: ex(`${frac(1, p)}${TIMES}(${terms.join(PLUS)}${PLUS}…)`),
          explain: `${nb(`${terms.join(' + ')} + …`)}의 값을 소수로 이어 쓰면 ${unroll(whole ? c0 + '.' : '0.', String(c0))}이므로 순환소수 ${sum}${tail(c0, '과/와')} 같다. ${nb(`${sum} = ${raw}`)}${v.q === 9 && !whole ? '' : ` = ${fq(v)}`}이므로 ${nb(`${frac(1, p)} × ${fq(v)} = ${frac(1, xv)}`)}이다. ${nb(`${x} = ${xv}`)}이다.`,
          facts: { calc: [[whole ? `9*${p}/(10*${c0})` : `9*${p}/${c0}`, 0]], unseen: whole ? [9, 10] : [9] }
        }), 'hard-endless-decimal');
      }
      // 원문은 앞에 1/5을 곱해 1/a 꼴로 맞추었다. 식이 휴대폰 너비를 넘지 않게 곱하는 수를 빼고 값을 기약분수로 묻는다.
      const m = d.int(2, 8), v = Q(10, 99 * m), dens = [10 * m, 1000 * m, 100000 * m];
      return ruled(F('다음 식의 값을 기약분수로 나타내시오.', v.p, v.q, {
        figure: ex(`${dens.map((t) => frac(1, t)).join(PLUS)}${PLUS}…`),
        explain: `${nb(`${frac(1, dens[0])} = ${frac(1, m)} × 0.1`)}, ${nb(`${frac(1, dens[1])} = ${frac(1, m)} × 0.001`)}, ${nb(`${frac(1, dens[2])} = ${frac(1, m)} × 0.00001`)}이므로 주어진 식은 ${frac(1, m)} × (${nb('0.1 + 0.001 + 0.00001 + …')})이다. ${nb('0.1 + 0.001 + 0.00001 + …')}의 값을 소수로 이어 쓰면 0.101010…이고 이것은 순환소수 ${nb(`${rep('0.', '10')} = ${frac(10, 99)}`)}이다. 주어진 식의 값은 ${nb(`${frac(1, m)} × ${frac(10, 99)} = ${frac(10, 99 * m)}`)}${v.q === 99 * m ? '' : ` = ${fq(v)}`}이다.`,
        facts: { value: `(1/${dens[0]})*(100/99)`, unseen: [100, 99] }
      }), 'hard-endless-fraction');
    }, { count: 2 }),
    H('hard-rep-equation', '순환소수가 든 등식에서 x의 값 구하기', '심33·35 / 기본 ①72', (d, at) => {
      // 순환소수를 분수로 고친 다음 등식을 푼다. 첫째는 곱셈식, 둘째는 순환소수의 제곱이 든 곱셈식, 셋째는 뺄셈과 나눗셈이 든 식(답을 다시 순환소수로 나타낸다)이다.
      if (at < 2) {
        const [r, s, v] = d.until(() => {
          const r0 = at === 0 ? pickRep(d, { whole: [0, 1], f: d.int(0, 1), k: 1 }) : pickRep(d, { whole: [0, 2], f: d.int(0, 1), k: 1 }), s0 = pickRep(d, { whole: [0, 2], f: d.int(0, 1), k: d.pick([1, 1, 2]) }), base = at === 0 ? valOf(r0) : qmul(valOf(r0), valOf(r0));
          return [r0, s0, qdiv(valOf(s0), base)];
        }, ([r0, s0, w]) => w.q >= 2 && w.q <= 60 && w.p <= 99 && valOf(r0).p >= 2 && valOf(r0).q <= (at === 0 ? 30 : 9) && valOf(r0).p <= (at === 0 ? 99 : 12) && repOf(r0) !== repOf(s0));
        const vr = valOf(r), vs = valOf(s), sq = qmul(vr, vr), base = at === 0 ? vr : sq, lhs = at === 0 ? repOf(r) : `(${repOf(r)})${sup(2)}`;
        return ruled(F(`${nb(`${lhs} × ${x} = ${repOf(s)}`)}일 때, ${x}의 값을 기약분수로 나타내시오.`, v.p, v.q, {
          improper: v.p > v.q,
          explain: `${asFrac(r)}, ${asFrac(s)}이다. ${at === 0 ? '' : `${nb(`(${fq(vr)})${sup(2)} = ${fq(sq)}`)}이므로 `}${nb(`${fq(base)} × ${x} = ${fq(vs)}`)}에서 ${nb(`${x} = ${fq(vs)} ÷ ${fq(base)}`)} = ${nb(`${fq(vs)} × ${frac(base.q, base.p)} = ${fq(v)}`)}이다.`,
          facts: { value: at === 0 ? `${repJs(s)}/${repJs(r)}` : `${repJs(s)}/${repJs(r)}**2`, unseen: repUnseen(r).concat(repUnseen(s), [2]) }
        }), at === 0 ? 'hard-rep-equation-times' : 'hard-rep-equation-square');
      }
      const s = d.until(() => {
        const r0 = pickRep(d, { f: d.int(0, 1), k: 1 }), s0 = pickRep(d, { f: d.int(0, 1), k: 1 }), nn = d.pick([2, 2, 3]), h = qdiv(valOf(s0), Q(nn)), v = qsub(valOf(r0), h);
        if (v.p <= 0) return null;
        const e = expand(v.p, v.q), back = (w) => (w.p > 0 && w.q > 1 ? expand(w.p, w.q) : null);
        // 틀린 보기: 점을 잘못 찍은 것, ÷ n 을 하지 않은 것, 나눈 값을 답으로 삼은 것, 더한 것 — 저마다 순환소수로 고친 것과 그 점을 옮긴 것
        const moved = (o) => (o && o.cyc ? (o.pre ? { whole: o.whole, pre: '', cyc: o.pre + o.cyc } : o.cyc.length === 2 ? { whole: o.whole, pre: o.cyc[0], cyc: o.cyc[1] } : null) : null);
        const slips = [qsub(valOf(r0), valOf(s0)), h, { p: valOf(r0).p * h.q + h.p * valOf(r0).q, q: valOf(r0).q * h.q }].map((w) => back(Q(w.p, w.q)));
        const picked = [];
        for (const o of [moved(e)].concat(slips, slips.map(moved))) if (o && o.whole === 0 && o.cyc && shortRep(o, 2, 2) && repOf(o) !== repOf(e) && picked.length < 4 && !picked.some((t) => repOf(t) === repOf(o))) picked.push(o);
        return { r0, s0, nn, h, v, e, picked };
      }, (c) => c && c.e.whole === 0 && shortRep(c.e) && c.picked.length === 4);
      const rows = d.shuffle([s.e].concat(s.picked)), vr = valOf(s.r0), vs = valOf(s.s0), L = lcm(vr.q, s.h.q), n1 = vr.p * L / vr.q, n2 = s.h.p * L / s.h.q, js = `${repJs(s.r0)}-${repJs(s.s0)}/${s.nn}`;
      return ruled(C(`${nb(`${repOf(s.r0)} − ${x} = ${repOf(s.s0)} ÷ ${s.nn}`)}일 때, ${x}의 값을 순환소수로 나타낸 것은?`, rows.map(repOf), rows.indexOf(s.e), {
        explain: `${asFrac(s.r0)}, ${asFrac(s.s0)}이다. ${nb(`${fq(vs)} ÷ ${s.nn} = ${fq(s.h)}`)}이므로 ${nb(`${x} = ${fq(vr)} − ${fq(s.h)}`)}${vr.q === L && s.h.q === L ? '' : ` = ${nb(`${frac(n1, L)} − ${frac(n2, L)}`)}`} = ${nb(`${frac(n1 - n2, L)}${s.v.q === L ? '' : ` = ${fq(s.v)}`}`)}이다. ${s.v.p} ÷ ${s.v.q} = ${unrollOf(s.e)}이므로 ${nb(`${x} = ${repOf(s.e)}`)}이다.`,
        facts: { between: { low: `${js}-0.0000001`, high: `${js}+0.0000001`, exprs: rows.map(repJs) } }
      }), 'hard-rep-equation-minus');
    }, { count: 3 }),
    H('hard-rep-mixed', '순환소수 셋의 혼합 계산', '기본 ①69', (d) => {
      // 세 순환소수를 저마다 분수로 고치고, 나눗셈을 먼저 한 다음 더한다. 소수점 아래 숫자끼리 셈하면 틀린다.
      const table = mixedRows(), s = table[d.int(0, table.length - 1)], va = valOf(s.ra), vcq = valOf(s.rc), vbq = valOf(s.rb);
      return N(`${nb(`${a} = ${repOf(s.ra)}`)}, ${nb(`${vb} = ${repOf(s.rb)}`)}, ${nb(`${vc} = ${repOf(s.rc)}`)}일 때, ${nb(`${vc} ÷ ${a} + ${vb}`)}의 값은?`, s.up, {
        explain: `${asFrac(s.ra)}, ${asFrac(s.rb)}, ${asFrac(s.rc)}이다. ${nb(`${vc} ÷ ${a} = ${fq(vcq)} × ${frac(va.q, va.p)}`)} = ${fq(s.t)}이므로 ${nb(`${vc} ÷ ${a} + ${vb}`)} = ${nb(`${fq(s.t)} + ${fq(vbq)} = ${s.up}`)}이다.`,
        facts: { value: `${repJs(s.rc)}/${repJs(s.ra)}+${repJs(s.rb)}`, unseen: repUnseen(s.ra).concat(repUnseen(s.rb), repUnseen(s.rc)) }
      });
    }),
    H('hard-rep-unit-factor', '순환소수를 어떤 수와의 곱으로 나타낼 때 곱해진 수를 순환소수로 나타내기', '심34', (d) => {
      // 0.37̇ = 34/90 = 3.4 × 1/9, 0.5̇6̇ = 56/99 = 56 × 1/99. 틀린 보기는 소수점을 한 자리 잘못 옮긴 것이다(3.4 를 34 로, 56 을 5.6 으로 본 아이).
      //  원문은 a + b 를 물었다. 따로 구한 두 값을 더하게 하지 않고 두 값을 짝으로 고르게 했다.
      const r1 = pickRep(d, { f: 1, k: 1, ok: (v) => v.pre !== '0' && (9 * Number(v.pre) + Number(v.cyc)) % 10 !== 0 }), r2 = pickRep(d, { k: 2, ok: (v) => v.cyc[0] !== '0' && v.cyc[1] !== '0' });
      const m1 = parts(r1).A - parts(r1).B, m2 = Number(r2.cyc), dec1 = d.bool(), dec2 = d.bool(), u1 = dec1 ? `${Math.floor(m1 / 10)}.${m1 % 10}` : String(m1), u2 = dec2 ? `${r2.cyc[0]}.${r2.cyc[1]}` : String(m2);
      const A9 = { whole: 0, pre: '', cyc: '1' }, A90 = { whole: 0, pre: '0', cyc: '1' }, B99 = { whole: 0, pre: '', cyc: '01' }, B990 = { whole: 0, pre: '', cyc: '10' };
      const pairs = d.shuffle([[A9, B99], [A9, B990], [A90, B99], [A90, B990]]), right = pairs.findIndex(([p1, p2]) => p1 === (dec1 ? A9 : A90) && p2 === (dec2 ? B990 : B99));
      const js = `(${repJs(r1)})/${u1}*1000+(${repJs(r2)})/${u2}`, told = (r, m, den, u, dec, v, ans) => `${nb(`${repOf(r)} = ${frac(m, den)}`)}이고 ${dec ? nb(`${u} = ${frac(m, 10)}`) + '이므로 ' : ''}${nb(`${v} = ${frac(m, den)} ÷ ${dec ? frac(m, 10) : u}`)} = ${nb(`${fq(valOf(ans))} = ${repOf(ans)}`)}이다.`;
      return C(`${nb(`${repOf(r1)} = ${u1} × ${a}`)}, ${nb(`${repOf(r2)} = ${u2} × ${vb}`)}를 만족시키는 두 수 ${a}, ${vb}를 순환소수로 바르게 나타낸 것은?`, pairs.map(([p1, p2]) => `${nb(`${a} = ${repOf(p1)}`)}, ${nb(`${vb} = ${repOf(p2)}`)}`), right, {
        explain: `${told(r1, m1, 90, u1, dec1, a, pairs[right][0])} ${told(r2, m2, 99, u2, dec2, vb, pairs[right][1])}`,
        facts: { between: { low: `${js}-0.0001`, high: `${js}+0.0001`, exprs: pairs.map(([p1, p2]) => `${repJs(p1)}*1000+${repJs(p2)}`) } }
      });
    }),
    H('hard-rep-product-cycle', '두 순환소수의 곱을 소수로 나타낼 때의 순환마디', '심36', (d) => {
      // 분수로 고쳐서 곱한 다음 다시 나눗셈을 한다. 소수끼리 곱해서는 순환마디를 알 수 없다.
      const s = d.until(() => {
        const r1 = pickRep(d, { whole: [0, 5], f: d.int(0, 1), k: 1 }), r2 = pickRep(d, { whole: [0, 2], f: d.int(0, 1), k: 1 }), v = qmul(valOf(r1), valOf(r2));
        return { r1, r2, v, e: expand(v.p, v.q) };
      }, (c) => c.v.q <= 99 && c.v.p <= 300 && c.e.cyc.length >= 2 && c.e.cyc.length <= 3 && c.e.cyc[0] !== '0' && c.e.pre.length <= 1 && okRep(c.e.pre, c.e.cyc) && repOf(c.r1) !== repOf(c.r2));
      const { r1, r2, v, e } = s, f = e.pre.length, k = e.cyc.length;
      return N(`${nb(`${repOf(r1)} × ${repOf(r2)}`)}${lastJ(r2.cyc, '을/를')} 계산한 값을 소수로 나타낼 때, 순환마디는?`, Number(e.cyc), {
        explain: `분수로 고쳐서 계산한다. ${asFrac(r1)}, ${asFrac(r2)}이므로 ${nb(`${fq(valOf(r1))} × ${fq(valOf(r2))} = ${fq(v)}`)}이다. ${v.p} ÷ ${v.q} = ${unrollOf(e)}이므로 순환마디는 ${e.cyc}이다.`,
        facts: { calc: [[`(${v.p}*10**${f + k}-(${v.p}*10**${f + k})%${v.q})/${v.q}-((${v.p}*10**${f}-(${v.p}*10**${f})%${v.q})/${v.q})*10**${k}`, 0]], unseen: [v.p, v.q, 10, f, k, f + k] }
      });
    }),
    H('hard-rep-mistaken', '순환소수를 유한소수로 잘못 보고 계산한 것 바로잡기', '심37 / 기본 ①73', (d, at) => {
      // 2.3̇과 2.3은 다른 수이다(차는 0.0333… = 1/30). 첫째는 곱한 값의 차로 처음 수를 구하는 일차방정식, 둘째는 더한 값에서 처음 수를 구해 바르게 곱한다.
      if (at === 0) {
        const s = d.until(() => ({ w: d.int(1, 4), c0: d.int(1, 8), m: d.int(1, 9) }), (v) => (9 * v.m) % v.c0 === 0 && v.w !== v.c0 && 9 * v.m / v.c0 <= 27), xv = 9 * s.m / s.c0, r = { whole: s.w, pre: '', cyc: String(s.c0) }, t = `${s.w}.${s.c0}`, P = 9 * s.w + s.c0, T = 10 * s.w + s.c0, answer = xv * s.w + s.m;
        return ruled(N(`자연수 ${x}에 ${repJ(r, '을/를')} 곱해야 할 것을 잘못하여 ${t}${lastJ(t, '을/를')} 곱했더니 바르게 계산한 값보다 0.${s.m}만큼 작았다. 바르게 계산한 값은?`, answer, {
          explain: `${nb(`${repOf(r)} = ${frac(P, 9)}`)}, ${nb(`${t} = ${frac(T, 10)}`)}이므로 ${nb(`${frac(P, 9)}${x} − ${frac(T, 10)}${x} = ${frac(s.m, 10)}`)}이다. 양변에 90을 곱하면 ${nb(`${10 * P}${x} − ${9 * T}${x} = ${9 * s.m}`)}, ${s.c0 === 1 ? '' : nb(`${s.c0}${x} = ${9 * s.m}`) + ', '}${nb(`${x} = ${xv}`)}이다. 바르게 계산한 값은 ${nb(`${xv} × ${frac(P, 9)} = ${answer}`)}이다.`,
          facts: { calc: [[`${s.m}*9/${s.c0}*${s.w}+${s.m}`, 0]], unseen: [9] }
        }), 'hard-rep-mistaken-times');
      }
      const s = d.until(() => {
        const r = pickRep(d, { whole: [1, 3], k: d.int(1, 2), ok: (v) => !v.cyc.endsWith('0') }), t = `${r.whole}.${r.cyc}`, R = r.whole + d.int(1, 3), u = Q(R * 10 ** r.cyc.length - Number(r.whole + r.cyc), 10 ** r.cyc.length);
        return { r, t, R, u, v: qmul(u, valOf(r)) };
      }, (c) => c.v.q >= 2 && c.v.q <= 30 && c.v.p <= 60);
      const xdec = String(Number((s.R - Number(s.t)).toFixed(2)));
      return ruled(F(`어떤 수에 ${repJ(s.r, '을/를')} 곱해야 할 것을 잘못하여 ${s.t}${lastJ(s.t, '을/를')} 더했더니 ${s.R}${tail(s.R, '이/가')} 되었다. 바르게 계산한 값을 기약분수로 나타내시오.`, s.v.p, s.v.q, {
        improper: s.v.p > s.v.q,
        explain: `어떤 수는 ${nb(`${s.R} − ${s.t} = ${xdec}`)}이다. ${asFrac(s.r)}이므로 바르게 계산한 값은 ${nb(`${xdec} × ${fq(valOf(s.r))}`)} = ${nb(`${fq(s.u)} × ${fq(valOf(s.r))} = ${fq(s.v)}`)}이다.`,
        facts: { value: `(${s.R}-${s.t})*${repJs(s.r)}`, unseen: repUnseen(s.r) }
      }), 'hard-rep-mistaken-plus');
    }, { count: 2 }),
    H('hard-swap-sum-diff', '자리를 바꾼 두 순환소수의 합과 차', '심39', (d, at) => {
      // 0.ȧḃ = (10a + b)/99 이므로 합은 (a + b)/9, 차는 (큰 수 − 작은 수)/11 이다. 첫째는 합을 주고 차를, 둘째는 차를 주고 합을 묻는다.
      //  두 수가 하나로 정해지게 범위를 준다(한 자리 자연수이거나 2, 3, 5, 7 가운데 두 수).
      const PRIMES = '2, 3, 5, 7 가운데 서로 다른 두 수', digits = (set, lo, hi) => (set === 'prime' ? `${PRIMES} ${a}, ${vb} (${nb(`${lo}${LT}${hi}`)})` : `${nb(`${lo}${LT}${hi}`)}인 두 한 자리 자연수 ${a}, ${vb}`);
      const AB = repL('0.', [a, vb], 'ab'), BA = repL('0.', [vb, a], 'ba'), ninths = (v) => (v < 9 ? rep('0.', String(v)) : rep('1.', String(v - 9))), elevenths = (v) => rep('0.', String(9 * v).padStart(2, '0'));
      const fab = frac(`10${a} + ${vb}`, 99), fba = frac(`10${vb} + ${a}`, 99);
      if (at === 0) {
        const [set, da, db] = d.pick([['nat', 1, 2], ['nat', 1, 3], ['nat', 7, 9], ['nat', 8, 9], ['prime', 2, 3], ['prime', 2, 5], ['prime', 3, 5], ['prime', 3, 7], ['prime', 5, 7]]), sum = da + db, gap = db - da, rows = [1, 2, 3, 4, 5];
        return ruled(C(`${digits(set, a, vb)}에 대하여 ${nb(`${AB} + ${BA} = ${ninths(sum)}`)}일 때, ${nb(`${BA} − ${AB}`)}를 순환소수로 나타낸 것은?`, rows.map(elevenths), rows.indexOf(gap), {
          explain: `${nb(`${AB} = ${fab}`)}, ${nb(`${BA} = ${fba}`)}이므로 ${nb(`${AB} + ${BA}`)} = ${nb(`${frac(`11${a} + 11${vb}`, 99)} = ${frac(`${a} + ${vb}`, 9)}`)}이다. ${nb(`${ninths(sum)} = ${frac(sum, 9)}`)}이므로 ${nb(`${a} + ${vb} = ${sum}`)}이고, ${set === 'prime' ? '2, 3, 5, 7 가운데 합이' : `${nb(`${a}${LT}${vb}`)}인 한 자리 자연수 가운데 합이`} ${sum}인 두 수는 ${nb(`${a} = ${da}`)}, ${nb(`${vb} = ${db}`)}뿐이다. ${nb(`${BA} − ${AB}`)} = ${nb(`${frac(10 * db + da, 99)} − ${frac(10 * da + db, 99)}`)} = ${nb(`${frac(9 * gap, 99)} = ${elevenths(gap)}`)}이다.`,
          facts: { between: { low: `(10*${db}+${da})/99-(10*${da}+${db})/99-0.0000001`, high: `(10*${db}+${da})/99-(10*${da}+${db})/99+0.0000001`, exprs: rows.map((v) => `${9 * v}/99`) } }
        }), 'hard-swap-sum-given');
      }
      const [set, da, db] = d.pick([['prime', 3, 2], ['prime', 5, 2], ['prime', 7, 3], ['nat', 9, 1]]), gap = da - db, sum = da + db, rows = [5, 7, 8, 10, 12];
      return ruled(C(`${digits(set, vb, a)}에 대하여 ${nb(`${AB} − ${BA} = ${elevenths(gap)}`)}일 때, ${nb(`${AB} + ${BA}`)}를 순환소수로 나타낸 것은?`, rows.map(ninths), rows.indexOf(sum), {
        explain: `${nb(`${AB} = ${fab}`)}, ${nb(`${BA} = ${fba}`)}이므로 ${nb(`${AB} − ${BA}`)} = ${nb(`${frac(`9${a} − 9${vb}`, 99)} = ${frac(`${a} − ${vb}`, 11)}`)}이다. ${nb(`${elevenths(gap)} = ${frac(9 * gap, 99)} = ${frac(gap, 11)}`)}이므로 ${nb(`${a} − ${vb} = ${gap}`)}이고, ${set === 'prime' ? '2, 3, 5, 7 가운데 차가' : '한 자리 자연수 가운데 차가'} ${gap}인 두 수는 ${nb(`${a} = ${da}`)}, ${nb(`${vb} = ${db}`)}뿐이다. ${nb(`${AB} + ${BA}`)} = ${nb(`${frac(10 * da + db, 99)} + ${frac(10 * db + da, 99)}`)} = ${nb(`${frac(11 * sum, 99)} = ${frac(sum, 9)} = ${ninths(sum)}`)}이다.`,
        facts: { between: { low: `(10*${da}+${db})/99+(10*${db}+${da})/99-0.0000001`, high: `(10*${da}+${db})/99+(10*${db}+${da})/99+0.0000001`, exprs: rows.map((v) => `${v}/9`) } }
      }), 'hard-swap-diff-given');
    }, { count: 2 }),
    H('hard-rep-square-digits', '순환소수의 제곱과 곱이 같아지게 하는 숫자 찾기', '심40', (d) => {
      // 순환하지 않는 0의 수만큼 분모에 0이 붙는다(0.ȧ = a/9, 0.0ḃ = b/90, 0.00ċ = c/900). 분모가 같아져 b² = ac 가 남고, 조건에 맞는 세 수를 모두 찾는다.
      //  순환마디가 9인 수(0.009̇)가 나오지 않게 8 이하의 수만 묻는다. 틀린 보기: 한 짝만 찾은 것, 9를 넣은 것(4, 6, 9), 범위 밖의 1을 넣은 것(1, 2, 4).
      const wide = d.bool(), [zb, za, zc] = d.pick([[1, 0, 2], [0, 0, 0], [1, 1, 1]]), z0 = (k) => '0.' + '0'.repeat(k), den = (k) => 9 * 10 ** k;
      const lo = wide ? 1 : 2, hits = [];
      for (let p = lo; p <= 8; p += 1) for (let q2 = p + 1; q2 <= 8; q2 += 1) for (let r2 = q2 + 1; r2 <= 8; r2 += 1) if (q2 * q2 === p * r2) hits.push([p, q2, r2]);
      const right = hits.map((t) => t[1]).join(', '), rows = d.shuffle(['2', '4', '2, 4', '4, 6', '2, 4, 6']);
      const RB = repL(z0(zb), [vb], 'b'), RA = repL(z0(za), [a], 'a'), RC = repL(z0(zc), [vc], 'c');
      return C(`${wide ? '8 이하의' : '1보다 크고 9보다 작은'} 세 자연수 ${a}, ${vb}, ${vc}가 ${nb(`${a}${LT}${vb}${LT}${vc}`)}이고 ${nb(`(${RB})${sup(2)} = ${RA} × ${RC}`)}를 만족시킬 때, ${vb}의 값이 될 수 있는 수를 모두 고른 것은?`, rows, rows.indexOf(right), {
        explain: `${nb(`${RA} = ${frac(a, den(za))}`)}, ${nb(`${RB} = ${frac(vb, den(zb))}`)}, ${nb(`${RC} = ${frac(vc, den(zc))}`)}이다. ${nb(`${frac(vb + sup(2), den(zb) ** 2)} = ${frac(a + vc, den(za) * den(zc))}`)}이므로 ${nb(`${vb}${sup(2)} = ${a}${vc}`)}이다. 조건에 맞는 세 수 (${a}, ${vb}, ${vc})는 ${hits.map((t) => `(${t.join(', ')})`).join(', ')}${hits.length === 1 ? '뿐이므로' : '이므로'} ${vb}의 값이 될 수 있는 수는 ${right}이다.`,
        facts: { truth: rows.map((v) => v === right), want: true }
      });
    }),
    H('hard-nines-max', '9…9를 곱한 값이 자연수가 되는 순환소수에서 그 값의 최댓값', '심41', (d) => {
      // 10000z − z = 9999z 이고 9999 = 9 × 1111 이므로 9y/x 가 남는다. 기약분수라는 조건에서 x 와 y 가 서로소이므로 x 는 9의 약수이다.
      const [R, T] = d.pick([[11, 100], [111, 1000], [1111, 10000]]), bound = d.pick([10, 8, 6]), expr = nb(`${T}${vz} − ${vz}`);
      let answer = 0, ymax = 0;
      for (let p = 2; p < bound; p += 1) for (let q2 = 2; q2 < bound; q2 += 1) if (gcd(q2, p * R) === 1 && ((T - 1) * q2) % (p * R) === 0 && (T - 1) * q2 / (p * R) > answer) { answer = (T - 1) * q2 / (p * R); ymax = q2; }
      return N(`기약분수 ${frac(vy, par(`${x} × ${R}`))}를 소수로 나타낸 순환소수를 ${vz}라 할 때, ${expr}의 값은 자연수이다. ${expr}의 값 가운데 가장 큰 수는? (단, ${x}, ${vy}는 1보다 크고 ${bound}보다 작은 자연수이다.)`, answer, {
        explain: `${nb(`${T}${vz} − ${vz} = ${T - 1}${vz}`)}이고 ${nb(`${T - 1} = 9 × ${R}`)}이므로 ${nb(`${T - 1}${vz} = ${frac(`9${vy}`, x)}`)}이다. 기약분수이므로 ${x}와 ${vy}는 서로소이고, ${frac(`9${vy}`, x)}가 자연수이려면 ${x}는 9의 약수이어야 한다. ${bound > 9 ? `${nb(`${x} = 9`)}이면 값은 ${vy}이고 ${bound - 2} 이하이다. ` : ''}${nb(`${x} = 3`)}이면 값은 3${vy}이고, ${vy}는 3의 배수가 아닌 수 가운데 가장 큰 ${ymax}일 때 ${nb(`3 × ${ymax} = ${answer}`)}이다. 가장 큰 수는 ${answer}이다.`,
        facts: { calc: [[`3*${ymax}`, 0]], unseen: [3, ymax] }
      });
    }),
    H('hard-rep-square', '순환소수에 곱하여 어떤 자연수의 제곱이 되게 하는 가장 작은 자연수', '심44', (d) => {
      // 기약분수로 고친 분모를 곱해 지우고(자연수가 된다), 분자에서 지수가 홀수인 소인수를 한 번 더 곱한다(중1 소인수분해).
      const s = d.until(() => { const r = pickRep(d, { whole: [0, 4], f: d.int(0, 1), k: d.int(1, 2) }), v = valOf(r), odd = oddPart(v.p); return { r, v, odd, extra: odd.reduce((t, p) => t * p, 1) }; }, (c) => c.v.q <= 45 && c.v.q < repDen(c.r) && c.v.q * c.extra <= 200 && c.v.p >= 2 && c.v.p <= 99);
      const { r, v, odd, extra } = s, { A, B: Bn, den } = parts(r), answer = v.q * extra, root = Math.round(Math.sqrt(v.p * extra));
      return N(`순환소수 ${repOf(r)}에 자연수를 곱하여 어떤 자연수의 제곱이 되게 하려고 한다. 곱할 수 있는 가장 작은 자연수는?`, answer, {
        explain: `${asFrac(r)}이다. 자연수가 되려면 분모 ${v.q}의 배수를 곱해야 하고, ${v.q}${tail(v.q, '을/를')} 곱하면 ${v.p}${tail(v.p, '이/가')} 된다. ${extra === 1 ? `${nb(`${v.p} = ${root}${sup(2)}`)}이므로 가장 작은 자연수는 ${answer}이다.` : `${fz(v.p).length === 1 && fz(v.p)[0][1] === 1 ? '' : eqn(v.p) + '에서 '}지수가 홀수인 소인수 ${odd.join(', ')}${tail(odd[odd.length - 1], '을/를')} 한 번 더 곱하면 ${nb(`${v.p} × ${extra} = ${root}${sup(2)}`)}이 된다. 가장 작은 자연수는 ${nb(`${v.q} × ${extra} = ${answer}`)}이다.`}`,
        facts: { digit: { template: `((${A - Bn})*□/${den})**0.5%1+((${A - Bn})*□)%${den}<0.000001`, lo: 1, hi: answer + 30, ask: 'min' } }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
