// 고등학교 대수 Ⅲ-3 「수학적 귀납법」 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 11-1-7a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - (aₙ₊₁ − aₙ)² = 16 에서 aₙ₊₁ − aₙ = 4 만 보고, 수열이 줄어든다는 조건으로 −4 를 골라야 한다는 것을 놓친다.
//  - |aₙ₊₁| = 2|aₙ| 에서 항의 부호를 앞에서부터 짐작으로 정한다(앞 항들의 합이 다음 항의 절댓값보다 작다는 것으로 뒤에서부터 정해야 한다).
//  - a₂ₙ = a₂ × aₙ + 1 처럼 관계식 안에 든 항(a₂)을 n = 1 을 넣어 먼저 정해야 한다는 것을 놓친다.
//  - 「n이 홀수인 경우 aₙ₊₁ = 1/aₙ」의 n 을 aₙ₊₁ 의 번호로 여긴다(앞 항 aₙ 의 번호다).
//  - 수학적 귀납법의 빈칸에서 n = m + 1 일 때의 식을 n = m 일 때의 식과 섞는다.
//
// 실력에는 ① 문제의 식·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 몇 항을 나열하거나 되풀이로 풀리는 꼴은 기본에 두었고, 합(Σ)을 거쳐야 먼 항이 나오는 꼴(①7의 5ⁿaₙ)은 실력에 두었다.
// 대단원 기출 모의고사(수능·모의평가·학력평가)의 세 꼴(심1~3)은 모두 실력이다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines } = B.kit;
  const { MINUS, Q, qadd, qsub, qdiv, tx, tj, nb, V, sup, sys } = B.kit.mid;
  const { ms, sum, pw, jh, hx } = B.kit.hs;
  const K = B.kit.u1117;
  const { UNIT, STD6, STD7, num, par, jn, jq, plusC, A, Nv, Kv, Mv, SEQ, NN, ALL, defFig, listA, uptoJ, big, H, numQ, ratQ, slots, proofBox, BX } = K;

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD6,
    types: [
      // ── ① 식·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-sqdiff', '제곱 꼴 관계식과 크기 조건으로 공차 정하기', '①16', (d) => {
        // 함정: (aₙ₊₁ − aₙ)² = c² 에서 +c 만 보는 아이(크기 조건이 부호를 정한다).
        const a1 = d.int(40, 150), c = d.int(2, 6), dec = d.bool(), N0 = d.int(20, 40), step = dec ? -c : c, v = a1 + (N0 - 1) * step;
        if (big(v)) return null;
        const order = dec ? `${A(1)} &gt; ${A(2)} &gt; ${A(3)} &gt; ⋯` : `${A(1)} &lt; ${A(2)} &lt; ${A(3)} &lt; ⋯`;
        return numQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${a1}이고 ${ALL} ${jh(nb('(' + A('n+1') + ' + ' + A('n') + ')' + sup(2) + ' = 4' + A('n') + A('n+1') + ' + ' + c * c), '을/를')} 만족시킨다. ${nb(order)}일 때, ${A(N0)}의 값은?`, v, {
          explain: `${nb('(' + A('n+1') + ' + ' + A('n') + ')' + sup(2) + ' ' + MINUS + ' 4' + A('n') + A('n+1') + ' = (' + A('n+1') + ' ' + MINUS + ' ' + A('n') + ')' + sup(2))}이므로 ${nb('(' + A('n+1') + ' ' + MINUS + ' ' + A('n') + ')' + sup(2) + ' = ' + c * c)}, 곧 ${nb(A('n+1') + ' ' + MINUS + ' ' + A('n') + ' = ' + c)} 또는 ${nb(A('n+1') + ' ' + MINUS + ' ' + A('n') + ' = ' + MINUS + c)}이다. 수열이 ${dec ? '줄어들므로' : '늘어나므로'} ${nb(A('n+1') + ' ' + MINUS + ' ' + A('n') + ' = ' + num(step))}이고, 수열 ${jh(SEQ, '은/는')} 첫째항이 ${a1}, 공차가 ${num(step)}인 등차수열이다. 따라서 ${A(N0)} = ${a1} + ${N0 - 1} × ${par(step)} = ${num(v)}이다.`,
          value: `${a1}+(${N0}-1)*${jn(step)}`, derived: [c]
        });
      }),

      H('hard-sign', '절댓값 관계식과 합 조건으로 항의 부호 정하기', '①18', (d) => {
        // 함정: 부호를 앞에서부터 짐작하는 아이. 앞 항들의 합의 절댓값이 다음 항의 절댓값보다 작으므로 합의 부호가 마지막 항의 부호를 정한다.
        const c = d.int(1, 3), r = d.pick([2, 3]), signs = Array.from({ length: 5 }, () => d.pick([1, -1]));
        if (signs.every((s) => s === signs[0])) return null;
        const mags = Array.from({ length: 5 }, (_, i) => c * r ** i), vals = mags.map((m, i) => m * signs[i]), S = vals.reduce((s, v) => s + v, 0);
        let hits = 0;
        for (let code = 0; code < 32; code += 1) { const t = mags.reduce((s, m, i) => s + ((code >> i) & 1 ? m : -m), 0); if (t === S) hits += 1; }
        if (hits !== 1 || S === 0) return null;
        // 풀이: 뒤에서부터 부호를 정한다.
        const told = [];
        let rest = S;
        for (let i = 4; i >= 1; i -= 1) {
          const lim = mags.slice(0, i).reduce((s, m) => s + m, 0);
          told.push(`${i === 1 ? nb('|' + A(1) + '| = ' + lim) + '이고' : A(1) + '부터 ' + A(i) + '까지의 합의 절댓값은 ' + lim + ' 이하이고'} ${nb('|' + A(i + 1) + '| = ' + mags[i])}이므로 ${A(i + 1)}의 부호는 ${num(rest)}의 부호와 같아 ${nb(A(i + 1) + ' = ' + num(vals[i]))}이다`);
          rest -= vals[i];
        }
        return slots(`수열 ${jh(SEQ, '이/가')} 다음 조건을 모두 만족시킬 때, ${jh(A(2), '과/와')} ${A(4)}의 값은?`, [[A(2), vals[1], `${jn(signs[1])}*${c}*${r}`], [A(4), vals[3], `${jn(signs[3])}*${c}*${r}**3`]], {
          figure: lines([`(가) ${nb('|' + A(1) + '| = ' + c)}`, `(나) ${ALL} ${nb('|' + A('n+1') + '| = ' + r + '|' + A('n') + '|')}이다.`, `(다) ${nb(sum('k=1', 5, 'a_k') + ' = ' + num(S))}`]),
          explain: `(가), (나)에서 ${mags.map((m, i) => nb('|' + A(i + 1) + '| = ' + m)).join(', ')}이다. ${told.join('. ')}. 따라서 ${A(2)} = ${num(vals[1])}, ${A(4)} = ${num(vals[3])}이다.`,
          derived: [3]
        });
      }),

      H('hard-parity', '짝수·홀수 번째를 따로 정한 관계식에서 먼 항', '①19', (d) => {
        // 함정: 관계식 안의 a₂ 를 모르는 채로 a₁ 부터 구하려는 아이(n = 1 을 넣은 a₃ = a₂ − q 로 a₂ 를 먼저 정한다).
        const c = d.pick([1, 2, 3, -1, -2]), p = d.pick([1, -1, 2, -2]), q = d.int(1, 3), a2 = c + q, N0 = d.pick([10, 11, 12, 13, 14, 15]);
        if (a2 === 0 || a2 === 1) return null;
        const memo = { 2: a2, 3: c }, ex = { 2: `(${jn(c)}+${q})`, 3: jn(c) };
        const get = (k) => { if (memo[k] !== undefined) return memo[k]; const v = k % 2 === 0 ? a2 * get(k / 2) + p : get(k - 1) - q; ex[k] = k % 2 === 0 ? `${ex[2]}*(${ex[k / 2]})+${jn(p)}` : `(${ex[k - 1]})-${q}`; memo[k] = v; return v; };
        const v = get(N0);
        if (big(v) || v === 0) return null;
        const path = []; for (let k = N0; k > 3; k = k % 2 === 0 ? k / 2 : k - 1) path.push(k);
        const order = path.slice().reverse();
        return numQ(`수열 ${SEQ}의 제3항이 ${num(c)}이고 ${ALL} ${nb(A('2n') + ' = ' + A(2) + ' × ' + A('n') + plusC(p))}, ${nb(A('2n+1') + ' = ' + A('2n') + ' ' + MINUS + ' ' + tj(Q(q), '이/가'))} 성립할 때, ${A(N0)}의 값은?`, v, {
          explain: `${nb(A('2n+1') + ' = ' + A('2n') + ' ' + MINUS + ' ' + q)}에 ${Nv} = 1을 넣으면 ${nb(A(3) + ' = ' + A(2) + ' ' + MINUS + ' ' + q)}이므로 ${A(2)} = ${num(c)} + ${q} = ${num(a2)}이고 ${nb(A('2n') + ' = ' + a2 + A('n') + plusC(p))}이다. ${order.map((k) => nb(`${A(k)} = ${k % 2 === 0 ? `${par(a2)} × ${par(memo[k / 2])}${plusC(p)}` : `${num(memo[k - 1])} ${MINUS} ${q}`} = ${num(memo[k])}`)).join(', ')}이다.`,
          value: ex[N0]
        });
      }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-powsum', '곱하는 수가 거듭제곱인 관계식에서 먼 항의 지수', '①7', (d) => {
        const b = d.pick([2, 3, 5]), c = d.pick([1, 2, 3, 7].filter((x) => x % b !== 0)), form = d.int(0, 2), k = d.int(10, 20);
        const eH = form === 0 ? Nv : form === 1 ? '2' + Nv : ms('n + 1'), e = (i) => (form === 0 ? i : form === 1 ? 2 * i : i + 1);
        const m = Array.from({ length: k - 1 }, (_, i) => e(i + 1)).reduce((s, x) => s + x, 0);
        const target = c === 1 ? pw(b, Mv) : c + ' × ' + pw(b, Mv);
        return numQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${c}이고 ${ALL} ${jh(nb(A('n+1') + ' = ' + pw(b, eH) + A('n')), '을/를')} 만족시킨다. ${nb(A(k) + ' = ' + target)}일 때, 자연수 ${Mv}의 값은?`, m, {
          signed: false,
          explain: `${Nv}에 1, 2, …, ${tj(Q(k - 1), '을/를')} 차례로 대입하여 변끼리 곱하면 ${A(k)} = ${c} × ${pw(b, e(1))} × ${pw(b, e(2))} × ⋯ × ${pw(b, e(k - 1))}이다. 지수의 합은 ${sum('i=1', k - 1, form === 0 ? 'i' : form === 1 ? '2i' : '(i + 1)')} = ${m}이므로 ${Mv} = ${m}이다.`,
          value: form === 0 ? `${k}*(${k}-1)/2` : form === 1 ? `${k}*(${k}-1)` : `${k}*(${k}-1)/2+${k}-1`, derived: [2]
        });
      }),

      H('hard-cycle-m', '분수식 관계식의 되풀이에서 합이 주어진 값이 되는 항의 번호', '심1', (d) => {
        const b1 = d.pick([Q(1, 2), Q(2), Q(3), Q(-1), Q(1, 3), Q(-1, 2), Q(3, 2), Q(2, 3), Q(-2), Q(4)]);
        const cyc = [b1, qdiv(Q(1), qsub(Q(1), b1))]; cyc.push(qdiv(Q(1), qsub(Q(1), cyc[1])));
        const s = cyc.reduce((t, x) => qadd(t, x), Q(0));
        if (s.p <= 0) return null;
        const m = d.int(10, 40), part = (j) => { let t = Q(0); for (let i = 0; i < j; i += 1) t = qadd(t, cyc[i % 3]); return t; }, S = part(m);
        for (let j = 1; j <= 200; j += 1) if (j !== m) { const t = part(j); if (t.p === S.p && t.q === S.q) return null; }
        if (S.q > 12) return null;
        const q = Math.floor(m / 3), r = m % 3;
        return numQ(`첫째항이 ${tx(b1)}인 수열 ${jh(SEQ, '이/가')} ${ALL} ${jh(nb(A('n+1') + ' = ' + MINUS + frac(1, A('n') + ' ' + MINUS + ' 1')), '을/를')} 만족시킨다. 수열 ${SEQ}의 첫째항부터 제${Nv}항까지의 합을 ${ms('S_n', 'S')}이라 할 때, ${jh(nb(ms('S_m', 'S') + ' = ' + tx(S)), '을/를')} 만족시키는 자연수 ${Mv}의 값은?`, m, {
          signed: false,
          explain: `${listA(cyc.concat([b1]), 1)}이므로 ${cyc.slice(0, 2).map((x) => tx(x) + ', ').join('')}${jh(tx(cyc[2]), '이/가')} 이 차례로 되풀이되고, 세 항의 합은 ${tx(s)}이다. ${tx(S)} = ${tx(s)} × ${q}${r ? ' + ' + cyc.slice(0, r).map((x) => (x.p < 0 ? '(' + tx(x) + ')' : tx(x))).join(' + ') : ''}이므로 ${Mv} = 3 × ${q}${r ? ' + ' + r : ''} = ${m}이다. (합은 세 항마다 ${tx(s)}씩 커지고, 다른 번호에서는 이 값이 나오지 않는다.)`,
          value: `3*${q}+${r}`, derived: [3, q, r]
        });
      }),

      H('hard-backparity', '번호의 홀짝으로 바뀌는 관계식을 뒤에서 거꾸로 풀기', '심2', (d) => {
        // 함정: 「n이 홀수인 경우」의 n 을 구하는 항 aₙ₊₁ 의 번호로 여기는 아이.
        const r = d.pick([2, 3, 4, 8]), w = d.pick([1, 2, 3, -1, -2, -3]), t = r * w, N0 = d.pick([10, 11, 14, 15]);
        const cycle = [Q(t), Q(1, t), Q(r, t), Q(w)], given = cycle[(N0 - 1) % 4];
        if (given.q === 1) return null;
        const viaT = (N0 - 1) % 4 === 1;   // aₙ = 1/t 이 주어지면 t 가 보이고, r/t = 1/w 가 주어지면 w 가 보인다
        return slots(`수열 ${jh(SEQ, '이/가')} ${ALL} 다음을 만족시키고 ${A(N0)} = ${tx(given)}일 때, ${jh(A(1), '과/와')} ${A(4)}의 값은?`, [[A(1), t, viaT ? jn(t) : `${r}*${jn(w)}`], [A(4), w, viaT ? `${jn(t)}/${r}` : jn(w)]], {
          figure: hx(`${A('n+1')} = ` + sys([`${frac(1, A('n'))} (${jh(Nv, '이/가')} 홀수인 경우)`, `${r}${A('n')} (${jh(Nv, '이/가')} 짝수인 경우)`])),
          explain: `「${jh(Nv, '이/가')} 홀수」의 ${jh(Nv, '은/는')} 앞 항 ${A('n')}의 번호이다. ${A(1)} = ${V('t')}라 하면 ${A(2)} = ${frac(1, V('t'))}, ${A(3)} = ${r} × ${frac(1, V('t'))} = ${frac(r, V('t'))}, ${A(4)} = ${frac(V('t'), r)}, ${A(5)} = ${V('t')}이므로 네 항마다 되풀이된다. ${josa(N0, '을/를')} 4로 나눈 나머지가 ${N0 % 4}이므로 ${A(N0)} = ${A((N0 - 1) % 4 + 1)} = ${tx(given)}에서 ${V('t')} = ${num(t)}이다. 따라서 ${A(1)} = ${num(t)}, ${A(4)} = ${frac(num(t), r)} = ${num(w)}이다.`
        });
      }),

      H('hard-indfill', '지수가 큰 합 공식을 증명한 글의 빈칸', '심3', (d) => {
        const cands = [];
        for (let p = 3; p <= 9; p += 1) for (let q = 2; q <= 4; q += 1) { const e = 2 * p + 2 - q * (q + 1); if (e >= 1 && e <= 13) cands.push([p, q, e]); }
        const [p, q, e] = d.pick(cands);
        const an = `${A('n')} = (${pw(2, ms('2n'))} ${MINUS} 1) × ${pw(2, ms('n(n - 1)'))} + (${Nv} ${MINUS} 1) × ${pw(2, ms('-n'))}`;
        const sn = (v, one) => `${pw(2, ms(`${v}(${v} + 1)`))} ${MINUS} (${ms(v + ' + 1')}) × ${pw(2, ms('-' + v))}`;
        return numQ(`수열 ${SEQ}의 일반항이 다음과 같다. 다음은 ${ALL} 등식 (*)이 성립함을 수학적 귀납법으로 증명한 것이다. ㈎, ㈏에 알맞은 식을 각각 ${V('f')}(${Mv}), ${V('g')}(${Mv})이라 할 때, ${frac(V('g') + '(' + p + ')', V('f') + '(' + q + ')')}의 값은?`, 2 ** e, {
          figure: lines([an, `${sum('k=1', 'n', 'a_k')} = ${sn('n')} ······(*)`]) + proofBox([
            `(i) ${Nv} = 1일 때 (좌변) = 3, (우변) = 3이므로 (*)이 성립한다.`,
            `(ii) ${Nv} = ${Mv}일 때 (*)이 성립한다고 가정하면 ${nb(sum('k=1', 'm', 'a_k') + ' =')} ${nb(sn('m'))}이다. ${nb(Nv + ' = ' + Mv + ' + 1')}일 때`,
            `${nb(sum('k=1', 'm+1', 'a_k'))} = ${nb(sn('m'))} + ${nb('(' + pw(2, ms('2m + 2')) + ' ' + MINUS + ' 1) × ' + BX('㈎'))} + ${nb(Mv + ' × ' + pw(2, ms('-m - 1')))}`,
            `= ${nb(BX('㈎') + ' × ' + BX('㈏'))} ${MINUS} ${nb(frac(ms('m + 2'), 2) + ' × ' + pw(2, ms('-m')))}`,
            `= ${nb(pw(2, ms('(m + 1)(m + 2)')))} ${MINUS} ${nb(ms('(m + 2)') + ' × ' + pw(2, ms('-(m + 1)')))}`,
            `이다. 따라서 ${nb(Nv + ' = ' + Mv + ' + 1')}일 때도 (*)이 성립한다.`,
            `(i), (ii)에 의하여 ${ALL} (*)이 성립한다.`
          ]),
          explain: `${A('m+1')} = ${nb('(' + pw(2, ms('2m + 2')) + ' ' + MINUS + ' 1) × ' + pw(2, ms('(m + 1)m')) + ' + ' + Mv + ' × ' + pw(2, ms('-m - 1')))}이므로 ㈎는 ${pw(2, ms('m(m + 1)'))}이다. ${nb(pw(2, ms('m(m + 1)')) + ' + (' + pw(2, ms('2m + 2')) + ' ' + MINUS + ' 1) × ' + pw(2, ms('m(m + 1)')) + ' = ' + pw(2, ms('m(m + 1)')) + ' × ' + pw(2, ms('2m + 2')))}이므로 ㈏는 ${pw(2, ms('2m + 2'))}이다. 따라서 ${frac(V('g') + '(' + p + ')', V('f') + '(' + q + ')')} = ${frac(pw(2, 2 * p + 2), pw(2, q * (q + 1)))} = ${pw(2, e)} = ${2 ** e}이다.`,
          value: `2**(2*${p}+2)/2**(${q}*(${q}+1))`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
