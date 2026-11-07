// 고등학교 대수 Ⅰ-1 지수와 로그(11-1-1) — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「a의 n제곱근」과 「a의 n제곱근 가운데 실수인 것」을 가리지 않는다. 5의 세제곱근은 복소수의 범위에서 3개이므로 ∛5뿐이 아니고,
//    음수의 네제곱근은 실수인 것이 없을 뿐 네제곱근이 없는 것이 아니다.
//  - 지수가 유리수일 때의 지수법칙 (aʳ)ˢ = aʳˢ 을 밑이 음수일 때도 쓴다({(−5)⁶}^(1/2) = (−5)³).
//  - a^(1/2) + a^(−1/2) 에서 a − a⁻¹ 의 부호를 a > 1 로 정하지 않는다. 거듭제곱이 자연수가 되는 조건에서 지수가 「0 이상인 정수」여야 함(음의 정수 n)을 놓친다.
//  - a^(log_b c) = c^(log_b a) 로 밑과 진수를 바꾸는 성질을 떠올리지 못한다. log x 의 정수 부분이 구간마다 다르다는 것을 경우로 나누지 않는다.
// 실력에 둔 잣대(과제 글·new-unit-guide-m): ① 문제의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것.
// 각 유형 머리의 주석에 ①·②를 적었다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, Q, gcd, V, sup, proc } = B.kit.mid;
  const rt0 = B.kit.mid.rt;
  const { pw, jh, qAns } = B.kit.hs;
  // 글 속의 짧은 식(a − a⁻¹, a² + a⁻²)은 줄이 식 가운데서 갈리지 않게 한 덩어리로 묶는다.
  const ms = (s, c) => (/\s/.test(String(s)) ? '<span style="white-space:nowrap">' + B.kit.hs.ms(s, c) + '</span>' : B.kit.hs.ms(s, c));
  const K = B.kit.u1111;
  const { UNIT, S1, S2, S3, S4, S5, HAN, H, num, va, vx, vy, vn, vm, eq, R, PW, L, NOTE1, ipow, nParts, iroot, rootAns, pickSets, ex1 } = K;

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: S1,
    types: [
      // ① 「n제곱근」과 「n제곱근 가운데 실수인 것」: 복소수까지 세면 n제곱근은 n개다.
      H('hard-root-claim', '거듭제곱근과 실수인 거듭제곱근을 가리기', '①4', (d) => {
        // 말: { h 글, all 복소수까지 셀 것인가, n, sign(a 의 부호), claim(말한 개수) } — 참·거짓은 개수로 셈한다.
        const a3 = d.pick([2, 3, 5, 6, 7]), a4 = d.pick([3, 5, 6, 7, 10]), c3 = d.pick([8, 27, 64]);
        const make = () => {
          const kind = d.int(0, 7);
          if (kind === 0) return { h: `${a3}의 세제곱근은 ${R(3, a3)}뿐이다.`, all: true, n: 3, s: 1, claim: 1 };
          if (kind === 1) return { h: `${a3}의 세제곱근 가운데 실수인 것은 ${R(3, a3)}뿐이다.`, all: false, n: 3, s: 1, claim: 1 };
          if (kind === 2) return { h: `${a4}의 네제곱근 가운데 실수인 것은 ${R(4, a4)}, ${MINUS}${R(4, a4)}의 2개이다.`, all: false, n: 4, s: 1, claim: 2 };
          if (kind === 3) return { h: `${a4}의 네제곱근은 ${R(4, a4)}, ${MINUS}${R(4, a4)}의 2개이다.`, all: true, n: 4, s: 1, claim: 2 };
          if (kind === 4) return { h: `${jh(vn, '이/가')} 3 이상의 홀수일 때, ${c3}의 ${vn}제곱근 가운데 실수인 것은 하나뿐이다.`, all: false, n: 3, s: 1, claim: 1 };
          if (kind === 5) return { h: `${MINUS}${c3}의 세제곱근은 ${num(-iroot(c3, 3))}뿐이다.`, all: true, n: 3, s: -1, claim: 1 };
          if (kind === 6) return { h: `${jh(vn, '이/가')} 짝수일 때, ${MINUS}${a4}의 ${vn}제곱근은 없다.`, all: true, n: 4, s: -1, claim: 0 };
          return { h: `${jh(vn, '이/가')} 짝수일 때, ${MINUS}${a4}의 ${vn}제곱근 가운데 실수인 것은 없다.`, all: false, n: 4, s: -1, claim: 0 };
        };
        const truth = (x) => (x.all ? x.n : x.n % 2 ? 1 : x.s > 0 ? 2 : 0) === x.claim;
        const rows = [make(), make(), make()];
        if (new Set(rows.map((x) => x.h)).size < 3 || !rows.some((x) => x.all)) return null;
        return pickSets(d, '다음 보기 가운데 옳은 것만을 있는 대로 고른 것은?', rows.map((x) => [x.h, truth(x)]), {
          explain: `${vn}제곱근은 복소수의 범위에서 ${vn}개이고, 그 가운데 실수인 것은 ${jh(vn, '이/가')} 홀수이면 1개, ${jh(vn, '이/가')} 짝수이면 양수에 2개, 음수에 0개이다. ` + rows.map((x, i) => `${HAN[i]}은 ${truth(x) ? '옳다' : x.all ? '복소수까지 세면 ' + x.n + '개이므로 옳지 않다' : '옳지 않다'}`).join(', ') + '.'
        });
      }),
      // ② 앞에서부터 두 항씩 통분하는 구조를 보고, 세 번 통분한 뒤 a⁸ = c 를 넣는다.
      H('hard-telescope-frac', 'a = ⁿ√c 일 때 이어지는 통분', '①13', (d) => {
        const n = d.pick([4, 8]), c = d.pick(n === 4 ? [2, 3, 5] : [2, 3, 5, 9]), v = n / (c - 1);
        const terms = [frac(1, ms('a - 1')), frac(1, ms('a + 1')), frac(2, ms('a^2 + 1'))].concat(n === 8 ? [frac(4, ms('a^4 + 1'))] : []);
        const h = terms.map((t, i) => (i === 0 ? '' : ' ' + MINUS + ' ') + t).join('');
        return qAns(`${eq(va, R(n, c))}일 때, 다음 식의 값은?`, v, {
          figure: ex1(h),
          explain: `앞의 두 항을 통분하면 ${frac(2, ms('a^2 - 1'))}, 다음 항과 통분하면 ${frac(4, ms('a^4 - 1'))}${n === 8 ? ', 다시 통분하면 ' + frac(8, ms('a^8 - 1')) : ''}이다. ${eq(PW(va, n), c)}이므로 값은 ${frac(n, c + ' ' + MINUS + ' 1')} = ${v}이다.`,
          facts: { value: `${n}/(${c}-1)`, derived: [n] }
        });
      }),
      // ① 밑이 음수일 때 유리수 지수의 지수법칙을 쓴 잘못(교육과정 해설: 지수가 유리수이면 밑이 양수여야 한다).
      H('hard-negbase', '밑이 음수일 때 잘못된 풀이 찾기', '①27', (d) => {
        const a = d.pick([2, 3, 5]), k = d.pick([3, 5]);
        if (ipow(a, k) > 300) return null;
        const base = '(' + MINUS + a + ')';
        const steps = [
          { h: R(2, PW(base, 2 * k)) },
          { h: PW('{' + PW(base, 2 * k) + '}', Q(1, 2)), mark: '㉠' },
          { h: PW(base, 2 * k + ' × ' + B.kit.hs.sfrac(1, 2)), mark: '㉡' },
          { h: PW(base, k), mark: '㉢' },
          { h: num(-ipow(a, k)), mark: '㉣' }
        ];
        const rows = [['㉠', false], ['㉡', true], ['㉢', false], ['㉣', false]];
        return C(`다음은 ${R(2, PW(base, 2 * k))}의 값을 구한 과정이다. 처음으로 잘못된 곳은?`, rows.map((r) => r[0]), 1, {
          figure: proc(steps),
          explain: `지수가 유리수일 때의 지수법칙은 밑이 양수일 때만 성립한다. ㉡에서 밑 ${base}에 ${jh(eq(PW(ms('(a^m)'), ms('n')), PW(va, ms('mn'))), '을/를')} 썼으므로 잘못되었다. 바르게 구하면 ${eq(R(2, PW(base, 2 * k)), R(2, PW(a, 2 * k)))} = ${ipow(a, k)}이다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }, { standard: S2 }),
      // ② a + a⁻¹ → (a − a⁻¹)² → a > 1 로 부호 → 분모의 유리화(네 단계).
      H('hard-half-ratio', 'a^(1/2) + a^(−1/2) 조건에서 분수식의 값', '①34', (d) => {
        const k = d.int(6, 30), s = k - 2, [u, w] = nParts(s * s - 4, 2);
        if (w === 1 || iroot(k, 2) !== null) return null;
        const g = gcd(s, u * w), P = s / g, Rr = u * w / g;
        if (Rr === 1) return null;
        const ratio = frac(ms('a + a^{-1}'), ms('a - a^{-1}'));
        return inline(`${va} &gt; 1이고 ${eq(PW(va, Q(1, 2)) + ' + ' + PW(va, Q(-1, 2)), R(2, k))}일 때, ${ratio}의 값은? (단, 분모를 유리화하고 약분하여 적되, 1도 칸에 적는다.)`, frac('{0}' + rt0('{1}'), '{2}'), [{ answer: P }, { answer: w }, { answer: Rr }], {
          shown: frac((P === 1 ? '' : P) + rt0(w), Rr),
          explain: `양변을 제곱하면 ${eq(ms('a + 2 + a^{-1}'), k)}, ${eq(ms('a + a^{-1}'), s)}이다. ${eq('(' + ms('a - a^{-1}') + ')' + sup(2), PW('(' + ms('a + a^{-1}') + ')', 2) + ' ' + MINUS + ' 4')} = ${s * s - 4}이고 ${va} &gt; 1이면 ${ms('a - a^{-1}')} &gt; 0이므로 ${eq(ms('a - a^{-1}'), R(2, s * s - 4))}${u === 1 ? '' : ' = ' + u + rt0(w)}이다. 따라서 ${eq(ratio, frac(s, (u === 1 ? '' : u) + rt0(w)))} = ${frac((P === 1 ? '' : P) + rt0(w), Rr)}이다.`,
          facts: { calc: [[`${s}/${g}`, 0], [String(w), 1], [`${u}*${w}/${g}`, 2]], derived: [s, g, w, u] }
        });
      }, { standard: S3 }),
      // ② 두 조건의 밑을 2로 맞춰 곱하고 → 1/x + 2/y 를 구하고 → z → a(네 단계).
      H('hard-same-base', '밑을 맞춘 지수 조건 셋에서 밑 구하기', '①37', (d) => {
        const [P0, Q0, e] = d.pick([[40, 5, 3], [24, 3, 3], [48, 3, 4], [20, 5, 2], [12, 3, 2], [80, 5, 4], [56, 7, 3], [28, 7, 2]]), r = d.pick([1, 2]), c = d.pick([2, 3]);
        if (e - r < 1) return null;
        const v = ipow(2, c * (e - r));
        if (v > 4096) return null;
        return qAns(`세 실수 ${vx}, ${vy}, ${jh(V('z'), '이/가')} ${eq(PW(P0, vx), 2)}, ${eq(PW('(' + frac(1, Q0) + ')', vy), 4)}, ${jh(eq(PW(va, V('z')), ipow(2, c)), '을/를')} 만족시키고 ${eq(frac(1, vx) + ' + ' + frac(2, vy) + ' ' + MINUS + ' ' + frac(1, V('z')), r)}일 때, 양수 ${va}의 값은?`, v, {
          explain: `${eq(P0, PW(2, frac(1, vx)))}, ${eq(frac(1, Q0), PW(4, frac(1, vy)))} = ${PW(2, frac(2, vy))}이므로 곱하면 ${eq(PW(2, frac(1, vx) + ' + ' + frac(2, vy)), frac(P0, Q0))} = ${PW(2, e)}, 곧 ${eq(frac(1, vx) + ' + ' + frac(2, vy), e)}이다. ${eq(frac(1, V('z')), e + ' ' + MINUS + ' ' + r)} = ${e - r}이므로 ${eq(va, PW(ipow(2, c), e - r))}${e - r === 1 ? '' : ' = ' + v}이다.`,
          facts: { value: `${ipow(2, c)}**(${e}-${r})`, derived: [e] }
        });
      }, { standard: S3 }),
      // ① 거듭제곱이 자연수가 되려면 지수가 0 이상인 정수여야 한다(대03은 n이 음수여야 한다) + 경우 세기.
      H('hard-natural-count', '거듭제곱이 자연수가 되는 정수·순서쌍의 개수', '①39', (d, n) => {
        if (n === 0) {
          const b = d.pick([2, 3, 5]), s = d.pick([2, 3]), t = d.pick([2, 3, 4]), st = s * t;
          if (ipow(b, s) > 125) return null;
          let cnt = 0; for (let x = 1; x <= st; x += 1) if (st % x === 0) cnt += 1;
          return N(`${jh(pw('(' + frac(1, ipow(b, s)) + ')', [t, 'n']), '이/가')} 자연수가 되도록 하는 정수 ${vn}의 개수는?`, cnt, {
            unit: '개', explain: `${jh(eq(pw('(' + frac(1, ipow(b, s)) + ')', [t, 'n']), pw(String(b), [MINUS + st, 'n'])), '이/가')} 자연수이려면 ${MINUS}${jh(frac(st, vn), '이/가')} 0 이상인 정수여야 한다. 0이 될 수는 없으므로 ${jh(vn, '은/는')} ${st}의 약수에 ${jh(MINUS, '을/를')} 붙인 수이고, 그 개수는 ${cnt}이다.`,
            facts: { value: String(cnt), derived: [cnt] }
          });
        }
        const p = d.pick([3, 4]), u = d.pick([1, 2]), q = d.pick([2, 3]), Lm = d.pick([12, 15, 20]);
        const cm = Math.floor((Lm - u) / p) + 1, cn = Math.floor(Lm / q), v = cm * cn;
        return N(`${Lm} 이하의 두 자연수 ${vm}, ${vn}에 대하여 ${R(p, PW(2, ms('m - ' + u)))} × ${jh(R(q, PW(3, vn)), '이/가')} 자연수가 되도록 하는 순서쌍 (${vm}, ${vn})의 개수는?`, v, {
          unit: '개', explain: `${jh(eq(R(p, PW(2, ms('m - ' + u))) + ' × ' + R(q, PW(3, vn)), PW(2, frac(ms('m - ' + u), p)) + ' × ' + PW(3, frac(vn, q))), '이/가')} 자연수이려면 두 지수가 모두 0 이상인 정수여야 한다. ${jh(vm, '은/는')} ${u}, ${u + p}, ${u + 2 * p}, …의 ${cm}개, ${jh(vn, '은/는')} ${q}의 배수 ${cn}개이므로 ${cm} × ${cn} = ${v}이다.`,
          facts: { value: `${cm}*${cn}`, derived: [cm, cn] }
        });
      }, { count: 2, standard: S3 }),
      // ② a^(log_b c) = c^(log_b a) 로 바꾸고 → 정수가 되는 조건 → 범위 안의 a 세기.
      H('hard-swap-base', 'a^(log_b c) 이 정수가 되는 자연수 a', '②14', (d) => {
        const b = d.pick([3, 5, 7]), c = d.pick([2, 3].filter((x) => x !== b)), Lm = d.pick([50, 100, 200, 500]);
        // 1부터 Lm − 1 까지 하나씩 셈해 a^(log_b c) 가 정수인 a 를 모은다.
        const ok = [];
        for (let a = 1; a < Lm; a += 1) { const v = Math.pow(a, Math.log(c) / Math.log(b)); if (Math.abs(v - Math.round(v)) < 1e-9) ok.push(a); }
        if (ok.length < 2) return null;
        return M(`${Lm}보다 작은 자연수 ${va}에 대하여 ${PW(va, L(b, c))}의 값이 정수가 되도록 하는 ${va}의 개수와 그 가운데 가장 큰 ${va}의 값을 차례로 구하시오.`, [{ answer: ok.length, label: '개수', unit: '개' }, { answer: ok[ok.length - 1], label: '가장 큰 값' }], {
          shown: `${ok.length}개, ${ok[ok.length - 1]}`,
          explain: `${eq(PW(va, L(b, c)), PW(c, L(b, va)))}이므로 ${jh(L(b, va), '이/가')} 0 이상인 정수, 곧 ${jh(va, '이/가')} ${b}의 거듭제곱이어야 한다. ${Lm}보다 작은 것은 ${ok.join(', ')}의 ${ok.length}개이다.`,
          facts: { calc: [[String(ok.length), 0], [String(ok[ok.length - 1]), 1]], derived: [ok.length, ok[ok.length - 1]] }
        });
      }, { standard: S4 }),
      // ② 로그 조건을 곱으로 → 둘째 조건을 전개해 합 → (x − y)² = (x + y)² − 4xy → 근호(네 단계).
      H('hard-log-sym', '로그 조건 두 개에서 |x − y|', '②19', (d) => {
        const s = d.int(1, 3), P0 = ipow(2, s), dd = d.pick([2, 3]), t = d.int(1, 3), k = d.int(1, 4), Dt = ipow(dd, t);
        const num0 = P0 * (Dt - 1) - k * k;
        if (num0 <= 0 || num0 % k !== 0 || Dt > 30) return null;
        const S0 = num0 / k, disc = S0 * S0 - 4 * P0;
        if (disc <= 0 || S0 > 30) return null;
        const [cc, w] = nParts(disc, 2);
        if (w === 1) return null;
        return rootAns(`두 양수 ${vx}, ${jh(vy, '이/가')} ${eq(L(2, vx) + ' + ' + L(2, vy), s)}, ${jh(eq(L(dd, '(1 + ' + frac(k, vx) + ')') + ' + ' + L(dd, '(1 + ' + frac(k, vy) + ')'), t), '을/를')} 만족시킬 때, |${vx} ${MINUS} ${vy}|의 값은?`, 2, cc, w, {
          explain: `${eq(vx + vy, P0)}이고 ${eq('(1 + ' + frac(k, vx) + ')(1 + ' + frac(k, vy) + ')', Dt)}에서 ${eq('1 + ' + frac(k + '(' + vx + ' + ' + vy + ')', vx + vy) + ' + ' + frac(k * k, vx + vy), Dt)}이므로 ${eq(vx + ' + ' + vy, S0)}이다. ${eq('(' + vx + ' ' + MINUS + ' ' + vy + ')' + sup(2), S0 + sup(2) + ' ' + MINUS + ' 4 × ' + P0)} = ${disc}이므로 ${eq('|' + vx + ' ' + MINUS + ' ' + vy + '|', R(2, disc))}${cc === 1 ? '' : ' = ' + cc + rt0(w)}이다.`,
          facts: { calc: [[String(cc), 0], [String(w), 1]], derived: [cc, w] }
        });
      }, { standard: S4 }),
      // ② log x 의 정수 부분이 구간마다 다르다: 구간을 나누어 경우마다 범위를 셈한다.
      H('hard-intpart', 'log x 의 정수 부분에 대한 조건', '②32', (d) => {
        const c = d.pick([2, 3, 4, 5]), Lp = d.pick([2, 3]), lim = ipow(10, Lp);
        let cnt = 0;
        const part = (x) => Math.floor(Math.log10(x) + 1e-12);
        for (let x = 1; x < lim; x += 1) if (part(c * x) === part(x) + 1) cnt += 1;
        return N(`양수 ${vx}에 대하여 ${L(null, vx)}의 정수 부분을 ${ms('f(x)')}라 하자. ${jh(eq(ms('f(' + c + 'x)'), ms('f(x) + 1')), '을/를')} 만족시키는 ${lim}보다 작은 자연수 ${vx}의 개수는?`, cnt, {
          unit: '개', explain: `${jh(Lp === 2 ? '1 ≤ ' + vx + ' &lt; 10, 10 ≤ ' + vx + ' &lt; 100' : '1 ≤ ' + vx + ' &lt; 10, 10 ≤ ' + vx + ' &lt; 100, 100 ≤ ' + vx + ' &lt; 1000', '으로/로')} 나누면 ${ms('f(x) = k')}인 구간에서 ${c}${jh(vx, '이/가')} 다음 구간에 들어가야 하므로 ${vx} ≥ ${frac(ms('10^{k+1}'), c)}이다. 구간마다 세면 ${Array.from({ length: Lp }, (_, j) => ipow(10, j + 1) - Math.ceil(ipow(10, j + 1) / c)).join(' + ')} = ${cnt}이다.`,
          facts: { value: Array.from({ length: Lp }, (_, j) => `${ipow(10, j + 1)}-${Math.ceil(ipow(10, j + 1) / c)}`).join('+'), derived: Array.from({ length: Lp }, (_, j) => [ipow(10, j + 1), Math.ceil(ipow(10, j + 1) / c)]).flat() }
        });
      }, { standard: S5 }),
      // ② 내분점의 좌표 식 → 로그 하나로 묶기 → 로그의 정의(세 단계, 2024 수능 9번).
      H('hard-section', '수직선 위 로그 좌표의 내분점', '심3', (d) => {
        const b = d.pick([5, 7, 10, 11, 13]), u = d.int(2, 9), w = d.int(2, 6), v = u * w;
        if (!(u < b && b < v) || b % u === 0 || v > 60) return null;
        const bH = b === 10 ? null : b;
        return qAns(`수직선 위의 두 점 P(${L(bH, u)}), Q(${L(bH, v)})에 대하여 선분 PQ를 ${vm} : (1 ${MINUS} ${vm})으로 내분하는 점의 좌표가 1일 때, ${PW(w, vm)}의 값은? (단, ${jh(vm, '은/는')} 0 &lt; ${vm} &lt; 1인 상수이다.)`, Q(b, u), {
          explain: `내분점의 좌표는 ${eq(vm + L(bH, v) + ' + (1 ' + MINUS + ' ' + vm + ')' + L(bH, u), vm + L(bH, w) + ' + ' + L(bH, u))} = ${L(bH, '(' + PW(w, vm) + ' × ' + u + ')')}이다. 이 값이 1이므로 ${eq(PW(w, vm) + ' × ' + u, b)}, ${eq(PW(w, vm), frac(b, u))}${gcd(b, u) === 1 ? '' : ' = ' + frac(b / gcd(b, u), u / gcd(b, u))}이다.`,
          facts: { value: `${b}/${u}`, derived: [10] }
        });
      }, { standard: S4 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
