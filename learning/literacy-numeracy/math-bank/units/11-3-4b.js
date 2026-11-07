// 고등학교 확률과 통계 Ⅱ-2 「조건부확률」 — 뒤쪽 묶음(사건의 독립과 종속, 독립시행의 확률).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 11-3-4a.js 에 있다. ref: ②n = 기본꼴_2의 n번.
//  - 독립·종속의 판정, 증명의 빈칸, 성질 고르기의 참·거짓은 손으로 적지 않고 코드로 셈한다(원소를 세어 본 확률, 여러 값을 넣어 본 식).
//  - 독립시행의 확률은 분모가 9999를 넘지 않게 시행 횟수와 확률을 고른다. 답이 a/6⁵ 꼴인 원문(최소 성취수준 14, 중단원 평가 11)은 그 꼴을 살려 a를 묻는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, table, NAMES, name, N } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qcmp, tx, tj, nb, V, tail } = B.kit.mid;
  const { ms, pr, nC, pw, jh } = B.kit.hs;
  const K = B.kit.u1134;
  const { UNIT, num, jq, inside, one, comp, comb, setH, eqv, PA, PB, PAB, PBgA, PAgB, TWO, PROBS, T, prQ, intQ, oneQ, setsQ, isPrime } = K;
  const IND = '서로 독립이다.', DEP = '서로 종속이다.';
  const judge = (d, text, isInd, o) => oneQ(d, text, [{ h: IND, ok: isInd }, { h: DEP, ok: !isInd }], true, Object.assign({ keep: true }, o));
  const qpow = (q, n) => Q(q.p ** n, q.q ** n);
  const bino = (n, r, p) => qmul(Q(comb(n, r)), qmul(qpow(p, r), qpow(comp(p), n - r)));
  const small = (q) => q.q <= 9999 && q.p <= 9999;
  const term = (n, r, p) => `${comb(n, r)}*${jq(p)}**${r}*(1-${jq(p)})**${n - r}`;
  const termH = (n, r, p) => `${nC(n, r)} × (${tx(p)})${r === 1 ? '' : '<sup>' + r + '</sup>'} × (${tx(comp(p))})${n - r === 1 ? '' : '<sup>' + (n - r) + '</sup>'}`.replace(/ × \([^)]*\)<sup>0<\/sup>/g, '');
  const sumQ = (list) => list.reduce((acc, q) => qadd(acc, q), Q(0));
  // 독립시행의 항에서 글에 없을 수 있는 수(조합의 수, 지수, 주사위·동전에서 정해지는 확률)
  const tdv = (n, r, p) => [comb(n, r), r, n - r, p.p, p.q];
  const cf = (c) => (c === 1 ? '' : String(c));   // 식 앞의 계수(1은 적지 않는다)

  // 한 번의 시행: 주사위·정다면체 주사위·카드
  const SPACES = [
    { top: 6, lead: '한 개의 주사위를 한 번 던질 때, 나온 눈의 수가' },
    { top: 8, lead: '각 면에 1부터 8까지의 자연수가 하나씩 적힌 정팔면체 모양의 주사위를 한 번 던질 때, 바닥에 닿은 면에 적힌 수가' },
    { top: 12, lead: '각 면에 1부터 12까지의 자연수가 하나씩 적힌 정십이면체 모양의 주사위를 한 번 던질 때, 바닥에 닿은 면에 적힌 수가' },
    { top: 10, lead: '1부터 10까지의 자연수가 하나씩 적힌 카드 10장 중에서 한 장을 뽑을 때, 카드에 적힌 수가' },
    { top: 20, lead: '각 면에 1부터 20까지의 자연수가 하나씩 적힌 정이십면체 모양의 주사위를 한 번 던질 때, 바닥에 닿은 면에 적힌 수가' }
  ];
  const conds = (top) => {
    const out = [{ h: '홀수', ok: (x) => x % 2 === 1 }, { h: '짝수', ok: (x) => x % 2 === 0 }, { h: '소수', ok: isPrime }];
    for (const k of [3, 4, 5, 6]) if (k * 2 <= top) out.push({ h: k + '의 배수', ok: (x) => x % k === 0 });
    for (const k of [6, 8, 10, 12, 18, 20]) if (k <= top + 6) out.push({ h: k + '의 약수', ok: (x) => k % x === 0 });
    for (const k of [3, 4, 5, 6, 7, 9, 11]) if (k < top - 1) out.push({ h: k + ' 이상인 수', ok: (x) => x >= k, word: true });
    return out;
  };
  const isH = (c) => (c.word ? c.h.replace(/인 수$/, '인') : c.h + '인');
  const indepOf = (all, a, b) => { const A = all.filter(a.ok), Bb = all.filter(b.ok), AB = A.filter(b.ok); return { A, Bb, AB, ind: AB.length * all.length === A.length * Bb.length }; };

  // 독립인 두 사건의 확률 값으로 성질을 시험하는 값들(성질 고르기의 참·거짓을 셈한다)
  const SAMPLES = [];
  for (const a of [0.2, 0.35, 0.5, 0.7, 0.9]) for (const b of [0.25, 0.4, 0.6, 0.8]) for (const t of [0, 0.3, 0.6, 1]) {
    const lo = Math.max(0, a + b - 1), hi = Math.min(a, b);
    SAMPLES.push({ a, b, c: lo + (hi - lo) * t });
  }
  // kind: 'any' 아무 두 사건, 'indep' 서로 독립(c = ab), 'excl' 서로 배반(c = 0). f 가 그런 모든 값에서 참이면 그 문장은 옳다.
  const holds = (kind, f) => {
    const list = kind === 'indep' ? SAMPLES.map(({ a, b }) => ({ a, b, c: a * b })) : kind === 'excl' ? SAMPLES.filter(({ a, b }) => a + b <= 1).map(({ a, b }) => ({ a, b, c: 0 })) : SAMPLES;
    return list.every(({ a, b, c }) => f(a, b, c));
  };
  const fz = (p, q, pair) => frac(p, q) + tail(p, pair);   // 줄이지 않은 분수 뒤 토씨(분자로 읽는다)

  // ════════════════════════════════════════════════════════════════
  // ── 사건의 독립과 종속 ──
  B.addTypes(UNIT, 'indep', [
    T('indep-judge', '한 번의 시행에서 두 사건이 독립인지 종속인지 판정하기', '②1', (d, n) => {
      if (n === 0) {
        const sp = d.pick(SPACES), all = Array.from({ length: sp.top }, (_, i) => i + 1), want = d.bool();
        const [a, b] = d.shuffle(conds(sp.top)).slice(0, 2), r = indepOf(all, a, b);
        if (r.ind !== want || r.A.length < 2 || r.Bb.length < 2 || r.A.length === sp.top || r.Bb.length === sp.top || r.AB.length === 0) return null;
        return judge(d, `${sp.lead} ${isH(a)} 사건을 A, ${isH(b)} 사건을 B라 하자. 두 사건 A와 B에 대한 설명으로 옳은 것은?`, r.ind, {
          explain: `A = ${setH(r.A)}, B = ${setH(r.Bb)}, A∩B = ${setH(r.AB)}이므로 ${eqv(PA, Q(r.A.length, sp.top))}, ${eqv(PB, Q(r.Bb.length, sp.top))}, ${eqv(PAB, Q(r.AB.length, sp.top))}이다. ${PA}${PB} = ${tx(Q(r.A.length * r.Bb.length, sp.top * sp.top))}이고, 이 값이 ${PAB}${r.ind ? '와 같으므로 두 사건은 서로 독립이다.' : '와 다르므로 두 사건은 서로 종속이다.'}`
        });
      }
      const sp = d.pick(SPACES.slice(0, 3)), all = Array.from({ length: sp.top }, (_, i) => i + 1), cs = d.shuffle(conds(sp.top)).slice(0, 3);
      const pairs = [[0, 1], [0, 2], [1, 2]].map(([i, j]) => indepOf(all, cs[i], cs[j]));
      if (pairs.some((p) => p.A.length < 2 || p.Bb.length < 2 || p.AB.length === 0 || p.A.length === sp.top || p.Bb.length === sp.top)) return null;
      const names = ['A와 B', 'A와 C', 'B와 C'];
      return setsQ(d, `${sp.lead} ${isH(cs[0])} 사건을 A, ${isH(cs[1])} 사건을 B, ${isH(cs[2])} 사건을 C라 하자. 다음 중 서로 독립인 두 사건만을 있는 대로 고른 것은?`,
        pairs.map((p, i) => ({ h: names[i], ok: p.ind })), {
          explain: `${cs.map((c, i) => `${'ABC'[i]} = ${setH(all.filter(c.ok))}`).join(', ')}이다. ${pairs.map((p, i) => `${names[i]}: 교집합의 원소가 ${p.AB.length}개이고 ${p.ind ? '확률의 곱과 같아 독립' : '확률의 곱과 달라 종속'}`).join(', ')}이다.`
        });
    }, { count: 2 }),

    T('indep-values', '확률 값으로 두 사건의 독립 판정하기', '②2', (d) => {
      const pA = d.pick(PROBS), pB = d.pick(PROBS), want = d.bool(), prod = qmul(pA, pB);
      const pAB = want ? prod : d.pick([qadd(prod, Q(1, 12)), qsub(prod, Q(1, 12)), qadd(prod, Q(1, 10)), qsub(prod, Q(1, 20)), qadd(prod, Q(1, 15))]);
      const pU = qsub(qadd(pA, pB), pAB);
      if (qcmp(pAB, Q(0)) <= 0 || qcmp(pAB, pA) >= 0 || qcmp(pAB, pB) >= 0 || !inside(pU) || pU.q > 60) return null;
      const ind = qcmp(pAB, prod) === 0;
      return judge(d, `${TWO} ${eqv(PA, pA)}, ${eqv(PB, pB)}, ${eqv(pr('A∪B'), pU)}일 때, 두 사건 A와 B에 대한 설명으로 옳은 것은?`, ind, {
        explain: `${PAB} = ${tx(pA)} + ${tx(pB)} ${MINUS} ${tx(pU)} = ${tx(pAB)}이고 ${PA}${PB} = ${tx(prod)}이다. 두 값이 ${ind ? '같으므로 서로 독립이다.' : '다르므로 서로 종속이다.'}`
      });
    }),

    T('indep-replace', '두 번 꺼낼 때 P(B∣A)와 P(B)를 비교해 판정하기', '②3', (d, n) => {
      if (n === 0) {
        const w = d.int(1, 4), k = d.int(2, 6), tot = w + k;
        if (w === k) return null;
        const pB = qadd(qmul(Q(w, tot), Q(w - 1, tot - 1)), qmul(Q(k, tot), Q(w, tot - 1)));
        return prQ(`주머니에 흰 공 ${w}개와 검은 공 ${k}개가 들어 있다. 이 주머니에서 공을 한 개씩 두 번 꺼낼 때, 두 번째 꺼낸 공이 흰 공일 확률은? (단, 꺼낸 공은 다시 넣지 않는다.)`, pB, {
          explain: `첫 번째 꺼낸 공이 흰 공인 사건을 A, 두 번째 꺼낸 공이 흰 공인 사건을 B라 하면 ${PB} = ${PA}${PBgA} + ${pr('A^C')}${pr('B', 'A^C')} = ${frac(w, tot)} × ${tx(Q(w - 1, tot - 1))} + ${frac(k, tot)} × ${frac(w, tot - 1)} = ${tx(pB)}이다. 다시 넣지 않아도 두 번째 꺼낸 공이 흰 공일 확률은 첫 번째와 같은 ${tx(pB)}이다(그러나 ${PBgA} = ${tj(Q(w - 1, tot - 1), '은/는')} ${PB}와 다르므로 두 사건은 종속이다).`,
          value: `${w}/(${w}+${k})*(${w}-1)/(${w}+${k}-1)+${k}/(${w}+${k})*${w}/(${w}+${k}-1)`
        });
      }
      const m = d.pick([6, 8, 9, 10, 12]), back = d.bool(), odd = Math.ceil(m / 2), even = m - odd;
      const pBA = back ? Q(odd, m) : Q(odd - 1, m - 1), pB = back ? Q(odd, m) : qadd(qmul(Q(odd, m), Q(odd - 1, m - 1)), qmul(Q(even, m), Q(odd, m - 1)));
      const ind = qcmp(pBA, pB) === 0;
      return judge(d, `1부터 ${m}까지의 자연수가 하나씩 적힌 공 ${m}개가 들어 있는 주머니에서 공을 한 개씩 두 번 꺼낸다. 첫 번째 꺼낸 공에 적힌 수가 홀수인 사건을 A, 두 번째 꺼낸 공에 적힌 수가 홀수인 사건을 B라 할 때, 두 사건 A와 B에 대한 설명으로 옳은 것은? (단, 꺼낸 공은 ${back ? '다시 넣는다' : '다시 넣지 않는다'}.)`, ind, {
        explain: back ? `꺼낸 공을 다시 넣으므로 ${PBgA} = ${tx(pBA)}이고 ${PB} = ${tx(pB)}이다. ${PBgA} = ${PB}이므로 두 사건은 서로 독립이다.`
          : `꺼낸 공을 다시 넣지 않으므로 ${PBgA} = ${frac(odd - 1, m - 1)}이다. ${PB} = ${frac(odd, m)} × ${frac(odd - 1, m - 1)} + ${frac(even, m)} × ${frac(odd, m - 1)} = ${tx(pB)}이므로 ${PBgA} ≠ ${PB}이고 두 사건은 서로 종속이다.`
      });
    }, { count: 2 }),

    T('indep-cond', '독립인 두 사건의 조건부확률과 곱', '②4', (d, n) => {
      const pA = d.pick(PROBS), pB = d.pick(PROBS);
      if (qcmp(pA, pB) === 0) return null;
      if (n === 0) {
        const ans = qmul(pA, pB);
        return prQ(`두 사건 A와 B는 서로 독립이고 ${eqv(PA, pA)}, ${eqv(PB, pB)}일 때, ${PAB}의 값은?`, ans, {
          explain: `두 사건이 서로 독립이므로 ${PAB} = ${PA}${PB} = ${tx(pA)} × ${tx(pB)} = ${tx(ans)}이다.`, value: `${jq(pA)}*${jq(pB)}`
        });
      }
      const askA = d.bool(), ans = askA ? pA : pB;
      return prQ(`두 사건 A와 B는 서로 독립이고 ${eqv(PA, pA)}, ${eqv(PB, pB)}일 때, ${askA ? PAgB : PBgA}의 값은?`, ans, {
        explain: `두 사건이 서로 독립이면 한 사건이 일어나는 것이 다른 사건의 확률에 영향을 주지 않으므로 ${askA ? PAgB + ' = ' + PA : PBgA + ' = ' + PB} = ${tx(ans)}이다.`,
        value: `${jq(pA)}*${jq(pB)}/${jq(askA ? pB : pA)}`
      });
    }, { count: 2 }),

    T('indep-comp', '독립인 두 사건의 여사건이 낀 확률', '②5', (d, n) => {
      const pA = d.pick(PROBS), pB = d.pick(PROBS), cA = comp(pA), cB = comp(pB);
      if (qcmp(pA, pB) === 0) return null;
      const head = `두 사건 A와 B는 서로 독립이고 ${eqv(PA, pA)}, ${eqv(PB, pB)}일 때,`;
      if (n === 0) {
        const kind = d.int(0, 3);
        const ask = [pr('B', 'A^C'), pr('A^C', 'B'), pr('A^C∩B'), pr('A^C∩B^C')][kind], ans = [pB, cA, qmul(cA, pB), qmul(cA, cB)][kind];
        const value = [`${jq(pB)}`, `1-${jq(pA)}`, `(1-${jq(pA)})*${jq(pB)}`, `(1-${jq(pA)})*(1-${jq(pB)})`][kind];
        const why = ['Aᶜ과 B도 서로 독립이므로 조건 Aᶜ은 B의 확률을 바꾸지 않는다', 'Aᶜ과 B도 서로 독립이므로 조건 B는 Aᶜ의 확률을 바꾸지 않는다', 'Aᶜ과 B도 서로 독립이므로 두 확률을 곱한다', 'Aᶜ과 Bᶜ도 서로 독립이므로 두 확률을 곱한다'][kind];
        return prQ(`${head} ${ask}의 값은?`, ans, { explain: `A와 B가 서로 독립이면 ${why}. 따라서 ${ask} = ${tx(ans)}이다.`, value });
      }
      const ans = qsub(one, qmul(cA, pB));
      return prQ(`${head} ${pr('A∪B^C')}의 값은?`, ans, {
        explain: `${pr('A∪B^C')}의 여사건은 ${ms('A^C∩B')}이고 Aᶜ과 B도 서로 독립이므로 ${pr('A^C∩B')} = ${tx(cA)} × ${tx(pB)} = ${tx(qmul(cA, pB))}이다. 따라서 구하는 값은 1 ${MINUS} ${tx(qmul(cA, pB))} = ${tx(ans)}이다.`,
        value: `1-(1-${jq(pA)})*${jq(pB)}`
      });
    }, { count: 2 }),

    T('indep-proof', '여사건도 독립임을 보이는 증명의 빈칸', '②6', (d, n) => {
      const box = (t) => `<span class="mb-box">${t}</span>`;
      const proof = (rows) => `<div class="mb-lines" style="padding:10px 12px;border:1.5px solid #94a3b8;border-radius:8px">${rows.map((r) => '<div>' + r + '</div>').join('')}</div>`;
      // 빈칸에 넣을 후보: [글, 값 함수(a = P(A), b = P(B))] 또는 사건(집합) — 집합은 [글, (x, y) => A·B 에 드는지에 따른 참·거짓]
      const ok3 = (fs, test) => SAMPLES.every(({ a, b }) => test(fs.map((f) => f(a, b)), a, b));
      if (n === 0) {
        const G = [[`${PA}${PB}`, (a, b) => a * b], [`${PA} + ${PB}`, (a, b) => a + b]];
        const N2 = [[`1 ${MINUS} ${PA}`, (a) => 1 - a], [`1 + ${PA}`, (a) => 1 + a], [PA, (a) => a]];
        const D3 = [[pr('A^C'), (a) => 1 - a], [pr('B^C'), (a, b) => 1 - b], [PA, (a) => a]];
        const cands = [];
        for (const g of G) for (const m of N2) for (const c of D3) cands.push([g, m, c]);
        const good = (t) => ok3(t.map((x) => x[1]), ([g, m, c], a, b) => Math.abs(g - a * b) < 1e-12 && Math.abs(b - g - m * b) < 1e-12 && Math.abs(c - m) < 1e-12 && Math.abs(c - (1 - a)) < 1e-12);
        const right = cands.filter(good);
        if (right.length !== 1) return null;
        const wrong = d.shuffle(cands.filter((t) => !good(t) && [0, 1, 2].filter((i) => t[i] !== right[0][i]).length <= 2)).slice(0, 4);
        if (wrong.length < 4) return null;
        const rows = [right[0]].concat(wrong).map((t) => ({ h: t.map((x) => x[0]).join(', '), ok: good(t) }));
        return oneQ(d, `다음은 두 사건 A와 B가 서로 독립일 때, 두 사건 ${ms('A^C')}과 B도 서로 독립임을 증명하는 과정이다. (가), (나), (다)에 알맞은 것을 차례로 나열한 것은? (단, 0 &lt; ${PA} &lt; 1, ${PB} &gt; 0)`, rows, true, {
          figure: proof([`두 사건 A와 B가 서로 독립이므로 ${PAB} = ${box('(가)')}`, `이때 ${pr('A^C∩B')} = ${PB} ${MINUS} ${PAB}`, `= ${PB} ${MINUS} ${box('(가)')}`, `= {${box('(나)')}}${PB}`, `= ${box('(다)')}${PB}`, `따라서 두 사건 ${ms('A^C')}과 B도 서로 독립이다.`]),
          explain: `독립이므로 ${PAB} = ${PA}${PB}이고, ${PB} ${MINUS} ${PA}${PB} = {1 ${MINUS} ${PA}}${PB} = ${pr('A^C')}${PB}이다.`
        });
      }
      const SETS = [[ms('(A∪B)^C'), (x, y) => !(x || y)], [ms('(A∩B)^C'), (x, y) => !(x && y)], [ms('A∪B^C'), (x, y) => x || !y]];
      const N2 = [[`${PA}${PB}`, (a, b) => a * b], [`${PA} + ${PB}`, (a, b) => a + b]];
      const D3 = [[`1 ${MINUS} ${PB}`, (a, b) => 1 - b], [`1 + ${PB}`, (a, b) => 1 + b], [`1 ${MINUS} ${PA}`, (a) => 1 - a]];
      const cands = [];
      for (const s of SETS) for (const m of N2) for (const c of D3) cands.push([s, m, c]);
      const setOk = (f) => [[0, 0], [0, 1], [1, 0], [1, 1]].every(([x, y]) => f(x, y) === (!x && !y));
      const good = (t) => setOk(t[0][1]) && SAMPLES.every(({ a, b }) => { const m = t[1][1](a, b), c = t[2][1](a, b); return Math.abs(m - a * b) < 1e-12 && Math.abs((1 - a - b + m) - (1 - a) * c) < 1e-12; });
      const right = cands.filter(good);
      if (right.length !== 1) return null;
      const wrong = d.shuffle(cands.filter((t) => !good(t) && [0, 1, 2].filter((i) => t[i] !== right[0][i]).length <= 2)).slice(0, 4);
      if (wrong.length < 4) return null;
      const rows = [right[0]].concat(wrong).map((t) => ({ h: t.map((x) => x[0]).join(', '), ok: good(t) }));
      return oneQ(d, `다음은 두 사건 A와 B가 서로 독립일 때, 두 사건 ${ms('A^C')}과 ${ms('B^C')}도 서로 독립임을 증명하는 과정이다. (가), (나), (다)에 알맞은 것을 차례로 나열한 것은? (단, 0 &lt; ${PA} &lt; 1, 0 &lt; ${PB} &lt; 1)`, rows, true, {
        figure: proof([`${pr('A^C∩B^C')} = ${pr(box('(가)'))}`, `= 1 ${MINUS} ${pr('A∪B')}`, `= 1 ${MINUS} {${PA} + ${PB} ${MINUS} ${PAB}}`, `= 1 ${MINUS} ${PA} ${MINUS} ${PB} + ${box('(나)')} (두 사건 A와 B가 서로 독립)`, `= {1 ${MINUS} ${PA}}{${box('(다)')}}`, `= ${pr('A^C')}${pr('B^C')}`, `따라서 두 사건 ${ms('A^C')}과 ${ms('B^C')}도 서로 독립이다.`]),
        explain: `${ms('A^C∩B^C')} = ${ms('(A∪B)^C')}이고, 독립이므로 ${PAB} = ${PA}${PB}이다. 1 ${MINUS} ${PA} ${MINUS} ${PB} + ${PA}${PB} = {1 ${MINUS} ${PA}}{1 ${MINUS} ${PB}}이다.`
      });
    }, { count: 2 }),

    T('indep-table', '독립이 되도록 표의 빈칸 구하기', '②7', (d) => {
      const S = d.pick([['사고 유형', '감정 유형', '심리 검사에서 판단 기능을 사고 유형과 감정 유형으로 나눈 결과', '사고 유형인 학생'], ['찬성', '반대', '급식 메뉴를 바꾸는 일에 대한 찬반 조사 결과', '찬성한 학생'], ['운동함', '운동 안 함', '아침 운동을 하는지 조사한 결과', '아침 운동을 하는 학생']]);
      const Tt = d.pick([200, 240, 300, 400, 500]), Mm = d.int(Math.ceil(Tt * 0.03), Math.floor(Tt * 0.07)) * 10, T1 = d.int(Math.ceil(Tt * 0.03), Math.floor(Tt * 0.07)) * 10, a = (Mm * T1) / Tt;
      if (!Number.isInteger(a) || a <= 0 || a >= Mm || a >= T1 || Mm === Tt - Mm || T1 === Tt - T1) return null;
      const fig = '<div style="font-size:0.95rem">(단위: 명)</div>' + table(['구분', S[0], S[1], '합계'], [['남학생', V('a'), V('b'), String(Mm)], ['여학생', V('c'), V('d'), String(Tt - Mm)], ['합계', String(T1), String(Tt - T1), String(Tt)]]);
      return intQ(`다음은 어느 학교 학생 ${Tt}명을 대상으로 한 ${S[2]}이다. 이 학생들 가운데 임의로 한 명을 뽑을 때, 남학생인 사건을 A, ${S[3]}인 사건을 B라 하자. 두 사건 A와 B가 서로 독립일 때, ${V('a')}의 값은? (단, ${V('a')}, ${V('b')}, ${V('c')}, ${V('d')}는 상수이다.)`, a, {
        figure: fig,
        explain: `${eqv(PA, Q(Mm, Tt))}이고 ${PAgB} = ${frac(V('a'), T1)}이다. 두 사건이 서로 독립이면 ${PAgB} = ${PA}이므로 ${nb(frac(V('a'), T1) + ' = ' + tx(Q(Mm, Tt)))}, 곧 ${V('a')} = ${a}이다.`,
        value: `${Mm}*${T1}/${Tt}`
      });
    }),

    T('indep-mix', '독립과 배반이 섞인 세 사건', '②8', (d, n) => {
      if (n === 0) {
        const pA = d.pick(PROBS), pB = d.pick(PROBS), pC = d.pick(PROBS), useC = d.bool();
        if (qcmp(qadd(pB, pC), one) >= 0 || qcmp(pB, pC) === 0) return null;
        const pAB = qmul(pA, pB), pU = qadd(pB, pC);
        if (pAB.q > 60) return null;
        const first = useC ? eqv(pr('A^C'), comp(pA)) : eqv(PA, pA);
        return prQ(`세 사건 A, B, C에 대하여 두 사건 A와 B는 서로 독립이고, 두 사건 B와 C는 서로 배반사건이다. ${first}, ${eqv(PAB, pAB)}, ${eqv(pr('B∪C'), pU)}일 때, ${pr('C')}의 값은?`, pC, {
          explain: `${useC ? `${PA} = 1 ${MINUS} ${tx(comp(pA))} = ${tx(pA)}이다. ` : ''}A와 B가 서로 독립이므로 ${PAB} = ${PA}${PB}에서 ${PB} = ${tx(pAB)} ÷ ${tx(pA)} = ${tx(pB)}이다. B와 C가 서로 배반이므로 ${pr('B∪C')} = ${PB} + ${pr('C')}에서 ${pr('C')} = ${tx(pU)} ${MINUS} ${tx(pB)} = ${tx(pC)}이다.`,
          value: useC ? `${jq(pU)}-${jq(pAB)}/(1-${jq(comp(pA))})` : `${jq(pU)}-${jq(pAB)}/${jq(pA)}`
        });
      }
      const pA = d.pick(PROBS), pB = d.pick(PROBS), pC = d.pick(PROBS);
      if (qcmp(qadd(pA, pB), one) >= 0 || qcmp(pA, pB) === 0) return null;
      const pAC = qmul(pA, pC), pU = qadd(pA, pB);
      if (pAC.q > 60) return null;
      return prQ(`세 사건 A, B, C에 대하여 두 사건 A와 B는 서로 배반사건이고, 두 사건 A와 C는 서로 독립이다. ${eqv(pr('A∪B'), pU)}, ${eqv(pr('A∩C'), pAC)}, ${eqv(pr('C'), pC)}일 때, ${PB}의 값은?`, pB, {
        explain: `A와 C가 서로 독립이므로 ${pr('A∩C')} = ${PA}${pr('C')}에서 ${PA} = ${tx(pAC)} ÷ ${tx(pC)} = ${tx(pA)}이다. A와 B가 서로 배반이므로 ${pr('A∪B')} = ${PA} + ${PB}에서 ${PB} = ${tx(pU)} ${MINUS} ${tx(pA)} = ${tx(pB)}이다.`,
        value: `${jq(pU)}-${jq(pAC)}/${jq(pC)}`
      });
    }, { count: 2 }),

    T('indep-quad', '독립인 두 사건의 곱사건·합사건의 확률로 P(A) 구하기', '②9', (d) => {
      const [a, b] = [d.pick(PROBS), d.pick(PROBS)].sort((x, y) => qcmp(y, x));
      if (qcmp(a, b) === 0) return null;
      const p = qmul(a, b), s = qsub(qadd(a, b), p);
      if (!inside(s) || p.q > 60 || s.q > 60) return null;
      return prQ(`두 사건 A와 B는 서로 독립이고 ${eqv(PAB, p)}, ${eqv(pr('A∪B'), s)}일 때, ${PA}의 값은? (단, ${PA} &gt; ${PB})`, a, {
        explain: `${PA} + ${PB} = ${pr('A∪B')} + ${PAB} = ${tx(s)} + ${tx(p)} = ${tx(qadd(s, p))}이고, 독립이므로 ${PA}${PB} = ${tx(p)}이다. 두 수의 합이 ${tx(qadd(s, p))}, 곱이 ${tx(p)}이므로 두 수는 ${tx(a)}, ${tx(b)}이고 ${PA} &gt; ${PB}이므로 ${PA} = ${tx(a)}이다.`,
        value: `((${jq(s)}+${jq(p)})+((${jq(s)}+${jq(p)})**2-4*${jq(p)})**0.5)/2`, derived: [2, 4, 0.5]
      });
    }),

    T('indep-claims', '조건부확률·독립의 성질 — 옳은 것 고르기', '②10', (d) => {
      const SLOTS = [
        [{ h: `${PBgA} ≥ ${PAB}`, kind: 'any', f: (a, b, c) => c / a >= c - 1e-12 }, { h: `${PBgA} ≤ ${PAB}`, kind: 'any', f: (a, b, c) => c / a <= c + 1e-12 }],
        [{ h: `두 사건 A와 B가 서로 배반이면 ${pr('A∪B')} = ${PA} + ${PB}이다.`, kind: 'excl', f: (a, b, c) => Math.abs((a + b - c) - (a + b)) < 1e-12 }, { h: `두 사건 A와 B가 서로 독립이면 ${pr('A∪B')} = ${PA} + ${PB}이다.`, kind: 'indep', f: (a, b, c) => Math.abs((a + b - c) - (a + b)) < 1e-12 }],
        [{ h: `두 사건 A와 B가 서로 독립이면 {1 ${MINUS} ${PA}}{1 ${MINUS} ${PB}} = 1 ${MINUS} ${pr('A∪B')}이다.`, kind: 'indep', f: (a, b, c) => Math.abs((1 - a) * (1 - b) - (1 - (a + b - c))) < 1e-12 }, { h: `두 사건 A와 B가 서로 독립이면 {1 ${MINUS} ${PA}}{1 ${MINUS} ${PB}} = 1 ${MINUS} ${PAB}이다.`, kind: 'indep', f: (a, b, c) => Math.abs((1 - a) * (1 - b) - (1 - c)) < 1e-12 }]
      ];
      const rows = SLOTS.map((s) => { const it = d.pick(s); return { h: it.h, ok: holds(it.kind, it.f) }; });
      return setsQ(d, `${TWO} 보기에서 옳은 것만을 있는 대로 고른 것은? (단, 0 &lt; ${PA} &lt; 1, 0 &lt; ${PB} &lt; 1)`, rows, {
        explain: `${PBgA} = ${PAB} ÷ ${PA}이고 ${PA} ≤ 1이므로 ${PBgA} ≥ ${PAB}이다. ${pr('A∪B')} = ${PA} + ${PB} ${MINUS} ${PAB}에서 배반이면 ${PAB} = 0이지만 독립이면 ${PAB} = ${PA}${PB} &gt; 0이다. 독립이면 {1 ${MINUS} ${PA}}{1 ${MINUS} ${PB}} = 1 ${MINUS} ${PA} ${MINUS} ${PB} + ${PAB} = 1 ${MINUS} ${pr('A∪B')}이다.`
      });
    }),

    T('indep-two', '독립인 두 사람 — 한 사람만, 아무도', '②11', (d, n) => {
      const [p1, p2] = d.shuffle(NAMES.slice()).slice(0, 2), a = d.pick(PROBS), b = d.pick(PROBS);
      if (qcmp(a, b) === 0) return null;
      const what = d.pick([['과녁의 10점 영역을 맞힐', '맞힐', '맞히지 못할'], ['자유투를 성공할', '성공할', '성공하지 못할'], ['퀴즈의 정답을 맞힐', '맞힐', '맞히지 못할']]);
      const head = `${name(p1, '과/와')} ${name(p2, '이/가')} ${what[0]} 확률은 각각 ${tx(a)}, ${tx(b)}이다. 두 사람이 한 번씩 할 때,`;
      if (n === 0) {
        const ans = qadd(qmul(a, comp(b)), qmul(comp(a), b));
        return prQ(`${head} 두 사람 가운데 한 사람만 ${what[1]} 확률은?`, ans, {
          explain: `두 사람의 결과는 서로 독립이다. ${p1}만 ${what[1]} 확률 ${tx(a)} × ${tj(comp(b), '과/와')} ${p2}만 ${what[1]} 확률 ${tx(comp(a))} × ${tj(b, '을/를')} 더하면 ${tx(ans)}이다.`,
          value: `${jq(a)}*(1-${jq(b)})+(1-${jq(a)})*${jq(b)}`
        });
      }
      const ans = qmul(comp(a), comp(b));
      return prQ(`${head} 두 사람 모두 ${what[2]} 확률은?`, ans, {
        explain: `두 사람의 결과는 서로 독립이므로 구하는 확률은 (1 ${MINUS} ${tx(a)}) × (1 ${MINUS} ${tx(b)}) = ${tx(ans)}이다.`,
        value: `(1-${jq(a)})*(1-${jq(b)})`
      });
    }, { count: 2 }),

    T('indep-same', '다시 넣으며 두 번 뽑아 같은 수가 나올 확률', '②12', (d) => {
      const m = d.int(3, 9), [p1, p2] = d.shuffle(NAMES.slice()).slice(0, 2), ans = Q(1, m);
      return prQ(`상자에 1부터 ${m}까지의 자연수가 하나씩 적힌 카드 ${m}장이 들어 있다. ${name(p1, '과/와')} ${name(p2, '이/가')} 차례로 이 상자에서 카드를 한 장씩 꺼낼 때, 두 사람이 같은 수가 적힌 카드를 꺼낼 확률은? (단, 꺼낸 카드는 다시 넣는다.)`, ans, {
        explain: `카드를 다시 넣으므로 두 사람의 결과는 서로 독립이다. ${name(p1, '이/가')} 어떤 수를 꺼내든 ${name(p2, '은/는')} 그 수 하나를 꺼내면 되므로 구하는 확률은 ${m} × ${frac(1, m)} × ${frac(1, m)} = ${frac(1, m)}이다.`,
        value: `${m}*(1/${m})*(1/${m})`
      });
    }),

    T('indep-three1', '독립인 세 사람 — 적어도 한 명', '②13', (d) => {
      const what = d.pick([['자유투 성공률이', '성공할', '성공하지 못할'], ['과녁에 명중시킬 확률이', '명중시킬', '명중시키지 못할'], ['문제를 맞힐 확률이', '맞힐', '맞히지 못할']]);
      const ps = [d.pick(PROBS), d.pick(PROBS), d.pick(PROBS)], none = ps.reduce((acc, p) => qmul(acc, comp(p)), one), ans = comp(none);
      if (new Set(ps.map((p) => p.p + '/' + p.q)).size < 3 || ans.q > 1000) return null;
      return prQ(`${what[0]} 각각 ${ps.map(tx).join(', ')}인 세 사람 A, B, C가 한 번씩 할 때, 적어도 한 사람이 ${what[1]} 확률은? (단, 세 사람의 결과는 서로 영향을 주지 않는다.)`, ans, {
        explain: `세 사람 모두 ${what[2]} 확률은 ${ps.map((p) => '(1 ' + MINUS + ' ' + tx(p) + ')').join(' × ')} = ${tx(none)}이므로 구하는 확률은 1 ${MINUS} ${tx(none)} = ${tx(ans)}이다.`,
        value: `1-${ps.map((p) => `(1-${jq(p)})`).join('*')}`
      });
    }),

    T('indep-three2', '독립인 세 사람 — 적어도 두 명', '②14', (d) => {
      const ps = [d.pick(PROBS), d.pick(PROBS), d.pick(PROBS)];
      if (new Set(ps.map((p) => p.p + '/' + p.q)).size < 3) return null;
      const all3 = qmul(qmul(ps[0], ps[1]), ps[2]);
      const two = [0, 1, 2].map((i) => ps.reduce((acc, p, j) => qmul(acc, j === i ? comp(p) : p), one));
      const ans = qadd(all3, sumQ(two));
      if (ans.q > 1000 || !inside(ans)) return null;
      return prQ(`세 사격 선수 A, B, C가 과녁에 명중시킬 확률은 각각 ${ps.map(tx).join(', ')}이다. 세 선수가 한 발씩 쏠 때, 적어도 두 선수가 과녁에 명중시킬 확률은? (단, 세 선수의 결과는 서로 영향을 주지 않는다.)`, ans, {
        explain: `세 선수 모두 명중시킬 확률은 ${tx(all3)}이다. 두 선수만 명중시킬 확률은 A만, B만, C만 명중시키지 못하는 세 경우를 더해 ${two.map(tx).join(' + ')} = ${tx(sumQ(two))}이다. 따라서 구하는 확률은 ${tx(all3)} + ${tx(sumQ(two))} = ${tx(ans)}이다.`,
        value: `${jq(ps[0])}*${jq(ps[1])}*${jq(ps[2])}+${[0, 1, 2].map((i) => ps.map((p, j) => (j === i ? `(1-${jq(p)})` : jq(p))).join('*')).join('+')}`
      });
    }),

    T('indep-three-back', '적어도 한 명일 확률로 셋째 사람의 확률 거꾸로 구하기', '②15', (d) => {
      const ps = [d.pick(PROBS), d.pick(PROBS), d.pick(PROBS)];
      if (new Set(ps.map((p) => p.p + '/' + p.q)).size < 3) return null;
      const none = ps.reduce((acc, p) => qmul(acc, comp(p)), one), all = comp(none);
      if (all.q > 200) return null;
      return prQ(`세 선수 A, B, C가 화살을 한 번 쏘아 과녁에 명중시킬 확률은 각각 ${tx(ps[0])}, ${tx(ps[1])}, ${V('p')}이다. 세 선수가 화살을 한 번씩 쏠 때 적어도 한 선수가 과녁에 명중시킬 확률이 ${tx(all)}일 때, 상수 ${V('p')}의 값은? (단, 세 선수의 결과는 서로 영향을 주지 않는다.)`, ps[2], {
        explain: `세 선수 모두 명중시키지 못할 확률은 1 ${MINUS} ${tx(all)} = ${tx(none)}이다. (1 ${MINUS} ${tx(ps[0])}) × (1 ${MINUS} ${tx(ps[1])}) × (1 ${MINUS} ${V('p')}) = ${tx(none)}에서 1 ${MINUS} ${V('p')} = ${tx(comp(ps[2]))}, 곧 ${V('p')} = ${tx(ps[2])}이다.`,
        value: `1-(1-${jq(all)})/((1-${jq(ps[0])})*(1-${jq(ps[1])}))`
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 독립시행의 확률 ──
  // 주사위 한 번의 사건과 그 확률
  const DIE = [['6의 약수', Q(2, 3)], ['3의 배수', Q(1, 3)], ['소수', Q(1, 2)], ['5 이상', Q(1, 3)], ['짝수', Q(1, 2)], ['5의 약수', Q(1, 3)], ['4의 약수', Q(1, 2)]];
  const dieWhat = (h) => (/이상$/.test(h) ? h + '인 수의 눈' : h + '의 눈');

  B.addTypes(UNIT, 'trial', [
    T('trial-r', 'n번 가운데 r번 일어날 확률', '②16', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 3), nn = d.int(3, 6), r = d.int(1, nn - 1);
        let p, text;
        if (kind === 0) { p = d.pick([Q(2, 5), Q(3, 5), Q(1, 3), Q(2, 3), Q(3, 4)]); text = `둥근 면이 나올 확률이 ${tx(p)}, 평평한 면이 나올 확률이 ${tx(comp(p))}인 윷짝 ${nn}개를 동시에 던질 때, 둥근 면이 ${r}개 나올 확률은?`; }
        else if (kind === 1) { p = d.pick([Q(1, 3), Q(1, 4), Q(3, 4), Q(2, 5), Q(1, 5)]); text = `어느 온라인 사이트의 방문자가 설문에 참여할 확률이 ${tx(p)}이다. 이 사이트의 방문자 ${nn}명 가운데 ${r}명이 설문에 참여할 확률은? (단, 방문자들은 서로 영향을 주지 않는다.)`; }
        else if (kind === 2) { p = Q(1, 2); text = `한 개의 동전을 ${nn}번 던질 때, 앞면이 ${r}번 나올 확률은?`; }
        else { const [h, q] = d.pick(DIE); p = q; text = `한 개의 주사위를 ${nn}번 던질 때, ${dieWhat(h)}이 ${r}번 나올 확률은?`; }
        const ans = bino(nn, r, p);
        if (!small(ans)) return null;
        return prQ(text, ans, { explain: `한 번에 일어날 확률이 ${tx(p)}인 시행을 ${nn}번 하는 독립시행이므로 구하는 확률은 ${termH(nn, r, p)} = ${tx(ans)}이다.`, value: term(nn, r, p), derived: tdv(nn, r, p) });
      }
      const k = d.pick([3, 4, 5, 6]), nn = d.int(4, 6), r = d.int(1, nn - 1), a = comb(nn, r) * (k - 1) ** (nn - r);
      if (a > 9999 || k ** nn > 99999) return null;
      return intQ(`어떤 시행에서 사건 A가 일어날 확률이 ${frac(1, k)}이다. 이 시행을 ${nn}번 반복하는 독립시행에서 사건 A가 ${r}번 일어날 확률이 ${frac(V('a'), pw(k, nn))}일 때, 상수 ${V('a')}의 값은?`, a, {
        explain: `구하는 확률은 ${termH(nn, r, Q(1, k))} = ${frac(comb(nn, r) + ' × ' + (k - 1) + (nn - r === 1 ? '' : '<sup>' + (nn - r) + '</sup>'), pw(k, nn))}이므로 ${V('a')} = ${a}이다.`,
        value: `${comb(nn, r)}*(${k}-1)**${nn - r}`, derived: [comb(nn, r), nn - r]
      });
    }, { count: 2 }),

    T('trial-least1', '적어도 한 번 일어날 확률 — 여사건', '②17', (d) => {
      const kind = d.int(0, 2), nn = d.int(2, 5);
      let p, text, miss;
      if (kind === 0) { p = d.pick([Q(4, 5), Q(3, 4), Q(2, 3), Q(9, 10), Q(5, 6)]); text = `어느 양궁 선수가 화살 한 발을 쏘아 10점 과녁을 맞힐 확률이 ${tx(p)}이다. 이 선수가 화살 ${nn}발을 쏠 때, 적어도 한 발은 10점 과녁을 맞힐 확률은?`; miss = '한 발도 맞히지 못할'; }
      else if (kind === 1) { const [h, q] = d.pick(DIE); p = q; text = `한 개의 주사위를 ${nn}번 던질 때, ${dieWhat(h)}이 적어도 한 번 나올 확률은?`; miss = '한 번도 나오지 않을'; }
      else { p = d.pick([Q(1, 4), Q(1, 3), Q(2, 5), Q(3, 10)]); text = `어느 상점에서 상품을 산 손님이 경품에 당첨될 확률은 ${tx(p)}이다. 이 상점에서 상품을 산 손님 ${nn}명 가운데 적어도 한 명이 경품에 당첨될 확률은? (단, 손님들은 서로 영향을 주지 않는다.)`; miss = '아무도 당첨되지 않을'; }
      const none = qpow(comp(p), nn), ans = comp(none);
      if (!small(ans) || none.q < 8) return null;
      return prQ(text, ans, { explain: `${miss} 확률은 (${tx(comp(p))})<sup>${nn}</sup> = ${tx(none)}이므로 구하는 확률은 1 ${MINUS} ${tx(none)} = ${tx(ans)}이다.`, value: `1-(1-${jq(p)})**${nn}`, derived: [p.p, p.q, nn] });
    }),

    T('trial-atleast', 'r번 이상 일어날 확률 — 항을 더하거나 여사건', '②18', (d) => {
      const kind = d.int(0, 3), nn = d.int(4, 6), r = d.pick([2, nn - 1]);
      let p, text;
      if (kind === 0) { const [h, q] = d.pick(DIE); p = q; text = `한 개의 주사위를 ${nn}번 던질 때, ${dieWhat(h)}이 ${r}번 이상 나올 확률은?`; }
      else if (kind === 1) { p = Q(1, 2); text = `옳으면 ○표, 옳지 않으면 ×표를 하는 문제가 ${nn}개 있다. 이 문제들에 ○, × 가운데 하나를 임의로 표시할 때, ${r}문제 이상 맞힐 확률은?`; }
      else if (kind === 2) { p = Q(1, 5); text = `보기 다섯 개 가운데 정답이 하나인 문제가 ${nn}개 있다. 이 문제들에 보기를 하나씩 임의로 고를 때, ${r}문제 이상 맞힐 확률은?`; }
      else { p = d.pick([Q(3, 4), Q(2, 3), Q(4, 5)]); text = `어느 고등학교 학생의 ${tj(p, '은/는')} 버스로 등교한다. 이 학교 학생 ${nn}명을 임의로 뽑을 때, ${r}명 이상이 버스로 등교할 확률은?`; }
      const ks = Array.from({ length: nn - r + 1 }, (_, i) => r + i), parts = ks.map((k) => bino(nn, k, p)), ans = sumQ(parts);
      if (!small(ans) || !inside(ans)) return null;
      const useComp = ks.length > r;   // 항이 적은 쪽을 셈한다
      const rest = Array.from({ length: r }, (_, i) => i), restQ = rest.map((k) => bino(nn, k, p));
      return prQ(text, ans, {
        explain: useComp
          ? `${r}번보다 적게 일어날 확률은 ${rest.map((k) => tx(bino(nn, k, p))).join(' + ')} = ${tx(sumQ(restQ))}이므로 구하는 확률은 1 ${MINUS} ${tx(sumQ(restQ))} = ${tx(ans)}이다.`
          : `${ks.map((k) => k + '번').join(', ')} 일어날 확률을 더하면 ${parts.map(tx).join(' + ')} = ${tx(ans)}이다.`,
        value: ks.map((k) => term(nn, k, p)).join('+'), derived: ks.flatMap((k) => tdv(nn, k, p))
      });
    }),

    T('trial-minn', '적어도 한 번 일어날 확률이 기준을 넘는 가장 작은 횟수', '②19', (d) => {
      if (d.bool()) {
        const m = d.pick([50, 100, 200, 500, 1000, 2000, 5000]), ans = Math.floor(Math.log2(m)) + 1;
        return N(`서로 다른 ${V('n')}개의 동전을 동시에 던질 때, 앞면이 적어도 한 개 나올 확률이 ${frac(m - 1, m)}보다 크다. 자연수 ${V('n')}의 최솟값은?`, ans, {
          explain: `1 ${MINUS} (${frac(1, 2)})<sup>${V('n')}</sup> &gt; ${frac(m - 1, m)}에서 2<sup>${V('n')}</sup> &gt; ${m}이다. 2<sup>${ans - 1}</sup> = ${2 ** (ans - 1)}, 2<sup>${ans}</sup> = ${2 ** ans}이므로 최솟값은 ${ans}이다.`,
          facts: { range: { ineq: `2**x>${m}`, lo: 1, hi: 20, want: 'min' } }
        });
      }
      const m = d.pick([4, 5, 10, 20, 50]), ans = (() => { let k = 1; while (2 ** k * m >= 3 ** k) k += 1; return k; })();
      return N(`한 개의 주사위를 ${V('n')}번 던질 때, 3의 배수의 눈이 적어도 한 번 나올 확률이 ${frac(m - 1, m)}보다 크다. 자연수 ${V('n')}의 최솟값은?`, ans, {
        explain: `1 ${MINUS} (${frac(2, 3)})<sup>${V('n')}</sup> &gt; ${frac(m - 1, m)}에서 (${frac(2, 3)})<sup>${V('n')}</sup> &lt; ${frac(1, m)}, 곧 ${m} × 2<sup>${V('n')}</sup> &lt; 3<sup>${V('n')}</sup>이다. ${V('n')} = ${ans - 1}이면 ${m * 2 ** (ans - 1)} ≥ ${3 ** (ans - 1)}이고 ${V('n')} = ${ans}이면 ${m * 2 ** ans} &lt; ${3 ** ans}이므로 최솟값은 ${ans}이다.`,
        facts: { range: { ineq: `${m}*2**x<3**x`, lo: 1, hi: 30, want: 'min' } }
      });
    }),

    T('trial-score', '점수 합으로 횟수를 정한 뒤 독립시행의 확률', '②20', (d, n) => {
      if (n === 0) {
        const coin = d.bool(), [h, p] = coin ? ['앞면', Q(1, 2)] : d.pick(DIE), s1 = d.int(2, 5), s2 = d.int(1, s1 - 1), nn = d.int(4, 8), k = d.int(1, nn - 1), S = s1 * k + s2 * (nn - k);
        const ans = bino(nn, k, p);
        if (!small(ans)) return null;
        const lead = coin ? `한 개의 동전을 던져 앞면이 나오면 ${s1}점, 뒷면이 나오면 ${s2}점을 얻는다. 동전을 ${nn}번 던질 때` : `한 개의 주사위를 던져 ${dieWhat(h)}이 나오면 ${s1}점, 그렇지 않으면 ${s2}점을 얻는다. 주사위를 ${nn}번 던질 때`;
        return prQ(`${lead}, 얻은 점수의 합이 ${S}점일 확률은?`, ans, {
          explain: `${coin ? '앞면' : dieWhat(h)}이 ${V('x')}번 나오면 ${cf(s1)}${V('x')} + ${cf(s2)}(${nn} ${MINUS} ${V('x')}) = ${S}에서 ${V('x')} = ${k}이다. 따라서 구하는 확률은 ${termH(nn, k, p)} = ${tx(ans)}이다.`,
          value: term(nn, k, p), derived: tdv(nn, k, p)
        });
      }
      const w = d.int(2, 4), b = d.int(2, 5), nn = d.int(4, 5), k = d.int(1, nn - 1), S = k + 2 * (nn - k), tot = w + b, a = comb(nn, k) * w ** k * b ** (nn - k);
      if (w === b || a > 9999 || tot ** nn > 99999) return null;
      return intQ(`흰 공 ${w}개와 검은 공 ${b}개가 들어 있는 주머니에서 공 한 개를 꺼내 색을 확인하고 다시 넣는 시행을 한다. 꺼낸 공이 흰 공이면 1점, 검은 공이면 2점을 얻는다. 이 시행을 ${nn}번 할 때 얻은 점수의 합이 ${S}점일 확률이 ${frac(V('a'), pw(tot, nn))}이다. 상수 ${V('a')}의 값은?`, a, {
        explain: `흰 공이 ${V('x')}번 나오면 ${V('x')} + 2(${nn} ${MINUS} ${V('x')}) = ${S}에서 ${V('x')} = ${k}이다. 구하는 확률은 ${termH(nn, k, Q(w, tot))} = ${frac(comb(nn, k) + ' × ' + pw(w, k) + ' × ' + pw(b, nn - k), pw(tot, nn))}이므로 ${V('a')} = ${a}이다.`,
        value: `${comb(nn, k)}*${w}**${k}*${b}**${nn - k}`, derived: [comb(nn, k), k, nn - k]
      });
    }, { count: 2 }),

    T('trial-line', '수직선 위를 움직이는 점의 확률', '②21', (d, n) => {
      if (n === 0) {
        const [h, p] = d.pick(DIE.filter(([, q]) => q.q !== 2)), nn = d.int(4, 6), ks = [];
        for (let x = 0; x <= nn; x += 1) ks.push({ x, pos: 2 * x - nn });
        const dists = [...new Set(ks.map((k) => Math.abs(k.pos)))].filter((v) => v > 0 && v < nn), dist = d.pick(dists), hit = ks.filter((k) => Math.abs(k.pos) === dist);
        const parts = hit.map((k) => bino(nn, k.x, p)), ans = sumQ(parts);
        if (!small(ans) || hit.length !== 2) return null;
        return prQ(`수직선 위의 원점에 점 P가 있다. 한 개의 주사위를 던져 ${dieWhat(h)}이 나오면 점 P를 양의 방향으로 1만큼, 그렇지 않으면 음의 방향으로 1만큼 옮긴다. 주사위를 ${nn}번 던질 때, 점 P와 원점 사이의 거리가 ${dist}일 확률은?`, ans, {
          explain: `${dieWhat(h)}이 ${V('x')}번 나오면 점 P의 좌표는 ${V('x')} ${MINUS} (${nn} ${MINUS} ${V('x')}) = 2${V('x')} ${MINUS} ${nn}이다. 거리가 ${dist}이려면 좌표가 ${dist} 또는 ${MINUS}${dist}, 곧 ${V('x')} = ${hit.map((k) => k.x).join(' 또는 ')}이다. 따라서 구하는 확률은 ${parts.map(tx).join(' + ')} = ${tx(ans)}이다.`,
          value: hit.map((k) => term(nn, k.x, p)).join('+'), derived: hit.flatMap((k) => tdv(nn, k.x, p))
        });
      }
      const nn = d.int(8, 10), dist = d.int(1, 3), p = Q(1, 2), hit = [];
      for (let x = 0; x <= nn; x += 1) if (Math.abs(2 * x - nn) <= dist) hit.push(x);
      const parts = hit.map((x) => bino(nn, x, p)), ans = sumQ(parts);
      if (hit.length < 2 || !small(ans)) return null;
      return prQ(`수직선 위의 원점에 점 P가 있다. 한 개의 주사위를 던져 짝수의 눈이 나오면 점 P를 양의 방향으로 1만큼, 홀수의 눈이 나오면 음의 방향으로 1만큼 옮긴다. 주사위를 ${nn}번 던질 때, 점 P와 원점 사이의 거리가 ${dist} 이하일 확률은?`, ans, {
        explain: `짝수의 눈이 ${V('x')}번 나오면 점 P의 좌표는 2${V('x')} ${MINUS} ${nn}이다. |2${V('x')} ${MINUS} ${nn}| ≤ ${dist}인 ${V('x')}는 ${hit.join(', ')}이므로 구하는 확률은 ${parts.map(tx).join(' + ')} = ${tx(ans)}이다.`,
        value: hit.map((x) => term(nn, x, p)).join('+'), derived: hit.flatMap((x) => tdv(nn, x, p))
      });
    }, { count: 2 }),

    T('trial-plane', '좌표평면 위를 움직이는 점의 확률', '②22', (d, n) => {
      if (n === 0) {
        const [h, p] = d.pick(DIE), nn = d.int(4, 6), r = d.int(Math.ceil(nn / Math.SQRT2), nn - 1), hit = [];
        for (let x = 0; x <= nn; x += 1) if (x * x + (nn - x) * (nn - x) <= r * r) hit.push(x);
        const parts = hit.map((x) => bino(nn, x, p)), ans = sumQ(parts);
        if (hit.length < 1 || hit.length === nn + 1 || !small(ans)) return null;
        return prQ(`좌표평면 위의 원점 O에 점 P가 있다. 한 개의 주사위를 던져 ${dieWhat(h)}이 나오면 점 P를 ${V('x')}축의 양의 방향으로 1만큼, 그렇지 않으면 ${V('y')}축의 양의 방향으로 1만큼 옮긴다. 주사위를 ${nn}번 던질 때, 점 P와 원점 O 사이의 거리가 ${r} 이하일 확률은?`, ans, {
          explain: `${dieWhat(h)}이 ${V('x')}번 나오면 점 P는 (${V('x')}, ${nn} ${MINUS} ${V('x')})에 있다. ${V('x')}<sup>2</sup> + (${nn} ${MINUS} ${V('x')})<sup>2</sup> ≤ ${r * r}인 ${V('x')}는 ${hit.join(', ')}이므로 구하는 확률은 ${parts.map(tx).join(' + ')} = ${tx(ans)}이다.`,
          value: hit.map((x) => term(nn, x, p)).join('+'), derived: hit.flatMap((x) => tdv(nn, x, p)).concat([r * r])
        });
      }
      const nn = d.pick([4, 6, 8]), ans = bino(nn, nn / 2, Q(1, 2));
      return prQ(`좌표평면 위의 두 점 A, B가 각각 (0, 0), (${nn}, ${nn})에 있다. 한 개의 동전을 던져 앞면이 나오면 점 A는 ${V('x')}축의 방향으로 1만큼, 점 B는 ${V('x')}축의 방향으로 ${MINUS}1만큼 옮기고, 뒷면이 나오면 점 A는 ${V('y')}축의 방향으로 1만큼, 점 B는 ${V('y')}축의 방향으로 ${MINUS}1만큼 옮긴다. 이 시행을 ${nn}번 할 때, 두 점 A, B가 만날 확률은?`, ans, {
        explain: `${nn}번 가운데 앞면이 ${V('m')}번 나오면 A는 (${V('m')}, ${nn} ${MINUS} ${V('m')}), B는 (${nn} ${MINUS} ${V('m')}, ${V('m')})에 있다(시행 중간에는 두 점의 좌표의 합이 달라 만나지 않는다). 만나려면 ${V('m')} = ${nn / 2}이므로 구하는 확률은 ${termH(nn, nn / 2, Q(1, 2))} = ${tx(ans)}이다.`,
        value: term(nn, nn / 2, Q(1, 2)), derived: tdv(nn, nn / 2, Q(1, 2))
      });
    }, { count: 2 }),

    T('trial-square', '정사각형의 변을 따라 도는 점의 확률', '②23', (d) => {
      const [h, p] = d.pick(DIE), [m1, m2] = d.shuffle([1, 2, 3]).slice(0, 2), nn = d.int(4, 6), hit = [];
      for (let x = 0; x <= nn; x += 1) if ((m1 * x + m2 * (nn - x)) % 4 === 0) hit.push(x);
      const parts = hit.map((x) => bino(nn, x, p)), ans = sumQ(parts);
      if (hit.length < 1 || hit.length > 2 || !small(ans) || !inside(ans)) return null;
      return prQ(`한 변의 길이가 1인 정사각형 ABCD의 꼭짓점 A에 점 P가 있다. 한 개의 주사위를 던져 ${dieWhat(h)}이 나오면 점 P를 변을 따라 시계 방향으로 ${m1}만큼, 그렇지 않으면 시계 방향으로 ${m2}만큼 옮긴다. 주사위를 ${nn}번 던진 뒤 점 P가 꼭짓점 A에 있을 확률은?`, ans, {
        explain: `${dieWhat(h)}이 ${V('x')}번 나오면 점 P가 움직인 거리는 ${cf(m1)}${V('x')} + ${cf(m2)}(${nn} ${MINUS} ${V('x')})이고, 점 P가 A에 있으려면 이 거리가 둘레 4의 배수이어야 한다. 그런 ${V('x')}는 ${hit.join(', ')}이므로 구하는 확률은 ${hit.length === 1 ? termH(nn, hit[0], p) : parts.map(tx).join(' + ')} = ${tx(ans)}이다.`,
        value: hit.map((x) => term(nn, x, p)).join('+'), derived: hit.flatMap((x) => tdv(nn, x, p)).concat([4])
      });
    }),

    T('trial-stakes', '중단된 경기의 상금 나누기', '②25', (d) => {
      const k = d.int(3, 5), i = d.int(1, k - 1), j = d.int(0, k - 1), a = k - i, b = k - j;
      if (i <= j || a + b - 1 > 6) return null;
      // A가 남은 a판을 B가 b판을 이기기 전에 이길 확률
      let win = Q(0);
      for (let t = 0; t < b; t += 1) win = qadd(win, qmul(Q(comb(a - 1 + t, t)), Q(1, 2 ** (a + t))));
      const unit = 2 ** (a + b - 1), mults = [1, 2, 3, 4, 5].filter((c) => unit * c >= 16 && unit * c <= 320);
      if (!mults.length) return null;
      const S = unit * d.pick(mults), share = (S * win.p) / win.q;
      if (!Number.isInteger(share) || share === S) return null;
      const terms = [];
      for (let t = 0; t < b; t += 1) terms.push(`${comb(a - 1 + t, t)}/2**${a + t}`);
      return intQ(`두 사람 A, B가 상금 ${S}만 원을 걸고 먼저 ${k}판을 이긴 사람이 상금을 모두 갖는 놀이를 하였다. A가 ${i}판, B가 ${j}판을 이긴 상태에서 놀이가 멈추었다. 놀이를 계속했을 때 이길 확률의 비로 상금을 나눌 때, A가 받는 상금은 몇 만 원인가? (단, 두 사람이 한 판을 이길 확률은 같고 비기는 경우는 없다.)`, share, {
        unit: '만 원',
        explain: `A는 ${a}판을, B는 ${b}판을 더 이겨야 한다. A가 이기려면 B가 ${b}판을 이기기 전에 A가 ${a}판을 이겨야 하므로 A가 이길 확률은 ${tx(win)}이다. 따라서 A가 받는 상금은 ${S} × ${tx(win)} = ${share}(만 원)이다.`,
        value: `${S}*(${terms.join('+')})`, derived: [...new Set(terms.join('+').match(/\d+/g).map(Number))]
      });
    }),

    T('trial-branch', '결과에 따라 던지는 횟수가 다를 때 — 갈래와 독립시행', '②27', (d) => {
      const p = d.pick([Q(1, 3), Q(2, 3), Q(1, 4), Q(3, 4), Q(2, 5), Q(3, 5)]), n1 = d.int(3, 5), n2 = d.int(2, 4), r = d.int(1, Math.min(n1, n2) - 0);
      if (n1 === n2 || r > Math.min(n1, n2)) return null;
      const b1 = bino(n1, r, Q(1, 2)), b2 = bino(n2, r, Q(1, 2)), ans = qadd(qmul(p, b1), qmul(comp(p), b2));
      if (qcmp(b1, b2) === 0 || !inside(ans) || !small(ans)) return null;
      return prQ(`이길 확률이 ${tx(p)}인 놀이를 한 판 한다. 이 놀이에서 이기면 한 개의 동전을 ${n1}번 던지고, 지면 한 개의 동전을 ${n2}번 던진다. 동전의 앞면이 ${r}번 나올 확률은? (단, 비기는 경우는 없다.)`, ans, {
        explain: `이겼을 때 앞면이 ${r}번 나올 확률은 ${termH(n1, r, Q(1, 2))} = ${tx(b1)}, 졌을 때는 ${termH(n2, r, Q(1, 2))} = ${tx(b2)}이다. 따라서 구하는 확률은 ${tx(p)} × ${tx(b1)} + ${tx(comp(p))} × ${tx(b2)} = ${tx(ans)}이다.`,
        value: `${jq(p)}*${term(n1, r, Q(1, 2))}+(1-${jq(p)})*${term(n2, r, Q(1, 2))}`, derived: tdv(n1, r, Q(1, 2)).concat(tdv(n2, r, Q(1, 2)))
      });
    })
  ]);

  K.tdv = tdv; K.qpow = qpow; K.bino = bino; K.small = small; K.term = term; K.termH = termH; K.sumQ = sumQ; K.DIE = DIE; K.dieWhat = dieWhat; K.conds = conds; K.SPACES = SPACES;
})(typeof window !== 'undefined' ? window : globalThis);
