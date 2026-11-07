// 미적분Ⅰ Ⅱ-1 미분계수와 도함수 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-3a.js 머리에 적었다. 도구는 B.kit.u23x(a 파일)와 B.kit.u23b(b 파일)를 쓴다.
// ref: ①n = 기본꼴_1의 n번(이 단원은 심화 문서가 없어 학기 시험·중단원 평가·소단원 평가의 끝 문제와 교과서 발전 문제에서 골랐다).
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 극한식에서 h 앞의 계수(2h, −h)를 분모에 맞추지 않고 극한값을 그대로 f′(a)로 적는다.
//  - (f(x) − f(a))/(x² − a²)의 극한을 f′(a)로 읽는다(x + a로 나누는 것을 빠뜨린다).
//  - 연속이면 미분가능하다고 여긴다. 대칭인 두 점을 지나는 직선의 극한을 접선으로 여긴다(꺾인 점에서도 그 극한은 있다).
//  - f′(1)처럼 식 안에 든 미분계수를 변수처럼 미분한다(상수임을 잊는다).
//  - 그래프가 y축에 대칭인 함수에서 f′(−a) = f′(a)로 적는다(부호가 바뀐다).
//  - 곱의 미분을 (fg)′ = f′g′로 적는다. f(x)f′(x)의 차수를 2n으로 센다(도함수의 차수는 하나 낮다).
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, C } = B.kit;
  const { MINUS, tail, V, sup, tag, nz, poly } = B.kit.mid;
  const { ms, lim, jh, hx } = B.kit.hs;
  const K = B.kit.u23x, K2 = B.kit.u23b, nb = K.nb;   // 긴 식은 기호 앞에서 줄이 갈릴 수 있게 나눠 붙인다(11-2-3a.js)
  const { S1, S2, S4, HT, X, Hh, Av, Bv, sT, pp, jn, minus, fa, dfa, xm, qT, cf, pH, fval, dcs, val, slots, oneQ } = K;
  const { xs, FX, probe } = K2;
  const Q = B.kit.mid.Q;
  const ga = (t) => '<span class="mb-tag mb-tag-short">' + t + '</span>';   // 조건의 ㈎·㈏

  const hard = [
    // ② 극한 조건 → f(1), f′(1) → 계수 a, b → 새 극한식을 f′(2), f(2)로 가름: 네 단계 넘게 잇는다(중단원 평가의 끝 문제, 교과서 발전 문제).
    HT('hard-chain', '극한 조건으로 계수를 정해 다른 극한값 구하기', '①14', (d, n) => {
      if (n === 0) {
        const c = d.pick([1, 2, -1]), a = nz(d, -4, 4), b = nz(d, -5, 5), s = c + a, f1d = 3 * c + 2 * a + b;
        if (f1d % 2 !== 0 || s === 0) return null;
        const k = -f1d / 2, cs = [-b, b, a, c], f2 = fval(cs, 2), f2d = fval(dcs(cs), 2), ans = 2 * f2d - f2;
        const aE = `(${jn(s)}-${jn(c)})`, bE = `(-2*${jn(k)}-3*${jn(c)}-2*${aE})`;
        const fShow = `${poly([[c, X + sup(3)]])} + ${Av}${X}${sup(2)} + ${Bv}${X} − ${Bv}`;
        return val(`함수 ${nb(FX + ' =')} ${fShow}가 ㉠을 만족시킬 때, ㉡의 값은? (단, ${Av}, ${Bv}는 상수)`, ans, {
          figure: lines([tag('㉠') + hx(lim('h→0', frac(ms(minus('f(1 - h)', s)), ms('2h'))) + ' = ' + sT(k)), tag('㉡') + hx(lim('x→1', frac(ms('f(2x) - xf(2)'), ms('x - 1'))))]),
          explain: `㉠에서 분자가 0으로 가야 하므로 ${nb(fa(1) + ' = ' + sT(s))}이고, (㉠의 식) = ${nb(qT(Q(-1, 2)) + ' × ' + lim('h→0', frac(ms('f(1 - h) - f(1)'), ms('-h'))) + ' = ' + qT(Q(-1, 2)) + dfa(1))}이므로 ${nb(dfa(1) + ' = ' + sT(f1d))}이다. ${nb(fa(1) + ' = ' + poly([[c, ''], [1, Av]]))}, ${nb(dfa(1) + ' = ' + poly([[3 * c, ''], [2, Av], [1, Bv]]))}에서 ${nb(ms('a') + ' = ' + sT(a))}, ${nb(ms('b') + ' = ' + sT(b))}이다. ㉡의 분자에서 ${jh(fa(2), '을/를')} 빼고 더하면 (㉡의 식) = ${nb('2' + dfa(2) + ' − ' + fa(2))}이고, ${nb(fa(2) + ' = ' + sT(f2))}, ${nb(dfa(2) + ' = ' + sT(f2d))}이므로 답은 ${sT(ans)}이다.`,
          value: `2*(3*${jn(c)}*2*2+2*${aE}*2+${bE})-(${jn(c)}*2*2*2+${aE}*2*2+${bE}*2-${bE})`, derived: [2, 3]
        });
      }
      const p = d.pick([2, -2, 3]), q = p * p, s = nz(d, -4, 4), k = nz(d, -4, 4) * (p === 3 ? 2 : 1), ans = -(q * q * k) / (2 * p) + 2 * q * s;
      return val(`미분가능한 함수 ${FX}가 ㉠을 만족시킬 때, ㉡의 값은?`, ans, {
        figure: lines([tag('㉠') + hx(lim('x→' + p, frac(ms(minus('f(x^2)', s)), xm(p))) + ' = ' + sT(k)), tag('㉡') + hx(lim('x→' + q, frac(ms('x^2 f(' + q + ') - ' + q * q + 'f(x)'), xm(q))))]),
        explain: `㉠에서 분자가 0으로 가야 하므로 ${nb(fa(q) + ' = ' + sT(s))}이고, (㉠의 식) = ${lim('x→' + p, frac(ms('f(x^2) - f(' + q + ')'), ms('x^2 - ' + q)))} × ${nb('(' + xm(-p) + ')')} = ${nb(sT(2 * p) + dfa(q))}이므로 ${nb(dfa(q) + ' = ' + qT(Q(k, 2 * p)))}이다. ㉡의 분자에서 ${jh(ms('x^2 f(x)'), '을/를')} 빼고 더하면 ${nb(MINUS + ms('x^2') + '{' + ms('f(x) - f(' + q + ')') + '} + ' + FX + '(' + ms('x^2 - ' + q * q) + ')')}이므로 (㉡의 식) = ${nb(MINUS + q * q + dfa(q) + ' + ' + 2 * q + fa(q))} = ${sT(ans)}이다.`,
        value: `-${q}*${q}*${jn(k)}/(2*${jn(p)})+2*${q}*${jn(s)}`, derived: [2]
      });
    }, { count: 2, standard: S1 }),

    // ① 관계식에 0을 넣어 f(0)을 먼저 구하고, 차분몫을 f(h)/h 로 바꾸어야 풀린다(교과서 중단원 점검의 발전 문제).
    HT('hard-func-eq', '관계식으로 정해진 함수의 미분계수', '①15', (d) => {
      const m = d.pick([1, -1, 2, -2, 3]), c = nz(d, -5, 5), a = d.pick([2, 3, -1, -2, 4]), ans = c + m * a;
      const rel = nb(ms('f(x + y)') + ' = ' + ms('f(x) + f(y)') + ' ' + (m < 0 ? MINUS : '+') + ' ' + (Math.abs(m) === 1 ? '' : Math.abs(m)) + ms('xy'));
      return val(`미분가능한 함수 ${FX}가 모든 실수 ${X}, ${V('y')}에 대하여 ${jh(rel, '을/를')} 만족시키고 ${nb(ms("f'(0) = " + c))}일 때, ${dfa(a)}의 값은?`, ans, {
        explain: `${nb(ms('x = y = 0'))}을 넣으면 ${nb(fa(0) + ' = 2' + fa(0))}이므로 ${nb(fa(0) + ' = 0')}이다. ${nb(dfa(a) + ' = ' + lim('h→0', frac(ms('f(' + a + ' + h) - f(' + a + ')'), Hh)) + ' = ' + lim('h→0', frac(ms('f(h)') + ' ' + (m * a < 0 ? MINUS + ' ' : '+ ') + (Math.abs(m * a) === 1 ? '' : Math.abs(m * a)) + Hh, Hh)))}이고, ${nb(lim('h→0', frac(ms('f(h)'), Hh)) + ' = ' + lim('h→0', frac(ms('f(h) - f(0)'), Hh)) + ' = ' + ms("f'(0)"))}이므로 ${nb(dfa(a) + ' = ' + sT(c) + ' ' + (m * a < 0 ? MINUS + ' ' + Math.abs(m * a) : '+ ' + m * a) + ' = ' + sT(ans))}이다.`,
        value: `${jn(c)}+${jn(m)}*${jn(a)}`
      });
    }, { standard: S1 }),

    // ① 대칭인 두 점을 지나는 직선의 극한이 있어도 접선이 없을 수 있다(꺾인 점) — 미분계수의 뜻을 정확히 대야 가린다(교과서 생각 넓히기).
    HT('hard-sym', '대칭인 두 점을 지나는 직선의 극한과 접선', '①22', (d) => {
      const p = d.int(-2, 3), q = d.int(-3, 3), u = xs(p);
      const tailQ = q === 0 ? '' : q < 0 ? ' - ' + (-q) : ' + ' + q;
      const good = d.shuffle([
        { h: ms('(' + u + ')^2' + tailQ), f: (x) => (x - p) ** 2 + q },
        { h: ms('-(' + u + ')^2' + tailQ), f: (x) => -((x - p) ** 2) + q },
        { h: ms('(' + u + ')^4' + tailQ), f: (x) => (x - p) ** 4 + q },
        { h: ms('2(' + u + ')^2' + tailQ), f: (x) => 2 * (x - p) ** 2 + q }
      ]).slice(0, 3);
      const bad = d.pick([{ h: ms('|' + u + '|' + tailQ), f: (x) => Math.abs(x - p) + q }, { h: ms('-|' + u + '|' + tailQ), f: (x) => -Math.abs(x - p) + q }, { h: ms('2|' + u + '|' + tailQ), f: (x) => 2 * Math.abs(x - p) + q }]);
      const rows = good.concat([bad]).map((r) => { const pr = probe(r.f, p); return { h: nb(FX + ' = ' + r.h), ok: !pr.diff }; });
      const lo = K.lin2(p, -1, 'Δx'), hi = K.lin2(p, 1, 'Δx'), A = ms('A(' + lo + ', f(' + lo + '))'), Bp = ms('B(' + hi + ', f(' + hi + '))');
      const quote = lines([`두 점 ${A}, ${Bp}를 지나는 직선 AB는 ${ms('Δx → 0')}일 때 직선 ${nb(ms('y = f(' + p + ')'))}에 한없이 가까워진다.`, `따라서 함수 ${nb(ms('y = f(x)'))}의 그래프 위의 점 ${ms('P(' + p + ', f(' + p + '))')}에서의 접선은 직선 ${nb(ms('y = f(' + p + ')'))}이다.`]);
      return oneQ(d, `모든 실수 ${X}에서 연속인 함수 ${nb(ms('y = f(x)'))}의 그래프가 직선 ${nb(ms('x = ' + p))}에 대하여 대칭일 때, 한 학생이 다음과 같이 말하였다. 이 학생의 결론이 옳지 않음을 보여 주는 함수 ${FX}는?`, rows, true, {
        figure: quote,
        explain: `${bad.h}의 그래프도 직선 ${nb(ms('x = ' + p))}에 대하여 대칭이라 직선 AB는 늘 ${X}축에 평행하지만, ${nb(ms('x = ' + p))}의 양쪽에서 구한 차분몫의 극한이 서로 달라 미분가능하지 않으므로 점 P에서의 접선이 없다. 나머지 함수는 ${nb(ms('x = ' + p))}에서의 미분계수가 0이라 접선이 직선 ${nb(ms('y = f(' + p + ')'))}이다.`
      });
    }, { standard: S2 }),

    // ② 극한 조건(분모 x² − a²) → f(a) → f′(a) → 곱의 미분 → 대입: 네 단계를 잇는다(대단원 평가의 서술형).
    HT('hard-prod-chain', '극한 조건으로 곱의 미분계수 구하기(분모가 x² − a²)', '①35', (d) => {
      const p = nz(d, -3, 3), s = nz(d, -4, 4), k = nz(d, -4, 4), m = nz(d, -3, 3), n2 = nz(d, -5, 5), fd = 2 * p * k, ans = m * s + (m * p + n2) * fd;
      return val(`다항함수 ${FX}가 다음을 만족시킨다. 함수 ${ms('g(x)')}를 ${nb(ms('g(x)') + ' = (' + pH([n2, m]) + ')' + FX)}라 할 때, ${dfa(p, 'g')}의 값은?`, ans, {
        figure: hx(lim('x→' + p, frac(ms(minus('f(x)', s)), ms('x^2 - ' + p * p))) + ' = ' + sT(k)),
        explain: `분자가 0으로 가야 하므로 ${nb(fa(p) + ' = ' + sT(s))}이고, (주어진 식) = ${nb(lim('x→' + p, frac(ms('f(x) - f(' + p + ')'), xm(p))) + ' × ' + frac(1, xm(-p)) + ' = ' + frac(dfa(p), sT(2 * p)))}이므로 ${nb(dfa(p) + ' = ' + sT(fd))}이다. ${nb(ms("g'(x)") + ' = ' + cf(m, FX) + ' + (' + pH([n2, m]) + ')' + ms("f'(x)"))}이므로 ${nb(dfa(p, 'g') + ' = ' + sT(m) + ' × ' + pp(s) + ' + ' + pp(m * p + n2) + ' × ' + pp(fd) + ' = ' + sT(ans))}이다.`,
        value: `${jn(m)}*${jn(s)}+(${jn(m)}*${jn(p)}+${jn(n2)})*2*${jn(p)}*${jn(k)}`, derived: [2]
      });
    }, { standard: S4 }),

    // ① 그래프가 y축에 대칭인 함수의 미분계수는 부호가 바뀐다(f′(−a) = −f′(a)) — 정의로 따져야 가린다(중단원 평가).
    HT('hard-even', '그래프가 y축에 대칭인 함수의 미분계수', '①38', (d) => {
      const p = d.pick([1, 2, 3]), s = nz(d, -5, 5), k = nz(d, -5, 5);
      return slots(`다항함수 ${FX}가 다음 조건을 만족시킬 때, ${jh(fa(-p), '과/와')} ${dfa(-p)}의 값은?`, `${fa(-p)} = {0}, ${dfa(-p)} = {1}`, [[s, jn(s)], [-k, `-(${jn(k)})`]], {
        shown: `${fa(-p)} = ${sT(s)}, ${dfa(-p)} = ${sT(-k)}`,
        figure: lines([ga('㈎') + `모든 실수 ${X}에 대하여 ${nb(ms('f(-x) = f(x)'))}이다.`, ga('㈏') + hx(lim('x→' + p, frac(ms(minus('f(x)', s)), xm(p))) + ' = ' + sT(k))]),
        explain: `㈏에서 분자가 0으로 가야 하므로 ${nb(fa(p) + ' = ' + sT(s))}, ${nb(dfa(p) + ' = ' + sT(k))}이다. ㈎에서 ${nb(fa(-p) + ' = ' + fa(p) + ' = ' + sT(s))}이고, ${nb(dfa(-p) + ' = ' + lim('h→0', frac(ms('f(' + -p + ' + h) - f(' + -p + ')'), Hh)) + ' = ' + lim('h→0', frac(ms('f(' + p + ' - h) - f(' + p + ')'), Hh)) + ' = ' + MINUS + dfa(p) + ' = ' + sT(-k))}이다.`
      });
    }, { standard: S1 }),

    // ① 도함수의 차수가 하나 낮다는 것으로 f 의 차수를 먼저 정해야 풀린다(중단원 평가의 끝 문제).
    HT('hard-degree', 'f(x)f′(x)의 차수로 다항함수 정하기', '①39', (d) => {
      const a = nz(d, -4, 4), b = nz(d, -5, 5), r = d.int(-3, 3), ans = r * r + a * r + b, cs = [a * b, a * a + 2 * b, 3 * a, 2];
      const aE = `(${jn(3 * a)}/3)`, bE = `(${jn(a * b)}/${aE})`;
      return val(`최고차항의 계수가 1인 다항함수 ${FX}가 ${jh(nb(ms("f(x)f'(x)") + ' = ' + pH(cs)), '을/를')} 만족시킬 때, ${fa(r)}의 값은?`, ans, {
        explain: `${FX}가 ${V('n')}차식이면 ${ms("f'(x)")}는 ${nb('(' + ms('n - 1') + ')')}차식이므로 ${nb(ms('n + (n - 1) = 3'))}에서 ${nb(ms('n') + ' = 2')}이다. ${nb(FX + ' = ' + ms('x^2 + ax + b'))}라 하면 ${nb(ms("f(x)f'(x)") + ' = ' + ms('2x^3 + 3ax^2 + (a^2 + 2b)x + ab'))}이므로 계수를 비교하면 ${nb(ms('a') + ' = ' + sT(a))}, ${nb(ms('b') + ' = ' + sT(b))}이다. 따라서 ${nb(fa(r) + ' = ' + sT(ans))}이다.`,
        value: `${jn(r)}*${jn(r)}+${aE}*${jn(r)}+${bE}`, derived: [2, 3]
      });
    }, { standard: S4 }),

    // ② 합성한 식을 전개해 항등식으로 계수를 비교하고(세 식) 남은 상수를 조건으로 정한다: 네 단계를 잇는다(소단원 평가의 끝 문제).
    HT('hard-ff', "f(f′(x)) = f′(f(x))를 만족시키는 이차함수", '①40', (d) => {
      const p = d.pick([2, -2, 4, -4]), s = d.int(-5, 6), q = d.pick([2, -2, 4, -4, 6].filter((v) => v !== p)), c = s - (p * p) / 2, ans = (q * q) / 2 + c;
      return val(`이차함수 ${FX}가 모든 실수 ${X}에 대하여 ${nb(ms("f(f'(x)) = f'(f(x))"))}를 만족시키고 ${nb(fa(p) + ' = ' + sT(s))}일 때, ${fa(q)}의 값은?`, ans, {
        explain: `${nb(FX + ' = ' + ms('ax^2 + bx + c'))} (${nb(ms('a != 0'))})라 하면 ${nb(ms("f'(x) = 2ax + b"))}이다. ${ms("f(f'(x))")}의 ${X}${sup(2)}의 계수는 ${nb(ms('4a^3'))}, ${ms("f'(f(x))")}의 ${X}${sup(2)}의 계수는 ${nb(ms('2a^2'))}이므로 ${nb(ms('a') + ' = ' + frac(1, 2))}이다. ${X}의 계수를 비교하면 ${nb(ms('4a^2 b + 2ab = 2ab'))}에서 ${nb(ms('b = 0'))}이므로 ${nb(FX + ' = ' + frac(1, 2) + X + sup(2) + ' + ' + V('c'))}이다. ${nb(fa(p) + ' = ' + sT(s))}에서 ${nb(ms('c') + ' = ' + sT(c))}이므로 ${nb(fa(q) + ' = ' + sT(ans))}이다.`,
        value: `${jn(q)}*${jn(q)}/2+${jn(s)}-${jn(p)}*${jn(p)}/2`, derived: [2]
      });
    }, { standard: S4 }),

    // ① f(p) = f(q) = f(r) = k 이면 f(x) − k 가 세 일차식의 곱이라는 것을 세워야 풀린다. n = 1 은 f′(q) 조건으로 a 를 먼저 구해 한 단계 더 잇는다(학기 시험).
    HT('hard-cubic3', '세 점에서 함숫값이 같은 삼차함수의 미분계수', '①41', (d, n) => {
      if (n === 0) {
        const pts = d.shuffle([-3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 3).sort((x, y) => x - y), t = d.pick(pts), o = pts.filter((v) => v !== t), ans = (t - o[0]) * (t - o[1]);
        return val(`최고차항의 계수가 1인 삼차함수 ${FX}에 대하여 ${nb(fa(pts[0]) + ' = ' + fa(pts[1]) + ' = ' + fa(pts[2]))}일 때, ${dfa(t)}의 값은?`, ans, {
          explain: `세 값을 ${V('k')}라 하면 ${nb(ms('f(x) - k') + ' = ' + pts.map((v) => '(' + ms(xs(v)) + ')').join(''))}이다. 양변을 미분하면 ${dfa('x')}는 세 일차식 가운데 두 개씩 곱한 것의 합이고, ${nb(ms('x = ' + t) + tail(Math.abs(t), '을/를'))} 넣으면 ${nb('(' + ms(xs(t)) + ')')}이 든 두 항이 0이 되어 ${nb(dfa(t) + ' = ' + pp(t - o[0]) + ' × ' + pp(t - o[1]) + ' = ' + sT(ans))}이다.`,
          value: `(${jn(t)}-(${jn(o[0])}))*(${jn(t)}-(${jn(o[1])}))`
        });
      }
      const q = d.int(-2, 3), r = q + d.pick([2, 3, -2]), a = d.int(-3, 4);
      if (a === q || a === r) return null;
      const t = (q - a) * (q - r), ans = (a - q) * (a - r), aE = `(${jn(q)}-${jn(t)}/(${jn(q)}-(${jn(r)})))`;
      return val(`최고차항의 계수가 1인 삼차함수 ${FX}와 실수 ${Av}가 다음 조건을 만족시킬 때, ${dfa('a')}의 값은?`, ans, {
        figure: lines([ga('㈎') + nb(fa('a') + ' = ' + fa(q) + ' = ' + fa(r)), ga('㈏') + nb(dfa(q) + ' = ' + sT(t))]),
        explain: `세 값을 ${V('k')}라 하면 ${nb(ms('f(x) - k = (x - a)') + '(' + ms(xs(q)) + ')(' + ms(xs(r)) + ')')}이다. 양변을 미분해 ${nb(ms('x = ' + q) + tail(Math.abs(q), '을/를'))} 넣으면 ${nb(dfa(q) + ' = (' + sT(q) + ' − ' + Av + ') × ' + pp(q - r) + ' = ' + sT(t))}에서 ${nb(ms('a') + ' = ' + sT(a))}이다. 같은 방법으로 ${nb(dfa('a') + ' = ' + '(' + ms('a') + ' − ' + pp(q) + ')(' + ms('a') + ' − ' + pp(r) + ') = ' + pp(a - q) + ' × ' + pp(a - r) + ' = ' + sT(ans))}이다.`,
        value: `(${aE}-(${jn(q)}))*(${aE}-(${jn(r)}))`
      });
    }, { count: 2, standard: S4 }),

    // ② 나머지의 꼴 → 계수 → x³ − 1 인수분해 → 미분계수: 네 단계를 잇는다(학기 시험 4점).
    HT('hard-rem-limit', '나머지를 구해 그 나머지의 미분계수로 극한값 구하기', '①44', (d) => {
      const p = d.pick([2, 3, -1, -2]), c = nz(d, -3, 3);
      if ((2 * c * (1 - p)) % 3 !== 0) return null;
      const s = c * (1 - p) * (1 - p), ans = (2 * c * (1 - p)) / 3, cE = `${jn(s)}/((1-${jn(p)})*(1-${jn(p)}))`;
      return val(`다항식 ${FX}는 ${nb('(' + ms(xs(p)) + ')' + sup(2) + '으로')} 나누어떨어지고, ${nb(ms('x - 1') + '로')} 나누었을 때의 나머지가 ${sT(s)}이다. ${FX}를 ${nb('(' + ms(xs(p)) + ')' + sup(2) + '(' + ms('x - 1') + ')' + '로')} 나누었을 때의 나머지를 ${ms('g(x)')}라 할 때, 다음 극한값은?`, ans, {
        figure: hx(lim('x→1', frac(ms('g(x) - g(1)'), ms('x^3 - 1')))),
        explain: `${nb(FX + ' = (' + ms(xs(p)) + ')' + sup(2) + '(' + ms('x - 1') + ')' + ms('Q(x) + g(x)'))}에서 ${FX}와 앞의 항이 모두 ${nb('(' + ms(xs(p)) + ')' + sup(2))}으로 나누어떨어지므로 ${nb(ms('g(x)') + ' = ' + V('c') + '(' + ms(xs(p)) + ')' + sup(2))} 꼴이다. ${nb(fa(1) + ' = ' + fa(1, 'g') + ' = ' + sT(s))}에서 ${nb(ms('c') + ' = ' + sT(c))}이다. (주어진 식) = ${nb(lim('x→1', frac(ms('g(x) - g(1)'), ms('x - 1'))) + ' × ' + frac(1, ms('x^2 + x + 1')) + ' = ' + frac(dfa(1, 'g'), 3))}이고 ${nb(dfa(1, 'g') + ' = 2 × ' + pp(c) + ' × ' + pp(1 - p) + ' = ' + sT(2 * c * (1 - p)))}이므로 답은 ${sT(ans)}이다.`,
        value: `2*${cE}*(1-${jn(p)})/3`, derived: [2, 3]
      });
    }, { standard: S4 })
  ];

  B.addGroup('11-2-3', { id: 'hard', title: '실력 문제', standard: S1, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
