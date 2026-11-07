// 고등학교 확률과 통계 Ⅲ-2 「통계적 추정」 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 11-3-7a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 임의추출을 비복원추출로 여겨 X₁ = X₂ = X₃ 인 표본이 없다고 하거나, 순서를 따지지 않고 표본을 센다(특별한 말이 없으면 임의추출은 복원추출이다).
//  - X 를 표준화할 때와 X̄ 를 표준화할 때 같은 σ 로 나눈다(X̄ 는 σ/√n 으로 나눈다).
//  - 신뢰도 95 %, 99 % 의 1.96, 2.58 만 외워, 신뢰도가 α % 인 구간에 P(|Z| ≤ k) = α/100 인 k 가 들어간다는 것을 놓친다.
//  - 신뢰구간의 두 끝이 표본평균을 가운데에 둔다는 것을 쓰지 못한다(두 끝이 a, 6a/5 처럼 비로 주어질 때).
//  - 표본분산을 n 으로 나눈다(표본분산은 n − 1 로 나눈다).
//  - |p̂ − p| ≤ k√(p̂(1 − p̂)) 가 모비율 추정의 표준화 Z = (p̂ − p)/√(p̂q̂/n) 를 감춘 꼴임을 알아보지 못한다.
//
// 실력에는 ① 문제의 식·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 두 단계를 잇는 것, 거꾸로 한 번 구하는 것, 교과서가 사실로 가르치는 문장의 참·거짓, 수집본 기본 문서에 여러 번 나오는 꼴은 기본에 두었다.
// 대단원 기출 모의고사(수능·평가원)의 세 꼴(심2·심4·심5)은 실력이고, 같은 일을 하는 기본 꼴이 있는 두 꼴(심1·심3)은 기본 유형에 겹쳤다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, C } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, nb, V, sup, rt } = B.kit.mid;
  const { ms, pr, ev, vr, sd, nrm, bar, hat, dist, pw, jh, nC } = B.kit.hs;
  const K = B.kit.u37x;
  const { UNIT, STD5, STD6, STD7, dstr, qs, qv, places, fq, fqs, jx, XB, xb, PH, Mv, Sg, Nv, ZC, zcond, ZS, zp, p4, zq, ztabOf, ztx, KOR,
    H, numQ, ratQ, decQ, slots, oneQ, probQ, setQ, distT } = K;

  const Xi = (i) => ms('X_' + i);
  const comb = (n, r) => { if (r < 0 || r > n) return 0; let v = 1; for (let i = 1; i <= r; i += 1) v = (v * (n - r + i)) / i; return Math.round(v); };
  const PVAR = [
    { take: (n) => `새로 개발한 옥수수 품종의 발아율을 알아보려고 이 품종의 씨앗 ${n}개를 임의추출하여 조사하였다.`, rate: '이 품종의 발아율' },
    { take: (n) => `어느 지역 주민 가운데 독감 예방 접종을 한 사람의 비율을 알아보려고 주민 ${n}명을 임의추출하여 조사하였다.`, rate: '이 지역 주민의 독감 예방 접종률' },
    { take: (n) => `어느 공장에서 만드는 부품의 불량률을 알아보려고 부품 ${n}개를 임의추출하여 조사하였다.`, rate: '이 공장에서 만드는 부품의 불량률' }
  ];

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD6,
    types: [
      // ── ① 식·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-reps', '크기가 3인 표본의 개수 — 임의추출은 복원추출', '①6', (d) => {
        // 함정: 비복원추출로 여겨 X₁ = X₂ = X₃ 인 표본이 없다고 하는 아이, 순서를 따지지 않고 세는 아이.
        const vals = d.pick([[2, 4, 6, 8], [1, 2, 3, 4], [1, 3, 5, 7], [2, 3, 5, 7], [1, 2, 4, 8]]), all = [];
        for (const a of vals) for (const b of vals) for (const c of vals) all.push([a, b, c]);
        const same = all.filter(([a, b, c]) => a === b && b === c).length, inc = all.filter(([a, b, c]) => a < b && b < c).length;
        const S = d.pick([...new Set(all.map(([a, b, c]) => a + b + c))].concat([d.bool() ? 0 : -1]).filter((x) => x > 0).concat(vals.every((v) => v % 2 === 0) ? [vals[0] + vals[1] + vals[2] + 1] : []));
        const ord = all.filter(([a, b, c]) => a + b + c === S).length, unord = new Set(all.filter(([a, b, c]) => a + b + c === S).map((t) => t.slice().sort((x, y) => x - y).join(','))).size;
        const cA = d.bool(), cB = d.bool(), cC = d.bool();
        const claims = [
          cA ? { h: `${ms('X_1 = X_2 = X_3')}인 표본의 개수는 ${same}이다.`, ok: true } : { h: `${ms('X_1 = X_2 = X_3')}인 표본은 없다.`, ok: false },
          ord === 0 ? (cB ? { h: `${ms('X_1 + X_2 + X_3 = ' + S)}인 표본은 없다.`, ok: true } : { h: `${ms('X_1 + X_2 + X_3 = ' + S)}인 표본의 개수는 ${vals.length}이다.`, ok: false })
            : (cB || unord === ord ? { h: `${ms('X_1 + X_2 + X_3 = ' + S)}인 표본의 개수는 ${ord}이다.`, ok: true } : { h: `${ms('X_1 + X_2 + X_3 = ' + S)}인 표본의 개수는 ${unord}이다.`, ok: false }),
          cC ? { h: `${ms('X_1 < X_2 < X_3')}인 표본의 개수는 ${inc}이다.`, ok: true } : { h: `${ms('X_1 < X_2 < X_3')}인 표본의 개수는 ${inc * 6}이다.`, ok: false }
        ];
        return setQ(d, `네 개의 수 ${vals.slice(0, 3).join(', ')}, ${jx(vals[3], '이/가')} 하나씩 적힌 카드 4장 가운데 임의로 뽑은 카드 한 장에 적힌 수를 모집단으로 할 때, 이 모집단에서 임의추출한 크기가 3인 표본을 ${ms('X_1, X_2, X_3')}이라 하자. 옳은 것만을 보기에서 있는 대로 고른 것은?`, claims, {
          explain: `특별한 말이 없으면 임의추출은 복원추출이고 (${ms('X_1, X_2, X_3')})은 순서를 따진다. ${ms('X_1 = X_2 = X_3')}인 표본은 ${same}개, ${ms('X_1 + X_2 + X_3 = ' + S)}인 표본은 ${ord}개, ${ms('X_1 < X_2 < X_3')}인 표본은 ${nC(4, 3)} = ${inc}개이다.`
        });
      }),
      H('hard-xxbar', 'P(X ≤ a) = P(X̄ ≥ b)에서 모평균', '①25', (d) => {
        // 함정: X 와 X̄ 를 같은 σ 로 표준화하는 아이.
        const r = d.int(2, 5), m = d.int(10, 60), t = d.int(1, 6), lowX = d.bool();
        const a = lowX ? m - r * t : m + r * t, b = lowX ? m + t : m - t;
        if (a <= 0 || b <= 0) return null;
        const cond = lowX ? `${pr(ms('X <= ' + a))} = ${pr(XB + ms(' >= ' + b))}` : `${pr(ms('X >= ' + a))} = ${pr(XB + ms(' <= ' + b))}`;
        return numQ(`모집단의 확률변수 ${V('X')}가 정규분포를 따를 때, 이 모집단에서 임의추출한 크기가 ${r * r}인 표본의 표본평균을 ${XB}라 하자. ${cond}일 때, 모집단의 확률변수 ${V('X')}의 평균은?`, m, {
          signed: true, value: `(${a}+${r}*${b})/(1+${r})`,
          explain: `X ~ N(m, σ²)이라 하면 ${XB} ~ N(m, (σ/${r})²)이다. 두 확률이 같으려면 (${a} − m)/σ와 (${b} − m)/(σ/${r})의 부호가 반대이고 크기가 같아야 하므로 ${a} − m = −${r}(${b} − m), m = ${m}이다.`
        });
      }),
      H('hard-alpha', '신뢰구간의 길이로 신뢰도 구하기', '②21', (d) => {
        // 함정: 1.96·2.58 만 떠올리고, 신뢰도 α % 의 구간에는 P(|Z| ≤ k) = α/100 인 k 가 들어간다는 것을 놓치는 아이. P(0 ≤ Z ≤ k) 를 두 배 하지 않는 아이.
        const u = d.int(1, 3), sig = d.int(2, 8) * u, r = sig / u;
        if (!Number.isInteger(r) || r < 2 || r > 12) return null;
        const [k1, k2] = d.shuffle([0.5, 1, 1.5, 2, 2.5, 3]).slice(0, 2).sort((x, y) => x - y);
        const L1 = qmul(Q(2 * u), zq(k1)), L2 = qmul(Q(2 * u), zq(k2)), P1 = zp(k1), P2 = zp(k2);
        const right = 2 * (P2 - P1), vals = [right, P2 - P1, 2 * P2, P2 + P1, 2 * P1];
        if (new Set(vals).size !== 5 || vals.some((v) => v <= 0 || v >= 10000)) return null;
        const order = d.shuffle([0, 1, 2, 3, 4]);
        return C(`정규분포 ${nrm('m', pw(sig, 2))}을 따르는 모집단에서 크기가 ${r * r}인 표본을 임의추출하여 구한 모평균 ${Mv}에 대한 신뢰도 ${V('α')} %의 신뢰구간이 ${ms('a <= m <= b')}일 때, ${ms('f(α) = b - a')}라 하자. ${ms('f(α_1) = ' + qs(L1))}, ${ms('f(α_2) = ' + qs(L2))}일 때, ${ms('α_2 - α_1')}의 값을 아래 표준정규분포표를 이용하여 구한 것은?`, order.map((i) => dstr(vals[i], 100)), order.indexOf(0), {
          figure: ztabOf(d, [k1, k2]),
          explain: `신뢰도 α %의 신뢰구간은 x̄ − kσ/√n ≤ m ≤ x̄ + kσ/√n (단, ${pr(ms('|Z| <= k'))} = α/100)이므로 f(α) = 2k × ${sig}/${r} = ${2 * u}k이다. f(α₁) = ${qs(L1)}에서 k = ${k1}, α₁ = 2 × ${p4(P1)} × 100 = ${dstr(2 * P1, 100)}, f(α₂) = ${qs(L2)}에서 k = ${k2}, α₂ = ${dstr(2 * P2, 100)}이다. α₂ − α₁ = ${dstr(right, 100)}이다.`,
          facts: { pick: { expr: `2*(${P2}-${P1})/100`, options: order.map((i) => vals[i] / 100) } }
        });
      }),
      H('hard-ratio', '두 끝이 a와 (q/p)a인 신뢰구간에서 표본평균', '심4', (d) => {
        // 함정: 신뢰구간의 두 끝이 x̄ 를 가운데에 두고 반폭만큼 떨어져 있다는 것을 쓰지 못하는 아이.
        const [sig, r] = d.pick([[5, 7], [10, 7], [15, 7], [10, 14], [10, 4], [5, 2], [20, 8]]), [p, q] = d.pick([[6, 5], [5, 4], [4, 3], [7, 6], [7, 5], [8, 7], [3, 2]]);
        const h = Q(196 * sig, 100 * r), a = qdiv(qmul(h, Q(2 * q)), Q(p - q)), xbar = qadd(a, h);
        if (places(h) > 1 || places(a) > 1 || xbar.q !== 10 || qv(xbar) >= 100) return null;
        return decQ(`정규분포 ${nrm(Mv, pw(sig, 2))}을 따르는 모집단에서 크기가 ${r * r}인 표본을 임의추출하여 얻은 표본평균이 ${xb}일 때, 모평균 ${Mv}에 대한 신뢰도 95 %의 신뢰구간이 ${ms('a <= m <= ')}${frac(p, q)}${V('a')}이다. ${xb}의 값은? (단, ${V('Z')}가 표준정규분포를 따르는 확률변수일 때, ${pr('|Z| <= 1.96')} = 0.95로 계산한다.)`, qv(xbar), {
          value: `196*${sig}*(${p}+${q})/(100*${r}*(${p}-${q}))`,
          explain: `반폭은 1.96 × ${sig}/${r} = ${qs(h)}이므로 a = ${xb} − ${qs(h)}, (${fqs(Q(p, q))})a = ${xb} + ${qs(h)}이다. 두 식을 빼면 (${fqs(Q(p - q, q))})a = ${qs(qmul(h, Q(2)))}, a = ${qs(a)}이고 ${xb} = ${qs(a)} + ${qs(h)} = ${qs(xbar)}이다.`
        });
      }),
      H('hard-phatq', '|p̂ − p| ≤ k√(p̂(1 − p̂))일 확률 조건으로 표본의 크기', '심5', (d) => {
        // 함정: k√(p̂(1 − p̂)) 가 모비율 추정의 표준화 분모 √(p̂q̂/n) 의 √n 배임을 알아보지 못하는 아이.
        const kk = d.pick(['0.08', '0.1', '0.12', '0.15', '0.16', '0.2', '0.25']), z = d.pick([1, 1.5, 2, 2.5]);
        const kq = K.dq(kk), T2 = qdiv(qmul(zq(z), zq(z)), qmul(kq, kq)), need = Math.ceil(qv(T2) - 1e-12), val = 2 * zp(z);
        if (need > 3000 || need < 20) return null;
        const c = d.pick([
          { who: '어느 나라 성인', what: '어떤 질병의 항체를 가진 사람의 비율' }, { who: '어느 도시의 가구', what: '태양광 발전기를 단 가구의 비율' }, { who: '어느 지역 고등학생', what: '안경을 쓰는 학생의 비율' }
        ]);
        return numQ(`${josa(c.who, '을/를')} 대상으로 ${c.what}을 조사하려 한다. 모집단의 비율을 ${V('p')}, 모집단에서 임의추출한 ${Nv}개의 표본을 조사하여 얻은 표본비율을 ${PH}이라 할 때, ${ms('|')}${PH}${ms(' - p| <= ' + kk)}${rt(PH + '(1 ' + MINUS + ' ' + PH + ')')}일 확률이 ${p4(val)} 이상이 되도록 하는 ${Nv}의 최솟값을 구하시오. (단, ${Nv}은 충분히 크고, ${V('Z')}가 표준정규분포를 따르는 확률변수일 때, ${pr('0 <= Z <= ' + z)} = ${jx(p4(zp(z)), '으로/로')} 계산한다.)`, need, {
          range: { ineq: `x*${T2.q}>${T2.p - 1}`, lo: 1, hi: 10000, want: 'min' },
          explain: `n이 충분히 크면 Z = (${PH} − p)/√(${PH}${hat('q')}/n)은 근사적으로 N(0, 1)을 따른다. |${PH} − p| ≤ ${kk}√(${PH}${hat('q')})은 |Z| ≤ ${kk}√n과 같으므로 ${kk}√n ≥ ${z}, n ≥ ${dstr(T2.p, T2.q) || fqs(T2)}이다. 최솟값은 ${need}이다.`
        });
      }),
      H('hard-sums', '합과 제곱합으로 표본표준편차를 구해 신뢰구간', '②6', (d) => {
        // 함정: 표본분산을 n 으로 나누는 아이(n − 1 로 나눈다).
        const n = d.pick([25, 36, 49, 50, 64, 100]), t = d.pick([1, 2, 3]), xbar = d.int(2 * t + 2, 40), S2 = n * t * t;
        const sumX = n * xbar, sumX2 = (n - 1) * S2 + n * xbar * xbar;
        if (sumX2 > 9999999) return null;
        const lo = xbar - 2 * t, hi = xbar + 2 * t;
        return slots(`정규분포를 따르는 어느 모집단에서 임의추출한 크기가 ${n}인 표본 ${jh(ms('X_1, X_2, …, X_' + n), '이/가')} ${ms('X_1 + X_2 + … + X_' + n + ' = ' + sumX)}, ${jh(ms('X_1^2 + X_2^2 + … + X_' + n + '^2 = ' + sumX2), '을/를')} 만족시킨다. 이 표본을 이용하여 구한 모평균 ${Mv}에 대한 신뢰도 95 %의 신뢰구간이 ${ms('a <= m <= b')}일 때, ${V('a')}와 ${V('b')}의 값을 차례로 구하시오. (단, ${V('Z')}가 표준정규분포를 따르는 확률변수일 때, ${pr('|Z| <= 2')} = 0.95로 계산한다.)`, [
          [V('a'), lo, `${sumX}/${n}-2*${t}`], [V('b'), hi, `${sumX}/${n}+2*${t}`]
        ], {
          shown: `${V('a')} = ${lo}, ${V('b')} = ${hi}`,
          explain: `${XB} = ${sumX}/${n} = ${xbar}이다. 표본분산은 n − 1 = ${jx(n - 1, '으로/로')} 나누어 S² = (${sumX2} − 2 × ${xbar} × ${sumX} + ${n} × ${xbar}²)/${n - 1} = ${S2}이고 S/√${n} = √${S2}/√${n} = ${t}이다. 신뢰구간은 ${xbar} − 2 × ${t} ≤ m ≤ ${xbar} + 2 × ${t}, 곧 ${lo} ≤ m ≤ ${hi}이다.`
        });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-vax', '확률질량함수의 상수를 구한 뒤 V(aX̄)', '①16', (d) => {
        let vals, ps, intro, aVal;
        const byRule = d.bool();
        if (byRule) {
          const t = d.pick([3, 4, 5]), tot = (t * (t + 1)) / 2; vals = Array.from({ length: t }, (_, i) => i + 1); ps = vals.map((x) => Q(x, tot)); aVal = Q(1, tot);
          intro = `모집단의 확률변수 ${V('X')}의 확률질량함수가 ${pr(ms('X = x'))} = ${ms('ax')} (${ms('x')} = ${vals.join(', ')})이다.`;
        } else {
          const [p1, p2] = d.pick([[Q(1, 2), Q(1, 5)], [Q(1, 4), Q(1, 4)], [Q(2, 5), Q(3, 10)], [Q(1, 3), Q(1, 6)], [Q(1, 5), Q(1, 2)]]), rest = qsub(Q(1), qadd(p1, p2));
          aVal = qdiv(rest, Q(3)); vals = [1, 2, 3, 4]; ps = [p1, p2, aVal, qmul(aVal, Q(2))];
          intro = `모집단의 확률변수 ${V('X')}의 확률분포가 다음 표와 같다.`;
        }
        let e = Q(0, 1), e2 = Q(0, 1);
        vals.forEach((x, i) => { e = qadd(e, qmul(Q(x), ps[i])); e2 = qadd(e2, qmul(Q(x * x), ps[i])); });
        const varX = qsub(e2, qmul(e, e)), size = d.int(4, 12), useA = aVal.p === 1 && d.bool(), c = useA ? aVal.q : d.pick([2, 3, 4, 5, 10]);
        const ans = qdiv(qmul(Q(c * c), varX), Q(size));
        if (ans.q > 9999 || ans.p > 9999) return null;
        const askH = useA ? `${vr(frac(XB, V('a')))}` : `${vr(c + XB)}`;
        return ratQ(`${intro} 이 모집단에서 크기가 ${size}인 표본을 임의추출하여 구한 표본평균을 ${XB}라 할 때, ${askH}의 값은? (단, ${V('a')}는 상수이다.)`, ans, {
          figure: byRule ? undefined : distT(vals, [fq(ps[0]), fq(ps[1]), V('a'), ms('2a')]),
          value: `${c}*${c}*${varX.p}/(${varX.q}*${size})`,
          explain: `확률의 합이 1이므로 a = ${fqs(aVal)}이다. ${ev('X')} = ${fqs(e)}, ${ev('X^2')} = ${fqs(e2)}이므로 ${vr('X')} = ${fqs(varX)}, ${vr(XB)} = ${fqs(varX)} ÷ ${size} = ${fqs(qdiv(varX, Q(size)))}이다. ${askH} = ${c}² × ${vr(XB)} = ${fqs(ans)}이다.`
        });
      }),
      H('hard-comb', '조합으로 모집단의 분포를 만든 뒤 V(X̄)', '①17', (d) => {
        const N0 = d.int(6, 8), k = d.int(3, Math.min(5, N0 - 2)), kind = d.pick(['min', 'second', 'max']), m = d.pick([12, 18, 24, 30, 36, 48]);
        const j = kind === 'max' ? k : kind === 'second' ? 2 : 1, total = comb(N0, k);
        const vals = [], ws = [];
        for (let v = 1; v <= N0; v += 1) { const w = comb(v - 1, j - 1) * comb(N0 - v, k - j); if (w) { vals.push(v); ws.push(w); } }
        let e = Q(0, 1), e2 = Q(0, 1);
        vals.forEach((v, i) => { e = qadd(e, Q(v * ws[i], total)); e2 = qadd(e2, Q(v * v * ws[i], total)); });
        const varX = qsub(e2, qmul(e, e)), ans = qdiv(varX, Q(m));
        if (ans.q > 9999) return null;
        const word = { min: '가장 작은 수', second: '두 번째로 작은 수', max: '가장 큰 수' }[kind];
        return ratQ(`1부터 ${N0}까지의 자연수가 하나씩 적힌 카드 ${N0}장 가운데 임의로 ${k}장을 동시에 뽑아 적힌 수를 확인하고 다시 넣는 시행을 ${m}번 되풀이한다. ${Nv}번째 시행에서 뽑은 카드에 적힌 수 가운데 ${word}를 ${ms('x_n')}이라 할 때, ${ms('x_1, x_2, …, x_' + m)}의 평균을 ${XB}라 하자. ${vr(XB)}의 값은?`, ans, {
          value: `(${total}*(${vals.map((v, i) => `${v}*${v}*${ws[i]}`).join('+')})-(${vals.map((v, i) => `${v}*${ws[i]}`).join('+')})*(${vals.map((v, i) => `${v}*${ws[i]}`).join('+')}))/(${total}*${total}*${m})`,
          explain: `한 번의 시행에서 ${word}를 X라 하면 P(X = v) = ${kind === 'max' ? `${nC('v−1', k - 1)}` : kind === 'second' ? `(v − 1) × ${nC(`${N0}−v`, k - 2)}` : `${nC(`${N0}−v`, k - 1)}`}/${nC(N0, k)}이고 X는 ${vals.join(', ')}의 값을 가진다. ${ev('X')} = ${fqs(e)}, ${vr('X')} = ${fqs(e2)} − (${fqs(e)})² = ${fqs(varX)}이다. ${XB}는 크기가 ${m}인 표본의 표본평균이므로 ${vr(XB)} = ${fqs(varX)} ÷ ${m} = ${fqs(ans)}이다.`
        });
      }),
      H('hard-chain', '모집단의 확률로 상수를 구한 뒤 표본평균의 확률', '①26', (d) => {
        const sig = d.int(2, 6), z1 = d.pick([1, 1.5, 2, 2.5]), r = d.int(2, 5), z2 = d.pick([0.5, 1, 1.5, 2]), ge = d.bool();
        const kk = qsub(qdiv(qmul(zq(z1), Q(sig)), Q(2)), qdiv(qmul(zq(z2), Q(sig)), Q(r)));
        if (kk.p === 0 || places(kk) > 1 || places(qmul(zq(z1), Q(sig))) > 1) return null;
        const pz1 = zp(z1), pz2 = zp(z2), right = ge ? 5000 + pz2 : 5000 - pz2;
        const off = kk.p > 0 ? `${qs(kk)} + ${frac(V('a'), 2)}` : `${frac(V('a'), 2)} ${MINUS} ${qs(Q(-kk.p, kk.q))}`;
        const wr = [10000 - right, pz2, ge ? 5000 + pz1 : 5000 - pz1, ...ZS.filter((z) => z !== z2 && Math.abs(z - z2) <= 0.5).map((z) => (ge ? 5000 + zp(z) : 5000 - zp(z)))];
        return probQ(d, `어느 공장에서 만드는 병의 높이는 정규분포 ${nrm(Mv, pw(sig, 2))}을 따른다고 한다. 상수 ${V('a')}에 대하여 병의 높이가 ${ms('(a - m)')} cm 이상 ${Mv} cm 이하일 확률이 ${p4(pz1)}이고, 이 공장에서 만든 병 가운데 임의추출한 ${r * r}개의 높이의 평균을 ${XB}라 할 때, ${pr(XB + ms(ge ? ' >= ' : ' <= ') + '(' + off + ')')}의 값을 아래 표준정규분포표를 이용하여 구한 것은?`, right, wr, {
          figure: ztabOf(d, [...new Set([z1, z2])]), expr: `(5000${ge ? '+' : '-'}${pz2})/10000`,
          explain: `높이를 X라 하면 ${pr(ms('a - m <= X <= m'))} = ${p4(pz1)}에서 ${ms('(a - 2m)')}/${sig} = −${z1}, ${ms('a = 2m')} − ${qs(qmul(zq(z1), Q(sig)))}이다. 따라서 ${off} = ${Mv} − ${qs(qdiv(qmul(zq(z2), Q(sig)), Q(r)))}이고 ${XB} ~ N(m, (${sig}/${r})²)이므로 구하는 확률은 ${pr(ms('Z' + (ge ? ' >= ' : ' <= ') + '-' + z2))} = ${p4(right)}이다.`
        });
      }),
      H('hard-ex2', 'E(X²)가 주어진 모집단의 분포표에서 V(X̄)', '심2', (d) => {
        const g = d.pick([1, 2, 3]), p0 = d.pick([Q(1, 6), Q(1, 4), Q(1, 3), Q(1, 5), Q(1, 2)]), rest = qsub(Q(1), p0);
        const a = qmul(rest, Q(d.pick([1, 2, 3]), d.pick([3, 4, 5]))), b = qsub(rest, a);
        if (a.p <= 0 || b.p <= 0 || (a.p === b.p && a.q === b.q)) return null;
        const vals = [0, g, 2 * g], e = qadd(qmul(Q(g), a), qmul(Q(2 * g), b)), e2 = qadd(qmul(Q(g * g), a), qmul(Q(4 * g * g), b)), varX = qsub(e2, qmul(e, e)), size = d.int(5, 30), ans = qdiv(varX, Q(size));
        if (ans.q > 9999 || e2.q > 99) return null;
        return ratQ(`어느 모집단의 확률변수 ${V('X')}의 확률분포가 다음 표와 같다. ${ev('X^2')} = ${fq(e2)}일 때, 이 모집단에서 임의추출한 크기가 ${size}인 표본의 표본평균 ${XB}에 대하여 ${vr(XB)}의 값은? (단, ${V('a')}, ${V('b')}는 상수이다.)`, ans, {
          figure: distT(vals, [fq(p0), V('a'), V('b')]),
          value: `(${varX.p})/(${varX.q}*${size})`,
          explain: `a + b = ${fqs(rest)}, ${g * g}a + ${4 * g * g}b = ${jh(fq(e2), '을/를')} 연립하면 a = ${fqs(a)}, b = ${fqs(b)}이다. ${ev('X')} = ${fqs(e)}이므로 ${vr('X')} = ${fqs(e2)} − (${fqs(e)})² = ${fqs(varX)}, ${vr(XB)} = ${fqs(varX)} ÷ ${size} = ${fqs(ans)}이다.`
        });
      }),
      H('hard-maxn', '모비율 신뢰구간 길이의 최댓값이 주어진 값 이하가 되는 표본의 크기', '②25', (d) => {
        const c = d.pick(PVAR), conf = d.pick([95, 99]), L = K.dq(d.pick(['0.05', '0.08', '0.1', '0.15', '0.2', '0.25', '0.3'])), z = Q(ZC[conf], 100);
        const T2 = qdiv(qmul(z, z), qmul(L, L)), need = Math.ceil(qv(T2) - 1e-12);
        if (need < 20 || need > 5000) return null;
        return numQ(`${c.take(Nv)} 이 결과를 이용하여 구한 ${c.rate} ${V('p')}에 대한 신뢰도 ${conf} %의 신뢰구간이 ${ms('α <= p <= β')}일 때, ${ms('β - α')}의 최댓값이 ${qs(L)} 이하가 되도록 하는 자연수 ${Nv}의 최솟값은? ${zcond(conf)}`, need, {
          range: { ineq: `x*${T2.q}>${T2.p - 1}`, lo: 1, hi: 10000, want: 'min' },
          explain: `${PH}${hat('q')} = −(${PH} − 1/2)² + 1/4 ≤ 1/4이므로 β − α = 2 × ${ZC[conf] / 100} × √(${PH}${hat('q')}/n) ≤ ${ZC[conf] / 100}/√n이다. ${ZC[conf] / 100}/√n ≤ ${qs(L)}에서 n ≥ ${dstr(T2.p, T2.q) || fqs(T2)}, 최솟값은 ${need}이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
