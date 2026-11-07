// 고2·3 확률과 통계 2단원 이항정리 — 뒤쪽 묶음(곱·합의 전개식에서 계수, 이항계수의 성질, 이항정리의 활용 — 큰 수의 나머지, 파스칼의 삼각형).
// 싣는 기준·뺀 것은 11-3-2a.js 머리에 모아 적었다. 도구는 11-3-2a.js 가 내보낸 B.kit.u1132 를 쓴다.
// 그림: 파스칼의 삼각형(pascalFig). pascal-blank 의 빈칸은 원문 그림을 몰라 셋째 대각선(ₙC₂)에 새로 놓았다(대조표에 「그림 새로 지음」).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M } = B.kit;
  const { MINUS, Q, V, sup, nb, ex, tail } = B.kit.mid;
  const { ms, nC, jh, pw } = B.kit.hs;
  const { mn, sumN, range, cr, combS, jn, sg, pv, mon, lin2, xp, powH, prodH, genS, T, choose, pascalFig } = B.kit.u1132;
  const X_ = V('x'), N_ = V('n');
  // 합을 적은 식: ₙC₀ + ₙC₁ + ⋯ + ₙCₙ (첫 몇 항과 끝 항, 부호 sgn(k) — 1 이면 +, −1 이면 −)
  //  ⋯ 앞의 부호는 다음에 올 항의 부호, 뒤의 부호는 끝 항의 부호이다. 끝 항까지 남은 항이 하나뿐이면 ⋯ 없이 다 적는다.
  const sumH = (n, ks, last, sgn) => {
    const s = sgn || (() => 1), op = (k) => (s(k) < 0 ? ' ' + MINUS + ' ' : ' + '), part = (k, i) => (i === 0 ? (s(k) < 0 ? MINUS : '') : op(k)) + nC(n, k);
    if (last == null || typeof last !== 'number') return ks.map(part).join('') + (last == null ? '' : op(last) + '⋯' + op(last) + nC(n, last));
    const step = ks.length > 1 ? ks[1] - ks[0] : 1, next = ks[ks.length - 1] + step, all = ks.slice();
    if (last - next <= step) { for (let k = next; k <= last; k += step) all.push(k); return all.map(part).join(''); }
    return ks.map(part).join('') + op(next) + '⋯' + op(last) + nC(n, last);
  };

  // ── 곱·합의 전개식에서 계수 ──
  const productTypes = [
    T('prod-two-powers', '두 이항식의 거듭제곱의 곱에서 계수', '①14', (d, k) => {
      if (k === 0) {
        const a1 = d.pick([1, 2]), b1 = d.pick([-2, -1, 1, 2]), a2 = d.pick([1, 2]), b2 = d.pick([-2, -1, 1, 2]), m = d.int(3, 5), n = d.int(3, 5), t = d.int(2, 4);
        if (a1 === a2 && b1 === b2) return null;
        const pairs = range(0, t).filter((i) => i <= m && t - i <= n);
        const part = (i) => cr(m, i) * a1 ** i * b1 ** (m - i) * cr(n, t - i) * a2 ** (t - i) * b2 ** (n - t + i);
        const v = pairs.reduce((s, i) => s + part(i), 0);
        if (v === 0 || Math.abs(v) > 9999 || pairs.length < 3) return null;
        const head = mn(`(${lin2(a1, 'x', b1, '')})^${m}(${lin2(a2, 'x', b2, '')})^${n}`);
        return N(`다항식 ${head}의 전개식에서 ${xp(t)}의 계수는?`, v, {
          signed: true,
          explain: `앞 식의 ${ms('x^p')}의 계수와 뒤 식의 ${ms('x^q')}의 계수를 곱하여 ${ms(`p + q = ${t}`)}인 경우를 모두 더한다: ${pairs.map((i) => `(${i}, ${t - i}) → ${sg(part(i))}`).join(', ')}. 따라서 ${sg(v)}이다.`,
          facts: { calc: [[pairs.map((i) => `${combS(m, i)}*${a1}**${i}*${jn(b1)}**${m - i}*${combS(n, t - i)}*${a2}**${t - i}*${jn(b2)}**${n - t + i}`).join('+'), 0]], rule: 'lin' }
        });
      }
      if (k === 1) {
        const m = d.int(3, 5), n = d.int(2, 4), c1 = d.pick([-2, -1, 1, 2]), c2 = d.pick([-2, -1, 1, 2]), t = d.int(5, 12);
        const pairs = range(0, m).filter((i) => (t - 2 * i) % 3 === 0 && (t - 2 * i) / 3 >= 0 && (t - 2 * i) / 3 <= n);
        if (pairs.length < 2) return null;
        const part = (i) => cr(m, i) * c1 ** i * cr(n, (t - 2 * i) / 3) * c2 ** ((t - 2 * i) / 3);
        const v = pairs.reduce((s, i) => s + part(i), 0);
        if (v === 0 || Math.abs(v) > 9999) return null;
        const head = mn(`(1${mon(c1, 'x^2', false)})^${m}(1${mon(c2, 'x^3', false)})^${n}`);
        return N(`다항식 ${head}의 전개식에서 ${xp(t)}의 계수는?`, v, {
          signed: true,
          explain: `앞 식에서 ${ms('x^{2i}')}, 뒤 식에서 ${ms('x^{3j}')}을 골라 ${ms(`2i + 3j = ${t}`)}인 경우는 ${pairs.map((i) => `(${i}, ${(t - 2 * i) / 3})`).join(', ')}이다. ${pairs.map((i) => sg(part(i))).join(' + ').replace(/\+ −/g, '− ')} = ${sg(v)}이다.`,
          facts: { calc: [[pairs.map((i) => `${combS(m, i)}*${jn(c1)}**${i}*${combS(n, (t - 2 * i) / 3)}*${jn(c2)}**${(t - 2 * i) / 3}`).join('+'), 0]], rule: 'gap' }
        });
      }
      const m = d.int(4, 6), n = d.int(3, 5), c = d.pick([-2, -1, 2, 3]), s = d.pick([1, 2]);
      const part = (i) => cr(m, i) * cr(n, s - i) * c ** (s - i);
      const v = range(0, s).reduce((acc, i) => acc + part(i), 0);
      if (v === 0 || Math.abs(v) > 9999) return null;
      const body = frac(mn(`(1 + x)^${m}(${lin2(1, '', c, 'x')})^${n}`), ms(pv('x', s)));
      return N(`${body}의 전개식에서 상수항은?`, v, {
        signed: true,
        explain: `분자 ${mn(`(1 + x)^${m}(${lin2(1, '', c, 'x')})^${n}`)}의 전개식에서 ${xp(s)}의 계수를 구하면 된다. ${range(0, s).map((i) => `${nC(m, i)} × ${nC(n, s - i)}${s - i ? ' × ' + powH(c, s - i) : ''}`).join(' + ')} = ${sg(v)}이다.`,
        facts: { calc: [[range(0, s).map((i) => `${combS(m, i)}*${combS(n, s - i)}*${jn(c)}**${s - i}`).join('+'), 0]], rule: 'div' }
      });
    }, { count: 3 }),
    T('prod-poly-times', '(다항식) × (이항식)ⁿ의 전개식에서 계수', '①15', (d, k) => {
      if (k === 0) {
        const c = d.pick([-3, -2, -1, 2, 3]), a = d.pick([2, 3]), n = d.int(3, 5), q = d.int(2, n), p = n + 1 - q;
        const v = cr(n, q) * a ** (n - q) + c * cr(n, q - 1) * a ** (n - q + 1);
        if (v === 0 || Math.abs(v) > 9999) return null;
        const head = mn(`(${lin2(1, 'x', c, 'y')})(${lin2(a, 'x', 1, 'y')})^${n}`), want = ms(pv('x', p) + pv('y', q));
        return N(`다항식 ${head}의 전개식에서 ${want}의 계수는?`, v, {
          signed: true,
          explain: `${X_}와 ${mn(`(${a}x + y)^${n}`)}의 ${ms(pv('x', p - 1) + pv('y', q))}의 항, ${ms(mon(c, 'y', true))}와 ${ms(pv('x', p) + pv('y', q - 1))}의 항을 곱한다. ${prodH([nC(n, q), powH(a, n - q)])} + (${sg(c)}) × ${prodH([nC(n, q - 1), powH(a, n - q + 1)])} = ${sg(v)}이다.`,
          facts: { calc: [[`${combS(n, q)}*${a}**${n - q}+${jn(c)}*${combS(n, q - 1)}*${a}**${n - q + 1}`, 0]], rule: 'xy' }
        });
      }
      if (k === 1) {
        const n = d.pick([4, 6]), a = d.pick([1, 2, 3]), c = d.pick([-3, -2, -1, 1, 2, 3]), h = n / 2;
        const inv2 = cr(n, h + 1) * a ** (h - 1), c0 = cr(n, h) * a ** h, v = inv2 + c * c0;
        if (v === 0 || Math.abs(v) > 9999) return null;
        const body = nb(mn(`(x^2${mon(c, '', false)})`) + '(' + ms(mon(a, 'x', true)) + ' + ' + frac('1', X_) + ')' + sup(n));
        return N(`${body}의 전개식에서 상수항은?`, v, {
          signed: true,
          explain: `${ms('x^2')}에 ${xp(-2)}의 항(계수 ${inv2})을, ${sg(c)}에 상수항(${c0})을 곱한 것을 더하면 ${inv2} + ${c < 0 ? '(' + sg(c) + ')' : c} × ${c0} = ${sg(v)}이다.`,
          facts: { calc: [[`${combS(n, h + 1)}*${a}**${h - 1}+${jn(c)}*${combS(n, h)}*${a}**${h}`, 0]], rule: 'const' }
        });
      }
      const n = d.pick([4, 6, 8]), t = d.pick(range(1, n / 2).map((i) => 2 * i));
      const at = (e) => ((n - e) % 2 === 0 && Math.abs(e) <= n ? cr(n, (n - e) / 2) : 0);
      const v = at(t - 2) + at(t);
      const body = nb(ms('(x^2 + x + 1)') + '(' + X_ + ' + ' + frac('1', X_) + ')' + sup(n));
      return N(`${body}의 전개식에서 ${xp(t)}의 계수는?`, v, {
        explain: `${nb('(' + X_ + ' + ' + frac('1', X_) + ')' + sup(n))}의 전개식에는 ${X_}의 지수가 짝수인 항만 있으므로 ${X_}와 짝이 되는 ${xp(t - 1)}의 항은 없다. ${ms('x^2')} × (${xp(t - 2)}의 계수 ${at(t - 2)}) + 1 × (${xp(t)}의 계수 ${at(t)}) = ${v}이다.`,
        facts: { calc: [[`${combS(n, (n - t + 2) / 2)}+${combS(n, (n - t) / 2)}`, 0]], rule: 'tri' }
      });
    }, { count: 3 }),
    T('prod-f-diff', '합의 전개식의 계수로 정한 함수의 차', '①18', (d) => {
      const m = d.int(2, 4), Nn = d.int(8, 14), v = cr(Nn - 1, m) + cr(Nn, m);
      if (v > 9999) return null;
      const fn = ms('f(n)');
      return N(`${m} 이상의 자연수 ${N_}에 대하여 다항식 ${sumN([ms('(1 + x)'), ms('(1 + x)^2'), ms('(1 + x)^3'), '⋯', ms('(1 + x)^n')])}의 전개식에서 ${xp(m)}의 계수를 ${nb(jh(fn, '이라/라'))} 할 때, ${ms(`f(${Nn}) - f(${Nn - 2})`)}의 값은?`, v, {
        explain: `${ms(`f(${Nn}) - f(${Nn - 2})`)}은 ${mn(`(1 + x)^{${Nn - 1}} + (1 + x)^{${Nn}}`)}의 전개식에서 ${xp(m)}의 계수이므로 ${nC(Nn - 1, m)} + ${nC(Nn, m)} = ${cr(Nn - 1, m)} + ${cr(Nn, m)} = ${v}이다.`,
        facts: { calc: [[`${combS(Nn - 1, m)}+${combS(Nn, m)}`, 0]] }
      });
    })
  ];

  // ── 이항계수의 성질 ──
  const sumTypes = [
    T('sum-all-alt', '이항계수의 합과 교대로 더하고 뺀 합', '①20 ①21', (d) => {
      const n = d.int(6, 13), how = d.bool() ? '' : '파스칼의 삼각형을 이용하여 ';
      const alt = (k) => (k % 2 === 0 ? 1 : -1);
      return M(`${how}다음 식의 값을 차례로 구하시오.`, [{ label: '⑴', answer: 2 ** n }, { label: '⑵', answer: 0, signed: true }], {
        figure: lines([`⑴ ${ex(sumH(n, [0, 1, 2], n))}`, `⑵ ${ex(sumH(n, [0, 1, 2], n, alt))}`]),
        explain: `${mn(`(1 + x)^${n}`)} = ${sumH(n, [0, 1], null)}${ms('x')} + ⋯ + ${nC(n, n)}${ms(pv('x', n))}에 ${ms('x = 1')}을 넣으면 ⑴은 ${pw(2, n)} = ${2 ** n}, ${ms('x = -1')}을 넣으면 ⑵는 0이다.`,
        facts: { calc: [[`2**${n}`, 0], [`(1-1)**${n}`, 1]] }
      });
    }),
    T('sum-missing', '일부 항이 빠진 이항계수의 합', '①22', (d) => {
      const n = d.int(6, 13), form = d.pick(['ends', 'first', 'last']);
      const v = form === 'ends' ? 2 ** n - 2 : 2 ** n - 1;
      const h = form === 'ends' ? sumH(n, [1, 2, 3], n - 1) : form === 'first' ? sumH(n, [1, 2, 3], n) : sumH(n, [0, 1, 2], n - 1);
      return N(`다음 식의 값은?`, v, {
        figure: ex(h),
        explain: `${sumH(n, [0, 1], n)} = ${pw(2, n)}에서 빠진 ${form === 'ends' ? `${nC(n, 0)} = 1과 ${nC(n, n)} = 1` : form === 'first' ? `${nC(n, 0)} = 1` : `${nC(n, n)} = 1`}을 빼면 ${2 ** n} − ${form === 'ends' ? 2 : 1} = ${v}이다.`,
        facts: { calc: [[`2**${n}-${form === 'ends' ? 2 : 1}`, 0]], rule: form }
      });
    }),
    T('sum-alt-missing', '일부 항이 빠진 교대합', '①22', (d) => {
      const n = d.int(7, 14), s = d.pick([1, 2, 3]), e = s === 1 ? n - 1 : n;
      const ks = range(s, e), sgn = (k) => ((k - s) % 2 === 0 ? 1 : -1), v = ks.reduce((acc, k) => acc + sgn(k) * cr(n, k), 0);
      const missing = range(0, n).filter((k) => k < s || k > e);
      return N(`다음 식의 값은?`, v, {
        signed: true,
        figure: ex(sumH(n, [s, s + 1, s + 2], e, sgn)),
        explain: `${sumH(n, [0, 1, 2], n, (k) => (k % 2 === 0 ? 1 : -1))} = 0이다. 주어진 식은 이 식에서 ${jh(missing.map((k) => nC(n, k)).join(', '), '이/가')} 빠지고${sgn(s) === (s % 2 === 0 ? 1 : -1) ? '' : ' 부호가 모두 바뀐'} 것이므로 ${sg(v)}이다.`,
        facts: { calc: [[ks.map((k) => (sgn(k) < 0 ? '-' : '+') + combS(n, k)).join('').replace(/^\+/, ''), 0]] }
      });
    }),
    T('sum-even-odd', '짝수 번째·홀수 번째 이항계수의 합', '①23', (d, k) => {
      if (k === 0) {
        const n = d.int(6, 14), odd = d.bool(), ks = odd ? [1, 3, 5] : [0, 2, 4], last = odd ? (n % 2 ? n : n - 1) : (n % 2 ? n - 1 : n);
        return N(`다음 식의 값은?`, 2 ** (n - 1), {
          figure: ex(sumH(n, ks, last)),
          explain: `${mn(`(1 + x)^${n}`)}에 ${ms('x = 1')}, ${ms('x = -1')}을 넣은 두 식을 ${odd ? '빼면' : '더하면'} 아래 첨자가 ${odd ? '홀수' : '짝수'}인 이항계수의 합의 2배가 ${pw(2, n)}이므로 구하는 값은 ${pw(2, n - 1)} = ${2 ** (n - 1)}이다.`,
          facts: { calc: [[`2**(${n}-1)`, 0]], rule: odd ? 'odd' : 'even' }
        });
      }
      const K = d.int(10, 24), fnH = ms('f(n)'), es = d.shuffle([K - 1, K, 2 * K - 2, 2 * K - 1, 2 * K]);
      const twoN = ms('2n');
      return choose(d, `자연수 ${N_}에 대하여 ${fnH} = ${nC(twoN, 0)} + ${nC(twoN, 2)} + ${nC(twoN, 4)} + ⋯ + ${nC(twoN, twoN)}일 때, ${ms(`f(${K})`)}의 값은?`, es.map((e) => ({ h: pw(2, e), ok: e === 2 * K - 1, v: 2 ** e })), {
        explain: `${ms('(1 + x)^{2n}')}에 ${ms('x = 1')}, ${ms('x = -1')}을 넣어 더하면 ${ms('2f(n) = 2^{2n}')}이므로 ${ms('f(n) = 2^{2n-1}')}, ${ms(`f(${K})`)} = ${pw(2, 2 * K - 1)}이다.`,
        pickExpr: `2**(2*${K}-1)`
      });
    }, { count: 2 }),
    T('sum-back-n', '이항계수의 합이 주어질 때 n 구하기', '①24', (d, k) => {
      if (k === 0) {
        const n = d.int(3, 7), odd = d.bool(), V2 = 2 ** (2 * n - 1), twoN = ms('2n');
        const h = odd ? `${nC(twoN, 1)} + ${nC(twoN, 3)} + ${nC(twoN, 5)} + ⋯ + ${nC(twoN, '2n-1')}` : `${nC(twoN, 0)} + ${nC(twoN, 2)} + ${nC(twoN, 4)} + ⋯ + ${nC(twoN, twoN)}`;
        return N(`등식 ${h} = ${josa(V2, '을/를')} 만족시키는 자연수 ${N_}의 값은?`, n, {
          explain: `${odd ? '홀수' : '짝수'}인 아래 첨자의 이항계수의 합은 전체 합 ${ms('2^{2n}')}의 절반인 ${ms('2^{2n-1}')}이다. ${ms('2^{2n-1}')} = ${V2} = ${pw(2, 2 * n - 1)}에서 ${N_} = ${n}이다.`,
          facts: { digit: { template: `${V2 - 1}<2**(2*□-1)<${V2 + 1}`, lo: 1, hi: 12, ask: 'only' } }
        });
      }
      const a = d.int(5, 11), b = d.int(5, 11), n = a + b - 2;
      if (a === b || n > 30) return null;
      const oddSum = (m) => '(' + sumH(m, [1, 3], m % 2 ? m : m - 1) + ')';
      return N(`등식 ${oddSum(a)}${oddSum(b)} = ${nC(N_, 0)} + ${nC(N_, 1)} + ⋯ + ${nC(N_, N_)}을 만족시키는 자연수 ${N_}의 값은?`, n, {
        explain: `홀수인 아래 첨자의 이항계수의 합은 ${pw(2, a - 1)}, ${pw(2, b - 1)}이고 오른쪽은 ${ms('2^n')}이다. ${pw(2, a - 1)} × ${pw(2, b - 1)} = ${pw(2, n)}이므로 ${N_} = ${n}이다.`,
        facts: { digit: { template: `${2 ** n - 1}<2**□<${2 ** n + 1}`, lo: 1, hi: 40, ask: 'only' } }
      });
    }, { count: 2 }),
    T('sum-range', '이항계수의 합의 범위로 n 구하기', '①25', (d) => {
      const n = d.int(8, 13), lo = 2 ** (n - 1) - 1, hi = 2 ** n - 1, hi2 = 2 ** (n + 1) - 1;
      const step = n >= 11 ? 1000 : 100, L = d.until(() => step * d.int(Math.ceil(lo / step), Math.floor((hi - 1) / step)), (x) => x > lo && x < hi);
      const U = d.until(() => step * d.int(Math.ceil((hi + 1) / step), Math.floor((hi2 - 1) / step)), (x) => x > hi && x < hi2);
      return N(`다음 부등식을 만족시키는 자연수 ${N_}의 값은?`, n, {
        figure: ex(`${L} &lt; ${nC(N_, 1)} + ${nC(N_, 2)} + ${nC(N_, 3)} + ⋯ + ${nC(N_, N_)} &lt; ${U}`),
        explain: `가운데 식은 ${ms('2^n')} − ${nC(N_, 0)} = ${ms('2^n - 1')}이다. ${pw(2, n)} − 1 = ${hi}만 ${L}과 ${U} 사이에 있으므로 ${N_} = ${n}이다.`,
        facts: { digit: { template: `${L}<2**□-1<${U}`, lo: 1, hi: 20, ask: 'only' } }
      });
    }),
    T('sum-power', 'ₙC₀ + ₙC₁p + ⋯ + ₙCₙpⁿ = (1 + p)ⁿ', '①26 심2', (d, k) => {
      if (k === 0) {
        const [p, n] = d.pick([[3, 4], [2, 5], [2, 6], [4, 4], [2, 8], [3, 5], [4, 5], [5, 4], [6, 4], [2, 7], [3, 6], [7, 4]]), v = (1 + p) ** n;
        const h = `${nC(n, 0)} + ${nC(n, 1)} × ${p} + ${nC(n, 2)} × ${pw(p, 2)} + ⋯ + ${nC(n, n)} × ${pw(p, n)}`;
        return N(`다음 식의 값은?`, v, {
          figure: ex(h),
          explain: `${mn(`(1 + x)^${n}`)} = ${nC(n, 0)} + ${nC(n, 1)}${X_} + ⋯ + ${nC(n, n)}${ms(pv('x', n))}에 ${ms(`x = ${p}`)}${tail(p, '을/를')} 넣은 것이므로 ${pw(1 + p, n)} = ${v}이다.`,
          facts: { calc: [[`(1+${p})**${n}`, 0]], rule: 'value' }
        });
      }
      const [p, b, e] = d.pick([[7, 2, 3], [3, 2, 2], [8, 3, 2], [15, 2, 4]]), n = d.int(4, 6), top = e * n, start = top - d.int(0, 4);
      const es = range(start, start + 4);
      const h = `${nC(n, 0)} + ${nC(n, 1)} × ${p} + ${nC(n, 2)} × ${pw(p, 2)} + ⋯ + ${nC(n, n)} × ${pw(p, n)}`;
      return choose(d, `다음 식의 값과 같은 것은?`, es.map((x) => ({ h: pw(b, x), ok: x === top, v: b ** x })), {
        figure: ex(h),
        explain: `${mn(`(1 + x)^${n}`)}에 ${ms(`x = ${p}`)}${tail(p, '을/를')} 넣은 것이므로 ${pw(1 + p, n)} = ${nb('(' + pw(b, e) + ')' + sup(n))} = ${pw(b, top)}이다.`,
        pickExpr: `(1+${p})**${n}`
      });
    }, { count: 2 }),
    T('sum-subsets', '원소의 개수가 홀수인 부분집합의 개수', '①27', (d, k) => {
      if (k === 0) {
        const n = d.int(7, 13);
        return N(`원소의 개수가 ${n}인 집합 A의 부분집합 가운데 원소의 개수가 홀수인 것의 개수는?`, 2 ** (n - 1), {
          explain: `원소가 ${V('k')}개인 부분집합은 ${nC(n, 'k')}개이므로 ${sumH(n, [1, 3], n % 2 ? n : n - 1)} = ${pw(2, n - 1)} = ${2 ** (n - 1)}이다.`,
          facts: { calc: [[`2**(${n}-1)`, 0]] }
        });
      }
      const n = d.int(9, 13), m = d.int(2, n - 2), W = 2 ** (n - 1), v = cr(n, m);
      if (v > 9999) return null;
      return N(`공집합이 아닌 집합 A의 부분집합 가운데 원소의 개수가 홀수인 것의 개수가 ${W}일 때, 집합 A의 부분집합 가운데 원소의 개수가 ${m}인 것의 개수는?`, v, {
        explain: `A의 원소가 ${N_}개이면 원소의 개수가 홀수인 부분집합은 ${ms('2^{n-1}')}개이므로 ${ms('2^{n-1}')} = ${W}, ${N_} = ${n}이다. 따라서 ${nC(n, m)} = ${v}이다.`,
        facts: { calc: [[combS(n, m), 0]] }
      });
    }, { count: 2 }),
    T('sum-mod3', '이항계수의 합을 3으로 나눈 나머지', '①28', (d) => {
      const r = d.pick([0, 1]), L = d.int(30, 120), v = r === 1 ? Math.ceil(L / 2) : Math.floor(L / 2);
      const h = `${nC(N_, 1)} + ${nC(N_, 2)} + ${nC(N_, 3)} + ⋯ + ${nC(N_, N_)}`;
      return N(`${jh(h, '을/를')} 3으로 나눈 나머지가 ${josa(r, '이/가')} 되도록 하는 ${L} 이하의 자연수 ${N_}의 개수는?`, v, {
        explain: `주어진 합은 ${ms('2^n - 1')}이다. ${ms('2^n')}을 3으로 나눈 나머지는 ${ms('n')}이 홀수이면 2, 짝수이면 1이므로 ${ms('2^n - 1')}을 3으로 나눈 나머지는 ${ms('n')}이 홀수일 때 1, 짝수일 때 0이다. ${L} 이하의 ${r === 1 ? '홀수' : '짝수'}는 ${v}개이다.`,
        facts: { calc: [[r === 1 ? `(${L}+1-(${L}+1)%2)/2` : `(${L}-${L}%2)/2`, 0]] }
      });
    })
  ];

  // ── 이항정리의 활용 — 큰 수의 나머지 ──
  const remainderTypes = [
    T('rem-mod', '거듭제곱을 나눈 나머지', '①31', (d) => {
      const m = d.pick([20, 30, 40, 50, 60]), base = m + 1, n = d.int(6, m - 1), v = 1 + n * m;
      if (v >= m * m || v > 9999) return null;
      return N(`${jh(pw(base, n), '을/를')} ${josa(m * m, '으로/로')} 나눈 나머지는?`, v, {
        explain: `${pw(base, n)} = ${mn(`(1 + ${m})^{${n}}`)} = ${nC(n, 0)} + ${nC(n, 1)} × ${m} + ${nC(n, 2)} × ${pw(m, 2)} + ⋯ 이고 셋째 항부터는 ${pw(m, 2)} = ${m * m}의 배수이다. 1 + ${n} × ${m} = ${v}이므로 나머지는 ${v}이다.`,
        facts: { calc: [[`1+${n}*(${base}-1)`, 0]] }
      });
    }),
    T('rem-digits', '거듭제곱의 끝 세 자리 숫자', '①32', (d) => {
      const t = d.pick([2, 3, 4, 5, 6]), base = 10 * t + 1, n = d.int(5, 20);
      const T3 = 1 + n * (base - 1) + cr(n, 2) * (base - 1) ** 2, R = T3 % 1000, dig = [Math.floor(R / 100), Math.floor(R / 10) % 10, R % 10];
      const sT = `(1+${n}*(${base}-1)+${combS(n, 2)}*(${base}-1)**2)`;
      const ex3 = [`(${sT}%1000-${sT}%100)/100`, `(${sT}%100-${sT}%10)/10`, `${sT}%10`];
      return M(`${pw(base, n)}의 백의 자리의 숫자, 십의 자리의 숫자, 일의 자리의 숫자를 차례로 구하시오.`, [{ label: '백의 자리', answer: dig[0] }, { label: '십의 자리', answer: dig[1] }, { label: '일의 자리', answer: dig[2] }], {
        explain: `${pw(base, n)} = ${mn(`(1 + ${base - 1})^{${n}}`)}에서 ${pw(base - 1, 3)}이 곱해진 항부터는 1000의 배수이다. 1 + ${n} × ${base - 1} + ${cr(n, 2)} × ${pw(base - 1, 2)} = ${T3}이므로 끝 세 자리는 ${String(R).padStart(3, '0')}이다.`,
        facts: { calc: ex3.map((s, i) => [s, i]).filter(([, i]) => dig[i] > 0), parts: ex3.map((s, i) => [s, i]).filter(([, i]) => dig[i] === 0), unseen: [1000] }
      });
    })
  ];

  // ── 파스칼의 삼각형 ──
  const ROWS_SAID = (rows) => `파스칼의 삼각형: 맨 위의 1부터 ${rows}줄. `;
  const pascalTypes = [
    T('pascal-blank', '파스칼의 삼각형의 빈칸', '①34', (d) => {
      const s = d.pick([3, 4]), right = d.bool(), rows = 8, LAB = ['㉠', '㉡', '㉢', '㉣'];
      const isBlank = (i, j) => i >= s && i <= s + 3 && j === (right ? i - 2 : 2);
      const said = ROWS_SAID(rows) + range(0, rows - 1).map((i) => `${i + 1}번째 줄 ` + range(0, i).map((j) => (isBlank(i, j) ? LAB[i - s] : cr(i, j))).join(', ')).join(' / ');
      const fig = pascalFig(rows, (i, j) => (isBlank(i, j) ? { blank: LAB[i - s] } : { t: String(cr(i, j)) }), said);
      return M(`다음 파스칼의 삼각형에서 ㉠, ㉡, ㉢, ㉣에 알맞은 수를 차례로 구하시오.`, range(0, 3).map((k) => ({ label: LAB[k], answer: cr(s + k, 2) })), {
        figure: fig,
        explain: `이웃한 두 수의 합은 그 두 수의 아래 중앙의 수이다. ${range(0, 3).map((k) => `${LAB[k]} = ${cr(s + k - 1, 1)} + ${cr(s + k - 1, 2)} = ${cr(s + k, 2)}`).join(', ')}이다.`,
        facts: { calc: range(0, 3).map((k) => [range(1, s + k - 1).join('+'), k]) }
      });
    }),
    T('pascal-adjacent', 'ₙCᵣ + ₙCᵣ₊₁ = ₘCₖ에서 n, r 구하기', '①35', (d, k) => {
      // 등식을 만족시키는 (n, r)를 모두 센다(r 은 자연수, 조건 r ≤ n − gap). 이웃한 두 수를 더한 값은 늘 그 아래의 이항계수 ₙ₊₁Cᵣ₊₁ 이다.
      //  조건이 없으면 r + 1 = n 인 쪽(ₙCₙ₋₁ + ₙCₙ = n + 1)에서 답이 하나 더 생긴다(원문은 이것을 묻지 않았다) — 그래서 조건을 붙인다.
      const all = (lhs, rhs, gap) => { const out = []; for (let n = 1; n <= 4000; n += 1) { if (cr(n, 1) > 4000) break; for (let r = 1; r <= n - gap; r += 1) { const L = lhs(n, r); if (L > 5000) break; if (L === rhs(n)) out.push([n, r]); } } return out; };
      if (k === 0) {
        const m = d.pick([6, 8, 10, 12, 14]), h = m / 2, shift = d.bool(), gap = shift ? 3 : 2, target = cr(m, h);
        const hits = all((n, r) => (shift ? cr(n - 1, r) + cr(n - 1, r + 1) : cr(n, r) + cr(n, r + 1)), () => target, gap);
        const nAns = shift ? m : m - 1;
        if (hits.length !== 1 || hits[0][0] !== nAns || hits[0][1] !== h - 1) return null;
        const lhs = shift ? `${nC('n-1', 'r')} + ${nC('n-1', 'r+1')}` : `${nC('n', 'r')} + ${nC('n', 'r+1')}`;
        return M(`파스칼의 삼각형을 이용하여 등식 ${lhs} = ${jh(nC(m, h), '을/를')} 만족시키는 두 자연수 ${N_}, ${V('r')}의 값을 차례로 구하시오. (단, ${mn(`r <= n - ${gap}`)})`, [{ label: N_ + ' =', answer: nAns }, { label: V('r') + ' =', answer: h - 1 }], {
          explain: `이웃한 두 수의 합은 그 아래 중앙의 수이므로 왼쪽은 ${shift ? nC('n', 'r+1') : nC('n+1', 'r+1')}이다. ${shift ? nC('n', 'r+1') : nC('n+1', 'r+1')} = ${nC(m, h)}에서 ${N_} = ${nAns}, ${V('r')} = ${h - 1}이다.`,
          facts: { calc: [[shift ? String(m) : `${m}-1`, 0], [`${h}-1`, 1]] }
        });
      }
      const a = d.pick([5, 7, 9, 11]), h = (a + 1) / 2;
      // n 은 모르는 수: aCᵣ + aCᵣ₊₁ = ₙCₕ 를 만족시키는 (n, r)(1 ≤ r ≤ a − 1)를 모두 센다.
      const hits = []; for (let r = 1; r <= a - 1; r += 1) for (let n = h; n <= 400; n += 1) { const c = cr(n, h); if (c > cr(a, r) + cr(a, r + 1)) break; if (c === cr(a, r) + cr(a, r + 1)) hits.push([n, r]); }
      if (hits.length !== 1 || hits[0][0] !== a + 1 || hits[0][1] !== h - 1) return null;
      return M(`등식 ${nC(a, 'r')} + ${nC(a, 'r+1')} = ${jh(nC(N_, h), '을/를')} 만족시키는 두 자연수 ${N_}, ${V('r')}의 값을 차례로 구하시오. (단, ${mn(`r <= ${a - 1}`)})`, [{ label: N_ + ' =', answer: a + 1 }, { label: V('r') + ' =', answer: h - 1 }], {
        explain: `${nC(a, 'r')} + ${nC(a, 'r+1')} = ${nC(a + 1, 'r+1')}이므로 ${nC(a + 1, 'r+1')} = ${nC(N_, h)}이다. 따라서 ${N_} = ${a + 1}이고 ${V('r')} + 1 = ${h}에서 ${V('r')} = ${h - 1}이다.`,
        facts: { calc: [[`${a}+1`, 0], [`${h}-1`, 1]] }
      });
    }, { count: 2 }),
    T('pascal-row-sum', '각 행의 수의 총합이 어떤 수의 배수가 될 수 있는가', '①36', (d) => {
      const kk = d.pick([6, 10, 12, 3, 5, 18]);
      const rows = [
        { h: `없다. 각 행에 배열된 수의 총합은 2의 거듭제곱이기 때문이다.`, ok: true },
        { h: `없다. 각 행에 배열된 수의 총합은 모두 홀수이기 때문이다.`, ok: false },
        { h: `있다. 각 행에 배열된 수의 총합은 아래로 내려갈수록 2씩 커지기 때문이다.`, ok: false },
        { h: `있다. 각 행에 배열된 수의 총합은 아래로 내려갈수록 1씩 커지기 때문이다.`, ok: false },
        { h: `있다. 각 행에 배열된 수의 총합은 아래로 내려갈수록 3배가 되기 때문이다.`, ok: false }
      ];
      return choose(d, `파스칼의 삼각형에서 각 행에 배열된 수의 총합이 ${kk}의 배수가 되는 행이 있는지 판단한 것으로 옳은 것은?`, rows, {
        explain: `맨 위의 행을 0번째 행이라 하면 ${ms('n')}번째 행의 수의 총합은 ${sumH(N_, [0, 1], N_)} = ${ms('2^n')}이다. 2의 거듭제곱의 소인수는 2뿐이므로 ${kk}의 배수가 될 수 없다.`
      });
    }),
    T('pascal-hockey', '대각선의 합(하키 스틱)을 조합 하나로', '①37', (d, k) => {
      if (k === 0) {
        const a = d.int(3, 5), len = d.int(5, 12), b = a + len;
        if (cr(b + 1, len) > 99999) return null;
        const h = `${nC(a, 0)} + ${nC(a + 1, 1)} + ${nC(a + 2, 2)} + ⋯ + ${nC(b, len)}`;
        return N(`등식 ${h} = ${jh(nC(N_, len), '을/를')} 만족시키는 자연수 ${N_}의 값은?`, b + 1, {
          explain: `${nC(a, 0)} = ${nC(a + 1, 0)} = 1로 바꾸면 ${nC(a + 1, 0)} + ${nC(a + 1, 1)} = ${nC(a + 2, 1)}, ${nC(a + 2, 1)} + ${nC(a + 2, 2)} = ${nC(a + 3, 2)}, ⋯처럼 이웃한 두 수를 차례로 합칠 수 있다. 끝에는 ${nC(b, len - 1)} + ${nC(b, len)} = ${nC(b + 1, len)}이므로 ${N_} = ${b + 1}이다.`,
          facts: { calc: [[`${b}+1`, 0]] }
        });
      }
      if (k === 1) {
        const a = d.int(6, 9), len = d.int(3, 4), b = a + len - 1, kk = len + 1, total = cr(b + 1, kk);
        const terms = [[a, 1], [a, 2]].concat(range(1, len - 1).map((i) => [a + i, 2 + i]));
        const cand = [[b + 1, kk], [b + 1, kk - 1], [b, kk], [b + 2, kk + 1], [b + 1, kk + 1], [b + 2, kk]].filter(([x, y], i, all) => y <= x && all.findIndex(([p, q]) => cr(p, q) === cr(x, y)) === i);
        if (cand[0][0] !== b + 1 || cand.length < 5) return null;
        const opts = cand.slice(0, 5);
        return choose(d, `다음 중 ${terms.map(([x, y]) => nC(x, y)).join(' + ')}의 값과 같은 것은?`, opts.map(([x, y]) => ({ h: nC(x, y), ok: x === b + 1 && y === kk, v: cr(x, y) })), {
          explain: `${nC(a, 1)} + ${nC(a, 2)} = ${nC(a + 1, 2)}이고, 이어서 ${nC(a + 1, 2)} + ${nC(a + 1, 3)} = ${nC(a + 2, 3)}, ⋯처럼 차례로 합치면 ${nC(b + 1, kk)}이다.`,
          pickExpr: terms.map(([x, y]) => combS(x, y)).join('+')
        });
      }
      const r = d.pick([2, 3]), b = d.int(6, 10), v = cr(b + 1, r + 1);
      const h = `${nC(r, r)} + ${nC(r + 1, r)} + ${nC(r + 2, r)} + ⋯ + ${nC(b, r)}`;
      return N(`파스칼의 삼각형을 이용하여 다음 식의 값을 구하시오.`, v, {
        figure: ex(h),
        explain: `${nC(r, r)} = ${jh(nC(r + 1, r + 1), '으로/로')} 바꾸어 이웃한 두 수를 차례로 합치면 ${nC(r + 1, r + 1)} + ${nC(r + 1, r)} = ${nC(r + 2, r + 1)}, ⋯, 끝에는 ${nC(b + 1, r + 1)} = ${v}이다.`,
        facts: { calc: [[range(r, b).map((x) => combS(x, r)).join('+'), 0]], rule: 'hockey' }
      });
    }, { count: 3 }),
    T('pascal-coef-sum', '(1 + x)ᵏ의 합에서 계수 — 하키 스틱으로 모으기', '①38', (d, k) => {
      if (k === 0) {
        const m = d.pick([2, 3]), a = d.pick([1, m]), b = d.int(10, 20), v = cr(b + 1, m + 1);
        if (v > 9999) return null;
        const head = sumN(a === 1 ? [ms('(1 + x)'), ms('(1 + x)^2'), ms('(1 + x)^3'), '⋯', mn(`(1 + x)^{${b}}`)] : [mn(`(1 + x)^${m}`), mn(`(1 + x)^{${m + 1}}`), mn(`(1 + x)^{${m + 2}}`), '⋯', mn(`(1 + x)^{${b}}`)]);
        return N(`${head}의 전개식에서 ${xp(m)}의 계수는?`, v, {
          explain: `${xp(m)}의 계수는 ${nC(m, m)} + ${nC(m + 1, m)} + ⋯ + ${nC(b, m)}이다. ${nC(m, m)} = ${jh(nC(m + 1, m + 1), '으로/로')} 바꾸어 이웃한 두 수를 차례로 합치면 ${nC(b + 1, m + 1)} = ${v}이다.`,
          facts: { calc: [[range(m, b).map((x) => combS(x, m)).join('+'), 0]] }
        });
      }
      const m = d.pick([2, 3]), b = d.int(9, 16), e = 2 * m + 2, v = cr(b + 1, m + 1);
      if (v > 9999) return null;
      const head = sumN([ms('x^2(1 + x^2)'), ms('x^2(1 + x^2)^2'), ms('x^2(1 + x^2)^3'), '⋯', ms(`x^2(1 + x^2)^{${b}}`)]);
      return N(`다음 식의 전개식에서 ${xp(e)}의 계수는?`, v, {
        figure: ex(head),
        explain: `${ms('x^2(1 + x^2)^k')}의 일반항은 ${nC('k', 'r')}${ms('x^{2r+2}')}이므로 ${xp(e)}의 항은 ${ms(`r = ${m}`)}일 때이다. ${nC(m, m)} + ${nC(m + 1, m)} + ⋯ + ${nC(b, m)} = ${nC(b + 1, m + 1)} = ${v}이다.`,
        facts: { calc: [[range(m, b).map((x) => combS(x, m)).join('+'), 0]] }
      });
    }, { count: 2 })
  ];

  B.addTypes('11-3-2', 'product', productTypes);
  B.addTypes('11-3-2', 'sums', sumTypes);
  B.addTypes('11-3-2', 'remainder', remainderTypes);
  B.addTypes('11-3-2', 'pascal', pascalTypes);
})(typeof window !== 'undefined' ? window : globalThis);
