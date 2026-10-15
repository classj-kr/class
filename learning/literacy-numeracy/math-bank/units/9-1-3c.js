// 중학교 3학년 1학기 3단원 다항식의 곱셈과 인수분해 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - (a + b)² = a² + b² 로 가운데 항 2ab 를 빠뜨린다. 계수도 제곱해야 하는 것을 잊는다(2x 의 제곱을 2x² 으로).
//  - 등식에서 □ 를 넘길 때 빼는 식 전체의 부호를 바꾸지 않는다. 괄호 앞의 −를 첫 항에만 쓴다.
//  - A² = 1 에서 A = 1 하나만 떠올린다(± 두 경우). 완전제곱식의 가운데 항을 양수 하나만 쓴다.
//  - 잘못 본 사람의 결과에서 무엇이 맞는지(잘못 본 것 말고 나머지는 맞다)를 가리지 못한다.
//  - √(A²) = A 로 늘 적는다(A 가 음수면 −A). √x × √y = √(xy), √x + √y 를 √(x + y) 로 적는다.
//  - 무리수의 정수 부분과 소수 부분을 n 이 붙은 수에서 다시 가르지 못한다.
//  - 곱이 같은 정수의 짝을 양수만, 한 차례만 센다(자리를 바꾸면 계수가 달라지는 것을 놓친다).
// 실력에 둔 것은 ① 상황·식의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제뿐이다(9-1-3a.js 머리 주석의 기준).
// 기본 자료에서만 나온 꼴은 ref 를 '기본 ①37' 처럼 적는다. 판단이 갈리는 범위: 넷의 곱을 짝지어 공통부분을 만드는 꼴(심19·심26)은
// 과제 글의 「공통부분을 한 문자로 놓으면 다섯 꼴로 줄어드는 것은 싣는다」에 따라 실었고, 계수가 문자인 이차식(심21)은 이미 x 에 대하여 정리되어 공식 ⑷ 그대로라 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qcmp, tx, nb, tail, V, sup, ex, nz, radAns, rt, sqParts } = B.kit.mid;
  const K = B.kit.m913;
  const { UNIT, STD, jn, xv, same, coefOf, termOf, ph, pt, htmlX, xh, xe, xex, eqx, ej, xj, pn, lin, lin2, sg, told, polyQ, slots, eqLabel, numQ1, facH, sOf, sDiv, sMul, sAdd, sH, isSqf, fr1 } = K;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const tj0 = (n, pair) => tx(Q(n)) + tail(Math.abs(n), pair);

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-box-poly', '등식 속 □에 알맞은 다항식', '심2', (d) => {
        // (ax + b)² − □ = (x + c)² − kx(x − e): □ = (ax + b)² − (x + c)² + kx(x − e). 빼는 식 전체의 부호를 바꾸어야 한다.
        const [a, b, c, k, e] = d.until(() => [d.int(2, 3), nz(d, -5, 5), nz(d, -5, 5), d.int(2, 3), nz(d, -4, 4)], ([aa, bb, cc, kk, ee]) => { const src = `(${lin(aa, bb)})^2-((x${sg(cc)})^2-${kk}x(x${sg(-ee)}))`; const P = xv(src); return P.length === 3 && P.every((t) => Math.abs(t.q.p) <= 99); });
        const left = `(${lin(a, b)})^2-?`, right = `(x${sg(c)})^2-${k}x(x${sg(-e)})`, src = `(${lin(a, b)})^2-((x${sg(c)})^2-${k}x(x${sg(-e)}))`;
        return polyQ('다음 등식에서 □ 안에 알맞은 식을 구하시오.', src, ['x^2', 'x', ''], {
          figure: eqx(left, right),
          explain: `□ = ${xh(`(${lin(a, b)})^2`)} − {${xh(right)}}이다. 빼는 식 전체의 부호를 바꾸어 계산하면 ${pt(xv(`(${lin(a, b)})^2`))} − (${pt(xv(right))}) = ${pt(xv(src))}이다.`
        });
      }),
      H('hard-square-cases', '완전제곱 전개에서 두 경우 가리기', '심4', (d) => {
        // ((1/2)x + A)² = (1/4)x² + Bx + c²: A = ±c 이고 B = A 이므로 A + B = ±2c, A − B = 0
        const c = d.int(1, 6), poss = [2 * c, -2 * c, 0], bad = d.pick([c, -c, 4 * c, 3 * c]);
        const rows = d.shuffle(poss.concat([bad])), truth = rows.map((v) => !poss.includes(v)), at = truth.indexOf(true);
        // 걸리는 곳: A = c 하나만 보면 A + B = 2c, A − B = 0 만 남아 −2c 를 「될 수 없는 것」으로 고른다. A − B = 0 을 셈하지 않으면 0 을 고른다.
        return C(`다음 등식을 만족시키는 두 수 ${V('A')}, ${V('B')}에 대하여 ${V('A')} + ${V('B')} 또는 ${V('A')} − ${V('B')}의 값이 될 수 없는 것은?`, rows.map((v) => tx(Q(v))), at, {
          figure: eqx(`([1|2]x+A)^2`, `[1|4]x^2+Bx+${c * c}`),
          explain: `좌변을 전개하면 ${nb(`${frac(1, 4)}${V('x')}${sup(2)} + ${V('A')}${V('x')} + ${V('A')}${sup(2)}`)}이므로 ${V('B')} = ${V('A')}, ${V('A')}${sup(2)} = ${c * c}이다. ${V('A')} = ${c}이면 ${V('A')} + ${V('B')} = ${2 * c}, ${V('A')} = −${c}이면 ${V('A')} + ${V('B')} = −${2 * c}이고, ${V('A')} − ${V('B')}는 언제나 0이다.`,
          facts: { truth, want: true }
        });
      }),
      H('hard-wrong-expand', '잘못 보고 전개한 두 결과', '심6', (d) => {
        // (x + p)(x − q) 에서 −q 를 A 로 잘못 봄 → x² + sx + B, (mx − r)(x + t) 에서 m 을 잘못 봄 → Cx² + ux − rt
        const [p, q, A0, m, r, t, D0] = d.until(() => [d.int(1, 6), d.int(2, 9), nz(d, -9, 9), d.int(2, 4), d.int(1, 6), d.int(1, 4), nz(d, -5, 5)], ([pp, qq, aa, mm, , , dd]) => aa !== -qq && pp + aa !== 0 && dd !== mm && dd !== 0);
        const s = p + A0, Bv = p * A0, u = D0 * t - r, nm = d.pick(NAMES);
        return slots(`${name(nm, '은/는')} ${xj(`(x+${p})(x-${q})`, '을/를')} 전개하는데 ${MINUS}${q}${tail(q, '을/를')} ${V('A')}로 잘못 보고 ${xj(`x^2${sg(s, 'x')}+B`, '으로/로')} 전개하였고, ${xj(`(${m}x-${r})(x+${t})`, '을/를')} 전개하는데 ${V('x')}의 계수 ${m}${tail(m, '을/를')} 잘못 보고 ${xj(`Cx^2${sg(u, 'x')}-${r * t}`, '으로/로')} 전개하였다. 세 수 ${V('A')}, ${V('B')}, ${V('C')}의 값은?`, [[eqLabel('A'), A0, `${jn(s)}-${p}`], [eqLabel('B'), Bv, `${p}*(${jn(s)}-${p})`], [eqLabel('C'), D0, `(${jn(u)}+${r})/${t}`]], {
          unseen: [1], explain: `${nb(`(${V('x')} + ${p})(${V('x')} + ${V('A')}) = ${V('x')}${sup(2)} + (${p} + ${V('A')})${V('x')} + ${p}${V('A')}`)}이므로 ${p} + ${V('A')} = ${tx(Q(s))}에서 ${V('A')} = ${tx(Q(A0))}, ${V('B')} = ${p} × (${tx(Q(A0))}) = ${tx(Q(Bv))}이다. 잘못 본 계수를 ${V('D')}라 하면 ${nb(`(${V('D')}${V('x')} − ${r})(${V('x')} + ${t}) = ${V('D')}${V('x')}${sup(2)} + (${t === 1 ? '' : t}${V('D')} − ${r})${V('x')} − ${r * t}`)}이므로 ${t === 1 ? '' : t}${V('D')} − ${r} = ${tx(Q(u))}에서 ${V('D')} = ${tx(Q(D0))}, ${V('C')} = ${V('D')} = ${tx(Q(D0))}이다.`
        });
      }),
      H('hard-root-sum', '√x + √y의 값', '심10', (d) => {
        // x = (√u + √v)², y = (√u − √v)²: √x + √y = 2√u (u > v)
        const [u, v] = d.until(() => [d.pick([2, 3, 5, 6, 7, 10, 11, 13]), d.int(1, 7)], ([a, b]) => a > b && sqParts(a * b)[1] !== 1 && sqParts(a * b)[0] <= 3);
        const [k, n] = sqParts(u * v), m = u + v, X = `${m} + ${2 * k === 1 ? '' : 2 * k}${rt(n)}`, Y = `${m} − ${2 * k}${rt(n)}`;
        // 걸리는 곳: √x + √y = √(x + y) = √(2m) 로 적거나, √x√y = √(xy) 의 xy 를 셈하지 않는다.
        return radAns(`${V('x')} = ${X}, ${V('y')} = ${Y}일 때, ${nb(`${rt(V('x'))} + ${rt(V('y'))}`)}의 값은?`, 2, u, {
          explain: `${nb(`${V('x')} + ${V('y')} = ${2 * m}`)}, ${nb(`${V('x')}${V('y')} = ${m}${sup(2)} − ${4 * k * k * n} = ${m * m - 4 * u * v}`)}이다. ${rt(V('x'))} + ${rt(V('y'))}는 양수이고 ${nb(`(${rt(V('x'))} + ${rt(V('y'))})${sup(2)} = ${V('x')} + ${V('y')} + 2${rt(V('x') + V('y'))} = ${2 * m} + 2${rt(m * m - 4 * u * v)} = ${4 * u}`)}이므로 ${rt(V('x'))} + ${rt(V('y'))} = ${nb(rt(4 * u))} = 2${rt(u)}이다.`,
          facts: { calc: [['2', 0]], unseen: [2], check: { kind: 'root-sum', m, k, n } }
        });
      }),
      H('hard-cube-blocks', '세제곱 덩어리의 합과 차의 제곱', '심13', (d) => {
        const [a, b] = d.until(() => [d.pick([2, 3, 5, 6, 7, 10, 11]), d.pick([2, 3, 5, 6, 7, 10, 11])], ([x, y]) => x !== y && Math.abs(x - y) <= 5);
        const P = `(${rt(a)} − ${rt(b)})${sup(3)}`, R = `(${rt(a)} + ${rt(b)})${sup(3)}`, v = 4 * (a - b) ** 3;
        // 걸리는 곳: 세제곱을 전개하려 든다. (A + B)² − (A − B)² = 4AB 를 보면 (√a − √b)(√a + √b) = a − b 의 세제곱만 남는다.
        return numQ1(`{${nb(P)} + ${nb(R + '}' + sup(2))} − {${nb(P)} − ${nb(R + '}' + sup(2))}의 값은?`, v, {
          calc: `4*(${a}-${b})*(${a}-${b})*(${a}-${b})`, unseen: [4],
          explain: `${P} = ${V('A')}, ${R} = ${V('B')}라 하면 ${nb(`(${V('A')} + ${V('B')})${sup(2)} − (${V('A')} − ${V('B')})${sup(2)} = 4${V('A')}${V('B')}`)}이다. ${nb(`${V('A')}${V('B')} = {(${rt(a)} − ${rt(b)})(${rt(a)} + ${rt(b)})}${sup(3)} = (${tx(Q(a - b))})${sup(3)}`)}이므로 4 × (${tx(Q(a - b))})${sup(3)} = ${tx(Q(v))}이다.`
        });
      }),
      H('hard-int-pairs', '정수 짝으로 x의 계수 가리기', '심20', (d) => {
        // ax² + mx + c = (x + p)(ax + q), p, q 정수 → m = q + ap, pq = c
        const [a, c] = [d.int(2, 4), d.pick([5, 7, 3, -5, -7, -3])];
        const pairs = [[1, c], [c, 1], [-1, -c], [-c, -1]], ms = pairs.map(([p, q]) => q + a * p);
        const bad = d.until(() => d.pick([Math.abs(c) + 1, Math.abs(c) + a, 1 + c * a + 2, c + a + 2, -(Math.abs(c) + 1), a * c - 1]), (v) => !ms.includes(v) && v !== 0);
        const rows = d.shuffle([...new Set(ms)].concat([bad])), truth = rows.map((v) => !ms.includes(v)), at = truth.indexOf(true);
        // 걸리는 곳: 곱이 c 인 정수의 짝을 양수만 세거나, (1, c) 와 (c, 1) 을 같은 것으로 보아 x 의 계수 하나를 빠뜨린다.
        return C(`${xj(`${a}x^2+mx${sg(c)}`, '이/가')} ${V('a')}, ${V('b')}가 정수인 ${ej(xh(`(x+a)(${a}x+b)`), '으로/로')} 인수분해될 때, 다음 중 수 ${V('m')}의 값이 될 수 없는 것은?`, rows.map((v) => tx(Q(v))), at, {
          explain: `${nb(`(${V('x')} + ${V('a')})(${a}${V('x')} + ${V('b')}) = ${a}${V('x')}${sup(2)} + (${a}${V('a')} + ${V('b')})${V('x')} + ${V('a')}${V('b')}`)}이므로 ${V('a')}${V('b')} = ${tx(Q(c))}, ${V('m')} = ${a}${V('a')} + ${V('b')}이다. (${V('a')}, ${V('b')})가 ${pairs.map(([p, q]) => `(${tx(Q(p))}, ${tx(Q(q))})`).join(', ')}일 때 ${V('m')}은 ${ms.map((v) => tx(Q(v))).join(', ')}이다.`,
          facts: { truth, want: true }
        });
      }),
      H('hard-letter-coef', '계수가 문자인 이차식의 인수분해', '심21', (d) => {
        const kind = d.int(0, 2);
        const target = ['abx^2+(a^2-b^2)x-ab', 'abx^2-(a^2-b^2)x-ab', 'abx^2+(a^2+b^2)x+ab'][kind];
        const all = ['(ax+b)(bx+a)', '(ax+b)(bx-a)', '(ax-b)(bx+a)', '(ax-b)(bx-a)', '(ax+b)(ax-b)'];
        const P = xv(target), rows = d.shuffle(all), truth = rows.map((s) => same(xv(s), P)), at = truth.indexOf(true);
        // 걸리는 곳: 공식 ⑷ 의 a, b, c, d 자리에 문자를 대지 못한다. 보기를 전개해 견주어도 풀린다.
        return C('다음 식을 인수분해한 것은?', rows.map(xh), at, {
          figure: xex(target), explain: `${V('x')}${sup(2)}의 계수 ${V('a')}${V('b')} = ${V('a')} × ${V('b')}, 상수항 ${kind === 2 ? '' : MINUS}${V('a')}${V('b')}로 보고 대각선으로 곱한 합이 ${V('x')}의 계수가 되는 짝을 찾는다. ${xh(target)} = ${xh(rows[at])}이다.`,
          facts: { truth, want: true }
        });
      }),
      H('hard-root-fraction', '분수가 섞인 근호 안을 완전제곱으로', '심27', (d) => {
        // √(m + 1/(m + 2)), m + 2 = s²: m(m + 2) + 1 = (m + 1)² 이므로 (m + 1)/s
        const s = d.int(4, 16), m = s * s - 2;
        // 걸리는 곳: m × (m + 2) + 1 = (m + 1)² 을 보지 못하고 큰 수를 곱한다.
        return F(`${nb(rt(`${m} + ${frac(1, m + 2)}`))}을 계산하면?`, s * s - 1, s, {
          improper: true, signed: true,
          explain: `${nb(`${m} + ${frac(1, m + 2)} = ${frac(`${m} × ${m + 2} + 1`, m + 2)}`)}이고 ${nb(`${m} × ${m + 2} + 1 = (${m + 1} − 1)(${m + 1} + 1) + 1 = ${m + 1}${sup(2)}`)}이다. ${m + 2} = ${s}${sup(2)}이므로 ${nb(rt(frac(`${m + 1}${sup(2)}`, `${s}${sup(2)}`)))} = ${frac(m + 1, s)}이다.`,
          facts: { value: `(${m}+1)/${s}`, unseen: [s] }
        });
      }),
      H('hard-three-roots', '부호가 정해진 두 문자의 근호 셋', '심30', (d) => {
        // 두 수 a, b 와 0 의 크기 차례가 주어진 √((a − b)²) ± √(a²) ± √(b²)
        const orders = [['a', '0', 'b'], ['b', '0', 'a'], ['a', 'b', '0'], ['0', 'a', 'b']];
        const [ord, e1, e2] = d.until(() => [d.pick(orders), d.pick([1, -1]), d.pick([1, -1])], () => true);
        const val = { a: 0, b: 0, 0: 0 }; ord.forEach((k, i) => { val[k] = i - ord.indexOf('0'); });
        const sab = val.a - val.b > 0 ? 1 : -1, sa = val.a > 0 ? 1 : -1, sb = val.b > 0 ? 1 : -1;
        const ca = sab + e1 * sa, cb = -sab + e2 * sb, key = (x, y) => x + ',' + y;
        const pool = [[-2, 0], [0, -2], [0, 0], [2, 0], [0, 2], [2, -2], [-2, 2], [2, 2], [-2, -2]].filter(([x, y]) => key(x, y) !== key(ca, cb));
        const rows = d.shuffle(d.shuffle(pool).slice(0, 4).concat([[ca, cb]])), at = rows.findIndex(([x, y]) => x === ca && y === cb);
        const show = ([x, y]) => (x === 0 && y === 0 ? '0' : pt(xv(lin2(x, y, 'a', 'b'))));
        const cond = ord.map((k) => (k === '0' ? '0' : V(k))).join(' &lt; '), exH = `${rt(`${V('a')}${sup(2)} − 2${V('a')}${V('b')} + ${V('b')}${sup(2)}`)} ${e1 < 0 ? MINUS : '+'} ${rt(`${V('a')}${sup(2)}`)} ${e2 < 0 ? MINUS : '+'} ${rt(`${V('b')}${sup(2)}`)}`;
        // 걸리는 곳: √(a²) = a 로 적는다(a 가 음수이면 −a). a − b 의 부호를 따로 보지 않는다.
        return C(`${cond}일 때, ${exH}을 간단히 하면?`, rows.map(show), at, {
          explain: `${nb(rt(`${V('a')}${sup(2)} − 2${V('a')}${V('b')} + ${V('b')}${sup(2)}`) + ' = ' + rt(`(${V('a')} − ${V('b')})${sup(2)}`))}이다. ${V('a')} − ${V('b')}${sab > 0 ? '는 양수' : '는 음수'}, ${V('a')}${sa > 0 ? '는 양수' : '는 음수'}, ${V('b')}${sb > 0 ? '는 양수' : '는 음수'}이므로 주어진 식은 ${show([ca, cb])}이다.`,
          facts: { truth: rows.map((r, i) => i === at), want: true }
        });
      }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-coef-three', '세 항 인수의 곱에서 두 계수 조건', '심1', (d) => {
        // (x − py − q)(x + ay + b): xy 의 계수 a − p = k1, y 의 계수 −pb − qa = k2
        const [p, q, a, b] = d.until(() => [d.int(1, 4), d.int(1, 4), nz(d, -6, 6), nz(d, -6, 6)], ([pp, , aa]) => aa - pp !== 0);
        const k1 = a - p, k2 = -p * b - q * a;
        return slots(`${xh(`(x-${p === 1 ? '' : p}y-${q})(x+ay+b)`)}의 전개식에서 ${V('x')}${V('y')}의 계수가 ${tx(Q(k1))}, ${V('y')}의 계수가 ${tx(Q(k2))}일 때, 수 ${V('a')}, ${V('b')}의 값은?`, [[eqLabel('a'), a, `${jn(k1)}+${p}`], [eqLabel('b'), b, `(-${jn(k2)}-${q}*(${jn(k1)}+${p}))/${p}`]], {
          unseen: [1],
          explain: `${V('x')}${V('y')}가 나오는 곱은 ${V('x')} × ${V('a')}${V('y')}, (−${p === 1 ? '' : p}${V('y')}) × ${V('x')}이므로 ${V('a')} − ${p} = ${tx(Q(k1))}, ${V('a')} = ${tx(Q(a))}이다. ${V('y')}가 나오는 곱은 (−${p === 1 ? '' : p}${V('y')}) × ${V('b')}, (−${q}) × ${V('a')}${V('y')}이므로 ${nb(`−${p === 1 ? '' : p}${V('b')} − ${q} × (${tx(Q(a))}) = ${tx(Q(k2))}`)}, ${V('b')} = ${tx(Q(b))}이다.`
        });
      }),
      H('hard-natural', '자연수 조건으로 정하는 계수', '심7', (d) => {
        // m(x + a)² + (nx + b)(x − r): x 의 계수 2ma + b − nr = k, a, b 는 자연수 → 2ma + b = T(2m < T ≤ 4m 이면 a = 1 하나)
        const [m, n, r, T] = d.until(() => { const mm = d.int(2, 3); return [mm, d.int(2, 6), d.int(2, 7), d.int(2 * mm + 1, 4 * mm)]; }, ([mm, nn, rr, tt]) => tt - nn * rr !== 0);
        const k = T - n * r, bv = T - 2 * m, cst = m - r * bv;
        return numQ1(`${xj(`${m}(x+a)^2+(${n}x+b)(x-${r})`, '을/를')} 간단히 하면 ${V('x')}의 계수가 ${tx(Q(k))}이다. ${V('a')}, ${V('b')}가 자연수일 때, 상수항은?`, cst, {
          calc: `${m}-${r}*(${jn(k)}+${n}*${r}-2*${m})`, unseen: [2],
          explain: `${V('x')}의 계수는 ${nb(`${2 * m}${V('a')} + ${V('b')} − ${n * r}`)}이므로 ${nb(`${2 * m}${V('a')} + ${V('b')} = ${T}`)}이다. ${V('a')}, ${V('b')}가 자연수이면 ${V('a')} = 1, ${V('b')} = ${bv}뿐이다(${V('a')} ≥ 2이면 ${V('b')} ≤ 0). 상수항은 ${nb(`${m}${V('a')}${sup(2)} − ${r}${V('b')} = ${m} − ${r * bv}`)} = ${tx(Q(cst))}이다.`
        });
      }),
      H('hard-x-inverse', '유리화한 x로 x² + 1/x²', '심9', (d) => {
        const [a, b] = d.pick([[3, 1], [2, 1], [5, 2], [6, 2], [11, 3], [3, 2], [7, 3], [14, 4], [5, 1], [13, 3], [10, 3]]);
        const s = (2 * (a + b * b)) / (a - b * b), v = s * s - 2, x = sDiv(sOf([1, a], [-b, 1]), sOf([1, a], [b, 1])), xi = sDiv(sOf([1, a], [b, 1]), sOf([1, a], [-b, 1]));
        return numQ1(`${V('x')} = ${nb(fr1(`${rt(a)} − ${b}`, `${rt(a)} + ${b}`))}일 때, ${nb(`${V('x')}${sup(2)} + ${frac(1, `${V('x')}${sup(2)}`)}`)}의 값은?`, v, {
          calc: `(2*(${a}+${b}*${b})/(${a}-${b}*${b}))*(2*(${a}+${b}*${b})/(${a}-${b}*${b}))-2`, unseen: [2],
          explain: `분모를 유리화하면 ${V('x')} = ${sH(x)}, ${frac(1, V('x'))} = ${sH(xi)}이므로 ${nb(`${V('x')} + ${frac(1, V('x'))} = ${tx(Q(s))}`)}이다. ${nb(`${V('x')}${sup(2)} + ${frac(1, `${V('x')}${sup(2)}`)} = (${V('x')} + ${frac(1, V('x'))})${sup(2)} − 2 = ${tx(Q(s * s))} − 2`)} = ${tx(Q(v))}이다.`
        });
      }),
      H('hard-int-part', '정수 부분·소수 부분과 합과 차의 곱', '심11', (d) => {
        const c = d.pick([2, 3, 5, 6, 7, 10, 11]), f = Math.floor(Math.sqrt(c)), Kv = 2 * f * d.int(3, 6);
        const ns = []; for (let n = 1; n < 100; n += 1) { const w = 2 * n * f - c; if (w > 0 && w < Kv) ns.push(n); }
        const term2 = `${2 * f}${rt(c)}`;
        return N(`양의 정수 ${V('n')}에 대하여 ${nb(`${V('n')} + ${rt(c)}`)}의 정수 부분을 ${V('A')}, 소수 부분을 ${V('B')}라 할 때, ${nb(`${V('n')}${sup(2)} + ${term2} &lt;`)} ${nb(`(${V('A')} + ${V('B')})(${V('A')} − ${V('B')})`)} ${nb(`&lt; ${Kv} + ${term2} + ${V('n')}${sup(2)}`)}을 만족시키는 ${V('n')}의 개수는?`, ns.length, {
          unit: '개',
          explain: `${f} &lt; ${rt(c)} &lt; ${f + 1}이므로 ${V('A')} = ${V('n')} + ${f}, ${V('B')} = ${rt(c)} − ${f}이다. ${nb(`${V('A')}${sup(2)} − ${V('B')}${sup(2)} = (${V('n')} + ${f})${sup(2)} − (${c + f * f} − ${term2}) = ${V('n')}${sup(2)} + ${2 * f}${V('n')} − ${c} + ${term2}`)}이므로 ${nb(`0 &lt; ${2 * f}${V('n')} − ${c} &lt; ${Kv}`)}이다. 이를 만족시키는 양의 정수 ${V('n')}은 ${ns.join(', ')}의 ${ns.length}개이다.`,
          facts: { check: { kind: 'int-part', c, K: Kv } }
        });
      }),
      H('hard-four-product', '네 일차식의 곱에 더해 완전제곱식 만들기', '심19', (d) => {
        // (x + p)(x + q)(x + r)(x + s) + k, p + s = q + r → (A + ps)(A + qr) + k, A = x² + (p + s)x
        const [p, q, r, s] = d.until(() => { const list = [nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6)].sort((x, y) => x - y); return [list[0], list[1], list[2], list[1] + list[2] - list[0]]; }, ([a, b, c, e]) => a < b && b < c && c < e && e !== 0 && e <= 9 && (b * c - a * e) % 2 === 0 && b * c !== a * e);
        const k = ((q * r - p * s) / 2) ** 2, src = `(x${sg(p)})(x${sg(q)})(x${sg(r)})(x${sg(s)})+k`;
        return numQ1(`${xj(src, '이/가')} 완전제곱식이 되도록 하는 수 ${V('k')}의 값은?`, k, {
          calc: `((${jn(q)}*${jn(r)}-${jn(p)}*${jn(s)})/2)*((${jn(q)}*${jn(r)}-${jn(p)}*${jn(s)})/2)`, unseen: [2],
          explain: `상수항의 합이 같은 두 짝 ${nb(`(${V('x')} ${p < 0 ? MINUS : '+'} ${Math.abs(p)})(${V('x')} ${s < 0 ? MINUS : '+'} ${Math.abs(s)})`)}, ${ej(nb(`(${V('x')} ${q < 0 ? MINUS : '+'} ${Math.abs(q)})(${V('x')} ${r < 0 ? MINUS : '+'} ${Math.abs(r)})`), '을/를')} 먼저 곱하면 ${pt(xv(`(x${sg(p)})(x${sg(s)})`))}, ${pt(xv(`(x${sg(q)})(x${sg(r)})`))}이다. ${xh(`x^2${sg(p + s, 'x')}`)} = ${V('A')}라 하면 ${nb(`(${V('A')} ${p * s < 0 ? MINUS : '+'} ${Math.abs(p * s)})(${V('A')} ${q * r < 0 ? MINUS : '+'} ${Math.abs(q * r)}) + ${V('k')}`)} = ${pt(xv(`A^2${sg(p * s + q * r, 'A')}${sg(p * s * q * r)}`))} + ${V('k')}이고, 이것이 완전제곱식이려면 ${V('k')} = ${k}이다.`
        });
      }),
      H('hard-telescoping', '1 − 1/n²을 잇달아 곱하기', '심25', (d) => {
        const m = d.int(2, 4), n = d.int(m + 5, 20), fq = Q((m - 1) * (n + 1), m * n);
        const fac = (k) => `(1 − ${frac(1, `${k}${sup(2)}`)})`, value = Array.from({ length: n - m + 1 }, (_, i) => `(1-1/(${m + i}*${m + i}))`).join('*');
        const hidden = Array.from({ length: n - m - 2 }, (_, i) => m + 2 + i);
        return F('인수분해 공식을 이용하여 다음을 계산하면?', fq.p, fq.q, {
          signed: true, anyForm: true, figure: ex(`${fac(m)} <i>×</i> ${fac(m + 1)} <i>×</i> ⋯ <i>×</i> ${fac(n - 1)} <i>×</i> ${fac(n)}`),
          explain: `${nb(`1 − ${frac(1, `${V('k')}${sup(2)}`)} = (1 − ${frac(1, V('k'))})(1 + ${frac(1, V('k'))}) = ${frac(`${V('k')} − 1`, V('k'))} × ${frac(`${V('k')} + 1`, V('k'))}`)}이므로 차례로 적으면 ${nb(`${frac(m - 1, m)} × ${frac(m + 1, m)} × ${frac(m, m + 1)} × ${frac(m + 2, m + 1)} × ⋯ × ${frac(n - 1, n)} × ${frac(n + 1, n)}`)}이고 이웃끼리 약분되어 ${frac(m - 1, m)} × ${frac(n + 1, n)} = ${frac(fq.p, fq.q)}이다.`,
          facts: { value, unseen: hidden.concat([1]) }
        });
      }),
      H('hard-four-consecutive', '연속하는 네 수의 곱에 1을 더한 제곱근', '심26', (d) => {
        const n = d.int(11, 60);
        return numQ1(`인수분해 공식을 이용하여 ${nb(rt(`${n} × ${n + 1} × ${n + 2} × ${n + 3} + 1`))}을 계산하면?`, n * n + 3 * n + 1, {
          calc: `${n}*${n + 3}+1`,
          explain: `${V('x')} = ${n}${tail(n, '이라/라')} 하면 ${nb(`${V('x')}(${V('x')} + 3) × (${V('x')} + 1)(${V('x')} + 2) + 1 = (${V('x')}${sup(2)} + 3${V('x')})(${V('x')}${sup(2)} + 3${V('x')} + 2) + 1`)}이다. ${nb(`${V('x')}${sup(2)} + 3${V('x')} = ${V('A')}`)}라 하면 ${nb(`${V('A')}(${V('A')} + 2) + 1 = (${V('A')} + 1)${sup(2)}`)}이므로 구하는 값은 ${nb(`${n} × ${n + 3} + 1`)} = ${n * n + 3 * n + 1}이다.`
        });
      }),
      H('hard-power-diff', '2ⁿ − 1을 나누는 두 자연수', '심28', (d) => {
        const [E, lo, hi] = d.pick([[40, 30, 40], [20, 30, 40], [30, 30, 40], [24, 60, 70], [36, 60, 70], [48, 60, 70]]);
        const modpow = (base, e, mod) => { let r = 1 % mod, b = base % mod, x = e; while (x > 0) { if (x & 1) r = (r * b) % mod; b = (b * b) % mod; x >>= 1; } return r; };
        const divs = []; for (let v = lo + 1; v < hi; v += 1) if (modpow(2, E, v) === 1) divs.push(v);
        if (divs.length !== 2) throw new Error('두 수가 아니다: ' + E);
        const k = lo < 50 ? 5 : 6;
        return M(`자연수 ${nb(`2${sup(E)} − 1`)}은 ${lo}${tail(lo, '과/와')} ${hi} 사이의 두 자연수로 나누어떨어진다. 이 두 자연수는?`, [{ answer: divs[0] }, { answer: divs[1] }], {
          unordered: true,
          explain: `${nb(`2${sup(E)} − 1 = (2${sup(E / 2)} + 1)(2${sup(E / 2)} − 1)`)}처럼 제곱의 차를 거듭 쓰면 ${nb(`2${sup(k)} − 1 = ${2 ** k - 1}`)}${tail(2 ** k - 1, '과/와')} ${nb(`2${sup(k)} + 1 = ${2 ** k + 1}`)}${tail(2 ** k + 1, '이/가')} 인수로 나온다(${E}${tail(E, '이/가')} ${2 * k}의 배수). ${lo}${tail(lo, '과/와')} ${hi} 사이에서 ${nb(`2${sup(E)} − 1`)}을 나누는 수는 ${divs.join(', ')}이다.`,
          facts: { calc: [[`2**${k}-1`, 0], [`2**${k}+1`, 1]], unseen: [k, 1] }
        });
      }),
      H('hard-four-letters', '공통인수로 묶은 뒤 합과 곱으로 값 구하기', '심29', (d) => {
        const [s1, p1, s2, p2] = d.until(() => [nz(d, -5, 5), nz(d, -6, 6), nz(d, -5, 5), nz(d, -6, 6)], ([a, b, c, e]) => { const v = (a * a - 2 * b) * (c * c - 2 * e); return v !== 0 && Math.abs(v) <= 9999 && a * a - 2 * b > 0 && c * c - 2 * e > 0; });
        const v = (s1 * s1 - 2 * p1) * (s2 * s2 - 2 * p2), src = 'a^2x^2+b^2x^2+a^2y^2+b^2y^2';
        return numQ1(`${nb(`${V('a')} + ${V('b')} = ${tx(Q(s1))}`)}, ${nb(`${V('a')}${V('b')} = ${tx(Q(p1))}`)}, ${nb(`${V('x')} + ${V('y')} = ${tx(Q(s2))}`)}, ${nb(`${V('x')}${V('y')} = ${tx(Q(p2))}`)}일 때, ${xh(src)}의 값은?`, v, {
          calc: `(${jn(s1)}*${jn(s1)}-2*${jn(p1)})*(${jn(s2)}*${jn(s2)}-2*${jn(p2)})`, unseen: [2],
          explain: `${xh(src)} = ${xh('a^2(x^2+y^2)+b^2(x^2+y^2)')} = ${xh('(a^2+b^2)(x^2+y^2)')}이다. ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)} = (${V('a')} + ${V('b')})${sup(2)} − 2${V('a')}${V('b')} = ${s1 * s1 - 2 * p1}`)}, ${nb(`${V('x')}${sup(2)} + ${V('y')}${sup(2)} = ${s2 * s2 - 2 * p2}`)}이므로 ${tx(Q(v))}이다.`
        });
      }),
      H('hard-square-perimeters', '두 정사각형의 둘레의 합과 넓이의 합으로 둘레의 곱', '기본 ①37', (d) => {
        const [x, y] = d.until(() => [d.int(2, 15), d.int(2, 15)], ([a, b]) => a !== b && 16 * a * b <= 9999);
        const P = 4 * (x + y), S = x * x + y * y, v = 16 * x * y;
        return numQ1(`한 변의 길이가 각각 ${V('x')}, ${V('y')}인 두 정사각형이 있다. 두 정사각형의 둘레의 길이의 합은 ${P}이고, 넓이의 합은 ${S}이다. 두 정사각형의 둘레의 길이의 곱은?`, v, {
          calc: `8*((${P}/4)*(${P}/4)-${S})`, unseen: [8, 4],
          explain: `${nb(`4${V('x')} + 4${V('y')} = ${P}`)}에서 ${nb(`${V('x')} + ${V('y')} = ${x + y}`)}이다. ${nb(`(${V('x')} + ${V('y')})${sup(2)} = ${V('x')}${sup(2)} + ${V('y')}${sup(2)} + 2${V('x')}${V('y')}`)}이므로 ${nb(`${(x + y) ** 2} = ${S} + 2${V('x')}${V('y')}`)}, ${nb(`${V('x')}${V('y')} = ${x * y}`)}이다. 둘레의 길이의 곱은 ${nb(`4${V('x')} × 4${V('y')} = 16${V('x')}${V('y')}`)} = ${v}이다.`
        });
      }),
      H('hard-alternating', '제곱의 차를 짝지어 더하기', '기본 ①80', (d) => {
        // 홀수의 제곱을 번갈아 더하고 빼기(1² − 3² + 5² − ⋯) 또는 짝수의 제곱(2² − 4² + 6² − ⋯), 2M 개
        const odd = d.bool(), Mv = d.int(3, 7), nums = Array.from({ length: 2 * Mv }, (_, i) => (odd ? 2 * i + 1 : 2 * i + 2));
        const v = nums.reduce((sum, n, i) => sum + (i % 2 ? -1 : 1) * n * n, 0);
        const shown = nums.slice(0, 4).map((n, i) => (i ? (i % 2 ? ' − ' : ' + ') : '') + n + sup(2)).join('') + ' + ⋯ + ' + nums[nums.length - 2] + sup(2) + ' − ' + nums[nums.length - 1] + sup(2);
        const first = nums[0], second = nums[1];
        return N(`${nb(shown)}을 계산하면?`, v, {
          signed: true, explain: `두 수씩 짝지으면 ${nb(`(${first}${sup(2)} − ${second}${sup(2)}) + ⋯ + (${nums[nums.length - 2]}${sup(2)} − ${nums[nums.length - 1]}${sup(2)})`)}이고, 각 짝은 ${nb(`(${first} + ${second})(${first} − ${second}) = −2 × ${first + second}`)}처럼 −2 × (두 수의 합)이다. 짝의 합을 모두 더하면 ${nb(`−2 × (${nums.filter((_, i) => i % 2 === 0).map((n, i) => n + nums[2 * i + 1]).join(' + ')})`)} = ${tx(Q(v))}이다.`,
          facts: { value: nums.map((n, i) => (i % 2 ? '-' : (i ? '+' : '')) + n + '*' + n).join(''), unseen: nums.slice(4, -2) }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
