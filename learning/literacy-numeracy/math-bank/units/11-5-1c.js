// 고등학교 미적분Ⅱ Ⅰ-1 수열의 극한 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-5-1a.js 머리에 적었다. 도구는 B.kit.u1151(a 파일)을 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번. 이 단원에는 심화 문서(기출 모의고사)가 없어 실력 문항도 모두 기본 문서
// (학기 시험·대단원 평가·중단원 평가의 끝 문제, 교과서 발전 문제)에서 왔다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 극한의 성질(합·차·곱·몫)을 발산하는 수열에도 그대로 쓴다(lim bₙ = ∞인데 lim(aₙ + bₙ) − lim bₙ 처럼 적는다).
//  - 모든 n에서 aₙ &lt; bₙ이면 극한값도 lim aₙ &lt; lim bₙ이라고 본다(극한으로 가면 ≤가 된다).
//  - 등비수열 {rⁿ}이 수렴하는 범위를 −1 &lt; r &lt; 1로 적어 r = 1을 빼거나, r = −1을 넣는다. 첫째항이 0이면 공비와 상관없이 수렴한다는 것을 놓친다.
//  - |r| = 1을 한꺼번에 다루어 r = −1에서 rⁿ이 진동하는 것을 놓친다(r²ⁿ만 있으면 r = −1에서도 1이다).
//  - 지수 꼴에서 밑이 같아지는 경계(r = 5, a = 5)를 따로 따지지 않는다.
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, M, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qcmp, qsub, isInt, nb, V, sup, nz, rt } = B.kit.mid;
  const { ms, sum, pw, hx, plot, jh } = B.kit.hs;
  const K = B.kit.u1151;
  const { S1, S2, S3, H, NV, RV, XV, AN, BN, SN, iq, jn, jq, pn, is, par, seq, LN, LE, ptext, lead, numA, comboPick, GA } = K;
  const conds = (rows) => lines(rows.map((h, i) => `<b>${['㈎', '㈏', '㈐'][i]}</b> ${h}`));
  const coefH = (c, h, first) => (first ? lead(c, h) : `${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${h}`);
  const lin2 = (a, b, x, y) => `${coefH(a, x, true)} ${coefH(b, y)}`;
  // 사이 범위 답: 「[±][ ] [부등호] x [부등호] [±][ ]」
  const between = (text, lo, lc, hi, hc, o) => inline(text, `{0} {1} ${XV} {2} {3}`,
    [{ answer: lo, signed: true }, { rel: true, answer: lc ? '<=' : '<' }, { rel: true, answer: hc ? '<=' : '<' }, { answer: hi, signed: true }],
    Object.assign({}, o, { shown: nb(`${iq(lo)} ${lc ? LE : '&lt;'} ${XV} ${hc ? LE : '&lt;'} ${iq(hi)}`) }));

  const hard = [
    // ① 발산하는 수열에는 극한의 성질을 그대로 쓸 수 없다 — 수렴하는 cₙ으로 바꾸고 발산하는 수열로 나눈다(교과서 발전 문제·중단원 평가 끝 문제).
    H('hard-infmix', '무한대로 발산하는 수열이 섞인 식의 극한', '①13', (d, n) => {
      if (n === 0) {
        const c = nz(d, -5, 5), p = nz(d, -3, 4), q = nz(d, -4, 4), r = d.int(1, 4), s = nz(d, -4, 4);
        if (q === p || s === r || (q - p) % (s - r) !== 0) return null;
        const v = (q - p) / (s - r);
        return numA(`두 수열 ${seq(AN)}, ${seq(BN)}에 대하여 ${is(LN(`(${AN} + ${BN})`), c)}, ${is(LN(BN), '∞')}일 때, 다음 극한값은?`, v, {
          figure: hx(LN(frac(lin2(p, q, AN, BN), lin2(r, s, AN, BN)))),
          explain: `${is(nb(`${AN} + ${BN}`), ms('c_n'))}으로 놓으면 ${is(LN(ms('c_n')), c)}이고 ${is(AN, nb(`${ms('c_n')} ${MINUS} ${BN}`))}이다. 분자는 ${nb(`${lead(p, ms('c_n'))} ${coefH(q - p, BN)}`)}, 분모는 ${nb(`${lead(r, ms('c_n'))} ${coefH(s - r, BN)}`)}이고, ${BN} → ∞이므로 ${frac(ms('c_n'), BN)} → 0이다. 분모와 분자를 ${BN}으로 나누면 ${frac(iq(q - p), iq(s - r))} = ${iq(v)}이다(${jh(iq(c), '은/는')} 답에 쓰이지 않는다).`,
          facts: { value: `((${jn(q)})-(${jn(p)}))/((${jn(s)})-(${jn(r)}))` } });
      }
      const p = d.int(2, 6), q = d.int(2, 5), c = nz(d, -5, 5), u = nz(d, -4, 4), v = nz(d, -4, 4), w = nz(d, -4, 4), z = nz(d, -4, 4);
      if (gcd(p, q) !== 1) return null;
      const top = u * q + v * p, bot = w * q + z * p;
      if (bot === 0 || top === 0 || top % bot !== 0) return null;
      const val = top / bot, CN = ms('c_n');
      return numA(`두 수열 ${seq(AN)}, ${jh(seq(BN), '이/가')} 다음 조건을 모두 만족시킬 때, 아래 극한값은?`, val, {
        figure: conds([is(LN(AN), '∞'), is(LN(`(${p}${AN} ${MINUS} ${q}${BN})`), c)]) + hx(LN(frac(lin2(u, v, AN, BN), lin2(w, z, AN, BN)))),
        explain: `${is(nb(`${p}${AN} ${MINUS} ${q}${BN}`), CN)}으로 놓으면 ${is(BN, frac(`${p}${AN} ${MINUS} ${CN}`, q))}이고 ${AN} → ∞, ${CN} → ${iq(c)}이므로 ${frac(CN, AN)} → 0이다. 이것을 넣고 분모와 분자를 ${AN}으로 나누면 ${frac(`${iq(u)} × ${q} + ${pn(v)} × ${p}`, `${iq(w)} × ${q} + ${pn(z)} × ${p}`)} = ${iq(val)}이다.`,
        facts: { value: `((${jn(u)})*${q}+(${jn(v)})*${p})/((${jn(w)})*${q}+(${jn(z)})*${p})` } });
    }, { count: 2 }),

    // ② 부분합에서 일반항(Sₙ − Sₙ₋₁) → n²을 곱한 극한 → 수렴하는 두 수열의 차, 네 단계를 잇는다(대단원 평가).
    H('hard-psum', '부분합으로 준 조건에서 n²aₙ의 극한', '①14', (d) => {
      const p = d.int(1, 5), m = d.int(1, 3), q = d.int(1, 3), A = nz(d, -5, 5), Lb = qsub(Q(-p, m), Q(A));
      if (Lb.p === 0 || Lb.q > 3) return null;
      const SK = sum('k=1', 'n', `(${ms('a_k')} + ${ms('b_k')})`);
      const denH = `${m === 1 ? '' : m}${NV} + ${q}`;
      return numA(`두 수열 ${seq(AN)}, ${jh(seq(BN), '이/가')} 다음 조건을 모두 만족시킬 때, ${LN(NV + sup(2) + AN)}의 값은?`, A, {
        figure: conds([is(SK, frac(p, denH)), is(LN(NV + sup(2) + BN), Lb)]),
        explain: `${nb(`${NV} ${'≥'} 2`)}일 때 ${is(nb(`${AN} + ${BN}`), nb(`${frac(p, denH)} ${MINUS} ${frac(p, `${m === 1 ? '' : m}(${NV} ${MINUS} 1) + ${q}`)}`))}이고, 통분하면 분자가 ${MINUS}${p * m}, 분모가 ${lead(m * m, NV + sup(2))} + …이므로 ${is(LN(`${NV}${sup(2)}(${AN} + ${BN})`), Q(-p, m))}이다. 따라서 ${is(LN(NV + sup(2) + AN), nb(`${iq(Q(-p, m))} ${MINUS} ${pn(Lb)}`))} = ${iq(A)}이다.`,
        facts: { value: `0-${p}/${m}-(${jn(Lb)})` } });
    }),

    // ② 부등식을 k = 1부터 n까지 더하고 → 합의 공식 → n³으로 나누어 → 대소 관계(학기 시험 서술형 6점·대단원 평가 서술형).
    H('hard-sumsq', '부등식을 더해 구하는 Sₙ/n³의 극한', '①28', (d) => {
      const p = d.pick([1, 2, 4, 5]), u = d.int(1, 5), v = d.int(1, 5);
      return numA(`수열 ${jh(seq(AN), '이/가')} 모든 자연수 ${NV}에 대하여 ${jh(nb(`${ptext([-u, 0, p])} &lt; ${AN} &lt; ${ptext([v, 0, p])}`), '을/를')} 만족시킨다. 수열 ${seq(AN)}의 첫째항부터 제${NV}항까지의 합을 ${jh(SN, '이라/라')} 할 때, ${LN(frac(SN, NV + sup(3)))}의 값은?`, Q(p, 3), {
        explain: `${ms('k')} = 1부터 ${NV}까지 더하면 ${nb(`${frac(`${p === 1 ? '' : p}${NV}(${NV} + 1)(2${NV} + 1)`, 6)} ${MINUS} ${u}${NV} &lt; ${SN} &lt; ${frac(`${p === 1 ? '' : p}${NV}(${NV} + 1)(2${NV} + 1)`, 6)} + ${v}${NV}`)}이다. 각 변을 ${NV}${sup(3)}으로 나누면 양쪽 끝이 모두 ${frac(2 * p, 6)} = ${iq(Q(p, 3))}에 수렴하므로 대소 관계에 의하여 극한값은 ${iq(Q(p, 3))}이다.`,
        facts: { value: `${p}/3`, derived: [3] } });
    }),

    // ① 이웃한 두 항의 부등식에서 lim aₙ₊₁ = lim aₙ = α로 놓고, 극한으로 가면 &lt;가 ≤로 바뀌는 것을 대야 한다(중단원 평가).
    H('hard-neighbor', '이웃한 두 항의 부등식과 수렴하는 수열', '①29', (d) => {
      const k = d.int(3, 5), q = d.int(1, k - 1), p = d.int(1, 8);
      if (p % (k - 1) === 0) return null;
      const al = Q(p, k - 1), r = Q(p * (k - q), k - 1), An1 = ms('a_{n+1}');
      return numA(`수렴하는 수열 ${jh(seq(AN), '이/가')} 모든 자연수 ${NV}에 대하여 ${jh(nb(`${AN} + ${p} &lt; ${k}${An1} &lt; ${q === 1 ? '' : q}${AN} + ${iq(r)}`), '을/를')} 만족시킬 때, ${LN(AN)}의 값은?`, al, {
        explain: `${is(LN(AN), V('α'))}라 하면 ${is(LN(An1), V('α'))}이고, 극한으로 가면 부등호에 등호가 붙어 ${nb(`${V('α')} + ${p} ${LE} ${k}${V('α')} ${LE} ${q === 1 ? '' : q}${V('α')} + ${iq(r)}`)}이다. 왼쪽에서 ${nb(`${V('α')} ${'≥'} ${iq(al)}`)}, 오른쪽에서 ${nb(`${V('α')} ${LE} ${iq(al)}`)}이므로 ${is(V('α'), al)}이다.`,
        facts: { value: `${p}/(${k}-1)` } });
    }),

    // ① 첫째항이 0이면 공비와 상관없이 수렴한다 — 그 값 하나가 범위의 끝을 닫는다(소단원 평가).
    H('hard-twogeo', '두 등비수열이 동시에 수렴하는 x의 범위', '②6', (d) => {
      const a = nz(d, -4, 4), c = d.int(2, 5), b = nz(d, -3, 3), e = d.int(2, 4), m = b + e;
      const L1 = -c - a, U1 = c - a, L2 = b - e;
      if (!(m < U1) || L1 === L2) return null;
      const lo = Math.max(L1, L2), lc = L2 > L1;
      if (lo >= m || Math.abs(lo) > 9 || Math.abs(m) > 9 || m === 0) return null;
      const first = `(${frac(ptext([a, 1], XV), c)})${sup(NV)}`, second = `(${ptext([-m, 1], XV)})(${frac(`${iq(b)} ${MINUS} ${XV}`, e)})${sup(`${NV}-1`)}`;
      return between(`두 등비수열 ${seq(first)}, ${jh(seq(second), '이/가')} 동시에 수렴하도록 하는 실수 ${XV}의 값의 범위를 구하시오.`, lo, lc, m, true, {
        explain: `첫째 수열은 공비가 ${frac(ptext([a, 1], XV), c)}이므로 ${nb(`${iq(L1)} &lt; ${XV} ${LE} ${iq(U1)}`)}일 때 수렴한다. 둘째 수열은 첫째항이 ${ptext([-m, 1], XV)}이고 공비가 ${frac(`${iq(b)} ${MINUS} ${XV}`, e)}이므로 ${nb(`${iq(L2)} ${LE} ${XV} &lt; ${iq(m)}`)}일 때 수렴하고, ${is(XV, m)}이면 모든 항이 0이라 수렴한다. 곧 ${nb(`${iq(L2)} ${LE} ${XV} ${LE} ${iq(m)}`)}이다. 두 범위의 공통부분은 ${nb(`${iq(lo)} ${lc ? LE : '&lt;'} ${XV} ${LE} ${iq(m)}`)}이다.`,
        facts: { calc: [[lc ? `(${jn(b)})-${e}` : `0-${c}-(${jn(a)})`, 0], [`(${jn(b)})+${e}`, 3]] } });
    }),

    // ① {rⁿ}이 수렴하면 −1 &lt; r ≤ 1 — 끝점 r = 1에서 −r = −1이 되는 것, r²ⁿ⁺¹의 공비가 r²인 것을 대야 한다(소단원 평가).
    H('hard-always', '등비수열 {rⁿ}이 수렴할 때 항상 수렴하는 수열', '②7', (d) => {
      const LIN = [];
      for (const s of [1, -1, 2]) for (let t = -3; t <= 3; t += 1) for (const u of [1, 2, 3, 4]) if (!(s === 1 && t === 0 && u === 1) && gcd(gcd(Math.abs(s), Math.abs(t)), u) === 1) LIN.push([s, t, u]);
      const item = (spec) => {
        if (spec === 'odd') return { h: seq(`${RV}${sup(`2${NV}+1`)}`), ok: true, why: `${is(`${RV}${sup(`2${NV}+1`)}`, nb(`${RV}(${RV}${sup(2)})${sup(NV)}`))}이고 ${nb(`0 ${LE} ${RV}${sup(2)} ${LE} 1`)}이므로 항상 수렴한다` };
        const [s, t, u] = spec, gm = Q(t - s, u), g1 = Q(t + s, u);
        const ok = s > 0 ? qcmp(gm, Q(-1)) >= 0 && qcmp(g1, Q(1)) <= 0 : qcmp(g1, Q(-1)) > 0 && qcmp(gm, Q(1)) <= 0;
        const num = `${s === 1 ? '' : s === -1 ? MINUS : s}${RV}${t === 0 ? '' : ` ${t < 0 ? MINUS : '+'} ${Math.abs(t)}`}`;
        const h = seq(`(${u === 1 ? num : frac(num, u)})${sup(NV)}`);
        const range = s > 0 ? nb(`${iq(gm)} &lt; (공비) ${LE} ${iq(g1)}`) : nb(`${iq(g1)} ${LE} (공비) &lt; ${iq(gm)}`);
        return { h, ok, why: `공비의 범위가 ${range}이므로 ${ok ? '항상 수렴한다' : '수렴하지 않을 때가 있다'}` };
      };
      const specs = d.shuffle(LIN.slice()).slice(0, 2).concat(d.bool() ? ['odd'] : d.shuffle(LIN.slice()).slice(0, 1));
      const three = d.shuffle(specs).map(item);
      if (new Set(three.map((x) => x.h)).size !== 3 || !three.some((x) => x.ok) || three.every((x) => x.ok)) return null;
      return comboPick(d, `등비수열 ${jh(seq(`${RV}${sup(NV)}`), '이/가')} 수렴할 때, 보기의 수열 가운데 항상 수렴하는 것만을 있는 대로 고른 것은?`, three.map((x) => x.h), three.map((x) => x.ok),
        `${seq(`${RV}${sup(NV)}`)}이 수렴하므로 ${nb(`${MINUS}1 &lt; ${RV} ${LE} 1`)}이다. ` + three.map((x, i) => `${GA[i]}. ${x.why}.`).join(' '));
    }),

    // ② 세 항의 합 둘 → 공비·첫째항 → Sₙ → 제곱을 펼쳐 r²ⁿ으로 나눔, 네 단계를 잇는다(대단원 평가 서술형).
    H('hard-sn', '등비수열의 부분합과 항이 섞인 극한', '②10', (d) => {
      const r = d.pick([-2, -3, 3]), den = (r - 1) ** 2, a1 = d.int(1, 9);
      if (a1 % den === 0) return null;
      const A = a1 * (1 + r + r * r), Bsum = A * r ** 3, ans = Q(a1, den), A2n1 = ms('a_{2n+1}');
      return numA(`등비수열 ${jh(seq(AN), '이/가')} ${nb(`${ms('a_1')} + ${ms('a_2')} + ${ms('a_3')} = ${A}`)}, ${jh(nb(`${ms('a_4')} + ${ms('a_5')} + ${ms('a_6')} = ${iq(Bsum)}`), '을/를')} 만족시킨다. 수열 ${seq(AN)}의 첫째항부터 제${NV}항까지의 합을 ${jh(SN, '이라/라')} 할 때, ${LN(frac(SN + sup(2), A2n1))}의 값은?`, ans, {
        explain: `공비를 ${RV}라 하면 ${is(nb(`${RV}${sup(3)}`), frac(iq(Bsum), A))} = ${iq(r ** 3)}이므로 ${is(RV, r)}, ${is(ms('a_1'), frac(A, 1 + r + r * r))} = ${a1}이다. ${is(SN, frac(`${a1}{(${iq(r)})${sup(NV)} ${MINUS} 1}`, iq(r - 1)))}, ${is(A2n1, nb(`${a1} × (${iq(r)})${sup(`2${NV}`)}`))}이므로 분모와 분자를 ${jh(`(${iq(r)})${sup(`2${NV}`)}`, '으로/로')} 나누면 ${frac(`${a1 * a1}`, `${a1} × ${pn(r - 1)}${sup(2)}`)} = ${iq(ans)}이다.`,
        facts: { value: `(${A}/(1+(${jn(r)})+(${jn(r)})*(${jn(r)})))/(((${jn(r)})-1)*((${jn(r)})-1))`, derived: [Math.abs(r)] } });
    }),

    // ① 경계(r = 1, r = 5)를 따로 따지고 한 범위가 통째로 답이 되기도 하는 것을 대야 한다(교과서 발전 문제·중단원 평가 끝 문제). 사용자 결정으로 실력.
    H('hard-cases', '극한값이 주어진 값이 되는 r 모두 찾기', '②14', (d, n) => {
      const cellsCnt = (text, cnt, big, o) => M(text, [{ lead: '개수 =', answer: cnt }, { lead: `가장 큰 ${RV} =`, answer: big }], Object.assign({}, o, { shown: `개수 ${cnt}, 가장 큰 ${RV} = ${big}` }));
      if (n === 0) {
        const p = d.int(1, 5), s = d.int(1, 3), r0 = d.int(2, 5), Lv = Q(r0 + p, s), works1 = d.bool();
        let q, t;
        if (works1) { t = d.int(1, 4); const qq = Lv.p * (s + t) / Lv.q - 1 - p; if (!Number.isInteger(qq) || qq === 0 || Math.abs(qq) > 12) return null; q = qq; }
        else { q = nz(d, -5, 6); t = d.int(1, 4); if (qcmp(Q(1 + p + q, s + t), Lv) === 0) return null; }
        if (qcmp(Q(q, t), Lv) === 0 || s + t === 0) return null;
        const cnt = works1 ? 2 : 1, rn = `${RV}${sup(NV)}`;
        const body = frac(`${RV}${sup(`${NV}+1`)} + ${p === 1 ? '' : p}${rn} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}`, `${s === 1 ? '' : s}${rn} + ${t}`);
        return cellsCnt(`${jh(is(LN(body), Lv), '을/를')} 만족시키는 양수 ${RV}의 개수와 가장 큰 ${RV}의 값을 차례로 구하시오.`, cnt, r0, {
          explain: `${nb(`0 &lt; ${RV} &lt; 1`)}이면 극한값은 ${jh(frac(iq(q), t), '이라/라')} 맞지 않는다. ${is(RV, 1)}이면 ${frac(`1 + ${p} + ${pn(q)}`, `${s} + ${t}`)} = ${jh(iq(Q(1 + p + q, s + t)), '이라/라')} ${works1 ? '맞는다' : '맞지 않는다'}. ${nb(`${RV} &gt; 1`)}이면 분모와 분자를 ${jh(rn, '으로/로')} 나누어 ${s === 1 ? `${RV} + ${p}` : frac(`${RV} + ${p}`, s)}에 수렴하므로 ${is(s === 1 ? `${RV} + ${p}` : frac(`${RV} + ${p}`, s), Lv)}에서 ${is(RV, r0)}이다. 따라서 ${RV}는 ${works1 ? `1, ${r0}의 2개` : `${r0} 하나`}이다.`,
          facts: { calc: [[String(cnt), 0], [`${s}*(${jn(Lv)})-${p}`, 1]], derived: [cnt] } });
      }
      const b = d.int(3, 6), k = d.int(2, 12), sols = [];
      for (let r = 1; r <= 60; r += 1) if (r < b || (r === b && k === b) || (r > b && r === k)) sols.push(r);
      const cnt = sols.length, big = sols[sols.length - 1];
      const body = frac(`${pw(b, 'n')} + ${RV}${sup(`${NV}+1`)}`, `${pw(b, 'n')} + ${k} × ${RV}${sup(NV)}`);
      return cellsCnt(`${is(LN(body), 1)}이 성립하도록 하는 자연수 ${RV}의 개수와 가장 큰 ${RV}의 값을 차례로 구하시오.`, cnt, big, {
        explain: `${nb(`${RV} &lt; ${b}`)}이면 분모와 분자를 ${jh(pw(b, 'n'), '으로/로')} 나누어 극한값은 1이므로 1부터 ${b - 1}까지 모두 된다. ${is(RV, b)}이면 ${frac(`1 + ${b}`, `1 + ${k}`)}이므로 ${k === b ? '1이 되어 된다' : '1이 아니다'}. ${nb(`${RV} &gt; ${b}`)}이면 분모와 분자를 ${jh(`${RV}${sup(NV)}`, '으로/로')} 나누어 ${frac(RV, k)}이므로 ${k > b ? `${is(RV, k)}일 때 된다` : `${RV} &gt; ${b}인 자연수에서는 1이 될 수 없다`}. 따라서 개수는 ${cnt}, 가장 큰 값은 ${big}이다.`,
        facts: { calc: [[String(cnt), 0], [String(big), 1]], derived: [cnt, big] } });
    }, { count: 2 }),

    // ① + ② 유리화 → 5ⁿ으로 나눔 → (a/5)ⁿ의 경우 셋 → a = 5일 때도 수렴(1/2)한다는 것을 대야 한다(대단원 평가). 사용자 결정으로 실력.
    H('hard-sqrtexp', '√(b²ⁿ + aⁿ) − bⁿ이 수렴하도록 하는 자연수 a', '②15', (d) => {
      const b = d.int(3, 7), BB = b * b;
      return numA(`수열 ${jh(seq(`${rt(`${pw(BB, 'n')} + ${V('a')}${sup(NV)}`)} ${MINUS} ${pw(b, 'n')}`), '이/가')} 수렴하도록 하는 자연수 ${V('a')}의 개수는?`, b, {
        explain: `분자를 유리화하면 ${frac(`${V('a')}${sup(NV)}`, `${rt(`${pw(BB, 'n')} + ${V('a')}${sup(NV)}`)} + ${pw(b, 'n')}`)}이고, 분모와 분자를 ${jh(pw(b, 'n'), '으로/로')} 나누면 ${frac(`(${frac(V('a'), b)})${sup(NV)}`, `${rt(`1 + (${frac(V('a'), BB)})${sup(NV)}`)} + 1`)}이다. ${nb(`${V('a')} &lt; ${b}`)}이면 0에, ${is(V('a'), b)}이면 ${frac(1, 2)}에 수렴하고, ${nb(`${V('a')} &gt; ${b}`)}이면 발산한다. 따라서 ${V('a')}는 1부터 ${b}까지 ${b}개이다.`,
        facts: { value: String(b) } });
    }),

    // ① |r| = 1을 r = 1과 r = −1로 다시 가르고, |r| &gt; 1이면 r &lt; −1이어도 1/rⁿ → 0인 것을 대야 한다(교과서 문제·중단원 평가 끝 문제).
    H('hard-mix', 'rⁿ과 r²ⁿ이 섞인 극한의 경우 나누기', '②19', (d, n) => {
      if (n === 0) {
        const s = d.int(1, 4), p = nz(d, -6, 6), q = nz(d, -5, 5);
        if (p === q || p === -q) return null;
        const vIn = Q(p, s), vOne = Q(p - q, 1 + s), vNeg = Q(p + q, 1 + s), wrongIn = Q(p - q, s);
        if (qcmp(wrongIn, vIn) === 0) return null;
        const A = [{ h: `${nb(`|${RV}| &lt; 1`)}일 때, 극한값은 ${iq(vIn)}이다.`, ok: true }, { h: `${nb(`|${RV}| &lt; 1`)}일 때, 극한값은 ${iq(wrongIn)}이다.`, ok: false }];
        const Bm = [{ h: `${is(RV, 1)}일 때, 극한값은 ${iq(vOne)}이다.`, ok: true }, { h: `${nb(`|${RV}| = 1`)}일 때, 극한값은 ${iq(vOne)}이다.`, ok: false }, { h: `${is(RV, nb(`${MINUS}1`))}일 때, 극한값은 ${iq(vNeg)}이다.`, ok: false }];
        const Cm = [{ h: `${nb(`|${RV}| &gt; 1`)}일 때, 극한값은 0이다.`, ok: true }, { h: `${nb(`|${RV}| &gt; 1`)}일 때, 극한값은 ${iq(-q)}이다.`, ok: false }];
        const three = [d.pick(A), d.pick(Bm), d.pick(Cm)];
        if (!three.some((x) => x.ok)) return null;
        const body = frac(`${iq(p)} ${q < 0 ? '+' : MINUS} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${RV}${sup(NV)}`, `${RV}${sup(`2${NV}`)} + ${s}`);
        return comboPick(d, `수열의 극한 ${LN(body)}에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?`, three.map((x) => x.h), three.map((x) => x.ok),
          `${nb(`|${RV}| &lt; 1`)}이면 ${RV}${sup(NV)}, ${RV}${sup(`2${NV}`)} → 0이므로 ${iq(vIn)}이다. ${is(RV, 1)}이면 ${iq(vOne)}이지만, ${is(RV, nb(`${MINUS}1`))}이면 ${RV}${sup(NV)}이 ${MINUS}1, 1을 오가므로 식의 값이 ${iq(vNeg)}, ${jq(vOne, '을/를')} 오가며 진동한다. ${nb(`|${RV}| &gt; 1`)}이면 분모와 분자를 ${RV}${sup(`2${NV}`)}으로 나누어 0이다.`);
      }
      const c = nz(d, -3, 3), e = nz(d, -4, 5), k = d.int(2, 4);
      const vOne = Q(1 - c + e, k + 1), wrongOne = Q(1 - c + e, k);
      if (qcmp(vOne, wrongOne) === 0) return null;
      const lin = `${iq(e)} ${c > 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${RV}`;
      const A = [{ h: `${nb(`|${RV}| &gt; 1`)}일 때, 발산한다.`, ok: false }, { h: `${nb(`|${RV}| &gt; 1`)}일 때, 극한값은 ${frac(1, `${k}${RV}`)}이다.`, ok: true }, { h: `${nb(`|${RV}| &gt; 1`)}일 때, 극한값은 ${iq(Q(1, k))}이다.`, ok: false }];
      const Bm = [{ h: `${is(RV, 1)}일 때, 극한값은 ${iq(vOne)}이다.`, ok: true }, { h: `${is(RV, 1)}일 때, 극한값은 ${iq(wrongOne)}이다.`, ok: false }];
      const Cm = [{ h: `${nb(`|${RV}| &lt; 1`)}일 때, 극한값은 ${nb(lin)}이다.`, ok: true }, { h: `${nb(`|${RV}| &lt; 1`)}일 때, 극한값은 ${iq(e)}이다.`, ok: false }];
      const three = [d.pick(A), d.pick(Bm), d.pick(Cm)];
      if (!three.some((x) => x.ok)) return null;
      const body = frac(`${RV}${sup(`${NV}-1`)} ${c > 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${RV} ${e < 0 ? MINUS : '+'} ${Math.abs(e)}`, `${k}${RV}${sup(NV)} + 1`);
      return comboPick(d, `수열의 극한 ${LN(body)} ${nb(`(${RV} ${'≠'} ${MINUS}1)`)}에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?`, three.map((x) => x.h), three.map((x) => x.ok),
        `${nb(`|${RV}| &gt; 1`)}이면 ${frac(1, `${RV}${sup(NV)}`)} → 0이므로 분모와 분자를 ${RV}${sup(NV)}으로 나누어 ${frac(1, `${k}${RV}`)}에 수렴한다(${RV} &lt; ${MINUS}1이어도 같다). ${is(RV, 1)}이면 ${frac(`1 ${c > 0 ? MINUS : '+'} ${Math.abs(c)} ${e < 0 ? MINUS : '+'} ${Math.abs(e)}`, `${k} + 1`)} = ${iq(vOne)}이다. ${nb(`|${RV}| &lt; 1`)}이면 ${RV}${sup(`${NV}-1`)}, ${RV}${sup(NV)} → 0이므로 ${nb(lin)}이다.`);
    }, { count: 2 }),

    // ② 좌표 → 넓이 → n/(n + 1)과 지수 꼴로 쪼갬 → 밑이 큰 거듭제곱으로 나눔, 네 단계를 잇는다(교과서 중단원 점검 발전 문제).
    H('hard-expo', '지수함수의 그래프 위의 두 점이 만드는 삼각형', '②22', (d) => {
      const [p, q] = d.pick([[3, 2], [4, 3], [4, 2]]), ys = 190 / ((p * p + 1.5) * 44);
      const figure = plot({ x: [-1.2, 2.5], y: [-0.6, p * p + 1], w: 230, ys, xt: [], yt: [],
        curves: [{ f: (x) => p ** x, name: `y=${p}^x`, color: '#b42318' }, { f: (x) => q ** x, name: `y=${q}^x`, color: '#1d4ed8' }],
        lines: [{ x: 2, dash: true, name: 'x=n', said: 'y축에 평행한 직선 x = n' }],
        fill: [{ f: (x) => (p * p / 2) * x, g: (x) => (q * q / 2) * x, from: 0, to: 2 }],
        segs: [{ p: [0, 0], q: [2, p * p] }, { p: [0, 0], q: [2, q * q] }],
        dots: [{ x: 2, y: p * p, name: 'P_n', side: 'l', said: '직선과 위쪽 곡선의 교점' }, { x: 2, y: q * q, name: 'Q_n', side: 'r', said: '직선과 아래쪽 곡선의 교점' }] });
      const Pn = ms('P_n'), Qn = ms('Q_n'), An1 = ms('a_{n+1}');
      return numA(`그림과 같이 자연수 ${NV}에 대하여 직선 ${is(XV, NV)}이 두 곡선 ${nb(`${V('y')} = ${p}${sup(XV)}`)}, ${nb(`${V('y')} = ${q}${sup(XV)}`)}과 만나는 점을 각각 ${Pn}, ${jh(Qn, '이라/라')} 하자. 삼각형 ${ms('OP_nQ_n')}의 넓이를 ${jh(AN, '이라/라')} 할 때, ${LN(frac(AN, An1))}의 값은? (단, O는 원점이다.)`, Q(1, p), {
        figure, explain: `${is(Pn, nb(`(${NV}, ${pw(p, 'n')})`))}, ${is(Qn, nb(`(${NV}, ${pw(q, 'n')})`))}이므로 ${is(AN, nb(`${frac(1, 2)} × ${NV} × (${pw(p, 'n')} ${MINUS} ${pw(q, 'n')})`))}이다. ${is(frac(AN, An1), nb(`${frac(NV, `${NV} + 1`)} × ${frac(`${pw(p, 'n')} ${MINUS} ${pw(q, 'n')}`, `${pw(p, 'n+1')} ${MINUS} ${pw(q, 'n+1')}`)}`))}이고, 뒤의 분수의 분모와 분자를 ${jh(pw(p, 'n'), '으로/로')} 나누면 ${frac(1, p)}에 수렴하므로 극한값은 1 × ${frac(1, p)} = ${iq(Q(1, p))}이다.`,
        facts: { value: `1/${p}` } });
    })
  ];

  B.addGroup('11-5-1', { id: 'hard', title: '실력 문제', standard: S2, types: hard.map((t) => Object.assign(t, { standard: /^hard-(twogeo|always|sn|cases|sqrtexp|mix|expo)$/.test(t.id) ? S3 : S2 })) });
})(typeof window !== 'undefined' ? window : globalThis);
