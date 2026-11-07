// 고등학교 대수 Ⅲ-1 「등차수열과 등비수열」 — 뒤쪽 묶음(등비수열의 뜻과 일반항, 등비수열의 합, 수열의 합과 일반항의 관계, 등차수열과 등비수열을 함께).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 11-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, gcd, range, Q, qadd, qsub, qmul, qdiv, qpow, qcmp, isInt, tx, nb, tail, V, sup, nz, asQ, poly, lin, rt, radText, radAns } = B.kit.mid;
  const { ms, jh, lg, rtn } = B.kit.hs;
  const {
    UNIT, S2, S3, stripH, T, iq, qq, jn, jq, nj, qj, A, SS, NV, AN, SN, SEQ, eq, EXP, listH, NOTEF, ar, arS, geoQ, geoSQ,
    iA, nA, termA, fA, linT, gH, geoT, geoTF, choose, valsQ, namedQ, josa2, pq
  } = B.kit.u1115;

  const RV = V('r'), AV = V('a');
  const pw0 = (b, e) => (b < 0 ? '(' + iq(b) + ')' : String(b)) + sup(e);             // 거듭제곱의 글: (−2)³, 3⁵
  const pwQ = (x, e) => { const q = asQ(x); return (q.q === 1 && q.p > 0 ? String(q.p) : '(' + qq(q) + ')') + sup(e); };
  const cv = (c, v) => (c === 1 ? v : c === -1 ? MINUS + v : iq(c) + v);          // 계수가 1, −1이면 숫자를 적지 않는다
  const ratios = [Q(1, 2), Q(1, 3), Q(-1, 2), Q(2, 3), Q(-1, 3), Q(3, 2), Q(1, 4)];

  // ── 등비수열의 뜻과 일반항 ──
  B.addTypes(UNIT, 'geo', [
    T('geo-ar', '등비수열의 첫째항과 공비', '②1', (d) => {
      const r = d.pick(ratios), a = (d.bool() ? 1 : -1) * d.int(1, 9) * r.q ** d.int(0, 2), t = range(1, 5).map((i) => geoQ(a, r, i));
      if (Math.abs(a) > 400) return null;
      return inline(`등비수열 ${listH(t)}의 첫째항과 공비는?` + NOTEF, `첫째항 {0}, 공비 ${frac('{1}', '{2}')}`, [{ answer: a, signed: true }, { answer: r.p, signed: true }, { answer: r.q }], {
        shown: `첫째항 ${iq(a)}, 공비 ${qq(r)}`,
        explain: `첫째항은 ${iq(a)}이고, 공비는 뒤의 항을 앞의 항으로 나눈 ${qq(r)}이다.`,
        facts: { calc: [[jn(a), 0], [`${t[1].p}*${t[0].q}*${r.q}/(${t[1].q}*${jn(t[0].p)})`, 1], [String(r.q), 2]], derived: [1, r.q] }
      });
    }, { standard: S3 }),
    T('geo-blank', '등비수열 나열의 빈칸', '②2', (d, n) => {
      const r = d.pick([-3, -2, 2, 3]), a = nz(d, -6, 6), t = range(1, 5).map((i) => a * r ** (i - 1)), hide = n === 0 ? [2, 3] : [1, 4];
      if (t.some((v) => Math.abs(v) > 9999)) return null;
      const fig = t.map((v, i) => (i === hide[0] ? box('㉠') : i === hide[1] ? box('㉡') : iq(v))).join(', ') + ', …';
      const calc = n === 0
        ? [[`${jn(t[1])}*${jn(t[1])}/${jn(t[0])}`, 0], [`${jn(t[1])}*${jn(t[1])}*${jn(t[1])}/(${jn(t[0])}*${jn(t[0])})`, 1]]
        : [[`${jn(t[2])}*${jn(t[2])}/${jn(t[3])}`, 0], [`${jn(t[3])}*${jn(t[3])}/${jn(t[2])}`, 1]];
      return namedQ('다음 수열이 등비수열일 때, ㉠, ㉡에 알맞은 수는?', [['㉠', t[hide[0]]], ['㉡', t[hide[1]]]], {
        figure: lines([fig]),
        explain: n === 0 ? `공비가 ${nb(`${iq(t[1])} ÷ ${pq(t[0])} = ${iq(r)}`)}이므로 ㉠은 ${iq(t[2])}, ㉡은 ${iq(t[3])}이다.` : `${iq(t[3])} ÷ ${pq(t[2])}에서 공비가 ${iq(r)}이므로 ㉠은 ${nb(`${iq(t[2])} ÷ ${pq(r)}`)} = ${iq(t[1])}, ㉡은 ${nb(`${iq(t[3])} × ${pq(r)}`)} = ${iq(t[4])}이다.`,
        facts: { calc }
      });
    }, { count: 2 }),
    T('geo-term', '첫째항과 공비로 일반항', '②3', (d, n) => {
      const a = nz(d, -9, 9), r = d.pick([-4, -3, -2, 2, 3, 4, 5]);
      if (n === 0) {
        return geoT(`첫째항이 ${iq(a)}, 공비가 ${iq(r)}인 등비수열의 일반항 ${jh(AN, '은/는')}?`, a, r, {
          explain: `첫째항이 ${AV}, 공비가 ${RV}인 등비수열의 일반항은 ${eq(AN, ms('ar^{n-1}'))}이므로 ${eq(AN, gH(a, r))}이다.`,
          facts: { calc: [[jn(a), 0], [jn(r), 1]] }
        });
      }
      const t = range(1, 4).map((i) => a * r ** (i - 1));
      return geoT(`등비수열 ${listH(t)}의 일반항 ${jh(AN, '은/는')}?`, a, r, {
        explain: `첫째항이 ${iq(a)}, 공비가 ${nb(`${iq(t[1])} ÷ ${pq(t[0])} = ${iq(r)}`)}이므로 ${eq(AN, gH(a, r))}이다.`,
        facts: { calc: [[jn(t[0]), 0], [`${jn(t[1])}/${jn(t[0])}`, 1]] }
      });
    }, { count: 2 }),
    T('geo-termfrac', '공비가 분수인 등비수열의 일반항', '②3', (d) => {
      const r = d.pick(ratios.filter((x) => Math.abs(x.p) === 1)), a = (d.bool() ? 1 : -1) * d.int(1, 9) * r.q ** d.int(1, 3), t = range(1, 4).map((i) => geoQ(a, r, i));
      if (Math.abs(a) > 600) return null;
      return geoTF(`등비수열 ${listH(t)}의 일반항 ${jh(AN, '은/는')}?`, a, r, {
        explain: `첫째항이 ${iq(a)}, 공비가 ${qq(r)}이므로 ${eq(AN, gH(a, r))}이다.`,
        facts: { calc: [[jn(a), 0], [`${t[1].p}*${r.q}/(${t[1].q}*${jn(a)})`, 1], [String(r.q), 2]], derived: [1, r.q] }
      });
    }),
    T('geo-kth', '첫째항과 공비로 제k항(분수)', '②3', (d) => {
      const r = d.pick([Q(-1, 2), Q(1, 2), Q(-1, 3), Q(1, 3), Q(-2, 3)]), j = d.int(1, 4), a = d.int(1, 5) * r.q ** j * (d.bool() ? 1 : -1), k = d.int(j + 2, j + 5), v = geoQ(a, r, k);
      if (isInt(v) || Math.abs(a) > 600 || v.q > 2000) return null;
      return fA(`첫째항이 ${iq(a)}, 공비가 ${qq(r)}인 등비수열의 제${k}항은?`, v, {
        explain: `${eq(A(k), nb(`${iq(a)} × ${pwQ(r, k - 1)}`))} = ${qq(v)}이다.`,
        facts: { value: `${jn(a)}*(${r.p}/${r.q})**(${k}-1)` }
      });
    }),
    T('geo-two', '두 항으로 일반항·제k항·몇째 항', '②4', (d, n) => {
      if (n === 2) {
        const qn = d.pick([2, 3]), a = d.pick([1, 2, 3, 5]) * qn ** d.int(0, 1), r = Q(-1, qn), m = d.int(6, 11), v = geoQ(a, r, m), t = range(1, 5).map((i) => geoQ(a, r, i));
        if (v.q > 3000) return null;
        return termA(`등비수열 ${listH(t)}에서 ${qj(v, '은/는')} 제몇 항인가?`, m, {
          explain: `첫째항이 ${a}, 공비가 ${qq(r)}이므로 ${eq(AN, gH(a, r))}이다. ${eq(gH(a, r), qq(v))}에서 ${eq(pwQ(r, ms('n-1')), pwQ(r, m - 1))}이므로 ${eq(NV, String(m))}, 제${m}항이다.`,
          facts: { range: { ineq: `${a}*${v.q}<${Math.abs(v.p)}*${qn}**(x-1)+1`, lo: 1, hi: 60, want: 'min' } }
        });
      }
      if (n === 3) {
        const s = d.pick([2, 3]), c = d.int(1, 4), p = d.pick([1, 3]), q = p + 3, ap = c * s ** ((p - 1) / 2), aqc = c * s ** ((q - 2) / 2), k = d.pick([7, 9, 11]), v = c * s ** ((k - 1) / 2);
        if (v > 9999) return null;
        return iA(`등비수열 ${SEQ}에서 ${eq(A(p), String(ap))}, ${eq(A(q), radText(aqc, s))}일 때, 제${k}항은?`, v, {
          explain: `공비를 ${RV}라고 하면 ${eq(ms('r^3'), nb(`${radText(aqc, s)} ÷ ${ap}`))} = ${radText(s, s)}이므로 ${eq(RV, rt(s))}이다. 따라서 ${eq(A(k), nb(`${A(p)} × (${rt(s)})${sup(k - p)}`))} = ${ap} × ${s}${sup((k - p) / 2)} = ${v}이다.`,
          facts: { calc: [[`${ap}*${s}**((${k}-${p})/2)`, 0]], derived: [2] }
        });
      }
      const a = nz(d, -6, 6), r = d.pick([-3, -2, 2, 3]), p = d.int(1, 3), q = p + d.pick([1, 3]), ap = a * r ** (p - 1), aq = a * r ** (q - 1);
      if (Math.abs(aq) > 9999) return null;
      const given = `${eq(A(p), iq(ap))}, ${eq(A(q), iq(aq))}`;
      const solve = q - p === 1 ? `공비는 ${nb(`${iq(aq)} ÷ ${pq(ap)} = ${iq(r)}`)}이고, 첫째항은 ${iq(a)}이다.` : `공비를 ${RV}라고 하면 ${eq(ms(`r^${q - p}`), nb(`${iq(aq)} ÷ ${pq(ap)}`))} = ${iq(r ** (q - p))}에서 ${eq(RV, iq(r))}이고, 첫째항은 ${iq(a)}이다.`;
      if (n === 0) {
        return geoT(`등비수열 ${SEQ}에서 ${given}일 때, 일반항 ${jh(AN, '은/는')}?`, a, r, {
          explain: `${solve} 따라서 ${eq(AN, gH(a, r))}이다.`,
          facts: { calc: [[`${jn(ap)}/(${jn(r)})**(${p}-1)`, 0], [jn(r), 1]], derived: [Math.abs(r)] }
        });
      }
      const k = q + d.int(1, 3), v = a * r ** (k - 1);
      if (Math.abs(v) > 9999) return null;
      return iA(`등비수열 ${SEQ}에서 ${given}일 때, 제${k}항은?`, v, {
        explain: `${solve} 따라서 ${eq(A(k), nb(`${A(q)} × ${k - q === 1 ? pq(r) : pw0(r, k - q)}`))} = ${iq(v)}이다.`,
        facts: { calc: [[`${jn(aq)}*(${jn(r)})**(${k}-${q})`, 0]], derived: [Math.abs(r)] }
      });
    }, { count: 4 }),
    T('geo-first', '처음으로 k보다 작아지는(커지는) 항', '②5', (d, n) => {
      if (n === 0) {
        const qn = d.pick([2, 3, 4, 5]), a = d.int(1, 9) * qn ** d.int(1, 3), Tv = d.pick([Q(1), Q(1, 10), Q(1, 100)]);
        const m = range(1, 60).find((x) => qcmp(geoQ(a, Q(1, qn), x), Tv) < 0);
        if (!m || m < 4 || range(1, 60).some((x) => qcmp(geoQ(a, Q(1, qn), x), Tv) === 0)) return null;
        return termA(`첫째항이 ${a}, 공비가 ${frac(1, qn)}인 등비수열에서 처음으로 ${qq(Tv)}보다 작아지는 항은 제몇 항인가?`, m, {
          explain: `${eq(AN, gH(a, Q(1, qn)))}이다. ${nb(`${gH(a, Q(1, qn))} &lt; ${qq(Tv)}`)}에서 ${nb(`${qn}${sup(ms('n-1'))} &gt; ${a * Tv.q}`)}이고, 이를 만족시키는 가장 작은 자연수 ${jh(NV, '은/는')} ${m}이다.`,
          facts: { range: { ineq: `${a}*${Tv.q}<${Tv.p}*${qn}**(x-1)`, lo: 1, hi: 60, want: 'min' } }
        });
      }
      const r = d.pick([2, 3]), k = d.int(3, 6), L = r === 2 ? 0.301 : 0.4771, Ls = r === 2 ? '0.3010' : '0.4771';
      const m = range(1, 60).find((x) => r ** (x - 1) > 10 ** k), mApprox = Math.floor(k / L) + 2;
      if (m !== mApprox || Math.abs(k / L - Math.round(k / L)) < 0.05) return null;
      return termA(`첫째항이 1, 공비가 ${r}인 등비수열에서 처음으로 ${10 ** k}보다 커지는 항은 제몇 항인가? (단, ${eq(lg(null, r), Ls)}${tail(Number(Ls.slice(-1)), '으로/로')} 계산한다.)`, m, {
        explain: `${eq(AN, pw0(r, ms('n-1')))}이다. ${nb(`${pw0(r, ms('n-1'))} &gt; ${10 ** k}`)}의 양변에 상용로그를 취하면 ${nb(`(${NV} − 1) × ${Ls} &gt; ${k}`)}, ${nb(`${NV} − 1 &gt; ${(k / L).toFixed(2)}…`)}이므로 가장 작은 자연수 ${jh(NV, '은/는')} ${m}이다.`,
        facts: { range: { ineq: `${r}**(x-1)>${10 ** k}`, lo: 1, hi: 60, want: 'min' } }
      });
    }, { count: 2 }),
    T('geo-mid', '등비중항으로 미지수', '②6', (d, n) => {
      if (n === 0) {
        const x = d.int(3, 30), ps = range(2, 12).filter((v) => (x * x) % v === 0 && v !== x);
        if (!ps.length) return null;
        const p = d.pick(ps), q = (x * x) / p, X = V('x');
        return iA(`세 수 ${p}, ${X}, ${jh(String(q), '이/가')} 이 순서대로 등비수열의 연속한 세 항일 때, 양수 ${X}의 값은?`, x, {
          explain: `${X}는 ${josa2(p, '과/와')} ${q}의 등비중항이므로 ${eq(X + sup(2), `${p} × ${q}`)} = ${x * x}이다. ${X}는 양수이므로 ${eq(X, String(x))}이다.`,
          facts: { range: { ineq: `x*x<${p}*${q}+1`, lo: 1, hi: 200, want: 'max' } }
        });
      }
      const [k, a, m] = d.pick([[2, 2, 2], [2, 8, 16], [2, 18, 54], [4, 4, 4], [4, 16, 32], [2, 32, 128], [4, 36, 108]]);
      return iA(`세 수 ${frac(1, k)}${AV}, ${m}, ${jh(AV + sup(2), '이/가')} 이 순서대로 등비수열의 연속한 세 항일 때, 실수 ${AV}의 값은?`, a, {
        explain: `${josa2(m, '은/는')} ${frac(1, k)}${AV}와 ${AV}${sup(2)}의 등비중항이므로 ${eq(m + sup(2), nb(`${frac(1, k)}${AV} × ${AV}${sup(2)}`))}, ${eq(AV + sup(3), String(k * m * m))}이다. 실수 ${AV}는 ${a}이다.`,
        facts: { range: { ineq: `x*x*x<${k}*${m}*${m}+1`, lo: -50, hi: 200, want: 'max' } }
      });
    }, { count: 2 }),
    T('geo-midmany', '넷·다섯 수가 등비수열일 때 사이의 수', '②7', (d, n) => {
      if (n === 0) {
        const r = d.pick([Q(2), Q(3), Q(1, 2), Q(1, 3)]), c = d.int(1, 6) * (r.q === 1 ? 1 : r.q ** 4), t = range(1, 5).map((i) => geoQ(c, r, i).p);
        if (Math.max(...t) > 9999) return null;
        const X = V('a'), Y = V('b'), Z = V('c');
        return valsQ(`다섯 개의 수 ${t[0]}, ${X}, ${Y}, ${Z}, ${jh(String(t[4]), '이/가')} 이 순서대로 등비수열의 연속한 다섯 항일 때, ${X}, ${Y}, ${Z}의 값은? (단, ${X}, ${Y}, ${Z}는 양수이다.)`, [[X, t[1], false], [Y, t[2], false], [Z, t[3], false]], {
          explain: `공비를 ${RV}라고 하면 ${eq(nb(`${t[0]}${RV}${sup(4)}`), String(t[4]))}, ${eq(RV + sup(4), qq(Q(t[4], t[0])))}이다. 세 수가 양수이므로 ${eq(RV, qq(r))}이고 ${eq(X, String(t[1]))}, ${eq(Y, String(t[2]))}, ${eq(Z, String(t[3]))}이다.`,
          facts: { calc: [[`${t[0]}*${r.p}/${r.q}`, 0], [`${t[0]}*${r.p * r.p}/${r.q * r.q}`, 1], [`${t[0]}*${r.p ** 3}/${r.q ** 3}`, 2]], derived: [r.p, r.q, r.p * r.p, r.q * r.q, r.p ** 3, r.q ** 3] }
        });
      }
      const x = nz(d, -5, 5), r = d.pick([-3, -2, 2, 3]), t1 = Q(x, r), y = x * r, t4 = x * r * r;
      if (isInt(t1)) return null;
      const X = V('x'), Y = V('y');
      return valsQ(`네 수 ${qq(t1)}, ${X}, ${Y}, ${jh(iq(t4), '이/가')} 이 순서대로 등비수열의 연속한 네 항일 때, 실수 ${X}, ${Y}의 값은?`, [[X, x], [Y, y]], {
        explain: `공비를 ${RV}라고 하면 ${eq(nb(`${qq(t1)} × ${RV}${sup(3)}`), iq(t4))}, ${eq(RV + sup(3), iq(r ** 3))}이고 ${RV}는 실수이므로 ${eq(RV, iq(r))}이다. 따라서 ${eq(X, iq(x))}, ${eq(Y, iq(y))}이다.`,
        facts: { calc: [[`${jn(t4)}/(${jn(r)}*${jn(r)})`, 0], [`${jn(t4)}/${jn(r)}`, 1]], derived: [Math.abs(r)] }
      });
    }, { count: 2 }),
    T('geo-sym', '등비중항으로 곱·제곱을 바로 구하는 식의 값', '②8', (d, n) => {
      const X = V('a'), Y = V('b');
      if (n === 0) {
        const qn = d.pick([2, 3, 5]), m = qn * d.int(1, 6), up = d.bool(), t1 = up ? m / qn : m * qn, t5 = up ? m * qn : m / qn, v = t1 * m + m * m + m * t5;
        if (!Number.isInteger(t1) || !Number.isInteger(t5) || v > 9999) return null;
        return iA(`다섯 개의 수 ${t1}, ${X}, ${m}, ${Y}, ${jh(String(t5), '이/가')} 이 순서대로 등비수열의 연속한 다섯 항일 때, ${nb(`${X}${sup(2)} + ${X}${Y} + ${Y}${sup(2)}`)}의 값은?`, v, {
          explain: `등비중항으로 ${eq(X + sup(2), `${t1} × ${m}`)} = ${t1 * m}, ${eq(nb(`${X}${Y}`), m + sup(2))} = ${m * m}, ${eq(Y + sup(2), `${m} × ${t5}`)} = ${m * t5}이다. 따라서 구하는 값은 ${t1 * m + m * m + m * t5}이다.`,
          facts: { calc: [[`${t1}*${m}+${m}*${m}+${m}*${t5}`, 0]] }
        });
      }
      const m = d.int(2, 8), pairs = range(1, m * m).filter((u) => (m * m) % u === 0 && u < m * m / u).map((u) => [u, m * m / u]);
      if (!pairs.length) return null;
      const [u, w] = d.pick(pairs), s = u + w, mid = d.bool() ? m : -m, v = s * s - 2 * m * m;
      return iA(`세 수 ${X}, ${iq(mid)}, ${jh(Y, '이/가')} 이 순서대로 등비수열의 연속한 세 항이다. ${eq(nb(`${X} + ${Y}`), String(s))}일 때, ${nb(`${X}${sup(2)} + ${Y}${sup(2)}`)}의 값은?`, v, {
        explain: `${nj(mid, '은/는')} ${X}와 ${Y}의 등비중항이므로 ${eq(nb(`${X}${Y}`), pw0(mid, 2))} = ${m * m}이다. 따라서 ${eq(nb(`${X}${sup(2)} + ${Y}${sup(2)}`), nb(`(${X} + ${Y})${sup(2)} − 2${X}${Y}`))} = ${s * s} − ${2 * m * m} = ${v}이다.`,
        facts: { calc: [[`${s}*${s}-2*${m}*${m}`, 0]], derived: [2] }
      });
    }, { count: 2 }),
    T('geo-ratio', '묶음 합(항 사이 관계식)의 비로 공비', '②9', (d, n) => {
      if (n === 0) {
        const r = d.pick([Q(1, 2), Q(1, 3), Q(2), Q(3)]), a1 = d.int(1, 6) * r.q ** 4, t = range(1, 5).map((i) => geoQ(a1, r, i).p), P = t[0] + t[2], Qv = t[2] + t[4];
        if (Qv > 9999) return null;
        return iA(`공비가 양수인 등비수열 ${SEQ}에 대하여 ${eq(nb(`${A(1)} + ${A(3)}`), String(P))}, ${eq(nb(`${A(3)} + ${A(5)}`), String(Qv))}일 때, ${A(1)}의 값은?`, a1, {
          explain: `${eq(nb(`${A(3)} + ${A(5)}`), nb(`${RV}${sup(2)}(${A(1)} + ${A(3)})`))}이므로 ${eq(RV + sup(2), qq(Q(Qv, P)))}, ${eq(RV, qq(r))}이다. ${eq(nb(`${A(1)}(1 + ${RV}${sup(2)})`), String(P))}에서 ${eq(A(1), String(a1))}이다.`,
          facts: { calc: [[`${P}*${P}/(${P}+${Qv})`, 0]] }
        });
      }
      if (n === 1) {
        const qn = d.pick([2, 3]), r = Q(1, qn), a1 = d.int(1, 4) * qn ** 5, t = range(1, 6).map((i) => geoQ(a1, r, i).p), P = t[2] + t[3], Qv = t[4] + t[5], k = d.int(8, 10), v = geoQ(a1, r, k);
        if (isInt(v) || P > 9999) return null;
        return fA(`모든 항이 양수인 등비수열 ${SEQ}에서 ${eq(nb(`${A(3)} + ${A(4)}`), String(P))}, ${eq(nb(`${A(5)} + ${A(6)}`), String(Qv))}일 때, ${A(k)}의 값은?`, v, {
          explain: `${eq(nb(`${A(5)} + ${A(6)}`), nb(`${RV}${sup(2)}(${A(3)} + ${A(4)})`))}이므로 ${eq(RV + sup(2), qq(Q(Qv, P)))}, 모든 항이 양수이므로 ${eq(RV, qq(r))}이다. ${eq(nb(`${A(3)} + ${A(4)}`), nb(`${A(3)}(1 + ${RV})`))}에서 ${eq(A(3), String(t[2]))}이므로 ${eq(A(k), nb(`${t[2]} × ${pwQ(r, k - 3)}`))} = ${qq(v)}이다.`,
          facts: { value: `${P}/(1+1/${qn})*(1/${qn})**(${k}-3)`, derived: [qn] }
        });
      }
      if (n === 2) {
        const r = d.pick([-3, -2, 2, 3]), a1 = nz(d, -5, 5), P = a1 * (1 + r + r * r), Qv = P * r, v = a1 * r ** 4;
        if (Math.abs(v) > 9999) return null;
        return iA(`등비수열 ${SEQ}에서 ${eq(nb(`${A(1)} + ${A(2)} + ${A(3)}`), iq(P))}, ${eq(nb(`${A(2)} + ${A(3)} + ${A(4)}`), iq(Qv))}일 때, ${A(5)}의 값은?`, v, {
          explain: `${eq(nb(`${A(2)} + ${A(3)} + ${A(4)}`), nb(`${RV}(${A(1)} + ${A(2)} + ${A(3)})`))}이므로 ${eq(RV, iq(r))}이다. ${eq(nb(`${A(1)}(1 + ${RV} + ${RV}${sup(2)})`), iq(P))}에서 ${eq(A(1), iq(a1))}이므로 ${eq(A(5), nb(`${iq(a1)} × ${pw0(r, 4)}`))} = ${iq(v)}이다.`,
          facts: { calc: [[`${jn(P)}/(1+${jn(Qv)}/${jn(P)}+(${jn(Qv)}/${jn(P)})**2)*(${jn(Qv)}/${jn(P)})**4`, 0]], derived: [2, 4] }
        });
      }
      if (n === 3) {
        const r = d.pick([2, 3]), a = d.int(1, 4), s = d.int(4, 6), P = a * r + a * r * r, k = d.int(6, 10), v = a * r ** (k - 1);
        if (v > 9999) return null;
        return iA(`모든 항이 양수인 등비수열 ${SEQ}에서 ${eq(nb(`${A(2)} + ${A(3)}`), String(P))}, ${eq(nb(`${r * r}${A(s)}`), A(s + 2))}일 때, ${A(k)}의 값은?`, v, {
          explain: `${eq(A(s + 2), nb(`${RV}${sup(2)}${A(s)}`))}이므로 ${eq(RV + sup(2), String(r * r))}, 모든 항이 양수이므로 ${eq(RV, String(r))}이다. ${eq(nb(`${A(1)}(${r} + ${r * r})`), String(P))}에서 ${eq(A(1), String(a))}이므로 ${eq(A(k), nb(`${a} × ${r}${sup(k - 1)}`))} = ${v}이다.`,
          facts: { calc: [[`${P}/(${r}+${r * r})*${r}**(${k}-1)`, 0]], derived: [r] }
        });
      }
      if (n === 4) {
        const s = d.pick([2, 3]), c = d.int(1, 3), int1 = c * s, int4 = c * s * s;
        const sumH = (iPart, rCoef) => nb(`${iPart} + ${radText(rCoef, s)}`);
        return radAns(`등비수열 ${SEQ}에서 ${eq(nb(`${A(1)} + ${A(2)}`), sumH(int1, c))}, ${eq(nb(`${A(4)} + ${A(5)}`), sumH(int4, int4))}일 때, ${A(3)}의 값은?`, c * s, s, {
          explain: `${eq(nb(`${A(4)} + ${A(5)}`), nb(`${RV}${sup(3)}(${A(1)} + ${A(2)})`))}이므로 ${eq(RV + sup(3), radText(s, s))}이고 ${RV}는 실수이므로 ${eq(RV, rt(s))}이다. ${eq(nb(`${A(1)}(1 + ${rt(s)})`), sumH(int1, c))}에서 ${eq(A(1), radText(c, s))}이므로 ${eq(A(3), nb(`${radText(c, s)} × ${s}`))} = ${radText(c * s, s)}이다.`,
          facts: { calc: [[`${int4}/${s}`, 0], [String(s), 1]] }
        });
      }
      const r = d.pick([-3, -2, 2, 3, 4]), R = r ** 3, k = d.int(2, 4);
      const top = range(k + 3, k + 5).map(A).join(' + '), bot = range(k, k + 2).map(A).join(' + ');
      return iA(`등비수열 ${SEQ}에서 ${eq(frac(nb(top), nb(bot)), iq(R))}일 때, 수열 ${SEQ}의 공비는?`, r, {
        explain: `분자의 각 항은 분모의 같은 자리의 항에 ${RV}${sup(3)}을 곱한 것이므로 ${eq(RV + sup(3), iq(R))}이고, ${RV}는 실수이므로 ${eq(RV, iq(r))}이다.`,
        facts: { range: { ineq: `x*x*x<${R}+1`, lo: -20, hi: 30, want: 'max' } }
      });
    }, { count: 6 }),
    T('geo-quad', '한 항과 묶음 합으로 공비', '②10', (d, n) => {
      if (n === 0) {
        const c = nz(d, -6, 6), k = d.int(5, 9), v = c * (-2) ** (k - 1), S = -c;
        if (Math.abs(v) > 9999) return null;
        return iA(`등비수열 ${SEQ}에서 ${eq(nb(`${A(1)} + ${A(2)}`), iq(S))}, ${eq(A(3), iq(4 * c))}일 때, ${A(k)}의 값은?`, v, {
          explain: `첫째항을 ${AV}, 공비를 ${RV}라고 하면 ${eq(nb(`${AV}(1 + ${RV})`), iq(S))}, ${eq(nb(`${AV}${RV}${sup(2)}`), iq(4 * c))}이다. 나누면 ${eq(frac(RV + sup(2), nb(`1 + ${RV}`)), iq(-4))}, ${eq(nb(`(${RV} + 2)${sup(2)}`), '0')}이므로 ${eq(RV, iq(-2))}, ${eq(AV, iq(c))}이다. 따라서 ${eq(A(k), nb(`${iq(c)} × (${MINUS}2)${sup(k - 1)}`))} = ${iq(v)}이다.`,
          facts: { calc: [[`(0-${jn(S)})*(-2)**(${k}-1)`, 0]], derived: [2] }
        });
      }
      const r = d.pick([2, 3]), a1 = d.pick([Q(1, r * r), Q(1, r), Q(1), Q(2), Q(1, 4)]), P = qadd(geoQ(a1, r, 2), geoQ(a1, r, 3)), k = d.int(4, 8), v = geoQ(a1, r, k);
      if (!isInt(v) || v.p > 9999 || (r === 3 && a1.q === 4)) return null;
      return iA(`모든 항이 양수인 등비수열 ${SEQ}에 대하여 ${eq(A(1), qq(a1))}, ${eq(nb(`${A(2)} + ${A(3)}`), qq(P))}일 때, ${A(k)}의 값은?`, v.p, {
        explain: `공비를 ${RV}라고 하면 ${eq(nb(`${qq(a1)}${RV} + ${qq(a1)}${RV}${sup(2)}`), qq(P))}이다. 정리하면 ${eq(nb(`(${RV} − ${r})(${RV} + ${r + 1})`), '0')}이고 모든 항이 양수이므로 ${eq(RV, String(r))}이다. 따라서 ${eq(A(k), nb(`${qq(a1)} × ${r}${sup(k - 1)}`))} = ${v.p}이다.`,
        facts: { calc: [[`${r}**(${k}-1)/${a1.q}*${a1.p}`, 0]], derived: [r, a1.q] }
      });
    }, { count: 2 }),
    T('geo-prod', '곱 조건으로 공비·첫째항', '②11', (d) => {
      const a = d.int(1, 4), r = d.pick([2, 3]), n0 = d.int(4, 8), P = a * a * r * r, Qv = a * a * r ** 4, S = (a * (r ** n0 - 1)) / (r - 1);
      if (S > 9999 || Qv > 9999) return null;
      return iA(`모든 항이 양수인 등비수열 ${SEQ}에서 ${eq(nb(`${A(1)}${A(3)}`), String(P))}, ${eq(nb(`${A(2)}${A(4)}`), String(Qv))}일 때, 수열 ${SEQ}의 첫째항부터 제${n0}항까지의 합은?`, S, {
        explain: `첫째항을 ${AV}, 공비를 ${RV}라고 하면 ${eq(nb(`${AV}${sup(2)}${RV}${sup(2)}`), String(P))}, ${eq(nb(`${AV}${sup(2)}${RV}${sup(4)}`), String(Qv))}이므로 ${eq(RV + sup(2), String(r * r))}이다. 모든 항이 양수이므로 ${eq(RV, String(r))}, ${eq(AV, String(a))}이고, 합은 ${frac(nb(`${a}(${r}${sup(n0)} − 1)`), r - 1)} = ${S}이다.`,
        facts: { calc: [[`${a}*(${r}**${n0}-1)/(${r}-1)`, 0]], derived: [a, r] }
      });
    }),
    T('geo-vieta', '근과 계수의 관계와 등비수열', '②12', (d) => {
      const c = d.pick([1, 2, 4]), p = d.pick([1, 2]), qv = -d.int(1, 5), k = d.pick([5, 7, 9]), ak = c * 2 ** ((k - 1) / 2);
      if (ak % p !== 0 || (2 * qv) % p !== 0) return null;
      const v = (ak / p) ** 2 - (2 * qv) / p, X = V('x'), al = ms('α_n'), be = ms('β_n');
      if (v > 9999) return null;
      return iA(`첫째항이 ${c}, 공비가 ${rt(2)}인 등비수열 ${SEQ}에 대하여 이차방정식 ${nb(`${p === 1 ? '' : p}${X}${sup(2)} − ${AN}${X} ${MINUS} ${-qv} = 0`)}의 두 근을 ${al}, ${be}이라고 할 때, ${nb(`${ms(`α_${k}^2`)} + ${ms(`β_${k}^2`)}`)}의 값은?`, v, {
        explain: `${eq(A(k), nb(`${c} × (${rt(2)})${sup(k - 1)}`))} = ${ak}이다. 근과 계수의 관계에 의하여 ${eq(nb(`${ms(`α_${k}`)} + ${ms(`β_${k}`)}`), qq(Q(ak, p)))}, ${eq(nb(`${ms(`α_${k}`)}${ms(`β_${k}`)}`), qq(Q(qv, p)))}이므로 구하는 값은 ${nb(`${pwQ(Q(ak, p), 2)} − 2 × (${qq(Q(qv, p))})`)} = ${v}이다.`,
        facts: { calc: [[`(${ak}/${p})**2+2*${-qv}/${p}`, 0]], derived: [ak, 2] }
      });
    }),
    T('geo-growth', '일정한 시간마다 같은 비율로 늘어나는 양', '②13', (d) => {
      const [u, w] = d.pick([[3, 2], [2, 1], [4, 3], [5, 4], [5, 3], [3, 1]]), k = d.int(1, 20), Tm = d.pick([2, 3, 5, 10]);
      const N1 = k * u * w, N2 = k * u * u, N3 = (k * u ** 3) / w;
      if (!Number.isInteger(N3) || N3 > 9999) return null;
      return nA(`어떤 세균의 수는 일정한 시간마다 일정한 비율로 늘어난다고 한다. 이 세균이 지금부터 ${Tm}시간 후에는 ${N1}마리, ${2 * Tm}시간 후에는 ${N2}마리가 되었다. 지금부터 ${3 * Tm}시간 후에는 몇 마리가 되는가?`, N3, {
        unit: '마리',
        explain: `${Tm}시간마다 같은 비율로 늘어나므로 ${N1}, ${N2}, (${3 * Tm}시간 후의 수)는 이 순서대로 등비수열을 이룬다. 등비중항에 의하여 ${eq(`${N2}${sup(2)}`, `${N1} × (${3 * Tm}시간 후의 수)`)}이므로 ${N3}마리이다.`,
        facts: { calc: [[`${N2}*${N2}/${N1}`, 0]] }
      });
    }),
    T('geo-pop', '일정한 비율로 줄어드는 인구', '②15', (d, n) => {
      const p = d.pick([1, 2, 3, 5]), rv = (100 - p) / 100, logs = { 1: '0.0044', 2: '0.0088', 3: '0.0132', 5: '0.0223' }, L = Number(logs[p].slice(2));
      if (n === 0) {
        const A0 = d.int(20, 90) * 100, B0 = Math.round(A0 * rv ** 10);
        return nA(`어느 도시의 인구는 2020년에 ${A0}명이었고, 해마다 일정한 비율로 줄어 2030년에는 ${B0}명이 되었다. 이 도시의 인구는 해마다 몇 %씩 줄었는가? (단, ${eq(rtn(10, frac(B0, A0)), rv.toFixed(2))}${tail(Number(rv.toFixed(2).slice(-1)), '으로/로')} 계산한다.)`, p, {
          unit: '%',
          explain: `해마다 ${RV}배가 된다고 하면 ${eq(nb(`${A0} × ${RV}${sup(10)}`), String(B0))}이므로 ${eq(RV, rtn(10, frac(B0, A0)))} = ${rv.toFixed(2)}이다. 해마다 ${nb(`1 − ${rv.toFixed(2)} = ${(p / 100).toFixed(2)}`)}, 곧 ${p} %씩 줄었다.`,
          facts: { calc: [[`100-${Math.round(rv * 100)}`, 0]], derived: [100] }
        });
      }
      const m = Math.ceil(3010 / L);
      return nA(`어느 도시의 인구가 해마다 ${p} %씩 줄어든다고 할 때, 이 도시의 인구가 처음으로 지금 인구의 절반 이하가 되는 것은 몇 년 후인가? (단, ${eq(lg(null, 2), '0.3010')}, ${eq(lg(null, rv.toFixed(2)), MINUS + logs[p])}${tail(Number(logs[p].slice(-1)), '으로/로')} 계산한다.)`, m, {
        unit: '년 후',
        explain: `지금 인구를 ${AV}라고 하면 ${NV}년 후의 인구는 ${nb(`${AV} × ${rv.toFixed(2)}${sup(NV)}`)}이다. ${nb(`${rv.toFixed(2)}${sup(NV)} ≤ ${frac(1, 2)}`)}의 양변에 상용로그를 취하면 ${nb(`${NV} × (${MINUS}${logs[p]}) ≤ ${MINUS}0.3010`)}, ${nb(`${NV} ≥ ${(3010 / L).toFixed(1)}…`)}이므로 처음으로 절반 이하가 되는 것은 ${m}년 후이다.`,
        facts: { range: { ineq: `x*${L}>${3010 - 1}`, lo: 1, hi: 200, want: 'min' } }
      });
    }, { count: 2 })
  ]);

  // ── 등비수열의 합 ──
  const powSum = (c, r, n) => (c === 1 ? nb(`${r}${sup(n)} − 1`) : nb(`${c}(${r}${sup(n)} − 1)`));
  B.addTypes(UNIT, 'geosum', [
    T('geosum-basic', '첫째항·공비로 등비수열의 합', '②16', (d, n) => {
      if (n === 0) {
        const a = nz(d, -6, 6), r = d.pick([-3, -2, 2, 3]), m = d.int(5, 8), S = geoSQ(a, r, m).p;
        if (Math.abs(S) > 9999) return null;
        return iA(`첫째항이 ${iq(a)}, 공비가 ${iq(r)}인 등비수열의 첫째항부터 제${m}항까지의 합은?`, S, {
          explain: `${eq(SS(m), frac(nb(`${iq(a)}{1 − ${pw0(r, m)}}`), nb(`1 − ${pq(r)}`)))} = ${iq(S)}이다.`,
          facts: { calc: [[`${jn(a)}*(1-(${jn(r)})**${m})/(1-${jn(r)})`, 0]] }
        });
      }
      if (n === 1) {
        const qn = d.pick([2, 3]), a = d.int(1, 9) * qn ** d.int(1, 3), m = d.int(5, 9), r = Q(1, qn), S = geoSQ(a, r, m), t = range(1, 4).map((i) => geoQ(a, r, i));
        if (isInt(S) || S.q > 2000 || a > 500) return null;
        return fA(`등비수열 ${listH(t)}의 첫째항부터 제${m}항까지의 합은?`, S, {
          explain: `첫째항이 ${a}, 공비가 ${frac(1, qn)}이므로 ${eq(SS(m), frac(nb(`${a}{1 − (${frac(1, qn)})${sup(m)}}`), nb(`1 − ${frac(1, qn)}`)))} = ${qq(S)}이다.`,
          facts: { value: `${a}*(1-(1/${qn})**${m})/(1-1/${qn})`, derived: [qn] }
        });
      }
      if (n === 2) {
        const r = d.pick([2, 3, 4, 5]), c = d.int(1, 3), a = c * (r - 1), m = d.int(7, 10);
        const rows = [[powSum(c, r, m), true], [powSum(c, r, m - 1), false], [powSum(c, r, m + 1), false], [powSum(a, r, m), false], [nb(`${c === 1 ? '' : c}${r}${sup(m)}`), false]];
        const uniq = rows.filter((x, i, all) => all.findIndex((y) => stripH(y[0]) === stripH(x[0])) === i);
        return choose(d, `첫째항이 ${a}, 공비가 ${r}인 등비수열의 첫째항부터 제${m}항까지의 합을 나타낸 것은?`, [uniq[0]].concat(d.shuffle(uniq.slice(1)).slice(0, 3)), {
          // 틀린 보기: 지수를 하나 덜 센 아이(rⁿ⁻¹), 하나 더 센 아이(rⁿ⁺¹), r − 1로 나누지 않은 아이, rⁿ − 1의 − 1을 빠뜨린 아이
          explain: `${eq(SS(m), frac(nb(`${a}(${r}${sup(m)} − 1)`), `${r} − 1`))} = ${powSum(c, r, m)}이다.`
        });
      }
      if (n === 3) {
        const qn = d.pick([2, 3, 4]), c = d.int(1, 4) * (qn - 1), a = (c * (qn - 1)) / qn, m = d.int(6, 9);
        if (!Number.isInteger(a)) return null;
        const h = (k, e, sign) => nb(`${k}{1 ${sign || MINUS} (${frac(1, qn)})${sup(e)}}`);
        const rows = [[h(c, m), true], [h(c, m - 1), false], [h(a, m), false], [h(c, m, '+'), false], [h(c, m + 1), false]];
        const pick = [rows[0]].concat(d.shuffle(rows.slice(1)).slice(0, 3));
        return choose(d, `첫째항이 ${a}, 공비가 ${frac(1, qn)}인 등비수열의 첫째항부터 제${m}항까지의 합을 나타낸 것은?`, pick, {
          // 틀린 보기: 지수를 하나 덜 센 아이, 1 − r 로 나누지 않은 아이, 부호를 바꾼 아이, 지수를 하나 더 센 아이
          explain: `${eq(SS(m), frac(nb(`${a}{1 − (${frac(1, qn)})${sup(m)}}`), nb(`1 − ${frac(1, qn)}`)))} = ${h(c, m)}이다.`
        });
      }
      const s = d.pick([2, 3]), a = d.int(1, 4), m = d.pick([4, 6, 8]), K = (a * (s ** (m / 2) - 1)) / (s - 1), t = [String(a), radText(a, s), String(a * s)];
      if (!Number.isInteger(K) || K > 9999) return null;
      return inline(`등비수열 ${t.join(', ')}, …의 첫째항부터 제${m}항까지의 합은?`, '{0} {1}' + rt('{2}'), [{ answer: K, signed: true }, { answer: K, signed: true }, { answer: s }], {
        shown: nb(`${K} + ${radText(K, s)}`),
        explain: `첫째항이 ${a}, 공비가 ${rt(s)}이므로 ${eq(SS(m), frac(nb(`${a}{(${rt(s)})${sup(m)} − 1}`), nb(`${rt(s)} − 1`)))} = ${frac(String(a * (s ** (m / 2) - 1)), nb(`${rt(s)} − 1`))} = ${K}(${rt(s)} + 1)이다.`,
        facts: { calc: [[`${a}*(${s}**(${m}/2)-1)/(${s}-1)`, 0], [`${a}*(${s}**(${m}/2)-1)/(${s}-1)`, 1], [String(s), 2]], derived: [2, 1] }
      });
    }, { count: 5 }),
    T('geosum-two', '첫째항과 다른 한 항으로 합', '②17', (d, n) => {
      if (n === 0) {
        const a = d.int(1, 6) * (d.bool() ? 1 : -1), r = d.pick([2, 3, -2, -3]), k = d.pick([4, 6]), ak = a * r ** (k - 1), m = d.int(5, 8), S = geoSQ(a, r, m).p;
        if (Math.abs(S) > 9999 || Math.abs(ak) > 9999) return null;
        return iA(`첫째항이 ${iq(a)}, 제${k}항이 ${iq(ak)}인 등비수열의 첫째항부터 제${m}항까지의 합은?`, S, {
          explain: `공비를 ${RV}라고 하면 ${eq(nb(`${cv(a, RV)}${sup(k - 1)}`), iq(ak))}, ${eq(RV + sup(k - 1), iq(r ** (k - 1)))}이고 ${RV}는 실수이므로 ${eq(RV, iq(r))}이다. 따라서 합은 ${frac(nb(`${iq(a)}{1 − ${pw0(r, m)}}`), nb(`1 − ${pq(r)}`))} = ${iq(S)}이다.`,
          facts: { calc: [[`${jn(a)}*(1-(${jn(r)})**${m})/(1-${jn(r)})`, 0]], derived: [Math.abs(r)] }
        });
      }
      const r = d.pick([2, 3]), k = d.int(4, 6), base = d.pick([r, r * r]), e = base === r ? k - 1 : (k - 1) / 2, m = d.int(5, 9), S = (r ** m - 1) / (r - 1);
      if (!Number.isInteger(e) || S > 9999) return null;
      return iA(`모든 항이 양수이고 첫째항이 1인 등비수열 ${SEQ}에 대하여 ${eq(lg(base, A(k)), String(e))}일 때, 수열 ${SEQ}의 첫째항부터 제${m}항까지의 합은?`, S, {
        explain: `${eq(A(k), `${base}${sup(e)}`)} = ${r ** (k - 1)}이므로 ${eq(RV + sup(k - 1), String(r ** (k - 1)))}, 모든 항이 양수이므로 ${eq(RV, String(r))}이다. 합은 ${frac(nb(`${r}${sup(m)} − 1`), `${r} − 1`)} = ${S}이다.`,
        facts: { calc: [[`(${r}**${m}-1)/(${r}-1)`, 0]], derived: [r] }
      });
    }, { count: 2 }),
    T('geosum-ss', '두 합으로 첫째항·공비', '②18', (d, n) => {
      if (n === 0) {
        const a = nz(d, -5, 6), r = d.pick([2, 3, -2]), S3 = geoSQ(a, r, 3).p, S6 = geoSQ(a, r, 6).p;
        if (Math.abs(S6) > 9999) return null;
        return namedQ(`첫째항부터 제3항까지의 합이 ${iq(S3)}, 첫째항부터 제6항까지의 합이 ${iq(S6)}인 등비수열의 첫째항과 공비는?`, [['첫째항', a], ['공비', r]], {
          explain: `공비가 1이면 ${eq(SS(6), nb(`2${SS(3)}`))}이어야 하므로 공비는 1이 아니다. ${eq(frac(SS(6), SS(3)), nb(`1 + ${RV}${sup(3)}`))}이므로 ${eq(RV + sup(3), iq(r ** 3))}, ${eq(RV, iq(r))}이고, ${eq(nb(`${AV}(1 + ${RV} + ${RV}${sup(2)})`), iq(S3))}에서 첫째항은 ${iq(a)}이다.`,
          facts: { calc: [[`${jn(S3)}/(1+${jn(r)}+${jn(r)}*${jn(r)})`, 0], [jn(r), 1]], derived: [Math.abs(r)] }
        });
      }
      const r = d.pick([2, 3]), sumR = (r ** 4 - 1) / (r - 1), ws = range(2, 40).filter((w) => sumR % w === 0), w = d.pick(ws), u = d.int(1, 3), a = Q(u, w);
      if (isInt(a)) return null;
      const S4 = geoSQ(a, r, 4), S8 = geoSQ(a, r, 8);
      if (!isInt(S4) || !isInt(S8) || S8.p > 9999) return null;
      return inline(`모든 항이 양수이고 첫째항부터 제4항까지의 합이 ${S4.p}, 첫째항부터 제8항까지의 합이 ${S8.p}인 등비수열의 첫째항과 공비는?` + NOTEF, `첫째항 ${frac('{0}', '{1}')}, 공비 {2}`, [{ answer: a.p, signed: true }, { answer: a.q }, { answer: r, signed: true }], {
        shown: `첫째항 ${qq(a)}, 공비 ${r}`,
        explain: `${eq(frac(SS(8), SS(4)), nb(`1 + ${RV}${sup(4)}`))}이므로 ${eq(RV + sup(4), String(r ** 4))}이고, 모든 항이 양수이므로 ${eq(RV, String(r))}이다. ${eq(nb(`${AV}(1 + ${r} + ${r * r} + ${r ** 3})`), String(S4.p))}에서 ${eq(AV, qq(a))}이다.`,
        facts: { calc: [[`${S4.p}*${a.q}/${sumR}`, 0], [String(a.q), 1], [String(r), 2]], derived: [a.q, sumR, r] }
      });
    }, { count: 2 }),
    T('geosum-chunk', '앞 묶음의 합으로 다음 묶음의 합', '②19', (d, n) => {
      if (n === 0) {
        const k = d.pick([2, 3, 4]), a = nz(d, -4, 5), r = d.pick([2, 3, -2]), Sk = geoSQ(a, r, k).p, S2k = geoSQ(a, r, 2 * k).p, S3k = geoSQ(a, r, 3 * k).p;
        if (Math.abs(S3k) > 9999 || Sk === 0) return null;
        return iA(`등비수열 ${SEQ}의 첫째항부터 제${k}항까지의 합이 ${iq(Sk)}, 첫째항부터 제${2 * k}항까지의 합이 ${iq(S2k)}일 때, 첫째항부터 제${3 * k}항까지의 합은?`, S3k, {
          explain: `${k}개의 항씩 묶은 합은 공비가 ${RV}${sup(k)}인 등비수열을 이룬다. ${eq(frac(nb(`${SS(2 * k)} − ${SS(k)}`), SS(k)), iq((S2k - Sk) / Sk))}이므로 제${2 * k + 1}항부터 제${3 * k}항까지의 합은 ${nb(`${pq(S2k - Sk)} × ${pq((S2k - Sk) / Sk)}`)} = ${iq(((S2k - Sk) * (S2k - Sk)) / Sk)}이고, 구하는 합은 ${iq(S3k)}이다.`,
          facts: { calc: [[`${jn(Sk)}*(1+(${jn(S2k)}/${jn(Sk)}-1)+(${jn(S2k)}/${jn(Sk)}-1)**2)`, 0]], derived: [2] }
        });
      }
      const k = d.pick([3, 5, 10]), R = d.pick([2, 3, 4]), P = d.int(2, 20) * 5, Qv = P * R, v = Qv * R;
      if (v > 9999) return null;
      return iA(`공비가 양수인 등비수열 ${SEQ}의 첫째항부터 제${k}항까지의 합이 ${P}, 제${k + 1}항부터 제${2 * k}항까지의 합이 ${Qv}일 때, 제${2 * k + 1}항부터 제${3 * k}항까지의 합은?`, v, {
        explain: `제${k + 1}항부터 제${2 * k}항까지의 각 항은 첫째항부터 제${k}항까지의 같은 자리의 항에 ${RV}${sup(k)}을 곱한 것이므로 ${eq(RV + sup(k), `${Qv} ÷ ${P}`)} = ${R}이다. 따라서 구하는 합은 ${Qv} × ${R} = ${v}이다.`,
        facts: { calc: [[`${Qv}*${Qv}/${P}`, 0]] }
      });
    }, { count: 2 }),
    T('geosum-rel', '합 사이의 관계식으로 공비', '②20', (d, n) => {
      if (n === 0) {
        const p = d.pick([2, 3]), r = d.pick([2, 3, -2]), q = 1 - (p - 1) * r ** 3, k = d.pick([4, 7]), v = r ** (k - 1);
        if (Math.abs(v) > 9999) return null;
        const rhs = nb(`(${p}${A(4)} ${q < 0 ? MINUS + ' ' + -q : '+ ' + q})${SS(3)}`);
        return iA(`첫째항이 1인 등비수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${jh(eq(SS(6), rhs), '을/를')} 만족시킬 때, ${A(k)}의 값은?`, v, {
          explain: `공비를 ${RV}라고 하면 ${RV} ≠ 1이고 ${eq(SS(6), nb(`(1 + ${RV}${sup(3)})${SS(3)}`))}, ${eq(A(4), RV + sup(3))}이므로 ${eq(nb(`1 + ${RV}${sup(3)}`), nb(`${p}${RV}${sup(3)} ${q < 0 ? MINUS + ' ' + -q : '+ ' + q}`))}, ${eq(RV + sup(3), iq(r ** 3))}이다. ${eq(RV, iq(r))}이므로 ${eq(A(k), pw0(r, k - 1))} = ${iq(v)}이다.`,
          facts: { calc: [[`((1-${jn(q)})/(${p}-1))**((${k}-1)/3)`, 0]], derived: [3] }
        });
      }
      const k = d.pick([3, 4, 5, 6]), m = d.pick([3, 4, 5]), v = m * (1 + (m - 1) ** 2);
      return iA(`첫째항이 ${AV}, 공비가 ${RV}인 등비수열의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${jh(eq(SS(2 * k), nb(`${m}${SS(k)}`)), '을/를')} 만족시킬 때, ${frac(SS(4 * k), SS(k))}의 값은? (단, ${AV} ≠ 0, ${RV} ≠ 1)`, v, {
        explain: `${eq(SS(2 * k), nb(`(1 + ${RV}${sup(k)})${SS(k)}`))}이므로 ${eq(nb(`1 + ${RV}${sup(k)}`), String(m))}, ${eq(RV + sup(k), String(m - 1))}이다. ${eq(SS(4 * k), nb(`(1 + ${RV}${sup(k)})(1 + ${RV}${sup(2 * k)})${SS(k)}`))}이므로 구하는 값은 ${m} × ${1 + (m - 1) ** 2} = ${v}이다.`,
        facts: { calc: [[`${m}*(1+(${m}-1)**2)`, 0]], derived: [2] }
      });
    }, { count: 2 }),
    T('geosum-first', '합이 처음으로 k보다 커지는 항의 수', '②21', (d, n) => {
      if (n === 0) {
        const qn = d.pick([2, 3, 10]), Vv = d.pick([100, 1000]), a = Q(qn - 1, qn), m = range(1, 60).find((x) => qn ** x > Vv);
        if (range(1, 60).some((x) => qn ** x === Vv)) return null;
        return termA(`첫째항이 ${qq(a)}, 공비가 ${frac(1, qn)}인 등비수열에서 첫째항부터 제몇 항까지의 합이 처음으로 ${frac(Vv - 1, Vv)}보다 커지는가?`, m, {
          explain: `${eq(SN, nb(`1 − (${frac(1, qn)})${sup(NV)}`))}이다. ${nb(`1 − (${frac(1, qn)})${sup(NV)} &gt; ${frac(Vv - 1, Vv)}`)}에서 ${nb(`${qn}${sup(NV)} &gt; ${Vv}`)}이고, 가장 작은 자연수 ${jh(NV, '은/는')} ${m}이므로 제${m}항까지이다.`,
          facts: { range: { ineq: `${qn}**x>${Vv}`, lo: 1, hi: 60, want: 'min' } }
        });
      }
      const c = d.int(2, 10), r = d.pick([2, 3]), Tv = d.pick([1000, 2000, 5000, 10000]), m = range(1, 60).find((x) => (c * (r ** x - 1)) / (r - 1) > Tv), snH = r === 2 ? nb(`${c}(${r}${sup(NV)} − 1)`) : frac(nb(`${c}(${r}${sup(NV)} − 1)`), r - 1);
      if (range(1, 60).some((x) => (c * (r ** x - 1)) / (r - 1) === Tv) || m < 4) return null;
      return termA(`첫째항이 ${c}, 공비가 ${r}인 등비수열에서 첫째항부터 제몇 항까지의 합이 처음으로 ${Tv}보다 커지는가?`, m, {
        explain: `${eq(SN, snH)}이다. ${nb(`${snH} &gt; ${josa2(Tv, '을/를')}`)} 만족시키는 가장 작은 자연수 ${jh(NV, '은/는')} ${m}이므로 제${m}항까지이다.`,
        facts: { range: { ineq: `${c}*(${r}**x-1)>${Tv}*(${r}-1)`, lo: 1, hi: 60, want: 'min' } }
      });
    }, { count: 2 }),
    T('geosum-findm', '첫째항·끝항·합으로 항의 수', '②22', (d) => {
      const qn = d.pick([2, 3]), up = d.bool(), m = d.int(5, 8), l0 = d.int(1, 6), MV = V('m');
      const a = up ? l0 : l0 * qn ** (m - 1), l = up ? l0 * qn ** (m - 1) : l0, r = up ? Q(qn) : Q(1, qn), S = geoSQ(a, r, m).p;
      if (S > 9999 || Math.max(a, l) > 9999) return null;
      return nA(`첫째항이 ${a}, 제${MV}항이 ${l}인 등비수열의 첫째항부터 제${MV}항까지의 합이 ${S}일 때, 자연수 ${MV}의 값은?`, m, {
        explain: `공비를 ${RV}라고 하면 ${eq(nb(`${cv(a, RV)}${sup(ms('m-1'))}`), String(l))}이고 ${eq(frac(nb(`${a} − ${l}${RV}`), nb(`1 − ${RV}`)), String(S))}에서 ${eq(RV, qq(r))}이다. ${eq(nb(`${a === 1 ? '' : a + ' × '}${pwQ(r, ms('m-1'))}`), String(l))}에서 ${eq(MV, String(m))}이다.`,
        facts: { range: { ineq: up ? `${a}*${qn}**(x-1)<${l}+1` : `${l}*${qn}**(x-1)<${a}+1`, lo: 1, hi: 40, want: 'max' } }
      });
    })
  ]);

  // ── 수열의 합과 일반항의 관계 ──
  B.addTypes(UNIT, 'snan', [
    T('snan-term', 'Sₙ으로 한 항', '②25', (d, n) => {
      const k = d.int(4, 12);
      let h, f, js;
      if (n === 0) { const p = nz(d, -4, 4), q = d.int(-9, 9), c = d.int(-5, 5); h = poly([[p, NV + sup(2)], [q, NV], [c, '']]); f = (x) => p * x * x + q * x + c; js = (x) => `${jn(p)}*${x}*${x}+${jn(q)}*${x}`; }
      else if (n === 1) { const b = d.pick([2, 3]), e = d.int(0, 1), c = d.int(1, 5); h = nb(`${b}${sup(e ? ms('n+1') : NV)} ${MINUS} ${c}`); f = (x) => b ** (x + e) - c; js = (x) => `${b}**(${x}+${e})`; }
      else { const c = d.int(1, 3); h = nb(`${NV}(${NV} + 1)(${NV} + ${c + 1})`); f = (x) => x * (x + 1) * (x + c + 1); js = (x) => `${x}*(${x}+1)*(${x}+${c + 1})`; }
      const v = f(k) - f(k - 1);
      if (Math.abs(v) > 9999) return null;
      return iA(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${eq(SN, h)}일 때, ${A(k)}의 값은?`, v, {
        explain: `${eq(A(k), nb(`${SS(k)} − ${SS(k - 1)}`))} = ${nb(`${pq(f(k))} − ${pq(f(k - 1))}`)} = ${iq(v)}이다.`,
        facts: { calc: [[`${js(k)}-(${js(k - 1)})`, 0]], derived: [k - 1, 1, 2] }
      });
    }, { count: 3 }),
    T('snan-gen', 'Sₙ으로 일반항', '②26', (d, n) => {
      if (n === 0) {
        const p = nz(d, -4, 4), q = d.int(-8, 8);
        if (q - p === 0 || p === 0) return null;
        return linT(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${eq(SN, poly([[p, NV + sup(2)], [q, NV]]))}일 때, 일반항 ${jh(AN, '은/는')}?`, 2 * p, q - p, {
          explain: `${NV} ≥ 2일 때 ${eq(AN, nb(`${SN} − ${SS('n-1')}`))} = ${lin(2 * p, q - p, NV)}이고, ${eq(A(1), nb(`${SS(1)} = ${iq(p + q)}`))}도 이 식에 ${eq(NV, '1')}을 넣은 값과 같다. 따라서 ${eq(AN, lin(2 * p, q - p, NV))}이다.`,
          facts: { calc: [[`2*${jn(p)}`, 0], [`${jn(q)}-${jn(p)}`, 1]], derived: [2] }
        });
      }
      const b = d.pick([2, 3, 4, 5]), e = d.int(0, 1), K = (d.bool() ? 1 : -1) * d.int(1, 4), c0 = K * b ** e * (b - 1), lead = K * b ** e;
      const h = K > 0 ? nb(`${K === 1 ? '' : K + ' × '}${b}${sup(e ? ms('n+1') : NV)} ${MINUS} ${lead}`) : nb(`${-lead} ${MINUS} ${-K === 1 ? '' : -K + ' × '}${b}${sup(e ? ms('n+1') : NV)}`);
      if (Math.abs(c0) > 9999) return null;
      return geoT(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${eq(SN, h)}일 때, 일반항 ${jh(AN, '은/는')}?`, c0, b, {
        explain: `${NV} ≥ 2일 때 ${eq(AN, nb(`${SN} − ${SS('n-1')}`))} = ${gH(c0, b)}이고, ${eq(A(1), SS(1))} = ${iq(c0)}도 이 식에 맞는다. 따라서 ${eq(AN, gH(c0, b))}이다.`,
        facts: { calc: [[`${K}*${b}**${e}*(${b}-1)`, 0], [String(b), 1]], derived: [K, Math.abs(K), e, 1] }
      });
    }, { count: 2 }),
    T('snan-pq', 'Sₙ = pn² + qn이면 등차수열', '②28', (d, n) => {
      const P = V('p'), Qq = V('q'), sn = eq(SN, nb(`${P}${NV}${sup(2)} + ${Qq}${NV}`));
      const note = `(단, ${P}, ${Qq}는 상수이고, ${P} ≠ 0이다.)`;
      if (n === 0) {
        return choose(d, `수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합이 ${sn}일 때, 수열 ${SEQ}의 공차는? ${note}`, [[`2${P}`, true], [P, false], [nb(`${P} + ${Qq}`), false], [nb(`2${P} + ${Qq}`), false], [nb(`${Qq} − ${P}`), false]].slice(0, 5), {
          explain: `${eq(AN, nb(`${SN} − ${SS('n-1')}`))} = ${nb(`2${P}${NV} − ${P} + ${Qq}`)}이고 ${eq(A(1), SS(1))} = ${nb(`${P} + ${Qq}`)}도 이 식에 맞는다. ${eq(nb(`${A('n+1')} − ${AN}`), `2${P}`)}이므로 공차는 ${nb(`2${P}`)}이다.`
        });
      }
      return choose(d, `수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합이 ${sn}일 때, 일반항 ${jh(AN, '은/는')}? ${note}`, [[eq(AN, nb(`2${P}${NV} − ${P} + ${Qq}`)), true], [eq(AN, nb(`2${P}${NV} + ${Qq}`)), false], [eq(AN, nb(`${P}${NV} + ${Qq}`)), false], [eq(AN, nb(`2${P}${NV} + ${P} + ${Qq}`)), false]], {
        // 틀린 보기: (n − 1)² 을 n² − 1 로 푼 아이, 미분하듯 계수만 옮긴 아이, 부호를 잘못 옮긴 아이
        explain: `${NV} ≥ 2일 때 ${eq(AN, nb(`${SN} − ${SS('n-1')}`))} = ${nb(`${P}{${NV}${sup(2)} − (${NV} − 1)${sup(2)}} + ${Qq}`)} = ${nb(`2${P}${NV} − ${P} + ${Qq}`)}이고, ${eq(A(1), nb(`${P} + ${Qq}`))}도 이 식에 맞는다.`
      });
    }, { count: 2, standard: S2 }),
    T('snan-rec', 'Sₙ₊₁ − Sₙ으로 일반항', '②29', (d, n) => {
      const c = d.int(1, 4), r = d.pick([2, 3, 4]), a1 = c * r, inc = nb(`${c === 1 ? '' : c + ' × '}${r}${sup(ms('n+1'))}`);
      const text = `첫째항이 ${a1}인 수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} 모든 자연수 ${NV}에 대하여 ${jh(eq(SS('n+1'), nb(`${SN} + ${inc}`)), '을/를')} 만족시킨다.`;
      const why = `${eq(nb(`${SS('n+1')} − ${SN}`), A('n+1'))}이므로 ${eq(A('n+1'), inc)}이고, ${eq(A(1), String(a1))}도 같은 꼴이므로 ${eq(AN, nb(`${c === 1 ? '' : c + ' × '}${r}${sup(NV)}`))}이다.`;
      if (n === 0) {
        return iA(`${text} 수열 ${SEQ}의 공비는?`, r, { explain: `${why} 따라서 수열 ${jh(SEQ, '은/는')} 공비가 ${r}인 등비수열이다.`, facts: { calc: [[String(r), 0]] } });
      }
      const k = d.int(4, 7), v = c * r ** k;
      if (v > 9999) return null;
      return iA(`${text} ${A(k)}의 값은?`, v, { explain: `${why} 따라서 ${eq(A(k), nb(`${c === 1 ? '' : c + ' × '}${r}${sup(k)}`))} = ${v}이다.`, facts: { calc: [[`${c}*${r}**${k}`, 0]] } });
    }, { count: 2 }),
    T('snan-diff', '몇 항의 합을 Sₙ의 차로', '②30', (d, n) => {
      if (n === 0) {
        const p = d.int(0, 3), q = nz(d, -6, 9), k = d.int(5, 12), m = k + d.int(5, 10), f = (x) => p * x * x + q * x, v = f(m) - f(k);
        return iA(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${eq(SN, poly([[p, NV + sup(2)], [q, NV]]))}일 때, ${nb(`${A(k + 1)} + ${A(k + 2)} + … + ${A(m)}`)}의 값은?`, v, {
          explain: `구하는 합은 ${nb(`${SS(m)} − ${SS(k)}`)} = ${nb(`${pq(f(m))} − ${pq(f(k))}`)} = ${iq(v)}이다.`,
          facts: { calc: [[`${p}*${m}*${m}+${jn(q)}*${m}-(${p}*(${k + 1}-1)*(${k + 1}-1)+${jn(q)}*(${k + 1}-1))`, 0]] }
        });
      }
      const c = d.int(1, 3), s = d.int(4, 9), f = (x) => qsub(Q(1), Q(c, x + 1)), v = qsub(f(s + 1), f(s - 1));
      if (isInt(v)) return null;
      return fA(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${eq(SN, nb(`1 − ${frac(c, nb(`${NV} + 1`))}`))}일 때, ${nb(`${A(s)} + ${A(s + 1)}`)}의 값은?`, v, {
        explain: `${eq(nb(`${A(s)} + ${A(s + 1)}`), nb(`${SS(s + 1)} − ${SS(s - 1)}`))} = ${nb(`(1 − ${frac(c, s + 2)}) − (1 − ${frac(c, s)})`)} = ${qq(v)}이다.`,
        facts: { value: `${c}/${s}-${c}/(${s}+2)`, derived: [2] }
      });
    }, { count: 2 }),
    T('snan-ineq', 'Sₙ에서 일반항을 구해 부등식', '②31', (d) => {
      const p = d.int(1, 3), q = d.int(-6, 4), Vv = d.pick([50, 100, 150, 200]), f = (x) => 2 * p * x - p + q;
      const m = range(1, 300).filter((x) => f(x) < Vv).pop();
      if (!m || m < 5 || f(m + 1) === Vv) return null;
      return nA(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${eq(SN, poly([[p, NV + sup(2)], [q, NV]]))}일 때, ${nb(`${AN} &lt; ${josa2(Vv, '을/를')}`)} 만족시키는 자연수 ${NV}의 최댓값은?`, m, {
        explain: `${eq(AN, nb(`${SN} − ${SS('n-1')}`))} = ${lin(2 * p, q - p, NV)}(${eq(A(1), SS(1))}도 맞는다)이다. ${nb(`${lin(2 * p, q - p, NV)} &lt; ${josa2(Vv, '을/를')}`)} 만족시키는 가장 큰 자연수는 ${m}이다.`,
        facts: { range: { ineq: `2*${p}*x-${p}+${jn(q)}<${Vv}`, lo: 1, hi: 300, want: 'max' } }
      });
    }),
    T('snan-alt', 'Sₙ에서 일반항을 구해 번갈아 더하고 빼기', '②32', (d) => {
      const p = d.int(1, 3), q = d.int(-3, 3), s = d.int(2, 4), pairs = d.int(2, 4), v = -2 * p * pairs;
      const terms = range(s, s + 2 * pairs - 1).map((i, j) => (j === 0 ? A(i) : (j % 2 ? ' − ' : ' + ') + A(i))).join('');
      return iA(`수열 ${SEQ}의 첫째항부터 제${NV}항까지의 합 ${jh(SN, '이/가')} ${eq(SN, poly([[p, NV + sup(2)], [q, NV]]))}일 때, ${nb(terms)}의 값은?`, v, {
        explain: `${eq(AN, lin(2 * p, q - p, NV))}이므로 이웃한 두 항의 차 ${eq(nb(`${AN} − ${A('n+1')}`), iq(-2 * p))}이다. 묶음이 ${pairs}개이므로 ${iq(-2 * p)} × ${pairs} = ${iq(v)}이다.`,
        facts: { calc: [[`0-2*${p}*${pairs}`, 0]], derived: [2, pairs] }
      });
    })
  ]);

  // ── 등차수열과 등비수열을 함께 ──
  B.addTypes(UNIT, 'mix', [
    T('mix-both', '등차중항과 등비중항이 함께 주어진 두 수', '②34', (d, n) => {
      const X = V('a'), Y = V('b');
      if (n === 0) {
        const u = d.int(1, 12), w = d.int(1, 20);
        if (u >= w || (u + w) % 2 !== 0) return null;
        const [k, c] = (() => { let a = 1, b = u * w; for (let t = 2; t * t <= b; t += 1) while (b % (t * t) === 0) { a *= t; b /= t * t; } return [a, b]; })();
        if (c === 1) return null;
        const m = (u + w) / 2, v = (u + w) ** 2 - 2 * u * w;
        return iA(`${josa2(m, '은/는')} 두 수 ${X}와 ${Y}의 등차중항이고 ${jh(radText(k, c), '은/는')} 두 수 ${X}와 ${Y}의 등비중항일 때, ${nb(`${X}${sup(2)} + ${Y}${sup(2)}`)}의 값은?`, v, {
          explain: `${eq(nb(`${X} + ${Y}`), `2 × ${m}`)} = ${u + w}, ${eq(nb(`${X}${Y}`), `(${radText(k, c)})${sup(2)}`)} = ${u * w}이므로 ${eq(nb(`${X}${sup(2)} + ${Y}${sup(2)}`), nb(`${u + w}${sup(2)} − 2 × ${u * w}`))} = ${v}이다.`,
          facts: { calc: [[`4*${m}*${m}-2*${k}*${k}*${c}`, 0]], derived: [4, 2] }
        });
      }
      const qv = d.int(4, 30), a1 = d.int(1, 2 * qv - 1), a2 = 2 * qv - a1;
      if (a1 >= a2 || (a1 * a2) % qv !== 0) return null;
      const p = (a1 * a2) / qv, ok = [a1, a2].filter((x) => 2 * x - p > x && x > 0);
      if (ok.length !== 1 || p <= 0) return null;
      const a = ok[0], b = 2 * a - p;
      return valsQ(`${X}는 ${Y}와 ${p}의 등차중항이면서 ${Y}와 ${qv}의 등비중항이다. ${nb(`${Y} &gt; ${X} &gt; 0`)}일 때, ${X}, ${Y}의 값은?`, [[X, a], [Y, b]], {
        explain: `${eq(nb(`2${X}`), nb(`${Y} + ${p}`))}, ${eq(X + sup(2), nb(`${qv}${Y}`))}에서 ${eq(nb(`${X}${sup(2)} − ${2 * qv}${X} + ${qv * p}`), '0')}, ${eq(X, `${a1}`)} 또는 ${eq(X, `${a2}`)}이다. ${nb(`${Y} &gt; ${X} &gt; 0`)}을 만족시키는 것은 ${eq(X, String(a))}, ${eq(Y, String(b))}뿐이다.`,
        facts: { range: { ineq: `x*x-2*${qv}*x+${qv}*${p}<1`, lo: 0, hi: 400, want: 'max' }, calc: [[`2*${a}-${p}`, 1]], derived: [2, a] }
      });
    }, { count: 2 }),
    T('mix-swap', '세 수의 차례를 바꾼 두 조건', '②35', (d, n) => {
      if (n === 0) {
        const c = nz(d, -9, 9), X = V('x'), Y = V('y');
        return valsQ(`세 수 ${X}, 0, ${jh(Y, '이/가')} 이 순서대로 등차수열의 연속한 세 항이고, 세 수 ${Y}, ${X}, ${jh(iq(c), '이/가')} 이 순서대로 등비수열의 연속한 세 항일 때, 실수 ${X}, ${Y}의 값은?`, [[X, -c], [Y, c]], {
          explain: `0은 ${X}와 ${Y}의 등차중항이므로 ${eq(Y, MINUS + X)}이다. ${jh(X, '은/는')} ${Y}와 ${iq(c)}의 등비중항이므로 ${eq(X + sup(2), nb(`${pq(c)}${Y}`))} = ${nb(`${iq(-c)}${X}`)}, ${eq(X, '0')} 또는 ${eq(X, iq(-c))}이다. ${eq(X, '0')}이면 ${eq(Y, '0')}이 되어 등비수열의 항이 될 수 없으므로 ${eq(X, iq(-c))}, ${eq(Y, iq(c))}이다.`,
          facts: { calc: [[`0-${jn(c)}`, 0], [jn(c), 1]] }
        });
      }
      const a = nz(d, -8, 8), p = d.pick([-4, -3, -2, 2, 3, 4]), b = (a * a) / p, qv = (a * a * a) / (p * p);
      if (!Number.isInteger(b) || !Number.isInteger(qv) || Math.abs(qv) > 9999 || a === p) return null;
      const X = V('a'), Y = V('b');
      return valsQ(`세 수 ${iq(p)}, ${X}, ${jh(Y, '이/가')} 이 순서대로 등비수열의 연속한 세 항이고, 세 수 ${X}, ${Y}, ${jh(iq(qv), '이/가')} 이 순서대로 등비수열의 연속한 세 항일 때, 실수 ${X}, ${Y}의 값은? (단, ${X} ≠ 0, ${Y} ≠ 0)`, [[X, a], [Y, b]], {
        explain: `${eq(X + sup(2), nb(`${pq(p)}${Y}`))}, ${eq(Y + sup(2), nb(`${pq(qv)}${X}`))}이다. 첫째 식에서 ${jh(eq(Y, p < 0 ? nb(MINUS + frac(X + sup(2), -p)) : frac(X + sup(2), p)), '을/를')} 둘째 식에 넣으면 ${eq(X + sup(3), iq(p * p * qv))}이므로 ${eq(X, iq(a))}, ${eq(Y, iq(b))}이다.`,
        facts: { range: { ineq: `x*x*x<${p * p * qv}+1`, lo: -40, hi: 40, want: 'max' }, calc: [[`${jn(a)}*${jn(a)}/${jn(p)}`, 1]], derived: [Math.abs(a)] }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
