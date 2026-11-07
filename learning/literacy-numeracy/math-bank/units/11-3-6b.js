// 고등학교 확률과 통계 Ⅲ-1-04 「정규분포」 — 뒤쪽 묶음(확률에서 거꾸로 구하기, 이항분포와 정규분포의 관계).
// 싣는 기준과 뺀 것은 11-3-6a.js 머리에 모아 적었다. 도구는 11-3-6a.js 가 내보낸 B.kit.u1136 을 쓴다.
// ref: ①n = 기본꼴_1의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, C, inline } = B.kit;
  const { MINUS, Q, V, sup, nb } = B.kit.mid;
  const { ms, fn, nrm, bin, pw, jh, qAns } = B.kit.hs;
  const { UNIT, num, jn, dec, zt, p4, X, Y, Z, Mv, Sv, nX, Pz, ZT, zp, cdf, zval, zexpr, P0, zSteps, tabOf, probQ, T, numQ, oneQ } = B.kit.u1136;

  // 확률 pv(만분의 몇)와 표의 값 zp(k)가 맞는지를 0으로 만드는 식(1000배해 답의 식에 더한다): pv 가 0.5보다 크면 pv − 0.5 = zp, 작으면 0.5 − pv = zp
  const agree = (k, pv) => `(${p4(zp(k))}-${pv > 5000 ? p4(pv) + '+0.5' : '0.5+' + p4(pv)})*1000`;
  const ZKEYS = [5, 8, 10, 12, 13, 14, 15, 17, 18, 20, 22, 23, 24, 25];
  // 표준편차 s 에서 z·s 가 정수가 되는 z(십분의 몇)
  const fitKeys = (s) => ZKEYS.filter((k) => (k * s) % 10 === 0);
  const fr = (n, d) => (d === 1 ? String(n) : frac(n, d));

  // ════════════════════════════════════════════════════════════════
  // ── 확률에서 거꾸로 — 평균·표준편차·경계 ──
  B.addTypes(UNIT, 'back', [
    T('back-mean', '확률로 정규분포의 평균 m 구하기', '①18', (d) => {
      const s = d.int(2, 10), keys = fitKeys(s);
      if (!keys.length) return null;
      const k = d.pick(keys) * d.pick([1, -1]), m = d.int(20, 90), c = m + k * s / 10, le = d.bool();
      const pv = le ? cdf(k) : 10000 - cdf(k), body = le ? 'X <= ' + c : 'X >= ' + c, zb = le ? 'Z <= ' : 'Z >= ';
      return numQ(`정규분포 ${jh(nrm('m', pw(s, 2)), '을/를')} 따르는 확률변수 ${X}에 대하여 ${nb(Pz(body) + ' = ' + p4(pv))}일 때, 다음 표준정규분포표를 이용하여 ${Mv}의 값을 구하시오.`, m, {
        figure: tabOf(d, [k], 3),
        explain: `${Pz(body)} = ${Pz(zb + frac(ms(c + ' - m'), s))} = ${p4(pv)}이다. 표에서 ${Pz(zb + zt(k))} = ${zSteps(le ? null : k, le ? k : null)}이므로 ${frac(ms(c + ' - m'), s)} = ${zt(k)}, ${ms('m = ' + m)}이다.`,
        value: `${c}${k < 0 ? '+' : '-'}${zt(Math.abs(k))}*${s}+${agree(k, pv)}`, derived: [0.5, 1000]
      });
    }),

    T('back-sd', '확률로 정규분포의 표준편차 σ 구하기', '①19', (d, n) => {
      const s = d.int(2, 12), keys = fitKeys(s);
      if (!keys.length) return null;
      const m = d.int(20, 90);
      if (n === 0) {
        const k = d.pick(keys) * d.pick([1, -1]), c = m + k * s / 10, le = d.bool();
        const pv = le ? cdf(k) : 10000 - cdf(k), body = le ? 'X <= ' + c : 'X >= ' + c, zb = le ? 'Z <= ' : 'Z >= ';
        return numQ(`정규분포 ${jh(nrm(m, 'σ^2'), '을/를')} 따르는 확률변수 ${X}에 대하여 ${nb(Pz(body) + ' = ' + p4(pv))}일 때, 다음 표준정규분포표를 이용하여 양수 ${Sv}의 값을 구하시오.`, s, {
          figure: tabOf(d, [k], 3),
          explain: `${Pz(body)} = ${Pz(zb + frac(ms(c + ' - ' + m), Sv))} = ${p4(pv)}이다. 표에서 ${Pz(zb + zt(k))} = ${p4(pv)}이므로 ${frac(num(c - m), Sv)} = ${zt(k)}, ${ms('σ = ' + s)}이다.`,
          value: `(${jn(c - m) === String(c - m) ? c + '-' + m : m + '-' + c})/${zt(Math.abs(k))}+${agree(k, pv)}`, derived: [0.5, 1000]
        });
      }
      // σ 를 구한 뒤 다른 확률까지
      const k = d.pick(keys), left = d.bool(), c = left ? m - k * s / 10 : m + k * s / 10;
      const k2 = d.pick(ZKEYS.filter((j) => j !== k)) * d.pick([1, -1]), e = dec(m + k2 * s / 10), up = d.bool();
      const [lo, hi] = up ? [k2, null] : [null, k2], v = zval(lo, hi);
      const body = left ? `${c} <= X <= ${m}` : `${m} <= X <= ${c}`, body2 = up ? 'X >= ' + e : 'X <= ' + e;
      return probQ(d, `정규분포 ${jh(nrm(m, 'σ^2'), '을/를')} 따르는 확률변수 ${X}에 대하여 ${nb(Pz(body) + ' = ' + p4(zp(k)))}일 때, ${jh(Pz(body2), '을/를')} 다음 표준정규분포표를 이용하여 구한 것은? (단, ${nb(Sv + ' &gt; 0')})`, v, zexpr(lo, hi), [zp(k2), zp(k)], {
        figure: tabOf(d, [k, k2], 1), rule: 'sd-then',
        explain: `${Pz(body)} = ${Pz(left ? MINUS + frac(Math.abs(c - m), Sv) + ' <= Z <= 0' : '0 <= Z <= ' + frac(Math.abs(c - m), Sv))} = ${p4(zp(k))}이고 표에서 ${P0(k)} = ${p4(zp(k))}이므로 ${frac(Math.abs(c - m), Sv)} = ${zt(k)}, ${ms('σ = ' + s)}이다. 따라서 ${Pz(body2)} = ${Pz(up ? 'Z >= ' + zt(k2) : 'Z <= ' + zt(k2))} = ${zSteps(lo, hi)}이다.`
      });
    }, { count: 2 }),

    T('back-linked', '표준편차가 평균으로 정해진 정규분포에서 m 구하기', '①20', (d) => {
      const q = d.int(2, 5), k = d.pick(ZKEYS), c = d.int(3, 30), up = d.bool();
      const mq = Q(10 * c * q, 10 * q + k);
      if (mq.q === 1 || mq.q > 40) return null;
      const pv = up ? 10000 - cdf(k) : cdf(k), body = up ? 'X >= ' + c : 'X <= ' + c;
      const fracH = mq.p > mq.q ? frac(mq.p, mq.q) : frac(mq.p, mq.q);
      return qAns(`확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nrm('m', frac(ms('m^2'), q * q)), '을/를')} 따르고 ${nb(Pz(body) + ' = ' + p4(pv))}일 때, 다음 표준정규분포표를 이용하여 ${Mv}의 값을 구하시오. (단, ${nb(Mv + ' &gt; 0')})`, mq, {
        figure: tabOf(d, [k], 3),
        explain: `${Mv} &gt; 0이므로 표준편차는 ${frac(Mv, q)}이다. ${Pz(body)} = ${Pz((up ? 'Z >= ' : 'Z <= ') + frac(ms(c + ' - m'), frac(Mv, q)))} = ${p4(pv)}이고 표에서 ${Pz((up ? 'Z >= ' : 'Z <= ') + zt(k))} = ${p4(pv)}이므로 ${frac(q + '(' + ms(c + ' - m') + ')', Mv)} = ${zt(k)}, ${q * c} = ${dec(q + k / 10)}${Mv}에서 ${Mv} = ${fracH}이다.`,
        facts: { value: `${c}*${q}/(${q}+${zt(k)})+${agree(k, pv)}`, derived: [q, 0.5, 1000] }
      });
    }),

    T('back-end', '확률로 구간의 끝 a 구하기', '①21', (d) => {
      const s = d.int(2, 9), keys = fitKeys(s);
      if (!keys.length) return null;
      const m = d.int(15, 80), cross = d.bool();
      const k2 = d.pick(keys), k1 = cross ? -d.pick(ZKEYS) : d.pick(ZKEYS.filter((j) => j < k2));
      if (k1 == null || Number.isNaN(k1) || k1 === undefined) return null;
      const c = dec(m + k1 * s / 10), a = m + k2 * s / 10, pv = zval(k1, k2);
      const sumE = cross ? `${p4(zp(k1))}+${p4(zp(k2))}` : `${p4(zp(k2))}-${p4(zp(k1))}`;
      return numQ(`확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nX(m, s), '을/를')} 따를 때, ${jh(nb(Pz(c + ' <= X <= a') + ' = ' + p4(pv)), '을/를')} 만족시키는 상수 ${V('a')}의 값을 다음 표준정규분포표를 이용하여 구하시오.`, a, {
        figure: tabOf(d, [k1, k2], 2),
        explain: `${Pz(c + ' <= X <= a')} = ${Pz(zt(k1) + ' <= Z <= ' + frac(ms('a - ' + m), s))}이다. ${cross ? `${P0(k1)} = ${p4(zp(k1))}이므로 ${Pz('0 <= Z <= ' + frac(ms('a - ' + m), s))} = ${p4(pv)} ${MINUS} ${p4(zp(k1))} = ${p4(zp(k2))}` : `${Pz('0 <= Z <= ' + frac(ms('a - ' + m), s))} ${MINUS} ${P0(k1)} = ${p4(pv)}이므로 ${Pz('0 <= Z <= ' + frac(ms('a - ' + m), s))} = ${p4(pv)} + ${p4(zp(k1))} = ${p4(zp(k2))}`}이다. 표에서 ${frac(ms('a - ' + m), s)} = ${zt(k2)}, ${ms('a = ' + a)}이다.`,
        value: `${m}+${zt(k2)}*${s}+(${sumE}-${p4(pv)})*1000`, derived: [1000]
      });
    }),

    T('back-cut', '합격 인원으로 최저 점수 구하기', '①22', (d) => {
      const s = d.int(4, 15), keys = fitKeys(s).filter((k) => k >= 5);
      if (!keys.length) return null;
      const k = d.pick(keys), m = d.int(55, 80), a = m + k * s / 10, M = 5000 - zp(k);
      return numQ(`어느 회사의 입사 시험에 10000명이 응시하였고, 응시자의 점수는 평균이 ${m}점, 표준편차가 ${s}점인 정규분포를 따른다고 한다. 점수가 높은 사람부터 차례로 ${M}명을 합격시킬 때, 합격자의 최저 점수는 몇 점인지 다음 표준정규분포표를 이용하여 구하시오.`, a, {
        unit: '점', figure: tabOf(d, [k], 3),
        explain: `응시자의 점수를 ${X}, 최저 점수를 ${V('a')}점이라 하면 ${Pz('X >= a')} = ${frac(M, 10000)} = ${p4(M)}이다. ${Pz('X >= a')} = ${Pz('Z >= ' + frac(ms('a - ' + m), s))}이고 표에서 ${Pz('Z >= ' + zt(k))} = 0.5 ${MINUS} ${p4(zp(k))} = ${p4(M)}이므로 ${frac(ms('a - ' + m), s)} = ${zt(k)}, ${ms('a = ' + a)}이다.`,
        value: `${m}+${zt(k)}*${s}+(10000/2-${M}-${zp(k)})*1000`, derived: [2, 1000, zp(k)]
      });
    }),

    T('back-twosum', '두 정규분포의 확률의 합이 1일 때 상수 구하기', '①23', (d) => {
      const m1 = d.int(20, 60), s1 = d.int(2, 8), w = d.pick([-3, -2, -1, 1, 2, 3]), c = m1 + w * s1;
      const m2 = d.int(30, 90), s2 = d.pick([2, 3, 4, 5, 6, 7, 8].filter((t) => t !== s1)), a = m2 + w * s2, flip = d.bool();
      const b1 = flip ? 'X <= ' + c : 'X >= ' + c, b2 = flip ? 'Y >= a' : 'Y <= a';
      return numQ(`두 확률변수 ${X}, ${jh(Y, '이/가')} 각각 정규분포 ${nX(m1, s1)}, ${jh(nX(m2, s2), '을/를')} 따를 때, ${jh(nb(Pz(b1) + ' + ' + Pz(b2) + ' = 1'), '을/를')} 만족시키는 상수 ${V('a')}의 값은?`, a, {
        explain: `${Pz(b1)} = ${Pz((flip ? 'Z <= ' : 'Z >= ') + num(w))}, ${Pz(b2)} = ${Pz((flip ? 'Z >= ' : 'Z <= ') + frac(ms('a - ' + m2), s2))}이다. ${Pz((flip ? 'Z <= ' : 'Z >= ') + num(w))} + ${Pz((flip ? 'Z > ' : 'Z < ') + num(w))} = 1이므로 ${frac(ms('a - ' + m2), s2)} = ${num(w)}, ${ms('a = ' + a)}이다.`,
        value: `${m2}+(${c}-${m1})/${s1}*${s2}`
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 이항분포와 정규분포의 관계 ──
  // 근사할 이항분포: [n, 분자, 분모, 평균, 표준편차] — npq 가 제곱수
  const BN = [];
  for (const [p, q] of [[1, 2], [1, 3], [2, 3], [1, 4], [1, 5], [2, 5], [1, 6], [1, 10], [4, 5], [3, 5]]) {
    for (let n = 30; n <= 2000; n += 1) {
      if ((n * p) % q) continue;
      const v = n * p * (q - p) / (q * q), s = Math.round(Math.sqrt(v));
      if (Number.isInteger(v) && s * s === v && n * p / q >= 5 && n * (q - p) / q >= 5 && s >= 3 && s <= 15) BN.push([n, p, q, n * p / q, s]);
    }
  }
  const binOf = (r) => bin(r[0], fr(r[1], r[2]));
  // 문장 상황: 한 번의 시행에서 사건이 일어날 확률이 p/q
  const LIFEB = [
    { p: [1, 2], say: (n) => `한 개의 동전을 ${n}번 던질 때 앞면이 나오는 횟수`, x: '앞면이 나오는 횟수', cnt: '번' },
    { p: [1, 3], say: (n) => `한 개의 주사위를 ${n}번 던질 때 3의 배수의 눈이 나오는 횟수`, x: '3의 배수의 눈이 나오는 횟수', cnt: '번' },
    { p: [1, 3], say: (n) => `한 개의 주사위를 ${n}번 던질 때 5 이상의 눈이 나오는 횟수`, x: '5 이상의 눈이 나오는 횟수', cnt: '번' },
    { p: [1, 6], say: (n) => `한 개의 주사위를 ${n}번 던질 때 1의 눈이 나오는 횟수`, x: '1의 눈이 나오는 횟수', cnt: '번' },
    { p: [2, 5], say: (n) => `자유투 성공률이 ${frac(2, 5)}인 농구 선수가 자유투를 ${n}번 던질 때 성공하는 횟수`, x: '자유투를 성공하는 횟수', cnt: '번' },
    { p: [1, 5], say: (n) => `전체 학생의 20 %가 혈액형이 B형인 어느 고등학교에서 임의로 ${n}명을 택할 때 혈액형이 B형인 학생의 수`, x: '혈액형이 B형인 학생의 수', cnt: '명' },
    { p: [1, 3], say: (n) => `전체 학생의 ${frac(1, 3)}이 새 급식 메뉴를 좋아하는 어느 고등학교에서 임의로 ${n}명을 택할 때 새 급식 메뉴를 좋아하는 학생의 수`, x: '새 급식 메뉴를 좋아하는 학생의 수', cnt: '명' },
    { p: [1, 10], say: (n) => `판매한 제품의 10 %가 반품되는 어느 매장에서 제품 ${n}개를 팔았을 때 반품되는 제품의 수`, x: '반품되는 제품의 수', cnt: '개' }
  ];
  // 이항분포의 범위(정수 끝): 평균 ± z·σ 가 정수인 z
  function binRange(d, s) {
    const keys = fitKeys(s);
    if (!keys.length) return null;
    const kind = d.int(0, 3);
    if (kind === 0) return [-d.pick(keys), d.pick(keys)];
    if (kind === 1) { const two = d.shuffle(keys).slice(0, 2).sort((x, y) => x - y); if (two.length < 2) return null; return d.bool() ? two : [-two[1], -two[0]]; }
    if (kind === 2) return [d.pick([1, -1]) * d.pick(keys), null];
    return [null, d.pick([1, -1]) * d.pick(keys)];
  }
  B.addTypes(UNIT, 'binom', [
    T('bin-normal', '이항분포가 근사적으로 따르는 정규분포', '①26', (d, n) => {
      if (n === 0) {
        const r = d.pick(BN), [nn, p, q, m, s] = r;
        return inline(`확률변수 ${jh(X, '이/가')} 이항분포 ${jh(binOf(r), '을/를')} 따를 때, ${jh(X, '이/가')} 근사적으로 따르는 정규분포를 ${nrm('m', 'σ^2')} 꼴로 나타내시오.`,
          `${fn('N')}({0}, {1})`, [{ answer: m }, { answer: s * s }], {
            shown: nX(m, s), rule: 'bin-normal',
            explain: `${ev()} = ${nn} × ${fr(p, q)} = ${m}, ${fn('V')}(${X}) = ${nn} × ${fr(p, q)} × ${fr(q - p, q)} = ${s * s}이고 ${V('n')} = ${jh(String(nn), '은/는')} 충분히 크므로 ${jh(X, '은/는')} 근사적으로 정규분포 ${jh(nX(m, s), '을/를')} 따른다.`,
            facts: { calc: [[`${nn}*${p}/${q}`, 0], [`${nn}*${p}/${q}*(${q}-${p})/${q}`, 1]] }
          });
      }
      // n 이 충분히 큰가(np ≥ 5, nq ≥ 5)
      const cands = [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 10], [2, 3], [3, 4], [4, 5], [9, 10], [1, 20], [19, 20]];
      const rows = [];
      for (let i = 0; i < 40 && rows.length < 4; i += 1) {
        const [p, q] = d.pick(cands), nn = q * d.int(1, 12), np = nn * p / q, nq = nn * (q - p) / q, ok = np >= 5 && nq >= 5;
        if (rows.some((r) => r.key === nn + '/' + p + '/' + q)) continue;
        const have = rows.filter((r) => r.ok).length;
        if (ok && have >= 1) continue;
        if (!ok && rows.length - have >= 3) continue;
        if (np === 5 || nq === 5) continue;
        rows.push({ key: nn + '/' + p + '/' + q, h: bin(nn, fr(p, q)), ok, np, nq, nn, p, q });
      }
      if (rows.length < 4 || rows.filter((r) => r.ok).length !== 1) return null;
      const good = rows.find((r) => r.ok);
      return oneQ(d, `다음 이항분포 가운데 ${jh(nb(ms('np >= 5')) + ', ' + nb(ms('nq >= 5')), '을/를')} 만족시켜 시행 횟수 ${jh(V('n'), '이/가')} 충분히 크다고 할 수 있는 것은? (단, ${nb(ms('q = 1 - p'))})`, rows, true, {
        rule: 'bin-large',
        explain: `${jh(good.h, '은/는')} ${ms('np')} = ${good.np}, ${ms('nq')} = ${jh(String(good.nq), '으로/로')} 둘 다 5 이상이다. 나머지는 ${ms('np')}, ${ms('nq')} 가운데 5보다 작은 것이 있다.`
      });
    }, { count: 2 }),

    T('bin-prob', '이항분포의 확률을 정규분포로 근사하여 구하기', '①28', (d, n) => {
      if (n === 0) {
        const r = d.pick(BN), [nn, , , m, s] = r, rg = binRange(d, s);
        if (!rg) return null;
        const [lo, hi] = rg, at = (k) => m + k * s / 10, body = lo == null ? 'X <= ' + at(hi) : hi == null ? 'X >= ' + at(lo) : at(lo) + ' <= X <= ' + at(hi);
        const v = zval(lo, hi);
        return probQ(d, `확률변수 ${jh(X, '이/가')} 이항분포 ${jh(binOf(r), '을/를')} 따를 때, ${jh(Pz(body), '을/를')} 다음 표준정규분포표를 이용하여 구한 것은?`, v, zexpr(lo, hi), [zp(lo || 0), zp(hi || 0)], {
          figure: tabOf(d, [lo || 0, hi || 0]), rule: 'bin-bare',
          explain: `${ev()} = ${m}, ${sdx()} = ${s}이고 ${V('n')} = ${jh(String(nn), '은/는')} 충분히 크므로 ${jh(X, '은/는')} 근사적으로 정규분포 ${jh(nX(m, s), '을/를')} 따른다. 따라서 ${Pz(body)} = ${Pz(lo == null ? 'Z <= ' + zt(hi) : hi == null ? 'Z >= ' + zt(lo) : zt(lo) + ' <= Z <= ' + zt(hi))} = ${zSteps(lo, hi)}이다.`
        });
      }
      const c = d.pick(LIFEB), pool = BN.filter((r) => r[1] === c.p[0] && r[2] === c.p[1]);
      if (!pool.length) return null;
      const r = d.pick(pool), [nn, , , m, s] = r, rg = binRange(d, s);
      if (!rg) return null;
      const [lo, hi] = rg, at = (k) => m + k * s / 10, u = c.cnt;
      const rangeT = lo == null ? `${at(hi)}${u} 이하` : hi == null ? `${at(lo)}${u} 이상` : `${at(lo)}${u} 이상 ${at(hi)}${u} 이하`;
      const body = lo == null ? 'X <= ' + at(hi) : hi == null ? 'X >= ' + at(lo) : at(lo) + ' <= X <= ' + at(hi), v = zval(lo, hi);
      return probQ(d, `${jh(c.say(nn), '이/가')} ${rangeT}일 확률을 다음 표준정규분포표를 이용하여 구한 것은?`, v, zexpr(lo, hi), [zp(lo || 0), zp(hi || 0)], {
        figure: tabOf(d, [lo || 0, hi || 0]), rule: 'bin-life',
        explain: `${jh(c.x, '을/를')} ${jh(X, '이라/라')} 하면 ${jh(X, '은/는')} 이항분포 ${jh(binOf(r), '을/를')} 따르고 ${ev()} = ${m}, ${sdx()} = ${s}이다. ${V('n')} = ${jh(String(nn), '은/는')} 충분히 크므로 ${jh(X, '은/는')} 근사적으로 ${jh(nX(m, s), '을/를')} 따른다. 따라서 ${Pz(body)} = ${zSteps(lo, hi)}이다.`
      });
    }, { count: 2 }),

    T('bin-back', '이항분포의 근사에서 확률로 경계 k 구하기', '①32', (d) => {
      const c = d.pick([LIFEB[0], LIFEB[1], LIFEB[3]]), pool = BN.filter((r) => r[1] === c.p[0] && r[2] === c.p[1] && fitKeys(r[4]).some((k) => k >= 10));
      if (!pool.length) return null;
      const r = d.pick(pool), [nn, p, q, m, s] = r, k = d.pick(fitKeys(s).filter((j) => j >= 10)), up = d.bool();
      const b = up ? m + k * s / 10 : m - k * s / 10, pv = 5000 - zp(k), body = up ? 'X >= k' : 'X <= k';
      return numQ(`${c.say(nn)}를 확률변수 ${jh(X, '이라/라')} 하자. ${jh(nb(Pz(body) + ' = ' + p4(pv)), '을/를')} 만족시키는 상수 ${V('k')}의 값을 다음 표준정규분포표를 이용하여 구하시오.`, b, {
        figure: tabOf(d, [k], 3),
        explain: `${jh(X, '은/는')} 이항분포 ${jh(binOf(r), '을/를')} 따르고 ${ev()} = ${m}, ${sdx()} = ${s}이므로 근사적으로 ${jh(nX(m, s), '을/를')} 따른다. ${Pz(body)} = ${Pz((up ? 'Z >= ' : 'Z <= ') + frac(ms('k - ' + m), s))} = ${p4(pv)}이고 표에서 ${P0(k)} = 0.5 ${MINUS} ${p4(pv)} = ${p4(zp(k))}이므로 ${frac(ms('k - ' + m), s)} = ${up ? '' : MINUS}${zt(k)}, ${ms('k = ' + b)}이다.`,
        value: `${nn}*${p}/${q}${up ? '+' : '-'}${zt(k)}*(${nn}*${p}/${q}*(${q}-${p})/${q})**0.5+${agree(k, pv)}`, derived: [p, q, 0.5, 1000]
      });
    })
  ]);

  function ev() { return nb(fn('E') + '(' + X + ')'); }
  function sdx() { return nb(Sv + '(' + X + ')'); }
})(typeof window !== 'undefined' ? window : globalThis);
