// 미적분Ⅱ Ⅱ-2 여러 가지 미분법 — 실력 문항.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-4a.js 머리에 적었다. 도구는 11-5-4a.js 가 내보낸 B.kit.u54x 를 쓴다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 합성함수를 미분할 때 안쪽 함수의 도함수를 곱하지 않는다((sin 2x)′ = cos 2x, (3ˣ)′ = x·3ˣ⁻¹ 처럼 거듭제곱 공식을 지수함수에 댄다).
//  - 밑과 지수에 모두 x 가 있는 함수(x^(ln x))에 xʳ 의 공식이나 aˣ 의 공식을 그대로 댄다 — 양변에 로그를 취해 미분해야 한다.
//  - 극한 lim (f(g(x)) − f(g(a)))/(x − a) 를 미분계수로 읽지 못하고, 분모가 0으로 갈 때 분자도 0으로 가야 한다는 것(함숫값)을 놓친다.
//  - 역함수의 미분계수에서 f′(f⁻¹(b)) 대신 f′(b) 를 쓰고, x 가 y 의 식으로 주어지면 dy/dx = 1/(dx/dy) 로 뒤집는 것을 잊는다.
//  - lim (f′(x) − a)/(x − q) 의 극한값이 이계도함수 f″(q) 라는 것을 알아보지 못한다.
// 실력에 둔 것: ① 뜻을 정확히 대야 풀리는 함정 문제(로그 미분법, x 를 y 의 식으로 준 곡선, 극한으로 쓴 f″) ② 세 단계 넘게 잇는 문제
//  (추상 함수와 지수함수가 섞인 극한, 극한 조건 셋으로 합성 미분계수, 도함수의 정의·합성·삼각함수의 범위를 잇는 학기 시험 끝 문제).
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac } = B.kit;
  const { MINUS, Q, V, nz } = B.kit.mid;
  const { ms, fn, lim, jh, dd } = B.kit.hs;
  const K = B.kit.u54x, nb = K.nb;
  const { S5, S7, HT, X, Y, Av, Bv, sT, jn, mz, co, plus, sf, qT, fIs, PI, ND, near, E, LN, val, slots, valueQ, choose } = K;
  // c·e^k 의 ms 원글: ep(2, 0) → '2', ep(4, 1) → '4e', ep(6, 2) → '6e^2'
  const ep = (c, k) => (k === 0 ? String(c) : co(c, k === 1 ? 'e' : 'e^' + k));

  const hard = [
    HT('hard-chain-exp-limit', '추상 함수와 지수함수가 섞인 극한을 미분계수로 읽기', '①29', (d) => {
      const a = d.pick([2, 3, 5]), b = d.int(1, 3), p = d.int(2, 7), g = (x) => p * (a ** x + b), v = ND(g, 0);
      const opt = (h, value) => ({ h: nb(h), v: value });
      const rows = choose(d, opt(ms(p + 'ln ' + a), p * LN(a)), [opt(String(p), p), opt(frac(p, ms('ln ' + a)), p / LN(a)), opt(ms('ln ' + a), LN(a)), opt(String(a * p), a * p), opt(ms(p + 'ln ' + (a + b)), p * LN(a + b))], 4);
      return valueQ(d, `미분가능한 함수 ${ms('f(x)')}에 대하여 ${nb(ms("f'(" + (1 + b) + ') = ' + p))}일 때, ${lim('x→0', frac(ms('f(' + a + '^x + ' + b + ') - f(' + (1 + b) + ')'), X))}의 값은?`, v, rows, {
        explain: `${nb(ms('g(x) = f(' + a + '^x + ' + b + ')'))}라 하면 ${nb(ms('g(0) = f(' + (1 + b) + ')'))}이므로 (주어진 식) = ${nb(lim('x→0', frac(ms('g(x) - g(0)'), X)) + ' = ' + ms("g'(0)"))}이다. ${nb(ms("g'(x) = f'(" + a + '^x + ' + b + ') × ' + a + '^x ln ' + a))}이므로 ${nb(ms("g'(0) = f'(" + (1 + b) + ') × ln ' + a + ' = ' + p + 'ln ' + a))}이다.` });
    }, { standard: S5 }),

    HT('hard-chain-limits', '극한 조건 셋으로 합성 미분계수 구하기', '①31', (d) => {
      const x0 = d.int(1, 2), P = d.int(1, 4), q = d.pick([2, 3, -1, -2, -3]), a = nz(d, -6, 6), r = d.int(-3, 5), s = a * q;
      if (r === P) return null;
      return val(`모든 실수 ${X}에서 미분가능한 두 함수 ${ms('f(x)')}, ${ms('g(x)')}에 대하여 함수 ${nb(ms('h(x) = (f∘g)(x)'))}라 하자. ${nb(ms("f'(" + P + ') = ' + q))}이고 ${nb(lim('x→' + x0, frac(ms('g(x) - ' + P), ms('x - ' + x0))) + ' = ' + ms('a'))}, ${nb(lim('x→' + x0, frac(ms(plus('h(x)', -r)), ms('x - ' + x0))) + ' = ' + sT(s))}일 때, 실수 ${Av}의 값은?`, a, {
        explain: `분모가 0으로 가고 극한값이 있으므로 ${nb(ms('g(' + x0 + ') = ' + P))}, ${nb(ms("g'(" + x0 + ') = a'))}, ${nb(ms('h(' + x0 + ') = ' + r))}, ${nb(ms("h'(" + x0 + ') = ' + s))}이다. ${nb(ms("h'(" + x0 + ") = f'(g(" + x0 + "))g'(" + x0 + ") = f'(" + P + ')a = ' + co(q, 'a')))}이므로 ${nb(ms(co(q, 'a') + ' = ' + s))}에서 ${nb(ms('a = ' + a))}이다.`,
        value: `${jn(s)}/${jn(q)}` });
    }, { standard: S5 }),

    HT('hard-sin2x', '도함수의 정의 극한과 sin 2x — 최댓값과 최솟값의 합', '①32', (d) => {
      const c = d.int(2, 4), k = nz(d, -6, 6), S = 2 * c * k;
      return val(`함수 ${fIs(ms('sin 2x + kx'))}에 대하여 함수 ${nb(ms('g(x)') + ' = ' + lim('h→0', frac(ms('f(x + ' + c + 'h) - f(x)'), V('h'))))}의 최댓값을 ${V('M')}, 최솟값을 ${V('m')}이라 하자. ${nb(ms('M + m = ' + S, 'M'))}일 때, 상수 ${V('k')}의 값은?`, k, {
        explain: `${nb(ms('g(x)') + ' = ' + lim('h→0', ms('{(f(x + ' + c + 'h) - f(x))/(' + c + 'h)} × ' + c)) + ' = ' + ms(c + "f'(x)"))}이다. [합성함수] ${nb(ms('(sin 2x)') + '′ = ' + ms('cos 2x × 2'))}, [배각] ${nb(ms("(2sin x cos x)' = 2(cos^2 x - sin^2 x) = 2cos 2x"))} — 어느 쪽이든 ${nb(ms("f'(x) = 2cos 2x" + (k < 0 ? ' - ' : ' + ') + Math.abs(k)))}이다. 따라서 ${nb(ms('g(x) = ' + 2 * c + 'cos 2x' + (c * k < 0 ? ' - ' : ' + ') + Math.abs(c * k)))}이고, ${nb(ms('-1 <= cos 2x <= 1'))}이므로 ${nb(ms('M = ' + sT(c * k + 2 * c), 'M'))}, ${nb(ms('m = ' + sT(c * k - 2 * c)))}, ${nb(ms('M + m = ' + sT(2 * c * k), 'M'))}이다. 그러므로 ${nb(ms('k = ' + k))}이다.`,
        value: `${jn(S)}/(2*${c})`, derived: [2] });
    }, { standard: S5 }),

    // n = 0: x^(k ln x) 와 (f(x) − f(e))/(x − e), n = 1: (ax)^(ln x) 와 (f(e + cx) − f(e − cx))/x
    HT('hard-log-diff', '밑과 지수에 모두 x가 있는 함수 — 로그 미분법', '①34', (d, n) => {
      if (n === 0) {
        const k = d.int(1, 3), f = (x) => x ** (k * LN(x)), v = ND(f, E), ek = k === 1 ? 'e' : 'e^' + k;
        const opt = (c, e) => ({ h: ms(ep(c, e)), v: c * E ** e });
        const rows = choose(d, opt(2 * k, k - 1), [opt(k, k - 1), opt(2 * k, k), opt(k, k), opt(2 * k, k + 1), opt(2, 0)], 4);
        return valueQ(d, `함수 ${fIs(ms('x^{' + co(k, 'ln x') + '}'))} ${nb('(' + ms('x > 0') + ')')}에 대하여 ${lim('x→e', frac(ms('f(x) - ' + ek), ms('x - e')))}의 값은?`, v, rows, {
          explain: `${nb(ms('f(e) = ' + ek))}이므로 (주어진 식) = ${ms("f'(e)")}이다. 양변에 자연로그를 취하면 ${nb(ms('ln f(x) = ' + co(k, '(ln x)^2')))}이고, 양변을 ${X}에 대하여 미분하면 ${nb(frac(ms("f'(x)"), ms('f(x)')) + ' = ' + frac(ms(co(2 * k, 'ln x')), X))}이다. 따라서 ${nb(ms("f'(e)") + ' = ' + frac(ms(String(2 * k)), ms('e')) + ' × ' + ms(ek) + ' = ' + rows[0].h)}이다.` });
      }
      const a = d.int(2, 3), c = d.int(1, 2), f = (x) => (a * x) ** LN(x), g = (x) => f(E + c * x) - f(E - c * x), v = ND(g, 0);
      const opt = (p, q, value) => ({ h: nb(ms(p + (q < 0 ? ' - ' : ' + ') + co(Math.abs(q), 'ln ' + a))), v: value });
      const rows = choose(d, opt(4 * a * c, 2 * a * c, 4 * a * c + 2 * a * c * LN(a)), [opt(2 * a * c, a * c, 2 * a * c + a * c * LN(a)), opt(2 * a, a, 2 * a + a * LN(a)), opt(4 * a * c, 4 * a * c, 4 * a * c * (1 + LN(a))), opt(8 * a * c, 2 * a * c, 8 * a * c + 2 * a * c * LN(a)), opt(4 * c, 2 * c, 4 * c + 2 * c * LN(a)), opt(4 * a * c, a * c, 4 * a * c + a * c * LN(a)), opt(2 * a * c, 2 * a * c, 2 * a * c * (1 + LN(a)))], 4);
      return valueQ(d, `함수 ${fIs(ms('(' + a + 'x)^{ln x}'))} ${nb('(' + ms('x > 0') + ')')}에 대하여 ${lim('x→0', frac(ms('f(e + ' + co(c, 'x') + ') - f(e - ' + co(c, 'x') + ')'), X))}의 값은?`, v, rows, {
        explain: `(주어진 식) = ${nb(ms(c + "f'(e) + " + c + "f'(e) = " + 2 * c + "f'(e)"))}이다. ${nb(ms('ln f(x) = ln x × ln ' + a + 'x = (ln x)^2 + ln ' + a + ' × ln x'))}이므로 ${nb(frac(ms("f'(x)"), ms('f(x)')) + ' = ' + frac(ms('2ln x + ln ' + a), X))}이다. ${nb(ms('f(e) = ' + a + 'e'))}이므로 ${nb(ms("f'(e)") + ' = ' + frac(ms('2 + ln ' + a), ms('e')) + ' × ' + ms(a + 'e') + ' = ' + ms(2 * a + ' + ' + co(a, 'ln ' + a)))}이고, 답은 ${rows[0].h}이다.` });
    }, { count: 2, standard: S5 }),

    HT('hard-x-of-y', 'x를 y의 식으로 준 곡선에서 dy/dx', '②20', (d) => {
      const k = d.int(1, 3), xy = (y) => k * Math.cos(y) / (y + Math.cos(y)), v = 1 / ND(xy, Math.PI / 2);
      const P = (num, den, value) => ({ h: (value < 0 ? MINUS : '') + (den === 1 ? (num === 1 ? 'π' : num + 'π') : frac(num === 1 ? 'π' : num + 'π', den)), v: value });
      const Iv = (num, value) => ({ h: (value < 0 ? MINUS : '') + frac(num, 'π'), v: value });
      const rows = choose(d, P(1, 2 * k, -Math.PI / (2 * k)), [P(1, 2 * k, Math.PI / (2 * k)), Iv(2 * k, -2 * k / Math.PI), P(k, 2, -k * Math.PI / 2), P(1, k, -Math.PI / k), Iv(2 * k, 2 * k / Math.PI)], 4);
      return valueQ(d, `곡선 ${nb(ms('x') + ' = ' + frac(ms(co(k, 'cos y')), ms('y + cos y')))}에 대하여 ${nb(ms('x = 0'))}일 때, ${dd('y', 'x')}의 값은? ${nb('(단, 0 &lt; ' + Y + ' &lt; ' + frac('4π', 5) + ')')}`, v, rows, {
        explain: `${nb(ms('x = 0'))}이면 ${nb(ms('cos y = 0'))}이고 ${nb('0 &lt; ' + Y + ' &lt; ' + frac('4π', 5))}이므로 ${nb(Y + ' = ' + frac('π', 2))}이다. 양변을 ${Y}에 대하여 미분하면 ${nb(dd('x', 'y') + ' = ' + MINUS + frac(ms(co(k, '(y sin y + cos y)')), ms('(y + cos y)^2')))}이고, ${nb(Y + ' = ' + frac('π', 2))}에서 ${nb(dd('x', 'y') + ' = ' + MINUS + frac(2 * k, 'π'))}이다. 따라서 ${nb(dd('y', 'x') + ' = ' + frac(1, dd('x', 'y')) + ' = ' + rows[0].h)}이다.` });
    }, { standard: S7 }),

    HT('hard-second-limit', '극한으로 쓴 f′(a)와 f″(a)', '②27', (d) => {
      const k = nz(d, -4, 4), p = d.int(-2, 3), dlt = d.pick([1, -1]), q = p + dlt;
      return slots(`함수 ${fIs(sf(k, plus('x', -p)))}에 대하여 ${nb(lim('x→' + q, frac(ms("f'(x) - a"), ms(plus('x', -q)))) + ' = ' + ms('b'))}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, `${Av} = {0}, ${Bv} = {1}`,
        [[-k, `-${jn(k)}/((${jn(q)}-${jn(p)})*(${jn(q)}-${jn(p)}))`], [2 * k * dlt, `2*${jn(k)}/((${jn(q)}-${jn(p)})*(${jn(q)}-${jn(p)})*(${jn(q)}-${jn(p)}))`]], {
          shown: `${Av} = ${sT(-k)}, ${Bv} = ${sT(2 * k * dlt)}`,
          explain: `분모가 0으로 가고 극한값이 있으므로 분자도 0으로 가야 해서 ${nb(ms("a = f'(" + q + ')'))}이고, 그러면 ${nb(ms('b') + ' = ' + lim('x→' + q, frac(ms("f'(x) - f'(" + q + ')'), ms(plus('x', -q)))) + ' = ' + ms("f''(" + q + ')'))}이다. ${nb(ms("f'(x)") + ' = ' + sf(-k, '(' + plus('x', -p) + ')^2'))}, ${nb(ms("f''(x)") + ' = ' + sf(2 * k, '(' + plus('x', -p) + ')^3'))}이므로 ${nb(ms('a = ' + (-k)))}, ${nb(ms('b = ' + 2 * k * dlt))}이다.`,
          derived: [2] });
    }, { standard: S7 })
  ];

  B.addGroup('11-5-4', { id: 'hard', title: '실력 문제', standard: S5, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
