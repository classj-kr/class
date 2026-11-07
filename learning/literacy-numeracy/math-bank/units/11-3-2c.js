// 고2·3 확률과 통계 2단원 이항정리 — 실력 문항.
// 이 단원에서 흔히 잘못 아는 것
//  - 일반항의 x 지수를 세우고 r 을 구하면 끝이라고 여긴다: r 은 0 이상 n 이하의 「정수」여야 한다. 지수 방정식의 해가 정수가 아니면 그 항은 없다
//    ((x⁶ + 1/x³)ⁿ 에 상수항이 있으려면 n 이 3의 배수, (x + 1/x)⁸ 에는 x 의 홀수 제곱 항이 없다).
//  - 곱의 전개식에서 앞 식의 항마다 짝을 찾을 때, 짝이 없는 항(위의 홀수 제곱)이나 조건 k ≤ i 를 넘는 짝((1 − x²)² 에서 x¹⁰)을 셈에 넣는다.
//  - (x + 2)ⁿ 에서 xᵏ 의 계수를 ₙCₖ × 2ᵏ 으로 적는다: 2 의 지수는 x 와 짝이 아닌 n − k 이다.
//  - 11¹⁰⁰ − 1 의 끝자리 0의 개수를 첫 두 항만 보고 정한다: 몇째 항부터 10ⁿ⁺¹ 의 배수인지 따져야 한다.
//  - 파스칼의 삼각형의 대각선의 합을 이웃 합으로 모을 때 첫 칸을 값이 같은 다른 조합(₂C₀ = ₃C₀)으로 바꾸지 않아 한 칸씩 어긋난다.
// 실력에 둔 것: ① 뜻을 정확히 대야 풀리는 함정 — ①13(r 이 정수), ①16(짝이 없는 항·a 에 무관한 상수항), ①17(x 항이 없다), ①19(k ≤ i),
//   ①33(10⁴ 의 배수가 아니다), 심3(2 의 지수 n − k) / ② 세 단계 넘게 잇는 것 — ①39(두 대각선을 각각 모으고 보충해 빼기), ①41(계수가 가장 큰 항 — 이웃 계수의 비).
// 그림: hard-two-strips 의 파스칼의 삼각형은 원문 평가지 그림이 없어 칸마다 ₙCᵣ 를 적은 삼각형에 두 대각선을 칠해 새로 지었다(대조표에 「그림 새로 지음」).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, box, N } = B.kit;
  const { MINUS, Q, V, sup, nb, gcd, tail } = B.kit.mid;
  const { ms, nC, pw, qAns, jh } = B.kit.hs;
  const { mn, sumN, range, cr, combS, sg, pv, xp, ORD, H, choose, pascalFig } = B.kit.u1132;
  const X_ = V('x'), A_ = V('a'), N_ = V('n'), R_ = V('r');

  const hardTypes = [
    H('hard-const-n', '상수항이 생기는 지수 n — 몇 번째로 작은 n', '①13', (d) => {
      const p = d.int(2, 6), q = d.int(1, 4), g = gcd(p, q), L = (p + q) / g, k = d.int(3, 10);
      if (p === q || L < 3 || L === p + q && d.bool()) return null;
      const expr = nb('(' + ms(pv('x', p)) + ' + ' + frac('1', ms(pv('x', q))) + ')' + sup(N_));
      return N(`${expr}의 전개식에 상수항이 있도록 하는 자연수 ${N_}의 값을 작은 것부터 차례로 나열할 때, ${ORD[k]} 번째 수는?`, k * L, {
        explain: `일반항 ${nC('n', 'r')}${ms(`x^{${p}(n-r)}`)} × ${frac('1', ms(`x^{${q === 1 ? '' : q}r}`))}의 ${X_}의 지수는 ${ms(`${p}(n - r) - ${q === 1 ? '' : q}r`)}이고, 이것이 0이면 ${R_} = ${frac(ms(`${p}n`), p + q)}이다. ${R_}은 0 이상 ${N_} 이하의 정수여야 하므로 ${N_}은 ${L}의 배수이다. 따라서 ${ORD[k]} 번째 수는 ${k} × ${L} = ${k * L}이다.`,
        facts: { calc: [[`${k}*(${p}+${q})/${g}`, 0]] }
      });
    }),
    H('hard-poly-frac-a', '(x² + x + 1) × (분수식)ⁿ의 계수가 주어질 때 상수 a', '①16', (d) => {
      const n = d.pick([6, 8, 10]), h = n / 2, C0 = cr(n, h), C1 = cr(n, h - 1), p = d.int(1, 4), q = d.int(2, 6);
      if (gcd(p, q) !== 1 || (C1 * q * q) % (p * p) !== 0) return null;
      const T0 = C0 + C1 * q * q / (p * p);
      if (T0 > 9999) return null;
      const expr = nb(ms('(x^2 + x + 1)') + '(' + frac(X_, A_) + ' + ' + frac(A_, X_) + ')' + sup(n));
      return qAns(`${expr}의 전개식에서 ${xp(2)}의 계수가 ${T0}일 때, 양수 ${A_}의 값은?`, Q(p, q), {
        explain: `일반항 ${nC(n, 'r')}(${frac(X_, A_)})${sup(ms(`${n}-r`))}(${frac(A_, X_)})${sup(R_)} = ${nC(n, 'r')}${ms(`a^{2r-${n}}x^{${n}-2r}`)}에는 ${X_}의 지수가 짝수인 항만 있다. 그래서 ${xp(2)}의 항은 ${ms('x^2')} × (상수항 ${nC(n, h)} = ${C0}, ${A_}에 무관)과 1 × (${xp(2)}의 항 ${nC(n, h - 1)}${ms('a^{-2}')})뿐이다. ${C0} + ${frac(C1, ms('a^2'))} = ${T0}에서 ${ms('a^2')} = ${frac(p * p, q * q)}, ${A_} = ${frac(p, q)}이다.`,
        facts: { value: `${C1}*${q}/((${T0}-${C0})*${p})` }
      });
    }),
    H('hard-sum-two', '두 이항식 거듭제곱의 합에서 계수의 조건', '①17', (d) => {
      const k = d.pick([2, 3]), t = d.pick([1, 2, 3, 5, 6, 7]), S = 15 * (1 + k * k) * t;
      const e1 = nb('(' + X_ + ' + ' + frac(A_, X_) + ')' + sup(6)), e2 = nb('(' + X_ + ' ' + MINUS + ' ' + frac(ms(`${k}a`), X_) + ')' + sup(6));
      return N(`${e1} + ${e2}의 전개식에서 ${X_}의 계수와 ${xp(2)}의 계수의 합이 ${S}일 때, 상수 ${A_}에 대하여 ${ms('a^2')}의 값은?`, t, {
        explain: `두 식의 일반항의 ${X_}의 지수는 ${ms('6 - 2r')}로 늘 짝수이므로 ${X_}의 항은 없다(계수 0). ${xp(2)}의 항은 ${R_} = 2일 때이므로 계수는 ${nC(6, 2)}${ms('a^2')} + ${nC(6, 2)}${mn(`(-${k}a)^2`)} = ${15 * (1 + k * k)}${ms('a^2')}이다. ${15 * (1 + k * k)}${ms('a^2')} = ${S}에서 ${ms('a^2')} = ${t}이다.`,
        facts: { value: `${S}/(${combS(6, 2)}*(1+${k}**2))` }
      });
    }),
    H('hard-diff-powers', '식마다 거듭제곱이 다른 합에서 계수', '①19', (d) => {
      const m = d.pick([6, 8, 9, 10, 12]), Nn = d.int(m, 20);
      const pairs = range(1, Nn).filter((i) => m % i === 0 && m / i <= i).map((i) => [i, m / i]);
      const v = pairs.reduce((s, [i, k]) => s + cr(i, k) * (-1) ** k, 0), cut = range(1, m).filter((i) => m % i === 0 && m / i > i).map((i) => [i, m / i]);
      const expr = sumN([ms('(1 - x)'), ms('(1 - x^2)^2'), ms('(1 - x^3)^3'), '⋯', mn(`(1 - x^{${Nn}})^{${Nn}}`)]);
      return N(`${expr}의 전개식에서 ${xp(m)}의 계수는?`, v, {
        signed: true,
        explain: `${ms('(1 - x^i)^i')}의 일반항은 ${nC('i', 'k')}${ms('(-1)^k x^{ik}')}이고 ${ms('0 <= k <= i')}이다. ${ms(`ik = ${m}`)}인 (${V('i')}, ${V('k')}) 가운데 ${cut.map(([i, k]) => `(${i}, ${k})`).join(', ')}는 ${ms('k > i')}라 안 되고 ${pairs.map(([i, k]) => `(${i}, ${k})`).join(', ')}만 된다. ${pairs.map(([i, k]) => `${nC(i, k)} × (${MINUS}1)${sup(k)}`).join(' + ')} = ${sg(v)}이다.`,
        facts: { calc: [[pairs.map(([i, k]) => `${combS(i, k)}*(-1)**${k}`).join('+'), 0]] }
      });
    }),
    H('hard-ten-power', '거듭제곱 − 1이 10ⁿ의 배수가 되는 가장 큰 n', '①33', (d) => {
      const s = d.pick([1, 2, 3]), base = 10 * s + 1, n = d.pick([20, 25, 40, 50, 60, 75, 100, 120, 125, 150, 200]);
      let V0 = BigInt(base) ** BigInt(n) - 1n, z = 0;
      while (V0 % 10n === 0n) { V0 /= 10n; z += 1; }
      if (z < 2 || z > 4) return null;
      const R = Number((BigInt(base) ** BigInt(n) - 1n) % 100000n), m = 10 * s;
      const head = range(1, z).map((j) => (BigInt(cr(n, j)) * BigInt(m) ** BigInt(j)).toString()).join(' + ');
      const Sv = range(1, z).reduce((acc, j) => acc + BigInt(cr(n, j)) * BigInt(m) ** BigInt(j), 0n).toString();
      return N(`「${pw(base, n)} ${MINUS} 1은 ${ms('10^n')}의 배수이다.」가 참이 되도록 하는 자연수 ${N_}의 최댓값은?`, z, {
        explain: `${pw(base, n)} ${MINUS} 1 = ${nC(n, 1)} × ${m} + ${nC(n, 2)} × ${pw(m, 2)} + ⋯ + ${nC(n, n)} × ${pw(m, n)}에서 ${pw(m, z + 1)}이 곱해진 항부터는 ${pw(10, z + 1)}의 배수이다. 앞의 ${z}개 항의 합은 ${head} = ${Sv}${tail(Number(Sv.slice(-6)), '으로/로')} ${pw(10, z)}의 배수이지만 ${pw(10, z + 1)}의 배수가 아니므로 최댓값은 ${z}이다.`,
        facts: { digit: { template: `-1<${R}%10**□<1<${R}%10**(□+1)+1`, lo: 1, hi: 4, ask: 'only' } }
      });
    }),
    H('hard-two-strips', '파스칼의 삼각형에서 색칠한 두 대각선의 합', '①39', (d) => {
      const c = d.int(1, 2), right = d.bool(), s = d.int(c + 1, c + 2), e = d.int(s + 3, 8), rows = 9;
      const col = (i, j) => i >= s && i <= e && (right ? i - j === c || i - j === c + 1 : j === c || j === c + 1);
      const cells = [];
      for (let i = s; i <= e; i += 1) for (const t of [c, c + 1]) cells.push([i, right ? i - t : t]);
      const v = cells.reduce((acc, [i, j]) => acc + cr(i, j), 0);
      const said = `파스칼의 삼각형: 칸마다 이항계수를 적었다. 맨 위 0C0부터 8C0, 8C1, ⋯, 8C8까지 9줄. 색칠한 칸: ${cells.map(([i, j]) => `${i}C${j}`).join(', ')}.`;
      const fig = pascalFig(rows, (i, j) => ({ lab: [i, j], fill: col(i, j) ? '#fde68a' : null }), said);
      const sumOne = (t) => range(s, e).reduce((acc, i) => acc + cr(i, t), 0);
      const strip = (t) => `${nC(s, right ? s - t : t)} + ⋯ + ${nC(e, right ? e - t : t)} = ${nC(e + 1, t + 1)} ${MINUS} ${nC(s, t + 1)} = ${sumOne(t)}`;
      return N(`다음은 파스칼의 삼각형의 각 칸에 이항계수를 적은 것이다. 색칠한 칸에 적힌 이항계수의 값을 모두 더한 것은?`, v, {
        figure: fig,
        explain: `${right ? `${nC('n', 'n-k')} = ${nC('n', 'k')}이므로 ` : ''}두 줄을 따로 모은다. 첫 칸 앞에 모자란 칸을 보충해 이웃한 두 수를 차례로 합치면 ${strip(c)}, ${strip(c + 1)}이므로 모두 ${v}이다.`,
        facts: { calc: [[cells.map(([i, j]) => combS(i, j)).join('+'), 0]] }
      });
    }),
    H('hard-max-coef', '계수가 가장 큰 항 — 이웃 계수의 비', '①41', (d, kk) => {
      const p = d.pick([2, 3, 4, 5]), q = d.pick([2, 3, 4, 5]), n = d.int(8, 14);
      if (p === q || gcd(p, q) !== 1) return null;
      const a = (r) => cr(n, r) * p ** r * q ** (n - r);
      if (range(0, n - 1).some((r) => p * (n - r) === q * (r + 1))) return null;
      const best = range(0, n).reduce((b, r) => (a(r) > a(b) ? r : b), 0);
      if (best === 0 || best === n) return null;
      const fig = lines([
        `${mn(`(${p}x + ${q})^{${n}}`)}의 전개식에서 ${ms('x^r')}의 계수를 ${jh(ms('a_r'), '이라/라')} 하면`,
        `${ms('a_r')} = ${box('㈎')}`,
        `${frac(ms('a_{r+1}'), ms('a_r'))} = ${box('㈏')}`,
        `${box('㈏')} &gt; 1, ${box('㈏')} &lt; 1을 풀면 ${jh(ms('a_r'), '이/가')} 가장 큰 ${R_}의 값은 ${box('㈐')}이다.`
      ]);
      const lead = `다음은 다항식 ${mn(`(${p}x + ${q})^{${n}}`)}의 전개식에서 계수가 가장 큰 항을 구하는 과정이다.`;
      if (kk === 0) {
        const F = [{ h: `${nC(n, 'r')} × ${pw(p, 'r')} × ${pw(q, `${n}-r`)}`, f: (r) => cr(n, r) * p ** r * q ** (n - r) }, { h: `${nC(n, 'r')} × ${pw(p, `${n}-r`)} × ${pw(q, 'r')}`, f: (r) => cr(n, r) * p ** (n - r) * q ** r }];
        const G = [{ h: frac(ms(`${p}(${n} - r)`), ms(`${q}(r + 1)`)), f: (r) => p * (n - r) / (q * (r + 1)) }, { h: frac(ms(`${q}(${n} - r)`), ms(`${p}(r + 1)`)), f: (r) => q * (n - r) / (p * (r + 1)) }, { h: frac(ms(`${p}(${n} - r)`), ms(`${q}r`)), f: (r) => (r === 0 ? Infinity : p * (n - r) / (q * r)) }];
        const okF = (x) => range(0, n).every((r) => x.f(r) === a(r)), okG = (y) => range(0, n - 1).every((r) => Math.abs(y.f(r) - a(r + 1) / a(r)) < 1e-12);
        const pairs = [[0, 0], [0, 1], [1, 0], [1, 1], [0, 2]].map(([i, j]) => ({ h: `㈎ ${F[i].h}, ㈏ ${G[j].h}`, ok: okF(F[i]) && okG(G[j]) }));
        return choose(d, `${lead} ㈎, ㈏에 알맞은 식을 차례로 나열한 것은?`, pairs, {
          figure: fig,
          explain: `${ms('x^r')}의 항은 ${mn(`(${p}x)^r`)}과 ${pw(q, `${n}-r`)}을 곱한 것이므로 ㈎는 ${F[0].h}이다. 이웃한 두 계수를 나누면 ${frac(nC(n, 'r+1'), nC(n, 'r'))} = ${frac(ms(`${n} - r`), ms('r + 1'))}이므로 ㈏는 ${G[0].h}이다.`
        });
      }
      return N(`${lead} ㈐에 알맞은 수는?`, best, {
        figure: fig,
        explain: `${frac(ms(`${p}(${n} - r)`), ms(`${q}(r + 1)`))} &gt; 1을 풀면 ${R_} &lt; ${frac(Q(p * n - q, p + q).p, Q(p * n - q, p + q).q)}이므로 ${jh(ms('a_r'), '은/는')} ${R_} = ${best}까지 커지고 그 뒤로 작아진다. 따라서 ㈐는 ${best}이다.`,
        facts: { digit: { template: `${p}*(${n}-□)<${q}*(□+1)`, lo: 0, hi: n - 1, ask: 'min' } }
      });
    }, { count: 2 }),
    H('hard-coef-compare', 'xᵏ의 계수가 xᵏ⁺¹의 계수보다 커지는 가장 작은 k', '심3', (d) => {
      const p = d.pick([2, 3, 4]), n = d.int(12, 24);
      const c = (k) => cr(n, k) * p ** (n - k);
      const ks = range(1, n - 1).filter((k) => c(k) > c(k + 1));
      if (!ks.length || ks[0] < 2 || ks[0] > n - 2 || range(1, n - 1).some((k) => c(k) === c(k + 1))) return null;
      const k0 = ks[0];
      return N(`다항식 ${mn(`(x + ${p})^{${n}}`)}의 전개식에서 ${ms('x^k')}의 계수가 ${ms('x^{k+1}')}의 계수보다 크게 되는 자연수 ${V('k')}의 최솟값은?`, k0, {
        explain: `${ms('x^k')}의 계수는 ${nC(n, `${n}-k`)} × ${pw(p, `${n}-k`)} = ${nC(n, 'k')} × ${pw(p, `${n}-k`)}이다(${p}의 지수는 ${V('k')}가 아니라 ${ms(`${n} - k`)}). ${nC(n, 'k')} × ${pw(p, `${n}-k`)} &gt; ${nC(n, 'k+1')} × ${pw(p, `${n - 1}-k`)}에서 ${p} &gt; ${frac(ms(`${n} - k`), ms('k + 1'))}, ${V('k')} &gt; ${frac(n - p, p + 1)}이므로 최솟값은 ${k0}이다.`,
        facts: { digit: { template: `${n}-□<${p}*(□+1)`, lo: 1, hi: n - 1, ask: 'min' } }
      });
    })
  ];

  B.addGroup('11-3-2', { id: 'hard', title: '실력 문제', standard: '12확통01-03', types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
