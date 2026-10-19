// 고1 1학기 5단원 여러 가지 방정식 — 뒤쪽 묶음(연립이차방정식). 단원 틀과 도구는 10-1-5a.js 에 있다(B.kit.m1015).
// 싣는 기준과 뺀 것은 10-1-5a.js 머리에 모아 적었다. ref: ②n = 기본꼴_2의 n번.
//  - 해는 「x = [±][ ], y = [±][ ]」 칸의 짝으로 받고, 해가 여러 쌍이면 짝째 차례를 바꾸어 적어도 맞다(칸 묶음).
//  - (이차)·(이차) 꼴은 해가 늘 (x, y)와 (−x, −y)의 짝으로 나와 부호를 모두 바꾼 답이 맞게 되므로, 「x > 0인 해」를 묻거나 고르기로 낸다.
//  - 분수가 낀 해와 근호·허수가 낀 해의 묶음은 고르기로 낸다. 보기의 옳고 그름은 코드가 대입하여 가린다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, tx, nb, tail, V, sup, fit, rt, grp, sqParts, ineqAns, sys } = B.kit.mid;
  const { STD2, X, Y, I, va, vb, vk, iq, sT, range, isSq, stripH, T, sumH, termH, eqH, emW, keep, endJ, choose, valsQ, quad } = B.kit.m1015;
  const { Board, dist } = B.kit.mgeo;
  const X2 = X + sup(2), Y2 = Y + sup(2), XY = X + Y;

  // 이차식 A x² + B xy + C y² + D x + E y 의 글
  const formH = (A, Bc, Cc, Dc, Ec) => sumH([[A, X2], [Bc, XY], [Cc, Y2], [Dc || 0, X], [Ec || 0, Y]]);
  const formV = (A, Bc, Cc, x, y, Dc, Ec) => A * x * x + Bc * x * y + Cc * y * y + (Dc || 0) * x + (Ec || 0) * y;
  // 연립방정식(식이 길면 글씨를 줄인다)
  function sysQ(rows) {
    const width = Math.max(...rows.map(emW)) + 1.2, size = Math.min(1.15, 16 / width);
    return `<span style="font-size:${Math.max(size, 0.78).toFixed(2)}em">${sys(rows)}</span>`;
  }
  const sysT = (rows) => '연립방정식 ' + sysQ(rows);
  // 해의 짝 글
  const pairH = (x, y) => nb(`${X} = ${typeof x === 'number' ? iq(x) : x}, ${Y} = ${typeof y === 'number' ? iq(y) : y}`);
  const pairsH = (list) => list.map(([x, y]) => pairH(x, y)).join(' 또는 ');
  // 정수 해의 짝들을 답하는 문항: 짝째 차례를 바꾸어도 맞다. xSigned: x 칸에 부호 단추를 다는가
  function pairAns(text, pairs, o) {
    const opt = o || {}, tpl = [], inputs = [], calc = [], derived = [];
    pairs.forEach(([x, y], i) => {
      tpl.push(grp(`${X} = {${2 * i}}, ${Y} = {${2 * i + 1}}`));
      inputs.push({ answer: x, signed: opt.xSigned !== false }, { answer: y, signed: true });
      calc.push([x < 0 ? `0-${-x}` : String(x), 2 * i], [y < 0 ? `0-${-y}` : String(y), 2 * i + 1]); derived.push(x, y);
    });
    const more = { shown: pairsH(pairs), figure: opt.figure, explain: opt.explain, facts: Object.assign({ calc, derived }, opt.facts || {}) };
    if (pairs.length > 1) more.blocks = pairs.map((_, i) => [2 * i, 2 * i + 1]);
    return inline(text, tpl.join(' 또는 '), inputs, more);
  }
  // 짝들의 집합이 부호를 모두 바꾼 집합과 같은가
  const symPairs = (pairs) => pairs.every(([x, y]) => pairs.some(([u, w]) => u === -x && w === -y));
  // 직선 y = mx + n 을 글로(꼴을 고른다): 'y'  y = mx + n / 'std'  mx − y = −n
  const lineH = (m, n, kind) => (kind === 'y' ? eqH(Y, sumH([[m, X], [n, '']])) : eqH(sumH([[m, X], [-1, Y]]), iq(-n)));

  B.addTypes('10-1-5', 'lin', [
    T('lin-int', '일차식을 이차식에 대입하여 풀기', '②1', (d) => {
      const m = d.pick([-2, -1, 1, 2]), n = d.int(-4, 4), [x1, x2] = d.until(() => [d.int(-4, 4), d.int(-4, 4)], ([u, w]) => u < w);
      const y1 = m * x1 + n, y2 = m * x2 + n;
      if (y1 * y1 === y2 * y2) return null;
      const A = d.pick([1, 2]), Bc = d.int(-2, 2), top = -(A * (x1 * x1 - x2 * x2) + Bc * (x1 * y1 - x2 * y2)), bot = y1 * y1 - y2 * y2;
      if (top % bot !== 0) return null;
      const Cc = top / bot, K = formV(A, Bc, Cc, x1, y1), L2 = A + Bc * m + Cc * m * m;
      if (Cc === 0 || L2 === 0 || K === 0 || Math.abs(Cc) > 3 || Math.abs(K) > 60 || symPairs([[x1, y1], [x2, y2]])) return null;
      const kind = d.pick(['y', 'std']), quadF = [Cc * n * n - K, Bc * n + 2 * Cc * m * n, L2];
      return pairAns(`${sysT([lineH(m, n, kind), eqH(formH(A, Bc, Cc), iq(K))])}${tail(0, '을/를')} 푸시오.`, [[x1, y1], [x2, y2]], {
        explain: `첫째 식에서 ${nb(eqH(Y, sumH([[m, X], [n, '']])))}${endJ(sumH([[m, X], [n, '']]), '을/를')} 둘째 식에 대입하여 정리하면 ${nb(eqH(sumH([[quadF[2], X2], [quadF[1], X], [quadF[0], '']]), '0'))}, 곧 ${nb((quadF[2] === 1 ? '' : quadF[2] === -1 ? MINUS : iq(quadF[2])) + '(' + sumH([[1, X], [-x1, '']]) + ')(' + sumH([[1, X], [-x2, '']]) + ') = 0')}이다. ${nb(X + ' = ' + iq(x1))}일 때 ${nb(Y + ' = ' + iq(y1))}, ${nb(X + ' = ' + iq(x2))}일 때 ${nb(Y + ' = ' + iq(y2))}이다.`
      });
    }),
    T('lin-frac', '일차식을 대입하여 풀기 — 분수인 해가 낀 것', '②2', (d) => {
      const m = d.pick([-2, -1, 1, 2]), n = d.int(-3, 3), x1 = d.int(-3, 3), y1 = m * x1 + n;
      const A = d.pick([1, 2]), Bc = d.int(-1, 1), Cc = d.pick([-2, -1, 1, 2, 3]), K = formV(A, Bc, Cc, x1, y1), L2 = A + Bc * m + Cc * m * m, L1 = Bc * n + 2 * Cc * m * n;
      if (L2 === 0 || Math.abs(K) > 40) return null;
      // 다른 근 x2 = −L1/L2 − x1(분수)
      const x2 = Q(-L1 - L2 * x1, L2);
      if (x2.q === 1 || x2.q > 9) return null;
      const y2 = Q(m * x2.p + n * x2.q, x2.q), P = (x, y) => pairH(tx(x), tx(y));
      const right = [P(Q(x1), Q(y1)), P(x2, y2)].join(' 또는 ');
      const rows = [
        [right, true],
        [P(Q(x1), Q(y1)), false],
        [[P(Q(x1), Q(y1)), P(Q(-x2.p, x2.q), Q(-y2.p, y2.q))].join(' 또는 '), false],
        [[P(Q(x1), Q(y1)), P(y2, x2)].join(' 또는 '), false],
        [[P(Q(-x1), Q(-y1)), P(x2, y2)].join(' 또는 '), false]
      ];
      return choose(d, `${sysT([lineH(m, n, d.pick(['y', 'std'])), eqH(formH(A, Bc, Cc), iq(K))])}의 해를 바르게 구한 것은?`, rows, {
        explain: `첫째 식에서 ${nb(eqH(Y, sumH([[m, X], [n, '']])))}${endJ(sumH([[m, X], [n, '']]), '을/를')} 둘째 식에 대입하여 정리하면 ${nb(eqH(sumH([[L2, X2], [L1, X], [Cc * n * n - K, '']]), '0'))}이고, 이 이차방정식의 근은 ${nb(X + ' = ' + iq(x1))}, ${nb(X + ' = ' + tx(x2))}이다. 각각 ${Y}를 구하면 ${right}이다.`
      });
    }),
    T('lin-sp', '두 수의 합과 곱이 주어진 연립방정식', '②3', (d) => {
      const [u, v] = d.until(() => [d.int(-6, 7), d.int(-6, 7)], ([a, b]) => a < b && a + b !== 0 && a !== 0 && b !== 0), s = u + v, p = u * v;
      const kind = d.pick(['prod', 'shift']);
      let second, told;
      if (kind === 'prod') { second = eqH(XY, iq(p)); told = ''; } else {
        const a = d.until(() => d.int(-3, 3), (w) => w !== 0), K = p + a * s + a * a;
        if (K === 0) return null;
        second = eqH('(' + sumH([[1, X], [a, '']]) + ')(' + sumH([[1, Y], [a, '']]) + ')', iq(K));
        told = `둘째 식을 전개하면 ${nb(XY + termH(a, '(' + X + ' + ' + Y + ')') + termH(a * a, '') + ' = ' + iq(K))}이고 ${nb(X + ' + ' + Y + ' = ' + iq(s))}이므로 ${nb(XY + ' = ' + iq(p))}이다. `;
      }
      return pairAns(`${sysT([eqH(X + ' + ' + Y, iq(s)), second])}${tail(0, '을/를')} 푸시오.`, [[u, v], [v, u]], {
        explain: `${told}${X}, ${Y}는 두 수의 합이 ${iq(s)}, 곱이 ${iq(p)}이므로 이차방정식 ${nb(eqH(sumH([[1, V('t') + sup(2)], [-s, V('t')], [p, '']]), '0'))}의 두 근이다. ${nb(V('t') + ' = ' + iq(u))} 또는 ${nb(V('t') + ' = ' + iq(v))}이므로 해는 ${pairsH([[u, v], [v, u]])}이다.`,
        facts: { rule: 'lin-sp-' + kind }
      });
    }),
    T('lin-one', '대입한 이차방정식이 중근 — 해가 한 쌍', '②4', (d) => {
      // y = mx + n, x² + αy = β 에서 x² + αmx + αn − β = (x − h)²
      const h = d.until(() => d.int(-4, 4), (v) => v !== 0), pairs = [];
      for (const al of [-6, -4, -3, -2, -1, 1, 2, 3, 4, 6]) for (const m of [-3, -2, -1, 1, 2, 3]) if (al * m === -2 * h) pairs.push([al, m]);
      if (!pairs.length) return null;
      const [al, m] = d.pick(pairs), n = d.int(-3, 3), be = al * n - h * h, y0 = m * h + n;
      if (be === 0) return null;
      const L = lineH(m, n, 'std'), Qd = eqH(sumH([[1, X2], [al, Y]]), iq(be)), A = V('α'), Bt = V('β');
      return valsQ(`${sysT([L, Qd])}의 해를 ${nb(X + ' = ' + A)}, ${nb(Y + ' = ' + Bt)}라 할 때, ${A}, ${Bt}의 값을 구하시오.`, [[A, h], [Bt, y0]], {
        explain: `첫째 식에서 ${nb(eqH(Y, sumH([[m, X], [n, '']])))}${endJ(sumH([[m, X], [n, '']]), '을/를')} 둘째 식에 대입하면 ${nb(eqH(sumH([[1, X2], [al * m, X], [al * n - be, '']]), '0'))}, 곧 ${nb('(' + sumH([[1, X], [-h, '']]) + ')' + sup(2) + ' = 0')}이므로 ${nb(X + ' = ' + iq(h))}(중근)이고 ${nb(Y + ' = ' + iq(y0))}이다. 해는 한 쌍뿐이다.`,
        facts: { calc: [[h < 0 ? `0-${-h}` : String(h), 0], [y0 < 0 ? `0-${-y0}` : String(y0), 1]], derived: [h, y0] }
      });
    }),
    T('lin-fac', '이차식을 인수분해해 일차식끼리 연립하기', '②5', (d) => {
      const [p1, p2] = d.until(() => [d.pick([1, 2, 3, -1, -2]), d.pick([1, 2, 3, -1, -2])], ([a, b]) => a !== b), x0 = d.int(-4, 6), y0 = d.int(-4, 4);
      const c = x0 - p1 * y0, e = x0 - p2 * y0, K = c * e;
      if (c === 0 || e === 0 || y0 === 0 || x0 === 0 || Math.abs(K) > 60) return null;
      const L = eqH(sumH([[1, X], [-p1, Y]]), iq(c)), Qd = eqH(formH(1, -(p1 + p2), p1 * p2), iq(K));
      const A = V('α'), Bt = V('β');
      return valsQ(`${sysT([L, Qd])}의 해를 ${nb(X + ' = ' + A)}, ${nb(Y + ' = ' + Bt)}라 할 때, ${A}, ${Bt}의 값을 구하시오.`, [[A, x0], [Bt, y0]], {
        explain: `둘째 식의 좌변을 인수분해하면 ${nb('(' + sumH([[1, X], [-p1, Y]]) + ')(' + sumH([[1, X], [-p2, Y]]) + ') = ' + iq(K))}이다. 첫째 식에서 ${nb(sumH([[1, X], [-p1, Y]]) + ' = ' + iq(c))}이므로 ${nb(sumH([[1, X], [-p2, Y]]) + ' = ' + iq(e))}이다. 두 일차방정식을 연립하여 풀면 ${pairH(x0, y0)}이다.`,
        facts: { calc: [[`${K}/(${c})+(${p2})*(${y0})`.replace(/^-/, '0-'), 0], [`(${c}-(${K})/(${c}))/((${p2})-(${p1}))`, 1]], derived: [c, e, p1, p2, x0, y0] }
      });
    }),
    T('lin-check', '주어진 값이 연립방정식의 해인지 가리기', '②6', (d) => {
      // ax + y = c(직선)와 Ax² + Cy² = K(가운데가 원점인 곡선)
      const x0 = d.until(() => d.int(-3, 3), (v) => v !== 0), y0 = d.until(() => d.int(-3, 3), (v) => v !== 0), a = d.until(() => d.int(-3, 3), (v) => v !== 0), c = a * x0 + y0;
      const A = d.pick([1, 2]), Cc = d.pick([1, 2, 3]), K = A * x0 * x0 + Cc * y0 * y0;
      const on1 = (x, y) => a * x + y === c, on2 = (x, y) => A * x * x + Cc * y * y === K;
      const cand = [[x0, -y0], [-x0, y0], [-x0, -y0], [y0, x0], [x0 + 1, c - a * (x0 + 1)], [x0 - 1, c - a * (x0 - 1)]].filter(([x, y]) => !(on1(x, y) && on2(x, y)));
      const fakes = [];
      for (const pt of d.shuffle(cand)) if (!fakes.some(([u, w]) => u === pt[0] && w === pt[1]) && !(pt[0] === x0 && pt[1] === y0)) fakes.push(pt);
      if (fakes.length < 4) return null;
      const opts = [[x0, y0]].concat(fakes.slice(0, 4));
      const why = (x, y) => (on1(x, y) ? (on2(x, y) ? '두 식을 모두 만족시킨다' : '첫째 식만 만족시킨다') : on2(x, y) ? '둘째 식만 만족시킨다' : '두 식을 모두 만족시키지 않는다');
      return choose(d, `다음 중 ${sysT([eqH(sumH([[a, X], [1, Y]]), iq(c)), eqH(sumH([[A, X2], [Cc, Y2]]), iq(K))])}의 해인 것은?`, opts.map(([x, y]) => [nb(`(${X}, ${Y}) = (${iq(x)}, ${iq(y)})`), on1(x, y) && on2(x, y)]), {
        explain: `연립방정식의 해는 두 식을 모두 만족시켜야 한다. ${opts.map(([x, y]) => nb(`(${iq(x)}, ${iq(y)})`) + endJ(`(${iq(x)}, ${iq(y)})`, '은/는') + ' ' + why(x, y)).join('. ')}.`
      });
    })
  ]);

  // ── 두 이차방정식으로 이루어진 연립이차방정식 ──
  // (x − py)(x − qy) = 0 과 Ax² + Bxy + Cy² = K: 갈래 x = py 에서 F(p, 1)y² = K
  const Fp = (A, Bc, Cc, p) => A * p * p + Bc * p + Cc;
  const firstH = (p, q) => eqH(formH(1, -(p + q), p * q), '0');
  const branchH = (p) => (p === 0 ? eqH(X, '0') : eqH(X, (p === 1 ? '' : p === -1 ? MINUS : sT(p)) + Y));
  // a√t 꼴의 수 글(정수 a, t = 1 이면 a)
  const cY2 = (f) => (f === 1 ? '' : f === -1 ? MINUS : iq(f)) + Y2;
  const radQ = (a, t) => (t === 1 ? iq(a) : (a < 0 ? MINUS : '') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + rt(t));
  B.addTypes('10-1-5', 'quad', [
    T('quad-int', '한 식이 인수분해되는 연립이차방정식 — x > 0인 해', '②7', (d) => {
      const [p, q] = d.until(() => [d.pick([-3, -2, -1, 1, 2, 3]), d.pick([-3, -2, -1, 1, 2, 3])], ([a, b]) => a !== b && a !== -b);
      const A = d.pick([1, 2]), Bc = d.int(-3, 3), Cc = d.int(-3, 4), s1 = d.int(1, 3), s2 = d.int(1, 3), f1 = Fp(A, Bc, Cc, p), f2 = Fp(A, Bc, Cc, q), K = f1 * s1 * s1;
      if (f1 === 0 || f2 === 0 || K !== f2 * s2 * s2 || K === 0 || Math.abs(K) > 90) return null;
      const sol1 = p > 0 ? [p * s1, s1] : [-p * s1, -s1], sol2 = q > 0 ? [q * s2, s2] : [-q * s2, -s2];
      return pairAns(`${sysT([firstH(p, q), eqH(formH(A, Bc, Cc), iq(K))])}의 해 가운데 ${nb(X + ' &gt; 0')}인 것을 모두 구하시오.`, [sol1, sol2], {
        xSigned: false,
        explain: `첫째 식의 좌변을 인수분해하면 ${nb('(' + sumH([[1, X], [-p, Y]]) + ')(' + sumH([[1, X], [-q, Y]]) + ') = 0')}이므로 ${nb(branchH(p))} 또는 ${nb(branchH(q))}이다. ${nb(branchH(p))}${endJ(branchH(p), '을/를')} 둘째 식에 대입하면 ${nb(cY2(f1) + ' = ' + iq(K))}, ${nb(Y + ' = ±' + s1)}이고, ${nb(branchH(q))}${endJ(branchH(q), '을/를')} 대입하면 ${nb(cY2(f2) + ' = ' + iq(K))}, ${nb(Y + ' = ±' + s2)}이다. 이 가운데 ${nb(X + ' &gt; 0')}인 해는 ${pairsH([sol1, sol2])}이다.`,
        facts: { rule: 'quad-int' }
      });
    }),
    T('quad-rad', '한 식이 인수분해되는 연립이차방정식 — 해가 아닌 것 고르기', '②7', (d) => {
      const [p, q] = d.until(() => [d.pick([-3, -2, -1, 1, 2, 3]), d.pick([-3, -2, -1, 1, 2, 3])], ([a, b]) => a !== b);
      const A = d.pick([1, 2]), Bc = d.int(-2, 2), Cc = d.int(-1, 3), f1 = Fp(A, Bc, Cc, p), f2 = Fp(A, Bc, Cc, q), K = d.pick([6, 8, 10, 12, 15, 18, 20, 24, 30]);
      if (f1 <= 0 || f2 <= 0 || K % f1 !== 0 || K % f2 !== 0) return null;
      const m1 = K / f1, m2 = K / f2;
      if (isSq(m1) && isSq(m2)) return null;
      // y = s√t, x = p·s√t — 같은 t 끼리라 셈이 정수로 끝난다
      const sols = [];
      for (const [pp, mm] of [[p, m1], [q, m2]]) { const [s, t] = sqParts(mm); sols.push({ a: pp * s, b: s, t }, { a: -pp * s, b: -s, t }); }
      const holds = (o) => o.t * (o.a - p * o.b) * (o.a - q * o.b) === 0 && o.t * (A * o.a * o.a + Bc * o.a * o.b + Cc * o.b * o.b) === K;
      const pick = d.pick(sols), fake = { a: pick.a, b: -pick.b, t: pick.t };
      if (holds(fake) || sols.some((o) => o.a === fake.a && o.b === fake.b)) return null;
      const rows = sols.concat([fake]).map((o) => [pairH(radQ(o.a, o.t), radQ(o.b, o.t)), !holds(o)]);
      return choose(d, `다음 중 ${sysT([firstH(p, q), eqH(formH(A, Bc, Cc), iq(K))])}의 해가 아닌 것은?`, rows, {
        explain: `첫째 식에서 ${nb(branchH(p))} 또는 ${nb(branchH(q))}이다. ${nb(branchH(p))}${endJ(branchH(p), '을/를')} 둘째 식에 대입하면 ${nb(cY2(f1) + ' = ' + K)}, ${nb(Y + ' = ±' + radQ(sqParts(m1)[0], sqParts(m1)[1]))}이고, ${nb(branchH(q))}${endJ(branchH(q), '을/를')} 대입하면 ${nb(cY2(f2) + ' = ' + K)}, ${nb(Y + ' = ±' + radQ(sqParts(m2)[0], sqParts(m2)[1]))}이다. ${nb(X + ' = ' + radQ(fake.a, fake.t) + ', ' + Y + ' = ' + radQ(fake.b, fake.t))}${endJ(radQ(fake.b, fake.t), '은/는')} ${X}${endJ(X, '과/와')} ${Y}의 부호가 맞지 않아 첫째 식을 만족시키지 않는다.`
      });
    }),
    T('quad-none', '한 갈래에서 해가 없는 연립이차방정식', '②8', (d) => {
      // (x − y)(x − py) = 0, F(1, 1) = 0 이라 x = y 갈래는 0 = K
      const A = d.pick([1, 2, 3]), Bc = d.int(-4, 4), Cc = -A - Bc, p = d.pick([-3, -2, 2, 3, 4]), f = Fp(A, Bc, Cc, p), s = d.int(1, 3), K = f * s * s;
      if (Cc === 0 || Bc === 0 || f === 0 || K === 0 || Math.abs(K) > 90) return null;
      const A_ = V('α'), Bt = V('β'), v = p * s * s;
      return N(`${sysT([firstH(1, p), eqH(formH(A, Bc, Cc), iq(K))])}의 해를 ${nb(X + ' = ' + A_)}, ${nb(Y + ' = ' + Bt)}라 할 때, ${A_ + Bt}의 값은?`, v, {
        signed: true,
        explain: `첫째 식에서 ${nb(X + ' = ' + Y)} 또는 ${nb(branchH(p))}이다. ${nb(X + ' = ' + Y)}${endJ(Y, '을/를')} 둘째 식에 대입하면 ${nb('0 × ' + Y2 + ' = ' + iq(K))}${tail(Math.abs(K), '이/가')} 되어 해가 없다. ${nb(branchH(p))}${endJ(branchH(p), '을/를')} 대입하면 ${nb(cY2(f) + ' = ' + iq(K))}, ${nb(Y + ' = ±' + s)}이므로 해는 ${pairsH([[p * s, s], [-p * s, -s]])}이다. 어느 해든 ${nb(A_ + Bt + ' = ' + iq(v))}이다.`,
        facts: { calc: [[`(${p})*${s}*${s}`, 0]], unseen: [s].filter((x) => x > 1) }
      });
    }),
    T('quad-imag', '한 갈래에서 허수인 해가 나오는 연립이차방정식', '②9', (d) => {
      const [p, q] = d.until(() => [d.pick([-3, -2, -1, 1, 2, 3]), d.pick([-3, -2, -1, 1, 2, 3])], ([a, b]) => a !== b && a !== -b);
      const A = 1, Bc = d.int(-3, 3), Cc = d.int(-4, 3), f1 = Fp(A, Bc, Cc, p), f2 = Fp(A, Bc, Cc, q), s1 = d.int(1, 3), s2 = d.int(1, 3), K = f1 * s1 * s1;
      if (f1 === 0 || f2 === 0 || K === 0 || -f2 * s2 * s2 !== K || Math.abs(K) > 90) return null;
      const re = (a) => iq(a), im = (a) => (a < 0 ? MINUS : '') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + I;
      const realP = [[re(p * s1), re(s1)], [re(-p * s1), re(-s1)]], imagP = [[im(q * s2), im(s2)], [im(-q * s2), im(-s2)]];
      const setOf = (list) => list.map(([x, y]) => pairH(x, y)).join(' 또는 ');
      const rows = [
        [setOf(realP.concat(imagP)), true],
        [setOf(realP), false],
        [setOf(realP.concat([[re(q * s2), re(s2)], [re(-q * s2), re(-s2)]])), false],
        [setOf(realP.concat([[im(q * s2), im(-s2)], [im(-q * s2), im(s2)]])), false],
        [setOf([[re(p * s1), re(-s1)], [re(-p * s1), re(s1)]].concat(imagP)), false]
      ];
      return choose(d, `${sysT([firstH(p, q), eqH(formH(A, Bc, Cc), iq(K))])}의 해를 바르게 구한 것은?`, rows, {
        explain: `첫째 식에서 ${nb(branchH(p))} 또는 ${nb(branchH(q))}이다. ${nb(branchH(p))}${endJ(branchH(p), '을/를')} 둘째 식에 대입하면 ${nb(cY2(f1) + ' = ' + iq(K))}, ${nb(Y + ' = ±' + s1)}이고, ${nb(branchH(q))}${endJ(branchH(q), '을/를')} 대입하면 ${nb(cY2(f2) + ' = ' + iq(K))}, ${nb(Y2 + ' = ' + MINUS + s2 * s2)}이므로 ${nb(Y + ' = ±' + (s2 === 1 ? '' : s2) + I)}이다. 연립방정식의 해도 복소수의 범위에서 구하므로 해는 네 쌍이다.`
      });
    }),
    T('quad-count', '연립이차방정식의 실수인 해의 개수', '②10', (d) => {
      const [p, q] = d.until(() => [d.pick([-3, -2, -1, 1, 2, 3]), d.pick([-3, -2, -1, 1, 2, 3])], ([a, b]) => a !== b && a !== -b);
      const A = d.pick([1, 2, 4]), Bc = d.int(-7, 3), Cc = d.int(-3, 3), f1 = Fp(A, Bc, Cc, p), f2 = Fp(A, Bc, Cc, q), K = d.pick([-12, -8, -6, -4, -3, -2, 2, 3, 4, 6, 8, 12]);
      if (f1 === 0 || f2 === 0 || K % f1 !== 0 || K % f2 !== 0) return null;
      const n1 = K / f1 > 0 ? 2 : 0, n2 = K / f2 > 0 ? 2 : 0, count = n1 + n2;
      if (count === 0) return null;
      const opts = [1, 2, 3, 4, 5];
      const ira = (v) => (tail(Math.abs(v), '이/가') === '이' ? '이라' : '라');
      const say = (pp, f, n, last) => `${nb(branchH(pp))}이면 ${f === 1 ? '' : nb(cY2(f) + ' = ' + iq(K)) + ', '}${nb(Y2 + ' = ' + iq(K / f))}${ira(K / f)} ${n ? '실수인 해가 두 쌍' + (last ? '이다' : '이고') : '실수인 해가 ' + (last ? '없다' : '없고')}`;
      return C(`${sysT([firstH(p, q), eqH(formH(A, Bc, Cc), iq(K))])}${tail(0, '을/를')} 만족시키는 실수 ${X}, ${Y}의 순서쌍 ${nb('(' + X + ', ' + Y + ')')}의 개수는?`, opts.map(String), opts.indexOf(count), {
        explain: `첫째 식에서 ${nb(branchH(p))} 또는 ${nb(branchH(q))}이다. ${say(p, f1, n1)}, ${say(q, f2, n2, true)}. 따라서 실수인 순서쌍은 ${count}개이다.`,
        facts: { pick: { expr: `${n1}+${n2}`, options: opts }, unseen: [n1, n2].filter((v) => v > 1) }
      });
    }),
    T('quad-max', '연립이차방정식의 해로 만든 x² + y²의 최댓값', '②11', (d) => {
      const [p, q] = d.until(() => [d.pick([-3, -2, -1, 1, 2, 3]), d.pick([-3, -2, -1, 1, 2, 3])], ([a, b]) => a !== b && a !== -b);
      const A = d.pick([1, 2]), Bc = d.int(-3, 3), Cc = d.int(-2, 4), f1 = Fp(A, Bc, Cc, p), f2 = Fp(A, Bc, Cc, q), K = d.pick([6, 8, 12, 18, 24, 30, 36]);
      if (f1 <= 0 || f2 <= 0 || K % f1 !== 0 || K % f2 !== 0) return null;
      const m1 = K / f1, m2 = K / f2, v1 = (p * p + 1) * m1, v2 = (q * q + 1) * m2;
      if (v1 === v2 || (isSq(m1) && isSq(m2))) return null;
      const best = Math.max(v1, v2);
      return N(`${sysT([firstH(p, q), eqH(formH(A, Bc, Cc), iq(K))])}${tail(0, '을/를')} 만족시키는 실수 ${X}, ${Y}에 대하여 ${nb(X2 + ' + ' + Y2)}의 최댓값은?`, best, {
        explain: `첫째 식에서 ${nb(branchH(p))} 또는 ${nb(branchH(q))}이다. ${nb(branchH(p))}이면 ${nb(Y2 + ' = ' + m1)}이므로 ${nb(X2 + ' + ' + Y2 + ' = ' + (p * p === 1 ? '' : p * p) + Y2 + ' + ' + Y2 + ' = ' + v1)}, ${nb(branchH(q))}이면 ${nb(Y2 + ' = ' + m2)}이므로 ${nb(X2 + ' + ' + Y2 + ' = ' + v2)}이다. 따라서 최댓값은 ${best}이다.`,
        facts: { calc: [[v1 === best ? `(${p}*${p}+1)*${K}/${f1}` : `(${q}*${q}+1)*${K}/${f2}`, 0]], unseen: [f1, f2, Math.abs(p), Math.abs(q)] }
      });
    })
  ]);

  // ── 연립이차방정식의 해의 조건 ──
  B.addTypes('10-1-5', 'scond', [
    T('sym-add', '두 식을 더하고 빼서 x + y와 xy 구하기', '②12', (d) => {
      const s = d.until(() => d.int(-6, 7), (v) => v !== 0), p = d.int(-6, 9), k = d.pick([1, 2]);
      if (s * s - 4 * p <= 0 || p === 0) return null;
      const Aa = s + k * p, Bb = s - k * p, v = s * s - 2 * p, kxy = (k === 1 ? '' : k) + XY, A_ = V('α'), Bt = V('β');
      return N(`${sysT([eqH(X + ' + ' + Y + ' + ' + kxy, iq(Aa)), eqH(X + ' + ' + Y + ' ' + MINUS + ' ' + kxy, iq(Bb))])}의 해를 ${nb(X + ' = ' + A_)}, ${nb(Y + ' = ' + Bt)}라 할 때, ${nb(A_ + sup(2) + ' + ' + Bt + sup(2))}의 값은?`, v, {
        explain: `두 식을 변끼리 더하면 ${nb('2(' + X + ' + ' + Y + ') = ' + iq(Aa + Bb))}에서 ${nb(X + ' + ' + Y + ' = ' + iq(s))}, 빼면 ${nb(2 * k + XY + ' = ' + iq(Aa - Bb))}에서 ${nb(XY + ' = ' + iq(p))}이다. 따라서 ${nb(A_ + sup(2) + ' + ' + Bt + sup(2) + ' = (' + A_ + ' + ' + Bt + ')' + sup(2) + ' ' + MINUS + ' 2' + A_ + Bt + ' = ' + iq(v))}이다.`,
        facts: { calc: [[`((${Aa})+(${Bb}))*((${Aa})+(${Bb}))/4-((${Aa})-(${Bb}))/${k}`, 0]], unseen: [4] }
      });
    }),
    T('one-pair', '해가 오직 한 쌍인 연립이차방정식(판별식 D = 0)', '②13', (d, n) => {
      if (n === 0) {
        // x + py = k, x² + y² = (1 + p²)j² → 양수 k = (1 + p²)j
        const p = d.pick([1, 2, 3]), j = d.int(1, 3), r = (1 + p * p) * j * j, k = (1 + p * p) * j;
        if (r > 50) return null;
        return N(`${sysT([eqH(sumH([[1, X], [p, Y]]), vk), eqH(X2 + ' + ' + Y2, String(r))])}의 해가 오직 한 쌍일 때, 양수 ${vk}의 값은?`, k, {
          explain: `첫째 식에서 ${nb(eqH(X, vk + termH(-p, Y)))}${endJ(Y, '을/를')} 둘째 식에 대입하면 ${nb(eqH(sumH([[1 + p * p, Y2]]) + ' ' + MINUS + ' ' + (2 * p === 1 ? '' : 2 * p) + vk + Y + ' + ' + vk + sup(2) + ' ' + MINUS + ' ' + r, '0'))}이다. 해가 한 쌍이려면 이 이차방정식이 중근을 가져야 하므로 ${nb(frac(V('D'), 4) + ' = ' + (p * p === 1 ? '' : p * p) + vk + sup(2) + ' ' + MINUS + ' ' + (1 + p * p) + '(' + vk + sup(2) + ' ' + MINUS + ' ' + r + ') = 0')}, ${nb(vk + sup(2) + ' = ' + k * k)}이다. 따라서 양수 ${nb(vk + ' = ' + k)}이다.`,
          facts: { calc: [[`(1+${p}*${p})*${j}`, 0]], unseen: [j].filter((v) => v > 1), rule: 'one-pair-line' }
        });
      }
      // x − y = c, px² + y² = k → k = c²p/(p + 1)
      const opts = [];
      for (const p of [1, 2, 3, 4]) for (const c of [1, 2, 3, 4, 5, 6]) if ((c * c * p) % (p + 1) === 0) opts.push([p, c]);
      const [p, c] = d.pick(opts), k = c * c * p / (p + 1);
      return N(`${sysT([eqH(X + ' ' + MINUS + ' ' + Y, String(c)), eqH(sumH([[p, X2], [1, Y2]]), vk)])}의 해가 오직 한 쌍일 때, 실수 ${vk}의 값은?`, k, {
        explain: `첫째 식에서 ${nb(eqH(Y, X + ' ' + MINUS + ' ' + c))}${endJ(String(c), '을/를')} 둘째 식에 대입하면 ${nb(eqH(sumH([[p + 1, X2], [-2 * c, X], [c * c, '']]) + ' ' + MINUS + ' ' + vk, '0'))}이다. 해가 한 쌍이려면 중근을 가져야 하므로 ${nb(frac(V('D'), 4) + ' = ' + c * c + ' ' + MINUS + ' ' + (p + 1) + '(' + c * c + ' ' + MINUS + ' ' + vk + ') = 0')}에서 ${nb(vk + ' = ' + k)}이다.`,
        facts: { calc: [[`${c}*${c}*${p}/(${p}+1)`, 0]], rule: 'one-pair-k' }
      });
    }, { count: 2 }),
    T('real-cond', '실수인 해를 가질 조건(판별식 D ≥ 0)', '②14', (d, n) => {
      if (n === 0) {
        const u = d.until(() => d.int(-3, 3), (v) => v !== 0), c = 2 * u, m = d.int(-4, 4), bd = 2 * u * u - m;
        if (bd === 0 || m === 0) return null;
        return ineqAns(`${sysT([eqH(X + ' + ' + Y, iq(c)), eqH(X2 + ' + ' + Y2, va + termH(m, ''))])}의 해가 실수가 되도록 하는 실수 ${va}의 값의 범위를 구하시오.`, '>=', bd, va, {
          explain: `첫째 식에서 ${nb(eqH(Y, MINUS + X + termH(c, '')))}${endJ(iq(c), '을/를')} 둘째 식에 대입하면 ${nb(eqH(sumH([[2, X2], [-2 * c, X], [c * c - m, '']]) + ' ' + MINUS + ' ' + va, '0'))}이다. 해가 실수이려면 ${nb(frac(V('D'), 4) + ' = ' + c * c + ' ' + MINUS + ' 2(' + (c * c - m) + ' ' + MINUS + ' ' + va + ') ≥ 0')}이어야 하므로 ${nb(va + ' ≥ ' + iq(bd))}이다.`,
          facts: { calc: [[`(${c})*(${c})/2-(${m})`, 1]], rule: 'real-cond-a' }
        });
      }
      const g = d.pick([1, 2, 3]), nn = d.int(4, 12), al = -g, be = g * nn;
      return N(`${sysT([eqH(X + ' + ' + Y, '2' + vk), eqH(X2 + ' + ' + Y2, '2' + vk + sup(2) + termH(al, vk) + termH(be, ''))])}의 해가 실수가 되도록 하는 자연수 ${vk}의 개수는?`, nn, {
        explain: `첫째 식에서 ${nb(eqH(Y, MINUS + X + ' + 2' + vk))}${endJ(vk, '을/를')} 둘째 식에 대입하여 정리하면 ${nb(eqH('2' + X2 + ' ' + MINUS + ' 4' + vk + X + ' + 2' + vk + sup(2) + termH(g, vk) + termH(-be, ''), '0'))}이다. 해가 실수이려면 ${nb(frac(V('D'), 4) + ' = 4' + vk + sup(2) + ' ' + MINUS + ' 2(2' + vk + sup(2) + termH(g, vk) + termH(-be, '') + ') ≥ 0')}, 곧 ${nb(vk + ' ≤ ' + nn)}이다. 따라서 자연수 ${vk}는 1부터 ${nn}까지 ${nn}개이다.`,
        facts: { calc: [[`${be}/${g}`, 0]], rule: 'real-cond-k' }
      });
    }, { count: 2 }),
    T('common', '두 연립방정식의 공통인 해', '②16', (d) => {
      const c1 = d.until(() => d.int(-3, 3), (v) => v !== 0), x0 = d.until(() => d.int(-3, 4), (v) => v !== 0), y0 = x0 + c1, K2 = 2 * c1 * x0 + c1 * c1;
      const a = d.until(() => d.int(-3, 3), (v) => v !== 0), K1 = a * x0 * x0 + y0 * y0, pc = d.pick([1, 2, 3]), b = d.until(() => d.int(-3, 3), (v) => v !== 0), qq = pc * x0 + b * y0;
      if (y0 === 0 || K2 === 0 || K1 === 0) return null;
      const s1 = sysQ([eqH(Y, X + termH(c1, '')), eqH(va + X2 + ' + ' + Y2, iq(K1))]), s2 = sysQ([eqH(sumH([[pc, X]]) + ' + ' + vb + Y, iq(qq)), eqH(Y2 + ' ' + MINUS + ' ' + X2, iq(K2))]);
      return valsQ(`두 연립방정식 ${s1}, ${s2}의 공통인 해가 있을 때, 상수 ${va}, ${vb}의 값을 구하시오.`, [[va, a], [vb, b]], {
        explain: `공통인 해는 네 식을 모두 만족시킨다. 문자가 없는 ${nb(eqH(Y, X + termH(c1, '')))}${endJ(String(Math.abs(c1)), '과/와')} ${nb(eqH(Y2 + ' ' + MINUS + ' ' + X2, iq(K2)))}${endJ(iq(K2), '을/를')} 연립하면 ${nb('(' + X + termH(c1, '') + ')' + sup(2) + ' ' + MINUS + ' ' + X2 + ' = ' + iq(K2))}에서 ${nb(X + ' = ' + iq(x0))}, ${nb(Y + ' = ' + iq(y0))}이다. 이것을 나머지 두 식에 대입하면 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
        facts: { calc: [[`((${K1})-(${y0})*(${y0}))/((${x0})*(${x0}))`, 0], [`((${qq})-${pc}*(${x0}))/(${y0})`, 1]], unseen: [Math.abs(x0), Math.abs(y0)].filter((v) => v > 1) }
      });
    })
  ]);

  // ── 연립이차방정식의 활용 ──
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]];
  // 부러진 대나무 그림: 서 있는 부분(세로), 쓰러진 부분(빗변), 바닥 d m
  function bambooFig(x, y, dd) {
    const s = 120 / Math.max(x + y, dd * 1.4), b = Board(), O = [40, 20 + x * s], Top = [40, 20], Tip = [40 + dd * s, 20 + x * s];
    b.seg([20, O[1]], [Tip[0] + 30, O[1]], 'thin');
    b.seg(O, Top, null, 'stroke:#15803d;stroke-width:4').seg(Top, Tip, null, 'stroke:#15803d;stroke-width:4');
    b.corner(O, Top, Tip);
    b.beside(O, Tip, dd + ' m', Top);
    b.text([Top[0] - 4, Top[1] - 10], '부러진 곳', { size: 13 });
    return b.svg(`부러진 대나무 그림: 땅에 서 있는 아랫부분은 세로로 서 있고, 부러진 윗부분은 비스듬히 넘어가 끝이 땅에 닿았다. 서 있는 부분과 땅이 직각을 이루고, 대나무의 밑동과 닿은 끝 사이의 거리는 ${dd} m이다.`);
  }
  B.addTypes('10-1-5', 'use2', [
    T('use2-model', '비와 대각선으로 연립방정식 세우기', '②17', (d) => {
      const [r1, r2] = d.pick([[16, 9], [4, 3], [5, 4], [3, 2]]), D = d.pick([26, 30, 40, 50, 60]), what = d.pick(['텔레비전 화면', '태블릿 화면', '모니터 화면']);
      const t = D / Math.sqrt(r1 * r1 + r2 * r2), xr = r1 * t, yr = r2 * t, near = (u, w) => Math.abs(u - w) < 1e-6;
      const sysOpt = (rows, ok) => [rows.join(', '), ok];
      const cand = [
        [[eqH(r2 + X, r1 + Y), eqH(X2 + ' + ' + Y2, D + sup(2))], near(r2 * xr, r1 * yr) && near(xr * xr + yr * yr, D * D)],
        [[eqH(r1 + X, r2 + Y), eqH(X2 + ' + ' + Y2, D + sup(2))], near(r1 * xr, r2 * yr) && near(xr * xr + yr * yr, D * D)],
        [[eqH(r2 + X, r1 + Y), eqH(X + ' + ' + Y, String(D))], near(r2 * xr, r1 * yr) && near(xr + yr, D)],
        [[eqH(r2 + X, r1 + Y), eqH(X2 + ' + ' + Y2, String(D))], near(r2 * xr, r1 * yr) && near(xr * xr + yr * yr, D)],
        [[eqH(r2 + X, r1 + Y), eqH(X2 + ' ' + MINUS + ' ' + Y2, D + sup(2))], near(r2 * xr, r1 * yr) && near(xr * xr - yr * yr, D * D)]
      ];
      return choose(d, `가로의 길이와 세로의 길이의 비가 ${r1} : ${r2}이고 대각선의 길이가 ${D} cm인 ${what}의 가로, 세로의 길이를 각각 ${X} cm, ${Y} cm라 할 때, ${X}, ${Y}의 값을 구하기 위한 연립방정식으로 알맞은 것은?`, cand.map(([rows, ok]) => sysOpt(rows.map(nb), ok)), {
        explain: `${nb(X + ' : ' + Y + ' = ' + r1 + ' : ' + r2)}에서 ${nb(eqH(r2 + X, r1 + Y))}이고, 대각선은 가로와 세로를 두 변으로 하는 직각삼각형의 빗변이므로 피타고라스 정리에서 ${nb(eqH(X2 + ' + ' + Y2, D + sup(2)))}이다.`
      });
    }),
    T('use2-right', '빗변과 둘레가 주어진 직각삼각형', '②18', (d) => {
      const [a, b, c] = d.pick(TRIPLES.slice(0, 5)), k = d.pick([1, 1, 2]), A = a * k, Bb = b * k, Cc = c * k, P = A + Bb + Cc, unit = d.pick(['m', 'cm']);
      if (Cc > 60) return null;
      return M(`빗변의 길이가 ${Cc} ${unit}이고 둘레의 길이가 ${P} ${unit}인 직각삼각형에서 직각을 낀 두 변의 길이를 구하시오.`, [{ answer: A, unit }, { answer: Bb, unit }], {
        unordered: true, shown: `${A} ${unit}, ${Bb} ${unit}`,
        explain: `직각을 낀 두 변의 길이를 ${X} ${unit}, ${Y} ${unit}라 하면 ${nb(X + ' + ' + Y + ' = ' + (P - Cc))}, ${nb(X2 + ' + ' + Y2 + ' = ' + Cc + sup(2))}이다. ${nb(Y + ' = ' + (P - Cc) + ' ' + MINUS + ' ' + X)}${endJ(X, '을/를')} 대입하면 ${nb('2' + X2 + ' ' + MINUS + ' ' + 2 * (P - Cc) + X + ' + ' + ((P - Cc) ** 2 - Cc * Cc) + ' = 0')}, ${nb('(' + X + ' ' + MINUS + ' ' + A + ')(' + X + ' ' + MINUS + ' ' + Bb + ') = 0')}이므로 두 변의 길이는 ${A} ${unit}, ${Bb} ${unit}이다.`,
        facts: { calc: [[String(A), 0], [String(Bb), 1]], unseen: [A, Bb, P - Cc].filter((v) => v > 1) }
      });
    }),
    T('use2-diag', '대각선과, 가로·세로를 바꾼 넓이의 변화', '②19', (d) => {
      const [a0, b0, c0] = d.pick(TRIPLES.slice(0, 4)), k = d.pick([1, 2]), [Y0, X0] = [a0 * k, b0 * k], Dg = c0 * k;
      if (Dg > 60) return null;
      const both = d.bool(), ad = d.int(2, 8), sb = both ? ad : d.int(2, 5), S = both ? ad * (X0 + Y0) + ad * ad : (X0 + ad) * (Y0 - sb) - X0 * Y0;
      if (!both && (S <= 0 || Y0 <= sb)) return null;
      // 다른 교점이 조건(양수, 가로 > 세로)에 맞지 않는지 본다: 직선 Lx·x + Ly·y = R 과 원 x² + y² = Dg²
      const [Lx, Ly, R] = both ? [ad, ad, S - ad * ad] : [-sb, ad, S + ad * sb];
      const pts = [];
      for (let x = -Dg; x <= Dg; x += 1) { const yy = (R - Lx * x) / Ly; if (Number.isInteger(yy) && x * x + yy * yy === Dg * Dg) pts.push([x, yy]); }
      // 실수 교점(분수일 수 있다) 가운데 맞는 것이 하나뿐인지: 이차방정식으로 푼다
      const A2 = Lx * Lx + Ly * Ly, B1 = -2 * Lx * R, C0 = R * R - Ly * Ly * Dg * Dg, disc = B1 * B1 - 4 * A2 * C0;
      if (disc < 0) return null;
      const xs = [(-B1 + Math.sqrt(disc)) / (2 * A2), (-B1 - Math.sqrt(disc)) / (2 * A2)], good = xs.filter((x) => { const yy = (R - Lx * x) / Ly; return x > 0 && yy > 0 && x > yy; });
      if (good.length !== 1 || Math.abs(good[0] - X0) > 1e-9) return null;
      const change = both ? `가로와 세로의 길이를 각각 ${ad} cm씩 늘렸더니` : `가로의 길이를 ${ad} cm 늘리고 세로의 길이를 ${sb} cm 줄였더니`;
      return N(`대각선의 길이가 ${Dg} cm인 직사각형 모양의 사진이 있다. 이 사진의 ${change} 넓이가 ${S} cm²만큼 더 커졌다. 처음 사진의 가로의 길이는 몇 cm인가? (단, 처음 사진의 가로의 길이가 세로의 길이보다 길다.)`, X0, {
        unit: 'cm',
        explain: `처음 가로, 세로의 길이를 ${X} cm, ${Y} cm라 하면 ${nb(X2 + ' + ' + Y2 + ' = ' + Dg * Dg)}이다. ${both ? nb('(' + X + ' + ' + ad + ')(' + Y + ' + ' + ad + ') ' + MINUS + ' ' + XY + ' = ' + S) + '에서 ' + nb(X + ' + ' + Y + ' = ' + (X0 + Y0)) : nb('(' + X + ' + ' + ad + ')(' + Y + ' ' + MINUS + ' ' + sb + ') ' + MINUS + ' ' + XY + ' = ' + S) + '에서 ' + nb(sumH([[-sb, X], [ad, Y]]) + ' = ' + R)}이다. 두 식을 연립하여 풀면 ${X}, ${Y}가 모두 양수이고 ${nb(X + ' &gt; ' + Y)}인 해는 ${pairH(X0, Y0)}뿐이다.`,
        facts: { calc: [[String(X0), 0]], unseen: [X0] }
      });
    }),
    T('use2-square', '두 정사각형의 둘레와 넓이', '②20', (d, n) => {
      const [sm, bg] = d.until(() => [d.int(2, 9), d.int(3, 12)], ([u, w]) => u < w);
      if (n === 0) {
        const L = 4 * (sm + bg), S = sm * sm + bg * bg;
        return N(`길이가 ${L} cm인 철사를 두 도막으로 잘라 각각 구부려서 크기가 다른 두 정사각형을 만들었더니 두 정사각형의 넓이의 합이 ${S} cm²였다. 큰 정사각형의 넓이는 몇 cm²인가?`, bg * bg, {
          unit: 'cm²',
          explain: `두 정사각형의 한 변의 길이를 ${X} cm, ${Y} cm라 하면 ${nb('4' + X + ' + 4' + Y + ' = ' + L)}, 곧 ${nb(X + ' + ' + Y + ' = ' + (sm + bg))}이고 ${nb(X2 + ' + ' + Y2 + ' = ' + S)}이다. ${nb(Y + ' = ' + (sm + bg) + ' ' + MINUS + ' ' + X)}${endJ(X, '을/를')} 대입하면 ${nb('(' + X + ' ' + MINUS + ' ' + sm + ')(' + X + ' ' + MINUS + ' ' + bg + ') = 0')}이므로 두 변은 ${sm} cm, ${bg} cm이다. 큰 정사각형의 넓이는 ${bg * bg} cm²이다.`,
          facts: { calc: [[`${bg}*${bg}`, 0]], unseen: [bg] }
        });
      }
      if (n === 2) {
        // 둘레의 합과 넓이의 차: 대입하면 이차항이 지워진다(x² − y² = (x + y)(x − y))
        const L = 4 * (sm + bg), Dd = bg * bg - sm * sm;
        return M(`두 정사각형의 둘레의 길이의 합이 ${L} cm이고 넓이의 차가 ${Dd} cm²이다. 두 정사각형의 한 변의 길이를 각각 구하시오.`, [{ answer: sm, lead: '작은 정사각형:', unit: 'cm' }, { answer: bg, lead: '큰 정사각형:', unit: 'cm' }], {
          shown: `작은 정사각형 ${sm} cm, 큰 정사각형 ${bg} cm`,
          explain: `큰 정사각형, 작은 정사각형의 한 변의 길이를 ${X} cm, ${Y} cm라 하면 ${nb('4' + X + ' + 4' + Y + ' = ' + L)}, 곧 ${nb(X + ' + ' + Y + ' = ' + (sm + bg))}이고 ${nb(X2 + ' ' + MINUS + ' ' + Y2 + ' = ' + Dd)}이다. ${nb(X2 + ' ' + MINUS + ' ' + Y2 + ' = (' + X + ' + ' + Y + ')(' + X + ' ' + MINUS + ' ' + Y + ')')}이므로 ${nb((sm + bg) + '(' + X + ' ' + MINUS + ' ' + Y + ') = ' + Dd)}, ${nb(X + ' ' + MINUS + ' ' + Y + ' = ' + (bg - sm))}이다. 두 일차방정식을 연립하면 ${nb(X + ' = ' + bg)}, ${nb(Y + ' = ' + sm)}이므로 ${sm} cm, ${bg} cm이다.`,
          facts: { calc: [[`(${L}/4-${Dd}/(${L}/4))/2`, 0], [`(${L}/4+${Dd}/(${L}/4))/2`, 1]], unseen: [4, 2] }
        });
      }
      const gap = bg - sm, S = sm * sm + bg * bg;
      return M(`큰 정사각형의 한 변의 길이가 작은 정사각형의 한 변의 길이보다 ${gap} cm 길고, 두 정사각형의 넓이의 합이 ${S} cm²이다. 두 정사각형의 한 변의 길이를 각각 구하시오.`, [{ answer: sm, lead: '작은 정사각형:', unit: 'cm' }, { answer: bg, lead: '큰 정사각형:', unit: 'cm' }], {
        shown: `작은 정사각형 ${sm} cm, 큰 정사각형 ${bg} cm`,
        explain: `작은 정사각형, 큰 정사각형의 한 변의 길이를 ${X} cm, ${Y} cm라 하면 ${nb(Y + ' = ' + X + ' + ' + gap)}, ${nb(X2 + ' + ' + Y2 + ' = ' + S)}이다. 대입하면 ${nb(eqH(sumH([[2, X2], [2 * gap, X], [gap * gap - S, '']]), '0'))}이고 양수인 근은 ${nb(X + ' = ' + sm)}이다. 따라서 ${sm} cm, ${bg} cm이다.`,
        facts: { calc: [[String(sm), 0], [`${sm}+${gap}`, 1]], unseen: [sm] }
      });
    }, { count: 3 }),
    T('use2-digit', '자리의 숫자로 세우는 연립이차방정식', '②21', (d) => {
      const a = d.int(1, 8), b = d.int(a + 1, 9), S = a * a + b * b, D = 9 * (b - a);
      return N(`두 자리 자연수가 있다. 각 자리의 숫자의 제곱의 합은 ${S}이고, 십의 자리의 숫자와 일의 자리의 숫자를 바꾼 수는 처음 수보다 ${D}만큼 크다. 처음 수는?`, 10 * a + b, {
        explain: `십의 자리의 숫자를 ${X}, 일의 자리의 숫자를 ${Y}라 하면 ${nb(X2 + ' + ' + Y2 + ' = ' + S)}, ${nb('(10' + Y + ' + ' + X + ') ' + MINUS + ' (10' + X + ' + ' + Y + ') = ' + D)}에서 ${nb(Y + ' = ' + X + ' + ' + (b - a))}이다. 대입하면 ${nb(eqH(sumH([[2, X2], [2 * (b - a), X], [(b - a) ** 2 - S, '']]), '0'))}이고 자연수인 근은 ${nb(X + ' = ' + a)}이므로 ${nb(Y + ' = ' + b)}이다. 처음 수는 ${10 * a + b}이다.`,
        facts: { calc: [[`10*${a}+${b}`, 0]], unseen: [a, b, 10].filter((v) => v > 1) }
      });
    }),
    T('use2-bamboo', '부러진 대나무의 높이(피타고라스 정리)', '②22', (d) => {
      const opts = [];
      for (let Hh = 5; Hh <= 20; Hh += 1) for (let dd = 2; dd < Hh; dd += 1) if ((Hh * Hh - dd * dd) % (2 * Hh) === 0) { const x = (Hh * Hh - dd * dd) / (2 * Hh); if (x > 0 && x < Hh - x) opts.push([Hh, dd, x]); }
      const [Hh, dd, x] = d.pick(opts), y = Hh - x;
      return N(`높이가 ${Hh} m인 대나무가 바람에 부러져 그림과 같이 끝이 대나무가 심어진 곳에서 ${dd} m 떨어진 곳에 닿았다. 부러진 곳은 땅에서 몇 m 높이에 있는가? (단, 대나무의 굵기는 생각하지 않는다.)`, x, {
        unit: 'm', figure: bambooFig(x, y, dd),
        explain: `서 있는 부분을 ${X} m, 넘어간 부분을 ${Y} m라 하면 ${nb(X + ' + ' + Y + ' = ' + Hh)}이고, 직각삼각형에서 ${nb(X2 + ' + ' + dd + sup(2) + ' = ' + Y2)}이다. ${nb(Y + ' = ' + Hh + ' ' + MINUS + ' ' + X)}${endJ(X, '을/를')} 대입하면 ${nb(X2 + ' + ' + dd * dd + ' = ' + X2 + ' ' + MINUS + ' ' + 2 * Hh + X + ' + ' + Hh * Hh)}에서 ${nb(X + ' = ' + x)}이다.`,
        facts: { calc: [[`(${Hh}*${Hh}-${dd}*${dd})/(2*${Hh})`, 0]], unseen: [2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
