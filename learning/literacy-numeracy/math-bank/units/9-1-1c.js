// 중학교 3학년 1학기 1단원 제곱근과 실수 — 실력 문제.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - √(a²) = a 라고만 외워 a 가 음수일 때도 a 로 둔다(√(a²) = |a|). 문자의 부호를 조건(xy < 0, ab < 0)에서 먼저 정하지 않는다.
//  - √9의 양의 제곱근을 3으로 본다(√9 = 3 의 양의 제곱근은 √3).
//  - 「자연수가 되게 하는」을 「1보다 큰 자연수」와 가리지 않는다. 근호 안의 수가 1이 되는 경우를 빠뜨리거나 넣는다.
//  - 무리수끼리 더하거나 곱하면 언제나 무리수라고 본다(√2 + (−√2) = 0, √2 × √2 = 2). 0을 곱하면 유리수라는 것을 잊는다.
//  - 소수 부분은 0 이상 1 미만이고, 음수의 올림(−0.6의 올림은 0)을 −1로 잘못 잡는다.
//  - 1보다 작은 양수는 제곱하면 작아지고 제곱근은 커진다는 것을 거꾸로 생각한다.
// 실력에 둔 잣대(새 단원 안내 그대로): ① 배운 뜻을 정확히 대야 풀리는 문제 ② 세 단계 넘게 이어 생각해야 풀리는 문제. 두 단계를 잇는 것, 거꾸로 한 번 구하는 것은 기본에 두었다.
// 9-1-2의 셈(근호 밖으로 꺼내기, 근호끼리의 곱셈·덧셈, 분모의 유리화)이 필요한 원문은 그 셈이 필요 없는 꼴로 바꾸었다(심7 √240/√a → √(240/a), 심19의 2√2 → √r, 심28의 x₁ + x₂ + x₃ → x₁₀ 한 항, 심12·심10의 뜻 없는 b² − a·a² + b → b/a·a와 b).
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, numbers, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, GT, LT, range, gcd, Q, tx, nb, tail, V, sup, claimQ, rep, poly } = B.kit.mid;
  const { rt, rq, STD7, STD8, STD9, RT, U5, R, neg, sq, par, isSquare, squareFree, num, rad, sText, sVal, abcAns, ABC_NOTE } = B.kit.m911;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const nonSq = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => !isSquare(v));
  const divisors = (n) => range(1, n).filter((k) => n % k === 0);
  const x = V('x'), y = V('y'), a = V('a'), b = V('b'), c = V('c');
  const key = (e) => e.join(',');
  // 식 [x의 계수, y의 계수, 상수항]을 적은 글
  const lin3 = ([A, Bc, K]) => poly([[A, x], [Bc, y], [K, '']]);
  // 맞는 식과 부호를 거꾸로 잡은 식들 가운데 서로 다른 다섯
  const fiveOf = (d, right, pool) => { const out = [right]; for (const e of pool) if (!out.some((o) => key(o) === key(e))) out.push(e); return d.shuffle(out.slice(0, 5)); };

  B.addGroup('9-1-1', {
    id: 'hard', title: '실력 문제', standard: STD7,
    types: [
      // ── ① 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-sign2', '두 문자의 부호 조건으로 √(x²) 들을 간단히 하기', '심2', (d) => {
        // xy < 0 이고 x < y 이면 x < 0 < y 이다. √(x²) = −x, √(y²) = y, √((x − y)²) = −(x − y). 틀린 보기는 부호를 거꾸로 잡은 것들이다.
        const xNeg = d.bool(), cond = xNeg ? `${x} ${LT} ${y}, ${x}${y} ${LT} 0` : `${x} ${GT} ${y}, ${x}${y} ${LT} 0`, sx = xNeg ? -1 : 1, sy = -sx;
        // 항: √(x²) → [sx, 0, 0], √(y²) → [0, sy, 0], √((x − y)²) → sign(x − y) = sx 이므로 [sx, −sx, 0]
        const T3 = [{ h: rt(sq(x)), v: [sx, 0, 0] }, { h: rt(sq(y)), v: [0, sy, 0] }, { h: rt(sq(par(`${x} ${MINUS} ${y}`))), v: [sx, -sx, 0] }];
        const signs = [1].concat([d.pick([1, -1]), d.pick([1, -1])]), order = d.shuffle([0, 1, 2]);
        const total = (flip) => order.reduce((acc, ti, i) => acc.map((v, j) => v + signs[i] * (flip[i] ? -1 : 1) * T3[ti].v[j]), [0, 0, 0]);
        const right = total([0, 0, 0]), pool = []; for (let m = 1; m < 8; m += 1) pool.push(total([m & 1, m & 2, m & 4].map(Boolean)));
        const rows = fiveOf(d, right, pool.concat([right.map((v) => -v)]));
        const expr = order.map((ti, i) => (i ? ` ${signs[i] > 0 ? '+' : MINUS} ` : '') + T3[ti].h).join('');
        return C(`${cond}일 때, ${expr}을 간단히 하면?`, rows.map(lin3), rows.findIndex((r) => key(r) === key(right)), {
          explain: `${x}${y} ${LT} 0이므로 ${x}, ${y}의 부호가 다르고, ${xNeg ? `${x} ${LT} ${y}이므로 ${x} ${LT} 0 ${LT} ${y}` : `${x} ${GT} ${y}이므로 ${y} ${LT} 0 ${LT} ${x}`}이다. ${x} ${MINUS} ${y} ${xNeg ? LT : GT} 0이므로 ${rt(sq(x))} = ${xNeg ? MINUS + x : x}, ${rt(sq(y))} = ${xNeg ? y : MINUS + y}, ${rt(sq(par(`${x} ${MINUS} ${y}`)))} = ${xNeg ? `${MINUS}(${x} ${MINUS} ${y})` : `${x} ${MINUS} ${y}`}이다. 따라서 주어진 식은 ${lin3(right)}이다.`,
          facts: { truth: rows.map((r) => key(r) === key(right)), want: true }
        });
      }),
      H('hard-define', '√(a²)으로 정한 문자를 다시 넣어 간단히 하기', '심3', (d) => {
        // b = √((−a)²) = |a|, c = −√(k²b²) = −k|b| = −k|a|. a 의 부호로 |a| 를 푼다.
        const [s, k, e2, e3] = d.until(() => [d.pick([1, -1]), d.int(2, 4), d.pick([1, -1]), d.pick([1, -1])], ([s1, k1, f2, f3]) => Math.abs(1 + f2 * s1 - f3 * k1 * s1) >= 2);
        const coef = 1 + e2 * s + e3 * (-k * s);
        const cond = `${a} ${s > 0 ? GT : LT} 0`, kk = k * k;
        return inline(`${cond}이고 ${b} = ${rt(sq(par(MINUS + a)))}, ${c} = ${MINUS}${rt(kk + b + sup(2))}일 때, ${a} ${e2 > 0 ? '+' : MINUS} ${b} ${e3 > 0 ? '+' : MINUS} ${c}를 간단히 하면?`, '{0}' + a, [{ answer: coef, signed: true }], {
          shown: (coef < 0 ? MINUS : '') + Math.abs(coef) + a,
          explain: `${cond}이므로 ${MINUS}${a} ${s > 0 ? LT : GT} 0이고 ${b} = |${MINUS}${a}| = ${s > 0 ? a : MINUS + a}이다. ${b} ${GT} 0이므로 ${c} = ${MINUS}${rt(sq(par(k + b)))} = ${MINUS}${k}${b} = ${s > 0 ? MINUS + k + a : k + a}이다. 따라서 ${a} ${e2 > 0 ? '+' : MINUS} ${b} ${e3 > 0 ? '+' : MINUS} ${c} = ${(coef < 0 ? MINUS : '') + Math.abs(coef) + a}이다.`,
          facts: { calc: [[`1+(${e2 * s})+(${-e3 * k * s})`, 0]], unseen: [1, k, e2 * s, e3 * k * s].map(Math.abs) }
        });
      }),
      H('hard-product', '곱의 부호로 √(b²c²) 간단히 하기', '심4', (d) => {
        // ab < 0, ac < 0 이면 b 와 c 는 모두 a 와 반대 부호라 bc > 0 이다. ab, ac 의 부호가 다르면 bc < 0 이다.
        const s1 = d.pick([1, -1]), s2 = d.pick([1, -1]), pos = s1 === s2, w = (s) => (s > 0 ? GT : LT);
        const right = pos ? `${b}${c}` : `${MINUS}${b}${c}`, opts = d.shuffle([`${b}${c}`, `${MINUS}${b}${c}`, `(${b}${c})${sup(2)}`, `${b}${sup(2)}${c}`, `${b}${c}${sup(2)}`]);
        return C(`${a}${b} ${w(s1)} 0, ${a}${c} ${w(s2)} 0일 때, ${rt(`${b}${sup(2)}${c}${sup(2)}`)}을 근호를 사용하지 않고 나타내면?`, opts, opts.indexOf(right), {
          explain: `${rt(`${b}${sup(2)}${c}${sup(2)}`)} = ${rt(sq(par(b + c)))} = |${b}${c}|이다. ${a}${b}와 ${a}${c}의 부호가 ${pos ? '같으므로' : '다르므로'} ${b}와 ${c}의 부호가 ${pos ? '같고' : '다르고'}, ${b}${c} ${pos ? GT : LT} 0이다. 따라서 ${right}이다.`,
          facts: { truth: opts.map((o) => o === right), want: true }
        });
      }),
      H('hard-negroot', '(√(−x))²이 섞인 식 간단히 하기', '심5', (d) => {
        // x − y < 0, xy < 0 이면 x < 0 < y. (√(−x))² = −x(−x > 0), √((y − x)²) = y − x, √((k − x + y)²) = k − x + y (k − x + y > 0)
        const k = d.int(1, 4), s2 = d.pick([1, -1]), s3 = d.pick([1, -1]);
        const T3 = [{ h: sq(par(rt(MINUS + x))), v: [-1, 0, 0], told: `${sq(par(rt(MINUS + x)))} = ${MINUS}${x}` }, { h: rt(sq(par(`${y} ${MINUS} ${x}`))), v: [-1, 1, 0], told: `${rt(sq(par(`${y} ${MINUS} ${x}`)))} = ${y} ${MINUS} ${x}` }, { h: rt(sq(par(`${k} ${MINUS} ${x} + ${y}`))), v: [-1, 1, k], told: `${rt(sq(par(`${k} ${MINUS} ${x} + ${y}`)))} = ${k} ${MINUS} ${x} + ${y}` }];
        const sg = [1, s2, s3], total = (flip) => T3.reduce((acc, t, i) => acc.map((v, j) => v + sg[i] * (flip[i] ? -1 : 1) * t.v[j]), [0, 0, 0]);
        const right = total([false, false, false]), pool = []; for (let m = 1; m < 8; m += 1) pool.push(total([m & 1, m & 2, m & 4].map(Boolean)));
        const rows = fiveOf(d, right, pool.concat([right.map((v, i) => (i === 2 ? v + 1 : v))]));
        const expr = T3.map((t, i) => (i ? ` ${sg[i] > 0 ? '+' : MINUS} ` : '') + t.h).join('');
        return C(`${x} ${MINUS} ${y} ${LT} 0, ${x}${y} ${LT} 0일 때, ${expr}을 간단히 하면?`, rows.map(lin3), rows.findIndex((r) => key(r) === key(right)), {
          explain: `${x}${y} ${LT} 0, ${x} ${LT} ${y}이므로 ${x} ${LT} 0 ${LT} ${y}이다. ${MINUS}${x} ${GT} 0, ${y} ${MINUS} ${x} ${GT} 0, ${k} ${MINUS} ${x} + ${y} ${GT} 0이므로 ${T3.map((t) => t.told).join(', ')}이다. 따라서 주어진 식은 ${lin3(right)}이다.`,
          facts: { truth: rows.map((r) => key(r) === key(right)), want: true }
        });
      }),
      H('hard-gt1', '√(k/a)가 1보다 큰 자연수가 되는 a의 개수', '심7', (d) => {
        // k/a 가 1이 아닌 제곱인 수가 되어야 한다. a = k 이면 √1 = 1 이라 「1보다 큰」에 들지 않는다.
        const [s, t] = d.pick([[4, 15], [12, 5], [12, 3], [6, 5], [10, 3], [14, 3], [4, 6], [6, 7], [8, 3]]), K = s * s * t;
        const as = divisors(s).filter((m) => m < s).map((m) => t * m * m).sort((p, q) => p - q);
        return N(`${rq(K, a)}${tail(K, '이/가')} 1보다 큰 자연수가 되게 하는 자연수 ${a}는 모두 몇 개인가?`, as.length, {
          unit: '개', explain: `${K} = ${s}${sup(2)} × ${t}이므로 ${frac(K, a)}${tail(K, '이/가')} 제곱인 수가 되려면 ${a} = ${t} × ${V('m')}${sup(2)}(${V('m')}은 ${s}의 약수) 꼴이다. ${a} = ${K}이면 ${rq(K, K)} = 1이므로 뺀다. 따라서 ${a} = ${as.join(', ')}의 ${as.length}개이다.`,
          facts: { digit: { template: `(${K}/□)${RT}%1<0.000001<${K}/□-1`, lo: 1, hi: K, ask: 'count' } }
        });
      }),
      H('hard-sumnat', '근호 둘의 합이 자연수가 되는 자연수 찾기', '심10', (d) => {
        // √(ka) + √b = m 에서 a, b 가 자연수이면 √(ka), √b 는 모두 자연수여야 한다. √(ka) 가 자연수이려면 a = k × (제곱수).
        const k = d.pick([3, 5, 6, 7]), m = d.until(() => d.int(k + 1, 2 * k), (v) => v - k >= 1);
        const A = k, Bv = (m - k) ** 2;
        return M(`${rt(k + a)} + ${rt(b)} = ${josa(m, '을/를')} 만족시키는 자연수 ${a}, ${b}를 차례로 구하시오.`, [{ answer: A, label: a }, { answer: Bv, label: b }], {
          shown: `${a} = ${A}, ${b} = ${Bv}`,
          explain: `${a}, ${b}가 자연수이므로 ${rt(k + a)}와 ${rt(b)}가 모두 자연수여야 한다(한쪽이 무리수이면 합이 자연수가 될 수 없다). ${rt(k + a)}가 자연수이려면 ${a} = ${k} × (자연수)${sup(2)}이고 ${rt(k + a)}는 ${k}의 배수이다. ${rt(k + a)} ${LT} ${m}이므로 ${rt(k + a)} = ${k}, ${a} = ${k}이고, ${rt(b)} = ${m - k}, ${b} = ${Bv}이다.`,
          facts: { calc: [[`${k}*${k}/${k}`, 0], [`(${m}-${k})*(${m}-${k})`, 1]] }
        });
      }),
      H('hard-always', '유리수와 무리수의 식이 항상 무리수인가', '심16', (d) => {
        // 유리수 a 는 0일 수 있다(0 × 무리수 = 0). 무리수 b, c 는 b = c 이거나 b = −c 일 수 있다.
        const always = [[`${a} + ${b}`, ''], [`${b} ${MINUS} ${a}`, ''], [`${a} ${MINUS} ${c}`, ''], [`${c} + ${a}`, '']];
        const not = [[`${a}${b}`, `${a} = 0이면 0`], [`${b} ÷ ${c}`, `${b} = ${c}이면 1`], [`${b} ${MINUS} ${c}`, `${b} = ${c}이면 0`], [`${b}${c}`, `${b} = ${c} = ${R(2)}이면 2`], [`${b} + ${c}`, `${c} = ${MINUS}${b}이면 0`], [`${b}${sup(2)}`, `${b} = ${R(2)}이면 2`]];
        const wantAlways = d.bool(), pick = wantAlways ? [d.pick(always)].concat(d.shuffle(not).slice(0, 4)) : [d.pick(not)].concat(d.shuffle(always).slice(0, 4));
        const rows = d.shuffle(pick.map((r) => ({ h: r[0], ok: !r[1], why: r[1] })));
        const at2 = rows.findIndex((r) => r.ok === wantAlways);
        return C(`${a}가 유리수이고 ${b}, ${c}가 무리수일 때, 다음 중 ${wantAlways ? '항상 무리수인 것은' : '항상 무리수라고 할 수 없는 것은'}?`, rows.map((r) => r.h), at2, {
          explain: `유리수와 무리수의 합·차는 항상 무리수이다. 그러나 ${rows.filter((r) => !r.ok).map((r) => `${r.h}${/<\/sup>$/.test(r.h) ? '은' : '는'} ${r.why}`).join(', ')}이므로 항상 무리수라고 할 수 없다.`,
          facts: { truth: rows.map((r) => r.ok === wantAlways), want: true }
        });
      }, { standard: STD8 }),
      H('hard-exist', '곱·합이 정해진 수가 있는가', '심17', (d) => {
        const yes = [`무리수 ${x}에 대하여 ${x}${y} = 1을 만족시키는 무리수 ${y}가 있다.`, '두 무리수의 합이 유리수가 되는 경우가 있다.', '두 무리수의 곱이 유리수가 되는 경우가 있다.', `0이 아닌 유리수 ${x}에 대하여 ${x}${y} = 2를 만족시키는 유리수 ${y}가 있다.`];
        const no = [
          [`모든 유리수 ${x}에 대하여 ${x}${y} = 2를 만족시키는 유리수 ${y}가 있다.`, `${x} = 0이면 ${x}${y} = 0이므로 그런 ${y}가 없다.`, ''],
          [`${x} + ${y} ${MINUS} ${R(3)} = 0을 만족시키는 유리수 ${x}, ${y}가 있다.`, `유리수끼리 더하면 유리수이므로 ${x} + ${y} = ${R(3)}이 될 수 없다.`, ''],
          ['두 무리수의 합은 항상 무리수이다.', `${R(2)} + (${MINUS}${R(2)}) = 0처럼 유리수가 될 수 있다.`, yes[1]],
          ['두 무리수의 곱은 항상 무리수이다.', `${R(2)} × ${R(2)} = 2처럼 유리수가 될 수 있다.`, yes[2]],
          [`무리수 ${x}에 대하여 ${x}${y} = 1을 만족시키는 무리수 ${y}는 없다.`, `${y} = ${frac(1, x)}도 무리수이고 ${x}${y} = 1이다.`, yes[0]]
        ];
        const want = d.bool();
        return claimQ(d, `다음 설명 가운데 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
      }, { standard: STD8 }),
      H('hard-ceil', '올림 기호로 만든 수의 나열', '심28', (d) => {
        // <x> 는 x 보다 작지 않은 가장 작은 정수(올림). −1 < x < 0 이면 <x> = 0 이다.
        const k = d.until(() => d.int(2, 30), (v) => squareFree(v)), m0 = Math.ceil(Math.sqrt(k)), nth = d.pick([3, 5, 10, 20]);
        const o = (t) => `&lt;${t}&gt;`;
        return abcAns(`실수 ${x}보다 작지 않은 가장 작은 정수를 ${o(x)}로 나타낸다. ${V('x')}<sub>1</sub> = ${R(k)} + ${o(R(k))}, ${V('x')}<sub>${V('n')} + 1</sub> = ${V('x')}<sub>${V('n')}</sub> ${MINUS} ${o(V('x') + '<sub>' + V('n') + '</sub>')} (${V('n')} = 1, 2, 3, …)일 때, ${V('x')}<sub>${nth}</sub>의 값은? ${ABC_NOTE}`, -m0, 1, k, {
          explain: `${m0 - 1} ${LT} ${R(k)} ${LT} ${m0}이므로 ${o(R(k))} = ${m0}, ${V('x')}<sub>1</sub> = ${R(k)} + ${m0}이다. ${2 * m0 - 1} ${LT} ${V('x')}<sub>1</sub> ${LT} ${2 * m0}이므로 ${V('x')}<sub>2</sub> = ${R(k)} + ${m0} ${MINUS} ${2 * m0} = ${R(k)} ${MINUS} ${m0}이다. ${MINUS}1 ${LT} ${R(k)} ${MINUS} ${m0} ${LT} 0이므로 그 올림은 0이고, ${V('x')}<sub>3</sub> = ${V('x')}<sub>2</sub>이다. 그 뒤로도 같으므로 ${V('x')}<sub>${nth}</sub> = ${R(k)} ${MINUS} ${m0}이다.`,
          facts: { calc: [[`(${k}${RT}-${k}${RT}%1)-(${k}${RT}-${k}${RT}%1)*2-1`, 0], ['1', 1], [String(k), 2]], unseen: U5.concat([1, 2]) }
        });
      }),
      H('hard-xy', '소수 부분과 x² + y² = k 로 정수 부분 찾기', '심26', (d) => {
        // 소수 부분 y 는 0 ≤ y < 1 이므로 0 ≤ y² < 1, k − 1 < x² ≤ k. x 가 √k 와 같은 정수 부분을 갖는지 따진다.
        const n = d.int(2, 7), K = n * n + d.int(1, 2 * n);
        return N(`양의 실수 ${x}의 소수 부분을 ${y}라 하면 ${x}${sup(2)} + ${y}${sup(2)} = ${K}이다. ${x}의 정수 부분은?`, n, {
          explain: `0 ≤ ${y} ${LT} 1이므로 0 ≤ ${y}${sup(2)} ${LT} 1이고 ${K - 1} ${LT} ${x}${sup(2)} ≤ ${K}이다. ${n}${sup(2)} = ${n * n} ≤ ${K - 1}, ${K} ${LT} ${(n + 1) * (n + 1)} = ${n + 1}${sup(2)}이므로 ${n} ${LT} ${x} ${LT} ${n + 1}, 곧 ${x}의 정수 부분은 ${n}이다.`,
          facts: { digit: { template: `□*□<${K}<(□+1)*(□+1)`, lo: 1, hi: K, ask: 'min' } }
        });
      }),
      H('hard-unit', '0 < x < 1 일 때 √x, x, x², 1/x 의 크기', '①47', (d) => {
        // 0 < x < 1 이면 x² < x < √x < 1 < 1/√x < 1/x. x > 1 이면 차례가 거꾸로이다.
        const small = d.bool(), sample = small ? 0.25 : 4, cond = small ? `0 ${LT} ${x} ${LT} 1` : `${x} ${GT} 1`;
        const pool = [{ h: rt(x), v: Math.sqrt(sample) }, { h: x, v: sample }, { h: x + sup(2), v: sample * sample }, { h: frac(1, x), v: 1 / sample }, { h: frac(1, rt(x)), v: 1 / Math.sqrt(sample) }];
        const four = d.shuffle(pool).slice(0, 4), right = four.slice().sort((p, q) => q.v - p.v);
        const all = []; const walk = (left, done) => { if (!left.length) { all.push(done); return; } left.forEach((r, i) => walk(left.filter((_, j) => j !== i), done.concat([r]))); }; walk(four, []);
        // 틀린 차례는 맞는 차례에서 두 자리를 바꾼 것(아슬아슬하게 다른 것)을 먼저 쓴다.
        const sig = (pm) => pm.map((r) => r.h).join(), swaps = all.filter((pm) => sig(pm) !== sig(right)).sort((p, q) => p.filter((r, i) => r !== right[i]).length - q.filter((r, i) => r !== right[i]).length);
        const list = d.shuffle([right].concat(d.shuffle(swaps.slice(0, 6)).slice(0, 4))), at2 = list.findIndex((pm) => sig(pm) === sig(right));
        return C(`${cond}일 때, 다음 수를 큰 것부터 차례로 바르게 늘어놓은 것은?`, list.map((pm) => pm.map((r) => r.h).join(` ${GT} `)), at2, {
          figure: numbers(four.map((r) => r.h)),
          explain: `${small ? `0 ${LT} ${x} ${LT} 1이면 제곱하면 작아지고(${x}${sup(2)} ${LT} ${x}), 제곱근은 커지며(${x} ${LT} ${rt(x)}), 역수는 1보다 크다` : `${x} ${GT} 1이면 제곱하면 커지고(${x}${sup(2)} ${GT} ${x}), 제곱근은 작아지며(${rt(x)} ${LT} ${x}), 역수는 1보다 작다`}. 예를 들어 ${x} = ${small ? frac(1, 4) : 4}이면 ${pool.map((r) => `${r.h} = ${Number.isInteger(r.v) ? r.v : r.v === 0.0625 ? frac(1, 16) : r.v === 0.5 ? frac(1, 2) : r.v === 0.25 ? frac(1, 4) : r.v}`).join(', ')}이다. 따라서 ${right.map((r) => r.h).join(` ${GT} `)}이다.`,
          facts: { truth: list.map((_, i) => i === at2), want: true }
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-intcount', '√(k/x)가 자연수가 되는 x의 개수', '심8', (d) => {
        // k = s² × t(t 는 제곱인 수를 인수로 갖지 않는다)이면 x = t × m²(m 은 s 의 약수)이다. 개수는 s 의 약수의 개수
        const [s, t] = d.until(() => [d.pick([12, 18, 20, 24, 30, 36]), d.pick([2, 3, 5, 6, 7])], ([p, q]) => p * p * q <= 5000 && squareFree(q));
        const K = s * s * t, ds = divisors(s);
        return N(`${rq(K, x)}${tail(K, '이/가')} 자연수가 되게 하는 자연수 ${x}는 모두 몇 개인가?`, ds.length, {
          unit: '개', explain: `${K} = ${s}${sup(2)} × ${t}이다. ${frac(K, x)}${tail(K, '이/가')} 제곱인 수가 되려면 ${x} = ${t} × ${V('m')}${sup(2)}이고 ${V('m')}은 ${s}의 약수여야 한다(그때 ${rq(K, x)} = ${frac(s, V('m'))}). ${s}의 약수는 ${ds.join(', ')}의 ${ds.length}개이므로 ${x}도 ${ds.length}개이다.`,
          facts: { digit: { template: `(${K}/□)${RT}%1<0.000001`, lo: 1, hi: K, ask: 'count' } }
        });
      }),
      H('hard-allirr', '몇 배 한 수의 근호가 모두 무리수가 되는 n의 개수', '심9', (d) => {
        // √(mn) 이 유리수 ⇔ n = m × (제곱인 수). m 이 서로 다른 제곱인 수를 인수로 갖지 않는 수들이면 겹치는 n 이 없다.
        const ms = d.pick([[1, 2, 3], [1, 2, 5], [1, 3, 5], [1, 2, 3, 5]]), Nn = d.pick([100, 200, 300, 500]);
        const bad = ms.map((m) => Math.floor(Math.sqrt(Nn / m))), ans = Nn - bad.reduce((p, q) => p + q, 0);
        const list = ms.map((m) => (m === 1 ? rt(V('n')) : rt(m + V('n')))).join(', ');
        return N(`${Nn} 이하의 자연수 ${V('n')}에 대하여 ${list}이 모두 무리수가 되는 ${V('n')}은 모두 몇 개인가?`, ans, { unit: '개',
          explain: `${ms.map((m, i) => `${m === 1 ? rt(V('n')) : rt(m + V('n'))}이 유리수인 ${V('n')}은 ${m === 1 ? '' : m + ' × '}(제곱인 수) 꼴로 ${bad[i]}개`).join(', ')}이다. ${ms.join(', ')}${tail(ms[ms.length - 1], '은/는')} 제곱인 수를 인수로 갖지 않는 서로 다른 수이므로 이 ${V('n')}들은 겹치지 않는다. 따라서 ${Nn} ${MINUS} (${bad.join(' + ')}) = ${ans}개이다.`,
          facts: { digitBoth: { templates: ms.map((m) => `0.000001<(${m}*□)${RT}%1`), lo: 1, hi: Nn } }
        });
      }),
      H('hard-fracint', '근호 둘의 합에서 구한 수의 정수 부분과 소수 부분', '심11', (d) => {
        const [k, m, Nv] = d.until(() => { const kk = d.pick([2, 3, 5, 6, 7]), mm = d.int(kk + 1, 2 * kk); return [kk, mm, 2 * kk * kk + (mm - kk) ** 4]; }, ([kk, mm, nn]) => mm - kk >= 1 && !isSquare(nn) && squareFree(nn) && nn < 3000);
        const A = k, Bv = (m - k) ** 2, xi = Math.floor(Math.sqrt(Nv));
        return abcAns(`${rt(k + a)} + ${rt(b)} = ${josa(m, '을/를')} 만족시키는 자연수 ${a}, ${b}에 대하여 ${rt(`2${a}${sup(2)} + ${b}${sup(2)}`)}의 정수 부분을 ${x}, 소수 부분을 ${y}라 할 때, ${x} ${MINUS} ${y}의 값은? ${ABC_NOTE}`, 2 * xi, -1, Nv, {
          explain: `${rt(k + a)}, ${rt(b)}가 모두 자연수여야 하므로 ${rt(k + a)} = ${k}, ${a} = ${A}, ${rt(b)} = ${m - k}, ${b} = ${Bv}이다. ${rt(`2${a}${sup(2)} + ${b}${sup(2)}`)} = ${R(Nv)}이고 ${xi} ${LT} ${R(Nv)} ${LT} ${xi + 1}이므로 ${x} = ${xi}, ${y} = ${R(Nv)} ${MINUS} ${xi}이다. ${x} ${MINUS} ${y} = ${xi} ${MINUS} (${R(Nv)} ${MINUS} ${xi}) = ${2 * xi} ${MINUS} ${R(Nv)}이다.`,
          facts: { calc: [[`2*((2*${k}*${k}+${Bv}*${Bv})${RT}-(2*${k}*${k}+${Bv}*${Bv})${RT}%1)`, 0], ['0-1', 1], [`2*${k}*${k}+(${m}-${k})**4`, 2]], unseen: U5.concat([0, 1, 2, 4, Bv]) }
        });
      }),
      H('hard-repeat', '순환소수가 든 근호의 등식', '심12', (d) => {
        // 순환소수를 분수로 고친 다음 양변을 제곱한다: √(r × b/a) = s ⇔ r × b/a = s²
        const [rh, rc, rp, rq] = d.pick([['1.0', '3', 31, 30], ['0.8', '3', 5, 6], ['1.', '2', 11, 9], ['0.1', '6', 1, 6], ['2.', '3', 7, 3]]);
        const [sc, sp] = d.pick([['3', 1], ['6', 2], ['1', 1 / 3]].map(([cc, v]) => [cc, v]));
        const sQ = sc === '1' ? Q(1, 9) : Q(sp, 3), want = Q(sQ.p * sQ.p * rq, sQ.q * sQ.q * rp);
        return F(`두 자연수 ${a}, ${b}에 대하여 ${rt(`${rep(rh, rc)} × ${frac(b, a)}`)} = ${rep('0.', sc)}일 때, ${frac(b, a)}의 값을 기약분수로 나타내면?`, want.p, want.q, {
          improper: want.p > want.q,
          explain: `${rep(rh, rc)} = ${frac(rp, rq)}, ${rep('0.', sc)} = ${frac(sQ.p, sQ.q)}이다. 양변을 제곱하면 ${frac(rp, rq)} × ${frac(b, a)} = ${frac(sQ.p * sQ.p, sQ.q * sQ.q)}이므로 ${frac(b, a)} = ${frac(sQ.p * sQ.p, sQ.q * sQ.q)} × ${frac(rq, rp)} = ${frac(want.p, want.q)}이다.`,
          facts: { value: `(${sQ.p}/${sQ.q})**2*${rq}/${rp}`, unseen: [sQ.p, sQ.q, rq, rp, 2] }
        });
      }),
      H('hard-pairs', '√a + √b ≤ k 를 만족하는 정수의 순서쌍', '심13', (d) => {
        // 근호 안은 0 이상이다. √a + √b ≤ k 에서 a, b 는 0부터 k² 까지 따져 센다.
        const k = d.pick([2, 3]), cand = [];
        for (let p = 0; p <= k * k; p += 1) for (let q = 0; q <= k * k; q += 1) cand.push([p, q, Math.sqrt(p) + Math.sqrt(q) <= k + 1e-12]);
        const hit = cand.filter((r) => r[2]);
        return N(`0 이상인 두 정수 ${a}, ${b}에 대하여 ${rt(a)} + ${rt(b)} ≤ ${josa(k, '을/를')} 만족시키는 순서쌍 (${a}, ${b})는 모두 몇 개인가?`, hit.length, {
          unit: '개', explain: `${rt(a)} ≤ ${k}, ${rt(b)} ≤ ${k}이므로 ${a}, ${b}는 0부터 ${k * k}까지이다. 하나씩 따지면 ${hit.map((r) => `(${r[0]}, ${r[1]})`).join(', ')}의 ${hit.length}개이다.`,
          facts: { count: cand.map((r) => r[2]) }
        });
      }),
      H('hard-func', '함숫값에 근호가 든 수를 거듭 넣기', '심18', (d) => {
        // f(f(√k)) = a{f(√k)}² − √k = −√k 에서 f(√k) = 0, 곧 ka − √k = 0
        const k = d.pick([2, 3, 5, 6, 7]), f = V('f');
        const right = frac(R(k), k), opts = d.shuffle([right, R(k), String(k), frac(1, k), `${k}${R(k)}`]);
        return C(`${f}(${x}) = ${a}${x}${sup(2)} ${MINUS} ${R(k)}에 대하여 ${f}(${f}(${R(k)})) = ${MINUS}${R(k)}일 때, 양수 ${a}의 값은?`, opts, opts.indexOf(right), {
          explain: `${f}(${f}(${R(k)})) = ${a}{${f}(${R(k)})}${sup(2)} ${MINUS} ${R(k)} = ${MINUS}${R(k)}이므로 ${a}{${f}(${R(k)})}${sup(2)} = 0이고, ${a} ${GT} 0이므로 ${f}(${R(k)}) = 0이다. ${f}(${R(k)}) = ${a} × ${sq(par(R(k)))} ${MINUS} ${R(k)} = ${k}${a} ${MINUS} ${R(k)} = 0이므로 ${a} = ${right}이다.`,
          facts: { truth: opts.map((o) => o === right), want: true }
        });
      }),
      H('hard-absign', '무리수 a, b 로 만든 식의 부호', '심19', (d) => {
        // b − a 처럼 같은 근호가 지워지는 식으로 만든 다음 근호를 씌워 견준다.
        const [p, r] = d.until(() => [nonSq(d, 2, 15), nonSq(d, 2, 15)], ([u, w]) => u !== w), q = Math.round(Math.sqrt(r)) + d.pick([0, 1]), cst = d.int(1, 3), cs = d.int(1, 4);
        const A = Math.sqrt(p) - q, Bv = Math.sqrt(p) - Math.sqrt(r);
        const stm = [
          { h: `${b} ${MINUS} ${a}`, v: Bv - A }, { h: `${a} ${MINUS} ${b}`, v: A - Bv }, { h: `${a} + ${cst}`, v: A + cst },
          { h: `${b} + ${R(r)} ${MINUS} ${cs}`, v: Bv + Math.sqrt(r) - cs }, { h: `${a} + ${q} ${MINUS} ${b}`, v: A + q - Bv }
        ].filter((s) => Math.abs(s.v) > 0.02);
        const want = d.bool();
        const made = d.until(() => stm.map((s) => { const dir = d.bool() ? 1 : -1; return { h: `${s.h} ${dir > 0 ? GT : LT} 0`, ok: dir > 0 ? s.v > 0 : s.v < 0 }; }), (l) => l.length >= 4 && l.filter((s) => s.ok === want).length === 1);
        const rows = d.shuffle(made), at2 = rows.findIndex((s) => s.ok === want);
        return C(`${a} = ${R(p)} ${MINUS} ${q}, ${b} = ${R(p)} ${MINUS} ${R(r)}일 때, 다음 중 ${want ? '옳은' : '옳지 않은'} 것은?`, rows.map((s) => s.h), at2, {
          explain: `식에 넣어 정리하면 ${b} ${MINUS} ${a} = ${q} ${MINUS} ${R(r)}, ${a} + ${cst} = ${sText([rad(p), num(cst - q)])}, ${b} + ${R(r)} ${MINUS} ${cs} = ${R(p)} ${MINUS} ${cs}, ${a} + ${q} ${MINUS} ${b} = ${R(r)}이다. 근호를 씌워 견주면 ${rows.map((s) => `${s.h}${s.ok ? '(옳다)' : '(옳지 않다)'}`).join(', ')}이다.`,
          facts: { truth: rows.map((s) => s.ok === want), want: true }
        });
      }, { standard: STD9 }),
      H('hard-fsum', '√x 이하인(보다 작은) 자연수의 개수의 합', '심21', (d) => {
        // f(x) 는 제곱인 수 사이에서 같은 값이다. 구간마다 개수를 세어 곱하여 더한다.
        const strict = d.bool(), odd = d.bool(), last = odd ? 2 * d.int(8, 12) - 1 : d.int(15, 24), xs = range(1, last).filter((v) => !odd || v % 2 === 1);
        const f = (v) => (strict ? Math.ceil(Math.sqrt(v)) - 1 : Math.floor(Math.sqrt(v))), total = xs.reduce((s, v) => s + f(v), 0), F = V('f');
        const shown = odd ? `${F}(1) + ${F}(3) + ${F}(5) + … + ${F}(${last})` : `${F}(1) + ${F}(2) + ${F}(3) + … + ${F}(${last})`;
        const groups = []; for (const v of xs) { const g = groups.find((q) => q.f === f(v)); if (g) g.n += 1; else groups.push({ f: f(v), n: 1 }); }
        return N(`자연수 ${x}에 대하여 ${rt(x)}${strict ? '보다 작은' : ' 이하인'} 자연수의 개수를 ${F}(${x})라 할 때, ${shown}의 값은?`, total, {
          explain: `${groups.map((g) => `${F}(${x}) = ${g.f}인 ${x}가 ${g.n}개`).join(', ')}이므로 ${groups.map((g) => `${g.f} × ${g.n}`).join(' + ')} = ${total}이다.`,
          facts: { calc: [[groups.map((g) => `${g.f}*${g.n}`).join('+'), 0]], unseen: groups.reduce((u, g) => u.concat([g.f, g.n]), []) }
        });
      }),
      H('hard-round', '√n 을 반올림한 값의 합', '심22', (d) => {
        // √n 을 반올림한 값이 k 인 n 은 (k − 0.5)² ≤ n < (k + 0.5)² 이다(1.5² = 2.25, 2.5² = 6.25, …).
        const last = d.int(12, 30), xs = range(1, last), f = (v) => Math.round(Math.sqrt(v)), total = xs.reduce((s, v) => s + f(v), 0), F = V('f');
        const groups = []; for (const v of xs) { const g = groups.find((q) => q.f === f(v)); if (g) g.n += 1; else groups.push({ f: f(v), n: 1 }); }
        return N(`자연수 ${V('n')}에 대하여 ${rt(V('n'))}을 소수 첫째 자리에서 반올림한 값을 ${F}(${V('n')})이라 할 때, ${F}(1) + ${F}(2) + ${F}(3) + … + ${F}(${last})의 값은?`, total, {
          explain: `1.5${sup(2)} = 2.25, 2.5${sup(2)} = 6.25, 3.5${sup(2)} = 12.25, 4.5${sup(2)} = 20.25, 5.5${sup(2)} = 30.25이므로 ${groups.map((g) => `${F}(${V('n')}) = ${g.f}인 ${V('n')}이 ${g.n}개`).join(', ')}이다. 따라서 ${groups.map((g) => `${g.f} × ${g.n}`).join(' + ')} = ${total}이다.`,
          facts: { calc: [[groups.map((g) => `${g.f}*${g.n}`).join('+'), 0]], unseen: groups.reduce((u, g) => u.concat([g.f, g.n]), []) }
        });
      }),
      H('hard-rule', '수직선 위 √n 들 사이의 점의 개수', '심23', (d) => {
        // a² 과 (a + d)² 사이의 자연수 n 에 대하여 √n 이 a 와 a + d 사이에 있다: (a + d)² − a² − 1 개
        const span = d.pick([1, 2]), A = d.int(30, 900), ans = (A + span) ** 2 - A * A - 1;
        return N(`자연수의 양의 제곱근 1, ${R(2)}, ${R(3)}, 2, ${R(5)}, …를 나타내는 점을 수직선 위에 모두 찍었다. 두 수 ${V('p')}, ${V('q')} 사이에 있는 점의 개수를 &lt;${V('p')}, ${V('q')}&gt;로 나타내면 &lt;1, 2&gt; = 2, &lt;2, 3&gt; = 4이다. &lt;${A}, ${A + span}&gt;의 값은?`, ans, {
          explain: `${A} = ${R(A * A)}, ${A + span} = ${R((A + span) ** 2)}이므로 두 수 사이에 있는 점은 ${R(A * A + 1)}부터 ${R((A + span) ** 2 - 1)}까지이다. 그 개수는 ${(A + span) ** 2 - 1} ${MINUS} ${A * A} = ${ans}이다.`,
          facts: { calc: [[`(${A}+${span})*(${A}+${span})-${A}*${A}-1`, 0]], unseen: [span, 1] }
        });
      }),
      H('hard-nx', '곱이 자연수이고 근호의 정수 부분이 정해진 수들의 합', '심24', (d) => {
        // √(nx) 의 정수 부분이 k ⇔ k² ≤ nx < (k + 1)². nx 가 자연수이면 x = j/n (j = k², …, (k + 1)² − 1)
        const k = d.int(2, 4), sumJ = (2 * k + 1) * k * (k + 1), n = d.pick(divisors(sumJ).filter((v) => v >= 2 && v <= 12 && sumJ / v >= 2)), S = sumJ / n;
        return N(`자연수 ${V('n')}에 대하여 다음 두 조건을 모두 만족시키는 ${x}의 값들의 합이 ${S}일 때, ${V('n')}의 값은?`, n, {
          figure: lines([`㈎ ${V('n')}${x}는 자연수이다.`, `㈏ ${rt(V('n') + x)}의 정수 부분은 ${k}이다.`]),
          explain: `${k} ≤ ${rt(V('n') + x)} ${LT} ${k + 1}이므로 ${k * k} ≤ ${V('n')}${x} ${LT} ${(k + 1) ** 2}이고 ${V('n')}${x}는 ${k * k}, ${k * k + 1}, …, ${(k + 1) ** 2 - 1}이다. 그 합은 ${sumJ}이므로 ${x}의 값들의 합은 ${frac(sumJ, V('n'))} = ${S}, ${V('n')} = ${n}이다.`,
          facts: { calc: [[`(2*${k}+1)*${k}*(${k}+1)/${S}`, 0]], unseen: [2, 1] }
        });
      }),
      H('hard-frac2', '정수 부분과 소수 부분으로 만든 수의 정수 부분', '심25', (d) => {
        // a + b = p + √q, 0 < b < 1 이므로 ma − b 의 정수 부분은 ma − 1, ma + b 의 정수 부분은 ma 이다.
        const p = d.int(1, 4), q = nonSq(d, 2, 30), mm = d.int(2, 4), minus = d.bool(), aI = p + Math.floor(Math.sqrt(q)), ans = minus ? mm * aI - 1 : mm * aI;
        const X = `${mm}*((${p}+${q}${RT})-(${p}+${q}${RT})%1)${minus ? '-' : '+'}((${p}+${q}${RT})%1)`;
        return N(`${p} + ${R(q)}의 정수 부분을 ${a}, 소수 부분을 ${b}라 할 때, ${mm}${a} ${minus ? MINUS : '+'} ${b}의 정수 부분은?`, ans, {
          explain: `${Math.floor(Math.sqrt(q))} ${LT} ${R(q)} ${LT} ${Math.floor(Math.sqrt(q)) + 1}이므로 ${a} = ${aI}, ${b} = ${p} + ${R(q)} ${MINUS} ${aI} = ${R(q)} ${MINUS} ${Math.floor(Math.sqrt(q))}이다. 0 ${LT} ${b} ${LT} 1이므로 ${mm}${a} ${minus ? MINUS : '+'} ${b} = ${mm * aI} ${minus ? MINUS : '+'} ${b}의 정수 부분은 ${ans}이다.`,
          facts: { calc: [[`(${X})-(${X})%1`, 0]], unseen: U5.concat([1]) }
        });
      }),
      H('hard-rangesum', '범위 안에서 √(kn)이 자연수가 되는 n의 합', '①32', (d) => {
        // k = s² × t 이면 n = t × (제곱인 수). 범위 안의 것만 더한다.
        const [s, t, L, Hh] = d.until(() => [...d.pick([[4, 3], [2, 3], [3, 2], [2, 5], [4, 5], [3, 7], [2, 6]]), d.int(5, 20), d.int(80, 150)], ([, t1, l1, h1]) => range(1, 12).map((j) => t1 * j * j).filter((v) => v > l1 && v < h1).length >= 3);
        const K = s * s * t, ns = range(1, 12).map((j) => t * j * j).filter((v) => v > L && v < Hh), total = ns.reduce((u, v) => u + v, 0);
        return N(`${L} ${LT} ${V('n')} ${LT} ${Hh}인 자연수 ${V('n')}에 대하여 ${rt(K + V('n'))}이 자연수가 되게 하는 ${V('n')}의 값을 모두 더하면?`, total, {
          explain: `${K} = ${s}${sup(2)} × ${t}이므로 ${V('n')} = ${t} × (자연수)${sup(2)} 꼴이어야 한다. ${L} ${LT} ${V('n')} ${LT} ${Hh}에서 ${V('n')} = ${ns.join(', ')}이므로 합은 ${total}이다.`,
          facts: { calc: [[ns.join('+'), 0]], unseen: ns }
        });
      }),
      H('hard-maxint', '두 근호의 차가 가장 큰 정수가 되는 수', '①34', (d) => {
        // 두 근호가 모두 자연수일 때만 차가 정수가 된다. 앞의 근호는 가장 크게, 뒤의 근호는 가장 작게.
        const A = d.int(40, 140), Bq = d.until(() => d.int(40, 240), (v) => v >= A), s1 = Math.floor(Math.sqrt(A - 1)), s2 = Math.ceil(Math.sqrt(Bq + 1));
        const m = A - s1 * s1, n = s2 * s2 - Bq;
        return M(`${rt(`${A} ${MINUS} ${V('m')}`)} ${MINUS} ${rt(`${Bq} + ${V('n')}`)}이 가장 큰 정수가 되게 하는 자연수 ${V('m')}, ${V('n')}을 차례로 구하시오.`, [{ answer: m, label: V('m') }, { answer: n, label: V('n') }], {
          shown: `${V('m')} = ${m}, ${V('n')} = ${n}`,
          explain: `${A} ${MINUS} ${V('m')} ${LT} ${Bq} + ${V('n')}이므로 차는 음수이고, 0이 아닌 정수가 되려면 두 근호가 모두 자연수여야 한다. 차를 가장 크게 하려면 ${rt(`${A} ${MINUS} ${V('m')}`)}은 가장 크게, ${rt(`${Bq} + ${V('n')}`)}은 가장 작게 한다. ${A} ${MINUS} ${V('m')} ≤ ${A - 1}인 가장 큰 제곱인 수는 ${s1 * s1}이므로 ${V('m')} = ${m}, ${Bq} + ${V('n')} ≥ ${Bq + 1}인 가장 작은 제곱인 수는 ${s2 * s2}이므로 ${V('n')} = ${n}이다. 그때 차는 ${s1} ${MINUS} ${s2} = ${s1 - s2}이다.`,
          facts: { calc: [[`${A}-${s1}*${s1}`, 0], [`${s2}*${s2}-${Bq}`, 1]], unseen: [s1, s2] }
        });
      })
    ]
  });
  void gcd; void sText; void sVal; void num; void rad; void neg; void nb; void tx; void STD9;
})(typeof window !== 'undefined' ? window : globalThis);
